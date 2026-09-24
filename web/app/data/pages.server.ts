import { strapi } from "~/lib/strapi.server";
import { PageQuery } from "~/graphql/pages";
import type { Locale } from "~/lib/i18n";

export async function getPage(slug: string, locale: Locale) {
    const { pages } = await strapi.request(PageQuery, { slug, locale });
    return pages[0] ?? null;
}

export type Page = NonNullable<Awaited<ReturnType<typeof getPage>>>;

export type Section = NonNullable<NonNullable<Page["sections"]>[number]>;
export type SectionOf<T extends Section["__typename"]> = Extract<Section, { __typename: T }>;