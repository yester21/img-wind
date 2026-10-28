import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://imgtools.seos.kr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // 블로그(워드프레스, Worker 프록시)의 Yoast 사이트맵도 함께 알린다
    sitemap: [`${BASE}/sitemap.xml`, `${BASE}/sitemap_index.xml`],
  };
}
