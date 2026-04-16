# Layout: Data-Dense

One dominant number with context. The number is huge; everything else supports it.

## Markdown

```markdown
<!-- _class: metric -->

<div class="metric-label">2026년 1분기 기준</div>

<div class="metric-value">87<span class="unit">%</span></div>

<div class="metric-caption">한국 디자이너가 사용하는 상위 3개 프레젠테이션 도구의 기본 한글 폰트는 모두 **같은 시스템 기본값**이다.</div>
```

## CSS

```css
section.metric {
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 3rem 5rem;
  background: var(--bg);
}
section.metric .metric-label {
  font-size: var(--fs-caption);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.6;
}
section.metric .metric-value {
  font-size: clamp(180px, 16vw, 340px);
  line-height: 0.9;
  font-weight: 800;
  letter-spacing: -0.06em;
  font-variant-numeric: tabular-nums;
  align-self: center;
  color: var(--accent);
}
section.metric .metric-value .unit {
  font-size: 0.4em;
  font-weight: 400;
  vertical-align: 0.8em;
  opacity: 0.8;
}
section.metric .metric-caption {
  font-size: var(--fs-body-l);
  line-height: 1.6;
  max-width: 45ch;
}
```

## Do / Don't

- DO use tabular figures (`font-variant-numeric: tabular-nums`).
- DO make the number dominate at least 50% of slide height.
- DO keep caption ≤2 lines.
- DON'T add bar/pie chart next to the number — pick one.
- DON'T use 5+ colors for any secondary chart (anti-pattern #5).
