"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Item {
  href: string;
  label: string;
}

/**
 * 모바일(<lg)용 햄버거 → 우측 드로어.
 * 헤더 backdrop-blur가 fixed 기준점을 바꾸므로 드로어는 포털로 body에 렌더한다.
 * 화면 위아래를 꽉 채운 300px 패널이 우측에서 열리고,
 * 배경 클릭·Escape·페이지 이동 시 닫힌다.
 */
export default function HamburgerMenu({
  items,
  ariaLabel,
}: {
  items: Item[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [siteHeaderH, setSiteHeaderH] = useState<number | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 열릴 때 사이트 헤더의 실제 높이를 읽어 드로어 헤더와 동일하게 맞춘다
  useEffect(() => {
    if (open) {
      setSiteHeaderH(document.querySelector("header")?.offsetHeight);
    }
  }, [open, pathname]);

  // 로고: 한글 페이지는 한글 로고, 그 외는 영문 로고 (다크모드는 화이트 변형)
  const loc = pathname.split("/")[1];
  const ko = loc === "ko";
  const logoSrc = ko
    ? "/brand/imgwind-logo-ko.svg"
    : "/brand/imgwind-logo.svg";
  const logoSrcDark = ko
    ? "/brand/imgwind-logo-ko-white.svg"
    : "/brand/imgwind-logo-white.svg";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 열려 있는 동안: 래퍼·드로어 밖 클릭 시 닫기 + Escape + 본문 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !drawerRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="shrink-0 lg:hidden">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/10 transition-colors"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {mounted &&
        open &&
        createPortal(
          <>
            {/* 배경 오버레이 (클릭 시 닫힘) */}
            <div
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            {/* 우측 드로어 — 화면 위아래 꽉 참, 300px */}
            <div
              ref={drawerRef}
              className="fixed inset-y-0 right-0 z-[70] w-[300px] bg-surface shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="flex items-center justify-between px-4 border-b border-hairline/60"
                style={siteHeaderH ? { height: `${siteHeaderH}px` } : { height: "62px" }}
              >
                {/* 로고: 헤더와 동일 크기, 언어·테마 규칙도 동일 */}
                <span className="flex items-center">
                  <img
                    src={logoSrc}
                    alt="Imgwind"
                    className="h-7 sm:h-8 w-auto logo-light"
                  />
                  <img
                    src={logoSrcDark}
                    alt=""
                    aria-hidden
                    className="h-7 sm:h-8 w-auto logo-dark"
                  />
                </span>
                <button
                  type="button"
                  aria-label="닫기"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-fog hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-2">
                {items.map((item) => {
                  const itemActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center px-5 py-3 text-[15px] whitespace-nowrap transition-colors hover:bg-fog ${
                        itemActive ? "text-primary font-bold" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
