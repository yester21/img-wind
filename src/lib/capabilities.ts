/**
 * 브라우저 이미지 인코딩 지원 감지. 1×1 캔버스를 실제로 인코딩해
 * blob.type을 확인한다 (브라우저가 타입만 받고 PNG로 돌려주는 경우 걸러냄).
 * 정적 사이트이므로 서버 폴백이 없다 — 지원하지 않는 포맷은 UI에서 막는다.
 */
import { useEffect, useState } from "react";

export interface Caps {
  encode: Record<"jpeg" | "png" | "webp" | "avif", boolean>;
  worker: boolean;
  offscreen: boolean;
}

let capsPromise: Promise<Caps> | null = null;

async function probeEncode(type: string): Promise<boolean> {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.fillRect(0, 0, 2, 2);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, 0.8),
    );
    return !!blob && blob.type === type;
  } catch {
    return false;
  }
}

export function getCaps(): Promise<Caps> {
  if (!capsPromise) {
    capsPromise = (async () => {
      const [jpeg, png, webp, avif] = await Promise.all([
        probeEncode("image/jpeg"),
        probeEncode("image/png"),
        probeEncode("image/webp"),
        probeEncode("image/avif"),
      ]);
      return {
        encode: { jpeg, png, webp, avif },
        worker: typeof Worker !== "undefined",
        offscreen: typeof OffscreenCanvas !== "undefined",
      };
    })();
  }
  return capsPromise;
}

/** 클라이언트 컴포넌트용 훅 — 프로브 결과(초기 null) */
export function useCaps(): Caps | null {
  const [caps, setCaps] = useState<Caps | null>(null);
  useEffect(() => {
    getCaps().then(setCaps);
  }, []);
  return caps;
}

/** 브라우저가 이 mime을 캔버스로 인코딩할 수 있는지 */
export function canEncodeClient(caps: Caps, mime: string): boolean {
  switch (mime) {
    case "image/jpeg":
      return caps.encode.jpeg;
    case "image/png":
      return caps.encode.png;
    case "image/webp":
      return caps.encode.webp;
    case "image/avif":
      return caps.encode.avif;
    default:
      return false; // gif 등 캔버스 미지원 출력
  }
}
