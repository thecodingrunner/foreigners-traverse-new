import { Link } from "react-router";
import type { StageSummary } from "~/data/stages.server";
import { formatDate } from "~/lib/format";
import { useLocale } from "~/lib/i18n";

type StageRowProps = {
  stage: StageSummary;
};

export default function StageCard({ stage }: StageRowProps) {
  const locale = useLocale();

  return (
    <Link className="stage-card" to={`/journal/${stage.slug}`}>
      <div className="stage-card-cover">
        {stage?.coverImage?.url ? (
          <img src={stage?.coverImage?.url} />
        ) : (
          <div className="image-placeholder-large"></div>
        )}
      </div>

      <p className="text-label-sm normal-case">
        {stage?.date
          ? formatDate(stage?.date as string, locale, { day: "numeric", month: "long" })
          : ""}
      </p>

      <p className="text-ui">
        <span>{stage?.startName}</span>
        <span className="text-accent"> → </span>
        <span>{stage?.endName}</span>
      </p>

      <h3 className="text-h4 stage-card-title">{stage?.title}</h3>

      <div className="text-label-sm flex gap-2 pt-3 border-t border-surface-2">
        <span>{stage.stats?.distanceKm}</span>
        <span>↑ {stage.stats?.elevationGainM} m</span>
      </div>

      <p className="text-ui text-ink-3">{stage?.excerpt}</p>
    </Link>
  );
}
