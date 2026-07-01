# Digest — "Constitution Day Inspired Question/Idea" (mid-game ConCon)

- **Slug:** `5c3a92a9-constitution-day-inspired-questionidea`
- **Source CSV:** `5c3a92a9-Constitution_Day_Inspired_QuestionIdea.csv`
- **Posts:** 5 (1 chunk, ~2.9k chars). Opened by **pman**.
- **Date stamp in-thread:** Sep 17, 2024 (Constitution Day).
- **Type:** **Design idea + mechanics-Q&A, NOT a playthrough.** No era is actually
  *played* here. pman proposes a *future* playtest; Largo833 and pman describe how
  the (already-shipped, in the forum build) **mid-game Constitutional Convention**
  mechanic works. Cite `POST n` = `===== POST n =====`.
- **Participants:** pman (opener, the 1930/mid-game-ConCon-start idea — POST 1/3),
  Vee01 (new playtester, "test the edge cases" — POST 2), Largo833 (the
  5-Gov-gate + 2/3-of-states + race-vs-Dom-Stab feasibility facts — POST 4/5).

> **Why this thread matters.** It is the clearest forum statement of the
> **mid-game Constitutional Convention** as a *designed* mechanic — a rare,
> crisis-triggered path to rewrite the government mid-scenario. It pins three
> concrete numbers (**Dom-Stab-lowest trigger**, **5 Gov-skill state gate**,
> **2/3-of-states-before-Dom-Stab-rises threshold**) and one CPU behavior
> (**CPUs back the historical option if no alternative passes**). Crucially,
> **NONE of the mid-game path is in the shipped app** — the code ships only the
> *founding* 1787/1788 convention, reached via a hardcoded era-event, with no
> Domestic-Stability trigger, no "call a convention" governor action, and no
> state-vote threshold. The thread also proposes a **new scenario-boot entry
> point** ("start a playtest AT a mid-game ConCon in 1930 / Reconstruction / 1968
> with Dom-Stab + Econ at worst"), which the two hardcoded scenario builders do
> not support. So this is DESIGN INTENT for a whole subsystem the build lacks,
> plus a scenario-boot ask.

---

## ★ The mid-game Constitutional Convention — as DESIGNED (forum build), per thread

The forum game supports a **mid-game** ConCon (distinct from the founding one).
Facts stated in-thread:

| Fact | Detail | Source |
|---|---|---|
| **Trigger** | It becomes an option **"when Domestic Stab gets to its lowest spot"** — i.e. the Domestic Stability meter bottoming out unlocks the "call a new Convention" path. | POST 1, 3 |
| **State action + skill gate** | Calling one is a **per-state action** ("call for a new Constitutional Convention"); an individual state's attempt **fails if that state's Governor doesn't have 5 Gov** (governing skill). | POST 4 |
| **Threshold** | Need **2/3 of the states** to *successfully* perform the action. | POST 4 |
| **Race condition** | Must get 2/3 of states to succeed **before Dom Stab rises by even a single point** — Dom Stab presumably recovers/ticks up, closing the window. This makes it "really hard," even with all ten factions trying. | POST 4/5 |
| **CPU default** | In 1788 random testing the country usually ends up **"normal"** because **CPUs back the historical option if none of the alternatives pass.** So a CPU-dominated convention reproduces the historical government by default. | POST 3 |
| **Outcome question** | Convention produces a *new government* (a set of articles). Open design question: "what government would they leave with? could the new government pull the country out of crisis?" | POST 1 |

## ★ The scenario-boot idea (the actionable ask) — POST 1/3

pman proposes a **new kind of playtest start**: boot a scenario **directly at a
mid-game Constitutional Convention**, at a crisis year, with the meters pre-set to
worst:

- Candidate years: **1930** (pman's pick), **Reconstruction** (~1865–1877), **1968**.
- Pre-conditions to seed: **Domestic Stability at its worst spot** AND **the Econ
  (economic) meter at its worst spot**.
- Purpose: stress-test whether the convention mechanics "hold up" (Vee01, POST 2)
  and whether a re-founded government can recover a nation in crisis.
- This requires a **start-at-a-phase / start-anywhere** capability that boots into
  a live convention with hand-set meters — a new boot entry point.

## Open questions raised in-thread (parking lot)

- **Q1 — is it even achievable?** Largo833 (POST 4/5) is unsure the 2/3-before-
  Dom-Stab-rises threshold is *reachable* even with all 10 factions cooperating.
  Balance/feasibility of the mid-game trigger is unresolved by the thread.
- **Q2 — what government emerges & does it help?** (POST 1) Whether a convention
  under Dom-Stab+Econ-worst yields a government that recovers the crisis is the
  whole point of the proposed test — untested.
- **Q3 — CPU homogeneity.** CPUs defaulting to "the historical option" (POST 3)
  means a low-human-agency convention just reproduces history; is that desired, or
  should CPUs be pushed toward reform under crisis?

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-07-01)

**The mid-game Constitutional Convention does NOT ship.** The app has exactly one
convention: the **founding 1787/1788** one, reached by a hardcoded era-event, with
no Domestic-Stability trigger, no governor "call a convention" action, and no
state-vote threshold. Every number the thread cites (Dom-Stab-lowest trigger,
5-Gov gate, 2/3-of-states) is **absent from code**.

- **★ Only a FOUNDING convention ships; `makeConvention` has ONE caller.**
  `makeConvention(year)` (`constitutionalConvention.ts:6-77`) builds the 7-article
  convention (legislature / executive / judiciary / slaveCompromise /
  amendmentProcess / presidentialEligibility / termLimits). Its **sole** call site
  is the hardcoded 1772-scenario era-event case
  `constitutional_convention_kickoff` (`phaseRunners.ts:3182-3186`), reached only
  via the Annapolis-Convention graph path (`eraEvents1772.ts:389-421`). There is
  **no mid-game / crisis convention** anywhere.
- **★ NO Domestic-Stability trigger for a convention.** The Domestic Stability
  meter is `meters.domestic` (`NationalMeters`, `types.ts:1403`; label
  `labels.ts:51`). Grep of `src/engine` shows `domestic` is **only** read/written
  by bill effects (`applyEffect`, `phaseRunners.ts:3218-3219`), cabinet-drift ticks
  (`:3287`, `:3302`, `:3350`), and AG-expertise softening (`:2910-2947`). **Nothing
  reads a low/lowest `domestic` value to unlock, gate, or trigger a convention.**
  The "Dom-Stab-lowest ⇒ convention available" rule is **0% built.**
- **★ NO "call for a new Constitutional Convention" governor/state action.** The
  2.5.2 Governor Actions phase (`phases.ts:26`) is the flat skill-nudge stub
  (`runPhase_2_5_2_Governors`, `phaseRunners.ts:3382-3392` — 30% chance to nudge
  `s.bias` by governing-skill; see digest `0ff5e582`). There is **no** per-state
  "call a convention" action, and grep for `callConvention` / `proposeConvention`
  / `reformGovernment` = **0**. Unbuilt.
- **★ NO 5-Gov-skill gate and NO 2/3-of-states convention threshold in code.**
  Grep for `governing >= 5` / `5 Gov` = **0**. The `2/3` constants that DO exist
  are unrelated: (a) **legislation** passage under the Articles of Confederation
  ("2/3 after", `continentalCongress.ts:198`; Dashboard "2/3 of states" for
  bill-passing, `Dashboard.tsx:75`; framework note `eraEvents1772.ts:367`), and
  (b) the **amendmentProcess article option** value `'two_thirds'`
  (`constitutionalConvention.ts:46`, `types.ts:1394`). Neither is a
  convention-call threshold. Unbuilt.
- **★ CPU "back the historical option" — PARTIAL analog, NOT the same rule.** The
  shipped `autoFillCPUVotes` (`constitutionalConvention.ts:81-123`) DOES have CPU
  factions vote each article by party/ideology heuristic (`preferredOption`), and
  unvoted articles fall back to hardcoded **defaults** in `applyConvention`
  (`:136-144`, e.g. legislature→bicameral, termLimits→no_limits). That default set
  approximates "the historical option." But this is the **founding** convention's
  auto-fill; there is no mid-game convention for it to run in, and no explicit
  "historical option" concept. So the *behavior* the thread describes exists in
  spirit only for 1788, matching POST 3's "1788 testing."
- **★ `startConvention` postEffect is a DEAD type-union member (unwired hook).**
  `EraEvent.postEffects` declares a `'startConvention'` type
  (`types.ts:1478`), but the postEffects dispatcher
  (`phaseRunners.ts:3057-3087`) handles **only `assembleCC`**; every other type
  (incl. `startConvention`, `startWar`, `unlockGovernors`, `unlockArticles`,
  `endWar`, `addPolitician`) hits the `default` branch that just logs
  `"Unhandled postEffect type: …"` (`:3082-3084`). So even the *generic*
  event system cannot currently boot a convention — the founding one is reached
  by a **hardcoded template case**, not this hook. A mid-game convention has **no
  wired trigger of any kind.**
- **★ Scenario boot is a hardcoded literal `GameState`; no start-at-a-phase / no
  convention-start.** Both scenarios build a fixed `GameState` object with a fixed
  `startYear` + `phaseId` (1856: `year:1856, startYear:1856, phaseId:'2.1.2'`,
  `scenario1856.ts:150-153`; 1772: `phaseId:'2.1.1'`, `scenario1772.ts:72-73`),
  `pendingConvention` unset, and (for 1856) `constitutionRatified:true` +
  hardcoded `constitutionalArticles` (`:181-190`). There is **no** scenario that
  boots into a `pendingConvention`, **no** parameterized start-year/start-phase,
  and **no** meters-preset knob exposed at boot. pman's "start AT a mid-game
  ConCon in 1930 with Dom-Stab+Econ worst" is a **new boot entry point** the two
  hardcoded builders do not support.
- **Convention UI exists but is founding-flavored.** `ConventionModal.tsx` renders
  the article votes but is hardcoded to **"Philadelphia, {year}"**
  (`ConventionModal.tsx:22`) — cosmetically tied to the founding, though the vote
  machinery is article-generic and could be reused for a mid-game convention.

**Net for tech-lead:** the entire **mid-game Constitutional Convention** subsystem
is unbuilt. Shipped = ONE founding convention (1787/1788), fired by a hardcoded
era-event case (`phaseRunners.ts:3182`), with generic article-voting + CPU
auto-fill + hardcoded-default "historical" fallback. Missing, per this thread:
(1) a **Domestic-Stability-lowest trigger** that enables the path; (2) a **per-state
"call a convention" governor action** with a **5 Gov-skill gate**; (3) a
**2/3-of-successful-states threshold** raced against Dom-Stab recovery; (4) a
**scenario-boot entry point** that starts *inside* a convention with pre-set
meters (Dom-Stab + Econ at worst) at a chosen crisis year. Reusable pieces:
`makeConvention` / `autoFillCPUVotes` / `applyConvention` / `ConventionModal`
(founding-flavored) and the `startConvention` postEffect type (declared, unwired).

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold; NEW items labeled
"NEW (consolidation to ID)".)*

- **HEADLINE → NEW (consolidation to ID) — the mid-game Constitutional Convention
  subsystem.** A crisis-triggered, mid-scenario path to rewrite the government.
  Shipped = founding-only convention, ONE hardcoded caller
  (`phaseRunners.ts:3182`, `makeConvention` at `constitutionalConvention.ts:6`); no
  crisis convention exists. If no existing ID owns "mid-game ConCon," this is NEW.
  0% built.
  - Sub-fact: **Dom-Stab-lowest TRIGGER.** `meters.domestic` (`types.ts:1403`) is
    read only by bill/cabinet effects; nothing gates a convention on it. Unbuilt.
  - Sub-fact: **5 Gov-skill state gate** on the call action. Grep `governing>=5`=0.
    Unbuilt.
  - Sub-fact: **2/3-of-successful-states threshold, raced vs Dom-Stab rising.**
    No convention-call threshold in code (the `2/3` in code = bill passage +
    amendment-article option, unrelated). Unbuilt.
- **TOUCHES #20 (governor-action overhaul).** The "call for a new Constitutional
  Convention" is a **new governor/state action** on the 2.5.2 phase, whose current
  state is the flat 30% skill-nudge stub (`phaseRunners.ts:3382-3392`, see
  `0ff5e582`). The 5-Gov gate is a concrete new gov-action + skill-check. Fold the
  convention-call action into the #20 gov-action model. 0% built.
- **TOUCHES the scenario-boot / start-anywhere cluster (#92 / #115 / #186 / #228).**
  "Start a playtest AT a mid-game ConCon (1930 / Reconstruction / 1968) with
  Dom-Stab + Econ at worst" is a **new boot entry point**: scenarios currently boot
  as hardcoded literal `GameState`s with fixed `startYear`/`phaseId`
  (`scenario1856.ts:150-153`, `scenario1772.ts:72-73`) and no convention-start,
  no meters-preset knob. Corroborates the post-1772 start-phase-entry work; adds
  "boot into a live `pendingConvention` with pre-set meters" as a required variant.
- **TOUCHES the Domestic Stability meter.** Corroborates that `meters.domestic`
  exists (`types.ts:1403`, label `labels.ts:51`) but is **purely a scored meter**
  (bill/cabinet in, no downstream *system trigger*). The designed mid-game-ConCon
  makes low Dom-Stab a *trigger condition* — a new consumer the meter lacks.
- **NEW (consolidation to ID) — `startConvention` postEffect is a declared-but-
  unwired hook.** `types.ts:1478` declares it; dispatcher handles only `assembleCC`
  and logs "Unhandled postEffect type" for the rest (`phaseRunners.ts:3059-3086`).
  A mid-game convention has NO wired trigger; wiring `startConvention` (or an
  equivalent) is a prerequisite. (Also flags 5 OTHER dead postEffect types:
  `startWar`/`unlockGovernors`/`unlockArticles`/`endWar`/`addPolitician`.)
- **CORROBORATES the founding ConCon system (CPU auto-fill + historical default).**
  `autoFillCPUVotes` + `preferredOption` (`constitutionalConvention.ts:81-123`) and
  the hardcoded article **defaults** in `applyConvention` (`:136-144`) reproduce
  POST 3's "CPUs back the historical option → country ends 'normal'." Shipped for
  1788; would need porting to any mid-game convention. Corroboration, not a gap.
- **MINOR — `ConventionModal` is founding-flavored ("Philadelphia").** Hardcoded
  header (`ConventionModal.tsx:22`); vote machinery is article-generic and reusable,
  but a mid-game convention needs de-founding of the UI copy. Low effort.
