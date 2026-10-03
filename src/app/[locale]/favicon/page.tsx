import type { Metadata } from "next";
import FaviconTool from "@/components/FaviconTool";
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
    title: d.fav.title,
    description: d.fav.desc,
    alternates: { canonical: `/${locale}/favicon`, languages: langAlternates("/favicon") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <FaviconTool d={getDictionary(locale)} />;
}
