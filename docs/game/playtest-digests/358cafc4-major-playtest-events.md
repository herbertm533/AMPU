# Digest — `358cafc4-major-playtest-events` ("Major Playtest Events")

**Type:** HIGHLIGHTS / RECORD thread (sibling of `bestmoments` / 4f90149c "Best
Playtest Moments"). **Span:** Jun–Oct 2022. **GM/author:** none — it is a shared
feed where many playtesters (Arkansas Progressive, matthewyoung123, Ich_bin_Tyler,
MrPotatoTed, Cal, Rezi, Murrman104, OrangeP47) post marquee election/event news so
**@vcczar can tweet them** (POST 1: "Just let me know which playtest it's from").
**Scope:** 1 chunk / 58 posts. **Value:** almost entirely corpus-coverage
cross-refs + a few incidental corroborations; **NO net-new architecture, NO new
hard gaps.** Each item is tagged by its source playtest (start year), which is how
this digest maps them to ingested vs still-needed playtests. Post numbers cite the
`===== POST n =====` markers.

---

## Event reel, grouped by playtest

### 1772-start (multiplayer, D-R/"Reds" dominant; Arnold→Lee→Butler→Hiester line)
Maps to the **already-ingested** `summer2021` / fe15db25 ("Summer 2021 AMPU
Playtest" = "1772 multiplayer I"); the Arnold→Lee→Butler→Hiester presidential line
is the same one recorded in `presidents` (5e00ec8e) and `calsleaderboard` (b0bf5d78).
- **1806 — Hiester D-R supermajority** pushes two Amendments: **women's equal voting
  rights** and a **1-term presidential limit** (POST 2). Systems: amendment machinery + supermajority.
- **1806 — House flips to the Reds 123-17** (POST 14, clarified "in 1806" POST 15).
- **1806 — Abigail Adams appointed Senator (MA), first woman in significant office**
  (POST 19) — downstream of the women's-suffrage amendment above. Gender-eligibility
  model (cf. NEW #238 in `georgemartha`).
- **1806 — Presidents #2 & #3 (Francis Lightfoot Lee, Pierce Butler) both die on
  July 4th** (POST 37, mirroring Adams/Jefferson). Benedict Arnold (President) still
  alive (POST 38-41); confirms there is a distinct "Benedict Arnold II" who is **not**
  related (POST 41) — a dataset namesake note.
- **1806 — rebellion + economic recession escalates into a "full-scale Civil War"**
  (POST 42). GM clarifies it is **"just a generic war," not regionally specified**
  (North/South or E/W) (POST 43-44). ★ Incidental mechanic: a **generic Civil-War /
  rebellion event in the 1772 era** distinct from the 1856-native scripted Secession
  Winter (see candidate gaps).
- **1808 — Dartmouth College v. Woodward decided ahistorically**: President Hiester,
  backing Justice Andrew Jackson's populist agenda, **compels his party's SC justices
  to vote for Woodward**, weakening the Commerce Clause / letting states revoke private
  charters (POST 46). Systems: Supreme Court cases + president-whips-co-partisan-justices.
- **1806 gubernatorial results** posted as a map (POST 6); note WV⊂VA, ME⊂MA (no
  statehood yet) — corroborates expansion/statehood timing.

### 1840-start ★ STILL-NEEDED (NOT yet ingested)
Two distinct 1840 runs surface here — confirms the **1840 / Manifest-Destiny start
exists and was played multiplayer/AI** but has **no ingested digest**. This is the
highest-value coverage flag (same one `bestmoments`/`presidents` raise).
- **AI-only 1840 run** (poster: Ich_bin_Tyler? / first 1840 item): **Texas admitted by
  wide margin, 1840-42 term**; Whigs & Democrats "mostly on the same page"; the only
  thing shot down was an **amendment requiring SC justices be ≥40 years old** (POST 3).
- **1842 midterms (Whig admin):** despite a booming economy, **Whigs lose 4
  governorships (incl. PA, NY), lose the House 132-92, barely hold Senate 28-26**
  (POST 8) — incumbent-economy-vs-results signal.
- **matthewyoung123's 1840 run** (the more detailed one; VP Tyler breaks Senate ties,
  POST 12): scandal forces **Henry Clay (Treasury) to resign** after gaining the
  **"easily overwhelmed" trait**; **Buchanan retires early "frustrated with politics"**;
  **Webster dies (TB), J.Q. Adams dies (dropsy)** (POST 12). **Oregon treaty w/ UK**;
  **War with Spain** (over Harrison backing Cuban rebels) **and War with Mexico** (over
  Texas annexation) both break out (POST 12).
- **War system in action (POST 16):** naval battles auto-resolve via **d100 vs a target
  number** ("needed a 33, rolled a 34" = narrow loss). Spain: 0-3 on land / cleared at
  sea; **need 5 land wins** to win a war. Mexico: Robert E. Lee wins Vera Cruz +
  Chapultepec, 2-0. Generals gain/lose traits (Perry +1 admin; Winfield Scott gains
  "incompetent" and is forced to resign; Cass promoted). ★ Cleanest tweet-feed view of
  the **command-led, d100, best-of-N war resolution** (cf. `0fd0f2e0`/war-rework + the
  shipped `revolutionaryWar.ts` d100 battle loop).
- **1844 presidential:** **Harrison (Whig) defeated by William Marcy** 223 EV / 55.7%
  to 58 EV / 44.3% (POST 20). ★ Decisive factor named: **lobbies** — Marcy/Guthrie had
  Agriculture + Military-Industrial lobbies hitting the agriculture/maritime-state
  majority; Harrison's lobby **impacted 0 states**; Harrison also took **-3 across the
  board for ongoing crises**. Author notes that **re-running without the -3 crisis
  penalty flips it to a Harrison win** — explicit datum that lobby coverage + crisis
  penalties are decisive in close elections.
- **1844 cabinet & General-in-Chief succession** appointed (Calhoun State, Cass War,
  R.E. Lee made GiC at 5-military + Military-Leader trait) (POST 23).

### 1960-start (Bricker admin; "Reds"=GOP, Dems split Progressive/Conservative)
No 1960-start playtest digest is named in the corpus index → **likely still-needed**
(or folded into a Cold-War-era thread; flag for consolidation to confirm).
- **McGovern-Fraser Commission (a "platform initiative") dies in committee 12-13**;
  amendments **abolishing poll taxes** and **granting D.C. 3 electoral votes** narrowly
  defeated (POST 5). House **kills Medicare 201-234 after backroom swaying** (POST 7).
- **Bricker vetoes NASA + defense-spending bumps citing budget; Congress did not
  override** (POST 10); a long signed agenda incl. OMB creation, immigration cap
  270k/yr, treating Cuba as a client state, etc. (POST 10). ★ Systems: **presidential
  veto + override**, policy/legislation menu, **backroom-swaying of votes**.
- **Policy initiatives mismanaged** ("Commission to Root Out Corruption," "War on
  Drugs") due to a cabinet sec **improperly filing paperwork**; Corruption Commission
  handed to an **inexperienced VP who fixed nothing**; War on Drugs raised national debt
  (POST 11). ★ Systems: **initiative success gated by assigned official's skill** +
  **national-debt tracking**.
- **SC turnover:** Black dies, Frankfurter retires; **Rehnquist & Burger confirmed
  79-21** (POST 13). 1962 leadership reshuffles posted (Speaker/Maj-Leader/Whip,
  faction-leader elections; "Democratic Socialist Dems" vs "conservative Dems")
  (POST 21-24). **Deaths phase:** nearly all factions lost 3 pols + retirements; a
  95-yr-old survives both rolls (POST 25). Corroborates the per-cycle **death/retirement
  roll** and **faction-internal leadership** systems.

### 2022-start / modern (maps to ingested `modern` cluster)
- **2022 midterms:** GOP retakes House 246-189 (+33) and Senate 51-49 (lose Kelly &
  Warnock, beat Portman); govs +3/-5 for Dems (POST 9). Corroborates modern-era results.
- **Republican party-leadership churn:** moderates flock to **Ivanka Trump** as a
  MAGA-vs-establishment compromise; Rubio's faction makes her faction leader; she
  **becomes Party Leader / presumed 2024 nominee over Donald** (POST 26-28). ★ Designer
  (vcczar, POST 29) explains the **party-leader election = "Kingmakers + a die"** rule:
  Ivanka had 1 Kingmaker but rolled great vs Donald's 4 Kingmakers rolling trash; the
  die was recently **changed 6→10-sided**. Long balance debate follows (POST 30-36):
  drop to d3 (Cal: dominant-faction-stays) vs keep d6 (Ted: keeps low performers in
  contention); Cal notes 11/18 Reds Kingmakers in his current 1772 game, and the only
  way to wrest a Kingmaker-locked party is to "pull a Trump" (win the Presidency + usurp
  PL). ★ Cal also notes the **current rules doc has no party-leader endorsement rule**
  at all (POST 36) — a designed-vs-doc drift flag.
- **2022-24 deaths/retirements:** Rand Paul (COVID), ex-Pres Carter & Clinton die;
  Romney & Pelosi announce 2024 retirement (POST 45).

### 2016-start (Murrman104; maps to ingested `populism2012`/2012-era cluster? — verify)
- **President Mark Warner + VP Jay Inslee re-elected** over Haley/Walsh, with a 3rd-party
  **Sanders/De Blasio** ticket (POST 47). "Sold DC to Canada" was a **map-render joke**,
  not a mechanic (POST 49-53).
- ★ **Third-party spoiler debate (POST 54-58):** Ted flags it's odd the **Sanders 3rd
  party did not visibly play spoiler** to the closest major party (Warner), citing
  Perot/TR precedent — wants 3rd-party rules to **punish the most-aligned party harder**.
  OrangeP47 attributes the blue-Texas oddity to dice / off-screen local events and warns
  against over-fitting. Murrman's recap: the 3rd party **did** cost Warner OH, SD, NH and
  nearly flipped NY/IL. ★ This is a clean corroborating exhibit for **NEW #228
  (third-party spoiler vote-drain)** first raised in `primary2020` — same design concern,
  independent run.

---

## Systems that drive the tweet-worthy moments (design-intent signal)
1. **Amendments** (women's suffrage, 1-term limit, poll-tax abolition, D.C. EVs,
   SC-justice-age floors) — the single most-cited source of "major events." Most are
   era-flavored real amendments routed through the in-game amendment machinery.
2. **Elections** (presidential EV upsets, House/Senate flips, gubernatorial maps) —
   with **lobbies + crisis penalties** repeatedly named as the decisive close-race
   factors (POST 20).
3. **Statehood** (Texas 1840) and pre-statehood territory notes (WV⊂VA, ME⊂MA).
4. **War** (Spain & Mexico 1840s; generic 1806 Civil War) — **d100 best-of-5 command-led**
   battle resolution generating the most colorful single-post stories (POST 16).
5. **Succession / deaths / scandals** — death-phase culls, July-4th double-president
   deaths, trait-driven forced resignations (Clay "easily overwhelmed," Scott
   "incompetent") — the per-cycle skill/trait/death rolls that reshuffle the board.
6. **Party-leadership (Kingmaker + die) elections** — the Ivanka-over-Donald upset and
   the ensuing d-size balance debate.

---

## Candidate gaps for consolidation (corpus-coverage + incidental; do NOT add as new hard gaps)

**Corpus-coverage cross-refs (the primary output):**
- **★ 1840-start (Manifest Destiny) is STILL-NEEDED / un-ingested.** This thread holds
  two 1840 runs (an AI-only run; matthewyoung123's detailed multiplayer run with
  Spain+Mexico wars, the 1844 Harrison→Marcy upset, the SC-age-40 amendment). Reconfirms
  the standing flag from `bestmoments`/`presidents` — **highest-value missing upload.**
- The **1772 items map to already-ingested `summer2021`/fe15db25** ("1772 multiplayer I";
  Arnold→Lee→Butler→Hiester line) — corroboration, not a new source. Matches `presidents`
  + `calsleaderboard`.
- The **2022/modern items map to the ingested `modern` cluster**; the **2016 items**
  (Warner/Inslee) likely belong to a 2012/2016-era run — **confirm against
  `populism2012`/2012-start; flag if it's a separate un-ingested 2016-start.**
- **1960-start is referenced but has no named digest in the index** (Bricker admin,
  Medicare-killed, McGovern-Fraser-dies) → **flag: confirm whether a 1960-start playtest
  is ingested or still-needed.**

**Incidental mechanics glimpsed (corroborations, all already in the gap log):**
- **Generic 1772-era "Civil War" from rebellion + recession** (POST 42-44), explicitly
  **non-regional**, distinct from the shipped 1856-native scripted Secession Winter
  (`eraEvents1856.ts`). Ties to the existing note that the 1856 Civil War is a different
  mechanism than the era-agnostic generic war — worth confirming whether a generic
  rebellion→war path is shipped or was a then-house-ruled outcome.
- **Party-leader election = Kingmaker count + a die** (POST 29-36); the die was changed
  **6→10-sided** then debated back down. **Shipped reality check:** the codebase has a
  Kingmaker/Protégé *trait* system (`KINGMAKER_RULES`, `phaseRunners.ts`) but **no
  party-leader-election die mechanic** in engine code → **designed/house-ruled, likely
  unbuilt.** Relates to existing #29/#30 and DH-5 (kingmaker-flip).
- **Cal: rules doc has no party-leader endorsement rule** (POST 36) — designed-vs-doc
  drift; relates to the endorsement/momentum spec in `primary2020` (#183).
- **#228 third-party spoiler vote-drain** — POST 54-58 is a fresh corroborating exhibit
  (Sanders under-spoiling Warner in 2016), independent of the `primary2020` origin.
- **Lobbies + per-state lobby coverage + the -3 ongoing-crisis election penalty** are
  named as decisive in the 1844 upset (POST 20) — corroborates the lobby/enthusiasm and
  crisis-modulation systems.

**Open question for the human:** is the **1960-start** (Bricker) and the **2016-start**
(Warner/Inslee) each its own playtest thread that still needs uploading, or are they
folded into already-ingested Cold-War / 2012-era runs?
