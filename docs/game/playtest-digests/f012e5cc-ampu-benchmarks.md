# Digest — f012e5cc "AMPU Benchmarks"

**Scope:** 9 posts / 1 chunk (`chunk-001.md`). **DESIGN-ORIGIN thread** (NOT a
playthrough; no dice/state) — dated **12/1/2021**. vcczar announces the **Era
Benchmark** system to the playtest group; vcczar + MrPotatoTed (Ted) settle the
**scoring math** live. **This is the EARLIEST/origin spec of era benchmarks** —
it PRE-DATES the batch-37 "AMPU Benchmark Update" (`benchmarkupd` / #253) which
later expanded the model. The headline value here is (a) the **original simpler
model: ONE central benchmark per party per era**, deliberately chosen over a
"5–10 per era" idea, and (b) the **settled point values** (1,000/faction) and the
**"End of Term" scoring rule** that #68/#102/#253 reference but never fully pin.

**Authority:** vcczar (creator) + MrPotatoTed (Ted) = tier-1. Both are
designer-authoritative; the rule changes here are RULEBOOK edits ("updated the
rules," POST 9).

**Maps to EXISTING gaps** — NO new IDs: **#253** (the benchmark dataset+scorer —
this is its DESIGN ORIGIN), **#68** (per-era point-banking — this settles the
"End of Term" point values & faction count), **#102** (dual era scoring), **#206**
(era-table reconciliation — this adds a 4th cardinality: 15 eras). 0% shipped
(verified on #253: no benchmark/end-of-era scorer in `src/`).

---

## What the thread is
vcczar (POST 1, dup POST 2): *"While it won't affect this playthrough, I've
created Era Benchmarks… to increase tension and add flavor to each historical.
The sole party that has accomplished their benchmark when the era ends gains
points and the other loses points. If both parties accomplish their benchmark,
no one scores points."* Posted to the active playtest group as a forward-looking
rules addition, then negotiated into shape with Ted across POST 3-9.

## 1. ★ The ORIGINAL model: ONE benchmark per party per era (the design fork)
vcczar, POST 1: *"Originally, I was going to have anywhere from 5 to 10
benchmarks per era; however, I thought that would force the game too much.
Therefore, I'll just have 1 central issue per party."*

- The Dec-2021 origin model is **1 benchmark per party per era** (a Red goal + a
  Blue goal), deliberately chosen over "5–10 per era."
- **DESIGN EVOLUTION (cross-ref #253):** the batch-37 `benchmarkupd` LATER
  expanded the SAME system back to **~10 benchmarks/era × 13 eras × 2 parties**.
  So the trajectory is **1-per-party (Dec-2021, this thread) → ~10/era (2022,
  #253)**. This thread is the simpler ancestor; #253 is the expanded successor.
  The scoring SHELL (party-relative, evaluated at era end) is identical across
  both — only the predicate COUNT grew.
- The benchmark goals double as a **per-era ideological-identity / platform
  definition** for each party (Red vs Blue "win state" by era) — the same
  party-relative encoding #253 records, here in seed form. Feeds the
  party-evolution / era-band model (#206/#92).

## 2. ★ Scoring rule — the "End of Term" section (settled live)
Ted asks "how many points?" (POST 2); the rule is pinned over POST 3-9. It lives
in the **"End of Term" section of the rules** (POST 3).

The settled rule (the four cases):
- **Only ONE party accomplishes its benchmark** → that party **GAINS** points AND
  the other party **LOSES** points.
- **BOTH parties accomplish** → **no points** to anyone.
- **NEITHER accomplishes** → **only the party-leader factions lose** (the two
  party-leader factions each take the penalty).

**Point value — settled at 1,000 PER FACTION** (the live negotiation):
- Started at **250/faction** (POST 3: "1,000 pts gained (250 per faction)").
- Ted: point values "feel low… barely worth chasing over the course of an entire
  era" (POST 5).
- **Raised to 1,000/faction** (POST 8 Ted proposes; POST 9 vcczar: "Ok, updated
  the rules"). With +1,000/faction to the winner and −1,000/faction to the loser
  across **5 factions/party**, this creates a **~10,000-point party gap swing**
  (POST 8-9).

**★ Confirms 5 FACTIONS PER PARTY** (corroborates #68/#102's B1–B5 / R1–R5 slot
model): vcczar miscalculated the math at 4 factions (POST 4: "how's that math
working out? There's five factions per team, not four"); Ted had thought it was
**8 factions each** (POST 6: "For some reason I thought it was 8 factions each").
The corrected, canonical count is **5 factions/party = 10 factions total.**

**Scoring-scale calibration datum (POST 7-8, for #68 weight-tuning):** vcczar is
"still trying to gauge what is a lot of points." Reference points given:
- **Most laws are worth "a couple hundred points in either direction, or less."**
- The biggest single play seen: jvikings1, as **Secretary of Defense AND holder
  of the Military-Industrial-Complex faction**, suggested the "President Calls Up
  Militia" act, then had his own politician PROPOSE it → **4× the usual points** +
  his faction's normal gain ≈ **~2,250 points from one law** (POST 7-8). So a
  1,000/faction benchmark (10k party swing) is calibrated to be **bigger than any
  single law** — era-defining, as intended.

## 3. ★ The 15-era Red/Blue benchmark TABLE (POST 1/2, verbatim-compact)
The original 1-per-party-per-era goals, in order. (This is a **15-era**
enumeration — Independence + 13 historical + Future — a 4th cardinality to
reconcile with the 15/14/13 tables on #206; see §4.)

| Era | Red goal | Blue goal |
|-----|----------|-----------|
| Independence | **none** (no strong central govt; parties nebulous; goals too shared) | none |
| Federalism | establish the US Bank | admit **TN + KY** as states |
| Republicanism | **avoid** war with the UK | **embargo** the UK (may force war) |
| Democracy | keep the **US Bank active** all era (Bank War) | **kill** the US Bank |
| Manifest Destiny | **raise** the tariff higher than the previous era | tariff **lower** |
| Nationalism | **abolish slavery** | **acquire Cuba** (friendly to the South / slave state if legal) |
| Gilded Age | **Gold Standard** | **Bimetalism** |
| Progressivism | **acquire Hawaii** (imperialist aims) | **Banking Reform** |
| Normalcy | **restrict immigration** | pass an **agriculture bill** |
| Ideologies | **raise the tariff** (again) | pass **Social Security** |
| Nuclear Age | **weaken labor unions** | pass **both Medicare AND Medicaid** |
| Neocons | **deregulate / repeal regulations** | **raise the minimum wage** |
| Terror | **lower the top tax rate** | pass **Federal Healthcare** |
| Populism | **2× as many SCOTUS justices** as the other party (forces "Merrick Garlanding") | **improve the Planet's Health** (e.g. a Green New Deal) |
| Future | **none** (party direction fully player-controlled) | none |

Notes on the table:
- vcczar attaches strategic color to several: in **Federalism**, Red voting
  against TN/KY statehood hurts Red support there once admitted — a Red lead might
  just allow statehood and neutralize Blue's gain by getting the Bank (POST 1). In
  **Republicanism**, Blue is in a bind if UK relations are good — "Blue may have
  to use a lot of their power to antagonize the UK" (POST 1). **Nationalism**'s two
  goals are "difficult… would be made easier by a Civil War" (POST 1).
- **Independence and Future carry NO benchmark** — bookends of the
  player-directed open era. (vcczar, Future: *"Democrats could become anti-science
  and the GOP might become the comforters of the poor and ill."*)
- These goals are the **ORIGIN** of the per-party platform content later expanded
  in #253; the Red/Blue mirroring (tariff up/down, Bank keep/kill, Gold/Bimetal)
  is already present here in single-issue form.

## 4. ★ Era-table reconciliation note (→ #206)
This is a **15-era list** (Independence + 13 + Future). It is a NEW cardinality to
fold into the #206 reconciliation, which already tracks **15-rulebook (§A) vs
14-halfterm vs 13-benchmarkupd**:
- It **matches the 15-rulebook cardinality** (includes both Independence and
  Future as no-benchmark bookends) — unlike `benchmarkupd`/#253, which OMITS both
  (13-era "main historical run").
- **Era NAMES align** with the rulebook 15-era set (Independence, Federalism,
  Republicanism, Democracy, Manifest Destiny, Nationalism, Gilded Age,
  Progressivism, Normalcy, Ideologies, Nuclear Age, Neocons, Terror, Populism,
  Future). **No explicit year ranges** are given in this thread (it lists eras as
  benchmark headers only), so it adds no new boundary dates — but it is INDEPENDENT
  corroboration that the designer's mental era model is the **15-label set**, not
  the shipped 4-value enum. Reconcile alongside the other tables; no new dates.

## 5. ★ Multiplayer use — benchmarks as bargaining chips (→ #253)
vcczar, POST 1: *"In games involving many human players, these could be used as
bargaining chips. 'I'll support bimetalism, if you vote for the Civil Rights
bill.' In this case, Red is willing to take a benchmark hit to get a boost of
support that might win them reelection."*
- Benchmarks are designed to be **tradeable across the negotiating table** in
  multiplayer; a party may **deliberately eat a benchmark hit** (the −1,000/faction
  loss) in exchange for a vote/support that wins it reelection.
- Implication for the build: the era-end scorer (#253/#68/#102) is not just a
  passive tally — it's an explicit, *known-in-advance* lever players steer toward
  or trade away. The penalty must be predictable enough to price into a deal.

---

## Relation to existing gaps (consolidation agent owns the gap-log write)

- **(→ #253) DESIGN ORIGIN of the benchmark system.** This Dec-2021 thread is the
  EARLIEST spec of era benchmarks — the **1-per-party-per-era** ancestor of the
  ~10/era `benchmarkupd` dataset (#253). Same party-relative, evaluated-at-era-end
  shell; only the predicate count grew (1 → ~10/era). The 15-era Red/Blue single-
  issue table (§3) is the seed content. Source: POST 1, 2.
- **(→ #68) Settles the "End of Term" scoring numbers #68 references.** The
  era-end benchmark award is **+1,000 / −1,000 PER FACTION** (raised from 250),
  living in the rulebook "End of Term" section; four-case rule (one→swing /
  both→nothing / neither→party-leaders-lose). Scale calibration: most laws ≈ "a
  couple hundred pts," biggest single play ≈ 2,250 (the SecDef self-proposal stack)
  — so the benchmark is deliberately the largest single swing in the game. Source:
  POST 3, 5, 7, 8, 9.
- **(→ #68/#102) Confirms 5 FACTIONS PER PARTY** (B1–B5 / R1–R5). vcczar corrected
  Ted's "8 factions" and his own "4 factions" math to the canonical **5/party = 10
  total**, yielding the ~10,000-pt party swing. Corroborates the faction-slot
  model. Source: POST 4, 6, 8.
- **(→ #102) Per-party era-end benchmark feeds the dual scoring.** The
  party-relative gain/loss at era end slots into both the per-era winner and the
  cumulative bank #102 tracks. Source: POST 1, 3.
- **(→ #206) A 15-era enumeration (4th cardinality).** Matches the rulebook
  15-label set (Independence + 13 + Future as no-benchmark bookends), UNLIKE the
  13-era `benchmarkupd` list. No new year boundaries (header-only). Independent
  corroboration that the designer's era model is 15 labels, not the shipped 4-enum.
  Source: POST 1, 2.

## Open questions / flags
- **Point-value drift:** this thread settles 1,000/faction (Dec-2021). `#253`
  (2022) says benchmark weights are still "TBD" / the old point system "only
  slightly amended." So is the 1,000/faction figure the LATEST canonical weight,
  or was it re-opened when the dataset expanded to ~10/era? (If ~10 benchmarks/era
  each paid 1,000/faction, the per-era swing would balloon ~10×.) Reconcile this
  thread's settled 1,000/faction with #253's "TBD/amended" before implementing the
  scorer. Likely the per-benchmark value was rescaled when the count grew — confirm
  with vcczar/Ted.
- **"Neither accomplishes → only party-leader factions lose":** which factions are
  the "party-leader factions" at era end — the highest-PV faction per party, the
  faction holding the party-leader office, or a fixed slot? (Bears on #68's
  point-banking penalty clauses.) Not disambiguated here.
- Engine status (do not re-derive): **no era-end benchmark scorer ships** — the
  #253/#68/#102 cluster is 0% built; the era-end-scoring + per-era-snapshot
  requirements live on #253.
