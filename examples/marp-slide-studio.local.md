---
# Example team settings file
# Place this at your project root as: .claude/marp-slide-studio.local.md
# Values here pre-fill /slide-new and /slide-theme prompts.

team_brand_primary: "#0A0A0A"
team_brand_accent: "#FF5B13"

# Default track: minimalist-premium | editorial | auto
default_track: "minimalist-premium"

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
- `author_default` — team/author label
- `logo_path` — path to a monochrome SVG logo (for theme variants that use it)

## How it's read

The plugin reads this file at the start of:
- `/slide-new` — prefills author, allows "use team brand" option in brief
- `/slide-theme` — offers to replace accent with `team_brand_accent` automatically
