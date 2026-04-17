# Arctic Serif — Design System

> **Opt-in editorial variant (v0.7.0+).** The plugin defaults to Gothic typography for business/tech contexts. This theme keeps the Arctic palette but pairs it with Noto Serif KR display — use explicitly for scholarly serif atmosphere. For the Gothic-default sans variant with the same palette + footnote rail, see [`arctic-sans`](./arctic-sans.design.md).
>
> **How to use explicitly:**
> - `/slide-theme arctic-serif` — direct theme pick
> - `/slide-auto "topic" --preset research-talk --typography editorial` — autopilot with serif override
> - Team setting `default_typography: editorial` in `.claude/marp-slide-studio.local.md`

A minimalist-premium theme for research, policy, and academic contexts. Cool gray palette, restrained serif display (Noto Serif KR), generous margins, navy-ink accent. Reads like a thoughtful white paper projected at full-bleed.

Use when: research presentations, policy briefings, academic defenses, editorial strategy reviews — and **when you explicitly want serif headlines** (the plugin default is Gothic since v0.7.0). This is NOT for founder pitches or marketing — too quiet.

## 1. Visual Theme & Atmosphere

- **Mood**: cool, considered, evidence-forward
- **Density**: moderately varied — research decks tolerate more text than marketing decks
- **Philosophy**: "Show the work. Don't decorate."

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#F3F4F6` | Main surface (cool paper) |
| Background (inverse) | `--bg-inv` | `#0F172A` | Hero, divider (deep navy) |
| Foreground | `--fg` | `#0F172A` | Primary text (navy ink, not black) |
| Foreground (inverse) | `--fg-inv` | `#F3F4F6` | Text on navy |
| Muted | `--muted` | `#64748B` | Captions, footnotes |
| Rule | `--rule` | `#CBD5E1` | Hairlines |
| Accent | `--accent` | `#1E4B8C` | Deep editorial blue, used on data and callouts |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on accent |

Rule: accent appears on max 3 slides per 10. Deep blue reads as "evidence", not "design."

## 3. Typography Rules

Two-font pairing calibrated for density:

### Display / Headline: Noto Serif KR
- 500 weight for headlines, 600 for titles
- Line-height 1.2 at headline
- Letter-spacing −0.015em

### Body: Pretendard Variable
- 400 weight, line-height 1.7 (Korean body)
- Size floor 22px, sweet spot 24px

### Scale

| Role | Size | Font | Weight |
|---|---|---|---|
| Display | 120–180px | Noto Serif KR | 500 |
| Headline | 48–64px | Noto Serif KR | 600 |
| Subhead | 28–36px | Pretendard | 500 |
| Body | 22–26px | Pretendard | 400 |
| Caption | 14–16px | Pretendard | 400 italic |
| Footnote | 13–15px | Pretendard | 400 |
| Overline | 12–13px | Pretendard | 600, tracked, uppercase |

Footnotes are supported explicitly. This theme anticipates citations.

## 4. Component Styling

- **Citations**: inline `[1]` in accent, raised slightly, linked to footnote rail at slide bottom
- **Tables**: double top rule (1px + 0.5px offset), single bottom rule, no vertical rules — the "scientific paper" treatment
- **Code blocks**: background `#E2E8F0`, monospace D2Coding
- **Images**: thin 1px `--rule` border, optional italic figcaption below
- **Pull quotes**: Noto Serif KR italic, hanging quote mark in accent

## 5. Layout Principles

- **Grid**: 8-column analytical grid with 5rem gutter
- **Footnote rail**: optional 1.5rem strip at slide bottom for `[1] citation text`
- **Page numbers**: Roman numerals (I, II, III) in small caps
- **Alignment**: flush-left default. Never center body.

## 6. Depth & Elevation

- No shadows, no gradients. Depth via ink color (navy vs muted) only.

## 7. Do's and Don'ts

### Do
- Use the footnote rail when citing.
- Reserve accent for data callouts and pivotal claims.
- Flush-left everything except hero and monumental.
- Use small caps for section numbers and meta info.

### Don't
- Decorate. If it's not evidence or typography, it doesn't belong.
- Use more than 2 typefaces.
- Add charts with 4+ colors.
- Use emoji or icons.

## 8. Responsive Behavior

16:9 at 1920×1080 primary. `clamp()` maintains readability at 1280×720.

## 9. Agent Prompt Guide (quick reference)

When generating in Arctic Serif:
- Background `#F3F4F6` (cool gray), text `#0F172A` (navy ink).
- Noto Serif KR for display/headline; Pretendard Variable for body.
- Accent `#1E4B8C` (deep blue), used on ≤3 slides/10.
- Flush-left, 30ch text columns, wide outer margins.
- No shadows, no rounded corners, no icons, no decorative elements.
- Footnote rail available via `.footnote-rail` class.
- Support citations via `[1]`, `[2]` inline markers + `section.footnotes`.
