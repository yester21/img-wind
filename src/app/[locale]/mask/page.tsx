import type { Metadata } from "next";
import MaskTool from "@/components/MaskTool";
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
    title: d.maskT.title,
    description: d.maskT.desc,
    alternates: { canonical: `/${locale}/mask`, languages: langAlternates("/mask") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <MaskTool d={getDictionary(locale)} />;
}
