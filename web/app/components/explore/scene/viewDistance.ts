import { type Camera, MathUtils, type PerspectiveCamera, Vector3 } from "three";

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

/**
 * Screen pixels per km at the centre of the screen. The visible height at
 * distance d is 2·d·tan(fov / 2), and that height fills the viewport.
 */
export function pixelsPerKm(camera: Camera, viewportHeight: number) {
    const { fov } = camera as PerspectiveCamera;
    return viewportHeight / (2 * viewDistance(camera) * MathUtils.degToRad(fov / 2));
}