/* ===========================================================================
   Enhancement layer for the statically generated post pages under /posts/
   (built by scripts/build_static.py). The article HTML, TOC links, and rail
   meta are server-rendered; this only:
     - highlights code blocks (hljs)
     - renders KaTeX math left in the source as $...$ / $$...$$
     - drives the right-rail TOC scrollspy
     - resizes embedded sim iframes from their postMessage
   Loaded with `defer` after the hljs/KaTeX CDN bundles, so both are ready.
   =========================================================================== */

(function () {
  var prose = document.getElementById("prose");
  if (!prose) return;

  if (window.hljs) {
    prose.querySelectorAll("pre code").forEach(function (b) {
      hljs.highlightElement(b);
    });
  }

  if (window.renderMathInElement) {
    renderMathInElement(prose, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }

  // -- TOC: smooth scroll + scrollspy (links are server-rendered) -----------
  var toc = document.getElementById("toc");
  var links = toc ? Array.prototype.slice.call(toc.querySelectorAll("a")) : [];
  var setActive = function (id) {
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href").slice(1) === id);
    });
  };
  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", a.getAttribute("href"));
    });
  });
  var heads = prose.querySelectorAll("h2[id], h3[id]");
  if (links.length && heads.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 }
    );
    heads.forEach(function (h) { observer.observe(h); });
  }

  // -- embedded sims: auto-resize iframes from their postMessage ------------
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "embed-height") return;
    var frames = prose.querySelectorAll("iframe.embed-frame");
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) {
        frames[i].style.height = data.height + "px";
        break;
      }
    }
  });
})();
