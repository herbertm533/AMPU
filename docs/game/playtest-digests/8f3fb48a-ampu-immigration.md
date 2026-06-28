# Digest — 8f3fb48a-ampu-immigration ("AMPU Immigration")

**Type:** CONTENT-AUTHORING thread (Apr 2022), **NOT a playthrough**. 4 posts /
1 chunk (chunk-001, all covered; source CSV ~6.8 KB). Author/opener: **@vcczar**
(tier-1) tagging the full community for ideas; one accepted-idea reply from
**@ConservativeElector2** (tier-4 GA). **Why it matters:** this is the **raw
authoring source for the Immigration policy genre** — a single concrete instance
of the **#237 policy-genre framework** / **#248 legis-proposal subtype taxonomy**
populating the **#221 three-primitive content system** (Legis-Prop / Pres-Action
/ Gov-Action). The standout artifact is a **demographic→district-lean Gov action**
("promote immigration to snatch a congressional district") that couples this genre
to the dynamic-state-lean cluster (#247 / #205). Pure design intent — **0%
shipped** (no `subtype` field, no Pres/Gov-Action primitives, no demographic-driven
state lean; per harness context, not re-derived here).

---

## The artifact — Immigration as a #237 policy genre (raw, untagged form)

vcczar dumps the genre as **three flat bullet lists under the #221 primitive
headers**, but — unlike the later Business/Labor (`dc0316f0`) and master-primitive
(`518fb253`) threads — these are **un-coded**: **no `L/P/G/S` prefixes, no era
tags, no `*-Default` baseline, no `Preq:` chains.** This is an **earlier, rawer
draft** of the same genre shape, before the L/P/G/era-tag schema was applied.
Shape and rough counts (NOT transcribed in full — see chunk for the list):

| Primitive (POST 1 header) | ~Count | What it spans |
|---|---|---|
| **Legis Prop** | **~95** (POST 1) **+5** (POST 4) | the full open↔restrict axis (see below) |
| **Pres Actions** | **10** (POST 1) | strict/lenient stance, enforcement, bans |
| **Gov Actions** | **1** (POST 1) **+1** (POST 2, the district-flip) | state-scoped |

**Legis-Prop axis** — the proposals fan across the whole immigration policy
spectrum, clusterable as:
- **Open / expand:** open borders, no quota/cap/national-origin/race/ethnicity/
  religion barriers, abolish quota system, diversity-visa lottery, STEM/entrepreneur
  visas, family reunification, refugee admission+resettlement, green-card system,
  birthright-for-children-abroad, allow Asian-Americans / "any social class".
- **Path-to-citizenship:** legalize 5+ yr residents, pathway for military/college
  undocumented, English-as-prereq pathway, restrict pathway to spouses/minors,
  bar criminal records from citizenship.
- **Restrict / quota / cap:** numeric caps (700k, 270k), 2%/3% Southern/Eastern-
  European quotas, head-tax/port-tax, residency-period bills, English literacy test,
  point/talent-based system, cut green cards by half, guest-worker visas.
- **Exclusion bans (historically-flavored, broad set):** by race/origin (African-
  descent naturalization, Chinese laborers, Asian, Japanese/Filipino low-skill,
  Latin American), by religion (Catholic, non-Protestant, Muslim, Jewish, non-
  Christian, Eastern religions, atheist/agnostic), by class/health/morality (paupers,
  beggars, sick, epileptic, insane, handicapped, alcoholic, "good moral character",
  pimps/prostitutes), by ideology (anarchist, LW/RW radicals, hostile-nation),
  re-entry bans, registration requirement, expanded deportation/anarchist defs.
- **Named historical acts** appear as concrete entries: **Naturalization Act of
  1870, Page Act of 1875, Know-Nothing 21-yr naturalization** (POST 4) — implies
  these are **era-keyed** (#206) even though no tags are written.
- **Border / infrastructure:** build/tear-down Canada & Mexico walls, border
  control establishment, more agents, "robot guards at the borders" (Era-of-Future
  flavor, #206), close borders to immigration+tourism, halt all immigration.

**Pres Actions (10):** strict vs. lenient immigration policy (a **stance toggle**),
strict/non-enforcement of deportation, family-separation, federal sanctuary-city
ban, temporary "African ban" / "Muslim ban", use defense funds for the Mexico wall,
encourage Mexican immigration. → modern-era executive-stance content; corroborates
the Pres-Action-as-stance pattern from `518fb253`/`dc0316f0`.

## ★ The district-flip Gov action (the load-bearing finding)

POST 1 Gov Action: **"Allow Sanctuary Cities."** POST 2 (vcczar) adds the marquee
mechanic: **"Promote immigration to your state as a Gov action to possibly snatch
another congressional district."** This is a **demographic lever on district /
state apportionment + lean** — a governor spends a Gov action to grow population/
shift composition and **flip or gain a House district**. POST 3 (ConservativeElector2,
GA): **"I like this idea, and don't forget about the EV swing system (which … I
forget if it's currently in the game)."**

**Why it's cross-cutting:** this couples the Immigration genre to the
**dynamic / event-driven state-lean cluster** — it is a *content primitive that
mutates `state.bias` / apportionment via demographics*, exactly the
"Gov-action-driven state-lean change" family flagged in `fc461242` (#247) and the
Vic3 per-state-realignment parking lot (#205). It also raises the **"EV swing
system"** (POST 3) as an apportionment/electoral-vote mechanic the GA is unsure
ships — an open question. Same accepted-in-`518fb253` idea ("attract-immigration-
for-a-House-seat," that digest POST 5) — **this thread is its origin/expansion.**

---

## Shipped-vs-designed (per harness context — not re-grepped)

- **No `subtype` field on `Legislation`** → the #248 subtype taxonomy this list
  feeds (an **Immigration** subtype/genre value) is unrepresented.
- **Pres-Action and Gov-Action as content primitives = designed-only (#221, 0%
  shipped)** — there is no Pres-Action or Gov-Action type/catalog; the 10 Pres
  Actions and the 2 Gov Actions here have no engine home.
- **State lean is calendar/static-keyed, not demographic-driven** — the district-
  flip Gov action requires a demographic→apportionment→lean coupling that does
  not exist (state `bias` is a static scalar + small drifts; no apportionment/EV
  recompute from population). The "EV swing system" (POST 3) is **unconfirmed in
  the build**.

→ Net: this digest is **pure design provenance** for the Immigration genre; it
adds NO shipped behavior, and **enriches** existing 0%-shipped gaps with concrete
content + one new cross-cutting mechanic.

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs; consolidation agent owns the gap-log write. No new
numbers assigned.)*

- **#237 (policy-genre framework)** — CORROBORATE + ENRICH. Immigration is a
  concrete genre instance, in **raw/untagged** form (no `L/P/G/S` prefixes, no
  `*-Default`, no `Preq:` chains) — evidence the genre schema was applied *later*
  (cf. `dc0316f0`/`518fb253` which ARE tagged). ~100 Legis-Props + 10 Pres Actions
  + 2 Gov Actions. Source: POST 1/4.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE. Implies an
  **Immigration** subtype/genre value; the ~100 proposals span open / path-to-
  citizenship / restrict-quota-cap / exclusion-ban / border subtypes; named acts
  (Naturalization 1870, Page 1875, Know-Nothing). Source: POST 1/4.
- **#221 (3-primitive content system)** — CORROBORATE. Populates all three
  primitives (Legis-Prop / Pres-Action / Gov-Action); Pres Actions are
  **stance toggles** (strict vs. lenient) + enforcement/ban actions. Source: POST 1.
- **#247 / dynamic state-lean cluster (cf. #205)** — CORROBORATE + **add a NEW
  content mechanic**: a **Gov action that promotes immigration to flip/snatch a
  congressional district** — i.e. a **demographic→apportionment→state-lean lever**
  delivered as a Gov-Action primitive. Ties the Immigration genre into event/
  action-driven state-lean realignment. Source: POST 2/3. (Same idea accepted in
  `518fb253` POST 5; this is its origin/expansion.)
- **#206 (era content bands)** — CORROBORATE. The set is implicitly era-scoped:
  19th-c. named acts (Page 1875, Naturalization 1870, Know-Nothing 21-yr) sit
  beside Future-band flavor ("robot guards at the borders"). No era tags written —
  authoring-side hole. Source: POST 1/4.
- **Open question (carry forward):** the **"EV swing / apportionment" system**
  ConservativeElector2 references (POST 3) — does it ship, and is the district-flip
  Gov action meant to drive *apportionment* (seat count) or only *district lean*?
  Unresolved in-thread. Hand to human / tech-lead.

---

### Provenance notes
- Single chunk; all 4 posts read. Thread is a one-sided **idea dump** (POST 1, 4 =
  vcczar's lists) plus one community add (POST 2 = the district-flip mechanic, the
  only ruling-grade content) and a tier-4 GA endorsement (POST 3). No accept/reject
  log, no era tags, no playthrough mechanics. Treat POST 2 as the load-bearing datum.
- Shipped status taken from harness context (no `subtype`; #221 0% shipped; static
  state lean) — not independently grepped this run.
