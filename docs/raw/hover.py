import sys, re
sys.path.insert(0, r"D:\USEPIC\docs\raw")
from csslib import load

out = []
for page in ("home", "post"):
    r = load(page)
    out.append("###### " + page)
    for i, x in enumerate(r):
        s = x["sel"].strip()
        if re.search(r":hover|:focus|:active|transition|:visited", s) or "transition" in x["decl"]:
            if not re.search(r"dp-|brxe|bricks-|a\b", s):
                continue
            out.append("  " + s)
            for k, v in x["decl"].items():
                out.append("      " + k + ": " + v)
    out.append("")
open(r"D:\USEPIC\docs\raw\facts-hover.txt", "w", encoding="utf-8").write("\n".join(out))
print("ok")
