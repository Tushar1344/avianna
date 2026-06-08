#!/usr/bin/env python3
"""
Build feed.xml (Atom 1.0) from assets/js/posts.js.

Workflow: whenever you edit assets/js/posts.js, run this from the repo root,
then commit feed.xml alongside the manifest change:

    python3 scripts/build_feed.py

Output: <repo-root>/feed.xml — committed to the repo so GitHub Pages serves it.

The script is stdlib-only (Python 3.7+); no pip dependencies.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

SITE_URL = "https://avianna.ai"
FEED_TITLE = "avianna.ai"
FEED_SUBTITLE = "Notes on math, AI, and software."
AUTHORS = ["Tushar Madan", "Rishubh Khurana"]
ICON_PATH = "/assets/brand/favicon-64x64.png"
LOGO_PATH = "/assets/brand/logo-mark.png"

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_JS = REPO_ROOT / "assets" / "js" / "posts.js"
FEED_OUT = REPO_ROOT / "feed.xml"


def slice_array(src: str, name: str) -> str:
    """Extract the text inside `const <name> = [ ... ];` using bracket depth."""
    m = re.search(rf"const\s+{re.escape(name)}\s*=\s*\[", src)
    if not m:
        raise SystemExit(f"build_feed.py: couldn't find `const {name} = [` in posts.js")
    start = m.end()
    depth = 1
    in_str: str | None = None
    escape = False
    i = start
    while i < len(src):
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
        i += 1
    raise SystemExit(f"build_feed.py: unterminated array `{name}` in posts.js")


def split_entries(arr_src: str) -> list[str]:
    """Split the array body into per-entry `{ ... }` blocks."""
    blocks: list[str] = []
    depth = 0
    in_str: str | None = None
    escape = False
    cur_start: int | None = None
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
                cur_start = i
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0 and cur_start is not None:
                blocks.append(arr_src[cur_start : i + 1])
                cur_start = None
    return blocks


_STRING_RE = re.compile(r'(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"')
_TAGS_RE = re.compile(r"tags\s*:\s*\[([^\]]*)\]")
_TAG_TOKEN_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')


def _unescape(s: str) -> str:
    # Decode the small set of JS escape sequences that might appear in titles/summaries.
    return (
        s.replace(r"\"", '"')
        .replace(r"\'", "'")
        .replace(r"\\", "\\")
        .replace(r"\n", "\n")
        .replace(r"\t", "\t")
    )


def parse_entry(block: str) -> dict:
    fields: dict = {}
    for key, value in _STRING_RE.findall(block):
        fields[key] = _unescape(value)
    tags_match = _TAGS_RE.search(block)
    fields["tags"] = (
        [_unescape(t) for t in _TAG_TOKEN_RE.findall(tags_match.group(1))]
        if tags_match
        else []
    )
    for required in ("slug", "title", "section", "date", "summary"):
        if required not in fields:
            print(f"build_feed.py: entry missing `{required}`:\n{block}\n", file=sys.stderr)
            raise SystemExit(2)
    return fields


def post_url(post: dict) -> str:
    if post.get("external_url"):
        return f"{SITE_URL}/{post['external_url']}"
    return f"{SITE_URL}/post.html?slug={post['slug']}"


def iso_to_atom(date_str: str) -> str:
    # YYYY-MM-DD -> YYYY-MM-DDT00:00:00Z (RFC 3339 / Atom-required).
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_str):
        raise SystemExit(f"build_feed.py: bad date `{date_str}` — expected YYYY-MM-DD")
    return f"{date_str}T00:00:00Z"


ATOM_NS = "http://www.w3.org/2005/Atom"


def build_feed(posts: list[dict]) -> bytes:
    ET.register_namespace("", ATOM_NS)
    feed = ET.Element(f"{{{ATOM_NS}}}feed")

    ET.SubElement(feed, "title").text = FEED_TITLE
    ET.SubElement(feed, "subtitle").text = FEED_SUBTITLE
    ET.SubElement(feed, "link", rel="self", href=f"{SITE_URL}/feed.xml")
    ET.SubElement(feed, "link", href=f"{SITE_URL}/")
    ET.SubElement(feed, "id").text = f"{SITE_URL}/"
    newest_date = max(p["date"] for p in posts) if posts else "1970-01-01"
    ET.SubElement(feed, "updated").text = iso_to_atom(newest_date)
    for name in AUTHORS:
        author = ET.SubElement(feed, "author")
        ET.SubElement(author, "name").text = name
    ET.SubElement(feed, "icon").text = f"{SITE_URL}{ICON_PATH}"
    ET.SubElement(feed, "logo").text = f"{SITE_URL}{LOGO_PATH}"
    ET.SubElement(feed, "generator").text = "build_feed.py"

    for post in posts:
        entry = ET.SubElement(feed, "entry")
        ET.SubElement(entry, "title").text = post["title"]
        url = post_url(post)
        ET.SubElement(entry, "link", href=url)
        ET.SubElement(entry, "id").text = url
        when = iso_to_atom(post["date"])
        ET.SubElement(entry, "updated").text = when
        ET.SubElement(entry, "published").text = when
        ET.SubElement(entry, "summary").text = post["summary"]
        for tag in post.get("tags", []):
            ET.SubElement(entry, "category", term=tag)

    # Pretty-print (Python 3.9+ supports indent on ElementTree).
    try:
        ET.indent(feed, space="  ")
    except AttributeError:
        pass
    return b'<?xml version="1.0" encoding="utf-8"?>\n' + ET.tostring(feed, encoding="utf-8")


def main() -> int:
    if not POSTS_JS.is_file():
        raise SystemExit(f"build_feed.py: no posts.js at {POSTS_JS}")
    src = POSTS_JS.read_text(encoding="utf-8")
    arr_src = slice_array(src, "POSTS")
    blocks = split_entries(arr_src)
    posts = [parse_entry(b) for b in blocks]
    posts.sort(key=lambda p: p["date"], reverse=True)
    xml = build_feed(posts)
    FEED_OUT.write_bytes(xml)
    newest = posts[0]["date"] if posts else "—"
    print(f"wrote {FEED_OUT.relative_to(REPO_ROOT)} — {len(posts)} entries, newest {newest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
