# Digest — `oopscpu` (699113d6): "Oops, All CPUs — a 1788 test to fix CPU decision-making"

> **Batch 13.** 350 posts / 7 chunks. **Ted-run (`@MrPotatoTed`)** with co-GMs
> `@Umbrella`, `@Rezi`, `@Arkansas Progressive`. A **deliberate all-CPU
> stress-test from 1788** whose explicit purpose is to "really test out all the
> CPU rules — eliminating any vagueness, where 'human thought has to guide the
> CPU,' identifying things the CPU is not capable of — and fixing it" (POST 1, 5).
> 10 CPU factions (5 Blue Dem-Reps / 5 Red Federalists) play against themselves;
> humans control them "following CPU instructions to the letter, so we can figure
> out where the letters are insufficient." Because it is Ted-run, **GA rulings
> here carry Ted's designer authority** (same hierarchy as batch-12 `tedchange`:
> Ted > GA > inference). **The single most valuable batch in the KB for the CPU
> AI cluster (#70–#78) and the CpuController.** Polarity = founding alignment
> (BLUE = Dem-Reps / RED = Federalists), NOT the 1856 flip. Alt-history: AI
> peacefully **abolishes slavery by 1792** (POST 162-176), **Washington dies 1796
> of dysentery → VP Adams inherits** (POST 324-329). Thread runs ~1788→1798
> (≈3 half-terms) then peters out into Ted's sporadic-checkin pattern ("I'm
> currently between obsessions"; "1-30 business days"; "monthly check-in" — POST
> 312, 347-349) — it does NOT die, it just slows; an all-CPU game needs no
> players, so GM-burnout (DH-36) doesn't kill it.

## What this thread is

The first forum record that **systematically interrogates the CPU ruleset by
running every faction on CPU rules and flagging every spot where the rules are
vague, contradictory, or impossible without human judgment.** Unlike `drums`
(also all-CPU, but a long traversal where heuristics were observed in passing),
`oopscpu` is *designed to surface holes* — Ted repeatedly stops to log "Adding
this to the stuff to correct when I rework CPU rules" (POST 151), invents live
CPU rules mid-game (POST 192, 224, 264), and tags `@vcczar` on data/spec
ambiguities (POST 137, 334, 336). It corroborates the entire #70–#78 cluster
from a founding-era angle and adds several NEW CPU sub-rules. It also exercises
two long-standing Decision-gated forks: **all-CPU SCOTUS** (resolves the #52
player-vs-CPU split for the all-CPU case) and **CPU convention/leadership** (the
pre-12A era has no conventions, so leadership IRV is the convention proxy here).

## CPU decision-making gaps found (the headline table)

| Decision | What was vague / impossible / wrong | Fix or ruling | Maps to |
|---|---|---|---|
| **Scandal-resigned official re-appointment** | Scandalous-Office-Holder forced Franklin to resign Key Advisor; "Technically there's no rule keeping me from appointing Franklin to UK Ambassador. And a strict interpretation of the rules says that's exactly what the CPU would do" → scandal-resignee immediately re-appointed to another appointed office (POST 65). | UNRESOLVED — CPU has no scandal-smoother memory; "fit only for appointed office" lets the CPU recycle disgraced pols. | NEW **OC-1** (CPU scandal-smoother; relates to #73/#122) |
| **PPT/chair-proposer interaction (marquee bug)** | CPU leadership rule lets a faction vote for a PPT *outside its party* (closest-ideology, #70) → all Senate chairs ended up **Blue** even though Red held 73% of the Senate; then the "chairs may propose if a party controls ≥60% of the chamber" rule let the Blue chairs propose because **Red** cleared 60%. Result: a single Blue Senator was the only one eligible to try to propose, yet Blue chairs proposed freely (POST 151). | Ted: "Adding this weirdness to the stuff to correct when I rework CPU rules." UNRESOLVED — cross-party leadership + 60%-chamber-proposer rules collide. | CORROBORATES **#70** (closest-ideology flips leadership to minority) + NEW sub-gap **OC-2** |
| **CPU votes on crisis bills that hurt it** | All-CPU factions (incl. Southern) rolled to SUPPORT the Abolish-Slavery crisis bill on crisis-resolution grounds → **slavery abolished by 1792 with no secession, no divisiveness** (POST 162-180). "The committee rules don't mention how CPUs vote on crisis if it hurts them, and 3.0.30 is more lenient on crisis support for the majority party than opposition" (POST 180). | Ted: "It might be worth taking another crack at the crisis rules" (POST 177). OPEN — CPU crisis-support rule too generous; no secession-check on abolition (slavery-active gate, POST 165-166). | CORROBORATES **#74** crisis-priority; NEW **OC-3** (crisis-vote-against-self rule) |
| **CPU drafts strong rookies outside ideology** | Both **left-of-center** factions (Euri, Largo) headhunted **Andrew Jackson (RW Pop)** — "25% chance CPU will try when there's a better pol meeting their rolled goal outside ideology" (POST 227-228, 234). Produces incoherent rosters; the off-ideology pol can never become faction leader / run for President. | OPEN — Zagnut proposes a 2.1.6-style gate (pliable + same-or-adjacent ideology); Ted wants "a better third way." | NEW **OC-4** (CPU draft ideology-distance gate; relates to draft + #72) |
| **CPU exec actions when nothing scores** | "Since all other available options will not give Washington or red points, Washington opts to take no actions" (POST 191; also 284, 350-the-only-one). CPU President **skips its whole exec-action budget** when no action nets points. | Observed behavior; no fix logged. Likely intended but means CPU presidents are inert when meters/points don't align. | CORROBORATES **#75 / #23** (CPU exec-action selection = points-maximizing only) |
| **CPU exec action is theme-blind** | CPU signed the Fugitive Slave Act then immediately took "Do not enforce Fugitive Slave Act" because the action-pick roll wanted to "help an ally" by point-math (POST 95-96). | Acknowledged as point-math, not theme — same failure class as `drums` #74 "optimizes meter math not theme." | CORROBORATES **#74 / DH-21** (no meter/theme-guard) |
| **CPU event-vote: Pliable Pres + tied cabinet** | Adams (newly Easily-Overwhelmed + Pliable, POST 334) → "eggheads get to make the call"; both events tied 2-2 among advisors → "Adams gets to decide" (POST 335-337). | Confirms the rule: Pliable Pres defers to cabinet majority; **tie → President decides** (Egghead-tiebreaker-only). | CORROBORATES **#75** (Pliable-defers + Egghead-tiebreaker) |
| **CPU cabinet-fill ladder** | New Sec of War (crisis meter): highest-Admin first → eligible 4-Admin refuses (Chief Justice) → 3-Admin lobbies-tiebreaker → next refuses → unemployed pol accepts (POST 322). CPU also used the SCOTUS bench as a place to dump cabinet members it couldn't fire pre-firing-precedent (POST 184-187). | Working ladder for the crisis case (highest-Admin → lobbies tiebreaker → accept-roll); the court-as-cabinet-dump is a loophole. | CORROBORATES **#73** (cabinet selection: Admin + lobby tiebreak + accept-roll); NEW **OC-5** (court-as-firing-loophole) |
| **CPU kingmaker-protégé tiebreak** | "Pius had two different kingmaker-protégé possibilities. I chose between all proteges by highest Com+Leg+Gov. If incorrect, we need more clarification in the rules" (POST 308). | Houseruled (highest Com+Leg+Gov); rules don't specify. | CORROBORATES **#76**-adjacent / NEW **OC-6** (kingmaker pairing tiebreak) |
| **CPU governor "help allies" → term actions** | Ted "command decision": when the "help allies" CPU gov rule fires, **include governor-term actions** — same-party-leaning state → lengthen terms / remove limits; opposite-leaning → add limits / shorten (POST 264, 275, 941). | RULED (live, Ted) — adds term-config actions to the CPU gov-action menu under "help allies." | CORROBORATES **#20 / DH-19** (CPU gov menu); NEW sub-rule **OC-7** |
| **CPU pres-election (pre-12A) tie-avoidance** | Pre-12A "two-votes-per-state, no ticket" lets factions tie unless someone throws away a vote. CPU had no rule, risking 50/50 splits. | RULED (Ted, live, POST 192): (a) incumbent Pres always re-nominates incumbent VP if eligible (**VP retention** — fixes `drums` #72 "no retention"); (b) CPU nominates an alternate if no one else has (avoid throwaway-tie exploit); (c) CPU prioritizes own-faction candidates; (POST 197) two candidates from the same state can't both win that state's EVs. | CORROBORATES/SHARPENS **#72** (candidate selection + VP retention) |
| **CPU challenge-incumbent limits** | When are CPU incumbents primaried? | Observed: Blue Mods & Cons and Red LW Pops challenged by same-party factions; no challenge for 8-yrs-served govs (POST 294); "CPU does NOT primary an incumbent unless extremely unhappy" holds. | CORROBORATES **#72** (no-primary-incumbent) |
| **"Scandalous NON-Office-Holder" target def** | Event narrative says "force them out of office" but targets a non-office-holder; "We need to define what is and is not an office. Is career track an office? Is faction/party leader an office?" (POST 334, 336). | OPEN — Ted flags `@vcczar`; event text needs rewrite + an office definition. | NEW **OC-8** (office-definition + event-text) |
| **CPU SCOTUS (all-CPU)** | Whole court is CPU: Justices vote by ideology; Controversial nominee (Rutledge) fails committee → Pres offers a replacement; no CPU voluntarily retires; Pres can't compel retirements (no Iron-Fist/Manipulative pres) (POST 184, 276, 291, 349). No cases fired in the era. | Confirms the all-CPU SCOTUS path: CPU confirmation by ideology-distance, CPU nominee = highest-Jud/own-faction Mod, vacancies persist until a willing nominee. | RESOLVES the **#52** player-vs-CPU fork *for the all-CPU case* (all-CPU run uses CPU SCOTUS) |
| **CPU leadership IRV (pre-convention)** | Speaker/PPT elected by multi-ballot IRV; bloc-vote by faction; ties broken by Party-Leader's backed candidate; closest-ideology can hand the minority party the chairs (POST 42, 115, 256, 329, 332). | CORROBORATES the #70 ladder end-to-end across multiple cycles; PPT race POST 115 ends "stuck in an unbreakable tie → Party Leader's backed candidate wins." | CORROBORATES **#70** (IRV ladder + bloc-vote + PL-tiebreak) |
| **CPU convention (era has none)** | Pre-12A era runs no conventions; presidential selection is party-leader nomination + alternates, resolved at the EC (POST 192-198). | The convention CPU AI (#71) is **untested here** because 1788 predates conventions — a coverage gap this batch could NOT fill. | NOTE (#71 still `drums`-only) |

## Ted rulings & new proposals (designer-authoritative; numbered)

1. **★ Post-election Command-loss home rule — TESTED LIVE (the marquee proposal
   from POST 1).** POST 224: *"Politicians who don't run for President have a
   40% chance of losing -1 Command after the Presidential election. (Shit or get
   off the pot!)"* Applied to 3 pols (Gerry → 0 Command; Pinckney → 2; Hancock →
   2). This is the rule Ted floated in POST 1 ("a post-election % chance you lose
   Command if you didn't run for President/VP"), now pinned at **40% / −1 Command**.
2. **★ VP-inheritance-on-death = full Presidency (NOT acting) — RULED LIVE
   (#61 corroboration).** POST 327: Washington dies (POST 324); VP John Adams
   "refuses the title 'Acting' President — **sets precedent for VP inheritance
   meaning that they become the full President.**" POST 329: a VP who inherits is
   **NOT auto party leader and NOT even faction leader** (matches `nuke` #112
   unelected-succession rule). Red Party Leadership then re-runs via IRV (POST 329).
3. **★ Pre-12A CPU presidential nomination rules — RULED LIVE (POST 192).**
   (a) incumbent Pres always re-nominates incumbent VP if eligible (VP retention);
   (b) CPU nominates an alternate when no one else has (defeats the throwaway-vote
   tie exploit); (c) CPU prioritizes its own faction's candidates; and (POST 197)
   two candidates from the same state can't both take that state's EVs. Ted scopes
   these to **pre-12A rules only** (POST 193-194).
4. **CPU governor "help allies" includes term-config actions — RULED LIVE
   (POST 264, 275, 941):** if the help-allies roll fires, same-party-leaning
   state → lengthen terms / remove term-limits; opposite-leaning → add limits /
   shorten. Adds gov-term actions to the CPU governor menu (#20/DH-19).
5. **Crisis/spending-bill cap stripping should run BEFORE the House vote**
   (POST 86): bills beyond the 1 crisis / N spending cap are removed pre-vote so
   they can't be packaged into a surviving bill. (Cap here: 1 crisis bill at
   minimum Rev/Budget; non-crisis-spending = up to 2 at Overspending, POST 277.)
6. **Debt-table meter effect = roll category THEN bonus/penalty (ONE meter
   only)** (POST 148-153): a debt level rolls for which meter it may hit, then
   rolls whether it hits — not all meters. (Umbrella's correction, Ted-agreed;
   refines the Lingering debt step / #67/#88.) N/A categories are skipped (just
   roll the Rev/Budget effect).
7. **Newly-created offices are not staffed until the next 2.3 appointments
   phase** (POST 89) — a bill that creates an office (AG, Bank President) prompts
   an appointment at the following appointments phase, not immediately.
8. **Incumbents replaced by APPOINTMENT lose no points** (POST 105-108) — being
   replaced at an appointed post (or by appointment to a seat) is not a "loss";
   only electoral defeat costs points.
9. **9th/10th-place draft skill bonus applies to the faction's FIRST DRAFT PICK,
   not first-round pick** (POST 239) — if the first-round attempt failed, the
   bonus lands on the first pol actually drafted.
10. **Filibuster does not exist until enacted by law** (POST 90-92): no
    filibuster in 1788; "Institute Filibuster" passes ~1794 (POST 284) — Puritan
    Senators may then filibuster one bill / delay one half-term. (Corroborates the
    era-gated, law-unlocked filibuster, #10.)
11. **Era-event data ambiguities flagged to `@vcczar`** (author-time decisions,
    not ruled): Cotton-Boom "+2 plantations nationwide" — only states with
    plantations present (POST 137-138, ruled by vcczar 139); Cotton Gin "+2
    Plantation" — only plantation-present states; Haitian Revolution event text
    needs updating now that slavery can already be abolished (POST 271, 881);
    "Scandalous Non Office Holder" text/office-definition (POST 334, 336).

## Timeline of the speedrun (alt-history beats)

- **1788–90 (half-term 1):** Inaugural + rookie drafts; Washington President
  (Vee), Adams VP (Sauc), Jefferson Party Leader of the Dem-Reps after a
  multi-round IRV (POST 56-57). First Congress passes Bill of Rights, Establish
  Federal Judiciary + Set SCOTUS to 5 (separate bills, POST 74-77), Standing Army,
  AG office, Assume-the-debt, US Bank, Ohio Territory + DC. PA abolishes slavery
  (era event). Washington signs the Fugitive Slave Act then declines to enforce it
  (POST 95-96).
- **1790–92 (half-term 2):** ★ **AI peacefully ABOLISHES SLAVERY by 1792** via
  the Abolish-Slavery-by-Compensating-Owners crisis bill — CPUs rolled to support
  on crisis grounds, no secession (slavery-active gate never tripped a CSA check)
  (POST 162-180). Cotton Gin / Cotton Boom fire anyway. 6-member SCOTUS seated,
  all CPU (POST 184). **First popular-vote presidential election (1792):
  Washington & Adams re-elected unanimously** (POST 192-199). Post-election the
  40%-Command-loss rule is tested (POST 224).
- **1792–94 (half-term 3):** Andrew Jackson drafted by a left-faction (Euri,
  POST 226-228). Institute Filibuster + tariff bills pass (POST 277-284). 1794
  midterm: a **massive Dem-Rep wave** (House 80F-3DR → 44F-39DR; POST 299) off the
  Great-Recession −2 incumbent penalty + the meter swing.
- **1794–96+ :** ★ **President Washington dies, 62, of dysentery (POST 324)** —
  first sitting-President death in any KB thread; **VP Adams inherits as full
  (non-acting) President (POST 326-329)**, becomes Easily-Overwhelmed + Pliable on
  an Anytime Evo (POST 334), so eggheads drive his event decisions (POST 335-337).
  Three faction leaders + the PPT die the same cycle (POST 324). Thread continues
  into 1796-98 era-evos / Congress (POST 345-350) then slows to sporadic checkins.

## Bugs / dataset / friction

- **Election-sheet trait-pull bodge (carried from Matt's template):** "the
  election sheets/executive legislative and master sheets were bodged together
  from two different sources so you have to manually correct the fields that pull
  the traits" (POST 2-3) — a sheet-tooling bug, not an engine rule.
- **★ 1788 should start with an ACTIVE WAR (NW Indian War, WS −2) — they forgot**
  (POST 338-344). V's war chart has an "active wars by start date" tab; 1788 lists
  the NW Indian War (active, 20% to lose, WS −2). GMs missed it entirely
  ("lmao we literally forgot"); ruled to "proceed like it was won." Confirms the
  scenario-boot must seed era-active wars (relates to #45 + #86 boot pipeline).
- **Death-penalty bill needs a prerequisite** ("Establish Federal Death
  Penalty") that didn't exist → the Wilful-Murder-death-penalty bill couldn't be
  signed (POST 161). Bill-prerequisite data gap.
- **Navy-of-Six-Frigates spawns "Wooden Sail-Driven Navy" as a free extra
  proposal**; the extra died in committee, killing the parent too (POST 161). Bill
  dependency/packaging interaction.
- **Several GM arithmetic/double-count flags** (the meter "incumbent-party −3 vs
  party-pref shift" double-count POST 204-215; debt double-count POST 148-153;
  Horatio Gates promoted to Senior General after he'd been elected to the House,
  POST 266; Benjamin Lincoln given +1 Admin after retiring, POST 321) — all manual
  bookkeeping slips, reinforcing the "build must own all upkeep" theme (DH-36).
- **Meter→election state-application FORK recurs verbatim** (POST 205-214): Ted
  applies a per-ideology bonus to **every state unless penalized** (so a +3 Red
  Mod is +4 in a Mod+1 state, +1 for a Blue Mod); Ark reads it as ideology-leaning
  states only. Same #18 fork as `dem1820`/`arkzag` — still unresolved; "I like how
  both of us get to wildly different conclusions when faced with the exact same set
  of words" (POST 210).

## Deltas vs. current build (gap-log additions/corroborations)

- **Shipped reality check:** the engine *does* have CPU code for the meta-passes
  (draft picks, career tracks, relocation, ideology shifts, conversions — see
  `phaseRunners.ts` `RELOCATION_ODDS.cpuGate`, `IDEOLOGY_SHIFT_ODDS.cpu`, the
  draft auto-pick loop) but **NOT** for the leadership-IRV / convention / cabinet
  selection / legislation-vote / event-vote / SCOTUS-vote handler suite (#70–#78),
  which remain designed-only. Every row below is a delta against that.
- **CORROBORATES** #70 (IRV ladder, bloc-vote, PL-tiebreak, closest-ideology
  flips leadership to minority — POST 42, 115, 151, 329, 332), #72 (candidate
  selection + the NEW VP-retention rule — POST 192), #73 (cabinet ladder + lobby
  tiebreak + accept-roll + the court-as-firing-dump loophole — POST 184, 322),
  #74 (3-step vote heuristic, point-order duplicate resolution, theme-blindness —
  POST 95, 157, 282), #75 (Pliable-defers + Egghead-tiebreaker event vote — POST
  335-337), #76/#99/#127 (ideology-circle LW↔RW Pop 25% live-confirmed — POST
  117-119, 127), #20/DH-19 (CPU gov menu + the help-allies term-config sub-rule —
  POST 264, 275), #52 (all-CPU SCOTUS by ideology-distance — POST 184, 291),
  #61 (VP-inheritance-is-full-Presidency — POST 327-329).
- **NEW gaps surfaced:** OC-1 CPU scandal-smoother / recycle disgraced pols
  (POST 65); OC-2 cross-party-leadership × 60%-chamber-proposer collision (POST
  151); OC-3 CPU crisis-vote-against-self too generous + no secession check on
  abolition (POST 165-180); OC-4 CPU draft ideology-distance gate (POST 227-228);
  OC-5 court-as-firing-loophole (POST 184-187); OC-6 kingmaker-pairing tiebreak
  (POST 308); OC-7 help-allies gov-term sub-rule (POST 264); OC-8 office-definition
  for events (POST 334, 336).
- **Ted RULED:** post-election 40% Command-loss (POST 1, 224); VP-inheritance =
  full Pres + not-auto-leader (POST 327-329); pre-12A CPU nomination trio + same-
  state-EV rule (POST 192, 197); help-allies gov-term actions (POST 264); strip-
  crisis/spending-before-House-vote (POST 86); debt-table one-meter rule (POST
  148-153); offices-staffed-next-2.3 (POST 89); appointment-replacement-no-point-
  loss (POST 105-108); 9th/10th draft bonus = first-pick-not-first-round (POST 239).
- **Decision-gated forks:** the all-CPU run **uses CPU SCOTUS** (votes by
  ideology, CPU confirmation, no compel) — resolves the **#52** player-vs-CPU fork
  *for the all-CPU case*. The **convention delegate-class fork** is **NOT** touched
  (1788 predates conventions; #13/#71 still open). The #18 meter→election
  state-application fork **recurs unresolved** (POST 205-214).

## Open questions

- **Can a pol run for both Governor and President/VP in the pre-primary era?**
  (POST 238-244). Allowed here "since there's no actual running"; the "Booker
  Rule" gov action that would govern this is talked about but may not exist.
- **Should CPU draft be gated on ideology distance** (OC-4)? Ted wants "a better
  third way" than (a) draft-strong-pol-off-ideology-but-they-can-never-lead vs
  (b) strong pol uncontested. Open design call.
- **CPU crisis-support rule** (OC-3): how should a CPU vote on a crisis bill that
  hurts its own cards? Current rule is too generous (peaceful 1792 abolition).
- **What is "an office"** for the Scandalous-Non-Office-Holder / forced-out
  events (OC-8)? Career track? Faction/party leader with no other post?

## Source

`oopscpu` (699113d6) "Oops, All CPUs — a 1788 test to fix CPU decision-making"
— 350 posts / 7 chunks; Ted-run all-CPU 1788→~1798 founding-era CPU stress-test.
Cited `POST n` (the `===== POST n =====` markers).
