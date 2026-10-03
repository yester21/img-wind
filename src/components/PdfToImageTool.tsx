"use client";

import { useState } from "react";
import ToolHeader from "./ToolHeader";
import { fmt } from "@/lib/i18n";
import { ensureRafRunning } from "@/lib/raf";
import type { Dict } from "@/lib/i18n/dictionaries/ko";

/** PDF → 이미지: 각 페이지를 지정 배율로 렌더링해 ZIP으로 내려준다 */
export default function PdfToImageTool({ d }: { d: Dict }) {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(92);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const t = d.pdfimg;

  const run = async () => {
    if (!file || running) return;
    setRunning(true);
    setError(null);
    setProgress({ done: 0, total: 0 });
    // 백그라운드 탭·오클루전 창에서는 rAF가 멈춰 pdf.js 렌더가 영구 대기한다
    const restoreRaf = await ensureRafRunning();
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      setProgress({ done: 0, total: doc.numPages });

      const entries: { name: string; data: Uint8Array }[] = [];
      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const mime = format === "png" ? "image/png" : "image/jpeg";
        const blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("ERR_ENCODE"))),
            mime,
            format === "jpeg" ? quality / 100 : undefined,
          ),
        );
        entries.push({
          name: `page-${String(p).padStart(3, "0")}.${format === "png" ? "png" : "jpg"}`,
          data: new Uint8Array(await blob.arrayBuffer()),
        });
        page.cleanup();
        setProgress({ done: p, total: doc.numPages });
      }

      const { createZip } = await import("@/lib/zip");
      const zip = createZip(entries);
      const url = URL.createObjectURL(zip);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(file.name || "document.pdf").replace(/\.pdf$/i, "")}-images.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      setError(err instanceof Error && err.message.startsWith("ERR_") ? err.message : "ERR_PDF");
    } finally {
      restoreRaf();
      setRunning(false);
    }
  };

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />

      <div className="card border-2 border-dashed py-14 px-6 text-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="mx-auto text-muted"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
        <label className="mt-3 inline-block text-[19px] font-medium text-primary cursor-pointer hover:underline">
          {file ? file.name : t.pick}
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError(null);
              e.target.value = "";
            }}
          />
        </label>
        <p className="mt-1 text-[15px] text-muted">{t.hint}</p>
      </div>

      {file && (
        <section className="card mt-6 p-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="field-label">{t.scale}</span>
              <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={`px-4 h-8 rounded-full text-[16px] tabular-nums transition-colors ${
                      scale === s ? "bg-surface text-ink font-medium" : "text-muted"
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="field-label">{t.format}</span>
              <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                {(
                  [
                    ["png", "PNG"],
                    ["jpeg", "JPEG"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFormat(v)}
                    className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                      format === v ? "bg-surface text-ink font-medium" : "text-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {format === "jpeg" && (
            <div>
              <div className="flex items-baseline justify-between">
                <span className="field-label">{d.common.quality}</span>
                <span className="text-[19px] font-medium text-primary tabular-nums">{quality}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
                aria-label={d.common.quality}
              />
            </div>
          )}

          {error && <p className="text-[16px] text-negative">{(d.common.errors as Record<string, string>)[error] ?? error}</p>}

          <button type="button" className="btn-primary w-full" disabled={running} onClick={run}>
            {running
              ? progress.total > 0
                ? fmt(t.pageProgress, progress)
                : d.common.running
              : t.run}
          </button>
        </section>
      )}
    </>
  );
}
