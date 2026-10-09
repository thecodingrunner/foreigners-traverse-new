import { useLayoutEffect, useRef, type DependencyList } from "react";
import { useThree } from "@react-three/fiber";
import { useExploreApi } from "~/stores/explore-context";

/**
 * Runs `callback` now and whenever the playhead moves, then asks R3F for a
 * new frame. Bypasses React rendering entirely: no re-render per frame.
 */
export function useOnPosition(
    callback: (position: number, count: number) => void,
    deps: DependencyList,
) {
    const api = useExploreApi();
    const invalidate = useThree((state) => state.invalidate);
    const latest = useRef(callback);
    latest.current = callback;

    useLayoutEffect(() => {
        const run = () => {
            const { position, count } = api.getState();
            latest.current(position, count);
            invalidate();
        };
        run();
        return api.subscribe((state, previous) => {
            if (state.position !== previous.position) run();
        });
    }, [api, invalidate, ...deps]);
}