import { Link } from "react-router";
import type { MapStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { formatDate, formatNumber } from "~/lib/format";
import { localePath, useLocale } from "~/lib/i18n";
import { placeName } from "~/lib/places";

type StagePopupCardProps = {
    stage: MapStage;
    variant?: "popup" | "inline";
};

export default function StagePopupCard({ stage, variant = "popup" }: StagePopupCardProps) {
  const locale = useLocale();
  const t = useT();
  const otherLocale = locale === "en" ? "ja" : "en";
  const start = placeName(stage, "start", locale);
  const end = placeName(stage, "end", locale);
  const cover = stage.coverImage?.url ?? null;
  const { stats } = stage;

  const meta = [
    stats?.distanceKm != null
      ? `${formatNumber(Math.round(stats.distanceKm), locale)} km`
      : null,
    stats?.elevationGainM != null
      ? `↑ ${formatNumber(stats.elevationGainM, locale)} m`
      : null,
  ].filter((m): m is string => m !== null);

  return (
    <article className="stage-popup-card" data-variant={variant}>
      {cover ? (
        <img
          src={cover}
          alt={stage.coverImage?.alternativeText ?? ""}
          className="stage-popup-cover"
        />
      ) : (
        <div
          className="stage-popup-cover image-placeholder-large"
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col gap-2 p-4">
        <p className="text-label-sm text-accent">
          {t.stage.day(stage.stageNumber ?? 0)}
          {stage.date
            ? ` · ${formatDate(String(stage.date), locale, { day: "numeric", month: "short" })}`
            : null}
        </p>

        {start && end && (
          <div>
            <p className="text-h5">
              {start.primary} <span className="text-accent">→</span>{" "}
              {end.primary}
            </p>
            {variant === "popup" && start.secondary && end.secondary && (
              <p lang={otherLocale} className="text-label-sm normal-case">
                {start.secondary} → {end.secondary}
              </p>
            )}
          </div>
        )}

        {variant === "popup" && stage.excerpt && (
          <p className="text-body line-clamp-3">{stage.excerpt}</p>
        )}

        <div className={`flex items-center justify-between ${variant === "inline" ? "flex-col items-start" : ""}`}>
          {meta.length > 0 && (
            <span className="text-label-sm">{meta.join(" · ")}</span>
          )}
          <Link
            to={localePath(`/journal/${stage.slug}`, locale)}
            className="link-text normal-case min-h-7 flex items-center"
          >
            {t.journalArchive.map.read} →
          </Link>
        </div>
      </div>
    </article>
  );
}
