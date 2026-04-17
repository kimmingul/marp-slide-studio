#!/usr/bin/env bash
# Export Marp deck to PDF with notes and outline support.
# Usage: export-pdf.sh <slug>

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: export-pdf.sh <slug>" >&2
  exit 2
fi

SLUG="$1"
DECK_DIR="./slides/${SLUG}"
DECK_MD="${DECK_DIR}/deck.md"
THEME_CSS="${DECK_DIR}/theme.css"
OUT_DIR="${DECK_DIR}/out"
OUT_PDF="${OUT_DIR}/deck.pdf"

if [[ ! -f "$DECK_MD" ]]; then
  echo "✗ ${DECK_MD} not found" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

# ── Auto-install fonts if missing ────────────────────────────────
HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_FONTS="$HERE/install-fonts.sh"
if [[ -x "$INSTALL_FONTS" ]]; then
  needs_install=false
  if [[ "$(uname)" == "Darwin" ]]; then
    ls "$HOME/Library/Fonts/"*Pretendard* 2>/dev/null | head -1 | grep -q . 2>/dev/null || needs_install=true
  elif command -v fc-list >/dev/null 2>&1; then
    fc-list 2>/dev/null | grep -qi "Pretendard" || needs_install=true
  else
    needs_install=true
  fi
  if [[ "$needs_install" == "true" ]]; then
    echo "▸ Fonts not found — installing automatically..."
    bash "$INSTALL_FONTS"
  fi
fi

MARP_BIN="${MARP_BIN:-npx --yes @marp-team/marp-cli@latest}"

THEME_ARGS=()
if [[ -f "$THEME_CSS" ]]; then
  THEME_ARGS=(--theme-set "$THEME_CSS")
fi

$MARP_BIN \
  "${THEME_ARGS[@]}" \
  --pdf \
  --pdf-notes \
  --pdf-outlines \
  --allow-local-files \
  -o "$OUT_PDF" \
  "$DECK_MD"

echo "✓ PDF → $OUT_PDF"
