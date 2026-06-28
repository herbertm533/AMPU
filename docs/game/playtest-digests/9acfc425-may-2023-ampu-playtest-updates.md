# Digest — 9acfc425 "May 2023 AMPU Playtest Updates" (topic 2361)

**Source:** `docs/game/sources/9acfc425-may-2023-ampu-playtest-updates/` (1 chunk,
33 posts, ~12.7k chars). **Scope:** a cross-era playtest *highlight reel*
(end-of-May backer-update fodder) spanning several concurrent forum
playthroughs — 1772/1788 founding ("Ted Insanity"), a 1948 Cold War run (1960
election), a 1928 run, and an 1868 Gilded Age run. Anecdotal/narrative; mined
here for **mechanics signals only**, not story color. Cast/outcomes are
alt-history. Era framing per `docs/game/historical-context.md` (no historian
ran this thread); polarity per its cross-era map (1772/1788 = BLUE Dem-Rep /
RED Federalist; 1856/1868 = the flip).

---

## Threads referenced (for traceability)

- **"Ted Insanity"** — a 1772→1788+ founding run. The richest mechanics source
  here (POST 3, 19-23). OrangeP47 plays BLUE/Jeffersonian; MrPotatoTed GMs.
- **1948 playtest** — at the **1960** election (POST 18, 26). Modern polarity.
- **1928 playtest** — at the **1932** election (POST 31). Bare mention only.
- **1868 Gilded Age** — convention fights, deaths, a SCOTUS ruling (POST 2,
  10-17, 32-33). Continues 1856-flip polarity (RED = the Reconstruction GOP).

---

## Mechanics signals

### 1. Foreign-born → President via a Constitutional Convention plank (POST 3; also 19)
1788 "Ted Insanity": **Scotland-born Gen. Arthur St. Clair becomes the first
President under the new Constitution.** The path (POST 3) is a clean exercise of
several shipped systems chained together:
- War-hero promotion ladder (St. Clair rises through Senior General slots after
  Israel Putnam/Horatio Gates churn; wins "Battle of Long Island," gains **War
  Hero**, becomes a **faction leader** replacing a fired general).
- A delegate ("Abraham Clark") proposes **a Constitutional plank to let the
  foreign-born St. Clair be eligible for the Presidency**; the **Father of the
  Constitution ("John Lambert") persuades 4 states** to flip an initially-doomed
  plank; then he's **elected unanimously** ("Father of the Country").

**Shipped-vs-designed:** the CC *does* ship a `presidentialEligibility` article
with exactly two options — **`natural_born`** ("Foreign-born citizens excluded")
vs **`any_citizen`** (`constitutionalConvention.ts:52-58`). So the plank that
rewrites eligibility is a **real shipped lever** — this run confirms the CC
plank system can rewrite the eligibility rules and that picking `any_citizen`
makes a foreign-born politician presidency-eligible. CPU default is heavily
`natural_born` (85%, `constitutionalConvention.ts:119`), which is why "the plank
was initially going to be defeated." **Gaps vs the forum narration:** (a) the
shipped Father-of-the-Constitution is auto-assigned to the highest leg+jud
delegate (`constitutionalConvention.ts:147-160`) and gains Celebrity +1 cmd — no
shipped **"persuade N states to flip a plank"** sub-action is visible (the
forum's "Lambert works overtime persuading four states" is GM/forum
adjudication, not an automated convention mechanic); (b) ratification is a
proxy governor-approval count (`applyConvention` 184-194), not a per-plank state
whip. Note also the **War Hero → faction-leader → resign-and-promote** general
churn is real flavor the build supports.

### 2. President + young SecState botch the first major action → both resign → VP succeeds (POST 19-23)
"Ted Insanity," 1789: barely a year in, **President St. Clair + 27-yo SecState
Albert Gallatin botch the first major presidential action** (an *early Native
American removal*); **both resign**, handing the presidency to **BLUE VP Thomas
Paine** — "pretty much the only notable blue office holder in the country" (BLUE
held ~2 Senators, 1 governor, ~5 Reps, **and the Presidency**, POST 20). Two
sub-signals:
- **The accidental VP ("pulled a Burr," POST 23):** Paine "wasn't supposed to
  run for President either but he was selected as the 'vp' candidate for the
  blue party and accidently pulled a Burr and snuck in over the actual blue
  candidate to be vp." Confirms a **ticket/VP-selection quirk** where the VP can
  end up someone other than the intended candidate — a forum-visible analogue of
  the pre-12th-Amendment runner-up-becomes-VP problem.
- **Implementation-failure (Admin-gates-success) + presidential succession.**

**Shipped-vs-designed (delta):** this whole sequence is **GM-adjudicated, not
shipped.**
- `GameState` has `presidentId` and `vicePresidentId` fields
  (`types.ts:1567-1568`), and on a death `vicePresidentId` is *cleared*
  (`phaseRunners.ts:2450`) — but there is **no automated VP-succeeds-on-vacancy
  chain** in `src/engine/` (grep finds only trait-inheritance and the clear).
  Matches existing **gap #61** (VP-inheritance / Acting-Presidency; the build
  has no auto-succession; the "Acting-Presidency 3.0.33" ruling is forum-only,
  cross-ref game-context #61).
- A **"first major presidential action" that can be botched** (Admin gating the
  success of a presidential action via a blunder roll) is **not a shipped
  per-turn mechanic** — cross-ref **gap #126 / gap #23** (Executive-Actions
  library: phase exists with only ~4 hardcoded one-shots; the full
  admin-/trait-gated, blunder-rolled action library is unbuilt). This run is a
  datapoint that **a failed major action should be able to force a resignation**
  (here a double resignation), which is design intent not yet in code.

### 3. First SCRIPTED ENDING reached in testing history (POST 27-30) — designer datapoint
"Ted Insanity," **1778**: during CC President John Adams's term, the Continental
Congress **failed to vote on rejecting the Carlisle Peace (4 aye / 5 nay / 4
abstain)**, and the tie/failure caused the **automatic, immediate adoption of
increased representation in the British Parliament** — a **scripted game-over**.
Flagged in-thread as "a major moment in AMPU history — a playthrough reached a
scripted ending for the first time in testing history!" (POST 28).

**Shipped-vs-designed:** the **scripted ending exists in the build** — the 1772
era graph ships a `carlisle_commission` node (1778+, war active, decider =
**cc-president**) whose **accept** branch leads to the terminal
`dominion_autonomy` ending (`triggersGameEnd: true`), reached from Carlisle-accept
/ Conciliatory-accept / war-weariness-settle (`eraEvents1772.ts:216-310`). The
`GameOverScreen` even has a verbatim historical-contrast line for
`dominion_autonomy` referencing the Carlisle Commission. **Two deltas to flag:**
(a) the shipped build frames acceptance as "self-rule within the empire /
dominion autonomy," whereas the forum run describes the specific outcome as
"increased representation in the British Parliament" — likely a **forum-rules
variant / older copy** of the off-ramp; same mechanic family (Carlisle off-ramp
→ scripted game-over), different flavor label; (b) the shipped node is a
**single cc-president decider with a/b responses**, while the forum version is a
**multi-faction CC tie-vote (4-5-4) that defaults to acceptance on
failure-to-reject** — i.e. a "no decision = adopt the peace" default not
obviously present in the shipped single-decider node.

**Designer tuning stance (the load-bearing datapoint):** the team judged this
**acceptable by design** — "TBH from discussions, I think we're still on the
mark… this early game game-overs aren't really that big of a deal, so it's
probably fine" (POST 29), and a **freak statistical occurrence** — "two
factions rolled a 1 and two rolled 9s out of a d100" (POST 30). So **early
scripted endings are intentionally NOT something to balance away;** the CPU is
deliberately tuned to rarely trigger one. Cross-ref **DH-81** (rev-war
win-model / scripted-ending) and any early-game-over tuning item — this is an
explicit "do not over-protect against early scripted endings" design signal.

### 4. Trait-gain feedback loop — beating a faction electorally can still grow it (POST 24-26)
OrangeP47, intent on "kicking the real Jefferson's ass" and dominating NY for
BLUE (POST 24), is told: **"But you're making his faction more powerful with
trait gains!!!"** (POST 25). Signal for **PV/trait balance:** the
losing/out-of-office faction's politicians can still **accrue traits (and thus
PV/value)** even while losing elections — a built-in rubber-band where
electoral dominance feeds the rival's stat growth. Worth noting for the PV /
trait-gain balance discussion (cross-ref the recurring PV-rework items); no code
change asserted, just a balance observation.

### 5. George Washington rarely wins — senior-general mortality + ahistorical player bias (POST 4-8)
"Has George Washington ever won? Haven't seen it yet" (POST 4). MrPotatoTed:
"it's felt like there was an **intentional effort among human players to get an
ahistorical outcome**. They rarely appoint him as senior general… The one time
he was named Senior General in a playtest I've run, **he died in battle**"
(POST 5). One counter-datapoint: "He did in my 1772 test" (POST 8). Two signals:
- **Player meta-bias toward ahistorical outcomes** — humans deliberately avoid
  the canonical Washington-as-commander path. Flavor/UX note: marquee historical
  figures are not "destined" and players enjoy subverting them.
- **Senior-general mortality.** **Shipped nuance / possible delta:** in the
  build, `applyCasualties` **explicitly excludes the senior general and senior
  admiral from battle-death candidates** (`revolutionaryWar.ts:87`: candidates
  `filter(p => p.id !== war.seniorGeneralId && p.id !== war.seniorAdmiralId)`).
  Senior commanders instead take **skill/Leadership-loss penalties on a defeat**
  (`applyBattleLoss`), not death. So a senior general "dying in battle" (POST 5)
  is **either an older build, a different mortality path (e.g. natural
  death/`recordDeath` coinciding with the war), or a forum-rules variant** —
  flag as a **possible drift between forum experience and current code** (today
  the senior general is death-protected in battle). Open question below.

---

## Other observations (low-signal, logged for completeness)

- **1960 election (1948 run, POST 18):** Dewey/MacArthur vs JFK/Lewis Douglas;
  Dewey nearly wins despite a Pres. Taft resignation + an unpopular Pres. Brooke
  who **lost the GOP primary**; "a last-second New England hurricane" with a poor
  presidential response swings it. Signals already-known systems: **incumbent
  resignation**, **sitting president losing his own primary**, **random
  disaster events with response quality mattering**. Modern polarity.
- **1960 down-ballot (POST 26):** BLUE landslide — Govs 47-5, Senate 79-25,
  House 392-46; **DC, Puerto Rico, and "new states" hold elected offices** →
  confirms **statehood/new-state admission grants governorships + Senate +
  House seats** (admitState pipeline) and that **DC/PR are admittable** in the
  modern arc.
- **1868 Gilded Age (POST 2, 10-17, 32):** GOP convention fight
  (Grant/Douglass/Frémont/Seward); **Grant primaried**, "Liberal Republicans"
  tie in 1872 (POST 10) → **House contingent election** when no majority (POST
  11, "173 GOP to 168 DEMS with 178 needed… go to a house vote"); **"martial
  law in the south"** affects results (POST 17) — Reconstruction-era
  occupation as an election modifier. Deaths by period-accurate disease
  (diphtheria/TB/dysentery, POST 32) — confirms **flavored cause-of-death**.
- **SCOTUS can pre-empt history (POST 33):** 1868 run — **"Plessy v. Ferguson
  denied by Supreme Court 4-5. Segregation banned in United States in 1872-1874
  term!"** Confirms the **Supreme Court case system** can rule the opposite of
  the real outcome (a 4-5 denial) and that a case ruling can have a **national
  policy effect** (segregation banned) — and that cases can fire **decades
  early** relative to history. Cross-ref the SCOTUS/court-case digests.
- **1932 election in the 1928 run (POST 31):** bare mention, no detail.
- **1990s playtest wishlist (POST 7):** "so we could get the legend Ross
  Perot" — no mechanic.

---

## Deltas vs current build / signals (hand-off list)

1. **CC `presidentialEligibility` plank confirmed as the foreign-born lever
   (POST 3).** Shipped (`constitutionalConvention.ts:52-58`, `any_citizen` vs
   `natural_born`). Forum-only extras NOT in build: a **"persuade N states to
   flip a plank"** convention sub-action and a per-plank state whip (build uses
   a proxy governor-approval count). [shipped lever; sub-action = gap]
2. **Presidential succession on resignation/vacancy is GM-only (POST 19-23).**
   `vicePresidentId` exists but no auto VP-succeeds chain in `src/engine/`.
   Reinforces **gap #61**. [delta: unbuilt]
3. **"Major presidential action that can be botched (Admin-gated, forces
   resignation)" is unbuilt (POST 19).** Cross-ref **gap #126 / #23**
   (Executive-Actions library w/ blunder rolls). New requirement nuance: a
   **failed major action should be able to force a (possibly double)
   resignation.** [delta: unbuilt]
4. **Accidental/runner-up VP ("pulled a Burr," POST 23)** — ticket VP can resolve
   to a non-intended candidate; verify the shipped VP-selection path models this
   pre-12th-Amendment quirk in founding eras. [verify]
5. **Scripted ending IS shipped (Carlisle → `dominion_autonomy`, game-over;
   POST 27).** Two deltas: forum flavor "increased representation in
   Parliament" vs shipped "dominion autonomy"; and forum **multi-faction CC
   tie-vote defaulting to ACCEPT on failure-to-reject** vs shipped **single
   cc-president a/b decider**. Cross-ref **DH-81**. [shipped; flavor + default-
   on-tie delta]
6. **Designer stance: early scripted endings are acceptable-by-design (POST
   29-30).** CPU deliberately tuned to rarely trigger one; do NOT add protection
   against early game-overs. [tuning constraint — feeds roadmap "don't fix"]
7. **Senior-general battle-death is currently PREVENTED in code
   (`revolutionaryWar.ts:87`) but the forum reports it (POST 5).** Possible
   drift between forum experience and shipped behavior; today senior
   general/admiral are death-protected in battle (take stat/Leadership loss
   instead). [possible delta — verify which is intended]
8. **Trait-gain rubber-band (POST 24-25):** out-of-office/losing factions still
   gain traits → PV; logged for PV/trait-balance review. [balance signal]
9. **Corroborations (no new delta):** statehood grants offices incl. DC/PR
   (POST 26); House contingent election on no-majority (POST 11); martial-law /
   Reconstruction election modifier (POST 17); disaster events w/ response
   quality (POST 18); sitting president can lose own primary + resign (POST 18);
   SCOTUS can rule against history with national effect, decades early (POST 33);
   flavored cause-of-death (POST 32).

## Open questions

- **Senior-general mortality:** is the death-protection at
  `revolutionaryWar.ts:87` the intended current rule, with POST 5's "died in
  battle" being an older build / a non-battle death? Or is commander battle-death
  intended and missing? (Delta #7.)
- **Carlisle off-ramp:** is the forum's "failure-to-reject → auto-adopt" CC
  tie-default a desired mechanic to add to the shipped single-decider node, or
  is the single cc-president decider the canonical model? (Delta #5.)
- **Carlisle flavor:** should the accept branch's outcome be "dominion autonomy"
  or "increased representation in Parliament" (two different historical
  framings of the same 1778 off-ramp)? (Delta #5.)
