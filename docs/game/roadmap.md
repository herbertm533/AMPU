# AMPU — Roadmap

> **First-ingestion version (dry-run on the bootstrap example).** This roadmap
> was first stood up from the codebase + tech-lead's bootstrap sequencing
> advice (6 provisional items). It has now been **rebuilt** against the first
> formally-ingested forum thread (`f4c7c2c4`, 343 posts, 1868–1872 Gilded-Age
> dry-run): the gap log grew from ~9 rows to ~41, the tech-lead's plan grew
> from 6 to 16 items, and three design divergences were identified and
> resolved (`game-mechanics.md` §19.1, tech-lead §9.3). **Order is the
> product** — build top-to-bottom. Subsequent `/ingest-playtest` runs will
> refine scopes and may reveal more items (especially around Constitutional
> Amendments, foreign-relations rosters, and faction-personality drift —
> several open questions still hang on those).

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic is
**complete** (gap analysis: `docs/research/abilities-expertise-traits-gap-analysis.md`).
The knowledge-base infra bootstrap (`game-context.md`, `game-mechanics.md`,
`technical-guide.md`, this roadmap) is also live and absorbs the first
ingested digest.

- **Knowledge-base infra bootstrap + `f4c7c2c4` ingest.** The four planner
  docs (`docs/game/{game-context, game-mechanics, technical-guide, roadmap}.md`)
  stood up; the 1868–1872 Gilded-Age dry-run absorbed into `game-context.md`
  gap log (~41 rows) and `game-mechanics.md` (~12 new mechanic sections incl.
  §15.3 conventions, §11.3 governor actions, §12.4–§12.7 legislative
  micro-mechanics, §14.1 exec actions, §13.3.2 diplomacy actions). _Complete._
- **PR7 — Lobbies → expertise → industry + faction ideology.** Lobby cards
  trickle expertise to members (2.1.2), `LOBBY_INDUSTRY` nudges state industries
  (2.1.8), `EXPERTISE_IDEOLOGY_LEAN` biases `factionCenter`. _Complete._
- **PR6 — Trait pass B (governance/cabinet-facing).** `TRAIT_GOVERNANCE_EFFECTS`
  drive lingering meters, era-event modulation (Delegator/Micromanager,
  Crisis Gov/Admin, Iron Fist), military-command grants, Secession-Winter band.
  _Complete._
- **PR5 — Cabinet overhaul.** Per-seat scoring (`CABINET_SEAT_SCORING`),
  expertise gating + grants (`OFFICE_EXPERTISE`), admin double on confirm,
  era-conditional seats (`cabinetSeatsForYear`). _Complete._
- **PR4 — Trait pass A (election-facing).** `TRAIT_ELECTION_EFFECTS` /
  `TRAIT_ELECTION_BANDS` give real per-context magnitudes to election traits
  (Charismatic, Integrity, Unlikable, Outsider, …). _Complete._
- **PR3 — Trait loss + conflict machinery.** Old-age trait decay
  (`TRAIT_LIFECYCLE_RULES.oldAge` fading pool) + d6 conflict arbitration
  (`TRAIT_CONFLICTS`, `tryGrantTrait`). _Complete._
- **PR2 — Ability earn/loss alignment.** Missing command grants
  (faction/party leader, committee, CC pres, cabinet, battles) +
  the loss machinery (old-age, anytime evo, battle) for all six skills +
  command; primary/secondary track grants. _Complete._
- **PR1 — Expertise axis foundation.** New `Expertise` type (19 tags) +
  `expertise` field; migrated the 8 mis-filed expertise-as-trait strings off the
  `Trait` union (incl. `repair()` save migration + dataset regen). _Complete._

---

## Up next (dependency-ordered)

Order is binding from `technical-guide.md` §9 — the **5 keystones** (0–4)
before any subsystem work, then the **9 subsystem epics** (5–13) in roughly
this order to minimize rework. Each row is right-sized to a single
`/build-feature` run; epic-sized convention work is split into three. Items
marked `(bootstrap)` were in the original 6-item provisional roadmap;
unmarked items are **new from the `f4c7c2c4` ingest**.

| # | Item | Scope (1–2 lines) | Depends on | Size | Source |
|---|---|---|---|---|---|
| 0 | **Seed the RNG (real PRNG + seed on `GameState`)** *(bootstrap, expanded)* | Drop a real seeded PRNG (mulberry32/xoshiro) into `rng.ts:5`; store `seed` + PRNG state on `GameState` (optional + `repair()` backfill); migrate the ~13 raw `Math.random` engine calls (`calcStateVote` jitter `phaseRunners.ts:3711`, draft rookie fallback, war/court rolls, `revolutionaryWar.ts:89,97`, `continentalCongress.ts:271`). Keep wrapper signatures. | — | S–M | game-context gap-log rows tech-debt #1–#3; digest §A (determinism prerequisite for multiplayer) |
| 1 | **`State.policies` data shape + `repair()` backfill** *(NEW)* | Add `policies?: Partial<Record<StatePolicyId, StatePolicy>>` to `State` (`types.ts:1318`); seed `StatePolicyId` union with the five observed flags (Poll Tax, Jim Crow, Prohibition, Women's Suffrage, Segregation); support `multiplierUntilYear` for time-bounded multipliers (3x Jim Crow for 30 years). Idempotent backfill `{}` per state. Extend `Predicate` with `{ statePolicyActive }` + one `evalPredicate` case. | 0 | XS–S | game-context gap-log #21, #25; digest §F #24–#25 (post 125) |
| 2 | **`ActionRegistry<Ctx>` keystone refactor** *(NEW)* | Define `GameAction<Ctx>` + `ActionRegistry<Ctx>` once in `src/engine/actionRegistry.ts` (one 80-line type covering id/label/`isAvailable`/`resolve`/`persistence`). One UI Action Picker component. One JSON-serializable shape for save-game persistence. Used by all four downstream action libraries (#6, #7, #8, and convention inter-ballot in #5). | 0 | S | technical-guide §6.6; digest §E #15, §F #23, §I #32, §H #29 (four parallel action libraries) |
| 3 | **`advanceEra(snap)` keystone + era-content registry** *(bootstrap, expanded)* | Replace the hard-coded transition in `constitutionalConvention.ts:198` with a pure `advanceEra(snap, target: Era)`; lift `eraGraph.ts:4,113`'s hard-import of `ERA_GRAPH_1772` to `ERA_GRAPHS: Record<Era, GraphNode[]>` keyed by era; era-keyed `validate()` denylist. Side-effect hooks for card-pool swap, nation renames, draft profile shift. | 0 | M | game-context gap-log #2, tech-debt #5/#9; digest §A #1–#2 |
| 4 | **Era enum widening + Gilded scenario boot** *(bootstrap, retargeted)* | Add `'gilded'` to `Era` (`types.ts:1337`); fill every `Record<Era, …>` rule table the TS exhaustiveness check flags (mortality, leadership, anytime events, trait bands); add `scenarioGilded.ts` builder + Gilded state roster + era-mapped party meaning + `ERA_GRAPH_GILDED` spine (shell — full era-event content fans into #10). Per-era ideology drafting profile registry `FACTION_DRAFT_PROFILES: Record<FactionId, Record<Era, IdeologyProfile>>`. | 3 | M–L | game-context gap-log #2, #4, #41; digest §A #1 (Brocklin's Lib/Mod → Prog/Lib shift), §J #34 |
| 5a | **Convention machinery — ballot loop + unit rule** *(NEW, epic split 1/3)* | Replace the `engine.ts:69` one-liner ("party conventions ratify the primary winners") with a multi-ballot loop on phase 2.9.2: ballot resolver, unit-rule on/off, momentum scalar that carries +1 to biggest-gainer next ballot, dropout-and-endorse path. Wire into existing `needsPlayerInput: 'convention'` with a richer payload. | 0, 2 | M | game-context gap-log #13; digest §E #15 (posts 220, 229-246) |
| 5b | **Convention machinery — inter-ballot action library** *(NEW, epic split 2/3)* | Five inter-ballot actions on the `ActionRegistry`: Force Rules Change, Presidential Promise (locks future cabinet seat in a `convention.promises` ledger), Drop & endorse, Kingmaker interference (5-6 roll for ±1 momentum on allied), Request a ballot shift (the retroactive delegate move post 245-246). Nominator's speech 1d6 + Orator → +1 momentum / -1 on a 1. Keynote speaker separate roll. | 2, 5a | M | game-context gap-log #13; digest §E #15 (posts 211, 222, 227, 229-246) |
| 5c | **Convention machinery — platform, VP impact, scandal, faithless electors** *(NEW, epic split 3/3)* | 5-plank platform (Domestic/Foreign/Economic/Judicial/Executive), 4-step tiebreak comparison (party points exceeded, lowest-faction exceeded, nominee ideology top, delegation bonus), +2 Mod enthusiasm for delegators. VP-impact 10-check scorer at convention close. Per-cycle scandal roll (1d6, magnitude 2d6, `Integrity` grants immunity). Faithless-elector roller in EC tally. General-election actions (Give a Speech, Send VP to Shore Up Support) + meters-to-election-bonus mapping. | 0, 5a, 5b | M–L | game-context gap-log #14–#19; digest §E #16–#21 (posts 224-267) |
| 6 | **Governor's actions library (2.5.2)** *(NEW)* | Replace the passive `bias` nudge at `phaseRunners.ts:3382` with ~14 named actions on the registry: Build roads/bridges/canals, Increase Maritime/Mfg/Ag/Mining/Finance, Major Irrigation (needs same-party senator), Establish State Bank, Gerrymander (needs Iron Fist + Justice + Controversial), Build State University, Improve best industry, Women's Suffrage, +state-gov jobs, 2/4-year terms, Discriminate against ex-Secessionists, Anti-Corruption campaign, Enact Jim Crow. d100 vs 20·governing; reads/writes `State.policies`. | 1, 2 | M | game-context gap-log #20; digest §F #23 (posts 134-150) |
| 7 | **Diplomacy actions library (2.7.1) + per-power foreign-relations meters** *(NEW)* | Three diplomacy actions on the registry: Increase Relations (±1), Increase Trade (≥neutral; 5-6 → +rev/budget, 1-2 → -rev/budget), Extend Credit (rev/budget ≤ balanced; 10% rel +1, 10% econ stab +1). Seed the per-era foreign-power roster on `GameState.diplomacy` (UK/France/Spain/Prussia/Russia/China) + era-rename map (Prussia→Germany post-1871). | 2, 3 | M | game-context gap-log #25–#26; digest §H #29 (posts 132, 198) |
| 8 | **Executive Actions library (2.8.1)** *(NEW)* | Replace the 4 hardcoded one-shots at `phaseRunners.ts:3636` with the registry. N actions/half-term (N varies by traits; `Easily Overwhelmed` rolls to hand off to VP). Persistent state on `GameState.activeExecutiveActions` with `expiresOn: 'admin-change' \| 'manual' \| { year }`. Auto-deactivate sweep at 2.9.4 winner reset. Named actions: Swing-around-the-circle (1-30 success / 31-50 fail / else no-op), Establish Bureau of Labor, Pro-military budget. | 2, 3 | M | game-context gap-log #23; digest §I #32–#33 (posts 201-203) |
| 9 | **Legislative micro-mechanics (block-and-replace, packaging, filibuster, Crisis Bills, all-cards scoring)** *(NEW)* | Five micro-mechanics on phases 2.6.1–2.6.3, each a small sub-PR: (a) committee chair block-and-replace with same-committee replacement check; (b) bill packaging (`*(Packaged)*` aggregate vote); (c) filibuster sub-phase between House and Senate, one per faction with eligible senator; (d) `*Crisis Bill*` tag + `Legislation.resolvesCrisis?: CrisisId` + `GameState.activeCrises?: CrisisId[]` (Economic, Honest Gov't, Domestic, Anti-Naturalization, Anti-Native, Anti-Chinese); (e) `legislativeScoring(bill, faction)` Phase-A leaderboard scoring on a new `Faction.score?` ledger (keep `cardVoteBias` as vote-probability for now — see §9.3 div #1). | 0 | M (split) | game-context gap-log #8–#12; digest §D #9–#14 (posts 160-237) |
| 10 | **Era-event extensions (multi-decider, foreign-territory grants, census EV deltas, Egghead advisory)** *(NEW)* | Widen `EraEvent.decider: Role \| Role[]` and wire the resolver to roll per role. Era-event → territory grant flow (Oregon Treaty grants BC/WA/OR/ID en bloc); organized/unorganized status; State-of-the-Union view. `GameState.pendingEvDeltas?: { stateId; delta; censusYear }[]` applied in 2.10 on `year % 10 === 0`. Egghead-cabinet advisory step before pliable/passive Pres resolves an event. | 1, 3 | M | game-context gap-log #22, #33, #34; digest §K #35–#36, §H #30–#31 (posts 106, 125, 126, 129) |
| 11 | **Cabinet & Congressional leadership extensions** *(NEW)* | Cabinet: per-region coverage check → -1 in next Presidential race in unrepresented regions; cabinet appointment guard on state status (no non-state/non-territory pols); Ministers-to-foreign-powers seats; faction-leader-anointment flow + trait-based eligibility filter (Passive replaceable, `Easily Overwhelmed` blocks PL run). Congressional 2.2.1: Speaker / House Maj-Min Leader / Maj-Min Whip / Sen Maj-Min Ldr / Maj-Min Whip / Pres Pro Tem pipeline; RCV whip races; committee-eligibility-by-prior-service guard; role-effect table (+1 Legis, lose Obscure, gain Propagandist/Kingmaker, …); PL 5+ term fatigue (-1 party pref). | 0 | M–L | game-context gap-log #28–#32; digest §G #26–#28 (posts 50, 60, 61, 66, 85, 103, 112, 117, 324, 333, 341) |
| 12 | **Constitutional Amendments as durable state** *(NEW)* | `GameState.amendments?: Amendment[]` (each `{ id, passedYear, data? }`). Bill type for amendments + ratification threshold. Effect-bound rules: presidential term-length (4 default / 6 / 1-term-for-life / 2-term-for-life), VP-vacancy fill via Pres nomination, succession. Repeal mechanics revert to defaults. Extend `Predicate` with `{ amendmentPassed }`. | 0 | M | game-context gap-log #39; digest §E #22 (posts 159, 164, 173, 188, 276-277) |
| 13 | **Small consistency PRs (cluster)** *(NEW)* | Eight XS–S consistency PRs that can land independently: (a) auto-Carpetbagger on successful alt-state relocation (resolves divergence §9.3 div #2); (b) defeated-incumbent auto-retire (pres / gov / rep); (c) old-age stat decay table (separate from death roll, age-keyed); (d) faction nicknames as era-flavored party labels (drift mechanic + edit surface); (e) `GameState.nationalSurplus?: number` distinct from `meters.revenue`; (f) industry-leadership compute + scoring hook (no new field, derived from `State.industries` per turn); (g) cabinet regional-coverage malus (if not already in #11); (h) faction-personality drift rule formalization (the 2.1.8 add/lose card list — currently GM-discretionary; algorithmic shape TBD per open question). | varies | XS–S each | game-context gap-log #24, #27, #31, #35–#38, #40; digest §C, §F, §J, §K (posts 36, 49, 133, 200, 297, 298, 323) |

---

## Later / parking lot

Bigger or fuzzier items not yet sequenced. Items 14–16 from the tech-lead's
plan live here.

- **14. Design-divergence resolutions** (mechanics §19.1, tech-lead §9.3).
  Cleanup the team can pick up between feature work, two of three already
  scoped above:
  - **Div #1 — Bill scoring (M, low risk).** Phase A is folded into #9(e):
    add `legislativeScoring` separate from `cardVoteBias`. **Phase B** (revisit
    `cardVoteBias` to be per-card-aware once leaderboard is live) lives here
    pending playtest evidence.
  - **Div #2 — Carpetbagger auto-grant (XS, low risk).** Folded into #13(a)
    above — not a separate parking-lot item, listed here for traceability.
  - **Div #3 — Conversion targeting (M, medium risk).** **Keep shipped for
    now.** Revisit only after faction-personality drift (#13h) lands a
    rule-driven `Can Party Flip` signal. Until then, the shipped multiplicative
    table is doing useful work.

- **15. Hot-seat / sequential multiplayer (M epic).** Reuses the existing
  `needsPlayerInput` mechanism (`engine.ts:9`) round-robin across human
  factions before `advancePhase`. **Hard-blocked on keystone 0 (determinism)
  AND on every action library landing** (#5b, #6, #7, #8) — the player-input
  modalities ARE the four action libraries; building hot-seat first means
  re-validating against each new action library. Also needs the
  singleton-player refactor: flip `GameState.playerFactionId` to
  `playerFactionIds: string[]` and audit every "is this me?" call site
  (`playerControlsDecider`, `eraGraph.ts`, faction-scan gates in
  `phaseRunners.ts`, autoNav effects in `App.tsx`). — game-context gap-log #1.

- **16. Async forum-style multiplayer (L–XL separate epic).** IndexedDB is
  per-browser (`db.ts`); shared state needs a server (or CRDT /
  host-authoritative sync) the repo does not have today. Hard-blocked on
  keystone 0 + #15. Also exposes debt #6 (whole-snapshot clone + save becomes
  a real bottleneck once multiple players poke state — expect to move to
  per-store/delta writes). Scope as its own epic, not a feature. Open
  question: snake order? bidding? seat assignment? — pending more digests.

- **Far-future eras (`progressive` / `modern`+).** Whatever sits past the
  Gilded Age — feminists / socialists / communists / prohibitionists /
  eugenicists / labor activists per the post-1 era brief. Lift in once a
  Progressive-Era or later digest lands. — game-context gap-log #2 (the "next
  era" tail), open question: era enum splits into `gilded` + `progressive` or
  not.

- **Gilded-Age issue *systems* depth.** The shells for tariff (integer set by
  legislation), currency (`MonetaryRegime` enum: Gold / Bimetallic / Silver),
  civil-service / anti-corruption, imperialism (island naval bases) get a
  data-only home inside #4 (Gilded scenario) and #9 (Crisis Bills); the
  *system-level* depth (per-issue interest groups, full era-event spines,
  imperialism annexation flow distinct from `admitState`) is parked. — game-
  context gap-log #3, #6.

- **Supreme Court cases.** `SupremeCourtCase` / `pendingCourtCases` types
  exist + a ruling tick exists, but no scenario seeds substantive cases —
  court is just the abstract `partyPreference` nudge today. — game-mechanics
  §19.

- **Generic-war battle/casualty depth.** Bring the rich Revolutionary-War
  battle system to generic (1856+) wars, which use the thin `milPower×10 +
  d100` resolver. — game-mechanics §19.

- **Third-party support.** Flesh out the 2.9.3 stub (currently a no-op "no
  challenge" log) into a real third-party / spoiler mechanic. — game-mechanics
  §19.

---

## Sequencing notes

Why the order is what it is.

1. **The single most important dependency call** (tech-lead §9.5):
   > "Keystone 2 (the `ActionRegistry<Ctx>` refactor) **blocks every
   > action-library build (governor / exec / convention / diplomacy) AND
   > blocks hot-seat multiplayer**. Building any one of those four ad-hoc
   > costs the team a 4× tax later. If only one keystone lands this quarter,
   > it should be #2."
   This is why item 2 sits among the foundations, not buried inside the first
   action library that needs it. Items 5b, 6, 7, 8 *all* read against this
   shape; if each library invents its own, we ship four parallel ad-hoc
   registries plus four bespoke UI pickers.

2. **RNG first (item 0).** Tech-lead §9.1: "Determinism is the **prerequisite
   for multiplayer** (clients/turns must agree on roll outcomes) and for any
   future replay/test harness that wants reproducibility. Mechanical, but
   touches many files — do it before the codebase grows further." It is a
   hard gate for #15/#16 and a soft gate for every roll-heavy subsystem
   (filibuster rolls, scandal rolls, governor d100s, faithless electors). The
   ~13 raw `Math.random` calls are catalogued and sweep cleanly in one PR
   once the PRNG is seated.

3. **`State.policies` is small but load-bearing (item 1).** Tech-lead §9.1
   ranks this as XS: "Load-bearing — **lots of later content reads/writes
   it**: governor actions (#6), era events (Poll Tax / Jim Crow / Prohibition
   / Women's Suffrage / Segregation toggles), bill effects, election scoring.
   A tiny PR. Land before the governor's-action library so the actions have a
   real target." Skipping this and letting governor actions invent their own
   policy state would mean re-keying every consumer later.

4. **Eras before multiplayer.** Tech-lead §9.4: "Eras are a *content +
   extension-point* problem on the existing single-player loop; multiplayer
   is a *turn-model rearchitecture* … **So: eras (1) → multiplayer (2).**"

5. **The era keystone gates all era work (item 3).** "Today the **only** era
   transition is hard-coded in the convention (`constitutionalConvention.ts:198`).
   Generalize to a small `advanceEra(snap)` … *This is the keystone — debt #5
   — and blocks everything else here.*" Item 4 (Gilded scenario), #10
   (era-event extensions), and the future-era parking-lot items all depend on
   it.

6. **Convention is the biggest single subsystem and is split into three**
   (5a/5b/5c). Tech-lead §9.2 sizes it L–XL by itself — bigger than any other
   row. Splitting into ballot-loop + inter-ballot library + platform-and-VP
   keeps each PR right-sized and lets the second slot (#5b) be the first
   real test of the `ActionRegistry` from #2.

7. **Hot-seat is "M on top of the current architecture" — but only after
   action libraries exist.** Tech-lead §9.4: "the player-input modalities are
   exactly the four action libraries (draft pick, era-event response, cabinet
   selection, convention inter-ballot, governor action, exec action,
   diplomacy action). Hot-seat needs those libraries to *exist as picker UIs*
   before it's coherent." So hot-seat sits at item 15, not earlier.

8. **Async multiplayer is its own L–XL epic.** "IndexedDB is per-browser;
   shared state needs a server (or CRDT/host-authoritative sync) the repo
   does not have today. Scope it as its own epic, not a feature."

### Estimate caution

Per-item sizes are the tech-lead's. Items that may still feel XL after
splitting:

- **#5a/5b/5c (Convention)** — the split brings each piece to M, but #5b
  (inter-ballot action library) is the first real use of the
  `ActionRegistry<Ctx>` from #2 and may surface registry-shape iteration
  costs. If it does, we may want a thin spike PR to harden the registry
  before #5b proper.
- **#9 (Legislative micro-mechanics)** — five sub-mechanics in one row; each
  is independently sized M but they share the bill pipeline. Likely splits
  into 5 sequential sub-PRs in the order (a) block-and-replace → (b)
  packaging → (c) filibuster → (d) Crisis Bills → (e) leaderboard scoring.
- **#11 (Cabinet & Congressional leadership)** — sized M–L; the Congressional
  9-role pipeline (with RCV whip races) is the chunkier half. Consider
  splitting cabinet-richness and Congressional-leadership pipeline if either
  feels XL during scoping.
- **#13 (Small consistency PRs)** — 8 sub-items; not XL collectively but each
  ships separately and item (h) (faction-personality drift formalization) is
  open-ended pending open-question resolution.

---

## Provenance note

This is the **first real ingestion** (the `f4c7c2c4` dry-run on the
bootstrap example). The bootstrap roadmap had **6 provisional items** (RNG
split into 2 PRs, era keystone, era registry, era-keyed config, Gilded
scenario shell). This rebuild keeps the keystone shape but:

- expands RNG into a single dual-purpose PR (#0),
- inserts **two new keystones** (#1 `State.policies`, #2 `ActionRegistry`)
  the bootstrap couldn't have known about (they emerged from the gap log),
- promotes the Gilded scenario from a thin shell to a real era-boot (#4)
  with a per-(faction, era) draft profile registry,
- adds **9 new subsystem epics** (#5a–#13) absorbing ~30 mechanic sub-systems
  the dry-run revealed (convention machinery, governor actions, exec
  actions, diplomacy actions, legislative micro-mechanics, era-event
  extensions, cabinet + Congressional leadership, amendments, consistency
  cluster),
- resolves the three design divergences from `game-mechanics.md §19.1` per
  tech-lead §9.3 (Carpetbagger auto-grant folded into #13a; bill-scoring
  Phase A folded into #9e and Phase B parked; conversion-targeting parked
  pending faction-personality drift formalization),
- moves multiplayer (hot-seat + async) into the parking lot as items 15–16
  with explicit hard-blockers.

Future `/ingest-playtest` runs may refine scopes (especially around
Constitutional Amendments effect-set, the foreign-relations roster's era
renames, faction-personality drift rules, and the post-Gilded "next era"),
re-split currently M-sized rows, and add items currently parked or
unknown. The order above is buildable top-to-bottom **today**; re-validate
on every digest.

---

**Roadmap path:** `/home/user/AMPU/docs/game/roadmap.md`.
