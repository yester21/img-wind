/**
 * rAF(애니메이션 프레임) 정지 폴백.
 * 창이 오클루전되거나 백그라운드 탭이면 requestAnimationFrame이 발화하지
 * 않는다 — pdf.js 같은 rAF 기반 렌더러는 이 상태에서 영구 대기한다.
 * 처리 시작 전에 rAF가 실제로 도는지 감시하고, 정지 상태면
 * setTimeout 기반 대체 구현을 설치한 뒤 복원 함수를 돌려준다.
 */
export async function ensureRafRunning(detectMs = 300): Promise<() => void> {
  if (typeof window === "undefined" || typeof requestAnimationFrame !== "function") {
    return () => {};
  }

  const fired = await new Promise<boolean>((resolve) => {
    let frames = 0;
    const tick = () => {
      frames++;
      if (performance.now() - t0 < detectMs) requestAnimationFrame(tick);
      else resolve(frames >= 2);
    };
    const t0 = performance.now();
    requestAnimationFrame(tick);
    setTimeout(() => resolve(frames >= 2), detectMs + 200);
  });

  if (fired) return () => {};

  // rAF 정지: setTimeout 기반 대체 설치 (16ms ≈ 60fps)
  const original = window.requestAnimationFrame.bind(window);
  const originalCancel = window.cancelAnimationFrame.bind(window);
  const timeoutIds = new Map<number, ReturnType<typeof setTimeout>>();
  let nextId = 1;

  window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
    const id = nextId++;
    const handle = setTimeout(() => {
      timeoutIds.delete(id);
      cb(performance.now());
    }, 16);
    timeoutIds.set(id, handle);
    return id as unknown as number;
  };
  window.cancelAnimationFrame = (handle: number) => {
    const t = timeoutIds.get(handle as unknown as number);
    if (t) {
      clearTimeout(t);
      timeoutIds.delete(handle as unknown as number);
    } else {
      originalCancel(handle);
    }
  };

  return () => {
    window.requestAnimationFrame = original;
    window.cancelAnimationFrame = originalCancel;
  };
}
