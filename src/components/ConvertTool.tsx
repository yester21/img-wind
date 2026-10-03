"use client";

import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import { useImageTool } from "@/lib/useImageTool";
import { canEncodeClient, useCaps } from "@/lib/capabilities";
import { MIME, type OutputFormat } from "@/lib/types";

type ConvFormat = Exclude<OutputFormat, "keep">;
const CONV_KEYS: ConvFormat[] = ["jpeg", "png", "webp", "avif"];

export default function ConvertTool({ d }: { d: Dict }) {
  const tool = useImageTool("convert", { format: "webp" });
  const { options, update } = tool;
  const lossy = options.format !== "png";
  const c = d.common;
  const caps = useCaps();
  const disabled = (f: Exclude<OutputFormat, "keep">) => !caps || !canEncodeClient(caps, MIME[f]);

  return (
    <>
      <ToolHeader title={d.convert.title} desc={d.convert.desc} />
      <Dropzone onFiles={tool.addFiles} disabled={tool.running} d={d} />
      <ToolShell tool={tool} d={d}>
        <section className="card mt-6 p-6 space-y-5">
          <div>
            <span className="field-label">{d.convert.pick}</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONV_KEYS.map((f) => (
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
                  <span className="block mt-0.5 text-[15px] text-muted">{d.convert.hints[f]}</span>
                </button>
              ))}
            </div>
          </div>

          {lossy ? (
            <div>
              <div className="flex items-baseline justify-between">
                <span className="field-label">{c.quality}</span>
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
            <p className="text-[16px] text-muted">{d.convert.pngNoQuality}</p>
          )}

          {options.format === "jpeg" && (
            <div>
              <label className="field-label" htmlFor="convert-bg">
                {d.convert.bgLabel}
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="convert-bg"
                  type="color"
                  value={options.background}
                  onChange={(e) => update("background", e.target.value)}
                  className="w-11 h-11 rounded-xl border border-hairline p-1 cursor-pointer bg-surface"
                />
                <span className="text-[16px] text-muted tabular-nums uppercase">
                  {options.background}
                </span>
              </div>
              <p className="mt-2 text-[15px] text-muted">{d.convert.bgHint}</p>
            </div>
          )}

          {options.format === "avif" && <p className="text-[15px] text-muted">{c.avifNote}</p>}
        </section>
      </ToolShell>
    </>
  );
}
