"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Item {
  href: string;
  label: string;
}

/** 헤더 주 메뉴 — 16px 굵게, 현재 페이지·호버 시 브랜드 컬러 */
export default function SiteNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`font-bold text-[16px] whitespace-nowrap transition-colors ${
              active ? "text-primary" : "text-ink hover:text-primary"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </>
  );
}
