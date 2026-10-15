import { useEffect, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SectionOf } from "~/data/pages.server";
import { useT } from "~/lib/dictionary";
import { useLocale } from "~/lib/i18n";
import { strapiMedia, strapiSrcSet } from "~/lib/strapi-media";

type Props = SectionOf<"ComponentSectionsAboutBlocks">;
type Block = NonNullable<NonNullable<Props["aboutBlocks"]>[number]>;

const pad = (n: number) => String(n).padStart(2, "0");
const chapterId = (n: number) => `chapter-${n}`;

// Tailwind classes for the Markdown output, so the body needs no global prose CSS
const markdown: Components = {
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="my-2 border-l-2 border-accent pl-4 italic text-secondary-foreground"
      {...props}
    />
  ),
  a: ({ node, ...props }) => (
    <a
      className="text-accent underline underline-offset-2 hover:no-underline"
      {...props}
    />
  ),
};

export default function AboutBlocks({ aboutBlocks, aboutStats }: Props) {
  const t = useT();
  const blocks = (aboutBlocks ?? []).filter((b): b is Block =>
    Boolean(b?.title),
  );
  const active = useActiveChapter(blocks.length);

  if (blocks.length === 0) return null;

  return (
    <section className="px-5 pb-12 md:px-14 lg:px-22 lg:pb-18">
      <div className="grid grid-cols-1 lg:grid-cols-[160px_minmax(0,50rem)] lg:gap-x-16 lg:border-t lg:border-border lg:pt-10">
        <nav
          aria-labelledby="about-contents"
          className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
        >
          <p id="about-contents" className="text-label-sm mb-3">
            {t.about.contents}
          </p>
          <ol className="flex flex-col gap-1.5">
            {blocks.map((block, i) => {
              const n = i + 1;
              const isActive = active === n;
              return (
                <li key={n}>
                  <a
                    href={`#${chapterId(n)}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex items-center gap-2 text-label-sm transition-colors ${
                      isActive ? "text-accent" : "hover:text-foreground"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-px bg-current transition-all ${isActive ? "w-4" : "w-2"}`}
                    />
                    {block.title}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex flex-col gap-12 lg:gap-20">
          {blocks.map((block, i) => (
            <Chapter key={i + 1} block={block} n={i + 1} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 pt-4 lg:pt-8 mt-10 border-t border-ink-2">
        {aboutStats?.stack && (
          <div className="flex flex-col gap-2 pb-4 border-b border-border md:border-0">
            <p className="text-label">{t.about.stats.stack}</p>
            <p className="text-body text-ink-2">{aboutStats?.stack}</p>
          </div>
        )}
        {aboutStats?.japanese && (
          <div className="flex flex-col gap-2 pb-4 border-b border-border md:border-0">
            <p className="text-label">{t.about.stats.japanese}</p>
            <p className="text-body text-ink-2">{aboutStats?.japanese}</p>
          </div>
        )}
        {aboutStats?.bike && (
          <div className="flex flex-col gap-2 pb-4 border-b border-border md:border-0">
            <p className="text-label">{t.about.stats.bike}</p>
            <p className="text-body text-ink-2">{aboutStats?.bike}</p>
          </div>
        )}
        {aboutStats?.links && (
          <div className="flex flex-col gap-2 pb-4">
            <p className="text-label">{t.about.stats.links}</p>
            <div className="flex flex-wrap md:flex-col gap-1.5">
                {aboutStats?.links.map((link, i) => (
                    <a key={i} href={link?.href ?? ""} target="_blank" rel="noopener noreferrer" className="link-text">{link?.text}</a>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Chapter({ block, n }: { block: Block; n: number }) {
  const locale = useLocale();
  const id = chapterId(n);
  const image = block.image;

  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-24 flex-col gap-5 border-t border-border pt-7 lg:border-0 lg:pt-0"
    >
      <header className="flex flex-col gap-1">
        <p className="text-label-sm text-accent tabular-nums">{pad(n)}</p>
        <h2 id={`${id}-title`} className="text-h3">
          {block.title}
        </h2>
        {block.titleAlt && (
          <p lang={locale === "ja" ? "en" : "ja"} className="text-label-sm">
            {block.titleAlt}
          </p>
        )}
      </header>

      {block.body && (
        <div className="text-body flex flex-col gap-3.5">
          <Markdown remarkPlugins={[remarkGfm]} components={markdown}>
            {block.body}
          </Markdown>
        </div>
      )}

      {block.quote && (
        <blockquote className="border-l-2 border-accent pl-4 text-body italic whitespace-pre-line">
          {block.quote}
        </blockquote>
      )}

      {image?.url && (
        <figure className="flex flex-col gap-2">
          <img
            src={strapiMedia(image.url)}
            srcSet={strapiSrcSet(image)}
            sizes="(min-width: 1024px) 40rem, 100vw"
            alt={image.alternativeText ?? ""}
            width={image.width ?? undefined}
            height={image.height ?? undefined}
            loading="lazy"
            decoding="async"
            className="aspect-[3/2] h-auto w-full object-cover"
          />
          {block.imageCaption && (
            <figcaption className="text-label-sm text-secondary-foreground">
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      )}
    </article>
  );
}

/** Which chapter is currently being read, for highlighting the contents list. */
function useActiveChapter(count: number) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const els = Array.from({ length: count }, (_, i) =>
      document.getElementById(chapterId(i + 1)),
    ).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // A thin band 20–30% down the viewport: whichever chapter crosses it is "current"
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(Number(hit.target.id.replace("chapter-", "")));
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  return active;
}
