/* ===========================================================================
   Post manifest.

   To add a post:
     1. Drop a Markdown file under content/<section>/<slug>.md
     2. Add one entry to the POSTS array below.

   Fields:
     slug     unique id, used in the URL: post.html?slug=<slug>
     title    display title
     section  one of: math | ai | software | misc
     date     ISO date "YYYY-MM-DD" (used for sorting + display)
     summary  one-line description shown on the blog index
     tags     array of short strings
     file     path to the markdown file (relative to site root)
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
];
