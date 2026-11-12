import type { Metadata } from "next";
import WatermarkTool from "@/components/WatermarkTool";
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
    path: "/watermark",
    ...seoMetadataText(locale as Locale, "wm", d.wm),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  return (
    <>
      <WatermarkTool d={getDictionary(l)} />
      <ToolSeoContent locale={l} toolKey="wm" />
    </>
  );
}
