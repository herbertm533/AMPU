# Digest: "Lars and Ark — All Teahaters are created equally" (06fbb2e5)

- **Source:** `06fbb2e5-Lars_and_Ark__All_Teahaters_are_created_equally.csv`, 125 posts, 2 chunks.
- **Type:** GENUINE ERA-PLAYTEST (forum / Google-Sheets manual sim) — the first
  real era-run in many batches. Run on **politicslounge.com topic 4474**, May–Jun 2023.
- **Scenario:** **1772 founding** (Era of Independence). **2 humans vs 8 CPU.**
- **Players & polarity:** **both humans play POPULISTS inside the BLUE party** —
  **@Arkansas Progressive ("Ark") = LW-Populist / left**, **@Lars = RW-Populist / right**
  (POST 1). The other 8 factions (Red 1-5, Blue 2-4) are CPU, "very predictable,"
  "6 or 7 moderate AIs" (POST 8). This is the **Populist-flank-inside-a-major-party**
  setup (relevant to #4/#171 and the ideology-disadvantage balance question).
- **Authority hierarchy:** GM/runner = **Ark** (a GA / tier-4), with **Lars** co-running
  battles. **@MrPotatoTed (Ted) and @ebrk85 are DESIGNER-AUTHORITATIVE** and adjudicate the
  war-resolution bug mid-run (POST 83-89). **Ark is NOT designer-authoritative** — his own
  feedback (POST 77) he is told to file in the feedback thread (POST 80).
- **Arc covered:** Inaugural Draft (1772) → CC term **1774-1776** → **1776-1778**
  (Revolutionary War begins) → **1778-1780** (war continues) → 1780 draft. Ends mid-1780
  with the war still being lost. Founding polarity here is a **player construction**
  (populist flanks of Blue), NOT historical Patriot/Federalist.

> Read alongside the other 1772 traces: `grass1772` (the other 2-human-v-8-CPU 1772),
> `ted1772`, `cpufull`, `new1772`, `tea1772`, `rookie1772`, `1772s`. This thread's
> load-bearing value is **(a) a GM/DESIGNER-CONFIRMED war-resolution-timing BUG** and
> **(b) the cleanest data point yet that the 1772 RevWar is brutally hard / repeatedly
> game-overs through no player fault** — exactly the #155 counter-constraint.

---

## ★ Headline signal — the bug & the balance crisis

### BUG-1 (GM+DESIGNER CONFIRMED): war-loss roll fires after EVERY battle, not once per term
The single highest-value finding. The run rolled the **"do we lose the war?" check after
each individual battle** instead of **once at the end of the term**:
- POST 75: after the very first land loss (Trenton), "momentum −4. Chance at losing the
  war: 40%. Rolls 60. **The United States has failed in its bid for independence!**" — i.e.
  an **immediate game-over after a single lost battle**, turn ~3 of the whole game.
- The runner **VOIDED that loss** to keep the playtest alive (POST 78: "for the sake of
  not wanting to end another CPU 1772 playtest the roll has been voided"). The war-loss roll
  is then **voided again and again** (POST 78, 94, 118).
- POST 83 (**ebrk85**): "I don't believe you are supposed to roll to determine if you won
  or lost the war after each battle. Just at the end of all the battles for that phase."
- POST 85 (**MrPotatoTed, designer**): "**This is correct.**" → confirmed the per-battle
  roll is a **mistake** (POST 86: "Ah. That is a mistake").
- POST 88 (Ted): the win/loss thresholds are **outdated columns** in the war doc —
  "Wars are no longer won by winning or losing a certain number of battles but by using
  the **war score and momentum chart after each term**." Per-battle there is only a
  **50/50 roll for whether another battle happens that half-term** (POST 88-89).
- POST 89 (ebrk85): "War Charts gotta remove those columns" — i.e. the war doc still
  contains the stale per-battle-loss columns that produced the bug.

**Symptom / where in the loop:** war-resolution phase (2.7). The war-end / surrender check
is evaluated **per-battle** (after each `Battle` resolves) rather than **once per term** on
the war-score+momentum chart. In the engine this is the **`warscore × multiplier → % to
lose outright`** roll described in #45/#56 — it is firing at the wrong cadence. (This is a
candidate DH row / a clarification of the #45/#56 war-end-roll cadence.)

### BALANCE-1: the 1772 Revolutionary War is brutally, repeatedly losable — through no player fault
The war was a near-total rout — the single strongest piece of **concrete #155
counter-constraint data** (the "don't over-harden, 1772 is a game-over on a loss" worry):
- **The Navy won essentially nothing.** Cape Ann naval battle: instant defeat on a 20/100
  Mil-Prep meter roll (POST 73). Later naval set: Nassau FAIL, Sag Harbour win, Cape Ann
  FAIL, Fort Stanwix II FAIL (POST 112-118).
- **Land battles were a long losing streak**: Trenton FAIL, Long Island lost, Boston lost,
  Monmouth FAIL, Fort Washington instant loss, then **Crooked Billet succeeds only on a
  natural 100** (POST 74, 81-92). Momentum sank to **−7, −9** over the two war terms.
- Player reaction (POST 84): "**It's a bit annoying to repeatedly lose the game through no
  fault of your own**." POST 85 (Ark): "Still hate the die tho."
- **Why so hard (matches #155 root cause):** Mil-Prep meter is stuck low (see BALANCE-2)
  so most battles eat a flat **instant-loss / −10** modifier, and Difficult battles carry a
  **−25** difficulty term that the small officer/planning bonuses can't overcome. Officer
  Mil is the dominant positive term (`Mil ×10`) but the officers here were 2-3 Mil, not 5.
- POST 123 (sarcasm): "Maybe we'll win the war before 1800." — they never won it on-screen.

**Corroborates #155 directly:** this is a fresh-1772 RevWar that was **genuinely losable to
the point of un-winnability**, validating the counter-constraint that any #155/#56 hardening
must keep the 1772 floor playable. (Lines up with `ted1772`'s "genuinely losable" data and
`grass1772`/`rookie1772` traces.)

### BALANCE-2: MilPrep meter never rises above 2 for the whole war — CONFIRMS #176
Mil-Prep is repeatedly **"2"** across both war terms (POST 73 "Mil-Prep is 2"; POST 74
"still 2"; POST 81-83 "Mil Prep: 2"). Battles roll **against** this low meter and frequently
hit instant-loss (Cape Ann 20/100; Boston "Mil prep: 13 so lost"; Fort Washington "8 so
instant loss"). This is an **independent 3rd-source confirmation of #176** (founding MilPrep
hard-capped at ~2 for the Era of Independence → the auto-forced war bills are dead rolls +
a permanent military crisis). The Continental Army/Navy bills DID pass here (POST 67-68) yet
the meter still never climbs — exactly the #176 mis-ordered-prerequisite symptom.

---

## Other observed bugs / engine misbehavior

- **BUG-2 (proposer ordering, GM-confirmed):** legislative proposers were chosen by **CPU
  random pick instead of descending-Legislative order** (POST 33, 36: "I ran the numbers of
  who got to propose and did CPU rather than do it in descending legis order, whoops"). Higher-
  Legis Harrison should have proposed before Caswell. → corroborates #74 (proposer = each
  faction's **highest-Legis** pol) — the rule exists but is easy to mis-run manually (an
  argument the **app** must own proposer selection; see DH-36).
- **BUG-3 (eligibility flag):** the runner twice selected war-bill proposers who **did not
  have ≥1 Legislative** and had to fix it (POST 64: "had some flags where I selected pols who
  did not have 1 legis *SIGH* but fixed that"). The ≥1-Legis-to-propose gate (cf. #159's
  delegate ≥1-Legis rule, #74) is real but was manually violated.
- **BUG-4 (committee-death ruling ambiguity):** "Denouncing Big Government **dies in
  committee** (is that possible?)" (POST 35) — a placeholder/no-op "denounce big government in
  lieu of a proposal" action (POST 33) has **undefined committee handling**; it then "passes"
  in the full vote anyway (POST 40), suggesting denunciations aren't real bills and shouldn't
  enter the committee/vote pipeline. (Minor — candidate clarification, not a clean DH.)
- **BUG-5 (CPU relocate phase broken):** "We found an **issue preventing the CPU from
  moving**. As such, the players also won't move theirs this turn" (POST 20, phase 2.1.5). The
  CPU politician-relocation step (2.1.5) **failed to execute**; later relocations DO run for
  CPUs (POST 97, 125), so it was a transient. → relevant to #114/DH-36 (CPU bookkeeping load).
- **Doubled-officer Planning edge case (corroborates `rookie1772` #155 minor):** Planning is
  computed as **highest-officer Mil ×2** when no Secretary of War exists (e.g. POST 73 "John
  Paul Jones Mil (3) ×2 = 6"; POST 74 "Israel Putnam (2) ×2 = 4"). With a 3-Mil senior officer
  this term yields **6**, above the 0-5 ability cap — the same clamp issue Ted flagged in
  rookie1772 (POST 35 there). Confirmed live here.

---

## Confirmations of existing mechanics / gaps (corroboration)

- **#4 / #171 — era-keyed draft-ideology restrictions, CONFIRMED ON in 1772:** the Blue
  draft is explicitly **ideology-gated** — Lars: "John Taylor (**the only pol I'm eligible
  for**)" (POST 122). Players also actively **steal pols "from the middle"** because they
  can't freely draft anyone (POST 8). This is a clean 1772 corroboration that early-era
  draft-ideology restrictions are **active** (contrast `trump2024`'s OFF-in-2024).
- **Populist-in-a-major-party experience (#4/#171 + ideology-disadvantage balance):** two
  Populists inside Blue felt **structurally disadvantaged** — they agreed a **truce to not
  steal each other's Populists** and to poach moderates instead (POST 8); thin draft pools
  ("the only pol I'm eligible for," POST 122); and Ark finished **"super dead last in points"**
  (POST 122, getting the last-place +1 draft bonus). The open question they pose (POST 8):
  "**The real question is if two populist players can hold up against 6 or 7 moderate AIs.**"
  → live evidence that off-modal-ideology play is hard; feeds the ideology-disadvantage tuning
  behind #4/#171.
- **#76 — conversions (2.1.6) confirmed:** CPUs and players run ideology-shift attempts with
  **per-attempt rolls and failure consequences**: Red 1 / Blue 4 shift pols "**towards highest
  enthusiasm**" (Lib→Mod, Trad→Con), most **fail** (POST 12); a failed shift grants
  **flip-flopper** (Hugh Mercer, POST 12). Confirms the rolled-conversion model + failure-strip
  behavior. (Note: this is the same-faction ideology-shift step; no cross-party poach observed.)
- **CPU draft behavior (#4, #46):** CPUs draft **predictably** (POST 8), pick up marquee
  historical figures by faction, and **kingmaker→protégé** combos fire for both CPU and human
  (POST 13, 21, 56-57: Huntington takes 3 protégés incl. Benedict Arnold). Draft order is
  **points-ascending** (low points → earlier pick; POST 54, 120; Ark last-place gets +1 bonuses
  POST 55, 122) — confirms #114's "low points = better draft order" CPU mechanic.
- **#45 / #56 — RevWar battle formula CONFIRMED end-to-end** (the fullest naval+land trace in
  this thread): `success = Planning(highest-officer Mil ×2) + Leader(officer Mil ×10, +bench)
  + Meters(MilPrep) + Benchmarks(+10) − Difficulty`, rolled d100 (POST 73-74, 81-82, 90-92,
  112-118). Difficulty terms: Easy/Moderate/Difficult; Difficult ≈ **−25**. Naval phase gates
  land: "only one naval phase for this entire war, this battle will determine how the initial
  land and subsequent war will go" (POST 73) and "naval battles concluded, land battles begin,
  we get a −1 to mil ability" (POST 118). Defeated officers gain **Incompetent** (prompts
  replacement) and can **lose −1 Mil** or **die on a natural-1-ish roll** (POST 91, 112, 116).
- **Continental Congress subsystem (#159-adjacent, founding CC):** delegate selection (3 per
  state, ≥1 Legis, tie-breaks, nominees can **reject** appointment), CC President chosen by
  delegate plurality, committee chairs (Dom/FA/Econ/Judicial) appointed and gain expertise,
  legislative session (committee vote → full vote), points scoring per bill by ideology/lobby
  (POST 18, 21-24, 40, 48). Matches the founding-CC machinery in #13/#159.
- **Era events fire on schedule (#33-adjacent, founding event graph):** Common Sense → Lee's
  Resolution → **Declaration of Independence** chain (POST 26, 33, 41), Lexington & Concord,
  Declaration of Resolves, **Republic of Vermont**, Virginia Declaration of Rights, Restraining
  Acts, celebrity-grants for Franklin/Sam Adams/Paine (POST 17, 61, 102). Scripted point swings
  favor Populists ("50 pts for LW Pop and RW Pop, 50 lost for Mods and Cons," POST 17).
- **#82 (peripheral):** the bill "**Grant the President of the Continental Congress the power
  to break a tie when states are deadlocked**" repeatedly FAILS the 2/3-ish CC threshold (4-8,
  1-10; POST 40, 68) — confirms a high supermajority gate on CC structural changes.
- **Math.random jitter in resolution (engine-determinism note):** every battle, scripted-event,
  conversion, and death is resolved by a fresh d100/d6 roll narrated inline (POST 12, 73-92,
  112-118). Confirms the pre-revamp `Math.random`-style jitter throughout (consistent with the
  shipped `calcStateVote` jitter and the seeded-RNG migration the engine still needs).

---

## ★ Declaration-of-Independence CPU support hole (corroboration of #74 + war-trigger design)

A distinct, repeatedly-observed content/AI gap surfaced by the players:
- The **Declaration of Independence bill repeatedly FAILS in committee / full vote** because
  CPUs won't support it (POST 47 "stalls 3-5"; POST 67 "dies 7-3"; POST 76 "**CPU fails to
  support the declaration**"). It only finally passes in the **third** legislative session
  (POST 106-107: 10-2-1).
- Ark's diagnosis (POST 77, designer-flagged as good feedback POST 80): the Declaration
  **"either needs to be foundational (so that we trigger the 75% chance of support) or it needs
  to appeal to more than just nationalists that like and pacifists that oppose, since it's not
  very often that a faction will randomly draft a politician with those expertise."**
- This corroborates **#74** (CPU legislation heuristic: AYE only if it helps my ideology/lobby,
  NAY default) AND the **"foundational bill → ~75% support"** mechanic referenced in #155's
  CPU-game-over floor (`ted1772` POST 638). It's a concrete case where a **plot-critical bill
  can stall** because no CPU faction holds the matching expertise cards. Candidate requirement:
  mark independence-chain bills **foundational** (or broaden their support coalition) so the
  war-trigger isn't gated on a random draft.

---

## Possible real-history note (HISTORIAN was intentionally skipped)
No clear real-history error in the docs surfaced. Two cosmetic/data oddities, NOT doc gaps:
- The **Treaty of Amity and Commerce w/ Sweden of 1783** and several bills appear with their
  historical year **1783** even though the in-game term is **1774-1776** (POST 30, 40). This is
  a bill-name artifact (real treaties tagged with real dates), not a timeline error — but worth a
  glance if a historian pass ever runs.
- **Benjamin Franklin dies at 68 of pneumonia in 1776-1778** (POST 65) — plausibly early vs his
  real death (1790), an artifact of the random death-roll, not a scripted-date error.
Neither rises to a "docs get a date/figure wrong" flag; **no historian follow-up needed** on
the strength of this thread.

---

## Open questions (for the human / consolidation)
1. **War-resolution cadence (BUG-1):** confirm the **shipped** engine evaluates the
   war-end/surrender roll **once per term** (war-score+momentum chart), NOT per battle, and that
   the **stale per-battle win/loss-threshold columns** are gone from any data the engine reads.
   Ted confirmed the *rule*; the *build* must be audited. → maps to #45/#56; candidate DH row.
2. **1772 RevWar winnability floor:** the war was effectively un-winnable here. Does the shipped
   1772 scenario keep any of the `ted1772` floors (French-alliance unloseable flag; 2/3 peace-vote
   threshold; CPU-opposes-game-over 75%)? With **no** floors AND BUG-1, a 1772 game ends in ~3
   turns. → #155 counter-constraint, now with 3rd-source data.
3. **MilPrep ladder (#176):** even with Army+Navy bills passed, MilPrep stayed at 2 all war.
   Confirm the meter-tier prerequisites are reachable in the founding era.
4. **Foundational-bill flag for the independence chain (#74 / war trigger):** should the
   Declaration / Lee's Resolution be marked foundational (~75% CPU support) so the war isn't
   gated on a random draft?
5. **Doubled-officer Planning clamp:** Planning = officer-Mil ×2 (no SecWar) can exceed the 0-5
   cap (=6 here). Same edge case Ted flagged in rookie1772 — confirm the clamp.

---

## Delta list (map to EXISTING gap IDs — no new numbers assigned)
- **#45 / #56 — NEW BUG (candidate DH): war-end/surrender roll fires per-battle, not once per
  term.** GM+DESIGNER CONFIRMED (Ted POST 85-89, ebrk85 POST 83). Stale per-battle loss-threshold
  columns in the war doc are the root cause; wars are meant to resolve on the war-score+momentum
  chart **at term end**, with only a 50/50 "another battle?" roll per battle. Audit shipped cadence.
- **#155 — strong CONFIRM + concrete counter-constraint data:** a fresh 1772 RevWar that was
  near-un-winnable (Navy ~0 wins, land a losing streak, momentum −7/−9, "lose through no fault of
  your own"). 3rd-source proof that the 1772 floor must stay playable under any #155/#56 hardening.
- **#176 — independent 3rd-source CONFIRM:** MilPrep stuck at **2** the entire war despite
  Continental Army + Navy bills passing → forced war bills are dead rolls; permanent military
  crisis. (Joins `grass1772` + `rookie1772`.)
- **#4 / #171 — CONFIRM era-keyed draft-ideology restriction ON in 1772:** Lars "the only pol
  I'm eligible for" (POST 122); players poach moderates because they can't draft freely (POST 8).
- **#4 / #171 — Populist-in-major-party balance data:** two Blue Populists felt disadvantaged
  (truce not to steal each other's Populists; thin pools; Ark dead-last in points). Live evidence
  for the ideology-disadvantage tuning question.
- **#76 — CONFIRM conversion model:** rolled same-faction ideology shifts "toward highest
  enthusiasm," frequent failures, failure grants flip-flopper (POST 12).
- **#74 — CONFIRM + a content hole:** proposer = highest-Legis (mis-run as CPU-random, POST 33/36);
  CPU AYE-only-if-it-helps-me heuristic causes the **Declaration of Independence to stall 3x**
  (POST 47, 67, 76) — candidate requirement to mark independence-chain bills foundational (#155's
  ~75%-support floor).
- **#114 / DH-36 — CONFIRM CPU-bookkeeping burden + a transient CPU-relocate bug** (POST 20,
  64, 33/36): manual sim caused mis-run proposer order, bad eligibility picks, and a stalled CPU
  2.1.5 relocate phase — the work the app's CPU-AI must own.
- **#45/#56 minor — doubled-officer Planning can exceed the 0-5 cap** (=6, POST 73-74): same
  clamp edge case Ted flagged in `rookie1772`.
