import { useState } from "react";
import type { MapStage } from "~/data/stages.server";
import type { Region } from "~/lib/regions";
import { useT } from "~/lib/dictionary";
import StageMapList from "./StageMapList";

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

  return (
    <div className="archive-map-view">
      <div className="archive-map-canvas"></div>

      <StageMapList
        stages={stages}
        region={region}
        activeStage={activeStage}
        onActiveStage={setActiveStage}
      />

      <div className="archive-map-legend text-label-sm">
        <span className="legend-route">{t.journalArchive.map.route}</span>
        <span className="legend-end">{t.journalArchive.map.stageEnd}</span>
        <span className="legend-start">{t.journalArchive.map.stageStart}</span>
        <span className="ml-auto hidden lg:inline">{t.journalArchive.map.hint}</span>
      </div>
    </div>
  );
}
