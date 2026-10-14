import { Link } from "react-router";
import type { ExploreStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { useStageDetails } from "./useStageDetails";

type ExplorePanelProps = { stage: ExploreStage; stageCount: number };

export default function ExplorePanel({ stage, stageCount }: ExplorePanelProps) {
  const t = useT();
  const { otherLocale, dayLabel, date, places, stats, readHref } =
    useStageDetails(stage);

  return (
    <aside
      className="explore-panel"
      aria-label={t.explore.panelLabel}
      data-scene-cover
    >
      <p className="text-label">
        <span className="text-accent">{dayLabel}</span>
        <span className="text-ink-3"> / {stageCount}</span>
      </p>
      {date && <p className="text-label-sm mt-2 normal-case">{date.long}</p>}

      <ol className="explore-places">
        {places.map(({ kind, name, pref }) =>
          name ? (
            <li key={kind} data-kind={kind}>
              <p className="text-h4">{name.primary}</p>
              <p className="text-ui text-ink-3">
                {name.secondary && (
                  <span lang={otherLocale}>{name.secondary}</span>
                )}
                {name.secondary && pref && " · "}
                {pref}
              </p>
            </li>
          ) : null,
        )}
      </ol>

      <dl className="explore-stats">
        {stats.map((item) => (
          <div key={item.key}>
            <dt className="text-label-sm">{item.label}</dt>
            <dd
              className={`text-data text-h4 ${item.key === "total" ? "text-accent" : ""}`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {stage.excerpt && <p className="text-body mt-6">{stage.excerpt}</p>}

      <Link to={readHref} className="link-text explore-read">
        {t.explore.readEntry} →
      </Link>
    </aside>
  );
}
