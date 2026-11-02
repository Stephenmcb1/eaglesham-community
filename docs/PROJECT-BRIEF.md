# Project brief: Eaglesham & Waterfoot LDP3 website

**Status:** Planning. Nothing built yet.
**Owner:** Stephen McBride, for the Eaglesham Planning Objections and Info Group
**Last updated:** 2 November 2026
**Site name:** Not decided. The shortlist is in the Meeting 1 minutes (action 10). Until the group chooses, the code uses a placeholder in `src/config/site.ts`.

---

## 1. Summary

East Renfrewshire Council's Proposed Local Development Plan 3 (LDP3) names Eaglesham as one of four growth areas. It proposes up to 660 new homes on three sites around the village. The formal consultation runs until **Friday 22 January 2027**.

This website helps residents of Eaglesham and Waterfoot:

1. understand what LDP3 proposes for the village, in plain English
2. see where the three sites are
3. write and lodge their own response with the council before the deadline
4. (later) share evidence such as wildlife sightings and traffic problems

It starts as a prototype for the Eaglesham & Waterfoot Community Council (EWCC) website. After the consultation closes it will be frozen as a record and folded into the EWCC site.

### What the site is not

- **It is not the council.** People can't lodge a response on this site. The site sends them to the council's own form. The footer of every page says the site is independent of East Renfrewshire Council.
- **It is not a forum.** No comments, no open voting and no user accounts.
- **It is not only for objectors.** It helps anyone respond, whether they support, object or want to comment. The group's own position goes on one clearly labelled page ("Our view").

---

## 2. Why this matters

- Responses lodged with the council are what count. Only these go forward to the independent examination of the plan. Likes, polls and petitions elsewhere don't.
- The last time the council consulted on growth sites (the 2017 Main Issues Report), its consultation report found that many people didn't understand whether they were objecting to a current planning application or to the plan itself. A clear guide reduces wasted effort.
- Specific responses in people's own words carry more weight than identical copies of the same text, because identical letters are often summarised together. The site therefore helps people write their own.

### What success looks like

- More Eaglesham and Waterfoot residents lodge valid, specific responses by 22 January.
- The group's own response is backed by evidence the community has gathered.
- The site and its content can be handed to EWCC without Stephen.

Measures:
- Page views on "How to respond", from Cloudflare Web Analytics (cookieless).
- After the consultation, ask the council how many responses came from G76 0 postcodes. Use an FOI request if needed.

---

## 3. Who it's for

| Audience | What they need | Implications |
|---|---|---|
| Residents of Eaglesham and Waterfoot, all ages, many older | What's proposed, what it means for them, how to respond, by when | Plain English, large readable text, works well on phones, no jargon without explanation |
| Residents arriving from Facebook or WhatsApp links | The answer to "what is this and what do I do?" in one screen | Strong link previews (Open Graph image), a clear first screen, a deadline on every page |
| Committee members editing content | A simple way to update text | Content in Markdown files with obvious fields, editable in GitHub's web editor |
| Councillors, council officers, the Reporter, the press | A credible, sourced account of local concerns | Every fact sourced, a calm tone, opinion clearly separated from fact |

---

## 4. What's proposed (starting facts)

These come from local press reports. **Check every figure against the Proposed LDP3 document itself, with page numbers, before launch.** The starter content files in `src/content/sites/` hold these facts and their sources.

| Site | Homes (up to) | Developer (as reported) | Land now | Source |
|---|---|---|---|---|
| Eaglesham North | about 360, plus a country park | Mactaggart & Mickel (MacMic) | Green belt | Eaglesham Echo, 2 Sep 2026 |
| Holehouse Road | 100 | Robertson Homes | Greenfield | Eaglesham Echo, 2 Sep 2026 |
| Waulkers Loan | 200 | Taylor Wimpey | Greenfield | Eaglesham Echo, 2 Sep 2026 |
| **Total** | **660**, on nearly 90 hectares | | | |

Other facts to verify and use:
- The council's stated position, as quoted by the Echo, is that "Future development will be centred on the delivery of the Eaglesham North Growth area."
- The meeting understood that Waulkers Loan was not taken forward in LDP2. Confirm this and find the source.
- Consultation: opened Tuesday 29 September 2026. It was due to close on 22 December 2026 and has been extended to **22 January 2027**.
- Responses go through the council's form on getinvolved.eastrenfrewshire.gov.uk, or by email to ldp@eastrenfrewshire.gov.uk. Confirm both before launch.
- After the consultation, the council will consider responses and put any changes to councillors in summer 2027. Unresolved issues then go to examination by a Reporter appointed by Scottish Ministers.

---

## 5. Scope

### Must have (Phase 1 launch)

- Home page with the village plan graphic, the deadline and the three sites
- "The plan": LDP3 explained in plain English, with the timeline and what counts in a response
- The three sites: a schedule table, a map and one page per site
- "How to respond": a step-by-step guide plus the response helper
- About (who we are, contact, relationship to the community council)
- Privacy notice and accessibility statement
- Deadline strip on every page
- Good link previews for Facebook and WhatsApp

### Should have (Phase 2)

- "The issues": traffic and transport, wildlife and biodiversity, infrastructure. One page each, with evidence and points people could make
- "Our view": the group's own position, clearly labelled
- News/updates (meeting notes, events, council drop-in sessions)
- Glossary of planning terms
- Print-friendly "How to respond" guide for people who don't use the internet much
- Video walkthrough of the council's form (YouTube no-cookie embed)

### Could have (Phase 2, if time and agreement allow)

- Evidence form: wildlife sightings, traffic problems and photos, with a map pin
- FOI tracker: what the group has asked the council, and the answers
- Short postcode-only survey to give the group numbers for its own response

### Won't have

- Open voting or polls (easy to stuff, little weight with decision makers)
- Public comments or a forum (moderation and defamation risk)
- User accounts or logins for the public
- Newsletter sign-up in Phase 1 (personal data). Revisit for EWCC.
- Anything that stores personal data before the privacy notice and data controller are agreed

---

## 6. Site map and pages

```
/                        Home
/the-plan/               LDP3 in plain English
/sites/                  The three sites: schedule table + map
/sites/eaglesham-north/  One page per site
/sites/holehouse-road/
/sites/waulkers-loan/
/issues/                 The big issues (Phase 2)
/issues/[slug]/
/respond/                How to respond + response helper
/our-view/               The group's view (Phase 2)
/news/                   Updates (Phase 2)
/news/[slug]/
/evidence/               Share evidence (Phase 2, could have)
/foi/                    FOI tracker (Phase 2, could have)
/glossary/               Planning terms (Phase 2)
/about/
/privacy/
/accessibility/
/404
```

Primary navigation (five items): **The plan, The sites, The issues, How to respond, About.** Everything else is linked from the footer or from within pages. Until Phase 2, "The issues" can link to a holding section on "The plan".

### Page specs

**Home (`/`)**
- Hero: a short headline in the display face, one paragraph saying what's proposed and by when, and two buttons ("How to respond", "See the sites"). Below it, the village plan graphic: the village streets with the three sites drawn as red-line boundaries and labelled with home numbers. See the style guide, §7.
- Suggested headline, for the committee to approve: *A planned village, planned again.*
- Suggested intro: *East Renfrewshire Council's Local Development Plan 3 proposes up to 660 new homes on three sites around Eaglesham. Find out what's proposed, what it could mean for the village, and how to respond before Friday 22 January 2027.*
- "What's proposed": the site schedule (the same component as `/sites/`).
- "The big issues": three short text blocks linking to the issue pages.
- "How to respond in three steps": numbered, plus a button to `/respond/`.
- Latest two news items (Phase 2).

**The plan (`/the-plan/`)**
- What a Local Development Plan is, and why LDP3 matters for the next 10 years (2027–2037)
- Where we are in the process: a numbered timeline (Evidence Report → Gate Check → Proposed Plan consultation [now] → council decision on changes [summer 2027] → examination by a Reporter → adoption)
- What a "representation" is, and what counts in planning terms (material considerations) and what doesn't (property values, loss of a private view)
- Links to the official documents. Link to them, don't re-host them.

**The sites (`/sites/`)**
- Site schedule table: Site, Homes (up to), Area, Developer, Land now. Each row links to the site page.
- Interactive map showing all three sites, with a key below it
- No-JavaScript fallback: a static image of the map plus the table

**Site page (`/sites/[slug]/`)**
- Key facts box (from frontmatter): homes, area, developer, land now, phasing, LDP3 reference
- A map zoomed to that site
- Body sections: What's proposed / What the plan says (quoted, with page reference) / What it could mean for the village / Questions we're asking
- Sources list
- Button: "Respond about this site" (opens the helper with this site pre-selected via `?site=slug`)

**How to respond (`/respond/`)**
- The deadline, stated plainly
- Numbered steps: 1. Decide what you want to say. 2. Write it (use the helper or your own words). 3. Send it to the council (form link, email address, post). 4. Keep a copy.
- The response helper (§7.2)
- A print link for a paper version
- FAQ (details/summary): Can I respond more than once? Do I need to give my name? Will my response be published? Answers to be confirmed with the council.

**About (`/about/`)**
- Who the group is, how it relates to EWCC, how to get involved, contact email
- A statement that the site is independent of East Renfrewshire Council and of any developer

**Privacy (`/privacy/`) and Accessibility (`/accessibility/`)**
- Plain-English privacy notice. Phase 1: no cookies, cookieless analytics, contact email only.
- Accessibility statement: target standard (WCAG 2.2 AA), known issues, how to report a problem.

---

## 7. Features

### 7.1 Map

- Leaflet 1.9.x with OpenStreetMap tiles. Tiles are desaturated so the sites stand out. Styling is in the style guide, §7.
- Layers: proposed sites (red-line boundaries), green belt (if data is available), conservation area boundary (if data is available)
- Data: GeoJSON in `public/data/`, one feature per site with an `id` property matching each site's `mapFeatureId`
- Getting the boundaries, in order of preference:
  1. Stephen's ArcGIS export, if the council has shared it
  2. The council's LDP3 web map, if it exposes an ArcGIS REST FeatureServer (query with `f=geojson&outSR=4326`)
  3. Digitise approximate boundaries from the PDF proposals map using geojson.io, with `"indicative": true` on each feature and a caption saying so
- Licence: council map data is often derived from Ordnance Survey data. Email ldp@eastrenfrewshire.gov.uk to confirm the boundaries can be republished, and add whatever attribution they require. OpenStreetMap requires "© OpenStreetMap contributors".
- The map is never the only way to get information. Every site is also listed as text.
- Scroll-wheel zoom stays off until the map is clicked or focused, so the page doesn't trap scrolling. Keyboard users can pan and zoom.
- Never show badger setts or other sensitive wildlife locations on a public map.

### 7.2 Response helper

A small tool on `/respond/` that helps someone draft their own response. **Nothing is sent or stored on a server.**

1. **Which sites?** Checkboxes: Eaglesham North, Holehouse Road, Waulkers Loan, The plan in general. Pre-select from `?site=`.
2. **Your position.** For each chosen site: Support / Object / Comment.
3. **What matters to you.** Checkboxes grouped under the three issues, loaded from `src/data/concerns.yaml`. Each concern adds one plain sentence in the resident's voice. Entries marked `draft: true` are hidden in production builds.
4. **In your own words.** A text box with prompts: "How would this affect you? What have you seen yourself?" The helper explains that personal detail makes a response stronger.
5. **Your response.** A generated, editable text area with buttons: "Copy your response", "Open the council's form", "Print". A short checklist of what the council needs (name, address, which part of the plan, support or object) appears beside it, using whatever the council's form actually asks for.

Rules:
- Must work as progressive enhancement. Without JavaScript the page still shows the steps and the list of points as text.
- The draft may be kept in `localStorage` so it survives a reload. Wrap reads and writes in try/catch, and offer "Clear my draft".
- Accessible: `fieldset`/`legend`, labels, error messages in text, and copy confirmation announced through an `aria-live` region.

### 7.3 Evidence form (Phase 2, could have)

Only after the privacy notice and data controller are agreed (§11).

- Fields: what you saw (bats, badgers, owls, deer, other wildlife, traffic problem, flooding, other), when, where (map pin or description), what happened, an optional photo, optional contact details, and consent to use it anonymously in the group's response
- Storage: a new Supabase project. Insert-only for the public through row-level security; only signed-in committee members can read.
- Spam: Cloudflare Turnstile
- Photos: strip location metadata before storing
- Never published publicly with precise locations
- Fallback if the service is down: a clear message and the group email address

### 7.4 FOI tracker (Phase 2, could have)

A list of requests the group has made under the Freedom of Information (Scotland) Act 2002 or the Environmental Information (Scotland) Regulations 2004. For each: what was asked, the date sent, the date due, status, a summary of the response, and links to documents. Check process wording against the Scottish Information Commissioner's guidance (itspublicknowledge.info).

---

## 8. Content model

Content lives in Markdown and YAML so committee members can edit it in GitHub's web editor. Files starting with `_` are templates and are not published.

| Collection | Location | Key fields |
|---|---|---|
| `sites` | `src/content/sites/*.md` | title, ldpRef, homes, homesNote, areaHectares, developer, landNow, phasing, mapFeatureId, summary, sources[], updated |
| `issues` | `src/content/issues/*.md` | title, order, summary, policies[], sources[], updated |
| `pages` | `src/content/pages/*.md` | title, description, draft, updated (`draft: true` pages are hidden in production) |
| `news` | `src/content/news/*.md` | title, date, summary, sources[] |
| `foi` | `src/content/foi/*.md` | title, reference, sentOn, dueBy, status, summary, documents[] |
| `concerns` | `src/data/concerns.yaml` | id, issue, label, text, sites, policy, draft |
| `glossary` | `src/data/glossary.yaml` | term, definition |

`sources` is a list of `{ title, url, page? }` and is required for `sites`, `issues` and `news`.

Site-wide settings live in `src/config/site.ts`: site name (placeholder), deadline (ISO date), council links (LDP3 page, response form, email), group contact email, and social preview defaults.

---

## 9. Phases, timeline and build order

Today is Monday 2 November 2026. The consultation closes on Friday 22 January 2027: about 11 weeks, including Christmas.

### Phase 0: Set-up (Stephen, by Sunday 8 November)

- [ ] Group agrees the site name (Meeting 1, action 10)
- [ ] Create a group email account. Every other account is registered to it, so ownership can pass to EWCC.
- [ ] Register the domain (`.org.uk`) to the group email
- [ ] Create a GitHub organisation for the group, with Stephen and one other committee member as owners
- [ ] Create a Cloudflare account on the group email
- [ ] Install on Windows: Git for Windows, Node.js LTS (22.23 or newer), VS Code (accept the recommended extensions), Claude Code

### Phase 1: Launch (target Monday 23 November)

Build order: one step per Claude Code session, with a commit after each.

1. Scaffold Astro manually around the existing files. Add `src/config/site.ts`, `git init`, a first commit, push to GitHub, and deploy a holding page to Cloudflare. **Prove the pipeline on day one.**
2. Global CSS from `tokens.css`, self-hosted fonts, and `BaseLayout` with skip link, header, navigation, deadline strip and footer
3. Content collections and schemas (`src/content.config.ts`). Render the starter content.
4. Prose pages: The plan, About, Privacy, Accessibility
5. Sites index with the schedule table, and the site detail pages
6. Map component, GeoJSON and no-JS fallback
7. How to respond page and the response helper
8. Home page with the village plan graphic
9. 404 page, sitemap, Open Graph image and meta tags, favicon
10. QA pass: keyboard, screen reader spot check, 360px, no-JS, Lighthouse. Point the domain at the site and launch.

### Phase 2: Evidence and depth (target Friday 11 December)

Issues pages, Our view, News, Glossary, print stylesheet, video guide. Optional: evidence form, FOI tracker.

### Phase 3: Final push (Monday 4 – Friday 22 January 2027)

Reminder posts, a "last week to respond" message, a link check and content freshness check.

### Phase 4: After the deadline (from Monday 25 January 2027)

- Add a "Consultation closed" banner and freeze content as a record
- Delete personal data in line with the privacy notice
- Plan the move to the EWCC site: either this repo becomes EWCC's site, with LDP3 moved under `/planning/ldp3/`, or the LDP3 section is copied into a new EWCC repo

---

## 10. Technical decisions

| Area | Decision | Why |
|---|---|---|
| Framework | Astro 7, static output | Fast, simple, content in files, easy to hand over |
| Styling | Plain CSS with custom properties (`tokens.css`) | The style guide maps straight to code, with nothing extra to learn |
| Interactivity | Vanilla TypeScript in Astro `<script>` blocks | Only two interactive pieces (map, helper). No framework needed. |
| Content | Markdown + YAML content collections | Committee can edit on GitHub. Typed schemas catch mistakes. |
| Maps | Leaflet + OpenStreetMap tiles | Open, light, no API key. Upgrade path: Ordnance Survey Maps API. |
| Fonts | Fontsource packages, self-hosted | No third-party requests, privacy-friendly |
| Hosting | Cloudflare Workers static assets, Git-connected builds | Free, no commercial-use restriction, preview links, no adapter for static sites |
| Analytics | Cloudflare Web Analytics | Cookieless, no personal data, so no cookie banner needed |
| Forms (Phase 2) | Supabase (new project) + Cloudflare Turnstile | Stephen already knows Supabase. Turnstile is free and privacy-friendly. |
| Editing UI (later) | GitHub web editor first. Consider Pages CMS or Keystatic if editors struggle. | Decide only if it's needed |
| Repo | GitHub organisation owned by the group | Survives any one person stepping away |

Stephen's existing Vercel account and stotte.co.uk stay separate from this site. Sharing working documents through Støtte's Google Workspace is fine.

---

## 11. Privacy, legal and accessibility

- **Phase 1 collects no personal data.** The privacy notice still covers analytics (cookieless) and emails to the group address.
- **Before any form that stores data (Phase 2):** agree who the data controller is (the group, or EWCC if the group is formally its sub-committee). Publish a privacy notice covering purpose, lawful basis, retention and deletion date. Check with the ICO whether a data protection fee applies.
- **Fairness and defamation:** facts with sources, opinions labelled as the group's view, and no allegations about the conduct or motives of named people or companies.
- **Copyright:** quote the plan briefly with page references, and link to official documents rather than re-hosting them. Use only your own photos, or openly licensed ones (for example Geograph, CC BY-SA) with credit. No stock or AI-generated images of the village.
- **Children:** if the primary school gets involved (Meeting 1, action 5), publish no identifiable photos or names of children.
- **Wildlife:** never publish the locations of badger setts or bat roosts.
- **Independence:** every page footer says the site is independent of East Renfrewshire Council. Never use the council's logo or visual style.
- **Accessibility:** WCAG 2.2 AA. See the style guide, §10.

---

## 12. Handover to the community council

Set things up for handover from day one:
- All accounts on the group email, with at least two owners each
- Content in plain files, with templates and this brief in the repo
- An "Accounts and ownership" table in the README, kept current
- After 22 January, a short handover note: what exists, who owns what, renewal dates (the domain), costs (expected: domain only)

---

## 13. Open questions for the group

1. Which name? (shortlist in the minutes)
2. Is the group formally a sub-committee of EWCC? This decides the data controller and how "Our view" is worded.
3. Who owns each page's content? Name one person per page.
4. Does anyone have the council's LDP3 site boundary data (ArcGIS) and permission to republish it?
5. Which group email address goes on the site?
6. Content licence: CC BY 4.0 so others can reuse it? Code licence: MIT?
7. Who is the second owner of the GitHub and Cloudflare accounts?
8. Does the group want the evidence form and FOI tracker in Phase 2, or not at all?

---

## 14. Folder structure

```
Eaglesham_Community/                 ← repo root (E:\Eaglesham_Community)
├── CLAUDE.md                        Instructions Claude Code reads automatically
├── README.md                        For humans: what this is, how to run and edit it
├── .editorconfig  .gitattributes  .gitignore
├── .vscode/
│   └── extensions.json              Recommended VS Code extensions
├── docs/
│   ├── PROJECT-BRIEF.md             This document
│   └── STYLE-GUIDE.md               Visual design, components, writing style
├── public/                          Copied to the site as-is
│   ├── data/                        GeoJSON for maps (see README in folder)
│   └── images/                      Open Graph image, favicon, photos that don't need processing
├── scripts/                         One-off Node scripts (e.g. turn OSM data into the village plan SVG)
└── src/
    ├── assets/                      Images Astro should optimise
    ├── components/                  Astro components (PascalCase)
    ├── config/
    │   └── site.ts                  Site name, deadline, council links
    ├── content/                     Markdown content collections
    │   ├── sites/                   One file per site (+ _template.md)
    │   ├── issues/                  One file per issue (+ _template.md)
    │   ├── pages/                   The plan, About, Our view, Privacy, Accessibility
    │   ├── news/                    Dated updates (+ _template.md)
    │   └── foi/                     FOI requests (+ _template.md)
    ├── content.config.ts            Collection schemas (Claude Code creates this)
    ├── data/
    │   ├── concerns.yaml            Points used by the response helper
    │   └── glossary.yaml            Planning terms in plain English
    ├── layouts/                     BaseLayout.astro, ProseLayout.astro
    ├── pages/                       Routes (index.astro, sites/[slug].astro, …)
    ├── scripts/                     Browser TypeScript (map.ts, helper.ts)
    └── styles/
        ├── tokens.css               Design tokens. Change values here, not in components.
        └── global.css               Base element styles (Claude Code creates this)
```
