import type { Route } from "./+types/home";
import { graphql } from "~/gql";
import { strapi } from "~/lib/strapi.server";
import { getLocale } from "~/lib/i18n";

const StageQuery = graphql(`
  query Stage($stageNumber: Int!, $locale: I18NLocaleCode) {
    stages(filters: { stageNumber: { eq: $stageNumber } }, locale: $locale) {
      documentId
      title
      slug
      stageNumber
    }
  }
`);

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const { stages } = await strapi.request(StageQuery, {
    stageNumber: 1,
    locale,
  });
  return { stage: stages[0] ?? null, locale };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.stage?.title ?? "No stage found"}</h1>;
}
