"use client";

import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import RectSelector from "./RectSelector";
import { useImageTool } from "@/lib/useImageTool";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import type { MaskRegion } from "@/lib/types";

const DEFAULT_MASK: {
  effect: "blur" | "pixelate";
  strengthPct: number;
  regions: MaskRegion[];
} = {
  effect: "blur",
  strengthPct: 2.5,
  regions: [],
};

/** 블러·픽셀화: 미리보기에서 그린 상대 영역을 모든 파일에 적용해 가린다 */
export default function MaskTool({ d }: { d: Dict }) {
  const tool = useImageTool("mask", { mask: { ...DEFAULT_MASK } });
  const { options, update } = tool;
  const mask = options.mask ?? DEFAULT_MASK;
  const t = d.maskT;

  const previewUrl = tool.items[0]?.previewUrl;

  const patch = (p: Partial<typeof DEFAULT_MASK>) =>
    update("mask", { ...DEFAULT_MASK, ...mask, ...p });

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />
      <Dropzone onFiles={tool.addFiles} disabled={tool.running} d={d} />
      <ToolShell tool={tool} d={d}>
        <section className="card mt-6 p-6 space-y-5">
          {previewUrl && (
            <div>
              <span className="field-label">{t.regions}</span>
              <RectSelector
                src={previewUrl}
                rects={mask.regions}
                multi
                onChange={(rs) => patch({ regions: rs })}
              />
              <p className="mt-2 text-[15px] text-muted">{t.hint}</p>
            </div>
          )}

          <div>
            <span className="field-label">{t.effect}</span>
            <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
              {(
                [
                  ["blur", t.blur],
                  ["pixelate", t.pixelate],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => patch({ effect: v })}
                  className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                    mask.effect === v ? "bg-surface text-ink font-medium" : "text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="field-label">{t.strength}</span>
              <span className="text-[16px] text-primary tabular-nums">{mask.strengthPct}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={mask.strengthPct}
              onChange={(e) => patch({ strengthPct: Number(e.target.value) })}
              className="w-full"
              aria-label={t.strength}
            />
          </div>
        </section>
      </ToolShell>
    </>
  );
}
