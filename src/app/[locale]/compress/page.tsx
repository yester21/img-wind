import type { Metadata } from "next";
import CompressTool from "@/components/CompressTool";
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
    title: d.compress.title,
    description: d.compress.desc,
    alternates: { canonical: `/${locale}/compress`, languages: langAlternates("/compress") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CompressTool d={getDictionary(locale)} />;
}
