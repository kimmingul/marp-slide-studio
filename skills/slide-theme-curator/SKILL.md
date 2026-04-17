---
name: slide-theme-curator
description: Use when the user says "/slide-theme", "테마 선택", "테마 정해줘", "Stripe처럼", "Linear 스타일로", or names any of the 59 registry brands. Routes across a 3-tier catalog — curated themes (Tier 2), previously-generated themes (Tier 3 cache), and on-demand generation (Tier 3 fresh via theme-forger). Reads brief.md, proposes candidates, copies or generates the chosen theme into the deck's theme.css, and optionally customizes tokens.
argument-hint: "[slug] [track_or_brand]"
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(cp:*, ls:*, node:*), Task
---

# Slide Theme Curator

Select a design system for the deck, not a "template." The difference: a design system has a documented point of view (see `assets/design-systems/*/DESIGN.md`) — a template is just CSS.

This skill owns the selection and (optional) light customization. It does NOT compose slides.

## When invoked

User has a brief and needs a theme. Typically called after `/slide-new`.

## Procedure

### Step 1 — Locate the deck

If `$1` is given, treat as slug. Otherwise:
```bash
ls -1 slides/ 2>/dev/null
```
If exactly one slug exists, use it. If multiple, ask user to pick. If none, instruct user to run `/slide-new` first and stop.

### Step 2 — Read brief.md

Read `./slides/<slug>/brief.md` and extract:
- `narrative_pattern`, `tone`, `differentiation_against`, `track_preference`

Abort with message if brief.md is missing.

### Step 2.5 — Offer gallery entry (new in v0.4)

If the user has NOT given a specific brand or track as `$2`, and their message doesn't already scope the choice (e.g., "Stripe처럼" or "editorial"), ask via AskUserQuestion:

```
"어떻게 테마를 고르시겠어요?"
 ① 빠른 3문답으로 추천 받기 (Mood Match, ~30초) — Recommended
 ② 브라우저로 전체 63개 갤러리 보기 (시각 비교)
 ③ 내 덱을 후보 5개에 적용해서 비교 (Personal Preview, ~5분)
 ④ 목록에서 바로 선택 (기존 방식)
```

If the user picks ①, ②, or ③ → delegate to `slide-theme-gallery` skill (Task tool with args). When the gallery-driven selection returns a brand slug, continue with Step 3 treating that slug as if the user had given it originally.

If the user picks ④ → proceed to Step 3 as before.

This step is additive. If the user's original request already named a brand or track, skip this and go straight to Step 3.

### Step 3 — Classify the request: track-based or brand-based?

The `$2` argument (or the user's message) can be:

**Track-based** (pick from curated):
- `minimalist-premium`, `editorial`, `auto` → standard curator flow (Tier 2)

**Brand-based** (specific brand from 59-registry):
- `stripe`, `linear`, `apple`, `tesla`, `notion`, etc. → route to theme-forger (Tier 3)

Classification algorithm:
1. If `$2` matches one of `minimalist-premium | editorial | auto` → TRACK mode
2. If `$2` exists as a key in `registry.json` → BRAND mode
3. If user's free-text message contains a brand name from registry (case-insensitive) → BRAND mode, extract it
4. Otherwise → ask via AskUserQuestion

Check registry:
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/forge-theme.mjs check "$2"
```
Exit 0 means brand exists.

### Step 3a — BRAND mode (v0.8.0+ three-location cache lookup)

If the request is brand-specific:

1. Check cache in three locations (priority order):
   a. **User cache** — `${CLAUDE_PLUGIN_DATA:-~/.marp-slide-studio}/themes/<brand>.marp.css` (persists across upgrades)
   b. **Seed** — `${CLAUDE_PLUGIN_ROOT}/examples/seed-themes/<brand>.marp.css` (shipped with plugin)
   c. **Legacy** — `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/generated/<brand>.marp.css` (pre-v0.8.0 backward compat)

   The helper `node ${CLAUDE_PLUGIN_ROOT}/scripts/forge-theme.mjs paths <brand>` prints both the canonical output path and the currently-cached path (with source) for a given brand.

2. If any cache is found, proceed to Step 6 using that CSS (no forge needed).

3. Not cached: delegate to theme-forger via Task tool:
   - Pass brand slug
   - Expect generation into `${CLAUDE_PLUGIN_DATA}/themes/<slug>.{design.md, marp.css}` (primary output location)
   - Wait for completion

4. When theme-forger returns success, proceed to Step 6.

Skip Steps 4–5 (which are for track-based curated selection).

### Step 3b — TRACK mode

Precedence for track:
1. `$2` CLI argument if it's `minimalist-premium | editorial | auto`
2. `track_preference` from brief.md (if not `auto`)
3. Team default from `.claude/marp-slide-studio.local.md` if exists
4. Inferred from tone: 단정/정제 → `minimalist-premium`; 사려/서사 → `editorial`

If still ambiguous, ask user via AskUserQuestion with both tracks + short descriptions, and offer a "특정 브랜드로 생성 (예: Stripe, Linear, Tesla...)" option that pivots to BRAND mode.

### Step 4 — List candidates

```bash
ls -1 ${CLAUDE_PLUGIN_ROOT}/assets/design-systems/<track>/*.design.md
```

For each candidate:
- Read the `DESIGN.md` first 30 lines
- Extract: name (from filename), mood (from "Mood:" line in section 1), palette (section 2), when-to-use (from intro paragraph)

### Step 5 — Present candidates

Show a concise comparison table, then ask user to pick via AskUserQuestion.

Current theme catalog:

**minimalist-premium track**
| Theme | Mood | Palette | Best for |
|-------|------|---------|----------|
| Obsidian Mono | 조용한 자신감 | 크림/먹/주황 | 임원 브리핑, 아키텍처, 제품 발표 |
| Arctic Serif | 차분한 학술 | 차가운 회색/네이비 | 연구 발표, 정책 브리핑, 논문 |

**editorial track**
| Theme | Mood | Palette | Best for |
|-------|------|---------|----------|
| Kinfolk Serif | 사려 깊고 문학적 | 크림/딥잉크/버건디 | 브랜드 내러티브, 미션, 문화 토크 |
| Wired Grid | 명료하고 모더니스트 | 흰색/검정/오렌지 | 컨퍼런스 키노트, 트렌드 리포트, 문화 비평 |

Only show themes in the chosen track. If track has only one theme, skip selection and note: "<theme> 단일 후보로 진행합니다."

### Step 6 — Copy theme CSS

Source path depends on mode:

- TRACK mode (Tier 2 curated):
  ```bash
  cp ${CLAUDE_PLUGIN_ROOT}/assets/design-systems/<track>/<theme>.marp.css \
     ./slides/<slug>/theme.css
  ```

- BRAND mode (Tier 3, generated or cached — use path resolved in Step 3a):
  ```bash
  # <CACHED_PATH> is the path returned by forge-theme.mjs paths <brand>
  # which could be ${CLAUDE_PLUGIN_DATA}/themes/, examples/seed-themes/, or
  # (legacy) assets/design-systems/generated/
  cp <CACHED_PATH> ./slides/<slug>/theme.css
  ```

### Step 7 — Offer brand token customization

Ask via AskUserQuestion:
"이 덱에만 적용할 브랜드 커스터마이즈를 원하시나요?"
- No, 기본값 사용 (Recommended)
- 팀 브랜드 컬러로 accent 교체
- Accent + background 모두 교체

If team settings file has `team_brand_primary`, offer to apply it automatically.

If user chooses to customize, edit the copied `theme.css`:
- Replace `--accent` value in `:root`
- If needed, also replace `--bg` and `--fg`

Use Edit tool for precise replacement (target the exact line like `--accent: #C75B12;` in `:root`).

Do NOT invent colors. If user hasn't provided hex, ask for it, then validate it's a valid 6-digit hex.

### Step 8 — Update brief.md

Append to brief.md:
```yaml
theme:
  track: <track>
  name: <theme-name>
  customizations:
    accent: <new_hex or default>
    bg: <new_hex or default>
```

Use Edit to add this to the YAML frontmatter or as a new section; choose whichever is cleaner given the existing file.

### Step 9 — Hand off

```
✓ ./slides/<slug>/theme.css 준비 완료 (<theme-name>)
다음 단계: /slide-compose <slug>
```

## Custom theme request

If the user describes a look NOT in the curated catalog AND NOT in the 59-registry:

1. Ask: "가장 가까운 기존 브랜드는?" — suggest 2–3 from registry based on the description
2. If user picks one → BRAND mode
3. If user wants a truly custom theme (their own company brand) → they provide a custom spec JSON matching the registry schema, then invoke `theme-forger --custom <path>`

Do NOT attempt to write a new DESIGN.md + CSS from scratch inside this skill. Always delegate to `theme-forger`.

## Brand extraction from natural language

When the user says things like "Stripe처럼 만들어줘" or "like Apple's design", extract the brand name:

```
node ${CLAUDE_PLUGIN_ROOT}/scripts/forge-theme.mjs list | grep -iE "\b(stripe|apple|linear|...)\b"
```

Or more simply, iterate `registry.json` keys and do case-insensitive substring match. If multiple matches, ask which one.

Common name aliases to handle:
- "Linear" → `linear.app`
- "Mistral" → `mistral.ai`
- "Twitter/X" → `x.ai`
- "together" (the AI brand) → `together.ai`
- "opencode" → `opencode.ai`

If the user says a brand NOT in registry (e.g., "Slack", "Google"), respond:
"[brand]는 현재 registry에 없습니다. 가장 유사한 것: <suggest 2 similar mood brands>. 아니면 `theme-forger --custom`로 사용자 정의 브랜드를 추가할 수 있습니다."

## Gotchas

- **Brand name aliases**: natural-language input rarely uses canonical registry keys. Common aliases to resolve:
  - "Linear" → `linear.app`
  - "Mistral" / "Mistral AI" → `mistral.ai`
  - "Twitter" / "X" → `x.ai`
  - "Together" / "Together AI" → `together.ai`
  - "Opencode" → `opencode.ai`
  - If multiple brands match the input substring, ask user which one.
- **Brand NOT in 59-registry**: common requests like "Slack", "Google", "Discord" are NOT present. Respond with: "현재 registry에 없습니다. 가장 유사한 것: <2 similar-mood brands>. 또는 `theme-forger --custom`으로 사용자 정의 브랜드 추가." Do NOT silently pick a random nearby brand.
- **`--typography editorial` has no effect on preset without `theme_serif_variant`**: only `team-narrative` (→ kinfolk-serif) and `research-talk` (→ arctic-serif) swap. Other presets ignore the flag. State this explicitly when user passes `--typography editorial` with a non-swap preset.
- **Cache path changed in v0.8.0**: three-location lookup (user-cache → seed → legacy). Old installs may have themes in `assets/design-systems/generated/` (legacy). New forges go to `${CLAUDE_PLUGIN_DATA}/themes/`. Prefer the user-cache when present.
- **Accent customization via brand hex input**: validate that input is exactly `#` + 6 hex chars. Reject 3-char hex, rgb(), hsl(). Be strict — a broken hex in theme CSS silently falls back to browser default.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/` — all themes
- `${CLAUDE_PLUGIN_ROOT}/skills/marp-theme-engineer/SKILL.md` — for new-theme requests
