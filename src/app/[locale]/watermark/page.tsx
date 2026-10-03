import type { Metadata } from "next";
import WatermarkTool from "@/components/WatermarkTool";
import { langAlternates } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return {
    title: d.wm.title,
    description: d.wm.desc,
    alternates: { canonical: `/${locale}/watermark`, languages: langAlternates("/watermark") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <WatermarkTool d={getDictionary(locale)} />;
}
