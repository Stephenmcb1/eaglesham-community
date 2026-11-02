# Style guide

How the site looks, how it's built visually, and how it's written. Values live in `src/styles/tokens.css`. If this guide and the tokens disagree, fix the tokens.

---

## 1. The idea: the planned village

Eaglesham was laid out as a planned village in 1769, around the Orry, and is often described as Scotland's first conservation village. LDP3 is, in effect, the next plan for it. The design borrows from two sources:

1. **The 1769 plan.** The street pattern around the Orry is the one memorable graphic, used as the home page hero and the logo mark. The headings use Caslon, the typeface of the decades when the village was planned.
2. **Planning drawings.** Proposed sites are drawn with a **red-line boundary**, the convention used on every planning application. Facts sit in a **schedule** (a plain table), maps have a **key** and a **north arrow**, and every claim carries a **source note**.

Everything else stays quiet: white pages, dark text, one green for actions. The red line is the only bold element, and it only ever means "a proposed site".

Who it must work for: a 75-year-old resident on a phone, from a Facebook link, who has never read a planning document.

---

## 2. Principles

1. **Calm and credible, not angry.** It should look like a well-made civic notice, not a protest poster: no shouting, no red banners, no exclamation marks.
2. **Fact first, view second.** Facts are sourced. The group's opinions are visibly labelled as "Our view".
3. **One job per screen.** Every page makes the next step obvious, which is usually "How to respond".
4. **Legible before beautiful.** Large text, strong contrast, generous spacing. Accessibility is the design brief, not an afterthought.
5. **Of this place.** Local streets, local photos, local names. Nothing that could be any village's template.

### Things that make a site look generated (don't do them)

- A warm cream background with a terracotta accent
- Identical rounded cards with soft grey shadows, or gradient washes
- ALL-CAPS labels above headings
- Meta text joined with middle dots ("A · B · C")
- Arrows (→) added to links and buttons
- Numbered markers (01, 02, 03) on things that aren't a sequence
- Putting one word of a headline in a different colour or in italics
- Sections that fade and slide up as you scroll
- Stock photos, or AI-generated pictures of the village

---

## 3. Colour

| Token | Hex | Name | Use |
|---|---|---|---|
| `--colour-paper` | `#FFFFFF` | Paper | Page background |
| `--colour-harl` | `#EEF2EC` | Harl | Panels, callouts, footer. A cool grey-green, like lime harling. |
| `--colour-whinstone` | `#1F2A2E` | Whinstone | Body text and headings |
| `--colour-stone` | `#5B6A66` | Stone | Secondary text, captions, form borders |
| `--colour-orry` | `#1E5A43` | Orry green | Links, buttons, header rule, brand |
| `--colour-orry-dark` | `#15412F` | Orry dark | Hover and pressed states |
| `--colour-moss` | `#D5E3D0` | Moss | Green belt fill on maps, light highlights |
| `--colour-red-line` | `#B8322A` | Red line | **Proposed site boundaries only** (maps, village plan, key). Also form errors. |
| `--colour-focus` | `#FFDD00` | Focus | Keyboard focus ring only |
| `--colour-rule` | `#C9D1CC` | Rule | Decorative dividers and table lines (not form borders) |

**Contrast** (WCAG 2.2, checked):

| Pair | Ratio | Passes |
|---|---|---|
| Whinstone on Paper | 14.7:1 | AAA text |
| Whinstone on Harl | 13.0:1 | AAA text |
| Orry on Paper (links) | 8.1:1 | AAA text |
| Paper on Orry (buttons) | 8.1:1 | AAA text |
| Stone on Paper | 5.7:1 | AA text, form borders |
| Red line on Paper | 6.0:1 | AA text, graphics |
| Red line on Moss | 4.5:1 | Graphics (3:1 needed) |
| Whinstone on Focus | 10.9:1 | Focus indicator |

Rules:
- Use Red line only for proposed sites and errors. It never appears as decoration, in headings or on buttons.
- Use Orry green for actions and links. Don't use it as a large background, except the deadline strip.
- Never put text on Moss smaller than 18px.
- No other colours. Add any new colour to `tokens.css` and to this table, with its contrast checked.
- Light theme only at launch. Tokens are named by role, so a dark theme can be added later.

---

## 4. Typography

Two families, clearly different:

| Face | Role | Weights |
|---|---|---|
| **Libre Caslon Display** | Home page hero headline only (48px and up) | 400 |
| **Libre Caslon Text** | `h1` and `h2` | 400 (700 for rare emphasis) |
| **Atkinson Hyperlegible Next** | Everything else: body, `h3`–`h6`, navigation, buttons, forms, tables, captions | 400, 400 italic, 700 |

Why these faces:
- **Caslon** was the standard British typeface of the mid-18th century, when the village was laid out. It gives the headings their character and their link to the place.
- **Atkinson Hyperlegible Next** was designed by the Braille Institute for readers with low vision. Its letters are hard to confuse (I, l, 1; O, 0). Many readers will be older, so it suits the body text.

All three are open-source (SIL Open Font License) and self-hosted.

### Type scale

Based on the classical scale in *The Elements of Typographic Style*. Sizes are fluid between a 360px and a 1280px screen.

| Token | Size | Use |
|---|---|---|
| `--text-display` | 42 → 72px | Home hero headline |
| `--text-h1` | 36 → 48px | Page title |
| `--text-h2` | 28 → 36px | Section headings |
| `--text-h3` | 24px | Sub-sections (Atkinson, bold) |
| `--text-lead` | 21px | Intro paragraph under a page title |
| `--text-base` | 18px | Body text. Never smaller for paragraphs. |
| `--text-sm` | 16px | Captions, source notes, table footnotes. The minimum size anywhere. |

Rules:
- Body text is 18px with line height 1.6. Headings have line height 1.15.
- Line length is at most 65 characters (`--measure`).
- Text is left-aligned everywhere: no centred paragraphs and no justified text.
- Headings are in sentence case.
- Use bold for real emphasis only, a few times per page. Use italics for titles of documents.
- Use tabular figures in tables (`font-variant-numeric: tabular-nums`).
- Never use Caslon below 28px. It gets spindly. Below that size, use Atkinson bold.

---

## 5. Layout and spacing

- **Container:** max width 72rem (1152px), with side gutters of 16px on phones and 32px on desktop.
- **Prose column:** max width 65 characters, left-aligned within the container.
- **Breakouts:** maps and the village plan may use the full container width.
- **Spacing:** use the `--space-*` scale (a 4px base). Leave about 64px between major sections on desktop and 48px on mobile.
- **Shape:** 4px radius on buttons and form controls only. Maps, panels, tables and images are square-cornered. No shadows. Use borders or Harl backgrounds for separation.
- **Touch targets:** at least 48 × 48px.

### Home page

```
┌──────────────────────────────────────────────────────────┐
│ Responses to LDP3 close on Friday 22 January 2027.        │  deadline strip (Orry, white text)
│ How to respond                                            │
├──────────────────────────────────────────────────────────┤
│ [mark] Site name                The plan  Sites  Issues   │  header (Orry 4px bottom rule)
│                                 How to respond  About     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ A planned village,                                        │  hero headline: Caslon Display,
│ planned again.                                            │  left-aligned, 2 lines max
│                                                           │
│ Up to 660 new homes are proposed on three sites…          │  lead paragraph, 65ch
│ [How to respond]  [See the sites]                         │  primary + secondary button
│                                                           │
│ ┌───────────────────────────────────────────────────────┐ │
│ │      village plan: streets in fine Whinstone lines,    │ │  full container width
│ │      the Orry in Moss, three red-line sites labelled   │ │
│ │      "Eaglesham North, about 360 homes"         N ↑    │ │
│ └───────────────────────────────────────────────────────┘ │
│ Indicative only. See the council's maps for exact lines.  │  caption, 16px Stone
│                                                           │
│ What's proposed                                           │  h2
│ Site              Homes   Developer        Land now       │  schedule table
│ Eaglesham North     360   Mactaggart…      Green belt     │
│ Holehouse Road      100   Robertson Homes  Greenfield     │
│ Waulkers Loan       200   Taylor Wimpey    Greenfield     │
│                                                           │
│ The big issues                                            │  three text blocks, side by side
│ Traffic and…   Wildlife and…   Infrastructure             │  on desktop, stacked on mobile.
│                                                           │  No boxes or cards.
│ How to respond in three steps                             │  numbered (a real sequence)
│ 1 …  2 …  3 …                       [Start your response] │
├──────────────────────────────────────────────────────────┤
│ footer on Harl: who we are, contact, privacy,             │
│ accessibility, sources. "Independent of East              │
│ Renfrewshire Council."                                    │
└──────────────────────────────────────────────────────────┘
```

### Site page

```
┌──────────────────────────────────────────────────────────┐
│ deadline strip / header                                   │
├──────────────────────────────────────────────────────────┤
│ The sites › Waulkers Loan                                 │  breadcrumb, 16px
│ Waulkers Loan                                             │  h1 Caslon Text
│ Up to 200 homes on greenfield land…                       │  lead
│                                                           │
│ ┌─ prose column (65ch) ──────────┐ ┌─ key facts ───────┐  │  on mobile, key facts
│ │ What's proposed                │ │ Homes      200    │  │  come first, full width
│ │ What the plan says             │ │ Area       TODO   │  │
│ │ ▌ From the plan (quote + page) │ │ Developer  …      │  │  key facts: Harl panel,
│ │ What it could mean             │ │ Land now   …      │  │  definition list
│ │ Questions we're asking         │ │ LDP3 ref   …      │  │
│ └────────────────────────────────┘ └───────────────────┘  │
│ ┌───────────── map zoomed to site ──────────────────────┐ │
│ └───────────────────────────────────────────────────────┘ │
│ Key: ▭ red line = proposed site   ▒ green belt             │
│ [Respond about this site]                                 │
│ Sources                                                   │  numbered list, 16px
└──────────────────────────────────────────────────────────┘
```

---

## 6. Components

**Deadline strip.** A full-width band at the very top of every page: Orry background, white text, 16–18px. "Responses to LDP3 close on Friday 22 January 2027." plus the link "How to respond". On the home and respond pages, a small script may add "That's N days away." Without JavaScript only the date shows. After the deadline, the strip switches to "The LDP3 consultation closed on 22 January 2027."

**Header.** The logo mark and the site name (Libre Caslon Text, 24px) on the left, with navigation on the right. On phones, the navigation becomes a "Menu" button that opens a simple list: a `<button aria-expanded>`, not a hamburger icon alone. Beneath the header is a 4px Orry rule.

**Logo mark.** A simplified outline of the village's street plan around the Orry, in Orry green, used at small sizes and as the favicon. Wordmark only until the name is chosen.

**Buttons.**
- Primary: Orry background, white text, Atkinson bold 18px, padding 12px 20px, 4px radius, minimum height 48px. Hover and pressed states use Orry dark.
- Secondary: white background, 2px Orry border, Orry text.
- Labels start with a verb and say what happens: "Start your response", "Copy your response", "Open the council's form". Never "Submit" or "Click here", and never add an arrow.

**Links.** Orry, always underlined (1px, offset 0.15em). On hover the underline goes to 2px. Link text describes the destination. External links to the council say so in the text ("the council's response form").

**Focus.** Every focusable element shows a 3px Whinstone outline outside a 2px yellow ring:
`outline: 3px solid var(--colour-whinstone); outline-offset: 2px; box-shadow: var(--focus-ring);`
Apply it with `:focus-visible`. Never remove outlines without replacing them.

**Site schedule.** A real `<table>` with a caption. Columns: Site (linked), Homes (up to), Area (ha), Developer, Land now. Numbers are right-aligned with tabular figures, and there's a total row. Below 600px, each row becomes a stacked block with its labels. Rows have 1px Rule lines and no zebra stripes.

**Key facts.** A Harl panel containing a `<dl>`. Terms in Atkinson bold, values in regular weight.

**Callout: "From the plan".** A quotation from LDP3 or another official document. Harl background, 4px Stone left border, the quote in body text, and a source line beneath ("Proposed LDP3, page 47"). Use `<blockquote>` with `<cite>`.

**Callout: "Our view".** The group's opinion. Harl background, 4px Orry left border, with a heading reading "Our view" in Atkinson bold. Opinions on the site must sit inside this callout or on the Our view page.

**Steps.** An `<ol>` for real sequences only (How to respond, the LDP3 timeline). Numbers in Libre Caslon Text at 36px, with step titles in Atkinson bold.

**Source notes.** At the end of each page, a "Sources" `h2` followed by a numbered list in 16px. In-text references use plain links rather than footnote superscripts.

**Forms (response helper, Phase 2 forms).**
- Labels above inputs, in Atkinson bold. Hint text in Stone, 16px.
- Inputs have a 2px Stone border, 4px radius, 18px text and a minimum height of 48px.
- Checkboxes and radios are 24px, with labels you can click.
- Errors: a Red line left border on the field, an error message in text above the input naming the problem and the fix, and a summary at the top of the form.
- Confirmation (for example, "Copied") is announced through `aria-live="polite"`.

**Details/FAQ.** Native `<details>` and `<summary>`, with a 1px Rule between items. The summary is in Atkinson bold, with a plus/minus marker drawn in CSS.

**Footer.** Harl background, 16–18px. It has three groups (About this site, The plan, Contact) and the independence line: "This site is run by local volunteers. It is independent of East Renfrewshire Council and of any developer." Licence line once agreed.

---

## 7. Maps and the village plan

### The village plan (home page hero)

The memorable piece, and the only bold element.
- A static inline SVG, generated once from OpenStreetMap data by a script in `/scripts`, then tidied by hand and committed. It is not fetched live.
- **Streets:** Whinstone, 1–1.5px. Main streets (Montgomery Street, Polnoon Street) are a little heavier.
- **The Orry:** Moss fill. **The burn:** a Stone line.
- **Proposed sites:** a 3px Red line boundary, no fill, labelled in Atkinson bold with the site name and home count ("Waulkers Loan, up to 200 homes").
- A **north arrow** and a **scale bar**, small and in Stone, as on a planning drawing.
- A caption below: "Indicative only. See the council's LDP3 maps for exact boundaries." Plus the OSM credit.
- The SVG has a `<title>` and a text alternative listing the three sites and their home numbers.
- **The one animation on the site:** on first load, the three red lines draw themselves in (a `stroke-dashoffset` animation over 1.2s, once). With `prefers-reduced-motion`, they simply appear.

### Interactive maps (Leaflet)

- Tiles: OpenStreetMap, desaturated with a CSS filter on the tile pane only (`filter: grayscale(0.7) contrast(0.95)`). The data layers stay in full colour.
- Proposed sites: Red line stroke 3px with a fill of the same colour at 10% opacity, so the area can be clicked.
- Green belt: Moss fill at 50% opacity, no stroke.
- Conservation area: Orry 2px dashed line, no fill.
- Labels: site name and homes in a white label with a 1px Rule border.
- The key sits **below** the map as HTML, not floating over it.
- Map height: 60vh on phones (up to 420px) and 520px on desktop.
- Scroll-wheel zoom is off until the map is clicked or focused. Zoom buttons are 44px.
- Attribution: "© OpenStreetMap contributors", plus whatever the council requires for its boundaries.

---

## 8. Imagery

- **Use:** your own photographs of Eaglesham and Waterfoot (the Orry, Montgomery Street, the fields at each site, taken from public paths), in natural daylight and unstaged.
- **Also fine:** Geograph images (CC BY-SA), credited in the caption.
- **Don't use:** stock photos, AI-generated images, the council's logo or images, or developers' marketing visuals unless they're quoted as evidence with a credit.
- **People:** no identifiable people without consent, and never identifiable children.
- **Alt text** says what matters in the picture for this page ("The field at Waulkers Loan, looking north towards the village"), not "image of field".
- **Social preview image** (1200 × 630): the village plan graphic with the site name and the deadline. Text must be readable at thumbnail size.

---

## 9. Motion

- One orchestrated moment: the red lines drawing in on the home page.
- Interface feedback is welcome and brief (150ms): the menu opening, the "Copied" confirmation, details expanding.
- No scroll-triggered animation, parallax, carousels or auto-playing video.
- Everything respects `prefers-reduced-motion: reduce`.

---

## 10. Accessibility checklist

Every page and component:
- [ ] One `h1`, with headings in order and none skipped
- [ ] A skip link to `<main>`, plus `<header>`, `<nav>`, `<main>` and `<footer>` landmarks
- [ ] Colour contrast as in §3, and never colour alone to carry meaning (the map key uses line style as well as colour)
- [ ] Visible focus on every interactive element, and a logical tab order
- [ ] Usable at 400% zoom and at 360px width without horizontal scrolling
- [ ] Forms: labels, hints, `fieldset`/`legend`, text errors and a summary
- [ ] Images have alt text. Decorative SVGs get `aria-hidden="true"`.
- [ ] Maps have a text equivalent (the schedule or site list)
- [ ] Links make sense out of context
- [ ] Works with JavaScript turned off
- [ ] `lang="en-GB"` on `<html>`

---

## 11. Writing style

### Voice

We're neighbours explaining something complicated, clearly and fairly. Calm, specific, plain. We take people's concerns seriously and we take the facts seriously.

### Rules

- **Plain English.** Short sentences (aim for under 20 words), common words, active voice. Explain any planning term the first time it appears, or link to the glossary.
- **Lead with what the reader needs.** What's happening, what it means for them, what they can do, and by when.
- **Facts are sourced.** Link to the LDP3 page or the council document. If we're not sure, we don't say it.
- **Opinions are labelled** as the group's: "We think…", "Our view is…".
- **Fair.** We acknowledge the need for homes, including affordable homes. Our case is about how and where: infrastructure first, transport, wildlife, the character of a conservation village.
- **No attacks.** We don't question anyone's motives, and we don't name individuals except when quoting their public statements with a source.
- **Sentence case** for all headings, buttons and navigation.

### Conventions

| Thing | Write | Not |
|---|---|---|
| Dates | Friday 22 January 2027 | 22/01/27, January 22nd |
| Times | 7pm, 10:30am | 19:00, 7.00 p.m. |
| Numbers | Numerals: 660 homes, 3 sites | six hundred and sixty |
| Approximate | about 360 homes, up to 200 homes | c.360, ~360 |
| The council | East Renfrewshire Council the first time, then "the council" | ERC (except in tables), "the Council" |
| The plan | Local Development Plan 3 (LDP3) the first time, then LDP3 | LDP 3, Ldp3 |
| Places | Eaglesham North, Holehouse Road, Waulkers Loan, the Orry, Eaglesham Burn | Walkers Loan, Holehouse Rd |
| Developers | As named in the plan, e.g. Mactaggart & Mickel | MacMic (except when quoting) |
| Links | Descriptive: "read the council's guide to responding" | "click here", "read more" |
| Buttons | Verb first: "Start your response" | "Submit", "Go" |

### Words

| Use | Avoid |
|---|---|
| have your say, respond, raise a concern | fight, battle, stop, save our village |
| proposed, the plan says | planned (as if decided), "they want to" |
| evidence, what we've seen | everyone knows, obviously |
| we're asking the council to… | the council doesn't care |
| developer | greedy developers, landowners cashing in |

No exclamation marks. No ALL CAPS. No emoji in page copy.

### Errors and empty states

Say what happened and what to do, in the interface's voice, without apologising. "Choose at least one site to continue." not "Oops! Something went wrong." An empty news page says "No updates yet. The latest from the group will appear here."

---

## 12. Terms we use

The glossary on the site comes from `src/data/glossary.yaml`. Use these terms consistently and link the first mention on a page to the glossary.
