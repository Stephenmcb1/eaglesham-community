// @ts-check
import { defineConfig } from "astro/config";
// Astro's own Markdown engine. It comes with Astro; it's imported here only so we can add markTodos.
import { satteri } from "@astrojs/markdown-satteri";
import { site } from "./src/config/site.ts";

/*
  Marks unfinished text in Markdown pages. Any paragraph or list item whose words
  include "TODO" gets class="todo", which global.css draws with a dashed outline.
  It runs at build time, so nothing extra is sent to the browser.
*/
/** @type {import("satteri").HastPluginDefinition} */
const markTodos = {
  name: "mark-todos",
  element: {
    filter: ["p", "li"],
    visit(node, ctx) {
      if (node.type !== "element") return;
      const children = node.children ?? [];
      // A list item holding paragraphs: let the paragraphs carry the mark instead
      if (children.some((child) => child.type === "element" && child.tagName === "p")) return;
      // Ignore any sub-list, so a TODO there marks only that sub-list item
      const text = children
        .filter((child) => !(child.type === "element" && (child.tagName === "ul" || child.tagName === "ol")))
        .map((child) => ctx.textContent(child))
        .join("");
      if (!text.includes("TODO")) return;
      const existing = node.properties?.className;
      const classes = Array.isArray(existing) ? existing : [];
      ctx.setProperty(node, "className", [...classes, "todo"]);
    },
  },
};

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Build plain HTML files only: no server, no adapter. Cloudflare serves them as static assets.
  output: "static",

  // The full web address, used later for the sitemap and link previews.
  // Only set once the domain is known (site.url is empty until then).
  ...(site.url ? { site: site.url } : {}),

  markdown: {
    processor: satteri({ hastPlugins: [markTodos] }),
  },
});
