# Digest — f2aa81fd "Constructive Results of AMPU Summer Playtest"

**Type:** CHANGELOG / DESIGNER-RULINGS thread (tier-1, all DECIDED). Author
**@vcczar** (game designer) logs the concrete rule changes & fixes that came out
of the **Summer 2021 AMPU Playtest** — i.e. this is the *results / changelog* for
the run captured in **batch 26 `summer2021`** (fe15db25, the founding→federalism
~10-human multiplayer run, GM vcczar+MrPotatoTed). Co-author **@MrPotatoTed** and
players (**@Cal**, **@ConservativeElector2**, **@Hestia**, **@Rezi**) debate; every
"vcczar added/changed X" line is an **authoritative adopted rule** unless explicitly
parked. 249 posts / 4 chunks, all read. Cite `POST n` (`===== POST n =====`).

**Scope of decisions:** founding/Continental-Congress + Constitutional-Convention
machinery, the era-end/winning-party SCORING penalties, Faction-Leader rules,
a large **NEW implementation/governing-trait system** (~30 traits) that wires into
implementation/lingering/diplomacy/SCOTUS/veto/governor-action subsystems, the
filibuster/cloture rule, Rule-of-Four, the kingmaker-based pre-primary, the
decline-appointment rule, and the **1772-vs-1774 start-year** decision. Most
corroborate/SHARPEN the founding cluster (#159/#185/#68/#102/#143/#153/#179) and
the CPU suite; a handful are genuinely NEW.

> **Note on disposition.** "Decided" = vcczar marked it added/changed to the rules.
> A few are explicitly **PARKED/rejected** (flagged). The lowest-faction score
> penalty in POST 1 was **REVERSED** in POST 10 (Ted's nosedive concern) — logged
> so it is not re-introduced.

---

## 1. Continental Congress / Constitutional Convention (founding machine)

Corroborates/sharpens **#159** (CC/Const-Convention machine) and the `summer2021`
founding-forward rows. **`GM⇒App`** = automated CPU/scoring math the app must own.

| # | Rule (DECIDED) | Maps to | Disp. |
|---|---|---|---|
| POST 1 | **CPU vote for President of the Continental Congress, 2nd round:** if 1st-round vote is inconclusive, each CPU splits **25% own candidate / 25% earliest-draft-year candidate / 25% highest-value candidate / 25% random party nominee**. `GM⇒App` CPU voting math. | #159, #70 (CPU bloc-vote / IRV tie ladder), #71 | decided |
| POST 1 | **CPU faction with no horse in the race** — flagged as UNSPEC ("no rules for who a CPU faction votes for if they don't have a candidate"); parked for resolution. `GM⇒App` hole. | #70/#71 (CPU vote AI) | open/`GM⇒App` |
| POST 1 | **Becoming President of the Continental Congress = 50 pts.** (stated twice; "Election to the CC nets 50 pts" same post). | #68/#102 (era scoring), #159 | decided |
| POST 1 | **CC elections cadence:** revert to running **when Gov elections do** after the inaugural CC election; inaugural = 1st CC (Carpenter's Hall), next = long-lasting 2nd CC (Independence Hall); **1774–1776 is a 2nd half-term** (flag it to players). Need to flesh out when CC military/Pres appointments are made. | #159, #92 (founding subsystem gating) | decided |
| POST 1 | **Domestic-stability modifier for non-regionally-diverse CC Presidents** — under consideration (consider penalty if CC presidents aren't regionally diverse). | #179 (cabinet/meter), DomStab cluster | considering |
| POST 65, 81, 113 | **Constitutional Convention rules ADDED**; **delegate bonuses ADDED**; Misc Rules now lists the **possible Constitution articles** (propose menu) — the per-article propose machine of #159. | #159 | decided |
| POST 78–85 | **Const-Convention delegate eligibility:** baseline **every delegate must have ≥1 Legislative** (it is a legislative process). Incumbent military leader with BOTH **"Military Leader" + "Celebrity"** is eligible (the Washington/"Benedict Arnold" loophole) **but still needs ≥1 Legis**. | #159 | decided |
| POST 101, 113 | **"Abolish State Governments" / "Abolish the States"** added as a Constitution option (master-sheet only, not in the playtest). | #159 | decided |
| POST 114, 119 | **"Move Capital to X" Constitution options** added (Charleston/Boston/Lebanon-KS/Chicago/Williamsburg/New Orleans/SF/San Marcos/Philadelphia/NY/Baltimore/Princeton), gated to states being in play; **CC-Pres tie-break law** + **"protest Big Gov in lieu of a vote"** (Traditionalist outlet) added. | #159, #92 (territory-gated content) | decided |

## 2. Era-end & winning-party SCORING (point-banking penalties)

Corroborates/sharpens **#68** (era-boundary point pipeline) and **#102** (dual era
scoring). The headline penalty was **adopted then REVERSED** — log the reversal.

| # | Rule | Maps to | Disp. |
|---|---|---|---|
| POST 1, 8 | **Winning-party lowest-faction penalty:** the winning party's **top player loses 25%** of score if their party contains the **lowest-scoring faction**; all other factions (minus the last) **lose 10%**. | #68/#102, #108 (faction-enthusiasm balance) | **REVERSED** |
| POST 10 | **REVERSAL** — Ted flagged a "nosedive" effect (minority party can't control its low score while the rest hemorrhage points); vcczar: *"Let's not use this rule"* (may reinsert a variant if one ideology is dead-last the whole game). Existing **faction-enthusiasm** already does much of this. | #68/#102, #108 | parked/rejected |
| POST 15, 19, 143 (ch1) | **Ideology-tiered legislation scoring (proposed):** Moderate laws +50 to Moderate statesmen, Lib/Cons +100, Trad/Prog +250, LW/RW-Pop +500 — higher-risk/higher-reward to pass farther from center; floated as a **blanket rule** so events needn't be re-edited. Endorsed by Ted, vcczar "good plan." | #102, scoring cluster; ties to faction-card-drop debate (§7) | considering |

## 3. Faction Leaders (Era of Independence waivers)

Corroborates **#143/#153** (Faction-Leader / command rules) and `summer2021`
founding-gating.

| # | Rule | Maps to | Disp. |
|---|---|---|---|
| POST 1 | **Era of Independence: prior-offices requirement for Faction Leader does NOT apply.** | #143/#153, #92 (founding gating) | decided |
| POST 1 | **Era of Independence: "obscure" requirement for Faction Leader REMOVED.** | #143/#153 | decided |
| POST 1 | **Faction with no ideology card → its leader must have a personal ideology that is a DOMINANT ideology for the Historical Era.** | #4 (era ideology profile), #143 | decided |
| POST 1 | **After ideology cards dealt, any faction w/o an ideology gains the era's dominant ideology** (randomly if multiple dominant). `GM⇒App` auto-assign. | #4, #108 | decided/`GM⇒App` |
| POST 1, 51 (ch1) | **CPU movements for picking faction leaders ADDED.** `GM⇒App` CPU AI. | #70 cluster (CPU leadership AI) | decided/`GM⇒App` |

## 4. ★ NEW implementation / governing-trait system (the big new block)

vcczar adds **~30 traits** (POST 128, 139–156) that drive a **president/cabinet
IMPLEMENTATION sub-engine** + **lingering meter pulls** + diplomacy + SCOTUS + veto +
governor actions. This is a **distinct unbuilt system layer** beyond the shipped
`traits[]` list — it deepens **#179** (cabinet lingering-roll meter engine) and
**#182** (command/action budget) and touches the whole 2.5/2.7/2.8 loop. Mostly
"won't affect this playthrough" but added to master rules → canonical going-forward.

| # | Traits added | Function (DECIDED) | Maps to |
|---|---|---|---|
| POST 128 | **Cosmopolitan / Provincial** (presidential-election only) | Cosmopolitan: 25% chance +1 in all party-competitive regions as Pres, no VP bonus. Provincial: 25% chance +2 home state / +1 home region / −1 elsewhere as Pres; as VP +2 home state/+1 home region, no penalty. | #16/#18 (election bonuses) |
| POST 145–146 | **Delegator / Micromanager** | Delegator: chance to skip an implementation roll (good — president usually causes failures). Micromanager: chance to take over a cabinet officer's roll (can be bad — Carter/Hoover); also gets **extra federal-intervention attempts** (POST 169) and must approve allies' platform planks (POST 184). | #179, #182, #20 (gov actions) |
| POST 147, 157, 167 | **Bookkeeper / Numberfudger; Cop / Illicit(lenient); Geostrategist / Strategically-naïve; Domestic Warrior / Domestic Apathy** | Expertise-gated implementation modifiers by policy genre (economic / judicial / foreign-mil / domestic). Help/hurt the **Blunder roll**: positives → high chance to avoid blunder; negatives → near-auto blunder in that genre. | #179, #182 |
| POST 167 | **Crisis Manager** (rare — start: Washington/Lincoln/FDR) / **Crisis Admin** (cabinet) | Crisis Manager: boosts everyone's abilities for crisis-related implementation incl. self; **+1 command to deal with a crisis** (POST 183); +10% battle-plan when one loss from defeat (POST 173). Crisis Admin (cabinet): high chance to avoid blunder; with Efficient can pull everyone out of a blunder roll. | #179, #182, #155 (RevWar) |
| POST 168 | (lingering) Crisis Admin → **10% chance to pull a meter OUT of crisis** during Lingering; **20%** if Pres also Crisis Manager (on top of standard cabinet meter rolls). | **#179** (cabinet lingering-roll) | 
| POST 169 | **Crisis Gov** | Governor gets a boost for crisis-dealing Gov Actions. | #20 |
| POST 148 | **Magician** | A "manipulative" pol increases their manipulative ability by TBD% while serving in the legislature. | #110 (legis loop) |
| POST 151, 169, 182, 183 | **Passive** (opposite of Iron Fist) / **Predictable** (opposite of Manipulative) | Passive Pres can block own federal-intervention; Passive Justice won't attempt vote conversions (POST 171); Passive Speaker = less interference (allies may *want* one, POST 181); Passive Chief Justice can't refuse cases (POST 239). Predictable Pres can auto-fail federal intervention + is a war weakness (POST 172); Predictable Justice only convertible by Chief Justice (POST 171); Predictable Congresspeople problematic if misaligned w/ faction leader (POST 183). | #179, #182, SCOTUS cluster |
| POST 182, 183 | **Passive + Pliable = PUPPET president** | A manipulative Key Advisor / VP / cabinet member makes all veto + Pres-Action decisions ("unelected king" play). | #179, veto/exec cluster |
| POST 152 | **Overeager / Late Bloomer** | Career-track positives/negatives. | career-track cluster |
| POST 156 | **Carpetbagger** (election penalty) | Gained on relocating: 25% chance of −1 for **8 years**, then expires (long-term resident). | relocate (#110 2.1.4), #16/#18 |
| POST 170 | **Jurisprudence** (Chief-Justice super-ability) | Chief Justice can boost vote-conversion odds of same-ideology justices (5-6 roll → 4-6); deepens role in compelled SCOTUS retirements/nominations/confirmations (POST 183); can refuse unlimited state cases (POST 239). | SCOTUS cluster |
| POST 13, 125 | Data: "Controversial"→Cuomo; "theocrat"→Dulles brothers; (others) — master-sheet tagging. | dataset | decided |

> **Designer pushback (Ted/Cal, POST 149–158, 76–77):** several of these are "minor
> implementation-style modifiers" that may overlap efficient/egghead/easily-
> overwhelmed/incompetent or the faction cards — vcczar kept them, calling them
> "slightly different." Treat as ADOPTED but flag overlap risk for the build.

## 5. Congress / legislation procedure

Corroborates the legislative loop (#110) + filibuster gap (**DH-76**).

| # | Rule | Maps to | Disp. |
|---|---|---|---|
| POST 98 | **★ Filibuster/cloture ADDED to US Senate** ("don't know why this was missing"): a Sen-Maj-Leader must invoke **cloture** to beat a filibuster; failed cloture **delays the bill/package a half-term**; **one filibuster per half-term** (first-come), **two if filibusterer is Efficient**; filibuster only by a Senate officer/committee member; both are **procedure bills** (created/modified via vote); Senate **default = simple majority**. | **DH-76** (filibuster-without-cloture hole), #110 | decided |
| POST 129 | Filibuster amendment: **"Puritan" can filibuster more than once if also "disharmonious"** (replaces the Efficient route for the extra filibuster). | DH-76 | decided |
| POST 222–235 | **Proposal-source debate → NO CHANGE (parked).** vcczar floated randomized proposers weighted by Legis (5×..1×), Efficient = 2 proposals, officer steal/swap via manipulative/iron-fist/magician. Ted/Cal pushed back (dominant party would monopolize / too complex). **Kept the current committee system**; confirmed the **Legis ladder: 1 = committee member, 2 = chair, 3 = whip, 4 = maj/min leader, 5 = Speaker** (POST 233-235); considered re-tiering the Senate side. | #110, committee cluster | parked (status quo) |
| POST 247 | (Plan B/C/D) If legis props become events: Pres has a **platform** that guarantees some proposals; if Congress is in opposition the **Speaker sets the legislative agenda**. | #181 (platform), #110 | considering |
| POST 14, 126 (ch1) | "Remove requirement that everyone must propose a bill; make **repeal** an explicit option" (esp. for Traditionalists). | #110, Traditionalist balance | decided (rules-clarity) |

## 6. Other subsystem rulings

| # | Rule | Maps to | Disp. |
|---|---|---|---|
| POST 49–53 | **★ Decline-appointment right CONFIRMED** for General / Continental-Congress / cabinet / any appointment (the shipped game lets you decline; the *playtest* skips it for speed). Players: appointing another player's best pol to a death-risk post without a decline option is overpowered. | #25/#31 (appointments), #73 (cabinet) | decided |
| POST 159–160 | **★ Quasi-corrupt pre-primary for Gov/Sen nominees:** the party nominee = whoever has the **most Kingmakers from that state**; tie → **most politicians in that state**. No primary unless instituted at state/national level → entrenched state machines (makes reform a conflict). Endorsing another faction's nominee = parked ("CPU-game question"). | #47/#185 (primary subsystem), #159 (kingmaker), #72 (CPU candidate select) | decided |
| POST 92–98 | **★ Celebrity merged with "Military Leader"** (identical effects); Celebrity nerfed to **50% chance +1 in presidential** elections, now ALSO applies to **Gov/Sen/US-Rep** elections; **guaranteed +1** for any pol with BOTH Celebrity + Military Leader. | #16/#18 (election bonuses) | decided |
| POST 74–80, 246 | **Celebrity-eligibility** (parked-leaning): vcczar wants "celebrities" usable only from their **"obscure-remove" date** (Trump drafted ~1976, usable ~1984) — a built-in late-bloomer; rejected Ted's "no pre-draft celebrity" idea (wants ~50% historical accuracy). "Losing **obscure** should be a big deal" (household-name buzz); obscure as a non-incumbent election gatekeeper (~20%). | #136 (draft), obscure cluster | considering |
| POST 236–239 | **★ Rule of Four / Chief-Justice case refusal:** a Chief Justice (**≥4 Judicial**) can refuse a state case brought via Gov Actions, but **Rule of Four can override**; **Jurisprudence** → refuse unlimited; **Iron Fist** Chief Justice → Rule of Four doesn't apply; **Passive** → can't refuse. | SCOTUS cluster, #20 (gov actions) | decided |
| POST 59–63 | **US Rep proportional rule:** influential US Reps now each **represent a share of their state's actual US-Rep count** (21 reps / 3 influential = 7 each; odd → highest-Legis gets the extra). Enables real US-Rep figures. | #110, apportionment | decided |
| POST 35–36 | **Trait-interaction rules:** **Puritan can no longer shift ideology** (previously could, losing Puritan); **Lackey can now shift** *unless* same ideology as faction leader; **converting a Kingmaker converts all his proteges** except Puritans; a protege can't be converted unless their Kingmaker is, unless **Pliable**. | #76 (conversion AI), kingmaker cluster | decided |
| POST 66, 176 | **Death/retirement tuning:** random death made slightly less likely; **no random retirement under age 60** (still may retire end-of-4yr if outgoing Pres etc.); **one-term president who loses = 50% retire**; **losing nominee under 60 = 25% retire** (POST 174-176, the WJB/Trump/Wallace "populists don't retire" rationale, generalized). | death/retirement cluster | decided |
| POST 137–144, 198 | **Media-card over-shift NERF:** media phase swings "every ideology +4" judged "horribly unrealistic"; resolution = media should affect **only the faction's candidate/card ideology**, not all ideologies (kept one more cycle to confirm). | media-card / party-pref cluster | decided (monitored) |
| POST 104–111 | **Governor term-limit / term-length incentive:** big pts to Reformists for proposing them (POST 107); leaning to an **automatic random-state event** "(state) changes governor term limits" with a +/- next-election swing + ~20-30yr cooldown. | #20 (gov actions), reformist | considering |
| POST 1, 39 | "**Lingering Phase in Era of Independence doesn't start until end of Revolutionary War**" (chart still previews it); founding legis lingering effects filled in; **legis/actions now have IMMEDIATE + lingering effects**. | #92 (founding gating), #179 | decided |
| POST 1 | **Ideological Enthusiasm** rules added to Special Rules; **Populist-card scoring** clarified — when LW/RW-Pop score differently, the card-holder is awarded by whichever populist type is the **majority in that faction** (tie → both). | #108, Populist-card cluster | decided |

## 7. Strategic / scope decisions (forward-looking)

| # | Decision | Maps to | Disp. |
|---|---|---|---|
| POST 216–220 | **★ Start year moved 1774 → 1772.** Rationale: 1774 = a 2nd-half-term (midterm); starting 1772 removes confusion (1772 draftees go on career track 1774). 1772–1774 is near-empty: only **Events / Career Track / Faction Leaders**, with **4 guaranteed scripted events** — Gaspee Affair → Committee of Correspondence → Tea Act → Boston Tea Party. **Confirms the shipped 1772 scenario start.** | #92, scenario1772 | decided |
| POST 221, 194-197 | **Meters keyed per START-DATE (every pres term), not per Historical Era** (Big/Small-state bias tables built per start date). | #92 (per-era state-bias), #18 | decided |
| POST 240–241 | **Ideology-shift DATES added** so a pol uses era-appropriate ideology at later start dates (not their initial one). | #4 (era ideology), #92 | decided |
| POST 130–136 | **Automation/CPU debate (`GM⇒App` charter evidence):** which phases could be CPU-automated if a dev finds the game too long — **Diplomacy**, **Supreme Court** ("should be automated" — makes picks strategic; Ted: default automated), **Military**. vcczar keeps SCOTUS manual as a CE2 option; default likely automated. | #114 (solo/CPU), SCOTUS automation | considering/`GM⇒App` |
| POST 163 | **CPU rules for REJECTING cabinet appointments ADDED** (+ a pol may reject even if you want them, e.g. micromanager won't serve a micromanager Pres). `GM⇒App`. | #73 (CPU cabinet AI) | decided/`GM⇒App` |
| POST 242–245 | **Big speculative rework (parked/Plan-B):** convert traits/interests/expertise to a **numeric system**; **expand abilities 0–5 → 0–10**; **anyone can run for any office** (but terrible if <5 in the relevant skill) — Ted backs this. **Meters maybe simplified to mild/moderate/strong up/down trend.** | skills (0–5 today), #18 | considering |
| POST 193 | **Resign-to-run** clarified: only in the primary era, and only once **primaries are nationwide** (with <~10 primary states, a candidate can hold office and win at the Convention). | #47/#185 | decided |
| POST 185–192 | **Revenue-Budget meter merged:** "Revenue Crisis" + "Budget Crisis" collapsed into one **"Rev-Budget Crisis"** meter (good = revenue > spending). | #18 (meters), #116/#160 (EconStab) | decided |
| POST 249 | **★ "Emulate the French Revolution" Pres-Action fully specced** (rare, ~1/50-100 playthroughs): LW/RW-Pop/Prog/Lib Pres w/ **Puritan**, allied with France, in **Era of Federalism**, after the French-Revolution event — a 9-step coup→purge→countercoup→secession→reign-of-terror→War-of-1812→new-Constitutional-Convention cascade (generated pols backfill voids). | #177 (federalism foreign-affairs/decision spine), #92 | decided |
| POST 24–25, 200–205 | **Flavor/UI ideas:** a "US History"/presidency-memorability screen + leaderboard tabs (most-powerful, biggest-overperformers/landslides); PV recalibrated so top pol (T. Roosevelt) = **100** (founding pols get a larger DRAFT value). | UI/leaderboard, #102 | considering |

---

## Candidate gaps for consolidation

**Corroborates / SHARPENS existing gaps (give to consolidation to fold in):**
- **#159** (Const/Continental-Convention machine) — POST 1 (CC-Pres CPU 2nd-round
  25/25/25/25 vote; CC=50pts; CC-election cadence), 65/78-85/101/113-119
  (delegate ≥1-Legis baseline, Mil-Leader+Celebrity loophole, article menu,
  capital-move options, abolish-states, tie-break/protest laws).
- **#68 / #102** (era-end point-banking + dual scoring) — POST 1/8 winning-party
  lowest-faction penalty (**but REVERSED POST 10** — log the reversal); POST 1
  CC=50pts; POST 15/19/143-ch1 ideology-tiered legislation scoring (proposed).
- **#143 / #153** (Faction-Leader / command) — POST 1 Era-of-Independence waivers
  (no prior-office, no "obscure"), dominant-ideology-leader rule, CPU faction-
  leader AI. (Note: this thread does **not** re-decide the post-election Command-
  loss rule #143 or the 0-Command/doubled-gain #153 — those are `oopscpu`/Ted.)
- **#179** (cabinet lingering-roll meter engine) — the entire §4 trait block,
  esp. POST 167-169 (implementation blunder modifiers; Crisis-Admin 10/20% pull-
  out-of-crisis in Lingering).
- **#182** (command = action budget) — POST 183 Crisis Manager "+1 command for a
  crisis."
- **#185 / #47** (primary→convention machine) — POST 159-160 kingmaker-based
  quasi-corrupt pre-primary; POST 184 inter-ballot Controversial+Propagandist
  "lie for momentum"; POST 193 resign-to-run (nationwide-primary gate).
- **DH-76** (filibuster without cloture) — POST 98/129 filibuster+cloture ADDED
  (this is the *origin* of the rule the `wilsons1916` hole flags as missing).
- **#16/#18** (election bonuses/meters) — POST 92-98 Celebrity/Military-Leader
  merge+nerf; POST 128 Cosmopolitan/Provincial; POST 156 Carpetbagger; POST
  185-192 Rev-Budget meter merge.
- **#76** (conversion AI) — POST 35-36 Puritan/Lackey/Kingmaker-protege conversion
  rules.
- **#73** (CPU cabinet AI) — POST 49-53 decline-appointment right; POST 163 CPU
  cabinet-rejection rules.
- **#92** (era-as-content-band / founding gating) — POST 216-221 1772 start;
  per-start-date meters; POST 240 ideology-shift dates.
- **#177** (federalism decision/foreign-affairs spine) — POST 249 "Emulate the
  French Revolution" cascade (Era-of-Federalism-gated).
- **#114 / `GM⇒App`** — POST 130-136 automation debate (Diplomacy/SCOTUS/Military
  could be CPU-automated; SCOTUS default-automated).

**NEW (not clearly an existing row — propose to consolidation):**
- **NEW — Presidential/cabinet IMPLEMENTATION sub-engine + the ~30 governing/
  implementation traits** (§4): a distinct post-legislation *implementation* pass
  (success roll → Blunder roll) modified by expertise-gated traits (Bookkeeper/
  Numberfudger, Cop/Illicit, Geostrategist/Strategically-naïve, Domestic Warrior/
  Apathy), Delegator/Micromanager, Crisis Manager/Admin/Gov, Passive/Predictable,
  Passive+Pliable PUPPET president, Magician, Overeager/Late-Bloomer. Deeper than
  the shipped `traits[]`; wires into #179 implementation + lingering + #20 gov-
  actions + diplomacy + SCOTUS + veto. **POST 128, 145-156, 167-184, 239.**
- **NEW — Rule of Four / Chief-Justice case-refusal mechanic** (Gov-Action court
  cases): ≥4-Judicial CJ can refuse a state case; Rule-of-Four override; Iron-Fist
  CJ bypasses it; Passive can't refuse; Jurisprudence = unlimited. **POST 236-239.**
  (No existing SCOTUS gov-action-refusal row spotted.)
- **NEW — US-Rep proportional-representation rule** (influential reps each carry a
  share of the state's real US-Rep count; odd → highest-Legis). **POST 59-63.**
- **NEW (data) — PV normalization to 100-scale** (top pol = 100; founding pols get
  larger *draft* value), and the master-trait recalibration of PV after the trait
  additions. **POST 200-205.** (Affects dataset-generation conventions.)

**Parked / REVERSED — log so not re-introduced:**
- Winning-party lowest-faction score penalty: **REVERSED** (POST 10).
- Randomized/Legis-weighted proposer system: **rejected**, committee system kept
  (POST 222-235) — but the **Legis ladder (1/2/3/4/5 → committee/chair/whip/
  leader/Speaker)** is confirmed canonical.
- "No pre-draft Celebrity" (Ted's idea): **rejected**; celebrity-via-obscure-remove
  is vcczar's preferred direction (POST 74-80, still "considering").
- 0–10 ability rework / numeric traits / "anyone runs for any office" / simplified
  3-state meters: **speculative Plan-B** (POST 242-245), not adopted.
