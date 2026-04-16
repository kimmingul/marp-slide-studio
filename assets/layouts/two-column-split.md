# Layout: Two-Column Split

60/40 or 55/45 asymmetric split. Text on one side, visual/data on the other. Not 50/50 — even splits feel rigid.

## Markdown

```markdown
<!-- _class: split split-60-40 -->

<div class="col-main">

## 왜 한글 본문은 호흡이 다른가

Hangul은 정사각형 음절 블록 구조라서 Latin보다 수직으로 더 촘촘합니다. line-height 1.5는 영문에는 충분하지만 한글에서는 문단이 벽처럼 느껴집니다.

</div>

<div class="col-aside">

![Korean line-height comparison](diagram.svg)

</div>
```

## CSS

```css
section.split {
  display: grid;
  padding: 3rem 4rem;
  gap: 3rem;
  align-items: center;
}
section.split-60-40 { grid-template-columns: 3fr 2fr; }
section.split-55-45 { grid-template-columns: 11fr 9fr; }
section.split-40-60 { grid-template-columns: 2fr 3fr; }

section.split .col-main h2 {
  font-size: var(--fs-headline);
  line-height: 1.15;
  margin-bottom: 1.5rem;
}
section.split .col-main p {
  font-size: var(--fs-body);
  line-height: 1.7;
  max-width: 30ch;
}
section.split .col-aside img,
section.split .col-aside svg {
  width: 100%;
  height: auto;
}
```

## Do / Don't

- DO use 60/40 or 55/45 — not 50/50.
- DO keep text column to 30ch wide max — beyond that, line breaks become unpredictable.
- DON'T fill both columns with text.
- DON'T use a framed "card" around each column (anti-pattern #1 cousin).
