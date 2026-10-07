const BASE = import.meta.env.VITE_STRAPI_PUBLIC_URL ?? "";

export function strapiMedia(url: string | null | undefined) {
  if (!url) return undefined;
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return `${BASE}${url}`;
}