import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { ExploreStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import {
  buildDistances,
  fromFraction,
  indexAt,
  toFraction,
} from "~/lib/explore";
import { useLocale } from "~/lib/i18n";
import { routeLabel } from "~/lib/places";
import { useExplore, useExploreApi } from "~/stores/explore-context";

/** Pointer moves under this many px count as a click, not a drag. */
const CLICK_SLOP_PX = 4;

/**
 * Everything that turns an element into the ride's scrubber: slider
 * semantics, click-to-select-a-day, drag-to-scrub, keyboard steps, and a
 * --progress CSS variable kept in sync with playback (without re-rendering).
 *
 * Spread the result onto the track element: <div {...useTrackScrubber(…)} />
 * Shared by the desktop timeline and the mobile sheet's week scrubber.
 */
export function useTrackScrubber(
  stages: ExploreStage[],
  distances: ReturnType<typeof buildDistances>,
) {
  const t = useT();
  const locale = useLocale();
  const api = useExploreApi();
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; moved: boolean } | null>(null);

  const index = useExplore((s) => indexAt(s.position, s.count));
  const stage = stages[index];
  const dayNumber = stage.stageNumber ?? index + 1;

  // Move the playhead by setting a CSS variable directly: no React re-render per frame
  useEffect(() => {
    const apply = (position: number) =>
      ref.current?.style.setProperty(
        "--progress",
        String(toFraction(position, distances)),
      );
    apply(api.getState().position);
    return api.subscribe((state, previous) => {
      if (state.position !== previous.position) apply(state.position);
    });
  }, [api, distances]);

  const positionAt = (clientX: number) => {
    const rect = ref.current!.getBoundingClientRect();
    return fromFraction((clientX - rect.left) / rect.width, distances);
  };

  return {
    ref,
    role: "slider" as const,
    tabIndex: 0,
    "aria-valuemin": 1,
    "aria-valuemax": stages.length,
    "aria-valuenow": index + 1,
    "aria-valuetext": `${t.explore.day(dayNumber)} (${routeLabel(stage, locale) ?? stage.title})`,
    style: {
      "--progress": toFraction(api.getState().position, distances),
    } as CSSProperties,

    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { startX: e.clientX, moved: false };
      api.getState().pause();
    },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.abs(e.clientX - d.startX) < CLICK_SLOP_PX) return;
      d.moved = true;
      api.getState().setPosition(positionAt(e.clientX));
    },
    onPointerUp: (e: PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      drag.current = null;
      // A click (no drag) selects the stage under the pointer
      if (d && !d.moved)
        api
          .getState()
          .selectIndex(indexAt(positionAt(e.clientX), stages.length));
    },
    onPointerCancel: () => {
      drag.current = null;
    },
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
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
    },
  };
}
