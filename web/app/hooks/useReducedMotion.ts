import { useMediaQuery } from "~/hooks/useMediaQuery";

/**
 * True when the visitor has asked their OS for less motion. One place for
 * the query string, so playback, the camera and the UI always agree.
 * False during server rendering; the real value arrives on hydration.
 */
export function useReducedMotion() {
    return useMediaQuery("(prefers-reduced-motion: reduce)");
}