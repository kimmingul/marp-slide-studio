# Layout: Numbered List (3 items max)

A short rhythm of 3 parallel points. Never 5. Never with icons.

## Markdown

```markdown
<!-- _class: enumerated -->

## 좋은 슬라이드의 세 가지 조건

<ol class="enum">
  <li>
    <span class="num">01</span>
    <h3>한 번에 한 가지만 말한다</h3>
    <p>여러 주장을 한 슬라이드에 담으면 청중은 어느 것도 기억하지 못한다.</p>
  </li>
  <li>
    <span class="num">02</span>
    <h3>내러티브 아크가 있다</h3>
    <p>슬라이드 8장은 에피소드 하나다. 시작·긴장·해소가 있어야 한다.</p>
  </li>
  <li>
    <span class="num">03</span>
    <h3>타이포그래피가 결정한다</h3>
    <p>컬러와 이미지보다 글자 크기·간격·대비가 먼저다.</p>
  </li>
</ol>
```

## CSS

```css
section.enumerated {
  padding: 3rem 5rem;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 2rem;
}
section.enumerated h2 {
  font-size: var(--fs-headline);
  line-height: 1.15;
  max-width: 24ch;
}
section.enumerated .enum {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  align-content: start;
}
section.enumerated .enum li {
  display: grid;
  gap: 0.75rem;
  align-content: start;
  padding-top: 1rem;
  border-top: 1px solid var(--fg);
  /* Hairline rule above each item. No card, no box, no shadow. */
}
section.enumerated .enum .num {
  font-family: var(--font-display);
  font-size: var(--fs-caption);
  letter-spacing: 0.12em;
  font-weight: 600;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
section.enumerated .enum h3 {
  font-size: var(--fs-subhead);
  line-height: 1.25;
  font-weight: 600;
  margin: 0;
}
section.enumerated .enum p {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  opacity: 0.85;
}
```

## Do / Don't

- DO cap at 3 items. 4 items? Drop one or split into two slides.
- DO use hairline rule (1px) above each item — no card, no rounded corner, no shadow.
- DO use tabular figures for the index numbers.
- DON'T add icons above each item (anti-pattern #12).
- DON'T use bullets (•) — use typographic numbers.
