// Downloads the explorer's three asset files with real byte-level progress.
// No three.js in here, so the loading screen doesn't have to wait for it.

import { useEffect, useState } from "react";

export type TerrainMeta = {
  version: number;
  width: number;
  height: number;
  bounds: { west: number; east: number; south: number; north: number };
  projection: { lon0: number; lat0: number; kx: number; kz: number };
  scene: { minX: number; minZ: number; maxX: number; maxZ: number };
  elevation: { offsetM: number; stepM: number; maxM: number };
  distance: { maxKm: number };
  attribution: string;
};

export type RouteStage = {
  stageNumber: number;
  km: number;
  positions: number[];
  t: number[];
};
export type RouteData = { version: number; stages: RouteStage[] };

export type ExploreAssets = {
  meta: TerrainMeta;
  route: RouteData;
  heightmap: HTMLImageElement;
};
export type LoadProgress = { loaded: number; total: number | null };

type AssetsState =
  | { status: "loading"; progress: LoadProgress }
  | { status: "ready"; assets: ExploreAssets }
  | { status: "error" };

const FILES = {
  meta: "/explore/terrain.json",
  route: "/explore/route.json",
  heightmap: "/explore/terrain.png",
} as const;

// ---- shared download state (one download, however many components ask)
let promise: Promise<ExploreAssets> | null = null;
let progress: LoadProgress = { loaded: 0, total: null };
const totals = new Map<string, number | null>();
const listeners = new Set<(p: LoadProgress) => void>();

function report(bytes: number) {
    const known = [...totals.values()];
    const allKnown = known.length === Object.keys(FILES).length && known.every((n) => n != null);
    progress = {
        loaded: progress.loaded + bytes,
        total: allKnown ? known.reduce<number>((sum, n) => sum + (n ?? 0), 0) : null,
    };
    listeners.forEach((listener) => listener(progress));
}

async function download(key: string, url: string) {
    const res = await fetch(url);
    if (!res.ok || !res.body) throw new Error(`${url}: HTTP ${res.status}`);
    const length = res.headers.get("content-length");
    totals.set(key, length ? Number(length) : null);
    report(0);

    const reader = res.body.getReader();
    const chunks: BlobPart[] = [];
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        report(value.byteLength);
    }
    return new Blob(chunks);
}

async function decodeImage(blob: Blob) {
    const image = new Image();
    image.src = URL.createObjectURL(blob);
    await image.decode();
    return image;
}

export function loadExploreAssets() {
    promise ??= (async () => {
        const [meta, route, png] = await Promise.all(
            Object.entries(FILES).map(async ([key, url]) => download(key, url)),
        );
        return {
            meta: JSON.parse(await meta.text()) as TerrainMeta,
            route: JSON.parse(await route.text()) as RouteData,
            heightmap: await decodeImage(png),
        };
    })();
    promise.catch(() => {
        promise = null;
        progress = { loaded: 0, total: null };
        totals.clear();
    });
    return promise;
}

export function useExploreAssets(attempt = 0) {
    const [state, setState] = useState<AssetsState>({ status: "loading", progress });

    useEffect(() => {
        let active = true;
        setState({ status: "loading", progress });
        const onProgress = (p: LoadProgress) => active && setState({ status: "loading", progress: p });
        listeners.add(onProgress);
        loadExploreAssets().then(
            (assets) => active && setState({ status: "ready", assets }),
            () => active && setState({ status: "error" }),
        );
        return () => {
            active = false;
            listeners.delete(onProgress);
        }
    }, [attempt]);

    return state;
}