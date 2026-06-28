# 07fa6116 — "Future Supreme Court Cases for AMPU"

**Type:** OPEN BRAINSTORM thread (NOT a playthrough; NOT yet a formatted authoring drop). The
community free-associates hypothetical future SCOTUS cases; near the end the **SC Case GENERATOR**
is proposed and the GM endorses it. This thread **PRE-DATES** the batch-41 authoring thread
`964b8857` ("Era of the Future Supreme Court Cases," which authors cases in vcczar's fixed 3-field
format, Apr-May 2022) and is the **actual DESIGN ORIGIN of the SC Case Generator (#270)** and of the
**two case-authoring heuristics** (#270/#258). Where `964b8857` *authors the cases in a schema*, THIS
thread is *where the generator idea and the case-design patterns are born* (Mar-Apr 2022).
**Scope:** 28 posts / 1 chunk (chunk-001), ~11.5 KB. Forum timestamps 3/16/2022 – 5/7/2022.
**Authority:** @vcczar + @MrPotatoTed (Ted) = tier-1; @jvikings1, @A man from Colorado,
@Willthescout7, @10centjimmy, @IloveHistory48599022, @ConservativeElector2 = contributors.
**Feeds (all EXISTING IDs — do NOT renumber):** **#270** (SC-case content system + generator — THIS
IS ITS EARLIER ORIGIN), **#258** (the two case-authoring patterns; precedent-as-gate), **#249**
(Landmark/importance), **#52** (docket/decide), **#25/E25** (Era-of-Future docket data), **#218**
(gov-brought cases), **#115** (name DB the generator reuses), **#206** (Era-of-Future genres).
**Load-bearing capture:** the **generator's design origin + rationale** (Ted's exact framing,
vcczar's "generator + 50 specific cases alongside it" combination) and the **two authoring
heuristics**. Almost everything else is corroborating CONTENT-GENRE evidence for #206/#270.

---

## 1. ★ SC CASE GENERATOR — the DESIGN ORIGIN (MrPotatoTed POST 25; vcczar endorses POST 28)

This thread is **where the generator idea (#270) is first stated**, ~6 weeks before `964b8857`
records it as already-accepted. #270's current provenance only cites `964b8857`; this is the upstream
source + the rationale.

- **★ MrPotatoTed (POST 25, the origin statement):** *"maybe it wouldn't be too hard to create a
  future Supreme Court case **generator**. **Random name v Random name. Wouldn't even need a case
  description, just randomly determining that an aye gives points to conservatives and a Nay vote
  hurts human rights** or whatever."* → the generator is conceived as **DESCRIPTION-FREE**:
  - **`<random name> v. <random name>`** (the two-name composition #270 later resolves to
    human-name-DB + state-name-DB — here it's name-v-name with no DB specified yet),
  - **NO case description / question text** (the generated case is a bare name + an effect),
  - **a direction-keyed effect** — an **aye → faction gains** ("points to conservatives"), a
    **nay → interest is harmed** ("hurts human rights"). This is the EARLIER, looser form of #270's
    `effects:{ifYes:[…+], ifNo:[…+]}` payload — note POST 25 frames it as a ± (aye HELPS one side,
    nay HURTS another), the ± conception #270 logs from CE2's later "re-think the + and − section."
- **★ vcczar ENDORSES + sets the combination (POST 28):** *"It could just use the same random SC
  case generator. I'm just looking for **50 specific hypothetical cases** that can be in combination
  with this."* → vcczar's design is explicitly **GENERATOR + ~50 HAND-AUTHORED cases ALONGSIDE it**
  (not generator-only, not authored-only). This is the design intent `964b8857` then executes (the
  ~30 authored cases) — and pins the authored-docket TARGET SIZE at **~50** (the ~45-case frozen
  docket `aa227625`/#52 list in full is the realization of this "50 specific cases").
- CE2 (POST 26): "Love that idea!" (corroborates the endorsement; the second tier-1+contributor
  buy-in this thread captures, the first of the chain `964b8857` POST 2 continues).

**Key delta vs #270 as logged:** #270 dates the generator to b41 `964b8857`. THIS thread is its
**true origin (Mar-Apr 2022)** and adds (a) the **no-description / bare name-v-name** original
conception, (b) the **±-effect** original framing (aye helps / nay hurts), and (c) vcczar's
**"generator + ~50 specific cases in combination"** design ruling that sets the authored target size.

## 2. ★ The TWO CASE-AUTHORING HEURISTICS — the docket-design patterns (POST 11, +jvikings1 POST 12)

The two patterns that organize how the entire docket is authored/generated — the origin of #270's
overturn/reinstate links and of #258's precedent-as-gate, AND a content-design rule in their own right.

- **★ A man from Colorado (POST 11, the statement):** *"create hypothetical cases (a) **overturning
  existing precedent**, and additionally (b) cases that have the court **answer a constitutional
  question that is currently left unaddressed**."* → two distinct case ARCHETYPES:
  - **(a) OVERTURN-AN-EXISTING-PRECEDENT** — a case carries a link to PRIOR case law (the origin of
    #270's `overturns`/`reinstates` links + the live precedent-in-force flag; ties #258). Worked
    instances appear later in-thread: overturn **Reynolds v. US** (anti-polygamy) via an
    **intent-doctrine** rationale (POST 23 — the SAME intent-doctrine reasoning `964b8857`/#270's
    *Utah v. Nelson* uses; this thread is its origin); overturn **Medellín v. Texas** if Antarctica-
    treaty resource exploitation is found illegal (POST 24); revisit **Texas v. White** for
    secession-by-mutual-consent (POSTs 13-16).
  - **(b) ANSWER-A-CURRENTLY-UNADDRESSED-CONSTITUTIONAL-QUESTION** — a case poses an open
    constitutional question with no precedent (the origin of #270's yes/no `question` field — the
    binary constitutional question IS the case). jvikings1 (POST 12) immediately endorses: *"The
    constitutional question suggestion is definitely a good one,"* then supplies a list (§3).
- **→ These two heuristics are the AUTHORING/GENERATION method** for the docket: every case is
  either an overturn-link case or an open-question case. Cross-ref **#258** (precedent-flag a ruling
  sets) + **#270** (both the `question` field and the `overturns`/`reinstates` link derive from
  these two patterns). NOT expressible by the shipped coin-flip court.

## 3. The constitutional-QUESTION case CATEGORIES (CONTENT — categories only; do NOT transcribe all)

The brainstorm's bulk = ~25 hypothetical cases across the open-question and overturn archetypes.
These corroborate **#206** (Era-of-Future content genres), **#25/E25** (the Future docket data set),
and **#270**'s content needs. Captured as recurring CATEGORIES (post cites for traceability):

- **Executive / structural constitutional questions:** former-President eligible to run/serve as
  **VP after two terms** (POST 2, the opening case — line-of-succession via Speaker/Cabinet); **Pres
  self-pardon** & **blanket pardons** (POST 12); **Congress delegating its powers to the executive**
  (POST 12); **secession by MUTUAL CONSENT** (can Congress grant a state's wish to secede? — the
  Texas-v-White carve-out: the majority opinion's "if all other states agreed" dictum, POSTs 12-16).
- **Tax / federalism (Federalism "making a comeback," POST 3):** **carbon tax** challenge (POST 3);
  **wealth tax** (Warren-style) (POST 4); oil/natural-gas regulation (POST 3).
- **Rights / 14th-Amendment / equal-protection:** **2nd-Amendment "well-regulated militia"**
  interpretation (POST 5, flagged for the 2030s/40s not 2080s); **trans rights** (privacy / access
  to surgery, 14th-Am, POST 8); **incorporate-and-merge-assets as a marriage alternative** for
  communes/polyamorous groups (POST 7); **universal healthcare / Medicare-for-All** at SCOTUS
  (POST 6); **euthanasia / assisted suicide** (POST 21); **marijuana & other drug legalization**
  (POST 22); **one-child / birth restriction** if overpopulation (POST 21).
- **★ Sci-fi / Era-of-Future personhood (the recurring core, corroborates #206/#270's robot/AI
  thematic center):** rights of **self-aware AI** (POST 9); **robots / aliens** under the
  Constitution (POST 10); **clones / stem cells / parental rights to clones** (POST 18); **downloaded
  consciousness / singularity** intelligence rights (POST 21).
- **Space / sea jurisdiction (POSTs 12, 20):** where **national airspace ends and "space" begins**
  (open, intersects international treaty); **private-spaceflight / Space "Jones Act"** docking &
  shipping rights; **underwater sea-colony** limits in oceanic territorial waters (federal exclusion
  zone). (These are the EARLIER seed of `964b8857`/#270's space/sea-colony-EEZ cases.)
- **Treaty / resource / historical:** **Antarctica-treaty** resource exploitation (treaty expires
  2048; pre-2048 US exploitation → could overturn **Medellín v. Texas**, POST 24); **Confederate
  soldiers as US Veterans** (currently veterans under federal law; revisiting forces the "states-in-
  rebellion vs. legal-secession" question + antagonizes the South — POSTs 16, 17, 19); **overturn
  Reynolds v. US** (anti-polygamy, via intent-doctrine, POST 23).
- **Misc. modern:** **social-media monopolies** (POST 18); **regulation of flying cars** / license
  reciprocity (POST 12, flagged as maybe-a-legis-issue); **violent video games** (implied by the
  later-thread lineage; first-person here is the broader free-association set).

## 4. Process notes (NOT gaps — author-time caveats)

- Much is admitted free-association: *"the best time for me to think of these is as I'm falling
  asleep,"* "gems from last night" (POSTs 12, 20, 21) → this is a BRAINSTORM, not a curated docket;
  the curation happens later in `964b8857` (the formatted authoring drop) + `aa227625` (Landmark
  scoring).
- **Several items self-flagged as "could just be legis proposals, not court cases"** (POST 20:
  "TBH half the things I say in this thread could just be leg proposals if you want"; POST 12: flying
  cars "might be more a congressional issue") → a recurring CONTENT-ROUTING ambiguity: an issue can
  be authored as a SCOTUS case OR a Legis-Prop. Relevant to #270/#221 (which primitive owns a given
  issue) but NOT itself a new mechanic — log as an open question.
- Era TIMING was discussed: the OP (POST 1) frames this as 2030–2090; contributors split cases
  across that span (2nd-Am ~2030/40 per POST 5; AI/robot rights ~2080/90 per POSTs 9). Corroborates
  the Era-of-Future spanning ~88 years (#206) but no firm per-decade scheduling is set here.

## 5. Shipped reality (verified — same standing finding as the rest of the SCOTUS cluster)

The shipped Supreme Court (`src/engine/phaseRunners.ts:~3397`, `runPhase_2_5_3_Court`): **50%/turn**
chance of any case; picks a `title` from **4 hardcoded generic strings**; rules
`conservative`/`liberal` by **raw justice-ideology headcount**; nudges `partyPreference` by **±0.1**.
**Versus this thread's design, the build has NONE of:** a `ScotusCase` type / docket, a case
GENERATOR (no name-v-name synthesis), a yes/no `question` field, a direction-keyed effect payload,
precedent overturn/reinstate links, or any Landmark/importance tier. The `pendingCourtCases` field
(`src/types.ts:~1587`) is dead (no reader/writer). So the entire SC-case content + generator system
this thread originates is **0% shipped** — only the bare coin-flip exists (re-confirmed; same null as
#52/#249/#270/#218).

---

## Candidate deltas for consolidation (map to EXISTING IDs — DO NOT assign new numbers)

Ordered by load-bearing-ness. This thread is mostly **earlier-ORIGIN + corroboration** for #270.

1. **★ SC CASE GENERATOR — push the DESIGN ORIGIN back to here → #270 (+ #249, #115).** This thread
   (MrPotatoTed POST 25, vcczar endorses POST 28, CE2 POST 26) is the **TRUE origin** of #270's
   generator, ~6 weeks before b41 `964b8857` (which #270 currently cites as the source). Adds three
   datums #270 should absorb: (a) the **original NO-DESCRIPTION / bare `<random name> v. <random
   name>`** conception (generator output is a bare name + effect, no question text); (b) the
   **original ±-effect framing** (POST 25: aye HELPS one faction / nay HURTS another interest — the
   ± conception #270 logs from CE2's later hedge, now traced to its origin); (c) **vcczar's design
   ruling: "the same random generator + ~50 SPECIFIC hypothetical cases in combination"** (POST 28)
   — fixes the GENERATOR-PLUS-AUTHORED-DOCKET architecture and the ~50-case authored target size
   that `964b8857`/`aa227625` then realize. Source: `07fa6116` POST 25, 26, 28.

2. **★ The TWO CASE-AUTHORING HEURISTICS (overturn-precedent / answer-unaddressed-question) → #270 +
   #258.** A man from Colorado (POST 11), endorsed by jvikings1 (POST 12): author cases that either
   **(a) overturn existing precedent** OR **(b) answer a currently-unaddressed constitutional
   question.** This is the **origin of #270's two structural elements** — the `overturns`/
   `reinstates` precedent LINK (from (a)) and the yes/no `question` field (from (b)) — and a
   docket-DESIGN method in its own right. Also the **origin of the intent-doctrine overturn
   rationale** (POST 23, overturn Reynolds-v-US on intent grounds — the same reasoning `964b8857`/
   #270's *Utah v. Nelson* uses) → ties #258 (precedent-as-gate) + #251 (Judicial-Doctrine).
   Source: `07fa6116` POST 11, 12, 23, 24.

3. **Era-of-Future CASE-CONTENT categories (the seed brainstorm) → #206 + #25/E25 + #270 content.**
   ~25 hypothetical cases corroborate the #206 Future genres and supply the **upstream brainstorm**
   the `964b8857`/`aa227625` docket curates: robot/AI/alien/clone/downloaded-consciousness
   personhood; space airspace-boundary + private-spaceflight/Space-Jones-Act + sea-colony
   jurisdiction; Antarctica-treaty resource exploitation (overturn Medellín); carbon/wealth tax;
   2nd-Am militia; trans rights; euthanasia; one-child policy; social-media monopolies; drug
   legalization; Confederate-veterans; secession-by-mutual-consent. Corroborating (content
   provenance, not a new mechanic). Source: `07fa6116` POST 2-10, 16-24.

4. **Govs/structural agency + secession-by-consent as case types → corroborates #218/#52/#270 supply
   side (light).** The secession-by-mutual-consent debate (POSTs 12-16) and Confederate-veteran
   revisiting (POSTs 16-19) are framed as live constitutional questions a case would resolve —
   corroborating that constitutional QUESTIONS (not just rights cases) are docket content (#270's
   `question` field) and that big structural questions belong on the docket (#52). Corroborating.
   Source: `07fa6116` POST 12-19.

5. **Shipped-vs-designed null confirmation → #270/#52/#249.** Re-verified the shipped court is a
   coin-flip on 4 hardcoded strings with no docket / generator / question / effect payload /
   precedent links / tier; `pendingCourtCases` (`types.ts:~1587`) is dead. The SC-case content +
   generator SYSTEM this thread originates is 0% shipped. Corroborating. Source: codebase spot-check.

### Open questions (for the human, via consolidation)
- **Case-vs-Legis-Prop routing** (POSTs 12, 20): contributors repeatedly note an issue "could just
  be a leg proposal" rather than a court case. Does a given Future issue get authored as a SCOTUS
  case, a Legis-Prop, or BOTH (the same issue surfacing via two primitives)? Relevant to #270/#221.
- **±-effect vs +-only** (POST 25 conceives the effect as ± — aye helps / nay hurts; #270 logs the
  authored cases as +-only on the winning side). Same unresolved ± question already open under #270 —
  this thread is the origin of the ± conception, doesn't resolve it.
- **Generator output: name-v-name vs `X v. State`.** POST 25 says "random name v random name"; #270
  (from `964b8857`) resolves it to human-name-DB v. state-name-DB. Confirm the final generator
  composes `<human> v. <state>` (the `964b8857` form) and not pure name-v-name (this thread's form).

---

### Provenance notes
- Single chunk; all 28 posts read. Pure brainstorm/design log (no die-rolls, no playthrough
  mechanics). POSTs 12-15 are quote-reply chains restating jvikings1's POST 12 list (secession /
  delegation / self-pardon / blanket-pardons) — cite the originating POST 12. POSTs 26 & 28 are
  quote-replies restating MrPotatoTed's POST 25 generator pitch — cite POST 25 as the origin, POST 28
  for vcczar's "generator + 50 cases" ruling. POST 27 is empty (a deleted/edited post by CE2).
- This thread is the **EARLIER sibling** of b41 `964b8857` (the formatted authoring drop) and b35
  `aa227625` (Landmark scoring); together they are the SC-case-content provenance for #270/#249/#52.
- Codebase verified: shipped court = `phaseRunners.ts:~3397` coin-flip on hardcoded title strings;
  `pendingCourtCases` (`types.ts:~1587`) is dead; no `ScotusCase`/docket/generator/question/effect-
  payload/tier/precedent links. The SC-case content system (#270) is 0% shipped.
