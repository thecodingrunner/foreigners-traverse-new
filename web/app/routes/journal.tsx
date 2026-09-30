import type { Route } from "./+types/journal";
import { getLocale } from "~/lib/i18n";
import { getPage } from "~/data/pages.server";
import { getRideTotals, getStages } from "~/data/stages.server";
import { parseRegion } from "~/lib/regions";
import ArchiveHeader from "~/components/journal-archive/ArchiveHeader";
import ArchiveGrid from "~/components/journal-archive/ArchiveGrid";
import ArchivePagination from "~/components/journal-archive/ArchivePagination";

export async function loader({ params, request }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const url = new URL(request.url);
  const pageNumber = Math.max(1, Number(url.searchParams.get("page") || 1));
  const region = parseRegion(url.searchParams.get("region"));
  const pageSize = 1;

  const [page, { stages, pageInfo }, totals] = await Promise.all([
    getPage("journal", locale),
    getStages(locale, {
      page: pageNumber,
      pageSize: pageSize,
      sort: ["stageNumber:asc"],
      filters: region ? { prefectures: { region: { eq: region } } } : undefined,
    }),
    getRideTotals(),
  ]);

  if (!page) throw new Response("Not Found", { status: 404 });
  if (pageNumber > pageInfo.pageCount && pageNumber > 1) {
    throw new Response("Not Found", { status: 404 });
  }

  return { page, stages, pageInfo, totals, pageSize };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData?.page.seo?.metaTitle ?? loaderData?.page.title },
    { name: "description", content: loaderData?.page.seo?.metaDescription ?? "" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { page, stages, pageInfo, totals, pageSize } = loaderData;
  return (
    <div className="padding-x my-14 flex flex-col gap-11">
      <ArchiveHeader
        entryCount={totals.days}
        prefectureCount={totals.prefectures}
      />
      <ArchiveGrid stages={stages} />
      <ArchivePagination page={pageInfo.page} pageCount={pageInfo.pageCount} entryCount={totals.days} pageSize={pageSize} />
    </div>
  );
}
