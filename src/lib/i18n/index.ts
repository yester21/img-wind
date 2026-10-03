import { isLocale, type Locale } from "./config";
import ko, { type Dict } from "./dictionaries/ko";
import en from "./dictionaries/en";
import ja from "./dictionaries/ja";
import zh from "./dictionaries/zh";
import zhTW from "./dictionaries/zh-TW";
import id from "./dictionaries/id";
import th from "./dictionaries/th";
import ru from "./dictionaries/ru";

const dictionaries: Record<Locale, Dict> = { ko, en, ja, zh, "zh-TW": zhTW, id, th, ru };

export function getDictionary(locale: string): Dict {
  return isLocale(locale) ? dictionaries[locale] : dictionaries.ko;
}

/** "{n}장 처리하기" 같은 템플릿 문자열의 {변수} 치환 */
export function fmt(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}
