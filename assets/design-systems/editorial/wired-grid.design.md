# Wired Grid — Design System

A modernist editorial theme inspired by WIRED magazine, Wallpaper*, and 032c. Aggressive grid structure, monospace overlines, electric accent, black-and-white base with a single charged color. Reads as "culture magazine feature article."

Use when: conference keynotes, trend reports, cultural/tech criticism, product launches that want EDGE rather than calm.

## 1. Visual Theme & Atmosphere

- **Mood**: alert, modernist, confident
- **Density**: deliberately inconsistent — some spreads are almost empty, others are densely gridded
- **Philosophy**: "A grid is a narrative device. Use it to create tension."

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#FFFFFF` | Main surface (stark white) |
| Background (inverse) | `--bg-inv` | `#000000` | Hero, cover, dominant moments |
| Foreground | `--fg` | `#000000` | Primary text |
| Foreground (inverse) | `--fg-inv` | `#FFFFFF` | On black |
| Muted | `--muted` | `#6B6B6B` | Captions, grid labels |
| Rule | `--rule` | `#000000` | Grid lines (full black, 1px) |
| Accent | `--accent` | `#FF4500` | Electric orange — used as punctuation |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on accent |

This is a high-contrast theme: black and white with orange as rare punctuation. Do NOT soften.

## 3. Typography Rules

Two fonts, deliberately mismatched to create tension:

### Display / Headline: Pretendard Variable at 900 weight
- Compressed, impact-style
- Line-height 0.95 at display, 1.05 at headline
- Letter-spacing −0.04em at display, −0.025em at headline

### Body: Pretendard Variable 400
- Line-height 1.65 (slightly tighter than default — editorial density)

### Overline / Meta: JetBrains Mono
- Monospace for metadata, section numbers, byline info
- 12–14px, uppercase, letter-spacing +0.08em

### Scale

| Role | Size | Font | Weight |
|---|---|---|---|
| Display | 160–280px | Pretendard | 900 |
| Headline | 64–96px | Pretendard | 900 |
| Subhead | 28–38px | Pretendard | 600 |
| Body | 22–26px | Pretendard | 400 |
| Caption | 14–16px | Pretendard | 400 italic |
| Mono meta | 12–14px | JetBrains Mono | 500 |

## 4. Component Styling

- **Grid lines**: 1px black rules visible on every content slide. The grid is the decoration.
- **Section numbers**: monospace, `→ 02 /` style separator
- **Pull quotes**: massive display type, black on white, accent-colored quote marks
- **Images**: sharp 1px black border; grayscale filter optional for editorial cohesion
- **Tables**: heavy black top/bottom rules, thin interior rules
- **Buttons/CTAs**: filled black with white text, no radius; or filled orange for emphasis

## 5. Layout Principles

- **12-column grid**: always visible through spacing, occasionally via explicit rule lines
- **Baseline shift**: headlines can break out of the content column into the margin
- **Column dropout**: some slides use only 6 of 12 columns; others span all 12
- **Asymmetry mandatory**: no slide is ever centered

## 6. Depth & Elevation

- Flat. No shadows ever. Depth is color inversion (bg-inv) or scale contrast.

## 7. Do's and Don'ts

### Do
- Let headlines break the grid. Bleed them into the margin intentionally.
- Use monospace for meta info (dates, bylines, issue numbers).
- Use the orange accent as punctuation, not decoration. Max 2 appearances per 10 slides.
- Invert slides (black bg) for rhythmic punch.

### Don't
- Soften edges. No rounded corners. No reduced opacity.
- Center body text.
- Use colors other than black/white/orange.
- Add a second accent color "to add interest" — that ruins the theme.

## 8. Responsive Behavior

16:9 at 1920×1080. The grid's 12-column structure collapses to 6-column at 1280×720 — `clamp()` handles most scaling.

## 9. Agent Prompt Guide (quick reference)

When generating in Wired Grid:
- Background `#FFFFFF`, text `#000000`.
- Accent `#FF4500` (electric orange), used on ≤2 slides/10 max.
- Pretendard Variable for display (weight 900) and body (weight 400).
- JetBrains Mono for overlines/meta only.
- 1px black rules visible as grid decoration.
- No shadows, no rounded corners, no secondary accent.
- Headlines CAN break the grid — bleed into margins.
- Display: 160–280px, weight 900, letter-spacing −0.04em.
- Invert (black bg) every 4–5 slides for rhythm.
