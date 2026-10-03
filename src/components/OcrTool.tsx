"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";
import ToolHeader from "./ToolHeader";
import { fmt } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/ko";

interface Item {
  id: string;
  file: File;
  url: string;
  status: "queued" | "running" | "done" | "error";
  text?: string;
}

const LANGS: { code: string; label: (d: Dict) => string }[] = [
  { code: "kor", label: (d) => d.ocr.ko },
  { code: "eng", label: (d) => d.ocr.en },
  { code: "jpn", label: (d) => d.ocr.ja },
];

/** 이미지 → 텍스트: tesseract.js로 브라우저에서 OCR (한·영·일) */
export default function OcrTool({ d }: { d: Dict }) {
  const [items, setItems] = useState<Item[]>([]);
  const [langs, setLangs] = useState<string[]>(["kor", "eng"]);
  const [running, setRunning] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = d.ocr;

  const addFiles = (files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => ({ id: crypto.randomUUID(), file: f, url: URL.createObjectURL(f), status: "queued" as const })),
    ]);
  };

  const toggleLang = (code: string) =>
    setLangs((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) || [] : [...prev, code],
    );

  const run = async () => {
    const pending = items.filter((it) => it.status === "queued" || it.status === "error");
    if (pending.length === 0 || running || langs.length === 0) return;
    setRunning(true);
    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null = null;
    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker(langs.join("+"));
      for (const it of pending) {
        setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "running" } : x)));
        try {
          const result = await worker.recognize(it.file);
          const text = result.data.text ?? "";
          setItems((prev) =>
            prev.map((x) => (x.id === it.id ? { ...x, status: "done", text } : x)),
          );
        } catch {
          setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "error" } : x)));
        }
      }
    } catch {
      setItems((prev) =>
        prev.map((x) => (x.status === "running" ? { ...x, status: "error" } : x)),
      );
    } finally {
      await worker?.terminate();
      setRunning(false);
    }
  };

  const copy = async (it: Item) => {
    await navigator.clipboard.writeText(it.text ?? "");
    setCopiedId(it.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const downloadAll = () => {
    const done = items.filter((it) => it.status === "done");
    const text = done
      .map((it, i) => `--- ${i + 1}. ${it.file.name} ---\n${it.text}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ocr-result.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  return (
    <>
      <ToolHeader title={t.title} desc={t.desc} />
      <Dropzone onFiles={addFiles} disabled={running} d={d} />

      {items.length > 0 && (
        <section className="card mt-6 p-6 space-y-5">
          <div>
            <span className="field-label">{t.langs}</span>
            <div className="inline-flex rounded-full bg-fog border border-hairline/60 p-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => toggleLang(l.code)}
                  className={`px-4 h-8 rounded-full text-[16px] transition-colors ${
                    langs.includes(l.code) ? "bg-surface text-ink font-medium" : "text-muted"
                  }`}
                >
                  {l.label(d)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={running || langs.length === 0}
              onClick={run}
            >
              {running ? t.running : t.run}
            </button>
            {items.some((it) => it.status === "done") && (
              <button type="button" className="btn-secondary" onClick={downloadAll}>
                {t.downloadTxt}
              </button>
            )}
          </div>
          <p className="text-[15px] text-muted">{t.note}</p>
        </section>
      )}

      <ul className="mt-6 space-y-4">
        {items.map((it) => (
          <li key={it.id} className="card p-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.url}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 rounded-[10px] object-cover bg-fog shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-medium text-ink truncate">{it.file.name}</p>
                <p className="mt-0.5 text-[15px] text-muted">
                  {it.status === "queued" && d.common.queued}
                  {it.status === "running" && t.running}
                  {it.status === "error" && (
                    <span className="text-negative">{d.common.failed.replace("{msg}", "")}</span>
                  )}
                  {it.status === "done" && `${t.done} (${it.text?.length ?? 0} chars)`}
                </p>
              </div>
              {it.status === "done" && (
                <button type="button" className="btn-secondary h-8 px-3.5 text-[16px]" onClick={() => copy(it)}>
                  {copiedId === it.id ? t.copied : t.copy}
                </button>
              )}
            </div>
            {it.status === "done" && (
              <pre className="mt-3 max-h-48 overflow-auto rounded-[10px] bg-fog p-3 text-[16px] whitespace-pre-wrap text-ink">
                {it.text || t.empty}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
