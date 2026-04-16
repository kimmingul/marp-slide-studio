---
name: slide-theme-curator
description: Use when the user says "/slide-theme", "테마 선택", "테마 정해줘", or needs to pick/customize a visual theme for a Marp deck. Reads brief.md, shows up to 3 design system candidates from assets/design-systems/, copies the chosen theme into ./slides/<slug>/theme.css, and optionally customizes color tokens.
argument-hint: "[slug] [track=minimalist-premium|editorial|auto]"
allowed-tools: Read, Write, Glob, AskUserQuestion, Bash(cp:*, ls:*)
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

### Step 3 — Determine track

Precedence for track (`minimalist-premium` | `editorial`):
1. `$2` CLI argument if given
2. `track_preference` from brief.md (if not `auto`)
3. Team default from `.claude/marp-slide-studio.local.md` if exists
4. Inferred from tone: 단정/정제 → `minimalist-premium`; 사려/서사 → `editorial`

If still ambiguous, ask user via AskUserQuestion with both tracks + short descriptions.

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

```bash
cp ${CLAUDE_PLUGIN_ROOT}/assets/design-systems/<track>/<theme>.marp.css \
   ./slides/<slug>/theme.css
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

If the user says "새 테마 만들어줘" or describes a look not covered by any existing theme:

1. Ask: "기존 테마 중 가장 가까운 것은?" (Obsidian Mono / Kinfolk Serif / 없음)
2. Describe the brief in 3 properties: palette direction / font direction / layout tendency
3. Direct user to invoke the `marp-theme-engineer` skill (or delegate to `slide-director` agent) for a full theme build

Do NOT attempt to write a full new DESIGN.md + CSS from scratch inside this skill — it's out of scope. Redirect.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/` — all themes
- `${CLAUDE_PLUGIN_ROOT}/skills/marp-theme-engineer/SKILL.md` — for new-theme requests
