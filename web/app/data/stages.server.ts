import { strapi } from "~/lib/strapi.server";
import { StagesQuery, RideTotalsQuery, StageQuery, AdjacentStagesQuery } from "~/graphql/stages";
import type { StageFiltersInput } from "~/gql/graphql";
import type { Locale } from "~/lib/i18n";

type StagesOptions = {
  page?: number;
  pageSize?: number;
  sort?: string[];
  filters?: StageFiltersInput;
};

export async function getStages(
  locale: Locale,
  {
    page = 1,
    pageSize = 100,
    sort = ["stageNumber:desc"],
    filters,
  }: StagesOptions = {},
) {
  const { stages_connection } = await strapi.request(StagesQuery, {
    locale,
    page,
    pageSize,
    sort,
    filters,
  });
  return {
    stages: (stages_connection?.nodes ?? []).filter((s) => s != null),
    pageInfo: stages_connection?.pageInfo ?? {
      page: 1,
      pageSize,
      pageCount: 0,
      total: 0,
    },
  };
}

export async function getLatestStage(locale: Locale) {
  const { stages } = await getStages(locale, { pageSize: 1 });
  return stages[0] ?? null;
}

export async function getFeaturedStages(locale: Locale, limit = 3) {
  const { stages } = await getStages(locale, {
    pageSize: limit + 1,
    filters: { featured: { eq: true } },
  });
  return stages;
}

export type RoutePreview = {
  distanceKm: number;
  line: [number, number][];     // [lon, lat]
  profile: [number, number][];  // [km, elevation m]
};

export async function getStage(slug: string, locale: Locale) {
  const { stages } = await strapi.request(StageQuery, { slug, locale });
  const stage = stages[0];
  if (!stage) return null;
  return { ...stage, routePreview: stage.routePreview as RoutePreview | null };
}

export async function getRideTotals() {
  const { stages } = await strapi.request(RideTotalsQuery);
  return stages.reduce(
    (totals, s) => ({
      distanceKm: totals.distanceKm + (s?.stats?.distanceKm ?? 0),
      elevationGainM: totals.elevationGainM + (s?.stats?.elevationGainM ?? 0),
      days: totals.days + (s ? 1 : 0),
      prefectures: totals.prefectures + (s?.prefectures?.length ?? 0),
    }),
    { distanceKm: 0, elevationGainM: 0, days: 0, prefectures: 0 },
  );
}

export async function getAdjacentStages(stageNumber: number, locale: Locale) {
  const { stages } = await strapi.request(AdjacentStagesQuery, {
    numbers: [stageNumber - 1, stageNumber + 1],
    locale,
  });
  return {
    prev: stages.find((s) => s?.stageNumber === stageNumber - 1) ?? null,
    next: stages.find((s) => s?.stageNumber === stageNumber + 1) ?? null,
  };
}

export type StagesResult = Awaited<ReturnType<typeof getStages>>;
export type StageSummary = StagesResult["stages"][number];
export type StageDetail = NonNullable<Awaited<ReturnType<typeof getStage>>>;
export type RideTotals = Awaited<ReturnType<typeof getRideTotals>>;
export type AdjacentStage = NonNullable<Awaited<ReturnType<typeof getAdjacentStages>>>;