# Layout: Quote with Attribution

Third-party voice. Testimonial, quote from research, or critical review.

## Markdown

```markdown
<!-- _class: quote -->

<blockquote>

Marp로 만든 발표자료를 처음 봤을 때, 이게 keynote 템플릿이 아니라 코드로 짠 거라는 걸 믿지 못했다.

</blockquote>

<div class="attribution">
  <div class="name">박지수</div>
  <div class="role">시니어 프로덕트 디자이너, 토스</div>
</div>
```

## CSS

```css
section.quote {
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 5rem 6rem;
  gap: 3rem;
}
section.quote blockquote {
  font-family: var(--font-display);
  font-size: clamp(40px, 3.5vw, 64px);
  line-height: 1.25;
  letter-spacing: -0.02em;
  font-weight: 400;
  margin: 0;
  max-width: 26ch;
  align-self: center;
  /* Hanging punctuation for opening quote mark */
  text-indent: -0.5em;
}
section.quote blockquote::before { content: "\201C"; }
section.quote blockquote::after { content: "\201D"; }
section.quote .attribution {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: var(--fs-body);
}
section.quote .attribution::before {
  content: "";
  width: 2rem;
  height: 1px;
  background: var(--fg);
  opacity: 0.5;
}
section.quote .attribution .name { font-weight: 600; }
section.quote .attribution .role { opacity: 0.7; }
```

## Do / Don't

- DO use real quotes with real attribution. Fake testimonials break trust.
- DO let the quote breathe — no portrait photo inset unless it's editorially deliberate.
- DON'T italicize the quote in Korean (anti-pattern in mixed-language.md).
- DON'T use a curly "speech bubble" background — flat composition only.
