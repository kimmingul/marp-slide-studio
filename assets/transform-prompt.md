# Web → Slide Transform Specification

This is the authoritative prompt specification for converting a web-oriented design system (tokens, components, states) into a Marp slide theme. Read this before generating ANY theme CSS. Follow it literally.

## Inputs

1. **Brand metadata** — one entry from `assets/design-systems/registry.json` containing:
   - `name`, `category`, `suggested_track`
   - `mood` (short phrase)
   - `signature.palette` (3–5 hex values)
   - `signature.accent_behavior` (how the brand uses color)
   - `signature.typography_direction` (font families)
   - `signature.density` (sparse / moderate / dense)
   - `signature.hallmarks` (3–5 distinctive visual moves)
2. **Korean typography rules** — loaded from `assets/typography/korean-scale.md`
3. **Required layout classes** — the 7 in `assets/layouts/README.md`

## Outputs (MUST produce both)

- `<brand>.design.md` — the 9-section slide design document
- `<brand>.marp.css` — the Marpit theme CSS starting with `/* @theme <brand> */`

## Transformation rules

### Rule 1 — Strip the web-only

Remove entirely from the source (or ignore from your internal brand knowledge):
- Button variants (primary/secondary/ghost/destructive)
- Interactive states (hover, focus, active, disabled, loading)
- Form controls (input, textarea, select, toggle, checkbox, radio)
- Responsive breakpoints (mobile/tablet/desktop)
- Z-index stacking, dropdown menus, modals, tooltips
- Icons and icon libraries (slides use type, not icons — see anti-pattern #12)
- Border radius on anything that isn't a photo crop (slides have no cards)
- Shadows, elevation, blur (anti-pattern #7)

These produce zero value in a slide context.

### Rule 2 — Collapse color semantics

Web design systems have 10–20 color roles (primary, secondary, success, warning, info, muted, neutral, inverse, …). Slides need exactly these 8:

```
--bg          primary background
--bg-inv      inverse background (hero, divider, monumental)
--fg          primary text
--fg-inv      text on inverse
--muted       captions, meta
--rule        hairlines
--accent      THE single accent (used sparingly)
--accent-ink  text on accent
```

How to collapse:
- The brand's strongest signature color → `--accent`
- The brand's most prominent light (or dark) surface → `--bg`
- Foreground text color on `--bg` → `--fg`
- Inverse (the brand's "dark mode" base or black/near-black) → `--bg-inv`
- If the brand has multiple signature colors (e.g., Figma's multi-color), pick the ONE most recognizable and note the rest in the DESIGN.md prose but do not put them in tokens. Scarcity makes accent powerful.

### Rule 3 — Multi-language typography injection

Every generated theme MUST:
- Import `assets/theme-foundation.css` at the top via `@import url('../../theme-foundation.css');`
  - This provides Pretendard + Noto Sans JP/SC/TC + Inter CDN imports
  - Provides `:lang()` cascades for line-height, font family, italic discipline across KR/JA/ZH-Hans/ZH-Hant/Latin
- Set `--font-body: var(--font-body-ko)` (or `ja`, `zh-hans`, `zh-hant`, `latin` per theme's primary language) — themes declare their AUTHORED language; `:lang()` in the foundation swaps fonts for other languages
- Set `--lh-body: 1.7` or higher for CJK-primary themes; `1.55` for Latin-primary themes
- Set body `font-size` floor at clamp(22px, …, 26px) for CJK; clamp(20px, …, 24px) for Latin
- Never apply `text-transform: uppercase` on plain `section` selector (breaks CJK)
- The foundation automatically handles italic overrides via `:lang(ko) em`, `:lang(ja) em`, etc.

Mapping for brand fonts:

| Source brand uses | Slide theme uses |
|---|---|
| Inter, Geist, SF Pro, Söhne | `var(--font-body) = 'Pretendard Variable', '<brand font>', sans-serif` |
| Serif (Canela, Tiempos, Söhne Breit) | `var(--font-display) = 'Noto Serif KR', '<brand serif>', serif` |
| Monospace brand (IBM Plex Mono) | `var(--font-mono) = 'JetBrains Mono', '<brand mono>', monospace` |
| Custom display (WIRED, NYT) | Approximate via weight/letter-spacing on Pretendard; document in DESIGN.md |

### Rule 4 — Rescale the type system

Web type scales start around 16px body. Slide type scales start at 22px body. Map:

| Web (approx.) | Slide token | clamp value |
|---|---|---|
| 12px caption | `--fs-caption` | `clamp(14px, 0.9vw, 16px)` |
| 14–16px body | `--fs-body` | `clamp(22px, 1.5vw, 26px)` |
| 18–20px lede | `--fs-body-l` | `clamp(26px, 1.8vw, 32px)` |
| 24–28px subhead | `--fs-subhead` | `clamp(28px, 2.2vw, 40px)` |
| 40–48px h1 | `--fs-headline` | `clamp(48px, 4.5vw, 80px)` |
| 72–96px display hero | `--fs-display` | `clamp(120px, 10vw, 220px)` |

Adjust the MAX end of clamp to match brand density:
- `sparse` (Apple, Linear) → higher max (larger display)
- `dense` (Stripe data, Sentry) → lower max

### Rule 5 — Layout classes are mandatory

Every generated theme MUST style these 7 section classes. Omitting any produces a broken deck:

- `section.hero` — full-bleed, inverse colors, grid-based
- `section.monumental` — large single statement, flush-left
- `section.split`, `.split-60-40`, `.split-55-45`, `.split-40-60` — asymmetric two-column
- `section.metric` — dominant number + label + caption
- `section.divider` — act transition with number + title
- `section.quote` — testimonial with attribution
- `section.enumerated` — 3-item numbered list with hairline rules

Use the exact structure from the corresponding file in `assets/layouts/<name>.md` as the template; adapt only the colors/typography per brand signature. Do NOT invent new layouts in a generated theme.

### Rule 6 — Preserve the brand's voice in prose, not chrome

The 9 sections of `DESIGN.md` are where the brand's philosophy lives:

1. **Visual Theme & Atmosphere** — copy the source mood/philosophy if available; otherwise synthesize from `signature.hallmarks`
2. **Color Palette & Roles** — table of the 8 slide tokens with brand-derived hex values
3. **Typography Rules** — scale, families, with Korean rules prepended
4. **Component Styling** — slide-context only (pull-quote, table, image, pagination)
5. **Layout Principles** — how the brand uses grid, alignment, whitespace
6. **Depth & Elevation** — usually "none" for slides
7. **Do's and Don'ts** — copy brand Do's/Don'ts; ADD slide anti-patterns
8. **Responsive Behavior** — always "16:9 native, clamp() for downscale"
9. **Agent Prompt Guide** — 1-paragraph quick reference for future composer runs

### Rule 7 — Accent usage discipline

In the generated DESIGN.md, explicitly state: "accent appears on at most N slides per 10" where N is:
- `sparse` density → N = 2
- `moderate` density → N = 3
- `dense` density → N = 4

This prevents the composer from splattering accent color across every slide.

### Rule 8 — Attribution and disclaimer

Every generated `.design.md` MUST contain this footer verbatim:

```markdown
---

*This theme is inspired by publicly visible <brand> brand aesthetics. It is not officially affiliated with or endorsed by <brand>. For production use representing the brand, consult <brand>'s official guidelines.*
```

Every generated `.marp.css` MUST start with:

```css
/* @theme <brand-slug> */
/* Generated by marp-slide-studio theme-forger. Inspired by <brand>. Not affiliated. */
```

### Rule 9 — Validate before returning

After generation, the orchestrator runs `scripts/validate-theme.mjs`. The generated CSS MUST pass:
- `@theme <brand-slug>` declared on first 3 lines
- All 8 `:root` color tokens present
- All 3 `--font-*` tokens present
- All 6 `--fs-*` scale tokens present
- All 3 `--lh-*` line-height tokens present
- `--lh-body >= 1.6`
- 7 layout classes present: `section.hero`, `section.monumental`, `section.split`, `section.metric`, `section.divider`, `section.quote`, `section.enumerated`
- No global `text-transform: uppercase` on plain `section` selector
- At least one font CDN `@import` OR local `@font-face` for Pretendard

If validation fails, the forger must regenerate up to 2 retries.

## Style of the generated CSS

- Token declarations in `:root` at top
- Layout selectors organized by section divider comment (`/* ── Layout: hero ── */`)
- Use CSS custom properties for ALL color and size values — never hardcode
- Indent 2 spaces, no trailing semicolons omitted
- No `!important` anywhere
- No vendor prefixes (Chrome-only rendering context)

## Anti-leakage: avoid these patterns when generating

- Do NOT copy brand marketing copy verbatim into DESIGN.md.
- Do NOT use trademarked logo/wordmark fonts if they're proprietary (most are). Fall back to Pretendard + note in DESIGN.md.
- Do NOT claim the theme is "official" or "by <brand>". Always "inspired by".
- Do NOT embed brand photography or proprietary imagery.

## Worked example (mental model only — not a full generation)

**Input**: registry entry for Stripe — palette `[#635BFF, #0A2540, #FFFFFF]`, density `sparse`, hallmarks `["large-type hero", "duotone gradients", "tabular data"]`.

**Token mapping**:
```
--bg: #FFFFFF
--bg-inv: #0A2540
--fg: #0A2540
--fg-inv: #FFFFFF
--muted: #425466
--rule: #E6E8EB
--accent: #635BFF
--accent-ink: #FFFFFF
```

**Font stack**:
```
--font-body: 'Pretendard Variable', 'Inter', sans-serif
--font-display: 'Pretendard Variable', 'Inter', sans-serif
--font-mono: 'JetBrains Mono', monospace
```

**Accent policy**: sparse → 2 slides per 10. Used on hero overline, one metric value, one footer rule.

**Layout-specific moves**: hero uses the navy `--bg-inv` (Stripe's signature dark surface); metric uses purple accent on the dominant numeral.

This is what the forger produces — a slide theme that carries Stripe's voice without being a web clone.
