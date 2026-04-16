# Layout: Hanja Ruby Annotation (한자 병기)

Hangul with Hanja annotations above key terms. Essential for classical, legal, medical, or humanities slides where character etymology carries meaning. Uses HTML `<ruby>` elements — native browser support, no extra JS.

## Markdown

```markdown
<!-- _class: ruby -->

# 한자 병기의 쓰임

<p class="featured">
언어(<ruby>言<rt>언</rt></ruby><ruby>語<rt>어</rt></ruby>)는 존재(<ruby>存<rt>존</rt></ruby><ruby>在<rt>재</rt></ruby>)의 집이다.<br>
— 하이데거
</p>

<p class="support">
한국어 문헌에서 한자 병기는 의미를 이중으로 고정하는 장치다. 특히 동음이의어나 학술 용어에서 해석의 범위를 좁힌다.
</p>
```

## Alternative markdown (compact, Hanja as primary + Hangul above)

```markdown
<ruby>言語<rt>언어</rt></ruby>는 존재의 집이다.
```

Use the expanded form when showing each character separately (pedagogical); use the compact form for inline reading (readability).

## CSS (theme must provide)

```css
section.ruby {
  padding: 4rem 5rem;
}
section.ruby .featured {
  font-family: var(--font-display, 'Noto Serif KR', serif);
  font-size: clamp(40px, 3.5vw, 60px);
  line-height: 1.6;     /* ruby needs more vertical room */
  font-weight: 500;
  max-width: 26ch;
  margin-bottom: 3rem;
}
section.ruby .support {
  font-size: var(--fs-body, 24px);
  line-height: 1.75;
  max-width: 40ch;
  color: var(--muted);
}

/* Ruby annotation styling */
section ruby {
  ruby-align: center;
  ruby-position: over;  /* rt above the character */
}
section rt {
  font-size: 0.45em;    /* annotation ~45% of base */
  font-weight: 400;
  color: var(--muted);
  letter-spacing: 0.02em;
  font-family: var(--font-body);
  line-height: 1;
  margin-bottom: 0.1em;
  /* Hide parentheses that some browsers add as fallback */
}
section rp { display: none; }
```

## Do / Don't

- DO use for terms where character etymology matters: 論理(논리), 現象(현상), 命題(명제).
- DO annotate once per term per slide (not every occurrence).
- DO keep `font-size` ratio of `rt` around 0.4–0.5 of base — smaller loses readability, larger overwhelms.
- DON'T annotate every Korean word. That's affectation, not annotation.
- DON'T use ruby inside display-sized headlines (>80px) — the annotation gets tiny.
- DON'T skip `<rp>` tags if you export to PPTX image mode — they serve as fallback for environments without ruby support.

## Accessibility

Screen readers read ruby annotations. Hangul readers get both characters and pronunciation. English-only readers hear "eon-eo" for 언어. This is fine — it's semantically correct.

## When to choose this over plain Hangul

| Context | Use ruby? |
|---|---|
| Modern tech talk | No |
| Legal/medical term introduction | Yes |
| Classical literature quote | Yes |
| Neologism or coined term | Maybe (once at introduction) |
| Brand/product name | No (unless brand is Hanja-originated) |
| Academic paper summary | Yes for key terms |
