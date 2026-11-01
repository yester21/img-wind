import re

out = []
for page in ("blog", "post", "category"):
    h = open(r"D:\USEPIC\docs\raw\b014-%s.html" % page, encoding="utf-8").read()
    b = re.search(r"<body[^>]*class=\"([^\"]*)\"", h).group(1)
    out.append(page + ": " + b)
    # template hints
    for m in re.finditer(r'class="[^"]*brxe-[^"]*"(?=[^>]*data-template)', h):
        out.append("  " + m.group(0))
    for m in re.finditer(r'data-(?:bricks-)?template[^=]*="([^"]*)"', h):
        out.append("  template attr: " + m.group(0)[:120])
open(r"D:\USEPIC\docs\raw\facts-bodycl.txt", "w", encoding="utf-8").write("\n".join(out))
print("\n".join(out))
