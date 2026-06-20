# Spec: Trait Pass B — Governance traits + era-event expertise routing (PR6)

## CP1 USER REVISION — Loyalty data model (binding override)

User at CP1 chose **option (b) Add `loyalty: number` field on Politician**
over the PM's recommended (a) ideology+state proxy. Real schema change.

Spec sections affected (architect at CP2 reconciles):

1. **`Politician` type**: add `loyalty: number` field (default 1.0,
   range [0.0, 1.0] where 1.0 = fully loyal to Union). Add to `repair()`
   migration: existing saves default to 1.0.

2. **Loyalty decay formula** (architect specifies at CP2): during
   Secession Winter event resolution (and any future loyalty-stressing
   event), every cabinet member's loyalty decays by an amount computed
   from a `LOYALTY_DECAY` table indexed by (state-region, ideology).
   Sub-threshold loyalty triggers defection.

3. **Secession Winter event** (Section I): reads the actual loyalty
   value (not just ideology+state proxy) for defection check. Threshold
   ~`loyalty < 0.4` → defect. Architect locks exact threshold.

4. **CURATED_ROWS** (Section L): marquee figures with non-default
   starting loyalty get explicit values:
   - Cobb (GA), Floyd (VA), Thompson (MS) → `loyalty: 0.5` (already
     wavering by Dec 1860)
   - Cass (MI, pro-Union despite Southern sympathies) → `loyalty: 0.9`
   - Other figures default 1.0 (no explicit value needed)

5. **Decay during non-crisis turns**: out of scope unless architect
   identifies it as needed. Likely the decay fires only DURING crisis
   events, not as passive per-turn drift.

6. **Out-of-era saves**: 1772 politicians get default 1.0 loyalty
   (no defection mechanic in 1772 scenario; field is dormant).

The other two CP1 questions resolved at PM recommendations (no override):

- **Q5 fading pool**: Add Crisis Admin + Crisis Gov + Decisive General
  to `oldAge.fadingPool` (PM rec).
- **Q4 code labels**: KEEP Crisis Admin, Crisis Gov, Delegator,
  Micromanager (PM rec — Carpetbagger / Cosmopolitan precedent).

Below is the PM's full spec — apply as written **except** that wherever
"ideology+state proxy" appears as the loyalty mechanic, the architect
substitutes the `loyalty: number` field-driven approach per items 1-6
above.

---

## Vision (as given)

PR6 is the **payoff PR for PR1's expertise axis and PR5's expertise-aware
cabinet.** PR4a/PR4b shipped 22 election-facing traits and their per-context
magnitudes. PR5 made the cabinet era-conditional and gave it expertise scoring
plus one visible governance tell (the `+0.2` lingering-phase bonus). PR6 closes
the "what does cabinet quality DO" loop with **two interlocking pieces**:
**(A)** 10 new governance-facing traits added to the `Trait` union with
per-context magnitudes in 4 new governance contexts (`governance_crisis`,
`lingering_phase`, `military_command`, `internal_party`), and **(B)** four 1856
era events wired to consult cabinet expertise + governance traits — Dred Scott
(modify existing `decider: 'cabinet'` event), John Brown's Raid (modify
existing `decider: 'president'` event), **Secession Winter** (NEW event
distinct from the existing "Southern Secession Threat" pre-election trigger),
and **Trent Affair** (NEW event). All directional bands reuse PR4a's
`SMALL=2, MEDIUM=4, LARGE=8` for consistency. Delegator and Micromanager
introduce **multiplier-on-cabinet-effects** mechanics. Era-event routing is
1856-only for PR6 (1772 governance events deferred per historian §6). 15-25
marquee CURATED_ROWS attributions per historian §4 (with Buchanan correction:
Passive + Naive Strategist, NOT Iron Fist). The Secession Winter cabinet-
loyalty check uses **ideology + state proxies** (no new schema). John Brown
likewise uses ideology + state in lieu of an explicit slavery-position
attribute.

## Historical grounding (binding)

Source: `docs/research/trait-pass-b-governance-historical-context.md` (the
historian's PR6 brief, ~1,086 lines). Pairs with the canonical
`docs/research/source-abilities-expertise-traits.md` and the PR5 cabinet
brief.

**Binding facts from the historian's brief — every mechanic below respects
these. Deviations are explicitly flagged in Open questions.**

- **F-TRAITS-10-DIRECTIONAL (historian §1).** The 10 governance traits have
  historian-locked directional magnitudes across the 4 governance contexts.
  Locked figures per trait (canonical anchors PR6 attributes via
  CURATED_ROWS):
  - Crisis Admin → Hamilton (Panic of 1792), Morris (1781-84), Gallatin
    (1801-14), Chase (1861-64).
  - Crisis Gov → Lincoln (1861 inaugural + habeas), Washington (Whiskey
    1794), Adams (XYZ 1798). **Buchanan is the anti-case.**
  - Decisive General → Grant, Sherman, Washington (Trenton/Princeton),
    Jackson (New Orleans), Greene (Southern Campaign).
  - Naive Strategist → McClellan (Peninsula), Burnside (Fredericksburg),
    St. Clair (Wabash 1791), Hull (Detroit 1812), Gates (Camden), Floyd
    (Utah War + cannon redistribution).
  - Domestic Warrior → Calhoun (nullification), Clay (compromises),
    Sumner (Crime against Kansas), Madison (Bill of Rights), Henry
    (Anti-Federalist).
  - Iron Fist → Jackson (1832-33 nullification; pre-scenario), Polk
    (Mexican War), Lincoln (habeas — **contested**), Stanton (press
    suppression), Adams (Sedition Acts).
  - Delegator → Lincoln (Team of Rivals), Washington (1789-97), Taylor
    (1849-50).
  - Micromanager → Polk (25-vol diary), Adams (1797-1801).
  - Overeager → Pierce (KS-NE), Polk (May 1846 war message), Clay (1812
    War Hawk), Hamilton (Quasi-War escalation).
  - Master Kingmaker → Clay (1824 Corrupt Bargain), Van Buren (Albany
    Regency + 1844 Polk dark-horse), Weed, Douglas (Pierce 1852),
    Hamilton (1800), Burr (Tammany 1800).
- **F-EVENTS-FOUR-LOCKED (historian §2, §9 Q1).** Recommended scope is
  **4 events**: Dred Scott (modify existing), John Brown (modify
  existing), Secession Winter (NEW, distinct from current "Southern
  Secession Threat"), Trent Affair (NEW). Defer Bleeding Kansas
  (retrofit risk) and KS-NE Act fallout (not a single resolvable
  event). PR6 ships exactly these 4.
- **F-CONFLICT-PAIRS-FIVE (historian §3).** 5 new conflict pairs lock —
  3 reuse existing AMPU negatives, 2 are within the 10 new traits:
  Decisive General ↔ Naive Strategist (new ↔ new), Delegator ↔
  Micromanager (new ↔ new), Domestic Warrior ↔ Domestic Apathy
  (new ↔ existing), Master Kingmaker ↔ Outsider (new ↔ existing),
  Overeager ↔ Passive (new ↔ existing). Crisis Admin, Crisis Gov,
  Iron Fist remain standalone (no historically clean opposite in
  AMPU's set). Domestic Apathy / Outsider / Passive verified extant
  in `Trait` union at `src/types.ts:62-107` (Passive line 86,
  Domestic Apathy line 90, Outsider line 101).
- **F-BUCHANAN-CORRECTION (historian §4 notes).** Buchanan's
  documented historical profile is **Passive + Naive Strategist —
  NOT Iron Fist**. The PR6 vision's "Buchanan = Iron Fist" framing
  is historically backwards (Buchanan failed BY not exercising
  authority during the secession crisis). PR6 attributes Buchanan
  = Passive + Naive Strategist. Floyd carries Iron Fist (the
  cabinet-level Southern authoritarian on the Utah War + cannon
  redistribution) AND Naive Strategist (the Utah War + delayed John
  Brown response).
- **F-ANACHRONISMS-DISPLAY-LABEL-SUGGESTIONS (historian §5).** "Crisis
  Admin" / "Crisis Gov" / "Delegator" / "Micromanager" are flagged
  as technocratic / 20c-coded but conceptually fine in both eras.
  Historian suggests display labels "Financier" / "Steady
  Statesman" / "Hands-off" / "Hands-On" if the PM wants era-honest
  UI. PR6 KEEPS code labels per the PR4b Carpetbagger /
  Cosmopolitan precedent — display polish is a future PR.
- **F-LOYALTY-NO-SCHEMA (historian §10).** AMPU has no `loyalty`
  attribute on Politician and no `slaveryPosition` field. The
  Secession Winter cabinet-defection mechanic and the John Brown
  raid response mechanic both **use existing data**: `factionId`,
  `ideology`, and `state` as proxies. (Cobb GA pro-slavery, Floyd
  VA pro-slavery, Thompson MS pro-slavery, Cass MI pro-Union all
  map cleanly to ideology + state under the current schema.)
- **F-1856-ONLY-FOR-EVENTS (historian §6 recommendation).** PR6
  scopes era-event routing to the **1856 scenario only**. The 10
  new traits land in the `Trait` union AND on the 1772 CURATED_ROWS
  (Washington = Delegator + Decisive General; Hamilton = Crisis
  Admin; St. Clair = Naive Strategist; Morris = Crisis Admin; etc.)
  — but no 1772-era event nodes are touched in PR6. The 1772 era-
  event graph (2.4.3) has 49 scripted nodes with counterfactual-
  aware preconditions; wiring expertise / trait routing into the
  graph would destabilize `ERA_GRAPH_RULES`. Defer.
- **F-CRISIS-MANAGER-COEXISTS (historian §preamble + §9 Q9).** The
  existing `Crisis Manager` trait (already in PR2a's
  `MORTALITY_RULES.crisisManagerDeathMult` as a 0.85 death
  multiplier) is the umbrella "competent under pressure" tag.
  Crisis Admin and Crisis Gov are specialized expertise-conditioned
  forks — both **co-grantable** with Crisis Manager (e.g. Hamilton
  carries Crisis Manager + Crisis Admin; Lincoln carries Crisis
  Manager + Crisis Gov). PR6 does NOT retire or rename Crisis
  Manager.
- **F-MK-KINGMAKER-RULES-SEPARATE (historian §10).** AMPU's existing
  `KINGMAKER_RULES` (`types.ts:275-287`) is a Backroom-track gating
  system tied to the existing `Kingmaker` trait — separate from the
  new `Master Kingmaker`. PR6 treats Master Kingmaker as a **purely
  additive** `internal_party` bonus — no overlap, no multiplier on
  `KINGMAKER_RULES`. The 7-line `KINGMAKER_RULES` block is untouched.
- **F-EVENT-MECHANISM-MULTIPLIER (historian §7).** For each of the 4
  events, the load-bearing mechanism is **multiplier on meter
  swings** (high cabinet expertise softens / sharpens the chosen
  response's effect). Trent Affair additionally takes a **log voice
  shift** (Seward's note-framing language). The other 3 events use
  multiplier-only.

## Player experience

PR6 makes **cabinet quality and presidential character read in
governance** for the first time in AMPU. A 1857 player carrying Buchanan
as President with Cobb (Treasury, GA), Floyd (War, VA), and Thompson
(Interior, MS) in cabinet hits Secession Winter (Nov 1860) and **watches
the cabinet defect** — three resignations in the same event, mirroring
the historical Cobb/Floyd/Thompson exits. A Lincoln-style President
carrying Delegator gets a **multiplier on cabinet effects** so a Seward
(high Foreign Affairs expertise) at State actually handles Trent Affair
the way Seward did — a "release with face-saving framing" outcome where
a Micromanager Polk would have pushed it to war with Britain. The Dred
Scott event no longer fires as a flat ternary; it routes through the
Attorney General's `Justice` expertise (Black's law training would have
moderated the response) and the President's `Iron Fist` / `Crisis Gov`
trait (an Iron Fist Buchanan endorses harder; a Crisis Gov Lincoln
quietly resists). John Brown's Raid asks the Secretary of War: high
`Military` expertise + Decisive General → clean Marines dispatch in 36
hours (the historical Lee outcome); low expertise + Naive Strategist
(Floyd's actual profile) → bungled response, Brown's letters surface
the Secret Six funding, Northern outrage compounds. **Military command**
in active wars (`runPhase_2_3_2_Military`) now reads Decisive General as
a Command bonus and Naive Strategist as a penalty — Grant gets a
modulated up; McClellan gets a modulated down. **Master Kingmaker** lets
a player drafting Van Buren or Clay engineer internal-party plays at
LARGE magnitude. **Overeager** at the President is the Pierce signal —
the trait nudges crisis-event likelihood up (but per PM scope, just adds
internal-party and crisis flavor in PR6; no threshold mechanic). PR6 is
the first PR where a poorly built cabinet visibly costs the player a
crisis, and the right cabinet visibly saves one.

## User story

As a player running the 1856 scenario across the late 1850s into the
secession winter, I want my **cabinet's expertise** to modulate the four
locked governance events (Dred Scott, John Brown, Secession Winter,
Trent Affair) — high `Justice` Attorney General softens Dred Scott; high
`Military` War Secretary cleans John Brown; high `Foreign Affairs` State
Secretary saves Trent Affair from a UK war; a southern-ideology + slave-
state cabinet trio bleeds the Secession Winter — and my **President's
governance traits** (Crisis Gov, Delegator, Micromanager, Iron Fist) to
modulate the magnitude of every cabinet effect on top of that, so the
cabinet I built in PR5's selection actually matters when crises fire.
I also want **10 new governance traits** to layer into the `lingering_
phase`, `internal_party`, and `military_command` contexts so my picks
read between crises, and **5 new conflict pairs** so a politician
can't be both Decisive General and Naive Strategist, Delegator and
Micromanager, etc.

## Scope of THIS spec (PR6 — XL, biggest scope yet alongside PR5)

PR6 covers:

- **(A)** 10 new entries in the `Trait` union in `src/types.ts:62-107`:
  `Crisis Admin`, `Crisis Gov`, `Decisive General`, `Naive Strategist`,
  `Domestic Warrior`, `Iron Fist`, `Delegator`, `Micromanager`,
  `Overeager`, `Master Kingmaker`. Plus per-trait classification into
  `POSITIVE_TRAITS` / `NEGATIVE_TRAITS`.
- **(B)** New `TRAIT_GOVERNANCE_EFFECTS` table in `src/types.ts` —
  per-context magnitudes for all 10 traits across 4 governance contexts
  (`governance_crisis`, `lingering_phase`, `military_command`,
  `internal_party`). Uses PR4a's `SMALL=2 / MEDIUM=4 / LARGE=8` bands
  (renamed `TRAIT_GOVERNANCE_BANDS` for clarity, but numerically
  identical).
- **(C)** 5 new `TRAIT_CONFLICTS` pairs (10 map entries — 5 pairs × 2
  directions): Decisive General ↔ Naive Strategist, Delegator ↔
  Micromanager, Domestic Warrior ↔ Domestic Apathy, Master Kingmaker ↔
  Outsider, Overeager ↔ Passive.
- **(D)** `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool` extension —
  Crisis Admin + Crisis Gov + Decisive General added per the
  cognitive-decline theme. (Hamilton's late-life withdrawal,
  Lincoln's stress-aging, Grant's late-life decline — see Open Q5.)
- **(E)** Lingering Phase wiring: `runPhase_2_5_1_Lingering`
  (`phaseRunners.ts:2973-3036`) layers per-trait modulation on top of
  PR5's expertise-gated `+0.2` bonus. Crisis Admin / Crisis Gov / Iron
  Fist on the seated President; Crisis Admin on Treasury; Crisis Gov on
  AG; Iron Fist on the President's honest/domestic; Domestic Warrior
  on Legislative speaker. Delegator and Micromanager apply
  multipliers (`+0.5` / `-0.5`) to the existing per-seat `+0.2`
  expertise bonus from PR5.
- **(F)** Military command wiring: `runPhase_2_3_2_Military`
  (`phaseRunners.ts:2177-2203`) reads Decisive General / Naive
  Strategist on the seated GeneralInChief AND on the seated
  SecretaryOfWar. Decisive General → `+1` Command on initial
  appointment during wartime (on top of PR2b's existing `+1`). Naive
  Strategist → suppresses the wartime Command grant. The trait check
  fires only `if (warActive)`.
- **(G)** Dred Scott event modification: `eraEvents1856.ts:30-52`
  (currently `decider: 'cabinet'`) — outcomes are modulated by AG's
  `Justice` expertise (multiplier on meter swings) + President's
  `Iron Fist` / `Crisis Gov` traits (additional modulation).
- **(H)** John Brown raid event modification: `eraEvents1856.ts:78-100`
  (currently `decider: 'president'`) — outcomes modulated by SecWar's
  `Military` expertise + Decisive General / Naive Strategist trait
  on SecWar, plus President's Iron Fist / Crisis Gov, plus the
  ideology + state proxy for the "slavery position" reading
  (a SecWar from a slave state with pro-slavery ideology routes a
  harsher Virginia outcome; opposite routes a muted Virginia
  outcome with larger Southern outrage). Decider stays `'president'`
  (the President picks the response; the cabinet's stats modulate
  the magnitude). Builder may consider promoting `decider` to
  `'cabinet'` (Open Q at CP2).
- **(I)** Secession Winter NEW event: NEW entry in
  `buildEraEventsForYear` for year >= 1860 (after South Carolina's
  Dec 20 1860 secession). Distinct from the existing
  "Southern Secession Threat" entry (the pre-election threat) —
  Secession Winter is the post-election unraveling Nov 1860 - Mar
  1861. **Multi-cabinet loyalty check** uses ideology + state proxy
  (per Open Q1): for each cabinet seat (Treasury, War, Interior,
  State), if the seated Sec is from a slave state AND carries a
  pro-slavery ideology (Conservative + Traditionalist + RW Populist),
  they are flagged as defection candidates. The event's response
  outcome banding (5 bands per Open Q below) reads the defection
  count + the President's Crisis Gov / Passive / Iron Fist trait.
- **(J)** Trent Affair NEW event: NEW entry for year >= 1861 (when
  Nov 1861 Wilkes-Mason-Slidell seizure becomes resolvable).
  `decider: 'cabinet'` — primary actor is SecState. Response is
  modulated by SecState's `Foreign Affairs` expertise (Seward's
  career-diplomatist signal) + Delegator / Micromanager on the
  President + Crisis Gov on SecState. Log voice shifts on high-
  expertise outcome ("Seward's December 26 climb-down" framing).
- **(K)** Delegator / Micromanager mechanism: `+0.5x` / `-0.5x`
  multiplier on PR5's per-seat expertise-gated lingering-phase
  bonus (the `+0.2` at `phaseRunners.ts:3012-3032`). Also `+0.5x` /
  `-0.5x` multiplier on the magnitude of meter swings in the 4
  modified era events (e.g. Trent Affair's chosen response meter
  effects get multiplied for a Delegator-Lincoln).
- **(L)** 20 marquee CURATED_ROWS attributions in
  `scripts/seedDataset.mjs` per historian §4 (table inline at AC #21
  below). Lincoln = Crisis Gov + Delegator; Buchanan = Passive +
  Naive Strategist; Hamilton = Crisis Admin + Master Kingmaker;
  Polk = Iron Fist + Micromanager + Overeager; Calhoun = Domestic
  Warrior; Clay = Master Kingmaker + Domestic Warrior; Van Buren =
  Master Kingmaker; Grant = Decisive General; McClellan = Naive
  Strategist; Stanton = Crisis Admin + Iron Fist (NOT Decisive
  General — historian's deliberate correction per §4 notes);
  Floyd = Iron Fist + Naive Strategist; Washington = Delegator +
  Decisive General; St. Clair = Naive Strategist; Hull = Naive
  Strategist; Morris = Crisis Admin; Gallatin = Crisis Admin; Chase
  = Crisis Admin; Adams (John) = Micromanager + Crisis Gov;
  Pierce = Overeager; Burr = Master Kingmaker.
- **(M)** Cross-cutting guardrails: no PV formula change (the 10 new
  traits use the existing flat ±4 / −5 weights via POSITIVE_TRAITS /
  NEGATIVE_TRAITS), no election arithmetic change (new traits don't
  appear in `TRAIT_ELECTION_EFFECTS`), save migration is additive
  (new union members compile; old saves load cleanly).

PR6 does **NOT** cover (PM enforces strictly):

- **Bleeding Kansas event routing.** Retrofit risk per historian
  §2.5 — existing 2.4.3 graph node at `eraEvents1856.ts:6-28`.
  Future PR.
- **Kansas-Nebraska Act fallout as a single event.** Per historian
  §2.6, not a single resolvable event — better modeled as a multi-
  turn lingering-phase meter drag. Defer.
- **1772 era event routing.** Per F-1856-ONLY-FOR-EVENTS. The 10
  traits attribute on 1772 figures via CURATED_ROWS but the 2.4.3
  graph is untouched.
- **Anytime events / scandal generation.** Out of scope.
- **Cabinet resignation / firing tied to crisis events as a general
  mechanic.** Secession Winter's defection is event-local — it does
  NOT introduce a generalized "Sec resigns mid-game" pipeline.
  Buchanan's Cobb/Floyd/Thompson exits in Secession Winter set
  `cabinet[seat] = null` and `currentOffice = null` on the defecting
  politicians, AND the politician gains the `Traitor` trait
  (existing in union) — but no `runPhase_2_3_3_Resignation` or
  similar runner. Future PR.
- **Slavery-position attribute on Politician.** Per F-LOYALTY-NO-
  SCHEMA. PR6 uses ideology + state proxy.
- **`loyalty: number` field on Politician.** Same — proxy-only.
- **New event types beyond the 4** (Dred Scott modify, John Brown
  modify, Secession Winter new, Trent Affair new).
- **Reworking the event-modal UI.** PR6 wires data; the existing
  `EraEventModal` reads the chosen response and applies effect.
  The multiplier modulations apply at the engine layer in
  `resolveEraEvent` (or a new pre-applyEffect modulation helper);
  the modal sees the same response options but the resolved meter
  swings differ.
- **Master Kingmaker integration with `KINGMAKER_RULES`.** Per F-MK-
  KINGMAKER-RULES-SEPARATE. Future PR may unify, but PR6 leaves
  the existing `KINGMAKER_RULES` (Backroom-track Kingmaker trait
  gating system) untouched.
- **Overeager threshold-lowering on event fire chance.** Per Open
  Q7 below — PR6 ships Overeager as a flat trait bonus on
  `internal_party` + `governance_crisis`; no special mechanic for
  lowering era-event preconditions. Pierce's "signed KS-NE
  despite his own warning" historical signal is encoded as
  attribution + flat bonus, not as a precondition modifier.
- **Crisis Manager retirement / unification with Crisis Admin /
  Crisis Gov.** Per F-CRISIS-MANAGER-COEXISTS. The existing trait
  stays as the umbrella tag with its existing `MORTALITY_RULES`
  effect.
- **Era-conditional `TRAIT_GOVERNANCE_EFFECTS` rows.** PR6 ships
  flat magnitudes across both eras (1772 traits land in the
  CURATED_ROWS but only the 1856 era-event routing fires; the 10
  traits' lingering-phase / military-command / internal-party
  effects fire era-agnostically). Future tuning PR can era-split.
- **Per-state region modulation for John Brown's slavery proxy.**
  PR6 reads `politician.state` against a hand-rolled
  `SLAVE_STATES_1856` set (defined inline in the spec at AC #15).
  Future PR can graduate to a richer state-region model.
- **A "loyalty score" returned by Secession Winter.** PR6 surfaces
  the defection as event-local consequences (Sec resigns +
  cabinet[seat] = null + Traitor trait granted); no scoreboard.
- **UI surface for "your cabinet is at risk" warning before
  Secession Winter fires.** Polish PR; PR6 fires the event with
  no pre-warning.

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human
adjudicates at checkpoint; PM recommendation in parentheses). The
headline `[CP1 Open]` items the human picks are Open Q1 (cabinet
loyalty data model), Open Q4 (code label rename), and Open Q5
(`oldAge.fadingPool` extension scope).

### A. Trait union expansion (10 new traits) + classification

1. **[Locked]** The `Trait` union in `src/types.ts:62-107` gains
   exactly **10 new members**: `Crisis Admin`, `Crisis Gov`,
   `Decisive General`, `Naive Strategist`, `Domestic Warrior`,
   `Iron Fist`, `Delegator`, `Micromanager`, `Overeager`,
   `Master Kingmaker`. No other union members change. Order:
   architect's call; conventional choice is "near related traits"
   (Crisis Admin near Crisis Manager line 69; Decisive General /
   Naive Strategist near the military cluster).

2. **[Locked]** Each new trait is classified for the existing flat
   ±PV weights (`pv.ts:65-87`):
   - `POSITIVE_TRAITS` (+4 PV): `Crisis Admin`, `Crisis Gov`,
     `Decisive General`, `Domestic Warrior`, `Delegator`,
     `Master Kingmaker`. **Iron Fist** also POSITIVE (the historical
     reading is mixed — Jackson + Lincoln both effective at the
     national PV layer; the trait's costs surface at the
     `lingering_phase` honest/domestic meter level, AC #10).
   - `NEGATIVE_TRAITS` (−5 PV): `Naive Strategist`, `Micromanager`,
     `Overeager`. **Micromanager** classified NEGATIVE at the flat
     PV layer because the trait's national-scoring ceiling is the
     dominant structural signal (Polk-as-PV-ceiling), and the
     context layer at AC #4 turns Micromanager mixed-positive in
     `military_command` and `internal_party`. Mirrors PR4b's
     Provincial structural-negative-with-context-positive pattern.
   Architect adds both `POSITIVE_TRAITS` and `NEGATIVE_TRAITS`
   array updates in the same `src/types.ts` edit.

3. **[Locked]** No new field on `Politician` or `GameState`. No
   `repair()` change for the trait union — old saves load cleanly
   (politicians with no new traits get 0 trait-effect adjustment).
   The dedicated migration for the Secession Winter Traitor grant
   is event-local, no schema change.

### B. TRAIT_GOVERNANCE_EFFECTS table — per-trait per-context magnitudes (the core)

4. **[Locked]** PR6 adds a new top-level constant
   `TRAIT_GOVERNANCE_EFFECTS` to `src/types.ts` near
   `TRAIT_ELECTION_EFFECTS`. Uses PR4a's bands:
   `TRAIT_GOVERNANCE_BANDS = { SMALL: 2, MEDIUM: 4, LARGE: 8 }` —
   numerically identical to PR4a, named separately for clarity.
   New `GovernanceContext` union: `'governance_crisis' |
   'lingering_phase' | 'military_command' | 'internal_party'`.

   ```
   export type GovernanceContext =
     | 'governance_crisis'
     | 'lingering_phase'
     | 'military_command'
     | 'internal_party';

   export const TRAIT_GOVERNANCE_BANDS = {
     SMALL: 2, MEDIUM: 4, LARGE: 8,
   } as const satisfies { SMALL: number; MEDIUM: number; LARGE: number };

   export interface TraitGovernanceRule {
     trait: Trait;
     context: GovernanceContext;
     magnitude: number;                 // signed
     // Multiplier semantics for Delegator / Micromanager — when present,
     // the rule applies as a multiplicative factor on PR5's per-seat
     // expertise-gated +0.2 bonus AND on event-effect meter swings,
     // INSTEAD of the additive magnitude.
     multiplier?: number;
   }
   ```

   The directional table (architect locks numerics within band):

   | Trait | governance_crisis | lingering_phase | military_command | internal_party | Notes |
   |---|---|---|---|---|---|
   | **Crisis Admin** | + LARGE (financial-flavored events) | + SMALL (revenue meter drift) | NONE | + SMALL | Standalone (no conflict pair) |
   | **Crisis Gov** | + LARGE (non-financial crisis events) | + SMALL (domestic meter drift) | NONE | + SMALL | Standalone |
   | **Decisive General** | + SMALL (military-flavored crises) | NONE | + LARGE (active war) | NONE | Paired with Naive Strategist |
   | **Naive Strategist** | − SMALL (military-flavored crises) | NONE | − LARGE (active war) | NONE | Paired with Decisive General |
   | **Domestic Warrior** | + SMALL (non-financial domestic) | + MEDIUM (domestic meter drift) | NONE | + MEDIUM | Paired with Domestic Apathy |
   | **Iron Fist** | + MEDIUM (crises requiring decisive authority) | + SMALL honest / − SMALL domestic | + SMALL (chain-of-command) | + SMALL | Standalone; SPLIT magnitude on lingering_phase (per AC #6) |
   | **Delegator** | multiplier × 1.5 on cabinet-effect contribution | multiplier × 1.5 on PR5 expertise bonus | NONE | + SMALL | Paired with Micromanager; MULTIPLIER (see AC #5) |
   | **Micromanager** | multiplier × 0.5 on cabinet-effect contribution + SMALL on president-stat weighting | multiplier × 0.5 on PR5 expertise bonus + president stats up | + SMALL (Polk-Scott Mexican War) | + SMALL | Paired with Delegator; MULTIPLIER (see AC #5) |
   | **Overeager** | + SMALL (flat — see AC #7) | NONE | + SMALL decisive / − SMALL prep = net 0 (no row) | + SMALL (activist within faction) | Paired with Passive; no threshold mechanic per Open Q7 |
   | **Master Kingmaker** | + SMALL (can move party in crisis) | NONE | NONE | + LARGE (faction-leader install + dark-horse) | Paired with Outsider; ADDITIVE-ONLY per F-MK-KINGMAKER-RULES-SEPARATE |

   Architect emits the rows as flat `TraitGovernanceRule[]` array,
   mirroring `TRAIT_ELECTION_EFFECTS` shape at `types.ts:639+`. No
   era field (flat across both AMPU eras) — per "Out of scope" PR6
   ships flat magnitudes.

5. **[Locked]** Multiplier vs additive semantics:
   - For Delegator / Micromanager rows where `multiplier` is set,
     the rule does NOT contribute an additive magnitude on the
     governance context's meter. Instead, the architect's helper
     reads `multiplier` and applies it to (a) the PR5 expertise-
     gated `+0.2` per-seat bonus in `runPhase_2_5_1_Lingering` and
     (b) the chosen response's `meters: Partial<NationalMeters>`
     in `resolveEraEvent` BEFORE `applyEffect` is called.
   - Stacking semantics: if BOTH Delegator and a multiplier-effect
     are present (impossible — they're a conflict pair, d6-arbitrated
     per PR3), only the held trait fires. If neither is held, no
     multiplier is applied (multiplier defaults to 1.0).
   - For Crisis Admin / Crisis Gov / etc. (additive rows), the
     magnitude is added to the existing per-context meter drift
     OR to the chosen response's meter swings, per AC #10 (lingering)
     and AC #11 (military) and AC #12-14 (events) below.

6. **[Locked]** Iron Fist's `lingering_phase` row is SPLIT:
   `+SMALL honest meter`, `−SMALL domestic meter`. The architect
   emits two rows for Iron Fist with `lingering_phase` context and
   distinct magnitudes (the rule shape adds an optional
   `meter?: keyof NationalMeters` field, defaulting to "use context's
   primary meter"). For rules without `meter`, the per-context
   primary meter mapping is:
   - `governance_crisis` → the chosen response's meters
   - `lingering_phase` → primary meter mapping below (AC #10
     locks the per-trait meter)
   - `military_command` → Command point (skill bump on initial
     appointment if wartime per AC #11)
   - `internal_party` → faction-leader scoring path
     (`LEADERSHIP_RULES.scoreNormalizer = 200`)

7. **[Open @ CP1 — recommend (c) simple bonus, no threshold]**
   Overeager's gameplay hook. PM recommendation: **(c) Overeager
   gets +SMALL `governance_crisis` and +SMALL `internal_party`;
   no special threshold mechanic.** Keeps PR6 scope manageable.
   Alternatives:
   - (a) Pure flavor (logged-only). Misses the historical signal
     (Pierce signing KS-NE despite forecasting catastrophe is a
     mechanic-warranting effect, not just text). Rejected.
   - (b) Threshold-lowered: `governance_crisis` events fire at
     relaxed precondition under an Overeager president — touches
     the era-event precondition graph (`Predicate` shape at
     `types.ts:1248-1265`), out of PR6 scope. Future PR.
   PM rec: **(c)**. Architect at CP2 can revisit if playtest reads
   thin.

8. **[Open @ CP1 — recommend (a) leverage ideology + state proxy
   for cabinet loyalty]** Open Q1 from the user brief — Secession
   Winter's cabinet-defection mechanism. PM recommendation:
   **(a) use existing factionId + ideology + state proxies; no
   new schema.** The historian's data (Cobb GA pro-slavery,
   Floyd VA pro-slavery, Thompson MS pro-slavery, Cass MI pro-
   Union) maps cleanly. AC #15 below defines the proxy formula.
   Alternatives:
   - (b) Add a `loyalty: number` field on Politician. New schema,
     persistence concern, save migration. Rejected as scope-heavy.
   - (c) Add `Loyalist` / `Secessionist` traits to the union.
     Adds 2 more traits beyond PR6's locked 10. Rejected.
   PM rec: **(a)**.

9. **[Open @ CP1 — recommend (a) ideology + state proxy for slavery
   position]** Open Q2 from the user brief — John Brown raid event
   slavery routing. PM recommendation: **(a) use ideology + state
   proxy.** A SecWar from a slave state with pro-slavery ideology
   routes the harsher Virginia outcome; an antislavery SecWar
   routes a muted Virginia outcome. Same logic as Open Q1, same
   rationale (no schema change). Alternatives:
   - (b) Skip slavery-routing entirely; John Brown is just SecWar
     + President trait. Loses the historian's headline finding
     (the slavery-position is the load-bearing fact of the event).
     Rejected.
   - (c) Add `slaveryPosition: 'pro' | 'neutral' | 'anti'` field on
     Politician. New schema, rejected.
   PM rec: **(a)**.

### C. TRAIT_CONFLICTS additions (PR3 / PR4b extension)

10. **[Locked]** PR3's `TRAIT_CONFLICTS` (`types.ts:569-593`) gains
    exactly **10 new map entries** (5 pairs × 2 directions for the
    symmetric lookup PR3 requires):

    ```
    'Decisive General':  'Naive Strategist',
    'Naive Strategist':  'Decisive General',
    'Delegator':         'Micromanager',
    'Micromanager':      'Delegator',
    'Domestic Warrior':  'Domestic Apathy',
    'Domestic Apathy':   'Domestic Warrior',
    'Master Kingmaker':  'Outsider',
    'Outsider':          'Master Kingmaker',
    'Overeager':         'Passive',
    'Passive':           'Overeager',
    ```

    The d6 threshold (`TRAIT_LIFECYCLE_RULES.conflictD6Threshold = 4`)
    applies unchanged. Any path that calls `tryGrantTrait(p, t)`
    with `t` ∈ the new traits and a conflict already held will
    d6-resolve per PR3's existing semantics.

11. **[Locked]** Crisis Admin, Crisis Gov, Iron Fist remain
    **standalone** — no conflict pair (per F-CONFLICT-PAIRS-FIVE).
    Justifications:
    - Crisis Admin: no historical clean opposite (the antonym
      "panicked" / "indecisive" isn't a trait in AMPU).
    - Crisis Gov: pairs naturally with Passive but Overeager-vs-
      Passive is the cleaner behavioral mirror (per historian
      §1.2 + §1.9). Crisis Gov stays standalone.
    - Iron Fist: "Reformist" isn't the inverse (TR was both);
      "Harmonious" mis-encodes Lincoln (who was both). Standalone.

12. **[Locked]** Cross-pair stacking is allowed. A politician can
    carry Crisis Gov + Iron Fist (Lincoln per F-TRAITS-10-
    DIRECTIONAL); Crisis Admin + Master Kingmaker (Hamilton);
    Iron Fist + Naive Strategist (Floyd per F-BUCHANAN-CORRECTION
    note); Decisive General + Delegator (Washington). The 5 new
    pairs only forbid **within-pair** co-occurrence.

13. **[Locked]** The 4 existing-union negatives the pairs leverage
    (`Domestic Apathy` at line 90, `Outsider` at line 101,
    `Passive` at line 86) ARE verified extant in the current
    `Trait` union (per PM read of `src/types.ts` for this spec).
    No pairs reference a non-existent trait.

### D. oldAge.fadingPool extension

14. **[Open @ CP1 — recommend (b) add Crisis Admin + Crisis Gov +
    Decisive General to fading pool]** Open Q5 from the user brief.
    PR3 currently ships `fadingPool = ['Celebrity', 'Charismatic']`
    at `types.ts:551`; PR4b extended to include `'Hale'`. PR6
    extends to include **3 governance traits** per the cognitive-
    decline theme:
    - **Crisis Admin** — Hamilton's late-life withdrawal from
      finance + Gallatin's post-1814 retirement signal that the
      "financial acumen under pressure" trait fades with age.
    - **Crisis Gov** — Lincoln's stress-aging during the war (the
      famous Brady portraits 1860-vs-1865) + Washington's
      late-Whiskey-Rebellion vigor vs his 1797 withdrawal signal
      that constitutional-crisis competence fades.
    - **Decisive General** — Grant's late-life decline (the
      cancer + Memoirs 1885) + Sherman's post-1880 retirement
      pattern + Washington's Trenton-1776 vs Whiskey-1794
      contrast signals that field-decisive command fades.
    Implementation: append the 3 trait names to the existing
    `fadingPool` array at `types.ts:551`:
    `fadingPool: ['Celebrity', 'Charismatic', 'Hale', 'Crisis Admin',
    'Crisis Gov', 'Decisive General']`.

    Alternatives:
    - (a) NONE — leave fadingPool at PR4b's 3-trait state. Crisis
      Admin / Crisis Gov / Decisive General are character traits,
      not robustness traits — they don't fade. Defensible but
      misses the cognitive-decline narrative.
    - (c) Add only Decisive General (most physically demanding).
      Compromise — captures the field-command signal without the
      Hamilton/Lincoln aging signal. Architect-friendly.
    PM rec: **(b)** — captures all three historical signals.
    Worst-case stacking: a 78-year-old president carrying
    Crisis Gov + Delegator may roll-lose Crisis Gov via
    `oldAge.baseChance + ageBracketBonus` per turn. Playtest will
    surface whether this feels right.

15. **[Locked]** No other new trait enters the fading pool.
    Naive Strategist, Domestic Warrior, Iron Fist, Delegator,
    Micromanager, Overeager, Master Kingmaker are character /
    identity traits — they don't fade with age (a Micromanager old
    Adams stays Micromanager; a Domestic Warrior old Calhoun stays
    Domestic Warrior). Per PR4b AC #9's rationale.

### E. Lingering Phase wiring (`runPhase_2_5_1_Lingering`)

16. **[Locked]** PR6 layers per-trait governance modulation on top
    of PR5's per-seat expertise-gated `+0.2` bonus in
    `runPhase_2_5_1_Lingering` at `phaseRunners.ts:2973-3036`.
    New behavior (architect adds AFTER the PR5 cabinetBonuses loop
    at line 3023-3032, BEFORE the national debt line at 3035):

    For each cabinet seat with an occupant:
    - **Read** the seated politician's traits.
    - **Filter** `TRAIT_GOVERNANCE_EFFECTS` for rules where
      `context === 'lingering_phase'` AND the rule's trait is
      held by the occupant.
    - **For additive rules** (no `multiplier`), apply the
      magnitude to the seat's primary meter (from PR5's
      `cabinetBonuses` table). Crisis Admin on Treasury →
      `+SMALL = +2` on `economic`. Iron Fist on President →
      `+SMALL = +2` on `honest`, `−SMALL = −2` on `domestic`
      (split row per AC #6).
    - **For multiplier rules** (Delegator / Micromanager on the
      President), multiply the PR5 `+0.2` bonus on EVERY occupied
      cabinet seat (NOT just the President's seat — Delegator's
      effect IS the cabinet's amplification). The multiplier
      compounds with PR5's expertise gate: a Delegator-Lincoln
      with a Chase (Treasury, has Economics expertise) seat
      gives `+0.2 * 1.5 = +0.3` on `economic`. A Delegator
      without an expertise-matched cabinet still gets nothing
      (PR5 gate fires `+0.0`; multiplier on 0 is 0).
    - **Order of operations:** PR5's drift formula runs first,
      then PR5's per-seat expertise bonus runs, then PR6's
      trait modulation. (Architect implements this as a
      separate pass after the PR5 loop; per-seat additive bonuses
      are applied via the same `apply()` helper at line 2988-
      2995.)

    Per-trait lingering-phase meter mapping (locks the magnitudes
    in AC #4's table):

    | Trait | Seat read | Meter | Magnitude |
    |---|---|---|---|
    | Crisis Admin | Treasury, President | `economic` (Treasury), `revenue` (President — but only if held) | +SMALL = +2 |
    | Crisis Gov | President | `domestic` | +SMALL = +2 |
    | Domestic Warrior | President, Cabinet | `domestic` | +MEDIUM = +4 |
    | Iron Fist | President | `honest` +SMALL; `domestic` -SMALL | +/-SMALL = ±2 |
    | Delegator | President | per-seat `+0.2` bonus | × 1.5 multiplier |
    | Micromanager | President | per-seat `+0.2` bonus | × 0.5 multiplier |

    Decisive General, Naive Strategist, Overeager, Master Kingmaker
    have NONE on `lingering_phase` per AC #4 — no row, no effect.

17. **[Locked]** The trait grants in AC #16 use the `apply()` helper
    at `phaseRunners.ts:2988-2995`, so the meter clamp (`-5, +5`)
    and the log line (`Math.abs(delta) > 0.01`) fire automatically.
    A `+2` from Crisis Admin alongside PR5's `+0.2` Treasury
    bonus stacks to `+2.2` on `economic`. With the existing
    drift formula's `+0.5 * 0.7 = +0.35` baseline, the total can
    reach `~+2.55` in a single turn — within the meter clamp
    budget (the `-5, +5` range absorbs it). Architect's CP2 may
    re-tune the per-trait magnitudes from `SMALL=2` to a smaller
    `0.5-1.0` band if playtest reveals lingering-phase inflation
    (the bands at `TRAIT_GOVERNANCE_BANDS` are the dial).

18. **[Locked]** The Delegator / Micromanager multiplier applies to
    PR5's per-seat `+0.2` bonus ONLY (the conditional bonus at
    `phaseRunners.ts:3023-3032`). It does NOT multiply the drift
    formula at lines 2997-3010 (the existing `drift(skill)` reads),
    NOR the President's own stats, NOR cross-cabinet effects.
    Scope-strict: only PR5's expertise bonus.

19. **[Locked]** The `runPhase_2_5_1_Lingering` rewrite preserves
    PR5's order: existing drift → existing cabinet bonus → new
    trait modulation → national debt. No ordering change for PR5;
    PR6 inserts strictly between cabinet bonus and national debt.

### F. Military command wiring (`runPhase_2_3_2_Military`)

20. **[Locked]** `runPhase_2_3_2_Military` at `phaseRunners.ts:2177-
    2203` reads Decisive General / Naive Strategist on the
    GeneralInChief candidate AND on the seated SecretaryOfWar.
    Behavior:
    - When a new GeneralInChief is appointed AND `warActive`:
      - If the candidate carries `Decisive General` → grant an
        ADDITIONAL `+1` Command point (on top of the existing
        wartime `+1` at line 2197 — net `+2`). Log line:
        `"<name> gains additional Command (Decisive General
        wartime appointment)."`
      - If the candidate carries `Naive Strategist` → SUPPRESS
        the existing wartime `+1` (no Command grant). Log line:
        `"<name> appointed General in Chief; Naive Strategist
        — no wartime Command bump."`
    - When `SecretaryOfWar` is seated (in 2.3.1) AND `warActive`:
      - If the seated SecWar carries `Decisive General` → grant
        `+1` Command to the GeneralInChief (the SecWar's strategic
        cover boosts the field commander). Architect adds this
        as a separate pass at the end of `runPhase_2_3_2_Military`
        AFTER the GeneralInChief block at line 2186-2202.
      - If the seated SecWar carries `Naive Strategist` →
        suppress the SecWar-boost.
    - Architect uses `addCommandPoint(candidates[0], 1)` (existing
      helper at `phaseRunners.ts:2197`) which respects the
      command cap at 5 (per `KINGMAKER_RULES.commandCap`).

21. **[Locked]** The trait checks fire ONLY when `warActive ===
    true`. Peacetime appointment does not modulate Command.
    Mirrors PR5's wartime-conditional behavior.

22. **[Locked]** No change to GeneralInChief candidate filter
    (`p.skills.military >= 3`). The Decisive / Naive read is a
    post-pick modulation, not a pre-pick filter.

23. **[Locked]** If the GeneralInChief candidate carries BOTH
    Decisive General AND Naive Strategist — impossible per AC #10
    conflict pair. If a save somehow has both (legacy / corrupt),
    the architect reads them in PR3 `tryGrantTrait` order
    (the d6-resolved trait wins; conflict pair semantics).

### G. Dred Scott event modification

24. **[Locked]** The existing Dred Scott event at
    `eraEvents1856.ts:30-52` (`decider: 'cabinet'`) is **kept as
    cabinet decider** with the same 3 ternary responses
    (`r1` endorse / `r2` measured / `r3` resist). PR6 routes
    response resolution through a new pre-applyEffect modulation
    helper that reads:
    - **AG `Justice` expertise** (primary): if AG carries
      `'Justice'` expertise, multiply the chosen response's
      `meters.domestic` and `meters.honest` by `0.5` (softens the
      hit — Black's law training would have moderated the
      breadth). If AG lacks Justice expertise, no multiplier (the
      hit reads at full magnitude).
    - **President `Iron Fist` trait**: multiplies the chosen
      response's `meters` by `1.3` if response is `r1` (endorse)
      AND President carries Iron Fist. Buchanan's "endorse and
      crush dissent" path was historically what made Dred Scott
      toxic.
    - **President `Crisis Gov` trait**: multiplies the chosen
      response's `meters.domestic` by `0.7` if response is `r2`
      (measured) OR `r3` (resist). Lincoln's later approach
      improves outcome.
    - **President `Delegator` trait**: applies the multiplier
      from AC #5 (`× 1.5`) to ALL response meters (amplifies
      whatever the cabinet calls for — including a bad call).
    - **President `Micromanager` trait**: applies `× 0.5` to all
      response meters (Polk-style override).

25. **[Locked]** Modulation order: Iron Fist / Crisis Gov / AG
    expertise apply first (additive multipliers compound:
    `Iron Fist on r1 = 1.3 × no-AG-expertise-multiplier 1.0 =
    1.3`); Delegator / Micromanager apply last (the multiplier on
    the entire result).

26. **[Locked]** The log line at `phaseRunners.ts:2738` extends:
    when AG has Justice expertise: append `"AG's legal counsel
    softens the impact."`; when President has Iron Fist + r1:
    append `"The President's authoritarian framing sharpens
    Southern fury."`; etc. Architect uses a single
    `governance_summary` string built at modulation time.

27. **[Locked]** PR6 modifies the existing Dred Scott event entry
    in-place — no new event ID. The `templateId` (if present) is
    preserved. The 3 response entries' base `effect.meters` /
    `partyPreference` / `enthusiasm` / `interestGroups` are
    UNCHANGED — modulation happens at resolve-time, not at the
    data layer.

### H. John Brown raid event modification

28. **[Locked]** The existing John Brown raid event at
    `eraEvents1856.ts:78-100` (`decider: 'president'`) keeps
    `decider: 'president'` (the President picks the response;
    cabinet stats modulate). The 3 ternary responses
    (`r1` swift execution / `r2` common criminal / `r3` crackdown
    on abolitionists) remain.

29. **[Locked]** Response modulation reads:
    - **SecWar `Military` expertise** (primary): if SecWar
      carries `'Military'` expertise, multiply chosen response's
      `meters` by `0.8` (Floyd's actual low-Military expertise
      historically bungled the response — a Military-expert SecWar
      improves outcome). High-Military SecWar improves both the
      military meter recovery and reduces the domestic backlash.
    - **SecWar `Decisive General` trait**: multiplies response
      `meters.military` by `1.2` (additional clean-response
      bonus). **SecWar `Naive Strategist` trait**: multiplies
      `meters.military` by `0.7` AND `meters.domestic` by `1.3`
      (worsens outcome, particularly the slowness signal).
    - **President `Iron Fist`**: amplifies response `r3`
      (`× 1.3` on meters) — the "crackdown on abolitionists"
      path is historically the Iron-Fist response.
    - **President `Crisis Gov`**: multiplies `r2` (common
      criminal) `meters.domestic` by `0.7` — partial improve
      (Lincoln's later framing of Brown as sympathetic lunatic).
    - **AG `Justice` expertise**: multiplies `meters.honest` by
      `0.8` on any response (federal-vs-Virginia jurisdiction
      cleanly handled).
    - **Slavery-position proxy** (per Open Q2 / AC #9): the
      slavery-position routing reads SecWar's
      `politician.ideology` + `politician.state`:
      - SecWar is **pro-slavery** if
        `ideology ∈ {Conservative, Traditionalist, RW Populist}`
        AND `state ∈ SLAVE_STATES_1856` (defined inline in
        spec at AC #30).
      - SecWar is **antislavery** if
        `ideology ∈ {Liberal, Progressive, LW Populist}`
        AND `state ∉ SLAVE_STATES_1856`.
      - SecWar is **neutral** otherwise.
      Modulation: pro-slavery SecWar on `r3` (crackdown) →
      multiplier `× 1.3` on meters (harsher Virginia outcome →
      larger Northern backlash). Antislavery SecWar on `r1`
      (swift execution) → `meters.domestic × 1.3` (muted
      Virginia outcome but larger Southern outrage at perceived
      federal weakness).
    - **President `Delegator` / `Micromanager`**: × 1.5 / × 0.5
      multiplier per AC #5.

30. **[Locked]** `SLAVE_STATES_1856` inline constant in
    `src/types.ts` near `OFFICE_EXPERTISE` (or a new
    `src/data/historicalStateRegions.ts`):

    ```
    export const SLAVE_STATES_1856: ReadonlyArray<string> = [
      'va', 'sc', 'ga', 'al', 'ms', 'tn', 'nc', 'ky',
      'mo', 'fl', 'ar', 'tx', 'la', 'md', 'de',
    ];
    ```

    Architect picks the file location; PM locks the SET — these
    are the 15 slave states circa 1856 (the eventual 11 CSA
    states + 4 border-loyal slave states). Used by John Brown +
    Secession Winter events for the ideology + state proxy.

31. **[Locked]** John Brown event log line extends:
    `"<title>: <label>. <text>. [Cabinet response: SecWar
    expertise + traits | President traits | slavery position]"` —
    architect builds the bracketed summary at modulation time.

32. **[Open @ CP2 — recommend (a) keep decider 'president']**
    John Brown decider stays `'president'`. Alternative `(b)`
    promote to `'cabinet'` for parity with Dred Scott — Floyd's
    actual mishandling was a SecWar-driven failure, so
    `'cabinet'` is historically defensible. PR6 stays at
    `'president'` because the existing UI flow expects President-
    chooses-response shape, and the cabinet modulation captures
    the SecWar signal at the resolve layer. Future PR can
    promote.

### I. Secession Winter NEW event

33. **[Locked]** A new entry in `buildEraEventsForYear` for
    `year >= 1860`, placed AFTER the existing "Southern
    Secession Threat" entry at `eraEvents1856.ts:102-124`.
    Distinct title and description; this is the post-election
    unraveling Nov 1860 - Mar 1861, not the pre-election threat.

    ```
    out.push({
      id: uid('era'),
      year: 1860,
      title: 'Secession Winter',
      description: 'In the weeks after the November election,
        Southern cabinet officers are weighing whether to remain
        with the Union or join the new Confederacy. Charleston is
        arming. The cabinet table is splitting.',
      decider: 'president',
      responses: [
        { id: 'r1', label: 'Reinforce Federal Forts',
          description: 'Send relief to Sumter and Pickens. Treat
          secession as rebellion.',
          effect: { text: '...', meters: { ... },
                    partyPreference: ..., ... } },
        { id: 'r2', label: 'Hold the Line Diplomatically',
          description: 'Refuse to recognize secession, but do not
          provoke. Buy time for a peace conference.',
          effect: { ... } },
        { id: 'r3', label: 'Acquiesce',
          description: 'Allow peaceful separation. The Republic
          will preserve itself.',
          effect: { ... } },
      ],
    });
    ```

    Note: triggers ONLY when year >= 1860 AND (the existing
    "Southern Secession Threat" event from `eraEvents1856.ts:102-
    124` has already resolved OR the year >= 1861). Architect
    picks the precondition that prevents both events firing in
    the same turn.

34. **[Locked]** **Cabinet-defection check** runs in `resolveEra
    Event` BEFORE the modulation pass for this event. For each
    cabinet seat in `[SecretaryOfTreasury, SecretaryOfWar,
    SecretaryOfInterior, SecretaryOfState]`:
    - Read `seat` occupant.
    - Compute `isPoSlaveryState = SLAVE_STATES_1856.includes(
      occupant.state)`.
    - Compute `isPoSlaveryIdeology = ['Conservative',
      'Traditionalist', 'RW Populist'].includes(occupant.ideology)`.
    - If BOTH: this seat is a **defection candidate**.
    - For each defection candidate, deterministic d6-style roll:
      - if President carries `Iron Fist` AND `Crisis Gov` (rare):
        d6 ≥ 4 to defect (resists).
      - if President carries `Passive` (Buchanan's case): d6 ≤ 5
        to defect (almost certain).
      - if President carries `Crisis Gov` only (Lincoln-style):
        d6 ≥ 5 to defect (resists strongly).
      - default: d6 ≥ 3 to defect.
    - For each defected seat:
      - Set `snap.game.cabinet[seat] = null`.
      - Set `occupant.currentOffice = null`.
      - Grant `Traitor` trait via `tryGrantTrait(occupant,
        'Traitor')` (existing union member at types.ts:98).
      - Log line: `"<name> (<state>) resigns as <seat> to join
        the Confederacy."`
    - **Defection count** N (0-4) modulates the response outcome
      magnitude.

35. **[Locked]** **Outcome banding** for Secession Winter:
    5-band shape (very good / good / partial / bad / very bad)
    per historian §2.3. Banding logic:
    - response `r1` (reinforce):
      - N = 0 AND President = Crisis Gov: **very good**
        (containment + peaceful resolution)
      - N = 0 AND President = anything else: **good** (Lincoln-
        style containment + 4-year war)
      - 1 ≤ N ≤ 2: **partial** (Buchanan-style paralysis but
        Sumter held)
      - N ≥ 3: **bad** (cabinet defection + immediate Confederate
        control of federal property)
    - response `r2` (diplomatic):
      - N = 0: **good** to **partial** depending on Crisis Gov
      - N ≥ 2: **bad** (cabinet defection + diplomacy fails)
    - response `r3` (acquiesce):
      - N ≤ 1 AND President = Passive: **very bad** (Buchanan's
        actual outcome path)
      - any: **very bad** (extended peacefully-acknowledged
        secession destroys Union legitimacy)

    Each band maps to a meter multiplier on the base response
    meters: very good = `× 0.3`, good = `× 0.6`, partial = `×
    1.0`, bad = `× 1.5`, very bad = `× 2.0`. Architect implements
    the band-to-multiplier table inline; PM-locked at the
    multiplier scale.

36. **[Locked]** Secession Winter sets `partyPreference: -0.5`
    (Buchanan-baseline cost — even the best outcome is a
    Buchanan-cost), and on N ≥ 2 sets
    `startWar: { name: 'American Civil War', against:
    'Confederate States' }` (regardless of response). The
    civil war is unavoidable if 2+ cabinet members defect.
    On N ≤ 1 and `r1`, civil war STILL starts (the historical
    counterfactual of "even with loyal cabinet, Sumter
    triggers war" — N is cabinet, not Charleston). The civil
    war NOT starting is the `very good` band on `r1` with N = 0
    AND President = Crisis Gov — narratively rare.

37. **[Locked]** Secession Winter Interior expertise is
    OVERRIDDEN for this event — per historian §2.3 note,
    Interior's `Agriculture` / `Welfare` expertise (from PR5
    AC #8) is non-portfolio for the secession-leak question
    (Thompson's leak was politically motivated, not job-
    specific). The cabinet-defection check above (AC #34) does
    NOT read expertise — it reads ideology + state only.

### J. Trent Affair NEW event

38. **[Locked]** A new entry in `buildEraEventsForYear` for
    `year >= 1861`:

    ```
    out.push({
      id: uid('era'),
      year: 1861,
      title: 'Trent Affair',
      description: 'Captain Wilkes of USS San Jacinto has seized
        Confederate commissioners Mason and Slidell from the
        British mail packet Trent. London is incensed. Eight
        thousand British troops embark for Canada. The cabinet
        meets December 26 to draft a response.',
      decider: 'cabinet',
      responses: [
        { id: 'r1', label: 'Release with Face-Saving Framing',
          description: 'Seward drafts a note: Wilkes erred in
          failing to bring Trent into port for adjudication. No
          formal apology. Mason and Slidell released.',
          effect: { text: 'War averted. Northern public mood
            grudgingly accepts.',
            meters: { domestic: -1, military: 0,
                      revenue: 0 },
            diplomacy: [{ nation: 'UK', delta: 1 }] } },
        { id: 'r2', label: 'Apologize and Release',
          description: 'Full apology to London. Mason and Slidell
          released.',
          effect: { text: 'War averted but Northern public
            outrage hardens.',
            meters: { domestic: -3, military: 0 },
            diplomacy: [{ nation: 'UK', delta: 2 }] } },
        { id: 'r3', label: 'Refuse Release',
          description: 'Wilkes was right. Mason and Slidell stay
          in Boston harbor.',
          effect: { text: 'Britain declares war. The Union faces
            a two-front war.',
            meters: { domestic: 1, military: -3, economic: -2 },
            diplomacy: [{ nation: 'UK', delta: -5 }],
            startWar: { name: 'Anglo-American War',
                        against: 'United Kingdom' } } },
      ],
    });
    ```

    Architect refines exact magnitudes; PM locks the 3 response
    shape and the `startWar` on `r3`.

39. **[Locked]** Modulation reads:
    - **SecState `Foreign Affairs` expertise** (primary): if
      SecState carries `'Foreign Affairs'` expertise (Seward
      profile), multiply `r1` outcome meters by `0.7` (further
      softens; Seward's framing carries weight); on `r2` apology
      path, no modulation (apology is a SecState fallback, not
      success). On `r3` refusal path, `× 1.2` on the war-onset
      cost (a Foreign-Affairs-expert SecState going for `r3`
      means the President is overriding — the cost is worse).
    - **SecState `Crisis Gov` trait**: amplifies `r1` improvement
      `× 0.7`.
    - **SecState `Iron Fist` trait**: routes `r3` worse — if
      SecState is Iron Fist (the "refusing release would mean
      war" historical case for a hypothetical Iron-Fist Seward),
      AND chosen response is `r3`, the war-onset meters worsen
      `× 1.3`.
    - **President `Delegator` trait** (Lincoln's actual case):
      `× 1.5` on the `r1` improvement — boost (Lincoln let
      Seward handle it).
    - **President `Micromanager` trait** (Polk-style): `× 0.5`
      on `r1` improvement (Polk-style direct intervention would
      have been worse).
    - **SecNavy chain-of-command** (Welles in 1861): if SecNavy
      has `'Naval'` expertise, log line includes "the Navy
      Department's endorsement of Wilkes is rescinded
      smoothly"; no meter effect (cosmetic only).

40. **[Locked]** **Log voice shift** per F-EVENT-MECHANISM-
    MULTIPLIER: when SecState has Foreign Affairs expertise AND
    response is `r1`, the log line includes a Seward-flavored
    framing snippet: `"Seward's note: Wilkes erred in failing to
    bring Trent into port for adjudication."` (the historical
    Dec 26 framing). When SecState lacks Foreign Affairs OR
    response is `r2` / `r3`, the log uses generic framing. This
    is the ONLY event in PR6 with a log-voice-shift mechanism;
    the other 3 use multiplier-only.

### K. Delegator/Micromanager mechanism (multiplier on cabinet effects)

41. **[Locked]** The Delegator / Micromanager multiplier applies
    in TWO sites, both engine-level (no UI surface):
    - **`runPhase_2_5_1_Lingering`**: multiplies PR5's per-seat
      expertise-gated `+0.2` (per AC #16 / #18 above).
    - **`resolveEraEvent` modulation pass**: multiplies the
      chosen response's `effect.meters` BEFORE `applyEffect()`
      is called (per AC #5 / #25 / #29 / #39 above).

42. **[Locked]** The multiplier reads:
    - Delegator on President → `× 1.5` on cabinet-effect
      contribution.
    - Micromanager on President → `× 0.5` on cabinet-effect
      contribution AND `+SMALL` on president-stat weighting (the
      additive bump per AC #4).
    - If President holds neither → multiplier = 1.0 (no
      modulation).
    - Per AC #10 conflict pair, President cannot hold both
      (d6-arbitrated at trait-grant time).

43. **[Locked]** The multiplier compounds with the additive
    trait modulations from AC #16: a Delegator-Lincoln with
    Crisis Gov AND a Chase Treasury (Economics expertise) seat:
    - PR5 expertise bonus on Treasury: `+0.2` on `economic`
    - PR6 Crisis Gov additive on President: `+2` on `domestic`
    - Delegator multiplier on Treasury PR5 bonus: `× 1.5` →
      `+0.3` on `economic`
    - Total `economic` per turn from cabinet: `+0.3` (PR5+PR6).
    Total `domestic`: PR5 nothing + PR6 Crisis Gov +2 = `+2`.

44. **[Locked]** The multiplier does NOT apply to:
    - The PR5 drift formula at `phaseRunners.ts:2997-3010`.
    - The President's own skills or PV.
    - Cross-cabinet effects (e.g. SecState's diplomacy drift).
    - The `partyPreference` field on `EraEventResponseEffect`.
    - The `enthusiasm` field.
    - The `interestGroups` field.
    - The `startWar` field.
    Multiplier scope is strictly on `meters` (the
    `Partial<NationalMeters>` field).

### L. CURATED_ROWS attributions (20 marquee figures)

45. **[Locked]** PR6 updates `scripts/seedDataset.mjs` `ROWS`
    array (the curated authoring source feeding `CURATED_ROWS`)
    with the historian's marquee attributions. Per CLAUDE.md
    merge precedence, `CURATED_ROWS` overrides same-named
    YAML/dataset entries — so the architect/builder either
    edits existing ROW entries in-place to ADD new traits or
    adds new rows for figures not currently present.

    The 20 marquee attributions (PM-locked from historian §4):

    | Name | Era | Trait additions | Notes |
    |---|---|---|---|
    | Alexander Hamilton | 1772 | Crisis Admin, Master Kingmaker | Existing seedDataset.mjs:84 — add to traits array |
    | Robert Morris | 1772 | Crisis Admin | Existing seedDataset.mjs:87 — add |
    | Albert Gallatin | 1772 | Crisis Admin | NEW row — add to ROWS or via legislators-merge override |
    | George Washington | 1772 | Decisive General, Delegator | Existing seedDataset.mjs:55 — add to traits array |
    | John Adams | 1772 | Micromanager, Crisis Gov | Existing seedDataset.mjs:56 — add (Adams is Egghead+Debater currently) |
    | Arthur St. Clair | 1772 | Naive Strategist | Existing seedDataset.mjs:78 — add to (currently has Military only) |
    | Aaron Burr | 1772 | Master Kingmaker | Existing seedDataset.mjs:85 — add (currently Manipulative+Two-Faced) |
    | Abraham Lincoln | 1856 | Crisis Gov, Delegator | Existing seedDataset.mjs:147 — add (currently Orator+Integrity+Likable) |
    | James Buchanan | 1856 | Naive Strategist (NOT Iron Fist) | Existing seedDataset.mjs:122 — add. Already has Efficient + Passive (Passive added in this PR via Open Q1's anti-case) — wait, currently has only Efficient. PM call: add Passive + Naive Strategist for Buchanan's anti-case profile, REPLACING the inappropriate Efficient (Buchanan was NOT efficient — historian's correction). |
    | James K. Polk | 1856 | Iron Fist, Micromanager, Overeager | Existing seedDataset.mjs:139 — add (currently Efficient+Uncharismatic — keep) |
    | Franklin Pierce | 1856 | Overeager | Existing seedDataset.mjs:133 — add (currently has Passive — KEEP Passive — Pierce's "yielded to senators" reads as Passive+Overeager simultaneously; PM accepts the stack despite the new conflict pair Overeager↔Passive — see edge case below) |
    | John C. Calhoun | 1856 | Domestic Warrior | Existing seedDataset.mjs:192 — add (currently Orator+Debater+Predictable+Nationalist) |
    | Henry Clay | 1856 | Master Kingmaker, Domestic Warrior | Existing seedDataset.mjs:183 — add (currently Charismatic+Likable+Magician+Orator) |
    | Martin Van Buren | 1856 | Master Kingmaker | Existing seedDataset.mjs:142 — add (currently Manipulative+Magician) |
    | Ulysses S. Grant | 1856 | Decisive General | Existing seedDataset.mjs:167 — add (currently Military) |
    | William T. Sherman | 1856 | Decisive General | Existing seedDataset.mjs:168 — add (currently Military) |
    | George B. McClellan | 1856 | Naive Strategist | Existing seedDataset.mjs:169 — add (currently Military+Passive). Stack: Passive + Naive Strategist (allowed). |
    | Edwin Stanton | 1856 | Crisis Admin, Iron Fist | NEW row — add to ROWS or via legislators-merge. Per historian §4 deliberate correction: NOT Decisive General (Stanton was administrative, not a field commander). |
    | John B. Floyd | 1856 | Iron Fist, Naive Strategist | Existing seedDataset.mjs:128 — add (currently Corrupt — keep). Stack: Iron Fist + Naive Strategist (the failure-of-Iron-Fist-by-disloyal-Cabinet case). |
    | Salmon P. Chase | 1856 | Crisis Admin | Existing seedDataset.mjs:153 — add (currently Integrity+Reformist+Uncharismatic+Predictable). |

46. **[Locked]** **Pierce edge case — Overeager + Passive
    co-attribution.** Per AC #45, Pierce gets Overeager added to
    his existing `['Passive']`. But AC #10 makes Overeager ↔
    Passive a conflict pair. Resolution: the
    `scripts/seedDataset.mjs` ROWS array writes both traits
    directly (the curated path bypasses `tryGrantTrait` at seed
    time — see PR4b AC #11 / `data/draftImport.ts:26,223` —
    "directly-imported dataset rows use direct `traits.push`").
    The conflict is **PM-allowed for historical accuracy**:
    Pierce's "knew it would cause catastrophe and signed anyway"
    is uniquely both behaviors. The conflict pair takes effect
    on subsequent grants (a Pierce already holding both can't
    be GRANTED a third Passive or Overeager). Architect at CP2:
    if `npm run build` typechecks fail because the curated
    paste violates an invariant, the architect drops one of the
    two for Pierce (Overeager preferred). PM rec: ship both;
    accept the within-pair stack as a special-case curated
    exception.

47. **[Locked]** **Buchanan attribution edit — drop Efficient.**
    The current seedDataset.mjs:122 has Buchanan as
    `['Efficient']`. Per F-BUCHANAN-CORRECTION, Buchanan was the
    documented anti-case for both Efficient AND Iron Fist. PR6
    edits the ROWS line to `['Passive', 'Naive Strategist']` —
    dropping Efficient. This is a deliberate correction of the
    existing dataset. (Side effect: Buchanan's previous `+4` PV
    bonus from Efficient becomes a `-5` from Passive +
    Naive Strategist; cumulative PV swing is `-9`. This makes
    Buchanan a clearly weaker presidential PV which is
    historically faithful — Buchanan ranks last in nearly every
    Presidential historian survey.)

48. **[Locked]** Architect runs the regen pipeline per CLAUDE.md
    after the ROWS edits:
    `bash scripts/fetchLegislators.sh && node
    scripts/legislatorsToDataset.mjs && npm run build`.
    Output: updated `public/standard-draft-classes.json` +
    `politicians-dataset.csv` + `src/data/defaultDraftClasses.ts`.
    PR6 does NOT execute the regen — the spec captures intent;
    the builder's CP2 run does it.

49. **[Locked]** New ROWS for figures not currently in
    `seedDataset.mjs` (Gallatin, Stanton). Architect/builder
    adds them with `[adm, leg, jud, mil, gov, bck], command,
    traits, party]` per existing row shape. PM-suggested
    starter values:
    - Gallatin (PA Liberal, 1761): `[3, 3, 2, 0, 3, 2], 2,
      ['Crisis Admin'], 'BLUE'`
    - Stanton (OH Liberal, 1814): `[4, 2, 3, 0, 3, 3], 3,
      ['Crisis Admin', 'Iron Fist'], 'RED'`
    Architect refines if biographical sources suggest different.

### M. Cross-cutting guardrails

50. **[Locked]** PR6 makes **no change to the PV formula**
    (`src/pv.ts`). The 10 new traits each carry a flat ±4 / −5
    weight via their `POSITIVE_TRAITS` / `NEGATIVE_TRAITS`
    membership (AC #2); the existing `for (const t of p.traits)`
    loop in `pv.ts:74-87` picks them up. No new `Kingmaker`-style
    special case.

51. **[Locked]** PR6 makes **no change to the election arithmetic
    wiring**. PR4a's `traitVoteAdjust` helper, `calcStateVote`,
    primaries scoring, and faction-leader scoring read
    `TRAIT_ELECTION_EFFECTS` unchanged. The 10 new traits do NOT
    appear in `TRAIT_ELECTION_EFFECTS` — they are governance-
    facing only. Architect verifies no row leaks into the
    election table.

52. **[Locked]** PR6 adds **no new RNG path** beyond what already
    exists. The d6 conflict roll in `tryGrantTrait` fires for the
    5 new pairs the same way it fires for PR4b's 4 pairs and PR3's
    7. The Secession Winter cabinet-defection check at AC #34
    uses `chance()` from `src/rng.ts` (deterministic per CLAUDE.md
    "engine code is pure over the snapshot"). No `Math.random`.

53. **[Locked]** Save loadability: old saves load cleanly.
    - The `Trait` union expansion is additive — existing
      politicians' `traits: Trait[]` arrays don't reference any
      of the 10 new members, so type validation passes.
    - The new `TRAIT_GOVERNANCE_EFFECTS` table is read-only data
      that the engine queries per phase; old saves simply don't
      hit any modulation (no politicians carry the new traits).
    - `SLAVE_STATES_1856` is read-only data — no save touches.
    - Secession Winter / Trent Affair events fire in fresh runs;
      old saves that have already passed year 1860 / 1861 in a
      different cabinet state don't fire the new events
      retroactively. (Architect notes: a save that re-enters the
      relevant year via game-reload may fire the new event; this
      is acceptable.)
    - **No `repair()` change** for PR6's trait union expansion.

54. **[Locked]** **Save migration concern — Buchanan dataset
    edit.** Per AC #47, Buchanan's curated row changes from
    `['Efficient']` to `['Passive', 'Naive Strategist']`. A
    save loaded post-PR6 has Buchanan's `traits` array
    persisted from the OLD dataset (i.e. still carries
    Efficient). The dataset edit only takes effect on fresh
    draft runs that re-seed Buchanan. Architect does NOT
    retroactively edit existing politicians' trait arrays —
    PR6 has no save migration for trait re-attribution.
    Player playing an old 1856-scenario save still sees
    Efficient Buchanan; fresh 1856-scenario start sees
    corrected Buchanan.

55. **[Locked]** `npm run build` (tsc + vite) passes and
    `npm run lint` (tsc `--noEmit`) is clean. The expanded
    `Trait` union compiles cleanly across all union-consumer
    sites (`POSITIVE_TRAITS`, `NEGATIVE_TRAITS`,
    `TRAIT_GOVERNANCE_EFFECTS`, `TRAIT_ELECTION_EFFECTS`,
    `TRAIT_CONFLICTS`, `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool`,
    `CARPETBAGGER_LADDER`, `TRACK_THEMED_TRAITS`, etc.).
    The `as const satisfies` exhaustiveness on the affected
    constants is preserved.

56. **[Locked]** **Stacking budget check.** PR6 adds layered
    effects on top of PR4a/PR4b (election) + PR5 (cabinet) + PR2a
    (mortality). Worst-case stack on a single cabinet seat in a
    single turn:
    - PR5 drift baseline: ~`+0.4` on a meter (max).
    - PR5 expertise bonus: `+0.2` per qualifying seat.
    - PR6 Crisis Admin additive on Treasury: `+2` on `economic`.
    - PR6 Delegator multiplier on the PR5 bonus: `× 1.5` →
      `+0.3`.
    - Combined: `~+2.7` on `economic` in one turn.
    - Meter clamp: `[-5, +5]` per `phaseRunners.ts:2990`.
    Architect's CP2 may dial `TRAIT_GOVERNANCE_BANDS.SMALL`
    from `2` to `1` if playtest reveals meter inflation.

## Edge cases

- **Politician with NONE of the 10 new traits.** PR6 modulation
  passes (lingering, military, events) read traits via
  `politician.traits.includes(t)` — false for all 10 new traits
  → no modulation applied → identical behavior to PR5. Old
  saves play unchanged.

- **Politician with multiple new traits.** Stacks additively
  (Crisis Gov + Iron Fist on Lincoln → both rows fire on
  governance_crisis events; Crisis Gov adds +LARGE = +8,
  Iron Fist adds +MEDIUM = +4 → net +12 on the relevant meter
  pre-Delegator-multiplier). The conflict pair check at AC #10
  prevents within-pair stacks at grant time.

- **President carrying Delegator AND a multiplier-effect within
  same trait pair (impossible).** d6 conflict pair check at grant
  time prevents this. Architect: if a save somehow has both
  (corrupt), the engine reads the LATER-added trait (the
  `traits.push` order). PM accepts non-deterministic resolution
  for the corrupted case.

- **Secession Winter fires with N = 0 defection candidates.**
  Possible only if cabinet has no slave-state + pro-slavery
  occupant. (Hypothetical: a fresh 1856 run where the player
  hand-picks an all-Northern cabinet.) The event still fires
  (year >= 1860 precondition), the responses still apply
  meters, but no cabinet seats null out. **Civil war still
  starts on `r1` or `r2`** unless `r1` AND Crisis Gov President
  AND N = 0 — the historical "Lincoln-cabinet-with-no-Southern-
  Sec-and-Crisis-Gov-leadership" counterfactual. This is the
  ONLY path to a peaceful resolution outcome in PR6 — and it's
  designed to be rare.

- **Trent Affair fires with no SecState seated.** SecState gets
  seated at year 1856 in the 1856 scenario (per PR5 AC #23 — the
  Cass seat is pre-seeded). If a save reaches 1861 with the seat
  null (player fired SecState, the 2.3.1 didn't refill yet —
  shouldn't happen with PR5's auto-fill, but possible if
  presidentId == null bails out of 2.3.1), the event still fires
  but no SecState modulation applies. The `r3` refusal path is
  more likely to be picked by AI as default → war with UK
  triggers. Edge case but engine-correct.

- **Trent Affair fires before 1861.** Precondition `year >= 1861`
  per AC #38. If somehow year is 1858 in a save (impossible per
  2-year turn cadence from year 1856), no event fires.

- **Cabinet seat empty when modulation runs.** All 4 events
  read cabinet seats via `snap.game.cabinet[seat]`; if null, the
  occupant is undefined; the expertise + trait checks short-
  circuit to false. No multiplier applied, no log line,
  response runs at base magnitude. Tested: this is the
  PR5-bare-cabinet case where playtest reads "weak governance"
  by design.

- **John Brown event: cabinet is empty (no SecWar seated).**
  Modulation skips the SecWar branch; President-trait + slavery-
  position-proxy branches still fire. Reduced modulation but no
  crash.

- **Dred Scott event resolution when AG seat is empty.** Same
  shape — AG expertise multiplier defaults to 1.0 (no softening),
  the chosen response runs at full magnitude (worse outcome).
  Reads as "no legal counsel" narratively, intended.

- **Delegator on a President with NO cabinet seats filled.** PR5
  expertise bonus is 0 across all seats (no qualifying seats);
  Delegator multiplier `× 1.5` on 0 is still 0. Delegator's
  `+SMALL = +2` on `internal_party` (from AC #4) DOES fire
  (it's an additive row, not multiplier-only). Delegator-on-
  empty-cabinet president gets only the internal-party bump.

- **Cross-party cabinet — PR5 ships same-party only, so Trent
  Affair routes through a same-party SecState.** Edge case: a
  future PR (PR7+?) allows cross-party cabinet picks (Lincoln-
  Stanton team-of-rivals); Trent Affair modulation reads
  `politician.factionId` agnostically (the multiplier doesn't
  care about party — Foreign Affairs expertise + Crisis Gov
  trait carry on cross-party Sec). PR6 forward-compatible.

- **Trait fade mid-game removing a Delegator or Iron Fist
  from a sitting President.** Per AC #14 fading pool includes
  Crisis Admin / Crisis Gov / Decisive General — NOT Delegator,
  Micromanager, Iron Fist, Master Kingmaker, etc. So a 78-year-
  old Lincoln carrying Crisis Gov + Delegator could lose Crisis
  Gov via `runPhase_2_4_1_Deaths` but retains Delegator. The
  Delegator multiplier persists. Intended.

- **Decisive General candidate at age 78 reaching GeneralInChief
  during active war.** Per PR3 `oldAge.fadingPool` + PR6 AC #14
  Decisive General added: a 78+ year-old candidate may lose the
  trait via the per-turn roll BEFORE the 2.3.2 fires. If they
  lose it on a tick where 2.3.2 then runs, AC #20 reads the
  current trait array (post-fade) — no Decisive General → no
  bonus. Intended.

- **Pierce's seeded Overeager + Passive co-occurrence
  (AC #46).** Curated row writes both directly per
  PR3 F-RECONCILE rule for direct-import path. At runtime,
  Pierce's `traits` array carries both. Election-context
  reads at PR4a: both contribute their per-context magnitudes
  (Passive currently absent from `TRAIT_ELECTION_EFFECTS`,
  per AMPU's current shape — verify; if Overeager appears in
  PR6's `TRAIT_GOVERNANCE_EFFECTS` only, election arithmetic
  is unaffected). The conflict pair at AC #10 prevents
  SUBSEQUENT grants (a path that calls
  `tryGrantTrait(pierce, 'Passive')` or `tryGrantTrait(
  pierce, 'Overeager')` will reject; existing trait stays).

- **Pierce alternative resolution: drop Overeager from Pierce.**
  Architect at CP2 can prune Pierce's Overeager attribution if
  the within-pair stack causes typecheck or logic issues
  (`tryGrantTrait`'s conflict map for Overeager → Passive
  doesn't care about pre-existing pair stacks — it would
  reject a NEW Overeager grant to a Passive-already politician,
  not the reverse seed). PR6 ships both; PR6 also accepts the
  prune.

- **John Brown's `r3` (crackdown) chosen by a President with
  Crisis Gov.** Modulation reads: Crisis Gov on `r2` only per
  AC #29; on `r3`, no Crisis Gov branch fires. The Iron Fist
  branch fires if held (`× 1.3`). Net: Crisis Gov + r3 reads at
  base magnitude (no softening). Narratively reads as "even
  Crisis Gov president pressured into crackdown" — intentional.

- **Secession Winter Crisis Gov resists with Iron Fist
  contradiction (the rare "Iron Fist + Crisis Gov" hypothetical
  Lincoln).** AC #34 special-cases this: "if President carries
  Iron Fist AND Crisis Gov, d6 ≥ 4 to defect". Lincoln's
  defection-resist mechanism. Reads as "the cabinet member
  weighs but mostly stays" — intentional.

- **A re-loaded save reaches 1860 and Secession Winter has
  already fired in a previous run.** Architect checks
  `snap.game.eraEventsCompleted.includes(templateId)` per
  `eraEvents1856.ts` style (the existing Bleeding Kansas /
  Dred Scott / etc. follow this pattern). If Secession Winter
  fires multiple times across saves of the same scenario,
  defections re-fire — PM accepts; cabinets get rebuilt by
  next 2.3.1.

- **Stacking PR4a/PR4b election + PR5 cabinet + PR6 governance
  totals.** A maximally-loaded Lincoln (Crisis Gov + Delegator
  + Likable + Orator + Integrity + Hale + Charismatic — pick
  any 7 from PR4a/PR4b/PR6 marquee Lincoln traits) gets stack
  effects in 3 systems. The PR4a/PR4b stacking guards
  (additive, no extra band) hold. The PR6 stacking guards
  (AC #56 above; meter clamp absorbs) hold. Cross-system
  guards: PV is flat ±4/-5 per trait — Lincoln's flat PV
  contribution is unchanged (more positive traits → more PV).
  Architect-CP2 may dial via the `TRAIT_*_BANDS` constants;
  no spec rework needed.

- **A long 1856 scenario run reaches 1865+ with civil war
  resolved.** Trent Affair's `year >= 1861` precondition still
  fires (the event is a one-shot per `eraEventsCompleted`).
  Secession Winter's `year >= 1860` ditto. Modulation reads
  whatever cabinet/President state exists at that year. No
  edge case unique to PR6.

## Out of scope

Named explicitly so the architect does not pull adjacent or
later-PR work into PR6:

- **Bleeding Kansas event routing.** Per "Scope of THIS spec"
  out-of-scope list. Future PR.
- **Kansas-Nebraska Act fallout as a single resolvable event.**
  Out per historian §2.6.
- **1772 era event routing.** Per F-1856-ONLY-FOR-EVENTS.
- **Anytime events / scandal generation.** Out.
- **Cabinet resignation / firing as a generalized mechanic.**
  Out — Secession Winter's defections are event-local.
- **Slavery-position attribute on Politician.** Out — proxy-
  only per F-LOYALTY-NO-SCHEMA.
- **`loyalty: number` field.** Out — proxy-only.
- **Master Kingmaker integration with `KINGMAKER_RULES`.** Out
  per F-MK-KINGMAKER-RULES-SEPARATE.
- **Overeager threshold-lowering on event preconditions.** Out
  per Open Q7 / AC #7 resolution.
- **Crisis Manager retirement / unification.** Out per
  F-CRISIS-MANAGER-COEXISTS.
- **Era-conditional `TRAIT_GOVERNANCE_EFFECTS` rows.** PR6
  ships flat magnitudes.
- **Per-state region modulation for John Brown** beyond the
  `SLAVE_STATES_1856` boolean. Out.
- **Loyalty score returned by Secession Winter.** Out.
- **UI surface for "your cabinet is at risk" pre-warning.** Out.
- **Reworking the era-event modal UI.** Out — PR6 wires data,
  the existing modal renders.
- **Display-label rename per F-ANACHRONISMS-DISPLAY-LABEL-
  SUGGESTIONS.** Out — code labels kept per Carpetbagger /
  Cosmopolitan precedent.
- **Election-context rows for the 10 new traits.** Out — PR6
  traits are governance-facing only.
- **Mid-game era transition between `nationalism` and `modern`
  in 1856 scenario.** Out — current 1856 scenario stays in
  `nationalism` throughout.
- **AG → DOJ 1870 transition for AG admin scoring.** Per PR5
  carry-over; out of PR6.
- **A new scenario or new year-range scenario.** Out.
- **Updating draft pages / roster UI / faction page to display
  the 10 new traits with tooltips.** Out — traits surface via
  existing trait column.
- **A `runPhase_2_5_2_Governors` modulation for Master
  Kingmaker.** Out.
- **Modifying `LEADERSHIP_RULES`** for Master Kingmaker's
  `internal_party` LARGE bonus. The bonus reads at faction-
  leader scoring time; the existing `LEADERSHIP_RULES.
  scoreNormalizer = 200` handles the magnitude scale. No
  `LEADERSHIP_RULES` edit needed.

## Open questions / assumptions

Decision-first ordering. CP1 items (human/PM locks at checkpoint)
are the headline; CP2 items are architect-deferable.

### CP1 items

1. **(CP1 — Cabinet loyalty data model per Open Q1 / AC #8.)**
   PR6 ships **(a) ideology + state proxy** for Secession Winter
   cabinet-defection. PM rec is **(a)**. Alternatives:
   - (b) Add `loyalty: number` field on Politician with decay
     mechanics. Bigger schema. Rejected.
   - (c) Add `Loyalist` / `Secessionist` traits to union.
     Beyond PR6's locked 10 traits. Rejected.
   This is the single biggest mechanical call in PR6. Human at
   CP1: confirm (a) or pick alternative.

2. **(CP1 — Slavery position routing per Open Q2 / AC #9.)** PR6
   ships **(a) ideology + state proxy** for John Brown event.
   PM rec is **(a)**. Same alternatives as Q1; same
   recommendation.

3. **(CP1 — Magnitude bands per Open Q3.)** PR6 ships **(a)
   reuse PR4a's `TRAIT_GOVERNANCE_BANDS = { SMALL: 2, MEDIUM: 4,
   LARGE: 8 }`** — numerically identical to PR4a's election
   bands. PM rec is **(a)**. Alternative:
   - (b) Governance-specific bands `{ SMALL: 1, MEDIUM: 3,
     LARGE: 6 }` — smaller, since governance fires per turn
     (lingering_phase) vs per-election. PM rejected: worst-case
     stack budget per AC #56 fits within meter clamp, and
     dialing down to `(b)` is a tuning pass not a structural
     rebuild. Architect at CP2 can swap.

4. **(CP1 — Code labels per Open Q4.)** PR6 ships **(a) KEEP
   code labels** (Crisis Admin, Crisis Gov, Delegator,
   Micromanager). PM rec is **(a)** — matches Carpetbagger /
   Cosmopolitan / Uncharismatic precedent (PR4b Open Q1 / Q2).
   Alternative:
   - (b) Rename per historian (Financier, Steady Statesman,
     Hands-off, Hands-On). More era-honest but bigger surface
     (touches union, CURATED_ROWS, all consumer sites). Future
     UI-polish PR can add display-label remapping.
   PM rec: **(a)**.

5. **(CP1 — `oldAge.fadingPool` extension scope per Open Q5 /
   AC #14.)** PR6 ships **(b) add Crisis Admin + Crisis Gov +
   Decisive General to fading pool**. PM rec is **(b)** —
   captures Hamilton's late withdrawal, Lincoln's stress
   aging, Grant's late decline. Alternatives:
   - (a) NONE (PR3 / PR4b's pool stays). Cleaner scope but
     misses the cognitive-decline narrative. PM rejected.
   - (c) Add only Decisive General (most physical). Compromise.
     PM open at CP1.
   PM rec: **(b)** but human may pick **(c)** if conservative.

6. **(CP1 — Overeager gameplay hook per Open Q7 / AC #7.)** PR6
   ships **(c) simple flat bonus, no threshold mechanic**. PM
   rec is **(c)**. Alternative:
   - (a) Pure flavor (logged-only). Misses Pierce signal.
     Rejected.
   - (b) Threshold-lowered on `governance_crisis` preconditions.
     Touches era-event graph. PR7+ territory.
   PM rec: **(c)**.

7. **(CP1 — Master Kingmaker integration per Open Q6.)** PR6
   ships **(b) additive-only `+LARGE` on `internal_party`,
   no overlap with `KINGMAKER_RULES`**. PM rec is **(b)** —
   reduces scope. Alternative:
   - (a) Master Kingmaker as multiplier on existing
     KINGMAKER_RULES odds. More integrated but requires
     touching the `KINGMAKER_RULES` system. PR7+ territory.
   PM rec: **(b)**.

8. **(CP1 — Pierce Overeager + Passive within-pair stack per
   AC #46.)** PR6 ships **both traits attributed to Pierce**
   despite the conflict pair, accepting the curated-path direct-
   import behavior. PM rec is **ship both**. Alternative:
   - (b) Drop Overeager from Pierce, keep Passive. Cleaner
     conflict semantics. Loses historical color.
   - (c) Drop Passive from Pierce, keep Overeager. Mis-encodes
     Pierce's "yielded to senators" signal.
   PM rec: **ship both**, accept the special-case stack.
   Architect at CP2 may prune if typecheck fails.

9. **(CP1 — Buchanan attribution edit per AC #47.)** PR6 ships
   **drop Efficient + add Passive + Naive Strategist** for
   Buchanan in CURATED_ROWS. PM rec is **edit as locked**.
   This is a deliberate correction of the existing dataset per
   F-BUCHANAN-CORRECTION. Alternative:
   - (b) Keep Efficient AND add Passive + Naive Strategist
     (incoherent: Buchanan was not Efficient — historian's
     explicit anti-case). Rejected.
   - (c) No CURATED_ROWS edit for Buchanan in PR6; defer the
     correction to a future tuning PR. Loses the headline
     historian correction.
   PM rec: **(a) edit as locked**.

### CP2 items (architect-deferable)

10. **(CP2-deferable — Decider for John Brown event per AC #32.)**
    PR6 keeps `decider: 'president'`; alternative `'cabinet'` is
    architect-deferable.

11. **(CP2-deferable — Trait magnitude tuning.)** Architect can
    dial `TRAIT_GOVERNANCE_BANDS.SMALL` from `2` to `1` or
    `MEDIUM` from `4` to `3` if playtest reveals meter inflation.
    PR6's bands are the dial.

12. **(CP2-deferable — Per-trait lingering-phase meter mapping
    per AC #16.)** Architect can swap meters (Crisis Admin to
    `revenue` instead of `economic` etc.) without spec rework.

13. **(CP2-deferable — Secession Winter outcome banding scale
    per AC #35.)** Architect can tune the band-to-multiplier
    scale (`very good = × 0.3` etc.) per playtest. PR6 locks the
    5-band STRUCTURE and the direction; numerics are tuning.

14. **(CP2-deferable — Trent Affair log voice shift wording per
    AC #40.)** Architect picks Seward's exact note phrasing.
    PM locks "the historical Dec 26 framing" intent; wording is
    cosmetic.

15. **(CP2-deferable — `SLAVE_STATES_1856` file location per
    AC #30.)** Architect picks `src/types.ts` (near
    `OFFICE_EXPERTISE`) or a new
    `src/data/historicalStateRegions.ts` file. PM rec: latter
    for future-PR cleanliness (more region constants likely to
    accrue).

16. **(CP2-deferable — Stanton + Gallatin starter stat values
    per AC #49.)** Architect refines if biographical sources
    suggest different. PM-suggested values are reasonable but
    not deeply biographically vetted.

### Deviations from historian (explicit, justified)

A. **Pierce attributed with Overeager + Passive (a within-pair
stack).** Per AC #46 / Open Q8. The historian's brief paired
Overeager ↔ Passive but called Pierce's profile uniquely both.
PM accepts the curated-path special case rather than choosing
one trait. Architect-CP2 may prune.

B. **Trent Affair's `r3` triggers `startWar` against UK.** The
historical Trent Affair did NOT result in UK war; the cabinet
opted for `r1` (release with face-saving framing). PR6's `r3`
is the counterfactual — what would have happened with a
Refusal decision. PM keeps `startWar` on `r3` because the AMPU
engine needs a meaningful penalty for the wrong choice; "no war
but bad diplomacy" reads thinner. Future PR can tune.

C. **John Brown raid retained as `decider: 'president'` rather
than promoted to `'cabinet'`.** Per AC #32. The historian
notes Floyd's mishandling was the load-bearing fact, which
suggests `'cabinet'` decider. PR6 leaves at `'president'` for
UI-flow stability and captures the SecWar signal via modulation
at resolve time. Architect-CP2 may promote.

D. **Secession Winter outcome banding is 5-band per AC #35.** The
historian §2.3 endorses 5-band. PR6 implements as a multiplier
on the chosen response's meters, NOT as 5 distinct response
entries. The 3-response shape of the `EraEvent.responses` array
is preserved; the band lives in the modulation pass. This is a
mechanical-shape choice — the player sees 3 options, the
resolved outcome maps to a band based on cabinet state +
President traits.

### Assumptions

1. **(Assumption — the `EraEvent` shape at `types.ts:1230-1243`
   does not require schema additions for PR6's modulation
   pipeline.)** PR6's modulation lives in
   `resolveEraEvent` (or a new helper called from there) at
   `phaseRunners.ts:2726-2767`, reading `event.id` / `event.
   templateId` / chosen response. The modulation mutates the
   `effect.meters` copy (deep clone) BEFORE `applyEffect()`
   is invoked, so no `EraEvent` field is added.

2. **(Assumption — Secession Winter's `templateId` is set so
   `eraEventsCompleted` tracking works.)** Architect adds a
   templateId to the new event (e.g.
   `templateId: 'secession-winter'`) so the event fires once
   per save run. Same for Trent Affair
   (`templateId: 'trent-affair'`).

3. **(Assumption — the 1856 scenario reaches year 1860 / 1861 in
   normal play.)** AMPU's 2-year turn advance from year 1856
   reaches 1860 in 2 turns and 1862 in 3 turns. Both new events
   are reachable. If the player plays only 1-2 turns, Secession
   Winter / Trent Affair don't fire — acceptable per
   "year >= 1860" precondition.

4. **(Assumption — President identification in modulation.)**
   PR6 reads the seated President via `snap.game.presidentId`
   then `snap.politicians.find((p) => p.id === presidentId)`.
   If `presidentId == null` (early scenario, between
   elections), modulation skips the President-trait branches —
   only cabinet-trait modulation fires.

5. **(Assumption — the `Traitor` trait grant on defected
   Sec is durable.)** Per AC #34, defected Secs get the
   `Traitor` trait via `tryGrantTrait`. The Traitor trait has
   no conflict pair in PR4b's `TRAIT_CONFLICTS` (verified) —
   the grant succeeds. PV recomputation reads the new trait at
   the next `refreshPv`.

6. **(Assumption — Multiplier semantics on `meters` field
   compound correctly.)** When Delegator on President +
   high-expertise AG fire on Dred Scott `r1`: AC #25 multipliers
   apply in order — Iron Fist 1.3, AG-expertise 1.0 (no Justice
   match), Delegator 1.5 → net 1.95 (`× 1.3 × 1.5`). PM accepts
   the compounding; architect ensures order is locked in
   modulation pass.

7. **(Assumption — No new RNG path for the multiplier
   modulation.)** Multiplier modulation is deterministic; only
   the Secession Winter cabinet-defection check (AC #34) uses
   RNG via `chance()`. Per CLAUDE.md, this routes through
   `src/rng.ts` (seeded). No `Math.random`.

8. **(Assumption — `npm run build` covers all consumer sites
   for the trait union expansion.)** 10 new union members flow
   through `POSITIVE_TRAITS`, `NEGATIVE_TRAITS`,
   `TRAIT_CONFLICTS`, `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool`,
   `TRAIT_GOVERNANCE_EFFECTS` (new), plus the union switch
   exhaustiveness across consumer files. Architect's CP2 build
   pass catches any missed site at compile time.

9. **(Assumption — Save reload behavior post-PR6.)** Per AC #53,
   old saves load cleanly. Post-PR6 fresh save runs gradually
   accrue the 10 new traits via the dataset regen + the random-
   grant path in `runPhase_2_1_1_Draft`. A save started pre-PR6
   and continued post-PR6 plays with a mix of old and new
   traits depending on when politicians were drafted relative to
   the regen — architect documents this in PR notes; no
   explicit migration.

10. **(Assumption — Stanton attribution as Crisis Admin + Iron
    Fist (NOT Decisive General).)** Per AC #45 + historian §4
    deliberate correction. Stanton was administrative — wartime
    logistics, press suppression — not a field commander.
    Drafted historians sometimes label him "Decisive General"
    informally; the historian's brief explicitly corrects.

11. **(Assumption — Buchanan's PV drops ~9 points per AC #47.)**
    Replacing Efficient (+4) with Passive + Naive Strategist
    (−5 + −5 = −10) plus dropping the bonus is a −14 PV swing
    on the seed. Buchanan becomes a clearly weaker presidential
    PV, which is historically faithful — Buchanan's
    Presidential rankings (Schlesinger, C-SPAN, Siena) place
    him last. This is the deliberate dataset correction.

12. **(Assumption — the `TRAIT_GOVERNANCE_EFFECTS` table is
    READ-only data and queries occur per-phase from the engine.)**
    Architect implements a helper analogous to PR4a's
    `traitVoteAdjust`: a `traitGovernanceAdjust(politician,
    context, baseAmount)` that iterates
    `TRAIT_GOVERNANCE_EFFECTS` filtered by `context` and the
    politician's held traits, returning the adjustment (additive
    OR multiplier). Engine call sites in
    `runPhase_2_5_1_Lingering`, `runPhase_2_3_2_Military`, and
    `resolveEraEvent` invoke the helper. No per-call schema
    change.

---

**Spec file:** `/home/user/AMPU/docs/specs/trait-pass-b-governance.md`
