# 3a9ac985 — "AMPU 1948 playtest continued (2004 and beyond)"

**32 chunks / 2276 posts, consolidated from 4 map-digest partials.** Citations are
`POST n` (the `===== POST n =====` markers). This is the **modern-era** ground
truth and by far the most mechanically mature thread ingested to date.

## Thread scope

- **Format:** multiplayer, asynchronous, **GM-adjudicated** play-by-post over a
  shared Google Sheet ("the sheet") with named tabs (pol-data, executive,
  Legis-Active, PresExecActions, Primary, leadership, elections) and a Python/CPU
  helper script (a literal console dump appears at POST 2240,
  `=== CONVENTION DELEGATE SETUP ===`). The single-player browser build automates
  exactly this hand-adjudication.
- **Players:** ~10 human factions, **5 Blue + 5 Red**, CPU fills empties (suffix
  `CPU`). GM = **ebrk85**. Designer/rules-authority = **vcczar** ("V"), who
  appears as an in-game pol/voter and is referenced as the authority across many
  parallel era playtests (1820/1840/1856…). The master ruleset is **shared across
  all era playtests** (POST 1246-1262: a fix is propagated to 1820/1840/1856).
- **Campaign:** a continuous **~60-game-year, ~3-real-year** campaign — a 1948
  start that itself continued a 1948-prior game (POST 1, 2067-2077 list the
  president line **33→49**: Truman 1945 … Ron Kirk 2017–present). The **same
  continuous campaign family** as `gilded`/`fed` in spirit (long multi-era), but
  this thread is the **1948 modern arc**.
- **Played window:** in-game **2004 → 2020**. "Welcome to" markers gate the
  half-terms (chunks 003/007/011/015/020/025/029). The thread **ENDS mid-session
  in 2020** (POST 2276, a committee-vote ballot) — the campaign did **not** reach
  the 2020 presidential election.
- **Alt-history (critical):** an **alternate timeline**. **53 states** incl. **DC,
  Cuba (CU), Puerto Rico (PR)** as full states (POST 426/438; POST 2240 delegate
  table: Cuba 17 EV, PR 3 EV). Ahistorical presidents (**Cuomo** the 2008
  incumbent, **Kirk** the 49th; **Arne Carlson** a recurring faction leader since
  1988 who ran 3rd-party Pres in 1984). Ahistorical SCOTUS outcomes flagged
  throughout (Janus, Atkins, Dobbs → all decided differently). Per
  historical-context.md §10: the game runs on its **own clock ~10 years behind
  real tech** (POST 39-41 "IBM releases first PC" in 2004; internet not yet
  fired), with **fictional era names** — see below.

### The game's own alt-era clock + fictional era names

The campaign's calendar year ≠ real history, and eras have **fictional names**
(not the historian's real-history labels):

| Game era name | In-game span | Evidence |
|---|---|---|
| "Kindness Era" | (pre-2004, referenced) | POST 725, 818 |
| **Era of Terror** | …–2012 | POST 9-15 ("final half-term of the Era of Terror"), 769 |
| **Era of Populism** | **2012–2024** | POST 769, 1106, 1771 |

Era boundaries gate which events/actions are legal **and rescale the faction-card
economy** (POST 1172 — card counts per ideology/interest change at the boundary;
POST 1200 — the era boundary can force the Prog/LW-Pop cards to split across two
factions). End-of-era awards are paid at each boundary (POST 1080).

> **Note for the historian's framing:** per historical-context.md §10 this is the
> one window where **BLUE = Democrats = left / RED = Republicans = right** matches
> modern usage with **no polarity caveat** (POST 14: "Democrats will hold their
> 2008 convention… Republicans will hold theirs"). The shipped flat interest-group
> pool (Big Tech, Big Oil & Gas, Globalists, LW/RW Media) — anachronistic in
> 1856/1868 — **fits this era**.

---

## The modern turn loop (the game's own numbered 2.x phases)

The GM drives an explicit numbered sequence per half-term (2 years), **verbatim
the same taxonomy as the build's `PHASE_SEQUENCE`** — strong corroboration that
the build's phase numbering = the forum game. Modern order observed:

- **2.1.x housekeeping:** 2.1.1 Politician Draft (draft yrs) · 2.1.2 Career Track
  · 2.1.3 Remove Flip-Flopper Penalty · 2.1.4 Relocate Politicians · 2.1.5
  Ideology Shifts · 2.1.6 Politician Conversions · 2.1.7 Kingmakers & Proteges ·
  2.1.8 Determine Faction Personalities.
- **2.2.x:** 2.2.1 Congressional Leadership Elected · 2.2.3 Faction Leaders ·
  2.2.4 Party Leaders Elected.
- **2.3.1** Presidential Appointments (cabinet) + confirmation.
- **2.4.x:** 2.4.1 Random Death/Retirement · 2.4.2 AnytimeEvos · 2.4.3 EraEvos.
- **2.5.x:** 2.5.1 Lingering · (industry leaders) · 2.5.2 Governor's Actions +
  amendment ratification · 2.5.3 Supreme Court Decisions.
- **2.6.x legislative:** 2.6.1 Proposals → committee block/replace → committee
  votes → packaging → floor votes → debate swaying → filibuster/cloture → veto/
  override → 2.6.6 Scoring + faction-enthusiasm reshuffle.
- **2.7.x:** 2.7.1 General Diplomacy · 2.7.2 Military Action.
- **2.8.x:** 2.8.1 Executive Actions · 2.8.2 Compelled SCOTUS Retirements ·
  (decennial) Census · Elections.
- **2.9.x elections:** midterms, or full **2.9.1 Primaries → 2.9.2 Conventions →
  2.9.3/2.9.4 General** in presidential years.

This is **far** more phase-rich than the shipped 1772/1856 scenarios.

---

## National macro-state: the meter bank + enthusiasm/Party-Preference engine

### The concrete meter set (POST 12, 114, 618, 752, 878, 944, 959, 1061, 1238)

A bank of banded-text meters, each nudged ±1 by phases, cabinet officers,
"Lingering," "Revision to Mean," "Volatility," and legislation:

- **Revenue/Budget** (… Overspending → Balanced → Underbudget …)
- **Economic Stability** (Panic → Stagnation → Sound → Booming)
- **Military Preparedness** (… → Totally Prepared)
- **Domestic Stability** (… Mass Protests → Stable)
- **Honest Gov't** (corruption ladder; top = "Free of Corruption")
- **Quality of Life** (… Good → Great)
- **Planet's Health** (… Poor → Near Crisis → Crisis)
- **Party Preference** (Blue↔Red; the master election thumb-on-scale)
- **Per-power foreign-relations meters** for **8 powers**: UK, France, Spain,
  Germany, Russia, China, Japan, **Israel** (Neutral → Friendly → Nearly Allies →
  Allies).
- Plus **per-ideology enthusiasm** positions on a Blue↔Red track (one per the 7
  ideologies, e.g. "Red +2", "lean Blue").

Crisis behavior: dropping a meter into a bad tier **begins a named Crisis** with
knock-ons (POST 721 EconStab→Panic ⇒ DomStab −1 + Periodic Protests); the crisis
**ends** when the meter recovers (POST 2230 "Stable- Crisis ends"). Meters
**cascade** (POST 1537 DomStab level forces QoL down; Rev/Bud level caps EconStab
gains). Top-of-meter has hard rules: **Honest Gov't maxed ⇒ deactivates all
Political Machines + Gerrymandering** and blocks new ones (POST 1238, 1554, 1962).

### Numeric national debt (distinct from the ordinal Rev/Budget meter)

A **numeric** debt/deficit is tracked alongside the meter: "National Debt now at
−5" (POST 99), "deficit of 6 / -7" (POST 1537), reduced to −3 by a credit action
(POST 2042). Loans push it negative; spending bills are gated against it.

### Meter → election mapping (POST 114, 424, 752, 1061, 1742, 2061)

A canonical, itemized table maps each meter to an election effect, published as
"State of the Meters" before every election. Examples: Rev/Budget → +1 incumbent
party in Party-Pref calc + Moderates enthusiasm; **EconStab → −3 to incumbent
party in all elections** (when bad); DomStab → incumbent −1; Q of Life → RW-Pop +
Mod +1; Planet's Health → Mod +1, Prog −1; Honest Gov't → **Controversial pols
−2 extra**; Party Pref → direct numeric advantage; per-ideology enthusiasm → per-
ideology bonus. (The Honest-Gov't↔Controversial interaction is confirmed
decisive — vcczar's own pol lost a 3rd-term bid to it, POST 1754.)

### Faction-enthusiasm reallocation algorithm (POST 96, 722, 945, 2039)

After legislation scoring, a fixed **4-part rule** shifts ideology enthusiasm:
the dominant party's faction that gained **most** points → its cards +1 toward the
dominant party; gained **least** → −1 away; the opposition faction that gained
most → +1 toward dominant ("needs taken care of"); the opposition faction that
scored least → **+2 toward opposition** ("furious at incumbent"). A distinct,
formalized engine absent from the build.

### Faction scoring & era-end awards (POST 134, 454, 768, 1080, 1436)

Running **Score** per faction & party, published as "Nickname / Score / Leader"
scoreboards grouped Blue vs Red. Score drives the enthusiasm reshuffle. The
team's **lowest-scoring faction penalizes teammates** (loses 25% of its own
points, others 10%; POST 768, 1436). **End-of-era bonuses** (POST 1080): most era
points +5; most from the other party +3; winning party's factions +3; etc.

---

## Presidential election subsystem (2.9.1–2.9.4) — the biggest NEW system

No analog in the build. Runs in presidential years (`year % 4`).

### Primaries (POST 340-366, 980-1062, 1646-1704)

- **Candidates per faction:** up to **1 Major** (faction leader or Celebrity w/
  Command) + **1 Minor** (anyone w/ Command), each picking **3 focus states**.
- **Incumbent/PL blocking:** a running incumbent **cannot be primaried**; an
  **Iron-Fist + Leadership president/PL blocks intra-party challengers unless the
  challenger's faction ideology leans to the other party** (POST 1663 — Cochran
  renominated unopposed; Jim Justice blocked).
- **Focus-state roll table** by charisma trait (POST 980, 989, 1646): base 5-6→+1
  / 1-2→−1; **Charisma** widens to 4-6/1-2; **Likable** 5-6/no-negative;
  **Uncharismatic** 0-pos/1-2; **Unlikable** 5-6/1-3; **Orator** adds to the +
  modifier; sole **Debater** in a primary → 5-6 for +1 nationally.
- **Candidate Strength** scored numerically (POST 348, 1664); front-runner emerges.
- **Per-group loop** (states grouped into **Primary Groups 1..N**, group set by
  governor "State Primary Placement" actions): **Primary Debate** (momentum ±1;
  **front-runner penalized −2 for losing**) → **Scandal Rolls** (1d6=scandal;
  **Integrity** immune; **Propagandist/LW-RW Media** can spin/diminish) → **Broke
  Candidate Check** (forces a drop-out; only candidates not 1st/2nd; GM corrected
  a misapplication, POST 1008) → **Primary Actions**: Embrace [State] Issue
  (25%/50% +1, risks ideology shift + Flip-flopper if non-adjacent), Campaign
  Focus (die ±, Celebrity +2, can backfire on a 1), Give a Major Speech (once),
  **Attack [opponent]** (−1 opp momentum or backfire), **Presidential Promise**
  (offer a plank/cabinet seat for an endorsement; **rejectable**, recipient needs
  matching expertise), Withdraw+endorse / release / hold delegates.
- **Delegates** accumulate per group, mixing **winner-take-all** (DC: Kennedy all
  5) and **proportional** (CA: Kirk 178 / Blair 59) (POST 1701). Drop-outs
  **endorse + transfer delegates** (POST 362). Trailing candidates who stay in
  take penalty rolls (POST 1694: Disharmonious/Unlikable/−1 future Pres runs).

### Conventions (POST 367-398, 1028-1044, 1705-1724)

- **Running mate** offered cross-faction (accept/decline); **replacing a sitting
  VP** needs a roll + a "rash/desperate" penalty roll (POST 1721).
- **VP-impact scoring** — a ~9-item binary checklist (POST 369, 396, 1711, 1721):
  +1 each for VP from another faction (+ enthusiasm move if from the lowest-
  enthusiasm faction); ticket has a Mod/Cons/Lib; ≥20 yrs apart; someone >50;
  someone <60; incumbent same-ticket; one member out-of-office "outsider"; one
  Big-State + one Small-State; different regions; **plus an obscure-VP d6 reveal
  table**. Higher-scoring ticket's party → +1 Party Pref.
- **Platform = 5 planks** (Domestic / Foreign / Economic / Judicial / Executive),
  each a catalog bill/policy. **Iron-Fist nominee cannot delegate the platform**
  (POST 371); else delegable to faction-mates. Scored by 3 binary checks (party
  out-gains the other? lowest faction out-scores theirs? nominee's own ideology
  scores most?) → up to 3 pts; negative-scoring ideologies drift toward the other
  party; best platform → +1 Party Pref.
- **Keynote Speaker** chosen by a faction; Orator adds to a d6 effect roll.
- **CPU delegate engine** (POST 2240, literal console dump): configurable party /
  eligible-faction-by-ideology / **4 or 5 categories** / per-state office-control
  toggle. Output per state: EVs, Category (1–5), Bias (−5..+5), Control, Ideo,
  **Delegates ≈ EV × category multiplier** (Cat1≈×1 … Cat5≈×4 for friendly
  states). 53 states totaling **1,300 delegates, majority 651**.

### General election (POST 400-438, 1726-1749)

- **Third-party challenge** (NEW rule, POST 400): triggers if **Party Pref sits
  in the middle 3 boxes** AND an ideology is "discontented with both parties"
  (sits Neutral). The **discontented faction of the incumbent's party** runs 3rd-
  party (randomize if multiple); special carve-out: if it's the *president's own*
  ideology that's discontent, the lowest-scoring faction of his party runs even if
  happy. A **Celebrity** 3rd-party candidate appears on the ballot nationwide.
- **General-Election Action library** (POST 412, 1727; usually 2 rounds): Give a
  Speech (Orator double-roll for state + party pref; Incoherent risks −1),
  **Incumbent Using Power of Office** (5-6 → +1 Party Pref — repeatedly decisive,
  POST 1068), Help from the Media (LW/RW Media card: 6 → ally enthusiasm, 1 → −1
  party pref), **Send VP to Shore Up Support** (region-targeted, trait-branched:
  Likable/Harmonious/Unlikable/Disharmonious/Provincial/Cosmopolitan; **Delegator**
  pres can send VP anywhere), President Focuses on a Region.
- **3 Presidential Debates + 1 VP Debate** (Debater +2, Leadership/Charisma +1,
  Orator/Manipulative/Egghead rolls; winner moves Party Pref ±1); **per-debate
  Scandal Rolls**; incumbent may **kill the debates** (1-2 penalty roll) or both
  agree to skip.
- **Failed-platform penalty** (POST 1728): if the incumbent completed **<50% of
  his prior-term planks**, 25% each of party-wide enthusiasm drop + party-pref
  drop ("Only 2 of 5 planks completed" hit Cochran).
- **October Surprise** (POST 423, 1739): random table; **only bites if an active
  crisis** (or a regional disaster) — Party Pref ±1 + regional ±1; Incompetent
  can't handle it well.
- **State of the Meters** → EV tally with **tie-breakers for close states**;
  **faithless electors** rolled (POST 428: 3 faithless, 2 CA + 1 ME, stray EVs to
  off-ticket pols); a per-state **popular-vote % "Election Atlas"** + national
  totals is hand-produced (POST 438, 1082, 1749). Defeated VP/Pres carry a **−1
  next-election malus** (POST 438, 459).

Results across the window: 2008 **Cochran (R) 563 / Cuomo 143** (incumbent who
swept all 53 four years earlier loses after crashing the economy — meter→election
in action); 2012 **Cochran 432 / Franken 246**; 2016 **Kirk (D) 678–0** over a
3-term Cochran sunk by accumulated penalties (lost Iron Fist, 3rd-term, failed
planks, scandals, the Grenada loss).

---

## Legislative subsystem (2.6.x) — modern depth

- **Proposer slots:** each chamber leader's faction lists **Senate Proposers** +
  **House Proposers** (named pols), each proposing/repealing one bill, plus
  **cabinet proposers** (below).
- **Executive Branch Interference** (POST 32, 1281, 1982): cabinet members with
  **Admin 4-5 (or Crisis-Admin in a relevant crisis in-department)** can propose
  department-related legislation, subject to presidential assent. **NEW cabinet-
  department bills spawn a new Cabinet Sec** (POST 2038 Dept of Manufacturing →
  filled POST 2182).
- **4 committees** per chamber: **Domestic / Foreign / Economic / Judicial**.
  Committee chair may **Block and/or Replace** a starred bill (POST 46, 285, 1312)
  — Block kills it; some bills can't be blocked. **CPU committee auto-fill** rule
  (POST 2148): keep current members, even out new, Ranking→Chair.
- **Bill tags:** `*Crisis Bill*` and `**Spending Bill**` (independent; a bill can
  be both, POST 46). **Crisis bills** resolve crises, are worth more, and
  **bypass the spending cap**.
- **Spending cap:** "only N spending bills can pass" during a budget crisis
  (observed "3", POST 32, 92); ordering matters; floor-passed bills can be
  **BLOCKED DUE TO BUDGET**.
- **Bill-relationship graph:** bills carry replace/repeal constraints — "Not
  repealable", "can only be replaced by X" (POST 284: min-wage tied to inflation
  ⇒ only Living Wage replaces it), and **constitutional-amendment-tier** bills
  "can only be removed via amendment" (POST 2265-2268 REPEAL Protect Gay
  Marriage). Some passed-once policies are downgrade-only.
- **Packaging** (POST 60, 297, 1327, 2004): a chair bundles passing committee
  bills into one floor unit (S.n / H.R.n) voted as one; **packages can't be split-
  voted** (POST 1341). Used as a weapon — pairing a poison-pill with a desired
  bill so both die (POST 297).
- **Two-chamber floor vote** at full modern scale: **House 572-601 seats**, Senate
  **106** (53 states). Bicameral, each bill numbered.
- **Debate swaying** (POST 91, 1345, 2026): pols with **Orator/Debater** each roll
  to sway one bill; net successes flip/pad close floor votes (flipped failing
  bills to passing and vice-versa). **Not on judicial confirmations** (POST 1418,
  "removed a while back").
- **Filibuster + cloture** (POST 72-91, 1355, 1598, 2015): a Senator with
  **Puritan + Legislative >1** filibusters a passing bill (**not a roll** — you
  qualify or you don't); **Disharmonious** allows filibustering **twice**. SML
  calls **Cloture**; **cloture needs 67%** (ties sustain the filibuster). Filibustered
  bills carry to the next session.
- **Investigation bills** (POST 1369, "Investigate Lobby or Special Interest"):
  forms a **special investigation committee** (special chair + ranking + members)
  that **rolls** for evidence; the target is a member of the **dominant party**
  (not the proposer's). Came back "no charges." **Rules invented mid-game by a
  player** (see house rules).
- **Veto / override / signing:** Pres signs/vetoes; **override needs 2/3** (POST
  942 a Soft-Drink-Tax veto override failed 326-276). **Harmonious president auto-
  signs all bipartisan-supported bills** (POST 1618).
- **Scoring** (POST 95, 316, 1373, 2038): each passed **and failed** bill awards
  ideology/lobby/interest/industry-state points + meter moves + **±1 to specific
  named pols' reelection**, then triggers the 4-part enthusiasm reshuffle.
- **Amendments:** need **2/3 of the House** (382/572; POST 1597) + supermajority
  Senate, then go to **governors for ratification** next gov phase (see Governors).

---

## SCOTUS subsystem (2.5.3 + 2.8.2)

- **Named-Justice docket:** real cases run per term; each Justice votes Yea/Nay
  **by name and ideology** (POST 30, 277, 898, 1280, 1558, 2250). Outcomes are
  steered to/away from history and flagged **AHISTORICAL** (NAACP v. Claiborne,
  Kennedy v. LA, Thompson v. OK, Atkins v. VA, Janus, **Dobbs v. Jackson** →
  6-3). **Chief Justice may attempt to delay** a case (POST 30).
- **Iron-Fist / Manipulative president compels Justices** to **switch their vote**
  (POST 30 Sestak Nay→Yea; POST 1280 compels 3 at once; POST 2250 Kirk→Sestak ⇒
  Dobbs 6-3).
- **Compelled retirements** (2.8.2): president can **compel a same-party** (or, if
  Manipulative, opposing-party) Justice to retire — separate rolls for "retire
  from court" vs "retire from game" (POST 105, 730, 957, 2046). **A Justice can't
  retire before 12 years on the court** unless leaving for another office (POST
  2054 GM ruling). **Conditional retirement bargaining**: a Justice offers to step
  down only if a named replacement is confirmed (POST 324).
- **Dynamic court size + court-packing:** a "appoint an extra Justice whenever an
  incumbent reaches 70" packing bill was in effect, then **repealed in-session**
  (target size 10; POST 105-113, 330, 911, 944). If the court is ≥ target, a 70+
  retirement **shrinks** the court rather than creating a vacancy (POST 738).
  Bills exist to **set the number of Justices** (POST 279, "Set Number of SC
  Justices to 5").
- **Confirmation:** committee then floor, **needs 64 / 60%** (POST 974, 1401-1421,
  1625). **Failed nominee ⇒ replacement must be moderate / other party's ideology
  / other-party member, and is auto-confirmed.** Trait swaying applies (Harmonious
  aye; Integrity supports Integrity) but **no Orator/Debater shenanigans**.
- **Appointee ideology reveal:** a new Justice's *true* ideology is **discovered on
  joining** via roll (POST 113 LW-Pop not Prog; 339 Mukasey Liberal not Mod; 1418
  Lemley Cons not Mod). **After 10 years a Justice can shift ideology** (POST 1558
  Prog→Lib; 2250 Sestak Cons→Mod).
- **SCOTUS rulings deactivate now-unconstitutional laws** (POST 31 the death-
  penalty case deactivates "Set Punishment … to Death"). House-rule gap: bills
  tied to a court-disabled policy **should** auto-deactivate but don't (POST 1293).

---

## Executive, cabinet, diplomacy, war

### Executive Actions (2.8.1) — POST 100-104, 321, 728, 955, 1382, 2043

Pres takes **N actions/half-term** (4 standard; **Efficient + Domestic Warrior →
a 5th if domestic**; **Easily Overwhelmed** hands off). **Persistent active
actions** on the sheet are color-coded (green = active/deactivatable; yellow =
auto-deactivates on party change; white = inactive). Large era-specific library
(Fed-interest-rate adjustment — GM-flagged for a missing per-turn limit, POST 323;
Offshore Drilling; New-Age Fireside Chat; Drone Warfare; Family Separation;
Internationalist Foreign Policy; Emergency Loans to Mexico/SE Asia; Pro-Labor over
Business…). Many are **gated** (POST 729 Strict Immigration needs a prerequisite
policy; POST 1390 "Ban Foreign Aid from Nations Not of Our Beliefs" needs an
authoritarian government). Actions are **implemented via skill rolls + blunder
rolls** that a high-**Command** pres with relevant experience can re-roll to avoid;
a **Controversial pres rolling a blunder triggers a scandal ⇒ −1 next Pres
election** (POST 1624). +20% implementation bonus for trait **Geostrategist** (POST
877). Difficulty tiers Easy/Mod/Difficult.

### Cabinet (2.3.1) — POST 214-229, 587-605, 840-871, 1499-1513, 1903-1924, 2172-2182

Full ~30+ seat cabinet (15 depts + CIA/FBI/UN/Fed/CJCS/NSA/Key Advisor + 8
ambassadors + **military leadership**: Army Chief, Chief of Naval Ops, Generals,
Admirals). **5 may be retained** each term; **CIA/FBI don't count toward the 5**.
Constraints: **Incompetent bars cabinet service** (POST 843); a general can't be
made an admiral (POST 848, 1386); **Egghead cabinet members advise** decisions a
Pliable/Passive pres follows by **majority** (POST 6-9, 257). Officers gain
**experience tags** by serving (POST 857). Tenure rules: **CIA** removable at
appointment at **25% −mil-prep** unless incompetent/easily-overwhelmed/over-70;
**FBI** has a fixed **10-year term** (fireable; reappoint 10% +dom-stab / 10%
−honest-gov); **Fed Chair** fixed multi-year term + cabinet-service cap; **Key
Advisor** locked for the half-term. **Confirmation:** committee then floor;
opposing-party cabinet count is **capped** (Republicans "maxed at 3"); **military
is auto-confirmed** (POST 2176). **Failed nominee** banned from cabinet/cabinet-
level forever (can still try Ambassador) + −1 all future elections; the Senate is
**blamed** ⇒ Party Pref −1 + nay-voters 20% gain Integrity/Controversial.
**Recovery:** SML offers **5 names** for the seat, nominator picks one,
**auto-confirmed** (must meet reqs + cap). **Scoring penalties** (POST 229, 604,
1223, 1512): cabinet-experience bonus to Pres, **but** −1000/−500 for **not
balancing positions across the president's allied factions** (intra-party equity)
**and** a **diversity floor** ("≥25% women/minorities" avoids penalty). Officers
passed over for promotion may **resign** (POST 1512).

### Diplomacy (2.7.1) — POST 97-99, 318, 723, 946, 1375, 2040

Per-ambassador, rolled by Admin: **Increase Relations** (±1); **Increase Trade
Relations** (≥neutral; 5-6 → +Rev/Bud, 1-2 → −); **Take a Loan / Extend Credit**
(Rev/Bud balanced-or-under + ≥neutral relations; success +1 Rev/Bud or EconStab +
adjusts the numeric debt); **Provoke w/ retaliatory tariff/embargo** (needs
Congress **until the President is granted full tariff powers**; ≤neutral relations;
−1 relation + **1-2 die chance of WAR**).

### War (2.7.2) — POST 949-952, 1378

Resolved as **naval then land battles** (need ≥1 naval win before land). Per
battle **Chance of Success** = Difficulty + (SecDef + Joint-Chiefs ratings ×2) +
leading officer rating (×10; a 5-skill general = +50) + **Military Preparedness
+25** + benchmarks → d100. **War Score** accumulates (win +1, lose −3); a losing
officer can gain **Incompetent** + be relieved (Sec makes battlefield promotions
to backfill); a winning officer +1 skill. **Momentum** = this turn vs last.
**War-end check:** total War Score × an **end multiplier (×2.0)** = % chance to
lose the war outright. Iron-Fist pres may **fire generals before war** (20% each
of −1 mil-prep). The US **lost the Invasion of Grenada** (POST 1378) → peace
"Agreement at St. George's" debuff: −pts, Party Pref −3, **permanent −1 in
elections** for the pres, applied via a blunder-roll.

### Tariff as national policy (POST 97, 316, 535, 2258)

Tariff = a **single national integer** set/changed by legislation ("Set average
tariff rate to 20%"). **"Grant the President power to negotiate/set tariff"** is an
unlockable exec power (since "Reciprocal Tariff Act" re-passage ⇒ **no legislative
tariff bills**, POST 2258); **repealing it forces a tariff bill next session**
(POST 316). There is a change-cooldown ("can't propose what we just repealed
unless a chamber changed", POST 646).

---

## Governor / state-policy layer (2.5.2) + apportionment

- **Each governor takes Gov-ability actions** (Efficient grants +1 action),
  success rolled vs ~ ability×20, against a deep library: improve/burgeon
  industries; raise/lower taxes; **Gerrymander; Build/Dismantle Political Machine;
  Purge Voter Rolls / Strict Voter ID / Decrease Polling Stations / Literacy
  Test** (all **blocked while Honest-Gov't maxed**, POST 1962); **Split Electoral
  Votes**; **State Primary Placement (Group N)** (sets which primary group a state
  votes in); Sanctuary Cities (needs same-party Senator); Civil-Rights Protections;
  Ban Teaching of Evolution; Trad textbooks; Arm Teachers; term-limit changes;
  Remove age restrictions; Fill State Offices with Loyalists; Use Office to Praise
  Incumbent President (gives reelection bonus). Success can grant a Gov **+1
  Command** (POST 26).
- **Persistent state fields:** a state has a partisan **Bias** integer
  ("Red+3"/"Tossup"/"Blue+5") shifted by events (POST 613, 2222 "State Bias +1
  toward RW-Pop party") and a persistent **ideological "loyalist fill"** that
  **gates gov-action success** (POST 25-26 Barrasso fails because the state is
  filled with Cons loyalists; POST 2245 a non-Mod Gov fails an industry action).
- **Amendment ratification by GOVERNORS:** each state's gov votes; threshold is a
  **fixed state count = 40 of 53** (POST 29 Two-Term-Limit fails 39/40; POST 1278
  Voting-Age-18 fails 31; POST 938, 944). **Grandfather clause** ("would not apply
  to the current Pres", POST 15). **NB:** a presidential two-term limit **does not
  exist** in this timeline until ratified — it was still being debated in 2008.
- **State industry economy:** per-state + per-region industries (**Agriculture,
  Alt Energy, Maritime, Mining, Finance, Manufacturing, High Tech, Natural Gas**);
  the national **leader per industry** awards points to that state's Gov/Sens at
  half-term close (POST 13, 619, 1960). Events shift leadership regionally (POST
  1224 "Manufacturing declines by 2 in the Midwest").
- **Modern apportionment / Census:** decennial Census recomputes EV apportionment
  under a **Wyoming Rule** (POST 185, 870, 964: total EVs dropped 706→678), resets
  every state's Bias, and adds/removes a state's **"focus Rep"** House seat.
  Wyoming-Rule apportionment **ballooned the House to 601 seats** (POST 185, 420)
  — later cited as 572 (POST 1281); Senate = **106**.

---

## Politician lifecycle & progression (2.1.x, 2.4.1)

- **Draft (2.1.1):** snake/list draft of a class; **draft order = reverse score**
  (worst faction first, POST 456); **draft-pick bonuses** (1st pick +1 Judicial or
  Admin, 2nd +1 Legis/Military — varies by year); some rookies gain a trait or an
  **alt-state** add (a pol can have **two home states**, POST 462, 495, 1785 "AOC
  (NY) adds CO"). Drafting a player/donor avatar pol can require a **% success
  roll** (POST 1782, 1789).
- **Career Track (2.1.2):** rookies placed on **7 sectors** — Private, Military,
  State Judicial, State Governing (Exec), State Legislative, State Admin, Backroom.
  Some adds need a **roll to join**. **Auto-removal/graduation at 20 years** (early
  exits at 12/16) grants a big sector-keyed skill/trait/expertise payout (POST 490
  Military track auto-grants **Leadership** after 20 yrs; POST 1802 +3 Judicial +
  Justice + traits). The off-screen talent pipeline feeding the draft.
- **2.1.3 Remove Flip-Flopper Penalty**, **2.1.4 Relocate** (max **4** attempted
  moves/half-term; **alt-state moves don't count**; same-region overpop→underpop
  rolled vs 25/50; over→under success can grant **Carpetbagger**), **2.1.5
  Ideology Shifts** (base **3**; +2 Iron Fist, +1 Propagandist, +1 Manipulative,
  +2 party leader; cap **9**; rolled; fail/success can add Flip-flopper/Pliable, a
  2nd fail adds Two-faced; **Puritan can't be shifted**; **Integrity** lowers the
  chance; RW-Pop↔LW-Pop "horseshoe" allowed).
- **2.1.6 Conversions:** "disgruntled" pols gain **Can Party Flip** / auto-flip;
  **only Party Leaders** convert **opposing-party** members marked Party-Flipping;
  **Party or Faction Leaders** poach **same-party other-faction** pols if target
  is **Pliable + same/adjacent ideology** (10% Pliable / 5% Mod / 15% both);
  congressional & faction leaders **can't be targeted**; factions with **maxed
  enthusiasm are immune** (POST 1169).
- **2.1.7 Kingmakers & Proteges:** one new pairing/half-term; **max 5 active**
  (more only if the leader has Leadership); **Master Kingmaker** can pair any
  same-ideology pol regardless of state; payout = expertise tags + skill/Command
  bumps; **President/VP/Speaker/SML/Justices can't be proteges** (POST 192).
- **2.1.8 Determine Faction Personalities:** add/lose interest/lobby/ideology
  cards each half-term (POST 530, 1468, 1845); the **card count per ideology/
  interest rescales at era boundaries** (POST 1172).
- **2.4.1 Random Death/Retirement:** deaths cite **age + cause** ("at 79 from
  diabetes"); **75+ forced retirees** (LBJ removed at 100); **defeated incumbents
  auto-retire only if they ran** (POST 459); **Old-Age Rolls** drop a skill −1 or
  add Pliable/Passive/Easily-Overwhelmed/Uncharismatic/Frail **or strip a trait**
  (a pres lost **Iron Fist** to old age, POST 1433). Vacancies → **governor
  appoints** a replacement Sen/Rep (a Manipulative gov can **appoint himself**,
  POST 2193); **Lt Gov auto-succeeds** to Gov (+2 Gov after 12 yrs on track).

### Leadership pipeline (2.2.x)

- **2.2.1 Congressional Leadership:** Speaker, House/Senate Maj+Min Leaders +
  Whips, **Pres Pro Tempore** (auto-assigned by seniority, POST 2125). **Majority
  leadership of the dominant party is uncontestable; the minority side can be
  challenged by Mod factions** (POST 1860); resolved by **weighted vote**; roles
  grant points + traits (Speaker +1 Legis; Maj Ldr Propagandist). **Committee
  chair eligibility requires Leadership OR Legis ≥ 2** (POST 1870, 2149).
- **2.2.3 Faction Leaders:** pick/retain (often forced — "your only option"); on
  (re)select gains random traits/skills; optional **faction rename** from a fixed
  menu (POST 1890, 2163). Leader **must hold one of the faction's cards** (POST
  831, 1202).
- **2.2.4 Party Leaders:** elected by **ranked/weighted faction-leader vote** with
  RCV runoff (POST 582-586, 1497). **Easily Overwhelmed disqualifies** (POST
  1897). Winner gains **Kingmaker + Iron Fist** + **+3 in Gov/Sen/Rep primaries
  while PL** (POST 1902); triggers matching-ideology **"Lackeys" flipping to the
  PL's faction** + enthusiasm/Party-Pref shifts. **Long PL tenure → Party Pref
  drift** (POST 1498, "6th term ⇒ −1", cancellable by Likable). **Iron-Fist leader
  may share one card with allies** (except Puritan-led allies, POST 586, 1902).

---

## Era content (events, anytime events)

- **2.4.3 EraEvos** — dated, scripted modern events with A/B/(C) presidential
  responses (Egghead cabinet advises; implemented by Sec State / Amb via Admin
  roll), interest-group point swings, enthusiasm/EV/Census effects, and a chance
  of war. Seen across 2004-2020: TPP, NAFTA, SORT, ABM/INF treaties, Iran Hostage
  Crisis, Enron, **Subprime Mortgage Crisis** (A=bailout ⇒ pro-Wall-St bills 2×
  next session), Climate Change Crisis, Crack/Crime, AIDS Relief to Africa, Brexit,
  Rise of Social Media (+High Tech), Income Inequality Crisis (Living-Wage bill
  2×), North Korea missile, Uyghur Genocide (sanctions vs ignore), regional EV/
  Census shifts (Katrina LA −1 EV; Anchorage AK +1; Ohio's influence waning),
  Gorbachev, Xi, plus flavor cards that still award points (Hulk Hogan/Al
  Franken/Elon Musk gain Celebrity).
- **2.4.2 AnytimeEvos** — random per-pol/national events: trait grants (Orator/
  Debater/Controversial/Command — **score-targeted**, e.g. "highest-score Red pol
  gains Controversial"), ±1 skill, ability decreases, **Urban/Race Riots** (DomStab
  −1; Nat'l Guard vs let-states), disasters (relief costs Rev/Bud −1, grants the
  pres +1 in that state), **Scandalous President** (−1 all future elections;
  refuse/resign), **Cyber Attack** (Mil Prep −1), Business Speculation (EconStab →
  Booming).

---

## GM house rules / design holes (flag clearly)

- **Filibustered "MUST-pass" bill — no rules remedy (CONFIRMED rules gap, GM-flagged).**
  The GM can declare a bill **"MUST pass"** (e.g. a required tariff each session,
  POST 640). When the required tariff bill was **filibustered to death**, the
  rulebook had **no remedy**; the GM **improvised** a "special committee" of the 4
  congressional leaders who must agree on a tariff that auto-passes, dropping
  EconStab + applying election penalties **per day until they agree** ("AMPU
  government shutdown"; settled at 19% with side conditions). **Explicitly flagged
  by the GM as a genuine rules gap to fix** (POST 696, 711, 716).
- **Investigation committees — under-designed.** The designer **never wrote rules**
  for the new "Investigate Lobby/Special Interest" bills; **player @10centjimmy
  authored them mid-game** (target the dominant party, special committee rolls for
  evidence) (POST 1294, 1369-1372).
- **Executive Branch Interference — under-designed.** The cabinet-proposed-bill
  rules were thin/blank and worked out in play (POST 1281, 1296).
- **"Increase Welfare Benefits" is replaceable-only but its mandated replacement
  bill was never authored** → GM to create "Cuts to Welfare Benefits" (POST 1304,
  1326).
- **Honest-Gov't meter level-9 reword** — ambiguity (does max level *require* zero
  machines/gerrymanders, or merely *prevent new ones*?) reworded to "Cannot create
  …", **adopted across all era playtests** (POST 1246-1262). Related: meter text
  says "Corruption" but the matching trait is "Controversial" — master sheet to be
  corrected (POST 1263-1265).
- **Bills tied to a court-disabled policy should auto-deactivate but don't** (POST
  1293, 1297).
- **Era-event deck appears decoupled from the literal year (POSSIBLE BUG).** In the
  ~2018 turn the deck pulled **2008-era cards** (Subprime crisis, ABM/INF
  treaties) — bug, backlog, or intended shuffle is unclear (POST 2221). *Reported,
  not verified.*
- **Fed-interest-rate exec action has no per-turn limit** (GM wants one, POST 323).
- Misc GM rulings (provenance): age-eligibility enforced (27 too young, POST 1229);
  term-limited govs can't re-run (POST 1751); a Justice can't retire before 12 yrs
  (POST 2054); packages can't be split-voted (POST 1341); no Orator/Debater
  swaying on judicial confirmations (POST 1418).

---

## Data-model / UX signals (hard requirements)

- **The real-person dataset RUNS OUT in the deep-modern era ⇒ mandatory procedural
  politician generation.** "Beginning with the next draft we will start generating
  rookie pols" (POST 456); the Era-of-Populism draft class is **procedurally
  generated** (POST 1771). GM hand-rolled traits/demographics for a ~188-pol class
  and **asked for a script to ease generation** (POST 1088-1101). Players disliked
  the generator's silly **non-Western names** (Cookiebottoms, Sarcasm Ikeda) →
  **product signal: the name generator must produce plausible, ethnically varied
  names and be toggleable** (POST 1159, 1090). A supplemental real-Gen-Z/donor DB
  was offered as filler (POST 460-468, 1161). **Links to the A-series
  presentation/portrait deltas** (the long tail needs procedural portraits too).
- **Wyoming-Rule House bloat (→601 seats) made manual House/committee staffing so
  tedious a player QUIT over it.** The RepElections tab is **wiped every cycle**;
  "running the same House candidates every time is the only thing that keeps this
  phase from being a nightmare"; players keep **companion files** (POST 115, 185,
  420-421; player Vee01 dropped, POST 419). **Hard requirement: persist + auto-fill
  House candidate slates and committee rosters across cycles.**
- **Factions are transferable between humans**; CPU bridges absent players; a new
  player can take a CPU faction and **win the presidency days after joining** (POST
  424, 444, 456; new players onboarded mid-campaign throughout). Confirms the
  multiplayer seat model with CPU as a true per-faction fallback.
- **Heavy manual dice / sheet bookkeeping** is exactly what the computer build
  automates ("processing power of a computer who can do it in seconds", POST 696).

---

## Corroborations of prior-thread deltas (dedup at reduce — strengthen, don't double-count)

This thread independently re-observes, in the **modern (2004-2020)** era, deltas
already logged from `gilded`/`fed`/`1772s`. For each, the reduce pass should add
"modern" evidence and bump confidence to **corroborated across 3-4 eras** rather
than add a new row:

- Multiplayer (5 Blue + 5 Red, CPU fallback, handles, GM narration) — POST 1, 7.
- Continuous multi-era campaign + per-era card/event rescale + era-end point
  awards — POST 1, 1080, 1172.
- Committee **block-and-replace** — POST 46, 285, 1312.
- Bill **packaging** — POST 60, 297, 2004.
- **Filibuster** (Puritan-gated) + **cloture** (67%) — POST 72-91, 1355, 1598.
- **Crisis Bills** + crisis state (bypass spending cap; collective-accountability
  penalty if a chamber lets most die) — POST 32, 46, 943, 1597, 2015.
- **Spending cap / numeric budget** — POST 32, 92, 99, 1537.
- Bill scoring uses **all faction cards** + failed bills score — POST 95, 1373.
- **Convention machinery** (delegates, momentum, promises, host-sets-delegates,
  keynote) — POST 14, 340-398, 2240.
- **Platform = 5 planks** + scoring + delegation — POST 367-398, 1712.
- **VP impact** checklist + reveal — POST 369, 1711.
- **General-election action library** + scandal rolls + **meters→election** mapping
  — POST 412, 114, 1727.
- **Faithless electors** — POST 428.
- **Egghead cabinet advisory + multi-decider + implementation/blunder rolls** —
  POST 6-9, 257, 877, 956.
- **Executive Actions library** + persistent active-action state — POST 100-104,
  2043.
- **Cabinet regional penalty** (extended: + diversity + intra-party equity) — POST
  229, 604, 1223.
- **Firing/tenure constraints** on officers (CIA/FBI/Fed) — POST 587, 1903.
- **Governor's actions library** + state-policy flags — POST 17-28, 1962, 2234.
- **Per-power foreign-relations meters** (now 8 powers, +Israel) — POST 12, 618.
- **Diplomacy actions** (relations/trade/loan) — POST 97, 1375, 2040.
- **Numeric national budget/debt** — POST 99, 1537.
- **Generic war system** (success-chance formula, warscore/momentum/×2) — POST
  949-952, 1378.
- **Constitutional Amendments as durable, separately-ratified state** (now: by
  governors, 40/53, 2/3-House) — POST 15-29, 938, 1278, 1597.
- **Census-driven EV changes** (+ Wyoming Rule, focus-rep, State Bias) — POST 870,
  964.
- **Faction nicknames / relabel table** — POST 134, 1890, 2163.
- **Stat decay + trait gain/loss at old age** — POST 132, 1433.
- **Defeated-incumbent auto-retire** (only if ran) — POST 132, 459.
- **Auto-Carpetbagger on alt-state moves** — POST 147, 1814.
- **Congressional leadership pipeline + RCV + committee-eligibility** — POST 167,
  1860, 1870.
- **Faction-leader 6-criterion filter / anointment** — POST 133, 1873.
- **Party-Leader incumbency fatigue + on-elect effects** — POST 213, 1498, 1902.
- **Faction Personalities card-distribution + drift** — POST 165, 530, 1468.
- **Bill-driven statehood / auto-generate officials for sparse states** — links to
  the dataset-exhaustion signal (procedural generation), POST 456, 1771.
- **Era-specific ideology drafting profile** — modern class skews differently;
  vcczar wanted "some moderates" in the generated class (POST 460, 1088).

---

## Open questions (for the human / roadmap)

- **Spending-cap derivation:** is "3 spending bills" meter-derived or fixed per
  crisis? (POST 32, 92)
- **Amendment threshold reconciliation:** modern = flat **40/53 governors**;
  `fed`/`gilded` showed unanimity / "2/3 of states." Is the threshold era-
  dependent or a per-amendment field?
- **Cloture exact %:** observed ~67% (ties sustain) — confirm.
- **Candidate "Strength" formula** + **delegate allocation method** per group
  (mix of WTA + proportional; the CPU engine uses EV × category multiplier).
- **Procedural rookie generation:** what stat/ideology/trait distribution should
  generated modern rookies use? (links to the dataset pipeline + name generator
  toggle).
- **Two-home-state pols:** data-model needs ≥1 home state with an alt-state list
  (affects relocation/Carpetbagger + kingmaker chaining).
- **State `Bias` integer + ideological "loyalist fill"** as distinct persistent
  state fields (vs the planned `State.policies` flag).
- **Era-event deck year-gating:** is the 2008-cards-in-2018 behavior a bug?
- **Military-leadership ranks (JCS/Generals/Admirals)** + auto-confirm + promotion
  back-fill — modeled in the build?
- **Constitutional-amendment-tier legislation** (repeal-only-by-amendment) — in
  build?
- **House size:** 601 (Wyoming-Rule) vs 572 cited — confirm modern apportionment
  the build should model; Senate = 106.
