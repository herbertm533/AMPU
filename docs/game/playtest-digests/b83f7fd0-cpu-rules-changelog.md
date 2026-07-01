# Digest — "CPU Rule Updates" (b83f7fd0)

- **Slug:** `b83f7fd0-cpu-rule-updates`
- **Source CSV:** `b83f7fd0-CPU_Rule_Updates.csv`
- **Posts:** 6 (1 chunk, ~10.5k chars). Opened & authored by **@MrPotatoTed**
  ("Ted"), the CPU-faction/AI maintainer. POST 6 adds community-suggested
  relocation priorities 16-19 (unsigned, treated by Ted as adopted "at the end").
- **Type:** **AUTHORITATIVE CPU-rules designer changelog.** A running tally of
  ratified changes to the CPU decision rules ("bolded in the rules documents for
  easy reference," POST 1). NOT a playthrough — no eras/years are played. These
  are the canonical CPU behaviors the app is meant to implement.
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** It is the single most load-bearing CPU-rules
> document in the batch: the **exact numeric spec** for four core CPU decisions —
> the **draft off-ideology gamble** (2.1), **career-track assignment** (the full
> 5-step procedure), **early career-track removal**, and **relocation** (the
> replacement of the old 20%/1-pol rule with a 75%/up-to-5-pols **19-priority
> list** built around creating kingmaker-protégé pairings) — plus two forward
> asides (2.6 crisis-legislation votes needed **in committee**, and AI **avoid
> signing competing bills**). Every number below is verified against shipped
> `src/` behavior; **the shipped CPU is far simpler than this spec on all four,
> so this changelog is a large SHARPEN of the CPU cluster** (#20/#232/#24/#289/
> #38/#323/#128-129), not new mechanics. Critically, the relocation rule here is
> the **detailed 19-priority spec** for the same relocation area whose *cap* was
> set in the b58 changelog (`97aa3f6f`, "4 movements/half-term", gap **#38**) —
> the two must be reconciled (see the relocation section + delta list).

---

## ★ Rule 1 — NEW DRAFT RULE (2.1): off-ideology gamble now gated on a 25-PV gap (POST 1)

Verbatim (POST 1): *"If the best politician on the board who meets their priority
above (best PV, best PV with kingmaker, etc) doesn't meet their draft ideologies,
CPU will attempt to draft them **25% of the time** if the non-ideology politician's
PV is **25+ points higher** than the CPU's highest available politician with their
draft ideology."*

| Element | Value |
|---|---|
| Trigger | best-priority pol on the board is **off** the CPU's draft ideologies |
| Roll to take the off-ideology pol anyway | **25%** |
| **NEW gate (the change)** | fires **only if** off-ideology pol's PV is **≥ 25 points higher** than the CPU's best *in-ideology* available pol |
| Otherwise | CPU drafts the in-ideology pol (its 100%-certain pick) |

**What's new (POST 1):** the **"25+ PV points"** threshold. Previously a CPU would
"run a high risk of blowing it and missing a draft pick" to grab an off-ideology
guy who was only equal-PV or a point or two better. Now the risk is only taken
when the reward is "notably better."

## ★ Rule 2 — CPU CAREER-TRACK ASSIGNMENT: a 5-step procedure (POST 1)

Runs when the CPU assigns its rookies to career-track slots. Steps in order:

| Step | Action |
|---|---|
| **1. Keep-off-track gate (NEW)** | Any track-eligible pol with **≥ 3 in any skill** (Command / legislative / governing / admin / military / judicial) has a **50% chance to be kept OFF the track** (so e.g. Hamilton can serve in a cabinet instead of being stuck on the track). |
| **2. First-pass fill (75% each, in order)** | Roll **75%** to fill each slot in order: **Backroom → Legislative → Governing → Admin → Military → Judicial**. A failed 75% roll leaves that slot **temporarily vacant**. |
| **3. Private track** | Place the **highest-PV remaining eligible** rookie into the **Private** track. |
| **4. Retry the failed slots** | Re-attempt the step-2 slots that failed their 75%, **same order** (Backroom→…→Judicial). |
| **5. Force-fill the unfillable** | If slots remain open but no remaining rookie is *immediately* eligible (e.g. Judicial open but no one has ≥1 judicial), **randomly** pick a rookie to try — must still pass the **50% roll** shown in the charts, else the pol stays off-track and the slot stays vacant. |

**Per-slot selection guide (used in any step above):**

| Slot | Who gets picked |
|---|---|
| **Backroom** | A pol from the state where the faction has the **most** of its politicians — **UNLESS** the faction already has a **kingmaker (active or otherwise) under age 60** in that state; then move to the next most-populated state until one without such a kingmaker is found. (If the most-populated state has no *rookie* available, move on to the most-populated state that does.) |
| **Legislative / Governing / Admin / Military / Judicial** | The rookie with the **highest skill** in that applicable skill. |
| **Private** | The **highest-PV** rookie not already assigned during Step 2. |

**Tie-breakers (applied in order):** (1) favor a pol whose state is **NOT yet a US
State**; (2) favor a pol who is **NOT** also the highest-skilled in another field
(so the dual-skilled pol takes the *other* slot); (3) **random**.

**Ted's own change-notes (POST 1):** (1) added the ≥3-skill keep-off gate; (2)
specified failed-75% behavior; (3) specified "ineligible" pols still make the 50%
roll like human players; (4) taught CPU **not to stack kingmakers in one state**
(only one active per state) — with the <60 exception to keep one "waiting in the
wings"; (5) made the tie-breaker consider whether a tied pol fits better elsewhere
on the board. POST 5: Ted tested these in "an extended experiment, and I love them.
Much more realistic than before." → these are **ratified**, not proposals.

## ★ Rule 3 — Early CAREER-TRACK REMOVAL (before 20 years) (POST 1)

| Element | Value |
|---|---|
| Removal chance | **+5% every 4 years** → **5% @ 4yr, 10% @ 8yr, 15% @ 12yr, …** |
| Hard gate | **Won't remove** a pol whose home state has **not reached territory status** |
| Backfill | Only puts an **unqualified** rookie into a track (e.g. no-Military on Military) if **no qualified** one exists |
| Roll scope | **Per individual politician** |

Ted (POST 1): "This is how it already worked, I just specified that you roll for
each individual politician." (i.e. the +5%/4yr and territory gate are pre-existing
canon here; the *per-pol* roll is the clarification.)

## ★ Rule 4 — CPU RELOCATIONS: OLD vs NEW (POST 4, extended POST 6)

**OLD RULE (replaced — for provenance):**
- **20%** chance the AI moves **one** politician this phase (if a move is available).
- The mover is chosen **randomly** among eligible pols — eligible = **not** a US
  Senator, US Rep, or Governor.

**NEW RULE:**
- **75%** chance the AI attempts to move **up to FIVE** politicians this phase.
- Roll the **75% per attempt**; stop when one fails or all five have attempted.
- For **each successful 75%**, walk the priority list **from the top**; pick the
  first priority that has an eligible pol+destination.
- Ties at a priority level → **roll randomly** among eligible pols/states.

**Priority list** (1-15 authored POST 4; 16-19 community-added POST 6). "OP"/"reg"/
"under" = over-/regular-/under-populated state; **KM-pairing** = the move creates a
**kingmaker-protégé pairing** (an "auto success," POST 6):

| # | From | To (condition) |
|---|---|---|
| 1 | overpopulated | **underpopulated** alt where move creates a **KM-pairing** |
| 2 | overpopulated | **regular** alt where move creates a **KM-pairing** |
| 3 | overpopulated | **any** alt where move creates a **KM-pairing** |
| 4 | regular | **underpopulated** alt, **KM-pairing** |
| 5 | regular | **regular** alt, **KM-pairing** |
| 6 | regular | **any** alt, **KM-pairing** |
| 7 | any | **underpopulated** alt, **KM-pairing** |
| 8 | any | **regular** alt, **KM-pairing** |
| 9 | any | **any** alt, **KM-pairing** |
| 10 | **likeable**, overpopulated | **underpopulated** state **in same region** |
| 11 | **likeable**, overpopulated | **any** underpopulated |
| 12 | **not-unlikeable**, overpopulated | underpopulated **in same region** |
| 13 | **not-unlikeable**, overpopulated | **any** underpopulated |
| 14 | **unlikeable + Teflon**, overpopulated | underpopulated **in same region** |
| 15 | **unlikeable + Teflon**, overpopulated | **any** underpopulated |
| 16 | overpopulated | underpopulated **alt** state |
| 17 | overpopulated | **any alt** state |
| 18 | any | underpopulated **alt** state |
| 19 | any | **any alt** state |

**Hard rule (POST 4):** a pol who is **unlikeable and does NOT have Teflon will
NOT be moved** at all (only 14/15 admit unlikeable pols, and only with Teflon).
**POST 6 rationale for 16-19:** as written (1-15) a pol *only* moves to an alt
state when it forms a KM-pairing; 16-19 let overpopulated→underpopulated (and, at
#19, any→any-alt) moves happen regardless of pairing — Ted flags #19 as a possible
problem (an underpop→overpop-alt move) but keeps it "for the historical aspect of a
move that happened IRL."

> **KM-pairing = why relocation matters.** Priorities 1-9 (the majority) exist to
> put a rookie protégé into a **kingmaker's state**, because a pairing requires
> **same-state** co-location (verified: `protegeCandidates` gates on
> `c.state === k.state`, `phaseRunners.ts:1282`). So the whole top of the
> relocation list is a **pairing-manufacturing engine**.

## ★ Rule 5 — Two forward asides (POST 2, POST 3)

- **2.6 needs CPU crisis-legislation votes IN COMMITTEE (POST 2):** today the only
  crisis-bill rules exist for **when a bill reaches the floor**; Ted wants the same
  rules also usable at the **committee** vote (crisis bills should be judged in
  both locations).
- **2.6(2) — AI should avoid signing COMPETING bills (POST 3):** either **strip**
  a redundant bill from consideration after the committee vote, **or** lower the
  AI's likelihood of signing a bill if it already signed one that "fulfilled as a
  replacement." (Duplicate-fulfillment guard.)

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-07-01)

**All four core rules are only PARTIALLY present or simpler in code; the two asides
are entirely absent.** Summary: the shipped CPU draft is a **flat weighted-score
pick** (no 25%/25-PV gamble); the shipped career-track assignment is a **one-line
"best uncapped skill" heuristic** (none of the 5-step procedure, keep-off gate,
75% rolls, Backroom-kingmaker logic, or tie-breaks); early removal **does not
exist** (removal only at 20 years, no territory gate); relocation is a **flat
gate + thin-state heuristic** (no 19-priority list, no pairing targeting, old
20%/1 *not* shipped and new 75%/5 *not* shipped); no crisis-committee vote; no
competing-bill guard.

- **★ CPU DRAFT = flat weighted score, NO 25%/25-PV gamble.**
  `pickBestForFaction` (`phaseRunners.ts:33-53`) scores every pool pol as
  `pvCache + (personalityIdeoMatch ? 25 : 0) + (eligIdeos.includes ? 50 : 0)` and
  takes the **max** (`recordDraftPick`, `:55`). It **always** picks the highest
  score — it never *rolls* a 25% chance and never checks a **25-PV gap**. The
  ideology influence is a **+25 flat score bonus** (LW/RW/Center personality
  bucket, `:46-49`), and the strict-eligible **+50** bonus applies **ONLY** in the
  1772 inaugural/expansion draft (`isExpansion1772`, `:38-43,49`) — in every later
  draft there is no ideology gate at all, so "off-ideology" isn't even modeled.
  → The new draft rule (25% roll gated on 25-PV) is **0% built**; shipped is a
  deterministic score-max.
- **★ CAREER-TRACK ASSIGNMENT = one-line "best uncapped skill," NONE of the 5-step
  procedure.** `runPhase_2_1_2_CareerTracks` Pass 1 (`phaseRunners.ts:422-452`) is
  the entire CPU logic: for each track-less CPU pol **age < 50**, assign
  `bestAvailableTrack` = the pol's **highest skill below 5** whose track isn't full
  (`:392-399`, ties by `SKILLS` order); a pol finishing 20 years is re-tracked to
  next-best if **age < 60**. Cap = `CAREER_TRACK_CAP = 5` per faction per track
  (`types.ts:237`). **Absent:** the ≥3-skill **50% keep-off gate**, the ordered
  **75% per-slot** rolls (Backroom→…→Judicial), the **Private = highest-PV** rule,
  the retry pass, the force-fill **50% roll**, the **Backroom-kingmaker-state**
  selection, and **all three tie-breakers** (not-yet-US-State / not-dual-skilled /
  random). Shipped assigns by raw skill only, no PV, no state, no kingmaker
  awareness. → 5-step procedure **~0% built** (only "assign by best skill, cap 5,
  age-gated" overlaps).
- **★ EARLY CAREER-TRACK REMOVAL = NOT SHIPPED.** The CPU removes a pol from a
  track **only** at `p.careerTrackYears >= CAREER_TRACK_MAX_YEARS` (= **20**,
  `phaseRunners.ts:427`; `types.ts:236`). There is **no +5%/4yr early-removal
  roll**, **no territory-status gate**, and no per-pol removal roll before 20
  years. `CAREER_ODDS` (`types.ts:229-234`) governs *threshold gains* (skill 50%,
  themed-trait 15→75%, random 12%), **not** removal. → 0% built.
- **★ RELOCATION = flat gate + thin-state heuristic; NEITHER the old NOR the new
  rule.** `runPhase_2_1_4_Relocations` (`phaseRunners.ts:623-679`) iterates every
  CPU pol (skipping in-office/dead/retired and pols who already attempted this
  year) and rolls a **per-pol** gate — **`cpuGate.withAltState = 0.3`** if a usable
  altState exists (→ move to the altState), else **`cpuGate.withoutAltState = 0.1`**
  → move to a **thin state** chosen by (same-region → fewest-residents → id)
  (`:657-674`; `RELOCATION_ODDS.cpuGate`, `types.ts:245`). Success then rolls the
  band odds (`sameRegionAlt .75 / sameRegion .5 / crossRegionAlt .4 / crossRegion
  .2`, `types.ts:242`). Cap: **`RELOCATION_ATTEMPTS_PER_TURN = 5`** *attempts*
  (not successes) per faction per **turn** (`:577,656`; `types.ts:247`), yearly-
  reset, **alt moves counted**. → **NOT** the old 20%/one-random-pol rule; **NOT**
  the new 75%/up-to-5 rule; **no** 19-priority list; **no** likeable/unlikeable/
  Teflon filter; **no** kingmaker-pairing targeting (relocation never reads
  `protegeId`/`Kingmaker`). The shipped 0.3-per-pol-with-alt gate is closest to
  priorities 16-19 (move-to-alt regardless of pairing), but ungated by
  population/pairing.
- **★ RELOCATION-CAP CONFLICT with b58 (`97aa3f6f`, gap #38).** b58's POST 4 set
  the cap at **4 state-movements (successes), alt-EXCLUDED, per HALF-TERM**;
  shipped is **5 attempts (fails counted), alt-INCLUDED, per TURN** (`types.ts:247`)
  → ~10 attempts/half-term. **This b61 thread does NOT restate a numeric cap** —
  it specifies **75% × up-to-5 attempts per PHASE (per turn)**, which *agrees with
  shipped on unit (attempts, per-turn)* and *nearly on count (5)* but **conflicts
  with b58's 4-successes/half-term** on both unit and value. Reconciliation for
  tech-lead: the b61 **19-priority list is the detailed selection spec**; the
  **cap value/unit is contested** across b58 (4 successes/half-term) vs b61-implied
  (5 attempts/turn) vs shipped (5 attempts/turn). Recommend adopting b61's
  per-turn-attempt framing (matches shipped) and treating b58's "4" as a separate
  success-cap decision to be resolved. Both live under **#38**.
- **★ NO CRISIS-LEGISLATION vote in COMMITTEE (POST 2).** `runPhase_2_6_2_Committee`
  (`phaseRunners.ts:3463-3496`) resolves each bill with a **single chair pass-roll**
  = `clamp((sameParty ? 0.85 : 0.25) + cardVoteBias(chair), 0, 1)` — there is **no
  "crisis bill" branch** anywhere (grep: no crisis-legislation type/flag in the
  legislation model; "crisis" in `src/` is the `Crisis Manager`/`Crisis Gov` trait
  and era-event copy, not a bill category). So even the *floor* crisis rules Ted
  references don't exist in `src/`; there is nothing to also apply in committee. →
  0% built (whole crisis-bill category unbuilt).
- **★ NO COMPETING-BILL / duplicate-fulfillment guard (POST 3).**
  `runPhase_2_6_3_Floor` (`phaseRunners.ts:3498-3580`) tallies each passed-committee
  bill independently (faction 0.92 / party 0.6 / other 0.15 − ideology-dist − card
  bias) and applies its effect on House-and-Senate majority; there is **no
  cross-bill comparison**, no stripping of redundant bills after committee, and no
  signing-odds reduction for an already-fulfilled equivalent. `applyEffect` runs
  per-bill regardless of overlap. → 0% built.
- **KINGMAKER-PAIRING infra EXISTS but is same-state-gated & CPU-auto-only.**
  `protegeCandidates` (`phaseRunners.ts:1275-1293`) requires the protégé be
  **same faction, same state** (`c.state === k.state`), age < `protegeMaxAge`,
  PV ≥ `protegeMinPv`, one-mentor-per-protégé, not a Senator/President. CPU
  auto-bonds in 2.1.7 Phase 5 (`:1482-1499`, same-state only, `pick`-random). This
  is exactly the machinery relocation priorities 1-9 feed — but **relocation does
  not currently target it** (no code path moves a rookie toward a kingmaker's
  state). → the pairing exists (#128/#129); the relocation-drives-pairing coupling
  is unbuilt.

**Net for tech-lead:** the shipped CPU is a set of small greedy heuristics —
score-max draft, best-skill track assignment (cap 5, age-gated), 20-year-only
removal, and a 0.3/0.1 per-pol relocation gate. This changelog replaces each with
a **precise multi-step ruleset**: the 25%/25-PV draft gamble, the 5-step
track-assignment procedure (incl. the ≥3-skill keep-off gate, ordered 75% rolls,
Backroom-kingmaker-state pick, and 3 tie-breaks), the +5%/4yr territory-gated early
removal, and the 75%/up-to-5 **19-priority** relocation list built to manufacture
kingmaker-protégé pairings — plus two genuinely-missing systems (crisis-legislation
committee votes and a competing-bill guard). All are wiring/replacement work over
existing data (tracks, kingmakers, altState, seeded `chance`), not new state.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs minted. Consolidation decides NEW-vs-fold; items below map to the
existing CPU cluster. IDs follow the task-brief targets; where a prior digest used
a different ID for the same area, that is noted for reconciliation.)*

- **SHARPENS #232 (CPU draft) — the 25%/25-PV off-ideology gamble.** Shipped
  `pickBestForFaction` (`phaseRunners.ts:33-53`) is a deterministic
  `pvCache + 25/50` **score-max** with the +50 ideology gate applying **only** in
  the 1772 inaugural draft — **no 25% roll, no 25-PV threshold**. 0% built.
- **SHARPENS #289 / #24 (career-track assignment & per-pol rolls) — the 5-step
  procedure.** Shipped is one line (`bestAvailableTrack`, highest uncapped skill,
  age-gated, cap 5). **NEW-flag the ≥3-skill 50% keep-off gate** and the **ordered
  75%-per-slot fill/retry** and the **Backroom-kingmaker-state selection** and the
  **3 tie-breaks (not-yet-US-State / not-dual-skilled / random)** — none exist.
  (#24 = "roll per individual pol," from `26b112e5`; this thread confirms per-pol
  rolls as canon.) ~0% built.
- **SHARPENS #289/#24 (early career-track removal) — NEW mechanic in code.** The
  **+5%/4yr** early-removal ladder (5/10/15% @ 4/8/12yr) gated on **home-state
  territory status**, per-pol. Shipped removes **only at 20 years**
  (`phaseRunners.ts:427`), no early roll, no territory gate. **NEW-flag the
  territory-status gate.** 0% built.
- **SHARPENS #38 (relocation) — the 75%/up-to-5, 19-priority list — and UPDATES
  b58's relocation-cap ruling.** Shipped is a **0.3(alt)/0.1(no-alt) per-pol gate +
  thin-state heuristic**, cap **5 attempts/turn** (`types.ts:245,247`). The old
  20%/one-random rule and the new 75%/5-pol rule are **both unbuilt**; the
  **19-priority pairing list** is unbuilt. **Reconcile with b58 (`97aa3f6f`, #38):
  b61 implies 5 attempts/turn (matches shipped unit) vs b58's 4 successes/half-term
  — cap value/unit is contested; b61 is the DETAILED selection spec, b58 is the
  cap decision.** (Task brief listed this as #237; the relocation area is owned by
  **#38** per `97aa3f6f`/`4e518e05` — #237 is the policy-genre gap. Map to **#38**.)
- **COUPLES #38 ↔ #128/#129 (relocation drives kingmaker pairings).** Relocation
  priorities 1-9 exist to move a rookie into a **kingmaker's state** to form a
  pairing; pairing infra requires **same-state** (`protegeCandidates`,
  `phaseRunners.ts:1282`) and CPU auto-bonds same-state in 2.1.7 (`:1482-1499`) —
  but **no relocation code targets a kingmaker's state**. The coupling is the
  requirement. Unbuilt.
- **SHARPENS #323 (CPU bill-scoring) — crisis-legislation votes IN COMMITTEE.**
  Shipped committee vote is a single chair pass-roll with **no crisis-bill branch**
  (`phaseRunners.ts:3463-3496`); there is **no crisis-legislation category in the
  data model at all** (grep). **NEW-flag: the whole crisis-bill vote path (floor
  AND committee) is unbuilt.**
- **SHARPENS #323 (CPU bill-scoring) — competing-bill / duplicate-fulfillment
  guard.** Floor tally scores each bill independently with **no cross-bill dedupe**
  (`phaseRunners.ts:3498-3580`); no post-committee strip, no reduced signing odds
  for an already-fulfilled equivalent. **NEW-flag.** 0% built.
- **CORROBORATES #20 (CPU coherence cluster) — the umbrella.** This changelog is a
  designer-ratified batch of the exact "make CPU decisions more coherent/strategic"
  work #20 tracks; the four rules above are its concrete numeric spec. Confirms the
  cluster; adds the precise per-decision rulesets.
- **PROVENANCE — old rules captured for both draft & relocation.** OLD draft =
  off-ideology grab even at equal PV (replaced by 25-PV gate); OLD relocation =
  20%/one-random-eligible-pol (replaced by 75%/5-pol/19-priority). Kept for the
  gap-log's before/after.
