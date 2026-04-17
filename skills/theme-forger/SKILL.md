---
name: theme-forger
description: Use when a user requests a slide theme for a specific brand from the 59-brand registry — e.g. "Stripe처럼 테마 만들어줘", "Make a theme for Linear", "/slide-theme tesla". Also invoked automatically by slide-theme-curator when a requested brand is not in the curated (Tier 2) catalog. Orchestrates the Theme-Foundry pipeline — loads registry metadata, dispatches the theme-forger agent to generate DESIGN.md + Marpit CSS following assets/transform-prompt.md, validates output, caches result.
argument-hint: "[brand-slug] [--to PATH]"
allowed-tools: Read, Write, Edit, Glob, Bash(node:*, bash:*, test:*), Task
---

# Theme Forger

On-demand generation of slide themes for any brand in `assets/design-systems/registry.json` (59 brands). Bridges the "curated vs on-demand" gap by producing validated `.design.md` + `.marp.css` pairs in the `generated/` sub-track.

## When invoked

- User asks for a brand-specific theme that isn't in the curated catalog
- `slide-theme-curator` delegates here after detecting a brand-match query
- Direct invocation via `/marp-slide-studio:theme-forger <brand>`

## Procedure

### Step 1 — Resolve brand

Accept `$1` as the brand slug. If empty, list available brands via `node scripts/forge-theme.mjs list` and ask user.

Validate:
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/forge-theme.mjs check "$1"
```
If exit non-zero, show the list and abort.

### Step 2 — Check cache (v0.8.0+ three-location lookup)

Look in order:

1. **User cache** — `${CLAUDE_PLUGIN_DATA:-~/.marp-slide-studio}/themes/<slug>.marp.css` (primary; persists across plugin upgrades)
2. **Seed** — `${CLAUDE_PLUGIN_ROOT}/examples/seed-themes/<slug>.marp.css` (shipped with plugin, read-only)
3. **Legacy** — `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/generated/<slug>.marp.css` (backward compat, pre-v0.8.0 installs)

`node scripts/forge-theme.mjs paths <brand>` prints the canonical output path AND the currently-cached path (if any) with its source.

If found AND the user didn't pass `--force`, skip regeneration — use the cached pair and proceed to step 7. Note in the log: "cache hit (source: user/seed/legacy)".

If found at a non-primary source (seed or legacy) AND the user passed `--force`, generate fresh to the primary user-cache location.

### Step 3 — Generate forge brief

```
node ${CLAUDE_PLUGIN_ROOT}/scripts/forge-theme.mjs brief <brand>
```

The output is a JSON brief the agent will consume. It contains:
- Brand metadata (palette, mood, hallmarks, density)
- Suggested track
- Required input files (transform-prompt, korean-scale, layouts)
- Expected output paths
- Validation command

### Step 4 — Dispatch theme-forger agent

Use the Task tool to launch the `theme-forger` agent with:
- The forge brief JSON (from Step 3)
- A directive to read these reference files in order:
  1. `${CLAUDE_PLUGIN_ROOT}/assets/transform-prompt.md` — the spec
  2. `${CLAUDE_PLUGIN_ROOT}/assets/typography/korean-scale.md` — Korean rules
  3. `${CLAUDE_PLUGIN_ROOT}/assets/typography/mixed-language.md` — mixed KR+EN
  4. `${CLAUDE_PLUGIN_ROOT}/assets/layouts/README.md` — layout catalog
  5. `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/minimalist-premium/obsidian-mono.marp.css` OR `editorial/kinfolk-serif.marp.css` — a SAMPLE to pattern-match structure
- Instruction: produce the TWO output files at the paths in the brief's `output` object

The agent uses Write to create `<brand>.design.md` and `<brand>.marp.css` directly.

### Step 5 — Validate

```
node ${CLAUDE_PLUGIN_ROOT}/scripts/validate-theme.mjs \
  ${CLAUDE_PLUGIN_ROOT}/assets/design-systems/generated/<slug>.marp.css
```

Interpret exit code:
- `0` → pass, continue to Step 6
- `1` → validation errors. Go to Step 5a (retry)
- `2` → script error (usage). Investigate.

### Step 5a — Retry (max 2 retries)

If validator reports errors:
1. Read the validator output.
2. Re-dispatch the agent with the errors included: "Your previous attempt failed validation with these specific errors: <list>. Fix only these, preserve everything else."
3. Re-validate.
4. If second retry also fails, abort with the final error report and instruct user to run manually.

### Step 6 — Cache + optionally copy to target

If `--to <path>` was given, copy both files to `<path>/theme.css` (rename .marp.css → theme.css per our project convention).

The generated files always live in `assets/design-systems/generated/` for future cache hits.

### Step 7 — Report to user

```
✓ Theme forged: <brand> (track: <track>)
  ${CLAUDE_PLUGIN_ROOT}/assets/design-systems/generated/<slug>.design.md
  ${CLAUDE_PLUGIN_ROOT}/assets/design-systems/generated/<slug>.marp.css
  Validation: PASSED (N warnings)

다음 단계:
  /slide-compose <slug>     — 이 테마로 덱 생성
  /slide-theme <deck-slug>  — 이 테마를 기존 덱에 적용
```

## Not your job (delegate)

- Composing actual slides → `slide-composer`
- Selecting which brand/track the user should pick → `slide-theme-curator`
- Visual review of the generated result → `slide-visual-qa` / `slide-director` / `marp-design-critic`

## Failure modes

- **Brand not in registry**: list the 59 and ask user to pick one. Do NOT generate for arbitrary strings.
- **Validation keeps failing**: the transform prompt may need updating, or the brand's visual language is unusually complex. Fall back to suggesting a close curated theme (Obsidian Mono, Kinfolk Serif, etc.).
- **Network/Pretendard CDN blocked**: theme still validates (CDN reference exists) but user's render will fall back to system fonts. Note this in the report.

## Extension: user-supplied brand

If the user wants a brand NOT in registry.json (e.g., their own company), they can pass `--custom <path-to-brand-spec.json>` where the JSON matches the registry entry schema. This skill consumes it the same way. The resulting theme lands in `generated/` under the custom slug.

## Notes on quality

Generated themes are not identical to hand-crafted ones. They are:
- **Structurally correct** (pass validator)
- **Brand-aligned** (use the signature palette and typography direction)
- **Korean-ready** (Pretendard loaded, line-height safe)
- **Not pixel-perfect** to the original brand

For a production-critical deck, run `/slide-refine` after composing — the visual QA loop will catch the edge cases.

For the team's most-used brands, consider promoting a generated theme to Tier 2 by hand-editing `generated/<slug>.{design,marp.css}.md` and moving it to `<track>/`.

## Gotchas

- **Brand must exist in registry.json**: arbitrary strings rejected. `forge-theme.mjs check <brand>` returns non-zero for unknown. Do NOT attempt to forge for brands not listed — the registry signature metadata is what drives quality.
- **`--force` regenerates even when cached**: use when transform-prompt.md or theme-foundation.css has been updated. Normal users don't need it.
- **Validator rejects frontmatter XML-tags** (since v0.6.2): if generated SKILL.md description contains `<slug>`, `<path>`, etc. placeholder markers, validator fails. Use UPPERCASE or natural language.
- **Validator comment-regex fragility** (fixed v0.6.3): comments with `{ko,ja,zh-hans,zh-hant}` curly braces used to break `:root { ... }` balance-matching. Current validator strips comments first — safe to use braces, but avoid if possible.
- **Attribution footer is mandatory**: every generated DESIGN.md MUST end with the "Inspired by <brand>. Not affiliated." disclaimer from Rule 8 of transform-prompt.md. Skipping this is a legal+ethical failure, not just a validation warning.
- **Retry budget is 2**: on validator FAIL, re-dispatch once more with specific errors. If that also fails, abort and recommend fallback to a curated theme in the same track. Do NOT infinite-loop retries.
- **Output path migrated in v0.8.0**: writes go to `${CLAUDE_PLUGIN_DATA}/themes/<slug>.*`, not `assets/design-systems/generated/`. Parent dir may not exist — create with `mkdir -p` before writing.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/registry.json`
- `${CLAUDE_PLUGIN_ROOT}/assets/transform-prompt.md`
- `${CLAUDE_PLUGIN_ROOT}/scripts/forge-theme.mjs`
- `${CLAUDE_PLUGIN_ROOT}/scripts/validate-theme.mjs`
- `${CLAUDE_PLUGIN_ROOT}/agents/theme-forger.md`
