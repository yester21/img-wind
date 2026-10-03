/** 출력 포맷. "keep"은 입력 포맷 유지 */
export type OutputFormat = "keep" | "jpeg" | "png" | "webp" | "avif";

export type ConcreteFormat = Exclude<OutputFormat, "keep">;

export const MIME: Record<ConcreteFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export const MIME_TO_FORMAT: Record<string, ConcreteFormat> = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const EXT: Record<ConcreteFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
};

/** 캔버스가 직접 인코딩할 수 있는 포맷 */
export const LOSSY_FORMATS: ConcreteFormat[] = ["jpeg", "webp", "avif"];

export type ResizeMode = "pixels" | "percent" | "fit" | "cover";

/** 크롭 영역 — 원본 대비 0~1 상대 좌표 */
export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Rotation = 0 | 90 | 180 | 270;
export type Flip = "none" | "horizontal" | "vertical";

export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "tile";

export interface WatermarkOption {
  type: "text" | "image";
  text: string;
  /** 폰트 크기: 짧은 변 길이 대비 % (기본 5) */
  fontSizePct: number;
  color: string;
  /** 0~1 */
  opacity: number;
  position: WatermarkPosition;
  /** image 워터마크: 폭을 출력 이미지 폭 대비 %로 축소 (기본 20) */
  widthPct: number;
  /** image 워터마크 원본 — Blob은 postMessage로 워커 전달 가능 */
  image?: Blob | null;
}

export interface MaskRegion {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MaskOption {
  effect: "blur" | "pixelate";
  /** 강도: 짧은 변 길이 대비 % (기본 2.5) */
  strengthPct: number;
  regions: MaskRegion[];
}

export interface ResizeOption {
  mode: ResizeMode;
  /** pixels/cover 모드: 목표 폭(px) */
  width: number | null;
  height: number | null;
  /** pixels 모드: 원본 비율 유지 */
  lockRatio: boolean;
  /** percent 모드: 1~1000 */
  percent: number;
  /** fit/cover 모드: 최대 폭(px) */
  maxWidth: number | null;
  maxHeight: number | null;
  /** fit 모드: 확대하지 않음 */
  noUpscale: boolean;
}

export type ProcessOp =
  | "compress"
  | "convert"
  | "resize"
  | "all"
  | "crop"
  | "watermark"
  | "mask"
  | "bg-remove";

export interface ProcessOptions {
  op: ProcessOp;
  format: OutputFormat;
  /** 1~100, 손실 포맷 전용 */
  quality: number;
  /** compress 목표 용량 모드. null이면 품질 모드 */
  targetBytes: number | null;
  /** 불투명 출력(jpeg 등)으로 합성할 배경색 */
  background: string;
  resize: ResizeOption | null;
  /** 자르기 — 리사이즈 계산보다 먼저 적용 */
  crop?: CropRect | null;
  rotation?: Rotation;
  flip?: Flip;
  watermark?: WatermarkOption | null;
  mask?: MaskOption | null;
  /** 배경 제거 후 결과 (op "bg-remove") */
  removeBg?: boolean;
}

export interface ProcessResult {
  blob: Blob;
  mime: string;
  width: number;
  height: number;
  bytes: number;
  via: "browser" | "server";
}
