import type { ExploreStage } from "~/data/stages.server";

export function pickStage(stages: ExploreStage[], param?: string) {
  const n = Number(param);
  return stages.find((s) => s.stageNumber === n) ?? stages[0];
}

export type Distances = { kms: number[]; cum: number[]; total: number };

// Per-stage distances, and the cumulative distance before each stage.
export function buildDistances(stages: ExploreStage[]): Distances {
  const kms = stages.map((s) => s.stats?.distanceKm ?? 0);
  const cum: number[] = [];
  let total = 0;
  for (const km of kms) {
    cum.push(total);
    total += km;
  }
  return { kms, cum, total };
}

// Index of the stage shown at a position.
export function indexAt(position: number, count: number) {
    return Math.min(count - 1, Math.max(0, Math.ceil(position) - 1));
}

// Position -> how far along the whole ride, 0 to 1, by distance.
export function toFraction(position: number, { kms, cum, total }: Distances) {
    const i = Math.min(Math.floor(position), kms.length - 1);
    return (cum[i] + (position - i) * kms[i]) / total;
}

// The reverse: a 0-1 point on the timeline -> positon.
export function fromFraction(fraction: number, { kms, cum, total }: Distances) {
    const km = Math.min(1, Math.max(0, fraction)) * total;
    let i = kms.length - 1;
    while (i > 0 && cum[i] > km) i--;
    return i + Math.min(1, (km - cum[i]) / kms[i]);
}

// Index of the stage named in the URL, or -1 if there isn't one.
export function indexFromParam(stages: ExploreStage[], param?: string) {
    return param === undefined ? -1 : stages.findIndex((s) => s.stageNumber === Number(param));
}