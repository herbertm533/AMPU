# Digest — AMPU Related Passion Projects (`e07f0cc1`)

**Source:** `docs/game/sources/e07f0cc1-ampu-related-passion-projects/` (1 chunk, 37 posts, ~17k chars)
**Forum:** politicslounge.com topic 5058 · **Dates:** Dec 2023 – Feb 2024
**Participants:** Arkansas Progressive (the maker), vcczar (game owner/designer), OrangeP47; tagged but silent: ebrk85, 10centjimmy, Imperator Taco Cat, pman, Willthescout7, Ich_bin_Tyler

## What this thread is

A **community/meta show-and-tell thread**, not a rules or playtest thread. Arkansas Progressive builds data visualizations of AMPU's underlying numbers using **flourish.studio** (interactive US choropleth maps) and shows them off; vcczar (the designer) reacts, requests more, and tries to embed them on a WordPress blog. Most of the back-half (POST 14–34) is **logistics**: how to embed a Flourish map into WordPress without paying for EmbedPress/AMP (`$40` plugin). Tone is casual/social ("Congrats you're now the lead programmer of AMPU" — a joke, POST 3; "based", POST 33).

The genuinely useful content is **what data assets exist and what they reveal about AMPU's design**, summarized below. There is no rules-change or mechanic ruling in this thread.

## Data assets shown (the real signal)

These confirm that the forum game is driven by a master **"Census sheet"** spreadsheet holding per-state, per-census-decade tuning data. The thread visualizes three slices of it:

1. **State Bias REDUX** (POST 1, 5–7) — all Census-sheet **state biases** rendered as maps, decade by decade. Used to plan "going into different years."
   - Biases are expressed on a **partisan-lean scale like `R+4`, `R+3`, `D+1`** (POST 6, 12). Negative/positive = lean toward a party.
   - **They are time-varying per census decade**, but move *slowly*: "the only change between 1910 and 1920 is that WI moves from R+4 to R+3. No other state biases change." (POST 6).
   - Designer commentary ties bias shifts to real history: LBJ's '64 landslide shattered R lean for '66; Nixon's '72 landslide didn't matter because states only "budged to D+1" while Congress stayed D (POST 12).

2. **AMPU Party Support** maps (POST 2, 8–13) — a *derived* 0–10 partisan-control index per state, vcczar's spec (POST 2/4), built 1960→2022, snapshots at 1962/1974/1982/1994/2010/2022 (POST 9). The 10-point formula:
   - Pres (incl. VP) = **2 pts**
   - 2 Senators of party A = **2 pts**
   - US Reps of party A = **up to 5 pts** (all A / mostly A / split / mostly B / all B)
   - Governor of party A = **1 pt**
   - 10 = Solid Blue … 5 = purple … 0 = Solid Red. (POST 2)
   - This is a *visualization/analysis* metric, **not** described as an in-game mechanic.

3. **Ideology Bonuses / Ideology Maluses** maps (POST 35–37) — "a handy map of ideology bonuses for each census" and the matching malus map. Confirms the Census sheet also stores **per-state, per-census ideology bonus AND malus values**. OrangeP47 had been computing these **by hand for the 1840 playtest** (POST 36) — so ideology bonus/malus per census is a live, manually-maintained game input across eras.

## Era / scope notes
- Data work centers on the **modern era (1960–2022)** for party-support, and **1910/1920** examples for bias (POST 6). Bias maps appear to span the full Census history.
- **An "1840 playtest" is referenced as active** (POST 36, OrangeP47) — confirms a mid-19th-century scenario beyond the built 1772/1856 ones was being run on the forum, with ideology bonus/malus tables maintained per census.

## House rules / rulings
None. No mechanics were changed or adjudicated in this thread.

## Open questions
- Is the "Census sheet" the same master data behind the per-state `bias` scalar in the build, or a richer time-series? (Thread implies time-series by decade.)
- Are the per-census **ideology bonus/malus** values a distinct input from a state's partisan `bias`? POST 35–37 treats them as separate map layers, suggesting yes.
- The 0–10 "Party Support" index — purely analytical, or did it ever feed a mechanic? Thread treats it as visualization only.

## Deltas vs. current build

Mostly **low-signal**; this is a viz/blog thread. The one substantive design signal is that the forum game's data model is *more granular over time* than the shipped one. Concretely:

| Area | In the build today | What this thread reveals | Delta / note |
|---|---|---|---|
| State partisan bias | Single static scalar `bias` per state, fixed at scenario authoring (`src/data/states1856.ts`, e.g. SC `-2.4`); engine reads it in `IDEOLOGY_SHIFT_ODDS.drift.stateBias` (`src/types.ts`) | Census sheet holds **per-census-decade** biases on an `R+n / D+n` scale that drift slowly with history (POST 6, 12) | Build's bias is **static**, not a decade-indexed time series. A time-varying bias table would be needed to reach forum fidelity — but only relevant for long modern-era campaigns the build doesn't ship. |
| Ideology bonus/malus | Ideology shifts use global odds tables (`IDEOLOGY_SHIFT_ODDS`, `EXPERTISE_IDEOLOGY_LEAN`) keyed on faction/state-bias/traits, not per-state-per-census tables | Census sheet has explicit **per-state, per-census ideology BONUS and MALUS** layers (POST 35–37); maintained by hand for the 1840 playtest | No per-state/per-census ideology bonus+malus data asset in the build. Potential **content-registry (#221) / dataset** input if modern or 1840 scenarios are pursued. |
| "Party Support" 0–10 index | Not present | Analytical control metric (Pres 2 / Sen 2 / Reps 5 / Gov 1) (POST 2) | **Not a delta to chase** — visualization metric only; could inspire a UI "who controls this state" readout, nothing more. |
| 1840 scenario | Only 1772 + 1856 scenarios shipped | An **1840 playtest** was running on the forum (POST 36) | Documented-but-unbuilt era data point; corroborates other threads if any list 1840. Not actionable from this thread alone. |

**Net:** No mechanics/rulings to capture. Two real data-model signals (time-varying state bias; per-census ideology bonus/malus tables) that are forum data assets, both only relevant if/when modern-era or 1840 scenarios are built. Everything else is social/embed-tooling chatter. No code change is implied by this thread on its own.

## Sources
- `chunk-001.md` (POST 1–37) — Flourish map projects: State Bias REDUX (1–7), Party Support 1960–2022 (8–13), WordPress embed troubleshooting (14–34), Ideology Bonus/Malus maps (35–37).
