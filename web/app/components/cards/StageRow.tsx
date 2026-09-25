import { Link } from "react-router";
import type { StageSummary } from "~/data/stages.server";

type StageRowProps = {
  stage: StageSummary
};

export default function StageRow({stage}: StageRowProps) {
    return (
        <Link className="stage-row" to={`/journal/${stage.slug}`}>
            {stage.coverImage?.url ? (
                <img src={stage.coverImage?.url} />
            ) : (
                <div className="image-placeholder"></div>
            )}

            <div className="stage-info flex flex-col items-start">
                <div className="text-label-sm flex gap-2">
                    <span>Day {stage.stageNumber}</span>
                    ·
                    <span>{stage.stats?.distanceKm} km</span>
                </div>

                <h3 className="text-h5">{stage.title}</h3>
            </div>
        </Link>
    )
}