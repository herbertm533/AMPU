# Digest — Electoral Trends: 1948

- **Slug:** `6b41ed5b-electoral-trends-1948`
- **Source:** `6b41ed5b-Electoral_Trends__1948.csv` (topic 5474, politicslounge.com)
- **Size:** 51 posts, 1 chunk (~16.3k chars; `chunk-001.md` = 399 lines). Dates: Sep 2024 → Mar 2026.
- **Author/OP:** @Arkansas Progressive. Participants: ebrk85, Saucialiste, Vee01, Brocklin, OrangeP47, vcczar (pinged), matthewyoung123, Ich_bin_Tyler.
- **What this is:** A presidential-election **RESULTS LOG** (1952–2016, narration thins out after ~1996) for the **1948 Cold-War "Nuclear Age" playtest** (the campaign itself is the `be4e0f70` thread; continuation `3a9ac985`). Direct **sibling of the b45 `5e195107` "Electoral Trends — 1840"** thread — same author, same format (datapoint log + maps + bellwether tracking). Mostly flavor/records; mined here for **mechanics signals, not play-by-play**. Era framing already covered: `docs/game/historical-context.md` + `docs/game/historical-context-1948-coldwar.md` (no historian ran this batch).

---

## Mechanics signals (the reason this thread matters)

### ★ Faithless electors — recurring per-election shipped(?) mechanic — NOT in build
The single densest signal. Faithless electors fire **per-election with state-specific incidence** and can shift net EV outcomes:
- **1952** (POST 2): AZ gifts faithless electors (first of two consecutive AZ elections); SC gifts them "the first and only time." 49-state map otherwise.
- **1956** (POST 3): Bankhead's candidacy "sparked the **largest range of faithless elector schisms** in the electoral college that wouldn't be seen before or since"; **only time TX, VA, and GA** gift faithless electors. Taft wins re-election with a *larger* popular-vote share but **loses net electoral votes** — i.e. faithlessness materially moved the EV tally.
- **1960** (POST 4): "First of **three** elections between the observed period that **failed to produce** faithless electors" (so faithlessness is the norm; zero is the exception, occurring 3× across 1952–1988).
- **1976** (POST 8): Orr and Magnuson "win faithless electors, the **least** of any faithlessness."
- **1984** (POST 10): "Three electors break from Brown" yet Dems still clear 300 EV.
- **1992** (POST 28): implies continued tracking (margin/EV detail).

**Build status — ABSENT.** No `faithless` token anywhere in `src/` (case-sensitive content grep = 0 hits; the case-insensitive file matches are substring false-positives). The presidential resolver `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752`) is strict **winner-take-all per state** — `if (blue.pct > red.pct) blueEv += s.electoralVotes; else redEv += s.electoralVotes` (`phaseRunners.ts:3767-3768`). No elector-defection roll, no per-state faithless incidence. **Shipped reality: deterministic WTA. Designed/observed: stochastic faithless electors with state-specific rates.**

### ★ Congressional-district EV split method — observed once — NOT in build
- **1980** (POST 9): "**Louisiana's 2nd congressional** would be the first time that a state split their electoral votes via the **congressional district method** for the opposite winner, the last time being Michigan in 1892."
- **1992** (POST 28): "Tennessee's first congressional district goes to the losing candidate, which has not happened since Brown won LA-02 in 1980" — confirms CD-split is a live, recurring (if rare) allocation variant, ME/NE-style.

**Build status — ABSENT.** EV allocation is whole-state only (`s.electoralVotes` added in one block, line 3767-3768). No congressional-district sub-units, no CD-split branch. The b45 1840 sibling describes a *different* EV-split flavor (EV-splitting **between paired alt-states** Lower/Upper California, `5e195107` POST 2/5); this thread describes **within-state CD allocation**. Both are unbuilt; they are distinct mechanics.

### ★ Third-party path — reaches 14.59% — resolver is HARD two-party
- **1984** (POST 10): "Arne Carlson's **14.59%** is the most a non-major third party has gotten" — a third-party viability datapoint. Cross-ref b45 1840's near-miss (Weaver almost won the presidency, `5e195107` POST 16/18/19) and the party-morphology gap.
- **1992** (POST 28): "sixteen states Chisholm won were **capped at max margin**" — confirms a **margin cap** on state results (the die-roll output is clamped; see also POST 31's "9 to 19 after die rolls").

**Build status — ABSENT for president.** `runPhase_2_9_4_PresidentialGeneral` only ever instantiates **two** candidates, `[blueCand, redCand]` (line 3754), tallies only `'BLUE'`/`'RED'` per state, and emits a two-row `electoralVotes`. There is **no third-party candidate in the presidential resolver at all** — so a 14.59% third party (let alone the b45 near-win) is not representable in the shipped pres-general code. (Third-party / minor-party handling may exist elsewhere in the data model — `thirdParty` tokens appear in `types.ts`, `engine.ts`, `phases.ts` — but it does not reach the presidential EV math.) **This is the highest-value confirmation: shipped presidential elections are strictly two-party WTA.**

### ★ Foreign-born president — confirms the path, but build never blocks it anyway
- **1980** (POST 9): "**Foreign Born Stan Stephens** is the first of his origin in the White House."

**Build status — relevant but inverted.** The CC has a `presidentialEligibility` article with values `natural_born` ("Foreign-born citizens excluded") vs `any_citizen` (`constitutionalConvention.ts:52-55`), defaulting to `natural_born` ~85% of the time (line 118-119). **But the candidate-eligibility filter in `runPhase_2_9_1_Primaries` (`phaseRunners.ts:3729`) checks only `age >= 35 && age <= 80 && command >= 2` — there is NO natural-born / foreign-born gate.** So foreign-born candidates are *never excluded* in shipped code regardless of the CC setting; "first foreign-born president" is not a modeled milestone, it's just the build's unconditional default. **Delta: the `presidentialEligibility = natural_born` lever is defined but not enforced in candidate selection.** (Cross-ref: the CC eligibility lever exists; the gate is missing downstream.)

### First non-white / female major-party nominees & 3-peat nominee (milestone records, not mechanics)
- **1964–1968** (POST 5-6): **Boothe** = "first (and only) major party nominee to appear as the nominee in **three consecutive elections**" — datapoint on nominee continuity (the primary picks top PV+command each cycle; a 3-peat means one politician stayed the party's strongest for 12 yrs, `phaseRunners.ts:3735`).
- **1980** (POST 9): **Brown** = "first **non-white** major party nominee."
- **1992** (POST 28): "First **African-American woman** elected president" (Chisholm); "first Republican defeated for re-election since Luce in 1972."
- These are **emergent records**, not tracked mechanics — the build has no first-of-identity tracking. Flag only as content/representation color.

### Bellwether / state-streak tracking (emergent, player-maintained — not a build feature)
- **POST 11/14/28/29**: bellwether tracking; **Florida = longest streak voting for the winner from 1952 onward**, sustained 1988→1996. Nebraska flips Dem 1992 (POST 28); Hawaii's only-R cycles (POST 6/29). This is players reading emergent `state.bias`+RNG output off a spreadsheet — the same artifact as b45 1840's decade-bias maps and the b44 Census sheet. **No bellwether/streak field in shipped code.**

### Scale / balance color (flavor, not mechanics)
- **1972** (POST 7): Johnson "surpassing Roosevelt 1932 in electors won and popular vote share… first time any candidate won **more than 50 million votes**." Note pop-vote scale: `calcStateVote` sizes turnout as `100_000 + state.electoralVotes * 5000` (`phaseRunners.ts:3692`), so national totals into the tens of millions are expected and not a bug — just scale color for balance discussions.
- **POST 31**: explicit die-roll mechanics quoted — "in 1992 Hawaii was D+10 (**9 to 19 after die rolls**), in 1996 it was R+3 (17 to 14)" — corroborates that the forum model is **base lean + die roll**, matching the build's `bias + RNG` shape in `calcStateVote`.

### Faction-balance / squeeze (campaign color, cross-ref faction system)
- **POST 25-27**: OP laments "never had more than three sens factionwide" — being the **left faction of the red team** post-mid-1900s is structurally hard (loses conservative-favoring primaries; moderate winnable states lean blue). Cross-ref faction/primary mechanics; corroborates intra-party faction squeeze but no new mechanic.
- **POST 20/32/37**: faction seat-count history reconstructed from Google-Sheet version history (data was not natively saved) — confirms the **forum game's state lives in an external spreadsheet**, not a structured save; "Republican Revolution did not occur," GOP House hegemony 1974–late-90s flagged as **ahistorical** emergent output.

---

## Deltas / confirmations vs current build

1. **★ Faithless electors — ABSENT (delta).** Observed nearly every cycle 1952–1988 with **state-specific incidence** (AZ/SC 1952; TX/VA/GA 1956 = widest, "only time"; 3 elections produced none) and can **flip net EV** (1956: Taft loses EV despite higher PV). Shipped resolver is deterministic winner-take-all (`phaseRunners.ts:3767-3768`); zero `faithless` logic in `src/`. **Requirement: per-state faithless-elector roll in the presidential EV tally.** (POST 2,3,4,8,10)
2. **★ Congressional-district EV-split method — ABSENT (delta).** ME/NE-style within-state CD allocation observed (LA-02 1980 "for the opposite winner"; TN-01 1992). Build allocates whole-state EV only. **Requirement: optional CD-split allocation per state.** Distinct from b45's *inter-alt-state* EV split. (POST 9, 28)
3. **★ Third-party presidential path — ABSENT in resolver (delta).** Third party hit **14.59%** (1984); b45 sibling had a near-win. Shipped `runPhase_2_9_4_PresidentialGeneral` is **hard two-party** (`[blueCand, redCand]`, BLUE/RED only, two-row EV; `phaseRunners.ts:3754`). **Requirement: third/minor-party candidate support in the presidential general + EV math.** (POST 10; cross-ref `5e195107` POST 16-19)
4. **★ `presidentialEligibility = natural_born` not enforced (delta).** CC defines the natural-born exclusion (`constitutionalConvention.ts:52-55`), but primary candidate filter (`phaseRunners.ts:3729`) has no foreign-born gate, so foreign-born win (Stephens 1980) is the *unconditional default*. **Requirement: honor the CC eligibility lever in candidate selection.** (POST 9)
5. **State margin cap — CONFIRMED present.** "Capped at max margin" (POST 28) and "9→19 after die rolls" (POST 31) corroborate the build's clamped `bias + RNG` model in `calcStateVote` (`phaseRunners.ts:3692`+). Not a delta.
6. **Base-lean + die-roll election formula — CONFIRMED.** POST 31's explicit numbers match the shipped `calcStateVote` design. Cross-ref b49 #292 election-formula notes and the b45 1840 sibling. Not a delta.
7. **No first-of-identity / bellwether / streak tracking — ABSENT (low-priority delta).** First non-white (1980), first African-American woman president (1992), 3-consecutive nominee (Boothe), Florida bellwether streak — all player-tracked off a spreadsheet, none modeled. Representation/UI color, not core mechanics. (POST 5-6, 9, 14, 28)
8. **Forum game state lives in an external Google Sheet** (POST 20/22/32), reconstructed from version history — context only; reinforces that these logs are the ground-truth record, not a structured export.

## Open questions
- Do faithless electors and CD-split exist anywhere as **designed rules with numbers** (incidence %, which states), or only as emergent forum-GM die-roll flavor? This log shows *incidence patterns* but no rate table — would need the `be4e0f70` campaign thread or a rules thread to source the actual mechanic.
- Does any shipped/minor-party system feed presidential EV at all, or is third-party strictly a House/Senate/data-model concept? (`thirdParty` appears in `types.ts`/`engine.ts`/`phases.ts` but not the pres resolver — unverified what those do.)
- Is "max margin cap" the same clamp the build applies, or a forum house rule with a different ceiling?

## Sources
- `chunk-001.md` (POST 1–51) — sole chunk. Era framing: `historical-context.md`, `historical-context-1948-coldwar.md`.
- Cross-refs: `5e195107` (b45 "Electoral Trends — 1840" sibling: inter-alt-state EV split, third-party near-win, decade bias), `be4e0f70`/`3a9ac985` (the 1948 campaign itself + continuation).
- Build refs: `phaseRunners.ts:3752` (`runPhase_2_9_4_PresidentialGeneral`, two-party WTA, EV at 3767-3768), `phaseRunners.ts:3725-3729` (primary filter, no eligibility gate), `phaseRunners.ts:3692` (`calcStateVote` turnout/lean+RNG), `constitutionalConvention.ts:52-55,118-119` (`presidentialEligibility` lever).
