// Mobile only (hidden from 1024px up by CSS): the panel and the timeline
// combined into one bottom sheet. Tap or drag the handle to open it.
import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Link } from "react-router";
import type { ExploreStage } from "~/data/stages.server";
import { useTrackScrubber } from "~/hooks/useTrackScrubber";
import { useT } from "~/lib/dictionary";
import { buildDistances } from "~/lib/explore";
import ElevationProfile from "./ElevationProfile";
import { PlayButton, SpeedControl } from "./PlaybackControls";
import { useStageDetails } from "./useStageDetails";

type Props = { stages: ExploreStage[]; stage: ExploreStage };

/** Pointer moves under this many px are a tap on the handle, not a drag. */
const TAP_SLOP_PX = 6;
/** Drag at least this far to snap open or closed; less springs back. */
const SNAP_PX = 48;
/** The sheet never gets shorter than this while dragging. */
const MIN_HEIGHT_PX = 120;

/** Consecutive stages grouped into weeks (days 1–7, 8–14, …), sized by distance. */
function weekGroups(stages: ExploreStage[]) {
  const groups: { week: number; km: number }[] = [];
  stages.forEach((s, i) => {
    const week = Math.ceil((s.stageNumber ?? i + 1) / 7);
    const km = s.stats?.distanceKm ?? 0;
    const last = groups.at(-1);
    if (last && last.week === week) last.km += km;
    else groups.push({ week, km });
  });
  return groups;
}

export default function ExploreSheet({ stages, stage }: Props) {
  const t = useT();
  const detailsId = useId();
  const distances = useMemo(() => buildDistances(stages), [stages]);
  const weeks = useMemo(() => weekGroups(stages), [stages]);
  const scrubber = useTrackScrubber(stages, distances);
  const { otherLocale, dayLabel, date, places, stats, readHref } =
    useStageDetails(stage);
  const [start, end] = places;

  const [expanded, setExpanded] = useState(false);
  const sheet = useRef<HTMLElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const drag = useRef<{
    startY: number;
    startHeight: number;
    moved: boolean;
  } | null>(null);
  const justDragged = useRef(false);

  // ---- Handle: drag to resize, then snap. A tap is handled by onClick instead,
  // so keyboard users (Enter / Space) get exactly the same toggle.
  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startY: e.clientY,
      startHeight: sheet.current!.offsetHeight,
      moved: false,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const el = sheet.current;
    if (!d || !el) return;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dy) < TAP_SLOP_PX) return;
    d.moved = true;
    // Follow the finger directly, without the CSS height transition
    const max = (el.parentElement?.clientHeight ?? window.innerHeight) - 16;
    el.dataset.dragging = "true";
    el.style.height = `${Math.min(max, Math.max(MIN_HEIGHT_PX, d.startHeight - dy))}px`;
  };

  const endDrag = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const el = sheet.current;
    drag.current = null;
    if (!d?.moved || !el) return;
    justDragged.current = true;
    const dy = e.clientY - d.startY;
    if (dy < -SNAP_PX) setExpanded(true);
    else if (dy > SNAP_PX) setExpanded(false);
    delete el.dataset.dragging;
    el.style.height = "";
  };

  const onClick = () => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    setExpanded((open) => !open);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && expanded) {
      setExpanded(false);
      handle.current?.focus();
    }
  };

  return (
    <section
      ref={sheet}
      className="explore-sheet"
      data-expanded={expanded}
      data-scene-cover
      aria-label={t.explore.panelLabel}
      onKeyDown={onKeyDown}
    >
      <button
        ref={handle}
        type="button"
        className="explore-sheet-handle"
        aria-expanded={expanded}
        aria-controls={detailsId}
        aria-label={expanded ? t.explore.sheetHide : t.explore.sheetShow}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={onClick}
      >
        <span aria-hidden="true" />
      </button>

      <div className="explore-sheet-body">
        {/* Play + week scrubber */}
        <div className="explore-sheet-controls">
          <PlayButton />
          <div className="explore-sheet-scrubber">
            <div
              className="sheet-track"
              aria-label={t.explore.timelineLabel}
              {...scrubber}
            >
              <div className="sheet-track-fill" aria-hidden="true" />
              <div className="sheet-track-knob" aria-hidden="true" />
            </div>
            <div className="sheet-weeks" aria-hidden="true">
              {weeks.map((w) => (
                <span key={w.week} style={{ flexGrow: w.km || 1 }}>
                  {t.explore.week(w.week)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Always visible: the day at a glance */}
        <div className="explore-sheet-summary">
          <p className="sheet-day">
            <span className="text-label text-accent">
              {dayLabel} <span className="text-ink-3">/ {stages.length}</span>
            </span>
            <span className="text-label-sm normal-case">
              {[date?.short, end.pref].filter(Boolean).join(" · ")}
            </span>
          </p>
          <p className="sheet-route">
            <span>{start.name?.primary}</span>
            <span className="text-accent" aria-hidden="true">
              →
            </span>
            <span>{end.name?.primary}</span>
          </p>
          {start.name?.secondary && end.name?.secondary && (
            <p className="sheet-route-alt" lang={otherLocale}>
              {start.name.secondary} → {end.name.secondary}
            </p>
          )}
          <dl className="sheet-stats">
            {stats
              .filter((s) => s.key !== "total")
              .map((s) => (
                <div key={s.key}>
                  <dt className="text-label-sm">{s.label}</dt>
                  <dd className="text-data">{s.value}</dd>
                </div>
              ))}
          </dl>
        </div>

        {!expanded && (
          <p className="sheet-hint" aria-hidden="true">
            ↑ {t.explore.sheetHint}
          </p>
        )}

        {/* Only reachable when open: `inert` keeps the clipped links out of the tab order */}
        <div id={detailsId} className="explore-sheet-details" inert={!expanded}>
          <ElevationProfile
            stages={stages}
            distances={distances}
            className="is-light"
          />
          {stage.excerpt && <p className="text-body">{stage.excerpt}</p>}
          <Link to={readHref} className="btn-primary sheet-read">
            {t.explore.readEntry} →
          </Link>
          <SpeedControl />
        </div>
      </div>
    </section>
  );
}
