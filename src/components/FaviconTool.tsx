"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import { createZip } from "@/lib/zip";
import { createIco } from "@/lib/ico";
import type { Dict } from "@/lib/i18n/dictionaries/ko";

const ALL_SIZES = [16, 32, 48, 64, 96, 128, 144, 180, 192, 256, 512];
const ICO_SIZES = [16, 32, 48];

/** 파비콘 생성기: 이미지 1장 → 다양한 크기 PNG + favicon.ico → ZIP */
export default function FaviconTool({ d }: { d: Dict }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState<number[]>([16, 32, 48, 96, 180, 192, 512]);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ url: string; size: number }[]>([]);
  const t = d.fav;

  const addFiles = (files: File[]) => {
    const img = files.find((f) => f.type.startsWith("image/"));
    if (!img) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(img);
    setPreview(URL.createObjectURL(img));
    setResults([]);
  };

  const toggle = (s: number) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort((a, b) => a - b)));

  const generate = async () => {
    if (!file || sizes.length === 0 || running) return;
    setRunning(true);
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const entries: { name: string; data: Uint8Array }[] = [];
      const previews: { url: string; size: number }[] = [];

      for (const size of sizes) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(bitmap, 0, 0, size, size);
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/png"),
        );
        const data = new Uint8Array(await blob.arrayBuffer());
        entries.push({ name: `favicon-${size}.png`, data });
        if ([16, 32, 64, 180].includes(size)) {
          previews.push({ url: URL.createObjectURL(blob), size });
        }
        if (ICO_SIZES.includes(size)) {
          // ICO는 아래에서 한 번에 만든다
        }
      }
      bitmap.close();

      const icoSources = ICO_SIZES.filter((s) => sizes.includes(s));
      if (icoSources.length > 0) {
        const icoEntries = await Promise.all(
          icoSources.map(async (s) => {
            const e = entries.find((x) => x.name === `favicon-${s}.png`)!;
            return { size: s, data: e.data };
          }),
        );
        entries.push({ name: "favicon.ico", data: new Uint8Array(await createIco(icoEntries).arrayBuffer()) });
      }

      const zip = createZip(entries);
      const url = URL.createObjectURL(zip);
      const a = document.createElement("a");
      a.href = url;
      a.download = "favicon-pack.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setResults(previews);
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />
      {file ? (
        <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="w-28 h-28 rounded-[16px] object-cover bg-fog border border-hairline shrink-0"
            />
          )}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-[19px] font-medium text-ink truncate">{file.name}</p>
            <button
              type="button"
              className="btn-ghost mt-2"
              onClick={() => {
                URL.revokeObjectURL(preview!);
                setFile(null);
                setPreview(null);
                setResults([]);
              }}
            >
              {d.common.clearAll}
            </button>
          </div>
        </div>
      ) : (
        <Dropzone onFiles={addFiles} disabled={running} d={d} />
      )}

      {file && (
        <section className="card mt-6 p-6 space-y-5">
          <div>
            <span className="field-label">{t.sizes}</span>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(s)}
                  className={`px-3.5 h-9 rounded-full border text-[16px] tabular-nums transition-colors ${
                    sizes.includes(s)
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-hairline text-muted hover:border-muted"
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
            <p className="mt-2 text-[15px] text-muted">{t.note}</p>
          </div>

          <button type="button" className="btn-primary w-full" disabled={running || sizes.length === 0} onClick={generate}>
            {running ? d.common.running : t.run}
          </button>

          {results.length > 0 && (
            <div>
              <span className="field-label">{t.preview}</span>
              <div className="flex items-end gap-5">
                {results.map((r) => (
                  <div key={r.size} className="text-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.url}
                      alt=""
                      style={{ width: Math.min(96, r.size) }}
                      className="rounded bg-fog border border-hairline checker"
                    />
                    <span className="text-[15px] text-muted tabular-nums">{r.size}px</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
