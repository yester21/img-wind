/**
 * usepic.net/blog/* → 워드프레스 오리진 리버스 프록시.
 * 도구 페이지는 CF Pages(정적)가 서빙하고, /blog 경로만 이 Worker가 가로채 WP 서버로 넘긴다.
 * WP는 오리진에서도 /blog 하위에 설치되어 경로가 1:1로 대응한다.
 *
 * env.WP_ORIGIN      — 예: https://wp.usepic.net (wrangler.toml vars)
 * env.PROXY_SECRET   — wp-config.php 와 같은 값 (wrangler secret put PROXY_SECRET)
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 라우트 패턴(usepic.net/blog*)이 /blogxxx 도 잡으므로 /blog, /blog/... 만 프록시한다
    if (url.pathname !== "/blog" && !url.pathname.startsWith("/blog/")) {
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
