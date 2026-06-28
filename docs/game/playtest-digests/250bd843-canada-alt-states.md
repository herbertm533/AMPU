# Digest — 250bd843 "Canada Alt-States"

**Source:** `docs/game/sources/250bd843-canada-alt-states/` (1 chunk, 34 posts)
**Type:** Worldbuilding / data thread (not a playthrough log). Two-person working
session: **@Arkansas Progressive** (AP, authored the alt-state biases + EV
events) and **@OrangeP47** (the census/EV data expert, delegated authority to
canonize the Canada map). Dated 5/29–6/12/2024.
**Scope:** How to represent **Canada as admittable AMPU states** after an
emergent 1856-scenario playtest left the US holding Canada — territory the game
was never set up for.

---

## Triggering event (the emergent state)

- In **matthewyoung123's 1856-scenario run**, **Buchanan escalated the Pig War
  into a war to conquer Canada; the US won it in the 1858 half-term and now holds
  Canada** (POST 1). This is a far-from-historical, *emergent* playthrough state
  produced by in-game decisions, not an authored scenario branch.
- Canada had **never come up in a playtest before** (POSTs 26, 33: "we've never
  had Canada before", "only one playtest getting canada"), so neither the data
  nor the politician roster existed for it. This is fundamentally an
  **expansion/territory** problem: the player annexed un-modeled territory and
  the GMs had to retrofit the states to keep the game running.
- A second acquisition path is noted: they "still have a chance to buy it … in
  1840" in another line (POST 34) — i.e. Canada can also be acquired
  non-militarily, so this is a recurring need, not a one-off.

## The data problem (heart of the thread)

1. **No authored Canadian state-biases exist.** AP built biases off the
   **census** sheet (POSTs 4, 11, 12). The canonical author **V never wrote
   alt-state biases for Canada** and said he'd do them **"when we need them"**
   (POST 22). So when Canada was conquered, the leans had to be derived ad hoc.
2. **The census / EV data is messy and mismatched.** OrangeP47 (the census
   expert) repeatedly flags that the data AP is using isn't the public/canon
   census copy and that EVs ≠ biases:
   - "Not according to the Census" (POST 10) re: which provinces are real states.
   - "that's not my or the public copy of the census sheet" (POST 16) — they
     were editing different/forked copies (resolved POST 20: same doc).
   - The shared doc "has EVs yea but **not state biases**" (POST 21).
   - The **EV tallies are canon** because AP "wrote the events after confirming
     with V" (POST 22) — so EVs are trustworthy, **biases are the gap**.
   - "real states are on the **notes** tab" (POST 17) — the actual province list
     lives in an appendix tab, not the main sheet (POST 19: "Appendix moment").

## State-granularity dispute → resolution

- Disagreement over whether Canada is "~five states" (POST 7) or one-state-per-
  province (POST 9). AP had historically had to **collapse real provinces (e.g.
  Nunavut) into a single legacy AMPU state called "Central Canada"** (POST 8).
- **OrangeP47's ruling (canon):** "Central Canada is a **legacy that we pretend
  doesn't exist**. Alberta, Manitoba, etc. are the real things you should use."
  (POST 15). He has been **delegated authority and can canonize the map**
  (POST 24).
- **Final agreed map:**
  - **Every Canadian province is its own state, EXCEPT PEI** (POSTs 9, 27).
  - **Northern Canada = NWT + Yukon + Nunavut, grouped into one state**
    (POST 27), and **treated as a tossup** (POSTs 29, 13 — northern Canada
    "doesn't fit anywhere" under the larger-state bias heuristic).
  - Abbreviation fix logged: **Manitoba = MB, not MT** (POSTs 24, 6 noted "wrong
    letters"). [Build uses `MAN` — see deltas.]

## Method they settled on: "translate," don't author from scratch

- AP's established practice: use the existing main-tab bias info as **"guidance"**
  that gets **"translated"** to new states when the in-game states don't map
  1:1 to V's listed regions (POST 30). The info "isn't wrong per se, it just
  needs to be translated."
- Same method already used for: **Mexico → DU/BS** (Durango/Baja Sonora) leans,
  which exist and **vary by region**; the **Philippines**; and **LC/UC**
  (Lower/Upper Canada) — but the **LC/UC guidance V gave verbally was never
  written down** (POST 30). This is an undocumented-tribal-knowledge risk.
- OrangeP47 agrees: "we don't need to create from scratch. We can take what V
  wrote down as guidance, just **port it over to the additional states**"
  (POSTs 31, 33). Northern Canada is the acknowledged exception that needs a
  bespoke (tossup) call (POST 31).
- Disposition: **"handled as it comes"** (POST 33) — accepted as an incremental,
  manual GM process, not a systematized data deliverable.

## Politician gap

- **POST 2 (explicit):** "there is a **severe lack of politicians for Canada in
  this era**, so we may have to create some if they are made into states." AP
  also floats "ripscan through Canadian history and apply biases like that"
  (POST 26) as a fallback for deriving leans. Confirmed in build: the curated
  draft fallback has **zero** Canada-region entries (grep of
  `defaultDraftClasses.ts`).

## Nature of the work

This is entirely **manual GM + Google Sheets worldbuilding** (census tab, notes
tab, a Flourish bias map — POST 4 "AMPU Canada State Biases | Flourish"). None of
it touches shipped engine code; it is the *designed-intent* layer that the build
would need to absorb if Canada becomes playable.

---

## Deltas vs current build

Verified against `src/data/expansionStates.ts`, `src/engine/territories.ts`,
`src/data/defaultDraftClasses.ts`.

- **Emergent conquest of un-modeled territory (general gap):** the game can reach
  states (US holds Canada via the Pig War, or a 1840 purchase) that have **no
  authored data**. The build has no mechanism to acquire territory by war/event
  and no "fill in the missing data" path — purely manual GM retrofit today.
- **Canada-as-states partially modeled, with placeholder data:**
  `expansionStates.ts` already registers Canadian provinces as `region: 'Canada'`
  annexable seeds — **Alberta(ALB), Manitoba(MAN), New Brunswick(NBR),
  Newfoundland(NFL), Northern Canada(NCN), Nova Scotia(NSC), Ontario(ONT),
  Quebec(QBC), Saskatchewan(SAS), Vancouver(VAN), PEI(PEI)** — i.e. the thread's
  per-province map (incl. grouped Northern Canada, PEI present) **is already the
  shipped shape**. BUT every seed carries placeholder **`electoralVotes: 4`,
  `bias: 0`**, generic industries, `isSlaveState: false`. So: **structure exists,
  real data does not.**
- **Missing/placeholder state biases:** the thread's canon biases ("translated"
  from V's guidance; Northern Canada tossup) are **not in the build** — every
  Canadian seed is `bias: 0` (neutral). Requirement: import the per-province
  leans; encode Northern Canada as tossup.
- **Wrong/placeholder EV data:** canon EV tallies exist in the GMs' events sheet
  (POST 22), but the build hardcodes **EV = 4 for all** expansion states.
  Requirement: replace with the canon per-province EVs (the trustworthy half of
  the census doc). `admitState` (`territories.ts`) just copies the seed — no
  census/EV computation at all.
- **Abbreviation mismatch:** thread canon **Manitoba = MB**; build uses **MAN**.
  Minor, but a canon-vs-build delta (likewise verify other provincial abbrs vs
  the canon map).
- **"Central Canada" correctly absent:** the legacy grouped state the GMs
  "pretend doesn't exist" (POST 15) is **not** in `expansionStates.ts` — build
  already matches canon here. No action needed.
- **Missing Canadian politicians (draft-dataset gap):** POST 2 — severe lack of
  era-appropriate (1850s) Canadian figures. Build confirms **zero** Canada-region
  draftees in the curated fallback. If Canada becomes playable, the
  `scripts/` dataset pipeline needs Canadian additions (these would be `ERA_FIGURES`/
  curated, additive-only, likely sub-floor electoral stats per dataset rules).
- **Undocumented bias guidance (process risk):** V's alt-state bias guidance —
  for Canada and for already-admitted LC/UC, Mexico, Philippines — is **verbal
  / tribal knowledge, never written down** (POSTs 22, 30). Any faithful build of
  expansion-state biases depends on data that currently lives only in GMs' heads
  and Sheets.

## Code areas to touch (for consolidation/tech passes)

- `src/data/expansionStates.ts` — replace placeholder EV/bias/industries for the
  Canadian (and other) seeds with canon data.
- `src/engine/territories.ts` (`admitState`) — currently a straight seed-copy;
  the locus for any census/EV-driven admission logic.
- Census/EV/state-bias source data — needs to be captured as authored data
  (the GMs' Sheets/Flourish, not in-repo today).
- Draft dataset pipeline (`scripts/seedDataset.mjs` → `ERA_FIGURES`/`CURATED_ROWS`,
  `scripts/legislatorsToDataset.mjs`) — add era-appropriate Canadian politicians.

## Cross-references

- **`f64a522c` (Kagan thread, same batch):** contains a **Canada census-fix
  sub-thread** — directly relevant to the "bad/mismatched census & EV data"
  delta above; reconcile the two when both digests land.

## Open questions (for the human)

- Where do the canon per-province Canadian EVs and biases live, and can they be
  exported into the repo as authored data?
- Is there an acquisition mechanic (war/purchase) intended in the build, or does
  territory only enter via the Territories page / God Mode / era graph today?
- Should the build adopt the thread's abbreviations (MB, etc.) over the current
  ones (MAN), and is there a canon abbr list for all provinces?
