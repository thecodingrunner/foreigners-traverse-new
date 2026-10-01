import { readFile } from "node:fs/promises";
import { DOMParser } from "@xmldom/xmldom";
import { gpx } from "@tmcw/togeojson";

/** Every track point in a GPX file as [lon, lat, ele?], segments joined. */
export async function readTrackCoords(filePath) {
  const xml = await readFile(filePath, "utf8");
  const geo = gpx(new DOMParser().parseFromString(xml, "text/xml"));

  const coords = geo.features
    .flatMap((f) =>
      f.geometry?.type === "LineString"
        ? [f.geometry.coordinates]
        : f.geometry?.type === "MultiLineString"
          ? f.geometry.coordinates
          : [],
    )
    .flat();

  if (coords.length < 2) throw new Error(`${filePath}: no track points found`);
  return coords;
}

/** "stage-07.gpx" → 7 */
export function stageNumberFromFilename(name) {
    const match = name.match(/(\d+)/);
    if (!match) throw new Error(`Can't find a stage number in "${name}"`);
    return Number(match[1]);
}


