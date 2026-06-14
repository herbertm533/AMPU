# Spec: Deaths & Retirements (Phase 2.4.1 Activation)

> Seventh activation in the 2.x sweep (Relocations 2.1.4 → Ideology 2.1.5 →
> Conversions 2.1.6 → Kingmakers 2.1.7 → Alignment Drift 2.1.8 → Faction
> Leaders 2.2.3 → this). 2.4.1 is currently an 18-line runner with hardcoded
> brackets, no era tuning, no trait modifiers, a retirement gate that fires
> only on sitting officeholders, and a first-turn skip in `phases.ts`. This
> spec turns mortality into an era-tuned, trait-modulated, every-politician
> system — and surfaces retired politicians on the Roster so the player can
> still see who once served. No scripted historical deaths; emergent narrative
> wins. No dueling system. No new pages.

## Vision (as given)

Activate the 2.4.1 Deaths & Retirements phase across all American eras
(1772 → modern day) in four layers as one feature:

**Layer 1 — Activate + constants refactor.** Remove the first-turn skip
(`phases.ts:113`) so 2.4.1 fires from turn 1. Lift the magic-number bracket
table into a new `MORTALITY_RULES` const in `types.ts` (placed after
`LEADERSHIP_RULES` at line 376-ish). Const holds age-banded base rates plus a
per-Era `eraConfig` of `deathMult` / `retireMult` multipliers — historian-
binding: pre-1860 mortality at ages 60+ was ~1.5–2× modern rates;
retirement-as-life-stage is post-1935.

**Layer 2 — Trait integration.** `Frail` politicians get `×1.5` death chance
(weak-but-real historical signal: W.H. Harrison, FDR, Wilson, Calhoun,
Webster). `Crisis Manager` politicians get `×0.85` death chance — flagged in
UI as `(gameplay)` per the historian's binding that this trait has no
historical mortality signal.

**Layer 3 — Retire mechanic redesign.** Lift the `if (p.currentOffice)` gate.
Every alive non-retired politician rolls retire each turn, subject to era
`retireMult`. Independence-era `retireMult = 0.5` (user-floored at ~25% of
modern's 1.5 — see Historical grounding deviations) means a 60-year-old's
annual retire chance is `~1.25%` (meaningful but death still dominates 3:1
at that age). Modern-era `retireMult = 1.5` means a 70-year-old retires at
`~12%/yr` — realistic.

**Layer 4 — Roster page extensions.** Show retired politicians on Roster
(currently filtered out at `Roster.tsx:10`). Add a `Show retired` toggle
(default off, component state — NOT persisted in snapshot, matches existing
patterns). Retired rows render muted with a `Retired YYYY` badge; no action
buttons. Dead politicians remain filtered out (separate concern, separate
filter).

## Historical grounding (binding)

Source: `/home/user/AMPU/docs/research/deaths-retirements-historical-context.md`.
Five binding facts from the historian's brief that this spec respects without
deviation:

1. **`e₂₀` (life expectancy at age 20), NOT `e₀` (at birth), is the correct
   mortality anchor for politicians.** The "1700s life expectancy was 36"
   figure is `e₀`, dragged down by infant mortality. Politicians enter office
   mid-20s; almost none died in childhood. A 20-year-old in 1772 colonial
   America who survived childhood could expect to live into his late 50s or
   60s. → The spec's eraConfig multipliers are calibrated to `e₂₀`-derived
   adult mortality (Haines decennial life tables for 1790–1900; SSA Study 120
   for 1900+), not to the headline `e₀` numbers. The current 2.4.1 brackets
   (modern-anchored) are kept as the BASE table; era multipliers do the
   historical shaping.

2. **Current AMPU brackets (`>= 80: 18%` / `>= 70: 7%` / `>= 60: 2.5%` /
   `< 60: 0.5%`) are roughly modern (post-1980) US population rates — and
   1.5–2× too low for 1772–1860, 1.2–1.5× too low for 1860–1900, ~baseline
   for 1950+.** → The eraConfig `deathMult` reflects exactly that ramp:
   independence `1.8`, federalism `1.6`, nationalism `1.3`, modern `1.0`.
   The base brackets stay anchored to modern rates so a future "modern
   scenario" reads naturally.

3. **Retirement-as-life-stage is post-1935 (Social Security normative).**
   Through the 19th century, "leaving Congress" meant going home to law,
   business, or state politics — not stopping work. The 19th-century pattern
   was death-in-office. → The eraConfig `retireMult` damps retirement below
   the modern level pre-1935: independence `0.5`, federalism `0.6`,
   nationalism `0.9`, modern `1.5`. **Spec deviation — see "Deviations" below.**
   Combined with the user-binding "any alive politician can retire" Layer-3
   change, the resulting independence-era retire chance for a 60-year-old is
   `~1.25%/yr` and death still dominates retirement ~3:1 at that age.

4. **Death-in-office was ~4× more common pre-1972** (per UMN Smart Politics
   Senate analysis: "nearly four times as many U.S. Senators died per year
   from 1789 through 1972 than during the last half-century"). → Combining
   `deathMult ≥ 1.3` for pre-1900 eras with `retireMult ≤ 0.9` produces a
   death-dominant historical exit pattern (~3:1 death:retire at age 60 in
   independence, ~1.5:1 in nationalism) and a retire-dominant modern pattern
   (~1:1.7 at age 70). The post-deviation retire floor compresses the
   historical ratio (from ~9:1 → ~3:1 in 1772) but death still wins pre-modern.

5. **`Frail` has weak-but-real historical signal; `Crisis Manager` has
   none.** Frail anchors: W.H. Harrison (died 31 days into presidency at 68),
   FDR (polio paraplegic from 39, died at 63 in 4th term), Wilson (massive
   stroke at 62), Calhoun (tuberculosis last decade), Webster (cirrhosis,
   in office). Crisis Manager: Lincoln assassinated at 56; FDR died at 63;
   Truman lived to 88; Eisenhower to 78 — sample too small / selection bias
   too strong to support a historical longevity claim. → Spec ships
   `Frail = ×1.5 death` (anchored in historian's anecdotal cases) and
   `Crisis Manager = ×0.85 death` (defensible game-balance, UI-flagged
   `(gameplay)` per historian's explicit caveat). No new traits added; both
   exist in the `Trait` union.

**Deviations from historian's binding facts (user-approved at Checkpoint 1):**

- **Pre-modern `retireMult` floored at ~25% of modern's 1.5** (`independence 0.5`,
  `federalism 0.6`, `nationalism 0.9`). The historian's brief supports
  retireMult values closer to `0.1 / 0.2 / 0.5` (the pre-1935 "death-in-office"
  framing). The user explicitly overrode this floor for game-feel reasons:
  retirement should be a visible exit pattern in every era, not just modern.
  Death still dominates exits in pre-modern eras (~3:1 at age 60 in
  independence) but the previous "effectively never" framing is gone.
  Tracked here so any future revisit (e.g. a 1772-purist scenario) knows
  this is a tunable, not a derived value.

**Anachronisms NOT addressed by this spec** (per user binding, OUT OF
SCOPE):
- **Dueling.** Hamilton-Burr 1804; Jackson dueled multiple times; Clay shot
  Randolph's coat 1826. Slightly under-models founding-era political
  mortality; acceptable v1 trade per user.
- **Scripted historical deaths.** No `HISTORICAL_DEATHS` map; Hamilton can
  survive to 80, Washington can die at 50. Emergent narrative wins.
- **Cause-of-death narrative.** All deaths log as `has died` with no cause
  field (no `natural` / `duel` / `assassination`).
- **Pre-1796 "withdraws to private life" framing.** Historian flagged the
  Cincinnatus framing for UI text; user binding ships the modern "Retired"
  label uniformly. Flagged in Open Questions for future polish.

## Player experience

Old politicians die now. So do unlucky young ones. In 1772, your 66-year-old
Franklin has a meaningful (~4.5%/yr) chance of dying each turn — but he might
also live to 84. Your `Frail`-trait drafts feel costly; your `Crisis Manager`
veterans feel slightly less mortal (a 15% reduction the player learns to
weigh). Retirement is era-shaped: in 1772 your generation serves until death,
in the modern era your 70-year-olds bow out gracefully. The Roster page now
shows retired politicians as muted rows with a `Retired YYYY` badge — your
faction's history is visible without polluting the active list. The feed
narrates each exit. The decision tension: do you trade a high-PV Frail
recruit's short career for present-tense value, or invest in a young
durable? Era matters: in 1856 the same Frail trait costs less (deathMult
1.3) than in 1772 (1.8).

## User story

As a faction-running player, I want politicians to die and retire at
historically plausible rates (heavy mortality and near-zero retirement in
1772, balanced mortality + meaningful retirement in the modern era), with
the `Frail` trait and `Crisis Manager` trait observably nudging the dice
either way — so my long-term roster planning has real attrition risk, my
trait choices in the draft carry weight, and my retired veterans remain
visible on the Roster as a record of who served.

## Verified engine facts (drive the design; architect must not re-derive)

- **Current 2.4.1 runner** (`runPhase_2_4_1_Deaths`, phaseRunners.ts:1954–1971)
  is 18 lines. Hardcoded brackets: `p.age >= 80 ? 0.18 : p.age >= 70 ? 0.07 :
  p.age >= 60 ? 0.025 : 0.005` for death; `p.age >= 70 ? 0.08 : p.age >= 60 ?
  0.025 : 0.005` for retire. **Retire is gated on `if (p.currentOffice)`** —
  free agents never retire today. No era tuning. No trait modifiers.
  `vacateOffice` is called on both death and retire transitions; behavior
  there is correct and untouched by this spec.

- **First-turn skip** at `phases.ts:113`: `if (phaseId === '2.4.1') return
  false; // no deaths`. This is inside the `currentEra === 'independence'`
  branch (lines 82–123). **Remove this line** — Layer 1. Turn-1 mortality for
  the 1772 seed politicians is expected and survivable (~377 politicians;
  Franklin at 66, deathMult 1.8 → ~4.5% per turn; expected 1-2 turn-1 deaths
  by Poisson approximation, see "First-turn implications" in Open Questions
  for sanity check).

- **`Trait` union** (types.ts:62–108) already contains `'Frail'` (NEGATIVE,
  types.ts:151) and `'Crisis Manager'` (POSITIVE, types.ts:117). **No new
  traits added** by this spec.

- **`Politician` interface** (types.ts:409–444) already contains
  `deathYear?: number` (line 427) and `retiredYear?: number` (line 428).
  **No new Politician fields** added by this spec.

- **PV interaction with death/retire** (`pv.ts`): `computePV` does NOT
  explicitly zero out `pvCache` on death/retire. However, `vacateOffice`
  clears `currentOffice = null` on both transitions, so the dead/retired
  politician loses office prestige (`+30 President`, `+5 Senator`, etc.).
  They retain skill/trait/command-derived PV. `factionLeaderOf` is NOT
  cleared by `vacateOffice` (per Faction Leaders Checkpoint 1 — the next
  2.2.3 catches stale leadership via Step 2 validation). All downstream
  consumers that filter `!p.deathYear && !p.retiredYear` already exclude
  dead/retired from eligibility (verified in 5 sites:
  `factionCenter` 620, `getFactionLeader` ~627, `runPhase_2_1_5` 706+,
  `runPhase_2_1_7_Kingmakers` mentor/protégé reads 869/873/1157/1191,
  `runPhase_2_2_3_FactionLeaders` Steps 0–3). **No PV math changes** by
  this spec.

- **`vacateOffice`** (phaseRunners.ts:1973–2005) already handles all
  currentOffice types correctly on death/retire. **Unchanged** by this
  spec.

- **`getFactionLeader` helper** (per Faction Leaders spec; verified pattern
  filters `!leader.deathYear && !leader.retiredYear`) already defends every
  leader-trait read against the 1-turn window between 2.4.1 death and the
  next 2.2.3 Step 2 validation. The proactive `factionLeaderOf` cleanup in
  Layer 1 (Open Questions item 7) closes that window even tighter.

- **`Era`** (types.ts:490): `'independence' | 'federalism' | 'nationalism' |
  'modern'`. The `MORTALITY_RULES.eraConfig` is keyed on these four ids
  directly via `satisfies Record<Era, {...}>` (matches the LEADERSHIP_RULES
  pattern, ensures TypeScript exhaustiveness).

- **`Roster` page** (`src/pages/Roster.tsx`, 46 lines): currently filters
  `politicians.filter((p) => p.factionId === game.playerFactionId &&
  !p.deathYear)` at line 10. The filter excludes dead but INCLUDES retired
  in its strict form — however, retired politicians are excluded implicitly
  because there's no UI affordance acknowledging them and most playtest paths
  treat them as gone. Spec Layer 4 makes the retired filter explicit and
  user-toggleable.

- **`rng.ts`**: all randomness via `chance(p)` — the existing runner already
  uses this pattern; new mortality rolls must continue using it (deterministic
  seeded RNG required).

## Mechanics (decided values)

### Layer 1 — Activate + constants refactor (binding)

#### 1.1 Remove first-turn skip

Delete the line at `phases.ts:113`:
```
if (phaseId === '2.4.1') return false; // no deaths
```

2.4.1 now fires from turn 1 in 1772 (and is unchanged in 1856 / future
scenarios where it already fires).

#### 1.2 New `MORTALITY_RULES` const

Placed after `LEADERSHIP_RULES` (currently ending at `types.ts:376`).
Single source of truth for the runner; zero magic numbers remain in the
runner body.

```
export const MORTALITY_RULES = {
  // Age-banded base rates (descending; first matching threshold wins).
  // Anchored to modern (post-1980) US rates; era multipliers shape pre-modern.
  deathBracket: [
    { minAge: 80, rate: 0.18 },
    { minAge: 70, rate: 0.07 },
    { minAge: 60, rate: 0.025 },
    { minAge: 0,  rate: 0.005 },
  ],
  retireBracket: [
    { minAge: 70, rate: 0.08 },
    { minAge: 60, rate: 0.025 },
    { minAge: 0,  rate: 0.005 },
  ],

  // Trait multipliers (death only — retire is unaffected by traits in v1).
  frailDeathMult: 1.5,            // anchored: W.H. Harrison, FDR, Wilson, Calhoun, Webster
  crisisManagerDeathMult: 0.85,   // gameplay-only; UI-flagged '(gameplay)' per historian

  // Per-era multipliers applied to base bracket rates.
  // Death multipliers: pre-1860 mortality ~1.5-2× modern; 1860-1900 ~1.2-1.5×; modern baseline.
  // Retire multipliers: floor at 25% of modern's 1.5 (i.e. 0.375) per user binding — game-feel
  // override on historian's "post-1935" finding; see Historical grounding deviation note.
  eraConfig: {
    independence: { deathMult: 1.8, retireMult: 0.5 },
    federalism:   { deathMult: 1.6, retireMult: 0.6 },
    nationalism:  { deathMult: 1.3, retireMult: 0.9 },
    modern:       { deathMult: 1.0, retireMult: 1.5 },
  } as const satisfies Record<Era, {
    deathMult: number;
    retireMult: number;
  }>,
} as const;
```

The `satisfies Record<Era, ...>` is the exhaustiveness lever (matches
`LEADERSHIP_RULES.eraConfig` pattern). When a 5th era is added later, this
const is a compile-time bind point.

**No `MORTALITY_FEED_CAP`** — the existing event-log infrastructure
(`addLog(snap, '2.4.1', 'death' | 'retire', ...)`) handles narration; no
new structured feed entry type is needed.

#### 1.3 Replace `runPhase_2_4_1_Deaths` body

The new runner (semantics; architect picks final implementation shape):

1. Read `cfg = MORTALITY_RULES.eraConfig[snap.game.currentEra]`.
2. For each `p` in `snap.politicians`:
   - Skip if `p.deathYear || p.retiredYear`.
   - Compute `baseDeathRate` = first matching `MORTALITY_RULES.deathBracket`
     entry by `p.age >= minAge`.
   - Apply trait multipliers (Layer 2): `traitMult = (Frail ? 1.5 : 1) *
     (Crisis Manager ? 0.85 : 1)`. If both traits present, multipliers
     compose (`1.5 * 0.85 = 1.275`).
   - `deathChance = clamp(baseDeathRate * cfg.deathMult * traitMult, 0, 1)`.
   - On `chance(deathChance)`:
     - Set `p.deathYear = snap.game.year`.
     - Open Question 7 cleanup: if `p.factionLeaderOf`, clear the matching
       `Faction.leaderId` / `Faction.leadershipStartYear` AND `p.factionLeaderOf`.
     - Open Question 8 cleanup: if `p.protegeId`, clear the matching mentor
       side; symmetrically, scan for any `q.protegeId === p.id` and clear
       `q.protegeId` + `q.bondedYear`.
     - `addLog(snap, '2.4.1', 'death', \`\${p.firstName} \${p.lastName} (\${p.state.toUpperCase()}, age \${p.age}) has died.\`)`.
     - `vacateOffice(snap, p)`.
     - `continue` (a politician can't both die AND retire this tick).
   - Compute `baseRetireRate` = first matching `MORTALITY_RULES.retireBracket`
     entry by `p.age >= minAge`.
   - `retireChance = clamp(baseRetireRate * cfg.retireMult, 0, 1)`.
   - Layer 3 binding: **no `if (p.currentOffice)` gate**. Every alive
     non-dead politician rolls retire.
   - On `chance(retireChance)`:
     - Set `p.retiredYear = snap.game.year`.
     - Open Question 7 cleanup (same as death): clear leadership state if
       applicable.
     - Open Question 8 cleanup (same as death): clear protégé chain.
     - `addLog(snap, '2.4.1', 'retire', \`\${p.firstName} \${p.lastName} (\${p.state.toUpperCase()}, age \${p.age}) has retired.\`)`.
     - `vacateOffice(snap, p)` (no-op for free agents; correctly handles
       officeholders).
3. No `refreshPv` call — `vacateOffice` doesn't dirty PV directly, but
   `currentOffice = null` will be picked up on the next phase's natural
   `refreshPv` (Layer 4 of the existing turn loop). Architect can add a
   single end-of-runner `refreshPv` for symmetry; flagged in Open Questions.

Worked example (independence era, age 60, no traits):
`baseDeathRate = 0.025; deathChance = 0.025 * 1.8 = 0.045` (4.5%/yr).
With `Frail`: `0.045 * 1.5 = 0.0675` (6.75%/yr).
With `Crisis Manager`: `0.045 * 0.85 = 0.038` (3.8%/yr).
Retire: `baseRetireRate = 0.025; retireChance = 0.025 * 0.5 = 0.0125`
(1.25%/yr — meaningful but not dominant; death still dominates 3.6:1 at this age).

Worked example (modern era, age 70, no traits):
`baseDeathRate = 0.07; deathChance = 0.07 * 1.0 = 0.07` (7%/yr).
Retire: `baseRetireRate = 0.08; retireChance = 0.08 * 1.5 = 0.12` (12%/yr).

### Layer 2 — Trait integration (binding)

Two trait multipliers on death chance, applied multiplicatively after the
era multiplier:

- **`Frail`** (NEGATIVE, exists at `types.ts:151`): `deathMult = 1.5`.
  Anchored in the historian's confirmed cases — W.H. Harrison (1841), FDR
  (1945), Wilson (1919 stroke), Calhoun (1850), Webster (1852). Signal is
  anecdotal not statistical; `1.5×` is moderate.
- **`Crisis Manager`** (POSITIVE, exists at `types.ts:69`): `deathMult =
  0.85`. Historian-flagged as having **no historical signal**; this is a
  game-balance choice. The Roster / draft-scouting UI MUST surface this as
  `(gameplay)` flag wherever the trait's death-modifier is displayed — see
  Layer 4 / Open Questions 6.

**Retire chance is unaffected by traits in v1.** Layer 3 keeps retire purely
era-driven; no `Frail-retires-early` or `Crisis-Manager-stays-late` hook.
Flagged in Open Questions as a possible future extension.

Compositional behavior: a politician with BOTH `Frail` AND `Crisis Manager`
gets `1.5 * 0.85 = 1.275×` death chance. Acceptable; the traits multiply,
they don't cancel.

### Layer 3 — Retire mechanic redesign (binding)

**Lift the `if (p.currentOffice)` gate** at the current line 1965. Every
alive non-retired non-dead politician rolls retire each turn, subject to
the era's `retireMult`.

Semantically, the era multipliers were chosen to make this change
behaviorally inert in the early eras and meaningful in the modern era:

| Era | `retireMult` | 60-yr-old retire/yr | 70-yr-old retire/yr |
|---|---|---|---|
| independence | 0.5 | 1.25% | 4% |
| federalism | 0.6 | 1.5% | 4.8% |
| nationalism | 0.9 | 2.25% | 7.2% |
| modern | 1.5 | 3.75% | 12% |

In independence, lifting the gate exposes free agents to retirement at
1.25–4%/yr — meaningful but not dominant; death still wins ~3:1 at 60+
(eraConfig deathMult 1.8 vs retireMult 0.5). This is a user-binding game-feel
override on the historian's "almost never" pre-1935 finding — flagged in
Historical grounding deviations. In modern, the same lifting drives the dominant
exit pattern (12%/yr at 70 is the realistic post-1980 senate norm).

`vacateOffice` is called on retirement transitions regardless of whether
the politician held office — for free agents it's a no-op (the early
return at line 1974 short-circuits).

### Layer 4 — Roster page extensions (binding)

Modify `/home/user/AMPU/src/pages/Roster.tsx` to surface retired
politicians:

1. **Add a `Show retired` toggle** (default off). Component-state via
   `useState<boolean>(false)` — NOT persisted in snapshot, NOT a URL param.
   Matches the project's convention for ephemeral UI filters.

2. **Update the filter** at line 10:
   ```
   const mine = politicians.filter((p) =>
     p.factionId === game.playerFactionId
     && !p.deathYear
     && (showRetired || !p.retiredYear),
   );
   ```
   Dead politicians remain filtered unconditionally (separate concern; the
   spec does NOT add a `Show dead` toggle in v1).

3. **Visual distinction for retired rows**:
   - Muted text (Tailwind: `opacity-60` on the row wrapper or `text-slate-500
     dark:text-slate-400` on cell text — architect picks the cleanest
     SortableTable integration).
   - `Retired YYYY` badge inline in the Office column (replaces the current
     `careerTrack ?? 'Free'` fallback for retired rows): `<span
     className="text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700
     text-slate-600 dark:text-slate-400">Retired {p.retiredYear}</span>`.
   - **No action buttons** on retired rows (Roster doesn't have action
     buttons today; this is a forward-compat note for any future Roster
     interaction added downstream).

4. **Sort behavior**: retired rows sort mixed in with active rows by the
   user's chosen column (default PV descending). The muted styling provides
   the visual separation; no "Retired section at the bottom" grouping.
   Matches the "show me my roster history, but don't make it a separate
   archive" intent.

5. **Header count update**: `Roster — {mine.length} Politicians ({active}
   active, {retired} retired)` when `showRetired` is on; otherwise the
   current `Roster — {mine.length} Politicians` text. Compact, informative.

Dead politicians remain filtered out unconditionally — separate concern,
separate (out-of-scope) future feature if ever desired.

## State shape (binding)

**No state shape changes.** Specifically:

- No new `Politician` fields (`deathYear` / `retiredYear` already exist at
  types.ts:427–428).
- No new `Faction` fields.
- No new `GameState` fields. No `deathsFeed` — existing `addLog` + the
  EventLog page render the death/retire log entries already.
- No new traits — `Frail` and `Crisis Manager` exist.
- One new `const MORTALITY_RULES` in types.ts (no new exported types beyond
  what TypeScript infers).
- One Roster-component-local `useState<boolean>` for `showRetired`. No
  snapshot persistence; lost on page-nav, restored to default on reload.

**No save migration required.** Legacy saves load unchanged. The runner is
purely additive in behavior on the next tick.

## Acceptance criteria

### State & types
- [ ] 1. `MORTALITY_RULES` const placed after `LEADERSHIP_RULES` in
  `types.ts` (currently ending at line 376). Shape exactly per §1.2:
  `deathBracket`, `retireBracket`, `frailDeathMult`, `crisisManagerDeathMult`,
  `eraConfig` keyed by `Era` literals via `satisfies Record<Era, {...}>`.
- [ ] 2. No new `Politician`, `Faction`, or `GameState` fields. No new
  `Trait` union members. No new POSITIVE/NEGATIVE arrays churn.

### Engine — first-turn activation
- [ ] 3. Line `if (phaseId === '2.4.1') return false; // no deaths` is
  removed from `phases.ts:113`. 2.4.1 fires on turn 1 in 1772. Existing 1856
  scenario behavior is unchanged (2.4.1 already fired there from turn 1).

### Engine — runner rewrite
- [ ] 4. `runPhase_2_4_1_Deaths` (phaseRunners.ts:1954–1971) is replaced
  wholesale. The new body has zero hardcoded numbers; every numeric reads
  from `MORTALITY_RULES`.
- [ ] 5. Death chance = `clamp(baseDeathRate * cfg.deathMult * frailMult *
  crisisManagerMult, 0, 1)` where `baseDeathRate` is the first matching
  `deathBracket` entry by `p.age >= minAge` (descending order); `frailMult =
  p.traits.includes('Frail') ? MORTALITY_RULES.frailDeathMult : 1`;
  `crisisManagerMult = p.traits.includes('Crisis Manager') ?
  MORTALITY_RULES.crisisManagerDeathMult : 1`.
- [ ] 6. Retire chance = `clamp(baseRetireRate * cfg.retireMult, 0, 1)`
  where `baseRetireRate` is the first matching `retireBracket` entry by
  `p.age >= minAge`. **No trait multipliers on retire in v1.**
- [ ] 7. **No `if (p.currentOffice)` gate on retire.** Every alive
  non-dead non-retired politician rolls retire. Free agents who retire have
  `vacateOffice` called (no-op early return; correct).
- [ ] 8. A politician who dies this tick does NOT also roll retire (the
  current `continue` after death is preserved).
- [ ] 9. The runner is pure over `snap`; uses `chance(p)` from rng.ts only
  (no `Math.random`); deterministic across runs given the same seed.

### Engine — cross-system cleanup on death/retire (Open Questions 7 & 8 resolutions)
- [ ] 10. On death or retire, if `p.factionLeaderOf` is non-null:
  - Look up the faction via `snap.factions.find((f) => f.id ===
    p.factionLeaderOf)`.
  - Clear `f.leaderId = null` and `f.leadershipStartYear = undefined` on
    that faction.
  - Clear `p.factionLeaderOf = null` on the politician.
  This closes the 1-turn window between 2.4.1 and the next 2.2.3 Step 2
  validation sweep (per Faction Leaders Checkpoint 1 risk note). The next
  2.2.3 fills the vacancy via Election (no behavioral regression).
- [ ] 11. On death or retire, if `p.protegeId` is non-null (this politician
  is a mentor): look up the protégé via `snap.politicians.find((q) => q.id
  === p.protegeId)`; clear `protege.bondedYear = undefined` on the protégé
  side (preserving the protégé politician otherwise). Then clear
  `p.protegeId = null` on the dying/retiring mentor.
- [ ] 12. On death or retire, scan `snap.politicians` for any `q` with
  `q.protegeId === p.id` (this politician is a protégé of someone else);
  clear `q.protegeId = null` and `q.bondedYear = undefined` on those
  mentors (preserves the mentor; severs the bond).

### Engine — feed / logging
- [ ] 13. Each death writes `addLog(snap, '2.4.1', 'death', \`${firstName}
  ${lastName} (${STATE}, age ${age}) has died.\`)`. **No cause-of-death
  string** (per OUT OF SCOPE — drop `natural` / `duel` / `assassination`).
- [ ] 14. Each retire writes `addLog(snap, '2.4.1', 'retire', \`${firstName}
  ${lastName} (${STATE}, age ${age}) has retired.\`)`. Same era-uniform
  framing (no Cincinnatus "withdraws to private life" variant in v1 — see
  Open Questions).

### UI — Roster page
- [ ] 15. `src/pages/Roster.tsx` adds a `Show retired` checkbox toggle near
  the page header. Default `false`. Component-state `useState`, NOT
  persisted in snapshot.
- [ ] 16. When `showRetired === false`, the row filter excludes politicians
  with `p.retiredYear` set (matches today's implicit behavior). When `true`,
  retired rows are included.
- [ ] 17. Retired rows render with muted styling (e.g. `opacity-60` on the
  row OR `text-slate-500 dark:text-slate-400` on cell content — architect
  picks the cleanest SortableTable integration). The visual reads as "this
  person is no longer active."
- [ ] 18. Retired rows show a `Retired YYYY` badge in the Office column
  (replaces the `careerTrack ?? 'Free'` fallback for retired rows). Year
  text reads from `p.retiredYear`.
- [ ] 19. Retired rows sort mixed in with active rows by the user's chosen
  column (default PV descending). No separate "Retired section."
- [ ] 20. Header count reflects active vs retired when `showRetired` is on:
  `Roster — N Politicians (A active, R retired)`. Otherwise `Roster — N
  Politicians`.
- [ ] 21. **Dead politicians remain filtered out unconditionally.** No
  `Show dead` toggle in v1.

### Build & playtest
- [ ] 22. `npm run build` passes (typecheck + Vite bundle).
- [ ] 23. **Playtest 1772**: start the scenario. Turn 1 fires 2.4.1 (no
  longer skipped); 0-3 deaths in the founders' generation is expected.
  Advance ~10 turns; observe death:retire ratio death-dominant (~3:1 at 60
  in independence — the post-deviation ratio; historian's "death-in-office
  was ~4× more common pre-1972" anchor still holds in spirit). Some
  retirements may appear in the feed (independence retireMult = 0.5 is
  the user-binding floor; not zero).
- [ ] 24. **Playtest 1856**: start the scenario. Advance ~10 turns. Observe
  death:retire ratio approaches ~1.5:1 (nationalism deathMult 1.3 +
  retireMult 0.9 → narrow gap). Retirements clearly visible in the feed.
- [ ] 25. **Roster playtest**: open Roster. Verify the `Show retired`
  toggle exists and defaults off. Toggle on after a politician has retired;
  verify the retired row appears muted with `Retired YYYY` badge in the
  Office column. PV still readable; row is visually distinguishable from
  active rows. Sort by PV descending — retired row sorts mixed in.

## Edge cases

- **Turn 1 1772 mortality**. 1772 seed has ~377 politicians, oldest around
  66 (Franklin) and ~5–10 in the 60+ bracket per the dataset's age
  distribution. With independence `deathMult = 1.8` applied to base
  bracket rates: expected turn-1 deaths ≈ Σ(bracketRate × 1.8) across the
  age-eligible cohort ≈ 1–3 deaths. Acceptable; matches the "old founders
  drop occasionally" expectation. If playtest shows turn-1 mortality is
  jarring (e.g., 5+ deaths in a single tick), the architect can revisit
  `independence.deathMult` (currently 1.8) — flagged Open Question 1.

- **Politician with both `Frail` AND `Crisis Manager`**. Multipliers
  compose: `1.5 * 0.85 = 1.275`. The traits don't cancel; Frail still
  dominates. Acceptable.

- **Empty faction left by leader death/retirement**. When a leader dies/retires
  and is the only living member, the proactive cleanup (criterion #10) leaves
  `f.leaderId = null`. The next 2.2.3 Step 2 detects the vacancy and either
  installs a new leader (if any eligible members remain) or logs a `system`
  warning ("No eligible leader for X.") per the Faction Leaders spec. No
  crash.

- **Protégé chain cleanup on cascading death**. If a mentor dies turn N
  and the protégé dies turn N+1, the protégé's `protegeId` field is
  already cleared from turn N's mentor-death cleanup (criterion #12). The
  protégé's own death (turn N+1) hits the same cleanup paths but finds
  `protegeId === null` — no-op. No double-clear bugs.

- **Politician retires before drafting any politicians (free agent)**.
  `vacateOffice` early-returns when `currentOffice` is null. Retiring
  free agents just get `retiredYear = year` and the addLog feed entry; no
  crashes. Matches Layer 3 intent.

- **Modern-era 100-year-old**. With base bracket `>= 80: 0.18` and modern
  `deathMult = 1.0`, a 100-year-old still has only ~18%/yr death chance
  unless Frail (then 27%/yr). Acceptable — matches the Thurmond/Byrd/Feinstein
  late-life-service pattern the historian highlighted (selection effect:
  politicians who reach 90+ in office are already survivors).

- **`Crisis Manager` deathMult AND its presence as a positive trait in
  trait UI**. The trait already appears in tooltips / draft scouting as a
  POSITIVE trait (+4 baseline PV). Adding the `(gameplay)` flag on its
  death-modifier surfacing (Open Question 6) is the ONLY UI change in v1
  beyond Roster — trait base behavior is untouched.

- **`Frail` interaction with current `IDEOLOGY_SHIFT_ODDS.traitMods`**:
  Frail is not currently a referenced trait in any odds modifier outside
  this spec. No collision.

- **Player faction has zero living politicians**. The 1772 seed makes this
  impossible at start; cascading death could in theory hit zero, but the
  player loses by ordinary game-end conditions (no draft refill, no
  candidates for any office). Edge case acknowledged; not a blocker.

## Out of scope

- **Scripted historical-figure deaths.** No `HISTORICAL_DEATHS` table; no
  name-matching politicians to a historical death age. Hamilton can survive
  to 80; Washington can die at 50.
- **Dueling sub-system.** Hamilton-Burr 1804 and the broader 1790–1840
  duel culture are NOT modeled. Slightly under-models founding-era political
  mortality; acceptable v1 trade.
- **Cause-of-death narrative.** No `Politician.deathCause` field; no
  `natural` / `duel` / `assassination` strings. All deaths log uniformly as
  `has died`.
- **New Deaths page.** Existing EventLog + Roster (with Show retired
  toggle) are sufficient.
- **Retroactive scripted-death backfill on legacy saves.** No
  `repair()` migration; legacy saves load unchanged.
- **2.4.2 (Anytime Events) or 2.4.3 (Era Events) changes.** Out of scope.
- **`vacateOffice` modifications.** The function correctly handles all
  current OfficeType arms on death/retire. Unchanged.
- **Era-conditional log text** ("withdraws to private life" pre-1796 vs
  "retires" post-1935). Single uniform "has retired" string in v1.
  Flagged for future polish (Open Questions 5).
- **Trait modifiers on RETIRE chance.** Frail-retires-early, Crisis-Manager-
  stays-late, etc. — flagged as possible v2 extension; not in v1.
- **`Show dead` Roster toggle.** Only `Show retired` in v1; dead remain
  unconditionally filtered.

## Open questions / assumptions

### Resolved by PM at Checkpoint 1 with recommended defaults

1. **eraConfig magnitudes** (PM assumption, riskiest first if challenged):
   `independence { deathMult: 1.8, retireMult: 0.5 }`,
   `federalism { deathMult: 1.6, retireMult: 0.6 }`,
   `nationalism { deathMult: 1.3, retireMult: 0.9 }`,
   `modern { deathMult: 1.0, retireMult: 1.5 }`.
   Death multipliers align with historian's 1.5–2× / 1.2–1.5× / 1.1× /
   baseline ramp. **Retire multipliers floor at ~25% of modern (0.375) per
   user-binding game-feel override** — the historian's pre-1935 framing
   would put retireMult closer to 0.1/0.2/0.5; the user explicitly raised
   pre-modern retires to keep the mechanic visible across all eras. Death
   still dominates exits in pre-modern eras (~3:1 at 60 in independence).
   **Risk**: 1772 turn-1 deaths may run high. If
   playtest shows >3 turn-1 deaths consistently, lower `independence.deathMult`
   to 1.6 in a follow-up. Tunable single-const change.

2. **Age-bracket structure: stay age-banded vs Gompertz curve**. PM
   recommends **age-banded** (current 60/70/80 thresholds) — clarity for
   PM-tunability, no quantitative observability loss vs Gompertz at the
   game's 2-year-per-turn granularity. A Gompertz curve would be more
   "realistic" but harder to tune in a spreadsheet and harder to debug. v1
   ships banded.

3. **Roster `Show retired` filter persistence: component state vs URL
   param vs snapshot**. PM recommends **component state via `useState`**
   (default off, lost on page-nav). Matches the project's existing convention
   for ephemeral UI filters; no snapshot pollution. URL params would be
   over-engineered for a single boolean; snapshot persistence would imply
   the filter is gameplay state, which it isn't.

4. **Roster retired-row sort behavior: mixed in by PV vs separate section
   at bottom**. PM recommends **mixed by PV** with muted styling providing
   visual separation. Matches the "show me my faction history without
   archiving it" intent. A separate section would force the player to
   scroll past it, defeating the toggle's purpose.

5. **`Retired YYYY` badge text vs richer**. PM recommends **`Retired
   YYYY`** muted badge (e.g., `Retired 1782`). Era-conditional text
   ("Withdraws to private life" pre-1796 / "Retires" post-1935) would be a
   nice polish but adds string-table complexity disproportionate to v1
   value. Flagged for future.

6. **`Frail` / `Crisis Manager` UI flag in trait tooltips: should the
   tooltip explicitly note these affect death chance, with `(gameplay)`
   suffix on Crisis Manager?** PM recommends **YES on both**, with a
   `(gameplay)` suffix on Crisis Manager. Trait tooltip text suggestions:
   - Frail: `Frail — More likely to die at advanced age. (×1.5 death chance.)`
   - Crisis Manager: `Crisis Manager — Reduces death chance. (×0.85,
     gameplay.)`
   The `(gameplay)` suffix executes the historian's binding caveat that
   Crisis Manager has no historical mortality signal. Architect: identify
   the trait-tooltip surface (likely `DraftScouting.tsx` or a shared
   `TraitChip` component) and apply the text additions. This is a v1
   binding, NOT a polish — Layer 2 acceptance criterion #6 surface.

7. **Dead-leader stale `factionLeaderOf`** (per Faction Leaders Checkpoint
   1). PM recommends **YES — proactively clear in 2.4.1 death/retire
   handler** (criterion #10 above). Closes the 1-turn window completely.
   Cheap (3 lines of code per transition). Matches Faction Leaders'
   `getFactionLeader` defense pattern but reduces it to a single tick of
   risk instead of a turn.

8. **Dead-protégé / dead-mentor chain cleanup** (per Kingmaker spec). PM
   recommends **YES — clear `protegeId` on both sides of the bond**
   (criteria #11 and #12 above). Symmetric cleanup; bondedYear cleared too.
   Verifies with the Kingmaker spec pattern (looking at phaseRunners.ts:869,
   873, 1157, 1191 — every mentor/protégé read already filters
   `!m.deathYear && !m.retiredYear`, so the chain is already defended at
   READ sites; cleanup at the death/retire WRITE site is belt-and-suspenders
   but cheap and reduces stale-data noise in DevTools inspection).

9. **First-turn implications** (1772 seed mortality sanity check):
   - 1772 seed: ~377 politicians, age distribution roughly skewed young.
   - Old cohort estimate: Franklin (66), plus a handful of others in
     50s–60s. Maybe ~5 politicians in the 60+ band, ~25 in the 50s.
   - Turn-1 expected deaths: `Σ deathChance` ≈ `(5 × 0.025 × 1.8) + (25
     × 0.005 × 1.8)` = `0.225 + 0.225` = `0.45` expected deaths from the
     senior cohort, plus tiny contributions from the younger majority.
     Total turn-1 expected ≈ 1–2 deaths. Acceptable; not jarring.
   - If playtest shows 4+ turn-1 deaths, reduce `independence.deathMult`
     to 1.6.

### Genuinely open (architect / playtest may need to revisit)

10. **End-of-runner `refreshPv` call**. `vacateOffice` clears
   `currentOffice` which is a `pvCache` input via `OFFICE_PRESTIGE`. The
   stale `pvCache` on dead/retired politicians is read by Roster (where
   they're now shown as muted) and by 2.2.3 challenger-pool eligibility
   (filtered by `!p.deathYear && !p.retiredYear`, so the stale value
   doesn't leak). PM recommends **add a single `refreshPv` at end of
   runner** for symmetry with 2.2.3 — cheap, predictable. Architect can
   decide if the perf cost is justified; if not, omit and the cached value
   stays slightly stale until the next phase's natural refresh.

11. **Trait propagation on retire (deferred)**. v1 ships retire as
   purely era-driven (no trait multipliers). A "Frail politicians retire
   earlier" hook would be historically defensible (the 1850s Whig
   triumvirate's withdrawal trajectories pattern), but adds complexity
   for marginal narrative gain. Flagged as v2.

12. **`MORTALITY_RULES.deathBracket` as array vs `Record<number, number>`
   keyed by minAge**. PM ships as **array of `{ minAge, rate }`** — cleaner
   iteration semantics ("first matching descending minAge"), simpler to
   PM-tune in a code review. A `Record` keyed by minAge would require
   sort-on-read in the runner. Architect can convert if they prefer, but
   the array shape matches `RELOCATION_ODDS` / `IDEOLOGY_SHIFT_ODDS`'s
   nested-object style.

---

Spec path: `/home/user/AMPU/docs/specs/deaths-retirements.md`

## Checkpoint-1 summary

- **User story**: As a faction-running player, I want politicians to die
  and retire at historically plausible rates (heavy mortality + lighter-but-
  visible retirement in 1772; balanced mortality + dominant retirement in
  modern era), with `Frail` (×1.5 death) and `Crisis Manager` (×0.85 death,
  UI-flagged `(gameplay)`) trait modifiers, and retired veterans visible on
  the Roster behind a toggle, so my long-term roster planning has real
  attrition risk and my draft trait choices carry weight.
- **Top acceptance criteria**: (1) `MORTALITY_RULES` const added to
  types.ts after `LEADERSHIP_RULES` with age-banded brackets + per-Era
  `deathMult` / `retireMult` (criterion #1, #5–6); (2) `phases.ts:113`
  first-turn-skip line removed (criterion #3); (3) retire mechanic loses
  the `if (p.currentOffice)` gate — every alive politician rolls retire
  subject to era multiplier (criterion #7); (4) proactive cleanup of
  `factionLeaderOf` and protégé chains on death/retire (criteria #10–12);
  (5) Roster page gains `Show retired` toggle with muted styling +
  `Retired YYYY` badge (criteria #15–20).
- **Historian facts that most shaped the design**:
  (a) The `e₂₀`-based 1.5–2× pre-1860 / 1.2–1.5× 1860–1900 / ~baseline 1950+
  mortality ramp directly produced the eraConfig `deathMult` values 1.8 /
  1.6 / 1.3 / 1.0;
  (b) "Retirement-as-life-stage is post-1935" produced the era `retireMult`
  ramp 0.5 / 0.6 / 0.9 / 1.5 — the pre-modern values are user-floored at
  25% of modern for game-feel (deviation flagged in Historical grounding);
  (c) "Death-in-office was ~4× more common pre-1972" still validates the
  death:retire ratio shift across eras (~3:1 in 1772, ~1.5:1 in 1856,
  ~1:1.7 modern — compressed by the retire floor but death still dominates
  pre-modern);
  (d) "Frail has weak-but-real anecdotal signal" (W.H. Harrison, FDR, Wilson,
  Calhoun, Webster) anchored the `×1.5` death multiplier;
  (e) "Crisis Manager has NO historical signal" forced the `(gameplay)`
  UI flag on its `×0.85` death multiplier — a v1 binding, not future polish.
- **Riskiest open question**: 1772 turn-1 mortality magnitude. The vision's
  `independence.deathMult = 1.8` is the historian's recommended order-of-
  magnitude midpoint of the 1.5–2× range, but the 1772 seed includes a
  handful of older founders (Franklin at 66, plus ~5 others in their 60s);
  expected turn-1 deaths ~1–2 by Poisson approximation, but variance is
  real. If playtest shows ≥4 turn-1 deaths consistently jarring the
  scenario opening, lower to 1.6 — single-const tune.
- **One historian deviation, user-approved at Checkpoint 1**: pre-modern
  retireMult floored at ~25% of modern (0.5 / 0.6 / 0.9 vs the historian-
  suggested 0.1 / 0.2 / 0.5) for game-feel — retirement should be visible
  in all eras, not just post-1935. Flagged in Historical grounding §
  Deviations. All 4 other binding facts respected without deviation.
