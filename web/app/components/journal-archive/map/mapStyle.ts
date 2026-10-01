import type { StyleSpecification } from "maplibre-gl";
import type { LayerProps } from "react-map-gl/maplibre";

export type MapColors = ReturnType<typeof readMapColors>;

export function readMapColors() {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => styles.getPropertyValue(name).trim();
  return {
    background: token("--background"),
    route: token("--akane"),
    ink: token("--nibi"),
    paper: token("--gofun"),
    halos: [
      token("--surface-2"),
      token("--placeholder-a"),
      token("--placeholder-b"),
      token("--border"),
      token("--border-control"),
    ],
    land: token("--surface-2"),
    coast: token("--border-control"),
  };
}

export function baseStyle(colors: MapColors): StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": colors.background,
        },
      },
    ],
  };
}

export const ROUTE_BOUNDS: [[number, number], [number, number]] = [
  [129.6, 31.2],
  [142.0, 41.4],
];

const HALOS = [
  { width: 110, opacity: 0.35 },
  { width: 80, opacity: 0.5 },
  { width: 55, opacity: 0.6 },
  { width: 34, opacity: 0.7 },
  { width: 18, opacity: 0.5 },
];

const isLine = ["==", ["geometry-type"], "LineString"] as const;
const isActive = (active: number | null) => [
  "==",
  ["get", "stageNumber"],
  active ?? -1,
];
const isDimmed = (dimmed: number[]) => [
  "in",
  ["get", "stageNumber"],
  ["literal", dimmed],
];

export function haloLayers(colors: MapColors): LayerProps[] {
  return HALOS.map(({ width, opacity }, i) => ({
    id: `halo-${i}`,
    type: "line",
    filter: isLine,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": colors.halos[i],
      "line-opacity": opacity,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        width * 0.35,
        4,
        width * 0.6,
        8,
        width * 1.6,
      ],
      "line-blur": width * 0.15,
    },
  })) as unknown as LayerProps[];
}

export function routeLayer(
  colors: MapColors,
  active: number | null,
  dimmed: number[],
): LayerProps {
  return {
    id: "route",
    type: "line",
    filter: isLine,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": colors.route,
      "line-width": ["case", isActive(active), 4, 2.5],
      "line-opacity": ["case", isDimmed(dimmed), 0.25, 1],
    },
  } as unknown as LayerProps;
}

export const hitLayer: LayerProps = {
  id: "route-hit",
  type: "line",
  filter: isLine,
  paint: { "line-color": "#000", "line-opacity": 0, "line-width": 16 },
} as unknown as LayerProps;

export function stageEndsLayer(
  colors: MapColors,
  active: number | null,
  dimmed: number[],
): LayerProps {
  return {
    id: "stage-ends",
    type: "circle",
    filter: ["==", ["get", "kind"], "end"],
    paint: {
      "circle-color": colors.paper,
      "circle-radius": ["case", isActive(active), 7, 3.5],
      "circle-stroke-color": [
        "case",
        isActive(active),
        colors.route,
        colors.ink,
      ],
      "circle-stroke-width": ["case", isActive(active), 2.5, 1.5],
      "circle-opacity": ["case", isDimmed(dimmed), 0.3, 1],
      "circle-stroke-opacity": ["case", isDimmed(dimmed), 0.3, 1],
    },
  } as unknown as LayerProps;
}

export function landLayers(colors: MapColors): LayerProps[] {
  return [
    { id: "land-fill", type: "fill", paint: { "fill-color": colors.land } },
    {
      id: "land-outline",
      type: "line",
      paint: { "line-color": colors.coast, "line-width": 0.8 },
    },
  ] as LayerProps[];
}
