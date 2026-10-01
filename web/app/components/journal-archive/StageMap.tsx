import { useEffect, useMemo, useRef, useState } from "react";
import MapGL, {
  Layer,
  Marker,
  Popup,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection, LineString, Point } from "geojson";
import type { MapStage } from "~/data/stages.server";
import type { Region } from "~/lib/regions";
import { useLocale } from "~/lib/i18n";
import {
  ROUTE_BOUNDS,
  baseStyle,
  haloLayers,
  hitLayer,
  landLayers,
  readMapColors,
  routeLayer,
  stageEndsLayer,
} from "./map/mapStyle";
import StagePopupCard from "./map/StagePopupCard";
import { useMediaQuery } from "~/hooks/useMediaQuery";

type RouteProps = { stageNumber: number; kind?: "start" | "end" | "finish" };
type RouteData = FeatureCollection<LineString | Point, RouteProps>;

const CITIES = [
  { en: "Fukuoka", ja: "福岡", lngLat: [130.4, 33.59] },
  { en: "Hiroshima", ja: "広島", lngLat: [132.46, 34.39] },
  { en: "Tokyo", ja: "東京", lngLat: [139.69, 35.69] },
  { en: "Sendai", ja: "仙台", lngLat: [140.87, 38.27] },
  { en: "Aomori", ja: "青森", lngLat: [140.74, 40.82] },
] as const;

type Props = {
  stages: MapStage[];
  region: Region | null;
  activeStage: number | null;
  onActiveChange: (stageNumber: number | null) => void;
};

export default function StageMap({
  stages,
  region,
  activeStage,
  onActiveChange,
}: Props) {
  const locale = useLocale();
  const mapRef = useRef<MapRef>(null);
  const [data, setData] = useState<RouteData | null>(null);
  const [hovering, setHovering] = useState(false);

  const colors = useMemo(readMapColors, []);
  const mapStyle = useMemo(() => baseStyle(colors), [colors]);

  const userMoved = useRef(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Load the route geometry (a static, cacheable file)
  useEffect(() => {
    const controller = new AbortController();
    fetch("/routes/stages.geojson", { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // stageNumber → where its stage ends, for popup placement
  const endPoints = useMemo(() => {
    const points = new Map<number, [number, number]>();
    for (const f of data?.features ?? []) {
      if (f.geometry.type === "Point" && f.properties.kind !== "start") {
        points.set(
          f.properties.stageNumber,
          f.geometry.coordinates as [number, number],
        );
      }
    }
    return points;
  }, [data]);

  const markers = useMemo(
    () =>
      (data?.features ?? []).filter(
        (f): f is RouteData["features"][number] & { geometry: Point } =>
          f.geometry.type === "Point" &&
          (f.properties.kind === "start" || f.properties.kind === "finish"),
      ),
    [data],
  );

  const dimmed = useMemo(
    () =>
      region
        ? stages
            .filter((s) => !s.regions.includes(region))
            .map((s) => s.stageNumber ?? -1)
        : [],
    [stages, region],
  );

  const active = stages.find((s) => s.stageNumber === activeStage) ?? null;
  const activePoint =
    activeStage != null ? endPoints.get(activeStage) : undefined;

  // If the active stage was chosen from the list and is off-screen, pan to it
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activePoint) return;
    if (!map.getBounds().contains(activePoint)) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      map.easeTo({ center: activePoint, duration: reduceMotion ? 0 : 600 });
    }
  }, [activePoint]);

  const stageAt = (e: MapLayerMouseEvent) => {
    const n = e.features?.[0]?.properties?.stageNumber;
    return n != null ? Number(n) : null;
  };

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const n = stageAt(e);
    setHovering(n != null);
    if (n != null && n !== activeStage) onActiveChange(n);
  };

  console.log({ activeStage, active, activePoint });

  return (
    <MapGL
      ref={mapRef}
      initialViewState={{
        bounds: ROUTE_BOUNDS,
        fitBoundsOptions: { padding: isDesktop ? 32 : 16 },
      }}
      mapStyle={mapStyle}
      style={{ width: "100%", height: "100%" }}
      interactiveLayerIds={["route-hit", "stage-ends"]}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovering(false)}
      onClick={(e) => onActiveChange(stageAt(e))}
      cursor={hovering ? "pointer" : "grab"}
      cooperativeGestures
      dragRotate={false}
      pitchWithRotate={false}
      touchPitch={false}
      minZoom={3}
      maxZoom={11}
      attributionControl={false}
      onMoveStart={(e) => {
        if (e.originalEvent) userMoved.current = true; // a real drag or pinch, not code
      }}
      onResize={() => {
        if (!userMoved.current) {
          mapRef.current?.fitBounds(ROUTE_BOUNDS, {
            padding: isDesktop ? 32 : 16,
            duration: 0,
          });
        }
      }}
    >
      <Source id="land" type="geojson" data="/geo/japan.geojson">
        {landLayers(colors).map((layer) => (
          <Layer key={layer.id} {...layer} />
        ))}
      </Source>

      {data && (
        <Source id="route" type="geojson" data={data}>
          {haloLayers(colors).map((layer) => (
            <Layer key={layer.id} {...layer} />
          ))}
          <Layer {...routeLayer(colors, activeStage, dimmed)} />
          <Layer {...hitLayer} />
          <Layer {...stageEndsLayer(colors, activeStage, dimmed)} />
        </Source>
      )}

      {markers.map((f) => (
        <Marker
          key={f.properties.kind}
          longitude={f.geometry.coordinates[0]}
          latitude={f.geometry.coordinates[1]}
        >
          <span className="map-square" aria-hidden="true" />
        </Marker>
      ))}

      {CITIES.map((city) => (
        <Marker
          key={city.en}
          longitude={city.lngLat[0]}
          latitude={city.lngLat[1]}
          anchor="left"
          offset={[8, 0]}
        >
          <span className="map-city-label" aria-hidden="true">
            {city[locale]}
          </span>
        </Marker>
      ))}

      {isDesktop && active && activePoint && (
        <Popup
          longitude={activePoint[0]}
          latitude={activePoint[1]}
          offset={14}
          closeButton={false}
          closeOnClick={false}
          maxWidth="260px"
          className="stage-popup"
        >
          <StagePopupCard stage={active} />
        </Popup>
      )}
    </MapGL>
  );
}
