import type { Route } from "./+types/journal";
import { getLocale } from "~/lib/i18n";
import { getPage } from "~/data/pages.server";
import { getMapStages, getStages } from "~/data/stages.server";
import { parseRegion } from "~/lib/regions";
import ArchiveHeader from "~/components/journal-archive/ArchiveHeader";
import ArchiveGrid from "~/components/journal-archive/ArchiveGrid";
import ArchivePagination from "~/components/journal-archive/ArchivePagination";
import { useRouteLoaderData } from "react-router";
import type { loader as layoutLoader } from "./locale-layout";
import ArchiveMapView from "~/components/journal-archive/ArchiveMapView";

const PAGE_SIZE = 1;

export async function loader({ params, request }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const url = new URL(request.url);
  const region = parseRegion(url.searchParams.get("region"));
  const view = url.searchParams.get("view") === "map" ? "map" : "grid";

  if (view === "map") {
    const [page, stages] = await Promise.all([
      getPage("journal", locale),
      getMapStages(locale),
    ]);
    if (!page) throw new Response("Not Found", { status: 404 });
    return { view, page, region, stages } as const;
  }

  const pageNumber = Math.max(1, Number(url.searchParams.get("page") || 1));
  const [page, { stages, pageInfo }] = await Promise.all([
    getPage("journal", locale),
    getStages(locale, {
      page: pageNumber,
      pageSize: PAGE_SIZE,
      sort: ["stageNumber:asc"],
      filters: region ? { prefectures: { region: { eq: region } } } : undefined,
    }),
  ]);
  if (!page) throw new Response("Not Found", { status: 404 });
  if (pageNumber > pageInfo.pageCount && pageNumber > 1) {
    throw new Response("Not Found", { status: 404 });
  }

  return { view, page, stages, pageInfo } as const;
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData?.page.seo?.metaTitle ?? loaderData?.page.title },
    {
      name: "description",
      content: loaderData?.page.seo?.metaDescription ?? "",
    },
  ];
}

export default function Journal({ loaderData }: Route.ComponentProps) {
  const layout = useRouteLoaderData<typeof layoutLoader>(
    "routes/locale-layout",
  );
  const totals = layout?.totals;

  return (
    <div className="padding-x my-14 flex flex-col gap-11">
      <ArchiveHeader
        entryCount={totals?.days ?? 0}
        prefectureCount={totals?.prefectures ?? 0}
      />

      {loaderData.view === "map" ? (
        <ArchiveMapView stages={loaderData.stages} region={loaderData.region} />
      ) : (
        <>
          <ArchiveGrid stages={loaderData.stages} />
          <ArchivePagination
            page={loaderData.pageInfo.page}
            pageCount={loaderData.pageInfo.pageCount}
            entryCount={totals?.days ?? 0}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </div>
  );
}
