# Layout: Section Divider

Visual pause between narrative acts. Small typography, dominant whitespace, optional rule.

## Markdown

```markdown
<!-- _class: divider -->

<div class="divider-number">02</div>
<div class="divider-title">문제</div>
<div class="divider-subtitle">한글 슬라이드의 기본값은 왜 이렇게 보이는가</div>
```

## CSS

```css
section.divider {
  display: grid;
  grid-template-rows: 1fr auto auto 1fr;
  padding: 4rem 5rem;
  background: var(--bg);
}
section.divider .divider-number {
  grid-row: 2;
  font-family: var(--font-display);
  font-size: clamp(120px, 11vw, 220px);
  line-height: 1;
  font-weight: 200;
  letter-spacing: -0.04em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
section.divider .divider-title {
  grid-row: 3;
  font-size: clamp(36px, 3.5vw, 56px);
  font-weight: 600;
  margin-top: 0.5rem;
}
section.divider .divider-subtitle {
  grid-row: 4;
  align-self: end;
  font-size: var(--fs-body-l);
  opacity: 0.7;
  max-width: 50ch;
}
```

## Do / Don't

- DO reserve dividers for genuine act transitions — not every slide.
- DO use a thin font weight for the number (200–300) to contrast body text.
- DON'T repeat the same divider style across different decks — make it theme-specific.
