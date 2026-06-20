# Spec: Trait Pass A continued — New election-facing traits + Hale/Frail pair (PR4b)

## Vision (as given)

Sixth slice of the abilities / expertise / traits alignment epic, and the
twin of PR4a. PR4a wired per-context magnitudes for the 15 election-facing
traits AMPU already seeds. PR4b **adds 7 new traits** to that machinery:

- **Likable ↔ Uncharismatic** (warmth axis — Lincoln/Franklin/Douglas vs.
  Madison/Chase/Polk).
- **Cosmopolitan ↔ Provincial** (geographic horizon — Jefferson/Hamilton/
  Sumner vs. Henry/Sam Adams/Johnson).
- **Two-Faced ↔ Predictable** (position stability — Burr/Webster's 7th of
  March vs. Calhoun/Mason).
- **Hale ↔ Frail** (robustness — Jackson/Houston/JQ Adams vs. Douglas
  1860). Frail already exists; Hale is the new pair.

Each new trait extends PR4a's `TRAIT_ELECTION_EFFECTS`. Each new pair
extends PR3's `TRAIT_CONFLICTS` (8 new map entries — 4 pairs × 2
directions). `Hale` enters PR3's `oldAge.fadingPool` (it can fade with
age — Jackson and JQ Adams declined in their late 70s/80s). The PR2a
wound-grant of `Frail` (`revolutionaryWar.ts:99`) routes through PR3's
`tryGrantTrait` so a `Hale` general gets a d6 to resist Frail-on-wound
(the Jackson-carries-bullets-38-years case). Dataset regen attaches the
new traits to marquee figures per the historian's section 7 list.

## Historical grounding (binding)

Source: `docs/research/trait-pass-b-new-traits-historical-context.md`
(historian's brief), companion to
`docs/research/trait-election-effects-historical-context.md` (PR4a) and
the canonical `docs/research/source-abilities-expertise-traits.md`.

**Binding facts from the historian's brief:**

- **F-PAIR-TWOFACED-PREDICTABLE-LOCKED (historian §Conflict-pair
  recommendations).** Two-Faced ↔ Predictable is the historian's locked
  pair (both center on position-stability — direct logical inverses;
  AMPU spec puts Flip-Flopper / Two-Faced on a stability ladder).
  Collapses two open pair questions to one resolved pair. PR4b ships
  this pair.
- **F-HALE-OPTION-B (historian §Hale + Old Age decay).** Hale **CAN
  fade** — it enters PR3's `oldAge.fadingPool`. Historical anchor:
  Jackson, JQ Adams, and Franklin showed late-life decline despite
  Hale-typed careers. The clean narrative is "Hale buys extra years
  of robustness but doesn't prevent decline." Option C
  (Hale-slows-OTHER-decay) is explicitly rejected as out-of-scope.
- **F-ORATOR-POLISH-DEFER (historian §Orator-polish).** "Orator-polish"
  is **NOT** a new trait in PR4b — the reference doesn't define one,
  the polish/spontaneity distinction is one of degree not category.
  Architect does not touch the existing `Orator` trait or magnitudes.
- **F-COSMOPOLITAN-ANACHRONISM (historian §Anachronism summary).** The
  word "Cosmopolitan" enters modern English in 1844; borderline for
  1772, clean for 1856. PM Open Q1: keep code label. Mechanic is
  era-fine for both windows.
- **F-UNCHARISMATIC-ANACHRONISM (historian §Anachronism summary).** The
  word "charisma" enters political usage ~1920 (Weber). Mechanic
  (flat/wooden public persona) is fully period-native; the WORD is
  modern. PM Open Q2: keep code label.
- **F-HALE-VS-FRAIL-1840 (historian §Hale + opp-conditional).** The
  1840 "log cabin" Harrison-vs-Van Buren campaign is the canonical
  Hale-vs-Frail moment. Magnitude bumped LARGE in `presGeneral` when
  opponent is Frail — mirrors PR4a's Unlikable-vs-Charismatic pattern.
- **F-COSMO-PROVINCIAL-ERA-SCALED (historian §Era anchoring).**
  Cosmopolitan / Provincial / Two-Faced / Hale all warrant era scaling
  (stronger in `nationalism`/`modern` than `independence`/`federalism`).
  Likable, Uncharismatic, Predictable are flat across eras.
- **F-MARQUEE-ATTRIBUTIONS (historian §7).** Section 7 names 2-4
  marquee figures per new trait (e.g., Franklin/Clay/Lincoln/Douglas
  = Likable; Madison/Chase/Polk = Uncharismatic; Jefferson/Hamilton/
  Sumner/Seward = Cosmopolitan; etc.). PR4b attributes these in the
  curated dataset.

## Player experience

The 7 new election-facing traits give the player **new texture** in
elections that PR4a's 15-trait set didn't cover. Drafting a Likable
politician — even one without Charismatic — pays off in district races
and internal party scoring (the Lincoln "best yarn-spinner in Illinois"
beat). An Uncharismatic candidate (Madison, Chase, Polk) can still win
in caucus and convention contexts but loses surface in popular races.
The Cosmopolitan/Provincial axis gives the player a geographic-horizon
dial — a Jefferson-style Cosmopolitan helps with internal-party and
national contexts but hurts at Governor; a Patrick Henry-style
Provincial is the opposite. Two-Faced burns a politician in primary /
convention contexts (Webster's 7th of March destroyed his New England
base). Predictable is mildly positive across the board. **And Hale**
finally fires the 1840 archetype — a rugged Hale frontiersman against
a Frail aristocrat gets a LARGE swing in `presGeneral`. With Hale also
in the old-age fading pool, the long-lived politician's late-career
robustness is a finite resource. Stacking is intended: Lincoln can be
Likable + Integrity + Orator; Burr can be Manipulative + Two-Faced;
Jackson can be Hale + Outsider + Controversial.

## User story

As a player drafting and developing politicians across decades, I want
the **7 new election-facing traits** (Likable, Uncharismatic,
Cosmopolitan, Provincial, Two-Faced, Predictable, Hale) to **swing
elections** in the contexts the historian's brief flags, to **conflict
symmetrically** when a politician would acquire opposites (d6-arbitrated
per PR3), and to **fade with old age** for Hale (per the late-Jackson
pattern) — so that the four new axes layer cleanly on top of PR4a's
texture without changing the PV formula or the election arithmetic.

## Scope of THIS spec (PR4b — new traits, conflict pairs, fading pool, dataset)

PR4b covers:
- **(A)** 7 new entries in the `Trait` union in `src/types.ts`:
  `Likable`, `Uncharismatic`, `Cosmopolitan`, `Provincial`, `Two-Faced`,
  `Predictable`, `Hale`.
- **(B)** Per-trait per-context magnitudes appended to PR4a's
  `TRAIT_ELECTION_EFFECTS`, including era-scaled rows for
  Cosmopolitan / Provincial / Two-Faced / Hale and opp-conditional rows
  for Likable, Uncharismatic, Hale (mirroring PR4a AC #15's pattern).
- **(C)** 8 new entries in PR3's `TRAIT_CONFLICTS` (4 pairs × 2
  directions): `Likable ↔ Uncharismatic`, `Cosmopolitan ↔ Provincial`,
  `Two-Faced ↔ Predictable`, `Hale ↔ Frail`.
- **(D)** Extending PR3's `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool` to
  include `Hale` (per F-HALE-OPTION-B). No other new trait enters the
  pool — Likable / Uncharismatic / Cosmopolitan / Provincial / Two-
  Faced / Predictable are character/identity traits, not robustness/
  acclaim traits that fade.
- **(E)** Seed-time mutual exclusion in `runPhase_2_1_1_Draft` (and
  parallel seed sites) so the 4 new conflict pairs never co-occur from
  seed, mirroring PR3's existing Loyal/Opportunist pattern at
  `phaseRunners.ts:1087-1088` and Ideologue/Impressionable at
  `:769-770`.
- **(F)** Routing the PR2a wound-grant of `Frail` at
  `revolutionaryWar.ts:99` through PR3's `tryGrantTrait` so a Hale
  general's d6 can resist Frail-on-wound (per Jackson's
  bullet-carrying-38-years case).
- **(G)** Dataset regeneration: PR4b updates `scripts/seedDataset.mjs`
  `CURATED_ROWS` with the historian's marquee attributions (table
  below). Architect runs the regen pipeline
  (`bash scripts/fetchLegislators.sh && node scripts/legislatorsToDataset.mjs`)
  to produce updated `public/standard-draft-classes.json` +
  `politicians-dataset.csv` + `src/data/defaultDraftClasses.ts`.

PR4b does **NOT** cover (PM enforces strictly):
- **Any other new traits** beyond the 7 listed (Iron Fist, Bookkeeper,
  Lawful, Geostrategist, Crisis Admin, etc. — PR6 / Trait Pass B).
- **Orator-polish as a distinct trait** (F-ORATOR-POLISH-DEFER).
- **Reworking PR4a's 15-trait magnitudes**. PR4b only extends; nothing
  in PR4a's table is touched.
- **New election contexts** beyond PR4a's 6 (`presGeneral`,
  `presPrimary`, `house`, `senatePre17`, `governor`, `internalParty`).
- **Election arithmetic changes**. PR4a's wiring (`calcStateVote` +
  primaries + faction-leader paths) reads `TRAIT_ELECTION_EFFECTS`
  unchanged; PR4b adds rows to the data, never touches the engine
  loop.
- **PV formula changes**. The 7 new traits each become either
  POSITIVE_TRAITS or NEGATIVE_TRAITS members (see AC #2) and PV reads
  them at the existing flat ±4 / −5 weights; no new PV special cases.
- **Cabinet expertise gating** (PR5).
- **Anytime / era events that grant the new traits** (PR6).
- **A "Hale slows OTHER decay" mechanic** (Option C, historian-rejected).
- **A scenario-conditional UI label rendering layer** (Open Q1 / Q2 —
  polish PR).
- **Reclassifying Outsider / Numberfudger** (PR4a Open Q6 carry-over).

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human
adjudicates at checkpoint). Headlines for CP1: Open Q1 (Cosmopolitan
label), Open Q2 (Uncharismatic label), Open Q3 (Hale-vs-Frail bump
size), Open Q4 (Two-Faced sign by context), Open Q5 (Wound-grant
routing through tryGrantTrait).

### A. Trait union expansion + classification

1. **[Locked]** The `Trait` union in `src/types.ts:62-100` gains
   exactly **7 new members**: `Likable`, `Uncharismatic`,
   `Cosmopolitan`, `Provincial`, `Two-Faced`, `Predictable`, `Hale`.
   No other union members change. No `Frail` rename or move (Frail
   already exists at line 89). Order: architect's call; conventional
   choice is "near related traits" (Likable near Charismatic;
   Uncharismatic near Unlikable; etc.).

2. **[Locked]** Each new trait is classified for the existing flat
   ±PV weights (`pv.ts`):
   - `POSITIVE_TRAITS` (+4 PV): `Likable`, `Cosmopolitan`,
     `Predictable`, `Hale`.
   - `NEGATIVE_TRAITS` (−5 PV): `Uncharismatic`, `Provincial`,
     `Two-Faced`.

   Note: **Provincial is classified NEGATIVE** at the PV layer because
   the trait's national-presidential ceiling is the dominant
   structural signal in AMPU's PV (which is office-weighted toward
   national offices); the context layer per AC #6 turns Provincial
   POSITIVE in `house`/`governor`/`senatePre17`, restoring the
   "advantage for Governor / US Rep" reading from the canonical source.
   This mirrors PR4a's Outsider mis-classification observation
   (PR4a Open Q6) — the flat layer is structurally negative, the
   context layer carries the texture. Architect must add both
   `POSITIVE_TRAITS` and `NEGATIVE_TRAITS` array updates in the same
   `src/types.ts` edit.

3. **[Locked]** No new field on `Politician` or `GameState`. No
   `repair()` change. Old saves load cleanly (politicians with no
   new traits get a 0 trait-effect adjustment per PR4a's helper, and
   the `traits: Trait[]` array shape is unchanged — a `Trait` union
   expansion does not break existing values).

### B. The 7-trait per-context magnitude table (the core)

4. **[Locked]** PR4b appends rows to PR4a's `TRAIT_ELECTION_EFFECTS`
   (`src/types.ts:615+`) for the 7 new traits per the table below.
   The architect uses the same `TRAIT_ELECTION_BANDS` constants
   (`SMALL=2`, `MEDIUM=4`, `LARGE=8`) and the same `TraitElectionRule`
   shape. Era-scaled rows use the `era?` field; opponent-conditional
   rows use `opponentConditional`. No new fields on the rule shape;
   no `bumpedMagnitude` band beyond LARGE.

   The directional table (architect locks numerics within band):

   | Trait | Pres-Gen | Pres-Primary (convention) | House | Senate (pre-17) | Governor | Internal-Party | Era restriction | Opp-conditional |
   |---|---|---|---|---|---|---|---|---|
   | **Likable** | + MEDIUM | + SMALL | + MEDIUM | + SMALL | + MEDIUM | + MEDIUM | flat both eras | **+ LARGE vs Unlikable opponent in presGeneral** (spec-explicit "especially against an Unlikable opponent") |
   | **Uncharismatic** | − SMALL | − SMALL | − SMALL | NONE | − SMALL | − MEDIUM | flat both eras | **− MEDIUM vs Charismatic opponent in presGeneral** (Polk-vs-Clay) |
   | **Cosmopolitan** | + MEDIUM (1856) / + SMALL (1772) | + SMALL | − SMALL | + SMALL (1856) / NONE (1772) | − MEDIUM | + MEDIUM | era-scaled per F-COSMO-PROVINCIAL-ERA-SCALED | none |
   | **Provincial** | − MEDIUM (1856) / − SMALL (1772) | − SMALL | + MEDIUM | + SMALL | + MEDIUM | − SMALL | era-scaled (presGeneral and house/governor bumped harder in `nationalism`/`modern`) | none in PR4b (region-conditional defer per Open Q6) |
   | **Two-Faced** | − SMALL (1772) / − MEDIUM (1856) | − LARGE | − SMALL | − MEDIUM | − SMALL | − LARGE | era-scaled (1830+ partisan-press era cost) | none in PR4b (Integrity-bump optional, defer per Open Q4) |
   | **Predictable** | + SMALL | + SMALL | + SMALL | + MEDIUM | + SMALL | + MEDIUM | flat both eras | none in PR4b (Manipulative-opp interaction is legislative — PR6) |
   | **Hale** | + SMALL (1772) / + MEDIUM (1856) | + SMALL | + SMALL | + SMALL | + SMALL | + SMALL | era-scaled (post-1840 stump era stamina demands) | **+ LARGE vs Frail opponent in presGeneral** (1840 Harrison-Van Buren — per F-HALE-VS-FRAIL-1840) |

   **Era mapping** (carry-over from PR4a AC #13): 1772 scenario plays
   `independence` then `federalism`; 1856 scenario plays `nationalism`.
   Where the table reads "1772" vs "1856", the architect emits TWO
   rows for the 1772 case (one each for `era: 'independence'` and
   `era: 'federalism'`) and ONE row for the 1856 case (`era:
   'nationalism'`), mirroring PR4a's Domestic Apathy pattern at
   `types.ts:731-735`. Architect at CP2 may collapse to a multi-era
   row shape if useful; PR4b ships the per-era rows.

   **Open Q4 sign-by-context for Two-Faced**: the table above carries
   the PM-locked answer **(b) negative everywhere with primary +
   internal-party LARGE, presGeneral / Senate medium**. Alternative
   (c) "POSITIVE small in presGeneral via median-voter triangulation"
   was historian-defensible but PM rejected as too historically
   subtle for PR4b's first cut. CP1 human can lock alternative.

### C. TRAIT_CONFLICTS additions (PR3 extension)

5. **[Locked]** PR3's `TRAIT_CONFLICTS` (`types.ts:554-569`) gains
   exactly **8 new map entries** (4 pairs × 2 directions for the
   symmetric lookup PR3 requires):

   ```
   Likable:        'Uncharismatic',
   Uncharismatic:  'Likable',
   Cosmopolitan:   'Provincial',
   Provincial:     'Cosmopolitan',
   'Two-Faced':    'Predictable',
   Predictable:    'Two-Faced',
   Hale:           'Frail',
   Frail:          'Hale',
   ```

   The d6 threshold (`TRAIT_LIFECYCLE_RULES.conflictD6Threshold = 4`)
   from PR3 applies unchanged. Any path that calls
   `tryGrantTrait(p, t)` with `t` ∈ the new traits and a conflict
   already held will d6-resolve per PR3's existing semantics.

6. **[Locked]** Historian-flagged stacking-across-pairs is REAL
   and PR4b allows it (Lincoln = Likable + Charismatic; Henry Clay =
   Likable + Charismatic + Magician). The 4 new pairs only forbid
   **within-pair** co-occurrence (a politician can't be both Likable
   AND Uncharismatic). Cross-pair stacks (Likable + Charismatic,
   Cosmopolitan + Predictable, Hale + Manipulative, etc.) are
   intended. No additional `TRAIT_CONFLICTS` entries beyond the 8
   above.

### D. oldAge.fadingPool extension (Hale per F-HALE-OPTION-B)

7. **[Locked]** PR3's `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool`
   (`types.ts:536`) gains **exactly one** new entry: `'Hale'`. PR3
   currently ships `['Celebrity', 'Charismatic']` per the conservative
   pool; PR4b appends Hale. The historian's Option B is "Hale CAN
   fade with age" — the existing PR3 mechanic (per-turn
   `chance(baseChance + ageBracketBonus)` roll at age ≥ 70, removes
   one random eligible trait via `pick`) applies to Hale unchanged.

8. **[Open @ CP1 — recommend NO age-extension]** Historian also
   floats a "Hale shifts old-age decay `minAge` up by 5 years" sub-
   option (e.g., Hale carriers don't start decaying until age 75
   instead of 70). PM recommendation: **DEFER**. The mechanic is
   appealing but a sub-spec of its own (touches
   `ABILITY_LOSS_RULES.oldAge.minAge` and PR3's
   `TRAIT_LIFECYCLE_RULES.oldAge.minAge`, with a Hale-conditional
   read at the call site). PR4b ships Hale in the fading pool at
   the same minAge=70 as everything else. Architect / human can
   pick up the age-extension in a follow-up tuning pass if Hale
   feels too sticky at playtest.

9. **[Locked]** No other new trait enters the fading pool. Likable,
   Uncharismatic, Cosmopolitan, Provincial, Two-Faced, Predictable
   are character/identity traits — they're earned in youth and
   shouldn't decay with age (e.g., a Cosmopolitan polyglot doesn't
   become Provincial via senility; a Predictable old Calhoun stays
   Predictable to his last roll-call). Hale alone fits the
   robustness-fades pattern.

### E. Seed-time mutual exclusion for the new pairs

10. **[Locked]** PR4b ensures the **4 new conflict pairs** never
    co-occur from seed. Mirror PR3's existing patterns at
    `phaseRunners.ts:769-770` (Ideologue/Impressionable mutually
    exclusive at seed via `else if`) and `:1087-1088` (Loyal/
    Opportunist same). The dataset-level seed in `seedDataset.mjs`
    is hand-authored and PM-controlled (Section H below); the
    `runPhase_2_1_1_Draft` (`phaseRunners.ts`) random off-track
    seed at line `:351` (PR3 F-RECONCILE row) and the themed-trait
    grant at line `:336` already route through `tryGrantTrait` per
    PR3 — so the conflict pairs above auto-d6-resolve. PR4b adds
    no NEW seed sites; the architect verifies that PR3's existing
    routing covers the 4 new pairs.

11. **[Locked]** Specifically for the seed-time auto-seed pass in
    `runPhase_2_1_1_Draft` (the "ideologyTraitsSeeded" /
    "conversionTraitsSeeded" pattern):
    - The new pairs do NOT need new `*Seeded` flags. None of the 7
      new traits is seeded *automatically* at draft time — they
      come from (a) the curated dataset's hand-authored traits
      (where PR4b's CURATED_ROWS attribution sets the pair-correct
      side), (b) the legislators-YAML merge, or (c) the random
      off-track grant in `runPhase_2_1_1_Draft:351` which routes
      through `tryGrantTrait`.
    - The existing themed-trait pool (`TRACK_THEMED_TRAITS` in
      `src/types.ts:171-179`) does NOT contain any of the 7 new
      traits in PR4b's locked scope (Architect verifies that the
      themed-pool is unchanged; if a future PR wants to add Likable
      to the Governing theme pool, it routes through `tryGrantTrait`
      anyway, so the d6 covers the conflict).

12. **[Locked]** The `CARPETBAGGER_LADDER` (`types.ts:216`) does NOT
    gain new entries. It currently reads
    `['Carpetbagger', 'Outsider', 'Controversial', 'Unlikable']` —
    adding Uncharismatic / Provincial would mean a relocator's
    "next penalty" could be Uncharismatic, which is a stretch
    historically (relocation doesn't make you wooden). Out of scope.

### F. Wound-grant routing through tryGrantTrait (Hale resistance)

13. **[Open @ CP1 — recommend ROUTE THROUGH `tryGrantTrait`]** PR2a's
    `revolutionaryWar.ts:99` grants `Frail` on a battle wound via
    `addTrait` (no conflict pair existed at PR2a time). PR4b now
    introduces Hale ↔ Frail. The wound-grant should route through
    PR3's `tryGrantTrait` so a Hale general's d6 can resist
    Frail-on-wound — the Jackson-carries-bullets-38-years case.

    The change is one line: replace `addTrait(victim, 'Frail')` at
    `revolutionaryWar.ts:99` with
    `tryGrantTrait(victim, 'Frail')`. The log line at `:101`
    composes from the return value (`{ granted, replaced }`) per
    PR3 AC #17 — on success: `"{name} wounded at {battle} (gains
    Frail)."` (current text); on a Hale carrier successfully
    resisting: `"{name} wounded at {battle}, but their Hale
    constitution holds — Frail does not take."` (new branch); on a
    Hale carrier failing the d6: `"{name} wounded at {battle},
    sheds Hale and gains Frail."` (new branch).

    Alternatives the human may lock at CP1:
    - **(b) Keep direct `addTrait`** — Frail silently stacks (no-op
      via dedupe is impossible since Hale is the held trait, not
      Frail; the politician would gain Frail and KEEP Hale, which
      is **incoherent** given the new conflict pair). Rejected.
    - **(c) Direct grant + remove Hale explicitly** — bypasses the
      d6, makes wound-grant deterministic (Hale → Frail always on
      wound). Loses the Jackson case's historical richness.

    PM recommendation: (a) — route through `tryGrantTrait`. Mirrors
    PR3's pattern, uses the existing helper, no special-case code.

14. **[Locked]** No other PR2a/PR3 grant sites change. The PR3
    F-RECONCILE table's `addTrait` rows for grants that have **no
    conflict pair in PR4b's expanded set** stay as plain `addTrait`.
    Specifically: `Kingmaker`, `Celebrity`, `Leadership`, `Failed
    Bid`, `Ambitious`, the Carpetbagger ladder traits — all unchanged.

### G. Cross-cutting guardrails (assert nothing leaked in)

15. **[Locked]** PR4b makes **no change to the PV formula**
    (`src/pv.ts`). The 7 new traits each carry a flat ±4 / −5 weight
    via their `POSITIVE_TRAITS` / `NEGATIVE_TRAITS` membership (AC
    #2); the existing `for (const t of p.traits)` loop in `pv.ts`
    picks them up. No new `Kingmaker`-style special case.

16. **[Locked]** PR4b makes **no change to the election arithmetic
    wiring**. PR4a's `traitVoteAdjust` helper, `calcStateVote`,
    primaries scoring, and faction-leader scoring read
    `TRAIT_ELECTION_EFFECTS` unchanged. Adding 7 new rows to the
    flat array is data-only — no engine code touches.

17. **[Locked]** PR4b adds **no new election context**. The 6 PR4a
    contexts (`presGeneral`, `presPrimary`, `house`, `senatePre17`,
    `governor`, `internalParty`) are reused exactly.

18. **[Locked]** PR4b adds **no new RNG path** beyond what PR3
    already provides. The d6 conflict roll in `tryGrantTrait` fires
    for the 4 new pairs the same way it fires for PR3's 7 pairs.
    Old-age trait decay (`runPhase_2_4_1_Deaths`) fires for Hale
    via PR3's existing `chance(baseChance)` machinery. No
    `Math.random` additions; deterministic via `src/rng.ts`.

19. **[Locked]** Save loadability: old saves load cleanly. The
    `Trait` union expansion is additive — existing politicians'
    `traits: Trait[]` arrays don't reference any of the 7 new
    members, so type validation passes. Politicians with the 7 new
    traits only exist post-dataset-regen (via fresh seed) OR after
    the engine grants them (which only happens via the regen + the
    random off-track grant in `runPhase_2_1_1_Draft:351`). A save
    from before PR4b that's loaded after PR4b will continue to
    play with the existing trait set, picking up new traits only
    via the random-grant path going forward.

20. **[Locked]** `npm run build` (tsc + vite) passes and `npm run
    lint` (tsc `--noEmit`) is clean. The expanded `Trait` union
    compiles cleanly across all union-consumer sites
    (`POSITIVE_TRAITS`, `NEGATIVE_TRAITS`, `TRAIT_ELECTION_EFFECTS`,
    `TRAIT_CONFLICTS`, `TRAIT_LIFECYCLE_RULES.oldAge.fadingPool`,
    `CARPETBAGGER_LADDER`, `TRACK_THEMED_TRAITS`, etc.). The
    `as const satisfies` exhaustiveness on the affected constants
    is preserved.

### H. Dataset regeneration — marquee attribution table

21. **[Locked]** PR4b updates `scripts/seedDataset.mjs` `CURATED_ROWS`
    with the historian's section-7 marquee attributions. The
    architect/builder pastes the additions into the existing
    `ROWS` array (matching the existing row shape:
    `[first, last, state, ideology, birthYear, [skills…], command,
    [traits], party]`), then runs the regen pipeline per CLAUDE.md
    (`bash scripts/fetchLegislators.sh && node
    scripts/legislatorsToDataset.mjs && npm run build`). PR4b does
    NOT execute the regen — the spec captures the intent; the
    architect's CP2 build does the run.

    | Name | Era | Existing seedDataset.mjs row (line) | Current traits | New trait(s) to add | Source / cite |
    |---|---|---|---|---|---|
    | Benjamin Franklin | 1772 | line 57 | `['Celebrity','Egghead']` | `Likable`, `Cosmopolitan`, `Hale` | Isaacson — "humble enquirer"; London + Paris years; active at Convention age 81 |
    | Patrick Henry | 1772 | line 42 | `['Orator','Debater']` | `Provincial` | Hanover County; refused federal office; "smelt a rat" at Convention |
    | Samuel Adams | 1772 | line 40 | `['Orator']` | `Provincial` | Boston caucus; never nationalized; "America's first professional politician" |
    | George Mason | 1772 | line 49 | `[]` | `Predictable` | Consistent republican-with-small-r objections; Mount Vernon bio |
    | George Washington | 1772 | line 55 | `['Leadership']` | `Hale` | Valley Forge survival; smallpox immunity; rode 13+ hours daily |
    | Thomas Jefferson | 1772 | line 41 | `['Egghead']` | `Cosmopolitan` | 5 years in Paris; Library of Monticello; French wines |
    | Alexander Hamilton | 1772 | line 84 | `['Egghead']` | `Cosmopolitan` | Caribbean origin + NYC merchant networks; "three distinct national mentalities" |
    | James Madison | 1772 | line 83 | `['Egghead','Reformist']` | `Uncharismatic` | "Shrill voice"; "reserved, introverted"; "wasn't an imposing public speaker" |
    | Aaron Burr | 1772 | line 85 | `['Manipulative']` | `Two-Faced` | "Fickle loyalties and duplicity"; Brands — "brazen, self-centered opportunism" |
    | Abraham Lincoln | 1856 | line 147 | `['Orator','Integrity']` | `Likable` | "The streets seemed brighter when Abraham Lincoln appeared"; Illinois yarn-spinner |
    | Stephen A. Douglas | 1856 | line 130 | `['Orator','Debater']` | `Likable`, `Frail` (already-existing trait; verify or add) | Tavern bonhomie; "Little Giant"; 1860 tour exhaustion → typhoid 1861 |
    | Andrew Johnson | 1856 | line 135 | `['Unlikable']` | `Provincial` | East TN tailor; rural-yeomanry register; never schooled |
    | Robert Toombs | 1856 | line 126 | `['Orator','Debater']` | `Provincial` | Wilkes County GA planter; Falstaffian Deep South |
    | Salmon P. Chase | 1856 | line 153 | `['Integrity','Reformist']` | `Uncharismatic`, `Predictable` | "Habitually grave"; "did not often laugh"; Republican blockages 1856/60/64 |
    | James K. Polk | 1856 | line 139 | `['Efficient']` | `Uncharismatic` | JQA — "no wit, no literature, no point of argument"; "puddle of mud" |
    | William H. Seward | 1856 | line 152 | `['Manipulative','Magician']` | `Cosmopolitan` | NY Gov; pro-immigrant; multi-continent retirement tour |
    | Charles Sumner | 1856 | line 157 | `['Orator','Reformist','Puritan']` | `Cosmopolitan`, `Predictable` | 3-year European tour; multilingual; relentless abolitionism |
    | Sam Houston | 1856 | line 138 | `['Celebrity','Military']` | `Hale` | Multiple battle wounds; TN AG → US Rep → TN Gov → TX Pres → US Sen → TX Gov |
    | Henry Clay | (not in CURATED_ROWS; will be added or merge-overridden) | n/a | n/a (in legislators YAML) | `Likable`, `Charismatic` | American Heritage 1956 — "Everybody Liked Henry Clay"; magnetism + warmth |
    | Andrew Jackson | (not in CURATED_ROWS; will be added or merge-overridden) | n/a | n/a (in legislators YAML) | `Hale` | "Old Hickory"; 38 years with bullets; ran 2-term presidency in chronic pain |
    | John Quincy Adams | (not in CURATED_ROWS; will be added or merge-overridden) | n/a | n/a (in legislators YAML) | `Hale` | 9 House terms 1831-48, age 64-81; gag-rule fight; collapsed on floor at 81 |
    | John C. Calhoun | (not in CURATED_ROWS; will be added or merge-overridden) | n/a | n/a (in legislators YAML) | `Predictable` | Within his late-Southern-rights phase, relentlessly consistent; stymied by Clay/Manipulative |
    | Daniel Webster | (not in CURATED_ROWS; will be added or merge-overridden) | n/a | n/a (in legislators YAML) | `Two-Faced` | 7th of March 1850; "Lucifer descending from Heaven"; never recovered politically |

22. **[Locked]** Stephen A. Douglas explicitly does NOT get
    `Two-Faced` despite the Kansas-Nebraska / Lecompton reversals.
    Per the historian's section 6 caveat: Douglas's flips were
    "situationally tactical, not characterological," and stacking
    Two-Faced on Magician + Charismatic + Likable would over-attribute
    the marquee figure. PM-locked: Douglas keeps his PR4a
    attributions plus Likable plus (debatably) Frail; no Two-Faced.

23. **[Locked]** Henry Clay / Andrew Jackson / JQ Adams / Calhoun /
    Webster are NOT currently in `seedDataset.mjs` `CURATED_ROWS`
    (verified via grep). They reach the dataset via the legislators
    YAML merge in `scripts/legislatorsToDataset.mjs`. PR4b's
    architect has **two options** at CP2 for these 5 figures:
    - **(a)** Add them as new `CURATED_ROWS` entries with the new
      traits in the `[traits]` array (the merge precedence in
      CLAUDE.md says "CURATED_ROWS overrides same-named dataset
      entries"). Recommended — more readable and self-documenting.
    - **(b)** Add a separate "trait patch" mechanism in
      `legislatorsToDataset.mjs` that bolts new traits onto matching
      YAML-sourced figures by name+birthYear key. More fragile;
      requires the architect to implement a new pipeline step.

    PM recommendation: **(a)** — add CURATED_ROWS entries. The
    skill/ideology values for those 5 are easy to author from public
    biographical sources (the architect picks reasonable values
    informed by PR4a's existing attributions for them); the
    trait list carries the PR4b content.

24. **[Locked]** Dataset side-effects on the merge:
    - The new CURATED_ROWS additions (per row 23 (a)) override
      same-named YAML entries (merge precedence rule from
      `CLAUDE.md`).
    - The 7 new traits in the curated rows pass through
      `splitTraits` in `seedDataset.mjs:31` unchanged (none of
      Likable / Uncharismatic / Cosmopolitan / Provincial /
      Two-Faced / Predictable / Hale is in `EXPERTISE_NAMES`).
    - Sub-floor stats for failed candidates / era figures rule
      (CLAUDE.md "dataset rules") still applies for any newly-added
      era figure: if Calhoun is added as CURATED_ROWS but he served
      in Congress (he did), he reaches the curated path with
      full electoral stats, not sub-floor.

25. **[Locked]** The CSV diff after regen will be substantial — a
    handful of figures change traits, and the JSON/CSV/TS
    fallback all need to regenerate. PR4b's CP2 review must
    spot-check 5-10 of the marquee attributions in the regenerated
    `politicians-dataset.csv` to confirm the new traits landed.
    `npm run build` must still pass after regen.

## Edge cases

- **Politician with NONE of the 7 new traits.** PR4a's
  `traitVoteAdjust` per AC #4 already iterates `p.traits` and
  skips traits with no `TRAIT_ELECTION_EFFECTS` entry. The 7 new
  rules are additive — a politician carrying only old traits
  experiences zero change from PR4b. Old saves play unchanged
  until natural trait grants fire.

- **Politician with multiple new traits.** Same additive stacking
  semantics as PR4a AC #6's "multiple PR4a traits" case. A
  Lincoln-style Likable + Integrity + Orator gets all three
  bonuses summed. A Burr-style Manipulative + Two-Faced gets the
  PR4a Manipulative-by-context (PR4a doesn't wire Manipulative,
  but does pass through it) plus the new Two-Faced negative.
  Intended.

- **Politician with one trait of two PR4b new pairs simultaneously
  (e.g. Likable + Cosmopolitan).** Allowed and intended. Both
  contribute their per-context magnitudes. Franklin is the
  canonical case (Likable + Cosmopolitan + Hale per row 21);
  Henry Clay is even broader (Likable + Charismatic + Magician).
  No additional `TRAIT_CONFLICTS` entries forbid this.

- **Hale carrier reaching old-age decay (the test case).** A
  Hale-carrier politician hitting age 70+ rolls per PR3's
  `oldAge.baseChance + ageBracketBonus`. If the roll fires AND
  `Hale` is the chosen trait via `pick(eligible)`, `removeTrait`
  fires and the log line reports "their Hale constitution wanes."
  After Hale is shed, subsequent battle wounds via the
  `tryGrantTrait` route (AC #13) no longer have Hale resistance.
  This is the Jackson late-career decline pattern: Hale buys
  years, doesn't buy immortality.

- **Hale + Frail mid-game collision (the PR4b headline case).**
  Per AC #13 and the new TRAIT_CONFLICTS pair, a Hale general
  taking a battle wound (`revolutionaryWar.ts:99`) triggers
  `tryGrantTrait(victim, 'Frail')`. PR3's `tryGrantTrait`
  detects the conflict, rolls d6, and either replaces Hale with
  Frail (d6 ≥ 4) or no-ops (d6 < 4). On d6 < 4, the politician
  is wounded but stays Hale (the Jackson result). On d6 ≥ 4, the
  Hale is shed and Frail is gained (the "this wound finally took
  the fight out of him" case).

- **Cosmopolitan + Provincial seed collision via dataset.** If the
  dataset accidentally lists both (incoherent), the engine reaches
  `runPhase_2_1_1_Draft`; PR4b's seed-time mutual-exclusion AC #10
  + PR3's `tryGrantTrait` routing ensures only one persists in any
  legitimate path. For directly-imported dataset rows, the
  importer at `data/draftImport.ts:26,223` uses direct
  `traits.push` per PR3 F-RECONCILE — meaning the dataset is the
  single source for these and PR4b relies on the historian's
  attribution table being self-consistent. PM responsibility:
  the table in AC #21 has no within-pair collisions (verified
  visually).

- **Era boundary at scenario transitions.** The 1772 scenario
  evolves `independence → federalism`; the 1856 scenario stays in
  `nationalism`. Cosmopolitan / Provincial / Two-Faced / Hale's
  era-scaled magnitudes (AC #4) match PR4a's Domestic Apathy
  pattern: per-era rows, read at race time. A politician with
  Cosmopolitan who lives through the 1772 → federalism transition
  carries `+ SMALL` in `independence` and `+ SMALL` in
  `federalism` — same magnitude across the early era — but a
  hypothetical bridge into `nationalism` (which AMPU does not
  currently scenario-bridge) would bump to `+ MEDIUM`. PR4b
  doesn't model the bridge.

- **Hale + Old-age trait decay vs PR2a's Old-age ABILITY decay
  collision.** Per PR3 Edge case: both events are independent
  rolls in `runPhase_2_4_1_Deaths`. A 90-year-old Hale general
  can lose Hale AND a step of `command` in one tick. Intended
  high-end decline drama.

- **Frail + PR3's existing fading pool.** `Celebrity` and
  `Charismatic` are in the fading pool today. Hale joins them.
  Frail is NOT in the fading pool (Frail is a negative trait
  granted by battle wounds; fading it would be illogical —
  Frail is the "wounds + age caught up" state, not the
  "I was once Frail but recovered" state). Confirms PR4b
  doesn't touch Frail except via the conflict pair.

- **Predictable + Manipulative interaction at election time.** The
  canonical source describes Predictable's "easily stymied by a
  Manipulative opposing Speaker" as a *legislative* dynamic. PR4b
  does NOT wire this into the election layer — it's PR6
  territory. Predictable in PR4b is flat-positive across contexts.

- **CPU vs. player politicians.** All effects fire for every
  politician — the 7 new traits, the d6 conflict resolution, and
  Hale-fading apply uniformly. The data stays consistent for
  downstream PRs.

- **Save migration concern: a politician seeded with both Hale and
  Frail from before-PR4b (impossible — Hale didn't exist).** Old
  saves cannot have any Hale-carrying politician (Hale was not in
  the union). On save load post-PR4b, this is a non-issue: the
  old saved `traits[]` arrays carry only the pre-PR4b 38 traits.
  Old saves continue to play; new dataset (post-regen) gives the
  new traits to fresh draftees.

## Out of scope

Named explicitly so the architect does not pull adjacent or later-PR
work into PR4b:

- **Any new traits beyond the 7.** Iron Fist, Bookkeeper, Lawful,
  Geostrategist, Crisis Admin / Crisis Gov, Domestic Warrior,
  Decisive General, Delegator, Disharmonious, Easily Overwhelmed,
  Illicit, Incoherent, Jurisprudence, Lackey, Late Bloomer,
  Everyman, Master Kingmaker, Micromanager, Military Leader, Naive
  Strategist, Overeager, Pliable, Southern Unionist, Teflon — all
  PR6 / Trait Pass B content.
- **Orator-polish as a new trait.** F-ORATOR-POLISH-DEFER. Per-
  context Orator magnitude tweaks may happen in a future
  refinement pass; PR4b does nothing.
- **Reworking PR4a's 15-trait magnitudes.** Untouched.
- **Adding new election contexts.** PR4a's 6 are reused exactly.
- **Election arithmetic changes.** PR4a's `calcStateVote` and
  helper wiring are read-only here.
- **PV formula changes.** The 7 new traits use the existing flat
  ±4 / −5 weights via `POSITIVE_TRAITS` / `NEGATIVE_TRAITS`
  membership.
- **Anytime events / era events that grant the new traits.** A
  future Trait Pass content PR can add a "lecture tour boosts
  Cosmopolitan" or "wave election bumps Likable" anytime template;
  PR4b adds none.
- **Cabinet expertise gating using new traits.** PR5 territory.
- **A "Hale slows OTHER decay" mechanic (Option C).** Historian-
  rejected as scope-thin and out-of-scope. Hale Option B (fading
  pool) is the locked path.
- **A scenario-conditional UI label rendering layer (Open Q1, Q2).**
  Polish PR; PR4b keeps the code labels (Cosmopolitan,
  Uncharismatic) per PR4a's Carpetbagger precedent.
- **Region-conditional Cosmopolitan / Provincial in `presGeneral`
  per state (Open Q6).** Historian flags Northern vs Southern
  legislatures responded oppositely. Implementing per-state
  region-conditional magnitudes is a larger lift; PR4b ships
  era-scaled flat magnitudes and defers state-region modulation.
- **Hale age-extension on minAge (Open Q8 / AC #8).** "Hale shifts
  old-age decay minAge up by 5" is a sub-mechanic; PR4b ships Hale
  in the fading pool at the same minAge as everything else.
- **Two-Faced opp-conditional vs Integrity.** Historian flagged it
  as defensible (mirroring PR4a's Scandalous-vs-Integrity bump);
  PR4b defers per Open Q4 — Two-Faced is already negative MEDIUM /
  LARGE; adding an opp-conditional bump would push past LARGE on
  the bands which PR4a doesn't have. Architect-deferable.
- **Region-aware Provincial bump in `presGeneral`** ("Provincial in
  own region vs Cosmopolitan opponent"). PR4b ships flat era-
  scaled magnitudes; per-state region modulation is a future PR.
- **Failed-candidate sub-floor adjustments** for newly-added
  CURATED_ROWS (CLAUDE.md). PR4b's marquee figures all served in
  Congress — no sub-floor needed.
- **Updating draft pages / roster UI / faction page** to display the
  7 new traits with tooltips. The traits surface automatically via
  the existing trait column; no new UI surface in PR4b.

## Open questions / assumptions

Decision-first ordering. Q1-Q5 are CP1 (human/PM locks at checkpoint).
Q6-Q9 are CP2 (architect-deferable).

1. **(CP1 — Cosmopolitan code label per F-COSMOPOLITAN-ANACHRONISM.)**
   Historian flags "Cosmopolitan" word as 1844 OED — borderline for
   1772 era specifically, clean for 1856. PM recommendation: **KEEP
   the code label `Cosmopolitan`.** Modern players accept it; UI
   label per scenario is future polish. Mirrors PR4a's
   `Carpetbagger` precedent. Alternatives the human may lock at CP1:
   - (b) Rename code label to `Worldly` — touches the Trait union,
     CURATED_ROWS, `TRAIT_ELECTION_EFFECTS`, `TRAIT_CONFLICTS`, and
     every downstream reference. Larger surface but more era-honest.
   - (c) Scenario-conditional UI label rendering — polish PR, not
     load-bearing.
   PM rec: **(a) KEEP `Cosmopolitan`**.

2. **(CP1 — Uncharismatic code label per F-UNCHARISMATIC-
   ANACHRONISM.)** Historian flags "charisma" as ~1920 Weber-era
   word. PM recommendation: **KEEP the code label `Uncharismatic`**
   for parallel naming with `Charismatic`. Alternatives:
   - (b) Rename to `Flat`, `Wooden`, `Unmagnetic`, or `Cold` — better
     era-fit but breaks parallel-naming with Charismatic.
   PM rec: **(a) KEEP**.

3. **(CP1 — Hale-vs-Frail opp-conditional magnitude in
   presGeneral.)** Per F-HALE-VS-FRAIL-1840. PM recommendation:
   **(b) `+ MEDIUM` base, bumped to `+ LARGE` vs Frail opponent in
   presGeneral.** Mirrors PR4a's Unlikable-vs-Charismatic pattern.
   Alternatives:
   - (a) Base `+ LARGE` bumped `+ VERY_LARGE` — would require a new
     band beyond PR4a's SMALL/MEDIUM/LARGE. PM rejected.
   - (c) Hale flat `+ SMALL` no opp-conditional — loses the
     historian's headline finding.
   PM rec: **(b)**.

4. **(CP1 — Two-Faced sign-by-context.)** Historian observes
   Two-Faced is negative in primary (party loyalists hate it),
   possibly positive in some general contexts (median-voter
   triangulation), and neutral-or-positive in `internalParty`
   (machine politicians value flexibility). PM recommendation:
   **(b) NEGATIVE everywhere with primary + internal-party LARGE,
   presGeneral + senatePre17 MEDIUM (1856 era), SMALL (1772 era).**
   The Webster's-7th-of-March / Burr cases both punished Two-Faced
   in general elections and conventions; the "median voter
   triangulation" reading is too subtle for first cut. Alternatives:
   - (a) Two-Faced NEGATIVE everywhere flat — architect-friendly.
   - (c) Two-Faced NEGATIVE in primary, FLAT in internalParty,
     small POSITIVE in presGeneral — most historically nuanced.
   PM rec: **(b)**. Architect at CP2 may revisit.

5. **(CP1 — Wound-grant routing through `tryGrantTrait`.)** Per
   AC #13. PM recommendation: **(a) ROUTE through `tryGrantTrait`**.
   Mirrors PR3's pattern, uses existing helper, captures the
   Jackson case (Hale d6-resistance to Frail-on-wound).
   Alternative: keep direct `addTrait` (silently incoherent given
   the new conflict pair) — rejected.

6. **(CP2-deferable — Region-conditional Cosmopolitan / Provincial
   in presGeneral.)** Historian notes Northern vs Southern
   legislatures responded oppositely to Cosmopolitan candidates
   (Seward 1860). Implementing per-state region modulation would
   require state ideology / region signals in the magnitude lookup
   — bigger lift. PR4b ships flat era-scaled magnitudes per AC #4.
   Architect / human can pick up region modulation in a future
   tuning PR.

7. **(CP2-deferable — Add Calhoun / Clay / Jackson / JQ Adams /
   Webster as `CURATED_ROWS` vs. trait-patch mechanism.)** Per
   AC #23. PM recommendation: **(a) add as `CURATED_ROWS` entries**.
   More readable and self-documenting; the merge precedence rule
   handles override of any same-named YAML entries. Architect at
   CP2 may pick the alternative trait-patch path if it earns its
   keep; recommendation is straightforward CURATED_ROWS.

8. **(CP2-deferable — Hale age-extension on `oldAge.minAge`.)** Per
   AC #8. Historian floats "Hale shifts old-age decay minAge up by
   5 years" as a sub-option. PM recommendation: **DEFER**. PR4b
   ships Hale in the fading pool at the same minAge=70 as everything
   else. Architect / human may pick up the age-extension in a
   follow-up tuning pass if Hale-carriers feel too brittle at
   playtest.

9. **(Assumption — Provincial / Cosmopolitan in `senatePre17`
   magnitudes.)** PR4b ships Cosmopolitan `+ SMALL` in 1856
   `senatePre17` (state legs in MA / NY responded to Sumner /
   Seward) and `NONE` in 1772 (state legs more locally focused
   pre-1820). Provincial `+ SMALL` in `senatePre17` both eras
   (Johnson 1857, Toombs 1853 — Provincial Senate wins via state-
   leg). Architect may adjust at CP2 if playtest reads off.

10. **(Assumption — Two-Faced era-scaling severity.)** PR4b ships
    Two-Faced as 1772-`SMALL` / 1856-`MEDIUM` in `presGeneral`
    and `senatePre17`; flat `LARGE` in `presPrimary` and
    `internalParty` across both eras (party regulars / convention
    delegates hate flip-flops in any era). The 1840+ partisan-press
    exposure is captured in the popular-vote-context era split.

11. **(Assumption — Dataset regen carries no schema changes.)** The
    regen pipeline output (`public/standard-draft-classes.json`,
    `politicians-dataset.csv`, `src/data/defaultDraftClasses.ts`)
    keeps the same column / field shape. PR4b only adds new
    string values to the `traits` column; the regen scripts handle
    new trait names transparently.

12. **(Assumption — No UI / tooltip work.)** The 7 new traits
    surface only via the existing trait column on the roster page
    and the existing election log (which PR4a wires to summarize
    trait-driven swings). No new modal, tooltip, or polish surface
    in PR4b. A "trait glossary" UI is deferred.

13. **(Assumption — Stephen Douglas Frail attribution.)** Per row
    21's note "Stephen A. Douglas | … `Frail` (already-existing
    trait; verify or add)" — Douglas's 1860 tour exhaustion → 1861
    typhoid death at 48 makes him a Frail case historically.
    Existing `seedDataset.mjs:130` does not assign Frail; PR4b's
    CURATED_ROWS update adds Frail (alongside Likable). Architect
    confirms at CP2 (this is a small attribution tweak; if the
    seeded `command=4` reading suggests Douglas should stay
    non-Frail, architect drops it — but the historian's text
    strongly suggests the Frail attribution).

---

**Spec file:** `/home/user/AMPU/docs/specs/trait-pass-b-new-traits.md`
