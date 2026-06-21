# Digest — `f4c7c2c4-ampu-1800-playtest-continued-1868`

**Source:** `f4c7c2c4-AMPU_1800_Playtest_Continued_1868.csv` (343 posts, 5 chunks)
**Forum:** politicslounge.com topic 6952 ("AMPU 1800 Playtest Continued 1868")
**Game master:** `@ebrk85` (handles dice rolls, scoring, narration)
**Read posture:** This thread is a *continuation* of an earlier "AMPU 1800" thread (post 1: "as my other playtest started having issues once we got into the 400s of pages"). It picks up at 1868 and runs through the start of the 1872 half-term.

## Thread scope

- **Years covered:** 1868–1872 (about 2 full half-terms: the 1868–1870 turn and the start of the 1870–1872 turn). Posts 1–298 = 1868–1870; posts 299–343 = 1870–1872 turn opening.
- **Era:** Gilded Age (1868–1892). Post 1 explicitly frames the era and its leading issues: corruption / civil-service reform, **tariff**, **currency reform (Gold Standard vs Free Silver)**, **imperialism** (island naval bases), and "many social activist groups — feminists, socialists, communists, prohibitionists, eugenicists, labor activists." Mentions "would influence the next era greatly" — confirming a *post-Gilded-Age* era beyond the build's `modern` bucket.
- **Players (8 humans + 2 CPU "factions"):**
  - Blue / Democrats: `@dkh64` (Mavericks), `@jnewt` (War Democrats), EuriCPU (Moderate D-R), SKCPU (Noell D-R), DinkCPU (Conservatives) (post 298 leader scorecard)
  - Red / National Republicans: `@10centjimmy` (Re-Sprague-licans), `@matthewyoung123` (Moderates), `@Brocklin` (Finance NR), `@Vicx` (Radical Republicans), `@Arkansas Progressive` (Conservative NR)
- **GM cadence:** GM posts a numbered phase header (e.g. "2.1.1 Politician Draft", "2.1.4 Relocate Politicians", "2.4.3 EraEvos") and tags the players whose input he needs; players reply with text; GM resolves with `Succeeds 14/25` / `Fails 99/25`-style dice notation (`roll/threshold`).

## Mechanics CONFIRMED in the build (with the codebase line that implements them)

| Forum mechanic | Posts | Code |
|---|---|---|
| Phase taxonomy: 2.1.1 Draft, 2.1.2 Career Track, 2.1.3 Flip-Flopper, 2.1.4 Relocations, 2.1.5 Ideology Shifts, 2.1.6 Conversions, 2.1.7 Kingmakers, 2.1.8 Faction Personalities; 2.2.1 Congress Leadership, 2.2.3 Faction Leaders, 2.2.4 Party Leaders; 2.3.1 Presidential Appointments; 2.4.1 Death/Retirement, 2.4.2 Anytime Events, 2.4.3 Era Events; 2.5.1 Lingering, 2.5.3 SCOTUS; 2.6.1 Proposals, 2.6.6 Scoring; 2.8.1 Exec Actions, 2.8.2 Compelled Retirements | 1, 12, 26, 27, 37, 49, 50, 67, 85, 86, 113, 122, 125, 132, 151, 152, 196, 201, 204, 299, 311, 323, 324, 341 | `src/phases.ts:3-47` exposes the same numbered taxonomy. Strong alignment signal. |
| Relocations: "FOUR total attempted moves per half-term", overpop/underpop list, ALT-STATE moves don't count, dice succeed/fail with carpetbagger penalty | 27, 28, 31, 33-36 | `relocationOdds` (`phaseRunners.ts:544`), `RelocationBand` (`types.ts:1671`), Carpetbagger trait awarded on cross-region success |
| Ideology shifts: base 3, +iron-fist/+propagandist/+manipulative, +party-leader bonus (max 9) | 27, 311 | Implemented; `LEADERSHIP_RULES.oratorIdeologyShiftBonus` (`phaseRunners.ts:747`) — but stacking caps need verification |
| Kingmaker/Protégé pairing, max 5 active, +Leadership unlocks a 6th; protégé gains skills/expertise/traits + sometimes +1 Command | 37, 38, 40, 47, 48, 311, 312, 316, 322 | `KINGMAKER_RULES`, `types.ts:295` |
| Conversions: party leaders flip across parties (target needs "Can Party Flip"); same-party flips need target Pliable + adjacent ideology | 37, 311, 316 | Conversion phase 2.1.6 exists; trait gates partly implemented |
| Cabinet seats: era-gated set (State / Treasury / War / AG / PostMaster / Navy / Interior + Ministers to UK/France/Spain/Prussia/Russia/China + Sr General / Sr Admiral / General / Admiral); Senate confirmation roll-call; max 3 reds in Blue cabinet | 87, 92, 100, 102, 104 | `cabinetSeatsForYear` (`types.ts:1196`), `CABINET_SEAT_SCORING` (`types.ts:1221`) |
| Cabinet scoring per faction; +Admin gains for cabinet members; "no representation in cabinet → -1 in next pres race in those regions" | 112 | Scoring exists. The *region-penalty* part is not visible in code grep — likely a delta |
| Era events (2.4.3): named scripted events with Response A/B/C decisions, decided by Pres / Congress / Egghead-Cabinet, with ideology-card and meter effects | 125, 126, 127, 128, 129 | `EraEvent` (`types.ts:1466`), `decider`, `EraEventResponse` |
| Anytime events (2.4.2): single-pol gains (governor gains Command, judicial influence shift, etc.) | 122-124 | `anytimeEvents.ts` |
| Lingering phase: per-meter "Lingering, Volatility helps", "Revision to Mean hurts", cabinet trait effects on meters | 132 | Phase 2.5.1; meter rules in `types.ts` |
| SCOTUS Decisions phase scoring real historical cases | 151 | Phase 2.5.3 exists |
| Bill scoring: ideology / interest / lobby card hits, ±50/100/150 pts; faction "best-platform" tiebreaker rules | 196, 197, 226, 233-239, 251 | Scoring infrastructure exists; *card-aware* scoring matches `Faction.ideologyCards/lobbyCards/interestCards` (`types.ts:1298-1300`) |
| Old-age stat decay; deaths with cause-of-death narration | 113, 297 | `MORTALITY_RULES` (`types.ts:507`) |
| Trait conflicts: Predictable cancels Manipulative; Integrity cancels Disharmonious | 1099, 1102 | `TRAIT_CONFLICTS` (`types.ts:658`) |
| Governor's actions (2.5.x): "build roads, bridges, canals", "Establish State Bank", "Major Irrigation Project", "Gerrymander", "Increase Manufacturing/Maritime", prereq skills | 134-150 | Phase exists but action *library* not in code (see deltas) |
| Presidential primaries/conventions/elections (2.9.x) with delegate counts | 220, 229, 243, 246, 267 | Phase scaffolding exists |
| Senate appointments to fill vacancies by Governor | 114-117, 283-295 | `governor.appointSenator` flows exist |
| Faction nicknames + scoring leaderboard | 298 | `Faction.nickname` is in the model (`types.ts:1297`) |

## Mechanics OBSERVED but NOT IN THE BUILD (the gold)

These are the deltas the engine needs to absorb. Cited by post.

### A. New Gilded-Age era + era model

1. **A whole new era ("Gilded Age 1868–1892") with its own draft-ideology mix.** Post 1: *"With the new era draft ideologies were updated. Only one change through as @Brocklin is now drafting Prog/Lib instead of Lib/Mod."* The build has no era past `nationalism` reachable; `modern` exists in rule tables but no scenario. The forum treats 1868 as a *new era* with **updated faction-typical ideologies** — this is a per-era ideology drafting profile not modeled in code.
2. **An era beyond Gilded Age is referenced** (post 1: "would influence the next era greatly"). Confirms a Progressive-Era-or-later scenario is part of the documented game.

### B. Gilded-Age issue axes — none present in code

3. **Currency / Bimetallism axis** (post 155, 164, 175, 188, 190): Sec Wentworth proposes *"US dollar as the nation's currency using gold and silver bullion, the latter to incur some inflation to aid in debt repayment"*. Sen Hale filibusters Bimetallism (post 190). The code has zero mentions of `currency`, `gold-standard`, `silver`, `bimetal`, `tariff` outside the existing meter set.
4. **Tariff as a platform plank** (posts 152 note "we can't pass a new tariff until next legis phase"; 224 `Economic: Set average tariff to 36%`; 248 `Set average tariff rate to 8%`). The platform tariff number is read as a meaningful party position; the engine has no tariff state.
5. **Civil-service reform / anti-corruption frame** (post 1 era brief). Specific anti-corruption "Swing around the circle" exec action exists in play (post 202) but the engine has no `civil-service` mechanic.
6. **Imperialism** (post 1, era 1868–1892 brief: "looking at islands for naval bases"). No imperial-acquisition system in code (the codebase only has `expansionStates.ts` for continental admission).

### C. Social-activist groups missing from interest-group taxonomy

7. **New ideology / interest cards observed in faction personalities** (post 49 — 2.1.8): `Big Corporations`, `Big Tech`, `Big Pharma`, `Big Oil & Gas`, `Big Agriculture`, `Globalist`, `Wall Street`, `Free Trade`, `Protectionist`, `Law & Order`, `Welfare`, `Human Rights`, `Civil Rights`, `Reformists`, `Environmentalists`, `Theocrats`, `Public/Private Education`, `Public Healthcare`, `LW Media / RW Media`, `Pacifists`, `Isolationists`, `Nationalists`, `Expansionists`, `LW Activists / RW Activists`, `Labor Unions`, `Public Housing`. Many anachronistic for 1868 — these are the **multi-era card pool**; the build's per-era card decks need to grow / be era-gated. (See `Faction.ideologyCards`, etc. — current set unknown without re-grep.)
8. **Activist groups missing entirely:** feminists, socialists, communists, prohibitionists, eugenicists, labor activists (post 1). Some are mentioned but the *forum game itself* may not surface them in 1868–1870 — they show up in era brief as a *forecast* for the next era. Open question whether code needs them now or later.

### D. Legislative micro-mechanics (committee → floor)

9. **Committee block-and-replace** (posts 160-163): a committee chair can *block* a bill and substitute a different bill, **but only from their own committee's domain**. Vicx tried to block a Judicial bill with a Domestic replacement and was refused (post 163). The build has phases 2.6.1 Proposals → 2.6.2 Review → 2.6.3 Floor but no block-and-replace machinery.
10. **Packaging bills** (posts 176-179, 188, 194): committee chair can *package* multiple committee bills into a single floor vote (`S1 (Packaged)`, `H.R.1 (Packaged)`, `H.R.2 (Packaged)`). The package is voted as one. Build has no packaging concept.
11. **Filibuster** (posts 189-194): after the House vote, before the Senate vote, each faction's senator with seniority/the floor can *filibuster* one bill/package; if filibustered, that bill dies. Post 190 Vicx filibusters Bimetallism, post 194 shows it as `Filibustered`. Build has nothing.
12. **`*Crisis Bill*` tag** (posts 160, 164, 167, 176): the GM marks certain bills as `*Crisis Bill*` (e.g. `Relocate native tribes in Minnesota` is the crisis bill of the domestic Native-relations crisis; `14-Year Residency Period of Naturalization` is the crisis bill on Anti-Naturalization). These bills attempt to *resolve* an active national crisis. The trait system has `Crisis Admin`/`Crisis Gov` but no concept of a *bill* tied to a crisis.
13. **Presidential signing decision and override** (post 195: "The Passive Pres Clinton will sign all the bills into law."). Pres's `Passive`/`Pliable` traits determine auto-sign behavior; engine has signing infrastructure but personality-driven auto-sign is unclear.
14. **Bill scoring uses *all* of a faction's ideology+lobby+interest cards, not just the leader's ideology** (post 237). The forum has had multiple players surprised by this — explicitly clarified as the rule.

### E. Convention machinery (2.9.2)

15. **Multi-ballot convention with unit rule, momentum, presidential promises, kingmaker boosts, ballot shifts** (posts 220, 229-246):
    - **Unit rule** can be in effect; a candidate can call a vote to *suspend* it.
    - **Momentum** carries +1 boost on the next ballot for biggest-gainer / nomination orator's high roll.
    - **Inter-ballot actions**: Force a Rules Change, Presidential Promise (trade endorsement for a cabinet seat, e.g. post 241 "Faulkner will promise SKCPU's faction the Secretary of State position for Levin's endorsement"), Drop out & endorse, Kingmaker interference (5-6 roll for ±1 momentum on allied candidate), Request a ballot shift.
    - **Ballot shift** mechanic: post 245-246 — Vallandingham and Nelson shift their delegates to Faulkner, *changing the displayed counts retroactively* on the same ballot.
    - **Nominator's speech roll** (1d6) drives momentum: Orator trait + roll of 5 (post 220 Sidney Perham) gives +1 momentum, roll of 1 (post 227) is booed off and *costs the nominee Orator + gives the ticket -1*.
    - **Keynote Speaker** is a separate role chosen by another faction; rolls separately (posts 222, 247, 252).
    - **Major candidate**: faction leader OR celebrity with Command; **minor candidate**: anyone with Command; **favorite-son**: holds a state delegation without serious presidential ambition. A faction can run *one major + (one minor OR one favorite-son)* (post 211).
    - **Platform** is split across 5 planks (Domestic / Foreign / Economic / Judicial / Executive) and can be *delegated to other factions* (post 223). Bills can substitute for planks (e.g. post 224 "Foreign: Peacetime Military Draft" — a bill that just failed).
16. **Platform scoring rules**: 4-step comparison vs other party (post 226):
    - Do the points-the-party-would-gain exceed the other party's?
    - Does the lowest-scoring faction with the platform exceed the other party's lowest?
    - Does the nominee's personal ideology score the most?
    - +1 pt per "yes". Plus negative-scoring ideology enthusiasm shifts.
    - "Delegating the platform" gives Mod enthusiasm +2 toward the delegating party.
17. **VP impact scoring** (post 225, 250): 10 binary checks (different faction, ideology, age spread, age, age, incumbency, outsider, big/small state, region, obscure-or-not + d100 roll). Net +/- contributes to party preference.
18. **Scandal rolls** for major candidates (posts 255, 262): 1d6, on a 6 a scandal; magnitude 2d6; `Integrity` trait grants immunity.
19. **General-election actions** (posts 256-265): faction nominees can each turn take "Give a Speech" (VP or FL, target a state, 5-6 roll for +1 in that state; Orator gets a separate 5-6 roll for +1 party pref) and "Send VP to Shore Up Support" (VP region with Likable / Harmonious / Unlikable / Disharmonious / Provincial / Cosmopolitan / Delegator branches).
20. **State of the Meters → election bonuses** (post 266): each national meter contributes a bonus or penalty to either party (Rev/Budget +Trad +1 / -Prog enthusiasm; Domestic Stability +1 → incumbent -1; Honest Gov't = no effect; Party Pref → numeric advantage). This *translation* of meters into election bonuses is documented; the build has meters but the mapping to election bonuses isn't visible.
21. **Faithless electors** (post 267): random per-state desertions in the EC tally.
22. **VP's role in succession**: post 276-277 confirms an amendment to fill VP vacancies via Pres nomination — a rule the build needs as a `Constitutional Amendment` state with effects.

### F. Governor's actions library

23. **A library of governor actions** is mid-game executed (posts 134, 136, 138, 139, 142, 147, 150). Confirmed action names (each rolls d100 vs threshold = 20·Gov):
    - Build roads, bridges, canals
    - Increase Maritime / Manufacturing / Agriculture / Mining / Finance industry
    - Major Irrigation Project (needs same-party Senator!)
    - Establish State Bank
    - Gerrymander (needs Iron Fist / Justice / Controversial)
    - Build State University
    - Improve best industry
    - Women's Suffrage in State (Vicx NY: "1st in the nation!", post 150)
    - Increase state government jobs
    - 2-year / 4-year terms for Gov (changes term length)
    - Discriminate against former Secessionists (only if state seceded)
    - **Enact a Variety of Jim Crow Laws** (post 139 — WT enacted; 300pts to player, "1st state in the nation")
    - **Anti-Corruption campaign** (referenced in post 149 as historically hard) — mechanic exists
    None of these governor actions appear as executable engine logic. Phase 2.5.1 has Lingering math but no `governor.takeAction`.
24. **State-level Jim Crow ON/OFF flag and Prohibition ON/OFF flag** (post 125): "Poll Tax is turned on in these states", "Prohibition is turned on in these states". The forum carries persistent state-level *policy switches* visible across the country (TN, GA, MS, AR for poll tax; KS, IA for prohibition). Engine has no `state.policies[]` of this kind.
25. **3x point multiplier on Jim Crow Gov actions for 30 years** (post 125): time-bounded multiplier. No engine support.

### G. House/Senate Congressional Leadership pipeline

26. **Phase 2.2.1 Congressional Leadership** (posts 50, 60, 61, 324, 333, 334): elects Speaker, House Maj/Min Leader, House Maj/Min Whip, Senate Maj Ldr / Maj Whip / Pres Pro Tempore / Sen Min Ldr / Sen Min Whip. Specific rules:
    - **Red incumbents can't be challenged in their current positions** when Red is dominant (post 324) — incumbent protection.
    - Whip races are *ranked-choice* with elimination & endorsement-by-closest-ideology (post 333).
    - Only Senators / Reps who have served on the relevant committee are *eligible* to be Chair (post 66: "William Meredith not eligible for Domestic Chair as he never served on that committee").
    - Each leadership role grants ±points and may award traits (e.g. Speaker → +1 Legis, lose Obscure, gain Propagandist/Kingmaker; Whip → Debater, Leadership).
27. **Phase 2.2.3 Faction Leaders Selected** (posts 67, 78, 341):
    - Faction leader can step down and *anoint* a successor (post 71).
    - Passive trait → must be replaced; auto-disqualified leaders.
    - `Easily Overwhelmed` blocks running for party leader (post 78).
    - Pliable faction leader may be auto-replaced with different criteria (post 341: "passive so you must switch to another pol. None of those with Leadership qualify so you can pick any Mod that has either Reformist or Business").
28. **Phase 2.2.4 Party Leaders Elected** (post 85): being party leader for 5+ terms in a row gives party pref -1 (anti-incumbent fatigue). Trait effects on enthusiasm + party pref are scored on election to PL.

### H. Diplomacy (2.7.1)

29. **Diplomacy actions** (post 198):
    - **Increase Relations** with foreign power (success +1, fail -1 to relation meter).
    - **Increase Trade Relations** (need relations ≥ neutral; success rolls 5-6 for +rev/budget, fail rolls 1-2 for -rev/budget).
    - **Extend Credit** (need rev/budget ≤ balanced; 10% relation +1, 10% econ stab +1).
30. **Cabinet member's "Egghead" trait grants veto/recommendation power on Era Events** (post 126: "Egghead Cabinet can weigh in on Jim Crow and Oregon events"). The pliable/passive Pres then accepts the cabinet majority's recommendation. Not in code.
31. **Sec of State + UK Minister jointly implement the Oregon Treaty era-event** (post 129) — multi-decider with diff difficulty rolls. The engine has `decider` as a single role.

### I. Executive Actions library (2.8.1)

32. **President can take N executive actions** (post 201): "Pres Clinton can take up to 4 actions" — limit varies by traits. `Easily Overwhelmed` rolls to hand off to VP (post 201: rolls 77/50 *not* to). Specific actions named:
    - "Swing around the circle" (controversial speaking tour) — 1-30 success, 31-50 failure, else no effect (post 203)
    - "Establish Bureau of Labor" — +pts to Mfg-leading state, +50 Labor Unions
    - "Pro-military budget increase policy" — +pts/enthusiasm shifts
33. **Active executive actions persist** with green/yellow shading (post 201): some can be *deactivated as an action*, others auto-deactivate on admin change. The engine has no `executiveActions[]` state.

### J. Faction "personality / card" dynamism (2.1.8)

34. **Each half-term, the GM adds/removes ideology / lobby / interest cards from each faction** (posts 49, 323). Examples: `@Brocklin Added: Big Corporations, Human Rights; Lost: Liberals, Environmentalist, LW Media`. This is the *Faction Personalities phase* and is run every half-term. Code has `faction.ideologyCards/lobbyCards/interestCards` but the *drift mechanic* (what gets added/removed and why) is unclear — likely based on legislation passed / events / governor actions.

### K. Miscellaneous one-shots

35. **Census-driven EV changes** (post 125: "MN +1EV in the next census", "VT -1 EV in the next census"). Era events stash EV deltas that fire at the next census. Engine has `state.electoralVotes` but no scheduled census update mechanism in the chunks read.
36. **Foreign territories / annexation by event** (post 129: "US has acquired the rights to British Columbia (BC), Washington (WA), Oregon (OR) and Idaho (ID)" via the Oregon Treaty). Engine has `admitState` but no annexation flow from an era event.
37. **National surplus number** (post 200: "Our national surplus is now at +16"). A specific *integer* national surplus is tracked, distinct from the `revenue` meter. Build does not appear to expose this.
38. **Industry leadership per state** (post 133): Maritime ME, Finance NY+PA, Manufacturing RI, Agriculture TN, Mining WV. Scored as a per-half-term point distribution. State `industries` field exists in `State` but the *leadership table + scoring* isn't visible in code.
39. **Half-term scoring of *all the things*** (posts 113 retirements, 197 legislation scoring, 281 gov scoring, 282 house scoring): granular per-faction points are kept and totaled (post 298 leaderboard). Build has scoring infrastructure but the cross-phase aggregation is harder to verify.
40. **Old-Age Rolls** (post 297: "@Vicx Rep Willie P Magnum -1 Admin"). Stat decay rolls at end of half-term. Engine `MORTALITY_RULES` handles death; *stat decay* is a separate dial — unclear if implemented.
41. **Faction "nicknames" change** (post 298): factions adopt era-specific party nicknames (`War Democrats`, `Finance National Republicans`, `Radical Republicans`). `Faction.nickname` exists but how/when nicknames change isn't documented.
42. **Defeated incumbents auto-retire** (post 297): GM retires defeated pres candidates, defeated governors and reps deterministically.

## House rules / game-master rulings

- **Bidding for draft picks**: post 6: "$25 to give him to me, though." — a humorous reference, but it suggests **out-of-band trades** are tolerated in the forum, e.g. paying real money or in-game currency for a pick. Not a real rule.
- **CA is still Mexican** (posts 31, 32, 158): the GM repeatedly reminds the players that California isn't a US state yet; one player keeps trying to relocate / propose transcontinental-railroad bills there. The build's `expansionStates` machinery would have to mirror this — *territory status before annexation*.
- **Vance / `George Curry Law` from OR can't serve in cabinet** (post 103) because OR is "not a territory yet". The cabinet-eligibility check is *state-status-aware*.
- **Pres signs majority cabinet's recommendation** when Passive+Pliable (post 129).
- **Carpetbagger trait** awarded automatically on alt-state moves (post 36: `Ira Sherwin Hazeltine WI->MO (ALT-STATE) Done gains Carpetbagger`).
- **GM-allowed automation requests**: players ask `Can you cpu my moves` (posts 148, 301, 306) — the GM picks "successful only" actions. The browser build is single-player and CPU-driven by default, so this is moot in code but suggests forum-friendly *async fallback* for absent players.
- **Forum quote-blocks are noise**: many posts (28, 30, 33, ...) are mostly an Expand-quoted version of the GM's prompt with one or two action lines at the end. The preprocessor preserves them, which is fine, but the digest only cites the actionable post.
- **"Bidding $25 to give him to me"** is a joke; ignore as a mechanic.

## Open questions for the human

1. **Era boundaries**: is `Gilded Age` an entry in the `Era` enum (separate from `modern`), or does the design intend `modern` to be Gilded-Age-and-beyond? Post 1 distinguishes 1868–1892 + "the next era", implying *at least* 2 more eras beyond `nationalism`.
2. **Multi-era ideology drafting profiles** (post 1: Brocklin shifts from Lib/Mod to Prog/Lib): is each (faction, era) pair authored separately, or is there a rule that drifts ideology profiles per era?
3. **Tariff axis**: is tariff a *meter* (a number 0–100%), an *amendment / law* (the bill literally sets a number, post 224 "Set average tariff to 36%"), or *both*? The forum reads it as a single national integer set by legislation.
4. **Currency**: similarly, is the gold/silver split a *state flag* (bimetallism on/off), a *meter*, or a separate `MonetaryRegime` enum (Gold / Bimetallic / Silver)?
5. **`*Crisis Bill*` tagging**: which crisis types are recognized, and how does a bill become eligible to be the crisis-resolving bill? Forum recognized crises in this run: Economic, Corruption ("Honest Gov't"), Domestic, Anti-Naturalization, Anti-Native, Anti-Chinese.
6. **State policy flags** (post 125): is the full set `{ pollTax, jimCrow, prohibition, womenSuffrage, segregation }` or larger? Many are governor-actionable; some are GM-narrated era-event side effects.
7. **Convention machinery**: the multi-ballot logic + unit rule + ballot-shift + presidential-promise + kingmaker-momentum is a sizable subsystem. Should it be a single screen / multi-screen flow, and what is the autonomy bar for CPU candidates?
8. **Forum "factions in a party" cap**: this thread has 5 Blue factions + 5 Red factions = 10 total. The build's `Faction[]` is unbounded. Is there a per-party cap?
9. **Faction-personality drift rules** (2.1.8): the GM seems to do this manually based on legislative track record. Are there algorithmic rules in the design doc the forum implements, or is it always GM discretion?
10. **VP impact rule set**: post 225 has a sequence of `+1 / +1 / +1 / +1 / +1 / 0 / +1 / 0 / +1 / +1` checks. Are all 10 in the design doc, or did the GM run them ad-hoc? Worth confirming the canonical list.
11. **Stat decay at old age** (post 297): is the trigger purely age, or randomized like mortality?
12. **Foreign relations meters list**: this thread has UK / France / Spain / Prussia / Russia / China as separate meters (post 132). Is the design's list fixed or era-dependent (Prussia post-1871 = Germany; China post-1911 = ROC)?
13. **National surplus integer (post 200)** vs `NationalMeters.revenue` (a 7-step ordinal): are these the same thing? Forum shows both.
