# Changelog

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
