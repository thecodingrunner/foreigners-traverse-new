import { useEffect, useRef } from "react";
import { Link } from "react-router";
import type { MapStage } from "~/data/stages.server";
import { formatNumber } from "~/lib/format";
import { localePath, useLocale } from "~/lib/i18n";
import { placeName } from "~/lib/places";
import type { Region } from "~/lib/regions";

type StageMapListProps = {
  stages: MapStage[];
  region: Region | null;
  activeStage: number | null;
  onActiveStage: (stageNumber: number | null) => void;
};

export default function StageMapList({
  stages,
  region,
  activeStage,
  onActiveStage,
}: StageMapListProps) {
  const locale = useLocale();
  const otherLocale = locale === "en" ? "ja" : "en";
  const listRef = useRef<HTMLOListElement>(null);

  // Keep the active row visible inside the list, without scrolling the page.
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLDivElement>(
      `[data-stage="${activeStage}"]`,
    );
    if (!list || !row) return;

    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop) {
      list.scrollTo({ top, behavior: "smooth" });
    } else if (bottom > list.scrollTop + list.offsetHeight) {
      list.scrollTo({ top: bottom - list.offsetHeight, behavior: "smooth" });
    }
  }, [activeStage]);

  return (
    <ol
      ref={listRef}
      className="stage-map-list"
      onMouseLeave={() => onActiveStage(null)}
    >
      {stages.map((stage) => {
        const end = placeName(stage, "end", locale);
        const dim = region != null && !stage.regions.includes(region);

        return (
          <li key={stage.documentId}>
            <Link
              to={localePath(`/journal/${stage.slug}`, locale)}
              className="stage-map-row"
              data-stage={stage.stageNumber}
              data-dim={dim}
              aria-current={
                stage.stageNumber === activeStage ? "true" : undefined
              }
              onMouseEnter={() => onActiveStage(stage.stageNumber)}
              onFocus={() => onActiveStage(stage.stageNumber)}
            >
              <span className="text-label-sm">
                {String(stage.stageNumber ?? 0).padStart(2, "0")}
              </span>
              <span className="text-ui truncate">
                {end?.primary}
                {end?.secondary && (
                  <span
                    lang={otherLocale}
                    className="ml-1.5 text-label-sm normal-case"
                  >
                    {end.secondary}
                  </span>
                )}
              </span>
              {stage.stats?.distanceKm != null && (
                  <span className="text-label-sm">
                    {formatNumber(stage.stats.distanceKm, locale)} km
                  </span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
