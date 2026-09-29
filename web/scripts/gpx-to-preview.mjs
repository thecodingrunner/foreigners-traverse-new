// web/scripts/gpx-to-preview.mjs
//
// Usage:
//   node scripts/gpx-to-preview.mjs <input.gpx> <output.json>
//   node scripts/gpx-to-preview.mjs <gpx-folder> <output-folder>

import { readFile, writeFile, readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { DOMParser } from "@xmldom/xmldom";
import { gpx } from "@tmcw/togeojson";
import simplify from "@turf/simplify";
import { lineString } from "@turf/helpers";
import distance from "@turf/distance";

const PROFILE_POINTS = 200; // points kept for the elevation chart
const LINE_TOLERANCE = 0.0005; // simplification tolerance in degrees (~50 m)
const CLIMB_THRESHOLD = 3;

async function processFile(inputPath, outputPath) {
  const xml = await readFile(inputPath, "utf8");
  const geo = gpx(new DOMParser().parseFromString(xml, "text/xml"));

  // 1. Collect every point from every track/route segment: [lon, lat, ele]
  const coords = geo.features
    .flatMap((f) =>
      f.geometry?.type === "LineString"
        ? [f.geometry.coordinates]
        : f.geometry?.type === "MultiLineString"
          ? f.geometry.coordinates
          : [],
    )
    .flat();

  if (coords.length < 2) throw new Error(`${inputPath}: no track points found`);
  if (coords.every((c) => c[2] == null)) {
    console.warn(`⚠ ${inputPath}: no elevation data; the profile will be flat`);
  }

  // 2. Cumulative distance along the route, and total climb
  let km = 0;
  let climb = 0;
  let lastEle = coords[0][2] ?? 0;

  const fullProfile = coords.map((c, i) => {
    if (i > 0) km += distance(coords[i - 1], c);
    const ele = c[2] ?? 0;
    if (ele - lastEle >= CLIMB_THRESHOLD) {
      climb += ele - lastEle;
      lastEle = ele;
    } else if (lastEle - ele >= CLIMB_THRESHOLD) {
      lastEle = ele;
    }
    return [Number(km.toFixed(2)), Math.round(ele)];
  });

  // 3. Thin the profile to ~PROFILE_POINTS, always keeping the last point
  const step = Math.max(1, Math.ceil(fullProfile.length / PROFILE_POINTS));
  const profile = fullProfile.filter(
    (_, i) => i % step === 0 || i === fullProfile.length - 1,
  );

  // 4. Simplified 2D line for small maps
  const line = simplify(lineString(coords.map(([lon, lat]) => [lon, lat])), {
    tolerance: LINE_TOLERANCE,
    highQuality: true,
  }).geometry.coordinates.map(([lon, lat]) => [
    Number(lon.toFixed(5)),
    Number(lat.toFixed(5)),
  ]);

  const preview = { distanceKm: Number(km.toFixed(1)), line, profile };
  await writeFile(outputPath, JSON.stringify(preview));

  console.log(
    `${path.basename(inputPath)}: ${coords.length} → ${line.length} line pts, ` +
      `${profile.length} profile pts, ${preview.distanceKm} km, ↑ ${Math.round(climb)} m`,
  );
}

// ---- Entry point: single file or whole folder ----
const [input, output] = process.argv.slice(2);
if (!input || !output) {
    console.error("Usage: node scripts/gpx-to-preview.mjs <input.gpx|folder> <output.json|folder>");
    process.exit(1);
}

if ((await stat(input)).isDirectory()) {
    await mkdir(output, { recursive: true });
    const files = (await readdir(input)).filter((f) => f.toLowerCase().endsWith(".gpx")).sort();
    for (const file of files) {
        await processFile(path.join(input, file), path.join(output, file.replace(/\.gpx$/i, ".json")));
    }
} else {
    await mkdir(path.dirname(output), { recursive: true });
    await processFile(input, output);
}