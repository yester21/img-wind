"use client";

import { useState } from "react";
import type { ContactText } from "@/lib/i18n/contact";
import type { Locale } from "@/lib/i18n/config";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ t, locale }: { t: ContactText; locale: Locale }) {
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
      if (!payload.agree) throw new Error(t.agreeError);
      const res = await fetch("/wp-json/usepic/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(t.defaultError);
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "contact_submit",
        form: "contact",
        language: locale,
        page_path: window.location.pathname,
      });
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t.defaultError);
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
        <h2 className="mt-4 text-[20px] font-semibold text-ink">{t.successTitle}</h2>
        <p className="mt-2 text-[16px] text-muted">{t.successDesc}</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-5 h-10 px-5 text-[14px]">
          {t.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card border border-hairline/60 p-6 sm:p-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">{t.name}</span>
          <input name="name" required maxLength={60} className="field w-full" />
        </label>
        <label className="block">
          <span className="field-label">{t.email}</span>
          <input name="email" type="email" required maxLength={120} placeholder="you@example.com" className="field w-full" />
        </label>
      </div>
      <label className="block">
        <span className="field-label">{t.type}</span>
        <select name="subject" className="field w-full">
          {t.types.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="field-label">{t.message}</span>
        <textarea
          name="message"
          required
          maxLength={4000}
          rows={7}
          className="w-full rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-primary"
        />
      </label>
      <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex items-start gap-2.5 text-[14px] text-muted">
        <input type="checkbox" name="agree" className="mt-0.5" />
        <span>
          {t.agreePrefix}
          <a href={`/${locale}/privacy`} className="text-primary hover:underline">
            {t.agreeLink}
          </a>
          {t.agreeSuffix}
        </span>
      </label>
      {status === "error" && <p className="text-[14px] text-negative">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-primary h-12 px-8 text-[16px] w-full sm:w-auto">
        {status === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
