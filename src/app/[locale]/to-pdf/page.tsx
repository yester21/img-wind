import type { Metadata } from "next";
import ToPdfTool from "@/components/ToPdfTool";
import { langAlternates, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { seoMetadataText } from "@/lib/i18n/seoMeta";
import { getDictionary } from "@/lib/i18n";
import ToolSeoContent from "@/components/ToolSeoContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({
    locale: locale as Locale,
    path: "/to-pdf",
    ...seoMetadataText(locale as Locale, "topdf", d.topdf),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  return (
    <>
      <ToPdfTool d={getDictionary(l)} />
      <ToolSeoContent locale={l} toolKey="topdf" />
    </>
  );
}
