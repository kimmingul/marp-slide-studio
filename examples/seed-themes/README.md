# Seed Themes

Five reference theme pairs shipped with the plugin as **seed data** — fully-worked examples of what the Theme-Foundry pipeline produces for well-known brands. They're read-only from the plugin's perspective and serve two purposes:

1. **Showcasing the pipeline** — each pair (`<brand>.design.md` + `<brand>.marp.css`) demonstrates the transform rules from `assets/transform-prompt.md` applied to a real brand
2. **Fallback for on-demand requests** — if a user requests one of these 5 brands and nothing is in the user cache, the curator falls back to the seed

| Slug | Brand | Track | Palette highlights |
|---|---|---|---|
| stripe | Stripe | minimalist-premium | purple `#635BFF` + deep navy + white, tabular-everything |
| linear-app | Linear | minimalist-premium | near-black `#08090A` + ghost-purple `#5E6AD2`, dark-native |
| apple | Apple | minimalist-premium | pure monochrome, accent collapses to fg |
| notion | Notion | editorial | warm cream `#F7F6F3` + off-serif-editorial + warm orange |
| tesla | Tesla | minimalist-premium | charcoal `#171A20` + restrained brake-light red |

## When these are used

The `slide-theme-curator` skill looks for a theme in this order:

1. `assets/design-systems/{minimalist-premium,editorial}/` — hand-crafted Tier 2 themes (ship with plugin)
2. `${CLAUDE_PLUGIN_DATA:-~/.marp-slide-studio}/themes/` — user's forged cache (persists across plugin upgrades)
3. **`examples/seed-themes/`** — these five seeds, for brands not yet forged by the user

If a user requests e.g. `stripe` and has never forged it, step 3 serves them this seed. If they later run `/slide-theme stripe --force`, a fresh version is forged into step 2's location which takes precedence from then on.

## Why NOT in `assets/design-systems/generated/`

Prior to v0.8.0 these lived in `generated/` inside the plugin tree. That location gets overwritten on plugin upgrade. Moving to `examples/seed-themes/` clarifies they're sample data, not the primary cache. See `../../assets/design-systems/generated/README.md` for the full explanation.

## Regenerating seeds

These were generated via the Theme-Foundry pipeline in April 2026. To refresh them (e.g., after refining the transform prompt or theme-foundation.css):

```bash
# Force regenerate all 5, writing to user cache, then copy to seed
for brand in stripe linear.app apple notion tesla; do
  /slide-theme "$brand" --force
done
# then manually cp ${DATA_DIR}/themes/*.{design.md,marp.css} examples/seed-themes/
```

In practice this is done once per major release when the transform prompt changes meaningfully. Current seeds are based on v0.6.0 transform rules; they still validate cleanly and render correctly.
