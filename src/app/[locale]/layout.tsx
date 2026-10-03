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
      template: `%s | Imgwind`,
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
            <Link href={`/${l}`} className="shrink-0" aria-label="Imgwind">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="Imgwind" className="h-7 sm:h-8 w-auto logo-light" />
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
              <LocaleSwitcher locale={l} />
              <ThemeToggle />
              <HamburgerMenu
                items={[...MAIN, ...MORE].map((m) => ({
                  href: `/${l}${m.href}`,
                  label: m.label,
                }))}
                ariaLabel={d.navMore}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-10">{children}</main>

        <footer className="border-t border-hairline/60 mt-10">
          <div className="max-w-4xl mx-auto px-5 py-8 text-[15px] text-muted leading-relaxed">
            <p>{d.footer.notice}</p>
            <p className="mt-1.5">{d.footer.tagline}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
