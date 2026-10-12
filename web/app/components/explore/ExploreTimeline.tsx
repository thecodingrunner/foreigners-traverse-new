import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Link } from "react-router";
import type { ExploreStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import {
  buildDistances,
  fromFraction,
  indexAt,
  toFraction,
} from "~/lib/explore";
import { localePath, useLocale } from "~/lib/i18n";
import { routeLabel } from "~/lib/places";
import type { Region } from "~/lib/regions";
import { SPEEDS } from "~/stores/explore";
import { useExplore, useExploreApi } from "~/stores/explore-context";

type ExploreTimelineProps = { stages: ExploreStage[]; current: number | null };

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

export default function ExploreTimeline({
  stages,
  current,
}: ExploreTimelineProps) {
  const locale = useLocale();
  const t = useT();
  const api = useExploreApi();
  const distances = useMemo(() => buildDistances(stages), [stages]);
  const groups = useMemo(() => regionGroups(stages), [stages]);

  const index = useExplore((s) => indexAt(s.position, s.count));
  const playing = useExplore((s) => s.playing);
  const speed = useExplore((s) => s.speed);
  const stage = stages[index];
  const dayNumber = stage.stageNumber ?? index + 1;

  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; moved: boolean } | null>(null);

  // Move the playhead by setting a CSS variable directly: no React re-render per frame
  useEffect(() => {
    const apply = (position: number) =>
      trackRef.current?.style.setProperty(
        "--progress",
        String(toFraction(position, distances)),
      );
    apply(api.getState().position);
    return api.subscribe((state, previous) => {
      if (state.position !== previous.position) apply(state.position);
    });
  }, [api, distances]);

  const positionAt = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    return fromFraction((clientX - rect.left) / rect.width, distances);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, moved: false };
    api.getState().pause();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.abs(e.clientX - d.startX) < 4) return;
    d.moved = true;
    api.getState().setPosition(positionAt(e.clientX));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    // A click (no drag) selects the stage under the pointer
    if (d && !d.moved)
      api.getState().selectIndex(indexAt(positionAt(e.clientX), stages.length));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const s = api.getState();
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        s.step(1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        s.step(-1);
        break;
      case "PageUp":
        s.step(7);
        break;
      case "PageDown":
        s.step(-7);
        break;
      case "Home":
        s.pause();
        s.setPosition(0);
        break;
      case "End":
        s.selectIndex(stages.length - 1);
        break;
      case " ":
        s.toggle();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  return (
    <section className="explore-timeline" aria-label={t.explore.timelineLabel} data-scene-cover>
      <div className="explore-timeline-status">
        {/* Play button and speed controls to go here */}
        <button
            type="button"
            className="explore-play"
            onClick={() => api.getState().toggle()}
            aria-label={playing ? t.explore.pause : t.explore.play}
        >
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        </button>

        <p className="text-label">
          {t.explore.day(dayNumber ?? 0)}{" "}
          <span className="opacity-60">/ {stages.length}</span>
        </p>

        <div className="explore-speed" role="group" aria-label={t.explore.speed}>
            <span className="text-label-sm" aria-hidden="true">{t.explore.speed}</span>
            {SPEEDS.map((value) => (
                <button
                    key={value}
                    type="button"
                    aria-pressed={speed === value}
                    onClick={() => api.getState().setSpeed(value)}
                >
                    {value}x
                </button>
            ))}
        </div>
      </div>

      <div className="explore-timeline-main">
        <div className="explore-regions" aria-hidden="true">
          {groups.map((g, i) => (
            <span key={i} style={{ flexGrow: g.km || 1 }}>
              {g.region ? t.journalArchive.regions[g.region as Region] : ""}
            </span>
          ))}
        </div>

        <div 
            ref={trackRef}
            className="explore-track"
            style={{ "--progress": toFraction(api.getState().position, distances) } as CSSProperties}
            role="slider"
            tabIndex={0}
            aria-label={t.explore.timelineLabel}
            aria-valuemin={1}
            aria-valuemax={stages.length}
            aria-valuenow={index + 1}
            aria-valuetext={`${t.explore.day(dayNumber ?? 0)}: ${routeLabel(stage, locale) ?? stage.title}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
            onKeyDown={onKeyDown}
        >
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
