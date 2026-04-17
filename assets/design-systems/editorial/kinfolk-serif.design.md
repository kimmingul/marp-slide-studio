# Kinfolk Serif — Design System

> **Opt-in editorial variant (v0.7.0+).** The plugin defaults to Gothic typography for business/tech contexts. This theme keeps the Kinfolk palette but pairs it with Noto Serif KR display — use explicitly for editorial serif atmosphere. For the Gothic-default sans variant with the same palette, see [`kinfolk-sans`](./kinfolk-sans.design.md).
>
> **How to use explicitly:**
> - `/slide-theme kinfolk-serif` — direct theme pick
> - `/slide-auto "topic" --preset team-narrative --typography editorial` — autopilot with serif override
> - Team setting `default_typography: editorial` in `.claude/marp-slide-studio.local.md`

An editorial-first slide theme inspired by Kinfolk magazine, The New York Times Magazine, and Cereal. Warm neutral palette, serif display type, generous margins, editorial pacing. Korean body set in Pretendard; display set in Noto Serif KR for editorial gravitas.

Use when: storytelling decks, brand narratives, cultural/mission-driven talks, long-form essays presented as slides — and **when you explicitly want serif display** (the plugin default is Gothic since v0.7.0).

## 1. Visual Theme & Atmosphere

- **Mood**: thoughtful, unhurried, literary
- **Density**: varied rhythm — some slides almost empty, others rich with text
- **Philosophy**: "A slide is a printed page. Make it deserve its ink."

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#EFE9DC` | Main surface (cream paper) |
| Background (inverse) | `--bg-inv` | `#1A1814` | Hero / cover (deep ink) |
| Foreground | `--fg` | `#1A1814` | Primary text |
| Foreground (inverse) | `--fg-inv` | `#EFE9DC` | Text on dark |
| Muted | `--muted` | `#6B6257` | Captions, attributions |
| Rule | `--rule` | `#C8BFA9` | Hairlines |
| Accent | `--accent` | `#6E0F1E` | Deep burgundy. For callouts, pull quotes. |
| Accent-ink | `--accent-ink` | `#EFE9DC` | Text on accent |

## 3. Typography Rules

Editorial theme uses **two fonts** by design:

### Display / Headline: Noto Serif KR
- 500 weight for headlines, 600 for titles
- Line-height 1.2 at headline, 0.98 at display
- Letter-spacing −0.015em

### Body: Pretendard Variable
- 400 weight, line-height 1.75 (Korean body breathing)

### Scale

| Role | Size | Font | Weight |
|---|---|---|---|
| Display | 140–220px | Noto Serif KR | 500 |
| Headline | 52–72px | Noto Serif KR | 600 |
| Subhead | 28–36px | Pretendard | 500 |
| Body | 22–26px | Pretendard | 400 |
| Caption | 14–16px | Pretendard | 400 |
| Overline | 12–13px | Pretendard | 600, tracked, uppercase |

## 4. Component Styling

- **Drop cap**: the opening paragraph of text-heavy slides uses a 4-line drop cap in Noto Serif KR (optional)
- **Pull quotes**: hanging left-quotation mark in burgundy `--accent`, italic text in Pretendard Italic
- **Tables**: single hairline top and bottom; tabular figures; section headers in small caps
- **Images**: slight cream border (1px `--rule`) to feel printed; never rounded corners
- **Captions**: italic Pretendard, `--muted` color, appears beneath image with a short em-dash lead-in

## 5. Layout Principles

- **Grid**: 6-column editorial grid, generous outer margins (6rem)
- **Column widths**: narrow text columns (26–30ch) for readability
- **Asymmetry**: deliberate — rarely centered, often flush-left with right-side air
- **Page numbers**: set in small caps Roman numerals (I, II, III) on section dividers only

## 6. Depth & Elevation

- **Shadows**: none ever. Editorial depth is color and rule weight.
- **Paper feel**: cream `--bg` provides warmth without texture (no paper texture images — anti-pattern).

## 7. Do's and Don'ts

### Do
- Treat each slide as a magazine spread.
- Use drop caps sparingly on text-heavy slides.
- Allow some slides to be nearly empty — that's the pacing.
- Use burgundy accent for one element per slide, max.

### Don't
- Use more than two typefaces.
- Center-align body text.
- Add decorative flourishes (scrolls, ornaments, filigree).
- Rounded corners on anything.

## 8. Responsive Behavior

Marp 16:9 native. `clamp()` keeps the scale readable at 1280×720 exports.

## 9. Agent Prompt Guide (quick reference)

When generating in Kinfolk Serif:
- Background `#EFE9DC` (cream), text `#1A1814` (deep ink).
- Two fonts: Noto Serif KR (display/headline), Pretendard Variable (body).
- Accent `#6E0F1E` (burgundy), used rarely and intentionally.
- Flush-left, narrow text columns, wide outer margins.
- No shadows, no rounded corners, no gradients, no icons.
- Headline: 52–72px Noto Serif KR weight 600, line-height 1.2.
- Body: 22–26px Pretendard 400, line-height 1.75.
