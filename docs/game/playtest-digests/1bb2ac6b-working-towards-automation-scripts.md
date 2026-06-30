# Digest — `automation` (1bb2ac6b): "Working Towards Automation: Scripts"

> **Batch 55.** 47 posts / 1 chunk (politicslounge topic 1524, 2022–2026). A
> **meta / tooling thread**, not a playthrough: @Arkansas Progressive (+ @Rezi,
> @Lars, @Blockmon, @MrPotatoTed) hand-build **Python / Google-Apps scripts** to
> automate the tedious spreadsheet-playtest math. **Load-bearing value: the
> script inventory is a de-facto spec of the engine's subsystem set** — the
> community is hand-coding exactly the engine AMPU needs, so the list confirms
> these systems are *designed and rule-specified*, not aspirational. Strongly
> **corroborates the #20 deterministic-CPU cluster** + the whole phase set, and
> **#296 seeded-RNG** (every script does dice rolls the app must reproduce).
> Three specific, traceable signals: the **"lingering" phase** = volatility +
> tax/tariff decay + meter→meter cross-effects; the **committee XP gain WITHOUT
> the small-chance +1-ability roll** (10,000-pol test, zero +1s, "doesn't seem
> to be coded" — and AP confirms it was intentionally omitted); and the
> **CPU-legislation auto-scoring formula** (cards × points × holders).
> Rules-doc version referenced: **3.0.25** (pol generator). GA-built tooling, so
> corroborative of designed intent, not new authoritative rulings.

## What this thread is

A multi-year tooling log. Each post announces "I scripted X" — so the union of
posts is an inventory of every tedious-but-rule-defined subsystem the manual game
runs. The scripts run *out of* the players' master Google Sheets / rules doc, so
each one is a faithful re-implementation of an existing, written rule (not a
houserule invention). That makes the list usable as a **subsystem checklist**:
anything someone bothered to script is (a) tedious enough to want automated and
(b) deterministic enough to script — i.e. exactly the engine surface AMPU ports.

## ★ The de-facto subsystem inventory (script-confirmed designed systems)

Each is a real script someone wrote → confirms the system is designed & rule-specified.

| Scripted subsystem | Post | App equivalent (shipped?) |
|---|---|---|
| **Committee Expertise Gains** (XP only — see ★ below) | 1, 3-4 | `runPhase_2_2_2_Committees` (`phaseRunners.ts:1894`) — **partial** |
| **Leader Gains** (faction leader, party leader, committee assignment) | 1, 11-13, 35 | `2.2.3`/`2.2.4` FactionLeaders/PartyLeaders (`phaseRunners.ts:1940`) — SHIPPED |
| **General Gov + Rep elections** (any state, any era) | 10, 14-15 | `2.9.5`/`2.9.6` + `calcStateVote` — SHIPPED |
| **CPU Voting / Confirmation** (`CPUConfirmation.py`) | 16-21, 25-27 | CPU bill/confirm votes — SHIPPED (logic), see #20 |
| **CPU laws** (Google-Docs, not yet a script) | 27 | CPU bill proposal — SHIPPED |
| **Battle / War sim** (Rev War data plugged in; 2-vs-CPU) | 18, 22-23, 28-29, 45 | `revolutionaryWar.ts` + `2.7.2` — SHIPPED |
| **VP scoring** | 30 | VP/succession scoring — SHIPPED (partial) |
| **Era Evos** | 30 | `2.4.3` Era Events — SHIPPED |
| **Anytime Evos** | 30 | `2.4.2` Anytime Events — SHIPPED |
| **Political (party) conversions** | 30 | `2.1.6` Faction Conversions — SHIPPED |
| **Career-track gains** | 30 | `runPhase_2_1_2_CareerTracks` (`phaseRunners.ts:401`) — SHIPPED |
| **Cabinet gains** | 35, 37 | `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:~2190`) — SHIPPED |
| **Cabinet enthusiasm** | 36, 47 | cabinet enthusiasm/loyalty — SHIPPED (partial) |
| **Lingering** (volatility + tax/tariff decay + meter→meter) | 38-41 | `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260`) — **partial, see ★** |
| **Pol GENERATOR** (random future / random pol, from rules **3.0.25**) | 44 | dataset generator (`scripts/`) — adjacent, not in-app gen |
| **Drafts** (Inaugural / Rookie — written *with Claude.ai* as Google-Apps Script) | 46 | `runPhase_2_1_1_Draft` — SHIPPED |
| **Deaths & Retirements** (Lars' private script) | 1 | `runPhase_2_4_1_Deaths` — SHIPPED |

Conclusion: the **entire designed phase set is independently confirmed** by the
fact that the community found each piece worth scripting from the written rules.

## ★ Three specific build-state signals

### (a) The "lingering" phase = volatility + tax/tariff decay + meter→meter
- AP: "working on script to do **lingering**" → Ted: "I hate that part…I almost
  **dread** it" → matthewyoung123: "I had two parts I've ignored (**volatility**
  and **tax/tariff decay**) because they don't make sense where they are" (POST
  38-40). AP: "sorta got volatility working, haven't done decay, everything else
  done with `lingering.py` **except meter effects on other meters** (which I'm
  just not going to do for a while)" (POST 41).
- So the **designed Lingering phase has four parts**: (1) general meter ticking,
  (2) **volatility**, (3) **tax/tariff decay**, (4) **meter-effects-on-other-meters**
  (cross-meter coupling). It is the single most dreaded/tedious end-of-turn phase.
- **Build:** `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260`) ships **part (1)
  only** — cabinet-skill-driven per-meter drift + per-seat expertise bonus +
  per-trait modulation + national-debt update. **No volatility, no tax/tariff
  decay, no meter→meter cross-effects.** This is a NEW, specific gap with a named
  4-part spec.

### (b) Committee XP gain WITHOUT the small-chance +1-ability roll
- Ted ran **10,000 politicians** through the committee-gains script and saw
  **zero +1 Legislative** (etc.), even though "there's a small chance it should
  happen out of 100 pols" — "**doesn't seem to be coded**" (POST 3). AP confirms
  it's **intentional**: "the original point was just to simulate the Committee
  **experience** gains, since that was the really tedious part. I might add it"
  (POST 4). So the **designed rule includes a small per-pol chance of a +1
  ability from committee service** — separate from the deterministic XP grant.
- **Build:** `runPhase_2_2_2_Committees` (`phaseRunners.ts:1894`) grants the **4
  committee chairs** command +1, legislative +1, and committee expertise — but
  there is **no small-chance +1-ability roll**, and **no per-member (non-chair)
  committee XP/ability pass at all**. Compare career-track `rollThreshold`
  (`phaseRunners.ts:299`), which *does* implement chance-gated +1 ability rolls —
  so the primitive exists; committee service just doesn't use it. NEW gap.

### (c) CPU-legislation auto-scoring formula (the "dream")
- Ted's request (POST 2, 5): auto-score each legislative-proposal / gov-action
  **per faction** = look at **which cards a proposal impacts × how many points
  it's worth × which factions hold those cards** → one **column per faction** to
  **sort by**, so a CPU (or human running a CPU) instantly sees the
  highest-value play for each faction; then manually confirm prereqs + meter
  impacts. AP: "doable, lots of **backend** nonsense" (POST 5) — needs access to
  the CPU sheets (POST 7-8). Never confirmed shipped in the thread.
- This is the **explicit scoring heuristic behind CPU bill selection** —
  cards-impacted × point-value × card-holding faction. Directly feeds #20
  (deterministic CPU) and CPU bill-proposal logic. NEW: the *formula* is now
  documented, not just "CPU picks a bill."

### (d) Rules-version marker
- The pol generator was generated **from rules 3.0.25** (POST 44). A datable
  rules-doc version pin for the late-2025 / early-2026 ruleset.

## Misc corroborations

- **Seeded RNG (#296):** every script (committee gains, leader rolls, career
  gains, battle sim, pol generator, drafts) **performs dice rolls** — confirms
  the engine is roll-driven throughout and that any in-app port must draw from a
  **reproducible seeded RNG**. `src/rng.ts:1-5` still uses `Math.random`
  (un-seeded) — the gap stands.
- **Battle/war bug (corroborates Rev-War winnability concerns):** "battles do
  **not end even when warscore is 10 or -10**" (POST 45) — a missing
  war-resolution terminator at the ±10 warscore bound. Their sim plugs in the
  **Rev War battle data** (POST 22, 28-29), confirming the war engine is fully
  data-specified. (App's `revolutionaryWar.ts` is a separate impl; flag the ±10
  terminator as a thing to verify there.)
- **CPU-built tooling note:** the draft automater was **written with Claude.ai**
  as a Google-Apps Script (POST 46) — incidental, but shows the community already
  uses LLM codegen against the same rules AMPU encodes.

## Deltas vs. current build (gap-log)

- **CORROBORATES #20** (deterministic-CPU cluster) + **the full designed phase
  set**: the script inventory independently confirms every subsystem
  (committee/leader/cabinet gains, gov+rep+CPU elections, CPU voting/confirm, war
  sim, VP scoring, era/anytime evos, conversions, career tracks, drafts, lingering)
  is designed and rule-specified. Meta-confirmation, not a new gap. (POST 1-47)
- **CORROBORATES #296** (seeded RNG): all scripts are roll-based; `src/rng.ts`
  still `Math.random`. (POST 1, 22, 30, 44, 46)
- **NEW — Lingering phase is 3 parts short:** designed Lingering = meter-tick +
  **volatility** + **tax/tariff decay** + **meter→meter cross-effects**; shipped
  `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260`) implements meter-tick only.
  (POST 38-41)
- **NEW — Committee +1-ability roll not coded:** designed committee service has a
  small per-pol chance of a +1 ability on top of XP; shipped code grants
  XP/command/legislative to the **4 chairs** only, no chance-roll, no per-member
  pass. Primitive exists in career-track `rollThreshold`. (POST 3-4)
- **NEW — CPU-legislation auto-scoring formula documented:** per-faction score =
  (cards a proposal impacts) × (point value) × (factions holding those cards),
  one sortable column per faction. The explicit heuristic behind CPU/human-CPU
  bill selection. (POST 2, 5)
- **NEW (minor) — Rules 3.0.25** version pin (late-2025/early-2026). (POST 44)
- **VERIFY — war ±10 terminator:** "battles don't end at warscore ±10" in their
  sim; check `revolutionaryWar.ts` has a clean ±10 win/loss terminator. (POST 45)

## Open questions

- Should the **Lingering phase's volatility + tax/tariff decay + meter-cross-
  effects** be ported as designed, or is the app's simpler meter-drift the
  intended replacement? The forum itself finds these parts confusing ("don't
  make sense where they are," POST 40) — possible candidate for *deliberate*
  simplification rather than faithful port. Human/designer call.
- Should **committee service** grant the small-chance +1 ability (per the rule),
  given AP omitted it as "not the tedious part"? It's a balance/fidelity choice.
- Is the **CPU bill-scoring formula** (cards × points × holders) the formula the
  app's CPU should use, or does the shipped CPU already approximate it?

## Source

`automation` (1bb2ac6b) "Working Towards Automation: Scripts" — 47 posts / 1
chunk (politicslounge topic 1524, 2022–2026). Meta/tooling thread; community
Python/Apps scripts as a de-facto subsystem spec. GA-built tooling
(corroborative of designed intent, not authoritative rulings). Cited `POST n`
(the `===== POST n =====` markers).
