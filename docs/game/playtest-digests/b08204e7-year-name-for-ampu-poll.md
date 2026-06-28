# Digest — Year Name for AMPU Poll (`b08204e7-year-name-for-ampu-poll`)

**Scope:** 20 posts / 1 chunk (chunk-001). **Type:** TERMINOLOGY / DESIGN thread, Sept 6–7 2022 (forum 3.0 era). Two distinct strands: **(A)** rename the in-game turn/year LABEL (single year → span); **(B)** the canonical **term-taxonomy ruling** for a politician's attributes + the **"Cop" trait rename** + a deferred biannual/annual cadence question. Drivers: @vcczar (designer, tier-1), @MrPotatoTed/"Ted" (tier-1); @ShortKing, @10centjimmy, @Willthescout7, @ebrk85, @ConservativeElector2 (GAs, tier-4) weigh in. **This thread is the design ORIGIN/authority for existing gap #216 (trait-name / term-taxonomy remap)** — the QW22 blocking prereq for the (designer-confirmed-done) PV revamp. No code; pure design intent. Cite `POST n`.

> Shipped-reality check (`src/types.ts`): `Skills` = `Record<SkillKey, number>` — 6 integer 0–5 fields `admin, legislative, judicial, military, governing, backroom` (+ separate `command` + `traits[]`). The `Expertise` union (L182-186) ships BOTH `'Military'` and `'Naval'` (rename target Military→Army; corroborates #216). The `Trait` union (L62-117) ships `Egghead` and `Celebrity` and `Decisive General`, but **no** `Cop`, **no** `Righteous`/`Virtuous`, **no** `Wonk`/`Commoner`/`Lowbrow`/`Everyman` — i.e. the trait RENAMES below are DESIGN-INTENT over 3.0/forum names, most not yet shipped (only Military→Army acts on a shipped tag). Year labels: see strand A for engine-display coupling note.

---

## STRAND A — Year-label rename (single year → term span)

The defining ruling of the thread's title poll.

- **Problem (vcczar, POST 1):** turns are labelled by the *election year that begins a term* — Washington's first term shows as **"1788"** (Biden's as **"2020"**), sometimes also called the "1788-1790 cycle." But the winner doesn't take office until **1789**. Mismatch is confusing.
- **Player complaint that motivates it (ShortKing POST 2, +10centjimmy POST 10):** "if I start on the turn start date labelled 2020, I would expect to get to influence the 2020 election." A label of 2020 implies you play the 2020 election, but you don't.
- **Proposed convention (POST 1):** relabel every term to a **span aligned to the real legislative term / inauguration**, e.g. `1788` → **`1789–1791`**, `2020` → **`2021–2023`** (inauguration year → next election year minus the gap).
- **Counter-proposal — even-year span (Ted, POST 8):** Ted labels them `1788-1790, 1790-1792, 1792-1994 …` (election-year to next-election-year, the **even-year** boundary), liking even numbers and because elections sit before the calendar-year end. "2022-2024 era ends with the 2024 election; 2024-2026 ends with the 2026 midterms." Concedes the off-by-one ("2024 winner doesn't start until 2025") but "doesn't overthink it."
- **vcczar disposition (POST 11 pt.1):** likes the even-year option too; will **run a second two-option poll** (single-year span vs even-year span) to decide. So the *exact* final boundary was NOT settled in this thread — only that the single-year label is being abandoned for a span.
- **Inauguration-anchored alt (ConservativeElector2, POST 20):** start each era in **January of the "odd" year** (e.g. 1801) — the new historic President's inauguration (except the first era) — to avoid the "1960" confusion where a playtest opened by running the election.
- **Adjacent bug surfaced (Ted, POST 8):** the **age model** is coupled to the same off-by-one — "why is somebody still their 2022 age in 2023 and at least part of 2024?" Implies politician age should tick within a term, not once per 2-year turn.

**Engine-coupling note (shipped):** `src/phases.ts` keys cadence off `year` (`isElectionYear = year % 2 === 0`, `isPresidentialYear`/`isDraftYear = year % 4 === 0`); year is an integer turn counter, displayed directly. A span-label is fundamentally a **display/UI relabel**, but anything that parses or renders the year (turn header, age calc, election prompts) is coupled. → Candidate gap distinct from #216 (see below).

---

## STRAND B — Term-taxonomy ruling (THE #216 source)

### B1. Canonical category split — capture VERBATIM (vcczar, POST 11 pt.3, repeated POST 13)
This is the doctrinal ruling #216 must implement. Exact words:

> 3. Command, Legis, Military, Admin, etc. should be called **"Skill."** Economics, Welfare, Trade should be called **"Expertise."** Civil Rights, RW Activists, etc. Should be called **"Interests."** Charisma, Egghead, Magician, should be called **"Traits."** Native American, Woman, LGBT should be called **"Demographics."**

So the five canonical attribute categories are:
| Category | Members (examples as stated) |
|---|---|
| **Skill** | Command, Legislative, Military, Admin (+ Judicial, Governing per POST 8) |
| **Expertise** | Economics, Welfare, Trade, … (the industry/sector axis) |
| **Interests** | Civil Rights, RW Activists, … (the lobby/activist-leaning axis) |
| **Traits** | Charisma, Egghead, Magician, … (born or earned characteristics) |
| **Demographics** | Native American, Woman, LGBT, … |

- **Why (POST 8, 11):** the game currently uses **interchangeable terms** for the same axis — Command/Judicial/Legislative/Governing/Admin is variously called "skill," "expertise," OR "experience"; AND the Agriculture/Business/Economics axis is *also* called "expertise" or "experience." The ruling fixes one canonical word per axis. vcczar owns the inconsistency ("the flaw is my own… I use interchangeable terms… I'm not really a terminology person").
- **Authority/process:** vcczar will tag someone with rules-edit access to do the rename; **Willthescout7 volunteered** (POST 15) and was **granted suggest/edit access** (POST 16-19). Goal (Willthescout7, POST 15): make the rules legible to a 10-year-old so the coder (Anthony) doesn't miscode implied meaning. (Side note POST 16: the coder doesn't read the rules — vcczar narrates intended behavior to him directly.)
- **Doctrinal-terms principle (Willthescout7, POST 5; vcczar agrees POST 6):** beyond categories, EVERY action word (cancel, gain, roll, block vs cancel, …) must mean exactly ONE thing — citing board game *Oath* as the model. vcczar concedes the rules carry "a lot of outdated terms" from layered development (legis props, pres actions, etc.).
- **Scale of work / method:** renaming touches "many thousands of events, actions, proposals and rules" (ebrk85 POST 9). Ted: largely a **find-and-replace** (POST 12); vcczar caveat (POST 14): unsafe where the same word shouldn't be replaced in all contexts → can't be blind global replace.

### B2. "Cop" trait rename → Righteous / Virtuous (feeds #216)
- **Complaint (10centjimmy, POST 3):** "Cop" is confusing; if it's the antithesis of "Illicit," better terms = law-abiding, upright, **virtuous**, or **moral**.
- **Origin (vcczar, POST 4):** "Cop" was a filler word, modeled on **RFK** (anti-mafia, anti-corruption); term borrowed from Gore Vidal who called RFK "a cop."
- **Decision (10centjimmy, POST 7):** seconds the rename, recommends **Righteous** or **Virtuous**. (No explicit final pick recorded in-thread, but these are the on-record candidates; not yet shipped.)
- **Definition preserved (vcczar, POST 11 pt.4):** "Cop" = someone **uniquely natural as Attorney General** even if otherwise mediocre at admin (vs **Efficient** = routinely good at everything; vs **Illicit** = a *disaster* specifically at AG / a targeted weak spot). **vcczar keeps ALL overlapping traits — only the NAMES change.** ("I'm not changing this at all. Only the names of the terms.")

### B3. Biannual vs annual turn cadence → DEFERRED to AMPU-2
- **Floated (Ted, POST 8):** "Ideally we'd change rounds to be yearly instead of bi-annual. But then we'd have to change everything in the entire game."
- **vcczar ruling (POST 11 pt.2):** **"Maybe annual for AMPU 2."** Biannual is deliberate to **speed the game up** (a 500-hour game won't keep most players); if midterms didn't exist he'd use a 4-year turn. Explicitly frames AMPU-1 as "a solid draft for AMPU 2." → Mark **AMPU-2 / deferred-post-launch**, NOT a near-term gap.

### B4. Other trait/term renames floated in this thread (mostly overlapping the sibling terminology poll)
- **"Lowbrow" too negative** → maybe **"Commoner"** (vcczar later/sibling: settled as **Everyman**). POST 8, 11 pt.6.
- **"Egghead"** → maybe **"Wonk"** (vcczar: filler, from Adlai Stevenson II; happy to change, will poll). POST 8, 11 pt.6. (Shipped union still has `Egghead`, no `Wonk`.)
- **vcczar refuses several merges (POST 11 pts.4-5):** keeps **Illicit AND Controversial**, **Cop AND Efficient AND Integrity**, **Decisive General** separate (Decisive General = battlefield-only; Efficient = politics-only; he won't make Efficient drive battlefield). Pure flavor, intentional.
- **Lobby/Interest renames** (overlap sibling `b474593e`): **Human Rights ≠ Civil Rights** — Civil Rights is **exclusively re: Black Americans**; **LGBT + women's rights live under LW Activists**; **Human Rights = non-citizen / international** (Native tribes, anti-immigrant actions, sanctuary cities, AIDS-in-Africa). POST 11 pt.7. **Big Agriculture** can't just be "Farmers" — it's the **mega-farm/plantation** lobby (rural Big Corporations); small/family farmers excluded. POST 11 pt.8.

---

## Open questions (for the human / consolidation)
1. **Final year-label boundary undecided in-thread:** inauguration-anchored span (`1789–1791`) vs even-year span (`1788–1790`) — vcczar deferred to a second two-option poll (POST 11 pt.1). Which did the project adopt? Affects the exact label format #216-adjacent work would render.
2. **Final "Cop" replacement word** (Righteous vs Virtuous) not explicitly locked (POST 7).
3. **Age-tick model** (POST 8): should politician age advance within a 2-year turn? Possibly its own small gap; not currently flagged.

---

## Candidate gaps for consolidation
*(For the consolidation agent — this digest does NOT touch game-context.md / roadmap.md. Do NOT assign new numbers here; mapped to EXISTING IDs where clear.)*

1. **#216 SOURCE / AUTHORITY — term-taxonomy remap (the canonical category split).** This thread is the design ORIGIN of #216. Verbatim ruling (POST 11 pt.3 / POST 13): **Skill** = Command/Legislative/Military/Admin(+Judicial/Governing); **Expertise** = Economics/Welfare/Trade/…; **Interests** = Civil Rights/RW Activists/…; **Traits** = Charisma/Egghead/Magician/…; **Demographics** = Native American/Woman/LGBT/…. One canonical word per axis (kills the skill/expertise/experience interchangeability). Doctrinal-terms principle (one word = one meaning, Oath model) POST 5-6. QW22 blocking prereq for the (done) PV revamp.
2. **#216 CORROBORATING — Expertise "Military" → "Army".** Same union rename tracked under #216; acts on shipped `types.ts:185` (`Military` + `Naval` both present). This thread lists "Military" under Skill *and* Expertise overlaps; the Army rename resolves the Expertise side. (Authoritative ruling is in sibling `b474593e` POST 5/13/16/17.)
3. **#216 CORROBORATING — "Cop" trait → Righteous / Virtuous.** POST 3,4,7,11 pt.4. Definition preserved (uniquely-good-at-AG); only the name changes. Shipped `Trait` union has neither `Cop` nor the replacements → 3.0/forum trait not yet in build.
4. **#216 CORROBORATING — "Lowbrow"→Commoner/Everyman and "Egghead"→Wonk** (overlaps sibling `b474593e`). POST 8,11 pt.6. `Egghead` IS shipped (no `Wonk`); `Lowbrow`/`Everyman` not shipped.
5. **NEW (candidate gap, distinct from #216) — Year/turn LABEL rename: single year → term SPAN.** Relabel `1788`→`1789–1791` / `2020`→`2021–2023` (or even-year `1788–1790` — boundary deferred to a poll). UI/label change with **engine year-DISPLAY coupling** (turn header, election prompts, age calc) but NOT a cadence change. Motivated by "label 2020 should let me play the 2020 election." POST 1,2,8,10,20.
6. **AMPU-2 / DEFERRED-POST-LAUNCH — biannual → annual (yearly) turn cadence.** vcczar explicitly defers to AMPU-2 (POST 11 pt.2). Biannual is intentional for game speed. Do NOT schedule near-term.
7. **OPEN / candidate small gap — politician age-tick within a 2-year turn** (off-by-one age model). POST 8. Not currently flagged; may fold into the year-label work.
