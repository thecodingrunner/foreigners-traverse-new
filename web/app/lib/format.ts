import type { Locale } from "~/lib/i18n";

const INTL_LOCALE: Record<Locale, string> = { en: "en-GB", ja: "ja-JP" };

export function formatDate(
    date: string,
    locale: Locale,
    options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" },
) {
    return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
        ...options,
        timeZone: "UTC",
    }).format(new Date(date));
}

export function formatNumber(value: number, locale: Locale) {
    return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}