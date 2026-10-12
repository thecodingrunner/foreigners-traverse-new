import { type Camera, MathUtils, type PerspectiveCamera, Vector3 } from "three";
import { pixelsPerKmAt } from "./framing";

const forward = new Vector3();

/**
 * Distance (km) from the camera to the ground at the centre of the screen.
 * Follows the view direction down to sea level (y = 0). Works for any camera
 * mode, so effects can be sized "relative to what you're looking at".
 */
export function viewDistance(camera: Camera) {
    camera.getWorldDirection(forward);
    return forward.y < -0.01 ? camera.position.y / -forward.y : camera.position.length();
}

/** Screen pixels per km at the centre of the view. */
export function pixelsPerKm(camera: Camera, viewportHeight: number) {
  return pixelsPerKmAt(camera as PerspectiveCamera, viewDistance(camera), viewportHeight);
}