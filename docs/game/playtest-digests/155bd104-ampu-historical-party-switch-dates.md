# Digest — 155bd104 "AMPU Historical Party Switch Dates"

**Scope:** DESIGN-ORIGIN thread (politicslounge topic 306, ~15–16 Jun 2021),
2 posts / 1 chunk (`chunk-001.md`, 3.5 KB). Topic: **vcczar has finished entering
HISTORICAL PARTY-SWITCH DATES per politician** — the data + the MODES by which a
politician changes `partyId` during a campaign. This is the **design origin of
the historical-party-switch-date DATA layer, the auto/player-driven switch MODES,
the per-politician "flippable" attribute, and the realignment flip-year
calibration guide.** It is the **direct SIBLING** of the relocation thread
(`4e518e05`) — same author, same week, same "historical-date DATA + auto/manual/
event MODES" shape; vcczar says he'll do relocation dates "next" (POST 1). Pure
design intent; corroborated **0% built** for the switch-date system below (the
shipped game has a player-driven faction-CONVERSION phase that is the spiritual
mode-3, but no switch-date data, no auto-historic mode, no `flippable` flag).
**DIGEST ONLY** — no living-doc edits. Cites `POST n` = `===== POST n =====`.

Participants (authority): **@vcczar** (tier-1, designer — owns the feature, sole
substantive poster). **@Patine** (contributor, tier-4 — POST 2 what-if Q on Clay/
Whig extinction; no mechanic). The @-mention roll-call in POST 1 is a notify list,
not content.

---

## ★ The mechanic — historical party-switch dates (POST 1, vcczar)

**What's being added:** vcczar spent "several hours" entering **historic
party-switching dates for politicians**, **anchored to PRESIDENTIAL TERM YEARS** —
"a 1994 switch is marked 1996" (POST 1). (Same term-year snap as the dataset's
`draftYear` = nearest mult-of-4 rule, CLAUDE.md.) Three consequences:

1. **Start-date historical-party assignment** — because start dates land on
   presidential-term years, a switched politician **begins each scenario start
   date with their HISTORICAL party as of that date.** (POST 1) A pol who flipped
   IRL in 1850 starts an 1856 game in their post-flip party.
2. **Optional "historic party switching" MODE** — auto-applies the scheduled
   historical switches and **DEACTIVATES player switch attempts.** Example:
   **Elizabeth Warren auto-switches to Democrats in 1996** (POST 1). (Exact
   structural twin of relocation's "auto-move at historical dates" mode.)
3. **Player-driven switching MODE** — players must **actively convert
   politicians**; **events also grant party-switch chances** (POST 1). (This is
   the mode the shipped faction-conversion phase + scripted-event grants
   resemble — see Shipped-vs-designed.)

→ The two modes are **mutually exclusive** (auto deactivates player attempts) —
the same auto-vs-manual exclusivity the relocation thread frames as a settings
toggle (cross-ref `4e518e05` / #263 realism-settings umbrella).

## ★ The "flippable" per-politician attribute + the drafting-strategy axis (POST 1)

vcczar poses it as a **drafting trade-off** (capture — it's a design axis, not
banter): *"Is it better to draft a C+ politician that will stay loyal or a B-
politician that is flippable? Someone you might lose!"* (POST 1) → **loyalty vs
flippability is a deliberate scouting/drafting tension** (higher ceiling but
defection risk vs lower ceiling but reliable).

**Population sizing (calibration data, POST 1):**
- **~8–10% of AMPU politicians are flippable.**
- **<1% flip parties MULTIPLE times** (e.g. **Trump**).

→ Implies a **per-politician boolean/flag** (flippable?) **plus** the scheduled
switch DATE(s), with a rare multi-flip subset. (See Shipped-vs-designed: the
build has a RANDOM 8% `Opportunist` + 8% `Loyal` seed that *numerically* matches
the ~8–10% figure — but it's RNG, not this historical per-pol data.)

## ★ Realignment flip-year guide — era/scenario CALIBRATION data (POST 1)

vcczar's "biggest flip-date years" guide (the macro realignment schedule the
switch-dates aggregate to). **Era-aware — direction of flow matters per era:**

| Term-yr | Realignment driver | Net flow (POST 1) |
|---|---|---|
| **1796** | Hamilton upsets some Federalists | Federalist churn |
| **1824** | Monroe's lack of party leadership → his party breaks in half | **conservative Federalists → Democrats** (surprising); **most flippers → "Red Party"** |
| **1856** | Whig collapse / slavery | **anti-slavery Dems → new Republican Party**; **conservative Whigs → Democrats** |
| **1872** | Gilded Age, corruption, Reconstruction | net **→ Democrats** |
| **1896** | Bimetallism splits | **Gold → Republicans**; **soft-money / pro-poorer → Democrats** |
| **1932** | Great Depression | net **→ Democrats** |
| **1972** | LBJ Great Society + Nixon Silent Majority | net **→ GOP** |
| **1996** | Gingrich's Contract w/ America | **last Southern Dem holdouts (the majority) → GOP** |
| **21st c.** | (2004/2008/2012/2016/2020) | "**net/gain about even** for both parties" |

Note the **BLUE/RED ↔ Democrat/Republican mapping is era-shifted** (the "Red
Party" of 1824 ≠ modern GOP; matches the existing party-evolution/era-rename
findings, digest `7d0dfeec`). vcczar: "**party flipping in almost every year**" —
so the year guide is the *peak* schedule, not the only switch points.

## What-if banter (low signal — POST 2)

@Patine asks a counterfactual: if Clay had won 1848 / taken Taylor's VP offer,
Webster had taken Whig leadership, and the Whigs hadn't lost 1852 so badly, would
the **Whig extinction + GOP rise still happen in 1856?** vcczar: **"Possibly so.
Neither Clay nor Taylor were really anti-slavery. GOP might have started sooner"**
(POST 2). No mechanic — corroborates only that the 1856 realignment is treated as
**robust/near-deterministic** in the design (Whig collapse happens regardless of
leadership counterfactuals), reinforcing the 1856-row calibration above.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-29)

**The historical-party-switch-DATE system is UNBUILT. The build has a
player-driven faction-CONVERSION phase (the spiritual mode-3) and a RANDOM
Loyal/Opportunist seed — but NO switch-date data, NO auto-historic mode, NO
`flippable` per-pol attribute, NO start-date historical-party assignment, NO
realignment calibration data.**

- **Code-grep: ZERO** for `flippable | switchDate | partySwitch | historicSwitch
  | partyHistory | switchYear` anywhere in `src/`, `scripts/`, `public/*.json`,
  `politicians-dataset.csv`. None of the switch-date data layer exists.
- `Politician` (types.ts:1251–1291) has `partyId: PartyId | null` (1265) and a
  `factionId` — but **no switch-date field, no `flippable` flag, no party
  history.** Its only loyalty/flip primitives are `loyalty: number` (1273, PR6,
  [0,1], used by Secession-Winter cabinet defection — NOT party switching) and
  `flipFlopperPenalty: number` (1284, a conversion cooldown stat).
- `ImportedDraftee` (the CSV dataset row, types.ts:1780–1793) carries
  `draftYear / state / ideology / skills / traits / expertise / loyalty?` —
  **no switch-date, no flippable, no historical-party column.** So even the
  authoring pipeline has no slot for this data (cross-ref the dataset-script
  pipeline, CLAUDE.md).
- **Shipped = the player-driven MODE-3 ANALOGUE: Phase `2.1.6 Faction
  Conversions`** (phases.ts:9, "Politicians may switch factions") — engine
  `resolveConversion` / `conversionOdds` / `passiveConversionChance`
  (phaseRunners.ts:953–1123) with **`crossParty` poaching** (953–990),
  sign-free-agent, and passive defection. This is the thread's **mode 3 (players
  actively convert pols)** — but it is **stochastic, present-state-driven, NOT
  historically-dated**, and there is **no scripted EVENT that grants a
  party-switch chance** (the thread's "events also grant switch chances" rides on
  the #221 scripted-event primitive, which is 0% built).
- **Closest "flippability" PROXY shipped — but it's RNG, not history:**
  `Loyal` / `Opportunist` traits (types.ts:114–116) seeded at **`loyal: 0.08`,
  `opportunist: 0.08`** (CONVERSION_ODDS.seed, types.ts:288), with `Loyal`
  dampening and `Opportunist` amplifying conversion odds (282–286). The **8% seed
  numerically echoes the thread's "~8–10% flippable"** — but it is a **random
  per-pol roll**, not the historical per-politician `flippable` + scheduled-date
  DATA the thread describes. No multi-flip (<1% / Trump) subset modeled.
- **NO auto-historic-switch MODE** — no scheduler that applies scheduled switches
  at term-years and deactivates player conversion. (Structural twin of
  relocation's also-unbuilt auto-move mode.)
- **NO start-date historical-party assignment** — scenario seed pols
  (`src/data/scenario1772.ts` / `scenario1856.ts`) are placed in a fixed
  `partyId`/faction; there is no "party as of this start date" resolution from a
  switch-date table.
- **NO realignment flip-year calibration data** — no per-year/per-era switch-rate
  or direction-of-flow table; the closest is the era-rename / party-evolution
  content (digests `7d0dfeec` / #40 / #78), which renames the two fixed
  coalitions but does **not** move pols between them on a realignment schedule.

**Net for tech-lead:** the build has a **stochastic player-driven cross-party
conversion phase (2.1.6)** + a **random 8% Loyal/Opportunist seed**. This thread
is the **DESIGN ORIGIN (Jun 2021) of (i) the historical-party-switch-DATE DATA
layer (term-year-anchored, per-pol), (ii) the per-pol `flippable` attribute +
multi-flip subset, (iii) the AUTO-HISTORIC switch MODE (auto-applies dated
switches, deactivates player attempts) + the start-date historical-party
assignment it enables, and (iv) the realignment flip-year CALIBRATION guide** —
none of which ship. It is the **party-switch SIBLING of the relocation system**
(`4e518e05`): identical auto/manual/event-mode shape, same author/week, same
historical-date-data dependency. The loyalty-vs-flippability **drafting axis** is
a scouting/draft-UI consideration that today is invisible (flippability is hidden
RNG).

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold.)*

- **CANDIDATE NEW GAP — Historical-party-switch-DATE DATA + auto-historic switch
  MODE + `flippable` per-pol attribute.** Structural twin of the relocation
  thread's candidate (`4e518e05`). Missing as DATA/behavior: (a) **per-pol
  switch DATE(s)**, term-year-anchored (POST 1); (b) a **`flippable` flag** +
  **multi-flip subset** (~8–10% flippable, <1% multi like Trump — POST 1); (c)
  **start-date historical-party assignment** (pol begins each start date in their
  party-as-of-that-date — POST 1); (d) the **AUTO-HISTORIC MODE** (auto-applies
  dated switches, deactivates player conversion — POST 1). Shipped `Politician`/
  `ImportedDraftee` have NO switch-date/`flippable` column; no auto-switch
  scheduler. **0% built.** Source: this digest, POST 1.
- **ENRICHES the faction-CONVERSION gap (phase 2.1.6 / CONVERSION_ODDS)** — this
  thread is the **design framing of player-driven party switching as ONE of two
  modes** (player-convert vs auto-historic), and reveals the **~8–10% flippable
  target population** that the shipped **random 8% Loyal/Opportunist seed**
  (CONVERSION_ODDS.seed, types.ts:288) currently approximates by RNG rather than
  historical data. Also surfaces the **loyalty-vs-flippability DRAFTING-strategy
  axis** (C+ loyal vs B- flippable — POST 1) as a scout/draft-UI requirement
  (flippability is invisible today). Source: this digest, POST 1.
- **ENRICHES / PRE-DATES the realignment/party-evolution gap (`7d0dfeec` / #40 /
  #78, era-specific BLUE/RED branch names)** — adds the **realignment flip-year
  CALIBRATION guide** (1796/1824/1856/1872/1896/1932/1972/1996 + ~even 21st c.,
  with per-era direction of flow — POST 1) as the macro schedule the per-pol
  switch dates aggregate to. Distinct lever: existing party-evolution RENAMES the
  two fixed coalitions; this **moves pols between them** on a dated schedule.
  Reinforces era-shifted BLUE/RED ↔ Dem/Rep mapping (1824 "Red Party" ≠ modern
  GOP). Source: this digest, POST 1.
- **CROSS-REF the relocation gap (`4e518e05` ENRICHES #38) — SIBLING FEATURE.**
  Party-switch and relocation are vcczar's **paired Jun-2021 "historical-date
  DATA + auto/manual/event MODE" systems** (he does relocation "next," POST 1).
  Same auto-vs-manual exclusivity, same historical-date-data dependency, same
  settings-toggle home (#263 realism umbrella). Last batch's roadmap had QW0 as a
  relocation-CAP fix; party-switch is the **sibling unbuilt data+mode layer** —
  flag the coupling so both are scoped together, not merged. Source: this digest,
  POST 1; cross-ref `4e518e05`.
- **CROSS-REF the scripted-event primitive (#221)** — the thread's "events also
  grant party-switch chances" (POST 1) is a **party-switch payload TYPE** for the
  #221 scripted-event system (alongside party-FORMATION events from `7d0dfeec`).
  #221 is 0% built, so this event-granted-switch path has no engine. Source: this
  digest, POST 1.

---

### Open questions (for the human / consolidation)

- **Auto-historic-switch OFFICEHOLDER conflict?** The relocation sibling has an
  explicit cancel-vs-resign guard (pol holds a game office not held IRL ⇒ cancel
  the scheduled move). The party-switch thread does **not** raise it — but the
  same hazard applies (auto-flipping a sitting officeholder mid-term). Needs a
  ruling before an auto-switch mode ships. (Inferred from `4e518e05`; not in this
  thread.)
- **`flippable` = boolean flag, or derivable from presence of switch-date(s)?**
  The thread implies both a flippable population (~8–10%) AND scheduled dates; is
  `flippable` a separate flag (for player-mode targeting / scout UI) or simply
  "has ≥1 switch date"? Unspecified.
- **Player-mode + dated data interaction:** in player-driven mode, do the
  historical switch dates do anything (e.g. raise that pol's defection odds near
  their historical date), or are they fully inert unless auto-mode is on? POST 1
  only says auto-mode applies them and player-mode uses conversion + events.
- **Multi-flip (<1% / Trump) modeling:** ordered list of dated switches per pol vs
  a single flip + a "can re-flip" flag? Trade-off unspecified.
- **Did the switch-date DATA land in a later build/thread?** vcczar reports the
  data "finished" in Jun 2021, but it is absent from the current dataset/types —
  look for a follow-up confirming whether it was ever wired in (the shipped
  conversion-only reality suggests the player MODE shipped and the dated-data /
  auto-MODE never did, mirroring relocation).
