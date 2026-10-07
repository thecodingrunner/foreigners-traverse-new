// ~/lib/strapi-media.ts
export function strapiMedia(url: string | null | undefined, base: string) {
  if (!url) return undefined;
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return `${base}${url}`;
}