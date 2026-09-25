import { useLocale, type Locale } from "~/lib/i18n";

const dictionary = {
    en: {
        stats: { distance: "Distance", days: "Days", climb: "Climb" },
    },
    ja: {
        stats: { distance: "走行距離", days: "日数", climb: "獲得標高" },
    },
} satisfies Record<Locale, unknown>;

export function useT() {
    return dictionary[useLocale()];
}