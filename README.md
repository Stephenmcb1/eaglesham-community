# Eaglesham & Waterfoot LDP3 website

A community website explaining East Renfrewshire Council's Proposed Local Development Plan 3 (LDP3) for Eaglesham and Waterfoot, and helping residents respond before **Friday 22 January 2027**.

Run by volunteers from the Eaglesham Planning Objections and Info Group. Independent of East Renfrewshire Council. Intended to become the base of the Eaglesham & Waterfoot Community Council website.

**Status:** in development (Phase 1). A holding page is live while the site is built. See [`docs/PROJECT-BRIEF.md`](docs/PROJECT-BRIEF.md) for the plan and [`docs/STYLE-GUIDE.md`](docs/STYLE-GUIDE.md) for the design.

---

## For committee members: changing the words

Use **Pages CMS** at [app.pagescms.org](https://app.pagescms.org): it shows each page as a simple form. Start with the [editing guide](docs/EDITING-GUIDE.md).

Behind the scenes, all the words live in plain text files:

| To change… | Edit this file |
|---|---|
| A site's details (homes, developer, description) | `src/content/sites/<site-name>.md` |
| An issue page (traffic, wildlife, infrastructure) | `src/content/issues/<issue-name>.md` |
| The plan explained, About, Our view, Privacy, Accessibility | `src/content/pages/<page>.md` |
| Add a news update | Copy `src/content/news/_template.md`, rename it `YYYY-MM-DD-short-title.md` |
| The points offered in the response helper | `src/data/concerns.yaml` |
| Planning terms in the glossary | `src/data/glossary.yaml` |
| The site name, deadline, council links, contact email | `src/config/site.ts` (ask Stephen) |

The bit between the `---` lines at the top of each file holds fields such as the number of homes. Anything marked `TODO:` still needs checking or writing. You can also edit these files directly on GitHub (open the file and click the pencil icon), but Pages CMS is easier.

**Setting up Pages CMS (maintainer, once):** sign in at app.pagescms.org with GitHub, choose "Install the GitHub app" and give it access to this repository only. Add each editor as a collaborator on the repository (Settings, Collaborators) with write access. What editors can change is set in [`.pages.yml`](.pages.yml), which must match the rules in `src/content.config.ts`.

Please follow the writing rules in the style guide (§11). Facts need a source, and opinions go in "Our view".

---

## For developers

### What you need (Windows)

- [Git for Windows](https://git-scm.com/download/win)
- [Node.js](https://nodejs.org/), the current LTS version (must be 22.23 or newer for Astro 7)
- [VS Code](https://code.visualstudio.com/). Accept the recommended extensions when prompted.
- [Claude Code](https://docs.claude.com/en/docs/claude-code/overview), optional but this repo is set up for it

### Commands

```bash
npm install        # first time only
npm run dev        # local site at http://localhost:4321
npm run check      # type-check and validate content
npm run build      # build into dist/
npm run preview    # view the built site
```

### Working with Claude Code

Open a terminal in this folder and run `claude`. Claude Code reads `CLAUDE.md` automatically. For the first session, try:

> Read CLAUDE.md and both documents in docs/. Then do Phase 1, step 1 from the build order in the project brief. Explain each thing you do as you go.

Then take one build step per session, and commit after each one.

### Deploying

Every push to `main` on GitHub triggers a Cloudflare build (Workers static assets). Pull requests get a preview link. The build settings are in `wrangler.jsonc`, and `.node-version` sets the Node version Cloudflare uses.

---

## Accounts and ownership

Keep this table current. It's the handover list for the community council.

| Account | Registered to | Owners | Renewal / cost |
|---|---|---|---|
| Domain | TODO: group email | TODO | TODO: yearly, a few pounds |
| GitHub repository | Stephenmcb1 (personal) for now: https://github.com/Stephenmcb1/eaglesham-community. TODO: transfer to the group organisation | Stephen + TODO | Free |
| Cloudflare | TODO: group email | Stephen + TODO | Free |
| Group email | TODO | TODO | Free |
| Supabase (Phase 2, if used) | TODO: group email | TODO | Free tier |

## Licence

TODO: agree with the group. Suggested: code under MIT, written content under CC BY 4.0. Map data keeps its own licence (© OpenStreetMap contributors, plus the council's terms for site boundaries).
