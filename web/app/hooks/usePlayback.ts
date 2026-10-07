import { useEffect } from "react";
import { useExplore, useExploreApi } from "~/stores/explore-context";
import { useMediaQuery } from "~/hooks/useMediaQuery";

const SLIDE_MS = 2500;

export function usePlayback() {
    const api = useExploreApi();
    const playing = useExplore((s) => s.playing);
    const speed = useExplore((s) => s.speed);
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    useEffect(() => {
        if (!playing) return;

        if (reducedMotion) {
            const id = setInterval(() => api.getState().advanceSlide(), SLIDE_MS / speed);
            return () => clearInterval(id);
        }

        let frame = 0;
        let last = performance.now();
        const loop = (now: number) => {
            const seconds = Math.min((now - last) / 1000, 0.1);
            last = now;
            api.getState().advance(seconds);
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, [api, playing, speed, reducedMotion]);

}