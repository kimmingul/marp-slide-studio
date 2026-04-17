# Arctic Sans — Design System

A sans-serif variant of Arctic Serif. Keeps the cool scholarly palette — light gray paper, navy ink, deep blue accent — and the footnote rail for research contexts. Uses Pretendard Variable throughout (no Noto Serif KR). Default research-talk preset in Gothic-first (business) mode.

Use when: research presentations, policy briefings, academic defenses, technical deep-dives — in Korean-first contexts where Gothic body is the expected default.

Pair with: `research-talk` preset by default (v0.7.0+), or when team settings specify `default_typography: gothic`.

## 1. Visual Theme & Atmosphere

- **Mood**: cool, considered, evidence-forward — conveyed through palette and hairlines, not serif forms
- **Density**: moderate — research decks tolerate more text than marketing decks
- **Philosophy**: "Show the work, don't decorate. The navy ink does the quiet authority, the sans keeps it contemporary."

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#F3F4F6` | Cool paper |
| Background (inverse) | `--bg-inv` | `#0F172A` | Hero, divider (deep navy) |
| Foreground | `--fg` | `#0F172A` | Primary text (navy ink, not pure black) |
| Foreground (inverse) | `--fg-inv` | `#F3F4F6` | Text on navy |
| Muted | `--muted` | `#64748B` | Captions, footnotes |
| Rule | `--rule` | `#CBD5E1` | Hairlines |
| Accent | `--accent` | `#1E4B8C` | Deep editorial blue — data + callouts |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on accent |

Same palette as Arctic Serif. Scholarly authority comes from the navy+gray chroma, not from the serif forms.

## 3. Typography Rules

**Single-family**: Pretendard Variable throughout.

| Role | Size | Weight |
|---|---|---|
| Display | 120–180px | 800 |
| Headline | 48–72px | 700 |
| Subhead | 28–36px | 500 |
| Body | 22–26px | 400 (line-height 1.7) |
| Caption | 14–16px | 400 italic |
| Footnote | 13–15px | 400 |
| Overline | 12–13px | 600, tracked, uppercase |

Footnotes are supported explicitly via `.footnote-rail` class — this theme anticipates citations.

## 4. Component Styling

- **Citations**: inline `[1]` in accent, raised slightly, linked to the footnote rail at slide bottom
- **Footnote rail**: 1.5rem strip at slide bottom, `--muted` color, `[N] text` format. Counter-driven numbering.
- **Tables**: double top rule (1.5px + 0.5px offset), single bottom rule, no vertical rules (scientific-paper treatment)
- **Code blocks**: background `#E2E8F0`, monospace JetBrains Mono
- **Images**: thin 1px `--rule` border, italic figcaption below (prefixed "그림. ")
- **Pull quotes**: Pretendard 500 italic, hanging quote mark in accent

## 5. Layout Principles

- **8-column analytical grid** with 5rem gutter
- **Footnote rail** optional per slide (opt in via `.footnote-rail` class)
- **Page numbers**: small caps, tabular-numeric, bottom-right
- **Alignment**: flush-left default. Never center body.

## 6. Depth & Elevation

None. Depth via ink color contrast only (navy vs muted gray).

## 7. Do's and Don'ts

### Do
- Use the footnote rail when citing sources.
- Reserve accent for data callouts and pivotal claims (≤3 per 10).
- Flush-left everything except hero and monumental.
- Use small caps for section numbers and meta labels.

### Don't
- Decorate. If it's not evidence or typography, it doesn't belong.
- Use charts with 4+ colors.
- Use emoji or icons.
- Center-align body text.

## 8. Responsive Behavior

16:9 at 1920×1080 primary. `clamp()` maintains readability at 1280×720 exports.

## 9. Agent Prompt Guide (quick reference)

When generating in Arctic Sans:
- Background `#F3F4F6` (cool gray), text `#0F172A` (navy ink).
- Pretendard Variable for everything.
- Accent `#1E4B8C` (deep blue), used on ≤3 slides per 10.
- Flush-left, 30ch text columns, 5rem outer gutter.
- Footnote rail via `.footnote-rail` class on research-heavy slides.
- Cite with inline `[1]` markers + corresponding rail entry.
- No shadows, no rounded corners, no icons.

---

*This theme is part of Marp Slide Studio v0.7.0+. It replaces `arctic-serif` as the default for the `research-talk` preset in Gothic-first (business) mode. For the original Noto Serif KR display variant, use `/slide-theme arctic-serif` or `/slide-auto … --typography editorial`.*
