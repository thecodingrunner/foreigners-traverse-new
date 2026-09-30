import { Link, useSearchParams } from "react-router";
import { useT } from "~/lib/dictionary";
import { REGIONS } from "~/lib/regions";

const VIEWS = ["grid", "map", "explore"] as const;

type Props = {
  entryCount: number;
  prefectureCount: number;
};

export default function ArchiveHeader({ entryCount, prefectureCount }: Props) {
  const t = useT();
  const [searchParams] = useSearchParams();

  const activeRegion = searchParams.get("region");
  const activeView = searchParams.get("view") ?? "grid";

  const withParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    return { search: qs ? `?${qs}` : "" };
  };

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4.5 md:gap-10">
      <div className="flex flex-col items-start gap-6.5">
        <div>
          <h1 className="text-h2">{t.journalArchive.title}</h1>

          <p className="text-body text-ink-3">
            {t.journalArchive.subtitle(entryCount, prefectureCount)}
          </p>
        </div>

        <div className="items-center gap-2.5 flex-wrap hidden md:flex">
          <Link
            to={withParam("region", null)}
            aria-current={!activeRegion ? "true" : undefined}
            className="filter-chip"
            preventScrollReset
          >
            {t.journalArchive.all}
          </Link>
          {REGIONS.map((region) => (
            <Link
              key={region}
              to={withParam("region", region)}
              aria-current={activeRegion === region ? "true" : undefined}
              className="filter-chip"
              preventScrollReset
            >
              {t.journalArchive.regions[region]}
            </Link>
          ))}
        </div>
      </div>

      <div className="view-toggle md:self-end">
        {VIEWS.map((view) => (
          <Link
            key={view}
            to={withParam("view", view === "grid" ? null : view)}
            aria-current={activeView === view ? "true" : undefined}
            preventScrollReset
            className="view-toggle-link"
          >
            {t.journalArchive.viewToggle[view]}
          </Link>
        ))}
      </div>
    </section>
  );
}
