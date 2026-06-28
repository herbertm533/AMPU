# Digest — 0b896cf9 "June 2023 AMPU Playtest Updates" (topic 4480)

**Scope:** Cross-era playtest **highlight reel** (June 2023) — anecdotes pooled
for a backer email (POST 1 asks for concise, list/map-friendly updates). Three
campaigns surface: the **1868 Gilded Age** run (Bushwa777 — one of the "owed"
runs from owner backlog), the **1840 "original Civil War" run**
(matthewyoung123, single human player), and a **1774 founding** run. 27 posts,
1 chunk (~12k chars). Anecdotal — value is in **mechanics signals**, not
narrative. Page-2 posts (26-27) are stray SCOTUS-outcome notes from the 1972 and
1840 tests.

Participants: vcczar (owner/dev "Anthony"), MrPotatoTed (rules drafter "Ted"),
Bushwa777 / Imperator Taco Cat (1868 run), matthewyoung123 (1840 run),
Arkansas Progressive, 10centjimmy, jnewt. Era framing per
`docs/game/historical-context.md` §4 (Gilded Age 1868-1892) and the
Manifest-Destiny/Nationalism bands around the 1840/1856 runs.

---

## ★ Headline: impeachment STILL unfinalized — strong corroboration of gap #273 (POST 14-23)

The marquee signal of the thread. Sequence in the **1868** run:

- A **general event** rolls "improper SC justice," landing on **Associate
  Justice David Davis** (POST 17: *"It was gen event roll of improper SC
  justice. Then i rolled for the charges based on rules"*; POST 16: *"Roll a bad
  die"*).
- The GM then **rolls a charge list** off the (draft) impeachment rules. The
  House Judiciary Committee charges Davis with (POST 14):
  - **5** Abuse of Power
  - **2** Bribery
  - **8** Contempt of Congress
  - **1** Corruption
  - **1** Inciting Violence
  - **2** Obstruction of Justice
  - **1** Unethical Political Bias
- Davis **chose to resign rather than let it go to the US House** to consider
  the charges (POST 14). I.e., the shipped flow is **judicial-misconduct general
  event → GM charge-roll → accused resigns-or-faces-House** — but the House
  trial half is not codified.
- Combined with **Robert Cooper Grier's death** and **Noah Swayne's
  resignation**, this opened **3 SCOTUS seats** for the President to fill at once
  (POST 14) — see Reconstruction/SCOTUS notes below on over-large/empty courts.

Players immediately flag the gap (POST 18, 10centjimmy): *"@MrPotatoTed we really
gotta finalize those impeachment rules lol"*; POST 19 (jnewt): the gen event
*"does not tell what he did"* (no narrative for WHY the justice is corrupt — the
charge list is rolled, not story-driven).

**Provenance on the deferral (the load-bearing quotes):**
- POST 22 (MrPotatoTed/Ted): *"I think I had drafted some and @vcczar was going
  to look at them but never found the time to get around to it as other
  priorities came up."* → impeachment rules exist as a **Ted draft, never
  integrated by vcczar.**
- POST 23 (Ted): *"I'll get to them when **Anthony needs them**. He'll probably
  do all that **3.0 stuff last**, I assume. Basically, my policy is that **I'm
  not going to fix anything until Anthony needs it now**. The only exception is
  if something is game-breaking ... I don't think anything I'd consider
  game-breaking exists."*

This pins impeachment as **designer-DEFERRED-pending-code** (reinforces the b43
#273 "vcczar DEFERRED" tag with a direct dev quote and a date: June 2023) and
establishes Ted's **standing reactive policy**: rules work only happens when the
engine reaches it, slotted into a future "3.0" pass, never speculatively.

**Cross-ref to dead code / gap #270:** the misconduct→charge mechanic lives only
in **GM hand-rolling**, not in the engine. Verified in the codebase:
`pendingCourtCases: SupremeCourtCase[]` is declared in `src/types.ts:1587` but is
**only ever initialized to `[]`** (`src/data/scenario1772.ts:95`,
`src/data/scenario1856.ts:175`) and never populated/consumed by any phase runner.
There is **no `impeach*` symbol anywhere in `src/`.** So both the SCOTUS-case
pipeline AND impeachment are forum-live but code-absent. (The only "misconduct"
in the build is a flavor-only modern scandal anytime-event,
`src/data/anytimeEvents.ts:277` `scandal-modern-misconduct` — text only, no
charge/removal machinery.)

---

## Career-track 20-year payoff — concrete output example (POST 24)

matthewyoung123 (1840 run, sole human) drafts **William "Boss" Tweed in the 1848
Draft**, places him on the **Backroom Track**, and pulls him at the **20-year
cap (1868)** — POST 24 states the rule plainly: *"after 20 years, politicians
have to come out of the Career Track."*

**Traits gained on exit** (in addition to his pre-existing legislative ability):
**Leadership, Kingmaker, Admin +1, Education, Expansionist, Charisma, Orator,
Teflon, Unlikable.** Player then **manually shifted ideology MOD → CONS.**

Downstream snowball this enabled (one concrete career-track payoff narrative):
- Elected to Congress in the 1872 Democratic wave despite **Unlikable**.
- Won **Speaker of the House in his freshman term**.
- Became **faction head** → **+1 Command** from faction leadership.
- Gave a **convention keynote** → national attention → **+1 in the next national
  election cycle**.
- Re-elected 1874, kept the Speakership, became a leading **1876 Democratic
  presidential nomination** candidate — before being assassinated (below).

**Delta note (build vs. observed):** the build's track infrastructure is real —
`CareerTrack` type + `Backroom` track + `CAREER_TRACK_CAP` (per-faction slot cap)
in `src/types.ts:43-59,237`, and themed traits `TRACK_THEMED_TRAITS` map Backroom
→ `['Manipulative','Kingmaker','Numberfudger']` (`src/types.ts:212`). But the
**observed yield is far broader** (Leadership/Education/Expansionist/Charisma/
Orator/Teflon/Admin+1/Unlikable) than the 3 shipped themed traits, and includes
a **negative trait (Unlikable)** plus a **stat bump (Admin +1)** and an explicit
**20-year forced-exit cap** — confirming the gain pool / cap behavior is richer
in design than the small `TRACK_THEMED_TRAITS` list suggests. Cross-ref the
career-track gaps and **b44 #279 (3-class backdating)**.

---

## Convention assassination — "pineapple primary" event (POST 24, 12)

A random **"pineapple primary"** event can **kill a candidate at a nominating
convention**:

- 1876 Democratic Convention: a man rushes the floor, *"This is for the
  freedmen!"*, shoots **Speaker Tweed** (former-abolitionist assassin angry at
  Reconstruction's end). **Rolled `33/50` for death** → Tweed dies on the
  convention floor (POST 24). This is the in-game flavor on the gen-event roll;
  POST 24 explicitly tags *"(rolled pineapple primary event)"* and *"(rolled
  33/50)"*.
- POST 24 also records **Ulysses Grant murdered the same way at the Whig
  Convention in 1872** — *"the second presidential candidate to die at a
  convention in the past 4 years."* So the convention-assassination event has
  fired at least twice in this run.
- Blame is **deliberately unresolved** (rival? lone wolf? NY conspiracy?) —
  flavor, not a follow-on mechanic.

Signal: a **`pineapple primary` named gen-event** exists that can remove a
convention candidate via a death roll. (No `pineapple` symbol in `src/` — GM/
table-driven, not in the shipped engine.)

---

## War → territory acquisition (POST 25, 7, 3)

- **1840 run:** US fought *"a seemingly very easy war against Spain"* (its
  arch foreign-policy rival that playthrough) and **acquired Puerto Rico in
  1881-1882** (POST 25). A clean **war-victory → annex-territory** datapoint.
- **1868 run, Modoc War:** won *"With max mil prep, a stacked army leadership and
  in just one battle"* (POST 7) — a **single-battle war resolution** when
  military prep + leadership are maxed. (Note: POST 3 first reported the US
  *lost* the "Morall War"; POST 5-7 corrects — it was the **Modoc War**, won;
  the "Morrall/Morrill" confusion is a flavor sub-event where **Justin Morrill
  started a rebellion that tanked literacy rates**, POST 7. Also: **Philip
  Sheridan was fired**, POST 3.)

Signal: corroborates **b44 #277 (Canada war-acquisition mechanic gap)** with a
second war→territory example (Spain→Puerto Rico) and adds a **max-prep /
stacked-leadership → one-battle win** balance datapoint (Modoc).
Codebase: `expansionStates.ts` carries Puerto Rico as a territory entry, but
there is **no war-outcome → admit-state wiring** found tied to it.

---

## Reconstruction mechanics (POST 11, 14, 24)

The richest single mechanics post is **POST 11** (1868 run, 1874 midterms):

- **Ex-Confederates still cannot run for office** → a structural **drag on the
  Democratic Party**: it *"cannot field candidates in every race in the South."*
  Concretely, **Louisiana flipped** because the sitting Democratic Governor was
  **limited to a single turn** (no eligible Confederate successor to run).
- **Martial law in the South affects elections** (POST 11: *"Reconstruction is
  still in play in the South"* shapes seat expectations; POST 24's assassin
  motive is *"the end of Reconstruction"*).
- Counter-examples the engine still allows: **Andrew Johnson re-elected Governor
  of Tennessee**; Democrats make *"remarkable gains in the industrial regions of
  the North"* and come close in MA/NY/NJ/PA/OH/IL/OR.
- 1874 midterm results (House): **GOP 200 / Dem 102** (Dems net **+32**, clearing
  one-third); Governors **GOP 31 / Dem 14** (Dems net +2). Flavor: Speaker
  "Brainless Blaine" cured a cocaine addiction via brain surgery and held his
  seat by a slim margin.
- **SCOTUS over-large / empty seats:** the Davis resignation + Grier death +
  Swayne resignation leaving **3 simultaneous vacancies** (POST 14) signals the
  court can run **under-filled**; page-2 POST 27 shows a 1840-run court where
  *"Iron Fisted President Cobb's interference"* swung a jury-discrimination case
  (court packing/manipulation reaches into case outcomes).

Signal: **Reconstruction is a real, election-affecting subsystem** in the 1868
run — Confederate office-eligibility lockout + single-turn governor limits +
Southern martial law all bias elections. No `Reconstruction`/`Confederate`
office-eligibility logic found in `src/` (the matches are flavor/era-event text),
so this too reads as **GM-administered, not shipped engine.**

---

## Continental Congress failure modes (POST 10, 21)

- **1774 CC FAILED to pass the Declaration of Independence** — it *stalled in the
  **FA/Mil Committee 3 to 5*** (POST 10). Demonstrates the CC committee-vote gate
  can **kill flagship founding legislation**, not just delay it.
- Same turn: **Inaugural CC President James Armstrong tried to suppress "Common
  Sense"** and was *"soundly rejected by the Congress"* (POST 10) — a CC-President
  agenda action subject to floor override.
- **First Governors elected in the 1778-1780 term**: Reds 8, Blues 5 (POST 21;
  POST 21 corrects to this; an earlier note had said the same term differently).

Signal: CC is a genuine pass/fail body — flagship bills can fail in committee,
and the CC President's special actions are vote-checked. Cross-ref CC engine
systems (`continentalCongress.ts` / `firstContinentalCongress.ts`).

---

## Minor / corroborating notes

- **1840 run, Howell Cobb** wins a 2nd term **196-187 EV** on **55% PV** — an
  arch-Confederate with a **moderate reputation via good PR** (mildly pro-worker
  as a ploy to industrialize the South over the North) (POST 12). Branches:
  Governors 24-19 D, House 150-147, Senate 45-41. Datapoint: **reputation/PR can
  decouple from ideology**, and **narrow EV can pair with a popular-vote
  landslide** (electoral-college geometry working).
- **Founding deaths by flavor event:** Benjamin Franklin dies of pneumonia
  1776-78; Continental Navy Commander-in-Chief Esek Hopkins also dies of
  pneumonia (POST 13).
- **Page-2 SCOTUS outcome logging** (the campaigns track case-by-case ahistorical
  results): 1972 Burger Court's only ahistorical outcome — **6-3 AGAINST Shaw v.
  Reno** (Brennan, Marshall, Rehnquist dissenting) (POST 26); 1882-84 1840-run
  term had 4 cases — **racial jury discrimination upheld** due to President
  Cobb's interference (would've been 7-2 to outlaw it early), but **Native
  Americans found to be citizens**; other two historical (POST 27). Reinforces
  that SCOTUS cases are a tracked, swingable subsystem — yet `pendingCourtCases`
  is dead in the build (see above).

---

## Deltas vs. current build / signals (handoff)

1. **★ #273 impeachment STILL designer-DEFERRED (corroborated, dated June 2023).**
   Ted drafted rules; vcczar never integrated them; explicit dev policy "won't
   fix until Anthony needs it / 3.0 last / nothing game-breaking" (POST 22-23).
   No `impeach*` code in `src/`. Reinforces b43 #273 tag with a direct quote.
2. **★ Live judicial-misconduct mechanic that's GM-rolled, not coded.** Gen event
   "improper SC justice" → GM rolls a weighted **charge list** (Abuse of Power /
   Bribery / Contempt / Corruption / Inciting Violence / Obstruction / Unethical
   Bias) → accused **resigns-or-faces-House** (POST 14-17). The House-trial half
   is undefined. Cross-ref dead `pendingCourtCases` (`src/types.ts:1587`, only
   ever `[]`) / gap #270 — the whole SCOTUS-case + removal pipeline is forum-live
   but engine-absent.
3. **★ War → territory acquisition** confirmed twice: **Spain→Puerto Rico
   (1840 run, 1881-82)** (POST 25) + reinforces **b44 #277** Canada-acquisition
   gap. Plus **max-prep + stacked leadership → single-battle war win** (Modoc,
   POST 7) — a balance datapoint; no war-outcome→admit-state wiring in `src/`.
4. **Career-track exit yield is broader than shipped themed traits.** Backroom
   20-year pull gave Leadership/Kingmaker/Admin+1/Education/Expansionist/Charisma/
   Orator/Teflon/Unlikable + manual MOD→CONS (POST 24) vs. shipped
   `TRACK_THEMED_TRAITS.Backroom = [Manipulative,Kingmaker,Numberfudger]`
   (`src/types.ts:212`). Confirms **20-yr forced-exit cap**, stat bumps, and
   negative-trait gains. Cross-ref career-track gaps + b44 #279.
5. **`pineapple primary` convention-assassination event** can kill a nominating-
   convention candidate via a death roll (Tweed 33/50 in 1876; Grant 1872)
   (POST 24). Named gen-event; not in shipped engine.
6. **Reconstruction is an election-affecting subsystem (GM-run):** ex-Confederate
   office-eligibility lockout + single-turn governor limits + Southern martial law
   bias Southern elections (POST 11). No such eligibility logic in `src/`.
7. **CC failure modes are real:** flagship legislation (Declaration of
   Independence) can FAIL in committee (FA/Mil 3-5), and CC-President special
   actions are floor-vote-checked (Common Sense suppression rejected) (POST 10).
8. **Minor:** reputation/PR can decouple from ideology (Cobb, POST 12); SCOTUS can
   run with multiple simultaneous vacancies (3 open at once, POST 14) and case
   outcomes are swingable by presidential interference (POST 27).

**Open questions:**
- What are the *weights/dice* behind the misconduct charge-list roll, and the
  resign-vs-House decision rule? (Forum shows output, not the table — Ted's draft
  rules, never published here.)
- Is "pineapple primary" a single convention-disruption event with a sub-table
  (assassination among other outcomes), or assassination-specific?
- Exact trigger/duration of the ex-Confederate office lockout and when it lifts
  (tied to per-state Reconstruction end?).
- Career-track gain pool: is the broad trait set random-from-pool or
  track-weighted, and what governs negative-trait (Unlikable) draws?
