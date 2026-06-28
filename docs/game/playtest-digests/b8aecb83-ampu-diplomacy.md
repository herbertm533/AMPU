# Digest — b8aecb83-ampu-diplomacy ("AMPU Diplomacy")

**Type:** CONTENT-AUTHORING thread (Apr 2022), **NOT a playthrough**. 7 posts /
1 chunk (chunk-001, all covered; source CSV ~7.8 KB). Opener: **vcczar** (tier-1)
mass-tagging the community to author the **Diplomacy policy genre**; replies are
community content ideas (Vols21, ShortKing + others). **Why it matters:** this is
the **raw authoring source for the Diplomacy genre** — a sibling of the
Business/Labor (#237 origin), Immigration, Education, Civil-Rights, Agriculture
and Space genre drops. It populates the **#221 content primitives** (Legis-Prop /
Pres-Action) under the **#237 stateful policy-genre framework**, carries the
**#248 subtype** = Diplomacy, leans hard on the **#258 predicate-gated
availability field**, and is the **clearest evidence yet that the engine must
track per-foreign-nation STATE** (relations / recognition / aid). Pure design
intent — content primitives are **0% shipped**; the shipped diplomacy subsystem
is a single per-nation relation scalar (see engine facts below).

---

## The artifact — Diplomacy as a #237 policy genre (tagged form, POST 1)

vcczar's master list carries the **full schema**: every row has a **mechanism
prefix** (`L-`=Legislation, `P-`=Presidential Action) + an **era-band
abbreviation**, partitioned into a no-prereq baseline followed by `Req:`-gated
blocks. **No `G-` (Governor-Action) rows** (diplomacy is a federal genre) and
**no `S-` (Scripted) rows** (kept out by design — see boundary rulings).

**Counts (approx — NOT transcribed in full; see chunk):** ~55 authored rows.
- **Legis-Prop (`L-`)** — ~22 rows: embargoes/sanctions/boycotts vs named
  countries (Mexico/Poland/Turkey/China/Japan/Russia/Iran/Iraq/North Korea),
  Marshall Plan, Lend-Lease, Donate Agricultural Surplus Overseas, Rev-War
  diplomacy (Petition the King, Declaration of Causes, Invite Canada, Seek
  Alliance w/ Native Tribes), Formosa/Gulf-of-Tonkin Resolutions, Demand WWI
  Reparations, 3rd-party-gated foreign-aid restrictions.
- **Pres-Action (`P-`)** — ~33 rows: **doctrines & stance policies** (Monroe,
  Good Neighbor, Dollar Diplomacy, Fourteen Points, Stimson, Point Four, Atoms
  for Peace, Truman/Peace-Corps, Détente w/ USSR), **opposed stance pairs**
  (Interventionist ↔ Isolationist; Globalism-over-Nationalism ↔
  Nationalism-over-Globalism; Judeo-Christian ↔ Two-State Mid-East balance),
  recognition (Officially Recognize Taiwan; friendly non-diplomatic relations
  w/ Taiwan), UN Membership, Grain Embargo, foreign-aid toggles (Suspend aid to
  brutal dictators; Ban aid from nations not of our beliefs), Upgrade Ministers
  to Ambassadors, Global AIDS/Malaria funds.

### The `L-Ind-Default` baseline (confirms #237 baseline-is-a-state)
The "nothing active" baseline is tagged **`L-Ind-Default`** —
**"No Active On-Going Diplomacy Legis Active"** (POST 1, lines 20-24). Same
baseline pattern as Business/Labor and Civil-Rights (#237); `Ind` =
Independence-era band where the default is seeded.

### Opposed-pairs / option-set axis (confirms #221/#248)
Deliberate mirror pairs, evidence the content schema wants an **option-set /
negation axis**, not one-shot flags:
- Interventionist Foreign Policy ↔ Isolationist Foreign Policy (`P-Prog` pair).
- Globalism Over Nationalism ↔ Nationalism Over Globalism (`P-Neo` pair).
- Judeo-Christian Policy in Mid-East ↔ Two-State Balance Policy (`P-Neo` pair).
- POST 6 generalizes hardest: every recognition row is **Recognize ↔ Do Not
  Recognize** (Taiwan/PRC/Western Sahara/Israel/Palestine/Kosovo/Donetsk &
  Luhansk/North Korea/Taliban-Afghanistan), and every aid row is a 4-way
  **Aid / Withdraw / Increase / Decrease** set (North Korea/Israel/Palestine/
  Saudi Arabia) + "End all foreign aid", "Withdraw from NATO", "Leave the UN".

---

## ★ Per-foreign-nation STATE model (HEADLINE finding)

The defining mechanic of this drop: **content keys off per-country game-STATE**,
not the calendar. The `Req:` clauses and the POST-6 option-sets together imply
the engine must track, **per foreign nation**, at least:

| State dimension | Evidence (verbatim where quoted) |
|---|---|
| **At-war (per nation)** | `At War with this country` gates Embargo Mexico / Sanction Poland / Sanction Turkey (POST 1, lines 26-38) |
| **Relations level** | `Relations with this nation worse than neutral` gates Boycott British Goods / Sanction China/Japan/Russia (lines 40-56) — a thresholded relation scalar |
| **Recognition flag** | the entire POST-6 **Recognize ↔ Do Not Recognize** set (9 nations + breakaway states) implies a per-nation recognized/unrecognized bit |
| **Aid level** | POST-6 **Aid / Increase / Decrease / Withdraw / End** sets imply a per-nation foreign-aid level (not just a relation number) |
| **Trade/embargo status** | embargo/boycott/sanction rows imply a per-nation trade-open vs embargoed status (vcczar: "arguably Trade", POST 1) |

**Predicate / `Req:` vocabulary seen (corroborates #258):** game-state classes
beyond a relation number —
- **No-policy baseline:** `No Active On-Going Diplomacy Legis Active` (→ `L-Ind-Default`).
- **Per-nation state:** `At War with this country`; `Relations worse than neutral`.
- **War-outcome flags:** `World War II won by Allies` (Marshall Plan); `Any World
  War Active` (Lend-Lease); `WWI is over and US was involved and allies won`
  (Demand WWI Reparations).
- **Scenario / prior-event:** `Rev War Active but Independence not yet declared`;
  `Rev War Active; Canadian Invasion has not occurred`; `Rev War Active`.
- **Institution exists:** `Dept of Agriculture Active` (Donate Agricultural
  Surplus Overseas).
- **3rd-party status:** `Authoritarian 3rd party is now major party` (aid only to
  same-belief nations); `Theocratic 3rd party is now major party` (Subsidize
  state-sponsored missionaries).

This is the **same predicate-field requirement as the Civil-Rights drop (#258)**
— and adds **per-foreign-nation state** as a query target the current `Predicate`
vocabulary cannot express.

### Authoring-process aside (NOT a gap)
vcczar **stopped typing prerequisites mid-post** — "Not putting the prereqs
anymore. Takes too much time." (POST 1, line 120), and notes this is "the last
one that I attempt to type out the prerequisites" (line 14). An authoring-speed
aside only; the later rows are genuinely prereq-gated, just untranscribed.

---

## ★ Genre-boundary rulings (capture verbatim intent — POST 1, 3, 7)

vcczar states the **category boundaries** explicitly (POST 1, line 10):
**Immigration, Trade, Expansionism, Military are SEPARATE policy genres.**
- Embargoes & sanctions **"could arguably be in Trade."**
- Ministers & ambassadors **"could arguably be here instead of Civil Service"**
  (cross-ref: the Civil-Service genre is a separate batch-39 sibling thread —
  flag the overlap for consolidation).
- **L/P/S boundary recurs:** POST 2 (Vols21) suggests Gulf-War coalition
  building, Eisenhower/Suez intervention, Cuban blockade (both sides),
  Reagan-Gorbachev summit *with a random world host city*. vcczar (POST 3, line
  268): **"Some of those are Scripted Events"** — i.e. NOT Legis-Props. Same
  L/P/S triage seen across genres (the `S-` tier is the #221 scripted-event
  primitive, deliberately excluded from these content lists).

---

## Designer ASK + community content (open coverage gaps, cross-ref #262)

**vcczar's explicit ASK (POST 1, line 12) — record as content-coverage gap:**
wants more Diplomacy **Legis-Props**, **Pres-Actions**, and **Era-of-the-Future**
content. (vcczar self-assesses the section "I don't think I really need to add
anything" — i.e. Diplomacy is comparatively complete vs other genres, but Future
content is the named hole.)

**Community additions (candidate content, not yet accepted):**
- Vols21 (POST 2): Move Israel embassy to Jerusalem; Gulf-War coalition; Suez
  intervention; Cuban blockade/restore-relations; Reagan-Gorbachev summit
  (random host city) — **several ruled Scripted Events** (POST 3).
- POST 4 (Era-of-Future floats): Congressional/Presidential **delegations** to a
  country (post-conflict/cultural-exchange/fact-finding/big-speech); George
  Kennan **Long Telegram** containment-doctrine authoring; **special envoys** to
  regions/crises (noted as ~ambassador-equivalent); **Virtual / metaverse
  summits** (President engages counterparts directly, cutting out ambassadors);
  **future alliances** (AUKUS / Indo-Pacific / TPP); **animal/gift diplomacy**
  (panda diplomacy).
- POST 6: the large Recognize/Aid/sanction option-set dump (see above) +
  aggressive-anti-communist stance, Ban/Support BDS, give land back to natives,
  sanction terrorism-supporting states.

**★ Open design Q (ShortKing, POST 5 & 7) — flag as interventionism/event hook:**
given the Interventionist↔Isolationist policy, can the player **respond to
conflicts that do NOT directly involve the US** (Russia-Ukraine,
Armenia-Azerbaijan) via military aid / direct support for a chosen side? vcczar
(POST 7, line 332): **"Scripted Events."** → so 3rd-party-conflict intervention
is designed as a Scripted-Event hook (#221 `S-` tier), gated by the
interventionist stance, **not** a standing Legis/Pres primitive. No event content
authored yet.

---

## Shipped-vs-designed (engine facts — verified this run against `src/`)

- **Diplomacy state = a per-nation relation SCALAR only.** `GameState.diplomacy:
  Record<string, number>` (`types.ts:1574`), clamped −5..+5. **No recognition
  flag, no aid level, no per-nation at-war, no per-nation trade/embargo status.**
  War is a **separate global** field (`wars: string[]`, `types.ts:1575`) — not
  per-nation. → The entire **per-country STATE model** above (recognition / aid /
  per-nation war / embargo) is **unrepresented**.
- **Shipped diplomacy phase is trivial.** `runPhase_2_7_1_Diplomacy`
  (`phaseRunners.ts:3585`, turn-loop phase **2.7.1**) only nudges each nation's
  relation scalar by random ±0.5; SoS admin adds a small drift
  (`phaseRunners.ts:3292-3295`). **No Legis-Prop / Pres-Action diplomacy catalog
  is wired** — the authored doctrines/embargoes/recognitions have no engine home.
- **No `subtype` field on `Legislation`** (`types.ts:1506-1520`) → the #248
  Diplomacy subtype value is unrepresented; only the 4-value `committee`
  (Domestic/Foreign/Economic/Justice) exists — "Foreign" is the closest shipped
  bucket but is a coarse committee, not a genre/subtype.
- **No prereq/condition field on `Legislation`** → the entire `Req:` system has
  no engine home. (Per harness/civil-rights run: a `Predicate` tree +
  `evalPredicate` ships for **era events only**, and its vocabulary cannot
  express per-nation state, war-outcome flags, institution-exists, or
  3rd-party-status — the classes this genre needs.)
- **Pres-Action primitive = designed-only (#221, 0% shipped)** — the ~33 `P-`
  doctrine/stance rows have no type/catalog. There IS a shipped `applyEffect`
  with a `diplomacy: {nation, delta}[]` effect channel (`phaseRunners.ts:3209,
  3221`), but it is an era-event effect, not a player-invokable Pres-Action.

→ Net: pure design provenance for the Diplomacy genre. Adds NO shipped behavior;
**enriches** the 0%-shipped content gaps (#221/#237/#248/#258/#262) and is the
**strongest case yet that the diplomacy data model must grow from a flat
per-nation scalar into per-nation {relations, recognition, aid, trade/war}
state.**

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs; consolidation agent owns the gap-log write. No new
numbers assigned.)*

- **#237 (stateful policy-genre framework)** — CORROBORATE + ENRICH. Diplomacy is
  a concrete genre instance in fully-tagged form (mechanism prefix + era band +
  `Req:` blocks + `L-Ind-Default` baseline = "No Active On-Going Diplomacy
  Legis"). ~55 rows (L≈22 / P≈33; no G, no S). Source: POST 1.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE. Implies a
  **Diplomacy** subtype value across L/P primitives. The opposed pairs
  (Interventionist↔Isolationist, Globalism↔Nationalism, Recognize↔Do-Not-Recognize,
  4-way Aid) sharpen the **option-set / negation axis** within a subtype. Source:
  POST 1, 6.
- **#221 (content primitives + scripted events)** — CORROBORATE + sharpen.
  Populates L (≈22) and P (≈33). **Scripted-event (`S-`) boundary recurs:**
  Reagan-Gorbachev summit (random host city), Suez intervention, Cuban blockade,
  AND 3rd-party-conflict intervention (Russia-Ukraine / Armenia-Azerbaijan) are
  all ruled **Scripted Events, not Legis/Pres** (POST 3, 7). Source: POST 1-7.
- **#258 (predicate-gated availability field)** — CORROBORATE strongly + **extend
  vocabulary**. `Req:` predicates seen: no-policy-baseline, **per-nation
  at-war**, **per-nation relations-threshold**, war-outcome flags (WWII-won,
  any-WW-active, WWI-won), Rev-War scenario/event gates, institution-exists
  (Dept of Agriculture), 3rd-party-status (Authoritarian/Theocratic major).
  Adds **per-foreign-nation state** as a predicate target the era-event
  `Predicate` enum cannot express. Source: POST 1.
- **★ Per-country relations / recognition / aid STATE model** — the headline.
  Maps to the **diplomacy subsystem gap (#107 / the 7–8-nation roster work)** AND
  to **#258** (per-nation state is a predicate target). **NEW concrete
  requirement:** grow `GameState.diplomacy` from `Record<string, number>` (a flat
  relation scalar) into per-nation state carrying at least **{relations,
  recognized?, aidLevel, trade/embargo status}**, plus **per-nation war** (today
  war is a global `string[]`). Engine note (verified): `diplomacy` scalar +
  `wars[]` are the only shipped diplomacy state. Source: POST 1, 6.
- **Content-coverage / Era-of-Future ASK (cross-ref #262 / #206)** — CORROBORATE.
  vcczar wants more Diplomacy Legis-Props, Pres-Actions, and **Era-of-the-Future**
  content; POST-4 Future floats (virtual/metaverse summits, AUKUS/TPP-style
  alliances, special envoys, Long-Telegram doctrine authoring, animal/gift
  diplomacy) are candidate Future-band rows. Source: POST 1, 4.
- **Genre-boundary overlaps (carry as open questions)** — (a) embargoes/sanctions
  "arguably Trade" (separate genre); (b) Ministers/Ambassadors "arguably Civil
  Service" — overlaps the batch-39 **Civil-Service** sibling thread; (c)
  Immigration/Trade/Expansionism/Military are sibling top-level genres. No single
  existing gap owns cross-genre boundary reconciliation — flag to consolidation.
  Source: POST 1.

---

### Provenance notes
- Single chunk; all 7 posts read. One-sided **idea/authoring dump**: POST 1
  (vcczar's tagged master list + baseline + genre-boundary ruling + designer ASK)
  is the load-bearing datum; POSTs 2,4,6 are community content adds; POSTs 3,5,7
  are the two **Scripted-Event rulings** (the only GM rulings beyond the
  category-boundary statement). No playthrough mechanics.
- Shipped diplomacy state (`GameState.diplomacy: Record<string,number>`,
  `wars: string[]`), the trivial phase-2.7.1 runner, and the absence of
  `subtype`/prereq on `Legislation` were **verified against `src/types.ts`
  (1506-1520, 1574-1575) and `src/engine/phaseRunners.ts` (3209, 3221, 3292-3295,
  3585-3588) this run**; #221/#237/#248/#258 0%-shipped status taken from harness
  context + the sibling civil-rights run.
