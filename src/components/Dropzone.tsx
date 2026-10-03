"use client";

import { useRef, useState } from "react";
import { fmt } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/ko";

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  d: Dict;
}

export default function Dropzone({ onFiles, disabled, d }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const c = d.common;

  const pick = (list: FileList | null) => {
    if (list && list.length > 0) onFiles(Array.from(list));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={c.dropAria}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) pick(e.dataTransfer.files);
      }}
      className={`card border-2 border-dashed py-14 px-6 text-center cursor-pointer transition-colors
        ${dragging ? "border-primary bg-primary/5" : "border-hairline hover:border-muted"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="mx-auto text-muted"
      >
        <path d="M12 16V4m0 0 4.5 4.5M12 4 7.5 8.5" />
        <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </svg>
      <p className="mt-3 text-[19px] font-medium text-ink">{c.dropTitle}</p>
      <p className="mt-1 text-[15px] text-muted">{c.dropHint}</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.heic,.heif,.tif,.tiff,.avif"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
