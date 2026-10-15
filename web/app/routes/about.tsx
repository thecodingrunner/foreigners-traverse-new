import type { Route } from "./+types/home";
import { getLocale } from "~/lib/i18n";
import { getPage } from "~/data/pages.server";
import { Sections } from "~/components/sections/Sections";

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const[page] = await Promise.all([
    getPage("about", locale),
  ]);
  if (!page) throw new Response("Not Found", { status: 404 });
  return {page, locale};
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData?.page.seo?.metaTitle ?? loaderData?.page.title ?? "Foreigners Traverse" },
    { name: "description", content: loaderData?.page.seo?.metaDescription ?? "" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { page, locale } = loaderData;
  return <Sections sections={page.sections} />;
}
