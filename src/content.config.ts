/*
  Content collections: what fields each kind of content file must have (brief §8).
  If a committee member leaves out a field or mistypes one, the build stops with a
  message saying which file and which field, so mistakes never reach the live site.
  Docs: https://docs.astro.build/en/guides/content-collections/
*/

import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
// "?raw" reads the file's text at build time
import sitesGeoJson from "../public/data/eaglesham-sites.geojson?raw";

// ---------- Shared pieces ----------

// Markdown files in a folder, skipping templates (files starting with _)
const markdownIn = (folder: string) =>
  glob({ base: `./src/content/${folder}`, pattern: ["**/*.md", "!**/_*.md"] });

// A link to where a fact comes from. url may be left "" while it's still a TODO,
// in which case the page shows the title without a link.
const source = z.object({
  title: z.string(),
  url: z.union([
    z.url({ error: 'Must be a full web address starting with https://, or "" if not known yet' }),
    z.literal(""),
  ]),
  // Page number in a document, e.g. 47 or "47–49". Optional.
  page: z.union([z.string(), z.number()]).optional(),
});

// The site ids used on the map, read from the map data file. mapFeatureId in each
// site file, and the sites listed in concerns.yaml, must be one of these.
const mapData = JSON.parse(sitesGeoJson);
const siteIds: string[] = mapData.features.map(
  (feature: { properties: { id: string } }) => feature.properties.id,
);
const siteId = z.string().refine((id) => siteIds.includes(id), {
  message: `Must be one of the site ids in public/data/eaglesham-sites.geojson: ${siteIds.join(", ")}`,
});

// ---------- Collections ----------

// One file per proposed site: src/content/sites/waulkers-loan.md becomes /sites/waulkers-loan/
const sites = defineCollection({
  loader: markdownIn("sites"),
  schema: z.object({
    title: z.string(),
    ldpRef: z.string(),
    homes: z.number().int().nonnegative(),
    homesNote: z.string(),
    areaHectares: z.number().positive().nullable(),
    developer: z.string(),
    landNow: z.string(),
    phasing: z.string(),
    mapFeatureId: siteId,
    summary: z.string(),
    sources: z.array(source).min(1, "Every site needs at least one source"),
    updated: z.coerce.date(),
  }),
});

// The big issues: traffic, wildlife, infrastructure (pages in Phase 2)
const issues = defineCollection({
  loader: markdownIn("issues"),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    summary: z.string(),
    policies: z.array(z.string()).default([]),
    sources: z.array(source).min(1, "Every issue needs at least one source"),
    updated: z.coerce.date(),
  }),
});

// Long-form pages: The plan, About, Our view, Privacy, Accessibility
const pages = defineCollection({
  loader: markdownIn("pages"),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // true = hidden on the live site (still shown with npm run dev)
    draft: z.boolean().default(false),
    // Optional: listed under "Sources" at the end of the page
    sources: z.array(source).default([]),
    updated: z.coerce.date(),
  }),
});

// Dated updates (Phase 2: not switched on yet, see the bottom of this file)
const news = defineCollection({
  loader: markdownIn("news"),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    // Required, but may be [] when an update has no sources
    sources: z.array(source),
  }),
});

// Freedom of Information requests (Phase 2, if the group wants it; not switched on yet)
const foi = defineCollection({
  loader: markdownIn("foi"),
  schema: z.object({
    title: z.string(),
    reference: z.string(),
    sentOn: z.coerce.date(),
    dueBy: z.coerce.date(),
    status: z.enum(["draft", "sent", "answered", "review requested", "appealed", "closed"]),
    summary: z.string(),
    documents: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
  }),
});

// Points offered in the response helper (Phase 1, step 7)
const concerns = defineCollection({
  loader: file("src/data/concerns.yaml"),
  schema: z.object({
    id: z.string(),
    issue: z.enum(["traffic-and-transport", "wildlife-and-biodiversity", "infrastructure", "general"]),
    label: z.string(),
    text: z.string(),
    sites: z.union([z.literal("all"), z.array(siteId).min(1)]),
    policy: z.string().optional(),
    // true = hidden on the live site until the group approves the wording
    draft: z.boolean().default(false),
  }),
});

// Planning terms in plain English (Phase 2 page)
const glossary = defineCollection({
  loader: file("src/data/glossary.yaml"),
  schema: z.object({
    id: z.string(),
    term: z.string(),
    definition: z.string(),
  }),
});

export const collections = { sites, issues, pages, concerns, glossary };

// news and foi are not switched on yet, because their folders only hold templates and
// Astro warns about empty collections. In Phase 2, move them into `collections` above.
export const notYetSwitchedOn = { news, foi };
