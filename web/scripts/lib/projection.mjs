// One projection, shared by every script, so the terrain and the route
// always land in exactly the same place in the 3D scene.

const KM_PER_DEG_LAT = 110.574;
const KM_PER_DEG_LON_AT_EQUATOR = 111.32;

/**
 * Equirectangular projection centred on (lon0, lat0), in kilometres.
 * Scene axes: +x = east, +z = south (so north is "into the screen"), +y = up.
 */
export function createProjection(lon0, lat0) {
    const kx = KM_PER_DEG_LON_AT_EQUATOR * Math.cos((lat0 * Math.PI) / 180);
    const kz = KM_PER_DEG_LAT;

    return {
        lon0,
        lat0,
        kx,
        kz,
        toScene: (lon, lat) => [(lon - lon0) * kx, -(lat - lat0) * kz],
    };
}