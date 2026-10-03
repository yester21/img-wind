/** 도구별 아이콘 (24×24 stroke SVG path) — 홈 카드와 헤더 드롭다운 공용 */
export const TOOL_ICONS: Record<string, React.ReactNode> = {
  "/all-in-one": <path d="M13 2 4.5 12.5H11L9.5 22 19 10h-6.5L13 2z" />,
  "/compress": (
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  ),
  "/convert": <path d="M4 7h13m0 0-3-3m3 3-3 3M20 17H7m0 0 3 3m-3-3 3-3" />,
  "/resize": <path d="M3 3h7v7H3zM14 14h7v7h-7zM3 14h7v7H3zM14 3h7v7h-7z" />,
  "/to-pdf": (
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  ),
  "/pdf-to-image": (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h4" />
  ),
  "/crop": <path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14" />,
  "/watermark": <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 21c1-3 2.5-4 4-4s3 1 4 4M12 3v14" />,
  "/mask": <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM8 10v2M16 10v2" />,
  "/bg-remove": <path d="M3 3h18v18H3zM3 15l5-5 4 4 3-3 6 6M9 8a1 1 0 1 0 0-.01" />,
  "/ocr": <path d="M4 7V4h3M20 7V4h-3M4 17v3h3M20 17v3h-3M8 12h8M12 8v8" />,
  "/favicon": <path d="M4 16V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM12 8v8M8 12h8" />,
};

/** 도구별 강조색 — 홈 카드·드롭다운 공통 */
export const TOOL_ACCENTS: Record<string, string> = {
  "/all-in-one": "#34c759",
  "/compress": "#0071e3",
  "/convert": "#5856d6",
  "/resize": "#ff9500",
  "/to-pdf": "#e6398c",
  "/pdf-to-image": "#8e44ad",
  "/crop": "#0a84ff",
  "/watermark": "#30b0c7",
  "/mask": "#ff375f",
  "/bg-remove": "#34c759",
  "/ocr": "#ff9500",
  "/favicon": "#6e6e73",
};

/** 16px 크기의 작은 아이콘 (드롭다운 등 목록용) */
export function ToolIcon({ href, size = 16 }: { href: string; size?: number }) {
  const icon = TOOL_ICONS[href];
  const accent = TOOL_ACCENTS[href] ?? "#6e6e73";
  if (!icon) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={accent}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      {icon}
    </svg>
  );
}
