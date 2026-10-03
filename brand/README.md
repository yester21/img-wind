# imgwind (이미지윈드) 로고

## 콘셉트 — "바람처럼 빠르고 가볍게"
- **타일 + 산** = 이미지(사진) 아이콘
- **끝이 말린 줄** = 바람
- **타일 밖으로 이어진 두 줄** = 속도선. 로고 전체가 오른쪽(글자 쪽)으로 휙 지나가는 느낌
- 하늘색 그라데이션(`#0071e3 → #3cc8ff`)과 한 단계 가벼운 글자 굵기로 경쾌함을 줌

## 파일
| 파일 | 용도 |
|---|---|
| `imgwind-logo.svg` | **기본 로고, 모든 언어 공통** (ko/en/ja/zh/zh-TW/id/th/ru) |
| `imgwind-logo-ko.svg` | 한국어 표기 로고 (국내 마케팅·보도자료 등 선택 사용) |
| `*-white.svg` | 어두운 배경용 |
| `*-mono.svg` | 단색(인쇄·워터마크) |
| `imgwind-symbol.svg` | 심볼 (속도선 포함). SNS 프로필, 넓은 자리 |
| `imgwind-symbol-tile.svg` / `imgwind-favicon.svg` | 타일만 있는 심볼. 파비콘·앱 아이콘·OG 이미지 (작을 때 속도선은 생략) |
| `imgwind-symbol-white.svg` | 파란 배경 위 심볼 |
| `imgwind-wordmark*.svg` | 글자만 |

글자는 Pretendard를 패스로 변환해 두어서 폰트 설치 없이 어디서나 똑같이 보입니다.

## 색상
| 이름 | 값 |
|---|---|
| Wind Blue | `#0071e3` (사이트 `--color-primary`) |
| Sky | `#3cc8ff` (그라데이션 끝, 어두운 배경의 'wind' 글자) |
| Ink | `#1d1d1f` |

## 다국어 규칙
1. 사이트 헤더·파비콘은 **모든 언어에서 `imgwind` 로고 하나**를 씁니다. 브랜드명은 번역하지 않습니다.
2. 한국어 로고는 국내용 보조 로고입니다.
3. `img` / `wind` 두 가지 색 규칙은 다른 문자로 표기할 때도 유지합니다 (이미지 + **윈드**).

## 사용 규칙
- 여백: 로고 주변에 타일 높이의 50% 이상을 비웁니다.
- 최소 크기: 가로형 로고 높이 20px, 타일 심볼 16px.
- 속도선은 항상 **왼쪽**에 둡니다 (오른쪽으로 나아가는 방향). 좌우 반전은 금지합니다.

## 다시 만들기
`python make_logo.py` (필요: `pip install fonttools brotli`, 같은 폴더의 `PretendardVariable.woff2`, OFL 라이선스)
