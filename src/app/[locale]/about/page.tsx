import type { Metadata } from "next";
import Link from "next/link";
import { langAlternates, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { aboutContent } from "@/lib/i18n/about";
import { pageMetadata } from "@/lib/seo";
import { TOOL_ACCENTS, TOOL_ICONS } from "@/components/toolIcons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale in aboutContent ? locale : "ko") as Locale;
  const c = aboutContent[l];
  const d = getDictionary(l);
  return pageMetadata({ locale: l, path: "/about", title: d.navAbout, description: c.sub });
}

const TOOL_HREFS = [
  "/all-in-one",
  "/compress",
  "/convert",
  "/resize",
  "/to-pdf",
  "/pdf-to-image",
  "/crop",
  "/watermark",
  "/mask",
  "/bg-remove",
  "/ocr",
  "/favicon",
];

const FEATURE_ICONS = [
  <path key="a" d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3zM9 12l2 2 4-4" />,
  <path key="b" d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
  <path key="c" d="M4 7h16v13H4zM8 7V4h8v3M9 13h6M9 17h4" />,
  <path key="d" d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 15l1 2.5L22.5 19 20 20l-1 2.5L18 20l-2.5-1L18 17.5 19 15z" />,
  <path key="e" d="M13 2 4.5 12.5H11L9.5 22 19 10h-6.5L13 2z" />,
  <path
    key="f"
    d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"
  />,
];
const FEATURE_ACCENTS = ["#34c759", "#0071e3", "#ff9500", "#5856d6", "#0a84ff", "#30b0c7"];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = (locale in aboutContent ? locale : "ko") as Locale;
  const c = aboutContent[l];
  const d = getDictionary(l);
  const toolMeta: Record<string, { title: string; desc: string }> = {
    "/all-in-one": d.allin,
    "/compress": d.compress,
    "/convert": d.convert,
    "/resize": d.resize,
    "/to-pdf": d.topdf,
    "/pdf-to-image": d.pdfimg,
    "/crop": d.crop,
    "/watermark": d.wm,
    "/mask": d.maskT,
    "/bg-remove": d.bg,
    "/ocr": d.ocr,
    "/favicon": d.fav,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="pb-6 break-keep">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {/* HERO */}
      <section className="text-center pt-4 pb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline/70 bg-surface px-3.5 h-8 text-[14px] font-medium text-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          {c.badge}
        </span>
        <h1 className="mt-5 text-[40px] sm:text-[50px] leading-[1.1] font-semibold tracking-tight text-ink max-w-3xl mx-auto">
          {c.h1a}
          <br />
          {c.h1b}
        </h1>
        <p className="mt-5 text-[20px] leading-relaxed text-muted max-w-xl mx-auto">{c.sub}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${l}/all-in-one`} className="btn-primary h-12 px-7 text-[16px]">
            {c.cta1}
          </Link>
          <a href="#features" className="btn-secondary h-12 px-7 text-[16px]">
            {c.cta2}
          </a>
        </div>
        <p className="mt-4 text-[14px] text-muted">{c.trust}</p>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {c.stats.map((s) => (
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
              <p className="text-[14px] font-medium text-primary">{c.privacyKicker}</p>
              <h2 className="mt-2 text-[25px] font-semibold tracking-tight text-ink">{c.privacyTitle}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{c.privacyDesc}</p>
              <ul className="mt-5 space-y-2.5">
                {c.bullets.map((t) => (
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
              {c.flow.map((t, i) => (
                <li key={t} className="flex items-center gap-4 rounded-[14px] bg-surface border border-hairline/60 px-4 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[16px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="block text-[16px] font-medium text-ink">{t}</span>
                </li>
              ))}
              <li className="px-2 pt-1 text-[14px] text-muted">{c.note}</li>
            </ol>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mt-20 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-[25px] font-semibold tracking-tight text-ink">{c.featuresTitle}</h2>
          <p className="mt-2 text-[16px] text-muted">{c.featuresDesc}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.features.map((f, i) => (
            <div key={f.t} className="card border border-hairline/60 p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[12px]"
                style={{ backgroundColor: `${FEATURE_ACCENTS[i]}1a`, color: FEATURE_ACCENTS[i] }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {FEATURE_ICONS[i]}
                </svg>
              </span>
              <h3 className="mt-4 text-[20px] font-semibold text-ink">{f.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="mt-20 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[25px] font-semibold tracking-tight text-ink">{c.toolsTitle}</h2>
            <p className="mt-2 text-[16px] text-muted">{c.toolsDesc}</p>
          </div>
          <Link href={`/${l}`} className="text-[16px] font-medium text-primary inline-flex items-center gap-1 hover:underline">
            {c.toolsMore}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_HREFS.map((href) => (
            <Link
              key={href}
              href={`/${l}${href}`}
              className="card border border-hairline/60 px-4 py-3.5 flex items-center gap-3 transition-colors hover:border-primary"
            >
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: `${TOOL_ACCENTS[href]}1a`, color: TOOL_ACCENTS[href] }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {TOOL_ICONS[href]}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[16px] font-medium text-ink truncate">{toolMeta[href].title}</span>
                <span className="block text-[14px] text-muted truncate">{toolMeta[href].desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mt-20 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-[25px] font-semibold tracking-tight text-ink">{c.howTitle}</h2>
          <p className="mt-2 text-[16px] text-muted">{c.howDesc}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {c.steps.map((s, i) => (
            <div key={s.t} className="card border border-hairline/60 p-6">
              <span className="text-[40px] leading-none font-semibold tracking-tight text-primary/25">0{i + 1}</span>
              <h3 className="mt-3 text-[20px] font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-20 scroll-mt-24">
        <h2 className="text-[25px] font-semibold tracking-tight text-ink">{c.faqTitle}</h2>
        <div className="mt-5 card border border-hairline/60 divide-y divide-hairline/60">
          {c.faqs.map((f) => (
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
          <h2 className="text-[25px] font-semibold tracking-tight text-ink">{c.ctaTitle}</h2>
          <p className="mt-2 text-[16px] text-muted">{c.ctaDesc}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${l}/all-in-one`} className="btn-primary h-12 px-7 text-[16px]">
              {c.cta1}
            </Link>
            <Link href={`/${l}`} className="btn-secondary h-12 px-7 text-[16px]">
              {c.cta2}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
