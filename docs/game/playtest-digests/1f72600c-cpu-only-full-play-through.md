# Digest — `cpufull` (1f72600c): "CPU Only Full Play Through"

> **Batch 21.** 74 posts / 1 chunk. An **all-CPU 1772 founding run** GM'd by
> **@Arkansas Progressive** + **@0ccultist** + **@Willthescout7** (GA-level, not
> designer-authoritative) — "an only CPU play test to **watch and see what the CPU
> can do, and if it can create a better union**" (POST 1). 10 CPU factions
> (5 Blue Patriots / 5 Red Patriots), founding polarity (both parties are *Patriots*;
> Blue = Sons-of-Liberty/Clinton/Gerry/Dickinson/Jefferson, Red = Ellsworth/Adams/
> Franklin/Washington/Laurens). Runs **~1772 → ~1780** (3 Continental-Congress cycles
> + the Revolutionary War) and ends on a **scripted GAME OVER** — the CPU Continental
> Congress **voted to accept the Carlisle Peace Commission** (rejoin Britain with
> Parliamentary representation), ending the game. **★ "The first playthrough in
> testing history to actually reach a scripted ending"** (Ted, POST 73). The predecessor
> of the `oopscpu` Ted-run all-CPU stress-test; same family as `drums`/`tea1772`. Its
> load-bearing value is **corroborative of the CPU suite (#70–#79)** + a clean second
> instance of the **CPU-leans-toward-peace/game-over** failure (#158).

## What this thread is

Another **all-CPU founding traversal** (humans drive the engine "by the rules," not as
players) — the third such 1772-era capture after `tea1772` (solo all-CPU) and `oopscpu`
(Ted's deliberate stress-test), and the family of `drums` (all-CPU 1841→1924). It runs the
1772/1774/1776 Continental Congress cycles + the Revolutionary War cleanly, then **dies to
a CPU vote** for a game-ending peace. Because it is GA-run (not Ted-run) it is **not
designer-authoritative**, but it independently re-validates the same CPU-decision-making
cluster `oopscpu` was built to interrogate, and it is the **canonical demonstration of the
#158 problem** (CPUs vote for game-over by point-math) — which is exactly why Ted later
patched the "CPUs oppose game-over 75%" rule. This thread shows the patch is needed: a
**75%-vote-no rule was applied here and the game STILL ended** because four factions rolled
under the threshold.

## The CPU game-over (the headline finding)

- **Carlisle Peace Commission (1778-80, scripted)** offered home rule + Parliamentary
  representation in exchange for surrendering independence (POST 62). CC President John Adams
  chose to **reject** it, but the Continental Congress **overrode** him on a **4-5-4 vote**
  → the other option (accept) auto-adopted → **"GAME OVER. [Game ends with colonial
  representation in Parliament.]"** (POST 62-63).
- **★ The CPU had a 75%-vote-NO rule and it STILL passed:** "Don't AI now generally always
  avoid game overs?" → "75% to vote no, but **four factions triggered it**" — "two factions
  rolled 1/100 and two others rolled 9/100 meeting the **≤25 roll to support it**" (POST
  64-68). So the existing 75%-oppose rule (the same one Ted floated in `ted1772` #158) does
  **not** reliably prevent a solo/all-CPU game-over — a clean live counter-example.
- This is the **second corroboration of #158** (after `ted1772`'s Carlisle/Conciliatory
  near-misses): CPUs weight game-ending peace by point-math, not "keep the game alive."
  Note `ted1772`'s near-misses were saved by the **2/3 Articles threshold**; here the
  game-over option needed only a plurality after the Pres's choice was rejected, so it
  passed at 4-5-4. (Players: "Lame… can we just ignore this and continue?" POST 74 — the
  frustration Ted predicted.)

## CPU behavior observed (corroborates the #70–#79 suite)

| Decision | What the CPU did | Maps to |
|---|---|---|
| **CC President election** | "Red4 has the most elected members, they choose (25%) to **elect the lowest-scoring faction**" → tiebreak → Ellsworth (Red1) elected, +50 pts (POST 15). Later: CC President = faction with most congressmen (POST 31) | CORROBORATES **#72** (CPU candidate selection; lowest-scoring-faction 25% rule) |
| **Committee chairs/members by faction strength + expertise** | chairs assigned, members slotted by expertise (Education/Healthcare/Naval/Justice…) across both parties (POST 15-16) | CORROBORATES **#70** (CPU leadership/committee assignment) |
| **CPU bill proposals + committee votes + packaging** | delegates propose era-appropriate bills (Continental Army/Navy, privateers, punish-Loyalists); committee votes by ideology; **bills packaged then floor-voted** (Lee's Resolution + Invade-Canada + Ban-Canada-trade bundled, POST 22-23, 41-42) | CORROBORATES **#70/#9/#74** (CPU propose/committee-vote/packaging) |
| **CPU votes on bills by cross-party damage math** | "Blues vote against… as it makes the biggest loss. **Reds support because it hurts blues more than reds**" (Declaration of Resolves, POST 19) | CORROBORATES **#74/DH-21** (theme-blind point-math; vote-to-damage-other-party) |
| **CPU event decisions (CC President picks A/B, then Congress can override)** | CC President resolves decision-events (Conciliatory Resolution reject, Dunmore's Proclamation, Vermont) and the Congress can **override the President's pick** (POST 38, 62) — the same override mechanic that produced the game-over | CORROBORATES **#75** (CPU event-vote) |
| **CPU enthusiasm shifts (most/least-gained faction)** | "Red5 gained most → Trad +1 Red; Red1 gained least → Lib +1 Blue; Blue4 gained most → Cons +1 Red; Blue1 gained least → LW Pop +2 Red" (POST 25) | CORROBORATES **#108** (enthusiasm-gated one-directional disgruntled drift) |
| **CPU faction conversions gated by traits** | "Franklin has Efficient → 1 extra attempt; Washington+Franklin Harmonious → won't attempt; Adams Predictable → can't convert Manipulative pols; **no cross-party conversions as no party leaders exist**" (POST 56) | CORROBORATES **#127/#76** (conversion gating + no-leader→no-conversion) |
| **CPU draft + career-track + kingmaker** | draft order by points; career-track entrants leave at **50%**; kingmakers pair within ideology, protégé gains skill+interest (POST 33-35, 55, 57) | CORROBORATES the draft/career/kingmaker passes (#86/#128) |
| **CPU relocations (region-roll)** | alt-state moves attempted; "John Hiester fails to move to GA" (POST 8); region-keyed | CORROBORATES **#38** relocation rolls |
| **Revolutionary War battle engine** | naval+ground battles, **Success% = Planning + Officer(Mil×10) + MilPrep + Benchmarks − Difficulty-deduction**, d100; **War Score** (win +1 / lose −1..−3), **Momentum** roll to continue (POST 27-30, 43-47); defeated general gains Incompetent + relieved (Artemas Ward fired → St. Clair Chief of Armies, POST 47) | CORROBORATES **#45** (war success-chance formula + warscore/momentum + officer-relief cascade) |
| **VP-style succession not reached** | game ended in 1780 before a presidency formed (Continental-Congress era only — no conventions, no SCOTUS) | NOTE: the convention/SCOTUS CPU AI (#71/#52) untested here (era predates them, as in `oopscpu`) |

## Alt-history beats

- **1772-74:** inaugural draft; leaders emerge; Continental Congress seated (no party
  majority); founding events fire (Gaspee Affair, Boston Tea Party, Tea Act, Committees of
  Correspondence) scoring LW/RW Pop + / Mods/Cons −; Declaration of Resolves adopted after
  the CC overrode Ellsworth's choice (POST 6, 14, 19).
- **1774-76:** Continental Army/Navy established; **Revolutionary War opens** (Concord &
  Lexington); first battles split (Crooked Billet win, Barbados/Monmouth loss → Momentum 0,
  war continues); 1774 CC election re-shuffles delegations (POST 22-31).
- **1776-78:** war momentum builds (Sag Harbor/Wall Street/Ticonderoga wins, Valley Forge
  loss → Momentum 2, **Canada Momentum 3**); St. Clair becomes Chief of the Armies; **a
  reader predicts St. Clair = "the Washington of this TL"** (POST 47-48); Conciliatory
  Resolution rejected; the 1776 CC passes Lee's Resolution + Invade-Canada package (POST
  33-47). Ted notes: in his own run (`ted1772`) **St. Clair did win the war + become
  President, then was forced to resign a year later** (POST 49-50) — cross-references #105
  (stat-collapse → forced resignation) and #158.
- **1778-80:** faction realignment, conversions, leaders re-emerge; deaths/retirements; the
  **Carlisle Peace Commission → CPU GAME OVER** (POST 56-63).

## Deltas vs. current build (gap-log additions/corroborations)

- **CORROBORATES the CPU suite #70–#79** end-to-end from a founding all-CPU run (CC
  president/leadership/committees #70/#72; bill propose+committee-vote+packaging #70/#9;
  vote-by-cross-party-damage #74; event-vote + Congress override #75; enthusiasm drift #108;
  conversion gating #127/#76; war engine #45) — a fourth-or-fifth independent angle on the
  cluster, alongside `drums`/`oopscpu`/`tea1772`/`ted1772`.
- **★ Second live corroboration of #158** (CPU leans toward peace/game-over): the all-CPU
  Continental Congress voted itself into a scripted GAME OVER via the Carlisle Peace
  Commission — **and the 75%-vote-no rule did not stop it** (4 factions rolled under ≤25,
  POST 64-68). Strong evidence the flat-75% patch is **insufficient**; the points-based
  anti-peace bias (or a hard floor) is the better fix. Bears on **#114** (solo-app is the
  target mode) + **#155** (RevWar winnability floor).
- **NEW (minor):** confirms a **scripted game-over event** exists in the 1772 content
  (Carlisle Peace Commission / Conciliatory Resolution "Game ends with colonial
  representation in Parliament") — corroborates the founding-era scripted-deck having
  game-ending branches (#109), the same pattern `terror2000` hit with its meter-driven
  game-over (the only other KB game-ending).
- No new bugs; GA-level, so all rulings are corroborative not authoritative.

## Open questions

- **Is the flat "CPU opposes game-over 75%" rule enough?** This run is direct evidence it
  is not (4/10 factions rolled under the threshold and the plurality carried after the
  Pres's reject was overridden). Should the rule be a **hard veto** of game-over options for
  CPUs in a solo game, or the points-based "make most ideologies oppose peace" bias Ted
  proposed in `ted1772` (#158)? Human/designer call.
- Should a **Pres's reject of a game-ending peace be over-rideable at a mere plurality**?
  Here a 4-5-4 vote (after the Pres rejected) ended the game; the `ted1772` near-misses
  survived only because of the 2/3 Articles threshold.

## Source

`cpufull` (1f72600c) "CPU Only Full Play Through" — 74 posts / 1 chunk; GA-run all-CPU
**1772-start** founding traversal (1772→~1780), ended on a scripted CPU GAME OVER (Carlisle
Peace Commission). Founding polarity (both parties Patriots). Cited `POST n` (the
`===== POST n =====` markers).
