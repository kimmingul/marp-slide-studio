# Obsidian Mono — Design System

A minimalist-premium slide theme inspired by Apple/Linear restraint and Braun industrial calm. Near-monochrome with one warm accent. Heavy whitespace. Korean body set in Pretendard.

Use when: executive briefings, product launches, technical architecture talks where gravitas > energy.

## 1. Visual Theme & Atmosphere

- **Mood**: quiet confidence, restraint, inevitability
- **Density**: spacious. Aim for <40% pixel coverage on any given slide.
- **Philosophy**: "The page is mostly empty because what remains is the only thing that matters."

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#F4F2EE` | Main slide surface (warm off-white) |
| Background (inverse) | `--bg-inv` | `#0A0A0A` | Hero, divider, monumental |
| Foreground | `--fg` | `#121212` | Primary text |
| Foreground (inverse) | `--fg-inv` | `#F4F2EE` | Text on dark |
| Muted | `--muted` | `#7A7571` | Captions, secondary text |
| Rule | `--rule` | `#D6D1C9` | Hairlines |
| Accent | `--accent` | `#C75B12` | One highlight color. Used sparingly. |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on accent |

**Rule**: accent appears on at most 2 slides in a 10-slide deck. Its scarcity is its power.

## 3. Typography Rules

- **Family (body + display)**: Pretendard Variable
- **Scale**: follow `typography/korean-scale.md` defaults
- **Headline weight**: 700
- **Display weight**: 800, letter-spacing −0.04em
- **Body weight**: 400, line-height 1.7
- **Overline**: 12–14px, letter-spacing 0.12em, uppercase, weight 500, `--muted`

No second typeface. The tension in this theme comes from scale contrast, not font contrast.

## 4. Component Styling

- **Buttons / CTAs in slide content**: flat, 1px `--fg` border, no radius, no shadow
- **Code blocks**: background `#EEEAE3`, `--fg` text, monospace D2Coding
- **Tables**: no vertical rules; horizontal rules at 1px `--rule`; tabular figures
- **Images**: no border, no shadow, no rounded corners (except avatars)
- **Pull quotes**: hanging quotation mark, serif variant (Pretendard 400, −0.02em)

## 5. Layout Principles

- **Grid**: 12-column grid with 5rem gutter outside, 2rem inside
- **Safe area**: 4rem padding all sides (slide padding)
- **Alignment**: flush-left is default. Center only for `hero` and `monumental` layouts.
- **Rhythm**: alternate dense and sparse slides. Never 3 dense in a row.

## 6. Depth & Elevation

- **Shadows**: none. Depth comes from color (`--bg-inv`) or rule weight, not blur.
- **Layering**: avoid overlapping elements. If needed, use whitespace instead.

## 7. Do's and Don'ts

### Do
- Use negative space aggressively. Target 40% max coverage.
- Keep accent appearances rare and meaningful.
- Flush-left almost everything.
- Use hairline (1px) rules for separation.

### Don't
- Add drop shadows, inner glows, or blur.
- Use the accent for decoration. Only for the single most important element on a slide.
- Center-align body text.
- Add chrome (headers, page numbers) on hero / divider slides.

## 8. Responsive Behavior

Marp targets 1920×1080 by default. The theme uses `clamp()` for typography so 1280×720 exports still look correct. No mobile behavior — slides are slides.

## 9. Agent Prompt Guide (quick reference)

When asked to generate a slide in Obsidian Mono:
- Default background `#F4F2EE`, text `#121212`.
- One accent color `#C75B12`, used on one element per slide max.
- Single font: Pretendard Variable.
- No shadows, no gradients, no rounded cards.
- Flush-left. Generous whitespace. 40% max coverage.
- Headline: 56–80px, weight 700, line-height 1.15, letter-spacing −0.02em.
- Body: 22–26px, weight 400, line-height 1.7.
