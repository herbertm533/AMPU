# `c015a0cb` — "A House Divided: An 1856 AMPU Playtest in the Era of Nationalism" — **HD Part 1** (digest)

**Batch 16.** Single-stage reduce of the 44-chunk / 2,699-post / 2,125k-char thread
`c015a0cb-a-house-divided-an-1856-ampu-playtest-in-the-era-of-nationalism`
(politicslounge.com **topic 4555**; real-world Aug 2023 – Mar 2024). Citations are
`POST n` from the `===== POST n =====` markers. Raw chunks are gitignored scratch;
**this file is the durable provenance.**

> **⚠️ THIS IS PART 1 — a SEPARATE, EARLIER run from the Part-2 thread**
> (`77db6e6f`, topic 5306). Do NOT conflate them. The two runs are **distinct
> alt-histories of the same 1856 campaign concept** with different casts:
> - **HD Part 1 (this digest):** Red/Republican wartime president **Salmon P.
>   Chase** (VP **Abraham Lincoln**); secession **1860→1861** via Chase
>   **bungling the John Brown's Raid decision**; **CSA president Herschel V.
>   Johnson (GA)**, VP Oran Roberts (TX), with **Jefferson Davis only CSA War
>   Secretary**; **Union wins the Civil War late 1864**; the run ends the **Era
>   of Nationalism at 1868** (POST 2037), crosses into the 1868 Gilded-Age draft
>   (chunks 32-43, Lincoln nominated 1868, Grant nominated 1872), and then
>   **TERMINATES and RESTARTS as a fresh 1856 sim with vcczar's REVISED
>   Reconstruction rules** (chunk-044, POST 2693-2694).
> - **HD Part 2 (`77db6e6f`):** President **Seward**, secession **~1863**, CSA
>   president **Quitman**, Davis = *Democratic* party leader, Lincoln nominated
>   only 1868. Runs 1856→1904 continuously.
>
> This is the **3rd Civil-War run** in the KB (after Part 2 and the all-CPU
> `drums` "Drums of War"), and **the first to play the Civil-War→Reconstruction
> arc with HUMANS on BOTH sides of the Reconstruction tug-of-war.** Most content
> CORROBORATES the existing gap log (#56 war, #57 Reconstruction, #58 secession,
> #59 free/slave balance); the NEW value is (a) the **human-played
> Reconstruction deadlock outcome** [DH-29 movement], (b) the **war-too-easy
> balance critique with a concrete fix**, and (c) **vcczar's authoritative
> revised-Reconstruction ruleset** at the restart.

---

## What this is / meta

- **Stated goals (POST 1, the GA's announcement):** (1) **run the Civil War a
  2nd time** (it had "only really run once" — i.e. Part 2 / `drums`); (2) test
  **V's new Reconstruction rules with HUMANS on both sides** — a human Southern-
  Democrat (Davis faction, **@Willthescout7**) who wants Reconstruction **short**
  vs a human Radical/Liberal-Republican (Chase faction, **@Largo833**) who wants
  it **prolonged**; (3) test the **"newish" war system**.
- **GM:** **@matthewyoung123** ("Matt") — his **3rd** playtest (had only run the
  1772 war test before; this is his first Lingering-phase run, POST 139). Heavy
  CPU help from @ebrk85 (= Arkansas Progressive), @10centjimmy, @Murrman104,
  @DJBillyShakes, @Connor, @Euri, @Blockmon, @theFreezerFlame.
- **4 human factions** at start (POST 3): **@Willthescout7** = Southern Democrats
  (Blue RW, Jefferson Davis, ~90% Southern); **@10centjimmy** = Conservative/
  "Doughface" Democrats (Buchanan, ~50% Southern); **@Euri** = Crittenden→
  "Business" Republicans (Moderate; **Lincoln sits in this faction**);
  **@Largo833** = "Radical" Republicans (Liberal, **Salmon P. Chase**, the
  prolong-Reconstruction side). CPU fills the other 6. Faction handovers/churn
  throughout (Connor quits → Matt CPUs BlueMod → Ark takes BlueMod with python
  dice scripts, POST 1022-1024).
- **Polarity = 1856 (BLUE = Democrats, slaveholding South, RW-Pop/Trad/Cons;
  RED = the anti-slavery coalition → Republicans, LW-Pop/Prog/Lib)** — same as
  1868, reverse of the founding era. Confirmed throughout (Chase/Lincoln/Frémont
  are RED).
- **Async, Google-Sheets + Discord, all dice `roll/threshold`.** Rules cited as
  **2.x / 3.0** (e.g. "the 3.0 Rules," POST 1323). The designer **@vcczar** and
  **@MrPotatoTed** appear as the authoritative GAs and **rule live** (POST 1320,
  2692); @Ich_bin_Tyler co-adjudicates.
- **Engine designer's stamina note (POST 1320, vcczar):** *"My stamina for AMPU
  right now is a zero… When Anthony [the dev] calls for the Civil War/
  Reconstruction rules, I'll go over them again, and make some alterations."* —
  i.e. the browser dev was on a break; the forum is iterating ahead of the build.

---

## Timeline of the 1856 → 1868 arc (the alt-history cast)

- **March 1857 boot:** Buchanan president (won 1856: 174/Frémont 114/Fillmore 8,
  the real result, POST 1). 31 states, 16 free / 15 slave. Buchanan = Doughface
  Democrats; Davis = Southern Democrats; Chase = Radical Republicans;
  Crittenden(+Lincoln) = Business Republicans.
- **1857:** **Dred Scott** decided **6-2** ("historical ruling… 7-2 IRL but a
  justice died," POST 165) → +500 Traditionalists. **Panic of 1857** EraEvo
  (Buchanan chose "Relief not Reform," meters didn't improve, POST 127-132).
  Oil in Titusville. First legislation cycle (MN statehood, Coinage Act, Chinese
  Exclusion, Greenbacks-via-crisis-exception, Homestead).
- **1858 midterms:** Reds take the House 137-101. **Free/slave imbalance fires**
  (17 free / 15 slave after MN → the §59 crisis package, POST 273). GA proposes
  the **Lincoln-Douglas-debates scripted event** (remove Obscure so Lincoln can
  lead), flagged for vcczar/Ted early-release feedback (POST 269-270).
- **1858-60:** Conversion rule **house-changed to "same OR ADJACENT ideology"**
  (POST 300, 753). **Lincoln elected Speaker of the House** (POST 352, 500 pts).
- **1860 election:** **Salmon P. Chase elected 17th President, with Lincoln as
  VP** (POST 174, 702) — "the most interesting alt-history outcome so far."
  1860 census (ahistorical, 8.7% pop. decrease, "system not fully engaged
  starting mid-decade," OrangeP47 = census expert, POST 698). 1860 draft.
- **1861 — SECESSION (the marquee trigger):** EraEvo **John Brown's Raid** fires
  with a **President A/B decision** (A respect VA hanging / B federal-force
  confiscate). Chase picks **B**; the implementation is rolled on the
  **President's JUDICIAL skill** (Chase 3 → >50% not to blunder). **Chase
  BLUNDERS, 85/60** → automatic secession (POST 877-878). Rumor he intends to
  *pardon* Brown ignites the South. **THE UNION IS DISSOLVED.** LA secedes first
  (d6 among Deep South), then SC/AL/FL/MS, then GA → 6 states form the **CSA** at
  a Milledgeville convention (CSA constitution: **single 6-yr presidential term +
  line-item veto**); **CSA Pres Herschel V. Johnson (GA), VP Oran Roberts (TX)**;
  then TX/AR/TN/VA/NC join; **MO + KY conventions stay Union**. **Robert E. Lee =
  CSA Commanding General** (only Southern 4-Mil Military-Leader, by default).
- **Civil War 1861-1864** (chunks 15-20) — two-theater combat, see "Mechanics".
  **Union wins late 1864** (West WS 15→75% won; East WS 9→45% won, POST 1318).
  **Treaty of Appomattox** package (POST 1319). The South enters **Military
  Reconstruction**.
- **1864 election:** Chase re-elected (war-hero +1 national + agriculture/finance/
  maritime/manufacturing bonuses; Democrats run Sr-General McClernand, the Union
  army commander). In-game "13th Amendment" = **white-male suffrage** (NOT
  abolition — POST 943); abolition came via the **"Abolish Slavery by
  Compensating Owners Act,"** POST 1004, which retired Plantation→Agriculture.
- **1864-1868 — Reconstruction politics** (chunks 22-31): appointed Reconstruction
  governors (incl. **Black Reconstruction figures Oscar Dunn = LA Gov, Hiram
  Revels + Joseph Rainey = senators, Robert Smalls drafted**); the **10%-plan vs
  Ironclad/Mass-Trials tug-of-war begins** (see "Reconstruction").
- **1868 — Era of Nationalism ENDS** (POST 2037, "half term of 1866-68 has
  ended, and so has the Era of Nationalism"). **Winner @Euri (>10,000 pts)**,
  @Largo833 2nd by 20 pts; @Willthescout7 **10th (1,100 pts — most pols
  seceded)**. **1868 draft** (Union-Loyalist trait required to use a pol in a
  reconstructed state). **Lincoln finally nominated for President in 1868** (2nd
  ballot over Grant, POST 1998). Crosses into the **Gilded Age**; **Grant
  nominated 1872** (chunk 43).
- **~1872 — RESTART:** Reconstruction never resolved (POST 2678, below). The GM
  + vcczar **rewrite the Reconstruction ruleset** and **restart a fresh 1856
  sim** (POST 2693-2694) — the run's authoritative design payoff.

---

## Mechanics exercised

### A. Civil War — two-theater combat engine (corroborates #56/#45, deepest spec yet)
The war is a structured combat phase **separate from the turn loop**, run during
Foreign-Affairs/Military phases over multiple half-terms (chunks 15, 17-20).
- **Two theaters: East (east of the Appalachians) + West (west of them); no
  Trans-Mississippi** (POST 987).
- **Per-battle success% formula** (POST 987, 1314): `base − Difficulty (Easy 0 /
  Moderate −15 / Difficult −20) + Planning (SecWar + Sr General; SecWar + Sr
  Admiral for naval) + Officer (Mil ×10; e.g. 5→+50, 4→+40, a **replacement
  general −1** so 4→+30) + Military Prep (+15) + Benchmarks (+15 then +20 later)`,
  then a **d100**.
- **War Score** (POST 987-989, corrected): **naval/easy win +2, Difficult land
  win +3, loss −1** (GA first used −3, corrected to −1). **Decisive General →
  +2 extra to WS on a Difficult win** (Grant at Vicksburg, POST 1318).
- **Per-battle continue roll** (~50%) chains battles within a theater; a battle
  is naval-then-land (naval wins first), but **3 naval wins were NOT strictly
  required** here (it was a continue-roll chain, not a hard gate as #56 implies).
- **War-end resolution** (POST 987, 1318): **WarScore × multiplier % → d100** to
  end the war. **Originally multiplier = 1.0** (e.g. WS 7 → 70%); **changed to
  0.5 mid-run** on the balance critique, AND **scoring/ending made PER-THEATER**
  (each theater resolves separately). Union won West (15→75%) and East (9→45%).
- **Named historical battles kill/improve named military-track pols, both sides**
  (Charleston, Port Royal, Bull Run [a Union loss], Seven Pines, New Orleans,
  Shiloh, Ft. Donelson, Pea Ridge, Vicksburg, Chickamauga [loss], Murfreesboro,
  Antietam [loss], Gettysburg, Petersburg). Winners gain +1 Mil / Leadership /
  Military Leader / Decisive General / Celebrity, lose Obscure; losers lose 1 Mil
  / gain Incompetent; **−500 pts to the officer's faction on a loss**. Running
  out of generals → a **non-officeholding Military-track pol becomes a temp
  general** (POST 1318, McPherson the rookie won Petersburg).
- **Court-martial rule** (POST 1314): an officer who loses an **Easy** battle, OR
  a **Controversial/Easily-Overwhelmed** officer who loses a **Moderate** battle,
  can be court-martialed by a Congressional leader next term.
- **Major-War lingering penalties** while active (POST 987): **80% −rev/budget;
  20% ±economy; 20% −QoL; 30% −incumbent party pref.**
- **Union-victory package — Appomattox** (POST 1318-1319): **25% guerrilla-war
  roll** (failed here); **+2 incumbent party pref**; **President +1 incumbent
  faction enthusiasm + 200 pts**; **250 pts to winning factions + Nationalists/
  Civil Rights/Wall St/Big Corp/Mil-Industrial/Globalists**; DomStab +1; **seceded
  states → Reconstruction** (not "back in the Union"). (No mention of the
  *permanent* +1-all-elections presidential bonus #56 lists from Part 2 — here it
  was a one-term +1 war-hero bonus applied in 1864; verify which is canonical.)

### B. ★ WAR-BALANCE CRITIQUE — "the Union wins too easily" (NEW, marquee)
Both human players AND the GA flag the war system as **too generous to the Union**
(POST 1000-1004, after the 1st war phase):
- **"This has been 2 civil wars where the Union is winning easily… feature or
  bug?"** (Will, POST 1000). Diagnosed problems:
  - **The end-war multiplier is too high** — Will: change it from **1.0 → 0.5**
    (70% → 35% end-chance). **The GM ADOPTED 0.5 mid-run** (POST 1314).
  - **War scoring should be per-theater** (adopted, POST 1314).
  - **Officer Mil dominates the formula** — "a 5-Mil leading officer gives a
    larger bonus than all other factors combined" (POST 1003); a board of 4-5 Mil
    Union officers makes any war a near-lock.
  - **No real enemy-strength term** — "repelling a British invasion is only
    slightly easier than putting down a native tribe, and is *easier* than the
    Civil War" (POST 1003).
  - **Losing a Difficult battle (−1) is too small** — battle-SIZE should matter
    (Bull Run small vs Gettysburg/Wilderness large) (POST 1001).
- **Counter-argument (Euri, POST 1004):** be cautious about making war *harder* —
  the 1772 start fights the Revolutionary War, which **causes a game-over on a
  loss**, so a harder war engine risks ending games before they begin. War "isn't
  the main focus of the game." → A genuine design tension for the build.

### C. Secession + CSA + Southern-Unionist gating (corroborates #58)
- **Trigger = a bungled presidential decision** (the John Brown's Raid Era-Event,
  response B, rolled on **Judicial** skill for the President; Chase blundered
  85/60). **The President's blunder ALONE fired secession** even though AG +
  SecWar (both 5 Admin) implemented fine (POST 878). This is the cleanest single
  example of #58's "decision-blunder trigger" + a sharper detail: the relevant
  skill is **Judicial for the President**, Admin for cabinet.
- **CSA forms as an event chain** (POST 878): LA first (d6 roll among Deep
  South), 11 states total; **border states MO/KY/MD/WV** handled separately (pols
  there may individually secede even if the state stays).
- **Per-pol secession** (POST 922-924): pols of seceded states go with their
  state to an inactive **"Secessionist politicians" tab** UNLESS they hold
  **`Southern Unionist`** (stays loyal) or **`Nationalist`** (rolls to stay).
  ~260 Blue + ~100 Red pols left (11 Govs, 24 Senators, 2 Generals, 1 Ambassador,
  SecWar). Newly drafted pols from seceded states without Union-Loyalist
  **auto-join the Secessionists**; the draft dataset carries the trait (most
  Southern Republicans Unionist, few Southern Democrats). **Black Republicans
  (Robert Smalls) given Union-Loyalist** (POST 1446). **Can't relocate INTO a
  rebelling state.**
- **CSA Pres/VP = random roll among all seceded pols WITH Command** (POST 924).
  **Commanding General = the only seceded Military-Leader with Mil** (Lee). The
  rules **only define CSA Pres/VP/Sr-General**; the GM improvised a full CSA
  cabinet "for flavor" (Davis = War Secretary, a "demotion"; Benjamin = Treasury;
  Bell = State; etc., POST 893-894) and flagged it for the low-priority
  suggestions thread (POST 912). → DATASET/RULES GAP: CSA government needs a
  defined seeding spec beyond 3 offices.

### D. ★ RECONSTRUCTION — the marquee, played by humans (corroborates #57; ★ DH-29 movement)
**Onset (POST 1319-1323, with vcczar's authoritative live ruling):**
- GM flagged **"there really isn't a guideline as to what happens next with
  states in reconstruction"** and tagged the GAs (vcczar/ebrk/Tyler/Ted) (POST
  1319). **vcczar's ruling (POST 1320-1322):** the **default end-of-war state**
  is — Reconstruction states have **Govs, Senators, US Reps APPOINTED and NO
  EVs** until no longer in Reconstruction; **the President appoints Govs, Govs
  appoint Reps/Senators**; **if no valid Gov-skill pol exists, GENERATE one** (or
  "place anyone and give them an automatic 1 at Gov").
- **The GA's resulting onset procedure (POST 1323), from V's ruling + the 3.0
  Reconstruction Rules** — the canonical onset spec:
  1. The South **immediately goes into Military Reconstruction**.
  2. President appoints **SAME-PARTY (Red) Governors** each Exec-Office phase;
     **until Reconstruction is repealed**, Pres appoints Govs → Govs appoint
     Reps/Senators, **re-done EVERY term**; ex-Confederate states get **2-yr Gov
     terms, NO term limits** for these appointed Govs.
  3. Reconstruction states get **NO Electoral Votes** but get **"Loyalist"
     House/Senate representation**; regain the presidential vote when
     Reconstruction is repealed for the state.
  4. **Secessionist pols stay separate from origin factions until Congress/
     President acts.** President can pardon; Congress can **forgive all / punish
     only Confederate leaders / ban all who left forever.** Three pardon Exec
     actions: **A) Pardon Confederate Soldiers** (no CSA-Gov office-holders
     [Pres/VP/State/War/Comm-Gen/Generals/Admirals], all others OK); **B) Pardon
     High-Ranking Confederates except Pres + Comm-Gen; C) Pardon CS Pres + Comm-
     Gen (everyone).** A state in Reconstruction won't let a seceded pol serve it.
  5. Draftees from seceded states without Union-Loyalist can't hold office until
     pardons issue.
- **The human-played tug-of-war (chunks 25-31):** the **Southern-Dem side
  (Will/Jimmy) pushed the "Establish Lenient 10% Loyalty Reconstruction State
  Readmission Plan"** (POST 1644) — short/lenient — and embedded it in the **1868
  Democratic platform** (POST 1996). The **Radical-Republican side pushed "Mass
  Trials and Punishments of Confederate Leaders"** (Chase-approved, POST 1640)
  and the **15th-equiv "Give Former Slaves… the Right to Vote Amendment"** + the
  Freedmen's Bureau. Both sides **repeatedly filibustered each other** (Mass
  Trials filibustered across chunks 26-30; 10% plan stalled).
- **★★ THE DH-29 OUTCOME — human-played, GM-stated (POST 2678):** *"The Congress
  could never agree on a Reconstruction guideline. The Democrats, of course,
  favored the 10% plan, and the Republicans wanted the ironclad oath. In the end,
  NEITHER PASSED and states just started coming back into the Union with NO
  reconstruction plan at all."* → **Even with HUMANS on both sides, the Ironclad-
  vs-10% choice DEADLOCKED and produced a chaotic "no-plan" drift.** This is the
  human-played confirmation that DH-29 (CPU-can't-pass-Ironclad solo) is part of
  a **deeper structural deadlock** that is NOT a CPU-only artifact — competing
  human factions filibustered each other to the same null result. It drove the
  rules rewrite.

### E. ★ vcczar's REVISED Reconstruction ruleset (the restart — AUTHORITATIVE design)
At the restart (chunk-044, POST 2692-2694) vcczar + the GM **rewrote the
Reconstruction subsystem** — this is the canonical design that fixes the deadlock:
- **FOUR readmission plan types**, available to **BOTH the President and
  Congress**: **(1) No-reconstruction-plan / (2) 10% plan / (3) Ironclad plan
  (Wade-Davis) / (4) Military-district plan** (= historical Congressional
  Reconstruction) (POST 2693).
- **★ KEY PREREQUISITE that resolves the deadlock:** ALL Southern-state
  readmissions now require **"there is a reconstruction plan adopted by Congress
  OR by the President."** **States need INDIVIDUAL readmission only if the
  Ironclad OR Military-district plan is adopted** (No-plan / 10% = states just
  come back). So a plan no longer has to be *agreed* by both chambers to avoid
  paralysis — **the President can unilaterally adopt one** (POST 2693).
- **Various pardon types** added to both President and Congress.
- **15th Amendment (adjusted, POST 2693):** *"State bias in all Deep South states
  shift **+2** toward the incumbent party for as long as reconstruction is
  active; **+1** in all other former seceded states; African-American men can now
  hold office."* → formalizes #57's **+2/+1 incumbent-party Solid-South bias**,
  now tied to active Reconstruction (sunsets when Reconstruction ends).
- 13th + 14th Amendments adjusted; ideology/interest/lobby impacts of plans +
  pardons re-tuned. **CSA-victory branch ruling (POST 2692):** if the South wins,
  seceded pols are removed, Unionists stay + move to the nearest loyal state,
  events lead to eventual reintegration (keep drafting pols for breakaway states).
- **Restart also did an "ideology shuffle"** (POST 2699): a new faction-ideology
  ladder (e.g. **BlueCons** now exists; Tilden is in BlueCons).
- **Pre-restart design proposals captured (POST 2680-2687):** a plan should be
  **required at war's close (Exec phase) — President picks a basic option,
  Congress approves/replaces**; **guaranteed state "drops" for each 2-yr period
  without a plan in place**; military districts = appointed Govs that do Gov
  actions only + no congressional representation until amendments ratified OR
  Reconstruction ended; an optional **"Reconstitute Rebelling Territories to
  Create Several Majority-Black States"** (state-redraw) bill.

### F. Antebellum mechanics (corroborate existing rows)
- **Dred Scott** = a SCOTUS-phase vote, CJ can delay (POST 160-165); decided 6-2,
  +500 Trads, flagged "historical ruling."
- **Free/slave balance crisis (#59)** fires **exactly as specified** when free
  outnumber slave after a statehood bill (Speaker + PPT −250 + −1 next election;
  Moderate factions −250; DomStab −2; Party Pref +2 Red; Civil Rights +250 / RW
  Activists +2 next election "livid"), POST 273. **Retired on emancipation**
  (Plantation→Agriculture, POST 1004).
- **Era-content gate (#92/#109)** confirmed natively: "Wooden-fleet replacement
  isn't an option until the Gilded Age… all proposed legislation must come from
  the Era of Nationalism OR before" (POST 169); Greenbacks normally war-only but
  **valid during a crisis** (POST 180).
- **Bleeding Kansas / Lecompton / Popular Sovereignty:** carried as the pre-game
  context (DomStab in crisis "since the Bloody Kansas fiasco," POST 166); KS was
  set to enter as a **slave state** per prior legislation, and a wartime "admit
  Kansas as a slave state" proposal was mocked + the proposer (Bright) **expelled
  from the Senate** — matching real history (POST 935-938). Statehood bills are
  the free/slave-balance lever (MN, OR, KS, NV, NE, WV).
- **The 1858 census/Manifest-Destiny content** behaves as a content-band; the
  1860 census is ahistorical and "not fully engaged" mid-decade (POST 698-700).

### G. Standard turn-loop (heavy corroboration, compressed)
Draft / career-track (7 sectors, 4/8/12/16/20-yr tiers, auto-remove at 20) /
relocations (20% CPU, alt-state auto-success, overpop→underpop, Carpetbagger
roll, **WV "Schrödinger's state" can't be moved to/from until it's a state**,
POST 745-760 = corroborates DH-43) / ideology shifts (flip-flopper/pliable on
fail) / conversions (disgruntled auto-flip at max-opposite enthusiasm 25%; party-
leader cross-party; **inter-party "same OR adjacent ideology" house rule**, POST
300) / kingmakers+protégés / faction personalities / congressional leadership +
committees / faction+party-leader elections (kingmakers + d6, Leadership = 2 dice)
/ appointments / random deaths+retirements / AnytimeEvos+EraEvos / Lingering
(GM's FIRST run, POST 139; reversion-to-mean, per-cabinet-officer meter rolls) /
Gov actions (# = Gov level, Efficient +1, d100 vs 20×Gov, **no double-same-action**
POST 195, doubled-on-prereq, "Rigorously Comply with Fugitive Slave Act" is a
Southern-Gov action) / SCOTUS (named docket; **dynamic court grew to 10**;
**Manipulative/age-75/12-yr compelled retirement**; higher-Judicial-skill pres
auto-removes a lower-skill justice; **blocking a ≤2-Judicial or Controversial
nominee → +1 party pref to SML party** — a flagged oddity, POST 1019-1020) /
legislation pipeline (committee block-and-replace [chair needs ≥ proposer's
Legislative AND proposer lacks Efficient], packaging-after-committee, floor,
**Shenanigans: Orator flips 3+3, Debater flips 1 Sen/5 House, filibuster carries
to next session**) / sign/veto + override (Buchanan vetoed National Banking,
sustained) / diplomacy (SecState suggests, Pres disposes; **"extend credit to
all" failed repeatedly with 1-Admin ambassadors** — inverse of DH-4) / exec
actions (# = Command; Efficient + Cop/Bookkeeper/Domestic-Warrior/Geostrategist →
50% bonus action, type-restricted) / census+apportionment / conventions (full
multi-ballot loop: nominator d6 momentum, inter-ballot actions incl. presidential
promises [offer-down/request-up], ballot-shift, appeals to credibility/integrity,
**rules-change to 2/3 or ½+1**, VP-impact rubric, keynote) / general election
(debates, action phases, scandal rolls, war-hero bonuses).

---

## GA + vcczar rulings (authoritative design — feeds the gap log)

- **★ vcczar Reconstruction onset ruling (POST 1320-1322):** end-of-war default =
  appointed Govs/Senators/Reps + no EVs until repealed; President appoints Govs,
  Govs appoint the rest; generate a pol (or auto-1-Gov) if none. **AUTHORITATIVE.**
- **★ vcczar revised Reconstruction ruleset (POST 2693):** 4 plan types
  (No-plan/10%/Ironclad-Wade-Davis/Military-district) on **both President and
  Congress**; **prerequisite = a plan adopted by Congress OR President**;
  individual readmission only under Ironclad/Military-district; 15th-Amendment =
  +2 Deep-South / +1 other-seceded incumbent-party bias while Reconstruction
  active + AA men can hold office. **AUTHORITATIVE design — feeds #57.**
- **★ vcczar CSA-victory ruling (POST 2692):** seceded pols removed; Unionists
  move to nearest loyal state; events drive eventual reintegration.
- **GM ruling — John Brown decision uses JUDICIAL skill for the President** (Admin
  for cabinet), and **a Presidential blunder alone triggers secession** (POST
  877-878).
- **GM ruling — war multiplier 1.0 → 0.5 + per-theater scoring** adopted live on
  the players' balance critique (POST 1314). [Designer-adjacent; the GM owns the
  war chart.]
- **GM/house rule — conversions target "same OR adjacent ideology"** (POST 300),
  carried as a stable rule the rest of the run.
- **GM ruling — WV is "Schrödinger's state":** counts as VA for now but is a
  different region, so **no relocation to/from WV until it's a state** (POST
  745-760). Corroborates DH-43.
- **GM ruling — PM-General may propose Civil-Service/Post-office legislation only
  if it addresses an active crisis** (POST 1646).
- **GM note — CSA full cabinet is GA-improvised "flavor"** (rules define only
  Pres/VP/Sr-General); flagged for the suggestions thread (POST 893, 912).
- **Lincoln-Douglas-debates scripted-event proposal** flagged to vcczar/Ted for
  early-release feedback (POST 269-270).

---

## Bugs / friction

- **★ War engine too easy for the Union** (POST 1000-1004) — multiplier too high
  (1.0), no enemy-strength term, Officer-Mil dominates, no battle-size weighting,
  −1 loss too small. Partially fixed live (0.5 + per-theater) but the structural
  issues remain. **NEW gap.**
- **★ Reconstruction deadlock with HUMANS** (POST 2678) — Ironclad vs 10% never
  agreed; states drifted back with no plan. Drove the rules rewrite. **DH-29
  movement.**
- **No Reconstruction guideline at war's end** (POST 1319) — the GM had to stop
  and ask the GAs; resolved by vcczar's ruling + the rewrite.
- **CSA government under-specified** (only Pres/VP/Sr-Gen) — GM improvised a full
  cabinet (POST 893).
- **Blocking a weak/controversial SCOTUS nominee gives the SML's party +1 party
  pref** — flagged as not-right when President + Senate are non-adjacent factions
  (POST 1019-1021). Possible balance bug.
- **Lingering is hand-computed** ("FIRST time I've run lingering," POST 139); the
  "successful implementation that accomplishes nothing" oddity noted (POST 136).
- **Census "not fully engaged" on a mid-decade start** (POST 698-700) —
  reapportionment barely moves on an 1856 (vs 1850) boot. Corroborates the start-
  year/census coupling (#34).
- **Dataset: Southern-Unionist labeling is wrong on many Southern draftees** (POST
  1446, 2682) — Union officers who settled South, Black Republicans, and
  Northern-residing Southerners were unlabeled; the GM had to hand-fix across the
  1864/1868/1872 drafts. **Dataset gap (the `Southern Unionist` trait must be
  audited on the draft classes).**
- **Extend-credit-to-all diplomacy is weak, not strong here** (1-Admin
  ambassadors all fail) — the inverse of the `hd`-Part-2 DH-4 exploit; outcome is
  Admin-driven.

---

## Design ideas / wishes (from the thread)

- A **plan required at war's close**, picked by the President in the Exec phase,
  approved/replaced by Congress, with **guaranteed state "drops" per 2-yr period
  without a plan** (POST 2680, 2686). [Became part of vcczar's rewrite.]
- A **state-redraw bill** — "Reconstitute Rebelling Territories to Create Several
  Majority-Black States" (POST 2682).
- **Battle-size weighting** + a real **enemy-strength term** in the war formula
  (POST 1001-1003).
- A **Lincoln-Douglas-debates** scripted event (remove Obscure from key figures
  who became famous via debate) (POST 269).
- Don't make war *too* hard (the 1772 Revolutionary War is a game-over on loss)
  (POST 1004).

---

## Deltas vs. the build (all trace to POSTs above)

**Shipped reality (verified):** the **1856 scenario IS shipped** (`scenario1856.ts`,
engine era `nationalism`). It has the **John Brown event** (`eraEvents1856.ts:84`,
but as a flat captured-narrative event, **not** the blunder-triggers-secession
decision), **Secession Winter + Southern Secession Threat** events that
`startWar: { name: 'American Civil War', against: 'Confederate States' }`
(`eraEvents1856.ts:115,149`), a **generic `warScore` + `Battle[]` war shell**
(`types.ts:1538`) and a basic **War Dashboard** (`WarsPage.tsx`), and a
**Secession-Winter loyalty-decay** pass (`types.ts:1149-1157`, `secessionDefectionCount`).

**Designed-but-UNBUILT (confirmed absent in `src/`):** the **two-theater combat
engine + per-battle success formula + named-battle/officer casualties + per-theater
WarScore + war-end multiplier + Appomattox/defeat package** (#56/#45); the **CSA
government + per-pol Southern-Unionist/Secessionist gate + Secessionists pool**
(#58 — `Southern Unionist` not even a wired trait gate); the **ENTIRE
Reconstruction subsystem** (#57 — no Reconstruction-state status, no appointed-
Gov→Sen/Rep cascade, no readmission plans, no pardons, no +2/+1 Solid-South bias,
no Loyalist-representation, no readmission bills) — grep: **0 Reconstruction/
readmission/Ironclad/CSA hits in `types.ts`**.

| # | Area | Build today | Designed (HD Part 1) | Delta | Source |
|---|---|---|---|---|---|
| 56 (corrob) | Two-theater CW engine | generic war shell only | E/W theaters; success% = base−Diff+Planning+Officer×10+Prep+Bench → d100; WS naval/easy +2 / Diff land +3 / loss −1; Decisive-Gen +2; **per-theater** WS + war-end `WS×0.5%`; named-battle officer casualties; temp-general fallback; court-martial; Major-War lingering pkg; Appomattox pkg | Build the multi-theater War model per this spec; reconcile the 0.5-vs-1.0 multiplier + per-theater scoring (the run changed it live) | POST 987-989, 1314-1319 |
| **NEW #155** | CW too easy for the Union (balance) | n/a | multiplier too high (1.0→0.5 live), no enemy-strength term, Officer-Mil dominates (5-Mil > all else), no battle-size weighting, −1 loss too small — BUT don't over-harden (1772 RevWar = game-over on loss) | Add enemy-strength + battle-size to the war formula; tune the end multiplier; cap Officer-Mil's share; keep the RevWar floor playable | POST 1000-1004 |
| 57 (corrob, ★) | Reconstruction subsystem | none | onset = appointed Govs/Sen/Reps + no EVs + Loyalist rep; Pres→Gov→Sen/Rep cascade re-run each term, 2-yr no-limit Govs; generate Gov if none; 3 pardon tiers; secessionists held out of factions until pardoned | Build per vcczar's onset ruling + the revised ruleset (next row) | POST 1319-1323 |
| **NEW #156** | ★ Revised Reconstruction ruleset (vcczar) | none | **4 plan types (No-plan / 10% / Ironclad-Wade-Davis / Military-district) on BOTH Pres + Congress**; **prereq = a plan adopted by Congress OR President**; individual readmission only under Ironclad/Military-district; 15th-Amd = +2 Deep-South / +1 other-seceded incumbent-party bias while active + AA men hold office; pardon types both branches; CSA-victory branch (remove seceded, Unionists move, eventual reintegration) | Implement the 4-plan model with the **plan-adopted prerequisite** as the deadlock-breaker (President can adopt unilaterally) — the canonical Reconstruction design | POST 2692-2694 |
| **DH-29 (★ movement)** | Ironclad never passes solo | n/a | **Even with HUMANS on both sides, Ironclad-vs-10% DEADLOCKED → states drifted back with NO plan** (mutual filibuster). Confirms the blocker is structural, not CPU-only. **Fix = the plan-adopted-by-Pres-OR-Congress prerequisite (#156).** | The build must adopt the President-can-unilaterally-adopt-a-plan rule so solo (and deadlocked-human) Reconstruction always resolves | POST 2678, 2693 |
| 58 (corrob) | Secession + Southern-Unionist gate | Secession-Winter loyalty decay; `startWar`; no trait gate / Secessionists pool / CSA gov | bungled-Presidential-decision trigger (Judicial skill; **blunder alone fires it**); CSA event chain (LA d6 first, 11 states + border-state pols); per-pol secession (Southern-Unionist stays / Nationalist rolls / else inactive); CSA Pres/VP = random among Command-holders, Comm-Gen = sole seceded Military-Leader; no-relocate-into-rebel-state | Wire the `Southern Unionist`/Secessionist gate + Secessionists pool + multi-trigger event chain + CSA government seeding (>3 offices) | POST 877-878, 893-894, 922-924 |
| **NEW #157** | CSA government seeding under-specified | n/a | rules define only CSA Pres/VP/Sr-General → GM improvised the full CSA cabinet "for flavor" | Add a CSA-government seeding spec (cabinet + multiple generals/admirals from seceded Command/Military pols) | POST 893, 912 |
| 59 (corrob) | Free/slave balance crisis | `SLAVE_STATES_1856` const; no scoring | exact §59 package fires on imbalance after a statehood bill; retired on emancipation (Plantation→Agriculture) | (already specced) — corroborates 5th campaign | POST 273, 1004 |
| **NEW #158 / DH-64** | `Southern Unionist` trait mis-labeled on Southern draftees (dataset) | trait exists | many Union-officer-settled-South, Black-Republican, and Northern-residing-Southern draftees were UNlabeled → GM hand-fixed across 1864/68/72 drafts | Audit + correct `Southern Unionist` on the standard draft classes (esp. VA/MS/FL); validate at dataset-build time | POST 1446, 2682 |

**Open questions for the human**
- **Permanent vs one-term war-hero presidential bonus:** Part 2 says Union victory
  gives the President a *permanent* +1 in ALL elections; HD Part 1 applied a
  one-term +1 in 1864. Which is canonical?
- **3-naval-wins gate vs continue-roll chain:** #56 (from Part 2) says 3 naval
  wins *gate* ground combat; HD Part 1 ran a naval-then-land **continue-roll
  chain** without a hard 3-win gate. Reconcile.
- **War end multiplier:** 1.0 (original) vs 0.5 (adopted live here) — bake which?
- **The "no-plan drift" vs the new prerequisite:** does the build want the new
  "a plan must be adopted before any readmission" rule to be a hard gate (no
  readmission at all until adopted) or to allow a default No-plan?

---

### Summary (8 lines)
HD **Part 1** is a human-vs-CPU 1856-start that runs antebellum → Civil War →
Reconstruction onset and ends the Era of Nationalism at 1868, then restarts with
vcczar's revised Reconstruction rules. Cast: **Chase president / Lincoln VP**;
secession **1860-61** when **Chase blunders the John Brown's Raid decision**
(Judicial-skill roll); **CSA president Herschel V. Johnson, Davis only War
Secretary**; **Union wins late 1864**. It is the **3rd Civil-War run** and the
**first to play Reconstruction with humans on both sides** — and the marquee
finding is that **even with humans the Ironclad-vs-10% choice DEADLOCKED and
states drifted back with NO plan** (★ DH-29 movement), which drove vcczar's
authoritative rewrite: **4 plan types on both President and Congress + a
"plan-adopted-by-Congress-OR-President" prerequisite** (the deadlock-breaker).
It also surfaces a substantive **"the Union wins too easily" war-balance
critique** (multiplier 1.0→0.5 + per-theater scoring, adopted live) and confirms
the two-theater combat engine, the Southern-Unionist secession gate, the
free/slave crisis, and a `Southern Unionist` dataset-labeling bug.

**Digest path:** `/home/user/AMPU/docs/game/playtest-digests/c015a0cb-a-house-divided-an-1856-ampu-playtest-in-the-era-of-nationalism.md`
