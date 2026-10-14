// The vertex shader only lifts the grid into shape. Everything you can see
// (sea, coastline, colour, hillshade, contours, fog) is worked out per
// pixel in the fragment shader, so it stays sharp however coarse the grid is.

/** Shared by both shaders: read the heightmap exactly as build-terrain.mjs wrote it. */
const decodeChunk = /* glsl */ `
  uniform sampler2D uHeightmap;
  uniform vec2 uSize;        // heightmap size in pixels
  uniform vec2 uElevation;   // offset (m), step (m)

  // One heightmap pixel → (height in metres, 1 for land / 0 for sea).
  // texelFetch reads an exact pixel: no filtering, no UV rounding surprises.
  vec2 texelHeight(ivec2 p) {
    p = clamp(p, ivec2(0), ivec2(uSize) - 1);
    vec3 c = texelFetch(uHeightmap, p, 0).rgb;
    float value = floor(c.r * 255.0 + 0.5) * 256.0 + floor(c.g * 255.0 + 0.5);
    float land = step(0.5, value); // value 0 is reserved for the sea
    return vec2(max(0.0, value * uElevation.y - uElevation.x) * land, land);
  }

  // Bilinear sample, done by hand. The GPU can't filter this texture for us:
  // blending the high and low bytes separately gives nonsense at every
  // byte boundary (e.g. 255 → 256 would average to 0.5 + 127.5).
  vec2 sampleTerrain(vec2 uv) {
    vec2 p = uv * uSize - 0.5;
    ivec2 i = ivec2(floor(p));
    vec2 f = p - floor(p);
    vec2 a = texelHeight(i);
    vec2 b = texelHeight(i + ivec2(1, 0));
    vec2 c = texelHeight(i + ivec2(0, 1));
    vec2 d = texelHeight(i + ivec2(1, 1));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
`;

export const terrainVertexShader = /* glsl */ `
  ${decodeChunk}
  uniform vec4 uBounds; // minX, minZ, width, depth (km)

  varying vec2 vUv;
  #include <fog_pars_vertex>

  void main() {
    // Where this vertex sits on the heightmap (row 0 = north = minZ)
    vUv = (position.xz - uBounds.xy) / uBounds.zw;

    float heightKm = sampleTerrain(vUv).x / 1000.0;
    vec4 mvPosition = modelViewMatrix * vec4(position.x, heightKm, position.z, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
  }
`;

export const terrainFragmentShader = /* glsl */ `
  ${decodeChunk}
  uniform vec2 uKmPerTexel;
  uniform float uExaggeration;
  uniform vec3 uSunDirection;
  uniform float uHighGroundM;
  uniform vec2 uContourStepM;   // minor, major
  uniform float uEdgeFade;

  // Colours arrive sRGB-encoded (see Terrain.tsx) so the design's
  // "18% white over dark grey" blends look the same as they do in CSS
  uniform vec3 uSea;
  uniform vec3 uTerrainBase;
  uniform vec3 uTerrainHigh;
  uniform vec3 uHillshadeLight;
  uniform vec3 uHillshadeShadow;
  uniform vec4 uContourMinor;   // rgb + alpha
  uniform vec4 uContourMajor;
  uniform vec4 uCoastline;

  varying vec2 vUv;
  #include <fog_pars_fragment>

  // A line every interval metres, widthPx wide on screen, antialiased.
  // fwidth(x) = how much x changes across one screen pixel, so dividing by
  // it turns "distance to the nearest line" into pixels.
  float isoline(float heightM, float interval, float widthPx) {
    float x = heightM / interval;
    float perPixel = fwidth(x);
    float distancePx = abs(fract(x - 0.5) - 0.5) / perPixel;
    float line = 1.0 - smoothstep(widthPx * 0.5, widthPx * 0.5 + 1.0, distancePx);
    // When lines would be closer than ~4px apart they turn into grey mush: fade them out
    return line * (1.0 - smoothstep(0.12, 0.3, perPixel)) * step(interval * 0.5, heightM);
  }

  // From the design tokens: soft-light 18%, multiply 55%
  const float LIGHT_STRENGTH = 0.18;
  const float SHADOW_STRENGTH = 0.55;

  // Pegtop soft light: brightens or darkens gently without blowing out
  vec3 softLight(vec3 base, vec3 blend) {
    return (1.0 - 2.0 * blend) * base * base + 2.0 * base * blend;
  }

  void main() {
    vec2 here = sampleTerrain(vUv);
    float heightM = here.x;
    float coverage = here.y; // 0 = sea, 1 = land, in between at the coast

    // ---- Land or sea, with an antialiased edge
    float aa = fwidth(coverage);
    float land = smoothstep(0.5 - aa, 0.5 + aa, coverage);

    // ---- Surface normal from the slope either side (heights in km, exaggerated)
    vec2 texel = 1.0 / uSize;
    float hl = sampleTerrain(vUv - vec2(texel.x, 0.0)).x;
    float hr = sampleTerrain(vUv + vec2(texel.x, 0.0)).x;
    float hn = sampleTerrain(vUv - vec2(0.0, texel.y)).x;
    float hs = sampleTerrain(vUv + vec2(0.0, texel.y)).x;
    vec3 normal = normalize(vec3(
      (hl - hr) * 0.001 * uExaggeration / (2.0 * uKmPerTexel.x),
      1.0,
      (hn - hs) * 0.001 * uExaggeration / (2.0 * uKmPerTexel.y)
    ));

    // ---- Hillshade relative to flat ground: slopes facing the sun get
    // lighter, slopes facing away get darker, flat land stays the albedo.
    float facing = dot(normal, uSunDirection) - uSunDirection.y;
    float lit = clamp(facing / (1.0 - uSunDirection.y), 0.0, 1.0);
    float shade = clamp(-facing / uSunDirection.y, 0.0, 1.0);

    vec3 albedo = mix(uTerrainBase, uTerrainHigh, smoothstep(0.0, uHighGroundM, heightM));
    vec3 color = mix(albedo, softLight(albedo, uHillshadeLight), lit * LIGHT_STRENGTH);
    color = mix(color, color * uHillshadeShadow, shade * SHADOW_STRENGTH);

    // ---- Contours: minor every 100 m, major every 500 m
    color = mix(color, uContourMinor.rgb, isoline(heightM, uContourStepM.x, 0.5) * uContourMinor.a);
    color = mix(color, uContourMajor.rgb, isoline(heightM, uContourStepM.y, 1.0) * uContourMajor.a);

    // ---- Sea, then the coastline where coverage crosses 0.5, 1px wide
    color = mix(uSea, color, land);
    float coast = 1.0 - smoothstep(0.5, 1.5, abs(coverage - 0.5) / max(aa, 1e-4));
    color = mix(color, uCoastline.rgb, coast * uCoastline.a);

    // ---- Fade the rectangle's edges into the CSS sky behind the canvas
    vec2 edge = min(vUv, 1.0 - vUv);
    float alpha = smoothstep(0.0, uEdgeFade, min(edge.x, edge.y));

    // All the mixing above happened in sRGB, the way CSS blends. Convert to
    // linear for three.js, which converts back for the screen at the end.
    gl_FragColor = vec4(sRGBTransferEOTF(vec4(color, 1.0)).rgb, alpha);
    #include <fog_fragment>
    #include <colorspace_fragment>
  }
`;