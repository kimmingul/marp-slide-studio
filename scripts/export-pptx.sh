#!/usr/bin/env bash
# Export Marp deck to PPTX. Uses editable mode so layouts remain editable in PowerPoint/Keynote.
# Usage: export-pptx.sh <slug> [--editable]

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: export-pptx.sh <slug> [--editable]" >&2
  exit 2
fi

SLUG="$1"
shift || true

EDITABLE=""
if [[ "${1:-}" == "--editable" ]]; then
  EDITABLE="--pptx-editable"
fi

DECK_DIR="./slides/${SLUG}"
DECK_MD="${DECK_DIR}/deck.md"
THEME_CSS="${DECK_DIR}/theme.css"
OUT_DIR="${DECK_DIR}/out"
OUT_PPTX="${OUT_DIR}/deck.pptx"

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
  --pptx \
  $EDITABLE \
  --allow-local-files \
  -o "$OUT_PPTX" \
  "$DECK_MD"

echo "✓ PPTX → $OUT_PPTX"
[[ -n "$EDITABLE" ]] && echo "  (editable mode — open in PowerPoint/Keynote to refine)"
