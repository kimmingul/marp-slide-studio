#!/usr/bin/env bash
# Render every deck under slides/ (useful for local smoke test before pushing).
# Usage: render-all.sh [--pdf]

set -euo pipefail

HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"

WITH_PDF=""
if [[ "${1:-}" == "--pdf" ]]; then
  WITH_PDF="yes"
fi

if [[ ! -d slides ]]; then
  echo "No ./slides directory. Run from a project root." >&2
  exit 1
fi

FAIL=0
for deck in slides/*/deck.md; do
  slug=$(basename "$(dirname "$deck")")
  echo "▸ $slug"
  if ! bash "$ROOT/scripts/render.sh" "$slug"; then
    echo "  ✗ render failed"
    FAIL=$((FAIL+1))
    continue
  fi
  if [[ -n "$WITH_PDF" ]]; then
    if ! bash "$ROOT/scripts/export-pdf.sh" "$slug"; then
      echo "  ✗ pdf failed"
      FAIL=$((FAIL+1))
    fi
  fi
done

if [[ "$FAIL" -gt 0 ]]; then
  echo ""
  echo "✗ $FAIL deck(s) failed"
  exit 1
fi

echo ""
echo "✓ all decks rendered"
