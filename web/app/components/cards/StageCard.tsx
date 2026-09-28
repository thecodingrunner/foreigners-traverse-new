import { Link } from "react-router";
import type { StageSummary } from "~/data/stages.server";
import { formatDate, formatStageDay } from "~/lib/format";
import { useLocale } from "~/lib/i18n";

type StageCardProps = {
  stage: StageSummary;
};

export default function StageCard({ stage }: StageCardProps) {
  const locale = useLocale();

  return (
    <Link className="stage-card relative" to={`/journal/${stage.slug}`}>
      <div className="stage-card-cover">
        {stage?.coverImage?.url ? (
          <img src={stage?.coverImage?.url} />
        ) : (
          <div className="image-placeholder-large"></div>
        )}
      </div>

      <span className="text-uppercase absolute top-5 left-5 bg-secondary text-secondary-foreground text-label px-2.5 py-1.5">
        {formatStageDay(stage.stageNumber, locale)}
      </span>

      <div className="text-label-sm flex gap-2">
        <span>
          {formatDate(stage.date as string, locale, {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {stage?.startName && stage?.endName &&<p className="text-ui hidden md:block">
        <span>{stage?.startName}</span>
        <span className="text-accent"> → </span>
        <span>{stage?.endName}</span>
      </p>}

      <h3 className="text-h4 stage-card-title">{stage?.title}</h3>

      <div className="text-label gap-4.5 pt-3 border-t border-surface-2 hidden md:flex">
        {stage.stats?.distanceKm && <span>{stage.stats?.distanceKm} km</span>}
        {stage.stats?.elevationGainM && <span className="text-muted-foreground">↑ {stage.stats?.elevationGainM} m</span>}
      </div>

      <p className="text-ui text-ink-3">{stage?.excerpt}</p>
    </Link>
  );
}
