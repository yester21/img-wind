# Imgwind 헤더·푸터 → Bricks 네이티브 템플릿 전환 스펙

- 원본: `D:\USEPIC` (Next.js 15 + Tailwind v4, 정적 사이트)
- 타깃: `usepic.net` (Bricks, 전역 클래스 0 / 템플릿 0 / 중단점 기본값 — greenfield)
- 문서 목적: 헤더·푸터 2개 템플릿을 **네이티브 요소 트리 + 전역 클래스**로 재현하기 위한 시공값 확정

## 0. 소스 매핑

| 영역 | 파일 | 근거 |
|---|---|---|
| 헤더/푸터 마크업 | `src/app/[locale]/layout.tsx` L77–121(헤더), L125–130(푸터) | sticky·blur·컨테이너·드로어 프리로드 |
| 주 메뉴 4개 | `src/components/SiteNav.tsx` | 16px/700, active·hover = primary |
| "모든 도구" 드롭다운 | `src/components/ToolsMenu.tsx` | hover+click, 16px 브리지, 아이콘 16px |
| 언어 스위처 | `src/components/LocaleSwitcher.tsx` | `h-7` select, 쿠키 `NEXT_LOCALE` |
| 테마 토글 | `src/components/ThemeToggle.tsx` | `localStorage.theme` + `html.dark` |
| 햄버거/드로어 | `src/components/HamburgerMenu.tsx` | portal, 300px, 13개 항목 |
| 토큰·다크·zoom·폰트 | `src/app/globals.css` | `@theme`, `.dark`, `zoom:.9`, `*{box-shadow:none}` |
| 카피 | `src/lib/i18n/dictionaries/ko.ts` L7–9, L261–262 | `footer.notice/tagline`, `navBlog`, `navMore` |
| 로고 | `public/brand/*.svg` | 4종(ko/en × light/white), viewBox 고정 |
| 폰트 | `public/fonts/PretendardVariable.woff2` | 가변 45–920, 2.0MB |

## 1. 디자인 토큰

| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| fog | `#f5f5f7` | `#050506` | 페이지 배경, hover 배경, 헤더 배경(80%) |
| surface | `#ffffff` | `#1c1c1e` | 드롭다운 카드, select, 드로어 |
| ink | `#1d1d1f` | `#f5f5f7` | 기본 텍스트, nav 링크 |
| muted | `#6e6e73` | `#98989d` | 푸터 텍스트, select 화살표, 드로어 close |
| hairline | `#d2d2d7` | `#3a3a3c` | 보더(60% 알파로 사용) |
| primary | `#0071e3` | 동일 | active/hover, focus 보더 |
| primary-down | `#0060c2` | 동일 | (헤더 미사용) |
| radius | card 18px / pill 980px | — | 카드·원형 버튼 |
| weight | 400 본문 / 700 링크 | — | `font-bold` |
| line-height | 1.5 본문, 1.625 푸터 | — | `leading-relaxed`=1.625 |

- 폰트 스택(ko): `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`. 그 외 로케일은 `html[lang]`별 8종 스택(globals.css L79–108).
- 통일 스케일: **14 / 16 / 18 / 20 / 25 / 40 / 50px** — 헤더·푸터는 **16px(헤더 링크)** 와 **14px(select·드로어 링크·푸터)** 만 사용.
- 전역 주의: `*{box-shadow:none}`(globals.css L66) 때문에 `shadow-lg` / `shadow-2xl`은 **실제로 렌더되지 않는다**. Bricks에서도 그림자 0으로 맞춘다.

## 2. 헤더 마크업 구조 (원본 → 의미)

| # | 원본 | 핵심 클래스 | 의미 |
|---|---|---|---|
| 1 | `<header>` | `sticky top-0 z-40 bg-fog/80 backdrop-blur-md border-b border-hairline/60 py-4` | sticky 셸 (Bricks 템플릿 래퍼가 `<header>` 자동 생성 → `tag:header` 금지) |
| 2 | `<div>` | `max-w-7xl mx-auto px-5 flex items-center gap-6` | 1280px 컨테이너 |
| 3 | `<a>` | `shrink-0` + img `h-7 sm:h-8 w-auto logo-light/dark` | 로고 2장 스택 |
| 4 | `<nav>` | `hidden lg:flex items-center gap-7 self-stretch whitespace-nowrap` | 4링크 + 드롭다운 |
| 5 | `<div>` | `ml-auto flex items-center gap-1.5 lg:gap-3` | 우측 클러스터 |
| 6 | `<a>` | `hidden sm:inline-flex … font-bold text-[16px]` | 블로그(언어 스위처 왼쪽) |
| 7 | `<select>` | `h-7 rounded-full border … pl-2.5 pr-6 text-[14px]` | 언어 8종 |
| 8 | `<button>` | `h-9 w-9 rounded-full` | 테마 토글 |
| 9 | `<div>` | `shrink-0 lg:hidden` + portal | 햄버거 + 드로어 |

## 3. 헤더 수치 (Tailwind 4px 단위 환산)

| 항목 | 값 | 비고 |
|---|---|---|
| sticky | `position:sticky; top:0; z-index:40` | 문서 흐름 유지, 콘텐츠가 밑으로 통과 |
| 배경 | `rgba(245,245,247,.8)` / dark `rgba(5,5,6,.8)` | `bg-fog/80` |
| 블러 | `backdrop-filter: blur(12px)` | `backdrop-blur-md` |
| 하단 보더 | `1px solid rgba(210,210,215,.6)` / dark `rgba(58,58,60,.6)` | `hairline/60` |
| 패딩 | `16px 0` | `py-4` |
| 헤더 총높이 | **68px + 1px 보더 = 69px** | 16+36(최대 자식: h-9 버튼)+16 |
| 컨테이너 | `max-width:1280px; margin:0 auto; padding:0 20px` | `max-w-7xl` `px-5`, 실콘텐츠 1240px |
| 컨테이너 gap | `24px` | `gap-6` |
| 로고 링크 | `flex-shrink:0`, `aria-label="Imgwind"` | |
| 로고 높이 | 28px (`<640`) / 32px (`≥640`) | `h-7 sm:h-8`, `width:auto` |
| 로고 폭 | en 144.1 / 164.7px · ko 119.5 / 136.5px | viewBox 370.6×72=5.147, 307.18×72=4.266 |
| nav | `display:none` `<1024`, `flex` `≥1024`, `gap:28px`, `align-items:center`, `white-space:nowrap` | `gap-7` |
| nav 링크 | 16px / 700 / `1.5`(24px) / color ink | hover·active = primary, transition 150ms `cubic-bezier(.4,0,.2,1)` |
| 드롭다운 트리거 | nav 링크와 동일 + `cursor:pointer`, `aria-haspopup`, `aria-expanded` | "모든 도구" |
| 드롭다운 래퍼 | `position:absolute; left:0; top:100%; z-index:50; padding-top:16px` | 16px = 호버 브리지 + 헤더 보더선 정렬 |
| 드롭다운 카드 | `width:max-content; min-width:224px; padding:6px 0; border:1px rgba(210,210,215,.6); border-radius:18px; background:surface` | 그림자 0(전역 규칙) |
| 드롭다운 항목 | `display:flex; gap:10px; padding:8px 16px; font-size:16px; white-space:nowrap` | hover `bg-fog`+primary, active primary+700 |
| 드롭다운 아이콘 | 16×16, `stroke-width:1.8`, 도구별 accent | 표 3 |
| 우측 클러스터 | `margin-left:auto; display:flex; gap:6px` (`≥1024` 12px) | `gap-1.5 lg:gap-3` |
| 블로그 링크 | 16px / 700 / ink, hover primary, `display:none <640` | 언어 스위처 왼쪽, `/{locale}/blog/` |
| select | `height:28px; border-radius:980px; border:1px hairline; background:surface; padding:0 24px 0 10px; font-size:14px; appearance:none` | hover 보더 muted, focus 보더 primary, outline none |
| select 화살표 | 10×10, `stroke-width:2.5`, color muted, `right:9.6px`(0.6rem 오버라이드), 세로 중앙 | `.relative select + svg` 보정 |
| 테마 토글 | 36×36, radius 980, color ink, hover `rgba(29,29,31,.1)` | 아이콘 17×17, stroke 1.8, 다크=해·라이트=달 |
| 햄버거 | 36×36, radius 980, `display:none ≥1024` | 아이콘 18×18, stroke 2, 열림 시 X |
| 오버레이 | `position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:60` | 클릭 시 닫힘 |
| 드로어 | `position:fixed; inset-y:0; right:0; width:300px; background:surface; z-index:70; flex column` | `role=dialog aria-modal=true`, `overflow:hidden` body 락 |
| 드로어 헤더 | 높이 = 사이트 헤더 `offsetHeight` = **69px**(폴백 62px≈69×0.9), `padding:0 16px`, `border-bottom 1px hairline/60`, space-between | 로고 동일 규칙, close 32×32(muted→hover fog/ink) |
| 드로어 목록 | `padding:8px 0`, `overflow-y:auto`, 항목 `padding:12px 20px`, **14px**, active primary+700 | 13개(블로그+4+8) |

## 4. 메뉴 데이터

| 위치 | href (ko) | 라벨(ko) | 아이콘 accent |
|---|---|---|---|
| nav | `/ko/all-in-one` | 올인원 처리 | (없음) |
| nav | `/ko/compress` | 이미지 압축 | (없음) |
| nav | `/ko/convert` | 포맷 전환 | (없음) |
| nav | `/ko/resize` | 사이즈 조정 | (없음) |
| 드롭다운 | `/ko/to-pdf` | 이미지 → PDF | `#e6398c` |
| 드롭다운 | `/ko/pdf-to-image` | PDF → 이미지 | `#8e44ad` |
| 드롭다운 | `/ko/crop` | 자르기·회전 | `#0a84ff` |
| 드롭다운 | `/ko/watermark` | 워터마크 | `#30b0c7` |
| 드롭다운 | `/ko/mask` | 블러·픽셀화 | `#ff375f` |
| 드롭다운 | `/ko/bg-remove` | 배경 제거 | `#34c759` |
| 드롭다운 | `/ko/ocr` | 이미지 → 텍스트 | `#ff9500` |
| 드롭다운 | `/ko/favicon` | 파비콘 생성기 | `#6e6e73` |
| 우측 | `/ko/blog/` | 블로그 | — |
| 트리거 | — | 모든 도구 | — |

- 라벨 소스: `d.navMore`="모든 도구", `d.navBlog`="블로그", 12개 도구 = `d.allin/compress/convert/resize/topdf/pdfimg/crop/wm/maskT/bg/ocr/fav.title`.
- 언어 8종 라벨: 한국어 / English / 日本語 / 简体中文 / 繁體中文 / Bahasa Indonesia / ไทย / Русский (`src/lib/i18n/config.ts`).
- 드로어 순서: `블로그 → 4개 main → 8개 more` (13줄, 아이콘 없음).

## 5. 푸터 수치

| 항목 | 값 |
|---|---|
| 셸 | `border-top:1px solid rgba(210,210,215,.6)` / dark `rgba(58,58,60,.6)`, `margin-top:40px` |
| 컨테이너 | `max-width:896px; margin:0 auto; padding:32px 20px` (`max-w-4xl`, 본문 `main`과 동일 폭, 헤더 1280px와 **비대칭**) |
| 텍스트 | `font-size:14px; color:muted(#6e6e73 / #98989d); line-height:1.625`(22.75px), weight 400 |
| 1행 | `footer.notice` = "이미지는 브라우저(내 컴퓨터)에서만 처리되며 서버로 전송되지 않습니다." |
| 2행 | `footer.tagline` = "Imgwind — 무료 온라인 이미지 도구", `margin-top:6px` |

## 6. Bricks 요소 트리 (헤더 템플릿)

전제: `bricks_template` / `_bricks_template_type=header` / 조건 `[{"main":"any"}]`. 루트에 `<header>` 태그 금지(Bricks가 래핑). 트리 최상위 2개(section + offcanvas) 허용.

| # | Bricks 요소 | 클래스 | 주요 설정 | 대체/주의 |
|---|---|---|---|---|
| 1 | `section` | `up-header` | padding 16px 0, bg fog/80, border-bottom, min-height 68px, z-index 40 | sticky는 템플릿 설정 `headerSticky:true` + `headerStickyOnScroll:false` 권장(요소 `_position:sticky`도 가능하나 래퍼와 중복 금지) |
| 1.1 | `block` | `up-wrap` | flex row / center / gap 24 / max-width 1280 / margin auto / padding 0 20 | |
| 1.1.1 | `block` | `up-brand` | flex, align center, `line-height:0`, flex-shrink 0 | 로고 2장 래퍼 |
| 1.1.1.1 | `image` | `up-logo` | height 32 (≤767 28), width auto, alt "Imgwind", link → 홈 | 또는 `logo` 요소(라이트/다크 지원 여부 확인) |
| 1.1.1.2 | `image` | `up-logo-dark` | 동일 규격, `alt=""`+`aria-hidden`, 기본 `display:none` | 다크에서 표시 |
| 1.1.2 | `block` (`tag:nav`) | `up-nav` | flex / center / gap 28 / nowrap, `≤991 display:none` | |
| 1.1.2.1 | `text-link` ×4 | `up-nav-link` | 16/700/ink, hover·current primary | 4개 main |
| 1.1.2.2 | `dropdown` | `up-nav-more` | `toggleOn:"both"`, `contentWidth:224px`, 다크/카드 토큰, `static:false` | 트리거 텍스트 "모든 도구" |
| 1.1.2.2.1 | `block` | (필수 `brx-dropdown-content`) | `up-dropdown` 병기: padding 6px 0, radius 18, border hairline/60, margin-top 16 | Bricks 마크업상 `.brx-dropdown-content` 래퍼 필요 |
| 1.1.2.2.1.1 | `text-link` ×8 | `up-dropdown-item` | flex, gap 10, padding 8px 16px, 16px, hover fog+primary | 아이콘은 `text-link`의 `icon`(16px) + `iconColor` = accent |
| 1.1.3 | `block` | `up-tools` | `margin-left:auto`, flex, gap 12 (`≤991` 6) | |
| 1.1.3.1 | `text-link` | `up-blog` | 16/700/ink→primary, `≤767 display:none` | `/ko/blog/` 내부 링크 |
| 1.1.3.2 | `block` | `up-lang` | `position:relative`, flex-shrink 0 | 아래 6-A 참고 |
| 1.1.3.2.1 | `code` (HTML+JS) 또는 `shortcode` | — | `<select class="up-lang-select">` 8옵션 + 화살표 SVG | **커스텀 코드 불가피** |
| 1.1.3.3 | `toggle-mode` | `up-theme` | 36×36, radius 980, icon(달)/iconDark(해), 17px, color ink | 네이티브 다크 토글. 동작 검증 필요(§10) |
| 1.1.3.4 | `toggle` | `up-burger` | 36×36, radius 980, `barColor:ink`, `ariaLabel:"모든 도구"`, `≤991`만 표시 | 인터랙션 `toggleOffCanvas` → #2 |
| 2 | `offcanvas` | `up-drawer` | direction right, width 300px, backgroundColor surface, `closeOn:[backdrop,esc]`, `noScrollBody:true`, z-index 70, backdrop `rgba(0,0,0,.5)`, transition 200ms | **1번 섹션의 형제**로 배치(블러 조상 밖) — §11 |
| 2.1 | `block` | `up-drawer-head` | height 69px, padding 0 16, flex, space-between, border-bottom | 로고 2장 재사용 |
| 2.1.1 | `block`→`image`×2 | `up-brand`/`up-logo`/`up-logo-dark` | 헤더와 동일 규격 | |
| 2.1.2 | `icon` (`tag:button`) | `up-drawer-close` | 32×32, radius 980, muted→(fog+ink), 아이콘 16px X | 인터랙션 `closeOffCanvas` / `aria-label="닫기"` |
| 2.2 | `block` (`tag:nav`) | `up-drawer-nav` | flex column, padding 8px 0, overflow-y auto | |
| 2.2.1 | `text-link` ×13 | `up-drawer-link` | padding 12px 20px, 14px, hover fog, current primary+700 | |

### 6-A. 언어 스위처(가장 큰 미지수)

| 안 | 구현 | 장점 | 단점 |
|---|---|---|---|
| A | `shortcode` 요소 + WPML(`[wpml_language_selector_widget]`) / Polylang(`pll_the_languages`) | 네이티브 위젯, 유지보수 쉬움 | 위젯 디자인이 스펙과 다름(select 스타일 강제 필요) |
| B | `code` 요소: `<select class="up-lang-select">` + JS(`location.href`를 로케일 세그먼트만 교체) | 픽셀 패리티 100% | 커스텀 코드, WP 다국어 플러그인 미사용 시 URL 규칙 직접 관리 |
| C | `dropdown` + `text-link` 8개(각 언어 홈/현재 페이지) | 순수 네이티브 | "현재 경로 유지" 로직을 서버에서 못 만듦 → 각 링크를 언어별 페이지로 수동 지정 |

권장: **B** (플러그인 미도입 전제) — 단 §12 Q1 확정 후.

## 7. Bricks 요소 트리 (푸터 템플릿)

조건 `[{"main":"any"}]`, `_bricks_template_type=footer`, 루트 `<footer>` 태그 금지.

| # | Bricks 요소 | 클래스 | 설정 |
|---|---|---|---|
| 1 | `section` | `up-footer` | border-top 1px hairline/60, margin-top 40px, padding 0 |
| 1.1 | `block` | `up-footer-wrap` | max-width 896, margin 0 auto, padding 32px 20px |
| 1.1.1 | `text-basic` (`tag:p`) | `up-footer-text up-footer-notice` | 14px, muted, lh 1.625, 문구 = `footer.notice` |
| 1.1.2 | `text-basic` (`tag:p`) | `up-footer-text up-footer-tag` | 동일 + margin-top 6px, 문구 = `footer.tagline` |

## 8. 전역 클래스 (`up-` 접두)

표기: **D**=desktop(base) / **991**=tablet_portrait / **767**=mobile_landscape / **478**=mobile_portrait. 값이 같으면 D만 기재.

| 클래스 | 설정 | D | 991 | 767 | 478 |
|---|---|---|---|---|---|
| `up-header` | display | block | — | — | — |
| | padding | `16px 0` | | | |
| | background | `rgba(245,245,247,.8)` (dark `rgba(5,5,6,.8)`) | | | |
| | border-bottom | `1px solid rgba(210,210,215,.6)` (dark `rgba(58,58,60,.6)`) | | | |
| | min-height / z-index | `68px` / `40` | | | |
| | backdrop-filter | `blur(12px)` (`_cssCustom`) | | | |
| `up-wrap` | display / align / gap | `flex` / `center` / `24px` | | | |
| | max-width / margin / padding | `1280px` / `0 auto` / `0 20px` | | | |
| `up-brand` | display / align / line-height | `flex` / `center` / `0` | | | |
| `up-logo` | height / width | `32px` / `auto` | 32px | `28px` | 28px |
| `up-logo-dark` | display | `none` → dark: `block` (dark 시 `up-logo` none) | | | |
| `up-nav` | display / align / gap | `flex` / `center` / `28px` | `none` | none | none |
| | white-space / align-self | `nowrap` / `stretch` | | | |
| `up-nav-link` | font-size / weight / color | `16px` / `700` / ink | | | |
| | hover / current | primary / primary | | | |
| `up-nav-more` | (up-nav-link 상속) + cursor | `pointer` | — (`up-nav`이 숨김) | | |
| `up-dropdown` | min-width / padding | `224px` / `6px 0` | — | — | — |
| | background / border / radius | surface / `1px hairline(.6)` / `18px` | | | |
| | margin-top / z-index / box-shadow | `16px` / `50` / `none` | | | |
| `up-dropdown-item` | display / gap / padding | `flex` / `10px` / `8px 16px` | — | — | — |
| | font-size / color / nowrap | `16px` / ink / `nowrap` | | | |
| | hover | bg `fog`, color primary | | | |
| `up-tools` | display / align / margin-left | `flex` / `center` / `auto` | | | |
| | gap | `12px` | `6px` | 6px | 6px |
| `up-blog` | font-size / weight / color | `16px` / `700` / ink (hover primary) | | `none` | none |
| `up-lang` | position / flex-shrink | `relative` / `0` | | | |
| `up-lang-select` | height / radius / border | `28px` / `980px` / `1px hairline` | | | |
| | background / color / font-size | surface / ink / `14px` | | | |
| | padding / appearance | `0 24px 0 10px` / `none` | | | |
| | hover / focus | border muted / border primary | | | |
| `up-theme` | width×height / radius | `36px` / `980px` | | | |
| | display / align / color | `flex` / `center` / ink | | | |
| | hover bg | `rgba(29,29,31,.1)` (dark `rgba(245,245,247,.1)`) | | | |
| `up-burger` | width×height / radius / color | `36×36` / `980px` / ink | `display:flex` | flex | flex |
| | display | `none` | | | |
| `up-drawer` | width / direction / bg | `300px` / `right` / surface | (드로어는 ≤991 전용) | | |
| | z-index / transition | `70` / `200ms` | | | |
| `up-drawer-head` | height / padding | `69px` / `0 16px` | | | `62px` |
| | display / justify / border-bottom | `flex` / `space-between` / `1px hairline(.6)` | | | |
| `up-drawer-close` | width×height / radius / color | `32×32` / `980px` / muted | | | |
| | hover | bg fog, color ink | | | |
| `up-drawer-nav` | padding / overflow / display | `8px 0` / `auto` / `flex column` | | | |
| `up-drawer-link` | padding / font-size / color | `12px 20px` / `14px` / ink | | | |
| | display / nowrap / hover | `flex` / `nowrap` / bg fog | | | |
| | current | primary + `700` | | | |
| `up-footer` | border-top / margin-top | `1px hairline(.6)` / `40px` | | | |
| `up-footer-wrap` | max-width / margin / padding | `896px` / `0 auto` / `32px 20px` | | | |
| `up-footer-text` | font-size / color / line-height | `14px` / muted / `1.625` | | | |
| `up-footer-tag` | margin-top | `6px` | | | |

토큰→Bricks 전역 변수: `--fog --surface --ink --muted --hairline --primary` (라이트/다크 2세트). 클래스는 변수만 참조하고 hex 하드코딩 금지.

## 9. 반응형 매핑 — Tailwind → Bricks (차이 명시)

| 동작 | 원본(Tailwind) | Bricks | 차이 |
|---|---|---|---|
| 주 메뉴 접힘 | `<lg` (`<1024`) | `tablet_portrait ≤991` | **992–1023px 32px 구간에서 데스크톱 nav 노출**(원본은 햄버거). 허용 또는 커스텀 중단점 1023 등록 |
| 로고 축소 | `<sm` 28px / `≥640` 32px | `≤767` 28px / `≥768` 32px | 640–767px 구간에서 원본은 32px, Bricks는 28px |
| 블로그 링크 노출 | `≥640` | `≥768` | 640–767px 구간 미노출 |
| 모바일 zoom 0.9 | `≤639` `body{zoom:.9}` | 없음 | 기본 미적용 권장(§12 Q3). 패리티 필요 시 커스텀 CSS 미디어쿼리 |
| 우측 클러스터 gap | `<1024` 6px / `≥1024` 12px | `≤991` 6px / `≥992` 12px | 992–1023 구간 6↔12 차이 |
| 컨테이너 패딩 | 전 구간 20px | 전 구간 20px | 없음 |

## 10. 동작(behavior) 재현 표

| 동작 | 원본 구현 | Bricks 구현 | 확인 포인트 |
|---|---|---|---|
| 드롭다운 열기 | `onMouseEnter` + 클릭 토글 + `onFocus` | `dropdown.toggleOn:"both"` | 키보드 포커스로도 열리는지 |
| 드롭다운 닫기 | 라우트 변경 / 래퍼 밖 mousemove / 문서 클릭 / Escape | Bricks 기본(외부 클릭·Esc) | mousemove 이탈 닫힘은 Bricks 기본 아님 → hover 닫힘 허용범위 확인 |
| 브리지 16px | 패널 `padding-top:16px` | dropdown content `margin-top:16px` + 카드 상단 정렬 | 헤더 보더선과 일치 |
| 모바일 드로어 | React portal → `document.body` (헤더 blur가 fixed 기준점을 바꾸므로) | `offcanvas`를 **블러 섹션 형제**로 배치 | 섹션 안에 넣으면 `backdrop-filter`가 containing block을 만들어 위치 붕괴 |
| 드로어 닫기 | 오버레이 클릭 / Escape / 라우트 변경 / X 버튼 | `closeOn:[backdrop,esc]` + close 버튼 인터랙션 | 라우트 변경 닫힘은 WP 풀 리로드로 자동 |
| 스크롤 락 | `body.style.overflow=hidden` | `offcanvas.noScrollBody:true` | |
| 드로어 헤더 높이 | `header.offsetHeight` 측정(폴백 62px) | CSS `69px` 고정 (`478` 62px) | 실측 69px = 68 + 1px 보더 |
| 언어 전환 | 쿠키 `NEXT_LOCALE`(1년, samesite=lax) + 현재 경로의 `[1]` 세그먼트 교체 후 push | 플러그인/커스텀 JS | 경로 보존 + 8개 로케일 |
| 테마 | pre-paint 인라인 스크립트(`localStorage.theme` → `html.dark`), 토글 시 클래스 + 저장 | `toggle-mode` 네이티브 | pre-paint 없으면 FOUC |
| 로고 스왑 | `.logo-light/.logo-dark` CSS + `.dark` 조상 | `up-logo`/`up-logo-dark` CSS | 다크 선택자 확인 후 매핑 |
| active 표시 | `pathname === href` → primary | text-link 자동 없음 → `aria-current`/조건, 또는 `nav-nested` 사용 | 상세 §12 Q4 |

## 11. 커스텀 코드 최소 목록 (네이티브로 불가한 지점)

| # | 지점 | 필요 코드 | 회피 가능성 |
|---|---|---|---|
| 1 | 헤더 블러 | `_cssCustom` (up-header): `-webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px)` | Bricks `_cssFilters`는 `filter`만 지원(backdrop 없음) → 불가 |
| 2 | 언어 스위처 | `code` 요소(select 8옵션 + JS) 또는 `shortcode` | `dropdown`+8링크로 대체 가능(경로 보존 로직 포기) |
| 3 | 테마 pre-paint | 테마/자식테마 헤더에 4줄 스크립트 | `toggle-mode`가 초기 상태를 서버에서 처리하면 생략 가능(검증 필요) |
| 4 | (선택) 모바일 zoom | `@media (max-width:639px){body{zoom:.9}}` | 미적용 권장 |

원본 pre-paint 스니펫(참고):
`localStorage.theme` → 없으면 `prefers-color-scheme` → `documentElement.classList.toggle("dark", isDark)`.

## 12. 미해결 질문 / 리스크

| # | 항목 | 내용 | 권장 |
|---|---|---|---|
| Q1 | 다국어 스택 | 정적 사이트는 Next `[locale]` 8종. WP에 WPML/Polylang이 있는지 미확인(현재 사이트에 다국어 플러그인 흔적 없음) | 언어 스위처 방식(A/B/C) 먼저 확정 |
| Q2 | 다크모드 네이티브 범위 | `toggle-mode` 요소가 실제로 토글하는 클래스/속성 미확인. 원본 CSS는 `html.dark` 전제(`.dark .logo-light{display:none}` 등) | 실요소 배치 후 DOM 확인, 다르면 CSS 오버라이드 1블록 추가 |
| Q3 | 모바일 zoom 0.9 | Bricks 중단점(767/478)과 원본(639) 불일치. zoom은 fixed 요소·브라우저 확대와 상호작용 | 미적용 + `478`에서 패딩/폰트 미세조정 |
| Q4 | active 링크 | `text-link`는 현재 페이지 자동 표시 없음 | `[aria-current="page"]` CSS 또는 `nav-nested`(+ WP 메뉴) 채택 |
| Q5 | 타깃 페이지 부재 | usepic.net 현재 **페이지 1개("블로그", postId 5, 빈 본문)**, 전역 클래스 0, 템플릿 0 → 12개 도구 링크 전부 404 | 페이지 생성 전 임시 `#` 또는 동시 구축 |
| Q6 | URL 구조 | 원본 `/{locale}/...` 강제. WPML 기본언어 prefix 정책에 따라 링크 규칙 재정의 필요 | 확정 후 `up-nav-link` href 일괄 수정 |
| Q7 | 폰트 | Pretendard 가변(2.0MB) + 로케일별 8종 스택 | Bricks custom font 업로드, 로케일별 스택은 `:lang()` CSS로 |
| Q8 | 그림자 패리티 | 원본 전역 `*{box-shadow:none}`으로 카드·드로어 그림자 0 | Bricks도 shadow 0 유지(추가 시 시각 차이) |
| Q9 | sticky + 블러 | Bricks sticky 헤더가 `transform`을 쓰는 모드(`headerStickyOnScroll`)에서 fixed 드로어 기준점이 바뀔 수 있음 | `headerStickyOnScroll:false`, Offcanvas는 형제 배치 |
| Q10 | z-index | 헤더 40 / 오버레이 60 / 드로어 70 — Bricks 관리자바·기타 레이어와 충돌 여부 | 실측 후 필요 시 100/110/120 |
| Q11 | 드로어 트랜지션 | 원본은 포털 즉시 렌더(애니메이션 없음), Bricks offcanvas는 슬라이드 | 200ms 슬라이드 채택(의도적 개선) 여부 승인 필요 |
| Q12 | 로고 에셋 | 4종 SVG(ko/en × light/white). Bricks 미디어 업로드 + `logo` 요소 지원 여부 | `image` 2장 방식이 확실 |

## 13. 구현 순서(권장)

1. 토큰(전역 변수·팔레트) → `up-*` 전역 클래스 생성(§8).
2. 헤더 템플릿: section→wrap→brand→nav(+dropdown)→tools, 조건 `any`, sticky on.
3. 푸터 템플릿: section→wrap→text×2, 조건 `any`.
4. Offcanvas(형제) + toggle 인터랙션, 반응형 값(991/767/478) 적용.
5. 언어 스위처·테마·pre-paint 결정 후 코드 블록 삽입.
6. 992/1023, 640/767, 478 구간 실측 비교(§9 차이 표 확인).
