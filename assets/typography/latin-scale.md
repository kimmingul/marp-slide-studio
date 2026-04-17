# Latin Typography Scale (English and other Latin-script decks)

Pure-Latin decks benefit from different defaults than CJK-first decks. This document captures the English/Latin-script calibration.

## When to use this scale

Declare the deck in front matter:

```yaml
---
marp: true
theme: obsidian-mono
lang: en
---
```

Themes detect `:lang(en)` / `:lang(es)` / `:lang(fr)` / etc. and apply Latin typography rules. Without an explicit `lang:`, themes default to their authored locale — usually `ko` for CJK-rooted themes, which works OK for Latin but isn't optimal.

## Font stacks

### Primary body

**Inter** — modern neutral sans, exceptional hinting at slide scale.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=block');

section:lang(en) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

Alternatives by mood:
- **Geist** — Vercel's refined system, geometric and contemporary
- **Söhne** — editorial, warmer (licensed)
- **Neue Haas Grotesk / Helvetica** — corporate, classic
- **Pretendard** — Korean-origin but has excellent Latin

### Display

- **Editorial**: Playfair Display, Lyon Text, GT Super, Canela
- **Technical**: Inter 800, Geist 800
- **Bold-magazine**: Inter Tight 900, Anton, Oswald

### Monospace

- **JetBrains Mono**, **Geist Mono**, **IBM Plex Mono**, **Fira Code**

## Scale (16:9 at 1920×1080)

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Display | 140–200px | 800–900 | 0.95 | −0.04em |
| Headline | 48–72px | 700 | **1.1** | −0.02em |
| Subhead | 28–36px | 500 | **1.25** | −0.01em |
| Body L | 24–28px | 400 | **1.55** | 0 |
| Body | 20–24px | 400 | **1.55** | 0 |
| Caption | 14–16px | 400 | 1.5 | +0.01em |
| Overline | 11–13px | 500 | 1.2 | +0.1em, UPPERCASE |

**Size floor**: body text MUST be ≥ 20px on 1920-wide slides. Latin is narrower vertically than CJK, so 20px is acceptable. 22–24px is the sweet spot.

## What's different from CJK

| Property | Latin | CJK |
|---|---|---|
| Body line-height | **1.5–1.6** | 1.65–1.75 |
| Headline line-height | **1.05–1.15** | 1.15–1.25 |
| Body size floor | **20px** | 22px |
| Italic native text | **OK and expected** | Never |
| Uppercase native text | OK for short labels | Never on CJK glyphs |
| Ligatures | Beneficial (`liga`, `calt`) | N/A |

## Latin-specific considerations

### 1. Enable common ligatures

```css
section:lang(en) {
  font-feature-settings: "liga" 1, "calt" 1, "kern" 1;
}
```

### 2. Hyphenation on long text slides

```css
section:lang(en) p {
  hyphens: auto;
  hyphenate-limit-chars: 6 3 3;
}
```

Use sparingly — slide text is usually short enough that hyphens create more distraction than value.

### 3. Old-style figures (editorial themes)

For running body text in editorial themes:

```css
section:lang(en).editorial {
  font-feature-settings: "onum" 1, "pnum" 1, "liga" 1;
}
section:lang(en).editorial .metric-value {
  font-feature-settings: "lnum" 1, "tnum" 1;  /* tabular for numbers */
}
```

### 4. Smart quotes

Don't use straight quotes (`"`). Use curly:
- **English**: `"..."` for primary, `'...'` for secondary
- **French**: `«...»` with non-breaking space inside
- **German**: `„..."` (low-opening, high-closing)
- **Spanish/Italian**: `«...»` or `"..."`

Composer skill normalizes quotes based on `lang:` in front matter.

### 5. Small caps for section numbers

```css
section.divider .divider-number {
  font-variant-numeric: oldstyle-nums;
}
section.divider .divider-subtitle {
  font-variant: small-caps;
  letter-spacing: 0.08em;
}
```

## Quick reference CSS for any Latin theme

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=block');

:root {
  --font-body-latin: 'Inter', -apple-system, sans-serif;
}

section:lang(en),
section:lang(es),
section:lang(fr),
section:lang(de),
section:lang(pt),
section:lang(it) {
  font-family: var(--font-body-latin);
  font-feature-settings: "liga" 1, "calt" 1, "kern" 1;
  --lh-body: 1.55;
  --lh-headline: 1.1;
  --ls-headline: -0.02em;
  --fs-body: clamp(20px, 1.4vw, 24px);
}
```

## Mixing Latin and CJK in one deck

Rare, but possible (bilingual keynotes, research collaborations). Strategy:

1. Set the deck's primary language in front matter (`lang: ko` or `lang: en`).
2. For individual slides in the other language, use `<!-- _lang: en -->` directive (Marp supports per-slide lang).
3. Typography rules auto-swap per slide via `:lang()` selectors.
4. Keep fonts consistent within one slide — don't Latin-italic a Korean word or vice versa.
