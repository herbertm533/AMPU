# Digest — 9bd91ee2-ampu-civil-rights ("AMPU Civil Rights")

**Type:** CONTENT-AUTHORING thread (Apr 2022), **NOT a playthrough**. 4 posts /
1 chunk (chunk-001, all covered; source CSV ~9.8 KB). Opener: **vcczar** (tier-1)
mass-tagging the community for additions; replies = community content ideas
(Mark_W on an ADA-2.0, OrangeP47-style "cancel culture", and a long POST-4 idea
dump by Timur). **Why it matters:** this is the **raw authoring source for the
Civil Rights policy genre** — a single concrete, *fully tagged* instance of the
**#237 stateful policy-genre framework** populating the **#221 content primitives**
(Legis-Prop / Pres-Action / Gov-Action) with **#248 subtype** = Civil Rights, and
it is the **strongest evidence yet for a prerequisite / conditional-availability
field** in the content schema. Pure design intent — content primitives are
**0% shipped** (per harness: no `subtype`, no Pres/Gov-Action primitive, no
prereq field on `Legislation`).

---

## The artifact — Civil Rights as a #237 policy genre (tagged form)

Unlike the raw/untagged Immigration dump (`8f3fb48a`), this list **carries the
full schema**: every row has a **mechanism prefix** (`L-`=Legislation,
`G-`=Governor Action, `P-`=Presidential Action) + an **era-band abbreviation**,
and the list is **partitioned into a no-prereq block followed by `Preq:`-gated
blocks**. (Scripted/`S-` events explicitly **excluded** — "too many", POST 1.)

**Counts (approx — NOT transcribed in full; see chunk):** ~80 authored rows.
- **Legis-Prop (`L-`)** — the dominant primitive, ~65 rows.
- **Gov Action (`G-`)** — ~9 rows (state-scoped: discriminate vs. secessionists,
  Jim Crow Laws, Make Lynching Illegal, Recognize Gay Marriage, Remove CSA
  Monuments, Give Women Right to Vote, Civil Rights Protections, …).
- **Pres Action (`P-`)** — ~4 rows (Desegregate the Military, Use Federal Force
  to End Jim Crow, and an **opposed stance pair**: Pro-Civil-Rights-over-Liberties
  vs Pro-Civil-Liberties-over-Rights).

### ★ Genre-boundary ruling (capture verbatim intent — POST 1)
vcczar states the **category boundaries** explicitly: **Slavery is its own
category; Immigration is another; Election stuff is another.** "A lot of Civil
Rights things that are about slavery are NOT here." → confirms #237/#248 model a
**partition of policy GENRES**, and that Civil Rights / Slavery / Immigration /
Elections are **sibling top-level genres**, not sub-tags of one. Boundary is
porous in practice (14th/15th Amendment, Reparations, Native-American citizenship
sit in *this* list because they read as civil-rights once slavery is resolved).

### The `*-Ind-Default` baseline pattern (confirms #237 baseline)
The "nothing active" baseline appears tagged **`L-Ind-Default`** under an
`If No … Active` prereq — three instances:
- **"Leave Civil Rights Issues to the States"** — `Preq: If No Civil Rights Legis Active`.
- **"No Bill of Rights"** — `Preq: If No Bill of Rights Exists`.
- (POST 4) **"Ban torture … "** offered under `Preq: No Bill of Rights Exists`.
→ Same baseline-is-a-state design as Business/Labor (#237); `Ind` = Independence-
era band, the genesis era where the default is seeded.

### Opposed-pairs / ban↔legalize↔mandate option-set (confirms #221/#248)
Many entries are deliberate mirror pairs, evidence the content schema wants an
**option-set / negation axis** rather than one-shot flags:
- Ban Conversion Therapy ↔ Subsidize Conversion Therapy (both `L-Ter`).
- Legalize Gay Marriage / Recognize Gay Marriage ↔ Traditional Marriage Amdt /
  LGBT Marriage Amdt / "Allow gay spousal benefits but not marriage".
- Affirmative Action ↔ Ban Affirmative Action ↔ Ban Affirmative Action in Housing.
- Federal Segregation Amendment ↔ Federal Segregation **Ban** Amendment.
- Pro-Civil-Rights-over-Liberties ↔ Pro-Civil-Liberties-over-Rights (`P-Ter` pair).
- POST 4 generalizes the pattern: "Ban/Mandate corporal punishment",
  "Ban/legalize ritual slaughter / circumcision / headscarf / cousin marriage",
  "Ban/Mandate CRT", "Legalize if it gets banned" (adultery).

---

## ★ The prerequisite / conditional-availability system (HEADLINE finding)

The defining mechanic of this drop: **a proposal's availability is gated on a
game-STATE predicate, not the calendar.** Era abbreviations set the *band*; the
`Preq:` clause sets *when within any timeline it can appear*. Representative
predicates (each a distinct kind of game-state query):

| Predicate class | Example `Preq:` clauses (verbatim) |
|---|---|
| **No-policy / baseline** | If No Civil Rights Legis Active; If No Bill of Rights Exists |
| **Prior-event occurred** | Civil War occurred and has ended; Civil War occurred w/ South having seceded; Indian Removal Has Occurred; BLM Protests Have Occurred; Civil Rights Movement Has Occurred; Communist Movement has begun; Fascist Movement has Occurred; Robot Rights / Boom in Sentient Robots Has Occurred |
| **State-condition flag** | Slavery is Abolished; Segregation has not yet been banned nationwide; Gay Marriage is not legal nationwide; Women Cannot Vote Nationwide; Jim Crow is active in ≥1 state; Both Segregation and Poll Tax are Not Illegal; Affirmative Action is Active; Traditional Marriage Amdt is not active |
| **Institution exists** | Dept of Justice Exists; Judicial Dept is active; Federal Public Housing Exists |
| **Prior-legislation active** | CRA of 1964 **and** CRA of 1965 are active (compound AND) |
| **3rd-party status** | Theocratic 3rd Party is Now Major Party; American-Fascist 3rd Party is Now Major Party |
| **Geographic / scenario** | CA Has Not Achieved Statehood; Louisiana Purchase **and** Mexican War have occurred; Population Decline in US and Europe |
| **Scenario-mode gate** | **Constitutional Convention Only** (gates the "early version" founding rows) |
| **Tech/future state** | Human-AI Augmentation Possible; Robot Slavery Banned |

**Engine bearing (load-bearing — verified this run, not re-derived from harness):**
`src/types.ts` **already ships a serializable `Predicate` tree** (`types.ts:1487-1497`:
`all/any/not`, `yearAtLeast/atMost`, `eventCompleted`, `eventChose`,
`meterAtLeast/atMost`, `interestAtLeast`, …) with a pure `evalPredicate(snap,pred)`
interpreter — **but it is wired ONLY to the 2.4.3 era-event graph**, NOT to
`Legislation`. The `Legislation` interface (`types.ts:1506-1514`) has the 4-value
`committee` field and **NO `subtype`, NO prereq/condition field**. So the
machinery the prereq system needs *partly exists* — the requirement is to (a) add
a predicate/condition field to the content-primitive schema and (b) extend the
predicate vocabulary with the **state-flag / institution-exists / prior-legislation-
active / 3rd-party-status** classes above (none of which the current `Predicate`
enum can express). This is concrete schema input for #221 / #248.

---

## Era-band coverage (corroborates #92 / #206 / #116)

Era abbreviations seen across the rows: **Fed**(eralism), **Gild**(ed Age),
**Nat**(ionalism), **Neo**(?-conservative/Reagan), **Norm**(alcy), **Pop**(ulism),
**Prog**(ressive), **Ter**(ra), **Fut**(ure), **Nuc**(lear), **Ide**(ologies),
**Man**(ifest Destiny?), **Ind** (Independence — used for `*-Default` baselines).
This is a **13-band span** — corroborates the multi-era content-band model and the
era-table reconciliation work (#92/#116/#206). The **`Ter`/`Fut`** rows (Ban
Conversion Therapy, transhumanist/robot rights, microchipping, Human-AI
augmentation, Full Citizenship for Robots) are squarely **Era-of-the-Future**
content (#206).

---

## Designer ASK + community content (open coverage gaps)

**vcczar's explicit ASK (POST 1) — record as content-coverage gap:**
1. **Era-of-the-Future civil-rights (or anti-civil-rights) legislation** is thin
   and wanted.
2. Wants **more Traditionalist / RW-Populist / Conservative civil-rights
   legislation that is NOT merely a repeal** of an existing progressive item
   (a balance/coverage hole — the conservative side is currently mostly negations).

**Community additions (candidate content, not yet accepted):**
- Mark_W (POST 2): an **ADA-2.0** for the Future era (strip ADA's optional/
  grandfather clauses → mandatory).
- OrangeP47 (POST 3): anti-"cancel-culture" legislation; more RW-populist items.
- Timur (POST 4): large dump — euthanasia, gender quotas, secularism (remove
  God-symbols), adultery/cousin-marriage/polygamy ban-or-legalize, creation/
  evolution teaching, **animal/plant rights** (zoos illegal, mandatory
  vegetarianism, ritual slaughter, circuses), social-media-extremism regulation,
  Native-American reparations, tax/ban religion, define cultural appropriation a
  hate crime.
- **★ Monument-building proposals (flag — overlaps #256):** POST 4 adds
  3rd-party-gated **monument/bust authorizations** — busts of Booker T. Washington
  & G.W. Carver on Capitol Hill (historical: Rep. McDonald); `Preq: Theocratic
  3rd Party Major` → monuments to Christian/Biblical figures; `American-Fascist
  3rd Party Major` → monuments to fascists; `Communist Movement begun` → monuments
  to communists. These are **prestige/vanity-infrastructure content** = the same
  homeless type as batch-37 **#256 National Projects/Monuments**, here arriving
  as **prereq-gated Civil-Rights-genre rows** → cross-genre overlap to reconcile.

---

## Shipped-vs-designed (engine facts — `Legislation` verified this run)

- **No `subtype` field on `Legislation`** (`types.ts:1506-1514`) → the #248 Civil
  Rights subtype value is unrepresented; only the 4-value `committee` exists.
- **No prereq/condition field on `Legislation`** → the entire `Preq:` system above
  has no engine home. A `Predicate` tree + `evalPredicate` DOES exist
  (`types.ts:1487-1497`) but is bound to era events only and **lacks the predicate
  classes** this genre needs (state-flags, institution-exists, prior-legislation-
  active, 3rd-party-status).
- **Pres-Action & Gov-Action primitives = designed-only (#221, 0% shipped)** —
  the ~4 `P-` and ~9 `G-` rows have no type/catalog.
- Civil Rights / Slavery / Immigration / Election as **sibling genres** is a
  taxonomy assertion with no shipped representation.

→ Net: pure design provenance for the Civil Rights genre. Adds NO shipped
behavior; **enriches** existing 0%-shipped gaps with concrete content + the
clearest evidence yet that the content schema needs a **predicate/condition field**
(and a richer predicate vocabulary than the era-event one).

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs; consolidation agent owns the gap-log write. No new
numbers assigned.)*

- **#237 (stateful policy-genre framework)** — CORROBORATE + ENRICH. Civil Rights
  is a concrete genre instance in **fully-tagged** form (mechanism prefix + era
  band + `Preq:` blocks + `*-Ind-Default` baseline). **Genre-boundary ruling
  (POST 1):** Slavery / Immigration / Elections are **sibling top-level genres**,
  not sub-tags of Civil Rights. ~80 rows. Source: POST 1.
- **#221 (content primitives)** — CORROBORATE + **sharpen the schema**: the
  primitive needs a **predicate/condition field** (the `Preq:` clause) and an
  **option-set / ban↔legalize↔mandate↔negate axis** (the opposed pairs). Populates
  all three primitives (L≈65 / G≈9 / P≈4). Source: POST 1.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE. Implies a **Civil
  Rights** subtype value, applied across L/G/P primitives. Source: POST 1.
- **★ Prerequisite / conditional-availability system** — this is the headline.
  Map to the **game-state-keyed (NOT calendar-keyed) content cluster (#92 / #241 /
  #247)** AND to **#221** (prereqs belong in the content primitive's schema).
  **NEW concrete requirement:** a predicate/condition field on content primitives,
  with a vocabulary covering no-policy-baseline / prior-event-occurred /
  state-flag / institution-exists / prior-legislation-active(compound AND) /
  3rd-party-status / geographic-scenario / scenario-mode / tech-state. **Engine
  note (verified):** a `Predicate` tree + `evalPredicate` already ships for era
  events (`types.ts:1487-1497`) but is NOT on `Legislation` and cannot express
  these classes → reuse-and-extend opportunity for tech-lead. Source: POST 1.
- **#92 (eras as game-state bands, not calendar)** — CORROBORATE strongly. The
  `Preq:`-gated availability is the canonical expression of "content keyed to
  game-state, not the year." Source: POST 1.
- **#206 (Era of the Future doubly unbuilt)** — CORROBORATE + content gap.
  Future-band rows exist (robot/transhumanist/AI-augmentation civil rights) but
  vcczar explicitly says **more Future civil-rights content is needed** (POST 1).
  Source: POST 1/2.
- **#116 / multi-era band reconciliation** — CORROBORATE. 13 era abbreviations
  (Fed…Fut incl. Man, Ide, Norm, Neo) feed the era-table reconciliation. Source: POST 1.
- **#256 (National Projects / Monuments content shape)** — CORROBORATE + **flag
  cross-genre overlap**: POST 4's **monument/bust authorization proposals**
  (Booker T. Washington/Carver busts; 3rd-party-gated Christian/fascist/communist
  monuments) are #256-type prestige-infrastructure content arriving as
  prereq-gated Civil-Rights rows — the two gaps must be reconciled (is "build a
  monument" a Civil-Rights Legis-Prop, or a National-Projects primitive invoked
  by a civil-rights prereq?). Source: POST 4.
- **Content-coverage / balance (carry as open question)** — vcczar ASK (POST 1):
  conservative/Traditionalist/RW-Pop civil-rights content is **mostly repeals**;
  needs net-new non-repeal conservative items. A genre-balance hole; no single
  existing gap owns "per-ideology content coverage" — flag to consolidation /
  roadmap. Source: POST 1.

---

### Provenance notes
- Single chunk; all 4 posts read. One-sided **idea dump**: POST 1 (vcczar's tagged
  master list + the genre-boundary ruling + the designer ASK) is the load-bearing
  datum; POSTs 2–4 are community content adds (no accept/reject log). No playthrough
  mechanics, no GM rulings beyond the category-boundary statement.
- `Legislation` shape, the absence of `subtype`/prereq, and the era-event-only
  `Predicate`/`evalPredicate` machinery were **verified against `src/types.ts`
  this run** (lines 1487-1497, 1506-1514); other shipped-status claims (#221 0%
  shipped) taken from harness context.
