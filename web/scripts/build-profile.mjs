// Builds public/explore/profile.json: the elevation of every stage, sampled
// at a fixed distance step, for the explorer's whole-ride elevation profile.
//
//   { version, stepKm, maxM, stages: [{ stageNumber, km, elevations: [m, m, …] }] }
//
// elevations[i] is the height i × stepKm into the stage; the last value is
// the finish, wherever it falls. Usage (from web/): node scripts/build-profile.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import distance from "@turf/distance";
import { readAllStages } from "./lib/stages.mjs";

const GPX_DIR = "../data/gpx";
const OUT_FILE = "public/explore/profile.json";
const STEP_KM = 1;
const SMOOTH_POINTS = 5; // GPS heights are noisy: average this many neighbours

/** Moving average over `size` neighbours; keeps the array length. */
function smooth(values, size) {
  const half = Math.floor(size / 2);
  return values.map((_, i) => {
    let sum = 0;
    let n = 0;
    for (
      let j = Math.max(0, i - half);
      j <= Math.min(values.length - 1, i + half);
      j++
    ) {
      sum += values[j];
      n++;
    }
    return sum / n;
  });
}

/** Height at `km` along the stage, interpolated between the nearest track points. */
function heightAt(km, along, heights, cursor) {
  while (cursor.i < along.length - 2 && along[cursor.i + 1] < km) cursor.i++;
  const a = cursor.i;
  const span = along[a + 1] - along[a] || 1;
  const t = Math.min(1, Math.max(0, (km - along[a]) / span));
  return heights[a] + (heights[a + 1] - heights[a]) * t;
}

const stages = await readAllStages(GPX_DIR);
const output = [];
let maxM = 0;

for (const { file, stageNumber, coords } of stages) {
  if (coords.every((c) => c[2] == null)) {
    console.warn(`⚠ ${file}: no elevation data, skipped`);
    continue;
  }

  // Distance along the road at each track point, and its (smoothed) height
  const along = [0];
  for (let k = 1; k < coords.length; k++)
    along.push(along[k - 1] + distance(coords[k - 1], coords[k]));
  const heights = smooth(
    coords.map((c) => c[2] ?? 0),
    SMOOTH_POINTS,
  );
  const km = along.at(-1);

  // Resample every STEP_KM, plus the exact finish
  const cursor = { i: 0 }; // samples go forwards, so the search can too
  const elevations = [];
  for (let d = 0; d < km; d += STEP_KM)
    elevations.push(Math.round(heightAt(d, along, heights, cursor)));
  elevations.push(Math.round(heights.at(-1)));

  maxM = Math.max(maxM, ...elevations);
  output.push({ stageNumber, km: Math.round(km * 10) / 10, elevations });
  console.log(
    `${file}: ${km.toFixed(1)} km → ${elevations.length} samples, top ${Math.max(...elevations)} m`,
  );
}

await mkdir(path.dirname(OUT_FILE), { recursive: true });
await writeFile(
  OUT_FILE,
  JSON.stringify({ version: 1, stepKm: STEP_KM, maxM, stages: output }),
);
console.log(
  `Wrote ${output.length} stages to ${OUT_FILE} (highest point ${maxM} m)`,
);
