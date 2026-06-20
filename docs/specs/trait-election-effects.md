# Spec: Trait Pass A — Election Effects (PR4a)

## Vision (as given)

Fifth slice of the abilities / expertise / traits alignment epic. PR1
(expertise axis), PR2a/PR2b (ability lifecycle), and PR3 (trait loss + d6
conflict) have merged. PR3 wired the **lifecycle** machinery (`addTrait` /
`removeTrait` / `tryGrantTrait` and the `TRAIT_CONFLICTS` table for
`Charismatic ↔ Unlikable`, `Integrity ↔ Corrupt`, etc.) but explicitly left
the **election arithmetic** flat: every positive trait still contributes
+4 PV and every negative trait −5 PV in `pv.ts:65–87`, and `calcStateVote`
reads PV as a single scalar. The result: 15 traits AMPU seeds (Charismatic,
Integrity, Debater, Propagandist, Unlikable, Puritan, Harmonious,
Numberfudger, Magician, Domestic Apathy, Scandalous, Controversial,
Obscure, Carpetbagger, Outsider) are **decorative** outside their PV nudge.
A `Debater` in a pre-17th-Amendment Senate race should beat a non-Debater
*because* the seat is decided by ~100 legislators who hear the speech, not
because the politician's PV is +4. PR4a turns those 15 traits into
**context-aware** election effects (per office × era × race-type) wired
into `calcStateVote`, the primaries phase, and the faction-leader scoring
path — keeping the PR3 lifecycle untouched but giving every trait a
mechanical job in the right race.

## Historical grounding (binding)

Source of mechanics: `docs/research/source-abilities-expertise-traits.md`
(BINDING design reference — the 15 trait flavor descriptions at
`source.md:128–263`). Source of era/context grounding:
`docs/research/trait-election-effects-historical-context.md` (the
historian's brief for PR4a). Source of scope:
`docs/research/abilities-expertise-traits-gap-analysis.md` ("System 3 —
Traits", "Decorative" row of 29). Locked reconciliation decisions D1–D4
carry through unchanged from PR1/PR2/PR3.

**Binding facts carried from the historian's brief:**

- **F-SENATE-BOTH-ERAS (historian, headline #1).** Pre-17th-Amendment
  Senate is **state-legislature voting in BOTH the 1772 and 1856
  scenarios.** Charismatic, Outsider, Scandalous, and Carpetbagger must be
  **substantially dampened** in Senate context; Magician, Debater,
  Harmonious, and (deadlock-) Obscure must be **amplified** there. This is
  the load-bearing per-context gate for PR4a.
- **F-PRIMARIES-AS-CONVENTIONS (historian, headline #2).** AMPU's "2.9.1
  Primaries" phase models the **party convention process** for both eras
  (modern primaries are post-1900). Treat 2.9.1 as the convention
  abstraction — Magician, Harmonious, and (deadlock-) Obscure get their
  historically-justified bonus there; Charismatic/Debater matter but less
  than in popular elections. (PR4a does **not** rename the phase.)
- **F-NEGATIVE-MAGNITUDES-NONFLAT (historian, headline #3 — the
  highest-impact balance fact).** The Hamilton-1797 (career-ending
  Scandalous) vs. Jackson-1828 (Scandalous shrugged off) contrast proves
  the existing flat −5 PV for negative traits is the wrong shape. PR4a
  must give negative traits **context-conditional magnitudes** — large in
  Pres-Gen when the opponent has `Integrity` or the politician lacks
  party-machine cover; small in pre-17 Senate or convention contexts
  where the political class internalizes the scandal. The new layer is
  **additive on top of** the existing flat ±4/−5 PV weights (see
  F-PV-INTERACTION below); the flat layer stays.
- **F-CARPETBAGGER-ANACHRONISM (historian, "Carpetbagger" + anachronism
  table).** The TERM is Reconstruction-only (first use 1867). The
  MECHANIC (non-resident penalty in Governor / House / pre-17 Senate)
  fits both eras and integrates with the existing
  `RELOCATION_ODDS` / `CARPETBAGGER_LADDER` (`src/types.ts`). PR4a keeps
  the label in code (display-only consideration deferred — see Open Q1)
  and wires the mechanic per-context.
- **F-DOMESTIC-APATHY-ERA-SCALED (historian, "Domestic Apathy").** The
  trait should cost MORE in the 1856 window (slavery/tariff dominate) than
  the 1772 window (foreign affairs / Federalist-era diplomacy salient).
  PR4a's magnitude table is era-aware for this trait only.
- **F-DEBATER-EPISODE-BOUND (historian, "Debater" + Open Q4).** Debater
  historically bit only in years with a documented debate event (Lincoln-
  Douglas 1858, Webster-Hayne 1830). AMPU has no debate-event tag today.
  PR4a treats every contested Senate race (both eras) and every
  presidential general as a debate-bearing context (the trait fires at
  flat magnitude), and **does not** add a year-gating mechanism (see
  Open Q3 — recommend defer to a future "Debate Events" PR).
- **F-PV-INTERACTION (locked context).** `pv.ts` keeps the flat ±4 / −5 /
  +6-Kingmaker trait weights — PR4a does **NOT** delete them. The new
  context-aware bonuses layer **additively** on the existing `calcStateVote`
  score *after* PV is computed, so trait effects fire on top of PV (the
  candidate at higher PV still has the structural advantage; the
  per-context trait swing makes the *right* candidate win at the margin).
  This is the lower-load-bearing choice — preserves all PR1/PR2/PR3 PV
  semantics and faction-leader scoring untouched. Architect may revisit
  at CP2 (see Open Q5).
- **F-DETERMINISM (CLAUDE.md).** Engine code must use `src/rng.ts` for any
  roll — never `Math.random`. PR4a adds **no new RNG path** (the trait
  effects are deterministic functions of the politician's traits + the
  race context). Note: `calcStateVote` at `phaseRunners.ts:3281` has a
  pre-existing `Math.random` noise term — out of scope for PR4a; the
  trait-effect layer adds no `Math.random` of its own.

## Player experience

The 15 traits AMPU seeds finally **matter** in the elections they're
historically built for. A `Debater` with `Integrity` running for an 1858
Senate seat against a `Scandalous` opponent now wins the state legislature
math the way Lincoln's debating against Douglas's Reynolds-style baggage
did — not because PV ticked up, but because the state-legislature context
amplifies Debater and Integrity while dampening the popular-vote
Scandalous penalty. An obscure dark-horse like Pierce in 1852 now
benefits from `Obscure` in a deadlocked convention (the 2.9.1 primaries
phase) where the trait's "few enemies" reading historically helped. A
Carpetbagger running for Governor in a state they relocated to gets a
visible vote-share haircut, where today they get a generic PV nudge. The
player feels the *shape* of each trait in the right race — a Magician's
internal-floor advantage, a Charismatic's Governor/House upside, a
Puritan's convention dead-end — instead of a uniform ±PV. Election
results stay PV-driven on average, with trait swings as the
"this race is different" texture.

## User story

As a player drafting and developing politicians across decades, I want
the **15 election-facing traits** AMPU already gives my politicians
(Charismatic, Integrity, Debater, Propagandist, Unlikable, Puritan,
Harmonious, Numberfudger, Magician, Domestic Apathy, Scandalous,
Controversial, Obscure, Carpetbagger, Outsider) to produce **context-
aware swings** in the elections they were built for — large in the right
race, small or neutral in the wrong one — so the trait pool I draft
around shapes my campaign strategy rather than just blurring into PV.

## Scope of THIS spec (PR4a — election effects for the 15 listed traits)

PR4a covers:
- **(A)** A new typed const `TRAIT_ELECTION_EFFECTS` in `src/types.ts`
  capturing per-trait × per-context × per-era magnitudes for the 15
  listed traits (mirroring `TRAIT_LIFECYCLE_RULES` / `ABILITY_EARN_RULES`
  / `OFFICE_EXPERTISE` shape per PR1/PR2b/PR3 convention).
- **(B)** A small set of **race contexts** the engine recognizes
  explicitly (presidential general, presidential primary/convention,
  House, pre-17 Senate, Governor, internal-party / faction-leader /
  committee-chair scoring).
- **(C)** Wiring the lookup into `calcStateVote` and the primaries / 
  faction-leader paths so each fired trait effect produces a deterministic
  vote-share/score delta plus a log line.
- **(D)** Symmetric handling for the PR3 conflict pairs (Charismatic ↔
  Unlikable, Integrity ↔ Corrupt) — when PR3's `tryGrantTrait` swaps a
  trait, the next election arithmetic immediately reflects the new
  effect.
- **(E)** One opponent-conditional bonus: `Integrity` and `Scandalous` /
  `Controversial` get a magnitude bump when matched against each other
  (the F-NEGATIVE-MAGNITUDES-NONFLAT case the historian flagged).

PR4a does **NOT** cover (per the user's "OUT of scope" list — PM
enforces strictly):
- **Adding any NEW traits** — Likable, Uncharismatic, Cosmopolitan,
  Provincial, Two-Faced, Predictable, Hale, Orator-polish. **PR4b.**
- **Adding new conflict pairs to `TRAIT_CONFLICTS`** — PR4b.
- Trait union expansion of any kind.
- Draft dataset regeneration (the seed dataset already carries the 15
  traits; PR4a only changes what the engine *does* with them).
- Cabinet expertise gating (PR5).
- Lobby → industry wiring (PR7).

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human/architect
resolves at checkpoint; PM recommendation in parentheses). The headline
`[Open @ CP1]` is Q1 (Carpetbagger label era-rename) and Q3 (Debater
year-gating). All other open items are CP2 architect-deferable.

### A. Tuning const + helper (mirror PR1 / PR2a / PR2b / PR3)

1. **[Locked]** A new tuning const `TRAIT_ELECTION_EFFECTS` is added to
   `src/types.ts` (placed near `TRAIT_LIFECYCLE_RULES`, `as const
   satisfies …` like its neighbors). It holds the per-trait × per-
   context × per-era magnitudes for the 15 listed traits — no magic
   numbers in `calcStateVote`, the primaries path, or the faction-leader
   path. Architect may pick the exact internal shape (`Record<Trait,
   Record<Context, Magnitude>>` is one option; a flat array of rules
   `{ trait, context, era?, magnitude }` is another) — the
   *names* of the contexts and magnitudes are locked in AC #2/#3 below.

2. **[Locked]** The set of **election contexts** the engine recognizes is
   fixed at exactly six:
   - `presGeneral` — `runPhase_2_9_4_PresidentialGeneral` per-state
     tally in `calcStateVote`.
   - `presPrimary` — `runPhase_2_9_1_Primaries` per-party candidate
     scoring (treated per F-PRIMARIES-AS-CONVENTIONS as the convention
     abstraction; historian gates apply).
   - `house` — `runPhase_2_9_6_Congressional` House loop per-district
     `calcStateVote` call.
   - `senatePre17` — `runPhase_2_9_6_Congressional` Senate loop per-class
     `calcStateVote` call **AND** any future direct-Senate-election logic
     (the gating per F-SENATE-BOTH-ERAS applies to both AMPU scenarios
     because both predate the 17th Amendment — neither scenario reaches
     1913). Architect treats every Senate `calcStateVote` call as
     `senatePre17` in PR4a; no era branch is required.
   - `governor` — `runPhase_2_9_5_Governors` per-state `calcStateVote`
     call.
   - `internalParty` — the faction-leader scoring path
     (`runPhase_2_2_3_FactionLeaders` `scoreOf` at
     `phaseRunners.ts:1907–1918`) and the committee-chair top-1 sort
     (`runPhase_2_2_2_Committees`). This is the convention/internal-floor
     bucket where Magician, Harmonious, and Debater shine and Outsider /
     Puritan / Unlikable take their largest hit.

3. **[Locked]** The magnitude "bucket" vocabulary is fixed at exactly four
   bands. Architect picks the exact numeric value per band within
   `TRAIT_ELECTION_EFFECTS` at CP2; the PM-supplied per-trait table (per
   AC #6 below) names the bucket, not the exact number:
   - `NONE` — no effect (the trait is neutral in this context).
   - `SMALL` — recommend ~1–2% vote-share swing on `calcStateVote`'s
     pct, or ~1–3 score points on the faction-leader path.
   - `MEDIUM` — recommend ~3–5% / ~5–10 score points.
   - `LARGE` — recommend ~6–10% / ~10–20 score points.
   The architect's exact-numeric choice is the headline CP2 dial; the
   PM-recommended starting values are `SMALL = 2`, `MEDIUM = 4`, `LARGE
   = 8` (percent for vote share; same number applied as score delta on
   the internal-party path).

4. **[Locked]** A pure helper function (recommend new module
   `src/engine/electionEffects.ts` if it earns its keep — see Open Q2)
   exposes a single function:
   `traitVoteAdjust(p: Politician, ctx: ElectionContext, era: Era,
   opponent?: Politician): number` returning the **summed** vote-share
   adjustment from the politician's traits for the given context. The
   function is **pure** (no `addLog`, no RNG, no PV mutation), reads
   `TRAIT_ELECTION_EFFECTS` for each held trait, applies the era
   multiplier where the table flags era-scaling (Domestic Apathy is the
   only one in PR4a — see AC #6), and applies the opponent-conditional
   bonus for `Integrity` × tainted-opponent (AC #15). Callers
   (`calcStateVote`, primaries, faction-leader scoring) add the returned
   number to their score and log per-trait via AC #16.

5. **[Locked]** No new field on `Politician` or `GameState`. No
   `repair()` change. PR4a only reads the existing `traits: Trait[]`
   array via the new helper. Save compatibility is automatic — old
   saves immediately benefit from the new effects on their next
   election cycle.

### B. The 15-trait per-context magnitude table (the core of the spec)

6. **[Locked]** `TRAIT_ELECTION_EFFECTS` ships the following per-trait ×
   per-context magnitudes (the PM-supplied directional table; architect
   picks exact numbers within the band at CP2):

| Trait | PV today | Pres-Gen | Pres-Primary (convention) | House | Senate (pre-17) | Governor | Internal-Party | Era restriction | Conflict-pair note |
|---|---|---|---|---|---|---|---|---|---|
| **Charismatic** | +4 PV | + MEDIUM | + SMALL | + SMALL | + SMALL | + MEDIUM | + SMALL | both eras | **PR3 swap target of Unlikable** — F-PV-INTERACTION flat +4 still applies on top |
| **Integrity** | +4 PV | + SMALL (+MEDIUM vs tainted opp — AC #15) | + SMALL | + SMALL | + SMALL | + SMALL | + SMALL | both eras | **PR3 swap target of Corrupt** (out-of-scope 15-list; flat +4 PV applies) |
| **Debater** | +4 PV | + MEDIUM | + MEDIUM (convention floor fight) | + SMALL | + MEDIUM (Lincoln-Douglas model) | + SMALL | + LARGE (Webster-Hayne) | both eras | none in PR4a (Predictable pair is PR4b) |
| **Propagandist** | +4 PV | + MEDIUM | + SMALL | + SMALL | + SMALL | + SMALL | + SMALL | both eras (concept-native — historian's anachronism flag concerns the term, not the mechanic) | none in PR4a |
| **Harmonious** | +4 PV | + SMALL | + MEDIUM (consensus archetype) | + SMALL | + MEDIUM (state legs prize compromise) | + SMALL | + MEDIUM (Pierce 1852) | both eras | **PR3 swap target of Puritan** |
| **Magician** | +4 PV | + SMALL | + MEDIUM (Van Buren / dark-horse mechanics) | + SMALL | + LARGE (Douglas 1858 — state-leg math) | + SMALL | + LARGE (floor-fight math) | both eras | none in PR4a |
| **Unlikable** | −5 PV | − MEDIUM (− LARGE vs Charismatic opp) | − MEDIUM | − SMALL | − SMALL | − SMALL | − MEDIUM | both eras | **PR3 swap target of Charismatic** — flat −5 PV still applies on top |
| **Puritan** | −5 PV | − SMALL | − MEDIUM (consensus blocker) | − SMALL | − MEDIUM | − SMALL | − MEDIUM | both eras | **PR3 swap target of Harmonious** |
| **Numberfudger** | +4 PV (currently classed positive, see Edge case) | − SMALL | NONE | − SMALL | NONE | − SMALL | NONE | both eras | none in PR4a — historian flagged thin examples; magnitudes intentionally low |
| **Scandalous** | −5 PV | − MEDIUM (− LARGE vs Integrity opp — F-NEGATIVE-MAGNITUDES-NONFLAT) | − SMALL | − MEDIUM (district sticky) | − SMALL (legislators internalize it) | − MEDIUM | − SMALL | both eras | opponent-conditional bonus per AC #15 |
| **Controversial** | −5 PV | − MEDIUM (− LARGE vs Integrity opp) | − SMALL | − SMALL | − SMALL | − SMALL | − SMALL | both eras | opponent-conditional bonus per AC #15 |
| **Obscure** | −5 PV | − MEDIUM | + SMALL (Pierce dark-horse — see Edge case) | − MEDIUM | NONE (legislators know everyone) | − MEDIUM | − SMALL | both eras | none in PR4a |
| **Domestic Apathy** | −5 PV | − SMALL (1772) / − MEDIUM (1856) | NONE | − MEDIUM | NONE | − MEDIUM | NONE | **era-scaled** per F-DOMESTIC-APATHY-ERA-SCALED | none in PR4a |
| **Carpetbagger** | −5 PV | NONE | NONE | − MEDIUM (only if `p.state !== p.birthState`) | − SMALL (state legs know) | − MEDIUM (only if `p.state !== p.birthState`) | NONE | both eras (label anachronism per F-CARPETBAGGER-ANACHRONISM; mechanic fine) | none in PR4a |
| **Outsider** | −5 PV | + SMALL (anti-establishment mood; see AC #14) | − MEDIUM (party regulars are the establishment) | + SMALL | − MEDIUM (legislators are the establishment) | + SMALL | − MEDIUM | both eras (concept partial-fit for 1772, full-fit for 1856 per historian) | none in PR4a |

   The architect picks the exact `SMALL / MEDIUM / LARGE` numeric
   values per band at CP2 (AC #3). The PM's per-trait per-context
   directional choice is **locked**; the *magnitudes* are
   architect-tunable within the band.

### C. Wiring the lookups into the election arithmetic

7. **[Locked]** `calcStateVote` (`phaseRunners.ts:3271–3291`) is the
   primary wire site. After computing the existing `score` (line
   3281) for each candidate, the architect calls
   `traitVoteAdjust(c, ctx, era, opponent)` and adds the result to
   `score`. The `ctx` argument is determined by the caller: phase
   `2.9.4` passes `presGeneral`; phase `2.9.6` Senate loop passes
   `senatePre17`; phase `2.9.6` House loop passes `house`; phase
   `2.9.5` passes `governor`. The `opponent` argument (for AC #15) is
   the other candidate in the 2-person race (`calcStateVote` always
   receives a 2-candidate `candidates` array in current usage; if
   future logic passes >2, the helper sums Integrity bonuses across
   all opponents).

8. **[Locked]** `calcStateVote` callers must thread the context. The
   architect must add an `ElectionContext` parameter to
   `calcStateVote` (or a sibling wrapper) so the four callers
   (lines 3312, 3364, 3428, 3448 per current code) each pass the
   correct context label. **No new RNG path; no `Math.random`
   additions in PR4a's layer.** The pre-existing `Math.random` noise
   at line 3281 is out of scope (PR3 noted it remains; PR4a does
   not relitigate).

9. **[Locked]** `runPhase_2_9_1_Primaries`
   (`phaseRunners.ts:3293–3303`) gets a parallel trait-effect layer.
   The existing scoring (`b.pvCache + b.command * 5`) is **kept
   unchanged**; the architect adds `traitVoteAdjust(p,
   'presPrimary', era)` to the sort key (no opponent — primaries are
   field-wide, not head-to-head; the helper's opponent arg is
   optional and ignored). The faction-leader / convention-style
   bumps for Magician / Harmonious / Obscure fire here per the
   F-PRIMARIES-AS-CONVENTIONS facts.

10. **[Locked]** `runPhase_2_2_3_FactionLeaders` `scoreOf`
    (`phaseRunners.ts:1907–1918`) gets the `internalParty` context.
    The existing `posCount`-based `traitBonus` (lines 1912–1916) is
    **kept unchanged** for backward compatibility with the
    LEADERSHIP_RULES tuning; the architect adds
    `traitVoteAdjust(p, 'internalParty', era)` to `scoreOf`'s return
    (`return p.pvCache - fitPenalty + traitBonus +
    traitVoteAdjust(...)`). The two layers compose: the generic
    "positive traits count" bonus stays as the structural floor;
    the per-trait per-context bonus is the texture (Magician winning
    the floor fight, Puritan losing it).

11. **[Open @ CP1 — recommend SKIP for PR4a]** The committee-chair
    selection at `runPhase_2_2_2_Committees` (`phaseRunners.ts:1833–
    1855`) sorts on a single skill (`legislative`, `admin`, or
    `judicial` per committee). The reference treats committee chair
    as an internal-party context where Magician / Debater /
    Harmonious matter, but adding `traitVoteAdjust` to a single-
    skill sort over Senate+House members has limited play-impact
    today (the trait bonus easily dominates the 0–5 skill range).
    Recommend **defer** to a future "internal-leadership tuning"
    pass; if the architect wants it in PR4a, the wire is
    `candidate = all.sort((a, b) => (b.skills[skillKey] +
    traitVoteAdjust(b, 'internalParty', era)) - (a.skills[skillKey]
    + traitVoteAdjust(a, 'internalParty', era)))[0];`. PM call:
    **skip** unless architect finds it trivial.

12. **[Locked]** The Continental Congress vote function (`voteCC`,
    `continentalCongress.ts:199–227`) and the era-event responses
    are **out of scope** — `voteCC` is a faction-loyalty vote with
    no per-candidate trait surface, and era-event responses don't
    use `calcStateVote`. PR4a explicitly does not touch them.

### D. Era-scaled and opponent-conditional bonuses

13. **[Locked]** Domestic Apathy magnitudes are era-scaled per
    F-DOMESTIC-APATHY-ERA-SCALED. The architect's
    `TRAIT_ELECTION_EFFECTS` shape must support an
    `eraMultiplier` per (trait, context) entry OR a per-era
    override row. PM recommendation: a simple `era?: Era` field on
    each magnitude entry (a row applies only when the row's `era`
    is undefined OR equals the current era). The era is
    `snap.game.currentEra` (`independence` / `federalism` /
    `nationalism` / `modern` per `Era` in `src/types.ts`). In the
    AMPU scenario windows: 1772 scenario plays through
    `independence` and into `federalism`; 1856 scenario plays
    `nationalism`. Architect maps "1772 era" / "1856 era" to the
    correct `Era` value at CP2.

14. **[Open @ CP1 — recommend SIMPLE-FLAT for PR4a]** Outsider's
    "anti-establishment mood" modulator (historian Open Q5).
    Recommend PR4a ships a **flat** `+ SMALL` in popular contexts
    and `- MEDIUM` in internal-party / pre-17 Senate, **without**
    an era-mood meter. Adding a computed mood signal would touch
    `partyPreference`, era-event flags, and interest-group state —
    out of scope for PR4a. The architect at CP2 can pick the
    starting magnitude (`SMALL` is recommended); a future
    "anti-establishment mood" PR can layer mood scaling on top.

15. **[Locked]** `Integrity` × `Scandalous`/`Controversial`
    opponent-conditional bonus (per F-NEGATIVE-MAGNITUDES-NONFLAT
    and the reference's explicit "Controversial is in particular
    danger against an opponent known for Integrity"). When
    `traitVoteAdjust(p, 'presGeneral', era, opponent)` fires:
    - If `p` has `Integrity` AND `opponent` has `Scandalous`,
      `Controversial`, or `Corrupt`, the Integrity bonus moves up
      ONE band (SMALL → MEDIUM, MEDIUM → LARGE). Architect picks
      the exact bumped numbers at CP2.
    - Symmetrically, if `p` has `Scandalous` or `Controversial`
      AND `opponent` has `Integrity`, the negative magnitude
      moves up ONE band (e.g. Scandalous in Pres-Gen goes from
      `- MEDIUM` to `- LARGE`).
    - This bonus fires in `presGeneral`, `house`, and `governor`
      contexts. It does **NOT** fire in `senatePre17`,
      `presPrimary`, or `internalParty` (per the historian:
      legislators / party regulars internalize the scandal, so
      the opponent-Integrity foil is weaker there).
    - When the field is >2 candidates (future-proofing — current
      `calcStateVote` is 2-person), the bonus fires per opponent
      that triggers it (additive). For the 2-person case, the
      helper checks the single `opponent` arg.

16. **[Locked]** Logging: each fired trait effect produces **one**
    log line per politician per race, summarizing the active
    trait set and the net delta. PM recommendation: log on the
    candidate that **won** the race, **only** if the net trait
    delta would have flipped the outcome at zero (i.e. the trait
    layer mattered). Suggested log shape:
    `"{name}'s {Trait1}, {Trait2} swung {pct}% in the {context}
    race for {race-id}."` Logged under the existing election
    phase IDs (`2.9.4`, `2.9.5`, `2.9.6`, `2.9.1`, `2.2.3`).
    **Open Q4** — flag if architect prefers per-trait per-race
    logging (much noisier) over the once-per-race summary.

### E. PR3 conflict-pair interaction (the load-bearing tick semantics)

17. **[Locked]** When PR3's `tryGrantTrait` swaps a held trait
    for its conflict pair (e.g. `Unlikable → Charismatic` on a
    d6 ≥ 4 — `TRAIT_LIFECYCLE_RULES.conflictD6Threshold`), the
    NEW trait's election effect must fire on the **next**
    election arithmetic call, with zero carry-over of the old
    trait's effect. Since `traitVoteAdjust` reads `p.traits` at
    call time (not via a cached field), this is automatic — but
    AC #17 is the testable assertion that the helper never
    caches trait lists across calls and never reads a stale
    `pvCache` for the trait component.

18. **[Locked]** No PR3-Conflicts table changes. PR4a does
    **not** add new entries to `TRAIT_CONFLICTS` (PR3 ships
    `Charismatic ↔ Unlikable`, `Integrity ↔ Corrupt`,
    `Harmonious ↔ Puritan`, etc.). PR4b owns the next conflict
    pairs (`Likable ↔ Unlikable`, `Two-Faced ↔ Predictable`,
    etc.) when it ships the new traits.

19. **[Locked]** Determinism: `traitVoteAdjust` is **pure** —
    deterministic in `(p.traits, ctx, era, opponent?.traits)`.
    No `Math.random`, no `chance()`, no `d()` calls inside the
    helper. The race-result determinism question is identical to
    PR1/PR2/PR3's: assuming the pre-existing `Math.random` at
    `calcStateVote:3281` is unchanged, the trait layer is fully
    deterministic. (The pre-existing noise term is a separate
    concern, called out for completeness — out of scope.)

### F. Cross-cutting guardrails (assert nothing leaked in)

20. **[Locked]** PR4a makes **no change to the PV formula**
    (`src/pv.ts`). The flat ±4 / −5 / +6-Kingmaker trait
    weights stay. The new context-aware bonus is computed at
    election-arithmetic call sites, additively, not via
    `computePV` / `refreshPv`. PR1/PR2/PR3 PV semantics are
    untouched.

21. **[Locked]** PR4a makes **no change to the `Trait` union**
    (no new traits — that's PR4b). All 15 traits PR4a wires
    already exist in `src/types.ts:62–100`. The
    `TRAIT_ELECTION_EFFECTS` table covers exactly those 15.

22. **[Locked]** PR4a adds **no new field** to `Politician`,
    `GameState`, or any snapshot type. No save migration. No
    `repair()` change. Old saves play the new effects starting
    on their next election. The `TRAIT_CONFLICTS` shape and
    `tryGrantTrait` helper from PR3 are read-only here.

23. **[Locked]** PR4a uses **no new RNG path** and adds **no
    `Math.random` calls**. The trait-effect layer is purely
    deterministic in trait set + context + era. The pre-existing
    `Math.random` at `calcStateVote:3281` is unchanged (a
    documented carry-over from pre-PR1; out of scope).

24. **[Locked]** PR4a does **not** alter `LEADERSHIP_RULES`'s
    `traitBonusPerPositive` / `traitBonusCap` (which adds a
    `posCount`-based bonus to `scoreOf`). The two layers
    compose — the existing generic positive-trait floor stays;
    the new per-trait per-context layer is texture. Architect
    may rebalance the LEADERSHIP_RULES numbers down if the
    composed score reads too high at playtest; that tuning is
    CP2-level.

25. **[Locked]** `npm run build` (tsc + vite) passes and
    `npm run lint` (tsc `--noEmit`) is clean. Any
    `as const satisfies` exhaustiveness on `TRAIT_ELECTION_EFFECTS`
    compiles cleanly across the 15 traits × 6 contexts.

## Edge cases

- **Politician with NO trait in the PR4a list.** `traitVoteAdjust`
  iterates the politician's `traits` array, looks each up in
  `TRAIT_ELECTION_EFFECTS`, and skips any trait without an entry
  (the other ~22 traits in the union — Orator, Crisis Manager,
  Kingmaker, Leadership, Efficient, Egghead, Manipulative,
  Celebrity, Nationalist, Globalist, Reformist, Incompetent,
  Passive, Flip-Flopper, Corrupt, Frail, Traitor, Ideologue,
  Impressionable, Loyal, Opportunist, Ambitious, Failed Bid).
  Net adjustment is 0 — the candidate's race is driven entirely
  by PV / party lean / state bias as it is today.

- **Politician with multiple PR4a traits.** Effects **stack
  additively** by trait (each trait contributes its per-context
  magnitude separately, summed). A `Charismatic` + `Integrity` +
  `Harmonious` Governor candidate gets all three positives summed.
  A `Unlikable` + `Scandalous` + `Controversial` candidate in
  Pres-Gen takes all three negatives — intended (the historian's
  Adams-1800 and Jackson-1828 cases both stack character flaws).

- **Opponent-conditional bonus fires for BOTH candidates.** In
  Pres-Gen with a Lincoln-style `Integrity` candidate against a
  Hamilton-Reynolds-style `Scandalous` opponent, BOTH receive the
  bumped magnitudes (Integrity SMALL → MEDIUM on the clean
  candidate, Scandalous MEDIUM → LARGE on the tainted one). This
  is the historian's F-NEGATIVE-MAGNITUDES-NONFLAT intention — the
  swing **amplifies** in the right opposition.

- **Carpetbagger gate (`p.state !== p.birthState`).** The
  Carpetbagger magnitude (House / Senate / Governor) fires **only
  if** the politician is running outside their birth state — the
  trait is essentially a flag the engine uses with extra
  geographic context. If `p.birthState` is undefined (some seed
  data lacks it), PR4a treats it as **no Carpetbagger penalty**
  (safe default). Architect confirms the field exists in current
  `Politician` shape — note: `birthState` may need a fallback to
  `state` for pre-PR4a politicians (Open Q7).

- **Domestic Apathy era boundary at scenario transitions.** The
  1772 scenario evolves through `independence` → `federalism`;
  the 1856 scenario stays in `nationalism`. PR4a's Domestic
  Apathy magnitude is `− SMALL` for `independence` and
  `federalism`, `− MEDIUM` for `nationalism` and beyond. The era
  is read at the moment of the race, so a politician who started
  the 1772 scenario in `independence` and is now in `federalism`
  will have the same Domestic Apathy hit — and if AMPU ever
  bridges into `nationalism` (the late 1820s+ as a `federalism`
  game state), the magnitude bumps. (PR4a does not model the
  bridge; just the era flag at race time.)

- **Obscure as a CONVENTION POSITIVE.** The Pierce-1852 case: an
  Obscure candidate in `presPrimary` context gets `+ SMALL`
  instead of the popular-elections `- MEDIUM`. This is the only
  "negative trait that's positive somewhere" entry in the table.
  Architect should validate the sign-flip doesn't compose
  oddly with the flat -5 PV (it doesn't — the layers are
  independent; the convention score is PV + traitVoteAdjust, and
  the trait bonus partially cancels the PV penalty in
  conventions; this is the intended player feel).

- **Numberfudger classification.** The reference's gap analysis
  classes `Numberfudger` as a `POSITIVE_TRAIT` (`src/types.ts`),
  but the trait flavor and historian's election effects are
  unambiguously negative. PR4a does **not** reclassify the trait
  (the flat ±PV stays at +4 per the existing array) — only the
  context-aware layer turns it slightly negative in the wrong
  race. **Flag for future cleanup pass** (Open Q6); not load-
  bearing for PR4a.

- **Outsider classification (similar).** Outsider is currently in
  `NEGATIVE_TRAITS` (flat -5 PV). The trait's context-aware layer
  is **net positive** in popular elections (Jackson 1828, Frémont
  1856). The composed swing: -5 PV (flat layer) + small positive
  context layer (per AC #6) = still a small net negative on
  Pres-Gen score on average, but a positive swing on the trait
  layer. This is the intended player feel: the Outsider is
  structurally disadvantaged (the establishment doesn't reward
  them via the PV channel) but campaigns better than their PV
  would suggest in popular races. Architect tunes if it reads
  wrong at playtest.

- **CPU vs. player politicians.** All trait effects fire for
  **every** politician — CPU stars get the same per-context
  swings. The data stays consistent for downstream PRs
  (cabinet, lobby).

- **Faction-leader scoring with no PR4a traits.** A faction with
  members carrying only AMPU-invented traits (Loyal, Opportunist,
  Ideologue, Impressionable, etc.) has `traitVoteAdjust` return
  0 for every candidate — the existing `posCount` bonus and PV
  drive the win, as today.

- **Pre-17 Senate IS direct popular vote in the 1856 scenario
  data shape.** AMPU's `runPhase_2_9_6_Congressional` Senate
  loop calls `calcStateVote` on a 2-candidate field and picks
  the popular-vote winner (per `phaseRunners.ts:3417–3437`).
  PR4a's binding fact F-SENATE-BOTH-ERAS says Senate elections
  in BOTH eras are state-legislature, NOT popular. The
  `senatePre17` context flag in `TRAIT_ELECTION_EFFECTS`
  **modulates the trait magnitudes** to reflect the
  state-legislature reality (dampen Charismatic, amplify
  Magician/Debater), but PR4a does **NOT** restructure the
  Senate-loop vote arithmetic itself — that's a much larger
  PR (the entire calcStateVote→state-legislature conversion).
  Flag in Open Q8 — the data is "popular-vote shaped" but
  PR4a's trait layer expresses the historical reality via
  magnitude shaping. Architect aware.

## Out of scope

Named explicitly so the architect does not pull adjacent or
later-PR work into PR4a:

- **NEW traits the reference defines but AMPU doesn't have**:
  Likable, Uncharismatic, Cosmopolitan, Provincial, Two-Faced,
  Predictable, Hale, Orator-polish, Everyman. **PR4b.**
- **NEW conflict pairs** (Likable ↔ Unlikable, Two-Faced ↔
  Predictable, etc.). PR4b.
- **The PV formula.** Untouched. The flat ±4 / −5 / +6-Kingmaker
  weights stay. PR4a layers on top.
- **The pre-existing `Math.random` at `calcStateVote:3281`.**
  Pre-existing noise term; out of scope. PR4a's trait layer
  adds no `Math.random`.
- **Trait election effects for non-PR4a traits** (Orator,
  Crisis Manager, Manipulative, Egghead, Efficient,
  Nationalist, Globalist, Reformist, Incompetent, Passive,
  Flip-Flopper, Corrupt, Frail, Traitor, Ideologue,
  Impressionable, Loyal, Opportunist, Ambitious, Failed Bid,
  Celebrity, Kingmaker, Leadership). Most are PR4b/PR6 content,
  or already have non-election mechanical effects (Leadership
  on committee chair, Kingmaker on PV, Manipulative in anytime
  events).
- **Senate-as-state-legislature arithmetic restructure.** The
  current popular-vote-shape data stays; the trait magnitudes
  modulate it to feel state-legislature-like. A full
  legislative-vote conversion is a meaningful PR of its own.
- **Debate-event year-gating for Debater.** No "debate years"
  tag in AMPU; trait fires at flat magnitude in debate-bearing
  contexts. A future "Debate Events" PR can year-gate.
- **Cabinet confirmation trait gating (PR5).** Bookkeeper / Sec
  Treasury, Lawful / AG — PR5.
- **Lobby → industry wiring (PR7).**
- **Draft dataset regeneration.** The seed dataset already
  carries the 15 traits; PR4a only changes what the engine
  does with them.
- **Anytime-event trait grants and removals.** PR3 owns
  `tryGrantTrait`; PR4a doesn't touch grant logic.
- **A trait-detail UI / tooltip / "why did this election go this
  way" modal.** Trait effects surface only via the existing log
  feed and the politician roster trait column. No new UI.
- **The Carpetbagger label rename per scenario.** Open Q1 below;
  PM recommends keeping the code label and deferring any UI-level
  era-rename to a polish PR.
- **Anti-establishment mood meter for Outsider modulation.**
  Open Q5 historian flag; PR4a ships flat magnitudes per AC #14.
- **Numberfudger / Outsider reclassification in POSITIVE_TRAITS /
  NEGATIVE_TRAITS.** Open Q6; PR4a leaves the existing flat-PV
  classifications untouched and only adds the context layer.

## Open questions / assumptions

Decision-first ordering. **Q1 and Q3 are CP1 (PM-locked, human
adjudicates)**. All others are CP2 (architect-deferable).

1. **(CP1 — Carpetbagger label per-scenario.)** The historian
   flags `Carpetbagger` as a Reconstruction-era term (first use
   1867, full anachronism for 1772, partial for 1856). The
   mechanic (non-resident haircut) is fine for both eras. **PM
   recommendation: KEEP THE CODE LABEL `Carpetbagger`.** Era-
   appropriate UI display labels (e.g. "Outsider Settler" for
   1772, "Carpetbagger" for 1856+) are a polish PR and not
   load-bearing for PR4a's mechanics. The human locks the call
   at CP1. The mechanism in `TRAIT_ELECTION_EFFECTS` is
   identical regardless of label.

2. **(CP1 — Numberfudger context-only or skip?)** The historian
   notes Numberfudger has thin canonical examples in both
   scenarios (the trait's clearest exemplar is Grant-era post-
   1860). PM recommendation: **WIRE WITH LOW MAGNITUDES** as
   per the table — the trait should produce *some* mechanical
   signal so the player learns the trait exists and matters in
   panic/recession-context elections. Alternatives the human
   may pick at CP1: (a) skip entirely (no entry in
   `TRAIT_ELECTION_EFFECTS`, leaving Numberfudger as a flat ±PV
   nudge until a Gilded Age scenario adds it), or (b) wire at
   the small magnitudes shown (PM recommendation). Architect's
   call to fine-tune later.

3. **(CP1 — Debater year-gating.)** The historian flags
   Debater's historical impact as episode-bound (Lincoln-
   Douglas 1858, Webster-Hayne 1830) rather than flat. **PM
   recommendation: SHIP FLAT IN PR4a.** AMPU has no "debate
   event" tag, no Lincoln-Douglas-style scripted phase, and
   adding one is a larger PR. The trait fires at flat magnitude
   in all debate-bearing contexts (Pres-Gen, Senate, Internal
   Party). A future "Debate Events" PR can year-gate. Alternative
   for human at CP1: defer Debater entirely from PR4a (no
   `TRAIT_ELECTION_EFFECTS` entry, trait stays flat-PV) —
   rejected because Debater is the historian's single clearest
   "trait that has a context but doesn't fire today" case in
   AMPU's seeded set.

4. **(CP2-deferable — per-trait per-race log lines vs. once-per-
   race summary.)** Recommend once-per-race summary per AC #16.
   Per-trait per-race would produce 6–10 log lines per
   election cycle per politician (loud). Architect picks the
   logging fidelity at CP2; the helper returns the per-trait
   breakdown as data so the caller can compose either shape.

5. **(CP2-deferable — keep or shed `pv.ts` flat trait weights.)**
   PM recommendation locked in F-PV-INTERACTION: **KEEP**. The
   flat layer is the structural floor; the per-context layer
   is texture. Removing the flat layer would force
   `runPhase_2_9_1_Primaries` and faction-leader scoring to
   read trait effects too — possible, but a much larger and
   more load-bearing change. Architect may revisit at CP2 if
   the composed swing reads too high; the PM-recommended
   starting numbers (SMALL=2, MEDIUM=4, LARGE=8) are tuned for
   the keep-flat case.

6. **(CP2-deferable — Numberfudger and Outsider trait-class
   sign.)** Both are mis-classified relative to the historian's
   flavor (Numberfudger is in `POSITIVE_TRAITS`, +4 flat PV
   today; Outsider is in `NEGATIVE_TRAITS`, −5 flat PV today —
   the historian shows Outsider as a popular-elections positive).
   PR4a's context layer routes around the mis-classification
   without rewriting it. A future cleanup PR can reclassify;
   architect notes for the playtest.

7. **(CP2-deferable — `Politician.birthState` field availability.)**
   The Carpetbagger gate per Edge case checks
   `p.state !== p.birthState`. PM assumes the field exists on
   `Politician` (the dataset is birth-year-keyed; the dataset
   likely carries birth state too) — but if `birthState` is not
   on the live snapshot type, the architect needs to either
   (a) add it as an optional field with a `repair()` default
   (load-bearing — would re-open save migration), or (b) fall
   back to `originStateId` / a similar field, or (c) skip the
   Carpetbagger gate and apply the magnitude flat. PM
   recommends (b) or (c) — (a) is out of scope for PR4a per
   AC #22.

8. **(CP2-deferable — Senate-data-shape mismatch.)** AC #7's
   `senatePre17` context modulates magnitudes to reflect the
   state-legislature reality, but `runPhase_2_9_6_Congressional`'s
   Senate loop still uses `calcStateVote`'s popular-vote-shape
   arithmetic. The historian flags this as the load-bearing
   per-context gate. PR4a ships the magnitude modulation, NOT
   the arithmetic restructure. Architect may note for a future
   "Senate-as-state-legislature" PR; PM recommends accepting
   the mismatch for PR4a as a magnitude-only fix.

9. **(Assumption — primaries-as-conventions in 2.9.1.)**
   F-PRIMARIES-AS-CONVENTIONS is the historian's binding
   ruling — AMPU's "primaries phase" is the convention
   abstraction for both eras. PR4a does NOT rename the phase
   or introduce a separate convention phase ID. Magician /
   Harmonious / Obscure-dark-horse magnitudes fire there per
   the table; if the human prefers a phase rename (cosmetic
   "Conventions" instead of "Presidential Primaries"), it's a
   trivial follow-up. Default: keep current name.

10. **(Assumption — the helper module choice.)** PR4a's helper
    `traitVoteAdjust` could live in either a new
    `src/engine/electionEffects.ts` (PM-recommended; mirrors
    `src/engine/expertise.ts` / `src/engine/abilities.ts` /
    `src/engine/traits.ts` PR1/PR2/PR3 pattern) or inline in
    `phaseRunners.ts`. New module is the more readable choice.
    Architect picks at CP2.

11. **(Assumption — no UI work in PR4a.)** Trait election
    effects surface only via the log feed (per AC #16) and the
    politician roster trait column. No new modal, tooltip, or
    surface. A "why did this election go this way" educational
    UI would help playtesters tune balance but is deferred.

12. **(Assumption — no playtest-tuned magnitudes locked in
    PR4a.)** The PM-recommended starting numbers (SMALL=2,
    MEDIUM=4, LARGE=8 percent for vote-share; same numbers as
    score deltas for the internal-party path) are CP2-tunable.
    The architect picks the exact numbers at the build stage;
    the human tunes at playtest. The 15-trait × 6-context
    grid in AC #6 is the **structural** lock — the magnitudes
    can shift across playtest cycles, but the per-trait per-
    context **directions** (positive / negative / neutral / era-
    scaled) are PM-final.

13. **(Assumption — PR4b conflict-pair forward-compat.)** PR4b
    will add new conflict pairs (Likable ↔ Unlikable in
    particular) when it introduces Likable. PR4a's
    `TRAIT_ELECTION_EFFECTS` shape should be designed so PR4b
    can extend it for new traits without rewriting the PR4a
    rows. Architect designs for forward-compat at CP2 (likely
    means making the table additive on `Trait` keys, not
    exhaustive — same as `TRAIT_CONFLICTS`'s `Partial<Record<>>`
    shape).

---

**Spec file:** `/home/user/AMPU/docs/specs/trait-election-effects.md`
