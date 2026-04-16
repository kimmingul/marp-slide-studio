# Publishing `marp-slide-studio`

This repository is structured to act as either (a) a standalone plugin installed via `--plugin-dir`, or (b) a single-plugin marketplace that Claude Code users can add with `/plugin marketplace add <repo-url>`.

## Option A — Standalone install

```bash
# Clone anywhere
git clone https://github.com/your-org/marp-slide-studio.git

# Point Claude Code at it from a slide project
claude --plugin-dir /absolute/path/to/marp-slide-studio
```

## Option B — Single-plugin marketplace

`.claude-plugin/marketplace.json` at the repo root makes this repo discoverable as a marketplace. Users add it once:

```bash
# In Claude Code
/plugin marketplace add https://github.com/your-org/marp-slide-studio
/plugin install marp-slide-studio
```

The `source: "./"` entry in `marketplace.json` tells the installer the plugin lives at the marketplace root.

## Option C — Shared team marketplace

If your team already maintains a marketplace repo (e.g. `our-team/claude-plugins`), add this plugin as an entry:

```json
{
  "name": "our-team-marketplace",
  "plugins": [
    {
      "name": "marp-slide-studio",
      "source": "github:your-org/marp-slide-studio",
      "description": "...",
      "version": "0.2.0"
    }
  ]
}
```

`source` can be a git URL (`github:org/repo`), a path inside the marketplace repo (`./plugins/marp-slide-studio`), or a tarball URL.

## Release checklist

Before tagging a release:

1. Bump `version` in `.claude-plugin/plugin.json` AND `.claude-plugin/marketplace.json` (keep them in sync).
2. Update the top of README.md with a one-line "what's new in vX.Y".
3. Run the smoke test:
   ```bash
   cd examples/sample-deck-2 && bash ../../scripts/render.sh <slug>
   ```
4. Tag: `git tag v0.2.0 && git push --tags`
5. Announce in team channel with a 3-line summary + link to the updated sample deck.

## Semantic versioning policy

- **MAJOR** — incompatible changes to project output structure (e.g., `slides/<slug>/` path changes), breaking removals of skills/agents/layouts.
- **MINOR** — new themes, new layouts, new skills. Additive only.
- **PATCH** — CSS token tweaks, doc fixes, script hardening.

Breaking theme changes (renaming CSS classes used by existing layouts) are MAJOR. Adding new classes is MINOR.

## Rollback

If a release causes issues in team decks:

```bash
# Users pin to the previous version
/plugin install marp-slide-studio@0.1.0
```

Keep the previous version's git tag alive. Do NOT delete release tags.
