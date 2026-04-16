#!/usr/bin/env bash
# Marp Slide Studio — dependency check
# Verifies Node.js, npx, Chrome, Playwright, and marp-cli cache status.
# Exits 0 if all required dependencies are present, 1 otherwise.

set -u  # treat unset vars as errors (don't set -e — we want to collect all findings)

# ── Colors (fallback to plain if no TTY) ────────────────────────
if [[ -t 1 ]]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
  GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; BLUE=$'\033[34m'; GRAY=$'\033[90m'
else
  BOLD=''; DIM=''; RESET=''; GREEN=''; YELLOW=''; RED=''; BLUE=''; GRAY=''
fi

ok()    { printf "  ${GREEN}✓${RESET} %-24s ${DIM}%s${RESET}\n" "$1" "${2:-}"; }
warn()  { printf "  ${YELLOW}⚠${RESET} %-24s ${DIM}%s${RESET}\n" "$1" "${2:-}"; }
fail()  { printf "  ${RED}✗${RESET} %-24s ${DIM}%s${RESET}\n" "$1" "${2:-}"; }
info()  { printf "  ${GRAY}○${RESET} %-24s ${DIM}%s${RESET}\n" "$1" "${2:-}"; }
hint()  { printf "    ${BLUE}%s${RESET}\n" "$1"; }

REQUIRED_FAILED=0
OPTIONAL_MISSING=0

printf "\n${BOLD}▸ marp-slide-studio dependency check${RESET}\n"
printf "${DIM}────────────────────────────────────────${RESET}\n\n"

# ── Required ────────────────────────────────────────────────────
printf "${BOLD}Required${RESET}\n"

# 1. Node.js ≥ 18
if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node --version 2>/dev/null)
  NODE_MAJOR=$(echo "$NODE_VER" | sed -E 's/^v([0-9]+).*/\1/')
  if [[ "$NODE_MAJOR" -ge 18 ]]; then
    ok "Node.js ≥ 18" "$NODE_VER"
  else
    fail "Node.js ≥ 18" "found $NODE_VER — upgrade required"
    hint "install from https://nodejs.org or use a version manager (nvm, fnm, volta)"
    REQUIRED_FAILED=$((REQUIRED_FAILED+1))
  fi
else
  fail "Node.js ≥ 18" "not found in PATH"
  hint "install from https://nodejs.org or use nvm/fnm/volta"
  REQUIRED_FAILED=$((REQUIRED_FAILED+1))
fi

# 2. npx
if command -v npx >/dev/null 2>&1; then
  ok "npx" "$(command -v npx)"
else
  fail "npx" "not found (ships with Node.js ≥ 5.2)"
  hint "install Node.js — npx comes with it"
  REQUIRED_FAILED=$((REQUIRED_FAILED+1))
fi

# 3. Chrome / Chromium
CHROME_PATH=""
case "$(uname -s)" in
  Darwin)
    for p in \
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
      "/Applications/Chromium.app/Contents/MacOS/Chromium"; do
      [[ -x "$p" ]] && CHROME_PATH="$p" && break
    done
    ;;
  Linux)
    for bin in google-chrome google-chrome-stable chromium chromium-browser; do
      if command -v "$bin" >/dev/null 2>&1; then
        CHROME_PATH=$(command -v "$bin"); break
      fi
    done
    ;;
  MINGW*|CYGWIN*|MSYS*)
    for p in \
      "/c/Program Files/Google/Chrome/Application/chrome.exe" \
      "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"; do
      [[ -x "$p" ]] && CHROME_PATH="$p" && break
    done
    ;;
esac
# Also respect CHROME_PATH env override
if [[ -n "${CHROME_PATH:-}" && -z "${CHROME_PATH_ENV:-}" ]]; then
  ok "Chrome / Chromium" "$CHROME_PATH"
elif [[ -n "${CHROME_PATH:-}" ]]; then
  # env override present
  ok "Chrome / Chromium" "$CHROME_PATH_ENV (CHROME_PATH)"
else
  fail "Chrome / Chromium" "not found — PDF/PPTX export will fail"
  hint "macOS:   download from https://www.google.com/chrome/"
  hint "Linux:   sudo apt install google-chrome-stable  # or chromium-browser"
  hint "or set the CHROME_PATH env var to the binary location"
  REQUIRED_FAILED=$((REQUIRED_FAILED+1))
fi

# 4. marp-cli cache status (best-effort)
# Look for any cached _npx entry containing marp-cli. Don't fail on absence —
# it just means first run will download (~30-60s).
NPX_CACHE="${HOME}/.npm/_npx"
MARP_CACHED=0
if [[ -d "$NPX_CACHE" ]]; then
  if find "$NPX_CACHE" -type d -name "marp-cli" 2>/dev/null | grep -q .; then
    MARP_CACHED=1
  fi
fi
if [[ "$MARP_CACHED" -eq 1 ]]; then
  ok "marp-cli" "cached via npx — instant first run"
else
  info "marp-cli" "not cached — first run fetches (~30–60s, one-time)"
fi

# ── Optional ────────────────────────────────────────────────────
printf "\n${BOLD}Optional${RESET}\n"

# Playwright — check current working dir's node_modules first, then plugin's
PLAYWRIGHT_FOUND=0
PLAYWRIGHT_LOC=""
for dir in "$(pwd)/node_modules/playwright" "$(pwd)/node_modules/@playwright/test"; do
  if [[ -d "$dir" ]]; then
    PLAYWRIGHT_FOUND=1
    PLAYWRIGHT_LOC="$(pwd)/node_modules/"
    break
  fi
done
if [[ "$PLAYWRIGHT_FOUND" -eq 1 ]]; then
  # Check if chromium browser binary is installed too
  CHROMIUM_CACHE="${HOME}/Library/Caches/ms-playwright"
  [[ "$(uname -s)" == "Linux" ]] && CHROMIUM_CACHE="${HOME}/.cache/ms-playwright"
  if [[ -d "$CHROMIUM_CACHE" ]] && find "$CHROMIUM_CACHE" -type d -name "chromium-*" 2>/dev/null | grep -q .; then
    ok "Playwright" "installed + chromium browser cached"
  else
    warn "Playwright" "installed but chromium browser may be missing"
    hint "run: npx playwright install chromium"
    OPTIONAL_MISSING=$((OPTIONAL_MISSING+1))
  fi
else
  warn "Playwright" "not installed — /slide-refine visual QA will be skipped"
  hint "enable with: npm i -D playwright && npx playwright install chromium"
  OPTIONAL_MISSING=$((OPTIONAL_MISSING+1))
fi

# ── Fonts ───────────────────────────────────────────────────────
printf "\n${BOLD}Fonts${RESET}\n"

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FONTS_DIR="$PLUGIN_ROOT/assets/fonts"
OFFLINE_CSS="$FONTS_DIR/offline.css"
if [[ -f "$OFFLINE_CSS" ]] && [[ -f "$FONTS_DIR/pretendard/PretendardVariable.woff2" ]]; then
  ok "Offline font bundle" "present ($(du -sh "$FONTS_DIR" 2>/dev/null | cut -f1))"
else
  info "Offline font bundle" "not downloaded — fonts load from CDN at render time"
  hint "for offline/air-gapped use: bash ${PLUGIN_ROOT}/scripts/fetch-fonts.sh"
fi

# ── Summary ─────────────────────────────────────────────────────
printf "\n${DIM}────────────────────────────────────────${RESET}\n"
if [[ "$REQUIRED_FAILED" -eq 0 ]]; then
  if [[ "$OPTIONAL_MISSING" -eq 0 ]]; then
    printf "${BOLD}${GREEN}Status: READY${RESET} ${DIM}— all dependencies present${RESET}\n\n"
  else
    printf "${BOLD}${GREEN}Status: READY${RESET} ${DIM}— %d optional dependency missing (plugin still works, some features degraded)${RESET}\n\n" "$OPTIONAL_MISSING"
  fi
  exit 0
else
  printf "${BOLD}${RED}Status: BLOCKED${RESET} ${DIM}— %d required dependency missing${RESET}\n\n" "$REQUIRED_FAILED"
  exit 1
fi
