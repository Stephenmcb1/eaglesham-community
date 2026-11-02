"""
Fetch East Renfrewshire Council's Proposed LDP3 map data around Eaglesham
and save it as GeoJSON (WGS84) in public/data/ for the website's maps.

Source: the council's public ArcGIS service behind its "LDP3 Proposals Maps
for Consultation" web map. The data is in British National Grid (EPSG:27700).
We convert it to WGS84 with the OSTN15 grid (accurate to about 1 m).

Run again whenever the council updates its maps:

    pip install pyproj shapely numpy
    python scripts/fetch_ldp3_data.py

Needs internet access (the council's ArcGIS service, and cdn.proj.org the first
time, to download the OSTN15 grid).

Licence: TODO. Confirm with ldp@eastrenfrewshire.gov.uk that this data can be
republished, and the attribution they require. See docs/MAP-DATA.md.
"""

import json
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
import pyproj
from pyproj.transformer import TransformerGroup
from shapely import transform as shp_transform
from shapely.geometry import box, mapping, shape
from shapely.ops import unary_union

OUT = Path(__file__).resolve().parent.parent / "public" / "data"

LDP3 = ("https://utility.arcgis.com/usrsvcs/servers/20e2bbb18bcc41f9957635b91ed7e89a"
        "/rest/services/Map_Services/LDP3_Proposals_Map_AGOL/MapServer")

# Area around Eaglesham to fetch, in British National Grid metres
ENVELOPE = "254000,649000,261000,656000"

# Our ids for the three Eaglesham strategic allocations (must match mapFeatureId in src/content/sites/)
SITES = {
    "Strat1.6": ("eaglesham-north", "Eaglesham North"),
    "Strat1.7": ("holehouse-road", "Holehouse Road"),
    "Strat1.8": ("waulkers-loan", "Waulkers Loan"),  # council data spells it "Waukers"
}

# Map service layer id -> output file name
CONTEXT_LAYERS = {
    23: "conservation-area",
    26: "green-belt",
    19: "local-biodiversity-sites",
    18: "tree-preservation-orders",
    22: "open-space",
    21: "green-network",
    29: "core-paths",
    31: "cycle-corridors",
}

# Point/polygon proposals in the plan that relate to the Eaglesham sites
PROPOSAL_LAYERS = (14, 28, 37, 38, 39, 40, 44)
PROPOSAL_REFS = {
    "SP2.18", "SP2.19", "SP2.20", "SP2.21", "SP2.30",           # green network projects
    "LP5.16", "LP5.17", "LP5.18", "LP5.19", "LP5.20", "LP5.21",  # community facilities
    "LP5.42", "LP5.50", "LP5.54",                                # schools, health
    "LP6.4", "LP6.5", "LP6.6",                                   # play and sport
    "SP8.14", "SP8.17",                                          # transport
    "PP4.12",                                                    # village centre
}

SOURCE = "East Renfrewshire Council, Proposed LDP3 Proposals Map (consultation 2026)"


def fetch_layer(layer_id: int) -> list:
    params = {
        "geometry": ENVELOPE, "geometryType": "esriGeometryEnvelope", "inSR": 27700,
        "spatialRel": "esriSpatialRelIntersects", "where": "1=1", "outFields": "*",
        "outSR": 27700, "f": "geojson",
    }
    url = f"{LDP3}/{layer_id}/query?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=60) as r:
        data = json.load(r)
    if "error" in data:
        raise RuntimeError(f"Layer {layer_id}: {data['error']}")
    return [f for f in data.get("features", []) if f.get("geometry")]


def make_transformer():
    pyproj.network.set_network_enabled(True)  # lets PROJ download the OSTN15 grid once
    best = TransformerGroup("EPSG:27700", "EPSG:4326", always_xy=True).transformers[0]
    if "(9)" not in best.description:
        raise RuntimeError(f"OSTN15 grid not available, got: {best.description}")
    return best


def to_wgs84(geom, transformer, tolerance_m=0.5):
    geom = geom.simplify(tolerance_m, preserve_topology=True)
    geom = shp_transform(geom, lambda xy: np.column_stack(transformer.transform(xy[:, 0], xy[:, 1])))

    def rnd(o):
        if isinstance(o, (list, tuple)):
            if o and isinstance(o[0], (int, float)):
                return [round(o[0], 6), round(o[1], 6)]  # ~0.1 m
            return [rnd(i) for i in o]
        return o

    m = mapping(geom)
    return {"type": m["type"], "coordinates": rnd(m["coordinates"])}


def save(name, features):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.geojson"
    path.write_text(json.dumps({"type": "FeatureCollection", "name": name, "features": features}))
    print(f"  {path.name}: {len(features)} features")


def clean(p, key):
    v = p.get(key)
    return v.strip() if isinstance(v, str) else (v or "")


def main():
    t = make_transformer()
    print("Converting with:", t.description)

    # 1. The three sites
    site_geoms, feats = {}, []
    for f in fetch_layer(12):
        ref = f["properties"]["POLREF"]
        if ref not in SITES:
            continue
        g = shape(f["geometry"])
        site_geoms[ref] = g
        sid, name = SITES[ref]
        feats.append({"type": "Feature", "geometry": to_wgs84(g, t, 0.25), "properties": {
            "id": sid, "name": name, "ldpRef": ref.replace("Strat", "Strat "),
            "areaHa": round(g.area / 10_000, 2), "indicative": False, "source": SOURCE}})
    save("eaglesham-sites", feats)

    # Clip big context layers to 1.5 km around the sites
    minx, miny, maxx, maxy = unary_union(list(site_geoms.values())).bounds
    clip = box(minx - 1500, miny - 1500, maxx + 1500, maxy + 1500)

    # 2. Context layers
    for layer_id, name in CONTEXT_LAYERS.items():
        out = []
        for f in fetch_layer(layer_id):
            g = shape(f["geometry"])
            if name != "conservation-area":
                if not g.intersects(clip):
                    continue
                g = g.intersection(clip)
            if g.is_empty or (g.geom_type.endswith("Polygon") and g.area < 1):
                continue
            p = f["properties"]
            out.append({"type": "Feature", "geometry": to_wgs84(g, t, 1.0 if "belt" in name or "network" in name else 0.5),
                        "properties": {"ldpRef": clean(p, "POLREF"), "name": clean(p, "SITE"), "desc": clean(p, "POLDESC")}})
        save(name, out)

    # 3. Proposals linked to the Eaglesham sites
    out = []
    for layer_id in PROPOSAL_LAYERS:
        for f in fetch_layer(layer_id):
            p = f["properties"]
            if p.get("POLREF") in PROPOSAL_REFS:
                out.append({"type": "Feature", "geometry": to_wgs84(shape(f["geometry"]), t),
                            "properties": {"ldpRef": p["POLREF"], "name": clean(p, "SITE"),
                                           "desc": clean(p, "POLDESC"), "schedule": clean(p, "SCHEDULE")}})
    save("ldp3-proposals-eaglesham", out)

    # 4. Quick facts for checking content
    print("\nSite areas (from British National Grid geometry):")
    for ref, g in site_geoms.items():
        print(f"  {SITES[ref][1]}: {g.area / 10_000:.2f} ha")


if __name__ == "__main__":
    main()
