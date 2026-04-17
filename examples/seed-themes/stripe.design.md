# Stripe — Design System

A minimalist-premium slide theme inspired by Stripe's developer-facing aesthetic: deep navy surfaces, a signature indigo-purple accent, optional purple-to-cyan duotone gradients, and unapologetically tabular data. Built for technical and financial narratives where precision is the mood.

Use when: platform keynotes, infrastructure and payments talks, metrics-led proof decks, enterprise pitches where quiet confidence outranks flash.

## 1. Visual Theme & Atmosphere

- **Mood**: confident, technical-premium, developer-facing. The slide behaves like a well-architected API — sparse, consistent, observable.
- **Density**: sparse. Target <45% pixel coverage on any content slide; hero and divider slides run even emptier.
- **Philosophy**: "Show the primitive, not the decoration." The type, the grid, and a single saturated accent carry the narrative; gradients show up only where motion and energy are the subject.
- **Signature moves**:
  - Deep navy `#0A2540` dark surfaces for hero and divider — the "Stripe dark."
  - Indigo-purple `#635BFF` as the single accent for emphasis and numerics.
  - Purple → cyan `135°` duotone gradient used in at most ONE spot per deck (hero headline wash, or large numeric).
  - Tabular numerals everywhere; OpenType `tnum` and `ss01` features engaged by default.

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#FFFFFF` | Main slide surface — bright, neutral |
| Background (inverse) | `--bg-inv` | `#0A2540` | Hero, divider — signature Stripe navy |
| Foreground | `--fg` | `#0A2540` | Primary text on light |
| Foreground (inverse) | `--fg-inv` | `#FFFFFF` | Text on navy |
| Muted | `--muted` | `#425466` | Captions, meta, secondary text, table headers |
| Rule | `--rule` | `#E6E8EB` | Hairlines and table separators |
| Accent | `--accent` | `#635BFF` | The single highlight — metric values, links, one mark per slide |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text layered on the accent color |

**Secondary signature (not a token role)**: cyan `#00D4FF` is reserved for the duotone gradient and for divider numerals on the inverse surface. Cyan never appears on the light background as a solid fill — it lives inside the gradient pair with purple.

**Accent policy**: accent appears on at most **2 slides per 10**. Its scarcity is its power. The duotone gradient appears at most **once per deck**.

## 3. Typography Rules

- **Family (body + display)**: Pretendard Variable — single family, letting scale and weight carry contrast. Inter is listed as a Latin fallback but Pretendard covers both scripts cleanly.
- **Mono (code, data samples)**: JetBrains Mono, D2Coding fallback for Hangul.
- **Scale**: follows `typography/korean-scale.md` defaults. Display ceiling held at 220px to give hero slides room to breathe.
- **Headline weight**: 700, letter-spacing −0.02em.
- **Display weight**: 800, letter-spacing −0.045em — tight enough to feel engineered.
- **Body weight**: 400, line-height 1.7 (Korean-safe floor).
- **Overline**: 15–18px, letter-spacing 0.12em, uppercase (Latin labels only), weight 500–600, `--muted` or `--accent`.
- **Numerics**: `font-variant-numeric: tabular-nums` enabled on the base `section`, metric values, tables, and pagination. Stripe numbers are always tabular.

No second typeface. The tension comes from scale contrast and the single accent, not from font juggling. Korean `em` is never italicized.

## 4. Component Styling

- **Hero overline**: cyan `#00D4FF`, uppercase Latin label — sits above the headline with 0.12em tracking.
- **Code blocks**: background `#F6F9FC` (Stripe's docs-adjacent off-white), navy `--fg` text, 2px left border in `--accent`, no rounded corners. Inline code uses the same surface at 3px radius.
- **Tables**: hairline `--rule` row separators, 1.5px `--fg` header underline; th styled as overline (muted, uppercased Latin). Tabular figures everywhere.
- **Metric values**: rendered in `--accent` with tabular numerals, up to 340px at widest. Unit spans set at 0.38em and vertical-aligned into the superscript zone.
- **Pull quotes**: opening curly quote `"` hangs in accent purple; 2px accent dash precedes the attribution line. No italics on Hangul quotes.
- **Images**: flat, edge-to-edge or inline, no border, no shadow, no rounded corners.
- **Pagination**: lower-right, tabular, muted; suppressed on hero and divider.

## 5. Layout Principles

- **Grid**: a 12-column mental model with 5rem outer gutters, 2rem inner. The seven layout classes each impose their own simpler grid over this base.
- **Safe area**: 5rem padding on content slides; 6rem on hero, monumental, divider, and quote.
- **Alignment**: flush-left by default. Center alignment is reserved for `hero` headline and `monumental` statement slides.
- **Whitespace**: treat it as a load-bearing element. Never fill a corner "because it's empty."
- **Rhythm**: alternate dense (metric, enumerated, table) with sparse (hero, quote, divider). Never three dense slides in a row.

## 6. Depth & Elevation

- **Shadows**: none.
- **Blurs / glows**: none.
- **Gradients**: exactly one kind — the purple→cyan duotone at 135°. Used at low opacity on the hero as an atmospheric wash, or clipped to the hero headline text. Never used as a button fill, never as a full-bleed background on content slides.
- **Layering**: discouraged. Depth comes from the navy inverse surface versus white surface, and from rule weight; not from z-axis tricks.

## 7. Do's and Don'ts

### Do
- Lean hard on `--bg-inv` navy for act transitions — it's the most recognizable Stripe surface move.
- Use the accent purple on exactly one element per slide: a metric value, a marked word, or one link.
- Set numbers tabular. Always.
- Let the hero breathe — two lines of headline, one overline, one support line, done.
- Match overline case to language: UPPERCASE for Latin labels, natural case for 한글.

### Don't
- Splatter the duotone gradient across every slide. One appearance per deck, max.
- Mix cyan and purple as separate solid fills on the same slide — they live together only inside the gradient.
- Add drop shadows, inner glows, or blur — they read as 2012 SaaS, not modern Stripe.
- Center-align body text.
- Apply `text-transform: uppercase` to Korean text. Hangul has no case.
- Put page numbers or chrome on hero or divider slides.

## 8. Responsive Behavior

Marp targets 1920×1080 natively. All type is declared in `clamp()` so 1280×720 exports remain legible without rework. No mobile behavior — slides are slides. The sparse density is preserved at every export size by the `clamp()` ceilings.

## 9. Agent Prompt Guide (quick reference)

When asked to generate a slide in Stripe:

- Default surface white `#FFFFFF`, text navy `#0A2540`.
- Hero and divider use navy `#0A2540` background with white text; optional duotone wash at 0.18 opacity on hero only.
- One accent color `#635BFF` on one element per slide, max. Reserve cyan `#00D4FF` for the duotone gradient and divider numerals.
- Single font: Pretendard Variable. Mono: JetBrains Mono.
- Tabular numerals on every numeric: metrics, tables, pagination.
- No shadows, no rounded cards, no icon decoration.
- Flush-left. Generous whitespace. 45% max coverage on content slides.
- Headline: 48–80px, weight 700, line-height 1.12, letter-spacing −0.02em.
- Display (hero, metric): 120–340px, weight 700–800, letter-spacing −0.04 to −0.055em.
- Body: 22–26px, weight 400, line-height 1.7.
- The duotone gradient appears at most ONCE per deck — hero headline clip or hero atmospheric wash, never both.

---

*This theme is inspired by publicly visible stripe brand aesthetics. It is not officially affiliated with or endorsed by stripe. For production use representing the brand, consult stripe's official guidelines.*
