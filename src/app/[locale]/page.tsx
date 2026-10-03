import type { Metadata } from "next";
import Link from "next/link";
import { langAlternates, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { TOOL_ACCENTS, TOOL_ICONS } from "@/components/toolIcons";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const d = getDictionary(l);

  const BASIC = [
    { href: "/all-in-one", t: d.home.cards.allin, star: true },
    { href: "/compress", t: d.home.cards.compress },
    { href: "/convert", t: d.home.cards.convert },
    { href: "/resize", t: d.home.cards.resize },
  ];

  const MORE = [
    { href: "/to-pdf", t: { title: d.topdf.title, desc: d.topdf.desc } },
    { href: "/pdf-to-image", t: { title: d.pdfimg.title, desc: d.pdfimg.desc } },
    { href: "/crop", t: { title: d.crop.title, desc: d.crop.desc } },
    { href: "/watermark", t: { title: d.wm.title, desc: d.wm.desc } },
    { href: "/mask", t: { title: d.maskT.title, desc: d.maskT.desc } },
    { href: "/bg-remove", t: { title: d.bg.title, desc: d.bg.desc } },
    { href: "/ocr", t: { title: d.ocr.title, desc: d.ocr.desc } },
    { href: "/favicon", t: { title: d.fav.title, desc: d.fav.desc } },
  ];

  const card = (tool: {
    href: string;
    t: { title: string; desc: string };
    star?: boolean;
  }) => (
    <Link
      key={tool.href}
      href={`/${l}${tool.href}`}
      className={`card p-6 flex flex-col transition-colors group border ${
        tool.star
          ? "border-primary/60 bg-primary/[0.03] hover:border-primary"
          : "border-transparent hover:border-primary"
      }`}
    >
      <span
        className="inline-flex items-center justify-center w-11 h-11 rounded-[12px] mb-4"
        style={{ backgroundColor: `${TOOL_ACCENTS[tool.href]}1a`, color: TOOL_ACCENTS[tool.href] }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {TOOL_ICONS[tool.href]}
        </svg>
      </span>
      <h2 className="text-[21px] font-semibold text-ink">{tool.t.title}</h2>
      <p className="mt-1.5 text-[16px] leading-relaxed text-muted flex-1">{tool.t.desc}</p>
      <span className="mt-4 text-[16px] font-medium text-primary inline-flex items-center gap-1">
        {d.home.start}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );

  return (
    <div>
      <section className="text-center pt-6 pb-12">
        <h1 className="text-[50px] leading-tight font-semibold tracking-tight text-ink">
          {d.home.hero1}
          <br />
          {d.home.hero2}
        </h1>
        <p className="mt-4 text-[21px] text-muted max-w-md mx-auto leading-relaxed">
          {d.home.sub}
        </p>
      </section>

      <section>
        <h2 className="text-[25px] font-semibold text-ink mb-4">{d.home.basicTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2">{BASIC.map(card)}</div>
      </section>

      <section className="mt-10">
        <h2 className="text-[25px] font-semibold text-ink mb-4">{d.home.moreTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2">{MORE.map(card)}</div>
      </section>

      <section className="mt-12 card px-6 py-5 flex flex-wrap gap-x-8 gap-y-3 justify-center text-[16px] text-muted">
        {d.home.features.map((f) => (
          <span key={f}>{f}</span>
        ))}
      </section>
    </div>
  );
}
