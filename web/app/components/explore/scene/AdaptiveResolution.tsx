import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useExploreApi } from "~/stores/explore-context";

/** Below this frame rate (averaged over ~90 frames of playback), render fewer pixels. */
const TARGET_FPS = 40;
const SAMPLE_FRAMES = 90;

/**
 * Lowers the device pixel ratio, a step at a time, if the explorer can't
 * keep up during playback. It only measures while playing: with
 * frameloop="demand" an idle scene draws nothing at all, which a generic fps
 * meter (like drei's PerformanceMonitor) would mistake for a slow device.
 */
export default function AdaptiveResolution({ minDpr = 1 }: { minDpr?: number }) {
    const api = useExploreApi();
    const setDpr = useThree((s) => s.setDpr);
    const samples = useRef<number[]>([]);
    const wasPlaying = useRef(false);

    useFrame((state, delta) => {
        const playing = api.getState().playing;

        if (!playing || !wasPlaying.current) {
            wasPlaying.current = playing;
            samples.current = [];
            return;
        }

        const list = samples.current;
        list.push(delta);
        if (list.length < SAMPLE_FRAMES) return;

        const average = list.reduce((sum, d) => sum + d, 0) / list.length;
        samples.current = [];
        const dpr = state.viewport.dpr;
        if (average > 1 / TARGET_FPS && dpr > minDpr) {
            setDpr(Math.max(minDpr, Math.round(dpr * 0.75 * 100) / 100));
        }
    });

    return null;
}