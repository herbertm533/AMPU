# Digest: KIA Military Leaders Possibly Adding to AMPU (`68fa2220`)

**Type:** DATASET / WAR-DEATH MECHANIC thread (NOT a playtest; no historian).
**Scope:** 1 chunk / 25 posts. GM @vcczar (tier-1) + @Cal, @MrPotatoTed (Ted),
@ConservativeElector2 (CE2, the fill-out volunteer). Sep 26 – Oct 4, 2022.
**Core signal:** war casualties are **exceeding the supply of KIA-eligible
politicians** in those wars ("the deaths are exceeding the number of in-game
politicians that died in those respective war", POST 1) → vcczar lists ~50 real
KIA officers as candidates to ADD to the dataset, AND slightly lowers the war
death % so the roster isn't drained. Dataset-content gap + war-death-vs-roster
scaling evidence. Spans 10 wars; the shipped war engine only models RevWar.
**Provenance only — no living-doc edits (consolidation agent owns the gap log).**

---

## The dataset-gap signal (the heart of the thread)

- **POST 1 / 23 (vcczar):** the prompt. The battle-death loop is killing more
  military pols than the dataset historically has dying in those wars, so the
  pool of KIA-eligible figures is exhausted. Two fixes proposed: (a) **add more
  KIA officers** to the dataset, (b) **decrease the % chance of death (incl.
  career-track deaths)**. "Some wars are not represented" — coverage holes.
- **POST 2 (vcczar):** warming to the change but a **% decrease is in order** —
  "it's not like historically we've had boatloads of flag officers die in
  combat… for the entire history of the country, not really." → the death rate
  is too high relative to real history AND relative to roster size.
- **POST 7 / 8 (Cal, vcczar):** Cal **opposes adding many military statesmen**:
  the Military/Army track already fills fine; extra military pols would get
  thrown into **ahistoric career tracks** (private/backroom, or 50/50 into
  admin/legislative/governing/judicial) because there are "very few spots open
  to actually serve in the military." → adding officers has a *side cost*
  (career-track misassignment). vcczar's compromise (POST 8): **reduce death %
  AND add ~2 per war**, "make it very rare… the high command doesn't die and
  those that become politicians later have usually survived."
- **POST 12 (vcczar — the decisions):**
  1. Will add **~10** of the listed officers (not all ~50).
  2. **Slightly decreased** the death chance (a Rev War half-term in a playtest
     had Civil-War-level officer fatalities); reversible if deaths stop happening.
  3. **Post-early-release plan:** measure avg generals/admirals/career-track
     pols killed per playtest; if **< the # of historically-killed statesmen in
     the dataset → raise the %**; if **still > → add even more military pols.**
     ← explicit roster-vs-death-rate balance loop.
  4. Death %s **lowered further once Chairman of the Joint Chiefs of Staff
     exists** (post-DoD flag officers rarely die in combat — command from Qatar,
     not the front line); also harder to find politically-ambitious modern KIAs.
  5. **New office rule:** once **West Point Military Academy** is created, the
     major military officer positions **cannot be reappointed** after a holder
     vacates / is removed.

## The candidate-officer list (POST 1 / 23) — scope by war

vcczar's full candidate set (he stated he'd add only ~10; CE2 filled out "a
little over 10" — POST 13/20). Each entry has a Wikipedia link in-thread;
"(if/could/might be in game)" = de-dupe flag against existing roster.

| War / era | Candidate officers (in-thread) |
|---|---|
| **Rev War** | John Thomas*, John Ashe, David Wooster, Pinketham Eaton, Johann de Kalb*, Michael Kovats, Lambert Latham, Alexander Scammell, Joseph Warren* |
| **NW Indian War** | Richard Butler |
| **War of 1812** | John Swift, Zebulon Pike*, William Sharp Bush, John Brooks Jr, William Henry Allen |
| **Misc. Indian Wars** | Edward Canby, Howard B. Cushing, George A. Custer*, Francis L. Dade |
| **Mexican War** | Jacob Brown, Pierce Mason Butler, Henry Clay Jr*, Samuel Ringgold, Archibald Yell* |
| **American Civil War** | Fletcher Webster*, Alonzo Cushing, Philip Kearny*, Charles Russell Lowell, Nathaniel Lyon*, James B. McPherson*, John Rodgers Meigs, Robert Gould Shaw, John Sedgwick*, George Washington Rodgers*, Paul Joseph Revere, Jonathan Mayhew Wainwright* |
| **Spanish-American War** | Bill Stearns, Jules G. Ord, Hamilton Fish II*, Worth Bagley |
| **World War II** | Simon Bolivar Buckner Jr, Paul Newgarden, Henry Mullinnix, Isaac Kidd, Frederick Walker Castle, Nathan Bedford Forrest III |
| **Korean War** | Walton Walker, Bryant Moore |
| **Vietnam** | Rembrandt C. Robinson, George W. Casey Sr, John A. B. Dillard, Keith L. Ware, Robert F. Worley, Bruno Hochmuth, William Crumm |
| **War on Terror / Iraq** | Harold J. Greene |
| **(POST 23-25, late add)** | **John Brown** — not a military leader; "tried to lead an uprising" (0ccultist); vcczar agreed previously but unsure if ever added; CE2 may add. |

\* = vcczar's own "might already be in game" de-dupe flag (verify against `ROWS`
before adding to avoid same-name dupes; CLAUDE.md merge rule: same-name within
~25 yrs ⇒ same person). Ted (POST 10) flags a coverage bias: the list is all
**flag officers**, missing **lower-rank pols with political potential who died**
(e.g. JFK's older brother Joe Kennedy Jr) — "Not everyone is a flag officer."

## Statline-shape & authoring rulings (POST 14-22) — feed `seedDataset.mjs`

CE2 filled the additions; the field set he reasoned about maps 1:1 to the
`seedDataset.mjs` `ROWS` schema (`[adm,leg,jud,mil,gov,bck], command, traits[],
party` + ideology/birthYear/state):

- **Party when bio shows no politics (POST 14-15, ruling):** use the **state's
  general lean around their birth year**, plus add **Party Flip** and
  **Independent**. Explicit calls: McPherson, Brooks, Webster, Shaw = **Red**;
  Forrest III, (prob.) Buckner Jr = **Blue**.
- **Frail? (POST 20-21, RULED no):** died young in battle but could have lived to
  90s otherwise → **do NOT mark Frail**. [Corroborates #226 frail/hale: Frail
  here is a *constitution/longevity* trait, not "died young," and is **earned in
  play** — `revolutionaryWar.ts` *grants* Frail on a battle wound; you don't seed
  it onto a KIA at birth.]
- **Celebrity? (POST 20-21, RULED no):** even famous-by-heroic-death figures
  (Shaw, Custer) do **not** get seeded Celebrity. [Celebrity, like Military
  Leader, is earned, not seeded.]
- **"Military Leader" trait (POST 21, RULED):** vcczar **removed** it from every
  fill — **"that has to be earned."** (Don't seed it onto `ROWS` entries.)
- **Initial expertise rename (POST 22):** the expertise/track formerly called
  **"Military" is now "Army"**; CE2 set new adds to **Army**, but **many older
  dataset entries still say "Military"** → a dataset-consistency cleanup item.
  [In code `EXPERTISE_NAMES` still includes both `'Military'` and `'Naval'`
  (seedDataset.mjs:30), and `ROWS` military pols carry the `'Military'` *trait* —
  trait vs. expertise naming needs disambiguation; corroborates the broader
  trait-name-drift cluster #216/#168.]
- **Shaw special-case (POST 20-22, RULED):** Shaw died at 26, *before* his
  normal 1864 draft year. Do **not** back-date his draft to 1860 — **keep the
  standard draft date and author a scripted EVENT** that either kills him or
  makes him a Celebrity if he survives. → a per-figure "die-or-become-celebrity"
  event pattern (relates to the foreign-volunteer/scheduled-figure event flow,
  gap #46).

## Relation to the war engine (shipped reality)

- The build's only combat-death system is **`revolutionaryWar.ts`**:
  `applyCasualties` (revolutionaryWar.ts:67-121) rolls difficulty-tiered
  death/wound dice, picks victims from pols with **`military >= 1 && !Frail`**,
  and calls `recordDeath(snap, id, 'battle')`. Wounds grant **Frail** with a
  **Hale** resist roll (revolutionaryWar.ts:99-117) — directly the #226 mechanic.
- **No generalized multi-war casualty engine exists.** Battle-death plumbing
  lives only in `revolutionaryWar.ts` + `halfTermSummary.ts` (recordDeath) +
  `phaseRunners.ts`. The thread's concern spans **10 wars (RevWar → War on
  Terror)**, none of which (beyond RevWar) have a shipped combat-death loop, and
  **none of vcczar's design levers are coded**: no death-% scalar, no
  CJCS-era reduction, no West-Point no-reappointment rule, no roster-vs-deaths
  measurement loop.
- **Dataset side:** additions go to **`scripts/seedDataset.mjs`** — `ROWS` (the
  marquee 1772/1856 source array; military pols already carry the `Military`
  trait + `command`, e.g. revolutionaryWar-era Greene/Morgan/Knox at
  seedDataset.mjs:69-110) or **`ERA_FIGURES`** (additive-only). Per CLAUDE.md,
  do **NOT** hand-edit the generated outputs (`defaultDraftClasses.ts`,
  `public/standard-draft-classes.json`, `politicians-dataset.csv`). Corroborates
  the corrected **#240** fact: `CURATED_ROWS` is built at runtime from `ROWS` +
  `ERA_FIGURES`. KIA officers seeded with **sub-floor electoral stats**
  (legislative ≤ 1) per the existing balance rule, since they're combat-only.

## Open questions (for the human / consolidation)

- **Which ~10 were actually added** (POST 12-13)? Thread doesn't enumerate the
  final subset — only the ~50-name candidate pool. Confirm against `ROWS`.
- **The de-dupe flags** (the `*` names) need verification: which are already in
  `ROWS` vs. genuinely missing.
- **Magnitude of the death-% decrease** (POST 12 "slight") is unquantified — no
  number given; explicitly **reversible/tunable** by vcczar.
- **Naming:** is the track/expertise canonically "Army" now (POST 22)? If so the
  `'Military'` expertise + `Military` trait both need a rename sweep.
- **Coverage holes:** wars "not represented" (POST 1) + lower-rank political
  KIAs (Ted, POST 10) — open content scope, not a closed list.

---

## Candidate gaps for consolidation

1. **[DATASET CONTENT — NEW] War-KIA officer roster is too thin per war.** The
   battle-death loop drains the pool of historically-KIA pols faster than the
   dataset supplies them. Add KIA military figures (~50-name candidate pool
   above; vcczar committed ~10) to `seedDataset.mjs` `ROWS`/`ERA_FIGURES` with
   sub-floor electoral stats, `Army`/`Military` expertise, **no seeded Frail /
   Celebrity / Military-Leader** (all earned). Spans RevWar → War on Terror.
   *(NEW dataset-content gap; relates to #240's CURATED_ROWS fill and the #120
   dataset-maintenance umbrella.)*
2. **[MECHANIC — NEW] War-death rate must scale to roster size (cap deaths or
   tune %).** vcczar lowered the death % and defined a **measurement loop**
   (avg per-war kills vs. # historically-killed statesmen → raise % if under,
   add pols if over). Build has no death-% scalar and no such governor. Pairs
   with the **generate-a-candidate / roster-exhaustion** idea (#115): when the
   war out-kills the roster, either cap battle deaths or auto-generate
   replacements. *(NEW; corroborates/extends #115 roster-exhaustion and the
   war system.)*
3. **[MECHANIC — NEW] Era-gated war-death reduction.** Death % drops further
   once **Chairman of the Joint Chiefs / DoD** exists (flag officers stop dying
   on the front line). Unbuilt; era-conditional scalar on the casualty roll.
   *(NEW; ties to the era-gating pattern #92/#68.)*
4. **[MECHANIC — NEW] West Point ⇒ no-reappointment to major military offices.**
   Once West Point Military Academy is created, a vacated/removed military
   officer position cannot be re-filled by the same person. Unbuilt office rule.
   *(NEW; relates to military-appointment-eligibility DH-75.)*
5. **[CONTENT/EVENT — corroborates #46] Per-figure "die-or-become-celebrity"
   scripted event (Shaw pattern).** Keep standard draft date; an event resolves
   to death or Celebrity. Also the Ted note: seed **lower-rank political KIAs**
   (e.g. Joe Kennedy Jr), not only flag officers.
6. **[CORROBORATES #226] Frail/Hale is an earned, in-play wound trait, not a
   seed flag** — RULED no-Frail on young battle deaths; matches
   `revolutionaryWar.ts` granting Frail (with Hale resist) on wounds.
7. **[CORROBORATES #216/#168 + #240] Trait/expertise naming drift:**
   "Military" expertise renamed **"Army"**; legacy entries still say "Military";
   `Military` also exists as a trait — disambiguate/sweep. Party-default rule
   for apolitical bios = state lean at birth + Party Flip + Independent.

**NEW gaps:** items 1, 2, 3, 4 (dataset-content + 3 war-death/office mechanics).
**Corroborates:** #240 (CURATED_ROWS/`ROWS`+`ERA_FIGURES` build), #115
(roster exhaustion), #226 (frail/hale earned in play), the war engine
(RevWar-only today), #46 (scheduled-figure event), #216/#168 (trait naming),
#120 (dataset-maintenance umbrella).
