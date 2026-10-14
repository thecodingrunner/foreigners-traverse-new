const BASE = import.meta.env.VITE_STRAPI_PUBLIC_URL ?? "";

export function strapiMedia(url: string | null | undefined) {
  if (!url) return undefined;
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return `${BASE}${url}`;
}

type StrapiFormat = { url: string; width: number };

export type StrapiImage = {
  url: string;
  width?: number | null;
  height?: number | null;
  alternativeText?: string | null;
  formats?: unknown; // a JSON scalar in GraphQL: { small: { url, width, … }, … }
};

/**
 * Every resized copy Strapi made on upload, plus the original, as a srcset
 * ("…/small_x.jpg 500w, …/medium_x.jpg 750w, …"). The browser picks the
 * smallest one that covers the slot given by `sizes`.
 */
export function strapiSrcSet(image: StrapiImage | null | undefined) {
  if (!image?.url) return undefined;

  const formats = Object.values((image.formats ?? {}) as Record<string, Partial<StrapiFormat>>);
  const candidates = formats.filter((f): f is StrapiFormat => typeof f?.url === "string" && typeof f.width === "number");
  if (image.width) candidates.push({ url: image.url, width: image.width });

  const byWidth = new Map(candidates.map((c) => [c.width, c])); // drop duplicate widths
  const srcSet = [...byWidth.values()]
    .sort((a, b) => a.width - b.width)
    .map((c) => `${strapiMedia(c.url)} ${c.width}w`)
    .join(", ");
  return srcSet || undefined;
}