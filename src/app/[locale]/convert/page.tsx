import type { Metadata } from "next";
import ConvertTool from "@/components/ConvertTool";
import { langAlternates, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { seoMetadataText } from "@/lib/i18n/seoMeta";
import { getDictionary } from "@/lib/i18n";
import ToolSeoContent from "@/components/ToolSeoContent";
import { FormatPairLinks } from "@/components/FormatPairPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({
    locale: locale as Locale,
    path: "/convert",
    ...seoMetadataText(locale as Locale, "convert", d.convert),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  return (
    <>
      <ConvertTool d={getDictionary(l)} />
      <FormatPairLinks locale={l} />
      <ToolSeoContent locale={l} toolKey="convert" />
    </>
  );
}
