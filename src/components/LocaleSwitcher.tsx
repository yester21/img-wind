"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";

const DESKTOP_WIDTH = 146;
const MIN_WIDTH = 96;
const MAX_WIDTH = 132;

/** 헤더 우측 끝 언어 드롭다운 — 현재 경로를 유지한 채 로케일만 교체하고 선택을 저장한다. */
export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [width, setWidth] = useState(DESKTOP_WIDTH);

  // 모바일에서는 선택된 언어 길이에 맞춰 폭을 줄여 햄버거가 밀리지 않게 한다.
  useEffect(() => {
    const compute = () => {
      if (window.innerWidth >= 640) {
        setWidth(DESKTOP_WIDTH);
        return;
      }
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:absolute;visibility:hidden;white-space:nowrap;font-size:14px;font-weight:400;font-family:inherit";
      probe.textContent = localeNames[locale];
      document.body.appendChild(probe);
      const textWidth = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);
      const next = Math.ceil(textWidth) + 38; // 좌우 패딩 + 화살표
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [locale]);

  return (
    <div className="relative ml-auto shrink-0">
      <select
        aria-label={localeNames[locale]}
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
          const parts = pathname.split("/");
          parts[1] = next;
          router.push(parts.join("/") || `/${next}`);
        }}
        style={{ width: `${width}px` }}
        className="appearance-none h-7 rounded-full border border-hairline bg-surface pl-2.5 pr-6 text-[14px] text-ink cursor-pointer hover:border-muted transition-colors focus:border-primary outline-none"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
