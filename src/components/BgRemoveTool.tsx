"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import { formatBytes, formatPercent, savedPercent } from "@/lib/format";
import { processFile } from "@/lib/pipeline";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import type { ProcessOptions } from "@/lib/types";

interface Item {
  id: string;
  file: File;
  url: string;
  status: "queued" | "running" | "done" | "error";
  error?: string;
  resultUrl?: string;
  bytes?: number;
}

/**
 * 배경 제거: ONNX(u2netp)로 브라우저에서 추론 — 파일은 전송되지 않는다.
 * 모델 추론이 무거워 순차 처리한다.
 */
export default function BgRemoveTool({ d }: { d: Dict }) {
  const [items, setItems] = useState<Item[]>([]);
  const [running, setRunning] = useState(false);
  const t = d.bg;

  const addFiles = (files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => ({ id: crypto.randomUUID(), file: f, url: URL.createObjectURL(f), status: "queued" as const })),
    ]);
  };

  const patch = (id: string, p: Partial<Item>) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const run = async () => {
    const pending = items.filter((it) => it.status === "queued" || it.status === "error");
    if (pending.length === 0 || running) return;
    setRunning(true);
    const opts: ProcessOptions = {
      op: "bg-remove",
      format: "png",
      quality: 90,
      targetBytes: null,
      background: "#ffffff",
      resize: null,
      removeBg: true,
    };
    for (const it of pending) {
      patch(it.id, { status: "running" });
      try {
        const outcome = await processFile(it.file, opts);
        patch(it.id, {
          status: "done",
          resultUrl: URL.createObjectURL(outcome.blob),
          bytes: outcome.bytes,
        });
      } catch (err) {
        patch(it.id, {
          status: "error",
          error: err instanceof Error ? err.message : "ERR_UNKNOWN",
        });
      }
    }
    setRunning(false);
  };

  const save = (it: Item) => {
    if (!it.resultUrl) return;
    const a = document.createElement("a");
    a.href = it.resultUrl;
    a.download = `${it.file.name.replace(/\.[^.]+$/, "")}-nobg.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />
      <Dropzone onFiles={addFiles} disabled={running} d={d} />

      {items.length > 0 && (
        <section className="card mt-6 p-6 space-y-4">
          <button type="button" className="btn-primary w-full" disabled={running} onClick={run}>
            {running ? d.common.running : t.run}
          </button>
          <p className="text-[15px] text-muted">{t.note}</p>
        </section>
      )}

      <ul className="mt-6 space-y-4">
        {items.map((it) => (
          <li key={it.id} className="card p-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.resultUrl ?? it.url}
                alt=""
                width={56}
                height={56}
                className="w-14 h-14 rounded-[10px] object-contain bg-fog checker shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-medium text-ink truncate">{it.file.name}</p>
                <p className="mt-0.5 text-[15px] text-muted">
                  {it.status === "queued" && d.common.queued}
                  {it.status === "running" && t.removing}
                  {it.status === "error" && (
                    <span className="text-negative">
                      {(d.common.errors as Record<string, string>)[it.error ?? ""] ?? it.error}
                    </span>
                  )}
                  {it.status === "done" && (
                    <>
                      {formatBytes(it.file.size)} → {formatBytes(it.bytes ?? 0)}
                      <span className="ml-1.5 font-medium text-positive">
                        ({formatPercent(savedPercent(it.file.size, it.bytes ?? 0))})
                      </span>
                    </>
                  )}
                </p>
              </div>
              {it.status === "done" && (
                <button type="button" className="btn-secondary h-8 px-3.5 text-[16px]" onClick={() => save(it)}>
                  {d.common.save}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
