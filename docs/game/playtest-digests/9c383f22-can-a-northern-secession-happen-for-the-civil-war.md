# Digest — "Can a Northern secession happen for the Civil War" (`9c383f22`, topic 4470)

**Scope:** A short design Q&A thread (16 posts, ~5k chars, May 30–31 2023) that
**extends the Civil-War / secession subsystem**. Not a playthrough — a rules
clarification by the devs (vcczar, MrPotatoTed) and lead playtesters
(theFreezerFlame/themiddlepolitical, Arkansas Progressive, Euri, Ich_bin_Tyler)
about *how* secession, CSA membership, border states, and Reconstruction are
*supposed* to work. Pure mechanics deltas; no narrated game.

**Cross-refs:** Extends the b46 Civil-War gap cluster (#56 war / #57
Reconstruction / #58 secession / #156 / #157 / #284). The Civil-War→Reconstruction
arc with humans on both sides is documented in the b46 house-divided digests
(`c015a0cb` POST 2693-2694; `77db6e6f`). Slavery is a **per-state flag**
(`isSlaveState`, see b47 Slavery digest + #258). Era framing:
`docs/game/historical-context.md` §3 (Antebellum). **No gap numbers assigned —
consolidation owns that.**

---

## Shipped reality (verified against the codebase, for the gap framing)

The b46 tech-lead pinned the shipped Civil-War abstraction at
`phaseRunners.ts:3001-3054`. Confirmed still accurate this batch:

- **The CW is a single scripted event, not a per-state cascade.** The 1856
  "Secession Winter" / "southern-secession-threat" era events
  (`eraEvents1856.ts:107-186`) resolve the whole crisis as **(a) up to 4 cabinet
  defections** — `runSecessionWinterDefections` over `{Treasury, War, Interior,
  State}`, loyalty decay by `state.region × ideology`, defectors get the
  `'Traitor'` trait and vacate their seat (`phaseRunners.ts:3028-3054`) — **plus
  (b) `startWar({ name: 'American Civil War', against: 'Confederate States' })`**
  (`phaseRunners.ts:2980-2982`; `eraEvents1856.ts:115,149`). The "Confederate
  States" is a **war opponent string**, not a set of actual states that leave the
  Union.
- **Per-state slavery IS already a flag:** `State.isSlaveState: boolean`
  (`types.ts:1329`), set per row in `states1856.ts` and shown in the States UI
  (`StatesPage.tsx:20`). Newly admitted territories get
  `isSlaveState: t.region === 'South' || t.region === 'Border'`
  (`phaseRunners.ts:3175`). **TN ships as `isSlaveState: true`** (`states1856.ts:26`).
- **NOT in the build:** any code that (i) actually secedes/removes states from
  the Union, (ii) lets the **North / New England** secede, (iii) gates CSA
  membership on `isSlaveState`, (iv) branches Reconstruction by who won, or
  (v) models non-playable rump states. The per-state cascade /
  Northern-secession / slavery-gating / Southern-Reconstruction-branch the forum
  describes below are **designed depth absent from the shipped abstraction.**

So everything this thread describes is the **forum/spreadsheet ("Misc Rules" +
scripted events) ruleset**, which is materially deeper than the React build's
4-defections-plus-`startWar` placeholder.

---

## What the thread establishes (designed intent)

### ★ 1. Northern / New England secession CAN happen (POST 2-6)
- "Can a Northern secession happen for the Civil War?" → **"Yep! - it can"**
  (themiddlepolitical, POST 2).
- **The smallest USA the human can play as = PA / DE / MD / NJ** (POST 4-6).
  theFreezerFlame: *"The smallest USA you can play as is like PA, DE, and MD…
  You wouldn't play as New England (which could succeed) or the CSA."* (POST 4).
  MrPotatoTed **confirms and adds NJ**: *"I think New Jersey is part of that too.
  So New England can secede, but PA/DE/MD/NJ cannot."* → *"Easy to forget Jersey"*
  (POST 5-6). "succeed" is a typo for "secede."
- **Implications:** (a) secession is **bidirectional** — New England is a
  secession-capable bloc, not just the South; (b) secession can **shrink the
  human's playable core** down to a PA/DE/MD/NJ rump; (c) **some blocs are
  non-playable**: you cannot play as **New England** or as the **CSA** — they
  exist as **non-playable rump states / factions**, not human-controllable.
  → New design vs. the build (which has no Northern secession and no concept of
  a non-playable seceded bloc).

### ★ 2. Southern-led Reconstruction branch (POST 3)
- If the North loses / South wins, there is a **mirror Reconstruction track**.
  theFreezerFlame: *"What would the legislation for a Southern-led Reconstruction
  be? Probably some of the most racist stuff imaginable tbh, with factions having
  the 'Civil Rights' card being expelled from government."* (POST 3).
- Design read: Reconstruction is **outcome-branched**. The existing
  (North-wins) Reconstruction tug-of-war (#57 / #156 / #284; b46 `c015a0cb`,
  `77db6e6f`) has a **South-wins inverse**: legislation flips to the **most
  racist form**, and **`CivilRights`-card factions are EXPELLED from government**.
  - Anchor in shipped data: faction issue cards include **`CivilRights`** and
    `SlaveryRights` / `StatesRights` / `Abolition` / `Antislavery`
    (`eraEvents1856.ts:325-361`), so the "Civil Rights card" the post names is a
    real faction tag the branch could key on. The **expulsion-from-government
    mechanic itself is not in the build.**

### 3. CSA membership = historical set *if the states exist* (POST 7-9)
- Euri: *"In the case that the Confederacy secedes, is it always the same states
  (provided they exist) as the historical CSA?"* → **"Yes"** (Arkansas
  Progressive, POST 8; restated POST 9). Baseline CSA = the historical 11-state
  set, conditioned on those states existing in the current game.
- **But this baseline is event-mutable** (see 4 & 6). Arkansas Progressive adds
  there **should be rules for whether the Upper South secedes**, expecting them in
  the **"Misc Rules" section** (POST 9).

### 4. Border states handled by a scripted event (POST 10)
- vcczar: the Upper-South / border rules **"are in scripted events. Secession
  Fervor Reaching Border States but that only includes MD, DE, MO, and KY. Quite
  a bit of events over the Confederacy establishing themselves."** (POST 10).
- So **border states (MD, DE, MO, KY)** have a **dedicated scripted event
  ("Secession Fervor Reaching Border States")** that decides whether each
  secedes — i.e. they are **not auto-assigned**; they **may or may not** join.
  - Shipped border set matches: DE/MD/KY/MO all carry `region: 'Border'` in
    `states1856.ts:14-15,27-28`. The **event does not exist in the build.**

### ★ 5. Secession gated on the per-state SLAVERY flag (POST 11-14) — the anomaly + the rule
- **Reported anomaly:** Arkansas Progressive recalls a CW playtest where
  **TN had abolished slavery before the CSA formed yet still seceded** — *"Why
  would a state that had abolished slavery join the Confederacy?"* — and proposes
  *"a rule that only states that haven't abolished slavery can join a Southern
  rebellion."* (POST 11). He asks if there's a **"rule fix to prevent the
  Alternate Tennessee secession."** (POST 13).
- **The rule (predicate-gating refinement):** theFreezerFlame: **"If TN has
  slavery enabled, then they may secede; if not then they won't unless another
  event enables slavery and they join the confederacy."** (POST 14). I.e.
  **only slavery-enabled states join a Southern rebellion**; secession is gated on
  the **per-state slavery flag**, and re-enabling slavery (via event) can re-open
  a state to secession.
- **Maps directly onto shipped data:** the "slavery enabled / abolished" state is
  `State.isSlaveState` (`types.ts:1329`). The TN bug is literally the static row
  `tn … isSlaveState: true` (`states1856.ts:26`) — the build has **no logic that
  flips it on abolition and no gate that reads it for secession eligibility**, so
  the designed rule "secession-eligible ⟺ `isSlaveState === true`" is unbuilt.
  Cross-ref the **b47 Slavery digest** (slavery-enabled is a mutable state flag)
  and **#258**.
- **Upper-South nuance:** the Upper South should get **its own secession rules**
  (Arkansas Progressive, POST 9), enforced via the scripted events of 4 & 6.

### 6. Secession is event-driven, not static (POST 12, 15-16)
- theFreezerFlame (correcting himself): *"There are several events that change who
  initially secede and whether or not new states join them."* (POST 12).
- Ich_bin_Tyler: these events **"might have been added after our scenario"** —
  their playtest searched the events to see if Northern secession could happen
  even though it didn't fire (POST 15). theFreezerFlame: **"yea there's quite a
  bit of new civil war related events."** (POST 16).
- Design read: the CSA roster (3) is a **starting baseline**; a **family of
  scripted CW events** then **mutates who initially secedes and whether
  additional states join later** — i.e. the secession set is **dynamic and
  event-resolved**, the opposite of the build's single fixed `startWar` opponent.
  This is also the thread's dating caveat: the per-state secession event system
  is **newer than the playtest that produced the TN anomaly**, so older
  playthrough exports may show the pre-fix behavior.

---

## Open questions (for the human)

- **Northern secession trigger:** what *causes* New England to secede (a
  Southern-Reconstruction-style branch where the South wins/dominates? a distinct
  era event?) is not specified here — only that it's possible and yields a
  non-playable New England bloc. (POST 2-6.)
- **Rump-state boundary precision:** is PA/DE/MD/NJ the *exact* invariant minimum,
  or the example floor? MrPotatoTed states it as the rule but the phrasing began
  as "like PA, DE, and MD." (POST 4-6.)
- **Southern-Reconstruction branch detail:** the specific legislation slate and
  the exact "expel CivilRights-card factions from government" mechanic are
  asserted as design but not enumerated. (POST 3.)
- **Slavery-flag dynamics:** what events flip `isSlaveState` on/off mid-game
  (abolition; re-enabling) — needed to make the secession gate behave. Owned by
  the b47 Slavery digest / #258. (POST 11-14.)

---

## Deltas vs current build

**Headline: Northern / New-England secession + slavery-flag-gated CSA membership +
a Southern-led Reconstruction branch + non-playable rump states all EXTEND the
Civil-War subsystem beyond the shipped 4-defections-plus-`startWar` abstraction
(`phaseRunners.ts:3001-3054`).** All five are designed depth, not in the build:

1. **Northern / New England secession** — the *North* can secede; New England is a
   secession-capable, **non-playable** bloc. Build has no Northern secession path.
   (POST 2-6.)
2. **Playable-core can shrink; non-playable rumps exist** — smallest playable USA
   = **PA/DE/MD/NJ**; the human **cannot play New England or the CSA**. Build has
   no notion of a non-playable seceded bloc or a shrinking playable core.
   (POST 4-6.)
3. **Slavery-flag-gated CSA membership** — a state joins a Southern rebellion
   **only if its per-state slavery flag is enabled** ("if TN has slavery enabled,
   they may secede; if not, they won't"). Shipped `isSlaveState` exists
   (`types.ts:1329`) but is **never read for secession eligibility**; fixes the
   reported **Alternate-Tennessee** anomaly. (POST 11-14; xref b47 Slavery, #258.)
4. **Southern-led Reconstruction branch** — South-wins inverse of Northern
   Reconstruction: legislation flips to the most racist form and **CivilRights-card
   factions are expelled from government**. Build has no Reconstruction-outcome
   branch and no faction-expulsion mechanic. (POST 3; xref #57/#156/#284.)
5. **Event-driven, dynamic secession set** — a "Secession Fervor Reaching Border
   States" event decides MD/DE/MO/KY, and a family of CW events mutates *who*
   initially secedes and *whether new states join*. Build resolves the CSA as a
   single fixed `startWar` opponent with **no per-state cascade**. (POST 7-16.)

`wc -l`: see below.
