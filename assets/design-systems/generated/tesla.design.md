# Tesla — Design System

A minimalist-premium slide theme inspired by Tesla's engineering-minimal surface: pristine white page, a single signature charcoal (#171A20) for inverse surfaces, and a red brake-light accent that appears only when a slide deserves it. Near-monochrome by default. Korean body in Pretendard.

Use when: hardware/engineering launches, technical architecture briefs, industrial-product storytelling, and executive decks where calm authority outranks noise.

## 1. Visual Theme & Atmosphere

- **Mood**: industrial minimal, engineering-future, quiet precision.
- **Density**: sparse. Target ≤ 35% pixel coverage per slide. The white page is the product photograph; type is the chassis.
- **Philosophy**: "Show the object. Cut everything else." The deck should feel like a spec sheet that happens to be beautiful. Not a pitch deck — an artifact.
- **Inverse surface**: `#171A20` (Tesla's signature charcoal) — deliberately NOT pure black. Pure black on a projector reads as an absence; charcoal reads as a machined surface.
- **Red accent**: the color of a brake light in a tunnel. Used to mark the one thing you want the audience to stop for.

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#FFFFFF` | Primary slide surface. Unbroken white. |
| Background (inverse) | `--bg-inv` | `#171A20` | Hero, divider — Tesla charcoal, never pure black |
| Foreground | `--fg` | `#171A20` | Primary text on white |
| Foreground (inverse) | `--fg-inv` | `#FFFFFF` | Text on charcoal |
| Muted | `--muted` | `#5C5E62` | Captions, meta, supporting prose |
| Rule | `--rule` | `#E4E4E5` | Hairline dividers |
| Accent | `--accent` | `#CC0000` | Tesla-red brake-light — used VERY rarely |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on red |

**Accent policy (HARD RULE)**: `--accent` (`#CC0000`) appears on **at most 2 slides in a 10-slide deck**. Apply it via the `.brake` or `.brake-rule` utility class, or via the `section.metric.accent` variant on the dominant numeral. Examples of appropriate use: the final killer metric, the one claim the audience must remember. Inappropriate use: accent on a hero overline, accent on body bullets, accent on every page number.

The `#000000` in Tesla's public palette intentionally does NOT get its own token — pure black is reserved for photographic objects on the page (like a vehicle silhouette). Charcoal `#171A20` is the branded dark surface.

## 3. Typography Rules

- **Family (body + display)**: Pretendard Variable. Tesla publicly uses a Gotham-family custom (Gotham SSm / Tesla Sans), but those are proprietary. Pretendard's neutral, slightly geometric forms capture the same engineering calm — and it renders Hangul natively. Gotham is listed as a secondary fallback for users who happen to have it licensed locally.
- **Scale**: follow `typography/korean-scale.md`. Density is `sparse`, so the top end of the `--fs-display` clamp is pushed to **240px** for single-word hero moments.
- **Display weight**: 300–500. Tesla's wordmark is lean, not bold; avoid 700+ on display type.
- **Headline weight**: 500. Letter-spacing −0.025em.
- **Body weight**: 400, line-height 1.7, letter-spacing −0.005em.
- **Overline**: 14–15px, letter-spacing 0.14em, UPPERCASE, weight 500, color `--muted`. UPPERCASE only for Latin-only labels (anti-pattern #14).
- **Korean handling**: `:lang(ko) em { font-style: normal; font-weight: 500; }` so Hangul never renders as synthesized italic.
- **Numerals**: tabular everywhere (`"tnum" 1`). Numbers are the theme's second language.

No secondary typeface. Tension comes from scale contrast and weight contrast within one family.

## 4. Component Styling

- **Pull quotes**: 42–68px, weight 400, `--fg` on `--bg`. No quotation-mark chrome; a 2.5rem hairline separates attribution.
- **Code blocks**: background `#F3F3F3`, `--fg` text, no border radius, no shadow. JetBrains Mono.
- **Tables**: only horizontal rules — 1px `--rule` between rows, 1.5px `--fg` under the header. Tabular figures. Never striped.
- **Images**: zero decoration — no rounded corners, no borders, no shadows, no overlays. A product photograph on white IS the composition.
- **Hairlines**: 1px `--rule` for neutral separation; 2px `--accent` via `.brake-rule` only when marking the single crucial moment on the deck.
- **Pagination**: bottom-right, `--muted`, tabular, tracking `0.08em`. Hidden on `.hero`, `.divider`, `.monumental`.

## 5. Layout Principles

- **Grid**: 12-column, flush-left default. Use whitespace, not columns, to breathe.
- **Safe area**: 4.5rem vertical, 5.5rem horizontal padding.
- **Alignment**: flush-left almost always. Center only in `hero` and `monumental`.
- **Asymmetry**: prefer 60/40 and 55/45 splits over 50/50. Even splits read as a web landing page (anti-pattern #1).
- **Rhythm**: alternate white slides with charcoal `divider` / `hero` slides every 3–4 beats. Never 3 charcoal slides in a row — the eye fatigues.
- **Product dominance**: when an image is on the slide, it should occupy ~50% or more of the canvas. Text serves the image, not vice versa.

## 6. Depth & Elevation

- **Shadows**: none. Ever. Depth is achieved by color field contrast (`--bg` vs `--bg-inv`) and by scale jump.
- **Gradients**: none. Tesla's web product renderings use volumetric light, but those are photographs — not CSS gradients. Do not attempt duotone gradients (anti-pattern #2).
- **Layering**: no overlapping elements, no glass/blur. One plane per slide.

## 7. Do's and Don'ts

### Do
- Keep the page mostly empty. The white is a feature.
- Use the red accent on at most 2 slides per 10. Save it for the claim you want repeated tomorrow.
- Use charcoal `#171A20` (not pure black) for inverse surfaces.
- Set numerals tabular on every data slide.
- Let one element dominate each slide — a photo, a number, a sentence.

### Don't
- Don't use `#000000` as a surface color. Use `--bg-inv` (`#171A20`).
- Don't apply `--accent` on hero overlines, bullet markers, page numbers, or decorative rules.
- Don't add shadows, gradients, rounded cards, or glass blur (anti-patterns #2, #7).
- Don't use three-column feature-card mosaics (anti-pattern #1).
- Don't UPPERCASE mixed Korean/Latin headings (anti-pattern #14, mixed-language rules).
- Don't italicize Hangul under any circumstance.
- Don't set Korean body below `line-height: 1.6` (anti-pattern #15).

## 8. Responsive Behavior

16:9 native (1920×1080). All type uses `clamp()` so 1280×720 exports and projector fall-off remain legible. No mobile layout considerations — slides are slides.

## 9. Agent Prompt Guide (quick reference)

When asked to generate a slide in Tesla:
- Default white background, charcoal `#171A20` text. Use `--bg-inv` (`#171A20`) for hero and divider slides — never pure black.
- Red `#CC0000` is a brake-light accent. Apply via `.brake`, `.brake-rule`, or `section.metric.accent` on ≤ 2 slides per 10. Nothing else.
- Single font: Pretendard Variable. Never italicize Hangul.
- No shadows, no gradients, no rounded cards, no icon libraries.
- Flush-left, asymmetric splits (60/40, 55/45). Center only in `hero` and `monumental`.
- Display weight 300–500 (lean, not bold). Headline 500. Body 400, line-height 1.7.
- Numerals tabular everywhere. Data slides set `font-feature-settings: "tnum" 1, "lnum" 1`.
- When a single metric deserves the red accent, add `class="accent"` to the metric section and apply `.brake` to the unit.

---

*This theme is inspired by publicly visible Tesla brand aesthetics. It is not officially affiliated with or endorsed by Tesla. For production use representing the brand, consult Tesla's official guidelines.*
