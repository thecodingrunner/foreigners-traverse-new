import type { Page } from "~/data/pages.server";
import type { RideTotals, StageSummary } from "~/data/stages.server";
import Hero from "./Hero";
import FeaturedStages from "./FeaturedStages";
import ExploreCTA from "./ExploreCTA";
import AboutHero from "./AboutHero";
import AboutBlocks from "./AboutBlocks";

type Props = {
  sections: Page["sections"];
  latestStage?: StageSummary;
  featuredStages?: StageSummary[];
  totals?: RideTotals;
};

export function Sections({
  sections,
  latestStage,
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
            latestStages={latestStage}
            featuredStages={featuredStages}
            totals={totals}
          />
        );
      case "ComponentSectionsAboutHero":
        return <AboutHero key={s.__typename} {...s} />;
      case "ComponentSectionsAboutBlocks":
        return <AboutBlocks key={s.__typename} {...s} />;
      default:
        return null; // includes Strapi's `Error` member
    }
  });
}
