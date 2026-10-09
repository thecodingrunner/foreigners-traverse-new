import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import type { ExploreStage } from "~/data/stages.server";
import { useLocale } from "~/lib/i18n";
import { indexAt } from "~/lib/explore";
import { useExplore, useExploreApi } from "~/stores/explore-context";
import type { RouteData, TerrainMeta } from "./assets";
import { pointAt, stageAt } from "./routeMath";
import { useOnPosition } from "./useOnPosition";

const CITIES = [
  { en: "Fukuoka", ja: "福岡", lon: 130.4, lat: 33.59 },
  { en: "Hiroshima", ja: "広島", lon: 132.46, lat: 34.39 },
  { en: "Osaka", ja: "大阪", lon: 135.5, lat: 34.69 },
  { en: "Tokyo", ja: "東京", lon: 139.69, lat: 35.69 },
  { en: "Sendai", ja: "仙台", lon: 140.87, lat: 38.27 },
  { en: "Aomori", ja: "青森", lon: 140.74, lat: 40.82 },
] as const;

const LABEL_HEIGHT_KM = 0.3;
const HTML_Z: [number, number] = [2, 0];

/** Three numbers from a flat [x, y, z, x, y, z, …] array */
const toVector = (flat: number[], i: number): [number, number, number] => [
  flat[i],
  flat[i + 1],
  flat[i + 2],
];

type Props = {
  route: RouteData;
  meta: TerrainMeta;
  stages: ExploreStage[];
  labels: RefObject<HTMLDivElement | null>;
};

export default function Markers({ route, meta, stages, labels }: Props) {
  // drei's types predate React 19's nullable refs, hence the cast
  const html = {
    portal: labels as RefObject<HTMLElement>,
    zIndexRange: HTML_Z,
  };
  const locale = useLocale();
  const api = useExploreApi();
  const current = useExplore((s) => indexAt(s.position, s.count));

  const byNumber = useMemo(
    () => new Map(route.stages.map((s) => [s.stageNumber, s])),
    [route],
  );
  const routeStages = useMemo(
    () => stages.map((s) => byNumber.get(s.stageNumber ?? -1) ?? null),
    [stages, byNumber],
  );

  /** Last point of each stage that has a route */
  const ends = useMemo(
    () =>
      routeStages.flatMap((rs, index) => {
        if (!rs) return [];
        const p = rs.positions;
        return [{ index, position: toVector(p, p.length - 3) }];
      }),
    [routeStages],
  );

  const drawn = routeStages.filter((rs) => rs !== null);
  const start = drawn.length ? toVector(drawn[0].positions, 0) : null;
  const finish = drawn.length
    ? toVector(drawn.at(-1)!.positions, drawn.at(-1)!.positions.length - 3)
    : null;

  const cities = useMemo(() => {
    const { lon0, lat0, kx, kz } = meta.projection;
    return CITIES.map((c) => ({
      ...c,
      x: (c.lon - lon0) * kx,
      z: -(c.lat - lat0) * kz,
    }));
  }, [meta]);

  // The rider: moved directly on every playhead change, no React re-render
  const rider = useRef<Group>(null);
  const riderLabel = useRef<HTMLDivElement>(null);
  useOnPosition(
    (position, count) => {
      const { index, fraction } = stageAt(position, count);
      const rs = routeStages[index];
      if (riderLabel.current)
        riderLabel.current.style.display = rs ? "" : "none";
      if (!rs || !rider.current) return;
      const p = pointAt(rs, fraction);
      rider.current.position.set(p.x, p.y, p.z);
    },
    [routeStages],
  );

  return (
    <>
      {ends.map(({ index, position }) => (
        <Html key={index} position={position} center {...html}>
          <button
            type="button"
            className="scene-stage-end"
            data-state={
              index < current
                ? "ridden"
                : index === current
                  ? "current"
                  : "upcoming"
            }
            onClick={() => api.getState().selectIndex(index)}
            tabIndex={-1}
            aria-hidden="true"
          />
        </Html>
      ))}

      {start && (
        <Html position={start} center {...html}>
          <span className="scene-square" aria-hidden="true" />
        </Html>
      )}
      {finish && (
        <Html position={finish} center {...html}>
          <span className="scene-square" aria-hidden="true" />
        </Html>
      )}

      {cities.map((c) => (
        <Html
          key={c.en}
          position={[c.x, LABEL_HEIGHT_KM, c.z]}
          center
          {...html}
        >
          <span className="scene-city" aria-hidden="true">
            {c[locale]}
          </span>
        </Html>
      ))}

      <group ref={rider}>
        <Html ref={riderLabel} center {...html}>
          <span className="scene-rider" aria-hidden="true" />
        </Html>
      </group>
    </>
  );
}
