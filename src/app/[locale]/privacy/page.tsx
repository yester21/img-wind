import type { Metadata } from "next";
import { langAlternates, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { privacyContent } from "@/lib/i18n/privacy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const p = privacyContent[(locale as Locale) in privacyContent ? (locale as Locale) : "ko"];
  return pageMetadata({ locale: locale as Locale, path: "/privacy", title: p.title, description: p.kicker });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = (locale in privacyContent ? locale : "ko") as Locale;
  const p = privacyContent[l];

  return (
    <div className="break-keep">
      <section className="pt-4 pb-8">
        <p className="text-[14px] font-medium text-primary">{p.kicker}</p>
        <h1 className="mt-2 text-[40px] font-semibold tracking-tight text-ink">{p.title}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">{p.updated}</p>
      </section>
      <div className="space-y-8">
        {p.sections.map((s) => (
          <section key={s.t}>
            <h2 className="text-[20px] font-semibold text-ink">{s.t}</h2>
            <div className="mt-2 space-y-2">
              {s.b.map((body) => (
                <p key={body} className="text-[16px] leading-relaxed text-muted">
                  {body}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-[14px] text-muted">
        {p.contactNote}{" "}
        <a href={`/${l}/contact`} className="text-primary hover:underline">
          {p.contactLabel}
        </a>
      </p>
    </div>
  );
}
