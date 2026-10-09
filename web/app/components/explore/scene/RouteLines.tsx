import { useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { AdditiveBlending, NotEqualStencilFunc, ReplaceStencilOp } from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { ExploreStage } from "~/data/stages.server";
import type { RouteData } from "./assets";
import type { SceneColors } from "./colors";
import { LINE_WIDTH, UNRIDDEN_DASH_PX } from "./constants";
import { PartialLine } from "./PartialLine";
import { pointAt, stageAt } from "./routeMath";
import { useOnPosition } from "./useOnPosition";
import { pixelsPerKm } from "./viewDistance";

type Props = {
  route: RouteData;
  stages: ExploreStage[];
  colors: SceneColors;
};

// Transparent objects are drawn in renderOrder: dashes, then the glow, then the core on top
const ORDER = { unridden: 1, halo: 2, ridden: 3 } as const;

export default function RouteLines({ route, stages, colors }: Props) {
  const size = useThree((state) => state.size);

  const materials = useMemo(
    () => ({
      unridden: new LineMaterial({
        color: colors.routeUnridden.color,
        opacity: colors.routeUnridden.alpha,
        linewidth: LINE_WIDTH.unridden,
        dashed: true,
        dashSize: UNRIDDEN_DASH_PX[0],
        gapSize: UNRIDDEN_DASH_PX[1],
        transparent: true,
        depthWrite: false,
        fog: true,
      }),
      // Additive: adds light to whatever is underneath, so it glows on dark terrain.
      // A line is drawn as one quad per segment, and neighbouring quads overlap
      // at every joint, so additive blending would add twice there (bright beads).
      // The stencil test lets each pixel take the glow only once per frame.
      halo: new LineMaterial({
        color: colors.routeRiddenHalo.color,
        opacity: 0.45,
        linewidth: LINE_WIDTH.halo,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        fog: true,
        stencilWrite: true,
        stencilRef: 1,
        stencilFunc: NotEqualStencilFunc, // only where nothing has glowed yet…
        stencilZPass: ReplaceStencilOp, // …then mark the pixel as done
      }),
      ridden: new LineMaterial({
        color: colors.routeRidden.color,
        linewidth: LINE_WIDTH.ridden,
        transparent: true,
        fog: true,
      }),
    }),
    [colors],
  );

  // Line widths are in pixels, so every material needs the canvas size
  useEffect(() => {
    Object.values(materials).forEach((m) =>
      m.resolution.set(size.width, size.height),
    );
  }, [materials, size]);

  // Dashes are measured along the line in km. Rescale them every frame so
  // they stay 2px / 7px on screen however far away the camera is.
  useFrame(({ camera, size }) => {
    materials.unridden.dashScale = pixelsPerKm(camera, size.height);
  });

  // One upcoming + one ridden line per stage, in the same order as `stages`
  const lines = useMemo(() => {
    const byNumber = new Map(route.stages.map((s) => [s.stageNumber, s]));
    return stages.map((stage) => {
      const routeStage = byNumber.get(stage.stageNumber ?? -1);
      if (!routeStage || routeStage.t.length < 2) return null; // no GPX for this stage yet
      const make = (key: keyof typeof materials) => {
        const line = new PartialLine(routeStage.positions, materials[key]);
        line.line.renderOrder = ORDER[key];
        return line;
      };
      return {
        routeStage,
        unridden: make("unridden"),
        ridden: [make("halo"), make("ridden")],
      };
    });
  }, [route, stages, materials]);

  useEffect(
    () => () =>
      lines.forEach((l) => {
        l?.unridden.dispose();
        l?.ridden.forEach((r) => r.dispose());
      }),
    [lines],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  // Ridden stages full, the current stage up to the playhead, later stages hidden.
  // Unridden dashes only where there's still road left to ride.
  useOnPosition(
    (position, count) => {
      const { index, fraction } = stageAt(position, count);
      lines.forEach((l, i) => {
        if (!l) return;
        const done = i < index || (i === index && fraction >= 1);
        const notStarted = i > index || fraction <= 0;

        if (done) l.unridden.hide();
        else l.unridden.showAll();

        const point = done || notStarted ? null : pointAt(l.routeStage, fraction);
        l.ridden.forEach((r) => (done ? r.showAll() : point ? r.showUpTo(point) : r.hide()));
      });
    },
    [lines],
  );


  return (
    <>
      {lines.map((l, i) =>
        l ? (
          <group key={i}>
            <primitive object={l.unridden.line} />
            {l.ridden.map((r, j) => (
              <primitive key={j} object={r.line} />
            ))}
          </group>
        ) : null,
      )}
    </>
  );
}
