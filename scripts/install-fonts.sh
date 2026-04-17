#!/usr/bin/env bash
# Install fonts needed for Marp Slide Studio rendering.
#
# Run automatically before rendering (via render.sh / export-pdf.sh)
# or manually: bash scripts/install-fonts.sh
#
# Idempotent — skips already-installed fonts.
# Supports macOS and Linux (Debian/Ubuntu including Cowork sandbox).
#
# Fonts installed (all SIL OFL 1.1):
#   Pretendard    — Korean primary sans
#   Inter         — Latin primary sans
#   Noto CJK      — Japanese / Chinese sans + serif
#   JetBrains Mono — Code / monospace

set -uo pipefail
# Note: no `set -e` — font download failures should not crash the render pipeline.

OS="$(uname -s)"

# ── Platform-specific font directory ─────────────────────────────
case "$OS" in
  Darwin) FONT_DIR="$HOME/Library/Fonts" ;;
  Linux)  FONT_DIR="$HOME/.local/share/fonts" ;;
  *)      echo "⚠ Unsupported OS: $OS" >&2; exit 0 ;;
esac
mkdir -p "$FONT_DIR"

# ── Helpers ──────────────────────────────────────────────────────
font_installed() {
  local name="$1"
  case "$OS" in
    Darwin)
      # Check user + system font dirs
      ls "$HOME/Library/Fonts/"*"$name"* /Library/Fonts/*"$name"* \
         /System/Library/Fonts/*"$name"* 2>/dev/null | head -1 | grep -q . 2>/dev/null
      ;;
    Linux)
      fc-list 2>/dev/null | grep -qi "$name"
      ;;
  esac
}

download() {
  local url="$1" dest="$2"
  if [[ -f "$dest" ]]; then return 0; fi
  if command -v curl >/dev/null 2>&1; then
    curl -sSL --retry 2 --connect-timeout 15 -o "$dest" "$url" || {
      echo "  ⚠ Download failed: $(basename "$dest")" >&2
      rm -f "$dest"
      return 1
    }
  else
    wget -q --tries=2 --timeout=15 -O "$dest" "$url" || {
      echo "  ⚠ Download failed: $(basename "$dest")" >&2
      rm -f "$dest"
      return 1
    }
  fi
}

INSTALLED=0

# ── 1. Noto CJK (Sans + Serif for JP/SC/TC/KR) ─────────────────
install_noto_cjk() {
  # macOS ships Hiragino (JP), PingFang (SC/TC), Apple SD Gothic Neo (KR)
  # so Noto CJK is only essential on Linux where no CJK system fonts exist.
  if [[ "$OS" == "Darwin" ]]; then
    echo "  ✓ CJK fonts — using macOS built-in (Hiragino, PingFang, Apple SD Gothic Neo)"
    return
  fi

  if font_installed "Noto Sans CJK"; then
    echo "  ✓ Noto CJK — already installed"
    return
  fi

  if command -v apt-get >/dev/null 2>&1; then
    echo "  ↓ Noto CJK — installing via apt..."
    sudo apt-get update -qq 2>/dev/null || true
    sudo apt-get install -y -qq fonts-noto-cjk fonts-noto-cjk-extra 2>/dev/null || {
      echo "  ⚠ apt install failed — trying direct download..."
      install_noto_cjk_direct
      return
    }
    INSTALLED=1
    echo "  ✓ Noto CJK — installed via apt"
  else
    install_noto_cjk_direct
  fi
}

install_noto_cjk_direct() {
  echo "  ↓ Noto CJK — downloading from GitHub (this may take a few minutes)..."
  local tmpdir
  tmpdir=$(mktemp -d)

  download "https://github.com/notofonts/noto-cjk/releases/download/Sans2.004/03_NotoSansCJK-OTC.zip" \
           "$tmpdir/noto-sans-cjk.zip"
  unzip -oqj "$tmpdir/noto-sans-cjk.zip" "*.ttc" -d "$FONT_DIR" 2>/dev/null || true

  download "https://github.com/notofonts/noto-cjk/releases/download/Serif2.003/04_NotoSerifCJK-OTC.zip" \
           "$tmpdir/noto-serif-cjk.zip"
  unzip -oqj "$tmpdir/noto-serif-cjk.zip" "*.ttc" -d "$FONT_DIR" 2>/dev/null || true

  rm -rf "$tmpdir"
  INSTALLED=1
  echo "  ✓ Noto CJK — installed from GitHub"
}

# ── 2. Pretendard (Korean sans-serif) ────────────────────────────
install_pretendard() {
  if font_installed "Pretendard"; then
    echo "  ✓ Pretendard — already installed"
    return
  fi

  echo "  ↓ Pretendard — downloading from GitHub..."
  local base="https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/packages/pretendard/dist/public/static"
  local ok=0
  for weight in Thin ExtraLight Light Regular Medium SemiBold Bold ExtraBold Black; do
    download "$base/Pretendard-${weight}.otf" "$FONT_DIR/Pretendard-${weight}.otf" && ((ok++)) || true
  done
  if [[ "$ok" -gt 0 ]]; then
    INSTALLED=1
    echo "  ✓ Pretendard — installed ($ok weights)"
  else
    echo "  ⚠ Pretendard — download failed, will use CDN fallback"
  fi
}

# ── 3. Inter (Latin sans-serif) ──────────────────────────────────
install_inter() {
  if font_installed "Inter"; then
    echo "  ✓ Inter — already installed"
    return
  fi

  echo "  ↓ Inter — downloading from GitHub..."
  local tmpdir
  tmpdir=$(mktemp -d)
  if download "https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip" "$tmpdir/inter.zip"; then
    unzip -oqj "$tmpdir/inter.zip" "*/InterVariable.ttf" -d "$FONT_DIR" 2>/dev/null || \
    unzip -oqj "$tmpdir/inter.zip" "InterVariable.ttf" -d "$FONT_DIR" 2>/dev/null || true
    INSTALLED=1
    echo "  ✓ Inter — installed"
  else
    echo "  ⚠ Inter — download failed, will use CDN fallback"
  fi
  rm -rf "$tmpdir"
}

# ── 4. JetBrains Mono (Code) ────────────────────────────────────
install_jetbrains_mono() {
  if font_installed "JetBrains Mono"; then
    echo "  ✓ JetBrains Mono — already installed"
    return
  fi

  echo "  ↓ JetBrains Mono — downloading from GitHub..."
  local tmpdir
  tmpdir=$(mktemp -d)
  if download "https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip" \
              "$tmpdir/jbmono.zip"; then
    unzip -oqj "$tmpdir/jbmono.zip" "fonts/ttf/JetBrainsMono-*.ttf" -d "$FONT_DIR" 2>/dev/null || \
    unzip -oqj "$tmpdir/jbmono.zip" "*/JetBrainsMono-*.ttf" -d "$FONT_DIR" 2>/dev/null || true
    INSTALLED=1
    echo "  ✓ JetBrains Mono — installed"
  else
    echo "  ⚠ JetBrains Mono — download failed, will use CDN fallback"
  fi
  rm -rf "$tmpdir"
}

# ── Run ──────────────────────────────────────────────────────────
echo "▸ Checking fonts for Marp Slide Studio..."
install_noto_cjk
install_pretendard
install_inter
install_jetbrains_mono

# Refresh font cache (fontconfig — available on Linux, sometimes macOS via Homebrew)
if [[ "$INSTALLED" -gt 0 ]] && command -v fc-cache >/dev/null 2>&1; then
  echo "  ↻ Refreshing font cache..."
  fc-cache -f 2>/dev/null || true
fi

echo "✓ All fonts ready"
