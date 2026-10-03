import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://imgtools.seos.kr";
const PATHS = [
  "",
  "/all-in-one",
  "/compress",
  "/convert",
  "/resize",
  "/to-pdf",
  "/pdf-to-image",
  "/crop",
  "/watermark",
  "/mask",
  "/bg-remove",
  "/ocr",
  "/favicon",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])),
          "x-default": `${BASE}/ko${path}`,
        },
      },
    })),
  );
}
