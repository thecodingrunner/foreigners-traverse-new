import { useT } from "~/lib/dictionary";
import { SPEEDS } from "~/stores/explore";
import { useExplore, useExploreApi } from "~/stores/explore-context";
import { useReducedMotion } from "~/hooks/useReducedMotion";

/** Play / pause, shared by the desktop timeline and the mobile sheet. */
export function PlayButton() {
  const t = useT();
  const api = useExploreApi();
  const playing = useExplore((s) => s.playing);
  return (
    <button
      type="button"
      className="explore-play"
      onClick={() => api.getState().toggle()}
      aria-label={playing ? t.explore.pause : t.explore.play}
    >
      <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
    </button>
  );
}

/** 1× / 2× / 4× toggle buttons. */
export function SpeedControl() {
  const t = useT();
  const api = useExploreApi();
  const speed = useExplore((s) => s.speed);
  return (
    <div className="explore-speed" role="group" aria-label={t.explore.speed}>
      <span className="text-label-sm" aria-hidden="true">
        {t.explore.speed}
      </span>
      {SPEEDS.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={speed === value}
          onClick={() => api.getState().setSpeed(value)}
        >
          {value}×
        </button>
      ))}
    </div>
  );
}

export function StepButtons() {
  const t = useT();
  const api = useExploreApi();
  const atStart = useExplore((s) => s.position <= 0);
  const atEnd = useExplore((s) => s.position >= s.count);
  return (
    <div className="explore-steps">
      <button
        type="button"
        aria-label={t.explore.previousDay}
        disabled={atStart}
        onClick={() => api.getState().step(-1)}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        aria-label={t.explore.nextDay}
        disabled={atEnd}
        onClick={() => api.getState().step(1)}
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}

/**
 * The play control for each motion setting. With reduced motion, day-by-day
 * buttons come first (the design's prev / next), and play still works as
 * the stage-by-stage slideshow: nothing ever plays on its own.
 */
export function PlaybackButtons() {
  const reducedMotion = useReducedMotion();
  if (!reducedMotion) return <PlayButton />;
  return (
    <div className="explore-playback is-reduced">
      <StepButtons />
      <PlayButton />
    </div>
  );
}

