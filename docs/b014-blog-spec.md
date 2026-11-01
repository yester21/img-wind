# b014.wordsense.kr 블로그 UI 구현 명세 (Bricks 네이티브 재구현용)

- 대상: `https://b014.wordsense.kr/` — WordPress + Bricks (Bricks 2.x: `frontend-layer.min.css`, `bricks-dl-mode` 존재) / Child theme `bricks-child`
- 분석 페이지: `/` (page-id-21), `/blog/` (Posts page, slug `blog`), `/price-basket/` (single post ID 23), `/category/think/` (term ID 3)
- 수집: 2026-11-01, `curl.exe` 원본 HTML + 인라인 CSS 전량. 브라우저 렌더 측정이 아닌 **정적 CSS/마크업 기준** 수치임(실효값 우선 표기).
- 원본 아티팩트: `D:\USEPIC\docs\raw\b014-{home,blog,post,category}.html`, `b014-*.inline.css`, `b014-frontend-layer.min.css`, `b014-child-style.css`, `tree-*.txt`(DOM 트리), `css-*-dp.txt`(파싱된 규칙), `facts-*.txt`

---

## 0. 전제: 이 사이트의 색은 "원본"과 "현재 적용값"이 다르다

인라인 CSS(=Bricks 테마스타일 원본)의 회색 계열을 Child theme `style.css`의 `/* # BEGIN hermes-aa-contrast */` 블록이 WCAG AA 대비로 **덮어쓴 상태**다. 재구현 시 둘 중 하나를 선택해야 한다.

| 용도 | 원본(인라인) | 현재 적용(Child override) |
|---|---|---|
| meta(날짜·캡션·읽기시간) `--dp-meta` | `#939393` | `#6e6e6e` |
| muted(보조문) `--dp-muted` | `#777777` | `#595959` (일부 요소만) |
| footer desc | `#888888` | `#666666` |
| footer copy | `#999999` | `#737373` |
| breadcrumb | `#888888` | `#666666` |
| nav 링크 | `#171717` | `#1B4332 !important` (액센트로 변경됨) |

→ 아래 명세는 **원본(인라인) 값**을 기준으로 쓰고, override가 있는 곳은 `→현재` 로 병기한다.

---

## 1. 디자인 토큰

### 1-1. 컬러 (Bricks Global Variables, `--dp-*`)

| 변수 | 값 | 용도 |
|---|---|---|
| `--dp-ink` | `#171717` | 본문/제목 텍스트 |
| `--dp-muted` | `#777777` | 보조 텍스트(섹션 부제, 피처 요약, 아카이브 카운트) |
| `--dp-line` | `#e8e8e8` | 1px 구분선(섹션 상단, 카드 하단, 아카이브 바) |
| `--dp-accent` | `#1B4332` | 카테고리 라벨, 페이지네이션 현재, 포커스 링 |
| `--dp-bg` | `#ffffff` | 배경 |
| `--dp-soft` | `#f7f7f7` | 요약 박스/썸네일 폴백 배경 |
| `--dp-footer` | `#fafafa` | 푸터 배경 |
| `--dp-excerpt` | `#686868` | 카드 요약문 |
| `--dp-meta` | `#939393` | 날짜/메타 |
| `--dp-link` | `#2D6A4F` | 본문 내 링크 |

토큰 밖 하드코딩 hex: `#ffffff`(헤더), `#fafafa`(푸터), `#f5f5f5`(태그 칩), `#f7f7f7`(요약/폴백), `#555555`(푸터 링크·인용·태그 텍스트), `#171717`(페이지네이션 숫자), `#777777`(더보기 링크·아카이브 인트로), `#888888`(브레드크럼), `#999999`(카피).

### 1-2. 타이포그래피

- 폰트: `"SUIT Variable"` (가변 폰트 1개 파일). `@font-face` 4개(weight 400/700/800/900) 모두 동일 파일 `SUIT-Variable-subset.woff2`, `font-display: swap`, `<link rel="preload" as="font" crossorigin>` 있음.
- `html { font-size: 100% }` = 16px 기준. `body`: **16px / 1.6 / letter-spacing -0.025em**. `h1~h6`도 동일 폰트·자간.
- 별도로 `:root`에 유체 스케일(`--space-2xs…--space-3xl`, `--text-xs…`)이 정의돼 있으나 **`var()` 사용처 0건 → 완전 미사용(무해)**.

| 역할 | 클래스(태그) | size / line-height / weight / letter-spacing |
|---|---|---|
| 아카이브 H1 | `.dp-archive-title` (h1) | 36 / 1.25 / 900 / -0.045em → 640px: 30 |
| 싱글 H1 | `.dp-article-title` (h1) | 38 / 1.4 / 800 / -0.05em → 640px: 29 |
| 섹션 타이틀 | `.dp-section-title` (h2) | 25 / – / 800 / -0.045em → 640px: 22 |
| 홈 상단 타이틀 | `.dp-section-head-title` (p) | 20 / – / 800 / -0.03em |
| 홈 상단 부제 | `.dp-section-head-sub` (p) | 14 / – / – / – |
| 피처 카테고리 | `.dp-feature-cat` (p) | 16 / – / 800 / – |
| 피처 제목 | `.dp-feature-title` (h2) | 29 / 1.4 / 800 / -0.045em → 640px: 25 |
| 피처 요약 | `.dp-feature-excerpt` (p) | 16 / 1.65 / – / – |
| 카드 카테고리 | `.dp-card-cat` (p) | 13 / 1.2 / 800 / – → 640px: 12 |
| 카드 제목 | `.dp-card-title` (h3 / 카테고리=**h2**) | 20 / 1.45 / 800 / -0.035em → 900px: 18 → 640px: 17 / 1.5 |
| 카드 요약 | `.dp-card-excerpt` (p) | 15 / 1.65 / – / – (640px 이하 `display:none`) |
| 메타 | `.dp-meta-item` (p) | 13 / – / – / – → 640px: 12 |
| 컴팩트 제목 | `.dp-compact-title` (h3) | 19 / 1.45 → 900px: 17 → 640px: 18 (비단조) |
| 더보기 링크 | `.dp-section-more` (a) | 14 / – / 700 / – |
| 싱글 카테고리 | `.dp-article-cat` (p) | 15 / – / 800 / – |
| 작성자명 | `.dp-author-name` (p) | 14 / – / 700 / – |
| 작성자 메타 | `.dp-author-date` (p) | 13 / – / – / – |
| 브레드크럼 | `.dp-breadcrumb` (div) | 14 / – / – / – (nav gap 8) |
| 커버 캡션 | `.dp-article-caption` (p) | 12 / – / – / – (우측 정렬) |
| 본문 | `.dp-post-content` | 18 / 1.9 / – / – → 640px: 17 / 1.85 |
| 본문 H2 | `.dp-post-content h2` | 25 / 1.5 / 800 / -0.03em (mt42 mb18) → 640px: 23 |
| 본문 H3 | `.dp-post-content h3` | 19 / 1.5 / 800 (mt32 mb14) |
| 태그 칩 | `.dp-tags a` | 14 / 1 / – / – |
| 푸터 링크 | `.dp-footer-link` (a) | 14 / – / 700 / – |
| 푸터 설명 | `.dp-footer-desc` (p) | 13 / 1.9 / – / – |
| 푸터 카피 | `.dp-footer-copy` (p) | 12 / 1.8 / – / – |
| 헤더 날짜 | `.dp-header-date` (p) | 13 / – / – / – |
| 내비 링크 | `#brxe-8jkpej .bricks-nav-menu > li > a` | 16 / – / 700 → 900px: 15 |

### 1-3. 반경 · 그림자 · 모션

- 반경: 카드 이미지 `8px`, 컴팩트 썸네일 `6px`, 요약박스 `8px`, 태그칩 `4px`, 페이지네이션 `50%`.
- 그림자: **전혀 없음**. 카드 테두리도 없음(플랫). 구분은 1px `--dp-line` 선과 여백만 사용.
- `transition` 선언: **0건**. 호버는 밑줄 토글만(즉시).

---

## 2. 페이지별 섹션 구조

### 공통 셸 (모든 페이지 동일)

```
<header id="brx-header">
  section.brxe-section.dp-header                       bg #ffffff, padding 0
    div.brxe-container.dp-wrap.dp-top                  [id brxe-vq1fl9] height 72 (실효), h-padding 0
      div.brxe-block.dp-brand        > a.brxe-logo > img.bricks-site-logo  (SVG, width 180)
    div.brxe-block.dp-nav-shell                         border-top/bottom 1px --dp-line
      div.brxe-block.dp-wrap.dp-nav-row                 height 56
        div.brxe-nav-menu.dp-nav  > nav.bricks-nav-menu-wrapper.never > ul#menu-dp-main-menu.bricks-nav-menu
          li > a  "Home" "/"  |  "Think" /category/think/  |  "Write"  |  "Learn"  |  "AI"
        p.brxe-text-basic.dp-header-date  "2026-11-01"   (동적: 현재 날짜)
<main id="brx-content"> … 페이지별 …
<footer id="brx-footer">
  section.brxe-section.dp-footer                        bg #fafafa, padding 38/0  (640px: 30)
    div.brxe-container.dp-wrap
      a.brxe-logo#brxe-zedahe > img.bricks-site-logo     width 180 (991px:160), margin-bottom 16
      div.brxe-block.dp-footer-links                     flex, gap 20 (640px:15), margin-bottom 12
        a.brxe-text-link.dp-footer-link ×5  (홈/Think/Write/Learn/AI)
      p.brxe-text-basic.dp-footer-desc    (사이트 설명문)
      p.brxe-text-basic.dp-footer-copy    "© 2026 The Pen and Prompt"
```

- 헤더 총 높이 = 72 + 1 + 56 + 1 = **130px** (900/767: 64+1+50+1 = 116, 478 이하: 56+… = 108).
- `nav.bricks-nav-menu-wrapper.never` = 모바일 메뉴 접힘 없음(항상 가로 메뉴). 햄버거 마크업/스크립트 없음.
- 내비 하단 2px 밑줄이 `.dp-nav-shell`의 1px 보더를 덮도록 `height 57px; margin-bottom: -1px` 트릭 사용.
- `nav.bricks-nav-menu-wrapper.never`의 `aria-label="주요 메뉴"`, 스킵링크 2개(`#brx-content`, `#brx-footer`), `#brx-new-tab-link-description`(sr-only) 존재.

---

### 2-1. 홈 `/`

`<section class="brxe-section dp-home bricks-lazy-hidden">` (padding 0) → `<div class="brxe-container dp-wrap dp-page">` (pt40 / pb80)

| # | 엘리먼트 | 클래스 | 내용 / 동적 |
|---|---|---|---|
| 1 | h1 | `.brxe-heading.dp-visually-hidden` | "The Pen and Prompt — 오늘의 이야기" (시각적으로 숨김, sr-only) |
| 2 | div (block) | `.dp-section-head` | flex, space-between, align-start |
| 2-a | p | `.dp-section-head-title` | 정적 "오늘, 꼭 알아야 할 이야기" |
| 2-b | p | `.dp-section-head-sub` | 정적 "가볍게 읽고, 깊이 이해하기" |
| 3 | div | `.dp-feature` | grid **1.5fr 1fr**, gap 32 |
| 3-L | **a** (block) | `.dp-card.dp-feature-main` | `{post_url}` / 쿼리 1건(최신) |
| 3-L-1 | p | `.dp-card-cat.dp-feature-cat` | `{post_terms_category}` |
| 3-L-2 | h2 | `.dp-feature-title` | `{post_title}` |
| 3-L-3 | p | `.dp-feature-excerpt` | `{post_excerpt}` |
| 3-L-4 | div | `.dp-meta` > p `.dp-meta-item` | `{post_date}` (Y-m-d) |
| 3-R | div | `.dp-feature-side` | 쿼리 3건(offset 1), flex column |
| 3-R-n | **a** (block) | `.dp-compact-card` | grid `minmax(0,1fr) 116px`, gap 20 |
| 3-R-n-1 | div | `.dp-compact-body` > p `.dp-card-cat.dp-compact-cat`, h3 `.dp-card-title.dp-compact-title`, div `.dp-meta`>p`.dp-meta-item` | 카테고리 / 제목 / 날짜 |
| 3-R-n-2 | img | `.brxe-image.dp-compact-cover` | `{featured_image}` 116×100 |
| 4 | div | `.dp-section.dp-section--first` | 상단 보더 없음, mt52 |
| 4-a | div | `.dp-section-bar` > h2 `.dp-section-title` "새로 나온 이야기" + a `.dp-section-more` "전체 보기" → `/blog/` | flex space-between |
| 4-b | div | `.dp-grid` | 쿼리 6건(최신) |
| 4-b-n | **a** (block) | `.dp-card` | img `.dp-cover` → div `.dp-card-body`(cat / h3 title / excerpt / meta) |
| 5 | div | `.dp-section` | border-top, mt52 pt34 |
| 5-a | | `.dp-section-bar` > h2 "Think" + a "더 보기" → `/category/think/` | |
| 5-b | | `.dp-grid` 4건 (tax: think) | `min-width:641px`에서 4번째 카드 `display:none` |
| 6 | div | `.dp-section` | 제목 "Write" / 더 보기 → `/category/write/` / grid 4건 (write) |
| 7 | div | `.dp-section` | 제목 "Learn" / 더 보기 → `/category/learn/` / grid 4건 (learn) |
| 8 | div | `.dp-section` | 제목 "AI" / 더 보기 → `/category/ai/` / grid 4건 (ai) |

관찰: 실제 렌더 카드 수 — 새로 나온 이야기 6, Think 4, Write 1, Learn 1, AI 1 (게시글 부족분).
피처 메인 카드에는 **이미지가 없음**(텍스트 전용). `.dp-feature-cover` 클래스는 CSS에 정의돼 있으나 미사용(예비 슬롯).

---

### 2-2. 블로그 목록 `/blog/` (Posts page)

`<section class="brxe-section dp-archive">` → `<div class="brxe-container.dp-wrap.dp-page">`

| # | 엘리먼트 | 클래스 | 내용 |
|---|---|---|---|
| 1 | h1 | `.brxe-heading.dp-archive-title` | **정적 텍스트 "전체"** (동적 아님) |
| 2 | div | `.dp-archive-bar` | `align-self:flex-start !important`, align-items flex-start |
| 2-a | p | `.dp-archive-count` | "전체 12개의 이야기" (총 건수 = `{query_results_count}`) |
| 3 | div | `.dp-grid` | 메인 쿼리 6건, 페이지당 6 |
| 3-n | **a** | `.dp-card` | img `.dp-cover` → div `.dp-card-body` > p `.dp-card-cat` / **h3** `.dp-card-title` / p `.dp-card-excerpt` / div `.dp-meta` > p `.dp-meta-item` |
| 4 | div | `.brxe-pagination.dp-pagination` | 숫자 1,2 + `→` 다음 |

- 아카이브 인트로(설명문) **없음** (카테고리와의 유일한 구조 차이).

---

### 2-3. 싱글 포스트 `/price-basket/` (post 23)

`<section class="brxe-section dp-single">` → `<div class="brxe-container.dp-article">` (**max-width 720**, padding 48/24/70/24, `display:block`)

| # | 엘리먼트 | 클래스 | 내용 / 동적 |
|---|---|---|---|
| 1 | div | `.dp-breadcrumb` > nav `.brxe-breadcrumbs[aria-label="이동 경로"]` | a.item "홈" / span.separator "/" / a.item `{term_name}` / "/" / span.item[aria-current=page] `{post_title}` |
| 2 | p | `.dp-article-cat` | `{post_terms_category}` (링크 아님) |
| 3 | h1 | `.dp-article-title` | `{post_title}` |
| 4 | div | `.dp-author` (flex, gap12, mt26 mb30) | 아바타 없음 |
| 4-a | div | `.dp-author-info` (flex column gap2) | |
| 4-a-1 | p | `.dp-author-name` | `{post_author}` (username "xogmszll") |
| 4-a-2 | div | `.dp-author-meta` (flex row, gap6) | |
| 4-a-2-1 | p | `.dp-author-date` | `{post_date}` |
| 4-a-2-2 | p | `.dp-author-date` | 정적 "|" |
| 4-a-2-3 | div | `.brxe-post-reading-time` | `data-suffix="분 읽기" data-calculation-method="characters" data-cpm="500"` (JS 계산) |
| 5 | img | `.brxe-image.dp-article-cover` | `{featured_image}` size-large, aspect 1.8, mt30 mb8 |
| 6 | p | `.dp-article-caption` | 정적 "사진 · DAILY PICK" |
| 7 | div | `.dp-post-content` > div `.brxe-post-content` | Gutenberg 본문 |
| 7-본문 | | `.wp-block-paragraph` / `.wp-block-heading`(h2,h3) / `.wp-block-list`(ul,li) / `.wp-block-group.dp-summary`(h3+p+ul) / `blockquote.wp-block-quote.dp-note` / `figure.wp-block-table > table(thead/tbody)` / 긴 URL 텍스트 링크 | |
| 8 | div | `.dp-tags` > ul `.brxe-post-taxonomy.post_tag` | li > a.bricks-button ×3 (경제 / 물가 / 생활) |
| 9 | section | `.brxe-section.dp-related-section` (**별도 섹션**, pt0 pb64) → div `.dp-wrap` → div `.dp-related-slot` (display block) | |
| 9-a | div | `.dp-section-bar` > h2 `.dp-section-title` "관련 글" | |
| 9-b | div | `.dp-grid` | 쿼리 4건(동일 카테고리, 현재 글 제외), 641px+ 에서 4번째 숨김 → 3장 노출 |
| 9-c | a | `.dp-card` | 목록 카드와 완전 동일 구조(h3) |

- 인라인 CSS에 `:where()` 셀렉터가 섞여 들어간 흔적(`:where(#brxe-3drx06)…`) = Bricks 커스텀 CSS가 페이지 스코프로 중복 출력된 잔재. 재현 시 무시 가능.

---

### 2-4. 카테고리 아카이브 `/category/think/`

`<section class="brxe-section dp-archive">` → `<div class="brxe-container.dp-wrap.dp-page">`

| # | 엘리먼트 | 클래스 | 내용 / 동적 |
|---|---|---|---|
| 1 | h1 | `.dp-archive-title` | `{term_name}` → "Think" |
| 2 | p | `.dp-archive-intro` | `{term_description}` → "비판적 사고, 브랜드 에스테틱, 통찰력을 다루는 칼럼" |
| 3 | div | `.dp-archive-bar` | `flex-direction: row` |
| 3-a | p | `.dp-archive-count` | "전체 8개의 이야기" |
| 4 | div | `.dp-grid` | 카테고리 메인 쿼리 6건 |
| 4-n | **a** | `.dp-card` | img `.dp-cover` → body: p `.dp-card-cat` / **h2** `.dp-card-title` / p `.dp-card-excerpt` / meta |
| 5 | div | `.dp-pagination` | 1,2 + `→` |

- **주의**: 2번은 실제 HTML이 `<p class="…dp-archive-intro"><p>설명</p></p>` — `<p>` 중첩(비정상). 브라우저는 자동 교정하므로 화면상 문제는 없지만 재현 시 그대로 만들지 말 것.
- 블로그 목록과 카드 마크업이 동일하나 카드 제목 태그만 `h3`(블로그) / `h2`(카테고리)로 다름.

---

## 3. 레이아웃 수치 표

### 3-1. 컨테이너 · 수직 리듬

| 항목 | 값 | ≤1399 | ≤640 |
|---|---|---|---|
| `.dp-wrap` width | 100% / **max-width 1120px** / margin auto | padding-l/r **24px** | padding-l/r **20px** |
| `.dp-page` 세로 패딩 | pt 40 / pb 80 | – | pt 28 / pb 48 |
| `.dp-article` (싱글) | max-width **720px**, p 48 / 24 / 70 / 24 | – | 28 / 20 / 45 / 20 |
| `.dp-section` (홈) | margin-top 52 + padding-top 34 + border-top 1 | – | 34 / 28 |
| `.dp-section--first` | margin-top 52 / padding-top 0 / 보더 없음 | – | 34 |
| `.dp-section-bar` | margin-bottom 24 | – | – |
| `.dp-section-head` | margin-bottom 24 | – | 20 |
| `.dp-archive-title` | margin-bottom 12 | – | – |
| `.dp-archive-bar` | margin-top 32 / margin-bottom **26** / padding-bottom 16 + border-bottom 1 | – | – |
| `.dp-pagination` | margin-top 45 | – | – |
| `.dp-related-section` | padding 0 / 0 / 64 / 0 | – | – |
| `.dp-footer` | padding 38 / 0, border-top 1 | – | 30 / 0 |
| 헤더 top row | height 72 (클래스값 86은 ID에 밀림) | 900·767: 64 | 478: 56 |
| 헤더 nav row | height 56 (nav 57, margin-bottom -1) | 900: 50 / nav 50 | – |

### 3-2. 그리드

| 컴포넌트 | columns | gap (row / column) | 결과 카드 폭 (1120 컨테이너 기준) |
|---|---|---|---|
| `.dp-grid` (목록·섹션·관련글) | `repeat(3, minmax(0,1fr))` | 34 / 24 | (1120−48)/3 = **357.33px** |
| `.dp-grid` @900 | 3 (유지) | 28 / 18 | 361.33px |
| `.dp-grid` @640 | `repeat(2, minmax(0,1fr))` | 28 / 14 | (100vw−40−14)/2 |
| `.dp-feature` (홈 상단) | `1.5fr 1fr` | – / 32 | 652.8 / 435.2 |
| `.dp-feature` @900 | `1.2fr 1fr` | – / 24 | 593.5 / 494.5 |
| `.dp-feature` @640 | `1fr` (스택) | – | – |
| `.dp-compact-card` | `minmax(0,1fr) 116px` | – / 20 | 본문 299.2 / 썸네일 116×100 |
| `.dp-compact-card` @900 | `minmax(0,1fr) 85px` | – / 12 | 썸네일 85×85 |
| `.dp-compact-card` @640 | `minmax(0,1fr) 100px` | – / 12 | 썸네일 100×88 |
| `.dp-feature-side` | flex column (자식 3개, 각자 padding 20/0 + border-bottom) | – | – |

### 3-3. 카드 내부

| 요소 | 값 |
|---|---|
| `.dp-card` | flex column, min-width 0, 배경 transparent, 보더/그림자 없음 |
| `.dp-cover` (이미지 래퍼) | width 100%, `aspect-ratio: 1.8`, `border-radius: 8px`, `img{object-fit:cover; width/height:100%}` |
| `.dp-card-cat` | margin: 16px 0 9px (640px: 12px 0 9px) |
| `.dp-card-title` | margin 0 |
| `.dp-card-excerpt` | margin-top 10 |
| `.dp-meta` | flex row, gap 12, margin-top 15 (640px: gap 5, wrap) |
| `.dp-compact-card` | padding 20/0, border-bottom 1px `--dp-line`; `:first-child` pt0, `:last-child` pb0 + 보더 제거 |
| `.dp-tags` | flex wrap, gap 8, margin-top 36; 칩 = bg `#f5f5f5`, r4, p 8/12 |
| 페이지네이션 버튼 | **38×38**, `border-radius:50%`, `display:grid; place-items:center`, 14px, `#171717`; 현재 = bg `--dp-accent` / `#ffffff`; ul gap **8** |
| 브레드크럼 | flex wrap, gap **8**, 구분자 "/" (`aria-hidden="true"`) |

---

## 4. 공통 컴포넌트 정의 (재사용 클래스)

7곳의 목록(홈 피처 사이드, 홈 섹션 그리드 4개, 블로그, 카테고리, 관련글)이 **동일 클래스 5종**을 공유한다. 엘리먼트 ID 클래스(`.brxe-xxxxxx`)는 인스턴스별 오버라이드용일 뿐, 시각 차이는 없음.

### 4-1. `dp-card` — 표준 포스트 카드 (30회 사용)
```
a.brxe-block.dp-card                              (Block, HTML tag = a, link = {post_url})
├ img.brxe-image.dp-cover                         (조건: featured image 있을 때만 출력)
└ div.brxe-block.dp-card-body
  ├ p.brxe-text-basic.dp-card-cat                 {post_terms_category}
  ├ h3|h2.brxe-heading.dp-card-title              {post_title}
  ├ p.brxe-text-basic.dp-card-excerpt             {post_excerpt}  (640px 이하 숨김)
  └ div.brxe-block.dp-meta > p.dp-meta-item       {post_date}
```
- 사용처: 홈 "새로 나온 이야기"·Think·Write·Learn·AI 그리드, `/blog/`, `/category/*`, 싱글 관련글.
- 파생: `.dp-card.dp-feature-main`(이미지 없는 대형 카드, 제목 클래스만 `.dp-feature-title`로 교체).

### 4-2. `dp-compact-card` — 컴팩트(가로) 카드 (홈 피처 우측 3개)
```
a.brxe-block.dp-card.dp-compact-card
├ div.brxe-block.dp-compact-body
│ ├ p.dp-card-cat.dp-compact-cat
│ ├ h3.dp-card-title.dp-compact-title
│ └ div.dp-meta > p.dp-meta-item
└ img.brxe-image.dp-compact-cover
```
- `.dp-card`의 변형이지만 **DOM 순서가 반대**(텍스트 → 이미지)이고 grid 2열.

### 4-3. `dp-section` + `dp-section-bar` — 홈 섹션 헤더 세트 (5회)
`div.dp-section(.dp-section--first)` > `div.dp-section-bar`(flex space-between, mb24) > `h2.dp-section-title` + `a.dp-section-more`.
`dp-section`은 `border-top:1px --dp-line` + `margin-top:52` + `padding-top:34`.

### 4-4. `dp-archive` 세트 — 목록 페이지 헤더 (2회: `/blog/`, 카테고리)
`h1.dp-archive-title` (+ `p.dp-archive-intro`, 카테고리만) + `div.dp-archive-bar`(mt32 mb26 pb16 border-bottom) > `p.dp-archive-count`.

### 4-5. `dp-wrap` / `dp-page` — 레이아웃 프리미티브
`.dp-wrap` = 1120 컨테이너(Block/Container 양쪽에 적용: `.dp-wrap.brxe-container`와 `.dp-wrap.brxe-block` 두 벌로 정의됨). `.dp-page` = 세로 패딩 40/80.

### 4-6. 싱글 전용 (1회성, 재사용 없음)
`dp-breadcrumb`, `dp-article-cat`, `dp-article-title`, `dp-author`(+`dp-author-info`,`dp-author-name`,`dp-author-meta`,`dp-author-date`), `dp-article-cover`, `dp-article-caption`, `dp-post-content`, `dp-tags`, `dp-related-section`+`dp-related-slot`.

### 4-7. CSS에만 존재하고 현재 미사용 (재현 시 구현 권장)
| 클래스 | 정의 | 용도 |
|---|---|---|
| `.dp-thumb-fallback` | flex center, `aspect-ratio:1.8`, r8, bg `#f7f7f7` | 썸네일 없는 글 대체 |
| `.dp-thumb-fallback-text` | 15px / 800 / `#777777` | 폴백 텍스트 |
| `.dp-empty` | padding 64/0, center, 15px, `--dp-muted` | 결과 0건 상태 |
| `.dp-feature-cover` | `.dp-cover`와 동일(aspect 1.8, r8) | 피처 메인 이미지 슬롯 |
| `.dp-tagline`, `.dp-footer-notice` | 텍스트 스타일만 | 헤더 태그라인 / 푸터 공지 |

---

## 5. 반응형 규칙 표

Bricks 브레이크포인트: 커스텀 **1399 / 900 / 640** + 기본 **991 / 767 / 478**, 그리고 범위지정 `(min-width: 641px)`.

| @media | 규칙 수 (home / blog / post / category) | 변경 내용 |
|---|---|---|
| `max-width: 1399px` | 2 / 2 / 2 / 2 | `.dp-wrap` 좌우 패딩 0 → **24px** (≥1400에서는 1120px가 화면에 딱 붙음 → 1399 이하에서 거터 확보) |
| `max-width: 991px` | 1 / 1 / 1 / 1 | 푸터 로고 180 → 160 |
| `max-width: 900px` | **17 / 13 / 13 / 13** | `.dp-feature` 1.2fr 1fr·gap24 / `.dp-grid` gap 28·18 / `.dp-card-title` 18 / `.dp-compact-card` 85px·gap12 / `.dp-compact-cover` 85×85 / `.dp-compact-title` 17 / 로고 160 / `.dp-top` 70(→ID 64) / `.dp-nav-row` 50 / nav gap 26·15px / nav 높이 50 / `.dp-header-date` **display:none** |
| `max-width: 767px` | 1 / 1 / **3** / 1 | 헤더 top 64(중복 선언) / 싱글 `.dp-author-info` `justify-content:space-between` + `.dp-author-meta` `flex-start` |
| `max-width: 640px` | **21 / 12 / 16 / 12** | `.dp-wrap` 20 / `.dp-page` 28·48 / `.dp-grid` **2열** gap 28·14 / `.dp-card-excerpt` **display:none** / `.dp-card-cat` 12·mt12 / `.dp-card-title` 17·1.5 / `.dp-meta` gap5·wrap / `.dp-meta-item` 12 / `.dp-section` 34·28 / `.dp-section-title` 22 / `.dp-section-head` block·mb20 / `.dp-feature` 1열 + `.dp-feature-side` mt24 / `.dp-feature-title` 25 / `.dp-compact` 100px·88 / `.dp-compact-title` 18 / `.dp-archive-title` 30 / `.dp-article` 28·20·45·20 / `.dp-article-title` 29 / `.dp-post-content` 17·1.85 / `.dp-summary` 20 / 본문 h2 23 / `.dp-footer` 30 / footer gap 15 |
| `max-width: 478px` | 2 / 2 / 2 / 2 | 로고 140 / 헤더 top 56 |
| `min-width: 641px` | 4 / 0 / 1 / 0 | 4건 쿼리 그리드에서 `> .dp-card:nth-child(n+4) { display:none }` — 데스크톱 3장 고정 |

- 640 이하는 900/1399 규칙도 함께 상속(중첩 max-width). 640 규칙이 항상 뒤에 와서 우선.
- 900~641 구간: 그리드는 **여전히 3열**(태블릿 2열 없음).
- 레이아웃에 실질 영향이 없는 것: 1399(거터만), 991·478(로고 폭), WP 코어에서 따라온 `(min-resolution:192dpi)`, `(max-width:600px)` 1건.

---

## 6. 동적 데이터 · 쿼리 · 페이지네이션 · 관련글

### 6-1. 쿼리 파라미터 (HTML `data-query-vars`에서 추출한 실제 값)

| 위치 | postType | posts_per_page | offset | orderby | tax_query / 기타 |
|---|---|---|---|---|---|
| 홈 · 피처 메인 | post | **1** | 0 | date DESC | – |
| 홈 · 피처 사이드 | post | **3** | **1** | date DESC | – |
| 홈 · 새로 나온 이야기 | post | **6** | 0 | date DESC | – |
| 홈 · Think | post | **4** | 0 | date DESC | category slug `think`, IN |
| 홈 · Write | post | 4 | 0 | date DESC | slug `write` |
| 홈 · Learn | post | 4 | 0 | date DESC | slug `learn` |
| 홈 · AI | post | 4 | 0 | date DESC | slug `ai` |
| `/blog/` | post | **6** | – | date DESC | `is_archive_main_query: true` (메인 쿼리), `pagename: blog` |
| `/category/think/` | post | **6** | – | date DESC | `category_name: think`, `is_archive_main_query: true` |
| 싱글 관련글 | post | **4** | – | date DESC | `post__not_in: [23]`, category name `Think`, IN |

공통: `post_status: publish`, `ignore_sticky_posts: true`, `paged` 반영. 페이지당 6건이 목록 기본값.

### 6-2. 동적 바인딩 목록

| 표시 항목 | 위치 | 바인딩 | 비고 |
|---|---|---|---|
| 글 제목 | 카드 `.dp-card-title`, 피처 `.dp-feature-title`, 싱글 H1 | `{post_title}` | escape 없음(텍스트) |
| 카드/카드 링크 | 카드 루트 `<a>` | `{post_url}` | 카드 전체가 링크 |
| 요약 | `.dp-card-excerpt`, `.dp-feature-excerpt` | `{post_excerpt}` | 수동 요약 없으면 WP 자동 발췌(글 제목으로 시작 + "…") |
| 카테고리 | `.dp-card-cat`, `.dp-article-cat` | `{post_terms_category}` | **링크 아님**(p 태그) |
| 카테고리(링크) | 브레드크럼 2번째 | `{term_url}` + `{term_name}` | a 태그 |
| 날짜 | `.dp-meta-item`, `.dp-author-date` | `{post_date}` → `Y-m-d` (예: 2026-10-07) | |
| 작성자 | `.dp-author-name` | `{post_author}` | 표시명이 아닌 로그인명("xogmszll"), 아바타/링크 없음 |
| 읽기 시간 | `.brxe-post-reading-time` | `{post_reading_time}` 요소 (문자수 ÷ 500 cpm, suffix "분 읽기") | JS 렌더 |
| 대표 이미지 | `.dp-cover`, `.dp-compact-cover`, `.dp-article-cover` | `{featured_image}` size `large`(1024×569) | alt = 글 제목 |
| 아카이브 제목 | `/category/*` H1 | `{term_name}` | `/blog/`는 정적 "전체" |
| 아카이브 설명 | `.dp-archive-intro` | `{term_description}` | 카테고리에만 존재 |
| 총 건수 | `.dp-archive-count` | `{query_results_count}` (앞에 정적 "전체 ", 뒤에 "개의 이야기") | `/blog/` 12, think 8 |
| 헤더 날짜 | `.dp-header-date` | 현재 날짜 (2026-11-01) | 900px 이하 숨김 |
| 본문 | `.brxe-post-content` | `{post_content}` | Gutenberg 블록 |
| 태그 | `.dp-tags` | Post Taxonomy 요소(taxonomy `post_tag`), 링크 O | li > a.bricks-button |
| 관련글 | `.dp-grid` (related) | 위 쿼리 | 4건 조회 → 3장 노출 |

### 6-3. 페이지네이션 (Bricks Pagination 요소)

- 마크업: `div.brxe-pagination.dp-pagination > div.bricks-pagination[role=navigation][aria-label="페이지네이션"] > ul.page-numbers > li`
- 페이지 1: `li > span.page-numbers.current[aria-current=page]"1"`, `li > a.page-numbers "2"`, `li > a.next.page-numbers[aria-label="다음 페이지"]"→"`
- 페이지 2: `li > a.prev.page-numbers[aria-label="이전 페이지"]"←"` 가 추가되고 현재 페이지는 `<span aria-current="page">`.
- 스타일: 버튼 38×38 원형, gap 8, 현재=액센트 배경/흰 글자, `.dp-pagination` margin-top 45, 중앙 정렬. `←`/`→`는 **텍스트 문자**(아이콘 폰트/SVG 아님).
- `/blog/`는 2페이지, `/category/think/`는 2페이지 존재(각 6건/페이지).

### 6-4. 관련글 규칙

- 조건: 동일 카테고리(첫 카테고리) 4건, 현재 글 제외, 최신순.
- 데스크톱은 3장만 노출(`nth-child(n+4)` 숨김), 640px 이하 2열에서 4장 모두 노출.
- 섹션은 `<main>` 안의 **별도 section**으로, 컨테이너는 `.dp-wrap`(1120)이고 본문용 720px과 다름.

---

## 7. 재현 시 주의사항

### 7-1. 이미지 · 폰트 · 외부 자산 (전부 원격, 반드시 대체 필요)
- 로고: `/wp-content/uploads/2026/10/pen-and-prompt.svg` (img width 180, `class="bricks-site-logo css-filter"`)
- 표지 이미지 **4종뿐**이고 12개 글에 재사용됨: `dp-cover-groceries-01`, `-02`, `dp-cover-city-01`, `-02` (모두 1024×569 JPEG). 글별 고유 이미지가 아니므로 새 사이트에서는 실제 대표 이미지로 교체.
- 폰트: `SUIT-Variable-subset.woff2` (한 파일로 400/700/800/900 4개 `@font-face`). 다른 폰트로 갈 경우 **800·900 웨이트가 실제로 존재하는지** 확인(이 디자인의 제목은 800, 아카이브 H1은 900 의존).
- 파비콘 32/180/192/270 PNG.

### 7-2. lazy-load 아티팩트 (`bricks-lazy-hidden`)
- 모든 `<img>`의 `src`는 `data:image/svg+xml,%3Csvg…viewBox='0 0 1024 569'%3E` (1×1 대체 SVG)이고 실제 URL은 `data-src`. `data-sizes="(max-width:1024px) 100vw, 1024px"`, `decoding="async"`, 첫 이미지에 `fetchpriority="high"`.
- `bricks-lazy-hidden` 클래스는 section/container/block에도 붙음(홈 94개). 의미는 `background-image:none!important` 하나뿐 → **레이아웃 무영향**. 스크래핑한 HTML을 그대로 쓰면 이미지가 비어 보이는 원인.
- `a.brx-query-trail[href="#"][role="presentation"]` = Bricks 쿼리 루프 추적용 빈 앵커. 재현 대상 아님(시각/접근성 영향 없음).
- 첫 카드 `data-brx-loop-start="<element-id>"` = 루프 시작 마커.

### 7-3. 호버 · 포커스
- 호버: 카드(`.dp-card`, `.dp-compact-card`, `.dp-feature-main`)에서 **제목에만** `text-decoration: underline; text-underline-offset: 4px`. 이미지 확대/그림자/색 변화 **없음**.
- 포커스: `.dp-card:focus-visible`, `.dp-compact-card:focus-visible` → `outline: 3px solid var(--dp-accent); outline-offset: 5px`.
- `.dp-section-more`("전체 보기"/"더 보기"), `.dp-footer-link`, 내비 링크에는 **호버 스타일이 정의돼 있지 않음**(내비는 현재 페이지에만 2px 밑줄). 재현 시 최소한의 hover를 추가할지 결정 필요.
- 현재 상태에선 내비 링크가 Child override로 `#1B4332 !important`(액센트)가 되어 원본(`#171717`)과 다름 — 원본 기준으로 재현하려면 그 override를 가져오지 말 것.

### 7-4. 접근성
- 홈 H1은 `.dp-visually-hidden`(1×1, `clip-path: inset(50%)`, `white-space: nowrap`, absolute)로 숨김 — 유지 권장.
- 카드 전체가 `<a>`이고 내부에 제목·이미지가 들어감 → 이미지 `alt`가 제목과 **중복 낭독**됨. 재현 시 카드 이미지 `alt=""`(장식) 권장.
- 제목 레벨 불일치: `/blog/`는 H1 다음 **H3**(H2 없음), `/category/`는 H2. 재현 시 통일 필요.
- 브레드크럼: `nav[aria-label="이동 경로"]`, 구분자 `aria-hidden="true"`, 현재 항목 `aria-current="page"` — 그대로 유지.
- 페이지네이션: 현재 페이지 `span[aria-current="page"]`, 화살표에 `aria-label="이전/다음 페이지"`.
- `.dp-visually-hidden`은 `.brxe-heading`에 붙어 있고 `margin:-1`·`padding:0`·`border:0` 보강.
- 목록 페이지의 `.dp-archive-count`는 "전체 12개의 이야기"로 스크린리더에 유용.

### 7-5. 마크업/구현 결함 (그대로 베끼지 말 것)
1. 카테고리 인트로 `<p>` 안에 `<p>` 중첩(§2-4).
2. `/blog/` H1이 정적 "전체" — 아카이브 템플릿으로 통합한다면 `{term_name}`/`{archive_title}`로 바꾸는 게 자연스러움.
3. `.dp-top`의 86px는 ID(`#brxe-vq1fl9` 72px)에 항상 밀려 **죽은 선언**. 900px에서도 70 vs 64로 중복. 재현 시 하나로 정리.
4. `.dp-nav`의 `overflow-x: auto` + `gap 26`(900px) 조합은 좁은 화면에서 가로 스크롤을 만들 수 있음.
5. `:root`의 유체 스페이싱 토큰(`--space-*`, `--text-*`)은 미사용 — 새로 만들 때 이 스케일을 채택할지 별도 결정.
6. `bricks-dl-mode` 스크립트가 `localStorage.brx_mode` / `data-brx-theme`를 세팅하지만 **다크 팔레트 CSS는 없음**(기본 light). 무해하나 재현 시 제거 가능.
7. `.dp-compact-title`은 19 → 17(900) → 18(640)로 **비단조**. 의도인지 확인 필요.

---

## 8. 브릭스 네이티브 요소 매핑 제안

| 현재 산출물 | Bricks 요소 | 설정 |
|---|---|---|
| `section.brxe-section.dp-header/.dp-home/.dp-archive/.dp-single/.dp-related-section` | **Section** | padding 0(테마스타일 기본값 제거), tag `section` |
| `.dp-wrap` (Container) | **Container** | max-width 1120, `width:100%`, 좌우 패딩 0→24→20, margin auto |
| `.dp-grid`, `.dp-feature`, `.dp-feature-side`, `.dp-card`, `.dp-card-body`, `.dp-meta`, `.dp-section-bar`, `.dp-section`, `.dp-archive-bar`, `.dp-related-slot`, `.dp-tags`, `.dp-author*` | **Block (div)** | `_display:grid/flex` 네이티브 설정으로. 카드 루트는 **HTML tag = `a`** + Link `{post_url}` |
| 카드 이미지 | **Image** | dynamic `{featured_image}`, size `large`, `aspect-ratio` 는 테마스타일 대신 클래스에 `aspect-ratio:1.8` + `object-fit:cover`, radius 8 |
| 카드 제목 | **Heading** (h3/h2) | dynamic `{post_title}`, 링크 없음(카드 전체가 링크) |
| 카드 카테고리 | **Basic Text** (p) | dynamic `{post_terms_category}`, 링크 없음 |
| 카드 요약 | **Basic Text** (p) | dynamic `{post_excerpt}`, 640px 이하 `display:none` |
| 카드 날짜 | **Basic Text** (p) | `{post_date}` + format `Y-m-d` |
| 목록/섹션/관련글 | **Block + Query Loop** | Query type `post`, `posts_per_page` 6/4/1/3, offset, `orderby date DESC`, tax_query. 홈 카드 7개 루프는 **공통 컴포넌트(카드) 1개 + 루프 7개**로 구성 권장 |
| 페이지네이션 | **Pagination** | loop 요소 참조, prev/next 화살표 문자 `←`/`→`, 원형 38px |
| 아카이브 헤더 | **Heading** + **Basic Text** | `{term_name}` / `{term_description}` / `{query_results_count}` |
| 싱글 본문 | **Post Content** | `.dp-post-content` 타이포는 클래스로 자식(h2/h3/p/ul/blockquote/table)에 직접 지정 |
| 태그 | **Post Taxonomy** | taxonomy `post_tag`, 링크 O, 칩 스타일 |
| 브레드크럼 | **Breadcrumbs** | separator "/" 텍스트, `aria-label` 유지 |
| 읽기 시간 | **Post Reading Time** | suffix "분 읽기", characters, 500 cpm |
| 내비 | **Nav Menu** | WordPress 메뉴 `dp-main-menu`, mobile menu **없음(never)**, 링크 border-bottom 2px |
| 로고 | **Logo** | width 180/160/140(991·478) |
| 헤더 날짜 | **Basic Text** | `{current_date}` 형식, 900px 이하 숨김 |

### 권장 구조(중복 제거)
1. **Component** `Card / Post (Grid)` — §4-1 트리 그대로. properties: image on/off, heading level, excerpt on/off. 홈 5개 섹션·블로그·카테고리·관련글이 모두 이 컴포넌트 인스턴스.
2. **Component** `Card / Post (Compact)` — §4-2.
3. **Template** `Section Bar` — `h2.dp-section-title` + `a.dp-section-more` (title/URL을 properties로).
4. **Archive 템플릿 1개**(카테고리·태그·작성자 조건) + **Page `/blog/`**(Posts page)로 §4-4 헤더 세트 공유. 이때 `/blog/` H1은 정적 "전체" 대신 `{archive_title}` 또는 커스텀 텍스트.
5. **Single 템플릿**(post) — §2-3 트리 + 관련글 섹션 포함.

### 브랜드 교체 시 손대야 할 지점(요약)
- 컬러: `--dp-ink/accent/link/muted/excerpt/meta/line/soft/bg/footer` 10개 변수만 교체하면 전체 반영. 단 하드코딩된 `#f5f5f5`, `#555`, `#888`, `#999`, `#171717`는 수동 치환 필요.
- 폰트: `"SUIT Variable"` 2곳(body, h1~h6) + `@font-face` 4개. 800/900 웨이트 확보 필수.
- 간격: 1120 / 52 / 34 / 24 / 20 / 45 / 32 / 26 / 16 / 15 / 12 / 9 / 8 / 5 px 조합이 사실상 전부(8px 배수 아님, 34·26·45·15·9 등 홀수 값 사용).
