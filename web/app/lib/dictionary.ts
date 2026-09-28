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
    exploreCta: {
      label: "Route Explorer",
      title: "Ride it again in 3D",
      subtitle: "Scrub through all 42 days over the terrain of Japan, stage by stage.",
      buttonPrimary: "Open the explorer",
      buttonSecondary: "or use the 2D map",
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
      subtitle: "Featured entries",
      all: (n: number) => `全${n}件の記事`,
    },
    exploreCta: {
      label: "ルートエクスプローラー",
      title: "もう一度、3Dで走る",
      subtitle: "日本の地形の上で、42日間をステージごとにたどれます。",
      buttonPrimary: "エクスプローラーを開く",
      buttonSecondary: "2D地図で見る",
    },
  },
} satisfies Record<Locale, unknown>;

export function useT() {
  return dictionary[useLocale()];
}
