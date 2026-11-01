import sys, re
sys.path.insert(0, r"D:\USEPIC\docs\raw")
from lxml import html as LH

p = r"D:\USEPIC\docs\raw\b014-home.html"
doc = LH.parse(p, parser=LH.HTMLParser(encoding="utf-8")).getroot()
out = []
for hid in ("brx-header", "brx-footer"):
    el = doc.get_element_by_id(hid)
    out.append("#### " + hid + "  tag=" + el.tag + " class=" + (el.get("class") or ""))
    for node in el.iter():
        if not isinstance(node.tag, str):
            continue
        if node.tag in ("script", "style", "noscript", "template"):
            continue
        d = 0
        x = node
        while x is not None and x is not el:
            d += 1
            x = x.getparent()
        if d > 14:
            continue
        lab = "  " * d + "<" + node.tag + ">"
        if node.get("id"):
            lab += "#" + node.get("id")
        if node.get("class"):
            lab += "." + ".".join(node.get("class").split())
        if node.tag == "a" and node.get("href"):
            lab += " href=" + node.get("href").replace("https://b014.wordsense.kr", "")
        if node.tag == "img":
            lab += " src=" + (node.get("src") or "").replace("https://b014.wordsense.kr", "") + " alt=" + (node.get("alt") or "")
        kids = [k for k in node.iterchildren() if isinstance(k.tag, str) and k.tag not in ("script", "style")]
        if not kids:
            t = re.sub(r"\s+", " ", node.text_content()).strip()[:90]
            if t:
                lab += ' "' + t + '"'
        out.append(lab)

open(r"D:\USEPIC\docs\raw\tree-hf.txt", "w", encoding="utf-8").write("\n".join(out))
print(len(out))
