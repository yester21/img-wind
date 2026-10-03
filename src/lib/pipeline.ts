/**
 * 처리 오케스트레이터 — 100% 브라우저 처리 (정적 사이트, 서버 없음).
 * 배치는 동시 4개로 돌리고, 오류는 코드로 던진다 — UI에서 각 언어 사전으로
 * 번역된다 (dict.common.errors).
 *
 * 포맷 폴백 규칙 (서버 폴백이 없으므로 클라이언트에서 해결):
 * - "원본 유지"인데 브라우저가 인코딩할 수 없는 입력 형식(GIF·BMP·SAFI의 AVIF 등)
 *   → PNG로 자동 전환
 * - 명시적으로 선택한 출력 포맷을 브라우저가 지원하지 않음 → UI에서 애초에
 *   선택 불가(disabled)이며, 파이프라인에서는 ERR_UNSUPPORTED_INPUT
 * - 브라우저가 디코드할 수 없는 입력(TIFF 등) → ERR_UNSUPPORTED_INPUT
 */
import { canEncodeClient, getCaps, type Caps } from "./capabilities";
import { extForMime, renderImage } from "./encode";
import type { ProcessOptions } from "./types";
import type { WorkerFailure, WorkerSuccess } from "./image.worker";

export interface ProcessOutcome {
  name: string;
  blob: Blob;
  mime: string;
  width: number;
  height: number;
  bytes: number;
  via: "browser";
}

export interface BatchHandlers {
  onItemStart?: (index: number) => void;
  onItemDone: (index: number, outcome: ProcessOutcome) => void;
  onItemError: (index: number, message: string) => void;
}

export const MAX_FILE_BYTES = 50 * 1024 * 1024;
const CONCURRENCY = 4;

function baseName(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

/** 도구별 출력 파일명 규칙 */
export function nameOutput(
  originalName: string,
  opts: ProcessOptions,
  mime: string,
  width: number,
  height: number,
): string {
  const base = baseName(originalName);
  const ext = extForMime(mime);
  switch (opts.op) {
    case "compress":
      return `${base}.min.${ext}`;
    case "convert":
      return base.toLowerCase().endsWith(`.${ext}`)
        ? `${base}-converted.${ext}`
        : `${base}.${ext}`;
    case "resize":
      return `${base}-${width}x${height}.${ext}`;
    case "all": {
      const dimsTag = opts.resize ? `-${width}x${height}` : "";
      const suffix = opts.format === "keep" ? ".min" : "";
      return `${base}${suffix}${dimsTag}.${ext}`;
    }
    case "crop":
      return `${base}-cropped.${ext}`;
    case "watermark":
      return `${base}-watermarked.${ext}`;
    case "mask":
      return `${base}-masked.${ext}`;
    case "bg-remove":
      return `${base}-nobg.png`;
  }
}

async function processWithWorker(
  file: Blob,
  opts: ProcessOptions,
): Promise<Omit<ProcessOutcome, "name" | "bytes" | "via">> {
  const worker = new Worker(new URL("./image.worker.ts", import.meta.url), { type: "module" });
  try {
    return await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("ERR_TIMEOUT")), 120_000);
      worker.onmessage = (e: MessageEvent<WorkerSuccess | WorkerFailure>) => {
        clearTimeout(timeout);
        const data = e.data;
        if (data.ok) {
          resolve({ blob: data.blob, mime: data.mime, width: data.width, height: data.height });
        } else {
          reject(new Error(data.error));
        }
      };
      worker.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("ERR_WORKER"));
      };
      worker.postMessage({ id: 0, file, opts });
    });
  } finally {
    worker.terminate();
  }
}

/** 워커를 쓸 수 없는 환경: 메인 스레드에서 직접 처리 */
async function processOnMainThread(
  file: Blob,
  opts: ProcessOptions,
): Promise<Omit<ProcessOutcome, "name" | "bytes" | "via">> {
  const result = await renderImage(file, opts);
  return { blob: result.blob, mime: result.mime, width: result.width, height: result.height };
}

/** HEIC/HEIF는 브라우저가 디코드하지 못하므로 WASM으로 PNG로 변환한다 (지연 로드) */
async function normalizeHeic(file: File): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const out = await heic2any({ blob: file, toType: "image/png" });
  return Array.isArray(out) ? out[0] : out;
}

const MIME_OUT: Record<string, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export async function processFile(file: File, opts: ProcessOptions): Promise<ProcessOutcome> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("ERR_TOO_LARGE");
  }
  const type = (file.type || "").toLowerCase();
  const isHeic = type.startsWith("image/heic") || type.startsWith("image/heif");

  // 배경 제거는 전용 모듈(브라우저 ONNX)로만 처리한다
  if (opts.removeBg) {
    const { removeBackground } = await import("./bgremove");
    try {
      const blob = await removeBackground(isHeic ? await normalizeHeic(file) : file);
      const name = nameOutput(file.name, opts, "image/png", 0, 0);
      return { name, blob, mime: "image/png", width: 0, height: 0, bytes: blob.size, via: "browser" };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "ERR_UNKNOWN");
    }
  }

  const caps = await getCaps();

  let input: Blob = file;
  if (isHeic) {
    try {
      input = await normalizeHeic(file);
    } catch {
      throw new Error("ERR_HEIC");
    }
  }

  // 출력 포맷 결정: 브라우저가 인코딩할 수 없는 형식은 PNG로 폴백
  const inputMime = (input.type || "image/png").toLowerCase().split(";")[0].trim();
  let effective: ProcessOptions = { ...opts };
  if (opts.format === "keep") {
    if (!canEncodeClient(caps, inputMime)) {
      effective = { ...opts, format: "png" };
    }
  } else if (!canEncodeClient(caps, MIME_OUT[opts.format])) {
    throw new Error("ERR_UNSUPPORTED_INPUT");
  }

  const finish = (
    part: Omit<ProcessOutcome, "name" | "bytes" | "via">,
  ): ProcessOutcome => ({
    ...part,
    via: "browser",
    bytes: part.blob.size,
    name: nameOutput(file.name, effective, part.mime, part.width, part.height),
  });

  try {
    const part =
      caps.worker && caps.offscreen
        ? await processWithWorker(input, effective)
        : await processOnMainThread(input, effective);
    return finish(part);
  } catch (err) {
    const code = err instanceof Error ? err.message : "ERR_UNKNOWN";
    // 디코드 실패(TIFF·손상 파일 등)는 서버 폴백이 없으므로 명확한 코드로 변환
    if (code.startsWith("ERR_")) throw new Error(code);
    throw new Error("ERR_UNSUPPORTED_INPUT");
  }
}

/** 배치 실행: 동시 CONCURRENCY개, 완료 순서와 무관하게 인덱스로 보고 */
export async function runBatch(
  files: File[],
  opts: ProcessOptions,
  handlers: BatchHandlers,
): Promise<void> {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, files.length) }, async () => {
    while (cursor < files.length) {
      const index = cursor++;
      handlers.onItemStart?.(index);
      try {
        const outcome = await processFile(files[index], opts);
        handlers.onItemDone(index, outcome);
      } catch (err) {
        handlers.onItemError(index, err instanceof Error ? err.message : "ERR_UNKNOWN");
      }
    }
  });
  await Promise.all(workers);
}
