# Digest — b5e78cbd "Should the Controversial trait be changed to Scandalous?"

- **Slug:** `b5e78cbd-should-the-controversial-trait-be-changed-to-scandalous`
- **Source CSV:** `b5e78cbd-Should_the_Controversial_trait_be_changed_to_Scandalous.csv`
- **Posts:** 6 (1 chunk, `chunk-001.md`, all covered; ~3.1k chars).
- **Dates:** Jan 2 → Feb 3, 2025 (opener edited Jan 2, 2025).
- **Type:** **trait-rework design discussion — NOT a playthrough.** No years/eras
  are played; this is a proposal to split/rename one trait and add an escalation
  path. Named exemplars (AOC, Ron Paul, Bernie, Kucinich, Trump) are archetype
  illustrations, not chronicle events.
- **Participants:** **@theFreezerFlame** (OP — the split+rename proposal, POST 1;
  edited Jan 2), an unsigned agreer (POST 2), an unsigned Integrity-critique
  poster (POST 3), an unsigned "we kind of have this already" reply (POST 4),
  **@Vols21** (the deterioration/escalation idea, POST 5), and an unsigned reply
  (POST 6) raising the "When Gained Scandalous" column + Teflon negation.
- Cites `POST n` = `===== POST n =====`. **DIGEST ONLY** — no living-doc edits.

> **Why this thread matters.** It proposes to **split the single "Controversial"
> concept into two traits** — a reworked *divisive-but-appealing* `Controversial`
> (with a NEW same-ideology-primary-bonus / general-penalty election model) and a
> renamed `Scandalous` (the scandal-laden meaning). **The punchline: the split +
> rename are ALREADY the shipped reality** — `Controversial` AND `Scandalous`
> both exist today as distinct traits with distinct election-band rows
> (`types.ts:101`, `:103`; `:816-843`). So this Jan-2025 thread is EITHER pre-dating
> that implementation OR unaware of it; the *durable* asks that remain unbuilt are
> (a) the reworked-Controversial **ideology-split election math** (same-ideology
> primary +1 / general −2), which the shipped `Controversial` does NOT have (its
> rows are uniformly negative), (b) a **trait-escalation / deterioration** path
> (Controversial → Scandalous, à la the *claimed* Flip-Flopper → Two-Faced), which
> **does not ship in any form**, and (c) a **"When Gained" acquisition-timestamp**
> field on the politician, which **no trait carries today**. Several premises in
> the thread are also factually wrong about the current build (see below), which
> is itself a useful signal about what the design conversation assumed.

---

## ★ The two-trait split (the headline proposal) — POST 1, 2

OP proposes to divide today's one "Controversial" idea into two named traits:

1. **Rework `Controversial`** to mean *divisive-but-appealing* — "a person whose
   popular opinion is highly divisive between supporters and detractors, not
   someone who has lots of scandals" (POST 1). Concretely: a trait a **LW or RW
   activist who does NOT have `Obscure`** can get — outspoken but polarizing.
   Archetype = **Alexandria Ocasio-Cortez**: "a left-wing darling but unpopular
   among moderates and right-wingers" (POST 1). POST 2 agrees on the *name*:
   "Controversial to me implies they have a lot of appeal, even if they're
   exceptionally polarizing."
2. **Rename the CURRENT `Controversial` → `Scandalous`** (the scandal-laden
   meaning) — "which tbh could happen by itself if the reworked Controversial
   rule isn't a good idea" (POST 1). I.e. the rename is proposed as independently
   worthwhile even if the ideology-split rework is rejected.

**Shipped reality (see Shipped-vs-designed): this split is DONE.** Both
`Controversial` and `Scandalous` already exist as separate traits. What is NOT
done is giving the surviving `Controversial` the *appealing-but-divisive* election
math — the shipped `Controversial` is a straightforwardly negative trait.

## ★ The proposed reworked-Controversial election math (NEW) — POST 1

The load-bearing NEW mechanic. Reworked `Controversial` would flip sign by context:

| Context | Proposed effect | Condition |
|---|---|---|
| **Primary (same-ideology zone)** | **+1** | electorate is Left-leaning AND pol is **LW** Controversial (and vice-versa for RW) |
| **General election** | **−2** | always (lacks broad cross-ideology support) |
| **Hostile primary** | **−2** | electorate ideology opposes the pol's lean |

AOC worked example (POST 1): "an additional +1 in primaries in same ideology
zones, but a −2 in the general as she lacks broad support outside of her
ideological home." This is an **ideology-conditional, sign-flipping** trait effect
keyed to the electorate's LW/RW lean vs. the pol's — categorically unlike the
shipped `Controversial`, whose rows are uniformly negative across all six contexts.

## ★ The deterioration / escalation model (NEW) — POST 5, 6

Vols21 (POST 5): **"maybe similar to how flip-flopper can escalate to being
2-faced, maybe `Scandalous` is something a controversial person can deteriorate
into? especially if they have gotten the other negative traits."** Motive: a pol
who became controversial only via a *late-career* scandal is otherwise "saddled
with that trait from the very beginning," hampering their game career — "If there
was a way for the controversy to grow in strength over time, that could help."

- Model = **Controversial → Scandalous as an escalation state**, gated on the pol
  having accrued OTHER negative traits (severity/deterioration ramp).
- Explicitly analogized to a claimed **`Flip-Flopper` → `Two-Faced`** escalation.
  **IMPORTANT: that escalation does not ship** (see Shipped-vs-designed) — the
  analogy is to a design-intent the build doesn't implement.

## ★ The "When Gained Scandalous" acquisition-timestamp field (NEW) — POST 6

Reply to POST 5: "Then we'd have to add a new column named **When Gained
Scandalous**" — i.e. a per-politician field recording the turn/year the trait was
acquired, so the escalation/severity can grow over time rather than being a
career-long fixed stamp. **No trait carries any acquisition-year/turn field on
`Politician` today** (grep = 0). This is a net-new data-model touch (a general
"trait provenance / when-gained" concept, not Scandalous-specific).

## ★ The `Teflon`-negates-Scandalous carve-out (NEW) — POST 6

Same POST 6: "even then you'd get people like **Donald Trump** who's got
**Teflon**, which negates it." I.e. a `Teflon` trait that immunizes/cancels the
Scandalous penalty. **`Teflon` is absent from the shipped `Trait` union** (grep = 0
in `src/`) — a proposed but unbuilt trait (also flagged missing by b58's
investigations thread).

## ★ The "Controversial = opposite of Integrity is a mistake" critique — POST 3, 4

- POST 3: "the controversial trait is the opposite of the integrity trait in the
  game, which would imply that someone controversial is dishonest, which is a
  mistake because … you can find politicians who are both controversial and honest,
  for example **Ron Paul, Bernie Sanders or Dennis Kucinich**." The argument:
  decoupling controversy from dishonesty is *why* the appealing-but-divisive
  rework is wanted.
- **Factual correction to the premise (verified):** `Controversial` is **NOT**
  coded as the opposite of `Integrity`. In `TRAIT_CONFLICTS` (`types.ts:658-692`),
  `Integrity`'s only opposite is **`Corrupt`** (`:663-664`); `Controversial`
  appears in NO conflict pair at all (it can freely coexist with `Integrity`).
  The player's *impression* likely comes from the election bands: `Integrity`
  gets an opponent-conditional bump specifically **against** a `Scandalous` /
  `Controversial` / `Corrupt` opponent (`types.ts:749`, `:753`, `:757`), and
  `Controversial` / `Scandalous` get a bumped penalty when the opponent has
  `Integrity` (`:832`, `:836`, `:840`). That is an *electoral foil* relationship,
  not a mutual-exclusion "opposite." So the code already permits
  "controversial-and-honest"; the stated mistake does not exist in the build.
- POST 4: **"We kind of have this already. Populists and moderates don't get
  along, states have ideology bonuses and penalties, etc. And the rowdier
  partisans have `Disharmonious`, which I think is pretty similar to your version
  of controversial."** — i.e. the appealing-divisive effect is partly emergent
  from existing ideology mechanics, and `Disharmonious` is claimed to already
  cover the rowdy-partisan flavor. **Correction: `Disharmonious` is absent from
  the shipped `Trait` union** (grep = 0 in `src/`; corroborated by b57/b58 and by
  digest `326c33dd`). The poster treats it as existing; it is design-only.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-07-01)

**Headline: the split + rename are ALREADY BUILT; the ideology-split math, the
escalation, and the timestamp field are NOT.** Several of the thread's premises
about the current build are factually wrong (Integrity-opposite; Disharmonious;
Flip-Flopper→Two-Faced escalation) — captured as corrections below.

- **★ `Controversial` AND `Scandalous` BOTH SHIP as distinct traits — the split
  is DONE.** `Trait` union: `'Scandalous'` (`types.ts:101`) and `'Controversial'`
  (`:103`); both in `NEGATIVE_TRAITS` (`:164`, `:166`). Each has a full set of
  per-context election-band rows: `Scandalous` (`types.ts:816-828`) and
  `Controversial` (`:830-843`). So the "rename current Controversial → Scandalous"
  ask is moot — both already coexist as separate traits.
- **★ Shipped `Controversial` election rows are UNIFORMLY NEGATIVE — no
  ideology-split, no same-ideology-primary bonus.** `Controversial` bands
  (`types.ts:830-843`): presGeneral −MEDIUM (−4), presPrimary −SMALL, house
  −SMALL, senatePre17 −SMALL, governor −SMALL, internalParty −SMALL; each of
  presGeneral/house/governor bumps to −LARGE (−8) vs an `Integrity` opponent.
  There is **no** electorate-ideology-conditional row, **no** +1 same-ideology
  primary, and **no** LW/RW lean field consulted. The reworked-Controversial math
  from POST 1 is entirely unbuilt. (No `TraitElectionRule` field expresses
  electorate-ideology matching; the shape is `{trait, context, magnitude, era?,
  opponentConditional?}` at `types.ts:727-736`.)
- **★ `Controversial` is NOT the opposite of `Integrity` (POST 3 premise is
  wrong).** `TRAIT_CONFLICTS` (`types.ts:658-692`) pairs `Integrity ↔ Corrupt`
  (`:663-664`) only; `Controversial` is in no conflict pair. Integrity↔tainted is
  an *electoral opponent-conditional*, not a mutual exclusion (`:749/753/757`,
  `:818/822/826`, `:832/836/840`). "Controversial + honest" is already legal.
- **★ NO trait-escalation / deterioration engine ships (POST 5 premise is
  wrong).** `tryGrantTrait` (`engine/traits.ts:41-59`) is conflict-aware
  (d6-arbitrated REPLACE of a *conflicting* held trait) — it is NOT a
  severity-escalation ("upgrade a held negative into a worse one"). There is **no
  Controversial→Scandalous path** and **no Flip-Flopper→Two-Faced path** anywhere.
  `Flip-Flopper` conflicts with nothing; `Two-Faced`'s only conflict is
  `Predictable` (`types.ts:677-678`, the PR4b position-stability pair) — it is
  gained/lost via that pair, not by escalating `Flip-Flopper`. The claimed
  escalation exemplar is design-only.
- **★ `Flip-Flopper` the TRAIT vs `flipFlopperPenalty` the COUNTER — two
  different things.** The trait (`types.ts:98`) is static. Separately,
  `flipFlopperPenalty` is a decaying integer stamp on `Politician` (incremented by
  opposed ideology shifts / cross-party poaches / failed bids; decremented each
  turn in phase 2.1.3, `phaseRunners.ts:519-525`). This is the closest thing to a
  "controversy that grows/fades over time," but it is NOT a trait, does not
  escalate into another trait, and carries no acquisition year.
- **★ NO "When Gained" / acquisition-timestamp field on any trait (POST 6 is a
  genuinely NEW model touch).** `Politician.traits` is a flat `Trait[]`; grep for
  `gainedYear|acquiredYear|gainedTurn|whenGained|traitMeta|traitHistory` = 0 hits.
  No per-trait provenance/turn field exists. The "When Gained Scandalous" column
  is net-new data model.
- **★ `Teflon` is ABSENT (POST 6).** Grep `Teflon` in `src/` = 0. Not in the
  `Trait` union. A proposed-but-unbuilt trait (also flagged missing by b58's
  investigations thread).
- **★ `Disharmonious` is ABSENT (POST 4 premise is wrong).** Grep `Disharmonious`
  in `src/` = 0 (matches live only in docs/specs). Not in the `Trait` union.
  Corroborates b57/b58 and digest `326c33dd` (which also relies on a non-existent
  `Disharmonious` gate). The "rowdy partisan" flavor the poster attributes to it
  has no code home.
- **`Obscure` EXISTS (the reworked-Controversial gate references it).** `Trait`
  union `'Obscure'` (`types.ts:104`), in `NEGATIVE_TRAITS` (`:167`), with election
  bands (`:844-850`; notably POSITIVE +SMALL in presPrimary — the Pierce-1852
  dark-horse case). Removed as a reward by the Continental Congress
  (`continentalCongress.ts:145`) and Paine's arc (`phaseRunners.ts:3103`). So the
  "activist who doesn't have Obscure" gate has a real field to read.
- **How the shipped traits are ACQUIRED today (context for the escalation ask).**
  `Controversial` is granted by: `CAREER_RANDOM_NEGATIVES` career rolls
  (`types.ts:227`), the `CARPETBAGGER_LADDER` relocation penalty ladder
  (`types.ts:250`), and duel-survival anytime-events (`anytimeEvents.ts:180`,
  `:198`, both −3 PV). `Scandalous` is granted by scandal anytime-events
  (`anytimeEvents.ts:246-283`; bribery/speculation/federal-investigation/affair/
  modern-misconduct, all `scandalScaled`, PV hits −8…−12) and career rolls
  (`types.ts:227`). Both are one-shot flags with a fixed PV/election cost — there
  is no "grows over time" ramp, which is exactly the gap POST 5/6 name.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold. Existing IDs cited
per the batch brief: #327 Disgraced/scandal-trait, #216 missing-trait catalog,
#189/#292 election trait-scoring, #4 era/ideology matrix.)*

- **The two-trait SPLIT + RENAME is ALREADY SHIPPED — likely CLOSES/no-ops that
  part of the ask.** Both `Controversial` and `Scandalous` exist as distinct
  traits with distinct bands (`types.ts:101/103`, `:816-843`). This Jan-2025
  thread predates or is unaware of that. Flag for consolidation: verify whether
  any gap still tracks "rename Controversial→Scandalous" and retire it.
- **NEW (consolidation to #189/#292, ties #4) — reworked-Controversial
  ideology-SPLIT election math.** Same-ideology primary **+1** / general **−2** /
  hostile primary **−2**, keyed to electorate LW/RW lean vs. pol's lean (POST 1).
  Shipped `Controversial` bands are uniformly negative with NO ideology-conditional
  row (`types.ts:830-843`); `TraitElectionRule` has no electorate-ideology field
  (`:727-736`). This is the b58 election-trait-scoring rework's sign-flipping case
  and needs the #4 era/ideology matrix + a pol LW/RW-lean signal. 0% built.
- **NEW (consolidation to a trait-ESCALATION mechanic; sibling of #327) —
  Controversial → Scandalous deterioration path.** A severity ramp that upgrades a
  held negative into a worse trait when other negatives have accrued (POST 5),
  analogized to a (non-existent) Flip-Flopper→Two-Faced escalation. `tryGrantTrait`
  is conflict-REPLACE, not escalation (`engine/traits.ts:41-59`); no escalation
  path ships. 0% built. **Corrects the record: Flip-Flopper→Two-Faced is
  design-only** (`Two-Faced` pairs only with `Predictable`, `types.ts:677-678`).
- **NEW — per-trait "When Gained" acquisition-timestamp field on `Politician`.**
  A trait-provenance turn/year field so controversy/scandal can grow over time
  (POST 6). No such field exists (grep = 0); `flipFlopperPenalty` is a decaying
  counter, not an acquisition stamp. Net-new data model; general (not
  Scandalous-specific). 0% built.
- **Consolidation to #216 (missing-trait catalog) — `Teflon` + `Disharmonious`
  named as expected-but-absent.** `Teflon` (Trump; negates Scandalous, POST 6)
  and `Disharmonious` (rowdy partisans, POST 4) are both absent from the `Trait`
  union (grep = 0). Adds `Teflon` to the missing-trait list; re-confirms
  `Disharmonious` (also flagged by b57/b58/`326c33dd`).
- **Consolidation to #327 (Disgraced / scandal-trait system) — Scandalous is the
  close sibling.** `Scandalous` IS the shipped scandal trait (`types.ts:101`;
  granted by `scandalScaled` anytime-events with −8…−12 PV, `anytimeEvents.ts:246-283`)
  that `326c33dd`'s proposed `Disgraced` office-lock and b58's investigation-outcome
  traits build atop. This thread's escalation idea (Controversial→Scandalous) and
  #327's escalation idea (Scandalous/impeachment→Disgraced) are the same
  "deterioration ladder" family — consolidate the escalation model across both.
- **Correction datum (Integrity coupling) — feeds #189/#292 accuracy.** The
  player-facing belief "Controversial = opposite of Integrity" (POST 3) is false in
  the build; the real relationship is the election-band opponent-conditional
  (`types.ts:749/753/757` and `:818-840`). Useful for any UI/trait-glossary work so
  the design conversation and the code agree.
- **`Obscure` gate is available.** The reworked-Controversial "activist without
  Obscure" gate can read a real field (`types.ts:104`). No blocker there.

---

## Open questions (parking lot)

- **Q1 — Is the split ask already satisfied?** The build already has both
  `Controversial` and `Scandalous`. Does any live gap still track "rename
  Controversial→Scandalous"? If so, retire it; the surviving work is only the
  ideology-split MATH + escalation + timestamp. (Consolidation call.)
- **Q2 — Does reworked-Controversial REPLACE the current negative Controversial,
  or coexist?** POST 1 wants the *surviving* Controversial to become
  appealing-but-divisive (+1/−2), which contradicts the shipped uniformly-negative
  rows. If adopted, existing `Controversial` holders (duel survivors, carpetbaggers,
  career-roll pols — `types.ts:227,250`, `anytimeEvents.ts:180/198`) would flip
  from "penalized everywhere" to "primary-boosted," a balance change. Needs a
  design ruling on migration.
- **Q3 — Does the escalation need the LW/RW-lean signal too?** Both the reworked
  math and "which controversial escalates" may need a per-pol LW/RW-lean flag the
  build lacks; couples this to #4's era/ideology matrix. Unresolved.
- **Q4 — No designer (vcczar) verdict in-thread.** Unlike sibling `326c33dd`
  (where vcczar ruled), this thread has no tier-1 owner ruling; all six posts are
  peer discussion. Treat as UNRATIFIED design input.
