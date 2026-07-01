# Digest — `27711296-ampu-biden-events` ("AMPU Biden Events")

- **Slug:** `27711296-ampu-biden-events`
- **Source CSV:** `27711296-AMPU_Biden_Events.csv` (1 chunk, **4 posts**, ~1.69k chars — all read).
- **Date stamp in-thread:** Nov 6, 2022 (POST 2 edit by @OrangeP47).
- **Type:** **MODERN / Biden-era CONTENT brainstorm — a short idea-list, NOT a
  playthrough.** No rolls, no GM narration, no campaign, no rulings. Four posts of
  "here are Biden-era events we could add." Part of **batch b62**. Nick:
  `bidenevents`.
- **Authors:** @OrangeP47 (POSTs 1-2, the FIFA/World-Cup + Musk/Twitter ideas) +
  two unsigned proposers (POST 3 unionization + AfCFTA; POST 4 the
  midterm-reaction idea).
- Cites `POST n` = `===== POST n =====`.

> **★ Why it matters / placement.** This is the **THIRD (and smallest, earliest)
> sibling in the Biden-era content cluster**, alongside `3a0e70be` (`bidenthings`,
> Aug 2022 — WV-v-EPA worked case + the front-page-media inclusion bar) and
> `24061ad6` (`biden2021`, Jan 2025 — the big list + the elderly-president-drops-out
> event, which minted gap **#169**). It adds **no worked mechanics** the siblings
> lack; it is a handful of fresh content *ideas* for the modern band (#169/#206) on
> the existing event engine (#221/#258/#237). Its **two genuinely-notable data
> points** are: (a) the OP's clean **reactive-vs-flavor event split** (POST 1) as a
> content-authoring distinction, and (b) POST 4's **per-president-midterm-reaction
> event class** with the OP already invoking the **twice-before-generalizing rule**
> ("if you do this with biden, you might have to do this with every other
> president"). It also plants the **2026 World Cup as a future-era event** (POST 2)
> and a **FIFA-corruption event that spans Obama→Biden→Future** — a multi-era-band
> availability case that feeds the era-band model (#206/#92) + future-era gap (b57).
>
> **Disposition:** near-total corroboration. Everything folds into EXISTING gaps
> (#169 modern-post-2020 band, #206 era bands, #221/#258/#237 content engine,
> future-era b57, #270-adjacent none). NEW flags are conservative: the
> **per-president-midterm-reaction (president-flavor-speech) event class** and the
> **multi-era-spanning event** (FIFA) are the only framings worth registering, and
> both attach to existing IDs rather than minting.

---

## ★ Proposed events (POST 1-4 — the durable extract)

The OP (POST 1) frames the catalog on a **two-tier split** that maps directly onto
the content model's flavor-vs-reactive/scripted distinction:

- **Reactive** = the president *reacts to* the event (has a decision/response;
  `EraEvent` with `decider:'president'` + `responses[]`).
- **Flavor** = atmosphere/period-texture, little/no mechanical choice (the `#221`
  flavor tier; the `b73925a4`/`f1209123` flavor-event line).

| Event idea | Reactive / Flavor | Era band | Source |
|---|---|---|---|
| **Inflation** (president reacts to it) | **Reactive** | modern (Biden 2021-24) | POST 1 |
| **Elon Musk buys Twitter** | Flavor | modern (2022) | POST 1 |
| **FIFA World Cup 2022 controversy** (Qatar) | Flavor (mostly) | modern (Biden 2022) | POST 2 |
| **US as sole FIFA-corruption antagonist** | Flavor | **spans Obama → Biden → Future** ⚠ | POST 2 |
| **2026 World Cup awarded to the US** | Flavor (tie-in) | **future** (Era of the Future) | POST 2 |
| **Starbucks / Amazon service-industry unionization** | Flavor | modern (2021-22) | POST 3 |
| **African Continental Free Trade Area (AfCFTA)** — ratified 2018, in force Jan 2021; largest FTA by members (43+11) & population (1.3bn); ~30M lifted from extreme poverty by 2035 | Flavor (global/foreign-affairs) | modern (2021) | POST 3 |
| **Biden's reaction to the midterms** (little dialogue/speech) | Flavor (president-speech) | modern (2022) | POST 4 |

Notes:
- **AfCFTA** is a foreign-affairs/trade flavor beat (no US action) — closest shipped
  hook is the `EraEventResponseEffect.diplomacy[]` channel, but with no US decision
  it is pure flavor.
- **Unionization** (Starbucks/Amazon) is a Labor-interest flavor beat — the
  `interestGroups[]` channel exists, but there is **no Labor/Unions interest group**
  named in the shipped card enums (same unmodeled-modern-group pattern as
  `bidenthings`'s Environmentalists/Big Business and `biden2021`'s Pacifists).

## ★ The per-president-midterm-reaction generalization (POST 4 — high-signal)

POST 4 proposes **"flavor events dealing with Biden's reaction to the midterms —
just some little dialogue or speech"**, and the proposer **pre-empts the scope
question themselves**: *"I know that if you do this with biden, you might have to do
this with every other president."*

- This is the **twice-before-generalizing rule** appearing organically from a
  player (the same rule vcczar states in `biden2021` POST 20 for the
  elderly-president-drops-out event, and in `planb` POST 135-136 for the Gaza
  humanitarian crisis): a one-off flavor event that, if repeated, should be
  **converted to a general/templated event class**.
- The construct it implies is a **president-reaction FLAVOR-SPEECH event class**:
  a low/zero-impact dialogue event, **parameterized by the incumbent president**,
  that fires on a recurring beat (here: after the midterms, i.e.
  `isElectionYear && !isPresidentialYear`, `year % 4 === 2`). It is a *president*
  event (fires for whoever holds the office), not a *Biden* event — the
  generalizable form. Distinct from `#169`'s elderly-president-drops-out (which is a
  mechanical election-disruption event); this one is **pure flavor/atmosphere**.
- Recommended framing for consolidation: a **templated per-president flavor-speech
  event** keyed to a recurring calendar trigger + the incumbent — a content-shape,
  not new architecture (the `EraEvent`/response model already supports a
  zero-effect `decider:'president'` event; what is missing is a **president-name
  interpolation / per-office-holder templating** for flavor speeches).

## ★ The multi-era-spanning FIFA event (POST 2 — an era-band edge case)

POST 2: the **US as the only country tackling FIFA corruption** could **"stretch
back all the way to Obama"**, while the **2026 World Cup** is an **Era-of-the-Future
event**. Taken together this is a single content thread whose availability **spans
three era bands (late-modern Obama → Biden → future)** — the same
multi-band-availability shape the future-era chains digest (`8f7ae0b9`) and the
era-band gap (#206/#92) already record. Shipped era-gating (`AnytimeEventTemplate.
eras?: Era[]`) *can* list multiple bands, but (a) there is no `future` band to list,
and (b) `EraEvent` (the scripted-event type) has **no era field at all** — it is
scheduled by literal `year`. So a genuinely cross-era event is unrepresentable on
the scripted-event type today.

---

## Shipped-vs-designed (code-verified against `src/` HEAD, 2026-07-01)

**None of this catalog is reachable: no modern scenario ships, so modern/Biden-era
content has no era to live in — a re-confirmation of the #169/#206 cluster.**

- **★ Only 1772 & 1856 scenarios ship.** `src/data/scenario1772.ts`
  (`scenarioId:'1772'`) and `scenario1856.ts` (`scenarioId:'1856'`) are the only two
  scenario files; no modern scenario instantiates the modern band. The Biden era
  (2021-2024) sits in the **modern** band and the 2026 World Cup in a **future**
  band — both **~0% reachable**. (Cross-ref b60/b61 future-era gap + the `0bde31bd`
  16-window roster: entry 15 = 2020-2022 **or** 2024-2026, entry 16 = 2048 — the
  Biden/future windows; only **2 of 16 boot**.)
- **★ `Era` enum stops at `modern` — NO `future` value.**
  `Era = 'independence' | 'federalism' | 'nationalism' | 'modern'` (`types.ts:1337`).
  The 2026-World-Cup / Era-of-the-Future beat (POST 2) **cannot be represented** —
  the enum has no future band (the b57 future-era gap). The Musk/Twitter/inflation/
  unionization/AfCFTA/midterm beats *would* be `modern`, but no `modern` scenario
  exists to fire them.
- **★ Zero Biden/modern flavor content ships.** Grep across `src/` for
  `biden|inflation|Musk|Twitter|FIFA|World Cup|unionization|midterm` → **no
  matches**. The shipped era-event data is 1772/1856 only (`eraEvents1772.ts`,
  `eraEvents1856.ts`).
- **The reactive-vs-flavor SPLIT is not first-classed on `EraEvent`.** `EraEvent`
  (`types.ts:1466`) is one uniform shape (`id/year/title/description/responses/
  decider/postEffects`) — **no `isFlavor`/`category`/`reactive` flag**. The
  reactive/flavor distinction the OP draws (POST 1) exists only implicitly
  (a flavor event = one with a single trivial response / `decider:'auto'`). Same
  finding as #221 / `f1209123`.
- **The "president reacts to event" primitive DOES exist.** `decider:'president'`
  + `responses[]` (each with an `EraEventResponseEffect`: `meters`, `partyPreference`,
  `enthusiasm`, `interestGroups`, `diplomacy`, `startWar`, `text`) is exactly the
  reactive-inflation shape (`eraEvents1856.ts:12,61,86,…` use `decider:'president'`).
  What's absent is (a) any modern content authored into it and (b) a
  president-name-templated flavor-speech variant for POST 4.
- **Era-band gating exists for ANYTIME events only, and can't express `future`.**
  `AnytimeEventTemplate.eras?: Era[]` (`anytimeEvents.ts:12`) gates flavor
  illness/scandal events by band (e.g. `eras:['modern']`, `:49`) — this is the
  closest shipped era-filing machinery, and it already supports **multiple bands per
  event** (the FIFA-multi-era shape) — but `Era` has no `future`, and `EraEvent`
  (scripted) has **no `eras` field at all** (scheduled by literal `year`).
- **No Labor/Unions or foreign-trade interest group for the unionization/AfCFTA
  beats.** The interest/lobby card enums (`InterestCardId`/`LobbyCardId`,
  `types.ts:310-320`) are era-specific 1772/1856 factions (Merchants, WallStreet,
  Planters…); no modern **Labor/Unions** group (POST 3 unionization) — mirrors the
  unmodeled-modern-group finding in `bidenthings`/`biden2021`.

**Net:** wholly designed modern/future flavor content, **~0% shipped** (no modern
scenario, no `future` era band, no authored Biden content). Reveals **no new
architecture** beyond what #169/#206/#221/#258 + the future-era gap already record.
The one framing worth registering (folded, not minted) is the
**per-president-midterm-reaction flavor-speech event class** (a templated,
office-holder-parameterized flavor event on a recurring calendar trigger).

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned. Consolidation decides map-vs-NEW; NEW items labelled
"NEW (consolidation to ID)". Conservative posture — this is a 4-post idea list that
mostly corroborates the modern/future content-engine cluster.)*

1. **[CORROBORATES #169 — modern-post-2020 (Biden) content band]** Inflation
   (reactive), Musk/Twitter, Starbucks/Amazon unionization, AfCFTA, Biden-midterm
   reaction — all 2021-2022 modern-band content additions for the same
   post-2020 tail `24061ad6` opened. Third sibling of the Biden cluster
   (`bidenthings`/`biden2021`). Source: POSTs 1-4.
2. **[CORROBORATES #206 / #92 — era bands + the future-era gap (b57)]** The **2026
   World Cup** is an explicit **Era-of-the-Future** beat (POST 2) — needs the
   unbuilt `future` band (`Era` stops at `modern`, `types.ts:1337`). The Biden
   beats need the modern band, which has no scenario. Pins the future-era window to
   the `0bde31bd` roster's entry 15/16. Source: POST 2.
3. **[CORROBORATES #221 / #258 / #237 — content engine (flavor tier + event
   model)]** The OP's **reactive-vs-flavor split** (POST 1) is the same flavor-tier
   distinction #221 records (no `isFlavor` flag ships); the reactive events sit on
   the existing `decider:'president'`+`responses[]` model. Source: POST 1.
4. **[NEW *framing*, attaches to #169 / #221 — per-president-midterm-reaction
   flavor-speech event class]** POST 4: a **president-reaction dialogue/speech
   flavor event**, parameterized by the **incumbent president**, on a recurring
   **post-midterm** trigger (`year % 4 === 2`), with the proposer invoking the
   **twice-before-generalizing rule** himself. Distinct from #169's mechanical
   elderly-president-drops-out event (this is pure flavor). The missing capability
   is **per-office-holder name-templating for flavor speeches**, not new
   architecture. Flag NEW; recommend fold onto #169 (president-event class) / #221
   (flavor tier). Source: POST 4. **NEW (consolidation to ID).**
5. **[NEW *framing*, attaches to #206 / #258 — multi-era-spanning event
   availability]** POST 2: the FIFA-corruption thread spans **Obama → Biden →
   Future** (2026 World Cup) — a single content thread available across ≥3 era
   bands. Shipped `AnytimeEventTemplate.eras?: Era[]` supports multi-band lists but
   has no `future` value; `EraEvent` (scripted) has **no `eras` field at all**.
   Corroborates the era-band model + the `8f7ae0b9` event-chain cross-era pattern.
   Flag NEW as an edge-case *requirement* on the era-band model; recommend fold onto
   #206. Source: POST 2. **NEW (consolidation to ID).**
6. **[CORROBORATES unmodeled-modern-interest-groups pattern]** POST 3's
   **unionization** implies a **Labor/Unions** interest group; AfCFTA implies a
   foreign-trade channel — neither exists in the 1772/1856 card enums
   (`types.ts:310-320`). Same unmodeled-modern-group gap as `bidenthings`
   (Environmentalists/Big Business) / `biden2021` (Pacifists). Source: POST 3.
7. **[CORROBORATES — no modern scenario / content 0% reachable]** Only 1772 & 1856
   scenarios ship; zero Biden/modern content authored (grep null). The whole catalog
   has no era to live in. Re-confirms #169/#206. Source: codebase verify.

### Open questions (for the human, via consolidation)
- **Per-president-midterm-reaction:** author it as a **templated per-president
  flavor-speech** (one event, president-name interpolated) or as per-president
  hand-authored one-offs? The proposer flagged the cost (POST 4); vcczar's
  twice-before-generalizing rule suggests templating. Not resolved in-thread.
- **Multi-era FIFA thread:** should the era-band model support an event whose
  availability **spans a band range** (Obama→Future), and does the `future` band
  get split (near/far, per `8f7ae0b9`)? Not discussed here.
- **Labor/Unions interest group:** add a modern Labor group for the unionization
  beat, or fold into an existing card? (Mirrors the Environmentalists/Big-Business
  open question from the sibling threads.) Not discussed in-thread.
- **AfCFTA framing:** pure foreign-affairs flavor (no US decision), or a
  `diplomacy[]`-touching reactive event? Reads as flavor. Not discussed.

### Provenance notes
- Single chunk (`chunk-001.md`); all 4 posts read. ~1.69k chars. POST 1 = OP
  reactive-vs-flavor split + inflation + Musk/Twitter; POST 2 = FIFA 2022
  controversy + Obama→Biden FIFA-corruption span + 2026-World-Cup future tie-in
  (edited Nov 6 2022 by OrangeP47); POST 3 = Starbucks/Amazon unionization + AfCFTA;
  POST 4 = Biden-midterm-reaction flavor speech + the twice-before-generalizing
  self-flag.
- **Sibling threads (the Biden-era content cluster):** `3a0e70be` (`bidenthings`,
  Aug 2022 — WV-v-EPA worked case + front-page-media inclusion bar), `24061ad6`
  (`biden2021`, Jan 2025 — big list + elderly-president-drops-out event = **#169**),
  `df11a769` (`trump-2-0`, Jun 2025 — modern content spec + bundle-bill). Future-era:
  `8f7ae0b9` / `2bb66197` (Era-of-the-Future event chains + predicate DSL). Roster:
  `0bde31bd` (16 start-windows; Biden/future = entries 15-16).
- Codebase verified at `src/` HEAD 2026-07-01: scenarios `scenario1772.ts` /
  `scenario1856.ts` (no modern); `Era` `types.ts:1337` (no `future`); `EraEvent`
  `types.ts:1466` + `EraEventResponseEffect` `types.ts:1448-1457`
  (`decider:'president'` used in `eraEvents1856.ts:12,61,86,…`);
  `AnytimeEventTemplate.eras?: Era[]` `anytimeEvents.ts:12` (`eras:['modern']` `:49`);
  interest/lobby enums `types.ts:310-320` (no Labor/Environmentalists/Big Business);
  grep for `biden|inflation|Musk|Twitter|FIFA|World Cup|unionization|midterm` across
  `src/` → no matches.
