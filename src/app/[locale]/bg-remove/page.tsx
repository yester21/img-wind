import type { Metadata } from "next";
import BgRemoveTool from "@/components/BgRemoveTool";
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
    title: d.bg.title,
    description: d.bg.desc,
    alternates: { canonical: `/${locale}/bg-remove`, languages: langAlternates("/bg-remove") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <BgRemoveTool d={getDictionary(locale)} />;
}
