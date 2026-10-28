# img-tools

브라우저 우선 **정적(static) 이미지 툴 웹서비스**. **총 12종 도구** — 압축 · 포맷 전환 ·
사이즈 조정 · 올인원 · 이미지↔PDF · 자르기·회전 · 워터마크 · 블러·픽셀화 · 배경 제거(AI) ·
OCR · 파비콘 생성. 여러 장 일괄 처리 + ZIP 다운로드.
**8개 언어**: 한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский

- 레퍼런스 디자인 시스템: **Apple Reference Design System**
  (Fog Canvas `#f5f5f7` 배경, 흰 카드 18px, Primary `#0071e3` pill 버튼, 그림자 없음)
- 스택: Next.js 15 App Router (`output: "export"` 정적) · React 19 · TypeScript · Tailwind v4
  · jspdf/pdfjs(PDF) · tesseract.js(OCR) · onnxruntime-web+u2netp(배경 제거) · heic2any(HEIC)
- **서버 없음** — 모든 처리가 브라우저에서 이뤄지고 파일은 전송되지 않는다. CF Pages 등
  정적 호스팅에 `out/` 폴더만 올리면 된다.

## 처리 아키텍처 (2026-10-02 정적 전환)

- 전 처리 체인(자르기→회전→리사이즈→워터마크→마스킹→인코딩)은 `lib/encode.ts renderImage()`
  단일 진입점으로 Web Worker + OffscreenCanvas에서 실행된다.
- 이전 버전의 sharp 서버 폴백(`/api/process`)은 정적 전환과 함께 **제거**됐다. 대체 규칙:
  - "원본 유지"인데 브라우저가 인코딩 못 하는 입력(GIF·BMP, 비지원 브라우저의 AVIF) → **PNG로 자동 전환**
  - 명시적으로 선택한 출력 포맷을 브라우저가 미지원 → UI에서 **선택 자체가 비활성**(caps 프로브)
  - 브라우저가 디코드 못 하는 입력(**TIFF·SVG는 미지원** — Dropzone 안내에서 제외) → 명확한 오류 코드
- 언어 리디렉트도 미들웨어 대신 **루트 감지 페이지**(`public/index.html` — 쿠키 → 브라우저
  언어 → 해당 언어로 이동)와 `public/_redirects`(구 URL → /ko 경로, CF Pages 전용)로 처리.

## 다국어 (i18n, 8개 언어)

- **URL 접두사 방식**: `/ko·/en·/ja·/zh·/zh-TW·/id·/th·/ru` + 도구 경로(총 104페이지 SSG).
  언어별 고유 URL이라 구글이 각 언어를 별도 색인할 수 있고, 페이지마다 self-canonical +
  hreflang(8언어 + x-default) + `<html lang>`이 정확히 렌더된다 — **애드센스·SEO 필수 요건**.
- **자동 언어 감지(정적)**: 루트 `/`는 `public/index.html` 감지 페이지 — `NEXT_LOCALE` 쿠키 →
  브라우저 언어(navigator.languages, zh-TW/zh-HK는 繁體 분기) → 기본값(ko) 순으로 판정해 이동.
  구 URL(`/compress` 등)은 `public/_redirects`로 /ko 경로 리다이렉트(CF Pages 전용).
- IP 기반 지역 판정은 정적 호스팅에서 불가 — 브라우저 언어가 사실상 동일 신호를 주고
  구글도 IP 리디렉트보다 브라우저 언어 방식을 권장한다. 향후 CF Worker 도입 시
  CF-IPCountry로 보강 가능.
- 언어 전환: 헤더 우측 드롭다운 — 현재 페이지 경로를 유지한 채 로케일만 교체, 선택은 1년 쿠키.
- 사전: `src/lib/i18n/dictionaries/{ko,en,ja,zh,zh-TW,id,th,ru}.ts` (ko가 타입 원본 `Dict`).
  오류는 코드(ERR_TOO_LARGE 등)로 던지고 UI에서 번역한다.
- sitemap.xml: 8언어 × 13경로 = 104 URL, 각 항목에 hreflang alternates 포함.
- 애드센스 메모: `ads.txt`는 사이트 루트(public/)에 두면 그대로 서빙된다. 가입 시
  개인정보 처리방침 페이지 추가 필요.

## 실행

```bash
npm install
npm run dev        # 개발 서버 http://localhost:3200
npm run build      # 정적 빌드 → out/
npm run preview    # out/ 정적 서빙 (http://localhost:3200)
npm run fixtures   # 검증용 테스트 이미지 생성 → scripts/out/
```

CF Pages 배포: 빌드 커맨드 `npm run build`, 출력 디렉토리 `out`,
환경변수 `NEXT_PUBLIC_SITE_URL=https://도메인`(빌드타임 sitemap/robots URL).

## 폴더 구조

```
img-tools/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 헤더·푸터, 처리 위치 안내
│   │   ├── page.tsx            # 홈: 도구 4종 카드 (올인원 강조)
│   │   ├── all-in-one/page.tsx # 올인원: 포맷+압축+사이즈 한 번에
│   │   ├── compress/page.tsx   # 이미지 압축
│   │   ├── convert/page.tsx    # 포맷 전환
│   │   ├── resize/page.tsx     # 사이즈 조정
│   │   ├── api/process/route.ts# sharp 서버 폴백 (단일 파일 POST)
│   │   ├── sitemap.ts / robots.ts
│   │   └── globals.css         # Apple 디자인 토큰 (@theme)
│   ├── components/
│   │   ├── ToolHeader.tsx / ToolShell.tsx   # 페이지 골격
│   │   ├── Dropzone.tsx        # 드래그앤드롭 + 파일 선택
│   │   ├── FileQueue.tsx       # 큐: 썸네일·전/후 용량·절감률·처리 위치 배지
│   │   ├── ResultBar.tsx       # 요약 + ZIP 다운로드
│   │   └── AllInOneTool / CompressTool / ConvertTool / ResizeTool .tsx
│   └── lib/
│       ├── types.ts            # ProcessOptions 등 공용 타입
│       ├── capabilities.ts     # 브라우저 인코딩 지원 프로브
│       ├── encode.ts           # 캔버스 인코딩 코어 (워커/메인 공용)
│       ├── image.worker.ts     # 오프스레드 처리 워커
│       ├── pipeline.ts         # 오케스트레이터: 브라우저 → 서버 폴백, 동시 4개
│       ├── useImageTool.ts     # 큐·옵션·실행 상태 훅
│       ├── zip.ts              # store 방식 ZIP 자체 구현 (의존성 0)
│       └── format.ts           # 용량·퍼센트 포맷
└── scripts/make-fixtures.mjs   # 테스트 이미지 생성
```

## 도구 사양

| 도구 | 옵션 | 출력 파일명 |
|---|---|---|
| 올인원 (`/all-in-one`) | 포맷 변환 + 압축 + 사이즈를 한 번에. **미설정 항목은 원본 유지** | `원본명[.min][-WxH].ext` |
| 압축 (`/compress`) | 품질 또는 목표 용량(KB 이진탐색) · 출력 포맷 | `원본명.min.ext` |
| 포맷 전환 (`/convert`) | JPEG/PNG/WebP/AVIF · 품질 · 투명 배경색(JPEG) | `원본명.ext` |
| 사이즈 조정 (`/resize`) | 픽셀/비율/최대 크기/**커버(잘라내기)** + 소셜 프리셋(유튜브·인스타 등 6종) | `원본명-WxH.ext` |
| 이미지→PDF (`/to-pdf`) | A4 맞춤/이미지 크기 · 여백 · 품질 — 여러 장을 1개 PDF로 | `imgtools-images.pdf` |
| PDF→이미지 (`/pdf-to-image`) | 배율 1~3× · PNG/JPEG 품질 — 페이지별 ZIP | `page-NNN.ext` ZIP |
| 자르기·회전 (`/crop`) | 시각 드래그 크롭(상대 좌표, 비율 잠금) + 90° 회전·뒤집기, 전체 적용 | `원본명-cropped.ext` |
| 워터마크 (`/watermark`) | 텍스트/로고 · 위치(4모서리·중앙·반복) · 크기·투명도 · 실시간 미리보기 | `원본명-watermarked.ext` |
| 블러·픽셀화 (`/mask`) | 다중 영역 드래그 · 블러/픽셀화 · 강도 | `원본명-masked.ext` |
| 배경 제거 (`/bg-remove`) | AI(u2netp ONNX, 브라우저 추론) → 투명 PNG. 첫 실행 모델 ~5MB | `원본명-nobg.png` |
| OCR (`/ocr`) | 한·영·일 (tesseract.js, 브라우저) → 복사/TXT | TXT |
| 파비콘 생성 (`/favicon`) | 16~512px 세트 + favicon.ico → ZIP | `favicon-pack.zip` |

공통 UX: 다중 드래그앤드롭(최대 100장, 파일당 50MB) → 옵션 → `N장 처리하기` →
개별 저장 또는 `모두 ZIP으로 저장`. 옵션 변경 후에는 `다시 처리` 버튼으로 재실행.

## 디자인 토큰 (globals.css `@theme`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-fog` | `#f5f5f7` | 배경 |
| `--color-surface` | `#ffffff` | 카드 |
| `--color-ink` | `#1d1d1f` | 본문 |
| `--color-muted` | `#6e6e73` | 보조 텍스트 |
| `--color-hairline` | `#d2d2d7` | 경계선 |
| `--color-primary` | `#0071e3` | 액션 (pill 버튼) |
| `--radius-card` | `18px` | 카드 라운드 |
| 폰트 | SF Pro 시스템 스택 | UI 전체 |

카드·버튼·필드는 그림자 없는 플랫 스타일. 컴포넌트 클래스는 `card`, `btn-primary`,
`btn-secondary`, `btn-ghost`, `field`, `field-label`.

## 품질 특성 (2026-10-02 PSNR 실측)

손실 포맷(JPEG/WebP/AVIF)은 재인코딩 특성상 원본과 100% 동일할 수는 없다(iloveimg 등 모든
툴 공통). 본 서비스 구현의 실측 품질:

| 경로 | 조건 | PSNR | 비고 |
|---|---|---|---|
| 서버(sharp mozjpeg) | 실사진 q80 | **45.7dB** | 육안 구분 불가(40dB+). 101KB→55KB(−46%) |
| 브라우저(canvas) | 스트레스 그래픽(반투명 원 300개 겹침) q80 | 36dB | 1:1 확대 크롬 육안 동일. 일반 사진은 이보다 높게 나옴 |
| 브라우저(canvas) | 동일 그래픽 WebP q80 | 37.2dB | JPEG보다 작고 PSNR도 높음 |

- 측정 도구: `scripts/quality-psnr.mjs` (sharp raw 픽셀 PSNR). 브라우저 크롬 이미지는
  `scripts/out/quality/` 참고.
- **PNG는 무손실** — 화질 손실 0. 리사이즈는 step-down 점진 축소 + high smoothing(브라우저),
  서버는 lanczos3.
- 한계: ① 이미 압축된 파일의 반복 재압축은 누적 손실(세대 손실) ② 브라우저 JPEG 인코더는
  크로마 서브샘플링 제어 불가 — 극단적 줌에서 컬러 텍스트 가장자리 미세 번짐 가능 ③ 목표
  용량 모드는 지나치게 작은 목표에서 품질이 떨어짐(UI 경고 표시) ④ 확대는 보간이다.

## 제약 (정적 버전)

- **TIFF·SVG 입력 미지원**(브라우저 디코드 한계 — 이전에는 서버 폴백이 담당) → 투입 시 오류 안내.
- GIF·BMP를 "원본 유지"로 출력하면 **PNG로 자동 전환**(캔버스 인코딩 한계). GIF는 첫 프레임만.
- AVIF 출력은 지원 브라우저(Chrome·Edge)에서만 선택 가능 — 미지원 브라우저에선 옵션 비활성.
- 대용량 일괄 처리는 브라우저 메모리의 영향을 받는다. 배경 제거·OCR은 첫 실행에
  모델/언어 데이터를 내려받는다(모델·wasm은 `/public` 셀프호스팅, tesseract 언어 데이터만 CDN).
- 빌드 산출물 `out/`에는 ort wasm+mjs · u2netp.onnx · pdf.worker · index.html · _redirects ·
  파비콘 세트(favicon.ico · apple-touch-icon.png · icon-192/512.png · site.webmanifest ·
  brand SVG)가 포함된다.

## 배포 — CF Pages 정적 (이관 예정)

- **정적 전환 완료(2026-10-02)**: `npm run build` → `out/`을 CF Pages에 올리면 끝.
  설정: 빌드 커맨드 `npm run build` · 출력 디렉토리 `out` · 환경변수
  `NEXT_PUBLIC_SITE_URL=https://도메인`(빌드타임 sitemap/robots URL).
- **iwinv 158 서버의 Node 배포(imgtools.seos.kr)는 정적 전환 이전 버전**(서버 폴백 포함,
  3개 언어)이 아직 서빙 중 — CF Pages + 전용 도메인 연결 시 out/으로 이관하고 301 정리.
  이전 Node 배포 기록: systemd `img-tools.service`(127.0.0.1:3200), OLS vhost
  `extprocessor imgtools-app` + `context /` proxy, 사본 scripts/deploy-img-tools.service ·
  deploy-ols-proxy.py.
- **도메인 usepic.net (2026-10-28)**: CF Pages 프로젝트를 GitHub(yester21/img-wind)에 연결,
  `NEXT_PUBLIC_SITE_URL=https://usepic.net`.
- CF Pages 파일당 25MiB 제한 — ort는 WebGPU(jsep, wasm 28MB) 대신 `onnxruntime-web/wasm`
  빌드(`ort-wasm-simd-threaded.mjs`+`.wasm` 14MB)를 `/public/ort`에 둔다. 실행 공급자는 원래 `wasm`만 사용.
- /blog 워드프레스: `workers/blog-proxy`(Worker 라우트 `usepic.net/blog*`)가 `/blog`·`/blog/*`만
  WP 오리진(`wp.usepic.net`, 오리진에서도 /blog 하위 설치)으로 프록시. 공유 비밀 헤더
  `X-Usepic-Proxy` + `wp-config-snippet.php`로 WP가 usepic.net으로 인식, WP 주소 `https://usepic.net/blog`.

## 검증 기록

2026-10-02, Chrome(IAB) + dev 서버(3200) 기준:

- `npm run build` 게이트 통과 (Next.js 15.5.27).
- **압축(브라우저 경로)**: JPEG 2장 263KB→112KB(−57%) · 345KB→139KB(−60%), 1600×1000 등 치수 유지,
  `브라우저 처리` 배지. 워커 청크(`image_worker_ts.js`) 로드 확인 — 오프스레드 처리.
- **압축(목표 용량)**: 255KB JPEG에 100KB 목표 → 97KB(−62%)로 이진탐색 성립.
- **ZIP**: `모두 ZIP으로 저장` 클릭 → download 이벤트 발화 확인.
- **포맷 전환**: PNG(알파)→WebP 브라우저 처리(−57%), TIFF 입력은 자동 서버 폴백(`서버 처리` 배지).
- **리사이즈(비율 유지)**: 1600×1000→400×250, 1200×1800→400×600 (폭 400 기준).
- **서버 폴백 API (curl 직접)**: TIFF→JPEG 200(1200×800), PNG→AVIF 200(AVIF 시그니처 확인),
  SVG→PNG(keep→png) 200(640×480), PNG 640×480 contain 리사이즈 480×480,
  HEIC 입력 415 + 한글 오류 메시지.
**다국어 추가 (2026-10-02)**: `/ko·/en·/ja` 15 페이지 SSG. 프로덕션 실측 — `/`를
Accept-Language별로 en/ja/ko 307 리디렉트, 쿠키(NEXT_LOCALE)가 헤더보다 우선, `/compress` 등
구 URL도 접두사 리디렉트, html lang·hreflang(ko/en/ja/x-default)·self-canonical 렌더 확인,
sitemap 15 URL, 스위처로 en→ko 경로 유지 전환, 일본어 UI에서 압축 처리(171KB→72KB)까지 동작.
함정: 서버 재배포 때 `rm -rf src` 없이 tar를 덮으면 구 페이지가 남아 타입 오류.

**12종 도구 확장 (2026-10-02)**: 1~3순위 전체 구현·배포. 로컬 실측 — 이미지→PDF 다운로드 발화,
파비콘 ZIP 발화, 크롭 드래그 1200×800→600×400(정확), 워터마크 −42%+프리뷰, 마스킹 블러 −43%,
OCR "HELLO 123" 추출, 배경 제거 투명 PNG, HEIC 1440×960 WASM 디코드→WebP, 프리셋 1280×720
커버 −75%. 프로덕션 — 신규 8 라우트 200, /ort·/models·/pdfjs 자산 200, sitemap 39 URL,
서버 패리티(crop+rotate+cover+워터마크 → 400×400 200).
함정: ① RectSelector 드래그는 ref 기반이어야 함(포인터 이벤트 간 React 플러시 시점에 상태가
날아 1×1 크롭 발생) ② onnxruntime-web 1.30은 `ort-wasm-simd-threaded.jsep.mjs`+`.wasm` 둘 다
/public/ort에 필요 ③ 서버 재배포는 `rm -rf src public` 선행(구 파일 잔존 타입 오류).

**정적 전환 + 8개 언어 (2026-10-02)**: sharp 서버 폴백·API·미들웨어 제거, `output: "export"`.
언어 ko/en/ja/zh/zh-TW/id/th/ru 8종(104페이지 SSG), 루트 감지 페이지(public/index.html)·
_redirects 추가, 미지원 출력 포맷은 caps 프로브로 선택 비활성, GIF/BMP keep→PNG 폴백.
로컬 정적 서빙 실측 — `/` 감지 → 브라우저 언어(/ja/) 자동 이동, ru 페이지 렌더(lang=ru),
정적 서빙에서 워커 압축 112KB→44KB(−60%), 8 언어 페이지·sitemap·모델/wasm 자산 전부 200.
함정: ① 정적 export는 sitemap/robots에 `export const dynamic = "force-static"` 필요,
`redirects()`·middleware는 export와 양립 불가 ② CF Pages 이관 시 `NEXT_PUBLIC_SITE_URL`로
sitemap 도메인 고정.

**12종 도구 전수 검증 + PDF 렌더 rAF 버그 수정 (2026-10-03)**: 정적 빌드에서 12개 도구 전부
실측 — 올인원(WebP+400px −93%), 압축 목표용량(100KB→96KB), 전환(PNG→WebP −94%), 프리셋
(1280×720 커버 −75%), 크롭+90°(600×400→800×1200 정확), 워터마크(미리보기+적용 −58%), 마스킹
블러(−59%), 이미지→PDF·파비콘·PDF→이미지(다운로드 발화), OCR("VERIFY 456" 추출), 배경 제거
(투명 PNG 52KB).
**버그 수정**: PDF→이미지가 백그라운드/오클루전 창에서 영구 멈춤 — pdf.js가 표시 렌더를
requestAnimationFrame으로 스케줄링하고 오클루전 창에선 rAF가 0회 발화하기 때문(실측 1.5s 0frame,
visibilityState는 visible). 해결: `lib/raf.ts` — 처리 전 rAF 발화를 감시해 정지 상태면
setTimeout 기반 대체를 설치·종료 후 복원(`ensureRafRunning`). pdf.js 표준 14 폰트·cmap
리소스도 `public/pdfjs/standard_fonts·cmaps`에 추가(한글·CJK PDF 렌더링 품질).

**반응형 검수 + 모바일 내비 추가 (2026-10-03)**: 뷰포트 390(모바일)·768(태블릿 세로)·
1024(태블릿 가로) 검수 — **발견 문제: <1024px에서 내비게이션 완전 부재**(주 내비가 `lg`부터
표시되어 모바일·태블릿 세로에서 도구 간 이동 수단이 없음). 수정: `MobileNav.tsx` — 헤더 아래
가로 스크롤 도구 칩바(12개 도구, 현재 페이지 파란 pill 강조, `lg:hidden`, 스크롤바 숨김
`.no-scrollbar`). 재검수: 390/768 칩바 12칩+현재 페이지 강조+스크롤 가능, 데스크톱 내비 숨김;
1024 주 내비 표시+칩바 숨김; 가로 넘침 없음. 그 외 모바일 레이아웃(드롭존·포맷 카드 2열·큐
행 말줄임·ResultBar 랩·푸터)은 수정 불필요 확인.
**모바일 헤더 밀집 수정(같은 날 사용자 피드백)**: 모바일에서 로고(136px)와 언어 스위처 사이
39px로 붙어 있고 칩바(36px)가 크다는 지적 → 로고 모바일 한정 `h-7 sm:h-8`(28px, 간격 39→56px),
칩바 축소(칩 36→32px, 패딩·간격 축소, 텍스트는 15px 최소 규칙 유지). 실측: 로고 119×28,
칩 32px, 간격 56px.

**다크모드 + 모바일 UX 개선 (2026-10-03 사용자 지시 4건)**: ① **다크모드** — globals.css에
`.dark` 변수 오버라이드(fog #050506·surface #1c1c1e·ink #f5f5f7·muted #98989d·hairline
#3a3a3c, primary는 양모드 공용 #0071e3), `[locale]/layout` body 선두에 초기화 인라인
스크립트(localStorage `theme` → 시스템 prefers-color-scheme, FOUC 방지), 헤더 **ThemeToggle**
(달/해 아이콘 CSS 스왑, localStorage 저장, suppressHydrationWarning), 로고는 라이트/화이트
SVG 2장 마크업 + `.logo-dark/.logo-light` CSS 스왑, 체커보드 다크 변형, `color-scheme` 설정.
주의: `@theme` 변수는 utilities가 var() 참조하므로 `.dark` 오버라이드만으로 전체 반영됨
(utilities는 layer 내부라 unlayered .dark 값이 항상 이김). ② **모바일 폰트 축소** —
`@media (max-width:639px) body { zoom: 0.9 }`(px 고정 폰트 체계라 zoom이 유일한 균일 축소법,
미디어쿼리·브레이크포인트 불영향). ③ **햄버거 메뉴** — 칩바(MobileNav) 삭제, `HamburgerMenu`
(≤lg 표시, 우측 상단 햄버거 → 12 도구 리스트 패널, 외부 클릭·Escape·이동 시 닫힘). ④ 언어
스위처 축소(h-8→h-7, 15px→13px).

- 검증 재현: `npm run fixtures` 후 각 도구 페이지에서 수동 확인.

**배포 실측 (2026-10-02, imgtools.seos.kr)**:

- 전 라우트 https 200 + http→301, sitemap에 프로덕션 URL 인라인 확인.
- 서버 폴백 API: TIFF→JPEG 200(HTTP/2, 800×600, JPEG 시그니처), HEIC 415.
- 브라우저 실측(외부 인터넷): JPEG 255KB→108KB(−58%) 브라우저 처리, Worker 경로 정상.
- `systemctl is-enabled img-tools` = enabled(부팅 자동시작).

**올인원 도구 추가 (2026-10-02)**: 기존 3메뉴(압축·포맷 전환·사이즈 조정)는 그대로 두고
`/all-in-one` 추가 — 세 기능을 한 번에 적용하되 미설정 항목은 원본 유지. 실측: 기본 실행
(원본 유지·품질 80·리사이즈 없음)=압축만 158KB→63KB(−60%)·1200×800 치수 유지,
WebP+폭 400 조합=400×250(−93%). 프로덕션 5 라우트 200, sitemap에 4 도구 반영.
