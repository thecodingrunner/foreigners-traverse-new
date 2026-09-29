import { Link } from "react-router";
import type { AdjacentStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { localePath, useLocale } from "~/lib/i18n";

type StageNavProps = {
  prev: AdjacentStage["prev"] | null;
  next: AdjacentStage["next"] | null;
};

export default function StageNav({ prev, next }: StageNavProps) {
  const locale = useLocale();
  const t = useT();

  console.log("prev: ", prev, "next: ", next);

  return (
    <nav className="flex flex-col md:flex-row justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          to={localePath(`/journal/${prev.slug}`, locale)}
          rel="prev"
          className="flex flex-col items-start gap-2 py-7 flex-1"
        >
          <p className="text-label">
            ← Previous · {t.stage.day(prev.stageNumber ?? 0)}
          </p>
          <h4 className="text-h4">{prev.title}</h4>
          <p className="text-ui">
            {prev.startName} → {prev.endName}
          </p>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      <div
        className="h-px w-full bg-border md:h-auto md:w-px"
        aria-hidden="true"
      />
      {next ? (
        <Link
          to={localePath(`/journal/${next.slug}`, locale)}
          rel="next"
          className="flex flex-col items-end gap-2 py-7 flex-1"
        >
          <p className="text-label">
            {t.stage.day(next.stageNumber ?? 0)} · Next →
          </p>
          <h4 className="text-h4">{next.title}</h4>
          <p className="text-ui">
            {next.startName} → {next.endName}
          </p>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
