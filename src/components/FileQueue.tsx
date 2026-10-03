"use client";

import { formatBytes, formatPercent, savedPercent } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import type { ImageTool, QueueItem } from "@/lib/useImageTool";

function StatusCell({ item, d }: { item: QueueItem; d: Dict }) {
  if (item.status === "queued") {
    return <span className="text-[15px] text-muted">{d.common.queued}</span>;
  }
  if (item.status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[15px] text-primary">
        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        {d.common.processing}
      </span>
    );
  }
  if (item.status === "error") {
    const msg =
      (item.error && (d.common.errors as Record<string, string>)[item.error]) || item.error || "";
    return (
      <span className="text-[15px] text-negative" title={msg}>
        {fmt(d.common.failed, { msg })}
      </span>
    );
  }
  return null;
}

export default function FileQueue({
  tool,
  d,
}: {
  tool: Pick<ImageTool, "items" | "running" | "removeItem" | "downloadItem" | "clearAll">;
  d: Dict;
}) {
  const { items, running, removeItem, downloadItem, clearAll } = tool;
  const c = d.common;

  return (
    <section className="card mt-6 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-hairline/70">
        <h2 className="text-[18px] font-semibold text-ink">{fmt(c.files, { n: items.length })}</h2>
        <button type="button" className="btn-ghost" onClick={clearAll} disabled={running}>
          {c.clearAll}
        </button>
      </div>
      <ul>
        {items.map((item) => {
          const saved =
            item.result && item.status === "done"
              ? savedPercent(item.file.size, item.result.bytes)
              : null;
          return (
            <li
              key={item.id}
              className="flex items-center gap-4 px-5 py-3 border-b border-hairline/40 last:border-b-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt=""
                width={56}
                height={56}
                className="w-14 h-14 rounded-[10px] object-cover bg-fog shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-medium text-ink truncate">{item.file.name}</p>
                <p className="mt-0.5 text-[15px] text-muted truncate">
                  {formatBytes(item.file.size)}
                  {item.status === "done" && item.result && (
                    <>
                      {" → "}
                      <span className="font-medium text-ink">{formatBytes(item.result.bytes)}</span>
                      {saved !== null && (
                        <span
                          className={`ml-1.5 font-medium ${
                            saved >= 0 ? "text-positive" : "text-negative"
                          }`}
                        >
                          ({formatPercent(saved)})
                        </span>
                      )}
                      {" · "}
                      {item.result.width}×{item.result.height}
                      <span className="ml-1.5 rounded-full bg-fog px-2 py-0.5 text-[15px] text-muted">
                        {item.result.via === "browser" ? c.viaBrowser : c.viaServer}
                      </span>
                    </>
                  )}
                  {(item.status === "queued" || item.status === "processing" || item.status === "error") && (
                    <>
                      {" · "}
                      <StatusCell item={item} d={d} />
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {item.status === "done" && (
                  <button type="button" className="btn-secondary h-8 px-3.5 text-[16px]" onClick={() => downloadItem(item)}>
                    {c.save}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-ghost w-8 px-0"
                  aria-label={fmt(c.removeAria, { name: item.file.name })}
                  disabled={running || item.status === "processing"}
                  onClick={() => removeItem(item.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
