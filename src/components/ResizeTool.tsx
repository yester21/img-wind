"use client";

import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import { useImageTool } from "@/lib/useImageTool";
import { fmt } from "@/lib/i18n";
import { canEncodeClient, useCaps } from "@/lib/capabilities";
import { MIME, type OutputFormat, type ResizeOption } from "@/lib/types";

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

const disabledFormat = (f: OutputFormat, caps: ReturnType<typeof useCaps>) =>
  f !== "keep" && (!caps || !canEncodeClient(caps, MIME[f]));

const numberOrNull = (v: string): number | null => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
};

const PRESETS: { key: "youtube" | "instaSq" | "instaP" | "facebook" | "blog" | "profile"; w: number; h: number }[] = [
  { key: "youtube", w: 1280, h: 720 },
  { key: "instaSq", w: 1080, h: 1080 },
  { key: "instaP", w: 1080, h: 1350 },
  { key: "facebook", w: 1200, h: 630 },
  { key: "blog", w: 1200, h: 675 },
  { key: "profile", w: 400, h: 400 },
];

export default function ResizeTool({ d }: { d: Dict }) {
  const tool = useImageTool("resize", { resize: DEFAULT_RESIZE });
  const { options, update } = tool;
  const resize = options.resize ?? DEFAULT_RESIZE;
  const c = d.common;
  const r = d.resize;
  const caps = useCaps();

  const patch = (p: Partial<ResizeOption>) =>
    update("resize", { ...DEFAULT_RESIZE, ...resize, ...p });

  return (
    <>
      <ToolHeader title={r.title} desc={r.desc} />
      <Dropzone onFiles={tool.addFiles} disabled={tool.running} d={d} />
      <ToolShell tool={tool} d={d}>
        <section className="card mt-6 p-6 space-y-5">
          <div>
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
            {resize.mode === "cover" && resize.width && resize.height && (
              <p className="mt-2 text-[15px] text-muted">
                {fmt(d.resize.coverNote, { w: resize.width, h: resize.height })}
              </p>
            )}
          </div>

          <div>
            <span className="field-label">{r.mode}</span>
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
                  {r.modes[m]}
                </button>
              ))}
            </div>
          </div>

          {resize.mode === "pixels" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="field-label" htmlFor="resize-w">
                    {r.width}
                  </label>
                  <input
                    id="resize-w"
                    type="number"
                    min={1}
                    className="field w-32 tabular-nums"
                    value={resize.width ?? ""}
                    onChange={(e) => patch({ width: numberOrNull(e.target.value) })}
                  />
                </div>
                <span className="pb-3 text-muted text-[18px]">×</span>
                <div>
                  <label className="field-label" htmlFor="resize-h">
                    {r.height}
                  </label>
                  <input
                    id="resize-h"
                    type="number"
                    min={1}
                    className="field w-32 tabular-nums"
                    value={resize.height ?? ""}
                    onChange={(e) => patch({ height: numberOrNull(e.target.value) })}
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-[18px] text-ink">
                <input
                  type="checkbox"
                  checked={resize.lockRatio}
                  onChange={(e) => patch({ lockRatio: e.target.checked })}
                />
                {r.lock}
              </label>
              <p className="text-[15px] text-muted">{r.lockHint}</p>
            </div>
          )}

          {resize.mode === "percent" && (
            <div>
              <span className="field-label">{r.percentLabel}</span>
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
                  aria-label={r.percentLabel}
                />
                <span className="text-[18px] text-muted">%</span>
              </div>
            </div>
          )}

          {resize.mode === "fit" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="field-label" htmlFor="resize-maxw">
                    {r.maxWidth}
                  </label>
                  <input
                    id="resize-maxw"
                    type="number"
                    min={1}
                    className="field w-32 tabular-nums"
                    value={resize.maxWidth ?? ""}
                    onChange={(e) => patch({ maxWidth: numberOrNull(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="resize-maxh">
                    {r.maxHeight}
                  </label>
                  <input
                    id="resize-maxh"
                    type="number"
                    min={1}
                    className="field w-32 tabular-nums"
                    value={resize.maxHeight ?? ""}
                    onChange={(e) => patch({ maxHeight: numberOrNull(e.target.value) })}
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-[18px] text-ink">
                <input
                  type="checkbox"
                  checked={resize.noUpscale}
                  onChange={(e) => patch({ noUpscale: e.target.checked })}
                />
                {r.noUpscale}
              </label>
              <p className="text-[15px] text-muted">{r.fitHint}</p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 border-t border-hairline/60 pt-5">
            <div>
              <label className="field-label" htmlFor="resize-format">
                {c.outputFormat}
              </label>
              <select
                id="resize-format"
                className="field w-full"
                value={options.format}
                onChange={(e) => update("format", e.target.value as OutputFormat)}
              >
                {FORMAT_KEYS.map((f) => (
                  <option key={f} value={f} disabled={disabledFormat(f, caps)}>
                    {c.formats[f]}
                    {disabledFormat(f, caps) ? " (N/A)" : ""}
                  </option>
                ))}
              </select>
            </div>
            {options.format !== "png" && (
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="field-label" htmlFor="resize-quality">
                    {c.quality}
                  </label>
                  <span className="text-[19px] font-medium text-primary tabular-nums">
                    {options.quality}%
                  </span>
                </div>
                <input
                  id="resize-quality"
                  type="range"
                  min={1}
                  max={100}
                  value={options.quality}
                  onChange={(e) => update("quality", Number(e.target.value))}
                  className="w-full mt-3"
                />
              </div>
            )}
          </div>
        </section>
      </ToolShell>
    </>
  );
}
