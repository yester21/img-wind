import re, sys, json, os

RAW = r"D:\USEPIC\docs\raw"

TOKEN = re.compile(r"""
    (?P<comment>/\*.*?\*/)
  | (?P<at>@[^{;]+)
  | (?P<open>\{)
  | (?P<close>\})
  | (?P<semi>;)
  | (?P<sel>[^{};]+)
""", re.S | re.X)

def parse(css):
    """returns list of (context_list, selector, decls)"""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out = []
    stack = []   # list of at-rules
    buf = ""
    sel = None
    decls = ""
    i = 0
    n = len(css)
    cur_sel = None
    cur_decl = ""
    state = "prelude"
    while i < n:
        c = css[i]
        if c == "{":
            txt = buf.strip()
            if txt.startswith("@"):
                stack.append(txt)
                buf = ""
            else:
                cur_sel = txt
                cur_decl = ""
                buf = ""
                state = "decl"
            i += 1
            continue
        if c == "}":
            txt = buf.strip()
            if state == "decl":
                out.append((tuple(stack), cur_sel, txt))
                state = "prelude"
            else:
                if stack:
                    stack.pop()
            buf = ""
            i += 1
            continue
        if c == ";" and state == "decl":
            cur_decl += buf.strip() + ";"
            buf = ""
            i += 1
            continue
        buf += c
        i += 1
    return out

def decl_map(d):
    m = {}
    for part in d.split(";"):
        part = part.strip()
        if not part or ":" not in part:
            continue
        k, v = part.split(":", 1)
        m[k.strip()] = v.strip()
    return m

def flatten(rules):
    res = []
    for ctx, sel, d in rules:
        res.append({"ctx": list(ctx), "sel": sel, "decl": decl_map(d), "raw": d})
    return res

if __name__ == "__main__":
    page = sys.argv[1]
    css = open(os.path.join(RAW, f"b014-{page}.inline.css"), encoding="utf-8").read()
    rules = flatten(parse(css))
    print("rules:", len(rules))
    ctxc = {}
    for r in rules:
        k = " | ".join(r["ctx"]) or "(root)"
        ctxc[k] = ctxc.get(k, 0) + 1
    for k, v in sorted(ctxc.items(), key=lambda x: -x[1]):
        print(f"{v:5d}  {k}")
