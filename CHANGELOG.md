# Changelog

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
