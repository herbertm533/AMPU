# Digest — 0adcd14c "Presidential Election Question" (speech-by-era delegation)

**Thread:** 0adcd14c-presidential-election-question
**Type:** rules clarification
**Date:** Apr 2024 (post 2 dated 4/19/2024)
**Scope:** 2 posts, ~1.3k chars — one player Q, one designer A. A single "Give a
Speech" rule in the Presidential General Election. No era/year narration.

> **Why it matters:** Pins down the exact eligibility rule for the presidential
> "Give a Speech" campaign action, and reveals a hard **primary-era gate**
> ("at least one state has a primary") that the current build has no concept of —
> the same era boundary #331 (b59) tracks for the nomination mechanism. Also
> re-surfaces the dead `vicePresidentId` finding: the pre-primary-era speaker is
> the VP or faction leader, neither of which the build can supply.

## ★ Speech-by-era-delegation rule (post 1, confirmed post 2)

**Give a Speech** (Presidential General Election action):
- **In the primary era** (defined as **at least one state has a primary**): the
  **presidential nominee** gives the speech.
- **Otherwise** (pre-primary era): the speech **must come from the VP, or the
  faction leader** (the latter only if the faction leader is not the nominee).

Designer ruling (post 2): the underlined "otherwise" clause **was always there** —
it is not a new rule. Earlier conflicting wording made it read as though **no
speeches at all** were allowed pre-primary-era; he cleaned up the language. So:
speeches are available in *every* era; only the *eligible speaker* shifts with the
primary-era boundary. The nominee delivering their own speech is a **primary-era
privilege**; before that, the ticket delegates it (VP / faction leader).

## Shipped-vs-designed (verified against `src/` HEAD)

- **No "Give a Speech" action exists.** Grep of `src/` for `speech`/`Speech`
  finds only the `breakthrough-speech` anytime-event flavor
  (`src/data/anytimeEvents.ts:296-306`) and a war-law flavor string
  (`phaseRunners.ts:3402`). There is **no campaign/convention speech action** in
  any presidential phase. (Cross-ref: b58 convention rulebook `fb8070f3` noted a
  "speech d6" momentum action + Command points — also unbuilt.)
- **Presidential pipeline is auto-resolved, no player campaign step.**
  - `2.9.1` `runPhase_2_9_1_Primaries` (`phaseRunners.ts:3725`) auto-picks each
    party's top candidate by `pvCache + command*5 + traitBonus`. Runs **every
    presidential year regardless of era** — no era gate.
  - `2.9.2` is a **log stub**: `engine.ts:69` just emits "Party conventions
    ratify the primary winners." No convention interaction, no speeches.
  - `2.9.4` `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752`) is a
    pure per-state `calcStateVote` tally → EV winner → swear-in. **No nominee /
    VP / faction-leader distinction, no momentum, no speech.**
- **No primary-era detection.** No `hasPrimary`, no "at least one state has a
  primary" test anywhere. `primary` in code = the *presidential primary phase*
  (`presPrimary` trait context, `__primaryWinners`), which is unconditional — it
  is **not** the historical primary-era boundary the rule keys on. This is the
  **same boundary #331 (b59)** needs for the nomination-mechanism era-selector
  (pre-12A / caucus / convention / primary).
- **VP-speaker branch is unbuildable.** `vicePresidentId` is only ever assigned
  `null` — scenario init (`scenario1772.ts:76`, `scenario1856.ts:156`) and
  `vacateOffice` (`phaseRunners.ts:2450`); it is **read** in Cabinet/Dashboard/UI
  but **never set positively by any election path**. Corroborates the b58/b59
  "`vicePresidentId` never set" finding: the pre-primary-era "VP gives the speech"
  branch has no VP to name.
- **No faction-leader concept.** Grep finds **no `factionLeaderId`** (or any
  designated faction-leader) field. The other pre-primary-era speaker candidate
  does not exist in the model.

## Delta list (map to EXISTING gap IDs — no new gaps)

| Area | In build today | Designed (this thread) | Delta / requirement | Maps to |
|---|---|---|---|---|
| Presidential "Give a Speech" action | Absent; 2.9.2 is a log stub, 2.9.4 is an auto vote tally | A campaign-speech action exists in the general election | Build the speech/momentum action (aligns with b58 "speech d6" + Command-points) | **#185 / #71 / #72** (corroborate + sharpen) |
| Primary-era gate | No "≥1 state has a primary" detection; presidential primary phase is unconditional | Speaker eligibility flips on the primary-era boundary | Add primary-era detection (states-have-primaries) as the era gate | **#331** (same boundary; corroborate + sharpen) |
| Speaker delegation (pre-primary era) | `vicePresidentId` only ever `null`; no `factionLeaderId` field | Speech must come from VP, or faction leader (if not nominee) | Need a set VP + a faction-leader designation before the VP/leader branch is buildable | **`vicePresidentId`-never-set** (b58/b59) + NEW faction-leader-designation need (consolidation to ID) |

**No new gap IDs assigned.** Net: corroboration + sharpening of the unbuilt
convention/nomination system. The one item not obviously covered by an existing
ID is the **faction-leader designation** dependency — flag for consolidation to
map (fold into #185's convention/nomination scope or the `vicePresidentId`
finding) rather than open standalone.

## Open questions (for the human)

- Speech **effect**: what does a speech do mechanically (momentum? a per-state or
  national bonus? a d6 roll per b58)? This thread only states *who may speak*, not
  *what it buys*. Needs the general-election rulebook section, not this Q&A.
- Primary-era **definition boundary**: "at least one state has a primary" — is
  this a per-scenario historical flag on states, or dynamically triggered by a
  reform/era event? #331's era-selector may already answer this.
- If pre-primary-era and there is **no VP and no distinct faction leader** (or the
  faction leader *is* the nominee), can a speech be given at all? Designer implies
  speeches always exist, but the eligible-speaker set could be empty in the model.
