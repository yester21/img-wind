import type { Metadata } from "next";
import Link from "next/link";
import ConvertTool from "./ConvertTool";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { PAIRS, pairCommon, pairFaq, pairTexts, type PairSlug } from "@/lib/i18n/formatPairs";
import { pageMetadata } from "@/lib/seo";

export function formatPairMetadata(locale: Locale, slug: PairSlug): Metadata {
  const t = pairTexts[locale][slug];
  return pageMetadata({ locale, path: `/${slug}`, title: t.seoTitle, description: t.seoDesc });
}

/** 다른 포맷 조합 페이지와 전체 변환 페이지로 가는 내부 링크 (변환 페이지에도 쓴다) */
export function FormatPairLinks({ locale, current }: { locale: Locale; current?: PairSlug }) {
  const c = pairCommon[locale];
  return (
    <nav className="mt-8" aria-label={c.linksTitle}>
      <p className="text-[15px] font-medium text-muted">{c.linksTitle}</p>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {PAIRS.filter((p) => p.slug !== current).map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${locale}/${p.slug}`}
              className="inline-block rounded-full border border-hairline px-3.5 py-1.5 text-[15px] text-ink hover:border-primary hover:text-primary"
            >
              {p.from} → {p.to}
            </Link>
          </li>
        ))}
        {current && (
          <li>
            <Link
              href={`/${locale}/convert`}
              className="inline-block rounded-full border border-hairline px-3.5 py-1.5 text-[15px] text-ink hover:border-primary hover:text-primary"
            >
              {c.allFormats}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default function FormatPairPage({ locale, slug }: { locale: Locale; slug: PairSlug }) {
  const pair = PAIRS.find((p) => p.slug === slug)!;
  const t = pairTexts[locale][slug];
  const c = pairCommon[locale];
  const faq = pairFaq(locale, slug);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <ConvertTool d={getDictionary(locale)} initialFormat={pair.format} title={t.h1} desc={t.desc} />
      <FormatPairLinks locale={locale} current={slug} />

      <section className="mt-20 border-t border-hairline/60 pt-12 break-keep" aria-label={c.whyH2(pair.from, pair.to)}>
        <p className="text-[16px] leading-relaxed text-muted">{t.intro}</p>

        <div className="mt-10">
          <h2 className="text-[24px] font-semibold tracking-tight text-ink">{c.whyH2(pair.from, pair.to)}</h2>
          {t.why.map((p, i) => (
            <p key={i} className="mt-3 text-[16px] leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-[24px] font-semibold tracking-tight text-ink">{c.stepsH2(pair.from, pair.to)}</h2>
          {c.steps(pair.from, pair.to).map((p, i) => (
            <p key={i} className="mt-3 text-[16px] leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-[24px] font-semibold tracking-tight text-ink">{c.faqH2}</h2>
          {faq.map((f, i) => (
            <div key={i} className="mt-6">
              <h3 className="text-[19px] font-semibold text-ink">{f.q}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
