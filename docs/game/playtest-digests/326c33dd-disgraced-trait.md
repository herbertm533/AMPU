# Digest — 326c33dd "Trait Suggestion" (the "Disgraced" trait)

**Type:** DESIGN / TRAIT SUGGESTION thread (politicslounge topic 4453, 16 May 2023).
**3 posts / 1 chunk** (`chunk-001.md`, all covered; source CSV ~3.1 KB).
**Cast:** **@theFreezerFlame** (OP — proposes the trait, POST 1), **@vcczar** ("V";
tier-1 ruleset owner — the load-bearing reply, POST 2), **@Imperator Taco Cat**
(playtester — pushes back on the expel sub-mechanic, POST 2→3).
Cites `POST n` = `===== POST n =====`. **DIGEST ONLY** — no living-doc edits.

**Why it matters:** a single, self-contained proposal for a **"Disgraced"** trait
(a hard **office-prohibition** flag earned via impeachment/unpopularity). The key
value is **vcczar's build-state ruling (POST 2): "Already have most of this with
retirement, but extending it to the cabinet sounds like a good idea."** That line
(a) anchors disgrace-on-scandal to the **retirement/removal** system as the
designer's existing analog, and (b) singles out the **cabinet-spread** as the
genuinely-new, endorsed bit. Code audit below shows vcczar's "already have most"
describes the **forum-game ground truth, NOT the shipped browser build** — the
build's retirement is age-only.

---

## ★ The proposal (POST 1, theFreezerFlame)

A new trait **"Disgraced"**, with this rule cluster:

1. **Earn — president:** an **impeached OR significantly-unpopular** president →
   **80% chance** to gain **Disgraced**.
2. **★ Core effect — office prohibition:** a **Disgraced** politician is
   **prohibited from holding ANY office**. (The defining mechanic — a hard
   eligibility lock, distinct from death/retirement.)
3. **★ Integrity immunity:** politicians with **Integrity CANNOT receive
   Disgraced** (categorical immunity).
4. **★ Cabinet spread:** each member of the disgraced president's **cabinet** has a
   **20% chance** to also gain Disgraced. **— vcczar's endorsed new bit (POST 2).**
5. **★ Protégé penalty:** the disgraced president's **protégés receive −1 to ALL
   scores** (abilities/stats). (Separate from the trait — a stat hit, not the flag.)
6. **Earn — Congress & SCOTUS:** members of **Congress and the Supreme Court** can
   gain Disgraced **via impeachment**.
7. **The "disharmonious-expel" sub-mechanic (CONTESTED):** a **Disharmonious**
   Rep/Senator → **5% chance to PROPOSE legislation** to **expel** an
   **opposing-ideology, also-Disharmonious** member. If it passes the chamber by
   **2/3**, the expelled member has an **80% chance** to gain Disgraced.
   - **Pushback (POST 2, Imperator Taco Cat):** "I don't think pols should have a
     5% of randomly being expelled by their fellow pols because they both lack
     cooperation skills. Maybe in-between Controversial pols when dom stab is at 1
     but certainly not whenever." → proposes narrowing to **Controversial pols at
     Domestic-Stability = 1**.
   - **Clarification (POST 3, OP):** "It is a 5% chance of the politician's law
     **proposal** being to expel a member. It would be a rare event and would
     rarely pass committee." → the 5% gates the *proposal*, not a random expel; the
     2/3 bar makes it self-limiting.
8. **★ Rare RECOVERY:** a rare chance a Disgraced pol **loses the trait**, with
   flavor: *"Although it was once believed that [politician]'s career was dead,
   their popularity seems to be making a resurgence. Perhaps it is not too late to
   rekindle their job?"*

## ★ vcczar's ruling (POST 2) — the load-bearing build-state note

> **"Already have most of this with retirement, but extending it to the cabinet
> sounds like a good idea."**

Reading (with the code audit below):
- **"Already have most with retirement"** = the **disgrace-on-scandal-REMOVAL** idea
  is, in the designer's mind, **already served by the retirement/removal system**
  (a scandal-hit pol is removed from office/play via forced retirement). So items
  #1–#2 (earn-on-disgrace + leave-office) are treated as **NOT new** — covered by
  retirement. **CAVEAT: true of the forum game; the shipped build's retirement is
  AGE-ONLY (see audit) — there is no scandal/unpopularity-triggered removal in code.**
- **"Extending it to the cabinet sounds like a good idea"** = the **cabinet-spread
  (#4)** is the **genuinely-new, designer-endorsed** addition.
- **Silent on:** the **protégé −1-all-scores (#5)**, a **first-class office-
  prohibition FLAG** distinct from retirement (#2/#3), the **recovery (#8)**, and
  the **disharmonious-expel (#7)** — none confirmed; #7 actively contested.

---

## ★ SHIPPED-vs-DESIGNED (code-verified @ `src/` HEAD 2026-06-30)

**Net: the "Disgraced" trait and ALL its sub-mechanics are UNBUILT, and vcczar's
"already have most with retirement" does NOT hold for the shipped build** — the
build's retirement is **purely age-based**, with no scandal/impeachment/unpopularity
removal path.

- **No "Disgraced" trait.** `Trait` union (`types.ts:62–117`) = **55 traits**;
  **"Disgraced" is not among them** (grep `disgrac` → 0 hits in `src/`).
  Corroborates the established **trait-roster gap (#216)** — code roster ≠ canonical.
- **No impeachment system at all.** grep `impeach` → **0 hits in `src/`**
  (re-confirms b39 / digest `ae435b5f` / #112: impeachment subsystem **0% built**).
  Items #1 ("impeached president") and #6 ("Congress/SCOTUS via impeachment) have
  **no trigger to hang on**.
- **★ Retirement is AGE-ONLY — vcczar's "already have most" is NOT shipped reality.**
  `runPhase_2_4_1_Deaths` (`phaseRunners.ts:2341–2380`) computes retirement solely
  from `retireRateFor(p.age) * cfg.retireMult` (mortality brackets) — **no scandal,
  unpopularity, or impeachment input.** `markPoliticianRetired` (`:2333–2336`) just
  sets `retiredYear` + vacates office. So the build does **not** auto-remove a
  scandal-hit/unpopular pol via retirement; vcczar's claim describes the **forum
  game**, not the code. Maps to the **retirement+death-model gap (#130/#36)**.
- **Closest existing disgrace analog = scandal anytime-events + `forceRetire`
  (PARTIAL).** `anytimeEvents.ts:240–386` defines scandal-* templates
  (bribery/speculation/federal-investigation/affair/misconduct/gaffe) that grant
  **Scandalous**/**Corrupt** + a **PV hit** (`scandalScaled`), and the
  **`forceRetire`** effect kind (`anytimeEvents.ts:28`; applied
  `phaseRunners.ts:2723–2728`) can remove a pol from office mid-game. This is the
  **event-driven removal** vcczar likely means — but it grants Scandalous/Corrupt
  (NOT a "Disgraced" office-lock) and `forceRetire` is **not scandal-gated** (it's a
  generic anytime-event effect). Maps to the **AnytimeEvo + scandal-recycle gap (#140)**.
- **★ Integrity immunity is NARROW & shipped — NOT the proposed categorical lock.**
  `Integrity` exists (`types.ts:64`) and **blocks the `Corrupt` grant on a d6**
  during scandal-scaled events: *"`{name}`'s Integrity weathers the scandal —
  Corrupt does not take, on a d6"* (`phaseRunners.ts:2746–2750`). This is a
  **probabilistic, scandal-specific Corrupt-block**, NOT the proposal's
  **categorical Disgraced immunity**. Integrity↔Corrupt is also a `TRAIT_CONFLICTS`
  pair (`types.ts:663–664`). So #3 is **partially prefigured** but materially
  weaker than proposed (d6 vs 100%; Corrupt vs a new office-lock).
- **No office-prohibition FLAG exists.** A `Politician`'s office eligibility is
  gated only by `deathYear` / `retiredYear` / `currentOffice`
  (`types.ts:1278–1291`; threaded through every eligibility filter, e.g.
  `phaseRunners.ts:499, 571, 1084`). There is **no "barred/disgraced/ineligible"
  field** — a first-class Disgraced office-lock (#2) would be a **net-new
  Politician flag + eligibility-filter change** (it is NOT the same as `retiredYear`,
  which is a permanent exit, not a recoverable disgrace).
- **Protégé exists; the −1-all-scores penalty does NOT.** `protegeId`
  (`types.ts:1283`) + the 2.1.7 Kingmaker/Protégé system (`phaseRunners.ts:1240+`,
  `protegeCandidates` `:1275`) model mentorship, but there is **no path that docks a
  protégé's scores when their mentor falls** (#5 is entirely unbuilt).
- **No disharmonious-expel sub-mechanic.** grep `expel` → 0 hits; no
  legislative-proposal-to-expel exists (and the broader legislative-proposal-to-
  *impeach* is itself unbuilt). #7 has no plumbing. Note: **"Disharmonious" is also
  ABSENT from the code `Trait` union** (per `87c94e25` audit — one of the 15 canon-
  only traits) — so even the gate trait isn't shipped.
- **No trait-recovery path.** Trait removal in code is **old-age fade**
  (`TRAIT_LIFECYCLE_RULES.fadingPool`, `types.ts:634`) or **conflict-displacement on
  a d6** (`TRAIT_CONFLICTS` + `conflictD6Threshold`, `types.ts:639,658–692`). There
  is **no "popularity-resurgence" recovery** that lifts a penalty trait (#8 unbuilt).

---

## Delta list — map to EXISTING gaps where possible (consolidation owns the write)

- **ATTACHES TO the impeachment-subsystem cluster [`ae435b5f` / #112 / DH-33/54/66]
  — "Disgraced" as the post-conviction office-lock.** The proposal's earn-paths
  (#1 impeached pres; #6 Congress/SCOTUS via impeachment) are **downstream of the
  unbuilt impeachment pipeline**. Note the design TENSION: that cluster already
  specs a **convicted → removed-from-game** outcome and a **resigned → −3 future
  elections + cannot-be-appointed** outcome (digest `ae435b5f` §3); "Disgraced" is a
  **softer, RECOVERABLE office-lock** covering the same space — reconcile against
  the existing resign/convict penalties rather than adding a parallel system.
  (Source: POST 1; code: 0 `impeach` hits.)

- **ATTACHES TO the retirement+death-model gap [#130/#36] — vcczar's "already have
  most with retirement" is a FORUM-vs-BUILD delta.** Build retirement is age-only
  (`phaseRunners.ts:2351–2380`); the forum game evidently removes scandal-hit pols
  via retirement. Logs the requirement that disgrace-on-scandal needs a
  **non-age retirement/removal trigger** the build lacks. (Source: POST 2; code.)

- **ATTACHES TO the AnytimeEvo + scandal-recycle gap [#140] — disgrace = the
  scandal-event terminal state.** Scandal-* templates already grant
  Scandalous/Corrupt + PV hit and can `forceRetire` (`anytimeEvents.ts:240–386`,
  `phaseRunners.ts:2723–2728`); "Disgraced" would be a **stronger scandal outcome**
  (office-lock) layered on this existing event path. (Source: POST 1; code.)

- **ATTACHES TO the trait-roster gap [#216] (and the task-brief's trait-coverage
  #320) — "Disgraced" is a proposed NEW trait absent from the 55-trait union.**
  One more candidate for the roster-reconcile. (Source: POST 1; `types.ts:62–117`.)

- **ATTACHES TO the Integrity trait — proposed CATEGORICAL immunity vs shipped d6
  Corrupt-block.** Integrity today only blocks the `Corrupt` grant on a d6
  (`phaseRunners.ts:2746–2750`); the proposal wants Integrity to **hard-block
  Disgraced 100%**. A scope-extension of an existing trait, not a new gap. (Source:
  POST 1; code.)

- **NEW — first-class "Disgraced" office-PROHIBITION flag (recoverable).** A
  Politician-level eligibility lock distinct from `retiredYear` (which is a
  permanent age-exit). Requires a new flag + eligibility-filter wiring + the
  recovery path. No analog in code. (Source: POST 1 #2/#8.)

- **NEW — cabinet-disgrace-SPREAD (20% each). ★ designer-endorsed (vcczar POST 2).**
  On a president's disgrace, each cabinet member rolls 20% to also become Disgraced.
  The one bit vcczar explicitly liked; no contagion/spread mechanic exists in the
  cabinet system. (Source: POST 1 #4; POST 2.)

- **NEW — protégé −1-to-ALL-scores penalty on mentor disgrace.** A guilt-by-
  association stat hit through the `protegeId` graph; no mentor-fall→protégé-penalty
  path exists (`phaseRunners.ts:1240+`). (Source: POST 1 #5.)

- **NEW — disharmonious-EXPEL sub-mechanic (CONTESTED).** 5%-chance Disharmonious
  pol proposes an expel bill vs an opposing-ideology Disharmonious target → 2/3 →
  80% Disgraced. Contested in-thread (narrow to Controversial @ DomStab=1?); gate
  trait "Disharmonious" is itself absent from code; no expel plumbing. Lowest-
  priority / least-ratified. (Source: POST 1 #7; POST 2–3.)

- **NEW — rare trait-RECOVERY ("popularity resurgence").** A path that LIFTS a
  penalty trait (not just old-age fade / conflict-displacement). Generalizes beyond
  Disgraced. (Source: POST 1 #8; code `types.ts:634,639,658–692`.)

## Open questions (for the human / consolidation)

- **Disgraced vs the existing resign/convict penalties (`ae435b5f` §3): merge or
  parallel?** Both lock a pol out of office; "Disgraced" is recoverable, the
  impeachment-spec's penalties are permanent. Pick one model.
- **"Significantly unpopular" threshold (#1) is unspecified** — what meter/value
  triggers the non-impeachment disgrace path?
- **Recovery rate (#8) unquantified** ("rare") — and does recovery also restore the
  protégés' −1 scores and any cabinet-spread casualties?
- **Disharmonious-expel: adopt at all?** vcczar silent; OP narrowed it; Imperator
  Taco Cat wants it gated to Controversial @ DomStab=1. Likely drop or heavily gate.

## Sources

- **326c33dd** "Trait Suggestion" (politicslounge topic 4453), **3 posts / 1 chunk,
  16 May 2023.** OP **theFreezerFlame** (POST 1, 3); **vcczar** tier-1 ruling
  (POST 2); **Imperator Taco Cat** pushback (POST 2). Code verified @
  `src/types.ts`, `src/engine/phaseRunners.ts`, `src/data/anytimeEvents.ts`
  (HEAD 2026-06-30). Cited posts: **1, 2, 3.**
