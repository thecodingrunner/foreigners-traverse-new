// Prints what the terrain data actually contains, at three stages:
//   1. the raw 国土地理院 tiles in the cache
//   2. terrain.png as written by build-terrain.mjs
//   3. a summary of the whole image
//
// Usage (from web/): node scripts/check-terrain.mjs

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { PNG } from "pngjs";
import { decodeElevation, lonLatToWorldPixel, TILE_SIZE } from "./lib/gsi.mjs";

const OUT_DIR = "public/explore";
const CACHE_DIR = "../data/dem-cache";
const ZOOM = 8;

// Places we know the answer for
const PLACES = [
  { name: "Sea of Japan (open sea)", lon: 135.5, lat: 38.5, expect: "sea" },
  { name: "Seto Inland Sea", lon: 133.2, lat: 34.25, expect: "sea" },
  { name: "Osaka city (low land)", lon: 135.5, lat: 34.69, expect: "~0–30 m" },
  { name: "Hiroshima city", lon: 132.46, lat: 34.39, expect: "~0–30 m" },
  { name: "Mt Ontake (Japanese Alps)", lon: 137.48, lat: 35.89, expect: "~2,500–3,000 m" },
  { name: "Lake Biwa", lon: 136.08, lat: 35.25, expect: "~85 m or sea-like" },
];

const meta = JSON.parse(await readFile(`${OUT_DIR}/terrain.json`, "utf8"));
const png = PNG.sync.read(await readFile(`${OUT_DIR}/terrain.png`));
console.log(`terrain.png: ${png.width}×${png.height} (terrain.json says ${meta.width}×${meta.height})`);
console.log(`bounds: ${meta.bounds.west.toFixed(2)}–${meta.bounds.east.toFixed(2)}°E, ${meta.bounds.south.toFixed(2)}–${meta.bounds.north.toFixed(2)}°N\n`);

/** 1. What the raw GSI tile says at a place */
async function rawTile(lon, lat) {
  const [wx, wy] = lonLatToWorldPixel(lon, lat, ZOOM);
  const tx = Math.floor(wx / TILE_SIZE), ty = Math.floor(wy / TILE_SIZE);
  const base = `${CACHE_DIR}/${ZOOM}-${tx}-${ty}`;
  if (existsSync(`${base}.sea`)) return "no tile (404 → open sea)";
  if (!existsSync(`${base}.png`)) return "not in cache";
  const tile = PNG.sync.read(await readFile(`${base}.png`));
  const i = ((Math.floor(wy) - ty * TILE_SIZE) * TILE_SIZE + (Math.floor(wx) - tx * TILE_SIZE)) * 4;
  const [r, g, b] = [tile.data[i], tile.data[i + 1], tile.data[i + 2]];
  const h = decodeElevation(r, g, b);
  return `rgb(${r},${g},${b}) → ${h === null ? "NO DATA (sea)" : `${h.toFixed(1)} m`}`;
}

/** 2. What terrain.png says at a place */
function ours(lon, lat) {
  const i = Math.floor(((lon - meta.bounds.west) / (meta.bounds.east - meta.bounds.west)) * png.width);
  const j = Math.floor(((meta.bounds.north - lat) / (meta.bounds.north - meta.bounds.south)) * png.height);
  if (i < 0 || j < 0 || i >= png.width || j >= png.height) return "outside the terrain";
  const p = (j * png.width + i) * 4;
  const [r, g, b] = [png.data[p], png.data[p + 1], png.data[p + 2]];
  const value = r * 256 + g;
  const height = value === 0 ? "SEA (value 0)" : `${(value * meta.elevation.stepM - meta.elevation.offsetM).toFixed(1)} m`;
  return `rgb(${r},${g},${b}) → value ${value} → ${height} · route ${Math.round((b / 255) * meta.distance.maxKm)} km away`;
}

for (const place of PLACES) {
  console.log(`${place.name}  (expect ${place.expect})`);
  console.log(`  GSI tile:     ${await rawTile(place.lon, place.lat)}`);
  console.log(`  terrain.png:  ${ours(place.lon, place.lat)}`);
}

// 3. Whole-image summary
let sea = 0, low = 0, max = 0;
const histogram = new Map();
for (let p = 0; p < png.width * png.height; p++) {
  const value = png.data[p * 4] * 256 + png.data[p * 4 + 1];
  if (value === 0) { sea++; continue; }
  const h = value * meta.elevation.stepM - meta.elevation.offsetM;
  if (h < 1) low++;
  max = Math.max(max, h);
  const bucket = Math.floor(h / 500) * 500;
  histogram.set(bucket, (histogram.get(bucket) ?? 0) + 1);
}
const total = png.width * png.height;
console.log(`\nSea (value 0):        ${((sea / total) * 100).toFixed(1)}% of pixels`);
console.log(`Land at < 1 m:        ${((low / total) * 100).toFixed(1)}% of pixels  ← if this is large, the sea was stored as land at 0 m`);
console.log(`Highest point:        ${Math.round(max)} m`);
console.log("Heights (land only):");
for (const [bucket, count] of [...histogram].sort((a, b) => a[0] - b[0])) {
  console.log(`  ${String(bucket).padStart(5)}–${String(bucket + 500).padEnd(5)} m  ${"█".repeat(Math.ceil((count / total) * 200))} ${((count / total) * 100).toFixed(1)}%`);
}