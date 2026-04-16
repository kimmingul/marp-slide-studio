# Korean-First Typography Scale

Korean (Hangul) is visually denser than Latin. Design scales calibrated for English produce cramped, dark-looking Korean slides. This guide sets opinionated defaults.

## Font stack

### Body (default)
**Pretendard Variable** — the de facto standard for modern Korean UI. Free, SIL OFL.

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

:root {
  --font-body: 'Pretendard Variable', 'Pretendard', -apple-system,
               BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
}
```

### Display / Headline (choose one)

| Font | Mood | License |
|---|---|---|
| **Pretendard Variable (800–900)** | Neutral, modern | OFL |
| **Gmarket Sans** | Geometric, mildly editorial | OFL |
| **Noto Serif KR** | Classical editorial | OFL |
| **SUITE Variable** | Warm, rounded | OFL |
| **Paperlogy** | Brutalist, high-contrast | OFL |

### Monospace (code / data)
**D2Coding** or **JetBrains Mono** (JBM handles Hangul acceptably via fallback).

## Scale (16:9 at 1920×1080)

Korean body needs ~15–20% more size than English at the same readability.

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| **Display** (full-bleed single word) | 160–220px | 800–900 | 0.95 | -0.04em |
| **Headline** (slide title) | 56–80px | 700 | 1.15 | -0.02em |
| **Subhead** | 32–40px | 500 | 1.3 | -0.01em |
| **Body L** (featured body) | 28–32px | 400 | 1.65 | 0 |
| **Body** (standard) | 22–26px | 400 | 1.7 | 0 |
| **Caption** | 16–18px | 400 | 1.55 | +0.01em |
| **Overline** (tiny labels) | 12–14px | 500 | 1.2 | +0.08em, UPPERCASE |

### Why these values

- **Line-height 1.65–1.75** for Korean body: Hangul character blocks are square and stack more tightly than Latin ascenders/descenders; without generous leading, paragraphs look like walls.
- **Negative letter-spacing on display/headline**: Korean at large sizes has oversized spacing by default in most digital fonts. Tighten 2–4% for modern editorial feel.
- **Never go below 22px for body on a 1920-wide slide**: projector fall-off + back-of-room distance.

## Mixed Korean–English (한영 혼용)

Common in tech decks. Rules:

1. **Same font family for both languages whenever possible** — Pretendard handles both beautifully. Do NOT mix "Pretendard 한글 + Inter 영문" unless you explicitly want the seam visible.
2. **Numbers go tabular**: enable `font-feature-settings: "tnum";` on any slide with data.
3. **Don't italicize Korean** — italic Hangul is rare and mostly broken. Italicize only the English fragments.
4. **Quotation marks**: Korean uses `「 」` for primary, `『 』` for secondary. Latin uses `“ ”`. Match to the primary language of the sentence.

## Bad defaults to override

```css
/* WRONG — system stack gives inconsistent Hangul rendering */
font-family: -apple-system, sans-serif;

/* WRONG — too tight for Korean body */
line-height: 1.5;

/* WRONG — Korean uppercased looks broken (Hangul has no case) */
text-transform: uppercase; /* OK for Latin-only fragments */
```

## Quick reference: CSS variables

```css
:root {
  /* Fonts */
  --font-body: 'Pretendard Variable', sans-serif;
  --font-display: 'Pretendard Variable', sans-serif;
  --font-mono: 'D2Coding', 'JetBrains Mono', monospace;

  /* Scale */
  --fs-display: clamp(120px, 10vw, 220px);
  --fs-headline: clamp(48px, 4.5vw, 80px);
  --fs-subhead: clamp(28px, 2.2vw, 40px);
  --fs-body-l: clamp(26px, 1.8vw, 32px);
  --fs-body: clamp(22px, 1.5vw, 26px);
  --fs-caption: clamp(15px, 1vw, 18px);

  /* Line heights (Korean-tuned) */
  --lh-display: 0.95;
  --lh-headline: 1.15;
  --lh-body: 1.7;

  /* Letter spacing */
  --ls-display: -0.04em;
  --ls-headline: -0.02em;
  --ls-overline: 0.08em;
}
```

Apply globally:
```css
section {
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
}
section h1 {
  font-family: var(--font-display);
  font-size: var(--fs-headline);
  line-height: var(--lh-headline);
  letter-spacing: var(--ls-headline);
  font-weight: 700;
}
```
