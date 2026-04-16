# Examples

## `marp-slide-studio.local.md`

Template team settings file. Copy to your project's `.claude/` directory.

## `sample-deck/`

A fully-worked example showing `brief.md` + `deck.md` for a 10-slide deck about Korean slide typography. Uses the **Obsidian Mono** theme.

Reproduce locally:

```bash
# From your own project directory
mkdir -p slides/hangul-typography/
cp /path/to/marp-slide-studio/examples/sample-deck/brief.md slides/hangul-typography/
cp /path/to/marp-slide-studio/examples/sample-deck/deck.md slides/hangul-typography/
cp /path/to/marp-slide-studio/assets/design-systems/minimalist-premium/obsidian-mono.marp.css \
   slides/hangul-typography/theme.css

# Render
bash /path/to/marp-slide-studio/scripts/render.sh hangul-typography

# Open the preview
open slides/hangul-typography/out/deck.html
```

The sample `deck.md` references three placeholder SVGs (`placeholder-1.svg` through `placeholder-3.svg`) for demonstration — supply real images before final export.
