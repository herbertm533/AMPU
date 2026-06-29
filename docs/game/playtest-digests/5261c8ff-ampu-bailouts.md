# Digest — 5261c8ff "AMPU Bailouts" (topic 1170, @vcczar)

**Batch 49 (digest-only). Type: AUTHORING SNAPSHOT — a policy-genre CONTENT
thread, not a playthrough.** 5 posts, 1 chunk (`chunk-001.md`, 127 lines, ~4.2k
chars). Author/GM: @vcczar; one design Q&A reply chain (@OrangeP47,
@matthewyoung123). Dated **4/8/2022** (POSTs 3-4 quote timestamps).

This is the **Bailout subtype** of @vcczar's economic-policy catalog — the third
**prereq-structured** content tree captured, sibling of the **b47 Currency** and
**b48 Credit/Debt** (`391df03b-ampu-creditdebt.md`) exemplars. Same authoring
format: a flat list of policy nodes, each tagged with an **action type** and an
**era**, grouped by **prerequisite**. POST 1 restates the format and asks
specifically for *Era-of-the-Future*, *Pres Action*, and *Gov Action* bailout
ideas — i.e. the tree is acknowledged-incomplete on those axes.

> **No playthrough here.** No campaign, no polarity, no era-band markers, no GM
> rulings on live games. All facts below are **designed intent** (author's
> catalog), to be labelled as such in any gap-log. Era framing for the modern/
> crisis content (TARP, COVID, S&L, subprime) lives in
> `docs/game/historical-context.md` (New Deal §6, Reagan §8, modern §10); no
> historian ran this batch, so I do not assert new historical claims.

---

## The legend (POST 1, verbatim restatement)

> "Eras are abbreviated. **S = scripted event, L = Legis prop, G = Gov action,
> P = Pres action**" (POST 1).

Era suffixes seen in this tree: **Ind** (Independence/default), **Neo**
(Neoliberal/modern), **Ter** (Terra/Future — the late/climate era), **Gild**
(Gilded Age), **Ide** (Ideology-gated — see note), **Pop** (Populist).
Action types seen: **L** (legislation) dominates; one **P** (Pres action); two
**S** (scripted events embedded in the tree); **no G (Gov action)** node appears
— consistent with POST 1's explicit request for Gov-action bailout ideas (gap).

**"L-Ide" is notable**: the three income-tier worker bailouts are tagged `L-Ide`
rather than an era — i.e. **ideology-gated content**, not era-gated. (b47/b48
parallel: most nodes carry an *era* tag; an *ideology* tag is the alternative
gating axis. Worth flagging to the content-engine work — see #258.)

---

## The bailout content tree (POST 1) — prereq → nodes

Grouped exactly as authored. `S` = scripted event; everything else `L`/`P`.

**Default (no bailout active):**
- No Federal Bailout Policy — **L-Ind-Default** (the "nothing active" state node)

**No prereq:**
- Ban Bailouts for "Too Big to Fail" — **L-Neo**
- Subprime Mortgage Crisis — **S-Ter** ★scripted event node

**Prereq: Economic Meter at *Stagnant* or worse** (★META-BAND predicate):
- Community Reinvestment Act — **L-Neo**
- Accept Loans from Wealthiest Americans to Help with Economic Crisis — **P-Gild**

**Prereq: Economic Meter at *Panic* or worse** (★META-BAND predicate):
- Bailout for High-Income Workers during Economic Crisis — **L-Ide**
- Bailout for Middle-Income Workers during Economic Crisis — **L-Ide**
- Bailout for Low-Income Workers during Economic Crisis — **L-Ide**
- Federal Bailouts for Banks — **L-Neo**
- Federal Bailout for Small Businesses — **L-Neo**
- Federal Bailout to Major City — **L-Neo**
- Temporary Direct Payments to Americans during Pandemic — **L-Pop**

**Prereq: *Panic-or-worse* AND "Ban Too Big to Fail" NOT active**
(★compound: META-BAND + **policy-NOT-active**):
- Federal Bailout of Major Corporations — **L-Neo**
- Federal Bailout of Wall Street — **L-Neo**

**Prereq: Requires any pandemic** (★**EVENT-active** predicate):
- Maximal Pandemic Relief Package — **L-Pop**
- Moderate Pandemic Relief Package — **L-Pop**
- Minimal Pandemic Relief Package — **L-Pop**

**Prereq: Any pandemic package is active** (★**policy-active** predicate):
- Expand Stimulus Package to Aid in Pandemic — **L-Pop**

**Prereq: Garn-St. Germaine Act is active** (★**policy-active** predicate):
- Savings and Loans Crisis — **S-Neo** ★scripted event node

---

## Community design Q&A (POSTs 2-5)

- **POST 2** (@OrangeP47): suggests **climate-relocation assistance** (rising
  sea levels / desertification). vcczar later folds this into the tree concept;
  cross-ref **#206** (climate-relocation future content) — this is the same idea
  surfacing in a second thread.
- **POST 3** (@matthewyoung123): two ideas — (a) **declare States/Regions
  disaster areas → eligible for federal $ to rebuild infrastructure** (cites a
  remembered "flooding in Georgia"); (b) a **state infrastructure rating 1-5**
  (HOI4-style), tied to the 1800s "internal improvements" theme.
- **POST 4** (@vcczar, the GM ruling on scope): internal-improvements /
  infrastructure is **"a different category from bailouts"** and out of scope for
  this thread — *"I've got a ton of internal improvements stuff."* But
  **"Declaring disaster regions is good idea for this thread"** → so
  **disaster-area declaration → federal rebuild funds** is accepted as bailout
  content. (The infrastructure-1-5 idea is deferred to its own genre.)
- **POST 5** (@vcczar): intent to **"create bailout legislation for each
  industry in the game which hasn't one"** — i.e. the tree is meant to scale to
  *per-industry* bailout bills (Agriculture, Business, Energy, etc. — matching
  the `PolicyArea` enum, `types.ts:183-189`). Confirms this catalog is a
  **work-in-progress, generated against the industry list**, not final.

---

## ★ Why this thread matters: evidence for #258 predicate classes

This is the **strongest single source yet** for what a data-driven
legislation/policy *content engine* must support. It corroborates and **extends**
the predicate set inferred from b47 Currency + b48 Credit/Debt (**#258**). Three
predicate classes are exercised here:

**(a) Economic-meter BAND predicate** — "Economic Meter at **Stagnant** or
worse", "at **Panic** or worse". Adds **Stagnant** to the band vocabulary; with
Currency/Credit-Debt this gives an ordered band scale used as a *gate*. ★Note the
authoring vocabulary ("Stagnant", "Panic") is **author shorthand**, and does NOT
match the shipped UI band labels (see deltas — shipped `economic` bands are
`Depression…Slowdown…Stable…Roaring`, no "Stagnant"/"Panic"). The *concept* —
"meter at-or-below an ordinal threshold gates content" — is what generalizes.

**(b) Policy-active / policy-NOT-active predicate** — three distinct instances:
- "Ban Bailouts for Too Big to Fail" is **NOT active** (gates Corp/Wall St bailouts)
- "**any pandemic package** is active" (gates Expand Stimulus)
- "**Garn-St. Germaine Act** is active" (gates the S&L Crisis scripted event)
This requires the engine to track **which policy nodes are currently in force**
and predicate on presence/absence — a capability the build does not have (deltas).

**(c) EVENT-active predicate** — "**Requires any pandemic**" gates the three
Pandemic Relief Packages. Distinct from policy-active: it predicates on a
*scripted-event/condition* being live (a pandemic is in progress), not on a
passed bill.

★ **Content ↔ event interplay (new observation).** Two **scripted-event (S)
nodes are embedded inside the content tree** as siblings of legislation:
**Subprime Mortgage Crisis (S-Ter)** and **Savings and Loans Crisis (S-Neo)**.
These are crises that, once fired, *enable downstream bailout content* (S&L Crisis
is itself gated by Garn-St-Germaine being active — a policy → event chain). So the
catalog is not pure legislation: it interleaves **scripted events that change the
predicate state**, which then unlock player policy responses. This is the same
content↔event coupling the engine must model — events flip flags/meters; flags/
meters gate legislation.

**Catalog-shape corroboration (#237/#221):** this is the **3rd prereq-tree
exemplar** with the *identical authoring shape* (default node → no-prereq nodes →
prereq-grouped nodes; each node tagged action-type + era/ideology). Three
independent threads in the same shape strongly implies a uniform
`PolicyNode { id, actionType, era|ideology, prereq: Predicate, effects }` data
model is the intended target. Cross-ref **#66** (broader policy-system framing).

---

## Cross-references

- **#258** — the predicate-class registry (b47 7-class set + b48 additions); this
  digest adds: economic-meter BAND (incl. "Stagnant"), policy-active /
  policy-NOT-active, EVENT-active, and the scripted-event-embedded-in-tree pattern.
- **#237 / #221** — prereq-tree catalog shape; this is exemplar #3.
- **#206** — climate-relocation future content (POST 2 re-surfaces it).
- **#66** — policy/legislation-system framing.
- **Sibling digests:** `391df03b-ampu-creditdebt.md` (b48 Credit/Debt),
  the b47 Currency digest. Same author, same era, same format.

---

## Deltas vs. current build (verified against `src/`)

All "designed intent" — none of this ships. Verified, not assumed:

1. **No bailout system exists at all.** No bailout/TARP/Too-Big-to-Fail/
   Garn-St-Germaine/subprime/S&L content in `src/`. The only grep hits for
   "bailout/pandemic" are incidental: a `Crisis Admin` trait that nudges the
   `economic` meter (`types.ts:1020`), an anachronism *guard* mentioning "modern
   pandemic" (`phaseRunners.ts:2564`), and Spanish-flu event flavor text
   (`anytimeEvents.ts:104`). **Delta: the entire Bailout subtype is unbuilt.**

2. **No pandemic state/condition ships.** "Requires any pandemic" has nothing to
   predicate on. There is no pandemic event, flag, or meter. **Delta: needs a
   pandemic-active condition (EVENT-active predicate class).**

3. **`economic` meter is a raw `number` with NO named bands as predicates.**
   `NationalMeters.economic` is `number` (`types.ts:1401`). Band names exist
   **only as display strings** in `src/components/Meter.tsx:15`
   (`['Depression','Severe Recession','Recession','Slowdown','Sluggish','Stable',
   'Growth','Expansion','Boom','Strong Boom','Roaring']`) — UI-only, same as the
   `revenue` display-band finding in b48. **The thread's bands "Stagnant"/"Panic"
   are NOT among them** and are not predicate-able. The predicate union
   (`types.ts:1495-1496`) supports only **`meterAtLeast`/`meterAtMost`** (numeric
   thresholds). **Delta: "meter at <band> or worse" must compile to a numeric
   meterAtMost; and the author's band vocabulary must be reconciled with the
   shipped 11-band economic scale (Stagnant/Panic ≈ Slowdown/Recession?).**

4. **No policy-active / policy-NOT-active predicate.** `Predicate` (`types.ts:
   1487-1504`) has `eventCompleted`/`eventChose`/`flag` but **no concept of a
   currently-in-force policy** to test for presence/absence. `Legislation`
   (`types.ts:1506`) is a *runtime instance* with a `status`, not a registry of
   active named policies. **Delta: needs active-policy tracking + a policy-active
   predicate (the "Ban Too Big to Fail NOT active", "Garn-St-Germaine active",
   "any pandemic package active" gates).**

5. **No authorable policy/legislation content catalog.** Legislation today is
   created at runtime (proposed → committee → passed); there is **no data file of
   pre-authored policy nodes with prereqs/effects**. The whole genre-thread model
   (Currency/Credit-Debt/Bailout) presumes a `PolicyNode` content model that does
   not exist. **Delta: the prereq-tree → data model is the load-bearing build gap
   shared across #258/#237/#221.**

6. **`GraphFlagId` is only `'loansEnabled' | 'warVictoryGuaranteed'`**
   (`types.ts:1109`). No flags for any policy/crisis in this tree. **Delta: flag
   namespace must expand (or be superseded by policy-active tracking).**

7. **Ideology-gated content (`L-Ide`) has no mechanism.** Nodes gated by player
   ideology rather than era are unsupported as a content-gating axis. **Delta:
   add an ideology gate alongside the era gate (minor vs. the rest).**

8. **Out-of-scope-but-noted (per POST 4):** disaster-area declaration → federal
   rebuild funds (accepted bailout content); state infrastructure 1-5 rating
   (deferred to internal-improvements genre, NOT bailouts); per-industry bailout
   bills (POST 5, scales against the `PolicyArea` enum `types.ts:183-189`).

---

## Open questions (for the human)

- **Band reconciliation:** do author bands "Stagnant"/"Panic" map onto the
  shipped 11-band `economic` scale, and at which numeric thresholds? (Stagnant ≈
  Slowdown/Sluggish? Panic ≈ Recession/Severe Recession?) This must be pinned
  before "meter at <band> or worse" predicates can be authored.
- **Policy-active model:** is "active policy" a set of node-ids in game state, or
  derived from passed `Legislation` history? The three policy-active gates here
  need a canonical answer.
- **"Garn-St. Germaine Act" provenance:** it gates the S&L Crisis but is **not
  itself a node in this tree** — presumably authored in another genre thread
  (Credit/Debt or Banking?). Where is it defined?
- The tree is explicitly **incomplete** (POST 1 asks for Future/Pres/Gov bailout
  ideas; no G-node exists; POST 5 wants per-industry bills) — treat as a snapshot,
  not a closed spec.
