import type { Locale } from "~/lib/i18n";

type PlaceFields = {
    startNameEn?: string | null;
    startNameJa?: string | null;
    endNameEn?: string | null;
    endNameJa?: string | null;
};

export type PlaceName = {
    primary: string;
    secondary: string | null;
}

export function placeName(
    stage: PlaceFields,
    which: "start" | "end",
    locale: Locale,
): PlaceName | null {
    const en = stage[`${which}NameEn`] ?? null;
    const ja = stage[`${which}NameJa`] ?? null;
    const primary = locale === "ja" ? ja ?? en : en ?? ja;
    if (!primary) return null;
    const secondary = locale === "ja" ? en : ja;
    return { primary, secondary: secondary !== primary ? secondary : null };
}

export function routeLabel(stage: PlaceFields, locale: Locale) {
    const start = placeName(stage, "start", locale);
    const end = placeName(stage, "end", locale);
    return start && end ? `${start?.primary} → ${end?.primary}` : null;
}