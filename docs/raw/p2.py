import re

h = open(r"D:\USEPIC\docs\raw\b014-blog-p2.html", encoding="utf-8").read()
out = []
m = re.search(r'<div id="brxe-j7w6cs".*?</div>\s*</div>', h, re.S)
out.append("PAGINATION:\n" + (m.group(0) if m else "nf"))
out.append("")
out.append("dp-card count: %d" % len(re.findall(r'class="[^"]*dp-card[ "]', h)))
out.append("archive-title: " + (re.search(r'dp-archive-title[^>]*>(.*?)</h1>', h, re.S).group(1) if re.search(r'dp-archive-title[^>]*>(.*?)</h1>', h, re.S) else "nf"))
out.append("archive-count: " + (re.search(r'dp-archive-count[^>]*>(.*?)</p>', h, re.S).group(1) if re.search(r'dp-archive-count[^>]*>(.*?)</p>', h, re.S) else "nf"))
open(r"D:\USEPIC\docs\raw\facts-p2.txt", "w", encoding="utf-8").write("\n".join(out))
print("ok")
