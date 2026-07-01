# Digest — "Should Polk run for a 3rd term?" (1840 playtest)

- **Slug:** `478ab80e-should-polk-run-for-a-3rd-term`
- **Source:** `docs/game/sources/478ab80e-should-polk-run-for-a-3rd-term/chunk-001.md` (7 posts, ~1.9k chars)
- **Era / years:** 1840 antebellum playtest, referencing 1852/1856/1858/1860. Posted Nov 2022.
- **Type:** emergent-narrative poll / mechanics snapshot (GM-driven poll of players)
- **Batch:** b60
- **Code-verified against:** `src/` HEAD

> **Why it matters:** POST 1 is a single dense paragraph that names ~seven interacting mechanics at once — a live snapshot of how the shipped election/relationship/event/mortality systems compose in play. It corroborates several shipped systems (enthusiasm-by-ideology, partyPreference, kingmaker relationships, Frail/Unlikable traits, war) and surfaces two *designed-not-built* items (a "3rd-term" trait, POST 3; a president's-party midterm penalty implied by "historical losses in the midterms of 1858"). It also exposes a scoping gap: an event ("put down John Brown's rebellion") is described as costing **−1 in New England specifically**, but the shipped event-effect struct is national-only. POST 6 is a GM self-correction that pins down a real rule: a kingmaker relationship **breaks once the protégé becomes president**.

---

## ★ Mandate ("won 1852 and 1856 without a mandate either time")

POST 1 states Polk won two presidential elections "but didn't have a mandate either time" — implying a **mandate / no-mandate state** attached to a presidential win (a governing modifier earned by margin or turnout).

**Code-verify:** grep `-i mandate` across `src/` → **0 matches**. No mandate field on a president, term, or `game`; no set/read path. The presidential general (`runPhase_2_9_4_PresidentialGeneral`, `phaseRunners.ts:3752`) tallies EVs and declares a winner but records no mandate/margin state. → **Not in the build.** The forum's "mandate" is a designed governing concept with no shipped representation.

## ★ Kingmaker relationship + "National +1", broken by becoming president

POST 1 says Polk "has a National +1 for a Kingmaker relationship." POST 6 (GM correction): "Polk doesn't have the +1 from the kingmaker. **That relationship broke once he became president.**"

**Code-verify:** The kingmaker/protégé system is fully shipped — `KINGMAKER_RULES` + `KingmakerEntry` (`types.ts:295,1710`), phase `2.1.7` (`phases.ts:10`), `runPhase_2_1_7_Kingmakers` + `assignProtege`/`releaseProtege` (`phaseRunners.ts:1372,1304,1324`), UI `pages/Kingmakers.tsx`. Graduation grants **command/trait legacy** to the protégé (`phaseRunners.ts:1429-1474`); mentor Kingmaker gives a `kingmakerProtegeBonus` graduation-roll chance (`types.ts:454`). **However:** the shipped bonus is a per-protégé *Command/trait* development bonus, **not** a persistent "National +1" party-wide/national modifier, and there is **no rule** that dissolves the mentor bond when the protégé becomes president. The "National +1" and the "breaks on presidency" rule are forum-side relationship semantics richer than what ships. → **Partly built** (mentor/protégé exists); the *national relationship bonus* and *president-breaks-bond* rule are **not** in the build.

## ★ Term limits + a "3rd-term trait" (designed, dropped)

POST 3 (GM): "I remember at one time I considered adding a **trait that would allow someone to seek a 3rd term if it's legal**. I ended up not doing it because it's hard to determine who would have that ability… of those who were never president." Polk seeking a 3rd term is legal in this game precisely because term limits aren't enforced against him.

**Code-verify:** `termLimits` ships as a **constitutional-convention article** with values `'two_terms' | 'no_limits'` (`types.ts:1396`; CC article + AI default in `constitutionalConvention.ts:60-63,120-121`; scenario default `no_limits` at `scenario1856.ts:189`). **But** grep of `src/engine/` shows `termLimits` is referenced only in `constitutionalConvention.ts` — **never** in `calcStateVote`, the primary (`runPhase_2_9_1_Primaries`, `phaseRunners.ts:3725`), or the presidential general. The primary simply picks the **top-PV eligible** candidate (age 35–80, command ≥2); an incumbent re-runs by winning the primary again. So: term limits are **stored but not enforced**, there is **no `termsServed` counter**, no re-run gate, and (grep `third.?term|3rd.?term` → 0) **no 3rd-term trait**. → Term-limits article **built as data, unenforced**; the 3rd-term trait is **designed-and-explicitly-dropped, unbuilt**.

## ★ Enthusiasm-by-ideology + partyPreference

POST 1: "Party preference in 1860 is about neutral (+1 Red) and several ideologies are +3 Blue for enthusiasm."

**Code-verify:** Both are shipped and drive elections. `game.partyPreference` (clamped ±5, `types.ts:1093-1094,1570`) and per-ideology `game.enthusiasm` (`types.ts:1571`; page `EnthusiasmPage.tsx`). Both feed `calcStateVote` directly: `partyPref * 5 + enthusiasm * 2` (`phaseRunners.ts:3696-3711`). Era events adjust them via `EraEventResponseEffect.{partyPreference, enthusiasm[]}` (e.g. `eraEvents1856.ts`). The "+1 Red" and "+3 Blue by ideology" read maps exactly onto these fields. → **Built; corroborated.**

## ★ Event → regional penalty ("−1 in New England" for John Brown)

POST 1: "−1 in New England (a Whig stronghold) because of putting down John Brown's slave rebellion."

**Code-verify:** A **John Brown era event exists** in `eraEvents1856.ts` (~line 90, "Brown becomes a martyr in the North") — but its effects are **national**: `meters`, `partyPreference`, and national `enthusiasm[]` by ideology. `EraEventResponseEffect` (`types.ts:1448-1457`) has **no per-state or per-region field**. `calcStateVote` reads a static `state.bias` (`phaseRunners.ts:3697`); nothing lets an event apply a **−1 to a named region/state** (New England / Northeast) as a durable local penalty. → The **event exists** but the **region-scoped penalty does not**; regional event effects are a designed capability the effect struct doesn't yet model.

## ★ Midterm penalty ("historical losses in the midterms of 1858")

POST 1: Polk "took historical losses in the midterms of 1858" — implying the president's party is penalized in off-year (midterm) elections.

**Code-verify:** `calcStateVote` (`phaseRunners.ts:3685-3723`) has **no incumbent-party / midterm term** — score is `50 + bias*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias + traitBonus + rng`. Grep `-i midterm|incumbent|president.?s.?party` finds no such penalty in the vote math (only unrelated `incumbent` uses in challenge logic). Isolation year predicates: `isElectionYear = year % 2 === 0`, `isPresidentialYear = year % 4 === 0` — midterms (even, non-presidential) run but carry **no president's-party handicap**. Matches b58 #184/#292 ("president's-party midterm −1") flagged DESIGNED. → **Designed, not built.** (The forum "losses" may just be normal partyPreference/enthusiasm swings, not a dedicated midterm rule.)

## ★ Frail / Unlikable / lived-past-death-date / retire-vs-run

POST 1: "the frail and unlikable James K Polk (who has already lived past his historical death date)." The poll's whole premise is a **player/GM retirement decision**.

**Code-verify:** `Frail` and `Unlikable` are shipped negative traits (`types.ts:94,102`). `Unlikable` carries election penalties by context (`types.ts:793-801`), opp-conditional vs `Charismatic`/`Likable`. `Frail` multiplies death odds (`frailDeathMult`, `phaseRunners.ts:2362`) and is the opp-conditional foil to `Hale` (`types.ts:959-971`). **But** deaths & retirements (`runPhase_2_4_1_Deaths`, `phaseRunners.ts:2341-2380`) are **pure age-bracket probability rolls** — no per-politician **historical death date**, and retirement is **age-only chance**, never an **Unlikability/frailty-driven or player-elected retirement decision**. "Lived past his historical death date" implies a **historical death-date** attribute the mortality model doesn't use (it's stochastic by age). The poll's "retire or run for a 3rd term" is a **human/GM narrative choice** with no shipped agency. → Traits **built**; **historical death-date** and **elective/trait-driven retirement** **not built**.

## ★ War (3rd Seminole War) + Domestic Stability crisis

POST 1: "won the 3rd Seminole War," "deep ongoing Domestic Stability crisis."

**Code-verify (light):** War exists — `startWar` on events (`eraEvents1856.ts` Civil War; `EraEventResponseEffect.startWar`, `types.ts:1455`) and a `revolutionaryWar.ts` era system. `domesticStability` is a first-class effect field (`types.ts:1453`) tied to the `domestic` meter. The 3rd Seminole War isn't a named scripted event in-code (the shipped named war is the Civil War), so it's likely a **GM-narrated/generated war** rather than a scripted one. → War + domestic-stability systems **built**; this specific war looks GM-emergent. (Corroboration only; not a delta.)

---

## Shipped-vs-designed (verified against `src/` HEAD)

| Mechanic | Shipped today | Forum shows (designed) |
|---|---|---|
| Enthusiasm-by-ideology + partyPreference | **Built** — feed `calcStateVote` (`phaseRunners.ts:3696-3711`) | Corroborated ("+1 Red", "+3 Blue by ideology") |
| Kingmaker mentor/protégé | **Built** (`phaseRunners.ts:1372…`) — grants protégé Command/trait legacy | "National +1" party bonus **+** relationship **breaks when protégé becomes president** — neither shipped |
| Mandate on a presidential win | **Not built** (0 grep hits) | "won without a mandate either time" — a governing state |
| Term limits | **Data only** (`termLimits` CC article, `types.ts:1396`) — **never enforced** in elections | Legal 3rd term possible; GM considered a **3rd-term trait** (dropped) — no `termsServed`, no re-run gate, no trait |
| Event → regional penalty | **Not built** — `EraEventResponseEffect` is national-only (`types.ts:1448-1457`); John Brown event is national | "−1 in New England" from putting down the rebellion |
| Midterm / president's-party penalty | **Not built** — absent from `calcStateVote` | "historical losses in the midterms of 1858" |
| Frail / Unlikable traits | **Built** (`types.ts:94,102`; effects `793-801`, `959-971`, `2362`) | Corroborated |
| Historical death-date | **Not built** — mortality is age-bracket stochastic (`phaseRunners.ts:2345-2372`) | "lived past his historical death date" |
| Elective / trait-driven retirement | **Not built** — retirement is age-only chance (`2374-2379`) | Poll premise = a retire-or-run decision |
| War + Domestic Stability | **Built** (`startWar`, `domesticStability`, `revolutionaryWar.ts`) | Corroborated; 3rd Seminole War likely GM-emergent |

---

## Delta list — mapped to EXISTING gap owners (consolidation assigns final IDs)

Conservative reads: most of this **corroborates shipped systems**; a few are **designed-not-built**; a couple may be **genuinely NEW** (unowned).

1. **Enthusiasm-by-ideology + partyPreference** — SHIPPED. Corroboration. Owner: enthusiasm/partyPreference gap (b58 **#292**). No new requirement.
2. **Kingmaker mentor/protégé** — SHIPPED (development legacy). Owner: kingmaker/relationships gap. **NEW sub-item (consolidation to relationships/kingmaker ID):** persistent *national "+1" relationship bonus* and a *"bond breaks when protégé becomes president"* rule — neither exists in the shipped protégé model (POST 1, POST 6).
3. **Mandate on presidential wins** — designed-not-built (0 grep hits). Owner: **map to existing mandate gap if one exists**; if unowned, **NEW (consolidation to ID)** — "mandate / no-mandate governing state on a presidential win."
4. **Term limits enforcement** — `termLimits` is **stored data but never enforced** in elections/primaries. Owner: term-limits / constitutional-articles gap. **NEW sub-item:** engine gate that actually enforces `two_terms` (needs a `termsServed` counter + primary/general re-run check).
5. **3rd-term trait** — designed and **explicitly dropped** by GM (POST 3); grep = 0. Likely **genuinely NEW / unowned → NEW (consolidation to a term-limits sub-item or new ID).** Flag as low-priority (author abandoned it).
6. **Event → regional (state/region-scoped) penalty** — designed-not-built. `EraEventResponseEffect` is national-only. Owner: **era-event effects** gap. **NEW sub-item:** per-state/per-region effect field (e.g. `state.bias`/local enthusiasm delta) so events like John Brown can hit New England specifically.
7. **President's-party midterm penalty** — designed-not-built; absent from `calcStateVote`. Owner: **#184 / #292** (already flagged DESIGNED in b58). Corroboration — verified still unbuilt.
8. **Historical death-date** — designed-not-built; mortality is age-stochastic. Owner: **retirement/mortality** gap. **NEW sub-item:** optional per-politician historical death year the mortality roll respects/nudges.
9. **Elective / trait-driven retirement** — designed-not-built; retirement is age-only chance. Owner: **retirement** gap. **NEW sub-item:** player/AI retirement decision and/or Unlikable/Frail-driven retirement pressure.
10. **Frail / Unlikable traits** — SHIPPED. Corroboration. Owner: traits gap. No new requirement.
11. **War + Domestic Stability** — SHIPPED. Corroboration; 3rd Seminole War is GM-emergent (no scripted war of that name). No new requirement.

## Open questions (for the human)

- **Mandate** — is there an existing gap-log owner for a "mandate" system, or is this the first mention across digests? (Determines whether #3 is NEW or a corroboration.)
- Is the forum "National +1 for a kingmaker relationship" the *same* mechanic as the shipped protégé bonus, or a **separate** party/national relationship system that the browser build never had?
- Are the "1858 midterm losses" a **dedicated midterm rule** the forum engine had, or just normal partyPreference/enthusiasm swings narrated as midterm losses? (Affects whether #7 needs a distinct rule vs. is already covered.)
