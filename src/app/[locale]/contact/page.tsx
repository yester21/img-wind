import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { contactContent } from "@/lib/i18n/contact";
import type { Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = contactContent[(locale as Locale) in contactContent ? (locale as Locale) : "ko"];
  return pageMetadata({ locale: locale as Locale, path: "/contact", title: t.kicker, description: t.sub });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = (locale in contactContent ? locale : "ko") as Locale;
  const t = contactContent[l];

  return (
    <div className="break-keep">
      <section className="pt-4 pb-10 text-center">
        <p className="text-[14px] font-medium text-primary">{t.kicker}</p>
        <h1 className="mt-2 text-[34px] sm:text-[40px] font-semibold tracking-tight text-ink">{t.title}</h1>
        <p className="mt-3 text-[20px] leading-relaxed text-muted max-w-2xl mx-auto break-keep text-balance">{t.sub}</p>
      </section>
      <div className="mx-auto max-w-2xl">
        <ContactForm t={t} locale={l} />
        <p className="mt-5 text-center text-[14px] text-muted">
          {t.faqText}{" "}
          <a href={`/${l}/about#faq`} className="text-primary hover:underline">
            {t.faqLink}
          </a>
        </p>
      </div>
    </div>
  );
}
