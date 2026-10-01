import type { ExploreStage } from "~/data/stages.server";

export function pickStage(stages: ExploreStage[], param?: string) {
    const n = Number(param);
    return stages.find((s) => s.stageNumber === n) ?? stages[0];
}