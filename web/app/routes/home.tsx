import type { Route } from "./+types/home";
import { getLocale } from "~/lib/i18n";
import { getPage } from "~/data/pages.server";
import { Sections } from "~/components/sections/Sections";
import { getStages } from "~/data/stages.server";

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const[page, latestStages] = await Promise.all([
    getPage("home", locale),
    getStages(locale, 3),
  ]);
  if (!page) throw new Response("Not Found", { status: 404 });
  return {page, latestStages, locale};
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { page, latestStages, locale } = loaderData;
  return <Sections sections={page.sections} latestStages={latestStages} />;
}
