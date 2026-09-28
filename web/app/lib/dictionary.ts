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
      subtitle:
        "Scrub through all 42 days over the terrain of Japan, stage by stage.",
      buttonPrimary: "Open the explorer",
      buttonSecondary: "or use the 2D map",
    },
    journalArchive: {
      title: "Journal Archive",
      subtitle: (n: number, p: number) =>
        `${n} entries, ${p} prefectures, one long road. 旅の記録`,
      regions: {
        kyushu: "Kyushu",
        chugoku: "Chūgoku",
        shikoku: "Shikoku",
        kinki: "Kansai",
        chubu: "Chūbu",
        kanto: "Kantō",
        tohoku: "Tōhoku",
      },
      all: "All",
      viewToggle: {
        grid: "Grid",
        map: "Map",
        explore: "3D",
      },
      pagination: {
        previous: "Prev",
        next: "Next",
      },
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
    journalArchive: {
      title: "旅の記録",
      subtitle: (n: number, p: number) =>
        `全${n}記事、${p}都道府県、一本の長い道。The journal`,
      regions: {
        kyushu: "九州",
        chugoku: "中国",
        shikoku: "四国",
        kinki: "近畿",
        chubu: "中部",
        kanto: "関東",
        tohoku: "東北",
      },
      all: "すべて",
      viewToggle: {
        grid: "グリッド",
        map: "地図",
        explore: "3D",
      },
      pagination: {
        previous: "前へ",
        next: "次へ",
      },
    },
  },
} satisfies Record<Locale, unknown>;

export function useT() {
  return dictionary[useLocale()];
}
