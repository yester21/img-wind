/**
 * 브라우저 배경 제거 — onnxruntime-web + u2netp(경량 모델, ~4.5MB).
 * 모델·WASM은 /public에 셀프호스팅되어 이미지가 서버로 전송되지 않는다.
 * 첫 실행 시 모델을 내려받아 세션을 캐시한다.
 */
import * as ort from "onnxruntime-web";

ort.env.wasm.wasmPaths = "/ort/";

let sessionPromise: Promise<ort.InferenceSession> | null = null;

function getSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create("/models/u2netp.onnx", {
      executionProviders: ["wasm"],
    });
  }
  return sessionPromise;
}

const SIZE = 320;
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

/** u2netp 추론으로 알파 마스크를 만들고 원본과 합성해 투명 PNG를 반환한다 */
export async function removeBackground(input: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(input, { imageOrientation: "from-image" });
  try {
    // 1) 전처리: 320×320 + ImageNet 정규화 (NCHW)
    const c = document.createElement("canvas");
    c.width = SIZE;
    c.height = SIZE;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, SIZE, SIZE);
    const px = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const data = new Float32Array(3 * SIZE * SIZE);
    const plane = SIZE * SIZE;
    for (let i = 0; i < plane; i++) {
      data[i] = (px[i * 4] / 255 - MEAN[0]) / STD[0];
      data[i + plane] = (px[i * 4 + 1] / 255 - MEAN[1]) / STD[1];
      data[i + plane * 2] = (px[i * 4 + 2] / 255 - MEAN[2]) / STD[2];
    }

    // 2) 추론
    const session = await getSession();
    const tensor = new ort.Tensor("float32", data, [1, 3, SIZE, SIZE]);
    const results = await session.run({ [session.inputNames[0]]: tensor });
    const maskOut = results[session.outputNames[0]].data as Float32Array;

    // 3) 마스크 정규화 → 320 캔버스 알파
    let max = 0;
    for (let i = 0; i < maskOut.length; i++) if (maskOut[i] > max) max = maskOut[i];
    const scale = max > 0 ? 1 / max : 1;
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = SIZE;
    maskCanvas.height = SIZE;
    const mctx = maskCanvas.getContext("2d")!;
    const mimg = mctx.createImageData(SIZE, SIZE);
    for (let i = 0; i < plane; i++) {
      mimg.data[i * 4] = 0;
      mimg.data[i * 4 + 1] = 0;
      mimg.data[i * 4 + 2] = 0;
      mimg.data[i * 4 + 3] = Math.round(Math.min(1, Math.max(0, maskOut[i] * scale)) * 255);
    }
    mctx.putImageData(mimg, 0, 0);

    // 4) 원본 합성: destination-in으로 알파 적용
    const out = document.createElement("canvas");
    out.width = bitmap.width;
    out.height = bitmap.height;
    const octx = out.getContext("2d")!;
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = "high";
    octx.drawImage(bitmap, 0, 0);
    octx.globalCompositeOperation = "destination-in";
    octx.drawImage(maskCanvas, 0, 0, out.width, out.height);

    const blob = await new Promise<Blob>((resolve, reject) =>
      out.toBlob((b) => (b ? resolve(b) : reject(new Error("ERR_UNKNOWN"))), "image/png"),
    );
    return blob;
  } finally {
    bitmap.close();
  }
}
