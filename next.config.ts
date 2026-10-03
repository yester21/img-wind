import type { NextConfig } from "next";

/**
 * 정적 사이트 전용 빌드 (CF Pages 등 정적 호스팅 배포).
 * 서버 기능(API 라우트·미들웨어·sharp)은 제거됐다 — 모든 처리가 브라우저에서 이뤄진다.
 */
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
