import type { Metadata } from "next";
import PdfToImageTool from "@/components/PdfToImageTool";
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
    title: d.pdfimg.title,
    description: d.pdfimg.desc,
    alternates: { canonical: `/${locale}/pdf-to-image`, languages: langAlternates("/pdf-to-image") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PdfToImageTool d={getDictionary(locale)} />;
}
