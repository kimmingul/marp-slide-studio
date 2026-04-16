# CJK Typography Scale (Korean · Japanese · Chinese)

Korean (Hangul), Japanese (Kana + Kanji), and Simplified/Traditional Chinese share more typographic needs than any of them share with Latin. This document unifies their rules for slide projection; language-specific notes appear where they actually diverge.

## The shared problem

CJK glyphs are square and block-like. They stack vertically denser than Latin ascenders/descenders. A line-height of 1.5 that reads cleanly in English produces wall-of-text density in Korean, Japanese, or Chinese.

The shared fix: **raise body line-height to 1.65–1.75, floor body size at 22px on 1920-wide slides**.

## Font stacks

Declare the deck's language in front matter so fonts cascade correctly:

```yaml
---
marp: true
theme: obsidian-mono
lang: ko    # or: ja, zh-Hans, zh-Hant, en
---
```

Marp emits `<html lang="…">`, and themes key their font stacks off `:lang()` selectors.

### Korean (`lang: ko`)

Primary: **Pretendard Variable** — the de facto standard for modern Korean UI. Covers Hangul + Latin with matched weights. SIL OFL.

```css
section:lang(ko) {
  font-family: 'Pretendard Variable', 'Pretendard',
               -apple-system, BlinkMacSystemFont,
               'Apple SD Gothic Neo', sans-serif;
}
```

Display variants for editorial themes: **Noto Serif KR** (500/600 weight).

### Japanese (`lang: ja`)

Primary: **Noto Sans JP** — neutral modern sans with full JIS coverage.

Alternatives: Hiragino Sans (macOS), Yu Gothic (Windows 10+), Meiryo (older Windows).

```css
section:lang(ja) {
  font-family: 'Noto Sans JP', 'Hiragino Sans',
               'Hiragino Kaku Gothic ProN', 'Yu Gothic',
               'Meiryo', sans-serif;
}
```

Display variants: **Noto Serif JP** for editorial. **M PLUS 1p** for geometric/technical moods.

### Simplified Chinese (`lang: zh-Hans`)

Primary: **Noto Sans SC** — covers GB18030.

Alternatives: PingFang SC (macOS), Microsoft YaHei (Windows), Source Han Sans SC.

```css
section:lang(zh-Hans) {
  font-family: 'Noto Sans SC', 'PingFang SC',
               'Microsoft YaHei', 'Source Han Sans SC',
               sans-serif;
}
```

Display variants: **Noto Serif SC**.

### Traditional Chinese (`lang: zh-Hant`)

Primary: **Noto Sans TC** — covers Big5.

Alternatives: PingFang TC (macOS), Microsoft JhengHei (Windows).

```css
section:lang(zh-Hant) {
  font-family: 'Noto Sans TC', 'PingFang TC',
               'Microsoft JhengHei', sans-serif;
}
```

## Scale (16:9 at 1920×1080)

| Role | Size | Weight | Line-height (CJK) | Line-height (Latin only) | Letter-spacing |
|---|---|---|---|---|---|
| Display | 160–220px | 800–900 | **0.95** | 0.95 | −0.04em |
| Headline | 56–80px | 700 | **1.15** | 1.1 | −0.02em |
| Subhead | 32–40px | 500 | **1.3** | 1.25 | −0.01em |
| Body L | 28–32px | 400 | **1.65** | 1.55 | 0 |
| Body | 22–26px | 400 | **1.7** | 1.55 | 0 |
| Caption | 16–18px | 400 | **1.55** | 1.5 | +0.01em |
| Overline | 12–14px | 500 | 1.2 | 1.2 | +0.08em (UPPERCASE) |

CJK bodies need +10–20% vertical leading compared to Latin.

**Size floor**: body text MUST be ≥ 22px on 1920-wide slides. 24–26px is the sweet spot for projector distance.

## Language-specific hard rules

### 1. Do not italicize native CJK script

Synthesized slant on Hangul, Kana, or Kanji is almost always broken. Italic is for Latin fragments only.

```css
section em { font-style: italic; }
section:lang(ko) em,
section:lang(ja) em,
section:lang(zh-Hans) em,
section:lang(zh-Hant) em {
  font-style: normal;
  font-weight: 500;  /* emphasis via weight instead */
}
```

### 2. Do not apply `text-transform: uppercase` globally

- **Korean**: Hangul has no case. The rule silently uppercases only the Latin fragments, creating a jarring seam.
- **Japanese**: Kanji/Kana have no case. Same issue with mixed-Latin content.
- **Chinese**: same as Japanese.

Reserve UPPERCASE for Latin-only labels (overlines, category tags, ≤3 words).

### 3. Quotation marks

| Primary language | Primary quote | Secondary | Emphasis |
|---|---|---|---|
| Korean | `" "` or `「 」` | `『 』` | Native: no italic; use 500 weight |
| Japanese | `「 」` | `『 』` | Emphasis dots (`﹅` or `﹆`) above/beside each character |
| Chinese (Simplified) | `" "` or `「 」` | `『 』` | Emphasis dots (`·` below each character) |
| Chinese (Traditional) | `「 」` | `『 』` | Same as Simplified |
| Latin in CJK sentence | `" "` | `' '` | Italic OK for Latin fragments |

### 4. Numerals

CJK rendering of Latin numerals (0-9) varies widely by font. **Always force tabular figures** on data-heavy slides:

```css
section.metric, section.data, section table {
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

Consider proportional figures (`pnum`) in running body text, tabular for numerical alignment.

### 5. Vertical writing

All three CJK writing systems traditionally support vertical orientation:
- **Korean**: 세로쓰기
- **Japanese**: 縦書き
- **Chinese**: 竖排

Slide layouts supporting this live in `assets/layouts/vertical-writing.md`. Use only for editorial/reverent contexts — modern tech decks in CJK stay horizontal.

### 6. Ruby annotation (phonetic overlay)

Each language uses it differently but the HTML is the same:
- **Korean**: Hanja above Hangul (legal/academic terms)
- **Japanese**: Furigana (Hiragana) above Kanji
- **Chinese**: Pinyin above characters (pedagogical)

See `assets/layouts/ruby-annotation.md` for the slide treatment. Uses native `<ruby>` elements — no JS required.

## Mixed script handling

Real decks frequently mix CJK + Latin. The default strategy:

1. **Prefer a single font family that covers both** — Pretendard covers KR+Latin beautifully; Noto Sans JP/SC/TC include matched Latin weights.
2. **Never mix via fallback alone** — if you set `font-family: 'Pretendard', 'Inter'`, browsers use Pretendard for everything and Inter never appears. If you genuinely want Inter's Latin, use `unicode-range` (see `assets/typography/mixed-language.md`).
3. **Keep numerals tabular** — Latin digits inside CJK text need explicit `"tnum"` to stay aligned in columns.
4. **Don't uppercase mixed lines** — it only uppercases the Latin half.

## Quick reference: CSS variables for any CJK theme

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap');

:root {
  --font-body-ko: 'Pretendard Variable', sans-serif;
  --font-body-ja: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
  --font-body-zh-hans: 'Noto Sans SC', 'PingFang SC', sans-serif;
  --font-body-zh-hant: 'Noto Sans TC', 'PingFang TC', sans-serif;
  --font-body-latin: 'Inter', -apple-system, sans-serif;

  /* Default: Latin spacing */
  --lh-body: 1.55;
  --lh-headline: 1.1;
}

/* CJK gets denser leading */
section:lang(ko), section:lang(ja),
section:lang(zh-Hans), section:lang(zh-Hant) {
  --lh-body: 1.7;
  --lh-headline: 1.15;
}

/* Per-language font families */
section:lang(ko) { font-family: var(--font-body-ko); }
section:lang(ja) { font-family: var(--font-body-ja); }
section:lang(zh-Hans) { font-family: var(--font-body-zh-hans); }
section:lang(zh-Hant) { font-family: var(--font-body-zh-hant); }

/* Italic override for native script */
section:lang(ko) em, section:lang(ja) em,
section:lang(zh-Hans) em, section:lang(zh-Hant) em {
  font-style: normal;
  font-weight: 500;
}
```

This block is the contract every multi-language CJK theme in this plugin must fulfill.
