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
      offCanvas: {
        language: "Language",
        languageSubtitle: "Switching keeps you on the same page.",
      },
      menu: "Menu",
      close: "Close",
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
    featuredStages: {
      title: "Featured entries",
      subtitle: "注目の記事",
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
      map: {
        route: "Route",
        stageEnd: "Stage end",
        stageStart: "Start / Finish",
        hintTouch: "Tap a stage to preview it",
        hint: "Hover a stage to preview it",
        read: "Read",
      },
    },
    stage: {
      previous: "Previous",
      next: "Next",
      day: (n: number) => `Day ${n}`,
      data: {
        date: "Date",
        route: "Route",
        distance: "Distance",
        elevation: "Elevation Gain",
        movingTime: "Moving Time",
        totalSoFar: "Total So Far",
        explore: "View this stage in 3D →",
      },
      elevationProfile: "Elevation Profile",
      elevationLabel: (distanceKm: number, max: number) =>
        `${distanceKm} km, ${max} m`,
      viewIn3d: "View this stage in 3D",
      onThisPage: "On this page",
      gallery: {
        title: "Gallery",
        titleAlt: "ギャラリー",
        count: (n: number) => `${n} photos`,
        open: (caption: string) => `Open photo: ${caption}`,
        photoOf: (i: number, n: number) => `Photo ${i} of ${n}`,
        close: "Close",
        previous: "Previous photo",
        next: "Next photo",
        swipeHint: "Swipe ← → to browse · swipe ↓ to close",
      },
    },
    explore: {
      day: (n: number) => `Day ${n}`,
      back: "Journal",
      cameraLabel: "Camera",
      modes: { overview: "Overview", follow: "Follow", orbit: "Orbit" },
      stats: {
        distance: "Distance",
        elevationGain: "Elevation Gain",
        movingTime: "Moving Time",
        totalSoFar: "Total So Far",
      },
      panelLabel: "Stage Information",
      readEntry: "Read Entry",
      timelineLabel: "Timeline",
      play: "Play",
      pause: "Pause",
      speed: "Speed",
      loadingTitle: "Loading terrain",
      loadingDetail: (loaded: string, total: string | null) =>
        total ? `${loaded} of ${total} MB` : `${loaded} MB`,
      noglTag: "WebGL unavailable",
      noglTitle: "The 3D view can't start on this device",
      noglBody:
        "Your browser couldn't create a WebGL context. Every stage is also on the 2D map, with the same stats and entries.",
      noglCta: "Open the 2D map",
      errorTitle: "The 3D view couldn't load",
      errorBody:
        "Something went wrong loading the terrain. Try again, or use the 2D map.",
      retry: "Try again",
      camOverview: "Overview",
      camFollow: "Follow",
      camOrbit: "Orbit",
      orbitHint: "Drag to orbit · scroll to zoom",
      week: (n: number) => `W${n}`,
      sheetShow: "Show stage details",
      sheetHide: "Hide stage details",
      sheetHint: "Drag up for the entry",
      previousDay: "Previous day",
      nextDay: "Next day",
      reducedNote:
        "Reduced motion is on. The camera cuts between stages instead of flying, and nothing plays automatically.",
      sceneLabel: "3D map of the ride from Fukuoka to Aomori",
      announce: (day: string, route: string) => `${day}: ${route}`,
    },
  },
  ja: {
    header: {
      title: { main: "外人縦断", secondary: "Foreigners Traverse" },
      nav: { journal: "縦断日誌", explore: "3Dで見る", about: "概要" },
      offCanvas: {
        language: "言語",
        languageSubtitle: "切り替えても、同じページのまま表示されます。",
      },
      menu: "メニュー",
      close: "閉じる",
    },
    footer: {
      nav: { journal: "縦断日誌", explore: "3Dで見る", github: "Github" },
      title: "外人縦断",
      subtitle: "旅の途中で書きました。2026年。Next.js と Strapi で制作。",
    },
    stats: { distance: "走行距離", days: "日数", climb: "獲得標高" },
    featuredStages: {
      title: "注目の記事",
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
      map: {
        route: "ルート",
        stageEnd: "ステージ終点",
        stageStart: "出発 / 到着",
        hintTouch: "ステージをタップするとプレビュー",
        hint: "ステージにカーソルを合わせるとプレビュー",
        read: "読む",
      },
    },
    stage: {
      previous: "前のステージ",
      next: "次のステージ",
      day: (n: number) => `${n}日目`,
      data: {
        date: "日付",
        route: "ルート",
        distance: "距離",
        elevation: "獲得標高",
        movingTime: "走行時間",
        totalSoFar: "累計距離",
        explore: "このステージを3Dで見る →",
      },
      elevationProfile: "標高プロフィール",
      elevationLabel: (distanceKm: number, max: number) =>
        `${distanceKm}km、${max}m`,
      viewIn3d: "このステージを3Dで見る",
      onThisPage: "目次",
      gallery: {
        title: "ギャラリー",
        titleAlt: "Gallery",
        count: (n: number) => `写真${n}枚`,
        open: (caption: string) => `写真を開く：${caption}`,
        photoOf: (i: number, n: number) => `${n}枚中${i}枚目`,
        close: "閉じる",
        previous: "前の写真",
        next: "次の写真",
        swipeHint: "左右にスワイプで切り替え · 下にスワイプで閉じる",
      },
    },
    explore: {
      day: (n: number) => `${n}日目`,
      back: "記録",
      cameraLabel: "カメラ",
      modes: { overview: "全体", follow: "追従", orbit: "周回" },
      stats: {
        distance: "距離",
        elevationGain: "獲得標高",
        movingTime: "走行時間",
        totalSoFar: "累計距離",
      },
      panelLabel: "ステージ情報",
      readEntry: "記事を読む",
      timelineLabel: "ステージタイムライン",
      play: "再生",
      pause: "一時停止",
      speed: "速度",
      loadingTitle: "地形を読み込み中",
      loadingDetail: (loaded: string, total: string | null) =>
        total ? `${loaded} / ${total} MB` : `${loaded} MB`,
      noglTag: "WebGL非対応",
      noglTitle: "この端末では3D表示を開始できません",
      noglBody:
        "ブラウザでWebGLを利用できませんでした。すべてのステージは、同じデータと記事とともに2D地図でご覧いただけます。",
      noglCta: "2D地図を開く",
      errorTitle: "3D表示を読み込めませんでした",
      errorBody:
        "地形の読み込み中に問題が発生しました。もう一度試すか、2D地図をご利用ください。",
      retry: "再試行",
      camOverview: "全体",
      camFollow: "追従",
      camOrbit: "周回",
      orbitHint: "ドラッグで回転 · スクロールでズーム",
      week: (n: number) => `${n}週`,
      sheetShow: "ステージの詳細を表示",
      sheetHide: "ステージの詳細を閉じる",
      sheetHint: "上にスワイプして記事を表示",
      previousDay: "前のステージ",
      nextDay: "次のステージ",
      reducedNote:
        "「視差効果を減らす」が有効です。カメラは飛行せずにステージ間を切り替え、自動再生もしません。",
      sceneLabel: "福岡から青森までのルートの3D地図",
      announce: (day: string, route: string) => `${day}：${route}`,
    },
  },
} satisfies Record<Locale, unknown>;

export function getDictionary(locale: Locale) {
  return dictionary[locale];
}

export function useT() {
  return getDictionary(useLocale());
}
