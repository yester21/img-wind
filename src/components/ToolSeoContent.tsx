import { toolSeo } from "@/lib/i18n/toolSeo";
import type { Locale } from "@/lib/i18n/config";

/**
 * 정적 도구 페이지 하단 SEO 설명 콘텐츠.
 * H2/H3 구조로 도구 설명·사용법·팁·FAQ를 서버 렌더링한다.
 */
export default function ToolSeoContent({ locale, toolKey }: { locale: Locale; toolKey: string }) {
  const data = toolSeo[locale]?.[toolKey];
  if (!data) return null;

  return (
    <section className="mt-20 border-t border-hairline/60 pt-12 break-keep" aria-label={data.sections[0]?.h2 ?? ""}>
      <p className="text-[16px] leading-relaxed text-muted">{data.intro}</p>
      {data.sections.map((section, i) => (
        <div key={`${toolKey}-s${i}`} className="mt-10">
          <h2 className="text-[24px] font-semibold tracking-tight text-ink">{section.h2}</h2>
          {section.paragraphs.map((p, j) => (
            <p key={`p${j}`} className="mt-3 text-[16px] leading-relaxed text-muted">
              {p}
            </p>
          ))}
          {section.subs.map((sub, j) => (
            <div key={`sub${j}`} className="mt-6">
              <h3 className="text-[19px] font-semibold text-ink">{sub.h3}</h3>
              {sub.paragraphs.map((p, k) => (
                <p key={`sp${k}`} className="mt-2 text-[16px] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
