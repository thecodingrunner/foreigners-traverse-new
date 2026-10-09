// Builds the 3D explorer's terrain from 国土地理院 elevation tiles:
//   public/explore/terrain.png   R+G = elevation, B = distance to the route
//   public/explore/terrain.json  everything the browser needs to read it
//   ../data/explore-preview.png  a human-friendly preview (not shipped)
//
// Usage (from web/): node scripts/build-terrain.mjs

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import { readAllStages } from "./lib/stages.mjs";
import { createProjection } from "./lib/projection.mjs";
import {
  TILE_SIZE,
  decodeElevation,
  lonLatToWorldPixel,
  tileUrl,
} from "./lib/gsi.mjs";
import { distanceField } from "./lib/distance-field.mjs";

// ---------------------------------------------------------------- settings
const GPX_DIR = "../data/gpx";
const CACHE_DIR = "../data/dem-cache";
const OUT_DIR = "public/explore";
const PREVIEW_FILE = "../data/explore-preview.png";

const ZOOM = 8; // GSI tile zoom: ~550 m per pixel around Japan
const WIDTH = 2048; // output width in pixels (height follows the shape)
const MARGIN_DEG = 1.2; // land shown around the route
const CONCURRENCY = 4; // polite to GSI's servers
const ELEV_OFFSET_M = 100; // lets slightly-below-sea-level land be stored
const ELEV_STEP_M = 0.1; // 16-bit steps: 0.1 m precision up to ~6,400 m
const DIST_MAX_KM = 80; // distances beyond this are clamped

// ---------------------------------------------------------------- 1. bounds
const stages = await readAllStages(GPX_DIR);
const allCoords = stages.flatMap((s) => s.coords);

const lons = allCoords.map((c) => c[0]);
const lats = allCoords.map((c) => c[1]);
const bounds = {
  west: Math.min(...lons) - MARGIN_DEG,
  east: Math.max(...lons) + MARGIN_DEG,
  south: Math.min(...lats) - MARGIN_DEG,
  north: Math.max(...lats) + MARGIN_DEG,
};

const projection = createProjection(
  (bounds.west + bounds.east) / 2,
  (bounds.south + bounds.north) / 2,
);
const [minX, minZ] = projection.toScene(bounds.west, bounds.north);
const [maxX, maxZ] = projection.toScene(bounds.east, bounds.south);
const HEIGHT = Math.round((WIDTH * (maxZ - minZ)) / (maxX - minX));
const kmPerPixel = (maxX - minX) / WIDTH;

console.log(
  `${stages.length} stages · output ${WIDTH}×${HEIGHT} px · ${kmPerPixel.toFixed(2)} km/px`,
);

// ---------------------------------------------------------------- 2. tiles
const [wx0, wy0] = lonLatToWorldPixel(bounds.west, bounds.north, ZOOM);
const [wx1, wy1] = lonLatToWorldPixel(bounds.east, bounds.south, ZOOM);
const tileList = [];
for (
  let ty = Math.floor(wy0 / TILE_SIZE);
  ty <= Math.floor(wy1 / TILE_SIZE);
  ty++
) {
  for (
    let tx = Math.floor(wx0 / TILE_SIZE);
    tx <= Math.floor(wx1 / TILE_SIZE);
    tx++
  ) {
    tileList.push({ tx, ty });
  }
}

await mkdir(CACHE_DIR, { recursive: true });

async function loadTile({ tx, ty }) {
  const base = path.join(CACHE_DIR, `${ZOOM}-${tx}-${ty}`);
  if (existsSync(`${base}.png`))
    return PNG.sync.read(await readFile(`${base}.png`));
  if (existsSync(`${base}.sea`)) return null;

  const res = await fetch(tileUrl(ZOOM, tx, ty));
  if (res.status === 404) {
    await writeFile(`${base}.sea`, ""); // GSI has no tile for open sea
    return null;
  }
  if (!res.ok) throw new Error(`Tile ${tx},${ty}: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(`${base}.png`, buffer);
  return PNG.sync.read(buffer);
}

const tiles = new Map();
let done = 0;
let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < tileList.length) {
      const t = tileList[next++];
      tiles.set(`${t.tx},${t.ty}`, await loadTile(t));
      process.stdout.write(`\rTiles ${++done}/${tileList.length}`);
    }
  }),
);
console.log();

// ---------------------------------------------------------------- 3. resample
/** Elevation of one source (world) pixel, or null for sea. */
function sourcePixel(px, py) {
  const tx = Math.floor(px / TILE_SIZE);
  const ty = Math.floor(py / TILE_SIZE);
  const tile = tiles.get(`${tx},${ty}`);
  if (!tile) return null;
  const i = ((py - ty * TILE_SIZE) * TILE_SIZE + (px - tx * TILE_SIZE)) * 4;
  return decodeElevation(tile.data[i], tile.data[i + 1], tile.data[i + 2]);
}

/** Bilinear sample between the four nearest source pixels, ignoring sea. */
function elevationAt(lon, lat) {
  const [wx, wy] = lonLatToWorldPixel(lon, lat, ZOOM);
  const x0 = Math.floor(wx - 0.5);
  const y0 = Math.floor(wy - 0.5);
  const fx = wx - 0.5 - x0;
  const fy = wy - 0.5 - y0;
  let sum = 0;
  let weight = 0;
  for (const [dx, dy, w] of [
    [0, 0, (1 - fx) * (1 - fy)],
    [1, 0, fx * (1 - fy)],
    [0, 1, (1 - fx) * fy],
    [1, 1, fx * fy],
  ]) {
    const h = sourcePixel(x0 + dx, y0 + dy);
    if (h === null || w === 0) continue;
    sum += h * w;
    weight += w;
  }
  return weight > 0.5 ? sum / weight : null; // mostly sea → sea
}

const elevation = new Float32Array(WIDTH * HEIGHT).fill(NaN);
for (let j = 0; j < HEIGHT; j++) {
  const lat =
    bounds.north - ((j + 0.5) / HEIGHT) * (bounds.north - bounds.south);
  for (let i = 0; i < WIDTH; i++) {
    const lon = bounds.west + ((i + 0.5) / WIDTH) * (bounds.east - bounds.west);
    const h = elevationAt(lon, lat);
    if (h !== null) elevation[j * WIDTH + i] = h;
  }
}

// ---------------------------------------------------------------- 4. distance field
/** [lon, lat] -> fractional pixel position in the output image. */
const toGrid = (lon, lat) => [
  ((lon - bounds.west) / (bounds.east - bounds.west)) * WIDTH,
  ((bounds.north - lat) / (bounds.north - bounds.south)) * HEIGHT,
];

const routeMask = new Uint8Array(WIDTH * HEIGHT);
for (const { coords } of stages) {
  for (let k = 1; k < coords.length; k++) {
    const [ax, ay] = toGrid(coords[k - 1][0], coords[k - 1][1]);
    const [bx, by] = toGrid(coords[k][0], coords[k][1]);
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) * 2));
    for (let s = 0; s <= steps; s++) {
      const x = Math.floor(ax + ((bx - ax) * s) / steps);
      const y = Math.floor(ay + ((by - ay) * s) / steps);
      if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT)
        routeMask[y * WIDTH + x] = 1;
    }
  }
}

const distancePx = distanceField(routeMask, WIDTH, HEIGHT);

// ---------------------------------------------------------------- 5. encode + write
const terrain = new PNG({ width: WIDTH, height: HEIGHT });
const preview = new PNG({ width: WIDTH, height: HEIGHT });
let maxElevation = 0;

for (let p = 0; p < WIDTH * HEIGHT; p++) {
  const h = elevation[p];
  const isLand = !Number.isNaN(h);
  const value = isLand
    ? Math.min(
        65535,
        Math.max(1, Math.round((h + ELEV_OFFSET_M) / ELEV_STEP_M)),
      )
    : 0;
  const distKm = distancePx[p] * kmPerPixel;
  const i = p * 4;

  terrain.data[i] = value >> 8; // R: elevation, high byte
  terrain.data[i + 1] = value & 255; // G: elevation, low byte
  terrain.data[i + 2] = Math.round(Math.min(1, distKm / DIST_MAX_KM) * 255); // B: distance
  terrain.data[i + 3] = 255; // A: always opaque (RGB output; sea lives in R+G = 0)

  if (isLand) maxElevation = Math.max(maxElevation, h);
  const shade = isLand ? 60 + Math.min(195, h / 12) : 20;
  const onRoute = routeMask[p] === 1;
  preview.data[i] = onRoute ? 220 : shade;
  preview.data[i + 1] = onRoute ? 40 : shade;
  preview.data[i + 2] = onRoute ? 40 : shade;
  preview.data[i + 3] = 255;
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(
  path.join(OUT_DIR, "terrain.png"),
  PNG.sync.write(terrain, { colorType: 2 }),
);
await writeFile(PREVIEW_FILE, PNG.sync.write(preview, { colorType: 2 }));

const meta = {
  version: 1,
  width: WIDTH,
  height: HEIGHT,
  bounds,
  projection: {
    lon0: projection.lon0,
    lat0: projection.lat0,
    kx: projection.kx,
    kz: projection.kz,
  },
  scene: { minX, minZ, maxX, maxZ },
  elevation: {
    offsetM: ELEV_OFFSET_M,
    stepM: ELEV_STEP_M,
    maxM: Math.round(maxElevation),
  },
  distance: { maxKm: DIST_MAX_KM },
  attribution: "出典：国土地理院",
};
await writeFile(
  path.join(OUT_DIR, "terrain.json"),
  JSON.stringify(meta, null, 2),
);

console.log(
  `Done. Highest point ${Math.round(maxElevation)} m. Preview: ${PREVIEW_FILE}`,
);
