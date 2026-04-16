# Mixing Languages in One Deck

Real-world decks routinely mix scripts. Technical Korean decks contain English terms. Japanese decks quote English research papers. Chinese product launches use English product names. This guide covers the patterns.

## The default: one font, not several

The cleanest strategy for CJK + Latin mixing is to use a **single font family that covers both scripts well**:

| CJK language | Recommended unified font | Covers |
|---|---|---|
| Korean | **Pretendard Variable** | Hangul + excellent Latin |
| Japanese | **Noto Sans JP** | Kana + Kanji + matched Latin |
| Simplified Chinese | **Noto Sans SC** | Simplified characters + Latin |
| Traditional Chinese | **Noto Sans TC** | Traditional characters + Latin |

All four are SIL OFL and freely distributable.

```css
/* Example: Korean primary, but Inter users want it */
section:lang(ko) {
  font-family: 'Pretendard Variable', sans-serif;
  /* Latin fragments automatically use Pretendard's Latin glyphs */
}
```

This produces visually balanced output — Pretendard's Latin is weighted to match its Hangul. Do NOT mix "Pretendard + Inter" via fallback alone — Pretendard wins for all characters and Inter never loads.

## When you actually need two fonts

Editorial decks often pair a serif display with a sans body. For CJK + Latin pairings where both need distinct typography:

```css
@font-face {
  font-family: 'Editorial Latin';
  src: local('GT Super'), local('Canela'), url('latin-display.woff2');
  unicode-range: U+0000-007F, U+00A0-00FF, U+2000-206F; /* Latin Basic + Extended + Punctuation */
}

section h1 {
  /* Latin characters → Editorial Latin, everything else → Noto Serif KR */
  font-family: 'Editorial Latin', 'Noto Serif KR', serif;
}
```

`unicode-range` constrains the Latin font to Latin ranges, letting browser fallback handle CJK. This is the ONLY correct way to mix.

## Numerals in mixed text

Latin digits (0-9) inside CJK text need tabular figures for aligned columns:

```css
section.metric,
section.data,
section table,
section .metric-value {
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

For running body text, proportional figures (`pnum`) read better. Reserve `tnum` for data contexts.

## Quotation marks per primary language

The PRIMARY language of a sentence determines the quote style, not the fragment language.

| Sentence primary | Nested Latin quote | Full example |
|---|---|---|
| Korean | `" "` | `스타트업은 "fail fast"를 좌우명으로 한다.` |
| Japanese | `「…」` with inner `"…"` | `「彼は"keep going"と言った」` |
| Chinese (Simplified) | `"…"` (or `「…」`) | `产品经理说"move fast and break things"。` |
| Chinese (Traditional) | `「…」` | `「他說"don't be evil"」` |
| English | `"…"` with inner `'…'` | `He said, "the 'long tail' matters."` |

## Italicization

| Primary script | Italic rule |
|---|---|
| Korean (Hangul) | Native: never. Latin fragments: OK. |
| Japanese (Kana/Kanji) | Native: never. Latin fragments: OK. |
| Chinese (Hanzi) | Native: never. Latin fragments: OK. |
| Latin | Native: yes. |

CSS implementation (applies to all CJK):

```css
section em { font-style: italic; }
section:lang(ko) em,
section:lang(ja) em,
section:lang(zh-Hans) em,
section:lang(zh-Hant) em {
  font-style: normal;
  font-weight: 500;
}
```

When a Latin fragment inside CJK body text needs italics, wrap it explicitly:

```markdown
우리는 *fail fast*를 모토로 한다.   <!-- italic applies to 'fail fast' only -->
```

Because the surrounding `section` is `lang(ko)`, the `em` override kicks in and Korean stays upright. But the explicit `*…*` markdown around the Latin fragment still italicizes in many Marp setups — verify per theme.

## UPPERCASE handling

CJK has no case. Never apply `text-transform: uppercase` globally on elements containing CJK.

```css
/* WRONG — uppercases Latin fragments in CJK lines, creating a visual seam */
section { text-transform: uppercase; }

/* RIGHT — reserve uppercase for Latin-only labels */
section .overline { text-transform: uppercase; letter-spacing: 0.08em; }
```

## Mixed-script spacing

CJK text does NOT need spaces around inline Latin/numbers (`API v2` is fine). However, slight kerning helps:

```css
section:lang(ko) .en,
section:lang(ja) .en,
section:lang(zh-Hans) .en,
section:lang(zh-Hant) .en {
  letter-spacing: 0.02em;
  padding: 0 0.15em;
  font-feature-settings: "tnum" 1;
}
```

In markdown, wrap pure-Latin fragments when the difference matters visually:

```html
API<span class="en">v2.3</span> 출시
```

Most of the time you can skip this — only apply when QA flags a kerning oddity.

## Per-slide language switching

Marp supports per-slide language directives:

```markdown
<!-- _lang: ja -->

<!-- This slide is in Japanese even if the deck default is Korean -->

# 新しい始まり
```

Useful for bilingual keynotes. The typography and quotation mark rules auto-swap per slide via `:lang()` selectors.

## Recommendation summary

- **Default**: use one CJK family that includes Latin glyphs (Pretendard, Noto Sans JP, etc.)
- **Mix via `unicode-range`** when editorial distinction is genuinely required
- **Enable tabular figures** on all data contexts, regardless of language
- **Keep native-script italic off** globally via `:lang()` rule
- **Reserve UPPERCASE** for Latin-only labels
- **Declare `lang:` in front matter** — the single most important action for multilingual decks
