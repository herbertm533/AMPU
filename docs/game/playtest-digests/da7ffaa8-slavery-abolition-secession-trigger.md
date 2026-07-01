# Digest — da7ffaa8 "Abolish Slavery Question" (the secession / Civil War TRIGGER ruleset)

**Type:** SECESSION / CIVIL-WAR TRIGGER RULESET — mechanics Q&A (rules ruling, not a
playthrough). **5 posts / 1 chunk** (`chunk-001.md`, all covered; source CSV ~1.6 KB),
dated **Aug 25–28, 2025**.
**Cast:** **@Bushwa777** (OP — asks the trigger question, POST 1; authoritative
answer, POST 2), **@Arkansas Progressive** ("AP" — the load-bearing rule, POST 3–4),
**@matthewyoung123** (the nullification-crisis exception detail, POST 5). Directed at
**@vcczar** (the lead) but answered by senior playtesters.
Cites `POST n` = `===== POST n =====`. **DIGEST ONLY** — no living-doc edits.

> **Why it matters:** this is the **authoritative statement of what *triggers* a
> Southern Secession / Civil War in AMPU** — the missing spec for a ~0%-shipped
> engine. It establishes a hard causal chain: **slavery being ACTIVE is the ONLY thing
> that can produce a Southern Secession**, the Civil War fires only once you reach
> **John Brown's Raid** with slavery still active, and therefore **abolishing slavery
> (by amendment OR a compensated-emancipation law) BEFORE John Brown's Raid SKIPS the
> Civil War entirely.** It also names a **separate, narrower** secession path — the
> **Nullification Crisis → South Carolina-only secession via the Tariff of
> Abominations** — that is independent of slavery and, if the main secession happens,
> folds SC into the CSA. The shipped build has **none** of this trigger logic: the
> `isSlaveState` flag is read by **zero** secession code, no bill/amendment can abolish
> slavery, and the CW is a **year-gated script (fires at 1860/1861 regardless of
> slavery state)**, not a consequence of the slavery flag.

---

## ★ The trigger ruleset (POST 1–5) — the canonical causal chain

**The question (POST 1, Bushwa777):** *"If my congress passes slavery abolishment via
amendment or a law that compensates people but have not had Civil War yet… do I
automatically skip Civil War or does the south automatically secede?"*
→ Two named abolition mechanisms are treated as legitimate: **(a) a constitutional
amendment**, **(b) a compensated-emancipation law** (a bill that pays slaveholders).

**★ Rule 1 — abolish-before-John-Brown ⇒ SKIP the Civil War (POST 2, Bushwa777):**
> *"If you abolish slavery that way and you haven't hit John Brown's Raid / John Brown's
> uprising. You skip the civil war."*
→ **John Brown's Raid is the POINT-OF-NO-RETURN GATE.** Abolishing slavery *before* you
reach that event cancels the war; abolishing *after* you have "hit" it does not (implied:
by then the war is locked in). The gate event is the existing 1859 era-event **"John
Brown's Raid on Harpers Ferry."**

**★ Rule 2 — slavery-active is the ONLY path to a Southern Secession (POST 3–4, AP):**
> *"basically the only way to get a Southern Secession is slavery is active and if you
> abolish slavery without the war then the war does not occur."*
→ The **`isSlaveState` / slavery-active state is the direct CAUSE** of the (main)
Southern Secession. No active slavery ⇒ no Southern Secession ⇒ no Civil War. This is the
authoritative statement that the slavery flag is meant to **drive the secession engine**.

**★ Rule 3 (EXCEPTION) — the Nullification-Crisis SC-only secession (POST 4, AP; POST 5,
matthewyoung123):**
> AP: *"Unless it's a Civil War over the nullification crisis… which I think can happen."*
> matthewyoung123: *"yea that's south carolina secession, via tariff of abominations.
> only SC leaves, and will join the CSA if they secede."*
→ A **SECOND, INDEPENDENT** secession path exists that is **NOT gated on slavery**:
  - **Trigger:** the **Nullification Crisis**, driven by the **Tariff of Abominations**.
  - **Scope:** **ONLY South Carolina secedes** (single-state, not a bloc).
  - **Interaction:** if the **main (slavery-driven) secession** also occurs, **SC joins
    the CSA**. So the nullification path is a smaller, earlier SC exit that can either
    stand alone or merge into the larger Confederacy.

**Net trigger model (as designed):**
`slavery active` **AND** reach `John Brown's Raid` ⇒ Southern Secession ⇒ **Civil War**.
`slavery abolished` (amendment / compensated-emancipation) **before** John Brown's Raid
⇒ **no secession, no Civil War**.
**Separately:** `Nullification Crisis (Tariff of Abominations)` ⇒ **SC-only** secession
(slavery-independent) ⇒ SC folds into CSA iff the main secession fires.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-07-01)

**Net: the ENTIRE trigger ruleset above is UNBUILT.** The shipped build has the *pieces*
(a slavery flag, a John Brown event, secession/CW era-events with `startWar`) but **none
of the causal wiring** — no slavery gate, no abolition mechanism, no John-Brown
point-of-no-return, no nullification path.

- **★ `isSlaveState` is read by ZERO secession/CW code (confirms #288 wall).**
  `isSlaveState` is declared at `types.ts:1329` and set on states in `states1856.ts`,
  `states1772.ts`, `expansionStates.ts`, and on newly-admitted territories
  (`admitState`, `phaseRunners.ts:3175`: `isSlaveState: t.region === 'South' || t.region
  === 'Border'`). Its **only reader in all of `src/` is a display cell** on the States
  page (`StatesPage.tsx:20`, the "Slave?" column). **No engine code reads it** — grep of
  `isSlaveState` across `src/` returns only the type decl, the data seeds, the
  `admitState` writer, and that one UI cell. It drives **nothing**: not elections, not
  secession, not events. This is exactly the **#288** slavery-flag wall (b60's note: the
  flag exists but is inert / national-only effect channel); **b61 adds that the SECESSION
  TRIGGER is another intended consumer the flag does not feed.**

- **★ The John Brown proxy uses a HARDCODED constant, not the mutable flag.** The John
  Brown event modulation (`phaseRunners.ts:2921–2950`, `templateId === 'johnBrown1859'`)
  routes pro-/anti-slavery cabinet reactions via **`SLAVE_STATES_1856`** — a hand-rolled
  15-element string array (`types.ts:1152–1155`) — NOT `state.isSlaveState`. Its own
  comment (`types.ts:1148–1151`) says it is "a state proxy for slavery position" and that
  "Secession Winter loyalty decay reads `state.region` directly, not this set." So even
  the one slavery-adjacent event reads a **frozen 1856 snapshot**, meaning an in-game
  abolition (were it possible) would **not** change John Brown's behavior.

- **★ Secession / Civil War is a YEAR-GATED SCRIPT, not slavery-triggered (~0% of the
  designed engine).** Three era-events in `eraEvents1856.ts` cover the endgame:
  - **`johnBrown1859`** (`:82`, year 1859) — exists as a scripted event, but is a plain
    3-response meter/enthusiasm event. It is **NOT a point-of-no-return gate**; nothing
    keys off "have you passed it yet" for war eligibility.
  - **`southern-secession-threat`** (`:107`, `year >= 1860`) — response **r1 carries
    `startWar` ('American Civil War' vs 'Confederate States')**; r3 flavor-text says "The
    Confederate States of America is born." **Fires on the year gate alone** — no check of
    slavery-active or of any abolition having passed.
  - **`secession-winter`** (`:136`, `year >= 1861`) — a cabinet-defection sim
    (`runSecessionWinterDefections`, `phaseRunners.ts:3028–3054`) that decays cabinet
    `loyalty` by **(state `region` × ideology)** tables — again **not** the slavery flag —
    and **force-injects `startWar` when ≥2 cabinet members defect** (`:2980–2982`, AC #36
    "civil war is unavoidable"). Also year-gated, **slavery-agnostic**.
  → **The Civil War therefore fires regardless of whether slavery is active or was
  abolished.** There is **no gate** implementing Rules 1–2 above. Abolishing slavery
  today would **not** skip the war.

- **★ `startWar` produces a bare war record — no CSA, no state secession, no
  Reconstruction.** `applyEffect`'s `startWar` branch (`phaseRunners.ts:3240–3254`) only
  pushes `{ id, name, enemy, startYear, warScore:0, generals, battles:[] }` to
  `snap.wars` and logs a milestone. **No CSA entity, no state leaves the Union, no
  territory/EV transfer, no Reconstruction phase.** The "Confederate States" is a string
  label on a war record, not a modeled polity. The designed "SC joins the CSA" / "11 CSA
  states" outcome has no representation.

- **★ NO abolition mechanism exists — slavery cannot be abolished in-game.** grep
  `abolish|emancipat|compensat` across `src/`: the **only** slavery-adjacent artifacts are
  (a) a **`GradualEmancipation` ideology card** (`types.ts:326,360`; a faction flavor tag,
  e.g. Crittenden Republicans `factions1856.ts:12`) with **no legislative effect**, and
  (b) the constitutional **`amendmentProcess` article** (`types.ts:1394`,
  `constitutionalConvention.ts`) which only sets **how** amendments pass (3/4 · 2/3 ·
  unanimous), **not** any slavery content. **No bill, law, or amendment can flip
  `isSlaveState` to false** — there is no compensated-emancipation law and no abolition
  amendment. Both of Bushwa777's named mechanisms (POST 1) are **unbuilt**. (Note: even
  the legislation system generally cannot mutate `isSlaveState` — no bill effect targets
  that field.)

- **★ NO nullification-crisis path AT ALL.** grep `nullif|Nullif|Tariff of Abom|
  abominations` across `src/` → **0 hits.** There is **no Nullification Crisis event, no
  Tariff of Abominations, no SC-only secession, no single-state secession mechanic**. Rule
  3 is **entirely unrepresented** (not even a scripted stub, unlike the main CW).

---

## Delta list — map to EXISTING gap IDs (consolidation owns the write)

- **SHARPENS #288 (the inert `isSlaveState` flag) — this Q&A is the AUTHORITATIVE reason
  the flag must exist: it is meant to be the SECESSION TRIGGER.** b60 noted the flag +
  the national-only effect-channel wall; **b61 adds the concrete downstream consumer**:
  `slavery active` is *the only* thing that can cause a Southern Secession (POST 3–4).
  Requirement: `isSlaveState` (or a national "slavery-active" state) must **gate the
  secession/CW engine**. Today it is read only by `StatesPage.tsx:20`. (Source: POST 3–4;
  code `types.ts:1329`, `StatesPage.tsx:20`, `phaseRunners.ts:3175`.)

- **SHARPENS the secession / Civil War engine gap — supplies the missing TRIGGER spec
  for a ~0%-shipped engine.** The shipped CW is a **year-gated script** (`southern-
  secession-threat` @1860, `secession-winter` @1861) with no slavery/abolition gate;
  `startWar` yields only a war record (no CSA/secession/Reconstruction). The authoritative
  trigger is: **slavery-active + reach John Brown's Raid ⇒ CW.** Requirement: gate the
  existing secession events on the slavery flag, not (only) on year. (Source: POST 2–4;
  code `eraEvents1856.ts:82,107,136`, `phaseRunners.ts:2980,3240`.)

- **NEW (consolidation to #288 / the secession-engine gap) — the "abolish-before-John-
  Brown ⇒ SKIP Civil War" gate.** A **point-of-no-return** on the `johnBrown1859` event:
  if slavery is abolished *before* that event resolves, suppress the secession/CW events;
  after, the war is locked. No such gate/flag exists (John Brown is a plain meter event;
  nothing tracks "passed it yet" for war eligibility). (Source: POST 2; code
  `eraEvents1856.ts:82`, `phaseRunners.ts:2921`.)

- **NEW (consolidation to #288 / the secession-engine gap) — an ABOLITION mechanism that
  flips `isSlaveState` (amendment OR compensated-emancipation law).** No bill/law/amendment
  can set slavery inactive today (`GradualEmancipation` is inert flavor;
  `amendmentProcess` only sets the passage bar). This is the **input** the whole trigger
  chain depends on. (Source: POST 1; code `types.ts:326,360,1394`, `factions1856.ts:12`.)

- **NEW (consolidation — likely a distinct sub-gap under the secession engine) — the
  NULLIFICATION-CRISIS / SC-only secession path.** Slavery-independent: **Tariff of
  Abominations ⇒ South Carolina alone secedes**, and **SC joins the CSA iff the main
  secession fires.** Zero code (`nullif`/`abominations` → 0 hits) — no event, no single-
  state secession, no tariff trigger. Flag NEW: this path appears **unowned** (grep
  game-context for "nullification"/"Tariff of Abominations"). Needs a single-state
  secession mechanic that the main-CW code can later absorb. (Source: POST 4–5.)

- **NEW (consolidation — under the secession engine) — a real CSA / state-secession
  model.** The design implies **states LEAVE the Union** (a bloc of Southern states, plus
  possibly SC via nullification) forming a **CSA that states can JOIN**. The build has no
  polity model: `startWar` only names "Confederate States" on a war record; no state
  changes status, no EV/territory transfer. (Source: POST 3–5; code
  `phaseRunners.ts:3240–3254`.)

## Open questions (for the human / consolidation)

- **What exactly does "hit John Brown's Raid" mean for the gate?** The *year* the event
  becomes available (1859), the turn it *resolves*, or a flag set once the player has
  seen/answered it? (POST 2 says "haven't hit … you skip"; the boundary needs a precise
  definition.)
- **Does the John-Brown gate also cover the compensated-emancipation LAW path, or only the
  amendment?** POST 1 names both; POST 2's "abolish slavery that way" is ambiguous about
  whether the law and the amendment share the same pre-John-Brown deadline. (Assume both,
  pending confirmation.)
- **Can the Nullification Crisis fire on its own timeline (pre-John-Brown, tariff-driven)
  independent of the slavery gate?** matthewyoung123/AP treat it as a separate CW cause;
  its year/trigger relative to John Brown is unspecified. And does SC seceding via
  nullification, then the main secession NOT occurring, leave SC out of any CSA (i.e. an
  independent SC)? ("will join the CSA **if** they secede" implies SC can be out alone.)
- **Post-abolition: does skipping the CW also skip Secession Winter / the Secession Threat
  events entirely, or do they still fire as no-ops?** (Design says "the war does not
  occur"; the events are currently unconditional at 1860/1861.)

## Sources

- **da7ffaa8** "Abolish Slavery Question", **5 posts / 1 chunk, Aug 25–28, 2025.** OP
  **Bushwa777** (POST 1 question, POST 2 answer); **Arkansas Progressive** (POST 3–4, the
  slavery-active-only rule + nullification exception); **matthewyoung123** (POST 5, the
  Tariff-of-Abominations SC-only detail). Directed at **vcczar**. Code verified @
  `src/types.ts`, `src/engine/phaseRunners.ts`, `src/data/eraEvents1856.ts`,
  `src/data/states1856.ts`, `src/data/factions1856.ts`, `src/pages/StatesPage.tsx`
  (HEAD 2026-07-01). Cited posts: **1, 2, 3, 4, 5.**
