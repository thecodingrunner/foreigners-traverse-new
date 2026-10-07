import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { ExploreStage } from "~/data/stages.server";
import { indexAt } from "~/lib/explore";
import { localePath, useLocale } from "~/lib/i18n";
import { useExplore, useExploreApi } from "~/stores/explore-context";

export function useExploreUrlSync(stages: ExploreStage[], urlIndex: number) {
    const api = useExploreApi();
    const navigate = useNavigate();
    const locale = useLocale();
    const index = useExplore((s) => indexAt(s.position, s.count));
    const atStart = useExplore((s) => s.position === 0);
    const pushed = useRef<number | null>(null);

    // URL -> store: the address changed from outside
    useEffect(() => {
        if (urlIndex < 0) return;
        if (pushed.current === urlIndex) {
            pushed.current = null;
            return;
        }
        if (indexAt(api.getState().position, stages.length) !== urlIndex) {
            api.getState().selectIndex(urlIndex);
        }
    }, [urlIndex]);

    // Store -> URL: the stage changed through playback, scrubbing or the keyboard
    useEffect(() => {
        if (index === urlIndex) return;
        if (urlIndex < 0 && atStart) return;
        pushed.current = index;
        navigate(localePath(`/explore/${stages[index].stageNumber}`, locale), {
            replace: true,
            preventScrollReset: true
        });
    }, [index, atStart]);
}