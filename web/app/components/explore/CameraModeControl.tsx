import { useRef, type KeyboardEvent } from "react";
import { useT } from "~/lib/dictionary";
import type { CameraMode } from "~/stores/explore";
import { useExplore } from "~/stores/explore-context";

const MODES: CameraMode[] = ["overview", "follow", "orbit"];

/**
 * Overview / Follow / Orbit, as an ARIA radio group: one Tab stop for the
 * whole group, arrow keys move between options and select as they go.
 */
export default function CameraModeControl() {
  const t = useT();
  const mode = useExplore((s) => s.mode);
  const setMode = useExplore((s) => s.setMode);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const labels: Record<CameraMode, string> = {
    overview: t.explore.camOverview,
    follow: t.explore.camFollow,
    orbit: t.explore.camOrbit,
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      event.key
    ];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + MODES.length) % MODES.length;
    setMode(MODES[next]);
    buttons.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={t.explore.cameraLabel}
      className="camera-modes"
    >
      {MODES.map((m, i) => (
        <button
          key={m}
          ref={(el) => {
            buttons.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={mode === m}
          tabIndex={mode === m ? 0 : -1}
          className="camera-mode"
          onClick={() => setMode(m)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {labels[m]}
        </button>
      ))}
    </div>
  );
}
