# Changelog

## 0.6.2 — 2026-04-17

### Fixed — Claude Desktop plugin validator compatibility

Claude Desktop (organization-level plugin installer) rejects `.difypkg`-style ZIP uploads that contain SKILL.md frontmatter fields with angle-bracket placeholders — its validator reads `<xxx>` as XML tags and blocks the plugin. Six offending frontmatter fields renamed to uppercase placeholders (shell-style) or rewritten in natural language.

**Affected files** (frontmatter `description` or `argument-hint`):
- `skills/slide-brainstorming/SKILL.md` — description: `./slides/<slug>/brief.md` → "a brief.md file inside the deck's slides directory"
- `skills/slide-export/SKILL.md` — description: `./slides/<slug>/out/` → "inside each deck's slides output directory"
- `skills/slide-theme-curator/SKILL.md` — description: `./slides/<slug>/theme.css` → "the deck's theme.css"
- `skills/slide-autopilot/SKILL.md` — argument-hint: `--preset <name>` → `--preset PRESET`
- `skills/slide-theme-gallery/SKILL.md` — argument-hint: `--preview <slug>` → `--preview SLUG`
- `skills/theme-forger/SKILL.md` — argument-hint: `--to <path>` → `--to PATH`

Body content of SKILL.md files (outside YAML frontmatter) still uses `<slug>` freely — that's pedagogically clearer and not validated.

### Released as
- GitHub release `v0.6.2` with `marp-slide-studio-v0.6.2.zip` asset — uploads cleanly into Claude Desktop organization plugin installer.

## 0.6.1 — 2026-04-17

### Added
- `scripts/check-deps.sh` — single-command pre-flight dependency check (Node, npx, Chrome, Playwright, marp-cli cache, offline font bundle). Colored output, OS-aware Chrome path detection, exits 0 when ready / 1 when blocked, prints install hint per missing item.
- `LICENSE` — MIT, copyright 2026 Min-Gul Kim. Required for GitHub License-badge auto-detection.
- `.github/workflows/publish-gallery.yml` — auto-rebuild and deploy the theme gallery to GitHub Pages whenever theme CSS / registry / sampler / gallery template changes. Live at https://kimmingul.github.io/marp-slide-studio/
- README **Prerequisites** section rewritten with `bash scripts/check-deps.sh` as the one-command verifier and OS-specific Chrome install commands.
- README install snippets and `MARKETPLACE.md` URL placeholders replaced with the canonical `kimmingul/marp-slide-studio` GitHub path.

### Changed
- `.claude-plugin/plugin.json` — description rewritten to highlight 63 themes + multilingual CJK + Latin + autopilot. Added `homepage` and `repository` fields. Keywords expanded to include `cjk-typography`, `korean`, `japanese`, `chinese`, `multilingual`, `claude-code-plugin`.
- `.claude-plugin/marketplace.json` — same description refresh; tags updated; `owner.name` and `plugins[0].author` set to "Min-Gul Kim".

### Fixed
- `.github/workflows/publish-gallery.yml` and `.github/workflows/slide-ci.yml` — removed `cache: "npm"` from `actions/setup-node` step. The plugin has no `package-lock.json` (dependencies are fetched on-demand via `npx`), so the cache option caused the workflow to fail in 16 seconds on first run.

### Released as
- GitHub release with `marp-slide-studio-v0.6.1.zip` attached as a custom-named asset for upload-style installers.

## 0.6.0 — 2026-04-17

### Added — multi-language support (KR / JA / ZH-Hans / ZH-Hant / Latin)

- **Shared `theme-foundation.css`**: new file imported by every theme. Provides Pretendard + Noto Sans JP/SC/TC + Inter CDN imports, per-language CSS variables, `:lang()` cascades for line-height / font family / italic discipline, numeral feature-settings for data contexts, Latin ligature settings for English/Latin decks.
- **Typography references**:
  - `assets/typography/cjk-scale.md` — unified Korean / Japanese / Chinese / Traditional Chinese scale with per-language font stacks and line-height calibration
  - `assets/typography/latin-scale.md` — English and Latin-script calibration (Inter-based, ligatures, smart quotes, hyphenation)
  - `assets/typography/mixed-language.md` — expanded to cover all CJK + Latin mixing patterns (Pretendard for KR+Latin, Noto Sans JP for JP+Latin, etc., plus `unicode-range` technique for editorial serif pairs)
- **Layout generalization**:
  - `assets/layouts/vertical-writing.md` — now covers Korean 세로쓰기, Japanese 縦書き, Chinese 竖排
  - `assets/layouts/ruby-annotation.md` (renamed from `hanja-ruby.md`) — covers Hanja, Furigana, Pinyin with Japanese and Chinese markdown examples
  - `assets/layouts/banner-caption.md` — 방주 / 傍注 / 夹注 with Hanja or native labels
- **Autopilot multilingualism**:
  - `default_language` field added to all 6 presets (5 English defaults, 1 Korean for `team-narrative`)
  - `--lang <code>` CLI flag on `/slide-auto` — accepts ko, en, ja, zh-Hans, zh-Hant, es, fr, de, pt, it
  - `resolve-config.mjs` threads the language into the final config JSON
- **slide-composer** emits `lang: <code>` in Marp front matter; themes auto-apply typography per `<html lang="…">`.
- **English README.md** — full GitHub-ready rewrite. Highlights multi-language support up front, shows usage examples in four languages (`ko`, `en`, `ja`, `zh-Hans`), covers installation, the 63-theme catalog, gallery, autopilot presets, CI integration, extending, licenses and credits.

### Changed
- `skills/korean-typography/` renamed to `skills/cjk-typography/`. Description and trigger phrases now cover Korean, Japanese, Chinese, and English/Latin.
- `assets/transform-prompt.md` Rule 3 rewritten: themes now import `theme-foundation.css` instead of hand-writing Pretendard imports. Previous Korean-first contract generalized to multi-language.
- `assets/typography/korean-scale.md` is now a stub pointing at `cjk-scale.md` (backward compatible).
- The 4 curated theme CSS files (`obsidian-mono`, `arctic-serif`, `kinfolk-serif`, `wired-grid`) refactored to import `theme-foundation.css` and use `var(--font-body-ko)` style references. They validate cleanly.
- `scripts/validate-theme.mjs` made more robust: strips comments before brace-matching (handles `{ko,ja,zh-Hans,zh-Hant}` literals in comments), accepts either direct CJK font reference OR `theme-foundation.css` import.

### Notes on scope
- The 5 previously-generated Tier 3 themes (stripe, linear-app, apple, notion, tesla) retain their original explicit Pretendard stacks. They still validate. Regenerating them via `/slide-theme <brand> --force` adopts the new foundation pattern.
- Registry entry mood descriptions and Korean-language copy remain in mixed language — they describe brand aesthetics neutrally and work across locales.

## 0.5.0 — 2026-04-17

### Added — Autopilot pipeline (`/slide-auto`)

- **Single-command end-to-end**: one invocation runs brief → theme → compose → refine → export without intermediate user prompts. Contract: after setup, zero interaction until the final report.
- **Express mode (default, ~30s setup)**: 3 questions — preset + length + memory sentence. Preset fills all 16 downstream decisions (audience, narrative, tone, track, theme, accent policy, refine iterations, export formats, PPTX editable flag, …).
- **Full mode (`--full`, ~2min setup)**: 4 batched AskUserQuestion calls covering all 16 fields. User overrides preset defaults field-by-field.
- **6 presets** in `assets/autopilot-presets.json`:
  - `investor-pitch` → stripe + problem-insight-solution-ask, 3 refine rounds, PDF+PPTX
  - `team-narrative` → kinfolk-serif + five-beats, 2 refine rounds, PDF
  - `research-talk` → arctic-serif + question-exploration-answer, 3 rounds, PDF+PPTX
  - `launch-keynote` → wired-grid + five-beats (provocative), 4 rounds, PDF+PPTX
  - `executive-brief` → obsidian-mono + situation-complication-resolution, 3 rounds, PDF+PPTX
  - `product-launch` → apple + hero-support-detail-proof-cta, 3 rounds, PDF+PPTX
- **Failure-safe degradation**: missing Playwright → skip refine; failed forge → fallback to curated Tier 2 theme; missing Chrome → HTML only; render error → preserve partial artifacts. Pipeline never blocks on a question mid-flight.
- **Full audit log**: every decision captured in `./slides/<slug>/.auto-log.md` with source (preset / user Q1-Q3) and per-step timing/status.

### Added — Helper scripts
- `scripts/autopilot/resolve-config.mjs` — merges preset + user answers → final JSON config
- `scripts/autopilot/log.mjs` — consistent `.auto-log.md` formatter (init / step / final)

### Changed
- `slide-composer` and `slide-visual-qa` skills now accept `--silent` flag for non-interactive invocation by autopilot. Manual/interactive use unchanged.
- README moves `/slide-auto` to top of the "how to use" section; step-by-step remains for users who want control.

### Notes
- Autopilot does NOT invoke the interactive skills (`slide-brainstorming`, `slide-theme-curator`). It writes `brief.md` directly from the resolved config and resolves themes directly (cache lookup or theme-forger dispatch).
- From-Prompt mode (parse natural-language config from a single user message) was deferred; Express + Full cover the designed use cases.

## 0.4.0 — 2026-04-16

### Added — Theme Gallery (3-mode visual selection)

- **Mode A: Mood Match** — 3-question quiz (surface / tone / intensity) scores all 63 themes and returns top 5–8 candidates in ~30 seconds. Always includes at least one Tier 2 curated theme as quality floor.
- **Mode B: Full Gallery** — browser-based grid of all 63 themes (4 curated + 5 generated + 54 on-demand). Filters by tier, track, category, density; free-text search across brand/mood/hallmarks. Modal shows all 7 sampler slides per theme. On-demand cards show palette swatches + "⚡ Forge" call-to-action with the exact `/slide-theme <brand>` command.
- **Mode C: Personal Preview** — render user's own deck against 5 candidate themes side-by-side with first-impression slides (1–3) per theme.
- **Sampler deck** (`examples/gallery-sampler/deck.md`) — brand-neutral 7-slide deck using every layout class; rendered against each theme for fair comparison.
- **Gallery builder** (`scripts/build-gallery.mjs`) — orchestrates rendering via marp-cli `--images png`, assembles filterable HTML with inlined metadata JSON. Outputs to `~/.marp-slide-studio/gallery/` (plugin repo stays clean).
- **Gallery skill** (`skills/slide-theme-gallery/SKILL.md`) — the 3-mode router invoked by `/slide-gallery`.
- **Curator routing** — `slide-theme-curator` now offers gallery modes as entry-point options before its existing track/brand flow.

### Changed
- `slide-theme-curator` adds Step 2.5 — gallery mode entry question for users who haven't scoped their request.
- README documents the 3 gallery modes.

### Security
- `gallery/gallery.js` uses only safe DOM methods (`createElement`, `textContent`, attribute setters) — no `innerHTML` with dynamic content. Passes the plugin's XSS advisory hook.

### Build verification
- 9 cached themes rendered end-to-end (4 curated + 5 generated): `obsidian-mono`, `kinfolk-serif`, `arctic-serif`, `wired-grid`, `stripe`, `linear-app`, `apple`, `notion`, `tesla`.
- 63 × 7 = 441 potential slide PNGs, 63 actually rendered (for cached themes), 54 on-demand cards use palette swatch fallback.
- Gallery total size: 2.2MB. Build time: ~2 minutes for 9 themes.

## 0.3.0 — 2026-04-16

### Added — Theme-Foundry pipeline

- **59-brand registry** (`assets/design-systems/registry.json`) covering AI/LLM (Claude, Cohere, Mistral, etc.), dev tools (Cursor, Vercel, Raycast…), backend (MongoDB, Sentry, Supabase…), productivity (Linear, Notion, Zapier…), design/creative (Figma, Framer, Webflow…), fintech (Stripe, Coinbase, Wise…), automotive (Tesla, BMW, Ferrari…), media (Apple, IBM, Spotify…), travel (Airbnb). Each entry carries palette, density, typography direction, hallmarks, and mood.
- **Transform spec** (`assets/transform-prompt.md`) — 9 rules defining the web→slide conversion contract: strip interactive states, collapse color semantics to 8 tokens, inject Pretendard, rescale type (16px body → 22px body), mandate 7 layout classes, preserve brand voice in prose, enforce accent discipline, require attribution, require validation.
- **Validator** (`scripts/validate-theme.mjs`) — checks 8 color tokens, 3 font tokens, 6 scale tokens, 3 line-heights, all 7 layout classes, Korean-safety rules (line-height ≥ 1.6, no global uppercase, Pretendard present), attribution comment, no `!important`.
- **Forge orchestrator** (`scripts/forge-theme.mjs`) — `brief/list/check/paths/info` commands produce structured input the `theme-forger` agent consumes.
- **Theme-forger skill** (`skills/theme-forger/SKILL.md`) — orchestrates: resolve brand → check cache → generate brief → dispatch agent → validate → retry on failure (max 2) → cache result.
- **Theme-forger agent** (`agents/theme-forger.md`) — the Sonnet agent that reads the transform spec + sample theme + brief, then writes DESIGN.md + Marpit CSS with self-validation before writing.
- **Generated samples** (5 themes, all pass validator with 0 errors, 0 warnings):
  - `stripe` — signature purple/cyan on navy, sparse density, developer-premium
  - `linear-app` — dark-native near-black + ghost-purple accent
  - `apple` — monochrome discipline, cathedral whitespace, no chromatic accent
  - `notion` — warm cream paper + serif headlines + orange accent
  - `tesla` — industrial-minimal, restrained red brake-light accent

### Changed
- `slide-theme-curator` now routes across 3 tiers: curated themes (Tier 2, hand-crafted), cached generated themes (Tier 3 cache), on-demand generation (Tier 3 fresh via theme-forger). Extracts brand names from natural-language requests ("Stripe처럼"), handles aliases (Linear → linear.app).
- README documents the 3-tier catalog + the 59-brand registry up front.
- `obsidian-mono.marp.css` gains an explicit `--font-display` token (previously implicit) for validator compliance.

### Notes on quality
Generated themes are ~80–90% of hand-crafted quality. They pass the structural validator and respect Korean typography rules. For production-critical decks, always follow with `/slide-refine` (visual QA loop) and consider promoting heavily-used generated themes to Tier 2.

### Licensing
Registry metadata synthesizes publicly visible brand aesthetics — not affiliated with any listed brand. Every generated theme carries an "Inspired by <brand>. Not affiliated." disclaimer. Upstream: VoltAgent/awesome-design-md (MIT) and getdesign.md as reference.

## 0.2.0 — 2026-04-16

### Added
- **Themes**: `arctic-serif` (minimalist-premium, cool gray + navy + deep blue accent, built-in footnote rail), `wired-grid` (editorial, monochrome + electric orange, visible grid decoration, JetBrains Mono overlines).
- **Korean-only layouts**: `vertical-writing` (세로쓰기), `hanja-ruby` (한자 병기 with `<ruby>` elements), `banner-caption` (방주/협주 style main + side commentary).
- **Offline font bundle**: `scripts/fetch-fonts.sh` downloads Pretendard Variable, Noto Serif KR, JetBrains Mono. Generates `assets/fonts/offline.css` with `@font-face` declarations for air-gapped/team-distribution use.
- **CI integration**: `.github/workflows/slide-ci.yml` auto-renders changed decks on PR, captures Playwright screenshots, diffs against base branch via pixelmatch, posts per-slide diff table as PR comment, uploads HTML/PDF/PPTX/PNG artifacts.
- **Marketplace manifest**: `.claude-plugin/marketplace.json` + `MARKETPLACE.md` for publishing as a single-plugin marketplace or inclusion in a team marketplace.
- **Second worked example**: `examples/sample-deck-2/` — Wired Grid 12-slide trend report on AI presentation trends, demonstrating editorial track + Five Beats narrative.

### Changed
- `slide-composer` skill now maps Korean-only layout classes and checks theme.css compatibility before emitting them.
- `slide-theme-curator` skill presents 2 themes per track instead of 1.
- README lists all 4 themes and documents Korean-only layouts.
- `assets/layouts/README.md` separates "core" (every theme implements) from "Korean-only" (opt-in).

### Security
- CI workflow validates deck slugs against `[a-zA-Z0-9._-]{1,64}` to prevent shell injection from git-discovered directory names.
- All user-controllable workflow inputs (`inputs.slug`, `github.base_ref`) routed through `env:` blocks rather than direct expression interpolation.

## 0.1.0 — 2026-04-16

Initial release. 7 skills, 2 agents, 2 themes (Obsidian Mono, Kinfolk Serif), 7 core layouts, anti-patterns + narrative-patterns + Korean typography guides, marp CLI render/export scripts, first worked example.
