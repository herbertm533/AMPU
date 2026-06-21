# AMPU — Roadmap

> **Bootstrap version.** This is the initial roadmap, sequenced from the
> tech-lead's binding ordering advice (`technical-guide.md` §9) over the
> Built-vs-Designed gap log (`game-context.md`). **The "Up next" queue is
> PROVISIONAL.** Most era *content* scope traces to an example forum export that
> is **present but not yet post-by-post ingested**
> (`docs/game/sources/f4c7c2c4-ampu-1800-playtest-continued-1868/`, 343 posts /
> 5 chunks). The foundational items (RNG, era keystone, era registry) are solid;
> the specific new-era content rows and everything in the parking lot will be
> **re-scoped and re-ordered** once those sources are run through
> `/ingest-playtest`. Order is the product — build top-to-bottom.

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic is
**complete** (gap analysis: `docs/research/abilities-expertise-traits-gap-analysis.md`).

- **PR7 — Lobbies → expertise → industry + faction ideology.** Lobby cards
  trickle expertise to members (2.1.2), `LOBBY_INDUSTRY` nudges state industries
  (2.1.8), `EXPERTISE_IDEOLOGY_LEAN` biases `factionCenter`. _Complete._
- **PR6 — Trait pass B (governance/cabinet-facing).** `TRAIT_GOVERNANCE_EFFECTS`
  drive lingering meters, era-event modulation (Delegator/Micromanager,
  Crisis Gov/Admin, Iron Fist), military-command grants, Secession-Winter band.
  _Complete._
- **PR5 — Cabinet overhaul.** Per-seat scoring (`CABINET_SEAT_SCORING`),
  expertise gating + grants (`OFFICE_EXPERTISE`), admin double on confirm,
  era-conditional seats (`cabinetSeatsForYear`). _Complete._
- **PR4 — Trait pass A (election-facing).** `TRAIT_ELECTION_EFFECTS` /
  `TRAIT_ELECTION_BANDS` give real per-context magnitudes to election traits
  (Charismatic, Integrity, Unlikable, Outsider, …). _Complete._
- **PR3 — Trait loss + conflict machinery.** Old-age trait decay
  (`TRAIT_LIFECYCLE_RULES.oldAge` fading pool) + d6 conflict arbitration
  (`TRAIT_CONFLICTS`, `tryGrantTrait`). _Complete._
- **PR2 — Ability earn/loss alignment.** Missing command grants
  (faction/party leader, committee, CC pres, cabinet, battles) +
  the loss machinery (old-age, anytime evo, battle) for all six skills +
  command; primary/secondary track grants. _Complete._
- **PR1 — Expertise axis foundation.** New `Expertise` type (19 tags) +
  `expertise` field; migrated the 8 mis-filed expertise-as-trait strings off the
  `Trait` union (incl. `repair()` save migration + dataset regen). _Complete._

---

## Up next (dependency-ordered) — PROVISIONAL

Order is binding from `technical-guide.md` §9: **(0) seed the RNG → (1) era
keystone + registry → (2) new-era content → (3) multiplayer.** Each item is
right-sized to a single `/build-feature` run; epic-sized work is split and noted.

| # | Item | Scope (1-2 lines) | Depends on | Size | Source (gap log) |
|---|---|---|---|---|---|
| 1 | **Seed the RNG (real PRNG + seed on `GameState`)** | Drop a real seeded PRNG (e.g. mulberry32) into `rng.ts`; store seed + PRNG state on `GameState` (optional field + `repair()` backfill); keep the existing wrappers' signatures. | — | S–M | game-context gap: determinism prerequisite (tech-debt #3); enables Players + replay |
| 2 | **Migrate the 13 raw `Math.random` engine calls** | Route every raw `Math.random` in the engine through `rng.ts` wrappers — flagship is `calcStateVote`'s `(Math.random()-0.5)*8` jitter; also war/court/draft-rookie + `revolutionaryWar.ts` + `continentalCongress.ts`. Re-playtest elections (PV reweighting risk is zero; outcomes just become reproducible). | 1 | S | game-context gap: tech-debt #1/#2; completes determinism |
| 3 | **Era-transition keystone — generalize `advanceEra(snap)`** | Replace the single hard-coded transition at `constitutionalConvention.ts:198` with a pure `advanceEra(snap)` driven by a trigger (year threshold and/or terminal era-event), called from the loop / 2.10. *The keystone — blocks all new-era work.* | 2 | M | game-context gap: `modern` era / Eras covered (tech-debt #5) |
| 4 | **Per-era content registry** | Lift the 1772 graph pattern into an era-indexed registry: `ERA_GRAPH_<era>` + era→graph lookup in the walker (`eraGraph.ts:107` currently hard-imports `ERA_GRAPH_1772`); same indirection for anytime pools + scenario seed. Keep the serializable `Predicate` tree as-is. | 3 | M | game-context gap: Eras covered / Social movements (extension point) |
| 5 | **Era-keyed config fill-in + per-era phase/office gating** | Add the new era to the `Era` union (or claim `modern`); fill every `eraConfig` (`satisfies Record<Era,…>` flags misses); extend `shouldRunPhase` + `cabinetSeatsForYear` for era-specific phases/offices (e.g. the 17th-Amendment direct-Senate the `senatePre17` context anticipates). | 3 | S–M | game-context gap: `modern` era dormant tables |
| 6 | **New-era content: 1868+ Gilded-Age scenario (data)** | First reachable post-1860 era as content on the keystone+registry: scenario builder, state roster, factions/parties (re-mapped meaning), `ERA_GRAPH` spine. **Scope of issue *systems* (tariff/currency/etc.) is split out to the parking lot pending ingestion.** | 4, 5 | M | game-context gap: Eras covered ("1800 … continued 1868") — **content pending ingestion** |

> **Provisional note.** Items 1–5 are foundational and well-grounded in the
> codebase. Item 6 (and any sibling new-era content) is a **placeholder shell**:
> the actual era spine, issue axes, party re-mapping, and meter set are
> unconfirmed until the forum source is ingested (see Open Questions in
> `game-context.md`). Expect item 6 to fan out into several right-sized content
> items after `/ingest-playtest`.

---

## Later / parking lot

Bigger or fuzzier items not yet sequenced. **Most depend on forum ingestion to
pin scope**; they get sequenced once the playtest files are digested. Listed
roughly by likely era-content adjacency, not committed order.

- **Async forum-style multiplayer (own backend epic, L–XL).** True async
  multiplayer needs a backend / shared state — IndexedDB is per-browser, the repo
  has none today. Hard-blocked on item 1 (determinism). Scope as its own epic,
  **not** a feature. _(A cheaper hot-seat / sequential variant — reusing the
  existing `needsPlayerInput` pause round-robin across human factions, an M — may
  be promoted into "Up next" after eras land; see sequencing notes.)_
  — game-context gap: **Players**.
- **Generalize "the player" → "a player" (M).** Replace singleton
  `playerFactionId` + single `isPlayer` with a set of human factions; audit every
  "is this me?" read (`playerControlsDecider`, faction-scan gates, auto-pick
  paths). Prerequisite for *either* multiplayer shape. — game-context gap: Players.
- **Gilded-Age issue systems** — tariff, currency (Gold-Standard vs Free-Silver),
  civil-service reform, imperialism. New issue axes + interest groups + era-event
  spines. Split per-issue when scoped. — game-context gap: **Gilded-Age issues**.
- **Emergent social movements.** Mechanism for coalitions/movements appearing
  dynamically across the timeline (vs. today's fixed per-era interest/lobby sets).
  — game-context gap: **Social movements**.
- **Third-party support.** Flesh out the 2.9.3 stub (currently a no-op
  "no challenge" log) into a real third-party / spoiler mechanic. — game-mechanics
  §19: third-party challenge is a stub.
- **Supreme Court cases.** `SupremeCourtCase` / `pendingCourtCases` types + a
  ruling tick exist, but no scenario seeds substantive cases — court is just the
  abstract `partyPreference` nudge today. — game-mechanics §19.
- **Generic-war battle/casualty depth.** Bring the rich Revolutionary-War battle
  system to generic (1856+) wars, which use the thin `milPower×10 + d100`
  resolver. — game-mechanics §19.
- **Far-future eras (`modern`+).** Whatever sits past the Gilded Age once the era
  cadence is confirmed (continuous campaign vs. discrete scenarios — open
  question). — game-context gap: `modern` era intent unconfirmed.

---

## Sequencing notes

Why the order is what it is — quoting the tech-lead's dependency calls
(`technical-guide.md` §9).

1. **RNG first (items 1–2).** "Seed the RNG (foundational for everything, do
   first). … determinism is the **prerequisite for multiplayer** (clients/turns
   must agree on roll outcomes) and it makes every future feature testable and
   replayable. Cheap relative to its leverage." It is also called out as a hard
   gate later: multiplayer "**cannot** be correct until step 0 lands." Split into
   two runs — drop the PRNG/seed (1), then sweep the 13 raw `Math.random` calls
   (2) — because the sweep touches many files and wants its own playtest.

2. **Eras before multiplayer.** "Eras are a *content + extension-point* problem on
   the existing single-player loop; multiplayer is a *turn-model rearchitecture*.
   … Multiplayer built first would have to be re-validated against every later
   era. **So: eras (1) → multiplayer (2).**"

3. **The era keystone gates all era work (item 3).** "An era-transition
   mechanism. Today the only transition is hard-coded in the convention
   (`constitutionalConvention.ts:198`). Generalize to a small `advanceEra(snap)`
   … *This is the keystone — debt #5 — and blocks everything else here.*" Hence
   item 3 precedes the registry (4), config fill (5), and all content (6).

4. **Registry before content (items 4 → 6).** The walker hard-imports
   `ERA_GRAPH_1772`; new-era content can't load until the registry indirection
   exists. Because the `Predicate` tree "already supports
   `yearAtLeast`/`meterAtLeast`/etc., … most new-era gating needs **no new
   code**, only new data rows" — so once 3–5 land, each era is "**M (mostly
   content)**," which is why item 6 is content-sized, not architecture-sized.

5. **Multiplayer is two different things — both parked.** Hot-seat/sequential is
   "a believable M on top of the current architecture **after** step 0," but
   "**true async forum multiplayer is an L–XL that introduces a backend AMPU has
   never had — scope it as its own epic, not a feature.**" Both stay in the
   parking lot at bootstrap: the cheaper hot-seat path can be promoted into the
   queue after eras land; the async/backend epic waits on ingestion to confirm
   the forum's turn-arbitration model (open question: snake order? bidding? seat
   assignment?).

6. **Why item 6 is provisional.** The gap-log rows that motivate new eras and the
   Gilded-Age issue systems are tagged **"source: example export (pending
   ingestion)."** The era *scaffold* (the `Era` union, era-keyed `eraConfig`s, the
   serializable 1772 graph) is real and buildable now (items 3–5), but the era
   *content* (spine, issues, party meaning, meter set) is unverified until the
   forum thread is digested via `/ingest-playtest`. Re-scope items 6+ and the
   parking lot then.
