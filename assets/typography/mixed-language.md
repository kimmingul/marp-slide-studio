# Mixed Korean–English Typography Rules

Most real-world Korean slides contain English technical terms ("API", "latency", product names). Handle the seam deliberately.

## Principle: one font, not two

Pretendard Variable covers both Hangul and Latin beautifully. **Default to Pretendard for everything.** Do not mix fonts unless you have a specific editorial reason.

```css
/* Correct */
section { font-family: 'Pretendard Variable', sans-serif; }

/* Avoid unless intentional */
section { font-family: 'Pretendard Variable', 'Inter', sans-serif; }
```

When the Latin glyph defaults to Inter via font fallback, the Hangul looks fine but Latin looks lighter — creating visual imbalance. Pretendard's Latin is tuned to match its Hangul weight.

## When you MUST use two fonts

Editorial looks sometimes benefit from a serif headline font that doesn't have Hangul coverage. In that case:

```css
/* unicode-range ensures Latin chars use Editorial New,
   Korean chars fall through to Pretendard */
@font-face {
  font-family: 'Editorial New';
  src: url('editorial-new.woff2') format('woff2');
  unicode-range: U+0000-007F, U+0080-00FF;
}

section h1 {
  font-family: 'Editorial New', 'Pretendard Variable', serif;
}
```

This is the ONLY correct way to mix. Do not rely on browser fallback order alone — always constrain the Latin font to Latin Unicode ranges.

## Numerals

Numbers in Korean slides almost always read as Latin. Use tabular figures on any slide with data:

```css
section.data, section.metric {
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

## Punctuation

| Context | Use |
|---|---|
| Korean sentence, Korean quote | `「 」` (primary), `『 』` (secondary) |
| Korean sentence, Latin quote (e.g., quoting English) | `“ ”` |
| All-Latin sentence | `“ ”` / `‘ ’` |
| Korean ellipsis | `…` (U+2026), not three dots |
| Korean em-dash | `—` (U+2014) with spaces, or `―` for emphasis |

## Spacing around Latin fragments in Korean

Korean does NOT need spaces around inline Latin/numbers, but slight letter-spacing can help:

```css
/* Tighten Korean, gently space Latin inside Korean */
section { letter-spacing: -0.01em; }
section .en { letter-spacing: 0.01em; padding: 0 0.1em; }
```

In markdown, wrap pure-English fragments in a span when the difference matters:
```html
API<span class="en">v2</span> 출시
```
(For most slides you can skip this — only apply when the kerning looks off in QA.)

## Never italicize Hangul

Hangul italic = synthesized slant = usually broken. Italic is for Latin fragments only:

```css
em { font-style: italic; }  /* OK for English */

/* Override in Korean content */
:lang(ko) em { font-style: normal; font-weight: 500; }
```

## Capitalization in mixed lines

Korean has no case. When a heading mixes Korean and English, do NOT uppercase the whole line:

```
/* WRONG */
PRETENDARD로 더 좋은 슬라이드를

/* RIGHT */
Pretendard로 더 좋은 슬라이드를
```

Reserve UPPERCASE for very short Latin-only labels (overlines, category tags, ≤3 words).
