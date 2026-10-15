import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SectionOf } from "~/data/pages.server";
import { useT } from "~/lib/dictionary";
import { strapiMedia } from "~/lib/strapi-media";

type Props = SectionOf<"ComponentSectionsAboutHero">;

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const isExternal = (href: string) => /^https?:\/\//.test(href);

export default function AboutHero({
  link,
  body,
  cvFile,
  image,
  imageCaption,
  label,
  title,
  titleAlt,
}: Props) {
  const t = useT();
  const hasActions = Boolean(link?.href || cvFile?.url);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto_1fr] md:gap-x-4.5 md:gap-y-5 md:py-12 md:px-14 lg:py-18 lg:px-22">
      <header className="flex flex-col items-start gap-2.5 py-7 px-5 md:p-0">
        {label && <p className="text-label text-accent">{label}</p>}
        <h1 className="text-h1">{title}</h1>
        {titleAlt && <p className="text-ui">{titleAlt}</p>}
      </header>

      <HeroImage
        image={image}
        caption={imageCaption}
        className="md:col-start-2 md:row-start-1 md:row-span-3"
      />

      {body && (
        <div className="text-body flex flex-col gap-3.5 p-5 md:p-0 md:mt-3 md:pt-5 md:border-t md:border-border md:max-w-[80%]">
          <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
        </div>
      )}

      {hasActions && (
        <div className="flex flex-col gap-2.5 p-5 md:flex-row md:self-start md:p-0">
          {link?.href && (
            <a
              href={link.href}
              className="btn-primary"
              {...(isExternal(link.href) ? external : {})}
            >
              {link.text} <span aria-hidden="true">→</span>
            </a>
          )}
          {cvFile?.url && (
            <a href={strapiMedia(cvFile.url)} className="btn-secondary" {...external}>
              {t.about.hero.cv}
            </a>
          )}
        </div>
      )}
    </section>
  );
}

type HeroImageProps = {
  image: Props["image"];
  caption: Props["imageCaption"];
  className?: string;
};

function HeroImage({ image, caption, className = "" }: HeroImageProps) {
  return (
    <figure className={`relative ${className}`}>
      {image?.url ? (
        <img
          src={strapiMedia(image.url)}
          alt={image.alternativeText ?? ""}
          width={image.width ?? undefined}
          height={image.height ?? undefined}
          fetchPriority="high"
          className="w-full md:h-full object-cover"
        />
      ) : (
        <div className="image-placeholder-large h-full" aria-hidden="true" />
      )}
      {caption && (
        <figcaption className="text-label absolute left-4 bottom-4">{caption}</figcaption>
      )}
    </figure>
  );
}