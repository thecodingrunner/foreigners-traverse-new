// app/components/explore/ExploreTimeline.tsx
import { useMemo } from "react";
import type { ExploreStage } from "~/data/stages.server";
import { useTrackScrubber } from "~/hooks/useTrackScrubber";
import { useT } from "~/lib/dictionary";
import { buildDistances, indexAt } from "~/lib/explore";
import type { Region } from "~/lib/regions";
import { useExplore } from "~/stores/explore-context";
import ElevationProfile from "./ElevationProfile";
import { PlaybackButtons, SpeedControl } from "./PlaybackControls";

type ExploreTimelineProps = { stages: ExploreStage[] };

function regionGroups(stages: ExploreStage[]) {
  const groups: { region: Region | null; km: number }[] = [];
  for (const s of stages) {
    const km = s.stats?.distanceKm ?? 0;
    const last = groups.at(-1);
    if (last && last.region === s.region) last.km += km;
    else groups.push({ region: s.region as Region | null, km });
  }
  return groups;
}

export default function ExploreTimeline({ stages }: ExploreTimelineProps) {
  const t = useT();
  const distances = useMemo(() => buildDistances(stages), [stages]);
  const groups = useMemo(() => regionGroups(stages), [stages]);
  const scrubber = useTrackScrubber(stages, distances);

  const index = useExplore((s) => indexAt(s.position, s.count));
  const dayNumber = stages[index].stageNumber ?? index + 1;

  return (
    <section className="explore-timeline" aria-label={t.explore.timelineLabel} data-scene-cover>
      <div className="explore-timeline-status">
        <PlaybackButtons />
        <p className="text-label">
          {t.explore.day(dayNumber)} <span className="opacity-60">/ {stages.length}</span>
        </p>
        <SpeedControl />
      </div>

      <div className="explore-timeline-main">
        <div className="explore-regions" aria-hidden="true">
          {groups.map((g, i) => (
            <span key={i} style={{ flexGrow: g.km || 1 }}>
              {g.region ? t.journalArchive.regions[g.region as Region] : ""}
            </span>
          ))}
        </div>

        <div className="explore-track" aria-label={t.explore.timelineLabel} {...scrubber}>
          <ElevationProfile stages={stages} distances={distances} />
          <div className="explore-track-fill" aria-hidden="true" />
          <div className="explore-track-segments" aria-hidden="true">
            {distances.kms.map((km, i) => (
              <div key={i} style={{ flexGrow: km }} data-current={i === index} />
            ))}
          </div>
          <div className="explore-track-handle" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}