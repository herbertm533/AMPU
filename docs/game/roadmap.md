# AMPU — Roadmap

> **★ North-star / GM-replacement lens (read this first).** The entire backlog
> below is, read correctly, **the catalogue of work a human Game Master does by
> hand every turn** — and AMPU's core mandate is a **zero-human-GM game**. The
> conceptual charter lives in `game-context.md` → **"★ North-star: the app must
> subsume the human GM"** (cross-referenced from `technical-guide.md` §9). For a
> single VIEW that groups the existing items by **which half of the GM's job each
> retires** — ① referee/calculator vs. ② opponent — see the **"GM-replacement
> lens"** section just below the keystone overview (it is a *view over the
> dependency-ordered backlog, NOT a re-sequence*; the top of the queue is
> unchanged: **QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788`
> (E1)**).

> **★★★★ Batch-30 version — FIVE DESIGN/DATA/changelog threads, NO playtest (a DESIGN/DATA batch,
> NO playtest exercise): `revampPV` (`4266d56e`, the Feb-2023 PV-SYSTEM OVERHAUL — re-valuing every
> trait/ability's Politician-Value on a fixed tier scale; vcczar POST 33 = the designer-authoritative
> ~65-item tier list; DIED UNRESOLVED on a GM handoff) + `summer2021`-changelog (`f2aa81fd`, vcczar's
> tier-1 ALL-DECIDED rule-changes out of the batch-26 `summer2021` run — the ORIGIN of DH-76) + `ampuData`
> (`853ce63f`, the per-administration 1774→2022 content INDEX — an authoring source) + `presidents`
> (`5e00ec8e`, the cross-playtest president RECORD + corpus-coverage map) + `ampuUpdates` (`970616d5`,
> vcczar's Apr-Jul 2021 dev changelog — the earliest `GM⇒App` charter). **NO new keystone, NO re-sequence,
> top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** 14 NEW gap rows #214–#227 + 1 NEW
> design-hole bug DH-77 (max gap #227, max bug DH-77). **The value:**
> **(1) ★★★ HEADLINE → THE PV-SYSTEM OVERHAUL SPLITS into PV QUICK-WINS + a GATED BALANCE EPIC (debt #85;
> `GM⇒App`).** `pv.ts`'s `computePV` ships a PRE-REVAMP formula — flat per-trait `+4`/`−5` (`pv.ts:76-77`),
> flat `command × 10` (`:74`), flat `skill × officeWeight × 4` (`:70-73`), magic `Kingmaker +6` (`:79`), a
> `Math.max(0,…)` clamp (`:88`); office/age/FF terms at `:80-87` (DH-77 is the defect anchor for these
> sites). The `revampPV` thread re-valued every trait on a fixed TIER scale (25/10/7/3/−3/−7/−10, ±25
> extremes) but DIED UNRESOLVED (vcczar disowned the exact numbers — *"the RANKING is the point"* — and the
> fitted formula was deferred to OrangeP47, never delivered). **★ The tech-lead SPLITS this (binding):**
> **(a) PV QUICK-WINS (cheap-fixes lane NOW):** **#216** the trait-name remap (**S — the BLOCKING
> PREREQUISITE** that unblocks #214: ~17 of ~57 P33 trait line-items mis-key/drop vs the shipped `Trait`
> union [`types.ts:62-117` — ~15 absent, 2 renames `Flipflopper`→`Flip-Flopper`/`Two-faced`→`Two-Faced`,
> +12 shipped traits never valued]; an explicit old→new map, independently useful, DO FIRST) + **DH-77** the
> floor-offset clamp fix (**XS** — swap `Math.max(0,…)` at `pv.ts:88` for a constant floor-OFFSET so the CPU
> keeps ordering among sub-zero pols; the clamp is the most clearly *wrong* line today). **(b) BALANCE EPIC
> (GATED):** **#214** per-trait tiers (**M-L**) + **#215** per-ability curve / Command re-weight (**M** —
> first-point-worth-more, Command ≈25/level decreasing, Admin/Military low-floor; restrict-born-Command left
> OPEN as a toggle) — **GATED on the un-ingested "Groupthinking the Political Value" trait-EFFECTS thread**
> (P33 sets only POINT VALUES), and the **SAME PR must re-tune `calcStateVote`'s `pv*0.1` (`phaseRunners.ts:
> 3709`) — `pv = c.pvCache` (`:3699`) feeds every state-vote score, so a PV reweight DIRECTLY shifts election
> margins** (same election-balance surface as #18/#184/DH-72/QW19-21). **#220** PV display-scale = a **S
> DECISION** (raw "pink" [revampPV lean] vs 0-100/100-normalized [summer2021 POST 200-205], UNRESOLVED) →
> goes to Decision-gated (A) User-gated. **So: ship #216 + DH-77 as quick-wins; treat #214/#215 as ONE
> PV-reweight balance epic gated on the effects thread + a same-PR `calcStateVote` re-tune.** debt #85;
> game-mechanics §3.4.1.
> **(2) ★★ #217 the president/cabinet IMPLEMENTATION sub-engine + ~30 governing traits (debt #86; deepens
> #179; `GM⇒App`) → an L SYSTEM LAYER, gated on federalism.** A DISTINCT layer beyond the flat `traits[]`:
> after legislation/actions pass, a president+cabinet success→Blunder roll, modified by ~30 expertise-gated
> genre traits + Delegator/Micromanager + Crisis-{Manager,Admin,Gov} (the Crisis-Admin 10/20% Lingering
> crisis-pull ON TOP of #179's cabinet rolls) + Passive/Predictable + Passive+Pliable PUPPET + Magician
> (`summer2021` POST 128, 139-156, 167-184, 239). Shipped placeholders = the deterministic cabinet drift
> (`phaseRunners.ts:3260`) + the flat `chance(0.5)` exec action (`:3632`). **★ DE-DUP RISK** (several overlap
> Efficient/Egghead/Easily-Overwhelmed — reconcile BEFORE adding) + these traits need PV values (#214) + the
> remap (#216). **L (≥2 systems — rides #179's roll engine + #182's action budget + §14.1.y); folds into
> E16/E6.** debt #86; game-mechanics §20.10.1.
> **(3) ★ #221 the era-content registry needs TWO SCHEMA FIELDS (debt #88; sharpens K4 / #92 / #206) → folds
> into K4.** The `EraEvent` shape (`types.ts:1466-1482`) lacks both: (1) a **scripted-vs-flavor tier flag**
> (flavor events are narration-only, post-launch scope — vcczar declines flavor suggestions, `ampuData` POST
> 4, 41) and (2) **per-category first-active-era metadata** (Pres-Actions/SC-Cases/Gov-Actions are *"Not
> functional"* pre-1789). Both are SCHEMA fields, not engine logic; XS-S each. The canonical content
> TERMINATES at Biden/2022 with zero future-band rows — the authoring-side confirmation of #206/#92's
> two-level content-band model. debt #88; game-mechanics §27.1.1.
> **(4) ★ #218 Rule-of-Four / CJ case-refusal (S) + #219 US-Rep PROPORTIONAL representation (S) (debt #87) →
> S/XS fold-ins into the SCOTUS + legislative clusters.** Both ABSENT: no case-refusal/Rule-of-Four step;
> `State.representativeIds` (`types.ts:1327`) is a flat id list with no proportional seat-share. **#218** (a
> ≥4-Judicial CJ may refuse a Gov-Action state case; Rule-of-Four overrides; Iron-Fist CJ bypasses;
> Jurisprudence = unlimited; Passive = cannot refuse) **must SHARE #217's Passive/Jurisprudence/Iron-Fist
> trait reads** → E25; **#219** (each influential US Rep carries `floor(stateReps/influentialReps)` of the
> apportioned seats, remainder to the highest-Legislative rep) → E14/E7. debt #87; game-mechanics §27.1.1.
> **(5) ★ SMALL FOLD-INS #222–#227 (debt #89; several `GM⇒App`) → S/XS into existing clusters.** **#222**
> committee-size scales with state count (3→11 at 50; S; → E7/E14, `phaseRunners.ts:1894-1928` is a fixed
> 4-committee sort) · **#223** chair-selection 25%→enthusiasm (XS; → E7/E16, hooks #18/#51/#124) · **#224**
> lowest-satisfaction 25% auto-flip (S; **DISTINCT from conversion #76** — no auto-flip in `src/`; → the
> realignment/conversion cluster E9/#108) · **#225** Celebrity expiry if a pol runs before 40 (XS; → E18/draft,
> reconcile with the `summer2021` Celebrity/Military-Leader merge) · **#226** Frail/Hale lifespan auto-traits
> (died<60⇒Frail, lived86+⇒Hale; XS; **a NEW `scripts/` DATASET rule, NOT engine** — Frail/Hale are runtime-only
> via battle wounds → folds into the #120/E18d dataset umbrella + `scripts/seedDataset.mjs`) · **#227**
> Trim-Roster phase REMOVED (XS verify-only; **already aligned** — no Trim-Roster in `phases.ts`/`src/`; ensure
> the `summer2021` random-retirement tuning prunes — → the death/retirement cluster). debt #89; game-mechanics
> §30.20.
> **(6) ★ DH-76 / #115 SHARPENING (debt #90).** **DH-76** (filibuster-without-cloture) now has its ORIGIN — it
> was FIRST authored in `summer2021` (the batch-26 run's changelog); the batch-29 `wilsons1916#P349` finding
> was the downstream symptom. No re-size — the cloture build stays debt #80/#208 (E9 9b once K5 lands).
> **#115** (generate-a-candidate) is sharpened by the full `ampuUpdates` spec: the forward rookie-gen path
> (`phaseRunners.ts:177-209`, raw `Math.random` `:188-198`) lacks the **name-DB demographic tagging +
> 1/9/20/20 tiering + generate-on-vacancy→lowest-score backfill** → folds into the `scenarioBoot`/retro-gen
> cluster (K4, §9.1.9; overlaps #74's player-facing generate). S-M. debt #90.
> **(7) ★★ GM-REPLACEMENT LENS — the PV-electability + implementation/governing additions (a VIEW, no
> re-sequence).** New ① referee/calculator pointers: the **PV-electability** row (#214/#215/#216/DH-77 — the
> "who's electable" math the CPU's draft/leadership heuristic runs on, which also feeds the election scorer via
> `pv*0.1`), the **implementation/governing engine** (#217), the **cloture/legislative** annotation (#221
> era-content + DH-76 already there), and **#115** (generate-a-candidate, the candidate-pool generator). The
> lens stays a VIEW — adding pointers re-sequenced nothing.
> **(8) ★ HYGIENE — do NOT schedule (logged so a roadmap pass doesn't re-add):** the `summer2021`
> **winning-party lowest-faction score penalty** (ADOPTED-then-REVERSED, Ted's "nosedive"; do NOT reintroduce
> — #68/#102), the **randomized/Legis-weighted proposer** (REJECTED, committee system kept), and the
> `revampPV` per-trait **"absence bonus"** idea (points for LACKING a trait — the additive model can't express
> it; P37-39). **★ CORPUS-COVERAGE:** ≥7 forum playtests named in `presidents` are NOT ingested — highest-value
> is the **1840-start** persistent-Whig ~100-yr run (no 1840 scenario analog ships); the **"Groupthinking the
> Political Value"** trait-EFFECTS thread is also un-ingested (it gates #214/#215). Both recorded in the
> Author-before-build / corpus-coverage area; ask the human for exports before any 1840/Whig-realignment or
> trait-EFFECTS work. **★ NO gap closed, NO new keystone, NO re-sequence; top of queue UNCHANGED (QW0 → K0/K2
> → K3/K4 + scenarioBoot → E1) — the PV overhaul is a TUNING/DATA change, not a keystone: ship #216 + DH-77 as
> quick-wins now, treat #214/#215 as a balance epic gated on the un-ingested trait-EFFECTS thread + a same-PR
> `calcStateVote` re-tune.** debt #85-#90; technical-guide §9 batch-30 lead + §9.6 + §8 debt #85-#90;
> game-mechanics §3.4.1, §20.10.1, §22.7.z, §27.1.1, §30.20.
>
> **★★★★ Batch-29 version — TWO TIMELINE-EDGE PLAYTESTS THAT BRACKET THE BAND MODEL END-TO-END:
> `wilsons1916` (`a0b7ef49`, "Wilson's Vision: 1916, Era of Hollywood" — the FIRST multiplayer 1916,
> a deliberate START-AT-ERA-OPENING experiment fixing the 1960 mid-cycle failure #186; ran 1916→1920
> then trailed off) + `welcome2future` (`c54b7a9d`, "Welcome to the Future: A Hands-Off, All-CPU
> Playthrough 2022→2072" — the DOWNSTREAM-MOST ingest in the corpus, 8-of-10 factions on CPU rules,
> the most complete modern CPU-turn sample; PLANNED to 2072 but never reached it, covering setup +
> exactly ONE turn before stalling at the legislative phase). **NO new keystone, NO re-sequence,
> top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** 8 NEW gap rows #206–#213 + 3 NEW
> design-hole bugs DH-74–DH-76 + reframes (#92 terminal edge, DH-14, #115, #186, #106, #114/#110).
> **The value:**
> **(1) ★★★ HEADLINE → #206 the `Era` enum is DOUBLY too coarse, confirmed from BOTH timeline edges
> (debt #78; ties debt #5 + #92/§9.1.5) — and it RESOLVES the long-open "grow the enum vs. adopt the
> #92 data-model" question IN FAVOR of the DATA-MODEL.** Re-verified: `Era = independence|federalism|
> nationalism|modern` (`types.ts:1337`) — NO `future`/`populism`/`progressive`/`gilded`; the forum's
> "Era of the Future" / "Era of Populism" / "Era of Hollywood" are content-band LABELS over this coarse
> enum (#92, now confirmed at the OPENING hinge [1916 "Golden Era of Hollywood" event `wilsons1916#P191`]
> AND the TERMINAL edge [Future `welcome2future#post 6`]). With Future/Populism/Hollywood/Gilded/
> Progressive ALL needed, a flat enum would balloon → **adopt the #92 two-level content-band model in
> K4's era-content registry; band labels become era-content DATA, not enum values; keep `Era` (if kept
> at all) as a COARSE rules-tuning key.** **★ This is NOT a new keystone — it is the most important
> sentence to add to K3/K4 + #92 this batch; annotate those rows, no re-sequence.** PLUS a separate
> **Era-of-the-Future proposal-library authoring epic** (events reportedly done — the missing piece is
> legislation, the same "events-before-legislation" shape as the Federalism gap). M for the enum/
> registry refactor (folds into K4) + a separate content epic. `GM⇒App`. debt #78; game-mechanics §22.11.
> **(2) ★★ #207 NO terminal game-over / completion state (debt #79; pairs debt #70) → a COMPLETION-vs-
> LOSS DECISION, distinct from the #88/#188 meter/scripted LOSS endings.** The ONLY terminal state is
> `game.gameEnded` (`types.ts:1635`), set at ONE event-driven site (`phaseRunners.ts:2871`, an era
> event's `triggersGameEnd`); `phases.ts` predicates are pure `year % N` with NO `endYear`/`maxYear` —
> so the build has **no year-cap, no completion, no victory, no sandbox terminus.** `welcome2future`'s
> 2072 was an arbitrary author cutoff never reached; across the WHOLE corpus the Future band is defined-
> but-never-played-through and NO thread ever hits an end-of-timeline terminus. **A timeline-completion
> DECISION is owed (year-cap / open sandbox / score-out), modeled as a DISTINCT end-state from LOSS.**
> Small but architecturally load-bearing — it defines what "done" means for the whole campaign. S-M,
> decision-gated on which completion model. debt #79; game-mechanics §26.4.
> **(3) ★★ #208 + DH-76 the CPU LEGISLATIVE/CONFIRMATION engine + cloture (debt #80; `GM⇒App`, the
> LEGISLATIVE HALF of the GM referee job) → folds into E9 handlers 9b/9d, K5-DEPENDENT.** `grep
> filibuster|cloture|nuclear.?option|confirmThreshold src/` = ZERO; the legislative loop is committee
> (`phaseRunners.ts:3463`) → floor (`:3498`) with NO filibuster step between, and the CPU faction loop
> is absent. `welcome2future`'s hands-off 2022 turn forced the GM to INVENT: (a) a CPU maj-leader
> filibuster-override rule; (b) how maj/min leaders themselves vote (own-party + within-2-ideology-
> clicks, iron-fist within-1); (c) cross-party cabinet caps (≤1 in top-4, ≤3 total, ≤1 ideology step,
> integrity gate). **DH-76** adds the cloture gap from `wilsons1916#P349` (filibuster = automatic full-
> term delay, no cloture path). Build = the Filibuster action (forum #10) + an era-keyed Cloture counter
> tied to the Nuclear-Option state + CPU override + maj/min-leader vote rule + cabinet caps, all
> deterministic (NOT a roll). M; folds into E9 9b + 9d once K5 lands. debt #80; game-mechanics §28.10.
> **(4) ★ DH-74 validate the bill-proposal list BEFORE the vote (debt #81; `GM⇒App`, the Progressive
> face of DH-60 for LEGISLATION) → a `billProposable` predicate that SHARES the territory/era content-
> filter with #206/#92.** `runPhase_2_6_1_Proposals` (`phaseRunners.ts:3431`) picks via
> `pick(BILL_TEMPLATES)` (`:3444`); the templates carry NO precondition fields, so `wilsons1916` proposed/
> committee-passed/packaged/House-voted bills then found them INVALID mid-second-vote (Hawaii already
> legis-active; Teller Amendment blocks Cuba; war "not recent" blocks pensions, `P303`) → a 2.6 HALT +
> restart + 3 replaced bills. Build = a `billProposable(snap, tpl)` predicate + a filter at `:3444`
> (territory owned / not already legis-active / amendment not ratified-or-blocking / era prereq / recent-
> war). **Build the predicate library ONCE, use it for events AND bills.** S-M; pairs DH-60 + debt
> #5/#78. debt #81; game-mechanics §12.1.1.
> **(5) ★ #209 boot-time retro-generation of prior-cohort career-track bench (debt #83; `GM⇒App`) →
> folds into the existing `scenarioBoot`/`BootSheet` pipeline (K4, §9.1.9).** No boot abstraction exists;
> the only generator is the FORWARD draft-rookie fallback (`phaseRunners.ts:177-209`, raw `Math.random`
> `:188-198`), so a non-1772 boot has no synthetic bench — `welcome2future` Alabama had no eligible
> Republican for an open seat (CPU couldn't field a candidate, `post 137,144,148`); `wilsons1916` hand-
> generated "Joe Simpson (auto-generated)" (`P453`). Build = a boot-time retro-gen pass synthesizing
> SUB-FLOOR career-track cohorts stat-dated to the prior ~5 cycles (`post 364-369`), filling Ambassadors/
> Admirals/lower-Justices/bench-Reps, routed through `rng.ts` (NOT the `:188` raw `Math.random`). M;
> hooks the same `scenarioBoot` pipeline as #186's mid-cycle boot (debt #68). **The boot prerequisite for
> ANY deep-modern / mid-timeline start (the Future band can't be played without it once the real dataset
> thins).** debt #83; game-mechanics §9.2.1.
> **(6) ★ DH-75 military-appointment eligibility: citizenship + exp-type→branch (debt #82; `GM⇒App`).**
> The GeneralInChief appointment filters ONLY on `!p.currentOffice && p.skills.military >= 3`
> (`phaseRunners.ts:2256-2261`) — no citizenship gate, no Army↔Navy matching, so `wilsons1916#P162-169`
> made Pancho Villa + Aguinaldo appointable as US Army generals and auto-slotted Nimitz a General
> despite naval exp. Build = add both checks to the officer-appointment filter. XS-S, standalone; pairs
> #25/#31 + the 1916-bare-boot officer corps (debt #68). debt #82; game-mechanics §8.5.4.
> **(7) ★ SMALLER MECHANIC ASKS (debt #84):** **#210** Ex-President/Ex-Nominee super-Kingmaker career
> state (office-ineligible, proteges from ANY state; S, pairs #30); **#211** cross-party PV-ordered
> snake-draft MODE vs the within-party `runPhase_2_1_1_Draft` (`phaseRunners.ts:107`; S, LOW priority —
> MP setup flavor); **#212** the unbuilt 2.1.5 ideology-shift pass (`GM⇒App` — 40-60+ shifts/faction/term
> by hand; implement the deterministic per-pol shift roll + flip-flopper AND decide whether the #110 per-
> faction shift budget [max ~9] is enforced era-wide or shifts stay uncapped; S-M, the era's biggest by-
> hand load); **#213** make the assigned-faction-ideology draft restriction an era-keyed toggle fully
> DISABLE-able at a boundary (2026), consolidating with #171 (XS-S). debt #84; game-mechanics §4.4, §30.19.
> **(8) ★ REFRAMES (annotate, no re-sequence):** **★ DH-14 is a CPU-AI ARTIFACT, NOT a hard block** — the
> 19th Amendment ("Equal Voting Rights for Women") PASSES in the 10-human 1916 game (House 374-61, Senate
> 79-17, ratified), so the `drums` all-CPU "this amendment will never pass with CPUs" is a CPU-AI / era-
> ideology-weighting artifact → folds into the era-keyed bill-ideology table (debt #5-adjacent — move Mods
> off suffrage's negative side in 1916) + a CPU vote model (#208/E9 9b) that can reach 2/3 like a human
> field; NO standalone work. **#106/WWI optionality** corroborated (the US never entered WWI in
> `wilsons1916`; the war engine is dormant unless the war-entry event fires). **#114/#110** corroborated as
> the load-bearing CPU-AI requirement (`welcome2future` = the most complete modern CPU-turn sample) —
> reinforces E9/K5. **★ #173/#186 METHODOLOGY CONVERGENCE — era-band OPENINGS, not mid/tail:** both
> threads independently re-affirm starting at an era's OPENING (`wilsons1916` opened with the explicit
> *"starting at the beginning of an era, rather than the middle, was better"* and booted cleanly;
> `welcome2future` confirms the INVERSE — a 2022 TAIL-of-band start has thin scripted-event density,
> *"only one scripted event capable of occurring right now"*, `post 378`), so BOTH era edges are thin-
> content friction zones → the #173 14-band era-start presets should snap New-Game starts to band
> OPENINGS. **Engineering principle for any future scenario boot: author/test at era-band openings; treat
> mid/tail starts as a separate, higher-risk class.** **(Even a clean OPENING start needs a fully-populated
> per-year BootSheet** — the 1916 BootSheet is "bare" [NO starting generals/admirals, "filler" credit/debt
> numbers, `wilsons1916#P149-157,340-345`] → DH-75 + #209.)
> **★ This is the FIRST batch read through the GM-replacement lens to add LEGISLATIVE-REFEREE items:** the
> new ① pointers are the #208/DH-76 cloture/filibuster + CPU vote/cabinet-cap engine and the DH-74 bill-
> validator, plus DH-75 (officer-eligibility); DH-14 is logged as a ② opponent-half CPU-AI artifact. **NO
> gap closed, NO new keystone, NO re-sequence; top of queue UNCHANGED — but #206 is the strongest single
> argument yet that the K3/K4 era keystone must adopt the #92 two-level content-band model (not a growing
> enum), and #208/DH-76/DH-74 sharpen the legislative half of the GM referee into concrete, K5-dependent
> engine work.** debt #78-#84; technical-guide §9 batch-29 lead + §9.6 + §8 debt #78-#84; game-mechanics
> §22.11, §26.4, §28.10, §12.1.1, §9.2.1, §8.5.4, §4.4, §30.19.
>
> **★★★★ Batch-28 version — THE PIVOTAL RECONCILE BATCH: FOUR designer META-DOCS, NO era
> playtest (`to-do` [the authoritative 2021-22 pre-build dev backlog], `fixes` [vcczar's 2022
> designer-authoritative ACCEPT/REJECT/DEFER fix-queue], `completions` [★ the *done-half* of the
> 2022 spreadsheet/reference game's backlog], `vic3` [aspirational Victoria-3 borrows, mostly
> "AMPU 2"]). **This is a DISCUSSION/CATALOG + RECONCILE batch — designer specs verified shipped-vs-
> designed, NO gap closed, NO new keystone, NO re-sequence, top-of-queue UNCHANGED.** 17 NEW gap rows
> #189–#205; the `completions` list converted 2022 "done" claims into VERIFIED truth about our `src/`.
> **★ This is the FIRST batch read through the GM-replacement lens** — its `GM⇒App` items are slotted
> into the lens (below the keystone overview). **The value:**
> **(1) ★★★ RECONCILIATION HEADLINE → debt #71 = the election-scorer determinism+tuning QUICK-WIN,
> the single highest-leverage build move in the batch — it FUSES batch-27's #64/DH-72 sub-fixes + the
> flagship raw-`Math.random` leak (debt #1/#3) + RESOLVES the D6/D3 fork in ONE patch, and FORMALIZES
> the existing QW19–QW21 (reconcile, do NOT duplicate).** Of the 2 flagged "CONFIRMED-SHIPPED" claims,
> exactly ONE holds: **① election die D6 → REFUTED** (the cited `phaseRunners.ts:727` is
> `factionExpertiseBias`'s unrelated 0–6 clamp; the REAL election randomizer is `(Math.random()-0.5)*8`
> at `:3711` — raw `Math.random`, NEITHER d6 nor d3, NOT seeded — our build ships NO election die at
> all, the batch-27 finding stands); **② trait-conflict d6 → CONFIRMED-BUILT and via the RNG seam**
> (`tryGrantTrait` `traits.ts:53`, `d(6)>=conflictD6Threshold`, `d` from `rng.ts`; threshold is `4` →
> 1-3 cancel / 4-6 keep, a tuning delta vs the sheet's 1-2/3-6 — mark this item BUILT). The D6/D3 fork
> is therefore TIED OFF: since the build ships NEITHER die, the fork is the SAME tuning+seeding QW the
> batch-27 #184/DH-72 finding already framed — narrow the `:3711` jitter to the d3-equivalent band +
> route through `rng.ts`, then re-check the `baseLean*5` bias term (`:3697`). **QW19–QW21 are the
> roadmap's name for this; debt #71 is its technical definition — REINFORCE, do NOT add a 4th row.**
> debt #71; game-mechanics §15.5(a).
> **(2) ★★ #179 CABINET-METER ENGINE NOW HAS NUMBERS (debt #72; S–M, standalone, ready) → a flagship
> `GM⇒App` item.** The batch-26 redesign now has the spec: an `Admin→{upOdds,downOdds}` table (Admin5
> 75%/0% … Admin0 0%/100%) rolled per portfolio-officer + Efficient ±2 + a 25% lobby-dissat hook + a
> hard JCoS/Senior-General/Admiral exclusion (the #49 fix) → replaces the placeholder `drift()` in
> `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260`). Confirmed DESIGNED-not-built (the shipped
> `drift()` table `:3266-3273` is flat deterministic). Roadmap-ready; folds into E6/E16 (where #179
> already lives). debt #72; game-mechanics §20.10(g)-(j).
> **(3) ★★ DOWN-BALLOT MODEL #189–#192 (debt #73; M; builds ON the existing routing — partly-built) →
> a `GM⇒App` referee item.** `calcStateVote`+`applyTraitElectionBonus` ALREADY route gov/sen/house +
> apply *some* traits/meters (`phaseRunners.ts:3685,3707-3708`) but only the ~5 presidential traits.
> The full model: a separate-from-presidential down-ballot trait table (#189) + the expertise/lobby↔
> leading-industry "Manchin" +2/+1 (#190) + a static per-seat `deviantPartyBias` SET-BY the gerrymander
> action (#191) + a per-state max-margin → popular-vote-% derivation + PV caps (#192, the design intent
> behind the §29 landslide misfire). Builds INTO E20b/`calcStateVote`; pairs with #103. debt #73;
> game-mechanics §15.4.
> **(4) ★ NINE NOT-IN-OUR-BUILD SUBSYSTEMS — ALL re-confirmed ABSENT (`grep src/` = ZERO each), now
> spec'd from the 2022 docs → roadmap-ready, ALL `GM⇒App`; LOWER priority.** debt #74: US-Rep
> Voting-Power #34/#62 (S) / player Generate-a-candidate 3.0.25 (S) / gerrymander gov-action #20 (S —
> the SETTER for #191's `deviantPartyBias`); debt #75: Acting-Presidency 3.0.33 (S) / Do-Not-Enforce
> Pres-Actions #23 (S) / Master-Kingmaker promotion #128 (XS-S); debt #76: Secessionist/pardons 3.0.35
> #121/#122 (M — a `secession-winter` event exists `:2834-3018` but the per-pol ruleset is event-only;
> pardons ZERO) / rising-sea-level EV #41 (S) / trait-renames #168 (XS). Each binds where its gap row
> notes; each retires GM hand-adjudication. debt #74-#76; game-mechanics §14.1.2, §24.1, §23.1, §30.18.
> **(5) ★ NEAR-TERM `GM⇒App` CLUSTER (debt #77): confirmation-rejection trait cascade #199** (rejected
> nominee → Controversial→Incompetent + re-nomination block, Bookkeeper carve-out; designer-ACCEPTED,
> S, folds into E16/E9-handler-9d) **+ personnel-effect bills #200** (a `bill.personnelEffect` that
> EJECTS/disqualifies sitting officeholders, optionally via SCOTUS, with a sunset; S-M, folds into E2/
> E25) **+ interest-acquisition #193** (interests are born-only today, `types.ts:1282`; +1 ideology-
> appropriate interest at the 20-yr career-track mark; RESOLVED, S, folds into E13/#163). debt #77.
> **(6) ★ PARKING-LOT / DECISION-RECORDS (do NOT schedule):** **#205** = Victoria-3 borrows
> (dynamic IG→party realignment / per-state meters / per-lobby era agendas), designer-tagged "AMPU 2"
> → parked, NO near-term row; **B2/B3** Vic3 gov-actions (meter-boosting + migration/immigration) are
> Ted-endorsed for v1 → FOLDED INTO #20, NOT a new row. **#204** (skills stay 0-5; 0-10 → "AMPU 2") is
> a DECISION RECORD pinning CLAUDE.md's 0-5 as deliberate — no code change. **#203** (wealth) DEFERRED
> ("post-Early-Release"). **#194/#196/#197/#198/#201** ride their existing epics (mostly Tier-4 OPEN).
> **#195 records-archive + #202 Campaign-Advisor** are `GM⇒App` onboarding (pair DH-69 + #114).
> **(7) ★ #183 endorsement-momentum CONFLICT surfaced (still OPEN, NOT closed):** the 2022 sheet says
> endorsements give 25%/10% momentum (`completions#POST 46`) but `redbutton` found NONE — a frozen-spec
> reconciliation that rides #185/#66/#67 (batch-27 debt #67), not resolved here.
> **★ NO gap was closed; NO new keystone, NO re-sequence; top of queue UNCHANGED (QW0 → K0/K2 → K3/K4 +
> scenarioBoot → E1) — but the election-scorer determinism+tuning QW (debt #71, fusing #64/DH-72 + debt
> #1) is reinforced as the cheapest high-leverage win, and the down-ballot model (#189-#192) + #179
> meter engine are now numeric, standalone-buildable specs.** debt #71-#77; technical-guide §9 batch-28
> lead + §9.6 + §8 debt #71-#77; game-mechanics §15.4, §15.5, §20.10(g)-(j), §14.1.2, §24.1, §23.1, §30.18.
>
> **★★★★ Batch-27 version — THE CORPUS'S FIRST COLD-WAR / CIVIL-RIGHTS SOURCE +
> the FIRST MODERN-ERA scenario boot stress-tested AT SCALE (`8bc0231c` "The Big Red
> Button: 1960 Playtest"): a ~10-human MP run that **started MID-CYCLE in the 1960
> Elections Phase** (a turn before its authored 1960-62 governance boot), ran
> 1960→1962-64, then **"Temporarily Paused" and never resumed solo** [the modern-angle
> GM-workload death]. Alt-timeline: GOP nominated **John W. Bricker** [MacArthur
> convention WALKOUT] who **WON 492-40 over JFK** off a platform/election BUG. ONE
> designer-confirmed election NERF [#184] + its driving BUG [DH-72] + FOUR designed-not-
> built modern gaps [#185/#183/#186/#187] + ONE premise-only loss [#188→#88]; NO new
> keystone, NO re-sequence, top-of-queue UNCHANGED — but the #184/DH-72 fix yields a
> genuine QUICK-WIN and the modern primary→convention cluster is now the KB's richest
> forward-played election spec. `redbutton` (`8bc0231c`; the whole platform→meter→
> election chain was driven BY HAND — it does not exist in code — and ran away to a
> 492-40 landslide; both designers [@vcczar/@MrPotatoTed] played and blessed the nerf
> in-thread). **The value:**
> **(1) ★★ DH-72 ELECTION-TUNING SUB-FIXES → SPLIT into a SHIPPABLE QUICK-WIN; the
> highest-leverage work in the batch. Bind at `calcStateVote` (`phaseRunners.ts:3709-
> 3711`); XS–S.** The 492-40 came from a `+1`-rule read as `+3` board-wide (DH-72) on
> top of a bogus `+3` platform bonus; recompute → 284-251 → ~281-129 near-tie (`#POST
> 532, 587, 603-607`). Re-verified shipped-state UNCHANGED: `calcStateVote` (`:3709-
> 3711`) = `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias +
> traitBonus + (Math.random()-0.5)*8` — NO ±3 cap, NO per-state ideology gate, **raw
> `Math.random` (a continuous ±4 jitter, NOT a die)**, and **no "+1 most-enthusiastic-
> base" term exists in code at all** (it is GM-hand-applied). The designer-blessed
> sub-fixes bind HERE with no new system: **(a) narrow + SEED the jitter** (the d6→d3
> intent — compress the luck band — routed through `src/rng.ts`, ALSO closing a
> determinism leak vs. the rng rule + debt #1/#3); **(b) re-weight `baseLean*5` into the
> +3/+5 historical-bias band behind a `game.biasMode?` toggle** (historical-plausible
> vs "go-crazy"); **(c) HIDE the raw formulas in the UI** (anti-collusion — show only
> which ideologies like a position + polls/maps). **★ JOIN these to the QUICK-WIN bucket
> alongside the queued QW3 ±3 cap [debt #1] + the #18 2-layer scorer** — the cheapest
> high-value election work in the corpus. debt #64 (DH-72); technical-guide §9 batch-27
> lead (a) + §9.6; game-mechanics §15.3.5, §28.6.
> **(2) ★★ #184 PLATFORM METER-CAP (+2/+1/−1) → a BUILD-INTO CONSTRAINT on the
> convention/platform epic (Phase-1 #10 / #181), NOT a quick-win, NOT a standalone
> patch.** Both designers agreed *"platform is way too powerful"* (`redbutton#POST 538-
> 540`). But the cap clamps a term that DOESN'T EXIST yet — `grep platform|plank in
> src/engine` = ZERO; the platform engine (5 planks × per-card faction scoring × 4-step
> comparison) is the SAME unbuilt object as #181 (`summer2021`). So the cap is a
> day-one constraint on the platform scorer: build the scorer with the +2/+1/−1 cap +
> hide-the-math; never ship the uncapped forum scorer. debt #65; game-mechanics
> §15.3.5, §28.6.
> **(3) ★★ #185 MODERN PRIMARY→BROKERED-CONVENTION MACHINE → FOLDS INTO Phase-1 #10
> convention machinery; L; the single biggest election subsystem.** The fullest
> convention CAPTURE in the KB: 12 primary states (rest = convention delegates),
> primaries-in-GROUPS (debate ±1 carry, Orator +2/group), the 5-tier Cat-1–5
> delegate-weight HOST-RIGGING lever (Ted holds rigging is INTENDED), kingmakers-affect-
> conventions-not-primaries (+1), 67%-first-ballot (mutable), two-leaders-force-a-
> KINGMAKER-WEIGHTED-rule-change-vote, least-delegates-first interballot order, the
> 100%-delegate rule + WALKOUT (persisted into 1964), the KINGMAKER-WEIGHTED VP VOTE.
> CONFIRMED unbuilt (`runPhase_2_9_1_Primaries` `:3725-3750` = flat PV+command*5 SORT).
> debt #66; game-mechanics §28.6.
> **(4) ★ #183 ENDORSEMENT-MOMENTUM HOLE → FOLDS INTO #185/Phase-1 #10; S; DO NOT build
> standalone.** Withdrawal/endorsement is inert unless the dropper holds delegates; add
> a momentum value (+2 Minor/+3 Major OR a home-state/region transfer OR an
> ideology-penalty waiver) INDEPENDENT of delegate count — but the d6 base leaves little
> headroom (couples to the DH-72 d6→d3 squeeze) + pairs with the ballot-2 80/20
> delegate-release hole (DH-57). CONFIRMED unbuilt (`grep withdraw|endorse|momentum in
> src/engine` = ZERO). debt #67; game-mechanics §28.6.
> **(5) ★★ #186 DETERMINISTIC LATE/MID-CYCLE BOOT → a FIFTH `BootSheet` shape; RIDES
> K4's `BootSheet` + `scenarioBoot` (#115); no new keystone. M-L.** The FIRST modern-era
> boot in the corpus + the cleanest late-start failure: a 1960 scenario authored for the
> 1960-62 GOVERNANCE turn forced into an Elections-Phase start a turn early → cascading
> manual patches (Senate 50-50 vs real 66-D, no Leadership-gated Party Leader, on-
> election rolls skipped, party-fatigue dropped, gov terms-served unknowable, delegate
> weights hand-assigned, DC EVs invalid pre-1961, NO Command runway → roster frozen).
> Needs a `startMode: 'electionPhase'|'governance'` discriminant + an `asOfYear`
> incumbent table + `seededLeaderTenure` (#187) + `delegateWeights`/`primaryCalendar`
> (#185) + `careerTrackBackfill` (DH-25). CONFIRMED unbuilt (`grep scenarioBoot|BootSheet
> in src/` = ZERO). debt #68; game-mechanics §28.1, §28.6.
> **(6) ★ #187 PARTY-LEADER FATIGUE (6-yr decay → ~8-yr presidential rotation) → S;
> pairs with #15; do the boot retro-apply WITH #186.** A `party preference −1` after 6yr
> of one party leader, ENGINEERED to force a ~8-yr presidential rotation (Ted, `#POST
> 645`); dropped here because the mid-cycle start skipped 1958 → its absence COMPOUNDED
> the #184 landslide (let the House flip 58R-42D unchecked). CONFIRMED unbuilt (`Party`
> `types.ts:1306-1311` has NO tenure field; the faction `leadershipStartYear` `:1302` is
> written but NEVER read for a penalty). debt #69; game-mechanics §8.5.3, §28.1.
> **(7) ★ #188 "BIG RED BUTTON" NUCLEAR LOSS → FOLDS INTO #88 (meter-floor game-end +
> APOCALYPSE clock, Phase-1 #6); XS-S; NO new subsystem.** The campaign's whole PREMISE
> was a nuclear game-over but it NEVER fired; Cold-War content that DID fire is event/
> legislation FLAVOR on the generic engine. A nuclear loss is a configured end-condition
> ROW on the #88 model, NOT a MAD/arms-race engine (corroborates the §28.2 negative-scope
> directive #106). CONFIRMED unbuilt (`triggersGameEnd` consumed in EXACTLY ONE place,
> `:2871`, event-only; `grep nuclear|MAD|bigRedButton in src/` = ZERO). debt #70;
> game-mechanics §28.2, §30.17.
> **(8) ★★ ESCALATIONS IN PLACE (confidence ↑, no new items, NO re-sequence):** **#88**
> gains its first MODERN datum (corpus still shows exactly ONE proven game-over,
> `terror2000`'s coup → confidence ↑ on the meter-floor model); **#86/#115/#173/E1** boot
> cluster — the mid-cycle modern boot is now CONCRETE (the 5th `BootSheet` shape with
> explicit holes), the strongest case yet for the `scenarioBoot` pipeline; **#14**
> platform/election rules now have the designer's nerf DIRECTION set; **#114/DH-36**
> re-confirmed as the GM-WORKLOAD DEATH from the MODERN angle (the 10-human run paused
> and never resumed solo — the CPU-AI cluster E9/K5 carries this too). **Decision-gated /
> parking-lot RECOUNT: 0** (the #184 platform-vs-meter open Q, the #183 momentum value,
> the #185 delegate-floor, the #186 per-year incumbent tables, the #187 penalty-curve are
> all designer/content-gated WITHIN their existing epics). **NO new keystone, NO
> re-sequence; top of queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the
> DH-72 tuning sub-fixes JOIN the quick-win bucket and the modern primary→convention
> cluster (#185/#183 + the #184 platform cap) is now the KB's richest forward-played
> election spec inside Phase-1 #10.**
>
> **★★★★★ Batch-26 version — THE CORPUS'S LARGEST SOURCE (`fe15db25` "Summer 2021 AMPU
> Playtest") + the FIRST run to PLAY FEDERALISM FORWARD (1789→~1810, the whole president/cabinet/
> diplomacy TURN LOOP run end-to-end, NOT just designed-and-walled); a 3-GM relay over ~14 months;
> FOUR net-new ENGINE gaps [#179, #182, #181, #180] + ONE net-new data-integrity bug [DH-71]; NO new
> keystone, NO re-sequence, NO keystone moves, top-of-queue UNCHANGED. ★ The marquee is the
> HIGHEST-CONFIDENCE federalism-is-the-next-era signal in the corpus: everything in the federalism
> spine had to be HAND-ROLLED because the build deliberately refuses to run it — so #177/#178 escalate
> to the KB's richest, most-forward-played next-era target, and the four new gaps are all federalism
> turn-loop subsystems.** `summer2021` (`fe15db25`, "Summer 2021 AMPU Playtest"; GA-run [3-GM relay
> over ~14 months — trails off, NOT a clean burnout quit] but the marquee rulings are designer-blessed
> in-thread [@vcczar/@MrPotatoTed adjudicate]; 1772→~1810, the first source to run the federalism turn
> loop forward). **The value:**
> **(1) ★ #179 CABINET LINGERING-ROLL METER ENGINE → A REDESIGN of the shipped deterministic drift +
> ≥5 sub-systems. FOLDS INTO E6 (Lingering) + E16 (cabinet) + the §10.4.1 blunder layer. Size L; ★
> SPLIT IT.** The federalism counterpart to the shipped §11.1 lingering: each lingering phase EVERY
> cabinet member ROLLS to move their portfolio meter ±1, and it can BACKFIRE (Treasury rolled badly →
> EconStab → Great Recession; War+Navy both succeeded → MilPrep maxed). **★ Shipped-state CONFIRMED
> unbuilt-as-designed:** `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260`) is a DETERMINISTIC
> skill-keyed DRIFT (`drift(skill)` `:3266-3273`, fixed ±delta, NO roll/backfire/trait hook); the
> cabinet pick `runPhase_2_3_1_Cabinet` (`:2158-2224`) is a flat score-sort with NO ideology gate, NO
> Speaker/PPT/advisor decider override, NO bill-coupling. So #179 is a REDESIGN of the deterministic
> drift into a roll engine PLUS ≥6 sub-rules spanning ≥2 systems: (a) per-portfolio ±roll w/ backfire +
> Efficient=auto-+2-if-it-moves; (b) Pliable-Pres → Speaker/PPT/Key-Advisor decider override incl.
> SCOTUS nom; (c) cabinet-bill double-points coupling; (d) ideology-gated confirmation by office; (e)
> regional-representation meter penalty; (f) executive-actions-implemented-by-cabinet-with-BLUNDER
> rolls. **★ SPLIT (tech-lead): (i)+(f) meter/blunder engine · (b)+(d) appointment/confirmation · (c)
> bill-coupling · (e) election-feedback** — different dependencies. **Gated on #177 (federalism era
> existing) + the diplomacy/EconStab meters it moves; couples to #67 meter ladders + #116/#160 EconStab
> cascade.** debt #59; game-mechanics §20.10; technical-guide §9 batch-26 lead (b) + §9.6.
> **(2) ★ #182 command = the President's PER-TURN EXECUTIVE-ACTION BUDGET → FOLDS INTO the §14
> executive-action build (K2 ActionRegistry) + #179. Size S once the exec system is real.** Verbatim:
> "Osgood can do up to 4 actions each turn because he has 4 command" — a President's `command` = his
> executive-action count/turn (0 = inert, N = N actions), each implemented by the relevant cabinet
> member with a blunder roll (#179(f)). **★ Shipped-state CONFIRMED unbuilt:** `command` today is ONLY
> a PV input (`pv.ts:74`), kingmaker reward, grant, decay stat, and candidacy gate — NEVER an
> action-count budget; `runPhase_2_8_1_Executive` (`:3632`) takes EXACTLY ONE flat `chance(0.5)`
> action, command-independent. The fix is small in shape (loop the exec phase `command`-many times) but
> **GATED on the §14 executive-action system becoming a real K2 ActionRegistry chooser** (today a
> placeholder). **Open Q (designer): does the same budget apply to governors/other offices?** debt #62;
> game-mechanics §20.11(2).
> **(3) ★ #181 PRESIDENTIAL PLATFORM-PROMISE CONVENTION SYSTEM → PART OF the #19/#20 convention cluster;
> DO NOT build standalone. Size M.** On winning the nomination, the nominee builds a BINDING PLATFORM (1
> econ + 1 domestic + 1 judicial + 1 foreign/military bill promise + 1 presidential-action promise + a
> promise to resolve any ongoing CRISIS) PLUS deal-making office-promises (cabinet/VP posts to allies
> for endorsements), wired kept/broken → §22.2 enthusiasm/points. **★ Shipped-state CONFIRMED unbuilt:**
> no platform object exists (`grep platform|promiseBill|conventionPlatform in src/` = ZERO; convention
> machinery itself is designed-not-built, §15.3 / #19/#20). **Rides the #19/#20 convention epic; gated
> on conventions existing.** debt #61; game-mechanics §20.14(1).
> **(4) ★ #180 MONUMENT / LEGACY-TRAIT ACHIEVEMENT LAYER → RIDES the federalism/founding era-content
> build. Size S–M, LOWER PRIORITY than #177-#179.** The founding era awards named historical-legacy
> traits to whoever performs each in-game FIRST ("Atlas of the Revolution" = 1st Senior General;
> "Author of the Declaration" + Celebrity; "Father of the Country" = final RevWar victory; etc.). **★
> Shipped-state CONFIRMED unbuilt:** `traits[]` is freeform, granted only by `addTrait`/era-event/draft;
> NO first-achievement-detection / award-once-on-event layer (`grep firstAchievement|legacyTrait|
> monument in src/` = ZERO). The Fed-Papers authoring rule was a DOCUMENTED HOLE (no rule to identify
> the authors) — needs authoring first. **Rides the era-content build; gated on #177.** debt #60;
> game-mechanics §20.14(2).
> **(5) ★ DH-71 FACTION-HANDOVER DUPLICATE-POLITICIAN → a SINGLE-OWNERSHIP CONSTRAINT on the (unbuilt)
> #1 faction-handover, NOT a shipped regression. Size XS.** A mid-thread faction "steal" moved David
> Brearley to a new faction WITHOUT deleting the original → two identical records → a later
> governor-nomination pulled the WRONG one. A transfer must MOVE, not COPY. **★ Shipped-state CONFIRMED
> — the faction-handover feature is itself UNBUILT:** `grep handover|transfer|steal|reassign in src/` =
> ZERO transfer code path; `partyId`/`factionId` are read-only filters, never re-assigned. So DH-71 is a
> FORWARD-LOOKING CONSTRAINT: the transfer function (#1) must mutate the SINGLE politician's `factionId`
> (a MOVE), never clone — and the owned-state model removes the manual-ledger drift this run exposed.
> **Folds into #1 faction-handover.** debt #63; game-mechanics §20.15.1.
> **(6) ★★ #177/#178/#114 ESCALATED IN PLACE (justification, NOT new scope, NOT a re-sequence):** **#177
> is now DESIGNED-AND-PLAYED-FORWARD, not just designed-and-walled** — `summer2021` is the FIRST source
> to run the whole federalism turn loop forward (cabinet appointment → era/decision events →
> cabinet-driven lingering → diplomacy → legislation+veto+override → presidential action, §20.9),
> proving the walled content is the *actual gameplay* of the next era; the TWO `eraGraph.ts` walls
> (`:153-155` chartIndex≥49 + `:150-152` pre-1789 president/cabinet decider ban → gate on `year >= 1789`)
> + per-power diplomacy-relation meters are CONFIRMED unchanged; **the highest-confidence "federalism is
> the next-era build" signal in the corpus.** **#178** now has LIVE FORWARD-PLAY evidence — the Treaty
> of Paris is AUTO-PROPOSED once the RevWar ends and passing it organizes Mississippi + NW(Ohio)
> Territory (territory by TREATY); the NW Indian War = win 5 land battles in 5 attempts OR permanently
> CEDE OHIO (the same bounded-retry budget as #178/DH-61, §20.13(5)). **#114/E9/K5/DH-36 re-confirmed
> from the MULTIPLAYER end:** the CPU is mechanically WEAK at moving meters (Ted's meta-math, POST 2671:
> ~50 all-CPU governors × ~3 actions × ~20% only move a crisis meter ~1-2 spaces), so a crisis the CPU
> can't dent must be soluble by a single engaged human → the quantitative root of "solo human is the
> design target"; the 3-GM relay over 14 months re-confirms DH-36 (GM-workload is the constraint)
> WITHOUT a clean burnout quit (it trails off). Raise confidence; do NOT move them.
> **Decision-gated / parking-lot RECOUNT: 0** (the #179-split, #181-rides-convention, #178 ≤3-fires
> canonicity, #182-applies-to-governors are gated WITHIN their own work, not new top-level decisions).
> **NO new keystone, NO re-sequence; top of queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) —
> but the federalism era-content cluster (#177/#178 + the four new #179/#180/#181/#182) is now the KB's
> richest, most-forward-played next-era build target.**
>
> **★★★★★ Batch-25 version — ONE DESIGNER-GMed SINGLE-PLAYER FOUNDING→FEDERALISM RUN
> (`principle1772`, the 7th captured 1772 thread + the cleanest, most designer-authoritative
> 1-human-vs-9-CPU run in the KB), CORROBORATION-HEAVY, TWO net-new FEDERALISM-ERA gaps [#177,
> #178] in the least-covered founding→federalism endpoint; NO new keystone, NO re-sequence, NO
> keystone moves, top-of-queue UNCHANGED. ★ The marquee is the STRONGEST #114/E9/K5 ESCALATION
> in the corpus: the run is the FIRST 1772-cluster run to reach a natural endpoint, and it did
> so ONLY because the designer hand-simulated all 9 CPU factions → the CPU-AI cluster now carries
> BOTH 4 GM-burnout deaths AND a designer-paid completion.** `principle1772` (`049ce855`, "Always
> stand on principle… even if you stand alone. A Single-Player 1772 Adventure"; **DESIGNER-GMed —
> @MrPotatoTed [game CO-AUTHOR] IS the GM and hand-ran all NINE CPU teams himself while @vcczar
> live-ruled**, one human [@10centjimmy] on a Washington-led Red team; ~1772→~1800 natural endpoint,
> slowed by the GM's health/grad-school load, NOT a loss/win/burnout) is **literally the shipped
> game's intended 1-human-vs-9-CPU mode (#114) demonstrated end-to-end by the designer.** **The value:**
> **(1) ★ #177 FEDERALISM FOREIGN-AFFAIRS DECISION-EVENT SPINE → FOLDS INTO E1/scenario1788 +
> era-event/eraGraph (#92); couples to E12 diplomacy (#107/#162). Size M.** The late-1790s endpoint
> surfaced the most-detailed Federalist-era foreign-affairs content in the KB — a spine of **8
> president/cabinet decision-events** (French-Rev neutrality/alliance-betrayal, Citizen Genêt,
> Pinckney's/Spanish Treaty, Jay Treaty, Haitian Revolution, alt-history "Bourbons Restored"
> `realEvent:false` branch, NW Indian War, Bank-recharter), each with per-power diplomacy-relation +
> DomStab/EconStab + enthusiasm consequences + implementation-blunder rolls + counterfactual branches,
> plus the late-1790s cabinet + Key Advisor Hamilton. **★ Shipped-state CONFIRMED hard-walled:** the
> era graph THROWS on this content via TWO authoring guards in `eraGraph.ts::validate()` — `:153-155`
> rejects any node `chartIndex >= 49` ("Federalism out of scope") + `:150-152` rejects any
> `president`/`cabinet` decider ("no President/Cabinet pre-1789"); every event in the spine is a
> post-1788 president/cabinet decision-event, so authoring it requires **LIFTING BOTH walls** (gate
> president/cabinet deciders on `year >= 1789` instead of forbidding them) + adding **per-power
> diplomacy-relation meters** to the snapshot (none exist today — `grep relation|diplomacyMeter|
> foreignRelations in src/` = ZERO). The federalism-side companion to §20.3's `fed` spine, from a 7th
> 1772 angle — DESIGNED content the era graph deliberately omits, the clear intended next-era fill.
> **Open Q (designer): confirm this is the intended next-era build, not a permanent scope wall;** V
> deferred the EV/territory-event %-chances (POST 1801). debt #57; game-mechanics §20.3.1; technical-
> guide §9 batch-25 lead + §9.6.
> **(2) ★ #178 TREATY-GRANTS-TERRITORY + BOUNDED "3-STRIKES" RETRY → FOLDS INTO statehood/territory +
> DH-61; GENERALIZES DH-61. Size S; PAIRS WITH #177** (Jay Treaty is the #177 carrier event). A NEW
> territory-acquisition class the build has no path for: the **Jay Treaty** (a president decision-event)
> grants WI/IN/IL/MI on signing ("Marshall refused it twice, signed Attempt Two → gained WI/IN/IL/MI"),
> under a GM-ruled **per-event retry budget** — a territory-gating event may fire **up to 3 times**
> before the land is **permanently lost** (origin: the NW Indian War "3 chances," POST 207). **★
> Shipped-state CONFIRMED unbuilt:** `admitState` (`territories.ts:8-23`) admits ONLY from the static
> `EXPANSION_STATES_BY_ID` registry, driven by 1772 era-event `postEffects` — no treaty path, no retry
> budget (`grep treaty|retriesRemaining|retryBudget in src/territories.ts` = ZERO). The fix = a
> **treaty→`admitState` post-effect path** (the Oregon-Treaty §10.4.2 pattern) **+ a `retriesRemaining`
> (default 3) per-event budget** on the `EraEvent` type — one reusable per-event retry primitive
> spanning treaty, war, AND event gates. **Open Q (designer): is ≤3-fires canonical for ALL
> territory-gating events, or a GM house rule?** debt #58; game-mechanics §17.6.1/§21.5.
> **(3) ★★ #114/E9/K5 ESCALATED (JUSTIFICATION, NOT new scope, NOT a re-sequence) — the LOAD-BEARING
> PREREQUISITE for the shipped solo mode to be COMPLETABLE.** Every prior 1772 solo/2-player run
> (`new1772`/`grass1772`/`rookie1772`) DIED to manual-upkeep/CPU-bookkeeping burnout before an
> endpoint; `principle1772` is the FIRST 1772-cluster run to reach a natural endpoint — and ONLY
> because the designer himself hand-simulated all 9 CPU factions (cabinets/draft lists/leadership votes/
> event responses; he REWROTE the CPU career-track heuristic mid-run, POST 323). It simultaneously
> proves the shipped 1-human-vs-9-CPU shape (#114) IS completable AND quantifies what the app must own
> to make it so WITHOUT a designer-in-the-loop: the entire per-faction CPU sim (the **E9 handler suite
> + K5 CpuController**). The cluster now carries BOTH ends — 4 GM-burnout deaths (cost of NOT having it)
> + a designer-paid success (proof of the ceiling). CONFIRMED unbuilt (`grep cpuHandler|handlerSuite|
> runCpuFaction|perFactionSim in src/` = ZERO). **★ Raise priority/confidence on E9/K5 (reflects on
> #114/DH-36); do NOT re-sequence, do NOT add scope.** game-mechanics §25/§29.1/§30.15.
> **(4) ★ CORROBORATIONS (confidence ↑, no rows):** **#176 founding MilPrep ordering bug = NOW
> DESIGNER-FLAGGED + 3rd-source** — Ted himself flagged LIVE that the auto-forced war bills can't raise
> MilPrep (Militia Act is federalism-only) and that the Army/Navy bills fire AFTER the Military phase
> that needs them ("Seems… dumb," POST 73/259-261) → confidence ↑, STILL a content/authoring constraint
> to honor when founding war-content + a meter-prereq ladder are built, NOT a regression (debt #56).
> **#153 command-bootstrap = NOW 4-SOURCE** — 1st President = Abraham Whipple, an emergent Iron-Fist
> Admiral with no celebrity head start (Washington went Unlikable + LOST Canada → never President),
> confirming Presidents emerge from play. Plus 7th-angle re-confirmation of the founding cluster
> (#86/#133/#100/#101/#92/#62/#31/#45/#155/#158) + the kingmaker ≤1-protégé/turn cap (POST 224).
> **Decision-gated / parking-lot RECOUNT: 0** (#177 scope-wall + #178 ≤3-fires canonicity are
> designer-gated WITHIN their own work, NOT new top-level decisions). **NO new keystone, NO re-sequence;
> top of queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the CPU-AI cluster (E9/K5)
> now carries the corpus's strongest justification, and #177/#178 are the federalism-era next-build
> content.**
>
> **★★★★★ Batch-24 version — TWO FOUNDING-ERA PLAYTESTS (`grass1772` 2-human-vs-8-CPU
> 1772, DIED of CPU-bookkeeping burnout then relaunched by ADDING humans + `rookie1772`
> one-player ROOKIE solo run of the most-complex era), THE 5TH + 6TH CAPTURED 1772
> THREADS; CORROBORATION-HEAVY, ONE genuinely-new founding gap [#176]; NO new keystone, NO
> re-sequence, NO keystone moves, NO new author-before-build or Decision-gated items;
> top-of-queue UNCHANGED. ★ The marquee is a META-PRIORITIZATION signal: the
> onboarding/solo-app/CPU-AI cluster now carries the STRONGEST justification in the corpus
> (4 GM-burnout deaths).** `grass1772` (`5b1b2c33`, GM **@Cal** — NOT designer-
> authoritative, Ted/V posts are; ~1772→1788, abandoned twice to upkeep load) and
> `rookie1772` (`0039e941`, GM **@matthewyoung123**, a self-described ROOKIE — NOT
> designer-authoritative; ~1772→1788/1790, Washington 1st President, abandoned to GM time-
> burnout) are the 5th + 6th captured 1772 sources. **The value:**
> **(1) ★ #176 FOUNDING MilPrep PREREQUISITE-ORDERING FIX → FOLDS INTO E1 (founding/RevWar)
> + E6 (#67 meter caps). Size S. An AUTHORING CONSTRAINT to honor when founding war-content
> + a meter-prereq ladder are built, NOT a regression; designer-gated open Q.** Both batch-24
> 1772 runs INDEPENDENTLY hit it: founding Military Preparedness is hard-capped at ~2 for the
> WHOLE Era of Independence because the meter's tier prerequisites are mis-ordered — **MilPrep
> 3-4 require the Militia Act (a federalism-era ~1792 bill)** while the **auto-forced 1774 war
> bills (Continental Army/Navy)** are wired to higher tiers, so **every forced-war MilPrep roll
> is wasted + a permanent founding military crisis** (`grass1772#POST 86-90, 121` Cal + Ted
> confirms; `rookie1772#POST 26, 32-33` rookie hit it blind). **★ Shipped-state nuance: the
> build has NO tier-prerequisite system at all** — `scenario1772.ts:9-17` boots `military:-2`
> as a raw `[-5,5]` scalar; grep `meterPrereq|meterTier|MilitiaAct|StandingArmy` in `src/` =
> ZERO; `revolutionaryWar.ts` has no tiers. So this is a **content/authoring constraint to
> honor WHEN founding war-content is built** (Cal's reverse-the-prereqs fix: Continental Army
> → MilPrep 3, +Navy → MilPrep 4, cap ~4-5 pre-federalism). **Open Q (designer): adopt the
> reverse-prereq fix, or keep the founding crisis as intended.** Also: surface meter
> prerequisites/caps in-UI (a new player can't see them — folds into DH-69's UX). debt #56;
> game-mechanics §17.4; technical-guide §9 batch-24 lead + §9.6.
> **(2) ★★ THE ONBOARDING / SOLO-APP / CPU-AI CLUSTER IS THE META-PRIORITIZATION SIGNAL (NO
> NEW SCOPE — RAISES the justification of already-scoped items).** The single biggest lesson
> across 24 batches: both batch-24 runs DIED to the manual CPU-faction sim + opaque rules.
> `grass1772` died because **2 humans couldn't hand-run 8 CPU factions** ("didn't have the
> time to run the two player factions and all 8 CPU factions," `#POST 328`) → the FIX was to
> ADD humans to OFFLOAD the CPU work (relaunched 8-human + 2-CPU, `#POST 348`) — the cleanest
> proof that the **manual CPU-faction sim is the load-bearing cost the app's CPU-AI must own.**
> `rookie1772` is the **strongest ONBOARDING signal in the KB** — a rookie hits documented
> walls on phase-processing, meter-prereqs, phase-order, the era transition, and (the headline)
> the **Lingering phase: "which I have never run before… a little more complicated than I
> expected" (`#POST 1370`)**. With `modernday` + `pop2012b` this is the **4th GM-burnout
> death** (DH-36 cluster). These map to items ALREADY in the roadmap — **DH-69** (in-app guided
> phase-processing + rules/legal-move surface; debt #53) + **#114** (CPU-AI owns the per-faction
> sim = **the E9 handler suite + K5**). CONFIRMED unbuilt (grep `rulebook|legalMove|
> availableActions|onboard` = ZERO; grep `cpuHandler|handlerSuite|runCpuFaction` = ZERO).
> **★ RAISE priority/confidence on E9/K5 + the DH-69 UX item + the DH-36 automation note; do
> NOT re-sequence and do NOT add scope.**
> **(3) ★ MINOR WAR-ENGINE CONSTRAINTS (fold into #155/#56 / the E3 war engine — no new
> epic):** **(i)** clamp the doubled-officer Planning term to 0-5 (`revolutionaryWar.ts:212`
> `*2` can hit 6+; `rookie1772#POST 35`; **XS**); **(ii)** add a **scripted-event WIN PATH** to
> the generic `War` model (`grass1772` won via a "King George grants autonomy" event — a 3rd
> RevWar win-path alongside French-alliance + battle-score; folds into #155/#56); **(iii)**
> surface meter prerequisites in-UI (UX, with DH-69). debt #16, #56.
> **(4) ★ CORROBORATIONS (confidence ↑, no keystone moves):** **#153 command-bootstrap = NOW
> 4-SOURCE** (`grass1772`'s 90-yr-old CPU botanist John Bartram elected 1st President from a
> near-0-Command boot, `#POST 202-205` + "almost no one starts with command" master polSet,
> `#POST 538-540` — high confidence; build already zeroes rookie Command + PV drives
> elections). The **founding cluster** (#86 boot / #133 CC composition / #67-#134 Lingering /
> #100/#101 offices-by-law / #92 era-as-content-band — Lingering/retirements/SCOTUS OFF in
> Independence, ON at 1788) reinforced from a 5th AND 6th 1772 angle; **#159** ahistorical-
> Convention re-confirmed from 2 more founding traces (grass: 2-human-collusion → unicameral
> "Super House"; rookie: Senate-appointed-by-Governors + President-for-life). **Decision-gated /
> parking-lot RECOUNT: 0** (#176 is buildable in E1/E6; the reverse-prereq question is designer-
> gated WITHIN that work; the rest is corroboration/justification). **NO new keystone, NO
> re-sequence; top of queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the
> onboarding/solo-app/CPU-AI cluster (E9/K5 + DH-69) now carries the strongest justification in
> the corpus.**
>
> **★★★★★ Batch-23 version — ONE PLAYTEST (THE 2ND, DISTINCT 2012-START "ERA OF
> POPULISM" RUN), CORROBORATION-HEAVY, TWO NET-NEW LEGISLATION-DATA GAPS THAT SIT IN
> EXISTING EPICS, ONE PREDICATE SHARPENING, TWO CLARIFICATIONS; NO new keystone, NO
> re-sequence, NO keystone moves, NO new author-before-build or Decision-gated items;
> top-of-queue UNCHANGED.** `pop2012b` (`409a7c18`, a **939-post 2012-START modern
> MULTIPLAYER**, GA-run [**Rodja**] — but **@MrPotatoTed (game co-author) plays on
> Blue-5/Obama and his in-thread point-of-order corrections are DESIGNER-AUTHORITATIVE**)
> is the **SECOND, DISTINCT 2012-start "Era of Populism" run** [`pop`/`c50d9da7` is the
> FIRST] — same seed/factions, different players/outcome (Ron Paul wins the GOP nom and
> flips OH+FL in a losing general; ran 2012→the 2014-midterm cycle, did NOT cross an era
> boundary; **died at GA-burnout — Rodja resigned**). A **2nd-source-corroboration-heavy**
> batch + **two buildable legislation-data items already living in their epics.** **The
> value:**
> **(1) ★ #174 COMMITTEE BILL-PACKAGING + RANKING-MEMBER COUNTER → FOLDS INTO the
> committee/bill-packaging epic E14b (#8/#9/#12, the E14 sub-PRs a/b). Size S–M. Verified
> UNBUILT** (grep `rankingMember|packageOf|chairBlock` in `src/` = **ZERO hits**; the
> committee runner `runPhase_2_6_2_Committee` `phaseRunners.ts:3463-3496` reads ONLY the chair
> `committeeChairs[bill.committee]` `:3476` and sets `passed_committee`/`killed_committee`
> per-bill — NO ranking member, NO package structure, NO chair-add path; state is chair-only
> `types.ts:1583`). **★ The fullest committee bill-packaging spec captured anywhere in the KB
> (`pop2012b#POST 724` verbatim):** a **ranking-member un-package/repackage COUNTER-mechanic**
> (**5 trait gates** — Efficient+crisis-trait / higher-Legislative / Manipulative-vs-Pliable-or-
> Predictable / Iron-Fist-vs-Passive / Magician-equal-Legislative) + **two chair-add-bill powers**
> (5 Legis+Efficient → add an off-committee tax bill; 5 Legis+Magician → add one off-topic bill)
> + the **cross-chamber/cross-committee package GUARDS** + the **Puritan committee-voting rule**
> (self-ideology abstention, reuses the §22.7/§25.6 Puritan-abstain primitive). **It STACKS ON,
> does NOT replace, the still-unbuilt #8/#9 chair-block/package — the chair lever and the
> ranking-member lever are TWO distinct opposing-side levers at two pipeline points; build them
> in ONE E14b pass, chair-side first.** Needs a **ranking-member field on `committeeChairs`** (or
> a parallel `committeeRanking` map) + a **`Bill.packageOf?: BillId[]`** package structure; binds
> at `phaseRunners.ts:3463`. **★ Open Q (designer-gated, BEFORE building): cross-check the 5
> ranking-member gates + the 2 chair-add powers vs. `tedchange`** (the official rules-doc channel;
> this is the fullest packaging spec but is sourced from a SINGLE thread). debt #54;
> game-mechanics §12.5.1; technical-guide §9 batch-23 lead + §9.6.
> **(2) ★ #175 LAW-REPEALABILITY DATA MODEL → small data-model add INSIDE #42 (the
> bill-relationship graph, E29 §12.9) + §27.5 (statehood-by-bill, E4b). Size S. Verified
> UNBUILT** (the `Legislation` interface `types.ts:1506-1520` has NO `repealable` and NO
> `lawClass`; grep `repealable|lawClass` in `src/` = **ZERO hits**; the floor runner
> `runPhase_2_6_3_Floor` `:3498` has no repeal/replace branch). **★ The fix (MrPotatoTed designer
> ruling, `pop2012b#POST 687-688`):** add **`Legislation.repealable: boolean`** + a **`lawClass:
> 'repealable' | 'replace-only' | 'permanent'`** tag — **repealable** (Repeal bill removes it via
> the normal pipeline; most policy bills), **replace-only** (cannot repeal, only supersede with a
> same-kind bill; **tax + immigration** laws), **permanent** (irreversible; **statehood** — no
> Repeal-Statehood bill exists). Gate Repeal proposals on the flag; expose a Replace action for
> replace-only laws; mark statehood + other one-way structural bills `permanent`. **★ This is the
> authoritative resolution of the `pop` §5.5 data-tag hole + the concrete form of #42's `Not
> repealable` / replace-by-X / amendment-tier constraints — build it WITH #42, NOT as a
> standalone.** **★ Open Q: authored repealable/replace-only/permanent per-bill list vs.
> per-row hand-marking** (a content/authoring task that joins the **#120 dataset umbrella**, E18d).
> debt #55; game-mechanics §12.9.
> **(3) ★ #88 PREDICATE SHARPENING (no new item) — the apocalypse/coup endgame fires at the
> meter FLOOR band, NOT "Crisis."** `pop2012b` shows Planet's Health hitting "Crisis" (and
> Rev/Budget "Crisis") in a Lingering tick with **NO apocalypse clock firing** (`#POST 632`),
> pinning the trigger to the bottom tier (APOCALYPSE) — one band BELOW "Crisis." **The build
> predicate (the countdown clock AND the §26.4 per-event-phase coup rolls, e.g. Honest-Gov) gates
> on `meter === floorBand`, NOT `meter <= crisisBand`.** Folds into the existing #88/#158
> end-condition + APOCALYPSE-clock work at **E6** (debt #28/#32, §9.1.4). game-mechanics §26.4.
> **(4) ★ #15 VP-RUBRIC + CABINET-DECLINE-CPU-ONLY = CLARIFICATIONS (no new build surface).**
> The canonical tables/code-intent were ALREADY correct: the convention VP rubric
> (game-mechanics §15.3.4 / §25.2.1) already encodes **"+1 if at least one ticket member is
> YOUNGER than 60"** (and +1 if one is OLDER than 50) — there is **NO "+1 for older than 60"** (a
> GA mis-scored it; MrPotatoTed corrected it LIVE). Row 7's "independent/outsider" check reads a
> **discrete `canBeIndependent` pol TAG** (Ron Paul lacks it despite a 1988 third-party run) — NOT
> inferred from office status. Cabinet accept/decline %s are **CPU-only** (gate the decline rolls
> behind `isCPU`; humans free-choose except VP). All confirmations the **E16 + convention-rubric**
> scope already covers — pin the AUTHORITY (MrPotatoTed). No code surface beyond what's scoped.
> **(5) CORROBORATIONS (no keystone moves):** a **2nd, INDEPENDENT 2012-boot re-confirms the
> entire modern cluster** — **#86** (boot model) / **#47/#13** (primary→convention→general) /
> **#15/#16/#18/#51** (VP-rubric / general / 2-layer meter→election map; the "PRE-MIDTERMS STATE
> OF METERS" printed VERBATIM) / **#52** (SCOTUS docket / drift / Shenanigans / confirm-by-
> distance) / **#25/#112/#124** (28-seat cabinet) / **#70** (leadership) / **#91** (12A-gated VP
> action) / **#8/#9/#12** (committee) — confidence ↑. **★ #90/#43 procedural-pol-gen is LIVE
> again** as **career-track starvation** from the thin 2013 post-boot draft (2nd corroboration of
> the dual procedural-gen gates → **E8**, debt #19). **★ A 3rd GM-burnout DEATH (Rodja resigns —
> "freaking hard … to be the literal computer tracking every rule," POST 938)** adds a 3rd data
> point to the **DH-36/DH-69/#114 automation argument** (cite, not a row). **DECISION-GATED /
> PARKING-LOT COUNTS UNCHANGED (batch 23 nets 0):** #174/#175 are buildable in existing epics; the
> #174 `tedchange` cross-check + the #175 authored-list question are designer/content-gated WITHIN
> their epics, NOT new buckets; #88 is a predicate, #15 a clarification, the burnout death a cite.
> **NO new keystone, NO re-sequence; top of queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot →
> E1).**
>
> **★★★★★ Batch-22 version — ONE PLAYTEST (THE ONLY MODERN THREAD CROSSING AN ERA
> BOUNDARY), TWO CONCRETE MODERN BUILD ITEMS THAT SIT IN EXISTING EPICS, A CURRENT-RULES
> SPEC-ANCHOR, TWO SMALL BUGS; NO new keystone, NO re-sequence, NO keystone moves, NO new
> author-before-build or Decision-gated items; top-of-queue UNCHANGED.** `modernday`
> (`65f81fe8`, a **3014-post 2016-START current-rules 8-human modern MULTIPLAYER**, GA-run
> [Rodja→ebrk85] but the marquee rulings are designer-blessed in-thread [Ted/vcczar
> adjudicate]) is **THE ONLY modern thread in the KB to CROSS AN ERA BOUNDARY** — the 2024
> "Era of Populism"→"Era of the Near Future" transition. A **corroboration-heavy** batch +
> two buildable modern items that already live in their epics. **The value:**
> **(1) ★ #172 ERA-KEYED CONFIRMATION THRESHOLDS + NUCLEAR-OPTION → FOLDS INTO E16
> (cabinet/confirmation) + E14c (cloture). Size S–M. Verified UNBUILT** (zero
> `cloture|filibuster|nuclearOption|confirmationThreshold|requiresConfirmation|senateConfirm`
> hits in `src/`; the shipped `runPhase_2_3_1_Cabinet` `phaseRunners.ts:2158-2223` is a flat
> scored pick → `cabinet[seat]=pick.id` with NO Senate vote, NO threshold, NO nuclear-option
> gate). **★ Ted-authoritative spec (`modernday#POST 422-423`):** *"for a 2016 start, Cabinet
> Members require only 50%+1 of the Senate's approval, unless you repeal the Nuclear Option
> (which is otherwise permanently in place). Supreme Court nominees will continue to require
> 60%, unless you enact the Nuclear Option for that as well."* The Nuclear-Option DEFAULT is
> **era-keyed** (Reid-2013 + McConnell-2017 already fired by a 2016 start). **Concrete build:**
> a `GameState.nuclearOption: { cabinet: boolean; scotus: boolean }` **per-start-year boot
> flag** (Cabinet 50%+1 / SCOTUS 60% for 2016) seeded by `scenarioBoot` (the same
> `BootSheet` surface as #170's office-existence seed), read by a **per-track confirmation-
> threshold** check in the cabinet runner (`phaseRunners.ts:2158`) + the SCOTUS-nomination
> path (`:3648-3671`) + the **SML enact/repeal action** (one ActionRegistry row that toggles
> the flag) + the **60→fail→10-vote-conversion→auto-confirm-a-Mod fallback** (`modernday#POST
> 602-603`). **★ It COMPOSES, does NOT conflict, with already-scoped pieces — do NOT re-build
> them:** #124's auto-pass GATE (whether a vote even HAPPENS) fronts the threshold; #52/E9-9d
> (WHO votes aye) resolves the contested vote; #171 is orthogonal (draft, not confirmation);
> and the **batch-9 USER cloture decision** (Senate 60%-then-majority vs simple-majority,
> resolved-in-code as simple majority) is the SAME cloture surface E14c owns — **do NOT
> re-litigate it; the Nuclear-Option flag is the era-keyed DEFAULT on TOP of it.** **Open Q
> (designer-gated TUNING within the epic):** boot-flag-vs-derived-from-cloture-bills. debt
> #50; game-mechanics §9.3.10; technical-guide §9 batch-22 lead + §9.6.
> **(2) ★ #173 ERA-BOUNDARY-ALIGNED STARTS → NEW-GAME START-YEAR PRESETS = THE 14-BAND
> OPENINGS; couples scenario-boot (#115). Size S. Verified UNBUILT** (`NewGameScreen.tsx`
> hard-codes a two-entry `SCENARIOS` array, `type ScenarioId = '1772' | '1856'`; `startNewGame`
> `GameContext.tsx:264` admits exactly those two — there is NO era→start-year axis). **★ The
> fix (the GM's own closing verdict, `modernday#POST 2964`):** *"For any new test start date,
> it must be the date a new era begins. One of the issues we ran into with this test was it
> started in the middle of an era."* Expose a **PRESETS table on the boot picker keyed to the
> canonical 14-band era→start-year→first-president map** (Independence 1774 / Federalism 1788 /
> Republicanism 1800 / Democracy 1820 / Manifest Destiny 1840 / Nationalism 1856 / Gilded Age
> 1868 / Progressivism 1892 / Normalcy 1916 / Ideologies 1928 / Nuclear Age 1948 / Neocons
> 1972 / Terror 2000 / Populism 2012). Each preset = a **scenario-as-data-row on K4's
> `BootSheet`/`scenarioBoot`** (same pattern as `scenario1868`/`scenario1788`), so it is GATED
> on `scenarioBoot` existing. The UI delta is small (a presets dropdown/grid replacing the two
> hard-coded buttons); the WEIGHT is the boot sheets each preset points at (the era-content/
> scenario work the roadmap already scopes). debt #51; game-mechanics §27.9.
> **(3) ★ #68/#2 ERA-BOUNDARY PIPELINE → SPEC-ANCHOR CONFIRMED (current-rules live instance);
> UNBUILT; NO priority change.** `modernday` is the **first live instance in the KB of the
> 6-clause point-banking ritual firing at a REAL boundary under CURRENT rules** (the 2024
> transition, `#POST 1871` — verbatim formula: most-points +5 / other-party-most +3 / 2nd-most-
> same-party +3 / all-factions-in-top-party +3 each / two −1 allied-faction-finished-last
> guards) + the **non-banked score reset** ("Scores will be reset to zero for the next Era") +
> the **faction-trade/switch window** (`#POST 1874`) + the **procedural-content swap**
> (historical imports → all-generated rookies, `#POST 1902/1909` — see (5)/#43). It **matches
> `rep1800` almost exactly**, so #68/#2 is now confirmed a deterministic pipeline from BOTH a
> 1800 and a current-rules angle. **No priority change — stays folded into K3/K4 point-banking
> (§9.1.5, the two-level era model); the spec is now SOLID for when the era-model epic builds
> it.** game-mechanics §27.2.1. (No new debt row — strengthens K3/K4, debt #5.)
> **(4) ★ #171 ERA-KEYED DRAFT-IDEOLOGY TOGGLE → PROVEN FLIPPING ON→OFF in ONE save
> (corroboration; sharpens debt #48, NO scope change).** `modernday` is the **single cleanest
> live demonstration in the KB**: restrictions **ON** 2016-2024 ("You can draft only
> politicians restricted by your draft ideologies", `#POST 558`) then **OFF** at the 2024
> boundary ("there are no longer any draft restrictions… You can draft anyone from RW Pop to
> LW Pop", `#POST 1902`) — the toggle FLIPS at the Populism→Near-Future band boundary inside
> ONE campaign. Confirms the ON→OFF flip is keyed to realignment completion (the era-band
> boundary) — confidence ↑, still an era-keyed boolean on the #4/#108 profile system. debt
> #48; game-mechanics §4.1.w + §27.9.
> **(5) CORROBORATIONS (no keystone moves):** **★ #43 PROCEDURAL POL-GENERATOR OWNS THE
> MODERN→FUTURE BAND** — by 2024 the dataset is exhausted and the draft is "basically all
> generated pols" (`#POST 1902/1909`); now corroborated LIVE from `modernday` (+ the batch-15
> `terror2000` 2000-start), pinning that the modern→future content boundary is where the
> dataset exhausts into pure generation (→ **E8**, debt #19 / scaling-wall (a)). **★ DH-70 —
> `Lackey` PV over-weight → a `pv.ts` NOTE (XS):** the digest flags a LW-Pop with only Lackey
> at PV −47; **★ shipped `pv.ts:77` already applies a flat `−5` to EVERY negative trait**
> (`else if (NEGATIVE.includes(t)) total -= 5;`) and `Lackey` appears NOWHERE in `src/` (not
> yet a shipped trait) — so **when `Lackey` is ported, add it to `NEGATIVE_TRAITS` so it takes
> the SAME flat `−5`, with NO special-case** (the over-weight the forum saw was a spreadsheet
> artifact; the shipped formula already treats all bad traits equally). Pairs with #120
> dataset-balance + DH-51. debt #52. **★ DH-69 — NO in-app rules / legal-move surface
> (UX/onboarding):** grep `rulebook|legalMove|availableActions|helpPage|tutorial|onboard` in
> `src/` = ZERO hits — players "winging it" without a rulebook (`#POST 342-356`); an **in-app
> rules / legal-move surface** sharpens #115's boot-procedure gap, **serves the CPU cluster**
> (a legal-move enumerator is the same primitive a CPU action-picker needs), and the
> GM-burnout theme (DH-36 family). **UX/onboarding item, no engine size of its own; cite under
> the #115 / CPU-AI work.** Plus tagged corroborations (no rows): **#92/#41** era bands (2016
> + the 2024 crossing); **#13/#47/#15/#16/#18/#51/#111** legislative + 2-layer scorer (the
> "State of the Meters" published verbatim, `#POST 2380`, MATCHES the FROZEN SPEC) + full
> 4-committee→chair-block→SML-block→vote→filibuster→conversion→VP-tiebreak→veto→2/3-override
> chain (`#POST 521-569`); **#124/#25/#170** cabinet (28-seat roster + CIA-Director-as-intel /
> no-DNI re-confirms #170's supersession); **#70–#79/#1/#114** CPU suite (CPU backfills vacant
> factions, faction-trade auto-accept; 8-human MP w/ handovers — the app is a solo adaptation,
> humans are 1-of-10); **#110** full 2.1.x→2.9 sub-phase taxonomy; **#108** high/max-enthusiasm
> factions shielded from conversion; **DH-54/DH-66** impeachment ran to completion (Warner =
> 3rd impeached pres, acquitted; GM short-cut the special-committee step — under-specified,
> E10b family); **#171** (above). **DECISION-GATED / PARKING-LOT COUNTS UNCHANGED (batch 22
> nets 0):** #172/#173 are buildable in existing epics; DH-69 is UX, DH-70 is a pv.ts bug-note;
> the #172 boot-flag-vs-derived question is designer-gated TUNING within E16/E14c, not a new
> bucket entry. **NO new keystone, NO re-sequence; top of queue UNCHANGED (QW0 → K0/K2 → K3/K4
> + scenarioBoot → E1).**
>
> **★★★★★ Batch-21 version — FOUR PLAYTESTS, ONE ★★ ESCALATION (FIELD-FALSIFIED), TWO
> ERA-KEYED GAPS (ONE PARTLY SHIPPED), ONE DH BUG; NO new keystone, NO re-sequence, NO
> keystone moves, NO new author-before-build or Decision-gated items; top-of-queue UNCHANGED.
> FOUR playtests: `nixon1972` (`4853cf4d`, 1972-start modern MP, GA-run, one half-term then
> GM-burnout stall), `cpufull` (`1f72600c`, all-CPU 1772 founding traversal, GA-run, ENDED on
> a scripted CPU game-over), `trump2024` (`51dfaef1`, **Ted-run designer-authoritative**,
> 2024/Jan-2025-start modern MP, SETUP-ONLY), `solo1916` (`5027f0f3`, 1916-start solo
> Progressive-Era/WWI, GA-run, one half-term then stall). The value:**
> **(1) ★★ #158 CPU ANTI-GAME-OVER — RE-PRIORITIZE HIGHER, FIELD-FALSIFIED (the load-bearing
> move this batch).** `cpufull` is the **2nd live CPU game-over in the KB** and **field-
> falsifies the flat-75%-oppose patch**: the patch was applied and the game ENDED anyway — the
> all-CPU Continental Congress accepted the Carlisle Peace Commission, **4/10 factions rolled
> ≤25** (two rolled 1/100, two 9/100) meeting the defect threshold, and after CC-President John
> Adams's REJECT was overridden a **4-5-4 PLURALITY** carried the game-over (`cpufull#POST
> 62-68, 73`). With 10 independent 75% rolls ~2.5 factions are EXPECTED to defect every time,
> so the flat per-faction roll does NOT reliably hold; `ted1772`'s near-misses survived only on
> the **2/3 Articles peace-vote threshold** (RevWar floor #2) — here the **plurality-override
> path bypasses the 2/3 floor entirely.** **★ The fix is RE-SCOPED (designer-gated which-way):**
> (a) a **HARD VETO** — in a solo/CPU-majority game, any response that sets `triggersGameEnd`/
> surrender is REMOVED from the CPU vote menu (unselectable), OR (b) a **points-based anti-peace
> ideology bias** tuned so a CPU plurality cannot form (Ted: *"give points to most ideologies to
> be opposed to peace… 90% of the time that's the way the CPU will swing"*); **PLUS, either way,
> a NON-PLURALITY-OVERRIDABLE game-ending-peace** — a separate guard on the CC/Congress override
> path so the Pres's reject can't be beaten by a mere plurality. **Verified UNBUILT:**
> `phaseRunners.ts:2871` just sets `game.gameEnded` (no veto/bias/plurality guard);
> `pickAIResponse` (`eraGraph.ts:88-103`) has NO anti-game-over term. **★ This is a SOLO-PLAY
> BLOCKER — the "DH-29 of the CPU/war track"** (a CPU-majority game can end itself prematurely
> against the human's survival wish) — and it makes the **#155 RevWar floor #3 LEAKY** (debt
> #34a). **Build it WITH the #155 war-balance pass (E3) + the #75 CPU event-vote handler (E9),
> AHEAD of the rest of the CPU/war track; bears on #114 (solo-app).** Size S–M. debt #32
> (ESCALATED) + #34a; game-mechanics §13.2 (strengthened) + §21.1 + §25.7.
> **(2) ★ #170 ERA-KEYED OFFICES/DEPARTMENTS → EXTENDS the boot/offices work (E16), S–M;
> PARTLY SHIPPED.** The **founding-seat half is ALREADY LIVE** — `cabinetSeatsForYear(year)`
> (`types.ts:1196`) era-gates Navy ≥1798 / Postmaster ≥1829 / Interior ≥1849. The unbuilt half:
> the modern departments are absent from the `OfficeType` union (`types.ts:1111-1134` — no
> Energy/DHS/DNI/CIA-Director/Commerce/Labor/HHS/HUD/Transportation), there is no
> `foundedYear`/`createdByBill`/`supersedes` schema, and no office-supersession. **★ Ted-ruled
> canonical exemplar (`trump2024#POST 40-41`):** *"DNI replaces CIA Director in game when it's
> created"* — an office-supersession (DNI⇒CIA-Director on creation in 2004), corroborated from
> BOTH ends (`nixon1972`: DOE/DNI don't exist in 1972; `terror2000`: DNI created mid-game 2004).
> **Add the modern departments to `OfficeType` + a per-office existence table** (`foundedYear`,
> optional `createdByBill`, optional `supersedes`) + the **DNI⇒CIA-Director supersession**, on
> the **planned boot-seed `GameState.cabinetSeats: SeatSpec[]` refactor (§3 item 2 / E16)** —
> NOT a new epic; it is the era-keyed-EXISTENCE + supersession layer on the mutable-cabinet-seat
> refactor already scoped. Pairs with the era-content / scenario-boot work. **Open Q:** real
> distinct DNI/DHS seats vs the supersession stopgap (designer call). debt #47; game-mechanics
> §9.3.1.1.
> **(3) ★ #171 ERA-KEYED DRAFT-IDEOLOGY TOGGLE → folds into the #4/#108 draft-profile work, S;
> OFF in the modern present.** Ted-authoritative (`trump2024#POST 9, 14, 15-16`): *"There are no
> draft ideology restrictions for the future/present timelines… You get to make your own
> faction"* — the first playtest authored with NO draft-ideology restrictions. The restriction
> is itself era-keyed: ON in early/realigning eras (the #4 per-(faction,era) profile + the
> off-profile 30/50% rolls + adjacency-on-exhaustion are the engine's tools for *forcing* the
> §28.4/#108 historical realignment), **OFF in the modern present** because the partisan sort is
> already complete. Three batch-21 start years bracket the flip: **1916 ON** (`solo1916`) ·
> **1972 ON** (`nixon1972`: off-ideology attempts roll >50; Yellen 95/70; pool-exhaustion →
> adjacent "without penalty") · **2024 OFF** (`trump2024`). #171 layers on top of #4 as an
> **era-keyed boolean** (`eraDraftIdeologyRestrictions`, or derived from realignment-completion
> state) gating the #4 profile; faction-leader eligibility (#110) still applies regardless.
> **No standalone epic.** **Open Q:** the exact ON→OFF boundary (keyed to realignment
> completion, ~1990s/modern). debt #48; game-mechanics §4.1.w.
> **(4) ★ DH-68 — PROGRESSIVE-ERA SUCCESSOR-STATE EVENTS LACK A WWI-END PREREQUISITE → folds
> into the DH-60 era-event-precondition work (now multi-era), S.** In a 1916-start first
> half-term (`solo1916#POST 31, 34`) "Czechoslovakia Gains Independence from Austria" + "Hungary
> Gains Independence from Austria" fired **before WWI had ended** (community: *"These two should
> not trigger until after WWI is over"*). **Codebase-verified — exactly DH-60's gap, and the two
> builders diverge:** the **1772 graph HAS the machinery** (every node carries optional
> `precondition: Predicate` `types.ts:1487`; `evalPredicate` `eraGraph.ts:12` interprets
> `eventCompleted`/`warActive`/`warOutcome`/`eventChose`) but the **1856 builder is
> CALENDAR-ONLY** (`buildEraEventsForYear` `eraEvents1856.ts:4` emits by `year >= X && year <= Y`
> with NO `precondition` on any row) and a **Progressive builder does not exist** (1916 runs on
> `modern`/`progressive` tuning, UNBUILT). **The fix:** add a WWI-end predicate to the
> Czechoslovakia/Hungary nodes (and other post-war beats) + **port the 1772-graph `precondition`
> layer into the calendar-only 1856 builder + a new Progressive builder** — the SAME selective-
> precondition ask as DH-60 (`dem1820`/`arkzag`/`smallbugs`), now multi-era confirmed. SAME
> surface as BUG-1 + K3's `territoryOwned`. debt #49; game-mechanics §10.4.8.
> **(5) CORROBORATIONS (no keystone moves):** **★ CPU suite #70–#79** re-validated end-to-end by
> `cpufull` (CC-president/leadership/committees #70/#72; bill propose+committee-vote+packaging;
> vote-by-cross-party-damage #74; event-vote + Congress override #75; enthusiasm drift #108;
> conversion gating #127/#76; RevWar engine #45) — **confidence ↑** on the whole cluster.
> **★ Modern band 2021-2025** (#92/#41/#169 ← `trump2024`: Biden-as-retired-Pres, the Jan-2025
> incumbent board, the 2020-census EV/bias repoint, the 2.10-first mid-government boot #164) +
> **start-year/era-band confirmations** at 1916/1972/2024 (← `solo1916`/`nixon1972`/`trump2024`).
> **★ Crisis/war/Watergate** (#11/#45/#106 ← `nixon1972`: DomStab crisis = meter-threshold named
> state; Vietnam = relabeled war as an ongoing meter; Watergate = a Controversial-gated ~75%
> EVENT, no impeachment trigger — pins the gate). **★ Hinge polarity §5 + #108** (← `solo1916`:
> Debs-Socialists + Tillman-Traditionalist-Democrats inside BLUE; Borah/La-Follette "Populists"
> + TR "Imperialists" in RED — the #108 Dixiecrat-inside-Blue pattern). Plus: repeatable gov
> actions should be COUNTS not booleans (`trump2024#POST 53, 56` → #20); no-candidate-withdraw
> quirk (`solo1916#POST 26` → a #110 friction). **★ `nixon1972` is ANOTHER GM-burnout stall**
> (the Nth such death — the upkeep-automation argument behind E9/#55/#115 keeps growing; cite,
> don't queue). **DECISION-GATED / PARKING-LOT COUNTS UNCHANGED (batch 21 nets 0):** the #158
> which-way (hard-veto vs points-bias), the #170 real-DNI-seat question, and the #171 ON→OFF
> boundary are designer-gated TUNING within their epics, not new bucket entries. **NO new
> keystone, NO re-sequence; top of queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) —
> BUT #158's escalation makes the CPU anti-game-over fix a higher-priority item WITHIN the
> CPU/war track (a solo-play blocker, built AHEAD of the rest of it).**
>
> **★★★★★ Batch-20 version — FOUR META/DESIGN THREADS, ONE NEW RUNTIME MECHANIC, ONE
> AUTHORING-PROCESS GATE, THE REST DATASET / QUARANTINE (NOT a re-sequence, NO new keystone,
> NO keystone moves, NO new author-before-build or Decision-gated items; top-of-queue
> UNCHANGED). A LIGHT batch — FOUR meta/design threads, almost none of it new code:
> `planb` (`094cc3a2`, the build-FINISHING PROCESS plan, NOT a playtest), `dbomit`
> (`4be5a005`, a missing-pol REQUEST thread → #120), `biden2021` (`24061ad6`, a modern
> era-CONTENT brainstorm), `ampu2wish` (`888ba777`, the OUT-OF-SCOPE AMPU-2 wishlist). The
> value:**
> **(1) ★ #169 ELDERLY-PRESIDENT MID-CAMPAIGN DROP-OUT → ENDORSE-VP EVENT → SMALL
> ADDITION TO THE ERA-EVENT EPIC (E15), size S.** The single runtime delta this batch — the
> Biden-2024 → Harris analog. **DESIGNED, not built; the age roll it gates on ALREADY
> EXISTS.** grep for `dropOut|replaceOnTicket|endorseVP|midCampaign|forcedOut|stepAside`
> across `src/` returns **ZERO** hits — no mid-campaign presidential-replacement / ticket-
> swap path anywhere. **But the trigger substrate ships:** the age-penalty die roll the event
> gates on is the **old-age ability-decay roll** (`ABILITY_LOSS_RULES.oldAge`, `minAge: 70`,
> `types.ts:521`; fired `phaseRunners.ts:2384-2393`) + the `MORTALITY_RULES` death/retire
> brackets (70/80, `types.ts:488-498`) + the PV age penalty (`pv.ts:85`, `age > 70`). **★ The
> candidate-relevant roll is keyed at 70, NOT 75** (the only 75-gated roll is the unrelated
> SCOTUS retirement roll, `phaseRunners.ts:3655`). A new `EraEvent` (`types.ts:1466`) firing
> during an aged incumbent's reelection whose effect: (i) checks the president was hit by the
> §10.1 age roll AND is running for reelection; (ii) rolls **50% to pull** him; (iii) injects
> a flat **−1 party malus** into the §21.9 presidential-vote modifier stack — **landing on
> the VP even when the pres is pulled**; (iv) **swaps the VP onto the ticket** by replacing
> `blueCand`/`redCand` inside `runPhase_2_9_4_PresidentialGeneral(snap, blueCand, redCand)`
> (`phaseRunners.ts:3752`, which already takes the ticket candidates as params; VP id at
> `types.ts:1568`); (v) a fallback to the §15.3 pre-primary/compromise-candidate machinery (+
> a pre-12A "designate a successor" path) if the VP can't/won't step up. **★ Distinct from #37
> / debt #29 (defeat-then-retire / the war-defeat President-loss package): #169 removes the
> candidate DURING the campaign, not after a loss.** **Era-of-Populism-scoped until it fires
> twice.** debt #45; game-mechanics §10.4.7.
> **(2) ★ #168 — a PRE-BUILD AUTHORING-QUALITY PASS, NOT a roadmap code epic.** NO code
> surface. It produces (a) a **terminology contract** the build must honor (ideology short
> forms `LW Pop/Prog/Lib/Mod/Cons/Trad/RW Pop`; Skills/levels/Experience/Interests
> vocabulary; military-Experience → **"Army" rename**, a `dbomit` corroboration; **human-
> rights → "criminal reform"**; demographic-category standardization); (b) a **branch-path /
> meter-direction / percentage-multiplier sanity audit** of the AUTHORED content (the **DH-53
> effect-SIGN family**; alt-state enter/exit columns swapped; legislation repealability; the
> half-broken Split-Electoral-Votes gov action); (c) a **trait/interest compilation** (how
> each is gained + what each does). **The roadmap NOTES it as an authoring-process gate; it
> does NOT schedule it as a code task** — it standardizes + audits the content the era-content/
> dataset epics consume, and it pairs with the #120 dataset umbrella + the
> `scripts/seedDataset.mjs` author-time pipeline (§7). **Governance: all changes go through
> vcczar** (`planb#POST 37`). debt #46; game-mechanics §30.11.2.
> **(3) ★ THE CHRONOLOGICAL-IMPORT PIPELINE CONSTRAINT — a PROCESS note that ORDERS the
> content work (NOT the engine track).** Anthony imports pols + events **chronologically** (he
> was on 1772-1774; everything else is edited from after 1772 forward) and **all changes route
> through vcczar** (`planb#POST 37, 72`). **Implication: per-era CONTENT authoring should be
> SEQUENCED CHRONOLOGICALLY** — founding before antebellum before modern. This does NOT
> reorder the ENGINE track (keystones/subsystems are dependency-ordered, not chronological) but
> it DOES order the per-era content authoring (the bill/event/SCOTUS catalogs the era-content
> epics consume, the #120 pass, the #168 audit). A scheduling note, not a build item.
> game-mechanics §30.11.1.
> **(4) `biden2021` → MODERN ERA-CONTENT, folds into the modern content tail (NOT a new
> epic).** The 2021-2025 Biden content list (IRA/Infrastructure bill splits, SC-reform
> amendments, the Israel-Hamas/Gaza/NATO event chain, climate pres actions, the 2021-2024 SC
> docket) **extends the modern band past 2020** and maps onto the shipped `EraEvent` +
> `Predicate` + `addPolitician` model — content-authoring, not new architecture. Folds into
> the modern-era content work (#92/#41 / E30 / §28.13). **The ONE new mechanic in the thread
> is #169** (above). **The "Pardon Controversial Allies/Family" pres actions BLOCK on #122**
> (pardon mechanics unspecified — #122 must define what a pardon does first). game-mechanics
> §28.13.
> **(5) `dbomit` → #120 (pure dataset); the standardization rulings pair with #168.** The
> ~167-pol missing-name catalog + dataset-quality bugs (wrong/missing starting expertise;
> "Army"-as-expertise→Military; missing post-2022 death dates) fold into the **#120 dataset
> umbrella** via `scripts/seedDataset.mjs` `CURATED_ROWS`/`ERA_FIGURES` (NOT by hand-editing
> JSON/CSV) — **no per-pol gap rows.** The small standardization rulings (add Middle Eastern
> ethnicity; drop no-op Protestant/White; **"Crazy" trait permanently REJECTED — use
> Controversial**) are the SAME pass as the #168 terminology contract. The post-1772
> start-game guide → **#115** (scenario-boot). game-mechanics §30.11.3.
> **(6) ★★ `ampu2wish` → OUT OF SCOPE — the roadmap MUST NOT schedule any AMPU-2 item for
> AMPU 1.** This thread is the forum's quarantined "for next time" brainstorm (OrangeP47:
> "unlikely to make it into AMPU 1"; vcczar's AMPU-2 thesis = a day-by-day Paradox-style
> timeline, full House, federal judiciary, AMPU 1 finished first). **Nothing here is a
> buildable AMPU-1 gap.** Two wishes are ALREADY-LOGGED AMPU-2 gaps, corroborated NOT
> re-logged: **DH-37** (player-to-player politician trading = "the #1 AMPU-2 wishlist item") +
> **DH-34** (dynamic/policy-reactive state biases — a deliberate history-sim DESIGN CHOICE,
> ship static stands). Everything else (day-by-day timeline, dynamic regions, dynamic eras,
> more states, achievements, scouting/hidden-stats) stays quarantined. game-mechanics §30.11.5.
> **DECISION-GATED / PARKING-LOT COUNTS UNCHANGED (batch 20 nets 0):** no item enters or
> leaves the user/designer Decision-gated bucket; no new author-before-build item. #169 is a
> designer-authoritative procedure with a couple of tuning guards (VP-younger-than-pres check;
> the alternative stiffer 80+/Frail trigger), #168 is an authoring gate, and `ampu2wish` is
> quarantine-only. **CORROBORATIONS (no re-order):** `dbomit` → #120; the post-1772 start-game
> guide → #115; the pol-trading wish → DH-37; the dynamic-biases wish → DH-34; the "Army"-
> expertise / effect-sign audit → DH-53; the conflicting-trait flag macro → DH-27; no-rookie-
> Command → #136/#153. **NO new keystone, NO re-sequence; top of queue UNCHANGED: QW0 →
> K0/K2 → K3/K4 + scenarioBoot → E1.**
>
> **★★★★★ Batch-19 version — THE EARLIEST DISCUSSION SOURCE: PROVENANCE + ONE NEW
> CONSTITUTIONAL-CRISIS SUBSYSTEM (NOT a re-sequence, NO new keystone, NO keystone moves,
> NO new author-before-build or Decision-gated items; top-of-queue UNCHANGED). The THIRD
> discussion-thread ingest and the EARLIEST of the three — `fixes2022` (`2d3ffb3e`,
> "Suggested fixes — Fall 2022", 948 posts / 15 chunks, Oct 2022 → Sept 2023), the
> **pre-early-release content-build + to-do-clear window**: @vcczar describing his OWN
> additions (tier-1, authoritative) interleaved with cross-playtest balance suggestions
> (tier-4). It **PREDATES + SPAWNS `smallbugs`** (vcczar tells a player to start that
> thread, POST 637-640) and **predates `tedchange`** (its chunks 13-15 are the same 2.2-2.4
> rules-doc cleanup Ted later formalizes). Corroboration- and provenance-heavy: mostly
> #120 dataset work + a scripted-event build-out that CORROBORATES the shipped era-event
> system (NOT a new gap). ONE new gap (#167). The value:**
> **(1) ★★ #167 NO-ELIGIBLE-SUCCESSOR CONSTITUTIONAL-CRISIS → FOLDS INTO E10b (the
> succession/impeachment epic) as the no-successor member of ONE E10b CRISIS FAMILY.** The
> fallback when the WHOLE succession line is empty (empty `vicePresidentId` `types.ts:1568`
> + no installed third-in-line). **Verified UNBUILT:** grep across `src/` for
> `successionCrisis|actingPresident|coup` returns ZERO hits; `vacateOffice`
> (`phaseRunners.ts:2446`) on a President's death/resignation just sets `presidentId = null`
> (`:2449`) with NO successor path at all — so **#167 AND #61 (normal VP-succession) bind on
> the SAME vacancy site.** The full procedure: an **emergency-Congress agenda-locked-to-
> succession-laws** vote loop (random-FL proposer, CPU auto-support, **auto-signed/un-
> vetoable**) → a **House 1-vote-per-state acting-President election** between the two party
> leaders (ineligibility→highest-PV-eligible-FL cascade; CPU party-line except Integrity→
> incumbent-party; tied state abstains; state-count tie → SCOTUS/game-over) → a **DomStab
> penalty scaled 0/−1/−2/−3** by outcome legitimacy → a **coup branch** (Controversial+LW/RW-
> Pop OR Military Leader → 3.0.2 coup rules → possible game-over, the SAME end-condition
> family as #88/debt #28). **★ SHIPPABLE-FIRST: ship the PPT-as-acting-President interim
> default FIRST (S)** — the Senate President Pro Tempore becomes acting President then resigns
> from Congress (`fixes2022#POST 849-850`, the designer's simpler version) — then layer the
> full House-election procedure (M). **★ Step (ii) reuses the #62 contingent-House-election
> 1-vote-per-state delegation machinery — build #62 ONCE, reuse for both** (no-EC-majority
> election AND no-successor acting-President). **Couples #61 (normal succession / line-
> exhausted fallback) + #88/debt #28 (anti-game-over CPU bias) + DH-54/DH-33/DH-66
> (impeachment sibling) — treat all as ONE E10b crisis family.** debt #43; game-mechanics
> §24.1.2.
> **(2) ★★ PROVENANCE = build-CONFIDENCE, NO new scope. `fixes2022` (Fall 2022) is the
> EARLIEST source for #153 / #135 / #124 / #121 / #88** — these were **designer intent from
> the START**: #153 no-reroll-on-held-expertise (the CANONICAL origin, POST 581-583, 645-650,
> re-ruled later in `terror2000`/`tedchange`/`ted1772`); #135 50-50-Senate→VP's-party (POST
> 803); #124 the Integrity/Controversial 100%→10-20% confirmation-inflation fix + the
> cabinet/legislative enthusiasm-swing cap (POST 659-670, 883-907); #121 the Secessionist-
> trait gap + the Reconstruction "Secessionist Politicians" appointment rule (POST 364-365,
> 641-644); #88 the CPU 75%-nay-on-game-over rule (POST 622, 663, the Carlisle Peace Treaty,
> predating `ted1772` #158 by ~a year). **Raise build-confidence where they sit (#153/#88 →
> debt #31/#32; #124 → E16; #121 → E3b) — NO item changes size or epic.** game-mechanics §30.10.
> **(3) ★★ ENTHUSIASM (#18/#51/#124) = the PERENNIAL-FORK RISK FLAG → FREEZE THE SPEC (the
> marquee ROADMAP RISK FLAG this batch).** The strongest corpus evidence: Anthony coded the
> rules-doc IN ORDER and **stalled ~halfway into phase 2.1 on ideology enthusiasm**; vcczar
> *"sent him like four emails… didn't bring [Ted] any closer to being confident"* (POST
> 715-716); **vcczar himself "implement[s] it a new way accidentally" each playthrough** (POST
> 713). So enthusiasm is not merely under-specified — it is the system the designer **re-
> derives differently every time**, and **the single likeliest place the build drifts from
> designer intent.** **★ Treat the #51 (drums 4-step reshuffle, §29.10) + #18 (terror2000
> 2-layer scorer, §29.3) resolutions as a FROZEN SPEC** — an enthusiasm implementation must
> build the recorded #51/#18 model EXACTLY and NOT re-derive from scratch. Add an explicit
> RISK NOTE on **E23** (the #51 4-step reshuffle + −100/waiver crisis-bill scoring) and **E20b
> / `calcStateVote`** (the ±3-cap + 2-layer scorer, debt #1). A confidence/risk annotation
> ONLY — no code change, no scope change (the #18/#51 forks were already RESOLVED in batches
> 11/15). game-mechanics §29.3 provenance note + §30.10.
> **(4) ★ ERA-EVENT FIRING-RATE BUDGET → small addition to E15 (S).** vcczar removed the old
> "2-min/8-max per half-term" cap, intends ">8", and OrangeP47 flagged an 1840 log-jam (only
> ~25% of events fired) wanting a **dynamic limit so ~70% fire per era** (POST 114-123). The
> era-event runner today (`runPhase_2_4_3_Era` `phaseRunners.ts:2796`; `buildEraEventsForYear`
> `eraEvents1856.ts:4`) has **NO firing-rate budget at all** — events fire by year-window only.
> A small addition to the era-event epic (E15 / the era-event scheduling surface, divergence
> #4) — a dynamic per-era firing budget, NOT a fixed cap. debt #44; game-mechanics §10.4.6.
> The **late-start event boot-filter** (strip pre-start-era events on a later start, honor an
> evergreen flag, POST 413-423, INTENDED) corroborates BUG-1 + #92 — build it WITH them; the
> **scripted-event build-out** (~30 events: Shaw/John-Brown demographic-removal + per-state
> abolition/suffrage/segregation/prohibition toggles + demographic-gated draft-ENTRY after the
> 19th Amendment) maps onto the shipped `EraEvent` model (`types.ts:1466` + `Predicate` +
> `addPolitician`) — it STRENGTHENS the era-event system, it does NOT add a gap.
> **(5) ★ #120 DATASET UMBRELLA → fold the `fixes2022` batch in (E18d).** ~20 named dataset/
> scenario-config items + ~10 bill/event/SCOTUS effect-SIGN bugs (bailout / Dunmore /
> Independence-budget / veto-override / San-Antonio-ISD / unicameral-options / isolationism —
> all corroborate **DH-53**) + **vcczar's OWN audit of ~1800 legisprops** (*"~1 issue per 100,
> mostly prereqs in wrong order,"* POST 367-369). Cross-thread dup: **Bob Scott (NC Gov,
> 1-Leg→1-Gov) = the SAME fix as `smallbugs` §2b.** Same author-time `scripts/seedDataset.mjs`
> `CURATED_ROWS` work surface → folds into the #120 coordinated pass; the ~10 sign bugs fold
> into DH-53; NOT a new gap. Recorded dataset PRINCIPLE: the **Leadership trait is deliberately
> VERY RARE** (only epoch-defining party-builders born with it — intentional, not a #120 bug).
> game-mechanics §30.10.
> **DECISION-GATED / PARKING-LOT COUNTS UNCHANGED (batch 19 nets 0):** no item enters or
> leaves the user/designer Decision-gated bucket; no new author-before-build item. #167 is a
> designer-authoritative procedure (ready-to-build, PPT-interim-first). The enthusiasm freeze
> is a RISK ANNOTATION, not a new gate. The open edges of #167 (ineligible chosen leader; new-
> vs-old PPT after a 3rd-in-line bill; special-election-vs-House-choice default) are tuning
> inside E10b. **CORROBORATIONS (no re-order):** #167 couples #61/#88/#62/DH-54 (one E10b
> family); #153/#135/#124/#121/#88 EARLIEST-source-confirmed; #18/#51 perennial-fork
> provenance (freeze the spec); #120 + DH-53 sign bugs (3rd-thread input + vcczar's ~1800-prop
> audit); the `EraEvent` model (scripted-event build-out fits it); #92 / BUG-1 (the late-start
> boot-filter); DH-36 (the `smallbugs` thread's genesis here, POST 637-640). **NO new keystone,
> NO re-sequence; top of queue UNCHANGED: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1.**
>
> **★★★★★ Batch-18 version — THE ECONOMIC ENGINE GETS ITS SECOND ERA (NOT a re-sequence,
> NO new keystone, NO keystone moves, NO new author-before-build or Decision-gated items).
> The FIRST 1928-START interwar campaign — `ideo1928` (`e45a756c`, "Era of Ideologies",
> 1618 posts, GA = @10centjimmy [a GAME-ADMIN, NOT the designer — GA rulings useful but NOT
> designer-authoritative; ONE Ted-authored ruling, flagged], 8 human + CPU factions, plays
> ~1928→~1936: Hoover landslide → the Great-Depression event fires LATE → FDR wins 1932,
> fades mid-term). Runs on `modern`/`progressive` tuning — UNBUILT. Headline = the ECONOMIC
> ENGINE: this is the SECOND era to exercise the E4c economic-engine epic (after the `arkzag`
> Bank-War / Panic-of-1837 arc, batch 11), so E4c is now WELL-SPECIFIED ACROSS TWO ERAS (the
> 1820s Bank War AND the 1930s Great Depression both want the SAME `game.economy` machine +
> EconStab crisis + crisis-gated bills) → build E4c GENERIC, add interwar content as DATA. It
> does NOT change the top-of-queue. The value:**
> **(1) ★★ #160 INTERWAR ECONOMIC ENGINE → EXTENDS the E4c epic (M as an E4c extension).**
> Build E4c GENERIC + add the interwar content as data. NET-NEW over E4c's `arkzag` core:
> **(i)** a **Great-Depression META-event** = ONE era-event row carrying a multi-meter shock
> bundle `{economic:−4, revenue:−2, quality:−1, military:−1, partyPref:−3}` + an (a)-markets-
> resolve / (b)-welfare-bailout presidential decider (the −4 EXCEEDS the §21.8 ±3 swing cap —
> a meta-event override to flag), binding at `runPhase_2_4_3_Era` (`phaseRunners.ts:2796`);
> **(ii)** the **EconStab→Recession CASCADE** = 2 random industries −1 in EVERY state (seeded
> RNG) → an **EV-reflow roll** (couples to §11.5 industry-leadership + §28.9 census/EV) + a
> DomStab-drop chance + **EconStab-in-Recession gates other meters' gains**; **(iii)**
> **crisis-GATED bills** = a `Bill.requiresCrisis: 'economic'` flag (Fed-currency-in-crisis /
> worker-bailout INVALID until the crash fires — reuses E2's crisis-bypass primitive).
> **Couples to E2 (Bill.type) + E6 (EconStab/cascade).** **Verified UNBUILT:** `Era` is still
> the 4-value enum (`types.ts:1337`, no `progressive`); the ONLY economy token is the generic
> `meters.economic` (`types.ts:1401`) whose UI band strings already include
> `'Depression'…'Recession'…'Roaring'` (`Meter.tsx:15`) as COSMETIC labels; grep for
> `economicStability|greatDepression|requiresCrisis|requiresCrash` across `src/` returns ZERO.
> game-mechanics §29.7.1.
> **(2) ★ DH-67 — EVENT-GATE the era's BLUE party-modifier bias to the crash having fired
> (S; the CENTRAL #160 takeaway and the highest-value single fix in the batch) — build it
> WITH #160.** The era's party-preference bias is a **static era-band constant, DECOUPLED
> from the crash** — so the BLUE-favorable bias fired in the 1930 midterms WITH A HEALTHY
> ECONOMY (GA post-mortem ch18 POST 8: "these era bonuses are SUPER STRONG… the Depression
> wasn't nearly as bad"). The fix (Umbrella POST 545): read a `game.crashFired`-style flag
> set by the meta-event at the `partyPref*5` term in `calcStateVote`
> (`phaseRunners.ts:3709-3711`), NOT a static band constant. **This is the switch that turns
> the meta-event from cosmetic into load-bearing.** Verified UNBUILT (the bias is a static
> era-band constant today). game-mechanics §29.7.1(f).
> **(3) ★ CONFIRMATION AUTO-PASS GATE → folds into E16 / E9-handler-9d (S; Ted-authoritative)
> — a REAL fix for the §25.5 36%-pass CPU cabinet pathology.** `runPhase_2_3_1_Cabinet`
> (`phaseRunners.ts:2158-2223`) is a flat scored pick straight to `cabinet[seat] = pick.id`
> (`:2191`) — NO Senate vote, NO Controversial gate, NO skill threshold. Ted's RULING (POST
> 213-214, the ONE Ted-authored ruling this batch): ALL nominees AUTO-CONFIRM EXCEPT
> {State/Treasury/AG/Defense} OR Controversial OR <3 relevant skill (unless Integrity); an
> Iron-Fist Senate-Majority-Leader can force a vote on any. This fixes the `drums` §25.5
> pathology (only **36% of 88 nominees passed** — the CPU over-rejecting) by ensuring **most
> picks NEVER REACH A VOTE.** The `'Controversial'` trait exists (`types.ts:103`); the
> contested-pick path then routes through E9-handler-9d's CPU Senate vote. Verified UNBUILT.
> game-mechanics §25.5 + §30.9.
> **(4) ★ #161 ERA-BAND SIXTH START (1928) → K3/K4 CONFIDENCE boost, NO new scope.** A 1928
> start is the **6th independent start-year** confirmed for the K3/K4 era-content-band model
> (after 1772 / 1800 / 1820 / 1856 / 1948 / 2000). Bands key off `game.eraBand` + game-state/
> territory, NOT the calendar. Pure confidence — now 6-source. game-mechanics §27.1.
> **(5) ★ #162 DIPLOMACY → era-keyed nation list, EXTENDS E12/#107 (debt #39).** The
> diplomacy subsystem is exercised natively: a **7-nation 1928 roster** (UK, France, Spain,
> Germany, Russia/Soviet Union, China, Japan — **no Israel yet**, era-dependent) with
> per-nation relation meters + a cabinet-level Ambassador per nation. Folds into E12 as an
> ERA-KEYED nation list (5→6→7→8 by era, Japan in by 1928, Israel only at the modern
> boundary). **The #56-negative result is a SCOPING NOTE, not a build item:** the
> "Republicanism vs Fascism vs Communism" / looming-WWII framing is event-text FLAVOR — it
> did NOT trigger the war engine (#56) in the captured span. game-mechanics §13.3.1 + §24.7.
> **(6) ★ DH-66 IMPEACHMENT → PARKING LOT; now 3-THREAD-CONFIRMED BROKEN, await Ted's pending
> rewrite.** grep for `impeach` across `src/` returns ZERO — no impeachment subsystem at all.
> The "Improper SC Justice" event triggered a trial Jimmy + Ted **VOIDED mid-run** (POST
> 816-861) because the rules under-specify article generation / trial-firing / the
> Controversial-vs-<3-judicial inconsistency; **Ted drafted a rewrite that is NOT YET FINAL.**
> This is the THIRD thread to confirm the subsystem broken (DH-33 `rep1800` + DH-54 `nuke` +
> DH-66 `ideo1928`). Stays the **DH-54 author-before-build PARKING-LOT** item — do NOT build
> against the current rules. game-mechanics §24.1.1.
> **(7) ★ #165 / #166 → SHARED fixes, fold into existing work.** **#165** (EconStab /
> general-event effect-sign + `auto|roll` ambiguity — the "Major Earthquake +Rev/Budget that
> should COST money", POST 814-815) is the SAME fix as **DH-53** (structured, sign-audited
> effect tables with an explicit `auto|roll` flag) extended from bills to events — no
> standalone work (debt #40). **#166** (the per-faction "how many of my gov/sen/rep per
> lead-industry" AUTO-TALLY + per-era meter-table VERSIONING; the player-built "Industry test
> sheet" copied across playtests, POST 450-457) folds into the **economic-engine / industry-
> scoring work** (§11.5 + #51) — the build OWNS the tally (GM-burnout fuel otherwise, DH-36),
> debt #41. game-mechanics §29.7.1(g)/(h).
> **(8) ★ #163 / #164 → BOOT (DH-25 career-track family; mid-gov start-state still open).**
> The GA pre-placed randomized statesmen onto career tracks at game start (the Buttigieg
> "generational pols stuck at floor stats" problem, POST 32-41) — a GA house rule, NOT
> designer-authoritative; it joins the **DH-25 career-track-bootstrap PARKING LOT** (already
> blocks the modern scenario). The inaugural-cabinet-holdover question (POST 184-188:
> election-start vs president-in-place vs president-with-historical-cabinet) is the
> **unsettled mid-government start-state model** — folds into the K4 `BootSheet` start-state
> field; players favor president-in-place, but it is human-gated (debt #42). game-mechanics §26.1.
> **DECISION-GATED / PARKING-LOT COUNTS UNCHANGED (batch 18 nets 0):** no item enters or
> leaves the user/designer Decision-gated bucket; no new author-before-build item (DH-66
> STRENGTHENS the existing DH-54 impeachment item to 3-thread-confirmed). The confirmation
> auto-pass is a Ted RULING (ready-to-build, not gated). TWO open questions stay human-gated
> tuning (NOT blockers): (a) the crash SEVERITY — one-shot meter shock (trivially recovered
> in ~4 years) vs a persistent drag; (b) the mid-government start-state model. Both bind
> inside E4c / K4 (§30.9). **CORROBORATIONS (no re-order):** `ideo1928` tags appended to
> **#116/E4c** (economic engine, 2nd era), **#18/#51** (the 2-layer scorer ran LIVE at the
> 1932 Hoover-v-Roosevelt presidential general), **#92/#41** (era band, 6th start), **#107**
> (diplomacy, era-keyed roster), plus DH-27 (Claude Pepper Integrity+Controversial again) /
> DH-53 (effect-sign, now event-side via #165) / DH-36 (GM-burnout — the manual Industry
> sheet is the fuel #166 removes). **NO new keystone, NO re-sequence; top of queue UNCHANGED:
> QW0 → K0/K2 → K3/K4 + scenarioBoot → E1.**
>
> **★★★★★ Batch-17 version — FOUNDING-ERA CONFIDENCE + TWO NEW FOUNDING SUBSYSTEMS (NOT a
> re-sequence, NO new keystone, NO keystone moves, NO new author-before-build or
> Decision-gated items). The 4th captured 1772 thread — the KB's MOST-COVERED era — and
> the 3rd CPU-heavy source: `ted1772` (`13c1b720`, "I Think Something's The Matter With
> Ted — A 1772 Playthrough", 2404 posts, Ted-run [DESIGNER authority, same class as
> `tedchange`/`oopscpu`/`terror2000`], MOSTLY-CPU [6 CPU / 4 human], a fresh
> 1772→~1792 founding→federalism run, deliberately CORROBORATIVE (few NEW gaps, as
> briefed).** Batch 17 is the **4th independent 1772 source** AND the **3rd CPU-heavy
> source** → **HIGH corroboration confidence** on the founding-boot + the CPU suite + the
> war engine + the command-bootstrap. It does **NOT change the top-of-queue.** The
> headline value is **CONFIDENCE, not new scope:**
> **(1) ★★ #153 COMMAND-BOOTSTRAP → PROMOTED to build-with-confidence / ready (S).**
> 3-source canonical (`terror2000`·`tedchange`·`ted1772`) AND demonstrated **LIVE**: an
> emergent 1st President — **Arthur St. Clair, a CPU pol who booted at 0-Command /
> obscure / no celebrity and rose entirely through play.** The rookie `command: 0` boot
> is SHIPPED (`phaseRunners.ts:216`); **the UNBUILT, load-bearing half is the GLOBAL ×2
> Command-gain multiplier** (a `gainCommand(p, basePct)` helper applying ×2 at the
> leader-pick / charisma-event / military-victory grant sites — e.g. the Father-of-the-
> Constitution `command + 1` at `constitutionalConvention.ts:158,168` + the RevWar
> grants in `revolutionaryWar.ts`) + the held-tag guard in the expertise-grant path.
> **Sits on the draft/command path with NO keystone dependency — ready-to-build now**
> (already carried as QW18; this batch raises its confidence to canonical). game-mechanics
> §4.1.y. **(2) ★ #159 CONSTITUTIONAL-CONVENTION SUBSYSTEM → folds into the founding-boot
> / E1 surface (M–L, the LARGEST new build surface this batch), downstream of the
> keystones, EXTENDING the shipped `constitutionalConvention.ts` superset SKELETON.**
> Shipped today: 7 binding articles (`:6-77`), a single CPU-consensus auto-fill pass per
> article (`:81-100`), Father-of-the-Constitution = highest-PV delegate + 3 Federalist
> authors (`:147-182`), ratify at `approve >= 9` governors (`:185-192`), then
> `currentEra = 'federalism'` (`:196-212`), flat `s.electoralVotes = max(3, …)`
> (`:208-211`). **The new build surface (DESIGNED, unbuilt):** the two HIGHEST-VALUE
> extensions are **(i) the slave-compromise plank driving a per-state EV PENALTY**
> (slaves-don't-count → seceded-South EV penalty GA −5 / SC −5 / NC −3 / VA −3 — this is
> RevWar **floor 3**'s cousin, today stored as a no-consequence `slaveCompromise` string)
> and **(ii) the per-article propose → debate-sway → 2/3-of-states vote →
> eliminate-lowest-and-revote loop** (shipped does ONE auto-fill, not the elimination
> loop); then gov-sends-3-delegates (2 own + 1 opposition, ≥1 Legis), the random-egghead
> drafter (vs highest-PV "Father"), debate-sway by traited delegates, a threshold-amendable
> amendment plank (#100), and Judiciary-Act-sets-SCOTUS-count. game-mechanics §17.3.y.
> **(3) ★ #158 CPU-ANTI-GAME-OVER → build WITH the #155 war-balance pass (E3) + the #75
> CPU event-vote handler (E9); S.** The marquee `ted1772` solo-game-ender: a
> CPU-controlled terminal peace node (`triggersGameEnd`, `eraEvents1772.ts:300,309,430`)
> resolves through `pickAIResponse` (`eraGraph.ts:88-103`) by ordinary point-math, which
> leans FOR peace — there is **NO anti-game-over / anti-peace term.** Add an
> anti-game-over layer in `pickAIResponse` (or a wrapper at the `triggersGameEnd`
> decision): EITHER a flat **75%-oppose roll** on any response that sets
> `triggersGameEnd`/surrender, OR a points-based anti-peace ideology bias (human picks).
> **It is one of the three RevWar floors.** game-mechanics §13.2 + §25.7.
> **(4) ★★ THE THREE RevWar WINNABILITY FLOORS = a HARD, BOUNDED CONSTRAINT on the #155
> war-balance pass (already in E3).** When #155 adds the enemy-strength term + battle-size
> weighting + the Officer-Mil-share cap + per-theater scoring, it MUST preserve **floor
> (1) the French-alliance void-loss flag [SHIPPED — `revolutionaryWar.ts:268-270` sets
> `war.frenchAlliance`; the loss condition at `:259` voids once allied; preserve exactly],
> floor (2) the 2/3 peace-vote threshold [BUILD — terminal peace has NO vote gate today;
> in `ted1772` a 5-4 = 55.5% MAJORITY for peace FAILED only because of this threshold, so
> 55.5% must NOT pass], floor (3) #158's 75%-oppose override [BUILD].** A 1772 game with
> all three floors intact must stay WINNABLE — a war engine tuned hard enough to lose a
> 1772 game before 1788 WITH the floors is over-tuned (a RevWar loss is a game-over).
> game-mechanics §21.1 (the #155 HARD-CONSTRAINT block) + §17.4 + §23.3.
> **(5) FL-on-DEATH → IMMEDIATE replacement (fork RESOLVED) — shipped code still DEFERS;
> small standalone fix, S.** On a faction-leader's death,
> `cleanupLeadershipAndProtegeChains` (`phaseRunners.ts:2304-2312`) nulls `f.leaderId` +
> `leadershipStartYear` and **waits** for the next 2.2.3 sweep
> (`runPhase_2_2_3_FactionLeaders`, `phaseRunners.ts:1975-2009`). Ted reversed his own
> ruling LIVE: *"dead faction leaders are immediately replaced."* **The fix:** factor the
> 2.2.3 vacant-seat election body into `electFactionLeader(snap, f)` and call it at death
> time instead of deferring. game-mechanics §10.1 + §8.3.
> **(6) DH-65 FOUNDING DATASET BUGS → XS dataset audit, joins the #120 umbrella (E18d);
> the ENGINE exclusivity is ALREADY SHIPPED.** The Cosmopolitan ⊕ Provincial half is
> already engine-enforced (`TRAIT_CONFLICTS` `types.ts:675-676` + `addTrait`/`tryGrantTrait`;
> **0 both-held pairs in the 18,561-pol generated dataset** — the live forum both-held was
> a spreadsheet artifact). The REAL fix is the wrong-century / same-name collisions: a
> `scripts/seedDataset.mjs` `CURATED_ROWS` founding-window (1768-1776) same-name audit +
> a build-time validation gate in `legislatorsToDataset.mjs` (whose ±25-yr
> `ERA_SAME_PERSON_WINDOW` merge at `:276-302` does not validate the founding pool). Same
> class as DH-64's `Southern Unionist` fix. game-mechanics §4.1.z.
> **(7) CORROBORATIONS (no re-order):** `ted1772` tags appended to **#56/#133/#70/#72/#74/
> #76/DH-61/#86/#136** (founding-boot + the CPU suite + the war engine + the Continental/
> Confederation Congress — now 4th-1772 / 3rd-CPU corroborated; #74 got Ted's cleanest
> 4-step crisis→faction→team→opponent articulation; DH-61's NW-Indian-War "3 chances"
> origin directly confirmed). Marquee Ted rulings folded into topical homes: **FL-on-death
> → immediate** (above); **one-protégé-per-turn cap**; **conversion-target once-per-half-
> term**; **pre-12A VP = most-EV runner-up** (sharpens DH-62); manipulative-gov-self-
> appoint forfeits the Gov action; governor-industry-boost-needs-matching-expertise.
> **(8) DECISION-GATED / PARKING-LOT COUNTS UNCHANGED (batch 17 nets 0):** no item enters
> or leaves the user/designer Decision-gated bucket; no new author-before-build item. TWO
> FORKS RESOLVE OUT (both were open, now ruled, neither was a Decision-gated bucket item):
> **FL-on-death → immediate** and **#153 expertise/Command rules → 3-source canonical /
> build-with-confidence.** **NO new keystone, NO re-sequence. The TOP OF THE QUEUE is
> UNCHANGED: QW0 (cap=4 + alt-state guard, ship FIRST) → K0/K2 → K3/K4 +
> `scenarioBoot`/`BootSheet` → `scenario1788` (E1). #159 folds into the founding-boot/E1
> surface (NOT a keystone); #158 builds with #155 inside E3.**
>
> **★★★★★ Batch-16 version — RECONSTRUCTION SOLO-BLOCKER GETS ITS DESIGNED FIX (NOT a
> re-sequence, NO new keystone, NO keystone moves, NO new author-before-build or
> Decision-gated items). The SEPARATE EARLIER 1856-start run + the FIRST Civil-War→
> Reconstruction arc played with HUMANS ON BOTH SIDES of the Reconstruction
> tug-of-war: `hd1` (`c015a0cb`, "A House Divided" PART 1, 2699 posts, GM
> @matthewyoung123, designer @vcczar + @MrPotatoTed rule in-thread), an 1856→1868
> alt-history (Chase president / Lincoln VP; secession 1860-61 off a bungled
> John-Brown's-Raid decision; CSA president Herschel V. Johnson, Davis only War
> Secretary; Union wins late 1864; ends the Era of Nationalism at 1868, then RESTARTS
> as a fresh 1856 sim with vcczar's REVISED Reconstruction rules).** Batch 16 is the
> **3rd Civil-War run** and the **5th antebellum source** → **HIGH corroboration
> confidence** on the war/Reconstruction/secession cluster (#56/#57/#58/#59). It does
> **NOT change the top-of-queue.** The headline value:
> **(1) ★★ #156 4-PLAN RECONSTRUCTION MODEL → the CANONICAL DH-29 FIX; RE-SCOPES E3b's
> (d) readmission half as its DEFINITION-OF-DONE (M–L).** vcczar's authoritative
> rewrite at the `hd1` restart (POST 2680-2687, 2692-2694) is the **direct fix for the
> long-named antebellum/CW solo-blocker DH-29** — now a **designed fix in hand**, not
> an open blocker: `game.reconstruction = { plan, adoptedBy, startYear }` + **FOUR plan
> types (No-plan / Ten-Percent / Ironclad-Wade-Davis / Military-district) available on
> BOTH the President AND Congress** + **★ the deadlock-breaking PREREQUISITE: ALL
> Southern readmissions require "a plan adopted by Congress OR by the President" — so
> the President can UNILATERALLY adopt one** (individual per-state readmission only
> under Ironclad/Military-district; No-plan / 10% = states just come back) + the **+2
> Deep-South / +1 other-seceded incumbent-party bias** keyed to active Reconstruction
> (15th-Amendment effect; sunsets at end) + pardon tiers on both branches + the
> CSA-victory remove-and-reintegrate branch. **It REMOVES the K5 / E9-handler-#2
> soft-dependency for the SOLO case** (the player-President adopts a plan directly via
> the exec path — no CPU vote needed). **Verified entirely UNBUILT** (0 Reconstruction
> hits in `types.ts`). **(2) ★ #155 WAR-BALANCE PASS → EXTENDS the war engine (E3 /
> #56/#152), M.** Both human players AND the GA flagged "Union wins too easily" (`hd1`
> POST 1000-1004) → add an **enemy-strength term** (via `rng.ts` — also closing the
> `phaseRunners.ts:3603` `Math.random` determinism leak) + **battle-size weighting**
> (Bull Run small vs Gettysburg large) + an **Officer-Mil-share CAP** (a 5-Mil officer
> currently swamps every other term) + **per-theater scoring** (adopted LIVE), and
> resolve the cross-run open Qs — **war-end multiplier 1.0-vs-0.5** (0.5 adopted LIVE),
> **naval hard-gate-vs-continue-roll**, **permanent-vs-one-term war-hero bonus**.
> **BOUNDED by the 1772-Rev-War-must-stay-winnable constraint** (a RevWar loss is a
> game-over, POST 1004 — don't over-harden); **pairs with #152** (the war-defeat
> package). **(3) #157 CSA-GOVERNMENT SEEDING → folds into the #58 secession+war epic
> (E3b sub-PR a), S.** The rules define only CSA Pres/VP/Sr-General; the GM improvised
> the whole Confederate cabinet + generals/admirals "for flavor" (POST 893, 912) → seed
> a full CSA government from seceded Command/Military pols so the CSA-victory branch has
> a real opposing government. **Depends on the per-pol Southern-Unionist gate.**
> **(4) DH-64 `Southern Unionist` TRAIT MISLABEL → joins the #120 dataset umbrella
> (E18d), XS.** Many Southern-state draftees were Union officers who settled South,
> Black Republicans (Robert Smalls), or Northern-residing Southerners — none flagged
> Unionist, so they'd wrongly auto-join the Secessionists (POST 1446, 2682). A
> `scripts/seedDataset.mjs` `CURATED_ROWS` audit (esp. VA/MS/FL + all Black
> Republicans), the INVERSE of #121's Secessionist add. **(5) ★★ DH-29 REFRAMED from
> CPU-only to STRUCTURAL deadlock — and its fix is DESIGNED-IN-HAND.** `hd1` proves the
> blocker is **deeper than a CPU artifact**: with HUMANS on both sides (Southern-Dem
> 10%-plan vs Radical-Rep Ironclad/Mass-Trials) the choice **STILL deadlocked — neither
> plan passed and states drifted back with NO plan at all** (POST 2678). The structural
> deadlock is **fixed by #156's unilateral-adopt** prerequisite. E3b becomes **more
> attractive / less risky** (its hardest question is answered) but stays **downstream of
> the keystones**. **(6) CORROBORATIONS (no re-order):** `hd1` tags appended to
> **#56/#57/#58/#59** (war/Reconstruction/secession/free-slave cluster — now 3rd-CW-run
> / 5th-antebellum corroborated), plus the deepest per-battle spec from a 4th CW run
> (#56) and the EXACT §59 free/slave penalty package. **(7) DECISION-GATED / PARKING-LOT
> COUNTS UNCHANGED (batch 16 nets 0):** no item enters or leaves the user/designer
> Decision-gated bucket; no new author-before-build item. **DH-29 was a DEBT item, now
> with a designed fix (#156); #156/#155/#157 are buildable; DH-64 is dataset.** **NO new
> keystone, NO re-sequence. The TOP OF THE QUEUE is UNCHANGED: QW0 (cap=4 + alt-state
> guard, ship FIRST) → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788`
> (E1). #156 is the highest-value Reconstruction target inside E3b, NOT a keystone.**
>
> **★★★★★ Batch-15 version — MODERN-ENGINE MID-TIER WINS (NOT a re-sequence, NO new
> keystone). The FIRST NATIVE 2000-start campaign + the FIRST PROVEN GAME-OVER/LOSS
> STATE in the corpus: `terror2000` (`3843d2da`, "Era of Terror 2000", 3566 posts,
> Ted-run, CPU-heavy, runs ~2000→~2010, ENDS on the first game-ending event ever).**
> Batch 15 is the **4th Ted-run / CPU-heavy source** (corroborates the E9 suite) and
> the **2nd modern-era native run** (after `nuke`'s 1948 start). It does **NOT change
> the top-of-queue** — it **PROMOTES one Decision-gated fork to ready-to-build, adds
> one small end-condition module, extends two epics, and re-scopes E16 a THIRD time**,
> all mid-/near-tier modern-engine work, not keystones. The headline value:
> **(1) ★ #18 CANONICAL ELECTION SCORER → PROMOTED to ready-to-build (S–M) and LEAVES
> the Decision-gated bucket.** The meter→election STATE-SCOPE fork — open since batch
> 10 — is **SETTLED to V's 2-layer model** (Ted, the DESIGNER, reversed his OWN "every
> state" reading to V's 2022 intent, `terror2000` POST 913-926): **(a) a UNIVERSAL
> per-ideology meter modifier applied FLAT to ALL candidates of that ideology, BOTH
> parties, in primary AND general** (e.g. Rev-Budget→Lib +1/Trad −1; Honest-Gov→LW/RW-
> Pop −2/Prog −1; QoL→Cons/Trad +1; Planet→RW-Pop +1/Prog −1), **(b) per-ideology
> ENTHUSIASM as a SEPARATE per-party (per-state-bias) layer on top** (±3-capped). It
> **binds at `calcStateVote` (`phaseRunners.ts:3709-3711`)** — which today applies
> enthusiasm UNIFORMLY with no per-state penalty — and **composes with the #51
> reshuffle algorithm (E23) + the QW3 ±3 cap.** **It STRIKES from Decision-gated**
> (was: #18 state-scope, user-gated). **(2) ★ #88 AUTOCRATIC-COUP TERMINAL → NEW small
> end-condition module (S), built WITH the APOCALYPSE clock as ONE meter-driven
> endgame module inside E6.** The **FIRST proven game-over/LOSS state in the KB** — the
> "Autocratic Coup Ends America" end-condition **FIRED LIVE and ENDED the game** (the
> dystopian "Rockefeather coup," `terror2000` POST 827/829), gated on **Honest-Gov at
> its FLOOR → ~20%/event-phase roll** "after just barely missing it in multiple prior
> phases." Build the **meter-driven per-event-phase game-end roll** over the existing
> `triggersGameEnd` surface (event-only today, `phaseRunners.ts:2871`; terminal
> `GameOverScreen` already exists) — the **HonestGov-gated Autocratic Coup is the
> live/worth-building path** (the MilPrep/EconStab coup gates stay the trivially-maxed
> ones). Reachable in the modern era. **(3) ★ #152 WAR-DEFEAT → EXTENDS the generic war
> engine (E3 / #56/#106), M within E3; completes DH-47.** `terror2000`'s **War on
> Terror is formally LOST** ~2005 + the **War in Afghanistan runs to "Phase II"** —
> the first proof wars resolve in DEFEAT (and across multiple half-terms), not only
> victory or stall. Add the defeat **loss package** (officers −1 Mil + −1 ALL-future-
> elections; **President −1 ALL-future-elections**; Party-Pref crater, capped if
> maxed) + **multi-phase wars** (naval→ground; Invasion→Counter-Terrorism Phase I/II
> carry-roll). The shipped resolver (`phaseRunners.ts:3615-3620`) ends at warScore but
> applies NO loss package; **the President-loss term couples into the #18 scorer.**
> **(4) ★ CABINET CLUSTER #124+#151 → RE-SCOPE E16 a THIRD time (M + S), lands after
> K2+K5.** Bundle the confirmation system + lobby→POINTS + the **3-state enthusiasm
> channel** (upset/fine/happy, ±3-cap, **one-roll-per-faction**: 0 wanted posts → drop,
> 1 → neutral, ≥2 → rise; #124 re-tuned LIVE) + the **#151 −500/slighted-same-party-
> faction FAIRNESS penalty** (Ted-RULED, fired twice on Bush + Oprah, `terror2000` POST
> 1280) + a diversity check; all **Era-of-Terror-gated** (an era-BAND rule delta — the
> band changes rules, not just content). **#124's designer-gated NUMERIC percentages
> are now LARGELY RESOLVED by the live 3-state tuning** → they STRIKE from Decision-
> gated. **(5) #153 (XS) + #154 (S).** **#153** (rookies enter at 0 Command + every
> Command-gain % DOUBLED + no-reroll-on-held-expertise, made official, `terror2000`
> POST 91-93) → a draft/Command-consistency XS quick-win (**QW18**); the 0-Command
> rookie + no-reroll-on-held-expertise are already invariants, the **×2 Command-gain is
> the UNBUILT half.** **#154** (the canonical 4-step elected-seat vacancy-fill ladder:
> same-party-CT → same-party-unemployed → other-party-CT → other-party-unemployed,
> `terror2000` POST 469-480) → the **#115a/#115b appointment-ladder family** (in
> K4/E16, pairs with E10b succession #61); **one ordering convention (the CT-vs-other-
> party-unemployed swap) is a build-target dial.** **(6) DECISION-GATED RECOUNT −2** —
> **#18 state-scope resolves OUT (user-gated 3→2)** + **#124-percentages resolves OUT
> (designer-gated, the B8+B9 #124-numeric gate, 11→10 logical items / 9 bullets remain
> via the live 3-state tuning).** **(7) CORROBORATIONS from a native 2000-start (no new
> rows)** — `terror2000` tags appended to **#113** (Era-of-Terror content band: 9/11
> fires verbatim → War on Terror via the generic naval→ground engine), **#56/#106**
> (the success-chance formula + naval→ground gating + per-theater carry-roll confirmed
> natively), **#85/#130** (death/retirement schedule), **#90/#92** (era-gated content +
> "earn it forward"), **#1/#102/#135/#143/DH-25** (the modern cluster), and the **E9
> CPU suite** (4th Ted-run / CPU-heavy source). **NO new keystone, NO re-sequence, NO
> new author-before-build items. The TOP OF THE QUEUE is UNCHANGED: QW0 (cap=4 + alt-
> state guard, ship FIRST) → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788`
> (E1). #18 + #88 are attractive mid-tier modern-engine wins, NOT keystones.**
>
> **★★★★ Batch-14 version — DOWNSTREAM GILDED-ERA CONTENT (NOT a re-sequence, NO new
> keystone). The FIRST dedicated native-1868 Gilded-Age campaign + the LARGEST thread
> in the KB: `gild1868` (`bf590684`, "1868 The Gilded Age", **6318 posts**, runs
> 1868→~1886, dies in GM burnout).** Batch 14 does **NOT change the top-of-queue** —
> it is **downstream era-content that lands AFTER the era model + the economic engine
> + the bill-relationship graph + Reconstruction.** `gild1868` is the richest single
> record of the Gilded-Age issue engine actually being PLAYED (tariff %, currency
> regime, civil-service, trusts, the 20-yr Reconstruction regime, AfAm
> enfranchisement, imperialism) — but **the Gilded Age is UNBUILT** (`Era =
> 'independence'|'federalism'|'nationalism'|'modern'` `types.ts:1337`, no `gilded`;
> only `scenario1772.ts`/`scenario1856.ts`; the era is hand-run on `modern` tuning,
> gap #41), so the thread is **almost entirely the unbuilt design.** The headline
> value is **(1) ONE NEW "gilded-era content" epic (EG)** — the five batch-14 deltas
> **#147–#150 + DH-63** are NOT five backlog rows; they are **ONE downstream era unit**
> gated on **K3/K4 (the era-content-band model) + #116/E4c (the economic engine) + #42
> (the bill-relationship graph) + #57/E3b (Reconstruction)** (§9.1.10, BINDING):
> **#147** tariff-as-%-rate (`game.tariffRate`) + the mutually-exclusive
> `MonetaryRegime = 'gold'|'bimetallic'|'freeSilver'|'nationalBank'` enum, replacing
> the ±0.5 flavor bill at `phaseRunners.ts:3421` (**M**, on #116/E4c + #42); **#149**
> civil-service merit-vs-spoils axis + State-Gov-Jobs spoils lever + era-gated reform
> content (**S–M**, on K3/K4); **#150** the "1872 Rule" disorganized-loser special-
> election branch (**S**, niche; pairs with #57/#148 + #48); **DH-63** currency-regime
> exclusivity **FOLDS INTO #42 + #147's MonetaryRegime** (the mutual-exclusion
> constraint those two already build — **XS–S, no standalone row**); **(2) #148
> EXTENDS the existing #57/E3b Reconstruction epic** (it does NOT open a new epic): the
> 20-yr auto-expiring Reconstruction timer (`game.reconstruction={startYear,endsYear}`,
> begins 1864, auto-ends ~1884 "to prevent a one-party state") + seceded-state seats
> APPOINTED by Speaker-faction (Reps) / PPT-faction (Senators) / majority-party Pres
> (military Govs) + a +2-RED bias-while-active that SUNSETS to a Blue Solid South at
> expiry (FL/GA/LA Blue+3→+5, VA Blue+2→+5, POST 5145) + per-state early end by
> repeal-bill — **S–M within E3b, inherits the DH-29 solo-blocker** (Strict/Ironclad
> never passes with CPU → resolve before any antebellum/CW/Reconstruction scenario,
> incl. a Gilded boot that turns the timer on, ships solo); **(3) #41 STRENGTHENED —
> `gild1868` is now its FULL NATIVE SPEC** for the dedicated `gilded` era +
> `scenario1868`: the red/blue-FLIPPED faction roster (**RED = Republicans**, **BLUE =
> Democrats** by 1868 — the OPPOSITE of the founding-era frame, `gild1868` POST 6 — so
> the era-content-band model must carry party-label-by-era), the Gilded nickname table
> (Stalwart/Half-Breed/Mugwump/Bourbon/Readjuster…), the era-event spine (Philippines-
> from-Spain, women's-suffrage A/B, census EV deltas, Labor Unions/RJ Reynolds/Twain/
> Nast/steamships), the bill catalog (tariff-rate/currency-regime/civil-service/ICC/
> statehood), the SCOTUS docket (Elk v Wilkins, Allgeyer v Louisiana), and the 20-yr
> Reconstruction timer — **`scenario1868` is "another scenario-as-data-row" once the
> BootSheet pipeline + content-band era model land, AFTER `scenario1788` (E1) + a
> mature `advanceEra`** (strengthen the existing E22/#41 home — do NOT build a bespoke
> Gilded code path; it is K4 content); **(4) CORROBORATIONS from a native start (no new
> rows)** — `gild1868 (b14)` tags appended to **#13** (convention delegate-
> apportionment), **#14** (5-plank platform incl. a Presidential-Action plank), **#15**
> (9-item VP rubric), **#52** (named-Justice SCOTUS docket + 10-yr drift + court-size
> bill), **#39** (amendment lifecycle), **#21** (extensible state-flag registry),
> **#42** (spending cap), **#3/#5/#6** (the Gilded content cluster); **(5) the 3rd
> GM-BURNOUT DEATH** (`gild1868`, after `new1772`/`dem1820`) — the spreadsheet
> legislative phase is the hardest to run by hand (POST 868) — **reinforces the
> automation-reduces-upkeep argument** behind the CPU suite (K5/E9) + #19/#20; **cite
> it in the justification, NOT a row.** **NO new keystone, NO re-sequence, NO new
> author-before-build or decision-gated items. The TOP OF THE QUEUE is UNCHANGED: QW0
> (cap=4 + alt-state guard, ship FIRST) → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` →
> `scenario1788` (E1). The gilded-content epic (EG) is downstream — it consumes
> K3/K4 + #116/E4c + #42 + #57/E3b.**
>
> **★★★ Batch-13 version — E9 DE-RISK (NOT a re-sequence). The SECOND all-CPU run +
> the FIRST deliberate CPU-ruleset interrogation: `oopscpu` (`699113d6`, "Oops, All
> CPUs", Ted-run all-CPU 1788 stress-test, 350 posts).** Batch 13 does **NOT change
> the K5/E9 build ORDER — it DE-RISKS E9** by field-validating the handler specs
> before they're built. Ted ran every faction on the CPU rules and stopped, live, at
> each spot the rules are vague/contradictory/impossible-without-human-judgment. The
> headline value is **(1) SIX E9 HANDLERS GO FROM "DESIGNED" TO "DESIGNED +
> FIELD-VALIDATED"** — handlers **#70 (9c leadership) / #72 (9a candidate + 9m VP) /
> #73 (9d cabinet) / #74 (9b legislation) / #75 (9g event) / #76 (9f conversion)**
> are now spec-complete with concrete failure modes + Ted's fixes (a build-confidence
> bump, NOT new rows); **9e (convention, #71) is the ONE handler NOT validated** (1788
> predates conventions → stays `drums`-spec-only, lower confidence; needs a post-12A
> all-CPU run to validate); **(2) the OC-1…OC-8 sub-gaps FOLD INTO the existing
> handler rows as sub-rules** — **★ OC-3 → handler 9b (legislation): the
> HIGHEST-PRIORITY, BALANCE-CRITICAL sub-rule** (an ideology-floor gate + a
> secession/slavery-active check so CPUs don't AYE crisis bills that betray their own
> ideology cards — the all-CPU run abolished slavery peacefully by 1792 with no
> secession); **OC-2 → handler 9c (leadership)** (ONE canonical
> `chamberControl(snap, chamber)` helper shared by leadership-select + the
> ≥60%-chamber proposer gate — fixes the minority-chairs-propose collision bug);
> **OC-1 + OC-5 → handler 9d (cabinet)** (scandal-resignee re-appointment cooldown
> [OC-1, ties DH-22 / handler 9l] + court-as-firing-precedent gate [OC-5]); **OC-6 →
> the kingmaker handler** (highest Com+Leg+Gov tiebreak for kingmaker→protégé
> pairing); **#72 sharpen on 9a/9m** (VP-retention HARD rule + the pre-12A nomination
> trio); **(3) #143 post-election Command decay (XS, RULED)** — 40% / −1 Command for
> non-Pres/VP candidates per presidential cycle, binds at `runPhase_2_10_End`
> (`phaseRunners.ts:4171`) gated on `isPresidentialYear` → joins the QW0 / XS
> consistency quick-win cluster as **QW17**; **(4) #61 death-branch RE-SCOPES E10b
> further (S)** — VP-inherits-on-DEATH = FULL President (refuses "Acting", no
> action-divert roll), NOT auto party/faction leader → re-run the leadership IRV;
> the "acting"/action-divert read is retained ONLY for the incapacity branch
> (Ted-RULED `oopscpu#POST 324-329`, SUPERSEDES the batch-11 `arkzag` read for the
> death case); **(5) DH-61 (S) + DH-62 (M) are `scenario1788` (E1) PREREQUISITES —
> NEITHER is optional for a 1788 boot:** **DH-61** = scenario-boot must seed
> era-active wars (they forgot the 1788 Northwest Indian War) → a
> `BootSheet.activeWars` field + a boot hook (folds into K4 / the `scenarioBoot`
> pipeline); **DH-62** = the pre-12A two-vote/no-ticket Electoral-College mode +
> same-state-EV exclusion → an era-keyed election-mode variant in the per-state-EC
> epic (E4); both wire as explicit deps on the E1 row; **(6) NEW designer-gated
> items → 11:** **OC-4** (off-ideology CPU draft gate — Ted wants "a better third
> way") + **OC-8** (define "office" + rewrite the Scandalous-Non-Office-Holder
> event) join the **designer-gated** sub-bucket (was 9 after batch 12 → now 11; OC-4
> and OC-8 are OPEN, NOT ready-to-build until Ted/vcczar closes them); **(7) the
> ALL-CPU-TEST is now a recommended REPEATABLE SPEC-VALIDATION METHODOLOGY** — it
> validated 6 handlers BEFORE they're built and is immune to GM-burnout (DH-36);
> **recommend a post-12A all-CPU run before building the convention handler #71 / 9e**
> (a methodology note, NOT a build row); **(8) corroborations** (no new rows): #70–#78
> field-validated from a founding angle; **#52 resolved for the all-CPU case** (CPU
> SCOTUS by ideology-distance — player-vs-CPU stays user-gated); **#76 4th-thread
> ideology-circle confirmation** (LW↔RW-Pop 25% cross-step); **#144 (pre-12A
> nomination trio) / #145 (OC-7 help-allies gov term-config) / #146 (procedural
> rulings)** slot into their topical homes. **NO new keystone, NO re-sequence. The TOP
> OF THE QUEUE is UNCHANGED: QW0 (cap=4 + alt-state guard, ship FIRST) → K0/K2 →
> K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) — but E1 now carries the
> DH-61 + DH-62 prerequisites, and #143 joins the XS quick-win cluster as QW17.**
>
> **★★★★★ Batch-12 version — DESIGNER-RULINGS INTEGRATION + QW0 FULLY CLOSES + ONE
> M-rework + 19 sized rulings slotted (NO re-sequence, NO new keystone, NO keystone
> moves). The FIRST DISCUSSION-THREAD INGEST in the corpus — two distinct discussion
> threads, not playtests: `smallbugs` (`cf82a7d3`, the community-curated 3-yr+ rolling
> bug + ruling catalog, 804 posts) + `tedchange` (`a0f0bf04`, Ted's official rules-doc
> rewrite/cleanup channel, 408 posts — the HIGHEST-AUTHORITY rules source in the
> corpus).** Batch 12 is **NOT a playtest**; it is the **DESIGNER's official rules-doc
> patches** (Ted in `tedchange`, vcczar in `smallbugs`'s nested rulings), so most
> findings **SUPERSEDE prior GA calls where they conflict** (authority hierarchy is
> now explicit: **Ted/vcczar > GA > inference**, game-mechanics §30.4). The headline
> value is **(1) QW0 FULLY CLOSES** (the relocation cap is now ruled `4` + alt-state
> exemption, `smallbugs#POST 734-735` vcczar-12-30-25, → **QW0 promoted from "open-
> design / build" to "ready-to-ship FIRST"**); **(2) ONE M-sized re-architecture lands
> as a TEARDOWN of E16** (#124 cabinet→enthusiasm rework: lobby satisfaction now
> writes POINTS to `Faction.score`, ideology composition drives enthusiasm via the
> ±3-cap clamp — **re-scope E16 to BUILD confirmation + #124 rework TOGETHER from day
> one, sized M (was XS-S); numeric percentages stay designer-gated**); **(3) 19 sized
> Ted-rulings slot into existing epics** — **12 XS** (#135 50/50 House inverse-control
> one-liner at `phaseRunners.ts:1864`, #136 no-Command in random-skill draft, #137 no
> cross-party draft `partyId` gate, #138 3 traits + 3 alt-states, #139 Pres signature
> step in 2.6, #141 FL trait gain 5%+/3%-, #142 CPU CJ ladder, #131 Integrity-can't-
> nominate-Controversial, #132 Challenge-Legislation-can't-target-REPEAL), **5 S**
> (#126 Pres 2-step Admin-then-Command blunder rule → E29; #127 ideology-shift /
> conversion schedule → E5b; #128 Kingmaker / Master Kingmaker scope → E20; #129
> Kingmaker→Protégé trait allowlist → E21 / Phase-1 #21; #130 death/retirement
> schedule + Hale + Frail-first → Phase-1 #19; #133 1st/2nd CC composition rewrite →
> E17; #140 AnytimeEvo target-pool tightening → Phase-1 #19 / E9 handler 9g), and
> **3 M** (#124 cabinet enthusiasm rework → E16; #134 Lingering 7-step strict
> ordering + tax/tariff carry-forward → Phase-1 #6 / E6; #120 `smallbugs` dataset
> umbrella → ONE coordinated `scripts/seedDataset.mjs` `CURATED_ROWS` pass, ~100
> items, also covers DH-43/DH-51/DH-28); **(4) BUILD-TARGET SIMPLIFICATION on E5/E25
> — Amendments NOT SCOTUS-challengeable** (`smallbugs#POST 250-269` vcczar OVERRIDES
> `tea1772` #100): **drop the SCOTUS-overturns-amendment branch from both E5 and E25
> scope** (keep E5's strike-a-statute + mutable-threshold; keep E25's docket + Justice
> drift + DH-32 state-guard); **(5) NEW Decision-gated SUB-BUCKET: designer-gated**
> (the existing user-gated bucket holds the human-design picks; the NEW designer-gated
> bucket holds the **9 open `tedchange` items** waiting on Ted/vcczar to close —
> Mil-Prep meter level 4 fix, **#125 Universal Election Modifier UEM**, Crisis trait
> consolidation, term-limit Gov actions in pre-Senate era, faithless-elector
> rewording, party rename trigger PL-vs-EraEvo, VP-must-be-same-party-on-resignation
> relaxation, cabinet enthusiasm percentages (the #124 numeric), cabinet ideology
> weighting Big-4-vs-rest-vs-cabinet-level); **(6) STRENGTHENINGS** (no new rows):
> **#76 CPU conversion adjacency** EXTENDED via `tedchange` (same-party can target
> same OR ADJACENT ideology); **#99 ideology=circle** now **TED-AUTHORITATIVE** (the
> 3-thread corroboration → designer-ruled; 25% LW↔RW rate pinned; auto-Two-Faced
> grant); **#67 Lingering bank ordering** = the strict 7-step + carry-forward NOW
> RULED → #134; **#100 Gov-requested SCOTUS review of amendments** OVERRIDDEN — mark
> superseded in the build-target; **(7) NEW gaps:** **#121** Secessionist trait
> missing from politicians dataset (XS — dataset + a one-row `Trait` union addition,
> folds into the #120 umbrella + the secession trigger #58); **#122** pardon mechanics
> entirely unspecified → **designer-gated open** (parking lot); **#123** small late-
> modern content bundle (Wyoming Rule → Real House Act 585-cap, runoff-amendment,
> Senate-Abolish-amendment) → folds into the modern-content row / Phase-2 #28 / #30.
> **The TOP OF THE QUEUE is now: QW0 (constant=4 + alt-state guard, ship FIRST) →
> K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) …**
>
> **Batch-11 version — LATE-GAME-SYSTEM PLACEMENTS + one fork RESOLVED (NO
> re-sequence, NO new keystone, NO keystone moves). The first FULL-ARC 1820→1840
> continuation (`arkzag`, "Ark and Zags — The Era of Democracy", 152c2881, 2531
> posts) — the direct continuation of batch-10's `dem1820` 1820 save, run all the way
> to 1840.** Batch 11 is the thread that finally **exercised the LATE-GAME systems
> batch 10 never reached** (multi-cycle presidential elections, the Bank-War economic
> arc, amendment machinery, presidential assassination+succession) — so it is
> **placement + one fork-resolution, not a re-sequence**: (1) **★ #116 economic engine
> → NEW small epic `E4c`** (the Jacksonian Bank-War → Independent-Treasury long-run
> content **state machine**), placed **AFTER E2 + E6 + E4b(b)** — it sits on top of
> E4b(b)'s §27.6 Second-Bank institution (the Bank it recharters/replaces), needs E2's
> `Bill.type`/crisis-bypass, and needs E6's named EconStab meter + crisis/cascade.
> Build it **EMERGENT, not scripted** — recurring CRISIS bills resolving an EconStab
> CRISIS via a `Bill.replaces` field + a per-bill-class `lockedUntilYear` tariff
> cooldown (carry "scripted-vs-emergent" as a design note, not a blocker). Verified
> UNBUILT: `applyEffect` (`phaseRunners.ts:3209`) only nudges 7 meters; `Legislation`
> (`types.ts:1506`) has no `type`/`replaces`/`lockedUntilYear`. (2) **★ #119 amendment
> lifecycle → RE-SCOPES existing E5** (NOT a new epic): adds the explicit lifecycle
> state (propose→committee→floor→**governor-ratify**→active), the **active-amendment-
> blocks-a-legislation-class** hook (the proactive face of E5's existing *Pollock*
> gate), and the **un-bundleable** flag. Verified UNBUILT: no `amendments` field in
> `GameState`. (3) **★ #61 succession chain → RE-SCOPES existing E10b** (NOT a new
> epic): adds VP-succeeds-on-death → fill-VP (gated on E5's VP-vacancy amendment being
> `active`) → acting-president action-divert roll + trait-acquisition side-effect.
> NOTE the **kill trigger already SHIPS** (`assassination-killed` anytime event
> `anytimeEvents.ts:232` fires `{kind:'death'}`; death sets `presidentId=null` via
> `vacateOffice` `phaseRunners.ts:2449`) — the **succession ENGINE is the work**; the
> **line-of-succession/impeachment half stays parking-lot (DH-54)**. (4) **★ #51
> PROMOTED — now SETTLED** (the `arkzag` final chunk published the `drums` **4-step
> enthusiasm-reshuffle** verbatim, MATCHING `drums`, NOT Ted's "every state" nor
> Matt's "primaries-only"): the **4-step reshuffle + −100/waiver rule → E23, now
> `ready`**; the **±3 cap is UNCONDITIONALLY ready** (binds at `calcStateVote`
> `:3709-3711`, ships with E6). **Only the #18 state-scope sub-question stays a human
> decision-gate** — #51's "fork" entry LEAVES Decision-gated; **only #18 remains
> there.** (5) **★ NEW delegate-class fork → Decision-gated** (AI-allocator-by-EV-
> formula vs player-rigged): a human pick **before E10's delegate-apportionment
> sub-PR** (+ E24's primary apportionment), but does NOT block the rest of E10. (6)
> **Bugs:** **DH-59 (XS)** folds into **E12** when the 9-point relations scale is
> built (no standalone patch; today it clamps −5..5 at `applyEffect:3223`); **DH-60
> (S)** = the concrete face of #92 territory-gating → a **`requires?: Predicate` on the
> era-event row + a firing-path filter** = the **same surface as BUG-1 + K3's
> `territoryOwned`**, so **build with E15 + BUG-1** (`buildEraEventsForYear`
> `eraEvents1856.ts:4` gates only by year; `EraEvent` `types.ts:1466` has no
> precondition field). (7) **#115 scenario-boot priority UNCHANGED** (re-confirmed by
> the continuation-boot; stays at the front of the subsystem queue, §9.1.9). (8) **★★
> Meta-signal FLIPS POSITIVE:** no GA-burnout this time (heavy GA scripting absorbed
> the upkeep) — now a **3-thread signal** (2 burnout deaths + 1 survived-by-scripting)
> that STRENGTHENS the automation-reduces-upkeep argument behind E9/#55/#115. Cite it
> in the justification; NOT a row. **Corroborations** (multi-campaign tags, not new
> rows): #11 crisis scoring, #13 convention machinery, #44 elector method, #92 era/
> territory content-gating, #111 convention machinery, #52 SCOTUS docket. **Order is
> UNCHANGED: build top-to-bottom. The top of the queue is QW0 → K0/K2 → K3/K4 +
> `scenarioBoot`/`BootSheet` → `scenario1788` (E1) …**
>
> **Batch-10 version — SCENARIO-BOOT PROMOTION + decision-gating + small placements
> (NO re-sequence, NO new keystone). The first 1820-START gap-fill (`dem1820`,
> "1820 — The Era of Democracy", 947 posts, GA-burnout-killed at ~1822-23).**
> Batch 10 absorbed `dem1820` — a **NEW 1820 scenario start** (Monroe's 2nd term /
> late Era-of-Good-Feelings → Jacksonian "Era of Democracy"), 10-human MP with the
> **1788/1800 polarity** (BLUE = Dem-Republicans, RED = Federalists/National-
> Republicans, NOT the 1856 flip). It is a **short, corroboration-rich** thread
> (one new gap, #115) whose headline value is **PROMOTING the scenario-boot pipeline
> to the front of the subsystem queue** + **decision-gating two forks the build
> cannot pick on its own:** (1) **★ #115 scenario-boot PROMOTED to the front of the
> subsystem queue — but it is NOT a new keystone; it FOLDS into K4's `BootSheet`
> schema.** The single most build-relevant finding is that **there are NO documented
> rules for CREATING a game** — GA setup is improvised (a contested undocumented
> "strip Command from ≤40 boot pols w/o a job" house rule; the inaugural career-track
> seed from the **last-3 draft classes**; era-keyed industry init; Senate-class
> assignment; vacant-seat appointment-fill). The build's **shared
> `scenarioBoot(BootSheet)` pipeline** must canonicalize this. **Dependency order:
> K0 (seed boot rolls) → `scenarioBoot` + `BootSheet` (built WITH K4) → every
> scenario becomes a data row** — and it must be built **WITH the first new scenario
> (Phase-1 #1 / `scenario1788`), before the third hand-authored copy-paste** of a
> scenario. It is also the venue for the **XS boot validators** (QW8 DH-24
> Senate-class, QW9 DH-27 trait-conflict) + the **appointment-ladder** (#115b). (2)
> **★ TWO forks are DECISION-GATED — NOT ready-to-build** (each has 3 live models;
> a human must pick first — recorded under "Decision-gated" in the parking lot):
> **#52 player-controlled SCOTUS** (all-CPU-by-ideology vs player-controllable-with-
> restrictions vs trait-gated — but the **SCOTUS docket data structure is needed
> EITHER way**, → E25) and **#18/#51 meter→enthusiasm→election** (every-state-unless-
> penalized vs ideology-leaning-states-only vs primaries-only — the **settled part
> is meters move enthusiasm boxes + a hard ±3 cap; that ±3 cap is a queued XS clamp
> [QW3] whose binding-point + state-scope wait on this pick**). (3) **Sized
> corroborated fixes slotted into existing epics:** **DH-53 bill-EV-sign → S
> (author STRUCTURED bill-effect tables, NOT a sign-flip), pairs with E20 + K4**;
> **DH-24 Senate-class validator → XS into the boot pipeline (QW8)**; **focus-Rep
> (EV−2)/5 House (#55) → M into scaling-wall-(b) (E7) + the census epic (E28)**;
> **statehood→sectional-crisis (#59) → S additive at `admitState`, folds into E3b's
> sectional-crisis sub-PR (fires from 1820/Nationalism starts too)**; **appointment-
> ladder + replacement-gains timing (#115b) → XS each into the boot/appointment
> rules; the ladder pairs with DH-25 (parking lot)**. (4) **★ #92 era-band model is
> now 4-START-CONFIRMED** (1772 + 1800 + 1820 + 1948 — `dem1820`'s own draft table
> prints "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)") — a
> confidence bump on K3/K4, NOT new scope. (5) **★★ DH-36 is now the 2nd GA-burnout
> DEATH in the KB** (after `new1772`) — `dem1820`'s GA quit over **player friction
> from undocumented/inconsistent rules COMPOUNDED by manual upkeep**. This is **NOT
> a roadmap row** — it is the **prioritization ARGUMENT** for the upkeep-reducing
> items (#115 boot pipeline, #55 focus-Rep, E7 House-slate persistence, K5/E9 CPU
> suite): "automation reduces the manual-upkeep burden that's killing playtests" is
> now corroborated across **2 dead threads**. Reflect it in how the ordering is
> justified, not as a new item. **Order is UNCHANGED: build top-to-bottom. The top
> of the queue is QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788`
> …**
>
> **Batch-9 version — CONFIDENCE + NEGATIVE-SCOPE + small placements (NO
> re-sequence, NO new keystone). The Nuclear-Age / Cold-War / modern-half gap-fill
> (`nuke`, the largest corpus in the KB — 12,228 posts).**
> Batch 9 absorbed `nuke` — a 1948-start "Nuclear Age 1948→Era-of-Terror ~2005"
> campaign, the **chronological predecessor of the already-documented `modern`
> 2004-2020 thread** (joined at the 2004 election). **The KB now spans a CONTINUOUS
> 1772→2020 timeline.** Despite the "Nuclear Age" title this is **mostly confidence
> + scope-control, not new scope**: it (1) **bumps K3/K4 again — the era model is
> now confirmed across a THIRD start year (1948)** and gains a **TWO-LEVEL
> refinement** (point-banked Historical Eras carrying **rule-deltas** — the
> Era-of-Terror cabinet rework proves bands change rules, not just content — AND a
> **separate per-decade census** doing bulk EV-realloc + state-bias re-lean +
> content-rotation; **do NOT collapse the two**) **+ a STRUCTURED-era-event-data
> requirement** (DH-48 — the Neocon census/EV events were LOST as free-text; typed
> `evDelta`/census fields + per-era completeness validation, in K4); (2) records the
> **★★ single most important scope-control finding in the batch — there is NO
> Cold-War subsystem to build** (verified: only `revolutionaryWar.ts` exists; no
> nuclear/MAD/NATO/space-race/military-branch engine). The Cold War is the **generic
> war engine (E3) RELABELED + the diplomacy subsystem (E12) + content (data)**; the
> REAL items underneath are **ONE generic war engine that must RESOLVE** (DH-47 —
> wars never end today; Korea ran ~2 decades; ideally army/navy/air branches) **+
> the diplomacy subsystem** (8 relation meters + ambassador actions; DH-46 add
> downward pressure; DH-45 fix the USSR-collapse trigger); (3) **★ elevates K5 +
> the CPU handler suite (E9) to a first-class LOAD-BEARING Phase-1 system** — the
> app is **1-human-vs-9-CPU** (#114; multiplayer "goes off the rails"), so the
> ENTIRE multiplayer apparatus must be CPU-AI-driven; K5 **stays after K0+K2 (no
> re-sequence)** but is no longer "optional/late"; (4) **strengthens E16** (mutable
> cabinet → **create-AND-abolish** seats: DOE/DHS created, **Postmaster General
> ABOLISHED**, HEW split — `Legislation.abolishesCabinetSeat?`); (5) records the
> **Senate pass-threshold RESOLVED + DESIGN CHOSEN**: code today is simple majority
> (`phaseRunners.ts:3562`, `yea > nay` both chambers, no cloture); human picked the
> **real-Senate model — 60% cloture, then simple-majority floor vote** (lands in
> E14c, `CLOTURE_THRESHOLD = 0.6`); (6) **adds TWO parking-lot items → 12** — a
> **population model + House cap** (DH-49, the one genuinely-new infra item; the
> Wyoming Rule + per-decade census are un-implementable without it) and an
> **impeachment / VP-vacancy / succession ruleset** (DH-54 — never in the rules doc
> across 3 campaigns); and (7) folds the rest (legislated-variable-SCOTUS-size →
> E25; `scenario1948` as a 4th `BootSheet` boot shape → E30; DH-45..DH-58 classified
> into their epics; #105/#108/#109/#112/#113 placed). **Order is UNCHANGED: build
> top-to-bottom. The top of the queue is still QW0 → K0/K2 → K3/K4 …**
>
> **Batch-8 version — CONFIDENCE-HARDENING pass (NO re-sequence). The two 1772
> threads + the multi-save era-model proof.**
> Batch 8 is **not a re-sequence**: the tech-lead confirmed no new keystones and
> no structural change. It (1) bumps **K3/K4 (the era model) to HIGHEST
> confidence** — now **MULTI-SAVE PROVEN** (two independent saves, 1772-start +
> 1800-start, 28 in-game years apart, emit identical era-bands at identical dates;
> game-context #102 / `tea1772` + `rep1800`); (2) **strengthens E16's
> justification** (`cabinetSeatsForYear` is now confirmed the WRONG model at BOTH
> ends of the timeline — founding offices-by-law + modern bill-creates-a-seat);
> (3) **adds ONE author-before-build parking-lot item** (DH-41, the general
> SCOTUS-ruling → downstream-statute cascade — UNBUILT, `vcczar`-deferred → 10
> total); (4) **folds the new small mechanics #100/#103/#104/#105 + DH-38/39/40/42/
> 43/44 into existing epics**; (5) records a **★ NEGATIVE RESULT** — no thread
> reaches a "future" era, so the roadmap does **NOT** scope one; and (6) cites
> **DH-36 (GM-burnout abandoned a 12-turn game)** as the META justification for the
> whole build. The two 1772 threads — **`new1772`** (the first MULTIPLAYER 1772
> founding campaign, abandoned at GM burnout) + **`tea1772`** (a solo all-CPU
> 1772→1874 fast-traversal that stalls mid-Gilded) — are the batch-8 sources.
> Order is **unchanged**: build top-to-bottom. The top of the queue is still
> **QW0 → K0/K2 → K3/K4 …**.
>
> **Batch-7 version — re-sequenced for the "Era of Republicanism 1800-1868"
> early-republic gap-fill.**
> This roadmap was stood up from the codebase + tech-lead bootstrap (6 items),
> rebuilt against batch 1 (`f4c7c2c4`, 1868 Gilded-Age → 14 items), re-sequenced
> into **two parallel tracks** for batch 2 (`f55d3e21` 1788 federalism + `85f8e6b4`
> 1772 aesthetic), re-sequenced into **three engine phases** for batch 3
> (`3a9ac985`, the 2276-post modern campaign), re-sequenced for batch 4 to absorb
> `77db6e6f` (the **9051-post 1856-native "A House Divided" Part 2** — the only
> source for the Civil-War / Reconstruction / secession machinery),
> re-sequenced for batch 5 to absorb `e1776bbd` — the **7540-post all-CPU
> 1841→1924 "Drums of War"** playtest (the first explicit forum record of CPU
> heuristics, thresholds, tie-breaks, and formulas) — re-sequenced for batch 6
> to absorb `c50d9da7` (a **1172-post, multiplayer "Era of Populism" 2012
> fresh-modern boot**) — and is now **re-sequenced for batch 7**, which absorbed
> `rep1800` — the **"Era of Republicanism" 1800→1868 campaign**, the first
> procedural record of the 1800–1856 early republic (Jeffersonian →
> Era-of-Good-Feelings → Jacksonian → Manifest-Destiny → Nationalism), the
> **predecessor of batch-1's `gilded`** — so **the 1800 campaign is now
> documented end-to-end**. Order within each track is binding from
> `technical-guide.md` §9.6 + **§9.1.5 / §9.1.6 / §9.1.7** + §6.6.1 — **build
> top-to-bottom.**
>
> **What changed vs. the batch-7 roadmap** (all from §9 batch-8 lead +
> §9.1.5's batch-8 confidence bump + the divergence-row updates, binding —
> **CONFIDENCE + small placements, NOT a re-sequence**):
> 1. **★ K3/K4 (the era model) → HIGHEST confidence: MULTI-SAVE PROVEN.** The
>    batch-7 reframe was inferred from a single 1800-start campaign (`rep1800`).
>    Batch 8 adds a fully *independent* save — `tea1772` (a 1772-start solo all-CPU
>    traversal, **28 in-game years earlier**) — that emits the **identical
>    era-band sequence** (Federalists → Republicanism → Democracy → Manifest-Destiny
>    → Nationalism) at the **same in-game dates**. Two saves, two start years, one
>    deterministic band sequence ⇒ the bands are **game-state content-gates, not
>    flavor**. **Nothing structural changes** — the K3/K4 spec was already
>    condition-driven from batch 7. This is a **priority/confidence raise only**:
>    the era keystones are now the **safest large bet in the roadmap**; treat the
>    content-band model as **settled**. **#102's dual era-scoring (per-era winner +
>    cumulative "winner so far") is the WIN-CONDITION scoreboard — it folds into
>    K3/K4's per-era point-banking (#68 banks the cumulative total); the win
>    condition is DUAL.** K3 + K4 rows + the Phase-0 preamble UPDATED (confidence,
>    not scope).
> 2. **★ E16 (dynamic cabinet-seat refactor / divergence #15) — justification
>    STRENGTHENED, no new work.** `cabinetSeatsForYear` (`types.ts:1196`) is now
>    confirmed the WRONG model at **BOTH ends of the timeline**: founding offices-
>    by-law (`new1772` — SCOTUS/Bank/Navy/AG/academies built by bills) AND modern
>    (`pop` — a Climate bill creates a cabinet seat). So the seat-list-as-mutable-
>    state refactor is **foundational to the offices-as-data theme, not a
>    modern-only nicety.** E16 row UPDATED (harder justification, same scope).
> 3. **★ DH-41 — ONE new author-before-build PARKING-LOT item (now 10 total).**
>    The general **SCOTUS-ruling → downstream-statute cascade** (a ruling that
>    *contradicts a law on the books* auto-voiding it) is **UNBUILT and was
>    explicitly DEFERRED by `vcczar`** (`tea1772` POST 124-126, Prigg→Fugitive-
>    Slave-Act). Today a contradicting ruling leaves the law operative. Distinct
>    from the *built* strike-a-single-law + the #100 overturn-an-amendment path.
>    **Author the cascade policy before building it; lands in the SCOTUS docket
>    (E25) once decided.**
> 4. **Small placements (fold into existing epics, no new rows):** #100
>    SCOTUS-overturns-a-ratified-Amendment + threshold-amendable → the amendments
>    item (E5) + SCOTUS docket (E25); #103 presidential-vote modifier stack +
>    era-stamped issue list → election-math / bill-scoring (E20); #104 lone-ideology
>    convention exploit → the convention CPU handler guard (E9 handler 9e); #105
>    stat-collapse → forced presidential resignation → succession (E10b).
> 5. **DH classification (place, don't necessarily schedule):** DH-38 (no
>    late-ratification / "Rogue Island" window) → E1 federalism/founding;
>    DH-39 (all-human Convention deadlock) → convention machinery (multiplayer);
>    DH-40 (SCOTUS-justice-count bill not auto-packaged → game STALLS) → an XS-S
>    bug-fix in the bill-packaging / SCOTUS-establish path (E14b / E25); DH-42
>    (national-meters swamp per-state lean → no close elections) → election-math
>    BALANCE (E4 / E20); DH-43 (Vermont has no home-state mapping) → an XS dataset
>    fix (**new QW11**); DH-44 (post-12A legislature-state vote count undecided) →
>    the 12A toggle (E4 / #93); DH-37 (no politician-to-politician trading) →
>    multiplayer / parking lot.
> 6. **★ NEGATIVE RESULT — do NOT scope an "Era of the Future."** No thread in the
>    corpus reaches a post-Gilded/post-modern era (`tea1772` "…to future" stalls at
>    1874 mid-Gilded; `hd`/`drums`/`pop` top out at Gilded/Progressive/Populism).
>    The future era is undocumented everywhere — **there is no build target. K4
>    adds EXACTLY `gilded` + `progressive`** (see the explicit guard at K4 + the
>    parking-lot note).
> 7. **META justification (cite, don't queue):** **DH-36 — GM burnout from manual
>    bookkeeping ABANDONED a 12-turn multiplayer 1772 game** (`new1772` POST 3607).
>    The **single strongest "why build AMPU at all" datum** in the corpus: the
>    computer must own the deterministic upkeep a human GM cannot sustain. It is
>    **not a row** — it is the motivation behind the whole build (esp. the scaling
>    walls E7/E8 + the CPU handler suite E9). Noted in the intro rationale below.
>
> **What changed vs. the batch-6 roadmap** (all from §9.6 + §9.1.5 + §9.1.6 +
> §9.1.7 + §9.3, binding):
> 1. **★ ERA-MODEL REFRAME re-specs K3 + K4 — NOT a new keystone (§9.1.5 /
>    divergence #18).** The biggest architectural reframe across all 7 batches.
>    K3's `advanceEra(snap, target)` becomes **`advanceEra(snap)`** — no `target`
>    arg; it watches an `era.advanceWhen(snap)` **game-state / meter / TERRITORY**
>    condition evaluated **per half-term** (the hard-coded `currentEra =
>    'federalism'` at `constitutionalConvention.ts:198` becomes the first such
>    condition). `year % 4` / `year % 2` stay as **phase CADENCE only**
>    (`phases.ts:49-59`, correct, keep). K4 gains the **per-era CONTENT-BAND
>    registry** `{bills, eraEvents, draftees, biasTable, advanceWhen}`; content
>    gates on `game.eraBand` + a **new `territoryOwned` predicate**, NOT the
>    calendar (un-owned-land bills/events/draftees are invalid — the mechanism
>    that *forces* `rep1800`'s ~30-yr content lag). The early sub-bands
>    (Republicanism / Democracy / Manifest-Destiny) are **content-band MARKERS,
>    not new enum values** (open Q; tech-lead's call: markers first). **RECONCILES
>    #68 point-banking + §26 BootSheet + §27.1 content-band finding into ONE era
>    system.** Both K3 + K4 stay **M**. K3 + K4 row descriptions UPDATED.
> 2. **★★ RECONSTRUCTION SOLO-BLOCKER (DH-29) = a hard DoD requirement on E3b
>    (§9.1.6).** GM-verified (`rep1800` POST 9170): the Strict/Ironclad-Oath
>    readmission plan can **NEVER pass with CPU factions** → solo Reconstruction
>    is UNWINNABLE, and AMPU is single-player. The 1856-arc epic's whole value is
>    *completing* the shipped 1856 scenario — so an unwinnable Reconstruction
>    means E3b ships an unwinnable scenario. **E3b's definition-of-done MUST
>    include a CPU-passable readmission path** — a CPU default-vote bias for the
>    flagged historical plan (via E9 handler #2 / a "historical-plan" flag
>    consulted *before* the §25.6 heuristic) **+** an era-boundary auto-resolution
>    backstop (via K3's condition-driven `advanceEra`). The readmission half of
>    E3b lands **after E9 handler #2** or carries the era-boundary auto-resolution
>    as its self-contained fallback. **Ties E3b to the CPU handler suite.** E3b
>    row UPDATED with the DoD requirement + the K5-handler-#2 dependency on the
>    readmission half.
> 3. **★ IDEOLOGY-AS-CIRCLE is FOUNDATIONAL — new Phase-1 #5b (§9.1.7 /
>    divergence #19).** `IDEOLOGY_ORDER` (`types.ts:14`) is LINEAR and distance is
>    **open-coded at 10+ sites** (`factionCenter` `phaseRunners.ts:715`,
>    `stepToward` `:740`, conversion adjacency `:993-1003`, sponsor `:3548`, a
>    private `firstContinentalCongress.ts:120` helper, + 3 UI pages) — **no
>    central helper exists**. Add a central `ideologyDistance(a, b, circular)`
>    helper + **migrate the 10+ sites to it** (behavior-preserving while the flag
>    is off) + gate the wrap on `GameState.ideologyIsCircular?`. **Place EARLY
>    (Phase-1 #5b)** — cheap/additive while off, and every later ideology consumer
>    (the conversion handler 9f, the SCOTUS within-1-step auto-AYE §26.6) calls it
>    from day one rather than open-coding distance an 11th/12th time. NEW row.
>    Not a keystone; M total (XS-S helper + migration; M for the flag +
>    conversion-adjacency).
> 4. **New early-republic subsystems fold into Phase-1 #4/#4b + the federalism
>    epic E1 (§9.6 note).** 12A legislature-elector toggle (#93 — a NEW
>    legislature-majority resolution branch; `senatePre17` does NOT model this;
>    extends the per-state EC #5/E4); slavery-flag + Cohens (#94 — **SMALLER than
>    assumed: `State.isSlaveState` ALREADY EXISTS at `types.ts:1329`**, so just
>    the abolition-toggle-off + the persistent `Cohens` SCOTUS rule-modifier);
>    Second Bank recharter clock + Bank War exec-action (#95 — ties K2 + the
>    dynamic seat list #89); statehood-by-bill ORGANIZE→ADMIT two-step +
>    unorganized-territory draft-gate (#95 — uses the SAME `territoryOwned`
>    predicate as the era reframe). E1 + E21 rows UPDATED; new E4b row.
> 5. **Design holes classified.** Era-events-predating-start is **MERGED into
>    BUG-1** (QW1 — `rep1800` LIVE-confirms it via the LA-Purchase-dropped-at-1800-
>    start episode, a 2nd same-class instance); **DH-30 event-scheduler-min-floor
>    added as a quick-win (QW10)** — its companion on the same scheduling surface
>    (min = 20% of the era's max, round down; spill to the 5 generic anytime
>    events). **DH-31** procedure-bill veto-misroute → fixed in the bill-typing
>    epic (E2 / divergence #21). **DH-32** SCOTUS-voids-a-STATE → a one-rule guard
>    in the SCOTUS docket (E25). **DH-33** impeachment-rules-broken → parking lot
>    (author-before-build, folds into E29). **DH-34** static-era-biases → a roadmap
>    DECISION (tech-lead's call: **ship static**, the forum's own stance). **DH-35**
>    thin-early-era agency → era-gate the action libraries (E11/E13/E24).
> 6. **`scenario1800`** = an optional later `BootSheet` instance (Phase 2, low
>    priority — `scenario1788` + `scenario1856` already cover the
>    federalism→nationalism band). Noted at E30/E31.
>
> **Carried from the batch-6 roadmap** (all from §9.6 + §9.1.4 + §9.3, binding):
> 1. **K4's `BootSheet` schema is THE cross-cutting batch-6 build constraint.**
>    Three documented mid-government boots — 1788 (designed) / 1856 (shipped) /
>    2012 (designed in `pop`) — share ONE shape: pre-built faction roster
>    (5 Blue + 5 Red) + per-faction archetype politicians + era-tuned
>    ideology/interest/lobby decks + sitting government keyed to start year +
>    **state roster keyed to `{era, startYear}`, NOT era alone** (divergence #17
>    — same `modern` enum has BOTH the 50+DC fresh-boot roster AND the 53-state
>    Wyoming-Rule continuation roster) + EXPLICITLY EMPTY at boot (no faction
>    leaders, no career-track pols, no inherited PV/legacy/Kingmaker pairs).
>    **Build the schema ONCE in K4**, instantiate per era. Era identity is
>    **data configuration**, not a code path. Plus **Senate-class verifier
>    (DH-24)** + **`TRAIT_CONFLICTS` validator (DH-27)** at the boot pipeline
>    (the two new XS validators below).
> 2. **APOCALYPSE meter-driven endgame folds into Phase-1 #6 (meter-model
>    generalization), sized M.** Verified shipped: only event-driven endgame
>    exists (`EraEvent.triggersGameEnd` → `phaseRunners.ts:2871` →
>    `game.gameEnded`); no meter-watcher, no countdown clock anywhere. The
>    forum adds a NEW model (`pop` POST 542, 548): bottom-tier band entry →
>    10-game-year countdown → mandatory game-end (recovery clears it). The
>    `planet` meter ships and ticks every era; the `game.gameEnded` sink is
>    shared with the event-driven path — both close cleanly through the same
>    sink. Folds into Phase-1 #6 (same code area `runPhase_2_5_1_Lingering`,
>    same termination sink). New `GameState.endgameClocks: { meter; threshold;
>    remainingYears; startedYear }[]` field + arm/decrement/terminate path.
>    **NOT Phase-2** — the model is meter-agnostic; the Populism Planet Health
>    clock is one configured row in a per-era table.
> 3. **K2 gains `requires?: AmendmentPredicate` from day one** (divergence
>    #16). One extra field on the `GameAction<Ctx>` shape + one filter step in
>    the picker reading `game.amendments.passed`. Cheap if early, expensive if
>    retrofit across 6 libraries. Canonical instance: the general-election
>    action "Send VP to Shore Up Support" requires the 12th Amendment. Same
>    `requires:` mechanism gates bill catalog entries (income-tax category) +
>    gov action rows — predicate field belongs at the registry-row level.
> 4. **E16 cabinet refactor absorbs the dynamic seat list** (divergence #15).
>    Verified: `cabinetSeatsForYear` (`types.ts:1196`) is pure derived with NO
>    mutable state today; `phaseRunners.ts:2162` recomputes it each turn.
>    Refactor: shipped function becomes the **boot seed only**; runners read
>    `GameState.cabinetSeats: SeatSpec[]`; bill-sign handler appends
>    `Legislation.createsCabinetSeat?: SeatSpec`. Folds into E16 (same code
>    area as cabinet retention, marginal additional cost). Pairs with #66
>    (Progressive institutional layer).
> 5. **Modern era epic SPLITS into TWO scenarios** (Phase 2). `scenario1948`
>    continuation (the 60-yr `modern` digest play-through that produces the
>    53-state Wyoming-Rule roster) AND `scenario2012` fresh-modern boot (the
>    canonical `BootSheet` instantiation — 10 pre-built faction decks
>    [R1=Trumpism, B1=Bernie-populism, etc.] + Obama/Biden + 9-named SCOTUS +
>    50+DC roster, EXPLICITLY EMPTY at boot). Both depend on K4's `BootSheet`
>    schema + DH-25 (career-track bootstrap) resolved. State roster fork:
>    `scenario1948` → 53-state Wyoming + 2-home-state pols; `scenario2012` →
>    50+DC.
> 6. **CPU handler #2 (legislation) and handler #4 (cabinet) consume the
>    conditional-vote-rules primitive** (`pop` POST 1111). Iron-Fist
>    controllers publish declarative `Predicate → {AYE/NAY}` policies stored
>    at `Faction.factionLeader.compelledVoteRule?`. Handler #2 consults this
>    BEFORE the §25.6 NAY/AYE heuristic; handler #4 consumes the same primitive
>    for auto-AYE-own-picks AND SCOTUS within-1-step auto-AYE (§26.6.1).
>    Promotes a §25.9 sub-effect to a first-class CPU primitive. Folds into E17
>    (Iron-Fist split) + the CPU handler suite (E9 handlers #2, #4).
> 7. **Two new XS quick-win validators (QW8 + QW9)** for boot-pipeline data
>    quality: **QW8 Senate-class verifier (DH-24)** + **QW9 `TRAIT_CONFLICTS`
>    validator at boot/dataset import (DH-27)**. Both land at K4's boot
>    pipeline; both are XS one-validator helpers.
> 8. **DH-25 (career-track bootstrap unresolved) is the biggest new parking-lot
>    item — it BLOCKS modern scenario shipping.** 3-year-stale design discussion
>    has no canonical rule for which existing pols start on career tracks at a
>    mid-game boot. Author the rule (Zagnut's "1996+, 1/track" houserule is on
>    the table) before `scenario1948` or `scenario2012` ships (Phase-2 #30/#31).
> 9. **DH-26 3rd-party VP-trait "prohibitive" folds into E26** (third-party
>    trigger) alongside DH-11's Dem-3rd-party bias. **DH-28 climate-meter-tag
>    completeness** folds into the dataset pipeline (a CI/dataset-time validator
>    at the existing `scripts/` regeneration step).
>
> Tags carried from prior batches: Source column `gilded`/`fed`/`1772s`/
> `modern`/`hd`/`drums`/`pop`/`rep1800`/**`new1772`/`tea1772`** are the **ten**
> digests; **NEW** = first appeared this batch; **CARRIED** = on a prior list;
> **HI-CONF** = corroborated ≥2 eras; **HI-CONF (N era)** = the strongest signal;
> **MULTI-SAVE PROVEN** = corroborated by two independent saves (the era-model
> #102). **status:** `ready` = buildable now; `needs-design` = rules must be
> authored first. Sizes are the tech-lead's.
>
> **★ Why this build exists (META rationale — DH-36).** The first multiplayer 1772
> campaign (`new1772`) **collapsed at GM burnout after 12 turns** under manual
> bookkeeping (`new1772` POST 3607). That is the strongest single datum for the
> entire roadmap: the value proposition is that **the computer owns the
> deterministic upkeep a human GM cannot sustain** — which is exactly what the
> scaling-wall items (E7 House-slate persistence, E8 procedural pol-gen) and the
> CPU handler suite (E9) deliver. It is not a scheduled item; it is the *reason*
> the schedule exists.
>
> **★ Hard scope guard — there is NO "Era of the Future" target (NEGATIVE
> RESULT).** No ingested thread reaches a post-Gilded/post-modern era (`tea1772`,
> titled "…to future," stalls at 1874 mid-Gilded; `hd`/`drums`/`pop` top out at
> Gilded/Progressive/Populism; **batch 9: `nuke` stalls at ~2005 / the Era of
> Terror and seams into `modern`**). The timeline content ends at modern everywhere
> and is now a **CONTINUOUS 1772→2020 span**. **K4 adds EXACTLY `gilded` +
> `progressive` and the roadmap does NOT scope a future era** — there is no source
> to build one from (see the parking-lot "Far-future / progressive era" note, which
> is the furthest the corpus documents).
>
> **★★ Hard scope guard (batch 9) — there is NO Cold-War subsystem; the Nuclear-Age
> era is DATA on top of the generic war engine + diplomacy (NEGATIVE SCOPE,
> §9.1.8 / §28.2).** This is the single most important scope-control finding in
> batch 9. Despite the "Nuclear Age 1948–2004" title, the design has **NO**
> purpose-built nuclear/MAD model, NATO/Article-5 bloc, space-race subsystem, or
> army/navy/air service branches — and the code has only `src/engine/revolutionaryWar.ts`
> (no generic war engine, no Cold-War engine). The forum ran the entire Cold War on
> the plain naval→land d100 roller; nukes were scripted events + one legislative ×2
> multiplier; "NATO" was a single point-swing event. **The roadmap must NOT queue a
> Cold-War epic.** The work the Cold-War label hides is exactly TWO items already on
> the roadmap — the **generic cross-era war engine (E3)** and the **diplomacy
> subsystem (E12)** — plus content (events/bills/lobby-cards as data, on K4's
> era-content registry). **Frame the Nuclear Age as a DATA era, like every other
> era.** (Mirrors the no-future-era guard; the same kind of negative result.)
>
> **★ Resolved-in-code, design CHOSEN post-batch-9 — Senate threshold = 60% CLOTURE, then simple majority.** Engine today is simple majority: `runPhase_2_6_3_Floor`
> (`phaseRunners.ts:3562`) passes a bill iff `house.yea > house.nay && senate.yea > senate.nay`
> — no cloture step (the only supermajority anywhere is the Articles-of-Confederation
> 2/3-of-states path in the independence-era CC, `continentalCongress.ts:224` — a
> different mechanism). **Human pick:** target the real-Senate model — a **60% cloture
> step (end-debate)** before the simple-majority floor vote. Lands as part of the
> **filibuster/cloture epic (E14c)** — that epic now has its threshold (`CLOTURE_THRESHOLD = 0.6` of voting senators) and its sequencing locked: filibuster toggles on by law → cloture vote at 60% → floor vote at simple majority. No new keystone; the constant lives in E14c.
> **★★ Batch-22 (`modernday#POST 422-423`, Ted-authoritative) — #172 layers the ERA-KEYED
> NUCLEAR-OPTION DEFAULT on TOP of this cloture surface; do NOT re-litigate the batch-9 cloture
> decision.** The Nuclear-Option is a `GameState.nuclearOption:{cabinet,scotus}` per-start-year
> boot flag that sets the era-keyed CONFIRMATION threshold (Cabinet 50%+1 / SCOTUS 60% for a 2016
> start, the Reid-2013 + McConnell-2017 reforms already fired) — the SML enact/repeal action
> toggles it. **It builds WITH E16's confirmation step** (the cabinet runner + SCOTUS-nom path
> read the per-track threshold) and **composes with #124's auto-pass gate + #52/9d + #171** — it
> is the era-keyed DEFAULT on this same 60%-then-majority cloture surface, NOT a re-derivation of
> it. Size S–M (folded into E16). debt #50; game-mechanics §9.3.10.

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic (PR1–7)
is complete; the knowledge-base infra and eight ingestion batches are knowledge
milestones (no code, but they are what every item below is traced to).

- **Batch-30 ingestion (knowledge milestone — FIVE DESIGN/DATA/changelog threads, NO playtest [a DESIGN/DATA
  batch — no playtest exercise]).** Absorbed **`revampPV`** (`4266d56e`, the Feb-2023 PV-SYSTEM OVERHAUL —
  re-valuing every trait/ability's Politician-Value on a fixed tier scale; vcczar POST 33 = the designer-
  authoritative ~65-item tier list; DIED UNRESOLVED on a GM handoff), **`summer2021`-changelog** (`f2aa81fd`,
  vcczar's tier-1 ALL-DECIDED rule-changes out of the batch-26 `summer2021` run — the ORIGIN of DH-76),
  **`ampuData`** (`853ce63f`, vcczar's per-administration 1774→2022 content INDEX — an authoring source),
  **`presidents`** (`5e00ec8e`, the cross-playtest president RECORD + corpus-coverage map), **`ampuUpdates`**
  (`970616d5`, vcczar's Apr-Jul 2021 dev changelog — the earliest `GM⇒App` charter). **14 NEW gap rows
  #214–#227 + 1 NEW design-hole bug DH-77** (max gap #227, max bug DH-77). **★★★ HEADLINE → THE PV-SYSTEM
  OVERHAUL splits into PV QUICK-WINS + a GATED BALANCE EPIC (debt #85; `GM⇒App`):** `pv.ts`'s `computePV`
  ships a PRE-REVAMP formula (flat ±4/−5 traits `pv.ts:76-77`, flat `command×10` `:74`, flat `skill×weight×4`
  `:70-73`, magic `Kingmaker +6` `:79`, `Math.max(0,…)` clamp `:88`) → **#216 the trait-name remap is the
  BLOCKING PREREQUISITE** (~17 of ~57 P33 trait line-items mis-key/drop vs the shipped `Trait` union;
  **S quick-win, DO FIRST**) + **DH-77 floor-offset clamp = XS quick-win** (swap `Math.max(0,…)` for a constant
  offset so the CPU keeps sub-zero ordering); the **full #214 per-trait tier table = M-L BALANCE EPIC GATED on
  the un-ingested "Groupthinking the Political Value" trait-EFFECTS thread** (P33 sets only POINT VALUES; fold
  Kingmaker+Master-Kingmaker in, drop the `:79` `+6`) + **#215 per-ability curve + Command re-weight = M** + the
  **same PR MUST re-tune `calcStateVote`'s `pv*0.1` (`phaseRunners.ts:3709`) — `pv=c.pvCache` feeds every
  state-vote score, so a PV reweight shifts election margins** + **#220 display-scale = a S DECISION** (raw
  "pink" vs 100-normalized, UNRESOLVED → Decision-gated (A) User-gated). **★ #217 the president/cabinet
  IMPLEMENTATION sub-engine + ~30 governing traits** (debt #86, `GM⇒App`; post-legislation success→Blunder pass
  modified by expertise-gated genre traits + Delegator/Micromanager + Crisis-{Manager,Admin,Gov} +
  Passive/Predictable + Passive+Pliable PUPPET + Magician; de-dup vs Efficient/Egghead first; **L system layer
  riding #179/#182/§14.1.y, gated on federalism**; folds into E16/E6). **★ #221 the era-content registry needs
  TWO SCHEMA FIELDS** (debt #88; a scripted-vs-flavor tier flag + per-category first-active-era metadata;
  `EraEvent` `types.ts:1466-1482` lacks both → **folds into K4**; XS-S each; the authoring-side confirmation of
  the #92 two-level content-band model, content terminates at Biden/2022). **★ #218 Rule-of-Four/CJ
  case-refusal (S → E25, shares #217's trait reads) + #219 US-Rep PROPORTIONAL representation (S → E14/E7)**
  (debt #87; both ABSENT). **★ SMALL FOLD-INS #222–#227** (debt #89; several `GM⇒App`): **#222** committee-size
  scales with state count (S) · **#223** chair→25%-enthusiasm (XS) · **#224** lowest-satisfaction 25% auto-flip,
  DISTINCT from conversion #76 (S) · **#225** Celebrity-expiry-before-40 (XS) · **#226** Frail/Hale lifespan
  auto-traits = a NEW `scripts/` DATASET rule, not engine (XS → #120/E18d) · **#227** Trim-Roster already
  REMOVED, verify random-retirement tuning prunes (XS). **★ DH-76 cloture now has its ORIGIN** (first authored
  `summer2021`; batch-29 `wilsons1916` was the symptom; no re-size, debt #80/#208) + **#115 generate-a-candidate
  sharpened** (name-DB tagging + 1/9/20/20 tiering + lowest-score backfill; folds into `scenarioBoot` §9.1.9;
  debt #90, S-M). **★ GM-REPLACEMENT LENS additions** (a VIEW, no re-sequence): the PV-electability row
  (#214/#215/#216/DH-77), the implementation/governing engine (#217), a cloture/legislative annotation (#221 +
  DH-76), and #115. **★ HYGIENE — do NOT schedule:** the winning-party lowest-faction score penalty (ADOPTED-
  then-REVERSED, "nosedive", #68/#102), the REJECTED randomized/Legis-weighted proposer, the per-trait
  "absence bonus" idea. **★ CORPUS-COVERAGE:** ≥7 un-ingested playtests (esp. the **1840-start** persistent-Whig
  ~100-yr run) + the un-ingested **"Groupthinking the Political Value"** trait-EFFECTS thread (gates #214/#215)
  — recorded in the Author-before-build / corpus-coverage area; ask the human for exports. **NO gap closed, NO
  new keystone, NO re-sequence, top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** debt
  #85-#90; technical-guide §9 batch-30 lead + §9.6 + §8 debt #85-#90; game-mechanics §3.4.1, §20.10.1, §22.7.z,
  §27.1.1, §30.20.
- **Batch-29 ingestion (knowledge milestone — TWO TIMELINE-EDGE playtests that bracket the band model
  end-to-end).** Absorbed **`wilsons1916`** (`a0b7ef49`, "Wilson's Vision: 1916, Era of Hollywood" — the
  **FIRST multiplayer 1916**, a deliberate **START-AT-ERA-OPENING experiment** fixing the 1960 mid-cycle
  failure #186; ran 1916→1920 then trailed off; the US NEVER entered WWI [war-entry event never fired]
  and the **19th Amendment RATIFIED** in a human-majority game [reframes DH-14]) + **`welcome2future`**
  (`c54b7a9d`, "Welcome to the Future: A Hands-Off, All-CPU Playthrough 2022→2072" — the **DOWNSTREAM-MOST
  ingest in the corpus**, 8-of-10 factions on CPU rules, the most complete modern CPU-turn sample;
  PLANNED to 2072 but never reached it, covering setup + exactly ONE turn before stalling at the
  legislative phase, never entering the Future band proper). **8 NEW gap rows #206–#213 + 3 NEW design-
  hole bugs DH-74–DH-76** + reframes (#92 terminal edge, DH-14, #115, #186, #106, #114/#110). **★★★
  HEADLINE → #206 the `Era` enum is DOUBLY too coarse, confirmed from BOTH timeline edges (debt #78), and
  it RESOLVES the long-open "grow the enum vs. adopt the #92 data-model" question IN FAVOR of the DATA-
  MODEL:** with Future/Populism/Hollywood/Gilded/Progressive labels ALL needed, a flat enum would balloon
  → adopt the #92 two-level content-band model in K4's era-content registry; **band labels become era-
  content DATA, not enum values; `Era` (if kept) stays a COARSE rules-tuning key** — annotate K3/K4/#92,
  NOT a new keystone, NO re-sequence. PLUS a separate **Era-of-the-Future proposal-library authoring epic**
  (events done, legislation a stub — the same "events-before-legislation" shape as the Federalism gap).
  **★ #207 NO terminal game-over / completion state** (debt #79; the ONLY terminal state is `gameEnded` at
  ONE event-driven site `phaseRunners.ts:2871`, NO `endYear`/`maxYear` → a **completion-vs-loss DECISION**
  is owed [year-cap / sandbox / score-out], DISTINCT from the #88/#188 meter/scripted LOSS endings; S-M,
  decision-gated). **★ #208 + DH-76 the CPU LEGISLATIVE/CONFIRMATION engine + cloture** (debt #80,
  `GM⇒App`; `grep filibuster|cloture src/` = ZERO; the hands-off 2022 turn forced the GM to invent a CPU
  filibuster-override + maj/min-leader vote rule + cross-party cabinet caps; DH-76 adds the cloture gap
  from `wilsons1916#P349` — filibuster = automatic full-term delay, no cloture path → the Filibuster
  action + an era-keyed Cloture counter + CPU override + cabinet caps, all deterministic; M, folds into
  E9 9b/9d, K5-DEPENDENT). **★ DH-74 bill-proposal validator** (debt #81, `GM⇒App`; `BILL_TEMPLATES`
  carry NO precondition fields → `wilsons1916` House-voted bills then found them INVALID mid-second-vote,
  a 2.6 HALT; a `billProposable(snap, tpl)` predicate + filter at `phaseRunners.ts:3444` that SHARES the
  territory/era content-filter with #206/#92 — build the predicate library ONCE, use it for events AND
  bills; S-M). **★ #209 boot-time retro-cohort bench** (debt #83, `GM⇒App`; a non-1772 boot has no
  synthetic bench → `welcome2future` Alabama had no eligible Republican; a boot-time retro-gen of SUB-
  FLOOR career-track cohorts stat-dated to the prior ~5 cycles, routed through `rng.ts` → folds into the
  existing `scenarioBoot`/`BootSheet` pipeline [K4]; M). **★ DH-75 military-appointment eligibility**
  (debt #82, `GM⇒App`; the officer filter checks ONLY `military >= 3` → Pancho Villa appointable as a US
  general → add citizenship + exp-type→branch gates; XS-S). **★ SMALLER ASKS** (debt #84): **#210** Ex-
  President super-Kingmaker, **#211** inter-faction PV-snake draft mode, **#212** per-term ideology-shift
  pass + cap, **#213** era-conditional faction-ideology toggle (sunsets 2026, folds into #171). **★
  REFRAMES:** DH-14 = a CPU-AI ARTIFACT (the 19th passed with humans, House 374-61) → NOT a hard block,
  folds into the era-keyed bill-ideology table + the #208 CPU vote model; #106/WWI optionality + #114/#110
  corroborated; **★ #173/#186 METHODOLOGY CONVERGENCE — author/test at era-band OPENINGS, treat mid/tail
  starts as a higher-risk class** (BOTH a mid-cycle AND a tail-of-band start are thin-content friction
  zones). **★ FIRST batch to add LEGISLATIVE-REFEREE items to the GM-replacement lens** (#208/DH-76 +
  DH-74 + DH-75 under ①; DH-14 logged as a ② opponent-half CPU-AI artifact). **NO gap closed, NO new
  keystone, NO re-sequence, top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** debt
  #78-#84; technical-guide §9 batch-29 lead + §9.6 + §8 debt #78-#84; game-mechanics §22.11, §26.4,
  §28.10, §12.1.1, §9.2.1, §8.5.4, §4.4, §30.19.
- **Batch-28 ingestion (knowledge milestone — DISCUSSION/CATALOG + RECONCILE, no era playtest).**
  Absorbed **FOUR designer META-DOCS**: **`to-do`** (`ab93f871`, the authoritative 2021-22 pre-build
  dev backlog — the literal "intended build list"), **`fixes`** (`a58b90f4`, vcczar's 2022 designer-
  authoritative ACCEPT/REJECT/DEFER fix-queue — the UPSTREAM ORIGIN of many later rulings),
  **`completions`** (`64f60bbd`, ★ the *done-half* of the 2022 spreadsheet/reference game's backlog),
  **`vic3`** (`76d41a08`, aspirational Victoria-3 borrows, mostly designer-tagged "AMPU 2"). **17 NEW
  gap rows #189–#205** + ~50 existing rows annotated in-place. **★ THE PIVOTAL RECONCILIATION BATCH:**
  the `completions` list lets us convert 2022 "done" claims into VERIFIED truth about our `src/` (a 2022
  spreadsheet "completion" is NOT grounds to close a gap — our "Built" = present in our React/TS
  codebase, a different universe). **NO gap was closed.** **★★ RECONCILIATION HEADLINE → debt #71 =
  the election-scorer determinism+tuning QUICK-WIN, which FORMALIZES the existing QW19–QW21:** of the 2
  flagged "CONFIRMED-SHIPPED" claims exactly ONE holds — **election-die-D6 REFUTED** (the cited
  `phaseRunners.ts:727` is `factionExpertiseBias`'s unrelated 0–6 clamp; the real randomizer is
  `(Math.random()-0.5)*8` at `:3711`, raw `Math.random`, NEITHER d6 nor d3 — our build ships NO election
  die, the #184/DH-72 finding stands) and **trait-conflict-d6 CONFIRMED-BUILT via the RNG seam**
  (`tryGrantTrait` `traits.ts:53`, `d(6)>=threshold`, threshold `4` → 1-3/4-6). The D6/D3 fork is TIED
  OFF — it is the SAME tuning+seeding QW (debt #71 fuses #64/DH-72 + the flagship `Math.random` leak
  debt #1/#3 in ONE patch; QW19–QW21 are its roadmap name — REINFORCE, do NOT add a 4th row). **★ #179
  cabinet-meter engine now has NUMBERS** (debt #72; `Admin→{upOdds,downOdds}` roll + Efficient±2 + 25%
  lobby-dissat + JCoS carve-out replacing the placeholder `drift()` at `phaseRunners.ts:3260`; S-M,
  standalone, ready). **★ DOWN-BALLOT model #189–#192** (debt #73; separate-from-presidential trait
  table + expertise/lobby↔industry "Manchin" +2/+1 + static per-seat `deviantPartyBias` + margin→pop-
  vote-% + PV-cap; M, builds ON the existing routing — partly-built per `phaseRunners.ts:3685,3707-3708`).
  **★ NINE NOT-IN-OUR-BUILD subsystems re-confirmed ABSENT, spec'd → roadmap-ready, ALL `GM⇒App`** (debt
  #74 voting-power/generate/gerrymander; #75 acting-pres/do-not-enforce/master-kingmaker; #76 secession-
  3.0.35/sea-EV/trait-renames). **★ NEAR-TERM `GM⇒App` cluster** (debt #77: confirmation-cascade #199 /
  personnel-effect bills #200 / interest-acquisition #193). **★ PARKING-LOT: #205 Vic3 "AMPU 2"
  borrows** (B1 dynamic IG→party / B4 per-state meters / B5 per-lobby agendas — NO near-term row); **B2/
  B3 Vic3 gov-actions FOLDED INTO #20**; **#204** = a DECISION RECORD (skills stay 0-5, 0-10 → "AMPU 2");
  **#203** wealth DEFERRED. **★ #183 endorsement-momentum CONFLICT** surfaced OPEN (2022 25%/10% vs
  `redbutton` none; rides #185/#66/#67). **★ FIRST batch read through the GM-replacement lens** — the new
  `GM⇒App` items slotted into it. **NO new keystone, NO re-sequence, top-of-queue UNCHANGED.** debt
  #71-#77; technical-guide §9 batch-28 lead + §9.6; game-mechanics §15.4, §15.5, §20.10(g)-(j), §14.1.2,
  §24.1, §23.1, §30.18.
- **Batch-27 ingestion (knowledge milestone).** Absorbed **ONE playtest**: **`redbutton`**
  (`8bc0231c`, "The Big Red Button: 1960 Playtest", **THE CORPUS'S FIRST Cold-War / Civil-Rights
  source** and the **FIRST MODERN-ERA scenario boot stress-tested AT SCALE** — a ~10-human MP run that
  **started MID-CYCLE in the 1960 Elections Phase** [a turn before its authored 1960-62 governance
  boot], ran 1960→1962-64, then **"Temporarily Paused" and never resumed solo** [the modern-angle
  GM-workload death]; alt-timeline GOP nominated **John W. Bricker** [MacArthur convention WALKOUT] who
  **WON 492-40 over JFK** off a platform/election BUG, BLESSED by both designers in-thread). **ONE
  designer-confirmed election NERF [#184]** + its driving **BUG [DH-72]** + **FOUR designed-not-built
  modern gaps [#185/#183/#186/#187]** + **ONE premise-only loss [#188→#88]**. **★★ DH-72 ELECTION-TUNING
  SUB-FIXES → SPLIT into a SHIPPABLE QUICK-WIN** (the highest-leverage work in the batch): the 492-40 came
  from a `+1`-rule read as `+3` board-wide on a bogus `+3` platform bonus; recompute → ~281-129 near-tie.
  `calcStateVote` (`phaseRunners.ts:3709-3711`) re-verified UNCHANGED = `50 + baseLean*5 + partyPref*5 +
  enthusiasm*2 + pv*0.1 + factionBias + traitBonus + (Math.random()-0.5)*8` — NO ±3 cap, NO per-state
  ideology gate, RAW `Math.random`, NO "+1 most-enthusiastic-base" term in code. **Three sub-fixes bind
  HERE with no new system → QW19/QW20/QW21:** (a) narrow + SEED the jitter (d6→d3 intent via `src/rng.ts`,
  closes a determinism leak + debt #1/#3), (b) re-weight `baseLean*5`→ the +3/+5 historical-bias band
  behind a `game.biasMode?` toggle, (c) HIDE the raw formulas in the UI (anti-collusion). **Join the
  QUICK-WIN bucket alongside QW3 ±3 cap [debt #1] + the #18 2-layer scorer.** debt #64; game-mechanics
  §15.3.5, §28.6. **★ #184 PLATFORM METER-CAP (+2/+1/−1)** is NOT a quick-win — it clamps a term that
  DOESN'T EXIST yet (`grep platform|plank in src/engine` = ZERO; same unbuilt object as #181) → a
  **BUILD-INTO CONSTRAINT on the convention/platform epic (Phase-1 #10 / #181)**: build the scorer with
  the cap + hide-the-math from day one, never ship the uncapped forum scorer. debt #65; game-mechanics
  §15.3.5, §28.6. **★ #185 MODERN PRIMARY→BROKERED-CONVENTION MACHINE** (12 primary states, primaries-in-
  GROUPS, 5-tier Cat-1–5 delegate-weight HOST-RIGGING lever, kingmaker +1, 67%-first-ballot, two-leaders-
  force-a-kingmaker-weighted-rule-change-vote, least-delegates-first interballot order, 100%-delegate rule
  + WALKOUT, kingmaker-weighted VP vote) → **FOLDS INTO Phase-1 #10 convention machinery**, L; the single
  biggest election subsystem. CONFIRMED unbuilt (`runPhase_2_9_1_Primaries` `:3725-3750` = flat
  PV+command*5 SORT). debt #66; game-mechanics §28.6. **★ #183 ENDORSEMENT-MOMENTUM HOLE** (withdrawal/
  endorsement is inert unless the dropper holds delegates; add a momentum value +2 Minor/+3 Major OR a
  home-state/region transfer OR an ideology-penalty waiver, INDEPENDENT of delegate count) → **FOLDS INTO
  #185/Phase-1 #10**, S, DO NOT build standalone (couples to the DH-72 d6→d3 squeeze + DH-57). CONFIRMED
  unbuilt (`grep withdraw|endorse|momentum in src/engine` = ZERO). debt #67; game-mechanics §28.6. **★
  #186 DETERMINISTIC LATE/MID-CYCLE BOOT** = a FIFTH `BootSheet` shape (the FIRST modern-era boot + the
  cleanest late-start failure — a 1960 governance boot forced into an Elections-Phase start a turn early →
  cascading manual patches: Senate 50-50 vs real 66-D, no Leadership-gated Party Leader, on-election rolls
  skipped, party-fatigue dropped, gov terms-served unknowable, delegate weights hand-assigned, DC EVs
  invalid pre-1961, NO Command runway → roster frozen) → **RIDES K4's `BootSheet` + `scenarioBoot`
  (#115)**, M-L; needs `startMode: 'electionPhase'|'governance'` + `asOfYear` incumbent table +
  `seededLeaderTenure` (#187) + `delegateWeights`/`primaryCalendar` (#185) + `careerTrackBackfill`
  (DH-25); no new keystone. CONFIRMED unbuilt (`grep scenarioBoot|BootSheet in src/` = ZERO). debt #68;
  game-mechanics §28.1, §28.6. **★ #187 PARTY-LEADER FATIGUE** (`party preference −1` after 6yr of one
  party leader → ~8-yr presidential rotation; its absence at the mid-cycle start COMPOUNDED the #184
  landslide) → **S, pairs with #15; do the boot retro-apply WITH #186**. CONFIRMED unbuilt (`Party`
  `types.ts:1306-1311` has NO tenure field; `leadershipStartYear` `:1302` written, NEVER read for a
  penalty). debt #69; game-mechanics §8.5.3, §28.1. **★ #188 "BIG RED BUTTON" NUCLEAR LOSS** (the
  campaign's whole PREMISE never fired; Cold-War content that DID fire is event/legislation FLAVOR on the
  generic engine) → **FOLDS INTO #88 (meter-floor game-end + APOCALYPSE clock, Phase-1 #6)**, XS-S, NO new
  subsystem (a configured end-condition ROW, NOT a MAD/arms-race engine — corroborates §28.2 negative
  scope #106). CONFIRMED unbuilt (`triggersGameEnd` consumed in EXACTLY ONE place `:2871`, event-only).
  debt #70; game-mechanics §28.2, §30.17. **★★ ESCALATED IN PLACE (confidence ↑, NO new scope, NO
  re-sequence):** **#88** gains its first MODERN datum (still exactly ONE proven game-over, `terror2000`'s
  coup → confidence ↑ on the meter-floor model); **#86/#115/#173/E1** boot cluster — the mid-cycle modern
  boot is now CONCRETE (the 5th `BootSheet` shape), the strongest case yet for `scenarioBoot`; **#14**
  platform/election rules now have the designer's nerf DIRECTION set; **#114/DH-36** re-confirmed as the
  GM-WORKLOAD DEATH from the MODERN angle (the 10-human run paused, never resumed solo — E9/K5 carries
  this too). **No new keystone, no re-sequence, batch 27 nets 0 (the DH-72 sub-fixes JOIN the quick-win
  bucket; #184/#185/#183 ride Phase-1 #10/#181; #186 rides K4; #187 pairs #15/#186; #188 folds into #88;
  all open Qs are designer-gated WITHIN their epics); top-of-queue UNCHANGED — but the modern primary→
  convention cluster (#185/#183 + the #184 platform cap) is now the KB's richest forward-played election
  spec inside Phase-1 #10.**

- **Batch-26 ingestion (knowledge milestone).** Absorbed **ONE playtest**: **`summer2021`**
  (`fe15db25`, "Summer 2021 AMPU Playtest", **THE CORPUS'S LARGEST SOURCE** and the **FIRST run to
  PLAY FEDERALISM FORWARD** [1772→~1810, the whole president/cabinet/diplomacy TURN LOOP run end-to-end,
  NOT just designed-and-walled]; a **3-GM relay over ~14 months** — GA-run, trails off NOT a clean
  burnout quit, but the marquee rulings are designer-blessed in-thread [@vcczar/@MrPotatoTed
  adjudicate]). **CORROBORATION-HEAVY** + **FOUR net-new ENGINE gaps [#179, #182, #181, #180]** + **ONE
  net-new data-integrity bug [DH-71]** + the **highest-confidence federalism-is-next-era signal in the
  corpus.** **★ #179 cabinet LINGERING-ROLL meter engine** → **REDESIGN** of the shipped deterministic
  drift (`runPhase_2_5_1_Lingering` `phaseRunners.ts:3260` = `drift(skill)`-keyed, NO roll/backfire)
  into a ROLL engine + ≥6 sub-rules across ≥2 systems (per-portfolio ±roll w/ backfire + Efficient
  auto-+2; Pliable-Pres decider override; cabinet-bill double-points; ideology-gated confirmation;
  regional-rep penalty; exec-action blunder rolls); folds into **E6 (Lingering) + E16 (cabinet) +
  §10.4.1 blunder layer**, L, **★ SPLIT into (i)+(f) meter/blunder engine · (b)+(d) appointment/
  confirmation · (c) bill-coupling · (e) election-feedback** (per tech-lead); **gated on #177 + the
  diplomacy/EconStab meters it moves; couples to #67 + #116/#160**. CONFIRMED unbuilt-as-designed (the
  shipped drift has no roll/decider-override/bill-coupling). debt #59; game-mechanics §20.10. **★ #182
  command = the President's PER-TURN EXECUTIVE-ACTION BUDGET** ("Osgood can do up to 4 actions… he has 4
  command") → folds into **the §14 executive-action build (K2 ActionRegistry) + #179**, S once the exec
  system is real; **gated on `runPhase_2_8_1_Executive` (`:3632`, today ONE flat `chance(0.5)` action)
  becoming a real K2 ActionRegistry chooser**. CONFIRMED unbuilt (`command` is only PV/reward/grant/
  decay/candidacy, NEVER an action-count). Open Q (designer): applies to governors too? debt #62;
  game-mechanics §20.11(2). **★ #181 presidential PLATFORM-PROMISE convention system** (binding platform
  = 1 econ + 1 domestic + 1 judicial + 1 foreign bill + 1 action promise + a crisis-resolution promise,
  PLUS deal-making office-promises, kept/broken → §22.2 enthusiasm) → **PART OF the #19/#20 convention
  cluster — DO NOT build standalone**, M; rides the convention epic; gated on conventions existing.
  CONFIRMED unbuilt (`grep platform|conventionPlatform in src/` = ZERO). debt #61; game-mechanics
  §20.14(1). **★ #180 monument / legacy-trait achievement layer** (named historical-legacy traits to
  whoever performs each in-game FIRST — "Atlas of the Revolution", "Author of the Declaration",
  "Father of the Country") → **rides the federalism/founding era-content build**, S–M, LOWER PRIORITY
  than #177-#179; gated on #177; the Fed-Papers authoring rule is a documented hole, needs authoring
  first. CONFIRMED unbuilt (NO first-achievement-detection layer; `grep firstAchievement|legacyTrait|
  monument in src/` = ZERO). debt #60; game-mechanics §20.14(2). **★ DH-71 faction-handover
  DUPLICATE-politician** → a **SINGLE-OWNERSHIP CONSTRAINT on the unbuilt #1 faction-handover, NOT a
  shipped regression**, XS: a "steal" cloned David Brearley into two factions → a later gov-nomination
  pulled the WRONG one; the (new) transfer fn must MOVE not COPY (mutate the SINGLE `factionId`).
  CONFIRMED — the handover feature is itself unbuilt (`grep handover|transfer|steal|reassign in src/` =
  ZERO). Folds into #1. debt #63; game-mechanics §20.15.1. **★★ #177/#178/#114 ESCALATED IN PLACE
  (justification, NOT new scope, NOT a re-sequence):** #177 is now DESIGNED-AND-PLAYED-FORWARD (first
  source to run the federalism turn loop forward, §20.9) → highest-confidence next-era signal, the TWO
  `eraGraph.ts` walls confirmed unchanged; #178 now has LIVE forward-play evidence (Treaty of Paris
  auto-proposed at RevWar's end organizes Mississippi + NW/Ohio Territory; NW Indian War = win 5/5 land
  battles OR permanently cede Ohio, §20.13(5)); #114/E9/K5/DH-36 re-confirmed from the MULTIPLAYER end
  (Ted's meta-math POST 2671: ~50 CPU govs × ~3 actions × ~20% only move a crisis meter ~1-2 spaces →
  solo human is the design target; the 3-GM relay re-confirms DH-36 without a clean burnout quit).
  **No new keystone, no re-sequence, batch 26 nets 0; top-of-queue UNCHANGED — but the federalism
  era-content cluster (#177/#178 + #179/#180/#181/#182) is the KB's richest forward-played next-era
  target.**

- **Batch-25 ingestion (knowledge milestone).** Absorbed **ONE playtest**: **`principle1772`**
  (`049ce855`, a **1825-post DESIGNER-GMed SINGLE-PLAYER founding→federalism run** "Always stand on
  principle… even if you stand alone. A Single-Player 1772 Adventure"; **★ @MrPotatoTed [game
  CO-AUTHOR] IS the GM and hand-ran all NINE CPU teams himself while @vcczar live-ruled** — the
  cleanest, most designer-authoritative 1-human-vs-9-CPU run in the KB, one human [@10centjimmy] on a
  Washington-led Red team; ~1772→~1800 NATURAL endpoint, slowed by the GM's health/grad-school load,
  NOT a loss/win/burnout). The **7th captured 1772 source** and **literally the shipped game's
  intended 1-human-vs-9-CPU mode (#114) demonstrated end-to-end by the designer.** **CORROBORATION-
  HEAVY** + **TWO net-new federalism-era gaps [#177, #178]** + the **strongest #114/E9/K5 escalation
  in the corpus.** **★ #177 federalism foreign-affairs decision-event spine** → folds into **E1/
  scenario1788 + era-event/eraGraph (#92); couples to E12 diplomacy (#107/#162)**, M: an 8-event
  president/cabinet decision spine (French-Rev neutrality, Genêt, Pinckney/Jay Treaties, Haitian-Rev,
  alt-history "Bourbons Restored" `realEvent:false` branch, NW Indian War, Bank-recharter) with
  per-power diplomacy-relation + DomStab/EconStab + enthusiasm + implementation-blunder rolls + the
  late-1790s cabinet + Hamilton. **★ CONFIRMED hard-walled:** `eraGraph.ts::validate()` THROWS via TWO
  guards — `:153-155` (`chartIndex >= 49` "Federalism out of scope") + `:150-152` (the pre-1789
  president/cabinet decider ban) — so authoring it requires LIFTING BOTH walls (gate deciders on
  `year >= 1789`) + adding per-power diplomacy-relation meters (none exist; grep `relation|
  diplomacyMeter|foreignRelations` in `src/` = ZERO). The federalism-side companion to §20.3's `fed`
  spine; DESIGNED content the era graph deliberately omits. **Open Q (designer): confirm the intended
  next-era build, not a permanent scope wall** (V deferred the EV/territory %-chances, POST 1801).
  debt #57. **★ #178 treaty-grants-territory + bounded "3-strikes" retry** → folds into **statehood/
  territory + DH-61; GENERALIZES DH-61**, S, **PAIRS WITH #177** (Jay Treaty is the #177 carrier
  event): a treaty→`admitState` post-effect path (Jay Treaty grants WI/IN/IL/MI — the Oregon-Treaty
  §10.4.2 pattern) + a `retriesRemaining` (default 3) per-event budget (origin: the NW Indian War "3
  chances," POST 207) → one reusable per-event retry primitive across treaty/war/event gates.
  **CONFIRMED unbuilt:** `admitState` (`territories.ts:8-23`) admits only from the static
  `EXPANSION_STATES_BY_ID` registry; grep `treaty|retriesRemaining|retryBudget` in `territories.ts` =
  ZERO. **Open Q (designer): is ≤3-fires canonical for ALL territory gates, or a GM house rule?** debt
  #58. **★★ #114/E9/K5 ESCALATED (justification, NOT new scope, NOT a re-sequence):** the FIRST
  1772-cluster run to reach a natural endpoint, completable ONLY because the designer hand-simulated
  all 9 CPU factions (he REWROTE the CPU career-track heuristic mid-run, POST 323) → the per-faction
  CPU sim (E9 handler suite + K5) is the LOAD-BEARING prerequisite; the cluster now carries BOTH 4
  GM-burnout deaths AND a designer-paid completion. Raise confidence; do NOT move it. **★
  Corroborations:** #176 founding MilPrep ordering bug NOW DESIGNER-FLAGGED + 3rd-source (Ted: "Seems…
  dumb," POST 73/259-261); #153 command-bootstrap NOW 4-SOURCE (Whipple, emergent Iron-Fist Admiral,
  1st President with no celebrity head start); 7th-angle re-confirmation of #86/#133/#100/#101/#92/#62/
  #31/#45/#155/#158 + the kingmaker ≤1-protégé/turn cap (POST 224). **No new keystone, no re-sequence,
  batch 25 nets 0; top-of-queue UNCHANGED — but the CPU-AI cluster (E9/K5) carries the corpus's
  strongest justification.**

- **Batch-24 ingestion (knowledge milestone).** Absorbed **TWO founding-era playtests**:
  **`grass1772`** (`5b1b2c33`, a **544-post 2-human-vs-8-CPU 1772** "The Grassroots Divide";
  GM **@Cal**, NOT designer-authoritative — Ted/V posts are; ~1772→1788, **DIED of CPU-
  bookkeeping burnout** ["didn't have the time to run the two player factions and all 8 CPU
  factions," POST 328] then **relaunched by ADDING humans** [8-human + 2-CPU, POST 348]) +
  **`rookie1772`** (`0039e941`, a **1445-post one-player ROOKIE solo run** "We must hang
  together…"; GM **@matthewyoung123**, a self-described rookie, NOT designer-authoritative;
  ~1772→1788/1790 [Washington 1st President], abandoned to GM time-burnout). The **5th + 6th
  captured 1772 sources.** **CORROBORATION-HEAVY** + **ONE genuinely-new founding gap [#176]**
  + a **META-PRIORITIZATION justification raise.** **★ #176 founding MilPrep prerequisite-
  ordering fix** → folds into **E1 (founding/RevWar) + E6 (#67 meter caps)**, S: founding
  MilPrep is hard-capped at ~2 for the whole Era of Independence because the auto-forced 1774
  Continental Army/Navy bills can't move the meter (MilPrep 3-4 gated behind the federalism-era
  Militia Act ~1792) → a permanent founding military crisis (`grass1772#POST 86-90, 121` +
  `rookie1772#POST 26, 32-33`, both INDEPENDENTLY). An AUTHORING CONSTRAINT to honor when
  founding war-content + a meter-prereq ladder are built (shipped has NO tier-prereq system —
  `scenario1772.ts:9-17` boots `military:-2` as a raw scalar), NOT a regression; designer-gated
  open Q. **★★ The marquee is the META-PRIORITIZATION signal:** both runs DIED to the manual
  CPU-faction sim + opaque rules — the single biggest lesson across 24 batches and the **4th
  GM-burnout death** (with `modernday`+`pop2012b`); the **onboarding/solo-app/CPU-AI cluster
  (DH-69 + #114/E9/K5 + the DH-36 note)** now carries the strongest justification in the corpus
  (NO new scope). **★ Minor war constraints** → #155/#56: clamp the doubled-officer Planning
  term to 0-5 (XS) + a scripted-event WIN PATH on the generic `War` model (`grass1772`'s "King
  George grants autonomy"). **★ Corroborations:** #153 command-bootstrap NOW 4-SOURCE (Bartram);
  the founding cluster #86/#133/#67-#134/#100/#101/#92 + #159 ahistorical-Convention from a 5th+6th
  1772 angle. **No new keystone, no re-sequence, batch 24 nets 0; top-of-queue UNCHANGED.**

- **Batch-23 ingestion (knowledge milestone).** Absorbed **ONE playtest**: **`pop2012b`**
  (`409a7c18`, a **939-post 2012-START modern MULTIPLAYER**; GA-run [**Rodja**] but
  **@MrPotatoTed (game co-author) plays on Blue-5/Obama and his point-of-order corrections
  are DESIGNER-AUTHORITATIVE**). The **SECOND, DISTINCT 2012-start "Era of Populism" run**
  [`pop`/`c50d9da7` is the FIRST] — same seed / 10 named factions / archetype decks, different
  players/outcome (Ron Paul wins the GOP nom and flips OH+FL in a losing general; ran
  2012→the 2014-midterm cycle, did NOT cross an era boundary; **died at GA-burnout — Rodja
  resigned**, POST 932-938). **CORROBORATION-HEAVY** (a 2nd independent 2012-boot re-confirms
  the modern cluster) + **TWO net-new legislation-data gaps in EXISTING epics + one predicate
  sharpening + two clarifications.** **★ #174 committee bill-packaging + ranking-member counter**
  → folds into the committee/bill-packaging epic **E14b (#8/#9/#12, the E14 sub-PRs a/b)**: the
  fullest packaging spec in the KB (`pop2012b#POST 724` verbatim) — a **ranking-member
  un-package/repackage COUNTER** (5 trait gates) + **two chair-add-bill powers** (5 Legis+Efficient
  → off-committee tax; 5 Legis+Magician → one off-topic) + **cross-chamber/cross-committee package
  GUARDS** + the **Puritan committee-voting rule**; STACKS ON the still-unbuilt #8/#9 chair-block/
  package (two pipeline points; chair-side first); needs a ranking-member field on `committeeChairs`
  + `Bill.packageOf?: BillId[]`; binds at `phaseRunners.ts:3463`. **★ Cross-check the 5 gates +
  chair-add powers vs. `tedchange` BEFORE building** (open Q, single-thread source). S–M; verified
  UNBUILT (grep `rankingMember|packageOf|chairBlock` in `src/` = ZERO; runner chair-only at
  `:3463-3496` / `:3476`). **★ #175 law-repealability data model** → small data-model add INSIDE
  **#42 (bill-relationship graph, E29) + §27.5 (statehood-by-bill, E4b)**: MrPotatoTed ruling
  (`#POST 687-688`) — add **`Legislation.repealable: boolean`** + **`lawClass: 'repealable' |
  'replace-only' | 'permanent'`**; gate Repeal on the flag, expose Replace for **tax/immigration**
  (replace-only), mark **statehood** `permanent`; the concrete form of #42's constraints — build
  WITH #42, not standalone. **★ Open Q: authored per-bill list vs. per-row hand-marking** (joins the
  #120 dataset umbrella, E18d). S; verified UNBUILT (`Legislation` `types.ts:1506-1520` has neither
  field; grep `repealable|lawClass` in `src/` = ZERO). **★ #88 PREDICATE SHARPENING (no new item):**
  the apocalypse/coup endgame fires at the meter **FLOOR band, NOT "Crisis"** — `pop2012b` shows
  Planet's Health at "Crisis" with NO clock firing (`#POST 632`), so the predicate is `meter ===
  floorBand`, NOT `meter <= crisisBand`; folds into the existing #88/#158 end-condition + APOCALYPSE-
  clock work at **E6** (debt #28/#32, §9.1.4). **★ #15 VP-rubric + cabinet-decline-CPU-only =
  CLARIFICATIONS (no new build):** the canonical rubric already says "+1 if YOUNGER than 60" (NO "+1
  older than 60"), row 7 reads a discrete **`canBeIndependent` tag** (not office status), and cabinet
  accept/decline %s are **CPU-only** (gate behind `isCPU`; humans free-choose except VP) — all
  covered by **E16 + the convention rubric**; pin the AUTHORITY (MrPotatoTed). **Corroborations:**
  a 2nd 2012-boot re-confirms the modern cluster — **#86** (boot) / **#47/#13** (primary→convention→
  general) / **#15/#16/#18/#51** (VP-rubric / general / 2-layer scorer, "PRE-MIDTERMS STATE OF
  METERS" verbatim) / **#52** (SCOTUS) / **#25/#112/#124** (28-seat cabinet) / **#70** (leadership) /
  **#91** (12A-gated VP) / **#8/#9/#12** (committee) — confidence ↑; **#90/#43** procedural-pol-gen
  LIVE again as career-track starvation in the thin 2013 draft (2nd corroboration, → E8); a **3rd
  GM-burnout DEATH (Rodja)** strengthens the DH-36/DH-69/#114 automation argument (cite, not a row).
  Gap log gained **#174/#175 (NEW)**; corroboration tags appended to **E14 (#8/#9/#12) + E29/#42 +
  E6/#88 + E16 (#15/#124/#25/#112) + E20b (#18/#51) + E8 (#90/#43) + E10b/E24 (#47/#13/#91) + E25
  (#52) + the FROZEN-SPEC (#18/#51)**. game-mechanics §12.5.1 (#174), §12.9 (#175), §26.4 (#88
  floor predicate), §15.3.4/§25.2.1 (#15 rubric) + technical-guide §9 batch-23 lead + §9.6 appended.
  **Decision-gated / parking-lot counts UNCHANGED (batch 23 nets 0 — #174/#175 buildable in existing
  epics; the #174 `tedchange` cross-check + #175 authored-list question are designer/content-gated
  WITHIN their epics; #88 is a predicate, #15 a clarification, the burnout death a cite); top-of-queue
  UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** _Complete._
- **Batch-22 ingestion (knowledge milestone).** Absorbed **ONE playtest**: **`modernday`**
  (`65f81fe8`, a **3014-post 2016-START current-rules 8-human modern MULTIPLAYER** — **★ THE
  ONLY modern thread in the KB to CROSS AN ERA BOUNDARY** [the 2024 "Era of Populism"→"Era of
  the Near Future" transition]; GA-run [Rodja→ebrk85] but the marquee rulings are designer-
  blessed in-thread [Ted/vcczar adjudicate]). A **corroboration-heavy** batch + **TWO concrete
  modern build items that sit in EXISTING epics.** **★ #172 era-keyed confirmation thresholds +
  Nuclear-Option** → folds into **E16** (cabinet/confirmation) **+ E14c** (cloture): a
  `GameState.nuclearOption:{cabinet,scotus}` per-start-year boot flag (Cabinet 50%+1 / SCOTUS
  60% for 2016, Ted-authoritative `modernday#POST 422-423`) seeded by `scenarioBoot` + per-track
  threshold reads in the cabinet runner + SCOTUS-nom path + the SML enact/repeal action + the
  60→fail→10-vote-conversion→auto-Mod fallback; **composes with #124/#52/#171 + the batch-9
  cloture decision (do NOT re-litigate)**; S–M (verified UNBUILT — zero cloture/confirmation
  logic in `src/`). **★ #173 era-boundary-aligned starts** → **New-Game start-year PRESETS =
  the 14-band openings** on the scenario-boot picker (#115); each preset = a scenario-as-data-
  row on K4's `BootSheet`; S (verified UNBUILT — `NewGameScreen.tsx` hard-codes 1772/1856 only).
  **★ #68/#2 point-banking → SPEC-ANCHOR CONFIRMED** (the 6-clause banking ritual + score-reset
  + faction-trade window + procedural-content swap fired at a REAL 2024 boundary under current
  rules, `#POST 1871/1874/1902`, matches `rep1800`) — stays folded into K3/K4, NO priority
  change, spec now solid. **★ #171 PROVEN flipping ON (2016-2024)→OFF (at 2024)** in one save
  (`#POST 558/1902`) — sharpens debt #48, no scope change. **★ Two small bugs: DH-70** `Lackey`
  PV over-weight → a `pv.ts` note (when ported, add to `NEGATIVE_TRAITS` for the flat −5, NO
  special-case; shipped `pv.ts:77` already flat-−5's all negatives), XS; **DH-69** no in-app
  rules / legal-move surface → an onboarding/UX item, cite under #115/CPU-AI. **Corroborations:**
  **#43** procedural generator owns the modern→future band (dataset exhausts at the future
  boundary, `#POST 1902/1909`) → E8; #92/#41 (2016 + the 2024 crossing); #13/#47/#15/#16/#18/
  #51/#111 (legislative chain + the 2-layer scorer published verbatim, MATCHES the FROZEN SPEC);
  #124/#25/#170 (28-seat cabinet + CIA-Director-as-intel re-confirms #170's DNI⇒CIA-Director
  supersession); #70–#79/#1/#114 (CPU suite + 8-human MP handovers — solo adaptation); #110;
  #108; DH-54/DH-66 (impeachment ran to completion, short-cut special-committee step). Gap log
  gained **#172/#173 (NEW) + DH-69/DH-70 (NEW)**; corroboration tags appended to **#172/#173
  (E16/E14c/#115) + #68/#2 (K3/K4) + #171 + #43 (E8) + #124/#170 (E16) + the FROZEN-SPEC
  (#18/#51) + #70–#79 (E9)**. game-mechanics §27.2.1 (#68/#2 live), §9.3.10 (#172), §27.9 (#173)
  + technical-guide §9 batch-22 lead + §9.6 appended. **Decision-gated / parking-lot counts
  UNCHANGED (batch 22 nets 0 — #172/#173 are buildable in existing epics; DH-69 is UX, DH-70 is
  a pv.ts bug); top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** _Complete._
- **Batch-21 ingestion (knowledge milestone).** Absorbed **FOUR playtests**: **`nixon1972`**
  (`4853cf4d`, **417 posts / 4 chunks**, 1972-start modern MULTIPLAYER, GA-run, one half-term
  1972-1974 then GM-burnout stall before Watergate fired); **`cpufull`** (`1f72600c`, **74 posts
  / 1 chunk**, an **all-CPU 1772** founding traversal, GA-run, ENDED on a **scripted CPU
  game-over** — the Carlisle Peace Commission, the 2nd-ever KB game-ending); **`trump2024`**
  (`51dfaef1`, **87 posts / 2 chunks**, **Ted-run designer-authoritative**, 2024/Jan-2025-start
  modern MULTIPLAYER, **★ SETUP-ONLY**, abandoned before turn 1); **`solo1916`** (`5027f0f3`,
  **38 posts / 1 chunk**, a **1916-start SOLO** Progressive-Era/WWI run, GA-run, ~one half-term
  1916→~1918 then stall). **★★ ONE escalation, FIELD-FALSIFIED: #158 CPU anti-game-over** —
  `cpufull` is the **2nd live CPU game-over** and falsifies the flat-75%-oppose patch (applied,
  yet a game-ending peace passed at a **4-5-4 plurality** after the CC-President's reject was
  overridden) → **re-prioritize HIGHER within the CPU/war track**; the fix is re-scoped to a
  **HARD VETO / points-based anti-peace bias + a NON-plurality-overridable game-ending-peace**;
  it is a **SOLO-PLAY BLOCKER** and makes **#155 RevWar floor #3 LEAKY** (debt #32 escalated +
  #34a). **★ TWO era-keyed gaps (one PARTLY SHIPPED): #170** era-keyed offices (founding-seat
  half LIVE in `cabinetSeatsForYear` `types.ts:1196`; add modern departments + the **DNI⇒CIA-
  Director supersession**) → **extends boot/offices (E16), S–M** (debt #47); **#171** the
  era-keyed draft-ideology TOGGLE (OFF in the modern present, Ted-authoritative) → **folds into
  the #4/#108 draft-profile work, S** (debt #48). **★ ONE DH bug: DH-68** — Progressive-era
  successor-state events (Czechoslovakia/Hungary) fired before WWI ended → **folds into the
  DH-60 era-event-precondition work (now multi-era), S** (debt #49). **Corroborations:**
  `cpufull` re-validates the CPU suite #70–#79 end-to-end (confidence ↑); `trump2024`/`nixon1972`/
  `solo1916` confirm the modern band 2021-2025 + era bands at 1916/1972/2024 (#92/#41/#169);
  `nixon1972` corroborates crisis/war/Watergate (#11/#45/#106) + is ANOTHER GM-burnout stall;
  `solo1916` confirms the §5 hinge polarity + #108. Gap log gained **#170/#171 (NEW) + DH-68
  (NEW)**; corroboration tags appended to **#158/#155 (E3) + #70–#79 (E9) + #4/#108 + #170(E16)
  + DH-60/DH-68 (E15) + #92/#169 + #11/#45/#106**. game-mechanics §13.2+§21.1 (#158 escalation),
  §9.3.1.1 (#170), §4.1.w (#171), §10.4.8 (DH-68) + technical-guide §9 batch-21 lead + §9.6
  appended. **Decision-gated / parking-lot counts UNCHANGED (batch 21 nets 0); top-of-queue
  UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but #158's escalation elevates the CPU
  anti-game-over fix WITHIN the CPU/war track.** _Complete._
- **Batch-20 ingestion (knowledge milestone).** Absorbed **FOUR meta/design threads** (a
  LIGHT batch — almost no new code): **`planb`** (`094cc3a2`, **146 posts / 3 chunks**, the
  build-FINISHING PROCESS plan, NOT a playtest); **`dbomit`** (`4be5a005`, **106 posts / 2
  chunks**, a missing-pol REQUEST thread → #120); **`biden2021`** (`24061ad6`, **61 posts / 1
  chunk**, a modern era-CONTENT brainstorm); **`ampu2wish`** (`888ba777`, **61 posts / 1
  chunk**, the OUT-OF-SCOPE AMPU-2 wishlist). **★ ONE new runtime mechanic: #169** — the
  "Elderly President Drops Out of Reelection → endorses VP" mid-campaign replacement event
  (the Biden-2024 → Harris analog) → **a SMALL addition to the era-event epic E15 (S);
  DISTINCT from #37** (defeat-then-retire): #169 removes the candidate DURING the campaign, not
  after a loss. **DESIGNED, not built** (zero `dropOut|replaceOnTicket|endorseVP|midCampaign|
  forcedOut|stepAside` hits in `src/`); **the age roll it gates on ALREADY EXISTS** (the
  old-age ability-decay roll `ABILITY_LOSS_RULES.oldAge` `minAge:70` `types.ts:521` +
  `MORTALITY_RULES` + the PV age penalty `pv.ts:85`; the **candidate-relevant roll is keyed at
  70, NOT 75**). The net-new pieces: 50%-to-pull roll → flat **−1 party malus** into the §21.9
  modifier stack (**lands on the VP even when the pres is pulled**) → **VP swapped onto the
  ticket** in `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752`, already takes the
  ticket candidates as params). **Era-of-Populism-scoped until it fires twice.** **★ #168 — a
  PRE-BUILD AUTHORING-QUALITY PASS, NOT a roadmap code epic** (NO code surface): a
  **terminology contract** ("Army"→Military, human-rights→"criminal reform", ideology short
  forms, demographic standardization) + a **branch-path/meter-direction/%-multiplier sanity
  audit** of authored content (the DH-53 effect-SIGN family) + a **trait/interest compilation**.
  **Recorded as an authoring-process gate paired with #120** — the roadmap NOTES it, does NOT
  schedule it as a code task. **★ The CHRONOLOGICAL-IMPORT pipeline constraint** (Anthony
  imports pols/events chronologically; all changes route through vcczar, `planb#POST 37, 72`)
  is recorded as a **PROCESS note that orders the per-era CONTENT authoring** (founding before
  antebellum before modern) — it does NOT reorder the dependency-ordered ENGINE track. **★
  `biden2021` → MODERN ERA-CONTENT** (the 2021-2025 IRA/Infrastructure/SC-reform/Gaza-NATO/
  climate content list extends the modern band past 2020; #92/#41 / E30 / §28.13) — folds into
  the modern content tail, NOT a new epic; the ONE new mechanic is #169; the pardon pres-actions
  BLOCK on #122. **★ `dbomit` → #120** (the ~167-pol catalog + dataset-quality bugs via
  `CURATED_ROWS`/`ERA_FIGURES`, no per-pol rows; standardization rulings pair with #168;
  post-1772 start-game guide → #115). **★★ `ampu2wish` → OUT OF SCOPE — the roadmap schedules
  NO AMPU-2 wishlist item for AMPU 1** (day-by-day Paradox rebuild, full House, dynamic regions/
  biases, scouting/hidden-stats); QUARANTINED only. Two wishes are ALREADY-LOGGED AMPU-2 gaps,
  corroborated not re-logged: **DH-37** (pol-trading, the #1 AMPU-2 wish) + **DH-34** (dynamic
  biases — ship-static stands). `technical-guide.md` §9 updated with the batch-20 LEAD BLOCK +
  §9.6 one-line ordering; `game-mechanics.md` §10.4.7 (#169) + §30.11 (planb process + AMPU-2
  quarantine) added. **Decision-gated / parking-lot counts UNCHANGED (batch 20 nets 0 — no new
  author-before-build, no Decision-gated change; #168 is process, `ampu2wish` is quarantine);
  top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** _Complete._
- **Batch-19 ingestion (knowledge milestone).** Absorbed `fixes2022` — **"Suggested
  fixes — Fall 2022"** (`2d3ffb3e`, **948 posts / 15 chunks**), the **THIRD discussion-
  thread ingest and the EARLIEST of the three** (Oct 4 2022 → Sept 21 2023). Started by
  **@vcczar** ("Just post any suggested fixes below… I won't look until Anthony's working
  on the game again") — the **pre-early-release content-build + to-do-clear window**:
  vcczar's OWN additions (tier-1, authoritative) interleaved with cross-playtest balance
  suggestions (tier-4). **It PREDATES + SPAWNS `smallbugs`** (POST 637-640) and **predates
  `tedchange`** (chunks 13-15 = the same systematic 2.2-2.4 rules-doc cleanup Ted later
  formalizes). Corroboration- and provenance-heavy; mostly **#120 dataset work** (~20 named
  items + ~10 bill/event/SCOTUS effect-SIGN bugs + vcczar's own ~1800-legisprop audit) + a
  **scripted-event BUILD-OUT** (~30 events: Shaw/John-Brown demographic-removal + per-state
  abolition/suffrage/segregation/prohibition toggles + demographic-gated draft-ENTRY post-19A)
  that **CORROBORATES the shipped `EraEvent`/`Predicate`/`addPolitician` model, NOT a new gap**
  + the authoritative **late-start event-boot-filter rule** (strip pre-start-era events on a
  later start, POST 413-423). **★ ONE new gap: #167** (the no-eligible-successor presidential
  constitutional-crisis subsystem, POST 841-882) — **FOLDS INTO E10b** as the no-successor
  member of ONE E10b CRISIS FAMILY (verified UNBUILT — zero `successionCrisis|actingPresident|
  coup` hits; `vacateOffice` `phaseRunners.ts:2446` just nulls `presidentId` with NO successor
  path, so #167 and #61 bind on the SAME vacancy site): emergency-Congress succession-law vote
  (auto-signed) → House 1-vote-per-state acting-President election (**reuses the #62 contingent-
  House-election machinery — build #62 once, reuse for both**) → scaled DomStab penalty → coup
  branch (#88/debt #28 end-condition family); **★ ship the PPT-as-acting-President interim
  default FIRST (S), then the full House-election procedure (M); couples #61/#88/DH-54**.
  **★ PROVENANCE = build-CONFIDENCE (no scope): `fixes2022` is the EARLIEST source for
  #153/#135/#124/#121/#88** — designer intent from the START (raise confidence where they sit:
  #153/#88 debt #31/#32; #124 E16; #121 E3b; no resize/move). **★ ENTHUSIASM (#18/#51/#124) =
  the PERENNIAL-FORK RISK FLAG → FREEZE the spec** (the marquee risk flag: Anthony stalled ~½
  into 2.1; vcczar re-derives it differently each playthrough, POST 713-716) — RISK NOTE added
  to **E23 + E20b** that the #51 (drums 4-step) + #18 (terror2000 2-layer scorer) resolutions
  are a FROZEN SPEC, the single likeliest drift point. **★ Era-event FIRING-RATE budget**
  (~70%/era dynamic limit, POST 114-123) → small addition to **E15** (S; runner has none today,
  `phaseRunners.ts:2796`). **★ #120 dataset umbrella → folds the `fixes2022` batch in** (E18d;
  ~20 items + ~10 sign bugs → DH-53 + vcczar's ~1800-prop audit; Bob Scott dup = `smallbugs`
  §2b; one `CURATED_ROWS` pass). **★ Corroborations (tags, not rows):** the scripted-event
  build-out → the `EraEvent` system; the late-start boot-filter → BUG-1/#92; #88/OC-3, #61,
  #56-#60, #119/#39, #92/#72, #115, #38, #160/DH-67/#108, DH-27, DH-36 (the smallbugs genesis).
  `technical-guide.md` §9 updated with the batch-19 LEAD BLOCK + §9.6 one-line ordering;
  `game-mechanics.md` §24.1.2 (#167) + §29.3/§30.10 (provenance) added. **Decision-gated /
  parking-lot counts UNCHANGED (batch 19 nets 0); top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4
  + scenarioBoot → E1).** _Complete._
- **Batch-18 ingestion (knowledge milestone).** Absorbed `ideo1928` — **"Era of
  Ideologies"** (`e45a756c`, **1618 posts / 21 chunks**), the **FIRST 1928-START
  interwar campaign** — GA'd by **@10centjimmy** (a GAME-ADMIN, NOT the designer — so
  rulings are useful but not designer-authoritative; designer @vcczar / rules @MrPotatoTed;
  ONE Ted-authored ruling this batch, flagged), 8 human + CPU factions, opens at the
  Roaring-Twenties peak (Hoover + Republicans [RED] dominating Al Smith's Democrats
  [BLUE]), runs ~1928→~1936 (Hoover landslide → Great-Depression event fires LATE → FDR
  wins 1932, fades mid-term; the modern BLUE-economic-left is CREATED in play by the New
  Deal). Engine would run on `modern`/`progressive` tuning — UNBUILT. **★ HEADLINE = the
  ECONOMIC ENGINE: the SECOND era to exercise E4c** (after `arkzag`'s 1820s Bank-War /
  Panic-of-1837 arc) — the Great Depression is a **SCRIPTED ERA EVENT with VARIABLE
  timing** carrying a meter-shock bundle (EconStab −4 / Rev-Budget −2 / QoL/MilPrep −1 /
  Party-Pref −3) + an EconStab cascade (2 random industries −1 nationwide → EV reflow;
  meter-gating in crisis) + crisis-GATED legislation; the GA flags the era's static
  party-modifiers as too strong AND the Depression as too weak (DECOUPLED). The 1932
  Hoover-v-Roosevelt general exercised the #18 2-layer meter→election scorer LIVE; diplomacy
  (#107) corroborated with a 7-nation 1928 roster (no Israel); the "Republicanism vs Fascism
  vs Communism" / WWII framing is FLAVOR, not a war-engine trigger. Gap log gained **#160**
  (Depression-as-scripted-event + EconStab cascade + static-modifier decoupling), **#161**
  (1928 = 6th era-band start), **#162** (interwar diplomacy roster + flavor-not-war), **#163**
  (career-track pre-placement house rule), **#164** (mid-government start-state unsettled),
  **#165** (EconStab/gen-event effect-sign + auto-vs-roll ambiguity), **#166** (industry-
  impact auto-tally + meter-version drift); **DH-66** (impeachment "broken as is," VOIDED —
  3rd thread to confirm, corroborates DH-33/DH-54); **DH-67** (crash-modifier coupling — GOP
  craters with a healthy economy). `technical-guide.md` §9 updated with the batch-18 LEAD
  BLOCK + §9.6 sequencing + the E4c interwar-layer extension; `game-mechanics.md` §29.7.1
  (#160 economic engine + DH-67) added (NO re-sequence, NO new keystone, NO keystone moves):
  **#160 → EXTENDS E4c (M; build GENERIC across 2 eras, interwar content as data; couples E2
  + E6); DH-67 → the central #160 takeaway, S, build WITH #160 (event-gate the BLUE party
  bias to the crash at `calcStateVote` `phaseRunners.ts:3709-3711`); the confirmation
  AUTO-PASS gate → E16 / E9-handler-9d (S, Ted-authoritative `ideo1928#POST 213-214`, fixes
  the §25.5 36%-pass pathology); #161 → K3/K4 6-START-CONFIRMED (confidence, no scope);
  #162 → E12 era-keyed 7-nation roster (the #56-negative is a scoping note); DH-66 →
  STRENGTHENS the DH-54 impeachment parking-lot item to 3-thread-confirmed (await Ted's
  pending rewrite); #165 → DH-53 shared structured-effect-tables fix; #166 → the economic-
  engine/industry-scoring work; #163/#164 → BOOT (DH-25 career-track family + K4 `BootSheet`
  start-state); `ideo1928` corroboration tags appended to #116/#92/#41/#18/#51/#107 + DH-27/
  DH-53/DH-36; Decision-gated / parking-lot counts UNCHANGED (batch 18 nets 0); top-of-queue
  UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** _Complete._
- **Batch-17 ingestion (knowledge milestone).** Absorbed `ted1772` — **"I Think
  Something's The Matter With Ted — A 1772 Playthrough"** (`13c1b720`, **2404 posts / 26
  chunks**), the **4th captured 1772 thread** and the KB's **most-covered era** — a
  **Ted-run, MOSTLY-CPU** (6 CPU / 4 human; humans outnumbered even within their own
  party) founding→early-federalism campaign, ~1772→~1792, stalls mid-federalism (founding
  polarity BLUE = Patriot/anti-Federalist / RED = Federalist). **Deliberately
  CORROBORATIVE** (briefed as a few-NEW-gaps outcome): the **3rd CPU-heavy source** (after
  `terror2000` / `oopscpu` for the CPU suite) and the **4th independent 1772 source**
  (after `new1772` MP / `tea1772` solo-all-CPU / `85f8e6b4` solo-aesthetic) → **HIGH
  corroboration confidence** on the founding-boot, the CPU suite, the war engine, and the
  command-bootstrap. Distinct value: the **3rd-source confirmation of Ted's command/
  expertise house rules (#153/#136), applied front-to-back from a 0-Command boot — and
  the cleanest LIVE demonstration in the KB of the command-bootstrap producing an emergent
  President** (1st President Arthur St. Clair, a CPU pol who "started with none of the
  requirements," rose purely through play); the **fullest battle-by-battle RevWar trace =
  the #155 winnability data** (a genuinely-losable RevWar held up by THREE floors:
  French-alliance unloseable-flag + 2/3 peace threshold + Ted's new CPU-anti-game-over
  rule); and the **first solo-game-ender** (a CPU-controlled terminal peace node resolved
  FOR peace by point-math). Marquee value: **★★ #153 PROMOTED to build-with-confidence /
  ready** (3-source canonical + the St. Clair emergent-President audit; the ×2-Command-
  gain knob is the load-bearing unbuilt half, keystone-free); **★ NEW #159 Constitutional-
  Convention subsystem** (the full per-article voting machine + ahistorical-Constitution
  consequences — EXTENDS the shipped `constitutionalConvention.ts` superset skeleton);
  **★ NEW #158 CPU-anti-game-over** (one of the three RevWar floors); **★★ the three
  RevWar winnability floors PINNED as a HARD constraint on #155**; **FL-on-death RULED →
  immediate replacement** (shipped code still defers); **NEW DH-65** (founding-era
  same-name-wrong-century dataset errors + Cosmopolitan⊕Provincial both-held — the
  trait-exclusivity half is ALREADY engine-shipped). Gap log gained **#158/#159 (NEW)** +
  **DH-65 (NEW)** + the **FL-on-death resolution** + `ted1772` corroborations of
  **#56/#133/#70/#72/#74/#76/DH-61/#86/#136** (founding-boot + CPU suite + war engine +
  Congress across a 4th-1772 / 3rd-CPU campaign). `technical-guide.md` §9 updated with the
  batch-17 LEAD BLOCK (+ §9 batch-17 founding-boot-surface note); `game-mechanics.md`
  §17.3.y (#159 ConCon) / §13.2 + §25.7 (#158) / §21.1 (#155 three-floor constraint) /
  §4.1.y (#153 canonical) / §4.1.z (DH-65) / §10.1 + §8.3 (FL-on-death) added (NO
  re-sequence, NO new keystone, NO keystone moves): **#153 PROMOTED to build-with-
  confidence (S, the ×2-Command-gain is the unbuilt half, keystone-free; QW18 confidence
  raised); #159 → E1 founding-boot extension (M–L, extends `constitutionalConvention.ts`,
  leads with the slave-compromise→EV-penalty plank + the per-article eliminate-revote
  loop); #158 COUPLED with #155/E3 (build together, one of the 3 floors) + the three-
  RevWar-floor constraint documented on the #155 war-balance work (floor 1 shipped, floors
  2+3 build, 1772 must stay winnable); FL-on-death → small standalone fix (S, factor into
  `electFactionLeader`); DH-65 → E18d / #120 umbrella (XS, trait-exclusivity half already
  shipped); `ted1772` corroboration tags appended to #56/#133/#70/#72/#74/#76/DH-61/#86/
  #136; Decision-gated / parking-lot counts UNCHANGED (batch 17 nets 0; TWO forks resolve
  OUT — FL-on-death + #153-canonical); top-of-queue UNCHANGED.** _Complete._
- **Batch-16 ingestion (knowledge milestone).** Absorbed `hd1` — **"A House Divided"
  PART 1** (`c015a0cb`, **2699 posts / 44 chunks**), the **SEPARATE, EARLIER 1856-start
  run** distinct from `hd`/Part-2, a human-vs-CPU 1856→1868 alt-history (Chase
  president / Lincoln VP; secession 1860-61 off a bungled John-Brown's-Raid decision;
  CSA president Herschel V. Johnson, Davis only War Secretary; Union wins late 1864;
  ends the Era of Nationalism at 1868, crosses into the Gilded-Age draft, then RESTARTS
  as a fresh 1856 sim with vcczar's REVISED Reconstruction rules). GM
  @matthewyoung123 (his 3rd test, 1st Lingering run); designer @vcczar + @MrPotatoTed
  rule in-thread. The **3rd Civil-War run** / **5th antebellum source** → **HIGH
  corroboration confidence** on the war/Reconstruction/secession cluster, and the
  **FIRST run to play Civil-War→Reconstruction with HUMANS on both sides of the
  Reconstruction tug-of-war.** Marquee value: **★★ the Ironclad-vs-10% choice
  DEADLOCKED even with humans → states drifted back with NO plan (DH-29 MOVEMENT —
  the blocker is STRUCTURAL, not CPU-only)**, driving **vcczar's authoritative
  rewrite (NEW #156: 4 plan types — No-plan / 10% / Ironclad / Military-district — on
  both President + Congress + a "plan-adopted-by-Congress-OR-President" prerequisite so
  the President can adopt UNILATERALLY — the CANONICAL DH-29 FIX)**; a **★ "Union wins
  too easily" war-balance critique (NEW #155**; multiplier 1.0→0.5 + per-theater
  scoring adopted LIVE); **CSA-government seeding under-specified (NEW #157)**; the
  **`Southern Unionist` trait mislabeled on Southern/Black draftees (NEW DH-64)**. Gap
  log gained **#155–#157 (NEW)** + **DH-64 (NEW)** + the **DH-29 structural reframe +
  #156 fix** + `hd1` corroborations of **#56/#57/#58/#59** (the war/Reconstruction/
  secession/free-slave cluster across a 5th campaign). `technical-guide.md` §9 updated
  with the batch-16 LEAD BLOCK + §9.1.12 (the E3/E3b sequencing detail + the DH-29
  reframe); `game-mechanics.md` §23.4.1 (#156 4-plan model + DH-29 reframe) / §23.3
  (#155 war balance) / §23.1 (#157/DH-64) / §30.7 (vcczar ruling index) added (NO
  re-sequence, NO new keystone, NO keystone moves): **#156 RE-SCOPES E3b (d) as the
  4-plan readmission-half DoD = the canonical DH-29 fix (M–L, removes the K5 soft-dep
  for solo); DH-29 REFRAMED to structural-deadlock-fixed-by-#156; #155 EXTENDS E3 (war
  balance, M); #157 → E3b (a) (CSA seeding, S); DH-64 → E18d (dataset audit, XS);
  `hd1` corroboration tags appended; Decision-gated / parking-lot counts UNCHANGED
  (batch 16 nets 0); top-of-queue UNCHANGED.** _Complete._
- **Batch-15 ingestion (knowledge milestone).** Absorbed `terror2000` — the **FIRST
  NATIVE 2000-start campaign** (`3843d2da`, "Era of Terror 2000", **3566 posts / 46
  chunks**), a **Ted-run, CPU-heavy** modern run opening at **Bush's inauguration after
  Bush v. Gore (50-50 Senate)** and running **~2000 → ~2010** — the **4th Ted-run /
  CPU-heavy source** (corroborates the E9 suite) and the **2nd modern-era native run**
  (after `nuke`'s 1948 start). Distinct value: it produces the **FIRST PROVEN game-over
  / LOSS state in the corpus** — the run ENDS on the **first game-ending event ever in
  any AMPU playtest** (an "Autocratic Coup Ends America" 20%-off-HonestGov-floor roll →
  the dystopian "Rockefeather coup," #88) — and it **CLOSES the long-open #18
  meter→election state-scope fork** (Ted, the DESIGNER, reversed his own reading to V's
  2-layer model). Marquee rulings: the **cabinet→enthusiasm rework re-tuned LIVE** to a
  3-state channel (#124); the **Era-of-Terror −500/slighted-same-party-faction
  appointment-fairness penalty** (NEW #151); the **war engine proven to resolve in
  DEFEAT** (loss package + multi-phase, NEW #152); **0-Command rookies + DOUBLED
  Command-gain + no-reroll-on-held-expertise made official** (NEW #153); the **4-step
  elected-seat vacancy-fill ladder** (NEW #154). Gap log gained **#151–#154** (NEW) +
  **#18/#88 RESOLUTIONS** + corroborations of **#113/#56/#106/#85/#130/#90/#92/#102/#1/#135/#143/DH-25**.
  `technical-guide.md` §9 updated with the batch-15 LEAD BLOCK + §9.1.11 (the
  #18-promotion / modern-engine-wins sequencing detail); `game-mechanics.md` §29.3 (#18
  resolved) / §26.4 (#88 coup) / §21.1 (#152 war-defeat) / §9.3.7+§9.3.9 (#124+#151
  cabinet) / §30.6 (terror2000 index) added (NO re-sequence, NO new keystone, NO
  keystone moves): **#18 PROMOTED to ready-to-build E20b (leaves Decision-gated); #88 →
  E6 (one meter-driven endgame module); #152 → E3 (completes DH-47); E16 re-scoped 3× 
  (#124 3-state channel + #151 fairness); #153 → QW18; #154 → E16; Decision-gated −2 
  (User-gated 3→2, Designer-gated 11→10); corroboration tags appended; top-of-queue
  UNCHANGED.** _Complete._
- **Batch-14 ingestion (knowledge milestone).** Absorbed `gild1868` — the **FIRST
  dedicated native-1868 Gilded-Age campaign** (`bf590684`, "1868 The Gilded Age",
  **6318 posts** — the **LARGEST thread in the KB**), a multiplayer campaign that runs
  **1868 → ~1886** and **dies in GM burnout** (the 3rd GM-burnout death in the corpus,
  after `new1772`/`dem1820`). Distinct value: it is the **richest single record of the
  Gilded-Age issue engine actually being PLAYED** (tariff %, currency regime, civil-
  service, trusts, the 20-yr Reconstruction regime, AfAm enfranchisement, imperialism)
  — but the **Gilded Age is UNBUILT** (`Era` has no `gilded`, `types.ts:1337`; only
  `scenario1772.ts`/`scenario1856.ts`; the era is hand-run on `modern` tuning, gap
  #41), so the thread is **almost entirely the unbuilt design.** Headline value is
  **DOWNSTREAM GILDED-ERA CONTENT, NOT a re-sequence, NO new keystone**: it (1) **adds
  ONE NEW "gilded-era content" epic (EG)** — the five deltas **#147–#150 + DH-63** are
  ONE downstream era unit gated on **K3/K4 + #116/E4c + #42 + #57/E3b** (§9.1.10):
  **#147** tariff-as-%-rate (`game.tariffRate`) + mutually-exclusive `MonetaryRegime`
  enum, replacing the ±0.5 flavor bill at `phaseRunners.ts:3421` (M, on #116/E4c + #42);
  **#149** civil-service merit-vs-spoils axis + State-Gov-Jobs spoils lever + era-gated
  reform content (S–M, on K3/K4); **#150** the "1872 Rule" disorganized-loser special-
  election branch (S, niche; pairs with #57/#148 + #48); **DH-63** currency-regime
  exclusivity **folds into #42 + #147's MonetaryRegime** (XS–S, no standalone row);
  (2) **EXTENDS the #57/E3b Reconstruction epic with #148** — the 20-yr auto-expiring
  Reconstruction timer (`game.reconstruction`, begins 1864, auto-ends ~1884) +
  appoint-seceded-seats-by-Speaker/PPT-faction + a +2-RED bias-while-active → Solid-
  South sunset (FL/GA/LA Blue+3→+5, VA Blue+2→+5) + per-state early end by repeal-bill
  (S–M within E3b, **inherits the DH-29 solo-blocker**); (3) **STRENGTHENS #41** —
  `gild1868` is now the **full native spec** for the dedicated `gilded` era +
  `scenario1868` (red/blue-FLIPPED roster: RED = Republicans / BLUE = Democrats by 1868,
  POST 6; the Gilded nickname table; the era-event spine; the bill catalog; the SCOTUS
  docket; the 20-yr timer) — `scenario1868` is another scenario-as-data-row AFTER
  `scenario1788` + a mature `advanceEra`; (4) **CORROBORATES the standing Gilded
  cluster from a native start** (no new rows): `gild1868 (b14)` tags on **#13** (convention
  delegate-apportionment), **#14** (5-plank platform incl. Presidential-Action plank),
  **#15** (9-item VP rubric), **#52** (named-Justice SCOTUS docket + 10-yr drift +
  court-size bill), **#39** (amendment lifecycle), **#21** (extensible state-flag
  registry), **#42** (spending cap), **#3/#5/#6** (the Gilded content cluster); (5)
  **the 3rd GM-burnout death** reinforces the automation-reduces-upkeep argument behind
  the CPU suite (K5/E9) + #19/#20 (cite, NOT a row). Gap log gained **#147–#150 + DH-63**
  (NEW) + corroborations of **#3/#5/#6/#13/#14/#15/#21/#39/#41/#42/#52/#57**.
  `technical-guide.md` §9 updated with the batch-14 LEAD BLOCK + §9.1.10 "gilded-era
  content epic" dependency table + the polarity-flip note; `game-mechanics.md` §31
  (Gilded-Age era systems) added (NO re-sequence, NO new keystone, NO keystone moves):
  **EG epic added (downstream era-content); #148 → E3b; #41 strengthened to its native
  spec; corroboration tags appended; top-of-queue UNCHANGED.** _Complete._
- **Batch-13 ingestion (knowledge milestone).** Absorbed `oopscpu` — the **SECOND
  all-CPU run** (`699113d6`, "Oops, All CPUs", **350 posts / 7 chunks**), a **Ted-run
  all-CPU 1788 stress-test** and the **first DELIBERATE CPU-ruleset interrogation**
  (explicitly "to find where the rules are insufficient", POST 1, 5) — the CPU-AI
  validation source for the #70–#78 handler cluster. Distinct value: it is the first
  batch that **systematically validates a whole subsystem's spec (K5 CpuController +
  the E9 §25 handler suite) BEFORE it is built.** Headline value is **E9 DE-RISK, NOT
  a re-sequence**: it (1) **field-validates 6 E9 handlers** — #70 (9c leadership) /
  #72 (9a candidate + 9m VP) / #73 (9d cabinet) / #74 (9b legislation) / #75 (9g
  event) / #76 (9f conversion) go from "designed" to "designed + field-validated with
  concrete failure modes + Ted's fixes" (build-confidence bump, no new rows); **9e
  (convention #71) is the ONE handler NOT validated** (1788 predates conventions →
  stays `drums`-spec-only); (2) **folds the OC-1…OC-8 sub-gaps into the handler rows
  as sub-rules** — **★ OC-3 → 9b** (the ★balance-critical crisis-vote ideology-floor +
  secession check — the peaceful-1792-abolition bug); **OC-2 → 9c** (canonical
  `chamberControl(snap,chamber)` helper); **OC-1 + OC-5 → 9d** (scandal-resignee
  cooldown + court-as-firing-precedent gate); **OC-6 → the kingmaker handler**
  (highest Com+Leg+Gov tiebreak); **#72 sharpen on 9a/9m** (VP-retention HARD rule +
  pre-12A nomination trio); (3) **adds #143 post-election Command decay** (XS, RULED —
  40%/−1 Command for non-Pres/VP candidates per presidential cycle; binds at
  `runPhase_2_10_End` `phaseRunners.ts:4171` gated on `isPresidentialYear`) → **QW17**
  in the XS quick-win cluster; (4) **RE-SCOPES E10b further with the #61 death-branch**
  (S — VP-inherits-on-DEATH = FULL President, no acting/action-divert, NOT auto
  party/faction leader → re-run leadership IRV; "acting"/action-divert retained ONLY
  for the incapacity branch; Ted-RULED `oopscpu#POST 324-329`, SUPERSEDES the
  batch-11 `arkzag` read for the death case); (5) **adds DH-61 (S) + DH-62 (M) as
  explicit `scenario1788`/E1 PREREQUISITES** — DH-61 boot-seed era-active wars (the
  forgotten 1788 NW Indian War → a `BootSheet.activeWars` field + boot hook, folds
  into K4); DH-62 pre-12A two-vote/no-ticket EC mode + same-state-EV (an era-keyed
  election-mode variant → E4); (6) **adds OC-4 + OC-8 to the designer-gated
  sub-bucket** (→ 11 items, was 9): OC-4 off-ideology CPU draft gate (Ted wants "a
  better third way"), OC-8 define "office" + rewrite the Scandalous-Non-Office-Holder
  event (flagged to vcczar) — both OPEN, NOT ready-to-build; (7) **adds the
  ALL-CPU-TEST as a recommended repeatable spec-validation METHODOLOGY** (validated
  6 handlers pre-build, immune to GM-burnout DH-36; recommend a post-12A all-CPU run
  before building #71 / handler 9e — a methodology note, NOT a row); (8)
  **STRENGTHENINGS** (no new rows): #70–#78 field-validated from a founding angle;
  **#52 resolved for the all-CPU case** (CPU SCOTUS by ideology-distance —
  player-vs-CPU stays user-gated); **#76 4th-thread ideology-circle** (LW↔RW-Pop 25%
  cross-step); #144/#145(OC-7)/#146 procedural rulings slot into their topical homes.
  Gap log gained **#143–#146** + **OC-1…OC-8** + **DH-61 + DH-62** (NEW) +
  corroborations of **#70–#78 / #52 / #76**. `technical-guide.md` §9 updated with the
  batch-13 LEAD BLOCK + §6.6.1 handler-table field-validation tags + §9.6 batch-13
  ordering block + §9.1.3 methodology note (NO re-sequence, NO new keystone, NO
  keystone moves): **E9 de-risked (6 handlers field-validated, 9e flagged); OC-*
  folded into handler rows; #143 → QW17; E10b re-scoped (#61 death-branch); DH-61/DH-62
  → E1 prerequisites; OC-4/OC-8 → designer-gated (→ 11); methodology note added.**
  _Complete._
- **Batch-12 ingestion (knowledge milestone).** Absorbed the FIRST DISCUSSION-THREAD
  pair in the corpus — `smallbugs` (`cf82a7d3`, "A Thread for small low priority
  changes and errors", **804 posts** — the 3-yr+ rolling community-curated bug +
  ruling catalog with vcczar's nested rulings) + `tedchange` (`a0f0bf04`, "Discussion:
  Ted's Change Log of Doom", **408 posts** — the DESIGNER Ted's official rules-doc
  rewrite/cleanup channel, Sept 2024 → Oct 2025; the **HIGHEST-authority rules source
  in the corpus**). Distinct shape from playtests (no campaign clock, no GA-of-record);
  same authority class for the rule-doc patches (Ted in `tedchange`; vcczar in
  `smallbugs`). Headline value is **DESIGNER-RULINGS INTEGRATION + QW0 fully closes +
  one M-rework lands + 19 sized rulings slot, NO new keystone, NO re-sequence**: it
  (1) **CLOSES QW0/BUG-0** — the relocation cap is now ruled `4` + alt-state exemption
  (`smallbugs#POST 734-735` vcczar-12-30-25 approved), promoting QW0 from "open-design
  / build" to **"ready-to-ship, top-of-queue"** (one-line `RELOCATION_ATTEMPTS_PER_TURN
  = 5 → 4` at `types.ts:247` + a guard at the relocation accumulator so alt-state
  moves don't decrement the budget; verify in `runPhase_2_1_4_Relocations`); (2)
  **RE-SCOPES E16 to BUNDLE cabinet confirmation + #124 enthusiasm REWORK from day
  one (sized M, was XS-S)** — Ted's `tedchange#POST 1-4` re-architects the
  cabinet→enthusiasm path: lobby satisfaction now writes **POINTS** to
  `Faction.score?` (NOT enthusiasm); ideology composition (≥50% / ≤20%) drives
  enthusiasm via the existing ±3-cap clamp; **lands AFTER K2 + K5** (cabinet picks
  are CPU actions; consumes the conditional-vote-rules primitive); **numeric
  percentages stay designer-gated open** (ship a const table that re-tunes post-
  design); (3) **SLOTS the 18 other Ted-rulings sized + placed**: **12 XS** (#135
  50/50 House inverse-control one-liner at `phaseRunners.ts:1864` → Phase-1 #19;
  #136/#137/#138 draft re-rules → Phase-1 #1 / E1; #139 Pres signature in 2.6 →
  Phase-1 #2 / #14; #141 FL trait gain 5%+/3%- → Phase-1 #19; #142 CPU CJ ladder →
  E25; #131 Integrity-can't-nominate-Controversial → E16 + E25 + diplomacy filter;
  #132 Challenge-Legislation-can't-target-REPEAL → E11 / E25 filter), **5 S** (#126
  Pres 2-step Admin-then-Command blunder rule → E29; #127 ideology-shift / conversion
  schedule → E5b ideology-circle helper PR; #128 Kingmaker / Master Kingmaker scope
  → E20 election math at `calcStateVote:3711`; #129 Kingmaker→Protégé trait allowlist
  → E5b + Phase-1 #21; #130 death/retirement schedule + Hale + Frail-first → Phase-1
  #19 / pairs with #85; #133 1st/2nd CC composition rewrite → E17; #140 AnytimeEvo
  target-pool tightening → Phase-1 #19 / E9 handler 9g), and **3 M** (#124 cabinet
  enthusiasm rework → E16; #134 Lingering 7-step strict ordering + tax/tariff
  carry-forward → Phase-1 #6 / E6; #120 `smallbugs` dataset umbrella → ONE coordinated
  `scripts/seedDataset.mjs` `CURATED_ROWS` pass, ~100 items, also subsumes DH-43 /
  DH-51 / DH-28); (4) **SIMPLIFIES E5 + E25 build-target** — **Amendments NOT SCOTUS-
  challengeable** (`smallbugs#POST 250-269` vcczar OVERRIDES `tea1772` #100): **drop
  the SCOTUS-overturns-amendment branch from both E5 and E25 scope** (keep E5's
  strike-a-statute + mutable-threshold + #119 lifecycle; keep E25's docket + Justice
  drift + DH-32 state-guard); (5) **ADDS the Decision-gated SUB-BUCKET split** — the
  existing user-gated bucket stays (waiting on the human's design call: #52 player-
  SCOTUS, #18 state-scope, the delegate-class fork, contingent-election #10/#84,
  §25.9 Iron-Fist split, DH-12/13/14/15, DH-25 career-track bootstrap, DH-33 + DH-54
  impeachment/succession, DH-41 SCOTUS cascade, DH-49 population model); the NEW
  designer-gated bucket holds the **9 open `tedchange` items** (NOT ready-to-build
  until Ted/vcczar closes them in `tedchange`/`smallbugs`): **(1) Mil-Prep meter level
  4 fix** (3 proposals 30/40/30, 30/60/10, 40/50/10), **(2) #125 Universal Election
  Modifier (UEM)** — proposed but pushback on stacking + age modifiers, **(3) Crisis
  trait consolidation**, **(4) term-limit Gov actions in pre-Senate era**, **(5)
  faithless-elector rewording**, **(6) party rename trigger PL-vs-EraEvo**, **(7)
  VP-must-be-same-party-on-resignation relaxation**, **(8) cabinet enthusiasm
  percentages** (the #124 numeric), **(9) cabinet ideology weighting Big-4-vs-rest-
  vs-cabinet-level**; (6) **STRENGTHENINGS, not new rows:** **#76 (CPU conversion
  adjacency)** EXTENDED via `tedchange` (same-party can target same OR ADJACENT
  ideology); **#99 (ideology=circle)** now **TED-AUTHORITATIVE** — 3-thread
  corroboration becomes designer-ruled (25% LW↔RW rate pinned; auto-Two-Faced grant);
  **#67 (Lingering bank ordering)** RULED → #134 (canonical 7-step + carry-forward);
  **#100 (Gov-requested SCOTUS review of amendments)** OVERRIDDEN by Ted/vcczar (mark
  superseded in the build-target); (7) **NEW gaps:** **#121 Secessionist trait
  missing from the politicians dataset** (XS — dataset addition + a one-row `Trait`
  union add; folds into the #120 umbrella + the secession trigger E3b sub-PR (a));
  **#122 pardon mechanics entirely unspecified** → **designer-gated parking-lot item**
  (no rules to build to yet); **#123 small late-modern content bundle** (Wyoming Rule
  → Real House Act 585-cap, runoff-elections for the runoff-amendment, Senate-Abolish
  amendment) → folds into Phase-2 #28 / #30 (the existing modern-content rows). Gap
  log gained **#120–#142** (NEW) + corroborations of **#67/#76/#99/#100** +
  DH-43/DH-51/DH-28. `technical-guide.md` §9 updated with the batch-12 LEAD BLOCK +
  §9.6 batch-12 paragraph + §2.1.1 batch-12 data-shape rows (NO re-sequence, NO new
  keystone, NO keystone moves): **QW0 fully closes (cap=4 + alt-state guard)**;
  **E16 re-scoped M to bundle cabinet confirmation + #124 from day one**; **18 other
  Ted-rulings sized + slotted into existing epics**; **E5 + E25 simplified by the
  amendments-NOT-SCOTUS build-target**; **Decision-gated split into user-gated +
  designer-gated buckets**; **#76 / #99 / #67 / #100 strengthened/superseded
  inline**. _Complete._
- **Batch-11 ingestion (knowledge milestone).** Absorbed `arkzag` — the **first
  FULL-ARC 1820→1840 continuation** ("Ark and Zags — The Era of Democracy",
  152c2881; **2531 posts**, the direct continuation of batch-10's `dem1820` 1820 save
  run forward through fictional D-R presidents Benton→Cheves→Enoch-Lincoln→Dudley to
  1840 — a party system that never realigns). It is the thread that finally
  **exercised the LATE-GAME systems batch 10 never reached**: multi-cycle presidential
  elections, the Bank-War→Independent-Treasury economic arc, Force-Bill/tariff fights,
  amendment machinery, and a presidential **assassination → succession**. The headline
  value is **placement + ONE fork-resolution, not a re-sequence**: it (1) **adds NEW
  small epic `E4c`** — the **#116 Jacksonian Bank-War → Independent-Treasury long-run
  ECONOMIC content state machine** — placed **AFTER E2 + E6 + E4b(b)** (it recharters/
  replaces E4b(b)'s Second Bank, needs E2's `Bill.type`/crisis-bypass + E6's EconStab
  meter); built **EMERGENT** (recurring CRISIS bills resolving an EconStab CRISIS via a
  `Bill.replaces` field + a per-bill-class `lockedUntilYear` tariff cooldown), with
  "scripted-vs-emergent" carried as a design note; (2) **RE-SCOPES E5** (amendments)
  with **#119**'s explicit lifecycle (propose→committee→floor→**governor-ratify**→
  active) + the **active-amendment-blocks-a-legislation-class** hook + the
  **un-bundleable** flag — NOT a new epic; (3) **RE-SCOPES E10b** (succession) with
  **#61**'s VP-succeeds-on-death → fill-VP (gated on E5's VP-vacancy amendment) →
  acting-president action-divert roll + trait side-effect — noting the **kill trigger
  already SHIPS** (`anytimeEvents.ts:232` → `vacateOffice` `phaseRunners.ts:2449`), so
  the **succession ENGINE is the work**; the **line-of-succession/impeachment half
  stays parking-lot (DH-54)**; (4) **PROMOTES #51 to E23 `ready`** — the `arkzag` final
  chunk published the `drums` **4-step enthusiasm-reshuffle + −100/waiver rule**
  verbatim (settling the `dem1820` fork to `drums`, NOT Ted's "every state" / Matt's
  "primaries-only") — and marks the **±3 cap UNCONDITIONALLY ready** (ships with E6);
  **#51's "fork" entry LEAVES the Decision-gated category**; (5) **adds a NEW
  delegate-class fork to Decision-gated** (AI-allocator-by-EV-formula vs player-rigged —
  a pick before E10's delegate-apportionment sub-PR), so Decision-gated stays at **2
  items (#18 state-scope + delegate-class)**; (6) **slots DH-59** (relations-meter
  under-floor, XS → **E12** when the 9-point scale is built) + **DH-60** (era-events
  fire with no territory/asset prereq, S → **E15 + BUG-1**, a `requires?: Predicate` on
  the era-event row); and (7) **re-confirms #115 scenario-boot priority UNCHANGED** (the
  continuation-boot proved a mid-game save can be picked up cleanly) + **flips the
  meta-signal POSITIVE** — no GA-burnout this time (heavy scripting absorbed the upkeep)
  → a **3-thread automation-reduces-upkeep signal** (cited as the E9/#55/#115
  prioritization argument, NOT a row). Gap log gained **#116** + **#119** (NEW),
  **#51 FORK-RESOLVED**, **DH-59 + DH-60** (NEW), + corroborations of
  #61/#13/#111/#11/#44/#92/#52/#59/#40/#85/#115. `technical-guide.md` §9 updated (NO
  re-sequence, NO new keystone, NO keystone moves): **E4c added (deps E2+E6+E4b(b),
  emergent)**; **E5/E10b re-scoped**; **#51 promoted to E23, ±3 cap un-gated**;
  **delegate-class fork added + #51 fork removed from Decision-gated**; **DH-59/DH-60
  slotted**. _Complete._
- **Batch-10 ingestion (knowledge milestone).** Absorbed `dem1820` — the **first
  1820-START** in the KB ("1820 — The Era of Democracy", cc37d770; a NEW 1820
  scenario start, Monroe's 2nd term / late Era-of-Good-Feelings → Jacksonian "Era of
  Democracy"; **947 posts**, 10-human MP with the **1788/1800 polarity** — BLUE
  Dem-Republicans + RED Federalists/National-Republicans). A **short, corroboration-
  rich** thread (runs ~1.5 turns to ~1822-23; **GA-burnout-killed in real-time Aug
  2025**, never reaches the 1824 cycle / Jackson / Nullification). The headline value
  is **PROMOTION + decision-gating, not new scope**: it (1) **promotes the scenario-
  boot pipeline (#115) to the front of the subsystem queue — folded into K4's
  `BootSheet` schema (NOT a new keystone)**: there are **NO documented rules for
  CREATING a game**, so the build's shared `scenarioBoot(BootSheet)` pipeline must
  canonicalize the improvised GA setup (strip-Command house rule, inaugural career-
  track seed from the last-3 classes, era-keyed industry init, Senate-class assign,
  vacant-seat fill); built **WITH the first new scenario before the third hand-
  authored copy**, and the venue for the XS boot validators + the appointment-ladder
  (#115b); (2) **decision-gates TWO forks** the build cannot pick alone — **#52
  player-controlled SCOTUS** (3 live models; docket data structure needed either way
  → E25) and **#18/#51 meter→enthusiasm→election** (3 live models; the settled ±3 cap
  is a queued XS clamp blocked on the pick); (3) **slots sized corroborated fixes** —
  **DH-53 bill-EV-sign S** (author structured bill-effect tables → E20/K4), **DH-24
  Senate-class XS** (boot pipeline / QW8), **focus-Rep (EV−2)/5 #55 M** (E7+E28),
  **statehood→sectional-crisis #59 S** (E3b additive at `admitState`),
  **appointment-ladder/replacement-gains #115b XS** (boot/appointment rules); (4)
  **makes the #92 era-band model 4-START-CONFIRMED** (1772+1800+1820+1948 — the
  draft table prints the Democracy/Manifest-Destiny bands), a confidence bump on
  K3/K4; and (5) **records the ★★ 2nd GA-burnout DEATH** (DH-36, after `new1772`) —
  the prioritization ARGUMENT for the upkeep-reducing items (NOT a row). Gap log
  gained **#115** (no rules for creating a game → scenario-boot pipeline) +
  corroborations of #1/#18/#24/#44/#51/#52/#55/#59/#61/#76/#86/#92/#101/#108 +
  DH-24/DH-25/DH-27/DH-36/DH-53 from a NEW start year. `technical-guide.md` §9
  updated (NO re-sequence, NO new keystone): **#115 promoted to the front of the
  subsystem queue inside K4's `BootSheet`**; **#52 + #18/#51 recorded decision-gated**;
  **DH-53/DH-24/#55/#59/#115b sized + slotted**; **#92 4-start confidence bump**;
  **DH-36 2nd-death cited as the upkeep-automation prioritization argument**.
  _Complete._
- **Batch-9 ingestion (knowledge milestone).** Absorbed `nuke` — the **Nuclear-Age
  / Cold-War / modern-half campaign** (a 1948-start "Era of the Nuclear Age
  1948–2000 → Era of Terror 2000–~2005" thread; at **12,228 posts the LARGEST
  corpus in the KB**). It is the **chronological predecessor of the
  already-documented `modern` 2004-2020 thread** — joined at the 2004 election — so
  the **KB now spans a CONTINUOUS 1772→2020 timeline.** The headline value is
  **confidence + scope-control, not new scope** (a *final-role* confirmation pass):
  it makes the **era model 3-START-CONFIRMED** (1772 `tea1772` + 1800 `rep1800` +
  **1948 `nuke`** all emit the band model) and adds the **two-level era refinement**
  (Historical Eras carry **rule-deltas** — the Era-of-Terror cabinet rework — AND a
  separate per-decade census doing EV-realloc + bias-re-lean + content-rotation),
  and it records the **★★ NEGATIVE SCOPE finding — no Cold-War subsystem to build**
  (only `revolutionaryWar.ts` exists; the Cold War = the generic war engine + the
  diplomacy subsystem + content). Gap log gained rows **#106–#114** (Cold-War =
  relabeled generic war [no nuclear/MAD/NATO/space/branch subsystem; USSR never
  falls]; the diplomacy subsystem [8 relation meters + ambassador actions]; gradual
  4-lever realignment; era CONTENT fires on its own scripted clock; the modern
  election machine; the modern institutional layer [impeachment/resignation/
  legislated-court-size/force-vote]; Era-of-Terror content; **★ #114 — the
  design-intent statement that the APP is 1-human-vs-9-CPU**) + design-holes
  **DH-45..DH-58** (USSR-collapse trigger chain stalls; diplomacy lacks downward
  pressure; **★ DH-47 wars NEVER resolve / no army-navy-air branches**; **★ DH-48
  era-event data needs structured `evDelta`/census fields — Neocon census events
  LOST as free-text**; era-event scheduling; **★ DH-49 no population model + House
  cap**; modern pols OVERPOWERED/recency-biased; landslide-margin-cap; bill-catalog;
  **★ DH-54 impeachment/succession never in the rules doc**; 3rd-party engine
  2-party-hard-wired; conflicting career-track rule-sets; convention/handler holes).
  `technical-guide.md` §9 hardened (NO re-sequence, NO new keystone): **★ K3/K4
  TWO-LEVEL refinement + structured-era-event-data requirement** (§9.1.5 updated;
  "Neocons" logged as a faction-rebrand NOT a band); **★★ the NEGATIVE-SCOPE
  Cold-War guard** (§9.1.8, new); **★ K5 + the handler suite elevated to
  load-bearing** (§9.1.3 priority bump); **E16 extended to create-AND-abolish cabinet
  seats**; **legislated-variable-SCOTUS-size folded into E25**; **`scenario1948`
  added as a 4th `BootSheet` boot shape at E30**; **Senate-threshold recorded
  resolved-in-code / open-design**; **DH-49 + DH-54 added to the parking lot (→ 12)**;
  **DH-45..DH-58 + #105/#108/#109/#112/#113 classified into existing epics**.
  _Complete._
- **Batch-8 ingestion (knowledge milestone).** Absorbed the **two 1772 threads**:
  **`new1772`** (the **first MULTIPLAYER 1772 founding campaign** — 10 humans
  1772→1796, the only thread that stands up the entire federal apparatus
  piece-by-piece from a 1772 start; **abandoned at GM burnout**) + **`tea1772`**
  (a 157-post **solo all-CPU 1772→1874 fast-traversal** that stalls mid-Gilded —
  "Stamping out America's love for tea"). The headline value is **confidence, not
  new scope**: this batch makes the era-model the **single most-corroborated
  architectural finding in the KB — MULTI-SAVE PROVEN** (two independent saves,
  1772-start `tea1772` + 1800-start `rep1800`, 28 in-game years apart, emit the
  **identical era-band labels at the same in-game dates** — game-context #102).
  Gap log gained rows **#100–#105** (SCOTUS-overturns-a-ratified-Amendment +
  threshold-amendable; the multi-save era-band proof; dual era-scoring [per-era +
  cumulative] as the WIN-CONDITION scoreboard; presidential-vote modifier stack +
  era-issue list; lone-ideology convention exploit; stat-collapse → forced
  presidential resignation) + nine design holes **DH-36..DH-44** (GM-burnout META;
  no pol-trading; late-ratification/Rogue-Island window; all-human Convention
  deadlock; SCOTUS-justice-count-not-auto-packaged → game-stall; ★ the general
  SCOTUS-ruling → downstream-statute cascade [UNBUILT, `vcczar`-deferred];
  national-meters swamp per-state lean; Vermont no-home-state; post-12A
  legislature vote-count). `technical-guide.md` §9 hardened (NO re-sequence): **★
  K3/K4 bumped to HIGHEST confidence** (§9.1.5 batch-8 confidence bump — multi-save
  proven); **★ E16's dynamic-seat refactor justification strengthened** (the WRONG
  model confirmed founding→modern); **★ DH-41 added to the author-before-build
  parking lot** (now 10); **#100/#103/#104/#105 + DH-38/39/40/42/43/44 folded into
  their epics**; **DH-43 added as QW11** (Vermont dataset fix); **DH-36 cited as
  the META justification** + **★ the no-future-era NEGATIVE-RESULT guard added**.
  _Complete._
- **Batch-7 ingestion (knowledge milestone).** Absorbed `rep1800` (the "Era of
  Republicanism" 1800→1868 early-republic campaign — the **first procedural
  record of the 1800–1856 early republic**, Jeffersonian → Era-of-Good-Feelings →
  Jacksonian → Manifest-Destiny → Nationalism → 1868; the **predecessor of
  batch-1's `gilded`**, so **the 1800 campaign is now documented end-to-end**).
  The headline value is an **architecture reframe** — eras are content-bands
  gated by game-state + territory ownership, NOT the calendar. Gap log gained
  rows #92 (★ eras-as-content-bands), #93–#98 (12A before/after state machine;
  slavery-as-state-flag + Cohens-v-Virginia amendment-only abolition; Second
  Bank recharter clock + Bank War; 20-state Call-for-Convention crisis;
  Civil-War VARIANTS [Pres-defects-to-CSA / Hartford / Northern / UK-intervention
  / guerrilla]; coup-at-low-meters meters-driven game-over set) + #99
  (ideology-scale-is-a-CIRCLE) + 7 design-holes DH-29..DH-35;
  `game-mechanics.md` gained §27 + §19 divergences #18-#22; `technical-guide.md`
  §9 re-sequenced: **★ K3/K4 re-specced for the era-model reframe** (§9.1.5 —
  `advanceEra` becomes CONDITION-DRIVEN; content gated on `eraBand` + a new
  `territoryOwned` predicate, not calendar; reconciles #68 + §26 + §27.1 — NOT a
  new keystone); **★★ the Reconstruction SOLO-BLOCKER (DH-29) added as a hard
  BUILD REQUIREMENT on E3b** (§9.1.6 — the Strict/Ironclad plan can NEVER pass
  with CPU → solo Reconstruction unwinnable); **★ ideology-as-CIRCLE added as
  Phase-1 #5b** (§9.1.7 — central `ideologyDistance` helper + migration behind an
  era-gated flag); **new early-republic subsystems** folded into E1 + Phase-1
  #4/#4b (12A elector toggle, slavery-flag+Cohens, Second Bank+Bank War,
  statehood-by-bill+territory-gate); **era-events-predating-start MERGED into
  BUG-1** (LIVE-confirmed) + **DH-30 event-scheduler-min-floor added as QW10**;
  **DH-31..DH-35 classified**; **`scenario1800` noted as an optional later boot
  sheet**. _Complete._
- **Batch-6 ingestion (knowledge milestone).** Absorbed `c50d9da7` (the "Era of
  Populism" 2012 fresh-modern boot playtest, 1172 posts — the **first dedicated
  fresh-boot of a modern-era scenario** in any ingested thread). The unique
  value is **scenario-boot model + a NEW meter-driven endgame**. Gap log
  gained rows #86–#91 (scenario-boot schema, era-coded double-points,
  APOCALYPSE meter clock, bill-creates-cabinet-seat, era-coded procedural
  pol-gen start-year, amendment-toggled VP action) + 5 new design-holes
  DH-24..DH-28 (Senate-class boot data, career-track bootstrap unresolved,
  3rd-party VP-trait prohibitive, `TRAIT_CONFLICTS` not enforced at boot,
  meter-tag completeness); `game-mechanics.md` gained §26 + §19 divergences
  #14-#17; `technical-guide.md` §9 re-sequenced: **K4 absorbs the `BootSheet`
  schema** as the cross-cutting build constraint; **K2 gains
  `requires?: AmendmentPredicate` from day one**; **Phase-1 #6 absorbs the
  APOCALYPSE meter-driven endgame** (sized M; §9.1.4); **E16 absorbs the
  dynamic cabinet seat list** (divergence #15); **Phase-2 modern epic splits
  into TWO scenarios** (`scenario1948` continuation + `scenario2012` fresh-
  boot); **2 new XS validators** (DH-24 Senate-class + DH-27 `TRAIT_CONFLICTS`)
  added as QW8 + QW9; **DH-25 career-track bootstrap** added to parking lot
  as a blocker on Phase-2 modern scenarios; CPU handlers #2 and #4 gain the
  **conditional-vote-rules primitive** (`pop` POST 1111). _Complete._
- **Batch-5 ingestion (knowledge milestone).** Absorbed `e1776bbd` (the all-CPU
  1841→1924 "Drums of War" playtest, 7540 posts — the **first explicit forum
  record of CPU heuristics**). The unique value is **agent-decision
  specification**, not new mechanics. Gap log gained rows #70–#85 (15 CPU
  handlers + 6 corroborating non-CPU items + DH-12..DH-23); `game-mechanics.md`
  gained §25 (720 lines, 15 CPU subsections) + §19.1 divergences #10–#13;
  `technical-guide.md` §9 re-sequenced: **K5 added as a new late-keystone** (~120
  lines, parallel with K3/K4); a **CPU handler suite epic** added at Phase-1 #9
  with 15 parallelizable PRs; the **cabinet 36% bug (DH-23) re-sized XS-S**
  because the system doesn't exist yet; generic war (E3) updated **multi-theater
  + tiered** with the multi-confirmed formula; **Iron Fist split** (§25.9) added
  as Phase-1 #17 (needs design); **divergences #10–#13** added; #79/#80/#82/#83/
  #85 marked READY (#85 as a new quick-win); contingent-election rules (#10/#84)
  + §25.9 + DH-12/DH-13/DH-14/DH-15 added to the parking lot. _Complete._
- **Batch-4 ingestion (knowledge milestone).** Absorbed `77db6e6f` (the
  1856-native "A House Divided" Part 2, 1856→1904, 9051 posts — the first
  1856-native procedural record and the only source for the Civil-War /
  Reconstruction / secession era). Gap rows #56–#69; divergence **#9** (the
  stale relocation cap → **BUG-0**); nine design holes **DH-3..DH-11**.
  `game-mechanics.md` gained §23 + §24 + the §2.5 banking note; `technical-
  guide.md` §9 re-sequenced (BUG-0 front; Civil-War epic at Phase-1 #3b; #54
  ready; point-banking folded into K3/K4). _Complete._
- **Batch-3 ingestion (knowledge milestone).** Absorbed `3a9ac985` (the modern
  1948→2020 multiplayer campaign, 2276 posts). Gap log grew with modern rows
  #47–#55 + A9 + DH-1/DH-2; `game-mechanics.md` gained §22 + divergences #7/#8;
  `technical-guide.md` §9 re-sequenced into Phase-0/1/2, pulling the two scaling
  walls + meter generalization near-term; the cabinet-wipe finding corrected.
  _Complete._
- **Batch-2 ingestion (knowledge milestone).** Absorbed `f55d3e21` (1788
  federalism, 732 posts) + `85f8e6b4` (1772 solo aesthetic, 90 posts). Gap log
  to ~54 rows + A1–A8 presentation + 3 confirmed bugs; `game-mechanics.md`
  gained §20–§21 + divergences #4–#6; `technical-guide.md` §9 → the two-track
  plan. _Complete._
- **Batch-1 ingestion (knowledge milestone).** The four planner docs stood up
  and absorbed the `f4c7c2c4` 1868 Gilded-Age dry-run: gap log to ~41 rows,
  ~12 new `game-mechanics.md` sections, the `ActionRegistry` keystone
  identified, three design divergences resolved. _Complete._
- **PR7 — Lobbies → expertise → industry + faction ideology.** Lobby cards
  trickle expertise to members (2.1.2), `LOBBY_INDUSTRY` nudges state industries
  (2.1.8), `EXPERTISE_IDEOLOGY_LEAN` biases `factionCenter`. _Complete._
- **PR6 — Trait pass B (governance/cabinet-facing).** `TRAIT_GOVERNANCE_EFFECTS`
  drive lingering meters, era-event modulation, military-command grants,
  Secession-Winter band. _Complete._
- **PR5 — Cabinet overhaul.** Per-seat scoring (`CABINET_SEAT_SCORING`),
  expertise gating + grants (`OFFICE_EXPERTISE`), admin double on confirm,
  era-conditional seats (`cabinetSeatsForYear`). _Complete._
- **PR4 — Trait pass A (election-facing).** `TRAIT_ELECTION_EFFECTS` /
  `TRAIT_ELECTION_BANDS` give real per-context magnitudes to election traits.
  _Complete._
- **PR3 — Trait loss + conflict machinery.** Old-age trait decay + d6 conflict
  arbitration (`TRAIT_CONFLICTS`, `tryGrantTrait`). _Complete._
- **PR2 — Ability earn/loss alignment.** Missing command grants + the loss
  machinery for all six skills + command; primary/secondary track grants.
  _Complete._
- **PR1 — Expertise axis foundation.** New `Expertise` type (19 tags) +
  `expertise` field; migrated the 8 mis-filed expertise-as-trait strings off the
  `Trait` union (incl. `repair()` save migration + dataset regen). _Complete._

---

## Up next

> **Two tracks, run in parallel by separate workstreams.** Within a track, order
> is the product — nothing depends on something below it. The engine track is the
> bottlenecked dependency chain in **three phases**: Phase 0 (keystones), Phase 1
> (near-term subsystems — the federalism epic, the Civil-War epic that completes
> 1856, the cross-cutting items the modern thread pulled forward, the **batch-5
> CPU handler suite**), Phase 2 (the far-end deep-modern epic, builds last). The
> presentation track shares only a handful of small additive `Politician`/
> `Party` fields + two deeper handoffs and can be staffed independently
> (tech-lead §9.4, §9.6).

### Quick-wins — land immediately (XS each, high feel-value)

Fixes + cheap divergence/balance resolutions. **★★ Batch-12 — BUG-0/QW0 IS NOW
FULLY SETTLED (cap=4 + alt-state EXEMPTION GUARD, vcczar-12-30-25 RULED via
`smallbugs#POST 734-735`) — DO IT FIRST, it's the top of the queue.** **BUG-1 is
the exception that matters:** it is XS but a **hard gate on the federalism epic**
— land it *in or just before* E1. **Batch 7: BUG-1 now ALSO subsumes the
era-events-predating-start-DROPPED hole** (LIVE-confirmed by `rep1800`'s
LA-Purchase-dropped-at-1800-start episode — a 2nd same-class instance; same bug,
merged). **QW10 (DH-30 event-scheduler-min-floor) is BUG-1's companion** on the
same scheduling surface. DH-2 (modern deck fired off-year cards) is the **same
scheduling surface** as BUG-1 + divergence #4 and is investigated at E15, not as
its own quick-win. **★ Batch-12 adds FIVE new XS quick-wins (QW12–QW16)** — pure
Ted/vcczar one-line/one-helper rulings that bind at known sites with no
dependency: **QW12 #135** 50/50 House inverse-control (one-line at
`phaseRunners.ts:1864`), **QW13 #131** Integrity-can't-nominate-Controversial
filter, **QW14 #132** Challenge-Legislation-can't-target-REPEAL filter, **QW15
#139** Pres signature in 2.6 (phase reorder), **QW16 #141** FL trait gain 5%+/3%-.
Each row is tagged with its `tedchange#POST N` for traceability. **★ Batch-12
absorbs QW11 (DH-43 Vermont) into the #120 dataset umbrella row below** — DH-43
ships as one item in the coordinated `scripts/seedDataset.mjs` pass, not as a
standalone quick-win. **★ Batch-13 adds ONE new XS quick-win (QW17)** — **#143
post-election Command decay** (40% / −1 Command per presidential cycle for any pol
who did NOT run for Pres/VP — "shit or get off the pot"), a Ted-RULED, tested-live
standalone that binds at one known site (`runPhase_2_10_End` `phaseRunners.ts:4171`,
gated on `isPresidentialYear`, after the 2.9.4 ticket roster is known) with no
dependency — it joins the QW0 / XS-consistency cluster. Tagged with its `oopscpu#POST N`.
**★ Batch-15 adds ONE new XS quick-win (QW18)** — **#153 rookie-Command / Command-gain
consistency** (rookies enter at 0 Command + every in-game Command-gain % DOUBLED + no-
reroll-on-held-expertise), now made OFFICIAL by Ted (`terror2000#POST 91-93`). The
0-Command rookie ships already (#136) and no-reroll-on-held-expertise is already an
invariant — **the UNBUILT half is the global ×2 Command-gain multiplier**; pairs with
the #143 Command-decay (QW17) at the same Command-economy surface. Tagged with its
`terror2000#POST N`. **★★ Batch-17 PROMOTES #153 to build-with-confidence / canonical
(no re-size — still XS–S, still QW18, NO new row).** A 3rd source (`ted1772`, the 4th
1772 thread) re-confirms the rule front-to-back from a 0-Command boot, making it
**3-source canonical (`terror2000` · `tedchange` · `ted1772`)**, and — uniquely —
DEMONSTRATES the payoff LIVE: an **emergent 1st President (Arthur St. Clair), a CPU pol
who booted at 0-Command / obscure / no celebrity and rose entirely through play.** The
rookie `command: 0` boot is verified SHIPPED (`phaseRunners.ts:216`); **the only UNBUILT,
LOAD-BEARING piece is the GLOBAL ×2 Command-gain multiplier** — a single `gainCommand(p,
basePct)` helper applying ×2 at the leader-pick / charisma-event / military-victory grant
sites (e.g. the Father-of-the-Constitution `command + 1` at
`constitutionalConvention.ts:158,168` + the RevWar grants in `revolutionaryWar.ts`), plus
the held-tag guard in the expertise-grant path. **It sits on the draft/command path with
NO keystone dependency — ready-to-build now** (this is a confidence raise, NOT a
re-sequence — #153 was a 1-source XS quick-win, now it's 3-source canonical). game-mechanics
§4.1.y. **★★ Batch-30 adds TWO new PV quick-wins (QW22, QW23) — the FRONT-HALF of the PV-system overhaul
(debt #85); the BACK-HALF (#214 per-trait tiers + #215 per-ability curve) is a GATED BALANCE EPIC, NOT a
quick-win** (it is added to Phase-1 below, gated on the un-ingested "Groupthinking the Political Value"
trait-EFFECTS thread + a same-PR `calcStateVote` `pv*0.1` re-tune; #220 display-scale → Decision-gated (A)
User-gated). **QW22 #216 the trait-name remap** is the BLOCKING PREREQUISITE that unblocks #214 (~17 of ~57
forum trait line-items mis-key/drop vs the shipped `Trait` union — an explicit old→new map, **S,
independently useful, DO FIRST of the two**); **QW23 DH-77 the floor-offset clamp fix** swaps the
`Math.max(0,…)` at `pv.ts:88` for a constant floor-OFFSET so the CPU keeps ordering among sub-zero pols (XS,
standalone). Both are the cheap, no-balance-risk half of the PV overhaul; the reweight itself touches `pv.ts`
which DRIVES elections, so it is held back as a balance epic.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| QW0 | **BUG-0 — relocation cap `5`→`4` + alt-state EXEMPTION guard (divergence #9 — ★★ batch-12 FULLY SETTLED, vcczar-12-30-25-RULED)** *(do FIRST — TOP OF THE QUEUE)* | **One-line const edit + a guard at the relocation accumulator.** `RELOCATION_ATTEMPTS_PER_TURN = 4` at `types.ts:247` (shipped value is `5`) **PLUS** a guard so **alt-state moves do NOT count against the 4-total budget** (verify alt-state accounting in `runPhase_2_1_4_Relocations`). **★★ Batch-12: `smallbugs#POST 734-735` (vcczar-12-30-25 "Approved by vczar") SETTLES BOTH halves:** *"A faction is limited to FOUR total attempted moves per half-term. A politician that moves to an ALT-STATE does NOT count against the FOUR total moves."* This **CLOSES** the long-running BUG-0 / QW0 / batch-10 top-of-queue item from "open-design + ready-to-build" to **fully settled and ready-to-ship FIRST**. Settled value, no migration (a tunable const + a guard, not a save field); no dependency. The auto-Carpetbagger + 10-yr-expiry *feature* is QW4 / E17 — this row is the **cap value + the exemption guard**. **The cheapest win in the whole roadmap.** No human review-gate; no designer-gate; the cap value AND the exemption are both authoritative. | — | XS | bug BUG-0 / divergence #9 (`hd` §0/I-1, 7062-7066, 7555) + codebase (`types.ts:247`) + **★★ `smallbugs#POST 734-735` vcczar-12-30-25 APPROVED — cap=4 + alt-state exemption both ruled** — CARRIED + SETTLED | ready (TOP OF QUEUE) |
| QW1 | **BUG-1 — era-event era-lock filter (now ALSO subsumes era-events-predating-start-DROPPED, batch 7)** *(federalism gate)* | Add an era-vs-start-year filter to `buildEraEventsForYear` (`phaseRunners.ts:2817`): an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table — **BUT** the official ruling (`fed` POST 524) also means a start year *past* an era wrongly **loses** that era's still-pending content (an **1800-start game wrongly loses the Louisiana Purchase**). **Batch 7 LIVE-CONFIRMS this exact bug:** `rep1800` §A POST 2668 — the GM found the LA Purchase was filed under the prior Era of Federalism and "not included" for an 1800-start game; he hand-added it in 1816. Same bug, **merged** (the era-events-predating-start-DROPPED hole is the same defect, not a new row). Latent today; **a blocker the moment a 3rd scenario (1788/1800) ships** — so this rides with E1. **Resolve together with QW10 (DH-30 min-floor) + DH-2 + divergence #4** (one scheduling surface, at E15). | — | XS | bug BUG-1 (`fed` 521-535; **`rep1800` §A 2668 LIVE-confirms**), DH-2 (`modern` 2221) — CARRIED + EXTENDED, HI-CONF (2 era) | ready |
| QW2 | **BUG-3 — no-PM-General fallback guard** | Defensive guard on the `GeneralInChief` fill path (`phaseRunners.ts:2255`): empty-pool ⇒ leave vacant + log (or auto-generate a stopgap officer — ties to E8 procedural pol gen). Closes a potential crash. | — | XS | bug BUG-3 (`fed` 5, 119) — CARRIED | ready |
| QW3 | **±3-per-phase meter-swing clamp (meter-model divergence; now confirmed live by `drums` #80)** | One-helper change: clamp every `NationalMeters` write to ±3 per phase (`types.ts:1399`). **Batch 5 extends this:** apply the same clamp to **cabinet ideology net-swings** and **per-phase ideology swings** at the same chokepoint (#80, `drums` POST 4574 — a live designer patch). Orthogonal to the full named-ordinal relabel (parked) and to E6's crisis/cascade rules (which build on it). Cheap balance/feel win. **★ Batch-11 — the ±3 cap is now UNCONDITIONALLY READY (no longer gated on any fork).** Batch 10 flagged the cap as the "settled half" of the #18/#51 fork; the `arkzag` continuation then **RESOLVED the #51 enthusiasm-SHIFT step** (the 4-step rule, verbatim `drums` — now at **E23, `ready`**), so the cap binds with no open dependency. **This QW3 clamp on `NationalMeters` writes is buildable NOW**, and the same ±3 cap on ideology+party-pref swings **ships with E6 at `calcStateVote` `phaseRunners.ts:3709-3711`** (which today applies enthusiasm UNIFORMLY with **NO ±3 cap and NO per-state penalty**). **The ONLY piece still BLOCKED on a human pick is #18's meter→election STATE SCOPE** (every-state-unless-penalized vs ideology-leaning-states-only — recorded under "Decision-gated", folds into E20/E23); the cap itself and the enthusiasm-SHIFT engine are NOT gated. | — | XS | meter model §21.8/§22.1/§22.2 (`1772s`; `modern`; **`drums` #80 POST 4574**) + **#51 ±3 cap settled (`dem1820`; `arkzag` ch33 2438-2456)** — CARRIED + EXTENDED, HI-CONF | ready |
| QW4 | **Auto-Carpetbagger on alt-state moves (divergence #2)** | Replace the 4-step probability ladder with auto-grant on a successful alt-state relocation; add 10-year expiry + exempt alt-state moves from the relocation cap (now 4/half-term after QW0). More legible; removes a dead dial. | QW0 (the cap value) | XS | gap #38, divergence #2 (`gilded` 36; `1772s` 3-52; `modern` 147; `hd` I-1; **`drums` POSTS 2627, 2630-2634, 2755, 7465 add the per-roll % table + recent-state filter**) — HI-CONF (5 era) | ready |
| QW5 | **DH-3 — bar career-track pols from the presidency** | Add a guard at presidential-candidate eligibility (and CPU presidential selection) so career-track pols can't run — closing a GM-acknowledged rules gap (career-track is already barred from Gov/Rep/leadership/Kingmaker). Relates to the primary (E22) but is a cheap standalone guard now. | — | XS | DH-3 (`hd` 8205-8219; relates to #63) — CARRIED | ready |
| QW6 | **DH-5 — Kingmaker-pairing dissolution on flip** | A rule in the conversion path: converting/flipping a Kingmaker no longer seizes his protégés (or their +1 election standing) — flagged "insanely OP." Same code area as Reconstruction amnesty (E3b prunes broken Kingmaker pairs). Cheap balance fix on shipped Kingmaker/conversion machinery (`KINGMAKER_RULES` `types.ts:295`, `CONVERSION_ODDS` `:268`). | — | XS–S | DH-5 (`hd` 7589, 8762; relates to #29/#30) — CARRIED | ready |
| **QW7** | **#85 — 5%/half-term retire/death + mandatory military-officer retire at 75** *(batch 5)* | A 1-line refinement of `MORTALITY_RULES` per-era table (`types.ts:485`): per-half-term **5% retirement/death roll for senators + cabinet** + mandatory **military-officer retire at 75** + ~10% baseline cabinet-decline roll. Tyler patched this mid-run (POST 5437) to solve CPU stagnation in long campaigns. **Pure tunable; no shape change; cheap.** | — | XS | #85 (`drums` 2493, 5437, 6469; **★★ `terror2000` corroborates the 5%/half-term retire-death + military-officer schedule from a modern angle**) — CARRIED, HI-CONF | ready |
| **QW8** | **DH-24 — Senate-class verifier at K4 boot pipeline** *(NEW, batch 6)* | A one-helper `validateSenateClasses(snap)` that, at scenario-boot time AND at `loadStandardDraftClasses` (`standardDraftClasses.ts:13`), checks each sitting senator's last-election year against their assigned Senate class (I/II/III) and flags mismatches. `pop` POST 272/297/298: a fresh modern boot's seed data had Ron Johnson (WI) up in 2010 instead of 2012; GM had to swap classes mid-election. **One pure validator helper, run at K4's boot pipeline.** Lands at the K4 boot pipeline (does NOT require K4 to be fully built — can ship as a standalone helper now, then wire into the `scenarioBoot` pipeline when K4 lands). **★ Batch-10 — corroborated AGAIN from a 4th start year:** `dem1820`'s 1820 boot/sheet data shipped with wrong Senate-class assignment (`scenario1856.ts:86` does a naive assign; the 1856-hardcoded rotation lives at `phaseRunners.ts:3885`), so the validator is now a 2-start-confirmed XS boot-pipeline check — it belongs **inside** `scenarioBoot` (#115), not just adjacent to it. | — (helper); wires into the `scenarioBoot` pipeline (#115) when K4 lands | XS | DH-24 (`pop` 272, 297, 298; **`dem1820` reconfirms** — naive assign `scenario1856.ts:86`, rotation `phaseRunners.ts:3885`) — NEW + RECONFIRMED, HI-CONF (2 start) | ready |
| **QW9** | **DH-27 — `TRAIT_CONFLICTS` validator at dataset/boot import** *(NEW, batch 6)* | A one-helper `validateTraitConflicts(snap, dataset)` that runs `TRAIT_CONFLICTS` (`types.ts:658`) against `snap.politicians[]` at scenario-boot AND against the loaded dataset at `loadStandardDraftClasses` (`standardDraftClasses.ts:13`). Today `TRAIT_CONFLICTS` is consulted only on **trait-ADD events**, not on dataset/boot import — so boot/seed data can ship a pol with both `Integrity` AND `Controversial` (`pop` POST 1139: Quinn). **One pure validator helper.** Same pattern as QW8 — can ship now as a standalone helper, then wire into the `scenarioBoot` pipeline (#115). **★ Batch-10 — reconfirmed:** `dem1820`'s boot/sheet data again shipped trait-conflict + demographic corruption, so this validator belongs inside `scenarioBoot` alongside QW8. | — (helper); wires into the `scenarioBoot` pipeline (#115) when K4 lands | XS | DH-27 (`pop` 1139; `types.ts:658`; **`dem1820` reconfirms**) — NEW + RECONFIRMED | ready |
| **QW10** | **DH-30 — event-scheduler MIN floor (+ spill-to-anytime)** *(NEW, batch 7 — BUG-1's companion)* | The era-event scheduler has a **MAX per half-term but no MIN floor** — over a 20-yr era a 25%-event ≈94% cumulative, but a low-% era can fire *zero* events some playthroughs. `rep1800` POST 2918-2932: *"the limit is a max not a min… which isn't what we discussed."* **Agreed fix: minimum = 20% of the era's max (round down)**; if still none fire (all prereq-gated), **spill to the current 5 generic anytime events**. (A rejected alt — hard year-windows per event — was declined because *"events not happening every playthrough has been explicitly stated to be how the game operates"*, load-bearing for alt-history.) **Same scheduling surface as BUG-1 + divergence #4** — land it alongside QW1 / at E15. Small, additive; no new save shape. | — (pairs with QW1; full scheduling fork resolved at E15) | XS | DH-30 (`rep1800` §A 2918, 2919-2932; companion to BUG-1) — NEW | ready |
| **QW11** | **DH-43 — Vermont home-state mapping (dataset/data fix)** *(NEW, batch 8 — ★ batch-12 ABSORBED into the #120 dataset umbrella)* | Vermont-origin pols have **no home-state mapping**, so they cannot relocate "home" (`new1772`). **A pure dataset/data fix:** ensure VT's `homeStates`/region wiring exists. **★ Batch-12 — this row is now ABSORBED into the #120 `smallbugs` dataset umbrella (NEW Phase-1 row below):** the batch-12 #120 coordinated `scripts/seedDataset.mjs` `CURATED_ROWS` pass covers DH-43 alongside ~100 other dataset items + DH-51 + DH-28. **Kept here for traceability; ship as part of #120, not as a standalone QW.** | — | XS | DH-43 (`new1772`; relates to relocation/Carpetbagger) + **★ batch-12 ABSORBED into #120 umbrella** — CARRIED + ABSORBED | ready (ships with #120) |
| **QW12** | **★ batch-12 #135 — 50/50 House inverse-control rule (one-line edit, `tedchange#POST 65`)** *(NEW, batch 12)* | **One-line edit at `phaseRunners.ts:1864`.** Today `runPhase_2_2_1_CongressLeadership` computes `houseMajority = houseBlue >= houseRed ? 'BLUE' : 'RED'` (`:1863-1864`), which **silently defaults to BLUE on a 50/50 tie** — a real shipped bug. Ted's `tedchange#POST 65` rules: **a 50/50 House → leadership (Speaker + committee chairs) goes to the party that does NOT control the Senate.** Replace with: `houseMajority = houseBlue === houseRed ? (senateMajority === 'BLUE' ? 'RED' : 'BLUE') : (houseBlue > houseRed ? 'BLUE' : 'RED')`. **XS one-line edit; ship with QW0 + Phase-1 #19 small consistency.** **RULED by Ted (`tedchange#POST 56-65`).** | — | XS | gap **#135 / `tedchange#POST 56-65`** — NEW | ready |
| **QW13** | **★ batch-12 #131 — Integrity-pol cannot nominate Controversial-pol (filter helper, `tedchange#POST 277`)** *(NEW, batch 12)* | **One trait-aware filter helper used by every nomination/appointment path** (cabinet `phaseRunners.ts:2158`; CJ ladder; ambassadors; CC delegates; FL elections). Ted's `tedchange#POST 277` rules: **an Integrity-trait pol CANNOT nominate a Controversial-trait pol to any office** (CPU + human). **Tied to the cabinet & SCOTUS work (E16 + E25)** but the helper itself is XS and ship-immediately. **RULED by Ted (`tedchange#POST 276-278`).** | — | XS | gap **#131 / `tedchange#POST 276-278`** — NEW | ready |
| **QW14** | **★ batch-12 #132 — Challenge-Legislation Gov Action cannot target a REPEAL bill (filter, `tedchange#POST 248`)** *(NEW, batch 12)* | **One filter on the Challenge-Legislation Gov Action's target list** (built at E11 / E25). Ted's `tedchange#POST 248` rules: **a Gov-Action Challenge-Legislation cannot target a repeal-bill** ("we just don't allow it. There isn't a direct real world example we can cite"). XS as a target-list filter — **build-target constraint on E11 / E25, ship the filter helper now.** **RULED by Ted (`tedchange#POST 246-248`).** | — | XS | gap **#132 / `tedchange#POST 246-248`** — NEW | ready |
| **QW15** | **★ batch-12 #139 — Pres signature step lives in 2.6 (NOT 2.10) — phase-sequence reorder (`tedchange#POST 126`)** *(NEW, batch 12)* | **XS phase-sequence reorder in `src/phases.ts`** so military bills affect Mil-Prep BEFORE 2.7 Military Action. Ted's `tedchange#POST 124-126` rules: **Pres signature lives in 2.6** (not 2.10) so signed military bills affect Mil-Prep in time. Folds into Phase-1 #2 (bill typing + spending cap) + Phase-1 #14 (legislative micro-mechanics), but the reorder itself is XS and standalone. **RULED by Ted (`tedchange#POST 124-126`).** | — | XS | gap **#139 / `tedchange#POST 124-126`** — NEW | ready |
| **QW16** | **★ batch-12 #141 — FL trait gain rates 5% positive (per cycle) / 3% negative (first-time-as-FL only)** *(NEW, batch 12)* | **XS — refines the existing FL trait-gain const.** Positives roll **5% per cycle as FL**; negatives roll **3% first-time-as-FL only**. Ted's `tedchange#POST 79` refines `cf82a7d3 §5a #4` (which was "MOSTLY ADOPTED" without rates). Pure const refinement. **RULED by Ted (`tedchange#POST 73-79`; refines `cf82a7d3 §5a #4`).** | — | XS | gap **#141 / `tedchange#POST 73-79`** — NEW | ready |
| **QW17** | **★ batch-13 #143 — post-election Command decay ("shit or get off the pot") (NEW pass, `oopscpu#POST 224`)** *(NEW, batch 13 — RULED, tested live)* | **XS — one new pass at one known site.** After every presidential cycle closes, **every living politician who did NOT run for President or VP has a 40% chance of −1 Command.** Ted's marquee `oopscpu` proposal (floated POST 1), **RULED + TESTED LIVE** at POST 224 ("Politicians who don't run for President have a 40% chance of losing −1 Command after the Presidential election" — hit Gerry→0, Pinckney→2, Hancock→2). Purpose: stop Command piling up on pols who never contest the presidency, keeping the candidate pool meaningful (pairs with #72 candidate-selection + #136 "Presidents should come from somewhere"). **Binds at `runPhase_2_10_End` (`phaseRunners.ts:4171`), gated on `isPresidentialYear`, AFTER the 2.9.4 ticket roster is known** (so it can exclude Pres/VP candidates); applies via the existing `loseCommand` (`abilities.ts:15`). Pairs with #85/#130 death-schedule discipline (same `runPhase_2_10_End` site). Pin the 40% / −1 rate. No dependency; ship with the QW0 / XS-consistency cluster. **RULED by Ted (`oopscpu#POST 1, 224`).** | — | XS | gap **#143 / `oopscpu#POST 1, 224`** — NEW | ready |
| **QW19** | **★★ batch-27 DH-72(a) — narrow + SEED the election jitter (d6→d3 via `src/rng.ts`) — ★ HIGHEST-LEVERAGE WIN IN THE BATCH** *(NEW, batch 27 — designer-blessed)* | **XS — replace the raw `Math.random` jitter at `calcStateVote` (`phaseRunners.ts:3709-3711`) with a SEEDED, NARROWER roll.** Shipped scorer re-verified UNCHANGED = `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias + traitBonus + (Math.random()-0.5)*8` — the last term is a **continuous ±4 jitter via raw `Math.random`**, which is BOTH too wide (the d6→d3 "compress the luck band" intent) AND a **determinism leak vs. the `src/rng.ts` rule** (engine must be seeded). Swap it for a seeded d3-style roll routed through `rng.ts`. Designer-blessed (both played + agreed *"platform is way too powerful"*, `redbutton#POST 538-540`); this sub-fix narrows the luck that turned a near-tie into a 492-40 landslide. **★ Folds the debt #1/#3 determinism leak.** Ship in the QUICK-WIN bucket alongside QW3 (±3 cap) + the #18 2-layer scorer. Binds at `phaseRunners.ts:3709-3711`. **★★ Batch-28 RECONCILE — debt #71 is the TECHNICAL DEFINITION of this QW19/QW20/QW21 trio (the batch headline, the single highest-leverage build move): the `completions` reconcile REFUTED the "election die D6 CONFIRMED-SHIPPED" claim** (the cited `phaseRunners.ts:727` is `factionExpertiseBias`'s unrelated 0–6 clamp; the real randomizer is `(Math.random()-0.5)*8` at `:3711` — raw `Math.random`, NEITHER d6 nor d3, NOT seeded), so the build ships **NO election die at all** → this exact QW is the target. The **D6-vs-D3 fork is TIED OFF** (not a die-swap — it's this same narrow-the-jitter + route-through-`rng.ts` QW; then re-check the `baseLean*5` bias term `:3697` per QW20). **debt #71 FUSES #64/DH-72 + the flagship `Math.random` leak (debt #1/#3) + the fork in ONE patch — REINFORCE this trio, do NOT add a 4th row.** (Contrast: **trait-conflict-d6 is CONFIRMED-BUILT** via the RNG seam, `tryGrantTrait` `traits.ts:53`, threshold `4` — that one is shipped; THIS one is not.) | — (ships with QW3; the meter→election STATE SCOPE #18 stays the only human pick) | XS | bug **DH-72(a)** (`redbutton#POST 532, 538-540, 587, 603-607`; `phaseRunners.ts:3709-3711` + `src/rng.ts`) — NEW (debt #64) + **★★ batch-28 `completions` RECONCILE: election-die-D6 REFUTED, fork TIED OFF (debt #71); technical-guide §9 batch-28 lead + §8 #71** | ready |
| **QW20** | **★★ batch-27 DH-72(b) — re-weight `baseLean*5` into the +3/+5 historical-bias band behind a `game.biasMode?` toggle** *(NEW, batch 27 — designer-blessed)* | **XS–S — re-weight the historical state-bias term at `calcStateVote` (`phaseRunners.ts:3709`/`:3697`).** Today `baseLean*5` is the dominant swing; re-band it into the **+3/+5 historical-bias range** behind a `game.biasMode?` toggle (historical-plausible vs the designer's "go-crazy" mode). One of the two terms (with the +3 platform bonus) that drove the 492-40 board-wide blowout; capping its weight returns the recompute to the ~281-129 near-tie. Designer-blessed (`redbutton#POST 538-540, 603-607`). Pin the toggle default + the two bands. Ship in the QUICK-WIN bucket alongside QW19 + QW3. Binds at `phaseRunners.ts:3697/3709-3711`. | — (ships with QW19/QW3) | XS–S | bug **DH-72(b)** (`redbutton#POST 538-540, 603-607`; `phaseRunners.ts:3697/3709-3711`) — NEW (debt #64) | ready |
| **QW21** | **★★ batch-27 DH-72(c) — HIDE the raw election math in the UI (anti-collusion)** *(NEW, batch 27 — designer-blessed)* | **XS–S — UI surface change: stop exposing the raw `calcStateVote` formula / numeric percentages.** Show only **which ideologies like a position + polls/maps**, never the raw `50 + baseLean*5 + …` math. Anti-collusion (a multiplayer concern surfaced live: players reverse-engineered the scorer to over-optimize); the modern run's hand-driven platform exploit was visible only because the math was legible. Designer-blessed (`redbutton#POST 538-540`). The SAME hide-the-math principle the #184 platform meter-cap builds in from day one (sub-fix B → Phase-1 #10/#181) — here it lands on the SHIPPED election scorer as a presentation-track fix. Ship in the QUICK-WIN bucket alongside QW19/QW20. | — (presentation track; pairs with #184's day-one hide-the-math) | XS–S | bug **DH-72(c)** (`redbutton#POST 538-540`) — NEW (debt #64) | ready |
| **QW18** | **★ batch-15 #153 — global ×2 Command-gain multiplier (the UNBUILT half of the rookie-Command rule, `terror2000#POST 91`) — ★★ batch-17: NOW 3-SOURCE CANONICAL + LIVE-DEMONSTRATED → build-with-confidence** *(NEW batch 15 — RULED; ★★ batch 17 PROMOTED to canonical)* | **XS–S — one global multiplier on the Command-gain roll path** (a `gainCommand(p, basePct)` helper applying ×2 + the committee/career-track expertise-grant sites). Ted (`terror2000#POST 91-93`) made TWO house-rules official: **(a)** nobody is born with Command — **all rookies enter at 0 Command** (verified SHIPPED via #136, `phaseRunners.ts:216`) **AND every in-game Command-gain % is DOUBLED** to compensate (so Presidents emerge from in-game action, not real-world reputation — the **×2 multiplier is the only UNBUILT piece**); **(b)** rolling an already-held expertise on a grant = **NO new expertise (do NOT re-roll)** — already an invariant in the grant path. Pin the ×2 on every Command-gain % (the success→+1-Command rolls in E11/E13/E18 + the draft-grant + e.g. the Father-of-the-Constitution `command + 1` at `constitutionalConvention.ts:158,168` + the RevWar grants in `revolutionaryWar.ts`), gated nowhere (all eras). **★★ Batch-17 (`ted1772`) PROMOTES this to build-with-confidence / CANONICAL:** a 3rd source applies the rule front-to-back from a 0-Command boot — **3-source canonical (`terror2000` · `tedchange` · `ted1772`)** — and DEMONSTRATES the payoff LIVE: an **emergent 1st President (Arthur St. Clair), a CPU pol who booted at 0-Command / obscure and rose purely through play.** The ×2-Command-gain knob is **load-bearing and keystone-free** (it sits on the draft/command path). Pairs with **QW17** (#143 Command decay) — same Command economy, opposite direction (decay pares the pool, the ×2 lets contenders climb). No dependency; ship with the QW0 / XS-consistency cluster. **RULED by Ted (`terror2000#POST 91-93`; ★★ 3-source canonical via `ted1772` + a live emergent-President audit).** | — | XS–S | gap **#153 / `terror2000#POST 91-93` + ★★ `ted1772` (3-source canonical + St. Clair live demo)** — NEW + PROMOTED (canonical) | **ready (build-with-confidence)** |
| **QW22** | **★★ batch-30 #216 — PV trait-name remap (forum→shipped `Trait` union) — the BLOCKING PREREQUISITE of the PV overhaul (debt #85)** *(NEW, batch 30 — the front-half of the PV overhaul; DO FIRST of the two PV QWs)* | **S — produce an explicit forum-trait → shipped-`Trait`-union map**, then apply #214's tiers through it. The 2023 `revampPV` trait vocabulary ≠ the current `Trait` union (`types.ts:62-117`): of the ~57 traits in vcczar's POST-33 tier list, **~15 are ABSENT** from the shipped union (Teflon, Military Leader, Bookkeeper, Geostrategist, Everyman, Lawful/Cop, Jurisprudence, Union Loyalist, Disharmonious, Lackey, Late Bloomer, Illicit, Pliable, Incoherent, Easily Overwhelmed), **2 are pure RENAMES** (`Flipflopper`→`Flip-Flopper`, `Two-faced`→`Two-Faced`), and **12+ SHIPPED traits were NEVER valued in 2023** (Nationalist/Globalist/Reformist/Loyal/Ambitious/Opportunist/Impressionable/Scandalous/Corrupt/Traitor/Outsider/Ideologue) — so **~17 of ~57 line-items (~30%) mis-key or DROP without the remap.** A literal transcription is wrong; the table is **tiers to RE-MAP, not literal keys.** Independently useful (clarifies the trait vocabulary) and **UNBLOCKS #214** — without it the per-trait tier table is un-applyable. **Pairs with #168** (the `planb` terminology audit) + the existing trait-rename tracking. No dependency; ship in the cheap-fixes lane. | — | S | gap **#216 / `revampPV` §6 D8 / POST 33; codebase-verified `types.ts:62-117` trait union vs the 2023 forum vocabulary** — NEW (debt #85) | ready (DO FIRST of the PV pair) |
| **QW23** | **★★ batch-30 DH-77 — PV floor-OFFSET clamp fix (replace `Math.max(0,…)` at `pv.ts:88`) (debt #85)** *(NEW, batch 30 — standalone XS; the rest of the PV overhaul is a balance epic)* | **XS — replace the `Math.max(0, Math.round(total))` clamp at `pv.ts:88` with a constant floor-OFFSET** so sub-zero Politician-Values keep their ORDERING for the CPU's draft/leadership heuristic. The clamp is the most clearly *wrong* line today: it floors every negative PV to 0, collapsing the ordering of below-average pols that the CPU still needs to rank (it can't tell JFK Jr −5 from John Payne Todd −34 — both become 0). Ted's one hard demand in `revampPV` was *"no negative numbers"* for human display, satisfiable via a flat offset, NOT a destructive clamp. **Independently shippable** — does NOT require the #214/#215 reweight (the remaining PV sites `pv.ts:70-79` are the balance epic). Pairs with #214/#215/#216/#220 (all rebuild `pv.ts:70-88`). No dependency; ship in the cheap-fixes lane. | — | XS | bug **DH-77** (codebase `pv.ts:88` `Math.max(0,…)` clamp; superseded by `revampPV` #220) — NEW (debt #85) | ready |

---

### Engine track — Phase 0 (keystones)

**`K0 → (K1 ‖ K2 ‖ K3) → K4 ‖ K5`.** After K0, K1/K2/K3 are independent and
parallelizable across PRs; K4 depends on K3. **K5 is a new late-keystone (batch
5)** — sits after K0 + K2, parallel with K3/K4 + federalism (§9.1.3). K2 remains
the single most important keystone (~6× leverage) — **do it first if only one
lands**, because K5 depends on it (most handlers pick from a registry).
**Batch-4: per-era point BANKING (#68) is folded into K3/K4 — not a new item.**
**★ Batch-7: the era-model reframe RE-SPECS K3 + K4 — NOT a new keystone** (§9.1.5
/ divergence #18). `advanceEra` becomes condition-driven (game-state / meter /
TERRITORY, per half-term — no `target` arg); content gates on `game.eraBand` + a
new `territoryOwned` predicate, not the calendar; early sub-bands are content-band
markers. **No new keystones this batch.** See the updated K3 + K4 rows.
**★★ Batch-8: K3 + K4 are now MULTI-SAVE PROVEN — the HIGHEST-confidence large bet
in the roadmap** (§9.1.5 batch-8 confidence bump). Two independent saves —
`tea1772` (1772-start) and `rep1800` (1800-start, 28 in-game years apart) — emit
the **identical era-band sequence at identical in-game dates** (game-context #102),
so the content-band model is **settled, not speculative**. **Nothing structural
changes** (the K3/K4 spec was already condition-driven from batch 7); this is a
**confidence/priority raise only** — if engine staffing is scarce, K3/K4 are the
safest era investment to start. **#102's dual era-scoring (per-era winner +
cumulative "winner so far") is the WIN-CONDITION scoreboard** — it folds into
K3/K4's per-era point-banking (#68 banks the cumulative total; the win condition is
**DUAL**), NOT a new item. **No new keystones this batch either.**
**★★ Batch-9: K3/K4 are now 3-START-CONFIRMED (1772 + 1800 + 1948) and gain a
TWO-LEVEL refinement + a structured-era-event-data requirement — still NOT a new
keystone, NO re-sequence** (§9.1.5 updated, BINDING). The band model holds across a
THIRD start year (1948, `nuke`), and `nuke` splits it into **two distinct,
separately-fired mechanics that an earlier extractor conflated — BOTH must be built;
do NOT collapse them:** **(a) point-banked Historical Eras** (the #92/#68 content-band
mechanic) that carry **RULE-DELTAS, not just content** (the Era-of-Terror cabinet
rework — region stops mattering, replaced by diversity + faction-balance checks — is
the proof bands change rules); **(b) within-era decade/census boundaries** = a
**separate, schedule-fired** per-decade `AMPU Census` doing **bulk EV reallocation +
wholesale state-bias re-lean + content rotation** — distinct from #68's per-era
bias-table swap (it fires on a 10-yr calendar schedule WITHIN a band). PLUS **K4's
era-event data needs STRUCTURED `evDelta`/census fields (DH-48)** + per-era
completeness validation (the Neocon census/EV-delta events were LOST as free-text
flavor). **Logged correction: "Neocons"/"Corporate Republicans" is a FACTION REBRAND
(~1980), NOT an era band** — do not promote any faction nickname to a Historical Era.
These land **entirely inside K3 (the census-as-a-second-schedule + the rule-delta
hooks) and K4 (the structured era-event data + validators)** — no new keystone, no
re-order. See the updated K3 + K4 rows.
**★ Batch-9: K2 confidence — the per-half-term phase loop is now corroborated at
~25 sub-phases** (`nuke` walks the full 2.1.x→2.10 loop a 4th time across a 1948
campaign), reinforcing that the ActionRegistry (K2) is the right shared host for the
six+ action libraries the loop drives. No scope change; confidence only.
**★ Batch-9: K5 is now LOAD-BEARING, not optional/late (§9.1.3 priority bump,
BINDING).** `nuke` carries the designer's strongest design-intent statement (#114,
§28.12): the **APP is built for 1-human-vs-9-CPU** (multiplayer "goes off the rails";
the points system is for the CPUs, not humans). The app is a **solo adaptation of a
multiplayer game**, so the ENTIRE multiplayer apparatus (party-leader elections,
conversions, kingmaker pairings, committee assignment, cross-faction endorsements,
forced 3rd-party runs, the whole convention) **must be CPU-AI-driven** — and `nuke`
confirms that surface was **entirely UNEXERCISED** by the human playtest (it must be
authored from spec). **This does NOT re-sequence K5** (it still lands after K0 + K2,
parallel with K3/K4 + federalism) — but it raises K5 + the handler suite (E9) from
"force-multiplier" to **the load-bearing system that makes the product playable solo
at all.** Treat the handler suite as a first-class Phase-1 system.
**★★ Batch-10: K4 absorbs the `scenarioBoot(BootSheet)` PIPELINE — the most-requested
missing item (#115) — at the FRONT of the subsystem queue; still NOT a new keystone,
NO re-sequence** (§9.1.9, BINDING). `dem1820` records that **there are NO documented
rules for CREATING a game** — and verified shipped-state has NO shared boot
abstraction (`startNewGame` `GameContext.tsx:264` switches a literal into hand-
authored builders; `scenario1856.ts:44-214` seats Congress with raw `Math.random`).
So **build one pure `scenarioBoot(BootSheet): FullGameSnapshot` pipeline inside K4's
`BootSheet` schema**, in dependency order **K0 (seed boot rolls) → `scenarioBoot` +
`BootSheet` (with K4) → every scenario becomes a data row** — and build it **WITH the
first new scenario (`scenario1788` / E1), before the third hand-authored copy-paste.**
It is the venue for the XS boot validators (QW8/QW9) + the appointment-ladder
(#115b). See the updated K4 row.
**★ Batch-10: K3/K4 are now 4-START-CONFIRMED** (1772 `tea1772` + 1800 `rep1800` +
**1820 `dem1820`** + 1948 `nuke` all emit the band model — `dem1820`'s draft table
prints "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)", POST 946).
**Confidence bump only — no scope change, no re-order.**
**★ Batch-11: K3/K4's #92 model is now LIVE-EXERCISED end-to-end** — `arkzag` (the same
1820 save run forward to 1840) plays the era/territory content-gate live: the **tariff-
rate-change cooldown to 1836** (POST 928), **Minister-to-Japan creatable by exec action
ONLY in the Manifest-Destiny era** (POST 359), "military academy"/"state university"
gated to later eras (ch5) — AND it surfaces the **concrete defect that the territory
filter is MISSING** (DH-60: "Force Open Trade with Japan" fired with no Pacific port;
"Stubborn Cherokee" without owning the territory, POST 335-340), which lands as the
`requires?: Predicate` era-event gate at **E15 + BUG-1** (reusing K3's `territoryOwned`
predicate). **Confidence bump + DH-60 placement only — no scope change, no re-order, no
keystone move.**
**★★ Batch-24 (two founding-era runs — `grass1772` + `rookie1772`) — K5's JUSTIFICATION is now
the STRONGEST in the corpus; NO re-sequence, NO scope change, NO keystone move.** Both runs DIED
to the manual CPU-faction sim + opaque rules — `grass1772` because **2 humans couldn't hand-run 8
CPU factions** (`#POST 328`, fixed by ADDING humans to offload the CPU work) and `rookie1772` to
GM time-burnout, the **strongest onboarding signal in the KB** (a rookie walls on phase-processing
/ meter-prereqs / phase-order / Lingering "never run before… more complicated than expected,"
`#POST 1370`). With `modernday` + `pop2012b` this is the **4th GM-burnout death**. K5 + the E9
handler suite are exactly the **#114 CPU-AI that makes the app playable solo** (one human runs ONE
faction); grep `cpuHandler|handlerSuite|runCpuFaction` in `src/` = ZERO. **Raise K5's priority/
confidence ONLY — its placement (after K0+K2, parallel with K3/K4) is unchanged.** Pairs with the
DH-69 onboarding/legal-move surface (the same legal-move enumerator a CPU action-picker needs).
**★★★ Batch-29 (the two timeline-edge threads `wilsons1916` + `welcome2future`) RESOLVES the long-open
"grow the `Era` enum vs. adopt the #92 two-level data-model" question IN FAVOR of the DATA-MODEL — a
K3/K4/#92 ANNOTATION, NOT a new keystone, NO re-sequence (§9 batch-29 lead ①, debt #78).** #206 re-
verifies the enum is DOUBLY too coarse from BOTH edges: `Era = independence|federalism|nationalism|
modern` (`types.ts:1337`) has NO `future`/`populism`/`progressive`/`gilded`, yet the forum's "Era of the
Future" / "Era of Populism" / "Era of Hollywood" are content-band LABELS over it (#92, now confirmed at
the OPENING hinge [1916 "Golden Era of Hollywood" event] AND the TERMINAL edge [Future]). With
Future/Populism/Hollywood/Gilded/Progressive labels ALL needed, a flat enum would balloon → **the era-
content-band model belongs in DATA: K4's per-era era-content registry carries the band labels (already
its design — see the K4 row), and the `Era` enum (if kept at all) stays a COARSE rules-tuning key, NOT
the band carrier.** This was already K3/K4's specced direction (the early-republic sub-bands were already
content-band MARKERS, not enum values) — batch-29 makes it the BINDING resolution and extends it to the
TERMINAL Future band. The `gilded`/`progressive` enum values K4 still adds remain justified ONLY where
their rule tables genuinely diverge (DH-34 static-bias decision); everything else is a band label in the
registry. **PLUS a separate Era-of-the-Future proposal-library authoring epic** (events done, legislation
a stub — folds into the era-content authoring, see E31 / the Author-before-build bucket). **No new
keystone, no scope change to K3/K4 beyond this annotation, top-of-queue UNCHANGED.**

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| K0 | **Seed the RNG** | Drop a real PRNG (mulberry32/xoshiro) into `rng.ts:5`; store `seed` + state on `GameState` (optional + `repair()` backfill); migrate the **14** raw `Math.random` engine calls (election jitter `phaseRunners.ts:3711`, generic-war `:3603`, draft fallback `:188-198`, `revolutionaryWar.ts:89,97`, `continentalCongress.ts:271`). Keep wrapper signatures. | — | S–M | debt #1–#3 (determinism prereq for multiplayer + replay + **K5 deterministic tie-breaks**) — CARRIED | ready |
| K1 | **`State.policies` + `State.electionMethod` data shapes** | Two additive `State` fields (`types.ts:1318`): `policies?: Partial<Record<StatePolicyId, StatePolicy>>` (Poll Tax/Jim Crow/Prohibition/Women's Suffrage/Segregation; `multiplierUntilYear`) + `electionMethod?: 'popular'\|'legislature'`. `repair()` backfill `{}` / `'popular'`. Extend `Predicate` with `{ statePolicyActive }` + `{ electionMethodIs }`. **Reads from the K5 governor handler (DH-19 / handler 9j) to prune no-op actions.** | K0 | XS | gap #21 (`gilded` 125; `modern` 25-2245; **`drums`** confirms; **★★ `gild1868 (b14)` corroborates #21 extensible state-flag registry from a native-1868 start**) + #44 (`fed` 194-373) — CARRIED, HI-CONF (native Gilded) | ready |
| K2 | **`ActionRegistry<Ctx>` keystone + `requires?: AmendmentPredicate` from day one (batch 6 / divergence #16)** | Define `GameAction<Ctx>` + `ActionRegistry<Ctx>` once in `src/engine/actionRegistry.ts` (one ~80-line type covering id/label/`isAvailable`/`resolve`/`persistence`) + one UI Action Picker + one JSON-serializable persistence shape. Used by **six+** action libraries (governor/exec/diplomacy/convention-inter-ballot/primary/general — plus the Reconstruction readmission-plan + secession-trigger rows at E3b). **~6× tax if built ad-hoc — the highest-leverage keystone.** **Hard prerequisite for K5** — most CPU handlers pick from a registry library. **Batch 6: the `GameAction<Ctx>` shape gains a `requires?: AmendmentPredicate` field from day one** (divergence #16). One extra field + one filter step in the picker reading `game.amendments.passed`. Canonical instance: the general-election action "Send VP to Shore Up Support" requires the 12th Amendment. Same `requires:` mechanism gates bill catalog entries (income-tax category) + gov action rows; predicate lives at the registry-row level, not the library level. **Cheap if early, expensive if retrofit** across 6 libraries. **Resolve DH-9 (canonical action ability-stat) before the `resolve` signatures harden.** | K0 | S | §6.6 (now confirmed **5 eras**; `hd` adds the Reconstruction/exec rows; `drums` raises the consumer count to 6+; **`pop` POST 951 adds `requires?` field for divergence #16**) + DH-9 — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| K3 | **`advanceEra(snap)` — CONDITION-DRIVEN (batch 7, ★ re-specced) — + era-content registry + content-band gating + per-era point BANKING (#68)** | Replace the hard-coded `currentEra = 'federalism'` in `constitutionalConvention.ts:198` with a pure callable transition. **★ Batch-7 reframe (the key change vs. the prior K3 spec): the era boundary is GAME-STATE / METER / TERRITORY-driven, evaluated PER HALF-TERM — NOT a year boundary** (§9.1.5 / divergence #18). `advanceEra` takes **no `target` arg** — it watches an `era.advanceWhen(snap)` condition (the early-republic bands advance on game-state + territory ownership; the Constitution-ratifies trigger at `:198` becomes the **first such condition**, not a hard-coded line). Verified: phases gate by `year % 4` / `year % 2` (`phases.ts:49-59`) — those are **correct for CADENCE and STAY**; there is **no year→era derivation anywhere** (`currentEra` is a plain field), so this is a **generalization of the one existing trigger, not a rewrite**. **★ Gate all content (bills / era-events / draftees / bias-table) on `game.eraBand` + a NEW `territoryOwned` predicate, NOT literal year** — un-owned-land content is invalid (Louisiana-born pols un-playable until LA is owned; this is the mechanism that *forces* `rep1800`'s ~30-yr content lag). **One new `territoryOwned(snap, requirement)` predicate** (a `Predicate` variant + one `evalPredicate` case at `eraGraph.ts:12`), **three consumers** (bill catalog, era-event walker, draft pool — the draft pool also excludes pols whose state/territory is un-owned/unorganized, = §27.5's gate). **The bank-and-zero boot pipeline (#68) fires AT the content-band boundary wherever it lands on the calendar:** bank the running per-era `Faction.score` into `eraPointBanks?: Record<Era,…>` + zero the running total, pay end-of-era awards, re-run pre-turn phases (2.1.x→2.3.1), swap content pools (card-pool + per-era card-count rescale, draft profile, SCOTUS set, nation renames, party-formation, **per-era state-bias table wholesale**). The per-era banks **sum toward the (open) cross-era win total**. Lift the **5** `ERA_GRAPH_1772` spots in `eraGraph.ts` (`:4,:73,:113,:148,:164`) to `ERA_GRAPHS: Record<Era, GraphNode[]>`. **No new top-level field beyond an optional `game.eraBand` marker (can reuse `currentEra`).** **RECONCILES #68 point-banking + §26 BootSheet boot model + §27.1 content-band finding into ONE era system** (debt #5/#9 dissolve here). **★ Batch-8 — MULTI-SAVE PROVEN (HIGHEST confidence, no scope change):** the content-band sequence is corroborated by TWO independent saves (`tea1772` 1772-start + `rep1800` 1800-start, 28 in-game years apart, identical bands at identical dates — #102), so the condition-driven model is settled, not speculative. **The per-era banks feed the DUAL win-condition scoreboard (#102): a per-era winner AND a cumulative "winner so far"** — the bank-and-zero already computes both (the running total is the cumulative scoreboard), so this is a labeling/exposure concern, NOT new banking logic. **★ Batch-9 — TWO-LEVEL refinement (3-START-CONFIRMED; §9.1.5), still inside K3:** the era model has **two distinct, separately-fired mechanics — build BOTH, do NOT collapse them.** **(a) The point-banked Historical Eras (the `advanceWhen` content-bands above) carry RULE-DELTAS, not just content** — the Era-of-Terror cabinet rework (region stops mattering → diversity + faction-balance checks) proves a band can change *rules*, so the boundary pipeline must support per-band rule-delta hooks, not only pool/bias swaps. **(b) A SEPARATE per-decade `AMPU Census` mechanic, schedule-fired (NOT a band boundary):** every ~10 in-game years it does **bulk EV reallocation vs the prior census + wholesale state-bias re-lean (Blue5..Tossup..Red5) + content rotation** (draft pool / lobby cards / era-activated industries) — distinct from #68's per-era bias swap (which fires at a band boundary). The census needs a per-state population model + House cap (parking-lot DH-49) before it can compute EV deltas. **Era CONTENT (events/SCOTUS docket) fires on yet a THIRD clock — a scripted ~5%/phase schedule decoupled from in-game history (#109)** — reinforcing §6.4: bands gate on game-state, the census fires on a 10-yr schedule, content fires on its own clock. **Logged correction: "Neocons" is a faction-rebrand at a census boundary, NOT a band — do not model it as one.** **★★ Batch-22 (`modernday`, game-mechanics §27.2.1) — the #68/#2 banking pipeline now has a CURRENT-RULES LIVE INSTANCE → SPEC-ANCHOR CONFIRMED (no priority change, no scope change).** `modernday` is the **first KB instance of the 6-clause end-of-era point-banking ritual firing at a REAL boundary under CURRENT rules** — the 2024 "Era of Populism"→"Near Future" transition (`#POST 1871`), with the formula printed VERBATIM: **most-points +5 / other-party-most +3 / 2nd-most-same-party +3 / all-factions-in-top-party +3 each / two −1 allied-faction-finished-last guards**; plus the **non-banked score RESET** ("Scores will be reset to zero for the next Era", #51/#2), the **faction-trade/switch window** (`#POST 1874`), and the **procedural-content swap** (historical imports → all-generated rookies, `#POST 1902/1909` — the #43/E8 dataset-exhaustion boundary). It **matches `rep1800` almost exactly**, so #68/#2 is now confirmed a deterministic pipeline from BOTH a 1800 AND a current-rules angle — the bank-and-zero spec above is well-anchored for when this row builds it. Verified UNBUILT: grep `bankPoints|eraBoundary|endOfEra|pointBank|resetScores|factionTrade|switchFaction` in `src/` = ZERO hits (the only era transition is the hard-coded `currentEra='federalism'` `constitutionalConvention.ts:198`, debt #5). **★★ Batch-29 (`welcome2future` + `wilsons1916`, #206, debt #78) — the #92 two-level content-band model is now the BINDING resolution of the long-open "grow the `Era` enum vs. data-model" question (IN FAVOR of the data-model), confirmed from BOTH timeline edges (1916 Era-of-Hollywood OPENING + the TERMINAL Future band):** with Future/Populism/Hollywood/Gilded/Progressive labels ALL needed, the enum would balloon, so the band labels are era-content DATA in K4's registry and the `Era` enum (if kept) stays a coarse rules-tuning key — this row's `advanceWhen` content-bands ARE that data model. The Future band is the terminal, under-built edge (doubly unbuilt: absent from the enum AND legislation-stubbed). The two-level structure (point-banked Historical Eras + per-decade census) is unchanged — batch-29 only PINS the enum-vs-data answer. No scope change, no re-sequence. | K0 | M | gap #2 (`fed` 11,518; `modern` 1080,1172; `hd` I-12, 6679-6816) + **#92 (`rep1800` §B 4329, 5082, 5255-5256, 5602, 5828-5837; §A open-Q 1)** + **#102 multi-save proof + dual-scoring (`tea1772` 21/62/91/130/153 + `rep1800` 92/6201)** + **#106/#109 two-level + content-clock (`nuke` §27.1/§28.9)** + **#92 4th-start corroboration (`dem1820` POST 946 — "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)")** + #68 (banking) + divergence #18, debt #5/#9 + **★★ #92/#90 5th-start corroboration (`terror2000` — the FIRST NATIVE 2000-start confirms era-gated content [Space Force/Sonny-Bono locked until Era of Populism] + the "earn it forward" framing [#153 rookies 0-Command])** + **★★ #161/#92/#41 6th-start corroboration (`ideo1928` — a 1928 interwar start re-emits the same start-independent band labels + era-keyed draft-ideology + nation roster; NO code change, pure confidence)** + **★★ batch-22 #68/#2 SPEC-ANCHOR CONFIRMED via a CURRENT-RULES live boundary instance (`modernday#POST 1871/1874/1902` — the 6-clause banking ritual + score-reset + faction-trade window + procedural-content swap fired at the REAL 2024 transition, matches `rep1800`; NO priority change; game-mechanics §27.2.1, strengthens debt #5)** — CARRIED + RE-SPECCED, **6-START-CONFIRMED (1772/1800/1820/1856/1948/2000+1928), HIGHEST-CONF (6 independent start years); #68/#2 banking spec-anchored from BOTH 1800 + current-rules** | ready |
| K4 | **Era enum growth + `scenario1788` + era-keyed tables + the `BootSheet` schema + the per-era CONTENT-BAND registry (batch 7, ★)** | Add the era value(s) the timeline needs — `gilded`/`progressive` between `nationalism` and `modern` (`Era`, `types.ts:1337`); fill every `Record<Era,…>` table the TS exhaustiveness check flags. **First new scenario is `scenario1788`, NOT gilded/modern** (§9.1.1): a mid-government boot on the `scenario1856` template (`scenario1856.ts:177-193`) — pre-seated Washington admin, start at phase 2.1.2. New files: `scenario1788.ts`, `factions1788.ts`, `states1788.ts`. Per-(faction, era) `FACTION_DRAFT_PROFILES`. **Era-keyed tables:** rookie draft-grant (#69: 3 traits + 3 alt-states; reverse-PV order + pick-position bonuses); amendment-ratifier/threshold stub (#64); **double-points-issues per era (#87 — Populism: Climate Crisis + Immigration); procedural-pol-gen `startYear` per era (#90 — Populism: 2020).** **Batch 6 — the `BootSheet<{era, startYear, factions, sittingGovernment, stateRoster, decks, …}>` schema.** Three documented mid-government boots (1788 designed / 1856 shipped / 2012 designed) share ONE shape: pre-built 5 Blue + 5 Red faction roster + per-faction archetype politicians + era-tuned ideology/interest/lobby decks + sitting government keyed to start year + **state roster keyed to `{era, startYear}`, NOT era alone** (same `modern` enum has BOTH the 50+DC fresh-boot roster AND the 53-state Wyoming-Rule continuation roster) + EXPLICITLY EMPTY baselines (no faction leaders at boot, no career-track pols, no inherited PV/legacy/Kingmaker pairs) + the generic-Major-candidate fallback for the first primary (1 command + matching ideology + matching interest/lobby). **Build the schema ONCE, instantiate per era.** Era identity is **data configuration**, not a code path (R1's "Trumpism" deck is the seed configuration of one faction, not a "Trumpism mechanic"). **★ Batch 7 — the era-content registry is the HOME of the CONTENT-BAND model** (§9.1.5 / divergence #18): each era is a `{bills, eraEvents, draftees, biasTable, advanceWhen}` record (the `advanceWhen` condition + the `territoryOwned` content-gate live here, consumed by K3). **The early-republic sub-bands (Republicanism / Democracy / Manifest-Destiny) are content-band MARKERS on the game-state gate, NOT new enum values** unless rule tables genuinely diverge from `nationalism` (open Q; tech-lead's call: **markers first** — cheapest, no exhaustiveness cascade; the shipped 4-value enum stays, `gilded`/`progressive` remain the two values K4 adds because *those* have divergent rule tables). **★ Batch-8 hard guard (NEGATIVE RESULT): K4 adds EXACTLY `gilded` + `progressive` — NO "future" era.** No ingested thread reaches a post-Gilded/post-modern era (`tea1772`, titled "…to future," stalls at 1874 mid-Gilded; `hd`/`drums`/`pop` top out at Gilded/Progressive/Populism), so there is **no source and no build target** for a future era — do not add an enum value for one. **★★ Batch-29 (`welcome2future` + `wilsons1916`, #206, debt #78) — the BINDING RESOLUTION of the "grow the enum vs. data-model" question, IN FAVOR of the DATA-MODEL (a re-confirmation of this row's "markers first" call, extended to the TERMINAL edge):** the downstream-most thread reaches the Future band and the 1916 thread the Era-of-Hollywood OPENING — both are content-band LABELS, NOT enum values, and the Future band is **doubly unbuilt** (absent from the enum AND under-content'd, events done / legislation a stub). With Future/Populism/Hollywood ALL needed, a flat enum would balloon, so **band labels live as DATA in THIS per-era era-content registry, and the `Era` enum (if kept at all) stays a COARSE rules-tuning key** — exactly the "markers first" path. The Batch-8 NO-`future`-ENUM guard HOLDS (it's a registry band, not an enum member); `gilded`/`progressive` remain enum values ONLY for their divergent rule tables. **PLUS a separate Era-of-the-Future proposal-library authoring epic** (legislation is the missing half — folds into the era-content authoring at E31 / Author-before-build). No new keystone, no scope change beyond this annotation. **★★ Batch-30 (`ampuData` + `revampPV`, #221, debt #88) — TWO SCHEMA FIELDS the authoring source confirms this era-content registry needs (the authoring-side confirmation of the #92 two-level model, NO scope change beyond adding two fields):** the `EraEvent` shape (`types.ts:1466-1482`) lacks (1) a **scripted-vs-flavor TIER FLAG** (flavor / 2nd-3rd-tier events are narration-only and post-launch scope — vcczar repeatedly declines flavor-event suggestions, `ampuData` POST 4, 41 → the importer must carry the flag so flavor events defer) and (2) **per-category FIRST-ACTIVE-ERA metadata** (Pres-Actions / SC-Cases / Gov-Actions are explicitly *"Not functional"* pre-1789, POST 1, 2, 5 → each content category [scripted events / legislation incl. deactivations / pres actions / SC cases / warfare / gov-action unlocks] must be era-gated on/off with explicit first-active-era metadata, NOT a flat uniform schema). Both are **SCHEMA fields, not engine logic** (XS-S each); they fold into this registry's `{bills, eraEvents, draftees, biasTable, advanceWhen}` record. The canonical content **terminates at Biden/2022 with zero future-band rows** (POST 81) — the authoring-side confirmation of the batch-29 #206 future-stub finding and the #92/#68 per-category gating. No re-sequence. The **per-era state-bias table swaps in wholesale at the boundary** (#68 step 6 — pairs with DH-34's static-bias decision: ship static per-band tables). Wire **QW8 Senate-class verifier (DH-24)** + **QW9 `TRAIT_CONFLICTS` validator (DH-27)** into the boot pipeline. **★ Batch-9 — STRUCTURED era-event-data requirement (DH-48, §28.9), lands here:** era-event content rows must carry a **STRUCTURED `evDelta`/census field (not free-text)** + **per-era completeness validation** so a 10-yr census reallocation (K3 level (b)) always fires — the whole Neocon census/EV-delta event block was LOST in the source spreadsheet *because* the events were free-text flavor (stored alphabetically-by-era; EV-change events lacked the token "EV" → unsearchable → mis-moved to the wrong band). The typed field lives on K4's era-content registry; the completeness check lives at the dataset-build validators (sibling to QW8/QW9). **★ Batch-9 — `scenario1948` is a FOURTH `BootSheet` boot shape** (alongside 1772 / 1856 / 2012): a Cold-War mid-government boot (Truman/Barkley seated, **48 states** with AK/HI arriving as statehood bills, 5R/5B with **Dixiecrats INSIDE Blue + Reagan-a-Democrat** [the realignment start], the full modern+Cold-War cabinet incl. **Ambassador to the USSR**, a ~6-yr era→year clock offset). The schema is unchanged — `scenario1948` is one more instantiation; the *content* instantiation itself is the Phase-2 capstone E30. **★ Batch-10 — the shared `scenarioBoot(BootSheet)` PIPELINE is PROMOTED to the front of the subsystem queue (#115 / §9.1.9), and it FOLDS INTO this `BootSheet` schema — it is NOT a new keystone.** `dem1820` records the **single most-requested missing item in the forum's own words: there are NO documented rules for CREATING a game.** GA setup is improvised — verified shipped-state has **NO shared boot abstraction**: `startNewGame` (`GameContext.tsx:264`) switches on a literal into hand-authored `build1772Scenario`/`build1856Scenario`; `scenario1856.ts:44-214` seats Congress with raw `Math.random`, naive Senate-class assignment, full `EV-2` House reps, a 47-field `GameState` literal; no career-track seeding, no Command-stripping. So **build ONE pure `scenarioBoot(BootSheet): FullGameSnapshot` pipeline** that canonicalizes the deterministic setup algorithm the GA invents per game: the **strip-Command decision** (the contested "≤40 boot pols w/o a job lose Command" house rule — `dem1820` POST 82; a boot-pipeline policy), the **inaugural career-track seed from the LAST-3 draft classes** (the 1820/1816/1812 classes, POST 28 — pairs with DH-25), **era-keyed industry init for new states** (NOT 0, POST 532), **Senate-class assignment + the QW8 verifier**, **vacant-seat appointment-fill via the appointment-ladder** (#115b), and the **5+5 ideology ladder + era-tuned decks**. **Dependency order is LEGIBLE: K0 (seeds the boot rolls — drop the raw `Math.random` Senate/Congress seeding) → `scenarioBoot` + `BootSheet` (built HERE, with K4) → every scenario (1772/1788/1820/1856/1948/2012) becomes a DATA ROW fed through the one pipeline.** **★ Build it WITH the first new scenario — `scenario1788` (Phase-1 #1 / E1) — BEFORE the third hand-authored copy-paste of a scenario** (1772 + 1856 ship hand-authored today; `scenario1788` is the third — author the shared pipeline instead of copy-pasting `build1856Scenario` a third time). This is **also the venue for the XS boot validators** (QW8 Senate-class DH-24, QW9 trait-conflict DH-27 — both now confirmed wrong AGAIN in `dem1820`'s boot/sheet data) **and the appointment-ladder** (#115b — own-party-not-CT → own-party-CT → opposite-not-CT → opposite-CT → generate; an XS rule on the boot/appointment path). **★ Batch-10 — the #92 era-band model is now 4-START-CONFIRMED** (1772 `tea1772` + 1800 `rep1800` + **1820 `dem1820`** + 1948 `nuke`; `dem1820`'s own per-faction draft-ideology table prints "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)", POST 946) — a **confidence bump only**, no scope change; the early-republic sub-bands remain content-band markers as specced. **★★ Batch-13 — the `scenarioBoot` pipeline gains a NEW boot-seed step (DH-61, S): seed ERA-ACTIVE WARS.** The all-CPU 1788 run **forgot the Northwest Indian War entirely** ("lmao we literally forgot", `oopscpu#POST 338-344`) — scenarios boot at peace today except the 1772 Rev War. Add a **`BootSheet.activeWars` field + a boot hook** that reads a start-year active-wars table (1788 → NW Indian War: active, 20%-loss, **War Score −2**; 1840 Seminole; 1856/1868 Apache/Navajo; 1972 Vietnam −10; 2012 War on Terror) and instantiates each running war over the generic `War` model (E3). **This is a HARD `scenario1788` (E1) prerequisite — it lands HERE, in the boot pipeline, WITH E1.** Pairs with #45 (war engine) + #86/#115 (scenario boot). **★★ Batch-22 — the #115 boot picker gains a START-YEAR PRESETS table (#173, S; `modernday#POST 2964`, debt #51, game-mechanics §27.9): the New-Game picker presets = the 14-band era openings.** Verified UNBUILT: `NewGameScreen.tsx` hard-codes a two-entry `SCENARIOS` array (`type ScenarioId='1772'|'1856'`) and `startNewGame` (`GameContext.tsx:264`) admits exactly those two — there is **no era→start-year axis at all.** The GM's closing verdict: *"For any new test start date, it must be the date a new era begins. One of the issues we ran into with this test was it started in the middle of an era."* Expose a **PRESETS table on this `BootSheet`/`scenarioBoot` picker** keyed to the canonical 14-band era→start-year→first-president map (Independence 1774 / Federalism 1788 / Republicanism 1800 / Democracy 1820 / Manifest Destiny 1840 / Nationalism 1856 / Gilded 1868 / Progressivism 1892 / Normalcy 1916 / Ideologies 1928 / Nuclear Age 1948 / Neocons 1972 / Terror 2000 / Populism 2012) — **each preset = "another scenario-as-data-row"** (the `scenario1868`/`scenario1788` pattern), so it is **GATED on `scenarioBoot` existing.** The UI delta is small (a presets dropdown/grid on `NewGameScreen.tsx` replacing the two hard-coded buttons); the WEIGHT is the boot sheets each preset points at (the era-content/scenario work this row + E30/E31 already scope). **No new keystone, no scope change to the pipeline — it is the boot-picker UI surface on top of #115.** **★★ Batch-22 — DH-69 (no in-app rules / legal-move surface) SHARPENS this #115 boot-procedure gap (UX/onboarding, NO engine size of its own; `modernday#POST 342-356`):** grep `rulebook|legalMove|availableActions|helpPage|tutorial|onboard` in `src/` = ZERO hits — players "winging it." An **in-app rules / legal-move surface** fixes that AND **serves the CPU cluster** (a legal-move enumerator is the same primitive a CPU action-picker needs — it bears on K5/E9) AND addresses the recurring GM-burnout theme (DH-36 family). **CITE-here only — not a standalone build row** (no engine size; folds into the boot/onboarding + CPU-AI work). debt #53; game-mechanics §27.9. **★★ Batch-24 RAISES DH-69's justification to the strongest in the corpus (no scope change): `rookie1772` is the cleanest ONBOARDING signal in the KB — a rookie walls on phase-processing / meter-prereqs / phase-order / era-transition / the Lingering phase ("never run before… more complicated than I expected," `#POST 1370`), and CANNOT find the canonical 1772 boot state (handed a "hybrid between 1772 and 2020" sheet, `#POST 19`); with `grass1772`'s 2-humans-can't-hand-run-8-CPU death this is the 4th GM-burnout death. The in-app guided phase-processing + rules/legal-move surface is the load-bearing "make it playable solo" UX; the #176 meter-prereqs/caps should surface here too. CITE-only, no engine size.** | K3 | M–L | gap #2, #4, #41 (`fed`; `modern`) + #69 (`hd` 3, 2155) + #64 stub (`hd` I-9) + #86/#87/#90 (`pop` 1, 12, 17, 30, 45, 264, 699, 1031-1033) + **#92 content-band registry (`rep1800` §B 5140, 5608; `dem1820` POST 946)** + **#102 dual era-scoring = the WIN-CONDITION scoreboard (`tea1772` + `rep1800`)** + **DH-48 structured era-event data + the `scenario1948` 4th-boot shape (`nuke` §28.1/§28.9)** + **#115 scenario-boot pipeline + the boot-PROCEDURE spec (`dem1820` POST 1, 2, 28, 32, 82, 159, 532; `GameContext.tsx:264`; `scenario1856.ts:44-214`)** + DH-24/DH-27 + **★★ DH-61 boot-seed active wars / `BootSheet.activeWars` (`oopscpu#POST 338-344`) — a `scenario1788`/E1 prerequisite, lands in this pipeline** + #143 binds at `runPhase_2_10_End` (separate, QW17) + **★★ batch-18 #161 6th-start era-band confirmation (`ideo1928` — 1928 interwar; confidence, no scope) + #164 the unsettled MID-GOVERNMENT START-STATE model folds into the `BootSheet` start-state field (`ideo1928#POST 184-188`: election-start vs president-in-place vs president-with-historical-cabinet; players favor president-in-place, HUMAN-gated tuning, not a blocker — §30.9)** + **★★ batch-22 #173 New-Game START-YEAR PRESETS = the 14-band era openings on the boot picker (`modernday#POST 2964`, S; `NewGameScreen.tsx` hard-codes 1772/1856 only — UNBUILT; each preset = a scenario-as-data-row on this `BootSheet`, GATED on `scenarioBoot`; debt #51, game-mechanics §27.9)** + **★★ batch-22 #68/#2 point-banking SPEC-ANCHOR CONFIRMED — a current-rules LIVE instance of the 6-clause banking ritual + score-reset + faction-trade window + procedural-content swap fired at a REAL 2024 boundary (`modernday#POST 1871/1874/1902`), matches `rep1800` → #68/#2 confirmed deterministic from BOTH a 1800 and current-rules angle; NO priority change, stays folded into K3/K4, spec now SOLID (game-mechanics §27.2.1, strengthens debt #5)** — CARRIED + RE-SPECCED + EXTENDED, **6-START-CONFIRMED (era model: 1772/1800/1820/1856/1948/2000+1928), HI-CONF (5-boot pattern)** | ready (now carries the DH-61 boot-seed-active-wars step for E1; **#164 start-state model = a human-gated `BootSheet` field; ★★ #173 start-year presets = the boot-picker UI on top of #115, S**) |
| **K5** | **`CpuController` scaffold (NEW, batch 5)** *(parallel with K3/K4)* | New directory `src/engine/cpu/` holding (a) `CpuController` orchestrator (`controller.ts`), (b) `CpuHandler<Ctx, Decision>` interface (`types.ts`), (c) shared deterministic tie-break utilities (`tiebreaks.ts`: `pickWeighted`/`pickByLowestScore`/`breakByPolId`), (d) two `repair()` backfills for the persistent state the architectural-gap handlers need: `GameState.cpuCommitments?: {…}[]` (DH-20 reciprocity ledger) + `GameState.recentScandalIds?: {…}[]` (DH-22 scandal cooldown). Plus a determinism test (registers a fake handler, asserts same seed → same decision). **~120 lines total.** The orchestrator itself is *runtime* — no save shape; only handler *outputs* hit the snapshot. **K5 unlocks the 15 follow-on CPU-handler PRs in §6.6.1 — the §25 spec has nowhere else to live.** It does **not** block scenario work (`scenario1788` + 1856-arc can ship with today's CPU stubs and upgrade together when the handlers land). **★ Batch-9 — LOAD-BEARING, not optional/late (§9.1.3 priority bump):** `nuke` carries the designer's strongest design-intent statement (#114) — the **APP is 1-human-vs-9-CPU**; the app is a solo adaptation of a multiplayer game, so the entire MP apparatus (party-leader elections, conversions, kingmaker pairings, committee assignment, cross-faction endorsements, forced 3rd-party runs, the whole convention) **must be CPU-AI-driven**, and `nuke` confirms that surface was **entirely UNEXERCISED** by the human playtest (author from spec). **K5's PLACEMENT is unchanged (after K0+K2, parallel with K3/K4) — its PRIORITY rises:** K5 + the E9 handler suite are now a first-class system, the difference between a playable solo game and not. | K0, K2 | S (~120 lines) | gap #70-#78 (§25 master) + DH-8 (the marquee unstable surface) + DH-20/DH-21/DH-22 (architectural gaps need persistent state) + **#114 APP = 1-human-vs-9-CPU (`nuke` §28.12)** + **★ batch-13 — the scaffold's `recentScandalIds?` backfill is now exercised by OC-1 (scandal-resignee cooldown, handler 9d) and the spec is `oopscpu`-validated** + **★★ batch-24 — K5's JUSTIFICATION is now strongest in the corpus: two founding-era runs (`grass1772`/`rookie1772`) DIED to the manual CPU-faction sim (4th GM-burnout death w/ `modernday`+`pop2012b`); K5 + the E9 handler suite are the #114 CPU-AI that makes the app playable solo. Priority/confidence raised ONLY — placement (after K0+K2, parallel with K3/K4) UNCHANGED** — NEW + ELEVATED + VALIDATED, **★★ JUSTIFICATION RAISED (batch-24, no re-sequence)** | ready |

### GM-replacement lens (cross-cutting VIEW — NOT a re-sequence)

> **This section is a VIEW over the items above and below, grouped by which half
> of the human Game Master's job each one retires. It is NOT a re-listing of the
> specs and it does NOT change priorities or the top of the queue.** The full
> requirements stay in the keystone / Phase-0/1/2 / quick-win tables; each row
> here just POINTS to where the item already lives and names the GM labor it
> removes. Charter: `game-context.md` → **"★ North-star: the app must subsume the
> human GM"**; sequencing: `technical-guide.md` §9. **Top of queue is unchanged:
> QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

The North-star is a **zero-human-GM game**: every GM hand-adjudication recorded in
the digests is, by definition, an automation requirement (deterministic, seeded
via `src/rng.ts` — never a human die-roll or a raw `Math.random`). The GM does
**two distinct jobs**, and the lens shows the GM-replacement program is the
**spine of the backlog** — the keystones + the bulk of Phase 1 exist to retire one
half or the other. **Reading it does not re-order anything**: it is a lens, not a
plan; the dependency-ordered tables above/below are authoritative for what builds
when.

**① GM as referee / calculator** — the rules math + machinery the GM computes by
hand each turn (the half batch-27's 492-40 platform landslide exposed: the
platform "engine" is GM arithmetic, not code). Moves into the deterministic
engine; the UI shows only player-visible numbers (fog of war).

| GM labor this retires | Grouped gaps | Lives in the roadmap at |
|---|---|---|
| Election / platform scoring, the swing die, historical-bias terms | #184, DH-72, #18, #14, QW3, **QW19–QW21**, **debt #71** | **Quick-wins** (QW3 ±3 cap, QW19/QW20/QW21 = DH-72(a/b/c) seed+narrow / bias-band / hide-the-math) → **E20** (bill/election scoring) → the #184 platform meter-cap builds INTO **E10/#181**. **★ Batch-28: debt #71 is the TECHNICAL DEFINITION of the QW19–QW21 trio + the batch headline — it fuses the swing-die seed+narrow + the flagship `Math.random` leak (debt #1) + the D6/D3 fork in ONE patch; the election die is REFUTED-as-shipped (`:3711` raw `Math.random`, no die), so this QW IS the work.** |
| **★ PV-electability — the per-trait + per-ability Politician-Value math that decides "who's electable" (the CPU's draft/leadership heuristic AND a direct election-score input)** *(batch-30 — `GM⇒App`)* | **#214** (per-trait tier table), **#215** (per-ability curve + Command re-weight), **#216** (trait-name remap — BLOCKING), **DH-77** (floor-offset clamp) | **Quick-wins** for the front half (**QW22 #216** remap + **QW23 DH-77** clamp — the cheap, no-balance-risk part) → a **Phase-1 GATED BALANCE EPIC** for #214/#215 (debt #85; `pv.ts:70-88` is a flat ±4/−5 + flat skill/command formula today). PV is BOTH the CPU's draft/leadership pick heuristic AND a direct election input — `calcStateVote` reads `pv=c.pvCache` and adds `pv*0.1` to every state score (`phaseRunners.ts:3699,3709`), so this is the SAME ① referee surface as the election/platform row above; the #214/#215 reweight MUST re-tune `pv*0.1` in the same PR. GATED on the un-ingested "Groupthinking the Political Value" trait-EFFECTS thread. |
| **★ Presidential/cabinet IMPLEMENTATION + governing engine — the post-legislation success→Blunder pass + ~30 governing traits the GM resolved by hand** *(batch-30 — `GM⇒App`)* | **#217** (implementation sub-engine: expertise-gated genre traits + Delegator/Micromanager + Crisis-{Manager,Admin,Gov} + Passive/Predictable + Passive+Pliable PUPPET + Magician) | **E16** (cabinet) + **E6** (lingering/blunder) — an **L system layer** riding #179's roll engine (`phaseRunners.ts:3260`) + #182's action budget (`:3632`) + §14.1.y; gated on federalism existing. De-dup vs Efficient/Egghead/Easily-Overwhelmed first; these traits also need PV values (#214) + the remap (#216). debt #86. |
| **Down-ballot election scoring: per-office trait stack, expertise/lobby↔industry "Manchin" survival, per-seat gerrymander bias, max-margin→popular-vote-% caps** *(batch-28 — `GM⇒App`)* | **#189, #190, #191, #192** (with #103, #20) | **E20b / `calcStateVote`** — PARTLY-BUILT (the route already applies *some* presidential traits at `:3685,3707-3708`); debt #73, M, builds ON the existing routing. The per-seat `deviantPartyBias` (#191) is SET-BY the gerrymander gov-action (#20, debt #74). |
| Primary → brokered convention: delegate weights, balloting, walkouts, kingmaker VP | #185, #183, #19, #20 | **E10** (Convention machinery 2.9.2; #185 the biggest election subsystem + #183 endorsement-momentum fold in here) + **E22** (primary) |
| Scenario boot: year-correct incumbents, seeded delegates, back-dated careers, retro-fatigue (incl. mid-cycle / late-era shape) **+ a retro-cohort bench for thin-dataset starts** | #186, #187, #86, #115, #173, **#209** *(batch-29)* | **K4** (the `BootSheet` schema + `scenarioBoot` pipeline; #186 = a 5th `BootSheet` shape, #173 = start-year presets) + the boot validators **QW8/QW9** + #187 pairs with #15. **★ Batch-29: #209** = a boot-time retro-gen of SUB-FLOOR career-track cohorts (Ambassadors/Admirals/lower-Justices/bench-Reps, routed through `rng.ts`) for non-1772 starts whose real dataset thins — the boot prerequisite for ANY deep-modern / Future-band start; folds into this same `scenarioBoot` pipeline; debt #83. **★ Batch-30: #115 generate-a-candidate** (the candidate-pool generator the GM hand-ran when the bench thinned — `wilsons1916` hand-built "Joe Simpson (auto-generated)") is sharpened by the full `ampuUpdates` spec (name-DB demographic tagging + 1/9/20/20 tiering + generate-on-vacancy→lowest-score backfill); the forward rookie-gen path (`phaseRunners.ts:177-209`, raw `Math.random` `:188-198`) lacks all three → folds into this same `scenarioBoot`/retro-gen cluster (K4, §9.1.9; overlaps #74's player-facing generate); debt #90, S-M. |
| Cabinet meter rolls / lingering effects | #179 | **E6** (lingering/meter) + **E16** (cabinet) — #179 is split-but-buildable across the two. **★ Batch-28: #179 now has NUMBERS** (debt #72; `Admin→{upOdds,downOdds}` roll + Efficient±2 + 25% lobby-dissat + the JCoS/Senior-Gen/Admiral exclusion [#49] → replaces the placeholder `drift()` at `phaseRunners.ts:3260`; S-M, standalone, READY). |
| **Confirmation/appointment toxicity + laws that move people, not just numbers** *(batch-28 — `GM⇒App`)* | **#199** (confirmation-rejection → Controversial→Incompetent cascade), **#200** (bills with personnel effects — eject/disqualify officeholders), **#193** (interest-acquisition at the 20-yr career mark) | **E16/E9-handler-9d** (#199, ACCEPTED, S) + **E2/E25** (#200 bill `personnelEffect`, optionally via SCOTUS, S-M) + **E13/#163** (#193, RESOLVED, S) — debt #77; all NOT-built today. |
| **★ Legislative referee: filibuster + era-keyed cloture, the CPU legislative/confirmation vote rules, cross-party cabinet caps, and a bill-proposal validator** *(batch-29 — `GM⇒App`; the LEGISLATIVE HALF of the referee that the modern hands-off run proved the engine doesn't yet own)* | **#208** (CPU maj-leader filibuster-override + maj/min-leader vote rule + cross-party cabinet caps), **DH-76** (filibuster→era-keyed Cloture counter, no cloture path today), **DH-74** (`billProposable` predicate — only LEGAL proposals surface) | **E9 handlers 9b (legislation) + 9d (cabinet), K5-DEPENDENT** for #208/DH-76 (`grep filibuster\|cloture src/` = ZERO; the loop is committee `phaseRunners.ts:3463` → floor `:3498` with NO filibuster step between; all deterministic, NOT a roll; debt #80, M). **DH-74** binds at `runPhase_2_6_1_Proposals` (`phaseRunners.ts:3431/3444`) and **SHARES the territory/era content-filter with #206/#92 + DH-60 — build the predicate library ONCE, use it for events AND bills** (debt #81, S-M). **DH-14 is NOT here** — it is a ② opponent-half CPU-AI artifact (see below), not a mechanical block. **★ Batch-30: DH-76 now has its ORIGIN** — the filibuster-without-cloture rule was FIRST authored in `summer2021` (the batch-26 run's changelog); the batch-29 `wilsons1916#P349` finding was the downstream symptom. No re-size (the cloture build stays E9 9b, K5-dependent, debt #80/#208). **The legislative content-filter this row's DH-74 validator shares with #206/#92 + DH-60 is also where #221's per-category era-activation metadata (legislation incl. deactivations) lives** (debt #88, K4). |
| **★ Military-appointment eligibility (citizenship + experience-type→branch gating)** *(batch-29 — `GM⇒App`)* | **DH-75** | The GeneralInChief filter checks ONLY `!p.currentOffice && p.skills.military >= 3` (`phaseRunners.ts:2256-2261`) — no citizenship gate, no Army↔Navy match (so Pancho Villa/Aguinaldo were appointable as US generals, Nimitz auto-slotted despite naval exp, `wilsons1916#P162-169`). Add both checks to the officer-appointment filter; XS-S, standalone, pairs the 1916-bare-boot officer corps (#209). debt #82. |
| **Subsystems the GM ran by hand that have NO code path at all** *(batch-28 — `GM⇒App`; 9 re-confirmed ABSENT, spec'd, LOWER priority)* | **debt #74** (US-Rep Voting-Power #34/#62, player Generate-a-candidate 3.0.25, gerrymander gov-action #20), **debt #75** (Acting-Presidency 3.0.33, Do-Not-Enforce Pres-Actions #23, Master-Kingmaker promotion #128), **debt #76** (Secessionist/pardons 3.0.35 #121/#122, rising-sea EV #41, trait-renames #168) | Each binds where its gap row notes (E2/E4/E13/E22/E25/E28 + the #20 gov-action umbrella); sizes XS→M. **The B2/B3 Vic3 gov-actions (meter-boost + migration) fold into the #20 gerrymander/gov-action umbrella (debt #74), not a new row.** |
| Treaty / decision-event / diplomacy adjudication, retry budgets | #177, #178, #107, #162 | **E1** (federalism epic — #177/#178 territory + decision-events) + **E15** (era-event extensions) + **E12** (diplomacy) + **E13** (exec actions) |
| End-condition tracking (incl. the "big red button" nuclear loss) **+ the timeline-COMPLETION terminus** | #88, #188, **#207** *(batch-29)* | **E6** (meter-floor game-end + endgame/apocalypse clocks; #188 is a configured end-condition ROW on #88, NOT a MAD engine). **★ Batch-29: #207** is the COMPLETION-vs-LOSS half — the build has NO year-cap / victory / sandbox terminus (`gameEnded` fires at ONE event-driven site, `phaseRunners.ts:2871`; `phases.ts` predicates are pure `year % N`), so a timeline-completion DECISION (year-cap / sandbox / score-out) is owed, modeled as a DISTINCT end-state from LOSS; decision-gated, debt #79. |
| Explaining the rules so players don't need a GM to interpret them | DH-69, QW21, **#195, #202** | **K4** boot/onboarding surface (DH-69 in-app rules / legal-move surface, CITE-only) + **QW21** hide-the-math (presentation track) + **★ batch-28 #195 records-archive** (queryable past elections/administrations/votes/wars + per-pol history tab + end-of-era summary + graveyard — the GM hand-maintained these records) + **#202 Campaign-Advisor / Think Tank** (reuses CPU logic to suggest 1-3 moves to a solo player; pairs with #114 the CPU controller it reuses). |

**② GM as opponent** — the GM also *plays* every non-human faction (in solo runs,
all 9). The app is a **solo adaptation of a multiplayer game** (#114: built for
1-human-vs-9-CPU), so the entire multiplayer apparatus must be CPU-AI-driven.

| GM labor this retires | Grouped gaps | Lives in the roadmap at |
|---|---|---|
| Per-faction CPU decisions: candidate selection, voting, meter management, cabinet/legislative heuristics | #114, E9, K5, CPU-AI spec cluster **#70–#78** | **K5** (`CpuController` scaffold — keystone) → **E9** (the 15-PR handler suite). **★ Batch-29: `welcome2future` (8-of-10 factions on CPU rules) is the corpus's MOST COMPLETE modern CPU-turn sample** — a full 2022 turn ran hands-off and produced plausible outcomes (charter evidence that zero-human resolution WORKS), reinforcing E9/K5; no re-sequence. |
| **★ CPU-AI *artifacts* mistaken for mechanical blocks** *(batch-29 — a ② lens correction)* | **DH-14** | The 19th Amendment ("Equal Voting Rights for Women") PASSES in the 10-human 1916 game (House 374-61, Senate 79-17, ratified, `wilsons1916`), so the `drums` all-CPU "this amendment will never pass with CPUs" is a **CPU-AI / era-ideology-weighting artifact, NOT a mechanical block** → fixed by the era-keyed bill-ideology table (move Mods off suffrage's negative side in 1916; debt #5-adjacent) + a CPU vote model (**#208** / E9 handler 9b) that can reach 2/3 like a human field. No standalone work — it folds into the era-content table (① data) + the CPU legislative engine (② opponent). |
| (the cost of NOT having it) | **DH-36** | the 4 documented GM-burnout playtest deaths — the *reason* K5/E9 are load-bearing, not optional |

**Why this is the spine.** The single most-corroborated cross-batch lesson is that
the manual CPU-faction sim (②) + opaque rules (①) are what *kill* playtests
(builder burnout, player confusion), and the only runs to reach a natural endpoint
did so because the designer personally absorbed the GM load. K0 (determinism) + K2
(action registry) + K5 (CPU scaffold) + the boot pipeline in K4 are foundational
*because* ① and ② sit on them. **But foundational-first is already the queue's
order** — this lens explains the *why*, it does not move anything.

**`GM⇒App` tagging convention (for future ingests).** Per the charter, when a
digest records the GM doing something by hand, tag it **`GM⇒App`** and give it (or
confirm it has) a gap-log row. A `GM⇒App` item is never "designer flavor" to leave
to a human — it is an automation requirement. New `GM⇒App` gaps slot into the lens
under ① (if they are rules math / machinery) or ② (if they are CPU-opponent
behavior), then point to whichever keystone / phase / quick-win bucket already
owns that surface — **adding a lens pointer never re-sequences the backlog.**

> **★ Batch-28 is the FIRST batch read through this lens, and it was a heavy `GM⇒App`
> harvest** (the `to-do`/`fixes`/`completions` meta-docs are, by definition, "the GM's
> hand-work the app must own"). The new ① pointers added above: the **down-ballot scorer
> #189–#192** + the **#199/#200/#193** confirmation/personnel/interest cluster + the **9
> NOT-IN-OUR-BUILD subsystems** (debt #74–#76) + **#179's now-numeric meter engine** + the
> in-app **#195 records-archive / #202 Campaign-Advisor**. The lens also REFLECTS the
> batch's verification verdicts: the cabinet trait-conflict d6 is **CONFIRMED-BUILT** (so it
> is NOT a `GM⇒App` gap — already retired, `traits.ts:53` via `rng.ts`), while the election
> die is **REFUTED-as-shipped** (so the swing-die row's debt #71 QW genuinely retires GM
> die-rolling). **Adding these pointers re-sequenced nothing — top of queue is unchanged
> (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).**

> **★ Batch-29 is the FIRST batch to add LEGISLATIVE-REFEREE items to this lens.** The new ①
> pointers added above: the **#208/DH-76 cloture/filibuster + CPU legislative/confirmation vote
> rules + cross-party cabinet caps** (the legislative half of the referee the modern hands-off
> run proved the engine doesn't own — `grep filibuster|cloture src/` = ZERO; E9 9b/9d, K5-
> dependent) + the **DH-74 `billProposable` bill-validator** (which SHARES the territory/era
> content-filter with #206/#92 + DH-60 — one predicate library for events AND bills) + **DH-75
> officer-eligibility** + **#209 retro-cohort bench** (boot row) + **#207 timeline-completion
> terminus** (end-condition row). On the ② opponent half the new entry is a *correction*:
> **DH-14 is a CPU-AI artifact, not a mechanical block** — the 19th Amendment PASSED with humans
> (House 374-61), so it folds into the era-content table (① data) + the #208 CPU vote model (②);
> `welcome2future` is logged as the corpus's most complete modern CPU-turn sample (charter
> evidence). **Adding these pointers re-sequenced nothing — top of queue is unchanged (QW0 →
> K0/K2 → K3/K4 + scenarioBoot → E1).**

> **★ Batch-30 adds the PV-ELECTABILITY + GOVERNING/IMPLEMENTATION rows to ① referee/calculator** (still a
> VIEW, no re-sequence). The new ① pointers: **PV-electability** (#214/#215/#216/DH-77 — the per-trait +
> per-ability Politician-Value math that decides "who's electable," which is BOTH the CPU's draft/leadership
> pick heuristic AND a direct election-score input via `calcStateVote`'s `pv*0.1`; the GM computed PV by hand
> when ranking draft picks and contenders); the **president/cabinet IMPLEMENTATION + governing engine** (#217
> — the post-legislation success→Blunder pass + ~30 governing traits the GM hand-resolved each turn); a
> **cloture/legislative annotation** (DH-76 now has its `summer2021` ORIGIN; #221's per-category era-activation
> metadata is the era-content side of the same legislative content-filter); and **#115** generate-a-candidate
> (the candidate-pool generator the GM ran by hand when the bench thinned, on the boot row). On the ② opponent
> half there is no new entry this batch (the PV math the CPU uses sits under ① as the rules-calculator it reads;
> the candidate generator is a ① mechanic). **Adding these pointers re-sequenced nothing — top of queue is
> unchanged (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).**

---

### Engine track — Phase 1 (subsystems, dependency-ordered)

Ordered exactly per tech-lead §9.6 to minimize rework. The federalism /
early-republic epic (E1) is one spine; **E3b (Civil War / Reconstruction) is the
second — it completes the already-shipped 1856 scenario** and sits right after
generic war (E3) + K2, **not** behind federalism or the modern tail (§9.1.2).
**Batch-7 additions: E4 folds in the 12A legislature-elector toggle; new E4b is
the early-republic cluster** (slavery-flag+Cohens / Second Bank+Bank War /
statehood-by-bill+territory-gate); **new E5b (ideology-as-circle) is the
foundational central-helper refactor placed early** (§9.1.7). Rows **E6–E8** are
the **NEAR-TERM cross-cutting items the modern thread pulled forward** — not
modern-only. **E9 is the CPU handler suite — 15 lightweight PRs once K5 lands;
~~★★ E9 handler #2 is the gate on E3b's Reconstruction readmission half (DH-29).~~
★★ BATCH-16 UPDATE: #156's "plan adopted by Congress OR President" prerequisite lets
the player-President adopt a plan UNILATERALLY via the K2 exec path, so E3b's
readmission half NO LONGER HARD-depends on E9 handler #2 FOR THE SOLO CASE — handler
#2's CPU default-vote bias is now an ENHANCEMENT for the Congress-driven readmission
path, not a solo gate (DH-29 reframed structural + fixed by #156).**
**Batch-8 fold-ins (no new rows, no re-order):** **#100** SCOTUS-overturns-an-
amendment + amendable-threshold → E5 (amendments) + E25 (SCOTUS docket); **#103**
presidential-vote modifier stack + era-issue list + **DH-42** meter-vs-lean balance
→ E20 (election-math/scoring); **#104** lone-ideology convention exploit → E9
handler 9e (guard); **#105** stat-collapse → forced resignation → E10b
(succession); **DH-38** late-ratification/"Rogue Island" window → E1; **DH-40**
SCOTUS-justice-count-not-packaged → game-STALL → E14b (packaging) + E25
(SCOTUS-establish guard), XS-S; **DH-44** post-12A legislature vote-count → E4 (the
12A toggle); **DH-39** all-human Convention deadlock + **DH-37** no pol-trading →
multiplayer/parking lot.
**★ Batch-9 fold-ins (no new rows, no re-order — CONFIDENCE + NEGATIVE-SCOPE + small
placements):** the "Cold War" is **NOT a new epic** — it is **E3 (generic war)
RELABELED + E12 (diplomacy) + content (data on K4)** (§9.1.8). The two REAL items
under the label are already on the roadmap and gain hard build-holes: **E3 must
RESOLVE — DH-47: wars NEVER end today (Korea ran ~2 decades) → build a real
resolution/peace path (couples to DH-12 white-peace) + ideally army/navy/air
BRANCHES** (army generals command navies today); and **E12 (diplomacy) is the real
modern foreign subsystem — 8 relation meters + ambassador actions + DH-46 downward
pressure (the US ends up allied with everyone) + DH-45 fix the USSR-collapse trigger
chain (stalls at a ~5% gate) + a Cold-War ≤Neutral cap on USSR/China.** **E16 extends
to CREATE-AND-ABOLISH cabinet seats** (DOE/DHS created, **Postmaster General
ABOLISHED**, HEW split — `Legislation.abolishesCabinetSeat?`). The **modern
election/institutional layer** folds into existing rows: **#105** stat-collapse →
forced resignation + **DH-54** impeachment/VP-vacancy/succession ruleset →
**E10b/E29** (DH-54 author-before-build); **legislated variable SCOTUS size +
excess-not-replaced (#112)** → **E25**; **#108** gradual 4-lever realignment +
**#110** modern election machine → **E20/E23**; **#113** Era-of-Terror content →
E30 (data). DH placements: **DH-50/53** era-event scheduling + bill-catalog → E15 /
E2; **DH-52** landslide-margin-cap (no close elections) → E20 balance; **DH-51**
modern pols OVERPOWERED/recency-biased → the dataset pipeline (`scripts/`); **DH-55**
3rd-party region-weighted PV + engine-is-2-party-hard-wired → E26; **DH-57**
convention holes → E10 / handler 9e. **`scenario1948`** continuation-boot content →
**E30** (a 4th `BootSheet` shape).
**★ Batch-10 fold-ins (no new rows, no re-order — PROMOTION + decision-gating +
small placements):** **#115 scenario-boot pipeline** → **K4** (the `scenarioBoot(BootSheet)`
pipeline, PROMOTED to the front of the subsystem queue, built with `scenario1788`/**E1**
before the third hand-authored copy; the venue for **QW8/QW9** validators + the
**#115b** appointment-ladder). **TWO decision-gated forks** (parking-lot "Decision-
gated"): **#52** player-controlled SCOTUS (docket → **E25** either way; control surface
gated) + **#18/#51** meter→enthusiasm→election (settled ±3 cap → **QW3**; binding-point
+ state-scope → **E20/E23**, gated). **Sized fixes:** **DH-53** structured bill-effect
tables → **E20** (+ K4's DH-48 `evDelta` shape), S; **DH-24** Senate-class validator →
**QW8** / the boot pipeline, XS; **#55** focus-Rep `(EV−2)/5` + seat-locked incumbency →
**E7** (scaling-wall b) + **E28** (census epic), M; **#59** statehood→sectional-crisis →
**E3b** (b) additive at `admitState`/**E21**, S; **#115b** appointment-ladder +
replacement-gains timing → boot/appointment rules (**K4**/**E16**, pairs with **DH-25**),
XS. **#92 era-band model** → 4-START-CONFIRMED (**K3/K4** confidence bump). **DH-36**
(2nd GA-burnout death) → NOT a row; the prioritization ARGUMENT for the upkeep-reducing
items (#115, #55, E7, K5/E9).
**★ Batch-11 fold-ins (ONE new small epic, two re-scopes, one fork resolved, two
bug-folds — NO re-sequence, NO new keystone, NO keystone moves):** **#116 economic
engine** → **NEW small epic `E4c`** (deps **E2 + E6 + E4b(b)**; built EMERGENT via a
`Bill.replaces` field + a `lockedUntilYear` tariff cooldown; placed below E6 to keep
top-to-bottom buildability), S. **#119 amendment lifecycle** → **RE-SCOPES E5**
(propose→committee→floor→governor-ratify→active + active-amendment-blocks-a-legislation-
class + un-bundleable), +S. **#61 succession** → **RE-SCOPES E10b** (VP-succeeds →
fill-VP [E5-gated] → acting-president action-divert roll + trait side-effect; the kill
trigger already SHIPS at `anytimeEvents.ts:232`/`phaseRunners.ts:2449`; the
line-of-succession/impeachment half stays parking-lot **DH-54**). **#51** → **PROMOTED
to E23 `ready`** (the `arkzag` 4-step reshuffle + −100/waiver, verbatim `drums`); the
**±3 cap is UNCONDITIONALLY ready and ships with E6 (QW3)** — only **#18 state-scope**
stays Decision-gated, joined by a **NEW delegate-class fork** (→ **E10** delegate sub-PR
+ **E24**). **DH-59** relations under-floor clamp → **E12** (XS, folds in with the
9-point scale). **DH-60** era-event territory/asset prereq → **E15 + BUG-1** (S, a
`requires?: Predicate` reusing K3's `territoryOwned`). **Corroborations** (multi-campaign
tags, not rows): #13/#111 → **E10**, #11 → **E14**, #44/#16 → **E4**, #52 → **E25**,
#92 → **K3/K4** (now LIVE-exercised). **DH-36** → still NOT a row; the meta-signal
FLIPS POSITIVE (no GA-burnout this thread — a **3-thread automation-reduces-upkeep
signal**, strengthens #115/#55/E7/K5/E9).
**★★ Batch-16 fold-ins (no new rows, no re-order, no new keystone — TWO epic extensions,
ONE re-scope, ONE dataset add, ONE debt-item reframe):** **#156 4-plan Reconstruction
model** → **RE-SCOPES E3b sub-PR (d)** as the readmission-half DEFINITION-OF-DONE (the
canonical DH-29 fix; `game.reconstruction = {plan, adoptedBy, startYear}` + 4 plans on
both Pres + Congress + the unilateral-adopt prerequisite + the +2 Deep-South / +1
other-seceded bias on `calcStateVote`), M–L; **★★ it REMOVES the K5 / E9-handler-#2
soft-dependency for the SOLO case** (the player-President adopts a plan directly). **#155
war-balance pass** → **EXTENDS E3** (enemy-strength term via `rng.ts` — also closing the
`phaseRunners.ts:3603` `Math.random` determinism leak — + battle-size + Officer-Mil cap +
per-theater + the 1.0/0.5 / naval-gate / war-hero-bonus open Qs), M, **BOUNDED by
1772-RevWar-winnable**, pairs with #152. **#157 CSA-government seeding** → **EXTENDS E3b
sub-PR (a)** (a full Confederate cabinet + generals/admirals from seceded Command/Military
pols for the CSA-victory branch), S, depends on the per-pol Southern-Unionist gate +
DH-64. **DH-64 `Southern Unionist` mislabel** → **E18d** (the #120 dataset umbrella; a
`scripts/seedDataset.mjs` `CURATED_ROWS` audit, the INVERSE of #121's Secessionist add),
XS. **DH-29 REFRAMED** from CPU-only to a STRUCTURAL deadlock (humans on both sides ALSO
deadlocked, `hd1#POST 2678`) now **fixed by #156's unilateral-adopt** — a debt-item
status change, not a new row. **Corroborations** (tags, not rows): **#56/#57/#58/#59** →
E3b (3rd-CW-run / 5th-antebellum confirmed). **No re-sequence; top-of-queue UNCHANGED.**
**★★ Batch-19 fold-ins (`fixes2022` — the EARLIEST discussion source; ONE new subsystem,
ONE epic addition, provenance confidence-bumps, a FROZEN-SPEC risk flag — NO new rows, NO
re-order, NO new keystone, NO keystone moves):** **#167 no-eligible-successor constitutional-
crisis** → **FOLDS INTO E10b** as the no-successor member of ONE **E10b CRISIS FAMILY**
(verified UNBUILT — zero `successionCrisis|actingPresident|coup` in `src/`; binds on the same
`vacateOffice` vacancy site as #61, `phaseRunners.ts:2446-2449`, which just nulls
`presidentId`): emergency-Congress agenda-locked succession-law vote (auto-signed/un-vetoable)
→ House 1-vote-per-state acting-President election → scaled 0/−1/−2/−3 DomStab penalty → coup
branch (same end-condition family as #88/debt #28); **★ SHIPPABLE-FIRST = the PPT-as-acting-
President interim default (S), then the full procedure (M); ★ Step (ii) REUSES the #62
contingent-House-election 1-vote-per-state delegation machinery — build #62 ONCE, reuse for
both (no-EC-majority election AND no-successor acting-President); couples #61 (normal/line-
exhausted fallback) + #88/debt #28 + DH-54/DH-33/DH-66 (impeachment sibling) into the one E10b
crisis family**, M (full) / S (PPT-interim), debt #43. **★★ ENTHUSIASM FROZEN-SPEC RISK FLAG**
→ a RISK ANNOTATION (NO code/scope change) on **E23** (the #51 4-step reshuffle + −100/waiver
crisis-bill scoring) AND **E20b / `calcStateVote`** (the ±3-cap + #18 2-layer scorer, debt #1):
`fixes2022` is the load-bearing provenance that ideology-enthusiasm (#18/#51/#124) is the
system Anthony stalled ~½ into 2.1 on and vcczar **re-derives differently each playthrough**
(POST 713-716) → the single likeliest drift point → **treat the #51 (drums 4-step, §29.10) +
#18 (terror2000 2-layer, §29.3) resolutions as a FROZEN SPEC** (build the recorded model
EXACTLY, do NOT re-derive). **★★ PROVENANCE → build-CONFIDENCE (no resize/move):** `fixes2022`
(Fall 2022) is the EARLIEST source for **#153** (no-reroll-on-held-expertise, the canonical
origin), **#135** (50-50-Senate→VP's-party), **#124** (Integrity/Controversial confirmation-
inflation fix + enthusiasm-swing cap → **E16**), **#121** (Secessionist trait + Reconstruction
appointment rule → **E3b** sub-PR (a)), **#88** (CPU 75%-nay-on-game-over → couples #167's coup
branch) — designer intent from the START; raise confidence where they sit, no item changes size
or epic. **★ Era-event FIRING-RATE budget** (the ~70%/era dynamic limit, POST 114-123; runner
has NO firing budget today, `phaseRunners.ts:2796`) → **small addition to E15** (S; the era-
event scheduling surface, divergence #4) — a dynamic per-era budget, NOT a fixed cap. The
**late-start event boot-filter** (POST 413-423, INTENDED) builds WITH **BUG-1/#92**; the
**scripted-event build-out** maps onto the shipped `EraEvent`/`Predicate`/`addPolitician`
model — CORROBORATION, NOT a gap. **★ #120 dataset umbrella** → folds the `fixes2022` batch in
(**E18d**; ~20 named items + ~10 effect-SIGN bugs → **DH-53** + vcczar's own ~1800-legisprop
audit, POST 367-369; Bob Scott NC-Gov 1-Leg→1-Gov dup = `smallbugs` §2b; ONE
`scripts/seedDataset.mjs` `CURATED_ROWS` pass; record the Leadership-trait-is-deliberately-VERY-
RARE principle). **Corroborations** (tags, not rows): **#88/OC-3, #61, #56-#60, #119/#39,
#92/#72, #115, #38, #160/DH-67/#108, DH-27** + **DH-36** (the `smallbugs` thread's genesis is
here, POST 637-640). **Decision-gated / parking-lot counts UNCHANGED (batch 19 nets 0). No
re-sequence; top-of-queue UNCHANGED.**
**★★ Batch-21 fold-ins (FOUR playtests — ONE ★★ ESCALATION that re-prioritizes a debt item
HIGHER within an epic, TWO era-keyed gaps [one PARTLY SHIPPED], ONE DH bug — NO new rows, NO
re-order, NO new keystone, NO keystone moves):** **★★ #158 CPU ANTI-GAME-OVER → ESCALATED
WITHIN E3 (and coupled to E9 handler 9g / #75 + #114 + the #155 floor).** `cpufull` is the
**2nd live CPU game-over** and **FIELD-FALSIFIES the flat-75%-oppose patch** the E3 row carries
as RevWar floor (3): the patch was applied, yet a game-ending peace passed at a **4-5-4
PLURALITY** after the CC-President's reject was overridden (`cpufull#POST 62-68, 73`; ~2.5 of 10
factions are EXPECTED to defect on independent 75% rolls). **★ RE-SCOPE the fix in E3:** the
floor-(3) anti-game-over is **no longer** a flat 75% roll — build (a) a **HARD VETO** (in a
solo/CPU-majority game, any `triggersGameEnd`/surrender response is REMOVED from the CPU vote
menu) **OR** (b) a **points-based anti-peace ideology bias** tuned so a CPU plurality cannot
form, **PLUS a NON-PLURALITY-OVERRIDABLE game-ending-peace** — a separate guard on the
CC/Congress override path (`continentalCongress.ts` `voteCC` + the `decider:'cc-president'`/
`congress` resolution) so the Pres's reject can't be beaten by a plurality. **Binds at**
`phaseRunners.ts:2871` (bare today) + `pickAIResponse` (`eraGraph.ts:88-103`, no anti-game-over
term) for the veto/bias and the override path for the plurality guard. **★ It is a SOLO-PLAY
BLOCKER — the "DH-29 of the CPU/war track"** — so it RAISES debt #32's priority and **makes the
#155 RevWar floor #3 LEAKY** (debt #34a): the floor is no longer met by the flat roll alone.
**Build it WITH the #155 war-balance pass (E3) + the #75 CPU event-vote handler (E9), AHEAD of
the rest of the CPU/war track; bears on #114 (solo-app is the target mode).** Size S–M (the
veto/bias is S; the non-overridable-plurality guard adds the override-path work). debt #32
(escalated) + #34a; game-mechanics §13.2 (strengthened) + §21.1 + §25.7.
**★ #170 era-keyed offices/departments → EXTENDS E16 (the boot-seed cabinet-seat refactor),
PARTLY SHIPPED:** the founding-seat half is LIVE (`cabinetSeatsForYear` `types.ts:1196` era-gates
Navy/Postmaster/Interior); add the modern departments to `OfficeType` (`types.ts:1111-1134`, none
today) + a per-office `foundedYear`/`createdByBill`/`supersedes` table + the **DNI⇒CIA-Director
supersession** (Ted-authoritative `trump2024#POST 40-41`) on the planned boot-seed
`GameState.cabinetSeats: SeatSpec[]` refactor (§3 item 2 / E16) — seed only offices whose
founded-year ≤ the board's start year (or that a bill creates), applying supersession at the
creating event. The SAME mutable-cabinet-seat refactor E16 already plans (`cabinetSeatsForYear`
is the wrong long-term model at BOTH ends — §24.6 founding-offices-by-law + §26.5 modern-create-
by-bill); #170 is the era-keyed-EXISTENCE + supersession layer on top. S–M, pairs with the
scenario-boot/era-content work. debt #47; game-mechanics §9.3.1.1.
**★ #171 era-keyed draft-ideology TOGGLE → FOLDS INTO the #4/#108 draft-profile work** (E1
draft profile + E20/E23 realignment levers): an **era-keyed boolean** (`eraDraftIdeologyRestrictions`,
or derived from realignment-completion state) gating the #4 per-(faction,era) profile + the
off-profile 30/50% rolls + adjacency-on-exhaustion — **ON in early/realigning eras, OFF in the
modern present** (Ted-authoritative `trump2024`; bracketed by 1916 ON / 1972 ON / 2024 OFF).
Faction-leader eligibility (#110) still applies regardless. No standalone epic; S. **Open Q:**
the exact ON→OFF boundary (keyed to §28.4/#108 realignment completion). debt #48; game-mechanics
§4.1.w.
**★ DH-68 era-event WWI-end prerequisite → FOLDS INTO the DH-60 era-event-precondition work
(E15 + BUG-1), now MULTI-ERA:** add a WWI-end predicate to the Czechoslovakia/Hungary nodes (and
other post-war beats) + **port the 1772-graph `precondition: Predicate` layer** (`types.ts:1487`,
`evalPredicate` `eraGraph.ts:12`) **into the calendar-only 1856 builder** (`eraEvents1856.ts:4`,
no `precondition` on any row today) **+ a new Progressive builder** (does not exist; 1916 runs on
`modern`/`progressive` tuning, UNBUILT). The SAME selective-precondition ask as DH-60
(`dem1820`/`arkzag`/`smallbugs`), now corroborated from the Progressive band → DH-60 multi-era
confirmed. S, SAME surface as BUG-1 + K3's `territoryOwned`. debt #49; game-mechanics §10.4.8.
**Corroborations (tags, not rows):** **CPU suite #70–#79** → E9 (← `cpufull`, clean 4th-or-5th
founding angle, confidence ↑); **modern band 2021-2025 + start-years** #92/#41/#169/#164 → K3/K4
+ E30/E15 (← `trump2024`/`nixon1972`/`solo1916`, eras now exercised at 1916/1972/2024);
**crisis/war/Watergate** #11/#45/#106 → E14/E3 (← `nixon1972`); **hinge polarity §5 + #108** →
E1/E20 (← `solo1916`); **gov-actions-as-COUNTS** → #20, **no-candidate-withdraw** → #110.
**`nixon1972` is ANOTHER GM-burnout stall** — the upkeep-automation argument behind E9/#55/#115
keeps growing (cite, NOT a row). **Decision-gated RECOUNT: 0** (the #158 which-way, #170 real-DNI
seat, #171 ON→OFF boundary are designer-gated TUNING within their epics). **No re-sequence;
top-of-queue UNCHANGED — but #158's escalation elevates the CPU anti-game-over fix WITHIN the
CPU/war track (a solo-play blocker, built AHEAD of the rest of it).**
**★★ Batch-22 fold-ins (`modernday` — the ONLY modern thread crossing an era boundary; TWO
concrete modern build items that sit in EXISTING epics, a current-rules spec-anchor, two small
bugs — NO new rows, NO re-order, NO new keystone, NO keystone moves):** **★ #172 era-keyed
confirmation thresholds + Nuclear-Option → FOLDS INTO E16 (cabinet/confirmation) + E14c
(cloture), S–M.** Verified UNBUILT (zero `cloture|filibuster|nuclearOption|confirmationThreshold`
in `src/`; `runPhase_2_3_1_Cabinet` `phaseRunners.ts:2158-2223` is a flat scored pick with NO
Senate vote/threshold/gate). Concrete build: a `GameState.nuclearOption:{cabinet,scotus}`
**per-start-year boot flag** (Cabinet 50%+1 / SCOTUS 60% for 2016, Ted-authoritative
`modernday#POST 422-423`) seeded by `scenarioBoot` (same `BootSheet` surface as #170's office
seed, §3 item 2 / E16), read by a **per-track confirmation-threshold** check in the cabinet
runner (`phaseRunners.ts:2158`) + the SCOTUS-nom path (`:3648-3671`) + the **SML enact/repeal
action** (one ActionRegistry row toggling the flag) + the **60→fail→10-vote-conversion→auto-
confirm-a-Mod fallback** (`modernday#POST 602-603`). **★ It COMPOSES with already-scoped pieces
— do NOT re-build them:** #124's auto-pass GATE (whether a vote HAPPENS) fronts the threshold;
#52/E9-9d (WHO votes aye) resolves the contested vote; #171 is orthogonal (draft); the **batch-9
USER cloture decision** (60%-then-majority vs simple-majority, resolved-in-code simple) is the
SAME cloture surface E14c owns — **do NOT re-litigate; the Nuclear-Option flag is the era-keyed
DEFAULT on TOP of it.** **Open Q (designer-gated TUNING):** boot-flag-vs-derived-from-cloture-
bills. debt #50; game-mechanics §9.3.10. **★ #173 era-boundary-aligned starts → New-Game
start-year PRESETS = the 14-band openings; couples scenario-boot (#115), S.** Verified UNBUILT
(`NewGameScreen.tsx` hard-codes `type ScenarioId='1772'|'1856'`; `startNewGame`
`GameContext.tsx:264` admits exactly those two — NO era→start-year axis). The GM's closing
verdict (`modernday#POST 2964`): *"any new test start date must be the date a new era begins"* →
expose a **PRESETS table on the K4 `BootSheet`/`scenarioBoot` picker** keyed to the 14-band
era→start-year→first-president map (Independence 1774 / Federalism 1788 / Republicanism 1800 /
Democracy 1820 / Manifest Destiny 1840 / Nationalism 1856 / Gilded 1868 / Progressivism 1892 /
Normalcy 1916 / Ideologies 1928 / Nuclear Age 1948 / Neocons 1972 / Terror 2000 / Populism
2012); each preset = a scenario-as-data-row (`scenario1868`/`scenario1788` pattern), GATED on
`scenarioBoot` existing. The UI delta is small; the weight is the boot sheets each preset points
at (already-scoped scenario/era-content work). debt #51; game-mechanics §27.9. **★ #68/#2
point-banking pipeline → SPEC-ANCHOR CONFIRMED (current-rules live instance, K3/K4); UNBUILT; NO
priority change.** `modernday` is the **first KB instance of the 6-clause banking ritual firing
at a REAL boundary under CURRENT rules** (the 2024 transition, `#POST 1871` — most-points +5 /
other-party-most +3 / 2nd-most-same-party +3 / all-factions-in-top-party +3 each / two −1
allied-last guards) + the **non-banked score reset** + the **faction-trade window** (`#POST
1874`) + the **procedural-content swap** (historical→generated rookies, `#POST 1902/1909`); it
**matches `rep1800` almost exactly** → #68/#2 confirmed deterministic from BOTH a 1800 and a
current-rules angle. Stays folded into K3/K4 (§9.1.5); the **spec is now SOLID** for when the
era-model epic builds it. game-mechanics §27.2.1 (no new debt row — strengthens K3/K4, debt #5).
**★ #171 era-keyed draft-ideology TOGGLE → PROVEN flipping ON (2016-2024)→OFF (at 2024) in ONE
save** (`#POST 558/1902`) — sharpens debt #48, NO scope change (still an era-keyed boolean on
the #4/#108 profile system). game-mechanics §4.1.w + §27.9. **★ DH-70 `Lackey` PV over-weight →
a `pv.ts` NOTE (XS):** shipped `pv.ts:77` already flat-`−5`'s EVERY negative trait
(`else if (NEGATIVE.includes(t)) total -= 5;`); `Lackey` appears NOWHERE in `src/` (not yet a
shipped trait) → **when `Lackey` is ported, add it to `NEGATIVE_TRAITS` so it takes the SAME
flat `−5`, NO special-case** (the over-weight was a spreadsheet artifact). Pairs with #120
dataset-balance + DH-51. debt #52. **★ DH-69 NO in-app rules / legal-move surface
(UX/onboarding):** grep `rulebook|legalMove|availableActions|helpPage|tutorial|onboard` in
`src/` = ZERO hits; players "winging it" (`#POST 342-356`) → an **in-app rules / legal-move
surface** sharpens #115's boot-procedure gap, **serves the CPU cluster** (a legal-move
enumerator is the primitive a CPU action-picker needs), and the GM-burnout theme (DH-36 family).
**UX/onboarding item, no engine size of its own; cite under #115/CPU-AI.** **Corroborations
(tags, not rows):** **#43 procedural generator owns the modern→future band** (dataset exhausts
at the future boundary, `#POST 1902/1909`) → **E8** (debt #19, scaling-wall (a)); **#92/#41** →
K3/K4 (2016 + the 2024 crossing); **#13/#47/#15/#16/#18/#51/#111** → E14/E20b/E23 (full
legislative chain + the 2-layer scorer published verbatim, `#POST 2380`/`521-569`, MATCHES the
FROZEN SPEC); **#124/#25/#170** → E16 (28-seat cabinet + CIA-Director-as-intel re-confirms #170's
DNI⇒CIA-Director supersession); **#70–#79/#1/#114** → E9 (CPU suite + 8-human MP handovers — solo
adaptation); **#110** → E24/E20; **#108** → E20/E23; **DH-54/DH-66** → E10b (impeachment ran to
completion, GM short-cut the special-committee step); **#171** (above). **Decision-gated RECOUNT:
0** (the #172 boot-flag-vs-derived question is designer-gated TUNING within E16/E14c, not a new
bucket entry). **No re-sequence; top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot →
E1).**
**★★ Batch-24 fold-ins (TWO founding-era playtests — `grass1772` + `rookie1772`, the 5th + 6th
captured 1772 sources; ONE net-new founding gap [#176], a META-PRIORITIZATION justification raise,
two minor war constraints, corroboration — NO new rows, NO re-order, NO new keystone, NO keystone
moves):** **★ #176 FOUNDING MilPrep PREREQUISITE-ORDERING FIX → FOLDS INTO E1 (founding/RevWar) +
E6 (#67 meter caps), S; an AUTHORING CONSTRAINT, designer-gated open Q.** Both 1772 runs hit it
INDEPENDENTLY: founding MilPrep is hard-capped at ~2 for the whole Era of Independence because the
meter tiers are mis-ordered (**MilPrep 3-4 require the federalism-era Militia Act ~1792** while the
**auto-forced 1774 Continental Army/Navy** bills are wired to higher tiers), so every forced-war
MilPrep roll is wasted + a permanent founding military crisis (`grass1772#POST 86-90, 121`;
`rookie1772#POST 26, 32-33`). Shipped-state nuance: there is **NO tier-prerequisite system at all**
(`scenario1772.ts:9-17` boots `military:-2` as a raw `[-5,5]` scalar; grep `meterPrereq|meterTier|
MilitiaAct|StandingArmy` in `src/` = ZERO; `revolutionaryWar.ts` no tiers) — so honor it WHEN
founding war-content + a meter-prereq ladder are built (Cal's reverse-the-prereqs: Army → MilPrep 3,
+Navy → MilPrep 4, cap ~4-5 pre-federalism), NOT a regression. **Open Q (designer): adopt the fix
or keep the crisis.** Surface meter prereqs/caps in-UI (DH-69 UX). debt #56; game-mechanics §17.4.
**★★ THE ONBOARDING / SOLO-APP / CPU-AI CLUSTER = the META-PRIORITIZATION signal (NO new scope;
RAISES the justification of already-scoped E9/K5 + DH-69 + the DH-36 note).** Both runs DIED to the
manual CPU-faction sim + opaque rules: `grass1772` because 2 humans couldn't hand-run 8 CPU factions
(`#POST 328` → fixed by ADDING humans, `#POST 348` — the cleanest proof the manual CPU sim is the
load-bearing cost #114/E9 must own); `rookie1772` is the strongest onboarding signal in the KB
(walls on phase-processing / meter-prereqs / phase-order / era-transition / Lingering "never run
before… more complicated than expected," `#POST 1370`). With `modernday`+`pop2012b` this is the
**4th GM-burnout death** (DH-36 cluster). CONFIRMED unbuilt (grep `cpuHandler|handlerSuite|
runCpuFaction` = ZERO; grep `rulebook|legalMove|availableActions|onboard` = ZERO). **★ Raise the
priority/confidence on E9 (CPU handler suite) + K5 + the DH-69 onboarding/legal-move surface +
the DH-36 automation argument — do NOT re-sequence, do NOT add scope.** **★ MINOR WAR-ENGINE
CONSTRAINTS → FOLD INTO #155/#56 / E3 (no new epic):** (i) clamp the doubled-officer Planning term
to 0-5 (`revolutionaryWar.ts:212` `*2` can hit 6+; `rookie1772#POST 35`; **XS**); (ii) add a
**scripted-event WIN PATH** to the generic `War` model (`grass1772`'s "King George grants autonomy"
event win = a 3rd RevWar win-path alongside French-alliance + battle-score); (iii) surface meter
prereqs in-UI (UX, with DH-69). debt #16, #56. **★ #153 command-bootstrap = NOW 4-SOURCE
(corroboration only; Bartram):** `grass1772`'s 90-yr-old CPU botanist John Bartram elected 1st
President from a near-0-Command boot (`#POST 202-205`) + "almost no one starts with command" master
polSet (`#POST 538-540`) — high confidence; the build already zeroes rookie Command + PV drives
elections. **Corroborations (tags, not rows):** the founding cluster #86/#133/#67-#134/#100/#101/#92
(era-as-content-band: Lingering/retirements/SCOTUS OFF in Independence, ON at 1788) re-confirmed from
a 5th+6th 1772 angle; **#159** ahistorical-Convention from 2 more founding traces (grass: 2-human-
collusion → unicameral "Super House"; rookie: Senate-appointed-by-Governors + President-for-life).
**Decision-gated RECOUNT: 0** (#176 is buildable in E1/E6; its reverse-prereq question is designer-
gated WITHIN that work; the rest is corroboration/justification). **No re-sequence; top-of-queue
UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the onboarding/solo-app/CPU-AI cluster
(E9/K5 + DH-69) now carries the strongest justification in the corpus.**
**★★ Batch-29 fold-ins (TWO timeline-edge playtests — `wilsons1916` [first multiplayer 1916, a START-
AT-ERA-OPENING experiment] + `welcome2future` [hands-off all-CPU 2022→Future, the downstream-most
ingest; 8-of-10 factions on CPU rules]; 8 NEW gap rows #206–#213 + 3 NEW design-hole bugs DH-74–DH-76;
NO gap closed, NO new keystone, NO re-sequence, top-of-queue UNCHANGED. Items below are dependency-
ordered per the tech-lead's binding §9 batch-29 lead + §8 debt #78-#84):**
**★★★ THE HEADLINE → #206 the `Era` enum is DOUBLY too coarse, confirmed from BOTH timeline edges
(debt #78; ties debt #5 + #92/§9.1.5) — and it RESOLVES the long-open "grow the enum vs. adopt the #92
data-model" question IN FAVOR of the DATA-MODEL → a K3/K4/#92 ANNOTATION (NO new keystone, NO re-
sequence; see the annotated keystone-overview + K3/K4 rows above).** Re-verified at code level: `Era =
independence|federalism|nationalism|modern` (`types.ts:1337`) — NO `future`/`populism`/`progressive`/
`gilded`; `currentEra` is boot-set + advanced at a SINGLE runtime site (`constitutionalConvention.ts:198`
→ `'federalism'`); the era graph is hard-scoped to one era (`ERA_GRAPH_1772` + the `chartIndex >= 49`
THROW at `eraGraph.ts:153-155`); the only year→era map is a UI-only `eraForYear`
(`AnytimeEventsPage.tsx:20-25`). The forum's "Era of the Future" / "Era of Populism" / "Era of
Hollywood" are content-band LABELS over this coarse enum (#92, now confirmed at the OPENING hinge [1916
"Golden Era of Hollywood" event `wilsons1916#P191`] AND the TERMINAL edge [Future `welcome2future#post
6`]). The Future band is **doubly unbuilt** (absent from the enum AND under-content'd — events done,
legislation a stub). With Future/Populism/Hollywood/Gilded/Progressive labels ALL needed, a flat enum
would balloon → **adopt the #92 two-level content-band model in K4's era-content registry; band labels
become era-content DATA, not enum values; the `Era` enum (if kept at all) stays a COARSE rules-tuning
key.** This was already K3/K4's specced direction (early-republic sub-bands were already content-band
markers) — batch-29 makes it the BINDING resolution and extends it to the terminal edge. **PLUS a
separate Era-of-the-Future PROPOSAL-LIBRARY authoring epic** (events reportedly done — the missing piece
is legislation, the same "events-before-legislation" shape as the Federalism gap; folds into the era-
content authoring at E31 / Author-before-build, pairs K4). **M for the enum/registry refactor (folds
into K4); separate content epic for Future proposals.** `GM⇒App`. debt #78; game-mechanics §22.11.
**★ #207 NO terminal game-over / completion state → a COMPLETION-vs-LOSS DECISION (debt #79; pairs debt
#70; folds into E6 alongside #88/#188 but is a DISTINCT end-state).** The ONLY terminal state is
`game.gameEnded` (`types.ts:1635`), set at ONE event-driven site (`phaseRunners.ts:2871-2872`, an era
event's `triggersGameEnd`); `phases.ts` predicates are pure `year % N` (`:49-58`) with NO
`endYear`/`maxYear` — so the build has **no year-cap, no completion, no victory, no sandbox terminus**,
distinct from the meter/scripted LOSS catalog (#88/#188). `welcome2future`'s 2072 was an arbitrary
author cutoff (`post 20`) never reached; across the WHOLE corpus the Future band is defined-but-never-
played-through and NO thread ever hits an end-of-timeline terminus. **A timeline-completion DECISION is
owed (year-cap / open sandbox / score-out), modeled as a DISTINCT end-state from LOSS** (one end-state
branch + a win/score screen). Small but architecturally load-bearing — it defines what "done" means for
the whole campaign. **S-M; decision-gated on which completion model** (recorded under Decision-gated).
debt #79; game-mechanics §26.4.
**★ #208 + DH-76 the CPU LEGISLATIVE/CONFIRMATION engine + cloture → FOLDS INTO E9 handlers 9b
(legislation) + 9d (cabinet), K5-DEPENDENT; the LEGISLATIVE HALF of the GM referee job, `GM⇒App`.** **★
Shipped-state CONFIRMED unbuilt:** `grep filibuster|cloture|nuclear.?option|confirmThreshold src/` =
ZERO; the legislative loop is committee (`phaseRunners.ts:3463`) → floor (`:3498`) with NO filibuster
step between, and the CPU faction loop is absent (debt-adjacent K5). `welcome2future`'s hands-off 2022
turn (the most complete modern CPU-turn spec in the corpus) ran but forced the GM to INVENT: (a) a CPU
maj-leader filibuster-override rule; (b) how maj/min leaders themselves vote (own-party + within-2-
ideology-clicks, iron-fist within-1); (c) cross-party cabinet caps (≤1 in top-4, ≤3 total, ≤1 ideology
step, integrity gate). **DH-76** adds the cloture gap from `wilsons1916#P349` (filibuster = automatic
full-term delay, no cloture path). Build = the **Filibuster action (forum #10) + an era-keyed Cloture
counter tied to the Nuclear-Option state + CPU override + maj/min-leader vote rule + cabinet caps, all
deterministic (NOT a roll)**. M; folds into E9 9b + 9d once K5 lands. **Binds at** the legislative loop
(`phaseRunners.ts:3463-3498`) + the cabinet handler. debt #80; game-mechanics §28.10.
**★ DH-74 validate the bill-proposal list BEFORE the vote → a `billProposable` predicate that SHARES the
territory/era content-filter with #206/#92 + DH-60 (debt #81; the Progressive face of DH-60 for
LEGISLATION, `GM⇒App`).** **★ Shipped-state CONFIRMED:** `runPhase_2_6_1_Proposals`
(`phaseRunners.ts:3431`) picks via `pick(BILL_TEMPLATES)` (`:3444`); `BILL_TEMPLATES` (`:3420`) carry NO
precondition fields, so the engine OWNS the state (territories, ratified amendments, `snap.game.wars`,
`currentEra`) but never filters proposals → `wilsons1916` proposed/committee-passed/packaged/House-voted
bills then found them INVALID mid-second-vote (Hawaii already legis-active; Teller Amendment blocks Cuba;
war "not recent" blocks pensions, `P303`), forcing a phase-2.6 HALT + restart + 3 replaced bills
(`P311-313`). Build = a **`billProposable(snap, tpl)` predicate + a filter at `:3444`** (territory owned
/ not already legis-active / amendment not ratified-or-blocking / era prereq / recent-war predicate) so
only LEGAL proposals surface. **★ Build the predicate library ONCE, use it for events AND bills** (it is
the same content-filter as #206/#92 + DH-60). S-M; pairs DH-60 + debt #5/#78. debt #81; game-mechanics
§12.1.1.
**★ #209 boot-time retro-generation of prior-cohort career-track bench → FOLDS INTO the existing
`scenarioBoot`/`BootSheet` pipeline (K4, §9.1.9; debt #83, `GM⇒App`).** **★ Shipped-state CONFIRMED:** no
`BootSheet`/`scenarioBoot` abstraction exists (`grep` = ZERO); the only generator is the FORWARD draft-
rookie fallback (`phaseRunners.ts:177-209`) building a current-year cohort via raw `Math.random`
(`:188-198`, debt #2). So a non-1772 boot has no synthetic bench → `welcome2future` Alabama had no
eligible Republican for an open seat (CPU couldn't field a candidate, `post 137,144,148`); `wilsons1916`
hand-generated "Joe Simpson (auto-generated)" (`P453`). Build = a **boot-time retro-gen pass synthesizing
SUB-FLOOR career-track cohorts stat-dated to the prior ~5 cycles (`post 364-369`)**, filling
Ambassadors/Admirals/lower-Justices/bench-Reps — routed through `rng.ts`, NOT the `:188` raw
`Math.random`. M; hooks the same `scenarioBoot` pipeline as #186's mid-cycle boot (debt #68). **The boot
prerequisite for ANY deep-modern / mid-timeline start (the Future band can't be played without it once
the real dataset thins).** debt #83; game-mechanics §9.2.1.
**★ DH-75 military-appointment eligibility: citizenship + exp-type→branch → XS-S, standalone (debt #82,
`GM⇒App`).** **★ Shipped-state CONFIRMED:** the GeneralInChief appointment filters ONLY on
`!p.currentOffice && p.skills.military >= 3` (`phaseRunners.ts:2256-2261`) — no citizenship gate, no
Army↔Navy matching → `wilsons1916#P162-169` made Pancho Villa + Aguinaldo appointable as US Army
generals and auto-slotted Nimitz a General despite naval exp. Build = add both checks to the officer-
appointment filter. Pairs #25/#31 + the 1916-bare-boot officer corps (#209, debt #68). **Binds at**
`phaseRunners.ts:2256-2261`. debt #82; game-mechanics §8.5.4.
**★ SMALLER MECHANIC ASKS (debt #84) — ride existing epics, LOWER priority.** **#210** Ex-President/Ex-
Nominee super-Kingmaker career state (office-ineligible, proteges from ANY state; S; folds into the
Kingmaker subsystem `phaseRunners.ts:1244-1465`, pairs #30) + **#211** cross-party PV-ordered snake-draft
MODE vs the within-party `runPhase_2_1_1_Draft` (`phaseRunners.ts:107`; S, LOW priority — MP setup
flavor, folds into the draft work #4/#108) + **#212** the unbuilt 2.1.5 ideology-shift pass (`GM⇒App` —
40-60+ shifts/faction/term by hand; implement the deterministic per-pol shift roll + flip-flopper AND
DECIDE whether the #110 per-faction shift budget [max ~9] is enforced era-wide or shifts stay uncapped;
S-M, the era's biggest by-hand load; folds into the 2.1.x pass cluster) + **#213** make the assigned-
faction-ideology draft restriction an era-keyed toggle fully DISABLE-able at a boundary (2026),
**CONSOLIDATING with #171** (the batch-21 era-keyed draft-ideology toggle; XS-S). debt #84; game-mechanics
§4.4, §30.19.
**★ REFRAMES (annotate in place, no new scope, no re-sequence):** **★ DH-14 is a CPU-AI ARTIFACT, NOT a
hard block** — the 19th Amendment ("Equal Voting Rights for Women") PASSES in the 10-human 1916 game
(House 374-61, Senate 79-17, ratified), so the `drums` all-CPU "this amendment will never pass with CPUs"
is a **CPU-AI / era-ideology-weighting artifact** → folds into the era-keyed bill-ideology table (debt
#5-adjacent — move Mods off suffrage's negative side in 1916) AND a CPU vote model (#208 / E9 9b) that
can reach 2/3 like a human field; NO standalone work (logged as a ② opponent-half artifact in the GM-
replacement lens). **#106/WWI optionality** corroborated (the US never entered WWI in `wilsons1916`; the
war engine is dormant unless the war-entry event fires). **#114/#110** corroborated as the load-bearing
CPU-AI requirement (`welcome2future` = the most complete modern CPU-turn sample — direct charter evidence
that hands-off modern resolution WORKS). **#115/#186** boot cluster — both threads converge on the boot
lesson (even a clean OPENING start needs a fully-populated per-year BootSheet: the 1916 BootSheet is
"bare" — NO starting generals/admirals, "filler" credit/debt, `wilsons1916#P149-157,340-345` → DH-75 +
#209). **★ #173/#186 METHODOLOGY CONVERGENCE — era-band OPENINGS, not mid/tail:** both threads
independently re-affirm starting at an era's OPENING (`wilsons1916` opened with *"starting at the
beginning of an era, rather than the middle, was better"* and booted cleanly; `welcome2future` confirms
the INVERSE — a 2022 TAIL-of-band start has thin scripted-event density, *"only one scripted event
capable of occurring right now"*, `post 378`), so BOTH era edges are thin-content friction zones → the
#173 14-band era-start presets (debt #51) should snap New-Game starts to band OPENINGS. **Engineering
principle for any future scenario boot: author/test at era-band openings; treat mid/tail starts as a
separate, higher-risk class.**
**Decision-gated RECOUNT: +1 (#207's completion-model pick — year-cap vs sandbox vs score-out — is a
genuine planner/designer decision, recorded under Decision-gated below).** **NO gap closed; NO new
keystone, NO re-sequence; top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but #206 is
the strongest single argument yet that the K3/K4 era keystone must adopt the #92 two-level content-band
model (not a growing enum), and #208/DH-76/DH-74 sharpen the legislative half of the GM referee into
concrete, K5-dependent engine work.** debt #78-#84; technical-guide §9 batch-29 lead + §9.6 + §8 #78-#84;
game-mechanics §22.11, §26.4, §28.10, §12.1.1, §9.2.1, §8.5.4, §4.4, §30.19.
**★★ Batch-28 fold-ins (FOUR designer META-DOCS — `to-do` / `fixes` / `completions` / `vic3`; a
DISCUSSION/CATALOG + RECONCILE batch, no era playtest; the pivotal RECONCILIATION batch — the
`completions` "done-half-of-the-2022-backlog" list converted into VERIFIED truth about our `src/`. 17
NEW gap rows #189–#205; NO gap closed; NO new keystone, NO re-sequence, top-of-queue UNCHANGED. Items
below are dependency-ordered per the tech-lead's binding §9 batch-28 lead + §8 debt #71-#77):**
**★★★ THE HEADLINE → debt #71 = the ELECTION-SCORER DETERMINISM+TUNING QUICK-WIN; FORMALIZES QW19–QW21;
the single highest-leverage build move in the batch.** The `completions` list flagged two claims
"CONFIRMED-SHIPPED"; reconciled at `file:line`, exactly ONE holds. **① Election-die-D6 → REFUTED.** The
cited `phaseRunners.ts:727` is `factionExpertiseBias`'s `clamp(Math.round(biasedMean),0,6)` (a faction-
lean clamp, NOT in `calcStateVote`, NOT a die); the REAL election randomizer is **`(Math.random()-0.5)*8`
at `phaseRunners.ts:3711`** — a continuous **±4 band of raw `Math.random`, NEITHER d6 nor d3, NOT
seeded**. Our build ships **NO election die at all**; the batch-27 #184/DH-72 finding STANDS. **② Trait-
conflict-d6 → CONFIRMED-BUILT, and via the RNG seam.** `tryGrantTrait` (`traits.ts:41-59`) resolves a
held-conflict on `d(6) >= TRAIT_LIFECYCLE_RULES.conflictD6Threshold` (`:53`; `d` from `rng.ts`, imported
`:3`); the threshold is **`4`** (`types.ts:638` → 1-3 cancel / 4-6 keep, a tuning delta vs the sheet's
1-2/3-6, not structural) — **MARK trait-conflict-d6 BUILT.** **★ The D6-vs-D3 election-die FORK is TIED
OFF (the roadmap is no longer ambiguous):** because the build ships NEITHER die, the fork is NOT a
die-swap — it is the SAME tuning+seeding QW the batch-27 #184/DH-72 finding already framed: **narrow the
`:3711` jitter to the d3-equivalent compressed band AND route it through `rng.ts` as ONE quick-win, then
re-check the per-state bias term `baseLean*5` (`:3697`) against the chosen band.** This **fuses the
flagship `Math.random` determinism leak (debt #1/#3) + the #184/DH-72 sub-fix + the fork in ONE patch.**
**QW19–QW21 (above) are the roadmap's NAME for this; debt #71 is its TECHNICAL DEFINITION — REINFORCE the
existing trio, do NOT add a 4th row.** debt #71; game-mechanics §15.5(a).
**★ #179 CABINET-METER ENGINE NOW HAS NUMBERS → debt #72; S-M, standalone, READY; folds into E6
(lingering) + E16 (cabinet) where it already lives; a flagship `GM⇒App` item.** The batch-26 redesign of
the deterministic drift now carries the spec the 2022 to-do demanded ("write up how each meter works +
when to apply its effects" — the most-repeated unfinished ask in the thread): an `Admin→{upOdds,downOdds}`
table (Admin5 75%/0% … Admin0 0%/100%) rolled per portfolio-officer + **Efficient ±2** + a **25% lobby-
dissat hook** + a **hard JCoS/Senior-General/Admiral exclusion (the #49 fix)** → replaces the placeholder
`drift()` in `runPhase_2_5_1_Lingering`. **★ Shipped-state CONFIRMED DESIGNED-not-built:** the shipped
`drift()` table (`phaseRunners.ts:3266-3273`) is a flat deterministic skill-keyed delta with NO roll/
backfire/odds. **Binds at** `runPhase_2_5_1_Lingering` (`:3260`). debt #72; game-mechanics §20.10(g)-(j).
**★ DOWN-BALLOT MODEL #189–#192 → debt #73; M; builds ON the existing down-ballot routing (PARTLY-BUILT);
folds into E20b/`calcStateVote`; pairs with #103 (presidential stack); a `GM⇒App` referee item.** **★
Shipped-state CONFIRMED partly-built:** `calcStateVote`+`applyTraitElectionBonus` ALREADY route gov/sen/
house and apply *some* traits/meters (`phaseRunners.ts:3685,3707-3708`) — but only the ~5 presidential
traits; the full down-ballot table + the expertise/lobby↔industry link are absent. The model = a
**separate-from-presidential down-ballot trait table (#189)** (Likeable/Charismatic ±1, Leadership +1,
Orator/Debater 50%+1, Propagandist ±1, FL+1/PL+3 in primaries…) + the **expertise/lobby↔leading-industry
"Manchin" +2/+1 (#190)** (expertise matches the state's #1 industry → +2, matching lobby → +1; +
crisis-expertise +1) + a **static per-seat `deviantPartyBias` (#191)** that overrides ONLY the party
component of state bias (SET-BY the #20 gerrymander action below) + a **per-state per-era max-margin →
popular-vote-% derivation + PV caps (#192)** (the design intent behind the §29 landslide misfire — a
presentation/realism layer DISTINCT from the swing-die). **Binds at** `calcStateVote` (`:3685-3711`).
debt #73; game-mechanics §15.4.
**★ NINE NOT-IN-OUR-BUILD SUBSYSTEMS — ALL re-confirmed ABSENT (`grep src/` = ZERO each), now spec'd from
the 2022 docs → roadmap-ready, ALL `GM⇒App`; LOWER priority than the above.** Each binds where its gap
row notes; each retires GM hand-adjudication. **debt #74:** **US-Rep Voting-Power #34/#62** (`votingPower`
= ZERO, not a `Politician` field; S) · **player Generate-a-candidate 3.0.25** (= ZERO; only filler
seeding; S) · **gerrymander gov-action #20** (= ZERO; S — this is the SETTER for #191's `deviantPartyBias`,
+ the B2/B3 Vic3 gov-actions fold in here, see parking lot). **debt #75:** **Acting-Presidency 3.0.33**
(`actingPresident|isActing` = ZERO; S) · **Do-Not-Enforce Pres-Actions #23** (= ZERO; S) · **Master-
Kingmaker promotion #128** (the kingmaker subsystem EXISTS `phaseRunners.ts:1244-1465` but NOT this
promotion trigger; XS-S). **debt #76:** **Secessionist/pardons 3.0.35 #121/#122** (a `secession-winter`
EVENT exists `phaseRunners.ts:2834-3018` but the 3.0.35 per-pol ruleset is event-only NOT a general gate,
and pardons = ZERO; M) · **rising-sea-level EV #41** (`seaLevel|coastal` = ZERO; S) · **trait-renames
#168** (string pass not applied; XS). debt #74-#76; game-mechanics §14.1.2, §24.1, §23.1, §30.18.
**★ NEAR-TERM `GM⇒App` CLUSTER → debt #77; ride existing epics.** **#199 confirmation-rejection trait
cascade** (a rejected nominee auto-gains Controversial→Incompetent + is blocked from re-nomination, with
a Bookkeeper carve-out; designer-ACCEPTED `fixes §D POST 434-436`; S; folds into E16/E9-handler-9d;
**CONFIRMED NOT-built** — confirmation flows return REJECTED but no cascade) + **#200 personnel-effect
bills** (a `bill.personnelEffect` capability that EJECTS/disqualifies sitting officeholders matching a
predicate, optionally routed through SCOTUS, with a sunset — the polygamist-ban-removes-Mormon-officers
case; S-M; folds into E2 bill-typing + E25 SCOTUS) + **#193 interest-acquisition** (interests are born-
only today, `types.ts:1282`, seeded `[]`; +1 ideology-appropriate interest at the 20-yr career-track mark
+ event grants — RESOLVED design; S; folds into E13/#163 career-track payouts). debt #77; game-mechanics
§14.1.2.
**★ ESCALATED / ANNOTATED IN PLACE (no new scope, no re-sequence):** **debt #1** (the flagship raw-
`Math.random` election leak) is now RE-CONFIRMED as the `:3711` jitter AND fused into the debt #71 headline
QW; **#103** (presidential modifier stack) gains its down-ballot companion (#189-#192 extend it to Gov/
Sen/Rep); **#49** (top-military ≥1-Admin) is now the JCoS-exclusion clause of #179; **#185/#66/#67** carry
the OPEN #183 endorsement-momentum CONFLICT (2022 sheet's 25%/10% momentum, `completions#POST 46`, vs
`redbutton`'s NONE — a frozen-spec reconciliation, NOT closed here). **★ PARKING-LOT / DECISION-RECORDS:**
**#205** Vic3 borrows (B1 dynamic IG→party realignment / B4 per-state meters / B5 per-lobby era agendas) =
designer-tagged "AMPU 2" → parked, NO near-term row; **B2/B3** Vic3 gov-actions (meter-boosting +
migration/immigration) = Ted-endorsed for v1 → **FOLDED INTO #20** (the gerrymander/gov-action umbrella,
debt #74), NOT a new row; **#204** (skills stay 0-5; 0-10 → "AMPU 2") = a DECISION RECORD pinning
CLAUDE.md's 0-5 as deliberate (no code change, guards against a future "just widen the scale"); **#203**
(wealth) DEFERRED ("post-Early-Release"); **#194/#196/#197/#198/#201** ride their existing epics (mostly
Tier-4 OPEN); **#195 records-archive + #202 Campaign-Advisor** = `GM⇒App` onboarding, pair DH-69 + #114.
**Decision-gated RECOUNT: 0** (all OPEN items are designer/content-gated WITHIN their epics). **NO gap
closed; NO new keystone, NO re-sequence; top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot →
E1) — but the election-scorer determinism+tuning QW (debt #71, fusing #64/DH-72 + debt #1) is reinforced
as the cheapest high-leverage win, and the down-ballot model (#189-#192) + #179 meter engine are now
numeric, standalone-buildable specs.** debt #71-#77; technical-guide §9 batch-28 lead + §9.6 + §8 #71-#77;
game-mechanics §15.4, §15.5, §20.10(g)-(j), §14.1.2, §24.1, §23.1, §30.18.
**★★ Batch-27 fold-ins (`redbutton` — THE CORPUS'S FIRST Cold-War / Civil-Rights source + the FIRST
MODERN-ERA scenario boot stress-tested AT SCALE [a ~10-human MP run started MID-CYCLE in the 1960
Elections Phase, ran 1960→1962-64, then paused and never resumed solo]; ONE designer-confirmed election
NERF [#184] + its driving BUG [DH-72] + FOUR designed-not-built modern gaps [#185/#183/#186/#187] + ONE
premise-only loss [#188→#88]; NO new keystone, NO re-order, NO keystone moves — but the DH-72 sub-fixes
JOIN the quick-win bucket [QW19-QW21 above] + the modern primary→convention cluster is now the KB's
richest forward-played election spec):**
**★ DH-72 / #184 PLATFORM-OVERPOWER — SPLIT into a SHIPPABLE QUICK-WIN + a BUILD-INTO CONSTRAINT.** The
hand-driven 1960 run produced a **Bricker (R) 492-40 landslide over JFK** off a `+1`-rule read as `+3`
board-wide (DH-72) ON TOP of a bogus `+3` platform bonus; recompute → 284-251 → ~281-129 near-tie
(`redbutton#POST 532, 587, 603-607`). Both designers played + agreed *"platform is way too powerful"*
(`#POST 538-540`). **★ Shipped-state CONFIRMED:** `calcStateVote` (`phaseRunners.ts:3709-3711`) is the
single election scorer = `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias +
traitBonus + (Math.random()-0.5)*8` — **NO ±3 cap, NO per-state ideology gate, RAW `Math.random` (a
continuous ±4 jitter, NOT a die), and NO "+1 most-enthusiastic-base" term in code at all** (the +1 is
GM-hand-applied). **(A) DH-72 = THREE TUNING SUB-FIXES, INDEPENDENTLY SHIPPABLE TODAY = the highest-
leverage work in the batch → QW19/QW20/QW21 in the quick-win bucket above:** (a) narrow + SEED the
jitter (d6→d3 intent via `src/rng.ts`, ALSO closing a determinism leak vs the rng rule + debt #1/#3),
(b) re-weight `baseLean*5` into the +3/+5 historical-bias band behind a `game.biasMode?` toggle, (c)
HIDE the raw formulas in the UI (anti-collusion — show only which ideologies like a position +
polls/maps). They pair with the queued **QW3 ±3 cap (debt #1) + the #18 2-layer scorer** — the cheapest
high-value election work in the corpus. **Binds at** `phaseRunners.ts:3697/3709-3711` + a `game.biasMode?`
toggle + a UI hide-the-math surface. debt #64 (DH-72). **(B) #184 = the +2/+1/−1 PLATFORM meter-cap is
NOT a quick-win** — it clamps a term that DOESN'T EXIST yet (`grep platform|plank in src/engine` = ZERO;
the platform engine [5 planks × per-card faction scoring × 4-step comparison] is the SAME unbuilt object
as #181, `summer2021`). So the cap is a **BUILD-INTO CONSTRAINT on the convention/platform epic (Phase-1
#10 / #181)**: build the platform scorer with the +2/+1/−1 cap + hide-the-math from day one; never ship
the uncapped forum scorer. **Binds at** the (unbuilt) #181 convention/platform object. debt #65;
game-mechanics §15.3.5, §28.6.
**★ #185 MODERN PRIMARY→BROKERED-CONVENTION MACHINE → FOLDS INTO Phase-1 #10 convention machinery
(#19/#20/#13/#47/#111); L; the single biggest election subsystem.** The fullest convention CAPTURE in
the KB: 12 primary states (rest = convention delegates), primaries-in-GROUPS (debate ±1 carry, Orator
+2/group), the **5-tier Cat-1–5 delegate-weight HOST-RIGGING lever** (a random gov per party assigns
each state 1×–4×/bias-conditional EV; a player gerrymandered GOP weights to bury MacArthur — Ted holds
rigging is INTENDED), kingmakers-affect-conventions-not-primaries (+1), 67%-first-ballot (mutable),
**two-leaders force a KINGMAKER-WEIGHTED rule-change vote** (→50%+1/WTA/proportional), **least-delegates-
first interballot order**, the **100%-delegate rule + WALKOUT** (persisted into 1964), the **KINGMAKER-
WEIGHTED VP VOTE** (PL+nominee each name one; presidential Promise overrides; no shared home state;
tie→PL picks lowest faction). **★ Shipped-state CONFIRMED unbuilt:** `runPhase_2_9_1_Primaries`
(`phaseRunners.ts:3725-3750`) is a flat PV+command*5 SORT; "convention" in the engine is the founding
Continental/Constitutional Convention only. Sharpens Phase-1 #10 (was `drums`/`nuke`-spec; now end-to-
end) + the delegate-class fork (§29.11b). **Binds at** the (unbuilt) convention subsystem (#19/#20).
debt #66; game-mechanics §28.6.
**★ #183 ENDORSEMENT-MOMENTUM HOLE → FOLDS INTO #185/Phase-1 #10; S; DO NOT build standalone.**
Withdrawal/endorsement is inert unless the dropper holds delegates; add a **momentum value (+2 Minor/+3
Major OR a home-state/region transfer OR an ideology-penalty waiver) to the withdraw+endorse primary
action, INDEPENDENT of delegate count** — but the **d6 base leaves little headroom** (couples to the
DH-72 d6→d3 squeeze, QW19) + pairs with the ballot-2 80/20 delegate-release hole (DH-57). **★ Shipped-
state CONFIRMED unbuilt** (`grep withdraw|endorse|momentum in src/engine` = ZERO). **Binds at** the
(unbuilt) primary action loop inside #185. debt #67; game-mechanics §28.6.
**★ #186 DETERMINISTIC LATE/MID-CYCLE BOOT → a FIFTH `BootSheet` shape; RIDES K4's `BootSheet` +
`scenarioBoot` (#115); no new keystone; M-L.** The FIRST modern-era boot in the corpus + the cleanest
late-start failure: a 1960 scenario authored for the 1960-62 GOVERNANCE turn (JFK president, offices for
1961) forced into an Elections-Phase start a turn early → cascading manual patches (Senate 50-50 vs real
66-D, no Leadership-gated Party Leader, on-election rolls skipped, party-fatigue dropped, gov terms-
served unknowable, delegate weights hand-assigned, DC EVs invalid pre-1961, NO Command runway → roster
frozen). Ted: eras are *"the stoniest"* thing → a **per-year boot TABLE is the only path** (`#POST 528`).
**★ Shipped-state CONFIRMED unbuilt:** no generic boot (`GameContext.tsx:5-6,24` → hand-authored
builders; `grep scenarioBoot|BootSheet in src/` = ZERO). The pipeline needs a **`startMode:
'electionPhase'|'governance'` discriminant + an `asOfYear` incumbent table + `seededLeaderTenure` (#187)
+ `delegateWeights`/`primaryCalendar` (#185) + `careerTrackBackfill` (DH-25)**. The modern boot is the
most-demanding instantiation of the SAME K4 `BootSheet` schema — it SHARPENS the bar, it does NOT add a
keystone. **Binds at** the K4 `BootSheet` schema + `scenarioBoot` pipeline (#115). debt #68; game-
mechanics §28.1, §28.6.
**★ #187 PARTY-LEADER FATIGUE (6-yr decay → ~8-yr presidential rotation) → S; pairs with #15; do the
boot retro-apply WITH #186.** A **`party preference −1` after 6yr of one party leader**, ENGINEERED to
force a ~8-yr presidential rotation (Ted, `#POST 645`); dropped here because the mid-cycle start skipped
1958 → its absence COMPOUNDED the #184 landslide (let the House flip 58R-42D unchecked). **★ Shipped-
state CONFIRMED unbuilt:** `Party` (`types.ts:1306-1311`) has NO tenure field; the faction
`leadershipStartYear` (`:1302`) is WRITTEN (`phaseRunners.ts:2010/2035/2076/2309`) but NEVER read for a
penalty. Add a **party-level tenure substrate + a per-cycle decay consumer near the `partyPreference`
update** + the #186 boot retro-apply. **Binds at** the `partyPreference` update path + the #186 boot
substrate. debt #69; game-mechanics §8.5.3, §28.1.
**★ #188 "BIG RED BUTTON" NUCLEAR LOSS → FOLDS INTO #88 (meter-floor game-end + APOCALYPSE clock,
Phase-1 #6); XS-S; NO new subsystem.** The campaign's whole PREMISE was a nuclear game-over but it NEVER
fired; Cold-War content that DID fire is event/legislation FLAVOR on the generic engine (Cuba-client-
state bill, Bay of Pigs as a minority-flip lever, Test Ban Treaty as an A/B event). **★ Shipped-state
CONFIRMED:** `triggersGameEnd` is consumed in EXACTLY ONE place (`phaseRunners.ts:2871`, event-only,
UNCHANGED); `grep nuclear|MAD|bigRedButton in src/` = ZERO. If built, a nuclear loss is a **configured
end-condition ROW on the #88 model, NOT a MAD/arms-race engine** — corroborates the §28.2 negative-scope
directive (#106). **Binds at** the #88 meter-floor end-condition table (`:2871`-area). debt #70; game-
mechanics §28.2, §30.17.
**★★ #88/#86/#115/#173/E1/#14/#114/DH-36 ESCALATED IN PLACE (justification, NOT new scope, NOT a
re-sequence):** **#88** gains its FIRST MODERN datum (the corpus still shows exactly ONE proven game-over
— `terror2000`'s coup; the meter-floor model now has the modern nuclear premise pointing at it →
confidence ↑); **#86/#115/#173/E1** boot cluster — the mid-cycle modern boot is now CONCRETE (a 5th
`BootSheet` shape with EXPLICIT holes), the strongest case yet for the `scenarioBoot` pipeline; **#14**
platform/election rules now have the designer's nerf DIRECTION set (DH-72 sub-fixes + the #184 cap);
**#114/DH-36** re-confirmed as the GM-WORKLOAD DEATH from the MODERN angle (the 10-human run "Temporarily
Paused" and never resumed solo — the CPU-AI cluster E9/K5 carries this too). **★ Raise priority/
confidence; do NOT re-sequence, do NOT add scope.** **Decision-gated RECOUNT: 0** (the #184 platform-vs-
meter open Q, the #183 momentum value, the #185 delegate-floor, the #186 per-year incumbent tables, the
#187 penalty-curve are all designer/content-gated WITHIN their existing epics). **No re-sequence;
top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the DH-72 tuning sub-fixes JOIN
the QUICK-WIN bucket (QW19-QW21) and the modern primary→convention cluster (#185/#183 + the #184 platform
cap) is now the KB's richest forward-played election spec inside Phase-1 #10.**
**★★ Batch-26 fold-ins (`summer2021` — THE CORPUS'S LARGEST SOURCE + the FIRST run to PLAY FEDERALISM
FORWARD [1772→~1810, the whole president/cabinet/diplomacy turn loop end-to-end], a 3-GM relay over ~14
months; FOUR net-new ENGINE gaps [#179, #182, #181, #180] + ONE bug [DH-71]; #177/#178/#114 ESCALATED
IN PLACE; NO new keystone, NO re-order, NO keystone moves):**
**★ #179 CABINET LINGERING-ROLL METER ENGINE → A REDESIGN of the shipped deterministic drift + ≥5
sub-systems; FOLDS INTO E6 (Lingering) + E16 (cabinet) + the §10.4.1 blunder layer; L; ★ SPLIT IT.**
The federalism counterpart to the shipped §11.1 lingering: each lingering phase EVERY cabinet member
ROLLS to move their portfolio meter ±1, and it can BACKFIRE (Treasury rolled badly → EconStab → Great
Recession; War+Navy both succeeded → MilPrep maxed). **★ Shipped-state CONFIRMED unbuilt-as-designed:**
`runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260`) is a DETERMINISTIC skill-keyed DRIFT (`drift(skill)`
`:3266-3273` — fixed ±delta, NO roll, NO backfire, NO Efficient/Pliable/regional hook); the cabinet
pick `runPhase_2_3_1_Cabinet` (`:2158-2224`) is a flat score-sort with NO ideology gate, NO
Speaker/PPT/advisor decider override, NO bill-coupling. So #179 is a **REDESIGN of the deterministic
drift into a roll-based engine** PLUS ≥6 sub-rules across ≥2 systems: (a) per-portfolio ±roll w/
backfire + Efficient=auto-+2-if-it-moves; (b) Pliable-Pres → Speaker/PPT/Key-Advisor decider override
incl. SCOTUS nom; (c) cabinet-bill double-points coupling (propose-in-portfolio → carried to law = 2×,
dropped = SecXX −50); (d) ideology-gated confirmation by office (RW-Populist SecWar rejected); (e)
regional-representation meter penalty (DomStab fell — no Deep-South Sec); (f) executive-actions-
implemented-by-cabinet-with-BLUNDER rolls (the §10.4.1/#22/#126 layer in a cabinet context). **★ SPLIT
(tech-lead): (i)+(f) = the meter/blunder roll engine · (b)+(d) = the appointment/confirmation layer ·
(c) = bill-coupling · (e) = election-feedback input** — they have different dependencies. **Binds at**
`runPhase_2_5_1_Lingering` (`:3260`, the roll engine) + `runPhase_2_3_1_Cabinet` (`:2158`, the
gate+decider-override) + the §10.4.1 blunder layer + the bill-scoring path (`:3508`-area double-points)
+ the §22.2 enthusiasm input. **Gated on #177 (federalism era existing) + the diplomacy/EconStab meters
it moves; couples to #67 meter ladders + #116/#160 EconStab cascade.** debt #59; game-mechanics §20.10.
**★ #182 command = the President's PER-TURN EXECUTIVE-ACTION BUDGET → FOLDS INTO the §14
executive-action build (K2 ActionRegistry) + #179; S once the exec system is real.** Verbatim: "Osgood
can do up to 4 actions each turn because he has 4 command" — a President's `command` = his
executive-action count per Presidential-Action phase (0 = inert, N = N actions/turn), each implemented
by the relevant cabinet member with a blunder roll (#179(f)); generalizes the §24.1/#61 "0-command
acting president is inert" read into a positive budget. **★ Shipped-state CONFIRMED unbuilt:** `command`
today is ONLY a PV input (`pv.ts:74`, `total += p.command * 10`), a kingmaker-graduation reward
(`phaseRunners.ts:1441/1465`), a grant (`addCommandPoint`, `abilities.ts:33`), a decay stat
(`:2398/2409`), and a candidacy gate (`:1386`/`:3729`) — NEVER an action-count budget; the executive
phase `runPhase_2_8_1_Executive` (`:3632`) takes EXACTLY ONE flat `chance(0.5)` action,
command-independent, with no cabinet implementation. The fix is small in shape (loop the exec phase
`command`-many times) but **GATED on the §14 executive-action system becoming a real K2 ActionRegistry
chooser** (today a placeholder) + couples to #179(f) blunder. **Binds at** `runPhase_2_8_1_Executive`
(`:3632`) — turn the single placeholder into a `command`-budgeted loop over a real ActionRegistry (K2).
**★ Open Q (designer-gated): does the same budget apply to governors/other offices?** debt #62;
game-mechanics §20.11(2).
**★ #181 PRESIDENTIAL PLATFORM-PROMISE CONVENTION SYSTEM → PART OF the #19/#20 convention cluster; DO
NOT build standalone; M.** On winning the nomination (primary → convention → multiple ballots →
nominee), the nominee builds a **BINDING PLATFORM** = 1 economic + 1 domestic + 1 judicial + 1
foreign/military legislation promise + 1 presidential-action promise + a promise to resolve any ongoing
CRISIS, PLUS deal-making office-promises (cabinet/VP posts to allies for endorsements — "promise John
Marshall SecState/VP"); a binding commitment object feeding kept/broken → enthusiasm/points. **★
Shipped-state CONFIRMED unbuilt:** no convention/platform object exists (`grep platform|promiseBill|
conventionPlatform in src/` = ZERO; the convention machinery itself is designed-not-built, §15.3 /
#19/#20). **Binds at** the (unbuilt) convention subsystem — a `PresidentialPlatform` object generated
at the convention + a kept/broken evaluator wired to the §22.2 enthusiasm engine + the office-promise
deal layer. **Rides the #19/#20 convention epic; gated on conventions existing — DO NOT build
standalone.** debt #61; game-mechanics §20.14(1).
**★ #180 MONUMENT / LEGACY-TRAIT ACHIEVEMENT LAYER → RIDES the federalism/founding era-content build;
S–M, LOWER PRIORITY than #177-#179.** The founding era awards **named historical-legacy traits to
whoever performs each in-game FIRST** ("Atlas of the Revolution" = nominate the 1st Senior General;
"Author of the Declaration" + Celebrity; "Father of the Country" = score the final RevWar victory;
"Architect of the French Alliance"; etc.). **★ Shipped-state CONFIRMED unbuilt:** `traits[]` is a
freeform `string[]` granted only by `addTrait`/era-event/draft — NO first-achievement-detection /
award-once-on-event layer (`grep firstAchievement|legacyTrait|monument in src/` = ZERO); the
Federalist-Papers authoring rule was a DOCUMENTED HOLE (no rule to identify the authors). **Binds at**
an "on first occurrence of event X, award trait Y to the actor" hook in the era-event/decision-event
resolution path + the `addTrait` idiom. **Rides the era-content build; gated on #177; the Fed-Papers
rule needs authoring first.** debt #60; game-mechanics §20.14(2).
**★ DH-71 FACTION-HANDOVER DUPLICATE-POLITICIAN → a SINGLE-OWNERSHIP CONSTRAINT on the (unbuilt) #1
faction-handover, NOT a shipped regression; XS.** A mid-thread faction "steal" moved David Brearley to
a new faction WITHOUT deleting the original → two identical records in two factions → a later
governor-nomination pulled the WRONG one (career-track flag mismatch). A transfer must MOVE, not COPY.
**★ Shipped-state CONFIRMED — the faction-handover feature is itself UNBUILT:** `grep handover|transfer|
steal|reassign in src/` = ZERO transfer code path; `partyId`/`factionId` are read-only filters across
`src/pages/*` and `eraGraph.ts:42`, never re-assigned by an ownership-transfer function. So DH-71 is a
**FORWARD-LOOKING CONSTRAINT on the (designed) faction-handover feature (#1)**, not a regression:
whatever transfer function we build must mutate the SINGLE politician's `factionId` (a MOVE), never
clone the record — and the build's owned-state model removes the manual-spreadsheet ledger drift this
run also exposed (an ideology-tally miscount; a crisis flag stuck "on"). **Binds at** the (new)
faction-transfer function (#1) — enforce single-ownership. **Folds into #1 faction-handover.** debt
#63; game-mechanics §20.15.1.
**★★ #177/#178/#114 ESCALATED IN PLACE (justification, NOT new scope, NOT a re-sequence):** **#177 is
now DESIGNED-AND-PLAYED-FORWARD, not just designed-and-walled** — `summer2021` is the FIRST source to
run the whole federalism TURN LOOP forward (cabinet appointment → era/decision events → cabinet-driven
lingering → diplomacy → legislation+veto+override → presidential action; §20.9), proving the walled
content is the *actual gameplay* of the next era; `eraGraph.ts::validate()` still throws via the same
TWO guards (`:153-155` `chartIndex >= 49` + `:150-152` the pre-1789 president/cabinet decider ban →
gate on `year >= 1789`), and the per-power diplomacy-relation meter is confirmed missing (the shipped
`snap.game.diplomacy` is a flat 8-power score map mutated only by §11.1 lingering drift, not a
relation-event meter) — **the highest-confidence "federalism is the next-era build" signal in the
corpus.** **#178** now has LIVE FORWARD-PLAY evidence — the war-version **Treaty of Paris is
AUTO-PROPOSED once the RevWar ends**, and passing it **organizes Mississippi + NW(Ohio) Territory**
(territory by TREATY, not bill/war); Ohio = "Indian country, needs war OR diplomacy first"; the **NW
Indian War** = win 5 land battles in 5 attempts (10 yrs) OR permanently CEDE OHIO — the same
bounded-retry budget as #178/DH-61 (§20.13(5)); `admitState` (`territories.ts:8-23`) still admits ONLY
from the static registry. **#114/E9/K5/DH-36 re-confirmed from the MULTIPLAYER end:** the CPU is
mechanically WEAK at moving meters (Ted's meta-math, POST 2671: ~50 all-CPU governors × ~3 actions ×
~20% only move a crisis meter ~1-2 spaces), so a crisis the CPU can't dent must be soluble by a single
engaged human → the quantitative root of "solo human is the design target"; the 3-GM relay over 14
months re-confirms DH-36 (GM-workload is the constraint) WITHOUT a clean burnout quit (it trails off).
**★ Raise priority/confidence; do NOT re-sequence, do NOT add scope.** **★ Corroborations (tags, not
rows):** the **non-VP successor "inherit 1 command" ruling** concretizes #61 (the positive counterpart
to "0-command acting pres is inert"); the **LIVE impeachment subsystem** ran to conclusion (House
impeaches → Senate convicts a SCOTUS Justice; contrast the VOIDED `ideo1928`, DH-66); **veto-override
scoring isolates Speaker+SenMajLdr**; **SCOTUS replacement nominated at the Presidential-Action phase ON
PURPOSE** (#52); the **Bank-of-the-US charter→repeal-attempt→repurpose-by-bill** trajectory (#177
institutions created↔killed↔recreated by law). **Decision-gated RECOUNT: 0** (the #179-split,
#181-rides-convention, #178 ≤3-fires canonicity, #182-applies-to-governors are gated WITHIN their own
work). **No re-sequence; top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — but the
federalism era-content cluster (#177/#178 + the four new #179/#180/#181/#182) is now the KB's richest,
most-forward-played next-era build target.**
**★★ Batch-25 fold-ins (ONE DESIGNER-GMed single-player run — `principle1772`, the 7th captured 1772
source + the cleanest 1-human-vs-9-CPU run in the KB; TWO net-new federalism-era gaps [#177, #178],
the strongest #114/E9/K5 escalation in the corpus, corroboration — NO new keystone, NO re-order, NO
keystone moves):** **★ #177 FEDERALISM FOREIGN-AFFAIRS DECISION-EVENT SPINE → FOLDS INTO E1/
scenario1788 + era-event/eraGraph (#92); couples to E12 diplomacy (#107/#162); M.** The late-1790s
endpoint surfaced the most-detailed Federalist-era foreign-affairs content in the KB — a spine of **8
president/cabinet decision-events** (French-Rev neutrality/alliance-betrayal, Citizen Genêt,
Pinckney's/Spanish Treaty, Jay Treaty, Haitian Revolution, alt-history "Bourbons Restored"
`realEvent:false` branch, NW Indian War, Bank-recharter), each with per-power diplomacy-relation +
DomStab/EconStab + enthusiasm consequences + implementation-blunder rolls + counterfactual branches,
plus the late-1790s cabinet + Key Advisor Hamilton. **★ Shipped-state CONFIRMED hard-walled:**
`eraGraph.ts::validate()` THROWS on this content via TWO authoring guards — `:153-155` rejects any node
`chartIndex >= 49` ("Federalism out of scope") + `:150-152` rejects any `president`/`cabinet` decider
("no President/Cabinet pre-1789"); every event in the spine is a post-1788 president/cabinet
decision-event, so authoring it requires **LIFTING BOTH walls** (gate president/cabinet deciders on
`year >= 1789` instead of forbidding them) **+ adding per-power diplomacy-relation meters** to the
snapshot (none exist today — `grep relation|diplomacyMeter|foreignRelations in src/` = ZERO) **+** the
§10.4.1 multi-decider / implementation-blunder layer. **Binds at** `eraGraph.ts` (the 2 walls + a
`year >= 1789` decider gate), a NEW federalism era-graph content file (the 8 decision-events +
alt-history branches), a per-nation diplomacy-relation meter on the snapshot. The federalism-side
companion to §20.3's `fed` spine, from a 7th 1772 angle — DESIGNED content the era graph deliberately
omits, the clear intended next-era fill. **★ Open Q (designer-gated): confirm this is the intended
next-era build, not a permanent scope wall;** V deferred the EV/territory-event %-chances (POST 1801),
so firing probabilities are not yet authored. debt #57; game-mechanics §20.3.1.
**★ #178 TREATY-GRANTS-TERRITORY + BOUNDED "3-STRIKES" RETRY → FOLDS INTO statehood/territory + DH-61;
GENERALIZES DH-61; S; PAIRS WITH #177** (Jay Treaty is the #177 carrier event). A NEW
territory-acquisition class the build has no path for: the **Jay Treaty** (a president decision-event)
grants WI/IN/IL/MI on signing — "Marshall refused it twice, then signed Attempt Two → gained
WI/IN/IL/MI" — under a GM-ruled **per-event retry budget**: a territory-gating event may fire **up to 3
times** before the land is **permanently lost** (origin: the NW Indian War "3 chances," POST 207). **★
Shipped-state CONFIRMED unbuilt:** `admitState` (`territories.ts:8-23`) admits ONLY from the static
`EXPANSION_STATES_BY_ID` registry, driven by 1772 era-event `postEffects` — no treaty path, no bill
path, no per-event retry budget (`grep treaty|retriesRemaining|retryBudget in src/territories.ts` =
ZERO). The fix = a **treaty→`admitState` post-effect path** (a president decision-event whose effect
calls `admitState` over a list of states, the Oregon-Treaty pattern, §10.4.2) **+ a `retriesRemaining`
(default 3) per-event budget** on the `EraEvent` type (a field + the retry-on-fire mechanic) — one
reusable per-event retry primitive spanning treaty, war, AND event gates. **★ Open Q (designer-gated):
is ≤3-fires canonical for ALL territory-gating events, or a GM house rule?** debt #58; game-mechanics
§17.6.1/§21.5.
**★★ #114/E9/K5 ESCALATED (JUSTIFICATION, NOT new scope, NOT a re-sequence) — the LOAD-BEARING
PREREQUISITE for the shipped solo mode to be COMPLETABLE.** Every prior 1772 solo/2-player run
(`new1772`/`grass1772`/`rookie1772`) DIED to manual-upkeep/CPU-bookkeeping burnout before an endpoint;
`principle1772` is the FIRST 1772-cluster run to reach a natural endpoint — and ONLY because the
designer himself hand-simulated all 9 CPU factions (their cabinets, draft lists, leadership votes,
event responses; he REWROTE the CPU career-track heuristic mid-run, POST 323). The run simultaneously
proves the shipped 1-human-vs-9-CPU shape (#114) IS completable AND quantifies exactly what the app
must own to make it sustainable WITHOUT a designer-in-the-loop: the entire per-faction CPU sim (the
**E9 handler suite + K5 CpuController**). The cluster now carries BOTH ends — 4 GM-burnout deaths (cost
of NOT having it) AND a designer-paid success (proof of the ceiling). CONFIRMED unbuilt (`grep
cpuHandler|handlerSuite|runCpuFaction|perFactionSim in src/` = ZERO; only inline `isPlayer`/
`playerFactionId` gates in `phaseRunners.ts`). **★ Raise priority/confidence on E9/K5 (reflects on
#114/DH-36); do NOT re-sequence, do NOT add scope.** debt #114/E9/K5; game-mechanics §25/§29.1/§30.15.
**★ #176 founding MilPrep ordering bug → NOW DESIGNER-FLAGGED + 3rd-source (confidence ↑, no scope
change):** Ted himself flagged LIVE that the auto-forced war bills can't raise MilPrep (Militia Act is
federalism-only) and that the Army/Navy bills fire AFTER the Military phase that needs them ("Seems…
dumb," POST 73/259-261) — the designer-acknowledged confirmation of the batch-24 #176 finding; STILL a
content/authoring constraint to honor when founding war-content + a meter-prereq ladder are built, NOT
a regression (the build has no tier-prereq system yet). debt #56; game-mechanics §17.4.
**★ Corroborations (tags, not rows):** **#153 command-bootstrap NOW 4-SOURCE** — 1st President =
Abraham Whipple, an emergent Iron-Fist Admiral with no celebrity head start (Washington went Unlikable
+ LOST Canada → never President), confirming Presidents emerge from play; the founding cluster #86 boot
/ #133 CC 4-3-2 table / #100 sway-driven ahistorical Constitution (Hamilton swung racial-minority
suffrage in → DomStab crisis) / #101 offices-by-law (incl. the DH-40 "Judicial Act vs Judiciary Act"
naming bug) / #92 era-as-content-band / #62 pre-12A VP=runner-up / #31 cabinet-region-snub election
penalty / #45 concurrent multi-war + loss-debuff / #155 French-alliance unloseable flag + #158
solo-RevWar-losable, all re-confirmed from a 7th 1772 angle; the kingmaker ≤1-protégé/turn cap (V
ruled, POST 224). **Decision-gated RECOUNT: 0** (#177 scope-wall + #178 ≤3-fires canonicity are
designer-gated WITHIN their own work). **No re-sequence; top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 +
scenarioBoot → E1) — but the CPU-AI cluster (E9/K5) now carries the corpus's strongest justification,
and #177/#178 are the federalism-era next-build content.**

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E1 | **Federalism / early-republic era epic (`scenario1788` content + the early-republic subsystems + ★ batch-12 draft re-rules #136/#137/#138)** | A high-value epic — **batch 7 widens it to the federalism + early-republic (Republicanism/Democracy/Manifest-Destiny) content band.** Era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events (~1792; `Party.formedYear`/`eraName`), 10-faction roster + nickname relabel, Mod/Cons draft profile, federalism SCOTUS set (`scotusFederalism.ts`). **Must land with BUG-1 (QW1) + QW10 (DH-30 min-floor).** **The early-republic subsystems this band needs land at Phase-1 #4 (E4 12A elector toggle) + #4b (E4b slavery-flag+Cohens / Second Bank+Bank War / statehood-by-bill+territory-gate)** — folded out into their own rows below so they sequence after their keystones. Expect sub-PRs (event spine, SCOTUS set). **Independent of E3b** — build whichever finishes a playable scenario faster (§9.1.2). **Can ship with stubbed CPU handlers** — K5 wires in later. **Batch-8 (DH-38) — model a late-ratification / "Rogue Island" multi-year ratification WINDOW in the Constitutional-Convention era system.** **★ Batch-10 — `scenario1788` is the THIRD scenario, so this is where the shared `scenarioBoot(BootSheet)` pipeline (#115, in K4) is BUILT** — author the pipeline here instead of copy-pasting `build1856Scenario` a third time. The boot validators (QW8/QW9) + the appointment-ladder (#115b) wire in here. **★★ Batch-12 — the DRAFT RE-RULES land WITH the federalism boot (because draft logic is at scenario-boot scope):** **(a) #136 (`tedchange#POST 7, 47`)** — random skill on draft has **NO Command chance** (verify the existing pool exclusion at `phaseRunners.ts:187-197` — Command is the separate `command` field on `Politician`, not in the 6-base-skills boost pool today; this may be a no-op verification in the current code path, but pin the rule); **(b) #137 (`tedchange#POST 8, 10, 48`)** — **no cross-party draft**: pols enter at IRL party at draft time (age 25); add a draft-time assignment gate that pins a rookie's `partyId` to the dataset's IRL party + excludes cross-party drafting in `pickBestForFaction` (`phaseRunners.ts:33-53`); flip via 2.1.6 conversion only; **(c) #138 (`tedchange#POST 50`)** — **3 random traits + 3 random alt-states per draft** (SUPERSEDES the 5/5 reading from earlier digests); goes in the era-config table (§6.1 pattern) — also corroborated by #69 (1856-native re-rule). XS each. **RULED by Ted (`tedchange#POST 5-12, 15-22, 47-50`).** **★★ Batch-12 #133 (`tedchange#POST 211, 217-236, 277, 352-355`, game-mechanics §17.1.y) — 1st / 2nd CONTINENTAL CONGRESS COMPOSITION REWRITE (S):** verified `continentalCongress.ts` + `firstContinentalCongress.ts` handle the CC entity, but the **state-size delegate quota (Big=4, Medium=3, Small=2) is NOT in code today** (the firstCC builder uses faction-by-pol-count, not the size table). Ted's rules: **Big states (PA/MA/VA/MD) = 4 delegates**; **Medium = 3**; **Small (GA/RI/DE/NH) = 2**. **Pre-DoI ("1st CC"): faction with most pols in state picks delegates.** **Post-DoI ("2nd CC"): Gov picks delegates.** **Articles of Confederation:** prohibits consecutive election + 2/3 of states for legislation + UNANIMOUS for amendments. **PMG appointment goes through Domestic Committee in CC era** (`tedchange#POST 352-355`). Rewrite the CC composition rules at `continentalCongress.ts`/`firstContinentalCongress.ts` accordingly. Pairs with #43 + #92 (era-band transitions); corroborates `cf82a7d3 §4f`. **RULED by Ted (`tedchange#POST 211, 217-236, 277, 352-355`).** **★★ Batch-13 — TWO `scenario1788` PREREQUISITES land WITH E1 (NEITHER is optional for a 1788 boot):** **(DH-61, S)** scenario-boot must **seed era-active wars** — the all-CPU 1788 run forgot the **Northwest Indian War** entirely ("lmao we literally forgot", `oopscpu#POST 338-344`); add a **`BootSheet.activeWars` field + a boot hook in `scenarioBoot`** that reads a start-year active-wars table (1788 → NW Indian War: active, 20%-loss, **War Score −2**; also 1840 Seminole, 1856/1868 Apache/Navajo, 1972 Vietnam −10, 2012 War on Terror) and instantiates each running war over the generic `War` model — **folds into K4 / the `scenarioBoot` pipeline (Phase-1 #3)**; **(DH-62, M)** the **pre-12A two-vote/no-ticket Electoral-College mode** — every state casts for TWO candidates who each take the state's full EVs, 1st = Pres / 2nd = VP regardless of party + **same-state-EV exclusion** (`oopscpu#POST 197`) + the throwaway-tie defense (the pre-12A nomination trio in handler 9a); an **era-keyed election-mode variant** alongside the per-state EC method + the `electorsByLegislature` flag — **folds into the per-state-EC epic (E4 / Phase-1 #4)**. **★ Batch-17 SHARPENS DH-62: pre-12A VP = the most-EV RUNNER-UP** (Ted-RULED, `ted1772`) — pin "2nd = VP" as exactly the runner-up by EV count regardless of party (corroborates the two-vote/no-ticket model from a 4th 1772 source; also relates to the E10b VP-succession path). **Both gate ANY `scenario1788`** — they MUST land with E1. **★ Batch-17 EXTENDS E1 with #159 — the CONSTITUTIONAL-CONVENTION SUBSYSTEM (M–L; the largest new build surface this batch; `ted1772`, game-mechanics §17.3.y) — it EXTENDS the shipped `constitutionalConvention.ts` superset SKELETON (like the 1856 CW engine extends `scenario1856`, NOT a new scenario), and is DOWNSTREAM of the keystones.** Verified SHIPPED today: `makeConvention` defines **7 binding articles** (`:6-77`), `autoFillCPUVotes` does a SINGLE CPU-consensus pass per article (`:81-100`, party/ideology heuristic — NOT the eliminate-revote loop), `applyConvention` names a **Father-of-the-Constitution = highest-PV delegate** + 3 Federalist authors (`:147-182`), counts governor approvals and **ratifies at `approve >= 9`** (`:185-192`), then transitions `currentEra = 'federalism'` + dissolves the Continental Congress (`:196-212`), setting **flat `s.electoralVotes = max(3, ccDelegateSlots+1)`** (`:208-211`). **The new build surface (DESIGNED, unbuilt) — lead with the two HIGHEST-VALUE extensions:** **(i) the SLAVE-COMPROMISE plank → per-state EV PENALTY** (slaves-don't-count → seceded-South EV penalty GA −5 / SC −5 / NC −3 / VA −3 — the cousin of RevWar floor 3; shipped stores `slaveCompromise` as a string with NO EV consequence, and `applyConvention` sets EVs flat with no slave-plank branch); **(ii) the per-article propose → debate-sway → 2/3-of-states vote → ELIMINATE-LOWEST-AND-REVOTE loop** (shipped does ONE auto-fill, not the elimination loop); then **(iii) gov-sends-3-delegates** (2 own + 1 opposition, ≥1 Legis); **(iv) random-egghead drafter** (vs the highest-PV "Father"); **(v) debate-sway by traited delegates** per article; **(vi) threshold-amendable** amendment plank (#100); **(vii) Judiciary-Act-sets-SCOTUS-count** (the Constitution permits the court; Congress sets the # of justices). **Pairs with #133 (1st/2nd CC composition, already in this row) + #100 (E5 amendments) + #79/E25 (SCOTUS).** **★ Batch-17 CORROBORATES this row's founding-boot machinery from a 4th 1772 source: #86 (founding boot) + #136 (random skill grant has NO Command chance) + #133 (the 4/3/2 delegate size table + faction-picks-pre-DoI / Gov-picks-post-Articles + no-consecutive-terms + 2/3-pass, verbatim from a fresh 1772 boot) + DH-61 (NW-Indian-War "3 chances" origin directly confirmed) — now 4th-1772 / 3rd-CPU corroborated.** | K4 (incl. the `scenarioBoot`/`BootSheet` pipeline — built here, #115, **+ DH-61 boot-seed active wars**), **E4** (**+ DH-62 pre-12A EC mode**), **QW1**, **QW10**, K1; **★ #159 ConCon extends the shipped `constitutionalConvention.ts` — downstream of the keystones, pairs with #133 + #100 (E5) + E25** | L (+ XS each for draft re-rules; **+ DH-61 S + DH-62 M prerequisites; + ★ #159 ConCon subsystem M–L, the largest new surface this batch**) | gap #2, mechanics §20 (`fed`) + the early-republic band (`rep1800` §A/§B) + **DH-38 late-ratification window (`new1772`)** + **#115 scenarioBoot built here (`dem1820`; `GameContext.tsx:264`)** + **★★ #136/#137/#138 draft re-rules (`tedchange#POST 5-50`)** + **★★ DH-61 boot-seed active wars + DH-62 pre-12A EC mode (`oopscpu#POST 338-344, 192-199`)** + **★ #159 Constitutional-Convention subsystem — extends `constitutionalConvention.ts`; slave-compromise→EV-penalty plank + per-article eliminate-revote loop + gov-3-delegates + random-egghead + debate-sway + threshold-amendable + Judiciary-Act-SCOTUS-count (`ted1772`, game-mechanics §17.3.y)** + **★ #86/#133/#136/DH-61 4th-1772 / 3rd-CPU corroboration (`ted1772`)** + **★★ batch-24 #176 founding MilPrep prerequisite-ordering fix (S; authoring constraint to honor when founding war-content + a meter-prereq ladder are built; cap ~4-5 pre-federalism; designer-gated open Q — adopt the reverse-prereq fix or keep the founding crisis; `grass1772#POST 86-90, 121` + `rookie1772#POST 26, 32-33`; pairs with E6/#67 + #155/#56; game-mechanics §17.4, debt #56) + #86/#133/#67-#134/#100/#101/#92/#159 founding-cluster 5th+6th-1772 corroboration (`grass1772`/`rookie1772`)** — CARRIED + EXTENDED + designer-RULED, HI-CONF (6th-1772 founding source) | ready (carries the DH-61 + DH-62 prerequisites; **★ now also carries the #159 ConCon subsystem extension, M–L, downstream of the keystones**; **★★ batch-24: #176 founding-MilPrep prereq-ordering is an authoring constraint honored here, designer-gated open Q**) |
| E2 | **Bill typing + budget-gated spending cap (+ batch-7 procedure-subtype veto-routing fix, DH-31)** | `Bill.type?: 'foundational'\|'spending'\|'crisis'` (`types.ts:1506`, none today) + numeric `game.spendingBudget?` reading the **numeric `nationalSurplus`/`nationalDebt`** (E18g), not the ordinal `revenue`. Non-crisis spending bills can pass the floor yet be "BLOCKED DUE TO BUDGET"; crisis bills bypass. `modern` adds a **bill-relationship/replacement graph** (its deep form rides E29, the type tag lands here). **Batch 7 — fix the procedure-subtype veto MIS-ROUTING (DH-31 / divergence #21):** confirm the bill `subtype` taxonomy and **skip the President sign/veto step for `subtype: procedure` bills** (Institute Filibuster, create-whip-offices) — `rep1800` POST 2342-2348 says the engine wrongly routes them to the President. Small verify-and-fix on the same bill-typing surface. Prereq for crisis bills + the Hamiltonian program + the investigation-bill type (E14) + Reconstruction readmission bills (E3b) + the Second Bank Crisis Bill + statehood-by-bill (E4b/E21) + free-Executive-proposal carry-pool (E14, per `drums` #74). | K0; **E18g** (numeric surplus — build that sub-item early) | M | gap #42 (`1772s` B4; `fed` 159-703; `modern` 32-2265; `drums` #74; **★★ `gild1868 (b14)` corroborates #42 spending cap from a native-1868 start — and DH-63 currency-regime exclusivity FOLDS INTO this bill-relationship/replacement graph, see the EG epic**) + **DH-31 / divergence #21 (`rep1800` §A 2342-2348)** — CARRIED + EXTENDED, HI-CONF (4 era + native Gilded) | ready |
| E3 | **Generic cross-era war system (divergence #6) — DESIGNED multi-theater + tiered** | Generalize one `War` model with the **multi-confirmed battle formula `Win% = Difficulty + Planning(SecMil+CoS) + Officer×10 + MilPrep + Benchmarks`** (d100); per-theater `WarScore`; **`WS ≥ +11` auto-win**; war-end `WarScore × 2 = %` to carry; post-war defeat `\|WS\| × 2 × 10 = %`; **officer KIA on natural-1**; catastrophic 100/100; momentum bonus (+1/-2 turn-vs-turn); **Major / Minor / Operation tiers** with per-tier multipliers; **naval-N-then-ground gating per-war** (Mexico=3, WWI=2); **Treaty A-D tier + Basic-vs-Special routing by Admin + 3-roll treaty chain** (Pres → Sec State → Amb); confirmation cascade (defeated commander → Incompetent + fired → Senate drama), loss-debuff. Replace the flat resolver (`phaseRunners.ts:3593-3627`) and **fold the 1772 Rev-War loop in as one configured instance**. **`drums` confirms the formula end-to-end across 5+ wars × 4 eras** (Eastern + Western + Utah + WWI + Mexico + Sioux); **the single most multiply-confirmed cross-era resolver in the knowledge base.** Outcome grants/denies territory (couples to E5/E9-statehood). **K5 touchpoints (commander selection per battle, theater focus, surrender/peace) live INSIDE this epic, not as separate handlers** — they are war-epic-internal. Pairs with A4 battle-card (P-track) + the Phase-2 military tier. **★ Batch-9 — this is THE engine the "Cold War" relabels (§9.1.8); there is NO separate Cold-War engine to build (verified: only `revolutionaryWar.ts` exists).** `nuke` confirms the formula across the Cold-War wars (Korea/Cuba/Gulf/War-on-Terror) AND surfaces two LOAD-BEARING build-holes the epic must close: **(DH-47a) wars NEVER resolve today** — the war-end roll's odds are so low Korea ran ~2 decades — so **build a real RESOLUTION / peace path** (couples to DH-12 white-peace; today's flat resolver never terminates); **(DH-47b) there are no army/navy/air BRANCHES** — army generals command navies, "naval" pols die in infantry — so **design the branch model.** The Cold-War "content" (nukes-as-×2-multiplier flag, NASA-prerequisite flag, scripted events) is DATA on K4's era-content registry, not engine work. **★★ Batch-15 (#152, M within this epic — COMPLETES DH-47) — the war engine must resolve in DEFEAT, with a loss package + multi-phase wars.** `terror2000` is the first proof that wars end in DEFEAT (not just stall or win): the **War on Terror is formally LOST** ~2005 with a withdrawal speech (POST 639/656-662) and the **War in Afghanistan runs to "Phase II"** (POST 1027). The shipped resolver (`phaseRunners.ts:3615-3620`) ends at `warScore` but applies **NO loss package** — so add **(a) the war-DEFEAT package** as the inverse of the victory bundle: **military officers −1 Mil + −1 in ALL future elections; the PRESIDENT gets −1 in ALL future elections; Party-Pref craters** (capped if already maxed) — **the President-loss term is a permanent per-pol election modifier that COUPLES INTO the #18 canonical scorer** (the new E20b row); **(b) MULTI-PHASE wars** — a war carries across half-terms through named phases (naval→ground gating already specced; here add Invasion→Counter-Terrorism Phase I/II carry-roll so a war can run for cycles before its loss/win resolves). This completes DH-47's must-resolve half (batch 9 added "wars never end → build a real resolution/peace path"; #152 supplies the LOSS branch + the multi-phase carry). The success-chance formula + naval→ground gating + per-theater carry-roll were ALSO confirmed natively here (`Planning(CNO/CoS+SecDef) + Officer(Mil×10 +naval) + Meters(Prep 15) + Allies(5) + Difficulty → d100`, POST 816-817). **★★ Batch-16 (#155, M within this epic) — the WAR-BALANCE pass: "Union wins too easily."** Both human players AND the GA flagged the war system as far too generous to the Union (`hd1` POST 1000-1004, after "2 civil wars where the Union is winning easily") → add **(a) a real ENEMY-STRENGTH term** to the success formula (today "repelling a British invasion is only slightly easier than a native tribe, and is *easier* than the Civil War" — there is no enemy-strength factor) **via `rng.ts` — which ALSO closes the `phaseRunners.ts:3603` `Math.random` determinism leak** (engine code must stay deterministic per CLAUDE.md); **(b) BATTLE-SIZE weighting** (a Difficult-loss is too small at −1 — Bull Run small vs Gettysburg/Wilderness large should weight differently); **(c) an OFFICER-MIL-SHARE CAP** ("a 5-Mil leading officer gives a larger bonus than all other factors combined," so a board of 4-5 Mil officers makes any war a near-lock — cap that share); **(d) PER-THEATER scoring** (adopted LIVE POST 1314); and **resolve the cross-run OPEN QUESTIONS**: the **war-end multiplier 1.0-vs-0.5** (`hd1` adopted **0.5** LIVE POST 1314, vs Part-2's 1.0), the **3-naval-wins HARD-gate (#56/Part-2) vs a naval-then-land CONTINUE-ROLL chain (`hd1`)**, and the **war-hero presidential bonus PERMANENT-vs-ONE-TERM** (Part-2 permanent +1-all-elections vs `hd1` one-term +1 in 1864). **★ COUNTER-CONSTRAINT (BOUNDED): keep the 1772 Revolutionary War WINNABLE** — a RevWar loss is a game-over (POST 1004), so a harder engine risks ending games before they begin; tune so the RevWar floor stays playable. **★★ Batch-17 (`ted1772`) SHARPENS this constraint into THREE NAMED RevWar WINNABILITY FLOORS — a HARD, BOUNDED constraint on the #155 balance pass; floor (1) SHIPPED, floors (2)+(3) BUILD (game-mechanics §21.1 — the #155 HARD-CONSTRAINT block):** the fullest battle-by-battle RevWar trace in the KB shows a genuinely-LOSABLE Revolutionary War held up by exactly three floors, all of which #155 MUST preserve. **Floor (1) — the FRENCH-ALLIANCE void-loss flag is SHIPPED:** `applyFrenchAlliance` (`revolutionaryWar.ts:268-270`) sets `war.frenchAlliance = true`, and the loss condition `currentGroundLosses >= groundLossesRemaining && !war.frenchAlliance` (`:259`) VOIDS once allied — **preserve this exactly.** **Floor (2) — the 2/3 PEACE-VOTE THRESHOLD is NOT built (BUILD):** terminal peace lives only as `triggersGameEnd` era events (`eraEvents1772.ts:300,309,430`) with **NO vote gate at all**; in `ted1772` a 5-4 = **55.5% MAJORITY for peace FAILED only because of this threshold, so 55.5% must NOT pass.** **Floor (3) — #158's CPU-anti-game-over 75%-oppose override is NOT built (BUILD; couple it here, see below).** **The CONSTRAINT:** when #155 adds the enemy-strength term + battle-size weighting + the Officer-Mil-share cap + per-theater scoring, it MUST be bounded so a 1772 game with ALL THREE floors intact stays WINNABLE — a war engine tuned hard enough that a 1772 game loses before 1788 WITH the floors is over-tuned. **★★ Batch-17 COUPLES #158 (CPU-anti-game-over, S) INTO this epic — build it WITH the #155 balance pass; it IS RevWar floor (3) (game-mechanics §13.2 + §25.7):** the marquee `ted1772` solo-game-ender is a CPU-controlled terminal peace node (a `triggersGameEnd` node, above) resolving through `pickAIResponse` (`eraGraph.ts:88-103`) by ordinary `aiBias` point-math, which leans FOR peace — there is **NO anti-game-over / anti-peace term whatsoever.** Add an anti-game-over layer in `pickAIResponse` (or a wrapper at the `triggersGameEnd` decision): EITHER a flat **75%-oppose roll** on any response that sets `triggersGameEnd`/surrender, OR a points-based anti-peace ideology bias (**human picks which — a tuning fork, not a blocker, flagged §30.x**). Also consumed by the **#75 CPU event-vote handler (E9 handler 9g)**, so #158 binds across E3 + E9. **Pairs with #152** (the war-defeat loss package) + #56/#45/#106 + **#158** (floor 3). The four open Qs are tuning (not blockers) and bind inside this epic (flagged at game-mechanics §30.x for the human). | K0, **QW2**; **★★ #158 builds WITH #155 here (RevWar floor 3) + feeds E9 handler 9g** | M–L (+ #152 loss-package + multi-phase, M; **+ #155 balance pass, M; + #158 CPU-anti-game-over, S [RevWar floor 3]**) | gap #45, divergence #6 (`fed`; `1772s`; `modern`; `hd` I-1; **`drums`** POSTS 123, 1725-1731, 2199, 2539, 2728, 2881, 3278, 3540, 5111-5114, 5353, 6181, 6317, 6571, 6705-6712, 6928) + **DH-47 must-resolve + branches; §9.1.8 Cold-War-is-this-engine (`nuke` §28.2)** + **★★ #152 war-DEFEAT loss package + multi-phase wars — COMPLETES DH-47 (`terror2000` ch11 POST 816-817, ch20 POST 152-277, ch31 POST 639/656-662/1027)** + **#56/#106 success-formula + naval→ground native corroboration (`terror2000`)** + **★★ #155 war-balance pass: enemy-strength + battle-size + Officer-Mil cap + per-theater + the 1.0/0.5, naval-gate, war-hero-bonus open Qs; bounded by 1772-RevWar-winnable (`hd1` POST 1000-1004, 1314)** + **★★ #158 CPU-anti-game-over (the solo-game-ender — `pickAIResponse` `eraGraph.ts:88-103` has no anti-peace term) + the THREE RevWar winnability floors PINNED as a HARD constraint on #155 [floor 1 SHIPPED `revolutionaryWar.ts:268-270`; floor 2 the 2/3 peace threshold BUILD (55.5% must NOT pass); floor 3 = #158 75%-oppose BUILD] (`ted1772`, game-mechanics §21.1/§13.2/§25.7)** + **★ #56 fullest battle-by-battle RevWar trace — 4th-1772 corroboration (`ted1772`)** + **★★ batch-24 TWO MINOR WAR CONSTRAINTS fold in here (no new epic): (i) CLAMP the doubled-officer Planning term to 0-5 — `revolutionaryWar.ts:212` `*2` can hit 6+ (`rookie1772#POST 35`; XS); (ii) add a SCRIPTED-EVENT WIN PATH to the generic `War` model — `grass1772`'s "King George grants autonomy" event win is a 3rd RevWar win-path alongside French-alliance (floor 1) + battle-score (`grass1772`; folds into #155/#56); + #56 5th+6th-1772 RevWar-trace corroboration (`grass1772`/`rookie1772`); debt #16, #56** — CARRIED + EXTENDED, HI-CONF (8 era + native modern + 3rd CW run + 6th-1772 RevWar trace) | ready (**#155 balance pass BOUNDED by the 3 RevWar floors; #158 builds here as floor 3; ★★ batch-24: + Planning-0-5 clamp [XS] + scripted-event win path**) |
| **E3b** | **Civil-War / Reconstruction epic [1856-arc — COMPLETES the shipped 1856 scenario]** | The Major-tier instance of E3. **Placed here (right after E3 + K2) because it finishes a half-built playable scenario** — `scenario1856.ts` ships but its spine dead-ends at the Trent Affair (1861) (§9.1.2). **Split cheap-first into sub-PRs:** **(a) secession gating (#58)** — `Politician.allegiance?: 'union'\|'secessionist'` + a "Secessionists" inactive pool keyed to seceded/border-state membership + `Southern Unionist` trait reads + draft-pool tagging + no-relocate-into-rebel-state + CSA officeholder seeding (cheap, additive); **★ Batch-16 EXTENDS (a) with #157 — full CSA-government seeding (S; `hd1` POST 893-894, 912):** the rules define only CSA Pres/VP/Sr-General (Pres/VP = random among seceded Command-holders, Comm-Gen = the sole seceded Military-Leader), so the GM had to improvise the entire Confederate cabinet + generals/admirals "for flavor" — add a **CSA-government seeding spec** that fills a full Confederate cabinet + multiple generals/admirals drawn from seceded Command/Military pols, so the **CSA-victory branch (in #156's (d)) has a real opposing government**, not a 3-office shell. **Depends on the per-pol Southern-Unionist gate (this sub-PR) + DH-64's dataset audit** (so the right pols are in the seceded pool); **(b) free/slave sectional-balance crisis (#59)** — derived from the existing `SLAVE_STATES_1856` set: while free > slave in `nationalism`, the fixed score/meter/election penalty package fires, retired on emancipation (cheap, no new field). **★ Batch-10 — corroborated from a 1820 START + sized S additive at `admitState`:** `dem1820` fires the **free/slave sectional-balance crisis from a 1820 start, "ending the Era of Good Feelings"** — so this sub-PR is **NOT 1856-only**; it fires from **1820 / Nationalism starts too**. The cheapest home is a **balance check ADDED to `admitState` (`territories.ts:8`, which does NO balance check today)**: on each admission, compare the free/slave count (`State.isSlaveState` already EXISTS at `types.ts:1329` but is only read in UI today — wire it into the engine here) and arm/retire the penalty package. **An S additive at the statehood pipeline (E21), no new field** — the AR+MI statehood + 8%-tariff sequence in `dem1820` is exactly this trigger; **then the heavy parts:** **(c) the two-theater war (#56) + the batch-7 CW VARIANTS (#97)** — East/West theaters, 3-naval-wins-gate-land, per-theater WarScore (+10 auto-win + carry-roll), named-battle casualties on the military track, Union-victory reward incl. the **permanent president +1-all-elections**, war-hero <20yr bonus; **plus the `rep1800` variant branches** — DomStab=1 early-trigger, President-defects-to-CSA ("Oaths to Two Masters"), Hartford/Northern-secession variants, UK-intervention 3rd theater, guerrilla 4th stage, internal CSA government-runs-its-own-elections; **(d) Reconstruction readmission (#57)** — a `reconstruction?` state-status enum + per-state readmission **bills** (E2, **readmit-by-REPEAL** per `rep1800` §C) that gate Gov/Rep/Senate unlock + a time-boxed `+2-toward-incumbent` bias modifier + the 3-plan exec action (K2) + amnesty law that removes-or-returns pols (prune broken Kingmaker pairs — same code as QW6) + carpetbagger-doubling + a **Reconstruction END exec action** (`drums` POST 2812; AG-Admin roll + lobby payouts + White-League/Red-Shirts trigger). **★★ Batch-14 EXTENDS (d) with #148 — the 20-yr auto-expiring Reconstruction REGIME (S–M within E3b; `gild1868` native spec):** add a `game.reconstruction = { startYear, endsYear }` regime CLOCK (begins 1864, **auto-ends ~1884** "to prevent a one-party state," `gild1868` POST 73/76) on top of the per-state readmission bills above; while active, **seceded-state seats are APPOINTED** — military Govs by the majority-party President, **Senators by the PPT-faction**, **Reps by the Speaker-faction**, non-seceded appointees per the §23.1 Unionist tag (rules 3.0.32/3.0.35, POST 70/143/330; binds at the appointment / `vacateOffice` `phaseRunners.ts:2446` sites); a **+2-RED bias-while-active** that **SUNSETS to a Blue Solid South at expiry** (FL/GA/LA Blue+3→+5, VA Blue+2→+5, POST 5145 — a time-boxed per-state bias modifier); **per-state early end by repeal-bill.** **#148 does NOT open a new epic — it strengthens this (d) Reconstruction half, and it INHERITS the DH-29 solo-blocker** (the Strict/Ironclad readmission plan never passes with CPU factions, so solo Reconstruction must be resolved — same DoD requirement below — before ANY antebellum/CW/Reconstruction scenario, **including a Gilded boot that turns the timer ON**, ships solo). The Gilded-era content epic (EG) consumes this regime when `scenario1868` boots. **★★ Batch-16 RE-SCOPES (d) — #156 is the 4-PLAN RECONSTRUCTION MODEL and the readmission half's DEFINITION-OF-DONE; it is the CANONICAL DH-29 FIX (M–L; `hd1`, AUTHORITATIVE — vcczar POST 2680-2687, 2692-2694):** model `game.reconstruction = { plan, adoptedBy, startYear }` + **FOUR plan types — No-reconstruction-plan / Ten-Percent / Ironclad (Wade-Davis) / Military-district (= historical Congressional Reconstruction) — available to BOTH the President AND Congress**; **★ the deadlock-breaking PREREQUISITE: ALL Southern-state readmissions require "a reconstruction plan adopted by Congress OR by the President" — so the President can UNILATERALLY adopt one** (no more null drift); **individual per-state readmission only under the Ironclad or Military-district plan** (No-plan / 10% = states just come back); **pardon tiers on both branches**; the **15th-Amendment effect = +2 state bias in all Deep-South states / +1 in all other former-seceded states toward the incumbent party while Reconstruction is active** + "African-American men can now hold office" (sunsets when Reconstruction ends — formalizes the #57/#148 Solid-South bias above); 13th/14th adjusted + plan/pardon ideology-impact tables; the **CSA-victory branch** (POST 2692: seceded pols removed, Unionists move to the nearest loyal state, events drive eventual reintegration). **This SUPERSEDES the earlier 3-plan / 2-plan readmission readings (Lenient-10% vs Strict-Ironclad) as the canonical design** — the per-state readmission BILLS + the time-boxed bias above are subsumed under the 4-plan model, and #148's 20-yr regime clock keys off the adopted plan. **★★ It is the direct fix for DH-29 and REMOVES the K5 / E9-handler-#2 soft-dependency FOR THE SOLO CASE** (the player-President adopts a plan directly via the exec path — no CPU vote, no era-boundary backstop needed for solo to terminate). The four cross-run open Qs (war-end multiplier 1.0/0.5; naval hard-gate vs continue-roll; war-hero bonus permanent/one-term; whether the prerequisite HARD-gates ALL readmission or permits a default No-plan) are tuning, flagged at game-mechanics §30.x. **(e) Canada conquest → era-gated statehood (#60)** — per-(state,era) admission gating on the statehood pipeline (E21), a bonus Canadian draft pool on annexation, native-born relaxation, Canada-region election penalties. **★★ DEFINITION-OF-DONE REQUIREMENT (batch 7 / DH-29 / §9.1.6 — ★★ NOW RESOLVED BY #156 FOR THE SOLO CASE): the Reconstruction half was UNWINNABLE solo without a passable readmission path.** GM-verified (`rep1800` POST 9170): the historical Strict/Ironclad-Oath plan can **NEVER pass with CPU factions** ("only 3 factions would ever consider voting for it… in a single player game it basically can never pass"), and post-guerrilla-war even the Lenient-10% plan was effectively un-passable. **★★ Batch-16 REFRAMES this from a CPU-only artifact to a STRUCTURAL deadlock — and HANDS the fix:** `hd1` played the arc with **HUMANS on both sides** (Southern-Dem 10% vs Radical-Rep Ironclad/Mass-Trials) and the choice **STILL deadlocked — neither plan passed, states drifted back with NO plan at all** (POST 2678). **The canonical FIX is #156's "plan adopted by Congress OR President" prerequisite** (above in (d)): **the player-President can UNILATERALLY adopt a plan via the exec path, guaranteeing Reconstruction terminates in BOTH solo and deadlocked-human play with NO CPU vote required.** So #156's unilateral-adopt **REMOVES the K5 / E9-handler-#2 soft-dependency for the SOLO case.** The earlier backstops remain useful as belt-and-suspenders but are **no longer load-bearing for solo**: **(1) a CPU default-vote bias for the flagged "historical/required" readmission bill** (E9 handler #2 consults a "historical-plan" flag — only matters now if Congress, not the President, drives readmission) and **(3) an era-boundary auto-resolution backstop** (Reconstruction auto-ends at the `nationalism→gilded` boundary via K3's condition-driven `advanceEra`). The readmission half (d) **no longer HARD-depends on E9 handler #2 for solo** — it ships on the #156 unilateral-adopt path (K2 exec action), with the CPU bias an enhancement for the Congress-driven case. **Otherwise the first scenario to get a full K5 handler suite — wire CPU handlers as they land** (the antebellum pressure drives most CPU surfaces). | **E3** (multi-theater war — **incl. #155 balance pass**), **K2** (readmission/secession + #156 plan-adopt exec actions); (a)'s #157 CSA seeding needs the per-pol Southern-Unionist gate + **DH-64** (E18d dataset audit); (d) needs E2 (bills) + `State.isSlaveState` (`types.ts:1329`, EXISTS) + **#148's 20-yr regime clock needs the §23.1 Unionist tag + the leadership/PPT runner (Speaker/PPT-faction appointment path)**; (e) needs E21 (statehood pipeline); **★★ #156's unilateral-adopt RESOLVES the readmission half (d) for SOLO via the K2 exec path — it NO LONGER HARD-depends on E9 handler #2** (the CPU default-vote bias / K3 era-boundary auto-resolution remain optional belt-and-suspenders for the Congress-driven case) | L (split 5+ sub-PRs; **+ #148 S–M + #156 M–L (4-plan model / DH-29 fix) within (d); + #157 S within (a)**) | gap #56–#60 (`hd` I-1..I-5; secession I-2, sectional I-4; `drums` Reconstruction END action) + **#97 CW variants + DH-29 solo-blocker (`rep1800` §C 6884-8661, 9166, 9170)** + **★★ #148 20-yr auto-expiring Reconstruction timer + appoint-by-Speaker/PPT-faction + Solid-South sunset (`gild1868` POST 70/73/76/143/330/5145) — EXTENDS (d), inherits DH-29** + **★★ #156 4-plan Reconstruction model + unilateral-adopt prerequisite + +2/+1 bias = CANONICAL DH-29 FIX (`hd1` POST 2680-2687, 2692-2694)** + **#157 CSA-government seeding (`hd1` POST 893-894, 912)** + **#56/#58/#59 3rd-CW-run / 5th-antebellum corroboration (`hd1`)** + **★★ batch-19 PROVENANCE confidence-bump (no resize/move): `fixes2022` (Fall 2022) is the EARLIEST source for #121 — the Secessionist trait gap AND the Reconstruction "Secessionist Politicians" appointment rule (`fixes2022#POST 364-365, 641-644`, predating the `smallbugs` corroboration); the #121 Secessionist-trait dataset add itself lives in E18d's #120 umbrella — designer intent from the START → raise build-confidence on sub-PR (a)'s secession gating; game-mechanics §30.10** — CARRIED + EXTENDED + earliest-source-confirmed (#121), HI-CONF | **ready** (war half + #156 solo readmission via K2 exec); **CPU-driven readmission still benefits from E9 handler #2 — DH-29 fix designed-in-hand** |
| E4 | **Per-state presidential-election method (divergence #5) + the 12A legislature-elector toggle (batch 7, #93 / divergence #20)** | Legislature-method states award EV from seated-legislature party majority instead of popular vote in `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`). **Correction (`rep1800` §A): this needs a GENUINELY NEW resolution branch** — the shipped `senatePre17` context (`types.ts:701`) is NOT a legislature-majority tally, it's the same `calcStateVote` formula with a different `ctx` tag (`phaseRunners.ts:3896`); so `electorsByLegislature` must award EV by seated Gov/Senate/Rep party majority (Gov breaks ties), recomputed after the popular tally. Decisive in 1796/1804 (CT/GA/MA/NJ/NY/SC/VT legislature-decided). **Batch-8 (DH-44) — decide the canonical legislature-vote COUNT when building this branch:** the post-12A legislature-chosen-state vote count is undecided across `new1772`/`rep1800`/`hd` — Kingmaker votes vs. a Gov+Senators+focus-Reps headcount. **Author + lock the count as part of this resolution branch** (it is the concrete tally `electorsByLegislature` computes). **Batch 7 — the 12th-Amendment before/after state machine (#93):** add the 12A as a toggleable amendment state (E5) that is the SINGLE toggle **unlocking conventions + the separate VP-on-the-ticket** rule — so a **pre-12A global `conventionsEnabled = false` gate** disables the convention machinery (E10) + gates "Separate VP Election" / "Send VP to Shore Up Support"; the "Nationwide Popular-Vote Surge" era event later flips all states except SC off legislature-electors (the machine's end-state). Flipped per-state by era event, globally by amendment (E5). **Lands with the federalism/early-republic epic (E1).** **★★ Batch-13 — DH-62 is the THIRD pre-12A election-mode branch this epic must carry, and it is a HARD `scenario1788` PREREQUISITE (M):** the **pre-12A two-vote/no-ticket EC mode** — every state casts for TWO candidates who each take the state's full EVs, **1st place = President, 2nd = VP regardless of party**, no separate VP ballot. The all-CPU 1788 run exposed the **throwaway-vote TIE exploit** (CPUs each backing two of their own trivially tie) — Ted patched the CPU side (the pre-12A nomination trio in handler 9a: nominate an alternate when none exists; two-from-same-state can't both win a state — `oopscpu#POST 192, 197`), but the **election MODE itself needs a real spec**: how CPUs allocate their two votes, **same-state-EV exclusion**, 1st→Pres/2nd→VP cross-party tally, and tie→contingent resolution. An **era-keyed election-mode variant** alongside the `electorsByLegislature` flag (#93) and the per-state EC method (#5) — a genuinely new resolution branch. **MUST land with E1 / `scenario1788`** (a 1788 boot cannot run an election without it). Pairs with #44/#62/#72/#91. | K1 (the field), E5 (global flip + the 12A amendment), **E1 (this is a `scenario1788` prerequisite)** | M (+ M for DH-62) | gap #44, divergence #5 (`fed` 194-373) + **#93 / divergence #20 (`rep1800` §A 222, 264, 276, 502, 638, 691, 708)** + **DH-44 legislature-vote-count (`new1772`)** + **#44 popular-vote-surge event 4th-era corroboration (`dem1820` — "all states except DE+SC")** + **#44/#16 multi-cycle presidential elections run end-to-end (`arkzag` — the full 8-stage general exercised across 1824/1828/1832/1836, ch7 POST 584; per-state result = d6 vs d6, loser takes −1 on all future presidential bids ch7 606; candidate CANNOT campaign in person until the Primary Era — era-gated, POST 598)** + **★★ DH-62 pre-12A two-vote/no-ticket EC mode + same-state-EV (`oopscpu#POST 192-199`) — a `scenario1788`/E1 prerequisite** — CARRIED + EXTENDED, HI-CONF (multi-cycle) | ready (carries the DH-62 prerequisite) |
| **E4b** | **[early-republic, batch 7] Slavery-flag + Cohens + Second Bank + Bank War + statehood-by-bill organize→admit** | **The early-republic subsystem cluster — the substrate for the whole 1800–1856 antebellum design.** Split into sub-PRs: **(a) Slavery-as-state-flag + Cohens-v-Virginia amendment-only abolition (#94) — SMALLER than assumed:** `State.isSlaveState: boolean` **ALREADY EXISTS** (`types.ts:1329`, per-state, populated in `states1856.ts`, even set by the statehood path `phaseRunners.ts:3175`), so NET-NEW is only (i) the abolition-toggle-off + Plantation-industry binding (a successful abolition bill turns OFF Plantation nationwide [Plantation→Agriculture 2:1] + permanently deactivates slavery legislation; "counts" only when the flag is off in ALL states), (ii) a persistent **`Cohens v. Virginia` SCOTUS rule-modifier** disallowing *legislative* abolition where the flag is set (a SCOTUS-ruling-gates-a-bill-class pattern — same shape as the *Pollock*→income-tax hook in E5; rides the SCOTUS docket E25), (iii) all new states enter free, and (iv) the reverse-an-ahistorical-ruling-via-amendment mechanism (SCOTUS rulings are otherwise irreversible — the only legislative path to abolish is the Amendment, E5). Feeds E3b's free/slave sectional crisis (#59). **(b) Second Bank recharter clock + Bank War exec action (#95) — NEW stateful economic subsystem:** `game.secondBank?: { charteredUntilYear }`; a Crisis Bill (E2) creates the **President-of-US-Bank cabinet seat** (the dynamic seat list, E16) marked **unremovable while the Bank exists**; a "Remove Deposits → State Banks" exec-action (E13) kills it; a **20-yr recharter clock** that lapses unless re-chartered (the historical Bank War in miniature). Generalizes the offices-by-law layer (#66/E16) with a recharter clock. **(c) Statehood-by-bill ORGANIZE→ADMIT two-step + unorganized-territory draft gate (#95):** extend `admitState` (E21) with a `Territory.organized: boolean` two-step (land you own but haven't *organized* has undraftable/unrelocatable pols until an organizing bill passes — LA-Purchase land, Michigan) + the draft-pool filter for unorganized-territory pols — **using the SAME `territoryOwned` predicate as K3's era-content gate** (§9.1.5). **★★ Batch-23 #175 (the §27.5 half — MrPotatoTed `pop2012b#POST 687-688`): stamp every admit-state bill `lawClass: 'permanent'`** (statehood is irreversible — there is NO Repeal-Statehood bill; secession is the only un-making of a state, per the E25 DH-32 state-guard). The `Legislation.repealable`/`lawClass` data model itself lands at #42/E29; this row only marks the statehood bills `permanent`. | (a) SCOTUS docket (E25) for the `Cohens` rule-modifier + E5 (abolition amendment) + E3b #59 (sectional); (b) K2 (exec-action library E13) + the dynamic seat list (E16) + offices-by-law (#66, E16) + E2 (Crisis Bill); (c) E21 (statehood) + K3's `territoryOwned` predicate | M (split 3) | gap **#94 (`rep1800` §A 2161, 2180-2182, 2675; §B 3363, 4329)** + **#95 (`rep1800` §A 954, 2123, 2350, 3175; §C 8362)** + **★★ batch-23 #175 (§27.5 half) — stamp admit-state bills `lawClass: 'permanent'`; the repealable/lawClass data model lands at #42/E29 (`pop2012b#POST 687-688`; game-mechanics §12.9, debt #55)** — NEW + EXTENDED | ready (note: (a)'s `Cohens` rule-modifier rides E25 SCOTUS; **E4c (#116, batch 11) is the Jacksonian economic CONTENT state machine that sits ON TOP of this (b) Second-Bank institution — listed below after E6, since it also depends on E6's EconStab crisis meter**) |
| E5 | **Constitutional amendments as durable state (incl. era-keyed ratifier #64; ★ batch-12: amendments NOT SCOTUS-challengeable — build-target SIMPLIFICATION)** | `GameState.amendments?: { id; passedYear; data? }[]` + amendment bill type + **2/3-House pass gate** + **cross-state ratification vote that can fail** + **grandfather clause**. **Ratifier + threshold are an era-keyed, in-game-changeable field (#64):** `fed`/`gilded` by legislatures; **`modern` by GOVERNORS (40 of 53)**; **1856 by 3/4 of GOVERNORS, with the threshold itself tunable by a passed amendment** (options table → faction-enthusiasm side effects; Gilded default drops to 2/3 of states). Effect-binding: term-length (4↔6), popular-vote-everywhere (→ E4), VP-vacancy fill (→ E10b), suffrage, court size. Add a **SCOTUS-ruling-gates-a-bill-class-until-amendment hook** (`hd`: *Pollock* → no income-tax bill until ratification; couples to E23). Extend `Predicate` with `{ amendmentPassed }`. **★★ Batch-12 (`smallbugs#POST 250-269` vcczar, game-mechanics §30.3) — AMENDMENTS NOT SCOTUS-CHALLENGEABLE: BUILD-TARGET SIMPLIFICATION.** vcczar's `smallbugs#POST 250-269` rules: **Govs CANNOT challenge a ratified amendment via SCOTUS** — the Constitution is by-definition constitutional. This **OVERRIDES** `tea1772`'s #100 ruling ("SCOTUS can overturn an amendment via Gov-requested review"). **★ DROP the Gov-requested judicial-review-of-a-ratified-Amendment branch from this row's scope** (the batch-8 #100 addition above is SUPERSEDED — strike that whole sub-path). **KEEP:** (a) the **strike-a-statute** path (SCOTUS rulings void/demote *statutes*, not amendments); (b) the **mutable-threshold field** (`ratifierThreshold` tunable by passed amendment — still applies). The amendment lifecycle is unaffected. **RULED by vcczar (`smallbugs#POST 236-269`, supersedes `tea1772` #100); pairs with E25's same SCOTUS-overturns-amendment branch DROP.** **★ Batch-11 (#119) — RE-SCOPED: model the amendment LIFECYCLE as an explicit state machine (NOT a new epic).** `arkzag` exercises the full machinery repeatedly across the 1820→1840 arc, so this row gains three concrete additions on top of the `GameState.amendments?` field above (verified still UNBUILT — no `amendments` field in `GameState` today, `types.ts:1558-1646`): **(1) the explicit lifecycle states `propose → committee → floor → governor-ratify → active`** (`arkzag` ch17 POST 453/496: amendments PEND then ratify by a **GOVERNOR vote** — the ratifier table above resolves *who* ratifies; this adds the staged *status* field, e.g. `Amendment.status`); **(2) the active-amendment-BLOCKS-a-legislation-class hook — the PROACTIVE face of the *Pollock* gate already on this row:** an `active` amendment can bar a whole bill class until repealed (the "Abolish Federal Excise Tax Amendment" bans any federal excise tax until repealed, ch29 — same shape as the *Pollock*→income-tax block and E4b(a)'s *Cohens* rule-modifier; one `blocksLegislationClass?` field on the amendment, read by the bill-eligibility filter); **(3) the un-bundleable flag** — amendments CANNOT be bundled with ordinary bills (ch24 POST 1530; an `unbundleable` flag honored by E14's packaging step). First-class era amendments the arc surfaces (content, not new mechanics): the succession **"Vice-President Vacancy Amendment"** (the in-game "13th" — consumed by E10b's #61 succession), the **"National Suffrage for White Male Property Owners"** (#59), the recurring **"Abolish Slavery Amendment" *CRISIS*** (always fails), "40-Year Min Age for SC Justices" (#52). **Gates BUG-2.** | K0; K4 (ratifier table stub) | M (+ #119 lifecycle S; the batch-12 simplification REMOVES the SCOTUS-review-of-amendment sub-path — small net reduction in scope) | gap #39 (`gilded`+`fed`+`modern`) + #64 (`hd` I-9) + ~~#100 amendment-review~~ **SUPERSEDED batch-12 / `smallbugs#POST 250-269` (`tea1772` #100 OVERRIDDEN by vcczar)** + #100's amendable-threshold half retained (`tea1772`) + **#119 amendment lifecycle + class-block + un-bundleable (`arkzag` ch17 453/496, ch24 1530, ch29)** + **★ batch-12 amendments-NOT-SCOTUS build-target (`smallbugs#POST 236-269`)** + **★★ `gild1868 (b14)` corroborates #39 amendment lifecycle from a native-1868 start (women's-suffrage A/B amendments + threshold machinery)** — CARRIED + EXTENDED + SIMPLIFIED, HI-CONF (4 era + founding + 1820 lifecycle + native Gilded + designer-RULED) | ready |
| **E5b** | **[batch 7, ★ FOUNDATIONAL; ★★ batch-12 designer-RULED] Ideology-as-CIRCLE — central `ideologyDistance` helper + migration + ★ #127 conversion/shift schedule + ★ #129 Kingmaker-Protégé allowlist (divergence #19 / #99 — TED-AUTHORITATIVE batch-12)** | **Place EARLY** (§9.1.7). `IDEOLOGY_ORDER` (`types.ts:14`) is a LINEAR array and ideology distance is **open-coded at 10+ engine/UI sites** — `factionCenter` (`phaseRunners.ts:715`), `stepToward` (`:740`), conversion adjacency (`:993-1003`), sponsor-distance (`:3548`), a **private `ideologyDistance` helper** in `firstContinentalCongress.ts:120`, plus `FactionLeaderPage.tsx:19-20,49` / `Relocations.tsx:107` / `Kingmakers.tsx:86` — **with NO central helper**. Steps: **(1)** add a central `ideologyDistance(a, b, circular)` engine util; **(2) migrate the 10+ open-coded sites to it** (a mechanical, **behavior-preserving** refactor while `circular = false`); **(3)** gate the wrap on `GameState.ideologyIsCircular?`; **(4)** extend conversion targeting (E9 handler 9f / §25.8) to **same-OR-adjacent** ideology under the ring. **★★ Batch-12 — #99 is NOW TED-AUTHORITATIVE** (3-thread corroboration → designer-ruled). **★ Batch-12 #127 (`tedchange#POST 18-31, 34-39, 38, 51-53`, game-mechanics §6.3.y + §6.4.y + §27.7) — IDEOLOGY-SHIFT / CONVERSION RATE SCHEDULE folds into this row:** **(a)** the **adjacency rule** (`tedchange#POST 38, 53` — same-party conversion can target same OR ADJACENT ideology, was same-only) is a one-site filter change at `phaseRunners.ts:993-1003`; **(b)** the **LW↔RW Pop 25% special-case cross-circle shift** + **auto-Two-Faced trait grant** on successful flip rides the circle helper at the wrap (`tedchange#POST 24, 28-29, 51`); **(c)** the **33% effective party-flip rate** for can-party-flip pols is a refinement of `CONVERSION_ODDS.poach.matrix.cross` (`tedchange#POST 34-39`) — base rate is roughly aligned today, refine post-willingness-amplifier; **(d)** corroborates and SHARPENS the existing #76 CPU conversion adjacency by extending same-party targeting to adjacent ideology. **★ Batch-12 #129 (`tedchange#POST 201-208, 279-283`, game-mechanics §6.5.y) — KINGMAKER → PROTÉGÉ TRAIT ALLOWLIST/BLOCKLIST:** a small data config — **PASS list:** basic Kingmaker / Celebrity / Hale / all positives; **BLOCK list:** Master+National Kingmaker / Frail / Flip-Flopper / Two-Faced. XS as a list addition to `KINGMAKER_RULES` (`types.ts:295`); ride with this PR or Phase-1 #21 (conversion refactor). **Steps 1-2 are cheap + additive while the flag is off (zero behavior change)**; **steps 3-4 + #127/#129 fold in once the helper exists**. **NOT a keystone** (nothing blocks on it) — cheapest early, most error-prone if deferred. **RULED by Ted (`tedchange#POST 18-31, 34-39, 38, 51-53` for #127; `tedchange#POST 201-208, 279-283` for #129; #99 is now designer-AUTHORITATIVE).** | — (independent; steps 1-2 land before E9's conversion/SCOTUS handlers so they call the helper) | M (XS-S helper+migration; M for the flag + #127 conversion-adjacency schedule; +XS for #129 allowlist data) | **#99 / divergence #19 (`rep1800` §B 5717, 5730; `types.ts:14`)** + **★★ #99 TED-AUTHORITATIVE batch-12** + **#127 conversion/shift schedule (`tedchange#POST 18-31, 34-39, 38, 51-53`)** + **#129 Kingmaker→Protégé allowlist (`tedchange#POST 201-208, 279-283`)** + **#76 adjacency EXTENDED batch-12 (same-party targets same OR adjacent)** — NEW + RULED, HI-CONF (3-thread + designer-RULED) | ready |
| E6 | **Meter-model generalization + meter-driven endgame clocks + ★ batch-12 #134 Lingering 7-step STRICT ordering + tax/tariff decay CARRY-FORWARD (NEAR-TERM; batch 6 absorbs APOCALYPSE; batch 12 absorbs the Lingering re-spec)** | Banded-text ladders over the existing 7 `NationalMeters` fields + crisis entry/exit by tier + cascade rules + top-of-ladder effects + numeric `nationalDebt` integer + `metersToElectionBonus()`. **A 1:1 WIDENING of `NationalMeters`, not a relabel.** `hd` extends to the **full ~16-meter bank** (#67): era-gated per-power relation meters + per-ideology enthusiasm meters + the **9-part Lingering resolution order** + hard caps (Mil-Prep/Planet-Health = 8) + tax/tariff decay timers + **policy-gated caps**. Builds on QW3's ±3-clamp (now extended to cabinet + ideology, #80). **Batch 6: ABSORBS the APOCALYPSE meter-driven endgame clock** (divergence #14 / #88). Verified shipped: only event-driven endgame exists; no meter-watcher, no countdown. Add **`GameState.endgameClocks?: { meter; threshold; remainingYears; startedYear; bandName? }[]`** + per-era `era.endgameClockRules?`. In `runPhase_2_5_1_Lingering`: arm/decrement/disarm; in `advancePhase`: terminate via `game.gameEnded` when `remainingYears ≤ 0`. **BOTH endgame paths share `game.gameEnded`**. **Meter-agnostic** — the Populism Planet Health 10-yr clock is one configured row per era. **Batch 7 corroborates an early-era enumerated meters-driven game-over set (#98)** — Autocratic/Standard/Attempted Coup + Economic Collapse + Enemy-Takes-Defenseless-US. **★★ Batch-15 (#88, S — the FIRST PROVEN GAME-OVER/LOSS STATE in the KB) — build the meter-driven per-event-phase game-END roll TOGETHER with the APOCALYPSE countdown clock as ONE meter-driven endgame module here.** `terror2000` is the FIRST AMPU playtest to actually END on a game-ending event: the **"Autocratic Coup Ends America" end-condition FIRED LIVE and TERMINATED the game** (the dystopian "Rockefeather coup," POST 827/829, Ted-confirmed). It is gated on **Honest-Gov at its FLOOR** (which it had sat at since late-Bush) and fires at **~20%/event-phase** "after just barely missing it in multiple previous phases." So add, alongside the APOCALYPSE countdown (#88-A) above, the **#88-B enumerated per-event-phase end-condition ROLL** over the existing `triggersGameEnd` surface (event-only today, `phaseRunners.ts:2871`; the terminal `GameOverScreen` already exists) — both paths share `game.gameEnded`, so they close through the SAME sink. **The HonestGov-gated Autocratic Coup is the live/worth-building path; the MilPrep/EconStab coup gates stay the trivially-maxed (effectively-dead) ones** — wire the HonestGov-floor Autocratic Coup first. **★★ Batch-23 #88 PREDICATE SHARPENING (`pop2012b#POST 632`; game-mechanics §26.4) — the apocalypse/coup endgame fires at the meter FLOOR band, NOT "Crisis."** `pop2012b` shows Planet's Health hitting **"Crisis"** (and Rev/Budget "Crisis") in a Lingering tick with **NO apocalypse clock and NO game-end roll firing** — confirming the trigger is the BOTTOM tier (**APOCALYPSE**), one band BELOW "Crisis." **So BOTH the #88-A APOCALYPSE countdown clock AND the #88-B per-event-phase coup/end roll (incl. the §26.4 coup gates, e.g. Honest-Gov) must gate on `meter === floorBand`, NOT `meter <= crisisBand`** — a Crisis-band meter arms NOTHING. (This corroborates the batch-15 `terror2000` "Honest-Gov at its FLOOR" gate above from a 2nd, independent 2012 thread.) Reachable in the modern era; the per-meter floor → roll lives at the same `runPhase_2_5_1_Lingering`/event-phase tick the APOCALYPSE clock already watches. **★★ Batch-12 #134 (`tedchange#POST 397-408`, game-mechanics §11.1.y) — LINGERING 7-STEP STRICT ORDERING + TAX/TARIFF DECAY CARRY-FORWARD (M, RE-SPEC of the meter-decay/volatility surface).** Verified shipped: `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260-3377`) runs cabinet-drift-driven meter writes + per-trait modulation + national-debt update but has **NO explicit 7-step ordering and NO tax/tariff volatility-vs-decay distinction**. Ted's `tedchange#POST 397-408` rules: **(1) steps run 1→7 in strict order, NEVER re-do a prior step**; **(2) volatility roll at step 7 is THIS-phase-only** (not added to running totals); **(3) tax/tariff decay PROPAGATES FORWARD to NEXT phase's step 3** (decay continues across half-terms). Add a **`game.taxTariffDecayQueue?: { decayDelta; appliesAtPhase: 3; lifeYears }[]`** carry-forward state (`repair()` backfills `[]`) + an explicit 7-step internal ordering on the runner. **SAME surface as the APOCALYPSE meter-watcher** (Lingering is where meters get written), so build it with this row. **Folds the existing #67 Lingering bank ordering into a designer-RULED canonical 7-step.** **RULED by Ted (`tedchange#POST 397-408`; refines #67 Lingering bank ordering).** **Phase 1, NOT Phase 2.** Benefits *every* era. | K0; E18g (the debt field) | **M (was M; batch-12 #134 adds the step-discipline + carry-forward queue inside the same row — same tick site, marginal incremental cost)** | gap #50 (`modern`) + #67 (`hd` I-12; **★ batch-12 RULED as canonical 7-step + carry-forward, `tedchange#POST 397-408` — #67 closes as a designer-ruled refinement**) + #80 ±3 (`drums` POST 4574) + #88 / divergence #14 (`pop` 542, 548) + **#98 enumerated game-over set (`rep1800` §C 7274)** + **★★ #88 FIRST PROVEN game-over — HonestGov-floor Autocratic Coup fired LIVE at ~20%/phase + ENDED the game (`terror2000` POST 827/829, 788-824)** + **★★ #134 Lingering 7-step strict ordering + tax/tariff carry-forward (`tedchange#POST 397-408`)** + **★★ batch-23 #88 FLOOR-PREDICATE SHARPENING — the apocalypse/coup endgame gates on `meter === floorBand`, NOT `meter <= crisisBand`; Planet's-Health/Rev/Budget hit "Crisis" with NO clock + NO roll firing (`pop2012b#POST 632`; 2nd-source corroboration of `terror2000`'s HonestGov-FLOOR gate; game-mechanics §26.4, debt #28/#32)** + **★★ batch-24 #176 — the FOUNDING-ERA MilPrep tier/prerequisite ordering is mis-wired (MilPrep 3-4 gated behind the federalism-era Militia Act ~1792 while the auto-forced 1774 Continental Army/Navy bills sit at higher tiers) → founding MilPrep hard-capped at ~2 + permanent founding military crisis; this row's per-tier meter-prerequisite + policy-gated-cap model must let the forced founding war bills MOVE MilPrep (cap ~4-5 pre-federalism), surfacing the prereqs/caps in-UI; an authoring constraint built WITH E1, designer-gated open Q (`grass1772#POST 86-90, 121` + `rookie1772#POST 26, 32-33`; game-mechanics §17.4, debt #56) + #67/#134 Lingering-too-complex-to-hand-run 2nd-source (`rookie1772#POST 1370` "Lingering… never run before")** — CARRIED + EXTENDED + designer-RULED, HI-CONF (4 era + native modern + designer + 2nd-source floor predicate + founding meter-prereq constraint) | ready |
| **E4c** | **[early-republic, batch 11 — NEW small epic] Jacksonian Bank-War → Independent-Treasury long-run ECONOMIC content state machine (#116)** *(placed here, AFTER E2 + E6 + E4b(b), per its dependency chain — it is the early-republic ECONOMIC content that sits on top of E4b(b)'s Second-Bank institution)* | **The long-run content STATE MACHINE that sits ON TOP of E4b(b)'s §27.6 Second-Bank institution** — the Era-of-Democracy → Manifest-Destiny economic arc the `arkzag` full run plays out. **Build it EMERGENT, not scripted (tech-lead's binding call):** the Bank/Independent-Treasury arc is a chain of recurring **CRISIS bills** that RESOLVE an EconStab **CRISIS** state (E6) and REPLACE each other, NOT a hand-scripted timeline. Concretely, three additive mechanics: **(1) a `Bill.replaces?` field on `Legislation`** (`types.ts:1506`, none today) so a CRISIS bill can *supersede* the institution a prior CRISIS bill created — the canonical instance is **"Create a non-partisan independent treasury" REPLACING "Establish Bank of the United States"** under Pres Dudley c.1840 (`arkzag` ch33 POST 106: literal Bank→1840-Independent-Treasury arc); the Bank itself is the recurring CRISIS bill that is filibustered (the Puritan ≥2-legis rule, E14c/#10), returns next session, eventually passes (ch11/ch20); **(2) a per-bill-class `lockedUntilYear?` tariff COOLDOWN** — dueling 10%/40% tariff bills gated by a tariff-rate-change cadence ("can't change tariff rates until 1836", ch24 POST 928); a near-literal **FORCE BILL** ("Expand Presidential Power to Force States to Comply with Federal Revenue Laws", ch24) rides the same crisis-bill path; **(3) the Panic-of-1837 EconStab CRISIS as a multi-half-term meter state** (E6) with meter-crater catch-up Anytime-Evos ("Economic Collapse" at EconStab 3, #11) — armed/retired by EconStab thresholds, the bills above resolve it. Verified UNBUILT: `applyEffect` (`phaseRunners.ts:3209`) **only nudges the 7 named meters** (no Bank/tariff/treasury tokens anywhere in `src/`); `Legislation` (`types.ts:1506`) has **no `type` / `replaces` / `lockedUntilYear`** field. **Distinct from #3** (the static tariff/currency *axes* at E18d) — this is the *played event/bill arc*. **DESIGN NOTE (carry, not a blocker): "scripted-vs-emergent."** The arc *reads* historical (Bank → Panic → Independent Treasury) but the tech-lead's call is to build it as **emergent recurring CRISIS bills + a `replaces` graph + a tariff cooldown**, so the same machinery yields the arc without a bespoke 1820s timeline; revisit only if emergent play diverges unacceptably from the historical shape. **★★ BATCH-18 (`ideo1928`) — E4c is now WELL-SPECIFIED ACROSS TWO ERAS, gaining the INTERWAR LAYER (#160 + DH-67, M as an E4c extension; the headline this batch).** The 1930s Great Depression is the SECOND era to want the SAME `game.economy` machine (after this row's 1820s Panic-of-1837 / Bank-War core) — so **build E4c GENERIC, add the interwar content as DATA; do NOT special-case a second economic engine.** NET-NEW over the `arkzag` core above: **(i) a Great-Depression META-event** = ONE era-event row (binding at `runPhase_2_4_3_Era` `phaseRunners.ts:2796`) carrying a multi-meter shock bundle `{economic:−4, revenue:−2, quality:−1, military:−1, partyPref:−3}` + an (a)-markets-resolve / (b)-welfare-bailout presidential decider (the −4 EXCEEDS the §21.8 ±3 swing cap — flag it as a meta-event override); **(ii) the EconStab→Recession CASCADE** = 2 random industries −1 in EVERY state (seeded RNG, not `Math.random`) → an EV-reflow roll (couples to §11.5 industry-leadership + §28.9 census/EV) + a DomStab-drop chance + **EconStab-in-Recession gates other meters' gains**; **(iii) crisis-GATED bills** = a `Bill.requiresCrisis: 'economic'` flag (Fed-currency-in-crisis / worker-bailout New-Deal bills INVALID until the crash fires — reuses E2's crisis-bypass primitive, the same surface this row already extends); **(iv) ★ DH-67 — EVENT-GATE the era's BLUE party-modifier bias to the crash having fired** (read a `game.crashFired`-style flag at the `partyPref*5` term in `calcStateVote` `phaseRunners.ts:3709-3711`, NOT a static era-band constant — **the highest-value single fix in batch 18: the switch that makes the meta-event load-bearing instead of cosmetic-on-top-of-a-static-band**; S, build it WITH the meta-event); plus **(v)** the **per-faction industry-impact AUTO-TALLY (#166)** (the build OWNS the "how many of my gov/sen/rep per lead-industry" count — manual = GM-burnout, DH-36) + **per-era meter-table VERSIONING** + **audited event effect-signs with an `auto|roll` flag (#165, the SAME fix as DH-53 extended to events)**. **Verified UNBUILT (batch 18):** `Era` still 4-value (`types.ts:1337`, no `progressive`); the only economy token is generic `meters.economic` (`types.ts:1401`) whose UI strings already include `'Depression'…'Recession'…'Roaring'` (`Meter.tsx:15`) as COSMETIC labels; grep `economicStability|greatDepression|requiresCrisis` across `src/` = ZERO. **Open Q (human-gated TUNING, not a blocker):** keep the crash a one-shot meter shock (current paper, recovered in ~4 yrs via ordinary bills) or apply a persistent drag ordinary bills can't quickly undo? game-mechanics §29.7.1 + §30.9. | **E2** (`Bill.type` + crisis-bypass — extend it with `replaces?` + `lockedUntilYear?` + **`requiresCrisis?`**), **E6** (named EconStab meter + crisis/cascade — **the batch-18 EconStab→industry cascade + meter-gain gating live here**), **E4b(b)** (the §27.6 Second-Bank institution this recharters/replaces); E13 (the Bank-War exec-action lives at E4b(b)); E14c (filibuster, for the recurring-Bank-bill loop) | **M (was S — batch-18 interwar layer: meta-event+decider S; cascade M; crisis-gate flag reuses E2's #2 primitive; DH-67 S)** | gap **#116 (`arkzag` ch11 POST 26, ch20 POST 344, ch24 POST 906/928/960, ch33 POST 20/106; EconStab crisis ch17 POST 402, ch19 POST 2005, ch27)** + #11 crisis bills + #3 tariff axes + **★★ #160 interwar economic engine — Great-Depression META-event + EconStab→industry cascade + crisis-gated New-Deal bills (`ideo1928` ch18, game-mechanics §29.7.1) + DH-67 crash-gated party-modifier (`ideo1928` Umbrella POST 545, ch18 POST 8) + #166 industry-impact tally + #165 event effect-sign/`auto|roll`** — NEW + EXTENDED (E4c now 2-era-specified: `arkzag` Bank War + `ideo1928` Depression) | ready (**#116 1820s core ready; #160 interwar layer + DH-67 build on top, M**) |
| E7 | **Persist + auto-fill House slates & committees [NEAR-TERM — scaling wall b]** | Store a faction's House candidate slate + committee rosters on the snapshot; **carry-forward + bulk auto-fill by default**. The "computer owns the deterministic tedium" theme. **A UX wall, not modern-only** — improves 1856's 31-state congress now; a human **quit** over the manual tedium at 53-state scale. Do **before** the deep-modern roster (E26). **CPU committee-staffing heuristics partially driven by K5 handlers (§25.5-adjacent).** **★ Batch-10 — the slate this persists is FOCUS-REPS, not full per-seat delegations** (#55, vcczar POST 704): the `(EV−2)/5` focus-Rep abstraction (built at E28) is what makes the House slate tractable to carry-forward + auto-fill at 53-state scale — pair the persistence shape with the focus-Rep unit so wall (b) and the focus-Rep abstraction land together. | `repair()` backfill for the new fields | M | gap A9, debt #20 (`modern`; also `1772s` Lingering/Committees) + **#55 focus-Rep unit (`dem1820` POST 704)** — CARRIED + EXTENDED | ready |
| E8 | **Procedural pol generation [NEAR-TERM — scaling wall a]** | A **runtime, seeded** generator (lives in `src/engine/`, uses `rng.ts`) emitting `ImportedDraftee` rows when the real ~18.5k dataset is dry; reuses `instantiateDraftees` (`phaseRunners.ts:114`). Stat/ideology/trait/demographic distribution (GM wanted "some moderates") + a **plausible, ethnically-varied, toggleable name engine**. **Required for ANY late-era play** AND fixes sparse-state filler (#43) AND BUG-3's stopgap officer. **The bridge to the portrait epic (P2)** — shares the demographic model with P2. **★★ Batch-22 — this generator OWNS the modern→future content boundary, now LIVE-corroborated.** `modernday` crosses the 2024 "Era of Populism"→"Near Future" boundary, and at that boundary the **dataset is exhausted — the draft becomes "basically all generated pols"** (`modernday#POST 1902/1909`). This pins that the **modern→future content boundary is exactly where the dataset exhausts into pure generation** (corroborating the batch-15 `terror2000` 2000-start, where era-gated content + earn-it-forward framing already pointed here). So E8 is not only "late-era filler" — it is the **REQUIRED generator the moment a campaign crosses past the dataset's coverage** (the same boundary #68/#2 banks at and #171 flips OFF at). The #173 New-Game presets (the 1972/2000/2012 + future openings) all eventually pull from this generator once the historical classes run dry. No scope change — a confidence bump on the existing M–L generator (debt #19, scaling-wall (a)). | K0 (seeded RNG) | M–L | gap #43, A1, debt #19 (`modern`; `fed`) + **★★ batch-22 modern→future dataset-exhaustion LIVE-corroborated (`modernday#POST 1902/1909` — "basically all generated pols" past the 2024 boundary; + the batch-15 `terror2000` 2000-start)** + **★ batch-23 #90/#43 CAREER-TRACK STARVATION live again — the thin 2013 post-boot draft surfaces procedural-pol-gen as career-track starvation (2nd corroboration of the DUAL procedural-gen gates: dataset-exhaustion AND post-boot career-track sparsity both demand the generator; `pop2012b`)** — CARRIED + CORROBORATED, HI-CONF (now live-confirmed at the future boundary + 2nd-source career-track starvation) | ready |
| **E9** | **CPU handler suite (batch 5 epic; batch 6 adds conditional-vote-rules primitive) — 15 lightweight PRs once K5 lands** | The §25 CPU spec wired against K5's scaffold. **Each handler is one PR** (50-200 lines of pure decision code, heuristic verbatim from §25). **Parallelizable** — once K5 lands, multiple handlers can land concurrently across contributors. **Order inside the epic is §6.6.1's handler-order table** (cheapest first; architectural-gap handlers later once the persistent state is exercised). Each handler reads the existing snapshot + a small `ctx` payload and returns the decision; the consuming runner replaces its inline stub with one `controller.decideFor(…)` call. **★ Batch-13 (`oopscpu`) DE-RISKS this epic — NO re-order, NO new handlers.** The Ted-run all-CPU 1788 stress-test field-validated SIX handler specs before they're built: **#70 (9c) / #72 (9a+9m) / #73 (9d) / #74 (9b) / #75 (9g) / #76 (9f)** are now "spec-complete + field-validated with concrete failure modes + Ted's fixes" — a **build-confidence bump per handler PR** (lower spec-risk), tagged inline below. **The OC-1…OC-8 sub-gaps FOLD INTO the relevant handler rows as sub-rules** (NOT new rows): OC-3→9b (★balance-critical), OC-2→9c, OC-1+OC-5→9d, OC-6→the kingmaker handler. **9e (convention) is the ONE handler NOT validated** — 1788 predates conventions → it stays `drums`-spec-only at LOWER confidence; **a post-12A all-CPU run is needed to validate it** (the all-CPU-test methodology, Sequencing notes). The all-CPU run also **resolves #52 for the all-CPU case** (CPU SCOTUS by ideology-distance; player-vs-CPU stays user-gated). **15 handlers, in this order:** **(9a) Candidate selection 75/25 + minor + open-seat** (§25.1 / #72) — cheapest; **★ batch-13 field-validated + SHARPENED (`oopscpu#POST 192-194, 197, 294`): add the pre-12A nomination trio** — (i) incumbent Pres re-nominates incumbent VP if eligible (the **VP-retention** rule, paired into 9m), (ii) nominate an alternate when none exists (anti-throwaway-vote-tie), (iii) own-faction priority + the same-state-EV exclusion (two same-state candidates can't both take a state's EVs); no-primary-incumbent corroborated; **(9b) Legislation NAY/AYE/NAY 3-step + conditional-vote-rules consumption (batch 6 addition, `pop` POST 1111)** (§25.6 / #74) — pairs with `Bill.type` (E2); **handler #2 consults `Faction.factionLeader.compelledVoteRule?: Predicate → Vote` BEFORE the §25.6 NAY/AYE heuristic** (Iron-Fist controllers publish declarative predicate → {AYE/NAY} policies, e.g. "Sen Maj Leader NAYs any nominee with Admin<3 unless faction holds Integrity"); **★★ batch-13 field-validated + the HIGHEST-PRIORITY, ★ BALANCE-CRITICAL sub-rule inside 9b is OC-3 (`oopscpu#POST 162-180`): a crisis-vote ideology-floor gate + secession/slavery-active check.** The all-CPU 1788 run abolished slavery PEACEFULLY by 1792 (no secession, no divisiveness) because every faction — incl. Southern — AYEd the Abolish-Slavery CRISIS bill on crisis-priority grounds (3.0.30 is "more lenient on crisis support for the majority than the opposition"; the rules "don't mention how CPUs vote on crisis if it hurts them"). Add **(i) an ideology-floor gate** — down-weight or floor-to-NAY the crisis-priority boost when the bill costs the faction's OWN ideology/lobby cards (so a CPU won't betray its own cards) — and **(ii) a secession/slavery-active check** that fires BEFORE an Abolish-Slavery crisis bill resolves (the CSA trigger needs slavery active; abolition currently never trips it). **S** (two predicates on the handler the epic already builds; the exact weighting is a design dial). Also corroborated: theme-blindness (point-math not theme — signed a Fugitive-Slave-Act then took Don't-Enforce because point-math helped an ally, `oopscpu#POST 95-96`, same class as DH-21); duplicate-bill resolution by point order (`#POST 282`); the Free-Executive carry-pool live (`#POST 154, 278`); era-gated law-unlocked filibuster (`#POST 90-92, 284`, #146f); **(9c) Leadership IRV bloc-vote + 3-ballot collective endorse** (§25.3 / #70) — most-corroborated; **★ batch-13 field-validated end-to-end across multiple founding-era Speaker/PPT/Party-Leader cycles (`oopscpu#POST 42, 115, 56-57, 329, 332`): the IRV ladder + faction bloc-vote + ties broken by the Party-Leader's backed candidate.** **OC-2 (`oopscpu#POST 151`) is the marquee collision bug folded in here:** closest-ideology leadership can hand chairs to the MINORITY party (all Senate chairs went BLUE while Red held 73%), then the "≥60%-chamber → may propose" gate read chamber control differently → minority chairs proposed under the majority's threshold. **Fix: ONE canonical `chamberControl(snap, chamber)` helper** shared by BOTH leadership-select AND the proposer gate — consolidate the inline `senateMajority`/`houseMajority` duplication at `phaseRunners.ts:1863-1864`. **S** (one helper + two call-site migrations); **(9d) Cabinet selection + Senate confirmation + conditional-vote-rules consumption (batch 6, `pop` POST 1111)** (§25.5 / DH-23 / #73) — **lands the 36% bug fix; replaces the one-step pick at `phaseRunners.ts:2158-2223` with a 2-step pick→Senate-vote**; **★★ batch-18 the FRONT GATE of that 2-step is the CONFIRMATION AUTO-PASS rule (`ideo1928#POST 213-214`, Ted-authoritative): auto-confirm EXCEPT {State/Treasury/AG/Defense}/Controversial/<3-relevant-skill (unless Integrity), Iron-Fist Maj-Leader can force a vote on any — so MOST picks NEVER REACH the Senate vote (this is the actual §25.5 36%-pass fix, paired with the E16 confirmation step);** default-AYE baseline + Iron-Fist Maj-Leader auto-AYE-own-picks (via the `compelledVoteRule?` primitive) + lobby-maximizer Admin-weighting + the **batch-6 SCOTUS within-1-step auto-AYE declarative rule** (§26.6.1) + Manipulative-Pres compel-retire as a distinct trait-power; **★ batch-13 field-validated: the crisis cabinet-fill LADDER (`oopscpu#POST 322`)** — highest-Admin first → eligible refuses → 3-Admin lobbies-tiebreak → next refuses → unemployed pol accepts (accept-roll); a Controversial nominee that fails committee → Pres offers a replacement (`#POST 184`). **OC-1 + OC-5 fold in here:** **OC-1 (`oopscpu#POST 65`) — scandal-resignee re-appointment cooldown:** the CPU recycles a disgraced (scandal-resigned / fired-Scandalous) pol straight onto another appointed office because it has NO scandal-smoother memory — the concrete instance of **DH-22 / §25.15.3 (handler 9l)**; reads the K5-introduced `recentScandalIds?` state + a cooldown of N phases; **OC-5 (`oopscpu#POST 184-187`) — court-as-firing loophole:** the CPU dumped its SecState + AG ONTO SCOTUS to vacate cabinet seats BEFORE the firing-precedent was set — **gate a cabinet-vacating SCOTUS appointment behind the firing-precedent rule (§21.4)**. **XS each** within 9d (OC-1 needs the scandal-cooldown persistent field); **(9e) Convention CPU (per-ballot menu + ballot-10 compromise + ballot-25 dark horse + Pineapple Primary + kingmaker-refusal list)** (§25.4 / #71) — **OWNS DH-8 (marquee unstable surface) + DH-17 (11-ballot deadlock fix: auto-drop-out after 2-3 ballots of 0 Momentum) + ballot-shift = next-round + DH-7 R/D threshold + DH-18 dark-horse resignation rolls + batch-8 #104 (guard the lone-ideology minor-candidate exploit — a single ideologically-isolated minor candidate can game the convention; the CPU handler must not be exploitable by an isolated minor, `tea1772`)**; highest-complexity handler; **★ batch-13 COVERAGE GAP — 9e is the ONE handler `oopscpu` could NOT field-validate** (1788 predates conventions; leadership IRV 9c was the only convention proxy), so it stays `drums`-spec-only at LOWER build-confidence than the other handlers. **A post-12A all-CPU run is needed to validate it** — it would exercise #71 exactly as `oopscpu` validated #70/#72/#73/#74 (see the all-CPU-test methodology note in Sequencing notes); **(9f) Conversion poach (Pliable + adjacency gating + failure-strip + multi-faction-collision tie-break)** (§25.8 / #76) — **★ batch-13 field-validated: the ideology-circle LW↔RW-Pop 25% cross-step (`oopscpu#POST 117-119, 127`)** confirms the #99 circle-adjacency conversion LIVE (rides E5b's central `ideologyDistance(a,b,circular)` helper) — 4th-thread confirmation; the disgruntled auto-flip layer + the restriction list also ran live (`#POST 40, 112, 307`). **OC-6 → the KINGMAKER handler (§25.11): highest Com+Leg+Gov tiebreak for kingmaker→protégé pairing** (`oopscpu#POST 308` — "Pius had two kingmaker-protégé possibilities; I chose by highest Com+Leg+Gov. If incorrect, we need more clarification"). The kingmaker-pairing tiebreak is an XS rule on the kingmaker-assign path consumed by 9e + the conversion/kingmaker machinery (DH-5 / QW6). **★ Batch-17 marquee Ted rulings folded in here (kingmaker/conversion machinery, `ted1772`): a ONE-PROTÉGÉ-PER-TURN CAP** (a kingmaker may take at most one new protégé per turn — an XS rate-cap on the kingmaker-assign path) **and CONVERSION-TARGET ONCE-PER-HALF-TERM** (a faction may attempt to convert/poach a given target at most once per half-term — an XS cooldown on the 9f conversion-poach path, pairs with the `CONVERSION_ODDS`/restriction-list machinery); **(9g) A/B/C event vote + president-ideology force + meter-guarding** (§25.7 / DH-21) — first handler to use the meter-impact aggregator; **★ batch-13 field-validated (`oopscpu#POST 191, 335-337`): Pliable Pres defers to cabinet majority; tie among advisors → President decides (Egghead-tiebreaker-only); a CPU president SKIPS its whole exec-action budget when no action nets points** (points-maximizing only — same theme-blindness class as DH-21); **(9h) Faction-leader replacement (4-condition removal + hard gates + stagnation-fix + positive-trait floor)** (§25.10 / #78); **(9i) Primary CPU (5-action template + frontrunner rule + better attack-targeting)** (§25.12 / #63); **(9j) Governor action picker (state-stack-aware; prunes Improve-Industry at 10/10)** (§25.15 #4 / DH-19); **(9k) Reciprocity / vote-trading enforcer** (§25.15 #1 / DH-20) — first DH-* architectural gap; reads + drains `cpuCommitments`; **(9l) Cascading-scandal smoother** (§25.15 #3 / DH-22) — era-event walker calls this to drop back-to-back at-most-once events; reads `recentScandalIds`; **(9m) VP selection (8-element rubric + retention curve)** (§25.2 / #72) — era-keyed; **★ batch-13 RULED (`oopscpu#POST 192`, #144): VP retention is now a HARD rule (at least pre-12A), NOT a curve** — an incumbent Pres ALWAYS re-nominates the incumbent VP if eligible (closes the `drums` #72 "no retention" designer-acknowledged bug; the era-keyed softening is subsumed, whether later eras soften it is open); **(9n) SCOTUS justice vote + Iron-Fist compel + 10-yr drift 25/10/5** (§25.14 / #79) — rides E23; **(9o) Faction rename trigger** (§25.13 / #40) — reads the rename-trigger predicate→name-generator registry. | **K5** scaffold + K0 (seed) + K2 (registry — handlers 9b/9d/9e/9i/9j pick from libraries); 9k/9l need the K5 persistent state; 9n rides E23 | **~15 × S–M** (each 50-200 lines) | gap #70-#78 (§25 master) + #40 #63 #79 + DH-7/8/17/18/19/20/21/22/23 + **`pop` POST 1111 (conditional-vote-rules primitive)** + **★ batch-13 FIELD-VALIDATION (`oopscpu` — 6 handlers spec-complete + OC-1…OC-8 sub-rules; #143 split out as QW17; #61 death-branch → E10b)** + **★★ batch-15 4th Ted-run / CPU-heavy corroboration (`terror2000` — a CPU-heavy 2000-start exercises the whole suite from the MODERN angle, reinforcing the load-bearing-CPU case; the convention handler 9e STILL needs a post-12A all-CPU run)** + **★ batch-17 3rd CPU-heavy / 4th-1772 re-validation (`ted1772` — a mostly-CPU 1772 angle re-validates #70 (9c) / #72 (9a+9m) / #74 (9b — Ted's cleanest 4-step crisis→faction→team→opponent articulation) / #76 (9f); the #75 CPU event-vote handler (9g) is also where #158's anti-game-over override binds; 9e convention STILL needs a post-12A all-CPU run)** + **★★ batch-24 JUSTIFICATION RAISE (no new handlers, no re-order): the two founding-era runs DIED to the manual CPU-faction sim — `grass1772` because 2 humans couldn't hand-run 8 CPU factions (`#POST 328` → fixed by ADDING humans, `#POST 348`), `rookie1772` to GM time-burnout (solo-running 10 factions = "a part time job," `#POST 36`); with `modernday`+`pop2012b` this is the 4th GM-burnout death. CONFIRMED unbuilt (grep `cpuHandler|handlerSuite|runCpuFaction` = ZERO) — E9/#114 is the load-bearing system that makes the app playable solo (one human runs ONE faction); pairs with K5 + DH-69's legal-move enumerator. RAISE priority/confidence ONLY (`grass1772`/`rookie1772`)** — CARRIED + EXTENDED + FIELD-VALIDATED (6/7 founding-era handlers; 9e convention untested), **★★ JUSTIFICATION now strongest in the corpus (4 burnout deaths)** | ready (handlers 9a/9b/9c/9d/9f/9g/9m higher-confidence; 9e drums-spec-only; **★★ batch-24: priority/confidence raised, NOT re-sequenced**) |
| E10 | **Convention machinery (2.9.2) — uses K5 handler 9e for CPU** | The **single biggest unbuilt subsystem** — replaces the `engine.ts:69` one-liner. Multi-ballot loop + momentum (carries across cycles) + unit-rule; **inter-ballot action library on K2** (Force Rules Change, Presidential Promise — *offer-DOWN/request-UP direction rule*, Drop & endorse, Kingmaker, Ballot shift); 5-plank platform + comparison (+ failed-platform <50%-planks penalty); VP-impact scorer; scandal/faithless-elector rolls; **host-advantage** + **PL-overrules-VP**; **CPU delegate engine** (per-state EV × category multiplier — shared with the Phase-2 primary). **CPU side is owned by handler 9e** — DH-8 + DH-17 + ballot-shift + DH-7 + DH-18 all firm there. **Resolve the ambiguous ballot-shift rule (next-round) + the DH-7 R/D threshold asymmetry + Iron-Fist-rules-change re-gate inside this epic.** **★ Batch-11 corroboration (#13/#111):** `arkzag` exercises multi-cycle BROKERED conventions LIVE across 1832 + 1840 — major + minor/favorite-son candidates, an Orator nominator's d6 momentum bonus, **party-asymmetric nomination thresholds** (NatRep 2/3 = 436/649 vs DemRep 50%+1 = 343/685, ch32 POST 2465-2466), **command-gated inter-ballot actions** (N command = N of: force-rules-change / presidential-PROMISE-to-a-fewer-delegate-candidate / appeal-to-credibility / drop-w-or-w/o-endorsement, ch21 POST 367/425), **presidential-promise BUYOUTS deciding the 1832 nomination** (Cheves buys Key's + Clay's endorsements with VP + Sec-State → wins ballot 2, POST 444-488), the **11-question VP-selection questionnaire** (POST 1721), and **5-plank platform scoring** (Econ/Domestic/Judicial/Foreign-mil/Pres-pledge, 3 yes/no Qs set Party Pref ±1, ch7 POST 548) — strong 2nd-campaign confirmation of #13/#111. **★ The delegate-apportionment sub-PR is GATED on the NEW delegate-class fork (Decision-gated)** — AI-allocator-by-EV-formula vs player-rigged (`arkzag` ch3 276 vs ch32 2466); the rest of the epic does NOT wait. **Split into ~3 sub-PRs** (ballot loop → inter-ballot library on K2 → platform/VP/scandal; the delegate-apportionment sub-PR waits on the fork). | K0, K2, **K5 + handler 9e**; **the delegate-apportionment sub-PR only is gated on the delegate-class fork (Decision-gated)** | L–XL (split 3) | gap #13–#19 (`gilded`/`fed`/`modern`; `hd` 3261-4726, 5594-5713; **`drums` §25.4 — the richest decoded subsystem**; **`arkzag` brokered conventions live 1832/1840 — ch3 276, ch21 367/425, ch32 2465-2466, POST 444-488/548/1721**; **★★ `gild1868 (b14)` corroborates #13 (convention delegate-apportionment verbatim engine), #14 (5-plank platform incl. a Presidential-Action plank), #15 (9-item VP rubric) from a native-1868 start**) + #111 + DH-7 + DH-8 + DH-17 + DH-18 + **★ batch-23 #15 VP-RUBRIC CLARIFICATION (no new build) — the rubric is "+1 if at least one ticket member is YOUNGER than 60" (and +1 if one is OLDER than 50); there is NO "+1 for OLDER than 60" (a GA mis-scored it, MrPotatoTed corrected it LIVE + re-scored); row 7's independent/outsider check reads a DISCRETE `canBeIndependent` pol TAG (Ron Paul lacks it despite a 1988 third-party run), NOT inferred from office status — the canonical §15.3.4/§25.2.1 tables were already right; pin the authority (MrPotatoTed, `pop2012b`)** + **★ batch-23 2nd-source 2012-boot corroboration of #13/#15 (primary→convention→VP-rubric, `pop2012b`)** — CARRIED + EXTENDED, HI-CONF (7 era + native Gilded + 2nd-source 2012-boot) | ready |
| **E10b** | **Succession / eligibility / acting-president (#61) + contingent House election (#62) [1856-arc election additions]** | Two coupled election-system additions surfaced by `hd`. **(1) Succession/eligibility (#61):** `Politician.bornForeign?: boolean` gating the presidency (and convention Major candidacy); a **configurable, legislatable line of succession** (`successionOrder?: OfficeType[]`); an **`actingPresident?` state whose `command` (often 0) gates exec actions / SCOTUS-compel / re-election eligibility** (a 0-Command acting president is inert); era-gate the VP-vacancy-fill on the amendment (E5). **★ Batch-11 (#61) — the VP-succeeds / acting-divert SUCCESSION ENGINE is now ready-to-build, and the KILL TRIGGER already SHIPS.** `arkzag` corroborates the whole chain end-to-end from a 2nd campaign — President Cheves is **ASSASSINATED** (ch27 POST 276), **VP Enoch Lincoln succeeds "in accordance with the 13th Amendment"** and must then **nominate a new VP** (gated on E5's VP-vacancy amendment being `active`), and the **acting-president state fires**: on first assuming office the successor rolls whether to **refuse to act**, and because Lincoln has **Easily Overwhelmed the VP performs presidential actions in his stead ~50% of the time** (ch27 POST 441/454) — an **action-divert roll + a trait-acquisition side-effect** (vcczar: "first presidential assassination this run", POST 339). **Crucially the kill trigger is NOT the work — it already SHIPS:** the `assassination-killed` anytime event (`anytimeEvents.ts:232`) fires `{kind:'death'}`, and a death sets `presidentId = null` via `vacateOffice` (`phaseRunners.ts:2449`). So the **ready-to-build path is the succession ENGINE**: VP-succeeds-on-death → fill-VP (E5-gated) → acting-president action-divert roll + trait side-effect. **★★ Batch-13 (#61 death-branch, Ted-RULED `oopscpu#POST 324-329`) RECONCILES + SUPERSEDES the death case of the batch-11 `arkzag` read (S):** a Presidential **DEATH** → the VP becomes a **FULL President** (REFUSES "Acting" — **no action-divert roll** on a clean death), is **NOT auto party/faction leader** → the party **RE-RUNS the leadership IRV** (handler 9c → handler 9h picks the new PL). This SUPERSEDES the batch-11 "acting/action-divert" read **for the death case only**; the **`arkzag` acting-president + action-divert state is RETAINED ONLY for the INCAPACITY branch** (0-Command / ineligible-substitute / refuse-to-act). Binds at `vacateOffice`/the death path (`phaseRunners.ts:2446`) + the leadership runner (`:1844`). **S within E10b** (already re-scoped batch 11 for the kill→succeed→fill chain; `oopscpu` supplies the reconciled death-branch spec). **The line-of-succession / impeachment HALF stays parking-lot (DH-54)** — the configurable legislatable succession order (`successionOrder?`) past the VP, and the impeachment ruleset, still need a written spec first. **Batch-8 (#105) — stat-collapse → forced presidential resignation, a one-rule addition here:** a sitting President whose `command` + "most" skills hit a floor is **forced to resign** (`tea1772`) → triggers the succession line above. A small rule that lives NEAR the rest of the succession work, no new subsystem. **★ Batch-9 (DH-54) — the impeachment + VP-vacancy-fill + succession RULESET was NEVER in the rules doc** (`nuke` §28.5: no impeachment trigger — a Watergate-analog went undetected → pure upside — and VP-vacancy fill was "made up as we go"; corroborates `rep1800` DH-33 + `hd` across a THIRD campaign). **The impeachment/succession ruleset is AUTHOR-BEFORE-BUILD (parking lot):** the configurable line of succession + the acting-president gate + the VP-vacancy amendment hook all need a written ruleset before this row + the modern institutional layer (E29) are built. Pairs with #105. **(2) Contingent election (#62):** on no EC majority, a House contingent path — **1-vote-per-state by delegation majority, Governor-party tiebreak; Senate elects VP** — with a **configurable `contingentTopN: 2\|3` cutoff (DH-6: GM used top-2) + the tied-chamber inverse-control rule**. Slots into the same EC tally code as E4. **Folds DH-3** (career-track presidential bar — landed early as QW5, enforced here in the candidate pool). **⚠ Build is GATED on parking-lot resolution of divergence #10 / #84 — contingent-election rules don't exist** (`drums` POSTS 472-474: GM invented 5 rulesets mid-thread — top-2 vs top-3, outgoing-vs-incoming Congress, deadlock side-effects). Author the rules first, then build. **★★ Batch-19 (#167 no-eligible-successor constitutional-crisis, `fixes2022#POST 841-882`, M full / S PPT-interim) — this row IS the E10b CRISIS FAMILY; #167 is its no-successor member.** When the WHOLE succession line is empty (empty `vicePresidentId` `types.ts:1568` + no installed third-in-line) a NEW `game.successionCrisis` flow fires at the SAME `vacateOffice` vacancy site as #61 (`phaseRunners.ts:2446-2449`, which today just nulls `presidentId` with NO successor path — verified UNBUILT: zero `successionCrisis|actingPresident|coup` in `src/`): (i) an **emergency-Congress agenda-locked-to-succession-laws** vote loop (random-FL proposer, CPU auto-support, **auto-signed/un-vetoable**, loops until pass); (ii) a **House 1-vote-per-state acting-President election** between the two party leaders (ineligibility→highest-PV-eligible-FL cascade; CPU party-line except Integrity→incumbent-party, Can-Be-Independent→closest-ideology; tied state abstains; state-count tie → SCOTUS/game-over) — **★ this is the SAME 1-vote-per-state delegation machinery as #62's contingent House election (above): build #62 ONCE, reuse for both**; (iii) a **DomStab penalty scaled 0/−1/−2/−3** by outcome legitimacy; (iv) a **coup branch** (Controversial+LW/RW-Pop OR Military Leader → 3.0.2 coup rules → possible game-over, the SAME end-condition family as #88/debt #28). **★ SHIPPABLE-FIRST: ship the PPT-as-acting-President interim default FIRST (S)** — the Senate President Pro Tempore becomes acting President then resigns from Congress (`fixes2022#POST 849-850`, the designer's simpler version) — **then layer the full House-election procedure (M).** **Couples #61 (normal/line-exhausted fallback) + #88/debt #28 (anti-game-over CPU bias) + DH-54/DH-33/DH-66 (impeachment sibling) into ONE E10b crisis family.** Open edges (tuning inside E10b, NOT new gates): ineligible chosen leader; new-vs-old PPT after a 3rd-in-line bill; special-election-vs-House-choice default. | E10 (convention/EC work), E5 (VP-vacancy amendment); **#62 (build the 1-vote-per-state delegation machinery ONCE — reused by #167 Step ii)**; **#10/#84 + DH-6** must be authored first (parking lot) | M (**+ #167 M full / S PPT-interim**) | gap #61 (`hd` I-6) + #62 (`hd` I-7) + DH-6 + DH-3 + #84 (`drums` 472-474, 810, 4467-4475, 5176, 5217-5221, 5250) + **#105 stat-collapse forced resignation (`tea1772`)** + **#61 legislatable line-of-succession 2nd corroboration (`dem1820` — Speaker→3rd-in-line by legislation)** + **#61 VP-succeeds/acting-divert engine + kill-trigger-already-ships (`arkzag` ch27 POST 276/339/441/454; `anytimeEvents.ts:232`, `phaseRunners.ts:2449`)** + **★★ #61 death-branch RECONCILED (`oopscpu#POST 324-329` Ted-RULED: death = FULL President, no acting/divert, re-run leadership IRV; SUPERSEDES `arkzag` for the death case; acting/divert retained for incapacity only)** + **★ batch-17 marquee Ted ruling: pre-12A VP = most-EV RUNNER-UP (sharpens DH-62's two-vote/no-ticket EC mode in E1/E4; `ted1772`)** + **★★ batch-19 #167 no-eligible-successor constitutional-crisis — the E10b crisis-family no-successor member; reuses #62; PPT-interim-first; couples #61/#88/DH-54 (`fixes2022#POST 841-882, 849-850`; game-mechanics §24.1.2)** — CARRIED + EXTENDED + RECONCILED, HI-CONF (4 era + 4th-1772 + earliest-discussion) | **needs-design** (#10/#84 contingent; DH-54 line-of-succession/impeachment); **VP-succeeds/death-branch path + #167 PPT-interim default + the rest ready** |
| E11 | **Governor's actions library (2.5.2) — state-stack-aware via K5 handler 9j** | ~14 named, era-flavored actions on the registry; d100 vs 20·governing (Efficient → +1 action; **skill-match doubles success; 5-Gov autopass; success → 10% +1 Command except autopass; Gov incumbency decay after 8/12 yrs** — `hd`); per-action prereqs incl. **ideology gate** + **Honest-Gov't gate** + state-status; reads/writes `State.policies`; **small/large-state action-impact multiplier (×0.5/×2 — DH-15, needs design)**. Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Era row-sets via the per-era registry index (modern adds primary-control + voter-suppression + culture; `hd` adds "Activate State Primaries" #63; `drums` adds High-Tech industry actions #81 + faction-archetype CPU mapping — wired via handler 9j). **Batch 7 (DH-35): era-gate the row-sets with enough EARLY-era agency** — `rep1800` flags the pre-primary eras as "a bore" (governing dull, only flavor tours), so the early-republic band needs a real gov-action menu, not a thin one. | K1, K2, **K5 + handler 9j**; DH-15 from parking lot for multiplier | M | gap #20 (`gilded`/`fed`/`1772s`/`modern`; `hd` 2936-6997; `drums` archetype mapping + DH-19) + #81 + **DH-35 (`rep1800` §A 2756-2760)** — CARRIED + EXTENDED, HI-CONF (6 era) | ready |
| E12 | **Diplomacy actions library (2.7.1) — ★ batch-9: THE real modern/Cold-War foreign subsystem** | Increase Relations / Increase Trade / Extend Credit (adds debt) / Provoke (war-trigger) with success/blunder rolls, on the registry. Seed per-power roster on `GameState.diplomacy` (shape already right — `Record<string,number>`, `types.ts:1574`): era-dependent (5 federalism; +China gilded, Prussia→Germany 1871; **8 modern** +Japan/Israel). **Cap "Extend Credit to all nations" — DH-4** (a diminishing-returns / cap rule against the near-auto-win stacked bonus). **★ Batch-9 (§9.1.8 / §28.3) — this is the diplomacy subsystem the "Cold War" label hides, and `nuke` makes the 1948 action set canonical:** **8 per-nation relation meters** (9-point Hostile→Allies; UK/France/Spain/Germany/USSR/China/Japan/Israel) + ambassador actions (Sec-State suggests, Pres approves, **one per ambassador per phase**) + a **Provoke** action (retaliatory tariff/embargo, 1–2% war chance). Build-holes to own: **DH-46 — add DOWNWARD PRESSURE on the meters** (today the US ends up allied with everyone) + a **Cold-War ≤Neutral cap on USSR/China**; **DH-45 — fix the USSR-collapse trigger chain** (it stalls at a ~5% gate → re-tune so it can fire). **★ Batch-11 (DH-59, XS) — clamp the per-nation relations floor when the 9-point scale is built (NO standalone patch).** `arkzag` caught a relations meter under-flowing its documented minimum — "Japan: 1 → 0 (↓ -1) # Error, should be 1 minimum" (ch9 POST 1259) — a decrement allowed to fall below the floor. Today the shipped `applyEffect` already clamps relations to −5..5 (`phaseRunners.ts:3223`), but the documented design is the **9-point Hostile→Allies** scale above, so the floor changes when this row replaces the −5..5 model — **fold the corrected per-nation floor/ceiling clamp into the 9-point-scale build, not as a separate fix.** Couples to the national-surplus integer (Extend Credit / Take a Loan adds debt, gated on Rev/Budget — E18g). **★★ Batch-18 (#162, `ideo1928`) — the per-era NATION ROSTER is now confirmed from a THIRD era (interwar), reinforcing the "era-keyed nation list" requirement: build the roster as 5→6→7→8 by era.** The 1928 interwar roster is **7 nations — UK, France, Spain, Germany, Russia/Soviet Union, China, Japan — with NO Israel yet** (era-dependent; Japan in by 1928, Israel only at the modern boundary), each with a per-nation relation meter + a cabinet-level Ambassador. Verified shipped-state: `'Ambassador'` is ONLY a cabinet `Office` seat type (`types.ts:1134`) — there is NO `foreignRelations` / nation-roster state, so the era-keyed roster is genuinely net-new on this row (the `GameState.diplomacy` `Record<string,number>` shape at `types.ts:1574` is right, but unpopulated by era). **★ The #56-NEGATIVE result is a SCOPING NOTE, not a build item:** the "Republicanism vs Fascism vs Communism" / looming-WWII framing in `ideo1928` is event-text FLAVOR, NOT a mechanic, and the WWII tension did NOT trigger the war engine (#56) in the captured span — so this batch corroborates DIPLOMACY but does NOT exercise the war engine. | K2 | M | gap #25b, #26 (`gilded`/`fed`/`modern`) + **#107 the diplomacy subsystem + DH-45/DH-46 (`nuke` §28.3)** + **DH-59 relations under-floor clamp (`arkzag` ch9 1259; `phaseRunners.ts:3223`)** + DH-4 (`hd` 7346) + **★★ #162 era-keyed nation roster — 7-nation 1928 interwar list (no Israel yet) + per-nation Ambassador; the #56-negative (ideology framing ≠ war trigger) is a scoping note (`ideo1928`, game-mechanics §13.3.1/§24.7)** — CARRIED + EXTENDED, HI-CONF (4 era + interwar roster) | ready |
| E13 | **Executive actions library (2.8.1)** | N actions/half-term on the registry (N varies by traits; `Easily Overwhelmed` → VP hand-off; control-handoff chain Incompetent-Pres → VP → Manipulative advisor, open multi-manipulator tie-break). Persistent `GameState.activeExecutiveActions` with green/yellow expiry; **auto-deactivate sweep on admin change** (2.9.4); per-action policy/govt-type gating + blunder rolls. Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. **Encode the DH-10 `blunderStillScores?` per-action flag** (a blundered implementation scores + moves meters "as if it succeeded" unless an action overrides) **and apply the DH-9 canonical ability-stat** decided at K2. **Batch 7 (DH-35): the row-set is era-gated and the early-republic band needs enough agency** beyond "flavor tours" (the "this era is a bore" complaint) — the Bank-War "Remove Deposits → State Banks" exec-action (E4b) is one such early-era action that lives here. | K2; admin-change hook; DH-9 (from K2) | M | gap #23, #23b (`gilded`/`fed`/`modern`) + DH-10 (`hd` 8649-8672) + **DH-35 (`rep1800` §A 2756-2760, 3110)** — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E14 | **Legislative micro-mechanics (incl. investigation committees #54 — READY) + veto override 2/3 (#82) + midterm meter+enthusiasm (#83)** | Sub-PRs on 2.6.1–2.6.3: (a) committee block-and-replace (chair may replace only a bill whose proposer has LESS Legislative AND lacks Efficient — `hd`); (b) bill packaging (won't-bundle-net-negative-unless-statehood; no split-vote; **batch-8 DH-40: package the establish-SCOTUS bill WITH its justice-count bill so a passed-court-but-failed-count cannot STALL the game** — the packaging half of the DH-40 stall fix, paired with the E25 SCOTUS-establish guard; XS-S); **★★ Batch-23 #174 (`pop2012b#POST 724` verbatim — the FULLEST committee bill-packaging spec captured anywhere in the KB; S–M; THIS IS the "E14b" committee/bill-packaging epic — sub-PRs (a)+(b) above; game-mechanics §12.5.1, debt #54):** add, ON TOP of the still-unbuilt (a) chair-block + (b) chair-package levers, the OPPOSING-side **ranking-member un-package/repackage COUNTER-mechanic** (5 trait gates — Efficient+crisis-trait / higher-Legislative / Manipulative-vs-Pliable-or-Predictable / Iron-Fist-vs-Passive / Magician-equal-Legislative) + **two chair-add-bill powers** (5 Legis+Efficient → add an off-committee TAX bill; 5 Legis+Magician → add ONE off-topic bill) + the **cross-chamber/cross-committee package GUARDS** + the **Puritan committee-voting rule** (self-ideology abstention — reuses the §22.7/§25.6 Puritan-abstain primitive). Verified UNBUILT (grep `rankingMember|packageOf|chairBlock` in `src/` = ZERO; the committee runner `runPhase_2_6_2_Committee` `phaseRunners.ts:3463-3496` reads ONLY the chair `committeeChairs[bill.committee]` `:3476`; state is chair-only `types.ts:1583`). **The chair lever (a/b) and the ranking-member lever are TWO distinct opposing-side levers at two pipeline points — build them in ONE E14b pass, chair-side FIRST.** Needs a **ranking-member field on `committeeChairs`** (or a parallel `committeeRanking` map) + a **`Bill.packageOf?: BillId[]`** package structure; binds at `phaseRunners.ts:3463`. **★ Open Q (designer-gated, BEFORE building): cross-check the 5 ranking-member gates + the 2 chair-add powers vs. `tedchange`** (the official rules-doc channel — this is the fullest packaging spec but is sourced from a SINGLE thread). **A SINGLE-thread spec — ★ cross-check vs `tedchange` first.** (c) filibuster (a **standing rule toggled ON by a law**; Disharmonious filibusters twice; filibustered bills carry + must re-pass BOTH chambers; **no Cloture until the Cloture bill passes**, ⅔ — `hd`; **★★ this is the cloture surface E14c owns + the batch-22 #172 ERA-KEYED NUCLEAR-OPTION default layers on TOP of — the `GameState.nuclearOption:{cabinet,scotus}` boot flag sets the era-keyed CONFIRMATION threshold (Cabinet 50%+1 / SCOTUS 60% for 2016) and BUILDS WITH E16's confirmation step; do NOT re-litigate the batch-9 60%-then-majority decision — `modernday#POST 422-423`, debt #50, game-mechanics §9.3.10**); (d) `(Crisis)` tag + `Legislation.resolvesCrisis?` + `GameState.activeCrises?`; **(e) investigation committees (#54 — READY): the authored 5d6 "3.0.40" spec (#65)** — Speaker forms Chair+Ranking+3, roll 5d6 + 4 modifiers, 21–25 ⇒ guilty (resign + cabinet ban + ripples), dominant-party targeting, Court-Martial-d6 fallback; **(f) veto override = 2/3 both chambers (#82)** — `drums` POSTS 2180-2187 designer ruling (60% was a reverted bug); **forward-only constant** since no veto code exists today, hardcode `VETO_OVERRIDE_THRESHOLD = 2/3`; **(g) midterm uses full meter+enthusiasm (#83)** — verify-vs-build: audit the mid-cycle Senate/House caller paths through `calcStateVote` (`phaseRunners.ts:3685`); widen the caller's term assembly to the `presGeneral`-equivalent set if it's a subset. | K0, E2 (crisis + investigation bill type) | M (split 7) | gap #8–#11 (`gilded`/`fed`/`modern`; `hd`; **`arkzag` corroborates #11 — named CRISIS states fire from EconStab/HonestGov meter thresholds across the full 1820→1840 arc, meter-crater Anytime-Evos below thresholds, ch17 402 / ch19 2005 / ch27, and the crisis-bill-FAILURE −100/waiver scoring rule ch24 1993-1994**) + #54 ready via #65 (`hd` I-10) + #82 (`drums` 2180-2187) + #83 (`drums` 299-304) + **DH-40 SCOTUS-establish packaging stall-guard (`tea1772`)** + **★★ batch-23 #174 committee bill-packaging + ranking-member counter + 2 chair-add powers + Puritan committee-vote rule — the fullest packaging spec in the KB; ★ cross-check the 5 gates + chair-add powers vs `tedchange` BEFORE building (single-thread source); needs `committeeChairs` ranking-member field + `Bill.packageOf?` (`pop2012b#POST 724`; `phaseRunners.ts:3463-3496`/`:3476`, `types.ts:1583`; game-mechanics §12.5.1, debt #54)** — CARRIED + EXTENDED, HI-CONF (7 era) | ready |
| E15 | **Era-event extensions** | Widen `EraEvent.decider: Role\|Role[]` (roll per role); foreign-territory grants en bloc (Oregon Treaty → BC/WA/OR/ID; organized/unorganized status); `GameState.pendingEvDeltas?` applied in 2.10 on `year % 10` (census timing: run decade N, take effect N+2; focus-rep seats); Egghead-cabinet advisory step + implementation-roll layer (difficulty tiers, trait re-rolls, blunder→scandal). **Resolve the scheduling fork [divergence #4 + BUG-1 + DH-2] here** — keep the graph, layer the cap. **Reads the K5 scandal-smoother (handler 9l) to drop back-to-back at-most-once events** (DH-22 cascade fix). **★ Batch-9: era CONTENT (events / SCOTUS docket) fires on its OWN scripted clock (#109 / DH-50), decoupled from in-game history** — a player who ends Jim Crow early still can't pre-empt the Civil-Rights content (the GM house-rules a ~5%/phase trigger). This is the THIRD scheduling clock (era bands gate on game-state [K3 level a]; the census fires on a 10-yr schedule [K3 level b]; content fires here on its own clock). Add the per-event scripted-schedule field + resolve DH-50's era-event-scheduling holes on this same surface. The **structured `evDelta`/census event field (DH-48)** lives on K4's registry but is *consumed* by this walker (the per-decade census-EV-delta events fire through here). **★ Batch-11 (DH-60) — add a `requires?: Predicate` on the era-event row + a firing-path FILTER (the concrete face of #92 territory-gating; SAME surface as BUG-1 + K3's `territoryOwned`).** `arkzag` flags two era-events firing with no asset/territory prerequisite — "Force Open Trade with Japan" fired with **NO Pacific port**, "Stubborn Cherokee" fired **without owning the relevant territory** (ch4 POST 335-340) — because the deck is **not territory/asset-gated**. Verified UNBUILT: `buildEraEventsForYear` (`eraEvents1856.ts:4`) gates **only by year**, and `EraEvent` (`types.ts:1466`) has **no precondition field**. The fix is **one optional `requires?: Predicate` field on the era-event row** (reuses K3's new `territoryOwned` predicate variant — own a Pacific port before the Japan event, own the territory before a removal event) **+ the firing-path filter that consults it** — exactly the same surface BUG-1's era-lock filter + K3's `territoryOwned` content-gate already touch, so **build it WITH E15 + BUG-1** (no standalone patch). **★ Batch-19 (`fixes2022`) — ADD a dynamic ERA-EVENT FIRING-RATE BUDGET (S; debt #44; `fixes2022#POST 114-123`, game-mechanics §10.4.6):** vcczar removed the old "2-min/8-max per half-term" cap, intends ">8", and OrangeP47 flagged an 1840 log-jam (only ~25% of events fired) wanting a **dynamic limit so ~70% fire per era.** Verified UNBUILT: the runner today (`runPhase_2_4_3_Era` `phaseRunners.ts:2796`; `buildEraEventsForYear` `eraEvents1856.ts:4`) has **NO firing-rate budget at all** — events fire by year-window only. Add a **dynamic per-era firing budget (NOT a fixed cap)** on this same era-event scheduling surface (divergence #4). **★ Also batch-19 CORROBORATION (no scope): the late-start event boot-filter** (strip pre-start-era events on a later start, honor an evergreen flag, `fixes2022#POST 413-423`, INTENDED) — build WITH BUG-1/#92; **the scripted-event build-out** (~30 events: Shaw/John-Brown demographic-removal + per-state abolition/suffrage/segregation/prohibition toggles + demographic-gated draft-ENTRY post-19A) maps onto the shipped `EraEvent`/`Predicate`/`addPolitician` model — it STRENGTHENS this row, NOT a gap. **★★ Batch-20 (`biden2021`, #169, S; debt #45; game-mechanics §10.4.7) — ADD the "ELDERLY PRESIDENT DROPS OUT OF REELECTION → ENDORSES VP" mid-campaign replacement event (the Biden-2024 → Harris analog):** verified UNBUILT — grep for `dropOut|replaceOnTicket|endorseVP|midCampaign|forcedOut|stepAside` across `src/` returns ZERO hits; no mid-campaign presidential ticket-swap path exists. **But the age-roll SUBSTRATE already ships:** the trigger gates on the old-age ability-decay roll (`ABILITY_LOSS_RULES.oldAge`, `minAge: 70`, `types.ts:521`; fired `phaseRunners.ts:2384-2393`) + `MORTALITY_RULES` (70/80, `types.ts:488-498`) + the PV age penalty (`pv.ts:85`, `age > 70`) — **the candidate-relevant roll is keyed at 70, NOT 75** (the only 75-gated roll is the unrelated SCOTUS retirement roll, `phaseRunners.ts:3655`). A new `EraEvent` (`types.ts:1466`) firing during an aged incumbent's reelection whose effect (i) checks the pres was hit by the §10.1 age roll AND is running for reelection; (ii) rolls **50% to pull** him; (iii) injects a flat **−1 party malus** into the **§21.9 presidential-vote modifier stack — landing on the VP even when the pres is pulled**; (iv) **swaps the VP onto the ticket** by replacing `blueCand`/`redCand` inside `runPhase_2_9_4_PresidentialGeneral(snap, blueCand, redCand)` (`phaseRunners.ts:3752`, which already takes the ticket candidates as params; VP id `types.ts:1568`); (v) a fallback to the §15.3 pre-primary/compromise-candidate machinery (+ a pre-12A "designate a successor" path) if the VP can't/won't step up. **Tuning guards (inside this row, not a new gate):** a VP-younger-than-pres check before defaulting to the VP; an alternative stiffer trigger (80+ / Frail-Easily-Overwhelmed-Incoherent / older-than-VP / Party-Pref-against). **★ DISTINCT from #37 / debt #29 (defeat-then-retire / the war-defeat President-loss package): #169 removes the candidate DURING the campaign, not after a loss.** **Era-of-Populism-scoped until it fires twice** (the twice-before-generalizing rule). Couples the age-roll substrate above + the §21.9 modifier stack. **Could alternatively slot in the election epic E20b — kept on E15 as the era-event-scheduled trigger.** | K1, K3 (the `territoryOwned` predicate DH-60 reuses); K5 + handler 9l; **BUG-1/QW1** (same firing-path surface; the batch-19 late-start boot-filter also rides here); **batch-20 #169 couples the age-roll substrate (`types.ts:521`, `pv.ts:85`) + the §21.9 modifier stack + `runPhase_2_9_4` `phaseRunners.ts:3752`** | M (**+ batch-19 firing-rate budget S, + batch-20 #169 drop-out→endorse-VP S**) | gap #22, #33, #34, divergence #4 (`gilded`/`fed`/`modern`) + **#109 content-on-own-clock + DH-50 scheduling (`nuke` §28.9)** + **DH-60 era-event territory/asset prereq filter (`arkzag` ch4 335-340; `eraEvents1856.ts:4`, `types.ts:1466`)** + **★ batch-19 era-event firing-rate budget (~70%/era dynamic limit) + late-start boot-filter + scripted-event-build-out corroboration (`fixes2022#POST 114-123, 413-423`; game-mechanics §10.4.6)** + **★★ batch-20 #169 elderly-pres drop-out → endorse-VP event (`biden2021`; the Biden-2024 → Harris analog; age-roll substrate `types.ts:521`/`pv.ts:85` ships, the ticket-swap is net-new; DISTINCT from #37; Era-of-Populism-scoped; game-mechanics §10.4.7)** + DH-22 (`drums` 7389) — CARRIED + EXTENDED, HI-CONF (4 era + earliest-discussion + modern-content) | ready |
| E16 | **Cabinet & Congressional leadership richness + cabinet retention (#8) + ★★ batch-12 cabinet→enthusiasm REWORK (#124, M) + ★★ batch-15 3-state enthusiasm channel + #151 appointment-FAIRNESS penalty (Era-of-Terror-gated) + #154 vacancy-fill ladder + offices-created-by-law (#66) + dynamic cabinet seat list (batch 6, divergence #15)** | **Coupled jobs, share the code.** ★★ **Batch-12 — RE-SCOPED M (was XS-S):** confirmation system + #124 enthusiasm REWORK build TOGETHER from day one — do NOT build today-shape confirmation only to tear it apart for #124. **★★ Batch-15 — RE-SCOPED a THIRD time (+ S):** the #124 rework now lands as a concrete **3-state enthusiasm channel** + the NEW **#151 appointment-fairness penalty** + a diversity check, ALL **Era-of-Terror-gated** (an era-BAND rule delta — bands change rules, not just content); **#124's numeric percentages, previously designer-gated, are now LARGELY RESOLVED by the live 3-state tuning** (they STRIKE from Decision-gated). #154's elected-seat vacancy-fill ladder lands here in the appointment-ladder family (with #115b). (1) Richness: region-coverage + **diversity floor (≥25% women/minorities)** + **intra-party faction-equity** malus; state-status eligibility guard; Ministers-to-foreign-powers seats; **Congressional 9-role pipeline** (Speaker/Maj-Min Leaders/Whips/Pro-Tem-by-seniority; RCV/weighted vote; committee-eligibility-by-prior-service; CPU auto-fill); **6-criterion faction-leader cascade** + anointing; PL fatigue + on-elect bundle + **suppress 2.2.4 + inter-party conversion in `independence`**. (2) **Cabinet retention — replace the wipe:** remove the unconditional cabinet clear at **`phaseRunners.ts:3804-3812`** (it fires every presidential cycle, even on re-election); retain occupants (modern: keep ≤5, CIA/FBI exempt), add per-officer tenure + `firingPrecedentSet` gate on *replacement* + same-faction US-Bank guard + opp-party cap. (3) **★★ Cabinet-confirmation system (DH-23) + #124 cabinet→enthusiasm REWORK — built TOGETHER from day one (M, batch-12 re-scope).** The confirmation system DOES NOT EXIST: `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step scored pick that goes straight to `cabinet[seat] = pick.id` + `addLog("confirmed")` (`:2191-:2198`) — **no committee, no Senate vote, no NAY/AYE roll**. **Build it in the right shape from day one as a SIBLING of the retention step**: a Senate confirmation step (committee → floor) with **default-AYE baseline + low-% opposition reject (the lost rule)** + **Iron-Fist Maj-Leader auto-AYE-own-picks (the §25.5.2 designer ruling, via the `compelledVoteRule?` primitive)** + **Admin-weighted lobby-maximizer (not just lobby-maximizer)** + the 50/50 Admin-1 trap fix + PPT-5-alternatives auto-confirm chain after failure + the **batch-6 SCOTUS within-1-step auto-AYE declarative rule** (§26.6.1). **★★ Batch-12 #124 (`tedchange#POST 1-4`, game-mechanics §9.3.7) — the cabinet writes change shape from day one:** **(a) LOBBY satisfaction now writes POINTS to the existing `Faction.score?` ledger** (NOT enthusiasm) — moves the cabinet-lobby coupling from `enthusiasm` to the score-ledger write path; **(b) IDEOLOGY COMPOSITION drives ENTHUSIASM via the existing ±3-cap clamp** — ≥50% cabinet of an ideology = +enth that ideology; ≤20% = −enth; **(c) 3-shifts-per-half-term cap holds; (d) Big-4 / rest-of-cabinet / cabinet-level potentially weighted differently.** **★★ Batch-15 #124 RE-TUNED LIVE (`terror2000` POST 1280 + #31 nuke rework) — the numeric percentages are now LARGELY RESOLVED to a concrete 3-STATE per-faction ENTHUSIASM CHANNEL keyed on wanted-lobby-POSTS, one roll per faction:** **0 wanted posts → "upset" (enthusiasm DROPS), 1 → "fine" (neutral), ≥2 → "happy" (enthusiasm RISES)**, still ±3-capped, still ≤3 shifts/half-term, **one roll per faction.** This pins the lobby→enthusiasm shape Ted left TBD in batch-12; **ship the const table as the canonical 3-state map, not a placeholder** (re-tune only if Ted publishes finer numbers). **The #124 numeric percentages therefore STRIKE from the Decision-gated "designer-gated" bucket (was B8 + B9).** **CPU side = handler 9d.** **★★ Batch-15 #151 (`terror2000` POST 1280, 154 — Ted-RULED, fired LIVE twice) — Era-of-Terror appointment-FAIRNESS penalty (S, NEW):** *"From the Era of Terror on through the future, the President must balance appointments for ALL same-party factions equally (including their own); failing = −500 points per slighted same-party faction."* Fired on **Bush** (−2000 for giving one Red faction >3× any other's) and **Oprah** (−2000 for over-appointing himself). Add an **Era-of-Terror-on appointment-distribution check**: count appointments per same-party faction (incl. the President's own) and apply **−500 to `Faction.score` per faction that received zero / disproportionately few**; **DISTINCT from the cabinet-DIVERSITY penalty** (the diversity floor in (1) above) — **both Era-of-Terror cabinet penalties operate together natively in a 2000-start.** Gate the WHOLE batch-15 cluster (3-state channel + #151 fairness + diversity-as-rule-delta) on the era-content-band so it activates only from the Era of Terror on (the band-changes-rules delta K3 already supports). Open: flat −500 vs scaled by imbalance (a balance dial, not a blocker). **★ Batch-12 #131 (`tedchange#POST 277`) — Integrity-pol cannot nominate Controversial-pol** — wire the `canNominate(nominator, nominee)` trait filter at the cabinet picker (also QW13 standalone). **LANDS AFTER K2 + K5** (cabinet picks are CPU actions; consumes the conditional-vote-rules primitive `pop` POST 1111). **RULED by Ted (`tedchange#POST 1-4`, `tedchange#POST 277`); percentages designer-gated (§30.2 #8/#9).** **★★ Batch-18 #160-cabinet (`ideo1928#POST 213-214`, the ONE Ted-authored ruling this batch — DESIGNER class — S; the CONFIRMATION AUTO-PASS GATE; a REAL fix for the §25.5 36%-pass pathology):** insert an **auto-pass gate at the confirmation step** inside `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158`): **ALL nominees AUTO-CONFIRM EXCEPT** {State / Treasury / AG / Defense} OR Controversial OR <3 relevant skill (unless Integrity); an **Iron-Fist Senate-Majority-Leader can force a vote on ANY** pick (via the `compelledVoteRule?` primitive). This fixes the `drums` §25.5 pathology (only **36% of 88 nominees passed** — the CPU was over-rejecting) by ensuring **most picks NEVER REACH A VOTE**; the `'Controversial'` trait already exists (`types.ts:103`). The contested-pick path then routes through the E9-handler-9d CPU Senate vote (so this gate + the 9d vote are siblings — build them together). **A Ted-AUTHORITATIVE ruling (not a GA call) — ready-to-build, not gated.** game-mechanics §25.5 + §30.9. **★★ Batch-22 #172 (`modernday#POST 422-423`, Ted-authoritative; the ERA-KEYED CONFIRMATION THRESHOLDS + NUCLEAR-OPTION; S–M; folds into THIS confirmation step + E14c cloture; game-mechanics §9.3.10, debt #50):** add a `GameState.nuclearOption: { cabinet: boolean; scotus: boolean }` **per-start-year boot flag SEEDED by `scenarioBoot`** (the SAME `BootSheet` surface as #170's office-existence seed, step (5) below) — for a 2016 start, **Cabinet requires 50%+1, SCOTUS 60%, with the Nuclear-Option otherwise permanently in place** (era-keyed default: Reid-2013 + McConnell-2017 already fired). Read it via a **per-track confirmation-threshold** check in the cabinet runner (`phaseRunners.ts:2158`) AND the SCOTUS-nomination path (`:3648-3671`, the E25 docket's nomination surface) + a **Senate-Majority-Leader enact/repeal action** (one ActionRegistry row toggling the flag) + the **60→fail→10-vote-conversion→auto-confirm-a-Mod fallback** (`modernday#POST 602-603`: a 60-vote SCOTUS fail auto-confirms a Mod-Dem-or-Republican replacement). **★ It COMPOSES, does NOT conflict, with already-scoped pieces — do NOT re-build them:** the **batch-18 #124 auto-pass GATE above** (whether a vote even HAPPENS) FRONTS the threshold; **#52 / E9 handler 9d** (WHO votes aye) resolves the contested vote; **#171** is orthogonal (draft, not confirmation); and the **batch-9 USER cloture decision** (Senate = 60%-then-majority vs simple-majority, resolved-in-code as simple majority) is the SAME cloture surface **E14c** owns — **do NOT re-litigate it; the Nuclear-Option flag is the era-keyed DEFAULT on TOP of it.** Size: the boot flag + per-track threshold read is S; the SML enact/repeal action + the conversion-fallback is the M part — both reuse this confirmation surface + the E14c cloture surface already scoped. **Open Q (designer-gated TUNING within the epic, NOT a Decision-gated bucket entry):** boot-flag-vs-derived-from-the-cloture-reform-bills. **Ted-authoritative — ready-to-build.** (4) **Offices-created-by-law (#66):** model offices as **data created/destroyed by bills + exec actions** (`createdOffices?`), not a fixed `cabinetSeatsForYear` — Fed Chair (6-yr; creating the Fed deactivates the Independent Treasury), Chief of Staff (+1 exec action), CNO (replaces Sr Admiral; +1 Command), FBI Director (10-yr, off the 5-cap), Commerce/Labor split. (5) **Dynamic cabinet seat list (batch 6, divergence #15 / #89).** Verified: `cabinetSeatsForYear(year)` (`types.ts:1196`) is **pure derived with NO mutable state**; `phaseRunners.ts:2162` recomputes it each turn. Refactor: shipped function becomes the **BOOT SEED only** (seeds `GameState.cabinetSeats: SeatSpec[]` at boot); runners read the mutable list; **bill-sign handler appends `Legislation.createsCabinetSeat?: SeatSpec` payload** to the array. **★ Batch-9 — the dynamic seat list must support CREATE-AND-ABOLISH, not just create:** **add `Legislation.abolishesCabinetSeat?: SeatSpec`** and make `GameState.cabinetSeats` support **removal** (modern: DOE/DHS created, Postmaster General ABOLISHED, HEW split; founding: Bank/Navy/AG created by bill). Folds into this same step (5). **(6) ★★ Batch-15 #154 (`terror2000` POST 469-480, from the 3.0 doc — RULED) — the canonical 4-step ELECTED-SEAT vacancy-fill ladder (S; the #115a/#115b appointment-ladder family):** when an elected seat is suddenly vacated (dead/resigned Governor, Senator, etc.), fill it in order **(1) same-party career-track pol FROM THAT STATE → (2) same-party UNEMPLOYED pol → (3) OTHER-party career-track → (4) other-party unemployed**, with the from-the-state constraint. **DISTINCT from** the cabinet-fill Admin-ladder (handler 9d / OC-5), the boot/appointment ladder #115b (own-party-not-CT → own-party-CT → opposite → generate), and the CPU governor menu (DH-19) — it is the **elected-seat** vacancy ladder, paired with **E10b's #61 succession** (the seat the succession chain leaves vacant). **One ordering convention is a build-target DIAL, not a Decision-gate:** a common house-rule variant swaps steps 2 and 3 ("blue-CT-over-red-unemployed", POST 480) — pick step-2-before-step-3 as canonical (matching the 3.0 doc) and expose the swap as a const. **(7) ★ Batch-17 FL-on-DEATH → IMMEDIATE replacement (S standalone fix; fork RESOLVED — shipped code still DEFERS; `ted1772`, game-mechanics §10.1 + §8.3).** On a faction-leader's death, `cleanupLeadershipAndProtegeChains` (`phaseRunners.ts:2304-2312`, invoked from the 2.4.1 deaths runner) nulls `f.leaderId` + `leadershipStartYear` and **WAITS** — the seat sits empty until the next **2.2.3** sweep elects a successor (the "invalid → Step 2 Election" path at `runPhase_2_2_3_FactionLeaders`, `phaseRunners.ts:1975-2009`). Ted REVERSED his own initial ruling LIVE: *"New rules dictate that dead faction leaders are immediately replaced."* **The fix:** factor the 2.2.3 vacant-seat election body into an **`electFactionLeader(snap, f)`** helper and **call it at death time** from the death cleanup, instead of deferring to the next sweep. **A small standalone refactor (S) on the leadership pipeline this row already owns** — lift the election body, call it immediately. **Consider splitting cabinet vs. Congress vs. offices-by-law vs. confirmation+rework+3-state-channel+#151 vs. dynamic-seat-list vs. #154-vacancy-ladder vs. the FL-on-death immediate-elect fix if any feels XL.** | K0; **K2 (registry — cabinet picks are CPU actions; `requires?: AmendmentPredicate` from day one); K5 + handler 9d (CPU confirmation + the conditional-vote-rules primitive `pop` POST 1111)**; **#154's ladder pairs with E10b (#61 succession) + the #115b boot/appointment ladder (K4)** | **M (batch-12 re-scope) + S (batch-15: the #151 fairness penalty + #154 vacancy ladder; the #124 3-state channel is now a concrete const table inside the M confirmation+rework step)** | gap #25, #28–#32, divergence #8 (`gilded`/`fed`/`1772s`/`modern`) + #66 (`hd` I-11) + DH-23 (`drums` 4702-4708, 4896-4900, 867-876, 1607-1626) + **#89 / divergence #15 (`pop` 699, 1100)** + **founding offices-by-law (`new1772` §24.6)** + **#112 create-AND-abolish (`nuke` §28.5)** + **#101 office-by-bill 4th-era corroboration (`dem1820` — Postmaster→cabinet by legislation)** + **★★ #124 cabinet→enthusiasm REWORK (`tedchange#POST 1-4`); ★★ batch-15 #124 RE-TUNED to the 3-state channel + numeric percentages RESOLVED (`terror2000` POST 1280)** + **★★ #151 Era-of-Terror appointment-fairness −500/slighted-faction (`terror2000` POST 1280, 154)** + **★★ #154 4-step elected-seat vacancy ladder (`terror2000` POST 469-480)** + **★ #131 Integrity-can't-nominate-Controversial (`tedchange#POST 277`)** + **★ FL-on-DEATH immediate-replacement → factor `electFactionLeader(snap,f)`, call at death time (shipped DEFERS at `phaseRunners.ts:2304-2312`; ruled immediate — `ted1772`, game-mechanics §10.1/§8.3)** + **★★ batch-18 CONFIRMATION AUTO-PASS gate — auto-confirm EXCEPT {State/Treasury/AG/Defense}/Controversial/<3-skill (unless Integrity); Iron-Fist Maj-Leader can force any; fixes the §25.5 36%-pass pathology (`ideo1928#POST 213-214` — Ted-authoritative; folds into this confirmation step + E9 handler 9d)** + **★★ batch-19 PROVENANCE confidence-bump (no resize/move): `fixes2022` (Fall 2022) is the EARLIEST source for #124 (the Integrity/Controversial 100%→10-20% confirmation-inflation fix + the cabinet/legislative enthusiasm-swing cap, `fixes2022#POST 659-670, 883-907`) AND for #135 (50-50-Senate→VP's-party, `POST 803`, the Senate-tie convention this row's Maj-Leader path reads) — designer intent from the START → raise build-confidence; game-mechanics §30.10** + **★★ batch-22 #172 ERA-KEYED CONFIRMATION THRESHOLDS + NUCLEAR-OPTION — `GameState.nuclearOption:{cabinet,scotus}` per-start-year boot flag (Cabinet 50%+1 / SCOTUS 60% for 2016) + per-track threshold reads + SML enact/repeal action + 60→fail→conversion→auto-Mod fallback; composes with #124 auto-pass + #52/9d + #171 + the batch-9 cloture decision (do NOT re-litigate); folds into THIS step + E14c cloture (`modernday#POST 422-423, 602-603`, Ted-authoritative; game-mechanics §9.3.10, debt #50)** + **★ batch-23 #15 cabinet-decline-CPU-only CLARIFICATION (no new build) — cabinet accept/decline %s are CPU-ONLY: gate the decline rolls behind `isCPU`; humans free-choose every seat EXCEPT VP (MrPotatoTed-authoritative, `pop2012b`; the canonical code-intent was already right — pin the authority); game-mechanics §9.3.7** + **★ batch-23 2nd-source 2012-boot CORROBORATION of the 28-seat cabinet + confirmation + #124 enthusiasm cluster (#25/#112/#124, `pop2012b`)** — CARRIED + RE-SCOPED 3× (batch-12 M, batch-15 +S) + batch-17 FL-on-death fix + batch-18 confirmation auto-pass (S) + batch-19 #124/#135 earliest-source provenance + batch-22 #172 nuclear-option/thresholds (S–M) + batch-23 #15 cabinet-decline-CPU-only clarification, HI-CONF (6 era + founding + native modern + designer-RULED + earliest-discussion + 2nd-source 2012-boot) | ready (concept); **#124 numeric percentages RESOLVED batch-15 (3-state tuning), EARLIEST-source-confirmed batch-19; #151 + #154 ready; ★ FL-on-death immediate-elect = S standalone fix; ★★ batch-18 confirmation auto-pass = S, Ted-authoritative; ★★ batch-22 #172 nuclear-option boot flag + era-keyed thresholds = S–M, Ted-authoritative (composes with E14c + #124/#52/#171, do NOT re-litigate the cloture decision)** |
| **E17** | **Iron Fist trait split (§25.9 / debt #25) — M; designer-flagged** | Split `'Iron Fist'` into **≥6 office-keyed traits** (e.g. `'Stifle Competition'` primary block, `'Force Vote'` chamber compulsion, `'Compel SCOTUS'` court compulsion, `'Fire Officers'` mid-war military replacement, etc.). **Touches:** the 4 governance rows (`types.ts:1043-1047`); 3 era-event multiplier readers (`phaseRunners.ts:2915,:2931,:2959`); the 6 grant-callers in §25.9 (PL+Honest-Gov-maxed gov control, Sen Maj Leader vote forcing, President officer-fire / SCOTUS-compel / challenger-stifle, Loans-from-Wealthy + IF PL gov takeover, Convention PL unilateral threshold, mid-war military replacement). `repair()` migrates `'Iron Fist'` → all child traits (over-broad but safe), then narrower readers move to specific child traits. **Independent of K5** — the trait readers are existing code, not CPU heuristics. **⚠ NEEDS DESIGN first** (parking lot, §25.9): the exact 6 child trait names + cascade rules need a designer call before build. | independent of keystones; **§25.9 design call** (parking lot) | M | gap #77 (`drums` 2433, 2511, 2784, 3241, 3660, 4896-4900, 5353, 6293, 6471, 6568, 6703, 6852, 6881, 6907, 6912, 6922, 7012, 7224, 7364) — NEW | **needs-design** (§25.9) |
| **E18d** | **★★ batch-12 #120 — `smallbugs` DATASET UMBRELLA: ONE coordinated `scripts/seedDataset.mjs` `CURATED_ROWS` pass (M, parallelizable, orthogonal to engine work) + ★ batch-12 #121 Secessionist trait (XS, folds in) + ★ batch-12 #123 small late-modern content bundle (XS, folds in)** | **Dataset maintenance** — author-time `scripts/` work, NOT engine. **★★ #120 (`smallbugs` §2 / §3 / §4):** the `smallbugs` thread is a 3-yr+ rolling catalog of ~100 community-reported defects in the bundled dataset: **~50 named-pol fixes** (religion mislabels, wrong skills/traits, wrong birth year, swapped/duplicate bios, party/alt-state flags missing, sub-floor stat audit, alt-state misses, missing-from-dataset entries — most-common patterns: Catholic-as-Protestant religion mislabels ≥8 named cases; modern-pol recency bias ≥6 cases; trait-conflict slips ≥5 named cases; per-bill sign bugs ≥8 named cases; duplicate/collision names ≥6 cases), **~30 small mechanical fixes** (swapped bill effects + missing event prereqs + era-flag typos + region-table off-by-ones + statehood-routing inconsistency), and **~20 dataset additions** (Sequoyah / Yazoo / de Valera / Otis Glenn / Richard Bland Lee I, etc.). **Build it ONE coordinated pass via `scripts/seedDataset.mjs` `CURATED_ROWS` overrides** (NOT by hand-editing the JSON/CSV — see CLAUDE.md). Sub-tasks: (a) the ~50 named-pol fixes; (b) the ~30 mechanical fixes (bills + events); (c) the ~20 missing-dataset entries; (d) automated audits — religion-sweep, modern-pol balance audit, trait-conflict-validator, bill-effect-sign-checker. **ALSO COVERS DH-43 (Vermont home-state mapping — absorbs QW11), DH-51 (modern pols recency-biased — corroborated across 4 threads now), DH-28 (trait-conflict validator at boot, runs on dataset import).** **★ #121 (`smallbugs` §4a / POST 2, 3, 121, 122) — `Secessionist` trait MISSING from politicians dataset:** the 1856/1868 secession arc (CSA defection, secession-Senator pool, post-CSA reset) needs to identify **who would actively secede**, not just who's unionist. Per Imperator Taco Cat: *"we don't have a secessionist trait in the original politician database. It won't apply for most games, but it is very important for 1868."* Stephen Mallory (CSA Sec of Navy) is the canonical exemplar. **(a) Add `Secessionist` to the `Trait` union** (XS, one-row addition to `types.ts`); **(b) Populate the historical CSA roster** in the dataset (XS, folds into the #120 named-pol fixes); **(c) Integrate with the secession trigger E3b sub-PR (a)** — gates who joins the CSA pool when secession fires. Distinct from `Union Loyalist` (both must exist as opposing flags). **★ Batch-16 FOLDS IN DH-64 — the INVERSE of #121: `Southern Unionist` MISLABELED on many Southern draftees (XS; `hd1` POST 1446, 2682):** the GM had to hand-fix `Southern Unionist` across the 1864/1868/1872 drafts — many "Southern-state" draftees were actually **Union officers who settled South after the war**, **Black Republicans** (e.g. Robert Smalls), or **Northern-residing Southerners**, none flagged Unionist; without the label they'd auto-join the Secessionists at secession and be unable to hold office. Since #58's secession gate keys on this trait, **incorrect labels wrongly DEACTIVATE loyal Southern (and Black) pols** when secession fires. Audit + correct `Southern Unionist` on `standard-draft-classes.json` via `CURATED_ROWS` (esp. VA/MS/FL + all Black Republicans) and validate at dataset-build time — the same coordinated pass as #121's Secessionist add (the two opposing flags get audited together). **#157's CSA-government seeding (E3b sub-PR a) depends on this audit being correct.** **★ Batch-17 FOLDS IN DH-65 — FOUNDING-ERA dataset bugs (XS; `ted1772`, game-mechanics §4.1.z) — same class as DH-64:** **(b) the Cosmopolitan ⊕ Provincial both-held half is ALREADY ENGINE-SHIPPED** — `TRAIT_CONFLICTS` (`types.ts:675-676`) maps the pair mutually-exclusive and `addTrait`/`tryGrantTrait` (`engine/traits.ts`) enforce it; the current generated `public/standard-draft-classes.json` has **0 both-held pairs** (verified across 18,561 pols), so the live forum both-held was a spreadsheet artifact and **no engine work is needed** (the DH-28 trait-conflict-at-import validator in (d) already covers any future slip); **(a) the REAL fix is the wrong-century / same-name collisions** in the founding pool — the merge in `legislatorsToDataset.mjs:276-302` disambiguates same-name people by a ±25-yr birth-window heuristic (`ERA_SAME_PERSON_WINDOW`) but does NOT validate the founding-era pool for wrong-century entries, and there is **no build-time assertion gate.** **The fix:** a `CURATED_ROWS` audit over the **1768-1776 founding window** for same-name-wrong-century collisions + a **dataset-build validation pass** in `legislatorsToDataset.mjs` that flags them, then regenerate. Folds into this same coordinated pass alongside #121/DH-64 + the (d) automated audits. **★ #123 (`smallbugs` §3 / POST 451, 475, 395-401, 642-651) — small late-modern content bundle (XS):** **(a) Wyoming Rule → Real House Act 585-cap at Era of Populism** (Ark POST 475) OR **(b) Wyoming Rule as 1.31× current EVs at 2000 Census** (POST 451, alternative formulation — see DH-49 population-model gate); **(c) runoff-election rules for the runoff amendment** in Era of Progressivism; **(d) Senate-Abolish amendment** referenced as existing; **(e) Pardon mechanics** — that's the separate **#122 designer-gated open** (parking lot). Folds these small late-modern content bits into Phase-2 #28 census recompute + Phase-2 #30 modern-era content (the `scenario1948` row), not as new engine work. **No engine code change in this row.** Place orthogonally to engine work; parallelizable. **#120/#121 RULED by the catalog (vcczar-class spot rulings); #123 a small content addition.** **★★ Batch-22 FOLDS IN DH-70 — the `Lackey` PV over-weight is a `pv.ts` NOTE, not a special-case (XS; `modernday#POST 1939-1945`, debt #52):** the digest flagged a LW-Pop with ONLY `Lackey` at PV −47, but **shipped `pv.ts:77` already applies a flat `−5` to EVERY negative trait** (`else if (NEGATIVE.includes(t)) total -= 5;`) and `Lackey` appears **NOWHERE in `src/`** (grep = ZERO — not yet a shipped trait), so the over-weight the forum saw was a **spreadsheet artifact, NOT a formula bug.** **The note: when `Lackey` is ported into the dataset/trait union, add it to `NEGATIVE_TRAITS` so it takes the SAME flat `−5` — NO special-case** (the shipped formula already treats all bad traits equally). Pairs with the #120 dataset-balance audits (d) + DH-51's modern-pol balance pass. XS, no engine change beyond the one-line `NEGATIVE_TRAITS` membership when the trait is added. | — (orthogonal to engine work) | M (the ~100-item coordinated pass; #121 + #123 + DH-70 fold in as XS each) | gap **★★ #120 dataset umbrella (`smallbugs` §2-§4)** + **#121 Secessionist trait (`smallbugs` §4a POST 2/3/121/122)** + **#123 small late-modern content bundle (`smallbugs` §3 POST 451/475/395-401/642-651)** + **★ DH-64 `Southern Unionist` mislabel audit — INVERSE of #121 (`hd1` POST 1446, 2682; pairs with E3b #58/#157)** + **★ DH-65 founding-era same-name-wrong-century audit + build-time validation gate in `legislatorsToDataset.mjs` (`ted1772`; the Cosmopolitan⊕Provincial trait-exclusivity half is ALREADY engine-shipped — `TRAIT_CONFLICTS` `types.ts:675-676`, 0 both-held in the 18,561-pol dataset)** + **★★ batch-19 FOLDS IN the `fixes2022` dataset batch — same coordinated `CURATED_ROWS` pass (`fixes2022`, the EARLIEST source, game-mechanics §30.10): ~20 named dataset/scenario-config items + ~10 bill/event/SCOTUS effect-SIGN bugs (bailout / Dunmore / Independence-budget / veto-override / San-Antonio-ISD / unicameral-options / isolationism → ALL corroborate DH-53) + vcczar's OWN audit of ~1800 legisprops ("~1 issue per 100, mostly prereqs in wrong order," POST 367-369); cross-thread dup: Bob Scott (NC Gov, 1-Leg→1-Gov) = the SAME fix as `smallbugs` §2b; record the dataset PRINCIPLE that the Leadership trait is deliberately VERY RARE (epoch-defining party-builders only — intentional, not a #120 bug)** + **★★ batch-20 FOLDS IN the `dbomit` missing-pol REQUEST thread — same coordinated `CURATED_ROWS`/`ERA_FIGURES` pass (`dbomit`, game-mechanics §30.11.3): the ~167-pol missing-name catalog + dataset-quality bugs (wrong/missing starting expertise; "Army"-as-expertise → Military [a #168 terminology corroboration]; missing post-2022 death dates), NO per-pol gap rows; the reusable inclusion bar (0-9%-of-winning US Rep/Sen/Gov, or a missing US Rep; sub-floor rookie stats; name-generator for the deep future) feeds the §7 draft-class playbook. The small standardization rulings (add Middle Eastern ethnicity; drop no-op Protestant/White; "Crazy" trait permanently REJECTED → Controversial) are the SAME pass as the #168 terminology contract — author CHRONOLOGICALLY** + **★★ batch-22 FOLDS IN DH-70 — `Lackey` PV over-weight is a `pv.ts` NOTE not a special-case (`modernday#POST 1939-1945`; shipped `pv.ts:77` already flat-`−5`'s all negatives, `Lackey` not yet in `src/` — when ported, add to `NEGATIVE_TRAITS` for the same flat `−5`; debt #52, pairs with the (d) balance audits + DH-51)** + DH-43 / DH-51 / DH-28 ABSORBED — NEW + AUTHORED | ready |
| E18 | **Small consistency PRs (cluster) — ★ batch-12: now ALSO the home of the Ted-RULED small consistency batch (#130, #135, #140, #141)** | Cheap independent wins: (a) old-age stat decay (age-keyed; `modern` adds add-negative-trait / strip-trait); (b) defeated-incumbent auto-retire (only-if-ran; 6yr loss-malus amendment-gated; −1 defeat malus); (c) industry-leadership compute + scoring (per-era industry set incl. the modern 8; regional shifts; **High-Tech via era event #81 + Improve High-Tech gov action**); (d) tariff integer + change-cadence + president-tariff-power toggle; **(g) `GameState.nationalSurplus?`/`nationalDebt?: number` distinct from `meters.revenue` — prereq for E2's cap + E6's debt field; BUILD THIS SUB-ITEM EARLY.** (#85 5%/half-term retire-death + military-officer mandatory 75 already shipped as QW7; #80 ±3 ideology+cabinet swing cap shipped as QW3 extension.) **★★ Batch-12 #130 (`tedchange#POST 89-100, 137-148, 195-197, 396`, game-mechanics §10.1.y) — DEATH/RETIREMENT SCHEDULE (S, pairs with QW7/#85):** verified shipped: `MORTALITY_RULES` (`src/types.ts:485-516`) has rough shape but with `frailDeathMult = 1.5` (vs Ted's "Frail rolled FIRST in death roll") — multiplier is the wrong knob; needs an order-aware loop. Ted RULES: **(1) Hale = ½ death chance** — verified `Hale` is NOT in the `Trait` union (`types.ts:36`) today, add it + `haleDeathMult = 0.5` to `MORTALITY_RULES`; **(2) Frail rolled FIRST in death roll, then oldest-to-youngest**; retirement rolls oldest-to-youngest (no Frail priority) — verified today's death loop walks `snap.politicians` in array order (`phaseRunners.ts:2358`), refactor to order-aware; **(3) Retired ex-Presidents ONLY roll for DEATH, not retirement** (closes the "John Adams immortal" loop); **(4) Cabinet members retire at END of half-term, not on appointment**; **(5)** 5%/half-term retire-death + era-scaled %s (corroborates QW7/#85 + cf82a7d3 #4 Orange's formula); **(6) auto-retire at 100** already in 2.10. **Folds into this row (pairs with #85, which is already QW7).** **RULED by Ted (`tedchange#POST 89-100, 137-148, 195-197, 396`; SUPERSEDES cf82a7d3 #4 with the full schedule).** **★ Batch-12 #135 (`tedchange#POST 65`) — 50/50 House inverse-control (XS one-line at `phaseRunners.ts:1864`)** — ALSO landable as QW12 standalone; ride here if shipping the small consistency PRs as one bundle. **★ Batch-12 #140 (`tedchange#POST 249-275`, game-mechanics §10.2.y) — ANYTIMEEVO TARGET-POOL TIGHTENING (S):** verified `anytimeEvents.ts` exists. Ted RULES: events 5/17/23/24/25/39/66/117/118/119 restricted to **Rep/Sen/Gov/Cabinet only**; **Assassination = 50% Pres / 25% random Rep-Sen / 25% random faction leader.** Per-event filter wiring + AnytimeEvo template content edits. (Alternatively co-locate with E9 handler 9g A/B/C event vote.) **RULED by Ted (`tedchange#POST 249-272`).** **★ Batch-12 #141 (`tedchange#POST 73-79`) — FL TRAIT GAIN 5%+/3%- (XS, refines existing const)** — positives per cycle as FL; negatives first-time-as-FL only. Refines cf82a7d3 §5a #4. ALSO landable as QW16 standalone. **RULED by Ted (`tedchange#POST 73-79`).** | mostly — | XS–S each (incl. #130 S, #140 S; #135/#141 XS) | gap #35–#38, #27, #3 (`gilded`/`fed`/`1772s`/`modern`; **★★ `gild1868 (b14)` corroborates the Gilded content cluster #3/#5/#6 from a native-1868 start — note: the PLAYED tariff-rate + currency engine #147 lives at the EG epic on top of this (d) static-axis sub-item**) + #81 (`drums` 2809, 3074, 3085) + **★★ #130 death/retirement schedule (`tedchange#POST 89-100, 137-148, 195-197, 396`; **★★ `terror2000` corroborates the death/retirement schedule from a modern angle**)** + **#135 50/50 House inverse-control (`tedchange#POST 65`; **★★ `terror2000` corroborates #135 inverse-control via its 50-50-Senate open**)** + **#140 AnytimeEvo target-pool (`tedchange#POST 249-272`)** + **#141 FL trait gain 5%+/3%- (`tedchange#POST 73-79`)** — CARRIED + EXTENDED + designer-RULED, HI-CONF (4 era + designer + native modern) | ready |
| E19 | **Faction-personality 5-step distribution + per-era card pool + nicknames + rename triggers + conditional-vote-rules primitive (batch 6, `pop` POST 1111)** | The **full 5-step allocation** algorithm (`1772s` B9) alongside the existing per-half-term drift. Plus **per-era card-count rescale** at boundaries (can split Prog/LW-Pop across 2 factions). Plus the per-(party, era, ideology) nickname table gated by leader traits + player-edit override. Plus the **deterministic faction-rename trigger registry** (§25.13 Whig→"Conservative Party": 3-condition predicate — no Republican Party + Red leader has Protectionist + Blue won 3 prez in a row; auto-generates new name; per-era authored names pool replaces the GM-admitted "kinda stupid/silly" default). **CPU side = handler 9o** (reads the rename-trigger predicate→name-generator registry). **Rebalance inelastic lobby cards — DH-11** (raw-pol-count-driven → a trifecta party can lack lobbies). **Batch 6 — conditional-vote-rules primitive (`pop` POST 1111).** Add `Faction.factionLeader.compelledVoteRule?: Predicate → Vote` (a declarative AYE/NAY policy keyed by predicate; e.g. "Sen Maj Leader NAYs any nominee with Admin<3 unless faction holds Integrity"). Subsumes BOTH per-vote Iron-Fist compulsion AND the §25.5.2 auto-AYE-own-picks cabinet rule AND SCOTUS within-1-step auto-AYE (§26.6.1) under ONE primitive. Promotes a §25.9 sub-effect to a first-class CPU primitive. **Consumed by E9 handlers #2 (legislation) BEFORE the §25.6 NAY/AYE heuristic AND #4 (cabinet)** — the primitive lives on faction-personality, the consumers are CPU handlers. Pairs with E17 (Iron-Fist split). | K3/K4 (era enum); K5 + handler 9o | M | gap #24, #5, #40 (`1772s`/`gilded`/`fed`/`modern`; `drums` POST 7406) + DH-11 lobby half (`hd` 7799) + **`pop` POST 1111 (conditional-vote-rules)** — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| E20 | **Bill-scoring leaderboard (divergence #1, Phase A) + ★ batch-12 #128 Kingmaker / Master Kingmaker per-state bonus binding** | Add `legislativeScoring(bill, faction)` (±50/100/150 per matching ideology+lobby+interest card; **failed bills also score** + ±1 per-pol reelection deltas) onto a new `Faction.score?` ledger — **the same per-era running score K3 banks-and-zeros at the boundary (#68)** and the Phase-2 enthusiasm engine (E21) consumes. Keep `cardVoteBias` (`phaseRunners.ts:1516`) as the **vote-probability** input for floor votes. (Phase B parked.) **Batch-8 placements:** **(a) #103 pres-vote modifier stack + era-stamped issue list (`tea1772`);** **(b) DH-42 BALANCE — national meters swamp per-state lean (`tea1772`).** **Batch-9 placements:** **(c) DH-52 landslide-margin-cap;** **(d) #108 gradual 4-lever realignment;** **(e) #110 modern election machine** (deep form rides E23). **★ Batch-10 placement — DH-53 bill→EV/meter STRUCTURED-effect tables (S, NOT a sign-flip):** `dem1820` corroborates `nuke`'s recurring bill-effect sign bugs from a 3rd thread (POST 462-466). **The fix is NOT a sign-flip — AUTHOR the structured per-bill effect tables**: `Legislation.effects` has **no per-state EV field**, and `applyEffect` **cannot mutate `electoralVotes`** today. Pairs with K4's DH-48 structured-`evDelta` shape. **★★ Batch-12 #128 (`tedchange#POST 316`, game-mechanics §6.5.y) — KINGMAKER / MASTER KINGMAKER per-state BONUS SCOPE (S — pin the +1 binding sites):** verified shipped: the Kingmaker bonus is **NOT YET a state-vote bonus** — `calcStateVote` (`phaseRunners.ts:3685-3722`) does NOT consult Kingmaker state to add a per-state +1. Ted's `tedchange#POST 316` rules: **basic Kingmaker = +1 in own state only** (incl. state's Pres primary + state's general); **Master Kingmaker = +1 in EVERY state** (all Pres primaries + all generals, incl. own state). Pin the binding at `calcStateVote` `phaseRunners.ts:3711` (adjust the score sum) + a new helper `kingmakerBonus(snap, candidate, stateId): number` that returns +1 if any Kingmaker in the candidate's faction is from the same state (basic) or anywhere (Master). **SUPERSEDES Matt's "state OR national, pick one" reading.** **RULED by Ted (`tedchange#POST 302-320`).** | K0; K3 (banking consumes `Faction.score`); **K4** (shares the DH-48 structured-`evDelta` schema for DH-53) | M (+ DH-53 S + #128 S) | gap #12, divergence #1 (`gilded`/`1772s`/`modern`) + **#103 (`tea1772`)** + **DH-42 (`tea1772`)** + **#108/#110/DH-52 (`nuke`)** + **DH-53 structured bill-effect tables (`dem1820` POST 462-466)** + **★★ #128 Kingmaker / Master Kingmaker per-state bonus (`tedchange#POST 302-320`)** — CARRIED + EXTENDED + designer-RULED, HI-CONF (4 era + designer) | ready |
| **E20b** | **★★ [batch 15, NEW — PROMOTED from Decision-gated] #18 canonical meter→election SCORER — V's 2-LAYER model (S–M)** | **The `metersToElectionBonus`/state-application map the roadmap has tracked since batch 8 — now SETTLED and ready-to-build.** Batch 10 gated the meter→election STATE-SCOPE as a 3-way fork; batch 11 narrowed it; **batch 15 RESOLVES it to V's CANONICAL 2-LAYER model** (Ted, the DESIGNER, reversed his OWN "every state" reading to V's 2022 intent, `terror2000` POST 913-926), so **#18 LEAVES the Decision-gated user-gated bucket and becomes ready-to-build.** Build a **2-LAYER map** at `calcStateVote` (`phaseRunners.ts:3709-3711`, which today applies enthusiasm UNIFORMLY with NO per-state penalty): **(LAYER 1) a UNIVERSAL per-ideology meter modifier applied FLAT to ALL candidates of that ideology — BOTH parties, every state, in primary AND general** (concrete modern table: Rev-Budget → Lib +1 / Trad −1; Honest-Gov → corrupt-incumbent +1, Integrity-vs-Controversial-challenger +1, LW/RW-Pop −2, Prog −1; QoL → Cons/Trad +1, LW-Pop/Prog −1; Planet → RW-Pop +1, Prog −1) — this is the "every-state-unless-penalized" reading `dem1820` published; **(LAYER 2) per-ideology ENTHUSIASM as a SEPARATE per-party (per-state-bias) bonus layered on top** — NOT the meters moving enthusiasm. **Composes with two existing pieces:** the **#51 4-step reshuffle algorithm (E23)** writes the per-party enthusiasm boxes Layer 2 reads, and the **QW3 ±3-per-phase cap** clamps the ideology+party-pref swings (state-specific bonuses uncapped). Net effect: meters now bias elections through the documented "State of the Meters" table, not the flat uniform nudge shipped today. Keep `legislativeScoring` (E20) as the `Faction.score` ledger; this row is purely the meter→election application. **NOT a keystone — an attractive near-mid-tier modern-engine win.** **⚠★★ Batch-19 ENTHUSIASM FROZEN-SPEC RISK FLAG (`fixes2022` provenance):** the per-ideology ENTHUSIASM half of this scorer (#18/#51/#124) is the system the designer **re-implements differently each playthrough** — Anthony stalled ~½ into phase 2.1 on it; emails "didn't bring [Ted] any closer to being confident"; vcczar "implement[s] it a new way accidentally" (`fixes2022#POST 713-716`). **This is the single likeliest place the build drifts from designer intent — build the Layer-2 enthusiasm boxes (E23's #51 4-step, §29.10) + this Layer-1/Layer-2 split (#18, §29.3) EXACTLY as recorded; do NOT re-derive at `calcStateVote`.** Confidence/risk annotation only — NO code/scope change. | E6 (meter bank + the ±3 cap), **E23** (the per-party enthusiasm boxes Layer 2 reads), E20 (`Faction.score`), **QW3** (the ±3 cap); the **E3/#152 President-loss term feeds into Layer 1's per-pol modifier** | S–M | gap **#18 (`gilded` 266; `fed` 607-609; `1772s` 25/49/90; `modern` 114/424/1742/2061; `dem1820` POST 569/575/618 every-state-unless-penalized; ★★ `terror2000` POST 913-926 RESOLVES to V's 2-LAYER model — universal flat per-ideology meter modifier + separate per-party enthusiasm layer; ★★ `ideo1928` — the 2-layer model ran LIVE at the 1932 Hoover-v-Roosevelt PRESIDENTIAL general, a 6th-era corroboration; ★★ batch-19 FROZEN-SPEC risk flag — freeze the #18/#51 model, the perennial designer re-derivation, `fixes2022#POST 713-716`, game-mechanics §29.3/§30.10; **★ batch-23 2nd-source 2012-boot corroboration — the 2-layer scorer ran LIVE again at the 2012-start primaries+general with the "PRE-MIDTERMS STATE OF METERS" published VERBATIM (`pop2012b`), reinforcing the FROZEN SPEC**)** — CARRIED + PROMOTED (LEAVES Decision-gated user-gated) + FROZEN-SPEC-FLAGGED, HI-CONF (6 era + designer-RULED + earliest-discussion provenance + 2nd-source 2012-boot) | ready (PROMOTED batch-15) |
| E21 | **Bill-driven statehood + ORGANIZE→ADMIT two-step + auto-generated officials (incl. era-gated admission + the territory-gate, batch 7)** | Statehood/territory bills route → `admitState` (`territories.ts:8`, idempotent, today only 1772 era-event `postEffects`); event/war annexation; **filler officials via E8's generator**. Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories. **Add per-(state, era) admission gating** (the hook E3b's Canada arc #60 rides: 1856 Quebec→statehood directly, Ontario must be a territory, NL/NM/Utah locked until Gilded). **Batch 7 (#95) — the `Territory.organized: boolean` ORGANIZE→ADMIT two-step + the unorganized-territory draft gate** (land you own but haven't *organized* has undraftable/unrelocatable pols until an organizing bill passes — LA-Purchase land, Michigan; some admissions skip the territory stage: ME/WV/TX-from-Republic/VT/CA + the 13 originals) — **this is E4b(c), and it uses the SAME `territoryOwned` predicate as K3's era-content gate (§9.1.5): one predicate, three consumers (bills, era-events, draft pool).** Class-I/II/III senator-rotation + EV join on admission; sabotaged-enabling-vote → +1-bias seed. | E2 (bill route), E3 (war annexation), E8 (filler officials), **K3's `territoryOwned` predicate** | M | gap #43 (`fed`) + per-era gate (`hd` I-5 / #60) + **#95 organize→admit (`rep1800` §A/§B/§C)** — CARRIED + EXTENDED | ready |
| E22 | **Gilded scenario [#41 — ★★ batch-14: `gild1868` is now its FULL NATIVE SPEC]** | The Gilded-Age scenario boot, **once `advanceEra` (K3) + the action libraries (E11–E13) + the CPU handler suite (E9) are mature** (§9.1.1) **and AFTER `scenario1788` (E1) — `scenario1868` is "another scenario-as-data-row" through the K4 `BootSheet`/`scenarioBoot` pipeline (§9.1.9), NOT a bespoke Gilded code path.** Gilded issue *shells* (tariff integer from E18d, `MonetaryRegime` enum, civil-service/anti-corruption, imperialism naval bases) get a data home here; the **playable depth of those shells lands at the EG gilded-era content epic below.** Resolves the gilded-enum question (K4 adds `gilded` between `nationalism` and `modern`). **★★ Batch-14 — `gild1868` (the first dedicated native-1868 campaign, the LARGEST thread in the KB) is the FULL NATIVE SPEC for this scenario:** the **red/blue-FLIPPED faction roster** (by 1868 the parties have INVERTED — **RED = Republicans** [Grant, bloody shirt, Reconstruction, tariff/business, Stalwart/Half-Breed/Mugwump], **BLUE = Democrats** [Solid South, Tweed/Tammany, soft-money/Free-Silver], `gild1868` POST 6 — the OPPOSITE of the founding-era BLUE = Dem-Rep frame, so the era-content-band model [K3/K4] must carry **party-label-by-era**, not a fixed RED/BLUE↔party mapping), the Gilded **nickname table** (Stalwart/Half-Breed/Mugwump/Bourbon/Readjuster…), the **era-event spine** (Philippines-from-Spain, women's-suffrage A/B, census EV deltas, Labor Unions/RJ Reynolds/Vaudeville/Twain/Nast/steamships), the **bill catalog** (tariff-rate / currency-regime / civil-service / ICC / statehood), the **SCOTUS docket** (Elk v Wilkins, Allgeyer v Louisiana), and the **20-yr Reconstruction timer** (#148, lives at E3b). **The deep gilded SYSTEMS (#147 tariff-rate+MonetaryRegime, #149 civil-service, #150 1872-rule, DH-63) are split out into the EG epic below** (downstream era-content, gated on K3/K4 + #116/E4c + #42 + #57/E3b). | K3, K4 (incl. the `gilded` enum + the `scenarioBoot`/`BootSheet` pipeline), **E1 (`scenario1788` ships first)**, E11, E12, E13, E9 | M–L | gap #2, #3, #41 (`gilded`; **★★ `gild1868 (b14)` — full native spec: faction roster POST 6, nickname table, era-event spine, bill catalog, SCOTUS docket, 20-yr timer**) — CARRIED + STRENGTHENED |
| **EG** | **[batch 14, ★ NEW] Gilded-era content epic — tariff-rate + `MonetaryRegime` (#147) + civil-service merit-vs-spoils (#149) + the "1872 Rule" special election (#150) + DH-63 exclusivity *(DOWNSTREAM era-content, NOT a near-term quick win)*** | **The five batch-14 `gild1868` deltas are ONE downstream era unit (§9.1.10), NOT five backlog rows** — the playable depth behind E22's Gilded issue *shells*. Split into sub-PRs: **(a) #147 tariff-as-%-rate + the mutually-exclusive `MonetaryRegime` (M)** — add `game.tariffRate: number` set/changed by a `"Set Average Tariff Rate to N%"` bill type (+ a "standardize and reform" lower-rate variant), subject to the federalism §20.4 tariff change-CADENCE; add `MonetaryRegime = 'gold' | 'bimetallic' | 'freeSilver' | 'nationalBank'` where the regime bills are **MUTUALLY EXCLUSIVE** (passing one clears the others). Replaces the ±0.5 flavor bill at `phaseRunners.ts:3421-3422` (verified: tariff is "Tariff Increase" `meters:{revenue:1,economic:-0.5}` / "Tariff Reduction" `{revenue:-0.5,economic:0.5}` today — NO `game.tariffRate`, NO `MonetaryRegime`; `Legislation` `types.ts:1506` has no `type`/`replaces`). `gild1868` floors competing literal rate-bills ("Set average tariff rate to 36%" vs "to 25% and reform," POST 6240) + gold/bimetal/national-bank regime bills (POST 836, 884). **Distinct from #3** (the static tariff/currency *axes* at E18d) — this is the *played* tariff/currency engine. **(b) #149 civil-service merit-vs-spoils axis (S–M)** — a merit-reform bill (the in-game Pendleton Act, passes the 41st Congress, POST 842) that shifts how appointments are filled + the **State-Gov-Jobs spoils lever** feeding DomStab (Increase/Decrease State Gov Jobs gov actions, POST 770/803) + the Honest-Gov't / corruption interplay; **gate reform content** (Social Mobility gov action, income-tax bill) to the Progressive era via the era-content registry (POST 811, 2936). Sharpens #3. **(c) #150 the "1872 Rule" disorganized-loser special-election branch (S, niche)** — a meter-gated branch around `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`): at the first election after Reconstruction begins, if party-pref is Red+2/+3 AND a d6 lands 1-2, field an opposite-party-INDEPENDENT nominee run by the loser's WEAKEST faction (rule 3.0.17, POST 49/774-775); pairs with #57/#148 + the #48 third-party trigger. **(d) DH-63 currency-regime exclusivity — FOLDS INTO #42 + #147's MonetaryRegime (XS–S, no standalone work)** — make currency-regime bills a mutually-exclusive set in the bill-relationship graph: activating one auto-deactivates the contradictory regimes (today Bimetallism AND the Gold-Standard Act can both be active, `gild1868` POST 6245-6246, because `Legislation` has no `type`/`replaces`); also flags the filibuster carry-over ambiguity (POST 939 — matches the `drums`/`hd` open Q on #10). **★ DOWNSTREAM era-content, NOT a near-term quick win** — the tariff/currency systems need the economic-content state machine and the bill-relationship graph to EXIST first; build this AFTER the era model + the economic engine land. The umbrella `gilded` era + `scenario1868` lives at E22/#41; **#148's 20-yr Reconstruction timer rides E3b, not here.** | **K3/K4** (the `gilded` enum + the era-content-band registry — era-gating for #149's reform content + #147's §20.4 cadence), **#116 / E4c** (the Jacksonian→Gilded economic content state machine #147's tariff/regime bills extend), **#42 / E2** (the bill-relationship/replacement graph — `Bill.type`/`replaces` for #147 + DH-63 exclusivity), **#57 / E3b** (Reconstruction-begins gate for #150 + #148's regime); E22/#41 (the `gilded` era + scenario this content fills) | **M (#147) + S–M (#149) + S (#150) + XS–S (DH-63 folds into #42+#147); ~M–L total (split 4 sub-PRs)** | gap **#147 tariff-rate + MonetaryRegime (`gild1868` POST 836/884/6240/6245-6246)** + **#149 civil-service merit-vs-spoils (`gild1868` POST 1/770/803/811/842/2936)** + **#150 "1872 Rule" special election (`gild1868` POST 49/774-775)** + **DH-63 currency-regime exclusivity (`gild1868` POST 939/6245-6246)** + #3 tariff/currency axes — NEW (batch 14) | ready |

### Engine track — Phase 2 (FAR-END modern epic — builds LAST, after gilded)

> The **deep-modern subsystems** — they sit at the end of the timeline and depend
> on the meter bank, the action libraries, and the scaling walls all landing
> first. Build them **after E22 (gilded)** (§9.6 Phase 2). The cross-cutting items
> the modern thread *also* surfaced are already pulled near-term into Phase 1
> (E6/E7/E8) — these rows are only the era-deep work.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E23 | **Enthusiasm / Party-Pref engine + Score economy [#51 — ★ batch-11: FORK-RESOLVED, the 4-step rule is now SETTLED]** | The **4-part reshuffle** after legislation scoring (`hd` dominant-party point-impact: most/least-earning faction shifts ±1, opposition-least +2 "furious"; `drums` independently confirms 4-step across a 3rd era POSTS 50/86/295/442/2537/2726/2879/3115) over the existing `enthusiasm`/`partyPreference` tables; `Faction.score` ledger (from E20) + **era-end awards + per-era banking (handled by K3) + lowest-faction-penalizes-teammates**. Wires into E6's `metersToElectionBonus`. The spine of the modern election engine. **★ Batch-11 (#51) — PROMOTED, the model is now SETTLED.** `dem1820` exposed a 3-way GA-vs-designer fork; the `arkzag` final chunk **published the 4-step rule VERBATIM and it MATCHES `drums`** (NOT Ted's "every state", NOT Matt's "primaries only"). Build the canonical 4 steps per Congress's by-card→by-faction legislation tally — **(1)** faction with MOST pts for the dominant party → its cards +1 enthusiasm toward the dominant party; **(2)** LEAST pts for the dominant party → −1 away; **(3)** MOST pts for the opposition → +1 toward the DOMINANT party ("taking care of their needs"), only if it gains pts; **(4)** LEAST pts from the opposition → +2 toward the OPPOSITION ("furious at the incumbent"), even if it gains pts — **shifts STACK** (`arkzag` ch33 POST 2530-2532). **Plus the −100/waiver crisis-bill-FAILURE rule:** a failed crisis bill normally scores −100 to the faction, **but the −100 is WAIVED if the bill conflicts with that faction's ideology → instead +1 enthusiasm** (ch24 POST 1993-1994). **The hard ±3 per-phase cap on ideology+party-pref swings is UNCONDITIONALLY ready and ships with E6** (it binds at `calcStateVote` `phaseRunners.ts:3709-3711`; cap source `arkzag` ch33 POST 2438-2456 / `drums` POST 4574) — it is NO LONGER gated. **★★ Batch-15 — #18's meter→election STATE-SCOPE is now RESOLVED too (V's 2-layer model, `terror2000` POST 913-926) and PROMOTED to its own ready-to-build row E20b** (it LEAVES Decision-gated). **E23 + E20b compose:** this E23 reshuffle writes the per-party enthusiasm boxes that E20b's **Layer 2** reads; E20b's **Layer 1** is the separate universal per-ideology meter modifier. So the meter→enthusiasm→election chain is now FULLY un-gated end-to-end (reshuffle here → ±3 cap [QW3] → 2-layer application [E20b]). **⚠★★ Batch-19 ENTHUSIASM FROZEN-SPEC RISK FLAG (`fixes2022` provenance — the single likeliest place the build DRIFTS from designer intent):** ideology-enthusiasm (#18/#51/#124) is the system Anthony coded the rules-doc up to and **stalled ~halfway into phase 2.1 on**; vcczar *"sent him like four emails… didn't bring [Ted] any closer to being confident"* and **vcczar himself "implement[s] it a new way accidentally" each playthrough** (`fixes2022#POST 713-716`). So enthusiasm is not merely under-specified — the designer **re-derives it differently every time.** **TREAT THE #51 4-step reshuffle resolution ABOVE (drums-verbatim, §29.10) + the #18 2-layer scorer (E20b, §29.3) AS A FROZEN SPEC** — build the recorded model EXACTLY and do NOT re-derive from scratch. This is a CONFIDENCE/RISK annotation only — NO code change, NO scope change (the forks were already RESOLVED in batches 11/15). | E6 (meter bank + the ±3 cap), E20 (`Faction.score`), K3 (era-end awards/banking); **composes with E20b (#18 2-layer scorer)** | M–L | gap #51 (`modern`; `hd` 1394-7799, I-12; **`drums`** 4-step confirmed 3rd era + era-end POST 4477; **★ `arkzag` SETTLES the fork — 4-step verbatim + −100/waiver, ch33 POST 2530-2532 / 1993-1994 / 2438-2456**) + **★★ #18 state-scope RESOLVED → E20b (`terror2000` POST 913-926)** + **★★ batch-19 FROZEN-SPEC risk flag — enthusiasm is the perennial designer re-derivation; freeze the #51/#18 model (`fixes2022#POST 713-716`; game-mechanics §29.3 provenance note + §30.10)** — CARRIED + EXTENDED + FORK-RESOLVED + FROZEN-SPEC-FLAGGED, HI-CONF (4 era + native modern + earliest-discussion provenance) | ready |
| E24 | **Presidential primary subsystem (2.9.1) + Primary-Era opt-in (#63)** | Full subsystem: candidate eligibility + blocking (Iron-Fist PL blocks; running incumbent can't be primaried), focus-state charisma-trait table, numeric Strength score, per-Primary-Group loop (debate momentum / scandal / Broke check / actions). Uses the **CPU delegate engine** (from E10) + K2 primary action library + **K5 handler 9i** for CPU. **`hd` adds the emergent Primary-Era calendar (#63):** a Gov "Activate State Primaries" action (WTA/plurality/proportional + Primary-Group 1–5 assignment) flips a Primary-Era flag (primaries precede the convention), spreading by bill/Gov-action; Momentum carries between groups but halves when large; resign-to-run cascade. **`drums` adds the explicit CPU template** (fixed 5-action: Speech+Focus+Attack+Embrace+Promise; attack-target = highest-PV rival; presidential-promise acceptance < half-target; broke roll 5-6 → drop) — wired via handler 9i. New `needsPlayerInput: 'primary'` + `primary?` ledger. **The primary era is the modern toolkit that the pre-primary early-republic bands LACK (DH-35) — its unlock (the Primary-Era flag, gated on the 12A-era convention machine + #63) is what differentiates early-era from modern agency.** | K2, E10 (CPU delegate engine), K0, **K5 + handler 9i** | L | gap #47 (`modern`) + #63 (`hd` I-8; `drums` 5125-5732, 6754, 7135) + **DH-35 era-unlock (`rep1800` §A 3110)** + **★ batch-23 2nd-source 2012-boot corroboration of #47 — the full presidential primary subsystem ran LIVE again (Ron Paul wins the 2012 GOP nom; the 2012 GOP field of Rice/Thompson/Perry/Paul/Palin) from a 2nd, independent 2012 start (`pop2012b`)** — CARRIED + EXTENDED, HI-CONF (3 era + 2nd-source 2012-boot) | ready |
| E25 | **SCOTUS named-Justice docket (divergence #7) — incl. #79 10-yr drift via K5 handler 9n + ★ batch-12 #142 CPU CJ ladder + #132 Challenge-Legislation filter; ★ batch-12 SIMPLIFIED — amendments NOT SCOTUS-challengeable** | From-scratch over a **stub** (4 hardcoded titles + `partyPreference ±0.1`, `phaseRunners.ts:3398-3414`). Per-term case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, Iron-Fist/Manipulative compel-vote + compel-retire (12-yr min; **5 Judicial + Integrity = immune** — `hd`), dynamic court size + court-packing, 64/60% confirmation + moderate-auto-confirm recovery, appointee ideology reveal + **10-yr drift via handler 9n: 25% mid / 10% left / 5% right; Puritan blocks all shifts (#79 canonical, `drums` POST 7533)**, ruling→law-deactivation. **`hd` adds:** a **5-5 tie affirms the lower court & sets no precedent**, and a ruling can **block a whole bill class until an amendment passes** (couples to E5's #64 hook). **`drums` adds:** Manipulative-Pres compelled retirement = d6 5-6 (~33%; POST 1142); Iron-Fist compels cross-party justices without Integrity to vote Nay (POST 6293); SCOTUS sway = ONE vote per swayer + only if initial vote not unanimous (POSTs 4591, 4741, 5079). **Batch 7 adds:** **(a) the DH-32 guard — a STATE cannot be ruled unconstitutional** (one rule in the ruling-effect path: a territory can be revoked, secession is the only un-making of a state; `rep1800` "Pickens v. Maine's Existence" passed 5-1 and voided Maine AFTER a census counted it); **(b) the persistent `Cohens`-style ruling→bill-class rule-modifier (#94)** — the same SCOTUS-ruling-gates-a-bill-class shape E4b's slavery-abolition block rides (couples to E5's *Pollock* hook). **★★ Batch-12 (`smallbugs#POST 250-269` vcczar, game-mechanics §30.3) — AMENDMENTS NOT SCOTUS-CHALLENGEABLE: BUILD-TARGET SIMPLIFICATION.** vcczar's ruling **OVERRIDES `tea1772` #100**: Govs cannot challenge ratified amendments via SCOTUS. **★ DROP** the Gov-requested-judicial-review-of-an-amendment branch from this row's docket scope (the batch-8 #100 addition is SUPERSEDED — strike that whole sub-path). **KEEP** the strike-a-statute path, the DH-32 state-guard, the bill-class-block via amendment, Justice drift, court size, court-packing. Pairs with E5's same DROP. **Batch 8 also adds:** **(d) the DH-40 STALL guard — a SCOTUS-justice-COUNT bill must not strand the game:** if the establish-court bill passes but the justice-count bill fails (or vice-versa), the court is unusable and `tea1772` STALLED (an XS-S bug-fix — **package the two bills together OR guard the half-built-court stall**; this is the SCOTUS-establish half of the bill-packaging fix, the packaging half lives at E14b). **Batch 9 adds:** **(e) #112 — court size is LEGISLATED and variable, with excess-not-replaced semantics** (`nuke` §28.5: "Set SC to 10/5", court-packing-when-one-turns-70). Add a **`courtTargetSize` field** set by a bill (rides the bill-typing path E2) + the **excess-not-replaced** rule. Generalizes the dynamic-court-size/court-packing item already in this row. Gates BUG-2. **★★ Batch-12 #142 (`tedchange#POST 387-390`, game-mechanics §22.7.y) — CPU CHIEF JUSTICE SELECTION LADDER (XS, the ladder spec is FULLY AUTHORED):** **Highest Judicial ability from their party → multi-faction tie: own faction → Pres-ideology match → lowest-scoring faction; multi-candidate tie: matching-appointer-ideology → random.** Folds the existing CJ-replacement writer (`chiefJusticeId`) into a `pickChiefJusticeCpu(snap, vacancy, appointerFactionId)` ladder helper. **RULED by Ted (`tedchange#POST 387-390`; sharpens #52 player-SCOTUS fork — the CJ ladder is CPU-side regardless of which control-fork wins).** **★ Batch-12 #132 (`tedchange#POST 246-248`) — Challenge-Legislation Gov Action cannot target REPEAL bills** — wire a filter on the Challenge-Legislation action target list at this E25 docket / the E11 gov-actions surface (also QW14 standalone). **★ Batch-12 #131 (`tedchange#POST 277`) — Integrity pol cannot nominate Controversial pol** — extend the trait-aware `canNominate(nominator, nominee)` filter to CJ/Justice nominations as well as cabinet (also QW13 + E16). **★ Batch-10 — the SCOTUS DOCKET is needed EITHER WAY; only the player-vs-CPU control surface is decision-gated (#52, parking lot — user-gated):** `dem1820` runs a LIVE player-controlled court (delay/dismiss is a player action, votes by-ideology). **That fork does NOT block this row** — the per-term docket (`scotusCases<Era>.ts` + `GameState.scotusDocket`) is required whoever drives the votes (shipped court is a coin-flip at `phaseRunners.ts:3397,3648` with no docket). **Build the docket; gate only the player-input surface on the #52 pick** (delay/dismiss-as-player-action vs CPU-by-ideology). | K0, E5 (amendments + the bill-class-block hook), E2 (court-packing/set-count bills), **K5 + handler 9n**; **the player-input surface only is gated on the #52 decision (parking lot — user-gated) — the docket is not** | M–L (slightly REDUCED net by batch-12: drop SCOTUS-overturns-amendment branch; add the XS CJ ladder + the XS filters) | gap #52, divergence #7 (`modern`; `hd` 4616-8651; `drums` 39-7533 incl. canonical drift #79; **`dem1820` live player-controlled court — docket needed either way, control gated**) + **DH-32 + #94 rule-modifier (`rep1800` §B 3632, 3646-3652)** + ~~#100 amendment-review~~ **SUPERSEDED batch-12 / `smallbugs#POST 250-269`** + #100's threshold half retained + DH-40 stall-guard (`tea1772`) + **#112 legislated variable court size (`nuke` §28.5)** + **#52 by-ideology docket corroborated across the full arc + a CONTENT-SUPPLY gap (`arkzag` — Amistad/Barron-v-Baltimore/Antelope rulings, ch5 394 / ch13 71 / ch32; "40-Year Min Age for SC Justices" amendment recurs ch28)** + **★★ #142 CPU CJ ladder (`tedchange#POST 387-390`)** + **#132 Challenge-Legislation filter (`tedchange#POST 246-248`)** + **#131 Integrity nominator filter (`tedchange#POST 277`)** + **★ batch-12 amendments-NOT-SCOTUS build-target simplification (`smallbugs#POST 236-269`)** + **★★ `gild1868 (b14)` corroborates #52 from a native-1868 start (named-Justice docket: Elk v Wilkins, Allgeyer v Louisiana; 10-yr ideology drift; a court-size bill)** + **★ batch-23 2nd-source 2012-boot corroboration of #52 — the named-Justice SCOTUS docket + 10-yr ideology drift + Shenanigans + confirm-by-distance ran LIVE again from a 2nd, independent 2012 start (`pop2012b`)** — CARRIED + EXTENDED + SIMPLIFIED, HI-CONF (6 era + founding + native Gilded + designer-RULED + 2nd-source 2012-boot) | ready (docket); player-control surface decision-gated (#52 user-gated) |
| E26 | **Third-party challenge trigger (2.9.3)** | Party-pref-band + ideology-discontent check → spawn an independent ticket from the rule-selected faction; nationwide ballot for a Celebrity. **Fills the 2.9.3 stub.** **Rebalance the apparent Dem structural bias — DH-11** (Dems reportedly "won every instance a 3rd-party run mattered"). **★ Batch-9 (DH-55): the engine is 2-PARTY-HARD-WIRED + 3rd-party PV needs region-weighting.** `nuke` flags that a serious 3rd-party run is structurally near-impossible because the resolver assumes two parties and a 3rd-party candidate's vote isn't region-weighted (a strong regional candidate should over-perform in his region). When this stub is built, model **region-weighted 3rd-party PV** and ensure the spawn path isn't blocked by the 2-party assumption (pairs with DH-11 + DH-26's prohibitive-VP-trait, both already folded here). | E23 (enthusiasm/Party-Pref engine) | M | gap #48 (`modern`) + DH-11 3rd-party half (`hd` 7480-block) + **DH-55 region-weighted PV + 2-party-hard-wired (`nuke`)** — CARRIED + EXTENDED | ready |
| E27 | **Military-leadership appointment tier** | JCS / Army Chief / CNO / Generals / Admirals above the existing `GeneralInChief`/`Admiral` seats; auto-confirm; promotion back-fill; rank-mismatch + passed-over-resign rules. Feeds the generic-war per-battle modifiers (SecDef + Joint-Chiefs ×2, leading-officer ×10). Pairs with E3/E3b. | E3 (generic war), E16 (cabinet richness) | M | gap #49 (`modern`; pairs with `hd` #56; **`drums`** confirms officer KIA + replacement chain) — CARRIED, HI-CONF (3 era) | ready |
| E28 | **53-state roster + Wyoming-Rule apportionment + two-home-state pols + the focus-Rep (EV−2)/5 House abstraction (#55, batch-10 sized M)** | Modern 53-state roster (DC/CU/PR as full states); decennial recompute that resets EV + `bias` + adds/removes a focus-Rep (same `pendingEvDeltas` as E15, larger scale); `Politician.homeStates?: string[]` (audit relocation/Carpetbagger + kingmaker readers — also the alt-state add from #69). **Needs E7 (House-slate persistence) first** — the Wyoming-Rule House size (~572–601) is *why* wall (b) is a hard prerequisite. **★ Batch-10 — the House focus-Rep ABSTRACTION + seat-locked incumbency (#55, M):** `dem1820` makes the DESIGNED-not-shipped rep model concrete (vcczar ruling, POST 704) — represent each state's House delegation as **`(EV − 2) / 5` focus-Reps** with **seat-locked incumbency** (incumbents hold their seats EXCEPT in census/redistricting years), instead of the **full per-seat reps the engine ships today** (`scenario1856.ts:93` seats full delegations; `phaseRunners.ts:3913-3939` recomputes per-seat). This both **cuts the manual-upkeep burden** (the focus-Rep count is what makes a 53-state / ~572-seat House tractable — the DH-36 burnout argument) and is the unit the census recompute (#34) operates on. **Folds into scaling-wall-(b) (E7) + this census epic.** (vcczar's long-term wish is full per-district simulation [+30k pols] — a parking-lot "AMPU 2.0" alt, NOT what the build models; the build ships the focus-Rep abstraction.) | E7 (House-slate persistence), E15 (census-delta queue); **DH-49 population model (parking lot) for the EV/apportionment recompute** | M–L (+ focus-Rep M) | gap #55 (`modern`; **`dem1820` (EV−2)/5 + seat-locked incumbency, vcczar POST 704**), #34 (`modern`) — CARRIED + EXTENDED, HI-CONF (2 era) | ready |
| E29 | **Modern legislative depth (+ impeachment rewrite, batch 7 DH-33; ★ batch-12 #126 Pres 2-step Admin-then-Command blunder rule)** | Collective crisis-bill accountability (chamber lets most crisis bills die → controlling party loses Party Pref); bill-relationship/replacement graph (amendment-tier bills repealable only by amendment; downgrade-only policies) **[THIS is #42 — the home of batch-23 #175 below]**; **★★ Batch-23 #175 (MrPotatoTed designer ruling `pop2012b#POST 687-688` — the CONCRETE law-repealability DATA MODEL inside the #42 graph; S; game-mechanics §12.9, debt #55):** add **`Legislation.repealable: boolean`** + a **`lawClass: 'repealable' | 'replace-only' | 'permanent'`** tag — **repealable** (Repeal bill removes it via the normal pipeline; most policy bills), **replace-only** (cannot repeal, only SUPERSEDE with a same-kind bill — **tax + immigration** laws), **permanent** (irreversible — **statehood**; no Repeal-Statehood bill exists). Gate Repeal proposals on the flag; expose a **Replace** action for replace-only laws that supersedes (not removes) the prior law; mark statehood + other one-way structural bills `permanent`. Verified UNBUILT (the `Legislation` interface `types.ts:1506-1520` has NEITHER field; grep `repealable|lawClass` in `src/` = ZERO; the floor runner `runPhase_2_6_3_Floor` `:3498` has no repeal/replace branch — the existing #132 Challenge-Legislation-can't-target-REPEAL is a different guard). Binds at the `Legislation` type (`:1506`) + the proposal/floor pipeline (`:3431`/`:3498`) + **§27.5's statehood-by-bill at E4b (stamp every admit-state bill `permanent`)**. **★ This is the authoritative resolution of the `pop` §5.5 data-tag hole + the concrete form of THIS row's `Not repealable` / replace-by-X / amendment-tier constraints — build it WITH #42, NOT as a standalone.** **★ Open Q: authored repealable/replace-only/permanent per-bill LIST vs. per-row HAND-MARKING** (a content/authoring task that joins the **#120 dataset umbrella**, E18d). **Executive-Branch-Interference** (Admin 4–5 cabinet sec proposes dept bill w/ presidential assent; new-dept→new-seat). **#54 investigation committees already shipped at E14e** (5d6 spec ready). **DH-1 (filibustered MUST-pass remedy) still needs rules authored first** — author the deadlock rule, then build into E14c/here. **Batch 7 (DH-33): the impeachment ruleset is flagged broken/outdated across a 2nd campaign** (`rep1800` corroborates `hd`); only resignation avoids the DomStab/Honest-Gov drop. **The impeachment rewrite needs rules authored first (parking lot — DH-33 + DH-54)**, then built here. **★★ Batch-12 #126 (`tedchange#POST 159-164`, game-mechanics §14.1.y) — PRES IMPLEMENTATION 2-STEP ADMIN-THEN-COMMAND BLUNDER RULE (S, NOW CANONICAL — was OPEN as `cf82a7d3 §5a #3`):** verified shipped: no Pres-implementation path exists as a discrete code site — bill effects apply via `applyEffect` (`phaseRunners.ts:3209`) with NO Pres roll, NO Admin step, NO blunder. Ted's `tedchange#POST 159-164` publishes the **AUTHORITATIVE 5-tier Command-modifies-blunder table** (supersedes the fuzzy `cf82a7d3 §5a #3` "hybrid" wording): **Step 1:** Pres rolls Admin for impl (same as cabinet). **Step 2 (Blunder check):** Pres Command modifies the blunder — **Cmd 5 + relevant expertise = avoids blunder**; **Cmd 4 + expertise = 50% avoid**; **Cmd 3 + expertise = +1 to blunder**; **Cmd 2 + expertise = 50% chance +1**; **Cmd 1 + expertise = normal**; **no Cmd / no expertise = −2 to blunder** (unless Efficient on impl team); **Incompetent = −3**; **Easily Overwhelmed skips step 2 entirely.** Where it binds: the **Pres-implements-bill code in this row (`runPhase_2_6_*` extension)**, NOT in `applyEffect` itself (which stays the post-roll write). Size: S — a roll-table + a trait-gate; the trait readers exist. **NOW READY (was OPEN). RULED by Ted (`tedchange#POST 159-164`; SUPERSEDES `cf82a7d3 §5a #3`).** | E2 (bill typing), E14 (committees/filibuster); **DH-1 + DH-33 need rules authored first (user-gated)** | M (+ #126 S) | gap #54, #12b, DH-1 (`modern`) + **DH-33 (`rep1800` §A 465-474; §B 3594, 3620)** + **★★ #126 Pres 2-step Admin-then-Command (`tedchange#POST 159-164`; SUPERSEDES `cf82a7d3 §5a #3`)** + **★★ batch-23 #175 law-repealability DATA MODEL — `Legislation.repealable` + `lawClass: repealable|replace-only|permanent`; gate Repeal, expose Replace for tax/immigration (replace-only), mark statehood `permanent`; the concrete form of #42's constraints — build WITH #42; open Q authored-list-vs-hand-marked → #120 (MrPotatoTed `pop2012b#POST 687-688`; `types.ts:1506-1520`, runner `:3498`; game-mechanics §12.9, debt #55)** — CARRIED + EXTENDED + designer-RULED | **needs-design** (DH-1 + DH-33 user-gated); #126 + rest ready |
| E30 | **`scenario1948` modern continuation + the Cold-War boot (split from the single modern epic, batch 6; ★ batch-9 details the boot)** | The continuation-mode capstone: modern faction roster + nickname menu, modern era-event spine (fictional eras: **Nuclear Age 1948–2000 → Era of Terror 2000–~2005 → Era of Populism**), modern bill/issue catalog, modern card pool (Big Tech/Big Oil/Globalists/LW-RW Media — correct *here*). Reached via `advanceEra` (continuous campaign) from gilded **OR booted directly** via the K4 `BootSheet` schema. **★ Batch-9 (`nuke`) details `scenario1948` as a FOURTH distinct boot shape** (alongside 1772 / 1856 / 2012): **Truman/Barkley seated; 48 states** (AK/HI arrive later as statehood bills); **5R/5B with Dixiecrats INSIDE Blue + Reagan-a-Democrat** (the realignment start, #108); the full modern + Cold-War cabinet (CIA/FBI/UN/Fed/NSA/Key-Advisor + **8 ambassador nations incl. Ambassador to the USSR**); a ~6-yr era→year clock offset. **Cold-War "content" is DATA, not a subsystem** — the war runs on the generic war engine (E3), foreign relations on the diplomacy subsystem (E12); the Era-of-Terror content (#113) is one more authored era-content block. **State roster: 53-state Wyoming-Rule + 2-home-state pols** — the product of 60 in-game years' worth of annexation events. **Needs the modern dataset slice to get a curation + parity pass — DH-51: modern pols are OVERPOWERED / recency-biased** (fix at the `scripts/` pipeline before this ships). Rides the K4 `BootSheet` schema (`scenario1948`'s faction decks differ from 2012's — e.g. no "Trumpism" deck yet). **BLOCKED on DH-25 (career-track bootstrap) being authored first** — `pop` POST 33: *"we've legit been having this discussion for almost three years now"* (corroborated by DH-56's conflicting career-track rule-sets). **Dead last in the continuation chain** — depends on every keystone + most subsystems above. | K3, K4 (BootSheet), DH-25 resolved (parking lot), DH-51 dataset pass, and most of E1–E29 | XL | gap #2, #41, mechanics §22 (`modern`) + #86/#90 (`pop`) + **the `scenario1948` boot + #113 Era-of-Terror content + DH-51 dataset balance (`nuke` §28.1)** + **★★ batch-15 #113 native-2000 corroboration (`terror2000` — the FIRST NATIVE 2000-start confirms the whole Era-of-Terror band: 9/11 fires verbatim → War on Terror via the generic naval→ground engine [here LOST, #152]; the Patriot-Act surveillance/drone/DNI/deport docket; era-gated content [Space Force locked until Populism]; 2000/2004 real draft classes + designer/forum-user-as-pol)** + **★★ batch-20 `biden2021` MODERN-CONTENT TAIL — the 2021-2025 Biden content list EXTENDS the modern band past 2020 (IRA/Infrastructure bill splits, SC-reform amendments, the Israel-Hamas/Gaza/NATO event chain, climate pres actions, the 2021-2024 SC docket); maps onto the shipped `EraEvent`/`Predicate`/`addPolitician` model — CONTENT-authoring, NOT new architecture, folds in here / #92/#41 / §28.13. The ONE new MECHANIC in the thread is #169 (E15, NOT here). The "Pardon Controversial Allies/Family" pres actions BLOCK on #122 (pardon mechanics unspecified). All other modern presidents are done; Trump-2nd-term content deferred to ~midterms. Authored CHRONOLOGICALLY per the batch-20 import constraint.** — CARRIED + EXTENDED, native-modern-corroborated + modern-content-tail | **needs-design** (DH-25 only); rest ready (build last) |
| **E31** | **`scenario2012` fresh-modern boot — the canonical `BootSheet` instance (NEW, batch 6)** | A **second** capstone Phase-2 scenario, sibling to E30: a **fresh-modern boot** to 2012, the canonical `BootSheet` schema instance from §26.1 / `pop`. Pre-built sheet: **10 pre-built faction decks** (5 Blue + 5 Red — R1 = "Trumpism" RW Pop + Trad + Nationalist + Protectionist + RW Media + Isolationists; B1 = "Bernie-populism" LW Pop + Reformist + Welfare + Public Housing; etc.) + **per-faction archetype politicians** + **sitting government pre-loaded** (Obama + Biden + 7-Dept cabinet + 50-state Congress + 9-named SCOTUS justices, mapped to the 2012 historical snapshot) + **state roster: 50 + DC** (NOT 53 — `modern`'s 53-state alt-history is the product of 60 in-game years of annexation events, so the same `modern` enum has BOTH rosters; divergence #17 — registry keys on `{era, startYear}`) + **EXPLICITLY EMPTY at boot:** no faction leaders (selected after first general — AMPU primary where Major-eligibility falls back to generic 1-cmd + matching ideology + matching interest/lobby), no career-track pols (Zagnut "1996+, 1/track" houserule pending DH-25), no inherited PV/Kingmaker-Protégé/legacy. **Era-coded double-points issues** (#87): Climate Crisis + Immigration. **APOCALYPSE Planet Health clock** (E6) is live in this era. **Procedural pol generation starts in the 2020 draft** (#90 / rule 3.0.18; 1 new pol per state per cycle). **BLOCKED on DH-25 (career-track bootstrap) being authored first.** **The 2012 boot is the canonical `BootSheet` instance — schema instantiation, not new mechanics.** | K3, K4 (BootSheet — the canonical instance), E6 (APOCALYPSE clock), E8 (procedural pol-gen for 2020+), E23, E24, E25, E27, E28 (the 50+DC variant of the roster work); DH-25 resolved (parking lot) | XL | gap #86 (`pop` 1, 12, 17, 30, 38, 45, 50, 54, 264, 419, 422, 426, 475) + #88 + #90 + DH-25 — NEW | **needs-design** (DH-25 only); rest ready (build last) |
| **E32** | **(Optional, batch 7) `scenario1800` fresh boot — another `BootSheet` instance** | A **LOW-PRIORITY optional** later boot-sheet instantiation (§9.6): a fresh boot to 1800 with a pre-seeded Pres/VP/Cabinet/6-Court/Congress + a rookie draft, **NO faction leaders / career-tracks at boot** (the EXPLICITLY-EMPTY baseline). **NOT a priority** — it sits in the federalism→nationalism band that `scenario1788` (E1) + `scenario1856` (shipped) **already cover**; it adds no new mechanics, only another data instantiation. **Place it only once the K4 `BootSheet` schema + the early-republic subsystems (E4 12A toggle, E4b slavery-flag / Second Bank / statehood-by-bill) have landed** — at which point it's nearly free. | K4 (BootSheet), E1 (early-republic content), E4 + E4b (the early-republic subsystems) | M | **`rep1800` (the campaign itself; §9.6 batch-7 note)** — NEW | ready (build last, optional) |

> **★★ Batch-30 Phase-1 FOLD-INS (`revampPV`/`summer2021`/`ampuData`/`ampuUpdates`; debt #85-#90; dependency-
> ordered into the epics they belong to — NO new keystone, NO re-sequence, top-of-queue UNCHANGED).** The
> batch is DESIGN/DATA (no playtest); its deltas FOLD into existing epics rather than spawning new ones. **★
> THE PV-REWEIGHT BALANCE EPIC (E20b/E20 + `pv.ts`; debt #85; the back-half of the PV overhaul — the front-half
> #216/DH-77 are QW22/QW23 above):** **#214** (per-trait TIER table replacing the flat ±4/−5 + magic
> `Kingmaker +6` at `pv.ts:76-79`; **M-L**) + **#215** (per-ability decreasing-returns curve replacing flat
> `skill×weight×4`/`command×10` at `pv.ts:70-74` — first-point-worth-more, Command ≈25/level, Admin/Military
> low-floor; restrict-born-Command left OPEN as a toggle; **M**). **Build them as ONE PV-reweight PR**, AFTER
> QW22's #216 trait-name remap (un-applyable without it) and **GATED on the un-ingested "Groupthinking the
> Political Value" trait-EFFECTS thread** (vcczar's POST-33 list sets only POINT VALUES, not what each trait
> DOES). **★ MANDATORY same-PR coupling: re-tune `calcStateVote`'s `pv*0.1` (`phaseRunners.ts:3709`; `pv=
> c.pvCache` at `:3699`) — a PV reweight directly shifts election margins, the SAME election-balance surface as
> #18/#184/DH-72/QW19-21**, so this composes with E20b and must not ship the new PV ceiling without re-banding
> the election input. Keep office/age/FF terms ADDITIVE; do NOT double-count `flipFlopperPenalty` (`:86`); fold
> Kingmaker + Master-Kingmaker into the table (drop the `:79` `+6`). **(#220 display-scale is a Decision-gated
> (A) User-gated pick — raw "pink" vs 100-normalized — see that bucket.)** **★ #217 the president/cabinet
> IMPLEMENTATION sub-engine + ~30 governing traits → E16 (cabinet) + E6 (lingering/blunder); L, gated on
> federalism (E1) existing.** A post-legislation success→Blunder pass modified by expertise-gated genre traits
> + Delegator/Micromanager + Crisis-{Manager,Admin,Gov} (the Crisis-Admin 10/20% Lingering crisis-pull ON TOP
> of #179's cabinet rolls) + Passive/Predictable + Passive+Pliable PUPPET + Magician — **rides #179's roll
> engine (`phaseRunners.ts:3260`) + #182's action budget (`:3632`) + the §14.1.y/#126 2-step Admin→Command
> blunder rule.** De-dup vs Efficient/Egghead/Easily-Overwhelmed FIRST (vcczar kept overlapping traits,
> "slightly different"); these traits also need PV values (#214) + the remap (#216). **★ #218 Rule-of-Four/CJ
> case-refusal → E25** (a ≥4-Judicial CJ may refuse a Gov-Action state case; Rule-of-Four overrides; Iron-Fist
> CJ bypasses; Jurisprudence = unlimited; Passive = cannot refuse — **shares #217's Passive/Jurisprudence/
> Iron-Fist trait reads**; S, folds into the SCOTUS docket). **★ #219 US-Rep PROPORTIONAL representation →
> E14/E7** (each influential US Rep carries `floor(stateReps/influentialReps)` of the apportioned seats,
> remainder to the highest-Legislative rep; refines the #55 focus-Rep abstraction; S). **★ SMALL FOLD-INS
> #222–#227** (several `GM⇒App`): **#222** committee-size scales with state count (3→11 at 50; S → E7/E14,
> over the fixed 4-committee sort `phaseRunners.ts:1894-1928`) · **#223** chair-selection 25%→enthusiasm (XS →
> E7/E16, hooks #18/#51/#124) · **#224** lowest-satisfaction 25% AUTO-FLIP (S → the realignment/conversion
> cluster E9/#108; **DISTINCT from the explicit conversion AI #76** — an automatic defection triggered by a
> bottomed satisfaction meter, no conversion attempt) · **#225** Celebrity expiry if a pol runs before 40 (XS →
> E18/draft + the obscure cluster #136; reconcile with the `summer2021` Celebrity/Military-Leader merge + nerf)
> · **#226** Frail/Hale lifespan auto-traits (died<60⇒Frail, lived86+⇒Hale; XS — **a NEW `scripts/` DATASET
> rule, NOT engine**; folds into the #120 dataset umbrella E18d + `scripts/seedDataset.mjs`, alongside the
> `draftYear`/sub-floor rules) · **#227** Trim-Roster phase REMOVED (XS verify-only → the death/retirement
> cluster; **already aligned** — no Trim-Roster in `phases.ts`/`src/`; just confirm the `summer2021`
> random-retirement tuning [no random retire <60, one-term-loser 50%, losing-nominee-<60 25%] does the
> pruning). **★ DH-76 cloture** rides E9 9b (K5-dependent, debt #80/#208) — no re-size, it now just has its
> `summer2021` ORIGIN; **#115 generate-a-candidate** (sharpened: name-DB tagging + 1/9/20/20 tiering +
> lowest-score backfill) folds into the `scenarioBoot`/retro-gen cluster (K4, §9.1.9; overlaps #74). **NO
> re-sequence; the top-of-queue is UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1).** debt #85-#90;
> technical-guide §9 batch-30 lead + §8 debt #85-#90.

### Presentation track (parallel — separate workstream)

> Almost all of P0–P4 are **read-only views over snapshot data that already
> exists** — independent of the keystones/engine subsystems. Sync points are a
> handful of small additive `Politician`/`Party` fields + **two deeper handoffs**:
> A4 (battle-card) wires real numbers when **E3 (generic war)** lands, and **P2
> (portraits) shares the demographic model with E8 (procedural pol generation)** —
> P2 must render *generated* pols. **Hard constraint, encode from day one: no
> AI-generated imagery or text in the shipped product.** **A9 is NOT on this track**
> — it is a state-shape + engine UX requirement (it lives at E7).

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| P0 | **Ideology→color palette** *(cross-cutting foundation — do first)* | `IDEOLOGY_COLORS: Record<Ideology, string>` in `src/theme/` (the per-*ideology* legend; `Party.color` exists but this does not). Many P-track items consume it. Independent of the engine track. | — | XS | gap A2, §9.1 K1.5 (`1772s`) — CARRIED | ready |
| P1 | **Politician card + roster/congress restyle (A2/A3/A5/A6)** | "Sport-card" infobox (portrait/traits/stats/PV/office), always-on styled scoreboard, era-correct office titles, honorific-memory + "remembered for…" legacy lines (small additive `Politician` fields). | P0 | M | gap A3, A5, A6 (`1772s`) — CARRIED | ready |
| P2 | **Procedural portrait pipeline (A1)** *(no AI in product)* | CK2-style layered-sprite procedural portraits for the ~18.5k long tail + hand-art slots for marquee figures. Asset-pipeline + renderer epic. Only engine touchpoint: the additive `Politician.portrait?` field. **Must cover GENERATED pols** — shares the demographic model with **E8**. **Hard no-AI-in-product.** | P0; `Politician.portrait` field; shares demographic model with E8 | L | gap A1 (`1772s`; `modern`) — CARRIED | ready |
| P3 | **Election-result maps + iconography (A7)** | Election-result maps + era-correct national/state flags. Prototyped on 1856; most valuable after more states exist. **Batch-3 bar:** auto-generate the **53-state map + per-state popular-vote % atlas**. | P0 | M | gap A7 (`1772s`; `modern`) — CARRIED | ready |
| P4 | **Narration voice (A8)** | A `log.ts` output-quality bar (in-character narration density), not a schema change. Smallest; ongoing. | — | XS–S | gap A8 (`1772s`) — CARRIED | ready |
| — | **A4 battle-card** *(wired by E3)* | The itemized additive-odds battle-card (difficulty + planning + commander + meters → % victory). Build the card shell early; wire real numbers when **E3 (generic war)** surfaces the itemized odds — and reuse it for E3b's two-theater Civil-War battles. | E3 | S | gap A4 (`1772s`; `hd` I-1; `drums` formula) — CARRIED | ready |

---

## Later / parking lot

Bigger, fuzzier, deferred, or **needs-design-before-build**.

### Author-before-build (design tasks — a PM/design job, not a `/build-feature` run)

These have **no rules to build to yet**; the rules must be **authored first**, then
they fold into the engine row noted.

> **★★ Batch-20 — #168 is a PRE-BUILD AUTHORING-QUALITY PASS, NOT a scheduled code task (and
> NOT counted in the author-before-build total — there ARE rules; the work is standardize-and-
> audit, not author-from-scratch).** Recorded here as a **process gate paired with the #120
> dataset umbrella (E18d)**, run by the content authors before/alongside the era-content build.
> It produces: **(a)** a **terminology contract** the build must honor — ideology short forms
> (`LW Pop/Prog/Lib/Mod/Cons/Trad/RW Pop`, matching the `types.ts` 7-point scale), the Skills/
> levels/Experience/Interests vocabulary, the military-Experience → **"Army" rename** (a
> `dbomit` corroboration — "Army" is mislabeled as a *starting expertise*, should be Military),
> **human-rights → "criminal reform"**, demographic-category standardization (add Middle
> Eastern ethnicity, drop the no-op Protestant/White defaults, **"Crazy" trait permanently
> REJECTED — use Controversial**); **(b)** a **branch-path / meter-direction / %-multiplier
> sanity audit** of the AUTHORED content (the **DH-53 effect-SIGN family** — +budget meter must
> move + when it makes money; the Afghanistan-War-Phase-I multiplier; alt-state event enter/
> exit columns swapped; legislation repealability; the half-broken Split-Electoral-Votes gov
> action); **(c)** a **trait/interest compilation** (how each is gained + what each does).
> **The roadmap NOTES it; it does NOT schedule it as a `/build-feature` run.** Governance: all
> changes go through vcczar (`planb#POST 37`). It pairs with `scripts/seedDataset.mjs` (§7) +
> #120. debt #46; game-mechanics §30.11.2.
>
> **★ Batch-20 — the CHRONOLOGICAL-IMPORT pipeline constraint ORDERS the content work (not the
> engine track).** Anthony imports pols + events **chronologically** (he was on 1772-1774;
> everything else is edited from 1772 forward) and **all changes route through vcczar**
> (`planb#POST 37, 72`). **So per-era CONTENT authoring should be sequenced CHRONOLOGICALLY —
> founding before antebellum before modern** (the bill/event/SCOTUS catalogs the era-content
> epics consume, the #120 pass, the #168 audit). This does NOT reorder the dependency-ordered
> ENGINE track (keystones/subsystems stay dependency-ordered). A scheduling note, not a build
> item. game-mechanics §30.11.1. **★ Batch 9 adds TWO NEW author-before-build
items → 12 total:** **DH-49** — a **POPULATION MODEL + House cap** (the one
genuinely-NEW infrastructure item this batch: the per-decade census EV-reallocation
[K3 level (b)] and the Wyoming-Rule apportionment [E28] are un-implementable without
a per-state population model + a House-size cap, and **neither exists today** —
`State.electoralVotes` is a static seed; author it OR size it into the
census/apportionment epic E28 as its first sub-task); and **DH-54** — an
**impeachment / VP-vacancy / succession ruleset** (never in the rules doc across 3
campaigns; corroborates DH-33; folds into E10b + E29). **Batch 8 added ONE:**
**DH-41** — the general SCOTUS-ruling → downstream-statute cascade (UNBUILT,
`vcczar`-deferred; folds into the SCOTUS docket E25 once decided). **Batch 7 added
ONE:** DH-33 impeachment-ruleset rewrite (folds into E29) — plus a separate
**roadmap DECISION** (DH-34 static-era-biases — *resolved: ship static*; see the
note below, it is **not** an author task). **Batch 6 added ONE BLOCKER:** DH-25
career-track bootstrap (3-yr-stale design discussion; **BLOCKS Phase-2 modern
scenarios E30 + E31**). **Batch 5 added six items:** contingent-election rules
(#10/#84 is the biggest), §25.9 Iron-Fist split, DH-12 white-peace, DH-13
faithless-elector cap, DH-14 era-aware bill ideology, DH-15 small-state action
multiplier. **Batch 10 adds NO new author-before-build items** — its one new gap
(#115) is a buildable pipeline folded into K4 (not a rules-authoring hole), and the
**#115b** appointment-ladder is an XS item owned inside K4/E16. **Batch 11 adds NO
new author-before-build items either** — its two new gaps (#116 economic engine →
E4c, #119 amendment lifecycle → E5) are buildable subsystems, #61's succession ENGINE
is ready-to-build (its line-of-succession/impeachment half is the ALREADY-LISTED
**DH-54**), and DH-59/DH-60 are sized bug-folds. **★ Batch 12 adds ONE new author-
before-build item → 13 total: #122 PARDON MECHANICS** (entirely unspecified — no
rules in the doc; per Bushwa777 `smallbugs#POST 113`, what gets undone when a pres
pardons a Controversial pol with a scandal: trait, election malus, impeachment-
disqualification? what political cost on the pardoner? Pairs with the impeachment
machinery #112 + the resignation-while-impeached penalty pipeline + the cabinet-
Scandalous-Office-Holder loop; **author-time decision, no ruling yet** — folds into
**E29** when authored). The OTHER 18 batch-12 Ted-rulings are RULED + slotted (not
author-before-build), and #120/#121/#123 are dataset/content additions (not author-
before-build). **★ Batch 13 adds NO new author-before-build items** — its
buildable prerequisites (**DH-61** boot-seed active wars → K4 pipeline, **DH-62**
pre-12A EC mode → E4) are sized engine work that lands WITH E1, not rules-authoring
holes; **#143** is a RULED XS quick-win (QW17); the **#61 death-branch** is RULED
(re-scopes E10b); and its TWO open design calls (**OC-4** off-ideology draft gate,
**OC-8** define-an-office) go to the **designer-gated** Decision sub-bucket (waiting on
Ted/vcczar), NOT the author-before-build list. **★ Batch 14 adds NO new author-before-build
items either** — all five `gild1868` deltas are buildable engine work: **#147/#149/#150 +
DH-63** are the EG gilded-era content epic (downstream subsystems gated on K3/K4 + #116/E4c
+ #42, NOT rules-authoring holes), and **#148** is a sized S–M extension of E3b (the 20-yr
Reconstruction timer + appoint-by-Speaker/PPT-faction + Solid-South sunset). The Gilded
era + `scenario1868` is K4 content (#41/E22). **★ Batch 15 adds NO new author-before-build
items either** — all four `terror2000` deltas are buildable engine work (#18 → ready-to-build
E20b; #88 → E6; #152 → E3; #124+#151 → E16's 3rd re-scope; #153 → QW18; #154 → E16), and the
#18/#88 RESOLUTIONS plus the #124-percentages RESOLUTION are all settled-in-thread, not
rules-authoring holes. **★ Batches 16–28 add NO new author-before-build items** (all their deltas are
buildable engine work or rulings/annotations within existing epics). **★ Batch 29 (`wilsons1916`/
`welcome2future`) adds NO new author-before-build RULES hole, but surfaces ONE separate CONTENT-authoring
epic → the Era-of-the-Future PROPOSAL LIBRARY (#206, see below):** events for the Future band are
reportedly done, the missing piece is LEGISLATION ("not completely fleshed out… mainly I need more
proposals," `welcome2future#post 6`) — the same "events-before-legislation" content shape as the
Federalism spine; it is a content-authoring task (author the Future-band bill/proposal catalog as DATA),
folds into the era-content authoring (chronological-import constraint above) and the K4 era-content
registry / Phase-2 E31. The #206 enum-vs-data RESOLUTION itself is a K3/K4 ANNOTATION, not a rules-
authoring hole; the DH-14 reframe sharpens the existing era-keyed-bill-ideology author task (below), not a
new one. **★ Batch 30 (`revampPV`/`summer2021`/`ampuData`/`presidents`/`ampuUpdates`) adds NO new author-
before-build RULES hole** — all its deltas are buildable engine/dataset work or fold-ins (the PV overhaul =
QW22/QW23 + a gated balance epic; #217/#218/#219/#221/#222-#227 fold into existing epics; #226 is a `scripts/`
DATASET rule under #120/E18d). **But it records TWO things in THIS bucket: (a) HYGIENE — do NOT schedule** (so
a future roadmap pass doesn't re-add them): the `summer2021` **winning-party lowest-faction score penalty**
(ADOPTED-then-REVERSED, Ted's "nosedive" effect; do NOT reintroduce without a dead-last-whole-game guard,
#68/#102), the **randomized / Legis-weighted proposer** (REJECTED — the committee system was kept), and the
`revampPV` per-trait **"absence bonus"** idea (points for LACKING a trait — the additive PV model can't
express it, P37-39; a parked design idea, not a scheduled item). **(b) ★ CORPUS-COVERAGE / UN-INGESTED
SOURCES** (candidate future uploads — ask the human for exports before the dependent work): **(i)** the
`presidents` record names **≥7 un-ingested forum playtests** — highest-value is the **★ 1840-start
persistent-Whig ~100-yr run** (Harrison→…→Hearst, ~27 presidents, a Whig major party that never realigns; the
shipped build has **no 1840 scenario analog**) — get this BEFORE any 1840-start / Whig-realignment work; also
1868-Bushwa, a distinct 1960-start, 2016-start, 2024-start, three old-forum 1788 runs + an old 2000 run; and
**(ii)** the **"Groupthinking the Political Value"** trait-EFFECTS thread (what each trait DOES, vs `revampPV`
which set only POINT VALUES) — **this thread GATES the #214/#215 PV-reweight balance epic** (chase it before
that epic builds). A coverage/sourcing note, NOT a build item. **Total author-before-build RULES items: 13** (UNCHANGED)
(DH-1, #10/#84, §25.9, DH-12, DH-13, DH-14, DH-15, DH-25, DH-33, DH-41, **DH-49**,
**DH-54**, **#122 pardon mechanics batch-12**); **PLUS the batch-29 Era-of-the-Future proposal-library
CONTENT epic (#206), tracked here for visibility, folds into E31 / the era-content authoring.** **Decision-gated category — ★★ batch-15
RECOUNT −2: User-gated 2 (#52 + delegate-class — #18 state-scope RESOLVED OUT to V's
2-layer model → E20b) + Designer-gated 10 logical / 9 bullets (the #124-percentages gate,
B8+B9, RESOLVED OUT via the live 3-state tuning → E16).** Prior framing: batch 10 introduced
the category (#52 + #18/#51); the **#51 enthusiasm-SHIFT fork was RESOLVED** (`arkzag`
4-step → E23) and a **delegate-class fork ARRIVED**; batch 12 split it into user-gated +
designer-gated; **batch 15 removes #18 (user) + #124-percentages (designer).** See the
**"Decision-gated"** subsection below for the full per-bucket detail.

- **DH-1 — filibustered "MUST-pass" bill remedy (needs-design).** A required
  bill filibustered to death has no rulebook remedy; the GM improvised a
  4-leader special-committee auto-pass with a per-day "shutdown" penalty clock.
  **Author the deadlock-resolution rule** (forced-compromise vs shutdown-clock
  vs fallback auto-pass), then build into **E14c (filibuster) / E29**. — DH-1,
  debt #21 (`modern` 640-716).
- **Divergence #10 / #84 — Contingent-election rules don't exist (NEW, batch 5).**
  GM Tyler invented **5 candidate rulesets** to settle 1848 tie (`drums` POSTS
  472-474): party-line state vote / faction-first then party / Speaker-Min-
  Leader-controls-state / momentum+swaying / state modifiers. All 5 favored
  Fillmore; GM picked #4 (momentum) to keep play moving. **Author rules
  BEFORE build:** (a) top-2 vs top-3 (DH-6: GM used top-2); (b) outgoing-vs-
  incoming Congress (GM nebulous, used incoming POSTS 4467-4475); (c) deadlock
  side-effects (EBR POST 5250: Controversial gain on elected Pres + 50/50 Dom
  Stab hit); plus 17 state delegations for Pres + 33 Senate for VP (POST 810).
  **Bundles with hd #62 at E10b.** — #10/#84/DH-6 (`drums` 472-474, 810,
  4467-4475, 5176, 5217-5221, 5250).
- **§25.9 — Iron-Fist exact split shape (NEW, batch 5).** The 6 office-keyed
  child trait names + cascade rules need a designer call before build. §25.9
  lists 6 candidate effects (PL+Honest-Gov-maxed gov control; Sen Maj Leader
  vote forcing; President officer-fire / SCOTUS-compel / challenger-stifle;
  Loans-from-Wealthy + IF PL gov takeover; Convention PL unilateral threshold;
  mid-war military replacement) but the **exact names** and **what cascades to
  what** are open. Author the split, then build **E17**. — gap #77 + §25.9
  (`drums` 2433-7364).
- **DH-12 — White-peace rules MISSING from the war system (NEW, batch 5).**
  Tyler (`drums` POSTS 6533-6541): *"There are, in fact, no rules about white
  peace"* — had to dig up old treaty docs. **Author the spec** (Moderate
  Implementation Pres+Sec State+Sec War; 75% −1 Party Pref; −100 Mil-Industry;
  −500 Expansionists; −500 President; return to antebellum status quo), then
  fold into **E3** (generic war) / **E3b** (Civil-War readmission). — DH-12.
- **DH-13 — Faithless-elector trigger cap (NEW, batch 5).** Current trigger
  fires "whenever winner's state has the other party's ideology enthusiasm
  maxed" — over-aggressive (`drums` POSTS 466, 469-471, 2912, 4441): 1876
  produced 22 faithless from Cobb + 12 from Fremont; 1892 produced 8 Whig →
  232-232 tie → House contingent; 1900 had an 8-elector defection. **Author
  the documented + capped trigger** (e.g. max-N per state + state-modifier
  table) + the EBR deadlock side-effect rule (POST 5250). Folds into **E26**
  3rd-party or a per-(state) cap inside the EC tally. — DH-13.
- **DH-14 — Bill ideology impacts not era-aware (NEW, batch 5; ★ batch-29 REFRAME — it is a
  CPU-AI ARTIFACT, NOT a hard block).** Matt
  (`drums` POSTS 6691, 6878, 6912): Mods need to be removed from the
  negative-points side of Women's Suffrage in 1916 — should be era-sensitive.
  Tyler agreed. In the all-CPU `drums` run **Equal Voting Rights for Women never passes** (60.5% / 63.6%
  short of 2/3): GM: *"This amendment will never pass in a game with CPUs."* **★ Batch-29 (`wilsons1916`)
  REFRAMES this: the SAME 19th Amendment ("Equal Voting Rights for Women") PASSES in the 10-human 1916
  game (House 374-61, Senate 79-17, ratified)** — so the "never passes with CPUs" verdict is a **CPU-AI /
  era-ideology-weighting artifact, NOT a mechanical block** (logged as a ② opponent-half artifact in the
  GM-replacement lens). The fix is TWO already-queued things: **(1) THIS author task** — the era-keyed
  bill-ideology impact table (move Mods off suffrage's negative side in 1916) — AND **(2) a CPU vote model
  (#208 / E9 handler 9b)** that can reach 2/3 like a human field. No standalone work beyond authoring the
  table. **Author the era-keyed bill ideology impact tables**, then fold into the bill
  catalog (E14 / E20) + the #208 CPU legislative engine. — DH-14.
- **DH-15 — Small/large-state action-impact multiplier UNCODIFIED (batch 5).**
  Tyler (`drums` POSTS 6676-6680): *"Since RI is a small state he would only
  succeed on impacting the meter at 2.5% [half of 5%]; large states double."*
  In playtest sheets ("Effects Meters?" column) but **not codified in the gov
  actions section of the rulebook**. **Author the multiplier rule + the
  small/large-state classification table**, then fold into **E11** (governor
  actions). — DH-15.
- **DH-25 — Career-track bootstrap unresolved (NEW, batch 6 — BLOCKS Phase-2
  modern scenarios E30 + E31).** Lars (`pop` POST 33): *"we've legit been
  having this discussion for almost three years now and somehow we've yet to
  change the rulebook or the game."* For a mid-game boot, the question is
  "which existing pols start on career tracks (Foreign / Military /
  Industrial / Academic / Bureaucrat) at boot?" — and no canonical rule
  exists. **Zagnut's houserule on the table:** anyone drafted in 1996+ goes
  onto one track each (POST 31). Rodja hand-populated by GM ad-hoc (POST 38,
  50). **Author the bootstrap rule before `scenario1948` (E30) or
  `scenario2012` (E31) ships** — both are gated on it. **The single biggest
  parking-lot item from batch 6.** **★ Batch-10 — `dem1820` reconfirms + sharpens
  this AND surfaces the SELF-CONTRADICTION (#86/DH-25/DH-56):** the 1820 GA seeded the
  **inaugural career-track from the LAST-3 DRAFT CLASSES** (1820/1816/1812, POST 28) —
  a concrete bootstrap variant for the rule to choose among — and exposed that **2.1
  says career-track pols "can't run or be appointed" while many sections pull them by
  election/appointment** (the GA ruled to ignore the bar — a friction point in the
  DH-36 burnout). **Author ONE coherent career-track-eligibility rule here too** (run/
  appoint allowed or not), since the boot pipeline (#115) and the appointment-ladder
  (#115b) both depend on it. **★ The appointment-ladder (#115b) PAIRS WITH this item
  (XS, into the boot/appointment rules):** when a seat must be appointment-filled at
  boot, the deterministic ladder is **own-party-not-CT → own-party-CT → opposite-not-CT
  → opposite-CT → generate** (the order the GA improvised); it lives in `scenarioBoot`
  (#115 / K4) once this CT-eligibility rule is authored. **★★ Batch-18 (#163,
  `ideo1928`) — a THIRD bootstrap-variant data-point:** the GA pre-placed randomized
  statesmen onto career tracks at game start (by draft-cohort + ability) to fix the
  "generational pols stuck at floor stats" problem (the **Buttigieg problem**, POST
  32-41) — a GA house rule (NOT designer-authoritative) that joins this parking-lot
  item as another variant for the canonical rule to choose among (alongside Zagnut's
  "1996+ → one track each" and the 1820 last-3-draft-classes seed). The companion
  **#164 mid-government start-state question** (POST 184-188) folds into K4's
  `BootSheet` start-state field, not here. — DH-25 (+ #115b appointment-ladder;
  `dem1820` POST 28; #86/DH-56 CT-eligibility self-contradiction; **+ #163 career-track
  pre-placement house rule `ideo1928` POST 32-41**).
- **DH-33 — Impeachment ruleset broken/outdated (NEW, batch 7).** The
  impeachment mini-flow runs but the canonical rules are flagged
  non-functional / improvised — `rep1800` corroborates `hd`'s "impeachment
  super outdated and doesn't work" across a **2nd campaign** (an Integrity
  justice got accused of bribery — nonsensical; only **resignation** avoids
  the DomStab/Honest-Gov drop). **Author the impeachment rewrite before
  building it into E29** (modern legislative depth). — DH-33 (`rep1800` §A
  465-474; §B 3594, 3620; corroborates `hd` DH-14-impeachment).
- **★ DH-41 — general SCOTUS-ruling → downstream-statute cascade (NEW, batch 8
  — the headline batch-8 author-before-build item).** `tea1772` POST 124-126: a
  spectator argued **Prigg v. Pennsylvania** should auto-void the Fugitive Slave
  Act; `vcczar` **deferred** — *"V will need to think about it."* This is
  **distinct from the *built* strike-a-single-law** (`tea1772` POST 770-784) **and
  from #100's overturn-an-amendment-on-review** — it is the **general cascade**: a
  ruling that *contradicts a law on the books*. **Today a contradicting ruling
  leaves the law operative.** A genuinely undesigned policy: does the ruling
  void/neuter the conflicting law, or leave it operative (the current default)?
  **Author the cascade policy before building it**, then fold into the SCOTUS
  docket (**E25**). Cross-refs §24.4's *Pollock*→income-tax coupling (which IS a
  designed gate, already handled at E5/E25). — DH-41 (`tea1772` 124-126; cf. the
  built 770-784).
- **★ DH-49 — a POPULATION MODEL + House cap (NEW, batch 9 — the ONE genuinely-new
  infrastructure item this batch).** The per-decade census EV-reallocation (level
  (b) of the era model, K3 / §28.9) and the Wyoming-Rule apportionment (E28 /
  #34/#55) are **un-implementable without a real per-state population model + a
  House-size cap** — and **neither exists today** (`State.electoralVotes` is a
  static seed; there is **no population field** anywhere). Unlike most batch-9 items
  (which relabel/extend existing work), this is **new infrastructure.** **Author the
  population model + House cap before build, OR size it INTO the census/apportionment
  epic (E28) as its first sub-task.** Once it exists, the K3 census level (b) and the
  E28 Wyoming-Rule recompute both consume it. — DH-49 (`nuke` §28.9; the census +
  Wyoming-Rule items E28 / K3 depend on it).
- **★ DH-54 — impeachment / VP-vacancy / succession ruleset was NEVER in the rules
  doc (NEW, batch 9 — corroborates DH-33 across a THIRD campaign).** `nuke` (§28.5):
  there is **no impeachment trigger** (a Watergate-analog went undetected → pure
  upside) and **VP-vacancy fill was "made up as we go."** This corroborates
  `rep1800`'s DH-33 ("impeachment super outdated and doesn't work") + `hd` across a
  third campaign — the ruleset has never been written down. **Author the impeachment
  + VP-vacancy-fill + succession ruleset before building** the institutional layer:
  it gates the configurable line of succession + the acting-president gate (**E10b**)
  and the impeachment rewrite (**E29**). Pairs with #105 (stat-collapse→forced-
  resignation, the one *built-able* succession trigger). Distinct from DH-33 only in
  scope (DH-33 = "impeachment is broken"; DH-54 = "impeachment AND succession were
  never specified") — treat them as one author task. **★★ Batch-18 (DH-66, `ideo1928`)
  — now 3-THREAD-CONFIRMED BROKEN, and Ted is DRAFTING the rewrite (not yet final).**
  grep `impeach` across `src/` STILL returns ZERO — no trigger, article generation,
  trial, or removal. The "Improper SC Justice" general event triggered an impeachment
  trial that Jimmy + Ted **VOIDED mid-run** (POST 816-861) because the rules
  under-specify article generation, trial-firing, and the Controversial-vs-<3-judicial
  inconsistency; **Ted drafted a rewrite that is NOT YET FINAL.** This is the THIRD
  thread to confirm the subsystem broken (DH-33 `rep1800` + DH-54 `nuke` + DH-66
  `ideo1928`) — **STAYS author-before-build PARKING LOT; do NOT build against the
  current under-specified rules until Ted's pending rewrite lands** (game-mechanics
  §24.1.1). — DH-54 (`nuke` §28.5; cf. DH-33 `rep1800` + **DH-66 `ideo1928` POST
  816-861, 3rd-thread-confirmed, Ted-rewrite-pending**).
- **★ #122 — Pardon mechanics entirely unspecified (NEW, batch 12 — the one new
  author-before-build item this batch).** `smallbugs#POST 113` (Bushwa777):
  *"Pardon rules not spelled out. What happens if pres pardons someone? Do they
  lose traits they got like controversial? If not pardoned do they get retired from
  game?"* — **no follow-up in the thread.** Pardons interact with: (a) the
  Controversial-trait apparatus, (b) the impeachment machinery (#112), (c) the
  resignation-penalty pipeline (resignation-while-impeached = permanent −3 future
  elections / barred from appointment / loses Integrity), (d) the cabinet-
  resignation-and-Scandalous-Office-Holder loop (POST 618 — a fired pol can be re-
  appointed next phase). **Author-time decision; no ruling yet.** **Specify:** who
  can be pardoned (any non-impeached citizen?), what gets undone (Controversial
  trait? scandal trait? election malus? impeachment-disqualification?), the
  political cost (pardoning a Controversial pol = pardoner gains Controversial?
  Honest-Gov drop?). **Author the rules before building, then fold into E29**
  (modern legislative depth) + the impeachment/resignation pipeline. — #122
  (`smallbugs (cf82a7d3)` §4b POST 113).
- **★ Era-of-the-Future PROPOSAL LIBRARY — a CONTENT-authoring epic (NEW, batch 29; #206, debt #78).**
  NOT a rules-authoring hole (the #206 enum-vs-data question is RESOLVED — a K3/K4 annotation, see above)
  but a **content gap**: the terminal Future band's **events are reportedly done while its LEGISLATION is
  a stub** — dev, verbatim: *"not completely fleshed out… mainly I need more proposals"*
  (`welcome2future#post 6`). This is the SAME "events-before-legislation" content shape as the Federalism
  spine (DH-57/#177's authored-content side): author the **Future-band bill/proposal catalog as DATA** (a
  per-era era-content registry row of bills, with the #213/#171 era-keyed ideology framing + the DH-74
  `billProposable` preconditions so only legal Future-band proposals surface). It is the content half of
  what makes the terminal band PLAYABLE (paired with #207's completion terminus + #209's retro-cohort
  bench so the band has both rules-end and a populated bench). **Author the catalog, then fold into the K4
  era-content registry / Phase-2 E31** (the modern/future content tail). Chronological-import constraint:
  it is authored LAST (founding → antebellum → modern → future). — #206 (`welcome2future#post 6`; folds
  into K4 era-content + **E31**).

> **Author-before-build calls that are owned INSIDE a subsystem epic** (not
> standalone parking items — listed here so they aren't lost):
> - **DH-7** (R/D convention-threshold asymmetry + Iron-Fist unilateral change)
>   — document a chosen rule + re-gate the rules-change power inside **E10**
>   (handler 9e owns the CPU side).
> - **DH-8** (CPU convention AI unstable + ambiguous ballot-shift) — **owned
>   by E9 handler 9e** (the convention CPU handler) + **E10** (the player
>   convention epic). Ballot-shift = next-round (GM ruled).
> - **DH-9** (canonical exec/gov action ability-stat) — decide **at K2**,
>   before the action libraries author their `resolve` stat.
> - **DH-10** (blundered implementations still score) — a per-action
>   `blunderStillScores?` data flag, encoded at **E13**.
> - **DH-17** (convention auto-drop-out + 1-action/candidate cap) — fixed
>   inside **E9 handler 9e** (auto-drop-out after 2-3 ballots of 0 Momentum;
>   1-action cap replaced by Command-limited interballot actions).
> - **DH-18** (dark-horse compromise candidates dodge resignation rolls) —
>   fixed inside **E9 handler 9e** / **E10** (retroactive resignation rolls).
> - **DH-19** (CPU governor menu static; no industry-stack awareness) — fixed
>   inside **E9 handler 9j** + **E11** (state-stack-aware menu).
> - **DH-20** (CPU has no reciprocity / vote-trading) — fixed inside **E9
>   handler 9k** (the reciprocity enforcer; uses K5's `cpuCommitments`).
> - **DH-21** (CPU has no meter-guarding on event picks) — fixed inside **E9
>   handler 9g** (the A/B/C event vote + meter guard).
> - **DH-22** (cascading scandal sequencing hole) — fixed inside **E9 handler
>   9l** + **E15** (era-event extensions; uses K5's `recentScandalIds`).
> - **DH-23** (cabinet 36% pass-rate bug) — XS-S, **NOT a quick-win**; lands
>   inside **E16** (cabinet+confirmation system) as a sibling of the
>   cabinet-retention refactor + **E9 handler 9d** (CPU confirmation).
> - **Divergence #14 — APOCALYPSE meter-driven endgame (NEW, batch 6)** — folds
>   into **E6** (meter-model generalization) as a sibling refactor; `pop` POST
>   542, 548 documents the 10-yr Planet Health clock; model is meter-agnostic.
>   Phase 1, sized M (§9.1.4).
> - **Divergence #15 — Dynamic cabinet seat list (NEW, batch 6)** —
>   `cabinetSeatsForYear` becomes boot seed only; folds into **E16** sub-item;
>   bill-sign handler appends `Legislation.createsCabinetSeat?` payload.
> - **Divergence #16 — Amendments toggle CAPABILITIES (NEW, batch 6)** —
>   `requires?: AmendmentPredicate` field on `GameAction<Ctx>` at **K2 from
>   day one**; same field gates bill catalog entries + gov action rows.
> - **Divergence #17 — State roster keyed to `{era, startYear}` (NEW, batch 6)**
>   — folds into **K4 BootSheet schema** + **E28** (53-state roster) + **E30**
>   (`scenario1948` continuation, 53-state) + **E31** (`scenario2012`, 50+DC).
> - **Conditional-vote-rules primitive `compelledVoteRule?: Predicate → Vote`
>   (NEW, batch 6, `pop` POST 1111)** — the data lives on `Faction.factionLeader`
>   at **E19** (faction-personality); the consumers are **E9 handler #2**
>   (legislation, BEFORE the §25.6 heuristic) and **E9 handler #4** (cabinet,
>   subsumes auto-AYE-own-picks + SCOTUS within-1-step auto-AYE). Pairs with
>   E17 Iron-Fist split.
> - **DH-45 / DH-46 (NEW, batch 9) — diplomacy holes** — fixed inside **E12**
>   (diplomacy library): DH-46 add **downward pressure** on the 8 relation meters
>   (the US ends up allied with everyone) + a Cold-War ≤Neutral cap on USSR/China;
>   DH-45 re-tune the **USSR-collapse trigger chain** (stalls at a ~5% gate).
> - **★ DH-47 (NEW, batch 9) — wars never resolve / no army-navy-air branches** —
>   fixed inside **E3** (generic war): build a real **resolution/peace path** (Korea
>   ran ~2 decades; couples to DH-12 white-peace) + design the **branch model.**
> - **★ DH-48 (NEW, batch 9) — era-event data needs structured `evDelta`/census
>   fields** — fixed inside **K4** (era-content registry) + the dataset-build
>   validators (sibling to QW8/QW9); consumed by the **E15** era-event walker. The
>   Neocon census/EV events were LOST as free-text flavor.
> - **DH-50 (NEW, batch 9)** — era-event-scheduling holes → **E15** (the own-clock
>   content schedule, #109).
> - **DH-53 (batch 9, ★ SIZED batch-10) — bill→EV/meter STRUCTURED-effect tables, S**
>   — `dem1820` corroborates the sign-bug class from a 3rd thread (1820 laws mis-worded
>   "until passed −1 EV" vs "when passed +1 EV", POST 462-466). **Author the typed,
>   sign-checked per-bill effect schema** (incl. a per-state `evDelta`; `Legislation.effects`
>   has none today, `applyEffect` `phaseRunners.ts:3209` can't touch `electoralVotes`) →
>   **E20** (consumed by scoring) + **K4** (shares the DH-48 structured-`evDelta` shape).
>   NOT a sign-flip — an authoring item. (Was "bill-catalog completeness → E2"; the
>   batch-10 corroboration sizes + relocates it.)
> - **DH-52 (NEW, batch 9) — landslide-margin-cap / no close modern elections** —
>   an election-math BALANCE dial inside **E20** (the modern corroboration of DH-42).
> - **DH-51 (NEW, batch 9) — modern pols OVERPOWERED / recency-biased** — a
>   curation + parity pass at the **dataset pipeline** (`scripts/legislatorsToDataset.mjs`
>   or a sibling validator); blocks **E30** (`scenario1948`) shipping balanced.
> - **DH-55 (NEW, batch 9) — engine is 2-party-hard-wired + 3rd-party PV needs
>   region-weighting** — fixed inside **E26** (third-party trigger), alongside
>   DH-11 + DH-26.
> - **DH-56 (NEW, batch 9) — conflicting career-track rule-sets** — pairs with
>   **DH-25** (the career-track bootstrap blocker on the modern scenarios E30/E31);
>   author the one canonical rule there.
> - **DH-57 (NEW, batch 9) — convention holes** — fixed inside **E10** / **E9
>   handler 9e** (the convention CPU), alongside DH-7/DH-8/DH-17/DH-18.
> - **#115b (NEW, batch 10) — appointment-ladder + replacement-gains TIMING (XS
>   each)** — two XS rules on the boot/appointment path: **(1) the appointment-ladder**
>   (own-party-not-CT → own-party-CT → opposite-not-CT → opposite-CT → generate; lives
>   in `scenarioBoot` / **K4** + the cabinet path **E16**; depends on the **DH-25**
>   career-track-eligibility call); **(2) replacement-gains timing** — when a seat is
>   re-filled (a replacement officeholder appointed), the on-appointment gains must
>   apply at the right phase (the `dem1820` GA had to retro-fix stale gains — a sliver
>   of the DH-36 manual-upkeep burden the engine should own). Both are XS additions to
>   the appointment machinery (boot-time via #115; in-game via **E16**). — #115b
>   (`dem1820`; pairs with DH-25 + #115).
> - **★ NEW batch-12 — Ted/vcczar-RULED items owned INSIDE existing epics** (these
>   are RULED, not author-before-build; tracked here for fast lookup back to the row):
>   **#124 cabinet→enthusiasm rework (M)** → **E16** (re-scoped M, bundled with
>   confirmation system; numeric percentages designer-gated #8/#9 below); **#134
>   Lingering 7-step + tax/tariff carry-forward (M)** → **E6** (folds into the
>   meter-model + APOCALYPSE epic; same `runPhase_2_5_1_Lingering` surface); **#120
>   `smallbugs` dataset umbrella (M)** → **E18d** (one coordinated
>   `scripts/seedDataset.mjs` `CURATED_ROWS` pass; absorbs DH-43 / DH-51 / DH-28);
>   **#126 Pres 2-step Admin-then-Command blunder rule (S, CANONICAL — was OPEN as
>   cf82a7d3 §5a #3)** → **E29** (modern legislative depth); **#127 conversion /
>   ideology-shift schedule (S)** → **E5b** (ideology-circle helper PR; folds in
>   adjacency rule + LW↔RW 25% + auto-Two-Faced); **#128 Kingmaker / Master
>   Kingmaker scope (S)** → **E20** (binds at `calcStateVote:3711`); **#129
>   Kingmaker→Protégé trait allowlist (XS)** → **E5b** + Phase-1 #21; **#130
>   death/retirement schedule + Hale + Frail-first + ex-Pres-no-retirement (S)** →
>   **E18** (Phase-1 #19, pairs with QW7/#85); **#131 Integrity-can't-nominate-
>   Controversial (XS)** → **E16** + **E25** + diplomacy (also QW13 standalone);
>   **#132 Challenge-Legislation-can't-target-REPEAL (XS)** → **E11** + **E25** (also
>   QW14 standalone); **#133 1st/2nd CC composition rewrite (S)** → **E1** (rewrites
>   `continentalCongress.ts` + `firstContinentalCongress.ts`); **#135 50/50 House
>   inverse-control (XS)** → **E18** / standalone **QW12**; **#136/#137/#138 draft
>   re-rules (XS each)** → **E1** (federalism epic — draft logic is at scenario-boot
>   scope); **#139 Pres signature step in 2.6 (XS)** → **E18** / Phase-1 #2 / #14 /
>   standalone **QW15**; **#140 AnytimeEvo target-pool tightening (S)** → **E18** /
>   **E9** handler 9g; **#141 FL trait gain 5%+/3%- (XS)** → **E18** / standalone
>   **QW16**; **#142 CPU CJ ladder (XS)** → **E25** (the ladder is fully spec'd).
>   **#121 Secessionist trait (XS)** → **E18d** (dataset umbrella) + **E3b** sub-PR
>   (a); **#123 small late-modern content bundle (XS)** → Phase-2 **#28** / **#30**
>   modern-content rows. **All tagged with the originating `tedchange#POST N` or
>   `smallbugs#POST N` for traceability.**

### Decision-gated (NOT ready-to-build — split into TWO sub-buckets batch-12)

**The Decision-gated category now splits into TWO sub-buckets per the batch-12
authority-hierarchy update (Ted/vcczar > GA > inference, game-mechanics §30.4):**

- **(A) User-gated** (CARRIED — items waiting on the HUMAN's design call). These are
  NOT ready-to-build and are NOT author-before-build holes (rules EXIST — two or more
  competing models; the human picks). Then the item folds into the engine row noted.
- **(B) Designer-gated (NEW batch-12)** — items waiting on **Ted/vcczar** to close in
  `tedchange`/`smallbugs`. Ted floated each but did NOT finalize in the threads. **The
  roadmap-planner should NOT schedule these as ready-to-build until Ted/vcczar closes
  them.** Source: game-mechanics §30.2.

**Counts (★★ batch-15 recount −2):** User-gated **2 items** (#52 + delegate-class —
**#18 RESOLVED OUT**, was 3); Designer-gated **10 logical items / 9 bullets remain**
(**the #124-percentages gate — tracked as bullets B8 + B9 — RESOLVED OUT**, was 11). **★
Batch 12 added the (B) sub-bucket; ★ batch 13 added OC-4 + OC-8 to (B) (9 → 11); ★★ batch
15 removes TWO: (A) #18 state-scope is SETTLED to V's 2-layer model (`terror2000` POST
913-926) → PROMOTED to ready-to-build row E20b, and (B) the #124 numeric percentages are
LARGELY RESOLVED by the live 3-state enthusiasm tuning (`terror2000` POST 1280) → fold
into the E16 const table.** **#52 stays** (player-vs-CPU surface user-gated; the all-CPU
case is resolved by ideology-distance); **delegate-class stays** (AI-allocator vs
player-rigged, unresolved). The **−2 = #18 (user-gated) + #124-percentages (designer-gated,
the B8/B9 pair = one logical gate).** **★★ Batch-16 nets 0 — counts UNCHANGED (User-gated
2, Designer-gated 10/9):** no item enters or leaves either sub-bucket. **DH-29 was NEVER in
this category** (it was an E3b debt/DoD item, not a user/designer model fork) — vcczar
AUTHORED its fix (#156), so it moves from "debt item / open blocker" to "designed fix in
hand, build it inside E3b (d)," not into or out of Decision-gated. #156/#155/#157 are
buildable (no model fork); DH-64 is dataset maintenance (E18d). The four `hd1` cross-run
open questions (war-end multiplier 1.0/0.5; naval hard-gate vs continue-roll; war-hero
bonus permanent/one-term; #156-prerequisite hard-gate-all vs default-No-plan) are **TUNING
that binds inside E3/E3b**, flagged at game-mechanics §30.x for the human — NOT new
Decision-gated rows. **★ Batch-17 nets 0 — counts UNCHANGED (User-gated 2, Designer-gated
10/9):** no item enters or leaves either sub-bucket, and no new author-before-build item is
added. TWO forks RESOLVE OUT (neither was ever a Decision-gated-bucket item): **FL-on-death
→ immediate** (an open implementation fork, now ruled — shipped code still defers; the fix
is the `electFactionLeader(snap,f)` refactor in E16) and **#153 → 3-source canonical /
build-with-confidence** (was a 1-source XS quick-win, now canonical; QW18). The three
`ted1772` open questions (#158 flat-75%-oppose vs points-based anti-peace bias; the
negative-points 0-floor vs run-continuity negatives; St. Clair home-state PA-vs-OH when an
alt-state isn't owned) are **TUNING that binds inside E1/E3/E9**, flagged at game-mechanics
§30.x — NOT new Decision-gated rows. **#158/#159 are buildable (no model fork — #158's
flat-vs-bias is a tuning dial); DH-65 is dataset maintenance (E18d).** **★★ Batch-18
(`ideo1928`) nets 0 — counts UNCHANGED (User-gated 2, Designer-gated 10/9):** no item enters
or leaves either sub-bucket, and no new author-before-build item is added (**DH-66
STRENGTHENS the existing DH-54 impeachment item to 3-thread-confirmed** — a status change on
a parking-lot item, not a new bucket entry). The confirmation auto-pass is a **Ted RULING**
(`ideo1928#POST 213-214` — ready-to-build, NOT gated). The TWO open questions the batch
raises stay **human-gated TUNING, not blockers:** (a) the crash SEVERITY — one-shot meter
shock (trivially recovered in ~4 years) vs a persistent drag ordinary bills can't quickly
undo (binds inside E4c); (b) the mid-government start-state model — president-in-place vs
election-start vs historical-cabinet (#164, binds inside K4's `BootSheet`). Both flagged at
game-mechanics §30.9. **#160/DH-67/#162/#165/#166 are buildable (no model fork); the
confirmation auto-pass is designer-authoritative; #163/#164 fold into the existing DH-25 +
K4 boot work.** **★ Batches 19/20/21 net 0 — counts UNCHANGED (User-gated 2, Designer-gated
10/9):** no item enters or leaves either sub-bucket across these three batches. Batch 19
(`fixes2022`): #167 is a designer-authoritative procedure (ready-to-build, PPT-interim-first),
the enthusiasm freeze is a RISK ANNOTATION not a gate. Batch 20 (meta/design threads): #169 is a
designer-authoritative procedure with tuning guards, #168 is an authoring gate, `ampu2wish` is
quarantine-only. **★★ Batch 21 (`nixon1972`/`cpufull`/`trump2024`/`solo1916`):** the three
designer questions stay **human-gated TUNING within their epics, NOT new bucket entries** — (a)
**#158** which-way (HARD VETO vs points-based anti-peace bias — both meet the floor; binds inside
E3); (b) **#170** real-distinct-DNI/DHS-seat vs the DNI⇒CIA-Director supersession stopgap (binds
inside E16); (c) **#171** the exact ON→OFF boundary (keyed to §28.4/#108 realignment completion;
binds inside the #4/#108 work). #158's escalation is a PRIORITY change WITHIN the CPU/war track,
not a model fork. game-mechanics §13.2/§9.3.1.1/§4.1.w. **★ Batches 22/23/24 net 0 — counts
UNCHANGED (User-gated 2, Designer-gated 10/9):** no item enters or leaves either sub-bucket. Batch
22 (`modernday`): #172/#173 are buildable in existing epics (the #172 boot-flag-vs-derived question
is designer-gated TUNING within E16/E14c, NOT a new bucket entry). Batch 23 (`pop2012b`): #174/#175
are buildable in existing epics (the #174 `tedchange` cross-check + the #175 authored-list question
are designer/content-gated WITHIN their epics). **★★ Batch 24 (`grass1772`/`rookie1772`): #176 is
buildable in E1/E6 — its reverse-prereq question (adopt Cal's MilPrep prereq-reordering or keep the
founding military crisis) is designer-gated TUNING WITHIN the founding/meter work, NOT a new bucket
entry; the onboarding/solo-app/CPU-AI cluster (E9/K5 + DH-69) is a JUSTIFICATION raise on existing
items, not a model fork; the two minor war constraints (Planning-0-5 clamp + scripted-event win
path) are buildable in #155/#56. game-mechanics §17.4.** **★★ Batches 25/26/27/28 net 0 — counts
UNCHANGED:** no item entered or left either sub-bucket (batch-28's `GM⇒App` cluster all rides existing
epics WITHIN their own work). **★ Batch 29 (`wilsons1916`/`welcome2future`) nets +1 to (A) User-gated:
#207's COMPLETION-MODEL pick (year-cap vs open sandbox vs score-out) is a genuine human design call** —
the build has no terminal/completion state at all, and which terminus to ship is a product decision, not
something the build can infer (added to (A) below). Everything else in batch 29 is buildable WITHIN its
epic or is an annotation: #206 is a K3/K4/#92 data-model annotation (resolved IN FAVOR of the data-model
by the tech-lead — not a fork); #208/DH-76/DH-74/#209/DH-75 fold into E9/9b-9d + K4 + the officer filter;
the #84 smaller asks ride existing epics; #213's exact ON→OFF boundary is designer-gated TUNING within
the #171/#108 work (not a new bucket entry). **New User-gated count: 3 (#52 + delegate-class + #207).**

#### (A) User-gated (the HUMAN must pick first)

**A HUMAN must choose the canonical model first; the build cannot pick one on its own.**
Distinct from "Roadmap decisions" below, which are tech-lead/planner calls already made.

- **★ #52 — Player-controlled SCOTUS: ALL-CPU vs PLAYER-CONTROLLABLE-WITH-
  RESTRICTIONS vs TRAIT-GATED (DECISION-GATED).** `dem1820` runs a **LIVE player-
  controlled court** (votes by-ideology-chart, but **delay/dismiss is a player action**;
  dismiss only Gov-Action cases; must hear ≥1 per term) — which **RE-ENABLES the
  control `pop` POST 479-480 said vcczar DISABLED** mid-design. So the three live
  models are: (a) **all-CPU-by-ideology** (the shipped intent per `pop`), (b)
  **player-controllable-with-restrictions** (the `dem1820` live model), (c)
  **trait-gated** control (Iron-Fist/Manipulative compel only). **A human must pick.**
  **★ BUT THE SCOTUS DOCKET DATA STRUCTURE IS NEEDED EITHER WAY** — regardless of who
  drives the votes, the per-term case docket must exist: it lives in
  `src/data/scotusCases<Era>.ts` + a `GameState.scotusDocket` ledger (the shipped court
  is a COIN-FLIP — `phaseRunners.ts:3397,3648` — with no docket and no player surface).
  **So E25 (the SCOTUS docket, → Phase-2 #25) is NOT blocked by this fork — build the
  docket; the player-vs-CPU surface is what waits on the pick.** Verified shipped:
  `phaseRunners.ts:3397,3648` (coin-flip), no docket. — #52 (`dem1820` delay/dismiss-
  only live court vs `pop` POST 479-480 disabled; docket → **E25**).
- **★ #207 — TIMELINE-COMPLETION MODEL: year-cap vs open sandbox vs score-out (NEW
  batch 29, debt #79).** The build has NO terminal/completion state — the only terminal
  state is `game.gameEnded` (`types.ts:1635`) at ONE event-driven LOSS site
  (`phaseRunners.ts:2871`); `phases.ts` predicates are pure `year % N` with NO
  `endYear`/`maxYear`, and across the WHOLE corpus the Future band is defined-but-never-
  played-through (no thread hits an end-of-timeline terminus; `welcome2future`'s 2072 was an
  arbitrary author cutoff never reached). **What "done" means for a campaign is a PRODUCT
  decision a human must make** — three live models: (a) a **fixed year-cap** with a
  win/score screen (the cumulative era-bank scoreboard, #102/#68, decides the winner), (b) an
  **open sandbox** (play continues indefinitely past the last authored era — needs #209
  retro-cohorts + the #43 generator to keep the bench alive), (c) a **score-out** at a
  meter/era milestone. This is DISTINCT from the meter/scripted LOSS endings (#88/#188, which
  are configured loss ROWS on E6). **A human must pick the completion model**; then it builds
  as one end-state branch + a win/score screen at **E6** (alongside the loss model). — #207
  (`welcome2future#post 20`; `types.ts:1635`, `phaseRunners.ts:2871`, `phases.ts:49-58` →
  end-state at **E6**; pairs the #102/#68 cumulative scoreboard).
- **★ #220 — PV DISPLAY-SCALE: raw ("pink") vs 0-100/0-200 vs 100-normalized (NEW batch 30,
  debt #85).** The presentation/normalization side of the PV overhaul, left UNDECIDED in BOTH
  source threads. `pv.ts` exposes the **raw** `computePV` number (`pvCache`); there is no
  display-scaling layer. `revampPV` debated raw vs 0-100 vs 0-200 vs %-of-Napoleon vs %-of-best
  at length and **leaned raw ("pink") for HUMAN display** (scaled views bunch pols too close —
  Santos 22 vs Biden 28), with a normalized scale acceptable **only for a hidden/AI-only value**;
  `summer2021` POST 200-205 pulls the OPPOSITE way — a recalibration so the **top pol = 100** on a
  normalized scale (founding pols getting a larger *draft* value). **No final vote was taken in
  either thread.** So the build faces a live fork — (a) **raw-for-humans** (revampPV lean) vs (b)
  **100-normalized** (summer2021); normalized is acceptable ONLY if PV is hidden/AI-only. **A human
  must pick the human-facing presentation.** NOTE: the SEPARATE clamp-vs-offset half (replace
  `Math.max(0,…)` with a floor-offset so sub-zero pols keep ordering for the CPU) is NOT gated — it
  is the standalone XS quick-win **QW23/DH-77** above; only the human display-scale choice waits
  here. Folds into the PV-reweight epic (E20b/E20 + `pv.ts`) + #18/#192 (which assume raw PV) once
  chosen. — #220 (`revampPV` §6 D6/D7 / POST 16, 18, 20, 57, 66-91; `summer2021` POST 200-205;
  `pv.ts:88` clamp / `pvCache` raw → display layer at **E20b**; the clamp-vs-offset half is QW23).
- **~~★ #18 — Meter→election STATE SCOPE~~ ✅ RESOLVED batch-15 — REMOVED from
  Decision-gated → PROMOTED to ready-to-build row E20b.** `terror2000` POST 913-926
  SETTLES the fork to **V's CANONICAL 2-LAYER model** (Ted, the DESIGNER, reversed his
  own "every state" reading to V's 2022 intent): **Layer 1** = a universal flat
  per-ideology meter modifier on ALL candidates of that ideology, both parties, every
  state, primary + general (the "every-state-unless-penalized" reading); **Layer 2** =
  per-ideology ENTHUSIASM as a separate per-party layer on top. This is now the **E20b**
  ready-to-build row (binds at `calcStateVote` `phaseRunners.ts:3709-3711`; composes
  with E23 + QW3). **History kept below for the record; the fork no longer gates a
  build.** Batch 10 had this as the 3-way **#18/#51** fork; the `arkzag` continuation
  **RESOLVED the #51 enthusiasm-SHIFT step** (the 4-step rule, verbatim `drums`, NOT Ted's "every state"
  nor Matt's "primaries only" — now **E23, `ready`**) and **un-gated the ±3 cap**
  (ships with E6). So what REMAINS is purely the **STATE-APPLICATION step of the
  meter→election map**: does a per-ideology-card bonus apply to **every state unless that
  state penalizes the ideology** (Ted's reading) or only to **ideology-leaning states**
  (V's)? The `arkzag` model expresses the shifts per ideology card and leaves the
  state-application to the meter→election map (#18) — so this is the last open piece. **A
  human must pick.** Verified shipped: `calcStateVote` (`phaseRunners.ts:3685`, score
  `:3709-3711`) applies enthusiasm **UNIFORMLY with no per-state penalty** today.
  **Folds into E20/E23 (election math / enthusiasm engine) once chosen** — and does NOT
  block the E23 enthusiasm-SHIFT engine, which is `ready`. — #18 (`arkzag` resolves the
  #51 half → E23; `dem1820` POST 569/575/618 + `arkzag` ch15 POST 1230 state-scope fork;
  shipped `phaseRunners.ts:3685,:3709-3711`).
- **★ NEW (batch 11) — Convention DELEGATE-CLASS assignment: AI-ALLOCATOR-BY-EV-FORMULA
  vs PLAYER-RIGGED (DECISION-GATED).** `arkzag` exposes a GA-vs-designer fork: **Zagnut
  moved delegate-class assignment to AI-AUTO** (a published 5-category EV×1..×4 formula,
  "eliminates self-dealing + saves time", ch3 POST 276), but **Ted holds delegate-
  RIGGING is INTENDED design** — and the **1840 convention REVERTED to human-set
  classes** (ch32 POST 2466). So the two live models are: (a) an **AI/deterministic
  delegate allocator** (the EV×category formula, no player input), or (b) a
  **player-set/rigged allocator** (rigging as a feature). **A human must pick which is
  canonical** before the **delegate-apportionment sub-PR of E10** (the CPU delegate
  engine) and before **E24's primary-group apportionment** consume it — but it does
  **NOT block the rest of E10** (the ballot loop / inter-ballot library / platform/VP
  sub-PRs proceed; only the apportionment sub-PR waits). Pairs with #13/#71/#104
  (the lone-ideology delegate-sweep handling). — #13 delegate-class fork (`arkzag` ch3
  POST 276 AI-auto vs ch32 POST 2466 human-set; → E10 delegate sub-PR + E24).

#### (B) Designer-gated (Ted/vcczar must close — NEW batch-12)

**10 logical items Ted floated but did NOT close — 9 OPEN bullets remain after the
batch-15 −2 recount** (the #124-percentages gate, bullets B8 + B9, CLOSED via the live
3-state tuning; per game-mechanics §30.2).
Each is a LIVE design hole — distinct from user-gated items in that the rules are
authoritative-but-incomplete (Ted started the work, didn't finish). **The roadmap-
planner should NOT schedule these as ready-to-build until Ted/vcczar closes them in
`tedchange`/`smallbugs`.** When a designer-gated item closes, it moves to a roadmap
row (often as an XS-S addition to an existing epic).

- **(B1) Mil-Prep meter level 4 fix (designer-gated open).** Ted said "I'll check what
  I did" then "wasn't better" (`tedchange#POST 290-301`). Community has three
  proposals: **30/40/30** (Umbrella + `smallbugs#POST 579`); **30/60/10** (Eric
  POST 297); **40/50/10** (Nikk POST 300). **NOT RESOLVED.** Both `tedchange` and
  `smallbugs` have the bug logged but neither closes it. → folds into **E6** (meter-
  model) when closed.
- **(B2) ★ #125 Universal Election Modifier (UEM) (designer-gated open).** Ted
  proposed (`tedchange#POST 222-241`) a single +1/-1 modifier table applied to ALL
  elections (primary + general, all offices, all eras), with ~17 +1 traits and ~16
  −1 modifiers. **Community pushback on stacking + age modifiers** (Matt POST 225:
  "this is way too powerful as-is"). Ted did NOT finalize. **Major design proposal —
  the build should NOT pre-implement until finalized.** → would fold into **E20**
  (election math) + every election context when closed.
- **(B3) Crisis trait consolidation (designer-gated open).** Ted proposed merging
  Crisis Manager / Crisis Admin / Crisis Gov into a single Crisis Manager trait, or a
  2-tier Manager + Master ladder (`tedchange#POST 73, 77-87`). vcczar "will consider";
  **OPEN tending toward consolidation.** → folds into the trait union work when
  closed.
- **(B4) Term-limit Gov actions in pre-Senate era (designer-gated open).** Umbrella
  reported CPU running a term-limit Gov action in 1818 → state ran out of candidates
  (`tedchange#POST 356-367`). Two paths flagged: (a) **void Senator requirement**
  (Eric: 2.5.2 already has the conditional language); or (b) **move term-limit
  actions to Era of Federalism start** (Ark). **Ted didn't rule.** → folds into **E11**
  (governor's actions) when closed.
- **(B5) Faithless-elector mechanic rewording (designer-gated open).** Community
  agrees the current rule is "wonky" (`tedchange#POST 371-376`). **Ted didn't post a
  final wording.** Faithless-elector rule remains as-is. → corroborates DH-13 (also
  user-gated above); folds into **E26** when closed.
- **(B6) Party rename trigger — PL vs Era Evo (designer-gated open).** Matt proposed
  Party Leaders rename parties (like factions get nicknames, `tedchange#POST
  391-395`); Ark hashed in a separate thread; **Ted did not adopt.** ERA EVOs continue
  as the rename trigger (cross-ref §25.13 Whig→Conservative). → folds into **E19**
  (faction-personality / rename triggers) when closed.
- **(B7) VP-must-be-same-party-on-resignation relaxation (designer-gated open).**
  Vee01 proposed relaxation (`tedchange#POST 362`). **No follow-up.** Currently same-
  party-only is enforced. → folds into **E10b** (succession) when closed.
- **~~(B8) Cabinet enthusiasm percentages (the #124 numeric)~~ ✅ RESOLVED batch-15 —
  REMOVED from Decision-gated.** Ted's #124 rework was RULED IN CONCEPT (batch-12,
  `tedchange#POST 1-4`) with the numbers TBD; **`terror2000` POST 1280 (+ the #31 nuke
  rework) re-tuned them LIVE to a concrete 3-STATE per-faction enthusiasm channel keyed
  on wanted-lobby-POSTS — 0 wanted → "upset" (drop), 1 → "fine" (neutral), ≥2 → "happy"
  (rise), one roll per faction, ±3-capped.** Ship that const table as canonical at
  **E16's #124 sub-item** (re-tune only if Ted publishes finer numbers). **No longer a
  gate.**
- **~~(B9) Cabinet ideology weighting — Big-4 vs rest vs cabinet-level~~ ✅ RESOLVED
  batch-15 — REMOVED from Decision-gated (same #124-numeric gate as B8).** The live
  3-state tuning (`terror2000` POST 1280) resolves the weighting question alongside the
  percentages — the same E16 const table. → ships with **E16's #124 sub-item**. **No
  longer a gate.** *(B8 + B9 are one logical gate — the #124 numeric — counted as the
  single "−1 designer-gated" in the batch-15 −2 recount.)*
- **(B10) ★ OC-4 — CPU draft ideology-distance gate (designer-gated open — NEW batch-13).**
  The all-CPU 1788 run had **both left-of-center factions headhunt Andrew Jackson (RW Pop)**
  via the draft's 25% "go for the best off-ideology pol meeting the rolled goal" branch
  (`oopscpu#POST 227-228, 234-237`) — producing incoherent rosters AND trapping the strong
  pol (an off-ideology draftee can never become faction leader → can't run for President).
  Three live paths: (a) gate off-ideology draft like 2.1.6 (pliable + same/adjacent,
  Zagnut); (b) scrap draft restrictions wholesale (Kevin); (c) an existing per-era
  faction-switch option (Sauc/ebrk). **Ted wants "a better third way" — neither
  draft-strong-pol-off-ideology-but-can-never-lead nor strong-pol-uncontested-last-pick.
  OPEN — do NOT silently ship a hard gate.** → folds into **E1 / the draft pipeline + #72
  (candidate selection)** when closed. (The #146e 9th/10th-draft-bonus-to-first-PICK ruling
  IS closed and ships with E1; only the ideology-gate is gated.) — OC-4 (`oopscpu#POST 226-228,
  234-237, 252`).
- **(B11) ★ OC-8 — "What is an office?" definition + Scandalous-Non-Office-Holder event
  rewrite (designer-gated open — NEW batch-13).** The "Scandalous Non Office Holder" Anytime
  Evo's text says "force them out of office" yet it TARGETS a non-office-holder (text
  copy-pasted from "Scandalous Office Holder"). Ted flagged `@vcczar` (`oopscpu#POST 334, 336`):
  "We need to define what is and is not an office. **Is career track an office? Is faction
  leader and/or party leader (if they don't have another position) an office?**" — a request
  for a ruling, NOT a ruling. Affects every event keyed on "office"/"non-office" status
  (#140 AnytimeEvo target pools). **OPEN — needs a vcczar author call** (an is-an-office
  predicate + the event-text rewrite). It is the **events-side twin of OC-1** (OC-1 = the CPU
  recycles a scandal-resignee; OC-8 = the event can't even tell whether someone holds an
  office). → folds into **Phase-1 #19 / E9 handler 9g (AnytimeEvo target-pool spec, #140)** +
  the event-text rewrite when closed. — OC-8 (`oopscpu#POST 334, 336`).

### Roadmap decisions (a planner CALL, not an author task)

- **★ DH-34 — Static era-biases vs. policy-reactive biases → the Red-unwinnable
  "AMPU 2.0" hole (NEW, batch 7). DECISION: ship static biases.** The single
  most-repeated `rep1800` complaint: `State.bias` is a static per-era table that
  does **not** react to policy (abolish slavery → the South should swing Red, but
  doesn't), so the Federalists are acknowledged-**unwinnable 1800–1840** (Blue
  142-0 House by 1804; Jefferson 179-0 / 197-15) and players quit. The GM +
  designer's own stance: dynamic/policy-reactive biases are *"too complicated /
  not part of the AMPU vision… maybe AMPU 2.0."* **The planner must DECIDE: ship
  static (accept the imbalance — the cheap path the forum itself chose) vs. invest
  in policy-reactive biases (a large new system).** **Tech-lead's call, adopted
  here: SHIP STATIC for now** (it is the forum's own stance and the imbalance is a
  known-accepted property); revisit only if balance becomes a release blocker.
  **This means K4's per-era state-bias table swaps in wholesale at the boundary
  (#68 step 6) but does NOT react to policy.** Pairs with #21/#34 (bias as a
  field) + DH-29's solo-balance theme. — DH-34 (`rep1800` §A 22, 350, 720-747,
  1328-1335, 2444-2457, 2641, 2711-2713). **NOT an author-before-build item — it
  is resolved (ship static); no rules to write.**

### Balance dials (fold into the named subsystem; no standalone build)

- **DH-4** — cap "Extend Credit to all nations" → **E12** (diplomacy library).
- **DH-11** — apparent Dem 3rd-party bias → **E26**; inelastic lobby cards →
  **E19** (card algorithm).
- **DH-16** — reapportionment cap 435 likely never triggers in normal play
  (POST 5352: ~year 2000 before the cap binds). No fix needed; flag for the
  apportionment recompute (E28). — batch 5.
- **DH-26 — 3rd-party VP "same traits" rule is prohibitive (NEW, batch 6).**
  An independent presidential run requires *"a VP with the same traits"* as
  the presidential candidate (Lars `pop` POST 945-947), making 3rd-party
  tickets **nearly impossible** in practice. **Pairs with DH-11** (Dem
  3rd-party structural bias). Both 3rd-party design holes are addressed
  simultaneously inside **E26** (third-party trigger): relax the trait
  constraint AND fix the structural bias. → **E26**.
- **DH-28 — "Repeal climate crisis" tag completeness is gameable (NEW,
  batch 6).** Only some Repeal bills carry the "deals with climate crisis"
  tag (`pop` POST 552); players gamed this — bills that should affect
  Planet Health but aren't tagged slip through scoring. **Per-bill
  meter-impact tags must be complete and verified at dataset-build time**;
  generalizes to other meter-impact tags. Folds into the **existing
  dataset-regeneration scripts** at `scripts/legislatorsToDataset.mjs` (or
  a sibling validator) — a CI/dataset-time validator at the existing
  pipeline. Not a standalone build item. → **dataset pipeline (§7)**.
- (DH-3 / DH-5 / #85 were cheap enough to promote to quick-wins QW5/QW6/QW7;
  DH-24 / DH-27 promoted to QW8/QW9 batch 6; **DH-30 promoted to QW10 batch 7**.
  DH-31 → E2 [bill-typing]; DH-32 → E25 [SCOTUS docket]; DH-35 → E11/E13/E24
  [era-gate the action libraries]; DH-33 → author-before-build [E29]; DH-34 →
  roadmap-decision [ship static].)

### Deferred / parking lot

- **Multiplayer — hot-seat (M1).** Round-robin the existing `needsPlayerInput`
  mechanism (`engine.ts:9`) across human factions before `advancePhase`.
  **Hard-blocked on K0 (determinism) AND on K2 + all six action libraries AND
  on K5 + the CPU handler suite** — the player-input modalities *are* the
  action libraries, and any CPU faction in the rotation uses the K5 handlers.
  **`drums` (all-CPU) confirms solo + multiplayer are two modes of one
  engine**: the K5 handlers serve both cases identically — a human taking over
  a CPU faction mid-campaign just disables the handler for that faction
  (§9.5). Also needs the singleton refactor: `playerFactionId` →
  `playerFactionIds: string[]` + audit every "is this me?" call site (debt
  #10). — gap #1, §9.5.
- **Multiplayer — async / backend (M2, L–XL epic).** IndexedDB is per-browser
  (`db.ts`); shared state needs a server (or CRDT/host-authoritative sync).
  Hard-blocked on K0 + M1. Exposes debt #6 (whole-snapshot clone+save
  bottleneck). — gap #1, §9.5.
- **Politician-to-politician trading (DH-37, NEW batch 8 — the #1 AMPU-2
  wishlist item).** A trade window between factions to swap politicians. A
  genuine small feature, but **not on any critical path** — it pairs with the
  era-boundary faction-trade window (mechanics §27.2 step 1, which DOES exist in
  spec) and with multiplayer. Park it. — DH-37 (`new1772`; **batch-20 `ampu2wish`
  CORROBORATES — re-confirmed as "the #1 AMPU-2 wishlist item," POST 60-61**).
- **★★ AMPU-2 / OUT-OF-SCOPE quarantine (NOT roadmap items for AMPU 1 — extended
  batch 20 from `ampu2wish`).** This is the explicit "for next time" / AMPU-2
  brainstorm bucket. **The roadmap MUST NOT schedule ANY of these for AMPU 1**
  (OrangeP47: "unlikely to make it into AMPU 1"; vcczar's authoritative AMPU-2
  thesis, `ampu2wish#POST 10`: the MAIN AMPU-2 change = a **day-by-day Paradox-style
  timeline**, plus a full House, a federal judiciary — *with AMPU 1 finished first*).
  Quarantined AMPU-2 ideas: **day-by-day Paradox-style timeline rebuild; a full
  per-district House (+30k pols); dynamic regions / dynamic eras; dynamic / policy-
  reactive state biases; more states; achievements; scouting / hidden-stats.** Two
  of these are ALREADY-LOGGED AMPU-2 gaps, corroborated NOT re-logged: **DH-37**
  (pol-to-pol trading, above) and **DH-34** (dynamic/policy-reactive biases — see
  the "Roadmap decisions" §; ship-static stands, a deliberate history-sim choice,
  not a bug). The full per-district House is the same parking-lot "AMPU 2.0" alt
  already noted on E28 (the build ships the focus-Rep abstraction, not +30k pols);
  a post-Gilded/post-modern "future era" remains the batch-8 NEGATIVE result (no
  source, do NOT scope). **Quarantine only — batch 20 adds ZERO buildable AMPU-1
  scope from `ampu2wish`.** — `ampu2wish` (`888ba777`); game-mechanics §30.11.5.
- **★★ #205 Victoria-3 borrows — PARKING-LOT / "AMPU 2" (NEW batch 28; designer-
  tagged "AMPU 2", do NOT schedule).** Three Vic3-inspired aspirational ideas, all
  self-deferred by the designers: **(B1)** interest-groups/lobbies (which carry
  ideology) **dynamically join / form / split parties** over a campaign — breaks the
  fixed 2-party BLUE/RED model (`types.ts`); **(B4)** **per-state meters** (esp.
  economy) with national meters becoming the **average** of per-state meters (gives
  governors a stake in their own state) — a large architectural shift (today
  `NationalMeters` is national-only, `types.ts:406-407`); **(B5)** each lobby gets an
  **era-by-era AGENDA** + a completion bonus (a rework of the existing "benchmark"
  system). **Park; do NOT promote to near-term.** NOTE — the OTHER two Vic3 borrows,
  **B2 (meter-boosting Gov Actions) + B3 (migration/immigration Gov Actions), are
  Ted-endorsed for v1 and FOLDED INTO #20** (the gerrymander/gov-action umbrella, debt
  #74) — they are NOT parked. — `vic3` (`76d41a08`; B1/POST 4-5, B4/POST 45, B5/POST
  181); game-context gap #205.
- **★ #204 skill-scale = a DECISION RECORD, not a build item (NEW batch 28).** The
  community pushed hard for **0-10** skills (a Discord poll went 16-4); the designers
  (vcczar+Ted) DECIDED to **keep 0-5** — not auto-convertible (would require re-tuning
  every %-step / prereq / failed-candidate), and put 0-10 "on the table for AMPU 2."
  **This pins CLAUDE.md's 0-5 as a deliberate, non-trivial-to-change design decision**
  — recorded here to guard against a well-meaning future "just widen the scale" change.
  **No code change.** — `to-do` (POST 721-755); game-context gap #204.
- **#203 extreme-wealth attribute for tycoons — DEFERRED (NEW batch 28).** A `wealth`
  axis on `Politician` so figures like Carnegie/Bloomberg are mechanically distinct
  (campaign-finance / lobby implications). vcczar **DEFERRED** ("tedious… post-Early-
  Release"), not rejected forever — pairs with the #120 dataset pass when revived. Not
  near-term. — `fixes` (§F POST 152, 162); game-context gap #203.
- **All-human Convention deadlock handling (DH-39, NEW batch 8 — multiplayer
  convention machinery).** With every faction human-controlled, the Convention
  can deadlock with no CPU compromise/dark-horse path to break it (`new1772`).
  The CPU side of convention deadlock is owned by E9 handler 9e (auto-drop-out +
  dark-horse, DH-8/DH-17); the **all-human** case needs an explicit
  deadlock-resolution rule that only matters once multiplayer (M1) lands — so it
  rides the convention epic (E10) + multiplayer. Park until M1. — DH-39
  (`new1772`).
- **Bill-scoring Phase B (divergence #1).** Re-tune `cardVoteBias`
  (`phaseRunners.ts:1516`) per-card-aware once the E20 leaderboard is live
  and playtested. — divergence #1.
- **Conversion-targeting refactor (divergence #3).** **Keep shipped for
  now.** Revisit after E19 emits a rule-driven `Can Party Flip` signal
  cleanly. (Listed as Phase-1 #21 in §9.6 "if pursued"; bundle DH-5's
  pairing-dissolution here if QW6 is deferred.) **`drums` #76 supplies the
  full 2-layer Disgruntled-auto-flip + active-poach %-table + adjacency
  gating + failure-strip — which becomes the K5 handler 9f spec when the
  refactor is approached.** — divergence #3, debt #13.
- **Named-ordinal meter relabel (presentation half).** The full labeled-
  ordinal meter *presentation* (vs the ±3 clamp in QW3 + crisis/cascade in
  E6) touches every meter read/write + the UI; ride it on the presentation
  track only if playtest says the numbers read poorly. The first-class
  war-score meter rides E3. — §21.8/§22.1.
- **Far-future / progressive era (post-1892, pre-modern).** Feminists /
  socialists / communists / prohibitionists / eugenicists / labor activists;
  movement/coalition spawning across eras (#6). The `progressive` enum
  value is added in K4; a `progressive` scenario lifts in once a
  progressive digest lands. **★ This is the FURTHEST the corpus documents — there
  is NO "Era of the Future" beyond it (batch-8 NEGATIVE RESULT).** No ingested
  thread reaches a post-Gilded/post-modern era (`tea1772`, titled "…to future,"
  stalls at 1874 mid-Gilded), so a future era has **no source and no build
  target**; **do NOT scope one**. K4 adds exactly `gilded` + `progressive`. — gap
  #2, #6; batch-8 negative result (`tea1772`).
- **Gilded-Age issue *system* depth.** Per-issue interest groups, full
  era-event spines, imperialism annexation flow distinct from `admitState`
  — beyond the E22 data shells. — gap #3, #6.
- **Cabinet "free pick-up" legislation (12b) + foreign-volunteer scheduling
  (#46).** The 1772 Treasurer free-pickup variant; events scheduling a
  future-draftable figure (Lafayette 1784) routed to the lowest-scoring
  eligible faction. (The general Executive-Branch-Interference form is E29;
  Free Executive proposals from SecTreas/SecWar are wired into E14's bill
  pipeline.) — gap #12b, #46.

---

## Sequencing notes

Why the order is what it is — the tech-lead's binding calls (§9 batch-30 lead +
§9.6 batch-30 + §8 debt #85-#90 + §9 batch-29 lead +
§9.6 batch-29 + §8 debt #78-#84 + §9 batch-28 lead +
§9.6 batch-28 + §8 debt #71-#77 + §9 batch-27 lead +
§9.6 batch-27 + §9 batch-26 lead + §9 batch-25 lead + §9 batch-24 lead +
§9 batch-17 lead +
§9 batch-16 lead +
§9.1.12 hd1-E3/E3b-sequencing + §9 batch-15 lead +
§9.1.11 #18-promotion-and-modern-engine-wins + §9 batch-14 lead +
§9.1.10 gilded-era content epic + §9 batch-13 lead +
§6.6.1 batch-13 + §9.6 batch-13 + §9.1.3 methodology + §9 batch-12 lead +
§9.6 batch-12 + §9 batch-11 lead + §9 batch-10 lead + §9.1.9 + §9 batch-9 lead +
§9.1.5 + §9.1.8 + §9.1.3 + §9.6 + §9.1.6 + §9.1.7). **Batch 16 (`hd1`) HANDS the
DESIGNED FIX for the long-named Reconstruction solo-blocker — #156's 4-plan model
RE-SCOPES E3b's (d) readmission half as its DoD (the canonical DH-29 fix, M–L,
removes the K5 soft-dep for solo); DH-29 is REFRAMED from CPU-only to a STRUCTURAL
deadlock now fixed by #156's unilateral-adopt; #155 EXTENDS E3 (war-balance pass, M,
bounded by 1772-RevWar-winnable); #157 → E3b (a) (CSA-government seeding, S); DH-64 →
E18d (`Southern Unionist` dataset audit, XS). NO re-sequence, NO new keystone, NO new
author-before-build or Decision-gated items (batch 16 nets 0).** **Batch 17 (`ted1772`) is
FOUNDING-ERA CONFIDENCE + TWO NEW FOUNDING SUBSYSTEMS — the 4th captured 1772 source and
the 3rd CPU-heavy source. It PROMOTES #153 to build-with-confidence (3-source canonical +
the St. Clair emergent-President LIVE demo; the ×2-Command-gain knob is the load-bearing
unbuilt half, keystone-free; QW18 confidence raised), EXTENDS E1 with #159 (the
Constitutional-Convention subsystem, M–L, extending the shipped `constitutionalConvention.ts`,
leading with the slave-compromise→EV-penalty plank + the per-article eliminate-revote
loop), COUPLES #158 with #155/E3 (build together — #158 is one of the three RevWar floors)
and PINS the three RevWar winnability floors as a HARD constraint on the #155 war-balance
pass (floor 1 SHIPPED, floors 2+3 BUILD, 1772 must stay winnable), slots FL-on-death (S
standalone fix → factor `electFactionLeader`, in E16) + DH-65 (XS → E18d / #120 umbrella;
the Cosmopolitan⊕Provincial trait-exclusivity half is already engine-shipped), and appends
`ted1772` corroboration tags to #56/#133/#70/#72/#74/#76/DH-61/#86/#136. NO re-sequence,
NO new keystone, NO new author-before-build or Decision-gated items (batch 17 nets 0; TWO
forks resolve OUT — FL-on-death → immediate + #153 → 3-source canonical).** **Batch 14 (`gild1868`) is
DOWNSTREAM era-content — the EG gilded-era content epic + #148 (Reconstruction timer →
E3b) + the #41 native-spec strengthening land AFTER the era model + the economic engine
+ the bill-relationship graph + Reconstruction; NO re-sequence, NO new keystone, NO new
author-before-build or decision-gated items.** **Batch 15 (`terror2000`) is
MODERN-ENGINE MID-TIER WINS — it PROMOTES one Decision-gated fork (#18 → E20b), adds one
small end-condition module (#88 → E6), extends two epics (#152 → E3, #124+#151 → E16's
3rd re-scope), slots #153 (QW18) + #154 (E16), and recounts Decision-gated −2; NO
re-sequence, NO new keystone, NO new author-before-build items.** **Batch 18 (`ideo1928`)
is THE ECONOMIC ENGINE'S SECOND ERA — the FIRST 1928-start interwar campaign. #160 EXTENDS
E4c (the `arkzag` Bank-War work) with the interwar layer — Great-Depression META-event +
EconStab→industry cascade (2 industries −1/state → EV-reflow) + crisis-gated New-Deal bills
(`Bill.requiresCrisis`) — so E4c is now WELL-SPECIFIED ACROSS TWO ERAS: build it GENERIC,
add interwar content as DATA; couples E2 + E6; M as an E4c extension. DH-67 (event-gate the
era's BLUE party bias to the crash firing, at the `partyPref*5` term in `calcStateVote`) is
the CENTRAL #160 takeaway and the highest-value single fix in the batch — S, build it WITH
#160 (it is the switch that makes the meta-event load-bearing). The confirmation AUTO-PASS
gate folds into E16 / E9-handler-9d (S, Ted-authoritative `ideo1928#POST 213-214`; auto-
confirm EXCEPT {State/Treasury/AG/Defense}/Controversial/<3-skill — fixes the §25.5 36%-pass
pathology by keeping most picks off the vote). #161 makes the era band 6-START-CONFIRMED
(K3/K4 confidence, no scope). #162 EXTENDS E12 with the era-keyed 7-nation interwar roster
(no Israel yet); the #56-negative (ideology framing ≠ war trigger) is a scoping note. DH-66
STRENGTHENS the existing DH-54 impeachment author-before-build item to 3-thread-confirmed
(DH-33/DH-54/DH-66, await Ted's pending rewrite). #165 → DH-53 shared structured-effect-
tables fix; #166 → the economic-engine/industry-scoring work; #163/#164 → BOOT (DH-25
career-track family + the K4 `BootSheet` start-state field). NO re-sequence, NO new keystone,
NO new author-before-build or Decision-gated items (batch 18 nets 0).** **Batch 19 (`fixes2022`)
is THE EARLIEST DISCUSSION SOURCE — PROVENANCE + ONE NEW SUBSYSTEM. #167 no-eligible-successor
constitutional-crisis FOLDS INTO E10b as the no-successor member of one E10b crisis family
(reuses #62's 1-vote-per-state delegation machinery — build #62 once, reuse for both; ship the
PPT-as-acting-President interim default FIRST [S], then the full House-election procedure [M];
couples #61/#88/DH-54). Enthusiasm (#18/#51/#124) is FLAGGED as the perennial-fork RISK on E23
+ E20b — freeze the #51/#18 model as a FROZEN SPEC (the single likeliest drift point;
`fixes2022#POST 713-716`). `fixes2022` is the EARLIEST source for #153/#135/#124/#121/#88 →
build-confidence where they sit (no resize/move). The era-event firing-rate budget (~70%/era)
is a small addition to E15 (S); the `fixes2022` dataset batch folds into #120/E18d. NO
re-sequence, NO new keystone, NO new author-before-build or Decision-gated items (batch 19 nets
0).** **Batch 20 (FOUR meta/design threads — `planb`/`dbomit`/`biden2021`/`ampu2wish`) is a
LIGHT batch with ONE new runtime mechanic + ONE authoring-process gate: #169 elderly-pres
mid-campaign drop-out → endorse-VP event is a SMALL addition to E15 (S; the age-roll substrate
ships, the ticket-swap is net-new; DISTINCT from #37; Era-of-Populism-scoped); #168 is a
PRE-BUILD AUTHORING-QUALITY PASS (terminology contract + branch-path/meter/% audit + trait/
interest compilation) recorded as a process gate paired with #120, NOT a scheduled code task;
`biden2021` folds into the modern content tail (E30 / #92/#41 / §28.13 — the ONE mechanic is
#169; pardon actions block on #122); `dbomit` folds into #120; the chronological-import
constraint orders the per-era CONTENT authoring (founding → antebellum → modern) but NOT the
engine track; and `ampu2wish` is OUT OF SCOPE — quarantine only, ZERO AMPU-1 scope. NO
re-sequence, NO new keystone, NO new author-before-build or Decision-gated items (batch 20 nets
0).** **Batch 21 (FOUR playtests — `nixon1972`/`cpufull`/`trump2024`/`solo1916`) is ONE ★★
ESCALATION + TWO era-keyed gaps [one PARTLY SHIPPED] + ONE DH bug: **★★ #158 CPU anti-game-over
is RE-PRIORITIZED HIGHER WITHIN the CPU/war track** — `cpufull` is the 2nd live CPU game-over and
FIELD-FALSIFIES the flat-75% patch (a game-ending peace passed at a 4-5-4 PLURALITY after the
CC-President's reject was overridden), so the floor-(3) fix in E3 is re-scoped to a HARD VETO /
points-based anti-peace bias + a NON-plurality-overridable game-ending-peace; it is a SOLO-PLAY
BLOCKER (the "DH-29 of the CPU/war track"), makes #155 RevWar floor #3 LEAKY, builds WITH #155
(E3) + #75 (E9) AHEAD of the rest of the CPU/war track, and bears on #114 (debt #32 escalated +
#34a). **#170 era-keyed offices** → EXTENDS E16 (founding-seat half LIVE in `cabinetSeatsForYear`;
add modern departments to `OfficeType` + a `foundedYear`/`createdByBill`/`supersedes` table + the
DNI⇒CIA-Director supersession on the planned boot-seed cabinet-seat refactor), S–M (debt #47).
**#171 era-keyed draft-ideology TOGGLE** (OFF in the modern present, Ted-authoritative; 1916 ON /
1972 ON / 2024 OFF) → FOLDS INTO the #4/#108 draft-profile work as an era-keyed boolean, S (debt
#48). **DH-68** (Czechoslovakia/Hungary fired before WWI ended) → FOLDS INTO the DH-60 era-event-
precondition work (now multi-era) — port the 1772-graph `precondition` layer into the
calendar-only 1856 builder + a new Progressive builder, S (debt #49). CORROBORATIONS (no moves):
CPU suite #70–#79 ← `cpufull` (confidence ↑); modern band 2021-2025 + start-years #92/#41/#169 ←
`trump2024`/`nixon1972`/`solo1916`; crisis/war/Watergate #11/#45/#106 ← `nixon1972`; hinge
polarity §5 + #108 ← `solo1916`; `nixon1972` is ANOTHER GM-burnout stall (upkeep-automation
argument grows, cite not row). NO re-sequence, NO new keystone, NO new author-before-build or
Decision-gated items (batch 21 nets 0) — but #158's escalation elevates the CPU anti-game-over
fix WITHIN the CPU/war track.** **Batch 23 (`pop2012b` — the 2nd, DISTINCT 2012-START "Era of
Populism" run, GA-run [Rodja] but MrPotatoTed's in-thread point-of-order corrections are
DESIGNER-AUTHORITATIVE) is CORROBORATION-HEAVY + TWO net-new legislation-data items in EXISTING
epics + one predicate sharpening + two clarifications. **★ #174 committee bill-packaging +
ranking-member counter** → FOLDS INTO the committee/bill-packaging epic **E14b (#8/#9/#12, the E14
sub-PRs a/b)**: the fullest packaging spec in the KB (`pop2012b#POST 724` verbatim) — a
ranking-member un-package/repackage COUNTER (5 trait gates) + 2 chair-add-bill powers (5
Legis+Efficient → off-committee tax; 5 Legis+Magician → one off-topic) + cross-chamber/cross-
committee package GUARDS + the Puritan committee-voting rule; STACKS ON the still-unbuilt #8/#9
chair-block/package (chair lever + ranking-member lever = two pipeline points; **chair-side FIRST**);
needs a ranking-member field on `committeeChairs` + `Bill.packageOf?: BillId[]`; binds at
`phaseRunners.ts:3463`. **★ Cross-check the 5 gates + chair-add powers vs. `tedchange` BEFORE
building** (open Q, single-thread source). S–M (debt #54). **★ #175 law-repealability DATA MODEL**
→ a small data-model add INSIDE **#42 (the bill-relationship graph, E29) + §27.5 (statehood-by-bill,
E4b)**: MrPotatoTed ruling (`#POST 687-688`) — `Legislation.repealable: boolean` + `lawClass:
repealable|replace-only|permanent`; gate Repeal on the flag, expose Replace for tax/immigration
(replace-only), mark statehood `permanent`; **the concrete form of #42's constraints — build WITH
#42, NOT standalone.** **★ Open Q: authored per-bill list vs. per-row hand-marking** (joins the #120
dataset umbrella). S (debt #55). **★ #88 PREDICATE SHARPENING (no new item):** the apocalypse/coup
endgame fires at the meter **FLOOR band, NOT "Crisis"** — `pop2012b` shows Planet's Health at
"Crisis" with NO clock + NO roll firing (`#POST 632`), so the predicate is `meter === floorBand`,
NOT `meter <= crisisBand` (2nd-source corroboration of `terror2000`'s HonestGov-FLOOR gate); folds
into the existing #88/#158 end-condition + APOCALYPSE-clock work at **E6** (debt #28/#32, §9.1.4).
**★ #15 VP-rubric + cabinet-decline-CPU-only = CLARIFICATIONS (no new build):** the canonical rubric
already says "+1 if YOUNGER than 60" (NO "+1 older than 60"), row 7 reads a discrete
`canBeIndependent` tag (not office status), and cabinet accept/decline %s are CPU-ONLY (gate the
decline rolls behind `isCPU`; humans free-choose except VP) — all covered by **E16 + the convention
rubric (E10)**; pin the AUTHORITY (MrPotatoTed). **★ CORROBORATION:** a 2nd, independent 2012-boot
re-confirms the modern cluster (#86 boot / #47/#13 primary→convention→general / #15/#16/#18/#51
VP-rubric+2-layer scorer [STATE OF METERS verbatim] / #52 SCOTUS / #25/#112/#124 28-seat cabinet /
#70 leadership / #91 12A-VP / #8/#9/#12 committee — confidence ↑); **#90/#43** procedural-pol-gen LIVE
again as career-track starvation in the thin 2013 draft (2nd corroboration of the DUAL procedural-gen
gates → E8); a **3rd GM-burnout DEATH (Rodja resigns)** strengthens the DH-36/DH-69/#114 automation
argument (cite, not a row). NO re-sequence, NO new keystone, NO new author-before-build or
Decision-gated items (batch 23 nets 0 — #174/#175 are buildable in existing epics; the #174
`tedchange` cross-check + #175 authored-list question are designer/content-gated WITHIN their epics;
#88 is a predicate, #15 a clarification, the burnout death a cite).** **Batch 22 (`modernday` — THE ONLY modern thread crossing an
era boundary) is TWO CONCRETE MODERN BUILD ITEMS that sit in EXISTING epics + a current-rules
spec-anchor + two small bugs: **★ #172 era-keyed confirmation thresholds + Nuclear-Option** →
FOLDS INTO E16 (cabinet/confirmation) + E14c (cloture) — a `GameState.nuclearOption:{cabinet,
scotus}` per-start-year boot flag (Cabinet 50%+1 / SCOTUS 60% for 2016, Ted-authoritative
`modernday#POST 422-423`) seeded by `scenarioBoot` + per-track threshold reads in the cabinet
runner + SCOTUS-nom path + the SML enact/repeal action + the 60→fail→conversion→auto-Mod
fallback; it **composes with #124 (auto-pass — whether a vote happens) + #52/9d (who votes aye)
+ #171 + the batch-9 cloture decision (do NOT re-litigate)**; S–M (debt #50). **★ #173
era-boundary-aligned starts** → New-Game **start-year PRESETS = the 14-band openings** on the
scenario-boot picker (#115/K4); each preset = a scenario-as-data-row on the `BootSheet`, GATED
on `scenarioBoot`; S (debt #51). **★ #68/#2 point-banking SPEC-ANCHOR CONFIRMED** — a
current-rules LIVE instance of the 6-clause banking ritual + score-reset + faction-trade window
+ procedural-content swap fired at the REAL 2024 boundary (`modernday#POST 1871/1874/1902`,
matches `rep1800`); NO priority change, stays folded into K3/K4, spec now SOLID. **★ #171** PROVEN
flipping ON (2016-2024)→OFF (at 2024) in one save (sharpens debt #48, no scope change). **★ DH-70**
`Lackey` PV over-weight → a `pv.ts` NOTE (when ported, add to `NEGATIVE_TRAITS` for the flat −5,
NO special-case; shipped `pv.ts:77` already flat-−5's all negatives) → folds into E18d/#120, XS
(debt #52). **★ DH-69** no in-app rules / legal-move surface → an onboarding/UX item, CITED under
#115/CPU-AI (no engine size of its own; serves the CPU action-picker primitive too; debt #53).
#43 procedural generator OWNS the modern→future band (dataset exhausts at the future boundary,
live-corroborated → E8). NO re-sequence, NO new keystone, NO new author-before-build or
Decision-gated items (batch 22 nets 0) — #172/#173 are buildable in existing epics, DH-69 is UX,
DH-70 is a pv.ts bug-note.** The batch-23 lead comes first (below), then batch-22, then batch-21,
then batch-20,
then batch-19, then batch-18, then batch-17, then batch-16, then
batch-15, then batch-14, then batch-13, then batch-12, then batch-11, then batch-10, then
batch-9, then batch-8, then batch-7, then the carried batch-5 leads.
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★ Batch-30 lead — FIVE DESIGN/DATA/changelog threads, NO playtest (`revampPV` [the Feb-2023 PV-SYSTEM
OVERHAUL] + `summer2021`-changelog [the batch-26 run's tier-1 ALL-DECIDED rule-changes, the ORIGIN of DH-76]
+ `ampuData` [the per-administration 1774→2022 content INDEX, an authoring source] + `presidents` [the
cross-playtest president RECORD + corpus-coverage map] + `ampuUpdates` [the earliest `GM⇒App` charter]); 14
NEW gap rows #214–#227 + 1 NEW design-hole bug DH-77 (max gap #227, max bug DH-77). A DESIGN/DATA batch — NO
playtest exercise. It does NOT move the top-of-queue. Reflect it by: (1) ★★★ THE PV-SYSTEM OVERHAUL SPLITS
(debt #85) — `pv.ts`'s `computePV` ships a PRE-REVAMP formula (flat ±4/−5 traits `pv.ts:76-77`, flat
`command×10` `:74`, flat `skill×weight×4` `:70-73`, magic `Kingmaker +6` `:79`, `Math.max(0,…)` clamp `:88`):
add **QW22 #216 the trait-name remap** to the cheap-fixes lane (**S, BLOCKING PREREQUISITE** — ~17 of ~57
forum trait line-items mis-key/drop vs the shipped `Trait` union `types.ts:62-117`; the table is tiers to
RE-MAP, not literal keys; DO FIRST) + **QW23 DH-77 the floor-offset clamp fix** (XS — swap `Math.max(0,…)`
at `pv.ts:88` for a constant offset so the CPU keeps sub-zero ordering); add **#214 per-trait tiers (M-L) +
#215 per-ability curve / Command re-weight (M) as ONE PV-reweight BALANCE EPIC** (Phase-1, E20b/E20 + `pv.ts`)
**GATED on the un-ingested "Groupthinking the Political Value" trait-EFFECTS thread** (P33 sets only POINT
VALUES) **AND with a MANDATORY same-PR `calcStateVote` `pv*0.1` re-tune** (`phaseRunners.ts:3699,3709` — `pv=
c.pvCache` feeds every state-vote score, the same election-balance surface as #18/#184/DH-72/QW19-21, debt
#1/#64/#65/#71); put **#220 PV display-scale** (raw "pink" vs 100-normalized, UNRESOLVED) in Decision-gated (A)
User-gated; (2) ADDING **#217 the president/cabinet IMPLEMENTATION sub-engine + ~30 governing traits** (debt
#86, `GM⇒App`; post-legislation success→Blunder pass + expertise-gated genre traits + Delegator/Micromanager +
Crisis-{Manager,Admin,Gov} + Passive/Predictable + Passive+Pliable PUPPET + Magician) → **an L SYSTEM LAYER
riding #179's roll engine `:3260` + #182's action budget `:3632` + §14.1.y/#126, GATED on federalism; folds
into E16/E6** (de-dup vs Efficient/Egghead first); (3) ANNOTATING **K4 with #221 — the era-content registry
needs TWO SCHEMA FIELDS** (debt #88; a scripted-vs-flavor tier flag + per-category first-active-era metadata;
`EraEvent` `types.ts:1466-1482` lacks both → folds into K4; XS-S each; the authoring-side confirmation of the
#92 two-level content-band model, content terminates at Biden/2022); (4) ADDING **#218 Rule-of-Four/CJ
case-refusal (S → E25, shares #217's trait reads) + #219 US-Rep PROPORTIONAL representation (S → E14/E7)**
(debt #87, both ABSENT); (5) ADDING the **SMALL FOLD-INS #222–#227** (debt #89, several `GM⇒App`): #222
committee-size scales w/ state count (S → E7/E14) · #223 chair→25%-enthusiasm (XS → E7/E16) · #224
lowest-satisfaction 25% AUTO-FLIP, DISTINCT from conversion #76 (S → E9/#108) · #225 Celebrity-expiry-before-40
(XS → E18/#136) · #226 Frail/Hale lifespan auto-traits = a NEW `scripts/` DATASET rule, NOT engine (XS →
#120/E18d) · #227 Trim-Roster already REMOVED, verify random-retirement tuning prunes (XS); (6) SHARPENING
**DH-76 cloture** (now has its `summer2021` ORIGIN; no re-size, E9 9b, K5-dependent, debt #80/#208) + **#115
generate-a-candidate** (name-DB tagging + 1/9/20/20 tiering + lowest-score backfill; folds into `scenarioBoot`
§9.1.9; debt #90, S-M); (7) ★★ UPDATING THE GM-REPLACEMENT LENS (a VIEW, no re-sequence) — adding to ①
referee/calculator the **PV-electability** row (#214/#215/#216/DH-77 — the "who's electable" math the CPU's
draft/leadership heuristic runs on AND a direct election input via `pv*0.1`), the **implementation/governing
engine** (#217), a **cloture/legislative** annotation (#221 + DH-76's origin), and **#115** on the boot row; no
② opponent-half entry this batch; (8) ★ RECORDING in the Author-before-build / corpus-coverage area the
**HYGIENE do-NOT-schedule** items (the `summer2021` winning-party lowest-faction score penalty
ADOPTED-then-REVERSED [#68/#102], the REJECTED randomized/Legis-weighted proposer, the `revampPV` per-trait
"absence bonus" idea) and the **CORPUS-COVERAGE** note (≥7 un-ingested playtests — esp. the **1840-start**
persistent-Whig ~100-yr run, no 1840 scenario analog ships — and the un-ingested **"Groupthinking the Political
Value"** trait-EFFECTS thread that GATES the #214/#215 epic; ask the human for exports). NO new keystone, NO
re-sequence, NO new author-before-build RULES item, Decision-gated RECOUNT +1 (#220's display-scale pick). The
TOP OF THE QUEUE is UNCHANGED: QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) — the PV
overhaul is a TUNING/DATA change, not a keystone: ship #216 + DH-77 as quick-wins now, treat #214/#215 as a
balance epic gated on the un-ingested trait-EFFECTS thread + a same-PR `calcStateVote` re-tune. game-mechanics
§3.4.1, §20.10.1, §22.7.z, §27.1.1, §30.20 + technical-guide §9 batch-30 lead + §9.6 + §8 debt #85-#90. debt
#85-#90.**
**★★★★ Batch-29 lead — TWO TIMELINE-EDGE PLAYTESTS that bracket the band model end-to-end (`wilsons1916`
[the FIRST multiplayer 1916, a deliberate START-AT-ERA-OPENING experiment fixing the 1960 mid-cycle
failure #186] + `welcome2future` [the DOWNSTREAM-MOST ingest in the corpus — a hands-off all-CPU 2022→
Future run, 8-of-10 factions on CPU rules, the most complete modern CPU-turn sample; planned to 2072 but
never reached it, covering setup + exactly ONE turn]); 8 NEW gap rows #206–#213 + 3 NEW design-hole bugs
DH-74–DH-76. It does NOT move the top-of-queue. Reflect it by: (1) ★★★ ANNOTATING K3/K4/#92 with the
HEADLINE RESOLUTION — #206 confirms the `Era` enum is DOUBLY too coarse from BOTH timeline edges (the
1916 Era-of-Hollywood OPENING + the TERMINAL Future band), and the tech-lead RESOLVES the long-open "grow
the `Era` enum vs. adopt the #92 two-level data-model" question **IN FAVOR of the DATA-MODEL** — band
labels (Hollywood/Gilded/Progressive/Future/Populism) become K4 era-content registry DATA, NOT enum
values, and the `Era` enum (if kept at all) stays a COARSE rules-tuning key; this is a K3/K4/#92
ANNOTATION (the existing keystone-overview prose + K3 + K4 rows are annotated above), **NOT a new keystone,
NO re-sequence** (M for the enum/registry refactor, folds into K4); debt #78; (2) ADDING a SEPARATE Era-
of-the-Future PROPOSAL-LIBRARY content-authoring epic — events reportedly done, legislation a stub, the
same "events-before-legislation" shape as the Federalism gap (added to the Author-before-build content
bucket; folds into E31); (3) ADDING #207 — NO terminal game-over / completion state (debt #79): the ONLY
terminal state is `gameEnded` at ONE event-driven LOSS site (`phaseRunners.ts:2871`), NO `endYear`/
`maxYear` → a **completion-vs-loss DECISION** is owed (year-cap / sandbox / score-out), DISTINCT from the
#88/#188 meter/scripted LOSS endings — added to (A) User-gated (decision-gated on which completion model),
builds at E6; small but architecturally load-bearing (it defines what "done" means); (4) ADDING #208 +
DH-76 — the CPU LEGISLATIVE/CONFIRMATION engine + cloture (debt #80, `GM⇒App`): `grep filibuster|cloture
src/` = ZERO; the hands-off 2022 turn forced the GM to invent a CPU filibuster-override + maj/min-leader
vote rule (own-party + within-2-ideology-clicks, iron-fist within-1) + cross-party cabinet caps, and DH-76
adds the cloture gap from `wilsons1916#P349` → the Filibuster action + an era-keyed Cloture counter tied
to the Nuclear-Option state + CPU override + cabinet caps, all deterministic → **folds into E9 handlers 9b
(legislation) + 9d (cabinet), K5-DEPENDENT**; M; (5) ADDING DH-74 — a `billProposable` bill-proposal
validator (debt #81, `GM⇒App`): `BILL_TEMPLATES` carry NO precondition fields → `wilsons1916` House-voted
bills then found them INVALID mid-second-vote (a 2.6 HALT) → a predicate + filter at
`phaseRunners.ts:3444` that **SHARES the territory/era content-filter with #206/#92 + DH-60 — build the
predicate library ONCE, use it for events AND bills**; S-M; (6) ADDING #209 — boot-time retro-cohort bench
(debt #83, `GM⇒App`): a non-1772 boot has no synthetic bench → `welcome2future` Alabama had no eligible
Republican → a boot-time retro-gen of SUB-FLOOR career-track cohorts stat-dated to the prior ~5 cycles,
routed through `rng.ts` → **folds into the existing `scenarioBoot`/`BootSheet` pipeline (K4, §9.1.9)**; M;
the boot prerequisite for ANY deep-modern / Future-band start; (7) ADDING DH-75 — military-appointment
eligibility (debt #82, `GM⇒App`): the officer filter checks ONLY `military >= 3` → Pancho Villa
appointable as a US general → add citizenship + exp-type→branch gates; XS-S, standalone; (8) ADDING the
SMALLER MECHANIC ASKS (debt #84, ride existing epics, LOWER priority): #210 Ex-President super-Kingmaker
(S, the Kingmaker subsystem), #211 cross-party PV-snake draft MODE (S, LOW — MP setup flavor), #212 the
unbuilt 2.1.5 ideology-shift pass + the per-faction shift-budget decision (S-M, the era's biggest by-hand
load), #213 era-conditional faction-ideology toggle (sunsets 2026, CONSOLIDATES with #171; XS-S); (9) ★★★
UPDATING THE GM-REPLACEMENT LENS — this is the FIRST batch to add LEGISLATIVE-REFEREE items to the lens:
the #208/DH-76 cloture/filibuster + CPU vote/cabinet-cap engine and the DH-74 bill-validator slot under ①
referee/calculator (the legislative half the modern hands-off run proved the engine doesn't own), plus
DH-75 (officer-eligibility) and the #209 retro-cohort bench + #207 completion terminus on the boot/end-
condition rows; on the ② opponent half the new entry is a CORRECTION — **DH-14 is a CPU-AI artifact, NOT a
mechanical block** (the 19th Amendment PASSED with humans, House 374-61), so it folds into the era-keyed
bill-ideology table (① data) + the #208 CPU vote model (② opponent); the lens stays a VIEW, NOT a re-
sequence; (10) ★ REFLECTING the REFRAMES — DH-14 (above); #106/WWI optionality + #114/#110 corroborated
(`welcome2future` = the most complete modern CPU-turn sample); and the **METHODOLOGY PRINCIPLE (#173/#186):
author/test at era-band OPENINGS, treat mid/tail starts as a separate, higher-risk class** (BOTH a mid-
cycle AND a tail-of-band start are thin-content friction zones; even a clean OPENING start needs a fully-
populated per-year BootSheet — the 1916 BootSheet was "bare," NO starting generals → DH-75 + #209). NO new
keystone, NO re-sequence, NO new author-before-build RULES item (the Future proposal library is a CONTENT
epic), Decision-gated RECOUNT +1 (#207's completion-model pick). The TOP OF THE QUEUE is UNCHANGED: QW0 →
K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) — but #206 is the strongest single
argument yet that the K3/K4 era keystone must adopt the #92 two-level content-band model (not a growing
enum), and #208/DH-76/DH-74 sharpen the legislative half of the GM referee into concrete, K5-dependent
engine work. game-mechanics §22.11, §26.4, §28.10, §12.1.1, §9.2.1, §8.5.4, §4.4, §30.19 + technical-guide
§9 batch-29 lead + §9.6 + §8 debt #78-#84. debt #78-#84.**
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★ Batch-28 lead — FOUR designer META-DOCS (`to-do` [the authoritative 2021-22 pre-build dev
backlog] / `fixes` [vcczar's 2022 designer-authoritative ACCEPT/REJECT/DEFER fix-queue] / `completions`
[★ the *done-half* of the 2022 spreadsheet/reference game's backlog] / `vic3` [aspirational Victoria-3
borrows, mostly "AMPU 2"]); a DISCUSSION/CATALOG + RECONCILE batch, NO era playtest — the pivotal
RECONCILIATION batch, the `completions` "done-half" list converted into VERIFIED truth about our `src/`.
17 NEW gap rows #189–#205; NO gap closed; NO new keystone, NO re-sequence of the top of queue. It does
NOT move the top-of-queue. Reflect it by: (1) ★★★ REINFORCING THE HEADLINE — debt #71 = the election-
scorer determinism+tuning QUICK-WIN, which FORMALIZES the existing QW19–QW21 (do NOT add a 4th row): of
the 2 flagged "CONFIRMED-SHIPPED" claims, exactly ONE holds — the **election die D6 is REFUTED** (the
cited `phaseRunners.ts:727` is `factionExpertiseBias`'s unrelated 0–6 clamp; the real randomizer is
`(Math.random()-0.5)*8` at `:3711`, raw `Math.random`, NEITHER d6 nor d3, NOT seeded — our build ships
NO election die), while **trait-conflict-d6 is CONFIRMED-BUILT via the RNG seam** (`tryGrantTrait`
`traits.ts:53`, `d(6)>=threshold`, threshold `4`). The **D6-vs-D3 fork is TIED OFF** — since the build
ships NEITHER die, the fork is the SAME tuning+seeding QW the batch-27 #184/DH-72 finding framed (narrow
the `:3711` jitter to the d3-equivalent band + route through `rng.ts`, then re-check `baseLean*5` `:3697`)
— and it FUSES the flagship `Math.random` leak (debt #1/#3) + the #184/DH-72 sub-fix in ONE patch (the
single highest-value build move the batch points at); (2) ADDING #179's NUMBERS — the cabinet-meter
engine now has an `Admin→{upOdds,downOdds}` table + Efficient±2 + 25% lobby-dissat + JCoS/Senior-Gen/
Admiral exclusion (#49) replacing the placeholder `drift()` at `phaseRunners.ts:3260` (debt #72; S-M,
standalone, READY; folds into E6/E16 where #179 already lives); (3) ADDING the DOWN-BALLOT MODEL #189–
#192 — a separate-from-presidential trait table (#189) + the expertise/lobby↔leading-industry "Manchin"
+2/+1 (#190) + a static per-seat `deviantPartyBias` SET-BY the gerrymander action (#191) + a margin→pop-
vote-% + PV-cap layer (#192) → builds ON the existing PARTLY-BUILT routing in `calcStateVote`
(`phaseRunners.ts:3685,3707-3708`), debt #73, M, into E20b; pairs with #103; (4) ADDING the NINE
NOT-IN-OUR-BUILD subsystems — ALL re-confirmed ABSENT (`grep src/` = ZERO each), spec'd from the 2022
docs → roadmap-ready, ALL `GM⇒App`, LOWER priority: debt #74 (US-Rep Voting-Power #34/#62 S / Generate-
a-candidate 3.0.25 S / gerrymander gov-action #20 S), debt #75 (Acting-Presidency 3.0.33 S / Do-Not-
Enforce Pres-Actions #23 S / Master-Kingmaker promotion #128 XS-S), debt #76 (Secessionist/pardons 3.0.35
#121/#122 M / rising-sea EV #41 S / trait-renames #168 XS); (5) ADDING the NEAR-TERM `GM⇒App` cluster
(debt #77) — confirmation-rejection cascade #199 (ACCEPTED, S → E16/E9-9d) + personnel-effect bills #200
(S-M → E2/E25) + interest-acquisition #193 (RESOLVED, S → E13/#163); (6) PARKING #205 — the Vic3 borrows
(B1 dynamic IG→party / B4 per-state meters / B5 per-lobby era agendas) are designer-tagged "AMPU 2",
parked, NO near-term row, while B2/B3 (Vic3 meter-boost + migration gov-actions) FOLD INTO #20; #204
(skills stay 0-5, 0-10 → "AMPU 2") is a DECISION RECORD pinning CLAUDE.md (no code), #203 (wealth)
DEFERRED; (7) ★★ UPDATING THE GM-REPLACEMENT LENS — this is the FIRST batch read through the lens, so the
new `GM⇒App` items (#179 meter engine, the down-ballot scorer #189–#192, the #199/#200/#193 cluster, the
9 NOT-IN-OUR-BUILD subsystems, the in-app #195 records-archive / #202 Campaign-Advisor) are slotted under
① referee/calculator (rules math/machinery) pointing to their existing E-homes — a VIEW, NOT a
re-sequence; the lens also REFLECTS the verification verdicts (trait-conflict d6 Built ⇒ already retired,
NOT a `GM⇒App` gap; election die REFUTED ⇒ debt #71 QW genuinely retires GM die-rolling); (8) ★ NOTING
the OPEN #183 endorsement-momentum CONFLICT (2022 sheet's 25%/10% vs `redbutton`'s none — frozen-spec
reconciliation, rides #185/#66/#67, NOT closed). NO new keystone, NO re-sequence, NO new author-before-
build items, Decision-gated RECOUNT 0 (batch 28 nets 0 — all OPEN items are designer/content-gated WITHIN
their epics; #205/#204/#203 are parking-lot/decision-record/deferred). The TOP OF THE QUEUE is UNCHANGED:
QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) — but the election-scorer
determinism+tuning QW (debt #71, fusing #64/DH-72 + debt #1) is reinforced as the cheapest high-leverage
win, and the down-ballot model (#189-#192) + #179 meter engine are now numeric, standalone-buildable
specs. game-mechanics §15.4, §15.5, §20.10(g)-(j), §14.1.2, §24.1, §23.1, §30.18 + technical-guide §9
batch-28 lead + §9.6 + §8 debt #71-#77. debt #71-#77.**
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★ Batch-27 lead — `redbutton` (THE CORPUS'S FIRST Cold-War / Civil-Rights source + the FIRST
MODERN-ERA scenario boot stress-tested AT SCALE: a ~10-human MP run that STARTED MID-CYCLE in the 1960
Elections Phase, ran 1960→1962-64, then "Temporarily Paused" and never resumed solo; alt-timeline GOP
nominee John W. Bricker [MacArthur convention WALKOUT] WON 492-40 over JFK off a platform/election BUG).
ONE designer-confirmed election NERF [#184] + its driving BUG [DH-72] + FOUR designed-not-built modern
gaps [#185/#183/#186/#187] + ONE premise-only loss [#188→#88]. It does NOT move the top-of-queue.
Reflect it by: (1) ★★ SPLITTING the headline — the DH-72 ELECTION-TUNING SUB-FIXES go into the QUICK-WIN
bucket (highest-leverage work in the batch, binding at `calcStateVote` `phaseRunners.ts:3709-3711`,
XS–S) as THREE rows alongside the queued QW3 ±3 cap [debt #1] + the #18 2-layer scorer: QW19 = narrow +
SEED the jitter (raw `Math.random` ±4 → a seeded d3-style roll via `src/rng.ts`, ALSO closing a
determinism leak vs the rng rule + debt #1/#3); QW20 = re-weight `baseLean*5` into the +3/+5 historical-
bias band behind a `game.biasMode?` toggle; QW21 = HIDE the raw math in the UI (anti-collusion). The
492-40 came from a `+1`-read-as-`+3` board-wide misapplication on a bogus `+3` platform bonus; recompute
→ ~281-129 near-tie; (2) ADDING #184 — the +2/+1/−1 PLATFORM meter-cap is NOT a quick-win and NOT a
standalone patch (it clamps a term that DOESN'T EXIST yet — `grep platform|plank in src/engine` = ZERO,
the SAME unbuilt object as #181) → a BUILD-INTO CONSTRAINT on the convention/platform epic (Phase-1 #10
/ #181): build the scorer with the cap + hide-the-math from day one, never ship the uncapped forum
scorer; (3) ADDING #185 — the modern PRIMARY→BROKERED-CONVENTION machine (12 primary states, primaries-
in-GROUPS, the 5-tier Cat-1–5 delegate-weight HOST-RIGGING lever, kingmaker +1, 67%-first-ballot, two-
leaders-force-a-kingmaker-weighted-rule-change-vote, least-delegates-first interballot order, 100%-
delegate rule + WALKOUT, kingmaker-weighted VP vote) → FOLDS INTO Phase-1 #10 convention machinery, L,
the single biggest election subsystem (CONFIRMED unbuilt: `runPhase_2_9_1_Primaries` `:3725-3750` = flat
PV+command*5 SORT); (4) ADDING #183 — the ENDORSEMENT-MOMENTUM hole (withdrawal/endorsement is inert
unless the dropper holds delegates; add a momentum value +2 Minor/+3 Major OR a home-state/region
transfer OR an ideology-penalty waiver, INDEPENDENT of delegate count) → FOLDS INTO #185/Phase-1 #10, S,
DO NOT build standalone (couples to the DH-72 d6→d3 squeeze + DH-57); (5) ADDING #186 — the
DETERMINISTIC LATE/MID-CYCLE BOOT = a FIFTH `BootSheet` shape (a 1960 governance boot forced into an
Elections-Phase start a turn early → cascading manual patches: Senate 50-50 vs real 66-D, no Leadership-
gated Party Leader, on-election rolls skipped, party-fatigue dropped, gov terms-served unknowable,
delegate weights hand-assigned, DC EVs invalid pre-1961, NO Command runway → roster frozen) → RIDES K4's
`BootSheet` + `scenarioBoot` (#115), M-L, needs `startMode: 'electionPhase'|'governance'` + `asOfYear`
incumbent table + `seededLeaderTenure` (#187) + `delegateWeights`/`primaryCalendar` (#185) +
`careerTrackBackfill` (DH-25) — no new keystone, it SHARPENS the bar; (6) ADDING #187 — PARTY-LEADER
FATIGUE (`party preference −1` after 6yr of one party leader → ~8-yr presidential rotation; its absence
at the mid-cycle start COMPOUNDED the #184 landslide) → S, pairs with #15, do the boot retro-apply WITH
#186 (CONFIRMED unbuilt: `Party` `types.ts:1306-1311` has NO tenure field; `leadershipStartYear` `:1302`
written, NEVER read for a penalty); (7) ADDING #188 — the "BIG RED BUTTON" NUCLEAR LOSS (the campaign's
whole PREMISE never fired; Cold-War content that DID fire is event/legislation FLAVOR on the generic
engine) → FOLDS INTO #88 (meter-floor game-end + APOCALYPSE clock, Phase-1 #6), XS-S, a configured
end-condition ROW not a MAD/arms-race engine (corroborates §28.2 negative-scope #106); (8) ★★ ESCALATING
IN PLACE — NO new scope, NO re-sequence — #88 (first MODERN end-condition datum; the corpus still shows
exactly ONE proven game-over, `terror2000`'s coup → confidence ↑ on the meter-floor model), #86/#115/
#173/E1 (the mid-cycle modern boot is now CONCRETE — the 5th `BootSheet` shape with explicit holes), #14
(the designer's platform/election nerf DIRECTION is now set), #114/DH-36 (re-confirmed as the GM-WORKLOAD
DEATH from the MODERN angle — paused, never resumed solo; E9/K5 carries this too). NO new keystone, NO
re-sequence, NO new author-before-build or Decision-gated items (batch 27 nets 0 — the DH-72 sub-fixes
JOIN the quick-win bucket; #184/#185/#183 ride Phase-1 #10/#181; #186 rides K4; #187 pairs #15/#186;
#188 folds into #88; the #184 platform-vs-meter open Q, the #183 momentum value, the #185 delegate-floor,
the #186 per-year incumbent tables, the #187 penalty-curve are all designer/content-gated WITHIN their
epics). The TOP OF THE QUEUE is UNCHANGED: QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` →
`scenario1788` (E1) — but the DH-72 tuning sub-fixes JOIN the QUICK-WIN bucket (QW19-QW21) and the modern
primary→convention cluster (#185/#183 + the #184 platform cap) is now the KB's richest forward-played
election spec inside Phase-1 #10. game-mechanics §15.3.5, §8.5.3, §28.1, §28.2, §28.6, §30.17 +
technical-guide §9 batch-27 lead + §9.6. debt #64-#70.**
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★★ Batch-26 lead — `summer2021` (THE CORPUS'S LARGEST SOURCE + the FIRST run to PLAY FEDERALISM
FORWARD [1772→~1810, the whole president/cabinet/diplomacy TURN LOOP run end-to-end, NOT just
designed-and-walled]; a 3-GM relay over ~14 months, GA-run but designer-blessed rulings in-thread).
CORROBORATION-HEAVY + FOUR net-new ENGINE gaps [#179, #182, #181, #180] + ONE bug [DH-71]; #177/#178/
#114 ESCALATED IN PLACE with live forward-play evidence. It does NOT move the top-of-queue. Reflect it
by: (1) ADDING #179 — the cabinet LINGERING-ROLL meter engine, a REDESIGN of the shipped deterministic
drift (`runPhase_2_5_1_Lingering` `phaseRunners.ts:3260` = `drift(skill)`-keyed, NO roll/backfire) into
a roll engine + ≥6 sub-rules across ≥2 systems (per-portfolio ±roll w/ backfire + Efficient auto-+2;
Pliable-Pres decider override; cabinet-bill double-points; ideology-gated confirmation; regional-rep
penalty; exec-action blunder rolls) → folds into E6 (Lingering) + E16 (cabinet) + §10.4.1 blunder
layer, L, ★ SPLIT into (i)+(f) meter/blunder engine · (b)+(d) appointment/confirmation · (c)
bill-coupling · (e) election-feedback (different deps); GATED on #177 (federalism era existing) + the
diplomacy/EconStab meters it moves, couples to #67 + #116/#160 — Open Q (designer): how to split;
(2) ADDING #182 — `command` = the President's PER-TURN EXECUTIVE-ACTION BUDGET ("Osgood can do up to 4
actions… he has 4 command"; each action implemented by a cabinet member with a blunder roll) → folds
into the §14 executive-action build (K2 ActionRegistry) + #179, S once the exec system is real; GATED
on `runPhase_2_8_1_Executive` (`:3632`, today ONE flat `chance(0.5)` action) becoming a real K2
ActionRegistry chooser — Open Q (designer): applies to governors too?; (3) ADDING #181 — the
presidential PLATFORM-PROMISE convention system (binding platform = 1 econ + 1 domestic + 1 judicial +
1 foreign bill + 1 action promise + a crisis-resolution promise, PLUS deal-making office-promises,
kept/broken → §22.2 enthusiasm) → PART OF the #19/#20 convention cluster, M, DO NOT build standalone —
it rides the convention epic, gated on conventions existing; (4) ADDING #180 — the monument/legacy-trait
achievement layer (named historical-legacy traits to whoever performs each in-game FIRST) → rides the
federalism/founding era-content build, S–M, LOWER PRIORITY than #177-#179, gated on #177, Fed-Papers
authoring rule needed first; (5) ADDING DH-71 — faction-handover DUPLICATE-politician = a single-
ownership CONSTRAINT on the unbuilt #1 faction-handover (the transfer fn must MOVE not COPY — mutate
the SINGLE `factionId`), XS, NOT a shipped regression (the handover feature is itself unbuilt), folds
into #1; (6) ★★ ESCALATING IN PLACE — NO new scope, NO re-sequence — #177/#178/#114: #177 is now
DESIGNED-AND-PLAYED-FORWARD (first source to run the federalism turn loop forward, §20.9) → the
highest-confidence next-era signal, the TWO `eraGraph.ts` walls confirmed unchanged; #178 has LIVE
forward-play evidence (Treaty of Paris auto-proposed at RevWar's end organizes Mississippi + NW/Ohio
Territory; NW Indian War = win 5/5 land battles OR permanently cede Ohio); #114/E9/K5/DH-36 re-confirmed
from the MULTIPLAYER end (Ted's meta-math POST 2671: ~50 CPU govs × ~3 actions × ~20% only move a crisis
meter ~1-2 spaces → solo human is the design target; the 3-GM relay re-confirms DH-36 without a clean
burnout quit); raise confidence, do NOT move them. NO new keystone, NO re-sequence, NO new
author-before-build or Decision-gated items (batch 26 nets 0 — #179 is split-but-buildable in E6/E16;
#181 rides #19/#20; #180/DH-71 ride the era-content/handover builds; #182 is gated on K2; the
#179-split, #178 ≤3-fires, #182-governors questions are designer-gated WITHIN their own work). The TOP
OF THE QUEUE is UNCHANGED: QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) — but
the federalism era-content cluster (#177/#178 + the four new #179/#180/#181/#182) is now the KB's
richest, most-forward-played next-era build target. game-mechanics §20.9-§20.15.1, §30.16 + technical-
guide §9 batch-26 lead + §9.6. debt #57/#58 + #59-#63.**
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★★ Batch-25 lead — ONE DESIGNER-GMed single-player run (`principle1772`, the 7th captured 1772
thread + the cleanest, most designer-authoritative 1-human-vs-9-CPU run in the KB: @MrPotatoTed [game
CO-AUTHOR] IS the GM and hand-ran all 9 CPU teams himself while @vcczar live-ruled; ~1772→~1800 NATURAL
endpoint, NOT a loss/win/burnout). CORROBORATION-HEAVY + TWO net-new federalism-era gaps [#177, #178] +
the strongest #114/E9/K5 escalation in the corpus. It does NOT move the top-of-queue. Reflect it by:
(1) ADDING #177 — the federalism foreign-affairs DECISION-EVENT SPINE (8 post-1788 president/cabinet
decision-events: French-Rev neutrality, Genêt, Pinckney/Jay Treaties, Haitian-Rev, alt-history
"Bourbons Restored" `realEvent:false` branch, NW Indian War, Bank-recharter; per-power
diplomacy-relation + DomStab/EconStab + enthusiasm + implementation-blunder rolls + late-1790s cabinet
+ Hamilton) to E1/scenario1788 + era-event/eraGraph (#92), coupling to E12 diplomacy (#107/#162), M —
which requires LIFTING THE TWO `eraGraph.ts::validate()` walls (`:153-155` `chartIndex >= 49`
"Federalism out of scope" + `:150-152` the pre-1789 president/cabinet decider ban → gate on `year >=
1789`) + adding per-power diplomacy-relation meters (none exist today); DESIGNED content the era graph
deliberately omits — Open Q (designer): confirm the intended next-era build, not a permanent scope wall;
(2) ADDING #178 — treaty-grants-TERRITORY + the bounded "3-strikes" retry budget (Jay Treaty grants
WI/IN/IL/MI on signing; a territory-gating event may fire up to 3 times before the land is permanently
lost, origin the NW Indian War "3 chances") to statehood/territory + DH-61, S, PAIRED WITH #177 (Jay
Treaty is the #177 carrier event): a treaty→`admitState` post-effect path (the Oregon-Treaty §10.4.2
pattern) + a `retriesRemaining` (default 3) per-event budget on the `EraEvent` type → GENERALIZES DH-61
into one reusable per-event retry primitive across treaty/war/event gates — Open Q (designer): ≤3-fires
canonical for ALL territory gates or a GM house rule?; (3) ★★ ESCALATING — NO new scope, NO re-sequence
— #114/E9/K5: `principle1772` is the FIRST 1772-cluster run to reach a natural endpoint, completable
ONLY because the designer hand-simulated all 9 CPU factions (he REWROTE the CPU career-track heuristic
mid-run, POST 323), so the per-faction CPU sim (the E9 handler suite + K5 CpuController) is the
LOAD-BEARING prerequisite — the cluster now carries BOTH 4 GM-burnout deaths AND a designer-paid
completion; raise confidence, do NOT move it; (4) STRENGTHENING corroborated items — #176 founding
MilPrep ordering bug NOW DESIGNER-FLAGGED + 3rd-source (Ted: "Seems… dumb," POST 73/259-261, still a
content/authoring constraint not a regression), #153 command-bootstrap NOW 4-SOURCE (Whipple, an
emergent Iron-Fist Admiral, 1st President with no celebrity head start), 7th-angle re-confirmation of
#86/#133/#100/#101/#92/#62/#31/#45/#155/#158 + the kingmaker ≤1-protégé/turn cap (POST 224). NO new
keystone, NO re-sequence, NO new author-before-build or Decision-gated items (batch 25 nets 0 — #177 is
buildable in E1; #178 in the territory work; the #177 scope-wall + #178 ≤3-fires questions are
designer-gated WITHIN their own work). The TOP OF THE QUEUE is UNCHANGED: QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1) — but the CPU-AI cluster (E9/K5) now carries the
corpus's strongest justification, and #177/#178 are the federalism-era next-build content.
game-mechanics §20.3.1 (#177) + §17.6.1/§21.5 (#178) + technical-guide §9 batch-25 lead + §9.6.**
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★★ Batch-24 lead — TWO founding-era playtests (`grass1772` 2-human-vs-8-CPU 1772 [DIED of
CPU-bookkeeping burnout, relaunched by ADDING humans] / `rookie1772` one-player ROOKIE solo run of
the most-complex era), the 5th + 6th captured 1772 sources; NEITHER GM designer-authoritative
(Ted/V posts are). CORROBORATION-HEAVY + ONE net-new founding gap [#176] + a META-PRIORITIZATION
justification raise. It does NOT move the top-of-queue. Reflect it by: (1) ADDING #176 (the founding
MilPrep prerequisite-ordering fix — the auto-forced 1774 Continental Army/Navy must be able to MOVE
MilPrep, which is mis-wired behind the federalism-era Militia Act ~1792 → a permanent founding
military crisis) to E1 (founding/RevWar) + E6 (#67 meter caps), S; an AUTHORING CONSTRAINT to honor
when founding war-content + a meter-prereq ladder are built (shipped has NO tier-prereq system —
`scenario1772.ts:9-17` boots `military:-2` as a raw scalar), NOT a regression; designer-gated open
Q (adopt Cal's reverse-the-prereqs fix or keep the crisis); (2) ★★ RAISING — NO new scope — the
justification/priority-rationale on the ONBOARDING / SOLO-APP / CPU-AI cluster (DH-69 + #114/E9/K5
+ the DH-36 automation note): both runs DIED to the manual CPU-faction sim + opaque rules
(`grass1772` because 2 humans couldn't hand-run 8 CPU factions → fixed by ADDING humans;
`rookie1772` = the strongest onboarding signal in the KB, walling on phase-processing / meter-
prereqs / phase-order / Lingering "never run before"), the 4th GM-burnout death — the single biggest
lesson across 24 batches; (3) SLOTTING two MINOR WAR CONSTRAINTS into #155/#56 / E3 (no new epic):
clamp the doubled-officer Planning term to 0-5 (`revolutionaryWar.ts:212` `*2` can hit 6+; XS) + a
scripted-event WIN PATH on the generic `War` model (`grass1772`'s "King George grants autonomy" =
a 3rd RevWar win-path) + surface meter prereqs in-UI (DH-69 UX); (4) STRENGTHENING corroborated
items with `grass1772`/`rookie1772` tags — #153 command-bootstrap NOW 4-SOURCE (Bartram), the
founding cluster #86/#133/#67-#134/#100/#101/#92 from a 5th+6th 1772 angle, #159 ahistorical-
Convention from 2 more founding traces. NO new keystone, NO re-sequence, NO new author-before-build
or Decision-gated items (batch 24 nets 0 — #176 is buildable in E1/E6; its reverse-prereq question
is designer-gated WITHIN that work; the rest is corroboration/justification). The TOP OF THE QUEUE
is UNCHANGED: QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) — but the
onboarding/solo-app/CPU-AI cluster (E9/K5 + DH-69) now carries the strongest justification in the
corpus. game-mechanics §17.4 (#176) + technical-guide §9 batch-24 lead + §9.6.**
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★★ Batch-23 lead — ONE playtest (`pop2012b`, the 2nd, DISTINCT 2012-START "Era of Populism"
run; GA-run [Rodja] but MrPotatoTed's in-thread point-of-order corrections are DESIGNER-
AUTHORITATIVE). CORROBORATION-HEAVY + TWO net-new legislation-data items that sit in EXISTING epics
+ one predicate sharpening + two clarifications. It does NOT move the top-of-queue. Reflect it by:
(1) ADDING #174 (committee bill-packaging + ranking-member counter + 2 chair-add powers + Puritan
committee-vote rule) to the committee/bill-packaging epic E14b (the E14 sub-PRs a/b) — S–M, ★
cross-check the 5 gates + chair-add powers vs `tedchange` BEFORE building, needs a ranking-member
field on `committeeChairs` + `Bill.packageOf?`; (2) ADDING #175 (`Legislation.repealable` + `lawClass:
repealable|replace-only|permanent`) to #42 (the bill-relationship graph, E29) + §27.5 (statehood-by-
bill, E4b — stamp admit-state bills `permanent`) — S, build WITH #42, open Q authored-list-vs-hand-
marked → #120; (3) SHARPENING the #88/#158 end-condition predicate to `meter === floorBand` (NOT
`meter <= crisisBand`) at E6 — no new item; (4) NOTING the #15 VP-rubric (+1 if YOUNGER than 60; row
7 reads `canBeIndependent`) + cabinet-decline-CPU-only (`isCPU`) clarifications at E16 + E10 — no new
build; (5) STRENGTHENING the corroborated modern-cluster items with `pop2012b` 2nd-source tags
(#86/#47/#13/#15/#16/#18/#51/#52/#25/#112/#124/#70/#91; #90/#43 career-track starvation) + appending
the Rodja GM-burnout death to the DH-36 automation-argument note. NO new keystone, NO re-sequence, NO
new author-before-build or Decision-gated items (batch 23 nets 0). The TOP OF THE QUEUE is UNCHANGED:
QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★★ Batch-22 lead — ONE playtest (`modernday`, a 2016-start current-rules 8-human modern
MULTIPLAYER — THE ONLY modern thread in the KB to CROSS AN ERA BOUNDARY [the 2024 Populism→Near-
Future transition]). TWO concrete modern build items that sit in EXISTING epics + a current-rules
spec-anchor + the #171 toggle proven flipping + two small bugs. It does NOT move the top-of-queue.
Reflect it by: (1) ADDING #172 (era-keyed confirmation thresholds + the `nuclearOption`
per-start-year boot flag + the SML enact/repeal action + the 60→fail→conversion→auto-Mod
fallback) to E16 (cabinet/confirmation) + E14c (cloture), S–M — it COMPOSES with #124/#52/#171 +
the batch-9 cloture decision (do NOT re-litigate); (2) ADDING #173 (New-Game start-year PRESETS =
the 14-band openings) to the K4 `BootSheet`/`scenarioBoot` picker (#115), S — each preset is a
scenario-as-data-row, GATED on `scenarioBoot`; (3) STRENGTHENING the #68/#2 point-banking item
(K3/K4) with the current-rules LIVE 2024-boundary instance (spec-anchor — matches `rep1800`; no
priority change); (4) FOLDING DH-70 (the `Lackey` PV over-weight — a `pv.ts` note, NO special-
case, since `pv.ts:77` already flat-−5's all negatives) into E18d/#120, XS; (5) CITING DH-69 (no
in-app rules / legal-move surface) under #115/CPU-AI (UX/onboarding, no engine size of its own);
(6) STRENGTHENING #43/E8 (the procedural generator OWNS the modern→future band — dataset exhausts
at the future boundary, now live-corroborated). #171 proven flipping ON→OFF in one save sharpens
debt #48 (no scope change). CORROBORATIONS (no moves): #92/#41, #13/#47/#15/#16/#18/#51/#111
(the 2-layer scorer published verbatim — MATCHES the FROZEN SPEC), #124/#25/#170 (re-confirms
the DNI⇒CIA-Director supersession), #70–#79/#1/#114, #110, #108, DH-54/DH-66. NO re-sequence, NO
new keystone, NO new author-before-build or Decision-gated items (batch 22 nets 0 — #172/#173 are
buildable in existing epics, DH-69 is UX, DH-70 is a pv.ts bug-note; the #172 boot-flag-vs-
derived question is designer-gated TUNING within E16/E14c). game-mechanics §27.2.1 (#68/#2 live) /
§9.3.10 (#172) / §27.9 (#173) + technical-guide §9 batch-22 lead + §9.6.**
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1).**

**★★★★★ Batch-21 lead — FOUR playtests (`nixon1972` 1972-modern-MP / `cpufull` all-CPU-1772
[reached a scripted CPU game-over] / `trump2024` Ted-run 2024-modern SETUP-ONLY / `solo1916`
1916-solo). ONE ★★ escalation (field-falsified) that re-prioritizes a debt item HIGHER WITHIN
its epic, TWO era-keyed gaps (one PARTLY SHIPPED), ONE DH bug. It does NOT move the top-of-queue.
Reflect it by ESCALATING #158 within E3 (the re-scoped hard-veto / points-bias + non-overridable
plurality guard, built AHEAD of the rest of the CPU/war track), ADDING #170 to E16, FOLDING #171
into the #4/#108 draft-profile work, FOLDING DH-68 into the DH-60 era-event-precondition work,
and appending corroboration tags — NOT by re-sequencing** (tech-lead §9 batch-21 lead + §9.6 —
BINDING):
> "1) ★★ #158 CPU anti-game-over — RE-PRIORITIZE HIGHER (the load-bearing move this batch).
> FIELD-FALSIFIED by `cpufull` (2nd live CPU game-over: flat-75% applied yet the game ENDED at a
> 4-5-4 plurality after the CC-President's reject was overridden). Build a HARD VETO (CPUs can't
> select a `triggersGameEnd`/surrender option in a solo/CPU-majority game) OR a points-based
> anti-peace bias, PLUS a non-plurality-overridable game-ending-peace (guard the CC/Congress
> override path). It is a SOLO-PLAY BLOCKER — the 'DH-29 of the CPU/war track' — and makes #155
> RevWar floor #3 LEAKY; bears on #114 (solo-app). Build it WITH the #155 war pass (E3) + the #75
> event-vote handler (E9), AHEAD of the rest of the CPU/war track. Size S–M. Verified UNBUILT
> (`phaseRunners.ts:2871` just sets `game.gameEnded`; `pickAIResponse` `eraGraph.ts:88-103` has
> no anti-game-over term). debt #32 (escalated) + #34a.
> 2) #170 era-keyed offices → extends boot/offices (E16), S–M. Founding-seat half SHIPS
> (`cabinetSeatsForYear` `types.ts:1196` era-gates Navy ≥1798 / Interior ≥1849 / Postmaster
> ≥1829). Add modern departments to `OfficeType` + a `foundedYear`/`createdByBill`/`supersedes`
> table + the DNI⇒CIA-Director supersession, on the planned boot-seed `cabinetSeats` refactor.
> Pairs with era-content/scenario-boot. debt #47.
> 3) #171 era-keyed draft toggle → folds into the #4/#108 draft-ideology-profile work, S. An
> era-keyed boolean gating the #4 profile, keyed to realignment completion (1916 ON · 1972 ON ·
> 2024 OFF). Open Q: the exact ON→OFF boundary. debt #48.
> 4) DH-68 → folds into the DH-60 era-event-precondition work (now multi-era), S. Port the
> 1772-graph `precondition`/`warOutcome` layer into the calendar-only 1856 builder + a new
> Progressive builder; gate Czechoslovakia/Hungary on a WWI-end event. Same surface as BUG-1 +
> E15. debt #49.
> 5) Corroborations: CPU suite (#70–#79 ← `cpufull`, confidence ↑); modern band 2021-2025 +
> start-year confirmations (#92/#169 ← `trump2024`/`nixon1972`/`solo1916`); crisis/war/Watergate
> (← `nixon1972`, which was ALSO a GM-burnout stall — the upkeep-automation argument grows).
> 6) Top-of-queue UNCHANGED (QW0 → K0/K2 → K3/K4 + scenarioBoot → E1) — BUT #158's escalation
> elevates the CPU anti-game-over fix to a higher-priority item WITHIN the CPU/war track.
> Decision-gated recount: 0."

So **#158 is ESCALATED within E3** (re-scoped to a hard-veto / points-based anti-peace bias +
a non-plurality-overridable game-ending-peace, field-falsified by `cpufull`, a solo-play blocker
built AHEAD of the rest of the CPU/war track + coupled to E9 handler 9g/#75 + #114; #155 RevWar
floor #3 now LEAKY); **#170 is ADDED to E16** (era-keyed offices, founding half shipped, add
modern departments + the DNI⇒CIA-Director supersession on the boot-seed cabinet-seat refactor,
S–M); **#171 folds into the #4/#108 draft-profile work** (era-keyed toggle OFF in modern, S);
**DH-68 folds into the DH-60 era-event-precondition work** (multi-era, S); and the
corroborations append tags — all additive, no re-order, batch 21 nets 0 (no new author-before-
build, no Decision-gated change). **The top of the queue is UNCHANGED — QW0 → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → E1 — but #158's escalation makes the CPU anti-game-over fix a
higher-priority item WITHIN the CPU/war track (a solo-play blocker).**

**★★★★★ Batch-20 lead — FOUR meta/design threads (`planb` build-finishing PROCESS plan /
`dbomit` missing-pol requests / `biden2021` modern era-content / `ampu2wish` OUT-OF-SCOPE
AMPU-2 wishlist). A LIGHT batch: ONE new runtime mechanic, ONE authoring-process gate, the
rest dataset / quarantine. It does NOT move the top-of-queue. Reflect it by ADDING #169 to E15
(the elderly-pres mid-campaign drop-out → endorse-VP event, S), RECORDING #168 as a pre-build
authoring-quality pass (NOT a scheduled code task) paired with #120, FOLDING `biden2021` into
the modern content tail (E30 / #92/#41 / §28.13), FOLDING `dbomit` into #120, ORDERING the
per-era content authoring chronologically (a process note), and QUARANTINING `ampu2wish` — NOT
by re-sequencing** (tech-lead §9 batch-20 lead + §9.6 — BINDING):
> "1) Top-of-queue UNCHANGED: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1. Almost nothing this
> batch is new code; the single runtime delta is #169.
> 2) #169 mid-campaign drop-out → endorse-VP event (DESIGNED, verified UNBUILT — zero
> `dropOut|replaceOnTicket|endorseVP|midCampaign|forcedOut|stepAside` in `src/`) → a SMALL
> addition to the era-event epic E15 (or election E20b), size S. Age-roll-gated (the substrate
> ships — `ABILITY_LOSS_RULES.oldAge` `minAge:70` `types.ts:521` + `MORTALITY_RULES` + PV age
> penalty `pv.ts:85`; the candidate roll is keyed at 70, NOT 75) → 50% to pull → −1 party malus
> into the §21.9 modifier stack (lands on the VP even when the pres is pulled) → VP swapped onto
> the ticket in `runPhase_2_9_4` (`phaseRunners.ts:3752`). DISTINCT from #37 (defeat-then-
> retire) — #169 removes the candidate DURING the campaign. Era-of-Populism-scoped until it
> fires twice. debt #45.
> 3) #168 → an AUTHORING-PROCESS GATE, NOT a code epic. The roadmap NOTES it (terminology
> contract + branch-path/meter/% sanity-audit + trait/interest compilation) but does NOT
> schedule it as a code task; it pairs with the #120 dataset pipeline. A pre-build authoring-
> quality pass. debt #46.
> 4) Chronological-import pipeline constraint: all per-era content authoring should be sequenced
> CHRONOLOGICALLY (Anthony imports pols/events chronologically; all changes route through
> vcczar) — a process note that orders the content work, NOT the engine track.
> 5) `biden2021` → modern era-content (extends the modern band past 2020, #92/#41; the ONE new
> mechanic is #169; pardon pres-actions block on #122) — folds into modern-era content (E30 /
> §28.13), NOT a new epic.
> 6) `dbomit` → #120 (pure dataset, no per-pol rows; standardization rulings pair with #168);
> post-1772 start-guide → #115; pol-trading wish → DH-37; dynamic-biases wish → DH-34.
> 7) `ampu2wish` → OUT OF SCOPE — schedule NO AMPU-2 wishlist item for AMPU 1 (day-by-day
> Paradox rebuild, full House, dynamic regions/biases, scouting/hidden-stats); quarantine only.
> 8) Decision-gated RECOUNT: 0 (no item enters/leaves the bucket; #169 is a designer-
> authoritative procedure with a couple of tuning guards, #168 is an authoring gate). No NEW
> keystone, no re-sequence; top of queue UNCHANGED."

So **#169 folds into E15** (the elderly-pres drop-out → endorse-VP event, S, DISTINCT from #37,
Era-of-Populism-scoped); **#168 is recorded as a pre-build authoring-quality pass** (NOT a
scheduled code task) paired with #120; **the chronological-import constraint** orders the
per-era content authoring; **`biden2021` folds into the modern content tail** (E30 / §28.13);
**`dbomit` folds into #120**; and **`ampu2wish` is quarantined OUT OF SCOPE** — all additive,
no re-order, batch 20 nets 0 (no new author-before-build, no Decision-gated change). **The top
of the queue is UNCHANGED — QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → E1.**

**★★★★★ Batch-19 lead — `fixes2022` is the EARLIEST captured discussion thread (Fall 2022,
pre-early-release build window); CORROBORATION- + PROVENANCE-heavy with ONE new subsystem; it
does NOT move the top-of-queue. Reflect it by FOLDING #167 into E10b (the no-successor member
of the E10b crisis family, reusing #62), FLAGGING the enthusiasm FROZEN SPEC on E23 + E20b,
BUMPING build-confidence on #153/#135/#124/#121/#88 where they sit, slotting the era-event
firing-rate budget into E15 (S), and folding the dataset batch into #120/E18d — NOT by
re-sequencing** (tech-lead §9 batch-19 lead + §9.6 — BINDING):
> "1) Top-of-queue UNCHANGED: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1. The earliest discussion
> source + the smallbugs thread's genesis (POST 637-640).
> 2) #167 no-eligible-successor constitutional-crisis (DESIGNED, verified UNBUILT — zero
> `successionCrisis|actingPresident|coup` in `src/`; binds at the `vacateOffice` vacancy site
> `phaseRunners.ts:2446-2449` that today just nulls `presidentId`, the SAME site as #61) →
> FOLDS INTO E10b as the no-successor member of ONE E10b crisis family: emergency-Congress
> succession-law vote (auto-signed) → House 1-vote-per-state acting-President election → scaled
> 0/−1/−2/−3 DomStab penalty → coup branch (#88/debt #28 end-condition family). SHIPPABLE-FIRST:
> the PPT-as-acting-President interim default (S, POST 849-850), then the full procedure (M).
> Step (ii) REUSES the #62 contingent-House-election delegation-vote machinery — build #62 ONCE,
> reuse for both. Couples #61 + #88/debt #28 + DH-54/DH-33/DH-66. M full / S PPT-interim; debt #43.
> 3) PROVENANCE = build-CONFIDENCE, no new scope: `fixes2022` is the EARLIEST source for
> #153/#135/#124/#121/#88 — designer intent from the START → raise confidence where they sit
> (#153/#88 debt #31/#32; #124 E16; #121 E3b); no item changes size or epic.
> 4) ENTHUSIASM (#18/#51/#124) is the PERENNIAL FORK → FREEZE the spec: the strongest corpus
> evidence (Anthony stalled ~½ into 2.1; V re-derives it differently each playthrough, POST
> 713-716) that this is the single likeliest place the build drifts from designer intent —
> a RISK ANNOTATION on E23 (#51 4-step) + E20b/`calcStateVote` (#18 2-layer scorer + ±3 cap,
> debt #1); treat the #51/#18 resolutions as a FROZEN SPEC; no code/scope change.
> 5) Era-event FIRING-RATE budget (~70%/era dynamic limit, POST 114-123; runner has none today,
> `phaseRunners.ts:2796`) → small addition to E15 (S, debt #44). The late-start boot-filter (POST
> 413-423, INTENDED) builds WITH BUG-1/#92; the scripted-event build-out is CORROBORATION of the
> shipped `EraEvent` model, NOT a gap.
> 6) #120 dataset umbrella → fold the `fixes2022` batch in (E18d): ~20 named items + ~10 effect-
> sign bugs → DH-53 + vcczar's own ~1800-legisprop audit; Bob Scott dup = `smallbugs` §2b; one
> `CURATED_ROWS` pass.
> 7) Decision-gated RECOUNT: 0. #167 is a designer-authoritative procedure (ready-to-build,
> PPT-interim-first); the enthusiasm freeze is a risk annotation, not a new gate. No NEW keystone,
> no re-sequence; top of queue UNCHANGED."

So **#167 folds into E10b** (one crisis family, reuses #62, PPT-interim-first); **the enthusiasm
FROZEN-SPEC risk flag annotates E23 + E20b**; **#153/#135/#124/#121/#88 get earliest-source
confidence-bumps where they sit**; **the era-event firing-rate budget slots into E15 (S)**; and
**the `fixes2022` dataset batch folds into #120/E18d** — all additive, no re-order, batch 19 nets 0.
**The order itself is UNCHANGED — the TOP OF THE QUEUE is QW0 (constant=4 + alt-state
guard, ship FIRST) → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) …
— E1 still carries the DH-61 (boot-seed active wars, in K4) + DH-62 (pre-12A EC mode, in
E4) prerequisites, and the XS quick-win cluster runs through QW18 (#143 = QW17, #153 = QW18).**

**★★★★★ Batch-17 lead — `ted1772` is FOUNDING-ERA CONFIDENCE + TWO NEW FOUNDING
SUBSYSTEMS; it does NOT move the top-of-queue. Reflect it by PROMOTING #153 to
build-with-confidence + EXTENDING E1 with #159 (the ConCon subsystem, M–L) + COUPLING #158
with #155/E3 (one of the three RevWar floors) + documenting the three-RevWar-floor
constraint on #155 + slotting FL-on-death (S, E16) + DH-65 (XS, E18d), NOT by
re-sequencing** (tech-lead §9 batch-17 lead — BINDING):
> "1) Top-of-queue UNCHANGED: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1. 4th 1772 source +
> 3rd CPU-heavy source — corroboration-heavy founding-era content; nothing moves the
> keystones.
> 2) #153 command-bootstrap → PROMOTE to build-with-confidence. 3-source canonical
> (terror2000 · tedchange · ted1772) + demonstrated LIVE (emergent President from a
> 0-Command CPU pol — St. Clair). The ×2-Command-gain knob is load-bearing, sits on the
> draft/command path (NO keystone dependency), ready-to-build. Mark it ready /
> high-confidence wherever #153 lives.
> 3) #159 ConCon subsystem → folds into the founding-boot / E1 surface; M–L (the largest
> new build surface this batch, downstream of the keystones, EXTENDING the shipped
> `constitutionalConvention.ts` superset skeleton). Highest-value extensions: the
> slave-compromise→per-state-EV-penalty plank and the per-article 2/3 + eliminate-revote
> loop; then gov-sends-3-delegates, random-egghead drafter, debate-sway,
> threshold-amendable, Judiciary-Act-sets-SCOTUS-count. (Shipped today: 7 articles, single
> CPU-consensus pass, Father=highest-PV, approve≥9 ratify, flat EV — the elimination loop
> / EV-penalty plank / random-egghead are unbuilt.)
> 4) #158 CPU-anti-game-over → build WITH the #155 war-balance pass (E3) + the #75
> event-vote handler (E9); S. It is one of the three RevWar floors.
> 5) The three RevWar floors = a bounded CONSTRAINT on #155 (already in E3): when adding
> enemy-strength/battle-size/Officer-Mil-cap/per-theater, preserve floor (1) French-alliance
> void-loss flag [SHIPPED, `revolutionaryWar.ts:259,268-270`], floor (2) the 2/3 peace
> threshold [BUILD — 55.5% must not pass], floor (3) #158's 75% override [BUILD]. A 1772
> game with all three intact must stay winnable.
> 6) FL-on-death → small standalone fix; S — factor the 2.2.3 vacant-seat election into
> `electFactionLeader(snap,f)` and call it at death time instead of deferring (shipped
> defers; ruling is immediate).
> 7) DH-65 → XS dataset audit, joins #120 — the Cosmopolitan⊕Provincial half is ALREADY
> engine-enforced (0 both-held in the 18,561-pol dataset); the real fix is a CURATED_ROWS
> founding-window (1768-76) same-name audit + a build-time validation gate in
> `legislatorsToDataset.mjs`.
> 8) CORROBORATIONS (no re-order): ted1772 tags appended to #56/#133/#70/#72/#74/#76/
> DH-61/#86/#136 — founding-boot + CPU suite + war engine + Congress, now 4th-1772 /
> 3rd-CPU corroborated. Marquee rulings folded into topical homes: FL-on-death→immediate;
> one-protégé-per-turn cap; conversion-target once-per-half-term; pre-12A VP = most-EV
> runner-up (sharpens DH-62)."

This is the **most-corroborated era in the KB now** (4 threads: `new1772` MP / `tea1772`
solo-all-CPU / `85f8e6b4` solo-aesthetic / `ted1772` mostly-CPU, plus `oopscpu` all-CPU
1788) — but it is **CONFIDENCE, not new keystones or a re-sequence.** #159 lives inside E1
(which already carries the DH-61 + DH-62 prerequisites and sits behind K4/`scenarioBoot`);
it EXTENDS the shipped `constitutionalConvention.ts` (like the 1856 CW engine extends
`scenario1856`, not a new scenario) and stays downstream of the keystones. #158 builds
inside E3 alongside #155 as RevWar floor (3). #153 is a confidence promotion of an
existing XS–S quick-win (QW18), not a new row. **Three OPEN QUESTIONS the digest raises
stay human-gated (tuning, not blockers):** (a) #158 — flat 75%-oppose vs points-based
anti-peace bias (pick one); (b) the negative-points floor — V's 0-floor vs Ted's
run-continuity negatives (likely 0); (c) St. Clair's home-state PA-vs-OH when an alt-state
isn't owned yet (pairs with #92's territory gate). All bind inside E1/E3/E9 and are
flagged at game-mechanics §30.x. **Decision-gated / parking-lot counts are UNCHANGED
(batch 17 nets 0):** no item enters or leaves the user/designer Decision-gated bucket, and
no new author-before-build item is added — TWO forks RESOLVE OUT (both were open, not
Decision-gated-bucket items): **FL-on-death → immediate** and **#153 → 3-source
canonical / build-with-confidence.**

**★★★★★ Batch-16 lead — `hd1` HANDS the designed fix for the Reconstruction solo-blocker;
it does NOT move the top-of-queue. Reflect it by RE-SCOPING E3b (d) around #156 (the
4-plan model / canonical DH-29 fix, M–L) + EXTENDING E3 with #155 (war-balance pass, M)
+ slotting #157 into E3b (a) (CSA seeding, S) + DH-64 into E18d (dataset audit, XS) +
REFRAMING DH-29 to structural-deadlock-fixed-by-#156, NOT by re-sequencing** (tech-lead
§9 batch-16 lead + §9.1.12 — BINDING):
> "1) #156 4-plan Reconstruction model → the CANONICAL DH-29 FIX; folds into E3b as its
> readmission-half definition-of-done. Highest-value Reconstruction target — it
> UNBLOCKS DH-29 (the solo-play Reconstruction blocker that's gated antebellum/CW
> scenarios). Now a designed fix in hand (vcczar-authored), not an open blocker:
> `game.reconstruction = {plan, adoptedBy, startYear}` + the 4 plans on both Pres +
> Congress + the 'adopted by Congress OR President' prerequisite (President adopts
> unilaterally) + the +2 Deep-South / +1 other-seceded time-boxed bias on
> `calcStateVote`. Size M–L. Removes the K5 soft-dependency for the solo case (President
> adopts directly). Verified entirely UNBUILT (0 Reconstruction hits in `types.ts`).
> 2) #155 war-balance pass → extends the war engine (E3 / #56/#152). Add an
> enemy-strength term (via `rng.ts`, also closing the `phaseRunners.ts:3603` `Math.random`
> determinism leak) + battle-size weighting + Officer-Mil-share cap + per-theater
> scoring; resolve the cross-run open questions (multiplier 1.0-vs-0.5; naval
> hard-gate-vs-continue-roll; permanent-vs-one-term war-hero bonus). Size M; BOUNDED by
> the 1772-RevWar-must-stay-winnable constraint; pairs with #152.
> 3) #157 CSA-government seeding → folds into the #58 secession+war epic (needed for the
> CSA-victory branch). Size S; depends on the per-pol Southern-Unionist gate.
> 4) DH-64 (Southern-Unionist trait mislabel) → dataset audit via `scripts/seedDataset.mjs`
> CURATED_ROWS; joins the #120 dataset-umbrella pass. XS.
> 5) DH-29 reframe: update the DH-29 entry from 'CPU-can't-pass-Ironclad' to STRUCTURAL
> deadlock (humans on both sides ALSO deadlocked, `hd1#POST 2678`) fixed by #156's
> unilateral-adopt. E3b becomes more attractive / less risky but stays downstream of the
> keystones.
> 6) Top-of-queue UNCHANGED: QW0 → K0/K2 → K3/K4 + scenarioBoot → E1.
> 7) 3rd Civil-War run + 5th antebellum source → HIGH corroboration confidence on the
> war/Reconstruction/secession cluster."

This is the **highest-value Reconstruction work in the backlog** — but it is **NOT a
keystone and does NOT re-sequence anything.** #156 lives inside E3b (which already sits
right after E3 + K2, §9.1.2); its arrival makes E3b's readmission half **less risky**
(its hardest open question — how Reconstruction ever resolves solo — is now answered by
the unilateral-adopt prerequisite) and **removes the soft-dependency on E9 handler #2
for the solo case**, but E3b stays downstream of the keystones (K0/K2/K3/K4) exactly as
before. **The four cross-run open questions** (war-end multiplier 1.0/0.5; naval
hard-gate vs continue-roll; war-hero bonus permanent/one-term; whether #156's
prerequisite hard-gates ALL readmission or permits a default No-plan) are **tuning, not
blockers** — they bind inside E3/E3b and are flagged at game-mechanics §30.x for the
human. **Decision-gated / parking-lot counts are UNCHANGED:** no item enters or leaves
the user/designer Decision-gated bucket, and no new author-before-build item is added —
**DH-29 was a debt item, now with a designed fix (#156); #156/#155/#157 are buildable;
DH-64 is dataset maintenance.**

**★★★★★ Batch-15 lead — `terror2000` is MODERN-ENGINE MID-TIER WINS; it does NOT move the
top-of-queue. Reflect it by PROMOTING #18 to ready-to-build (E20b) + adding #88 to E6 +
extending E3 (#152) + re-scoping E16 a THIRD time (#124+#151) + slotting #153/#154 +
recounting Decision-gated −2, NOT by re-sequencing** (tech-lead §9 batch-15 lead +
§9.1.11 — BINDING):
> "1) #18 canonical election scorer → PROMOTE to ready-to-build (S–M). Fully SETTLED
> (V's 2-layer model: a universal per-ideology meter modifier on both parties / every
> state + per-party enthusiasm, ±3-capped); binds at `calcStateVote`
> (`phaseRunners.ts:3709-3711`), composes with the #51 reshuffle (E23) + the QW3 ±3 cap.
> It LEAVES the Decision-gated bucket (was #18 state-scope, user-gated). The most
> attractive near-mid-tier win this batch. 2) #88 autocratic-coup terminal → NEW small
> end-condition module (S). The FIRST proven game-over/LOSS state in the KB. Build the
> meter-driven per-event-phase game-end roll (HonestGov=floor → ~20%/phase) TOGETHER
> with the APOCALYPSE countdown clock as ONE meter-driven endgame module over the
> existing `triggersGameEnd` surface (event-only today, `phaseRunners.ts:2871`; terminal
> `GameOverScreen` already exists). 3) #152 war-defeat → EXTENDS the generic war engine
> (#3 / #56/#106), M within E3. Add the defeat loss package (officers/President −1
> all-future-elections; Party-Pref crater) + multi-phase wars; completes DH-47. The
> shipped resolver (`phaseRunners.ts:3615-3620`) ends at warScore but applies NO loss
> package. The President-loss term couples into the #18 scorer. 4) Cabinet cluster
> #124+#151 → RE-SCOPE E16 a THIRD time (M + S), lands after K2+K5. Bundle confirmation
> + lobby→POINTS + the 3-state (upset/fine/happy, ±3-cap, one-roll-per-faction)
> enthusiasm channel + the #151 −500/slighted-same-party-faction fairness penalty + a
> diversity check; all Era-of-Terror-gated (an era-BAND rule delta). #124's designer-
> gated percentages are now largely RESOLVED by the live 3-state tuning. 5) #153 (XS:
> ×2 Command-gain UNBUILT) → draft/Command consistency [QW18]; #154 (S: the 4-step
> vacancy-fill ladder, UNBUILT) → the #115a/#115b appointment-ladder family. Decision-
> gated recount −2 — #18 state-scope resolves OUT (user-gated); #124-percentages
> resolves OUT (designer-gated). Top-of-queue UNCHANGED; #18 + #88 are attractive
> mid-tier modern-engine wins, NOT keystones. This is the 4th Ted-run/CPU-heavy source
> (corroborates E9) + the 2nd modern-era native run."

The batch-15 placements in one line each (NO re-sequence, NO new keystone): **#18 →
PROMOTED to E20b** (the canonical 2-layer meter→election scorer, ready-to-build, composes
with E23 + QW3, binds at `calcStateVote`); **#88 → E6** (the first proven LOSS state — the
HonestGov-floor Autocratic Coup per-event-phase roll, built WITH the APOCALYPSE clock as
ONE meter-driven endgame module over `triggersGameEnd`); **#152 → E3** (war-DEFEAT loss
package + multi-phase wars, M within the war epic, COMPLETES DH-47, President-loss term
feeds E20b); **#124+#151 → E16's 3rd re-scope** (the 3-state enthusiasm channel + the −500
appointment-fairness penalty + diversity, Era-of-Terror-gated; #124-percentages RESOLVED);
**#153 → QW18** (the ×2 Command-gain multiplier); **#154 → E16** (the 4-step elected-seat
vacancy ladder, with #115b + E10b); **Decision-gated −2** (User-gated 3→2; Designer-gated
11→10 logical / 9 bullets). Corroboration tags appended to **#113** (E30), **#56/#106**
(E3), **#85/#130** (QW7/E18), **#90/#92** (K3), **#1/#102/#135/#143/DH-25**, and the **E9
CPU suite** — `terror2000` is the 4th Ted-run/CPU-heavy source + the 2nd native modern run.
**No keystone moves, no epic splits, no re-sequence.**

**★★★★ Batch-14 lead — `gild1868` is DOWNSTREAM GILDED-ERA CONTENT; it does NOT move the
top-of-queue. Reflect it by adding ONE downstream EG epic + extending E3b (#148) +
strengthening #41/E22 to its native spec + appending corroboration tags, NOT by
re-sequencing** (tech-lead §9 batch-14 lead + §9.1.10 — BINDING):
> "The five batch-14 deltas — #147, #148, #149, #150, DH-63 — are NOT five independent
> backlog rows; they are ONE 'gilded-era content' epic that rides on top of the era
> model + the economic engine + the bill-relationship graph + the Reconstruction epic.
> The Gilded Age is UNBUILT (`Era` has no `gilded`, `types.ts:1337`; only
> `scenario1772.ts`/`scenario1856.ts`; the era is hand-run on `modern` tuning, gap #41).
> It does NOT move the top of the queue — it is downstream content. Treat #41 as the
> umbrella and slot the epic AFTER `scenario1788` (E1) + a mature `advanceEra` + #116
> (E4c economic engine) + #42 (bill-relationship graph) + #57 (E3b Reconstruction)."
>
> The binding sequencing calls (lifted from §9.1.10):
> 1. **Top-of-queue is UNCHANGED by this batch.** QW0 → K0/K2 → K3/K4 + scenarioBoot →
>    E1 (`scenario1788`) still lead. Gilded is downstream era-content.
> 2. **#41 is the umbrella; `gild1868` is its full native spec** (red/blue-FLIPPED
>    roster: RED = Republicans, BLUE = Democrats by 1868, POST 6 — so the era-content-
>    band model carries party-label-by-era, not a fixed RED/BLUE↔party mapping; the
>    nickname table; the era-event spine; the bill catalog; the SCOTUS docket; the 20-yr
>    timer). **`scenario1868` is "another scenario-as-data-row" once the BootSheet
>    pipeline + content-band era model land — AFTER `scenario1788` + a mature
>    `advanceEra`.** Do NOT build a bespoke Gilded code path; it is K4 content. →
>    STRENGTHENED at the E22/#41 row.
> 3. **#147–#150 + DH-63 are ONE epic (EG) gated on K3/K4 + the era model + #116/E4c +
>    #42.** Not a near-term quick win — the tariff/currency systems need the economic-
>    content state machine and the bill-relationship graph to exist first. → ADDED as
>    the EG epic after E22.
> 4. **DH-63 folds into #42 + #147's MonetaryRegime** (the mutual-exclusion constraint)
>    — XS-S, no standalone work. → folded into the EG epic's (d) + tagged on E2/#42.
> 5. **#148 EXTENDS the existing #57/E3b Reconstruction epic** (the 20-yr timer +
>    appointment-by-Speaker/PPT-faction + Solid-South sunset). It does NOT open a new
>    epic, and it **inherits the DH-29 solo-blocker** — the Strict/Ironclad plan never
>    passes with CPU factions, so solo Reconstruction must be resolved before any
>    antebellum/CW/Reconstruction scenario (incl. a Gilded boot that turns the timer on)
>    ships solo. → EXTENDED at the E3b (d) Reconstruction sub-PR.
> 6. **The 3rd GM-burnout death** (`gild1868`, after `new1772`/`dem1820`) reinforces the
>    automation-reduces-upkeep argument (DH-36 family) — the spreadsheet legislative
>    phase is the hardest to run by hand (POST 868). **Cite it, do NOT queue it** — no
>    new mechanic. → it is the same prioritization ARGUMENT behind the CPU suite (K5/E9)
>    + the upkeep-reducing items (#19/#20, E7/E8/#55), now corroborated across 3 dead
>    threads (`new1772` + `dem1820` + `gild1868`); reflected in how the order is
>    justified, NOT as a row.

**★★★ Batch-13 lead A — `oopscpu` DOES NOT change the K5/E9 ORDER; it DE-RISKS E9.
Reflect it by folding OC-* into handler rows + bumping build-confidence, NOT by
re-sequencing** (tech-lead §9 batch-13 lead + §6.6.1 batch-13 — BINDING):
> "`oopscpu` is the first batch that systematically validates a whole subsystem's spec
> (K5 + the E9 §25 handlers) BEFORE it is built. It turns handlers
> #70/#72/#73/#74/#75/#76 from 'designed' into 'designed + field-validated with concrete
> failure modes + Ted's fixes' — higher build-confidence, lower spec-risk — without
> changing the build ORDER. Fold the OC-1…OC-8 sub-gaps into the relevant handler rows
> as sub-rules: **OC-3 → handler 9b (legislation): the highest-priority, ★
> balance-critical sub-rule** (an ideology-floor gate + a secession/slavery-active check
> so CPUs don't AYE crisis bills that betray their own ideology cards — the
> peaceful-1792-abolition bug, `#POST 162-180`); **OC-2 → handler 9c (leadership): ONE
> canonical `chamberControl(snap, chamber)` helper** shared by leadership-select + the
> ≥60%-chamber proposer gate (fixes the minority-chairs-propose collision, `#POST 151`);
> **OC-1 + OC-5 → handler 9d (cabinet)**: scandal-resignee re-appointment cooldown (OC-1,
> also DH-22 / handler 9l, `#POST 65`) + court-as-firing-precedent gate (OC-5, `#POST
> 184-187`); **OC-6 → the kingmaker handler (§25.11)**: highest Com+Leg+Gov tiebreak for
> kingmaker→protégé pairing (`#POST 308`); **#72 sharpen on 9a/9m**: the VP-retention HARD
> rule + the pre-12A nomination trio (`#POST 192-197`). **Handler 9e (convention, #71) is
> the ONE handler NOT validated** — 1788 predates conventions — so keep it
> `drums`-spec-only at LOWER confidence; a post-12A all-CPU run validates it."

So the E9 handler rows are **strengthened in place** (field-validation tags + OC-* sub-rules
folded in), build-confidence bumped on the 6 validated handlers, 9e flagged as the one
still needing validation — **no re-order, no new handlers.**

**★★ Batch-13 lead B — #143 (XS, RULED) → QW17; #61 death-branch (S) → E10b** (tech-lead
§9 batch-13 lead #2/#3 — BINDING):
> "#143 post-election Command decay (40% / −1 Command for non-Pres/VP candidates per
> presidential cycle) is XS standalone, RULED + tested live (`oopscpu#POST 1, 224`). It
> binds at `runPhase_2_10_End` (`phaseRunners.ts:4171`), gated on `isPresidentialYear`,
> after the 2.9.4 ticket roster is known; applies via the existing `loseCommand`
> (`abilities.ts:15`). Slot it near QW0 / the XS-consistency quick-wins. #61 death-branch:
> a Presidential DEATH → VP becomes FULL President (no acting, no action-divert roll), is
> NOT auto party/faction leader → re-run the leadership IRV (Ted-RULED `oopscpu#POST
> 324-329`). This SUPERSEDES the batch-11 `arkzag` 'acting/action-divert' read for the
> DEATH case — the acting state is retained ONLY for the incapacity branch. It folds into
> E10b (already re-scoped batch 11) as an S addition with the now-reconciled spec."

So **#143 lands as QW17** (the XS quick-win cluster) and **the #61 death-branch re-scopes
E10b** (S) with the reconciled death = full-President spec; acting/divert kept for incapacity.

**★★ Batch-13 lead C — DH-61 (S) + DH-62 (M) are `scenario1788` (E1) PREREQUISITES —
sequence WITH E1** (tech-lead §9 batch-13 lead #6 — BINDING):
> "Neither is optional for a 1788 boot. **DH-61 (S):** scenario-boot must seed era-active
> wars (they forgot the Northwest Indian War) → a `BootSheet.activeWars` field + a boot hook
> over the generic `War` model; folds into the scenario-boot pipeline (Phase-1 #3 / K4
> BootSheet). **DH-62 (M):** the pre-12A two-vote/no-ticket EC mode + same-state-EV → an
> era-keyed election-mode variant in the per-state-EC epic (Phase-1 #4 / E4). `scenario1788`
> (E1) is near the front of the queue, so these two must land WITH it — make the dependency
> explicit on the E1 row."

So **DH-61 is wired into K4 / the boot pipeline, DH-62 into E4 (per-state EC), and BOTH are
explicit deps on the E1 row** — a 1788 boot cannot run (no active wars seeded; no pre-12A
election mode) without them.

**★★ Batch-13 lead D — OC-4 + OC-8 → designer-gated sub-bucket (9 → 11)** (tech-lead §9
batch-13 lead #4 — BINDING):
> "OC-4 (off-ideology CPU draft gate — Ted wants 'a better third way' than
> draft-strong-pol-off-ideology vs. uncontested; do NOT silently ship a hard gate;
> `oopscpu#POST 227-228, 234`) and OC-8 (define 'office' for the Scandalous-Non-Office-Holder
> forced-out event + rewrite the event text; flagged to `@vcczar`, `oopscpu#POST 334, 336`)
> are OPEN design calls — add both to the designer-gated parking sub-bucket alongside the 9
> open `tedchange` items. NOT ready-to-build until Ted/vcczar closes them."

So **Decision-gated counts: User-gated 3 (unchanged) + Designer-gated 11** (9 batch-12 + OC-4 +
OC-8). The all-CPU run also **resolves #52 for the all-CPU case** (CPU SCOTUS by
ideology-distance) — the player-vs-CPU surface stays user-gated; **#18 state-scope RECURS
unresolved** (`oopscpu#POST 205-214`) and stays user-gated.

**★★ Batch-13 lead E — the ALL-CPU-TEST is a repeatable SPEC-VALIDATION methodology
(recommend it; NOT a build row)** (tech-lead §9 batch-13 lead #5 / §9.1.3 — BINDING):
> "Adopt the all-CPU test as a repeatable spec-validation tool. `oopscpu` validated SIX
> handlers (#70/#72/#73/#74/#75/#76) BEFORE they're built, surfaced 8 concrete sub-gaps
> (OC-1…OC-8), and — because an all-CPU game needs no human players — is **immune to the
> GM-burnout (DH-36)** that killed two playtests. It is cheap, repeatable, and the highest-ROI
> validation method for the CPU surface. **Recommend a POST-12A all-CPU run before building
> the convention handler #71 / handler 9e** — 1788 predates conventions, so #71 is the one
> handler `oopscpu` could not exercise; a post-12A all-CPU run would validate it exactly as
> `oopscpu` validated the other six. Record this as a methodology note, not a build row."

So this is a **methodology note, NOT a roadmap row**: run an all-CPU test to validate a CPU
subsystem's spec before building it, and specifically run a **post-12A all-CPU game to validate
handler 9e (convention)** before that handler is built. It reinforces (does not replace) the
upkeep-automation rationale (DH-36, below) — automation + spec-validation-without-humans both
reduce the manual burden that kills playtests.

**★★★★★ Batch-12 lead A — QW0 / BUG-0 FULLY CLOSES; promote it to top-of-queue
with const=4 + alt-state EXEMPTION guard** (tech-lead §9 batch-12 lead #1 — BINDING):
> "`smallbugs#POST 734-735` (vcczar-12-30-25 'Approved by vczar') settled the cap:
> 'A faction is limited to FOUR total attempted moves per half-term. A politician
> that moves to an ALT-STATE does NOT count against the FOUR total moves.' This
> closes the long-running BUG-0 / QW0 / batch-10 top-of-queue item from 'open-
> design + ready-to-build' to **fully settled and ready-to-ship**. Fix = a one-line
> constant edit + a guard at the relocation accumulator so alt-state moves don't
> decrement the budget (verify the alt-state accounting in
> `runPhase_2_1_4_Relocations`). **This is now the cheapest + safest win in the
> whole roadmap; do it FIRST.** No human review-gate; no designer-gate; the cap
> value AND the exemption are both authoritative."

So **QW0 is the new top of the queue** (it was previously the top, but the cap
value was open; now it's settled + the alt-state exemption is authoritative). The
top-of-queue order is now **QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` →
scenario1788 (E1) …**.

**★★★★★ Batch-12 lead B — Cabinet → enthusiasm REWORK (#124) is the M-sized
teardown; LAND AFTER K2 + K5; build it WITH the confirmation system from day one**
(tech-lead §9 batch-12 lead #2 — BINDING):
> "Ted's `tedchange#POST 1-4` re-architects the lobby→enthusiasm path that was
> already on the roadmap as DH-23 / E16 cabinet confirmation. (a) LOBBY satisfaction
> now writes POINTS to `Faction.score?` (NOT enthusiasm — moves the cabinet-lobby
> coupling from `enthusiasm` to the per-faction score ledger). (b) IDEOLOGY
> COMPOSITION drives ENTHUSIASM — ≥50% cabinet of an ideology = +enth that ideology;
> ≤20% representation = −enth. (c) 3-shifts-per-half-term cap holds. (d) Big-4 /
> rest-of-cabinet / cabinet-level potentially weighted differently — the actual
> percentages are DESIGNER-GATED OPEN (Ted RULED IN CONCEPT but the numbers are
> TBD). LAND IT AFTER K2 (ActionRegistry) + AFTER K5 (CpuController) — cabinet picks
> are CPU actions, and the rework requires the conditional-vote-rules primitive +
> the lobby→score path that K2's registry mediates. **It lands in E16** as a sibling
> beat. **Re-scope E16 from 'add confirmation system in the right shape' to 'BUILD
> the confirmation + enthusiasm rework together in the right shape from day one'** —
> building the today-shape confirmation only to tear it apart for #124 is waste.
> **Size: M (was XS-S).** The numeric percentages stay designer-gated until Ted
> closes them — ship a const table that can be re-tuned post-design."

So **E16 is RE-SCOPED M (was L with a XS-S confirmation step inside)** — confirmation
+ #124 rework BUILD TOGETHER from day one; lands AFTER K2 + K5; **the numeric
percentages stay designer-gated in the new "designer-gated" sub-bucket items (8) +
(9) of the parking lot**.

**★★ Batch-12 lead C — the OTHER 18 Ted-rulings: 12 XS + 5 S + 3 M; sized + slotted
into existing epics** (tech-lead §9 batch-12 lead #3 — BINDING):
> "**12 XS:** #135 50/50 House inverse-control (one-line at `phaseRunners.ts:1864`)
> → Phase-1 #19 / standalone QW; #136 random skill on draft has NO Command → E1 /
> Phase-1 #1; #137 no cross-party draft (`partyId` gate) → E1; #138 3 traits + 3
> alt-states (era-config) → E1; #139 Pres signature step in 2.6 (phase reorder) →
> Phase-1 #2 / #14; #141 FL trait gain 5%+/3%- (refine existing const) → Phase-1
> #19; #142 CPU CJ ladder → E25; #131 Integrity-can't-nominate-Controversial (filter
> helper) → E16 + E25 + diplomacy; #132 Challenge-Legislation-can't-target-REPEAL
> (filter) → E11 + E25. **5 S:** #126 Pres 2-step Admin-then-Command blunder rule
> (CANONICAL — supersedes cf82a7d3 §5a #3) → E29; #127 ideology-shift / conversion
> rate schedule → E5b ideology-circle helper PR; #128 Kingmaker / Master Kingmaker
> scope (binds at `calcStateVote:3711`) → E20 election math; #129 Kingmaker→Protégé
> trait allowlist/blocklist → E5b + Phase-1 #21; #130 death/retirement schedule (Hale
> + Frail-first + ex-Pres death-only) → Phase-1 #19 (pairs with #85); #133 1st/2nd
> CC composition rewrite → E1 (`continentalCongress.ts` / `firstContinentalCongress.ts`);
> #140 AnytimeEvo target-pool tightening → Phase-1 #19 / E9 handler 9g. **3 M:**
> #124 cabinet→enthusiasm rework → E16 (per lead B); #134 Lingering 7-step strict
> ordering + tax/tariff carry-forward → Phase-1 #6 / E6 (same surface — Lingering
> is where meters get written); #120 `smallbugs` dataset umbrella → ONE coordinated
> `scripts/seedDataset.mjs` `CURATED_ROWS` pass (~100 items; also covers DH-43 /
> DH-51 / DH-28)."

So the **18 rulings slot into existing epics — no new epics, no re-sequence.** Each
row is tagged with its `tedchange#POST N` for traceability.

**★★ Batch-12 lead D — BUILD-TARGET SIMPLIFICATION on E5 + E25: amendments NOT
SCOTUS-challengeable; #100 overridden** (tech-lead §9 batch-12 lead #4 — BINDING):
> "Ted/vcczar's `smallbugs#POST 250-269` ruling: Govs CANNOT challenge amendments
> via SCOTUS — the Constitution is by-definition constitutional. This OVERRIDES
> `tea1772`'s #100 ruling ('SCOTUS can overturn an amendment via Gov-requested
> review'). The build target follows Ted/vcczar: **drop the SCOTUS-overturns-
> amendment branch from E25's docket scope and from E5's amendment lifecycle.**
> E5 retains the strike-a-statute path + the mutable-threshold field; E25 retains
> the docket + Justice drift + court size + DH-32 state-guard. This is a sequencing
> simplification, not a new item."

So **E5 + E25 are simplified** by the drop. **#100's review-of-amendment half is
superseded; the threshold half (3/4 → 2/3) is retained** (already implied by #64).

**★★ Batch-12 lead E — DECISION-GATED SPLIT: user-gated (3 carried) vs designer-
gated (9 NEW)** (tech-lead §9 batch-12 lead #5 — BINDING):
> "Batch 12 makes the authority hierarchy explicit — **Ted/vcczar > GA > inference**
> (§30.4 of game-mechanics.md). The Decision-gated category in the roadmap parking
> lot now splits into TWO sub-buckets: **User-gated** (existing — items waiting on
> the human's design call): the Senate cloture %, #18 state-scope, the player-SCOTUS
> fork (#52), the delegate-class fork, DH-1 filibustered-MUST-pass, DH-14 era-aware
> bill ideology, DH-15 small-state multiplier, §25.9 Iron-Fist split, divergence
> #10/#84 contingent-election, DH-25 career-track bootstrap, DH-33/DH-54
> impeachment, DH-41 SCOTUS cascade, DH-49 population model, DH-34 era-bias policy-
> reactive. **Designer-gated** (NEW — items waiting on Ted/vcczar to close): the 9
> open `tedchange` items per §30.2 — (1) Mil-Prep meter level 4 fix, (2) Universal
> Election Modifier (UEM #125), (3) Crisis trait consolidation, (4) term-limit Gov
> actions in pre-Senate era, (5) faithless-elector rewording, (6) party rename
> trigger PL-vs-EraEvo, (7) VP-must-be-same-party-on-resignation relaxation, (8)
> cabinet enthusiasm percentages, (9) cabinet ideology weighting Big-4-vs-rest-vs-
> cabinet-level. The roadmap-planner should NOT schedule designer-gated items as
> ready-to-build until Ted/vcczar closes them in `tedchange`/`smallbugs`."

So **Decision-gated category counts: User-gated 3 + Designer-gated 9.** **The
user-gated set is the batch-11 carry** (#52 + #18 + delegate-class); **the
designer-gated set is NEW this batch** (the 9 open `tedchange` items, NOT ready-
to-build).

**★ Batch-12 lead F — STRENGTHENINGS (no new rows, multi-thread corroboration)**
(tech-lead §9 batch-12 lead #6 — BINDING):
> "**#76 (CPU conversion adjacency)** EXTENDED via `tedchange` (same-party can
> target same OR adjacent ideology — folds into E5b's #127 schedule). **#99 (ideology
> = circle)** now **TED-AUTHORITATIVE** (3-thread corroboration → designer-ruled;
> 25% LW↔RW Pop rate pinned; auto-Two-Faced grant on cross-circle flip — folds
> into E5b). **#67 (Lingering bank ordering)** is RULED by Ted as the canonical
> 7-step + tax/tariff carry-forward → #134 (folds into E6). **#100 (Gov-requested
> SCOTUS review of amendments)** is OVERRIDDEN by Ted/vcczar (per lead D); mark
> superseded in the build-target."

So **no new rows for the strengthenings** — they fold inline into the existing
E5b / E6 / E5 + E25 rows, marked as designer-RULED / superseded.



**★ Batch-11 lead A — #116 economic engine = a NEW small epic `E4c`, placed AFTER
E2 + E6 + E4b(b); build it EMERGENT, not scripted** (tech-lead §9 batch-11 lead #1 —
BINDING):
> "#116 is the long-run content STATE MACHINE sitting on top of E4b(b)'s §27.6
> Second-Bank institution. It needs E2 (`Bill.type` / crisis bypass), E6 (named EconStab
> meter + crisis/cascade), and E4b(b) (the Bank it recharters/replaces). Build it
> EMERGENT — recurring CRISIS bills that resolve an EconStab CRISIS → Independent
> Treasury via a `Bill.replaces` field + a per-bill-class `lockedUntilYear` tariff
> cooldown — NOT scripted. Carry 'scripted-vs-emergent' as a design note, not a blocker.
> Verified UNBUILT: `applyEffect` (`phaseRunners.ts:3209`) only nudges 7 meters;
> `Legislation` (`types.ts:1506`) has no `type`/`replaces`/`lockedUntilYear`."

So **E4c sequences after E2 + E6 + E4b(b)** and is a SMALL epic (three additive fields
on a substrate that already exists). It is **content** sitting on the §27.6 Bank
institution — it does not move any keystone or re-order the spine.

**★ Batch-11 lead B — #119 RE-SCOPES E5, #61 RE-SCOPES E10b (do NOT open new epics)**
(tech-lead §9 batch-11 lead #2/#3 — BINDING):
> "#119 amendment lifecycle → ADD to E5: the explicit lifecycle (propose→committee→
> floor→governor-ratify→active), the active-amendment-blocks-a-legislation-class hook
> (the proactive face of E5's existing *Pollock* gate), and the un-bundleable flag (no
> `amendments` field in `GameState` today). #61 succession chain → ADD to E10b:
> VP-succeeds-on-death → fill-VP (gated on E5's VP-vacancy amendment being `active`) →
> acting-president action-divert roll + trait side-effect. The KILL TRIGGER already
> SHIPS (`anytimeEvents.ts:232` fires `{kind:'death'}`; death sets `presidentId=null`
> via `vacateOffice` `phaseRunners.ts:2449`) — so the succession ENGINE is the work; the
> line-of-succession/impeachment half stays parking-lot (DH-54)."

So **E5 + E10b are STRENGTHENED in place** — both sit in their existing Phase order
(E5 mid-Phase-1, E10b after E10). #61's VP-succeeds/acting-divert path is ready-to-build;
its line-of-succession half is the already-listed DH-54 author-before-build item.

**★ Batch-11 lead C — #51 PROMOTED (now SETTLED); only #18 + the NEW delegate-class
fork stay Decision-gated** (tech-lead §9 batch-11 lead #4/#5 — BINDING):
> "The 4-step enthusiasm-reshuffle + −100/waiver rule → E23, now `ready` (the `arkzag`
> final chunk published the 4-step rule verbatim, matching `drums`). The ±3 cap is
> UNCONDITIONALLY ready (binds at `calcStateVote` `:3709-3711`, ships with E6). Only the
> #18 state-scope sub-question stays a human decision-gate — move #51's fork OUT of
> Decision-gated, leave only #18. A NEW delegate-class fork (AI-allocator-by-EV-formula
> vs player-rigged) joins Decision-gated — a pick before E10's delegate-apportionment
> sub-PR (and E24's primary apportionment), but it does NOT block the rest of E10."

So **E23 is now `ready`** (the reshuffle is no longer fork-blocked), **QW3's ±3 cap is
un-gated** (ships with E6), and **Decision-gated holds at 2** (#52 SCOTUS + the merged
#18-state-scope/delegate-class election-engine picks).

**★ Batch-11 lead D — the bug-folds + the meta-signal** (tech-lead §9 batch-11 lead
#6/#8 — BINDING):
> "DH-59 (XS) folds into E12 when the 9-point relations scale is built — no standalone
> patch (today it clamps −5..5 at `applyEffect:3223`). DH-60 (S) = the concrete face of
> #92 territory-gating; add a `requires?: Predicate` on the era-event row + a firing-path
> filter — same surface as BUG-1 + K3's `territoryOwned`, so build with E15 + BUG-1
> (`buildEraEventsForYear` `eraEvents1856.ts:4` gates only by year; `EraEvent`
> `types.ts:1466` has no precondition field). META-SIGNAL FLIPS POSITIVE: no GA-burnout
> this time (heavy scripting absorbed the upkeep) — now a 3-thread signal (2 burnout
> deaths + 1 survived-by-scripting) that STRENGTHENS the automation-reduces-upkeep
> argument behind E9/#55/#115. Cite it; don't queue a row."

So **DH-59 → E12, DH-60 → E15+BUG-1** (no standalone rows), and the **3-thread
automation signal** is folded into the upkeep-reduction rationale (DH-36, below) rather
than queued. **#115 priority is UNCHANGED** (re-confirmed by the continuation-boot, §9.1.9)
and **no keystone moves.**

**★ Batch-10 lead A — the `scenarioBoot(BootSheet)` PIPELINE (#115) is PROMOTED to
the FRONT of the subsystem queue, but it FOLDS INTO K4's `BootSheet` schema — it is
NOT a new keystone** (tech-lead §9.1.9, §9 batch-10 lead #1 — BINDING):
> "#115 is the single most-requested missing item in the forum's own words — there
> are no documented rules for CREATING a game. Verified shipped-state: NO shared boot
> abstraction — `startNewGame` (`GameContext.tsx:264`) switches on a literal into
> hand-authored `build1772Scenario`/`build1856Scenario`; `scenario1856.ts:44-214`
> seats Congress with raw `Math.random`, naive Senate-class assign, full `EV-2` House
> reps, a 47-field `GameState` literal; no career-track seeding, no Command-stripping.
> Build the shared `scenarioBoot(BootSheet)` pipeline WITH the first new scenario
> (Phase-1 #1), before the third copy-paste of a hand-authored scenario. Dependency
> order: K0 (seed boot rolls) → `scenarioBoot` + `BootSheet` (with K4) → every
> scenario becomes a data row. This is the venue for the XS boot validators (DH-24,
> DH-27) and the appointment-ladder."

So **#115 sequences K0 → `scenarioBoot`/`BootSheet` (built with K4) → scenarios-as-
data**, and is **built with `scenario1788` (E1) before the third hand-authored copy.**
It is NOT a keystone (it folds into K4); QW8/QW9 + the #115b appointment-ladder live
inside it. No new keystone, no re-order — but the boot pipeline moves to the front of
the subsystem work because the next scenario (E1) needs it and would otherwise be a
third hand-authored copy.

**★ Batch-10 lead B — TWO forks are DECISION-GATED (a HUMAN design pick), NOT
ready-to-build** (tech-lead §9 batch-10 lead #2 — BINDING):
> "Each fork has 3 live models and needs a human design pick first. Player-controlled
> SCOTUS (#52): all-CPU-by-ideology vs player-controllable-with-restrictions vs
> trait-gated — but the SCOTUS docket data structure is needed either way (→ E25); it
> lives in `src/data/scotusCases<Era>.ts` + a `GameState.scotusDocket` ledger (shipped
> court is a coin-flip, `phaseRunners.ts:3397,3648`). Meter→enthusiasm→election
> (#18/#51): 'every state unless penalized' vs 'ideology-leaning states only' vs
> 'primaries only.' Settled part: meters move enthusiasm boxes + a hard ±3 cap. Shipped
> `calcStateVote` (`phaseRunners.ts:3685`, score `:3709-3711`) applies enthusiasm
> uniformly with NO ±3 cap, NO per-state penalty — the cap is a queued XS clamp (QW3)
> but its binding point + state-scope wait on this fork."

So both forks are recorded under **"Decision-gated"** in the parking lot — NOT in
"Up next." **The work that does NOT wait on the picks is buildable now:** the SCOTUS
**docket** (E25, the player-vs-CPU surface is what's gated) and the **meter-write ±3
clamp** (QW3, the enthusiasm-application binding is what's gated).

**★ Batch-10 lead C — the SIZED corroborated fixes slot into existing epics**
(tech-lead §9 batch-10 lead #3 — BINDING): **DH-53** bill-EV-sign = **S, author
STRUCTURED bill-effect tables** (NOT a sign-flip — `Legislation.effects` has no
per-state EV field; `applyEffect` `phaseRunners.ts:3209` can't mutate `electoralVotes`)
→ **E20** + K4's DH-48 `evDelta` shape; **DH-24** Senate-class validator = **XS into
the boot pipeline** (QW8); **focus-Rep (EV−2)/5 House (#55)** = **M into scaling-wall-
(b) (E7) + the census epic (E28)**; **statehood→sectional-crisis (#59)** = **S additive
at `admitState`** (`territories.ts:8` does no balance check; fires from 1820/Nationalism
starts too) → folds into **E3b** (b); **appointment-ladder + replacement-gains timing
(#115b)** = **XS each into boot/appointment rules** (the ladder pairs with **DH-25**).

**★ Batch-10 lead D — the era model is 4-START-CONFIRMED (confidence, not scope)**
(tech-lead §9 batch-10 lead #4): `dem1820`'s own draft table prints "Era of Democracy
(1820-1840)" → "Manifest Destiny (1840-1856)" (POST 946), so the #92 content-band model
now holds across **1772 + 1800 + 1820 + 1948**. K3/K4 stay the safest large bet; no
re-spec.

**★ Batch-10 lead E — DH-36 is the PRIORITIZATION ARGUMENT for the upkeep-reducing
items, NOT a row** (tech-lead §9 batch-10 lead #5): `dem1820` is the **2nd GA-burnout
DEATH** in the KB (after `new1772`), this one driven by **player friction from
undocumented/inconsistent rules COMPOUNDED by manual upkeep** (a 10-page/8-day midterm;
constant sheet repair). "Automation reduces the manual-upkeep burden that's killing
playtests" is now corroborated across **2 dead threads**, and the friction came from
**undocumented setup rules** — which is exactly the case for **#115 (the boot pipeline
canonicalizes the disclosed ruleset), #55 (focus-Rep cuts House upkeep), E7 (House-
slate persistence), and K5/E9 (the CPU suite owns the deterministic upkeep a human GM
can't sustain).** It justifies the ORDERING (boot pipeline + upkeep-reducers near the
front), not a new item. **★ Batch-23 UPDATE — the burnout-death/stall count keeps growing: `pop2012b` is ANOTHER GM-burnout DEATH (the GA Rodja RESIGNED — "freaking hard … to be the literal computer tracking every rule," POST 938), after `new1772` + `dem1820` (deaths) and `nixon1972`/`modernday` (burnout-stalls). The automation-reduces-upkeep argument (DH-36/DH-69/#114) is now corroborated across MULTIPLE abandoned threads — strengthens the SAME ORDERING call (no new row; the in-app rules / legal-move surface DH-69 + the CPU action-picker primitive serve the same pain).**

**★ Batch-9 lead A — the era model is 3-START-CONFIRMED and gains a TWO-LEVEL
refinement + a structured-era-event-data requirement; still NOT a new keystone, NO
re-sequence** (tech-lead §9.1.5 updated, §9 batch-9 lead #1 — BINDING):
> "Two saves at two start years (batch 8) + a third start year (1948, batch 9), one
> deterministic band sequence ⇒ the era keystones (K3/K4) are the safest large bet
> in the roadmap… Both must be built; do NOT collapse them: (a) point-banked
> Historical Eras with RULE-DELTAS (the Era-of-Terror cabinet rework proves bands
> carry rule changes, not just content) AND (b) a separate per-decade census doing
> bulk EV-reallocation + state-bias re-lean + content-rotation… era-event data needs
> STRUCTURED `evDelta`/census fields (DH-48 — the Neocon census events were LOST as
> free-text). 'Neocons' is a faction-rebrand, NOT a band."

So K3 gains the census-as-a-second-schedule + the per-band rule-delta hooks; K4 gains
the structured era-event data + per-era completeness validators. Both stay **M**;
both land inside the existing keystones. No new keystone, no re-order.

**★★ Batch-9 lead B — NEGATIVE SCOPE: there is NO Cold-War subsystem; do NOT queue
one** (tech-lead §9.1.8, the single most important scope-control finding this batch
— BINDING):
> "Despite the 'Nuclear Age' title there is NO purpose-built Cold-War system — no
> containment engine, no nuclear/MAD model, no NATO/Article-5 bloc, no space-race
> subsystem, no army/navy/air branches… Grep confirms only `revolutionaryWar.ts`
> exists… Net: zero new engine subsystems for 'the Cold War.' The work is the generic
> war engine + diplomacy (both already on the roadmap) + content."

So the Nuclear-Age era is **DATA on top of E3 (generic war) + E12 (diplomacy)** — and
those two rows gain the load-bearing build-holes the label hides: **E3 must RESOLVE**
(DH-47: wars never end today; ideally army/navy/air branches), and **E12 is the real
modern foreign subsystem** (8 relation meters + ambassador actions; DH-46 downward
pressure; DH-45 USSR-collapse trigger). This mirrors the batch-8 no-future-era guard:
a negative result that prevents the biggest scope-creep risk in the modern era.

**★ Batch-9 lead C — CPU-faction AI is LOAD-BEARING (K5 + E9 elevated, NOT
re-sequenced)** (tech-lead §9.1.3 priority bump — BINDING):
> "The digital APP is built for 1-human-vs-9-CPU (multiplayer 'goes off the rails';
> the points system is for the CPUs, not humans)… the app is a solo adaptation of a
> multiplayer game, so the entire multiplayer apparatus must be CPU-AI-driven… This
> does NOT re-sequence K5 (it still lands after K0 + K2), but it raises K5 + the
> handler suite (E9) from 'force-multiplier' to the load-bearing system that makes
> the product playable solo at all."

So K5's **placement is unchanged** (after K0+K2, parallel with K3/K4); its
**priority/status rises** — the E9 handler suite is now a first-class Phase-1 system,
not a nice-to-have. The `nuke` thread also confirms the whole MP-apparatus surface was
**entirely UNEXERCISED** by the human playtest, so it must be authored from spec.

**Batch-9 small placements (no re-order):** E16 → **create-AND-abolish** cabinet
seats (`abolishesCabinetSeat?`); E25 → **legislated variable SCOTUS size +
excess-not-replaced** (#112); E10b/E29 → the modern institutional layer (#105 +
DH-54 author-before-build); E20 → realignment + landslide-cap (#108/#110/DH-52); E30
→ `scenario1948` as a 4th `BootSheet` boot + DH-51 dataset parity. **Senate
pass-threshold resolved-in-code = simple majority** (`phaseRunners.ts:3562`); the
60%/cloture design question stays OPEN for the human. **Parking lot → 12** (DH-49
population-model+House-cap, the one new infra item; DH-54 impeachment/succession).


**★ Batch-8 lead — the ERA MODEL (K3/K4) is now the HIGHEST-confidence finding in
the KB; this batch changes confidence, not structure** (tech-lead §9 batch-8 lead
/ §9.1.5 batch-8 confidence bump — NO re-sequence, NO new keystone):
> "Two independent saves emit the identical era-band sequence at identical in-game
> dates: `tea1772` (1772-start solo all-CPU) and `rep1800` (1800-start
> multiplayer), 28 in-game years apart. The bands are deterministic game-state
> content-gates, not GM flavor. **The K3/K4 spec was already condition-driven from
> batch 7 — nothing changes structurally.** This raises the era keystones to the
> **highest-confidence large bet in the roadmap**; treat the content-band model as
> settled."

So: (1) **K3/K4 are MULTI-SAVE PROVEN** — the safest large era bet; start there if
engine staffing is scarce. (2) **#102's dual era-scoring** (per-era + cumulative)
is the **WIN-CONDITION scoreboard** — it folds into K3/K4 point-banking (the win
condition is DUAL), not a new item. (3) **E16's dynamic-seat refactor is
reinforced** — `cabinetSeatsForYear` is the WRONG model at BOTH ends
(founding offices-by-law + modern bill-creates-a-seat), so it is foundational to
the offices-as-data theme, not modern-only. (4) **DH-41 is the one new
author-before-build item** (the general SCOTUS-ruling → statute cascade, deferred;
parking lot → 10 total). (5) **★ NEGATIVE RESULT — no thread reaches a "future"
era; the roadmap does NOT scope one (K4 adds exactly `gilded` + `progressive`).**
(6) **DH-36 (GM-burnout abandoned a 12-turn game) is the META justification** for
the whole build — cited in the intro, not queued. All other batch-8 deltas
(#100/#103/#104/#105 + DH-38/39/40/42/43/44) **fold into existing epics** with no
re-order; **DH-43 lands as QW11** (Vermont dataset fix).


**★ Batch-7 lead A — the ERA-MODEL REFRAME re-specs K3 + K4, it is NOT a new
keystone** (tech-lead §9.1.5 / §9.6 lead #0 / divergence #18 — the single most
important call this batch, and the biggest architectural reframe of the era
keystones across all 7 batches):
> "An 'era' in AMPU is a **content-band** — a set of available bills + era-events
> + draftees + a state-bias table — that the game advances through on **game-state
> / meter / territory-ownership triggers, evaluated per half-term**, NOT by
> matching a real calendar date… Verified: phases gate by `year % 4`/`year % 2`
> (`phases.ts:49-59`, **correct for cadence and stay**); the ONLY era advance is
> the hard-coded `currentEra = 'federalism'` at `constitutionalConvention.ts:198`;
> **there is no year→era derivation anywhere** — so this is a generalization of
> one existing trigger, not a rewrite. `advanceEra(snap)` watches an
> `era.advanceWhen` condition; content gates on `game.eraBand` + a new
> `territoryOwned` predicate, **not the calendar**. RECONCILES #68 per-era
> point-banking + §26 BootSheet boot model + §27.1 content-band finding into ONE
> era system."

So K3 changes from `advanceEra(snap, target)` to `advanceEra(snap)`; K4 gains the
per-era content-band registry `{bills, eraEvents, draftees, biasTable,
advanceWhen}`; the early sub-bands (Republicanism/Democracy/Manifest-Destiny) are
content-band **markers**, not new enum values (tech-lead's call: markers first).
Both stay **M**. The new `territoryOwned` predicate is **one predicate, three
consumers** (bills, era-events, draft pool).

**★★ Batch-7 lead B — the RECONSTRUCTION SOLO-BLOCKER (DH-29) is a hard BUILD
REQUIREMENT on E3b** (tech-lead §9.1.6 / §9.6 lead #1 — the second-most-important
call, a hard gate on the 1856-arc shipping as a winnable solo game):
> "GM-verified (`rep1800` POST 9170): the historical Strict/Ironclad readmission
> plan can **NEVER pass with CPU factions** → **solo Reconstruction is
> UNRESOLVABLE**, which dead-ends the 1856-arc as a winnable solo scenario (and
> AMPU is single-player). **E3b's definition-of-done must include a CPU-passable
> readmission path** — my rec: (1) a CPU default-vote bias for the flagged
> historical plan (K5 handler #2) **+** (3) an era-boundary auto-resolution
> backstop (K3). The readmission half of E3b should land AFTER K5 handler #2 or
> carry the era-boundary auto-resolution as its self-contained fallback. **Ties
> E3b to the CPU handler suite (K5 / E9).**"

So E3b's readmission half (sub-PR d) is **gated on E9 handler #2 OR K3's
condition-driven `advanceEra`** — the one place the 1856-arc genuinely *needs* the
CPU handler suite, not merely benefits from it. The war half (a–c) is unblocked.

**★★ Batch-16 UPDATE to batch-7 lead B — DH-29 is REFRAMED (CPU-only → STRUCTURAL)
and gets its DESIGNED FIX (#156); the SOLO soft-dependency on E9 handler #2 is
REMOVED** (tech-lead §9 batch-16 lead + §9.1.12 — BINDING):
> "`hd1` played the Civil-War→Reconstruction arc with HUMANS on both sides of the
> tug-of-war (Southern-Dem 10% plan vs Radical-Rep Ironclad/Mass-Trials) and the
> choice STILL deadlocked — neither plan passed and states drifted back with NO
> plan at all (`hd1#POST 2678`). So the blocker is **STRUCTURAL, not a CPU-only
> artifact** (competing humans filibustered each other to the same null result).
> vcczar's authoritative rewrite (#156) **fixes it**: ALL readmissions require 'a
> plan adopted by Congress OR by the President', so the **President can adopt a plan
> UNILATERALLY** via the exec path — guaranteeing Reconstruction resolves in BOTH
> solo and deadlocked-human play with NO CPU vote required. **The readmission half
> (d) therefore NO LONGER HARD-depends on E9 handler #2 for the SOLO case** — it
> ships on the #156 unilateral-adopt path (K2 exec action). The CPU default-vote
> bias (option 1) + the era-boundary auto-resolution (option 3) remain useful
> belt-and-suspenders for the Congress-driven case, but are no longer solo gates.
> DH-29 is now a **debt item with a designed fix in hand**, not an open blocker."

So #156's unilateral-adopt makes E3b's readmission half **less risky and solo-shippable
without the CPU handler suite** — its hardest open question (how Reconstruction ever
resolves solo) is now answered. E3b stays downstream of the keystones; the war half
(a–c) is still unblocked (and now carries #155's balance pass + #157's CSA seeding).

**★ Batch-7 lead C — IDEOLOGY-AS-CIRCLE is FOUNDATIONAL — a central-helper
refactor behind an era-gated flag; place it EARLY-ish (Phase-1 #5b / E5b)**
(tech-lead §9.1.7 / §9.6 lead #2 / divergence #19):
> "`IDEOLOGY_ORDER` (`types.ts:14`) is **LINEAR** and ideology distance is
> **open-coded at 10+ engine call sites** (`factionCenter` `phaseRunners.ts:715`,
> `stepToward` `:740`, conversion adjacency `:993-1003`, sponsor `:3548`, a
> private `firstContinentalCongress.ts:120` helper, + 3 UI pages) — **there is NO
> central distance helper today**. Add `ideologyDistance(a, b, circular)`, migrate
> the 10+ sites (behavior-preserving while `circular = false`), gate the wrap on
> `GameState.ideologyIsCircular?`. Steps 1-2 are **cheap and additive while the
> flag is off**, and they pay down a latent consistency risk — every later
> ideology consumer (the SCOTUS within-1-step auto-AYE §26.6, the conversion
> handler #6, the faction-center math) gets the single helper for free. **Not a
> keystone** (nothing blocks on it), but the cheapest while early and the most
> error-prone if deferred."

So E5b lands the helper + migration **before** E9's conversion (9f) + SCOTUS (9n)
handlers, so they call it from day one rather than open-coding distance an
11th/12th time.

---

Carried batch-5 leads (still binding):

1. **K5 (`CpuController` scaffold) is a NEW late-keystone — after K0 + K2,
   parallel with K3/K4 + federalism** (tech-lead §9.6 call #1, §9.1.3 — the
   single most important batch-5 call):
   > "The shipped engine has **no agent-decision pass at all** (3 thin stubs
   > only). The §25 spec'd 15 subsystems have nowhere to live without it. K5
   > itself is ~120 lines (orchestrator + handler interface + tie-breaks + 2
   > `repair()` backfills + 1 determinism test). It **unlocks ~15 follow-on
   > handler PRs** that parallelize across contributors. K5 is a
   > force-multiplier, not a scenario gate — federalism + the 1856-arc epic
   > can ship with stubbed handlers and upgrade together."

   So K5 sits as the 6th Phase-0 keystone, parallel with K3/K4. The 15-handler
   suite is a single Phase-1 epic (E9) ordered by §6.6.1's handler-order table.

2. **Cabinet-confirmation system (DH-23) is XS-S, NOT M — because the broken
   system isn't built yet** (tech-lead §9.6 call #2, §9.3 #14):
   > "`runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step
   > scored pick with no Senate vote. So the fix is 'build the confirmation
   > step in the right shape from day one' (default-AYE baseline + Iron-Fist
   > Maj-Leader auto-AYE-own-picks + lobby-maximizer Admin-weighting), which
   > is CPU handler #4 (§6.6.1). Lands as a sibling of the cabinet-retention
   > refactor (Phase-1 #16)."

   So DH-23 is **not a quick-win**; it lands at E16 as the XS-S confirmation
   step + at E9 handler 9d for the CPU side.

3. **What's READY now vs. what still needs design** (tech-lead §9.6 call #3):
   > "**READY (no design task remaining):** the 13 §25 subsections #25.1–#25.8
   > + #25.10–#25.14 — all 15 CPU handlers can be authored against §25
   > verbatim. Plus #79 25/10/5 Justice drift, #80 ±3 swing cap, #82 veto
   > override 2/3, #83 midterm meter+enthusiasm, #85 5%/half-term
   > retire-death. **NEEDS DESIGN (parking lot):** divergence #10 / #84
   > contingent-election rules (5 rulesets invented mid-thread, no canonical
   > answer); §25.9 Iron-Fist split (the 6 child traits' exact names + cascade
   > rules); DH-1 filibustered-MUST-pass; DH-12 white-peace; DH-13
   > faithless-elector trigger; DH-14 era-aware bill impacts; DH-15
   > small-state multiplier."

   READY-now count went from ~30 to ~45+ this batch; needs-design grew from
   1 (DH-1) to 7 (DH-1 + #10/#84 + §25.9 + DH-12/13/14/15).

4. **BUG-0 is the cheapest win in the whole roadmap — do it first** (carried
   from batch 4):
   > "Verified: `RELOCATION_ATTEMPTS_PER_TURN = 5` at `types.ts:247`; one-line
   > const edit, no migration, no dependency."

   Sits at the very top of the quick-wins (QW0).

5. **Per-era point BANKING (#68) reshapes the era keystones + the win
   condition — not a new item** (carried from batch 4):
   > "The era boundary is a bank-and-zero + award + full 2.1.x→2.3.1 re-run +
   > content-swap pipeline; the per-era banks sum toward the (open) cross-era
   > win total. Build `advanceEra` with the bank step from the start."

6. **The Civil-War / Reconstruction epic lands EARLY-ish (E3b) because it
   COMPLETES a shipped scenario** (carried from batch 4):
   > "`scenario1856.ts` ships today but its era-event spine dead-ends at the
   > Trent Affair (1861); adding #56/#57/#58/#59 completes a half-finished
   > playable scenario."

   E3b sits right after generic war (E3) + K2, **not** behind federalism (E1)
   or the modern tail. **Batch 5 adds: it is the first scenario to get a full
   K5 handler suite — wire handlers as they land.**

7. **Generic war (E3) is DESIGNED multi-theater + tiered from day one — with
   the multi-confirmed formula** (tech-lead §9.6, sharpened batch 5):
   > "`drums` re-derives the formula `Win% = Difficulty + Planning + Officer×10
   > + MilPrep + Benchmarks` end-to-end across Eastern + Western + Utah + WWI
   > + Mexico + Sioux — the single most multiply-confirmed cross-era resolver
   > in the knowledge base. `WS ≥ +11` auto-win; war-end `WS×2 = %`; post-war
   > defeat `|WS|×2×10`; naval-N-then-ground per-war; Treaty A-D + 3-roll
   > chain. The Civil War is the Major-tier instance — a configured instance,
   > not a rewrite."

8. **K2 (ActionRegistry) remains the second-most-important keystone after K0**
   (~6× leverage across 6 action libraries) **AND is a hard prerequisite for
   K5** — most CPU handlers pick from a registry library. Do K2 first if only
   one keystone lands this quarter.

9. **The two-track parallelization is still the biggest schedule lever**
   (tech-lead §9.4, §9.6). Sync points: a handful of additive `Politician`/
   `Party` fields + two deeper handoffs (A4 ↔ E3 war odds; P2 ↔ E8 portraits).
   Start the presentation track immediately with P0.

10. **(carried) #8 cabinet, #7 SCOTUS, the two scaling walls, far-end vs
    near-term.** #8 is a real cabinet wipe→retention refactor (M, E16) —
    batch 2 wrongly said no wipe exists (`:3804-3812`). #7 SCOTUS is
    from-scratch over a *stub* (`:3398-3414`), far-end (E25). The two
    scaling walls (persist House slates E7; procedural pol gen E8) are
    NEAR-term, not modern-only. Federalism before gilded before modern;
    `scenario1788` before a fully-general `advanceEra`.

11. **RNG first (K0).** Determinism is the prerequisite for multiplayer
    AND for **K5's deterministic tie-breaks** (every CPU decision must be
    reproducible from the seed), AND any replay/test harness, a soft gate
    for every roll-heavy subsystem (war E3/E3b, convention E10, governor
    d100s E11, filibuster E14, primary E24), **and a hard gate for the
    seeded procedural pol generator (E8)**.

12. **Within-track dependency notes.** **E18g (numeric `nationalSurplus`/
    `nationalDebt`) is a prerequisite for E2's cap *and* E6's debt field —
    build that sub-item early.** E4's global flip + the 12A toggle need E5
    (amendments). **E4b (early-republic cluster) splits its deps: (a)
    slavery-flag+Cohens needs E25's SCOTUS docket [the `Cohens` rule-modifier]
    + E5 [the abolition amendment]; (b) Second Bank needs K2 + E13 + the E16
    dynamic seat list; (c) statehood-by-bill needs E21 + K3's `territoryOwned`
    predicate.** **E5b (ideology-as-circle) is independent but lands steps 1-2
    BEFORE E9's conversion (9f) + SCOTUS (9n) handlers so they call the central
    helper from day one.** E21's statehood needs E2 + E3 + E8 + K3's
    `territoryOwned` predicate; **E3b's Canada arc (#60) needs E21's per-era
    admission gate.** **★★ BATCH-16: E3b's Reconstruction readmission half (DH-29)
    needs only E2 (bills) + K2 (the #156 plan-adopt exec action) for SOLO — #156's
    unilateral-adopt prerequisite REMOVES the hard dependency on E9 handler #2 (now
    an optional CPU-default-vote enhancement) and on K3's era-boundary auto-resolution
    (now optional backstop). DH-29 fix is designed-in-hand.** E10b's VP-vacancy fill needs
    E5. E14e (investigation) needs E2's bill type. E24 needs E10's CPU delegate
    engine + handler 9i. E26 needs E23. E28 needs E7. **All 15 E9 handlers
    need K5; 9k/9l also need K5's persistent state.** P1/P2/P3 consume P0.

### Estimate caution

Sizes are the tech-lead's. Rows that may still feel XL after a first pass:

- **E3 (generic war)** — sized M–L, but the **batch-9 + batch-15 + batch-16
  build-holes may push it toward the top of that range**: DH-47 adds a
  **resolution/peace path** (wars never end today) and **army/navy/air branches**;
  #152 adds the **war-defeat loss package + multi-phase carry**; and **batch-16
  #155 (M) adds the war-balance pass** (enemy-strength via `rng.ts` — also closing
  the `phaseRunners.ts:3603` `Math.random` determinism leak — + battle-size +
  Officer-Mil cap + per-theater), **bounded by keeping the 1772 RevWar winnable**.
  Ship the base resolver + the resolution path first (it is what makes the Cold-War
  wars, Korea, terminate); the branch model + #155 balance terms can be follow-on
  sub-PRs. Remember: this is the ONLY war engine — the Cold War relabels it.
- **E3b (Civil-War / Reconstruction)** — sized L but it is a full subsystem;
  **ship as 5+ sub-PRs** (secession #58 + #157 CSA seeding → sectional crisis #59
  → two-theater war #56 + CW variants #97 → Reconstruction #57 + #148 timer +
  **#156 4-plan model** → Canada #60), cheap-first.
  **★★ BATCH-16: the Reconstruction sub-PR (d) NO LONGER carries the DH-29
  solo-blocker as an E9-handler-#2 hard-gate** — #156's "plan adopted by Congress
  OR President" prerequisite lets the player-President adopt a plan UNILATERALLY via
  the K2 exec path, so the readmission half ships solo on the exec path with NO CPU
  vote required. DH-29's fix is now **designed in hand (#156)**, not an open blocker;
  the CPU default-vote bias (E9 handler #2) + K3 era-boundary auto-resolution remain
  optional belt-and-suspenders for the Congress-driven readmission case.
- **E1 (federalism / early-republic epic)** — sized L; expect the era-event
  spine and the SCOTUS set to each be their own sub-PR. The early-republic
  subsystems are folded OUT into E4 + E4b (sequenced after their keystones).
- **E4b (early-republic cluster)** — sized M but **3 independent sub-PRs**
  with different deps (slavery-flag+Cohens → SCOTUS docket + E5; Second Bank
  → K2 + E13 + E16 seat list; statehood-by-bill → E21 + K3's `territoryOwned`);
  ship them as they unblock, not as one epic.
- **E9 (CPU handler suite)** — **~15 PRs**, not one. Order by §6.6.1; ship
  one at a time. Handlers 9k/9l (the DH-* architectural gaps with persistent
  state) land **after** the simpler handlers have exercised the scaffold.
- **E10 (convention)** — the single biggest unbuilt subsystem; **split into
  ~3** (ballot loop → inter-ballot library on K2 → platform/VP/scandal).
  The CPU side is owned by handler 9e (E9), not by this epic.
- **E14 (legislative micro-mechanics)** — now **7 sub-PRs** sharing the bill
  pipeline (block-and-replace → packaging → filibuster → crisis tag →
  investigation #54 → veto override #82 → midterm #83).
- **E16 (cabinet + Congress + offices-by-law + confirmation + ★ batch-12 #124
  enthusiasm REWORK)** — **★★ batch-12 RE-SCOPED M (was L with a XS-S confirmation
  step inside)**. **Five coupled jobs** (9-role Congressional pipeline; cabinet-
  wipe→retention refactor; **confirmation + #124 enthusiasm rework BUILT TOGETHER
  from day one** — lobby = POINTS to `Faction.score?`, ideology composition =
  ENTHUSIASM via ±3-cap clamp; offices-created-by-law #66; dynamic seat list
  CREATE-AND-ABOLISH). **LANDS AFTER K2 + K5** (cabinet picks are CPU actions; uses
  the conditional-vote-rules primitive). **#124 numeric percentages stay designer-
  gated open** (Decision-gated "designer-gated" #8/#9); ship a const table that
  re-tunes post-design. **Split if any feels XL during scoping.**
- **E30 (modern era scenario)** — the XL capstone; decomposes into roster +
  era-event spine + bill catalog + card pool sub-PRs; gates on most of Phase
  1 + 2.
- **P2 (portrait pipeline)** — an asset-pipeline epic; the no-AI-in-product
  constraint shapes the tech choice from day one; must render generated pols
  (shared with E8).

---

## Provenance note

This reflects **batches 1–12** — **fourteen** ingested digests across **12 playtest
threads + 2 DISCUSSION threads** (the batch-12 additions are **`smallbugs`** and
**`tedchange`** — the FIRST DISCUSSION-THREAD INGESTS in the corpus, distinct from
playtests: **`smallbugs`** = `cf82a7d3` "A Thread for small low priority changes and
errors", 804 posts, the 3-yr+ rolling community-curated bug + ruling catalog with
vcczar's nested rulings; **`tedchange`** = `a0f0bf04` "Discussion: Ted's Change Log
of Doom", 408 posts, the DESIGNER Ted's official rules-doc rewrite/cleanup channel,
Sept 2024 → Oct 2025 — the **HIGHEST-authority rules source in the corpus**): the
`f4c7c2c4` 1868 Gilded-Age multiplayer dry-run, the
`f55d3e21` 1788 federalism solo-with-AI playtest, the `85f8e6b4` 1772 solo
aesthetic experiment, the `3a9ac985` modern (2004→2020) multiplayer campaign, the
`77db6e6f` **1856-native "A House Divided" Part 2** (9051 posts — the only source
for the Civil-War / Reconstruction / secession machinery), the `e1776bbd`
**all-CPU "Drums of War"** (7540 posts — the first explicit forum record of CPU
heuristics), the `c50d9da7` **"Era of Populism" 2012 fresh-modern boot** (1172
posts — the canonical `BootSheet` + meter-driven endgame), `rep1800` — the **"Era
`f4c7c2c4` 1868 Gilded-Age multiplayer dry-run, the
`f55d3e21` 1788 federalism solo-with-AI playtest, the `85f8e6b4` 1772 solo
aesthetic experiment, the `3a9ac985` modern (2004→2020) multiplayer campaign, the
`77db6e6f` **1856-native "A House Divided" Part 2** (9051 posts — the only source
for the Civil-War / Reconstruction / secession machinery), the `e1776bbd`
**all-CPU "Drums of War"** (7540 posts — the first explicit forum record of CPU
heuristics), the `c50d9da7` **"Era of Populism" 2012 fresh-modern boot** (1172
posts — the canonical `BootSheet` + meter-driven endgame), `rep1800` — the **"Era
of Republicanism" 1800→1868 early-republic campaign** (the first procedural record
of the 1800–1856 early republic and the predecessor of batch-1's `gilded`), the
**two batch-8 1772 threads** — **`new1772`** (the **first MULTIPLAYER 1772
founding campaign** — 10 humans 1772→1796, the entire federal apparatus stood up
piece-by-piece from a 1772 start; **abandoned at GM burnout**) + **`tea1772`** (a
157-post **solo all-CPU 1772→1874 fast-traversal** that stalls mid-Gilded) — and
now the **batch-9 `nuke`** thread: the **Nuclear-Age / Cold-War / modern-half
campaign** (1948→Era-of-Terror ~2005; at **12,228 posts the LARGEST corpus in the
KB**, the chronological **predecessor of `modern`**, joined at the 2004 election).
**The KB now spans a CONTINUOUS 1772→2020 timeline:** founding (1772, multiplayer
`new1772` + solo `tea1772`) → early republic (1800→1868, `rep1800`) → Gilded
(1868, `gilded`) → Nuclear Age / Cold War (1948→2005, `nuke`) → modern
(2004→2020, `modern` + Populism `pop`), with the antebellum (`hd`) and the all-CPU
war traversal (`drums`) corroborating across the span. **The era-band model is now
4-START-CONFIRMED — 1772 + 1800 + 1820 + 1948.** **Batch 12 is the FIRST DISCUSSION-
THREAD INGEST in the corpus** — `smallbugs` + `tedchange` are NOT playtests; they are
the **DESIGNER's official rules-doc patches** (Ted in `tedchange`, vcczar in
`smallbugs`), and most findings SUPERSEDE prior GA calls where they conflict
(authority hierarchy now explicit: **Ted/vcczar > GA > inference**, game-mechanics
§30.4). **This batch-12 pass is DESIGNER-RULINGS INTEGRATION + QW0 FULLY CLOSES +
ONE M-rework + 19 sized rulings slotted — NO re-sequence, NO new keystone:**

- **★★ QW0 / BUG-0 FULLY CLOSES** (cap=4 + alt-state EXEMPTION guard, vcczar-12-30-25
  `smallbugs#POST 734-735` RULED) — promote to "ready-to-ship FIRST" at the top of
  the queue;
- **★★ E16 RE-SCOPED M** to bundle the cabinet confirmation system + #124
  cabinet→enthusiasm REWORK from day one (lobby = POINTS to `Faction.score?`;
  ideology composition = ENTHUSIASM; numeric percentages stay designer-gated);
- **★ 18 OTHER TED-RULINGS sized + slotted into existing epics: 12 XS** (#135 / #136
  / #137 / #138 / #139 / #141 / #142 / #131 / #132), **5 S** (#126 / #127 / #128 /
  #129 / #130 / #133 / #140), **3 M** (#124 → E16, #134 → E6 Lingering 7-step + tax/
  tariff carry-forward, #120 dataset umbrella → ONE coordinated `scripts/seedDataset.mjs`
  pass);
- **★ E5 + E25 SIMPLIFIED** by the amendments-NOT-SCOTUS-challengeable build-target
  (vcczar `smallbugs#POST 250-269` OVERRIDES `tea1772` #100 — drop the SCOTUS-overturns-
  amendment branch from both rows; keep E5's strike-a-statute + mutable-threshold +
  #119 lifecycle, keep E25's docket + drift + DH-32 state-guard);
- **★ NEW Decision-gated sub-bucket "designer-gated"** (9 items, NOT ready-to-build
  until Ted/vcczar closes them in `tedchange`/`smallbugs`): Mil-Prep meter level 4
  fix, **#125 UEM**, Crisis trait consolidation, term-limit Gov actions in pre-Senate
  era, faithless-elector rewording, party rename PL-vs-EraEvo, VP-must-be-same-party-
  on-resignation, cabinet enthusiasm percentages (the #124 numeric), cabinet ideology
  weighting Big-4-vs-rest;
- **★ STRENGTHENINGS (no new rows):** **#76 (CPU conversion adjacency)** EXTENDED via
  `tedchange` (same-party can target same OR ADJACENT ideology); **#99 (ideology =
  circle)** now **TED-AUTHORITATIVE** (3-thread corroboration → designer-RULED, 25%
  rate pinned, Two-Faced auto-grant); **#67 (Lingering bank ordering)** RULED → #134
  (canonical 7-step + carry-forward); **#100 (Gov-requested SCOTUS review of
  amendments)** OVERRIDDEN by Ted/vcczar (mark superseded);
- **★ NEW gaps:** **#121** Secessionist trait missing from politicians dataset
  (XS — dataset addition + a one-row `Trait` union add; folds into #120 umbrella +
  E3b sub-PR (a)); **#122** pardon mechanics entirely unspecified → **NEW author-
  before-build item** (13th total; folds into E29 when authored); **#123** small late-
  modern content bundle (Wyoming Rule → Real House Act 585-cap, runoff-amendment,
  Senate-Abolish amendment) → folds into Phase-2 #28 / #30.

**This batch-10 pass (carried) is PROMOTION + decision-gating + small placements —
NO re-sequence, NO new keystone:**

- **★ PROMOTES the `scenarioBoot(BootSheet)` pipeline (#115) to the front of the
  subsystem queue, folded into K4's `BootSheet` schema** (NOT a new keystone): there
  are NO documented rules for CREATING a game; build the shared pipeline (K0 → boot
  rolls; `scenarioBoot` + `BootSheet` with K4; scenarios-as-data) WITH `scenario1788`
  (E1), before the third hand-authored copy. Venue for QW8/QW9 + the #115b appointment-
  ladder;
- **★ DECISION-GATES two forks** (new "Decision-gated" category, 2 items): #52
  player-controlled SCOTUS (3 models; docket needed either way → E25) + #18/#51
  meter→enthusiasm→election (3 models; settled ±3 cap → QW3, binding-point → E20/E23);
- **slots the sized fixes:** DH-53 structured bill-effect tables (S → E20 + K4),
  DH-24 Senate-class (XS → QW8/boot pipeline), focus-Rep (EV−2)/5 #55 (M → E7 + E28),
  statehood→sectional-crisis #59 (S → E3b additive at `admitState`), #115b appointment-
  ladder + replacement-gains (XS → boot/appointment rules, pairs with DH-25);
- **makes the #92 era-band model 4-START-CONFIRMED** (K3/K4 confidence bump);
- **records the 2nd GA-burnout DEATH (DH-36) as the prioritization ARGUMENT** for the
  upkeep-reducing items (#115, #55, E7, K5/E9) — NOT a row; author-before-build count
  stays **12**.

And the batch-9 pass that this one leaves UNCHANGED in order — **CONFIDENCE +
NEGATIVE-SCOPE + small placements, NO re-sequence, NO new keystone:**

- **★ K3/K4 (the era model) is now 3-START-CONFIRMED** (1772 + 1800 + **1948**)
  and gains a **TWO-LEVEL refinement** (point-banked Historical Eras carrying
  rule-deltas + a separate per-decade census doing EV-realloc + bias-re-lean +
  content-rotation; do NOT collapse them) **+ a STRUCTURED-era-event-data
  requirement** (DH-48, typed `evDelta`/census fields + per-era validation); the
  "Neocons" mislabel is logged as a faction-rebrand, NOT a band;
- **★★ records the NEGATIVE-SCOPE Cold-War guard** — there is NO Cold-War
  subsystem to build (only `revolutionaryWar.ts` exists); the Cold War = the
  generic war engine (E3) + the diplomacy subsystem (E12) + content (data), and
  those two rows gain the real build-holes (E3 must RESOLVE — DH-47; E12 needs
  downward pressure + the USSR-collapse fix — DH-45/46);
- **★ elevates K5 + the E9 handler suite to a first-class LOAD-BEARING Phase-1
  system** (the APP is 1-human-vs-9-CPU, #114; K5's placement is unchanged);
- **strengthens E16** (create-AND-abolish cabinet seats), **E25** (legislated
  variable SCOTUS size), and folds the modern election/institutional layer + the
  `scenario1948` 4th-boot + DH-45..DH-58 into existing epics;
- **records the Senate threshold as resolved-in-code (simple majority) / the
  60%-cloture question as an OPEN human decision**;
- **adds DH-49 (population model + House cap — the one new infra item) + DH-54
  (impeachment/succession ruleset) to the parking lot → 12.**

And the batch-8 confidence-hardening pass that this one leaves UNCHANGED in order:

- **★ bumps K3/K4 (the era model) to HIGHEST confidence — MULTI-SAVE PROVEN**
  (§9.1.5 batch-8 bump): `tea1772` (1772-start) + `rep1800` (1800-start, 28 in-game
  years apart) emit the identical era-band sequence at identical dates (#102), so
  the content-band model is settled. No structural change; **#102's dual
  era-scoring (per-era + cumulative) is the WIN-CONDITION scoreboard**, folded into
  K3/K4 point-banking (#68);
- **★ strengthens E16's dynamic-seat refactor justification** —
  `cabinetSeatsForYear` confirmed the WRONG model at BOTH ends (founding
  offices-by-law `new1772` §24.6 + modern bill-creates-a-seat `pop`), no new work;
- **★ adds DH-41 to the author-before-build parking lot (now 10 total)** — the
  general SCOTUS-ruling → downstream-statute cascade, UNBUILT and `vcczar`-deferred;
- **folds the new small mechanics into existing epics:** #100 (SCOTUS-overturns-
  amendment + amendable-threshold) → E5 + E25; #103 (pres-vote modifier stack +
  era-issue list) + DH-42 (meter-vs-lean balance) → E20; #104 (lone-ideology
  convention exploit) → E9 handler 9e; #105 (stat-collapse → forced resignation) →
  E10b; DH-38 (late-ratification/Rogue-Island window) → E1; DH-40 (justice-count
  not packaged → stall) → E14b + E25 (XS-S); DH-44 (post-12A vote count) → E4;
- **adds QW11** (DH-43 Vermont home-state dataset fix, XS);
- **parks** DH-37 (no pol-trading, #1 AMPU-2 wishlist) + DH-39 (all-human
  Convention deadlock) on the multiplayer track;
- **★ records the NEGATIVE RESULT** — no thread reaches a "future" era, so the
  roadmap does NOT scope one (K4 adds exactly `gilded` + `progressive`);
- **cites DH-36** (GM burnout abandoned a 12-turn game) as the META justification
  for the whole build (intro rationale, not a queued row).

The batch-7 re-sequence that this pass leaves UNCHANGED:

- **★ re-specs K3 + K4 for the era-model reframe — NOT a new keystone** (§9.1.5 /
  divergence #18): `advanceEra(snap)` becomes condition-driven (game-state /
  meter / TERRITORY, per half-term — no `target` arg; the CC `:198` line becomes
  the first `advanceWhen` condition); content gates on `game.eraBand` + a new
  `territoryOwned` predicate (one predicate, three consumers), not the calendar;
  the early sub-bands (Republicanism/Democracy/Manifest-Destiny) are content-band
  markers; the per-era content-band registry `{bills, eraEvents, draftees,
  biasTable, advanceWhen}` lands at K4. **Reconciles #68 + §26 + §27.1 into one
  era system.** `year % 4`/`year % 2` stay as phase cadence;
- **★★ adds the Reconstruction solo-blocker (DH-29) as a hard DoD requirement on
  E3b** (§9.1.6): the Strict/Ironclad readmission plan can NEVER pass with CPU →
  solo Reconstruction unwinnable; E3b's readmission half must ship a CPU
  default-vote bias (E9 handler #2) AND/OR an era-boundary auto-resolution (K3);
  ties E3b to the CPU handler suite;
- **★ adds ideology-as-circle as Phase-1 #5b (E5b)** (§9.1.7 / divergence #19):
  a central `ideologyDistance(a,b,circular)` helper + migration of the 10+
  open-coded sites, behind a `GameState.ideologyIsCircular?` flag — placed early
  so E9's conversion (9f) + SCOTUS (9n) handlers call it from day one;
- **folds the early-republic subsystems into E1 + Phase-1 #4/#4b** (E4 12A
  legislature-elector toggle #93; new E4b = slavery-flag+Cohens #94 [SMALLER —
  `State.isSlaveState` already exists] + Second Bank+Bank War #95 +
  statehood-by-bill organize→admit + territory-gate #95);
- **merges era-events-predating-start into BUG-1 (QW1)** — LIVE-confirmed by the
  LA-Purchase-dropped-at-1800-start episode — and **adds DH-30
  event-scheduler-min-floor as QW10**, BUG-1's companion;
- **places DH-31** (procedure-bill veto-misroute) at E2, **DH-32** (SCOTUS-voids-
  a-state guard + the `Cohens` ruling-bill-class modifier) at E25, **DH-35**
  (era-gate the action libraries) at E11/E13/E24;
- **adds DH-33** (impeachment-rewrite) to author-before-build (E29) and **resolves
  DH-34** as a roadmap DECISION (ship static era-biases — the forum's own stance);
- **notes `scenario1800` (E32)** as an optional later `BootSheet` instance (the
  band is already covered by `scenario1788` + `scenario1856`).

And the batch-8 confidence-hardening pass leaves all of the above **unchanged in
order** — it bumps K3/K4 to HIGHEST confidence (multi-save proven), strengthens
E16's justification, adds DH-41 to the parking lot, folds #100/#103/#104/#105 +
DH-38/39/40/42/43/44 into existing epics, adds QW11 (Vermont), and records the
no-future-era guard + the DH-36 META rationale.

And the **batch-9 pass (this one)** leaves ALL of the above **unchanged in order** —
it makes K3/K4 3-START-CONFIRMED + adds the two-level era refinement + the
structured-era-event-data requirement (all inside K3/K4), records the NEGATIVE-SCOPE
Cold-War guard (the Cold War = E3 + E12 + content), elevates K5 + E9 to load-bearing
(placement unchanged), strengthens E16 (create-AND-abolish) + E25 (legislated court
size), folds the modern election/institutional layer + `scenario1948` + DH-45..DH-58
into existing epics, records the Senate-threshold resolution, and adds DH-49 + DH-54
to the parking lot (→ 12).

And the batch-12 pass (this one) is **DESIGNER-RULINGS INTEGRATION + QW0 FULLY
CLOSES + ONE M-rework + 19 sized Ted-rulings slotted + ~100-item dataset umbrella +
build-target simplification on E5/E25 + Decision-gated split into user-gated +
designer-gated buckets**: it leaves all of the above order **unchanged** and
strengthens the order (QW0 is now the top-of-queue; E16 is RE-SCOPED M with #124
bundled; E5 + E25 simplified by Ted/vcczar's amendments-NOT-SCOTUS ruling; 9 new
designer-gated parking items added) **without** moving any keystone, splitting any
epic, or re-sequencing the spine.

**Still provisional.** Subsequent `/ingest-playtest` runs will refine scopes
(especially the CPU handler internals, the contingent-election rules, the
§25.9 split, the convention CPU specifics, the Civil-War sub-splits, the
~16-meter Lingering order, **the war resolution/peace + branch model (DH-47), the
diplomacy downward-pressure tuning (DH-45/46),** and the cross-era win-total number
the per-era banks sum to), may re-split currently L-sized rows, and may surface
items now parked or unknown. **The order above is buildable top-to-bottom today;
re-validate on every digest.** Open design calls that gate ordering
(contingent-election rules, §25.9 Iron-Fist split, DH-12 white-peace, DH-13
faithless-elector cap, DH-14 era-aware bill ideology, DH-15 small-state
multiplier, era-event scheduling hybrid, era-enum split, meter relabel,
procedural-generation distribution, DH-1 filibuster remedy, **DH-33 impeachment
rewrite**, **DH-41 the general SCOTUS-ruling → downstream-statute cascade policy
[batch 8 — author before building it into E25]**, draft 3/3-canonical, Civil-War
end-year, cross-era win total, the batch-7 era-model open Qs (are the early
sub-bands content-band markers or enum values [tech-lead's call: markers first];
the exact scope of the `territoryOwned` content-gate; which Reconstruction
readmission fix E3b ships [CPU bias #1 vs era-boundary auto-resolution #3 vs both
— tech-lead's rec: 1+3]), **and the batch-9 open Qs — the POPULATION-MODEL + House-
cap rule [DH-49, author before the census + Wyoming-Rule]; the impeachment / VP-
vacancy / succession ruleset [DH-54]; the war resolution + branch model [DH-47]; and
the human's Senate-threshold call [simple-majority-in-code vs require 60%/cloture];
**and the designer-gated open items — 9 OPEN bullets after the ★★ batch-15 −2 recount
(the #124-percentages gate, B8+B9, RESOLVED OUT via the live 3-state tuning; #18
state-scope RESOLVED OUT to E20b): Mil-Prep meter level 4 fix, UEM #125, Crisis trait
consolidation, term-limit Gov in pre-Senate era, faithless-elector rewording, party
rename PL-vs-EraEvo, VP-must-be-same-party-on-resignation, OC-4 off-ideology draft gate,
OC-8 define-an-office — all NOT ready-to-build until Ted/vcczar closes them in
`tedchange`/`smallbugs`; PLUS #122 pardon mechanics (NEW author-before-build). NOTE
DH-47's must-resolve half is now COMPLETED by #152 (war-defeat loss package + multi-phase
→ E3); only the army/navy/air BRANCH model remains open.**)
are tracked in `game-context.md` → Open questions.

---

**Roadmap path:** `/home/user/AMPU/docs/game/roadmap.md`.
