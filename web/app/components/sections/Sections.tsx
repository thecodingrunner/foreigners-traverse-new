import type { Page } from "~/data/pages.server";
import type { RideTotals, Stages } from "~/data/stages.server";
import Hero from "./Hero";
import FeaturedStages from "./LatestStages";
import ExploreCTA from "./ExploreCTA";

type Props = {
  sections: Page["sections"];
  latestStages?: Stages;
  featuredStages?: Stages;
  totals?: RideTotals;
};

export function Sections({
  sections,
  latestStages = [],
  featuredStages = [],
  totals,
}: Props) {
  return sections?.map((s, i) => {
    switch (s?.__typename) {
      case "ComponentSectionsHero":
        return <Hero key={s.__typename} {...s} totals={totals} />;
      case "ComponentSectionsExploreCta": 
        return <ExploreCTA key={s.__typename} {...s} />;
      case "ComponentSectionsFeaturedStages":
        return (
          <FeaturedStages
            key={s.__typename}
            latestStages={latestStages}
            featuredStages={featuredStages}
            totals={totals}
          />
        );
      default:
        return null; // includes Strapi's `Error` member
    }
  });
}
