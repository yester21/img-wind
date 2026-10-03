"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import { useImageTool } from "@/lib/useImageTool";
import { canEncodeClient, useCaps } from "@/lib/capabilities";
import { MIME, type OutputFormat } from "@/lib/types";

const FORMAT_KEYS: OutputFormat[] = ["keep", "jpeg", "png", "webp", "avif"];

export default function CompressTool({ d }: { d: Dict }) {
  const tool = useImageTool("compress");
  const { options, update } = tool;
  const [mode, setMode] = useState<"quality" | "target">("quality");
  const c = d.common;
  const caps = useCaps();
  const disabled = (f: OutputFormat) => f !== "keep" && (!caps || !canEncodeClient(caps, MIME[f]));

  const setMode2 = (m: "quality" | "target") => {
    setMode(m);
    if (m === "quality") update("targetBytes", null);
    else update("targetBytes", 200 * 1024);
  };

  return (
    <>
      <ToolHeader title={d.compress.title} desc={d.compress.desc} />
      <Dropzone onFiles={tool.addFiles} disabled={tool.running} d={d} />
      <ToolShell tool={tool} d={d}>
        <section className="card mt-6 p-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="field-label">{d.compress.mode}</span>
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
            <div>
              <label className="field-label" htmlFor="compress-format">
                {c.outputFormat}
              </label>
              <select
                id="compress-format"
                className="field w-full"
                value={options.format}
                onChange={(e) => update("format", e.target.value as OutputFormat)}
              >
                {FORMAT_KEYS.map((f) => (
                  <option key={f} value={f} disabled={disabled(f)}>
                    {c.formats[f]}
                    {disabled(f) ? " (N/A)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {mode === "quality" ? (
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
              <p className="mt-2 text-[15px] text-muted">{c.qualityHint}</p>
            </div>
          ) : (
            <div>
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
              <p className="mt-2 text-[15px] text-muted">{c.targetHint}</p>
            </div>
          )}

          {options.format === "png" && <p className="text-[15px] text-muted">{c.pngNote}</p>}
        </section>
      </ToolShell>
    </>
  );
}
