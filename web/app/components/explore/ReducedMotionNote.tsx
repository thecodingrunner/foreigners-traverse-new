import { useReducedMotion } from "~/hooks/useReducedMotion";
import { useT } from "~/lib/dictionary";

/** Tells people why the explorer behaves differently with reduced motion on. */
export default function ReducedMotionNote() {
  const t = useT();
  const reducedMotion = useReducedMotion();
  if (!reducedMotion) return null;
  return (
    <p className="reduced-motion-note" role="note">
      <span aria-hidden="true">◐</span>
      {t.explore.reducedNote}
    </p>
  );
}
