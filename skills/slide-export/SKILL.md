---
name: slide-export
description: Use when the user says "/slide-export", "PDF 내보내기", "PPTX 만들어줘", or needs final deliverables from a Marp deck. Runs marp CLI via npx to produce deck.pdf and/or deck.pptx inside each deck's slides output directory.
argument-hint: "[slug] [pdf|pptx|both] [--editable]"
allowed-tools: Read, Glob, Bash(bash:*, npx:*)
---

# Slide Export

Ship the final artifacts. This skill is thin; the heavy lifting is in the shell scripts.

## When invoked

The user wants PDF, PPTX, or both. `deck.md` + `theme.css` must exist.

## Procedure

### Step 1 — Resolve args

- `$1`: slug (auto-detect if single in `slides/`)
- `$2`: format — `pdf` | `pptx` | `both` (default `both`)
- `--editable` flag: if present and format includes pptx, use PowerPoint-editable mode

### Step 2 — Preflight

Verify:
```bash
test -f ./slides/<slug>/deck.md && test -f ./slides/<slug>/theme.css
```

Abort with guidance if missing.

If no recent render exists, run render once:
```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/render.sh <slug>
```

### Step 3 — Export PDF

If format is `pdf` or `both`:
```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/export-pdf.sh <slug>
```

Produces `./slides/<slug>/out/deck.pdf` with notes and outlines.

### Step 4 — Export PPTX

If format is `pptx` or `both`:
```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/export-pptx.sh <slug> [--editable]
```

Produces `./slides/<slug>/out/deck.pptx`.

**About `--editable`**: by default Marp PPTX export is image-based (slides rendered as images in the .pptx). `--editable` produces text-editable slides but has visual fidelity trade-offs (some CSS effects may not translate). Use editable mode when the team needs to refine content in PowerPoint; use default mode for final distribution.

### Step 5 — Verify output

```bash
ls -lh ./slides/<slug>/out/deck.{pdf,pptx} 2>/dev/null
```

Report file sizes. If PDF < 100KB, likely a render error — warn user.

### Step 6 — Hand off

```
✓ PDF  → ./slides/<slug>/out/deck.pdf (N.M MB)
✓ PPTX → ./slides/<slug>/out/deck.pptx (N.M MB, <editable|image-mode>)

열기:
  open ./slides/<slug>/out/deck.pdf
  open ./slides/<slug>/out/deck.pptx
```

## Common errors

- **Chrome/Chromium not found**: Marp uses the system Chrome for PDF rendering. If missing, the script fails. Tell user to install Chrome or set `CHROME_PATH`.
- **Font not loaded in PDF**: Pretendard/Noto Serif KR come via CDN. If user is offline, fonts won't load. Suggest packaging fonts locally (outside this skill's scope).
- **PPTX image-mode blurry**: increase `--image-scale 2` in the script if needed. Note: only affects image-mode export.

## Gotchas

- **PPTX has two modes**:
  - Default (image-based): slides rendered as images → perfect CSS fidelity but NOT editable in PowerPoint
  - `--editable`: text-editable in PowerPoint but loses some CSS effects (complex gradients, pseudo-elements)
  - Pick per audience: internal team that will tweak → editable. External final distribution → image mode.
- **PDF export requires Chrome separately from Playwright's Chromium**: `marp-cli` uses Puppeteer-bundled Chrome OR the system Chrome (via `CHROME_PATH`). Playwright's Chromium is a different binary and won't be used.
- **`CHROME_PATH` env var** lets you point at a custom Chrome install. Common need on Linux servers: `CHROME_PATH=/usr/bin/google-chrome`.
- **Fonts require internet at render time** (or the offline bundle via `scripts/fetch-fonts.sh`). If exporting on an air-gapped machine without bundle, Pretendard falls back to system fonts — Korean may disappear (see README Troubleshooting).
- **Size sanity check**: a v0.7.0+ 10-slide PDF is typically 800 KB – 2 MB. < 100 KB indicates a render error (blank slides, failed font load, etc.). Warn the user.
- **Do NOT run export while `render.sh --watch` is active**: port conflict on the Marp dev server. Stop the watcher first.

## What NOT to do

- Do NOT run export while a `--watch` render is active (port conflict).
- Do NOT edit deck.md inside this skill — it's export-only.
- Do NOT attempt to "enhance" the PDF with bookmarks/metadata post-export — marp-cli already handles outlines.
