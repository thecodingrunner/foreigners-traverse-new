import { useEffect, useMemo } from "react";
import {
  NearestFilter,
  NoColorSpace,
  PlaneGeometry,
  RGBAFormat,
  UniformsLib,
  UniformsUtils,
  UnsignedByteType,
  Vector2,
  Texture,
  Vector4,
} from "three";
import type { TerrainMeta } from "./assets";
import { toSRGB, toSRGBA, type SceneColors } from "./colors";
import { CONTOUR_STEP_M, EDGE_FADE, EXAGGERATION, HIGH_GROUND_M, SUN_DIRECTION } from "./constants";
import { terrainFragmentShader, terrainVertexShader } from "./terrainShader";

type Props = {
  meta: TerrainMeta;
  heightmap: HTMLImageElement;
  colors: SceneColors;
  segments: number;
};

export default function Terrain({ meta, heightmap, colors, segments }: Props) {
  const { minX, maxX, minZ, maxZ } = meta.scene;
  const width = maxX - minX;
  const depth = maxZ - minZ;

  // The heightmap is data, not a picture: no colour conversion, no blending
  const texture = useMemo(() => {
    const t = new Texture(heightmap);
    t.colorSpace = NoColorSpace;
    t.flipY = false;
    t.magFilter = NearestFilter;
    t.minFilter = NearestFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  }, [heightmap]);

  // A flat grid lying on the ground (x-z), centred on the terrain
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(
      width,
      depth,
      segments,
      Math.round((segments * depth) / width),
    );
    g.rotateX(-Math.PI / 2);
    g.translate((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
    return g;
  }, [width, depth, minX, maxX, minZ, maxZ, segments]);

  const uniforms = useMemo(
    () => ({
      // Custom shaders don't get fog for free: they need three's fog uniforms
      // (filled in by the renderer from scene.fog) plus the fog shader chunks.
      ...UniformsUtils.clone(UniformsLib.fog),

      uHeightmap: { value: texture },
      uSize: { value: new Vector2(meta.width, meta.height) },
      uElevation: { value: new Vector2(meta.elevation.offsetM, meta.elevation.stepM) },
      uBounds: { value: new Vector4(minX, minZ, width, depth) },
      uKmPerTexel: { value: new Vector2(width / meta.width, depth / meta.height) },
      uExaggeration: { value: EXAGGERATION },
      uSunDirection: { value: SUN_DIRECTION },
      uHighGroundM: { value: HIGH_GROUND_M },
      uContourStepM: { value: new Vector2(...CONTOUR_STEP_M) },
      uEdgeFade: { value: EDGE_FADE },

      uSea: { value: toSRGB(colors.sea) },
      uTerrainBase: { value: toSRGB(colors.terrainBase) },
      uTerrainHigh: { value: toSRGB(colors.terrainHigh) },
      uHillshadeLight: { value: toSRGB(colors.hillshadeLight) },
      uHillshadeShadow: { value: toSRGB(colors.hillshadeShadow) },
      uContourMinor: { value: toSRGBA(colors.contourMinor) },
      uContourMajor: { value: toSRGBA(colors.contourMajor) },
      uCoastline: { value: toSRGBA({ ...colors.coastline, alpha: 0.6 }) },
    }),
    [texture, meta, minX, minZ, width, depth, colors],
  );

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={0}>
        <shaderMaterial
            vertexShader={terrainVertexShader}
            fragmentShader={terrainFragmentShader}
            uniforms={uniforms}
            fog
            transparent
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
        />
    </mesh>
  );
}
