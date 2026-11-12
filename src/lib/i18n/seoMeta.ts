import type { Locale } from "./config";

/**
 * 검색 결과용 제목·설명. 화면의 도구 이름(사전 title/desc)과 분리해 실제 검색어에 맞춘다.
 * 키워드 근거: 구글·네이버 자동완성 (2026-11, "사진 용량 줄이기", "webp jpg 변환", "누끼 따기" 등).
 * 항목이 없는 언어·페이지는 사전의 title/desc 를 그대로 쓴다.
 * 홈(home)은 브랜드까지 포함한 전체 제목, 나머지는 레이아웃 템플릿이 " | 유즈픽"을 붙인다.
 */
export type SeoPage =
  | "home"
  | "allin"
  | "compress"
  | "convert"
  | "resize"
  | "topdf"
  | "pdfimg"
  | "crop"
  | "wm"
  | "mask"
  | "bg"
  | "ocr"
  | "fav"
  | "privacy";

type SeoText = { title: string; desc: string };

const seoMeta: Partial<Record<Locale, Partial<Record<SeoPage, SeoText>>>> = {
  ko: {
    home: {
      title: "무료 이미지 변환·압축·크기 조절 사이트 | 유즈픽",
      desc: "WebP·JPG·PNG·HEIC 변환, 사진 용량 줄이기, 크기 조절, 배경 제거까지 12가지 이미지 도구를 무료로. 업로드 없이 브라우저에서 바로 처리해요.",
    },
    convert: {
      title: "WebP JPG PNG 변환 - 무료 이미지 변환기",
      desc: "WebP를 JPG로, JPG·PNG를 WebP로, 아이폰 HEIC 사진을 JPG로 무료 변환. 여러 장을 한 번에 바꾸고 ZIP으로 받으세요.",
    },
    compress: {
      title: "사진 용량 줄이기 - 이미지 압축 무료",
      desc: "화질은 그대로, 사진 용량만 무료로 줄여요. 50KB·500KB처럼 목표 용량 지정, JPG·PNG·WebP 여러 장 일괄 압축.",
    },
    resize: {
      title: "사진 크기 줄이기·이미지 크기 조절",
      desc: "픽셀·비율로 사진 크기를 줄이고 이미지 사이즈를 조절하세요. 비율 유지, 여러 장 일괄 조절, 유튜브·인스타 규격 프리셋 지원.",
    },
    allin: {
      title: "이미지 압축·변환·크기 조절 한 번에",
      desc: "용량 줄이기, WebP·JPG 변환, 사이즈 조절을 한 번에 적용하는 무료 이미지 일괄 처리 도구. 여러 장도 한 번에.",
    },
    topdf: {
      title: "JPG PDF 변환 - 사진 여러 장 PDF로 합치기",
      desc: "JPG·PNG 사진 여러 장을 순서대로 하나의 PDF로 무료 변환. A4 맞춤·여백 설정으로 증명서·서류 제출용으로 간편하게.",
    },
    pdfimg: {
      title: "PDF JPG 변환 - PDF를 이미지로 무료 변환",
      desc: "PDF 각 페이지를 고화질 JPG·PNG 이미지로 무료 변환하고 ZIP으로 한 번에 받으세요. 프로그램 설치 없이 바로.",
    },
    crop: {
      title: "사진 자르기·회전 - 이미지 자르기 무료",
      desc: "원하는 영역만 사진을 자르고 90° 회전·좌우 반전까지. 격자·중앙 가이드로 정확하게, 여러 장 일괄 적용.",
    },
    wm: {
      title: "사진 워터마크 넣기 - 무료 일괄 삽입",
      desc: "텍스트나 로고로 사진에 워터마크를 무료로 넣으세요. 위치·크기·투명도 조절, 여러 장 한 번에 일괄 삽입.",
    },
    mask: {
      title: "사진 모자이크·블러 처리 사이트",
      desc: "얼굴·차량 번호·주소 등 개인정보를 모자이크나 블러로 가리세요. 여러 영역 지정, 무료, 사진이 서버로 전송되지 않아 안전해요.",
    },
    bg: {
      title: "배경 제거·누끼 따기 무료 - AI 배경 지우기",
      desc: "AI가 사진 배경을 자동으로 지우고 투명 배경 PNG로 만들어요. 누끼 따기를 무료로, 회원가입·업로드 없이.",
    },
    ocr: {
      title: "이미지 텍스트 추출 - 사진 글자 추출 무료",
      desc: "사진·스크린샷 속 글자를 텍스트로 추출해 바로 복사하세요. 한국어·영어·일본어 OCR, 무료, 업로드 없이.",
    },
    fav: {
      title: "파비콘 만들기 - ICO 파비콘 생성기 무료",
      desc: "이미지 한 장으로 favicon.ico와 16~512px PNG, 애플 터치 아이콘까지 파비콘 세트를 무료로 만들어 ZIP으로 받으세요.",
    },
    privacy: {
      title: "개인정보처리방침",
      desc: "유즈픽의 개인정보 처리 방식 안내. 이미지는 서버로 전송되지 않으며, 쿠키·분석 도구 사용 범위를 설명합니다.",
    },
  },
};

export function seoFor(locale: Locale, page: SeoPage, fallback: SeoText): SeoText {
  return seoMeta[locale]?.[page] ?? fallback;
}

/** pageMetadata 의 title/description 인자로 펼쳐 쓰는 형태 */
export function seoMetadataText(locale: Locale, page: SeoPage, dict: SeoText): { title: string; description: string } {
  const t = seoFor(locale, page, dict);
  return { title: t.title, description: t.desc };
}
