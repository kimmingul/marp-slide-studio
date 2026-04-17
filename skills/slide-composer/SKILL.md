---
name: slide-composer
description: Use when the user says "/slide-compose", "슬라이드 만들어줘", "덱 작성해줘", or when brief.md and theme.css exist and need to be turned into a Marp markdown deck. Reads the brief and theme, generates deck.md strictly following the beat structure, layout catalog, anti-patterns, and Korean typography rules, then renders an initial HTML preview.
argument-hint: "[slug]"
allowed-tools: Read, Write, Edit, Glob, Bash(bash:*, npx:*, ls:*)
---

# Slide Composer

Turn a brief + theme into actual Marp markdown. This is the step where quality is won or lost.

## When invoked

`./slides/<slug>/brief.md` and `./slides/<slug>/theme.css` both exist. User wants `deck.md`.

Supports `--silent` flag (used by `/slide-auto`) — when set, skip intermediate narration and hand-off prompts. Still write deck.md, still run initial render, but end with a single one-line completion message instead of the multi-line hand-off menu.

## Procedure

### Step 1 — Locate and validate inputs

If `$1` is a slug, use it; otherwise auto-detect from `slides/` (must be single or ask).

Verify:
```bash
test -f ./slides/<slug>/brief.md && test -f ./slides/<slug>/theme.css
```

Abort with clear instruction if either is missing.

### Step 2 — Load all context

Read in this order (each one matters):
1. `./slides/<slug>/brief.md` — the narrative
2. `./slides/<slug>/theme.css` — to know which classes and tokens are available
3. `${CLAUDE_PLUGIN_ROOT}/assets/anti-patterns.md` — hard constraints
4. `${CLAUDE_PLUGIN_ROOT}/assets/narrative-patterns.md` — pattern details
5. `${CLAUDE_PLUGIN_ROOT}/assets/typography/korean-scale.md` — Korean rules
6. `${CLAUDE_PLUGIN_ROOT}/assets/layouts/README.md` — layout index
7. Each layout file mentioned in the beats table of brief.md

### Step 3 — Generate front matter

Deck opens with Marp front matter:

```markdown
---
marp: true
theme: <theme-name>          # MUST match @theme directive in theme.css
lang: <language-code>        # ko | en | ja | zh-Hans | zh-Hant | es | fr | de | ...
paginate: true
size: 16:9
header: ""
footer: ""
math: katex                  # or mathjax; katex is leaner
style: |
  /* Per-deck overrides ONLY if the team settings require them. Otherwise leave empty. */
---
```

Extract `<theme-name>` from the first line of `theme.css` (`/* @theme xxx */`).

The `lang:` field is critical for multi-language support — it drives `:lang()` CSS selectors that swap font family, line-height, and italic discipline per language. Source:
1. `language` field in `brief.md` YAML front matter if present
2. Otherwise default to `ko` for back-compat (original plugin design)

Marp emits `<html lang="…">` which cascades to every section. Themes use `section:lang(ko)`, `section:lang(ja)`, etc. to apply the right typography.

### Step 4 — Generate slides, one beat at a time

For each beat in brief.md beats table, generate a slide following this algorithm:

#### 4a. Select the layout

Use the `layout` field from the beat. Map to a class directive:

Core layouts (always available):
- `hero-full-bleed` → `<!-- _class: hero -->`
- `monumental-quote` → `<!-- _class: monumental -->`
- `two-column-split` → `<!-- _class: split split-60-40 -->` (or 55-45 / 40-60)
- `data-dense` → `<!-- _class: metric -->`
- `section-divider` → `<!-- _class: divider -->`
- `quote-attribution` → `<!-- _class: quote -->`
- `list-numbered` → `<!-- _class: enumerated -->`
- Plain prose slide → no class directive (uses base styling)

Korean-only layouts (theme must opt in — check theme.css for the class):
- `vertical-writing` → `<!-- _class: vertical -->` (세로쓰기; classical quotes)
- `ruby-annotation` → `<!-- _class: ruby -->` (한자 병기 · 振り仮名 · 拼音; academic terms, works across CJK)
- `banner-caption` → `<!-- _class: banner-caption -->` (방주; main claim + qualification)

Before emitting a Korean-only class, grep `theme.css` for `section.<class>`. If the class is not styled, fall back to `quote` (for vertical-writing) or `split` (for banner-caption) with a note in `.qa-log.md`.

#### 4b. Apply the layout's markdown template

Read the layout file from `assets/layouts/<layout>.md` and use its "Markdown" block as the structure. Substitute the beat's `message` and related content into the template.

#### 4c. Enforce content constraints

Before writing the slide:
- If the slide has more than 4 bullets, split into 2 slides OR convert to `enumerated` with 3 items max.
- If the slide has both a large visual AND a large block of text, split.
- If the slide text uses "우리는 ~할 수 있을지도 모릅니다" hedging, rewrite as declarative.
- If the message is unclear or longer than 14 words on a hero/monumental, rewrite it.

#### 4d. Apply Korean typography rules

- Never use `ALL UPPERCASE` on Korean text. Only on short Latin overlines.
- Never italicize Korean text. If the layout template has `<em>` around Korean, replace with `<strong>` or plain.
- Use `「 」` for Korean quotes, `" "` for Latin.
- Numbers get tabular figures — the theme.css already sets this globally; just ensure numbers appear inside elements with class `metric-value`, `divider-number`, etc. where it matters.

#### 4e. Page separator

Between slides, use `---` on its own line with blank lines above and below.

### Step 5 — Rhythm check

Before writing deck.md to disk, verify:

1. No 3 consecutive slides with the same layout class.
2. At least one `hero` or `divider` every 5 slides.
3. First slide is `hero-full-bleed`.
4. Final slide is NOT "Thank You / Questions" (anti-pattern #10). It should restate the one-sentence memory from brief.md.

If any rhythm check fails, revise before writing.

### Step 6 — Write deck.md

```bash
# Create via Write tool, never via heredoc
```

Write to `./slides/<slug>/deck.md`.

### Step 7 — Initial render

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/render.sh <slug>
```

This produces `./slides/<slug>/out/deck.html`.

If render fails, inspect stderr, fix the likely issue (usually a CSS import error or missing `_class` directive), and retry once. If still failing, report the exact error and stop.

### Step 8 — Hand off

```
✓ ./slides/<slug>/deck.md (N slides)
✓ ./slides/<slug>/out/deck.html (preview)

다음 단계:
  /slide-refine <slug>   — 시각 검증·자동 개선 (Playwright 필요)
  /slide-export <slug>   — PDF/PPTX 내보내기
  또는 deck.md 를 직접 편집 후 다시 render.sh
```

## What NOT to do

- Do NOT deviate from the beats in brief.md. If a beat is wrong, user should update brief.md first, then re-run /slide-compose.
- Do NOT invent new layouts. Use only those in `assets/layouts/`.
- Do NOT use inline styles in the markdown except as a last resort; style belongs in theme.css.
- Do NOT add a table-of-contents slide (anti-pattern #9).
- Do NOT use stock icons or emoji decoration in body text (anti-pattern #6, #12).
- Do NOT write a placeholder slide (`[TODO: add content]`). Either write real content from the brief or omit the slide.

## Korean-specific checklist

After drafting the deck, run through this:

- [ ] All body paragraphs wrap at reasonable width (no 80-char Korean lines)
- [ ] Numbers in `.metric-value` use pure digits (not 한글 표기) unless brief says otherwise
- [ ] Mixed Korean+English lines don't use UPPERCASE
- [ ] Quotes use correct Korean punctuation
- [ ] No anglicized em-dashes where 줄표 (—) or quotes are expected

## Gotchas

- **Markdown inside HTML blocks doesn't render** — `<div class="col-main">` followed immediately by `**bold text**` produces literal asterisks in output. Solution: blank line between `<div>` and content, OR use `<strong>` / `<em>` tags directly.
  ```markdown
  <!-- WRONG: bold not processed -->
  <div class="col-main">
  **This stays as **asterisks**.
  </div>

  <!-- RIGHT: blank lines let markdown process -->
  <div class="col-main">

  **This becomes bold.**

  </div>
  ```
- **Missing `lang:` front matter**: without `lang: ko` (or ja/zh/en), `theme-foundation.css`'s `:lang()` cascade doesn't fire — Korean slides end up with Latin line-height (1.55 instead of 1.7). ALWAYS emit `lang:` from brief.md's `language` field.
- **`_class` directive case-sensitive + underscore matters**:
  - `<!-- _class: hero -->` → THIS slide only (single-slide scope)
  - `<!-- class: hero -->` → from here onward (deck-wide scope from this slide)
  - Prefer `_class` for every slide in autopilot output. Use `class` (no underscore) only for the first slide if EVERY slide uses one layout (rare).
- **CJK-only layout classes require theme opt-in**: `vertical-writing`, `ruby-annotation`, `banner-caption` are optional. Before emitting `<!-- _class: vertical -->`, grep `theme.css` for `section.vertical`. If absent, fall back to `quote` or `split` and log the downgrade to `.qa-log.md`.
- **Marp front matter `theme:` MUST match `/* @theme xxx */` in theme.css**: if mismatched, Marp silently falls back to default theme (no error, broken look). Extract theme name from first line of theme.css when emitting front matter.
- **Anti-pattern #10 "Thank You / Questions?" finale**: refuse to produce this even if the user's brief.md beats table explicitly asks for it. Replace with the one-sentence memory from brief.md.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/assets/layouts/*.md`
- `${CLAUDE_PLUGIN_ROOT}/assets/anti-patterns.md`
- `${CLAUDE_PLUGIN_ROOT}/assets/typography/korean-scale.md`
- `${CLAUDE_PLUGIN_ROOT}/scripts/render.sh`
