import type { Metadata } from "next";
import CropTool from "@/components/CropTool";
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
    title: d.crop.title,
    description: d.crop.desc,
    alternates: { canonical: `/${locale}/crop`, languages: langAlternates("/crop") },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CropTool d={getDictionary(locale)} />;
}
