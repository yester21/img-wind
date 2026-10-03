import type { Metadata } from "next";
import ConvertTool from "@/components/ConvertTool";
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
    title: d.convert.title,
    description: d.convert.desc,
    alternates: { canonical: `/${locale}/convert`, languages: langAlternates("/convert") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ConvertTool d={getDictionary(locale)} />;
}
