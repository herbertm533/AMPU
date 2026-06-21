# Drums of War — All-CPU Playtest of the Civil War (FINAL DIGEST)

**Thread:** *"Drums of War: An All-CPU Playtest of the Civil War"*
**Slug:** `e1776bbd-drums-of-war-an-allcpu-playtest-of-the-civil-war`
**Posts:** 7540 / 117 chunks (consolidated via 12 partials → 3 section-digests).
**Years:** **1841 → mid-1924** (Harrison/Tyler era opener through mid-68th Congress).
**Eras touched:** Nationalism (Antebellum) → Civil War → Reconstruction → Gilded → Progressivism / WWI / 1920s.
**Game master:** `Ich_bin_Tyler` → handover to `matthewyoung123` mid-arc (Tyler also human-played Pop Sov / Copperhead Dems starting POST 191).
**Designer (live rulings in-thread):** `vcczar`; rule patches also applied by `MrPotatoTed` and `Arkansas Progressive` (the latter authored the Lingering script).
**Mode:** **All-CPU** — humans roll dice, break stalemates, and patch rules; the playtest's UNIQUE VALUE is **CPU heuristics, thresholds, tie-breaks, formulas, and design-holes**. Title is a misnomer: the Civil War is one ~20-year arc inside a 1841→1924 run.
**End-state:** Mid-1924, mid-68th Congress, Pres William Randolph Hearst (cascaded into office via Estella → Pershing scandal chain). **NO 1924 election outcome** — live game stoppage.
**Prior digests:** `gilded` / `fed` / `1772s` / `modern` / `hd`. This is the 5th thread.

> **Why this digest is mostly a "CPU AI" doc.** Earlier multiplayer threads showed the *rules*; an all-CPU run shows the *agent*. Section 1 below consolidates every CPU heuristic the thread surfaced — these directly resolve much of game-context **DH-8** (CPU AI under-spec), and 9 net-new CPU-AI gap rows have been added to game-context. Sections 2–4 cover the Civil-War / Reconstruction engine confirmations, era content, and a compact open-questions list. Citations are `===== POST n =====` markers and the section-digests (`§A` / `§B` / `§C`).

---

## 1. CPU AI behaviors — master section

Organized by SYSTEM. Where a rule was independently observed in earlier threads, it is marked **(corroborated)**; where this is the first explicit forum statement it is marked **(new)**.

### 1.1 Candidate selection (open seats, primaries, conventions)

- **The 75/25 rule (the single most important CPU-selection statement in the run).** POST 143 (Tyler, authoritative): for **major** candidates, CPU runs **party leader 75%** vs **25% random** Gov/Sen/VP/Former VP/Former Pres with **≥1 Command**; fallback is any random candidate with ≥1 Command. Minor candidates: CPU **always runs one** (random ≥1 Command). Tyler explicitly asks whether the rule should also apply to **faction-leader picks** — **OPEN.** (§A.1.1)
- **No primary against an incumbent** unless the faction's ideology-enthusiasm is "extremely unhappy" (POST 1777). Auto-major-candidate triggers: incumbent / faction leader / pol with `Celebrity` (POST 2210). (§A.1.1)
- **Open-seat selection** is a 2-step: (1) state's **preferred-ideology** filter, (2) random from matches with **Kingmaker-faction members** getting a primary bonus that usually beats un-bonused stars (POST 1777, 1784 — "3rd-best Red politician in the game" Lincoln sat unused for cycles). (§A.1.1)
- **Convention "Stifle Competition"** by a frontrunner rolls ≤~90 floor (POSTS 1841, 2244). A faction's enthusiasm must clear a floor for it to even produce a minor candidate (each non-incumbent rolls vs ~85). (§A.1.1)

### 1.2 VP selection — NO retention logic (designer-acknowledged bug)

- POST 167 (Tyler, authoritative bug): *"the CPU picked from the faction with the lowest points that had a candidate not from the President's region. So it was basically random. Was thinking maybe have a chance to keep a VP but make that more likely to happen in the Nuclear Era and onward."* **The CPU has no VP-retention logic.** (§A.1.2)
- **VP Assessment 8-element rubric (deterministic)** — published verbatim 4× (POSTS 5159, 5556, 5983, 6380, 7275; earlier echoes 788, 1183, 1530, 2572, 2904, 3318, 4109, 4435): each +1 → VP from another faction; ticket has Mod/Cons/Lib; ticket age spread ≥20 yrs; one ≥50; one <60; exactly one independent / out of office; big-state+small-state; different regions; **Obscure roll** d6 (5-6 lose Obscure / 3-4 keep + add trait). Higher-scoring ticket = **Party Pref +1** + dominant-ideology +1. (§B "VP Assessment", §C.1.3)
- **Career-track gate:** a VP can be **taken off career-track for *appointment*** but **NOT for *election*** (vcczar, POSTS 2227-2234 — Hancock rejected as VP because Backroom Track). (§A.1.2)
- **2-ideology gap rule between Pres/VP — UNDOCUMENTED.** Tyler (POST 3797): *"I'm not finding it anywhere"*; Breckinridge (Trad) + Weaver (LW Pop) allowed at a 4-step gap. (§B "VP selection")
- **Open Q:** "drop VP with no penalty" (Polk dumped Seymour, POST 1176) — should it cost something?

### 1.3 Leadership / Speaker / PPT — IRV-style bloc voting (confirmed stable across 4+ maps)

The CPU's **bloc-vote IRV tie-break ladder** is the most-corroborated CPU heuristic in the thread (§A.1.4 + §B "Leadership/Speaker IRV" + §C.1.1; POSTS 604, 679-680, 847-851, 1010, 1158, 2657, 2992-2994, 3170-3173, 3419-3422, 3596-3597, 3885, 3980, 4175-4177, 4322-4326, 4513, 4667-4671, 4872-4877, 5014, 5272, 5841, 6099, 6448, 6623, 6747, 6828, 7349, 7500):

1. **Ballot 1:** each faction casts as a **UNIT** for its own/closest candidate.
2. **Closest ideology** to the surviving candidate (random among ties).
3. **Highest PV** (1st tiebreak).
4. **Highest Legislative skill** (2nd tiebreak — Senate races esp.).
5. **Random same-party** (last resort).

Two live patches in-thread:
- **Original CPU collapsed at ballot 3 with random pick** (anti-climactic). Designer patch (POST 3419): **continuous IRV-style elimination** — no collapse.
- Tyler refines: *"randomize only on FIRST elimination instead of each CPU each round bc that's just too chaotic"* (POST 3419) → first-round-only random scramble; subsequent eliminations deterministic.

**3-inconclusive-ballot collective endorsement (confirmed in 3 places):** POSTs 5272, 5841, 6099 — *"After the third ballot, the CPUs all vote randomly for a candidate."* (POST 5841: "After 3 ballots no one is the winner so the CPUs all select Furnifold Simmons.") **Human factions do NOT auto-collapse** — they must manually endorse. (§C.1.1)

**No reciprocity / vote-trading** (POST 4875, designer comment): *"Sadly for @matthewyoung123 the CPUs don't understand reciprocity."* No side-deals, no quid-pro-quo logic exists — confirmation/leadership votes swing 76-24 → 91-9 by faction discipline alone. (§B "Leadership/Speaker IRV", §C.1.12) **Architectural gap.**

**Closest-ideology can flip leadership to the *minority* party** (POST 3419: Magoffin/Cons-Dem won PPT 1880 when Tariff Whigs jumped to him after Sidney Clarke was eliminated).

**On-win effects (asymmetric):** Speaker on win loses Obscure, gains Leadership + Legis+1 + Kingmaker (POST 3597). Speaker re-elect: Legis+1 + Magician (POST 3427). **PPT: nothing** (POST 3430). (§B)

**Party-leader internal vote heuristics** (POSTs 86, 234, 338): each pol rolls **1d12 + skill**; runoffs with endorsements. Lowest-score faction endorses lowest-score remaining candidate; mid-tier factions endorse highest-PV; adjacent-ideology factions back closest ideology; **Harmonious+Integrity** candidate auto-gets Kingmaker-faction backing (POST 1019). Defeated-candidate endorse = closest ideology, then by score-tied lowest; endorsee gains extra d6. (§A.1.4)

### 1.4 Convention CPU — per-ballot momentum + interballot menu + compromise picker

The thread's richest decoded subsystem. The mechanics are stable across many cycles (§A.1.3 + §B "Convention CPU" + §C.1.8; POSTS 426, 429-431, 769-786, 1152-1168, 1841, 2216, 2552-2566, 3294-3318, 3688-3713, 3719, 3737-3766, 4063-4117, 4419-4441, 4779-4822, 5116-5118, 7229-7244):

- **Per-ballot momentum.** Ballot-1 frontrunner who fails to win: **-1 Mo**; 2nd-place +1; largest delegate gainer on later ballots +1 Mo. Frontrunner who *never* wins → **permanent -1 in future primaries** (POST 4820 — Weaver).
- **Nominator speech roll:** 1d6 — 1 = -1 Mo, 2-4 = 0, 5-6 = +1 Mo. **Orator** upgrades start at 4 instead of 5.
- **Per-ballot inter-ballot menu** (each candidate picks ONE per ballot; 1d6 success roll allocates):

| Action | Trigger / gate | Notes |
|---|---|---|
| No action | default | major factions w/ name recognition |
| Stifle Competition | frontrunner | rolls ≤~90 floor |
| Appeal to Credibility / Integrity / Charisma | matching trait + meter-in-crisis (Credibility variant) | 1d6 ≥5 = +1 Mo |
| Whip Party Into Compliance | Party Leader (needs Leadership; 4-6 with Leadership trait) | +1 per Pliable faction leader (Iron Fist multiplies) |
| Presidential Promise | offer cabinet/SC/VP/plank | target rolls vs 50 (25 for VP, 50 cabinet); Puritan auto-declines |
| Kingmaker Interference | external kingmaker | 1d6 ≥5 = -1 Mo to target |
| Drop out + endorse | always available | auto +1 Mo to endorsee |
| Influence Smoke-Filled Rooms | **Kingmaker-gated** | |
| Rouse Convention with Lies and Propaganda | Manipulative trait | |
| Request Ballot Shift | any | re-roll delegate alignment |
| Call Rules Change | ≥ ballot 5 | passes by **weighted-kingmaker vote** (POST 3719) |

- **Rules-change votes use weighted-kingmaker vote** (POST 3719) — Whigs' weight by faction (Tariff 4, FT 15, Business 13, Stalwart 16, Silver 13); Dems' weight (Trad 13, Cons 11, Cons Dem 13, Imp 9, Lib Rep 10). Needs majority of weighted kingmaker votes.
- **Compromise candidate at ballot 10** (POST 3719, **invented in-thread**): each calling faction picks ONE eligible compromise candidate from **another faction in their ideology cluster** (Mod picks from Cons/Mod/Lib). Random within faction. **Lowest-score faction picks first, locks their pick** — **rigid highest→lowest faction-points picker order** (confirmed POSTS 7229-7244: "Radical Whigs will pick your faction only if you select from the Wall Street Whigs, otherwise they will choose between them"). **No cross-faction coordination.** Compromise candidates absorb delegates of originals; originals drop out after one ballot.
- **Dark horse at ballot 25** (POST 3719): Party Leader picks an eligible candidate from the LOWEST-scoring faction; auto-nominated.
- **Stuck-convention pathology:** **Whig 1852 went 11 ballots → Broom is compromise → loses to Polk**. **Whig 1856 went 11 ballots → Anthony Ellmaker Roberts of PA**. Players proposed CPU should auto-drop-out after **2-3 ballots of 0 Momentum** (POST 1162). **NOT implemented** — current behavior produces 10-13 ballot deadlocks. **OPEN.**
- **Kingmaker delegate-math undecided** (POST 1949): GM toggles between "d6" and "d6 + kingmakers" for endorsement bonus "to counterbalance someone running the table with kingmakers."
- **Pineapple Primary** (POSTs 2562, 2888, 3690, 5515-5520): random pres candidate shot at convention. **Lethality d100 ≤50 = killed** (Grant 1872, Tweed 1876 33/50, Cornelius Bliss 1884, Yates 1900). VP succeeds — Holcomb (3rd-party Labor Dem) becomes **first 3rd-party-elected President** via this path.
- **Kingmakers refuse to endorse** politicians with `Lowbrow` / `Easily Overwhelmed` / `Unlikable` — corroborated across multiple cycles. (§B, §C.1.2)
- **Unanimous shortcut:** if only 2 candidates and one offers VP to the other & it's accepted **before voting**, ballot 1 is unanimous (POST 4420 Cumback/Fenton).
- **CPU running-mate logic does NOT penalize ticket experience holes** (POST 7249): CPU-Taft picked CPU-Hughes (both Justices, no prior electoral run); Tyler flagged as "weird strategy."
- **Anti-frontrunner "lowest score" preference in PL endorsements** (POSTs 5642, 6119, 6247): defeated CPU faction leaders endorse via {closest ideology → highest PV → **lowest score** as underdog/anti-frontrunner check}. Late-round consolidation deliberately biases the underdog. (§C.1.2)

### 1.5 Cabinet confirmation — DESIGNER-CONFIRMED BUG (36% of 88 nominees passed)

This is the #1 designer-acknowledged broken system in the run.

**Tyler's audit (POSTS 4702-4708):**
> *"Of the 88 nominees that needed confirmation, the CPUs voted down 40 (45%) in committee. Of the 48 that went to full Senate vote, 32 (67%) passed. Overall only 36% of nominees that needed confirmation got confirmed."*

**vcczar response (POSTS 4703, 4707):**
> *"The chance of CPU voting against a cabinet nominee is supposed to be really low. I added that rule to avoid this... I don't know what happened to those rules. I'll fix them when Anthony needs them if someone marks it on the rules for me."*

→ **The "low chance to reject" rule was lost from the rules doc.** Engine-side fix required: default-AYE baseline with low-% reject from opposition, modified by trait.

**Specific failure modes:**

- **50/50 Admin-1 "inexperience reject" trap** (POSTS 867-876, 2494, 2663, 2792, 3023): Admin-1 nominees roll 50/50 in committee. Whig minority auto-NAY + 50/50 Dem NAY = guaranteed fail. Polk's Postmaster/Interior cascaded 4 times (Whiteaker, Wells, Bigler, Douglas, Davis, Scott, Tilden). **Only Integrity clears** (Douglas auto-confirmed); switching to a 2-Admin (Payne) breaks the cascade.
- **Lobby-maximizing selection rule picks Admin-nobodies** (POSTS 1607-1608, 1614-1626; designer-adjacent): CPU cabinet-pick rule = "most appeased lobbies, nets out already-satisfied lobbies." There is a **fixed priority order** for which cabinet seats fill first; later picks subtract already-appeased lobbies. **Result:** Granger's cabinet AI ignored all his high-Admin people and picked **1-2 Admin nobodies** who held the right cards — Whig-controlled Senate refused to confirm **6 of ~11**. **The two bugs reinforce each other.**
- **Own-party Senators vote down own president's nominees** (POST 4702: Pendleton's St Martin 9-14, Caine 9-14, Altgeld 11-13, Robeson 9-14).
- **Pliable trait suspected root cause** (POST 3205, NOT yet implemented): *"Maybe it becomes a chance that they vote how their leader in that chamber votes instead of their faction."*
- **11-11 ties = "not approved"** (no VP tiebreak in playtest rules) — disputed POSTS 2795-2800; IRL VP DOES tiebreak. Left unresolved.

**Iron-Fist Maj Leader + Pliable Pres feedback loop (POSTS 4896-4900):**
> Pres Gary is Pliable → 50% chance every nominee is picked by Sen Maj Leader **Orth (Iron Fist)**. Orth then **forces confirmation votes** on his own picks. ebrk85: "Please tell me these aren't the same pols Orth hand-picked himself" — Tyler: "Based on the rules as written, yes." Designer ruling (POST 4900): *"Then we change it! Should be no different than how a President's faction votes on its own appointees (AYE to all)."* **Engine TODO: when same actor selects AND triggers vote, auto-AYE that bloc.**

**Cabinet enthusiasm-via-lobbies overwhelms presidential signal** (POSTS 877, 880): Matt appointed 3 Moderates and Mod enthusiasm moved **+3 the OTHER direction** because cards trump individual ideology. *"Has there ever been a cabinet that didn't throw more meters to the other party than to their own?"* Designer wants ±3 to ±5 cap; **partially patched POST 4574** — Tyler's ±3 cap on per-phase ideology swings ("Since ideologies can swing wildly here with the cards, I'll put a cap of a swing of three like the cabinet"). Mods swung +7 raw → capped at +3.

**Other cabinet-CPU constraints recovered:**

- **Cabinet refusal rolls:** Senators in leadership posts roll to refuse lateral move (threshold ≤75, POST 235 — Calhoun 92/75 → accepts). State/Treasury/War/AG former-secretaries auto-decline Ambassadorial (POST 885). Bancroft 7/25 accepts Russia (POST 707, partial-accept exists).
- **Replacement appointees do NOT gain skills/traits** on appointment (POST 421, 1960-playtest loophole).
- **Cabinet retention cap = 5** retained (cabinet + cabinet-level + ambassador), POST 1436.
- **PM Gen requires Kingmaker + same party as Pres** (POST 3037).
- **Key Advisor requires Admin 3+** (POST 2807). **Master Kingmaker forced to Key Advisor regardless of Admin** — Matt: *"What if the Master Kingmaker has a 0 or 1 Admin? He still gets Key Advisor?"* (POSTs 5658-5660). Flagged.
- **Sec of State pinnacle rule** (POST 4779): Anyone who has served SecState refuses any other appointment except SecState again.
- **Region-coverage penalty:** any of 5/8 regions absent from cabinet → -1 in next presidential election in that region (POSTS 2498, 2668, 3050, 3903, 4006, 4368, 5290).
- **Egghead suggestions = TIEBREAKER ONLY** when cabinet split (POSTS 3906, 4016, 4242, 4377-4380, 4569, 5066): Pres usually goes with cabinet majority; Pres **overrides** on personal ideology (Pendleton overrode 3-Aye-1-Nay on Iceland/Alaska; chose B on FL flood despite 4-1 Aye). For **Uncharismatic** Pres: shown but ignored. For **Pliable** Pres: cabinet majority decides.
- **Recommendation-rejection blowback:** Disharmonious members 25% resign in protest if Pres ignores them (POSTS 297, 409, 414 — Calhoun resigns over spoils). Puritan/Disharmonious 50% resign-on-override (POSTS 904, 1053 — Slidell 10/50).
- **Failed-nominee penalty (designer-flagged too harsh):** -1..-3 Party Pref + Controversial (POSTS 1655-1661); humans could **tank confirmations to game Party Pref**. **Proposed fix:** only apply to 5-Admin / certain-trait nominees. (§A.1.5)
- **Confirmation failure blame:** 25% Maj Leader, 75% Speaker (or 25% Pres) (POSTS 6262, 6311). 50% blame distribution applied; if so equally split Pres vs Senate (POST 4541).
- **NAY-voter Controversial gain:** 20% chance to gain Controversial unless already Integrity/Controversial (POSTs 4541, 4552, 5049, 5063) — applies to *all* NAY voters. matthewyoung123 objected this hits opposition senators too; Tyler defended POST 5063 as "popular backlash."
- **Lifetime cabinet ban + permanent -1 election malus** on failed-Controversial nominees (POSTS 2497, 2794 — Delano, Cole; 2106 Blaine; 2271 Sanford Church >60% EC loss).
- **Cabinet construction caps:** max 3 cross-party (POST 6475); outgoing cabinet cannot move laterally (POST 6267); mandatory retirement at 75 (military officers, POST 6469).
- **Harmonious Maj Leader skips hearings** for non-top-4 cabinet (POST 7377). Top-4 (AG/State/Treasury/War) still get committee + floor.
- **Replacement chain after failure** (POSTS 2497, 2664, 2794, 3022-3040, 4206-4216, 4385-4387): committee-stage fail = no blame phase (POST 4709). Full-chamber fail = Pres + PPT (or Sen Maj Leader) jointly pick. PPT presents 5 alternatives → replacements **auto-confirmed** (no 2nd vote). Compromise nominees need **3+ Admin** and "not Controversial" (implicit CPU autoconfirm heuristic).

### 1.6 Legislation voting heuristic (canonical CPU rule)

Matt's clearest articulation (POST 2161; also POSTS 2524-2537, 2710, 2832-2879, 3122-3132, 3508-3527, 3924-3940, 4267-4280, 4396-4416):

1. Bill helps **opposition Pres's** meters/election? → **NAY**
2. Gives points to **my ideology/lobbies**? → **AYE**
3. Otherwise → **NAY by default**

- Proposer = each faction's **highest-Legis** pol; **Efficient** +1 proposal; Legis 5 + Efficient = extras (POSTS 2524, 2842, 3625, 3924).
- **Free Executive proposals:** SecTreas & SecWar each get 1 free bill that any congressional proposer can pick up as a free extra (POSTS 2523, 3086).
- **Crisis bills:** when a meter is in crisis, proposals tagged "(crisis bill)" — CPU prioritizes; **failed crisis bill still carries penalty** (POSTS 2525, 3122, 3129).
- **Disallowed proposals:** a faction CANNOT propose a bill that COSTS points to one of its own cards (POSTS 2530-2531, 2851 — mid-stream GM rule).
- **Repeat-proposal rule informal** — can't re-propose a bill passed within recent cycles (POST 2842 — flagged by Tyler).
- **Bills must be checked against proposer's own cards** (POST 933) — currently slips through. **Proposal-validity checker must look at active amendments** (POST 2006: "Apply Existing Civil Rights to Former Slaves" auto-proposed after 14A made it invalid).
- **CPU optimizes meter math not theme** (POST 1683): with Dom Stab as only crisis, CPU proposed *"Grant States Power to Secede"* because it had a 25% Dom-Stability boost — comedic but reveals the engine.
- **Veto override = 2/3 in BOTH chambers, NOT 60%** (POSTS 2180-2187, designer ruling; 60% was a bug, reverted).
- **Amendments can't be packaged with bills** (POST 1835).
- **Amendment ratification math:** **majority** in Congress (game default) vs 2/3 (IRL); **3/4 of state Governors → later 2/3** (POST 1827, 1829, 2400 — legislation changes constitution mid-game).
- **Vetoing a statehood bill:** -250 pts, -2 Party Pref, state's bias shifts +1 toward opponent when admitted (POST 1350).

**Filibuster as deterministic per-Senator** (§B "Filibuster"; POSTs 48, 140, 2716, 2871, 3115, 3273, 4610, 4751, 5103-5105):

- Specific named pols filibuster deterministically: Yulee, Morgan, Dorr (Reconstruction); Cockrell, Simmons, Sweet (Gilded, Puritan-driven).
- **Puritan senators auto-filibuster 1 bill/session** — **no roll**, deterministic given trait.
- Filibustered bill returns next session.
- **Cloture needs 67%** (POSTS 5105, 5496, 5921); Wartime Income Tax fails 52-48; Children's Bureau succeeds 77-23.
- **Iron-Fist CPU Maj Leader auto-cloture** for majority-supported items (POST 5920).
- CPUs filibuster crisis legis they ideologically oppose **to extend the crisis to election day** (POST 7081).
- Open: can a package be re-filibustered? Tyler (POST 3275): *"The rules actually don't say tbh."*

### 1.7 Scripted A/B/C event cabinet voting

Cabinet members vote A/B/C on scripted dilemmas; counts map **explicitly** to ideology + lobby cards (POSTS 6501, 6503, 6504, 7406, 7524):

- **Globalists / Mods → intervene (A)**
- **Isolationists / Cons → block (B)**
- Specific examples: Mexican Revolution split by Mod/Lib vs Cons/Mod; Zimmermann Telegram 3-2 by Globalist/Mod vs Isolationist/Cons; Fascist Movement: Page+Hoover (A), Baker+Pleasant (B), Stimson+Mellon (C).
- **President's ideology can FORCE a pick** (POSTS 6663, 6720): Pres Pattison *must* select rejectionist option on Coxey's Army; Nationalist trait made Stimson Doctrine "no go."
- **Cabinet recommendations are scored**; Pres picks the option that scores best against cabinet (POST 7406, 7524).
- **Event-resolver mapping is undocumented** (POST 3642): *"Unclear who the cabinet member is so I'm going to pick Sec of Interior"* — scripted-event→cabinet-role mapping unspecified; GM defaults to reasonable choice.

### 1.8 Conversion AI — deterministic %-rolls with Pliable + adjacency gating

Two-layer model corroborated across the entire arc (§A.1.6 + §B "Conversion AI" + §C.1.4; POSTS 79, 213, 215, 1254, 1419, 1923, 1925, 2459, 2487, 2633, 2974, 3162, 3406-3410, 4498-4499, 4641-4642, 4859, 5002, 5004, 5079, 5251, 5400, 5843, 6429, 6610-6614, 7330, 7472):

**Layer 1 — Disgruntled auto-flip** (no roll, deterministic): pols whose ideology is **maxed +3 for the opposite party** flip at half-term to **the receiving party's faction that holds the matching ideology card** (POST 1419 — GM ruled "most aligns" = active cards, not raw label). Free for receiving faction. Whig LW Pop/Prog/Trad/RW Pop can flip to Dems; Mod/Cons Dems can flip to Whigs. "If no eligible pols, nothing."

**Layer 2 — Active poach (rolls + gates):**

| Actor | Base rate | With adjacency / bonuses |
|---|---|---|
| Party Leader (cross-party) | 10% (Pliable) +5% (same-ideology) → ~15% | Pres+Manipulative observed 43% |
| Mod PL | 5% base | cross-party penalty |
| LW Pop PL (Weaver) | 15% | **25% if target is LW Pop** |
| Faction Leader (inter-party) | 10% base | 20% if target Moderate; up to 48% with kingmaker buffs |
| Master-Kingmaker tier | 43% | — |
| Roosevelt as Lib Whig PL | 48% | **58% if target Lib** |
| Pattison as Mod FL | 10% (×2) | **20% if target Mod** |
| Elihu Root TW leader | 33% (×2) | — |
| **Iron Fist** | gets **3 attempts** | (Sam Houston, POST 1763) |

**Restrictions / immunities:**

- **Harmonious / Passive / Predictable** faction leaders **cannot convert at all**.
- **Manipulative** blocks a faction leader from converting (POST 1923). **Manipulative cannot TARGET Manipulative** (POSTs 2459, 2633, 2974).
- Cannot target own party; cannot target Abolitionist/Radical (1254); cannot target Pres/VP/Cabinet/Speaker/Leader/Whip/FactionLeader/President.
- Cannot target **Harmonious** (POST 2633), **Trad Dems** (era-specific), **Pliable own-party**, factions at **+3 enthusiasm in either color** (POST 4580: *"His faction is immune to conversions due to high enthusiasm"*).
- **Targeting restrictions rotate by era**: 1880 Whigs cannot target Silver Whigs; Dems can only target Mod Dems + Lib Repubs.
- **Targets must be Pliable AND same-or-adjacent ideology** (POSTs 4310, 4313-4315 — player-disliked new rule).
- **Failure side-effects:** target **loses Pliable** (POST 3162, Fessenden); can flip the *roller's* Pliable → Integrity (POST 3873 Curtis vs Hamlin); survivor often gains Integrity (POST 5002 Edwin Dun).

**Collision bug** (§A.1.6, POSTS 79, 215): OrangeP47's complaint — *"The 'target highest scoring faction pliable logic' is really causing issues with factions picking the same people so I'm just chaining it."* **Multiple CPU factions all greedily target the same opponent.** Needs better tie-break.

**Kingmaker conversion cascade**: protégés follow their kingmaker unless Puritan; **faction-leader protégés do NOT convert** (POST 5619). **Kingmaker-flip grabs the protégé(s) — "insanely OP"** (already DH-5; reconfirmed).

### 1.9 Iron Fist — overloaded trait (designer-flagged to split)

Iron Fist is the single largest CPU lever in the thread, doing ≥6 distinct things by office (§A + §B "Iron Fist" + §C.1.6; POSTS 2511, 2784, 3241, 3660, 4896-4900, 5353, 6293, 6471, 6568, 6703, 6852, 6881, 6907, 6912, 6922, 7012, 7224, 7364):

| Office holding Iron Fist | Effect |
|---|---|
| **Party Leader + Honest-Gov-maxed** | Controls **ALL** gubernatorial actions for all same-party govs across factions (Granger+Estabrook simultaneously; Speed/Whigs 1878+) |
| **Sen Maj Leader** | Forces committee votes + forces confirmation votes on his own picks (POST 4896 Orth); **Iron-Fist Maj-Leader auto-cloture** for majority items (POST 5920); forces chamber to vote how he votes in committee; **requires confirmation votes on EVERY nominee** outside own faction or retentions (POST 6471). Pres Harmonious does NOT trump this (DH "We need a new rule then. Lol." POST 7012). |
| **President** | Stifles challengers (~90%); 90% fires officers (20% MilPrep -1 risk per fire); compels SCOTUS justices' votes (POST 3660 — Cobb compels all Dem justices to Nay on Strauder v West Virginia, flips 7-2 Aye → 4-5 Nay); shares cards with allied factions (except Puritan leaders). Pres IF with Kingmaker can also block challenges except from lowest-enthusiasm factions. |
| **Loans-from-Wealthy policy + IF PL** | Temporarily controls all of his party's governors (POST 2433) |
| **Convention PL** | Can unilaterally set ballot threshold rules at convention WITHOUT faction vote (POST 7224 La Follette 2/3 backfired) |
| **Military leaders** | Iron Fist required to replace military leaders mid-war (POST 5353) |
| **Trinity-leader (Pres + PL both IF + both have cards)** | PL "shares one of his cards with his party other than Puritan leaders" (POST 2784) |
| **Iron Fist Pres + Iron Fist Sen Maj Leader** | Pres IF doesn't override Sen Maj Leader IF on confirmations — *"We need a new rule then. Lol."* (POST 7012) |

**Designer-flagged**: Iron Fist is doing TOO much; **should split into distinct traits** (POST 3241 implied; reconfirmed §B, §C.1.6).

### 1.10 Faction-leader replacement — 4-condition removal

(§B "Faction-leader replacement", §C.1.15; POSTS 226-227, 337, 354, 519, 2481, 2622, 2786, 2483-2484, 2653, 5033, 6836-6845)

Must boot leader (probabilistic):

| Condition | Removal % |
|---|---|
| **Lost last presidential election** | 25% |
| **Lacks Charisma** (and rival has it) | 25% |
| **Uncharismatic / Lackey / Easily-Overwhelmed** | 50% |
| **Incompetent** | 100% |
| **Disharmonious / Incoherent** | Triggers consideration too (POSTS 2622, 2786) |
| **Obscure** (when valid non-Obscure alts exist) | per §A.1.16 |

**Hard gates (cannot replace if):**

- Replacement must hold interest/lobby card matching faction's cards (POST 2483-2484: Pierce Dems wanted Tilden — no Expansionist/Media match → forced keep).
- Career-track members cannot be selected (POST 2653 "first choice on career track so skipped").
- Speakers cannot be protégés (POST 2766).

**Stagnation bug** (POST 5033, designer-acknowledged): *"Right now they kinda pick someone and hold onto them even if better options come up."* No mid-term swap when better candidate appears.

**Negative-trait cascade bug** (POSTS 3610-3617): 1882 Dem cycle gave all 5 leaders NEGATIVE traits (Leslie→Predictable, Cobb→Easily Overwhelmed, Cockrell→Incoherent, Parker→nothing, Davis→Incoherent). Matt: *"I hate your dice man."* **No positive-trait floor.**

**Faction-leaders who secede must be replaced** (POST 1649): Pop Sov Dems → **Copperhead Democrats**; Conscience Whigs → **Abolitionists** (POST 856).

### 1.11 Faction-rename rule — Whig auto-rename to "Conservative Party" (deterministic)

(§C.1.9; POST 7406)

**Triggers ALL of:**
1. **No Republican Party exists**
2. **Red Party leader has the Protectionist lobby card**
3. **Blue Party has won 3 presidential elections in a row**

All true after Pershing 1920 + cascading scandals → *"The Conservative Party is formed."* New faction names auto-generated by appending "Conservatives" (Conservative Conservatives, Moderate Conservatives, Wall Street Conservatives, Liberal Conservatives, Progressive Conservatives). GM admits these are *"kinda stupid/silly"* (POST 7407) — **lazy default, needs configurable name pool.**

Other rename triggers logged (§B "Faction-rename rule"; §C.1.15): leader gained Easily Overwhelmed → rebrand (POST 5844 Wall Street → Justice Whigs); leader of wrong ideology → rebrand (POST 5846 Trad Dems → Bourbon Dems); identity loss → rebrand (POST 6110 Justice Dems → Dewey Dems). Antebellum: Wall Street Whigs → Clay Whigs → Dixon Whigs → Clay Whigs (POSTS 87, 226, 337); Agrarians → Populist Dems-RW (POST 233).

### 1.12 Kingmaker / endorsement preference rules

- **Kingmakers refuse to endorse** politicians with `Lowbrow` / `Easily-Overwhelmed` / `Unlikable` (corroborated multiple times; §A.1.3, §B, §C.1.2).
- **Anti-frontrunner "lowest score" preference in PL endorsements** (POSTS 5642, 6119, 6247): {closest ideology → highest PV → **lowest score** underdog}. Late-round consolidation biases the underdog.
- **Kingmaker delegate math** (POST 1949): GM toggles between "d6" and "d6 + kingmakers" for endorsement bonus. **Formula undecided.**
- **Age 35 required** for kingmaker role (POST 80, 514, 1002) — **routinely violated**.

### 1.13 Long-term Justice ideology drift (NEW mechanic surfaced)

**First disclosed in §C.1.10, POST 7533:** every **10 years** on the Court:

- **25% shift toward middle**
- **10% shift left**
- **5% shift right**
- **Puritan trait blocks all shifts**

Justice Hughes had already flipped factions twice on the Court (POSTS 6815, 6977) before this rule was stated.

Other SCOTUS heuristics (§A.1.13):
- **"Votes Ideology" default; "Votes Cards" if case touches Justice's faction's lobby cards** (overrides).
- **Sway:** Debate / Manipulative attempts; **Integrity / Passive abstain** from being swayed.
- **Compelled Justice retirement** (POST 1142): Manipulative Pres can compel **1 justice** of either party to retire on d6 5-6 (~33%).
- **2 cases / half-term**; CJ can delay a case.
- **5-5 tie → lower court ruling stands** (Dred Scott 4-4 POST 726; randomized if not given).
- **Disputed electors** (POST 462): SCOTUS rules; Integrity NOT consulted.

### 1.14 CPU primary AI under-tuned (designer's own admission)

§C.1.7, POST 7135 (Tyler explicit): *"I have tweaked how the CPU selects these actions to make them smarter… right now you can curb stomp the CPU bc it is simple and not always optimal when there is a clear answer."*

**Fixed action template** per candidate per state group (Speech + Campaign focus + Attack rival + sometimes Embrace local issue + sometimes Presidential promise). Each rolls 1d6 + trait gates (POSTS 7135, 7154, 7173, 7184, 7195, 7207):

- **Campaign focus:** Charisma/Likable on 4-6 → +1 state; Celebrity+6 → +2.
- **Speech:** Orator +1; Orator+6 → +2.
- **Attack rival:** Orator (state) / Debater (group) → -1/-2; **roll of 1 backfires** (-1 to self).
- **Embrace local issue:** 25%/50% vs state's preference profile.
- **Scandal rolls** 1d6 before each group; Controversial = 2nd roll; **Integrity skips**; Teflon halves; Propagandist can avoid (POSTS 5129, 5174, 5514, 5523).

**CPU attack target = highest-PV rival of opposite faction regardless of context** — no underdog logic (Estella attacks Pershing repeatedly when Pershing is the runaway frontrunner).

**Pre-primary "Frontrunner" rule** (POSTS 5126, 7169): Out-of-power party → **Party Leader is frontrunner**; in-power party → faction running a major with the highest points. Frontrunner determined by **Party Leader's faction** — can hurt CPU when the PL's pol is weak.

**Presidential-promise acceptance** (POSTS 7173, 7184): target only accepts withdraw-for-cabinet bribe **if they hold less than half the delegate target needed to win**. Hard rule. Acceptance rolls separately on ~0–100% scale modified by faction relationships (e.g. 63/50, 67/50).

**Broke roll** after debates/scandal (1d6, 5-6 → drop out; POSTS 5132, 5523); withdrawing candidate's endorsement = +1 Mo to target.

**Primary state grouping** (POSTS 5708-5732): Groups 1-3 cap at 3 primaries each — **implementation undocumented**; forum invented "pre-5 all in Group 1, then round-robin into 4-5 once 1-3 fill."

**Era trigger inconsistency** (POSTS 6754, 6755, 7163, 7165): McGovern-Fraser legislation requires 15 states to have primaries first; **Women's Suffrage 1920 triggers all states to have primaries** — flagged.

### 1.15 Critical missing CPU logic (architectural gaps)

§C.1.11-1.14 (and corroborations across the arc):

- **No reciprocity / vote-trading** (POST 4875). CPUs are pure faction-discipline. Confirmation/leadership votes swing 76-24 → 91-9 with zero side-deals.
- **No meter-guarding logic on scripted-event options** (§C.1.11, POST 6280): under Roosevelt, both Quality of Life and Economic Stability crashed to crisis simultaneously. *"Internationalist + Pro-Federal-Government + Advocate New Freedoms triple-stack"* tanked all meters with no AI penalty.
- **No cascading-event smoothing** (§C.1.14, POST 7389): Estella scandal → VP forced to resign → Pershing replaces with Hearst as VP → Pershing scandal one event later → Pershing resigns → **Hearst becomes President within days** of becoming VP. Tyler: *"A lot of events and unfortunate rolls."* Cabinet replacement chain resolves 3 deep in one event.
- **Governor menu static / no industry-stack awareness** (§C.1.13, POSTS 5894, 6159, 6289, 6519, 6671, 6888, 7062, 7424, 7532): fixed menu lookup mapped to faction identity (Theocrat-aligned → Prohibition / Abortion / Ban Teaching Evolution; Mining-state → Improve Mining; Liberal/Prog → Strengthen Labor Unions; Whig-Cons → Weaken Labor Unions; Reformist → Allow State Primaries; Transportation experience → Build Railroad; Big-Ag state → Major Irrigation). **No awareness of state's existing industry stacks** — Improve Industry in a state already at 10/10 fails silently.
- **CPU running-mate logic doesn't penalize ticket experience holes** (POST 7249).
- **CPU diplomacy = pure Sec-of-State driven with Pres rubber-stamping**; no adversarial logic for negative-relations countries.
- **CPU keeps proposing weak bills at 10-10 / 11-9 ties**; no coalition-counting.
- **3-of-6 action-phase rolls do nothing** — election action design weak.

---

## 2. Civil War & Reconstruction engine (the era-unique content)

The thread provides the deepest forum-confirmed spec for the multi-theater Civil War system + Reconstruction subsystem.

### 2.1 Battle %-formula (CONFIRMED across maps 5/8/10/11 + §B + §C)

(POSTS 123, 1725, 1728, 1731, 2199, 2539, 2728, 2881-2882, 3278, 3540, 5111-5114, 5353-5357, 6181, 6317, 6571-6572, 6705-6708, 6924):

```
Win% = Difficulty + Planning(SecMil+CoS) + Officer×10 + MilPrep + Benchmarks
roll d100, ≤ Win% = victory
```

Components:
- **Difficulty:** Easy 0 / Moderate -10 / Difficult -25
- **Planning:** Sec of War/Navy skill + CoS/CNO skill (sum)
- **Officer:** officer's Mil skill × 10 (L4=+40, L5=+50)
- **Mil Prep meter:** level × 5 + 5 per ally (high=+15, mid=+10, low=+5; Very Prepared + 1 ally = +15)
- **Benchmarks:** +5 each (3 = +15; 4 = +20)

**Outcomes:**
- **Victory:** +1-3 War Score (Easy +1, Mod +2, Hard +3); officer gains Military Leader if missing; +1 Mil
- **Defeat:** -2 War Score, officer -1 Mil, **next general -1 Mil lingering**
- **Officer KIA on natural 1** on the success roll (POST 3278: Custer at Little Bighorn 29-to-win, then 1 → killed); **POST 6181**: Eberle "killed in action (rolled 1/100)" — auto-nomination + unanimous confirmation of replacement.
- **Catastrophic 100/100:** -3 War Score, general loses 1 Mil + Leadership + Military Leader (POST 2728 Battle of Fort Fizzle, Williams).

### 2.2 War-end formula + multi-theater + multi-phase

(§B "Civil-War battle formula", §C.3.3; POSTS 2539, 2728, 2881-2882, 3278, 5111, 6708):

- **Naval / Ground phases separate.** **Need N naval wins** before ground campaign begins: Mexico=3, WWI=2 (POST 6571, 6572).
- **Phase continuation roll** ~50% between battles.
- **War-end check:** `WarScore × 2 = % chance war ends this phase`. (3 instances corroborate: Sioux, Spanish, post-CW.)
- **Auto-win threshold: War Score ≥ +11** (POSTS 5111, 6708).
- **Post-war defeat chance:** `|WarScore| × 2 × 10 = % defeat` (POST 5111: -2 × 2 × 10 = 40%, rolled 72, war continues).
- **Minor wars use ×2 end-multiplier** (Utah 4×2=80%, POST 1731). Sioux War POST 3278: "3 × 2 = 6, 60%."
- **Momentum bonus:** +1 War Score if higher than prior turn; -2 if lower (POST 6706).

### 2.3 War + officer cascades

- **Sr Gen / Chief Adm with ability 4+ and Efficient picks per battle**; send highest-ability not killed/disgraced.
- **Difficult-battle loss: no penalty** (POSTS 126, 1378).
- **Lose moderate-battle: gain Incompetent → immediately fired** (POSTS 131, 388, 1372).
- **Sr Gen promotion rule** (POST 1379): if top Gen NOT promoted from incumbents, each incumbent has **25% to resign in protest** (0% Harmonious, 100% Disharmonious).
- **Post-war "lag battle"** (POST 386): one extra ground battle rolls even after victory.
- **Failure-cascade burnout** (POST 388): Cass→Lee→Twiggs+Worth all gain Incompetent → fired in one phase. CPU war losses burn the bench.
- **Treaty implementation:** Pres + 2 cabinet roll; **Efficient cannot fail the blunder** (POSTS 1729, 1732). 3-roll chain (Pres / Sec State / Amb) → 100pt awards (Pres + lobbies + leading-Agri state Gov/Sens) + Party Pref +1.
- **Defeat penalty:** Party Pref -3, general -1 permanently, Pres -1 in elections permanently.

### 2.4 Treaty A-D tiered outcomes (§C.3.4-3.5)

- **Basic vs Special routing** based on Admin levels: "Pattison has 1 Admin so we use the basic version" (POST 6928).
- **Special D not implemented → Treaty A instead** (POST 6317).
- **Treaty of Versailles** (POSTS 6710-6712): 250pts to Pres/Sec State/Sec War/Globalists/Manufacturing-leader; MacArthur + others gain Celebrity; **Pres gains permanent +1 in future elections**; Manufacturing +1 nationally; Mods +1 Blue.
- **Treaty of Dallas** (Mexico, basic, POST 6928): same pattern but 250pts route to Nationalists/Agriculture (basic implementation routes to different lobbies).

### 2.5 Secession trigger + Southern-Unionist gating

- **Secession-as-event chain triggered by a bungled presidential decision** (§A.2.3, POST 1640, 1450): **John Brown's Uprising option B** (state militias, no standing army) chosen by Matt deliberately to enable Civil War. Result: 11 named slave-state Govs +100; ~45,000 dead; Upper+Deep South -1 EV each 10 yrs.
- Granger (free-state-favoring Pres) wins → CSA forms: **FL/AL/GA/MS/LA/TX/SC/NC/TN/AR/VA** (11 states). Effects: -250 Pres/Civil Rights/LW Activists/Nationalists; +250 RW Activists/Trads/RW Pop; rolls vs Mil Prep / Econ Stab / Party Pref / foreign relations. **Andrew Johnson = CSA Pres; Stonewall Jackson = CSA Sr Gen.**
- **Per-state loyalty roll**: ~3 Govs / 2 Sens / 3 Reps stay loyal per seceded state (POST 1640).
- **Loyalists from seceded states lose elected office** (POST 1648, designer ruling): unemployed/stateless → may hold appointed only (cabinet, ambassador, military); **CANNOT run for Pres/VP/Sen/House/Gov unless they relocate** (Lee stayed loyal, lost VA govship).

### 2.6 The war itself

- **TWO simultaneous wars: Eastern Theatre + Western Theatre (both Major) + Utah War (Minor)** (POST 1645). Resolved in ~2 in-game years; Eastern 30%, Western 80%, Utah 80% (×2 multiplier).
- **Appomattox treaty** (POST 1729): +250 Pres/State/War + many lobbies; seceded states → Reconstruction; Dom Stab +1, Econ Stab +1 (Economic Boom); guerilla-warfare roll 76/25 → none.

### 2.7 Sectional-balance imbalance penalty

(POSTS 1362, 1511, §A.2.1; corroborates game-context #59):
- **Speaker & PPT -250 pts + -1 reelection**
- **Mod factions -250**
- **Dom Stab -2**
- **Party Pref -2 toward majority**
- **RW Activist +250 / Civil Rights -250**
- **Structural pressure cooker toward secession.**

### 2.8 Reconstruction subsystem

§A.2.6 + §B "Reconstruction" + §C; POSTS 1703-1746, 1833, 2027-2047, 2188, 2269, 2472, 2524-2535, 2578, 2698, 2716, 2812, 4569, 4571, 4718:

- **No default penalty for returning Confederates** (POSTS 1742, 1746): result — very next election the South elected Confederates wholesale (8 ex-CSA Govs incl. CSA Pres Johnson re-elected Gov of TN; 19 ex-CSA Reps; Senate only 42/32 Whig).
- **Floated fixes** (POSTS 1745-1752): immediate voting restriction / +9 bonus to victors / delay returning states one half-phase / auto-vote on "Articles of Reconstruction." **OPEN.**
- **Lenient 10% Loyalty Reconstruction Plan**: judicial bill allowing CSA states to rejoin with 10% loyalty oath. Passed Congress; Granger vetoed; override failed. Filibustered by Thomas Dorr.
- **14th/15th Amendments by simple majority** in this game (vs 2/3 IRL).
- **Reconstruction flag** triggers Union Loyalist +1 election bonus to Southern unionists (POST 2578).
- **Persistent +2 Red election bias in Reconstructed Southern states** dominates 1864/1868 (POST 2269) — confirms game-context #57.
- **14th Amendment effect** (POST 1833): "State bias in all Deep South states shift 1 toward incumbent party (Whigs)."

**Reconstruction END as exec action** (POST 2812, NEW — refines #57):

- *"Voters Tire of Costs of Reconstruction"* event. Pres can end via executive action: **AG Admin roll vs threshold** (Taylor rolled 67/100 = success).
- **+100pts to RW Activists / Trads / RW Pop / Cons**
- **-100pts Civil Rights**
- **Triggers White League / Red Shirts paramilitary event next**: Pres choice A (send fed forces) vs B (let states sort). Lee chose A; rolled 59/60.
- **Reconstruction Riots event if continued.**

**Mass Trials of Confederate Leaders** (POSTS 2027-2047): strip non-Nationalist secessionists from office → cascade replacements (Govs, Sens by class, Reps by district); **spawn generated politicians** where no eligible candidate ("John Smith (really)" for NC; "Samuel Murdock, our first black elected official"). Confirms game-context #43.

**Jim Crow event sequence** (POSTS 4569, 4571, 4718): "FL, TN, MS, AR enact Jim Crow Laws" turns ON Jim Crow state-modifier; State bias +2 Blue Party. 100pts RW Activists/Trads/RW Pop; -100 Civil Rights; Honest Gov -1. **3x point multiplier for 30 years.** **BUG** (POST 4729): scripted events don't check active SCOTUS rulings — Munn v Illinois → Cruikshank cycle previously deactivated poll taxes (POST 2698).

### 2.9 Reconstruction-end vote / Granger vetoes

Granger vetoes reconstruction-end bills twice to keep it active (POST 2188).

---

## 3. Eras touched — content corroborations

### 3.1 1841 opener (Antebellum / Harrison-Tyler)

- Era starts with Harrison/Tyler administration; CPU runs all-original Antebellum factions (Whigs, Pop Sov Dems, Trad Dems, Wall Street Whigs, Conscience Whigs, Pop Dems).
- **Antebellum scripted events** (§A.2.1):
  - **Bleeding Kansas A/B/C** (POST 256, 1057 retconned): 3-option (Avoid / Topeka / Lecompton); first instance retroactively voided.
  - **Compromise of 1850** (POST 712, 743-747): **doubles slavery-legis points** next term; Speaker + Sen Maj Leader/PPT get +1000 pts if balance maintained; Dom Stab resets neutral; all other legislation inactive. Pres picking "Endorse Compromise" makes legis **triple** and signing Pres gains +1000 pts. 8/9 components pass; **Fugitive Slave Act FAILS in House 101-116**. **CA admitted as Lower California + Upper California** — ahistorical free+slave pair maintaining 16-16 balance (POST 758).
  - **Fireeater Movement** (POST 569, 576): radical pro-slavery activists. Any pro-slavery Amendments **double points** next legis session; **60% party-switch** chance for marked pols.
  - **Walker Rebellion / Nicaragua** (POST 569); **Hawaii / Japan / Open China trade** (POST 569).
  - **Caning of National Politician** (POST 1057): Horace Mann caned by **David Levy Yulee** (ahistorical). Pol unusable 2 yrs; possible congressional investigation (POST 1101).
  - **Know-Nothing Movement** (POST 1057): forces all Nationalist-pol votes Nationalist next term; if FL has Nationalist AND not nominated, **3rd-party challenge mandatory**.
  - **Underground Railroad** (POST 1057): **doubles Fugitive Slave Act / Slave Code legislation**; Tubman gains Celebrity.
  - **Constitutional Crisis in Kansas** (POST 909).
  - **Dred Scott 4-4 deadlock** (POST 726).
  - **John Brown's Uprising** (POSTS 1450, 1640): 4 options A-D; Matt picked B deliberately to enable Civil War.
- **Faction renames** corroborate game-context #40: Wall Street Whigs → Clay Whigs → Dixon Whigs → Clay Whigs; Agrarians → Populist Dems-RW; Conscience Whigs → Abolitionists; Pop Sov Dems → Copperhead Democrats.
- **First-ever Pres death:** USS Princeton explosion event kills Pres Fillmore + faction leaders Boyd/Berrien/Clay (POST 569-571, MrPotatoTed). VP Jacob Broom II ascends. **Acting Pres rules** (POST 599): no own cabinet, 1 exec action, no veto, no incumbency in re-election.

### 3.2 Civil War + Reconstruction (1860s)

Section 2 above.

### 3.3 Gilded (1868 boot) — RECONFIRMED game-context #2/#68

- 1868 era transition observed live with end-of-era awards + faction-point reset.
- **Era-end scoring rewards** (POST 4477): +5 most points, +3 second, etc. Cons Dems led 1892 era with 239,449 → 12 banked.
- **Era transition Gilded Age → Progressivism (1892)**: faction roster aligns differently per era; progressivism vs socialism, eugenics/prohibition, East-vs-West progressive split.
- **Faction renaming at era transition** (POST 7003): Bourbon Dems → Conservative Dems; Mod Whigs → Business Whigs; Socialists → Labor Democrats; Irreconcilables → Progressives; Liberal Whigs → Radical Whigs; School Book Cons → School Book Liberals.

### 3.4 1892 Progressive boot (RECONFIRMED `hd` finding)

- Progressive ideology becomes active; new faction names emerge (Justice Dems, Progressives, School Book Liberals). Faction personalities update at era transition (POSTS 6618, 6821, 6984).
- **Primary Era origin** (POST 6755): *"We've transitioned now really into the primary era."* When primaries exist, the **primary winner is the frontrunner** and overrides the party-leader-frontrunner bonus at convention (POST 6754). McGovern-Fraser requires 15 states to have primaries first; Women's Suffrage 1920 triggers all states.
- **High-Tech industry introduced via event** (POSTS 2809, 3074, 3085): "High Tech Appears" scripted event 1880s. Spreads from NY/MA/West Coast/IL. "Improve High Tech" Gov action becomes available. **NEW industry beyond game-context #35 set.**
- **QoL meter activation** via "Labor Movement" event (POST 3223): activates QoL at level 3 (Unsatisfactory). 100pts Labor Unions/LW Activists; -100 Big Corps. Rev/Budget -1.
- **Planet Health meter activation** Progressive boot (general events from chunk 91 onward reference all major meters).
- **Federal Reserve / FBI / CoS / CNO / split Commerce + Labor** confirmed as separate cabinet/officer roles by the WWI era (POSTS 4596, 4611, 4751, 4758, 4769, 5291, 5433, 5674) — corroborates game-context #66.
- **Sen Maj/Min Leader/Whip, House Maj/Min Leader/Whip created mid-game by legislation** (POSTS 3932-3935, 3982). **PPT becomes "longest-serving majority party member"** auto-assign.
- **Income Tax Amendment lineage**: **Pollock v Farmers Loan** (1895 scripted SCOTUS, POST 4741): if Aye, all income tax legislation repealed + **deactivated until amendment passes**. 8-0 Aye. Income Tax Amendment ratified 1898 with 37 states. (Confirms game-context #52 sub-rule.)
- **Annexation / client-state mechanics** (POSTS 4748, 4755): "Grant Federal Government power to treat Cuba as client-state" passes. Independent of war.
- **Statehood pipeline** (POSTS 4593-4596, 4612-4614): Statehood EV decoupled from proposing legislation; census doc has fixed initial values. New states get auto-elected governor + Senator appointed by gov. AZ/NM/OK simultaneous 1893.

### 3.5 WWI / Roaring Twenties (1910s-1924)

- **Battle %-formula reconfirmed** end-to-end (§C.3.1) — same formula across maps 5/8/10/11 + Mexico + WWI.
- **Treaty A-D tier** confirmed (§C.3.5).
- **Lingering phase scripted by a player** (Arkansas Progressive, POST 7526) — procedurally complex but deterministic; categories: Maxed-Out Meters, Lingering Meters, Middle-of-Meter Movements, Volatility Rolls, Administrative Meddling. **Implementation reference for the build.**
- **Conservative Party formation** (POST 7406) — §1.11.
- **Hearst presidency by scandal cascade** (POST 7389) — §1.15.

---

## 4. GM/designer live rulings & house-rule patches

| Ruling | POST | Detail |
|---|---|---|
| Veto override is **2/3 both chambers**, NOT 60% | 2180-2187 | Designer ruling; 60% was a bug, reverted |
| Amendment ratification = majority Congress (game) vs 2/3 (IRL); 3/4 → later 2/3 of states | 1827, 1829, 2400 | Per-era config |
| Amendments can't be packaged with bills | 1835 | Hard rule |
| VP can be off career-track for **appointment**, NOT election | 2227-2234 | Hancock rejected as VP |
| Senate confirmation has no CPU rules | 90, 91 | "2.3 / 3.0.27 has only a few traits" |
| Half-term highest+lowest faction penalty | 647, 813, 979, 1880 | Matt repeatedly objects; unrevised |
| Replacement appointee skill gains stripped | 421 | Born from 1960 playtest loophole |
| Cabinet retention cap = 5 | 1436 | Hard cap |
| Tyler's full meter+enthusiasm midterm rule | 299-304 | Confirmed CORRECT ruling; 6-way test |
| Tie-break double-bonus on state ties | 1550-1552 | Fix: straight roll-off, no second bonus |
| Failed-nominee penalty too harsh (-1..-3 Party Pref) | 1655-1661 | Fix: only 5-Admin / certain traits |
| Faithless electors over-trigger | 469-471 | Engine generates anytime winner's state mismatches party-pref |
| Crisis -1 stacks too harshly | 171 | Harrison -3 across the board |
| Contingent election rules DON'T EXIST | 472-474 | GM invents 5 candidate rulesets mid-thread |
| Universal White Male Suffrage Amendment had no Dom Stab cost | 1119, 1122 | Logged feedback |
| Bills not checked against proposer's cards | 933 | Slips through |
| Foreign relations don't reset after won war | 925, 928 | Logged |
| Treaty-of-X relations bump missed | 420-421 | "Oversight" |
| Kingmaker age-35 forgot to enforce | 80, 514, 1002 | Routine violation |
| Continuous IRV-style elimination | 3419 | Patch: original CPU collapsed at ballot 3 with random pick |
| Randomize only on FIRST elimination | 3419 | Patch by Tyler |
| Compelled justice retirement: Manipulative Pres only, 1/term, d6 5-6 | 1142 | Works as designed |
| Census mid-era recomputes EVs; takes effect next midterm only | 1563 | "Events have no cap" + "10% rule" |
| Confederate loyalty-oath blocked for ex-CSA pols | 1994 | Pol-source flag gate |
| Permanent per-politician penalties need persistent field | 2271, 2106 | Church (loss), Blaine (controversial) |
| Sanford Church >60% EC loss = permanent -1 future Pres attempts | 2271 | Persistent |
| State-customizable governor terms | 2272 | Per-state policy |
| Iron Fist + Loans-from-Wealthy = PL controls all party govs | 2433 | Major mechanic |
| Egghead cabinet recommendations mostly flavor | 1801+ | Pres overrides on ideology priors |
| ±3 cap on per-phase ideology swings | 4574 | "Like the cabinet" |
| 5% retirement/death rate for senators + cabinet | 5437 | Retroactive rule added mid-run |
| Convention compromise rule | 3719 | Tyler invented at table |
| Convention interballot 1/candidate cap = "impractical" | 7214 | Suggested change to limited by Command |
| Dark-horse compromise candidates dodge resignation rolls | 7257, 7263 | Loophole; house-ruled retroactive |
| 3-ballot collective CPU endorse | 5272, 5841, 6099 | Confirmed in 3 places |
| Designer ruling: Pres IF doesn't override Sen Maj Leader IF | 7012 | "We need a new rule then. Lol." |
| Iron-Fist Maj Leader + Pliable Pres forces own picks confirmed | 4896, 4900 | Designer ruling: auto-AYE same actor |
| White-peace rules MISSING | 6533-6541 | "There are, in fact, no rules about white peace" |
| Frail + double-death-penalty rule | 7032 | "the new meta is never draft frail politicians" — perverse incentive |
| 20% retirement-if-unemployed: GM REJECTED | 7031 | "is, quite frankly, a bad move… ignoring it" |

---

## 5. Design holes (NEW — for game-context DH-12+ slots)

(Many corroborate the existing DH-1..DH-11; only the genuinely new ones listed.)

1. **White-peace rules MISSING** (POSTS 6533-6541). Tyler: *"There are, in fact, no rules about white peace."* Spec: Moderate Implementation (Pres + Sec State + Sec War), 75% -1 Party Pref, -100 Mil-Industry, -500 Expansionists, -500 President, returns to antebellum status quo. **Needs porting.**
2. **Bill ideology impacts not era-aware** (POSTS 6691, 6878, 6912): Mods on negative side of Women's Suffrage in 1916 is era-wrong. **Equal Voting Rights for Women never passes** (60.5%, 63.6% short of 2/3); GM: "This amendment will never pass in a game with CPUs."
3. **Small/large-state action-impact multiplier uncodified** (POSTS 6676-6680): RI small-state at 2.5% (half of 5%); large states double. In playtest sheets, **not in rulebook**.
4. **Faithless-elector trigger undocumented + over-aggressive** (POSTS 466, 469-471, 2912, 4441, 5176, 5217-5221): 8-elector defection in 1900 produced 232-232 tie → House contingent + Senate VP contingent. **EBR-suggested deadlock rule:** Controversial gain on elected Pres + 50/50 Domestic Stability hit (POST 5250).
5. **Reapportionment cap 435 likely never triggers** (POST 4290; Tyler POST 5352): natural growth rate makes the cap effectively never binding in normal play.
6. **Convention interballot 1/candidate cap = "impractical"** (POST 7214): house-ruled to limited by Command.
7. **Dark-horse compromise candidates dodge resignation rolls** (POSTS 7257, 7263): resignation rules assumed no Dark Horse would be nominated. Loophole.
8. **Cascading scandal sequencing hole** (POST 7389): Estella → Pershing → Hearst-Pres-in-days. No smoothing for back-to-back at-most-once events.
9. **CPU cabinet 50/50 Admin-1 reject + lobby-maximizing selection bug** = combined cause of designer-acknowledged **36% confirmation pass rate** (POSTS 4702-4708). vcczar: "low chance to reject" rule lost from rules doc.
10. **Contingent-election rules don't exist** — **GM invented 5 rulesets mid-thread** (POSTS 472-474). All 5 variants favored Fillmore; GM picked momentum-based to keep play moving. **MASSIVE design gap — author rules BEFORE build.**
11. **CPU has NO reciprocity / vote-trading** (POST 4875) — architectural.
12. **CPU meter-guarding missing on scripted events** (POST 6280) — Roosevelt triple-stack crashed QoL + Econ Stab simultaneously.
13. **CPU running-mate logic doesn't penalize ticket experience holes** (POST 7249).
14. **CPU governor menu static + no industry-stack awareness** (§C.1.13) — improve-industry fails silently at cap.
15. **CPU primary attack always hits highest-PV regardless of context** (POST 7135+).
16. **CPU compromise-candidate picker rigid highest→lowest** with no cross-faction coordination (POSTS 7229-7244).

---

## 6. Open questions (carry to game-context)

1. Convention "Compromise Candidates" — which faction the picker constrains (same-ideology nearest? lowest-PV? random?)?
2. Kingmaker endorsement formula: d6 vs d6+kingmakers vs d6+kingmakers+endorsements?
3. Convention auto-drop-out trigger at 2-3 ballots of 0 Momentum — should this be a hard rule?
4. CPU cabinet AI fix: weight Admin/competence vs only lobby cards?
5. Reconstruction default penalty for returning Confederates: which of voting-ban / +9-to-victors / one-phase-delay / auto-Articles fix is canonical?
6. Whig→Republican realignment conditions — never specified (POST 1284, 1737, 2049: 5% trigger, 3-condition gate).
7. Should faction-leader candidate selection follow the 75% leader / 25% random rule? (Tyler asks, POST 143.)
8. VP retention chance — what era-curve? (Tyler suggests "more likely Nuclear+")
9. Egghead cabinet suggestions: weight or remove?
10. Iron-Fist + Loans-from-Wealthy: temp gov takeover for ALL gov actions or election only?
11. Pliable Pres + Manipulative Advisor logic — Tyler "rules are very murky" (POST 4956).
12. 2-ideology-gap rule between Pres/VP — undocumented; observed at 4-step gap (POST 3797).
13. Outgoing vs incoming Congress in contingent election (POST 5203).
14. Top-2 vs top-3 in contingent election (DH-6, already logged).
15. Iron Fist + Iron Fist interaction — Pres IF doesn't override Sen Maj Leader IF — needs a new rule (POST 7012).
16. Primary delegate Group caps (Groups 1-3 cap at 3 each) — implementation undocumented (POSTS 5708-5732).
17. Master Kingmaker forced to Key Advisor regardless of Admin? (POSTs 5658-5660).
18. McGovern-Fraser triggers (15 states) vs Women's Suffrage (all states) — inconsistent (POSTS 7163, 7165).

---

## 7. Source partials → sections → final

- **partials 01-04** (chunks 1-40, posts ~1-2457, 1840-1872) → `section-A.md`
- **partials 05-08** (chunks 41-80, posts ~2458-5119, 1870-1900) → `section-B.md`
- **partials 09-12** (chunks 81-117, posts ~5120-7540, 1899-mid-1924) → `section-C.md`
- This final digest dedups across all three.

---

## 8. 8-line top-line (CPU-behavior-first)

1. **The 75/25 candidate rule** (POST 143) is the single most authoritative CPU-selection statement in the run; combined with **no VP-retention logic** (POST 167) and **no primary against incumbents** (POST 1777), it specifies how every open seat is filled.
2. **CPU bloc-vote IRV is now nailed across 4+ maps**: {closest ideology → highest PV → highest Legis → random}, continuous-elimination patch POST 3419, **3 inconclusive ballots → collective endorse** (POSTS 5272/5841/6099), **NO reciprocity** (POST 4875). Resolves the central spec for leadership/PPT/Speaker and committee races.
3. **Convention CPU is the richest subsystem**: per-ballot momentum + 10-action inter-ballot menu + weighted-kingmaker rules-change vote + **compromise at ballot 10** (rigid highest→lowest picker) + **dark horse at ballot 25** — but **no auto-drop-out** leads to 11-ballot deadlocks; designer flagged it as needing a 2.9 rework.
4. **Cabinet confirmation is broken at 36% pass rate** (POSTS 4702-4708) — designer-acknowledged: the "low chance to reject" rule was lost from the rules doc. The **50/50 Admin-1 inexperience trap** + **lobby-maximizing selection** picks Admin-nobodies who hold the right cards and cascades. **Iron-Fist Maj Leader + Pliable Pres** forces confirm-votes on Maj Leader's own picks (POST 4896, designer: auto-AYE).
5. **Iron Fist is overloaded** doing ≥6 distinct things by office; designer-flagged to split. **Conversion AI** scales 10%→58% with Pliable + ideology-adjacency gating, failure strips Pliable, multi-faction collisions confirmed. **Faction-leader 4-condition removal** (lost-prez 25 / lacks-charisma 25 / negative-trait 50 / Incompetent 100). **Whig auto-renames to "Conservative Party"** on a 3-condition trigger (POST 7406).
6. **Battle %-formula CONFIRMED across maps 5/8/10/11 + WWI/Mexico**: `Diff + Planning(SecMil+CoS) + Officer×10 + MilPrep + Benchmarks = win%`; **War Score ≥ +11 auto-wins**; war-end = `WS×2 = %`; post-war defeat = `|WS|×2×10%`; officer KIA on natural 1. **Treaty A-D tier** + 3-roll chain (Pres / Sec State / Amb) + Basic-vs-Special routing by Admin.
7. **Reconstruction END exec action** (POST 2812): AG Admin roll → +100pts to RW Activists/Trads/RW Pop/Cons / -100 Civil Rights / White League + Red Shirts cascade. **+2-Red bias** dominates 1864/68. **Long-term Justice ideology drift** (POST 7533): 25%/10%/5% mid/left/right every 10 yrs; Puritan blocks.
8. **Top architectural gaps**: **contingent election rules don't exist** (GM invented 5 rulesets mid-thread); **white-peace rules MISSING**; **CPU has NO reciprocity / vote-trading**; **CPU meter-guarding missing on scripted events**; **CPU governor menu static / no industry-stack awareness**; **cabinet 50/50 Admin-1 + lobby-maximizing selection bug** (designer-acknowledged 36% pass rate). **Live designer patches** (relocation cap → 4, continuous IRV, ±3 ideology cap, 5% retirement/death, faction-rename "Conservative Party" trigger) confirm the forum drives the build.

---

**Digest path:** `/home/user/AMPU/docs/game/playtest-digests/e1776bbd-drums-of-war-an-allcpu-playtest-of-the-civil-war.md`
