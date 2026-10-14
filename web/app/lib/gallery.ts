import type { Locale } from "~/lib/i18n";
import { strapiMedia, strapiSrcSet, type StrapiImage } from "~/lib/strapi-media";

/** One gallery row as it comes from StageQuery (structural, so the codegen type fits). */
type GalleryInput = {
  caption?: string | null;
  alt?: string | null;
  placeEn?: string | null;
  placeJa?: string | null;
  image?: StrapiImage | null;
} | null;

export type GalleryPhoto = {
  key: string;
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  place: string; // in the reader's language
  placeAlt: string; // in the other one
};

export function toGalleryPhotos(items: readonly GalleryInput[] | null | undefined, locale: Locale): GalleryPhoto[] {
  const ja = locale === "ja";

  return (items ?? []).flatMap((item, i) => {
    const image = item?.image;
    const src = strapiMedia(image?.url);
    if (!item || !image || !src) return []; // a row saved before its image was uploaded

    const caption = item.caption?.trim() ?? "";
    return [{
      key: `${i}-${image.url}`,
      src,
      srcSet: strapiSrcSet(image),
      // Real dimensions let the browser reserve space before the file arrives (no layout shift)
      width: image.width ?? 3,
      height: image.height ?? 2,
      // Describe the picture for screen readers; the caption is a fallback, not a substitute
      alt: item.alt?.trim() || image.alternativeText?.trim() || caption,
      caption,
      place: (ja ? item.placeJa : item.placeEn) ?? "",
      placeAlt: (ja ? item.placeEn : item.placeJa) ?? "",
    }];
  });
}