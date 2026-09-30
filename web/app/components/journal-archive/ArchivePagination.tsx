import { Link, useSearchParams } from "react-router";
import { useT } from "~/lib/dictionary";

type ArchivePaginationProps = {
  page: number;
  pageCount: number;
  entryCount: number;
  pageSize: number;
};

export default function ArchivePagination({
  page,
  pageCount,
  entryCount,
  pageSize,
}: ArchivePaginationProps) {
  const [searchParams] = useSearchParams();
  if (pageCount <= 1) return null;

  const hrefFor = (n: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(n));
    return `?${next}`;
  };

  const t = useT();

  const isLast = page >= pageCount;
  const isFirst = page <= 1;

  return (
    <section className="md:mt-16 pt-5 border-t border-nibi flex items-center justify-between gap-6 w-full">
      <p className="hidden md:block text-label text-muted-foreground">
        Entries {(page - 1) * pageSize + 1} -{" "}
        {Math.min(page * pageSize, entryCount)} of {entryCount}
      </p>

      <div className="flex gap-2 text-ui text-uppercase justify-stretch w-full md:w-auto">
        {isFirst ? (
          <span className="pagination-link" aria-disabled="true">
            <span>←</span>
            <span>{t.journalArchive.pagination.previous}</span>
          </span>
        ) : (
          <Link to={hrefFor(page - 1)} className="pagination-link" rel="prev">
            <span>←</span>
            <span>{t.journalArchive.pagination.previous}</span>
          </Link>
        )}

        <div className="gap-2 hidden md:flex">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              to={hrefFor(n)}
              aria-current={n === page ? "page" : undefined}
              className="pagination-link"
            >
              {n}
            </Link>
          ))}
        </div>

        <div className="gap-2 flex md:hidden items-center text-label">
          {page} / {pageCount} 
        </div>

        {isLast ? (
          <span className="pagination-link" aria-disabled="true">
            <span>{t.journalArchive.pagination.next}</span>
            <span aria-hidden="true">→</span>
          </span>
        ) : (
          <Link to={hrefFor(page + 1)} className="pagination-link" rel="next">
            <span>{t.journalArchive.pagination.next}</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </section>
  );
}
