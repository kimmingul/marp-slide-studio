# Slide Anti-Patterns (MUST AVOID)

These patterns scream "generic AI slide deck" or "1998 corporate PowerPoint". The slide-composer and slide-director must treat this list as HARD constraints.

## Visual anti-patterns

### 1. Three-column card mosaic
Three evenly spaced rounded-corner cards with an icon + heading + body text each.
**Why it fails**: instantly reads as a landing-page hero section, not a slide.
**Instead**: one idea per slide; use rhythm (one big statement → one dense data slide) across the deck.

### 2. Purple/violet gradient on white
`linear-gradient(135deg, #8B5CF6, #EC4899)` or any "2020 SaaS startup" gradient.
**Why it fails**: every AI-generated site looks like this.
**Instead**: single solid brand color, or desaturated duotone, or monochrome + one high-contrast accent.

### 3. Hero image with dark overlay + centered white text
`background: url(...) center/cover; filter: brightness(0.5);` with white text on top.
**Why it fails**: stock-photo-ad aesthetic.
**Instead**: full-bleed color field, or photo cropped to one corner with text in whitespace, or typography-only hero.

### 4. Bullet-only slides
More than 4 bullets, all same visual weight, no hierarchy.
**Why it fails**: the audience reads ahead and stops listening.
**Instead**: one sentence per slide, or a numbered list of 3 max, or re-structure as a diagram.

### 5. Rainbow data visualization
Pie charts or bar charts with 5+ saturated colors (red/orange/yellow/green/blue).
**Why it fails**: color carries no meaning; eye cannot prioritize.
**Instead**: monochrome data + one accent for the highlighted value.

### 6. Decorative emojis in body text
"Our Process: 🚀 Fast ⚡ Efficient 🎯 Accurate"
**Why it fails**: childish, dated, low-information.
**Instead**: strip emojis from body. If a symbol is needed, use typographic dingbats (§, ¶, →) or dedicated icon font.

### 7. Beveled or shadowed buttons/chips
`box-shadow: 0 10px 20px rgba(0,0,0,0.3); border-radius: 100px` on small UI elements inside a slide.
**Why it fails**: imitates web UI inside a slide context where there's no interactivity.
**Instead**: flat pills with hairline borders (1px solid) or no decoration at all.

### 8. Center-aligned everything
Every slide has centered title + centered body + centered image.
**Why it fails**: zero visual rhythm across the deck; reads as "AI default layout".
**Instead**: asymmetric composition — text flush-left with wide right-side whitespace, or 60/40 split, or rule-of-thirds.

## Content anti-patterns

### 9. "Agenda" slide
A slide titled "Agenda" with 5 numbered sections.
**Why it fails**: steals the first 30 seconds from your strongest opening.
**Instead**: open on your strongest single claim. Show structure through the deck's rhythm, not a table of contents.

### 10. "Thank You / Questions?" slide as finale
**Why it fails**: ends on a polite note instead of a memorable one.
**Instead**: end on the single sentence you want the audience to repeat tomorrow. Contact info goes in a subtle footer or an after-slide.

### 11. Over-hedged language
"We believe we might be able to potentially help teams..."
**Why it fails**: evasive; the audience loses trust.
**Instead**: one declarative sentence. If uncertain, say what you know ("In 12-person beta, …") instead of hedging.

### 12. Generic stock icons (Heroicons, Material)
Flat line icons of gears, rockets, lightbulbs attached to every bullet.
**Why it fails**: noise; ages badly.
**Instead**: either commissioned/editorial illustration, or no icons at all.

## Typography anti-patterns

### 13. Default system sans everywhere
Using `-apple-system, BlinkMacSystemFont, 'Segoe UI'` as the only font.
**Why it fails**: reads as unfinished.
**Instead**: deliberate pairing (e.g., editorial serif display + neutral sans body) with loaded web fonts.

### 14. All caps body text
Subheads and body copy in UPPERCASE for "emphasis".
**Why it fails**: unreadable in bulk; screams.
**Instead**: use weight, size, and color for hierarchy. Reserve uppercase for very short labels (≤3 words).

### 15. Tight line-height on Korean body
Korean text at `line-height: 1.3` or less.
**Why it fails**: Hangul is denser than Latin; stacks visually collapse.
**Instead**: Korean body `line-height: 1.6–1.75`, Korean headline `1.1–1.25`.

## Layout anti-patterns

### 16. "5 equal steps" horizontal flow
Arrow → Arrow → Arrow → Arrow → Arrow with icons above.
**Why it fails**: consulting-deck cliché.
**Instead**: one slide per step, with rhythm. Or a single timeline image. Or collapse to 2–3 inflection points.

### 17. Data + paragraph + bullets + photo on one slide
Everything-on-one-slide cram.
**Why it fails**: eye has no entry point.
**Instead**: one dominant element per slide. Move secondary content to the next slide.

### 18. Title bar + footer + page number on every slide
Heavy chrome eating 20% of every slide.
**Why it fails**: repetitive, steals content area.
**Instead**: chrome only on section dividers, or a single 1px footer rule with page number in small caps.

## How to use this list

When generating or reviewing a slide, run through this checklist. If any anti-pattern is present, the slide must be redesigned, not patched.

The slide-director and marp-design-critic agents MUST quote the specific anti-pattern number when flagging a violation.
