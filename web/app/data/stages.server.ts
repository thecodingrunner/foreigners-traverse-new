import { strapi } from "~/lib/strapi.server";
import { StagesQuery } from "~/graphql/stages";
import type { Locale } from "~/lib/i18n";

export async function getStages(locale: Locale, limit: number) {
    const { stages } = await strapi.request(StagesQuery, { locale, sort: ["stageNumber:desc"], limit });
    return stages ?? [];
}

export type Stages = NonNullable<Awaited<ReturnType<typeof getStages>>>;