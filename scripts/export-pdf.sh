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
