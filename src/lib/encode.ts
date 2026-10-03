/**
 * 캔버스 기반 이미지 렌더 체인 (워커/메인스레드 공용 단일 진입점):
 * 디코드 → 자르기 → 회전·뒤집기 → 리사이즈(fit/cover) → 워터마크 → 마스킹 → 인코딩.
 */
import type {
  CropRect,
  Flip,
  MaskOption,
  ProcessOptions,
  Rotation,
  WatermarkOption,
} from "./types";

export interface RenderResult {
  blob: Blob;
  width: number;
  height: number;
  mime: string;
}

type Drawable = ImageBitmap | OffscreenCanvas | HTMLCanvasElement;
type AnyCtx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

const clampPx = (v: number) => Math.max(1, Math.round(v));

/** EXIF 방향을 보정해 디코드한다 (옵션 미지원 브라우저는 재시도) */
export async function decodeToBitmap(file: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return await createImageBitmap(file);
  }
}

function makeCanvas(width: number, height: number): {
  canvas: OffscreenCanvas | HTMLCanvasElement;
  ctx: AnyCtx;
  toBlob: (type: string, quality?: number) => Promise<Blob>;
} {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D | null;
    if (!ctx) throw new Error("ERR_CANVAS");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    return {
      canvas,
      ctx,
      toBlob: (type, quality) => canvas.convertToBlob({ type, quality }),
    };
  }
  if (typeof document === "undefined") throw new Error("ERR_CANVAS");
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
  if (!ctx) throw new Error("ERR_CANVAS");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return {
    canvas,
    ctx,
    toBlob: (type, quality) =>
      new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("ERR_ENCODE"))), type, quality),
      ),
  };
}

/** 상대 좌표 크롭 */
function cropToCanvas(src: Drawable, r: CropRect): Drawable {
  const sw = src.width;
  const sh = src.height;
  const sx = Math.min(sw - 1, Math.max(0, Math.round(r.x * sw)));
  const sy = Math.min(sh - 1, Math.max(0, Math.round(r.y * sh)));
  const cw = Math.max(1, Math.min(sw - sx, Math.round(r.w * sw)));
  const ch = Math.max(1, Math.min(sh - sy, Math.round(r.h * sh)));
  const { canvas, ctx } = makeCanvas(cw, ch);
  ctx.drawImage(src, sx, sy, cw, ch, 0, 0, cw, ch);
  return canvas;
}

/** 90° 단위 회전 + 뒤집기 */
function rotateFlipCanvas(src: Drawable, rotation: Rotation, flip: Flip): Drawable {
  const { canvas, ctx } = makeCanvas(
    rotation === 90 || rotation === 270 ? src.height : src.width,
    rotation === 90 || rotation === 270 ? src.width : src.height,
  );
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flip === "horizontal" ? -1 : 1, flip === "vertical" ? -1 : 1);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  ctx.restore();
  return canvas;
}

/** 목표 치수 계산 — 입력은 자르기·회전 후 크기 */
export function computeTargetDims(
  width: number,
  height: number,
  r: ProcessOptions["resize"],
): { width: number; height: number } {
  if (!r) return { width, height };

  if (r.mode === "percent") {
    const p = Math.min(1000, Math.max(1, r.percent)) / 100;
    return { width: clampPx(width * p), height: clampPx(height * p) };
  }

  if (r.mode === "cover") {
    if (r.width && r.height) return { width: clampPx(r.width), height: clampPx(r.height) };
    // 한쪽만 지정하면 fit처럼 동작
    if (r.width) return { width: clampPx(r.width), height: clampPx((r.width * height) / width) };
    if (r.height) return { width: clampPx((r.height * width) / height), height: clampPx(r.height) };
    return { width, height };
  }

  if (r.mode === "fit") {
    if (!r.maxWidth && !r.maxHeight) return { width, height };
    const scale = Math.min(
      r.maxWidth ? r.maxWidth / width : Infinity,
      r.maxHeight ? r.maxHeight / height : Infinity,
    );
    const s = scale >= 1 && r.noUpscale ? 1 : scale;
    return { width: clampPx(width * s), height: clampPx(height * s) };
  }

  // pixels 모드
  const w = r.width && r.width > 0 ? r.width : null;
  const h = r.height && r.height > 0 ? r.height : null;
  if (r.lockRatio) {
    if (w && h) {
      const s = Math.min(w / width, h / height);
      return { width: clampPx(width * s), height: clampPx(height * s) };
    }
    if (w) return { width: clampPx(w), height: clampPx((w * height) / width) };
    if (h) return { width: clampPx((h * width) / height), height: clampPx(h) };
    return { width, height };
  }
  return { width: w ? clampPx(w) : width, height: h ? clampPx(h) : height };
}

/**
 * 단계적 축소(step-down) 후 목표 캔버스에 그린다.
 * cover=true면 비율을 유지한 채 목표를 꽉 채우고 넘치는 부분을 중앙에서 자른다.
 */
function drawScaled(
  src: Drawable,
  tw: number,
  th: number,
  background: string | null,
  cover: boolean,
): { canvas: OffscreenCanvas | HTMLCanvasElement; ctx: AnyCtx; toBlob: (type: string, quality?: number) => Promise<Blob> } {
  let sw = src.width;
  let sh = src.height;
  let cur: Drawable = src;

  while (sw * 0.5 > tw) {
    const halfW = Math.max(tw, Math.round(sw * 0.5));
    const halfH = Math.max(th, Math.round(sh * 0.5));
    const mid = makeCanvas(halfW, halfH);
    mid.ctx.drawImage(cur, 0, 0, halfW, halfH);
    cur = mid.canvas;
    sw = halfW;
    sh = halfH;
  }

  const target = makeCanvas(tw, th);
  if (background) {
    target.ctx.fillStyle = background;
    target.ctx.fillRect(0, 0, tw, th);
  }
  if (cover) {
    const scale = Math.max(tw / sw, th / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    target.ctx.drawImage(cur, 0, 0, sw, sh, (tw - dw) / 2, (th - dh) / 2, dw, dh);
  } else {
    target.ctx.drawImage(cur, 0, 0, sw, sh, 0, 0, tw, th);
  }
  return target;
}

const MARGIN_PCT = 0.02;

async function applyWatermark(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  ctx: AnyCtx,
  wm: WatermarkOption,
  tw: number,
  th: number,
): Promise<void> {
  const margin = Math.round(Math.min(tw, th) * MARGIN_PCT);
  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0.02, wm.opacity));

  if (wm.type === "text" && wm.text.trim()) {
    const fontSize = Math.max(10, Math.round(Math.min(tw, th) * (wm.fontSizePct / 100)));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = wm.color;
    const metrics = ctx.measureText(wm.text);
    const w = metrics.width;
    const h = fontSize;

    if (wm.position === "tile") {
      const stepX = w + margin * 6;
      const stepY = h + margin * 6;
      ctx.rotate((-25 * Math.PI) / 180);
      for (let y = -th; y < th * 1.5; y += stepY) {
        for (let x = -tw; x < tw * 1.5; x += stepX) {
          ctx.fillText(wm.text, x, y);
        }
      }
    } else {
      let x = margin;
      let y = margin + h;
      if (wm.position === "top-right") x = tw - w - margin;
      if (wm.position === "bottom-left") y = th - margin;
      if (wm.position === "bottom-right") {
        x = tw - w - margin;
        y = th - margin;
      }
      if (wm.position === "center") {
        x = (tw - w) / 2;
        y = (th + h) / 2;
      }
      ctx.fillText(wm.text, x, y);
    }
  } else if (wm.type === "image" && wm.image) {
    const bmp = await decodeToBitmap(wm.image);
    try {
      const w = Math.max(8, Math.round((tw * wm.widthPct) / 100));
      const h = Math.max(8, Math.round((w * bmp.height) / bmp.width));
      const put = (x: number, y: number) => ctx.drawImage(bmp, x, y, w, h);
      if (wm.position === "tile") {
        const stepX = w + margin * 6;
        const stepY = h + margin * 6;
        for (let y = margin; y < th; y += stepY) {
          for (let x = margin; x < tw; x += stepX) put(x, y);
        }
      } else {
        let x = margin;
        let y = margin;
        if (wm.position === "top-right") x = tw - w - margin;
        if (wm.position === "bottom-left") y = th - h - margin;
        if (wm.position === "bottom-right") {
          x = tw - w - margin;
          y = th - h - margin;
        }
        if (wm.position === "center") {
          x = (tw - w) / 2;
          y = (th - h) / 2;
        }
        put(x, y);
      }
    } finally {
      bmp.close();
    }
  }
  ctx.restore();
}

function applyMask(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  ctx: AnyCtx,
  mask: MaskOption,
  tw: number,
  th: number,
): void {
  const minDim = Math.min(tw, th);
  const strength = Math.max(0.5, mask.strengthPct / 100);

  for (const r of mask.regions) {
    const rx = Math.max(0, Math.round(r.x * tw));
    const ry = Math.max(0, Math.round(r.y * th));
    const rw = Math.max(1, Math.min(tw - rx, Math.round(r.w * tw)));
    const rh = Math.max(1, Math.min(th - ry, Math.round(r.h * th)));

    if (mask.effect === "blur") {
      const radius = Math.max(2, Math.round(minDim * strength));
      const pad = radius * 2;
      const sx = Math.max(0, rx - pad);
      const sy = Math.max(0, ry - pad);
      const sxw = Math.min(tw, rx + rw + pad) - sx;
      const syh = Math.min(th, ry + rh + pad) - sy;
      const temp = makeCanvas(sxw, syh);
      temp.ctx.filter = `blur(${radius}px)`;
      temp.ctx.drawImage(canvas, sx, sy, sxw, syh, 0, 0, sxw, syh);
      ctx.drawImage(temp.canvas, rx - sx, ry - sy, rw, rh, rx, ry, rw, rh);
    } else {
      const block = Math.max(3, Math.round(minDim * strength / 3));
      const small = makeCanvas(Math.max(1, Math.ceil(rw / block)), Math.max(1, Math.ceil(rh / block)));
      small.ctx.drawImage(canvas, rx, ry, rw, rh, 0, 0, small.canvas.width, small.canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small.canvas, 0, 0, small.canvas.width, small.canvas.height, rx, ry, rw, rh);
      ctx.imageSmoothingEnabled = true;
    }
  }
}

function resolveOutputMime(inputType: string, format: ProcessOptions["format"]): string {
  if (format !== "keep") {
    return { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" }[format];
  }
  const normalized = (inputType || "image/png").toLowerCase().split(";")[0].trim();
  if (normalized === "image/jpg") return "image/jpeg";
  return normalized;
}

export function extForMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  return map[mime] || (mime.split("/")[1] || "bin").replace("+xml", "");
}

const QUALITY_MIMES = new Set(["image/jpeg", "image/webp", "image/avif"]);

/**
 * 단일 진입점. 워커와 메인 스레드 폴백이 모두 이 함수를 쓴다.
 */
export async function renderImage(input: Blob, opts: ProcessOptions): Promise<RenderResult> {
  const outMime = resolveOutputMime(input.type, opts.format);
  let src: Drawable = await decodeToBitmap(input);

  if (opts.crop) src = cropToCanvas(src, opts.crop);
  const rotation: Rotation = opts.rotation ?? 0;
  const flip: Flip = opts.flip ?? "none";
  if (rotation !== 0 || flip !== "none") src = rotateFlipCanvas(src, rotation, flip);

  const dims = computeTargetDims(src.width, src.height, opts.resize);
  const background = outMime === "image/jpeg" ? opts.background || "#ffffff" : null;
  const cover = opts.resize?.mode === "cover";
  const target = drawScaled(src, dims.width, dims.height, background, cover);

  if (opts.watermark) {
    await applyWatermark(target.canvas, target.ctx, opts.watermark, dims.width, dims.height);
  }
  if (opts.mask && opts.mask.regions.length > 0) {
    applyMask(target.canvas, target.ctx, opts.mask, dims.width, dims.height);
  }

  if (outMime === "image/png" || !QUALITY_MIMES.has(outMime)) {
    const blob = await target.toBlob(outMime === "image/png" ? "image/png" : "image/png");
    return { blob, width: dims.width, height: dims.height, mime: "image/png" };
  }

  const q = Math.min(100, Math.max(1, Math.round(opts.quality))) / 100;

  // 목표 용량 모드: 최종 캔버스에서 품질만 이진탐색
  if (opts.targetBytes && opts.targetBytes > 0) {
    let lo = 0.05;
    let hi = 0.96;
    let best: Blob | null = null;
    for (let i = 0; i < 7; i++) {
      const mid = (lo + hi) / 2;
      const blob = await target.toBlob(outMime, mid);
      if (blob.size <= opts.targetBytes) {
        best = blob;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    const blob = best ?? (await target.toBlob(outMime, 0.05));
    return { blob, width: dims.width, height: dims.height, mime: outMime };
  }

  const blob = await target.toBlob(outMime, q);
  return { blob, width: dims.width, height: dims.height, mime: outMime };
}
