---
name: korean-typography
description: Use when working with Korean text in slides, choosing fonts for Hangul content, mixing Korean and English, setting line-height or letter-spacing for Korean, or when the user mentions "한글 타이포", "Pretendard", "한영 혼용", "한글 줄간격", "한글 자간". Provides opinionated defaults calibrated for 16:9 projected slides.
---

# Korean Typography for Slides

Hangul is not Latin. Typography defaults designed for English produce cramped, dark-looking Korean slides. This skill documents the plugin's opinionated defaults and the reasons behind them.

## The two-file rule

Full detail lives in:
- `${CLAUDE_PLUGIN_ROOT}/assets/typography/korean-scale.md` — scale, line-height, fonts
- `${CLAUDE_PLUGIN_ROOT}/assets/typography/mixed-language.md` — Korean+English handling

Read both when authoring new themes or debugging Korean-specific issues. This SKILL.md summarizes the essentials.

## Essentials

### Default font

**Pretendard Variable** for everything unless you have a specific editorial reason to use a serif display font (in which case pair with Noto Serif KR, with Pretendard as body fallback).

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

:root {
  --font-body: 'Pretendard Variable', 'Pretendard',
               -apple-system, BlinkMacSystemFont,
               'Apple SD Gothic Neo', sans-serif;
}
```

### Line-height calibration

| Role | English default | Korean default |
|---|---|---|
| Body | 1.5 | **1.7** |
| Subhead | 1.3 | **1.35** |
| Headline | 1.1 | **1.15** |
| Display | 0.95 | **0.95** (same) |

Why: Hangul syllable blocks are square and lack ascender/descender extension. Without more leading, stacks feel like walls.

### Letter-spacing calibration

| Role | Value | Why |
|---|---|---|
| Display (100px+) | −0.04em | Korean display fonts have loose default spacing |
| Headline (50–80px) | −0.02em | Mild tightening, still readable |
| Body | 0 | Do not tighten body |
| Overline (small caps Latin) | +0.12em | Latin-only labels need the tracking |

### Size floor

**Body text MUST be ≥ 22px** on a 1920-wide slide. Below that, Korean loses readability at the back of a 10-person meeting room. 22px is the hard floor; 24–26px is the sweet spot.

## What to avoid

### Italic Korean
Do not italicize Korean text. Synthesized slant on Hangul is almost always broken. Italic is for Latin fragments only.

```css
:lang(ko) em { font-style: normal; font-weight: 500; }
```

### UPPERCASE Korean
Hangul has no case. `text-transform: uppercase` applied to mixed content uppercases only the Latin parts, creating a jarring seam. Reserve uppercase for very short Latin-only labels.

### System font fallback alone
Relying on `-apple-system, sans-serif` gives inconsistent Hangul rendering (Apple SD Gothic Neo on macOS, Malgun Gothic on Windows, Noto Sans KR on Linux). Different shapes, different widths, different line-heights. Always load Pretendard explicitly.

### English-centric scale
"24px body is big enough" — true for English, insufficient for Korean at projection distance. Use the Korean-calibrated scale above.

### Two fonts without unicode-range
Mixing "Pretendard + Inter" via fallback alone causes the Hangul to use Pretendard (thick) and Latin to use Inter (thin), creating visual imbalance. If you must mix, use `unicode-range` to constrain each font.

## Mixed Korean+English

### Default: single font
Pretendard handles both beautifully. Use Pretendard for both languages and resist the temptation to mix.

### When you must mix
For editorial themes (Kinfolk Serif), pair Noto Serif KR (display) with Pretendard (body). Noto Serif KR covers both languages, so the tension is serif-vs-sans, not font-per-language.

### Numbers
Mixed text usually has Latin digits. Enable tabular figures globally on slides with data:

```css
section.metric, section.data, section table {
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

### Quotation marks
| Primary language | Quote style |
|---|---|
| Korean | `「 」` (primary), `『 』` (nested) |
| Latin in Korean sentence | `" "` |
| All Latin | `" "` / `' '` |

## Quick reference CSS block

For any new theme, paste this as the Korean-first foundation:

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

:root {
  --font-body: 'Pretendard Variable', sans-serif;
  --lh-body: 1.7;
  --lh-headline: 1.15;
  --lh-display: 0.95;
  --ls-display: -0.04em;
  --ls-headline: -0.02em;
  --ls-overline: 0.12em;
  --fs-body: clamp(22px, 1.5vw, 26px);
  --fs-headline: clamp(48px, 4.5vw, 80px);
}

section {
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  font-feature-settings: "tnum" 1, "kern" 1;
}
section h1 {
  font-size: var(--fs-headline);
  line-height: var(--lh-headline);
  letter-spacing: var(--ls-headline);
}
section :lang(ko) em { font-style: normal; font-weight: 500; }
```

## Debugging checklist

If Korean slides look "off", work through this:

- [ ] Is Pretendard actually loading? (Check network tab / console)
- [ ] Is `line-height` on body ≥ 1.65?
- [ ] Is body `font-size` ≥ 22px at target viewport?
- [ ] Is `letter-spacing` tightening headlines, not body?
- [ ] Are numbers using `tabular-nums`?
- [ ] Is any Korean text italicized or uppercased by accident?
- [ ] On a dark background, is body weight 400 (not 300)? — thin Korean on dark disappears.

If all above pass and it still looks off, the issue is likely color/contrast or composition, not typography.
