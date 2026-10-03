import type { Metadata } from "next";
import ResizeTool from "@/components/ResizeTool";
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
    title: d.resize.title,
    description: d.resize.desc,
    alternates: { canonical: `/${locale}/resize`, languages: langAlternates("/resize") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ResizeTool d={getDictionary(locale)} />;
}
