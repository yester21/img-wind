import re, glob, collections

files = collections.Counter()
for f in sorted(glob.glob(r"D:\USEPIC\docs\raw\b014-*.html")):
    h = open(f, encoding="utf-8").read()
    for m in re.finditer(r'data-src="([^"]+)"', h):
        files[m.group(1)] += 1
    for m in re.finditer(r'(?:src|href)="(https://b014\.wordsense\.kr/wp-content/uploads/[^"]+)"', h):
        files[m.group(1)] += 1

lines = [str(v) + "  " + k for k, v in files.most_common()]
open(r"D:\USEPIC\docs\raw\facts-assets.txt", "w", encoding="utf-8").write("\n".join(lines))
print("ok")
