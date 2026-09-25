import type { Page } from "~/data/pages.server";
import type { RideTotals, Stages } from "~/data/stages.server";
import Hero from "./Hero";

type Props = {
    sections: Page["sections"];
    latestStages?: Stages;
    totals?: RideTotals;
}


export function Sections({ sections, latestStages = [], totals }: Props) {
  return sections?.map((s, i) => {
    switch (s?.__typename) {
      case "ComponentSectionsHero":         return <Hero key={i} {...s} totals={totals} />;
    //   case "ComponentSectionsRichText":     return <RichText key={i} {...s} />;
    //   case "ComponentSectionsLatestStages": return <LatestStages key={i} {...s} />;
    //   case "ComponentSectionsKitList":      return <KitList key={i} {...s} />;
      default:                              return null; // includes Strapi's `Error` member
    }
  });
}