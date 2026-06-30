# Digest — 2b729148 "Is it possible for California politicians to be divided into UC and LC?"

**Scope:** DESIGN thread (politicslounge topic 5362, 4–9 May 2024), 7 posts / 1
chunk (`chunk-001.md`, 2.6 KB). Topic: the **ALT-STATES system** — how the game
assigns historic California / Texas politicians when a single historic state is
modeled as **multiple split alt-states** (CA → Upper California "UC" + Lower
California "LC"; TX → 4 parts, e.g. West Texas "WT" / North Texas "NT"). Core
question: should historic CA pols be **deliberately placed in the right
split-state (by residence)** or **randomized**? Answer surfaced: **randomized is
the shipped + intended behavior.** **DIGEST ONLY** — no living-doc edits.

Participants: @theFreezerFlame (offers to do by-residence placement, POST 1),
@Ich_bin_Tyler (reports current random behavior, POST 2), and a contributor
relaying the random rule + designer rationale (POST 3–7; matthewyoung123 named in
the brief). vcczar ("V") is the designer whose vision is invoked. Cites
`POST n` = `===== POST n =====`.

---

## ★ The mechanic — split-state (alt-state) politician assignment

Some historic states are modeled as **several split alt-states**. The thread
treats two cases:
- **California → 2 splits:** Upper California (UC) + Lower California (LC).
- **Texas → 4 splits:** e.g. WT / NT (+ two more). (POST 1, 4)

**★ CURRENT shipped behavior (POST 2, Ich_bin_Tyler):** "right now the game just
places them randomly in the two states." Historic CA pols are dropped
**RANDOMLY** into UC vs LC.

**★ Non-chosen split persists (POST 3):** the split a pol is *not* placed in
**still exists as a permanent alt-state** — i.e. both halves are real,
admittable states; randomization only decides which one a given pol lands in.

**★ The proposed/codified random rule (POST 5, matthewyoung123):** roll a die per
new politician from the historic state, **re-rolled every new draft class**:
- **CA — 50/50:** `1–50 → Lower Cal`, `51–100 → Upper Cal`.
- **TX — quartiles:** `1–25 / 26–50 / 51–75 / 76–100` → the four TX splits.

**★ The ≥4-core-office random-fill rule (POST 5):** if a split-state doesn't end
up with **at least 4 pols (1 Governor, 1 Representative, 2 Senators)**, you
**fill it with random-GENERATED pols.** This is the floor that keeps a split
functional.

**★ The by-residence alternative (POST 1, theFreezerFlame):** "Just place them
within the state they reside in." Offered as doable for both CA and TX —
i.e. deterministic residence-based placement instead of the die. **Explicitly an
option, NOT the default** (POST 6).

## ★ Designer rationale — random reduces generated-pol count (POST 4, 6)

- **Functional necessity for TX (POST 4):** dividing TX four ways means "there'd
  not be enough to go around to WT, NT, etc, if we didn't random them. The game
  would not function." (Too few historic TX pols to staff 4 states by residence.)
- **★ vcczar's vision (POST 6, relayed):** "this has come up before and V
  specifically said we're doing it **the random way to reduce how many generated
  pols there are, as that's in line with his vision.**" → randomization is a
  **deliberate generated-pol-MINIMIZATION rule**, not a placeholder. (Same design
  rationale family as the b53 territorial-offices rejection #313 — minimize
  generated/fictional pols.) By-residence "is an option and there's no shame" in
  it, but it is not what ships.

## Banter (low signal)

- **POST 7:** joke — "there should be a way to admit Dakota as one state as
  well." A throwaway re: state granularity (ND+SD as one). No mechanic.

---

## Shipped-vs-designed (code-verified — flag for tech-lead)

**The entire mechanic is UNBUILT.** California and Texas exist **only as single
states**; no UC/LC or TX split, no split-state pol-assignment die, no random-fill
floor. The thread's "current behavior just places them randomly" describes the
**FORUM-GAME / spreadsheet ground truth**, NOT the shipped browser build.

- **CA / TX are single states only:** `src/data/states1856.ts:35`
  `{ id: 'ca', name: 'California', abbr: 'CA', region: 'West', electoralVotes: 4,
  ... }` and `:24` `{ id: 'tx', name: 'Texas', abbr: 'TX', ... }`. No `upper_cal`,
  `lower_cal`, `west_texas`, `north_texas` etc. **anywhere** in `src/`
  (grep: 0 hits in `expansionStates.ts`, scenarios, data, engine).
- **UC/LC absent from the expansion registry:** `src/data/expansionStates.ts`
  (the ~150-entry annexable-territories registry) contains **no California or
  Texas split**. It does add the *real* CA-adjacent states (Nevada, Oregon, etc.)
  and Mexican carve-ups (Baja Sonora, Sinaloa, Coahuila…), but **no UC/LC**.
  → **CONFIRMS the prior b53 finding: "LC/UC absent from the registry."**
- **No pol→split-state assignment of any kind:** there is no per-draft-class die,
  no quartile roll, no ≥4-core-office random-generated fill. The only thing
  resembling "alt-state" in code is **unrelated** (see next).
- **`altState` is a DIFFERENT system — do not conflate:** `Politician.altState`
  (`src/types.ts:1256`) + `altStateSeeded` (`:1257`) is the **relocation /
  carpetbagger secondary-home** field, seeded by **region distance** for
  relocation odds in `runPhase_2_1_4_Relocations`
  (`src/engine/phaseRunners.ts:626–642`: same-region 0.40 / cross-region 0.15 /
  else none, per `RELOCATION_ODDS.seed`, `types.ts:244`). It is **NOT** a
  California UC/LC split and has nothing to do with split-state assignment.
- **State type has no split/parent concept:** `State` (`src/types.ts`) has no
  `parentState` / `splitOf` / split-group field; the apportionment/EV side is a
  flat per-state `electoralVotes` (all expansion states hardcoded `4`,
  `expansionStates.ts:178`). A split-group abstraction would be net-new.

**Net for tech-lead:** to ship the thread's design you need **(1)** UC/LC + the
4 TX splits as real states (expansion-registry entries or scenario states),
**(2)** a "historic state → N split-states" mapping with **per-draft-class random
assignment** (CA 50/50, TX quartiles) of historic pols, **(3)** a **≥4-core-office
(1 Gov / 1 Rep / 2 Sen) random-generated-fill** guarantee per split, and
**(4)** the non-chosen split persisting as an independently-admittable alt-state.
None of this exists today.

---

## Delta list — map to EXISTING gaps where possible (consolidation owns the write)

- **ENRICHES the expansionStates / alt-states-EV gap [b50/b53]** — adds the
  concrete **split-state assignment mechanic** the registry needs: historic
  multi-split states (CA→UC/LC, TX→4) and how pols populate them. **Re-confirms
  "LC/UC absent from the registry"** via `expansionStates.ts` (code-verified) and
  the flat hardcoded EV=4 (`:178`) being inadequate for split-states. (Source:
  this digest, POST 1–5; code.)

- **ENRICHES the generated-pol-minimization design RULE (cf. b53 territorial-
  offices #313 rejection)** — POST 6 gives a fresh, explicit statement of
  vcczar's vision: **randomize split placement specifically to MINIMIZE generated
  pols.** Same rationale as #313. Adds the corollary that by-residence placement
  is an *allowed option* but rejected as default for this reason. (Source:
  POST 4, 6.)

- **NEW — random per-draft-class split-state pol-assignment die** — CA **50/50**
  (`1–50→LC, 51–100→UC`), TX **quartiles** (`1–25/26–50/51–75/76–100`),
  **re-rolled every draft class.** No analog in the build (`altState` is
  unrelated). Likely a sub-item under the expansionStates/alt-states gap rather
  than its own gap. (Source: POST 5.)

- **NEW — ≥4-core-office random-generated FILL rule** — a split-state must have
  **≥4 pols (1 Gov / 1 Rep / 2 Sen)**; shortfall is back-filled with
  random-generated pols. A staffing-floor invariant for split (and likely all
  thin/expansion) states. Not in the build. (Source: POST 5.)

- **NEW — non-chosen split persists as a permanent admittable alt-state** —
  randomization picks where a pol lands, but **both** UC and LC (and all 4 TX
  parts) are real, independently-admittable states. (Source: POST 3.)

- **CROSS-REF the census/apportionment #34 and #294 (industry) / #295 (era-aware
  draft pool)** — split-states need EVs/apportionment (#34; flat EV=4 is a
  placeholder) and would draw from the historic pol pool (#295). Coupling, not a
  merge. (Source: POST 5; code `expansionStates.ts:178`.)

## Open questions (for the human / consolidation)

- **Which 4 TX splits, exactly?** Thread names only WT/NT as examples (POST 4);
  the full quartile→state mapping (and the CA UC/LC boundary) is unspecified.
- **Random-fill identity:** when a split lacks 4 core pols, are the fill pols
  fully generated (names/stats) or drawn from a pool? POST 5 says "random
  generated"; the generated-pol-minimization rule (POST 6) implies as few as
  possible — tension to resolve.
- **Determinism:** the die must use the seeded RNG (`src/rng.ts`), not
  `Math.random`, to keep the draft reproducible — note for implementation.
- **Does the by-residence OPTION ship as a toggle?** POST 1/6 frame it as an
  available alternative; unclear if it should be a player/settings option or
  dropped entirely.
