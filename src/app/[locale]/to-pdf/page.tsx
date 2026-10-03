import type { Metadata } from "next";
import ToPdfTool from "@/components/ToPdfTool";
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
    title: d.topdf.title,
    description: d.topdf.desc,
    alternates: { canonical: `/${locale}/to-pdf`, languages: langAlternates("/to-pdf") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ToPdfTool d={getDictionary(locale)} />;
}
