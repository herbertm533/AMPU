# 8477b37b — "Primary question" (state-grouping / primary-calendar Q&A)

- **Slug:** `8477b37b-primary-question`
- **Source:** `8477b37b-Primary_question.csv` → 1 chunk, **2 posts** (~685 chars; `manifest.json` posts=2).
- **Type:** Mechanics Q&A — **primary state-grouping / staggered primary-calendar ruleset**. A player (Bushwa777) asks how states are sorted into primary GROUPS; the GM answers with the placement algorithm.
- **Date:** 28 Apr 2026. **Participants:** Bushwa777 (player), GM (answer, POST 2).
- **Modern-nomination context:** primaries are the **modern-era** presidential-nomination mechanism (the third branch of the nomination era-selector, alongside pre-12A elector-voting and the ~1830s→primary-era National Convention). This thread is the authoritative sub-ruleset for **how the primary CALENDAR is assembled** — a piece of the nomination cluster (#185 / #331) that no other digest has captured.
- **No code shipped in-thread.** Findings verified against `src/` HEAD.

> **Why it matters:** the shipped presidential primary (`runPhase_2_9_1_Primaries`) is a **single top-PV+command sort per party — one instantaneous nomination event, no states, no calendar, no groups**. This thread documents that the *designed* primary is a **staggered, five-group calendar** whose composition the **governor assembles via random placement**, with a load-balancing cap and an overflow bucket. That is a whole primary-scheduling sub-system (feeding the endorsement-momentum / brokered-convention machine already on #185/#183) that is **0% built**. It is also the first concrete link between the **governor-action system (#20)** and the nomination machine: the governor is the actor who *activates* primaries.

---

## ★ The primary calendar is FIVE groups (staggered schedule)

- The GM's answer presupposes a **fixed set of primary GROUPS** into which states are placed (POST 1 asks "how does each state get chosen for groups?"; POST 2 answers with placement rules).
- The rules reference **"the first three groups"** and **"group five"** as endpoints → the calendar has **five groups (Groups 1–5)**, run in order = a **staggered primary calendar** (early states vote first; later groups vote later), the AMPU model of the real-world primary-season stagger (Iowa/NH → Super Tuesday → … → late states).
- **Group 5 doubles as the overflow bucket** (see below): it is both the last calendar slot and the catch-all for displaced states, so it is expected to be the largest / least-constrained group.
- *Interpretation flag:* the post never enumerates all five groups explicitly; "five groups" is inferred from the "first three groups" + "group five" endpoints. Treated here as five ordered groups, but confirm the exact count/ordering against the fuller convention rules (this is a 2-post Q&A, not the full rulebook).

## ★ The GOVERNOR assembles the calendar by RANDOM placement

- POST 2: *"When activating primaries, the **governor** will **randomly** decide which placement occurs…"*
- So the calendar is **not fixed/authored** — when primaries are **activated**, the **governor** (the state-level actor) rolls to decide **which group each state lands in**. Placement is **stochastic**, governor-driven, per activation.
- This makes the primary calendar a **per-game emergent schedule**, not a static Iowa-first-then-NH bracket — the order in which states vote is randomized at activation time (subject to the cap below).
- **"Activating primaries" = a governor ACTION.** This is the concrete tie-in to the **governor-action system (#20)**: activating/scheduling one's state into the primary calendar is (or should be) a governor action. It also implies primaries are only *live* once activated — i.e. gated behind the modern-nomination era branch of #331, then triggered by governors.

## ★ Cap: no more than THREE states in the first three groups

- POST 2: *"…with **no more than three states in the first three groups**."*
- A **load-balancing cap on the early calendar**: the first three groups (the "early states" — highest leverage, since early wins build endorsement momentum) are capped at **≤3 states each** (reading: ≤3 states *per* early group). This keeps the front of the calendar small/sequential and prevents a de-facto national primary up front, preserving the momentum dynamics the primary system is built around (cross-ref #183 endorsement-momentum, #185 serial-group withdraw machine — those rules assume small early fields).
- *Interpretation flag:* the phrasing "three states in the first three groups" is ambiguous between (a) ≤3 states **in each** of groups 1–3, and (b) ≤3 states **total** across groups 1–3. Read here as **per-group ≤3** (matches a real staggered calendar where each early contest is a handful of states). Overflow rule (below) only makes sense if a group can be "full," which supports a per-group cap. Flag for designer confirmation.

## ★ Overflow: a state placed into a FULL group bumps a random incumbent to GROUP FIVE

- POST 2: *"If a state **moves into a group that is full**, then **randomly bump one of the current states to group five**."*
- The placement algorithm handles **collisions with the cap**: if the random roll would place a state into a group already at its cap ("full"), the state still takes the slot, and one of the **current occupants is chosen at random and displaced to Group 5**.
- **Group 5 is the overflow sink** — it absorbs bumped states and (by implication) is not itself capped, so displacement always terminates there. Net effect: the early groups stay ≤ cap; excess states pile into the late/overflow Group 5.
- This is a **deterministic-in-shape, random-in-detail** balancing routine: caps hold, but *which* state gets bumped (and therefore votes late) is luck-of-the-draw — reinforcing the "emergent per-game calendar" character.

---

## Shipped-vs-designed (verified against `src/` HEAD)

| Thread concept | In the build today | Source |
|---|---|---|
| Primary phase exists | **YES — but as a single-winner sort.** `runPhase_2_9_1_Primaries` (`phaseRunners.ts:3725-3750`): per party, filter live pols (age 35–80, **`command >= 2`** gate), sort once on `pvCache + command*5 + traitBonus`, take **top row = nominee**. One instantaneous pick per party. | POST 2 |
| **State grouping / 5-group calendar** | **ABSENT — 0%.** `grep primaryGroup\|primary.*group\|primaryGroups\|caucusGroup\|primaryCalendar\|primarySchedule` in `src/` → **no matches** (only `interestGroups`, unrelated). No state→group assignment, no group count, no ordering, no cap, no overflow anywhere in the engine. | grep; POST 2 |
| Staggered / serial primary schedule | **ABSENT.** The shipped primary is a single sort with **no time dimension** — no early vs late states, no group order, no per-group contests. `phases.ts:39` `2.9.1` "Presidential Primaries → Each party nominates candidates" is one phase resolving instantly. | `phases.ts:39`; POST 2 |
| Governor **activates** primaries (governor action) | **ABSENT.** No `activatePrimar*` / `schedulePrimar*` action; `grep activatePrimar\|schedulePrimar\|governorAction` → no files. `2.9.1` runs automatically in presidential years for both parties; no governor-triggered activation, no per-state opt-in. | grep; POST 2 |
| Governor random placement / cap ≤3 / bump-to-group-5 | **ABSENT** (follows from no grouping existing). No placement roll, no per-group cap, no overflow/displacement logic. | POST 2 |
| Nomination-mechanism **era selector** (elector-vote / convention / **primary**) | **ABSENT as data.** `types.ts` has no `nominationMechanism`/`nominationMethod`/`nominationSystem` field; the primary always runs the same single-sort regardless of era. Primaries-as-the-modern-branch (this thread's premise) is unmodeled. | `types.ts` grep; POST 1 |
| Brokered convention / endorsement momentum (the machinery groups feed) | **ABSENT** (per `74f1da28` / `fb8070f3`): `2.9.2` "Conventions" does not run a delegate/withdraw/endorsement state-machine. The 5-group calendar is the *input* to that missing machine. | cross-ref #185/#183 |

> Net: the entire **primary-calendar / state-grouping layer is designed-not-built**. The shipped `2.9.1` collapses the whole staggered-primary-into-brokered-convention design (governor-scheduled 5-group calendar → serial group results → withdraw/endorsement momentum → majority-or-convention) into a single PV sort. This thread supplies the **scheduling / calendar-assembly** front end of that design, which no prior digest had.

---

## Delta list (maps to EXISTING gap IDs — consolidation owns the write)

*Conservative mapping: this is a **sub-ruleset of the nomination/primary cluster**, not a new top-level gap. It SHARPENS #185/#331 with the previously-uncaptured calendar-assembly mechanics and adds a concrete #20 tie-in. Flag NEW only if consolidation judges "primary-calendar/state-grouping" a distinct unowned sub-gap.*

- **MAPS TO #331 (nomination-mechanism era-selector — the PRIMARY branch).** #331 (first articulated in `fb8070f3` POST 7 as "★ NEW (consolidation to ID)": the caucus/convention/**primary** era-selector) gets its **modern-primary branch fleshed out** here. The primary branch is not a single sort — it is a **governor-assembled 5-group staggered calendar**. **SHARPENS #331** with the calendar sub-ruleset. *(If #331 is not yet an assigned ID at consolidation time, treat this as "NEW (consolidation to ID) — nomination era-selector, primary branch: 5-group calendar" and fold together.)*
- **MAPS TO #185 (the unbuilt primary→brokered-convention SYSTEM).** The 5-group calendar is the **front end** of #185's serial-group→withdraw/endorsement→majority-or-convention machine (`74f1da28` POST 5, `fb8070f3`). #185's serial "primary groups" now have a **defined composition rule** (how states get INTO the groups). **SHARPENS #185** — this is the calendar-assembly step #185 assumed but never specified. 0% shipped (`runPhase_2_9_1` = single sort).
- **CROSS-REF #20 (governor-action system).** "**Activating primaries**" is a **governor action** — the first datum tying the governor to the nomination machine: the governor triggers activation and drives the random placement. Feeds #20 with a concrete new governor action (activate/schedule state into the primary calendar).
- **CROSS-REF #71/#72 (CPU nomination).** For CPU-run games the governor placing states / bumping to group 5 must be automated — plugs into the CPU nomination-decision surface (#72's selection logic, #71's convention menu). The grouping is the CPU's *scheduling* decision, upstream of candidate/VP selection.
- **NEW detail candidate (fold into #185/#331) — the placement ALGORITHM, verbatim:** (1) **five** primary groups (staggered calendar; group 5 = overflow); (2) on **activation**, the **governor** assigns each state to a group by a **random** roll; (3) **cap: ≤3 states in each of the first three groups** (early-calendar load balance — preserves small early fields for momentum); (4) **overflow: placing into a full group bumps a random current occupant to group 5.** This exact ruleset is captured **only** in this thread — no prior digest has the calendar-assembly step. Flag NEW-detail-only (not a new gap ID) unless consolidation elevates a distinct "primary-calendar/state-grouping" gap.

---

## Open questions (for the human / consolidation)

- **Group count & ordering:** is it exactly **five** groups, run 1→5 in date order? Inferred from "first three groups" + "group five"; the 2-post Q&A never enumerates them. Confirm against the full nomination rulebook.
- **Cap semantics:** "no more than three states in the first three groups" — **≤3 per group** (assumed here) or **≤3 total across groups 1–3**? The overflow ("group that is full") rule implies per-group caps, but confirm. Also: are groups 4–5 capped, or only 1–3? (Group 5 as overflow sink implies it is uncapped.)
- **Trigger/era-gating:** are primaries only active in the **modern nomination era** (the #331 primary branch), and only once a governor **activates** them? Does every state's governor place their own state, or does one governor assemble the whole calendar? ("the governor" is singular in POST 2 — ambiguous whether it is the incumbent governor of each state, or a single scheduling authority.)
- **What the groups DO downstream:** does each group vote in sequence and feed the #183/#185 endorsement-momentum/withdraw machine (`74f1da28` POST 5's 60/75/50% withdraw + endorsement splits)? This thread specifies **assembly** but not **resolution** — confirm the calendar is the input to that (unbuilt) machine.
