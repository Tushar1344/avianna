/* Renders the blog index, grouped by section, from the POSTS manifest. */

(function () {
  const fmtDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const root = document.getElementById("blog-root");
  const byDate = (a, b) => b.date.localeCompare(a.date);

  // Order sections so the one with the newest post sits at the top.
  // Empty sections fall to the bottom.
  const newestDateOf = (sectionId) =>
    POSTS.filter((p) => p.section === sectionId)
      .map((p) => p.date)
      .sort()
      .pop() || "";

  const orderedSections = [...SECTIONS].sort((a, b) =>
    (newestDateOf(b.id) || "").localeCompare(newestDateOf(a.id) || "")
  );

  orderedSections.forEach((section) => {
    const posts = POSTS.filter((p) => p.section === section.id).sort(byDate);

    const group = document.createElement("section");
    group.className = "section-group";
    group.id = section.id;

    const n = posts.length;
    group.innerHTML = `<p class="group-label">${esc(section.label)}</p>`;

    if (n === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-note";
      empty.textContent = "Nothing here yet.";
      group.appendChild(empty);
    } else {
      // Cluster posts that share a series into one item, keeping the
      // cluster at the position of its newest part.
      const items = [];
      const clusters = new Map();
      posts.forEach((p) => {
        if (p.series && typeof SERIES !== "undefined" && SERIES[p.series]) {
          if (!clusters.has(p.series)) {
            const c = { seriesId: p.series, posts: [] };
            clusters.set(p.series, c);
            items.push(c);
          }
          clusters.get(p.series).posts.push(p);
        } else {
          items.push(p);
        }
      });

      const hrefOf = (p) =>
        p.external_url || `post.html?slug=${encodeURIComponent(p.slug)}`;

      const list = document.createElement("div");
      list.className = "post-list";
      items.forEach((item) => {
        if (item.seriesId) {
          const meta = SERIES[item.seriesId];
          const parts = [...item.posts].sort((a, b) => (a.part || 0) - (b.part || 0));
          const block = document.createElement("div");
          block.className = "series-block";
          block.innerHTML =
            `<div class="series-head">` +
              `<span class="series-title">${esc(meta.title)}</span>` +
              `<span class="series-tag">Series · ${parts.length === 1 ? "Part 1" : `${parts.length} parts`}</span>` +
            `</div>` +
            (meta.blurb ? `<p class="series-blurb">${esc(meta.blurb)}</p>` : "");
          parts.forEach((p) => {
            const a = document.createElement("a");
            a.className = "series-row";
            a.href = hrefOf(p);
            a.innerHTML =
              `<span class="series-part">Part ${p.part}</span>` +
              `<span class="post-name">${esc(p.title)}</span>` +
              `<span class="post-date">${fmtDate(p.date)}</span>`;
            block.appendChild(a);
          });
          list.appendChild(block);
        } else {
          const a = document.createElement("a");
          a.className = "post-row";
          a.href = hrefOf(item);
          a.innerHTML =
            `<span class="post-name">${esc(item.title)}</span>` +
            `<span class="post-date">${fmtDate(item.date)}</span>`;
          list.appendChild(a);
        }
      });
      group.appendChild(list);
    }

    root.appendChild(group);
  });
})();
