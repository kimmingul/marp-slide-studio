# Generated themes — moved (v0.8.0+)

Starting with v0.8.0, user-generated themes are cached in a stable, upgrade-safe location outside the plugin directory:

```
${CLAUDE_PLUGIN_DATA:-~/.marp-slide-studio}/themes/<slug>.{design.md,marp.css}
```

This directory used to hold the first 5 generated sample themes (`apple`, `linear-app`, `notion`, `stripe`, `tesla`). Those five have moved to **[`examples/seed-themes/`](../../../examples/seed-themes/)** where they serve as seed data (read-only reference examples shipped with the plugin).

## Lookup order

When `slide-theme-curator` or `build-gallery.mjs` looks for a theme's CSS, they check in this order:

1. **Curated (Tier 2)** — `assets/design-systems/{minimalist-premium,editorial}/<slug>.marp.css`
2. **User cache (Tier 3 — forged)** — `${DATA_DIR}/themes/<slug>.marp.css` *(survives plugin upgrades)*
3. **Seed examples** — `examples/seed-themes/<slug>.marp.css` *(static, shipped with plugin)*

## Why this moved

Thariq's guidance ("Lessons from Building Claude Code: How We Use Skills"):

> Data stored in the skill directory may be deleted when you upgrade the skill. Use `${CLAUDE_PLUGIN_DATA}` as a stable folder per plugin.

Previously, forging a new theme wrote into this `generated/` directory. A plugin upgrade would overwrite or delete those user-generated files. The new location persists across upgrades.

## For future forges

When you run `/slide-theme <brand>` and the brand requires forging:

```
${DATA_DIR:-~/.marp-slide-studio}/themes/<brand>.{design.md,marp.css}
```

The `--force` flag regenerates even if cached. The curator looks in all three locations above.
