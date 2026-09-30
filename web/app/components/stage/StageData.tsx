import { useEffect } from "react";
import { Link } from "react-router";
import type { RideTotals, StageDetail } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { formatDate, formatStartEnd } from "~/lib/format";
import { useLocale } from "~/lib/i18n";

type StageDataProps = {
  stage: StageDetail;
  totals: RideTotals;
};

type DataItem = { label: string; value: string; className?: string };

export default function StageData({ stage, totals }: StageDataProps) {
  const t = useT();
  const locale = useLocale();
  
  const meta = [
    stage.date != null
      ? {
          label: t.stage.data.date,
          value: formatDate(stage.date as string, locale, {
            day: "numeric",
            month: "long",
          }),
          className: "hidden md:flex",
        }
      : null,
    stage.startName != null && stage.endName != null
      ? {
          label: t.stage.data.route,
          value: formatStartEnd(
            stage.startName as string,
            stage.endName as string,
          ),
          className: "hidden md:flex",
        }
      : null,
    stage.stats?.distanceKm != null
      ? {
          label: t.stage.data.distance,
          value: `${stage.stats?.distanceKm} km`,
        }
      : null,
    stage.stats?.elevationGainM != null
      ? {
          label: t.stage.data.elevation,
          value: `${stage.stats?.elevationGainM} m`,
        }
      : null,
    stage.stats?.movingTimeMin != null
      ? {
          label: t.stage.data.movingTime,
          value: `${stage.stats?.movingTimeMin} min`,
        }
      : null,
    totals.distanceKm != null
      ? {
          label: t.stage.data.totalSoFar,
          value: `${totals.distanceKm} km`,
        }
      : null,
  ].filter((item): item is DataItem => item !== null);

  return (
    <div className="stage-data-container">
      {meta.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col py-4.5 gap-1.5 items-start justify-center ${item.className}`}
        >
          <span className="text-label-sm">{item.label}</span>
          <span className="text-lg text-data">{item.value}</span>
        </div>
      ))}
      <div className="items-center lg:pl-3 hidden md:flex w-auto flex-1">
        <Link className="btn-primary" to={`/journal?view=explore`}>
          {t.stage.data.explore}
        </Link>
      </div>
    </div>
  );
}
