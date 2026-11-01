import re

out = []
h = open(r"D:\USEPIC\docs\raw\b014-category.html", encoding="utf-8").read()
m = re.search(r'<h1 id="brxe-yd2gvu".{0,900}', h, re.S)
out.append("CATEGORY HEAD:\n" + (m.group(0) if m else "nf"))
out.append("")

h2 = open(r"D:\USEPIC\docs\raw\b014-blog.html", encoding="utf-8").read()
m = re.search(r'<h1 id="brxe-m6o13l".{0,700}', h2, re.S)
out.append("BLOG HEAD:\n" + (m.group(0) if m else "nf"))
out.append("")

h3 = open(r"D:\USEPIC\docs\raw\b014-post.html", encoding="utf-8").read()
m = re.search(r'<div id="brxe-azwxs8".{0,900}', h3, re.S)
out.append("POST TAGS:\n" + (m.group(0) if m else "nf"))
out.append("")
m = re.search(r'<div id="brxe-osxxlz".{0,700}', h3, re.S)
out.append("BREADCRUMB:\n" + (m.group(0) if m else "nf"))
open(r"D:\USEPIC\docs\raw\facts-head.txt", "w", encoding="utf-8").write("\n".join(out))
print("ok")
