# 964b8857 — "AMPU Era of the Future Supreme Court Cases"

**Type:** CONTENT-AUTHORING thread (NOT a playthrough). GM @vcczar opens a crowdsourcing
brief: he gives the **canonical SC-CASE submission FORMAT** and asks contributors to author
~25-30 hypothetical Era-of-the-Future SCOTUS cases. This is the **sister AUTHORING thread** to
`aa227625` ("SC Case Scoring", batch 35) — same Era-of-Future docket content set; `aa227625`
*scores* the finished docket for Landmark tier, this thread *authors* the cases and (more
importantly for the gap log) pins down the **case FORMAT/schema + three SC-system sub-mechanics**
vcczar states he will build around them. Thread is explicitly **content-frozen / closed** at the
end (POST 18: "this thread is done. I've transferred these all over. Please don't post any more
ideas until after Early Release").
**Scope:** 18 posts / 1 chunk (chunk-001), ~14 KB, Apr-May 2022 (forum timestamps 4/24-5/7/2022).
**Authority:** @vcczar + @MrPotatoTed (Ted) = tier-1; @ConservativeElector2, @jvikings1, @Cal,
@Willthescout7, @0ccultist = contributors.
**Feeds:** #52 (the docket / who-decides — the docket home), #249 (Landmark tier), #251 (judiciary
overhaul), #218 (Rule of Four / gov-brought cases), #132 (Gov Challenge-Legislation), #115 (name DB),
#221 (content-primitive registry), #206 (Era-of-Future), #258 (precedent-as-gate), #6/#354 (movement
spawn). Mostly **corroborating / sharpening** existing rows; the load-bearing NEW capture is the
**case FORMAT/effect-payload schema** and the **case-GENERATOR sub-mechanic**.

---

## 1. ★ The canonical SC-CASE FORMAT/SCHEMA (the load-bearing capture — POST 1)

vcczar posts a **copy-paste submission template** that defines the SC-case content record. Capture
it exactly — this is the authored schema for an Era-of-Future SCOTUS case:

> **1. Court Case Name:**  (`Plaintiff v. Defendant`, e.g. *Advanced Robot Inc. v. California*)
> **2. Description** — in **QUESTION FORM that can be answered "yes" or "no"** ("see SC Case
>   examples from the game"), e.g. *"Do constitutional rights apply to robots and other objects
>   guided by AI?"*
> **3. Suggestions on what the case might do gameplay-wise** — **direction-keyed faction/interest
>   effects:** *"if yes → [factions/interests]+ ; if no → [factions/interests]+"*.

vcczar: "Just three things. I'll fill in everything else" (POST 1) — i.e. these 3 fields are the
**author-supplied** content; the GM fills the rest (era key, ordering, etc.) when transferring to
the spreadsheet. **This is the SC-case content schema the build lacks entirely.** It is sharper
than what `aa227625` recorded: that digest captured only fields (1)+(2) (name + question);
**this thread adds field (3) — the direction-keyed faction-EFFECT PAYLOAD — as an explicit,
author-required part of the record.**

**The 3 fields → 3 distinct record columns the shipped court has no analog for:**
- `name` (string, `X v. Y`)
- `question` (one-sentence **yes/no** constitutional question — the ruling is a binary yes/no, NOT a
  free-text outcome)
- **`effects` — a direction-keyed payload:** `{ ifYes: [faction/interest +], ifNo: [faction/interest +] }`.
  This is the key NEW data shape: a ruling DIRECTION (yes/no) maps to **interest-group / faction
  bonuses**. Every case names winners on BOTH sides.

**Interest groups / factions named in the effect payloads** (the vocabulary the payload draws from —
corroborates the interest-group/lobby + ideology systems): **Big Business**, **Big Technology**,
**Big Agriculture**, **Big Military**, **Globalists / Free Trade**, **Protectionists / Isolationists**,
**Transportation**, **Honest Government** (named by CE2 with a "(? not sure what they're called)"
hedge, POST 4), **Progressives**, **Liberals**, **Conservatives**, **Traditionalists**,
**Theocrats**, **Civil Rights**, **Law and Order**, **Environmentalists**, **Left-Wing Activists**,
**Right-Wing Activists**, **Expansionists**. (Mix of ideology cards + interest cards + lobby cards
per the #50/#51 card taxonomy — the payload is keyed to whatever card a faction holds.) NB CE2
asks contributors to "re-think the + and − section" (POST 11) — the effect direction is **+only
in practice** (the losing side simply doesn't gain), but the field was conceived as ±.

## 2. ★ The SC-CASE GENERATOR sub-mechanic (MrPotatoTed's idea, vcczar-endorsed — POST 1, 2, 11)

vcczar (POST 1): "I'll also likely have a **SC generator as @MrPotatoTed suggested**." So the docket
is NOT only the ~30 hand-authored cases — a **procedural case GENERATOR** synthesizes additional
cases at runtime. Endorsed twice more: CE2 (POST 2) "absolutely in love with @MrPotatoTed's idea of
a SC case generator"; vcczar reaffirms (POST 11, accepting the 5% rule, §3).

**Generator inputs (POST 2, CE2 spelling out Ted's idea):** draws from a **human-name database**
("Besides a human name database, **state names should of course be included as well**") → so the
generator composes case names `<human-name> v. <state-name>` (and `<state> v. <human-name>`, the
two forms both appear in the authored set) from **two name DBs: the human-name DB + a state-name DB**.
- The **human-name DB is the SAME `#115` name database** the candidate generator already specs
  (gender-tagged given names, race/religion-tagged surnames, ~6,600 names) — this is a **NEW
  CONSUMER** of that DB, not a new DB.
- The **state-name DB** is a small additional list (the 50/53-state roster the scenarios already
  hold) — trivially available.

This is a **distinct GENERATOR sub-mechanic** on top of the docket (#52) and the importance model
(#249): hand-authored cases seed the docket; the generator fills it out so the 88-year Era of the
Future ("about 88 years," POST 1) isn't exhausted by ~30 fixed cases. **Flag for consolidation:**
likely a #52 extension (generator that feeds the docket) crossed with a #115 reuse (its name source);
the GENERATED-case importance is set by §3 below.

## 3. ★ 5% LANDMARK chance on a GENERATED case (vcczar, POST 11)

vcczar: "I also suggest a kind of **5% chance that a case from the SC Case Generator will be seen as
a landmark decision**." → quantifies the **#249 Landmark tier specifically for generator output**:
a procedurally-generated case rolls **~5% to be promoted to Landmark** (the movement-spawn-capable
tier from #249/`aa227625`), the other ~95% being ordinary cases. This is the **generator-side
counterpart** to `aa227625`'s hand-curated Landmark scoring — there, designers HAND-pick which
authored cases are Landmark; here, a GENERATED case gets a **flat 5% Landmark roll**. Both feed the
same #249 tier field. (Note tension to log: the AMPU-2 context-dependent-significance model in #249,
POST 8 of `aa227625`, argues importance should be COMPUTED from opinion meters, not a flat roll —
so the 5% flat roll is the simple v1 of that v2 idea, for generated cases.)

## 4. ★ Govs can CHALLENGE laws / bring cases (vcczar, POST 1)

vcczar: "and **Gov's will be able to challenge laws too**." → the court does NOT only act on its own
hand-authored docket; **governors are an agency that BRINGS cases** (challenges a law → that
challenge becomes a SCOTUS case). **Corroborates #132** (the existing "Gov Challenge-Legislation"
Gov-Action: a gov challenges recent legislation; Ted ruled repeal bills are NOT eligible targets)
and **#218** (Rule of Four / CJ case-refusal explicitly governs "cases brought via Gov Actions").
So the gov-challenge → docket → cert(#218) → decide(#52) → tier(#249) pipeline is the intended flow,
and this thread confirms gov-brought cases are part of the case SUPPLY alongside hand-authored +
generated cases. (Several authored cases here are framed `State v. <person/entity>`, which reads as
a state/gov-brought case — consistent with gov agency.)

## 5. Precedent / overturn chains (corroborates #258 + #52's precedent-flag)

Several authored cases **explicitly overturn or reinstate a prior ruling** — i.e. a case carries a
relationship to PRIOR case law, not just a standalone yes/no:
- **California v. Robertson** (POST 13, jvikings1) — "would **overturn** the potential ruling in
  *National Rifle Association v. Bruening*" (concealed-carry good-reason laws).
- **Utah v. Nelson** (POST 13) — "**Overturns** *Millver v. United States* which outlawed polygamy,"
  with explicit reasoning that the original ruling was based on a law "purposely written to
  discriminate against Mormons" and "**current legal thinking includes intent in their decisions**
  (see Trump's travel ban)" → an **intent-doctrine** rationale for the overturn (mirrors the
  Judicial-Doctrine idea in #251).
- **Roe** is handled as an explicit overturn-OR-reinstate pair (POST 14 Willthescout7: "I assume you
  included a case that would **overturn Roe v. Wade**"; POST 15 vcczar: "**Or reinstates?**") —
  confirming the docket carries BOTH an overturn-Roe and a reinstate-Roe case, i.e. precedent state
  is **bidirectional / re-litigable**.

This corroborates **#258** (precedent-as-availability-gate — a ruling sets a game-state predicate
that gates downstream content; cf. the b40 obscenity Hicklin→Roth→Miller supersession chain) and
**#52's** precedent-flag/law-deactivation hook: a SCOTUS-case record needs an **`overturns` /
`reinstates` link to a prior case** and the engine must track which precedent is currently in force.
NOT expressible by the shipped coin-flip court.

## 6. The authored case set (CONTENT — shape only; do not transcribe all 30)

~30 cases authored across POSTs 4, 6, 8, 11, 13, 16 (a subset of the ~45-case final docket that
`aa227625` lists in full — that digest is the canonical content list; this thread is the authoring
provenance). Thematic spread confirms **#206 Era-of-Future** policy genres:
- **Robot / AI personhood & rights** (the thematic core): *Advanced Robot Inc. v. California*
  (do constitutional rights apply to robots/AI? — the consensus #1 Landmark per `aa227625`),
  *Bender v. New York* (ban marrying a robot/AI?), *Robot Loan Services v. Dept of Transportation*,
  *Texas v. Robot Car Factory Union* (permanent deactivation of robots that killed humans?),
  *New Mexico v. Lopez* (resist a robot bounty-hunter?).
- **Consciousness upload:** *Jones v. Alabama* (right to upload consciousness?) + follow-up
  *Quackenbush v. <IRS head>* (can the state TAX the uploaded? — POST 8, a **conditional follow-up
  case that only fires "if this one is yes"** → a case-CHAIN where one ruling unlocks the next).
- **Space / sea colonies & jurisdiction:** *Benevolent Citizens Assoc v. Texas* (prison colonies in
  space?), *Florida v. Alabama* (do sea settlements have an EEZ / exclusive economic area?),
  *Fergus v. FAA* (ban private spaceports?).
- **Crypto / economy:** *Televangelist Inc. v. Future Transactions* (mandate customers use crypto?).
- **Animal / tree rights & environment:** *Woodworks Inc. v. Oregon DEQ* (trees = human rights?),
  *Animal Rights Advocacy v. South Dakota* (hunting = cruelty?), *Fishing Ban Now PAC v. Michigan*,
  *Maine Lobster Industries v. NYC*, *Electronic Warfare v. City of San Francisco* (ban
  violent video games? — POST 17 CE2 suggests adding a Traditionalist + as well, and broadening to
  "explicit music or television/film").
- **Abortion / police / 1A / criminal-procedure carryover:** the Roe overturn/reinstate pair,
  *Minnesota Justice v. City of Minneapolis* (abolish-police advocacy = domestic terrorism?),
  *Roscoe v. Montgomery Public Schools* (punish racist speech vs 1A?), *Michigan v. Know your
  Abortionist Inc.*, *Martin v. Doe* (masked witness vs 6A), *Weissenberg v. City of Provo*
  (involuntary DNA collection vs 4A), *Maxwell v. Arkansas* (8A — execute a death-row inmate
  diminished by a lightning strike), *Jefferson v. United States* (asylum for a foreign transsexual?).
- **Note:** POST 7 logs a contributor self-correction on effect DIRECTION (0ccultist wrote the
  yes/no effects backwards on *Bender*; jvikings1 corrects — "if the state CAN ban robot marriage,
  the Traditionalists get the positive bonus") → confirms the effect payload is **strictly keyed to
  the ruling direction** and is easy to author backwards; **direction-correctness is a content-QA
  concern** at authoring time. Spelling drift across posts (*Woordworks*/*Woodworks*, *Cour*/*Court*,
  *subsiquently*) → names need normalization at transfer (same note as `aa227625`).

## 7. Shipped reality (verified spot-check — same as the SCOTUS cluster's standing finding)

The shipped Supreme Court (`src/engine/phaseRunners.ts:~3397`, `runPhase_2_5_3_Court`): **50% chance
per turn** of any case; picks a `title` from **4 hardcoded generic strings**; rules
`conservative`/`liberal` by **raw justice-ideology headcount**; nudges `partyPreference` by **±0.1**.
**Versus this thread's design, the build has NONE of:** a `ScotusCase` type / `scotusDocket`, the
3-field record (name + yes/no question + effect payload), **per-case faction/interest EFFECT payload**,
a **case GENERATOR** (no name-DB-driven synthesis), the **5% Landmark roll** (no tier field at all),
the **gov-challenge → docket** path, or **precedent overturn/reinstate links**. So the entire SC-case
CONTENT SYSTEM described here is **0% shipped** — only the bare coin-flip exists.

---

## Candidate deltas for consolidation (consolidation agent owns the gap-log write — DO NOT assign new #s)

All map to EXISTING gap rows. Ordered by load-bearing-ness.

1. **★ SC-CASE FORMAT / record SCHEMA + direction-keyed EFFECT payload → #52 (docket home) / #249 /
   #221.** vcczar's canonical 3-field author template (POST 1): `name` + **yes/no `question`**
   (ruling is binary) + **`effects = {ifYes:[faction/interest+], ifNo:[faction/interest+]}`** keyed to
   the ruling DIRECTION, drawn from the interest-group/ideology/lobby vocabulary (Big Business / Big
   Tech / Globalists / Progressives / Civil Rights / Law-and-Order / Environmentalists /
   Traditionalists / Theocrats / Expansionists / …). **SHARPENS `aa227625`/#52/#249**, which captured
   only name+question — field (3), the faction-effect payload, is the NEW required column. Candidate to
   register a **SCOTUS-case content-primitive in #221** (alongside Legis-Prop / Pres-Action /
   Gov-Action / Scripted-Event). Source: `964b8857` POST 1, 4, 6, 7, 8, 11, 16.
2. **★ SC-CASE GENERATOR sub-mechanic → #52 (extends) + #115 (reuses) + #249.** A procedural case
   generator (MrPotatoTed's idea, vcczar+CE2 endorsed) synthesizes cases from a **human-name DB
   (= the existing #115 name database — NEW consumer) + a state-name DB**, composing `X v. State`
   names, so the docket isn't only the ~30 hand-authored cases over the 88-year Era. **Distinct from
   the docket DATA (#52) and the importance model (#249).** Flag whether this is a #52 extension or
   warrants its own row. Source: `964b8857` POST 1, 2, 11.
3. **★ 5% Landmark roll on GENERATED cases → #249.** A generator-produced case has a flat **~5%
   chance to be promoted to Landmark** (vcczar, POST 11) — the generator-side counterpart to
   `aa227625`'s hand-curated Landmark scoring; v1-simple vs the AMPU-2 meter-computed significance
   (#249 POST 8). Quantifies #249's tier for procedural cases. Source: `964b8857` POST 11.
4. **Govs CHALLENGE laws / bring cases (case SUPPLY) → corroborates #132 + #218.** vcczar (POST 1):
   "Gov's will be able to challenge laws too" — confirms governors are a case-bringing agency feeding
   the docket; matches #132 (Gov Challenge-Legislation) + #218 (Rule of Four governs Gov-Action-brought
   cases). Corroborating, not new. Source: `964b8857` POST 1.
5. **Precedent overturn/reinstate LINKS on the case record → corroborates #258 + #52's precedent-flag.**
   Authored cases explicitly **overturn or reinstate prior rulings** (overturn the NRA/Bruening
   concealed-carry ruling; overturn the polygamy ban via an **intent-doctrine** rationale; overturn-OR-
   reinstate Roe as a bidirectional pair) → the record needs an `overturns`/`reinstates` link + a
   live precedent-in-force flag; ties #258's precedent-as-content-gate and #251's Judicial-Doctrine
   (intent doctrine). Also a **conditional follow-up case** (*Quackenbush* fires only "if *Jones* =
   yes") = an outcome-gated case CHAIN. Corroborating/sharpening. Source: `964b8857` POST 8, 13, 14, 15.
6. **Era-of-Future docket CONTENT (~30 authored, content-FROZEN) → #206 / #221 / #52 docket data.**
   This is the AUTHORING-provenance for the docket `aa227625` lists in full (robot/AI personhood,
   consciousness upload, space/sea-colony EEZ + jurisdiction, crypto, abortion, police, asylum) —
   corroborates #206's Era-of-Future genres. Names need normalization. Thread is **content-frozen
   ("transferred over; no more ideas until Early Release," POST 18)** → stable seed set.
   Corroborating. Source: `964b8857` POST 4, 6, 8, 11, 13, 16, 18.
7. **Shipped-vs-designed delta confirmation → #52/#249/#221.** Re-verified the shipped court is a
   coin-flip on 4 hardcoded strings with NO docket / case-identity / yes-no question / faction-effect
   payload / generator / tier / gov-challenge path / precedent links (`phaseRunners.ts:~3397`); the
   SC-case content SYSTEM is 0% shipped. Corroborating. Source: codebase spot-check + whole thread.

### Open questions (for the human, via consolidation)
- Is the SC-case GENERATOR (delta 2) a sub-mechanic of #52 or its own gap row? It crosses #52 (docket
  supply) + #115 (name DB) + #249 (5% Landmark) and has no current row of its own.
- Effect payload: the field was conceived as **±** (CE2: "re-think the + and − section," POST 11) but
  authored as **+only on the winning side**. Does the final design carry a NEGATIVE (penalty) to the
  losing side, or only a positive to the winner? (Unresolved in-thread.)
- Does the flat 5%-Landmark roll (delta 3) survive into the AMPU-2 meter-computed-significance model
  (#249 POST 8), or is it replaced once opinion meters exist?
