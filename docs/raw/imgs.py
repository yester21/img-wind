import re, os, io

RAW = r"D:\USEPIC\docs\raw"
out = []

for page in ("home", "blog", "post", "category"):
    h = open(os.path.join(RAW, f"b014-{page}.html"), encoding="utf-8").read()
    out.append("###### " + page)
    for m in re.finditer(r"<img[^>]*>", h):
        tag = m.group(0)
        ds = re.search(r'data-src="([^"]+)"', tag)
        src = re.search(r'\ssrc="([^"]+)"', tag)
        alt = re.search(r'alt="([^"]*)"', tag)
        w = re.search(r'width="([^"]*)"', tag)
        hh = re.search(r'height="([^"]*)"', tag)
        cls = re.search(r'class="([^"]*)"', tag)
        sizes = re.search(r'data-sizes="([^"]*)"', tag)
        real = ds.group(1) if ds else (src.group(1) if src and not src.group(1).startswith("data:") else "(placeholder-svg)")
        out.append(
            "  img cls=" + (cls.group(1) if cls else "") +
            " w=" + (w.group(1) if w else "") + " h=" + (hh.group(1) if hh else "") +
            "\n      data-src=" + real.replace("https://b014.wordsense.kr", "") +
            "\n      sizes=" + (sizes.group(1) if sizes else "") +
            "\n      alt=" + (alt.group(1) if alt else "")
        )
    out.append("")

# footer + misc text blocks
h = open(os.path.join(RAW, "b014-home.html"), encoding="utf-8").read()
m = re.search(r'class="[^"]*dp-footer-desc[^"]*"[^>]*>(.*?)</p>', h, re.S)
out.append("FOOTER DESC: " + re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else "FOOTER DESC: nf")
m = re.search(r'class="[^"]*dp-tagline[^"]*"[^>]*>(.*?)</', h, re.S)
out.append("TAGLINE: " + (re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else "nf"))

open(os.path.join(RAW, "facts-images.txt"), "w", encoding="utf-8").write("\n".join(out))
print("ok", len(out))
