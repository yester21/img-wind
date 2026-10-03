"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import { useImageTool } from "@/lib/useImageTool";
import { renderImage } from "@/lib/encode";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import type { WatermarkOption, WatermarkPosition } from "@/lib/types";

const POSITIONS: { value: WatermarkPosition; label: (d: Dict) => string }[] = [
  { value: "top-left", label: (d) => d.wm.posTL },
  { value: "top-right", label: (d) => d.wm.posTR },
  { value: "center", label: (d) => d.wm.posC },
  { value: "bottom-left", label: (d) => d.wm.posBL },
  { value: "bottom-right", label: (d) => d.wm.posBR },
  { value: "tile", label: (d) => d.wm.tile },
];

const DEFAULT_WM: WatermarkOption = {
  type: "text",
  text: "",
  fontSizePct: 5,
  color: "#ffffff",
  opacity: 0.6,
  position: "bottom-right",
  widthPct: 20,
  image: null,
};

/** 워터마크: 텍스트 또는 로고 이미지를 여러 장에 일괄 적용. 실시간 미리보기 포함. */
export default function WatermarkTool({ d }: { d: Dict }) {
  const tool = useImageTool("watermark", { watermark: { ...DEFAULT_WM } });
  const { options, update } = tool;
  const wm = options.watermark ?? DEFAULT_WM;
  const t = d.wm;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const patchWm = (p: Partial<typeof DEFAULT_WM>) =>
    update("watermark", { ...DEFAULT_WM, ...wm, ...p });

  // 첫 파일 × 옵션 변경 → 실시간 미리보기 (메인 스레드, 800px 축소 렌더)
  useEffect(() => {
    const file = tool.items[0]?.file;
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(async () => {
      try {
        const result = await renderImage(file, {
          ...options,
          watermark: wm.text.trim() || wm.type === "image" ? wm : null,
          resize: { mode: "fit", width: null, height: null, lockRatio: true, percent: 50, maxWidth: 800, maxHeight: 800, noUpscale: true },
        });
        setPreviewUrl(URL.createObjectURL(result.blob));
      } catch {
        /* 미리보기 실패는 무시 */
      }
    }, 400);
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.items[0]?.id, JSON.stringify({ ...wm, image: wm.image ? wm.image.size : null })]);

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />
      <Dropzone onFiles={tool.addFiles} disabled={tool.running} d={d} />
      <ToolShell tool={tool} d={d}>
        <section className="card mt-6 p-6 space-y-5">
          {previewUrl && (
            <div>
              <span className="field-label">{t.preview}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                className="max-h-72 rounded-[12px] border border-hairline bg-fog"
              />
            </div>
          )}

          <div>
            <span className="field-label">{t.type}</span>
            <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
              {(
                [
                  ["text", t.text],
                  ["image", t.image],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => patchWm({ type: v })}
                  className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                    wm.type === v ? "bg-surface text-ink font-medium" : "text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {wm.type === "text" ? (
            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="wm-text">
                  {t.wmText}
                </label>
                <input
                  id="wm-text"
                  className="field w-full"
                  value={wm.text}
                  onChange={(e) => patchWm({ text: e.target.value })}
                  placeholder="@mysite"
                />
              </div>
              <div className="flex flex-wrap items-end gap-5">
                <div>
                  <label className="field-label" htmlFor="wm-color">
                    {t.color}
                  </label>
                  <input
                    id="wm-color"
                    type="color"
                    value={wm.color}
                    onChange={(e) => patchWm({ color: e.target.value })}
                    className="w-11 h-11 rounded-xl border border-hairline p-1 cursor-pointer bg-surface"
                  />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <div className="flex items-baseline justify-between">
                    <span className="field-label">{t.size}</span>
                    <span className="text-[16px] text-primary tabular-nums">{wm.fontSizePct}%</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    value={wm.fontSizePct}
                    onChange={(e) => patchWm({ fontSizePct: Number(e.target.value) })}
                    className="w-full"
                    aria-label={t.size}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="wm-logo">
                  {t.logo}
                </label>
                <input
                  id="wm-logo"
                  type="file"
                  accept="image/png,image/svg+xml,image/webp,image/jpeg"
                  onChange={(e) => patchWm({ image: e.target.files?.[0] ?? null })}
                  className="field w-full py-2.5"
                />
                {wm.image && (
                  <p className="mt-1 text-[15px] text-muted">{(wm.image as File).name ?? "logo"}</p>
                )}
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="field-label">{t.logoPct}</span>
                  <span className="text-[16px] text-primary tabular-nums">{wm.widthPct}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={wm.widthPct}
                  onChange={(e) => patchWm({ widthPct: Number(e.target.value) })}
                  className="w-full"
                  aria-label={t.logoPct}
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-baseline justify-between">
              <span className="field-label">{t.opacity}</span>
              <span className="text-[16px] text-primary tabular-nums">
                {Math.round(wm.opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(wm.opacity * 100)}
              onChange={(e) => patchWm({ opacity: Number(e.target.value) / 100 })}
              className="w-full"
              aria-label={t.opacity}
            />
          </div>

          <div>
            <span className="field-label">{t.position}</span>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => patchWm({ position: p.value })}
                  className={`px-3.5 h-9 rounded-full border text-[16px] transition-colors ${
                    wm.position === p.value
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-hairline text-muted hover:border-muted"
                  }`}
                >
                  {p.label(d)}
                </button>
              ))}
            </div>
          </div>
        </section>
      </ToolShell>
    </>
  );
}
