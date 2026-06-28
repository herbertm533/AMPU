# Digest — "AMPU Regulations" (`d4cd2ee6`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread, **NOT a playthrough.**
**2 posts / 1 chunk** (chunk-001, all covered). Source CSV ~3.3 KB.
**Author/GM:** **@vcczar** (tier-1 designer) posts the genre (POST 1, the standard
`@`-roster + *"Main area of need is Era of the Future"* opener); one community
contributor adds in POST 2 (the EPA-tiers idea).
**Why it matters:** the **Regulations** policy genre — another concrete instance of the
#237 stateful-policy-genre framework / #221 three-primitive content system. The framework
is by now WELL-ESTABLISHED across the sibling drops (#237 / #248 / #221 / #258 / #262 / #206)
— this thread **CORROBORATES** all of them and is an **UNTAGGED** drop (no `L-/P-/G-` prefix,
no era-band tag, no `Preq:` blocks — same authoring stage as `welfare`/`healthcare`/`military`).
Content primitives remain **0% shipped** (`Legislation`, `types.ts:1506–1520`, still has only the
4-value `committee` — no `subtype`, no prereq/condition field).

---

## ★ MILESTONE CORRECTION (flag PROMINENTLY for consolidation)

batch-41 (`2cddc161-ampu-welfare`) recorded a milestone that *"Welfare was the 12th & LAST
policy-genre drop; the content sweep is COMPLETE."* **That is WRONG.** **Regulations is an
ADDITIONAL genre** beyond the 12, and the sibling batch-42 `beb258f9-ampu-banking` is **yet
another** (with a **Currency** subtype). So the policy-genre corpus is **NOT complete at 12.**
- **Soften the b41 "sweep complete / 12th-and-last" claim** to: *"the major policy genres are
  largely captured, but MORE remain — Regulations, Banking, Currency, … (the threads reference
  others still)."*
- Note the corpus already named Currency + Copyright genres back at #237's origin (`businesslabor`
  POST 15/17/22), so a hard "12 and done" count was never right. The genre framework is open-ended;
  the genre-INSTANCE pipeline is still ingesting.

---

## The Regulations policy genre (the core artifact, POST 1–2) — UNTAGGED form

vcczar posts under three flat header partitions, no schema tags:
- **Legis Prop** — the dominant primitive, **~55 rows** (POST 1, lines 14–254).
- **Pres Actions** — **5** (POST 1, lines 256–276).
- **Gov Actions** — **1** (POST 1, lines 278–282) + the POST-2 EPA additions arguably Legis/Gov.

No mechanism prefix, no era-band abbreviation, no `Preq:` block — confirms the genre pipeline
still ingests raw pre-tag lists awaiting the schema-tagging pass. Era bands + prereqs are IMPLIED
by content (Sherman/ICC = Gilded/Prog; Dodd-Frank/Sarbanes-Oxley = Modern; robots/telepathy/
designer-babies = Future) but are NOT explicit fields.

**Shape (verbatim sampling, POST 1):**
- **Antitrust spine:** Sherman Antitrust Act · Interstate Commerce Act · Clayton Antitrust Act ·
  FTC · Interstate Commerce Commission · Close monopoly loopholes · Breakup Monopolies/Cartels/
  Trusts · Bust Highest Profile Monopoly.
- **Regulate-an-industry pattern (recurring axis):** airlines · trucking · railroads · telephone
  co. · communications · internet · driverless cars · flying cars · 3-D printing · data encryption ·
  busing · meat-making/sanitation · robots.
- **Regulatory-agency creations (#66-style institutions):** SEC · FDA (Pure Food & Drug Act) ·
  ICC/FTC; **Budget and Accounting Act**; **Nelson Act**.
- **Nationalize-an-industry pattern (recurring axis):** RR (incl. *Temporarily nationalize RR
  during wartime*) · airlines · shipping & transportation · state & private banks · state police
  forces · "all sectors of the economy" · "all sectors of society."
- **Modern named acts:** Dodd-Frank · Sarbanes-Oxley · increase penalties on Wall Street.
- **Pres Actions (5):** ★ **Regulate Cryptocurrency via Fed** · **Pro-Regulation Policy** ↔
  **Pro-Deregulation Policy** (an opposed pair — the genre's `*-Default`-flavored two-pole lever) ·
  Bust Highest Profile Monopoly · Use presidential influence to break up monopolies.
- **Gov Actions (1):** Strict business and environmental regulations.

---

## ★ NOVEL — EPA staged/escalating regulation TIERS (POST 2)

A community contributor proposes (POST 2, verbatim):
> *"EPA: clean air, clean water regulations (like to see. **Level 1, 2, 3 .. for some regulations
> so they can be added to be more strict and repealed in stages**)"* + "Allow (or forbid) logging
> in National Forests" + "wetlands."

This is a **multi-level escalating-then-rollback policy LADDER** — a *graduated intensity tier*
model distinct from the binary enact/repeal flag. Levels can be **ADDED to be more strict** and
**REPEALED in stages** (ratchet up, ratchet down). Relates to but is NOT identical to the program
CREATE→EXPAND→CUT lifecycle (#66/#221, the `welfare`/`healthcare` analogue): that ladder evolves a
*program's scope/coverage classes*; this is graduated **regulatory STRINGENCY tiers** on a single
standing regulation (clean air / clean water / wetlands / logging). A flat one-shot flag cannot
model it → **candidate content-system requirement**: a leveled (`Level N`) intensity field with
step-up/step-down transitions. Cross-ref **#221** (program-state requirement) — flag for
consolidation as a distinct graduated-intensity variant of the stateful-policy primitive.

---

## Anti-monopoly / nationalize as opposed axes; "Protect Monopolies Amendment" = the opposed pole

- **Anti-monopoly** runs from regulate → bust → break-up; its OPPOSED pole is the
  **"Protect Monopolies Amendment"** (line 250) — the genre's pro-trust terminal, mirroring the
  Pro-Regulation↔Pro-Deregulation Pres-Action pair. Textbook #248 opposed/mutually-exclusive set.
- **Nationalize-a-sector** is a recurring LW-Populist axis (RR / airlines / shipping / banks /
  police / "all sectors") → ties **#236** (nationalize-or-abolish-sector primitive / alternate-
  government-form axis); cf. the `welfare` "Abolish Private Property" Communist edge.

---

## Era-of-the-Future content (corroborates #206 + designer ASK #262/#206)

vcczar opens (POST 1): *"Main area of need is Era of the Future."* Heavy Future-band rows present
(UNTAGGED but content-obvious): Ban Robot Technology · Robot Regulations · increase penalties for
hiring more robots than humans / buying robot parts abroad · Regulate driverless cars · Regulate
flying cars · Mandate self-driving cars (ban human-driven) · Ban genetically engineered designer
babies / Regulate genetically engineered baby industry · Ban cloning of extinct/near-extinct
creatures · Ban transhumanism · Ban AI-augmented-human invasive advertising · Ban most algorithms ·
**Ban & criminalize non-consensual telepathy** · **Ban social media from creating sovereign
nations** · **Criminalize misinformation by news/social-media outlets** · Regulate the internet ·
Strictly regulate 3-D printing · Regulate data encryption · **Regulate Cryptocurrency via Fed**
(Pres-Action). → CORROBORATES **#206** (Future band real-in-design, the explicitly-wanted area) and
the **#262/#206 designer ASK** for more Era-of-the-Future content. This is one of the richest
Future-content genres yet (transhumanism/telepathy/robots/social-media-states).

---

## ★ Cross-genre overlaps — flag, do NOT double-count (these belong to OTHER genres)

- **Expand drilling on federal land / offshore** (lifting restrictions) → **Oil&Gas / Environment**
  genre (the deregulate-extraction lever), NOT Regulations proper.
- **Allow/forbid logging in National Forests · wetlands · EPA clean-air/water** (POST 2) →
  **Environment** genre overlap (the EPA-tier idea is environment-flavored).
- **Regulate meat-making / sanitary standards** + **FDA (Pure Food & Drug Act)** → **Agriculture**
  (#221) overlap.
- **Restrict Gov's Ability to Wiretap US Citizens** → **Crimes/Punishments** (#20) overlap (civil-
  liberties / surveillance lever).
- **Regulate Cryptocurrency via Fed** + **Nationalize state & private banks** → **Banking/Currency**
  genre (sibling batch-42 `beb258f9`) overlap.
- These are the canonical case for **MULTI-CATEGORY tagging** (#248). Attribute to owning genre.

---

## Engine facts (verified this run, do not re-derive)

- `src/types.ts` `interface Legislation` (1506–1520) has the 4-value `committee` and **NO `subtype`,
  NO prereq/condition field, NO level/tier field** — confirmed. No `Level N` / graduated-intensity
  construct anywhere in `src/`. The only `condition`-shaped constructs are `opponentConditional`
  (trait-vote logic) and the serializable `Predicate` tree wired ONLY to the 2.4.3 era-event graph;
  neither can express "policy active at level N" or "prior policy active."
- No `policyGenre` / `presAction` / `govAction` / `subtype` / `prereq` tokens in `src/`.
  The three #221 content primitives + scripted-event registry remain **designed-only, 0% shipped.**
- Net: pure design provenance for the Regulations genre; adds NO shipped behavior; **enriches**
  existing 0%-shipped gaps with content + the novel graduated-intensity (EPA-tier) requirement.

---

## Candidate deltas for consolidation (map to EXISTING IDs — do NOT assign new numbers)

- **#237 (stateful policy-genre framework)** — CORROBORATE. Regulations = **another** concrete genre
  instance (UNTAGGED, 3 flat header partitions). **★ CORRECTS the b41 milestone:** the corpus is
  NOT complete at 12 — Regulations + Banking (+ Currency subtype) are ADDITIONAL genres; soften
  "sweep complete / 12th-and-last" to "major genres largely captured, more remain." Source: POST 1.
- **#221 (3-primitive content system + scripted-event registry)** — CORROBORATE, still **0% shipped.**
  Populates all three primitives (L≈55 / **P=5** / **G=1**). **★ SHARPENS** the program-state
  requirement with a NOVEL variant: the **EPA `Level 1/2/3` escalate-then-repeal-in-stages** ladder
  (graduated regulatory INTENSITY tiers, distinct from create→expand→cut scope evolution) — a flat
  one-shot flag cannot model it. Source: POST 1, 2.
- **#248 (legis-proposal subtype taxonomy + hierarchical sub-sections + multi-category tagging)** —
  CORROBORATE + ENRICH. Opposed/mutually-exclusive sets: **Pro-Regulation ↔ Pro-Deregulation**
  (Pres-Action pair) and **anti-monopoly ↔ "Protect Monopolies Amendment."** The regulate-X-industry
  and nationalize-X-industry families are sub-section patterns. Heavy cross-genre overlap (drilling/EPA
  → Environment/Oil&Gas; meat/FDA → Agriculture; wiretap → Crimes; crypto/banks → Banking) = canonical
  multi-category-tag case. Source: POST 1, 2.
- **#258 (prereq / predicate-gated availability FIELD)** — CORROBORATE. Implicit prereqs with NO
  explicit `Preq:`: the EPA tiers (Level 2 presupposes Level 1), the opposed-pole supersession
  (Pro-Regulation invalidates Pro-Deregulation; Protect-Monopolies vs Bust-Monopoly), era-gated acts
  (Sherman/ICC pre-Future). Still demands the prereq/condition field. Source: POST 1, 2.
- **#262 (content-COVERAGE / per-ideology + per-primitive balance)** — CORROBORATE. Designer ASK
  (POST 1) *"Main area of need is Era of the Future."* Per-primitive skew again (P=5, **G=1** — the
  Gov-Action count is the thinnest primitive, the recurring pattern). Source: POST 1.
- **#206 (Era of the Future doubly unbuilt)** — CORROBORATE + content gap. One of the richest Future-
  content genres yet (robots/driverless/flying-cars/designer-babies/transhumanism/non-consensual-
  telepathy/social-media-sovereign-nations/criminalize-misinformation/regulate-crypto). Strong
  under-content'd-at-source + explicitly-wanted datapoint. Source: POST 1.
- **#236 (alternate-government-form axis / nationalize-or-abolish-sector primitive)** — CORROBORATE
  (light). The nationalize-an-industry family (RR/airlines/shipping/banks/police/"all sectors of the
  economy"/"all sectors of society") is the Communist/state-control edge of the regulation axis;
  "Protect Monopolies Amendment" is the laissez-faire opposed pole. Source: POST 1.
- **#66 (office/institution lifecycle, created-by-law)** — CORROBORATE (light). SEC / FDA / FTC / ICC
  are #66-style regulatory-agency creations-by-law; "Budget and Accounting Act" creates a fiscal
  institution. Source: POST 1.

---

### Provenance notes
- Single chunk; both posts read. Pure design/crowdsourcing log (no die-rolls, no playthrough
  mechanics, no GM accept/reject ledger). vcczar (tier-1) authors the genre (POST 1); POST 2 is a
  single community contributor (EPA `Level 1/2/3` tiers + logging/National-Forests + wetlands).
- Codebase verified at `src/` HEAD 2026-06-28: `Legislation` (`types.ts:1506–1520`) has no
  `subtype`/prereq/level field; `Predicate`/`evalPredicate` ship for era events only; no policy-genre
  store, prereq engine, or graduated-intensity/tier model exists. The framework
  (#221/#237/#248/#258/#262/#206) remains **0% shipped** — consistent with every sibling content drop.
