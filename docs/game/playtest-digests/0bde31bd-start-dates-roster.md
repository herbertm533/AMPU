# Digest — "Start dates" (the AUTHORITATIVE start-dates roster)

- **Slug:** `0bde31bd-start-dates`
- **Source CSV:** `0bde31bd-Start_dates.csv` (1 chunk, 4 posts, ~1.65k chars).
- **Date stamp in-thread:** Oct 8, 2022.
- **Type:** **Authoritative designer roster / Q&A** — NOT a playthrough. The
  game's **creator** ("I'm the creator", POST 4) answers a pre-order buyer
  (@Chuckstar) asking what the **start-date options** will be. POST 2 is the
  16-entry canonical list; POST 4 is the era-beginnings-vs-per-term design
  decision + the Reconstruction/1865 request.
- **Participants:** Chuckstar (buyer, asks the Q — POST 1/3), the creator
  (a.k.a. Vcczar, the designer — POST 2/4).
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** This is the **canonical, designer-stated list of
> scenario start dates** — the ground-truth roster for the entire
> **scenario-boot / start-anywhere cluster**. Every AMPU scenario is meant to
> begin at one of these 16 windows, and *"they begin each era"* (POST 2) — so
> this list IS the game's era-boundary table. It is the date-list backbone for
> gap **#92** (eras-as-content-bands / start-anywhere) and pins the DESIGNED
> target for **#115/#186/#228** (scenario-boot pipeline / post-1772 start-phase
> entry), **#206** (era-band gating), and the **future-era** gap (b57 — the
> 2020/2024/2048 entries). The shipped build boots only **2 of these 16**.
> **Status: designer-stated, explicitly NOT finalized** ("the start dates could
> change", POST 2) — authoritative but soft.

---

## ★ The 16-entry start-dates roster (POST 2)

Each start window "begins an era" and is anchored to an incoming president.
The **"Era of Nationalism"** is named explicitly (POST 4) as the era Lincoln's
presidency falls under, beginning with the **1856-1858** cycle.

| # | Start window | Anchor president | Era (as named / implied) |
|---|---|---|---|
| 1 | **1772-1774** | — (election term; pre-founding) | Independence / founding |
| 2 | **1788-1790** | Washington | Federalism (founding gov't) |
| 3 | **1800-1802** | Jefferson | (Jeffersonian) |
| 4 | **1820-1822** | Monroe | (Era of Good Feelings) |
| 5 | **1840-1842** | WH Harrison | (Jacksonian/Whig) |
| 6 | **1856-1858** | Buchanan | **Era of Nationalism** (POST 4) |
| 7 | **1868-1870** | Grant | (Reconstruction/Gilded Age) |
| 8 | **1896-1898** | McKinley | (Progressive/imperial) |
| 9 | **1916-1918** | Wilson | (WWI/Progressive) |
| 10 | **1928-1930** | Hoover | (Depression) |
| 11 | **1948-1950** | Truman | (Cold War) |
| 12 | **1972-1974** | Nixon | (modern) |
| 13 | **2000-2002** | GW Bush | (modern) |
| 14 | **2012-2014** | Obama | (modern) |
| 15 | **2020-2022 OR 2024-2026** | (unstated — Trump/Biden) | **future** (post-present) |
| 16 | **2048-2050 (possibility)** | (unstated) | **future** (speculative) |

Notes: entry 1 has **no president** (pre-constitutional "election term"). Entry
15 is a **fork** (2020-2022 *or* 2024-2026, not both). Entry 16 is flagged a
**"possibility"** — softest of all. Buyer notes the roster is **not finalized**
(POST 1 "finalized yet?"); creator confirms **"the start dates could change"**
(POST 2).

## ★ Design decision — era-beginnings vs. per-presidential-term (POST 4)

> Creator: "I tried to push the developer to do a start date at the **beginning
> of every presidential term**. However, he argued in favor of **when every Era
> begins**. … I'm hoping that the start dates are so easy to create that I can
> go back to my **original plan**."

- **Two competing start-date philosophies:**
  - **Creator's original plan** = a start date at **every presidential term**
    (many dozens of scenarios).
  - **Developer's (shipped) direction** = start dates only at **era
    beginnings** (the 16-entry roster above).
- The developer **won**; the 16-date era-beginnings roster is the current
  design. But the creator wants to **restore per-term starts IF start dates are
  cheap to author** — i.e. the roster is a floor, not a ceiling. This is a live
  **fork** for the roadmap: the scenario-boot pipeline should be built so start
  dates are cheap enough that per-term becomes viable.

## ★ Player request — 1865 / "Lincoln lives" Reconstruction start (POST 3/4)

> Chuckstar (POST 3): "Any chance for an **1865 and/or Lincoln lives** start
> date? I'd love to see if I could actually do **reconstruction**."
> Creator (POST 4): "**Lincoln's presidency covers the Era of Nationalism, which
> begins with the 1856-1858 cycle.**"

- **Ruling:** an 1865 start is **NOT** planned — Lincoln/Reconstruction is
  folded into the **1856-1858** era-beginning start (you reach Reconstruction by
  *playing forward* from 1856, not by booting at 1865). This is a direct
  consequence of the era-beginnings decision: mid-era start dates (1865) don't
  exist because starts are era-anchored.
- A **"Lincoln lives"** alt-history divergence is a distinct, unaddressed ask
  (counterfactual branch, not just a start year). No commitment either way.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-07-01)

**Only 2 of the 16 roster start-dates ship, and the code has no concept of the
other 14 or of the era boundaries this roster defines.**

- **★ Shipped scenarios = 1772 & 1856 ONLY (2/16).** `NewGameScreen.tsx:8`
  hardcodes exactly two `SCENARIOS` (`{id:'1772', year:1772}`, `{id:'1856',
  year:1856}`); **1856 is the DEFAULT** (`useState<ScenarioId>('1856')`,
  `NewGameScreen.tsx:25`). `ScenarioId = '1772' | '1856'` (`:6`). The other
  **14 roster windows (1788, 1800, 1820, 1840, 1868, 1896, 1916, 1928, 1948,
  1972, 2000, 2012, 2020/2024, 2048) are 0% shipped** — no scenario file, no
  boot path, no UI option.
- **★ Era enum has 4 values, ends at `modern`, NO `future`.**
  `Era = 'independence' | 'federalism' | 'nationalism' | 'modern'`
  (`types.ts:1337`). Mapping the 16 roster entries onto this enum:
  - `independence` → entry 1 (1772). **Only value with a shipped scenario at its start.**
  - `federalism` → entries 2-4ish (1788/1800/1820) — *no scenario boots here.*
  - `nationalism` → entries 5-7ish (1840/1856/1868); **1856 ships**, others don't.
  - `modern` → entries ~8-14 (1896…2012) collapse into a single coarse `modern`.
  - `future` → **entries 15-16 (2020/2024, 2048) have NO era value** — the enum
    literally cannot represent them (the b57 future-era gap). The roster's
    2020-2048 span *requires* a new `future` band (or bands).
  → the enum is far coarser than the 16 boundaries: it has **4 bands for 16
  designed era-starts**, and the post-2012 span is unrepresentable.
- **★ NO year→era boundary table that knows the 16 starts.** The only year→era
  logic in `src/` is a **single local helper** `eraForYear(year)` in
  `AnytimeEventsPage.tsx:20-25`: `<1789 independence / <1830 federalism / <1933
  nationalism / else modern`. Four coarse bands, ends at `modern`, **no `future`
  band**, and its cut-years (1789/1830/1933) do NOT match the roster's 16 era
  boundaries. `currentEra` is otherwise a **hardcoded literal** per scenario
  (`scenario1772.ts:97 currentEra:'independence'`, `scenario1856.ts:177
  currentEra:'nationalism'`) — the engine never *computes* era from year and has
  no table of the 16 boundaries. `phases.ts` reads `game.currentEra`
  (`:81`) but never derives it.
- **★ Scenario-boot = hardcoded literal `GameState` with fixed
  `startYear`/`phaseId`.** Each scenario builds one bespoke literal:
  `scenario1856.ts:150-153` (`year:1856, startYear:1856, phaseIndex:0,
  phaseId:'2.1.2'` — starts *past* the draft, "rookie crop already included"),
  `scenario1772.ts:70-73` (`year:1772, startYear:1772, phaseId:'2.1.1'` — starts
  *at* the inaugural draft). There is **no generic start-at-year-N boot path**;
  each of the other 14 roster dates would need its own hand-authored literal +
  the correct start-phase entry. This is the DESIGNED target of the scenario-boot
  cluster (#115/#186/#228): the roster is *what* it must be able to boot.
- **1789 hardcoded elsewhere.** Cabinet sizing (`types.ts:1197 if(year<1789)
  return []`) and labels (`labels.ts:106-107 scenarioId==='1772' && year<1789`)
  hardcode the 1788/1789 boundary ad-hoc, not from a roster/era table —
  reinforcing that era boundaries are scattered magic-numbers, not a single
  source of truth the roster could drive.

**Net for tech-lead:** the game ships **2 of 16** designer-canonical start
windows (1772, 1856), has a **4-value Era enum that stops at `modern`** with
**no `future` band** for the 2020/2024/2048 entries, and has **no era-boundary
table** — just one coarse `eraForYear` in a page component plus per-scenario
hardcoded `currentEra` literals. Booting any of the other 14 dates today means
hand-authoring a bespoke `GameState` literal with the right `startYear`/`phaseId`
per scenario. This roster is the canonical spec the scenario-boot / start-anywhere
work builds toward.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned. Consolidation decides map-vs-NEW. Conservative: this
SHARPENS #92 with the canonical 16-date roster rather than minting new IDs.)*

- **HEADLINE → #92 (eras-as-content-bands / start-anywhere) — canonical date
  list.** This thread supplies the **authoritative 16-window roster** (1772 …
  2048, each anchored to a president, each beginning an era). #92 previously
  lacked a definitive date list; this IS it. SHIPPED = 2/16 boot (1772, 1856).
  Sharpens #92; no new ID.
- **→ #115 / #186 / #228 (scenario-boot pipeline / post-1772 start-phase
  entry).** The roster is the DESIGNED set of start years the boot pipeline must
  produce. Shipped boot = hardcoded literal `GameState` per scenario
  (`scenario1856.ts:150-153`, `scenario1772.ts:70-73`); no generic
  start-at-year-N path; 14/16 dates have no boot. Maps to existing.
- **→ #206 (era-band gating).** The roster defines the era boundaries that
  gating should key off. Shipped era logic = 4-value enum (`types.ts:1337`) +
  one coarse `eraForYear` (`AnytimeEventsPage.tsx:20-25`) whose cut-years don't
  match the roster; no boundary table. Maps to existing.
- **→ future-era gap (b57) — the 2020/2024/2048 entries.** Roster entries 15
  (2020-2022 OR 2024-2026) and 16 (2048-2050) fall **past** the enum's `modern`
  terminus — `Era` has NO `future` value (`types.ts:1337`), and `eraForYear`
  has no post-`modern` band. Confirms/pins the b57 future-era requirement with
  concrete dates. Maps to existing.
- **NOTABLE FORK — per-presidential-term vs. era-beginnings start dates (POST
  4).** Developer shipped era-beginnings (16 dates); creator's original plan =
  per-term (many more), which he'd restore "if start dates are so easy to
  create." A live scenario-boot design fork — flag for roadmap: cheap scenario
  authoring unlocks per-term. Relates to #92/#115. Likely NOT a new ID (fold as
  a note on #92).
- **NOTABLE RULING — no 1865 start; Reconstruction is reached by playing
  forward from 1856 (POST 4).** Direct consequence of era-beginnings: mid-era
  starts (1865) don't exist. "Lincoln lives" alt-history is a separate,
  uncommitted ask (counterfactual branch, not a start year). Fold under #92 as a
  ruling; the alt-history branch is possibly NEW but uncommitted — flag, don't
  mint.
- **Provenance note:** roster is **designer-stated but explicitly NOT finalized**
  ("the start dates could change", POST 2; "finalized yet?" POST 1). Authoritative
  for target-setting, soft on exact windows.
