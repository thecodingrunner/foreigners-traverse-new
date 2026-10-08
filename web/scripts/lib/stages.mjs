import { readdir } from "node:fs/promises";
import path from "node:path";
import { readTrackCoords, stageNumberFromFilename } from "./gpx.mjs";

/** Every GPX file in a folder, read and sorted by stage number */
export async function readAllStages(gpxDir) {
    const files = (await readdir(gpxDir)).filter((f) => f.toLowerCase().endsWith(".gpx"));
    const stages = await Promise.all(
        files.map(async (file) => ({
            file,
            stageNumber: stageNumberFromFilename(file),
            coords: await readTrackCoords(path.join(gpxDir, file)),
        })),
    );
    return stages.sort((a, b) => a.stageNumber - b.stageNumber);
}