import { strapi } from "~/lib/strapi.server";
import { StagesQuery, RideTotalsQuery, StageQuery } from "~/graphql/stages";
import type { StageFiltersInput } from "~/gql/graphql";
import type { Locale } from "~/lib/i18n";

type StagesOptions = {
  limit?: number;
  sort?: string[];
  filters?: StageFiltersInput;
};

export async function getStages(
  locale: Locale,
  { limit = 100, sort = ["stageNumber:desc"], filters }: StagesOptions = {},
) {
  const { stages } = await strapi.request(StagesQuery, { locale, limit, sort, filters });
  return (stages ?? []).filter((s) => s != null);
}

export async function getLatestStage(locale: Locale) {
  const [latest] = await getStages(locale, { limit: 1 });
  return latest ?? null;
}

export async function getFeaturedStages(locale: Locale, limit = 3) {
  return getStages(locale, { limit: limit + 1, filters: { featured: { eq: true } } });
}

export async function getStage(slug: string, locale: Locale) {
  const { stages } = await strapi.request(StageQuery, { slug, locale });
  return stages[0] ?? null;
}

export async function getRideTotals() {
  const { stages } = await strapi.request(RideTotalsQuery);
  return stages.reduce(
    (totals, s) => ({
      distanceKm: totals.distanceKm + (s?.stats?.distanceKm ?? 0),
      elevationGainM: totals.elevationGainM + (s?.stats?.elevationGainM ?? 0),
      days: totals.days + (s ? 1 : 0),
    }),
    { distanceKm: 0, elevationGainM: 0, days: 0 },
  );
}

export type Stages = Awaited<ReturnType<typeof getStages>>;
export type StageSummary = Stages[number];
export type StageDetail = NonNullable<Awaited<ReturnType<typeof getStage>>>;
export type RideTotals = Awaited<ReturnType<typeof getRideTotals>>;