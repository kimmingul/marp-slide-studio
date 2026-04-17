# marp-slide-studio

**Build Marp decks that don't look AI-generated.**

A Claude Code plugin that grounds slide generation in real brand design systems, **Gothic (sans-serif) typography by default** for Korean business/tech contexts, and a Playwright-powered visual review loop. Multilingual CJK + Latin support (Korean, Japanese, Chinese, English). Ships with **65 themes** — 6 hand-crafted (4 Gothic + 2 editorial serif variants) plus on-demand generation for 59 brands from a curated registry (Stripe, Apple, Linear, Notion, Tesla, Figma, Spotify, IBM, BMW, Ferrari, and more).

> **v0.7.0 typography pivot**: the plugin now defaults to Gothic/sans-serif — matching Korean business and tech slide conventions. Editorial serif themes (`kinfolk-serif`, `arctic-serif`) remain available as opt-in via `--typography editorial` or direct theme pick. See [Design systems](#design-systems) below.

## Why this exists

Slide tools have not meaningfully changed in 20 years. PowerPoint (1987) and Keynote (2003) hand you a template and leave the design decisions to you. Modern AI slide generators produce decks that are pixel-perfect but look identical — purple gradients, three-column card mosaics, stock icons, generic sans-serif everything.

`marp-slide-studio` takes a different approach:

1. **Design systems, not templates.** Each theme ships with a documented point of view (mood, palette logic, typography rules, do's and don'ts). The composer reads these before generating.
2. **Hard anti-patterns encoded.** 18 specific things the composer refuses to produce — three-column card mosaic, purple-on-white gradients, stock icons, "Thank You / Questions?" finale.
3. **Narrative-first composition.** Every slide must declare a one-sentence message. No beat, no slide.
4. **Visual review loop.** Playwright captures each slide; two specialist agents (structural + aesthetic) critique and auto-edit. PowerPoint has no such loop.
5. **Multilingual typography baked in.** Korean, Japanese, Chinese (Simplified + Traditional), and English all get language-aware line-height, font stacks, and italic discipline via CSS `:lang()` selectors.
6. **Force choices over options.** One accent color. Two typefaces max. Three bullets max. Constraint produces style.

## Key features

- **One-command pipeline** (`/slide-auto`) — brief → theme → compose → refine → export, no mid-flight prompts
- **Gothic-by-default typography** — sans-serif everywhere unless you explicitly request editorial serif. Matches Korean business/tech slide conventions.
- **65 themes** — 6 hand-crafted (4 Gothic + 2 editorial opt-in serif variants) + 59 brand registry with on-demand generation
- **Multilingual CJK + Latin** — KR / JP / ZH-Hans / ZH-Hant / EN via `:lang()` selectors
- **Interactive gallery** (`/slide-gallery`) — browser-based visual selection with filters
- **Mood Match quiz** — 3 questions → 5–8 theme recommendations
- **Playwright refine loop** — N rounds of auto-critique and diff application
- **PDF + PPTX export** — editable PowerPoint mode optional
- **GitHub Actions CI** — auto-render changed decks on PR with pixel-diff screenshots

## Supported languages

The plugin supports five writing systems with dedicated typography calibration:

| Language | Code | Primary body font | Italic discipline | Line-height (body) |
|---|---|---|---|---|
| Korean | `ko` | Pretendard Variable | Weight 500 as emphasis (no italic) | 1.7 |
| Japanese | `ja` | Noto Sans JP, Hiragino Sans | Weight 500 as emphasis (no italic) | 1.7 |
| Chinese (Simplified) | `zh-Hans` | Noto Sans SC, PingFang SC | Weight 500 as emphasis (no italic) | 1.7 |
| Chinese (Traditional) | `zh-Hant` | Noto Sans TC, PingFang TC | Weight 500 as emphasis (no italic) | 1.7 |
| English + Latin scripts | `en`, `es`, `fr`, `de`, `pt`, `it` | Inter | Italic as designed | 1.55 |

Declare your deck's language in Marp front matter:

```markdown
---
marp: true
theme: obsidian-mono
lang: ja
---

# 新しい始まり
```

Themes automatically swap font family, line-height, ligatures, and emphasis styling via CSS `:lang()` selectors — no manual per-slide fiddling.

The plugin also ships three layouts unique to CJK writing systems:

- **Vertical writing** (세로쓰기 / 縦書き / 竖排) — ceremonial orientation for classical quotations
- **Ruby annotation** (한자 병기 / 振り仮名 / 拼音) — phonetic overlay using HTML `<ruby>`
- **Banner-caption** (방주 / 傍注 / 夹注) — main claim + side commentary

## Prerequisites

Run the dependency check first — it prints a colored report and exits 0 when everything is in place:

```bash
bash scripts/check-deps.sh
```

Expected output when ready:

```
▸ marp-slide-studio dependency check
────────────────────────────────────────

Required
  ✓ Node.js ≥ 18             v20.x.x
  ✓ npx                      …/bin/npx
  ✓ Chrome / Chromium        /Applications/Google Chrome.app/…
  ✓ marp-cli                 cached via npx — instant first run
  … (or ○ not cached — first run fetches ~30–60s, one-time)

Optional
  ⚠ Playwright               not installed — /slide-refine visual QA will be skipped
    enable with: npm i -D playwright && npx playwright install chromium

Status: READY
```

### Required

- **Node.js ≥ 18** — install from [nodejs.org](https://nodejs.org) or use a version manager (`nvm`, `fnm`, `volta`). `npx` ships with it.
- **Google Chrome or Chromium** — marp CLI uses headless Chrome for PDF/PPTX export.
  - **macOS**: install from [google.com/chrome](https://www.google.com/chrome/) or `brew install --cask google-chrome`
  - **Linux**: `sudo apt install google-chrome-stable` (Debian/Ubuntu) or `sudo apt install chromium-browser`
  - **Windows**: install from [google.com/chrome](https://www.google.com/chrome/)
  - Or set the `CHROME_PATH` env var to point at a custom Chrome/Chromium binary.

### Installed automatically on first use

- **marp-cli** — the plugin invokes it via `npx --yes @marp-team/marp-cli@latest`. No manual install needed; the first `/slide-compose` or `/slide-export` downloads it into npm's cache (~30–60 seconds), subsequent runs are instant. Override with `MARP_BIN=/your/path` if you prefer a pinned local install.

### Optional (enable extra features)

- **Playwright** — enables the `/slide-refine` visual QA loop (per-slide screenshots + AI aesthetic review). Without it, the refine loop is skipped silently and the rest of the pipeline continues.
  ```bash
  npm i -D playwright && npx playwright install chromium
  ```

- **Offline font bundle** — by default fonts (Pretendard, Noto Sans JP/SC/TC, Inter, editorial serifs) load from CDN at render time. For air-gapped environments or reproducible team distribution, bundle them locally:
  ```bash
  bash scripts/fetch-fonts.sh
  ```
  This downloads ~8 MB into `assets/fonts/` and writes `assets/fonts/offline.css`. Swap theme `@import` lines to use it.

## Installation

### Option 1 — Standalone plugin directory

```bash
git clone https://github.com/kimmingul/marp-slide-studio.git
claude --plugin-dir /absolute/path/to/marp-slide-studio
```

### Option 2 — Single-plugin marketplace

```
# In Claude Code
/plugin marketplace add https://github.com/kimmingul/marp-slide-studio
/plugin install marp-slide-studio
```

### Option 3 — Team marketplace entry

Add to your existing team marketplace:

```json
{
  "plugins": [
    {
      "name": "marp-slide-studio",
      "source": "github:kimmingul/marp-slide-studio",
      "version": "0.6.0"
    }
  ]
}
```

### Team settings (optional)

Create `.claude/marp-slide-studio.local.md` in your project root:

```yaml
---
team_brand_primary: "#0A0A0A"
team_brand_accent: "#FF5B13"
default_track: "minimalist-premium"
default_language: "en"
author_default: "Our Team"
---
```

## Quick start

### Autopilot (recommended)

```
/slide-auto "Rethinking cloud billing for AI workloads"
```

Claude asks 3 questions (preset, length, memory sentence), then runs the full pipeline autonomously. 5–10 minutes total.

```
/slide-auto "スライドの未来について" --preset launch-keynote --lang ja
/slide-auto "产品发布" --preset product-launch --lang zh-Hans
/slide-auto "한글 슬라이드 타이포" --preset research-talk --lang ko
```

### Step-by-step (when you want control)

| Stage | Command | What happens |
|---|---|---|
| 1. Brief | `/slide-new [topic]` | 5 questions → `./slides/<slug>/brief.md` |
| 2. Theme | `/slide-theme [slug]` | Pick from curated + registry themes → `theme.css` |
| 3. Compose | `/slide-compose [slug]` | Brief + theme → `deck.md` + HTML preview |
| 4. Refine | `/slide-refine [slug] [iter]` | Playwright screenshots + AI critic loop |
| 5. Export | `/slide-export [slug] [pdf\|pptx\|both]` | Final PDF + PPTX |

### Gallery

```
/slide-gallery
```

Opens a browser-based filterable grid of all 65 themes. Click any card to see all 7 sampler slides rendered in that theme. Copy the `/slide-theme <slug>` command back into Claude to apply.

Three gallery modes:
- **Mood Match** (default, ~30s) — 3 quiz questions → 5–8 recommendations
- **Full Gallery** (browser) — all 65 themes
- **Personal Preview** — your own deck rendered against 5 candidate themes

## Design systems

### Default themes (Gothic, business/tech-first)

These are the primary themes used by all autopilot presets in default mode. **All sans-serif, Pretendard-based**, calibrated for Korean/CJK business slides.

| Theme | Palette | Use case |
|---|---|---|
| **Obsidian Mono** | cream + deep ink + terracotta | Executive briefings, architecture talks |
| **Arctic Sans** (new in 0.7) | cool gray + navy + deep blue | Research presentations, policy briefings with footnote rail |
| **Kinfolk Sans** (new in 0.7) | warm cream + burgundy | Team narratives, brand storytelling in warm palette |
| **Wired Grid** | monochrome + electric orange, Pretendard 900 display | Keynotes, trend reports, cultural criticism |

### Editorial themes (opt-in, serif display)

For explicit editorial atmosphere — classical quotations, literary narratives, academic publications where serif carries meaning. Same palettes as the Gothic variants above, paired with Noto Serif KR / JP / SC / TC display.

| Theme | Gothic variant | Use case |
|---|---|---|
| **Kinfolk Serif** | kinfolk-sans | Editorial brand narratives, cultural/mission talks with serif gravitas |
| **Arctic Serif** | arctic-sans | Scholarly publications with serif journal aesthetic |

How to opt in:
```bash
# Direct theme pick
/slide-theme kinfolk-serif
/slide-theme arctic-serif

# Autopilot override (preset auto-swaps to serif variant)
/slide-auto "팀 공유" --preset team-narrative --typography editorial

# Team-wide default (in .claude/marp-slide-studio.local.md)
default_typography: editorial
```

### Brand registry (Tier 3, 59 themes on-demand)

Every brand listed in [`assets/design-systems/registry.json`](assets/design-systems/registry.json). Categories:

- **AI & LLM** — Claude, Cohere, ElevenLabs, Mistral, Ollama, Replicate, RunwayML, Together, VoltAgent, x.ai, MiniMax
- **Dev tools** — Cursor, Expo, Lovable, Raycast, Superhuman, Vercel, Warp, Opencode
- **Backend / DevOps** — ClickHouse, Composio, HashiCorp, MongoDB, PostHog, Sanity, Sentry, Supabase
- **Productivity** — Cal, Intercom, Linear, Mintlify, Notion, Resend, Semrush, Zapier
- **Design & creative** — Airtable, Clay, Figma, Framer, Miro, Webflow
- **Fintech** — Coinbase, Kraken, Revolut, Stripe, Wise
- **Automotive** — BMW, Ferrari, Lamborghini, Renault, Tesla
- **Media & consumer** — Apple, IBM, NVIDIA, Pinterest, SpaceX, Spotify, Uber
- **Travel / commerce** — Airbnb

```bash
# See everything available
node scripts/forge-theme.mjs list

# Generate any brand on first request
/slide-theme stripe           # on-demand forge → cached
/slide-theme linear.app
/slide-theme tesla --force    # regenerate even if cached
```

Generated themes:
- Land in `assets/design-systems/generated/<slug>.{design.md,marp.css}`
- Pass the same structural validator as hand-crafted themes
- Load Pretendard + all CJK + Inter via `theme-foundation.css`
- Include "Inspired by <brand>. Not affiliated." disclaimers
- Regenerable — delete cache and re-request to pick up upstream changes

Acknowledgement: brand metadata is synthesized from publicly visible aesthetics, inspired by [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT) and [getdesign.md](https://getdesign.md). No proprietary content is redistributed.

## Autopilot presets

Six presets cover 80% of deck types. **All presets default to Gothic typography** (v0.7.0+). Two presets have defined serif variants that swap in when `--typography editorial`.

| Preset | Default theme (Gothic) | Serif variant (opt-in) | Narrative pattern | Lang | Refine | Export |
|---|---|---|---|---|---|---|
| `investor-pitch` | stripe | — | problem-insight-solution-ask | en | 3 | PDF + editable PPTX |
| `team-narrative` | **kinfolk-sans** | kinfolk-serif | five-beats | ko | 2 | PDF |
| `research-talk` | **arctic-sans** | arctic-serif | question-exploration-answer | en | 3 | PDF + editable PPTX |
| `launch-keynote` | wired-grid | — | five-beats (provocative) | en | 4 | PDF + PPTX |
| `executive-brief` | obsidian-mono | — | situation-complication-resolution | en | 3 | PDF + editable PPTX |
| `product-launch` | apple | — | hero-support-detail-proof-cta | en | 3 | PDF + editable PPTX |

Override any field at invocation:

```bash
# Default (Gothic)
/slide-auto "Topic" --preset team-narrative              # → kinfolk-sans

# Explicit serif override
/slide-auto "Topic" --preset team-narrative --typography editorial    # → kinfolk-serif

# Other flags combine
/slide-auto "Topic" --preset investor-pitch --lang ja --force-theme notion
```

## Project output structure

```
your-project/
├── .claude/
│   └── marp-slide-studio.local.md      # optional team defaults
└── slides/
    └── <deck-slug>/
        ├── brief.md                     # narrative brief
        ├── theme.css                    # applied theme (copied / customized)
        ├── deck.md                      # Marp markdown source
        ├── out/
        │   ├── deck.html                # preview
        │   ├── deck.pdf
        │   ├── deck.pptx
        │   └── screenshots/             # per-slide PNGs for refine loop
        ├── .qa-log.md                   # refine-loop iteration log
        └── .auto-log.md                 # autopilot decision audit trail
```

Recommended `.gitignore`:

```
slides/*/out/
slides/*/.qa-log.md
slides/*/.auto-log.md
.claude/*.local.md
```

## Typography

**Default: Gothic (sans-serif)** — `Pretendard Variable` across all default themes, all languages. Matches the Korean business/tech slide convention where serif is an editorial opt-in, not a baseline.

**Editorial serif**: opt-in via `--typography editorial` CLI flag, `default_typography: editorial` in team settings, or direct `kinfolk-serif` / `arctic-serif` theme pick.

Two authoritative references:

- [`assets/typography/cjk-scale.md`](assets/typography/cjk-scale.md) — unified Korean / Japanese / Chinese scale, per-language font stacks, line-height calibration, mixed-script handling
- [`assets/typography/latin-scale.md`](assets/typography/latin-scale.md) — English and other Latin-script calibration, ligatures, hyphenation, smart quotes

Every theme imports [`assets/theme-foundation.css`](assets/theme-foundation.css), which provides:

- Pretendard Variable + Noto Sans JP/SC/TC + Inter (CDN)
- Per-language CSS variables (`--font-body-ko`, `--font-body-ja`, etc.)
- `:lang()` cascade rules for line-height, font family, italic discipline
- Numeral feature-settings for data contexts (tabular figures)
- Latin ligature settings for English/Latin decks

## CI integration

`.github/workflows/slide-ci.yml` automatically renders changed decks on pull request:

1. Detects changed files under `slides/*/deck.md` and `slides/*/theme.css`
2. Renders each deck with marp-cli
3. Captures per-slide 1920×1080 PNG screenshots with Playwright
4. Diffs against the base branch screenshots using pixelmatch
5. Posts a markdown table on the PR with per-slide change percentages
6. Uploads HTML + PDF + PPTX + PNG as workflow artifacts

Security: all user-controllable inputs (`inputs.slug`, git-discovered directory names) are validated against `[a-zA-Z0-9._-]{1,64}` and routed through `env:` blocks to prevent workflow injection.

## Extending

### Add a new theme (hand-crafted, Tier 2)

```bash
cp assets/design-systems/minimalist-premium/obsidian-mono.{design.md,marp.css} \
   assets/design-systems/<track>/<new-theme>.{design.md,marp.css}
```

Edit the `@theme` line, redefine tokens in `:root`, ensure all 7 required layout classes (hero, monumental, split, metric, divider, quote, enumerated) still render, update the DESIGN.md philosophy section. See [`skills/marp-theme-engineer/SKILL.md`](skills/marp-theme-engineer/SKILL.md) for the checklist.

### Add a new brand to the registry (Tier 3)

Edit [`assets/design-systems/registry.json`](assets/design-systems/registry.json) and add an entry matching the schema. Then:

```
/slide-theme <your-brand>
```

The theme-forger agent reads [`assets/transform-prompt.md`](assets/transform-prompt.md), synthesizes a complete `.design.md` + `.marp.css` pair, and validates via `scripts/validate-theme.mjs`.

### Add a new layout

1. Create `assets/layouts/<layout-name>.md` with markdown template + CSS requirements
2. Add a `section.<layout-name>` rule to every theme CSS (required for all hand-crafted; optional for Korean-only layouts like `vertical-writing`, `ruby`, `banner-caption`)
3. Update [`assets/layouts/README.md`](assets/layouts/README.md) layout index
4. Update [`skills/slide-composer/SKILL.md`](skills/slide-composer/SKILL.md) layout-class mapping

### Add a new narrative pattern

Edit [`assets/narrative-patterns.md`](assets/narrative-patterns.md) with the new pattern's act structure. Available immediately to `/slide-new` and `/slide-auto`.

## Components reference

| Component | Count | Files |
|---|---|---|
| **User-invoked skills** | 6 | `slide-autopilot`, `slide-brainstorming`, `slide-theme-curator`, `slide-theme-gallery`, `slide-composer`, `slide-visual-qa`, `slide-export`, `theme-forger` |
| **Reference skills** | 2 | `marp-theme-engineer`, `cjk-typography` |
| **Agents** | 3 | `slide-director`, `marp-design-critic`, `theme-forger` |
| **Design systems** | 63 | 4 curated + 59 registry-driven |
| **Layouts** | 10 | 7 core + 3 CJK-specific (vertical-writing, ruby-annotation, banner-caption) |
| **Typography guides** | 3 | `cjk-scale.md`, `latin-scale.md`, `mixed-language.md` |
| **Anti-patterns** | 18 | Documented in [`assets/anti-patterns.md`](assets/anti-patterns.md) |
| **Narrative patterns** | 5 | Documented in [`assets/narrative-patterns.md`](assets/narrative-patterns.md) |
| **Autopilot presets** | 6 | `investor-pitch`, `team-narrative`, `research-talk`, `launch-keynote`, `executive-brief`, `product-launch` |

## Troubleshooting

### Korean / Japanese / Chinese text missing in the exported PDF

Symptom: PDF rendered on another machine (especially via Cowork, Docker, CI, or a sandboxed Claude Desktop) shows Latin text correctly but CJK characters appear missing or replaced with rectangles.

Root cause (v0.6.2 and earlier): the font stylesheet was loaded via CDN `@import` with `font-display: swap`. Headless Chrome would snapshot the PDF using a fallback font before the real CJK font finished loading. On runners whose bundled Chromium lacks CJK system fallbacks, glyphs disappeared entirely.

**Fix**: upgrade to v0.6.3+. `assets/theme-foundation.css` now declares Pretendard via a direct `@font-face` with `font-display: block` (forcing Chrome to wait up to 3 seconds for the font file) and points at a single non-subsetted woff2 URL so there are no unicode-range subset timing holes. All Google Fonts imports switched to `display=block`.

If upgrading isn't an option, or if the issue persists on a particularly locked-down environment:

1. **Bundle fonts locally** — on the affected machine:
   ```bash
   bash scripts/fetch-fonts.sh
   ```
   Downloads Pretendard, Noto Sans JP/SC/TC, JetBrains Mono into `assets/fonts/`. The v0.6.3+ `@font-face` declarations try these local files before reaching the CDN, so once bundled no internet is required for rendering.

2. **Install the primary font on the system** — Chrome's `local()` source lookup will then win over any network fetch:
   - Korean: [Pretendard](https://github.com/orioncactus/pretendard/releases)
   - Japanese: Hiragino Sans (macOS preinstalled), Noto Sans JP from [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+JP)
   - Chinese (Simplified): PingFang SC (macOS preinstalled), Noto Sans SC
   - Chinese (Traditional): PingFang TC, Noto Sans TC

3. **Point marp-cli at user's Chrome** instead of the Puppeteer-bundled Chromium — the user's Chrome usually has full OS font access:
   ```bash
   CHROME_PATH=/usr/bin/google-chrome bash scripts/export-pdf.sh YOUR_SLUG
   ```
   (Also settable in the autopilot: `/slide-auto "topic"` reads `$CHROME_PATH` from the environment.)

4. **Diagnose** — run `bash scripts/check-deps.sh` to confirm Chrome presence and suggest installs.

### PDF export "Chrome not found"

`CHROME_PATH` env var lets you point at any Chromium-family binary. On macOS this is typically `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; on Linux `/usr/bin/google-chrome` or `/usr/bin/chromium`. The `check-deps.sh` script prints the correct path for your OS.

### Refine loop silently skipped

The `/slide-refine` loop requires Playwright. If it isn't installed, the loop logs a warning and continues. Install with:
```bash
npm i -D playwright && npx playwright install chromium
```

## Limitations

- **PPTX non-editable mode renders as images.** Editable mode preserves text but sacrifices some CSS fidelity. Decide per deck.
- **Fonts require internet at render time** unless you bundle locally via `scripts/fetch-fonts.sh`.
- **Refine loop currently runs at 1920×1080 only.** Responsive / mobile decks are out of scope.
- **Generated themes are ~80–90% of hand-crafted quality.** For production-critical decks, always run `/slide-refine` after composing, and consider promoting heavily-used generated themes to Tier 2 by hand-editing.
- **Brand attribution is aesthetic-only.** Registry metadata synthesizes publicly visible brand aesthetics. Themes carry "Inspired by <brand>. Not affiliated." disclaimers. For production decks representing a brand, consult that brand's official guidelines.

## License

MIT. See [LICENSE](LICENSE).

Design-system references acknowledge:
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT) — inspiration for the registry format
- [getdesign.md](https://getdesign.md) — inspiration for the brand catalog

Fonts bundled via CDN are licensed under SIL Open Font License 1.1:
- [Pretendard](https://github.com/orioncactus/pretendard)
- [Noto Sans JP / SC / TC / KR](https://fonts.google.com/noto)
- [Inter](https://rsms.me/inter/)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

## Credits

Built on [Marp](https://marp.app) — the markdown presentation ecosystem by the Marp team. This plugin adds a Claude Code workflow layer on top of marp-cli, marp-core, and Marpit.

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) (if present) or open an issue.
