import type { RouteStage } from "./assets";

export type RoutePoint = { x: number; y: number; z: number; segment: number };

/**
 * Store position → which stage, and how far through it (0–1).
 * Rounds the same way as indexAt: position 9 is the END of Day 9, not the start of Day 10.
 */
export function stageAt(position: number, count: number) {
    const index = Math.min(count - 1, Math.max(0, Math.ceil(position) - 1));
    return { index, fraction: Math.min(1, Math.max(0, position - index)) };
}

/** The point a given fraction (0-1) of the way along a stage, by road distance. */
export function pointAt(stage: RouteStage, fraction: number): RoutePoint {
    const { t, positions } = stage;

    // Binary search: the last point whose t is ≤ fraction
    let lo = 0;
    let hi = t.length - 2;
    while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (t[mid] <= fraction) lo = mid;
        else hi = mid - 1;
    }

    const k = lo;
    const span = t[k + 1] - t[k] || 1;
    const a = Math.min(1, Math.max(0, (fraction - t[k]) / span));
      const i = k * 3;
  const j = i + 3;
  return {
    x: positions[i] + (positions[j] - positions[i]) * a,
    y: positions[i + 1] + (positions[j + 1] - positions[i + 1]) * a,
    z: positions[i + 2] + (positions[j + 2] - positions[i + 2]) * a,
    segment: k,
  };
}