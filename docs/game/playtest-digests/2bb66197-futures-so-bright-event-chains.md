# Digest — `futures-so-bright` (2bb66197): "Futures so bright I gotta wear shades"

> **Batch 57.** 3 posts / 1 chunk (read in full). An **Era-of-the-Future SPEED-RUN** by GM
> **@MrPotatoTed**, explicitly **vcczar-requested** ("As @vcczar asked us to do in the chat",
> POST 1), that **skips most phases and rules** to do exactly one thing: **fire the future-era
> EVENT CHAINS** and see what comes out. Covers **2024 → 2032** (Noem 2024 → re-elected 2028 →
> Yang 2032). The value is **two-fold**: (1) a large **future-era content sample** (climate /
> tech / culture / building-renaming flavor events) for the **doubly-unbuilt** post-`modern` band,
> and (2) **★ two explicit no-prereq complaints from the GM** — events firing nonsensically because
> **the predicate-gated-availability pattern is not applied to this content**. This is concrete,
> author-voiced evidence for the predicate/prereq-gating gap.

## Era framing — the post-`modern` "Era of the Future" (doubly-unbuilt band)

Set **2024–2032**, i.e. *past* the modern band entirely. Presidential spine: **Kristi Noem (R, SD
Gov) becomes first female President 2024** w/ VP Rob Portman (POST 1) → **re-elected 2028** over
Sestak-Bayh (POST 1/3) → **Andrew Yang (Yang-Gang) wins 2032** over Trump Jr-Graham (POST 3). The
GM treats this as a named **"Era of the Future"** sitting beyond `modern`. The build's `Era` enum
has **no `future` value** and there is **no future scenario** (see table) — so this is the
*doubly-unbuilt* case: not just a missing scenario, but a missing era band **and** the content to
fill it. Polarity here is modern left/right (Red = Republicans / Blue = Democrats), unambiguous.

## ★★ The headline signal — events firing with NO PREREQ (predicate-gating evidence)

The GM flags **two** events by name as needing prereqs they don't have. These are not balance
nitpicks — they are the exact symptom of **availability not being predicate-gated**:

| Event (verbatim) | GM complaint | What it proves |
|---|---|---|
| **"Half the animals that existed in 2020 are extinct"** | *"Note to @vcczar This needs some kind of prereq, this is the **second test** where half the animals on Earth are dropping dead in two years. Haha"* (POST 1) | An ecological-collapse event with **no precondition** fires **repeatedly / too early** (twice across two test runs). Needs a gate (e.g. `meterAtMost{planet}` + `yearAtLeast`, or `eventCompleted` chain) so it can only fire once conditions warrant. |
| **"Apply Bill of Rights and Voting Suffrage to Citizens in Space"** | *"(there technically aren't any citizens in Space, but **there's no prereqs** so I guess we're being proactive here)"* (POST 3) | A consequence event fires before its **enabling state exists** (no "citizens in space" predicate ever became true). Needs a prereq (`eventCompleted`/`flag`) on the upstream "citizens in space" node before this can be offered. |

**Build reality — the machinery exists but is NOT applied here.** The serializable `Predicate`
tree (`types.ts:1487-1504`) and its interpreter `evalPredicate` (`engine/eraGraph.ts:12`) are real
and shipped, and the **graph nodes carry an optional `precondition`** (`eraEvents1772.ts:25`,
`GraphNode.precondition`; selection gates on it at `eraGraph.ts:114`). **BUT predicate-gating is
deployed in the 1772 era graph ONLY** — `eraEvents1856.ts`, `data/anytimeEvents.ts`, and
`data/anytimeNationalEvents.ts` contain **zero** `precondition`/`Predicate` usage (grep `-c`).
Future-era content (which doesn't exist in the build at all) would, like 1856/anytime, fire
**year/weight-gated at best, ungated at worst**. The GM is hand-running content that has **no
precondition layer authored** — exactly the missing predicate-gated-availability problem. This
thread is the strongest author-voiced datapoint that **predicate gating must be a content
authoring requirement, not just an available primitive**.

## Future-era content sample (by theme — NOT transcribed in full)

A flood of future-era events/options across 2024–2032 (POSTs 1, 3). Sampled by theme:

- **Climate / ecological disasters** — devastating hurricane (PR), major oil spills (×2, one drops
  Earth's-health −1), Montana/Idaho/Washington droughts & wildfires, **rising sea levels make Gulf
  Coast then West Coast cities uninhabitable** (→ Great-Recession economic crash; → Domestic
  Stability to lowest level / open rebellion), "half the animals extinct" (see ★ above).
- **Tech / AI / cyber** — **Robot Controversy** (AI job-loss / end-of-civilization fears → Quality
  of Life to 3), cyber attacks (×2), rising cyber crime, **ban crypto/digital currencies** (+1
  Econ), **mandate self-driving cars / ban human-driven cars**, **Universal Federal ID mandate**,
  **mandate microchipping & barcoding citizens**, microchips in pets to let them speak, regulate /
  mandate data encryption, **climate-control technology becomes available**.
- **Culture / society** — **non-religious becomes the largest "religion" demographic**, **legalize
  euthanasia nationwide**, **National Daycare System**, **remove religious symbolism from federal
  buildings**, **Direct Democracy in the post-internet world** (+1 Honest Govt), **social-media-baron
  proposes social-media-as-governments** (pick-your-own-government), **Bill of Rights / suffrage for
  citizens in space** (see ★ above), citizens-in-space framing generally.
- **Building-renaming FLAVOR-EVENT class** (its own distinct content family) — rename/name the
  **White House, the Pentagon ("Cool Math Building"), Treasury Building, SCOTUS building, Veterans
  Affairs building, Dept of Energy building, Dept of Transportation building, Capital Reflecting
  Pool** — after Conservative justices/generals/presidents, etc. A whole **partisan-flavored
  building-renaming generator** (≈10 instances in 3 posts) with cosmetic intent.

## ★ Meter set exercised (which national meters the future events move)

Events move the **national meters** + party preference. Mapping verbatim labels → shipped
`NationalMeters` (`types.ts:1399-1407`, 7 fields: `revenue, economic, military, domestic, honest,
quality, planet`):

| Thread label | Shipped meter | Sample movement (POST) |
|---|---|---|
| **Quality of Life** | `quality` | "falls to (4)"; Robot Controversy "falls to 3" (POST 1, 3) |
| **Domestic Stability** | `domestic` | "-1 (4)"; "falls by 2 (2, threats of rebellion)"; "lowest level, open rebellion" (POST 1, 3) |
| **Economic Stability** | `economic` | "drops to a Great Recession"; ban-crypto "+1 into a recession" (POST 1) |
| **Honest Government** | `honest` | Direct Democracy "+1" (POST 1) |
| **Earth's health** | `planet` | oil spill "Earth's health drops by 1" (POST 3) |
| **Party Preference** | `game.partyPreference` (NOT a meter) | Race Riots + National Guard → "Party Preference +1 Red" (POST 3) |

**All named meters are already modeled** — incl. **Earth's-health = `planet`** (no new meter
needed). `partyPreference` is a top-level `GameState` field (`types.ts:1570`), correctly separate
from the meter bundle. So the future-era *content* is missing, but the *meter substrate it targets*
is present and complete.

## Build vs. design — code-verified (SHIPPED vs DESIGN, with file:line)

| Area | In the build today | In the future-era design (thread) | Delta | Source |
|---|---|---|---|---|
| **Era band** | `Era = 'independence'\|'federalism'\|'nationalism'\|'modern'` — 4 values, no `future` (`types.ts:1337`) | A named **"Era of the Future"** beyond modern (2024+) | No future era value | POST 1 |
| **Future scenario** | Only `scenario1772.ts` + `scenario1856.ts` (`ls src/data/scenario*.ts`); no future data file (grep `future` in `src/data/` → only `expansionStates.ts`) | A bootable Era-of-the-Future scenario (2024 start) | No future scenario/content | POST 1, 3 |
| **Future-era events** | No future event data; era graphs are 1772 (`eraEvents1772.ts`) + 1856 (`eraEvents1856.ts`); no climate/AI/space content | ~40 distinct future events across climate/tech/culture/renaming | Entire future content corpus unbuilt (#206 / #221) | POST 1, 3 |
| **Predicate / prereq gating** | `Predicate` tree (`types.ts:1487`) + `evalPredicate` (`eraGraph.ts:12`) + `GraphNode.precondition` (`eraEvents1772.ts:25`) exist, gated at `eraGraph.ts:114` — **but used in the 1772 graph ONLY**; `eraEvents1856.ts` + both anytime pools have **0** `precondition` (grep `-c`) | Every event needs a prereq so it can't fire nonsensically / repeatedly (half-animals, citizens-in-space) | **Gating primitive exists; not applied beyond 1772 → must become a content authoring requirement** (#258) | POST 1, 3 |
| **National meters** | 7 meters incl. `planet` (`types.ts:1399-1407`); `partyPreference` separate (`types.ts:1570`); events move meters via `EraEventResponseEffect.meters` (`types.ts:1448-1457`) | Quality / Domestic / Economic / Honest / **Earth's-health** / Party Pref all moved | **No new meter needed** — all present incl. Earth's-health=`planet` | POST 1, 3 |
| **Building-renaming flavor content** | No building-renaming events anywhere (grep `rename`/`Pentagon` in `src/data` → none) | A whole partisan building-renaming flavor-event generator (~10 instances) | New cosmetic flavor-event class (flavor budget, #261) | POST 1, 3 |

## Candidate gaps/bugs for consolidation (each: attaches-to-# vs NEW)

- **Corroborates #206 (Era-of-the-Future DOUBLY-unbuilt)** — no `future` `Era` value
  (`types.ts:1337`), no future scenario, no future content. This run *is* the future era, played
  entirely by hand. POST 1, 3.
- **Corroborates #221 (era-event/content ENGINE)** — ~40 future events sampled (climate/tech/
  culture); none exist in the build's two era graphs. Pure content-corpus demand. POST 1, 3.
- **★ Corroborates #258 (predicate/prereq-gated AVAILABILITY) — sharpest evidence** — GM names
  **two** events firing with no prereq ("half the animals extinct," *second* time; "citizens in
  space" with no enabling state). The `Predicate`/`evalPredicate`/`precondition` machinery is built
  (`types.ts:1487`, `eraGraph.ts:12/114`, `eraEvents1772.ts:25`) **but applied only in the 1772
  graph** — 1856 + both anytime pools have 0 preconditions. Delta = **extend predicate gating to
  all event content (esp. future) and treat it as an authoring requirement.** POST 1, 3.
- **Corroborates the METER SYSTEM (no new gap)** — the future events exercise Quality/Domestic/
  Economic/Honest/**Earth's-health(`planet`)**/Party-Preference, **all already modeled**
  (`types.ts:1399-1407, 1570`). Notably **Earth's-health is NOT a missing meter** — it's `planet`.
  POST 1, 3.
- **NEW — building-renaming FLAVOR-EVENT class** — a partisan building/landmark-renaming generator
  (White House, Pentagon, Treasury, SCOTUS, VA, DoE, DoT, Reflecting Pool; ~10 in 3 posts) with no
  build representation (grep `rename`/`Pentagon` in `src/data` → none). Attaches to **#261 (flavor
  budget)** as a concrete cosmetic content family; could be one templated event with a target list.
  POST 1, 3.

## Open questions (for consolidation)

- **Is "Earth's-health" exactly `planet`?** Mapping is near-certain (it's the only ecological meter
  and oil-spill/extinction events target it), but the digest assumes label↔`planet` equivalence.
- **Should the half-animals/space events be hard prereqs or just probabilistic dampening?** GM says
  "needs *some kind of* prereq" — could be a `Predicate` gate (preferred, machinery exists) or a
  weight/cooldown. The repeat-firing ("second test") suggests a missing once-only/`eventCompleted`
  guard, not just a year gate.
- **Building-renaming: one parametrized event or many?** ~10 near-identical instances argue for a
  single template + target/party list rather than authoring each by hand.

## Source

`futures-so-bright` (2bb66197) "Futures so bright I gotta wear shades" — 3 posts / 1 chunk, read in
full. **Era-of-the-Future speed-run**, GM **@MrPotatoTed**, **vcczar-requested**, phases skipped to
**test event chains** (POST 1). Covers **2024–2032** (Noem→Yang). Future-era content sample +
**meter set** (`quality/domestic/economic/honest/planet` + partyPreference) + **★ two explicit
no-prereq complaints** (half-animals-extinct, citizens-in-space). Cited `POST n`
(`===== POST n =====` markers), 1 chunk.
