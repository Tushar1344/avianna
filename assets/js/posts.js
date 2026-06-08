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
    slug: "a-tour-of-the-gaussian-integral",
    title: "A Tour of the Gaussian Integral",
    section: "math",
    date: "2026-05-28",
    summary: "Three ways to evaluate ∫e^(-x²)dx, and why the polar trick is the one you remember.",
    tags: ["analysis", "integrals"],
    file: "content/math/a-tour-of-the-gaussian-integral.md",
  },
  {
    slug: "attention-from-first-principles",
    title: "Attention From First Principles",
    section: "ai",
    date: "2026-06-02",
    summary: "Building scaled dot-product attention up from the questions it answers, with a tiny NumPy implementation.",
    tags: ["transformers", "deep-learning"],
    file: "content/ai/attention-from-first-principles.md",
  },
  {
    slug: "designing-a-durable-workflow-engine",
    title: "Designing a Durable Workflow Engine",
    section: "software",
    date: "2026-05-15",
    summary: "Separating what work means from how it runs — a pipeline sketch with a Mermaid diagram and code.",
    tags: ["architecture", "systems"],
    file: "content/software/designing-a-durable-workflow-engine.md",
  },
  {
    slug: "on-keeping-a-research-notebook",
    title: "On Keeping a Research Notebook",
    section: "misc",
    date: "2026-04-20",
    summary: "A few habits for writing things down before you understand them.",
    tags: ["writing", "habits"],
    file: "content/misc/on-keeping-a-research-notebook.md",
  },
];
