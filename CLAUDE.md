# CLAUDE.md

Instructions for Claude Code in this repository. Read this file first, then the two documents in `docs/`.

## What this is

A small community website about East Renfrewshire Council's Proposed Local Development Plan 3 (LDP3) and what it means for Eaglesham and Waterfoot. It explains the plan in plain English, shows the three proposed housing sites on a map, and helps residents write their own response and send it to the council before the consultation closes on **Friday 22 January 2027**.

Volunteers from the Eaglesham planning group run the site. Its code will later become the base of the Eaglesham & Waterfoot Community Council website, so it must stay simple enough to hand to a non-developer.

The site name is not decided. Read it from `src/config/site.ts` everywhere and never hard-code it.

## Read before you build

1. `docs/PROJECT-BRIEF.md`: purpose, audience, pages, features, phases, decisions
2. `docs/STYLE-GUIDE.md`: visual design, components and writing style. Follow it for every UI change.
3. `src/styles/tokens.css`: design tokens. Use these variables. Don't invent new colours, fonts, sizes or spacing.

If a request conflicts with these documents, say so and ask before going ahead.

## Who you're working with

Stephen maintains the site. He is an experienced project manager who is learning to code and is new to Astro. He works in VS Code on Windows. So:
- End each task with a plain-language summary of what changed and why.
- Choose the simplest approach that works over clever abstractions.
- Add short comments where a beginner would ask "why is this here?"
- Ask before adding any new dependency, and say why it's needed.
- Make design decisions from the style guide yourself rather than offering him options. Flag anything the guide doesn't cover.

## Stack (decided; ask before changing)

- **Astro 7.x**, static output only. No server rendering and no adapter.
- **TypeScript**, strict.
- **Plain CSS** with custom properties from `tokens.css`, in Astro scoped styles plus one `global.css`. No Tailwind and no CSS-in-JS.
- **No UI framework** (React, Vue, Svelte). Interactive pieces are small vanilla TypeScript modules in `src/scripts/`, loaded from `<script>` tags in `.astro` components.
- **Content collections** in Markdown and YAML (model in the brief, §8). Committee members edit these files in **Pages CMS** (`.pages.yml`, guide in `docs/EDITING-GUIDE.md`), so keep frontmatter flat and obvious, and add any new field to `.pages.yml` too. Pages CMS strips `#` comments and raw HTML when it saves: put editor notes in the `notes` field and never rely on HTML inside Markdown. Exclude files starting with `_`.
- **Maps:** Leaflet 1.9.x with OpenStreetMap tiles, loaded only on pages with a map.
- **Fonts:** self-hosted Fontsource packages: `@fontsource/atkinson-hyperlegible-next`, `@fontsource/libre-caslon-text`, `@fontsource/libre-caslon-display`. Never load fonts, scripts or styles from Google or other third-party CDNs.
- **Hosting:** Cloudflare Workers static assets, Git-connected builds. Static output needs no Cloudflare adapter. Config goes in `wrangler.jsonc` with `assets.directory` set to `./dist`.
- **Node:** current LTS, at least 22.23 (Astro 7's minimum).

Astro changes quickly between major versions. Before using any Astro API (content collections and loaders, images, fonts, config, scripts), check the current docs at docs.astro.build. Don't rely on memory of Astro 4 or 5.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run check` | Type-check and validate content (`astro check`) |

Run `npm run check` and `npm run build` before saying a task is done.

## First-time setup: the folder is not empty

The repo already contains docs, design tokens and starter content. **Don't run the `create astro` wizard over it.** Follow Astro's manual setup instead:
- `npm init -y`, then install `astro`
- add `astro.config.mjs` (static output, `site` set from `src/config/site.ts` once the domain is known)
- add `tsconfig.json` extending Astro's strict config
- add the npm scripts above

Keep every existing file. Copy `docs/vscode/extensions.json` and `docs/vscode/settings.json` into a new `.vscode/` folder (they couldn't be created there remotely), then delete `docs/vscode/`. Then `git init`, make a first commit, and help Stephen push to GitHub and connect Cloudflare.

## Conventions

- File and URL names in kebab-case: `waulkers-loan.md` becomes `/sites/waulkers-loan/`
- Components in PascalCase in `src/components/`
- `BaseLayout.astro` wraps every page. `ProseLayout.astro` (inside it) is for long-form text pages.
- Dates in content as `YYYY-MM-DD`, displayed as "Friday 22 January 2027" (`en-GB`)
- British English everywhere, including code comments and UI text
- Every factual claim links to a source (LDP3 page number, council page, news article). Schemas require a `sources` field where the brief says so.
- Commit after each build step with a short, clear message.

## Quality bar (every page)

- **Accessibility:** WCAG 2.2 AA. Semantic HTML first: one `h1`, headings in order, landmarks, a skip link, labelled controls, `fieldset` and `legend` for grouped choices, text errors.
- **Works without JavaScript.** The map and response helper are enhancements, and the same information must be reachable as text.
- **Visible keyboard focus** using the style guide's focus ring. Respect `prefers-reduced-motion`.
- **Mobile first.** Check at 360px wide. Most visitors come from Facebook or WhatsApp on a phone.
- **JavaScript only where needed.** Aim for Lighthouse 95+ on Accessibility and Performance.
- **No cookies, no tracking scripts**, and no third-party embeds without asking. Video uses `youtube-nocookie.com`.
- **Link previews:** every page has a title, description and Open Graph image.

## Content guardrails (important)

This is a contested local planning issue. Any copy you write must:
- State facts with sources. Opinions are the group's, labelled as such ("We think…"), and kept on the "Our view" page or in "Our view" boxes.
- Never allege wrongdoing, bad faith or improper conduct by any named person, councillor, officer or company.
- Never invent facts, figures, quotes, dates or policy references. Write `TODO:` with what's needed, and tell Stephen.
- Help everyone respond, whether they support, object or want to comment.
- Never show badger setts, bat roosts or other sensitive wildlife locations on a public page or map.
- Make clear the site is independent of East Renfrewshire Council. Never use the council's logo or styling.

## Data and privacy

- **Phase 1 collects no personal data.** The response helper runs entirely in the browser and sends nothing to a server. It may keep a draft in `localStorage`, with every read and write wrapped in try/catch.
- **Don't build any form that stores data** until Stephen confirms the privacy notice and the data controller are agreed (brief, §11).
- **Never commit secrets.** Keys go in `.env` (git-ignored) and in the Cloudflare dashboard.

## Definition of done

1. `npm run check` and `npm run build` pass, with no new warnings.
2. The page works at 360px and 1280px, with keyboard only, and with JavaScript turned off.
3. Colours, type and spacing come from `tokens.css`.
4. New content has sources, and unknowns are marked `TODO:`.
5. You've told Stephen in plain language what changed, and what he needs to check or decide.

## Where to start

Work through the Phase 1 build order in `docs/PROJECT-BRIEF.md` §9, one step per session. Step 1 is scaffolding and a first deploy, so the pipeline is proven before any design work starts.
