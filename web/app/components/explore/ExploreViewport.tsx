import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import type { ExploreStage } from "~/data/stages.server";
import { detectWebGL2 } from "~/lib/webgl";
import { useExploreAssets } from "./scene/assets";
import { NoWebGLCard, SceneError, SceneLoading } from "./SceneStatus";

const loadScene = () => import("./scene/ExploreScene");
const ExploreScene = lazy(loadScene);

type Props = { stages: ExploreStage[] };

export default function ExploreViewport({ stages }: Props) {
    return (
        <div className="explore-viewport">
            <ClientOnly fallback={<SceneLoading progress={null} />}>
                {() => <ClientViewport stages={stages} />}
            </ClientOnly>
        </div>
    );
}

function ClientViewport({ stages }: Props) {
    const [webgl, setWebgl] = useState(detectWebGL2());
    if (!webgl) return <NoWebGLCard />;
    return <SceneWithAssets stages={stages} onContextLost={() => setWebgl(false)} />;
}

function SceneWithAssets({ stages, onContextLost }: Props & { onContextLost: () => void }) {
    const [attempt, setAttempt] = useState(0);
    const state = useExploreAssets(attempt);

    // Start downloading three.js at the same time as the terrain, not after it
    useEffect(() => {
        loadScene();
    }, []);

    if (state.status === "error") return <SceneError onRetry={() => setAttempt((a) => a + 1)} />;
    if (state.status === "loading") return <SceneLoading progress={state.progress} />;

    return (
        <Suspense fallback={<SceneLoading progress={{ loaded: 1, total: 1 }} />} >
            <ExploreScene assets={state.assets} stages={stages} onContextLost={onContextLost} />
        </Suspense>
    )
}