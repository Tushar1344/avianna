/* ===========================================================================
   Post manifest.

   To add a post:
     1. Drop a Markdown file under content/<section>/<slug>.md
     2. Add one entry to the POSTS array below.

   Fields:
     slug          unique id, used in the URL: post.html?slug=<slug>
     title         display title
     section       one of: math | ai | software | misc
     date          ISO date "YYYY-MM-DD" (used for sorting + display)
     summary       one-line description shown on the blog index
     tags          array of short strings
     file          path to the markdown file (relative to site root)
     external_url  optional. If set, the blog index row links here directly
                   instead of going through post.html (used for posts that
                   need standalone HTML — interactive sims, etc.)
   =========================================================================== */

const SECTIONS = [
  { id: "math",     label: "Math" },
  { id: "ai",       label: "AI" },
  { id: "software", label: "Software" },
  { id: "misc",     label: "Misc" },
];

const POSTS = [
  {
    slug: "the-visible-pursuit",
    title: "The Visible Pursuit",
    section: "ai",
    date: "2026-06-07",
    summary: "Why every action you take to get what you want tells someone else what you want — goal recognition, with two interactive simulations.",
    tags: ["goal-recognition", "information-theory", "interactive"],
    file: "content/ai/the-visible-pursuit.md",
  },
  {
    slug: "concord-1-why-agents-need-a-contract",
    title: "Why agents need a contract",
    section: "software",
    date: "2026-06-08",
    summary: "Part 1 of three on Concord. Durable execution tells you what ran. It doesn't tell you what it meant — and that gap matters more now that agents propose work. With an interactive scattered-evidence simulation.",
    tags: ["concord", "agents", "durability", "interactive"],
    external_url: "posts/concord-1-why-agents-need-a-contract.html",
  },
  {
    slug: "concord-2-contract-not-runtime",
    title: "Contract, not runtime",
    section: "software",
    date: "2026-06-07",
    summary: "Part 2 of three. Concord is not DBOS, not LangGraph, not OPA. Three small interactive demos draw the layer boundary: a clickable layer stack, an audit-tier picker, and an SVG capability graph.",
    tags: ["concord", "architecture", "interactive"],
    external_url: "posts/concord-2-contract-not-runtime.html",
  },
  {
    slug: "concord-3-day-in-the-life",
    title: "A day in the life",
    section: "software",
    date: "2026-06-06",
    summary: "Part 3 of three. A hotel booking traced through Concord end-to-end. Animated nine-step playback with three modes — full contract, minimal subset, no Concord at all.",
    tags: ["concord", "walkthrough", "interactive"],
    external_url: "posts/concord-3-day-in-the-life.html",
  },
];
