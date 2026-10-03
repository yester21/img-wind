"""폰트 크기 일괄 스케일링 — 최소 15px, 비율 1.25 (12px→15px 기준). 사용: python scale_fonts.py"""
import re
from pathlib import Path

MAP = {
    11: 15,  # 최소 폰트
    12: 15,
    13: 16,
    14: 18,  # 17.5 → 18
    15: 19,
    16: 20,
    17: 21,
    20: 25,
    32: 40,
    40: 50,
}

changed = 0
for f in Path("src").rglob("*.tsx"):
    s = f.read_text(encoding="utf-8")
    orig = s

    def repl(m):
        px = int(m.group(1))
        return f"text-[{MAP.get(px, px)}px]"

    s = re.sub(r"text-\[(\d+)px\]", repl, s)
    if s != orig:
        f.write_text(s, encoding="utf-8")
        changed += 1
        print("changed:", f)

print(f"{changed} files updated")
