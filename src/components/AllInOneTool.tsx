"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import { useImageTool } from "@/lib/useImageTool";
import { canEncodeClient, useCaps } from "@/lib/capabilities";
import { MIME, type OutputFormat, type ResizeOption } from "@/lib/types";

const PRESETS: { key: "youtube" | "instaSq" | "instaP" | "facebook" | "blog" | "profile"; w: number; h: number }[] = [
  { key: "youtube", w: 1280, h: 720 },
  { key: "instaSq", w: 1080, h: 1080 },
  { key: "instaP", w: 1080, h: 1350 },
  { key: "facebook", w: 1200, h: 630 },
  { key: "blog", w: 1200, h: 675 },
  { key: "profile", w: 400, h: 400 },
];

const DEFAULT_RESIZE: ResizeOption = {
  mode: "pixels",
  width: null,
  height: null,
  lockRatio: true,
  percent: 50,
  maxWidth: null,
  maxHeight: null,
  noUpscale: true,
};

const FORMAT_KEYS: OutputFormat[] = ["keep", "jpeg", "png", "webp", "avif"];
const MODE_KEYS: ("pixels" | "percent" | "fit")[] = ["pixels", "percent", "fit"];

const numberOrNull = (v: string): number | null => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
};

/**
 * 올인원 도구: 포맷 변환 + 압축 + 사이즈 조정을 한 번에 적용.
 * 각 섹션은 독립 옵션 — 포맷 "원본 유지"면 변환 없음, 사이즈 미입력이면
 * 원본 크기 유지, 압축은 품질(기본)/목표 용량 설정값 그대로 인코딩.
 */
export default function AllInOneTool({ d }: { d: Dict }) {
  const tool = useImageTool("all", { resize: DEFAULT_RESIZE });
  const { options, update } = tool;
  const [mode, setMode] = useState<"quality" | "target">("quality");
  const resize = options.resize ?? DEFAULT_RESIZE;
  const c = d.common;
  const a = d.allin;
  const caps = useCaps();
  const disabled = (f: OutputFormat) => f !== "keep" && (!caps || !canEncodeClient(caps, MIME[f]));

  const setMode2 = (m: "quality" | "target") => {
    setMode(m);
    if (m === "quality") update("targetBytes", null);
    else update("targetBytes", 200 * 1024);
  };

  const patch = (p: Partial<ResizeOption>) =>
    update("resize", { ...DEFAULT_RESIZE, ...resize, ...p });

  return (
    <>
      <ToolHeader title={a.title} desc={a.desc} />
      <Dropzone onFiles={tool.addFiles} disabled={tool.running} d={d} />
      <ToolShell tool={tool} d={d}>
        <section className="card mt-6 p-6 space-y-6">
          {/* 1. 포맷 변환 (선택) */}
          <div>
            <div className="flex items-baseline justify-between">
              <span className="field-label mb-0">{a.formatStep}</span>
              <span className="text-[15px] text-muted">{a.formatBase}</span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {FORMAT_KEYS.map((f) => (
                <button
                  key={f}
                  type="button"
                  disabled={disabled(f)}
                  onClick={() => update("format", f)}
                  className={`rounded-[12px] border px-3 py-2.5 text-left transition-colors ${
                    options.format === f
                      ? "border-primary bg-primary/5"
                      : "border-hairline hover:border-muted"
                  } ${disabled(f) ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`block text-[18px] font-medium ${
                      options.format === f ? "text-primary" : "text-ink"
                    }`}
                  >
                    {c.formats[f]}
                  </span>
                  <span className="block mt-0.5 text-[15px] text-muted">{a.hints[f]}</span>
                </button>
              ))}
            </div>
            {options.format === "jpeg" && (
              <div className="mt-3 flex items-center gap-3">
                <label className="text-[16px] text-muted" htmlFor="all-bg">
                  {a.bgLabel}
                </label>
                <input
                  id="all-bg"
                  type="color"
                  value={options.background}
                  onChange={(e) => update("background", e.target.value)}
                  className="w-9 h-9 rounded-lg border border-hairline p-1 cursor-pointer bg-surface"
                />
                <span className="text-[16px] text-muted tabular-nums uppercase">
                  {options.background}
                </span>
              </div>
            )}
          </div>

          {/* 2. 압축 */}
          <div className="border-t border-hairline/60 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="field-label mb-0">{a.compressStep}</span>
                <span className="text-[15px] text-muted">{a.compressBase}</span>
              </div>
              <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                {(
                  [
                    ["quality", c.modeQuality],
                    ["target", c.modeTarget],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode2(value)}
                    className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                      mode === value ? "bg-surface text-ink font-medium" : "text-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {mode === "quality" ? (
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[16px] text-muted">{c.quality}</span>
                  <span className="text-[19px] font-medium text-primary tabular-nums">
                    {options.quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={options.quality}
                  onChange={(e) => update("quality", Number(e.target.value))}
                  className="w-full"
                  aria-label={c.quality}
                />
              </div>
            ) : (
              <div className="mt-4">
                <span className="field-label">{c.targetLabel}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    step={10}
                    defaultValue={200}
                    onChange={(e) =>
                      update("targetBytes", Math.max(10, Number(e.target.value) || 10) * 1024)
                    }
                    className="field w-32 tabular-nums"
                    aria-label={c.targetLabel}
                  />
                  <span className="text-[18px] text-muted">{c.targetUnit}</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. 사이즈 조정 (선택) */}
          <div className="border-t border-hairline/60 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="field-label mb-0">{a.resizeStep}</span>
                <span className="text-[15px] text-muted">{a.resizeBase}</span>
              </div>
              <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                {MODE_KEYS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => patch({ mode: m })}
                    className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                      resize.mode === m ? "bg-surface text-ink font-medium" : "text-muted"
                    }`}
                  >
                    {d.resize.modes[m]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <span className="field-label">{d.presets.label}</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const active =
                    resize.mode === "cover" && resize.width === p.w && resize.height === p.h;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() =>
                        patch({ mode: "cover", width: p.w, height: p.h, maxWidth: null, maxHeight: null })
                      }
                      className={`px-3.5 h-9 rounded-full border text-[16px] transition-colors ${
                        active
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-hairline text-muted hover:border-muted"
                      }`}
                    >
                      {d.presets[p.key]}
                      <span className="ml-1.5 tabular-nums opacity-70">
                        {p.w}×{p.h}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {resize.mode === "pixels" && (
              <div className="mt-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="field-label" htmlFor="all-w">
                      {a.width}
                    </label>
                    <input
                      id="all-w"
                      type="number"
                      min={1}
                      className="field w-32 tabular-nums"
                      value={resize.width ?? ""}
                      onChange={(e) => patch({ width: numberOrNull(e.target.value) })}
                    />
                  </div>
                  <span className="pb-3 text-muted text-[18px]">×</span>
                  <div>
                    <label className="field-label" htmlFor="all-h">
                      {a.height}
                    </label>
                    <input
                      id="all-h"
                      type="number"
                      min={1}
                      className="field w-32 tabular-nums"
                      value={resize.height ?? ""}
                      onChange={(e) => patch({ height: numberOrNull(e.target.value) })}
                    />
                  </div>
                </div>
                <label className="mt-3 inline-flex items-center gap-2 text-[18px] text-ink">
                  <input
                    type="checkbox"
                    checked={resize.lockRatio}
                    onChange={(e) => patch({ lockRatio: e.target.checked })}
                  />
                  {a.lock}
                </label>
              </div>
            )}

            {resize.mode === "percent" && (
              <div className="mt-4">
                <span className="field-label">{a.percentLabel}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    className="field w-32 tabular-nums"
                    value={resize.percent}
                    onChange={(e) =>
                      patch({ percent: Math.min(1000, Math.max(1, Number(e.target.value) || 1)) })
                    }
                    aria-label={a.percentLabel}
                  />
                  <span className="text-[18px] text-muted">%</span>
                </div>
              </div>
            )}

            {resize.mode === "fit" && (
              <div className="mt-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="field-label" htmlFor="all-maxw">
                      {a.maxWidth}
                    </label>
                    <input
                      id="all-maxw"
                      type="number"
                      min={1}
                      className="field w-32 tabular-nums"
                      value={resize.maxWidth ?? ""}
                      onChange={(e) => patch({ maxWidth: numberOrNull(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="all-maxh">
                      {a.maxHeight}
                    </label>
                    <input
                      id="all-maxh"
                      type="number"
                      min={1}
                      className="field w-32 tabular-nums"
                      value={resize.maxHeight ?? ""}
                      onChange={(e) => patch({ maxHeight: numberOrNull(e.target.value) })}
                    />
                  </div>
                </div>
                <label className="mt-3 inline-flex items-center gap-2 text-[18px] text-ink">
                  <input
                    type="checkbox"
                    checked={resize.noUpscale}
                    onChange={(e) => patch({ noUpscale: e.target.checked })}
                  />
                  {a.noUpscale}
                </label>
              </div>
            )}
          </div>

          {(options.format === "png" || options.format === "avif") && (
            <p className="text-[15px] text-muted">
              {options.format === "png" ? c.pngNote : c.avifNote}
            </p>
          )}
        </section>
      </ToolShell>
    </>
  );
}
