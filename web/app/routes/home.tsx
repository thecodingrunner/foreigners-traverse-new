import type { Route } from "./+types/home";
import { getLocale } from "~/lib/i18n";
import { getPage } from "~/data/pages.server";
import { Sections } from "~/components/sections/Sections";
import { getRideTotals, getStages } from "~/data/stages.server";

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const[page, latestStages, featuredStages, totals] = await Promise.all([
    getPage("home", locale),
    getStages(locale, { limit: 3 }),
    getStages(locale, { limit: 4, filters: { featured: { eq: true } } }),
    getRideTotals(),
  ]);
  if (!page) throw new Response("Not Found", { status: 404 });
  return {page, latestStages, featuredStages, totals, locale};
}


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { page, latestStages, featuredStages, totals, locale } = loaderData;
  return <Sections sections={page.sections} latestStages={latestStages} totals={totals} featuredStages={featuredStages} />;
}
