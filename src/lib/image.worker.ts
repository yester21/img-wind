/// <reference lib="webworker" />
/**
 * 이미지 처리 워커: 렌더 체인 전체를 오프스레드에서 수행한다.
 * 메인 스레드 폴백(renderImage 직접 호출)이 있으므로 실패해도 서비스는 동작한다.
 */
import { renderImage } from "./encode";
import type { ProcessOptions } from "./types";

interface WorkerRequest {
  id: number;
  file: Blob;
  opts: ProcessOptions;
}

export interface WorkerSuccess {
  id: number;
  ok: true;
  blob: Blob;
  width: number;
  height: number;
  mime: string;
}

export interface WorkerFailure {
  id: number;
  ok: false;
  error: string;
}

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (message: WorkerSuccess | WorkerFailure) => void;
};

ctx.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  try {
    const result = await renderImage(e.data.file, e.data.opts);
    ctx.postMessage({ id: e.data.id, ok: true, ...result });
  } catch (err) {
    ctx.postMessage({
      id: e.data.id,
      ok: false,
      error: err instanceof Error ? err.message : "ERR_UNKNOWN",
    });
  }
};
