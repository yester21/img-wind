import type { Metadata } from "next";
import FormatPairPage, { formatPairMetadata } from "@/components/FormatPairPage";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return formatPairMetadata(locale as Locale, "jpg-to-webp");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <FormatPairPage locale={locale as Locale} slug="jpg-to-webp" />;
}
