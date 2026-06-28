# Digest — 145db158-ampu-military ("AMPU Military")

**Type:** CONTENT-AUTHORING thread, **NOT a playthrough**. 3 posts / 1 chunk
(chunk-001, all covered; source CSV ~4.4 KB). Opener: **vcczar** (tier-1)
mass-tagging the community to author the **Military policy genre**; POSTs 2-3 are
community/self adds (Gov-Actions + a blockade-mechanic note). **Why it matters:**
the batch-40 Military sibling of the well-established policy-genre drops
(Business/Labor #237 origin, Diplomacy, Immigration, Education, Civil-Rights,
Agriculture, Space, Civil-Service). It populates the **#221 content primitives**
(Legis-Prop / Pres-Action / Gov-Action) under the **#237 stateful policy-genre
framework**, carries the **#248 `Military` subtype** (already in the canonical
33-value enum), and is the **batch-40 war/treaty sibling** that feeds the shipped
**military meter** (the war-formula's "MilPrep" input, #45/#56). Pure design
intent — content primitives are **0% shipped**. vcczar's framing (POST 1):
*"I'm just generally open to ideas here. **No real major areas of obvious need.**"*
→ the genre is comparatively complete; CORROBORATE the framework, capture the
NOVEL sub-mechanics below.

---

## Genre framework — CORROBORATE briefly (well-established)

UNTAGGED draft (like `immigration`): **no `L/P/G/S` prefixes, no `*-Default`
baseline, no `Preq:` chains** — vcczar groups by mechanism header instead. Three
primitive buckets, explicitly labeled:
- **Legis Prop** (~35 rows, POST 1)
- **Pres Actions** (~40 rows, POST 1)
- **Gov Actions** (1 row in POST 1: "Build Military Academy"; +~18 more in POST 2)
- Community add (POST 3): one blockade Pres/Legis with an embedded RNG note.

No baseline `*-Default` row was authored (unlike Diplomacy's
`L-Ind-Default`/"No Active On-Going Diplomacy Legis"). Flag as a coverage gap:
this genre lacks the seeded "no military policy active" baseline its siblings have
(→ #237). Genre boundary recurs: a chunk of these overlap **Diplomacy** (Truman
Doctrine, Monroe-adjacent Roosevelt Corollary, World-War-Neutrality) — see the
overlap ruling below.

---

## ★ NOVEL #1 — Tech-TESTING as RNG Gov-Actions (HEADLINE, POST 2)

The genuinely new sub-mechanic in this drop: a **randomized military-tech-
progression** primitive — spend a Gov-Action → **roll for a capability upgrade**.
Verbatim (POST 2):
- "New ship testing (**chance of new ship class**)"
- "New naval cannon/gun testing (**chance of increasing fighting power of the navy**)"
- "Air Force testing (**chance of new fighter/bomber class**)"
- "New Air Force weapons testing (**chance of increasing fighting power of the air force**)"
- "New Army weapon testing (**chance of new tank/vehicle class**)"
- "New Army weapons testing (**chance of increasing fighting power of the army**)"

This is **distinct from a flat Legis-Prop or a deterministic toggle**: the action
*succeeds probabilistically* and the payoff is either (a) a new unit **class**
unlocked or (b) a **fighting-power increment** to a branch (army/navy/air).
Two-axis output (new-class vs power-bump) per branch. POST 3 adds the same RNG
shape to a Pres/Legis blockade: "Impose blockade on enemy state (maybe the enemy
military can take like a random **1-5% hit** for 'lack of supplies')."

**Implications to flag:**
- A **candidate content/RNG primitive** beyond the L/P/G/S set — "roll-for-effect"
  Gov-Actions. Cross-ref #221 (the primitive registry this would extend) — the
  authored primitives so far are deterministic; this introduces a stochastic
  effect node.
- Must obey the engine's **deterministic-RNG rule** (`src/rng.ts`, seeded; no
  `Math.random` in engine code) — any "chance of new ship class" roll has to draw
  from the seeded RNG so runs stay reproducible.
- Per-branch **fighting-power** as a tracked quantity (army/navy/air strength)
  that these upgrades increment — a new state dimension the shipped `military`
  meter (a single −5..+5 dial) does not separate by branch. This pairs with the
  #45/#106 finding that the war engine has **no army/navy/air branch separation**.

## ★ NOVEL #2 — "Doctrines" as a large Pres-Action family (POST 1)

A dense **named-doctrine** family inside the ~40 Pres-Actions — the largest
single cluster, and not previously enumerated as its own pattern:
Truman, Carter, Reagan, Bush, Eisenhower, Nixon Doctrines + **Roosevelt
Corollary** (Monroe-adjacent) + World-War-Neutrality Policy; plus **SDI /
Strategic Defense Initiative**, **Manhattan Project**, Develop-Hydrogen-Bomb,
DADT ("Don't Ask; Don't Tell"), Transgender-military-ban, Allow-Women-in-Combat,
Institute/Increase **Drone Warfare**, Pro-Chemical-Weapons policy, Send-CIA-into-
Afghanistan/Pakistan.

**Opposed / sequential option-sets (corroborates #248 option-set axis):**
- **Sequential (institute→increase):** Institute Drone Warfare → Increase Drone
  Warfare; Institute military drone program → Expand military drone program
  (Legis side). A ladder, not a one-shot.
- **Mutually-opposed nuke triad:** **Reduce nukes ↔ Proliferate nukes ↔ Eliminate
  all nukes** (+ "Nuclear freeze party"). A 3-way negation set — sharper than a
  binary toggle; the same option-set/negation axis Diplomacy showed
  (Recognize↔Don't-Recognize, 4-way Aid).
- Budget mirror pairs: Military budget increase ↔ decrease (Pres); + the Legis
  defense-spending up/down/major-up/major-down quad.

**★ Genre-boundary overlap (flag for consolidation):** **Truman Doctrine appears
in BOTH** this Military drop AND the batch-39 Diplomacy drop (`b8aecb83`). Several
doctrines are foreign-policy by nature (Roosevelt Corollary, World-War-Neutrality,
Carter/Reagan/Eisenhower/Nixon Doctrines all key off foreign posture). No single
gap owns cross-genre boundary reconciliation — same unresolved overlap noted for
Diplomacy↔Trade↔Military. Reading: a doctrine may carry **multiple #248 subtypes**
(Military + Diplomacy) — corroborates the open single-vs-multi-subtype question.

---

## Military-structure toggles → feed the Military Preparedness meter (#45/#56)

A large bloc of Legis-Props are **standing military posture toggles**, many in
opposed pairs, that set the **military-preparedness** input the war formula reads
(#45's "MilPrep 0-15" / `fixes` 9-level prep meter; #56):
- **Standing-force toggles:** No Standing Army (Militias Only) ↔ Standing Army;
  No Standing Navy ↔ Standing Navy; No Militia Act; Establish Continental Army /
  Continental Navy (Rev-War era).
- **Size up/down:** Increase/Decrease size of the army; Increase/Decrease size of
  the navy; defense-spending Increase/Decrease + Major-Increase/Major-Decrease.
- **Draft variants (a sub-family):** Grant president power to call national draft;
  Selective Service; Institute peacetime military draft; Compulsory military
  service; Mandatory military service for those 18-21; "Allow those wealthy enough
  to purchase a substitute to avoid the draft"; Pres-Action "Military Draft" /
  "Military resource draft." → a coherent draft-policy ladder.
- **Era-flavored manpower (1856/Rev-War):** "Pay slaveholders to use slaves during
  war"; "Authorize privateers"; "Encourage foreign soldiers to join the war
  effort" — era-gated (Slavery/Rev-War), corroborates #258 predicate gating.
- **Wartime executive (Pres-Actions):** Pull troops from Reconstructed States;
  Blockade states in rebellion (no invasion force) [Reconstruction-era, ties
  #56]; Authorize troop surge; Major morale speech during wartime; "Pro-Chemical
  Weapons to Defend National Interests."

These are the **batch-40 war/military-prep content** feeding the shipped
`military` meter and the war-declaration/preparedness side of #45 (the `fixes`
prep-band roll). CORROBORATE #45/#56; no new mechanic, but the draft-variant
ladder + the slaveholder/privateer era manpower options are concrete seed rows.

## ★ Tech-LADDER — era progression for the navy (POST 1-2)

An explicit **era-banded tech ladder** for naval (and implied air/army) classes,
keyed to the #92/#206 era-band content model:
**Wood/sail-driven navy → Steam-powered navy → Steel Navy → hover-vessel navy.**
- "Wood, sail-driven navy" (founding) → "Move away from Sail Navy and towards
  Steam powered Navy" (POST 2) → "Steel Navy" (gilded/modern) → "Convert navy to
  hover vessel technology" (Future).
- Supporting infra laddered alongside: "Establish coaling stations around the
  world to refuel Naval ships" (Steam era), "Massive expansion of naval bases in
  the Philippines," "Increase production of ice-breakers for naval use,"
  Replace-frigates-with-gunboats, Retire/Update outdated weapons & personnel.

This ties the **era-band content model** (#92/#206): a military capability's
*availability* is era-gated, and the RNG tech-testing actions (NOVEL #1) are the
mechanism by which a band's new classes are *unlocked*. Cross-ref #258 (predicate
gating on the prior tech tier, e.g. Steel-Navy requires Steam active).

## Offices created here (cross-ref #66 + the #66 Civil-Service overlap)

Military Pres-Actions/Legis that **create offices/departments** — the same in-game
office-creation pattern as #66 (Fed Chair / CoS / CNO / FBI), arriving via the
Military genre:
- **Create Army Chief of Staff** (POST 1); **Create Chief of Naval Ops** (POST 1);
  **Create Chairman of the Joint Chiefs of Staff** (POST 1) / "Form Joint Chiefs
  of Staff" (POST 2).
- **Combine Army and Navy into Department of Defense from War Department** (POST 2)
  — a **MERGE** lifecycle verb (War + Navy → Defense), exactly the merge case the
  Civil-Service thread (`fa452d38`) flagged (Sec of War + Sec of Navy → Sec of
  Defense). Confirms the #66 office-lifecycle (create/split/elevate/merge/abolish)
  spans Military + Civil-Service genres — **cross-genre overlap, flag for
  consolidation** (which genre "owns" the War→Defense merge).
- **Establish USMC** (Marine Corps), **Establish Merchant Marine** + **Merchant
  Marine Academy** (POST 2). Goldwater-Nichols Act + Military/Naval Reform +
  Goldwater-Nichols-style "Create Chairman of JCS" reorganize the structure.
- Note #66 today: `cabinetSeatsForYear` is year-keyed/fixed; CoS/CNO already named
  in #66 as +1-Command-granting offices — these Military rows are the
  authoring-source for that. CNO replaces Senior Admiral (#66).

## Future content (#206) — military Era-of-the-Future

Future-band rows (corroborates #206, the doubly-unbuilt Future era):
- "Institute / Expand military drone program"; "Convert navy to hover vessel
  technology"; "Decommission the majority of non-hovering naval vessels."
- "Replace entire military officer corp with single **AI-Augmented General-in-
  Chief**"; "Convert to entirely **non-human / robot army**, aside from officers."
- "Build naval base in **Greenland**"; (Antarctica-adjacent: ice-breaker /
  Greenland Arctic projects). "Close and sell foreign military bases."
These are concrete candidate Future-band entries — corroborates #206's "Future is
under-content'd" and #262's per-era-band coverage ask.

---

## Shipped-vs-designed (engine facts — not re-derived this run)

- **Military preparedness IS a shipped meter** — the `military` value in the
  `NationalMeters` set (`types.ts:28/36`, a −5..+5 dial), read by the war formula
  as the "MilPrep" input (#45/#56). It is a **single scalar**: NOT separated by
  branch (army/navy/air) and NOT a 0-15 prep band — the war formula's "MilPrep
  0-15" (#45) and `fixes`' 9-level prep meter are designed, not the shipped shape.
  → the **per-branch fighting-power** the RNG tech-testing actions would increment
  has no shipped home; the war engine has **no army/navy/air separation** (#45/#106).
- **`Legislation` has NO `subtype` / prereq field** (the 4-value `committee`
  routing field is the only classification; "Foreign" is the coarsest bucket).
  → the #248 `Military` subtype and the #258 era/state gating have no engine home.
- **The L/P/G/S content primitives + scripted events = #221, 0% shipped.** No
  `presActions` / `govActions` / `scriptedEvents` type or authored pool exists;
  the ~35 Legis-Props / ~40 Pres-Actions / ~19 Gov-Actions here have no engine
  home. The RNG tech-testing + blockade-supply-hit actions are roll-for-effect
  primitives that #221 does not yet model and that must use seeded `src/rng.ts`.

→ Net: pure design provenance for the Military genre. Adds NO shipped behavior;
ENRICHES the 0%-shipped content gaps and feeds the war/military-prep cluster.

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs; consolidation agent owns the gap-log write. No new
numbers assigned.)*

- **#221 (content primitives + scripted events)** — CORROBORATE + **sharpen with a
  NOVEL primitive**: the Military genre populates ~35 L / ~40 P / ~19 G (untagged
  draft, like `immigration`). **★ NEW sub-finding:** **RNG / roll-for-effect
  Gov-Actions** ("New ship testing → *chance of* new ship class"; naval/air/army
  weapon-testing → *chance of* fighting-power bump; blockade → *random 1-5% hit*)
  — a stochastic effect-node beyond the deterministic L/P/G/S primitives,
  constrained by the seeded-RNG rule (`src/rng.ts`). Source: POST 1-3.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE. Implies the
  **Military** subtype value (already in the canonical 33-enum), applied across
  L/P/G. The **nuke triad (Reduce↔Proliferate↔Eliminate)** + drone
  Institute→Increase ladder + budget up/down pairs sharpen the option-set/negation
  + sequential-ladder axes. **Multi-subtype evidence:** doctrines straddle
  Military + Diplomacy. Source: POST 1.
- **#237 (stateful policy-genre framework)** — CORROBORATE + **coverage note:** the
  Military genre was authored WITHOUT a `*-Default` baseline row (unlike Diplomacy
  `L-Ind-Default`) — a missing "no military policy active" seed. Source: POST 1.
- **#258 (predicate-gated availability field)** — CORROBORATE. Era/state gating
  recurs: tech tiers gate on prior tier (Steel-Navy needs Steam; hover needs
  Steel); era manpower (slaveholders/privateers → Slavery/Rev-War); Reconstruction
  Pres-Actions (Pull-troops / blockade-rebellion). No new predicate CLASS beyond
  Diplomacy's, but reaffirms tech-tier-prereq + war-state gating. Source: POST 1-2.
- **#45 / #56 (generic war system + military preparedness)** — CORROBORATE. The
  military-structure toggles (standing-army/navy, size up/down, defense-spending
  quad, the **draft-variant ladder**, era manpower) are the batch-40 content that
  feeds the shipped `military` meter + the war-declaration/prep side of #45.
  **★ Sharpens #45/#106's "no branch separation":** the per-branch fighting-power
  the RNG tech-testing actions increment implies the war engine SHOULD track
  army/navy/air strength separately. Source: POST 1-3.
- **#66 (offices created by law / cabinet lifecycle)** — CORROBORATE + **cross-genre
  overlap.** Army Chief of Staff, Chief of Naval Ops, Chairman of Joint Chiefs,
  Establish USMC / Merchant Marine (+Academy), and the **War + Navy → Defense
  MERGE** all arrive as Military Pres-Actions/Legis — the authoring-source for the
  CoS/CNO offices #66 already names, and a 2nd witness (with Civil-Service
  `fa452d38`) for the merge lifecycle verb. **Flag:** which genre owns the
  War→Defense merge. Source: POST 1-2.
- **#206 (Era-of-the-Future, doubly unbuilt)** — CORROBORATE. Concrete Future-band
  rows: drone-program expand, navy→hover, AI-Augmented General-in-Chief,
  non-human/robot army, naval base in Greenland, decommission non-hover vessels,
  close/sell foreign bases. Source: POST 1.
- **#262 (content-coverage / per-primitive + per-band balance)** — CORROBORATE.
  vcczar self-assesses "no real major areas of obvious need" (POST 1) → Military
  is comparatively complete, contrasting the Diplomacy/Civil-Service Future asks;
  the named hole is the absent `*-Default` baseline + Future tech rows. Source:
  POST 1.
- **Genre-boundary overlap (carry as open question)** — Truman Doctrine + the
  presidential doctrines straddle **Military ↔ Diplomacy** (Truman Doctrine is in
  BOTH `b8aecb83` and this thread); the War→Defense merge straddles **Military ↔
  Civil-Service** (#66). No single gap owns cross-genre reconciliation — flag to
  consolidation. Source: POST 1.

---

### Provenance notes
- Single chunk; all 3 posts read. One-sided **idea/authoring dump**: POST 1
  (vcczar's untagged master list: ~35 Legis-Props + ~40 Pres-Actions + 1
  Gov-Action + the "no obvious need" framing) is load-bearing; **POST 2** is the
  ★ Gov-Action payload incl. the RNG tech-testing family + the War→Defense merge +
  USMC/Merchant-Marine; **POST 3** is a 1-row blockade add with the embedded
  random-supply-hit RNG note. No GM rulings, no playthrough mechanics.
- Engine facts (military = a single shipped `NationalMeters` scalar; `Legislation`
  has no subtype/prereq; #221 primitives 0% shipped; seeded RNG via `src/rng.ts`)
  taken from harness context + the sibling Diplomacy/Business-Labor runs;
  `types.ts:28/36` confirms `military` is a `NationalMeters` member this run.
