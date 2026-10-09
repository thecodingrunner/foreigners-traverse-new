import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { ExploreStage } from "~/data/stages.server";
import type { RouteData } from "./assets";
import type { SceneColors } from "./colors";
import { PartialLine } from "./PartialLine";
import { pointAt, stageAt } from "./routeMath";
import { useOnPosition } from "./useOnPosition";

type Props = {
  route: RouteData;
  stages: ExploreStage[];
  colors: SceneColors;
};

export default function RouteLines({ route, stages, colors }: Props) {
  const size = useThree((state) => state.size);

  const materials = useMemo(
    () => ({
      upcoming: new LineMaterial({
        color: colors.unridden,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.45,
      }),
      ridden: new LineMaterial({ color: colors.ridden, linewidth: 3 }),
    }),
    [colors],
  );

  // Line widths are in pixels, so the material needs the canvas size
  useEffect(() => {
    materials.upcoming.resolution.set(size.width, size.height);
    materials.ridden.resolution.set(size.width, size.height);
  }, [size, materials]);

  // One upcoming + one ridden line per stage, in the same order as `stages`
  const lines = useMemo(() => {
    const byNumber = new Map(route.stages.map((s) => [s.stageNumber, s]));
    return stages.map((stage) => {
      const routeStage = byNumber.get(stage.stageNumber ?? -1);
      if (!routeStage || routeStage.t.length < 2) return null; // no GPX for this stage yet
      const ridden = new PartialLine(routeStage.positions, materials.ridden);
      ridden.line.renderOrder = 1; // draw on top of the upcoming line
      return {
        routeStage,
        upcoming: new PartialLine(routeStage.positions, materials.upcoming),
        ridden,
      };
    });
  }, [route, stages, materials]);

  useEffect(
    () => () =>
      lines.forEach((l) => {
        l?.upcoming.dispose();
        l?.ridden.dispose();
      }),
    [lines],
  );
  useEffect(
    () => () => {
      materials.upcoming.dispose();
      materials.ridden.dispose();
    },
    [materials],
  );

  // Ridden stages full, the current stage up to the playhead, later stages hidden
  useOnPosition(
    (position, count) => {
      const { index, fraction } = stageAt(position, count);
      lines.forEach((l, i) => {
        if (!l) return;
        if (i < index || (i === index && fraction >= 1)) l.ridden.showAll();
        else if (i > index || fraction <= 0) l.ridden.hide();
        else l.ridden.showUpTo(pointAt(l.routeStage, fraction));
      });
    },
    [lines],
  );

  return (
    <>
      {lines.map((l, i) =>
        l ? (
          <group key={i}>
            <primitive object={l.upcoming.line} />
            <primitive object={l.ridden.line} />
          </group>
        ) : null,
      )}
    </>
  );
}
