import re, glob, collections

cnt = collections.Counter()
for f in glob.glob(r"D:\USEPIC\docs\raw\b014-*.html"):
    if "p2" in f:
        continue
    h = open(f, encoding="utf-8").read()
    for m in re.finditer(r'class="([^"]*)"', h):
        for c in m.group(1).split():
            if c.startswith("dp-"):
                cnt[c] += 1
lines = ["%-28s %d" % (k, v) for k, v in sorted(cnt.items(), key=lambda x: -x[1])]
open(r"D:\USEPIC\docs\raw\facts-classes.txt", "w", encoding="utf-8").write("\n".join(lines))
print("ok", len(lines))
