# Spec: Anytime Events (Phase 2.4.2 Redesign)

> Eighth activation in the 2.x sweep (Relocations 2.1.4 → Ideology 2.1.5 →
> Conversions 2.1.6 → Kingmakers 2.1.7 → Alignment Drift 2.1.8 → Faction
> Leaders 2.2.3 → Deaths & Retirements 2.4.1 → this). 2.4.2 is currently a
> 14-line stub: one nation-level roll at 35%/turn that picks from 5 hardcoded
> flavor texts which tick national meters. The vision is the opposite —
> per-politician rolls, large era-aware pool, traits/skills/PV/ideology
> effects, dedicated UI page. This spec turns 2.4.2 into the game's primary
> "world feels alive" surface: every alive non-retired non-dead politician
> rolls each year, an era-and-region-filtered pool of ~32 event templates
> applies a real effect, and a new `AnytimeEventsPage` lets the player track
> the feed across their roster. No new Politician/Faction/GameState fields.
> Sits cleanly behind 2.4.1 in the same `2.4` event bracket (2.4.1 runs
> first, so a Frail trait granted in 2.4.2 this turn affects next turn's
> mortality roll, not this turn's).

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
the entire runner, ships a ~32-template pool, and adds the dashboard page.

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
   `ANYTIME_EVENTS_RULES.eraConfig`.

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
   `Frail`; rare variants kill outright (~5% of fires).

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
   awakening + populism timeline.

8. **Period-appropriate fatal accidents change shape by era** (horse fall /
   drowning / war-wound infection pre-1900; train wreck 1840s–1900s;
   automobile post-1908; aviation post-1955 for politicians). → A
   `Transportation Accident` template family with sub-variants tied to era:
   `Horse Fall` (I/F), `Carriage Overturned` (I/F), `Train Wreck` (F/N),
   `Auto Crash` (late N + M), `Plane Crash` (M only post-1955). Outcomes
   are mostly `Frail` + PV hit; rare lethal variant (~10%) sets
   `deathYear` directly.

**Deviations from historian's binding facts** (user-approved at Checkpoint 1
— populated post-checkpoint; empty for now):

- *None yet.* All eight facts are respected as encoded above; the riskiest PM
  call (skill-bump fraction, item 6) errs toward historian skepticism rather
  than away. Any user override at Checkpoint 1 lands here.

**Anachronism flag** — the historian's "anti-patterns must NOT appear in the
pool" list (auto crash pre-1908, plane crash pre-1955, polio pre-1900,
duel post-1870 outside South, FBI sting pre-1970, "DUI" pre-1910, "coming
out" pre-1970, "Modern Liberal/Conservative" naming pre-1933, "Great
Communicator"/"The Treatment" pre-1950s, etc.) is enforced by era/region
tags + the `validate()` runtime check (see §5).

## Player experience

Every turn, ~5% of your roster has something happen. Most of the time it's
inert — a brief feed line you'll see in passing. Sometimes it bites: your
star recruit takes a horse fall and gains `Frail`, dropping his prospects;
your Southern senator loses a duel and dies in 1808; your governor gets
hit by a Credit-Mobilier-style scandal and his PV drops 12 with
`Scandalous` attached. Occasionally it gifts you: your young rep gives a
breakthrough speech and gains `Orator` plus +1 command. Era flavor matters
— in 1856 you watch yellow fever cull a Philadelphia delegation; in 1956
you see Eisenhower-style heart attacks disclosed in the feed. Each
politician has a self-contained story arc that emerges from the dice. The
new **Anytime Events** page lets you scan the last N events across your
roster, filter by era/event-kind/politician, and drill into a single
politician's lifetime arc — turning your faction into a readable history.

## User story

As a faction-running player, I want a small per-politician chance each turn
that a real event happens — illnesses granting `Frail`, scandals granting
`Scandalous`/`Corrupt` with a PV hit, breakthrough moments granting
`Orator`/`Charismatic` or +1 command, transportation accidents, duels (era +
region gated), epidemic disease (era gated), and ideological/religious
nudges (era gated) — narrated through the feed and aggregated on a new
Anytime Events page, so my roster has a lived-in history I can scan and so
my long-term planning has a third axis of attrition beyond death and
retirement: trait-and-PV drift from the dice.

## Verified engine facts (drive the design; architect must not re-derive)

- **Current 2.4.2 runner** (`runPhase_2_4_2_Anytime`,
  phaseRunners.ts:2062–2075) is 14 lines: one `chance(0.35)` per turn, then
  `pick` from 5 hardcoded objects each ticking `snap.game.meters`,
  `partyPreference`, or `interestGroups`. **Replace wholesale.** The 5
  national-meter effects are out of scope here (see §9); they may resurface
  as a small flavor subset in v2 or move to 2.4.3 (PM defers).
- **First-turn skip** at `phases.ts:113` reads
  `if (phaseId === '2.4.2') return false; // no anytime events` inside the
  `currentEra === 'independence' && isFirstTurn` block. **Keep this line as-is.**
  The 1772 first turn already runs 2.4.1 (per the deaths-retirements spec
  removing its first-turn skip) but skipping 2.4.2 on turn 1 prevents
  founders eating an out-of-the-gate scandal/illness before any faction
  decisions have happened. Per-politician roll wouldn't change that
  framing. Documented as a deliberate Keep, not an oversight.
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
  the region gate).
- **`EventEntry.category`** (types.ts:628) currently includes `'event'`.
  Spec writes all 2.4.2 entries as `'event'`. **No new category added.**
  Filtering by phase=`'2.4.2'` in the new page distinguishes anytime events
  from era events (2.4.3) and from the death/retire bracket (2.4.1, which
  uses `'death'`/`'retire'` categories explicitly).
- **`MORTALITY_RULES.frailDeathMult = 1.5`** (types.ts:394): same-turn
  Frail-grant in 2.4.2 cannot retroactively affect this turn's 2.4.1; it
  applies next turn. The Frail acquisition log + the mortality bump
  compose cleanly without double-counting.
- **`refreshPv`** (pv.ts): PV depends on `currentOffice`, `skills`, `traits`,
  `command`. Spec calls `refreshPv` once at end of runner if any event
  mutated skill/command/traits (matches the 2.4.1 precedent's end-of-runner
  pattern flagged in `deaths-retirements.md` Open Question 10).
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
  politicianId })` so the new `AnytimeEventsPage` can filter the feed
  cheaply by `meta.templateId` and `meta.politicianId`.
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

  // Per-era multiplier on `baseFireChance` — keeps independence slightly
  // quieter (smaller universe, less press coverage) and modern slightly
  // louder (more reporting threshold). Independence under-represents
  // duels which are out-of-pool until federalism; this multiplier keeps
  // expected-events-per-career roughly even across eras.
  eraConfig: {
    independence: { fireMult: 0.8, scandalMagnitudeMult: 0.5 },
    federalism:   { fireMult: 0.9, scandalMagnitudeMult: 0.7 },
    nationalism:  { fireMult: 1.0, scandalMagnitudeMult: 1.0 },
    modern:       { fireMult: 1.1, scandalMagnitudeMult: 1.3 },
  } as const satisfies Record<Era, {
    fireMult: number;
    scandalMagnitudeMult: number;
  }>,

  // Caps and floors.
  skillCap: 5,            // mirrors CLAUDE.md domain: skills are 0–5
  commandCap: 5,          // mirrors KINGMAKER_RULES.commandCap
  pvHitFloor: -25,        // worst single-event PV hit (career-end scandal)
  pvBumpCeil: 15,         // best single-event PV bump (breakthrough speech)

  // Career-end scandal: rare modern-only direct retire-induction.
  careerEndScandalShareOfScandalPool: 0.05,
} as const;

export const ANYTIME_EVENTS_FEED_CAP = 500;
```

The `satisfies Record<Era, ...>` exhaustiveness lever matches
`LEADERSHIP_RULES.eraConfig` / `MORTALITY_RULES.eraConfig`.

#### 1.2 Event template data shape

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

#### 1.3 Pool size and authorship target

**Target: 32 distinct templates** (historian's "25–40" window, midpoint).
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

### Layer 2 — Trait/skill carve-out (binding correctness constraint)

**Traits 2.4.2 MAY grant** (binding):

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
  const fireChance = ANYTIME_EVENTS_RULES.baseFireChance * cfg.fireMult;

  let mutationCount = 0; // refreshPv suppressor

  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (!chance(fireChance)) continue;

    // Build the era+region-valid pool.
    const region = snap.states.find((s) => s.id === p.state)?.region;
    const era = snap.game.currentEra;
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
          // Mirror 2.4.1 cleanup: clear factionLeaderOf + protege links.
          // (Architect: extract the 2.4.1 cleanup block into a shared
          // helper `markDead(snap, p)` to avoid duplication; both 2.4.1
          // and 2.4.2 call it.)
          vacateOffice(snap, p);
          break;
        case 'forceRetire':
          p.retiredYear = snap.game.year;
          vacateOffice(snap, p);
          break;
        case 'pvHit':
        case 'pvBump':
          // No direct pvCache write; the trait/skill effects in the same
          // template carry the actual PV delta. The `amount` is
          // informational for the feed entry's meta.
          break;
      }
    }
    if (didMutateSkillsOrTraits) mutationCount++;

    const text = tpl.text
      .replace('{first}', p.firstName)
      .replace('{last}', p.lastName)
      .replace('{state}', p.state.toUpperCase());

    addLog(snap, '2.4.2', 'event', text, {
      templateId: tpl.id,
      politicianId: p.id,
      category: tpl.category,
    });
  }

  if (mutationCount > 0) refreshPv(snap);
}
```

Key properties:
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
- **`vacateOffice` on death/forceRetire** — same path as 2.4.1; clears
  `currentOffice`, faction leader, protégé bonds.

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
2. **Filter row.** Three dropdowns + one toggle:
   - **Era filter** — defaults to `(current era)`, options: all four eras
     + `all`. Filters events by year-to-era mapping (helper consults
     `snap.game.currentEra` for the current era; per-event eras are derived
     by year — see Open Question 5).
   - **Category filter** — the 16 `AnytimeEventTemplate.category` values
     plus `all`. Cheap UI-side filter on `meta.category`.
   - **Faction filter** — `all` (default) or `your faction` (filters to
     events whose `meta.politicianId` resolves to a player-faction
     member). Politicians whose faction has changed over time are matched
     to their **current** factionId (matches Roster's filter philosophy).
   - **Show retired/dead toggle** (default OFF) — when off, hides events
     for politicians where `p.deathYear || p.retiredYear`. When on, shows
     all (the historical record).
3. **Feed.** Scrollable list (max-height `70vh`) of events, year-desc
   (newest at top), one row per event:
   - `[YEAR]` chip (tabular-nums).
   - Category icon/badge (color-coded by category family: illness =
     amber, scandal = rose, breakthrough = emerald, violence = red,
     accident = slate, other = blue).
   - Politician name (linked — clicks dispatch a `setPoliticianFilter`
     local state, filtering the feed to that one person).
   - Event text (`{first} {last} ...`).
   - Effect chips: each `grantTrait` shows `+Trait`, each `skillBump`
     shows `+1 legislative`, etc. Visual reinforcement of the mechanic.
4. **Per-politician drill-down (when politician filter is set).** A
   small card at the top of the feed shows the chosen politician's
   name, age, current state, ideology, factionId, and a count
   of anytime events ever fired on them. The feed below is filtered to
   that politician only. A "Clear" button resets the filter.
5. **Empty state.** "No anytime events match these filters." prompt.

**Out of v1 scope** for the page: per-politician timeline visualization
(timeline graph), event search-by-text, multi-politician comparison,
sparkline of "events per turn" history. Filed under Out of Scope (§9).

#### 4.3 Pure read-only

NO buttons that mutate snapshot. NO `GameContext` mutator additions. NO
sidebar auto-navigation prompt. The page is informational — matches the
FactionAlignmentsPage / FactionLeaderPage convention.

## State shape (binding)

**No new fields on `Politician`, `Faction`, or `GameState`.** Specifically:

- 2.4.2 event records live in the existing `snap.events: EventEntry[]` feed
  with `phase: '2.4.2'`, `category: 'event'`, and `meta: { templateId,
  politicianId, category }`.
- No `anytimeEvents?: AnytimeEntry[]` on `GameState` (parallel to
  `factionLeadership` etc.) — the event log is already the source of
  truth; a dedicated array would duplicate it.
- `ANYTIME_EVENTS_RULES` const + `ANYTIME_EVENTS_FEED_CAP = 500`
  exported from `types.ts`.
- `AnytimeEventTemplate` + `AnytimeEventEffect` types and the
  `ANYTIME_EVENT_TEMPLATES` array live in `src/data/anytimeEvents.ts` (NOT
  types.ts — data, not state shape). Types re-exported from
  `src/data/anytimeEvents.ts`.

**No save migration required.** Legacy saves load unchanged; the runner is
purely additive in behavior on the next tick (with the current stub
removed).

## Acceptance criteria

### State & types
- [ ] 1. `ANYTIME_EVENTS_RULES` const placed after `MORTALITY_RULES` in
  `types.ts`. Shape exactly per §1.1: `baseFireChance: 0.05`, `eraConfig`
  keyed by `Era` literals via `satisfies Record<Era, { fireMult: number;
  scandalMagnitudeMult: number }>`, `skillCap: 5`, `commandCap: 5`,
  `pvHitFloor`, `pvBumpCeil`, `careerEndScandalShareOfScandalPool`.
- [ ] 2. `ANYTIME_EVENTS_FEED_CAP = 500` exported from `types.ts`.
- [ ] 3. No new `Politician`, `Faction`, or `GameState` fields. No new
  `Trait` union members. No new `EventEntry.category` value (the existing
  `'event'` category is reused).
- [ ] 4. `AnytimeEventTemplate` and `AnytimeEventEffect` types defined in
  `src/data/anytimeEvents.ts` (exported). Backed by a single
  `ANYTIME_EVENT_TEMPLATES: AnytimeEventTemplate[]` of 32–33 entries.

### Data — templates
- [ ] 5. Pool contains 32–33 templates spread across the 16 categories per
  §1.3 table. Every template has `id`, `category`, `weight`, `effects`,
  `text`. Templates with era-bounded narrative (duels, epidemics, transport
  variants) set `eras` and (for region-bound templates) `regions`.
- [ ] 6. No template's `effects` array grants any of the **carved-out
  traits** (binding list in §2). Verified by a `validate()` helper that
  iterates `ANYTIME_EVENT_TEMPLATES` and asserts no `grantTrait` effect
  matches the forbidden set. The helper runs at runner-start and throws
  in dev (warns in prod) if violated.
- [ ] 7. No template's `effects` array bumps any of the **carved-out
  skills** (binding list in §2 — only `legislative`, `governing` allowed;
  `command` is separate via `commandBump`). Verified by the same helper.
- [ ] 8. **Anachronism check** — no template with `eras: ['independence']`
  has `category: 'transport-accident'` with text mentioning "auto" /
  "train" / "plane"; no template with `eras: ['modern']` has duel/yellow
  fever / cholera flavor. Spot-checked at authoring; the `validate()` helper
  also asserts known-bad combinations.

### Engine — runner rewrite
- [ ] 9. `runPhase_2_4_2_Anytime` (phaseRunners.ts:2062–2075) is replaced
  wholesale. The new body has zero hardcoded numbers in the per-event
  loop; all numeric reads come from `ANYTIME_EVENTS_RULES` or the
  template.
- [ ] 10. The per-politician loop SKIPS `p.deathYear || p.retiredYear`
  at the top. Per-politician fire chance is `ANYTIME_EVENTS_RULES.baseFireChance
  * eraConfig[currentEra].fireMult`.
- [ ] 11. The era+region filter rejects templates whose `eras` doesn't
  include the current era OR whose `regions` doesn't include the
  politician's state's region. Region lookup is
  `snap.states.find((s) => s.id === p.state)?.region`.
- [ ] 12. The weighted pick uses `pickWeighted(rng.ts)` with per-template
  `weight * (eraWeightMult?.[era] ?? 1)`.
- [ ] 13. Trait grants are guarded by `!p.traits.includes(eff.trait)` — no
  duplicate traits.
- [ ] 14. Skill bumps respect `skillCap = 5`; bumps to a skill already at
  5 no-op (the event still publishes a feed entry; rest of effects fire).
- [ ] 15. `command` bumps respect `commandCap = 5`; same no-op rule.
- [ ] 16. `death` effect sets `p.deathYear = snap.game.year`, calls
  `vacateOffice`, and mirrors the cross-system cleanup from 2.4.1
  (`factionLeaderOf` + protégé chains). Architect extracts the cleanup
  into a shared `markPoliticianDead(snap, p)` helper used by BOTH 2.4.1
  and 2.4.2 (refactor of `runPhase_2_4_1_Deaths`).
- [ ] 17. `forceRetire` effect sets `p.retiredYear = snap.game.year`,
  calls `vacateOffice`, and mirrors the 2.4.1 cross-system cleanup via
  the same shared helper.
- [ ] 18. The runner is pure over `snap`; uses only `chance`,
  `pickWeighted`, `pick`, `clamp` from `rng.ts`. **No `Math.random`.**
- [ ] 19. A single `refreshPv(snap)` call at end-of-runner if any
  politician's skill/command/traits changed (mirrors 2.4.1 pattern).
- [ ] 20. Each fired event writes `addLog(snap, '2.4.2', 'event', text,
  { templateId, politicianId, category })`. Text uses `{first}`,
  `{last}`, `{state}` substitution.

### Engine — phase ordering + first-turn gate
- [ ] 21. `phases.ts:113` line `if (phaseId === '2.4.2') return false; //
  no anytime events` is **KEPT as-is**. 2.4.2 still skips on the 1772
  first turn. Documented as deliberate.
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
- [ ] 27. Filter row: Era dropdown (default current era), Category
  dropdown (default `all`, 16 options), Faction dropdown (`all` /
  `your faction`, default `your faction`), `Show retired/dead` toggle
  (default OFF). Component-state via `useState`, NOT persisted in snapshot.
- [ ] 28. Feed: year-desc rows, max-height `70vh` scrollable, color-coded
  category badge, politician name (clickable → sets politician filter),
  event text, effect chips (`+Trait`, `+1 skill`, etc.).
- [ ] 29. Per-politician drill-down: clicking a politician name filters
  the feed to that politician AND shows a small summary card at the top
  (name, age, state, ideology, anytime-event count). A "Clear" button
  resets.
- [ ] 30. Empty state: "No anytime events match these filters." when
  filtered results are zero.

### Build & playtest
- [ ] 31. `npm run build` passes (typecheck + Vite bundle).
- [ ] 32. **Playtest 1772.** Start the scenario, advance past turn 1
  (where 2.4.2 is gated off). From turn 2 onward, observe ~5% of alive
  non-retired non-dead politicians firing an event each turn. **NO**
  auto-crash, plane-crash, or modern-pandemic events appear. Duels may
  appear regardless of region (1772 duels happened everywhere). Yellow
  fever appears as a category; no polio. Anytime Events page renders
  with the new entries.
- [ ] 33. **Playtest 1856.** Advance ~10 turns. Observe at least 2–3
  scandals, 1–2 illnesses (cholera plausible at this date), 0–1 duels
  (region-gated for Southern politicians in the late nationalism
  approach). Verify a politician who acquires `Frail` this turn shows
  elevated mortality risk on the next turn's 2.4.1 (confirmable via the
  death/retire feed and the Frail trait pill on Roster).
- [ ] 34. **Anytime Events page playtest.** Filter to your faction;
  navigate to a politician with at least one event; verify the
  drill-down card renders; verify effect chips show; verify the
  category filter narrows the feed.

## Worked examples

### Example A — 1772 Independence, 50-year-old healthy Northeast senator

- `cfg.fireMult = 0.8` ⇒ fire chance `0.05 * 0.8 = 4%/yr`.
- Pool filter: all templates with `eras` including `'independence'` (or
  no `eras` tag). Region-gated `Southern Duel (fading)` excluded.
- Weighted draws favor: illness (acute fevers), duels (universal in I),
  scandal-financial (Reynolds-style, low magnitude per
  `scandalMagnitudeMult = 0.5`).
- Outcome distribution roughly: 35% illness, 20% transport (horse fall),
  20% scandal-financial (mild), 15% duel, 10% other.

### Example B — 1956 Modern, 70-year-old frail South governor

- `cfg.fireMult = 1.1` ⇒ fire chance `0.05 * 1.1 = 5.5%/yr`.
- Pool: ALL modern-era templates including auto crash, plane crash, modern
  scandal, modern epidemic. NO duel (eras excludes M).
- This politician already has `Frail`; if an illness fires, the trait
  isn't re-granted (guard). The event still publishes for narrative.
- Higher chance of catastrophic outcome via modern epidemic + age-modulated
  weighting (not in v1 — flagged as Open Question 4).
- Modern `scandalMagnitudeMult = 1.3` ⇒ scandal events deliver a
  `Scandalous` trait stamp with a tightened PV impact (the trait is
  baseline `-5` from `NEGATIVE_TRAITS` PV math; the magnitude multiplier
  in v1 is informational, used by the UI to color the chip; v2 may
  promote it to per-era PV scaling — flagged).

### Example C — 1808 Federalism, 40-year-old Southern representative

- `cfg.fireMult = 0.9` ⇒ fire chance `0.05 * 0.9 = 4.5%/yr`.
- Pool: federalism-eligible templates including duels (universal in F)
  and yellow fever (active in F). Auto/plane/polio excluded.
- The Southern region is NOT a hard gate in federalism (duels
  universal); it IS a hard gate in nationalism where duel templates have
  `regions: ['South', 'Border']`. Documented.

### Example D — 1772 Independence, 28-year-old healthy West-region senator

- Same fire chance as Example A.
- Pool: independence-tagged templates. Note: "West" as a region in 1772
  is rare (`expansionStates.ts` may or may not seed Western states yet)
  but if a politician's state.region is one the template's `regions`
  doesn't include, those templates are filtered. No region-bound
  templates are active in independence era in the v1 pool, so this is
  practically equivalent to Example A.

## Edge cases

- **Politician dies in 2.4.1 same turn.** 2.4.1 ran first; their
  `deathYear` is set; 2.4.2's `if (p.deathYear || p.retiredYear) continue`
  excludes them. No event fires on dead politicians.
- **Politician retires in 2.4.1 same turn.** Same as above —
  `retiredYear` set; excluded from 2.4.2 sweep.
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
  Same path as 2.4.1 retire: `vacateOffice` clears `factionLeaderOf`;
  the next 2.2.3 Step 2 invalidation runs an Election (per Faction
  Leaders spec). Documented; correct.
- **Two scandals fire on the same politician across two consecutive
  turns.** Both publish; second `Scandalous` grant no-ops (already has).
  Total PV hit is one trait baseline (-5), not -10. Acceptable; the
  narrative records both events.
- **Anytime event grants `Frail` AND `Crisis Manager` from the same
  template.** Both grant; both compose into 2.4.1's `1.5 * 0.85 =
  1.275` mortality multiplier per the deaths-retirements spec. Edge
  case acknowledged (no template currently grants both — would be
  authoring weird — but the runner handles it).
- **Save migration.** No new state fields; legacy saves load unchanged.
  First post-deploy 2.4.2 tick uses the new pool; no backfill of
  historical anytime events.

## Out of scope

- **National-meter "flavor" events** (the current stub's 5 events ticking
  `economic`/`quality`/`honest`/`partyPreference`/`interestGroups`). PM
  **rips them entirely** in v1 — they don't match the per-politician
  vision, and 2.4.3 already owns era-level decision events with national
  effects. If playtest finds the loss of low-level meter noise jarring,
  v2 can resurface a small `national-flavor` subset (~3–5 templates)
  with reduced fire rate; flagged as Open Question 6.
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
- **Save migration / backfill** of historical 2.4.2 events on legacy
  saves. Pool starts fresh on next tick.
- **2.4.1 / 2.4.3 changes.** 2.4.1 gains a refactored `markPoliticianDead`
  helper extracted for 2.4.2 reuse (criterion #16), but its mortality
  math is unchanged. 2.4.3 unchanged.
- **`Show retired/dead`-toggle styling on the page.** Toggle is binary;
  past politicians' events show with no extra muting in v1 (the toggle
  only includes/excludes the rows, doesn't restyle them). v2 may add
  muted styling consistent with Roster.
- **`AnytimeEventTemplate` authoring UI in-game.** Templates are
  source-controlled in `src/data/anytimeEvents.ts`. No "Add custom
  anytime event" page.

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
   "Southern bias post-1830" without inventing a new `Region` enum.

4. **Per-era scandal magnitude scaling** (PM stance on Tension 4). The
   `scandalMagnitudeMult` field on `eraConfig` is **informational in v1**
   — it labels the UI's scandal-chip color severity (mild/moderate/big/
   biggest) but doesn't tighten the PV math beyond the baseline
   `NEGATIVE_TRAITS` -5. V2 may promote it to per-era trait stack count
   (e.g., modern era stamps BOTH `Scandalous` AND `Corrupt` from the
   same template; pre-1880 stamps only `Scandalous`). Flagged.

5. **National-level events** (PM stance on Tension 5). The current stub's
   5 nation-meter events are **ripped entirely in v1**. Rationale: the
   user vision is per-politician; 2.4.3 already owns era-level decision
   events; mixing the two in 2.4.2 muddles the page's filter semantics.
   Flagged as Open Question 6 if playtest pushes back.

6. **UI page scope** (PM stance on Tension 6). Minimum viable: feed +
   3-axis filter row + per-politician drill-down. Out-of-v1: timeline
   visualization, multi-politician compare, per-template stats page.
   Filed in Out of Scope.

7. **First-turn skip retained for 1772.** Per phases.ts:113 line —
   keeping the line. Founders shouldn't eat an out-of-the-gate event
   before any draft/leader actions have been resolved.

8. **Pool size: 32–33 templates.** Historian's window 25–40; PM picks the
   low-mid range to keep authoring cost contained. The 16-category
   breakdown (~2 templates per category) is deliberately even for
   easy expansion later.

9. **Fire rate: 5%/politician/year.** Historian's window 3–8%/yr; PM
   picks midpoint. Per-era `fireMult` tilts (-20% / -10% / 0% / +10%)
   across the four eras. Across a 30-year career: ~78% of politicians
   accumulate ≥ 1 anytime event (1 - 0.95^15 turns); 50% accumulate
   ≥ 2 events (1 - 0.95^15 * 15 * 0.05 = roughly... ≈ 51%).

10. **`pvHit`/`pvBump` magnitude flow.** Direct `pvCache` writes are
    out — the runner stamps traits/skills/command and lets `refreshPv`
    recompute PV deterministically. Template `amount` is informational
    for the feed/UI. **Architect note**: the `validate()` helper asserts
    that any `pvHit`/`pvBump` template has a corresponding trait/skill/
    command effect in the same template, so the nominal PV delta is
    backed by a real engine mutation.

11. **EventEntry meta shape.** `{ templateId, politicianId, category }`
    where `category` is the `AnytimeEventTemplate.category` (NOT
    `EventEntry.category`, which stays `'event'`). The page reads
    `e.meta?.category` for its category filter. Documented.

12. **Same-turn PV recompute.** Single `refreshPv(snap)` at end of
    runner if any politician's skill/command/trait changed. Mirrors
    2.4.1 / 2.2.3 pattern.

13. **Shared `markPoliticianDead` helper.** Architect extracts the
    cross-system cleanup from 2.4.1's `runPhase_2_4_1_Deaths` into a
    `markPoliticianDead(snap, p)` helper used by BOTH 2.4.1 and 2.4.2
    (and equivalently a `markPoliticianRetired(snap, p)` for retire
    transitions). Avoids duplicating the protégé / faction-leader
    cleanup. The deaths-retirements spec's criteria #10–12 stay correct
    — the helper just centralizes the implementation.

14. **`Puritan` trait** — historian flagged it as a possible Second
    Great Awakening grant; PM defers to v2 because the religious-
    conversion family delegates to 2.1.5 via trait bias, not direct
    grant. Reserved.

15. **Anti-pattern enforcement** — `validate()` helper at runner-start
    checks the obvious anachronism set (auto crash before 1908, etc.).
    Architect's choice whether to do this at module-load time (cheap,
    one-shot) or at runner-start (defensive against hot-reload edits).

### Genuinely open (architect / playtest may need to revisit)

16. **`scandalMagnitudeMult` promoted to engine math.** Currently
    informational; could become per-era PV scaling. Flag for playtest
    feedback.

17. **Age-modulated weighting** on illness/cardiac events. v1 uniform;
    v2 could weight cardiac higher at age 60+ (Eisenhower paradigm).
    Flagged.

18. **National-flavor events resurfacing.** If playtest finds the loss
    of the current stub's 5 meter events jarring, a small `national-flavor`
    pool of 3–5 templates with reduced fire (e.g., 1%/turn nation-level
    in addition to the per-politician 5%) could resurface. Flag.

19. **Multi-politician duels.** v2. Currently duel templates only mutate
    the rolling politician's state (opponent is off-camera).

20. **Career-ending scandal** — 5% of modern scandal pool fires
    `forceRetire`. PM picks the magnitude conservatively (most Hart/Weiner
    careers ended; many Clinton/Foley careers continued). Flagged as
    tunable.

21. **Trait grants overlapping with relocations** — `Controversial` and
    `Unlikable` are also granted by `RELOCATION_ODDS.carpetbagger` ladder.
    2.4.2 grants them sparingly via scandal-verbal + public-failure
    templates. Acceptable overlap; flag.

22. **War-service template overlap with `TRACK_THEMED_TRAITS.Military`.**
    The template grants `Military` from `TRACK_THEMED_TRAITS`. PM
    recommends KEEPING (war heroism is paradigmatically an event-driven
    trait gain, even if the career-track system can also grant it). The
    architect can drop it if the overlap proves messy in playtest.

23. **Feed cap enforcement.** `ANYTIME_EVENTS_FEED_CAP = 500` is the
    soft cap on the count of `phase: '2.4.2'` events; the engine doesn't
    actually prune the events array. The page caps its render at 500.
    Same pattern as `LEADERSHIP_FEED_CAP`. If a long game accumulates
    thousands of events the page's filter is the throttle, not the
    snapshot. Flag.

24. **Saving cost.** ~32 templates × `weight` etc. is a small const; the
    feed grows linearly with turn count × politician count × fire rate.
    A 30-turn game with 200 politicians × 5% fire = ~300 feed entries;
    a 200-turn game with 500 politicians = ~5000 entries. IndexedDB
    handles fine; the events array is already unbounded by 2.4.3's
    pendingEraEvents pattern. No new persistence concerns.

25. **Page polish (timeline view, per-politician sparkline).** v2.

---

Spec path: `/home/user/AMPU/docs/specs/anytime-events.md`

## Checkpoint-1 summary

- **User story**: As a faction-running player, I want a small per-politician
  chance each turn that a real event happens (illness → `Frail`, scandal →
  `Scandalous`/`Corrupt` + PV hit, breakthrough → `Orator`/`Charismatic` +
  command, transport accident / duel / epidemic / assassination /
  religious nudge — all era-and-region-gated), narrated through the feed
  and aggregated on a new Anytime Events page, so my roster develops a
  lived-in history and my long-term planning gains a third attrition axis
  beyond death and retirement.
- **Top acceptance criteria**: (1) `ANYTIME_EVENTS_RULES` const added to
  types.ts after `MORTALITY_RULES` with `baseFireChance: 0.05` and per-era
  `fireMult` (criterion #1); (2) 33-template pool authored in
  `src/data/anytimeEvents.ts` with strict era + region tagging
  (criteria #4–5); (3) runtime trait carve-out validator forbids granting
  any of the ~30 traits owned by other systems (criterion #6); (4) the
  runner replaces the 14-line stub with a per-politician loop at 5%
  fire chance, weighted era+region-filtered pick, trait/skill/command
  effects, single end-of-runner `refreshPv` (criteria #9–20); (5) new
  `AnytimeEventsPage` with 3-axis filter row + per-politician drill-down
  (criteria #23–30).
- **Historian facts that most shaped the design**:
  (a) Duels must be era+region-gated → `regions?` tag taxonomy added to
  the template type, region-conditional pool filter in the runner;
  (b) Scandal intensity scales by era → `scandalMagnitudeMult` per era
  config (v1 informational, v2 promote-able to PV math);
  (c) Skill discovery is rare and surfaces latent ability → ~6% of pool
  is breakthrough templates only, grants `Orator`/`Charismatic`/`Crisis
  Manager` + `+1 command`, NEVER bumps `admin`/`judicial`/`military`/
  `backroom`;
  (d) Career-ending scandal is rare → forced-retire only at 5% of
  modern-era scandal pool, never pre-modern;
  (e) Trait double-counting must be carved out → binding §2 list
  enumerates the ~30 traits 2.4.2 must NOT grant (owned by 2.1.4,
  2.1.5, 2.1.6, 2.2.3, draft-seed, career-track), enforced by runtime
  `validate()`.
- **Riskiest open question** (Tension 1, skill bumps): vision explicitly
  asks for "skill bump" events; historian fact #6 is skeptical of mid-
  career skill acquisition outside the career-track system. PM bound
  the skill-bump fraction at ~6% of the pool, restricted to two themed
  templates (breakthrough-speech, breakthrough-crisis), restricted to
  `legislative` / `governing` / `command` only. If user wants raw `+1
  admin` / `+1 backroom` skill bumps in the pool, that's a deliberate
  override of the historian's binding fact #6 — would land in the
  Deviations section.
- **Deviation count**: ZERO from historian's binding facts as the spec
  stands. PM's conservatism on skill bumps stays within the historian's
  preferred envelope. If the user at Checkpoint 1 wants any of:
  (a) skill bumps to all six skills, (b) hidden-illness modeling
  (Wilson paradigm), (c) `Puritan` trait grants from Second Great
  Awakening templates, (d) age-modulated illness weighting, (e) the
  national-flavor subset preserved — any of those would generate a
  deviation entry to fill in.
