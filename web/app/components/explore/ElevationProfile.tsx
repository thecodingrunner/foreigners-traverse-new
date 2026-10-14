import { useEffect, useMemo, useRef } from "react";
import type { ExploreStage } from "~/data/stages.server";
import { useExploreProfile } from "~/hooks/useExploreProfile";
import { buildDistances, indexAt, toFraction } from "~/lib/explore";
import {
  elevationAt,
  heightShare,
  matchProfiles,
  PROFILE_H,
  PROFILE_W,
  profilePaths,
} from "~/lib/profile";
import { useExploreApi } from "~/stores/explore-context";

type Props = {
  stages: ExploreStage[];
  distances: ReturnType<typeof buildDistances>;
  className?: string;
};

/**
 * The whole ride's elevation, drawn twice: a faint copy for the road ahead
 * and a bright copy for the road ridden, cropped at the playhead with CSS.
 * Like the timeline's playhead, it follows playback through CSS variables
 * instead of re-rendering: --progress (x) and --rider-height (y).
 */
export default function ElevationProfile({
  stages,
  distances,
  className = "",
}: Props) {
  const profile = useExploreProfile();
  const api = useExploreApi();
  const root = useRef<HTMLDivElement>(null);

  const matched = useMemo(
    () => (profile ? matchProfiles(profile, stages) : null),
    [profile, stages],
  );
  const paths = useMemo(
    () =>
      profile && matched ? profilePaths(profile, matched, distances) : null,
    [profile, matched, distances],
  );

  useEffect(() => {
    if (!profile || !matched) return;
    const apply = (position: number) => {
      const el = root.current!;
      if (!el) return;
      const index = indexAt(position, matched.length);
      const stage = matched[index];
      const fraction = Math.min(1, Math.max(0, position - index));
      el.style.setProperty(
        "--progress",
        String(toFraction(position, distances)),
      );
      // No data for this day: park the dot on the baseline
      const metres = stage ? elevationAt(stage, fraction, profile.stepKm) : 0;
      el.style.setProperty(
        "--rider-height",
        String(heightShare(metres, profile.maxM)),
      );
    };
    apply(api.getState().position);
    return api.subscribe((state, previous) => {
      if (state.position !== previous.position) apply(state.position);
    });
  }, [api, distances, matched, profile]);

  // Same box while loading, so the timeline doesn't jump when the data lands
  if (!paths)
    return (
      <div className={`elevation-profile ${className}`} aria-hidden="true" />
    );

  const drawing = (
    <svg viewBox={`0 0 ${PROFILE_W} ${PROFILE_H}`} preserveAspectRatio="none">
      <path className="elevation-profile-area" d={paths.area} />
      <path className="elevation-profile-line" d={paths.line} />
    </svg>
  );

  return (
    <div ref={root} className={`elevation-profile ${className}`} aria-hidden="true">
        <div className="elevation-profile-ahead">{drawing}</div>
        <div className="elevation-profile-ridden">{drawing}</div>
        <span className="elevation-profile-dot" />
    </div>
  )
}
