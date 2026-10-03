import type { Metadata } from "next";
import AllInOneTool from "@/components/AllInOneTool";
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
    title: d.allin.title,
    description: d.allin.desc,
    alternates: { canonical: `/${locale}/all-in-one`, languages: langAlternates("/all-in-one") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AllInOneTool d={getDictionary(locale)} />;
}
