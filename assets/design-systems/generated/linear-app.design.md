# Linear App — Design System

A minimalist-premium slide theme inspired by Linear (linear.app). Dark-native, software-precise, built around near-pure-black surfaces and a single ghost-purple accent. Tight letter-spacing and generous whitespace carry the mood.

Use when: product strategy reviews, engineering decks, developer-facing pitches, technical architecture talks where the presenter wants quiet velocity and restraint over decoration.

## 1. Visual Theme & Atmosphere

- **Mood**: precise, software-native, dark-elegant. Feels like an IDE at midnight — all signal, no chrome.
- **Density**: moderate. Allow content to breathe, but don't leave the slide feeling unfinished. Target ~50% pixel coverage on content slides, much less on heroes.
- **Philosophy**: "Speed through clarity." The aesthetic is earned by subtraction — nothing decorative, every pixel has a reason.
- **Dark-native**: This theme inverts the usual track default. Slides are dark by default (`--bg: #08090A`). The "inverse" surface is pure white, reserved for monumental statements that need tonal contrast.

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#08090A` | Primary dark surface (near-pure black) |
| Background (inverse) | `--bg-inv` | `#FFFFFF` | Monumental slides, rare tonal flip |
| Foreground | `--fg` | `#F4F5F8` | Primary body and headline text on dark |
| Foreground (inverse) | `--fg-inv` | `#08090A` | Text on the white inverse surface |
| Muted | `--muted` | `#8A8F98` | Captions, meta text, secondary descriptions |
| Rule | `--rule` | `#1C1D20` | Hairlines and subtle separators |
| Accent | `--accent` | `#5E6AD2` | Ghost purple — Linear's signature |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on accent fill |

Auxiliary raised surface `--surface-raised: #111214` is used only for code blocks — it sits one step above the base black.

**Rule**: accent appears on at most 3 slides in a 10-slide deck (moderate density). Reserve it for: one hero rail, one metric, one divider numeral, or one key link. Never use accent as fill on full blocks.

## 3. Typography Rules

- **Family (body + display)**: Pretendard Variable. Inter is named as a secondary fallback to honor Linear's original direction, but Pretendard renders both Korean and Latin at the target scale.
- **Scale**: follow `typography/korean-scale.md` at moderate-density maxima. Body floor 22px, line-height 1.7.
- **Headline weight**: 600 (Linear favors 500–600 over heavy 700/800 — precision over bombast).
- **Display weight**: 600, letter-spacing −0.035em on hero.
- **Body weight**: 400, line-height 1.7.
- **Overline**: 15–18px, letter-spacing 0.1em, uppercase, weight 500. Use `--accent` on hero, `--muted` elsewhere.

No second typeface. Tension comes from weight (400 body vs 600 headline) and tight letter-spacing (−0.025em headline), not from font contrast. Korean text never italicizes — `:lang(ko) em` flips to weight 500.

## 4. Component Styling

- **Code blocks**: background `--surface-raised` (#111214), 1px `--rule` border, JetBrains Mono, slight 3–4px radius. Code is the one place this theme allows a hint of geometry, because Linear's product embeds snippets everywhere.
- **Inline code**: same surface, tight padding, 1px border.
- **Tables**: horizontal hairlines only; header row sits on a 1.5px `--muted` rule; tabular figures enabled globally.
- **Pull quotes**: 2px accent rule above the quote mark; quote text in `--fg`, no italic. Attribution uses a short hairline separator in `--muted`.
- **Images**: no border, no shadow, no rounded corners. Flat is the only answer.
- **Pagination**: small `--muted` numerals bottom-right with tabular nums; suppressed on hero, monumental, divider.

## 5. Layout Principles

- **Grid**: implicit 12-column with a 5rem outer gutter and 2rem inside. Flush-left is default everywhere except hero-overline and monumental (which allow center-start placement).
- **Safe area**: 4rem padding on content slides, 6rem on monumental and quote.
- **Accent rail**: hero uses a 2px vertical accent bar on the left edge — a direct nod to Linear's status/priority indicators. It appears ONLY on hero, not on every slide.
- **Rhythm**: alternate dense content with sparse statements. Never 3 dense slides in a row. The monumental white-flip is a deliberate palate cleanser around the 60–70% mark of a deck.
- **Whitespace**: Linear's product earns its calm through negative space between elements. Slides should too — let captions sit far below their values.

## 6. Depth & Elevation

None. No shadows, no glows, no blur. Depth is signaled entirely by the three-surface system:

1. `--bg` (#08090A) — base
2. `--surface-raised` (#111214) — code blocks only
3. `--bg-inv` (#FFFFFF) — tonal flip for monumental statements

If you feel the urge to add a shadow, add whitespace instead.

## 7. Do's and Don'ts

### Do
- Honor the dark-by-default rule. The one-slide flip to white is exactly that — one slide.
- Use the ghost-purple accent with discipline. Three appearances across ten slides is the ceiling.
- Keep letter-spacing tight on headlines (−0.025em) and loose on overlines (+0.1em). The contrast is the rhythm.
- Let the `--muted` gray do the work for captions and secondary copy. Full `--fg` on body is reserved for primary content.
- Use tabular numerals for anything that looks like data, including pagination.

### Don't
- Don't apply accent as a background fill on whole blocks. It's a rail, a number color, a link color — not a panel.
- Don't introduce a second typeface. Linear's aesthetic is achieved with one family at multiple weights.
- Don't soften black. `#08090A` is chosen for its slight warmth — do not substitute `#000000` or a neutral gray.
- Don't stack decorative elements (rails, rules, accents) on the same slide. Pick one.
- Don't use bold for emphasis in body copy. Use weight 500 or italic (Latin only).
- Don't add icons, badges, or illustration. Type carries everything.

## 8. Responsive Behavior

Marp targets 1920×1080. The theme uses `clamp()` throughout so 1280×720 exports keep their typographic hierarchy. No mobile behavior — slides are slides. The dark base is tested for projector fall-off; avoid export to light-background printouts (the contrast inverts poorly).

## 9. Agent Prompt Guide (quick reference)

When asked to generate a slide in Linear App:
- Default background `#08090A`, text `#F4F5F8`. Treat this as a dark-native theme throughout.
- One accent color `#5E6AD2` (ghost purple), used on at most one element per slide.
- Single font: Pretendard Variable. Headlines weight 600 with letter-spacing −0.025em; body weight 400 with line-height 1.7.
- No shadows, no gradients, no rounded cards. Surface-raised `#111214` only for code blocks.
- Flush-left defaults. Hero carries a 2px accent rail on the left edge. Monumental slides flip to white (`--bg-inv`) for contrast.
- Headline clamp 48–80px, body 22–26px, display metric 180–340px. Tabular nums on all numerics.

---

*This theme is inspired by publicly visible linear.app brand aesthetics. It is not officially affiliated with or endorsed by Linear. For production use representing the brand, consult Linear's official guidelines.*
