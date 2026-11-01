import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { langAlternates, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import SiteNav from "@/components/SiteNav";
import ToolsMenu from "@/components/ToolsMenu";
import HamburgerMenu from "@/components/HamburgerMenu";
import ThemeToggle from "@/components/ThemeToggle";
import "../globals.css";

/** 다크모드 초기화 — 페인트 전에 실행(localStorage → 시스템 설정) */
const themeInit = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var c=document.documentElement.classList;d?c.add("dark"):c.remove("dark");}catch(e){}})();`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://imgtools.seos.kr"),
    title: {
      default: d.meta.titleDefault,
      template: `%s | ${locale === "ko" ? "유스픽" : "Usepic"}`,
    },
    description: d.meta.desc,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/brand/imgwind-favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    alternates: { languages: langAlternates("") },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDictionary(l);
  const logoSrc = l === "ko" ? "/brand/imgwind-logo-ko.svg" : "/brand/imgwind-logo.svg";

  const MAIN = [
    { href: "/all-in-one", label: d.allin.title },
    { href: "/compress", label: d.compress.title },
    { href: "/convert", label: d.convert.title },
    { href: "/resize", label: d.resize.title },
  ];
  const MORE = [
    { href: "/to-pdf", label: d.topdf.title },
    { href: "/pdf-to-image", label: d.pdfimg.title },
    { href: "/crop", label: d.crop.title },
    { href: "/watermark", label: d.wm.title },
    { href: "/mask", label: d.maskT.title },
    { href: "/bg-remove", label: d.bg.title },
    { href: "/ocr", label: d.ocr.title },
    { href: "/favicon", label: d.fav.title },
  ];

  return (
    <html lang={l} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <header className="sticky top-0 z-40 bg-fog/80 backdrop-blur-md border-b border-hairline/60 py-4">
          <div className="max-w-7xl mx-auto px-5 flex items-center gap-6">
            <Link href={`/${l}`} className="shrink-0" aria-label={l === "ko" ? "유스픽" : "Usepic"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt={l === "ko" ? "유스픽" : "Usepic"} className="h-7 sm:h-8 w-auto logo-light" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={l === "ko" ? "/brand/imgwind-logo-ko-white.svg" : "/brand/imgwind-logo-white.svg"}
                alt=""
                aria-hidden
                className="h-7 sm:h-8 w-auto logo-dark"
              />
            </Link>
            <nav className="hidden lg:flex items-center gap-7 self-stretch whitespace-nowrap">
              <SiteNav
                items={MAIN.map((m) => ({ href: `/${l}${m.href}`, label: m.label }))}
              />
              <ToolsMenu
                items={MORE.map((m) => ({ href: `/${l}${m.href}`, label: m.label }))}
                label={d.navMore}
              />
            </nav>
            <div className="ml-auto flex items-center gap-1.5 lg:gap-3">
              <a
                href={`/${l}/about`}
                className="hidden sm:inline-flex items-center whitespace-nowrap font-bold text-[16px] text-ink transition-colors hover:text-primary"
              >
                {d.navAbout}
              </a>
              {/* 블로그 — Next.js 밖(WP) 라우트라 Link 대신 전체 이동하는 a 태그 */}
              <a
                href={`/${l}/blog/`}
                className="hidden sm:inline-flex items-center whitespace-nowrap font-bold text-[16px] text-ink transition-colors hover:text-primary"
              >
                {d.navBlog}
              </a>
              <LocaleSwitcher locale={l} />
              <ThemeToggle />
              <HamburgerMenu
                items={[
                  { href: `/${l}/about`, label: d.navAbout },
                  { href: `/${l}/blog/`, label: d.navBlog },
                  ...[...MAIN, ...MORE].map((m) => ({
                    href: `/${l}${m.href}`,
                    label: m.label,
                  })),
                ]}
                ariaLabel={d.navMore}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-10">{children}</main>

        <footer className="border-t border-hairline/60 mt-10">
          {l === "ko" ? (
            <div className="max-w-7xl mx-auto px-5 py-12">
              <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                <div className="max-w-xs">
                  <Link href={`/${l}`} className="inline-flex items-center" aria-label="유스픽">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/imgwind-logo-ko.svg" alt="유스픽" className="h-8 w-auto logo-light" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/imgwind-logo-ko-white.svg" alt="" aria-hidden className="h-8 w-auto logo-dark" />
                  </Link>
                  <p className="mt-4 text-[14px] text-muted leading-relaxed">{d.footer.notice}</p>
                  <p className="mt-1.5 text-[14px] text-muted">{d.footer.tagline}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
                  <div>
                    <p className="text-[14px] font-semibold text-ink">주요 도구</p>
                    <ul className="mt-3 space-y-2">
                      {MAIN.map((m) => (
                        <li key={m.href}>
                          <Link href={`/${l}${m.href}`} className="text-[14px] text-muted transition-colors hover:text-primary">
                            {m.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">더 많은 도구</p>
                    <ul className="mt-3 space-y-2">
                      {MORE.map((m) => (
                        <li key={m.href}>
                          <Link href={`/${l}${m.href}`} className="text-[14px] text-muted transition-colors hover:text-primary">
                            {m.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">소개</p>
                    <ul className="mt-3 space-y-2">
                      <li>
                        <a href={`/${l}/about`} className="text-[14px] text-muted transition-colors hover:text-primary">
                          서비스 소개
                        </a>
                      </li>
                      <li>
                        <a href={`/${l}/blog/`} className="text-[14px] text-muted transition-colors hover:text-primary">
                          블로그
                        </a>
                      </li>
                      <li>
                        <a href={`/${l}/contact`} className="text-[14px] text-muted transition-colors hover:text-primary">
                          문의하기
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-hairline/60 pt-6 text-[14px] text-muted">
                <span>© 2026 유스픽(usepic). All rights reserved.</span>
                <a href={`/${l}/privacy`} className="text-muted transition-colors hover:text-primary">
                  개인정보처리방침
                </a>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-5 py-8 text-[14px] text-muted leading-relaxed">
              <p>{d.footer.notice}</p>
              <p className="mt-1.5">{d.footer.tagline}</p>
            </div>
          )}
        </footer>
      </body>
    </html>
  );
}
