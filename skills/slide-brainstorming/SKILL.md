---
name: slide-brainstorming
description: Use when starting a new Marp slide deck or when the user says "/slide-new", "새 슬라이드", "덱 시작", "슬라이드 브리프". Extracts a narrative brief from the user via 5 questions and writes it to a brief.md file inside the deck's slides directory before any composing happens.
argument-hint: "[topic description]"
allowed-tools: Read, Write, Glob, AskUserQuestion, Bash(mkdir:*, test:*)
---

# Slide Brainstorming

Extract a structured narrative brief from the user. A bad slide deck starts with "I have these topics I want to cover." A good one starts with "here is what I want one person to remember tomorrow."

This skill owns that conversation. It produces `./slides/<slug>/brief.md` which every downstream skill (theme-curator, composer, visual-qa) reads.

## When invoked

The user has asked to start a new deck. You MUST extract — not guess — the following before writing the brief:

1. Audience + occasion
2. Narrative pattern (from `assets/narrative-patterns.md`)
3. Differentiation axis (what must this deck NOT be)
4. Tone
5. Length target (slides count)

## Procedure

### Step 1 — Derive slug and confirm topic

Accept `$1` as topic hint if provided. Otherwise ask once: "이번 덱의 한 문장 주제는?"

Derive slug from topic:
- lowercase, hyphenate, max 40 chars, strip non-alphanumeric (Hangul OK via romanization or short Latin label)
- Propose to user; let them override.

### Step 2 — Check for team defaults

Use the Read tool on `.claude/marp-slide-studio.local.md` (if it exists). If the file is not found, proceed without team defaults — do not ask the user to create it.

If found, note `default_track`, `team_brand_primary`, `author_default` — these pre-fill later stages.

### Step 3 — Load reference materials

You MUST read these before asking questions:
- `${CLAUDE_PLUGIN_ROOT}/assets/narrative-patterns.md` — the 5 arcs
- `${CLAUDE_PLUGIN_ROOT}/assets/anti-patterns.md` — know what to avoid while framing questions

### Step 4 — Ask exactly 5 questions via AskUserQuestion

Keep questions specific and concrete. Always offer concrete options (+ "Other"). Do NOT ask open-ended "what's your vision?"

**Q1. 청중과 자리**
- Options: 투자자 피치 / 사내 의사결정자 / 개발자·엔지니어 컨퍼런스 / 일반 대중 키노트 / 팀 내부 공유

**Q2. 내러티브 아크** (show the 5 patterns from narrative-patterns.md with one-line summaries)
- Hero–Support–Detail–Proof–CTA (제품·서비스 소개)
- Situation–Complication–Resolution (전략 추천)
- Problem–Insight–Solution–Ask (창업·프로젝트 펀딩)
- Question–Exploration–Answer (연구·사고 리더십)
- Five Beats (서사·감성·미션)

**Q3. 차별화 축** — 이 덱이 **되어서는 안 되는** 것
- "평범한 SaaS 랜딩"처럼 읽히면 안 됨 (편집·저널리즘 톤)
- "컨설팅 덱"처럼 읽히면 안 됨 (정중하고 담담)
- "교과서"처럼 읽히면 안 됨 (도발적·선언적)
- "마케팅 브로슈어"처럼 읽히면 안 됨 (정제된 엔지니어링)

**Q4. 톤**
- 단정·선언적
- 사려 깊음·조심스러움
- 학술적·증거 중심
- 감성적·서사 중심

**Q5. 분량**
- 짧게 (6–8 slides, 5-min talk)
- 표준 (10–14 slides, 10-min)
- 길게 (18–24 slides, 20-min)
- 매우 길게 (30+, lecture)

### Step 5 — Ask 2 follow-up free-text questions

Not via AskUserQuestion (those are decision buttons). Ask in plain text:

- "청중이 이 덱을 본 다음 날 **한 문장**으로 기억했으면 하는 것은?"
- "참고하고 싶은 덱·웹사이트·브랜드가 있다면 (예: Stripe 홈, NYT 매거진, 특정 Apple 키노트)"

Wait for response.

### Step 6 — Draft beat structure

Based on answers, propose an N-slide beat structure where N matches the length target.

Example (Hero–Support–Detail–Proof–CTA, 10 slides):
```yaml
beats:
  - slide: 1
    act: Hero
    message: "Pretendard로 더 빠르고 아름다운 한글 슬라이드를 만들 수 있다."
    layout: hero-full-bleed
  - slide: 2
    act: Hero
    message: "keynote도 pptx도 해결하지 못한 한글 기본 타이포의 문제."
    layout: monumental-quote
  # ...
```

Each beat MUST have:
- `slide`: number or range
- `act`: from the narrative pattern
- `message`: ONE SENTENCE the slide exists to deliver
- `layout`: from `assets/layouts/` (hero, monumental, split, metric, divider, quote, enumerated)

CRITICAL: if you cannot write `message` in one sentence, the beat is vague. Rework it.

### Step 7 — Write brief.md

Create `./slides/<slug>/` directory if needed, then write `brief.md`:

```markdown
---
slug: <slug>
title: <one-line topic>
audience: <from Q1>
narrative_pattern: <from Q2 — kebab-case ID>
tone: <from Q4>
length_target: <N>
differentiation_against: <from Q3>
track_preference: <minimalist-premium | editorial | auto>
created: <YYYY-MM-DD>
---

# Brief: <title>

## One-sentence memory
<answer to Q6>

## Reference inspirations
<answer to Q7, as a list>

## Beats

| # | Act | Message | Layout |
|---|-----|---------|--------|
| 1 | Hero | ... | hero-full-bleed |
...

## Constraints (from anti-patterns.md)
Do NOT use: bullet-only slides, 3-column card mosaic, purple gradient,
hero with dark overlay, generic stock icons, center-aligned body text.
```

Infer `track_preference` from Q3 + Q4:
- 단정/선언적 + 정제된 엔지니어링 톤 → `minimalist-premium`
- 사려 깊음 + 서사/편집 톤 → `editorial`
- Otherwise → `auto` (let theme-curator decide with user)

### Step 8 — Hand off

Tell the user:
```
✓ ./slides/<slug>/brief.md 작성 완료
다음 단계: /slide-theme <slug> (테마 선택) 또는 /slide-theme (현재 슬러그 자동 감지)
```

Do NOT start composing. Composition is a separate skill. Stop here.

## Gotchas

Real failure modes observed during development + known edge cases.

- **User says "그냥 알아서 해줘" / "just do it"**: push back ONCE. "5개 질문만 받아도 덱 품질이 결정됩니다. 2분이면 됩니다." If they still refuse, use sensible defaults but write a `**brief synthesis note**` at top of brief.md saying "user declined questions — these defaults were inferred from the topic string alone; results may not match intent."
- **User lists 15 topics as beats**: each beat MUST be a ONE-sentence message. If the user gives many, split into multiple slides with distinct messages OR drop the weakest. Never cram two ideas per beat.
- **User picks narrative pattern that doesn't fit content**: e.g., "Five Beats" for an analytical metrics report. Propose a better fit ("Situation-Complication-Resolution suits this better") and explain in one line. Respect user override.
- **Empty memory sentence**: Q6 is text input — if user submits empty/whitespace, re-ask with "한 문장이 없으면 덱의 마지막 슬라이드가 약해집니다. 한 줄만 써주세요." Do not proceed without it.
- **Slug collision**: `./slides/<slug>/` already exists non-empty. Append `-2`, `-3` until free. NEVER overwrite user's existing work.
- **Reference brand in Q7 not in registry**: User says "Stripe 홈처럼" but doesn't actually need the theme forged — this is brainstorming, just note the aesthetic reference in brief. Theme resolution happens later in `/slide-theme`.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/assets/narrative-patterns.md`
- `${CLAUDE_PLUGIN_ROOT}/assets/anti-patterns.md`
- `${CLAUDE_PLUGIN_ROOT}/assets/layouts/`

## Failure modes to watch

- User says "그냥 알아서 해줘" → push back once: "5개 질문만 받아도 덱 품질이 결정됩니다. 2분이면 됩니다." If they insist, use sensible defaults + note in brief.
- User gives 15 topics as "messages" → each beat must be ONE sentence. If they list multiple, split into slides or drop the weakest.
- User picks narrative pattern that doesn't fit their content → propose a better fit and explain why in one line.
