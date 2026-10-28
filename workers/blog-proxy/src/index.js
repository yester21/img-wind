/**
 * usepic.net 의 블로그 경로 → 워드프레스 오리진 리버스 프록시.
 * 도구 페이지는 CF Pages(정적)가 서빙하고, 아래 경로만 이 Worker가 가로채 WP 서버로 넘긴다.
 *   /{언어}/blog, /{언어}/blog/*   — WPML 언어 디렉토리 + 글 목록 페이지(slug blog)·고유주소 /blog/%postname%/
 *   /{언어}/feed*, /blog*, /feed*  — 피드, WPML 도입 전·기본 언어 경로
 *   /wp-*                          — 관리자·로그인·자산·REST API·크론
 *   /sitemap_index.xml, /*-sitemap.xml — Yoast 사이트맵 (도구 사이트 /sitemap.xml 과 별개)
 * WP는 오리진 루트에 설치되어 경로가 1:1로 대응한다(WP 주소 https://usepic.net).
 *
 * env.WP_ORIGIN      — 예: https://wp.usepic.net (wrangler.toml vars)
 * env.PROXY_SECRET   — wp-config.php 와 같은 값 (wrangler secret put PROXY_SECRET)
 */
const LOCALES = ["ko", "en", "ja", "zh", "zh-TW", "id", "th", "ru"];
const LOCALE_PREFIX = `^/(?:(?:${LOCALES.join("|")})/)?`;
const WP_PATH = new RegExp(
  String.raw`${LOCALE_PREFIX}(?:blog|feed)(?:/|$)|^/wp-|${LOCALE_PREFIX}(?:sitemap_index|[a-z_]+-sitemap\d*)\.xml$`,
);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 라우트 패턴은 접두사 매치라 /blogxxx 등도 잡힌다 — 정확히 해당하는 경로만 프록시
    if (!WP_PATH.test(url.pathname)) {
      return fetch(request);
    }

    const origin = new URL(env.WP_ORIGIN);
    const target = new URL(url.pathname + url.search, origin);

    const headers = new Headers(request.headers);
    headers.set("X-Forwarded-Host", url.host);
    headers.set("X-Forwarded-Proto", "https");
    headers.set("X-Usepic-Proxy", env.PROXY_SECRET);

    const res = await fetch(target, {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });

    // 오리진 호스트로 나가는 리디렉트는 공개 도메인으로 되돌린다
    const location = res.headers.get("Location");
    if (location && location.startsWith(origin.origin)) {
      const out = new Response(res.body, res);
      out.headers.set("Location", url.origin + location.slice(origin.origin.length));
      return out;
    }
    return res;
  },
};
