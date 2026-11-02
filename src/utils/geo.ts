/*
  Helpers for drawing GeoJSON as a plain SVG at build time. SiteMap uses them to
  draw the picture people see when JavaScript is off (and when printing).
  Only the shapes we use are handled: Polygon, MultiPolygon, LineString, MultiLineString.
*/

type Position = number[]; // [longitude, latitude]

export interface Feature {
  geometry: { type: string; coordinates: unknown };
  properties: Record<string, unknown>;
}

export interface FeatureCollection {
  features: Feature[];
}

export interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

// Every ring or line in a feature, as a list of [lon, lat] points
function linesOf(feature: Feature): Position[][] {
  const { type, coordinates } = feature.geometry;
  if (type === "LineString") return [coordinates as Position[]];
  if (type === "Polygon" || type === "MultiLineString") return coordinates as Position[][];
  if (type === "MultiPolygon") return (coordinates as Position[][][]).flat();
  return [];
}

export function boundsOf(features: Feature[]): Bounds {
  const points = features.flatMap(linesOf).flat();
  const lons = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  return {
    west: Math.min(...lons),
    south: Math.min(...lats),
    east: Math.max(...lons),
    north: Math.max(...lats),
  };
}

// About 111 km for each degree of latitude
const METRES_PER_DEGREE = 111_320;

/*
  A simple flat projection, which is fine over a few kilometres.
  Longitude is squeezed by cos(latitude) so shapes keep their proportions.
  The picture is `width` units wide and its height follows from `aspect`.
*/
export function makeProjection(focus: Bounds, width: number, aspect: number, padding = 0.2) {
  const midLat = (focus.south + focus.north) / 2;
  const squeeze = Math.cos((midLat * Math.PI) / 180);

  // Size of the area in "metres-ish" units, with some room around it
  let spanX = (focus.east - focus.west) * squeeze * (1 + 2 * padding);
  let spanY = (focus.north - focus.south) * (1 + 2 * padding);
  // Grow the shorter side so the area fits the picture's shape
  if (spanX / spanY < aspect) spanX = spanY * aspect;
  else spanY = spanX / aspect;

  const scale = width / spanX; // SVG units per degree of latitude
  const centreX = ((focus.west + focus.east) / 2) * squeeze;
  const centreY = midLat;
  const height = width / aspect;

  const project = ([lon, lat]: Position): [number, number] => [
    width / 2 + (lon * squeeze - centreX) * scale,
    height / 2 - (lat - centreY) * scale,
  ];

  return {
    width,
    height,
    project,
    metresPerUnit: METRES_PER_DEGREE / scale,
  };
}

// An SVG path "d" attribute for a feature
export function pathOf(feature: Feature, project: (p: Position) => [number, number]): string {
  const closed = feature.geometry.type.includes("Polygon");
  return linesOf(feature)
    .map((line) => {
      const d = line
        .map((p, i) => {
          const [x, y] = project(p);
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join("");
      return closed ? `${d}Z` : d;
    })
    .join("");
}

// A rough middle point for a label: the centre of the feature's bounds
export function labelPointOf(feature: Feature): Position {
  const b = boundsOf([feature]);
  return [(b.west + b.east) / 2, (b.south + b.north) / 2];
}

// A round length for the scale bar, about a fifth of the picture's width
export function scaleBarLength(metresPerUnit: number, width: number): number {
  const target = (width / 5) * metresPerUnit;
  const options = [50, 100, 200, 250, 500, 1000, 2000, 5000];
  return options.reduce((best, n) => (Math.abs(n - target) < Math.abs(best - target) ? n : best));
}
