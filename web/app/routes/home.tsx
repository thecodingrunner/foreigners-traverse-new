import type { Route } from "./+types/home";
import { getLocale } from "~/lib/i18n";
import { getPage } from "~/data/pages.server";
import { Sections } from "~/components/sections/Sections";
import { getFeaturedStages, getLatestStage, getRideTotals } from "~/data/stages.server";

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const[page, latestStage, featuredStages, totals] = await Promise.all([
    getPage("home", locale),
    getLatestStage(locale),
    getFeaturedStages(locale, 4),
    getRideTotals(),
  ]);
  if (!page) throw new Response("Not Found", { status: 404 });
  return {page, latestStage, featuredStages, totals, locale};
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData?.page.seo?.metaTitle ?? loaderData?.page.title ?? "Foreigners Traverse" },
    { name: "description", content: loaderData?.page.seo?.metaDescription ?? "" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { page, latestStage, featuredStages, totals, locale } = loaderData;
  return <Sections sections={page.sections} latestStage={latestStage} totals={totals} featuredStages={featuredStages} />;
}
