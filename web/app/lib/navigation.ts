// app/lib/navigation.ts
import type { Locale } from "~/lib/i18n";

export const NAV = [
  { key: "journal", path: "/journal" },
  { key: "explore", path: "/journal?view=explore" },
  { key: "about", path: "/about" },
] as const;

export const LANGUAGES = [
  { code: "en", short: "EN", long: "English" },
  { code: "ja", short: "日本語", long: "日本語" },
] as const satisfies readonly { code: Locale; short: string; long: string }[];