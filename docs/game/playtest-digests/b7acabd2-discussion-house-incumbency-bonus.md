# Digest — b7acabd2 "Discussion: House incumbency bonus"

- **Source:** `docs/game/sources/b7acabd2-discussion-house-incumbency-bonus/chunk-001.md`
  (topic 4467, 20 posts, ~14.5k chars, 1 chunk).
- **Type:** design-ruling discussion thread, not a playthrough. Opened by
  **@MrPotatoTed** (designer); decided with **@vcczar** (V) as rules authority.
  Participants reference several parallel live campaigns (1840, 1928, "modern
  test," 1800, 1848) as evidence, but no era is *played* here.
- **Scope:** defines the **House-district MODEL** (districts as abstraction) and
  resolves the **incumbency / redistricting ruling** (incumbents locked to their
  won district number; lose-a-seat exception). Era-agnostic — the rule applies
  to every scenario; Blue/Red and the "+1 red district lean" in the thread are
  generic tokens, so no era-polarity resolution is needed (see
  `historical-context.md` cross-era polarity map if framing is ever required).
- **Shipped ruleset version referenced:** **2.95** (the then-current official
  rules; POST 13). Note the build's *code* is a separate, much simpler model —
  see "Deltas" below.

---

## 1. The House-district MODEL (designer's framing)

### ★ Districts are an ABSTRACTION, not literal districts (POST 1)
- The "Districts" are **not meant to be literal House districts**. The game does
  **not name every Rep** in the House. Worked example used throughout the thread:
  **"assume PA should have 30 Reps total, and 7 of them are actually named"**
  (POST 1).
- Winning **"PA-1"** therefore does **not** mean you are literally the
  Representative for Pennsylvania's 1st district — it means you are **one of the
  seven most important PA Reps in the House** (POST 1). The named seats are the
  influential/playable slots; the rest are flavor.
- Designer's own first instinct from this abstraction: *"it makes sense that you
  can run for any seat you want"* (POST 1, consideration #1) — i.e. the
  abstraction *argues for* free district-hopping. **The thread ultimately rules
  the opposite** (see §2), on game-integrity grounds, over the pure-abstraction
  reading.

### ★ Districts carry their own party preference, distinct from the state's (POST 1)
- "Districts" **do have party preferences which may differ from the state's**
  party preference — done **deliberately** (POST 1, consideration #2).
- Purpose: let a **minority-party pol have a real shot**. Canonical example:
  the **"Kevin McCarthy" case** — a Republican in an extremely **blue state** but
  a **red district** (POST 1). Without per-district lean he could never win.
- Implementation note from designer: **the largest states have a seat or two
  with a strong minority-party lean** (POST 1). So districts are distinguished
  from one another *only* by these per-seat party leans; otherwise they are
  interchangeable abstraction slots.

### ★ Incumbency = a +2 bonus (POSTs 16/18)
- Incumbency is worth **+2** in a House race, quantified by a player describing
  live play: he keeps a **blue politician in a red district** because the
  **"+2 incumbent outweighs the +1 red"** lean (POST 16, repeated POST 18).
- Design consequence: **+2 incumbency > a typical ±1 district lean**, so an
  incumbent of the "wrong" party for the district keeps winning until they
  eventually lose — at which point the player may move them to a friendlier
  district (POST 16). This is the intended, accepted behavior.
- (Magnitudes are in the same scale as the district/state lean — small integer
  bonuses added to a race score; cf. the shipped `calcStateVote` where
  `state.bias` enters as `baseLean*5`. The thread does not give the exact
  formula, only the **+2 vs +1** relationship.)

### Rejected alternative: one open multi-winner race (POST 1, consideration #3)
- Designer considered: **"all PA Rep candidates compete in a single race, no
  restrictions on how many each faction runs and no primaries — top seven
  winners get the House seats."**
- **Rejected**: the game "was not designed or balanced for this," and in
  particular it might **fail to produce the minority representation the big
  states need** (POST 1). A floated patch (e.g. force "PA = at least 4 blue + 2
  red Reps, 7th either" correlated to state lean) was explicitly **made up on
  the spot** and not adopted (POST 1). Logged here as a **considered-and-rejected
  alternative**, not a rule.

---

## 2. The RESOLVED RULING (incumbency lock + redistricting exception)

Consensus reached across POSTs 6, 8, 11–13, 16; endorsed by the heavy
playtesters (Orange/OrangeP47, "Eric"/10centjimmy, Umbrella) and the designer.
The motivating dispute: in **1928** two incumbents of the **same ideology** ran
against each other in a state that **had NOT lost a seat** — the GM (10centjimmy)
**let it slide by mistake**, thinking the state had lost a seat (POSTs 7, 10, 13).

### Rule A — Incumbents are "assigned" to their won district and must re-run there
- Once elected, a Rep is treated as **"assigned" to the district NUMBER they were
  elected in** and **must run for re-election in that same seat** (POST 6:
  *"treating reps, once elected, as 'assigned' to the 'district number' they were
  elected in"*; POST 11: *"If they are in MA-1 they have to run for re-election
  in MA-1"*).
- **No district-hopping to a friendlier seat** — that is *"gaming the system"*
  (POST 16); POST 8 calls the question of letting two same-ideology incumbents
  fight outside the exception *"asking 'can I cheat'."*
- Corollary (POST 11): outside the post-census case, you should **never** see two
  incumbents running against each other, because each is locked to a distinct
  seat number. A player may move a pol to a different/friendlier district **only
  after that pol has lost** his current seat (POST 16).
- Players accept this even when the **abstraction** argues otherwise — POST 6:
  *"I get people want abstraction, but you can't always get what you want… This
  is what works"*; POST 16: *"I realize they are not literal seats per se, but if
  we have incumbents bouncing all over the place, things can get very confusing."*
  Practicality/anti-gaming **beats** the pure-abstraction reading from POST 1.

### Rule B — EXCEPTION: when a state loses a seat (census / EV change)
- When a state **loses a district** (via census or an event that drops its EV),
  for **that one election only**:
  - **Primary rules are temporarily ignored** so incumbents can challenge each
    other, *and the AI agrees to do so* (POST 6).
  - The key relaxation: the **ideology rule is waived** — e.g. a **Moderate can
    challenge a Moderate** (a "mod can run against a mod"), which is normally
    disallowed (POSTs 6, 8, 12). *"In this scenario we've been saying a mod can
    run against a mod, but ONLY in this scenario"* (POST 12).
  - Scope is strictly the lose-a-seat case: *"Like when a state went from 2
    districts to 1? Yes. Any other time, no."* (POST 8).
- **Which seat is removed** = the **highest district number** ("largest n"),
  mirroring IRL reapportionment (POST 17: *"by default the seat with the largest
  n would be removed. Same as irl"*; POST 18: *"Highest number is always
  removed"*).
- **Tiebreak when all affected incumbents are the same AI faction** (the original
  fringe case that prompted the rule): decide by **seniority**, and **if that
  ties, random** (POST 6).
- Open sub-point raised but treated as non-issue: per-seat **party biases** must
  account for which seat is dropped (POST 16 asks; POST 18 answers that the bias
  setup *should* already account for highest-n removal, and it'd only break if a
  state had **≥11 EV more/less than its real historical value for that decade** —
  doable only **deliberately**, so *"not something we need to patch"*).

### Shipped-ruleset caveats (important — Rule B may be CPU-only / unwritten)
- The redistricting exception (Rule B) **"isn't in 2.95"** — the then-current
  official ruleset (POST 13).
- It **"went in for the CPU logic at least, or at least V told us he'd add it
  in"** (POST 14) — i.e. it may exist only in the **AI/CPU code path**, not the
  human-facing written rules.
- Action item everyone agreed on: **"Whatever the official rule is, it needs to
  be added to the rules"** (POST 15). So as of this thread, Rule B is a
  **resolved design decision that is not yet written into the official ruleset**
  (and possibly only half-implemented, CPU-side).

### Literal districts deferred to "AMPU 3" (POSTs 2–4)
- Designer wants **real literal districts eventually**, but it requires adding
  **10,000+ more obscure US Reps and failed US Rep nominees** to the dataset
  (POST 2: *"At some point, I want the literal districts, but someone would have
  to help me add 10,000+ more obscure US Reps and failed US Rep nominees"*).
- Planned for **AMPU 3** (POST 3: *"V lets plan on adding all the rest in ampu
  3"*), i.e. out of scope for the current game. (POST 4 is a joke — *"If I'm
  still alive then"*; POSTs 19–20 are banter about 6-EV Delaware being "cursed,"
  no rules content.)

---

## 3. Shipped reality (code) vs. this design — what the build actually does

Verified against the current codebase (labels: **shipped** = what the code does;
**designed** = what this thread specifies). The shipped House model is **far
simpler** than the thread's model and is **missing nearly all of it**.

- **No `District` entity exists.** `State` (`src/types.ts:1320-1329`) has a flat
  `representativeIds: string[]` and a single state-level `bias: number`. There is
  **no per-district party preference**, no district numbering, no "PA-1." Reps
  are an unordered array of politician IDs.
- **No incumbency bonus in House elections.** `calcStateVote(... 'house')`
  (`phaseRunners.ts:3685-3723`) scores each candidate from `state.bias`
  (`baseLean*5`), `partyPreference`, ideology `enthusiasm`, `pv*0.1`, faction
  bias, trait bonuses, and `±4` random — **incumbency is not a term at all**.
  - ⚠️ The only `incumbency*` in the codebase is the **faction-leader challenge**
    system (`types.ts:462-479` `incumbencyAdvantage: 8–30`; used at
    `phaseRunners.ts:2070`, `FactionLeaderPage.tsx`). That is a **different
    mechanic** (intra-faction leadership challenges) and is **NOT** the House
    +2 this thread describes. Do not conflate them.
- **House election re-runs every seat from scratch every 2 years.**
  `runPhase_2_9_6_Congressional` (`phaseRunners.ts:3913-3939`) iterates each
  state's existing reps, builds a fresh top-PV-BLUE-vs-top-RED field, and
  reassigns the seat to whoever wins. Incumbents get **no assignment, no district
  lock, no preference** — they just re-enter the pool. (Senate has a minimal
  incumbent concept only in that it vacates the prior holder, `:3908-3911`; still
  no bonus.)
- **No census / reapportionment.** `electoralVotes` is set at scenario/admit time
  (`territories.ts:17`, `constitutionalConvention.ts:210`) and **never changes
  over the game's run**. Nothing decrements a state's seat count, so the
  **lose-a-seat trigger for Rule B does not exist** in the build.
- **No same-ideology primary restriction in the House path.** The shipped House
  race just picks the single highest-PV candidate per party, so the very
  collision Rules A/B exist to govern (two same-ideology incumbents) **cannot
  arise** in code as written — the whole ruling presumes a richer primary/seat
  model the build doesn't have.

**Net:** the thread documents a **named-seat + per-district-lean + incumbency-
bonus + assigned-district + census-reapportionment** House model. The shipped
game has a **flat per-state, no-incumbency, all-seats-rerun-each-cycle** model.
The forum was clearly playing a more elaborate rules-text version than the code
implements (consistent with this being a 2.95-era *rules* discussion).

---

## 4. Deltas vs. current build (headline)

1. **District-abstraction model is undocumented & unbuilt.** Designed: each state
   has N total Reps but only a handful of **named** seats ("PA-1"…"PA-7" of 30);
   a named seat is just "one of the most important Reps." Shipped: flat
   `representativeIds` list, no named/numbered seats. (POST 1)
2. **Per-district party lean is unbuilt.** Designed: districts carry their own
   party preference distinct from the state's (the "Kevin McCarthy"/red-district-
   in-a-blue-state case); largest states get a seat or two with a strong
   minority-party lean. Shipped: only a single state-level `bias`. (POST 1)
3. **+2 House incumbency bonus is unbuilt.** Designed: an incumbent gets **+2** in
   the House race — enough to beat a ±1 district lean. Shipped: `calcStateVote`
   has **no incumbency term** for the House; the existing `incumbencyAdvantage`
   is the unrelated faction-leader-challenge config. (POSTs 16, 18)
4. **Incumbent district-lock is unbuilt.** Designed (Rule A): incumbents are
   "assigned" to their won district number and **must re-run in that same seat**
   (no hopping = anti-gaming); move only after losing. Shipped: every seat is
   re-contested from scratch each cycle with no district identity. (POSTs 6, 8,
   11, 16)
5. **Lose-a-seat redistricting exception is unbuilt — AND possibly only CPU-side /
   unwritten even in the design.** Designed (Rule B): when a state loses a seat,
   for that one election waive primary/ideology rules so two same-ideology
   incumbents can fight; **remove the highest district number**; AI tiebreak
   **seniority → random**. Caveat: this rule **"isn't in 2.95,"** "went in for
   the CPU logic" only, and **still needs writing into the official rules**.
   Shipped: no census/reapportionment exists, so there's **no trigger** for any
   of this. (POSTs 6, 8, 12–15, 17, 18)
6. **Census / EV-reapportionment over time is unbuilt** (precondition for #5).
   Designed: state sizes & rep counts change over time (POST 1 consideration #4;
   the whole Rule B presumes it). Shipped: `electoralVotes` is fixed for the run.
7. **Literal districts are explicitly deferred to "AMPU 3"** — needs 10,000+ more
   obscure Reps + failed Rep nominees in the dataset; **out of scope** for the
   current game by designer's own statement. (POSTs 2–4)

> Cross-ref (do not assign numbers — consolidation owns the gap-log): this
> overlaps any existing **House-election**, **incumbency-bonus**, and
> **redistricting / reapportionment / census** gaps. Items 1–3 are the most
> reusable design facts (the *model*); item 5 is the most fragile (resolved but
> unwritten / CPU-only).

## Open questions (for the human)
- Is the **+2** House incumbency a flat additive on the same scale as
  `state.bias`'s `baseLean*5` (i.e. effectively +10 score), or a raw +2 to the
  pre-multiplier lean? Thread only states the **+2 vs +1** relationship, not the
  formula vs. shipped `calcStateVote`.
- Did Rule B (lose-a-seat exception) **ever land in the human-facing ruleset**
  after POST 15's action item, or did it remain CPU-only? The thread leaves this
  unresolved.
- For the per-district lean: how many named seats per state, and how is each
  seat's lean derived from / related to the state's `bias`? Thread gives only the
  PA "30 total / 7 named" illustration and "largest states get a seat or two"
  with minority lean.

---
*Provenance: all citations are `POST n` markers in chunk-001 (the only chunk).
Code line refs verified against `src/` at ingest time. `wc -l` of this digest:
see footer.*
