import re, os, sys

RAW = r"D:\USEPIC\docs\raw"


def strip_comments(css):
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


def parse(css):
    css = strip_comments(css)
    out = []
    stack = []
    i = 0
    n = len(css)
    prelude = ""
    body = ""
    depth_body = 0
    while i < n:
        c = css[i]
        if depth_body == 0:
            if c == "{":
                sel = prelude.strip()
                prelude = ""
                if sel.startswith("@"):
                    stack.append(sel)
                else:
                    # read until matching close of this block
                    j = i + 1
                    d = 1
                    start = j
                    while j < n and d > 0:
                        if css[j] == "{":
                            d += 1
                        elif css[j] == "}":
                            d -= 1
                            if d == 0:
                                break
                        j += 1
                    body = css[start:j]
                    out.append({"ctx": list(stack), "sel": sel, "body": body})
                    i = j
                i += 1
                continue
            if c == "}":
                if stack:
                    stack.pop()
                prelude = ""
                i += 1
                continue
            prelude += c
            i += 1
            continue
        i += 1
    return out


def decl_map(body):
    m = {}
    # ignore nested at-rules inside body (shouldn't happen)
    for part in body.split(";"):
        part = part.strip()
        if not part or ":" not in part:
            continue
        k, v = part.split(":", 1)
        m[k.strip()] = re.sub(r"\s+", " ", v.strip())
    return m


def load(page):
    css = open(os.path.join(RAW, f"b014-{page}.inline.css"), encoding="utf-8").read()
    rules = parse(css)
    for r in rules:
        r["decl"] = decl_map(r["body"])
    return rules


if __name__ == "__main__":
    page = sys.argv[1]
    pat = sys.argv[2] if len(sys.argv) > 2 else None
    rules = load(page)
    print("total rules:", len(rules))
    for i, r in enumerate(rules):
        sel = r["sel"].strip()
        if pat and not re.search(pat, sel):
            continue
        ctx = " | ".join(r["ctx"])
        print(f"\n[{i}]" + (f" @{ctx}" if ctx else "") + f" {sel}")
        for k, v in r["decl"].items():
            print(f"    {k}: {v}")
