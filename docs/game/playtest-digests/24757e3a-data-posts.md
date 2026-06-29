# Digest — "Data Posts" (thread 24757e3a)

- **Source:** `docs/game/sources/24757e3a-data-posts/` (1 chunk, 95 posts, ~40k chars)
- **Title / nature:** "Data Posts" — a reference thread of data dumps (Flourish.studio
  visualizations + tables) posted mostly by **Arkansas Progressive** (the data/maps
  guru), with **data-accuracy discussion** from Zagnut, MrPotatoTed, ebrk85,
  OrangeP47, vcczar, et al. Spans **Sep 2024 → Aug 2025**.
- **Scope:** This thread is the canonical home of the design's **state×industry-
  eligibility data model** (which industries a state may develop), the
  **draft-pool-by-era** reference, the **alt-states / conquered-territory maps**
  (Mexico, Brazil, South America, Philippines, state splits), the **war→land-change
  treaty maps**, and the **era-evo → industry/lobby unlock** schedules. Most of the
  actual images (Flourish embeds, map PNGs) are **not in the text export** — only
  the captions, corrections, and discussion survive. Treat this digest as the index
  to that data + the bug log against it.
- Era framing per `docs/game/historical-context.md` (no historian ran this batch).

---

## ★ PRIMARY ARTIFACT 1 — Per-state FORBIDDEN-INDUSTRY matrix (POST 1-5)

POST 1 links a Flourish viz titled **"forbidden industries for American states."**
Encoding: **`0.1` = Yes (allowed), `1` = No (forbidden)** — i.e. it is a per-state
× per-industry **eligibility matrix**: for every state, which industries it is
**barred from ever building**. Industries enumerated as having a forbidden-map:

- **Finance**
- **Maritime**
- **High Tech** (POST 1: "No map as it's only banned on PR")
- **Natural Gas**
- **Plantation**
- **Mining**

(The era-unlock list in POST 93 adds **Manufacturing, Agriculture, Alt Energy** as the
other industries — so the full industry taxonomy is ~9: Finance, Maritime, High Tech,
Natural Gas, Plantation, Mining, Manufacturing, Agriculture, Alt Energy.)

### Data-accuracy bug flags raised against the matrix (the heart of this artifact)

| # | State | Forbidden in data | Objection raised | Resolution / status |
|---|-------|-------------------|------------------|---------------------|
| POST 1→2 | **Puerto Rico (PR)** | originally shown forbidding **Maritime** | — | **CORRECTION (POST 2):** PR forbids **High Tech, Finance, Mining** — **NOT Maritime**. PR is the only state with a High-Tech ban. |
| POST 3 | **Vermont (VT)** | Maritime forbidden | Zagnut: should be **allowed** — Lake Champlain connects to the Atlantic via the St. Lawrence Seaway **and** the Hudson River | flagged, unresolved (V's call) |
| POST 3 | **VT + New Hampshire (NH, "Granite State")** | Mining forbidden | Zagnut: "No mining in the Granite State or VT? LOL." Granite State obviously has mining | flagged, unresolved |
| POST 3, 5 | (whole matrix) | — | "**Where does this data come from?**" | **Provenance unknown.** Arkansas Progressive (POST 5): "Not sure where V decided to base this off of." → matrix is **vcczar's hand-authored data, source undocumented** |
| POST 4, 5 | **North Carolina (NC)** | **Finance forbidden** | MrPotatoTed: stands out as wrong — **Charlotte = "second largest banking sector in the country," behind only NYC**; if Alaska can be a finance titan, NC should take a level or two | **NC instead gets Alt Energy + High Tech** (POST 5), but "**no Finance is off**" — flagged for fix |

**Takeaway:** A per-state industry-eligibility matrix is **canonical design data**
(every state has a list of industries it can never build), but it is (a) hand-authored
by vcczar with **no documented sourcing**, and (b) carries **at least four known
accuracy bugs** (VT-Maritime, VT/NH-Mining, NC-Finance) that were flagged but **not
confirmed fixed in-thread**. These are concrete data-correction tasks.

### Companion: which industries exist & when they unlock per region (POST 93)

POST 93 ("State Industries by Era Evos") gives the **time/region availability** layer
that sits on top of the forbidden matrix — an industry is buildable only after its
era-evo fires, in the listed regions, **except where the matrix forbids it**:

- **Manufacturing** — staged regional rollout: New England (1790, "Manufacturing
  Appears") → Mid-Atlantic (1790, "Spreads") → Midwest + Great Plains (1828) →
  all other regions (1866, "Spreads III").
- **Finance** — "available everywhere except where forbidden" (no era gate).
- **Agriculture** — everywhere except where forbidden.
- **Plantation** — everywhere except forbidden; **abolished as an industry in 1865**
  (or when "Slavery is Abolished" / "South Industrializes" fires) — **converts to
  Agriculture at a 2:1 ratio, rounding down**.
- **Maritime** — everywhere except forbidden.
- **Mining** — everywhere except forbidden.
- **Alt Energy** — appears everywhere (except forbidden) in **1972**.
- **High Tech** — staged: West Coast + NY + MA (1880) → Mid-Atlantic, New England, IL
  (1885) → Great Plains, Midwest, TX, FL (1960) → everywhere else (2009).
- **Natural Gas** — OK + TX (1901, "req. Spindletop Texas") → elsewhere not forbidden (1951).

This is a **three-axis model**: (industry) × (state forbidden-list) × (era-evo
regional unlock + year). A state may build industry X iff X is not on its forbidden
list AND X's era-evo has fired for that state's region by the current year.

---

## ★ PRIMARY ARTIFACT 2 — Draftable-pols-by-era reference (POST 6-15)

A set of Flourish charts on the **draft pool's size and composition**:

- **POST 6 "Draftable Pols by Era"** — per-era count of all draftable politicians.
  - POST 7 caveat: "Does include all politicians, though the **actual draft count may
    be lower or higher depending on the Constitution and alt states**." (i.e. the
    chosen Constitution and which alt-states exist change who actually drafts.)
  - POST 8-9: eras vary in length — "eras are anywhere from **12 to 20 years long**" —
    so per-era totals are not directly comparable.
- **POST 10 "Average Draft per term per Era"** — total draftees ÷ number of 4-year
  draft periods per era. **Independence era is an outlier** (the **Inaugural Draft**
  plus the 1776 and 1784 drafts all fall in one era).
- **POST 11 "Draft by Party, by term"** — partisan composition of each draft term.
- **POST 12-13 totals:** ≈**3,900 Republicans** + ≈**3,600 Democrats**; **grand total
  7,670 politicians from 1772 to 2048.** (Eyeballed estimates confirmed by the author.)
- POST 15: using the **politician generator** for the 2012 draft is endorsed (fills
  out the modern pool procedurally).

**Takeaway:** The designed draft pool is **~7,670 named historical/quasi-historical
politicians across 1772-2048**, with **era-aware pool sizes** and a roughly even
R/D split. Actual per-draft counts are modulated by Constitution + alt-states.

---

## Other data dumps in the thread (index of dimensions covered)

These are mostly map images (not in the text export); captured for traceability of
*what reference data exists* and any rulings attached.

- **POST 16-32 — Mexican states / alt-state maps.** Mexico subdivided into game
  states (Yucatán, Toluca/Old Mexico, Durango, Baja, Sonora, Nayarit…). Rulings:
  Durango should get the coastal state because the "Baja+Sonora+Durango" acquisition
  event requires them to touch (POST 24); a "canon" map is being reconciled across
  Discord/1840-thread versions (POST 23-25).
- **POST 17-22 — EV / census handling for non-owned land (important ruling).**
  Q (MrPotatoTed): should population/EV-change events for not-yet-owned land (e.g.
  Mexican areas in the Era of Terror) fire anyway? **Ruling (OrangeP47, census guru,
  POST 21-22):** census/EV-change events were authored to apply **only after
  statehood**, per vcczar's explicit instruction. **Default EV = 3 for all states**
  on admission unless special rules apply; **EVs are not tracked for non-states**
  (POST 19). A separate **census chart** sets EVs-on-admission by decade in lieu of
  the normal change mechanic (POST 22). 20th-C Mexican-American War can grant
  TX/AZ/NM/UT/CO/OK/CA/NV (if Mexico holds them) or annex all of Mexico via "Treaty D"
  (POST 19).
- **POST 29-32 — State-split maps:** Texas divisions, California split (POST 30: the
  historically-grounded "straight line" CA split, with the wrinkle that vcczar added
  Fresno to SoCal — POST 31), Texas-with-original-borders. All follow **county lines**.
- **POST 33-37 — Brazil state-split map.**
- **POST 38-67 — Wars and their land changes (treaty maps).** A large catalogue of
  war scenarios, each with map(s) of territory transferred. Wars enumerated:
  Mexican-American (19th & 20th C), American Civil War, Spanish-American, WWII Pacific
  & Eastern theatres, US-Soviet Korean War, Indian Sovereignty War, Naval War with
  Spain, US-Germany Naval War, War for Louisiana (fallback if LA Purchase fails by
  1800), War for Florida (Spanish/British/French variants), 2nd Napoleonic War,
  French-US Mexican War, "War to Unify the English-Speaking Peoples" (flagged "nutty"),
  Jacksonian Civil War (aka "Civil War I, Phantom Menace"), 20th-C War with CSA
  (requires Amb to CSA + Pres), War for the Philippines, Early Cold War Invasion of
  Russia, Federalist Era Civil War, Northern Civil War, and "War for (X)" covering
  ~13 South American / Caribbean groupings (POST 66). **Treaty A/B accuracy debate**
  (POST 68-70): Mexican-American War "Treaty B" map called nonsensical; consensus to
  **flip it** so Mexico keeps contiguous TX/AZ/NM and cedes CA/NV/UT/CO — final call
  pending; Treaty B should include TX + OK.
- **POST 55-60 — Ambassadorship design ruling.** The game deliberately does **not**
  name most ambassadors. The **only** ambassadorships that exist are to break-away/
  alt nations: **Western America** (rare "Burr Conspiracy"), **Northern Confederacy**
  (rare "Hartford Convention"), and the **Confederacy** (only if you white-peace or
  lose the Civil War — which "we never do"). No ambassador to an independent TX
  (POST 56). NOTE: this is "nation" ambassadorships; see POST 95 for the separate
  **Minister-to-X foreign post** list, which is a different, real system.
- **POST 71 / 90-92 — Era-evo → interest/lobby activation schedule.** Each lobby/
  interest group is "born" by a specific era-evo: Lexington & Concord →
  Military-Industrial + Big Agriculture; Constitutional Convention → Globalists +
  Isolationists + Free-Trade + Protectionism; Manufacturing Appears → Big
  Corporations; Buttonwood Agreement → Wall Street; National Gazette/Phila. Aurora →
  LW + RW Media; B&O Railroad → Transportation; Common School Movement → Public +
  Private Education; Oil in Titusville → Big Oil & Gas; Labor Movement → Labor Unions;
  Conservation Movement → Environmentalists; Einstein/Relativity → Science;
  UK Govt Welfare → Welfare; Ford Assembly Line → Technology; Wall St Crash/Great
  Depression → Public Housing; United Nations → Human Rights.
  **CONFLICT FLAGGED (POST 90-92):** this schedule contradicts the **Historical Eras
  file**, which sets a *minimum number of cards per era* and dictates e.g. **Human
  Rights exists >100 years before the UN** (and gains/loses points from slavery laws,
  civil war, etc.). vcczar/MrPotatoTed: in 1788-1790 events already call for Human
  Rights. **GMs are currently IGNORING these era-evo activation gates** — "those card
  points don't matter and are null" (POST 92). Open contradiction in the data.
- **POST 72-80 — Louisiana Purchase event timing + the "events shouldn't be locked to
  one era" debate.** LA Purchase variants: historical purchase (active 1788-1800,
  Federalism, 50% chance), France-regains-Louisiana (1800), ahistorical
  Spanish/French-Louisiana-vulnerable (1820-1840, Democracy, requires war, 10%),
  buy-from-Spain (1800-1820, Republicanism). Consensus proposal: **purchase window
  1788-1820, conquest window 1820-1856.** Broader design ruling: **most events are
  over-restricted to a single era** and should span multiple eras (or at least bleed
  one era past); **some "growth/expansion" events should be guaranteed to fire (100%)
  in their era**, and ahistorical expansion events should fire once-then-retire
  (POST 78-80). It's "OK to have conflicting events run concurrently" — the first to
  fire makes the others obsolete via their requirements (POST 73).
- **POST 81 — "States by era they enter at the earliest"** chart. Note: **DC enters
  in The Nuclear Age.**
- **POST 82-89 — South America state-splits map + WWII-border accuracy fixes** (Peru
  cut in two by the big Amazon province; redistribute Lima/Trujillo/Chiclayo to
  northern states per Ecuadorian-Peruvian War borders). vcczar (POST 88): didn't want
  to "create 500+ new states" for ahistorical lands with ~2% acquisition odds, so
  alt-nations use **present-day subnational borders as a compromise**, not 19th-C ones.
- **POST 94-95 — Foreign "Minister-to-X" creation schedule** (distinct from the
  alt-nation ambassadorships above): Minister to **France** (Legis, 1778), **Spain**
  (Legis, 1779), **UK** (Legis, 1785), **Prussia** (ExecAction, 1787), **Russia**
  (ExecAction, 1808), **China** (ExecAction, 1844), **Japan** (ExecAction, 1872).
  Each is unlocked either as a Legislative item or an Executive Action in that year.

---

## Shipped reality — what the codebase actually does (verified)

Checked `src/types.ts`, `src/data/states1856.ts`, `src/data/states1772.ts`,
`src/data/expansionStates.ts`, `src/engine/phaseRunners.ts`, `src/pages/StatesPage.tsx`.

- **`State.industries` is `Record<string, number>`** (`types.ts:1328`) — a free-form
  map of *industry-name → level*. There is **no eligibility/forbidden field** on
  `State`, and no forbidden-industry data structure anywhere in `src/`. Industry
  development is **unconstrained by any matrix**.
- Industries are **seeded ad-hoc per state** with names that **do not match the design
  taxonomy**: `states1856.ts` uses `manufacturing, finance, fishing, lumber,
  agriculture, coal, shipping, tobacco, cotton, sugar, cattle, mining` (not the
  canonical Finance/Maritime/High-Tech/Natural-Gas/Plantation/Mining/Alt-Energy set).
  No `plantation`, `maritime`, `high tech`, `natural gas`, or `alt energy` industry
  exists in the shipped data. (Notably **NC ships with `{ agriculture:4, tobacco:3 }`
  and no finance at all** — coincidentally matching the buggy design, but for no
  modeled reason.)
- **The only mechanic that changes industries** is the PR7 **lobby → industry +1
  nudge** (`phaseRunners.ts:1631-1654`): for each state, lobby cards held by factions
  with a resident member bump *already-present* industry keys by +1 (clamp ≤5, one
  bump per key per year). It can **only raise existing industries — it cannot add a
  new industry to a state, and there is no per-state eligibility check** (the only
  guard is `if (!(key in s.industries)) continue`). `LOBBY_INDUSTRY` map keys are
  `tobacco, agriculture, cotton, manufacturing, coal` — again the ad-hoc taxonomy.
- **No era-evo industry rollout exists.** Nothing implements "Manufacturing Appears
  (1790)", "High Tech Appears (1880)", the Plantation→Agriculture 2:1 conversion at
  abolition, etc. Industries are static except for the lobby nudge.
- **No industry-development player action / UI.** `StatesPage.tsx` only *displays*
  industries (`Object.entries(s.industries)…`); there is no build/develop control.
- **Draft pool sizing is NOT era-aware.** The procedural generator uses
  `draftSize = factions.length * 2` (~20 rookies; `phaseRunners.ts:184`) regardless
  of era. The dataset-driven path (`STANDARD_DRAFT_CLASSES`, the ~18.5k generated
  pool) drafts whoever has `draftYear === current year` whose home state is in the
  Union — there is no per-era target count, no Constitution/alt-state modulation of
  pool size, and no R/D-balance target.
- **Alt-states framework partly exists but is hollow.** `expansionStates.ts` already
  registers Mexican/Latin-American/Pacific states (Veracruz, Micronesia, etc.) as
  admit-able seeds — but **every** expansion state is seeded identically:
  `electoralVotes: 4`, `bias: 0`, `industries: { agriculture: 2, trade: 1 }`,
  `admissionYear: 0`. So: no per-state real EVs (design says default **3**, with a
  census chart setting EVs-on-admission by decade), no per-state industries, no
  forbidden-industry data, no state-split data. The maps/EV reference in this thread
  is exactly the data that would populate this registry.

---

## Deltas vs current build

Headline: **the design has a per-state industry-eligibility matrix (with known
accuracy bugs to fix) + a draft-pool-by-era reference; the build has neither — its
industry model is a free-form, unconstrained, ad-hoc-taxonomy `Record<string,number>`
that only the lobby nudge ever touches.**

1. **Per-state forbidden-industry matrix is unbuilt.** Design: every state has a list
   of industries it can never build (Finance/Maritime/High-Tech/Natural-Gas/
   Plantation/Mining + Manufacturing/Agriculture/Alt-Energy). Build: no eligibility
   field on `State`, no enforcement. **Requirement:** add a per-state forbidden/
   eligible-industry data field + enforce it on any future industry-development path.
   *(POST 1-5, 93)*
2. **Industry taxonomy mismatch.** Design's 9 canonical industries vs. the build's
   ad-hoc 12-ish names (`fishing, lumber, coal, shipping, sugar, cattle, tobacco,
   cotton…`). **Requirement:** reconcile to the canonical taxonomy (or map old→new).
   *(POST 93 vs `states1856.ts`)*
3. **Data-accuracy bugs in the matrix to fix once it's built:** VT should allow
   **Maritime**; VT + NH should allow **Mining**; **NC should allow Finance**
   (Charlotte). Matrix provenance is undocumented — needs a sourcing pass / vcczar
   sign-off. *(POST 2-5)*
4. **Era-evo industry rollout + Plantation abolition unbuilt.** No staged regional
   unlocks (Manufacturing 1790…1866, High-Tech 1880…2009, Alt-Energy 1972, Natural-Gas
   1901/1951) and no Plantation→Agriculture **2:1 conversion at 1865/abolition**.
   **Requirement:** an era-evo-driven industry-availability + conversion system.
   *(POST 93)*
5. **Draft pool is not era-aware.** Design: ~**7,670** named pols 1772-2048, era-sized
   pools (eras 12-20 yrs), ~even R/D, Independence era inflated by the Inaugural Draft,
   counts modulated by Constitution + alt-states. Build: flat `factions.length*2`
   generator or raw `draftYear`-match from the dataset. **Requirement:** era-aware
   draft-pool sizing/reporting; surface per-era counts. *(POST 6-15)*
6. **Alt-states EV/data is placeholder.** Expansion states all seed EV=4 / identical
   industries / `admissionYear:0`. Design: default **EV=3**, a **census chart** for
   EVs-on-admission by decade, per-state industries + forbidden-lists, and state-split
   geometry (TX/CA/Mexico/Brazil/South-America, county-line splits). **Requirement:**
   populate the expansion registry from this thread's maps/census data; fix EV default
   3 vs shipped 4. *(POST 17-22, 29-37, 81-89)*
7. **Census/EV events for non-owned land — ruling to encode.** EV-change/population
   events must fire **only after statehood**; non-states aren't EV-tracked. Confirm the
   shipped event guard matches (this thread is the authoritative ruling). *(POST 17-22)*
8. **Era-evo → lobby/interest activation conflicts with the Historical Eras card-minimum
   file and is currently ignored by GMs.** Human Rights (and others) must exist long
   before their era-evo (Human Rights >100 yrs before the UN). **Open contradiction**;
   needs design reconciliation before either is built. *(POST 71, 90-92)*
9. **Event-era over-restriction (design-wide).** Events are locked to single eras;
   design wants multi-era windows, some **guaranteed (100%) era-opening fires**, and
   once-then-retire ahistorical expansion events. LA-Purchase concrete proposal:
   purchase 1788-1820, conquest 1820-1856. *(POST 72-80)*
10. **Foreign Minister-to-X + alt-nation ambassadorship unlock schedule** is design
    reference for the appointments system: Ministers to France(1778)/Spain(1779)/
    UK(1785)/Prussia(1787)/Russia(1808)/China(1844)/Japan(1872); ambassadorships only
    to Western America / Northern Confederacy / Confederacy. *(POST 55-60, 94-95)*

## Open questions (for the human / cross-batch)

- **Provenance of the forbidden-industry matrix** is unknown even to the design team
  ("not sure where V decided to base this off of"). Is the matrix to be kept,
  re-sourced, or replaced? (POST 3-5)
- Many of the load-bearing artifacts (forbidden-industry Flourish, draft-by-era charts,
  all war/treaty/state-split maps, the census chart) are **images not in the text
  export** — the numbers above are only the captions/discussion. Raw matrices/EVs would
  need the images or the underlying spreadsheets.
- Mexican-American War **Treaty B** geometry was unresolved in-thread (flip proposal,
  add TX+OK) — confirm final canon. (POST 68-70)
- Is the era-evo lobby-activation schedule (POST 71) being **deprecated** in favor of
  the Historical Eras card-minimum file, or reconciled? GMs ignore it today. (POST 90-92)
