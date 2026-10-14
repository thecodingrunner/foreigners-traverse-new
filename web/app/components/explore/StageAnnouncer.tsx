import { useEffect, useRef, useState } from "react";
import type { ExploreStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { indexAt } from "~/lib/explore";
import { useLocale } from "~/lib/i18n";
import { routeLabel } from "~/lib/places";
import { useExplore } from "~/stores/explore-context";

/**
 * A visually hidden live region: screen readers hear "Day 12: Hiroshima →
 * Okayama" when the stage changes from a marker click, a prev / next button
 * or the URL. It stays quiet during playback (a new day every few seconds
 * would talk over everything) and while the slider is focused (the slider
 * already announces its own value).
 */
export default function StageAnnouncer({ stages }: { stages: ExploreStage[] }) {
  const t = useT();
  const locale = useLocale();
  const index = useExplore((s) => indexAt(s.position, s.count));
  const playing = useExplore((s) => s.playing);
  const [message, setMessage] = useState("");
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (playing) return;
    if (document.activeElement?.getAttribute("role") === "slider") return;
    const stage = stages[index];
    const day = t.explore.day(stage.stageNumber ?? index + 1);
    setMessage(
      t.explore.announce(day, routeLabel(stage, locale) ?? stage.title ?? ""),
    );
  }, [index, playing, stages, t, locale]);

  // The region must already be in the page before its text changes,
  // otherwise screen readers don't notice the change
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {message}
    </p>
  );
}
