# Digest — Era of the Future: event-chains & predicate notation

- **Slug:** `8f7ae0b9-era-of-the-future-additions`
- **Source:** `docs/game/sources/8f7ae0b9-era-of-the-future-additions/` (1 chunk, 7 posts, ~5k chars)
- **Type:** future-era content authoring + **event-chain / predicate dependency-graph model**
- **Participants:** vcczar (game master/designer), Arkansas Progressive (content author)
- **Date:** 24 Jul – 13 Aug 2025
- **Scope:** Design/authoring discussion (not a playthrough). vcczar wants to refresh the **Era of the Future** because its AI content predates ChatGPT/Midjourney (built ~2018-19) and is "dated and too general." AP volunteers to **map the existing dependency chains** for two future bands so new content slots in, and posts a **notation for expressing event chains** plus concrete new chains.

> **Why it matters:** This thread is the clearest player-authored spec of AMPU's **predicate-gated, event-chain content model** for the *future* era — the exact model the code already implements for 1772 only (`Predicate`/`evalPredicate`/`precondition` in `eraGraph.ts`), plus a pattern the current type does **not** first-class: **one event BLOCKING a set of others**. It also names two unbuilt future bands (Near 2024-48 / Far 2048-2100) and a large corpus of desired AI/climate/geopolitics content. Corroborates the future-era + content-engine gap cluster with a concrete dependency-graph.

---

## ★ The event-chain / predicate NOTATION (the headline — a concrete dependency-graph spec)

AP's authoring notation, verbatim from POST 3, is a compact predicate/dependency-graph DSL:

| Symbol | Meaning |
|---|---|
| `A -> B` | Event **B fires FROM** event A having occurred (directed dependency edge) |
| `(other requirement)` | Additional conditions (e.g. **meters**), combinable with **AND / OR / NOT** conditionals |
| Green text | The node is a **bill** (legislative content primitive) |
| Red text | The node is a **president action** (executive content primitive) |
| "X **blocks** the following events: …" | X being invented/completed **suppresses** a listed set of downstream events (see BLOCKS pattern below) |

This is a **dependency graph of events**, gated by predicates (prior events AND/OR/NOT meter thresholds), where nodes are typed as bills vs. president-actions. It is functionally the same shape as the shipped 1772 `GraphNode` + `Predicate` model — see Shipped-vs-designed.

Concrete predicate examples authored in-thread (POST 3, 5, 7):
- **Compound AND-gate:** `(Federal Reserve AND US on Cryptocurrency standard) -> Economists call for the Fed to regulate crypto -> Regulate cryptocurrency (x2)` — two-condition gate on a state/flag pair.
- **Meter-gated node:** *Great Climate Migration* requires **planet's health = 1 or 2** (a meter threshold) `-> Pro-Nationalist violence escalates`.
- **OR-fork:** *Blue Scare* fires from `American Communist Party controls Presidency` **OR** `Socialist Party controls Presidency`.
- **Deep chained requires (POST 7):** *Russia Fragments* requires `Great Russian Civil War Occurs -> Russia Declares War for former Soviet Territories -> (Anti-Russian Bloc Formed) AND (Russia has NOT fragmented) AND (Russia had been Communist at one time)` — an explicit multi-clause AND + NOT + historical-state predicate.
- **Cross-chain requires (POST 5):** *Turkey-Japan Anti-US Pact* requires `Turkey becomes a Superpower`, which **requires Russia to collapse** — a dependency spanning two separate fragmentation chains.

### ★ The "event BLOCKS event(s)" pattern (a NEGATIVE/blocking edge)
POST 3: **"Climate Control being invented blocks the following events:"** — a single completed event suppresses a *set* of later disaster events:
- 10.0 Richter magnitude quake hits California
- Continent-sized Hurricane lands at New Orleans
- Great Climate Migration (planet health 1-2) -> Pro-Nationalist violence
- Temperatures in AZ and TX hit 135°F

This is a **one-to-many negative dependency** (invention gates OFF a disaster cluster). It is distinct from a positive `A -> B` edge and, per code check, is **not** a first-class edge type in the current `Predicate` model (see below). Flagging as a possible NEW content primitive.

## ★ Content themes requested (the future-era corpus to build)

**AI / tech (explicitly the motivating refresh — "made before ChatGPT and Midjourney"):**
- Modern generative-AI events (both authors commit to "more AI-based events", POST 4 & 6).
- `Rise of 3D Printing -> 4D Printing`.
- `Algorithms dominate popular tech/research/consumerism -> Efficient algorithms create decline in independent thought worldwide`.
- `Usable Fusion Power Discovered -> First practical Nuclear Fusion Reactor`.
- **Energy crisis as data centers consume more power** (vcczar, POST 6) — new event.
- **Enshittification of the internet as a whole** (vcczar, POST 6) — new event.

**Climate / science:**
- `Peak Oil -> Alternative Energy is King`.
- Climate Control invention + its BLOCKS cluster (above).
- `Cancer research funded -> Cure for Cancer -> New Genetic Therapy for Terminal Illnesses`.
- `Leading Astronomers more certain we've been Observed by Alien Life -> Debate on if Alien Life is Active on Earth`.

**Geopolitics — fragmentation chains (getting their own posts, POST 3):**
- **China Fragments (Wu / Shu / Wei)** — **requires Chinese Clone War** (an Era of the Far Future event) `-> Two Koreas Reunify -> US-Shu/US-Taiwan/US-Tibet Treaties -> Japan becomes Superpower -> Wei & Wu fall into Japanese sphere -> Japanese Navy dominates Pacific -> Major Japanese Cyber Attack (rel worse than 5)`; then `Turkey-Japan Anti-US Pact AND a UK/Tibet/Shu/United Siberia/India/Poland/Koreas bloc calls on US to stop Turkish+Japanese influence`.
- **Russia Fragments (East Russia / West Russia / United Siberia)** — deep requires chain (POST 7, above).

**Ideology-takeover war-chains:**
- `American Communist Party controls Presidency -> Blue Scare (or Socialist Party controls Presidency) -> Wars to Spread Communism -> [named war] ; -> Alliance with other Communist Nations`.
- `American Fascist Party controls Presidency -> Alliance with other Fascist Nations ; -> Wars to Spread Fascism -> [named war]`.
- Pattern: a **party/ideology controlling the Presidency** is itself a predicate that unlocks alliance + war-of-expansion chains, terminating in a **named war** node.

**Two future bands named (POST 2):** *Era of the Near Future* = **2024-2048**; *Era of the Far Future* = **2048-2100**. Some events (Chinese Clone War) are explicitly Far-Future-gated, so band membership is itself a gating dimension.

---

## Shipped-vs-designed (verified against `src/` HEAD)

- **Future era: 0% built.** `Era` type = `'independence' | 'federalism' | 'nationalism' | 'modern'` (`types.ts:1337`) — **no `future`**. "future" appears in `src/` only inside code comments, never as an era value. Only two scenarios ship (`scenario1772.ts`, `scenario1856.ts`); only two era-event files exist (`eraEvents1772.ts`, `eraEvents1856.ts`). Neither Near (2024-48) nor Far (2048-2100) bands, nor any 21st-century content, exists.
- **★ The predicate/event-chain model IS shipped — but for 1772 ONLY.** `Predicate` (`types.ts:1487-1504`) is a serializable AND/OR/NOT tree over `yearAtLeast/AtMost`, `eventCompleted`, `eventChose`, `meterAtLeast/AtMost`, `interestAtLeast`, `diplomacyAtLeast`, `warActive`, `warOutcome`, `stateAdmitted`, `officeControlledByPlayer`, `rosterHasSkill`, `flag`. `evalPredicate` (`eraGraph.ts:12`) interprets it recursively; `selectEraGraphNode` walks `ERA_GRAPH_1772` filtering by `n.precondition` (`eraGraph.ts:113-116`). **This is precisely AP's `A -> B` + `(other requirement)` AND/OR/NOT notation** — `eventCompleted` = the `->` edge, the meter/interest predicates = `(other requirement)`, `not` = the NOT conditional.
- **1856 has NO graph.** `eraEvents1856.ts` gates purely on **hardcoded `if (year >= …)` blocks** (lines 6, 30, 55, 79, 104, 133, 180) with **no** `precondition`, `Predicate`, `GraphNode`, or `coreSpine` reference. So even the *shipped* modern-ish scenario doesn't use the graph model; the future era would be the graph's second (really third) home and would need it ported.
- **★ No first-class "event BLOCKS events" edge.** The only negation available is `{ not: Predicate }` combined with `{ eventCompleted: id }` — i.e. Climate-Control-blocks-disasters is expressible **only** by hand-adding `{ not: { eventCompleted: 'climate_control' } }` to the precondition of **each** blocked node individually. There is no reverse "this node suppresses [list]" declaration on the *blocker* (grep for `blocks|blockedBy|excludes|mutex|cancels|preempts` in `eraEvents1772.ts` → none). AP's notation declares blocking **from the blocker's side, one-to-many** — an ergonomic/expressive gap over the current per-blocked-node negation.
- **Content primitives (bills = green, president-actions = red).** Bills exist as a real system; executive/president actions as event nodes are partly present but `eraGraph.validate()` **forbids** `decider: 'president'` or `'cabinet'` nodes in the 1772 graph (`eraGraph.ts:150-151`) — pre-1789 there is no President. A future era would *require* president-action nodes as a supported decider type, i.e. the red-text primitive is not a general graph primitive today.

---

## Delta list (map to EXISTING gap IDs — consolidation owns the gap log)

1. **Future-era gap (b57 cluster).** CORROBORATES: future era 0% built; this thread names the two bands (Near 2024-48, Far 2048-2100) and supplies a large concrete content corpus (AI, climate, fragmentation, ideology-war chains). Adds band-membership as a gating dimension (Clone War is Far-Future-only).
2. **#258 (predicate-gated availability / event-chains).** Strong new WITNESS: AP's `->` + `(other requirement)` AND/OR/NOT notation maps 1:1 onto the shipped `Predicate`/`evalPredicate` model — but confirms it's wired to `ERA_GRAPH_1772` only; 1856 uses hardcoded `if(year>=)`; future era has no graph at all. The desired chains are exactly #258-shaped.
3. **NEW (consolidation to #258 sub-item): event-BLOCKS-event / one-to-many negative edge.** "Climate Control blocks [disaster cluster]" is not first-class in the `Predicate` type; only per-blocked-node `{ not: { eventCompleted } }` emulates it. Propose a blocker-side "suppresses: [templateId…]" primitive (or `mutex`/exclusion groups). Flag if unowned.
4. **NEW (consolidation to a future-era content-authoring item under b57): the future-content corpus itself** — the enumerated AI/energy-crisis/enshittification/climate/China-fragments/Russia-fragments/ideology-takeover-war event chains are a concrete authoring backlog not yet captured node-by-node.
5. **#221 (content model — bills/president-actions primitives).** CORROBORATES: green=bills, red=president-actions used as the two node types in every chain.
6. **#169 (executive / president actions).** CORROBORATES + tension: red-text president-actions are first-class content nodes in the design, but the shipped graph *forbids* `president`/`cabinet` deciders (1772-scoped by validate()); a future era needs president-action nodes supported.
7. **#206 (era-band).** CORROBORATES: explicit named bands (Near Future 2024-48, Far Future 2048-2100) with band-gated events.

### Open questions (for the human)
- Should blocking be a new first-class edge (`suppresses: [...]` on the blocker) or stay as per-node `{ not: eventCompleted }`? (affects `Predicate`/`GraphNode` shape).
- Do "named war" nodes (from ideology-takeover chains) imply a new war-system beyond `revolutionaryWar`? The current `Predicate` only knows `warActive/warOutcome` for the Revolutionary War.
- The future corpus references world-state predicates the engine lacks (planet health meter, foreign-nation superpower/fragmentation state, party-controls-Presidency). Which map to existing `meters`/`diplomacy`/`flag`, and which need new state?

---

RETURN summary (deltas): see the Delta list above. Headline: AP's `->` + `(other requirement)` AND/OR/NOT + green=bills/red=president-actions notation is a concrete predicate/dependency-graph spec = the #258 model, which is shipped for **1772 only** (`eraGraph.ts`/`ERA_GRAPH_1772`), absent in 1856 (hardcoded `if(year>=)`), and nonexistent for the **future era (0% built — `Era` enum has no `future`)**. NEW: an **event-BLOCKS-event one-to-many negative edge** (Climate-Control-blocks-disasters) that the current `Predicate` type can only emulate per-blocked-node; plus the large future-content corpus (AI/energy-crisis/enshittification, climate, China/Russia fragmentation chains, ideology-takeover war chains). Maps to gaps: **future-era (b57)**, **#258** (+ NEW block-edge sub-item), **#221**, **#169**, **#206**.
