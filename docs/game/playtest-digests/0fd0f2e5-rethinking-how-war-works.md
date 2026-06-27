# Digest — 0fd0f2e5 "Rethinking how war works"

**Type: WAR-SYSTEM REDESIGN / design-origin thread** (not a playthrough). 26 posts / 1 chunk,
dated **Sept 2–9, 2022**. This is the **design-origin discussion that invents the War-Score point
system** later seen as frozen spec in gap **#45**. MrPotatoTed (OP) proposes replacing the current
"win N set battles → win the war" mechanic with a **graded points-per-battle + war-end %-roll**;
matthewyoung123/Willthescout7/Ich_bin_Tyler add a **momentum meter + min/max war length + "all hands
on deck"** faction-stake idea; **vcczar (Anthony, the lead)** synthesizes it all into a formal,
ordered **Military Phase ruleset (POST 16, 18, 26)** with an **End-War Multiplier**. Closes by
deprioritizing: *"the military part of the game is sort of a side show for AMPU… any major
development… will have to wait until the game is out"* (POST 26).

Attribution note: the task framing said "vcczar proposes." The chunk shows the **point-system OP is
MrPotatoTed** (POST 1/2); **vcczar (vcczardo)** is the GM who *drafts the codified rules* (POST 16,
18) and *owns the final ruling* (POST 19, 26). Recording the accurate split.

---

## 1. The problem being fixed (POST 1)

MrPotatoTed dislikes two things about the SHIPPED win-N-battles mechanic:
- **No fluidity** — you win a fixed count of battles, then the war just ends.
- **The "one naval win ends naval forever" bug** — *"winning one naval battle means you no longer
  have to worry about naval at all, even if the land invasion continues for another ten years."*
- (POST 5, Willthescout7) **Wars run far too long** — the 1840 playtest's Mexican War had been going
  **1840→1848+ (4 turns)**, *"entirely too long and very ahistorical. At this rate the Civil War
  would take 20 years."* Historical lengths: RevWar 7–8 yrs (longest), 1812 <3, Mexican 2.5, Civil
  War 4, Span-Am 1 → most should resolve in **1–2 turns**.
- (POST 7, Ich_bin_Tyler) **Average militaries are badly disadvantaged**: he simulated the Civil War
  under the current **5 wins to win / 5 losses to lose / 2 losses ends the phase** with an average
  setup (mil-3 officers, neutral prep, 2 of 4 benchmarks) → **per-battle win odds only 37%/39%**
  (Eastern/Western fronts), losing ~2 of every 3 → ~10 yrs to win a front but only 6 yrs to *lose*
  it. Conclusion: the win-condition math is stacked toward defeat.

> **Note the constants here describe a CIVIL-WAR config (5/5/2), not the shipped 1772 RevWar config
> (7 wins / 16 losses).** See §4 — these are different wars/eras, not a contradiction.

---

## 2. THE PROPOSED WAR-SCORE POINT SYSTEM (the core spec)

### What stays UNCHANGED (POST 1, explicit)
- **How a single battle is won/lost is unchanged** (same Chance-of-Success d100 roll).
- **Per-officer (General/Admiral) gains/losses from outcomes are unchanged** — *"I also wouldn't
  necessarily change the individual General/Admiral gains/losses from those outcomes."*
- What changes is **ONLY how you determine when the war is over.**

### Battle → points (the asymmetric grading; POST 1, restated POST 16 "Sum Up the Progress")
| Battle | Win | Loss |
|---|---|---|
| Easy | **+1** | **−3** |
| Moderate | **+2** | **−2** |
| Difficult | **+3** | **−1** |

Rationale of the inversion: winning easy battles is cheap progress; **losing an *easy* battle is the
most damaging** (−3) while losing a *difficult* battle is excusable (−1). A war's **raw score = Σ over
the ENTIRE war** (not just the half-term). Example (POST 1): one difficult win (+3) + one moderate
loss (−2) = **+1**.
- **vcczar bonus (POST 16):** a **Decisive General winning a difficult battle upgrades +3 → +5.**

### War-end roll (per Military Phase; POST 1, restated POST 16)
After each Military Phase, **roll once vs a table keyed to total raw score**:
- **0 = war continues, no roll.**
- **+score → % chance to WIN the war** (linear: +1=10% … **+10=100%**).
- **−score → % chance to LOSE the war** (−1=10% … **−10=100%**).
- A failed roll (e.g. roll 70 with only 30% win odds) → **war simply continues.** Close wars drag;
  curbstomps end fast. (This linear |score|×10% table is verbatim the table now in gap **#45**.)

### Naval handling — THE FIX for "naval ends forever" (POST 1 + POST 16, refined)
- **POST 1 intent:** naval battles should **NOT directly count wins/losses** — instead **naval
  control modifies the DIFFICULTY of land battles** (sea control → easier land battles via
  reinforcement-blocking/support; losing at sea → harder land battles). *"I don't have that fully
  mapped out yet."*
- **POST 16 (vcczar's codification):** kept naval in the win/loss tally too (*"we have naval wars…
  Span-Am was arguably won at Manila Bay"*) BUT implemented the modifier as: **fight ≥1 naval + ≥1
  ground per phase, naval FIRST; a naval WIN → next land battle's general gets +1 Mil for that battle
  only (75% chance); a naval LOSS → −1 Mil.** So naval no longer "ends" — it persists and feeds land.

---

## 3. vcczar's CODIFIED Military-Phase ruleset (POST 16 / 18 — the formal draft)

Ordered phase the engine must implement (this is the **fullest origin-spec for gap #45's
success-chance formula**; corroborates the later frozen-spec capture):

1. **Ground & Naval Battles** — ≥1 of each per phase if both exist; **naval first**; naval
   win/loss → ±1 Mil to the next land general (75%) for that battle only.
2. **Battle Name + Difficulty** — war-specific, generated per battle.
3. **Planning Phase** — `Admin(SecWar/Defense; SecNavy for naval) + Mil(highest-ranking officer)` =
   **2–10**. **A President with Mil 5 replaces the highest officer.** **Before Sec'ys exist, DOUBLE
   the highest officer's Mil** (the founding/Continental-Congress case). **Crisis Manager (Pres) or
   Crisis Admin (SecDef) in a "win or die" war → +10%.**
4. **Officer Leading the Battle** — randomized **unless** the SecWar/officer has **Efficient + ability
   ≥4** → 50% chance to *choose* the officer. **Leading officer's Mil ×10 = 10–50.**
5. **Apply the Meters** — **Military Preparedness** meter → **0–15** (*"chance an unprepared military
   could suffer immediate defeat"*). **Foreign Relations** meter → **+5** per the alliance test: a
   **major war needs 2 more Allies than Enemies**, a **minor war needs 1 more**, an **Operation needs
   none (auto +5)**. Sum = **0–20**.
6. **Era Military Benchmarks** — each era has **4 benchmarks**, **+5 each → 0–20.**
7. **Chance of Success** — sum the above (cap ~100). **Difficulty deduction: Easy −0, Moderate −10,
   Difficult −25.** **Decisive General in a win-or-die battle → +10%.**
8. **Fight!** — win → immediately next battle; loss → check **max phase attempts** and **max attempts
   until US defeat**; if neither hit, continue, **alternating ground/naval**.
9. **Sum Up Progress** (whole war) — the §2 point table (incl. Decisive +3→+5).
10. **Determine Momentum** — if the war was active last term, compare this half-term's raw points to
    last's: if **same-or-more**, roll d6 → **1-2:+1, 3-5:+2, 6:+3**; if **fewer**, the reverse
    (negative). (This is matthewyoung123's "momentum meter," POST 4/5/11/12, folded in as a swing
    bonus rather than a separate 1–9 bar.)
11. **Determine if the war is over** — apply **End-War Multiplier × the momentum-adjusted score**,
    then roll vs the §2 |score|×10% table. **Most wars multiplier = ×1; a historically lengthy war
    = ×0.5** (a +4 becomes +2, round up at .5) so it drags. **The End-War Multiplier REPLACES the old
    "how many phases / how many battles per turn" constants** (POST 18).

---

## 4. SHIPPED-vs-DESIGNED — `revolutionaryWar.ts` (verified against the code)

The shipped 1772 engine is the **old win-N-battles mechanic this thread proposes to delete.** It is
1772-scoped only (the sole war code in the build).

| Aspect | SHIPPED `revolutionaryWar.ts` (today) | DESIGNED (this thread) |
|---|---|---|
| **War-end condition** | **Hard count**: win on `currentGroundWins >= groundWinsNeeded` (=**7**); lose on `currentGroundLosses >= groundLossesRemaining` (=**16**) **and** `!frenchAlliance` (`:254–264`). No roll. | **War-Score points** (win +1/+2/+3, lose −3/−2/−1) → **%-roll per phase** keyed to score (§2). No fixed count. |
| **Naval** | Naval is a **single battle/phase** (`:186–204`); tally `navalWins/navalLosses` is recorded but **never used in the win/loss check** → the OP's "naval doesn't matter / ends forever" complaint, confirmed in code. | Naval persists every phase, **first**, and **modifies the land general's Mil ±1** (no standalone naval win-condition). |
| **Battle count / phase** | `do … while (battleCount < 3 && d100() <= 66)` (`:236`) — **1–3 ground battles, 50/50-ish continue.** This is the *exact* "added a rule about a 50/50 roll for another battle" vcczar regrets in POST 6. | **Max-phase-attempts + max-attempts-until-defeat** caps, **alternating ground/naval**, governed by the End-War Multiplier (POST 16/18). |
| **Difficulty mix** | `chance(0.4) ? difficult : chance(0.5) ? moderate : easy` (`:215`); diffMod **difficult −20 / moderate 0 / easy +15** (`:216`). | Difficulty deduction **Easy −0 / Moderate −10 / Difficult −25** (POST 16 step 7) — a **different, steeper** scale; naval result also shifts land difficulty. |
| **Planning formula** | `secWar.admin + general.mil`, else `general.mil × 2` (`:212`); `+25` if French alliance (`:214`). **(Prior-batch flag: the doubled-officer Planning is unclamped at `:212`.)** | `Admin + Mil = 2–10`; **Pres Mil-5 substitution**; Crisis Manager/Admin +10%; **Mil-prep 0–15 + ForRel +5 + 4 benchmarks ×5** all added (POST 16). The shipped code has **no mil-prep meter, no benchmark inputs, no ForRel/alliance-count test** in the battle math. |
| **French alliance** | **Guarantees victory** — `frenchAlliance` makes defeat impossible (`:259`, and `applyFrenchAlliance` logs "Defeat is no longer possible," `:274`). | **Open question (POST 24/25):** how does a war-ending alliance fit a %-roll model? vcczar (POST 25): the French alliance is likely **historically unique** as a war-*winner*; other alliances could *lose* you a war (CSA + UK/France = Union "game over"). So **don't generalize "alliance = auto-win."** |
| **War-Score / Momentum / End-Multiplier** | **None exist** in the build. | All three are the core of the new model. |
| **Faction "all hands" stakes** | Casualties hit only **mil-track pols** (`applyCasualties` filters `skills.military >= 1`; ~10% gain a Mil point, `:121`); senior commanders spared. | **Major-war conscription** of all faction pols (see §5) with far higher death/trait/skill rates. |

**Net delta for the tech-lead:** the shipped `revolutionaryWar.ts` win-path (`:254–264`,
count-based, naval-ignored, alliance=auto-win) is **the thing this thread is designed to replace.**
The replacement — War-Score + per-phase %-roll + End-War Multiplier + naval-feeds-land-difficulty — is
the **same model already logged as frozen spec in gap #45**; this thread is its design origin and
**dates it to Sept 2022.**

---

## 5. The "all hands on deck" faction-stake proposal (secondary, POSTs 5/9/16/17–26)

matthewyoung123's parallel idea — *more PERSONAL faction stake in war* (POST 5: *"there is almost no
'investment' by our political figures in the war. Nothing to lose and nothing much to gain"*):
- **Conscription rule (POST 5, refined):** in a **MAJOR WAR**, **every faction member with Mil ≥1 who
  is NOT holding office or on a (non-military) career track goes to fight** (mil-track pols also go).
  vcczar scopes it (POST 16) to **all wars BEFORE the creation of the Dept of Defense / Sec of Defense
  (≈ pre-Truman)** — after that, politician-soldiers are uncommon.
- **Age/eligibility gates:** **MrPotatoTed: 50+ exempt unless named General** (POST 6); **matthewyoung123:
  under-55 only / sweet spot 25–45** (POST 21/24); **Pacifist-trait pols (and most pols of a
  pacifist-card faction) don't fight** (POST 21).
- **Higher casualty/skill rates by difficulty×outcome (POST 5 ranges)** — e.g. Moderate win: 2–4 die,
  3–6 gain a trait, 3–6 gain skills; Difficult loss: 6–9 die. matthewyoung123 (POST 20/22): **more
  deaths on a LOSS regardless of difficulty; more skills/traits rolled the harder the battle**;
  MrPotatoTed (POST 22): **fewest deaths Easy, most Difficult.** Worked example (POST 5): a Mexican-War
  moderate win seeded future Civil-War generals (Meade gains Leadership; Humphreys/Branch/Bonham gain
  Mil) — the system **auto-generates historical war heroes**, a stated immersion goal (POST 9, 24, 25).
- **Counter-caution (Vols21, POST 24/25):** *"most of our statesmen LIVED through the wars they fought
  in, otherwise they'd never have made the list"* — don't kill off too many budding statesmen. Proposes
  a **faction "safe list"**: flag X pols as non-combatants (West Point / training troops / home-front),
  the **Eisenhower-in-WWI** case (kept home, made LtCol training tank crews, survived for WW2). vcczar
  wants the balance "some on the line, chance to lose OR gain," like a war-only death/retirement phase
  (POST 25), and will **test "all hands" in his own 1772 playthrough's next military round** (POST 25).
- **vcczar's ONLY committed expansion (POST 26):** *"a new rule that gives a chance of +1 Mil and
  Celebrity to a non-office-holding politician with at least 1 Mil ability for **difficult battles in
  major wars**"* — *"about as much general/admiral expansion I'm willing to do at this point."* (So the
  full "all hands" model is **discussed but NOT adopted**; only this narrow war-hero grant is.)

---

## 6. Other war-mechanic threads raised (mostly OPEN / unbuilt)

- **War TIERS (POST 16):** **Major / Minor / Operation** — drives the alliance requirement (2 / 1 / 0
  more Allies than Enemies) and presumably the conscription scope. (Corroborates the Major/Minor/Operation
  tiers in gap #56.)
- **"Win or die" scenario flag (POST 16):** a war state that unlocks the Crisis-Manager/Crisis-Admin
  +10% and the Decisive-General +10%.
- **Insurgency vs organized-nation wars (POST 2/3):** MrPotatoTed asks how to make War-on-Terror/Vietnam
  drag (won battles, lost/withdrew war). vcczar (POST 3): insurgencies (armed civilian populations) are
  *"infinitely harder"* than conventional wars (Desert Storm) — **no concrete model yet, OPEN.** The
  End-War Multiplier (×0.5) is the partial answer for "historically lengthy" wars.
- **War funding ↔ momentum (POST 11):** Congress raising/cutting war funding should swing the win% (+15/
  −15) — a legislative hook into the war engine; **not yet codified.**
- **Anti-war as a political path (POST 13):** standing AGAINST a war (Lincoln-as-Whig, Copperheads) as a
  name-making opportunity — flavor/faction angle, unbuilt.
- **Civil-War-specific open questions (POST 25/26):** what happens to Southern-state pols (disappear /
  sleep / Southern-Unionist trait stays); do states secede deterministically; **playable Confederacy?;
  "brevet generals" because the army is too small for the casualty scale; Ambassadors' Civil-War mission
  = keep UK/France out; how to represent Native tribes militarily.** Reconstruction-ends-on-pardon rule
  half-remembered (*"Pardon all confederates except the President and General in Chief"*). **All OPEN →
  corroborates gap #56** (the Civil-War combat/Reconstruction/secession spec).
- **Priority ruling (POST 26):** war is *"a side show for AMPU"*; major war dev **deferred until after
  launch**, possibly a (free) DLC. Useful **roadmap-priority signal**: the War-Score redesign is desired
  but **explicitly not a pre-launch must-have** per the GM.

---

## 7. Relation to existing gaps

- **Corroborates / DATES gap #45** (Generic war system): this thread is the **design origin** of the
  War-Score (win +1/+2/+3, lose −3/−2/−1), the **|score|×10% war-end table**, the **per-phase %-roll**,
  **Momentum** (turn-vs-turn d6 swing), the **End-War Multiplier**, and the **naval-feeds-land-difficulty**
  model — all of which #45 already records from later frozen-spec captures. Confirms #45's success-chance
  formula `base + officer-Mil×10 + (SecDef+officer Admin) + difficulty + mil-prep + benchmarks` essentially
  verbatim (POST 16 steps 3–7). Pins the date: **Sept 2022.**
- **Corroborates gap #56** (Civil-War engine + Major/Minor/Operation tiers): the war-tier system, the
  per-front math (POST 7), and the Civil-War open questions (POST 25/26) all feed #56.
- **Corroborates gap #106** (war is optional/event-gated, "Cold War = relabeled engine"): vcczar treats
  *every* war as one generic engine with per-war parameters (multiplier, tier, benchmarks) — exactly
  #106's premise. The insurgency discussion (POST 2/3) is the design-side mirror of #106's "wars never
  resolve on their own / Vietnam-quagmire" findings.
- **Touches gap #176** (founding MilPrep): POST 16 step 3 *"Before Sec'ys exist, DOUBLE the highest
  officer's Mil"* is the design intent behind the shipped doubled-officer Planning at `revolutionaryWar.ts:212`
  (the unclamped path). Step 5's Mil-Preparedness meter (0–15, *"unprepared → immediate defeat"*) is the
  designed MilPrep input the founding-cluster #176 finding says is missing/capped in the build.

---

## Candidate gaps for consolidation

- **NEW — War-end model: replace win-N-battles with War-Score points + per-phase %-roll + End-War
  Multiplier.** SHIPPED `revolutionaryWar.ts:254–264` ends a war on a **hard count** (7 ground wins / 16
  losses; French-alliance = auto-win) and **ignores naval entirely** in the win check. DESIGNED (this
  thread, Sept 2022): each war graded on **raw War-Score** (win +1/+2/+3 by Easy/Mod/Diff, lose
  −3/−2/−1), a **per-Military-Phase win/lose %-roll keyed to |score|×10%** (0 = continue), a **Momentum
  d6 swing** (turn-vs-turn), and an **End-War Multiplier** (×1 normal, ×0.5 for historically-long wars)
  that **replaces fixed phase/battle counts**. This is the **design origin of gap #45's frozen spec** —
  recommend folding into / dating #45 rather than a wholly new row, while flagging the **shipped-vs-designed
  win-path delta** (count-based → roll-based) as the concrete tech-lead requirement. *(Source: 0fd0f2e5 POST
  1, 16, 18; shipped `revolutionaryWar.ts:186–264`.)*

- **NEW — Naval no longer a standalone win-condition; naval result modifies land-battle difficulty.**
  Fixes the OP's "one naval win ends naval forever" bug (confirmed in code: `navalWins/navalLosses`
  recorded `:202` but unused in `:254–264`). DESIGNED: ≥1 naval + ≥1 ground per phase, **naval first**;
  naval win → next land general **+1 Mil** (75%), naval loss → **−1 Mil** (POST 16). *(Source: 0fd0f2e5
  POST 1, 16.)*

- **NEW (deferred-by-GM) — "All hands on deck" major-war faction conscription + war-hero generation.**
  All faction pols with Mil ≥1, off-office/off-(non-mil)-track, fight in a **pre-Dept-of-Defense major
  war**, with age (25–45 sweet, 50/55+ exempt) + Pacifist gates, a **faction safe-list** option, and much
  higher death/trait/skill rates by difficulty×outcome → auto-generates future war heroes. **vcczar
  ADOPTED only a narrow slice:** +1 Mil + Celebrity chance to a non-office-holder (Mil ≥1) on **difficult
  battles in major wars** (POST 26). Log the full model as designed-not-adopted; the narrow grant as a
  small build requirement. *(Source: 0fd0f2e5 POST 5, 16, 20–26.)*

- **Corroborates #45** — War-Score table, |score|×10% war-end roll, Momentum, End-War Multiplier,
  success-chance formula (POST 16 steps 3–7); **dates the spec to Sept 2022.**
- **Corroborates #56** — Major/Minor/Operation war tiers + alliance test (POST 16); Civil-War open
  questions, brevet generals, playable-Confederacy, secession/Reconstruction (POST 25/26).
- **Corroborates #106** — every war = one generic engine w/ per-war params; insurgency-drag problem
  (POST 2/3); GM ruling that war is "a side show," major dev **deferred until post-launch** (POST 26).
- **Corroborates #176** — pre-Sec'y "double the officer's Mil" planning (POST 16 step 3 = the shipped
  `:212` path); Mil-Preparedness meter (0–15) as the designed founding war input.

## Open questions for the human
- How should a **war-winning alliance** (the French alliance, currently auto-win at `:259`) map onto the
  %-roll model? vcczar (POST 25) says it's historically unique as a *winner* but alliances can *lose* you
  a war (CSA + UK/France) — so do NOT generalize "alliance = auto-win." Needs a rule.
- The **naval→land difficulty modifier** is left "not fully mapped out" (POST 1); vcczar's POST 16
  version (±1 Mil to the land general) is a partial implementation — is that the final intent, or should
  naval shift the difficulty *tier* directly?
- **Insurgency / asymmetric wars** (Vietnam/War-on-Terror) have **no model** beyond the ×0.5 End-War
  Multiplier (POST 2/3) — OPEN.
