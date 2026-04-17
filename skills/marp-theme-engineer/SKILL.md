---
name: marp-theme-engineer
description: Use when writing or modifying Marpit theme CSS, creating a new @theme, customizing design tokens, debugging Marp styling issues, or when the user mentions "Marp 테마 CSS", "Marpit 테마", "@theme", "slide CSS", "커스텀 테마 만들기". Provides authoritative knowledge on Marpit's theming system, section selectors, directives, and the project's design-system format.
---

# Marpit Theme Engineer

Deep reference for writing Marpit CSS themes compatible with this plugin's layout catalog. Use this when authoring a brand-new theme or diagnosing styling issues.

## Marpit fundamentals

### @theme declaration

Every theme CSS file MUST begin with a Marpit comment declaring the theme name:

```css
/* @theme obsidian-mono */
```

- Name is kebab-case, must match what `deck.md` front matter references (`theme: obsidian-mono`).
- Only one `@theme` per file.

### Optional metadata

```css
/* @theme example */
/* @size 16:9 1920px 1080px */
/* @auto-scaling true */
```

Our themes target 16:9 exclusively; 4:3 support is explicitly out of scope.

## The `section` selector

Each Marp slide renders as a `<section>` element. All theme styling targets `section` or its children.

```css
/* All slides */
section {
  background: var(--bg);
  color: var(--fg);
}

/* Specific layout class */
section.hero { ... }
section.monumental { ... }
```

Class directives in markdown:
```markdown
<!-- _class: hero -->       ← applies to THIS slide only
<!-- class: hero -->        ← applies from here onward
```

Always use `_class` for single-slide styling. `class` (global) should only appear on the first slide if the entire deck uses one layout (rare).

## Directives reference

Place in HTML comments at slide top:

| Directive | Example | Scope |
|---|---|---|
| `_class` | `<!-- _class: hero -->` | this slide |
| `_backgroundColor` | `<!-- _backgroundColor: #000 -->` | this slide |
| `_color` | `<!-- _color: #fff -->` | this slide |
| `_paginate` | `<!-- _paginate: false -->` | this slide |
| `_header` | `<!-- _header: "" -->` | this slide |
| `_footer` | `<!-- _footer: © 2026 -->` | this slide |

For multi-slide application, drop the leading underscore:
```markdown
<!-- theme: obsidian-mono -->
<!-- paginate: true -->
```

Front matter equivalents (cleaner for deck-wide settings):
```yaml
---
marp: true
theme: obsidian-mono
paginate: true
---
```

## Design token pattern

All our themes declare tokens in `:root`. This lets the theme-curator swap tokens without touching layout rules.

### Required tokens (all themes MUST declare)

```css
:root {
  /* Colors */
  --bg: ...;
  --bg-inv: ...;
  --fg: ...;
  --fg-inv: ...;
  --muted: ...;
  --rule: ...;
  --accent: ...;
  --accent-ink: ...;

  /* Fonts */
  --font-body: ...;
  --font-display: ...;    /* same as body if single-font theme */
  --font-mono: ...;

  /* Scale (use clamp for responsive) */
  --fs-display: clamp(...);
  --fs-headline: clamp(...);
  --fs-subhead: clamp(...);
  --fs-body-l: clamp(...);
  --fs-body: clamp(...);
  --fs-caption: clamp(...);

  /* Line heights */
  --lh-display: ...;
  --lh-headline: ...;
  --lh-body: ...;

  /* Letter spacing */
  --ls-display: ...;
  --ls-headline: ...;
  --ls-overline: ...;
}
```

### Required layout classes (all themes MUST implement)

- `section.hero`
- `section.monumental`
- `section.split`, `section.split-60-40`, `section.split-55-45`, `section.split-40-60`
- `section.metric`
- `section.divider`
- `section.quote`
- `section.enumerated`

Missing any of these means the composer may emit a `_class: quote` that renders as the default layout — always broken. Validate by ensuring every layout file in `assets/layouts/` has a corresponding section rule.

## CJK-first considerations (Korean · Japanese · Chinese)

- Always set `line-height` on `section` (base) at 1.7 or more for Korean body.
- Never use `text-transform: uppercase` globally — Hangul has no case.
- Always include Pretendard via CDN `@import` at the top; fall back gracefully to system fonts.
- Numbers: set `font-variant-numeric: tabular-nums` on any element with data.

## Font loading strategy

CDN imports at the top of the CSS are the default (zero-config). Tradeoff: requires internet during render; fonts don't work offline.

For offline/team distribution, replace with `@font-face` declarations pointing to local files. Add fonts to `assets/fonts/` and reference:

```css
@font-face {
  font-family: 'Pretendard Variable';
  src: url('fonts/PretendardVariable.woff2') format('woff2-variations');
  font-weight: 45 920;
  font-display: block;
}
```

This is a future enhancement, not required for MVP.

## Common pitfalls

### 1. HTML inside markdown not rendering
Marp core by default strips HTML for safety. To use `<div class="...">` blocks, enable in front matter:
```yaml
---
marp: true
html: true      # or a safelist: html: { div: ['class'], span: ['class'] }
---
```
The plugin defaults to allowing common markup. Verify at render time.

### 2. CSS imports failing in PDF export
Marp's PDF export bundles a headless Chrome. `@import` works but requires `--allow-local-files` (our scripts set this). External CDN imports need internet.

### 3. `<section>` padding vs slide size
Marp's default slide size is `1280×720`. The `padding` you set on `section` eats from that. If content overflows, increase slide size (front matter `size: 16:9` defaults to 1280×720 for 16:9; explicit `/* @size 16:9 1920px 1080px */` in CSS gives more room).

### 4. Pagination overlap
Marp's built-in paginator is positioned bottom-right. If your layout has a bottom-right element, the page number overlaps. Disable per-slide with `<!-- _paginate: false -->` or suppress with `section::after { display: none }` on that class.

### 5. Theme not loading
If `theme: my-theme` in front matter doesn't match the `@theme` comment in the CSS, Marp silently falls back to default. Always verify the match.

## How to build a new theme

1. Copy an existing theme CSS as the starting point (cp obsidian-mono.marp.css my-theme.marp.css).
2. Rename `@theme` line.
3. Redefine tokens in `:root` (colors + fonts + scale).
4. Verify all required layout classes still exist. If you want a different visual treatment per layout, override inside the copied file.
5. Write the matching `DESIGN.md` in the same directory explaining the theme's philosophy.
6. Test by creating a sample deck with one slide of each layout and running render.sh.

## Self-check before shipping a theme

- [ ] `@theme` comment matches filename
- [ ] All required tokens declared in `:root`
- [ ] All 7 required layout classes styled
- [ ] Korean body line-height ≥ 1.65
- [ ] No `text-transform: uppercase` on elements containing Hangul
- [ ] Accent color used in ≤ 3 distinct rules (otherwise it stops being an accent)
- [ ] Pagination `section::after` styled (or explicitly disabled per layout)
- [ ] DESIGN.md written and committed alongside CSS
