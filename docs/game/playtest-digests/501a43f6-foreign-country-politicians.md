# Digest — 501a43f6 · Foreign-country politicians (annex Canada → do real foreign pols appear?)

- **Slug:** `501a43f6-will-politicians-from-other-countries-be-in-the-game`
- **Source:** `501a43f6-Will_politicians_from_other_countries_be_in_the_game.csv` (1 chunk / **5 posts**, ~1.6k chars)
- **Era/years:** era-agnostic (annexation of ahistorical/foreign territory can happen in any scenario)
- **Type:** **designer Q&A** (theFreezerFlame, Apr 25 2023) on **annexation → alt-state politician CONTENT**: how many real foreign politicians exist vs. how many are procedurally generated, and the notability bar / delivery timing.
- **Batch:** b59 (digest-only; consolidation owns the gap log)

> **Why it matters:** the game already ships a **registry of foreign nations as annexable "states"** (Canada provinces, Latin America, Caribbean, etc. in `expansionStates.ts`), but has **no politicians for any of them** — and no rule for how to populate them. This thread is the designer's canonical answer to *"who staffs an annexed foreign country?"*: a **tiny hand-authored real roster (<3 per country, many zero) + a majority of procedurally-generated token pols (~20 per nation)**, delivered **only after early release**. It pins the intended content model for the annexation feature the map data already anticipates, and surfaces a naming collision: the forum's **"alt state pols"** (pols belonging to an annexed nation) is a **different concept** from the shipped `altState` **carpetbagger-relocation** field.

---

## ★ Foreign-politician content rules (the numbers)

Designer answers, in order (POSTs 1-5):

1. **A very small handful of REAL foreign politicians exist.** "**Less than 3 real-life politicians per country** … **some have zero.**" (POST 3) Example floated: **maybe Trudeau** appears "if you've conquered Canada." Laurier (the OP's example) is **not** confirmed. (POSTs 1, 3)
2. **The MAJORITY of alt-state pols are RANDOMLY GENERATED.** "There will be … notable alternate country politicians in the game, but the **majority of alt state pols will be generated.**" (POST 2) "They'll be **randomly generated instead.**" (POST 3)
3. **~20 token politicians per annexable nation.** "I created only **about 20 token politicians for most ahistorical nations that can be annexed**, and **fewer if the nation is less likely to be annexed.**" (POST 5)
4. **Annexation likelihood scales the roster depth.** "The chance of annexing ahistorical territory is **slim**, although **Canada is more likely than, say, Brazil.**" → Canada gets more content than lower-probability nations. (POST 5)
5. **Notability is the inclusion bar for a real foreign pol** (POST 4 asks "what is the standard to define 'notability'?"). The designer does **not** give a crisp threshold — he answers with the ~20-token authoring approach and defers the rest (POST 5). Open: no explicit notability metric (unlike the US-pol "0-9%-of-winning US-Rep/Sen/Gov" bar recorded under #120/dbomit).
6. **Delivery is POST-early-release.** "I'll add more **on demand, but only after early release is released.**" (POST 5) — roadmap framing, an explicitly **deferred** authoring backlog, not a shipped feature.

**Distilled content model per annexable foreign nation:** `0-2 real hand-authored pols (notability-gated) + ~20 generated token pols`, scaled down for low-annexation-probability nations, with real-pol depth expanded **on demand after early release**.

---

## ★ Annexation & alt-state-generation model (how it's meant to work)

- **Annexation is the trigger** that makes a foreign nation's politicians eligible ("if you've conquered Canada"). The designer frames it as **conquest/annexation of an ahistorical/foreign nation**, distinct from historical US westward territory admission — but mechanically both funnel into "the nation becomes a state and its pols become draftable."
- **The nation must be annexed before its pols exist in play** — matches the shipped registry comment: *"A draftee whose home state is one of these will only enter the draft once that state has been admitted"* (`expansionStates.ts:3-7`). The generation is **on-annexation**, lazy.
- **"Alt state pols"** here = the pols **belonging to an annexed alternate/foreign nation** (Quebec pols, Argentine pols). ⚠️ This is **NOT** the shipped `altState` field, which is a pol's **secondary home state for CARPETBAGGER RELOCATION** (`types.ts:1256`, seeded in `runPhase_2_1_4_Relocations` `phaseRunners.ts:626-641`). Same words, two meanings — flag on consolidation to avoid conflating the annexation-content gap with the relocation mechanic (#38/#55).

---

## Shipped-vs-designed

Code-verified against the current build:

- **Foreign nations ARE annexable data.** `expansionStates.ts` lists foreign provinces/nations as annexable states — Canada (Alberta, Quebec, Ontario, Manitoba, Nova Scotia, … PEI), Latin America (Argentina, Amazonia, Bolivia, Bogota, Belize, Baja Sonora, …), Caribbean (Antilles, Bahamas), Atlantic (Bermuda) via `region: 'Canada' | 'Caribbean' | 'Latin America' | 'Pacific' | 'Atlantic'` (also on `Politician.region`, `types.ts:1322`). Registry-only until admitted (`admissionYear: 0`).
- **Flat, non-foreign-aware EV.** Every expansion state hardcodes `electoralVotes: 4` (`expansionStates.ts:178`) — no size/likelihood differentiation (the b58 note). Canada-vs-Brazil "annexation likelihood" is **not** modeled in the state data.
- **`admitState` is add-only and identical for all territories** (`territories.ts:8-23`): checks not-already-present, copies the seed, stamps `admissionYear`, pushes onto `snap.states`, logs. **No distinction between US-territory admission and foreign-country annexation.** No conquest/war-driven admission wiring; no organized/unorganized status (that half is #33). The only UI path is the Territories page ("Admitting one adds it to the Union as a full state," `TerritoriesPage.tsx:26`) + God Mode + a future era event.
- **NO conquest/annexation keyword machinery.** `grep annex|conquer` in `src/`: "annex" appears only as prose (`TerritoriesPage.tsx`, `expansionStates.ts` comments); "conquer"/"Trudeau"/"Laurier" appear **nowhere** in `src/`. "Canada" appears only as the region enum + the 1856 Trent-Affair flavor text (`eraEvents1856.ts:186`).
- **ZERO real foreign politicians in the bundled dataset.** `public/standard-draft-classes.json`: **0** name matches for Trudeau/Laurier/Macdonald; **0** pols with a foreign home-state (quebec/ontario/argentina/…). `defaultDraftClasses.ts`: 0. The dataset is US-only (built from `unitedstates/congress-legislators` + MEDSL US candidates per CLAUDE.md). **Trudeau does not exist in the build.**
- **NO token/generated foreign-pol pool.** No "~20 tokens per nation" data or generator exists. The only procedural generator is the flat uniform 20-rookie stub with **15 hardcoded NATIONAL (US) first/last names** (`runPhase_2_1_1_Draft`, `phaseRunners.ts:177-238` → gap #290) — it is **not** region/nation-aware, so it cannot produce nation-appropriate Quebecois/Argentine names even if a foreign state were admitted.
- **No notability rule, no post-release backlog surface.** No code artifact for foreign-pol inclusion criteria or the deferred authoring queue.

**Net: the annexable-nation MAP DATA ships; the annexation-as-conquest MECHANIC and the entire foreign-pol CONTENT MODEL (real + token + generated) are 0% built.**

---

## Delta list

Map to EXISTING gap IDs where possible; label genuinely-new items **NEW (consolidation to assign ID)**. Consolidation owns the gap log — no IDs assigned here.

| Delta | Maps to | Notes |
|---|---|---|
| **Foreign-nation annexation as a distinct CONQUEST path** (vs. historical US-territory admission) — designer frames "conquer/annex Canada" as the trigger; build has only add-only `admitState`, no war/conquest wiring | **UNDER-CAPTURED / likely NEW** — cross-ref **#33** (era-event territory grant), **#55/#269** (state-map roster/fission). Existing alt-state gaps (#38 carpetbagger, #55 53-state US roster incl. DC/Cuba/PR, #269 US state-fission) cover **US** expansion; **none covers foreign-country annexation as conquest**. b56 #325 (California UC/LC) was a US split, NOT foreign annexation. **Flag the foreign/conquest dimension as distinct.** |
| **Foreign-pol CONTENT MODEL: 0-2 real hand-authored pols per country (notability-gated, many zero) + ~20 token pols per nation, random-gen majority, depth scaled by annexation likelihood** | **NEW (consolidation to assign ID)** — a foreign-pol AUTHORING/content requirement. **#295** covers era-aware pool SIZING + "counts modulated by alt-states" but is about US draft-pool COUNTS, not foreign-pol CONTENT; **#120/dbomit** covers the US-pol inclusion bar, not a foreign one. This is a new content-authoring track (a foreign-`CURATED_ROWS`/token-table equivalent). |
| **Generated token/alt-state pols must be NATION-AWARE** (Quebecois/Argentine names, not US) | **#290** (procedural generator revamp) — the "Noah's Ark" region×party lattice would need to extend to **foreign regions** (`Canada`/`Caribbean`/`Latin America`/…) with per-nation name/ethnicity pools. Current stub is US-national-names only. Attach the foreign-nation extension to #290. |
| **Naming collision: forum "alt state pols" (annexed-nation pols) ≠ shipped `altState` carpetbagger-relocation field (`types.ts:1256`)** | **clarification on #38/#55** — do NOT conflate the annexation-content gap with the relocation mechanic. Note for consolidation to disambiguate the term. |
| **Annexation-likelihood tiering** (Canada > Brazil) drives BOTH real-pol depth and token count; build's flat `electoralVotes: 4` encodes no likelihood/size signal | **NEW dimension, attach to the foreign-annexation content gap** — needs a per-nation "annexation likelihood / roster depth" attribute on the expansion registry. |
| **Delivery is explicitly POST-early-release, on-demand** | roadmap framing (like #41's "after early release" items) — **defer**; low priority pre-release. Record as designer-stated sequencing, not a build task now. |

### Open questions (for the human / consolidation)
- **Notability threshold for real foreign pols** is unspecified (POST 4 asked, POST 5 dodged). Is there a foreign analogue to the US "0-9%-of-winning office" bar (#120)? — unresolved.
- Is foreign annexation intended to run through the **same `admitState`/Territories path** (add-as-full-state) or a **separate conquest/war-outcome flow** (cross-ref the war system #45/#56, DH-12 white-peace)? The thread implies conquest ("if you've conquered Canada") but the build only has peaceful admission. — unresolved.
- Do annexed-nation pols get **sub-floor electoral stats** (like failed-candidate/era-figure tokens per the CLAUDE.md dataset rule), or full stats? Not stated. — unresolved.
