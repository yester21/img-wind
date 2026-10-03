"""imgwind 로고 생성기.  실행: python make_logo.py   (필요: pip install fonttools brotli)

심볼: 사진 아이콘(타일 + 산) 위로 바람 줄이 지나가고, 그 줄이 타일 왼쪽 밖으로
속도선이 되어 이어진다 → '이미지' + '바람처럼 빠르고 가볍게'.
"""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, "PretendardVariable.woff2")

BLUE = "#0071e3"   # 사이트 --color-primary
SKY = "#3cc8ff"
INK = "#1d1d1f"
WHITE = "#ffffff"

# ---------------- symbol (100 기준 좌표) ----------------
TX, TY, TW, TH, TR = 30, 14, 72, 72, 22
WIND = [
    "M4 36H66a8.5 8.5 0 1 0-8.5-8.5",   # 위: 끝이 위로 말리는 바람
    "M16 51H50",                        # 아래: 짧은 바람
]
# 산은 타일 안쪽에 띄워 둔다 (흰 배경에서도 타일 아래 윤곽이 살아 있게)
MOUNT = "M40 75L60 55L72 67L80 59L93 75Z"
SW = 7.5

def mark(uid, tile_from=BLUE, tile_to=SKY, fg=WHITE, trail=None, trails=True, dx=0, dy=0):
    trail = trail or tile_from
    grad = tile_to != tile_from
    defs = (f'<defs>'
            + (f'<linearGradient id="{uid}g" x1="0" y1="1" x2="1" y2="0">'
               f'<stop offset="0" stop-color="{tile_from}"/><stop offset="1" stop-color="{tile_to}"/>'
               f'</linearGradient>' if grad else "")
            + f'<clipPath id="{uid}t"><rect x="{TX}" y="{TY}" width="{TW}" height="{TH}" rx="{TR}"/></clipPath>'
            + f'<clipPath id="{uid}o"><rect x="-10" y="0" width="{TX + 4}" height="100"/></clipPath>'
            + f'</defs>')
    lines = lambda col: "".join(
        f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{SW}" stroke-linecap="round"/>' for d in WIND)
    body = (f'<rect x="{TX}" y="{TY}" width="{TW}" height="{TH}" rx="{TR}" fill="{f"url(#{uid}g)" if grad else tile_from}"/>'
            f'<g clip-path="url(#{uid}t)"><path d="{MOUNT}" fill="{fg}" stroke="{fg}" '
            f'stroke-width="5" stroke-linejoin="round"/>{lines(fg)}</g>')
    if trails:
        body += f'<g clip-path="url(#{uid}o)">{lines(trail)}</g>'
    return f'{defs}<g transform="translate({dx} {dy})">{body}</g>' if (dx or dy) else defs + body

# 심볼 실제 범위 (속도선 포함 / 미포함)
MARK_X0_TRAIL = 4 - SW / 2
MARK_X0_TILE = TX
MARK_X1, MARK_Y0, MARK_Y1 = TX + TW, TY, TY + TH

# ---------------- type ----------------
_fonts = {}
def font_at(w):
    if w not in _fonts:
        _fonts[w] = instantiateVariableFont(TTFont(FONT), {"wght": w})
    return _fonts[w]

def text_runs(runs, weight, tracking_em):
    """runs = [(text, color_key), ...] → [(d, key)], bounds, font"""
    f = font_at(weight)
    gs, cmap, upm, hmtx = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm, f["hmtx"]
    bp = BoundsPen(gs)
    out, x = [], 0
    chars = sum(len(t) for t, _ in runs)
    n = 0
    for text, key in runs:
        pen = SVGPathPen(gs)
        for ch in text:
            g = cmap[ord(ch)]
            t = (1, 0, 0, -1, x, 0)
            gs[g].draw(TransformPen(pen, t)); gs[g].draw(TransformPen(bp, t))
            n += 1
            x += hmtx[g][0] + (tracking_em * upm if n < chars else 0)
        out.append((pen.getCommands(), key))
    return out, bp.bounds, f

WORDS = {
    # 다국어 공통(기본): 라틴 소문자. img = 이미지, wind = 강조색
    "global": ([("img", "a"), ("wind", "b")], 640, -0.03),
    "ko":     ([("이미지", "a"), ("윈드", "b")], 680, -0.03),
}

def svg(w, h, body, vx=0, vy=0, title="imgwind"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.2f} {vy:.2f} {w:.2f} {h:.2f}" '
            f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')

def write(name, s):
    with open(os.path.join(HERE, name), "w", encoding="utf-8") as fh:
        fh.write(s)

def lockup(lang, uid, a=INK, b=BLUE, tile=(BLUE, SKY), fg=WHITE, trail=None):
    runs, (x0, y0, x1, y1), f = text_runs(*WORDS[lang])
    H = MARK_Y1 - MARK_Y0                    # 72
    if lang == "global":
        xh = f["OS/2"].sxHeight
        k = (H * 0.50) / xh                  # x-height = 타일 높이의 50%
        base = MARK_Y0 + H / 2 + xh * k / 2  # x-height 띠를 타일 세로 중앙에
    else:
        k = (H * 0.56) / (y1 - y0)
        base = MARK_Y0 + H / 2 - (y0 + y1) / 2 * k
    gap = H * 0.26
    tx = MARK_X1 + gap - x0 * k
    color = {"a": a, "b": b}
    text = "".join(f'<path transform="translate({tx:.2f} {base:.2f}) scale({k:.5f})" fill="{color[key]}" d="{d}"/>'
                   for d, key in runs)
    top = min(MARK_Y0, base + y0 * k)
    bot = max(MARK_Y1, base + y1 * k)
    left = MARK_X0_TRAIL
    right = tx + x1 * k
    body = mark(uid, tile[0], tile[1], fg, trail) + text
    return svg(right - left, bot - top, body, left, top, "imgwind 이미지윈드")

def wordmark(lang, a=INK, b=BLUE):
    runs, (x0, y0, x1, y1), _ = text_runs(*WORDS[lang])
    k = 100 / (y1 - y0)
    color = {"a": a, "b": b}
    body = "".join(f'<path transform="scale({k:.5f}) translate({-x0:.1f} {-y0:.1f})" fill="{color[key]}" d="{d}"/>'
                   for d, key in runs)
    return svg((x1 - x0) * k, 100, body, title="imgwind 이미지윈드")

if __name__ == "__main__":
    # 심볼 (속도선 포함 / 타일만)
    w_trail = MARK_X1 - MARK_X0_TRAIL
    write("imgwind-symbol.svg", svg(w_trail, TH, mark("s"), MARK_X0_TRAIL, TY))
    write("imgwind-symbol-tile.svg", svg(TW, TH, mark("t", trails=False), TX, TY))
    write("imgwind-symbol-white.svg", svg(w_trail, TH, mark("w", WHITE, WHITE, BLUE, WHITE), MARK_X0_TRAIL, TY))
    # 파비콘 / 앱 아이콘: 타일만 (작은 크기에서 속도선은 노이즈)
    write("imgwind-favicon.svg", svg(TW, TH, mark("f", trails=False), TX, TY))
    # 가로형 로고
    for lang, suf in (("global", ""), ("ko", "-ko")):
        write(f"imgwind-logo{suf}.svg", lockup(lang, "l"))
        write(f"imgwind-logo{suf}-white.svg", lockup(lang, "w", WHITE, SKY))
        write(f"imgwind-logo{suf}-mono.svg", lockup(lang, "m", INK, INK, (INK, INK), WHITE, INK))
        write(f"imgwind-wordmark{suf}.svg", wordmark(lang))
    print("done:", sorted(n for n in os.listdir(HERE) if n.endswith(".svg") and not n.startswith("_")))
