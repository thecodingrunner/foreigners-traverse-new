import { Link } from "react-router";
import type { StageSummary } from "~/data/stages.server";
import { formatDate, formatNumber, formatStageDay } from "~/lib/format";
import { useLocale } from "~/lib/i18n";

type FeaturedStageCardProps = {
  stage: StageSummary;
};

export default function FeaturedStageCard({ stage }: FeaturedStageCardProps) {
  const locale = useLocale();

  const { stats, coverImage } = stage;

  const meta = [
    stage.date &&
      formatDate(stage.date as string, locale, {
        day: "numeric",
        month: "long",
      }),
    stats?.distanceKm != null && `${formatNumber(stats.distanceKm, locale)} km`,
    stats?.elevationGainM != null &&
      `↑ ${formatNumber(stats.elevationGainM, locale)} m`,
  ].filter(Boolean);

  return (
    <Link className="stage-card relative" to={`/journal/${stage.slug}`}>
      <div className="stage-card-cover">
        {coverImage?.url ? (
          <img
            src={coverImage?.url}
            alt={coverImage?.alternativeText ?? ""}
            width={coverImage?.width ?? undefined}
            height={coverImage?.height ?? undefined}
          />
        ) : (
          <div className="image-placeholder-large" aria-hidden="true"></div>
        )}
      </div>

      {stage.stageNumber != null && (
        <span className="text-uppercase absolute top-5 left-5 bg-secondary text-secondary-foreground text-label px-2.5 py-1.5">
          {formatStageDay(stage.stageNumber, locale)}
        </span>
      )}

      {meta.length > 0 && <p className="text-label-sm">{meta.join(" · ")}</p>}

      {(stage.startName || stage.endName) && (
        <p className="text-ui hidden md:block">
          {stage.startName}
          <span className="text-accent"> → </span>
          {stage.endName}
        </p>
      )}

      <h3 className="text-h4 stage-card-title">{stage?.title}</h3>

      {stage.excerpt && <p className="text-ui text-ink-3">{stage.excerpt}</p>}
    </Link>
  );
}
