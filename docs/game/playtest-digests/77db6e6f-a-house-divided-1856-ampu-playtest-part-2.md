# `77db6e6f` — "A House Divided 1856" AMPU Playtest, **Part 2** (final digest)

**Two-stage reduce, stage 2 (final).** Consolidates the three section-digests
(`section-A.md` chunks 1–50, `section-B.md` chunks 51–100, `section-C.md` chunks
101–148) of the 148-chunk / 9051-post thread
`77db6e6f-a-house-divided-1856-ampu-playtest-part-2` (politicslounge.com topic
5306; real-world Apr 2025 – Mar 2026). Citations are `POST n` from the
`===== POST n =====` markers (preserved through both reduce stages). The raw
chunks/partials/sections are gitignored scratch; **this file is the durable
provenance.**

> **What makes this thread uniquely valuable** (it is the **4th** ingested
> thread and re-confirms a large swath of the existing gap log, so most of its
> content is *corroboration*, deliberately compressed): it is the **first
> 1856-native end-to-end procedural record** AND the first to play the
> **Civil-War / Reconstruction era machinery**. It is also the clearest single
> piece of evidence that **the forum playtests are the design source of truth
> that drives the browser build** (see §0 and §S-10).

---

## Thread scope & meta

- **First 1856-native procedural record.** Prior 1856-era knowledge came from
  threads that *reached* 1856/Gilded as a continuation of an 1800 start; this
  one **boots at 1856** and is the native antebellum→Civil-War source. The
  shipped `scenario1856.ts` is the build this most directly tests.
- **Multiplayer, async, GM-adjudicated over Google Sheets + Discord, all dice
  `roll/threshold`.** GM **`matthewyoung123`** ("Matt"); co-GM **`Arkansas
  Progressive`** (= `ebrk85`, "Ark"/"Anthony") runs Lingering + Legislative +
  Congress math; **~10 human factions** (5 Red/GOP + 5 Blue/Dem) + CPU-run
  absentee factions (RingCPU/FreezerCPU/MattCPU); players churn, get CPU'd,
  swapped, and inherited by new joiners — a **shared cross-thread player pool**.
  The engine **designer `vcczar`** appears in-thread (mostly spectator, but
  *rules and changes the engine live* — §0); **`MrPotatoTed`** + `ebrk85`
  co-adjudicate (POST 8649–8672). Rules doc cited as living **v2.9.2 / v2.9.3 /
  "3.0.40"**.
- **Alt-history**, running **1856 → mid-1904** (~48 in-game years), crossing
  **Nationalism → Gilded Age (1868, POST 2151) → Progressivism (1892, POST 6681,
  7264)**. Diverges from `docs/game/historical-context.md §3–§5`: **Seward
  (not Lincoln) wins 1860 & 1864**; **secession ~1863** via a bungled **John
  Brown's Raid** presidential decision (not 1860–61); **CSA president John A.
  Quitman** (VP John Letcher), with Jefferson Davis instead seated as the
  *Democratic* party leader; **Lincoln nominated only in 1868**. Sim runs ~2 yrs
  behind real history (POST 7209).
- **Ends mid-1904 GOP Group-3 primary with no nominee** (POST 9051) — a **live,
  ongoing game**, not a completed campaign.
- **~50-state map including 8 Canadian provinces** (AB, BC, MB, NB, NL, NS, ON,
  QB, SK; full set enumerated POST 8684) + western/island territories admitted
  through the timeline; EV totals climb 385→399→411→… as states enter.
- Metagame confirms a **shared multiverse of forum playtests** whose canonical
  era ladder runs at least to WW1/1916 and beyond ("2028 draft," "Era of the
  Distant Future," POST 8208–8213; a "1840 playtest reached WW1," POST 6500).
  Unrelated games ("Game of Nations: Napoleon," POST 8001) are noted only so a
  future reader does not mistake them for AMPU eras.

---

## §0. THE HEADLINE META-FINDING — the forum DRIVES the build

Two pieces of direct, dated evidence that the playtests are the design source of
truth (which validates this entire ingestion effort):

1. **A live engine change, requested mid-thread, shipped into the playtest.** The
   designer **`vcczar` asked whether relocation was too easy**; the GM proposed a
   **cap of 4 non-alt-state relocations per half-term** ("let's see if Anthony
   can add a limit of 4 moves to the code," POST 7062–7066). **By chunk 120
   (POST 7555) it was LIVE**: "You can ATTEMPT to move a TOTAL of FOUR pols.
   Alt-state moves don't count." → The forum changed a balance number on player
   request and it went into the running game. **Codebase check: the shipped build
   is still at `RELOCATION_ATTEMPTS_PER_TURN = 5` (`src/types.ts:247`)** — i.e.
   the browser build has NOT yet caught up to this design change. (Confirms gap
   #38, and the direction = 4.)
2. **Designers adjudicate rules holes live, in-thread**, then flag them for a
   per-action data flag + appendix (the blundered-implementation ruling, §S-9 /
   POST 8649–8672). The rulebook is explicitly "an oral tradition" edited mid-run
   (POST 748–765); text like `2.92` / `3.0.40` is a living doc.

**Implication for the build:** the canonical spec is whatever the latest playtest
plays, not a frozen rulebook. The browser engine should be reconciled against the
*most recent* forum behavior, and a few shipped constants (e.g. the relocation
cap) already lag the design.

---

# PART I — The unique 1856-arc systems (this thread's headline value)

These are the systems NOT surfaced by the prior three threads (gilded/fed/1772s/
modern). They are the antebellum → Civil-War → Reconstruction machinery and the
Progressive-era finale specifics. **Each maps to a NEW gap-log row.**

## I-1. Civil War — two-theater combat engine (multi-term subsystem)
The headline unbuilt system. Fought over **multiple half-terms** as a structured
subsystem **separate from the normal turn loop** (POST 1332, 1710, 1977, 1979).
- **Two theaters (East & West), both must be fought**; each theater requires **3
  naval victories before ground combat can begin** (Admirals/Ironclads first).
- **Per-battle success %** = `base − Difficulty (Easy 0 / Mod −10 / Difficult
  −15) + Planning (Sec War + Sr General skills; Sec Navy + Sr Admiral for naval)
  + Officer (Military ×10, +10 if Decisive General) + Meters (+15) + Benchmarks
  (+15)`, then a **d100**.
- **War Score per theater:** +1 easy/naval win, **+3 Difficult land win**, −1
  loss; **+10 ⇒ theater auto-wins** (POST 1977); else an end-of-phase roll vs
  `WarScore × multiplier %` decides whether the war carries to the next half-term
  (it did, repeatedly).
- **Named historical battles** (Hampton Roads, Charleston, New Orleans,
  Galveston, Mobile Bay, Antietam, Shiloh, Chickamauga, Vicksburg, Wilderness,
  Atlanta, Drewry's Bluff) **kill named pols on the military career track**, both
  sides (Rufus Bullock KIA Mobile Bay, POST 1332; Lee can win Chickamauga for the
  CSA). Winning officers gain Leadership/Military Leader/+1 Military/Decisive
  General/Celebrity, lose Obscure. **`Naval experience` ≠ a `Naval` trait** and
  is required to be an Admiral (POST 1325, 1329).
- **Global modifiers while active:** incumbent party **−2 in all elections** at
  crisis DomStab (POST 1408); opposition-VP penalty reduced by 1 (POST 1396);
  per-term **"Major War Impacts"** Lingering rolls (POST 888, 1196).
- **War end (POST 1977):** Union victory → Treaty of Appomattox; +250 to
  Nationalists/Civil-Rights/Wall-St/Big-Corp/Mil-Ind/Globalists; **President
  gains a PERMANENT +1 in ALL elections** for winning the war; seceded states
  enter **Reconstruction** (not "back in the Union"); 25% post-victory "CSA
  Guerilla War" roll (didn't trigger).
- **War-hero down-ballot bonus:** a General with Military skill gets **+1 in
  EVERY state** if a major war ended **<20 yrs prior** (decided the 1884 race;
  POST 3942, 4767). NB: war end-year is ambiguous in-timeline (1866 vs 1867) —
  affects the window; **verify** (POST 558-binding note in section-B).
- **Tiered war framework (generalizes #45):** the same engine runs **Major /
  Minor / Operation** tiers with different end-war multipliers and reward
  packages — US-China Naval War (Treaty of Melbourne, POST 1723), Red Cloud's
  War / "Generic Indian War" (Operation ×2, Treaty of Palo Duro, POST 1871,
  1979), Naval War with Spain → US gains Puerto Rico (Treaty of Charleston, POST
  2985, 3195). Allies (UK, Russia) assist. **Data defects:** two distinct
  China-war events (POST 1725–1729); stale "Generic Indian War" event text for
  what is really Red Cloud's War (POST 1872–1874).

## I-2. Secession + Southern-Unionist trait gating (the antebellum payoff)
- **Secession is a scripted Era-Event chain**, triggered here by President Seward
  **blundering** the **John Brown's Raid** decision (response B, 0 Judicial,
  "Hard" event): rule text *"Automatic secession convention and Civil War if
  response B blunders"* (POST 1166). **One bungled presidential decision forced
  the war.**
- **CSA forms as an event** (POST 1168): 11 states leave (FL GA AL MS LA TX SC
  NC TN AR VA); border states **DE MD KY MO** handled separately (pols there may
  individually secede even if the state does not).
- **Per-politician secession roll** (POST 1175): pols of seceded/border states
  **become inactive (moved to a "Secessionists" tab) UNLESS they have the
  `Southern Unionist` trait**; 302 pols seceded; loyal notables stayed (Andrew
  Johnson, Alexander Stephens, CJ Taney of MD). **`Nationalist` trait → roll to
  stay** "Andrew Johnson style" (Stephens did, becoming the 1864 D nominee, POST
  1422–1425). Newly drafted/career-track pols from seceded/border states without
  `Southern Unionist` **auto-become Secessionists** — the draft dataset carries
  the trait (most Southern Republicans have it; few Southern Democrats) (POST
  1446, 1452, 2152). **Can't relocate INTO rebelling states, only out** (POST
  1469, 1607).
- **CSA gets its own gov structures as events:** Provisional Pres Quitman, VP
  Letcher, Army Cmdr A.S. Johnston, Sr Admiral Buchanan, capital Richmond, UK
  recognition threat (POST 1168).
- Unadopted player house-rule: border-state pols should secede **by ideology**
  (Cons 50% / Trad 75% / RW-Pop 90%) not a blanket roll (POST 1495).

## I-3. Reconstruction readmission subsystem (end-Nationalism → Gilded)
After Union victory the 10–11 ex-Confederate states sit **under Military
Reconstruction**: military occupation / districts, **President appoints military
Governors (2-yr terms)**, **no congressional representation** until readmitted
(POST 1987–1988, 2320).
- **Readmission is a per-state BILL** through the normal committee→floor pipeline
  ("Tennessee/Florida/Louisiana/… Reconstruction"); on passage the state
  re-enters and **Gov/Rep/Senate elections fire** (POST 2111, 2332, 2589, 2670).
- **Three readmission plans** (Executive Action, POST 1987–1988): **(1) Ironclad
  Oath / Strict Loyalty** → readmitted state gets **+2 toward the incumbent party
  for 4 cycles (8 yrs)**, a time-boxed event-sourced bias modifier (e.g. SC "+2
  Red until 1882"); **(2) Military Districts / Martial Law** → 5 districts,
  appointed Govs, no representation, requires the 14th-equiv Amendment to
  readmit, **ex-Confederate pols barred until pardon**; **(3) Pardon Confederate
  Soldiers** (rank-and-file only, can't be deactivated).
- **The +2-Red bias SUNSETS** mid-1882 for AR/MS/SC/TX/VA (TN earlier);
  readmission **also adds Black voters** (enfranchisement can flip down-ballot;
  **P.B.S. Pinchback = first Black governor**), after which Southern Govs deploy
  **segregation/literacy/disenfranchisement** Gov actions (POST 3532–3561,
  3945–3965, 4179–4297, 4493).
- **Amnesty / citizenship is itself contested law** via competing bills
  ("Strip citizenship of Confederate leaders, pardon others," "Mass Trials").
  On passage of strip-leaders the engine **removes the named CSA leadership pols
  from the game** (Pres/VP/Generals/Admirals/Cabinet + state officeholders at
  secession) and **returns all other pardoned pols to their origin factions** —
  players then prune Kingmaker pairings whose members were removed (POST 2640,
  2641).
- Reconstruction interacts with the Right-to-Vote amendment; "African-Americans
  can now hold office" (POST 1960). **Moving INTO a recently-reconstructed state
  doubles the Carpetbagger chance** (POST 2445, 3024).
- Reconstruction era-event spine: First KKK, Reconstruction Riots, Lost Cause,
  **Plantation Economy ends → converts Plantation industry → Agriculture (2:1)**,
  Colfax Massacre, White League/Red Shirts, KKK/habeas bills, **Jim Crow Laws**
  (unlocks a Gov "State Segregation" action = triple points 30 yrs, POST 3094).
- **GM HOUSE-RULING GAP — fate of loyal Senators/Reps from seceded states** put
  to an A–E vote, no fixed rule; "in 1840/1856 we did option D" — **era-
  inconsistent** (POST 1182–1194).

## I-4. Free/Slave sectional-balance crisis scoring (the Nationalism crisis engine)
The defining Nationalism-era mechanic, retired on emancipation. At half-term
close, if **free states outnumber slave states** (triggered when KS+OR admitted
free, POST 302): **Speaker & Senate Pro-Tem each −250 + −1 next election; all
Moderate factions −250; DomStab −2; Party Pref +2 Red; Civil Rights +250 /
RW-Activists −250; all RW-Activist candidates +2 next election** ("livid") (POST
302, 747, 1070). **Removed entirely once slavery is abolished** (POST 1766). →
Requires a sectional free-vs-slave state counter feeding score/meter/election
effects, keyed to the Nationalism era, retired on the 13th-Amendment beat.
(Codebase note: `SLAVE_STATES_1856` exists in `src/types.ts` but no such crisis
scoring.)

## I-5. Canada conquest → era-gated territory→statehood + Canadian draft
This alt-timeline **annexes Canada** (Mid-Century War, POST 528–531: "1st
playtest to ever acquire Canada"). Provinces then enter via the territory →
statehood bill pipeline, **era-gated**:
- In the **1856 era only Quebec → straight to statehood** (no territory step);
  **Ontario** must be a territory first; **Newfoundland, New Mexico, Utah/Deseret
  statehood are LOCKED until the Gilded Age (1868)** (POST 787, 916–933).
- **Quebec admitted as a STATE mid-war** (POST 1307) with a **special Canadian
  draft of ~70 historical Canadian pols** (Cartier, Galt, McGee, Mackenzie,
  George Brown, Laurier, Macdonald; region "Canada," POST 1301, 1321).
- **Canadian-born pols can run for President once all of Canada is in the US**
  (POST 2009) — a relaxation of the native-born rule (ties to I-6).
- **Canada-states electoral penalties (1856-specific):** a candidate unpopular in
  Canada takes **−3 in Canadian states**; a cabinet with **no Canadian member →
  −1 for the President in Canada** (POST 3942, 4154, 3731).
- Reaches **9 Canadian states by 1884** (BC = "Vancouver"/"New Albion," vetoed
  then admitted). **Codebase note:** `src/data/expansionStates.ts` already lists
  all the Canadian provinces (region 'Canada'), so the *roster* exists — but the
  **era-gated admission rules, the Canadian draft pool, and the Canada election
  penalties do not.**

## I-6. Succession / eligibility / acting-president crises (highest-value, 1856-specific)
Two succession crises expose constitutional gaps:
- **1883: Pres Matthews assassinated** (random evo; motive = opposing women's
  suffrage). VP Morton succeeds but **no mechanism to fill the VP vacancy
  pre-25th-Amendment** → seat stays empty; party leadership passes to the
  highest-PV faction leader (POST 4472–4480). Era-aware VP-vacancy gap honored.
- **1886: Pres Grant AND VP Shufeldt die in the same death batch** → succession
  crisis. Speaker **Alexander Mackenzie is foreign-born (Scottish) →
  constitutionally INELIGIBLE**; per rule 2.4 the **Senate Pro Tempore becomes
  ACTING President** → **Paris Gibson, with 0 Command, becomes the 21st President
  and is fully inert**: can take **no** executive actions, cannot compel SCOTUS
  retirements, and is **ineligible to be elected** in 1888 (POST 5414–5471,
  5581).
- **Line of succession is house-ruled by passed legislation** — they made the
  **Speaker 3rd-in-line** (instead of SoS) back in 1864 (POST 5466); later (in
  the Progressive era) a bill **moved SoS back to 3rd in line** (POST 7795). A
  **"Require President to Fill VP Vacancy" Amendment** did not exist (Dems had
  blocked it); proposed/passed this cycle, ratifies in 1888, **applies only to
  the NEXT vacancy** (POST 5470, 5573).
- **Foreign-born faction leaders are ineligible for the Presidency** (POST 5448).
- → Build needs: a **configurable line of succession**, **native-born/foreign-
  born eligibility gating the presidency**, and an **acting-president state whose
  Command (often 0) governs what they can do.**

## I-7. Contingent House election — top-2 vs top-3 house-rule deviation
1888 went 3-way (Blaine R 197 / Shortridge D 196 / Saltonstall "Conservative" 23;
208 needed) → no EC majority → **contingent election in the House** (POST 5713).
- **Deviates from the 12th Amendment:** GM uses **top 2**; a player cited the
  constitutional **top 3** and GM **overruled with "Game rules"** (POST
  5720–5721). **Explicit documented house-rule deviation — build must pick a
  stated rule.**
- Each **state casts 1 vote** by the majority party of its House delegation (tie
  → Governor's party); 29 of 56 needed. **Shortridge won 35-21** (first elected
  Democratic President since 1856 in-timeline; first since JQA 1824; first **LW
  Populist**). **Senate elects the VP** (party vote → Hancock) (POST 5713–5762).
- **Tied-House control rule (edge case):** 1890 House = **152-152**; control of a
  tied House goes to **whoever does NOT control the Senate** (inverse
  tiebreaker); Senate stayed Dem so GOP got the tied House (POST 6229, 6257).

## I-8. Primary Era — state-opt-in primaries → Presidential-Primary Groups 1–5
The marquee Progressive-era new system (POST 6879, 6900–6907; full dumps
8200–8237, 8947–9051). **The primary calendar is emergent from gameplay:**
- A **Governor action "Allow/Activate State Primaries"** turns a state into a
  primary state, set **winner-take-all / plurality / proportional**, assigned to
  a **Primary Group 1–5** by random roll (POST 8103). Once any state has them,
  the game enters the **Primary Era** (primaries run BEFORE the convention).
  1896 ≈11 primary states → by **1904 ALL states have primaries** (player-pushed
  via bills + Gov actions; debated at 8947–8949 because primaries grant "more
  actions" + less party-leader control).
- The party's designated Gov also **buckets states into 5 delegate Classes/Groups**
  (POST 8530); larger group → more delegates; delegate math differs per party
  per state (1896 GOP 1090/546, Dems 957/638; 1904 GOP 1211/606, Dems 1119/746).
- **Groups vote in sequence**; **Momentum carries between groups but halves when
  large**; per-group **debate** scored numerically (win-by-2 → +Momentum +
  ideology-meter shift); 1st in Grp1 = +1 enthusiasm + +2 next group.
- **Per-group candidate actions** (d6, trait-modified): pick **3 Focus States**,
  Presidential Promise (VP/cabinet/SC seat for a drop+endorse), Embrace Local
  Issue (risk ideology shift), **Withdraw+endorse** (75% deleg to endorsee) /
  **+release** (25/25/25/25 similar-ideology / front-runner / party leader /
  lowest faction) / **+hold**, Major Speech (once/primary), Campaign Focus,
  Attack Rival. **Broke check** each group (d6) knocks out underfunded trailers
  (POST 9045).
- **Incumbent block:** Iron-Fist+Leadership incumbent (Blaine) has 90% to block
  ALL same-party challengers (Passive 50%, else 75%); if blocked, only sub-half-
  enthusiasm factions (or a Pacifist in major war) may challenge; a Kingmaker
  president → only the lowest-enthusiasm faction may. **Rule:** a LW/RW Pop
  cannot endorse a Moderate unless a Mod is the only other candidate (POST 8226).
- **Resign-to-run** (POST 9016): appointees must resign to run (SC Justices &
  appointed Senators only 25%); Cong officers resign the post but keep the seat;
  20% a Gov/Sen/Rep resigns the *seat*; **Pres/VP never resign to run**.

## I-9. Amendment ratification by 3/4 of state Governors — era-keyed, then tunable
- **1856 rule:** amendment needs **2/3 of BOTH chambers**, then **3/4 of state
  Governors** to ratify (National Suffrage failed ratification 24-9, needed 25/33
  states) (POST 503, 518). **Ratifier = Governors; threshold = 3/4 of states.**
- **Made a tunable game mechanic:** they later passed an amendment changing the
  threshold to **2/3**, with a posted **Ratification Options table** (2/3 +Mods;
  3/4; 50%+1 +Progs/LW-Act −Trad/RW-Act; Unanimous +Trad/RW-Act −Prog/LW-Act;
  Popular Vote +Prog/Reform) (POST 1721–1722). By the Gilded Age the default is
  **2/3 of states** (the 1865 14th-equiv set it, POST 2974). → distinct from
  `modern`'s fixed 40/53-Governors; **ratifier + threshold must be an era-keyed,
  in-game-changeable field** (extends gap #39).
- **SCOTUS↔legislation coupling enforces amendment necessity:** income tax ruled
  a direct tax by **Pollock v. Farmers' Loan 5-4** in the SCOTUS phase → **blocks
  any income-tax bill until a Constitutional Amendment passes** (POST 7250, 7252,
  7273); the Income Tax Amendment needs ⅔, failed repeatedly, ratified by 1904
  (POST 8979). Demonstrates a SCOTUS ruling that **changes what legislation is
  legal** (extends gap #52's "rulings deactivate laws").

## I-10. Investigation "3.0.40" — authored 5d6 special-committee spec (fills gap #54)
The build/forum lacked congressional investigations; this thread **first
improvised, then authored a rule** — the concrete spec gap #54 was missing:
- **Early stopgap (1856):** no rules existed, so the GM **borrowed Court-Martial
  rules** — d6: 1-2 removed from game / 3-4 removed from office / 5-6 absolved
  (Bonham the Sumner-caner rolled 4 → removed from House) (POST 202).
- **Authored rule "3.0.40 Congressional Special Committee Rules" (Gilded):**
  Speaker forms a committee (Chair + Ranking + 3 members); **roll 5d6** + mods:
  **−2 if target has Leadership; +1 if no member shares the target's faction; +3
  if target's ideology is >1 slot from all same-party members; +4 if target is
  Controversial**; total **21–25 ⇒ guilty (resign, barred from cabinet)**. On
  guilt: same-party 5% Integrity, opp-party 10% Leadership/5% Integrity, 10% +1
  Honest Gov (POST 2585, 2591, 2651). (AG Begole / Trader Post Scandal.)

## I-11. The Progressive-era institutional layer (offices created in-game by law)
Offices created **in-game by legislation/exec-action**, evolving the cabinet far
beyond the build's `cabinetSeatsForYear`:
- **Federal Reserve + Fed Reserve Chair** (POST 6963, 7160, 8845): 6-yr term;
  Economics/Trade/Business + Admin≥3 + age≥35; declines 90% if previously held
  office. **Creating the Fed DEACTIVATES the Independent Treasury.**
- **Chief of Staff** (+1 exec action) and **Chief of Naval Operations** (replaces
  "Senior Admiral," 4-yr term) — each grants the President an extra Command point
  (Blaine 5 → 6) (POST 6976, 7348, 8175).
- **FBI** created by bill (SR.6) → **FBI Director** (10-yr term, Justice + Admin≥3,
  declines 90% if ever held elected office, doesn't count vs the 5-retention cap,
  Senate-confirmed) (POST 7800–7804).
- **Commerce AND Labor split into two departments** (POST 7160). Other artifacts:
  National Monetary Commission, Border Patrol, FDA, National Commission for
  Conservation, Guam Territory.
- Cabinet reaches **~21 posts** (Pres, VP, Key Advisor, State, Treasury, War, AG,
  Interior, PMG, Agriculture, Commerce, Labor, Navy, FBI, Fed Chair + 7
  Ambassadors). **PMG must be same-party + have Kingmaker trait.** (Corroborates
  & extends gaps #25/#31/#49.)

## I-12. Lingering — the ~16-meter homeostasis engine (+ inactive "Israel")
- **Meter set** (POST 7216, 8503, 8896): Revenue-Budget, Economic-Stability, **8
  foreign-relation tracks** (UK/France/Spain/Germany/Russia/China/Japan +
  **"Israel" — present but INACTIVE/0**; the resolver literally prints "Skipping
  Israel — inactive"), Military-Prep, Domestic-Stability, Honest-Government,
  Quality-of-Life, **Planet's-Health**, Party-Preference, + **7 per-ideology
  enthusiasm tracks** (±3, named bands). Foreign meters are **era-gated** (added
  as nations become relevant; Israel's activation rule unknown). **Planet's
  Health activated 1890** by the "Conservation Movement Begins" Era Evo (set
  7=Stable; POST 6431, 6863) — active in a 19th-century scenario.
- **2.5.1 Lingering = a deterministic ~9-part resolution:** top/bottom-2 econ;
  maxed-meter caps (**Mil Prep & Planet Health hard-capped at 8**); lingering
  bill/action effects; **middle-of-meter drift** (revision-to-mean −1);
  volatility rolls for tax/tariff bills; income/tariff decay (bills expire at 10
  yrs; tariff rate **locked 8 yrs** after a change); **administrative
  modifications** (each cabinet officer rolls ± its department's meter); ongoing
  wars; corruption. **Policy-gated caps:** QoL can't exceed 7 without national
  Healthcare ("No Healthcare, so still capped at 7," POST 8896); Honest Gov 8 →
  all Controversial candidates −1 next election; Honest Gov 9 → forbids
  Gerrymander & political machines.
- The output reads **engine-automated** ("net change," "Capping meters to avoid
  overflow") yet the GM calls it hand-computed (POST 8897) — a spreadsheet macro,
  not a true engine. (Strongly extends gap #50; **codebase note:** shipped
  `NationalMeters` has only the 7 base meters incl. `planet` at `types.ts:1406` —
  no per-power relations, no enthusiasm tracks, no Israel placeholder.)

---

# PART II — Mature mid/late systems (CORROBORATE prior threads — compressed)

These re-confirm existing gap-log rows across the full 1856→1900 arc with concrete
1856-native numbers. **They are NOT re-expanded; each just gets "1856-native
(House Divided)" added to its evidence and a confidence bump.** Cited tightly.

- **Conventions (#13/#14/#15)** — full ballot loop with **Momentum** (carries
  across cycles, drop-outs transfer it), **Command = # inter-ballot actions**,
  candidate tiers (Major/Minor/Favorite-Son), nominator/keynote d6, **rejectable
  Presidential Promises**, host-Governor delegate setup, VP-pick + PL override.
  **Asymmetric R/D thresholds** (Dems **3/4** vs GOP **2/3 → ½+1**), **mutable
  and persistent across conventions** (POST 3261, 3893, 4646–4726, 5594–5713,
  8247). Platform = **5 planks**, 3-test scoring, planks-as-law score ×3 (POST
  3262, 3291–3295, 6917). **Presidential-promise DIRECTION ruling:** offer-DOWN
  / request-UP only (POST 3268, 3922–3924).
- **General election (#16/#17/#18/#19)** — 2 action sub-phases (Summer/Fall),
  Incumbent-Uses-Office, VP region speech, **Scandal Roll** (Integrity immune,
  Teflon/Propagandist/Media spin), **October Surprise** (Primary-Era-only),
  down-ballot coattails (≥67% in a state → +2), tie-broken states, **Election
  Challenge** (25% / 50% Controversial / 100% +Propagandist) (POST 3301–3316,
  3942–3952, 4767–4778, 7471, 7492, 8265, 8272).
- **Legislation pipeline (#8/#9/#10/#11/#12/#12b/#42)** — proposers → committee
  block/replace (chair Legislative > proposer's AND proposer lacks Efficient) →
  committee vote → package (amendments stand alone) → floor → **Shenanigans**
  (Debater/Orator/Magician/Puritan flips) → **filibuster** (Disharmonious twice;
  carries to next session, re-passes both chambers; **no Cloture until the
  Cloture bill passes**, ⅔) → sign/veto (override ⅔) → points + enthusiasm
  resolution. **Crisis bills** (failure penalties; majority-fail blames Speaker).
  **"Cannot propose a bill that hurts your own faction"** (even free). **Procedure
  bills skip presidential assent** (POST 3492–3524, 5123–5177, 6179–6211,
  8166–8167). Cabinet **free dept proposals** (unused = −50/−100).
- **Lingering / meters → election (#18/#50/#51)** — see I-12; per-meter election
  bonuses + midterm −1 incumbent (POST 264, 270, corroborated).
- **SCOTUS (#52)** — named (often **ahistorical**) docket voted by Justice
  ideology, Chief +100 / Assoc +50; **dynamic court size** (grew to 10);
  **compelled retirement** (Manipulative/Iron-Fist, age≥75 OR ≥12 yrs; **5
  Judicial + Integrity immune**); justice ideology drift ~every 10 yrs; **5-5 tie
  affirms lower court, sets no precedent** (POST 8536); rulings change legal law
  (Pollock, Cruikshank, Plessy) (POST 4616–4632, 7250, 8181, 8536, 8651).
- **Cabinet (#25/#31/#32)** — ≥2/≥3 Admin gates, ≤16 cumulative cabinet-years,
  **60% Senate Big-4 confirmation** (committee then ~68 floor), **5-name
  Majority-Leader recovery list** on failure, ≤1 cross-party in Big-4 / ≤3 total,
  **status hierarchy** (ex-SecState only takes State), retain ≤5, **region
  coverage −1 per uncovered region**, **minority-appointee-pre-Civil-Rights-era
  −1 party-pref** (re-appointing to same post avoids it). **Controversial-nominee
  failure = lifetime cabinet ban + permanent −1 all elections** (POST 3720,
  4988–5019, 6010–6090, 7156–7174, 7982, 8060).
- **Governor actions (#20/#21/#35)** — # = Gov level (Efficient +1), d100 vs
  20×Gov, **skill match doubles** success, 5-Gov autopass, success 10% +1 Command,
  national-meter impact → lose-Obscure/+Command roll. Huge era-gated menu
  (railroad/bank/university/academy, taxes, Political Machine, **Gerrymander**,
  term config, **Jim Crow/Literacy/Disenfranchise/Poll Tax** [Deep South ×2],
  **Women's Suffrage**, Praise/Criticize President, Challenge-law-to-SCOTUS,
  **Activate State Primaries**). **Gov incumbency decay** after 8/12 yrs (POST
  3338–3354, 4179–4195, 5477–5505, 6119–6153, 6997). **"+1 Command except on
  autopass actions"** house-reword (retroactive, POST 2936–2945, 3134).
- **Career tracks (#43-adjacent)** — **7 sectors**, year-tiers **4/8/12/16/20**,
  auto-removed at 20 with scaled payouts; **cannot run for Gov/Rep, be
  faction/party leader, or be Kingmaker** (can be a protégé); becoming faction
  leader exits the track (rounded-down benefits) (POST 6687–6720, 8306–8330).
- **Roster churn (#24/#28/#29/#30/#36/#37/#38)** — Relocations (alt-state
  auto-succeed + 25% Carpetbagger; over→under 50/25; Expansionist for states ≤4
  yrs old); **Ideology Shifts** (50% +25% toward leader; 40% Pliable / 50%
  Flip-Flopper; #attempts = leader traits 3–6; Puritan can't shift; >1 slot
  breaks Kingmaker); **Conversions** (auto party-flip at opp-max-enthusiasm;
  cross-party 10%+10%Pliable+5%Mod/33%Manipulative; inter-party Pliable+adjacent;
  officers immune); **Kingmaker/Protégé** (same state+ideology; Leadership → 3;
  Master ignores state, +1 NATIONAL; chain breaks on promotion/move/ideology-jump);
  **Faction Personalities** (interest/lobby card churn; Iron-Fist+Leadership PL
  shares a card with all same-party factions; Puritan blocks receiving it);
  **Party-leader election = #kingmakers + higher of 2 d6** (Leadership grants the
  2nd die); old-age stat decay + negative-trait gain; defeated-incumbent
  auto-retire (POST 3357–3391, 4026–4135, 5269–5382, 5831–5905, 6238–6300,
  7062–7066, 8762).
- **Diplomacy (#25b/#26/#27)** — SecState suggests, Pres disposes (Manipulative
  SoS + Pliable Pres = binding); Improve Relations / Increase Trade / **Extend
  Credit/Loan** (puts the nation in **debt to the US** — numeric ledger; Rev
  must be balanced/under); 0–9 relations tiers; low relations → war (POST
  5182–5187, 6213, 7346).
- **Executive Actions (#22/#23/#23b)** — # = Command (COS/CNO +1), Egghead
  cabinet suggests (Disharmonious 25% resign if ignored), **all-Admin/Gov
  implementation rolls** with difficulty tiers + blunder rolls; actions
  ideology/card-gated and **non-repeatable across consecutive terms**; Command
  can **deactivate prior-admin policies** (POST 5179–5200, 6117, 6963, 8649–8672).
- **Census / apportionment (#34)** — decennial reapportionment of EV + House
  seats, banked era-evo immigration EV deltas, gerrymander expiry, per-state Bias
  recompute, focus-rep seats; House grows with statehood (1900 census: total 431,
  319 members; **House capped at 500** by bill, POST 8979) (POST 3542, 3967,
  6259–6261, 8497).
- **Era / Random / Anytime Evos (#22)** — date-anchored Era Evos with A/B/C Pres
  branches + Egghead advice + implementation rolls; per-pol Random Evos;
  **"highest-scoring faction" rubber-band** draws negative events (POST 8489);
  **anytime "favor" events** (industry asks the President for a favor, POST 7197).
- **Heavyweight ~12-step new-era boot pipeline** at each boundary (1868, 1892):
  end-of-era awards + **faction-point reset to per-era banks** + faction trades +
  full 2.1.x→2.3.1 re-run + new card/draft pool (POST 6679–6816). **Resolves the
  prior open "era-boundary point-reset" question: points DO reset/bank per era**
  (confirms gap #2; reconciles the section-A open note — the cumulative scores
  seen mid-Gilded were within-era, banked at the boundary).

---

## §S. GM rulings, design-holes & balance flags (consolidated — feeds the gap log)

### Design-holes / balance flags (NEW or strengthened)
- **S-1. Career-track pols can currently run for President.** Acknowledged rules
  gap, intended to be barred, not yet (POST 8205–8219). [NEW]
- **S-2. "Extend Credit to all 7 nations" is a near-auto-win foreign loop** — "works
  amazingly every time"; a positive trade balance with all nations triggers a
  stacked bonus (POST 7346). [NEW]
- **S-3. Flipping a Kingmaker also grabs his protégés — "insanely OP"** (POST
  7589, 8762). [NEW]
- **S-4. Contingent election top-2 vs top-3** house-rule deviation (POST
  5720–5721). [NEW — see I-7]
- **S-5. R/D convention-threshold asymmetry** (3/4 vs 2/3 → ½+1) — fixed rule or
  temporary? Plus an **Iron-Fist PL can unilaterally lower the threshold** (POST
  4726, 5594–5713). [NEW]
- **S-6. CPU convention AI explicitly incomplete/buggy** — CPUs can't perform some
  human actions; "needs a 2.9 rework" (POST 4686–4690). [strengthens #13]
- **S-7. Ballot-shift rule ambiguous** (mid-ballot vs next-ballot; GM ruled next
  round) (POST 2025–2038). [strengthens #13]
- **S-8. Exec/Gov-action ability stat inconsistent** (Command vs Admin/Gov/Justice
  across actions/events); designers think it should be Command; the **all-Admin
  implementation rebalance** + the fact an **A-branch event can no-op** on a
  failed implementation roll are both live (POST 2274, 2279–2282, 3097–3098).
  [strengthens #22/#23]
- **S-9. Blundered-implementation ruling** (designer, POST 8649–8672): a FAILED
  (blundered) implementation **still scores points & moves meters "as if it
  succeeded"**; the blunder only risks scandal/resignation — **UNLESS a specific
  event/action overrides** (does-not-pass / retriable). Needs a **per-action data
  flag + appendix**. [NEW — refines #22]
- **S-10. Lobby cards too inelastic** (raw-pol-count driven → a trifecta party can
  lack lobbies) (POST 7799). [NEW]
- **S-11. Apparent Dem 3rd-party structural bias** — Dems "won every instance a
  3rd-party run was a factor" (POST 7480-block). [NEW — refines #48]
- **S-12. Host-Governor delegate grouping is exploitable corruption** — players
  want it moved to an elected DNC/RNC chair / automated AI (POST 6134–6151). [NEW
  — refines #13]
- **S-13. Govs are underpowered** (designer-acknowledged, POST 6140). [refines #20]
- **Player asks:** a **"Presidential Demand"** counterpart to Presidential Promise
  (POST 6579); a **missing Mexico ambassadorship** (POST 542–544); a broader
  **same-state-EV** mechanic beyond "VP ≠ Pres state" (POST 558–566).

### Open questions (for the human)
- **Era-band point banking as the cross-era win condition?** One 1856 playthrough
  traverses Antebellum→Civil-War→Reconstruction→Gilded→Progressive→WW1→…; is the
  per-era faction-point bank → end-of-game total the canonical win condition, and
  is it in the build at all?
- **Foreign-relation meters are era-gated** (Israel inactive=0 in 1900) — need the
  activation rule.
- **Exact national-meter → per-state election ± formula** (applied by GM, never
  stated).
- **Is the Lingering engine meant to auto-resolve ~16 meters in the build, or use
  the simplified PV-only model?**
- **Civil War end-year** (1866 vs 1867) — affects the war-hero +20yr window.
- **Is 3 traits + 3 alt-states the canonical draft re-rule going forward?** ("Ted's
  revisions," down from 5/5 at the 1868 draft, POST 2155.)
- **Codebase reconciliation (tech-lead):** which of I-11/I-12/legislation
  institutions/meters exist in the shipped build vs forum-only — the build is
  believed to be pre-late-game-loop.

---

### Final-digest summary (6 lines)
This is the **first 1856-native procedural record** and the **only source for the
Civil-War/Reconstruction-era machinery**: a two-theater combat engine (naval-then-
land gating, War-Score auto-win, named-officer casualties, tiered Major/Minor/
Operation framework), a Reconstruction readmission subsystem (military-gov
occupation, per-state readmission bills, +2-Red bias sunsetting 1882, three plans,
amnesty law that removes-or-returns pols), secession + Southern-Unionist trait
gating, free/slave sectional-balance crisis scoring, and Canada conquest →
era-gated statehood with a Canadian draft. It also yields the **succession/
eligibility crises** (foreign-born ineligibility, 0-Command acting president,
configurable line of succession), the **contingent-election top-2 house-rule**,
the **Primary Era** (state-opt-in primaries → Groups 1–5), **amendment ratification
by 3/4 of Governors** (era-keyed/tunable), the authored **investigation "3.0.40"
5d6 spec**, the Progressive **institutional layer** (Fed Chair/CoS/CNO/FBI/split
Commerce-Labor), and the **~16-meter Lingering** engine (incl. an inactive
"Israel" placeholder). It **corroborates** a large swath of the existing gap log
across the full 1856→1900 arc (conventions, legislation, SCOTUS, cabinet, governor
actions, roster churn, diplomacy, exec actions, census). The single biggest theme:
**the forum DRIVES the build** — `vcczar` changed the relocation cap to 4 on player
request mid-thread and it went LIVE (the shipped build is still at 5), proving the
playtests are the design source of truth.

**Digest path:** `/home/user/AMPU/docs/game/playtest-digests/77db6e6f-a-house-divided-1856-ampu-playtest-part-2.md`
