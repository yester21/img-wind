import type { Metadata } from "next";
import AllInOneTool from "@/components/AllInOneTool";
import { langAlternates, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({
    locale: locale as Locale,
    path: "/all-in-one",
    title: d.allin.title,
    description: d.allin.desc,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AllInOneTool d={getDictionary(locale)} />;
}
