"use client";

import { formatBytes, formatPercent } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import type { ToolSummary } from "@/lib/useImageTool";

export default function ResultBar({
  summary,
  d,
  onDownloadAll,
  onClear,
}: {
  summary: ToolSummary;
  d: Dict;
  onDownloadAll: () => void;
  onClear: () => void;
}) {
  const c = d.common;
  return (
    <section className="card mt-6 px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex-1 min-w-[200px]">
        <p className="text-[19px] font-medium text-ink">
          {fmt(c.doneOf, { done: summary.doneCount, total: summary.total })}
          {summary.errorCount > 0 && (
            <span className="ml-2 text-[16px] text-negative">
              {fmt(c.failedCount, { n: summary.errorCount })}
            </span>
          )}
        </p>
        <p className="mt-0.5 text-[16px] text-muted">
          {formatBytes(summary.inBytes)} → {formatBytes(summary.outBytes)}
          {summary.inBytes > 0 && (
            <span
              className={`ml-1.5 font-medium ${
                summary.savedPct >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              ({formatPercent(summary.savedPct)})
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="btn-primary" onClick={onDownloadAll}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          {c.downloadZip}
        </button>
        <button type="button" className="btn-ghost h-11 px-4" onClick={onClear}>
          {c.deleteAll}
        </button>
      </div>
    </section>
  );
}
