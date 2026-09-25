import { useLocale, type Locale } from "~/lib/i18n";

const dictionary = {
  en: {
    header: {
      title: { main: "Foreigners Traverse", secondary: "外人縦断" },
      nav: {
        journal: "Journal",
        explore: "Explore 3D",
        about: "About",
      },
    },
    footer: {
      nav: {
        journal: "Journal",
        explore: "Explore 3D",
        github: "Github",
      },
      title: "Foreigners Traverse",
      subtitle: "Written on the road, 2026. Built with Next.js and Strapi.",
    },
    stats: { distance: "Distance", days: "Days", climb: "Climb" },
    latestStages: {
      title: "Latest entries",
      subtitle: "最新の記事",
      all: (n: number) => `All ${n} entries`,
    },
  },
  ja: {
    header: {
      title: { main: "外人縦断", secondary: "Foreigners Traverse" },
      nav: { journal: "縦断日誌", explore: "3Dで見る", about: "概要" },
    },
    footer: {
      nav: { journal: "縦断日誌", explore: "3Dで見る", github: "Github" },
      title: "外人縦断",
      subtitle: "旅の途中で書きました。2026年。Next.js と Strapi で制作。",
    },
    stats: { distance: "走行距離", days: "日数", climb: "獲得標高" },
    latestStages: {
      title: "最新の記事",
      subtitle: "Latest entries",
      all: (n: number) => `全${n}件の記事`,
    },
  },
} satisfies Record<Locale, unknown>;

export function useT() {
  return dictionary[useLocale()];
}
