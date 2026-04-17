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

# ── Auto-install fonts if missing ────────────────────────────────
HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_FONTS="$HERE/install-fonts.sh"
if [[ -x "$INSTALL_FONTS" ]]; then
  needs_install=false
  if [[ "$(uname)" == "Darwin" ]]; then
    # macOS: check ~/Library/Fonts directly (more reliable than fc-list)
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

# shellcheck disable=SC2086
$MARP_BIN \
  "${THEME_ARGS[@]}" \
  --html \
  --allow-local-files \
  -o "$OUT_HTML" \
  $WATCH \
  "$DECK_MD"

# ── Patch HTML for sandboxed environments (Cowork etc.) ──────────
# Marp's bespoke.js uses history.replaceState and WakeLock API which
# are blocked in iframe sandboxes (about:srcdoc origin).
if [[ -f "$OUT_HTML" && -z "$WATCH" ]]; then
  SANDBOX_PATCH='<script>/* sandbox-compat */try{var _r=history.replaceState,_p=history.pushState;history.replaceState=function(){try{return _r.apply(this,arguments)}catch(e){}};history.pushState=function(){try{return _p.apply(this,arguments)}catch(e){}};if(navigator.wakeLock){var _w=navigator.wakeLock.request;navigator.wakeLock.request=async function(){try{return await _w.apply(this,arguments)}catch(e){}}}}catch(e){}</script>'
  if ! grep -q "sandbox-compat" "$OUT_HTML" 2>/dev/null; then
    sed -i.bak "s|</head>|${SANDBOX_PATCH}</head>|" "$OUT_HTML"
    rm -f "${OUT_HTML}.bak"
  fi
fi

echo "✓ rendered → $OUT_HTML"
