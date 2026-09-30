import { getLocale } from "~/lib/i18n";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Route } from "./+types/stage";
import {
  getAdjacentStages,
  getRideTotals,
  getStage,
} from "~/data/stages.server";
import StageNav from "~/components/stage/StageNav";
import StageHeader from "~/components/stage/StageHeader";
import { extractHeadings } from "~/lib/markdown";
import ElevationProfile from "~/components/stage/ElevationProfile";
import TableOfContents from "~/components/stage/TableOfContents";
import ElevationGraph from "~/components/stage/ElevationGraph";
import { Link } from "react-router";
import { useT } from "~/lib/dictionary";

const SITE_URL = "https://foreigners-traverse.com";

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const stage = await getStage(params.slug, locale);
  if (!stage) throw new Response("Not Found", { status: 404 });

  const headings = stage.body ? extractHeadings(stage.body) : [];

  const totals = await getRideTotals();

  const { prev, next } =
    stage.stageNumber != null
      ? await getAdjacentStages(stage.stageNumber, locale)
      : { prev: null, next: null };

  return { stage, prev, next, totals, headings };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Not found" }];
  const { stage } = loaderData;

  return [
    { title: stage.seo?.metaTitle ?? stage.title },
    {
      name: "description",
      content: stage.seo?.metaDescription ?? stage.excerpt ?? "",
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: `${SITE_URL}/journal/${stage.slug}`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ja",
      href: `${SITE_URL}/ja/journal/${stage.slug}`,
    },
  ];
}

export default function Stage({ loaderData }: Route.ComponentProps) {
  const { stage, prev, next, totals, headings } = loaderData;
  const cover = stage.coverImage;
  const coverSrc = cover?.url;

  const t = useT();

  return (
    <article className="padding-x my-10 flex flex-col">
      <StageHeader stage={stage} totals={totals} />

      <div className="flex flex-col gap-4 md:hidden">
        {stage.routePreview && (
          <ElevationGraph
            profile={stage.routePreview.profile}
            distanceKm={stage.routePreview.distanceKm}
            displayLabels={false}
          />
        )}

        <Link className="btn-secondary" to={`/journal?view=explore`}>
          {t.stage.data.explore}
        </Link>
      </div>


      <div className="stage-cover-image mt-8">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={cover?.alternativeText ?? ""}
            width={cover?.width ?? undefined}
            height={cover?.height ?? undefined}
            fetchPriority="high"
            className=""
          />
        ) : (
          <div className="image-placeholder-stage" aria-hidden="true"></div>
        )}
      </div>

      <section className="stage-body scroll-smooth">
        <div className="prose">
          {stage.body && (
            <Markdown remarkPlugins={[remarkGfm]}>{stage.body}</Markdown>
          )}
        </div>

        <div className="flex flex-col gap-12 lg:sticky lg:top-24 lg:self-start">
          {stage.routePreview && stage.stageNumber != null && (
            <ElevationProfile
              profile={stage.routePreview.profile}
              distanceKm={stage.routePreview.distanceKm}
              stageNumber={stage.stageNumber}
            />
          )}
          <TableOfContents headings={headings} />
        </div>
      </section>

      <StageNav prev={prev} next={next} />
    </article>
  );
}
