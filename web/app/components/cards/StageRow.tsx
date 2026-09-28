import { Link } from "react-router";
import type { StageSummary } from "~/data/stages.server";
import { formatDate } from "~/lib/format";
import { useLocale, type Locale } from "~/lib/i18n";

type StageRowProps = {
  stage: StageSummary;
  locale: Locale;
};

export default function StageRow({ stage, locale }: StageRowProps) {
  return (
    <Link className="stage-row" to={`/journal/${stage.slug}`}>
      {stage.coverImage?.url ? (
        <img src={stage.coverImage?.url} />
      ) : (
        <div className="image-placeholder"></div>
      )}

      <div className="stage-info flex flex-col gap-2 items-start">
        <div className="text-label-sm flex gap-2">
          <span>Day {stage.stageNumber}</span>
          <span className="hidden md:block">
            · {formatDate(stage.date as string, locale, {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span>· {stage.stats?.distanceKm} km</span>
          <span className="hidden md:block">· {stage.stats?.elevationGainM} m</span>
        </div>

        <h3 className="text-h5">{stage.title}</h3>

        <p className="text-ui hidden md:block" >
          <span>{stage?.startName}</span>
          <span className=""> → </span>
          <span>{stage?.endName}</span>
        </p>
      </div>
    </Link>
  );
}
