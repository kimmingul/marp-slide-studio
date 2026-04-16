# Layout: Banner with Side Caption (방주/협주 스타일)

Korean traditional commentary style — a primary text with a secondary note running alongside it, smaller and in a different color. Modern adaptation of 방주(傍注) or 협주(夾注). Excellent for "main claim + qualification" patterns without breaking into two slides.

## Markdown

```markdown
<!-- _class: banner-caption -->

<div class="banner-main">

## 모든 한글 슬라이드의 기본 line-height는 1.7이어야 한다

이 값은 Latin 조판 관습(1.5)에서 2/10만큼 늘어난 것이다. 한글 음절 블록이 수직으로 촘촘하기 때문에 같은 여백을 확보하려면 그만큼 더 필요하다.

</div>

<aside class="banner-caption">

<span class="caption-label">方註</span>

단, 헤드라인은 예외다. 48px 이상에서는 1.15가 자연스럽다. 본문보다 여백을 덜 필요로 하기 때문이다. 또한 자간을 −0.02em으로 조이면 시각적 호흡이 맞춰진다.

</aside>
```

## CSS (theme must provide)

```css
section.banner-caption {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  padding: 4rem 5rem;
  align-items: start;
}

section.banner-caption .banner-main {
  border-right: 1px solid var(--rule);
  padding-right: 3rem;
}
section.banner-caption .banner-main h2 {
  font-size: var(--fs-headline, 56px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  max-width: 22ch;
  margin-bottom: 1.5rem;
}
section.banner-caption .banner-main p {
  font-size: var(--fs-body-l, 28px);
  line-height: 1.7;
  max-width: 28ch;
}

section.banner-caption .banner-caption {
  font-size: var(--fs-body, 22px);
  line-height: 1.65;
  color: var(--muted);
  max-width: 22ch;
  padding-top: 1rem;
  /* Top offset so caption starts slightly below main heading */
  align-self: center;
}
section.banner-caption .caption-label {
  display: block;
  font-family: var(--font-display, 'Noto Serif KR', serif);
  font-size: 0.9em;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  /* Hanja label adds cultural texture; can be swapped to Korean "방주" */
}
```

## Variants

### 1. Hanja label: `方註` (traditional)
Most distinctive. Use in humanities or culturally-oriented decks.

### 2. Korean label: `방주` or `덧붙여`
Softer, more modern. Use in tech/design decks where Hanja reads as affected.

### 3. No label
Pure side-by-side text. Subtlest form. Use when the relationship is obvious from content.

## Do / Don't

- DO use when a main claim has an IMPORTANT qualification that breaks the flow if inserted inline.
- DO keep both columns under ~8 lines of text each — beyond that, the layout becomes cramped.
- DON'T use as a decorative "did you know?" sidebar. That's a footnote, not 방주.
- DON'T let the caption column dominate visually. It's secondary by design.
- DON'T combine with a second image — you already have a two-element layout.

## Why this exists

Slides that want to present "the rule, and its exception" usually either (a) cram both into one paragraph losing clarity, or (b) split into two slides and lose the tension. 방주 layout preserves the tension on a single slide, with the cultural precedent of Korean classical commentary.

## Cross-theme notes

- **Obsidian Mono**: use `--accent` for caption label; kept minimal.
- **Kinfolk Serif**: caption-label in serif italic; feels editorial.
- **Wired Grid**: use mono for caption label (`方註` in JetBrains Mono); creates tension with serif Korean.
- **Arctic Serif**: caption in smaller scale; label in navy; reads most scholarly.
