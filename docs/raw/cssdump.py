import sys, os, re
sys.path.insert(0, r"D:\USEPIC\docs\raw")
from cssparse import parse, flatten, RAW

page = sys.argv[1] if len(sys.argv) > 1 else "home"
pat = sys.argv[2] if len(sys.argv) > 2 else ""
css = open(os.path.join(RAW, f"b014-{page}.inline.css"), encoding="utf-8").read()
rules = flatten(parse(css))

KEEP = ["display","flex-direction","flex-wrap","justify-content","align-items","align-content","grid-template-columns",
        "grid-template-rows","grid-auto-flow","gap","column-gap","row-gap","grid-column","grid-row","width","height",
        "max-width","min-width","max-height","min-height","margin","margin-top","margin-right","margin-bottom","margin-left",
        "padding","padding-top","padding-right","padding-bottom","padding-left","font-family","font-size","font-weight",
        "line-height","letter-spacing","text-transform","text-decoration","text-align","color","background","background-color",
        "background-image","background-size","background-position","border","border-radius","border-top","border-bottom",
        "border-color","border-width","border-style","box-shadow","object-fit","aspect-ratio","position","top","left","right",
        "bottom","z-index","overflow","opacity","transition","flex","flex-basis","flex-grow","text-overflow",
        "white-space","-webkit-line-clamp","-webkit-box-orient","order","list-style","inset","filter","transform","cursor",
        "grid-auto-rows","place-items","justify-items","max-inline-size","font-variant-numeric","text-wrap","word-break"]

def emit(sel, d, idx):
    lines = [f"[{idx}] {sel}"]
    for k in KEEP:
        if k in d:
            lines.append(f"      {k}: {d[k]}")
    # any leftover
    return lines

for i, r in enumerate(rules):
    sel = r["sel"].strip()
    if pat and not re.search(pat, sel):
        continue
    ctx = " | ".join(r["ctx"]) or ""
    print(f"[{i}]" + (f" @{ctx}" if ctx else "") + f"  {sel}")
    for k, v in r["decl"].items():
        if k in KEEP:
            print(f"      {k}: {v}")
