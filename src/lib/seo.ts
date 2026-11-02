import type { Metadata } from "next";
import { langAlternates, type Locale } from "./i18n/config";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://usepic.net";

export const OG_IMAGE = {
  ko: "/og/og-ko.png",
  en: "/og/og-en.png",
} as const;

export function ogImageFor(locale: Locale): string {
  return locale === "ko" ? OG_IMAGE.ko : OG_IMAGE.en;
}

export function brandName(locale: Locale): string {
  return locale === "ko" ? "유스픽" : "UsePic";
}

const OG_LOCALES: Partial<Record<Locale, string>> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
  "zh-TW": "zh_TW",
  id: "id_ID",
  th: "th_TH",
  ru: "ru_RU",
};

/**
 * 페이지 공통 SEO 메타데이터 생성기.
 * title/description + canonical + hreflang(8개 언어) + OpenGraph/Twitter 카드까지 한 번에 만든다.
 */
export function pageMetadata(opts: {
  locale: Locale;
  /** 로케일 뒤 경로. 홈은 "" */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const { locale, path, title, description, type = "website" } = opts;
  const url = `${BASE}/${locale}${path}`;
  const image = ogImageFor(locale);
  const siteName = brandName(locale);

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: langAlternates(path),
    },
    openGraph: {
      type,
      url,
      siteName,
      title,
      description,
      locale: OG_LOCALES[locale] ?? "ko_KR",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
