// Builds public/explore/route.json: every stage's line in 3D scene
// coordinates (km), sitting on the terrain, with how far along the
// stage each point is (t = 0 at the start, 1 at the end).
//
// Run after build-terrain.mjs. Usage (from web/): node scripts/build-route3d.mjs

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import simplify from "@turf/simplify";
import { lineString } from "@turf/helpers";
import distance from "@turf/distance";
import { readAllStages } from "./lib/stages.mjs";
import { createProjection } from "./lib/projection.mjs";

const GPX_DIR = "../data/gpx";
const OUT_DIR = "public/explore";
const TOLERANCE = 0.0005; // ≈ 50 m: smooth enough for the follow camera
const DRAPE_OFFSET_KM = 0.03; // lift the line slightly so it never sinks into the mesh

// ---------------------------------------------------------------- terrain
const meta = JSON.parse(
  await readFile(path.join(OUT_DIR, "terrain.json"), "utf8"),
);
const terrain = PNG.sync.read(
  await readFile(path.join(OUT_DIR, "terrain.png")),
);
const projection = createProjection(meta.projection.lon0, meta.projection.lat0);
const { minX, maxX, minZ, maxZ } = meta.scene;

/** Elevation in km of one terrain pixel (sea = 0). */
function pixelHeightKm(i, j) {
  const x = Math.min(meta.width - 1, Math.max(0, i));
  const y = Math.min(meta.height - 1, Math.max(0, j));
  const p = (y * meta.width + x) * 4;
  const value = terrain.data[p] * 256 + terrain.data[p + 1];
  if (value === 0) return 0;
  return (
    Math.max(0, value * meta.elevation.stepM - meta.elevation.offsetM) / 1000
  );
}

/** Bilinear height in km at a scene position. */
function heightAt(x, z) {
  const u = ((x - minX) / (maxX - minX)) * meta.width - 0.5;
  const v = ((z - minZ) / (maxZ - minZ)) * meta.height - 0.5;
  const i = Math.floor(u);
  const j = Math.floor(v);
  const fu = u - i;
  const fv = v - j;
  return (
    pixelHeightKm(i, j) * (1 - fu) * (1 - fv) +
    pixelHeightKm(i + 1, j) * fu * (1 - fv) +
    pixelHeightKm(i, j + 1) * (1 - fu) * fv +
    pixelHeightKm(i + 1, j + 1) * fu * fv
  );
}

// ---------------------------------------------------------------- stages
const round3 = (n) => Math.round(n * 1000) / 1000;
const stages = await readAllStages(GPX_DIR);
const output = [];

for (const { file, stageNumber, coords } of stages) {
  const line = simplify(lineString(coords.map(([lon, lat]) => [lon, lat])), {
    tolerance: TOLERANCE,
    highQuality: true,
  }).geometry.coordinates;

  // Distance along the stage at each point (km, along the real road)
  const along = [0];
  for (let k = 1; k < line.length; k++) {
    along.push(along[k - 1] + distance(line[k - 1], line[k]));
  }
  const totalKm = along.at(-1);

  const positions = [];
  for (const [lon, lat] of line) {
    const [x, z] = projection.toScene(lon, lat);
    positions.push(
      round3(x),
      round3(heightAt(x, z) + DRAPE_OFFSET_KM),
      round3(z),
    );
  }

  output.push({
    stageNumber,
    km: Math.round(totalKm * 10) / 10,
    positions,
    t: along.map((d) => Math.round(d / totalKm * 10000) / 10000),
  });

  console.log(
    `${file}: ${coords.length} → ${line.length} points, ${totalKm.toFixed(1)} km`,
  );
}

await writeFile(path.join(OUT_DIR, "route.json"), JSON.stringify({ version: 1, stages: output }));
console.log(`Wrote ${output.length} stages to ${OUT_DIR}/route.json`);