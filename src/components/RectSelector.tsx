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
}

/**
 * 이미지 미리보기 위에 상대 좌표(0~1) 영역을 드래그로 그리는 컴포넌트.
 * 크롭(단일 영역)과 마스킹(다중 영역)이 공유한다.
 */
export default function RectSelector({ src, rects, onChange, multi = false, aspect = null }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // 드래그 상태는 ref로 관리 — 포인터 이벤트 사이 React 플러시 시점과 무관하게 동작
  const rectsRef = useRef(rects);
  rectsRef.current = rects;
  const dragIndexRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const rel = (e: React.PointerEvent) => {
    const box = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const p = rel(e);
    startRef.current = p;
    const rect: CropRect = { x: p.x, y: p.y, w: 0, h: 0 };
    const next = multi ? [...rectsRef.current, rect] : [rect];
    onChange(next);
    dragIndexRef.current = next.length - 1;
    try {
      containerRef.current!.setPointerCapture(e.pointerId);
    } catch {
      /* 합성 이벤트 등 캡처 불가 환경 무시 */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragIndexRef.current === null || !startRef.current) return;
    const p = rel(e);
    const s = startRef.current;
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
    next[dragIndexRef.current] = { x, y, w, h };
    rectsRef.current = next;
    onChange(next);
  };

  const onPointerUp = () => {
    if (dragIndexRef.current === null) return;
    const next = [...rectsRef.current];
    const r = next[dragIndexRef.current];
    if (!r || r.w < 0.01 || r.h < 0.01) {
      next.splice(dragIndexRef.current, 1);
      onChange(next);
    }
    dragIndexRef.current = null;
    startRef.current = null;
  };

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
      {rects.map((r, i) => (
        <div
          key={i}
          className="absolute border-2 border-primary bg-primary/10"
          style={{
            left: `${r.x * 100}%`,
            top: `${r.y * 100}%`,
            width: `${r.w * 100}%`,
            height: `${r.h * 100}%`,
          }}
        >
          <button
            type="button"
            aria-label="remove"
            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-ink text-white text-[15px] leading-none flex items-center justify-center"
            onPointerDown={(e) => {
              e.stopPropagation();
              onChange(rects.filter((_, j) => j !== i));
              dragIndexRef.current = null;
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
