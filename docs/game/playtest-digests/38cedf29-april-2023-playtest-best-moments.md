# Digest — April 2023 Playtest Best Moments

- **Slug:** `38cedf29-april-2023-playtest-best-moments` (topic 1865, politicslounge)
- **Source:** `38cedf29-April_2023_Playtest_Best_Moments.csv` — 30 posts, 1 chunk (~15.3k chars)
- **Type:** Cross-era playtest **highlight reel** (backer-email fodder), anecdotal. Mined for **mechanics signals**, not narrative color.
- **Eras touched (anecdotes, not a single playthrough):** 1772/1786 founding (Continental Congress → Constitutional Convention), 1840 Civil War-era, 1868 Gilded Age, 1928 (Depression), 1948 Cold War (running into the 1950s–2028). Era framing: `docs/game/historical-context.md` (no historian ran this batch).
- **Engine cross-checks done this digest:** `src/engine/constitutionalConvention.ts`, `src/types.ts`, `src/data/scenario1856.ts`, `src/engine/phaseRunners.ts` (meters), grep of `src/` for keynote/Pineapple. Shipped-reality claims below are labeled.

---

## ★ Headline signals (mechanics)

### 1. Sitting SCOTUS justice gave a convention keynote → keynote payoff confirmed + new rule idea (POST 3–7)
- **Event:** Sitting Supreme Court Justice **Sonia Sotomayor gave the keynote speech at the 2028 Democratic National Convention**; afterward former VP Jay Inslee won the presidency (~47 states vs. incumbent President Haley). (POST 3, 6)
- **Payoff mechanic (confirmed):** the keynote speaker **gained `command +1` and a `+1` bonus to the next presidential primary**. (POST 3) — confirms a **convention-keynote-speech payoff** exists in the playtest build.
- **Rule idea raised by designer (Ted):** "We should probably make a rule that **sitting justices can't give the speech** at a party's convention." (POST 4) Others (Will, jnewt) note such a rule "would immediately lead to calls for impeachment/recusal" — i.e. doing it should be *politically costly*, not silently blocked. (POST 5, 6)
- **NEW small rule-idea to capture:** keynote-speaker **eligibility constraint** (sitting justices ineligible, or eligible-but-triggers-impeachment/recusal pressure). Designer-stated, not yet a rule.
- **Shipped reality:** grep of `src/` for `keynote` / convention-speech / `nextPrimary` / `primaryBonus` returns **nothing** — the keynote-speech payoff is **not present in the codebase under those names** (either unbuilt in this build, or named differently / handled by a human GM in the forum game). Cross-ref the convention/keynote system + b44 cabinet note (#124 "cabinet is the only reliable positive meter lever"), which also points at thin convention-driven stat levers.

### 2. Marquee legislation → meters is near-zero impact (recurring gap, strongly corroborated) (POST 28–30)
- **Event:** After veto-proof 1958 Democratic majorities, President **Edward Brooke** signed an unusually productive session: **NASA, Dept. of Transportation, Dept. of Health/Education/Welfare (HEW), repeal of the House-size cap, and PR + DC statehood → 52 states**. (POST 28) **Medicaid** also passed. (POST 29)
- **The gap (player-observed):** "Also passed **Medicaid. Which strangely enough also isn't that big a deal in the game** either… It just **garnered 50 points for a few folks and no meters changed**." (POST 29) — i.e. landmark legislation only awards **PV/points to sponsors**, with **no movement on national meters**.
- **Exploit it enables (player admits gaming it):** "I double-checked it like twice during the voting cause **no way would I let anything pass that might help the meters until we get a Democrat in the White House**." (POST 30) — players deliberately *withhold* marquee bills so the out-party president doesn't get meter credit; because bills don't move meters, there's near-zero cost to stonewalling.
- **Shipped reality:** meters are heavily present in the engine (`phaseRunners.ts` has 84 meter refs), so meters exist — the gap is the **legislation→meter wiring**, not meters themselves. **Major balance gap.** Cross-ref the legislation/meters gap thread(s) and the b44 cabinet "only reliable positive meter lever" note (#124): if cabinet is the *only* reliable lever, marquee bills having no meter effect is the same hole from the other side.

### 3. Constitutional Convention — 3/5 compromise + ratification mechanics (POST 22, 24, 26–27)
- **Setup (1786):** Debate over disbanding the Continental Congress to hold a Constitutional Convention. South united in opposition; most North/border states in favor. CT (two reps, one player) was the deciding vote with NH abstaining. (POST 22, 24)
- **CC ratification threshold (confirmed):** the Convention produced a Constitution but the North "went way too hard," **refusing to accept the 3/5 slave compromise**; they got **only 8 of the needed 9 Governors to ratify**, nearly scrapping it back to the Continental Congress. (POST 26) **→ confirms ratification needs 9 governors.**
- **Per-delegate persuade roll (confirmed):** ratification was clutched when **a random Georgia delegate succeeded on a 25% chance to convince his Governor to sign**. (POST 26) **→ confirms a per-delegate/per-governor persuade roll exists** (and was low-probability here, ~25%).
- **Consequence — slave-compromise choice drives Southern apportionment (designed):** because the 3/5 compromise was **refused**, "the **South has almost no political power** as their **electoral votes and number of Reps in the House have been depleted**." (POST 26) **→ the slaveCompromise article choice should drive Southern EV/Rep apportionment** (refusing 3/5 ⇒ slaves not counted ⇒ fewer Southern EVs/seats).
- **Shipped reality (delta-rich):**
  - `slaveCompromise` **is** a real CC vote in the engine — options `three_fifths` / `full` / `none` (`constitutionalConvention.ts` L34–38), default `three_fifths` (L140); also referenced in `scenario1856.ts`.
  - **Ratification threshold matches:** `conv.ratified = approve >= 9` (L192). ✔
  - **BUT ratification is decided by governor "bias as proxy," not a per-delegate persuade roll:** `govApproves = gov.partyId === 'RED' || chance(0.5)` (L189). The 25%-Georgia-delegate persuade flow is **not** how the shipped code works. **Delta.**
  - **AND the slave-compromise choice has NO apportionment consequence in code.** Post-ratification EVs are set uniformly: `s.electoralVotes = Math.max(3, (s.ccDelegateSlots ?? 2) + 1)` for every state (L210) — it never reads `slaveCompromise`. Southern EV/Rep depletion from refusing 3/5 is **designed/observed but unbuilt.** **Major delta.**
  - Cross-ref `constitutionalConvention.ts` + the **alt-states EV digest** note on the colony→republic EV rewrite (`78e0d55b-alt-states-ev-project`): both point at the same apportionment-rewrite surface that needs to become compromise-sensitive.

---

## Secondary signals

### Assassination — three sources (POST 18–21)
Player asked how assassinations work (intent? leaning? downstream effects?). Answer (Will): assassinations come from **(a) scripted events**, **(b) a very unlikely general event**, and **(c) the "Pineapple Primary" convention event** — a candidate at the convention is killed. (POST 19) Framed as "**the Robert Kennedy event**." (POST 21)
- Body count cited: Pineapple Primary killed **Boss Tweed (1840 run)** (POST 19) and **Grant before that** (POST 20).
- **→ Capture the three assassination sources.** Forum doesn't confirm assassin *intent/leaning* feeding downstream state (the question went unanswered on that point) → see open questions.
- **Shipped reality:** grep of `src/` for `Pineapple`/`pineapple` returns **nothing** — the Pineapple Primary event is **not in the codebase under that name** (scripted-event content likely not ported / GM-run). Flag for the events backlog.

### Fringe-faction viability (POST 22, 24)
A "tiny but mighty" faction of **only 2 reps** (CT, of 39 total) cast the **deciding CC vote** on whether to keep the Continental Congress or move to a Convention. Player (OrangeP47) frames it as a deliberate proof point: "it shows **power does ebb and flow, and the fringe factions are viable**." (POST 24) — signal that small factions *should* remain pivotal/playable, a design value.

### Era-event / executive-power anecdotes (minor, mostly flavor)
- **First Black president via succession:** **VP Edward Brooke became President in 1958** after **President Taft's resignation** — "first African American President 50 years before Obama." (POST 10) Confirms VP→President succession on presidential resignation. (Brooke is the same president who later signs the 52-state session above — succession then governs.)
- **Ending Reconstruction via Executive Action:** Whig/Union-Loyalist **President Robert E. Lee ended Reconstruction via Executive Action.** (POST 8) Confirms **Reconstruction can be ended by an executive action** (designed lever; verify it exists in build — not checked this digest).
- **First Black SCOTUS justice (in-game):** Gilded Age playtest — **Ordinatus Wall appointed Associate Justice**, "first black man and first ex-slave on the Supreme Court." (POST 25) Flavor; confirms SCOTUS appointments flow.
- **SCOTUS seat count is dynamic:** "The Supreme Court has recently **added another seat** and lost 2 associate justices as well as Chief Justice Chase." (POST 23) Confirms court-packing/seat-count changes during play.
- **Era scripted-event timing (flavor):** 1928 playtest — Hoover hit by "**(late) Wall Street Crash and (early) Dust Bowl**" on the eve of the 1932 election (POST 9); cast as "modern-day FDR vs. Haley's Hoover" (POST 7, 11). Suggests scripted economic shocks fire on a window, not an exact historical date.
- **State admission via riders/omnibus (flavor):** 1874–76 term — 5 planned admissions cut to 1 because **riders on a Senate Foreign/Military omnibus delayed four states**; only Durango (Mormon settlement) admitted, Whigs sweeping its provisional elections. (POST 16) Touches state-admission timing + legislative-rider interaction.

---

## Deltas vs. current build / signals (handoff)

| # | Area | In the build today | Observed/designed (forum) | Delta / requirement | Source |
|---|------|--------------------|---------------------------|---------------------|--------|
| 1 | **Legislation → meters** | Meters exist (`phaseRunners.ts`); marquee bills award PV/points to sponsors | Medicaid + 5 other landmark bills passed → **"no meters changed," just ~50 pts to a few folks** | **HEADLINE BALANCE GAP:** wire marquee legislation to national meters/enthusiasm. Currently bills are meter-inert ⇒ players stonewall the out-party president at zero cost. | POST 28–30; cross-ref legislation/meters gaps + b44 #124 |
| 2 | **CC 3/5 compromise → apportionment** | `slaveCompromise` is a CC vote (3/5 / full / none) but **EVs set uniformly, ignoring the choice** (`constitutionalConvention.ts` L210) | Refusing 3/5 **depleted Southern EVs & House Reps** | Make post-ratification EV/Rep apportionment **read `slaveCompromise`**; refusing 3/5 ⇒ South loses EVs/seats. Ties to colony→republic EV rewrite. | POST 26–27; engine L140/L210; cross-ref `78e0d55b` alt-states EV |
| 3 | **CC ratification roll** | Ratify if **≥9 governors approve** (✔ matches); approval via **governor "bias as proxy"** (`chance(0.5)` / party) | ≥9 governors (✔); decided by a **per-delegate ~25% persuade roll** convincing a governor | Threshold correct; replace bias-proxy with **per-delegate/governor persuade rolls** (low-prob clutch outcomes like the 25% Georgia delegate). | POST 26; engine L189, L192 |
| 4 | **Convention keynote payoff** | **Not found in `src/`** (no keynote/primary-bonus code) | Keynote speaker gains **command +1 + `+1` next primary** | Confirm/implement convention **keynote-speech payoff**; thin convention stat-levers tie to b44 #124. | POST 3 |
| 5 | **Keynote eligibility (NEW rule idea)** | n/a | Designer: **sitting justices shouldn't keynote** (or it should trigger impeachment/recusal) | New small rule: keynote eligibility constraint, ideally as a *costly* action (impeachment/recusal pressure) rather than a hard block. | POST 4–6 |
| 6 | **Pineapple Primary / assassinations** | **Not found in `src/`** (no `Pineapple`); scripted-event content likely unported | Assassinations from **(a) scripted events, (b) rare general event, (c) Pineapple Primary** convention kill ("RFK event") | Capture the 3 assassination sources; backlog the Pineapple Primary convention event. | POST 19–21 |
| 7 | **Fringe-faction viability** | (not assessed) | A 2-rep faction cast the deciding CC vote; "fringe factions are viable" stated as a design value | Design value to preserve: small factions remain pivotal/playable. | POST 22, 24 |
| 8 | **End Reconstruction via Executive Action** | (not verified this digest) | President Lee ended Reconstruction via Executive Action | Verify an executive action exists to end Reconstruction. | POST 8 |

## Open questions
- Does an assassin's **intent/political leaning** feed downstream game state (POST 18 asked; unanswered)? Or are assassinations purely an outcome with no actor-attribution effects?
- Is the keynote payoff (command +1, +1 next primary) a **forum/GM convention** or was it ever a coded mechanic? grep found nothing under that name.
- Reconstruction-via-Executive-Action: is this a generic executive action or a Reconstruction-specific scripted lever? (Not checked against engine this digest.)
- For delta #2: does refusing 3/5 reduce EVs/Reps *proportionally to enslaved population*, or a flat penalty? Forum says "depleted"/"almost no political power" but not the formula.

---
`wc -l` of this digest: **81 lines** (`wc -l docs/game/playtest-digests/38cedf29-april-2023-playtest-best-moments.md`).
