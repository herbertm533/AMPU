# Spec: Expertise Axis Foundation (PR1)

## Vision (as given)

First slice of the abilities / expertise / traits alignment epic. The canonical
design reference defines **Expertise** as a third character axis — distinct from
abilities (skills) and traits — that records what a politician studied or worked
their way up through. AMPU has no expertise axis today; worse, 8 of the 19
expertise tags are mis-filed inside the `Trait` union and seeded onto
politicians as traits. PR1 builds the axis: define the type, add the field, seed
it (resolving the mis-filing), wire the gain triggers that map to systems that
already exist, surface it read-only on the roster, and migrate old saves.
Everything that *consumes* expertise (cabinet gating, faction ideology, lobby
wiring) is a later PR — PR1 only lays the foundation.

## Historical grounding (binding)

Source of mechanics: `docs/research/source-abilities-expertise-traits.md`
(BINDING design reference, "EXPERTISE" + "LOBBIES" sections). Source of scope:
`docs/research/abilities-expertise-traits-gap-analysis.md` (CP0 gap analysis,
"System 2 — Expertise" + reconciliation decision D3). This is an engine-alignment
PR, not an era-content change, so there is no separate historian brief; the
design reference is the ground truth.

Binding facts carried from those documents (the F-facts below restate them as
testable constraints):

- The reference names **exactly 19** expertise tags and treats expertise as "a
  distinct axis from abilities and traits."
- The reference's **Gain** list for expertise is: leaving the career tracks;
  re-elected as governor; appointment to a committee; gained during
  appointment/reappointment to cabinet offices and ambassadorships.
- The reference's **Use** list (cabinet eligibility gating, faction ideology,
  certain governor actions) is entirely downstream — **out of scope for PR1**.
- 8 of the 19 tags (Agriculture, Business, Economics, Education, Environment,
  Media, Military, Naval) currently live in AMPU's `Trait` union and are seeded
  as traits; the reference says they are expertise. D3 resolves this (see The
  central decision).

## Player experience

When the player opens their roster or inspects a politician, they now see a
third dimension beyond skills and traits: a politician's *fields of expertise*
(e.g. a former Treasury secretary reads as **Economics · Foreign Affairs**, a
career admiral as **Naval**). It tells the player at a glance *what a politician
is good at governing*, foreshadowing the cabinet-eligibility and faction-ideology
systems that later PRs hang on it. In PR1 it is purely informational — no
election or appointment math changes — but it makes the roster legibly deeper and
corrects the current oddity where "Economics" and "Naval" sit in the same list
as "Charismatic" and "Corrupt."

## User story

As a player managing a faction's talent, I want each politician to carry a
distinct set of **expertise tags** (seeded from their background and grown as
they leave career tracks and take cabinet/committee posts), surfaced read-only on
the roster, so that I can see what each politician is suited to govern before the
later cabinet-gating and faction-ideology systems make that expertise
mechanically load-bearing.

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human/architect resolves
at checkpoint; PM recommendation in parentheses). The headline `[Open @ CP1]` is
the D3 migration decision (AC #4–#9); see Open Questions.

### A. The Expertise type (`src/types.ts`)

1. **[Locked]** A new `Expertise` string-literal union is defined in
   `src/types.ts` with **exactly these 19 members**: `Agriculture`, `Business`,
   `Economics`, `Education`, `Energy`, `Environment`, `Foreign Affairs`,
   `Healthcare`, `Housing`, `Justice`, `Labor`, `Media`, `Military`, `Naval`,
   `Science`, `Technology`, `Trade`, `Transportation`, `Welfare`.
2. **[Locked]** An `EXPERTISE: Expertise[]` array constant lists all 19 (the
   single source for any iteration / UI legend), mirroring the existing
   `SKILLS` / `POSITIVE_TRAITS` pattern.
3. **[Locked]** `Expertise` is a **separate axis** — it is NOT added to
   `SkillKey`, NOT added to the `Skills` object, and (per the chosen D3 option)
   NOT left dual-listed in `Trait` after migration. `backroom` (D1) and `command`
   (D2) are untouched.

### B. The `expertise` field (`src/types.ts`)

4. **[Locked]** `Politician` gains an `expertise: Expertise[]` field (an array —
   a politician can hold several). It is required on the interface; seeding (AC
   #10–#13) and `repair()` (AC #20) guarantee it is always present at runtime.
5. **[Locked]** `ImportedDraftee` (the draft-dataset row shape,
   `src/types.ts:1001`) gains an `expertise: Expertise[]` field so seeded draft
   classes can carry expertise. Order of array members is not significant; the
   field defaults to `[]` when a row supplies none.

### C. D3 — resolving the 8 mis-filed tags (the headline decision)

6. **[Open @ CP1 — recommend Option A, full migration]** The 8 names
   (Agriculture, Business, Economics, Education, Environment, Media, Military,
   Naval) are **removed from the `Trait` union and from `POSITIVE_TRAITS`** and
   re-homed as `Expertise`. (Option B alternative is documented in Open
   Questions; if B is chosen, AC #7–#9 are replaced by a runtime trait→expertise
   mapping and the 8 stay in `Trait`.)
7. **[Open @ CP1 — recommend Option A]** `TRACK_THEMED_TRAITS`
   (`src/types.ts:173`) no longer mints those 8 as traits. The 5 expertise names
   currently in that table (`Business`, `Media`, `Agriculture`, `Economics`,
   `Education`) are removed from it; the per-track themed-trait pools are
   back-filled so each track still has a non-empty pool (see Edge cases — the
   removal must not leave `Private`/`Administration`/`Governing` with thin
   pools). `Military` and `Naval` are handled by the Military-track *expertise*
   gain (AC #14), not as themed traits.
8. **[Open @ CP1 — recommend Option A]** The author-time generator scripts are
   updated so a regenerated dataset emits the 8 as `expertise`, not `traits`:
   - `scripts/seedDataset.mjs` — the curated `ROWS` / `ERA_ROWS` move those 8 out
     of each row's traits list into an expertise list; the normalized
     `CURATED_ROWS` / `ERA_FIGURES` objects carry an `expertise` array.
   - `scripts/legislatorsToDataset.mjs` — the emitted JSON
     (`public/standard-draft-classes.json`), review CSV
     (`politicians-dataset.csv`), and offline fallback
     (`src/data/defaultDraftClasses.ts`) all include an `expertise` field per
     row; the bulk heuristic may emit `expertise: []` for derived rows.
9. **[Open @ CP1 — recommend Option A]** The generated artifacts are regenerated
   from the updated scripts so they ship consistent with the new types (NOT
   hand-edited — per CLAUDE.md they are generated). Because
   `scripts/fetchLegislators.sh` needs network access to download sources, the
   regeneration approach is itself an open question (see Open Questions Q2): the
   acceptable outcomes are (a) full regen if the build env has network, or (b)
   regenerate **only** `src/data/defaultDraftClasses.ts` + the runtime JSON from
   the **already-downloaded** `.legis/` cache if present, or (c) ship updated
   scripts + a regenerated **offline fallback** only and flag the full-JSON regen
   as a follow-up. In every case `npm run build` must pass and the offline
   fallback (`defaultDraftClasses.ts`) must type-check against the new
   `ImportedDraftee`.

### D. Seeding (initial expertise on existing/seeded politicians)

10. **[Locked]** Every politician present at scenario start, and every politician
    produced by a draft from the standard dataset, ends up with an `expertise`
    array (possibly empty). No politician is ever left with `expertise ===
    undefined` at runtime.
11. **[Open @ CP1 — tied to D3]** Under **Option A**, seeded expertise comes from
    the dataset rows directly (the 8 names that used to be traits are now
    expertise on those rows). Under **Option B**, seeded expertise is *derived at
    load/draft time* by mapping any of the 8 legacy traits a politician holds to
    the same-named expertise tag (e.g. a draftee with trait `Economics` gains
    expertise `Economics`), leaving the trait in place.
12. **[Locked]** Seeding is **idempotent**: re-running it on a politician who
    already has expertise does not duplicate tags. A `expertiseSeeded?: boolean`
    sentinel on `Politician` (mirroring the existing `ambitiousSeeded` /
    `ideologyTraitsSeeded` pattern) OR a dedupe-on-insert guarantees this — the
    architect picks the mechanism (Open Questions Q4).
13. **[Locked]** Expertise tags within a politician's array are **unique** (no
    duplicates) at all times — every gain path (AC #14–#17) and the seeding path
    dedupe before/while inserting.

### E. Gain rules going forward (only systems that ALREADY exist)

14. **[Locked]** **Leaving a career track** grants expertise. When a
    politician's `careerTrack` is cleared after maxing out
    (`phaseRunners.ts` ~line 378–382, the `careerTrackYears >=
    CAREER_TRACK_MAX_YEARS` exit), they gain the expertise mapped to that track:
    - `Administration` → Economics
    - `Legislative` → (track-themed, recommend **none** for PR1 — flag Q5)
    - `Military` → Military
    - `Governing` → Agriculture
    - `Judicial` → Justice
    - `Backroom` → **none** (the reference excludes Backroom from several axes;
      and D1 keeps it as an AMPU extension)
    - `Private` → Business
    The exact track→expertise table is `[Open @ CP1]` (recommend the mapping
    above, derived from the old `TRACK_THEMED_TRAITS` themes); the *trigger
    point* (career-track exit) is `[Locked]`.
15. **[Locked]** **Cabinet / cabinet-level appointment** grants expertise at the
    moment of appointment in `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:1918`),
    using this office→expertise map (grounded in the reference's Lobbies table
    and cabinet Use rules):
    - `SecretaryOfState` → Foreign Affairs
    - `SecretaryOfTreasury` → Economics
    - `SecretaryOfWar` → Military
    - `AttorneyGeneral` → Justice
    - `GeneralInChief` → Military
    - `Admiral` → Naval
    - `PostmasterGeneral` → (recommend **none** for PR1)
    - `KeyAdvisor` → (recommend **none** for PR1)
    Re-appointment to the same post is a no-op (dedupe, AC #13). The map is
    `[Open @ CP1]` only for the PMG/KeyAdvisor "none" calls; the named Big-4 +
    military mappings are `[Locked]`.
16. **[Locked]** **Committee-chair appointment** grants expertise. AMPU has a
    committee system today (`runPhase_2_2_2_Committees`, `phaseRunners.ts:1708`,
    four committees: `Domestic`, `Foreign`, `Economic`, `Justice`). On becoming a
    committee chair, the politician gains:
    - `Economic` → Economics
    - `Foreign` → Foreign Affairs
    - `Justice` → Justice
    - `Domestic` → `[Open @ CP1]` (Domestic is broad; recommend **Welfare** as
      the single PR1 mapping, or **none** — see Q6)
    This satisfies the reference's "appointment to a committee" gain path **for
    chairs only**. NOTE: AMPU tracks committee **chairs**, not rank-and-file
    committee membership, so the reference's broader "being on a committee" gain
    is necessarily limited to chairs in PR1 (documented in Out of scope).
17. **[Open @ CP1 — recommend DEFER]** **Re-elected as governor** is listed by
    the reference but has **no clean hook today**: `runPhase_2_9_5_Governors`
    (`phaseRunners.ts:3045`) only fields candidates with **no current office**
    (`!p.currentOffice`) and **vacates** the incumbent before the vote, so an
    incumbent governor is never a re-election candidate. PR1 should **not** invent
    a governor-re-election mechanic (that is election-machinery work belonging to
    a later PR). Recommend: mark this gain path **deferred**, do not wire it.
18. **[Open @ CP1 — recommend DEFER]** **Ambassadorship** appointment is listed by
    the reference but AMPU has **no ambassador appointment phase** (the
    `Ambassador` office type exists but is never assigned). Recommend: mark this
    gain path **deferred**, do not wire it.
19. **[Locked]** All gain paths are **deterministic** (no `Math.random`; use
    `src/rng.ts` only if a roll is genuinely needed — but the recommended PR1
    gains are guaranteed-on-trigger, no roll) and **pure over the snapshot**,
    matching engine conventions. Each gain that actually adds a new tag writes a
    log line via `addLog` consistent with the surrounding phase (e.g. "Jane Doe
    gains Economics expertise.").

### F. Save migration (`repair()` in `src/state/GameContext.tsx`)

20. **[Locked]** `repair()` (`GameContext.tsx:91`) initializes `expertise` on
    every politician that lacks it (`p.expertise == null → p.expertise = []`),
    setting the `dirty` flag, so pre-PR1 saves load without error. This follows
    the existing backfill pattern (e.g. the `halfTermSummaries == null` block at
    line 137).
21. **[Open @ CP1 — tied to D3 Option B only]** If Option B is chosen, `repair()`
    *also* derives expertise from the 8 legacy traits on load (idempotently) so
    existing saves immediately show expertise. Under Option A this is unnecessary
    (old saves simply start with `[]` and accrue expertise via the gain paths
    going forward) — recommend accepting empty-on-legacy-save under Option A
    rather than rewriting historical traits in saves.

### G. UI — read-only surface (match existing patterns)

22. **[Locked]** The Roster page (`src/pages/Roster.tsx`) gains an **Expertise
    column** rendered like the existing Traits column (small text, comma-joined,
    truncated to the first ~2–3 tags with the full list on the cell). It is
    sortable by `sortValue: (p) => p.expertise.join(',')`, mirroring the Traits
    column at `Roster.tsx:43`.
23. **[Locked]** Expertise is shown **read-only** — no add/remove UI, no tooltip
    explaining mechanics (there are no mechanics yet). A politician with empty
    expertise renders an empty cell (consistent with how a politician with no
    traits renders today).
24. **[Open @ CP1 — recommend Roster column only]** AMPU has **no dedicated
    politician-detail modal/page** today (Roster is a flat `SortableTable`;
    `DraftScouting` shows skills/traits inline). PR1 recommendation: surface
    expertise on the **Roster column only** (AC #22) and, if low-cost, on the
    **Draft scouting** view next to traits. Building a new detail view is **out
    of scope**. Architect confirms whether the Draft-scouting surface is in or
    out at CP1.

### H. Out-of-scope guardrails (assertions that nothing leaked in)

25. **[Locked]** PR1 makes **no change to the PV formula** (`src/pv.ts`):
    expertise does not weight Political Value. (Whether it ever should is an open
    question, default OUT — see Q3.)
26. **[Locked]** PR1 makes **no change to cabinet eligibility / confirmation, to
    faction-ideology computation, or to lobby/industry wiring** — those reads of
    expertise are PR5 / PR7. Expertise exists and is granted, but nothing gates
    on it yet.

## Edge cases

- **Empty expertise** — a brand-new draftee or a private citizen who never held
  a relevant post has `expertise: []`; the Roster cell is blank and the type is
  still a valid (empty) array. Not an error state.
- **Themed-trait pool starvation (D3 Option A)** — removing the 5 expertise
  names from `TRACK_THEMED_TRAITS` empties part of three tracks' pools
  (`Private`: was `Celebrity, Business, Media` → only `Celebrity` left;
  `Administration`: was `Efficient, Economics, Education` → only `Efficient`;
  `Governing`: was `Leadership, Charismatic, Agriculture` → `Leadership,
  Charismatic`). The themed-trait roll already filters out held traits and
  no-ops on an empty pool (`phaseRunners.ts:315–319`), so this will not crash —
  but those tracks lose trait variety. The spec requires back-filling each
  thinned pool with at least one era-appropriate replacement trait so career
  tracks still feel rewarding (architect chooses replacements; flagged Q5).
- **Duplicate-grant** — a politician who was already `SecretaryOfTreasury`
  (Economics) and then leaves the Administration track (also Economics) must end
  with a single `Economics` tag, not two (AC #13 dedupe).
- **Re-appointment** — re-confirming the same person to the same cabinet post in
  a later term grants nothing new (dedupe); the reference's "reappointment"
  gain is satisfied vacuously in PR1 (the tag is already held).
- **Legacy save with the 8 traits (Option A)** — an old save still carries (say)
  trait `Economics` on a politician. Under Option A the `Trait` union no longer
  includes `Economics`, so the loaded value is now an unknown string. `repair()`
  must not crash on it; recommend stripping unknown trait strings during repair
  (mirroring the defensive card-id filter at `GameContext.tsx:157–168`) OR
  leaving them as inert strings. This is the riskiest Option-A edge (flagged in
  Open Questions).
- **CPU politicians** — gain paths fire for CPU-faction politicians too (cabinet,
  committee, career-track exit all run for all factions). Their expertise accrues
  silently; only the player's roster surfaces it, but the data is consistent
  across all politicians (needed by PR5/PR7).
- **Draft before the standard dataset finishes loading** — the offline fallback
  (`defaultDraftClasses.ts`) must already carry `expertise` (AC #8) so an
  early/pre-fetch draft still produces valid politicians.
- **`isHistorical` / scenario-seeded marquee figures** — the curated founders
  (e.g. Robert Morris → Economics, the admirals → Naval) should reflect their
  historical expertise via the curated rows under Option A; under Option B they
  inherit it from their existing curated traits.

## Out of scope

Named explicitly so the architect does not pull later-PR work into PR1:

- **Cabinet expertise GATING / confirmation hearings** (admin≥2, Sec-State needs
  Foreign Affairs, etc.) — **PR5**. PR1 grants expertise on appointment but does
  not read it for eligibility.
- **Faction ideology derived from expertise** — **PR7**. Faction center stays
  member-ideology-median.
- **Lobby→expertise and lobby→industry ("Points for Industry ±1") wiring** —
  **PR7**.
- **The 11 fully-absent traits, trait effects, and trait-loss / d6-conflict
  machinery** — **PR3 / PR4 / PR6**.
- **Ability (skill/command) earn & loss machinery** — **PR2**.
- **Any PV formula change for expertise** — default OUT (Q3).
- **Governor re-election mechanic** and **ambassador appointment phase** — no
  such systems exist today; PR1 does not build them, so their expertise gains are
  deferred (AC #17, #18).
- **Rank-and-file committee membership** (the reference's "being on a committee")
  — AMPU tracks chairs only; PR1 grants on chair appointment, not membership.
- **A new politician-detail view/modal** — PR1 surfaces expertise on existing
  surfaces only (AC #24).
- **`anytime evos` / old-age expertise changes** — the reference has no expertise
  *loss*; PR1 adds none.

## Open questions / assumptions

Highest-risk / decision-first ordering. Q1 is the CP1 headline.

1. **(HEADLINE — D3 migration: Option A vs Option B.)** Resolve the 8 mis-filed
   tags. **PM recommends Option A (full migration).**
   - **Option A — full migration.** Remove the 8 from `Trait` + `POSITIVE_TRAITS`
     + `TRACK_THEMED_TRAITS`; re-seed them as `expertise`; update both generator
     scripts; regenerate the dataset artifacts. **Cost:** edits to `types.ts`,
     `seedDataset.mjs`, `legislatorsToDataset.mjs`, and a dataset regeneration;
     plus the legacy-save edge (old saves carry now-unknown trait strings — strip
     in `repair()`). **Upside:** clean and correct; it is the entire point of the
     axis, and PR5/PR7 build on a correct foundation rather than tech debt.
   - **Option B — additive.** Add all 19 as new `expertise` data, **leave** the 8
     in `Trait` (dual-listed), and derive initial expertise at load/draft time by
     mapping the 8 legacy traits → same-named expertise. **Cost:** a runtime
     mapping in seeding + `repair()`; **no script/dataset regen needed**; **no
     legacy-save breakage**. **Downside:** the 8 stay miscategorized (tech debt),
     `TRACK_THEMED_TRAITS` keeps minting them as traits, and a future PR must
     still do the Option-A cleanup.
   - **Recommendation: A.** The whole epic hangs on a correct expertise axis, and
     the gap-analysis D3 already recommends migrating. The only real friction is
     the dataset regen and the legacy-save strip — both bounded. **But** the regen
     feasibility (Q2) is a genuine environmental unknown; if the build env cannot
     regenerate the full JSON, fall back to the Option-A-with-offline-only path
     (AC #9c) rather than choosing Option B, so the *types* still get corrected.
2. **(Dataset regen feasibility — Option A.)** `scripts/fetchLegislators.sh`
   requires network to download `congress-legislators` YAML + MEDSL CSVs into
   `.legis/` (gitignored). Is network available in the build env? If yes, full
   regen. If no, can `node scripts/legislatorsToDataset.mjs` run off an existing
   `.legis/` cache? If neither, ship updated scripts + a regenerated **offline
   fallback** (`defaultDraftClasses.ts`) only, and file the full-JSON regen as a
   tracked follow-up. The architect/human confirms which path at CP1. (The
   runtime JSON is large and runtime-loaded; a temporarily-stale JSON that still
   parses is tolerable for PR1 since nothing reads expertise yet — but the
   *offline fallback and types must be consistent*.)
3. **(Should expertise weight PV — default NO.)** The reference makes expertise
   gate cabinet eligibility and shape faction ideology, **not** drive elections;
   AMPU's PV drives elections. **Recommend expertise stays OUT of `computePV`
   for PR1** (and likely permanently). Flagging so the human can confirm at CP1
   that they don't want a small PV nudge for expertise.
4. **(Idempotency mechanism.)** Seed-once sentinel (`expertiseSeeded?: boolean`,
   matching `ambitiousSeeded`/`ideologyTraitsSeeded`) vs. dedupe-on-insert
   everywhere. **Recommend dedupe-on-insert** (simpler, and the gain paths must
   dedupe anyway per AC #13), with no extra sentinel — but the architect decides.
5. **(Career-track → expertise table, and themed-trait back-fill.)** Confirm the
   track→expertise map in AC #14 (recommended: Administration→Economics,
   Military→Military, Governing→Agriculture, Judicial→Justice, Private→Business,
   Legislative→none, Backroom→none). Also confirm the replacement themed traits
   for the three pools thinned by Option A (Edge cases). These are tuning calls
   for the architect/designer; the *trigger points* are locked.
6. **(`Domestic` committee-chair → which expertise?)** Domestic is broad (could
   map to Welfare, Housing, Healthcare, Education…). **Recommend a single mapping
   `Domestic → Welfare`, or `none`** for PR1 rather than splitting Domestic into
   sub-committees (that is a committee-system expansion, out of scope). Architect
   picks Welfare-or-none at CP1.
7. **(Draft-scouting surface in or out?)** AC #24 — recommend Roster column for
   sure, Draft-scouting view if low-cost. Architect confirms scope at CP1 so it
   doesn't balloon into a detail-view build.
8. **(Assumption — no expertise loss.)** PR1 only *grants* expertise; the
   reference defines no expertise loss, so none is built. Stated so it's not
   mistaken for an omission.

---

**Spec file:** `/home/user/AMPU/docs/specs/expertise-axis-foundation.md`
