import { strapi } from "~/lib/strapi.server";
import { StagesQuery, RideTotalsQuery } from "~/graphql/stages";
import type { Locale } from "~/lib/i18n";

export async function getStages(locale: Locale, limit: number) {
    const { stages } = await strapi.request(StagesQuery, { locale, sort: ["stageNumber:desc"], limit });
    return stages ?? [];
}

export type Stages = NonNullable<Awaited<ReturnType<typeof getStages>>>;

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

export type RideTotals = Awaited<ReturnType<typeof getRideTotals>>;