import { getLocale } from "~/lib/i18n";
import type { SectionOf } from "~/data/pages.server";

type Props = SectionOf<"ComponentSectionsHero">;

export default function Hero({ heading, subheading, introduction }: Props) {
    return <h1>{heading}</h1>;
}