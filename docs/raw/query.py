import re, html, json

out = []
for page in ("home", "blog", "post", "category"):
    h = open(r"D:\USEPIC\docs\raw\b014-%s.html" % page, encoding="utf-8").read()
    out.append("###### " + page)
    for m in re.finditer(r'data-query-vars="([^"]+)"', h):
        raw = html.unescape(m.group(1))
        try:
            j = json.loads(raw)
        except Exception as e:
            out.append("PARSE-FAIL " + raw[:300])
            continue
        # find enclosing element id
        start = max(0, m.start() - 400)
        seg = h[start:m.start()]
        ids = re.findall(r'id="(brxe-[a-z0-9]+)"', seg)
        cls = re.findall(r'class="([^"]*)"', seg)
        out.append("  elem=" + (ids[-1] if ids else "?") + " cls=" + (cls[-1] if cls else "?"))
        out.append("  " + json.dumps(j, ensure_ascii=False, indent=2).replace("\n", "\n  "))
    out.append("")
open(r"D:\USEPIC\docs\raw\facts-query.txt", "w", encoding="utf-8").write("\n".join(out))
print("ok")
