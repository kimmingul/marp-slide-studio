# Layout: Vertical Writing (세로쓰기 · 縦書き · 竖排)

CJK vertical writing for editorial or ceremonial effect. Rare in modern slides but powerful for:
- **Korean (세로쓰기)**: classical literature, humanities, cultural reverence
- **Japanese (縦書き)**: still common in print media; formal/traditional contexts
- **Chinese (竖排)**: classical poetry, traditional documents

Uses CSS `writing-mode: vertical-rl` (right-to-left column order, traditional CJK). Works with any CJK language via `:lang()` selectors.

## Markdown

```markdown
<!-- _class: vertical -->

<div class="vertical-main">

# 생각하는 갈대

파스칼은 인간을 “생각하는 갈대”라 불렀다.<br>
그 연약함이 오히려 인간의 위엄이라 말했다.

</div>

<div class="vertical-attribution">
  — 파스칼 ·『팡세』 · 1670
</div>
```

## CSS (theme must provide)

```css
section.vertical {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 4rem 5rem 4rem 4rem;
  gap: 3rem;
  direction: rtl; /* Start columns from right, traditional vertical reading */
}
section.vertical .vertical-main {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-display, 'Noto Serif KR', serif);
  height: 100%;
  max-height: 600px;
  padding: 0 1rem;
}
section.vertical h1 {
  font-size: clamp(64px, 5.5vw, 96px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0.08em;   /* vertical reads better with looser tracking */
  margin: 0 0 2rem;
}
section.vertical p {
  font-size: var(--fs-body-l, 28px);
  line-height: 1.8;
  letter-spacing: 0.05em;
  max-width: none;
  max-height: 600px;
}
section.vertical .vertical-attribution {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: var(--fs-caption, 15px);
  color: var(--muted);
  align-self: end;
  letter-spacing: 0.1em;
  font-style: italic;
}

/* Numbers should remain horizontal inside vertical text */
section.vertical .vertical-main :lang(ko),
section.vertical .vertical-attribution {
  text-orientation: mixed;
}
```

## Do / Don't

- DO reserve for genuinely reverent moments — quotations from classical texts, opening of a culturally-rooted talk.
- DO use serif display fonts (Noto Serif KR) — vertical sans looks modern but loses the ceremonial weight.
- DO keep content short. Vertical reading is slower; respect the audience.
- DON'T mix horizontal and vertical writing on the same slide unless you know exactly what you're doing.
- DON'T use for data, charts, or lists. This is for language only.
- DON'T use in technical or SaaS-style decks. It will read as affectation.

## Notes

- `writing-mode: vertical-rl` puts columns right-to-left (traditional). Use `vertical-lr` for left-to-right.
- Numbers and Latin text inside vertical Korean rotate 90° by default. `text-orientation: mixed` keeps them upright where supported.
- Chrome renders this well. Firefox and Safari also support it but with subtle differences — test in Chrome (Marp's rendering engine) and don't worry about others.
