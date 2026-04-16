---
name: slide-autopilot
description: Use when the user says "/slide-auto", "자동으로 덱 만들어줘", "전체 자동 진행", "autopilot", or wants the full pipeline (brainstorm → theme → compose → refine → export) to run without stepwise intervention. Collects ALL decisions upfront in either Express mode (3 questions, preset-driven) or Full mode (4 AskUserQuestion batches covering 16 fields), then runs the entire pipeline autonomously with no further prompts. Preserves partial artifacts on failure.
argument-hint: "[topic] [--full] [--preset <name>] [--no-refine]"
allowed-tools: Read, Write, Edit, Glob, Bash(node:*, bash:*, npx:*, mkdir:*, test:*, cp:*, open:*, ls:*), AskUserQuestion, Task
---

# Slide Autopilot

One command, full deck. Setup once, walk away, come back to PDF + PPTX.

Critical contract: after setup questions are answered, **NO user interaction** until the final report. Every decision is captured upfront or resolved by the preset. Failures degrade gracefully — they never block for a question.

## When invoked

- `/slide-auto "topic"` — Express mode with preset
- `/slide-auto "topic" --full` — Full mode, all 16 decisions collected upfront
- `/slide-auto "topic" --preset investor-pitch` — Skip Q1, use named preset directly
- `/slide-auto "topic" --no-refine` — Skip the refine loop (faster, lower quality)

## Procedure

### Step 1 — Parse args

- `$1` (required): topic string
- `--full`: run Full mode
- `--preset <name>`: skip preset selection question in Express
- `--no-refine`: disable refine loop
- `--force-theme <slug>`: override preset's theme with specific brand

If no topic given, ask once: "이번 덱의 한 문장 주제는?" (plain text).

### Step 2 — Load presets

Read `${CLAUDE_PLUGIN_ROOT}/assets/autopilot-presets.json`. Keep the parsed object in memory.

### Step 3 — Derive slug

Convert topic → kebab-case slug, max 40 chars, strip non-alphanumeric. Confirm the slug briefly (1 line, user can override).

Check if `./slides/<slug>/` already exists:
- Non-empty dir → append `-2`, `-3`, etc. until free (never overwrite)
- Empty dir or new → use as-is

Create the directory.

### Step 4 — Setup: Express mode (default)

If NOT `--full`, run Express setup. Batch all questions into a single AskUserQuestion call with **exactly 3 questions**:

**Q1 — Preset** (skip if `--preset` was passed)
```
"어떤 종류의 덱인가요?"
① Investor pitch     — stripe · 기술·단정·설득형 (Recommended for most cases)
② Team narrative     — kinfolk-serif · 서정·내부 공유
③ Research talk      — arctic-serif · 학술·증거 중심
④ Launch keynote     — wired-grid · 도발적·매체적
⑤ Executive brief    — obsidian-mono · 조용한 권위
⑥ Product launch     — apple · 미니멀 프리미엄
```

**Q2 — Length**
```
"분량은?"
① 짧게  6–8  slides (5-min talk)
② 표준 10–14 slides (10-min talk) (Recommended)
③ 길게 18–24 slides (20-min talk)
```

**Q3 — Memory sentence** (single AskUserQuestion won't collect free text — handle as follow-up plain prompt AFTER the 2 button questions)

Actually: AskUserQuestion doesn't support free-text answers. After the button questions, send a plain text prompt: "마지막 하나: 청중이 내일 기억했으면 하는 문장을 한 줄로 적어주세요." Wait for response.

### Step 4-alt — Setup: Full mode (if `--full`)

Run 4 AskUserQuestion batches, each with up to 4 questions:

**Batch 1 — Brainstorm core (4 questions)**
- 청중
- 내러티브 패턴 (5가지)
- 톤
- 차별화 축

**Batch 2 — Brainstorm detail (2 questions + 1 plain-text)**
- 분량 (3지)
- 참조 브랜드/덱 (4지: Stripe풍 / Linear풍 / NYT풍 / 자유입력)
- (plain prompt) 한 문장 기억

**Batch 3 — Theme + refine (3 questions)**
- 테마 선택 방식 (preset 따름 / mood-match 실행 / 특정 브랜드 지정 / 갤러리로 수동)
- 특정 브랜드 지정 시 slug (plain prompt or chip list)
- Refine 반복 횟수 (2/3/4/없음)

**Batch 4 — Export (3 questions)**
- 최종 포맷 (pdf / pptx / both)
- PPTX editable 모드 (true/false)
- 갤러리 자동 리빌드 (yes/no)

### Step 5 — Merge config

Final config = `presets[chosen]` merged with Full-mode user overrides or Express defaults. Write to `./slides/<slug>/.auto-config.json`.

Example final config:
```json
{
  "mode": "express",
  "topic": "AI 안보 투자자 피치",
  "slug": "ai-security-pitch",
  "preset": "investor-pitch",
  "audience": "투자자·의사결정자",
  "narrative_pattern": "problem-insight-solution-ask",
  "tone": "단정·선언·설득",
  "length": 12,
  "memory_sentence": "AI 보안 예산은 이제 선택이 아니라 필수다.",
  "track": "minimalist-premium",
  "theme": "stripe",
  "refine_iterations": 3,
  "export": ["pdf", "pptx"],
  "pptx_editable": true
}
```

### Step 6 — Initialize .auto-log.md

Write header to `./slides/<slug>/.auto-log.md`:

```markdown
# Autopilot Log — <slug>
Started: <ISO timestamp>
Mode: <Express | Full>
Preset: <name>

## Decisions captured at setup

| field | value | source |
|-------|-------|--------|
...all fields from merged config, with source = "preset" or "user Q1/Q2/Q3"...

## Pipeline
```

### Step 7 — Generate brief.md

**Skip slide-brainstorming skill entirely** (it's interactive). Instead, write `./slides/<slug>/brief.md` directly from config.

Read `${CLAUDE_PLUGIN_ROOT}/assets/narrative-patterns.md` to know the correct beat structure for the chosen narrative_pattern.

Generate brief.md with:
- YAML front matter (slug, title, audience, narrative_pattern, tone, length_target, differentiation_against, track_preference: from config.theme via registry, created date, theme block with track+name+customizations)
- `## One-sentence memory` with user's text
- `## Reference inspirations` (from preset.composition_hints or blank)
- `## Beats` table — this is the critical part. You must design N beats matching the narrative_pattern, where N = config.length. Each beat has `act`, `message` (1 sentence), `layout` (from core-7 layouts).
- `## Constraints` listing the anti-patterns from preset.composition_hints.avoid

Beat generation is the ONE creative step during autopilot. Put careful thought into it:
- Match beats to the narrative pattern structure
- Assign layouts that rotate (no 3-in-a-row same layout)
- First slide: `hero-full-bleed`
- Last slide: `monumental-quote` restating memory sentence (never "Thank You")
- One metric slide per ~5 slides
- One divider every ~5 slides if length ≥ 10

Log to .auto-log.md: "✓ Brief generated (Ns) — N beats"

### Step 8 — Resolve theme

```
Check if assets/design-systems/generated/<theme>.marp.css OR assets/design-systems/<track>/<theme>.marp.css exists.
  cached → copy to ./slides/<slug>/theme.css, log "cache hit"
  not cached → must forge
```

**To forge**:
1. Dispatch theme-forger skill/agent via Task tool with the brand slug.
2. Timeout: 90 seconds. If exceeded, abort forge.
3. On success → copy generated CSS to `./slides/<slug>/theme.css`. Log "forged in Ns".
4. On failure or timeout → **fallback**: use the Tier 2 curated theme in the same track. Log "forge failed, fell back to <curated-theme>. Pipeline continues."

The preset theme was chosen for a reason, so losing it to a curated fallback is a degradation, not a failure. Continue.

### Step 9 — Compose deck.md

Dispatch `slide-composer` skill via Task tool.

- Input: the paths to brief.md, theme.css, and `--silent` flag (no intermediate narration)
- Composer reads the brief and theme, generates deck.md, produces initial HTML render.

If render fails:
- 1 retry
- Still failing → preserve brief.md + deck.md (if partial), log the error, skip to Step 11 with `deck.md only, render pending` note

Log: "✓ Deck composed (Ns, N slides)"

### Step 10 — Refine loop (conditional)

If `config.refine_iterations == 0` OR `--no-refine`, skip to Step 11.

Check Playwright: `test -d node_modules/playwright || test -d node_modules/@playwright`

- Not installed → skip refine, log "⚠ refine skipped: Playwright not installed. Install: npm i -D playwright && npx playwright install chromium"
- Installed → proceed

Dispatch `slide-visual-qa` skill via Task tool:
- Args: `<slug> <iterations>` plus a `--silent` flag so it doesn't prompt user for anything (must be added to slide-visual-qa — see Step 14 below)
- Visual-qa runs the iteration loop autonomously
- When it completes, read `./slides/<slug>/.qa-log.md` for the final state

Log each round to .auto-log.md (read from .qa-log.md and summarize): "Refine round K: N blockers, N high-priority fixed. Converged: yes/no"

### Step 11 — Export

For each format in `config.export`:

**PDF**:
```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/export-pdf.sh <slug>
```
- Success → log file size
- Fail (usually Chrome missing) → log error + suggest `CHROME_PATH` env, continue to PPTX

**PPTX**:
```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/export-pptx.sh <slug>${config.pptx_editable ? ' --editable' : ''}
```
- Same pattern

### Step 12 — Final report

Append to .auto-log.md:
```markdown
## Final state

- Status: SUCCESS | PARTIAL (degraded) | FAILED
- Degraded steps: <list if any>
- Total duration: Nm Ns
- Artifacts:
  - brief.md:   <path>
  - deck.md:    <path>
  - theme.css:  <path>
  - deck.html:  <path>
  - deck.pdf:   <path or "skipped: reason">
  - deck.pptx:  <path or "skipped: reason">
  - .qa-log.md: <path or "skipped: no refine">
```

Output to user, terse:

```
✓ Autopilot complete · 7m 29s · SUCCESS

  brief     ./slides/<slug>/brief.md
  theme     stripe (cache hit)
  deck      ./slides/<slug>/deck.md (12 slides)
  refine    3 rounds, converged
  pdf       ./slides/<slug>/out/deck.pdf (1.2 MB)
  pptx      ./slides/<slug>/out/deck.pptx (2.1 MB, editable)

  open ./slides/<slug>/out/deck.pdf
  log:  ./slides/<slug>/.auto-log.md
```

Do NOT ask "is this good?" or "shall I do anything else?" — the autopilot contract is "walk away and come back". Report completion and stop.

## Failure modes

| Stage | Failure | Response |
|-------|---------|----------|
| Step 3 | Directory conflict | Append `-2`, `-3` until free. Never overwrite. |
| Step 7 | Cannot infer beat layout for narrative | Fall back to `hero-support-detail-proof-cta` default and note it in log |
| Step 8 | Forge fails twice | Fall back to curated theme in same track (preset has a mapped fallback field if added) |
| Step 8 | Even fallback missing | Abort pipeline, preserve brief.md, error out with explicit path |
| Step 9 | Composer render fails twice | Preserve deck.md (partial), skip refine, skip export, exit with paths |
| Step 10 | Playwright missing | Log warning, skip, continue to export |
| Step 10 | Refine hangs | 10-min timeout per round, force-quit, continue to export with current state |
| Step 11 | Chrome missing | Log, skip PDF, continue to PPTX (also likely fails; HTML still available) |
| Step 11 | PPTX fails | Log, return PDF+HTML |

Any failure above "abort" still produces something usable. The log records everything.

## What NOT to do

- **Do NOT ask the user anything after Step 4.** Not even "should I continue?" The contract forbids this.
- **Do NOT skip the .auto-log.md writes.** The user's trust depends on being able to see every decision.
- **Do NOT attempt to call `slide-brainstorming` skill** — it's interactive. Autopilot writes brief.md directly.
- **Do NOT attempt to call `slide-theme-curator` skill** — it's interactive. Autopilot resolves theme directly.
- **Do not re-prompt for preset** if `--preset` arg was given.
- **Do not skip export of formats in config.export** unless the underlying tool fails.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/assets/autopilot-presets.json`
- `${CLAUDE_PLUGIN_ROOT}/assets/narrative-patterns.md`
- `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/registry.json`
- `${CLAUDE_PLUGIN_ROOT}/assets/anti-patterns.md`
- `${CLAUDE_PLUGIN_ROOT}/assets/typography/korean-scale.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/slide-composer/SKILL.md` (dispatched non-interactively)
- `${CLAUDE_PLUGIN_ROOT}/skills/slide-visual-qa/SKILL.md` (dispatched non-interactively)
- `${CLAUDE_PLUGIN_ROOT}/skills/theme-forger/SKILL.md` (dispatched if forge needed)
- `${CLAUDE_PLUGIN_ROOT}/scripts/render.sh`
- `${CLAUDE_PLUGIN_ROOT}/scripts/export-pdf.sh`
- `${CLAUDE_PLUGIN_ROOT}/scripts/export-pptx.sh`
