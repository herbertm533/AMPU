# Digest — 65574aaa-ampu-healthcare ("AMPU Healthcare")

**Type:** CONTENT-AUTHORING thread (Apr 2022), **NOT a playthrough**. 3 posts /
1 chunk (chunk-001, fully covered; source CSV ~4.5 KB). Opener: **vcczar**
(tier-1) mass-tagging the community for additions; the two replies are tiny
(vcczar self-comment + one community add). **Why it matters:** the raw authoring
source for the **Healthcare policy genre** — the 4th policy-genre drop, so it
**CORROBORATES the established framework** (#237 genre / #248 subtype / #221
primitives / #258 prereq field / #262 coverage / #206 Future) rather than
re-deriving it. Its standout value is in three NOVEL patterns: an **abortion
sub-cluster** that may warrant its own subtype, a **program create→expand→cut
LIFECYCLE ladder** (a #66-style lifecycle but for entitlement programs), and a
set of **mutually-exclusive whole-system designs**. Pure design intent — content
primitives are **0% shipped** (`Legislation` has no `subtype`, no prereq field;
no Pres/Gov-Action primitive; verified this run, types.ts:1506–1514).

---

## The artifact — Healthcare as a #237 policy genre (UNTAGGED form)

**★ Notable difference from the civil-rights drop (`9bd91ee2`):** this list is
**RAW / UNTAGGED.** Unlike the fully-schema'd Civil Rights list, the rows here
carry **no mechanism prefix** (`L-`/`P-`/`G-`), **no era-band abbreviation**, and
**no `Preq:` blocks** — the only structure is **three flat header partitions**:
`Legis Prop:`, `Pres Actions:`, `Gov Actions:` (POST 1). So Healthcare lands at
an earlier authoring stage than Civil Rights — confirms the #237/#221 model but
shows the genre pipeline has untagged inputs that still need the prefix/era/prereq
pass. (Era bands and prereqs are implied by content — e.g. "Robot Era…", "Create
Independent VA Dept." — but are NOT explicit fields here.)

**Counts (approx — NOT transcribed in full; see chunk):** ~70 authored rows.
- **Legis-Prop** — the dominant primitive, ~65 rows (POST 1, lines 14–290).
- **Pres Actions** — exactly **3**: OSHA, Mexico City Policy, Block Federal
  Funding for Planned Parenthood (lines 292–304).
- **Gov Actions** — exactly **2**: Abortion Restrictions, State Healthcare
  (lines 306–314).

### Genre-boundary note (corroborates #237 sibling-genre model)
Healthcare reads as a sibling top-level genre alongside the others. Cross-genre
overlaps are explicit in the rows (flag for consolidation, do NOT double-count):
- **Veterans/VA → Civil-Service (#66) + Military:** "Create Independent Veterans
  Affairs Dept." (= #66 Dept-of-VA office-creation), "National Healthcare for
  Disabled Military Veterans", "Privatize Veterans Healthcare".
- **Military draft:** "Increase allowable medical reasons for avoid the draft"
  (line 290) overlaps the Military/conscription genre.
- **Founding-era seed:** "Create the Marine Hospital Service" / "Federal Aid and
  Welfare for Disabled Mariners" — the 1798 historical genesis of federal health
  care; an Independence/Federalism-band root for the genre.

---

## ★ NOVEL #1 — Abortion as a distinct sub-cluster / candidate SUBTYPE

A large, internally-coherent cluster of abortion items, almost all in **opposed
pairs** — strong evidence it may want to be its **own #248 subtype (or its own
#237 genre)** rather than a flat "Healthcare" tag. **Flag for consolidation:
genre-vs-subtype decision.** (Note its natural sibling is Civil Rights, where
gay-marriage/conversion-therapy pairs already live — abortion may belong to a
shared "social/bodily-rights" axis.) Verbatim pairs/items (POST 1):

| Opposed pair / item | Lines |
|---|---|
| Abortion Ban (rare exceptions) Amendment ↔ Right to Choose Abortion Amendment | 86, 234 |
| Legally Define Human Life at Conception Ban Amendment | 146 |
| Ban Fed Gov from Interfering in **State** Abortion Policy Amdt ↔ Grant President Power to Enforce Women's Right to an Abortion | 114, 166 |
| Apply abortion services to national healthcare ↔ same but only in life/death emergencies | 218, 222 |
| Mexico City Policy *(P)*; Block Federal Funding for Planned Parenthood *(P)*; Abortion Restrictions *(G)* | 300, 304, 310 |

→ The abortion cluster spans all THREE primitives (Legis-Prop + the only
content-rich Pres-Actions + a Gov-Action), reinforcing that it is a self-standing
policy axis with a full mechanism spread.

## ★ NOVEL #2 — Program create→expand→cut LIFECYCLE ladder

A **staged entitlement-program evolution ladder** — analogous to the #66 office
lifecycle but for programs. The same program appears as discrete rows for each
lifecycle stage, implying a **prereq/stateful dependency** (Expand presupposes
Create; the prereq field is implicit here, see #258). **Capture the pattern:**

- **CREATE:** Create Medicare (274) · Create Medicaid (278).
- **EXPAND:** Expand Medicare (82) / Expand Medicaid (78); Add Catastrophic
  Coverage to Medicare (102); Add Prescription Drug Coverage to Medicare (106);
  Expand Medicare to Cover Vision (158); Expand Medicare to Cover Hearing (162).
- **CUT / DEVOLVE:** Cut Medicare (94) / Cut Medicaid (90); Have States Take Over
  Medicaid Subsidized by Federal Gov't (134).
- **TERMINAL / SUPERSEDE:** Medicare for All (cut out insurance programs) (154).
- **Dept-funding lifecycle (parallel mini-ladder):** Increase / Decrease Dept of
  Health Funding (282, 286).

→ This is the **clearest evidence yet** that #221 content primitives need a
program-state model + per-stage prereqs (#258): a flat one-shot flag can't model
Create→Expand→Cut. (Mirrors the #66 office create/evolve lifecycle.)

## ★ NOVEL #3 — Competing whole-system designs (mutually-exclusive end-states)

A set of **mutually-exclusive national-system architectures** — picking one
supersedes the others; classic #248 opposed/option-set, but at the
whole-system scale. Each is a distinct end-state design:

- **Single-Payer Universal Healthcare** (142)
- **Obamacare** (214)
- **Mandatory Private Insurance like Switzerland** (POST 3 community add) ≈
  "Issue mandatory, universal healthcare through existing private insurance
  system" (74)
- **Employer mandate** — "Require employers to cover healthcare of employees"
  (98)
- **Public option** — "Create a Gov Run Health Insurance to Compete with Private
  Insurance" (230)
- **Mandates w/ vs w/o penalty pair:** "National Healthcare Mandate w/o Financial
  Penalty" (46) ↔ "Mandate National Health Insurance Via Penalty" (238)

→ These are option-set rows where one architecture is the active state and the
rest are invalid while it holds → reinforces #248's "one supersedes another" +
#258 prereq gating. Note **POST 2 (vcczar):** the Swiss/private-mandate design
"satisfied some of my insane ramblings as an industry insider… where I think
we're headed" — designer flagging this as a deliberately-modeled real direction.

---

## Era-of-the-Future content (corroborates #206)

Squarely Future-band rows present (and a designer ASK wants MORE, see below):
- Robot Era Social Welfare and Healthcare Package (254)
- Fund / Ban Human Cloning (258 / 22) — opposed pair
- Fund / Ban Human-AI Augmentation (262 / 18) — opposed pair
- Subsidize Cure for Cancer (266); Make Obesity a Criminal Offense (270)
- Adjacent-future: Legalize Euthanasia Nationwide (246); Ban Reverse Sex Change
  Surgery (242); provide federal funding for stem cell research (210)

→ CORROBORATES #206 (Era-of-Future content exists but is thin/under-built and
explicitly requested). The Fund↔Ban cloning/augmentation pairs also feed the
#221/#248 opposed-axis.

---

## Designer ASK + community content (open coverage gaps — #262)

**vcczar's explicit ASK (POST 1, line 10) — record as content-coverage gap (#262):**
"Areas of need are **gov actions, pres actions, Era of the Future, and possibly
things that conservatives, traditionalists, and RW pops would like that aren't
repeals**." → Same coverage holes as the civil-rights drop:
1. **More Gov-Actions** (only 2 authored) and **Pres-Actions** (only 3).
2. **More Era-of-Future** healthcare content.
3. **Net-new (non-repeal) Conservative / Traditionalist / RW-Populist** content —
   the right-leaning side is currently mostly negations/cuts (Cut Medicare,
   Privatize VA, Ban Fed interference, abortion bans) rather than affirmative
   conservative healthcare proposals.

**Community additions (candidate content, not an accept/reject log):**
- POST 2 — vcczar self-endorses the private-mandate (Swiss) direction.
- POST 3 — one community member: "Mandatory Private Insurance like they have in
  Switzerland" (the named real-world model for the employer/private-mandate
  end-state above).

---

## Shipped-vs-designed (engine facts — verified this run)

- **No `subtype` field on `Legislation`** (`types.ts:1506–1514`; only the 4-value
  `committee`) → the #248 "Healthcare" (and candidate "Abortion") subtype values
  are unrepresented.
- **No prereq/condition field on `Legislation`** → the lifecycle ladder
  (Create→Expand→Cut) and the mutually-exclusive whole-system gating have no
  engine home. A serializable **`Predicate` tree + `evalPredicate` DOES ship**
  (`types.ts:1487–1504`) but is **bound to the era-event graph only**, and its
  vocabulary (`yearAtLeast`, `eventCompleted`, `meterAtLeast`, `stateAdmitted`,
  `flag`, …) **cannot express** "program X exists / is expanded", "system Y is the
  active architecture", or "policy Z active" — i.e. the state-flag /
  prior-legislation-active classes this genre needs (same gap as #258). Reuse-and-
  extend opportunity, not a from-scratch build.
- **Pres-Action & Gov-Action primitives = designed-only (#221, 0% shipped)** — the
  3 `P` and 2 `G` rows have no type/catalog.
- **Untagged authoring stage:** rows lack mechanism prefix / era band / `Preq:`
  (vs. the tagged civil-rights drop) → the genre pipeline ingests raw lists that
  still need the schema-tagging pass.

→ Net: pure design provenance for the Healthcare genre. Adds NO shipped behavior;
**enriches** existing 0%-shipped gaps with concrete content + three novel
structural patterns (abortion sub-cluster, program lifecycle ladder, competing
whole-system option-set).

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs; consolidation agent owns the gap-log write. No new
numbers assigned.)*

- **#237 (stateful policy-genre framework)** — CORROBORATE. Healthcare is a 4th
  concrete genre instance, here in **UNTAGGED** form (3 flat header partitions, no
  `L-/P-/G-` prefix, no era band, no `Preq:`) → confirms the framework AND shows
  it ingests raw, pre-tag inputs. ~70 rows. Source: POST 1.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE + **★ candidate new
  subtype value(s)**: a "Healthcare" subtype, and **flag a genre-vs-subtype
  decision for the abortion sub-cluster** (~7+ opposed-pair items spanning L/P/G —
  may warrant its own subtype, or its own #237 genre, or a shared social/bodily-
  rights axis with Civil Rights). Also the **mutually-exclusive whole-system
  option-set** (Single-Payer / Obamacare / Swiss-private / employer-mandate /
  public-option) is a textbook #248 "one supersedes another" set. Source: POST 1, 3.
- **#221 (content primitives)** — CORROBORATE + **sharpen schema**: populates all
  three primitives (L≈65 / P=3 / G=2) and surfaces the **program create→expand→cut
  LIFECYCLE** requirement — primitives need a program-state model + per-stage
  dependency, not flat one-shot flags. Source: POST 1.
- **#258 (prereq / predicate-gated availability field)** — CORROBORATE strongly.
  The lifecycle ladder (Expand presupposes Create) and the whole-system
  supersession are implicit prereqs with NO explicit `Preq:` here → still demands
  the prereq field. **Engine note (verified):** `Predicate`+`evalPredicate` ship
  for era events only (`types.ts:1487–1504`) and lack the "program-exists /
  policy-active / system-is-active-architecture" predicate classes → reuse-and-
  extend. Source: POST 1.
- **#262 (content-coverage / per-ideology balance)** — CORROBORATE. vcczar ASK
  (POST 1): wants more **Gov-Actions** (only 2), **Pres-Actions** (only 3),
  **Era-of-Future** healthcare, and **net-new non-repeal Conservative/Trad/RW-Pop**
  content (right side is currently mostly cuts/negations). Source: POST 1.
- **#206 (Era of the Future doubly unbuilt)** — CORROBORATE + content gap.
  Future-band rows present (Robot-Era welfare pkg, Fund/Ban Cloning, Fund/Ban
  Human-AI Augmentation, Cure-for-Cancer subsidy, criminalize obesity) but more is
  explicitly wanted. Source: POST 1.
- **#66 (office/institution lifecycle, created-by-law)** — CORROBORATE + **flag
  cross-genre overlap**: "Create Independent Veterans Affairs Dept." is a #66
  office-creation arriving as a Healthcare row; and the **program lifecycle ladder
  is the entitlement-program analogue of the #66 office lifecycle** — the two
  lifecycle patterns should be reconciled (offices vs programs as evolvable
  stateful institutions). Source: POST 1.
- **Cross-genre overlaps (carry as open question / flag, do NOT double-count):**
  VA/veterans rows → Civil-Service (#66) + Military; "Increase allowable medical
  reasons to avoid the draft" → Military/conscription genre. Source: POST 1.

---

### Provenance notes
- Single chunk; all 3 posts read. One-sided **idea dump**: POST 1 (vcczar's
  untagged master list + the partition headers + the designer ASK) is the
  load-bearing datum; POST 2 (vcczar self-comment endorsing the Swiss/private
  direction) and POST 3 (one community add: Swiss mandatory-private model) are
  minor. No playthrough mechanics, no GM rulings, no accept/reject log.
- `Legislation` shape, the absence of `subtype`/prereq, and the era-event-only
  `Predicate`/`evalPredicate` machinery were **verified against `src/types.ts`
  this run** (lines 1487–1504, 1506–1514); other shipped-status claims (#221/#237/
  #248/#258 at 0% shipped) taken from harness context.
