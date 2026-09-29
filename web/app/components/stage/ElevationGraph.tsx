import type { RoutePreview } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { formatNumber } from "~/lib/format";
import { useLocale } from "~/lib/i18n";

const W = 300;
const H = 80;

type ElevationGraphProps = {
  profile: RoutePreview["profile"];
  distanceKm: number;
  displayLabels?: boolean;
};


export default function ElevationGraph({
  profile,
  distanceKm,
  displayLabels = true,
}: ElevationGraphProps) {
  const t = useT();
  const locale = useLocale();

  const elevations = profile.map(([, ele]) => ele);
  const min = Math.min(...elevations);
  const max = Math.max(...elevations);
  const pad = (max - min) * 0.1 || 1;

  const x = (km: number) => (km / distanceKm) * W;
  const y = (ele: number) =>
    ((ele - (min - pad)) / (max + pad - (min - pad))) * H;

  const line = profile
    .map(([km, ele], i) => `${i ? "L" : "M"}${x(km)},${y(ele)}`)
    .join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="mt-6 h-32 w-full text-accent"
        role="img"
        aria-label={t.stage.elevationLabel(distanceKm, max)}
      >
        <path d={area} fill="currentColor" opacity={0.12} />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {displayLabels && <div className="mt-3 flex justify-between text-label text-muted-foreground">
        <span>0 km</span>
        <span>{formatNumber(Math.round(distanceKm), locale)} km</span>
      </div>}
    </div>
  );
}
