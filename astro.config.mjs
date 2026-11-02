// @ts-check
import { defineConfig } from "astro/config";
import { site } from "./src/config/site.ts";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Build plain HTML files only: no server, no adapter. Cloudflare serves them as static assets.
  output: "static",

  // The full web address, used later for the sitemap and link previews.
  // Only set once the domain is known (site.url is empty until then).
  ...(site.url ? { site: site.url } : {}),
});
