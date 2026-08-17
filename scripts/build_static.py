#!/usr/bin/env python3
"""
Build the static (crawler-visible) HTML from assets/js/posts.js:

  1. posts/<slug>.html   — a full static page for every manifest post that is
                           authored as Markdown (`file:` field). Same shell as
                           post.html; content server-rendered; KaTeX/hljs/TOC
                           enhancement handled by assets/js/static-post.js.
  2. blog.html           — the post list between the POST-LIST markers, so
                           non-JS crawlers see every post link.
  3. sitemap.xml         — core pages + every static post page, lastmod from
                           git (today for files with uncommitted changes).

Run from the repo root whenever posts.js changes, after build_feed.py:

    python3 scripts/build_static.py

Needs the `markdown` package (the only non-stdlib dependency):

    pip install markdown
"""

from __future__ import annotations

import datetime as dt
import html
import json
import re
import subprocess
import sys
from pathlib import Path

try:
    import markdown
except ImportError:
    raise SystemExit("build_static.py: needs python-markdown — pip install markdown")

SITE_URL = "https://avianna.ai"
OG_IMAGE = f"{SITE_URL}/assets/brand/og-image.png"
LOGO = f"{SITE_URL}/assets/brand/logo-mark.png"
AUTHOR_URL = f"{SITE_URL}/tushar.html"

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_JS = REPO_ROOT / "assets" / "js" / "posts.js"
POSTS_DIR = REPO_ROOT / "posts"
BLOG_HTML = REPO_ROOT / "blog.html"
SITEMAP_OUT = REPO_ROOT / "sitemap.xml"

LIST_BEGIN = "<!-- build_static.py:POST-LIST:BEGIN — generated; edit posts.js and rerun scripts/build_static.py -->"
LIST_END = "<!-- build_static.py:POST-LIST:END -->"

MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July",
               "August", "September", "October", "November", "December"]


# --- posts.js manifest parsing (same approach as build_feed.py) --------------

def slice_array(src: str, name: str) -> str:
    m = re.search(rf"const\s+{re.escape(name)}\s*=\s*\[", src)
    if not m:
        raise SystemExit(f"build_static.py: couldn't find `const {name} = [` in posts.js")
    start = m.end()
    depth, in_str, escape = 1, None, False
    for i in range(start, len(src)):
        c = src[i]
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_str:
                in_str = None
        else:
            if c in ('"', "'"):
                in_str = c
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    return src[start:i]
    raise SystemExit(f"build_static.py: unterminated array `{name}` in posts.js")


def slice_object(src: str, name: str) -> str:
    m = re.search(rf"const\s+{re.escape(name)}\s*=\s*{{", src)
    if not m:
        raise SystemExit(f"build_static.py: couldn't find `const {name} = {{` in posts.js")
    start = m.end()
    depth, in_str, escape = 1, None, False
    for i in range(start, len(src)):
        c = src[i]
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_str:
                in_str = None
        else:
            if c in ('"', "'"):
                in_str = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return src[start:i]
    raise SystemExit(f"build_static.py: unterminated object `{name}` in posts.js")


def split_entries(arr_src: str) -> list[str]:
    blocks, depth, in_str, escape, cur = [], 0, None, False, None
    for i, c in enumerate(arr_src):
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_str:
                in_str = None
            continue
        if c in ('"', "'"):
            in_str = c
            continue
        if c == "{":
            if depth == 0:
                cur = i
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0 and cur is not None:
                blocks.append(arr_src[cur:i + 1])
                cur = None
    return blocks


_STRING_RE = re.compile(r'(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"')
_NUMBER_RE = re.compile(r"(\w+)\s*:\s*(\d+)\s*[,}\n]")
_TAGS_RE = re.compile(r"tags\s*:\s*\[([^\]]*)\]")
_TAG_TOKEN_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')


def _unescape(s: str) -> str:
    return (s.replace(r"\"", '"').replace(r"\'", "'").replace(r"\\", "\\")
            .replace(r"\n", "\n").replace(r"\t", "\t"))


def parse_entry(block: str) -> dict:
    fields: dict = {}
    for key, value in _STRING_RE.findall(block):
        fields[key] = _unescape(value)
    for key, value in _NUMBER_RE.findall(block):
        if key not in fields:
            fields[key] = int(value)
    m = _TAGS_RE.search(block)
    fields["tags"] = [_unescape(t) for t in _TAG_TOKEN_RE.findall(m.group(1))] if m else []
    for required in ("slug", "title", "section", "date", "summary"):
        if required not in fields:
            raise SystemExit(f"build_static.py: entry missing `{required}`:\n{block}")
    return fields


def load_manifest() -> tuple[list[dict], list[dict], dict]:
    src = POSTS_JS.read_text(encoding="utf-8")
    posts = [parse_entry(b) for b in split_entries(slice_array(src, "POSTS"))]
    sections = [parse_entry_loose(b) for b in split_entries(slice_array(src, "SECTIONS"))]
    series_src = slice_object(src, "SERIES")
    series: dict = {}
    for m in re.finditer(r"(\w+)\s*:\s*{", series_src):
        key = m.group(1)
        body = slice_object_at(series_src, m.end() - 1)
        entry = {k: _unescape(v) for k, v in _STRING_RE.findall(body)}
        series[key] = entry
    return posts, sections, series


def parse_entry_loose(block: str) -> dict:
    return {k: _unescape(v) for k, v in _STRING_RE.findall(block)}


def slice_object_at(src: str, brace_idx: int) -> str:
    depth, in_str, escape = 0, None, False
    for i in range(brace_idx, len(src)):
        c = src[i]
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_str:
                in_str = None
            continue
        if c in ('"', "'"):
            in_str = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return src[brace_idx + 1:i]
    raise SystemExit("build_static.py: unterminated inline object in posts.js")


# --- markdown rendering ------------------------------------------------------

def stash_regions(src: str):
    """Protect fenced code, raw SVG blocks, and TeX math from the markdown
    parser (mirrors the math protection in assets/js/post.js, extended to
    multi-line $$ blocks)."""
    store: list[str] = []

    def stash(text: str, kind: str) -> str:
        store.append(text)
        return f"@@{kind}{len(store) - 1}@@"

    # Split on fenced code blocks so nothing inside them is touched.
    parts = re.split(r"(^```[\s\S]*?^```\s*$)", src, flags=re.M)
    out_parts = []
    for i, part in enumerate(parts):
        if i % 2 == 1:  # a fence
            out_parts.append(part)
            continue
        part = re.sub(r"<svg[\s\S]*?</svg>", lambda m: stash(m.group(0), "HTMLBLOCK"), part)
        part = re.sub(r"\$\$([\s\S]+?)\$\$", lambda m: stash(m.group(0), "MATH"), part)

        def inline_line(line: str) -> str:
            segs = re.split(r"(`[^`]*`)", line)
            return "".join(
                seg if seg.startswith("`")
                else re.sub(r"\$([^$\n]+?)\$", lambda m: stash(m.group(0), "MATH"), seg)
                for seg in segs
            )
        part = "\n".join(inline_line(l) for l in part.split("\n"))
        out_parts.append(part)
    return "".join(out_parts), store


def restore_regions(rendered: str, store: list[str]) -> str:
    # Block placeholders that markdown wrapped in a bare <p> come back unwrapped.
    rendered = re.sub(
        r"<p>@@(HTMLBLOCK|MATH)(\d+)@@</p>",
        lambda m: store[int(m.group(2))],
        rendered,
    )
    return re.sub(
        r"@@(?:HTMLBLOCK|MATH)(\d+)@@",
        lambda m: store[int(m.group(1))],
        rendered,
    )


def slugify(s: str) -> str:
    """Same heading-id scheme as post.js so #fragment links stay stable."""
    s = s.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    return re.sub(r"\s+", "-", s)


def add_heading_ids(rendered: str) -> tuple[str, list[tuple[int, str, str]]]:
    heads: list[tuple[int, str, str]] = []  # (level, id, text)
    counter = [0]

    def repl(m):
        level = int(m.group(1))
        inner = m.group(2)
        text = re.sub(r"<[^>]+>", "", inner)
        hid = slugify(text) or f"h-{counter[0]}"
        counter[0] += 1
        heads.append((level, hid, text))
        return f'<h{level} id="{hid}">{inner}</h{level}>'

    rendered = re.sub(r"<h([23])>([\s\S]*?)</h\1>", repl, rendered)
    return rendered, heads


def relativize(rendered: str) -> str:
    """Content markdown links/embeds are written relative to the site root;
    from /posts/ they need a ../ prefix."""
    def fix(m):
        attr, quote, url = m.group(1), m.group(2), m.group(3)
        if re.match(r"^(?:[a-z][a-z0-9+.-]*:|//|/|#|\.\./)", url, re.I):
            return m.group(0)
        return f"{attr}={quote}../{url}{quote}"

    return re.sub(r'\b(href|src)=(["\'])([^"\']+)\2', fix, rendered)


def render_markdown(md_src: str) -> str:
    protected, store = stash_regions(md_src)
    md = markdown.Markdown(extensions=["fenced_code", "tables"], output_format="html5")
    rendered = md.convert(protected)
    return restore_regions(rendered, store)


# --- static post page template ----------------------------------------------

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title_esc} — avianna.ai</title>
<meta name="description" content="{summary_esc}" />

<!-- favicons & PWA -->
<link rel="icon" href="../assets/brand/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/brand/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../assets/brand/favicon-16x16.png">
<link rel="apple-touch-icon" href="../assets/brand/apple-touch-icon.png">
<link rel="manifest" href="../assets/brand/site.webmanifest">
<meta name="theme-color" content="#FDFBF6">

<!-- feed discovery -->
<link rel="alternate" type="application/atom+xml" title="avianna.ai" href="/feed.xml">

<link rel="canonical" href="{page_url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="avianna.ai">
<meta property="og:title" content="{title_esc} — avianna.ai">
<meta property="og:description" content="{summary_esc}">
<meta property="og:url" content="{page_url}">
<meta property="og:image" content="{og_image}">
<meta property="article:published_time" content="{date}">
<meta property="article:author" content="{author_url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title_esc} — avianna.ai">
<meta name="twitter:description" content="{summary_esc}">
<meta name="twitter:image" content="{og_image}">

<script type="application/ld+json">
{json_ld}
</script>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YBG7Z4GV65"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'G-YBG7Z4GV65');
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Chivo+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<!-- KaTeX -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<!-- highlight.js theme (matches concord) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-light.min.css">
<link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
<div class="layout with-rail">

  <aside class="sidebar">
    <a class="brand" href="../index.html"><span class="brand-mark"><img src="../assets/brand/logo-mark.png" alt=""></span>avianna.ai</a>
    <p class="brand-sub">Applied AI research in enterprise contexts</p>

    <p class="nav-label">Site</p>
    <nav class="nav">
      <a href="../index.html">Home</a>
      <a href="../blog.html" class="active">Essays</a>
      <a href="../tushar.html">People</a>
    </nav>

    <p class="nav-label">Featured products</p>
    <nav class="nav">
      <a href="../concord/">Concord</a>
      <a href="../lattice/">Lattice</a>
    </nav>

    <p class="nav-label">Sections</p>
    <nav class="nav">
      <a href="../blog.html#agents">Agents</a>
      <a href="../blog.html#ai">AI</a>
    </nav>

    <div class="sidebar-foot">
      <p class="creation-by">Team<a class="creation-name" href="https://www.linkedin.com/in/tusharmadaan/" target="_blank" rel="noopener">Tushar Madan</a><a class="creation-name" href="https://www.linkedin.com/in/rishubh-khurana-46874b7/" target="_blank" rel="noopener">Rishubh Khurana</a></p>
      <a href="../blog.html">← All posts</a>
    </div>
  </aside>

  <main>
    <article class="article" id="article">
      <p class="article-eyebrow" id="article-eyebrow">{eyebrow_esc}</p>
      <h1 class="article-title" id="article-title">{title_esc}</h1>
      <p class="article-sub" id="article-sub">{summary_esc}</p>
      <div class="prose" id="prose">
{content}
      </div>
    </article>
  </main>

  <aside class="rail">
    <div class="toc-block"{toc_style}>
      <p class="rail-label">On this page</p>
      <nav class="toc" id="toc">
{toc_links}
      </nav>
    </div>
    <div class="rail-meta" id="rail-meta">
{meta_rows}
    </div>
    <a class="rail-back" href="../blog.html">← Back to blog</a>
  </aside>

</div>

<!-- libraries (CDN, no build) -->
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>
<script defer src="../assets/js/static-post.js"></script>
</body>
</html>
"""


def build_json_ld(post: dict, page_url: str) -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post["title"],
        "description": post["summary"],
        "image": OG_IMAGE,
        "datePublished": post["date"],
        "mainEntityOfPage": page_url,
        "author": {
            "@type": "Person",
            "@id": f"{AUTHOR_URL}#person",
            "name": "Tushar Madan",
            "url": AUTHOR_URL,
        },
        "publisher": {
            "@type": "Organization",
            "@id": f"{SITE_URL}/#organization",
            "name": "Avianna",
            "url": f"{SITE_URL}/",
            "logo": {"@type": "ImageObject", "url": LOGO},
        },
    }
    return json.dumps(data, indent=2, ensure_ascii=False)


def fmt_date_long(iso: str) -> str:
    d = dt.date.fromisoformat(iso)
    return f"{MONTHS_LONG[d.month - 1]} {d.day}, {d.year}"


def fmt_date_short(iso: str) -> str:
    d = dt.date.fromisoformat(iso)
    return f"{MONTHS_SHORT[d.month - 1]} {d.day}, {d.year}"


def section_label(sections: list[dict], sid: str) -> str:
    for s in sections:
        if s.get("id") == sid:
            return s.get("label", sid)
    return sid


def build_post_page(post: dict, sections: list[dict], series: dict) -> str:
    md_path = REPO_ROOT / post["file"]
    rendered = render_markdown(md_path.read_text(encoding="utf-8"))
    rendered, heads = add_heading_ids(rendered)
    rendered = relativize(rendered)

    page_url = f"{SITE_URL}/posts/{post['slug']}.html"

    toc_links = "\n".join(
        f'        <a class="lvl-{lvl}" href="#{hid}">{html.escape(text)}</a>'
        for lvl, hid, text in heads
    )
    toc_style = "" if heads else ' style="display:none"'

    words = len(re.sub(r"<[^>]+>", " ", rendered).split())
    mins = max(1, round(words / 220))
    label = section_label(sections, post["section"])
    smeta = series.get(post.get("series", ""), None)
    eyebrow = (f"{label} · {smeta['title']} — Part {post['part']}"
               if smeta and post.get("part") else label)

    rows = [("Section", label)]
    if smeta and post.get("part"):
        rows.append(("Series", f"{smeta['title']} · Part {post['part']}"))
    rows += [("Published", fmt_date_long(post["date"])), ("Read", f"{mins} min")]
    if post["tags"]:
        rows.append(("Tags", ", ".join(post["tags"])))
    meta_rows = "\n".join(
        f'      <div><span class="k">{html.escape(k)}</span><br>{html.escape(v)}</div>'
        for k, v in rows
    )

    return PAGE_TEMPLATE.format(
        title_esc=html.escape(post["title"]),
        summary_esc=html.escape(post["summary"]),
        eyebrow_esc=html.escape(eyebrow),
        page_url=page_url,
        og_image=OG_IMAGE,
        author_url=AUTHOR_URL,
        date=post["date"],
        json_ld=build_json_ld(post, page_url),
        content=rendered,
        toc_links=toc_links,
        toc_style=toc_style,
        meta_rows=meta_rows,
    )


# --- static blog index (mirrors assets/js/blog.js) ---------------------------

def static_href(post: dict) -> str:
    return post.get("external_url") or f"post.html?slug={post['slug']}"


def build_blog_list(posts: list[dict], sections: list[dict], series: dict) -> str:
    def newest_date_of(sid: str) -> str:
        dates = [p["date"] for p in posts if p["section"] == sid]
        return max(dates) if dates else ""

    ordered = sorted(sections, key=lambda s: newest_date_of(s.get("id", "")), reverse=True)

    out = []
    for sec in ordered:
        sid = sec.get("id", "")
        sec_posts = sorted((p for p in posts if p["section"] == sid),
                           key=lambda p: p["date"], reverse=True)
        out.append(f'<section class="section-group" id="{html.escape(sid)}">')
        out.append(f'  <p class="group-label">{html.escape(sec.get("label", sid))}</p>')
        if not sec_posts:
            out.append('  <p class="empty-note">Nothing here yet.</p>')
            out.append("</section>")
            continue

        items: list = []
        clusters: dict = {}
        for p in sec_posts:
            skey = p.get("series")
            if skey and skey in series:
                if skey not in clusters:
                    clusters[skey] = {"seriesId": skey, "posts": []}
                    items.append(clusters[skey])
                clusters[skey]["posts"].append(p)
            else:
                items.append(p)

        out.append('  <div class="post-list">')
        for item in items:
            if isinstance(item, dict) and "seriesId" in item:
                meta = series[item["seriesId"]]
                parts = sorted(item["posts"], key=lambda p: p.get("part", 0))
                tag = "Part 1" if len(parts) == 1 else f"{len(parts)} parts"
                out.append('    <div class="series-block">')
                out.append('      <div class="series-head">'
                           f'<span class="series-title">{html.escape(meta["title"])}</span>'
                           f'<span class="series-tag">Series · {tag}</span></div>')
                if meta.get("blurb"):
                    out.append(f'      <p class="series-blurb">{html.escape(meta["blurb"])}</p>')
                for p in parts:
                    out.append(f'      <a class="series-row" href="{html.escape(static_href(p))}">'
                               f'<span class="series-part">Part {p.get("part", "")}</span>'
                               f'<span class="post-name">{html.escape(p["title"])}</span>'
                               f'<span class="post-date">{fmt_date_short(p["date"])}</span></a>')
                out.append("    </div>")
            else:
                p = item
                out.append(f'    <a class="post-row" href="{html.escape(static_href(p))}">'
                           f'<span class="post-name">{html.escape(p["title"])}</span>'
                           f'<span class="post-date">{fmt_date_short(p["date"])}</span></a>')
        out.append("  </div>")
        out.append("</section>")
    return "\n".join(out)


def inject_blog_list(list_html: str) -> None:
    src = BLOG_HTML.read_text(encoding="utf-8")
    if LIST_BEGIN not in src or LIST_END not in src:
        raise SystemExit("build_static.py: POST-LIST markers not found in blog.html")
    pre, rest = src.split(LIST_BEGIN, 1)
    _, post_marker = rest.split(LIST_END, 1)
    BLOG_HTML.write_text(pre + LIST_BEGIN + "\n" + list_html + "\n" + LIST_END + post_marker,
                         encoding="utf-8")


# --- sitemap -----------------------------------------------------------------

def git_lastmod(rel_path: str) -> str:
    """Last commit date for the file, or today if untracked / locally modified."""
    today = dt.date.today().isoformat()
    try:
        dirty = subprocess.run(
            ["git", "status", "--porcelain", "--", rel_path],
            cwd=REPO_ROOT, capture_output=True, text=True, check=True,
        ).stdout.strip()
        if dirty:
            return today
        out = subprocess.run(
            ["git", "log", "-1", "--format=%as", "--", rel_path],
            cwd=REPO_ROOT, capture_output=True, text=True, check=True,
        ).stdout.strip()
        return out or today
    except subprocess.CalledProcessError:
        return today


def build_sitemap(posts: list[dict]) -> str:
    core = ["", "blog.html", "tushar.html", "concord/", "lattice/", "learn/"]
    entries: list[tuple[str, str]] = []  # (loc, file-for-lastmod)
    for path in core:
        file_path = path + "index.html" if (path == "" or path.endswith("/")) else path
        entries.append((f"{SITE_URL}/{path}", file_path))

    seen = {loc for loc, _ in entries}
    for p in sorted(posts, key=lambda p: p["date"], reverse=True):
        rel = p.get("external_url") or f"posts/{p['slug']}.html"
        loc = f"{SITE_URL}/{rel}"
        if loc in seen:
            continue
        seen.add(loc)
        entries.append((loc, rel))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, rel in entries:
        if not (REPO_ROOT / rel).is_file():
            raise SystemExit(f"build_static.py: sitemap URL {loc} has no file {rel}")
        lines.append("  <url>")
        lines.append(f"    <loc>{html.escape(loc)}</loc>")
        lines.append(f"    <lastmod>{git_lastmod(rel)}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


# --- main --------------------------------------------------------------------

def main() -> int:
    posts, sections, series = load_manifest()

    written = []
    for post in posts:
        if not post.get("file"):
            continue  # already a hand-authored static page (external_url)
        page = build_post_page(post, sections, series)
        out = POSTS_DIR / f"{post['slug']}.html"
        out.write_text(page, encoding="utf-8")
        written.append(out.relative_to(REPO_ROOT))

    inject_blog_list(build_blog_list(posts, sections, series))

    # Warn if a file in posts/ has no manifest entry (it would be missing
    # from blog.html and the sitemap).
    manifest_posts = {Path(p.get("external_url", "")).name for p in posts} | {
        f"{p['slug']}.html" for p in posts if p.get("file")
    }
    for f in sorted(POSTS_DIR.glob("*.html")):
        if f.name not in manifest_posts:
            print(f"warning: posts/{f.name} is not in the posts.js manifest", file=sys.stderr)

    SITEMAP_OUT.write_text(build_sitemap(posts), encoding="utf-8")

    print(f"wrote {len(written)} static post page(s): " + ", ".join(map(str, written)))
    print("updated blog.html post list; wrote sitemap.xml")
    return 0


if __name__ == "__main__":
    sys.exit(main())
