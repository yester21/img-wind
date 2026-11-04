"use client";

import { useRef } from "react";
import type { CropRect } from "@/lib/types";

interface Props {
  src: string;
  rects: CropRect[];
  onChange: (rects: CropRect[]) => void;
  /** true면 여러 영역, false면 1개 (새 드래그가 교체) */
  multi?: boolean;
  /** 가로/세로 비율 잠금 (단일 모드만) */
  aspect?: number | null;
  /** 격자(3분할) 표시 */
  grid?: boolean;
}

const SNAP = 0.02;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * 이미지 미리보기 위에 상대 좌표(0~1) 영역을 드래그로 그리는 컴포넌트.
 * 크롭(단일 영역)과 마스킹(다중 영역)이 공유한다.
 * - 그린 영역을 다시 드래그하면 위치를 이동할 수 있다.
 * - 격자 표시 + 중앙 스냅(가로/세로 중앙) 가이드를 제공한다.
 */
export default function RectSelector({ src, rects, onChange, multi = false, aspect = null, grid = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // 드래그 상태는 ref로 관리 — 포인터 이벤트 사이 React 플러시 시점과 무관하게 동작
  const rectsRef = useRef(rects);
  rectsRef.current = rects;
  const modeRef = useRef<"create" | "move" | null>(null);
  const indexRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const originRef = useRef<CropRect | null>(null);

  const rel = (e: React.PointerEvent) => {
    const box = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)),
    };
  };

  const snapCenter = (r: CropRect): CropRect => {
    let x = r.x;
    let y = r.y;
    if (Math.abs(x + r.w / 2 - 0.5) < SNAP) x = 0.5 - r.w / 2;
    if (Math.abs(y + r.h / 2 - 0.5) < SNAP) y = 0.5 - r.h / 2;
    return { ...r, x: clamp(x, 0, 1 - r.w), y: clamp(y, 0, 1 - r.h) };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // 영역 내부에서 시작한 경우는 영역 이동 핸들러가 처리
    const target = e.target as HTMLElement;
    if (target.closest("[data-crop-area]")) return;
    const p = rel(e);
    startRef.current = p;
    modeRef.current = "create";
    const rect: CropRect = { x: p.x, y: p.y, w: 0, h: 0 };
    const next = multi ? [...rectsRef.current, rect] : [rect];
    onChange(next);
    indexRef.current = next.length - 1;
    try {
      containerRef.current!.setPointerCapture(e.pointerId);
    } catch {
      /* 합성 이벤트 등 캡처 불가 환경 무시 */
    }
  };

  const onAreaPointerDown = (e: React.PointerEvent, index: number) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const p = rel(e);
    startRef.current = p;
    modeRef.current = "move";
    indexRef.current = index;
    originRef.current = { ...rectsRef.current[index] };
    try {
      containerRef.current!.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!modeRef.current || !startRef.current) return;
    const p = rel(e);
    const s = startRef.current;

    if (modeRef.current === "move" && indexRef.current !== null && originRef.current) {
      const dx = p.x - s.x;
      const dy = p.y - s.y;
      const o = originRef.current;
      const moved = snapCenter({
        x: clamp(o.x + dx, 0, 1 - o.w),
        y: clamp(o.y + dy, 0, 1 - o.h),
        w: o.w,
        h: o.h,
      });
      const next = [...rectsRef.current];
      next[indexRef.current] = moved;
      rectsRef.current = next;
      onChange(next);
      return;
    }

    let x = Math.min(s.x, p.x);
    let y = Math.min(s.y, p.y);
    let w = Math.abs(p.x - s.x);
    let h = Math.abs(p.y - s.y);
    if (aspect && w > 0) {
      h = Math.min(h, w / aspect);
      w = h * aspect;
      if (p.x >= s.x) x = Math.min(s.x, 1 - w);
      if (p.y >= s.y) y = Math.min(s.y, 1 - h);
    }
    const next = [...rectsRef.current];
    next[indexRef.current!] = snapCenter({ x, y, w, h });
    rectsRef.current = next;
    onChange(next);
  };

  const onPointerUp = () => {
    if (!modeRef.current) return;
    if (modeRef.current === "create") {
      const next = [...rectsRef.current];
      const r = next[indexRef.current!];
      if (!r || r.w < 0.01 || r.h < 0.01) {
        next.splice(indexRef.current!, 1);
        onChange(next);
      }
    }
    modeRef.current = null;
    indexRef.current = null;
    startRef.current = null;
    originRef.current = null;
  };

  // 중앙 정렬 상태 (스냅으로 정확히 중앙에 놓인 경우)
  const centeredX = rects.some((r) => r.w > 0 && Math.abs(r.x + r.w / 2 - 0.5) < 0.004);
  const centeredY = rects.some((r) => r.h > 0 && Math.abs(r.y + r.h / 2 - 0.5) < 0.004);

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none cursor-crosshair rounded-[12px] overflow-hidden border border-hairline"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block w-full pointer-events-none" draggable={false} />

      {/* 격자(3분할) */}
      {grid && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-y-0 left-1/3 w-px bg-white/60" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-white/60" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-white/60" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-white/60" />
        </div>
      )}

      {/* 중앙 가이드: 가로 기준(세로선) / 세로 기준(가로선) */}
      {centeredX && (
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-emerald-400/90 pointer-events-none" aria-hidden />
      )}
      {centeredY && (
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-emerald-400/90 pointer-events-none" aria-hidden />
      )}
      {centeredX && centeredY && (
        <div className="absolute left-1/2 top-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 pointer-events-none" aria-hidden />
      )}

      {rects.map((r, i) => (
        <div
          key={i}
          data-crop-area
          className="absolute border-2 border-primary bg-primary/10 cursor-move"
          style={{
            left: `${r.x * 100}%`,
            top: `${r.y * 100}%`,
            width: `${r.w * 100}%`,
            height: `${r.h * 100}%`,
          }}
          onPointerDown={(e) => onAreaPointerDown(e, i)}
        >
          <button
            type="button"
            aria-label="remove"
            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-ink text-white text-[14px] leading-none flex items-center justify-center"
            onPointerDown={(e) => {
              e.stopPropagation();
              onChange(rects.filter((_, j) => j !== i));
              modeRef.current = null;
              indexRef.current = null;
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
