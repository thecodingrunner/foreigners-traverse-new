import { useEffect, useMemo } from "react";
import {
  Color,
  NearestFilter,
  NoColorSpace,
  PlaneGeometry,
  Texture,
  Vector2,
  Vector4,
} from "three";
import type { TerrainMeta } from "./assets";
import type { SceneColors } from "./colors";
import { EXAGGERATION } from "./constants";
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
      uHeightmap: { value: texture },
      uBounds: { value: new Vector4(minX, minZ, width, depth) },
      uTexel: { value: new Vector2(1 / meta.width, 1 / meta.height) },
      uKmPerTexel: {
        value: new Vector2(width / meta.width, depth / meta.height),
      },
      uElevation: {
        value: new Vector2(meta.elevation.offsetM, meta.elevation.stepM),
      },
      uExaggeration: { value: EXAGGERATION },
      uLand: { value: new Color(colors.land) },
      uLandLit: { value: new Color(colors.landLit) },
      uGlow: { value: new Color(colors.glow) },
    }),
    [texture, meta, minX, minZ, width, depth, colors],
  );

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} frustumCulled={false}>
        <shaderMaterial
            vertexShader={terrainVertexShader}
            fragmentShader={terrainFragmentShader}
            uniforms={uniforms}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
        />
    </mesh>
  );
}
