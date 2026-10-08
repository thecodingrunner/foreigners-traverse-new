// Helpers for 国土地理院 (GSI) elevation tiles: 標高タイル, PNG format.
// Spec: https://maps.gsi.go.jp/development/demtile.html

// TODO: Make sure you understand the maths behind these functions

export const TILE_SIZE = 256;

export const tileUrl = (z, x, y) =>
  `https://cyberjapandata.gsi.go.jp/xyz/dem_png/${z}/${x}/${y}.png`;

/**
 * Web Mercator: [lon, lat] → "world pixel" coordinates at zoom z.
 * Dividing by 256 and flooring gives the tile; the remainder is the pixel inside it.
 */
export function lonLatToWorldPixel(lon, lat, z) {
    const size = TILE_SIZE * 2 ** z;
    const sin = Math.sin((lat * Math.PI) / 180);
    const x = ((lon + 180) / 360) * size;
    const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size;
    return [x, y];
}

const NO_DATA = 2 ** 23;

/** One pixel's RGB → elevation in metres, or null for "no data" (the sea). */
export function decodeElevation(r, g, b) {
    const v = r * 65536 + g * 256 + b;
    if (v === NO_DATA) return null;
    return (v < NO_DATA ? v : v - 2 ** 24) * 0.1;
}