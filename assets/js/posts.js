/* ===========================================================================
   Post manifest.

   To add a post:
     1. Drop a Markdown file under content/<section>/<slug>.md
     2. Add one entry to the POSTS array below.
     3. Bump the ?v= query on the <script> tags in blog.html AND post.html.
        Skipping this leaves returning visitors on a cached manifest: the
        new post 404s with a stuck "Loading…" title until their cache expires.
     4. Rebuild the feed: python3 scripts/build_feed.py

   Fields:
     slug          unique id, used in the URL: post.html?slug=<slug>
     title         display title
     section       one of: agents | ai (add a section here when its first post ships)
     date          ISO date "YYYY-MM-DD" (used for sorting + display)
     summary       one-line description shown on the blog index
     tags          array of short strings
     file          path to the markdown file (relative to site root)
     external_url  optional. If set, the blog index row links here directly
                   instead of going through post.html (used for posts that
                   need standalone HTML — interactive sims, etc.)
     series        optional. Key into SERIES below. Posts sharing a series
                   are grouped into one series block on the blog index.
     part          required when series is set: 1-based part number.
   =========================================================================== */

const SECTIONS = [
  { id: "agents", label: "Agents" },
  { id: "ai",     label: "AI" },
];

/* Multi-part series. A series renders as one distinct block on the index. */
const SERIES = {
  concord: {
    title: "Concord",
    blurb: "Contracts for the actions AI agents take.",
  },
  lattice: {
    title: "Lattice",
    blurb: "How to onboard AI agents the way you onboard employees. A three-part series.",
  },
};

/* Renamed posts: old slug -> current slug. post.js redirects on lookup miss. */
const SLUG_ALIASES = {
  "lattice-digital-labor": "lattice-1-the-problem",
};

const POSTS = [
  {
    slug: "better-models-different-risks",
    title: "Better Models, Different Risks",
    section: "agents",
    date: "2026-07-13",
    summary: "Better models shrink some enterprise risks and grow others. Capability is not authority: how reach, velocity, and blast radius change the shape of agent risk.",
    tags: ["agents", "governance", "risk", "capability"],
    file: "content/governance/better-models-different-risks.md",
  },
  {
    slug: "the-worker-and-the-action",
    title: "The worker and the action",
    section: "agents",
    date: "2026-07-04",
    summary: "An agent gets neither the onboarding a new hire gets nor the sign-offs a transaction gets. How to build both, and why one without the other fails.",
    tags: ["lattice", "concord", "agents", "governance"],
    file: "content/governance/the-worker-and-the-action.md",
  },
  {
    slug: "lattice-1-the-problem",
    title: "The problem",
    section: "agents",
    date: "2026-07-02",
    summary: "Onboarding digital labor is the hardest challenge of the agent era. A prompt configures a model. It does not onboard a worker.",
    tags: ["lattice", "agents", "governance"],
    series: "lattice",
    part: 1,
    external_url: "lattice/part-1-the-problem.html",
  },
  {
    slug: "lattice-2-the-framework",
    title: "The framework",
    section: "agents",
    date: "2026-07-02",
    summary: "What a properly onboarded agent inherits: a role, context, permissions, policy, evaluation, and a path to more trust.",
    tags: ["lattice", "agents", "governance"],
    series: "lattice",
    part: 2,
    external_url: "lattice/part-2-the-framework.html",
  },
  {
    slug: "lattice-3-in-practice",
    title: "In practice",
    section: "agents",
    date: "2026-07-02",
    summary: "An agent traced through Lattice end to end, graduating from observing to acting on its own without losing accountability.",
    tags: ["lattice", "agents", "governance"],
    series: "lattice",
    part: 3,
    external_url: "lattice/part-3-in-practice.html",
  },
  {
    slug: "the-visible-pursuit",
    title: "The Visible Pursuit",
    section: "ai",
    date: "2026-06-07",
    summary: "Why every action you take to get what you want tells someone else what you want. Goal recognition, with two interactive simulations.",
    tags: ["goal-recognition", "information-theory", "interactive"],
    file: "content/ai/the-visible-pursuit.md",
  },
  {
    slug: "concord-1-why-agents-need-a-contract",
    title: "Why agents need a contract",
    section: "agents",
    date: "2026-06-08",
    summary: "Part 1 of three on Concord. Durable execution tells you what ran. It doesn't tell you what it meant, and that gap matters more now that agents propose work. With an interactive scattered-evidence simulation.",
    tags: ["concord", "agents", "durability", "interactive"],
    series: "concord",
    part: 1,
    external_url: "posts/concord-1-why-agents-need-a-contract.html",
  },
  {
    slug: "concord-2-contract-not-runtime",
    title: "Contract, not runtime",
    section: "agents",
    date: "2026-06-07",
    summary: "Part 2 of three. Concord is not DBOS, not LangGraph, not OPA. Three small interactive demos draw the layer boundary: a clickable layer stack, an audit-tier picker, and an SVG capability graph.",
    tags: ["concord", "architecture", "interactive"],
    series: "concord",
    part: 2,
    external_url: "posts/concord-2-contract-not-runtime.html",
  },
  {
    slug: "concord-3-day-in-the-life",
    title: "A day in the life",
    section: "agents",
    date: "2026-06-06",
    summary: "Part 3 of three. A hotel booking traced through Concord end-to-end. Animated nine-step playback with three modes: full contract, minimal subset, no Concord at all.",
    tags: ["concord", "walkthrough", "interactive"],
    series: "concord",
    part: 3,
    external_url: "posts/concord-3-day-in-the-life.html",
  },
];
