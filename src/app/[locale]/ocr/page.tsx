import type { Metadata } from "next";
import OcrTool from "@/components/OcrTool";
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
    title: d.ocr.title,
    description: d.ocr.desc,
    alternates: { canonical: `/${locale}/ocr`, languages: langAlternates("/ocr") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OcrTool d={getDictionary(locale)} />;
}
