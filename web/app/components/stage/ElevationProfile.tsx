import { Link } from "react-router";
import type { RoutePreview } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { formatNumber } from "~/lib/format";
import { localePath, useLocale } from "~/lib/i18n";
import ElevationGraph from "./ElevationGraph";

type ElevationProfileProps = {
  profile: RoutePreview["profile"];
  distanceKm: number;
  stageNumber: number;
};

export default function ElevationProfile({ profile, distanceKm, stageNumber }: ElevationProfileProps) {
    const t = useT();
    const locale = useLocale();

    return (
        <div className="elevation-card border border-border p-8">
            <p className="text-label uppercase text-muted-foreground">{t.stage.elevationProfile}</p>

            <ElevationGraph profile={profile} distanceKm={distanceKm} />

            <Link
                to={localePath(`/journal?view=explore`, locale)}
                className="mt-5 block border-t border-border pt-5 text-label text-accent"
            >
                {t.stage.viewIn3d} →
            </Link>
        </div>
    )
}