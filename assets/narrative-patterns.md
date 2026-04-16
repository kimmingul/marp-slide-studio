# Narrative Patterns for Slide Decks

A good deck has a spine. These are proven narrative arcs — pick one explicitly in `brief.md`, never "just a list of topics".

## 1. Hero–Support–Detail–Proof–CTA (GPT-5.4 canonical)

Best for: product pitches, sales decks, launch announcements.

| Act | Purpose | Slides |
|---|---|---|
| **Hero** | State identity and promise in one sentence | 1–2 |
| **Support** | Give the context that makes the promise matter | 1–2 |
| **Detail** | Concrete mechanism: how does it work | 2–4 |
| **Proof** | Evidence: data, customer quote, demo still | 1–2 |
| **CTA** | One action you want the audience to take | 1 |

Total: 6–11 slides. Never pad.

## 2. Situation–Complication–Resolution (McKinsey)

Best for: strategy recommendations, internal reviews.

- **Situation**: "Here is what's true today." (1 slide)
- **Complication**: "Here is why today is not sustainable." (1–2 slides)
- **Resolution**: "Here is what we recommend and why." (3–5 slides)

Power move: spend 70% of the deck on resolution detail; complication is 1 brutal slide.

## 3. Problem–Insight–Solution–Ask (Founder pitch)

Best for: seed/Series A pitches, internal "please fund this project".

1. Problem (visceral, specific, one customer's pain)
2. Why now (insight — what shifted to make this solvable)
3. Solution (product in one diagram)
4. Traction (one chart)
5. Team (why us)
6. Ask (what you want from the reader)

## 4. Question–Exploration–Answer (Conference keynote)

Best for: thought-leadership, research talks, technical deep-dives.

1. Open with a question the audience has (or should have).
2. Walk through 3 failed or partial answers.
3. Arrive at your answer. State it flat.
4. Implications: what changes if the answer is right.

## 5. Five Beats (Cinematic)

Best for: emotional talks, year-in-review, mission-driven org decks.

1. **Ordinary world** — baseline
2. **Disruption** — what changed
3. **Struggle** — what made it hard
4. **Turning point** — what unlocked it
5. **New world** — where we are now

Each beat = 1–3 slides. Total 5–15.

---

## How to choose

| Signal | Use |
|---|---|
| Selling a product | #1 |
| Recommending a decision | #2 |
| Asking for money | #3 |
| Teaching an idea | #4 |
| Telling a story | #5 |

## Enforcement rule

Every deck's `brief.md` MUST declare:
```yaml
narrative_pattern: "hero-support-detail-proof-cta"  # one of the five
beats:
  - slide_range: "1-2"
    act: "Hero"
    message: "Pretendard is the Korean body font problem, solved."
  - slide_range: "3"
    act: "Support"
    message: "..."
```

If you cannot fill `message` for every beat in one sentence, the brief is incomplete. Go back to `/slide-new`.
