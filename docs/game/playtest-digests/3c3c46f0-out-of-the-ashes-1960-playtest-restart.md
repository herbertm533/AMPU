# Digest — "Out of the Ashes: 1960 Playtest Restart" (`3c3c46f0`)

- **Source:** `docs/game/sources/3c3c46f0-out-of-the-ashes-1960-playtest-restart/` — **27 posts / 1 chunk** (chunk-001). GM/runner: **@Vols21** ("V's rules" = designer @vcczar's ruleset, which Vols21 re-reads before each phase). In-thread design voices: **@MrPotatoTed** + **@Willthescout7** (era-of-terror regional rule). Procedure = house-call; the V-rule statements they quote are designer-authoritative.
- **★ This is the CONTINUATION/RESTART of `8bc0231c` "The Big Red Button: 1960 Playtest"** — the SAME 10-faction Cold-War run (GM Vols21), **restarted after a reset**. Read the prior digest `8bc0231c-ampu-the-big-red-button-1960-playtest.md` + the companion `historical-context-1960-coldwar.md` FIRST; this file does NOT re-derive the alt-history (Bricker won 1960; President Bricker governs 1961-64; LBJ Senate Maj Ldr + Tip O'Neill Speaker) — it confirms it and adds the **restart cause** and **Vols21's hand-rolled CPU rules**.
- **In-game span:** picks up at the **Congress-in-Session phase of the 1962-64 governance turn** (post-1962-midterm; Bricker has signed a Nuclear Test Ban Treaty) → full legislation pass → circuit-court appointments → foreign-policy/ambassador rolls → **into the 1964 Democratic presidential primary** (New Hampshire only, the run pauses again mid-primary at POST 27).
- **Why it matters:** a **corroboration-rich PLAYTEST** that gives the cleanest live evidence for **WHY late-era boots need real stats** (#186/#179) and that hands us **two GM-improvised CPU subsystems verbatim** (CPU legislative swing-vote model + Presidential pressure), both `GM⇒App` automation requirements straight from the "subsume the GM" charter — POST 11 states it outright: *"Can't wait for the actual game so the computer can take over a lot of the tedious processes."*

---

## ★ Headline: the RESTART CAUSE (corroborates #186 + #179)
**The original run was STOPPED because the cabinet's stats were too weak to drive the meters** — direct live proof of two logged gaps at once.

| Finding | Verbatim / detail | Cite |
|---|---|---|
| **★ The boot used STARTER-level stats → tanked the meters** | *"The 1960 playtest had to be stopped because some of the ratings, especially Admin were all at starter levels and it tanked all the meters since we didn't have any Cabinet members above 3 (and very few at 3)."* | POST 1 |
| **The fix = RESET ratings to mid/peak strength** | *"I've gone back and reset the ratings based on mid and peak levels where necessary and adjusted the meters back close to where they were."* New cabinet now has **one 5-Admin, four 4's, rest 3's ("no more 2's!!")**; ambassadors a 5 (Kissinger) + four 4's; Key Advisor upgraded 2→4 (Weinberger). | POST 1, 2 |
| **Why this is load-bearing (#179 coupling is real)** | A late-era cabinet of all ≤3-Admin officers makes the per-officer lingering meter-roll table fail — low Admin ⇒ the meters only fall. The run was UNPLAYABLE until stats were peaked. This is the **0-Admin-JCoS-tanks-MilPrep failure (DH-23 root cause / #179 admin-ladder)** reproduced at WHOLE-CABINET scale. | POST 1 |

> **★ Build takeaway (corroborates #186 / #179):** a deterministic late/mid-era boot must seed cabinet (and ambassador/advisor) officers at **era-appropriate mid/peak strength**, not draftee starter levels — otherwise the #179 cabinet→meter lingering engine drags every meter into crisis at turn 1. The forum GM had to **manually re-stat the whole cabinet and re-derive the meters** to make the era playable. This is the strongest single datapoint that #186's "correct stats for the year" requirement is not cosmetic — it gates whether the meter engine works at all. (Mirrors `wilsons1916`'s "1916 BootSheet is bare / filler economic numbers" finding under #186.)

---

## ★ GM-IMPROVISED CPU subsystems (`GM⇒App`; corroborates #208 + #182)
POST 11 is the goldmine — Vols21 *devised "rules" for deciding Congressional votes (since they are all basically AI driven)* while the project was on hold. Two distinct engines, both UNBUILT in `src/` (no CPU legislative-vote logic; no Command-as-budget; codebase-verified).

| Sub-engine | The GM's hand-rolled rule (verbatim core) | Maps to |
|---|---|---|
| **★ CPU moderate-faction SWING-VOTE model** | *"The moderate faction starts at 50-50 but the bill gains or loses support based on (1) which party proposed the bill, (2) if their party leader supports it or not, and (3) the actual make-up of the faction (we know it's mostly moderates, but is the rest more conservative or liberal)."* Applied mainly to **moderate factions** because partisan factions' votes are obvious ("easy when the bill helps or hurts your faction"). Explicitly to *"keep me from allowing any biases to filter into the results"* — a true swing vote. | **#208** (CPU legislative logic UNSPECIFIED — this is the *base-rate + modifiers* form of the maj/min-leader own-vote rule `welcome2future` improvised). `GM⇒App`. |
| **★ Presidential PRESSURE / influence (Command-driven)** | *"The President could roll the number of 6-sided dice that corresponds to his Command rating. A 5 or 6 would allow him to roll again with the number ×10 being the percent of a faction he could sway. Example, a 2 means 20% of the targeted faction would defect."* Models Reagan/Biden arm-twisting fence-sitters; usually small numbers but can flip a close vote. (In the first test it **failed → didn't come into play**.) | **#182** (Command = an *action/influence* budget, not just eligibility/PV) **+ #208** (the CPU-vote-flip half + the President's confirmation/legislation "convert N senators" tool in `rulebook` §M2/§Y). `GM⇒App`. |
| **Charter restatement** | *"Can't wait for the actual game so the computer can take over a lot of the tedious processes."* (POST 11) + *"partly buying some time to allow me to start working on the election process behind the scenes — it takes a while doing this for every faction and state."* (POST 11) + *"Can't wait for the actual game so the computer can take over"* echoed re: primaries — running 50 states × 10 factions by hand is the bottleneck. | **★ "subsume the human GM" charter** + the ">30 min/phase ⇒ automate" budget. |

> **Reconciliation note for #208:** this thread's CPU-vote model and `welcome2future`'s are **complementary, not identical** — Vols21 models the *moderate swing faction's base-rate ± proposing-party / party-leader / faction-makeup*; `welcome2future` improvised *maj/min-leader own-vote = own-party + within-2-ideology-clicks*. The build's CPU legislative engine should subsume BOTH (a faction-level swing model AND a leader-level vote rule) plus the **Presidential-pressure d6-Command flip** logged here. The `rulebook` §Y already pins the *President's* convert-up-to-(Legislative#)-senators tool; this thread adds the **Command-die pressure variant** as a second designer-improvised form to reconcile.

---

## Regional-balance cabinet rule (corroborates #179(e) / #31 / DH-23 regional carve-out)
A focused discussion of the era-scaling of the cabinet regional-balance penalty — directly relevant to the #31 / `fixes`§D "region counts once it has ≥2 states" / era-scaled penalty cluster.

| Point | Detail | Cite |
|---|---|---|
| **Regional balance is HARD to satisfy at modern scale** | *"It was a pain trying to find someone from all the regions and still appease the proper lobbies, but we did alright."* — confirms the cabinet = simultaneous **region × lobby** constraint satisfaction (the #31 + #179-lobby + apptdeepdive §C combo). | POST 2 |
| **★ When does region STOP mattering? (era-scaling)** | The thread debates it live: Ted/Willthescout7 — *"Era of terror is when that stops"*; matthewyoung123 — *"probably needs to stop after the Progressive Era…around WW1"*; another — *"Neocons, right after the most recent realignment."* **Authoritative resolution (V's current rules, quoted):** region *"stops leading to civil domestic stability problems after the civil war era. It does potentially lead to party popularity issues until era of terror."* | POST 3-8 |
| **The penalty MECHANIC + the abuse risk** | Snubbing a region = a **−1 election penalty in that region** ("makes sense…especially in the South"). **★ Ted flags the exploit:** *"Danger is it opens the door to block someone from a region just for that reason (if opposition has the majority in the Senate)"* — i.e. an opposing Senate could deliberately reject a region's nominees to inflict the −1 (a NEW abuse-vector note on the #31 penalty). Noted as a **recent rule change** ("since we started the second playtests"). | POST 8-9 |

> **★ This is the same era-scaled region rule already in #31** (`completions`§Exec: pre-Gilded = DomStab penalty; Gilded→Terror = −1 pres-election in the snubbed region; Terror→future = faction-balance instead). This thread CONFIRMS the **Gilded→Terror "−1 election in the snubbed region"** band live for a 1960 board, and adds the **opposition-blocks-a-region-to-trigger-the-penalty abuse note**. Tag for the #31/#208 reconcile (confirmation-blocking interacts with the cabinet penalty).

---

## Legislation engine — scoring levers + outcomes (corroborates the legislation-scoring/lobby cluster, #208, DH-53)
A full hand-adjudicated legislative session: ~30 proposals (POST 13), committee-kills, floor votes (POST 16-17), faction-point totals (POST 18). The two big SCORING levers:

| Lever | Detail | Cite |
|---|---|---|
| **★ Farm Subsidy bill = +100 pts to EVERY Gov/Sen/Rep from agriculture states** | *"A lot of the point gains came from the Farm Subsidy bill — since it gives 100 pts to every Gov, Senator, and Rep from states where agriculture is king. Those points made half of some faction totals, and turned a few negatives into positives."* A **massive geographic lobby-scoring lever** — a single bill swung whole faction standings. (Paired with a companion "tax farm-equipment producers to pay for it" bill, both passed.) | POST 17(#7-8), 18 |
| **Circuit-court appointments = 1 per faction, random roll, +1 Judicial** | Bill "to fill vacant judges on circuit courts (adds +1 to random judicial statesmen)" (POST 13); resolved POST 20: *"President gets to fill some vacancies (1 per faction in his party, all selected by a random roll)."* Each appointee's **Judicial stat +1** (e.g. 2→3, 3→4); explicitly *"sets up 2 of them for possible appointments to the Supreme Court in later years."* A **soft +1-stat / roster-development affordance**, not a power lever. | POST 13, 20 |
| **Faction-point outcomes** | Post-session totals (POST 18): Red — Will/Traditionalist 2700, Vols/Conservative 2350, Tyler/Moderate 1650, Lars/Center-Left 1100, Orange/Liberal **−100**; Blue — Brad/Southern-Traditionalist **5100**, Short-King/Center-Right 1750, Murman/Moderate 550, PMan/Liberal −150, MarkW/Progressive **−950**. **Conservative/Southern bills enriched the right-leaning factions and PUNISHED the left** (the disgruntled-ideology +2 trigger fired: *"the liberals are not so happy…(+2 red)"*). Confirms legislation → per-faction point deltas → disgruntled-flip pressure (#15/#108). | POST 18 |
| **Legislation = committee-kill → floor-vote, swaying** | Slam-dunks passed unopposed; **3 immigration-reform bills + a ban-strikes bill died in committee** ("never made it to the floor"); contested bills went to close floor votes decided by **debate/rally** (Child Labor limit **failed 218-219** after Carl Vinson + Halleck "turned the tide"). Confirms the #74 committee→floor→sway pipeline at modern scale. | POST 16, 17 |
| **Bill catalog (1960s era-keyed)** | Ban union dues, restrict strikes, privatize Social Security (passed!), ban Black Panthers (passed), DC statehood (failed), ban lynching nationwide (failed 159-278), abolish metallic→fiat currency (failed), criminalize marijuana (passed), Columbus Day holiday, fund police, national-primaries committee, immigration quotas/deportation/registration, child-labor limit, farm subsidies. Era-fidelity is good; mirrors the `8bc0231c` modern bill catalog. | POST 13, 16, 17 |

> **Build note (corroborates #208 + DH-53):** the Farm-Subsidy "+100 to every ag-state officeholder" is a concrete **geographic bill→points scoring table** the app must own (the kind of per-bill effect-table DH-53 says is missing/illogical). The circuit-court "1 per faction, random, +1 Judicial" is a small **roster-development sub-mechanic** to capture alongside SCOTUS (#52). Both were hand-rolled here.

---

## 1964 Democratic primary — minor-candidate selection + momentum (corroborates #19/#111/#185, primary mechanics)
The run advanced into the 1964 Democratic primary; rich on **how the GM seeds a CPU primary field** and runs momentum.

| Mechanic | Detail | Cite |
|---|---|---|
| **★ Major candidacy = faction-leader-runs check** | *"Each faction leader to determine if they wanted to run as a major candidate."* **2 of 5 ran; 3 declined**, with logged reasons: LBJ defers to the party leader (focus on Senate); JFK *"lost to Bricker badly…wasn't up to a rematch"*; **Tip O'Neill *"doesn't have any Command points"* → CANNOT run** (the Command-eligibility gate, #182/#61, fired live and kept a faction leader out of the race). | POST 24 |
| **★ Minor-candidate RANDOM selection (the algorithm)** | *"I filtered each faction by command and age requirement. Then I used a random # generator for the number of qualified candidates plus 3 (if the random # was in the +3 range, that meant that faction would not enter a minor candidate, so it left a small chance for that to happen)."* — i.e. **eligible pool = faction filtered by ≥command + age**; pick one at random, with a **built-in chance of NO minor candidate** (the +3 padding). This is the CPU primary-field-generation rule the build must own. | POST 24, 22 |
| **Front-runner / momentum / debates** | Byrd (party leader) = front-runner; **debate damages the front-runner** (Pat Brown's "Bricker on steroids" line → "Byrd was the clear loser"; snap poll tightened). Confirms debate → momentum swing in primaries (#111/#185). | POST 25 |
| **★ Concurrent congressional primaries (a GM workflow change)** | *"One thing I'm going to do differently is run the Congressional primary concurrent with each state's presidential primary (rather than during the general election)."* Reasons: surfaces upsets, eases bookkeeping. A **GM procedure tweak** (NH House primary won by King; Gov primary by Gallen, POST 26) — house-call, but a hint at the intended primary-calendar structure. | POST 22, 26 |
| **NH primary outcome** | **Earl Long (LW faction leader, Tip-endorsed) WON NH 4 delegates**; Byrd 2; Brown + Smathers 1 each; Farley/Kerr/Hayes trailing. The front-runner lost the opener after a bad debate — momentum mechanic visibly mattered. | POST 27 |

---

## Other corroborations (brief)
- **Cabinet = region × lobby constraint, upgraded officers** (POST 2): confirms #25/#31/#179-lobby. **NEW historical color (not a mechanic):** **Samuel Pierce confirmed as first Black Attorney General** (POST 10), 88-12, over a Byrd/Thurmond Southern-Democrat bloc thwarted by the Senate Majority Leader — a live instance of the **region-not-party confirmation split** (#208/#172) and the alt-timeline's civil-rights texture. (See companion doc; this is alt-history color, not a build delta.)
- **Foreign-policy / ambassador rolls** (POST 21): ambassadors graded by stat (4/5 = success, 3 = coin-flip) for **Trade Relations** + **Diplomatic Relations** (improve a per-nation relation number, e.g. Russia 5→6, Japan →8). Confirms the diplomacy subsystem #107 at modern scale; consistent with `8bc0231c`.
- **Confirmation vote = Senate-wide with a Maj-Leader thwarting a blocking bloc** (POST 10): Pierce 88-12 after the SML defeated the Southern-Democrat sabotage — corroborates #172/#208/DH-23 (confirmation is a real vote a leader can swing), still UNBUILT (`runPhase_2_3_1_Cabinet` auto-confirms, no vote/block/cloture; codebase-verified).
- **Disgruntled-ideology +2 trigger** (POST 18): liberals "not so happy…(+2 red)" after conservative legislation — corroborates #15/#108 ideology-flip pressure from legislation outcomes.

---

## Candidate gaps for consolidation (NEW vs corroborates-#)

**Strong corroborations (the heart of this playtest — for the consolidation agent to fold into existing rows):**
- **#186 (★ deterministic late-era boot) — CORROBORATED, sharpened.** This run is already cited in #186 as `redbutton`; the RESTART adds the **single cleanest failure proof: starter-level cabinet stats tanked the meters and forced a full re-stat to mid/peak before the era was playable.** Append: *boot must seed cabinet/ambassador/advisor officers at era-appropriate mid/peak strength (POST 1-2), else the #179 lingering engine fails at turn 1.*
- **#179 (★ cabinet→meter lingering engine) — CORROBORATED at whole-cabinet scale.** The all-≤3-Admin cabinet → all-meters-tank is the DH-23/admin-ladder failure reproduced for the entire cabinet; confirms the admin-strength→meter coupling is load-bearing (POST 1).
- **#208 (★ CPU legislative/confirmation logic UNSPECIFIED) — CORROBORATED + EXTENDED, `GM⇒App`.** Adds Vols21's **moderate-faction swing-vote model (50-50 base ± proposing-party / party-leader-support / faction-makeup)** — a faction-level CPU vote rule complementary to `welcome2future`'s leader-level rule (POST 11).
- **#182 (Command = action/influence budget) — CORROBORATED, `GM⇒App`.** Adds the **Presidential-pressure rule: roll (Command) d6 → a 5-6 rerolls → result ×10 = % of a faction swayed** (POST 11); + the **Command-eligibility gate fired live** (Tip O'Neill barred from the primary for 0 Command, POST 24).
- **#31 / DH-23 (regional-balance + Admin-1 cabinet) — CORROBORATED.** Confirms the **Gilded→Terror "−1 election in the snubbed region"** band live for 1960 (POST 3-9); the region×lobby constraint (POST 2); Admin-driven confirmation/meter sensitivity (POST 1, 10).
- **#187 (party-fatigue) — adjacent, NOT re-exercised** (the restart resumes mid-cycle; no new fatigue datum — already logged from `8bc0231c`).
- **DH-53 (per-bill effect tables) — CORROBORATED.** Concrete table: **Farm Subsidy = +100 pts to every ag-state Gov/Sen/Rep** (POST 17-18).
- **#52 / #111 / #185 (SCOTUS-stat dev / primary machinery) — CORROBORATED.** Circuit-court "+1 Judicial, 1/faction/random" appointments (POST 20); CPU minor-candidate selection algorithm (POST 24); debate→momentum (POST 25-27).

**NEW / sharpening notes (small; flag for consolidation, likely sub-notes not new rows):**
- **NEW abuse-vector note on #31:** an opposition Senate majority can **deliberately reject a region's nominees to inflict the −1 region penalty** (Ted, POST 8-9) — confirmation-blocking weaponizes the cabinet regional penalty; reconcile with #208/#172.
- **NEW (`GM⇒App`) CPU primary-field generation rule (sharpens #111/#185):** minor candidates = *faction filtered by command+age → random pick, with a padded "+3" chance of NO candidate* (POST 24); plus the **faction-leader-runs check** for majors with logged decline reasons (POST 24).
- **NEW workflow datum (house-call):** GM intends to run **congressional primaries CONCURRENT with each state's presidential primary** (POST 22) — a hint at the intended primary-calendar structure for the app's election engine.

---

## Open questions
- **Cabinet stat-seeding for late-era boots:** what is the canonical per-era cabinet-strength seed? This run shows starter-stats break the meters, but the "mid/peak" reset was eyeballed by the GM (POST 1) — #186 needs a deterministic per-office, per-era stat table (cf. `wilsons1916`'s "filler numbers" open Q).
- **Presidential-pressure rule vs the `rulebook` convert-senators tool:** Vols21's d6-Command pressure (POST 11) overlaps but differs from `rulebook` §Y's "convert up to (Legislative#) senators on a 5-6." Which is canonical, and does pressure use **Command** (this thread) or **Legislative** (rulebook)? Reconcile under #182/#208.
- **Does the moderate swing-vote model generalize?** Vols21 applied it only to **moderate factions** (partisan factions are deterministic) — confirm whether the app's CPU legislative engine treats moderates as the only stochastic bloc (POST 11).
- The run **paused again mid-1964-primary** (POST 27, after NH) — like its predecessor, it never reaches a 1964 general or a nuclear-war end condition; the "big red button" remains premise-only (#188).
