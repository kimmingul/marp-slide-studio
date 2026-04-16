# Notion — Design System

A warm-minimal slide theme inspired by Notion's page aesthetic — warm off-white paper, serif headline option, quiet typography, and a single warm-orange accent. Every slide is treated as a printed page: flat, unadorned, thoughtful. Korean body set in Pretendard Variable; display set in Noto Serif KR for editorial gravitas without ornament.

Use when: product narratives, thoughtful essays presented as decks, knowledge-work stories, workshop materials, long-form documentation-style talks.

## 1. Visual Theme & Atmosphere

- **Mood**: warm-minimal, thoughtful, page-like
- **Density**: moderate — generous margins, a single idea per page, nothing rushed
- **Philosophy**: "A slide is a page. Make it quiet. Let the reader think."

The Notion look reads as the opposite of maximalist decks. No gradients, no cards, no badges. Warm off-white paper, warm near-black ink, one hot-orange mark per spread.

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#F7F6F3` | Main surface — warm off-white "paper" |
| Background (inverse) | `--bg-inv` | `#37352F` | Hero / divider — warm near-black ink |
| Foreground | `--fg` | `#37352F` | Primary text |
| Foreground (inverse) | `--fg-inv` | `#F7F6F3` | Text on inverse surface |
| Muted | `--muted` | `#787774` | Captions, attributions, meta text |
| Rule | `--rule` | `#E9E5D8` | Hairlines, dividers, quiet edges |
| Accent | `--accent` | `#D9480F` | Warm orange — used once per slide, max |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on accent fills (rare) |

Notion's page surface reads as paper, not "#FFFFFF white." The 3-degree warm tint is load-bearing — do not swap for pure white.

## 3. Typography Rules

Editorial two-font pairing: serif display + sans body.

### Display / Headline: Noto Serif KR

- 500 weight for heroes and display, 600 for section titles
- Line-height 1.02 at display, 1.18 at headline
- Letter-spacing −0.025em at display, −0.015em at headline
- Approximates Notion's optional Lyon Text serif headline

### Body: Pretendard Variable

- 400 weight, line-height 1.7 (Korean body breathing)
- Handles both Hangul and Latin without a visible seam
- Italic never applied to Hangul (`:lang(ko) em` override)

### Mono: JetBrains Mono

- Code inline and code blocks on a warm-tinted `#EFEDE6` fill, no border radius beyond 3px

### Scale

| Role | Size | Font | Weight |
|---|---|---|---|
| Display | 128–200px | Noto Serif KR | 500 |
| Headline | 52–76px | Noto Serif KR | 500–600 |
| Subhead | 28–38px | Pretendard | 500 |
| Body-L | 26–32px | Pretendard | 400 |
| Body | 22–26px | Pretendard | 400 |
| Caption | 14–17px | Pretendard | 400 |
| Overline | 14–17px | Pretendard | 600, tracked, uppercase |

### Paragraph flow

Subsequent paragraphs use `text-indent: 1.5em` — an editorial move borrowed from print. First paragraph of a slide has no indent.

## 4. Component Styling

- **Pull quotes**: hanging warm-orange `"` in Noto Serif KR, italic body, short em-dash attribution rule
- **Tables**: flat, single top + hairline rows, tabular figures, column headers in muted small caps (no inverse row fills)
- **Images**: flat, no border, no shadow, no rounded corners — images read as inline figures, not cards
- **Code inline**: warm tint background `#EFEDE6`, accent color text, 3px corner radius (Notion's only permitted radius)
- **Code blocks**: same warm tint, 3px left rule in `--rule`, no box outline
- **Callouts**: left-rule in `--accent` only — no colored fill (Notion's signature callout, minus the emoji)
- **Pagination**: quiet tabular numerals bottom-right in `--muted`

## 5. Layout Principles

- **Grid**: single-column default with generous margins (5.5rem horizontal, 4–6rem vertical)
- **Column widths**: narrow text columns (30–32ch) so line length stays readable
- **Alignment**: flush-left, never centered body text
- **Asymmetry**: split layouts lean on a dominant main column with a quiet side-note column (mirrors Notion's page body + comment rail)
- **Whitespace**: "room to breathe" — moderate density, not sparse, not dense

## 6. Depth & Elevation

- **Shadows**: none. Ever.
- **Elevation**: expressed through negative space and hairline rules, not drop-shadow
- **Gradients**: none
- **Border radius**: limited to 3px on inline code — the only rounded corner in the system. Images and callouts are flat.

## 7. Do's and Don'ts

### Do
- Treat each slide as a Notion page — one heading, a paragraph or two, nothing more
- Use the warm-orange accent on one element per slide, maximum
- Allow generous vertical whitespace
- Set headlines in Noto Serif KR for editorial gravity
- Use the `.callout` class for emphasis sparingly
- Keep body text flush-left in narrow columns

### Don't
- Add card backgrounds, box shadows, or gradients
- Use rounded corners on images, figures, or layout blocks
- Use more than two typefaces
- Apply uppercase to Hangul
- Italicize Korean text
- Place the accent color on more than ~3 slides per 10 (moderate density policy)
- Use icons, emoji, or illustrative ornament

## 8. Responsive Behavior

Marp 16:9 native (1920×1080). All sizes use `clamp()` so the theme remains legible at 1280×720 exports and scales up cleanly at 4K. No separate mobile or print rules.

## 9. Agent Prompt Guide (quick reference)

When generating in Notion:
- Background `#F7F6F3` (warm off-white paper), text `#37352F` (warm near-black ink)
- Two fonts: Noto Serif KR (display/headline), Pretendard Variable (body, subhead)
- Accent `#D9480F` (warm orange) used once per slide, max 3 slides per 10
- Flush-left, narrow text columns (30ch), generous margins
- No shadows, no gradients, no card fills, no icons, no rounded corners (except 3px on inline code)
- Headline: 52–76px Noto Serif KR weight 500–600, line-height 1.18
- Body: 22–26px Pretendard 400, line-height 1.7
- Accent placement priority: one hero overline, one metric value, one callout rule — not all three on the same slide

---

*This theme is inspired by publicly visible notion brand aesthetics. It is not officially affiliated with or endorsed by notion. For production use representing the brand, consult notion's official guidelines.*
