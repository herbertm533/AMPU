# Digest — "AMPU Courts" (`a863421c`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (Apr 2022), **NOT a playthrough.**
**11 posts / 1 chunk** (chunk-001, all covered). Source CSV ~6.5 KB.
**Author/GM:** **@vcczar** (tier-1 designer) posts the genre + the designer ASK (POST 1).
Community (jvikings1, matthewyoung123, Cal, +others) pitch additions (POSTs 2–11).
**Why it matters:** the **Courts / Judiciary** policy genre — one concrete genre in the
#237 stateful-policy-genre framework / #221 three-primitive content system. **The genre
framework is WELL-ESTABLISHED** (Business/Labor #237, subtype enum #248, prereq-gating #258,
SCOTUS cluster #52/#218/#249/#251, Future hole #206, coverage #262) — this thread
**CORROBORATES** all of it and is fully L/G/P-tagged with era-bands + `Preq:`-gated blocks,
incl. the **`L-Ind-Default` baseline = "No Supreme Court."** Its real payload is on the
**SCOTUS-cluster structure side**: this thread, together with `judiciaryidea` (fd4c3c4e =
#251, the cluster's design origin, same Apr-2022 wave), is where the **court-STRUCTURE**
content lives — court-SIZE as a settable expansion-gated variable, justice tenure rules,
**Judicial Review as a togglable institution**, **ELECTED/retention-election judiciary**, and
lower-court structure. **Sibling boundary:** batch-41 `964b8857` (Future SC Cases) owns the
SC-case docket/generator — this thread owns court STRUCTURE/genre content, NOT the docket.

---

## The Courts policy genre (the core artifact, POST 1)

vcczar posts the genre as #221 primitives, era-tagged, with `Preq:`-gated blocks.
Mechanism prefixes: **L** = Legis-Prop, **G** = Gov Action, **P** = Pres Action;
parenthetical = era-band tag (Fed/Ide/Rep/Dem/Nat/Pop/Prog/Neo/Ind/Fut/…). Same dual-code
shape as Crimes (`e456b6b3`), Civil Rights (`9bd91ee2`), Agriculture (`c33d07b8`).

- **`*-Default` baseline (POST 1):** the "Supreme Court not active" partition has **"No
  Supreme Court (L-Ind-Default)"** — the genre's absence-of-institution selectable state,
  identical pattern to Crimes' "Leave all to the States." (#237). NB this genre's baseline
  is the *no-SCOTUS* state, so its prereq partitions key off SCOTUS existence (below).
- **No-prereq items:** 11th/7th Amendment + **Judiciary** (= Judiciary Act) (L-Fed); **Fill
  State Judges with Loyalists** (G-Fed); five **Nominate {Conservative/Liberal/Moderate/
  Traditionalist/Progressive} Justice Policy** (P-Neo) — a per-ideology Pres-Action option-set.
- **★ Prereq-PARTITIONED structure (the structural payload).** Unlike Crimes' flat `Preq:`
  table, this genre is organized into game-STATE partitions, each gating content (direct #258
  corroboration — gates are game-state predicates, NOT calendar years):

  | Partition / prereq predicate (POST 1) | Gated content |
  |---|---|
  | **Supreme Court not active** | No Supreme Court (L-Ind-Default); Court Packing (L-Ide) |
  | **Supreme Court Exists** | Set No. of Justices to 5/6/7/9/10/13 (L-Fed/Fed/Rep/Dem/Nat/Pop); 40-yr & 50-yr Min Age (L-Fed); 70-yr & 75-yr Retirement Age (L-Prog); **8-Year Term Limit Amendment** (L-Prog) |
  | **Judicial Review in effect** | **Abolish Judicial Review Amendment** |
  | **Judicial Review not yet Active** | **Establish Judicial Review Amendment** |
  | **Judiciary Act is active** | Increase / Decrease # of Lower Court Justices (L-Fed) |
  | **Court Packing is Active** | **Limit Court Packing to only 6 Extra Justices Per Pres** (L-Ide) |
  | **US controls Philippines, Brazil, Mexico, Canada** | **Set No. of SC Justices to 21** (L-Ide) |
  | **US at Maximum Expansion of Territory** | **Set No. of SC Justices to 31** (L-Ide) |
  | **Constitutional Convention Only** | Establish Federal Judicial Branch (L-Ind); Establish Ban on Federal SC (L-Ind) |
  | **Robot Rights are Active** | Ban Robots from Serving on Juries (L-Fut) |
  | **Human-AI Augmentation Possible** | Ban Human-AI Augmented Citizens from Serving on Juries (L-Fut) |

  Three predicate KINDS for #258's vocabulary, two genuinely new: **institution-flag**
  (Judicial-Review in-effect / not-active; Court-Packing active; SCOTUS exists/not), and
  **★ territory-ownership / expansion-extent** (controls Philippines+Brazil+Mexico+Canada;
  at-MAX-expansion) gating the high justice counts — a new gate axis tying the court genre to
  the expansion system (`expansionism` 4e76e6c3 / #268). Plus the **Constitutional-Convention-
  only** scope (one-time founding window) and the prior-policy chains (**Judiciary Act
  active**→lower-court-justice bills; **Court Packing active**→the packing cap).

---

## ★ NOVEL sub-mechanics — flag these (the build-relevant payload)

### ★ 1. COURT SIZE as a settable, expansion-GATED variable + a packing CAP (POST 1)
- The Justice count is set by ordinary Legis-Prop to a **discrete value: 5 / 6 / 7 / 9 / 10 /
  13**, with **21 and 31 GATED behind territory expansion** (21 needs US-controls-Philippines/
  Brazil/Mexico/Canada; 31 needs max-expansion). The per-value era-band tags (5=Fed, 7=Rep,
  9=Dem, 10=Nat, 13=Pop) suggest each size is platform-flavored to an ideology/era.
- **Court PACKING** is its own Legis-Prop (L-Ide), available only when SCOTUS does not exist /
  as a distinct lever, plus a **CAP** once active: **"Limit Court Packing to only 6 Extra
  Justices Per Pres" (L-Ide)** — a self-limiting governor on the packing mechanic.
- **→ This is the SAME settable-integer-CAP pattern as #255 (variable House size,
  100/435/500/1000/uncapped):** a structural count that legislation moves to one of a fixed
  set of values, here with EXPANSION-gated upper tiers. **Strong #52 corroboration** — #52
  already logs "court legislated DOWN to 5 while physically holding 9-10" and "platform planks
  read 'Set SC to 31'"; THIS thread is the **authoring source for the full enumerated ladder +
  the expansion gates + the per-Pres packing cap**, which #52 referenced but did not enumerate.

### ★ 2. Justice TENURE rules — min-age / retirement-age / term-limit as Legis-Props (POST 1)
- **Min age:** 40-yr & 50-yr minimum age for SC Justices (L-Fed) — an opposed-value option-set.
- **Retirement age:** 70-yr & 75-yr mandatory retirement (L-Prog).
- **★ 8-Year Term Limit for SC Justices Amendment (L-Prog)** — converts life tenure to fixed
  terms; this is the hinge that the elected-judiciary discussion (below) builds on.
- **→ Ties the SCOTUS tenure sub-mechanics in #52 (12-yr min service, compelled-retirement
  gated by age-70 / Integrity) and #251** (the confirmation-anchored drift / retirement rules).
  The min-age items also echo the recurring **"40-Year Minimum Age for SC Justices Amendment"**
  already logged in #52 (seen in `arkzag` ch28 / `nuke`) — this thread is its genre home.

### ★ 3. JUDICIAL REVIEW as a togglable game-state INSTITUTION (POST 1)
- Two mirror-image Legis-Prop amendments gated on opposite states: **Establish Judicial Review
  Amendment** (when "Judicial Review not yet Active") ↔ **Abolish Judicial Review Amendment**
  (when "Judicial Review in effect"). So Judicial Review is a **first-class on/off institution
  flag**, not assumed — and a downstream **#258 predicate** ("Judicial Review in effect" can
  gate other content; here it gates its own abolition).
- **→ Mechanically significant for the whole SCOTUS cluster:** the shipped coin-flip court
  (`phaseRunners.ts:3397`) ASSUMES the court can strike laws; this genre makes that capability
  itself a toggleable, abolishable institution. Cross-ref #52 (rulings→law-deactivation hook —
  which would be GATED on Judicial-Review-active) and #258 (the predicate). No engine home today.

### ★ 4. ELECTED / retention-election JUDICIARY mode (POSTs 2–5) — candidate NEW sub-mechanic
The thread's most-discussed novel idea (strong community interest, explicit
design-for-conflict endorsement):
- **Gov-Action** to make state and/or local judges **elected officials** (POST 2; matthewyoung
  POST 6's "Fill State Judges with Loyalists" is the appointed-counterpart). Then **elected
  Supreme Court Justices** floated (POST 3).
- POST 4 (a member who personally OPPOSES electing judges): *"For game design purposes, I very
  much endorse having the option in there so people can fight over it."* — a deliberate
  put-the-controversy-in-the-game design ruling.
- **★ Concrete mechanic (jvikings1 via POST 5):** *if no term limits → justices elected
  whenever a vacancy opens; **if 8-year terms → 1/4 of the Court is elected every election
  cycle.*** Plus **RETENTION elections** distinct from normal ones: **lose retention → recalled
  from office → another justice appointed-and-retained or outright elected** (POST 5).
- **→ A genuinely NEW selection MODE for the judiciary** (appointed ↔ elected, with retention
  as a third path), and it **composes with the 8-yr-term-limit item (#3 above)** to produce a
  staggered 1/4-per-cycle elected Court. **No existing gap cleanly OWNS "elected-judiciary
  mode."** Nearest homes: **#52** (court composition / how justices arrive — currently
  appoint-then-confirm only), **#251** (judiciary overhaul), **#20** (state/local judge
  election = a Gov-Action). Flag for the consolidation pass to decide new-gap-vs-enrich
  (do NOT number in digest-only mode). Cross-ref the elections engine (#92/#52) since these
  would be a new election TYPE (retention ballots). Cite POSTs 2, 3, 4, 5.

### ★ 5. LOWER-COURT structure — create/abolish institutions + jury control (POSTs 7–9, 1)
- **Create lower courts as institutions:** **Appeals Courts**, **US District Courts**,
  **Admiralty Courts (during wartime)**, **Military Courts (wartime)**, **Military Tribunals**
  (Civil-War / post-war, for officers who fought the other side) (POSTs 7/8). Plus the L-Fed
  **Increase / Decrease # of Lower Court Justices** (gated on "Judiciary Act is active", POST 1).
- **★ Jury control as opposed Gov/Legis pair:** Eliminate trial-by-judge-only (always have a
  jury) ↔ Eliminate trial-by-jury (judge only); **Abolish Juries** (POST 9); plus Future-band
  **Ban Robots / Ban Human-AI-Augmented citizens from juries** (L-Fut, POST 1).
- **Arbitration node (POST 7):** "Ask Court to settle dispute (if all parties agree)… the
  judgeCPU will make a decision" — a CPU-adjudicated arbitration action (a thought, not specced).
- **→ Court-CREATION = office/institution-created-by-law (#66)** (Appeals/District/Admiralty/
  Military courts are new judicial offices/institutions); the increase/decrease-justices and
  ban/mandate-jury items = the **modifier-verb / opposed-pair primitives (#221/#248)**.

### ★ 6. Judiciary Act 1789 = a SPLITTABLE multi-provision bill grouped in committee (POSTs 10, 11)
- Cal (POST 10) + confirmation (POST 11): US District Courts were created by the **Judiciary
  Act of 1789**, so they need not be a standalone item — *"the aspects that made up the
  Judiciary Act of 1789 can be split into separate proposals that just get grouped together in
  committee."*
- **→ The multi-bill PACKAGE/LADDER pattern (#221):** one historical act decomposes into
  several atomic Legis-Props grouped under one committee — same shape as Green-New-Deal →
  ~20-30 atomic bills (`legisprops2028`) and the multi-provision-bill package pattern. The
  **"grouped in committee"** detail is a concrete data-model note: atomic proposals carry a
  shared package/committee grouping key. Confirms the genre's flat "Judiciary (L-Fed)" item is
  shorthand for a decomposable package.

---

## Cross-genre overlaps (flag, do NOT double-count)

- **Crimes/Punishments (`e456b6b3`, batch-40):** POSTs 6–9 carry death-penalty / Jim-Crow-jury
  / sentencing content (Establish Death Penalty + method; black-codes; all-white juries;
  minimum-sentencing) that belongs to the **Crimes** genre, not Courts — vcczar's own enum
  (#248) lists Courts and Crimes/Punishments as SEPARATE subtypes. POST 7/8's "Establish Death
  Penalty for crimes and what method (this may be in another section)" is the author
  acknowledging the boundary. Route death-penalty/jury-discrimination content to #237-Crimes.
- **Court OFFICES (Appeals/District judges) → #66** (institution-created-by-law) and feed the
  officer-roster / appointment machinery (#52 circuit-court roster-development already logs the
  "fill vacant circuit-court judges, +1 Judicial each" sub-mechanic from `redbutton1960`).
- **Reconstruction / Civil-Rights:** POST 6's South-Reconstruction-ended jury/black-code gates
  overlap the Reconstruction (#hd) + Civil-Rights (`9bd91ee2`) genres.

---

## ★ Future-band content + designer ASK (corroborates #206 + #262)

- vcczar opens (POST 1): *"the main ideas I need for Courts are **Era of the Future** Court
  Legis Prop, Gov Actions, or Pres Actions. Overall, I probably need **more Gov Actions**
  regarding courts. Possibly more Pres actions regarding courts."* — explicit per-primitive +
  per-era coverage ASK = direct **#262** (the Gov-Action / Pres-Action / Future bands are thin)
  + **#206** (Future band under-content'd at source). Same coverage hole as Crimes/Healthcare.
- Future (`-Fut`) court content present: Ban Robots from juries; Ban Human-AI-Augmented from
  juries (POST 1, gated on Robot-Rights / Human-AI-Aug-Possible). Community Future pitches:
  **robot justices**; a **Supreme Court for AI run by AI** (POST 9). Theocratic: **Ten
  Commandments as the supreme principle in the Courts** (POST 9). All corroborate #206 (band
  real in design, thin in content) for the Courts axis.

---

## Engine facts (verified, do not re-derive)

- The shipped court is the **coin-flip** (`phaseRunners.ts` ~:3397): 50%/turn picks a `title`
  from a handful of hardcoded strings, rules by raw justice-ideology headcount, nudges
  `partyPreference` ±0.1. **NO court-SIZE variable, NO court-packing, NO min-age/retirement/
  term-limit, NO Judicial-Review institution flag, NO elected/retention-election path, NO
  lower-court (Appeals/District/Admiralty/Military) institutions, NO jury model** — none of
  this thread's structure is modeled (same finding as #52/#218/#249/#251's docket/structure gap).
- `Legislation` (`types.ts`) has **no `subtype` field and no `Preq:`/condition field** → the
  genre's prereq partitions (Judicial-Review-in-effect, US-controls-Philippines, Court-Packing-
  active, Constitutional-Convention-only, Robot-Rights-active) and the "Courts" subtype value
  are unrepresented. The 3 #221 primitives (L/P/G) remain **designed-only, 0% shipped.**
- `EraEvent` is fire-once year-windowed; no institution-flag concept (Judicial-Review on/off),
  no territory-extent predicate, no per-Pres packing-cap counter, no retention-election type.

---

## Candidate deltas for consolidation (map to EXISTING IDs — do NOT assign new numbers)

- **#52 (SCOTUS subsystem — court-size dynamics / packing / tenure)** — CORROBORATE + **★
  ENRICH (primary).** This thread is the **authoring source for the full court-SIZE ladder**
  (Set-No.-of-Justices to 5/6/7/9/10/13, plus **21 & 31 EXPANSION-GATED** on Philippines/Brazil/
  Mexico/Canada and max-expansion), the **court-PACKING bill + the per-Pres CAP** ("Limit to 6
  Extra Per Pres"), and the **tenure rules** (40/50 min-age, 70/75 retirement-age, 8-yr term-
  limit amendment) that #52 references but does not enumerate. Also the **rulings→strike-laws
  capability is itself gated** on the new Judicial-Review-institution flag (below). The shipped
  coin-flip (`phaseRunners.ts:3397`) models none of it. Cite POST 1.
- **#251 (JUDICIARY OVERHAUL — the cluster's design origin, `judiciaryidea`/fd4c3c4e)** —
  CORROBORATE. This "AMPU Courts" thread is a **direct SIBLING content drop from the same
  Apr-2022 wave** as `judiciaryidea` (the #251 origin): same crowdsourcing form, same tagged
  L/G/P + prereq partitions, same `L-Ind-Default`="No Supreme Court" baseline. It supplies the
  COURT-STRUCTURE genre content (size/tenure/Judicial-Review/lower-courts/elected-judges) that
  sits alongside #251's Judicial-Philosophy + Focus-Courts. Cite POSTs 1–11.
- **#258 (predicate-gated availability FIELD)** — CORROBORATE + **★ ENRICH.** Adds two new
  predicate KINDS: **institution-FLAG** (Judicial-Review in-effect / not-active; Court-Packing
  active; Supreme-Court exists/not-active) and **★ territory-ownership / expansion-extent**
  (US-controls-Philippines+Brazil+Mexico+Canada; US-at-MAX-expansion → gate the 21/31 justice
  counts) — the latter ties the court genre to the expansion system (#268). Plus the
  **Constitutional-Convention-ONLY** one-time-window scope and prior-policy chains (Judiciary-
  Act-active → lower-court bills; Court-Packing-active → the cap). Cite POST 1.
- **#255 (variable structural-count CAP pattern, orig. House-size)** — CORROBORATE + extend.
  Court-SIZE (settable to 5/6/7/9/10/13/21/31) is the SAME settable-integer-cap pattern as
  variable House size, here with **expansion-GATED upper tiers** and a **per-Pres packing cap**
  — a 2nd instance of the variable-cap pattern on a different institution. Cite POST 1.
- **#221 (3-primitive content system + scripted-event registry)** — CORROBORATE, still **0%
  shipped.** Fully-worked L/P/G primitives for the Courts genre. ★ ENRICHMENT: the **Judiciary
  Act 1789 decomposes into separate proposals "grouped together in committee"** (POSTs 10/11) —
  a concrete multi-bill PACKAGE with a shared committee-grouping key (same family as Green-New-
  Deal→atomic-bills). Cite POSTs 1, 7, 8, 9, 10, 11.
- **#66 (office/institution lifecycle, created-by-law)** — CORROBORATE + flag overlap. **Create
  Appeals / US District / Admiralty(wartime) / Military(wartime) Courts + Military Tribunals**
  (POSTs 7/8) = lower-court INSTITUTIONS created by law; increase/decrease lower-court justices
  is the count-modifier on them. Reconcile with #52's circuit-court roster sub-mechanic. POSTs 1,7,8.
- **#248 (legis-proposal subtype taxonomy, 33-value enum)** — CORROBORATE. Realizes the
  **"Courts"** value (verbatim in the canonical 33-enum) across L/P/G primitives; the
  death-penalty/jury content (POSTs 6–9) belongs to the SEPARATE **Crimes/Punishments** value
  (author flags the boundary, POST 7/8 "may be in another section"). Cite POSTs 1, 6–9.
- **#206 (Future band doubly-unbuilt) / #262 (per-primitive + per-era coverage)** —
  CORROBORATE (both). vcczar's POST-1 ASK = need **more Era-of-Future** court content + **more
  Gov-Actions** + possibly more Pres-Actions for Courts (the exact #262 coverage dimension);
  community supplies robot justices / AI-run SC / Ten-Commandments-courts / ban-robots-&-
  augmented-from-juries (`-Fut`). Cite POSTs 1, 9.
- **#20 (Governor/officer actions, flat/state-agnostic)** — CORROBORATE (light). **Fill State
  Judges with Loyalists (G-Fed)** + the proposed **Gov-Action to make state/local judges
  elected** (POST 2) are state-scoped Gov-Actions → reinforce the per-state Gov-action upgrade.
- **#218 (Rule of Four / CJ case-refusal)** — touched only (no docket/cert content here; this
  thread is structure, not the case pipeline). `judiciaryidea` (#218's origin) is this thread's
  sibling — note for consolidation, no new datum.

---

## ★ Open item for the consolidation pass (no clean existing ID — flagged, NOT numbered)

- **ELECTED-JUDICIARY mode (appointed ↔ elected ↔ retention)** (POSTs 2–5): a NEW selection
  MODE for state/local judges AND Supreme Court Justices — vacancy-elections (no term limits) or
  **1/4-of-the-Court-per-cycle** (with the 8-yr term-limit item), plus **RETENTION elections**
  (lose retention → recalled → re-appointed-and-retained or outright elected). Composes with the
  #52 tenure rules and introduces a new ELECTION TYPE (retention ballot, ties #92). No existing
  gap OWNS "elected/retention-election judiciary"; nearest homes are **#52** (court composition /
  justice arrival) + **#251** (judiciary overhaul) + **#20** (state-judge-election Gov-Action) +
  the elections engine. Consolidation should decide new-gap vs. enrich-#52/#251. Cite POSTs 2,3,4,5.
- **Judicial Review as a togglable institution FLAG** (POST 1): Establish/Abolish-Judicial-Review
  amendments make the court's strike-laws power an on/off, abolishable institution. The shipped
  court assumes it; #52's ruling→law-deactivation hook would be GATED on this flag. Fold under
  #52 + #258 (predicate target "Judicial Review in effect"); flag whether the institution-flag
  itself needs a home. Cite POST 1.

---

### Provenance notes
- Single chunk; all 11 posts read. Pure design/crowdsourcing log (no die-rolls, no playthrough
  mechanics). vcczar (tier-1) authors the genre + the designer ASK (POST 1); POSTs 2–11 are
  community proposals (jvikings1 the elected/retention-election mechanic via POST 5; matthewyoung
  the lower-court list POSTs 7/8; Cal the Judiciary-Act-1789-splittable note POSTs 10/11). POSTs
  8 & 10 & 11 are quote-replies restating POST 7 / POST 10 — cite the originating post.
- Codebase verified: shipped court = `phaseRunners.ts:3397` coin-flip on hardcoded title strings
  (#52); `Legislation` (`types.ts`) has no `subtype`/`Preq:` field; no court-size variable, no
  court-packing, no min-age/retirement/term-limit, no Judicial-Review flag, no elected/retention
  path, no lower-court institutions, no jury model. The framework (#221/#237/#248/#258/SCOTUS
  cluster #52/#218/#249/#251) remains **0% shipped.**
