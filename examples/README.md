# Examples

## `marp-slide-studio.local.md`

Template team settings file. Copy to your project's `.claude/` directory and edit.

## `sample-deck/` — Obsidian Mono demo

A minimalist-premium 10-slide deck about Korean slide typography. Uses the **Obsidian Mono** theme (track: `minimalist-premium`). Narrative pattern: Question–Exploration–Answer.

Reproduce locally:

```bash
mkdir -p slides/hangul-typography
cp examples/sample-deck/brief.md slides/hangul-typography/
cp examples/sample-deck/deck.md slides/hangul-typography/
cp assets/design-systems/minimalist-premium/obsidian-mono.marp.css slides/hangul-typography/theme.css
bash scripts/render.sh hangul-typography
open slides/hangul-typography/out/deck.html
```

## `sample-deck-2/` — Wired Grid demo

A 12-slide editorial trend report — "AI 시대, 프레젠테이션은 어떻게 달라지는가". Uses the **Wired Grid** theme (track: `editorial`). Narrative pattern: Five Beats.

Demonstrates high-contrast monochrome + orange accent, JetBrains Mono overlines, full-bleed hero, and density-varied rhythm. A direct counterpoint to `sample-deck/` — same plugin, opposite mood.

Reproduce locally:

```bash
mkdir -p slides/ai-presentation-trends
cp examples/sample-deck-2/brief.md slides/ai-presentation-trends/
cp examples/sample-deck-2/deck.md slides/ai-presentation-trends/
cp assets/design-systems/editorial/wired-grid.marp.css slides/ai-presentation-trends/theme.css
bash scripts/render.sh ai-presentation-trends
open slides/ai-presentation-trends/out/deck.html
```

## Reading order

If you're evaluating the plugin:

1. Read `sample-deck/brief.md` and `sample-deck-2/brief.md` side by side — see how different narrative patterns + tones shape the beat structure.
2. Read the corresponding `deck.md` files — see how the composer translates beats into layout directives.
3. Render both locally. Open `out/deck.html` in a browser and flip through. The same plugin produces two genuinely different visual languages.
