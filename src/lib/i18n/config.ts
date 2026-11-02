export const locales = [
  "ko",
  "en",
  "ja",
  "zh",
  "zh-TW",
  "id",
  "th",
  "ru",
] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "简体中文",
  "zh-TW": "繁體中文",
  id: "Bahasa Indonesia",
  th: "ไทย",
  ru: "Русский",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * hreflang alternates. x-default는 기본 언어(ko) 페이지를 가리킨다.
 * path는 "/compress" 형식 (홈은 "").
 */
export function langAlternates(path = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of locales) out[l] = `/${l}${path}`;
  out["x-default"] = `/${defaultLocale}${path}`;
  return out;
}
