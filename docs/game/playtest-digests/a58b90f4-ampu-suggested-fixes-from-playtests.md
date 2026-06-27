# Digest — a58b90f4 "AMPU Suggested Fixes from Playtests" (DISCUSSION / FIX-CATALOG)

**What this thread is.** A **structured bug/fix ticket queue** opened by **@vcczar
(designer, tier-1)** for the forum game, run as a strict template ("1. issue / 2.
example / 3. suggested fix / 4. historical evidence"). 476 posts / 10 chunks,
spanning **~June 2022 → late-Sept 2022** (visible window) and aggregating fixes
surfaced across **many concurrent playtests at once** (1772 single-player Ted/10cent;
1840 multiplayer; 1916; 2016/modern; the Civil-War 1840→1850 run). It is NOT a
playtest — it is the upstream **origin** of a large share of rules now logged in the
KB from later playtest digests, plus **vcczar's own live dispositions**.

**Authority.** This is vcczar's queue, so it is **designer-authoritative throughout**:
vcczar (V) and MrPotatoTed (Ted, co-author) are tier-1; their batch-disposition posts
("Alright, I've gone through these…" — POSTS **67, 90, 118, 162, 168, 223, 263, 393**)
record **accepted / rejected / deferred-to-"To Do"** rulings. GAs (Will, Tyler/Ich,
Rezi, Cal, Vols21, matthewyoung123, OrangeP47, ConservativeElector2, 10centjimmy,
Murrman, Pringles, jvikings1) are tier-4 proposers. **`GM⇒App` note:** every accepted
item here is GM hand-work the app must own; the whole thread is a `GM⇒App` charter
artifact (the GM is patching rules a human then hand-adjudicates).

> **Disposition legend:** ACCEPTED = V/Ted made the change (often "pending V approval"
> = effectively accepted); DEFERRED = added to V's "To Do list" (real but unscheduled);
> REJECTED = V/Ted declined; OPEN = discussed, no ruling; CLARIFIED = rule wording
> pinned (no mechanical change).

---

## A. Elections — non-presidential, incumbency, meters, swings

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| Non-pres elections ignore traits/industry/lobby | Add a trait list (Likeable±1, Charismatic±1, Leadership, Orator/Debater/Propagandist/Puritan/Cosmopolitan checks), expertise-matches-leading-industry +2, lobby +1, crisis-expertise +1; FL +1 / PL +3 in non-pres primaries | Will (POST 6) — **OPEN/partial** | **balance**; build NOW applies traits+meters to gov/sen/house via `calcStateVote`+`applyTraitElectionBonus` (verified `phaseRunners.ts:3685,3707`) → partially shipped; lobby/expertise-industry still gaps (#5, #166, #51) |
| Meters don't hit non-pres / midterm elections | "all meter impacts included" | Cal (POST 7); V **pushed back** (POST 16: "an election in one state really isn't going to matter"), later **effectively ACCEPTED** (build applies enthusiasm+partyPref to all contexts) | matches #83 midterm-wave, #18 |
| House wipeouts (90%→80% swing every cycle) | **Compound incumbency**: +1 (1-2 term) / +2 (3-4) / +3 (5+) | Rezi (POST 38) — **OPEN** | **balance**, NEW angle on #83/#38(politician-decay) — *compounding* incumbency not logged |
| Incumbent bonus too low (House/Gov) → "incumbents drop like flies" | raise House+Gov general incumbent bonus | Will (POST 304-308); V **ACCEPTED** (POST 309 "Fixed this") — Senate fine, House/Gov boosted | **balance** → #83 |
| Party-preference swing has no cap → +8-blue blowouts (1792 100% blue / 1794 98% red) | **Cap party-pref meter swing at ±3** (max state lean = ±5) | **Ted POST 407-408; V ACCEPTED-for-test (408), Rezi+Ted test ±3 vs ±5** | matches **#80** (±3 cap) + **DH-34/DH-42** (meters swamp lean) — strong 2nd source |
| Crisis bonus/penalty too swingy (−3/state booted Harrison ahistorically; min/max-tank-the-country exploit) | **Cap crisis election bonus/penalty at 2** | Rezi (POST 37) — **OPEN** | **balance** → #18, **DH-42**; min/max-exploit = #184-adjacent |
| "Incumbent party" undefined when Pres & Congress split | Penalize incumbent **candidates** (all offices) not a party; add a **blame-roll** (Pres can blame opposite-Congress, 5-6 succeeds/3-4 nothing/1-2 backlash) | Ted POST 257-260, Will+others — **OPEN** (V silent) | **NEW** — "blame-assignment roll" mechanic not in KB |
| Contested/disputed election has penalties but **no resolution rules** | SCOTUS adjudicates with per-trait vote table (Integrity→reported result, Lackey→party, Activist→enthusiasm-party, Controversial→50/50, else 75/25; CJ-Manipulative can sway) | Tyler POST 139-141 — **OPEN** | matches **#62, DH-6, #100** (SCOTUS overturn) — concrete trait table is NEW detail |
| Provincial trait too weak → popular cross-lean govs (Baker/Scott/Manchin) crushed even-environment | bump Provincial to **+2 momentum**; many Reps/Govs should *have* Provincial (late-added trait) | Pringles POST 423-432; **Ted OK with +2, V DEFERS roster work to Early Release (POST 437)** | **balance** + **dataset** → DH-64-adjacent (trait mislabels), #21 |
| Faithless electors can pull winner below 270 + tie → contingent | (1840 Whig 146-141, 5 tied states, faithless pulled under) adjudicate disputed states first, then contingent | Tyler POST 97 — **OPEN** | matches **#19, DH-13, #62** |

## B. Pre-12th-Amendment presidential election (Kingmaker caucus)

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| Pre-12A election is "insane chaos," ahistorical (incumbent Pres → VP) | **Kingmakers act as the nominating caucus**: each KM 2 ballots; top-2 KM-supported become nominees; then run election, top vote=Pres / 2nd=VP | **Ted POST 291-293; V ACCEPTED** (POST 293 "I'll add this… come up with something cool") | matches **#13, #44, DH-62, #93** (12A state machine) |
| The accepted pre-12A rule still ignores traits + leaves CPU running too many alternates | Cal's **two-step** rewrite (POST 438/450): orders → per-trait revote (Disharmonious/Pliable/Puritan/Debater/Integrity/maxed-opposite each get %); all states vote simultaneously | Cal POST 438/450; **Ted iterating live (POST 450-456), V updated 2.9.4 CPU VP + alternate rules (455-456)** | **`GM⇒App`** convention state-machine detail; sharpens **#13/#71/#72** + **DH-57** |
| CPU pre-12A VP always = highest-EV state (both parties pick same state every cycle; GOP nominating Californians) | VP must come from a **winnable** state (≥½ KM electors same-party, or no-KM + same-party Gov) | Ted POST 452-453; **V ACCEPTED, altered 2.9.4 (455)** | matches **#72** (CPU candidate selection), **#15** (VP impact) |
| CPU always runs an alternate → mostly-CPU fields stay bloated | alternate ≠ same state/ideology as another same-party cand, not on career track | Ted POST 451; **V ACCEPTED, added CPU-alternate rules (456)** | matches **#72** |

## C. Convention / primary / 3rd-party

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| **No CPU rule for compromise-candidate selection** at a deadlocked convention | 50% random other-faction matching/adjacent FL-ideology / 25% lowest-scoring / 25% random other-party | Tyler POST 135 — **OPEN** | matches **#71, DH-8, #13** |
| Compromise candidates fire **too early** (5 ballots) → CPU never lets an original win | extend originals' window **5→~7-10 ballots**, dark-horse after | Will POST 464/469; **V ACCEPTED-ish (POST 469 "7-8 or something")** | matches **#71, DH-17, DH-18** |
| No order/count rules for convention/primary candidate **actions** | 4 options (leader-first lockout / minor-first / random / command-tied) | Will POST 117 — V **deferred to "whatever I originally had" (120)** | matches **#13, DH-17, #111** |
| **Endorsement/mass-dropout gives NO momentum** (Biden-2020-style) | endorse = +momentum; tune to %: minor 0% / major 25%, and **whether endorser's state has voted + delegate-closeness** | Pringles POST 228; Will/Ted POST 229-233 — **OPEN** | **★ exact match #183 (`redbutton`)** — this thread is the **ORIGIN** of #183; verified no `momentum`/`endorse` code in engine |
| Mods/Mavericks/Integrity should **refuse to endorse** a populist (esp. vs a moderate); disharmonious extremists refuse establishment | trait-gated endorsement refusal | Murrman POST 238 — **OPEN** | **NEW** — endorsement-refusal-by-trait |
| Too few primary actions (only speeches/rallies) | add **Seek Local Endorsements** + **Campaign on Local Issues** (full d6 trait tables) | Rezi POST 224; "100% back this" (227) — **OPEN** | matches **#47** primary subsystem |
| Sitting-Pres-challenge rules contradict (2.9.1 vs 2.9.2) | 2.9.1 (low-enthusiasm-faction only) supersedes 2.9.2 | Tyler POST 133 — **OPEN** | matches **#48, #111** |
| **3rd-party edge cases** undefined: 2 simultaneous 3rd parties? from the faction already holding the nominee? all 3 dissatisfied ideologies? | V **CLARIFIED**: scripted 3rd-party **overrides** meter 3rd-party (no double); 3rd party **nullified if low-enthusiasm faction has someone on the ticket** | Tyler POST 444/457-468; **V RULED (462, 468)** | matches **#48, DH-11, DH-55** — *new authoritative clauses* |
| CPU can't retain a VP | add per-era-rising chance CPU keeps VP | Will POST 148 — **OPEN** | matches **#72** ("no-VP-retention") — confirms the hole |
| CPU VP selection near-random | CPU should drop restrictions until best VP found (ladder, like FL search) | Will POST 243 — **OPEN** | matches **#72, #15** |

## D. Cabinet / SCOTUS / confirmation / appointments (CPU)

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| CPU confirm-vote can have a party **vote down its own nominee** | Pres-party defaults YES unless traits flip; minority defaults NO/random | Tyler POST 14/18; V notes rule exists in 2.8.5 (24) — Ted clarifies 75%/own-faction-always (18) — **CLARIFIED** | matches **#73, DH-20, DH-23** |
| Auto-confirmed (blocked) Justice replacement has **no ideology limit** | replacement must be **moderate / opposite-party ideology matching Pres's cards** | Ark POST 13/17 — **OPEN** | matches **#52** (auto-confirm-default), **#142** |
| CPU SCOTUS pick can give a Trad Pres a Liberal Justice (lowest-faction option) | **ladder**: highest-judicial-from-party → tie: own faction → lowest-scoring → tie: appointer-ideology → random | Will POST 244; **Ted drafted + V ACCEPTED into 3.0 (247-250)** | **★ exact origin of #142** (CPU CJ ladder) — confirms it |
| CPU ignores **region** in cabinet → Dom-Stab tanks for region never picked (Fillmore neglects Deep South) | 33% ability / 33% lobby / 33% region (fill unrepresented region) | jvikings1 POST 230 — **OPEN** | **★ origin of #31 + DH-23** (region/diversity cabinet) |
| Region cabinet-penalty fires for 1-state regions (1840 IL/TX) | region counts only once it has ≥2 (or ½+1) states admitted | matthewyoung123 POST 68-72; **V ACCEPTED ("≥2 states in region" rule, POST 90)** | **balance** → #31 |
| Justices retire under opposite-party Pres (Thomas-under-Dem) | lower retirement odds for opposite-party Justices; **also require their party hold Senate majority** | Pringles POST 300; **V ACCEPTED (301), Ted adds Senate-majority caveat (302)** | matches **#52, #85** (retirement model), #130 |
| **Key Advisor** can wreck a run | make Key Advisor **optional**; CPU only appoints if a ≥3-admin option exists | **Ted+V POST 370-371 (V's idea) — ACCEPTED** | matches **#22** (Egghead/advisor), #73 |
| New Pres can't fire/replace predecessor's cabinet until a "firing precedent" Pres-action | add a **Legis-Prop to fire a cabinet officer** usable only before the Pres-action precedent; note at top of appointments | Ted POST 297-299/389-393; **V ACCEPTED, new Legis-Prop "Give the President the Authority to Fire Cabinet Officers" (393)** | matches **#25** (firing-precedent gate) — confirms + adds the bill |
| Rejected nominee → Controversial, then Incompetent (toxic/untouchable), block re-nomination | automatic unless a blocking trait (Bookkeeper) | **Ted POST 434-436 — ACCEPTED (already implemented)** | **NEW** — confirmation-rejection trait cascade |
| Cabinet/SCOTUS confirm when **no Senate** (alt-constitution / pre-Senate eras) | vote held by remaining chamber; if no Congress, automatic | OrangeP47 POST 123/128; **V ACCEPTED into Cabinet+SC rules (128)** | matches **#159** (Const-Convention), DH-39 |

## E. Command (the candidate-pool problem) — big multi-page thread

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| **Command never decays** → has-beens (Dewey, MacArthur, Gore, Dukakis…) run decades late; flash-in-pans (Buttigieg) born with it | Big debate. **Ted's synthesized proposal (POST 210/212):** (1) post-1772 boots: no command >10 yrs after last real pres run; (2) census-decade roll **60% lose 1 command**; (3) **toggle** "no command at rookie draft, must earn it" paired with **doubled command-gain %** | **Ted POST 210; V ACCEPTED "fine with this, nothing more extreme" (212)**; refined per-pol clock (Will 219), sitting Pres/VP keep ≥1 (211) | **★ origin of #130/#143/#36/#40** + **#153** (doubled-command toggle) — strong 2nd source. **Build:** PV = `command*10` (`pv.ts:74`) so decay directly reshapes the pres pool |
| Command "trigger/activation + sunset dates" | activation ~8-10 yr pre-real-run, sunset ~10-16 yr post | Vols21 POST 51/203, 10cent — V **REJECTED the per-pol-date approach** (POST 67: too much data work, "strongly opposed to no one born with command") | balance — V's rejection is authoritative on the *date-stamp* variant |
| No-command-at-draft (must earn) | toggle | Will POST 53/195; **V REJECTED as default** ("strongly opposed"), **ACCEPTED only as a toggle** (#153) | matches **#153** |

## F. Skills / traits / career tracks / aging

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| Career tracks (Legis/Gov) flood game with 5-star pols who never held office after ~20 yrs | **weaken** Legis+Gov tracks; cap track gains at 4; idea: tracks give **soft skills/traits** not numeric stars | Ted POST 320-360; **V REJECTED removal, ACCEPTED weakening + cap-4 (POST 393/394)** | **balance** → #36, #163 (career-track seeding), DH-25 |
| FL/PL rolls make pols **super-skilled** (5-gov George Clinton w/o governing) | cap FL/PL skill-gain at 3-4 | Cal POST 310; **V ACCEPTED then REVERTED** after Ted/Will pushed back (high-risk-high-reward, 40% retire) — **POST 311-315 net = NO CHANGE** | matches **#29/#30, #141** — *authoritative non-change* |
| Random-retirement rule self-contradicts (<60 vs 25-50 1%/50-70 5%) | "No one under 50/60 retires" + delete young chance | Rezi POST 82; **V ACCEPTED ("under 60 won't retire", POST 90)** — but left stray text (91) | matches **#85** (retirement rate) |
| Judicial-only pols can't grow skill | (rejected Circuit Court) **V's fix:** "Increase number of lower-court justices" action → a non-officeholding ≥1-judicial pol in each Pres-party faction gains +1 judicial, once per admin | Vols21 POST 23/26; **V RULED + implemented (POST 26)** | matches **#52, #66** — concrete mechanic |
| Kingmaker can pass **military** skill to a no-military pol | bar military/naval transfer | Cal POST 73; **V ACCEPTED ("Kingmakers cannot pass military and naval expertise", POST 90)** | **★ origin of #129** (Kingmaker→Protégé block-list) |
| Kingmaker-with-Leadership protégé count ambiguous (3-at-once vs 1/term) | 1 protégé per 2-yr term, max 3 | Cal POST 134 — **OPEN** | matches **#128/#129** |
| Master Kingmaker only via backroom track | add 1-5% gain for Speaker/SenMajLdr/Key-Advisor re-election | (POST 239) — **OPEN** | matches **#128** |
| Conflicting traits (Passive+Overeager, Harmonious+Disharmonious) — cancel vs block? | make **one blanket rule**; Ted prefers "cancel out", V's later FL text "keep original" | Will POST 242/246, Ark POST 266 — **OPEN** (inconsistency flagged) | matches **#168** (terminology standardization) |
| Cabinet service should grant cross-expertise (Kissinger) | chance to gain position-related expertise | Murrman POST 294 — **V REJECTED** (would make career-cabinet people, ahistorical, POST 295) | balance — authoritative rejection |
| Extreme-wealth class for tycoons (Carnegie/Bloomberg) | re-add wealth attribute | CE2 POST 152 — **V REJECTED for now** (tedious; post-Early-Release, POST 162) | **NEW**/deferred — no wealth axis in build |
| Lose/regain **Obscure** in internet era | easier to shed; should it return? | CE2 POST 187; **V REJECTED regain-obscure** (FL-cycle exploit, POST 198/223) | balance — authoritative |
| Defeated-incumbent / lost-pres should lose command toward 0 | (recurring) | many — folded into command thread | matches **#37, #105, #130** |

## G. Governors / states / industries / census

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| **Small-state gov actions** move national meters the same as large (NV desegregation, 1960) | small-state −50% / large-state +50% to meter-impact chance | Murrman POST 83; **V DEFERRED** ("takes me a long time… wait", POST 90) | **★ origin of DH-15** (small/large-state multiplier UNCODIFIED) — confirms |
| Gov actions too generic / fail too often (only Gov stat) | add **expertise +1** to relevant action; region/era-major-law easier (Jim Crow/Prohibition) via first-mover-gets-points-each-time model | Vols21 POST 283, 0ccultist POST 269-270; **V ACCEPTED Gov-buffs + easier-Jim-Crow-in-South (POST 288), first-mover model (270)** | matches **#20, DH-19, #150** ("1872 rule" first-mover) |
| Industries too restricted per state (DE can't have Finance) | open all industries to all states bar geographic exceptions | Ted POST 138; **V DEFERRED to "To Do" (POST 158)** | matches **#35, #166** |
| Free/Slave admission has **no CPU balance pressure** (CPU admits 2 slave states) | post-1820 penalty for unbalanced admission, bonus for own-side gain | matthewyoung123 POST 77; **V ACCEPTED (new misc-rules penalty, POST 90)** | matches **#59, #94, #21** (slavery) |
| Census timing/phase unspecified | run census **after** the decade (year-0) election; applies next cycle | Ted POST 256 — **OPEN** | matches **#34** (census-driven EV) |
| Gerrymander any year | only the gov-action right after a census; 2× difficulty mid-decade | Ted POST 281-282 — **OPEN** | matches **#34, #21** |
| Relocation has no per-turn cap → pol chains 4 state moves | cap attempts (2/region/2-yr, 3 for Expansionist) + failure penalties | Cal POST 39 — **OPEN** | matches **#38** (carpetbagger/relocation cap) — concrete numbers |
| Region penalty needs region set to **shift per era** (Lower South 2 states in 1788) | era-keyed region rosters | matthewyoung123 POST 70 — **OPEN** | matches #31, #92 |
| Lost state/territory (war/refusal) — what of its pols? | 75% removed / 25% reassigned to an existing state | Ted POST 361-366; **V leans permanent-gone-unless-alt-state (366)** | **NEW** — lost-territory pol disposition |
| Capital-move scoring industry-based → ahistorical votes (South backs Boston) | score on **State + Region + Industry** (+ same-region officeholders), only mover's-state pol may propose | Ted POST 165/173; **V ACCEPTED (added region, POST 168/171)** | matches #35, **NEW** capital-move scoring detail |
| Domestic Stability only ever drops | +DomStab on decisive (60%+) pres win; +1/+2 on war win | matthewyoung123 POST 166; **V ACCEPTED (60%+ pres win → +DomStab, POST 168)** | matches **#50** (meter bank), #166 |

## H. Legislation / budget / committees / bills

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| **Multiple crisis bills** pass/fail — no blame rule | if more crisis bills pass/repeal than fail, no blame | Ark POST 8; ShortKing **defended status quo**; Ted+Will **agreed to change** — **OPEN** (V silent) | matches **#11** (Crisis Bills) — NEW "majority-of-crisis-bills" rule |
| Filibustered MUST-pass bill no remedy | — | (implicit in thread) | matches **DH-1** |
| Revenue/Budget meter: non-crisis-spending-bill cap unrealistic | maybe drop the cap once economy "can't collapse" (~1880, FF-style) | Ted POST 279-280; **V DEFERRED** (POST 280) | matches **#27, #42** (budget-gated spending) |
| Event-creates-bill: slot? proposer? committee-killable? (Compromise-1790, Lee's Resolution) | clarify; some auto-pass | Ted POST 235/112-115; **V CLARIFIED some (118)** | matches **#89** (event creates office), #11 |
| Voting power vs focus-reps ambiguity | voting power = #reps for floor votes; **focus-reps only for committees** | Ark POST 236-237 — **OPEN** | matches **#8** (committees), #135 |
| CPU committee-chair pick could hand chair to **opposition** (highest-legis tiebreak) | always favor own party | Tyler POST 373; **V/Ted ACCEPTED (fixed, POST 374)** | matches **#8, #74** |
| Speaker/SenMaj "supported" bill wording ambiguous; can leaders propose? | V **CLARIFIED**: Speaker/SenMaj/PPT **cannot propose bills** | Ark POST 305-306; **V RULED (306)** | matches **#28, #74, #135** |
| Cross-party Speaker won (56-44 Dem, Whig won) "should be impossible" | pre-leadership-office both parties vote on Speaker (ahistorical) — revisit | Will POST 340-346 — **OPEN** | matches **#28, #135, #70** (IRV bloc-vote) |
| "Ban polygamists" bill only scores, doesn't remove Mormon officeholders (Joseph Smith stays Gov IL) | bill auto-removes Mormons from office (or via SCOTUS) until repeal/1890 | Will POST 131-132/175 — **OPEN** (V pinged repeatedly) | **NEW** — law-with-personnel-effect (bills that EJECT officeholders) |
| Wartime tax bills have no war prereq / auto-expire | add war prereq + post-war reversion; audit all LegisProp triggers | Ted POST 99-100; **V DEFERRED ("To Do", 118)** | matches **#147** (tariff-rate bill), #42 |

## I. Era content / events / scenarios / military

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| **Rev War starts before army exists** (military phase before legislative) → instant game-over | Lexington/Concord triggers a **special session** to create Army/Navy (or move Foreign-Affairs after Congress) | Ted POST 110-111; **V ACCEPTED (special session, POST 118/248)** | matches **#56, DH-61** (scenario must seed era-wars), #110-loop |
| Several federalism events assume Rev War ended (Annapolis/Const Conv auto-fire 1786-88 but require war won) | clarify what happens if war runs into Federalism | Ted POST 176; — **OPEN** | matches **#159, #2** (era boundary) |
| Era-name strings inconsistent ("Era of Ideologies"/"Ideology"; "Nuclear Age"/"The Nuclear Age") → events never fire when coded | standardize era strings | Ted POST 98; **V DEFERRED (acknowledged typo-prone, 118)** | **★ origin of #168/#123** (terminology standardization) |
| Normalcy-era events/legis mis-dated to Progressivism/Ideologies (Zimmerman, USW, Selective Service, Russian Rev…) | re-bin to correct era | Ark POST 331/95; **V CLARIFIED** (historic-pass-date + can-fire-early model, 332) | matches **#68/DH-68** (WWI-end prereq), DH-2, #95 |
| WWI/WWII near-impossible to enter; can't side with Germany | maybe Senate-vote / exec-action to join a war voluntarily; siding-Germany = out of scope (DLC-tier) | Murrman/0ccultist POST 378-387; **V REJECTED side-with-Germany** (POST 387), entry-method OPEN | matches **#45/#106** (generic war), DH-47 |
| Treaties have **no rules** (who rolls implementation in Continental Congress — no SoS/President?) | write treaty rules incl. vacancy-implementation | Ted POST 142; — **OPEN** | matches **#177/#178** (federalism diplomacy/treaty spine) — **2nd source** |
| Losing-war treaties wrongly grant industry bonuses | strip / make them losses | Ted POST 140; **V DEFERRED ("To Do", 160-161)** | matches #45, **DH-53** (bill→meter sign bugs) |
| War heroes / battle flavor for non-general pols | roll for hero (50/25/10% by difficulty), traits/celebrity, death chance for young | Vols21 POST 101; **V REJECTED-ish** (war is "secondary/tertiary… AMPU 2", POST 118) | balance — authoritative deprioritization of war |
| Senior General/Admiral may **also** lead a battle (pre-JCoS era) | yes — traits count twice (as senior + field cmdr) | matthewyoung123 POST 30-33; **V RULED yes (33)** | matches **#49** (military-leadership tier) |
| JCoS/Chairman 0-admin **tanks Mil-Prep** in lingering (Twining 1960) | rerate generals w/ some admin (JC=1-2, chairmen≥3) OR use military skill; **V's fix:** senior general/admiral/JCoS **don't impact lingering meters** | matthewyoung123/Vols21 POST 2/80; **V RULED (exclude from lingering, POST 90)** | matches **#179** (cabinet lingering-roll engine), #49 — concrete carve-out |
| JCoS should be standalone (open to admirals) | admiral can be appointed to JCoS (not standalone); incumbent-military penalty extends to admirals | Ted POST 419-422; **V RULED (420-422)** | matches **#49, #170** (era-keyed offices) |
| Modern future "off the rails" by 2032 (talking animals) | split into **Near Future (2024-2050)** + **Distant Future (2050-2100)** | Ted POST 271-272; — **OPEN** | matches **#2, #161, #169** (era extension) — corroborates near-future band |
| Lost-state-claim events permanent | add **one follow-up** event to re-press claim (Vermont/NW) | Ted POST 363-365; **V ACCEPTED-in-principle (follow-up event, 364), needs event list** | matches #33, #60 (Canada), DH-60 |

## J. Boot / scenario-creation / data quality / pardons

| Item | Problem → fix | Who + disposition | Maps to |
|---|---|---|---|
| **"Start any year" can't be realistic** — traits/skills wrong for date | Ted: kill "start any year," hand-craft set scenarios (1772, 2024, 1960, 1860, 1788) → V counters **"start any ERA"** (peak/mid/early skill curves already exist), traits remain the gap | Ted POST 41/42; **V CLARIFIED** ("currently start-any-era, I handcraft offices/laws", POST 45-48) | **★ origin of #86/#115/#173/#164** (scenario boot, mid-era friction) — designer statement |
| Era-start traits are "born-with or never" (no career-stage trait curve) | accepted as the residual gap; V keeps born-with for ~750 well-documented pols | V POST 47 — **OPEN/won't-fix-for-now** | matches **#115, #163, DH-27** |
| **Common-name collisions** (PaineCPU has 3 "John Smith") | add disambiguator (middle initial / state) | Ted POST 136; **V REJECTED** (no middle names pre-1800s; "use your own tracking", POST 157) | matches **DH-65** (same-name wrong-century pool) — note V *declines* the rename |
| Repealable-flag data bugs: Treaty of Manila / Lee's Resolution / Dec of Independence / Teller Amendment | set repealable correctly; Teller **made repealable** (V POST 393) | Tyler POST 5/318, Ted 113-114; **V ACCEPTED several (Lee's, Teller); merge Lee's+DoI suggested** | matches **#120, #175** (per-law repealability flag), DH-28 |
| New Jersey **missing as a state**; 13 states "default" vs Land-Ordinance prereq inconsistency; no 1772 capital | add NJ; mark 13 states auto-on in 1772; "Move Capital to Philadelphia" default | Ted POST 104-106/115; **V ACCEPTED all (NJ, capital, state consistency, POST 118)** | matches **#43, #2, #106** |
| Gov actions need same-party Senator even pre-Senate eras | requirement void if no Senate | Ted POST 122; **V ACCEPTED (note added, POST 127)** | matches #20, #159 |
| Lots of Legis-Props have impossible/ahistorical triggers (repay WW1, embargo Germany, add Missouri free state in modern) | audit all LegisProp triggers/expirations | Ted POST 100/119; **V DEFERRED (ongoing skim, 118)** | matches **#5, #120** |
| Acting-President → President precedent is a weird Pres-action | make it a **roll** on first Pres-Congress conflict (75%, trait-modified); Tyler refused title (historical) | Murrman POST 262; **V DEFERRED to "To Do" (POST 263)** (needs Tyler precedent) | matches **#112** (unelected-Pres layer), **#61** |
| Is an Acting Pres the party leader? | rule says **elected** president → Acting Pres is NOT auto-PL | Will POST 268/274; **V RULED ("elected president", POST 275)** | matches #30, #112 |
| Appointed-official retire vs resign timing | resign = immediate; elected retire = before **the** next election | Ark POST 277; **V/Ted CLARIFIED (278), to be written into 3.0.28** | matches **#85, #154** (vacancy-fill ladder) |
| Pardon mechanics | (not raised here) | — | **#122** unaffected |
| **"Think Tank / Campaign Advisor" AI suggestion helper** (1-3 suggested moves) for solo play | reuse CPU logic to suggest player moves | Vols21 POST 9 — **OPEN** | **NEW** — in-app *advisor/onboarding* aid; ties **DH-69** (onboarding) + **`GM⇒App`** |
| Dead/retired-pol viewer ("political graveyard"), living-former-officeholders pages | flavor screens | CE2 POST 96; **V ACCEPTED-intent (118)** | **NEW** — UI/history-browser surface |
| Bench/disgrace a politician (don't-run / force-resign); benched pol may run **against** you | add benching + rogue-run-on-bench | CE2 POST 376/390 — **OPEN** | **NEW** — voluntary benching + rogue-primary-challenge |
| Impeachment-failed-conviction party-pref effects | V **RULED** (POST 393): 50% −partyPref impeached-Pres-party / 25% −only-convicting-party / 25% both (no change); convicting-own-party pols: 25% Disharmonious, 50% Integrity, 25% nothing, +25% Can-Be-Independent, 75% −1 / 25% −2 next primary | Pringles POST 333; **V RULED + implemented (393-394)** | matches **#112, DH-54, DH-66** (impeachment) — **concrete authoritative numbers** |
| US-Bank President office undefined | V **RULED**: "President of the US Bank (Economics)" must go to **Wall-Street-Lobby** faction, +100 pts, Controversial-gated | Ted POST 339; **V RULED (393)** | matches **#95** (2nd Bank), #89/#101 (offices by law) |
| Pelosi should have Iron Fist | dataset trait add | Hestia POST 395; **V leaning NO / earned-not-born** (poll, 397-406) — **OPEN** | matches **#120, #77** (Iron-Fist) — dataset |
| d3 → d6 for election swing die (state biases go to ±5) | update all d3 rolls to d6 | Ark POST 276 — **OPEN** | matches **#18, DH-42** — engine die-size |

---

## Candidate gaps/bugs for consolidation (NEW — not clearly in current log)

1. **Compound/escalating House incumbency bonus** (+1/+2/+3 by tenure tier) — *balance* (POST 38). #83 covers wave-swing but not tenure-tiered incumbency.
2. **"Blame-assignment roll"** when President and Congress are split — who the public blames for a crisis, with a Pres counter-blame roll (5-6/3-4/1-2) — *balance/new mechanic* (POST 257-260).
3. **Endorsement-refusal-by-trait** — Mod/Maverick/Integrity withhold/cross-endorse vs a populist; disharmonious extremists refuse establishment — *balance* (POST 238). (Distinct from #183's "endorsement gives no momentum.")
4. **Confirmation-rejection trait cascade** — rejected nominee auto-gains Controversial→Incompetent (blocks re-nomination unless a blocking trait) — *fix/new rule, ACCEPTED+shipped in forum* (POST 434-436).
5. **Bills that EJECT officeholders / impose personnel effects** (polygamist/Mormon ban removes sitting Govs; optionally via SCOTUS) — *fix*, currently bills only score (POST 131-132).
6. **Lost-state/territory pol disposition** — when a state is lost to war/refusal, 75% remove / 25% reassign its current+future-draft pols — *new rule* (POST 361-366).
7. **Voluntary "bench/disgrace a politician"** action (+ chance a benched pol launches a rogue primary challenge) — *new feature* (POST 376/390).
8. **In-app "Campaign Advisor / Think Tank" suggestion helper** (1-3 CPU-logic-suggested moves for solo players) — *new feature*, `GM⇒App` + onboarding (POST 9); pairs with DH-69.
9. **Dead/retired-pol "graveyard" + living-former-officeholders history screens** — *new UI surface* (POST 96).
10. **Capital-move scoring = State+Region+Industry + same-region officeholders; only mover-state pol may propose** — *fix*, concrete scoring model (POST 165-173).
11. **Extreme-wealth attribute** for tycoons — *balance/data*, V-deferred not rejected forever (POST 152/162).
12. **Per-relocation-attempt cap** (2/region/2-yr; 3 for Expansionist) + escalating failure penalty — *fix*, sharpens #38 with concrete numbers (POST 39).
13. **Master-Kingmaker gain via top legislative leadership** (1-5% on Speaker/SenMaj/Key-Advisor) — *balance*, extends #128 (POST 239).
14. **Election swing die d3→d6** (to matter vs ±5 state biases) — *fix*, engine die-size, sharpens DH-42 (POST 276).
15. **"Increase lower-court justices" action** = +1 judicial to one non-officeholding ≥1-judicial pol per Pres-party faction, once/admin — *authoritative mechanic* for judicial-only pols (POST 26); sharpens #52/#66.

**High-signal note for the consolidator:** items in §A-E that "map to" an existing
#/DH row are almost all **2nd/3rd-source corroborations with the ORIGIN ruling** —
especially **#183** (endorsement-no-momentum, POST 228), **#142** (CPU SCOTUS ladder,
POST 247-250), **#129** (Kingmaker can't pass military, POST 90), **#31/DH-23** (region
cabinet, POST 230/90), **#80** (±3 party-pref cap, POST 407-408), **#130/#143/#153**
(command decay + doubled-gain toggle, POST 210-212), **DH-15** (small/large-state
multiplier, POST 83), and **#168/#123** (era-string standardization, POST 98). These
should be upgraded to "designer-authoritative origin" where currently marked ingested.
