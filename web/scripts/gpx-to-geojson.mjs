// web/scripts/gpx-to-geojson.mjs
//
// Usage: node scripts/gpx-to-geojson.mjs <gpx-folder> <output.geojson>

import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import simplify from "@turf/simplify";
import { lineString } from "@turf/helpers";
import { readTrackCoords, stageNumberFromFilename } from "./lib/gpx.mjs";

const TOLERANCE = 0.001;
const round = ([lon, lat]) => [Number(lon.toFixed(5)), Number(lat.toFixed(5))];

const [inputDir, outputFile] = process.argv.slice(2);
if (!inputDir || !outputFile) {
  console.error(
    "Usage: node scripts/gpx-to-geojson.mjs <input.gpx|folder> <output.geojson|folder>",
  );
  process.exit(1);
}

const files = (await readdir(inputDir))
  .filter((f) => f.toLowerCase().endsWith(".gpx"))
  .map((f) => ({ file: f, stageNumber: stageNumberFromFilename(f) }))
  .sort((a, b) => a.stageNumber - b.stageNumber);

const lines = [];
const points = [];

for (const [i, { file, stageNumber }] of files.entries()) {
  const coords = await readTrackCoords(path.join(inputDir, file));

  const simplified = simplify(
    lineString(coords.map(([lon, lat]) => [lon, lat])),
    {
      tolerance: TOLERANCE,
      highQuality: true,
    },
  ).geometry.coordinates.map(round);

  lines.push({
    type: "Feature",
    properties: { stageNumber },
    geometry: { type: "LineString", coordinates: simplified },
  });

  if (i === 0) {
    points.push({
      type: "Feature",
      properties: { stageNumber, kind: "start" },
      geometry: { type: "Point", coordinates: round(coords[0]) },
    });
  }

  const isLast = i === files.length - 1;
  points.push({
    type: "Feature",
    properties: { stageNumber, kind: isLast ? "finish" : "end" },
    geometry: { type: "Point", coordinates: simplified.at(-1) },
  });

  console.log(`${file}: stage ${stageNumber}, ${coords.length} → ${simplified.length} points`);
}

const collection = { type: "FeatureCollection", features: [...lines, ...points] };

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, JSON.stringify(collection));
console.log(`Wrote ${lines.length} lines and ${lines.length} stages to ${outputFile}`);