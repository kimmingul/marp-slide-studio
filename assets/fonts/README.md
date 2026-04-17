# Font Management

Fonts are installed on-demand to the system when rendering slides.
No font files are bundled with the plugin — keeping the plugin lightweight.

## How it works

1. `render.sh` / `export-pdf.sh` automatically check for required fonts
2. If missing, `scripts/install-fonts.sh` runs and installs them
3. CSS uses `local()` to find system-installed fonts + Google Fonts CDN as online fallback

## Manual install

```bash
bash scripts/install-fonts.sh
```

### What gets installed

| Font | Purpose | Source |
|------|---------|--------|
| Pretendard (9 weights) | Korean sans-serif | GitHub raw |
| Inter Variable | Latin sans-serif | GitHub release |
| Noto CJK Sans + Serif | JP/SC/TC/KR | apt (Linux) or GitHub |
| JetBrains Mono | Code / monospace | GitHub release |

All fonts use SIL OFL 1.1 license — redistribution permitted.

### Install locations

- **macOS**: `~/Library/Fonts/`
- **Linux**: `~/.local/share/fonts/` (+ `fc-cache`)
- **Linux (apt)**: Noto CJK via `fonts-noto-cjk` + `fonts-noto-cjk-extra`

## Sandboxed environments (Cowork)

In Cowork, Google Fonts CDN is blocked. The install script handles this by:
- Using `apt install` for Noto CJK (uses system package mirrors, not CDN)
- Downloading other fonts from GitHub (not blocked)
- CSS `local()` finds the installed fonts without needing CDN
