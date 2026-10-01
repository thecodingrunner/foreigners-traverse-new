import { useMemo } from "react";
import { Link } from "react-router";
import type { ExploreStage } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { localePath, useLocale } from "~/lib/i18n";
import { routeLabel } from "~/lib/places";
import type { Region } from "~/lib/regions";

type ExploreTimelineProps = { stages: ExploreStage[]; current: number | null };

function regionGroups(stages: ExploreStage[]) {
    const groups: { region: Region | null; km: number }[] = [];
    for (const s of stages) {
        const km = s.stats?.distanceKm ?? 0;
        const last = groups.at(-1);
        if (last && last.region === s.region) last.km += km;
        else groups.push({ region: s.region as Region | null, km });
    }
    return groups;
}

export default function ExploreTimeline({ stages, current }: ExploreTimelineProps) {
    const locale = useLocale();
    const t = useT();
    const groups = useMemo(() => regionGroups(stages), [stages]);

    return (
        <section className="explore-timeline" aria-label={t.explore.timelineLabel}>
            <div className="explore-timeline-status">
                {/* Play button and speed controls to go here */}
                <p className="text-label">
                    {t.explore.day(current ?? 0)} <span className="opacity-60">/ {stages.length}</span>
                </p>
            </div>

            <div className="explore-timeline-main">
                <div className="explore-regions" aria-hidden="true">
                    {groups.map((g, i) => (
                        <span key={i} style={{ flexGrow: g.km || 1 }}>
                            {g.region ? t.journalArchive.regions[g.region] : ""}
                        </span>
                    ))}
                </div>

                <ol className="explore-track">
                    {stages.map((s) => {
                        const n = s.stageNumber ?? 0;
                        return (
                            <li key={s.documentId} style={{ flexGrow: s.stats?.distanceKm || 1 }}>
                                <Link
                                    to={localePath(`/explore/${n}`, locale)}
                                    replace
                                    preventScrollReset
                                    aria-label={`${t.explore.day(n)}: ${routeLabel(s, locale) ?? s.title}`}
                                    aria-current={n === current ? "step" : undefined}
                                    data-ridden={current != null && n < current}
                                />
                            </li>
                        )
                    })}
                </ol>
            </div>
        </section>
    )
}