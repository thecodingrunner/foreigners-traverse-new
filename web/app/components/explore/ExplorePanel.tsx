import { Link } from "react-router";
import type { ExploreStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { formatDate, formatNumber } from "~/lib/format";
import { localePath, useLocale } from "~/lib/i18n";
import { placeName } from "~/lib/places";

type ExplorePanelProps = { stage: ExploreStage; stageCount: number };
type StatItem = { label: string; value: string; accent?: boolean };

export default function ExplorePanel({ stage, stageCount }: ExplorePanelProps) {
  const locale = useLocale();
  const t = useT();
  const otherLocale = locale === "en" ? "ja" : "en";
  const { stats } = stage;

  const prefName = (p?: ExploreStage["prefectures"][number]) =>
    p ? (locale === "ja" ? p.nameJa : p.nameEn) : null;

  const places = [
    {
      kind: "start",
      name: placeName(stage, "start", locale),
      pref: prefName(stage.prefectures[0]),
    },
    {
      kind: "end",
      name: placeName(stage, "end", locale),
      pref: prefName(stage.prefectures.at(-1)),
    },
  ];

  const items = [
    stats?.distanceKm != null
      ? {
          label: t.explore.stats.distance,
          value: `${formatNumber(stats.distanceKm, locale)} km`,
        }
      : null,
    stats?.elevationGainM != null
      ? {
          label: t.explore.stats.elevationGain,
          value: `${formatNumber(stats.elevationGainM, locale)} m`,
        }
      : null,
    stats?.movingTimeMin != null
      ? {
          label: t.explore.stats.movingTime,
          value: `${formatNumber(stats.movingTimeMin, locale)} min`,
        }
      : null,
    {
      label: t.explore.stats.totalSoFar,
      value: `${formatNumber(stage.totalSoFarKm, locale)} km`,
      accent: true,
    },
  ].filter((item): item is StatItem => item !== null);

  return (
    <aside className="explore-panel" aria-label={t.explore.panelLabel}>
      <p className="text-label">
        <span className="text-accent">
          {t.explore.day(stage.stageNumber ?? 0)}
        </span>
        <span className="text-ink-3"> / {stageCount}</span>
      </p>
      {stage.date ? (
        <p className="text-label-sm mt-2 normal-case">
          {formatDate(String(stage.date), locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      ) : null}

      <ol className="explore-places">
        {places.map(({ kind, name, pref }) =>
          name ? (
            <li key={kind} data-kind={kind}>
              <p className="text-h4">{name.primary}</p>
              <p className="text-ui text-ink-3">
                {name.secondary && (
                  <span lang={otherLocale}>{name.secondary}</span>
                )}
                {name.secondary && pref && " · "}
                {pref}
              </p>
            </li>
          ) : null,
        )}
      </ol>

      <dl className="explore-stats">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-label-sm">{item.label}</dt>
            <dd
              className={`text-data text-h4 ${item.accent ? "text-accent" : ""}`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {stage.excerpt && <p className="text-body mt-6">{stage.excerpt}</p>}

      <Link
        to={localePath(`/journal/${stage.slug}`, locale)}
        className="link-text explore-read"
      >
        {t.explore.readEntry} →
      </Link>
    </aside>
  );
}
