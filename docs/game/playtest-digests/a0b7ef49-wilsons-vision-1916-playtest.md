# Digest — `wilsons1916` (a0b7ef49): "Wilson's Vision: 1916 Playtest"

> **Batch 29.** 581 posts / 7 chunks (read in full). A **1916-start, 10-human multiplayer**
> Progressive-Era/WWI run (5 BLUE + 5 RED), GM **@Arkansas Progressive**; designers **@vcczar**
> + **@MrPotatoTed** post in-thread (their rulings authoritative). The game's era band for this
> period = **"Era of Hollywood"** (corroborated in-game by a scripted "Golden Era of Hollywood"
> event). Explicitly a **methodology experiment**: POST 1 — "*Due to the issues in 1960, the group
> decided that starting at the **beginning** of an era, rather than the middle, was better*" → a
> deliberate fix for the batch-27 1960 mid-cycle-start problem (#186). Setup uses **interfaction
> drafting** + a **1940s-vintage real-history draft pool** (Earl Warren, Eisenhower, Robert Taft,
> James Farley, Joseph P. Kennedy Sr) drawn onto a 1916 board. Ran **1916→1920 (~1.5 terms)**:
> full 1916-18 governance + the 1918 midterms (GOP recapture) + into the 1918-20 leaders/cabinet
> phase, then trails off mid-second-term (last post Nov 2022). **★ The US NEVER entered WWI**
> (Wilson kept the no-war promise; Selective Service created but no military phase ever fired).
> **Polarity = the PRE-REALIGNMENT HINGE** (progressivism on both parties); do NOT read 1916
> BLUE/RED as modern left/right. **★ This is the FIRST multiplayer 1916 source** (prior 1916 =
> `solo1916`/5027f0f3 solo; `51dfaef1` is a 2024 thread, mis-cited in the task prompt).

## What this thread is / how it relates to prior 1916 coverage

The **second captured 1916-start** and the **first multiplayer one**, exercising the realignment-
hinge era (1896–1932, historical-context §5) directly. It is **designer-adjacent** (vcczar +
MrPotatoTed post rulings) so more authoritative than the GA-run `solo1916`. Value: **(a)** it
runs the era *forward through a real election cycle* (the 1918 midterm GOP landslide — the actual
hinge swing), which `solo1916` never reached; **(b)** it puts the **"Era of Hollywood" era-band
label** + its scripted-event deck on record; **(c)** it is a clean **start-at-era-beginning**
test answering the #186 mid-cycle-boot question; **(d)** it surfaces several **NEW boot/era-content
gaps specific to a 1916 start** that the solo run (one half-term) didn't hit. No 1916 scenario
exists in code (`ls src/data` = only `scenario1772`/`scenario1856`); the era band, the Hollywood
event, Wilson/the 1916 roster are **100% GM-spreadsheet, absent from the build** — every delta is
against designed-but-unbuilt content.

Settled findings from `solo1916` NOT re-logged here (treated as established): the **hinge polarity
roster** (Debs/Socialists + Tillman-Traditionalists in BLUE; La Follette/Borah "Populists" + TR
"Imperialists" in RED), the standard **2.x phase flow**, the **scripted era-event deck** (#109),
**card distribution across all factions** (#24), **leadership IRV** (#70/#110), the **DH-68
Czechoslovakia/Hungary WWI-end ordering bug** (not retriggered — this run never reached WWI's end).

## "Era of Hollywood" era band — scripted events & era-content density (NEW corroboration of #109)

| Item | What the thread shows | Source |
|---|---|---|
| **Era-band label = "Era of Hollywood"** | The 1896–1932 hinge is the game's "Era of Hollywood" band, confirmed by the scripted event below (vs. `e45a756c`'s adjacent "Era of Ideologies" 1928 band). NEW name for §5. | ch3 P191 |
| **★ "Golden Era of Hollywood" scripted event** | Fires in 2.4.3 Scripted Events: "Hollywood movies… leading American art form." Sub-events: **Columbia Pictures + MGM Studios Formed**; **The Red Baron** (WWI ace). Pts to CA Gov William Stephens + CA Sens Hiram Johnson/Shafroth (+50) and LW Media factions. | ch3 P191 |
| Other 1916-20 scripted events (era-accurate texture) | Tomb of King Tut; **Tallulah Bankhead becomes movie star** (gains *celebrity*, **retired from the game**); **Scopes Trial** (Theocrats +50, Law&Order/Science −50); **Penicillin** (QoL roll); "Half of Americans now live in urban areas." | ch3 P191 |
| Random/decision events | **Pancho Villa border raid** (A/B), **Labor Strike** (Pres: national guard 50% party-pref vs. ignore 100% stability), Coal-Mine-Disaster QoL roll, **ability-increase** + **party-switch** general events (5 pols defect to one faction in a year). | ch3 P189-192 |
| **Era-content density at a 1916 start is RICH** | The scripted/era deck is dense and era-accurate for the 1910s-20s — i.e. the *content* exists (in the GM sheet). The thin part is the **scenario BOOT**, not the era events (see boot deltas below). | ch3 P191 |

## ★ Start-at-era-beginning methodology outcome (the #186 answer)

**Verdict: starting at the era's *beginning* (1916) avoided the catastrophic mid-cycle boot failure
of the 1960 run (#186), but did NOT eliminate boot defects — it exposed a different, narrower class
of them.** The 1960 `redbutton` run died from improvising a mid-cycle governance state on top of an
elections-phase start; this 1916 run booted cleanly into a normal post-election 2.1 sequence and got
through a full term + midterm. BUT the **1916 boot sheet is under-populated** relative to other start
eras, and the **start-date economic data is admitted filler**:

| Boot delta | What the thread shows | Maps to |
|---|---|---|
| **★ 1916 start era has NO starting generals/admirals** | P149-157: "Did we not have any generals at the start of the game?" → "also no… the start era for 1916 is pretty bare." Players note "the other start eras all have starting generals" — so the 1916 BootSheet omits the military officer corps that 1772/1856 ship. The SecWar had to appoint the *entire* general/admiral roster from scratch. | NEW, corroborates **#186/#187/#86** (per-year BootSheet incompleteness) |
| **★ Start-date credit/debt are "filler numbers"** | P340-345: a player flags the US-in-debt-to-UK/France figures as ahistorical (US was a *creditor* by 1916 via McAdoo's 1914 NYSE closure); **vcczar confirms "those numbers are filler numbers at this point"** and zeroes credit/debt by GM fiat. | NEW, corroborates **#186/#173** (boot economic-meter seeding) |
| **No starting faction leaders except the President** | P18/P59: "No conversions since no one but Wilson is confirmed faction leader" — the boot seats only the incumbent President as a confirmed party/faction leader; all 9 other faction leaders are *elected in-thread* in a 2.2 "Leaders Emerge" pass. Wilson auto-installed as BLUE party leader (re-elected, gains *controversial*). | corroborates `solo1916` (#92/#4 era boot) |
| Boot polarity = hinge (confirmed forward) | 1918 midterm map "makes sense given the +3 and the era biases" (P448) — the GOP's structural era-bias advantage (1896 realignment) is baked into the board and produces the historically-correct GOP recapture. | corroborates §5 hinge framing |

## ★ Interfaction drafting + the 1940s-vintage pool on a 1916 board (NEW — #115/#4)

| Item | What the thread shows | Maps to |
|---|---|---|
| **Interfaction draft format** | P1-15: a **snake-style rookie draft ordered by total summed PV**, run across BOTH parties simultaneously; each of 10 human factions drafts ~10-11 picks in rounds ("BLUE DRAFT 1… RED DRAFT 1…"). "Top 5 or 10, with trait order following" (P2). Entirely GM-administered; no engine support. | NEW: an **inter-faction draft mode** distinct from the solo within-party draft; corroborates **#24/#92** |
| **★ 1940s-vintage real-history pool on a 1916 board** | The draft pool is dominated by figures whose careers peak in the 1930s-50s: Earl Warren, Eisenhower, Robert Taft, James Farley, Joseph P. Kennedy Sr, Hugo Black, Harry Hopkins, Henry Morgenthau, Henry A. Wallace, Sam Rayburn, Harry S Truman, John Foster Dulles, Marriner Eccles. PV/draftYear puts them in the 1916 rookie class. **Treat the roster as alt-history.** This is the dataset's `draftYear = birthYear+25` rule landing a *cohort* of mid-century figures on the 1916 board. | NEW corroboration of the historical-context batch-29 note; relates to dataset `draftYear` rule |
| **★ Auto-generated candidates appear when the pool runs dry** | P453: "TN-1: **Joe Simpson (auto-generated)** defeats Rep. William C Houston." The GM hand-generates a filler candidate when no dataset pol is available for a seat — the live manual instance of the missing **generate-a-candidate** system. | NEW corroboration of **#115** (`GM⇒App`) |
| **GM "pol editor" used to add real people mid-game** | P118: vcczar uses the "pol editor" to add Attorney General "Mook" (a player's relative) on the fly. The GM can inject arbitrary politicians; no in-app roster-extension flow. | corroborates **#115** (`GM⇒App`) |
| **Mass ideology-shift abuse is a known balance hole** | Players perform **40-60+ ideology shifts per faction per term** (OrangeP: "I consider myself a failure if I do less than 60 shifts"; "this era sucks for mods" → bulk Mod→Cons/Lib conversions). Each is a per-pol die roll the GM resolves by hand (`=randbetween()`); ~20% gain *flip-flopper*. Enormous manual-upkeep load + a balance question (unlimited shifts). vcczar: a rule to limit shifts was "thought about… but nah." | NEW balance/`GM⇒App` (bulk ideology-shift engine + cap question); corroborates DH-36 burnout class |

## Progressive/WWI mechanics exercised (NEW vs. settled)

| Mechanic | What the thread shows | NEW / corroborates |
|---|---|---|
| **★ WWI entry decision NEVER triggered** | The US stays out the entire run. P230: "**Because we've not entered WWI, no military phase**." Congress *creates a Selective Service* (P320, "handy for that World War thing") + grows army/navy, but the war-entry event never fires and no military/combat phase ever runs. **Contrast `solo1916`**, where the Unrestricted-Submarine-Warfare "Enter the World War" decision *was* presented. | NEW: confirms WWI entry is an **optional event-gated trigger**, skippable; the whole military/combat subsystem is dormant unless entered (relates to #106 engine-wars-vs-flavor) |
| **★ 19th Amendment RATIFIED** | "Equal Voting Rights for Women Amendment" passes House 374-61, Senate 79-17, then ratified by states (P383, "VT… 36th state… Wisconsin ratifies soon after"). **Directly contradicts the `drums` finding (DH-14): "this amendment will never pass in a game with CPUs."** Here, with 10 humans + the 1916 era-ideology mix, suffrage passes comfortably. | NEW: **suffrage CAN pass in a human-majority game** → the DH-14 "never passes" problem is a **CPU-AI / era-ideology-weighting** artifact, not a hard mechanical block (`GM⇒App` for #114 + era-keyed bill ideology #DH-14) |
| **Prohibition (18th) absent** | Despite a "ban 90-proof alcohol" gov action (failed) and the dry/wet era framing, no 18th-Amendment event surfaced in the 1916-20 window. Era-event deck did not present it (vs. suffrage which was a *bill*). | NEW gap-note: 18th Amendment not in the fired era/bill set for 1916-20 |
| **★ 1918 midterm = the realignment-hinge swing, modeled** | "**Democrats suffer worst defeat since 1894. R+110**" (P454) — the GOP recaptures BOTH chambers + a net of governorships, matching the real 1918 swing. Designers: "Maybe we finally got the formula right?… given the +3 and the era biases" (P448). The **election scorer's era-bias + a +3 term re-election term** produced a historically-plausible map. | corroborates §5 hinge + **#184/#18** (election scorer; here it's praised, not bugged — a positive datapoint on the post-`redbutton` nerf) |
| **Selective Draft Law SCOTUS case** | 2.6.3 fires the real *Selective Draft Law Cases* — court rules drafts constitutional 7-1 (ideology-voted; Brandeis lone dissent, immune to conversion). | corroborates SCOTUS-case subsystem (variable court, ideology voting) |
| **Foreign-relations diplomacy phase (no war)** | 2.7 Foreign Affairs: SecState *suggests* per-ambassador actions (increase relations / trade / extend-credit-or-loan / provoke-with-tariff), Pres accepts/declines; pliable-Pres + manipulative-SecState forcing rule. Runs every term even with no war. | corroborates #107/#177 (diplomacy/treaty spine) |

## ★ GM hand-adjudications & bugs (`GM⇒App`)

| Item | What the thread shows | Tag |
|---|---|---|
| **★ Legislation-proposal validity DRIFT mid-vote (NEW bug)** | The single biggest process failure. Bills proposed, voted through committee, packaged, and House-voted — then found INVALID against game state mid-second-vote: **P303** "Hawaii territory is legis active, so I won't move it to the Senate / **Teller Amendment is active, so we can't make Cuba a client-state** / Spanish-American war is not recent so we can't issue pensions… *sighs this is what happens when legis props change in the middle of things.*" GM **HALTS and restarts 2.6** (P311-313) and players replace 3 already-voted bills. Recurs (P337 Hudson waterway "another proposal-that-should-not-have-been"). Players: "**why are so many things in the proposal list that we can't propose?**" (P338). | **NEW bug** (`GM⇒App`): the bill-proposal list is **not validated against current game state** (active territories, prior amendments, era prerequisites) before proposal/voting → wasted votes + manual restarts. Corroborates DH-60 (era-prereq gating) for *legislation* |
| **★ Non-citizen / foreign generals eligible (NEW)** | P165-169: **Pancho Villa and Emilio Aguinaldo** (a Mexican and a Filipino) can be appointed US Army generals — "In the game, nothing prevents it. IRL it wouldn't happen." Flagged to vcczar; kept Villa "because it's badass." Nimitz also mis-slotted as a *General* despite Naval exp (P162, hand-corrected to Admiral). | **NEW** (`GM⇒App`): military-appointment eligibility ignores **citizenship** and **exp-type→branch** matching (naval exp ⇒ admiral not general) |
| **★ 2.9 Elections "being overhauled" mid-thread** | P436: "**2.9 ELECTIONS is being overhauled…**" — the election phase was actively redesigned during the playtest (the `redbutton` platform-nerf era). The subsequent 1918 map was then praised as plausible (P448). | corroborates **#184** (election scorer in flux; designer-driven) |
| **Faction-leader eligibility = a documented fallback ladder** | P87/P548: full ruleset — FL needs matching ideology + (interest OR lobby), Leadership, not on career track, not lackey, not obscure; passive non-incumbent 25% decline; **cascading omission fallback** when no one qualifies (drop leadership/lackey → drop interest/lobby → drop career-track/obscure → settle for ideology only). Heavily exercised (most factions' only legal FL was a 25-yr-old or an obscure pol). | corroborates **#110** (leadership pipeline); the **fallback ladder is a concrete spec** for an FL-selection engine (`GM⇒App`) |
| **Cross-party VP / "unity government" = rules-gated** | P238-241: player asks if Wilson+TR could run a unity ticket. GM: "The rules allow you to choose a VP from the other party (ala 1864) in rare, specific circumstances." | NEW rules-clarity note: cross-party VP exists but is narrowly gated (relates to convention/ticket rules #185) |
| **Lingering cabinet-meter engine (full per-meter spec on display)** | P202: the 2.5.1 Lingering pass rolls **8 meters** (Revenue-Budget, Economic, Foreign-Relations per-country, Military-Preparedness, Domestic, Honest-Government, Quality-of-Life, Planet's-Health, Party-Preference) from cabinet skill + traits (*efficient*/*controversial* modifiers). All hand-rolled. | corroborates **#179** (lingering-roll engine, `GM⇒App`) |
| **Filibuster w/ no cloture = bill delayed a full term** | P349: "No rules to invoke cloture exist, so any bill filibustered will be **delayed until 1918-20**." Puritan senators filibuster; e.g. hard-drugs criminalization + income-tax change killed for the term. | NEW rules-note: Senate has filibuster but **no cloture mechanic** (a designed gap, `GM⇒App`) |
| **President-compel-justice-retirement (12+ yr) by die roll** | P412-419: Wilson attempts to *compel* 12+yr justices to retire (per-justice 1/5-6 roll); succeeds on one (court packing flavor), fails another. | corroborates SCOTUS subsystem (mutable court) |
| **Key Advisor = unconfirmed, can fire sitting officials** | P116: Wilson makes Bryan "key advisor" (kicks House "to the curb… historically wouldn't happen until 1919 but we move"); Key Advisor + Fed Chair are the only appointments **not** Senate-confirmed (P111). | corroborates appointment-gate (#112/#107) |

## Open questions (for consolidation)

- **Which start eras ship a full BootSheet vs. a "bare" one?** 1916 lacks starting generals/admirals
  and uses filler debt figures, while 1772/1856 ship officers — is the BootSheet completeness a
  per-scenario authoring gap or a systematic mid-timeline hole? (feeds #186/#187/#86)
- **Should the bill-proposal list be state-validated before proposal?** (active territories, ratified
  amendments, era prerequisites, "recent war" predicates). The mid-vote invalidation forced two GM
  restarts — strongest NEW process bug here.
- **Is suffrage's pass-here vs. never-pass-in-`drums` purely a CPU-AI/era-weighting difference?** If
  so, DH-14 should be reframed as a CPU-vote-modeling + era-keyed-ideology problem, not a bill block.
- **Citizenship + exp-type→branch matching for military appointments** — confirmed unenforced; intended?
- **A cap (or cost) on per-term ideology shifts?** vcczar declined one, but 40-60 shifts/faction/term
  is the dominant manual-upkeep sink and a balance lever.

## Candidate gaps/bugs for consolidation (each: NEW vs. corroborates-#)

- **NEW bug — legislation-proposal list not validated against game state** (active territory / prior
  amendment / "recent war" / era prereq) → wasted votes + 2 GM phase-restarts (ch4 P303, P311-313, P337-338). `GM⇒App`. Extends DH-60 to legislation.
- **NEW — 1916 BootSheet is "bare": no starting generals/admirals** (other eras ship them) (ch2 P149-157). Corroborates #186/#187/#86.
- **NEW — start-date credit/debt are admitted "filler numbers"** (vcczar zeroes by fiat) (ch5 P340-345). Corroborates #186/#173.
- **NEW — military-appointment eligibility ignores citizenship + exp-type→branch** (Villa/Aguinaldo as US generals; Nimitz mis-slotted) (ch3 P162-169). `GM⇒App`.
- **NEW — auto-generated filler candidate when pool is empty** ("Joe Simpson (auto-generated)") + GM "pol editor" injects pols mid-game (ch6 P453; ch2 P118). Corroborates #115 (`GM⇒App`).
- **NEW — Senate has filibuster but NO cloture** → filibustered bill delayed a full term (ch5 P349). `GM⇒App`.
- **NEW — interfaction (cross-party, PV-ordered snake) draft mode** with a 1940s-vintage real-history pool on a 1916 board (ch1 P1-15). Corroborates #24/#92/#4 + dataset draftYear note.
- **NEW — bulk per-term ideology-shift abuse (40-60/faction)** = dominant manual-upkeep sink + uncapped balance hole (ch6 P472, P487, P494). `GM⇒App`; corroborates DH-36 burnout.
- **NEW datapoint — 19th Amendment PASSES in a human-majority 1916 game** (House 374-61 / Sen 79-17, ratified) — contradicts DH-14's "never passes with CPUs." Reframes DH-14 as CPU-AI/era-weighting (#114).
- **NEW — "Era of Hollywood" era-band label + "Golden Era of Hollywood" scripted event** (Columbia/MGM, Red Baron) (ch3 P191). Corroborates #109; names §5 band.
- **NEW (positive) — start-at-era-beginning (1916) avoids the #186 mid-cycle boot catastrophe**; the 1918 election-scorer map is designer-praised as plausible. Corroborates #186 (as the fix) + #184 (scorer post-nerf).
- **Corroborates #179** — full 8-meter lingering cabinet-roll engine on display (ch3 P202). `GM⇒App`.
- **Corroborates #110** — faction-leader eligibility + cascading-omission fallback ladder spec (ch2 P87; ch7 P548). `GM⇒App`.
- **Corroborates #106 / WWI optionality** — US never enters WWI; military/combat phase dormant unless the war-entry event is taken; Selective Service created without war (ch3 P230; ch4 P320).
- **Corroborates §5 hinge polarity** — GOP era-bias recapture (R+110, 1918) is the modeled realignment swing; do NOT read 1916 BLUE/RED as modern (ch6 P454).

## Source

`wilsons1916` (a0b7ef49) "Wilson's Vision: 1916 Playtest" — 581 posts / 7 chunks. **1916-start
10-human MP**, Progressive-Era/"Era of Hollywood" band; GM @Arkansas Progressive, designers
@vcczar + @MrPotatoTed authoritative in-thread. Ran 1916→1920 (~1.5 terms), US never entered WWI,
19th Amendment ratified, GOP 1918 recapture; trails off mid-second-term (no formal abandonment).
**Pre-realignment hinge polarity.** Cited `POST n` (`===== POST n =====` markers) + `chunk-N`.
