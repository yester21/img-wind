"use client";

/** 푸터에서 쿠키 동의를 다시 열 수 있는 버튼 */
export default function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      className={className ?? "text-muted transition-colors hover:text-primary"}
      onClick={() => window.dispatchEvent(new Event("usepic-open-cookie-settings"))}
    >
      {label}
    </button>
  );
}
