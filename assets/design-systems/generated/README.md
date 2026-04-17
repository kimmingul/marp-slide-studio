# Generated Themes (Tier 3 Cache)

This directory holds themes produced by the **Theme-Foundry pipeline** — not hand-crafted, but machine-generated from the 59-brand registry via the `theme-forger` skill and agent.

## What lives here

Pairs of `<slug>.design.md` + `<slug>.marp.css` for any brand from `../registry.json` that has been generated at least once. Each pair is:

- **Structurally valid** — passes `scripts/validate-theme.mjs`
- **CJK-first** — Pretendard / Noto Sans JP/SC/TC loaded via theme-foundation, line-height ≥ 1.7 on CJK, no italic/uppercase traps
- **Attributed** — every file includes the "Inspired by <brand>, not affiliated" disclaimer
- **Regenerable** — delete them and the next `/slide-theme <brand>` will forge them fresh

## Not committed to team repos by default

Your team can decide per project whether to commit the generated cache:

**Commit** (team-wide consistency): team members get the same generated output without running the forger themselves. Good for production decks.

**Gitignore** (always fresh from registry): lighter repos, but each member runs the forger once per brand. Good for exploratory use.

See `.gitignore` at plugin root — currently these are tracked so the default examples work out of the box.

## Relation to hand-crafted themes

Tier 2 (hand-crafted) themes live in sibling directories: `minimalist-premium/` and `editorial/`. They represent "what this plugin can achieve at its best" — a quality ceiling for machine generation.

Tier 3 (generated) themes here are calibrated to be 80–90% as good, at zero hand-crafting cost. If the team ends up using a generated theme heavily, consider **promoting** it to Tier 2 by hand-editing and moving it to the appropriate track directory.

## Adding new brands

Edit `../registry.json` to add a new entry following the schema. Then run:
```
node scripts/forge-theme.mjs brief <new-brand>
```
And invoke the `theme-forger` skill with that brand.
