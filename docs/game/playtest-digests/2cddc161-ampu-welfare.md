# Digest — "AMPU Welfare" (`2cddc161`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (Apr 2022), **NOT a playthrough.**
**6 posts / 1 chunk** (chunk-001, all covered). Source CSV ~4.5 KB.
**Author/GM:** **@vcczar** (tier-1 designer) posts the genre (POST 1) and issues one
genre-routing ruling (POST 2, Nixon "New Federalism" → block-grant variant). Community
(jvikings1-style contributors et al., tier-4 GAs) pitch additions (POSTs 3–6).
**Why it matters:** the **Welfare** policy genre — one concrete genre in the #237
stateful-policy-genre framework / #221 three-primitive content system. The genre framework
is by now WELL-ESTABLISHED across ~12 sibling drops (Business/Labor #237, subtype/sub-section
enum #248, prereq-gating #258, coverage #262, Future hole #206, program-vs-office lifecycle
#66/#221) — this thread **CORROBORATES** all of those. It is an **UNTAGGED** drop (no `L-/P-/G-`
prefix, no era-band, no `Preq:` blocks — same authoring stage as `healthcare`/`military`/
`expansionism`). Content primitives remain **0% shipped** (verified this run: `Legislation`,
`types.ts:1506–1520`, has only the 4-value `committee` — no `subtype`, no prereq/condition field).

**★ MILESTONE (POST 1):** vcczar opens — *"This is the last policy section."* With Welfare,
the policy-genre content SWEEP (immigration / education / civil-rights / agriculture /
civil-service / diplomacy / healthcare / crimes / military / expansionism / courts / welfare)
is **COMPLETE.** Flag for consolidation as a content-authoring milestone (the genre-instance
pipeline has now ingested its full first pass; what remains is the per-genre tagging pass +
Pres/Gov-Action + Future coverage fill, not new genres).

---

## The Welfare policy genre (the core artifact, POST 1) — UNTAGGED form

vcczar posts ~48 rows under three flat header partitions, no schema tags:
- **Legis Prop** — the dominant primitive, **~45 rows** (POST 1, lines 14–214).
- **Pres Actions** — exactly **1**: "Advocate Returning the Gov't to the States (Dixiecrat)"
  (line 220) — the thinnest Pres-Action count of any genre yet.
- **Gov Actions** — exactly **2**: "Progressive State Welfare System", "Establish State
  Welfare System" (lines 226–230).

No mechanism prefix, no era-band abbreviation, no `Preq:` block — confirms the genre pipeline
ingests raw pre-tag lists that still need the schema-tagging pass (same as `healthcare` 65574aaa).
Era bands + prereqs are IMPLIED by content (Housing-Act-of-1937, Welfare-Reform-of-1996-Act,
Affordable-Genetic-Baby-Act) but are NOT explicit fields here.

---

## ★ NOVEL #1 — Social-Security CREATE→EXPAND→benefit-adjust→PRIVATIZE lifecycle (the #66/Healthcare analogue, sharpened)

The clearest, most complete instance yet of the **staged entitlement-program evolution ladder**
(the same pattern as `healthcare`'s Medicare Create→Expand→Cut, batch-40). One program (Social
Security) appears as discrete rows for each lifecycle STAGE, implying a stateful program model +
per-stage prereq dependency (Expand presupposes Create — the implicit #258 prereq). **Capture the
full ladder** (verbatim titles, POST 1):

| Stage | Rows (POST 1) |
|---|---|
| **CREATE** | Create Soc Sec (138); Create Soc Sec Board (74); Employers Tax to help pay for Soc Sec (66) |
| **EXPAND (coverage classes)** | Expand Soc Sec to include Child Welfare (30) · Disabled Persons (34) · Unemployed (38) · widows & children of premature death (50) · **make it universal** (202) |
| **BENEFIT adjust (raise/lower)** | Increase welfare benefits (26) ↔ Cuts to welfare benefits (22); Raise benefits of social security (206) |
| **PARTIAL → FULL privatize (the terminal ladder)** | Partially privatize soc sec (106) → (POST 5 community) "allow portion of Social Security trust to be invested in the stock market (select mutual funds)" |
| **ELIGIBILITY tightening** | (POST 5) "Only allow Social Security funds to be paid out to those who paid into it (and survivor spouse)"; Increase retirement age to 75 (178) |

★ This is **richer than `healthcare`'s Medicare ladder** because it adds a **benefit-magnitude
sub-axis** (raise↔lower benefits as a repeatable in/decrement, cf. the #221 increase/decrease/
repeal modifier-verb pattern) AND a **graded privatization terminal** (partial → trust-in-market →
full). A flat one-shot flag cannot model it → reinforces #221's program-state requirement + #258
per-stage prereq, and is the **entitlement-PROGRAM twin of the #66 office-lifecycle** (offices vs
programs as evolvable stateful institutions — the two lifecycle patterns should be reconciled).

A parallel mini-ladder: the **public-housing** program runs the same shape — Housing Act of 1937
(42) → Subsidies for slum clearance (110) → Privatize Public Housing (98); and HUD as
increase↔decrease funding (198 ↔ 194, see overlap note).

## ★ NOVEL #2 — Whole-system option-sets (mutually-exclusive end-states) with supersession

Two distinct mutually-exclusive option-sets (classic #248 "one supersedes another", at the
whole-system scale — same as `healthcare`'s Single-Payer/Obamacare/Swiss set):

**(a) Federal-vs-State AUTHORITY axis** — `*-Default`-flavored:
- "Give states full authority over welfare" (18) **vs** federal administration. ★ vcczar RULING
  (POST 2): this is the **Nixon "New Federalism"** lever — *"giving states full authority over
  welfare in the form of **block grants** from the Federal Government,"* and *"could be a potential
  choice for **him only** perhaps"* — i.e. a **president-specific gated** Pres/policy option (a #258
  predicate = specific-incumbent gate; cross-ref the `crimes` per-incumbent prereqs). The two
  Gov-Actions ("Establish State Welfare System" / "Progressive State Welfare System") are the
  per-state arm of this axis (ties #20).

**(b) GUARANTEED-INCOME architecture set** (pick one ⇒ supersedes the rest) — community-sharpened:
- Guaranteed Min Income (214) · Supplementary income for low-income and elderly (58) · Welfare for
  needy families w/ dependent children (54, AFDC) · Wealth redistribution (122).
- ★ POST 3 (jvikings1) proposes splitting the set finer: a **Jobs Guarantee** (a standing
  Democratic proposal) as its own option, and **Nixon's FAP** (means-tested payments to poor
  families) split OFF from a flat **UBI** (flat payment to all) — *"not sure if the nuance is broad
  enough for that split to be warranted"* (an OPEN granularity question: is means-tested vs
  universal one toggle or two?). This is a textbook #248 option-set + #258 supersession on a
  national income-floor architecture.

## ★ NOVEL #3 — "Abolish private property / private welfare" as an authoritarian-kit / nationalize edge (ties #236)

A cluster that pushes past ordinary welfare into the **alternate-government-form / authoritarian-kit**
territory (#236) and the abolish-a-whole-private-sector primitive:
- "Abolish Private Property Amendment" (62); "Wealth redistribution" (122) — the LW-Populist /
  Communist end of the axis (cf. #236 "nationalize sector" + the B/L "Communist→Nationalize Unions"
  prereq).
- "abolish all federal welfare programs (give tax credits and funding to local churches and
  organizations to give a hand up)" (POST 5) **and** "Fund creation of National Church" (118) /
  "Land grant for housing mentally ill" via religious orgs — the **Theocratic / faith-based-welfare
  end** (cf. #236 Theocracy branch; welfare-via-church is the RW-Populist/Traditionalist mirror of
  state welfare). → These are the genre's two extreme end-states (abolish-all-private-property vs
  abolish-all-federal-welfare-route-to-churches); both are #248 terminal option-set members and both
  touch #236's government-form axis. Flag for consolidation; do NOT double-count as new mechanics.

---

## Era-of-the-Future content (corroborates #206 + designer ASK #262)

vcczar opens (POST 1): *"More Era of the Future. I'm about 5,000% certain that Welfare will expand
massively… by 2100"* — explicit designer prediction that the Future band is welfare's biggest
growth area. Future-band rows present (UNTAGGED but content-obvious):
- Affordable Genetic Baby Act (162); Free Housing for All Act (166); Free Transportation for All
  Act (170); Maximal Welfare for Seniors (174).
- Community Future adds (POST 4): **Universal childcare**; **Universal internet** (jvikings-style
  contributor cites COVID-era online-school harm to low-income families as the motivation).
→ CORROBORATES #206 (Future band real-in-design, thin-in-content, explicitly wanted). vcczar's
"welfare expands massively by 2100" is a strong qualitative datapoint that the Future welfare
library is deliberately under-filled at source.

---

## Designer ASK + coverage holes (#262)

vcczar (POST 1): *"More pres actions and gov actions might be helpful. More Era of the Future."*
Direct #262 corroboration on all three recurring per-primitive / per-band holes:
1. **Pres-Actions** — only **1** authored (the single thinnest count across all genre drops).
2. **Gov-Actions** — only **2** authored (the recurring thinnest-primitive pattern).
3. **Era-of-Future** welfare content (explicitly the biggest predicted growth area).
(No explicit "net-new non-repeal Conservative" ASK this thread, BUT the right side is again mostly
cuts/abolitions — Cuts to benefits, Privatize Soc Sec/Housing, Abolish-all-federal-welfare, Work
requirements, Ban drug addicts from welfare — i.e. the same per-ideology skew #262 tracks.)

---

## ★ Cross-genre overlaps — flag, do NOT double-count (these belong to OTHER genres)

Several welfare-list rows are really other genres' content (per the harness routing brief +
the established genre-boundary rulings #248); attribute them to their owning genre/gap, NOT Welfare:
- **Military pensions → Military genre (#221):** "Expand benefits for Veterans" (78); "Additional
  military pensions" (182); "Expand military pensions for injuries not gained in wartime" (186).
- **HUD funding → Civil-Service / office-lifecycle (#66):** "Decrease funding for HUD" (194) ↔
  "Increase funding for HUD" (198) — dept-funding lifecycle, the #66 institution-funding mini-ladder.
- **Native reparations → Civil-Rights / Expansionism (#258/#260):** "Federal Native American
  reparations" (134).
- **Food stamps → Agriculture (#221):** "Food Stamp Program" (190).
- **"Subsidize local law enforcement agencies" (210) → Crimes / Gov-Actions (#20):** the law-
  enforcement-funding lever already captured under the Crimes genre's increase/decrease-LE-funding set.
- **POST 6 (UNANSWERED open Q):** *"Would the reparations for slavery go here?"* — no GM answer in
  thread. Per the `civilrights` boundary ruling (slavery is a sibling top-level genre, NOT Civil-Rights
  sub-tag), slavery reparations most likely route to a Slavery/Civil-Rights genre, NOT Welfare. Record
  as an OPEN routing question for consolidation.

---

## Engine facts (verified this run, do not re-derive)

- `src/types.ts` `interface Legislation` (1506–1520) has the 4-value `committee` and **NO `subtype`,
  NO prereq/condition field** — confirmed. The only `condition`-shaped constructs are
  `opponentConditional` (trait-vote logic, types.ts:732+) and the serializable `Predicate` tree
  (types.ts:1484+) wired ONLY to the 2.4.3 era-event graph; neither can express "program X exists /
  is expanded", "system Y is the active architecture", or "policy Z active" — the program-state /
  prior-policy-active classes this genre needs (same gap as #258).
- No `policyGenre` / `presAction` / `govAction` / `subtype` / `prereq` tokens in `src/` (grepped).
  The three #221 content primitives + scripted-event registry remain **designed-only, 0% shipped**.
- No Social-Security / welfare program-state store, no privatization-stage flag, no prereq engine
  exists in `src/`. → Net: pure design provenance for the Welfare genre; adds NO shipped behavior;
  **enriches** existing 0%-shipped gaps with content + the sharpened program-lifecycle pattern.

---

## Candidate deltas for consolidation (map to EXISTING IDs — do NOT assign new numbers)

- **#237 (stateful policy-genre framework)** — CORROBORATE. Welfare = the **12th and LAST** concrete
  genre instance, in UNTAGGED form (3 flat header partitions, no `L-/P-/G-` prefix, no era band, no
  `Preq:`) → confirms the framework AND that the genre sweep is now COMPLETE. ~48 rows. ★ Record the
  "last policy section" MILESTONE. Source: POST 1.
- **#221 (3-primitive content system + scripted-event registry)** — CORROBORATE, still **0% shipped.**
  Populates all three primitives (L≈45 / **P=1** / G=2 — the thinnest P/G counts captured). ★ SHARPENS
  the program-state requirement: the Social-Security CREATE→EXPAND(coverage classes)→raise/lower-benefit
  →partial-privatize→full-privatize ladder is the most complete entitlement-program lifecycle in the KB
  and CANNOT be a flat one-shot flag. Source: POST 1, 5.
- **#258 (prereq / predicate-gated availability FIELD)** — CORROBORATE. The SS lifecycle (Expand
  presupposes Create), the whole-system supersession (one income-architecture active invalidates the
  others), and especially vcczar's **per-incumbent gate** ("New Federalism… for him [Nixon] only
  perhaps", POST 2) are implicit prereqs with NO explicit `Preq:` here → still demands the prereq field
  + a specific-incumbent predicate class (cf. `crimes` convicted-during-incumbency). Source: POST 1, 2.
- **#248 (legis-proposal subtype taxonomy + hierarchical sub-sections + multi-category tagging)** —
  CORROBORATE + ENRICH. Two textbook mutually-exclusive option-sets (federal↔state authority; the
  guaranteed-income architecture set) + the privatization terminal. ★ The means-tested-vs-universal
  granularity question (POST 3: FAP vs UBI — "is the nuance broad enough to split?") is an open
  subtype-granularity decision. ★ The cross-genre overlaps (military pensions / HUD / food stamps /
  Native + slavery reparations / subsidize-local-LE) are the canonical case for MULTI-CATEGORY tagging.
  Source: POST 1, 3, 6.
- **#262 (content-COVERAGE / per-ideology + per-primitive balance)** — CORROBORATE. vcczar ASK (POST 1):
  more **Pres-Actions** (only 1), more **Gov-Actions** (only 2), more **Era-of-Future**; right side
  again skews to cuts/abolitions/privatizations. Source: POST 1.
- **#206 (Era of the Future doubly unbuilt)** — CORROBORATE + content gap. Future rows present
  (Affordable-Genetic-Baby, Free-Housing/Transportation-for-All, Maximal-Welfare-for-Seniors,
  Universal childcare/internet) + vcczar's "welfare expands massively by 2100" prediction = a strong
  under-content'd-at-source datapoint. Source: POST 1, 4.
- **#66 (office/institution lifecycle, created-by-law)** — CORROBORATE + reconcile. The Social-Security
  PROGRAM lifecycle is the entitlement-program ANALOGUE of the #66 office lifecycle; "Create Soc Sec
  Board" is itself a #66-style institution-creation; HUD increase/decrease funding is the #66 dept-
  funding mini-ladder. Reconcile offices-vs-programs as one evolvable-stateful-institution pattern.
  Source: POST 1.
- **#236 (alternate-government-form axis / nationalize-or-abolish-sector primitive)** — CORROBORATE
  (light). "Abolish Private Property Amendment" + "Wealth redistribution" (the Communist/nationalize
  edge) and "abolish all federal welfare → route to churches" + "Fund creation of National Church"
  (the Theocratic / faith-based edge) are the two government-form extremes of the welfare axis.
  Source: POST 1, 5.
- **Cross-genre overlaps (carry as flag / open routing Q, do NOT double-count):** military pensions →
  Military (#221); HUD → Civil-Service (#66); food stamps → Agriculture (#221); Native reparations →
  Civil-Rights/Expansionism (#258/#260); subsidize-local-LE → Crimes (#20); ★ slavery reparations
  (POST 6, GM-UNANSWERED) → likely Slavery/Civil-Rights genre. Source: POST 1, 6.

---

### Provenance notes
- Single chunk; all 6 posts read. Pure design/crowdsourcing log (no die-rolls, no playthrough
  mechanics, no GM accept/reject ledger). vcczar (tier-1) authors the genre (POST 1) + the one routing
  ruling (POST 2, New-Federalism block-grant variant + "Nixon only" gate); POSTs 3/4/5/6 are community
  proposals (3 = jobs-guarantee + FAP/UBI split; 4 = universal childcare/internet; 5 = SS-trust-in-
  market + pay-in-only eligibility + abolish-federal-welfare-via-churches + enterprise zones; 6 =
  unanswered slavery-reparations routing Q).
- Codebase verified at `src/` HEAD 2026-06-28: `Legislation` (`types.ts:1506–1520`) has no
  `subtype`/prereq field; `Predicate`/`evalPredicate` (`types.ts:1484+`) ship for era events only; no
  policy-genre store, prereq engine, or program-state/privatization-stage model exists. The framework
  (#221/#237/#248/#258/#262/#206) remains **0% shipped** — consistent with every sibling content drop.
