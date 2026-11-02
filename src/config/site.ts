/*
  Site-wide settings. Every page reads the site name, deadline and links from here,
  so change them in this one place.
  Anything marked TODO still needs confirming before launch (see docs/PROJECT-BRIEF.md).
*/

export const site = {
  // Placeholder until the group chooses a name (Meeting 1, action 10).
  name: "Eaglesham & Waterfoot LDP3",

  // TODO: the live address once the .org.uk domain is registered, e.g. "https://example.org.uk".
  // Left empty for now, which is why astro.config.mjs only sets `site` when this has a value.
  url: "",

  // Default text for link previews (Facebook, WhatsApp) when a page doesn't set its own.
  description:
    "What East Renfrewshire Council's Local Development Plan 3 proposes for Eaglesham and Waterfoot, and how to respond before Friday 22 January 2027.",

  // Consultation deadline as an ISO date (YYYY-MM-DD). Extended from 22 December 2026.
  deadline: "2027-01-22",

  council: {
    // TODO: confirm this is the council's LDP3 page (the starter site files use the same link).
    ldp3Page: "https://www.eastrenfrewshire.gov.uk/ldp3",
    // TODO: exact address of the response form on the council's consultation portal.
    responseForm: "https://getinvolved.eastrenfrewshire.gov.uk/",
    // TODO: confirm with the council before launch.
    email: "ldp@eastrenfrewshire.gov.uk",
  },

  // TODO: the group email address (Phase 0). Left empty so nothing is shown until it exists.
  contactEmail: "",

  // TODO: path to the 1200 × 630 social preview image (Phase 1, step 9).
  ogImage: "",
} as const;
