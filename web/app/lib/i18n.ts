import { useParams } from "react-router";

export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export function getLocale(lang: string | undefined): Locale {
    if (lang === undefined) return "en";
    if (lang === "ja") return "ja";
    throw new Response ("Not Found", { status: 404 });
}

export function useLocale(): Locale {
  const { lang } = useParams();
  return lang === "ja" ? "ja" : "en";
}

export function localePath(path: string, locale: Locale) {
  if (locale === "en") return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function stripLocale(pathname: string) {
  return pathname.replace(/^\/ja(?=\/|$)/, "") || "/";
}