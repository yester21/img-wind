"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { runBatch, type ProcessOutcome } from "./pipeline";
import type { ProcessOp, ProcessOptions } from "./types";
import { createZip, uniqueName } from "./zip";
import { savedPercent } from "./format";

export type ItemStatus = "queued" | "processing" | "done" | "error";

export interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: ItemStatus;
  error?: string;
  result?: ProcessOutcome;
  downloadUrl?: string;
}

export interface ToolSummary {
  total: number;
  doneCount: number;
  errorCount: number;
  inBytes: number;
  outBytes: number;
  savedPct: number;
}

const MAX_FILES = 100;

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|bmp|avif|tiff?|svg|ico|heic|heif)$/i;

function isImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXT.test(file.name);
}

export function useImageTool(op: ProcessOp, base: Partial<ProcessOptions> = {}) {
  const [options, setOptions] = useState<ProcessOptions>({
    op,
    format: base.format ?? "keep",
    quality: base.quality ?? 80,
    targetBytes: null,
    background: base.background ?? "#ffffff",
    resize: base.resize ?? null,
  });
  const [items, setItems] = useState<QueueItem[]>([]);
  const [running, setRunning] = useState(false);
  const [ranSnapshot, setRanSnapshot] = useState<string | null>(null);

  // run 중 핸들러가 최신 값을 읽도록 ref로 유지
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const snapshot = useMemo(() => JSON.stringify(options), [options]);
  const dirty = ranSnapshot !== null && ranSnapshot !== snapshot;

  const update = useCallback(
    <K extends keyof ProcessOptions>(key: K, value: ProcessOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const addFiles = useCallback((files: File[]) => {
    setItems((prev) => {
      const next = [...prev];
      for (const file of files) {
        if (next.length >= MAX_FILES) break;
        if (!isImage(file)) continue;
        next.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          status: "queued",
        });
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.downloadUrl) URL.revokeObjectURL(target.downloadUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems((prev) => {
      for (const it of prev) {
        URL.revokeObjectURL(it.previewUrl);
        if (it.downloadUrl) URL.revokeObjectURL(it.downloadUrl);
      }
      return [];
    });
    setRanSnapshot(null);
  }, []);

  const run = useCallback(async () => {
    if (running) return;
    const current = itemsRef.current;
    if (current.length === 0) return;

    setRunning(true);
    setRanSnapshot(JSON.stringify(optionsRef.current));

    // 이전 결과 초기화
    setItems((prev) =>
      prev.map((it) => {
        if (it.downloadUrl) URL.revokeObjectURL(it.downloadUrl);
        return { ...it, status: "queued" as const, error: undefined, result: undefined, downloadUrl: undefined };
      }),
    );

    const files = current.map((it) => it.file);
    const setStatus = (id: string, patch: Partial<QueueItem>) =>
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    const idByIndex = new Map(current.map((it, i) => [i, it.id]));

    await runBatch(files, optionsRef.current, {
      onItemStart: (i) => {
        const id = idByIndex.get(i);
        if (id) setStatus(id, { status: "processing" });
      },
      onItemDone: (i, outcome) => {
        const id = idByIndex.get(i);
        if (id)
          setStatus(id, {
            status: "done",
            result: outcome,
            downloadUrl: URL.createObjectURL(outcome.blob),
          });
      },
      onItemError: (i, message) => {
        const id = idByIndex.get(i);
        if (id) setStatus(id, { status: "error", error: message });
      },
    });

    setRunning(false);
  }, [running]);

  const downloadItem = useCallback((item: QueueItem) => {
    if (!item.downloadUrl || !item.result) return;
    const a = document.createElement("a");
    a.href = item.downloadUrl;
    a.download = item.result.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const downloadAll = useCallback(async () => {
    const done = itemsRef.current.filter((it) => it.result && it.downloadUrl);
    if (done.length === 0) return;
    const used = new Set<string>();
    const entries = [];
    for (const it of done) {
      const data = new Uint8Array(await it.result!.blob.arrayBuffer());
      entries.push({ name: uniqueName(it.result!.name, used), data });
    }
    const zip = createZip(entries);
    const url = URL.createObjectURL(zip);
    const a = document.createElement("a");
    a.href = url;
    a.download = `imgtools-${op}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }, [op]);

  const summary: ToolSummary = useMemo(() => {
    const done = items.filter((it) => it.status === "done" && it.result);
    const inBytes = done.reduce((s, it) => s + it.file.size, 0);
    const outBytes = done.reduce((s, it) => s + (it.result?.bytes ?? 0), 0);
    return {
      total: items.length,
      doneCount: done.length,
      errorCount: items.filter((it) => it.status === "error").length,
      inBytes,
      outBytes,
      savedPct: savedPercent(inBytes, outBytes),
    };
  }, [items]);

  return {
    options,
    update,
    items,
    running,
    dirty,
    summary,
    addFiles,
    removeItem,
    clearAll,
    run,
    downloadItem,
    downloadAll,
  };
}

export type ImageTool = ReturnType<typeof useImageTool>;
