"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const SUBJECTS = ["서비스 문의", "버그 신고", "제휴·협업", "기타"];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      hp: String(fd.get("hp") || ""),
      agree: fd.get("agree") ? "1" : "",
    };
    try {
      if (!payload.agree) throw new Error("개인정보 수집·이용에 동의해 주세요.");
      const res = await fetch("/wp-json/usepic/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(j?.message || "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "전송에 실패했습니다.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card border border-hairline/60 p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="mt-4 text-[20px] font-semibold text-ink">문의가 접수되었습니다</h2>
        <p className="mt-2 text-[16px] text-muted">확인 후 입력하신 이메일로 회신드리겠습니다.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-5 h-10 px-5 text-[14px]">
          다시 보내기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card border border-hairline/60 p-6 sm:p-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">이름</span>
          <input name="name" required maxLength={60} placeholder="홍길동" className="field w-full" />
        </label>
        <label className="block">
          <span className="field-label">이메일</span>
          <input name="email" type="email" required maxLength={120} placeholder="you@example.com" className="field w-full" />
        </label>
      </div>
      <label className="block">
        <span className="field-label">문의 유형</span>
        <select name="subject" className="field w-full">
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="field-label">문의 내용</span>
        <textarea
          name="message"
          required
          maxLength={4000}
          rows={7}
          placeholder="문의하실 내용을 자세히 적어주세요."
          className="w-full rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-primary"
        />
      </label>
      <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex items-start gap-2.5 text-[14px] text-muted">
        <input type="checkbox" name="agree" className="mt-0.5" />
        <span>
          문의 응대를 위한 개인정보(이름·이메일) 수집·이용에 동의합니다. 자세한 내용은{" "}
          <a href="/ko/privacy" className="text-primary hover:underline">
            개인정보처리방침
          </a>
          을 확인해 주세요.
        </span>
      </label>
      {status === "error" && <p className="text-[14px] text-negative">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-primary h-12 px-8 text-[16px] w-full sm:w-auto">
        {status === "sending" ? "전송 중…" : "문의 보내기"}
      </button>
    </form>
  );
}
