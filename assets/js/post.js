/* ===========================================================================
   Post reading view.
   - resolves ?slug= against the POSTS manifest
   - fetches the markdown file
   - protects math from the markdown parser, renders marked -> KaTeX -> hljs
   - renders fenced ```mermaid blocks
   - builds the right-rail "On this page" TOC with scrollspy
   =========================================================================== */

(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");

  const elArticle = document.getElementById("article");
  const elProse = document.getElementById("prose");
  const elToc = document.getElementById("toc");
  const elMeta = document.getElementById("rail-meta");

  const post = (typeof POSTS !== "undefined" && POSTS.find((p) => p.slug === slug)) || null;

  if (!post) {
    elProse.innerHTML = `<p class="error">Post not found. <a href="blog.html">← Back to the blog</a></p>`;
    return;
  }

  document.title = `${post.title} — we`;

  const fmtDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sectionLabel =
    (typeof SECTIONS !== "undefined" &&
      (SECTIONS.find((s) => s.id === post.section) || {}).label) ||
    post.section;

  // -- header ----------------------------------------------------------------
  document.getElementById("article-eyebrow").textContent = sectionLabel;
  document.getElementById("article-title").textContent = post.title;
  const subEl = document.getElementById("article-sub");
  if (post.summary) subEl.textContent = post.summary; else subEl.remove();

  // -- math protection -------------------------------------------------------
  // Pull $$...$$ and $...$ out before markdown so underscores/backslashes survive.
  function protectMath(src) {
    const store = [];
    const stash = (tex) => {
      const token = `@@MATH${store.length}@@`;
      store.push(tex);
      return token;
    };
    let out = "";
    let i = 0;
    let inFence = false;
    const lines = src.split("\n");
    // First pass: handle fenced code blocks line-aware so we never touch math inside them.
    const protectedLines = lines.map((line) => {
      if (/^\s*```/.test(line)) { inFence = !inFence; return line; }
      if (inFence) return line;
      return null; // marker: process below
    });

    // Rebuild, processing non-fence lines for math.
    inFence = false;
    const result = [];
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (/^\s*```/.test(line)) { inFence = !inFence; result.push(line); continue; }
      if (inFence) { result.push(line); continue; }
      result.push(processInline(line, stash));
    }
    return { text: result.join("\n"), store };
  }

  // Handles $$...$$ (may be on its own line) and inline $...$ within a line,
  // while ignoring inline-code spans (`...`).
  function processInline(line, stash) {
    // display math: $$ ... $$ on a single line
    line = line.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => stash("$$" + tex + "$$"));
    // split out inline code so we don't touch $ inside backticks
    const parts = line.split(/(`[^`]*`)/g);
    return parts
      .map((part) => {
        if (part.startsWith("`")) return part;
        return part.replace(/\$([^\$\n]+?)\$/g, (_, tex) => stash("$" + tex + "$"));
      })
      .join("");
  }

  function restoreMath(html, store) {
    return html.replace(/@@MATH(\d+)@@/g, (_, n) => store[+n]);
  }

  // -- render ----------------------------------------------------------------
  fetch(post.file)
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return r.text();
    })
    .then((md) => {
      const { text, store } = protectMath(md);

      marked.setOptions({ gfm: true, breaks: false });
      let html = marked.parse(text);
      html = restoreMath(html, store);
      elProse.innerHTML = html;

      // mermaid: convert <pre><code class="language-mermaid"> to <div class="mermaid">
      let hasMermaid = false;
      elProse.querySelectorAll("pre code.language-mermaid").forEach((code) => {
        const div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = code.textContent;
        code.closest("pre").replaceWith(div);
        hasMermaid = true;
      });

      // code highlighting (skip mermaid which we removed)
      if (window.hljs) {
        elProse.querySelectorAll("pre code").forEach((b) => hljs.highlightElement(b));
      }

      // math
      if (window.renderMathInElement) {
        renderMathInElement(elProse, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
          throwOnError: false,
        });
      }

      if (hasMermaid && window.mermaid) {
        mermaid.run({ nodes: elProse.querySelectorAll(".mermaid") });
      }

      buildToc();
      buildMeta();
    })
    .catch((err) => {
      elProse.innerHTML =
        `<p class="error">Couldn't load this post (${esc(String(err.message || err))}).` +
        ` If you're viewing locally, serve the folder over HTTP — see the README.</p>`;
    });

  // -- right rail: TOC + scrollspy ------------------------------------------
  function slugify(s) {
    return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  }

  function buildToc() {
    const heads = [...elProse.querySelectorAll("h2, h3")];
    if (!heads.length) { elToc.closest(".toc-block").style.display = "none"; return; }

    const links = [];
    heads.forEach((h, i) => {
      if (!h.id) h.id = slugify(h.textContent) || `h-${i}`;
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.className = h.tagName === "H3" ? "lvl-3" : "lvl-2";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById(h.id).scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${h.id}`);
      });
      elToc.appendChild(a);
      links.push(a);
    });

    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const setActive = (id) => links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href").slice(1) === id));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 }
    );
    heads.forEach((h) => observer.observe(h));
  }

  // -- embedded sims: auto-resize iframes from their postMessage ------------
  window.addEventListener("message", (e) => {
    const data = e.data;
    if (!data || data.type !== "embed-height") return;
    const frames = elProse.querySelectorAll("iframe.embed-frame");
    for (const f of frames) {
      if (f.contentWindow === e.source) {
        f.style.height = `${data.height}px`;
        break;
      }
    }
  });

  function buildMeta() {
    const words = elProse.textContent.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 220));
    const rows = [
      ["Section", sectionLabel],
      ["Published", fmtDate(post.date)],
      ["Read", `${mins} min`],
    ];
    if (post.tags && post.tags.length) rows.push(["Tags", post.tags.join(", ")]);
    elMeta.innerHTML = rows
      .map(([k, v]) => `<div><span class="k">${k}</span><br>${esc(String(v))}</div>`)
      .join("");
  }
})();
