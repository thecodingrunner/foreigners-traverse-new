import { getLocale, localePath } from "~/lib/i18n";
import type { Route } from "./+types/explore";
import { getExploreStages, type ExploreStage } from "~/data/stages.server";
import { getDictionary } from "~/lib/dictionary";
import {
  buildDistances,
  indexAt,
  indexFromParam,
  pickStage,
} from "~/lib/explore";
import { routeLabel } from "~/lib/places";
import { SITE_URL } from "~/lib/site";
import ExploreTopBar from "~/components/explore/ExploreTopBar";
import ExplorePanel from "~/components/explore/ExplorePanel";
import ExploreTimeline from "~/components/explore/ExploreTimeline";
import { useMemo } from "react";
import { ExploreStoreProvider, useExplore } from "~/stores/explore-context";
import { usePlayback } from "~/hooks/usePlayback";
import { useExploreUrlSync } from "~/hooks/useExploreUrlSync";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import ExploreViewport from "~/components/explore/ExploreViewport";
import ExploreSheet from "~/components/explore/ExploreSheet";
import ReducedMotionNote from "~/components/explore/ReducedMotionNote";
import StageAnnouncer from "~/components/explore/StageAnnouncer";

export const links: Route.LinksFunction = () =>
  [
    "/explore/terrain.png",
    "/explore/terrain.json",
    "/explore/route.json",
    "/explore/profile.json",
  ].map((href) => ({
    rel: "preload",
    href,
    as: "fetch",
    crossOrigin: "anonymous" as const,
  }));

const notFound = () => new Response("Not Found", { status: 404 });

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  if (params.stage !== undefined && !/^\d+$/.test(params.stage))
    throw notFound();

  const stages = await getExploreStages(locale);
  if (stages.length === 0) throw notFound();
  if (
    params.stage !== undefined &&
    !stages.some((s) => s.stageNumber === Number(params.stage))
  ) {
    throw notFound();
  }
  return { stages };
}

export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (currentParams.lang !== nextParams.lang) return true;
  if (currentParams.stage !== nextParams.stage) return false;
  return defaultShouldRevalidate;
}

export function meta({ loaderData, params }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Not found" }];
  const locale = params.lang === "ja" ? "ja" : "en";
  const t = getDictionary(locale);
  const stage = pickStage(loaderData.stages, params.stage);
  const path = `/explore/${stage.stageNumber}`;
  const title = `${t.explore.day(stage.stageNumber ?? 0)} · ${routeLabel(stage, locale) ?? stage.title} — ${t.header.title.main}`;

  return [
    { title },
    { name: "description", content: stage.excerpt ?? "" },
    { property: "og:title", content: title },
    { property: "og:description", content: stage.excerpt ?? "" },
    {
      tagName: "link",
      rel: "canonical",
      href: SITE_URL + localePath(path, locale),
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: SITE_URL + path,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ja",
      href: `${SITE_URL}/ja${path}`,
    },
  ];
}

export default function Explore({ loaderData, params }: Route.ComponentProps) {
  const { stages } = loaderData;
  const distances = useMemo(() => buildDistances(stages), [stages]);
  const urlIndex = indexFromParam(stages, params.stage);

  return (
    <ExploreStoreProvider
      kms={distances.kms}
      initialPosition={urlIndex >= 0 ? urlIndex + 1 : 0}
    >
      <ExploreView stages={stages} urlIndex={urlIndex} />
    </ExploreStoreProvider>
  );
}

function ExploreView({
  stages,
  urlIndex,
}: {
  stages: ExploreStage[];
  urlIndex: number;
}) {
  usePlayback();
  useExploreUrlSync(stages, urlIndex);
  const index = useExplore((s) => indexAt(s.position, s.count));

  return (
    <div className="explore">
      <ExploreTopBar />

      <div className="explore-stage-area">
        <ExploreViewport stages={stages} />
        <ExplorePanel stage={stages[index]} stageCount={stages.length} />
        <ExploreSheet stages={stages} stage={stages[index]} />
        <ReducedMotionNote />
      </div>

      <ExploreTimeline stages={stages} />
      <StageAnnouncer stages={stages} />
    </div>
  );
}
