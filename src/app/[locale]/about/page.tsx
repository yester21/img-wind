import type { Metadata } from "next";
import Link from "next/link";
import { langAlternates, type Locale } from "@/lib/i18n/config";
import { TOOL_ACCENTS, TOOL_ICONS } from "@/components/toolIcons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "서비스 소개",
    description:
      "유스픽은 12가지 이미지 도구를 브라우저에서 바로 제공하는 무료 서비스입니다. 파일은 서버로 전송되지 않고 내 컴퓨터에서만 처리됩니다.",
    alternates: { canonical: `/${locale}/about`, languages: langAlternates("/about") },
  };
}

const TOOLS = [
  { href: "/all-in-one", title: "올인원 처리", desc: "포맷·압축·리사이즈를 한 번에" },
  { href: "/compress", title: "이미지 압축", desc: "화질은 지키고 용량은 줄이기" },
  { href: "/convert", title: "포맷 전환", desc: "JPEG · PNG · WebP · AVIF" },
  { href: "/resize", title: "사이즈 조정", desc: "비율 · 프리셋 · 커버 크롭" },
  { href: "/to-pdf", title: "이미지 → PDF", desc: "여러 장을 하나의 PDF로" },
  { href: "/pdf-to-image", title: "PDF → 이미지", desc: "페이지별 PNG · JPEG 저장" },
  { href: "/crop", title: "자르기 · 회전", desc: "드래그 크롭과 90° 회전" },
  { href: "/watermark", title: "워터마크", desc: "텍스트 · 로고 · 투명도" },
  { href: "/mask", title: "블러 · 픽셀화", desc: "영역을 드래그해 가리기" },
  { href: "/bg-remove", title: "배경 제거", desc: "AI로 투명 PNG 만들기" },
  { href: "/ocr", title: "이미지 → 텍스트", desc: "한 · 영 · 일 문자 인식" },
  { href: "/favicon", title: "파비콘 생성기", desc: "16~512px 세트 + ICO" },
];

const FEATURES = [
  {
    title: "서버로 전송되지 않습니다",
    desc: "모든 처리는 브라우저 안에서 이뤄집니다. 업로드가 없으니 사내 문서·개인 사진도 안심하고 다룰 수 있습니다.",
    icon: (
      <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3zM9 12l2 2 4-4" />
    ),
    accent: "#34c759",
  },
  {
    title: "12가지 도구를 한곳에서",
    desc: "압축·변환·리사이즈부터 PDF·워터마크·배경 제거·OCR까지, 이미지 작업에 필요한 기능을 한 사이트에 모았습니다.",
    icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
    accent: "#0071e3",
  },
  {
    title: "최대 100장 일괄 처리",
    desc: "여러 파일을 한 번에 끌어다 놓고 옵션 한 번으로 처리합니다. 결과는 개별 저장하거나 ZIP으로 묶어 받으세요.",
    icon: <path d="M4 7h16v13H4zM8 7V4h8v3M9 13h6M9 17h4" />,
    accent: "#ff9500",
  },
  {
    title: "AI 기능도 브라우저에서",
    desc: "배경 제거(u2netp)와 OCR(tesseract)도 기기에서 직접 실행됩니다. 모델은 첫 실행에만 내려받습니다.",
    icon: <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 15l1 2.5L22.5 19 20 20l-1 2.5L18 20l-2.5-1L18 17.5 19 15z" />,
    accent: "#5856d6",
  },
  {
    title: "멈추지 않는 처리 속도",
    desc: "웹 워커와 OffscreenCanvas로 처리해 화면이 멈추지 않습니다. 대량 작업 중에도 다른 탭 작업이 가능합니다.",
    icon: <path d="M13 2 4.5 12.5H11L9.5 22 19 10h-6.5L13 2z" />,
    accent: "#0a84ff",
  },
  {
    title: "8개 언어 지원",
    desc: "한국어·English·日本語·简体中文·繁體中文·Bahasa Indonesia·ไทย·Русский를 지원합니다.",
    icon: (
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    ),
    accent: "#30b0c7",
  },
];

const STEPS = [
  { n: "01", title: "파일 선택", desc: "드래그앤드롭 또는 파일 선택. 최대 100장, 파일당 50MB까지." },
  { n: "02", title: "옵션 설정", desc: "포맷·품질·크기를 고르고 실행하면 브라우저에서 바로 처리됩니다." },
  { n: "03", title: "저장", desc: "개별 다운로드하거나 ZIP으로 한 번에 받으세요. 원본은 그대로입니다." },
];

const FAQS = [
  {
    q: "파일이 서버로 전송되나요?",
    a: "아니요. 모든 처리는 사용자의 브라우저에서 이뤄지고 파일은 서버로 전송되지 않습니다. 네트워크를 끊어도 처리할 수 있습니다.",
  },
  {
    q: "회원가입이나 결제가 필요한가요?",
    a: "아니요. 유스픽의 모든 도구는 회원가입 없이 무료로 사용할 수 있습니다.",
  },
  {
    q: "어떤 파일을 지원하나요?",
    a: "JPEG · PNG · WebP · GIF · BMP · HEIC · AVIF 이미지와 PDF를 지원합니다. TIFF와 SVG는 브라우저에서 읽을 수 없어 지원하지 않습니다.",
  },
  {
    q: "대량 처리도 가능한가요?",
    a: "가능합니다. 한 번에 최대 100장까지 처리하고 결과를 ZIP으로 묶어 받을 수 있습니다.",
  },
  {
    q: "화질은 얼마나 유지되나요?",
    a: "품질 값을 직접 지정하거나 목표 용량을 정할 수 있습니다. PNG는 무손실이며, JPEG · WebP · AVIF는 설정한 품질로 재인코딩됩니다.",
  },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;

  return (
    <div className="pb-6 break-keep">
      {/* HERO */}
      <section className="text-center pt-4 pb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline/70 bg-surface px-3.5 h-8 text-[14px] font-medium text-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          브라우저에서만 처리 · 서버 전송 없음
        </span>
        <h1 className="mt-5 text-[50px] leading-[1.1] font-semibold tracking-tight text-ink max-w-3xl mx-auto">
          이미지 작업, 이제
          <br />
          브라우저에서 끝내세요
        </h1>
        <p className="mt-5 text-[20px] leading-relaxed text-muted max-w-xl mx-auto">
          유스픽은 압축·변환·리사이즈부터 PDF·워터마크·배경 제거·OCR까지 12가지 이미지
          도구를 제공합니다. 설치도, 회원가입도, 파일 업로드도 없습니다.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${l}/all-in-one`} className="btn-primary h-12 px-7 text-[16px]">
            무료로 시작하기
          </Link>
          <a href="#features" className="btn-secondary h-12 px-7 text-[16px]">
            기능 살펴보기
          </a>
        </div>
        <p className="mt-4 text-[14px] text-muted">회원가입 없이 · 설치 없이 · 무료</p>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { n: "12", label: "이미지 도구" },
          { n: "8", label: "지원 언어" },
          { n: "100", label: "장 일괄 처리" },
          { n: "0", label: "서버 업로드" },
        ].map((s) => (
          <div key={s.label} className="card border border-hairline/60 px-5 py-6 text-center">
            <div className="text-[40px] leading-none font-semibold tracking-tight text-ink">{s.n}</div>
            <div className="mt-2 text-[14px] text-muted">{s.label}</div>
          </div>
        ))}
      </section>

      {/* PRIVACY */}
      <section className="mt-20">
        <div className="card border border-hairline/60 p-7 sm:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-[14px] font-medium text-primary">프라이버시 우선</p>
              <h2 className="mt-2 text-[25px] font-semibold tracking-tight text-ink">
                파일은 당신의 브라우저를 떠나지 않습니다
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">
                서버가 없는 구조라 업로드·전송·보관이 일어나지 않습니다. 민감한 문서나
                사내 이미지도 외부로 나가지 않습니다.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "파일 서버 전송 · 저장 없음",
                  "웹 워커 기반 병렬 처리",
                  "원본 파일 변경 없음",
                  "처리 결과 즉시 다운로드",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[16px] text-ink">
                    <svg className="mt-0.5 shrink-0 text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <ol className="space-y-3 rounded-[18px] bg-fog/70 p-5">
              {[
                { k: "1", t: "파일 선택", d: "내 컴퓨터에서 브라우저 메모리로" },
                { k: "2", t: "브라우저에서 처리", d: "워커가 캔버스로 인코딩" },
                { k: "3", t: "다운로드", d: "결과 파일을 내려받기" },
              ].map((s) => (
                <li key={s.k} className="flex items-center gap-4 rounded-[14px] bg-surface border border-hairline/60 px-4 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[16px] font-semibold text-primary">
                    {s.k}
                  </span>
                  <span>
                    <span className="block text-[16px] font-medium text-ink">{s.t}</span>
                    <span className="block text-[14px] text-muted">{s.d}</span>
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-2 px-2 pt-1 text-[14px] text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                어느 단계에서도 서버를 거치지 않습니다
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mt-20 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-[25px] font-semibold tracking-tight text-ink">유스픽이 다른 점</h2>
          <p className="mt-2 text-[16px] text-muted">업로드 없는 처리, 한곳에 모인 도구, 멈추지 않는 속도.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card border border-hairline/60 p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[12px]"
                style={{ backgroundColor: `${f.accent}1a`, color: f.accent }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-4 text-[20px] font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="mt-20 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[25px] font-semibold tracking-tight text-ink">12가지 이미지 도구</h2>
            <p className="mt-2 text-[16px] text-muted">필요한 도구를 골라 바로 사용하세요.</p>
          </div>
          <Link href={`/${l}`} className="text-[16px] font-medium text-primary inline-flex items-center gap-1 hover:underline">
            홈에서 전체 보기
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={`/${l}${t.href}`}
              className="card border border-hairline/60 px-4 py-3.5 flex items-center gap-3 transition-colors hover:border-primary group"
            >
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: `${TOOL_ACCENTS[t.href]}1a`, color: TOOL_ACCENTS[t.href] }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {TOOL_ICONS[t.href]}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[16px] font-medium text-ink truncate">{t.title}</span>
                <span className="block text-[14px] text-muted truncate">{t.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mt-20 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-[25px] font-semibold tracking-tight text-ink">사용 방법</h2>
          <p className="mt-2 text-[16px] text-muted">세 단계면 끝납니다.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card border border-hairline/60 p-6">
              <span className="text-[40px] leading-none font-semibold tracking-tight text-primary/25">{s.n}</span>
              <h3 className="mt-3 text-[20px] font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-20 scroll-mt-24">
        <h2 className="text-[25px] font-semibold tracking-tight text-ink">자주 묻는 질문</h2>
        <div className="mt-5 card border border-hairline/60 divide-y divide-hairline/60">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-6 py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[16px] font-medium text-ink list-none [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition-transform group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20">
        <div className="card border border-primary/25 bg-primary/[0.03] px-7 py-12 text-center">
          <h2 className="text-[25px] font-semibold tracking-tight text-ink">지금 바로 시작해 보세요</h2>
          <p className="mt-2 text-[16px] text-muted">업로드 없이, 설치 없이, 무료로.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${l}/all-in-one`} className="btn-primary h-12 px-7 text-[16px]">
              올인원 도구 열기
            </Link>
            <Link href={`/${l}`} className="btn-secondary h-12 px-7 text-[16px]">
              전체 도구 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
