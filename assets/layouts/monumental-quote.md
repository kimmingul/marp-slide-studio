# Layout: Monumental Quote

A single sentence set at display size. Used for the deck's thesis or a killer line. Negative space carries the weight.

## Markdown

```markdown
<!-- _class: monumental -->

# "좋은 슬라이드는<br>한 번에 한 가지만<br>말한다."
```

## CSS

```css
section.monumental {
  background: var(--bg);
  color: var(--fg);
  display: grid;
  place-content: center;
  padding: 6rem;
}
section.monumental h1 {
  font-size: clamp(64px, 6vw, 112px);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-weight: 600;
  max-width: 22ch;
  text-align: left; /* never center — center + giant type = wedding invitation */
}
```

## Do / Don't

- DO keep to ≤15 words. If longer, it's not monumental — use a different layout.
- DO use quotation marks (Korean `「 」` or Latin `“ ”`) to signal "this is a stated belief".
- DON'T center-align the text — it reads as ceremonial, not confident.
- DON'T pair with an image. The whole point is text alone.
