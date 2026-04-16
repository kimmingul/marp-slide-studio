---
name: slide-visual-qa
description: Use when the user says "/slide-refine", "슬라이드 리뷰", "시각 검증", "피드백 루프", or after /slide-compose completes. Renders deck.html, captures per-slide screenshots with Playwright, invokes slide-director + marp-design-critic agents to evaluate, applies edits, re-renders, and repeats for N iterations.
argument-hint: "[slug] [iterations=3]"
allowed-tools: Read, Write, Edit, Glob, Bash(bash:*, node:*, npx:*), Task
---

# Slide Visual QA Loop

Close the AI feedback loop that pptx/keynote cannot. Render → capture → evaluate → edit → re-render. Repeat until quality converges or N iterations complete.

## When invoked

`deck.md` exists. User wants automatic visual refinement.

## Procedure

### Step 1 — Resolve args

- `$1`: slug (auto-detect from `slides/` if single)
- `$2`: iterations (default `3`; cap at `5` to limit compute)
- `--silent`: suppress intermediate narration (used by `/slide-auto`). When set:
  - Do NOT ask the user about Playwright install if missing — log warning and skip refine entirely
  - Do NOT ask for confirmation between rounds
  - Do NOT ask about deleting slides — never delete in silent mode
  - Still write `.qa-log.md` normally (autopilot reads it for the final log)

### Step 2 — Dependency check

Verify Playwright is installed locally:
```bash
test -d node_modules/playwright || test -d node_modules/@playwright/browser-chromium
```

If missing, handling depends on mode:
- Interactive: ask user "Playwright이 설치되지 않았습니다. 설치할까요? (`npm i -D playwright && npx playwright install chromium`)"
- `--silent`: skip refine entirely, write a single warning line to `.qa-log.md` ("Playwright not installed — refine skipped. Install: npm i -D playwright && npx playwright install chromium"), exit with status 0 (successful no-op)

If user declines (interactive), fall back to "evaluate without screenshots" mode: invoke agents with just the deck.md text. Note this reduces review quality.

### Step 3 — Initial render

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/render.sh <slug>
```

Must succeed before the loop starts.

### Step 4 — The iteration loop

For i in 1..N:

#### 4a. Capture screenshots
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/screenshot.mjs <slug> 1920x1080
```
Produces `./slides/<slug>/out/screenshots/slide-NN.png`.

#### 4b. Dispatch reviewers in parallel

Use the Task tool to launch TWO agents concurrently (single message, multiple tool calls):

**Agent 1: `slide-director`** (structural/narrative review)
- Input: `brief.md`, `deck.md`, list of screenshot paths
- Output contract: JSON with fields `rhythm_issues`, `narrative_issues`, `layout_suggestions`, per-slide `priority_fixes`

**Agent 2: `marp-design-critic`** (aesthetic/generic-AI detection)
- Input: `theme.css`, screenshot paths, `anti-patterns.md`
- Output contract: JSON with fields `anti_pattern_violations`, `typography_issues`, `color_issues`, `composition_issues`

Both agents must reference specific slide numbers and anti-pattern numbers when applicable.

#### 4c. Merge findings

Combine both agents' outputs. De-duplicate by slide+issue-type. Rank by severity:
- **Blocker**: anti-pattern violation, Korean typography break, unreadable contrast
- **High**: weak narrative beat, layout-rhythm problem, inconsistent accent use
- **Low**: subtle tracking/leading tweaks, copy polish

#### 4d. Decide scope for this iteration

Apply only blocker + high issues this round. Low issues defer to next iteration or final manual polish.

Cap edits at ~5 slides per iteration to keep diffs reviewable.

#### 4e. Apply edits

For each chosen issue:
- If it's a `deck.md` content issue → Edit tool on `deck.md`
- If it's a `theme.css` styling issue → Edit tool on `theme.css`
- If it's a layout class swap → Edit tool on `deck.md` `_class` directive

Prefer surgical Edit calls over Write (preserve unrelated content).

#### 4f. Log the round

Append to `./slides/<slug>/.qa-log.md`:

```markdown
## Iteration <i> — <timestamp>

### Findings (merged)
- [Blocker] Slide 3: anti-pattern #1 (3-column card mosaic) — changed to split layout
- [High] Slide 7: narrative beat too soft — strengthened message
- [Low] Slide 5: Korean line-height tight → deferred

### Applied edits
- deck.md:L42 — replaced bullet list with enumerated layout
- deck.md:L78 — rewrote headline ("We can help" → "생각을 실행으로 바꾸는 방법")
- theme.css:L120 — increased `--lh-body` from 1.65 to 1.72

### Skipped
- Slide 5 low-priority tracking tweak (deferred)
```

#### 4g. Re-render

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/render.sh <slug>
```

If render errors, roll back the last iteration's edits (use git or the .qa-log.md diff record), report the error, and exit the loop.

#### 4h. Convergence check

If the latest iteration had zero blocker and zero high findings, stop early. Note "converged at iteration <i>" in .qa-log.md.

### Step 5 — Final report

After loop ends, write a summary section to `.qa-log.md`:

```markdown
## Final state

- Iterations run: <i> / <N>
- Converged: <yes|no>
- Blockers remaining: <count>
- High-priority remaining: <count>

### Recommended next steps
- <action>
```

Output to user:
```
✓ /slide-refine 완료 (i / N rounds)
  남은 blocker: 0, high: 0
  전체 로그: ./slides/<slug>/.qa-log.md

다음 단계:
  열어서 보기:     open ./slides/<slug>/out/deck.html
  PDF 내보내기:    /slide-export <slug> pdf
  PPTX 내보내기:   /slide-export <slug> pptx
```

## Fallback: no Playwright

If Playwright unavailable, the agents receive only:
- `deck.md`, `brief.md`, `theme.css` (text)

Their review becomes structural-only; visual nuance is lost. Note this in the log and suggest installing Playwright for future runs.

## Safety

- Max 5 iterations.
- Max 5 edits per iteration.
- Do NOT delete slides without explicit user approval (a deletion is always a structural change, requires user confirm).
- Do NOT change the narrative pattern or beat count — those are fixed at /slide-new and /slide-compose time.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/agents/slide-director.md`
- `${CLAUDE_PLUGIN_ROOT}/agents/marp-design-critic.md`
- `${CLAUDE_PLUGIN_ROOT}/scripts/screenshot.mjs`
- `${CLAUDE_PLUGIN_ROOT}/scripts/render.sh`
