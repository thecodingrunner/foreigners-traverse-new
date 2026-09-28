import type { StageSummary } from "~/data/stages.server"
import { getLocale } from "~/lib/i18n";
import StageCard from "../cards/StageCard";

type ArchiveGridProps = {
    stages: StageSummary[]
}

export default function ArchiveGrid({stages}: ArchiveGridProps) {
    const locale = getLocale(undefined);

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stages.map((stage) => (
                <StageCard key={stage.slug} stage={stage} />
            ))}
        </section>
    )
}