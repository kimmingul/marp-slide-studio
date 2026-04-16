# Layout Patterns

Reusable slide layouts. Each pattern is a Marp markdown snippet + minimal CSS requirements. The `slide-composer` picks layouts that match the beat's purpose.

## Pattern index

| File | Purpose | When to use |
|---|---|---|
| `hero-full-bleed.md` | Opening / section break | Act transitions, first slide |
| `monumental-quote.md` | Single message, maximum impact | Thesis statement, killer metric |
| `two-column-split.md` | Comparison or text+visual | Detail act, product views |
| `data-dense.md` | Numbers with narrative | Proof act, one big metric + context |
| `section-divider.md` | Visual pause between acts | Between Problem → Solution etc. |
| `quote-attribution.md` | Testimonial, third-party voice | Proof act, social evidence |
| `list-numbered.md` | 3-item rhythm (not 5+) | Detail act, steps or principles |

## Rhythm rule

A good 8-slide deck uses 4–5 DIFFERENT layouts. Never more than 2 consecutive slides with the same layout. The slide-director enforces this.

## Class-based selection

Each layout is triggered by `<!-- _class: <name> -->` directive on the specific slide, which the theme CSS styles via `section.<name> { ... }`.
