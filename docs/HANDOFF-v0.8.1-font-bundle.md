# HANDOFF: v0.8.1 — Bundle all CJK + Latin fonts (Option B-full)

> **새 세션용 인계 문서**. 이전 세션 컨텍스트가 소진되어 작업을 이어가기 위해 작성. 승인 완료된 상태이므로 새 세션에서 바로 실행 가능.

---

## 배경

사용자가 **Claude Cowork (샌드박스 환경)**에서 플러그인을 사용해 한글 슬라이드 PDF를 만들었는데 **한글이 □(tofu)로 표시**됨.

근본 원인:
1. Playwright의 번들 Chromium에는 CJK 시스템 폰트 없음
2. Cowork 샌드박스는 jsdelivr/Google Fonts CDN 외부 차단
3. 현재 `theme-foundation.css`의 fallback chain `local() → fonts/ → CDN` 중 **세 층 모두 실패**
4. `font-display: block`이 대기해도 **로드할 파일이 없어** 시스템 fallback으로 떨어짐
5. 현재 플러그인 zip에는 `assets/fonts/` 디렉토리가 **경로만 있고 실제 woff2 파일이 없음**

**사용자 결정**: `B-full` — Pretendard + 모든 CJK sans/serif + Inter + JetBrains Mono를 플러그인에 번들. zip +10–25MB 예상. 라이선스는 모두 SIL OFL 1.1으로 재배포 허용.

**즉시 해결 (현 Cowork 세션)**: Cowork Claude가 제안한 `sudo apt install fonts-noto-cjk` 수락 권유됨 — 단, 해당 세션에서만 임시.

**영구 해결 (이 핸드오프)**: v0.8.1 릴리스로 폰트 번들링.

---

## 이전 세션 종료 시점 상태

```
Plugin version: 0.8.0 (tag v0.8.0, release with ZIP published)
Branch: main, synced with origin
Working tree: clean

Recent commits:
  5cf714a fix(hooks): remove non-event top-level keys from hooks.json
  b42574a docs(README): sync with v0.8.0 changes
  5889440 feat: v0.8.0 — best-practices reflection (Gotchas + PLUGIN_DATA + verification)

Git remote: https://github.com/kimmingul/marp-slide-studio
Current repo size: ~1.4 MB (without fonts)
Current release zip: 254 KB
```

`assets/fonts/`의 현 상태 — 디렉토리만 존재, woff2 파일 0개:
```
assets/fonts/
├── README.md                (2256 bytes, 설명만)
├── jetbrains-mono/          (빈 디렉토리)
├── noto-serif-kr/           (빈 디렉토리)
└── pretendard/              (빈 디렉토리)
```

---

## 실행 체크리스트 (새 세션에서 순서대로)

### 단계 1: 환경 확인

```bash
cd /Users/min/Projects/marp/marp-slide-studio
git status          # clean 확인
git pull            # 원격 최신 동기화
ls assets/fonts/    # 현재 상태 확인
```

### 단계 2: `scripts/fetch-fonts.sh` 확장

현재 이 스크립트는 다음만 받음:
- Pretendard Variable (1 woff2, ~3MB)
- Noto Serif KR (4 static weights, ~6MB, **Google Fonts CDN hash URL — 불안정**)
- JetBrains Mono (3 static weights, ~1MB)

**B-full에 필요한데 누락된 것**:
- Noto Sans JP / SC / TC (주요 body 폰트 — 없으면 일본어·중국어 본문이 또 tofu)
- Noto Serif JP / SC / TC (editorial 테마용)
- Inter (Latin body 기본)

**URL 전략**: Google Fonts gstatic 해시 URL은 버전 업 시 만료됨. **@fontsource mirror (jsdelivr 호스팅)** 사용 권장 — 안정적이고 버전 고정 가능.

| 폰트 | URL 패턴 | 파일 수 |
|------|----------|---------|
| Pretendard Variable | `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/variable/PretendardVariable.woff2` (기존) | 1 |
| Inter Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/inter@latest/files/inter-latin-wght-normal.woff2` | 1 |
| Noto Sans JP Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/noto-sans-jp@latest/files/noto-sans-jp-japanese-wght-normal.woff2` | 1 |
| Noto Sans SC Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/noto-sans-sc@latest/files/noto-sans-sc-chinese-simplified-wght-normal.woff2` | 1 |
| Noto Sans TC Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/noto-sans-tc@latest/files/noto-sans-tc-chinese-traditional-wght-normal.woff2` | 1 |
| Noto Serif JP Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/noto-serif-jp@latest/files/noto-serif-jp-japanese-wght-normal.woff2` | 1 |
| Noto Serif SC Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/noto-serif-sc@latest/files/noto-serif-sc-chinese-simplified-wght-normal.woff2` | 1 |
| Noto Serif TC Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/noto-serif-tc@latest/files/noto-serif-tc-chinese-traditional-wght-normal.woff2` | 1 |
| Noto Serif KR Variable | `cdn.jsdelivr.net/npm/@fontsource-variable/noto-serif-kr@latest/files/noto-serif-kr-korean-wght-normal.woff2` (교체, 기존 4개 static 대체) | 1 |
| JetBrains Mono | 기존 3개 static 유지 | 3 |

**각 URL은 fetch-fonts.sh 실행 전에 `curl -IL` 로 200 OK 확인 권장.** @fontsource 변수명이 바뀌었을 가능성 있음 (latest 태그 사용 시).

스크립트 수정 후:
```bash
chmod +x scripts/fetch-fonts.sh
bash scripts/fetch-fonts.sh
du -sh assets/fonts/   # 전체 크기 확인 (~15–25MB 예상)
```

### 단계 3: `assets/theme-foundation.css` 재작성

**현재 구조 (일부는 `@import` CDN, 일부는 `@font-face`)**:
```css
/* 현재 */
@font-face { /* Pretendard Variable with local→bundled→CDN chain ✓ */ }
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:...&display=block');
@import url('https://fonts.googleapis.com/css2?family=Inter:...&display=block');
```

**목표 구조 (모두 self-hosted `@font-face`)**:

모든 `@import url('https://fonts.googleapis.com/...')`를 제거하고, 각 폰트마다 명시적 `@font-face` 선언. 패턴:

```css
@font-face {
  font-family: 'Noto Sans JP';
  src: local('Noto Sans JP'),
       local('Hiragino Sans'),
       url('fonts/noto-sans-jp/noto-sans-jp-japanese-wght-normal.woff2')
       format('woff2-variations'),
       url('https://cdn.jsdelivr.net/npm/@fontsource-variable/noto-sans-jp@latest/files/noto-sans-jp-japanese-wght-normal.woff2')
       format('woff2-variations');
  font-weight: 100 900;
  font-display: block;
  font-style: normal;
}
```

**9개 `@font-face` 필요**: Pretendard (있음), Inter, Noto Sans JP/SC/TC, Noto Serif KR/JP/SC/TC, JetBrains Mono (3 weights).

**검증 포인트**:
- `font-display: block` 모든 곳에
- `src:` 순서 엄수 (local → bundled → CDN)
- Variable font는 `format('woff2-variations')`, static은 `format('woff2')`
- `font-weight: 100 900` range는 Variable만; static은 각 숫자 (e.g., `font-weight: 400`)

### 단계 4: 테마 CSS의 잔존 `@import` 제거

다음 파일들이 `@import url('https://fonts.googleapis.com/...')`를 중복 포함하고 있을 수 있음 — 제거:

```bash
grep -l "fonts.googleapis.com" assets/design-systems/**/*.marp.css
```

현재(v0.8.0) 상태로는:
- `editorial/kinfolk-serif.marp.css` — Noto Serif KR/JP/SC/TC @import
- `editorial/wired-grid.marp.css` — JetBrains Mono @import
- `minimalist-premium/arctic-serif.marp.css` — Noto Serif KR/JP/SC/TC @import

이들은 theme-foundation.css 확장 후 중복이 됨. 테마 foundation이 모든 폰트를 정의하므로 테마별 @import는 삭제.

### 단계 5: 검증

```bash
# 테마 유효성
for css in assets/design-systems/minimalist-premium/*.marp.css \
           assets/design-systems/editorial/*.marp.css \
           examples/seed-themes/*.marp.css; do
  node scripts/validate-theme.mjs "$css" 2>&1 | grep -E "(PASS|FAIL)"
done | sort | uniq -c
# 기대: 11 PASS (5 zero-warning, 6 "no attribution" benign)

# 샘플 덱 렌더 (HTML)
cp examples/sample-deck/brief.md /tmp/test-brief.md
cp examples/sample-deck/deck.md /tmp/test-deck.md
mkdir -p /tmp/handoff-test
cp examples/sample-deck/{brief,deck}.md /tmp/handoff-test/
cp assets/design-systems/minimalist-premium/obsidian-mono.marp.css /tmp/handoff-test/theme.css
# 실제 render는 사용자의 슬라이드 디렉토리에서 진행 — 여기선 CSS 참조 확인만
```

또는 기존 테스트 덱 하나 골라서:
```bash
cd /Users/min/Projects/marp
bash marp-slide-studio/scripts/render.sh hangul-typography
bash marp-slide-studio/scripts/export-pdf.sh hangul-typography
# PDF 열어서 한글 확인 (시스템 Chrome 사용 환경)
```

### 단계 6: 버전 업 + CHANGELOG

```bash
# plugin.json + marketplace.json: 0.8.0 → 0.8.1
# CHANGELOG에 v0.8.1 섹션 추가 (B-full bundle)
```

CHANGELOG 초안 (적절히 수정):

```markdown
## 0.8.1 — <date>

### Fixed — Korean/CJK PDF rendering in sandboxed environments

User report: Korean text rendered as □ tofu boxes in PDF exports produced in Claude Cowork. Root cause: Cowork's Chromium sandbox had (a) no CJK system fonts, (b) blocked CDN access to jsdelivr/Google Fonts, (c) empty `assets/fonts/` bundle location in v0.8.0 plugin zip.

### Changed — plugin is now fully self-contained for font rendering

- `scripts/fetch-fonts.sh` extended to download all primary CJK + Latin fonts from @fontsource jsdelivr mirror:
  - Pretendard Variable (Korean) — unchanged
  - Inter Variable (Latin) — new
  - Noto Sans JP/SC/TC Variable — new
  - Noto Serif JP/SC/TC Variable — new
  - Noto Serif KR Variable — replaces 4 static weights with single variable
  - JetBrains Mono — unchanged
- All font files committed under `assets/fonts/<family>/` (bundled with plugin, ~X MB)
- `assets/theme-foundation.css` rewritten: all `@import url('https://fonts.googleapis.com/...')` replaced with explicit `@font-face` declarations using local → bundled → CDN fallback chain + `font-display: block`
- Theme CSS files (`kinfolk-serif`, `wired-grid`, `arctic-serif`) cleaned of redundant Google Fonts @imports now covered by foundation
- zip size: 254 KB → ~X MB (one-time cost, complete offline capability gained)

### Released as
- GitHub release `v0.8.1` with `marp-slide-studio-v0.8.1.zip` asset
```

### 단계 7: 커밋 · 태그 · 푸시 · 릴리스

```bash
git add assets/fonts/ scripts/fetch-fonts.sh assets/theme-foundation.css \
        assets/design-systems/ \
        .claude-plugin/plugin.json .claude-plugin/marketplace.json \
        CHANGELOG.md
git -c user.name="Min-Gul Kim" -c user.email="kimmingul@users.noreply.github.com" \
    commit -m "feat: v0.8.1 — bundle all CJK + Latin fonts (offline self-contained)" -m "
... (상세 메시지) ..."
git tag v0.8.1
git push origin main
git push origin v0.8.1

# ZIP 빌드
rm -f /tmp/marp-slide-studio-v0.8.1.zip
(cd /Users/min/Projects/marp && zip -r /tmp/marp-slide-studio-v0.8.1.zip marp-slide-studio \
  -x "marp-slide-studio/.git/*" "marp-slide-studio/.git" "*/node_modules/*" "*/.DS_Store" "*/Thumbs.db")
ls -lh /tmp/marp-slide-studio-v0.8.1.zip  # 예상: 10–25MB

# Release
awk '/^## 0\.8\.1/,/^## 0\.8\.0/' CHANGELOG.md | sed '$d' > /tmp/v081-notes.md
gh release create v0.8.1 --repo kimmingul/marp-slide-studio \
  --title "v0.8.1 — Self-contained font bundle (CJK + Latin)" \
  --notes-file /tmp/v081-notes.md \
  --latest --verify-tag \
  /tmp/marp-slide-studio-v0.8.1.zip
```

### 단계 8: 사용자 smoke test 안내

사용자에게:
1. Cowork에서 기존 플러그인 제거
2. v0.8.1 zip 재업로드
3. `/slide-auto "한글 테스트 주제"` 실행
4. PDF 생성 후 열어서 한글 렌더 확인 (tofu가 아니어야 함)

---

## 알려진 함정 (반드시 피할 것)

1. **Google Fonts `fonts.gstatic.com/s/...` 해시 URL**: 버전 bump 시 만료. 절대 새로 추가하지 말 것. @fontsource jsdelivr mirror만 사용.
2. **`format('woff2-variations')` vs `format('woff2')`**: Variable 폰트는 전자, static은 후자. 잘못 쓰면 폰트 로드 silent fail.
3. **Variable font는 `font-weight: <min> <max>` range 사용**: e.g., `100 900`. Static은 단일 숫자.
4. **@import는 CSS에서 모든 rule보다 앞**: `:root { ... }` 뒤에 @import 있으면 무시됨. Foundation에서는 @import 아예 제거하므로 문제 없음.
5. **`src:` 내 url() 끝에 반드시 `format()` 힌트**: Chromium은 format 힌트 없어도 로드하지만, 다른 브라우저 호환성 위해 권장.
6. **font-display: block**만으로는 부족 — 로드할 파일이 존재해야 함. 이것이 번들링 필요한 이유.
7. **Git에 바이너리 woff2 커밋 OK**: GitHub 파일당 100MB 제한, 레포 전체 5GB 제한. woff2는 많아야 파일당 5MB, 총 ~20MB이므로 문제 없음. LFS 불필요.
8. **.gitignore 확인**: `assets/fonts/`가 배제되지 않았는지. 현재 `.gitignore`에 `slides/*/out/`, `node_modules/` 등만 있어서 fonts/ 는 포함됨. 변경 없음.

---

## 성공 기준

### 기술 검증 (자동)
- [ ] `bash scripts/fetch-fonts.sh` 모든 URL 200 OK (curl -IL로 사전 확인)
- [ ] `du -sh assets/fonts/` → ~15–25 MB
- [ ] 11/11 themes validator PASS (5 zero-warning, 6 benign-no-attribution)
- [ ] `grep -l "fonts.googleapis.com" assets/` → 0 matches (모든 @import 제거 확인)
- [ ] `grep -c "@font-face" assets/theme-foundation.css` → 9+ (모든 폰트 패밀리 커버)

### 통합 검증 (수동)
- [ ] 로컬 render: sample-deck 정상 HTML + PDF 생성
- [ ] PDF 시각 확인: 한글·일본어·중국어 글리프 정상 (tofu 없음)
- [ ] CDN 차단 시뮬레이션 (e.g., offline mode): local 번들만으로 렌더 확인

### 최종 검증 (사용자)
- [ ] Cowork에서 v0.8.1 zip 업로드 성공 (validator 통과)
- [ ] `/slide-auto`로 한글 덱 생성 → PDF 한글 정상 표시

---

## 참고 문서 (이 세션 내에서 작성됨)

- `/Users/min/Projects/marp/docs/` — Thariq 3종 best practices 문서 (참조 가능)
- `/Users/min/Projects/marp/marp-slide-studio/CHANGELOG.md` — v0.8.0까지 이력
- `/Users/min/Projects/marp/marp-slide-studio/README.md` — v0.8.0 docs
- `/Users/min/Projects/marp/marp-slide-studio/assets/theme-foundation.css` — 현재 폰트 foundation (수정 대상)
- `/Users/min/Projects/marp/marp-slide-studio/scripts/fetch-fonts.sh` — 현재 폰트 다운로더 (확장 대상)

---

## 이 문서 자체

이 핸드오프 문서는 `docs/HANDOFF-v0.8.1-font-bundle.md`에 위치. git에 커밋하여 새 세션(다른 디렉토리, 다른 시점)에서도 읽을 수 있도록 함. v0.8.1 작업 완료 후 이 문서는 보존(과거 기록) 또는 `docs/archive/`로 이동.
