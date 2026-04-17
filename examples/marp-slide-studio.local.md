---
# Example team settings file
# Place this at your project root as: .claude/marp-slide-studio.local.md
# Values here pre-fill /slide-new, /slide-theme, and /slide-auto prompts.

team_brand_primary: "#0A0A0A"
team_brand_accent: "#FF5B13"

# Default track: minimalist-premium | editorial | auto
default_track: "minimalist-premium"

# Default typography: gothic | editorial
# Gothic (sans-serif) is the plugin default since v0.7.0. Set to `editorial`
# if your team consistently wants serif headlines (Noto Serif KR / Noto Serif JP).
# When editorial, presets that define a serif variant swap automatically:
#   team-narrative : kinfolk-sans → kinfolk-serif
#   research-talk  : arctic-sans  → arctic-serif
default_typography: "gothic"

# Default deck language (v0.6.0+). Accepted: ko | en | ja | zh-Hans | zh-Hant | es | fr | de | pt | it
default_language: "ko"

# Author shown in footer (if enabled per theme)
author_default: "Team Name"

# Optional: logo image path (relative to project root)
logo_path: "./brand/logo.svg"

# Optional: force all decks to use a specific theme (overrides track)
# force_theme: "obsidian-mono"

# Optional: override the size floor for body text (px)
# body_size_floor: 24
---

# marp-slide-studio — Team Settings

This file holds team-wide defaults for the marp-slide-studio plugin.
It is **not committed** (see .gitignore); each team member can override
locally without affecting others.

## Fields

- `team_brand_primary` — your brand's primary dark color (hex)
- `team_brand_accent` — your brand's signature accent (hex)
- `default_track` — which design-system track to prefer
- `default_typography` — `gothic` (default, sans-serif) or `editorial` (serif headlines)
- `default_language` — deck language code (affects `:lang()` typography cascade)
- `author_default` — team/author label
- `logo_path` — path to a monochrome SVG logo (for theme variants that use it)

## How it's read

The plugin reads this file at the start of:
- `/slide-new` — prefills author, allows "use team brand" option in brief
- `/slide-theme` — offers to replace accent with `team_brand_accent` automatically
- `/slide-auto` — applies `default_typography` and `default_language` unless overridden by CLI flags

## Overriding per-deck

Any setting here can be overridden per invocation:

```bash
/slide-auto "주제"                              # uses team defaults
/slide-auto "주제" --typography editorial       # one-off serif deck
/slide-auto "주제" --lang ja                    # one-off Japanese deck
```
