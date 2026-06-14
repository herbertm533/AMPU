# Spec: Anytime Events (Phase 2.4.2 Redesign)

> Eighth activation in the 2.x sweep (Relocations 2.1.4 → Ideology 2.1.5 →
> Conversions 2.1.6 → Kingmakers 2.1.7 → Alignment Drift 2.1.8 → Faction
> Leaders 2.2.3 → Deaths & Retirements 2.4.1 → this). 2.4.2 is currently a
> 14-line stub: one nation-level roll at 35%/turn that picks from 5 hardcoded
> flavor texts which tick national meters. The vision is per-politician rolls
> with a large era-aware pool, traits/skills/PV/ideology effects, a dedicated
> UI page — **AND** (post-Checkpoint-1) a parallel national-flavor pool that
> keeps and grows the current stub's world-level meter pulse. This spec turns
> 2.4.2 into the game's primary "world feels alive" surface: each turn the
> runner first rolls one national-flavor event (60–80% per-turn) from a
> 22-template era-aware pool that ticks meters / interest groups /
> partyPreference, then every alive non-retired non-dead politician rolls
> against a 33-template era-and-region-filtered personal pool, and a new
> `AnytimeEventsPage` lets the player track both feeds across their roster.
> No new Politician/Faction/GameState fields. Sits cleanly behind 2.4.1 in the
> same `2.4` event bracket (2.4.1 runs first, so a Frail trait granted in
> 2.4.2 this turn affects next turn's mortality roll, not this turn's). The
> 1772 first-turn skip is removed; founders eat the rolls turn 1.

## Checkpoint 1 amendments accepted

Three user-binding amendments were accepted at Checkpoint 1 (2026-06-14) and
ripple through the body of this spec. They are summarised here for the
implementing architect; downstream sections (Mechanics, Acceptance Criteria,
Edge Cases, Out of Scope, Open Questions) have all been edited to reflect
them. Use the amendment tags `[A]` `[B]` `[C]` below to spot the touched
clauses if scanning a diff.

### Amendment A — Remove the 1772 first-turn skip for 2.4.2

The current `phases.ts:113` line
`if (phaseId === '2.4.2') return false; // no anytime events` is **REMOVED**.
2.4.2 fires on turn 1 of 1772. Founders eat the rolls. Rationale: the user
explicitly overrode the PM's "protect founders" framing — the per-politician
fire chance is ~4%/yr (independence fireMult applied), so a 12-politician
inaugural roster expects ~0.5 personal events on turn 1; the national-flavor
roll fires at ~60% per turn. The first-turn experience gains texture; the
founder cohort doesn't get a free pass. Acceptance criterion #21 inverted
from "kept" to "removed and 2.4.2 MUST fire turn 1." Mirrors the same call
already taken for 2.4.1 in the deaths-retirements spec.

### Amendment B — Grow the national-flavor pool (do NOT rip it)

The PM's v1 proposal ripped the current stub's 5 national-meter events. The
user overrode: **keep them and grow them substantially.** A second event
pool is added alongside the 33 per-politician templates:

- **Pool size: 22 national-flavor templates** (target window 18–28; PM picks
  mid-range to mirror the historian's 4 eras with ~5 era-tagged variants per
  category family on average). The current stub's 5 events (bumper harvest,
  railroad accident, patriotic groundswell, immigration wave, Treasury
  scandal) are kept verbatim as the seed entries and re-cast as era-tagged
  templates in the new pool.
- **Categories**: economic, demographic, foreign / diplomatic, civic /
  institutional, cultural / social, natural. See §1.4 for the full
  authoring breakdown.
- **Effect surface**: each national-flavor template ticks 1–3 of
  `gameState.meters` (the existing `NationalMeters` six-meter struct,
  notably `economic` / `quality` / `honest`), `gameState.interestGroups`
  (free-form `InterestGroupScores` map), or `gameState.partyPreference`
  (-5..+5 scalar). **National-flavor templates NEVER mutate politicians**
  — that surface belongs to the personal pool.
- **Per-turn fire rate**: 70% per turn (between the historian's "world
  feels alive" suggestion and the conservative end). Single roll per turn,
  picks one template via weighted era-filtered draw. Same era-multiplier
  shape as personal events (`nationalFireMult` per era, parallel to
  `fireMult` for personal events — see §1.1).
- **Region tagging on national events**: the template type supports an
  optional `regions?: State['region'][]` tag, used by ~4 templates
  (Southern crop failure, Western frontier event, New England industrial
  strike, Pacific port boom) that shift state-level meters for the
  affected region's states only. Most national templates are nation-wide
  (no `regions` tag); regional templates apply per-state effects via a
  small dedicated effect kind (see §1.4 effect taxonomy). This keeps v1
  simple: a region-tagged national event isn't a separate concept — it's
  a national event whose `effects` array includes a `stateMeterShift`
  effect scoped by `regions`.
- **Anachronism check**: the historian's anti-pattern list (research brief
  lines 393–420) is enforced on the national pool the same way as the
  personal pool: a runtime `validate()` helper at runner-start asserts
  template `eras` tags don't admit known-bad combinations (no telegraph
  pre-1844, no automobile pre-1908, no plane pre-1930, no radio pre-1920,
  no polio pre-1900, etc.).
- **Mass-media scaling on executive-branch scandal**: per historian
  binding fact #3 (mass-media scandal intensity is post-1880s), the
  magnitude of national-pool **executive-scandal** templates' `partyPreference`
  / `honest` ticks scales by era using the same `scandalMagnitudeMult`
  promoted in Amendment C. A 1772 Treasury scandal nudges partyPreference
  by ~0.1; a 1956 executive scandal nudges by ~0.5+.

### Amendment C — `scandalMagnitudeMult` drives engine math in v1

The PM's v1 proposal made `scandalMagnitudeMult` informational / UI-color
only (Resolved OQ 4 in pre-checkpoint draft). The user overrode: **make it
drive engine math in v1.** Concrete:

- **Personal scandal templates** (categories `scandal-financial`,
  `scandal-sexual`, `scandal-verbal`): the `effects` array is allowed to
  scale PV-impact by the per-era multiplier. v1 implementation pathway: the
  runner multiplies any `pvHit.amount` AND any `commandBump`/`skillBump`
  negative value in a scandal-template effect by
  `ANYTIME_EVENTS_RULES.eraConfig[era].scandalMagnitudeMult`. Because direct
  `pvCache` writes are still forbidden (§1.2 note), the practical lever is
  the **`additionalTraitGrants`** mechanism — at higher multipliers, the
  runner ALSO stamps `Corrupt` alongside `Scandalous` (modern), and at
  lower multipliers grants only `Scandalous` with the baseline `-5` PV
  hit (independence/federalism). The spec encodes this as a per-template
  `scandalSeverity` field with breakpoints: at multiplier ≥ 1.0 the second
  trait stamps; at multiplier ≥ 1.2 the runner ALSO induces a per-era
  `Failed Bid`-style PV stamp on the politician (a 5-point one-time PV
  penalty via the same `failedBidPvStamp` mechanism `LEADERSHIP_RULES`
  already uses) — but this last step uses a separate field
  `flipFlopperPenalty` accretion to avoid colliding with leadership.
- **National executive-branch scandal templates** (e.g.
  `national:scandal-executive`): the template's `partyPreference` delta
  and `honest` meter delta are multiplied by
  `eraConfig[era].scandalMagnitudeMult` at runner-application time. A
  1772 senator-of-the-Treasury scandal moves partyPreference by
  `-0.2 × 0.5 = -0.1` and `honest` by `-1 × 0.5 ≈ 0` (clamped at integer
  step granularity — historians won't even notice). A 1956 equivalent
  moves partyPreference by `-0.2 × 1.3 = -0.26` and `honest` by `-1 × 1.3
  = -1.3 → -1` after rounding. Notable spread.
- **Trait-persistence severity**: at scandalMagnitudeMult ≥ 1.0 (modern,
  nationalism), scandal traits granted by 2.4.2 are NOT removable by 2.1.5
  conversion / drift logic in v1 (the `Scandalous` trait persists for
  career). At multipliers `< 1.0` (independence, federalism), scandal
  traits are removable by the existing 2.1.5/2.1.6 trait-update channels
  IF a politician changes faction post-scandal — modeling the
  "Reynolds-affair fade" of pre-1880 scandal cycles. v1 implementation:
  no engine work; the existing 2.1.6 channel doesn't currently strip
  traits, so the asymmetry is structural (modern scandal sticks; pre-modern
  scandal sticks too, but flagged for v2 polish). The historian's binding
  fact #3 is satisfied by the partyPreference / `honest` magnitude scale
  alone in v1.
- **Visible per-era spread (playtest criterion)**: see new Acceptance
  Criterion #35 ("1772 senator scandal yields milder consequences than
  1956 senator scandal of equivalent template") — playtest binding.

## Vision (as given)

"This phase should be more than flavor. It should involve events that have a
real effect on the game. These events should be somewhat era specific but
mostly they are era agnostic. Things like a politician has an accident/gets
sick and becomes frail, a scandal for a politician occurs, a politician gets
a random trait or skill bump for some reason. I want a large and detailed
event list to make the world feel alive. I want a page in the UI for this to
better track what's going on. Ideally, every politician would have a small
chance something fires."

The current stub fails the vision on five axes: (1) one nation-level roll, not
per-politician; (2) 5 events, not "large and detailed"; (3) effects on
national meters only, no individual politician mutation; (4) no era awareness
in the pool itself (only via 2.4.3); (5) no UI page. This redesign replaces
the entire runner, ships a ~32-template personal pool **and a parallel
22-template national-flavor pool per Amendment B**, and adds the dashboard
page.

**Checkpoint-1 follow-up from the user** (Amendment B verbatim): *"We want to
keep these [5 national stub] events and grow them. The global economy could
slow, immigration could increase, etc. Please create a large and detailed
list of these events that can occur also."* The 22-template national pool in
§1.4 answers this directly. The current stub's 5 events become 5 of the 22.

## Historical grounding (binding)

Source: `/home/user/AMPU/docs/research/anytime-events-historical-context.md`.
Eight binding facts from the historian's brief that this spec respects:

1. **Dueling is era-AND-region-gated** (independence + federalism, Southern bias
   in early nationalism, absent in modern; Pennsylvania criminalized 1794,
   Northern duels fade by 1830s, Southern code duello persists through Civil
   War). → Event templates carry an optional `regions?: State['region'][]`
   tag in addition to `eras?: Era[]`; a politician's `state.region` (looked up
   via `snap.states`) gates eligibility for region-bound templates. Duel
   templates set `eras: ['independence', 'federalism']` with a soft Southern
   weighting in nationalism via a separate `Southern Duel (fading)` template.
   Modern political violence becomes `Assassination Attempt`, not duel —
   separate template, era-keyed `modern` only with sparse nationalism
   precedent (Lincoln/Garfield/McKinley).

2. **Illness visibility is era-dependent.** Pre-1900 illness was visible
   (Calhoun, Webster, Sumner); 20th-century managed (Wilson hidden 17
   months); modern visible again. → Spec ships **public visibility**
   uniformly in v1 — every illness event publishes a feed entry. The
   `Frail` trait stamp lands publicly regardless of era. Modeling Wilson-
   style hidden incapacity is out of scope; flagged.

3. **Mass-media scandal intensity scales by era** (small pre-1880, biggest
   modern). → Scandal templates carry per-era `magnitudeMult` modifiers
   applied to PV penalty and (where applicable) `Scandalous`/`Corrupt`
   trait-grant probability. Per-era multipliers: independence `0.5`,
   federalism `0.7`, nationalism `1.0`, modern `1.3`. Encoded in
   `ANYTIME_EVENTS_RULES.eraConfig`. **[C] Amendment C promoted this from
   informational to engine-driving in v1** — see Amendment C above and
   §1.1 / §3 (scandal application math).

4. **Career-ending scandal is rare even when scandal fires.** Credit
   Mobilier implicated ~12 members with "few consequences"; Blaine ran for
   president in 1884; Fall (1929) was the FIRST cabinet conviction. → The
   default scandal outcome is a trait stamp + PV hit, not death/forced
   retire. Outright career end (induced retirement, induced death) is
   deferred — those exits stay owned by 2.4.1 mortality. A separate
   `Scandal: Career-Ending` template fires at ~5% of scandal weight in
   modern only, sets `Politician.retiredYear` directly; never in v1 for
   pre-modern.

5. **Antebellum epidemic disease was a real politician-mortality factor**
   (yellow fever 1793–1805; cholera 1832/1849/1854; smallpox; 1918 flu;
   polio 1900–1955; modern pandemic). → A dedicated `Epidemic Illness`
   template family with sub-variants tied to era windows (yellow fever in
   independence+federalism, cholera in federalism, 1918 flu in nationalism,
   polio in nationalism+early-modern, modern pandemic in modern). All grant
   `Frail`; rare variants kill outright (~5% of fires). The national pool
   ALSO ships epidemic-as-public-event templates (yellow fever in
   Philadelphia 1793, cholera 1832/49, 1918 flu, modern pandemic) that
   tick `quality` / `partyPreference` rather than mutating politicians —
   the two pools cover the same historical event from two sides.

6. **Skill discovery is rare and usually surfaces latent ability** (Bryan
   Cross of Gold July 8, 1896 as the paradigm). The career-track system
   already accrues skills. → Spec ships **PV/command/trait** effects as
   the dominant breakthrough outcome; raw `+1 skill` events exist but are
   **capped at ~10% of the pool** and themed (legislative from
   "Memorable Speech", governing from "Crisis Handled Well"). Skill bumps
   never lower than +1 and never apply to skills already at the cap (5).
   The historian-paradigmatic "Cross of Gold" outcome maps to `+1 command`
   and grant `Orator` — not `+1 legislative`. The PM stance is on the
   side of historical caution; final fraction tunable.

7. **Religious/ideological conversion is era-keyed** (Second Great Awakening
   1790–1840, populism 1890–1910) and NOT unidirectional (Tom Watson
   1890 D → 1891 Populist → 1900+ white supremacist). → A
   `Religious/Ideological Conversion` template family **delegated to the
   existing 2.1.5 system via trait grant**: anytime events grant the
   `Reformist` / `Puritan` trait that biases future 2.1.5 ideology shifts;
   they do NOT directly mutate `ideology`. This avoids double-counting the
   `IDEOLOGY_SHIFT_ODDS` channel (binding fact: the historian's brief lists
   `Ideologue`/`Impressionable`/`Flip-Flopper` as already-owned by 2.1.5;
   2.4.2 must not grant those). Era-keyed firing windows match the
   awakening + populism timeline. The national pool ships parallel
   "Second Great Awakening sweeps the country" / "Populist insurgency
   rises" templates as era-tagged civic events ticking interest groups
   (`Reformers`, `Workers`) and partyPreference.

8. **Period-appropriate fatal accidents change shape by era** (horse fall /
   drowning / war-wound infection pre-1900; train wreck 1840s–1900s;
   automobile post-1908; aviation post-1955 for politicians). → A
   `Transportation Accident` template family with sub-variants tied to era:
   `Horse Fall` (I/F), `Carriage Overturned` (I/F), `Train Wreck` (F/N),
   `Auto Crash` (late N + M), `Plane Crash` (M only post-1955). Outcomes
   are mostly `Frail` + PV hit; rare lethal variant (~10%) sets
   `deathYear` directly. The national pool ships parallel "Major train
   wreck shocks the country" / "Aviation disaster" templates as
   `quality`-meter ticks that compose with personal templates but don't
   require a politician to be the victim.

**Deviations from historian's binding facts** (user-approved at Checkpoint 1):

- *None yet.* All eight facts are respected as encoded above; the riskiest PM
  call (skill-bump fraction, item 6) errs toward historian skepticism rather
  than away. Checkpoint 1's three amendments (A/B/C) do not introduce
  deviations from the historian's binding facts — Amendment A removes a
  PM-added gameplay protection (not a historian fact); Amendment B grows
  the national pool the historian's brief already discusses (epidemics,
  immigration waves, religious revivals); Amendment C promotes a historian
  fact (era-scaled scandal magnitude) from informational to engine-binding.

**Anachronism flag** — the historian's "anti-patterns must NOT appear in the
pool" list (auto crash pre-1908, plane crash pre-1955, polio pre-1900,
duel post-1870 outside South, FBI sting pre-1970, "DUI" pre-1910, "coming
out" pre-1970, "Modern Liberal/Conservative" naming pre-1933, "Great
Communicator"/"The Treatment" pre-1950s, etc.) is enforced by era/region
tags + the `validate()` runtime check (see §5) across BOTH the personal
pool AND the national pool. Examples specific to the national pool:
no telegraph templates pre-1844; no transcontinental railroad templates
pre-1869; no broadcast-radio templates pre-1920; no television templates
pre-1947; no internet templates pre-1995. Era tagging plus the validator
catches authoring drift in both pools.

## Player experience

Every turn, ~5% of your roster has something happen on the **personal** axis.
Most of the time it's inert — a brief feed line you'll see in passing.
Sometimes it bites: your star recruit takes a horse fall and gains `Frail`,
dropping his prospects; your Southern senator loses a duel and dies in 1808;
your governor gets hit by a Credit-Mobilier-style scandal and his PV drops
12 with `Scandalous` attached. Occasionally it gifts you: your young rep
gives a breakthrough speech and gains `Orator` plus +1 command. Era flavor
matters — in 1856 you watch yellow fever cull a Philadelphia delegation; in
1956 you see Eisenhower-style heart attacks disclosed in the feed.

**[B] In parallel, roughly seven turns in ten a national-flavor event also
fires**: an immigration wave reaches Northern ports, a railroad accident
kills dozens, a Treasury scandal breaks (sharper in 1956 than in 1856 per
Amendment C), the global economy slows, a Second Great Awakening revival
sweeps the South, an 1893 panic levels Wall Street, the Spanish flu cuts
through Washington. Those events don't mutate your politicians directly —
they shift `economic`/`quality`/`honest` meters, push interest groups, and
nudge `partyPreference`. The two pools compose: a pandemic year (national
template) and a senator catching `Frail` from illness (personal template)
can both fire the same turn, narrating the era from both altitudes.

[A] **Turn 1 of 1772 is no longer special** — your inaugural founders
roll for events too. The national pool will probably fire (~70% chance), so
expect the founding to open with a market shock, a colonial unrest event,
or an immigration headline. The personal pool runs at ~4%/founder/yr in
independence, so a 12-founder roster expects ~0.5 personal events on turn
1 — sometimes one fires, sometimes none. Either way, the world feels
inhabited from the gate.

Each politician has a self-contained story arc that emerges from the dice.
The new **Anytime Events** page lets you scan the last N events across your
roster, filter by era/event-kind/politician AND the national-feed split,
and drill into a single politician's lifetime arc — turning your faction
into a readable history.

## User story

As a faction-running player, I want a small per-politician chance each turn
that a real event happens — illnesses granting `Frail`, scandals granting
`Scandalous`/`Corrupt` with a PV hit, breakthrough moments granting
`Orator`/`Charismatic` or +1 command, transportation accidents, duels (era +
region gated), epidemic disease (era gated), and ideological/religious
nudges (era gated) — AND a parallel chance each turn that a national-flavor
event ticks the world meters and interest groups in era-appropriate ways,
narrated through the feed and aggregated on a new Anytime Events page, so
my roster has a lived-in history I can scan AND the wider world has a
visible pulse, and so my long-term planning has a third axis of attrition
(trait-and-PV drift from the dice) plus a fourth axis of macro context
(meters and interest groups responding to history's randomness).

## Verified engine facts (drive the design; architect must not re-derive)

- **Current 2.4.2 runner** (`runPhase_2_4_2_Anytime`,
  phaseRunners.ts:2062–2075) is 14 lines: one `chance(0.35)` per turn, then
  `pick` from 5 hardcoded objects each ticking `snap.game.meters`,
  `partyPreference`, or `interestGroups`. **Replace wholesale.** [B] The 5
  national-meter effects are KEPT as the seed of a new 22-template national
  pool (§1.4) — re-cast as era-tagged templates with the same effect shapes
  (`meters` tick, `partyPreference` tick, `interestGroups` tick).
- **First-turn skip** at `phases.ts:113` reads
  `if (phaseId === '2.4.2') return false; // no anytime events` inside the
  `currentEra === 'independence' && isFirstTurn` block. [A] **REMOVE this
  line per Amendment A.** 2.4.2 fires on turn 1 of 1772. The architect's
  code change is a single-line removal; spec acceptance criterion #21
  inverts to "removed and 2.4.2 fires turn 1." Both 2.4.1 (per
  deaths-retirements spec) and 2.4.2 (per this spec) now run from turn 1
  uniformly in 1772; only 2.4.3 retains a first-turn skip (and that's
  scenario-script-managed, not a phase-level skip).
- **Phase ordering** (`PHASE_SEQUENCE`, phases.ts:21–23): 2.4.1 →
  **2.4.2** → 2.4.3 in the `2.4 Events` bucket. **2.4.1 runs first**,
  meaning `deathYear`/`retiredYear` set by 2.4.1 this turn correctly excludes
  the dead/retired from 2.4.2's per-politician sweep. A `Frail` trait granted
  in 2.4.2 this turn does NOT apply to this turn's 2.4.1 (already ran), but
  **does** apply to next turn's 2.4.1 (correct: a politician who gets sick
  in 1772 has elevated mortality risk in 1774, not 1772). Confirmed.
- **`Politician` interface** (types.ts:442–477) already contains all the
  fields the spec mutates: `traits` (`Trait[]`), `skills` (`Skills`,
  integers 0–5), `pvCache`, `ideology`, `state`, `deathYear`, `retiredYear`,
  `command`. **No new Politician fields.**
- **`GameState` interface** (types.ts:717–773) contains all the fields
  the national pool mutates: `meters: NationalMeters` (revenue, economic,
  military, domestic, honest, quality, planet), `partyPreference: number`
  (-5..+5), `interestGroups: InterestGroupScores` (free-form
  `Record<string, number>` map). **No new GameState fields.** The national
  pool's effects array writes ONLY to these three surfaces (plus optional
  per-state meter shifts for region-tagged templates via the existing
  `State.industries` / state-level handles — see §1.4 effect taxonomy).
- **`Trait` union** (types.ts:62–108): the spec's event pool grants only
  traits that are NOT already owned by other systems (see §4 carve-out). No
  new trait literals are added by this spec.
- **`Era`** (types.ts:523): `'independence' | 'federalism' | 'nationalism'
  | 'modern'`. Event templates' `eras?: Era[]` tags use these literals.
- **`State['region']`** (types.ts:508): one of `'Northeast' | 'Midwest' |
  'South' | 'West' | 'Border' | 'Canada' | 'Caribbean' | 'Latin America' |
  'Pacific' | 'Atlantic'`. Region-gated templates filter
  `snap.states.find((s) => s.id === p.state)?.region` against the
  template's `regions?: State['region'][]` tag. Duel templates use
  `regions: ['South', 'Border']` in nationalism (the fading South) and are
  region-unrestricted in independence+federalism (duels happened
  everywhere, just denser in the South — handled by per-era weights, not
  the region gate). [B] National templates ALSO support `regions?` but
  semantics differ: a region-tagged personal template gates ELIGIBILITY
  (only politicians from those regions can fire it), while a region-tagged
  national template gates AFFECTED STATES (the effect applies to those
  regions' states' meters, not nationally). See §1.4 effect taxonomy.
- **`EventEntry.category`** (types.ts:628) currently includes `'event'`.
  Spec writes all 2.4.2 entries as `'event'`. **No new category added.**
  Filtering by phase=`'2.4.2'` in the new page distinguishes anytime events
  from era events (2.4.3) and from the death/retire bracket (2.4.1, which
  uses `'death'`/`'retire'` categories explicitly). [B] The new page's
  category filter ALSO distinguishes personal vs. national events via
  `meta.pool: 'personal' | 'national'` (see §4.2).
- **`MORTALITY_RULES.frailDeathMult = 1.5`** (types.ts:394): same-turn
  Frail-grant in 2.4.2 cannot retroactively affect this turn's 2.4.1; it
  applies next turn. The Frail acquisition log + the mortality bump
  compose cleanly without double-counting.
- **`refreshPv`** (pv.ts): PV depends on `currentOffice`, `skills`, `traits`,
  `command`. Spec calls `refreshPv` once at end of runner if any event
  mutated skill/command/traits (matches the 2.4.1 precedent's end-of-runner
  pattern flagged in `deaths-retirements.md` Open Question 10). National
  templates never mutate skills/traits/command so they don't trigger
  `refreshPv` on their own.
- **Trait-granting systems already in the engine** (the historian
  flagged these; verified via grep):
  - `IDEOLOGY_SHIFT_ODDS` (types.ts:209) — seeds `Ideologue`,
    `Impressionable`; runtime grants `Flip-Flopper` via `ffRisk`. **2.4.2
    MUST NOT grant these three.**
  - `CONVERSION_ODDS` (types.ts:224) — seeds `Loyal`, `Opportunist`.
    **2.4.2 MUST NOT grant these two.**
  - `RELOCATION_ODDS` (types.ts:197) — grants `Carpetbagger`, `Outsider`,
    `Controversial`, `Unlikable` (via `CARPETBAGGER_LADDER`). **2.4.2 MUST
    NOT grant `Carpetbagger` or `Outsider`.** `Controversial` and
    `Unlikable` are duplicated by anti-pattern (the relocation ladder
    holds them as relocation-side-effect, but historically they're broad
    enough to fire from non-relocation events — the spec grants them
    SPARINGLY in 2.4.2 only via the `Scandal: Verbal Disaster` and
    `Public Failure` templates respectively, flagged as a soft overlap
    with relocation's path).
  - `LEADERSHIP_RULES` (types.ts:331) — seeds `Ambitious` via
    `ambitiousSeedRate`; runtime grants `Failed Bid` via challenge
    failure. **2.4.2 MUST NOT grant these two.**
  - `TRACK_THEMED_TRAITS` (types.ts:173) — grants `Celebrity`, `Business`,
    `Media`, `Military`, `Naval`, `Crisis Manager`, `Leadership`,
    `Charismatic`, `Agriculture`, `Efficient`, `Economics`, `Education`,
    `Orator`, `Debater`, `Reformist`, `Integrity`, `Egghead`,
    `Harmonious`, `Manipulative`, `Kingmaker`, `Numberfudger` via
    career-track threshold rolls. The historian's binding fact #6 wants
    these to NOT be re-granted by random events — but **breakthrough**
    templates are the exception: `Orator` (Cross of Gold paradigm),
    `Charismatic` (single-event recognition), `Crisis Manager` (single
    crisis-management moment) are historically defensible as event-driven
    in addition to career-track-driven, and the user vision explicitly
    mentions skill/trait bumps. The spec grants ONLY these three from the
    `TRACK_THEMED_TRAITS` set, with low weight (each ~1–2% of pool); the
    other 18 stay career-track-owned.
  - `CAREER_RANDOM_NEGATIVES` (types.ts:183) — grants `Corrupt`,
    `Scandalous`, `Controversial`, `Flip-Flopper` via career-track random
    negatives. **2.4.2 grants `Corrupt` and `Scandalous` as the standard
    scandal-template outcomes** (the user vision explicitly names scandal
    as a flagship event); `Controversial` shared sparingly with
    relocation; `Flip-Flopper` NEVER from 2.4.2 (owned by 2.1.5).
  - **Background/identity traits owned by draft seeding only**
    (`Aristocratic`/`Frontier-Born` are N/A — not in the current
    `Trait` union per historian; `Naval`/`Military`/`Egghead`/`Education`/
    `Economics`/`Business`/`Agriculture`/`Environment`/`Media`/`Nationalist`/
    `Globalist` are biographical career-themed). **2.4.2 NEVER grants any
    of these.**
  - **`Traitor`** — historian flagged as Civil War / treason mechanic; if
    ever added belongs to a dedicated war system. **2.4.2 NEVER grants.**
  - **`Obscure`** — derived from career outcomes; not random. **2.4.2 NEVER
    grants.**
- **`rng.ts`**: all randomness via `chance(p)`, `pick(arr)`,
  `pickWeighted(opts)`, `rand()`. **Spec uses these exclusively** —
  determinism rules from CLAUDE.md.
- **`addLog`** (engine/log.ts:4): `addLog(snap, phase, category, text, meta?)`.
  Spec writes all events as `addLog(snap, '2.4.2', 'event', text, { templateId,
  politicianId, pool })` where `pool: 'personal' | 'national'` discriminates
  the two pools. National events use `politicianId: undefined`. The new
  `AnytimeEventsPage` filters the feed cheaply by `meta.templateId`,
  `meta.politicianId`, and `meta.pool`.
- **`pages/registry.ts`** + **`components/Sidebar.tsx`** — Spec adds one
  new `PageId: 'anytimeEvents'` entry plus a sidebar item in the existing
  `Events` group (the third item, after Event Log and War Dashboard).

## Mechanics (decided values)

### Layer 1 — Constants + data refactor (binding)

#### 1.1 New `ANYTIME_EVENTS_RULES` const

Placed after `MORTALITY_RULES` (currently ending at types.ts:409). Single
source of truth for the runner; zero magic numbers in the runner body.

```
export const ANYTIME_EVENTS_RULES = {
  // Per-politician annual fire chance. Historian's recommended 3–8%/yr
  // window; PM picks 5% as the midpoint. Across a 30-year career: ~78% of
  // politicians accumulate at least one anytime event (1 - 0.95^15 turns).
  baseFireChance: 0.05,

  // [B] Per-turn national-flavor pool fire chance. PM picks 0.70 — between
  // the historian's "world feels alive" suggestion and the conservative end.
  // At 70%/turn over a 30-turn game ≈ 21 national events surface — enough
  // for the world pulse to be visible without flooding the feed.
  nationalBaseFireChance: 0.70,

  // Per-era multiplier on `baseFireChance` — keeps independence slightly
  // quieter (smaller universe, less press coverage) and modern slightly
  // louder (more reporting threshold). Independence under-represents
  // duels which are out-of-pool until federalism; this multiplier keeps
  // expected-events-per-career roughly even across eras.
  //
  // [B] `nationalFireMult` is a parallel per-era lever on the national
  // pool — pre-1830 had thinner press infrastructure, so the national
  // pool runs slightly quieter in independence; modern era runs slightly
  // louder. The spread is narrower than `fireMult` because the national
  // pool's player-felt cost is meter ticks (cheap to absorb), not
  // career-altering trait stamps.
  //
  // [C] `scandalMagnitudeMult` is PROMOTED FROM INFORMATIONAL TO ENGINE
  // MATH in v1 per Amendment C. Applied to: (a) personal scandal template
  // PV / additional-trait-grant probability — see §3; (b) national
  // executive-scandal template `partyPreference` and `honest` magnitudes —
  // see §1.4 effect taxonomy.
  eraConfig: {
    independence: {
      fireMult: 0.8,
      nationalFireMult: 0.9,
      scandalMagnitudeMult: 0.5,
    },
    federalism: {
      fireMult: 0.9,
      nationalFireMult: 0.95,
      scandalMagnitudeMult: 0.7,
    },
    nationalism: {
      fireMult: 1.0,
      nationalFireMult: 1.0,
      scandalMagnitudeMult: 1.0,
    },
    modern: {
      fireMult: 1.1,
      nationalFireMult: 1.1,
      scandalMagnitudeMult: 1.3,
    },
  } as const satisfies Record<Era, {
    fireMult: number;
    nationalFireMult: number;
    scandalMagnitudeMult: number;
  }>,

  // Caps and floors.
  skillCap: 5,            // mirrors CLAUDE.md domain: skills are 0–5
  commandCap: 5,          // mirrors KINGMAKER_RULES.commandCap
  pvHitFloor: -25,        // worst single-event PV hit (career-end scandal)
  pvBumpCeil: 15,         // best single-event PV bump (breakthrough speech)

  // Career-end scandal: rare modern-only direct retire-induction.
  careerEndScandalShareOfScandalPool: 0.05,

  // [C] Amendment C: meter clamps for national-pool ticks. National
  // executive-scandal templates have their partyPreference / honest deltas
  // multiplied by scandalMagnitudeMult at apply time; the runner clamps the
  // final result to the existing -5..+5 partyPreference range and -5..+5
  // meter range to avoid scaled-up deltas overflowing.
  meterClampLow: -5,
  meterClampHigh: 5,
  partyPreferenceClampLow: -5,
  partyPreferenceClampHigh: 5,
} as const;

export const ANYTIME_EVENTS_FEED_CAP = 500;
```

The `satisfies Record<Era, ...>` exhaustiveness lever matches
`LEADERSHIP_RULES.eraConfig` / `MORTALITY_RULES.eraConfig`.

#### 1.2 Event template data shape (personal pool)

New file `src/data/anytimeEvents.ts` (NOT in types.ts — data lives in
`src/data/`). Exports a typed array of templates:

```
export interface AnytimeEventTemplate {
  id: string;                                   // stable; written to event meta
  category:                                     // narrative bucket
    | 'illness-acute' | 'illness-chronic' | 'illness-epidemic'
    | 'injury' | 'transport-accident'
    | 'violence-duel' | 'violence-assault' | 'violence-assassination'
    | 'scandal-financial' | 'scandal-sexual' | 'scandal-verbal'
    | 'breakthrough-speech' | 'breakthrough-crisis'
    | 'family-event' | 'financial-event' | 'war-service';
  eras?: Era[];                                 // omit = all eras
  regions?: State['region'][];                  // omit = all regions
  weight: number;                               // base pickWeighted weight
  // Per-era weight override (multiplicative). Useful when a template is
  // active in multiple eras but at sharply different rates (duel in
  // federalism 1.0 vs nationalism 0.2 fading).
  eraWeightMult?: Partial<Record<Era, number>>;
  // [C] Optional flag: if true, the runner applies eraConfig.scandalMagnitudeMult
  // to any pvHit / additional-trait-grant logic in the effects array. Set on
  // scandal-* category templates only. See §3 runner pseudocode.
  scandalScaled?: boolean;
  // Outcome description; the runner applies these in order.
  effects: AnytimeEventEffect[];
  // Text template; supports {first}, {last}, {state}.
  text: string;
}

export type AnytimeEventEffect =
  | { kind: 'grantTrait';     trait: Trait }
  | { kind: 'pvHit';           amount: number }   // negative number = PV drop
  | { kind: 'pvBump';          amount: number }   // positive PV gain (additive on next refreshPv via stored... see note)
  | { kind: 'skillBump';       skill: SkillKey; amount: number }
  | { kind: 'commandBump';     amount: number }
  | { kind: 'death' }                              // sets deathYear = current
  | { kind: 'forceRetire' };                       // sets retiredYear = current
```

> **Note on `pvHit`/`pvBump`.** `pvCache` is computed deterministically by
> `computePV` from skill/trait/command/office. A flat `pvHit` cannot be a
> raw `pvCache -= 12` write because the next `refreshPv` overrides it.
> **PM choice (binding):** `pvHit` is implemented as the runner stamping
> `Scandalous`/`Corrupt`/`Controversial` traits that already carry baseline
> PV deltas through `pv.ts:73–76` (NEGATIVE_TRAITS gives -5 each). The
> nominal magnitude in the template (`amount: -12`) is informational/UI-
> facing; the actual PV change comes from trait/skill mutations the
> effect array also applies. `pvBump` for breakthrough events similarly
> resolves via `+1 command` / `Orator` grant. NO direct `pvCache` writes
> by 2.4.2. This avoids fragility against `refreshPv` and keeps the runner
> pure. The `amount` field is kept for UI display and `meta.pvDelta`
> logging; runner asserts at template-validation time that any non-zero
> `pvHit`/`pvBump` template ALSO includes a trait/skill/command effect.
>
> **[C] Amendment C scaling pathway**: when `scandalScaled: true`, the
> runner additionally:
> 1. Multiplies the template's `pvHit.amount` by
>    `eraConfig[era].scandalMagnitudeMult` BEFORE writing it to the feed's
>    `meta.pvDelta` (informational); does NOT change the trait stamp count
>    at this step.
> 2. AT MULTIPLIER ≥ 1.0 (nationalism + modern): grants the FIRST trait
>    in the template's effects (typically `Scandalous`) AS USUAL, and
>    additionally grants `Corrupt` if not already present — a second
>    `-5` PV baseline that compounds. This makes a 1956 scandal sting
>    sharper than a 1856 scandal of the same template.
> 3. AT MULTIPLIER ≥ 1.2 (modern only): in addition to (1)+(2), increments
>    `p.flipFlopperPenalty` by `LEADERSHIP_RULES.failedBidPvStamp` (5) — a
>    one-time PV stamp via the existing post-failure penalty channel.
>    This delivers the historian's "modern scandal is sharper" without
>    inventing a new persistence field.
> 4. AT MULTIPLIER < 1.0 (independence + federalism): the second-trait
>    stamp from step (2) is SKIPPED. Pre-1880 scandals stamp only the
>    first trait. This is the engine-visible spread Acceptance Criterion
>    #35 requires.

#### 1.3 Pool size and authorship target (personal pool)

**Target: 33 distinct templates** (historian's "25–40" window, midpoint).
Authored across the 16 categories listed above (~2 templates per
category on average). Concrete authoring breakdown:

| Category | Count | Era distribution | Notes |
|---|---|---|---|
| `illness-acute` | 3 | All eras | Pneumonia, fever, cardiac (M only) |
| `illness-chronic` | 3 | All eras | TB (pre-1900), cirrhosis (all), cancer (M only) |
| `illness-epidemic` | 4 | I/F/N | Yellow fever (I/F), cholera (F), 1918 flu (N), polio (N) |
| `injury` | 2 | All eras | Hunting accident, fall |
| `transport-accident` | 5 | era-split | Horse fall (I/F), carriage (I/F), train wreck (F/N), auto crash (N/M), plane crash (M) |
| `violence-duel` | 2 | I/F + N(South) | Duel won (no harm), duel lost (Frail/death) |
| `violence-assault` | 1 | F/N | Caning / floor brawl, Sumner paradigm |
| `violence-assassination` | 2 | F-(rare)/N/M | Attempt survived, attempt killed |
| `scandal-financial` | 3 | All eras | Bribery exposed, insider speculation, federal investigation (post-1908) |
| `scandal-sexual` | 2 | All eras | Reynolds-style (pre-1880 mild), Hart/Weiner-style (post-1980 sharper) |
| `scandal-verbal` | 1 | All eras | Bad speech / gaffe |
| `breakthrough-speech` | 1 | All eras | Cross of Gold paradigm — grants Orator + command |
| `breakthrough-crisis` | 1 | All eras | Crisis-handled-well — grants Crisis Manager + command |
| `family-event` | 1 | All eras | Death of child/spouse — narrative-only, Frail rare |
| `financial-event` | 1 | All eras | Land speculation reverse / windfall |
| `war-service` | 1 | I/F/N/M (when at war) | Combat heroism — grants Military or Naval (NOT 2.4.2's grant; uses TRACK_THEMED — flagged as overlap) |

**Total: 33 templates** (close to target 32; the "war-service" template
overlaps the career-track theming system and is flagged in Open Questions
as a soft overlap; PM recommends keeping it but the architect can drop if
the overlap proves too messy).

The author writes the 33 templates in `src/data/anytimeEvents.ts` as a
single exported `ANYTIME_EVENT_TEMPLATES: AnytimeEventTemplate[]`. Each
template includes plain-English `text` with `{first}`, `{last}`, `{state}`
placeholders; the runner does `text.replace` substitution.

[C] **Scandal templates** (`scandal-financial`, `scandal-sexual`,
`scandal-verbal`, totaling 6 templates) all set `scandalScaled: true`. The
runner applies the Amendment C scaling pathway only to these 6 templates;
other templates ignore `scandalMagnitudeMult` entirely.

#### 1.4 National-flavor pool (Amendment B — binding)

New file `src/data/anytimeNationalEvents.ts` (sibling to
`src/data/anytimeEvents.ts`). Exports a typed array of templates with a
deliberately different shape from the personal pool because the effect
surface differs.

```
export interface AnytimeNationalTemplate {
  id: string;                                   // stable; written to event meta
  category:                                     // narrative bucket
    | 'economic-panic' | 'economic-boom' | 'economic-harvest'
    | 'economic-currency' | 'economic-tariff' | 'economic-commodity'
    | 'demographic-immigration' | 'demographic-migration'
    | 'demographic-urbanization' | 'demographic-frontier'
    | 'foreign-trade' | 'foreign-war-scare' | 'foreign-treaty'
    | 'foreign-ally-shift'
    | 'civic-court' | 'civic-state-ripple' | 'civic-executive-scandal'
    | 'cultural-revival' | 'cultural-reform' | 'cultural-technology'
    | 'natural-storm' | 'natural-epidemic';
  eras?: Era[];                                 // omit = all eras
  regions?: State['region'][];                  // [B] optional — see §1.4 effect taxonomy
  weight: number;                               // base pickWeighted weight
  eraWeightMult?: Partial<Record<Era, number>>;
  // [C] Optional flag: scandalScaled applies eraConfig.scandalMagnitudeMult
  // to executive-scandal templates' partyPreference / honest deltas at apply
  // time. Set on civic-executive-scandal templates only.
  scandalScaled?: boolean;
  effects: AnytimeNationalEffect[];
  // Text template; supports {era}, {region} (if regions is set). No politician
  // placeholders — national events don't reference individuals.
  text: string;
}

export type AnytimeNationalEffect =
  // Tick a national meter (clamped -5..+5 by the runner).
  | { kind: 'meterTick';   meter: MeterKey;     amount: number }
  // Tick interest groups by group id (free-form; matches existing usage).
  | { kind: 'interestTick'; group: string;       amount: number }
  // Nudge partyPreference (-5..+5 scalar, clamped by the runner).
  | { kind: 'partyPref';    amount: number }
  // [B] Region-scoped meter shift: when template.regions is set, apply the
  // delta to each state in that region. v1 uses State.bias as the surface
  // (already a -1..+1 typed field on State); future v2 may add a generic
  // per-state meter. Applies to all states in the template's regions only.
  | { kind: 'stateBias';    amount: number };
```

**Notes on the effect taxonomy:**

- `meterTick` is the workhorse — `economic` / `quality` / `honest` are the
  three most-used meters; `revenue` / `military` / `domestic` / `planet`
  are touched by ~2 templates each (war-scare ticks `military`, harvest
  ticks `revenue`, urbanization ticks `domestic`).
- `interestTick` writes to the free-form `InterestGroupScores` map. The
  pool uses these group ids (matching `InterestCardId` literals where
  applicable, free-form otherwise to match the current stub's usage):
  `BigAg`, `Nationalists`, `Immigrants`, `Nativists`, `Reformers`,
  `Workers`, `Manufacturers`, `Planters`, `WallStreet`, `MilitaryIndustrial`,
  `Settlers`, `FreeTrade`, `LawAndOrder`. Note the existing stub already
  uses `BigAg` and `Nationalists` as free-form keys; v1 keeps that
  convention rather than renaming to `InterestCardId` literals.
- `partyPref` writes to `gameState.partyPreference` (-5..+5, clamped by
  runner). Used by scandal templates and partisan-favoring events
  (Treasury scandal, "patriotic groundswell").
- `stateBias` is the region-scoping mechanism — when a template has both
  `regions: ['South']` and a `stateBias` effect, the runner iterates
  `snap.states.filter((s) => template.regions.includes(s.region))` and
  applies the delta to each state's `bias` (clamped -1..+1 per State
  type). This is the minimal v1 way to express region-scoped national
  events without inventing per-state meters.

**Pool size: 22 distinct templates** (Amendment B target 18–28). The
authoring breakdown:

| Category | Count | Era distribution | Notes (seed events from current stub marked *) |
|---|---|---|---|
| `economic-panic` | 2 | F/N/M | Panic of 1819 (F), 1837 (F), 1857 (N), 1873 (N), 1893 (N), 1907 (N), 1929 (M) — two templates with era-scaled flavor text |
| `economic-boom` | 1 | All | Generic boom; +economic, +revenue |
| `economic-harvest` | 1 | All | *Bumper harvest (current stub seed); +economic, +BigAg; region-tagged variant for `South`/`Midwest` |
| `economic-currency` | 1 | F/N | Currency crisis (specie suspension, free silver agitation, bimetallism); -economic, +Reformers |
| `economic-tariff` | 1 | F/N/M | Tariff debate ripples (Tariff of Abominations 1828, McKinley 1890, Smoot-Hawley 1930); +/-economic, +/-FreeTrade vs Manufacturers |
| `economic-commodity` | 1 | All | Commodity price shock (cotton, oil, wheat); -economic, +/-Planters per era |
| `demographic-immigration` | 2 | All | *Immigration wave (current stub seed); +Immigrants, +Nativists. Era variants: German/Irish (F), Southern/Eastern European (N), Latino/Asian (M) |
| `demographic-migration` | 1 | F/N | Westward / Great Migration (Black northern migration N late); +Settlers, +Workers |
| `demographic-urbanization` | 1 | N/M | Cities surge; +Manufacturers, -BigAg, +domestic |
| `demographic-frontier` | 1 | I/F/N | Frontier settlement push; +Settlers; region-tagged `West` |
| `foreign-trade` | 1 | All | Trade dispute / favorable trade news; +/-economic, +/-FreeTrade |
| `foreign-war-scare` | 1 | All | Rumors of war / sabre-rattling; +military, -economic, +MilitaryIndustrial |
| `foreign-treaty` | 1 | All | Treaty success / failure news; +/-partyPref (incumbent credit), +/-quality |
| `foreign-ally-shift` | 1 | All | Foreign-ally realignment (French alliance I, British rapprochement F, etc.); +diplomacy (via meter for v1) |
| `civic-state-ripple` | 1 | All | State-level scandal/event ripples national; -quality, -partyPref small |
| `civic-executive-scandal` | 1 | All | *Treasury scandal (current stub seed); -honest, -partyPref. **[C] scandalScaled: true** — magnitude per era |
| `cultural-revival` | 1 | I/F/N | Second Great Awakening (F), revivalism (N) — era-tagged; +Reformers, -quality (era-dependent), +Nativists in some flavors |
| `cultural-reform` | 1 | F/N/M | Reform-movement surge (abolition F-late/N, progressivism N, civil rights M); +Reformers, +/-partyPref |
| `cultural-technology` | 2 | era-split | Telegraph arrives (F post-1844), railroad expansion (F/N), automobile spread (N late + M), radio/TV (M), internet (M post-1995) — two templates split by communication-tech vs transport-tech |
| `natural-storm` | 1 | All | Hurricane / blizzard / drought (era-flavored); -economic, -quality; region-tagged variants for `South` (hurricane), `Northeast` (blizzard), `Midwest` (drought) |
| `natural-epidemic` | 1 | All | Yellow fever (I/F Philadelphia 1793), cholera (F 1832/49), 1918 flu (N), polio public health (N/M), modern pandemic (M); -quality, -economic, +Reformers |
| `civic-patriotic-groundswell` | 1 | All | *Patriotic groundswell (current stub seed); +Nationalists, +partyPref small for incumbent |

**Total: 22 templates.** The five `*`-marked seeds reproduce the current
stub's effects with era-tagged flavor text (a 1772 harvest reads
differently than a 1856 harvest than a 1956 harvest). The pool grows
substantially in economic, demographic, foreign, cultural, and natural
categories — answering Amendment B's "global economy could slow,
immigration could increase" examples directly.

**Era-strict authoring conventions** (validator-enforced):

- `economic-panic` templates with text mentioning specific historical
  panics (1819, 1837, 1857, 1873, 1893, 1907, 1929) set `eras` to the
  appropriate era; the generic `economic-panic` template is era-tagged
  to `federalism`/`nationalism`/`modern` (panics are post-1819).
- `cultural-technology` templates split by tech subfamily: a "telegraph
  spreads" template sets `eras: ['federalism', 'nationalism']` and
  carries text reading "the new telegraph network knits the country
  together" (only flavor that's era-legal). Radio sets
  `eras: ['modern']`. TV sets `eras: ['modern']` with text constrained
  to post-1947. Internet sets `eras: ['modern']` with text constrained
  to post-1995. The validator asserts no `cultural-technology` template
  with `eras: ['independence']` mentions "telegraph" / "radio" / "TV" /
  "internet" / "automobile" / "plane" / "railroad" (railroads post-1830,
  practically `federalism+`).
- `natural-epidemic` templates carry sub-id discrimination
  (`epidemic-yellow-fever`, `epidemic-cholera`, `epidemic-1918-flu`,
  `epidemic-polio`, `epidemic-modern`) with era-strict `eras` arrays
  matching the historian's binding fact #5 timeline. The validator
  asserts no `epidemic-polio` template has `eras: ['independence']` etc.
- `demographic-immigration` waves use era-strict flavor text: German
  + Irish (federalism), Southern/Eastern European (nationalism late),
  Latino/Asian (modern); no "Latino wave" template with
  `eras: ['independence']` — the validator catches this combination
  explicitly.

#### 1.5 Runner ordering of the two pools

[B] Per-turn ordering inside `runPhase_2_4_2_Anytime`:

1. **National-flavor roll first.** Single
   `chance(nationalBaseFireChance * nationalFireMult)` — if fires, draw one
   national template via era-filtered `pickWeighted`, apply effects, log
   `addLog(snap, '2.4.2', 'event', text, { templateId, pool: 'national',
   category })`. The national event publishes BEFORE per-politician events
   in the feed (chronologically same year; the page sorts year-desc and
   ties go to logging order — national-first is intuitive at-a-glance).
2. **Per-politician loop second.** For each alive non-retired non-dead
   politician, roll `chance(baseFireChance * fireMult)`; if fires, draw
   one personal template via era+region-filtered `pickWeighted`, apply
   effects, log
   `addLog(snap, '2.4.2', 'event', text, { templateId, politicianId, pool:
   'personal', category })`.
3. **Single `refreshPv` at end** if any politician's skill/command/traits
   changed during step 2. National events never trigger `refreshPv`
   (they don't touch politicians).

This means a given turn can publish: 0 events (~30% per turn — neither
pool fires for anyone), 1 event (~50% — one pool fires), 2+ events
(~20% — both pools fire, or multiple politicians fire). At baseline pool
balance, the player sees ~5 events/decade on the world axis and ~12
events/decade on the personal axis for a 50-politician roster.

### Layer 2 — Trait/skill carve-out (binding correctness constraint)

**Traits 2.4.2 MAY grant** (binding; personal pool only — national pool
NEVER grants traits):

- **Negatives from illness/injury/violence/scandal:**
  `Frail`, `Scandalous`, `Corrupt`, `Controversial`, `Unlikable`.
- **Positives from breakthrough events** (rare, themed):
  `Orator`, `Charismatic`, `Crisis Manager`.

**Traits 2.4.2 MUST NOT grant** (binding; owned by other systems):

- `Ideologue`, `Impressionable`, `Flip-Flopper` — owned by 2.1.5
  `IDEOLOGY_SHIFT_ODDS`.
- `Loyal`, `Opportunist` — owned by 2.1.6 `CONVERSION_ODDS.seed`.
- `Carpetbagger`, `Outsider` — owned by 2.1.4 `RELOCATION_ODDS.carpetbagger`
  ladder.
- `Ambitious`, `Failed Bid` — owned by 2.2.3 `LEADERSHIP_RULES`.
- `Kingmaker`, `Manipulative`, `Numberfudger`, `Leadership`, `Debater`,
  `Reformist`, `Integrity`, `Efficient`, `Magician`, `Harmonious`,
  `Egghead`, `Propagandist` — biographical/career-themed, owned by
  `TRACK_THEMED_TRAITS` and draft seeding.
- `Naval`, `Military`, `Education`, `Economics`, `Business`, `Agriculture`,
  `Environment`, `Media`, `Nationalist`, `Globalist`, `Celebrity` —
  background identifiers, owned by draft seed + career-track.
- `Traitor` — never in v1 (historian: belongs to dedicated war/treason
  mechanic).
- `Obscure` — derived from career outcomes; not random.
- `Puritan` — religious narrowness; historian's brief surfaces it as a
  possible Second Great Awakening grant, but PM defers because the
  spec's religious-conversion family delegates to 2.1.5 via NO direct
  grant. Reserved for a v2 religious sub-mechanic; **out of v1 grant set**.
  Flagged.

**Skills 2.4.2 MAY bump** (binding):

- `legislative` (breakthrough speech).
- `governing` (crisis-handled-well).
- `command` (breakthrough events; capped at `commandCap = 5`).

**Skills 2.4.2 MUST NOT bump** (binding; capacity/historicity):

- `admin`, `judicial`, `military`, `backroom` — historian's binding fact #6
  is most skeptical of these (Clay's compromise mastery, LBJ's Treatment,
  Reagan's TV mastery were all gradual career arcs, NEVER bumped by
  single events). These accrue ONLY via `TRACK_THEMED_TRAITS` thresholds.

Skill bumps are capped at `skillCap = 5`; if the politician's targeted
skill is already at 5, the bump effect no-ops (the rest of the event
fires normally — the template's `text` still publishes). NEVER a `-1
skill` event in v1; skill loss is out of scope.

### Layer 3 — Runner pseudocode (binding)

The new runner (semantics; architect picks final implementation shape):

```
function runPhase_2_4_2_Anytime(snap: FullGameSnapshot): void {
  const cfg = ANYTIME_EVENTS_RULES.eraConfig[snap.game.currentEra];
  const era = snap.game.currentEra;

  // [B] STEP 1 — National-flavor roll first.
  const nationalFireChance =
    ANYTIME_EVENTS_RULES.nationalBaseFireChance * cfg.nationalFireMult;
  if (chance(nationalFireChance)) {
    const nationalPool = ANYTIME_NATIONAL_TEMPLATES.filter((t) => {
      if (t.eras && !t.eras.includes(era)) return false;
      return true;
    });
    if (nationalPool.length > 0) {
      const weights = nationalPool.map((t) => {
        const eraMult = t.eraWeightMult?.[era] ?? 1;
        return { value: t, weight: t.weight * eraMult };
      });
      const tpl = pickWeighted(weights);
      applyNationalEffects(snap, tpl, cfg);  // see below
      const text = tpl.text.replace('{era}', era);
      addLog(snap, '2.4.2', 'event', text, {
        templateId: tpl.id,
        pool: 'national',
        category: tpl.category,
      });
    }
  }

  // STEP 2 — Per-politician loop.
  const fireChance = ANYTIME_EVENTS_RULES.baseFireChance * cfg.fireMult;
  let mutationCount = 0; // refreshPv suppressor

  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (!chance(fireChance)) continue;

    // Build the era+region-valid pool.
    const region = snap.states.find((s) => s.id === p.state)?.region;
    const pool = ANYTIME_EVENT_TEMPLATES.filter((t) => {
      if (t.eras && !t.eras.includes(era)) return false;
      if (t.regions && (!region || !t.regions.includes(region))) return false;
      return true;
    });
    if (pool.length === 0) continue;  // defensive

    // Era-weighted pickWeighted.
    const weights = pool.map((t) => {
      const eraMult = t.eraWeightMult?.[era] ?? 1;
      return { value: t, weight: t.weight * eraMult };
    });
    const tpl = pickWeighted(weights);

    // Apply effects in order.
    let didMutateSkillsOrTraits = false;
    for (const eff of tpl.effects) {
      switch (eff.kind) {
        case 'grantTrait':
          if (!p.traits.includes(eff.trait)) {
            p.traits.push(eff.trait);
            didMutateSkillsOrTraits = true;
          }
          break;
        case 'skillBump':
          if (p.skills[eff.skill] < ANYTIME_EVENTS_RULES.skillCap) {
            p.skills[eff.skill] = clamp(
              p.skills[eff.skill] + eff.amount, 0, ANYTIME_EVENTS_RULES.skillCap,
            );
            didMutateSkillsOrTraits = true;
          }
          break;
        case 'commandBump':
          if (p.command < ANYTIME_EVENTS_RULES.commandCap) {
            p.command = clamp(
              p.command + eff.amount, 0, ANYTIME_EVENTS_RULES.commandCap,
            );
            didMutateSkillsOrTraits = true;
          }
          break;
        case 'death':
          p.deathYear = snap.game.year;
          markPoliticianDead(snap, p); // shared helper extracted from 2.4.1
          break;
        case 'forceRetire':
          p.retiredYear = snap.game.year;
          markPoliticianRetired(snap, p); // shared helper
          break;
        case 'pvHit':
        case 'pvBump':
          // No direct pvCache write; the trait/skill effects in the same
          // template carry the actual PV delta. The `amount` is
          // informational for the feed entry's meta.
          break;
      }
    }

    // [C] Amendment C — scandal scaling pathway for scandalScaled templates.
    if (tpl.scandalScaled) {
      const mult = cfg.scandalMagnitudeMult;
      // Step (2): at multiplier ≥ 1.0, stamp Corrupt as second trait.
      if (mult >= 1.0 && !p.traits.includes('Corrupt')) {
        p.traits.push('Corrupt');
        didMutateSkillsOrTraits = true;
      }
      // Step (3): at multiplier ≥ 1.2 (modern), stamp PV penalty via
      // existing failedBidPvStamp channel.
      if (mult >= 1.2) {
        p.flipFlopperPenalty += LEADERSHIP_RULES.failedBidPvStamp; // 5
        didMutateSkillsOrTraits = true;
      }
      // Step (4): at multiplier < 1.0 (I/F), this branch isn't entered
      // — Corrupt second-trait is skipped. Only Scandalous from the
      // template's main effects array applies. Spread is now visible.
    }

    if (didMutateSkillsOrTraits) mutationCount++;

    const text = tpl.text
      .replace('{first}', p.firstName)
      .replace('{last}', p.lastName)
      .replace('{state}', p.state.toUpperCase());

    addLog(snap, '2.4.2', 'event', text, {
      templateId: tpl.id,
      politicianId: p.id,
      pool: 'personal',
      category: tpl.category,
    });
  }

  if (mutationCount > 0) refreshPv(snap);
}

// [B] National-effect applier — separate helper.
function applyNationalEffects(
  snap: FullGameSnapshot,
  tpl: AnytimeNationalTemplate,
  cfg: typeof ANYTIME_EVENTS_RULES.eraConfig[Era],
): void {
  const mult = tpl.scandalScaled ? cfg.scandalMagnitudeMult : 1;
  for (const eff of tpl.effects) {
    switch (eff.kind) {
      case 'meterTick': {
        const delta = eff.amount * mult;
        snap.game.meters[eff.meter] = clamp(
          snap.game.meters[eff.meter] + delta,
          ANYTIME_EVENTS_RULES.meterClampLow,
          ANYTIME_EVENTS_RULES.meterClampHigh,
        );
        break;
      }
      case 'interestTick': {
        snap.game.interestGroups[eff.group] =
          (snap.game.interestGroups[eff.group] ?? 0) + eff.amount;
        break;
      }
      case 'partyPref': {
        const delta = eff.amount * mult;
        snap.game.partyPreference = clamp(
          snap.game.partyPreference + delta,
          ANYTIME_EVENTS_RULES.partyPreferenceClampLow,
          ANYTIME_EVENTS_RULES.partyPreferenceClampHigh,
        );
        break;
      }
      case 'stateBias': {
        if (!tpl.regions) break; // region-scoped only
        for (const s of snap.states) {
          if (tpl.regions.includes(s.region)) {
            s.bias = clamp(s.bias + eff.amount, -1, 1);
          }
        }
        break;
      }
    }
  }
}
```

Key properties:
- **National-first → per-politician** ordering means the feed publishes
  the world event before the personal events for the same year — intuitive
  scanning.
- **Per-politician loop** (the binding shape from the user vision).
- **Skip dead/retired** at the top — 2.4.1 ran first this turn, so any
  newly-dead/retired politician from 2.4.1 is correctly excluded.
- **Per-event era+region filter** — guarantees no anachronistic templates
  fire (no auto crash in 1772; no horse fall in 2020 outside a region
  that allows it; the data file's `eras` tags do the work).
- **Weighted pick within the filtered pool** — `pickWeighted` from
  `rng.ts` is deterministic given the seed.
- **No double-grant** — `traits.includes(eff.trait)` guard before push.
  Idempotent: a Frail politician who rolls another illness event publishes
  the feed entry but doesn't double-grant; the event still "fires" for
  narrative purposes.
- **Single `refreshPv` at end** if any politician's skill/command/trait
  state changed — matches the 2.4.1 / 2.2.3 end-of-runner pattern.
- **`markPoliticianDead` / `markPoliticianRetired` shared helpers** —
  extracted from 2.4.1's `runPhase_2_4_1_Deaths` for reuse; both 2.4.1
  and 2.4.2 call them.
- [C] **Scandal magnitude scaling drives engine math** — the
  `scandalScaled` branch in the personal-loop adds a second trait stamp
  at multiplier ≥ 1.0 and a `failedBidPvStamp` at multiplier ≥ 1.2; the
  national `applyNationalEffects` multiplies meter / partyPreference
  deltas by `scandalMagnitudeMult` for executive-scandal templates.

### Layer 4 — UI page (`AnytimeEventsPage`)

New page `src/pages/AnytimeEventsPage.tsx`. Read-only; mirrors the
`FactionLeaderPage` / `FactionAlignmentsPage` pattern.

#### 4.1 Page id + registry

- `PageId: 'anytimeEvents'` appended to the `PageId` union and `Pages`
  record in `src/pages/registry.ts`.
- Sidebar entry added under the `Events` group at line 78 of `Sidebar.tsx`,
  third item after Event Log and War Dashboard:
  `{ id: 'anytimeEvents', label: 'Anytime Events' }`.

#### 4.2 Sections (minimum viable v1)

The page consumes `snap.events.filter((e) => e.phase === '2.4.2')` plus
`snap.politicians` for name resolution. No new snapshot shape required —
all data is already there via the existing event log.

1. **Header.** Title `Anytime Events — N events`. Cross-links to Event Log
   and Roster (same pattern as FactionLeaderPage cross-links).
2. **Filter row.** [B] Four dropdowns + one toggle:
   - **Pool filter** — `all` / `personal` / `national` (default `all`).
     Reads `meta.pool`. Lets the player narrow to one axis of the feed.
   - **Era filter** — defaults to `(current era)`, options: all four eras
     + `all`. Filters events by year-to-era mapping (helper consults
     `snap.game.currentEra` for the current era; per-event eras are derived
     by year — see Open Question 5).
   - **Category filter** — the 16 personal `AnytimeEventTemplate.category`
     values + the 22 national `AnytimeNationalTemplate.category` values
     + `all`. Cheap UI-side filter on `meta.category`. When `Pool` is set
     to `personal` the category dropdown narrows to personal categories
     only; ditto national. This avoids the dropdown ballooning to ~38
     items at `Pool: all`.
   - **Faction filter** — `all` (default) or `your faction` (filters to
     events whose `meta.politicianId` resolves to a player-faction
     member). National events have no `politicianId` and are always
     included regardless of faction filter (a global event is global —
     showing/hiding by faction makes no sense). Politicians whose
     faction has changed over time are matched to their **current**
     factionId (matches Roster's filter philosophy).
   - **Show retired/dead toggle** (default OFF) — when off, hides events
     for politicians where `p.deathYear || p.retiredYear`. National events
     are unaffected by the toggle. When on, shows all (the historical
     record).
3. **Feed.** Scrollable list (max-height `70vh`) of events, year-desc
   (newest at top), one row per event:
   - `[YEAR]` chip (tabular-nums).
   - [B] `pool` chip (`Personal` rose / `National` slate) for at-a-glance
     pool distinction. National events render with a globe icon prefix;
     personal events render with the politician's name as the row anchor.
   - Category icon/badge (color-coded by category family: illness =
     amber, scandal = rose, breakthrough = emerald, violence = red,
     accident = slate, economic = indigo, demographic = teal, foreign =
     violet, civic = blue, cultural = pink, natural = orange).
   - Politician name (personal only; linked — clicks dispatch a
     `setPoliticianFilter` local state, filtering the feed to that one
     person).
   - Event text (`{first} {last} ...` for personal; `{era}` /
     `{region}` substituted for national).
   - Effect chips: each `grantTrait` shows `+Trait`, each `skillBump`
     shows `+1 legislative`, etc. For national events, each `meterTick`
     shows `+1 economic`, `interestTick` shows `+1 Workers`, `partyPref`
     shows `partyPref -0.3`, `stateBias` shows `South bias -0.1`.
     Visual reinforcement of the mechanic.
4. **Per-politician drill-down (when politician filter is set).** A
   small card at the top of the feed shows the chosen politician's
   name, age, current state, ideology, factionId, and a count
   of anytime events ever fired on them (personal-pool only — national
   events excluded from the per-politician count by design). The feed
   below is filtered to that politician only. A "Clear" button resets
   the filter.
5. **Empty state.** "No anytime events match these filters." prompt.

**Out of v1 scope** for the page: per-politician timeline visualization
(timeline graph), event search-by-text, multi-politician comparison,
sparkline of "events per turn" history, national-meter-history graph
showing how a panic propagated. Filed under Out of Scope (§9).

#### 4.3 Pure read-only

NO buttons that mutate snapshot. NO `GameContext` mutator additions. NO
sidebar auto-navigation prompt. The page is informational — matches the
FactionAlignmentsPage / FactionLeaderPage convention.

## State shape (binding)

**No new fields on `Politician`, `Faction`, or `GameState`.** Specifically:

- 2.4.2 event records live in the existing `snap.events: EventEntry[]` feed
  with `phase: '2.4.2'`, `category: 'event'`, and `meta: { templateId,
  politicianId?, pool, category }`. National events omit `politicianId`.
- No `anytimeEvents?: AnytimeEntry[]` on `GameState` (parallel to
  `factionLeadership` etc.) — the event log is already the source of
  truth; a dedicated array would duplicate it.
- `ANYTIME_EVENTS_RULES` const + `ANYTIME_EVENTS_FEED_CAP = 500`
  exported from `types.ts`.
- `AnytimeEventTemplate` + `AnytimeEventEffect` types and the
  `ANYTIME_EVENT_TEMPLATES` array live in `src/data/anytimeEvents.ts` (NOT
  types.ts — data, not state shape). Types re-exported from
  `src/data/anytimeEvents.ts`.
- [B] `AnytimeNationalTemplate` + `AnytimeNationalEffect` types and the
  `ANYTIME_NATIONAL_TEMPLATES` array live in `src/data/anytimeNationalEvents.ts`
  (sibling file). Types re-exported from the same module.

**No save migration required.** Legacy saves load unchanged; the runner is
purely additive in behavior on the next tick (with the current stub
removed). The 5 current-stub events are absorbed into the national pool's
5 seed templates, so post-deploy 2.4.2 ticks still produce the familiar
"bumper harvest" / "Treasury scandal" flavor — just era-tagged and
expanded.

## Acceptance criteria

### State & types
- [ ] 1. `ANYTIME_EVENTS_RULES` const placed after `MORTALITY_RULES` in
  `types.ts`. Shape exactly per §1.1: `baseFireChance: 0.05`,
  `nationalBaseFireChance: 0.70`, `eraConfig` keyed by `Era` literals via
  `satisfies Record<Era, { fireMult: number; nationalFireMult: number;
  scandalMagnitudeMult: number }>`, `skillCap: 5`, `commandCap: 5`,
  `pvHitFloor`, `pvBumpCeil`, `careerEndScandalShareOfScandalPool`,
  `meterClampLow`, `meterClampHigh`, `partyPreferenceClampLow`,
  `partyPreferenceClampHigh`.
- [ ] 2. `ANYTIME_EVENTS_FEED_CAP = 500` exported from `types.ts`.
- [ ] 3. No new `Politician`, `Faction`, or `GameState` fields. No new
  `Trait` union members. No new `EventEntry.category` value (the existing
  `'event'` category is reused).
- [ ] 4. `AnytimeEventTemplate` and `AnytimeEventEffect` types defined in
  `src/data/anytimeEvents.ts` (exported). Backed by a single
  `ANYTIME_EVENT_TEMPLATES: AnytimeEventTemplate[]` of 32–33 entries.
- [ ] 4b. [B] `AnytimeNationalTemplate` and `AnytimeNationalEffect` types
  defined in `src/data/anytimeNationalEvents.ts` (exported). Backed by a
  single `ANYTIME_NATIONAL_TEMPLATES: AnytimeNationalTemplate[]` of 22
  entries.

### Data — personal-pool templates
- [ ] 5. Pool contains 32–33 personal templates spread across the 16
  categories per §1.3 table. Every template has `id`, `category`,
  `weight`, `effects`, `text`. Templates with era-bounded narrative
  (duels, epidemics, transport variants) set `eras` and (for region-bound
  templates) `regions`.
- [ ] 6. No template's `effects` array grants any of the **carved-out
  traits** (binding list in §2). Verified by a `validate()` helper that
  iterates `ANYTIME_EVENT_TEMPLATES` and asserts no `grantTrait` effect
  matches the forbidden set. The helper runs at runner-start and throws
  in dev (warns in prod) if violated.
- [ ] 7. No template's `effects` array bumps any of the **carved-out
  skills** (binding list in §2 — only `legislative`, `governing` allowed;
  `command` is separate via `commandBump`). Verified by the same helper.
- [ ] 8. **Anachronism check (personal pool)** — no template with
  `eras: ['independence']` has `category: 'transport-accident'` with text
  mentioning "auto" / "train" / "plane"; no template with `eras:
  ['modern']` has duel/yellow fever / cholera flavor. Spot-checked at
  authoring; the `validate()` helper also asserts known-bad combinations.
- [ ] 8b. [C] All 6 `scandal-*` category personal templates set
  `scandalScaled: true`. No other personal templates set the flag.
  Verified by `validate()`.

### Data — national-pool templates [B]
- [ ] 4c. [B] National pool contains 22 templates spread across the 22
  categories per §1.4 table. Every template has `id`, `category`,
  `weight`, `effects`, `text`. Templates with era-bounded narrative
  (panic-of-1893, telegraph, polio) set `eras`. Region-tagged templates
  (Southern crop, Western frontier, New England industrial) set `regions`
  AND include a `stateBias` effect.
- [ ] 4d. [B] The current stub's 5 events (bumper harvest, railroad
  accident, patriotic groundswell, immigration wave, Treasury scandal)
  exist as named templates in the national pool with their effect
  signatures preserved. The 5 templates are recognizable by `id`
  (`national:bumper-harvest`, `national:railroad-accident`,
  `national:patriotic-groundswell`, `national:immigration-wave`,
  `national:treasury-scandal`).
- [ ] 4e. [B] **Anachronism check (national pool)** — no
  `cultural-technology` template with `eras: ['independence']` mentions
  "telegraph" / "radio" / "TV" / "internet" / "automobile" / "plane" /
  "railroad". No `natural-epidemic` template with `eras: ['independence']`
  mentions "polio" / "1918 flu" / "modern pandemic". No
  `economic-panic` template with `eras: ['independence']` exists.
  Verified by the same `validate()` helper extended to the national pool.
- [ ] 4f. [C] The `national:treasury-scandal` template and the generic
  `civic-executive-scandal` template both set `scandalScaled: true`. No
  other national templates set the flag. Verified by `validate()`.

### Engine — runner rewrite
- [ ] 9. `runPhase_2_4_2_Anytime` (phaseRunners.ts:2062–2075) is replaced
  wholesale. The new body has zero hardcoded numbers in the per-event
  loop; all numeric reads come from `ANYTIME_EVENTS_RULES` or the
  template.
- [ ] 9b. [B] The runner first runs the national-flavor roll at
  `ANYTIME_EVENTS_RULES.nationalBaseFireChance * eraConfig[currentEra].
  nationalFireMult`. If fires, draws via `pickWeighted` from the
  era-filtered national pool and applies effects via `applyNationalEffects`.
  Logs with `meta.pool: 'national'`. THEN runs the per-politician loop.
- [ ] 10. The per-politician loop SKIPS `p.deathYear || p.retiredYear`
  at the top. Per-politician fire chance is `ANYTIME_EVENTS_RULES.baseFireChance
  * eraConfig[currentEra].fireMult`.
- [ ] 11. The era+region filter rejects templates whose `eras` doesn't
  include the current era OR whose `regions` doesn't include the
  politician's state's region. Region lookup is
  `snap.states.find((s) => s.id === p.state)?.region`.
- [ ] 12. The weighted pick uses `pickWeighted(rng.ts)` with per-template
  `weight * (eraWeightMult?.[era] ?? 1)`. The same shape applies to both
  pools.
- [ ] 13. Trait grants are guarded by `!p.traits.includes(eff.trait)` — no
  duplicate traits.
- [ ] 14. Skill bumps respect `skillCap = 5`; bumps to a skill already at
  5 no-op (the event still publishes a feed entry; rest of effects fire).
- [ ] 15. `command` bumps respect `commandCap = 5`; same no-op rule.
- [ ] 16. `death` effect sets `p.deathYear = snap.game.year`, calls
  `markPoliticianDead`, and mirrors the cross-system cleanup from 2.4.1
  (`factionLeaderOf` + protégé chains). Architect extracts the cleanup
  into a shared `markPoliticianDead(snap, p)` helper used by BOTH 2.4.1
  and 2.4.2 (refactor of `runPhase_2_4_1_Deaths`).
- [ ] 17. `forceRetire` effect sets `p.retiredYear = snap.game.year`,
  calls `markPoliticianRetired`, and mirrors the 2.4.1 cross-system
  cleanup via a parallel shared helper.
- [ ] 18. The runner is pure over `snap`; uses only `chance`,
  `pickWeighted`, `pick`, `clamp` from `rng.ts`. **No `Math.random`.**
- [ ] 19. A single `refreshPv(snap)` call at end-of-runner if any
  politician's skill/command/traits changed (mirrors 2.4.1 pattern).
  National-only turns (no politician mutations) do NOT trigger
  `refreshPv`.
- [ ] 20. Each fired event writes `addLog(snap, '2.4.2', 'event', text,
  { templateId, politicianId?, pool, category })`. Text uses `{first}`,
  `{last}`, `{state}` substitution for personal events; `{era}` /
  `{region}` substitution for national events. National events omit
  `politicianId` from meta.
- [ ] 20b. [B] National effects writer (`applyNationalEffects`) clamps
  meter writes to `[meterClampLow, meterClampHigh]` and partyPreference
  writes to `[partyPreferenceClampLow, partyPreferenceClampHigh]`.
  `interestTick` writes are uncapped (matching existing engine convention
  for `InterestGroupScores`). `stateBias` writes clamp per-state to
  `[-1, 1]`.
- [ ] 20c. [C] When applying a `scandalScaled: true` national template,
  `applyNationalEffects` multiplies `meterTick` and `partyPref` effect
  amounts by `eraConfig[era].scandalMagnitudeMult` BEFORE writing. The
  `interestTick` and `stateBias` deltas are NOT scaled by the
  multiplier in v1 (they're not the "media reach" levers).

### Engine — scandal magnitude scaling [C]
- [ ] 20d. [C] The personal-loop's scandalScaled branch operates as
  pseudocode §3:
  (i) `tpl.scandalScaled === true` triggers the branch;
  (ii) at `mult >= 1.0` the runner stamps `Corrupt` if not already
       present (becomes a second `Scandalous`-style baseline -5);
  (iii) at `mult >= 1.2` (modern only at the spec's defaults) the
        runner increments `p.flipFlopperPenalty` by
        `LEADERSHIP_RULES.failedBidPvStamp` (5);
  (iv) at `mult < 1.0` (independence + federalism) neither extra stamp
       fires; the template's main effects array still applies.
- [ ] 20e. [C] The scandal-magnitude spread is observably visible in
  playtest: a 1772 senator scandal stamps `Scandalous` only (PV -5);
  a 1956 senator scandal stamps `Scandalous` + `Corrupt`
  (PV -10) + a `flipFlopperPenalty += 5` (effective PV -15). See
  Acceptance Criterion #35 playtest verification.

### Engine — phase ordering + first-turn gate [A]
- [ ] 21. [A] `phases.ts:113` line `if (phaseId === '2.4.2') return false;
  // no anytime events` is **REMOVED**. 2.4.2 fires on the 1772 first
  turn alongside 2.4.1 (which also fires from turn 1 per the
  deaths-retirements spec). Architect's action: single-line deletion.
- [ ] 22. `PHASE_SEQUENCE` order (phases.ts:21–23) is unchanged: 2.4.1 →
  2.4.2 → 2.4.3. Verified that a Frail trait granted in 2.4.2 turn N does
  NOT retroactively affect 2.4.1 turn N (already ran) but DOES affect
  2.4.1 turn N+1.

### UI — Anytime Events page
- [ ] 23. New page `src/pages/AnytimeEventsPage.tsx` is purely read-only;
  no GameContext mutators added; no sidebar auto-nav ref.
- [ ] 24. Page id `'anytimeEvents'` is added to `PageId` union and `Pages`
  record in `src/pages/registry.ts`.
- [ ] 25. Sidebar (`src/components/Sidebar.tsx`) adds an `Anytime Events`
  entry in the Events group below `Event Log` and `War Dashboard`.
- [ ] 26. Page Header: `Anytime Events — N events` count where N is the
  count of `snap.events.filter((e) => e.phase === '2.4.2')`. Cross-links
  to Event Log and Roster.
- [ ] 27. [B] Filter row: **Pool dropdown** (`all` / `personal` /
  `national`, default `all`), Era dropdown (default current era),
  Category dropdown (default `all`, categories narrow by Pool selection),
  Faction dropdown (`all` / `your faction`, default `your faction`),
  `Show retired/dead` toggle (default OFF). Component-state via
  `useState`, NOT persisted in snapshot.
- [ ] 28. [B] Feed: year-desc rows, max-height `70vh` scrollable,
  `pool` chip (Personal / National), color-coded category badge,
  politician name (personal only; clickable → sets politician filter),
  event text, effect chips (`+Trait`, `+1 skill`, `+1 economic`,
  `partyPref -0.3`, etc.).
- [ ] 29. Per-politician drill-down: clicking a politician name filters
  the feed to that politician AND shows a small summary card at the top
  (name, age, state, ideology, anytime-event count — personal only). A
  "Clear" button resets.
- [ ] 30. Empty state: "No anytime events match these filters." when
  filtered results are zero.

### Build & playtest
- [ ] 31. `npm run build` passes (typecheck + Vite bundle).
- [ ] 32. **Playtest 1772.** Start the scenario. [A] 2.4.2 fires on
  turn 1 — observe the national pool potentially firing (~70% chance,
  fireMult-adjusted to ~63%) and personal events potentially firing
  (~4% × roster size). **NO** auto-crash, plane-crash, polio,
  telegraph, railroad, or modern-pandemic events appear. Duels may
  appear in personal pool regardless of region (1772 duels happened
  everywhere). Yellow fever appears as a category; no polio. Anytime
  Events page renders with the new entries; pool filter works.
- [ ] 33. **Playtest 1856.** Advance ~10 turns. Observe at least 2–3
  personal scandals, 1–2 illnesses (cholera plausible at this date),
  0–1 duels (region-gated for Southern politicians in the late
  nationalism approach), AND ~6–8 national-pool events covering at
  least 3 distinct categories (e.g. one economic-panic, one
  demographic-immigration, one cultural-revival). Verify a politician
  who acquires `Frail` this turn shows elevated mortality risk on the
  next turn's 2.4.1.
- [ ] 34. **Anytime Events page playtest.** Filter to `Pool: personal`;
  navigate to a politician with at least one event; verify the
  drill-down card renders; verify effect chips show; verify the
  category filter narrows the feed. Switch to `Pool: national`; verify
  the politician column is empty / globe icon shows; verify
  partyPreference / meter effect chips render.
- [ ] 35. [C] **Era-scaled scandal magnitude playtest.** Trigger a
  scandal-template fire in 1772 (e.g. force-roll via console / observe
  in normal play). Verify: 1772 senator scandal stamps `Scandalous`
  only (PV impact -5; flipFlopperPenalty unchanged). Trigger the same
  scandal-template id in 1956. Verify: 1956 senator scandal stamps
  `Scandalous` + `Corrupt` (PV impact -10) + flipFlopperPenalty += 5
  (effective PV impact -15). The per-era spread is observable in the
  Roster PV column AND on the Anytime Events page's effect chips.
- [ ] 36. [B] **National-pool seed-template verification.** Start any
  scenario, advance turns until one of the 5 seed templates fires
  (~70% × 5/22 = ~16%/turn — usually within 6 turns). Verify the
  fired event reads sensibly with era flavor (a 1772 "bumper harvest"
  reads differently from a 1856 one). Verify the meter / interestGroup
  ticks land in the GameState (visible on the relevant meter chip in
  the Header / on the Roster's faction interest summary).

## Worked examples

### Example A — 1772 Independence, 50-year-old healthy Northeast senator

- `cfg.fireMult = 0.8` ⇒ personal fire chance `0.05 * 0.8 = 4%/yr`.
- `cfg.nationalFireMult = 0.9` ⇒ national fire chance `0.70 * 0.9 =
  63%/yr`. National pool is dominated by independence-eligible
  templates: harvest, immigration wave (smaller-scale early-Republic
  flavor), patriotic-groundswell, foreign-trade (Atlantic trade), Second
  Great Awakening cultural revival.
- Personal pool filter: all templates with `eras` including
  `'independence'` (or no `eras` tag). Region-gated `Southern Duel
  (fading)` excluded.
- Weighted draws favor: illness (acute fevers), duels (universal in I),
  scandal-financial (Reynolds-style, **[C] scandalScaled** with
  `scandalMagnitudeMult = 0.5` ⇒ only `Scandalous` stamps, no `Corrupt`,
  no `flipFlopperPenalty` bump).
- Outcome distribution roughly: 35% illness, 20% transport (horse fall),
  20% scandal-financial (mild, stamps only `Scandalous`), 15% duel,
  10% other.

### Example B — 1956 Modern, 70-year-old frail South governor

- `cfg.fireMult = 1.1` ⇒ personal fire chance `0.05 * 1.1 = 5.5%/yr`.
- `cfg.nationalFireMult = 1.1` ⇒ national fire chance `0.70 * 1.1 =
  77%/yr`. National pool includes economic-panic (1957–58 recession
  flavor), demographic-urbanization, cultural-technology (TV era),
  natural-epidemic (polio public-health), foreign-war-scare (Cold War
  flavor).
- Personal pool: ALL modern-era templates including auto crash, plane
  crash, modern scandal, modern epidemic. NO duel (eras excludes M).
- This politician already has `Frail`; if an illness fires, the trait
  isn't re-granted (guard). The event still publishes for narrative.
- [C] **Modern scandal scaling**: `scandalMagnitudeMult = 1.3`.
  If a scandal template fires:
  - Template's primary trait `Scandalous` stamps (PV -5).
  - At `mult >= 1.0`: `Corrupt` also stamps (PV -5 more = -10).
  - At `mult >= 1.2`: `flipFlopperPenalty += 5` (effective PV -15).
  Compared to the same template firing in Example A (only `Scandalous`,
  PV -5), the modern impact is **3× sharper** — the historian's binding
  fact #3 spread is engine-visible.

### Example C — 1808 Federalism, 40-year-old Southern representative

- `cfg.fireMult = 0.9` ⇒ personal fire chance `0.05 * 0.9 = 4.5%/yr`.
- `cfg.nationalFireMult = 0.95` ⇒ national fire chance `0.665/yr`.
  National pool includes panic-of-1819 (year-bounded), cultural-revival
  (Second Great Awakening peak), foreign-treaty (Embargo Act flavor),
  natural-epidemic (yellow fever 1793–1805 windowed).
- Personal pool: federalism-eligible templates including duels (universal
  in F) and yellow fever (active in F). Auto/plane/polio excluded.
- The Southern region is NOT a hard gate in federalism (duels universal);
  it IS a hard gate in nationalism where duel templates have `regions:
  ['South', 'Border']`. Documented.
- [C] **Federalism scandal scaling**: `scandalMagnitudeMult = 0.7`.
  Below the 1.0 threshold, so scandal templates stamp ONLY their
  primary trait — no `Corrupt`, no `flipFlopperPenalty` bump. A 1808
  scandal stings like a 1772 scandal stings, ~2× less than a 1956
  scandal.

### Example D — 1772 Independence, 28-year-old healthy West-region senator

- Same personal fire chance as Example A.
- Pool: independence-tagged templates. Note: "West" as a region in 1772
  is rare (`expansionStates.ts` may or may not seed Western states yet)
  but if a politician's state.region is one the template's `regions`
  doesn't include, those templates are filtered. No region-bound
  templates are active in independence era in the v1 personal pool, so
  this is practically equivalent to Example A.

### Example E [B] — National pool firing solo (Example A turn, none of
the senator's personal-pool roll lands)

- National pool fires (`chance(0.63)` lands): picks a template like
  `national:patriotic-groundswell` (one of the 5 seeded from the
  current stub). Effects: `interestTick: Nationalists +2` and
  `partyPref: +0.1` (incumbent credit). Feed entry:
  *"A patriotic groundswell sweeps the colonies."* with chips
  `+2 Nationalists` and `partyPref +0.1`.
- The senator's per-politician roll fails (`chance(0.04)` doesn't
  land). No personal event this turn for him.
- Net feed for the turn: one national-pool entry.

### Example F [B] — Region-tagged national fires in Civil-War-approach
nationalism (1858)

- Template `national:harvest-southern-collapse` fires (eras includes
  `nationalism`, `regions: ['South']`, `category: 'economic-harvest'`).
- Effects: `meterTick: economic -1` (national signal), `stateBias: -0.1`
  scoped to all `South`-region states (applied to each).
- Feed entry: *"Cotton-belt harvest fails across the South — economic
  pressure builds."* with chips `economic -1`, `South bias -0.1`.
- Personal-pool roll for each Southern senator independently rolls; some
  may fire personal scandal / illness events the same year. The two
  pools compose narratively.

## Edge cases

- **Politician dies in 2.4.1 same turn.** 2.4.1 ran first; their
  `deathYear` is set; 2.4.2's `if (p.deathYear || p.retiredYear) continue`
  excludes them. No event fires on dead politicians.
- **Politician retires in 2.4.1 same turn.** Same as above —
  `retiredYear` set; excluded from 2.4.2 sweep.
- [A] **Turn 1 of 1772.** Per Amendment A, `phases.ts:113` is removed
  and 2.4.2 fires turn 1. The national pool rolls at ~63% (independence
  `nationalFireMult` applied to 0.70 baseline); the personal pool rolls
  per-founder at ~4% (independence `fireMult` applied to 0.05).
  Inaugural-roster founders can eat a scandal/illness on turn 1; this
  is intentional. No special-casing required in the runner.
- **Politician acquires `Frail` in 2.4.2 turn N.** Saved in `traits`.
  Next turn (N+1), 2.4.1 picks up the trait and applies the `×1.5` death
  multiplier from `MORTALITY_RULES.frailDeathMult`. **NOT retroactive** to
  this turn's 2.4.1.
- **A politician already has every Trait the pool grants.** Any trait
  grant no-ops via the `includes` guard. The event still publishes the
  feed line ("Senator X delivers a memorable speech.") — narrative
  consistency, but no game-state mutation beyond the log. Acceptable.
- **A breakthrough speech bumps `+1 command` on a politician already at
  `command = 5`.** Clamp no-ops. Feed entry publishes; no PV delta from
  command; rest of effects (trait grant if any) fire.
- **A `pvHit` template with no trait/skill effect.** Disallowed by
  authoring convention (the runner's design assumes PV deltas come from
  trait/skill mutation only). If an authoring mistake ships such a
  template, the runner publishes the feed entry but no PV changes —
  silent degradation, no crash. The `validate()` helper warns in dev.
- **Region lookup fails** (politician's `state` isn't in `snap.states`).
  `region` is `undefined`; templates with a `regions` tag are filtered
  out. Templates with no `regions` tag still fire. Defensive default;
  matches the runner's resilience pattern in 2.1.4 relocations.
- **The pool is empty after filtering** (no era+region matches — e.g., a
  scenario at a transitional moment with very narrow templates). The
  `if (pool.length === 0) continue` skips this politician's roll.
  Acceptable.
- **A `forceRetire` template fires on the player's faction leader.**
  Same path as 2.4.1 retire: `markPoliticianRetired` clears
  `factionLeaderOf`; the next 2.2.3 Step 2 invalidation runs an Election
  (per Faction Leaders spec). Documented; correct.
- **Two scandals fire on the same politician across two consecutive
  turns.** Both publish; second `Scandalous` grant no-ops (already has).
  [C] In nationalism/modern, the second scandal's `Corrupt` second-stamp
  also no-ops if already granted from the first. But the
  `flipFlopperPenalty += 5` IS applied a second time (the channel is
  additive, not idempotent). A politician hit by 3 modern scandals
  accumulates +15 `flipFlopperPenalty`. Acceptable — the narrative
  records all three events, and the cumulative PV cost is real.
- **Anytime event grants `Frail` AND `Crisis Manager` from the same
  template.** Both grant; both compose into 2.4.1's `1.5 * 0.85 =
  1.275` mortality multiplier per the deaths-retirements spec. Edge
  case acknowledged (no template currently grants both — would be
  authoring weird — but the runner handles it).
- [B] **National pool fires but personal pool fires nothing.** Common
  case (~30% of turns). One national-feed entry posts; the turn's
  per-politician loop completes silently. Feed displays one event.
- [B] **National pool fires the same template across consecutive
  turns.** Allowed — there's no "fired this turn" gate on the national
  pool's `pickWeighted`. Across 30 turns the same template can fire
  3+ times; this is intentional (panics repeat; epidemics recur). v2
  may add a per-template fatigue / cooldown.
- [B] **Region-tagged national template fires but no states match the
  template's regions** (e.g., a `regions: ['West']` template fires in
  1772 when no states have `region === 'West'`). The `stateBias`
  effect's loop matches zero states; the other effects (meterTick,
  interestTick, partyPref) still apply nationally. Defensive; doesn't
  crash. Flagged.
- [B] **National pool's interestGroup tick writes to a key not present
  in `interestGroups`.** Uses the `?? 0` fallback (`snap.game.interestGroups[eff.group]
  ?? 0`) — initializes to 0 then adds. Matches current stub's pattern
  for `BigAg` and `Nationalists`.
- [C] **A scandalScaled personal template fires on a politician with
  no `currentOffice`.** PV impact still lands (via the trait stamps);
  `flipFlopperPenalty` is on the politician, not on the office. The
  scandal scales independent of office. Documented.
- [C] **A scandalScaled national template fires when partyPreference
  is already at -5 (or +5).** The scaled delta is computed first
  (`amount * mult`), then clamped on write. No overflow. The clamp is
  in `applyNationalEffects`.
- **Save migration.** No new state fields; legacy saves load unchanged.
  First post-deploy 2.4.2 tick uses the new pools; no backfill of
  historical anytime events.

## Out of scope

- **Hidden / visible illness modeling** (Wilson's stroke). All v1 events
  publish a feed entry uniformly. Hidden incapacity is a v2 mechanic.
- **Direct `ideology` mutation.** Religious/ideological conversion
  templates grant `Reformist`/`Puritan` trait that biases 2.1.5's
  ideology shifts on subsequent turns; 2.4.2 never directly writes
  `p.ideology`. (PM further deferred `Puritan` to v2 — see §2.)
- **Skill bumps to `admin`/`judicial`/`military`/`backroom`.** Per
  historian binding fact #6 and the carve-out (§2). Career-track threshold
  rolls own these.
- **Per-event animations / modals.** Feed-line + page entry only.
- **Cross-politician event chains** (e.g., a duel template that picks
  TWO politicians: the duelists). v1 grants single-politician events;
  duel templates implicitly imply an off-camera opponent but only mutate
  the rolling politician's state. Documented; multi-politician duels are
  v2.
- **Age-modulated weighting on epidemic / cardiac events.** A 70-year-old
  isn't more likely than a 30-year-old to fire a cardiac event in v1.
  Historian's fact #5 ("epidemic disease was a politician-mortality
  factor") suggests this is a v2 polish; v1 ships uniform per-template
  weight. Flagged.
- **`Politician.scandalCount` or similar accumulating field.** No new
  fields. Two scandals on the same politician compose via the `Scandalous`
  trait baseline only — no escalating per-incident penalty in v1.
  [C] Amendment C's `flipFlopperPenalty +=` accretion IS per-incident
  accumulating, but it uses an existing field, not a new one.
- **Save migration / backfill** of historical 2.4.2 events on legacy
  saves. Pools start fresh on next tick.
- **2.4.1 / 2.4.3 changes.** 2.4.1 gains a refactored `markPoliticianDead`
  / `markPoliticianRetired` helpers extracted for 2.4.2 reuse (criterion
  #16–17), but its mortality math is unchanged. 2.4.3 unchanged.
- **`Show retired/dead`-toggle styling on the page.** Toggle is binary;
  past politicians' events show with no extra muting in v1 (the toggle
  only includes/excludes the rows, doesn't restyle them). v2 may add
  muted styling consistent with Roster.
- **`AnytimeEventTemplate` authoring UI in-game.** Templates are
  source-controlled in `src/data/anytimeEvents.ts` and
  `src/data/anytimeNationalEvents.ts`. No "Add custom anytime event"
  page.
- [B] **National pool's per-template fatigue / cooldown.** v1 allows
  consecutive same-template firings. v2 may add a per-template
  `cooldownTurns` field.
- [B] **National pool's per-state granular meter shifts beyond
  `stateBias`.** v1 uses `State.bias` as the only per-state lever for
  region-tagged events. v2 may add per-state economic / quality meters
  if the State type grows them.
- [C] **`scandalMagnitudeMult` applied to non-scandal templates.** v1
  scopes the multiplier to templates flagged `scandalScaled: true` only.
  v2 may extend the concept to "mediaReachMult" affecting breakthrough
  templates' upside scaling (a Cross-of-Gold speech in 1896 was
  multiplicatively bigger than the same speech in 1796 due to
  telegraph + mass press), but v1 ships the asymmetric "scandals scale,
  breakthroughs don't" simplification.

## Open questions / assumptions

### Resolved by PM at Checkpoint 1 with recommended defaults

1. **Skill bumps in pool — yes, ~10% of pool, themed only** (PM stance on
   Tension 1, riskiest first). Vision explicitly mentions skill bumps;
   historian fact #6 prefers latent-ability surfacing. PM ships **TWO
   themed skill-bump templates** in the pool: `breakthrough-speech` grants
   `Orator` + `+1 command` (+ very rarely `+1 legislative`); `breakthrough-crisis`
   grants `Crisis Manager` + `+1 command` (+ very rarely `+1 governing`).
   That's ~6% of the 33-template pool (2 templates) — under historian's
   skeptical threshold. Skill-bump effects use `+1` only, capped at 5.
   `+1 admin` / `+1 judicial` / `+1 military` / `+1 backroom` events do
   NOT exist in v1. **Risk**: if playtest finds the breakthrough events
   too rare to feel rewarding, raise the per-template `weight` or add a
   third breakthrough variant.

2. **Trait carve-out enforced by runtime validator** (PM stance on
   Tension 2). The `validate()` helper at runner-start asserts the
   forbidden-trait set. Throws in dev; warns in prod. Cheap; catches
   authoring drift. Verified per binding §2 list.

3. **Region tag taxonomy** (PM stance on Tension 3) — `regions?:
   State['region'][]` per template, using the existing `State['region']`
   literal union. Duels in nationalism use `regions: ['South', 'Border']`;
   duels in independence + federalism have NO `regions` tag (universal in
   those eras). This is the minimal taxonomy that respects the historian's
   "Southern bias post-1830" without inventing a new `Region` enum. [B]
   Extended to the national pool: a region-tagged national template
   restricts the scope of its `stateBias` effect to states in those
   regions, NOT eligibility of who can trigger it (since it's a per-turn
   roll, not a per-politician roll).

4. [C] **Per-era scandal magnitude scaling — PROMOTED to engine math in
   v1** (Amendment C). Originally PM-bound as UI-color only; user override
   binds it to engine math:
   - scandalScaled personal templates stamp a second trait (`Corrupt`)
     at `mult >= 1.0` (nationalism + modern), and additionally bump
     `flipFlopperPenalty` by 5 at `mult >= 1.2` (modern).
   - scandalScaled national templates multiply `meterTick` and
     `partyPref` deltas by `scandalMagnitudeMult` at apply time.
   - Independence (`mult = 0.5`) and federalism (`mult = 0.7`) scandals
     stamp only the primary trait — historian's "Reynolds-affair fade"
     framing is engine-visible.
   - Visible spread playtest criterion: see Acceptance Criterion #35.

5. [B] **National-level events — KEPT AND GROWN to 22 templates**
   (Amendment B). Originally PM-bound to rip the current stub entirely;
   user override binds:
   - 22 national templates across 22 categories (economic, demographic,
     foreign, civic, cultural, natural).
   - The 5 current-stub events become 5 named seed templates in the
     new pool with era-tagged flavor.
   - Per-turn fire rate 70% (baseFireChance) × per-era `nationalFireMult`
     (0.9 / 0.95 / 1.0 / 1.1).
   - National templates NEVER mutate politicians — that's the personal
     pool's job.
   - Region tagging supported via the `regions?` field + `stateBias`
     effect kind.
   - Anachronism enforcement extended to the national pool: no
     telegraph pre-1844, no polio pre-1900, no internet pre-1995, etc.

6. **UI page scope** (PM stance on Tension 6). Minimum viable: feed +
   4-axis filter row (Pool / Era / Category / Faction) + per-politician
   drill-down. Out-of-v1: timeline visualization, multi-politician
   compare, per-template stats page, national-meter-history graph.
   Filed in Out of Scope.

7. [A] **First-turn skip REMOVED for 1772** (Amendment A). Originally
   PM-bound to keep `phases.ts:113`; user override binds the line's
   removal. 2.4.2 fires on turn 1 of 1772 alongside 2.4.1 (also
   removed in deaths-retirements). Founders eat the rolls.

8. **Pool size — personal 32-33, national 22.** Historian window
   for personal 25–40 (PM picks low-mid); Amendment B target for
   national 18–28 (PM picks midpoint). Authoring cost balanced;
   easy to expand later via additional category coverage.

9. **Fire rate: 5%/politician/year (personal), 70%/turn (national).**
   Historian's window for personal 3–8%/yr; PM picks midpoint. Per-era
   `fireMult` tilts (-20% / -10% / 0% / +10%) across the four eras for
   personal. National `nationalFireMult` tilts (-10% / -5% / 0% / +10%)
   — narrower spread because national-pool cost is meter ticks not
   trait stamps.

10. **`pvHit`/`pvBump` magnitude flow.** Direct `pvCache` writes are
    out — the runner stamps traits/skills/command and lets `refreshPv`
    recompute PV deterministically. Template `amount` is informational
    for the feed/UI. **Architect note**: the `validate()` helper asserts
    that any `pvHit`/`pvBump` template has a corresponding trait/skill/
    command effect in the same template, so the nominal PV delta is
    backed by a real engine mutation. [C] Scandal magnitude scaling
    works through trait stamps + `flipFlopperPenalty`, NEVER through
    direct `pvCache` writes.

11. **EventEntry meta shape.** `{ templateId, politicianId?, pool,
    category }` where `category` is the template `category` (NOT
    `EventEntry.category`, which stays `'event'`). [B] `pool: 'personal'
    | 'national'` discriminates the two pools; `politicianId` is
    omitted for national events. The page reads `e.meta?.category` and
    `e.meta?.pool` for its filters.

12. **Same-turn PV recompute.** Single `refreshPv(snap)` at end of
    runner if any politician's skill/command/trait changed. Mirrors
    2.4.1 / 2.2.3 pattern. National-pool effects don't trigger
    `refreshPv`.

13. **Shared `markPoliticianDead` / `markPoliticianRetired` helpers.**
    Architect extracts the cross-system cleanup from 2.4.1's
    `runPhase_2_4_1_Deaths` into helpers used by BOTH 2.4.1 and 2.4.2.
    Avoids duplicating the protégé / faction-leader cleanup. The
    deaths-retirements spec's criteria #10–12 stay correct — the helper
    just centralizes the implementation.

14. **`Puritan` trait** — historian flagged it as a possible Second
    Great Awakening grant; PM defers to v2 because the religious-
    conversion family delegates to 2.1.5 via trait bias, not direct
    grant. Reserved.

15. **Anti-pattern enforcement** — `validate()` helper at runner-start
    checks the obvious anachronism set (auto crash before 1908, etc.).
    [B] Extended to the national pool (no telegraph pre-1844, no
    polio pre-1900, etc.). Architect's choice whether to do this at
    module-load time (cheap, one-shot) or at runner-start (defensive
    against hot-reload edits).

### Genuinely open (architect / playtest may need to revisit)

16. **Age-modulated weighting** on illness/cardiac events. v1 uniform;
    v2 could weight cardiac higher at age 60+ (Eisenhower paradigm).
    Flagged.

17. **Multi-politician duels.** v2. Currently duel templates only mutate
    the rolling politician's state (opponent is off-camera).

18. **Career-ending scandal** — 5% of modern scandal pool fires
    `forceRetire`. PM picks the magnitude conservatively (most Hart/Weiner
    careers ended; many Clinton/Foley careers continued). Flagged as
    tunable.

19. **Trait grants overlapping with relocations** — `Controversial` and
    `Unlikable` are also granted by `RELOCATION_ODDS.carpetbagger` ladder.
    2.4.2 grants them sparingly via scandal-verbal + public-failure
    templates. Acceptable overlap; flag.

20. **War-service template overlap with `TRACK_THEMED_TRAITS.Military`.**
    The template grants `Military` from `TRACK_THEMED_TRAITS`. PM
    recommends KEEPING (war heroism is paradigmatically an event-driven
    trait gain, even if the career-track system can also grant it). The
    architect can drop it if the overlap proves messy in playtest.

21. **Feed cap enforcement.** `ANYTIME_EVENTS_FEED_CAP = 500` is the
    soft cap on the count of `phase: '2.4.2'` events; the engine doesn't
    actually prune the events array. The page caps its render at 500.
    Same pattern as `LEADERSHIP_FEED_CAP`. If a long game accumulates
    thousands of events the page's filter is the throttle, not the
    snapshot. Flag.

22. **Saving cost.** ~33 personal + 22 national templates × `weight`
    etc. is a small const; the feed grows linearly with turn count ×
    politician count × fire rate. A 30-turn game with 200 politicians ×
    5% personal fire + 70% national fire = ~300 personal + ~21 national
    = ~321 feed entries; a 200-turn game with 500 politicians = ~5000
    personal + ~140 national = ~5140 entries. IndexedDB handles fine;
    the events array is already unbounded by 2.4.3's pendingEraEvents
    pattern. No new persistence concerns.

23. **Page polish (timeline view, per-politician sparkline, national
    meter history graph).** v2.

24. [B] **National-pool region scoping — `stateBias` is the only
    per-state lever in v1.** The `State` type carries `bias` (-1..+1)
    plus `industries` (open record). v1 uses `bias` for region-tagged
    national events. If playtest wants per-state economic / quality
    meter shifts (separate from national meters), v2 may add per-state
    `meters` substructure to `State`. For v1, `stateBias` covers the
    region-scoped use case cleanly. Flag.

25. [B] **National-pool template fatigue.** v1 allows consecutive
    same-template firings. v2 may add `cooldownTurns` to throttle
    repeat panics / epidemics within a short window. Flag.

26. [C] **`scandalMagnitudeMult` extension to breakthrough templates.**
    v1 scopes the multiplier to scandals only. The asymmetric design
    ("scandals scale by era; breakthroughs don't") matches the
    historian's binding fact #3 framing — mass media amplified
    scandals more than breakthroughs in the modern era. v2 may
    introduce a parallel `breakthroughMagnitudeMult` if playtest
    wants Cross-of-Gold-style speeches to feel bigger in 1896 than
    in 1796.

27. [B] **Interest-group key naming convention.** v1 keeps the
    current stub's free-form string keys (`BigAg`, `Nationalists`,
    `Immigrants`, `Nativists`) rather than enforcing `InterestCardId`
    literals. This matches the current engine convention. v2 may
    refactor to typed `InterestCardId` keys if the engine elsewhere
    starts depending on the closed set. Flag.

---

Spec path: `/home/user/AMPU/docs/specs/anytime-events.md`

## Checkpoint-1 summary

- **User story**: As a faction-running player, I want a small per-politician
  chance each turn that a real event happens (illness → `Frail`, scandal →
  `Scandalous`/`Corrupt` + PV hit, breakthrough → `Orator`/`Charismatic` +
  command, transport accident / duel / epidemic / assassination /
  religious nudge — all era-and-region-gated) AND a parallel chance each
  turn that a national-flavor event ticks the world meters / interest
  groups / partyPreference, narrated through the feed and aggregated on
  a new Anytime Events page, so my roster develops a lived-in history
  and the wider world has a visible era-appropriate pulse.
- **Top acceptance criteria**: (1) `ANYTIME_EVENTS_RULES` const added to
  types.ts after `MORTALITY_RULES` with `baseFireChance: 0.05`,
  `nationalBaseFireChance: 0.70`, per-era `fireMult` /
  `nationalFireMult` / `scandalMagnitudeMult` (criterion #1); (2)
  33-template personal pool + 22-template national pool authored in
  `src/data/anytimeEvents.ts` and `src/data/anytimeNationalEvents.ts`
  with strict era + region tagging (criteria #4–8); (3) runtime
  validator forbids granting any of the ~30 carved-out traits AND
  catches anachronisms across BOTH pools (criteria #6, #4e); (4) the
  runner replaces the 14-line stub with national-first then
  per-politician loop, era-scaled scandal magnitude via Amendment C
  (criteria #9–20e); (5) Anytime Events page with 4-axis filter row
  (Pool / Era / Category / Faction) + per-politician drill-down
  (criteria #23–30); (6) **first-turn skip removed per Amendment A**,
  2.4.2 fires turn 1 of 1772 (criterion #21).
- **Historian facts that most shaped the design**:
  (a) Duels era+region-gated → `regions?` tag, region-conditional pool
  filter; (b) Scandal intensity scales by era → `scandalMagnitudeMult`
  PROMOTED to engine math in v1 (Amendment C); (c) Skill discovery
  rare → ~6% of personal pool is breakthrough templates only;
  (d) Career-ending scandal rare → forced-retire only at 5% of modern
  scandal pool; (e) Epidemic disease was real → epidemic template
  family in BOTH pools (personal grants `Frail`/death, national ticks
  `quality` / `partyPreference`); (f) Anachronisms strict → validator
  enforces era tags on both pools.
- **Riskiest open question** (now post-amendments): Amendment B's
  region-scoping mechanism for national events uses `State.bias` as
  the only per-state lever (`stateBias` effect kind). If playtest
  wants per-state economic / quality / honest meter shifts (separate
  from national meters), v2 will need to add per-state meter
  substructure — but v1 ships with `stateBias` covering region-scoped
  use cases. Flagged as OQ #24.
- **Amendment count**: THREE Checkpoint-1 amendments accepted (A, B,
  C) and threaded throughout the spec. Zero deviations from the
  historian's binding facts — all three amendments either strengthen
  historian fidelity (C promotes era-scaled scandal magnitude from
  informational to binding; B grows the national pool to cover the
  historian's epidemics / immigration / revivals more thoroughly) or
  remove a PM-added gameplay protection that wasn't historian-bound
  (A removes the first-turn skip).
