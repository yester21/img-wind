"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ToolIcon } from "./toolIcons";

interface Item {
  href: string;
  label: string;
}

/**
 * "모든 도구" 드롭다운 — 호버로 열리고, 포커스 이탈·외부 클릭·Escape·
 * 라우트 변경 시 닫힌다. 클릭으로도 토글 가능(터치 기기용).
 */
export default function ToolsMenu({ items, label }: { items: Item[]; label: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 페이지 이동 시 닫기 (클릭 이동 후 열린 채 남는 문제)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 열려 있는 동안: 포인터가 래퍼 밖으로 나가면 닫기 + 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onMove = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("click", onDoc);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onDoc);
    };
  }, [open]);

  const openNow = () => setOpen(true);
  const activeHere = items.some((it) => pathname === it.href);

  return (
    <div
      ref={wrapRef}
      className="relative self-stretch flex items-center"
      onMouseEnter={openNow}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={openNow}
        className={`cursor-pointer font-bold text-[16px] whitespace-nowrap transition-colors select-none ${
          activeHere ? "text-primary" : "text-ink hover:text-primary"
        }`}
      >
        {label}
      </button>

      {open && (
        // 바깥 div: 버튼→패널 사이 16px 브리지(호버 끊김 방지) + 보더 선 정렬(pt-4 = 헤더 py-4)
        // 안쪽 카드: w-max로 가장 긴 항목 텍스트 + 패딩에 맞춰 폭이 정해진다 (min-w-56 하한)
        <div className="absolute left-0 top-full z-50 pt-4">
          <div className="w-max min-w-56 card border border-hairline/60 py-1.5 shadow-lg">
            {items.map((item) => {
              const itemActive = pathname === item.href;
              const toolPath = "/" + item.href.split("/").slice(2).join("/"); // 로케일 접두사 제거
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 whitespace-nowrap px-4 py-2 text-[16px] transition-colors hover:bg-fog ${
                    itemActive ? "text-primary font-bold" : "text-ink hover:text-primary"
                  }`}
                >
                  <ToolIcon href={toolPath} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
