# Changelog

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
