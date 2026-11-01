import sys, re, os
from lxml import html as LH

RAW = r"D:\USEPIC\docs\raw"

FIELDS = re.compile(r"(\d{4}-\d{2}-\d{2})|(\d{4})")

def short(s, n=140):
    s = re.sub(r"\s+", " ", (s or "")).strip()
    return s[:n] + ("..." if len(s) > n else "")

def node_label(el):
    tag = el.tag if isinstance(el.tag, str) else "?"
    parts = ["<" + tag + ">"]
    if el.get("id"):
        parts.append("#" + el.get("id"))
    cl = el.get("class")
    if cl:
        parts.append("." + ".".join(cl.split()))
    if tag == "a" and el.get("href"):
        parts.append("href=" + el.get("href").replace("https://b014.wordsense.kr", ""))
    if tag == "img":
        src = el.get("src") or ""
        if src.startswith("data:"):
            src = "data:svg-placeholder"
        parts.append("src=" + src.replace("https://b014.wordsense.kr", ""))
        parts.append("alt=" + (el.get("alt") or ""))
        if el.get("width"):
            parts.append(f"w={el.get('width')} h={el.get('height')}")
    for k in ("data-brx-loop-id", "data-brx-query", "data-brx-pagination", "aria-current", "aria-label", "role", "type"):
        if el.get(k):
            parts.append(f"{k}={el.get(k)}")
    return "".join(parts)

def walk(el, depth, out, maxdepth=99):
    for ch in el.iterchildren():
        if not isinstance(ch.tag, str):
            continue
        if ch.tag in ("script", "style", "noscript", "template", "link", "meta"):
            continue
        out.append("  " * depth + node_label(ch))
        # text content only if leaf-ish
        kids = [k for k in ch.iterchildren() if isinstance(k.tag, str) and k.tag not in ("script","style")]
        if not kids:
            t = short(ch.text_content(), 200)
            if t:
                out.append("  " * (depth + 1) + '"' + t + '"')
        if depth < maxdepth:
            walk(ch, depth + 1, out)

def dump(name, startid="brx-content"):
    p = os.path.join(RAW, f"b014-{name}.html")
    doc = LH.parse(p, parser=LH.HTMLParser(encoding="utf-8")).getroot()
    el = doc.get_element_by_id(startid)
    out = []
    out.append("=== ELEMENT: #" + el.get("id") + " class=" + (el.get("class") or "") + " tag=" + el.tag)
    walk(el, 0, out)
    op = os.path.join(RAW, f"tree-{name}.txt")
    open(op, "w", encoding="utf-8").write("\n".join(out))
    print(op, len(out))

if __name__ == "__main__":
    dump("home"); dump("blog"); dump("post"); dump("category")
