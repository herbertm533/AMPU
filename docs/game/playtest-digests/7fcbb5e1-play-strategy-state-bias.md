# Digest — 7fcbb5e1 "Playing the game" (state bias vs. best person)

- **Slug:** `7fcbb5e1-playing-the-game`
- **Source:** `docs/game/sources/7fcbb5e1-playing-the-game/` (1 chunk, 2 posts, ~944 chars, Mar 2023)
- **Type:** light play-strategy Q&A (very low mechanics)
- **Scope:** candidate-selection strategy for Congress/Governor races. No era-specific content; no game-master ruling; no house rules.

## Why it matters
A player (Bushwa777, having played "several playtests for a few months") asks the
canonical newcomer question: **when running people for Congress or Governor, weigh
state bias, or just field the best person in the faction?** The answer corroborates
that **state bias genuinely affects win probability** in shipped elections, so
candidate selection is a real strategic axis — not a cosmetic one. It is a
player-side confirmation of an already-modeled mechanic, not a new requirement.

## ★ The state-bias vs. best-person tradeoff (shipped-mechanic corroboration)
Answer (POST 2): *"Both are valid strategies. If I'm facing competition, I go for
'candidate most likely to win', which means paying attention to state bias… If I
either don't have competition or don't think they have a chance, I go for who I
think will be the strongest legislator/governor."*

This maps cleanly onto two distinct, shipped scoring paths:

- **Electability axis — state bias dominates the win calc.** In `calcStateVote`
  (`src/engine/phaseRunners.ts`), `baseLean = partyId==='BLUE' ? -state.bias : state.bias`
  (~L3697) and enters the score as `baseLean * 5` (~L3709). The candidate's own
  strength enters the *same* score only weakly as `pv * 0.1` (~L3699). So a heavily
  biased state can swamp a modest PV edge → "pay attention to state bias" is sound
  when contested. (Score also mixes `partyPreference*5`, `enthusiasm*2`,
  `electionFactionBias`, trait bonuses, and a ±8 noise term.)
- **Governing/strength axis — skills pay off after you hold the seat.** A governor's
  `skills.governing` shifts state bias post-election (~L3388: `(gov.skills.governing-1)*0.05`),
  and the top `skills.legislative` faction member becomes the bill sponsor (~L3441).
  So "strongest legislator/governor" buys real downstream value that electability
  alone does not → fielding the best person is rational when the seat is safe/lost.

Net: the two "valid strategies" the player describes are literally two different
terms/paths in the engine (win-odds vs. governing payoff), which is why the advice
holds. Pure corroboration.

## Shipped-vs-designed
No gap. The player-stated intuition matches shipped behavior:
- `state.bias` is a live, weighted term in the election-share calc (verified).
- PV/skills drive governing outcomes (bill sponsorship, post-election bias drift)
  far more than they drive the seat win itself (verified coefficient asymmetry).
No mechanic here is described that the build lacks; no ruling or house rule to log.

## Delta list
- **No new mechanical delta.** This is a strategy Q&A, not a rules exhibit.
- **Corroboration:** `state.bias` is confirmed a live election-scoring term
  (`baseLean*5` in `calcStateVote`) → maps to the existing **election-scoring
  cluster (#292 / #189 / #184)**. Consolidation owns those IDs; no new IDs assigned.
- **Corroboration:** candidate selection is a genuine strategic axis — win-odds
  (bias-driven) vs. governing payoff (skills-driven) are distinct shipped paths.
  Also within the election-scoring cluster; no new gap.

## Open questions
- None material. (Minor: the ±8 `Math.random()` noise term in `calcStateVote` sits
  outside the seeded RNG — a determinism nit already noted elsewhere; not raised by
  this thread and not logged here.)
