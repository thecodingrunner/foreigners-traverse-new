import { useT } from "~/lib/dictionary";
import { SPEEDS } from "~/stores/explore";
import { useExplore, useExploreApi } from "~/stores/explore-context";

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
        <button key={value} type="button" aria-pressed={speed === value} onClick={() => api.getState().setSpeed(value)}>
            {value}×
        </button>
      ))}
    </div>
  );
}
