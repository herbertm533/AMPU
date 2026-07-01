# Digest — "What Are Your Favorite Playtest Moments So Far?"

- **Slug:** `29902e8e-what-are-your-favorite-playtest-moments-so-far`
- **Source:** `29902e8e-What_Are_Your_Favorite_Playtest_Moments_So_Far.csv` (1 chunk, 6 posts, ~2.4k chars)
- **Type:** emergent-narrative solicitation / systems snapshot (players + GMs naming favorite moments; each moment names a SHIPPED system)
- **Date:** Nov 2022
- **Batch:** b60
- **Verified against:** `src/` HEAD (this run)

> **Why it matters:** Six short posts, but each favorite moment is a *feature witness* — it tells us which systems existed and worked in the live multiplayer playtest at Nov-2022. Two of them (the **party platform** that swings elections, and the **Senate Majority Leader toolset** that LBJ wielded) are systems the current single-player build **does not ship**, and one (**LBJ as Senate Majority Leader**) directly resolves a cross-batch contradiction: b58#330 flagged "Senate Majority/Minority Leader" as a MISSING office — this thread confirms it EXISTED in the forum game, so #330's missing-office claim is CORRECT for the build but the office is a real designed feature, not GM flavor. The **contingent election to the House** and the **SCOTUS election-challenge** are also live forum systems with no build analog.

---

## ★ SENATE MAJORITY LEADER office + toolset (post 4) — KEY VERIFICATION

Player: *"my favorite moment was having LBJ as the iron-fisted Senate Majority Leader. The suite of tools the game makes available at that point really adds another level to the gameplay… added pressure if you're dealing with multiple human players."*

**Resolution of the b58#330 contradiction (this batch's key check):**
- **Shipped office enum** (`types.ts:1111` `OfficeType`) contains **`SpeakerOfHouse`** and **`SenateProTem`** — and NO `SenateMajorityLeader` / `MajorityLeader` / `MinorityLeader` / `SenateLeader`.
- `GameState` (`types.ts:1581-1582`) tracks only `speakerId` and `proTemId`. There is no majority-leader slot, no leader-toolset engine, no `majorityLeader` field anywhere in `src/` (grep: zero hits).
- Congressional leadership phase `2.2.1` (`phases.ts:13`, `phaseRunners.ts:1883`) elects **Speaker + Pro Tem only**; the Pro Tem chair grants a Legislative skill point and nothing more — no "suite of tools."
- **Verdict:** The forum game HAD a **Senate Majority Leader office with an active toolset** (a real designed feature the multiplayer game shipped, "the suite of tools the game makes available at that point"). The current single-player build does **NOT** ship it — only Speaker + Pro Tem, and Pro Tem has no toolset. **b58#330's "missing office" claim is CONFIRMED as a real build gap** (not GM flavor / not already-shipped). The "iron-fisted" flavor also maps to the shipped **`Iron Fist`** trait (`types.ts:89`), but that trait is a governance/PV modifier, not the leader office/toolset.

## ★ PARTY PLATFORM that swings elections ±5 (post 2)

Player: *"breaking the old platform rules to swing an election +5 towards the GOP was nice."*

- **Shipped state:** NO party-platform system. Grep for `platform` / `Platform` / `plank` / `Plank` across all `*.ts` in the repo returns **zero hits**.
- The forum game had a **party platform mechanic** whose rules, when leveraged ("breaking the old… rules"), could swing an election by a **large fixed magnitude (+5)** toward a party. "The old platform rules" implies the rules had already been revised at least once in the forum game — a tuned, iterated system.
- Nearest shipped analog: `partyPreference` / `bias` are the ±5-clamped national/state election levers (`phaseRunners.ts:3389,3412`), and PR4a trait bands top out at LARGE=8 — but there is no *player-chosen platform* that produces a swing. This is a **player-agency election lever** with no build equivalent.

## ★ CONTINGENT ELECTION to the House (post 3)

Player: *"I like how 1840 sent two consecutive Presidential elections to the House."*

- The 12th-Amendment mechanic: when no candidate wins an Electoral-College majority, the **House of Representatives decides** the Presidency. In this forum game it **fired twice consecutively** (both around an in-game 1840).
- **Shipped state:** `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752`) sums per-state EV and declares `winner = blueEv > redEv ? blueCand : redCand` — a **plurality/higher-EV winner-take-all with no majority threshold and no House fallback**. There is no tie handling (a `blueEv === redEv` tie silently resolves to RED via the `>` comparison), no no-majority path, and grep for `contingent` returns zero hits. The build is strictly two-party (`PartyId = 'BLUE' | 'RED'`), so a third candidate splitting the EC — the usual trigger for a House contingent election — cannot even arise from the general (third-party check `2.9.3` currently no-ops, `engine.ts:70`).
- **Verdict:** contingent-election-to-the-House is a **designed system present in the forum game, absent from the build**.

## ★ SCOTUS ELECTION-CHALLENGE resolution (posts 5 & 6)

Players: *"the election which was brought before the Supreme Court in the 1840s playtest. I did my own graphic to show the votes of the justices. Greens voted to hold up the winner in the state, red means they agreed with challenging the result."* (post 6 agrees, calls it hand-in-hand with the contingent-election answer.)

- The forum game could take a **contested election result before the Supreme Court**, where **each justice casts an individual up/challenge vote** (green = uphold the state winner, red = challenge the result) and the tally decides whether the election stands.
- **Shipped state:** `runPhase_2_5_3_Court` (`phaseRunners.ts:3397`) generates an **abstract policy case** from a fixed title list ("Property rights vs. federal regulation", "Interstate commerce dispute", etc.), computes a conservative-vs-liberal **ideology headcount** of the justices, logs a majority ruling, and nudges `partyPreference` by ±0.1. The `SupremeCourtCase` type (`types.ts:1548`) is `{ title, description, decided, ruling?: 'majority'|'minority', effect? }` — **no linkage to any `ElectionResult`, no per-justice vote record, no uphold/overturn of an election.** `pendingCourtCases` (`scenario1856.ts:175`, `scenario1772.ts:95`) both seed `[]`.
- **Verdict:** the shipped court is a policy-ruling flavor engine; the **election-challenge-before-SCOTUS (per-justice uphold/overturn vote on an election)** is a distinct forum system with **no build analog**. Note the co-occurrence in the thread: contingent election + SCOTUS challenge were tied together in the *same* 1840s playtest — suggesting a designed disputed-election resolution track.

## ★ FACTION-vs-PARTY tension (post 2) — corroboration

Player: *"the balancing act of doing what is best for my faction vs doing what is best for my party… when to strike at an allied faction to snipe a Congressional seat or governor's mansion and when to play nice and cede seats."*

- Restates the game's #1 strategic axis (faction-vs-party; the single-player-vs-multiplayer distinction). In the forum game this is **inter-player** tension: allied human players in the same party competing over Congressional seats / governorships. The current build models factions and a two-party frame (`factionCenter`, faction-leader challenge at `phaseRunners.ts:1962`, `partyPreference`) but the *sniping / ceding of individual seats between allied players* is a multiplayer negotiation layer, not an SP mechanic.
- **Corroboration only** — no new delta (maps to the existing single-player-vs-multiplayer gap).

## ★ GM emergent narrative — the bumbling Whigs (post 2) — lore

GM: *"the Whigs in the Civil War playtest… have somehow bumbled every chance they have at the Presidency… lovable oafs."* Pure emergent-narrative lore (a CPU/allied party losing repeated Presidential bids); a witness that the **1856 / Civil War era** playtest was live and multi-cycle. No mechanic delta; documents that presidential contests recur across many cycles and a party can lose all of them.

---

## Shipped-vs-designed (verified against `src/` HEAD)

| System (post) | Forum/designed behavior | Shipped in build? | Evidence |
|---|---|---|---|
| Senate Majority Leader office + toolset (4) | Real office with a "suite of tools" (LBJ) | **NO** — enum has only `SpeakerOfHouse` + `SenateProTem`; Pro Tem = +1 Legislative, no toolset | `types.ts:1111,1581`; `phaseRunners.ts:1883`; grep `MajorityLeader`=0 |
| Party platform → ±5 election swing (2) | Player-set platform whose rules swing an election a fixed amount | **NO** — no platform system anywhere | grep `platform`/`plank`=0 across repo |
| Contingent election to the House (3) | No-EV-majority → House decides; fired twice ~1840 | **NO** — higher-EV winner-take-all, no majority threshold, no House fallback, no tie handling | `phaseRunners.ts:3752-3798`; grep `contingent`=0 |
| SCOTUS election-challenge (5,6) | Contested election → per-justice uphold/challenge vote decides if it stands | **NO** — court rules on abstract policy cases via ideology headcount, nudges `partyPreference`; no election link | `phaseRunners.ts:3397-3415`; `types.ts:1548` |
| Faction-vs-party seat sniping (2) | Allied human players contest/cede individual seats | **Partial/SP-only** — factions + two-party frame shipped; inter-player negotiation is MP | `phaseRunners.ts:1962`; `factionCenter` |
| "Iron Fist" flavor (4) | LBJ authoritarian leadership | Shipped as a **trait** (governance/PV modifier), not a leader office | `types.ts:89` (`Iron Fist`) |
| Whigs bumbling the Presidency (2) | Emergent GM lore, Civil War era | N/A — lore witness that 1856 era + recurring pres contests were live | post 2 |

---

## Delta list (map to EXISTING gap IDs; NEW = consolidation to assign)

1. **Senate Majority Leader office + toolset** — maps to / **CONFIRMS b58 #330's missing-office claim.** #330 flagged the office as MISSING from the enum; this thread proves it was a *real, tool-bearing feature of the forum game*, so #330 is CORRECT (build gap, not flavor). Requirement: add Senate Majority (and likely Minority) Leader offices + a leader-action toolset. (map to **#330**; label the toolset scope **NEW** if #330 covered only the office slot.)
2. **Party platform → ±5 election swing** — no existing owner found (grep-clean). **NEW** (consolidation to assign an ID): player-selectable party platform whose planks apply a fixed election swing; "old platform rules" implies a tuned/iterated system in the forum game.
3. **Contingent election to the House (no-EV-majority → House decides)** — maps to nomination/election gaps **#185/#331**; the specific 12th-Amendment House contingent path is likely **NEW** (consolidation to confirm vs #185/#331). Build ships winner-take-all with no majority threshold, no House fallback, no tie handling.
4. **SCOTUS election-challenge (per-justice uphold/overturn vote on an election result)** — maps to court-decision gaps **#270/#66**; but those cover *policy* court cases. The *election-challenge* variant (justices vote to uphold/challenge a contested election) has no build analog — likely **NEW** (consolidation to confirm vs #270/#66). Note thread ties it to the contingent election → possible combined disputed-election resolution track.
5. **Faction-vs-party seat sniping between allied players** — maps to single-player-vs-multiplayer gap **#1/#114**. Corroboration only (MP negotiation layer, no SP delta).
6. **Whigs bumbling the Presidency / GM emergent narrative** — lore only; witnesses live 1856/Civil War era + recurring multi-cycle presidential contests. No delta.

## Open questions (for the human / consolidation)

- Does #330 already scope the Senate-leader *toolset*, or only the office slot? (This thread mandates the toolset — "the suite of tools the game makes available.")
- Are the **contingent election** and **SCOTUS election-challenge** one combined "disputed election" system in the forum game (they co-occur in the same 1840s playtest, posts 3/5/6), or two independent systems?
- What were "the old platform rules," and what is the platform's full swing table (only the +5 magnitude is witnessed)?
