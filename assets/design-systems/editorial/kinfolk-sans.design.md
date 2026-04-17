# Kinfolk Sans — Design System

A sans-serif variant of Kinfolk Serif. Keeps the editorial warmth — cream paper, burgundy accent, paragraph-flow indentation, drop caps — but uses Pretendard Variable for both body and headlines. Suits Korean business/tech contexts where the default expectation is Gothic, yet the brand wants warm editorial atmosphere.

Use when: internal team narratives, mission retrospectives, warm product storytelling, culture decks — **in Korean-first business contexts where Gothic is the expected default**.

Pair with: `editorial` preset family, or when the team settings specify `default_typography: gothic` (v0.7.0+).

## 1. Visual Theme & Atmosphere

- **Mood**: thoughtful, unhurried, warm — conveyed through palette + spacing, not serif forms
- **Density**: varied rhythm, some slides nearly empty
- **Philosophy**: "Editorial warmth without serif — the cream paper and burgundy do the work."

## 2. Color Palette & Roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--bg` | `#EFE9DC` | Warm off-white paper |
| Background (inverse) | `--bg-inv` | `#1A1814` | Hero / cover (deep ink) |
| Foreground | `--fg` | `#1A1814` | Primary text |
| Foreground (inverse) | `--fg-inv` | `#EFE9DC` | Text on dark |
| Muted | `--muted` | `#6B6257` | Captions, attributions |
| Rule | `--rule` | `#C8BFA9` | Hairlines |
| Accent | `--accent` | `#6E0F1E` | Deep burgundy |
| Accent-ink | `--accent-ink` | `#EFE9DC` | Text on accent |

Same palette as Kinfolk Serif. The editorial character is entirely in the color and layout rhythm.

## 3. Typography Rules

**Single-family (sans-only)**: Pretendard Variable throughout.

| Role | Size | Weight |
|---|---|---|
| Display | 140–220px | 800 |
| Headline | 52–80px | 700 |
| Subhead | 28–40px | 500 |
| Body | 22–26px | 400 (line-height 1.75 — slightly taller than Obsidian Mono's 1.7 for editorial breathing room) |
| Caption | 14–16px | 400 italic |

Korean body at `line-height: 1.75` is a touch taller than the plugin default (1.7) — editorial pacing.

## 4. Component Styling

- **Drop cap** (optional): first paragraph of text-heavy slides can use a 4-line drop cap in Pretendard 800, colored `--accent` (burgundy). Distinct look without requiring serif.
- **Paragraph flow**: subsequent paragraphs use `text-indent: 1.5em` (editorial convention). First paragraph never indents.
- **Pull quotes**: Pretendard 400 italic. Hanging left-quote mark in burgundy `--accent` on its own axis. The *quote* feeling comes from indent + accent mark, not from a serif face.
- **Tables**: double top rule (1.5px + 0.5px below), single bottom rule. Small-caps column headers.
- **Images**: cream border (1px `--rule`) for printed-page feel.
- **Captions**: Pretendard italic with em-dash lead-in (`— caption text`).

## 5. Layout Principles

- **6-column editorial grid**, generous outer margins (6rem)
- **Narrow text columns** (26–30ch)
- **Asymmetric composition** — never centered except for hero/monumental
- **Page numbers**: small caps, bottom-right

## 6. Depth & Elevation

None. Warmth is color-first. No shadows ever.

## 7. Do's and Don'ts

### Do
- Treat each slide as a warm magazine spread.
- Use drop caps sparingly — 1–2 per 10 slides max.
- Allow slides to breathe; empty slides are a design choice.
- Use burgundy for 3-per-10 accent.

### Don't
- Introduce a second typeface (the whole point is Pretendard-only).
- Center-align body text (center = ceremonial, not editorial).
- Add decorative flourishes.
- Round corners on anything.

## 8. Responsive Behavior

16:9 at 1920×1080 primary. `clamp()` maintains proportions at 1280×720 exports.

## 9. Agent Prompt Guide (quick reference)

When generating in Kinfolk Sans:
- Background `#EFE9DC` (warm cream), text `#1A1814` (deep ink).
- Pretendard Variable for everything.
- Accent `#6E0F1E` (burgundy), used rarely (≤3 slides per 10).
- Flush-left, narrow text columns, wide outer margins.
- `text-indent: 1.5em` on subsequent paragraphs (editorial flow).
- No shadows, no rounded corners, no gradients, no icons.
- Body line-height 1.75 (slightly taller than default 1.7).

---

*This theme is part of Marp Slide Studio v0.7.0+. It replaces `kinfolk-serif` as the default for the `team-narrative` preset in Gothic-first (business) mode. For the original Noto Serif KR display variant, use `/slide-theme kinfolk-serif` or `/slide-auto … --typography editorial`.*
