"""
Fetch Eaglesham's streets and burns from OpenStreetMap, for the village plan
drawing on the home page (style guide §7). Saves src/data/village-streets.geojson.

The drawing itself is made when the site is built (src/components/VillagePlan.astro),
so this only needs running again if the streets change.

    python scripts/fetch_village_streets.py

Uses Python's standard library only. Needs internet access (the Overpass API).

Licence: OpenStreetMap data is © OpenStreetMap contributors, available under the
Open Database Licence. The drawing's caption credits it.
"""

import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITES = ROOT / "public" / "data" / "eaglesham-sites.geojson"
OUT = ROOT / "src" / "data" / "village-streets.geojson"

OVERPASS = "https://overpass-api.de/api/interpreter"

# Bigger roads, drawn a little heavier
MAIN_ROADS = {"primary", "secondary", "tertiary"}
# The village's two historic main streets, also drawn heavier (style guide §7)
MAIN_STREETS = {"Montgomery Street", "Polnoon Street"}

# Room around the three sites, as a share of their width and height
PADDING = 0.25


def site_bounds():
    """The south, west, north and east edges of the three sites, plus some room."""
    data = json.loads(SITES.read_text(encoding="utf-8"))
    points = []
    for feature in data["features"]:
        geometry = feature["geometry"]
        polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
        for polygon in polygons:
            for ring in polygon:
                points.extend(ring)
    lons = [p[0] for p in points]
    lats = [p[1] for p in points]
    pad_lon = (max(lons) - min(lons)) * PADDING
    pad_lat = (max(lats) - min(lats)) * PADDING
    return (min(lats) - pad_lat, min(lons) - pad_lon, max(lats) + pad_lat, max(lons) + pad_lon)


def fetch(bounds):
    south, west, north, east = bounds
    bbox = f"{south:.5f},{west:.5f},{north:.5f},{east:.5f}"
    # Streets people live on or drive along (not tracks, paths or driveways), and burns
    query = f"""
    [out:json][timeout:90];
    (
      way["highway"~"^(primary|secondary|tertiary|unclassified|residential|living_street|pedestrian)$"]({bbox});
      way["waterway"~"^(river|stream)$"]({bbox});
    );
    out geom;
    """
    request = urllib.request.Request(
        OVERPASS,
        data=urllib.parse.urlencode({"data": query}).encode(),
        headers={"User-Agent": "eaglesham-community-site (village plan drawing)"},
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.load(response)


def kind_of(tags):
    if "waterway" in tags:
        return "water"
    if tags.get("highway") in MAIN_ROADS or tags.get("name") in MAIN_STREETS:
        return "main"
    return "street"


def main():
    data = fetch(site_bounds())
    features = []
    for way in data["elements"]:
        if way.get("type") != "way" or "geometry" not in way:
            continue
        tags = way.get("tags", {})
        # 5 decimal places is about 1 metre: plenty for a drawing, and keeps the file small
        line = [[round(p["lon"], 5), round(p["lat"], 5)] for p in way["geometry"]]
        features.append({
            "type": "Feature",
            "properties": {"kind": kind_of(tags), "name": tags.get("name", "")},
            "geometry": {"type": "LineString", "coordinates": line},
        })

    OUT.write_text(
        json.dumps({
            "type": "FeatureCollection",
            "attribution": "© OpenStreetMap contributors, ODbL",
            "features": features,
        }, separators=(",", ":")),
        encoding="utf-8",
    )
    counts = {k: sum(1 for f in features if f["properties"]["kind"] == k) for k in ("main", "street", "water")}
    print(f"Saved {len(features)} lines to {OUT.relative_to(ROOT)}: {counts}")


if __name__ == "__main__":
    main()
