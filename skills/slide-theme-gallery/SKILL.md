---
name: slide-theme-gallery
description: Use when the user says "/slide-gallery", "테마 갤러리", "테마 비교해서 고르고 싶어", "테마 미리보기", or wants to browse themes visually before picking. Offers three modes — Mood Match quiz (3 questions → 5–8 recommendations), Full Gallery (browser opens with 65 themes grid), and Personal Preview (render the user's own deck against 5 candidate themes side-by-side).
argument-hint: "[--mood|--full|--preview SLUG] [--refresh|--forge-all]"
allowed-tools: Read, Write, Glob, AskUserQuestion, Bash(node:*, bash:*, open:*, test:*, mkdir:*, cp:*), Task
---

# Slide Theme Gallery

Visual theme selection for 63 themes. Three modes balance speed and thoroughness.

## When invoked

- User wants to see themes before picking: "어떤 테마가 있는지 보고 싶어"
- User has compared in their head and wants to visualize: "stripe vs linear vs apple 비교"
- User starts cold: "/slide-theme" → curator offers gallery as an option
- User explicitly: "/slide-gallery"

## Procedure — mode router

### Step 1 — Determine mode

Parse args or ask:

| Arg | Mode |
|-----|------|
| `--mood` or nothing | **Mood Match** quiz (default, fastest) |
| `--full` | **Full Gallery** (browser, all 63) |
| `--preview <slug>` | **Personal Preview** (user's deck × 5 themes) |
| `--refresh` | Force rebuild of any cached render |
| `--forge-all` | Forge all 54 on-demand themes first (slow, warn user) |

If no arg and no clear user request, ask:

```
AskUserQuestion:
"어떻게 테마를 볼까요?"
 ① 빠른 3문답으로 추천 받기 (Mood Match, 30초) — Recommended
 ② 브라우저로 전체 63개 갤러리 열기
 ③ 내 덱을 후보 5개에 적용해서 비교 (5분, Playwright 필요)
```

---

## Mode A — Mood Match

### A.1 Ask the 3 questions via AskUserQuestion

Use this exact question set (single-select each):

**Q1. 표면 (Surface)**
- 밝고 깨끗함 (white/near-white bg)
- 깊고 어둠 (near-black bg, dark-native)
- 따뜻한 종이 (warm cream/off-white paper)
- 순수 검정 (pure blackout, cinematic)

**Q2. 톤 (Tone)**
- 기술적·단정적 (developer/architecture-focused)
- 사려 깊음·문학적 (editorial/narrative)
- 도발적·매체적 (bold media, conference keynote)
- 학술적·증거 중심 (research/policy)

**Q3. 강도 (Intensity)**
- 절제 (near-monochrome, accent scarce)
- 중간 (standard accent discipline)
- 강렬 (vivid accent, high-contrast)

### A.2 Score each theme

Read `assets/design-systems/registry.json`. For each brand, compute a match score against the answers using this mapping table:

| Answer | High-match (+3) | Medium-match (+1) |
|--------|----------------|-------------------|
| Surface: bright | brands with `#FFF`/`#FAFAFA`/`#F5F5F7` as primary palette[0] | any with light primary |
| Surface: dark | brands with `#000`/`#08*`/`#0A*`/`#0F*` as palette[0] — linear, vercel, x.ai, voltagent, supabase | any near-black |
| Surface: warm paper | kinfolk-sans, claude, notion, sanity, clay | any with warm off-white |
| Surface: blackout | apple (inverse), spacex, runwayml, ferrari, lamborghini | any with #000 in palette |
| Tone: technical | stripe, vercel, linear, cursor, mistral, supabase, obsidian-mono | most minimalist-premium |
| Tone: editorial | kinfolk-sans, notion, claude, sanity, clay | any editorial track |
| Tone: provocative | wired-grid, spotify, ferrari, lamborghini, runwayml, pinterest | any with vibrant accent |
| Tone: academic | arctic-sans, ibm, mintlify, together.ai, cohere | any with subdued palette |
| Intensity: restrained | apple, vercel, linear, cal, x.ai, resend, obsidian-mono | density `sparse` |
| Intensity: moderate | most brands | anything with `moderate` density |
| Intensity: intense | ferrari, wired-grid, mistral, sentry, lamborghini, spotify | density `dense` or strong accent |

### Editorial serif opt-in (v0.7.0+)

When the user answers Surface=warm-paper AND Tone=editorial AND explicitly mentions serif / 명조 / editorial typography, add `kinfolk-serif` and `arctic-serif` to the recommendation list. These are opt-in variants — do NOT include them by default even for editorial-leaning answers, since Gothic is the plugin default.

### A.3 Filter + suggest

- Score each theme 0–9
- Take top 5–8 by score
- Include at least one curated Tier 2 theme (to guarantee quality floor)
- Present with AskUserQuestion or table, with Use/View buttons in a small HTML summary

### A.4 Hand off

- User picks one → run `/slide-theme <slug>` (delegate to `slide-theme-curator`)
- If user wants more options → offer Mode B (Full Gallery)

---

## Mode B — Full Gallery

### B.1 Build

Run the build script:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/build-gallery.mjs
```

Arguments:
- `--refresh` if user passed it
- `--only <slug,...>` if user specified a subset

Default output: `~/.marp-slide-studio/gallery/`

Expect ~2 minutes for 9 cached themes, more if `--forge-all` precedes.

### B.2 Open in browser

```bash
open ~/.marp-slide-studio/gallery/index.html
```
(macOS `open`; use `xdg-open` on Linux, `start` on Windows — detect via `$OSTYPE`)

### B.3 Instruct user

```
✓ Gallery opened in your browser
  Browse, filter, click cards. When you pick one, the card's "Use" button
  copies the command to your clipboard:
  
  /slide-theme <slug>
  
  Paste it back here to apply the theme.
```

Wait for user to return with a slug. Delegate to `slide-theme-curator`.

---

## Mode C — Personal Preview

### C.1 Locate user's deck

`$1` after `--preview` is the slug. Verify `./slides/<slug>/brief.md` + `deck.md` exist.

### C.2 Select 5 candidate themes

Default: run Mood Match scoring (A.2) against the brief's `tone` and `differentiation_against` → top 5 themes.

Or: if user specified explicit candidates via `--candidates stripe,linear,apple,notion,tesla`, use those.

### C.3 Render user's deck × 5 themes

For each candidate:
1. Ensure theme is cached (forge if needed via `theme-forger` skill)
2. Create temp directory `./slides/<slug>/.preview/<theme>/`
3. Copy user's `deck.md` there; swap front matter `theme:` to the candidate slug
4. Copy candidate's theme CSS as `theme.css`
5. Run `bash scripts/render.sh .preview/<theme>` (modify to support subpath) — or use a direct marp-cli call
6. Capture screenshots of slides 1–3 via Playwright (the "first impression" slides)

### C.4 Generate comparison HTML

Write `./slides/<slug>/.preview/index.html` — a 1×5 or 2×3 grid showing the same 3 slides rendered in 5 themes. Each column is a theme, with a "Pick this" button.

### C.5 Open in browser

```bash
open ./slides/<slug>/.preview/index.html
```

### C.6 User picks → apply

User sends back a slug. Swap the main deck's `theme.css` to that theme's CSS. Clean up `.preview/` unless user wants to keep comparison.

---

## Dependencies

- **Required**: Node.js, marp-cli via npx (already required elsewhere)
- **Optional**: Playwright — without it, Modes B and C show palette swatches + on-demand forge instructions instead of actual renders
- **Graceful degradation**: If Playwright missing, Mode B still builds the HTML grid with palette swatches; Mode C falls back to "list 5 candidates and let user pick" without visual comparison

## Known limitations

- Full Gallery shows real renders only for themes already in `assets/design-systems/generated/`. The other 54 show swatch + metadata cards with a Forge call-to-action.
- Personal Preview forges missing candidates silently — can take 30s × unforged count before rendering starts.
- Gallery is browser-based; can't be viewed inside the Claude Code terminal directly.

## Gotchas

- **65 cards shown, only 11 have real render thumbnails** (6 curated + 5 seed). The other 54 show palette swatch cards with a "⚡ Forge" call-to-action. This is by design — pre-rendering all 59 registry brands would take ~15 minutes and most are never used. Make the distinction clear when suggesting candidates.
- **Mood Match serif-opt-in nuance** (v0.7.0+): `kinfolk-serif` and `arctic-serif` are NOT primary candidates for warm-paper / editorial / academic categories by default. Include them ONLY when the user explicitly mentions serif / 명조 / editorial typography. Gothic variants (`kinfolk-sans`, `arctic-sans`) are the defaults.
- **`--forge-all` is slow**: 54 × ~30s theme-forger dispatch = ~25 minutes for first full gallery. Warn user, confirm before proceeding.
- **Gallery cache lives at `~/.marp-slide-studio/gallery/`** (or `$CLAUDE_PLUGIN_DATA/gallery/`), NOT in the plugin directory. User can delete safely to force full rebuild.
- **PNG rendering uses marp-cli `--images png` with `CHROME_PATH`**, not Playwright. This avoids Playwright's per-section screenshot timing issues with bespoke.js slide-switching.
- **Personal Preview mode (`--preview <slug>`) requires Playwright**. Without it, falls back to "list 5 candidates as text" without visual comparison — document this degradation clearly.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/scripts/build-gallery.mjs`
- `${CLAUDE_PLUGIN_ROOT}/scripts/gallery/template/`
- `${CLAUDE_PLUGIN_ROOT}/examples/gallery-sampler/`
- `${CLAUDE_PLUGIN_ROOT}/assets/design-systems/registry.json`
- `${CLAUDE_PLUGIN_ROOT}/skills/slide-theme-curator/SKILL.md` (for final theme apply)
- `${CLAUDE_PLUGIN_ROOT}/skills/theme-forger/SKILL.md` (for on-demand forge in Mode C)
