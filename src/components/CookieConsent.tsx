"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export const CONSENT_KEY = "usepic-consent";
const GTM_ID = "GTM-NNL7XBXJ";

type ConsentStrings = {
  title: string;
  desc: string;
  accept: string;
  reject: string;
  settings: string;
};

type DataLayer = unknown[] & { push: (...args: unknown[]) => number };

function getDataLayer(): DataLayer {
  const w = window as unknown as { dataLayer?: DataLayer };
  if (!w.dataLayer) w.dataLayer = [] as unknown as DataLayer;
  return w.dataLayer;
}

/** GTM 을 동의한 경우에만 1회 로드 */
function loadGtm() {
  if (document.getElementById("gtm-script")) return;
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

function grantConsent() {
  const dl = getDataLayer();
  dl.push([
    "consent",
    "update",
    {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    },
  ]);
  loadGtm();
}

function denyConsent() {
  const dl = getDataLayer();
  dl.push([
    "consent",
    "update",
    {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    },
  ]);
}

export default function CookieConsent({ locale, strings }: { locale: string; strings: ConsentStrings }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {
      stored = null;
    }
    if (stored === "granted") {
      grantConsent();
    } else if (stored !== "denied") {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("usepic-open-cookie-settings", onOpen);
    return () => window.removeEventListener("usepic-open-cookie-settings", onOpen);
  }, []);

  const decide = useCallback((granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    } catch {
      /* 저장소를 쓸 수 없어도 배너는 닫는다 */
    }
    if (granted) grantConsent();
    else denyConsent();
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6" role="dialog" aria-modal="false" aria-label={strings.title}>
      <div className="mx-auto w-full max-w-[960px] rounded-[18px] border border-hairline/70 bg-surface/95 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-6">
        <p className="text-[16px] font-semibold text-ink">{strings.title}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          {strings.desc}{" "}
          <Link href={`/${locale}/privacy`} className="text-primary hover:underline">
            {locale === "ko" ? "개인정보 처리방침" : "Privacy Policy"}
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={() => decide(true)} className="btn-primary h-11 px-6 text-[15px]">
            {strings.accept}
          </button>
          <button
            type="button"
            onClick={() => decide(false)}
            className="h-11 rounded-full border border-hairline bg-surface px-6 text-[15px] font-medium text-ink transition-colors hover:border-ink/30"
          >
            {strings.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
