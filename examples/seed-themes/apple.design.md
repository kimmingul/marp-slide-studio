# Apple — Design System

A cathedral-minimal slide theme inspired by Apple's product-launch aesthetic: extreme whitespace, monumental type, and absolute monochrome discipline. The theme's power is scale and silence, not color. Korean body set in Pretendard; Latin fragments render in SF-family fallbacks.

Use when: keynote-style product reveals, thesis statements that demand inevitability, executive briefings where restraint signals confidence.

## 1. Visual Theme & Atmosphere

- **Mood**: cathedral-minimal, premium, inevitable. Quiet authority. Nothing extra.
- **Density**: sparse. Target <30% pixel coverage on any given slide. The empty canvas is the composition.
- **Philosophy**: "Show one thing at a time. Make it large. Make it alone. Let the white around it do the work."
- **Hallmarks**: extreme whitespace, cathedral-scale typography, monochrome discipline, product-on-white restraint.

## 2. Color Palette & Roles

This theme is explicitly **monochrome by policy**. There is no chromatic accent because Apple's brand discipline refuses one on keynote surfaces — emphasis comes from weight, scale, and whitespace, not hue. `--accent` therefore equals `--fg` (near-black `#1D1D1F`), which collapses chromatic decoration into the neutral system. The only permitted tonal variation is a subtle off-white surface (`#F5F5F7`) used on act dividers as an atmospheric shift.

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#FFFFFF` | Primary slide surface (pure white) |
| Background (inverse) | `--bg-inv` | `#000000` | Hero — the blackout moment |
| Foreground | `--fg` | `#1D1D1F` | Primary text (Apple's true text color, never pure black) |
| Foreground (inverse) | `--fg-inv` | `#F5F5F7` | Text on black (Apple's off-white, never pure) |
| Muted | `--muted` | `#86868B` | Secondary copy, captions, meta |
| Rule | `--rule` | `#D2D2D7` | Hairlines (Apple's divider gray) |
| Accent | `--accent` | `#1D1D1F` | Emphasis token — identical to `--fg` by design |
| Accent-ink | `--accent-ink` | `#FFFFFF` | Text on accent |

**Rule**: the theme exposes ONE accent token for API parity with other themes, but accent is achromatic. It must NEVER be swapped to a chromatic value. Accent appears on at most 2 slides per 10 — always as a weight-and-scale move, never as a color move.

**Secondary surface**: `#F5F5F7` (Apple's product-page off-white) appears only on `section.divider` to mark act breaks tonally without introducing color.

## 3. Typography Rules

- **Family (body + display)**: Pretendard Variable (Korean-first), falling back to SF Pro Text / SF Pro Display / system-ui for Latin fragments
- **Mono**: JetBrains Mono with SF Mono fallback
- **Scale**: pushed to the higher end — display reaches `clamp(140px, 12vw, 240px)` on the hero to hit the cathedral feel
- **Display weight**: 600 (Apple prefers semibold at scale over ultra-bold)
- **Headline weight**: 600, letter-spacing −0.03em
- **Body weight**: 400, line-height 1.7 (Korean floor)
- **Overline**: 15–18px, letter-spacing 0.06em, uppercase, weight 500, `--muted`
- **No second typeface**. The tension is scale contrast, not family contrast.

Font stack:
```css
--font-body: 'Pretendard Variable', 'Pretendard', -apple-system,
             BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display',
             'Apple SD Gothic Neo', 'Helvetica Neue', Helvetica, sans-serif;
--font-display: 'Pretendard Variable', 'Pretendard', -apple-system,
                BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
--font-mono: 'JetBrains Mono', 'D2Coding', 'SF Mono', ui-monospace, monospace;
```

## 4. Component Styling

- **Code blocks**: soft `#F5F5F7` surface, 12px radius (the ONLY radius permitted — this mirrors Apple's product-page code cards)
- **Tables**: horizontal hairlines only in `--rule`; header row gets a 1.5px `--fg` rule; tabular-nums enabled
- **Images**: no border, no shadow, no rounded corners, no caption chrome. Product photography sits directly on white.
- **Pull quotes**: no hanging quote marks; weight 500 at display scale; flush-left; attribution on hairline
- **Pagination**: whisper-quiet caption in `--muted`, bottom-right, 3rem from edge
- **Links**: color `--fg`; 1px underline in `--rule` (not currentColor — the underline must be softer than the text)

## 5. Layout Principles

- **Grid**: 12-column conceptual grid with 7rem outer padding (generous — this is the whitespace move)
- **Safe area**: 6rem padding all sides, 7–9rem on monumental/quote layouts
- **Alignment**: flush-left is default. Center only for hero. Monumental is flush-left despite the Apple-keynote convention of centering — flush-left reads more deliberate on a 16:9 export.
- **Rhythm**: alternate sparse and sparse. There are no dense slides in this theme. If a slide needs to carry more than one idea, split it across two slides.
- **Negative space is the design**. Target <30% pixel coverage. If a slide looks empty, it is correct.

## 6. Depth & Elevation

None. No shadows, no gradients, no blurs, no elevation. The ONLY radius in the theme is the 12px on code blocks (structural, not decorative). Everything else is flat. Depth comes from the hero's `--bg-inv` blackout and the divider's `--surface-soft` — tonal shifts, not Z-axis.

## 7. Do's and Don'ts

### Do
- Use whitespace aggressively. Empty slides look right.
- One idea per slide. If two, split into two slides.
- Push display type to the upper clamp bound on the hero.
- Flush-left everything except hero.
- Keep tables minimal — horizontal rules only.
- Let Korean breathe — line-height 1.7 is the floor, not the ceiling.

### Don't
- **NEVER introduce accent color.** The absence of color IS the brand. If the composer reaches for a hue to signal emphasis, it is wrong — reach for weight, scale, or whitespace instead.
- Don't add drop shadows, inner glows, blur, or gradient fills.
- Don't use icons or emojis. Apple keynote slides are typographic, not iconographic.
- Don't center body text. Only the hero centers its h1 vertically.
- Don't add chrome (headers, page numbers, logos) on hero or divider slides.
- Don't uppercase Korean text — Hangul has no case.
- Don't italicize Korean — handled by `:lang(ko) em { font-style: normal; }`.
- Don't pack more than one metric per metric slide. One number, one label, one caption.

## 8. Responsive Behavior

Marp targets 1920×1080 by default. The theme uses `clamp()` for typography so 1280×720 exports still hold their proportions. No mobile behavior — slides are slides. On the hero, display type is pinned to a higher max (240px) because the cathedral-minimal mood collapses if the type is too small on the 1920 canvas.

## 9. Agent Prompt Guide (quick reference)

When asked to generate a slide in Apple:
- Background `#FFFFFF`, text `#1D1D1F`. Hero flips to `#000000` + `#F5F5F7`.
- **No chromatic accent ever.** Emphasis is weight/scale/whitespace.
- Single font: Pretendard Variable (Korean) with SF Pro fallback for Latin fragments.
- No shadows, no gradients, no icons, no rounded cards (except 12px code blocks).
- Flush-left. One idea per slide. <30% pixel coverage.
- Hero display: 140–240px, weight 600, line-height 0.94, letter-spacing −0.045em.
- Headline: 56–96px, weight 600, letter-spacing −0.03em.
- Body: 22–26px, weight 400, line-height 1.7.
- If the slide feels empty, stop — it is correct.

---

*This theme is inspired by publicly visible apple brand aesthetics. It is not officially affiliated with or endorsed by apple. For production use representing the brand, consult apple's official guidelines.*
