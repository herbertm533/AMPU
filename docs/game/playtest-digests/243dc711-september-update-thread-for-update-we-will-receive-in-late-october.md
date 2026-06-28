# Digest — "September Update thread for update we will receive in late October" (topic 4561)

- **Slug:** `243dc711-september-update-thread-for-update-we-will-receive-in-late-october`
- **Source:** `243dc711-September_Update_thread_for_update_we_will_receive_in_late_October.csv` (30 posts, 1 chunk, ~12.4k chars)
- **Dates:** posts span Sep 3 – Oct 31, 2023 (forum update thread; players posting highlights from concurrent playtests)
- **Type:** cross-era playtest **HIGHLIGHT REEL** — anecdotal. Four concurrent runs are sampled:
  - **1856 / Era of Nationalism** run (the marquee — explicitly started "to see how the Civil War and Reconstruction are handled," POST 3)
  - **1868 / Gilded Age** run
  - **1948** run (modern)
  - **1840** run
- This digest extracts **mechanics signals only**, not narrative color. Era framing per `docs/game/historical-context.md` (no historian ran this batch).
- Shipped-vs-designed labels below were verified against `src/` (grep of secession / civil-war / contingent / election code). `wc -l` of this digest: see end.

---

## ★ HEADLINE — the 1856 CIVIL WAR triggered (first reported full secession in a playtest)

**POST 27 (1856 run).** The trigger chain, as narrated by the GM (`matthewyoung123`):

1. **The Harper's Ferry Raid event is BLUNDERED by President Salmon P. Chase.** Press in DC reports Chase intends *not* to try John Brown and may **pardon** him. Never confirmed, but the rumor alone is the spark. (John Brown was captured by Col. Joseph E. Johnston in the narration.)
2. **Southern outrage → secession cascade.** Deep South perceives a "two-tiered system of justice" and Federal interference in Virginia's state business. "Secession, which had only been whispered of in 1860, now turns into loud shouts in 1861."
3. **First wave (6 Deep South states):** Louisiana (first, Baton Rouge), then **SC, AL, FL, MS**, then **GA** (after debate). They convene at a **convention in Milledgeville, GA** and declare the **Confederate States of America (CSA)**.
4. **CSA constitution:** modeled on the US Constitution **but with a single SIX-YEAR presidential term + a line-item veto.** (Two concrete mechanical deltas from the US executive.)
5. **CSA government:** President = **Herschel V. Johnson** (former Gov. of GA); VP = **Oran Roberts** (TX); Commanding General = **Robert E. Lee** (VA), selected by the CSA Congress + President.
6. **Second wave (Upper South / Southwest):** **TX** (led personally by Roberts), then **AR, TN, VA, NC** join.
7. **Border-state conventions stay loyal:** **Missouri** and **Kentucky** both held secession conventions but **voted to remain in the Union "...for now."**
8. **Mass politician migration:** "**Roughly 360 politicians have joined the Southern Confederacy. About 260 from the Blue and 100 from the Reds.**"
9. **Representation loss:** "**No seceded state has representation in the Congress.**"
10. "CIVIL WAR IS NOW UPON US!"

**Setup context (POST 3):** 1856 run had 4 human players (2 Blue, 2 Red) + 4 CPU-processing humans. Human Blue = **Southern Democrats** + **Conservative Democrats** (flagged in-thread as "full of politicians from the south" → "hit hard if the South leaves"). Human Red = **Moderate Red** (holds Abraham Lincoln) + **Liberal Republicans** (Gov. Salmon P. Chase of OH). GM noted up front that a Northern win would likely mean the Liberal Republicans "impose harsh reconstruction penalties on the South" — i.e. **Reconstruction is anticipated as a player-driven legislative consequence**, not pure scripting.

**Cross-ref:** `docs/game/historical-context.md` (lines ~874-884) already records this same Chase-bungles-John-Brown trigger AND notes the CSA cast / secession year / CSA president are **run-specific** (a different run produced President Seward, secession ~1863, CSA president Quitman). So the *trigger event* is shipped/deterministic; the *secession roster, CSA officers, and timing* are narrated/run-specific outcomes.

### Shipped-vs-designed for the Civil-War / secession subsystem  ← the central delta

**What is actually shipped (verified in `src/`):**
- `src/data/eraEvents1856.ts` contains the relevant era events as data:
  - **"John Brown's Raid on Harpers Ferry"** (POST 27's trigger exists as an event; lines ~84-85).
  - **"Southern Secession Threat"** (`templateId: 'southern-secession-threat'`, lines ~107-110) — the *pre-election* threat. Its responses can set `startWar: { name: 'American Civil War', against: 'Confederate States' }` (line ~115) or birth "the Confederate States of America... without bloodshed" via meter/interest-group effects (line ~123).
  - **"Secession Winter"** (`templateId: 'secession-winter'`, lines ~129-166) — the *post-election* Nov 1860–Mar 1861 unraveling.
- `src/engine/phaseRunners.ts`:
  - `runSecessionWinterDefections` (line ~3028): iterates the **four cabinet seats** {Treasury, War, Interior, State}; applies a **loyalty decay** from (state region × ideology) tables; if post-decay loyalty < threshold, the secretary **defects** — seat set null, `currentOffice` cleared, **'Traitor' trait** granted, log line "...resigns as <seat> to join the Confederacy." Stores `secessionDefectionCount` (N) on the event.
  - `secessionWinterBand` (line ~3001): N + response → a **meter multiplier** (0.3–2.0), modulating the response's national-meter effects.
  - **Civil war is forced when N ≥ 2** cabinet defections (`if (N >= 2 && !out.startWar) out.startWar = {...'Confederate States'}`, line ~2980; AC #36).
- `src/types.ts`: `War` entities exist (`wars: War[]`, line ~1820; `startWar`/`endWar` postEffects, line ~1478); `secessionDefectionCount` field (line ~1481); a `region` set for the "eventual 11 CSA states + 4 border-loyal slave states" (lines ~1149-1157, used by Secession Winter loyalty decay).
- `src/engine/labels.ts` (line ~143): for scenario 1856, war label = "The Civil War is being fought."

**What POST 27 shows that is NOT shipped (the gaps):**
- **No state-by-state secession cascade.** Shipped logic models secession as **cabinet-officer defections + a meter multiplier + a boolean "war starts."** There is **no mechanism that flips individual states out of the Union** in two waves (Deep South first, Upper South second), nor border-state secession *conventions* that can vote to stay (MO/KY in POST 27).
- **No CSA as a formed entity.** The CSA in the narration has a **convention site (Milledgeville), its own constitution (6-yr single term + line-item veto), a President, a VP, and a Commanding General.** Shipped code only references "Confederate States" as the `against:` string of a `War`. No CSA government object, no CSA constitution variant, no CSA officers.
- **No mass politician migration.** POST 27's "~360 politicians join the CSA (260 Blue / 100 Red)" has no shipped analog — only the **4 cabinet secretaries** can defect today.
- **No loss of Congressional representation for seceded states.** POST 27 states seceded states have zero Congressional representation; shipped code does not strip seats/representation by state on secession.

**Delta summary:** the shipped subsystem (PR6) is a *cabinet-loyalty + meter-modulation abstraction* of Secession Winter that ends in a `startWar` flag. The forum's lived Civil War is a *territorial/institutional* event: states flip, a rival federal entity (CSA) forms with its own constitution and officers, hundreds of politicians migrate, and the seceded bloc loses representation. **That territorial/institutional layer is designed-but-unbuilt.**

---

## Other mechanics signals

### Contingent (House) presidential elections — multi-trigger subsystem (POST 18, 1840 run)  ← strong delta
- The 1840 run had its **6th** contingent election (the 1892 one), keeping incumbent Dem Pendleton President. (3 of the 6 were "historic"/pre-start-date; **3 occurred in-playtest**.)
- **The 3 in-playtest contingent elections had 3 DISTINCT causes**, confirming a contingent-election subsystem with multiple trigger paths:
  - **(a)** a **3rd party kept everyone under 50%** (of the EC).
  - **(b)** **faithless electors** dropped an otherwise-winner **under 50%**.
  - **(c)** the **EC was actually tied** (faithless electors present, but the tie existed **pre-defection**).
- **Corroborating data, POST 19 (1856 run):** the 1860 Chase/Lincoln ticket won "with just over 50% of the popular vote" against a Breckinridge ticket **plus a 3rd-party Everett/Julian ticket**, and "**5 faithless electors**" are explicitly tallied. So **third-party EC fragmentation and faithless-elector counts are modeled at the elector level** in the engine output, even when no contingent election results.
- **Shipped-vs-designed:** **grep for `contingent` / `faithless` in `src/` returns NOTHING.** The shipped presidential election (`calcStateVote` + the election runners in `phaseRunners.ts`) has **no contingent-election path, no House-decides fallback, no faithless-elector modeling, and no EC-tie handling.** This is a **fully designed-but-unbuilt subsystem** with at least **three required trigger conditions** (sub-50% via 3rd party, sub-50% via defection, true tie) and a House-decides resolution.

### Presidential assassination + succession (POST 17, 1856 run)
- **President James Buchanan assassinated in late 1858** by "a crazy lone assassin" (captured). **VP John C. Breckinridge (KY) succeeds as the 16th President.**
- Signal: there is a presidential-assassination random event with clean **VP→President succession**, and downstream **party-leader reshuffles** (Stephen Douglas becomes Dem Party Leader). Ties the broader presidential-mortality theme (below).

### President falls → resigns → comeback (POST 22, 1868 run)
- **William B. Washburn**, President, takes "a nasty fall in his office," hits his head, and **resigns the Presidency** — then **claws back as a Representative** and is elected **House Minority Whip.**
- Confirms: (1) the **presidential-fall mortality/incapacity event** can force *resignation* (not just death); (2) an ex-President can **re-enter politics at a lower office** and climb leadership again. Ties the presidential-mortality / "Presidents fall down stairs" running theme (POSTS 10-14: JFK steps down after "a terrible accident," VP Lewis Douglas becomes acting President — modern 1948 run; cross-ref the July-2023 digest's fall headline).

### Reconstruction-as-law — era-gated legislation availability (POSTS 24-26, 1868 run)  ← delta, ties #258 predicate-gating
- **Sen. David Broderick (D) attempted to "reinstate Reconstruction in South Carolina"** — flagged as a possible exploit because it landed **"well over 50 years after the civil war ended."**
- GM ruling (`Bushwa777`, POST 25): "**Well after we move to Progressive era it's no longer an allowed law.**" Confirmed POST 26.
- **Signal:** legislation availability is **era-gated** — Reconstruction laws should become **unavailable once the era advances to Progressive.** Players observed the gate is **not (or not fully) enforced** at the time (the move went through, prompting "we probably should make it [illegal]"). → era-predicate gating on legislation availability (ties the #258 predicate-gating thread).
- **Bonus mechanics note (POST 26):** "**you can have the civil war quite early (ie: nullification crisis)** — it won't affect our playtest too much but **earlier start dates may suffer from it more.**" Confirms a **second, earlier Civil-War trigger path via a nullification crisis**, with acknowledged balance concerns for pre-1856 start dates. (Matches historical-context.md lines ~840-843: the engine's secession logic branches on Jacksonian / Manifest-Destiny eras.)

### Misc firsts / mortality RNG (color, but each implies a live system)
- **First female President:** **Clare Booth Luce**, defeating President Lewis Douglas in **1968** (1948 run; POST 16) — driven by "fatigue with the Democratic Party and anger over failed wars in Korea and Japan" → suggests **war-outcome + incumbent-fatigue** feeding election results.
- **First non-white VP:** **Red Cloud**, elected to the Vice Presidency in **1884** (POST 28). POST 29 note: first election where **both VP noms were more charismatic than the pres noms** — implies **charisma/command as a distinct ballot factor** evaluated per-candidate.
- **Speaker Fernando Wood killed by an errant freight wagon** in a rainstorm (POST 23, 1868 run) — a **random non-illness mortality event** can strike a sitting Speaker.
- **Custer "massacred by the Natives" again** (POST 30) — recurring scripted/random Western frontier-conflict casualty event.
- **Economic cycle:** Republicans win 1880, then "**face a great Recession in 1881**" (POSTS 1, 15) — confirms a **recession/economic-downturn event** that can hit shortly after an election (post-victory consequence).
- **Trivia confirming VP appointment mechanics (POST 9, 1948 run):** Harry Byrd Sr **ran for VP and lost** (Reagan ticket, 1956); Harry Byrd Jr was **appointed VP** (by President Lewis Douglas) **without running** — confirms both the **elected-VP-ticket** path and the **25th-Amendment-style appointed-VP** path coexist.

---

## Deltas vs. current build / signals (handoff list)

1. **★ Civil-War / secession subsystem is shipped only as an ABSTRACTION; the territorial/institutional layer is designed-but-unbuilt.** Shipped = John Brown's Raid + "Southern Secession Threat" + "Secession Winter" events → **4-cabinet-seat loyalty defections + meter multiplier + `startWar('Confederate States')`** (`eraEvents1856.ts`, `phaseRunners.ts:3001-3054`; war forced at N≥2). **Missing:** (a) state-by-state secession cascade in two waves; (b) **border-state secession conventions that can vote to stay** (MO/KY); (c) **CSA as a formed entity** — convention, **CSA constitution variant (single 6-yr presidential term + line-item veto)**, CSA President/VP/Commanding-General; (d) **mass politician migration** (~360 / 260 Blue + 100 Red) vs. only 4 secretaries today; (e) **seceded states lose ALL Congressional representation.** [POST 3, 27; historical-context.md ~874-884]
2. **★ Contingent (House) presidential election subsystem is ABSENT from code** (`grep contingent|faithless` in `src/` → nothing) but is well-exercised in play with **three distinct trigger paths**: sub-50% EC via 3rd party; sub-50% EC via faithless electors; **true EC tie (pre-defection)** — plus a House-decides resolution. **Faithless-elector counts and 3rd-party EC fragmentation are already surfaced in election output** (POST 19's "5 faithless electors"), so the elector layer exists but the *contingent fallback* does not. [POST 18, 19]
3. **Era-gated legislation availability under-enforced.** Reconstruction laws should be **unavailable after the era advances to Progressive** (GM ruling), but a Senator successfully attempted to reinstate Reconstruction ~50 yrs late → needs **era-predicate gating on legislation** (ties #258). Also: **a second, earlier Civil-War trigger via nullification crisis** exists, with balance concerns for pre-1856 start dates. [POST 24-26]
4. **Presidential mortality/incapacity is rich and confirmed live:** assassination (Buchanan, VP succeeds) [POST 17]; **fall → forced *resignation*** (Washburn) with later re-entry at a lower office + leadership climb [POST 22]; modern fall → acting-President handoff (JFK→Douglas) [POST 10-14]. Random non-illness mortality can also strike a sitting **Speaker** (freight wagon) [POST 23]. Ties the July-2023 presidential-fall headline.
5. **Election-outcome inputs corroborated:** war outcomes + incumbent fatigue swing presidential results [POST 16]; **per-candidate charisma/command appears to be a distinct ballot factor** [POST 28-29]; a **recession event** can fire right after a victory [POST 15]. Both **elected-VP-ticket** and **appointed-VP** paths coexist [POST 9].

## Open questions (for the human)
- Is the territorial/institutional Civil-War layer (state flips, CSA entity, mass migration, representation loss) intended to be **simulated mechanically**, or to remain **GM-narrated** on top of the shipped meter/defection abstraction? The CSA cast/year being run-specific (this run: Johnson/Roberts/Lee; another: Seward-era/Quitman) suggests it has historically been narrated.
- Contingent-election resolution: when it goes to the House, **who decides** (player vote, faction PV, CPU) and what are the exact thresholds for each of the three triggers?
- Era-gating: is the rule "Reconstruction laws disabled at Progressive-era entry" already partially coded (just not catching this case), or entirely a house rule? Confirm the predicate.
