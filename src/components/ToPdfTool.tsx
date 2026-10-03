"use client";

import { useCallback, useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import { formatBytes } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/ko";

interface Item {
  id: string;
  file: File;
  url: string;
}

/** 이미지 → PDF: 여러 장을 순서대로 하나의 PDF로 합친다 (클라이언트 완결). */
export default function ToPdfTool({ d }: { d: Dict }) {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "image">("a4");
  const [margin, setMargin] = useState<"none" | "normal">("normal");
  const [quality, setQuality] = useState(92);
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const t = d.topdf;

  const addFiles = useCallback((files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => ({ id: crypto.randomUUID(), file: f, url: URL.createObjectURL(f) })),
    ]);
  }, []);

  const removeItem = (id: string) =>
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((it) => it.id !== id);
    });

  const build = async () => {
    if (items.length === 0 || building) return;
    setBuilding(true);
    setProgress(0);
    try {
      const { jsPDF } = await import("jspdf");
      let pdf: import("jspdf").jsPDF | null = null;
      const m = margin === "normal" ? 28 : 0;

      for (let i = 0; i < items.length; i++) {
        const bitmap = await createImageBitmap(items[i].file, { imageOrientation: "from-image" });
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
        bitmap.close();
        const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
        const iw = canvas.width;
        const ih = canvas.height;
        const orientation = iw >= ih ? "landscape" : "portrait";

        if (pageSize === "a4") {
          const pw = 595.28;
          const ph = 841.89;
          const availW = pw - m * 2;
          const availH = ph - m * 2;
          const s = Math.min(availW / iw, availH / ih);
          const w = iw * s;
          const h = ih * s;
          const x = (pw - w) / 2;
          const y = (ph - h) / 2;
          if (!pdf) {
            pdf = new jsPDF({ unit: "pt", format: "a4", orientation, compress: true });
          } else {
            pdf.addPage("a4", orientation);
          }
          pdf.addImage(dataUrl, "JPEG", x, y, w, h);
        } else {
          const w = iw * 0.75;
          const h = ih * 0.75;
          if (!pdf) {
            pdf = new jsPDF({
              unit: "pt",
              format: [w, h],
              orientation,
              compress: true,
            });
          } else {
            pdf.addPage([w, h], orientation);
          }
          pdf.addImage(dataUrl, "JPEG", 0, 0, w, h);
        }
        setProgress(i + 1);
      }

      await pdf!.save("imgtools-images.pdf");
    } finally {
      setBuilding(false);
    }
  };

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />
      <Dropzone onFiles={addFiles} disabled={building} d={d} />

      {items.length > 0 && (
        <section className="card mt-6 p-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="field-label">{t.page}</span>
              <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                {(
                  [
                    ["a4", t.a4],
                    ["image", t.imageSize],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPageSize(v)}
                    className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                      pageSize === v ? "bg-surface text-ink font-medium" : "text-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {pageSize === "a4" && (
              <div>
                <span className="field-label">{t.margin}</span>
                <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
                  {(
                    [
                      ["none", t.none],
                      ["normal", t.normal],
                    ] as const
                  ).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMargin(v)}
                      className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                        margin === v ? "bg-surface text-ink font-medium" : "text-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="field-label">{t.quality}</span>
              <span className="text-[19px] font-medium text-primary tabular-nums">{quality}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
              aria-label={t.quality}
            />
          </div>

          <p className="text-[15px] text-muted">{t.note}</p>
        </section>
      )}

      {items.length > 0 && (
        <>
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              className="btn-primary h-12 px-9 text-[20px] min-w-[220px]"
              disabled={building}
              onClick={build}
            >
              {building ? fmt(t.pageProgress, { done: progress, total: items.length }) : t.build}
            </button>
          </div>

          <section className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-hairline/70">
              <h2 className="text-[18px] font-semibold text-ink">
                {fmt(d.common.files, { n: items.length })}
              </h2>
              <button
                type="button"
                className="btn-ghost"
                disabled={building}
                onClick={() => {
                  items.forEach((it) => URL.revokeObjectURL(it.url));
                  setItems([]);
                }}
              >
                {d.common.clearAll}
              </button>
            </div>
            <ul>
              {items.map((it, i) => (
                <li
                  key={it.id}
                  className="flex items-center gap-4 px-5 py-3 border-b border-hairline/40 last:border-b-0"
                >
                  <span className="w-6 text-center text-[15px] text-muted tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.url}
                    alt=""
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-[10px] object-cover bg-fog shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[18px] font-medium text-ink truncate">{it.file.name}</p>
                    <p className="mt-0.5 text-[15px] text-muted">{formatBytes(it.file.size)}</p>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost w-8 px-0"
                    aria-label={fmt(d.common.removeAria, { name: it.file.name })}
                    disabled={building}
                    onClick={() => removeItem(it.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
