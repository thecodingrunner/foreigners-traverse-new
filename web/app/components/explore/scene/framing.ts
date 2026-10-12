import { MathUtils, type PerspectiveCamera, Vector3 } from "three";
import type { Insets } from "./useSceneInsets";

/** Where the camera is, described relative to what it looks at. */
export type Pose = {
    target: Vector3; // the point in the centre of the visible area
    distance: number; // km from the target
    pitch: number; // radians away from straight down
    yaw: number; // radians; 0 = camera south of the target, looking north
}

/**
 * Lens shift. The panel covers the right of the screen and the timeline the
 * bottom, so "the middle of the view" should be the middle of what's LEFT,
 * not of the whole canvas. Moving the camera would make it look at the
 * wrong thing; instead we move the lens, like a tilt-shift camera.
 *
 * setViewOffset says: imagine a bigger screen (fullWidth × fullHeight) whose
 * centre is where we want ours to be, and draw only the part of it that's
 * our real canvas. Orbiting, follow and zoom then all pivot on the centre of
 * the visible area for free.
 */
export function applyLensShift(camera: PerspectiveCamera, width: number, height: number, insets: Insets) {
    // How far the visible area's centre is from the canvas centre (+ = right / down)
    const dx = (insets.left - insets.right) / 2;
    const dy = (insets.top - insets.bottom) / 2;

    const fullWidth = width + 2 * Math.abs(dx);
    const fullHeight = height + 2 * Math.abs(dy);
    const x = dx < 0 ? 2 * Math.abs(dx) : 0;
    const y = dy < 0 ? 2 * Math.abs(dy) : 0;

    // With a view offset, aspect must describe the imaginary full screen
    camera.aspect = fullWidth / fullHeight;
    camera.setViewOffset(fullWidth, fullHeight, x, y, width, height);
    camera.updateProjectionMatrix();
}

/**
 * Screen pixels per km at `distance` from the camera. The field of view
 * covers the imaginary full height (see applyLensShift), not the canvas.
 */
export function pixelsPerKmAt(camera: PerspectiveCamera, distance: number, viewportHeight: number) {
    const fullHeight = camera.view?.enabled ? camera.view.fullHeight : viewportHeight;
    return fullHeight / (2 * distance * Math.tan(MathUtils.degToRad(camera.fov / 2)));
}

/** The distance at which `km` of ground fills `px` pixels of screen. */
export function distanceToFit(camera: PerspectiveCamera, km: number, px: number, viewportHeight: number) {
    return (km / px) * pixelsPerKmAt(camera, 1, viewportHeight);
}

// ---------------------------------------------------------------- poses

const offset = new Vector3();

/** Place the camera according to a pose. */
export function applyPose(camera: PerspectiveCamera, pose: Pose) {
    const flat = Math.sin(pose.pitch) * pose.distance;
    offset.set(-Math.sin(pose.yaw) * flat, Math.cos(pose.pitch) * pose.distance, Math.cos(pose.yaw) * flat);
    camera.position.copy(pose.target).add(offset);
    camera.lookAt(pose.target);
}

/** Shortest signed angle from a to b, so a turn never goes the long way round. */
export function angleBetween(a: number, b: number) {
    return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

/**
 * A pose `k` of the way (0–1) from `a` to `b`. Distance is blended in log
 * space so zooming feels even: 100 → 1,000 km passes 316 km halfway, not 550.
 */
export function mixPose(a: Pose, b: Pose, k: number, out: Pose): Pose {
    out.target.lerpVectors(a.target, b.target, k);
    out.distance = Math.exp(MathUtils.lerp(Math.log(a.distance), Math.log(b.distance), k));
    out.pitch = MathUtils.lerp(a.pitch, b.pitch, k);
    out.yaw = a.yaw + angleBetween(a.yaw, b.yaw) * k;
    return out;
}

export const createPose = (): Pose => ({ target: new Vector3(), distance: 1, pitch: 0, yaw: 0 });

export function copyPose(from: Pose, to: Pose) {
    to.target.copy(from.target);
    to.distance = from.distance;
    to.pitch = from.pitch;
    to.yaw = from.yaw;
    return to;
}

/** Ease-out cubic: starts quickly, settles gently. */
export const easeOut = (k: number) => 1 - (1 - k) ** 3;

/**
 * Frame-rate independent smoothing: how much of the remaining gap to close
 * this frame so that, whatever the frame rate, about 63% of any gap is
 * closed every `lagSeconds`. lerp(current, target, smoothing(...)) each frame
 * gives a gentle "catch up" instead of a rigid lock.
 */
export function smoothing(lagSeconds: number, deltaSeconds: number) {
  return lagSeconds <= 0 ? 1 : 1 - Math.exp(-deltaSeconds / lagSeconds);
}