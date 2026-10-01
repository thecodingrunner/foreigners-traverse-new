import type { MapStage } from "~/data/stages.server";
import type { Region } from "~/lib/regions";
import { useT } from "~/lib/dictionary";
import StageMapList from "./StageMapList";
import { lazy, Suspense, useState } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import StagePopupCard from "./map/StagePopupCard";

const StageMap = lazy(() => import("./StageMap"));

function MapPlaceholder() {
  return <div className="map-placeholder" aria-hidden="true" />;
}

type ArchiveMapViewProps = {
  stages: MapStage[];
  region: Region | null;
};

export default function ArchiveMapView({
  stages,
  region,
}: ArchiveMapViewProps) {
  const t = useT();
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const active = stages.find((s) => s.stageNumber === activeStage) ?? null;

  return (
    <div className="archive-map-view">
      <div className="archive-map-canvas">
        <ClientOnly fallback={<MapPlaceholder />}>
          {() => (
            <Suspense fallback={<MapPlaceholder />}>
              <StageMap
                stages={stages}
                region={region}
                activeStage={activeStage}
                onActiveChange={setActiveStage}
              />
            </Suspense>
          )}
        </ClientOnly>
      </div>

      <div className="archive-map-inline" aria-live="polite">
        {active && <StagePopupCard stage={active} variant="inline" />}
      </div>

      <StageMapList
        stages={stages}
        region={region}
        activeStage={activeStage}
        onActiveStage={setActiveStage}
      />

      <div className="archive-map-legend text-label-sm">
        <div className="legend-route hidden lg:flex items-center gap-2">
          <span className="icon" />
          {t.journalArchive.map.route}
        </div>
        <div className="legend-end hidden lg:flex items-center gap-2">
          <span className="icon" />
          {t.journalArchive.map.stageEnd}
        </div>
        <div className="legend-start hidden lg:flex items-center gap-2">
          <span className="icon" />
          {t.journalArchive.map.stageStart}
        </div>
        <div className="lg:hidden">{t.journalArchive.map.hintTouch}</div>
        <div className="ml-auto hidden lg:inline">
          {t.journalArchive.map.hint}
        </div>
      </div>
    </div>
  );
}
