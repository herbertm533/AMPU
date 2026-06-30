# Digest — 4df5941d "Idea: Give former Reps/Senators/Governors a +1 incumbency advantage if running for their old seat after being ousted the previous election"

- **Source:** `docs/game/sources/4df5941d-idea-give-ction/chunk-001.md`
  (politicslounge topic 6218, 7 posts, ~2.7k chars, 1 chunk; Apr–May 2025).
- **Type:** design-idea / feature-request thread, not a playthrough. Short.
  Proposer + @PiusXIII + others. No era is *played*; the proposal is era-agnostic.
- **Scope:** ONE new election-bonus idea (the **ousted-official comeback +1
  "half" incumbency advantage**), then a **verbatim RE-POST** of two bonuses
  already captured as gap **#297** (faction-leader bonus + "focus race"). The
  re-post **corroborates #297; it does not mint a new gap.**

---

## 1. ★ MAIN PROPOSAL — ousted-official comeback "half" incumbency advantage

- A former **Rep / Senator / Governor** who was **OUSTED the previous election**
  gets a **+1 ("half") incumbency advantage** when running for their **OLD seat**
  (POST 1, title). Models **name recognition + a donor network** — exactly the
  rationale given: "An ousted former elected official does start with name
  recognition and a network of donors, even if they can be beaten by a well-run
  campaign from an opponent" (POST 4).
- **"Half"** because it is explicitly framed as a fraction of full incumbency
  (full sitting-incumbent = the +2 of the separate House-incumbency thread, see §3).
- **Effectiveness is deliberately NOT factored** — same as real incumbency and
  same as in-game incumbency: "Effectiveness isn't factored into incumbency
  advantage IRL or in-game" (POST 4), answering "Were they good at their job?"
  (POST 2). There is **no "were they good at their job?" measure in the game**
  and the proposer says one isn't feasible (POST 3).
- **A governor mini-approval is floated as the would-be effectiveness proxy and
  rejected as out-of-scope:** "Would be cool if governors could have their own
  mini approvals though but that's a whole new mechanic that I don't see being
  added at this point" (POST 3). Flag as a SEPARATE, explicitly-deferred idea.
- **Implementability:** "the flag should be easy to implement into the gamecode"
  (POST 5) — i.e. a per-politician "ousted from seat X last election" flag + a
  +1 term in the relevant `calcStateVote` context.
- **★ Standing realism bar invoked + a balance objection:**
  - "Do we have empirical data backing this though?" (POST 5) — same
    several-historical-examples gate that governs #297.
  - **Over-incentivize-repeats concern:** "there's already a tendency for
    people/CPUs to run the same candidates over and over again and I don't really
    want to incentivize that" (POST 6). A +1 to the SAME ousted candidate in the
    SAME seat pushes harder toward stale rematches — the central design tension.
- **No in-thread approval.** Left as an open proposal.

## 2. ★ SECOND HALF IS A RE-POST OF #297 (corroboration only)

POST 7 — the same poster "throw[s] out two more ideas," which are the **identical
two mechanics already ingested as gap #297** (batch 51, the `b5b0ace9`
faction-leader-bonus / focus-race thread, topic 6223). **Treat as corroboration
of #297, NOT a new gap:**

1. **Faction-leader bonus: +2 in primaries, +1 in general** (POST 7) — verbatim
   #297(a). ("Easy. Simple.")
2. **Secret "focus race"** (POST 7): each election, **every faction designates
   ONE non-presidential race** (Gov / Sen / Rep, **never the Presidency**) to
   focus; the bonus is **die-rolled — 5–6 → +2, 3–4 → +1, 1–2 → nothing** — and
   is **hidden until results** (his PA-Gov R3/B3 worked example). Verbatim
   #297(b). Flavor = national-party campaign focus / donor cash influx.

The two threads (6218 here, 6223 = #297) are the **same proposer's election-bonus
cluster.** Consolidation should fold this POST 7 in as additional citations under
#297, raising its corroboration count — do **not** re-number it.

---

## 3. Build-vs-design (code-verified)

Labels: **shipped** = what the code does; **designed** = what the thread asks for.

- **Elections have NO incumbency term of any kind.** `calcStateVote`
  (`src/engine/phaseRunners.ts:3685-3723`) scores each candidate as
  `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias +
  traitBonus + (±4 jitter)`. There is **no incumbency, no prior-office, no
  returning-candidate term** — neither full nor "half." A sitting OR returning
  officeholder gets no bonus beyond whatever **office-weighted PV** they carry
  (`src/pv.ts`), which flows in only via `pv * 0.1`. The primary scorer
  (`:3733`, `pvCache + command*5 + traitBonus`) likewise has no incumbency term.
- **No "ousted / previously held this seat" flag exists on `Politician`.**
  `Politician` (`src/types.ts:1252-1291`) has `currentOffice: OfficeRef | null`
  (`:1278`) but **no** `previousOffice` / `priorSeat` / `ousted` / `lostElection`
  / `officeHistory` field (grep: zero). Nothing records that a politician *held
  and then lost* a specific seat — so the proposal's gating flag is **unbuilt**,
  even though the proposer (correctly) calls the flag itself easy.
- **House seats are re-contested from scratch every cycle** —
  `runPhase_2_9_6_Congressional` rebuilds a fresh top-PV field per state and
  reassigns each seat; incumbents (sitting or ousted) get **no lock and no
  bonus**. Senate vacates the prior holder but applies no bonus
  (`phaseRunners.ts:3908-3911`). So there is **no concept of an "old seat"** to
  return to.
- **The only `incumbencyAdvantage` in code is the faction-leader CHALLENGE
  system — a DIFFERENT mechanic.** `LEADERSHIP_RULES.eraConfig.*.incumbencyAdvantage`
  (`types.ts:462-479`, 8–30 by era), consumed at `phaseRunners.ts:2070` and in
  `FactionLeaderPage.tsx`. This is intra-faction leadership tenure, **NOT**
  electoral seat incumbency. Do **not** conflate.
- **No governor approval / mini-approval mechanic exists** (grep: no governor
  approval meter) — consistent with POST 3 treating it as net-new. The only
  per-seat governance signal is PV + traits.
- **#297 build-state re-confirmed (per b51):** leadership reaches elections
  **ONLY via PV** — `FactionLeader: 8` / `PartyLeader: 14` office prestige
  (`pv.ts`), and neither scorer reads `factionLeaderOf` / `leaderId`. **No flat
  leadership-keyed election term**; **no focus-race anywhere in `src/`** (grep
  `focusRace|campaignFocus` → zero). Leadership's only generic election touch is
  `LEADERSHIP_RULES.electionOnBallotMul` (1.1×) at `phaseRunners.ts:1558` (a PV
  on-ballot multiplier, not a flat per-leader election bonus). So #297(a)/(b)
  remain **0% built**, exactly as recorded.

**Attaches to:** the existing **House-incumbency-bonus** thread/digest
(`b7acabd2-discussion-house-incumbency-bonus.md`, gap **#287** — the **+2**
seat-specific House incumbency bonus + district-abstraction model, also UNBUILT).
This thread's **+1 is explicitly the "half" of that +2**, and seat-specific
incumbency is the same design lineage (cf. game-mechanics.md "incumbency is
seat-specific," POST 676/682/696). The ousted-comeback +1 is a **NEW sub-rule
of that same unbuilt incumbency family**, not a duplicate of the +2 itself.

---

## 4. Deltas vs. current build (headline)

1. **★ NEW — ousted-official comeback "half" (+1) incumbency advantage.**
   Designed: a Rep/Sen/Gov ousted the previous election gets **+1 in their OLD
   seat's race** (name-recognition + donor-network proxy; **effectiveness NOT
   factored**). Shipped: `calcStateVote` has **no incumbency/prior-office term**,
   and `Politician` has **no ousted/prior-seat flag**. Requires a "lost seat X
   last election" flag + a +1 term in the matching election context. Gated behind
   the realism/empirical-data bar; carries a designer balance objection that it
   over-incentivizes re-running the same candidates. (POSTs 1, 4, 5, 6)
2. **NEW (explicitly deferred) — governor mini-approval mechanic.** Floated as
   the would-be effectiveness measure for incumbency, then rejected as "a whole
   new mechanic that I don't see being added at this point." Shipped: no
   per-governor approval meter exists. Out-of-scope per the thread; log as a
   parked idea, not a requirement. (POST 3)
3. **CORROBORATES #297 — faction-leader bonus (+2 primary / +1 general).**
   Verbatim re-post (POST 7); add as a citation under #297(a). Still 0% built.
4. **CORROBORATES #297 — secret "focus race" (die-rolled +2 / +1 / nothing,
   one non-presidential race per faction, hidden until results).** Verbatim
   re-post (POST 7); add as a citation under #297(b). Still 0% built.

> Cross-ref (consolidation owns the numbers): #1 is a **new sub-rule of the
> existing incumbency family** (#287 / the seat-specific +2 incumbency design) —
> file it there, not as a fresh top-level gap. #3/#4 fold into **#297**.

## Open questions (for the human)
- Does the **+1** stack with the (unbuilt) **+2** sitting-incumbency, or is it
  strictly the alternative for someone NOT currently holding the seat? The thread
  frames it as "half" of incumbency for an **ousted** (i.e. non-sitting) official,
  implying mutually exclusive — confirm.
- **Scope of "old seat":** literal same office in the same state (e.g. PA Gov →
  PA Gov), or any race for that office type? Thread implies the exact prior seat.
- **One-cycle only?** Title says "after being ousted the previous election" —
  does the +1 lapse if they sit out more than one cycle? Presumably yes; unstated.
- Is the designer's **over-incentivize-repeats** objection (POST 6) a soft veto
  or a tuning note? It is the main reason this could be rejected outright.
