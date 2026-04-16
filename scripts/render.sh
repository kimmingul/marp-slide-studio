#!/usr/bin/env bash
# Render a Marp deck to HTML preview.
# Usage: render.sh <slug> [--watch]
# Looks for ./slides/<slug>/deck.md, outputs ./slides/<slug>/out/deck.html
#
# Env:
#   MARP_BIN  override the marp binary (default: npx @marp-team/marp-cli@latest)
#   CWD       working directory (default: current)

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: render.sh <slug> [--watch]" >&2
  exit 2
fi

SLUG="$1"
shift || true
WATCH=""
if [[ "${1:-}" == "--watch" ]]; then
  WATCH="--watch --server"
fi

DECK_DIR="./slides/${SLUG}"
DECK_MD="${DECK_DIR}/deck.md"
THEME_CSS="${DECK_DIR}/theme.css"
OUT_DIR="${DECK_DIR}/out"
OUT_HTML="${OUT_DIR}/deck.html"

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

# shellcheck disable=SC2086
$MARP_BIN \
  "${THEME_ARGS[@]}" \
  --html \
  --allow-local-files \
  -o "$OUT_HTML" \
  $WATCH \
  "$DECK_MD"

echo "✓ rendered → $OUT_HTML"
