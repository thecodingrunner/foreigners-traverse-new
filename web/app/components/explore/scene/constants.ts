import { MathUtils, Vector3 } from "three";

/** Vertical exaggeration: real relief looks flat at the scale of a whole country */
export const EXAGGERATION = 10;

// ---------------------------------------------------------------- terrain look

/** Sun: azimuth 315° (north-west), 35° above the horizon. */
const SUN_AZIMUTH = MathUtils.degToRad(315);
const SUN_ALTITUDE = MathUtils.degToRad(35);

/**
 * Unit vector pointing TOWARDS the sun, in scene axes (+x east, +z south, +y up).
 * Azimuth is clockwise from north, and north is −z.
 */
export const SUN_DIRECTION = new Vector3(
    Math.sin(SUN_AZIMUTH) * Math.cos(SUN_ALTITUDE),
    Math.sin(SUN_ALTITUDE),
    -Math.cos(SUN_AZIMUTH) * Math.cos(SUN_ALTITUDE),
);

/** Terrain colour reaches --terrain-high at this height. */
export const HIGH_GROUND_M = 1500;

/** Contour intervals in metres: minor, major. */
export const CONTOUR_STEP_M = [100, 500] as const;

/** Share of the terrain rectangle, at each edge, faded into the sky. */
export const EDGE_FADE = 0.06;

/**
 * exp² fog, density 0.9 from the design, measured in units of
 * FOG_REACH × the distance to whatever is in the middle of the screen.
 * With a reach of 3: ~9% haze at the centre of the view, ~55% at three
 * times that distance (the horizon, once the camera tilts up).
 */
export const FOG_DENSITY = 1;
export const FOG_REACH = 3;

// ---------------------------------------------------------------- route look

/** Screen-space line widths in px. */
export const LINE_WIDTH = { ridden: 3, halo: 10, unridden: 2 } as const;

/** Unridden dash pattern in px: 2 on, 7 off. */
export const UNRIDDEN_DASH_PX = [2, 7] as const;

// ---------------------------------------------------------------- camera

/**
 * Camera modes from the design spec. Pitch is the tilt away from straight
 * down. Span is how many km of ground fit across the visible area (the part
 * of the screen not covered by the panel and bars) at the point we look at.
 */
export const CAMERA = {
    overview: { pitchDeg: 22, margin: 1.1 },
    follow: { pitchDeg: 48, spanKm: 260 },
    orbit: { pitchDeg: 42, spanKm: 260, minSpanKm: 40, maxSpanKm: 1500 },
    transitionMs: 1100,
} as const;

/** Orbit: degrees of turn per pixel dragged, and zoom per wheel "click". */
export const ORBIT_DEG_PER_PX = 0.3;
export const ORBIT_ZOOM_PER_WHEEL = 0.0015;