# Digest — `meters` (DATASET ingest, not a forum thread)

**Source:** `Meters.xlsx` (`Copy_of_Meters.xlsx`), **3 tabs**. Gitignored preprocess
artifact under `docs/game/sources/meters/` (`analysis.md` the model + reconciliation,
`sample.md` the tab shapes, `meters_definitions.csv` / `meters_ids.csv` /
`meters_position_by_startdate.csv` the full matrices — **NOT transcribed here**).
Historian grounding: `docs/game/historical-context-meter-trajectories.md`.

**Provenance form:** dataset — cite by **tab** (`Meters` / `MeterIDs` / `Meter Position
by Start Date`), meter name/ID, descriptor-row, or start-date column. **No forum POST
numbers exist**; do NOT invent `POST n` cites. Playtester-name scan: **0 hits** (pure
mechanical data). This is the authoritative DATA/spec version of the earlier forum
discussion `6801b9f4-meter-interpretation` — supersedes it, does not duplicate it.

---

## What this dataset is (one line)
The game's **meter-system designer SPEC** (23 meters, each defined by one descriptor
template with per-position Effects / Crises / Restrictions / Spending-limits /
Election-bonuses) **+ the meter BOOT-SEED** (each meter's canonical position at every
presidential cycle 1772 → "Beyond"). The meter half of scenario-boot state, parallel
to the officeholder seed (#344).

## The 3 tabs
- **Meters** (102×10) — the per-meter DESCRIPTOR TEMPLATE (below).
- **MeterIDs** (23 rows) — the 23 canonical meters → programmatic IDs.
- **Meter Position by Start Date** (23×61) — each meter's POSITION at every
  presidential cycle (1772, 1788, then every 4 yrs → "Beyond") = the boot-seed.

## The 23 meters → IDs (MeterIDs tab)
`Revenue-Budget`→`Revenue_Budget` · `Economic Stability`→`Economic_Stability` ·
**8 Foreign Relations** (`UK / France / Spain / Germany / Russia / China / Japan /
Israel _Foreign_Relations`) · `Military Preparedness` · `Domestic Stability` ·
`Honest Government` · `Quality of Life` · `Planet's Health` · `Party Preference` ·
**7 Enthusiasm** (`LW_Populist / Progressive / Liberal / Moderate / Conservative /
Traditionalist / RW_Populist _Enthusiasm`).

## The per-meter DESCRIPTOR TEMPLATE (Meters tab) — an ~8-position scale
Each meter is defined across **positions 1–8** (foreign relations **1–9**), neutral
≈ 5, with these rows (Revenue-Budget worked example in `sample.md`):
- **Description** — per-position label (Rev-Budget: Severe Overspending → Balanced (5) → Very Underbudget).
- **Current** — an `X` marking a position — a WORKED EXAMPLE, **not** seed data.
- **Effect** — per-position engine effect ("5% chance Economic Stability −1"; "60% chance increases national debt"; "No effect" at balanced).
- **Restrictions to other meters?** — cross-meter GATES ("Economic Meter cannot [rise] while overspending").
- **Spending Bill Restrictions** — **era-tiered** (3 rows: *up through Nationalism* / *Gilded-Age through …* / *Ideologies onward*): position-gated caps on non-crisis spending bills ("Yes, only N non-crisis").
- **Crisis?** — per-meter crisis threshold (below).
- **Restrictions** — action prereqs ("Req: Assume State Debt").
- **Election Bonus / Penalties** — per-position election modifiers (pos 2 "+1 for Progressives"; pos 7 "+1 for Conservatives"; "−1 Enthusiasm for Traditionalists").

### The 7 CRISIS types + thresholds (low positions trigger a crisis)
| Crisis | Fires at positions |
|---|---|
| Rev-Budget | 1–2 (Severe/Very Overspending) |
| Economic | 1–5 (through Stable; none at Boom) |
| Defense | 1–4 |
| Domestic | 1–5 |
| Corruption | 1–3 |
| Quality of Life | 1–2 |
| Climate | 1–3 |

## The meter BOOT-SEED (Position by Start Date tab)
23 meters × **61 presidential-cycle columns** (1772, 1788, … → **"Beyond"** = open-ended
future, not a year), values **1–9**. Encodes each meter's canonical position at each
cycle — e.g. UK-FR = 1 in 1772 (Revolution), France-FR = 9 in 1788, MilPrep ramps
2→5, Rev-Budget 2→7 by 1832 (debt retired 1835). **A boot at date *D* sets the meters
to column *D*.** This is the METER half of the boot seed the officeholder matrix
(`Start_Date_Info`, #344) began — one boot consumes BOTH.

---

## ★ Reconciliation vs shipped code (sheet = DESIGNER SPEC; flag divergences; NO code changes)
Verified @HEAD 2026-07-01.

**7 of 23 map 1:1 to shipped `NationalMeters`** (`types.ts:1399-1409`): Rev-Budget→`revenue`,
Economic→`economic`, MilPrep→`military`, DomStab→`domestic`, HonestGov→`honest`,
QoL→`quality`, Planet→`planet`.

**★ SCALE DIVERGENCE.** Shipped meters are an **11-point [-5,+5]** scale (11 labels each
`Meter.tsx:14-20`, neutral = 0, `Math.round(value+5)` index `:25`); the sheet is an
**~8-position** scale (FR to 9), neutral ≈ 5. Different granularity AND centering. The
sheet is even inconsistent internally (most 1–8, FR to 9) — a spec ambiguity to FLAG,
not "fix". Shipped scale framing = game-mechanics **§21.8** (named-ordinal + ±3 swing cap).

**★ 16 meters are modeled in THREE OTHER structures** (the sheet unifies all 23 as
first-class meters):
- **8 Foreign Relations** → `diplomacy: Record<string,number>` store (`types.ts:1574`,
  clamped −5..+5) = the **#107** diplomacy subsystem (game-mechanics §13.3.1/§13.3.4);
  effect channel `EraEventResponseEffect.diplomacy: {nation,delta}[]` (`:1454`). The
  sheet SHARPENS #107 with concrete per-cycle positions + the coercive-opening
  convention + the Germany-activates-late flag (below) — do NOT re-mint the FR meters.
- **Party Preference** → `partyPreference: number` scalar (`types.ts:1570`, clamped
  [-5,+5] `:1093-1094`).
- **7 Enthusiasm** → `enthusiasm: Enthusiasm` ideology×party struct (`types.ts:1415,1571`)
  = the **#51** enthusiasm engine.

**★ Rich per-position content is largely UNBUILT.** `applyEffect` (`phaseRunners.ts:3209`)
only nudges values + clamps; there is no position-triggered effect/crisis/gate engine.
The 5 descriptor content channels map to owners as follows:

| Descriptor channel | Owner (do NOT re-mint) |
|---|---|
| per-position **Effect** (probabilistic meter→meter) | **#237** (meter→effect content) + **#179** / §20.10 (turn-to-turn meter movement) |
| **7 Crisis** thresholds | **#88 / #188** (meter-driven end/crisis) + §12.7 `*Crisis Bill*` tag + §22.1 crisis/cascade |
| **Election Bonus / Penalties** (±1 Enthusiasm by ideology/position) | **#18** (State-of-the-Meters election-bonus map, §15.3.8) + **#51** |
| cross-meter **Restrictions** (meter gates meter) | **NONE** → minted #350 |
| era-tiered **Spending-Bill** limits | **NONE** (sheet supplies the caps §12.7's Crisis-Bill exemption references) → minted #350 |

**Shipped boot-seed partial:** each scenario hardcodes a flat `STARTING_METERS:
NationalMeters` const — `scenario1856.ts:8-16` (revenue 0 / economic 1 / military −1 /
domestic −2 / honest 0 / quality 0 / planet 4) and `scenario1772.ts:9` (used `:77`).
Only the 7 `NationalMeters`, [-5,+5] scale, 2 windows. No per-start-date meter table;
`diplomacy`/`partyPreference`/`enthusiasm` seeded separately.

## Historian divergence flags (`historical-context-meter-trajectories.md`)
Carry these into the boot-seed DATA (light grounding pass — marquee inflections, not
all 23×61 cells verified):
1. **★ Germany-FR activates ~40 yrs LATE** — first non-neutral at **1912**, vs German
   unification **1871** / US-Prussia treaty 1785 / Wilhelmine friction 1889–1903. A boot
   1872–1908 shows NO German relationship. WWI-onward correct.
2. **FR "coercive-opening" convention** — Japan's forced opening (Perry 1853) is a **DIP
   to 4**, i.e. low = adversarial/coerced, NOT "no relationship". Activation dates EXACT:
   **China 1844, Japan 1853/54, Israel 1948**.
3. **Panic of 1819 MISSING** from Economic Stability (1816–24 held at 8) → a 1820 boot
   reads as a boom, not a bust. Panic of 1907 barely registers (1908 = 5).
4. **Great Depression is ECONOMIC, not domestic** — EconStab craters to **1** at 1932,
   but DomStab only dips to 4 (and 1924 DomStab = 9 likely overstates 1920s calm).
5. **LW-Populist Enthusiasm = 1 at 1896** — counterintuitive vs the Bryan / People's-Party
   peak; defensible only as post-defeat collapse. Confirm movement-momentum vs
   post-election-outcome reading before wiring to events.

---

## Gaps minted (Built vs Designed log)
- **#348** — the **unified 23-meter MODEL + scale/model reconciliation**: the sheet's one
  descriptor template across 23 first-class meters (8/9-position scale) vs the shipped
  split (7 `NationalMeters` [-5,+5] + diplomacy-dict #107 + partyPreference-scalar +
  Enthusiasm-struct). Designer-decision: adopt the unified model / remap the scale, or
  keep the split + an adapter. Sheet = designer intent; flag divergences.
- **#349** — the **meter BOOT-SEED** (Position-by-Start-Date tab): a boot at date *D*
  sets all meters to column *D*. The meter half of the boot seed, **parallel to #344**;
  ties the boot cluster #86/#92/#115/#186 + #344-#346. Carries the 5 historian flags.
- **#350** — the two genuinely-**unowned** descriptor channels: cross-meter
  **Restrictions** (meter gates meter) + era-tiered **Spending-Bill** limits (position ×
  era → non-crisis spending-bill cap, §12.7 Crisis Bills exempt).

## Corroborations folded onto existing owners (NOT re-minted)
- **#107** — concrete per-cycle FR positions + coercive-opening convention + the
  Germany-40yrs-late flag SHARPEN the 8-FR-meter diplomacy subsystem.
- **#88 / #188** — the 7 Crisis types + explicit position thresholds are the
  authoritative crisis-trigger spec (attach to §12.7 / §22.1).
- **#18 / #51** — the per-position Election Bonus/Penalty rows are the concrete
  per-position spec for the State-of-the-Meters election-bonus map + enthusiasm engine.
- **#237 / #179** — the per-position Effect rows are concrete meter→effect content.
- **#266** — the meter-at-floor floor-penalty flaw interacts with the low-position
  Crisis/penalty content (a floored meter still sits at a crisis threshold).

## Open questions (human / game-master + tech-lead)
1. **Scale mapping** — 8/9-position → 11-point [-5,+5]: linear remap, or re-center to the
   sheet's neutral-5? What to do with the FR-to-9 internal inconsistency (#348).
2. **Model** — unify all 23 as first-class meters, or keep the 4-way shipped split + an
   adapter presenting them uniformly (#348)?
3. **Germany-FR timing** — ship the sheet's 1912 activation as-is, or correct to
   ~1871/1890s for boots in that window (#349, historian flag 1)?
4. **LW-Populist-1896** — movement-momentum (high 1892–96) or post-defeat-collapse
   reading (#349, historian flag 5)?
5. **"Beyond" column** — how a boot past the last dated cycle reads the open-ended
   final column (#349).

## Provenance
- Dataset: `Meters.xlsx` — Meters / MeterIDs / Meter-Position-by-Start-Date tabs
  (gitignored under `docs/game/sources/meters/`).
- Preprocess: `docs/game/sources/meters/analysis.md` (model + reconciliation) +
  `sample.md` (tab shapes). Full CSVs sibling, NOT transcribed.
- Historian grounding: `docs/game/historical-context-meter-trajectories.md`.
- Code anchors verified @HEAD 2026-07-01: `types.ts:1399-1409` (`NationalMeters`),
  `:1415/1570/1571/1574` (Enthusiasm/partyPreference/enthusiasm/diplomacy),
  `:1093-1094/1450/1454` (clamps + effect channels), `Meter.tsx:14-25` (labels + scale),
  `phaseRunners.ts:3209` (`applyEffect`), `scenario1856.ts:8-16` / `scenario1772.ts:9`
  (`STARTING_METERS`).
- Reconciled against: forum `6801b9f4-meter-interpretation` (this is the authoritative
  data version); game-mechanics §13.3.1/§13.3.4 (#107), §15.3.8 (#18), §20.10 (#179),
  §21.8 (scale), §22.1 (meter bank), §12.7 (Crisis-Bill).
