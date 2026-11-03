"use client";

import { useEffect, useState } from "react";

const COPY: Record<string, { title: string; desc: string; home: string; blog: string }> = {
  ko: { title: "페이지를 찾을 수 없어요", desc: "주소가 바뀌었거나 삭제된 페이지입니다.", home: "홈으로", blog: "블로그" },
  en: { title: "This page could not be found", desc: "The link may be broken or the page may have moved.", home: "Back to home", blog: "Blog" },
  ja: { title: "ページが見つかりません", desc: "リンクが切れているか、ページが移動した可能性があります。", home: "ホームへ", blog: "ブログ" },
  zh: { title: "找不到此页面", desc: "链接可能已失效，或页面已被移动。", home: "返回首页", blog: "博客" },
  "zh-TW": { title: "找不到此頁面", desc: "連結可能已失效，或頁面已被移動。", home: "回到首頁", blog: "部落格" },
  id: { title: "Halaman tidak ditemukan", desc: "Tautan mungkin rusak atau halaman telah dipindahkan.", home: "Ke beranda", blog: "Blog" },
  th: { title: "ไม่พบหน้านี้", desc: "ลิงก์อาจเสียหรือหน้านี้อาจถูกย้ายไปแล้ว", home: "กลับหน้าแรก", blog: "บล็อก" },
  ru: { title: "Страница не найдена", desc: "Ссылка может быть нерабочей или страница была перемещена.", home: "На главную", blog: "Блог" },
};

export default function NotFound() {
  const [lang, setLang] = useState("ko");

  useEffect(() => {
    const seg = window.location.pathname.split("/")[1] || "ko";
    if (seg === "zh-TW") {
      setLang("zh-TW");
    } else if (COPY[seg]) {
      setLang(seg);
    } else {
      setLang("ko");
    }
  }, []);

  useEffect(() => {
    const t = COPY[lang] || COPY.ko;
    document.title = `404 - ${lang === "ko" ? "유즈픽" : "UsePic"}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t.desc);
  }, [lang]);

  const t = COPY[lang] || COPY.ko;
  const prefix = lang === "zh-TW" ? "/zh-TW" : `/${lang}`;

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "64px 20px",
        textAlign: "center",
        fontFamily:
          "'Pretendard','Apple SD Gothic Neo','Noto Sans KR','Helvetica Neue',Arial,sans-serif",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: 1, color: "#0071e3" }}>404</p>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: "#1d1d1f", lineHeight: 1.35 }}>{t.title}</h1>
      <p style={{ margin: 0, fontSize: 15, color: "#6e6e73", lineHeight: 1.6 }}>{t.desc}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={prefix}
          style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 22px", borderRadius: 999, background: "#0071e3", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
        >
          {t.home}
        </a>
        <a
          href={`${prefix}/blog/`}
          style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 22px", borderRadius: 999, border: "1px solid #d2d2d7", color: "#1d1d1f", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
        >
          {t.blog}
        </a>
      </div>
    </main>
  );
}
