"use client";

import type { ReactNode } from "react";
import FileQueue from "./FileQueue";
import ResultBar from "./ResultBar";
import { fmt } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/ko";
import type { ImageTool } from "@/lib/useImageTool";

/**
 * 도구 페이지 공통 하단: 옵션 UI(children) 아래에 실행 버튼,
 * 파일 큐, 결과 바를 놓는다.
 */
export default function ToolShell({
  tool,
  d,
  children,
}: {
  tool: ImageTool;
  d: Dict;
  children: ReactNode;
}) {
  const c = d.common;
  return (
    <>
      {children}

      {tool.items.length > 0 && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            className="btn-primary h-12 px-9 text-[20px] min-w-[220px]"
            disabled={tool.running}
            onClick={tool.run}
          >
            {tool.running ? c.running : tool.dirty ? c.dirty : fmt(c.run, { n: tool.items.length })}
          </button>
        </div>
      )}

      {tool.items.length > 0 && <FileQueue tool={tool} d={d} />}

      {tool.summary.doneCount > 0 && (
        <ResultBar
          summary={tool.summary}
          d={d}
          onDownloadAll={tool.downloadAll}
          onClear={tool.clearAll}
        />
      )}
    </>
  );
}
