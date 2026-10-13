// Everything that needs three.js lives under this file, which is loaded
// lazily: visitors who never open the explorer never download three.js.
import { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import type { ExploreStage } from "~/data/stages.server";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import type { ExploreAssets } from "./assets";
import { readSceneColors } from "./colors";
import { EXAGGERATION } from "./constants";
import Markers from "./Markers";
import RouteLines from "./RouteLines";
import Terrain from "./Terrain";
import SceneFog from "./SceneFog";
import { useT } from "~/lib/dictionary";
import { useExplore } from "~/stores/explore-context";
import CameraRig from "./CameraRig";
import { useSceneInsets } from "./useSceneInsets";
import AdaptiveResolution from "./AdaptiveResolution";

type Props = {
  assets: ExploreAssets;
  stages: ExploreStage[];
  onContextLost: () => void;
};

export default function ExploreScene({ assets, stages, onContextLost }: Props) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const colors = useMemo(readSceneColors, []);
  const labels = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const insets = useSceneInsets(container);
  const mode = useExplore((s) => s.mode);
  const t = useT();

  return (
    <div ref={container} className="explore-scene" role="img" aria-label={t.explore.sceneLabel}>
      <Canvas
        className="explore-canvas"
        frameloop="demand"
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, stencil: true }}
        camera={{ fov: 35, near: 5, far: 20000, manual: true }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            onContextLost();
          });
        }}
      >

        <CameraRig route={assets.route} stages={stages} insets={insets} />

        <AdaptiveResolution />

        <SceneFog color={colors.skyHorizon} />

        {/* Stretch the terrain and everything on it vertically, together */}
        <group scale={[1, EXAGGERATION, 1]}>
          <Terrain
            meta={assets.meta}
            heightmap={assets.heightmap}
            colors={colors}
            segments={isMobile ? 256 : 512}
          />
          <RouteLines route={assets.route} stages={stages} colors={colors} />
          <Markers
            route={assets.route}
            meta={assets.meta}
            stages={stages}
            labels={labels}
          />
        </group>
      </Canvas>

      {/* A fixed home for the HTML labels, on top of the canvas */}
      <div ref={labels} className="scene-labels" />

      {mode === "orbit" && <p className="scene-orbit-hint">{t.explore.orbitHint}</p>}
    </div>
  );
}
