export const terrainVertexShader = /* glsl */ `
  uniform sampler2D uHeightmap;
  uniform vec4 uBounds;       // minX, minZ, width, depth (km)
  uniform vec2 uTexel;        // size of one heightmap pixel, in UV units
  uniform vec2 uKmPerTexel;   // size of one heightmap pixel, in km
  uniform vec2 uElevation;    // offset (m), step (m)
  uniform float uExaggeration;

  varying vec2 vUv;
  varying float vLand;
  varying float vShade;

  // Undo the encoding from build-terrain.mjs. Returns -1.0 for the sea.
  float heightKm(vec2 uv) {
    vec3 c = texture2D(uHeightmap, uv).rgb;
    float value = floor(c.r * 255.0 + 0.5) * 256.0 + floor(c.g * 255.0 + 0.5);
    if (value < 0.5) return -1.0;
    return max(0.0, value * uElevation.y - uElevation.x) / 1000.0;
  }

  void main() {
    // Where this vertex sits on the heightmap (row 0 = north = minZ)
    vUv = (position.xz - uBounds.xy) / uBounds.zw;

    float h = heightKm(vUv);
    vLand = h < 0.0 ? 0.0 : 1.0;

    // Surface slope from the four neighbouring pixels → a normal → simple lighting
    float hl = max(heightKm(vUv - vec2(uTexel.x, 0.0)), 0.0);
    float hr = max(heightKm(vUv + vec2(uTexel.x, 0.0)), 0.0);
    float hn = max(heightKm(vUv - vec2(0.0, uTexel.y)), 0.0);
    float hs = max(heightKm(vUv + vec2(0.0, uTexel.y)), 0.0);
    vec3 normal = normalize(vec3(
      (hl - hr) * uExaggeration / (2.0 * uKmPerTexel.x),
      1.0,
      (hn - hs) * uExaggeration / (2.0 * uKmPerTexel.y)
    ));
    vec3 light = normalize(vec3(-0.6, 0.8, -0.4)); // from the north-west, above
    vShade = clamp(dot(normal, light), 0.0, 1.0);

    vec3 displaced = vec3(position.x, max(h, 0.0), position.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const terrainFragmentShader = /* glsl */ `
  uniform sampler2D uHeightmap;
  uniform vec3 uLand;
  uniform vec3 uLandLit;
  uniform vec3 uGlow;

  varying vec2 vUv;
  varying float vLand;
  varying float vShade;

  void main() {
    if (vLand < 0.5) discard; // the sea: let the CSS sky show through

    float distanceToRoute = texture2D(uHeightmap, vUv).b; // 0 on the route → 1 at 80 km+
    vec3 color = mix(uLand, uLandLit, vShade * vShade);
    color = mix(color, uGlow, (1.0 - smoothstep(0.0, 0.35, distanceToRoute)) * 0.35);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;