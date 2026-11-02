# Map data

GeoJSON files used by the maps. Everything in `public/` is published as-is, so **nothing private or sensitive goes in this folder**.

## Expected files

| File | What it holds |
|---|---|
| `eaglesham-sites.geojson` | The three proposed LDP3 sites (required for Phase 1) |
| `green-belt.geojson` | Green belt around the village (optional) |
| `conservation-area.geojson` | Eaglesham conservation area boundary (optional) |

## Format

- A GeoJSON `FeatureCollection` in WGS84 (EPSG:4326, longitude then latitude)
- Simplify the shapes. A few hundred points per site is plenty.
- Each site feature needs these `properties`:

```json
{
  "id": "waulkers-loan",
  "name": "Waulkers Loan",
  "homes": 200,
  "indicative": false,
  "source": "East Renfrewshire Council, Proposed LDP3 proposals map"
}
```

`id` must match `mapFeatureId` in the site's file in `src/content/sites/`. Set `indicative: true` if the boundary was traced by hand rather than taken from the council's data. The map caption then says so.

## Where the boundaries come from

1. The council's ArcGIS data, if they share it
2. The council's LDP3 web map, if it has a public ArcGIS REST service (`.../FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson`)
3. Traced by hand from the PDF proposals map at https://geojson.io, marked `indicative: true`

**Licence:** confirm with ldp@eastrenfrewshire.gov.uk that the boundaries can be republished, and record the attribution they ask for here.

## Never put in this folder

- Badger setts, bat roosts or any other sensitive wildlife locations
- Anything with people's names, addresses or contact details
