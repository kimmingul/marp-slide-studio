# Layout: Hero Full-Bleed

Solid color field fills the slide. One dominant headline, optional overline and one support line. No other elements.

## Markdown

```markdown
<!-- _class: hero -->

<div class="overline">Chapter 01</div>

# Pretendard로<br>한글 슬라이드를<br>다시 쓰다

<div class="support">본문의 호흡부터 제목의 긴장감까지, 한글 최적 기본값.</div>
```

## CSS requirements (theme must provide)

```css
section.hero {
  background: var(--bg-hero, var(--fg));
  color: var(--bg);
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 4rem 5rem;
}
section.hero .overline {
  font-size: var(--fs-caption);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.7;
}
section.hero h1 {
  align-self: center;
  font-size: clamp(80px, 7vw, 140px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 800;
}
section.hero .support {
  font-size: var(--fs-body-l);
  max-width: 60ch;
  opacity: 0.85;
}
```

## Do / Don't

- DO use inverted color (dark bg, light fg) for opening; back to normal for following slides.
- DO keep headline to 3 lines max.
- DON'T add a logo, page number, or footer on hero slides.
- DON'T put an image behind text with a dark overlay (anti-pattern #3).
