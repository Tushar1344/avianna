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

  SECTIONS.forEach((section) => {
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
      const list = document.createElement("div");
      list.className = "post-list";
      posts.forEach((p) => {
        const a = document.createElement("a");
        a.className = "post-row";
        a.href = p.external_url
          ? p.external_url
          : `post.html?slug=${encodeURIComponent(p.slug)}`;
        a.innerHTML =
          `<span class="post-name">${esc(p.title)}</span>` +
          `<span class="post-date">${fmtDate(p.date)}</span>`;
        list.appendChild(a);
      });
      group.appendChild(list);
    }

    root.appendChild(group);
  });
})();
