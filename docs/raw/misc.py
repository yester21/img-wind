import re

h = open(r"D:\USEPIC\docs\raw\b014-home.html", encoding="utf-8").read()
out = []
out.append("sticky count: %d" % len(re.findall("sticky", h)))
out.append("interaction count: %d" % len(re.findall("data-interaction|bricks-interaction", h)))
out.append("mobile toggle count: %d" % len(re.findall("bricks-mobile-menu-toggle", h)))
for m in re.finditer(r"<script[^>]*src=\"([^\"]+)\"", h):
    out.append("SCRIPT " + m.group(1))
out.append("viewport: " + re.search(r"<meta name=\"viewport\"[^>]*>", h).group(0))
out.append("title: " + re.search(r"<title>(.*?)</title>", h, re.S).group(1))
out.append("body class: " + re.search(r"<body[^>]*class=\"([^\"]*)\"", h).group(1))
# count of query-loop trail markers and lazy-hidden per page
for p in ("home", "blog", "post", "category"):
    t = open(r"D:\USEPIC\docs\raw\b014-%s.html" % p, encoding="utf-8").read()
    out.append("%s: lazy-hidden=%d query-trail=%d cards=%d compact=%d" % (
        p, len(re.findall("bricks-lazy-hidden", t)), len(re.findall("brx-query-trail", t)),
        len(re.findall("class=\"[^\"]*dp-card\\b", t)), len(re.findall("dp-compact-card", t))))

open(r"D:\USEPIC\docs\raw\facts-misc.txt", "w", encoding="utf-8").write("\n".join(out))
print("ok")
