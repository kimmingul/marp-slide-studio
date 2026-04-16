# marp-slide-studio

**Build Marp decks that don't look AI-generated.** A Claude Code plugin that grounds slide generation in real brand design systems, Korean-first typography, and a Playwright-powered visual review loop.

**v0.3.0** — Theme-Foundry: 59-brand registry + on-demand theme generation via `theme-forger` skill/agent, 5 sample generated themes (Stripe, Linear, Apple, Notion, Tesla), transform spec (web→slide), theme validator, slide-theme-curator now routes 3-tier (curated → cached → on-demand).

**v0.2.0** — 4 curated themes (2 per track), 3 Korean-specific layouts (세로쓰기 · 한자 병기 · 방주), offline font bundle, GitHub Actions CI with per-slide screenshot diffs, marketplace manifest, second worked example.

> Why this exists: PowerPoint and Keynote hand you a template and leave the design decisions to you. This plugin does the opposite — it injects opinionated design systems from awesome-design-md, enforces hard anti-patterns, and iteratively refines the output until it no longer smells of "generic AI."

## What you get

| Stage | Command | What happens |
|---|---|---|
| 1. Brief | `/slide-new [topic]` | 5 focused questions → `./slides/<slug>/brief.md` |
| 2. Theme | `/slide-theme [slug]` | Pick from curated design systems → `theme.css` |
| 3. Compose | `/slide-compose [slug]` | Brief + theme → `deck.md` + initial HTML preview |
| 4. Refine | `/slide-refine [slug] [iter]` | Playwright screenshots + AI critic loop (N rounds) |
| 5. Export | `/slide-export [slug] [pdf\|pptx\|both]` | Final PDF + PPTX |

All commands are skills under `skills/`. Invoke with `/marp-slide-studio:<skill-name>`.

## Design systems

### Tier 2 — Hand-crafted (quality ceiling)

**Minimalist Premium track**
- **Obsidian Mono** — quiet confidence, cream + deep-ink + terracotta accent. Executive briefings, architecture talks.
- **Arctic Serif** — cool gray + navy, Noto Serif KR display, footnote rail. Research, policy, academic defenses.

**Editorial track**
- **Kinfolk Serif** — Noto Serif KR display + Pretendard body, cream paper + burgundy. Brand narratives, cultural talks.
- **Wired Grid** — monochrome + electric orange, Pretendard 900 + JetBrains Mono, visible grid. Keynotes, trend reports.

### Tier 3 — 59-brand registry (on-demand generation)

Every brand listed in [`assets/design-systems/registry.json`](assets/design-systems/registry.json) — 59 total across AI/LLM, dev tools, backend, productivity, design, fintech, automotive, media, commerce.

```bash
# See everything available
node scripts/forge-theme.mjs list

# Generate any brand on first request — e.g.
/slide-theme stripe        # on-demand forge → cached for next time
/slide-theme linear.app
/slide-theme tesla
```

Generated themes:
- Land in `assets/design-systems/generated/<slug>.{design.md,marp.css}`
- Pass the same validator as hand-crafted themes
- Load Pretendard by default (Korean-ready)
- Include brand attribution disclaimers
- Regenerable — delete cache + re-request, or edit `registry.json` to tune

Sample output already shipped: `stripe`, `linear-app`, `apple`, `notion`, `tesla` — rendered and validated end-to-end as proof of pipeline.

### Adding your own brand
- Curated (Tier 2): copy an existing theme pattern, edit tokens, move to `<track>/`
- Registry (Tier 3): add an entry to `registry.json`, then `/slide-theme <your-brand>`
- One-off custom: `theme-forger --custom <path-to-brand.json>`

## Korean-specific layouts (optional)

Beyond the 7 core layouts, three layouts exist for Korean-first typographic moments:
- **vertical-writing** (세로쓰기) — reverent, for classical quotations
- **hanja-ruby** (한자 병기) — `<ruby>` annotations for academic terminology
- **banner-caption** (방주/협주) — main claim + side commentary on one slide

These require the current theme to style the class (check `theme.css`). The core themes don't implement them by default — copy the CSS block from the layout doc into your theme as needed.

## Prerequisites

- **Node.js ≥ 18**, npm or pnpm — for `npx @marp-team/marp-cli@latest`
- **Google Chrome / Chromium** — marp CLI uses headless Chrome for PDF/PPTX
- **Playwright** (optional, for `/slide-refine`):
  ```bash
  npm i -D playwright && npx playwright install chromium
  ```
- **Internet at render time** — themes import Pretendard and Noto Serif KR via CDN. For offline use, swap the `@import` lines for local `@font-face` declarations.

## Installation

### As a Claude Code plugin

Point Claude Code at this directory:
```bash
# From any project where you want to create slides
claude --plugin-dir /path/to/marp-slide-studio
```

Or copy into a team marketplace and enable via `/plugin`.

### Team setup (optional)

Create `.claude/marp-slide-studio.local.md` in your project root:

```yaml
---
team_brand_primary: "#0A0A0A"
team_brand_accent: "#FF5B13"
default_track: "minimalist-premium"
author_default: "Our Team"
logo_path: "./brand/logo.svg"
---
```

These defaults pre-fill the brief and theme customization steps.

## Quick start

```
/slide-new  "한글 슬라이드 타이포를 망치지 않는 법"
```
Answer 5 questions. Receive `./slides/hangul-typography/brief.md`.

```
/slide-theme hangul-typography
```
Pick Obsidian Mono or Kinfolk Serif. Optionally customize accent color.

```
/slide-compose hangul-typography
```
Get `deck.md` + `out/deck.html` (open in a browser to preview).

```
/slide-refine hangul-typography 3
```
3 rounds of Playwright capture → slide-director + marp-design-critic review → auto-edits.

```
/slide-export hangul-typography both
```
Get `deck.pdf` + `deck.pptx`.

## Project output structure

```
your-project/
├── .claude/
│   └── marp-slide-studio.local.md    # team defaults (optional)
└── slides/
    └── <slug>/
        ├── brief.md                   # narrative brief
        ├── theme.css                  # copied + customized
        ├── deck.md                    # Marp markdown
        ├── out/
        │   ├── deck.html
        │   ├── deck.pdf
        │   ├── deck.pptx
        │   └── screenshots/
        └── .qa-log.md                 # refine loop history
```

Add to your `.gitignore`:
```
slides/*/out/
slides/*/.qa-log.md
```

## What makes slides better than pptx/keynote?

1. **Injected design systems, not templates.** The AI reads `DESIGN.md` (philosophy, do's/don'ts, token roles) before generating. Templates give you CSS; design systems give you a point of view.
2. **Hard anti-patterns encoded.** 18 specific things the composer refuses to produce (three-column card mosaic, purple gradients, stock icons, "Thank You / Questions?" finale, …). See `assets/anti-patterns.md`.
3. **Narrative-first composition.** Every slide must declare its one-sentence message. No beat, no slide. See `assets/narrative-patterns.md`.
4. **Visual review loop.** Playwright captures each slide, two specialist agents evaluate structure and aesthetics, edits apply automatically. pptx has no such loop.
5. **Korean-first typography.** Pretendard baked in. Line-height 1.7 for body. No italicized Hangul. See `skills/korean-typography/`.
6. **Force choices over options.** One accent color. Two typefaces max. Three bullets max. Monumental or hero, not both. Constraint produces style.

## Extending

### Adding a new theme

1. `cp assets/design-systems/minimalist-premium/obsidian-mono.{design.md,marp.css} assets/design-systems/<track>/<new-name>.{design.md,marp.css}`
2. Edit the `@theme` line in the CSS.
3. Redefine tokens in `:root`.
4. Ensure all 7 required layout classes still render correctly. See `skills/marp-theme-engineer/SKILL.md` for the checklist.
5. Rewrite `DESIGN.md` to match.

### Adding a new layout

1. Create `assets/layouts/<name>.md` with the markdown template + required CSS.
2. Add the `section.<name>` rule to every theme CSS.
3. Update `assets/layouts/README.md` index.
4. Update `skills/slide-composer/SKILL.md` layout-class mapping.

### Adding a new narrative pattern

Edit `assets/narrative-patterns.md` — add the pattern with act structure. It becomes available automatically to `/slide-new`.

## Components reference

- **Skills** (7): `slide-brainstorming`, `slide-theme-curator`, `slide-composer`, `slide-visual-qa`, `slide-export`, `marp-theme-engineer`, `korean-typography`
- **Agents** (2): `slide-director` (structural review), `marp-design-critic` (aesthetic review)
- **Assets**: 18 anti-patterns, 5 narrative patterns, 7 layouts, 2 typography guides, 2 design systems

## Limitations

- PPTX export in non-editable mode renders slides as images. Editable mode preserves text but sacrifices some CSS fidelity. Decide per deck.
- Fonts require internet at render time unless you bundle locally.
- The refine loop currently runs at 1920×1080 only; responsive/mobile decks are out of scope.
- Korean-first; pure English decks work but the typography tuning is over-engineered for them.

## License

MIT. Design-system files reference their original brand inspirations; the CSS implementations are original work.
