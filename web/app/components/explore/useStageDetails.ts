import type { ExploreStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { formatDate, formatNumber } from "~/lib/format";
import { localePath, useLocale } from "~/lib/i18n";
import { placeName } from "~/lib/places";

export type StageStat = {
  key: "distance" | "elevation" | "time" | "total";
  label: string;
  value: string;
};

/**
 * What the panel and the mobile sheet both show about a stage, formatted
 * for the current locale. Each layout picks the pieces it has room for.
 */
export function useStageDetails(stage: ExploreStage) {
  const locale = useLocale();
  const t = useT();
  const { stats } = stage;

  const prefName = (p?: ExploreStage["prefectures"][number]) =>
    p ? (locale === "ja" ? p.nameJa : p.nameEn) : null;

  const places = [
    {
      kind: "start" as const,
      name: placeName(stage, "start", locale),
      pref: prefName(stage.prefectures[0]),
    },
    {
      kind: "end" as const,
      name: placeName(stage, "end", locale),
      pref: prefName(stage.prefectures.at(-1)),
    },
  ];

  const statsList = [
    stats?.distanceKm != null
      ? {
          key: "distance",
          label: t.explore.stats.distance,
          value: `${formatNumber(stats.distanceKm, locale)} km`,
        }
      : null,
    stats?.elevationGainM != null
      ? {
          key: "elevation",
          label: t.explore.stats.elevationGain,
          value: `${formatNumber(stats.elevationGainM, locale)} m`,
        }
      : null,
    stats?.movingTimeMin != null
      ? {
          key: "time",
          label: t.explore.stats.movingTime,
          value: `${formatNumber(stats.movingTimeMin, locale)} min`,
        }
      : null,
    {
      key: "total",
      label: t.explore.stats.totalSoFar,
      value: `${formatNumber(stage.totalSoFarKm, locale)} km`,
    },
  ].filter((item): item is StageStat => item !== null);

  const date = stage.date
    ? {
        long: formatDate(String(stage.date), locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        short: formatDate(String(stage.date), locale, {
          day: "numeric",
          month: "short",
        }),
      }
    : null;

  return {
    locale,
    otherLocale: locale === "en" ? ("ja" as const) : ("en" as const),
    dayLabel: t.explore.day(stage.stageNumber ?? 0),
    date,
    places,
    stats: statsList,
    readHref: localePath(`/journal/${stage.slug}`, locale),
  };
}
