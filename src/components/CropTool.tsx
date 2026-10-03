"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import RectSelector from "./RectSelector";
import { useImageTool } from "@/lib/useImageTool";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import type { CropRect, Rotation } from "@/lib/types";

const RATIOS: { key: string; label: (d: Dict) => string; value: number | null }[] = [
  { key: "free", label: (d) => d.crop.free, value: null },
  { key: "1:1", label: () => "1:1", value: 1 },
  { key: "4:3", label: () => "4:3", value: 4 / 3 },
  { key: "16:9", label: () => "16:9", value: 16 / 9 },
  { key: "9:16", label: () => "9:16", value: 9 / 16 },
];

/** 자르기·회전: 첫 이미지에서 그린 상대 영역을 모든 파일에 적용 + 90° 회전·뒤집기 */
export default function CropTool({ d }: { d: Dict }) {
  const tool = useImageTool("crop", { crop: null, rotation: 0, flip: "none" });
  const { options, update } = tool;
  const [aspect, setAspect] = useState<number | null>(null);
  const t = d.crop;

  const previewUrl = tool.items[0]?.previewUrl;
  const rects: CropRect[] = options.crop ? [options.crop] : [];
  const rotation: Rotation = options.rotation ?? 0;

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />
      <Dropzone onFiles={tool.addFiles} disabled={tool.running} d={d} />
      <ToolShell tool={tool} d={d}>
        <section className="card mt-6 p-6 space-y-5">
          {previewUrl && (
            <div>
              <span className="field-label">{t.area}</span>
              <RectSelector
                src={previewUrl}
                rects={rects}
                aspect={aspect}
                onChange={(rs) => update("crop", rs[0] ?? null)}
              />
            </div>
          )}

          <div>
            <span className="field-label">{t.ratio}</span>
            <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
              {RATIOS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setAspect(r.value)}
                  className={`px-3.5 h-8 rounded-full text-[16px] tabular-nums transition-colors ${
                    aspect === r.value ? "bg-surface text-ink font-medium" : "text-muted"
                  }`}
                >
                  {r.label(d)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 border-t border-hairline/60 pt-5">
            <div>
              <span className="field-label">{t.rotate}</span>
              <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                {([0, 90, 180, 270] as Rotation[]).map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => update("rotation", deg)}
                    className={`px-3.5 h-8 rounded-full text-[16px] tabular-nums transition-colors ${
                      rotation === deg ? "bg-surface text-ink font-medium" : "text-muted"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="field-label">{t.flip}</span>
              <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                {(
                  [
                    ["none", t.flipNone],
                    ["horizontal", t.flipH],
                    ["vertical", t.flipV],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update("flip", v)}
                    className={`px-3.5 h-8 rounded-full text-[16px] transition-colors ${
                      (options.flip ?? "none") === v ? "bg-surface text-ink font-medium" : "text-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[15px] text-muted">{t.applyAll}</p>
        </section>
      </ToolShell>
    </>
  );
}
