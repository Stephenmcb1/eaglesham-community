/*
  The interactive map (style guide §7). SiteMap.astro shows a plain drawing first;
  this script swaps it for a Leaflet map once the site boundaries have loaded.
  If anything goes wrong, the drawing simply stays.

  Colours and line styles are set in SiteMap.astro's CSS using the class names
  below, so the design tokens stay the one place colours are defined.
*/
import * as L from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";

interface SiteInfo {
  id: string;
  name: string;
  homes: string; // e.g. ", up to 200 homes"
  href: string;
}

type Properties = Record<string, string | number | boolean | null>;

// The extra layers people can switch on with the checkboxes under the map
const optionalLayers: Record<string, { files: string[]; className: string }> = {
  openSpace: { files: ["open-space.geojson"], className: "map-open-space" },
  biodiversity: { files: ["local-biodiversity-sites.geojson"], className: "map-biodiversity" },
  trees: { files: ["tree-preservation-orders.geojson"], className: "map-trees" },
  paths: { files: ["core-paths.geojson", "cycle-corridors.geojson"], className: "map-paths" },
};

// Each file is downloaded once, however many times its layer is switched on
const downloads = new Map<string, Promise<FeatureCollection<Geometry, Properties>>>();
function loadData(file: string) {
  if (!downloads.has(file)) {
    downloads.set(
      file,
      fetch(`/data/${file}`).then((response) => {
        if (!response.ok) throw new Error(`Couldn't load ${file}`);
        return response.json();
      }),
    );
  }
  return downloads.get(file)!;
}

// Builds the text inside a popup. Uses textContent, never HTML, so data can't inject markup.
function popupContent(title: string, lines: string[], link?: { href: string; text: string }) {
  const box = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = title;
  box.append(heading);
  for (const line of lines) {
    const p = document.createElement("p");
    p.textContent = line;
    box.append(p);
  }
  if (link) {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.text;
    p.append(a);
    box.append(p);
  }
  return box;
}

// A plain shape layer that you can't click, such as the green belt
function shapeLayer(data: FeatureCollection<Geometry, Properties>, className: string, pane: string) {
  return L.geoJSON(data, { pane, interactive: false, style: { className } });
}

// A small Leaflet control showing a north arrow, as on a planning drawing
// (the arrow's markup comes from SiteMap.astro, so the drawing and the map match)
const NorthArrow = L.Control.extend({
  options: { html: "N" },
  onAdd() {
    const box = L.DomUtil.create("div", "north-arrow-control");
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = (this.options as { html: string }).html;
    return box;
  },
});

async function setUpMap(figure: HTMLElement): Promise<void> {
  const container = figure.querySelector<HTMLElement>(".map");
  if (!container) return;

  const sites: SiteInfo[] = JSON.parse(figure.dataset.sites ?? "[]");
  const focus = figure.dataset.focus ?? "";

  // Load the sites before showing anything, so a failed download leaves the drawing in place
  const [siteData, greenBelt, conservation] = await Promise.all([
    loadData("eaglesham-sites.geojson"),
    loadData("green-belt.geojson"),
    loadData("conservation-area.geojson"),
  ]);

  container.hidden = false;
  figure.classList.add("is-interactive");

  // Describe the map for screen readers. The same facts are in the text on the page.
  container.setAttribute("role", "region");
  container.setAttribute(
    "aria-label",
    `${figure.dataset.label ?? "Map"} Use the arrow keys to move the map, and plus and minus to zoom.`,
  );

  const map = L.map(container, {
    scrollWheelZoom: false, // switched on below, once someone clicks or focuses the map
    zoomSnap: 0.5,
    attributionControl: false,
  });

  L.control.attribution({ prefix: false }).addTo(map);
  L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
  new NorthArrow({ position: "topright", html: figure.dataset.northArrow } as L.ControlOptions).addTo(map);

  // Don't let the map grab the page's scroll wheel until someone chooses to use it
  map.on("focus click", () => map.scrollWheelZoom.enable());
  map.on("blur", () => map.scrollWheelZoom.disable());

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Layers stack in this order: context shapes, then sites, then labels and pins on top
  map.createPane("context").style.zIndex = "410";
  map.createPane("sites").style.zIndex = "420";

  // Zoom to the site (or all the sites) before adding any shapes. Leaflet needs to
  // know where the map is looking before it can draw them in the right place.
  const sitesLayer = L.geoJSON(siteData, { pane: "sites", style: { className: "map-site" } });
  const focusLayer = sitesLayer.getLayers().find(
    (layer) => ((layer as L.Polygon).feature as Feature<Geometry, Properties>).properties.id === focus,
  ) as L.Polygon | undefined;
  map.fitBounds((focusLayer ?? sitesLayer).getBounds(), { padding: [32, 32], maxZoom: 17 });

  shapeLayer(greenBelt, "map-green-belt", "context").addTo(map);
  shapeLayer(conservation, "map-conservation", "context").addTo(map);

  // The sites: red-line boundaries you can click, each with a label you can tab to
  sitesLayer.addTo(map);

  sitesLayer.eachLayer((layer) => {
    const shape = layer as L.Polygon;
    const feature = shape.feature as Feature<Geometry, Properties>;
    const info = sites.find((s) => s.id === feature.properties.id);
    const name = info?.name ?? String(feature.properties.name);
    const homes = info?.homes ?? "";
    const label = name + homes;
    // No "read more" link on the site's own page
    const link = info && info.id !== focus ? { href: info.href, text: "Read about this site" } : undefined;
    const content = popupContent(label, [String(feature.properties.ldpRef)], link);

    shape.bindPopup(content);

    // Same markup as the drawing's labels, so phones can hide the homes part
    const labelText = document.createElement("span");
    const homesText = document.createElement("span");
    homesText.className = "label-homes";
    homesText.textContent = homes;
    labelText.append(name, homesText);
    L.marker(shape.getBounds().getCenter(), {
      icon: L.divIcon({ className: "map-label", html: labelText, iconSize: [0, 0] }),
      keyboard: true, // can be reached with Tab and opened with Enter
    })
      .bindPopup(content)
      .addTo(map);
  });

  setUpLayerSwitches(figure, map);
}

// The checkboxes under the map
function setUpLayerSwitches(figure: HTMLElement, map: L.Map): void {
  const fieldset = figure.querySelector<HTMLFieldSetElement>(".map-layers");
  if (!fieldset) return;
  fieldset.hidden = false;

  const made = new Map<string, Promise<L.Layer>>();

  async function makeLayer(name: string): Promise<L.Layer> {
    if (name === "proposals") return proposalsLayer();
    const { files, className } = optionalLayers[name];
    const datasets = await Promise.all(files.map(loadData));
    return L.layerGroup(datasets.map((data) => shapeLayer(data, className, "context")));
  }

  for (const checkbox of fieldset.querySelectorAll<HTMLInputElement>("input[data-layer]")) {
    const name = checkbox.dataset.layer!;
    checkbox.checked = false; // browsers can remember ticks after going back; start clean
    checkbox.addEventListener("change", async () => {
      if (!made.has(name)) made.set(name, makeLayer(name));
      try {
        const layer = await made.get(name)!;
        if (checkbox.checked) layer.addTo(map);
        else layer.remove();
      } catch {
        made.delete(name);
        checkbox.checked = false;
      }
    });
  }
}

// LDP3 proposals: a pin for each one, which shows its reference and description
async function proposalsLayer(): Promise<L.Layer> {
  const data = await loadData("ldp3-proposals-eaglesham.geojson");
  const group = L.layerGroup();

  for (const feature of data.features) {
    const { ldpRef, name, desc } = feature.properties;
    let point: L.LatLng;
    if (feature.geometry.type === "Point") {
      const [lon, lat] = feature.geometry.coordinates;
      point = L.latLng(lat, lon);
    } else {
      // A proposal drawn as an area: outline it, and put the pin in the middle
      const outline = shapeLayer({ type: "FeatureCollection", features: [feature] }, "map-proposal-area", "context");
      group.addLayer(outline);
      point = outline.getBounds().getCenter();
    }

    // The visible circle, plus hidden text so screen readers hear what the pin is
    const html = document.createElement("span");
    const circle = document.createElement("span");
    const hiddenText = document.createElement("span");
    hiddenText.className = "visually-hidden";
    hiddenText.textContent = `LDP3 proposal ${ldpRef}`;
    html.append(circle, hiddenText);

    L.marker(point, {
      icon: L.divIcon({ className: "map-proposal", html, iconSize: [18, 18] }),
      keyboard: true,
    })
      .bindPopup(popupContent(`${ldpRef}: ${name}`, [String(desc)]))
      .addTo(group);
  }
  return group;
}

for (const figure of document.querySelectorAll<HTMLElement>("[data-site-map]")) {
  setUpMap(figure).catch(() => {
    // Leave the drawing showing if the map couldn't be built
    figure.classList.remove("is-interactive");
    const container = figure.querySelector<HTMLElement>(".map");
    if (container) container.hidden = true;
  });
}
