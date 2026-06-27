# Digest — `ab93f871-ampu-to-do-list` ("AMPU To-Do List")

**What this thread is.** The designers' own **authoritative development backlog +
rules-finalization log** (NOT a playtest). 1023 posts / 14 chunks, **Dec 2021 → Jul
2022** — the pre-build / early-build window, *before* "Anthony" (the dev) had built
much of the engine. Authority **tier-1**: @vcczar (creator, runs the spreadsheets/
rules) + @MrPotatoTed (co-designer, writes rules in suggestion-mode for vcczar's
accept/deny). Community (Cal, ConservativeElector2, Arkansas Progressive, Rezi,
themiddlepolitical, OrangeP47, Vols21, ShortKing, Willthescout7, jvikings1, Patine)
contribute; **only vcczar/Ted decisions are canonical**. Two intertwined streams: (a)
vcczar's **era-content authoring marathon** (all ~1,700 scripted events + war chart +
treaties + legis-props + pres/gov actions + SC cases + 488 achievements, 1772→Era-of-
the-Future); (b) a **rules-doc 2.1→2.9 finalization pass** driven by the live 1960
playtest (the same boot later seen, far worse, in batch-27 `redbutton`).

**Load-bearing value:** this is the **single most direct roadmap input in the corpus** —
it is the literal "intended build list," and it is the **origin discussion** for a large
number of gaps now in the log (esp. the platform-overpower nerf #184/DH-72, the
landslide/era-bias problems #18/#83/DH-42, the cabinet-meter engine #179, the era-
boundary point-banking #68, the CPU-vacancy ladder #154/#70-#78). Most items here
**confirm/sharpen existing gaps**; a handful are **NEW**. Because it predates the build,
"In build today" below = the shipped engine per the current codebase/gap-log, not what
the thread author saw.

`GM⇒App` note: nearly every item is a designer specifying work that a human GM does by
hand (rolls, scoring, event adjudication) and that the app must own deterministically.
The single most-repeated `GM⇒App` ask in the whole thread is **"write up how each meter
works and exactly when to apply its effects"** (POSTs 7, 222, 308, 523) — i.e. the meter
engine spec, never finished here.

---

## Platform / elections (the densest, highest-signal cluster)

| Item | What the designers decided/intend | Status vs. build | Authority / posts | Gap map |
|---|---|---|---|---|
| **Platform is OVERPOWERED — nerf to party-preference** | Designers REACH CONSENSUS: stop platform from swinging per-state election rolls; instead "best-scoring platform (all 5 factions' cards) → **+1 party preference** (tie = 0); maybe +2 in early eras." Alt: planks give **+500/plank actually achieved** in office. | Platform engine **does not exist in code** (`grep platform\|plank src/` = ZERO). | vcczar+Ted+playtesters, POSTs **892(#3), 893, 913(#1), 914, 923** | **#184 / DH-72** — this is the ORIGIN of the nerf later force-corroborated in `redbutton` |
| **Landslides: D6 roll too coarse → switch to D3** | Every 1772 & 1960 election came out a near-landslide. Decision leans **D3** (not D100 — D100 makes traits/campaigning meaningless); "only in-play states get randomness." Most rules already moved D6→**D100 for %-checks**; the **election-win-per-state roll is the lingering D6**. | Shipped `calcStateVote` is its own thing; the documented swing-die fix is unimplemented design. | Ted/Cal/OrangeP47, POSTs **892(#2), 901-913, 920** | **#18, #83, DH-42** (election randomness/landslide model) |
| **Era state-bias blanket +2/+3** | Many electoral modifiers were added AFTER the per-era bias tables were set, so partisan lean is now swamped (1960 South went Red). Decision: **blanket-add ~+2/+3 to every era state-bias** to compensate. | — | vcczar+themiddlepolitical+Ted, POSTs **919, 920, 921, 922** | **DH-42** (meters swamp state lean) — direct origin |
| **Max-margin-per-state + PV caps** | New "Max Margin per state" table per era (e.g. AL Blue 20-65% / Red 35-80% / 3rd-party bands); winner's die-excess maps to a %-bracket, lightly randomized; **caps stop unrealistic PV totals** ("Reagan can win all states but not 90% popular vote"). Popular-vote % is derived from the +N die margin. | No popular-vote%/margin model in build (PV is raw). | vcczar+Cal, POSTs **211, 213, 216, 218, 365, 366-367, 374** | **NEW-adjacent** (sharpens #14/#18; the *margin→PV% display + per-state cap* is its own requirement) |
| **★ Traits matter in DOWN-BALLOT (Gov/Sen/Rep) elections** | Today (per design) only Celebrity/Military-Leader/Provincial/Controversial/Integrity affect non-pres races. Proposed full table: Likeable/Unlikable ±1, Charismatic/Uncharismatic ±1, Leadership +1, Orator/Debater 50%+1, Propagandist ±1, Puritan ideology-match ±1, Not-Obscure 50%+1, Lowbrow/Egghead, FL +1 / PL +3 in primaries. | Down-ballot election trait stack unbuilt. | Cal+Ted+vcczar, POSTs **977, 979, 982, 991** | **NEW** (#103 is presidential-only; this extends it to Gov/Sen/Rep) |
| **★ Expertise / faction-lobby matching state industry as election modifier (down-ballot)** | "Manchin problem": a candidate whose **expertise matches the state's #1 industry → +2** and **matching lobby card → +1**, applied to Gov/Sen/Rep (stronger than in pres races). Used in play but **not written into the rules**. | Industry leadership exists (#35) but no election-modifier link. | vcczar+Cal+Tyler, POSTs **977, 982, 991, 1004** | **NEW-adjacent** (sharpens #35/#103) |
| **★ Seat-level "deviant bias" for House districts** | A specific House seat can carry a **deviant party bias** that **overrides only the party component** of the state bias (ideology/religion biases still apply); models gerrymander/safe-seat. Each seat carries a vote weight; one seat could float within a range (vcczar: "Fuck no" to floating — keep static). | No per-seat bias / district model in build (#20/#21 are state-level). | vcczar ruling, POSTs **994-1003, 1008-1012** | **NEW** (district/seat-bias model; relates #20/#21/DH gerrymander) |
| **Contesting an election (pre-EC + tie)** | Result contestable only in a "tied" state that would have flipped the outcome; **multiple contests allowed**; **failed contest → −dom stab & −party pref**; rules for tied popular vote with no EC. | No contingent/contest path in build. | vcczar, POSTs **376, 409, 410** | **#62, #19, DH-6** |
| **Incumbent ±1 per crisis resolved/started** | General-election modifier: **+1 to incumbent per crisis that ENDED in his tenure** (unless also started then); **−1 per crisis that BEGAN** (unless ended). | Not modeled. | Ted, POST **959** | **#103, #88** (crisis-tied election modifier) |
| **VP-obscure "wildcard" chart + VP-nominee eligibility pool** | Picking an Obscure VP rolls a 1d6 trait/party-pref chart (Palin risk: +2 PP best … −2 PP + Controversial worst). Separately: VP nominees should be **federal-elected / statewide / General / cabinet / celebrity only** (debated; OrangeP47 argues keep it a soft modifier, not a hard gate). | No VP-impact/eligibility model. | Ted POST **913(#3)**; themiddlepolitical/OrangeP47 POSTs **867-882** | **#15, DH-26** |
| **Primary momentum: endorsement→momentum + transient carryover** | Two proposals: (1) a faction that declines to run a major candidate can **endorse → +1 (up to +3 if many endorse) momentum** to a same-ideology candidate in primary group 1; (2) **"Transient Momentum"** — half a group's momentum carries to the next group (+1→+0.5→+0.25…). Currently momentum is per-group only. | No primary-momentum model. | themiddlepolitical/Ark, POSTs **863-866, 880, 884-886** | **#183** — direct origin of the "endorsement has no momentum value" hole |
| **Major vs minor candidate rule placement + scope** | Auto-major = incumbent Pres / faction leaders / Celebrity-trait; vcczar declines to add ex-Pres/ex-VP/ex-noms (cites historical non-major precedents). Rule must be **moved to the top of the pres-election section** (recurring doc-clarity ask). | — | vcczar, POSTs **4(bullet), 118, 773, 774** | **#47, #104** |
| **Primary deactivation rule (incumbent)** | Once activated, state primaries persist **unless the incumbent runs for re-election**; incumbents usually cancel primaries (Bush '04 / Obama '12) — but via a **roll** (high chance), linked to **president-faction-vs-allied-faction enthusiasm**, so Reagan-v-Ford / TR-v-Taft challenges remain possible. | No primary-era state-opt-in model in build. | Ark/Will/Cal, POSTs **1019-1023** | **#63, #47** |
| **Faithless / contingent edge cases** | (rolled into the contest + tie-rules above) | — | — | **#19, #62, DH-13** |

---

## Legislative (committees, proposers, bills, lingering)

| Item | Decision/intent | Status | Authority / posts | Gap map |
|---|---|---|---|---|
| **★ ALL Reps & Senators on committees + new 12-proposer matrix** | Big rework: **every Rep/Sen is auto-assigned to a committee** (evenly distributed; one-click distribute + manual tweak). Since "on a committee" no longer gates proposing, a NEW proposer matrix: **12 Reps + 12 Sens**, base **30%** ±traits (Iron Fist +20, Leadership +10, Efficient +10; Pliable −10, Easily-Overwhelmed −10, Incompetent −20), rolled from level-5 legislators down; leaders/chairs excluded; fallback to highest officer. | Committee model exists (4 committees) but not this all-members + proposer-roll design. | Ted+vcczar, POSTs **9-10, 423, 471-478, 891** | **#8, #54, #74, #174** |
| **Committee-chair eligibility carve-out** | jvikings1: allow a higher-legislative pol w/ relevant expertise to chair **without prior committee service**; vcczar initially resists (no real-world example) but the all-members rework supersedes. | — | jvikings1/vcczar, POSTs **3, 5, 9** | **#8** |
| **Crisis-Manager + trifecta → double legis-props in a crisis committee** | A Pres with **Crisis Manager** trait controlling both chambers lets the relevant crisis committee make **double proposals** (models FDR/Lincoln legislative floods). | No crisis-bill / packaging engine in build. | vcczar, POST **812** | **#11, #42, #144** |
| **Pres signature placement & treaty routing** | Treaties pulled OUT of legis-props; **Senate has sole treaty power, Pres only negotiates**; treaties **auto-processed** on war win/loss (White-Peace treaty = Sec State proposes, Congress passes). | War/treaty engine unbuilt. | vcczar, POSTs **278, 279, 769-771, 824** | **#45, #139, DH-12** (white-peace) |
| **Law override / lingering-cancellation tagging** | Every law needs an explicit column for **what it replaces / which lingering effect it cancels** (e.g. "Naval Academy" cancels "No Naval Academy"; ambiguous ones like infrastructure flagged). Default-legislation must go to lingering or be deleted. Per-law **repealability**. | Bill-relationship graph / repealability flag unbuilt. | Ted+vcczar, POSTs **36, 347-348, 548, 631** | **#42, #175** |
| **Each policy gives a trade-off, not coin-flip** | Replace "20% +econ / 20% −econ" with cross-meter trade-offs ("20% +econ but 20% −revenue") so crisis-relief is legible. | Bill→meter tables unbuilt/illogical. | Ted+vcczar, POSTs **60, 62, 117** | **#12, DH-53** |
| **Tariff/income-tax: drastic-change penalty + integer rate** | Rate set by literal historical rate-bill (Smoot-Hawley etc.); a change **>10% → 75% chance −dom/−econ stab, then 75% −party pref**; ≤10% no penalty. After Reciprocal Tariff Act, tariff power moves to President (penalty then only on income-tax brackets). | Tariff-as-integer + drastic-change penalty unbuilt. | vcczar, POSTs **406-408** | **#147** |
| **Congressional-office scoring rebalance + reformist gating** | Whip→Speaker were all 50 pts (vs 1,000-5,000 for Pres) → CPU never builds them. New: **500 (top) → 50 (chair)**, **no points for committee membership**; creating Senate/House offices **gives reformists points but costs mods/cons/libs** (100-yr-late deterrent). | Office scoring/point system unbuilt as designed. | Ted+vcczar, POSTs **42, 377-388, 423, 386** | **#28, #66, #89** |
| **Down-ballot judge elections need rules** | Progressive-era amendment allows **electing federal judges / SCOTUS** → "we'll need rules for judge elections," unwritten. | Unbuilt. | Ted+vcczar, POSTs **183-186** | **#52, #66** |

---

## Executive / cabinet

| Item | Decision/intent | Status | Authority / posts | Gap map |
|---|---|---|---|---|
| **★ Cabinet = lobby/interest-appeasement minigame + meter rolls** | Confirmed design: each cabinet pick must **keep lobbies/interests happy or take an enthusiasm hit** while still finding competent people; **Key Advisor** is the prize seat (every lobby wants it). Per-officer **Admin→meter roll** odds table tuned (Admin5 = 75% +meter/0% −; Admin0 = 100% −; **Efficient moves meter by 2**); lobby-decrease chance dropped to 25%. | Cabinet-meter / lobby-appeasement engine unbuilt. | Ted+vcczar+Cal, POSTs **479-480, 494-502, 854-855** | **#31, #124, #179, DH-23** (this is the ORIGIN spec for #179) |
| **★ CPU vacancy-fill ladder (canonical)** | Ted's 6-step ladder, two flavors: **Military/Cabinet** (own-faction ≥3 → own-party ≥3 → anyone ≥3 → own-faction → own-party → anyone); **Senate/Rep/Gov** (own-faction ideology-match → own-faction → own-party ideology-match → own-party → anyone ideology-match → anyone) → else **randomly generate, give to lowest-scoring faction**. | Per the gap log, the canonical 4-step ladder; this is the fuller 6-step spec. | Ted, POSTs **30-31, 443, 495, 518, 990** | **#154, #70-#78** (origin) |
| **Cabinet eligibility / refusal / tiering** | Sec State won't accept a demotion; State > {Treasury/War/AG} > rest tiers (won't move down a tier, can move up/laterally); **Congressional leaders 50-75% decline sub-top cabinet posts** (Speaker shouldn't take UK Ambassadorship); cross-party cabinet only for same-ideology/moderate/can-switch/can-be-independent/integrity/holdover; **fired/forced-out secretaries can't be re-appointed**; Key Advisor & Postmaster must be Pres's party. | Cabinet eligibility/refusal rules unbuilt. | Ted, POSTs **494, 518, 787-794, 941-943** | **#25, #31, #32, #112** |
| **Cabinet members impacting more meters; Interior→planet** | Sec Interior → planet health (only idle seat); Senior General/Admiral impact mil-prep (so Admin matters); Postmaster → +party-pref/−honest (patronage; can't be Integrity; Controversial 10% boost). | Unbuilt. | Ted+vcczar, POSTs **526-529, 854** | **#31, #67** |
| **Cabinet turnover** | Incumbent cabinet 10% retire/term unless they have Command (future ambition). | Unbuilt. | Ted, POST **894** | **#37, #130** |
| **★ Top-military post (Senior Gen / CoS / CJCS) requires ≥1 Admin** | 1960 players crushed mil-prep by appointing a 0-Admin CJCS. Rule: top general/admiral needs **Military exp + Military-Leader + ≥1 Mil + ≥1 Admin** (relax to mil-only if nobody qualifies); office evolves Senior-General → Chief of Staff → CJCS; non-promotion → 25% a general resigns. | Mil-leadership appointment tier unbuilt. | Ted+vcczar, POSTs **1002, 1005-1010** | **#49, DH-23** |
| **Exec implementation → +command for rollers** | Successful implementation: Pres + involved cabinet each roll **+1 Command (5%/10%/15% easy/mod/hard)**; **Efficient cabinet members who auto-handle it DON'T get the roll** (deliberate downside of Efficient). | Implementation-roll / command-from-action unbuilt. | Ted, POSTs **957, 958** | **#22, #143, DH-10** |

---

## Governors / states / statehood

| Item | Decision/intent | Status | Authority / posts | Gap map |
|---|---|---|---|---|
| **★ Statehood/Territory-bill penalty rules (anti-blocking)** | Killing a Territory bill → officers −100 pts each + **permanent −1 elections in that region**; Statehood bill → −2 region + Pres-veto −250 + −2 party pref + **state bias shifts +1 toward opponent on eventual admission**; penalty in committee too; **CPU supports statehood 100% (no card harm) / 75% (card harm)**. Later capped to **~20-yr / era+1** so 2020s GOP isn't punished for 1800s Whigs. | No statehood-bill politics in build. | vcczar+Cal+Ted, POSTs **448-450, 460-461, 468-470, 485-489** | **#43, #21** |
| **Adding states → econ-stab up / dom-stab down** | New states should generally **+econ stab** (with a **−dom-stab** risk) rather than only the slavery-crisis dom-stab hit that chills expansion. | Statehood meter effects unbuilt. | Ted+vcczar, POSTs **43-44, 385, 487-489** | **#43** |
| **Gov actions library expansion** | Many gov actions added/confirmed: call for federal legislation; force tribal assimilation; rigorously enforce Fugitive Slave Act; tough-on-crime; strictly enforce anti-discrimination; create political machine; Maine/Nebraska EV-split & California/Wyoming apportionment plans (made hard to do). **Gov success → +1 Command, 50% lose-obscure.** | Gov-actions library unbuilt. | vcczar, POSTs **152, 414-415, 706-710, 792** | **#20, #34, #44** |
| **Industry-driven population → EV/Rep recalibration** | Industries move a state's population → modify EVs/Reps; redefine Big/Medium/Small state thresholds; land-grant laws → chance of +1 EV at next census. Reapportionment cap legis (435). | Census/apportionment/industry-pop unbuilt. | vcczar+Ark, POSTs **135, 233, 411-413, 933-934, 396** | **#34, #35, DH-16, DH-49** |
| **Lost-territory pols** | When the US loses a state (e.g. Mexico retakes SW), its pols **move to an alternate state, or stay with US only if `Nationalist` trait** (then can't hold state-residence offices). | Auto-carpetbagger/relocation exists but stale. | vcczar, POSTs **321-324** | **#38, #55** |
| **Slavery = default-flag per state** | States enter **default slave / default free**; events (Kansas, AZ/NM/CA) can flip; no free/slave player choice (21st-c.-mindset players would never make a Solid-Slave-South). | Slavery flag dormant. | vcczar, POSTs **39-41, 675-678** | **#21, #93, #94** |

---

## Foreign relations / war

| Item | Decision/intent | Status | Authority / posts | Gap map |
|---|---|---|---|---|
| **★ Generic→named wars; treaty types; battle engine** | Replace generic wars with **named, event-linked wars** (~175 total) sharing a generic algorithm; meters-only wars stay generic. **5 treaty types** (win-on-field / sue-from-victory / sue-from-defeat / lose-on-field / **Special Treaty** = land-grab, one attempt, difficult). Multi-phase wars (invasion→occupation→counterterror quagmires). Naval battles required before a non-bordering invasion. **50% chance each battle that another battle fires that phase.** Per-battle General/Admiral outcome tables (skill/trait/death rolls, faction ±100/±500). **White-peace = Moderate Implementation (Pres+SecState+SecWar).** | War engine unbuilt. | vcczar+Ted, POSTs **24, 211, 277-279, 887, 824, 939** | **#45, #56, #106, DH-12, #152** (origin of war-resolution + white-peace specs) |
| **Generic Invasion-of-US wars (vulnerability)** | New wars fire when **relations low + mil-prep low** (we're weak + have enemies) → can end the game (US becomes colony/protectorate). | No vulnerability-war engine. | vcczar, POSTs **24, 97, 99, 175, 244, 299-300** | **#45, #88, #98, #188** |
| **Diplomacy: ambassador/minister, fluid embassy names** | Embassies use era-correct names via events (GB→UK, Russia/USSR, Prussia→Germany→W.Ger→Germany; minister→ambassador upgrade 1893); **no ambassador to hostile nations**; ambassador success-odds match cabinet. | Diplomacy subsystem unbuilt. | vcczar+Ted, POSTs **543-545, 862, 896** | **#107, #26, #162** |
| **Extend-credit balance flag (foreshadow)** | (later DH-4) trade-balance bonuses; here the intent is "make the relations meters matter." | — | vcczar, POST **245** | **DH-4** |

---

## Era content (events, amendments, achievements, lifecycle)

| Item | Decision/intent | Status | Authority / posts | Gap map |
|---|---|---|---|---|
| **Scripted-event spine 1772→Era-of-Future fully authored** | vcczar polishes all ~1,700 events with: trigger %s standardized (most **10%→5%**, stricter ones 20/25/50%, 10% if within 10 yrs of era date); **events that END lingering events** (variable-length French Rev, McCarthyism, Cold War — player can't time them); nothing 100%-guaranteed; in-bracket history notes; office-specific point/+command effects; era-of-future heavy on sci-fi (robots/AI/aliens/world-gov), to be balanced with culture/social. | Era-event spine is built per-scenario but thin vs. this 1772→2100 corpus. | vcczar, POSTs **1, 4, 9, 65-320, 103, 159, 242** | **#86, #87, #109, #113, DH-30, DH-50** |
| **Meter-driven game-overs are CHANCE, not automatic** | CANONICAL: "**meters won't end the game — they let a game-ending scripted EVENT fire**." Many enumerated end-conditions (nuclear war Russian-roulette; non-nuclear global-Communist-takeover; colony/protectorate; Balkanization variants — Northern Confederacy/CSA/Western-America/Indian-Sovereignty; UN World Government ~2090; alien war; SpaceBotUSA). Option to **restart at previous half-term** on loss; toggle to disable game-over (meters stop just above the floor). | End-condition model = premise-only in build. | vcczar, POSTs **175, 244, 263, 299-302, 327, 361** | **#88, #98, #188, #106** |
| **Era-keyed activation of meters / lobbies / interests** | Some meters (Planet Health, Quality of Life) & cards (Civil Rights, Reformists, Big Pharma/Tech) shouldn't be live early → **activated by scripted events / era**; all auto-on by Era of Neocons as a safety; settings can force all on from start. Card-count economy rescales per era. | Era-gated card/meter activation unbuilt. | vcczar+Ted, POSTs **55, 503-507, 815-817, 835** | **#5, #6, #50, #2** |
| **Era-end points reset + bank-credit (origin of #68)** | Long debate → decision: **points reset at end of each era**, winner of an era **banks a % / set number**; per-era point pools so totals don't explode; era-end **faction-swap** allowed for humans. | Era-boundary boot/banking unbuilt. | vcczar+Ted+Will, POSTs **378-383, 389-390, 444, 835** | **#68, #102, #2** |
| **Constitutional planks → standalone amendments + late-add Bill of Rights** | Const-Convention planks can also be proposed as **standalone amendments**; a Bill-of-Rights amendment that's left out can be added later individually (not "ignored forever"); life-term Pres/Senator amendments; **federal-judge-election amendment**. | Amendment lifecycle dormant. | vcczar+Ted+jvikings1, POSTs **96-100, 184-186, 362-363, 399** | **#39, #119, #100, #64** |
| **488 Achievements + "most influential" + monuments** | Authored 488 historical achievements ("First President," "New Deal President"…); end-game **"most influential politician"** influence-point tally (flavor, no gameplay effect); **monument/legacy legis-props** rename DC buildings, set "iconic politician." | Achievement / legacy system unbuilt. | vcczar, POSTs **138, 419-420, 433-434, 633, 645** | **#180** (legacy/monument trait) |
| **"What-if" politicians enter/exit via events** | Toggleable what-ifs (JFK Jr, Karl Marx 1844-WI, Jimmy Hoffa, Lafayette stay/leave, Napoleon rescue) appear via events; off-by-default ones can switch on (Napoleon from St-Helena). | Dormant. | vcczar, POSTs **4, 100, 606-607, 648, 834** | **#46, #109** |

---

## Leadership pipeline (command, career tracks, faction/party leaders)

| Item | Decision/intent | Status | Authority / posts | Gap map |
|---|---|---|---|---|
| **★ Command-acquisition rework (emergent-President narrative)** | Big design thrust: tighten where **Command** comes from so Presidents have a story. Career track: **no command < 20 yrs** except 1%@12 / 5%@16 / 10%@20; Faction-Leader = the fast track (**25% +Command/cycle**, 75% lose-obscure, 20% +Legis/Gov/Admin) but burns out; **Party-Leader = auto Leadership + 25% Celebrity on re-election**; **Gov/Sen successful-meter-action → +command** (Gov 20-25%, Sen 25%, Rep 10%); **remove** random command from committee phase. | Command/leadership-gain model unbuilt (corroborated later as #143/#153). | Ted+vcczar, POSTs **161-163, 425, 453, 472, 781-784, 792-793, 856, 893** | **#143, #153, #29, #30** (origin) |
| **★ Career-track rebalance + 50%-chance entry** | All 7 tracks re-tiered (4/8/12/16/20-yr payouts, mostly +ability + traits at small %s); Military/Judicial/Gov/Legis/Admin **drop the "must have 1 X" prereq** but **non-qualifying entrants succeed only 50%** (CPU only risks it with no other option); each track gives a **random interest at 20 yrs** (ideology-appropriate) — the ONLY way to gain interests. Backroom = Kingmaker ladder (+ Master-Kingmaker, protégé buffs). | Career-track payout/bootstrap unbuilt (DH-25 open 3 yrs later). | Ted+vcczar, POSTs **179-182, 453, 662-700, 817, 836** | **#163, DH-25** |
| **★ Acquiring INTERESTS (long-open recurring item)** | Repeated 3× that interests (Civil Rights, Expansionist, Theocrat…) are **born-only, no acquisition path** — inconsistent w/ the rest of the game. RESOLVED here: **+1 random ideology-appropriate interest at 20-yr career mark** (+ some events). | Interest-acquisition unbuilt. | Ted+vcczar+OrangeP47, POSTs **58-61, 672, 817, 775** | **NEW** (no current gap row names interest-acquisition specifically) |
| **Leadership eligibility TIERING (no "anybody" fallback)** | Speaker/Maj-Leader etc.: if nobody meets 5-Legis+chair+Leadership, **relax to 4, then 3+no-chair, then anyone** (was a cliff to "anyone"); Whips count as prior leadership; **Iron-Fist can jump the queue** (LBJ/Henry Clay); 50/50 House→Senate, 25/75 Senate→House moves; mid-phase majority flip → immediate re-election of leaders + re-balance committees. | Leadership pipeline unbuilt as designed. | Ted+Cal, POSTs **423, 795-799, 824, 944** | **#28, #29, #77, #135** |
| **Faction-leader trait gain incl. NEGATIVES** | Becoming FL now also risks the **opposite** of good traits (even Easily-Overwhelmed) as the pol gets exposure; FL needs Leadership prereq (relaxed if none). | Unbuilt. | vcczar+Ted, POSTs **781-782, 840** | **#29, #141** |
| **Retirement-roll TIMING + "just-won-election" guard** | Defeated-incumbent retirement roll fires **immediately on loss of office** (not 2 yrs later in a batch phase) — OR a guard that **anyone who just won/holds an office can't retirement-roll**; vcczar chose the guard. **Ex-President never retires**; Hale halves death; Frail rolled first. | Retirement/death model unbuilt as designed. | Ted+vcczar, POSTs **537, 856-859, 893, 130** | **#37, #85, #130, #105** |
| **Speaker risk/reward + anti-loophole** | Speakership 40% retirement-on-loss is too risky vs. its weak in-game power (it's "an extra committee chair") → players dodge it by appointing the Speaker elsewhere; **2nd/3rd Speaker in a term shouldn't get the +500/traits**; debate to **block Speaker→lesser-job milking** OR buff what the Speaker does (controls committees/agenda). | Unbuilt. | playtesters+Ted, POSTs **946-975, 951, 956** | **#28** |
| **Dynasty / lineage system (NEW, limited)** | Dynasties matter: next-gen auto-loses-obscure if elder reaches Presidency; **if dynasty parent dies before offspring's historical birth, the offspring (and their line) are never born**; ahistorical-dynasty creation REJECTED by vcczar except possibly **generated pols in Era-of-Future**. | No dynasty/lineage model in build. | Ted+vcczar, POSTs **800-808, 824** | **NEW** (generational lineage system) |

---

## CPU / AI

| Item | Decision/intent | Authority / posts | Gap map |
|---|---|---|---|
| **CPU master decision rule "3.0.30"** | Ted writes "How the CPU makes decisions" (events, which bills/packages/amendments to support) + "How CPU fills a vacancy" (the ladder above) + swing-vote rules + sudden-vacancy fill. | Ted, POSTs **516, 518, 990** | **#70-#78** (origin of the CPU suite) |
| **CPU draft rules** | 50/25% off-ideology → **100% if none available**; 9th/10th place → **100% first-round pick (any ideology)** + worst-2 factions give their #1 pick **+1 ability of choice**; party-flip-eligible draftable by either party; Military-Leader random-assignable only if ≥1 Mil; CPU prefers real-state pols; CPU draws outside its 3 ideologies only if none available / catch-up / a +25-PV outlier. | Ted+vcczar, POSTs **662, 775, 584** | **#4, #69, #136, #137, #138, #146** |
| **CPU political trading / reciprocity (wishlisted, NOT built)** | Repeatedly raised: CPU should do **vote-trading / favor-exchange** ("back my Pres run, I'll back your Whip + a SCOTUS seat"); broken-promise → big point loss + party-wide relation hit. vcczar/Ted "like the concept, **haven't codified anything**." | themiddlepolitical/Ted, POSTs **34-35, 376, 809-810** | **DH-20** (origin of the no-reciprocity architectural gap) + **DH-37** (player-pol trading) |
| **CPU career-track 50% only as last resort; never leave a slot empty** | CPU takes the 50% off-track coin-flip only if no other option; CPU never declines to fill a track. | Ted+vcczar, POSTs **838-839** | **#70-#78, #163** |
| **CPU appoint/replace flow** | The 7-step "own-faction-ideology-match → … → generate-and-give-to-lowest-faction" flow (POST 990) is the canonical CPU appointment logic. | Ted, POST **990** | **#70, #154** |

---

## Data-model / dormant

| Item | Decision/intent | Authority / posts | Gap map |
|---|---|---|---|
| **★ Skill scale stays 0-5 (1-10 DEFERRED to "AMPU 2.0")** | Community pushed hard for **0-10** skills (more variety, modding); discord poll 16-4 for it. DECISION (vcczar+Ted): **keep 0-5** — not auto-convertible (would require re-tuning every %-step, every prereq, all failed/what-if candidates); 5s are already rare; "**put it on the table for AMPU 2**." | vcczar+Ted, POSTs **721-755** | **NEW** (pins the data-model decision behind CLAUDE.md's 0-5) |
| **Unique IDs for every event/legis/action; structured %-columns** | vcczar will give **every event/legis-prop a unique ID** (e.g. `E378`) and split combined effect-cells ("Rel-Fr+ / Rel-Fr−") into **one column per meter w/ its own %** — explicitly **to speed the dev's conversion**. | vcczar, POSTs **28-29, 657** | **DH-48** (structured `evDelta` field) |
| **Retire has-been pols at later start dates** | Historical retirement dates added so late starts don't resurrect every ex-Governor (the "2000 game: every race is incumbent-vs-3-ex-governors" immersion-break). | vcczar, POSTs **638-640** | **#86, #164, #173** |
| **Scenario START-STATE: election-first vs president-in-place** | Unsettled debate for the 1960 boot: Ted wants **start in Elections phase** (clean what-if jumping point); vcczar/Cal/Anthony settle on **start with the incumbent already in office** (the start-date sheet is built for the 1958-winners-in-place / JFK-in-office cycle, and election-first would need every incumbent randomized). Temp pre-draft ideology + 2 bordering cards for the inaugural draft (no personality yet). | vcczar/Ted/Cal, POSTs **570-588, 888-890, 584** | **#86, #115, #164, #186, #173** (this is the ORIGIN of the boot-model debate that `redbutton` later shows fails) |
| **Doubling pol values discussion** | (see scale row) | — | — |

---

## UI / presentation

| Item | Decision/intent | Authority / posts | Gap map |
|---|---|---|---|
| **★ Wiki-like in-game history archive + per-politician history tab** | Strongly & repeatedly requested (cited as the KEY to text-sim replayability, à la FootballGM): a deep archive of **all past/current pols, election results+maps, administrations, SCOTUS votes, bill-passage records, wars, events**, with **per-decade/era top-10 rankings** (overall + by office) and a **history tab on each politician card** (election results, votes). | themiddlepolitical/others, POSTs **70-72, 103, 705, 720** | **NEW** (archive/records UI; no current gap row) |
| **End-of-era summary screen** | Points scored, election charts, top-N lists at each era/decade boundary. | POSTs **70-72** | **NEW-adjacent** (#68 boundary, but the *summary UI* is new) |
| **Phase-specific & era-evolving background art** | Per-phase imagery (White House for exec, Capitol for legislative, tank for military) that **changes by era** (Const-Convention → modern); the busy DC-map KS background disliked. | Ted/Patine, POSTs **14-15** | **NEW** (presentation) |
| **Self-evident action/bill titles + tutorial/tooltips** | Titles legible without descriptions (optional history blurbs); **tutorial / pop-up tips** to navigate screens (Ted to help). | vcczar, POSTs **4, 126, 174, 376** | **DH-69** (onboarding) |
| **Political graveyard page** | A page listing all dead/departed pols + their accomplishments. | ConservativeElector2, POST **811** | **NEW-adjacent** (part of the archive ask) |
| **Game-over presentation** | Story-text + game-over screen (not just a flag); optional restart-at-previous-half-term. | vcczar/themiddlepolitical, POSTs **301-304, 327** | **#88, #188** |

---

## Open questions for the human

- **Currency of these decisions.** This thread is **2021-2022 pre-build**. Many "decisions"
  here (platform-as-party-pref, D6→D3, era-bias +2/+3, all-members-committees) were made by
  the designers but it is **unverified whether the shipped engine implemented them** — and
  later batches (esp. `redbutton`, batch 27) show platform-overpower & boot-failure
  *recurring*, implying they were **not** carried into the build. The consolidation agent
  should treat these as **design-of-record that the build still owes**, and reconcile each
  against shipped reality before promoting to the roadmap.
- **D6 vs D3 vs D100 for the state-win roll** is left at "leaning D3" — no final canonical
  pick. The election scorer (when built) must pick one; this is the same swing-die owned by
  #184/QW-cluster.
- **Down-ballot trait/expertise election effects** (Gov/Sen/Rep) and **seat-level deviant
  bias** are clearly intended but only ever "in play, not in the rules" — confirm whether a
  gap row should own them distinctly from the presidential modifier stack (#103).
- **Dynasty/lineage** and **0-5-vs-0-10** are explicit designer rulings that don't map cleanly
  to any existing gap row; flag for new rows or a data-model note.

---

## Candidate gaps for consolidation (NEW — not clearly in the current gap log)

1. **Down-ballot election trait stack** — Gov/Sen/Rep elections must apply Likeable/Charismatic/
   Leadership/Orator/Debater/Propagandist/Puritan/Not-Obscure/Lowbrow-Egghead + FL+1/PL+3, not just
   the 5 traits today (#103 is presidential-only). *(POSTs 977, 979, 982, 991)*
2. **Expertise/lobby-matches-state-industry as a down-ballot election modifier** (+2 expertise /
   +1 lobby) — the "Manchin survives partisan lean" rule; used in play, never coded. *(977, 982, 991)*
3. **Seat-level "deviant bias" model for House districts** — per-seat party bias overriding only the
   party component of state bias (gerrymander/safe-seat); seat vote-weights. *(994-1003)*
4. **Per-state max-margin table + popular-vote-% derivation from the die margin + PV caps** — the
   anti-landslide / realistic-margin display layer distinct from the swing-die. *(211-218, 365-367, 374)*
5. **Interest-acquisition path** — interests are born-only today; designer fix = +1 ideology-appropriate
   interest at the 20-yr career mark (+ events). No gap row names this. *(58-61, 672, 817)*
6. **Dynasty / lineage system** — generational pols, offspring auto-lose-obscure on an elder's
   Presidency, lineage extinguished if the parent dies before the heir's birth; Era-of-Future-only
   ahistorical dynasties. *(800-808, 824)*
7. **Skill scale is canonically 0-5; 0-10 deferred to "AMPU 2.0"** — pins CLAUDE.md's 0-5 as a
   deliberate, non-trivial-to-change decision, not an oversight. *(721-755)*
8. **Wiki-like in-game records archive + per-politician history tab + end-of-era summary screen +
   political-graveyard page** — repeatedly named the key to text-sim replayability; a presentation/
   data-surfacing requirement with no current gap row. *(70-72, 705, 720, 811)*
9. **Phase-specific, era-evolving background art** — per-phase imagery that changes by era. *(14-15)*
10. **Primary "transient momentum"** (half-momentum carries between primary groups) as a concrete
    mechanic alongside the #183 endorsement-momentum fix. *(864-866, 884)*
11. **Incumbent-primary-deactivation as an enthusiasm-gated roll** (not absolute) so contested
    incumbent primaries (Reagan-v-Ford) remain possible. *(1019-1023)* — sharpens #63.
12. **Top-military-post ≥1-Admin requirement** (Senior Gen/CoS/CJCS) — sharpens #49 with a concrete
    eligibility rule the 1960 boot proved necessary. *(1002, 1005-1010)*
