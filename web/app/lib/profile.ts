// Maths for the whole-ride elevation profile. No React and no three.js, so
// it can be shared by the desktop timeline and the mobile sheet.
import type { ExploreStage } from "~/data/stages.server";
import { buildDistances, toFraction } from "~/lib/explore";

/** public/explore/profile.json, from scripts/build-profile.mjs */
export type ProfileStage = {
  stageNumber: number;
  km: number;
  elevations: number[];
};
export type ProfileData = {
  version: string;
  stepKm: number;
  maxM: number;
  stages: ProfileStage[];
};

type Distances = ReturnType<typeof buildDistances>;

/** The profile's coordinate space. The SVG stretches it to fit (preserveAspectRatio="none"). */
export const PROFILE_W = 1000;
export const PROFILE_H = 100;
/** Leave the top 10% empty so the highest peak doesn't touch the edge. */
const HEADROOM = 0.9;

/** Strapi stages in order, each matched to its profile (null = no GPX yet). */
export function matchProfiles(profile: ProfileData, stages: ExploreStage[]) {
  const byNumber = new Map(profile.stages.map((s) => [s.stageNumber, s]));
  return stages.map((s) => byNumber.get(s.stageNumber ?? -1) ?? null);
}

/**
 * Height (m) a fraction (0–1) of the way through a stage. Samples sit every
 * stepKm, except the last one, which is the finish wherever it falls.
 */
export function elevationAt(
  stage: ProfileStage,
  fraction: number,
  stepKm: number,
) {
  const { elevations, km } = stage;
  const n = elevations.length;
  if (n === 1) return elevations[0];
  const along = Math.min(1, Math.max(0, fraction)) * km;
  const distanceOf = (j: number) => (j < n - 1 ? stepKm * j : km);
  const j = Math.min(Math.floor(along / stepKm), n - 2);
  const a = distanceOf(j);
  const t = (along - a) / (distanceOf(j + 1) - a || 1);
  return elevations[j] + (elevations[j + 1] - elevations[j]) * t;
}

/** Height as a share (0–1) of the profile's drawing height. */
export const heightShare = (metres: number, maxM: number) =>
  (metres / (maxM || 1)) * HEADROOM;

/**
 * SVG paths for the profile: `line` along the top, `area` filled down to
 * the bottom. x comes from toFraction, exactly like the timeline track, so
 * every stage lines up with its day tick. Stages with no data leave a gap.
 */
export function profilePaths(
  profile: ProfileData,
  matched: (ProfileStage | null)[],
  distances: Distances,
) {
  let line = "";
  let area = "";
  let run: string[] = []; // points of the current unbroken stretch
  let runStartX = 0;
  let lastX = 0;

  const flush = () => {
    if (run.length > 1) {
      line += `M${run.join("L")}`;
      area += `M${runStartX},${PROFILE_H}L${run.join("L")}L${lastX},${PROFILE_H}Z`;
    }
    run = [];
  };

  matched.forEach((stage, i) => {
    if (!stage) return flush();
    stage.elevations.forEach((metres, j) => {
        const along = Math.min(stage.km, j * profile.stepKm);
        const fraction = j === stage.elevations.length - 1 ? 1 : along / stage.km;
        const x = Math.round(toFraction(i + fraction, distances) * PROFILE_W * 10) / 10;
        const y = Math.round((1 - heightShare(metres, profile.maxM)) * PROFILE_H * 10) / 10;
        if (run.length === 0) runStartX = x;
        run.push(`${x},${y}`);
        lastX = x;
    });
  });
  flush();

  return { line, area };
}
