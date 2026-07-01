# 53f0759d — "AMPU: Idealistic Legislation"

**Type:** CONTENT BRAINSTORM / bill-idea catalog (NOT a playthrough). A "wish-list
laws" prompt — players invent hypothetical / "idealistic" legislation, including
deliberately implausible ones.
**Scope:** 8 posts / 1 chunk (`chunk-001.md`), ~2.7 KB. Opened **Dec 14 2022**
(forum, topic `1782521761`) with a **2024 revival tail** (POST 8, "don't know if
this topic is still getting attention"). Participants: an opener (tier unclear;
poses the prompt), **@OrangeP47** (proposes bans; refines the sell-a-state idea),
**@EYates** (seeds sell-a-state), plus the McCarthy-era playtest note (POST 5).
No GM accept/reject ledger, no die-rolls — pure idea supply.

> **Why it matters:** a small **bill-idea catalog** that feeds the already-sequenced
> content-engine cluster — more Legis-Prop content for the #221 3-primitive system /
> #237 policy-genre framework / #248 subtype taxonomy, with two era-specific hooks
> (a real 1950s **McCarthy loyalty oath**, an Interstate-highway audit) that also
> corroborate the #206 era-band / future-modern content tail. The build ships only
> **8 generic `BILL_TEMPLATES`** and no era-keyed bill pool, so **none of these ship.**
> The one genuinely NOVEL item is OrangeP47's **"sell a state" fiscal↔territory
> lever** (maxed-spending → sell a state → one-off spending burst next turn) — a
> mechanic with no analogue in the current code (distinct from admission/annexation).

---

## ★ Proposed bills

| Bill (verbatim intent) | Effect intent | Era / band | Post |
|---|---|---|---|
| **Abolish the Stock Market / Make Stock Trading Illegal** | Abolish-a-whole-private-sector edge (LW-populist framing; opener flags it's not his own view) | modern/econ; abolish-sector primitive | 1 |
| **Ban Smoking (entirely, not just public)** | Nationwide vice ban; cites NZ generational tobacco ban as real precedent | modern/vice; "one of the more plausible" | 2 |
| **Sell a state (to sort out fiscal problems)** | ★ NOVEL fiscal↔territory lever — see below | any (economy↔territory) | 3, 6 |
| **Ban the importation of Anime** | Joke gov-sim-staple import ban | modern/culture-war (comedic) | 7 |
| **Audit & Trim Excess Interstate Highway Routes** | Cancel vestigial/on-hold highway projects; framed as costing political capital ("95% political suicide") | ~1956+ (Interstate era) / infrastructure | 8 |
| **McCarthy-era Loyalty Oath law** | Real 1950s loyalty-oath statute; noted **MISSING** from an active McCarthy-era playtest | 1950s (era-gated content hole) | 5 |

**Sell-a-state, refined (POST 3 → 6):** EYates seeds "being able to sell states to
sort out fiscal problems" (POST 3; opener/OrangeP47 asks him to disambiguate the
"really vague" idea, POST 4). OrangeP47 sharpens it into a concrete lever (POST 6):
*"Say you get maxed out on how much you can spend, in exchange for some more spending
as a one off next turn you can sell a state."* → a **spending-cap escape valve** that
**trades territory for a one-turn spending burst**. This couples two systems the build
keeps separate (there is no economy/spending model in `territories.ts`, and no
divest/cede path for an admitted state) and is the intersection — but not a duplicate —
of the **#42/#11 spending-cap cluster** and the **#178/#260 territory cluster**.

---

## Shipped-vs-designed (verified against `src/` this run)

- **Bill library = 8 generic `BILL_TEMPLATES`**, randomly drawn.
  `phaseRunners.ts:3420–3429`: Tariff ±, Homestead Act, Internal Improvements, Naval
  Expansion, Fugitive-Slave-Act Strengthening, Personal Liberty Law, Pacific Railroad
  Bill. `runPhase_2_6_1_Proposals` (3431+) picks one at random per faction (`chance(0.6)`,
  sponsor legislative ≥ 1). **None of the six brainstorm bills ship**; there is no
  era-keyed / genre-keyed bill catalog.
- **`Legislation` type has no genre/subtype/prereq field.** `types.ts:1506–1520`:
  only a 4-value `committee` (`Domestic|Foreign|Economic|Justice`), a 6-value `status`,
  a single `effects` blob (`EraEventResponseEffect`), and optional `votes`. No `subtype`
  (#248 designed-only), no `policyGenre`/state field (#237 designed-only), no prereq/
  condition field (#258 designed-only) — so a stock-market abolition, a vice ban, an
  era-gated loyalty oath, etc. have nowhere to live in the shipped type. Consistent with
  every sibling content drop (`welfare` 2cddc161, `665d7f33`).
- **"Sell a state" mechanic: 0% shipped.** Grepped `src/` for
  `sell|cede|divest|relinquish|dispose` — no state-sale / cede / divest path. Territory
  in the build is **admission-only** (`territories.ts admitState`, plus treaty/war
  organization per `fe15db25` — note NW-Indian-War *cedes* Ohio, but that's a loss
  penalty, not a player-elective fiscal sale). No economy/spending/budget/treasury model
  in `territories.ts` either — so both halves of OrangeP47's lever (a spending cap to be
  "maxed out" on, and a divest path) are absent.
- **Era-gated content (McCarthy loyalty oath = 1950s):** the build ships **1772 &
  1856 scenarios only** (`scenario1772.ts`, `scenario1856.ts`); there is no 1950s era, so
  the loyalty-oath hole POST 5 flags is a *future-band content hole*, not a bug in a
  shipped era. (The `loyalty` field in `src/` is the unrelated PR6 Secession-Winter
  cabinet-defection scalar `types.ts:1273`, not a McCarthy oath.) Corroborates #206.

---

## Delta list — map to EXISTING gap IDs (do NOT assign new numbers)

*(Consolidation owns the gap-log edit. This is the hand-off. NEW items labelled for
consolidation to ID.)*

- **#221 (3-primitive content system / Legis-Prop pool)** — CORROBORATE + light SUPPLY.
  Six bill ideas = more Legis-Prop content for the 0%-shipped catalog. Stock-market
  abolition = an **abolish-whole-private-sector** primitive instance (cf. `welfare`
  "Abolish Private Property"); smoking/anime bans = vice/import-ban instances. Still
  **0% shipped** (build has 8 generic templates only). Source: POSTs 1, 2, 7, 8.
- **#237 (policy-genre framework)** — CORROBORATE. Ideas cluster into existing genres
  (economy/finance, vice/health, culture-war/imports, infrastructure) — no genre these
  can't map to. Source: POSTs 1, 2, 7, 8.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE (no new subtype forced). All
  six map to existing subtypes; the **highway-audit** (infrastructure *de*-funding / cancel
  vestigial projects, framed as costing political capital) is the least-covered flavor —
  flag for taxonomy review but it does not clearly demand a new subtype. Source: POST 8.
- **#206 (Era-of-Future / era-band content, doubly-unbuilt)** — CORROBORATE (era-gated
  content hole). ★ POST 5: a **McCarthy-era loyalty-oath law is MISSING from an active
  1950s playtest** — direct datapoint that era-specific real content (1950s) is
  under-authored AND has no shipped era slot (build = 1772/1856 only). The
  Interstate-highway audit (~1956+) is another era-keyed (mid-20th-c) content instance.
  Source: POSTs 5, 8.
- **#42 / #11 (spending-bill caps / restrictions)** — TOUCHES. OrangeP47's sell-a-state
  lever presupposes a **spending cap you can be "maxed out" on** (POST 6) — the same
  spending-cap concept #42/#11 track — but adds an *escape valve* rather than a restriction.
  Source: POST 6.
- **#178 / #260 (treaty→territory / expansion & territory)** — TOUCHES. Sell-a-state is a
  territory-count-reducing lever, adjacent to these but is a **player-elective fiscal
  divestment**, distinct from admission/annexation/treaty-organization or a war-loss cede.
  Source: POSTs 3, 6.
- **★ NEW candidate — "sell a state" fiscal↔territory lever** — **NEW (consolidation to
  ID).** A genuinely novel mechanic with no code analogue: *maxed-out spending → sell a
  state → one-off extra spending burst next turn* (POST 6). It **couples the economy
  (spending-cap) and territory systems**, which the build keeps entirely separate (no
  economy model in `territories.ts`; no divest path). Recommend consolidation either mint
  **one** small gap for it or attach it as a note under the economy↔territory cluster
  (#42/#11 × #178/#260). Be conservative — this is the **only** NEW-mechanic candidate in
  the thread; the other five items are content examples, not mechanics. Source: POSTs 3, 6.

---

## Open questions (carry forward)

- Was the **McCarthy loyalty-oath law** ever authored into the forum-game content after
  POST 5 flagged its absence, or does the 1950s era-band remain under-content'd? (No
  answer in-thread; the React build has no 1950s era at all.)
- Does **"sell a state"** warrant its own gap row, or fold into the economy↔territory
  cluster? It needs BOTH a shipped spending/economy model (absent) and a state-divest path
  (absent) before it could exist — i.e. it's blocked on two prerequisites the build lacks.
- Are the comedic entries (**Ban Anime**, and the opener's disclaimed stock-market example)
  intended as shippable content or purely a brainstorm warm-up? (No GM ruling in-thread.)

---

### Provenance notes
- Single chunk; all 8 posts read. No tier-1 GM adjudication, no die-rolls, no accept/reject
  ledger — pure idea-supply brainstorm (Dec 2022) with a 2024 revival post (POST 8).
  Authoritative signal is thin; treat all six bills as *candidate content*, not confirmed rules.
- Codebase verified at `src/` HEAD 2026-07-01: `BILL_TEMPLATES` (`phaseRunners.ts:3420–3429`,
  8 generic bills, random draw in `runPhase_2_6_1_Proposals` 3431+); `Legislation`
  (`types.ts:1506–1520`, 4-value `committee`, single `effects`, no subtype/genre/prereq);
  no `sell`/`cede`/`divest` state mechanic and no spending/economy model in
  `territories.ts` (grepped); scenarios = 1772 & 1856 only.
- Cross-refs: `2cddc161` (welfare — abolish-sector / #221-#237-#248-#206), `665d7f33`
  (future Legis-Props — #221/#206/#248), `fe15db25` (territory via treaty/war; NW-Indian-War
  Ohio cede as a *loss* penalty), `64f60bbd` / `bf590684` (#42/#11 spending-cap cluster).
