# Digest — "Meter Interpretation" (topic 1530, `6801b9f4`)

**Scope:** A short (11-post, ~7k-char) **rules-interpretation thread** among
hosts/playtesters — vcczar ("V", cited secondhand), MrPotatoTed (Ted), Rezi,
Arkansas Progressive (Ark), Ich_bin_Tyler (Tyler). No campaign narration; it is
pure **election-engine spec discussion**, dated Sept 2022, framed against an
in-progress **1916 / version-2.8** playtest approaching the **1918 midterms**.
This is one of the richest single sources for *how the meter→election pipeline is
intended to work*, and it surfaces several rulings that the shipped browser build
does **not** implement. Era framing: 1916 Progressive/WWI era — see
`historical-context.md` §5 (the pre-realignment hinge; polarity in flux). The
worked example places **R+3 party-pref with a Democratic +5 Alabama state bias**,
consistent with the Solid-South Democratic / pro-business-Republican split of the
period.

Provenance note: this thread is a *forum house-rules debate*, so the GMs
themselves disagree and hedge ("that's just how I do it," "I believe," "probably
forgot"). Where they converge — and where Ted states the **shipped** behavior — is
flagged as such. Cite posts via the `===== POST n =====` markers.

---

## 1. ★ The canonical election vote-score formula (worked example: 1916 AL Gov, POST 1/5)

Ark states the **summed-additive** model he's been using ("applying each of the
bonuses or maluses, after calculating net changes, on top of each other using
candidate ideology … the 'pure' way"). The hypothetical **Alabama Governor**
race, fully transcribed:

**Meter state in 1916 (v2.8)** — each meter's value, and the ideology
enthusiasm-shifts it currently produces (POST 1):

| Meter | Value | Enthusiasm effect |
|---|---|---|
| Rev-Budget (revenue) | 7 | Cons +1, Progs −1 |
| Econ-Stab (economic) | 7 | none |
| Mil-Prep (military) | 8 | none |
| Dom-Stab (domestic) | 7 | none |
| Honest-Gov (honest) | 5 | none |
| Quality of Life | 7 | Libs +1 |
| Planet's Health | 8 | LW Pop +1 |
| **Party Pref** | **R+3** | (national party lean) |

Net resulting ideology enthusiasm (after summing the meter shifts): **LW Pop +1**,
**Trads +1 Blue**, **RW Pop +1 Blue** (POST 1). (Note these net values are what
Ark feeds the candidates; the +2 LW-Pop figure he uses below appears to fold in
an additional source he didn't itemize — see the "open question" on the LW-Pop +1
vs +2 arithmetic.)

**Candidate scores** (highest total wins):

- **William F. Aldrich (Moderate, RED):** meters give **+3** (party-pref R+3
  only; Moderate gets no enthusiasm shift). Die roll **3**. → **6**.
- **Gov. Charles Henderson (LW Pop, BLUE, incumbent):**
  - incumbent **+1**
  - has media card **+1**
  - **+2 from meters** (being LW Pop)
  - **+5 from AL state bias** (Blue) — *initially forgotten, corrected in POST 2*
  - **−1** president's-party midterm penalty
  - die roll **4**
  - → **13**.
- **Result: Henderson wins 13–6** (POST 1, corrected POST 2).

So the **designed per-candidate election score** = sum of:
`ideological-enthusiasm-from-meters + party-pref + incumbent(+1) +
media-card(+1) + state-bias(+5 for matching party) + midterm-penalty(−1 for the
president's party) + random die roll`. Highest total takes the seat.

---

## 2. ★ The crucial designer rulings (high-value deltas)

### (a) Enthusiasm bonus applies ONLY if that ideology is ALSO the state's preferred ideology (POST 5–6)
Rezi: "the one notable difference is that **Henderson would only get +1 from being
LW Pop** in my rules, because **I don't give ideological enthusiasm bonuses unless
it's also the state ideology**, as it makes 0 sense for a LW Populist to get a
boost in Alabama, no matter how much national Democrats like LW Pops" (POST 5).
Ted: "**Yeah, I do it Rezi's way. I think that's how V said to do it forever ago**"
(POST 6). → The candidate's **score-from-meters is GATED on a state-ideology
match**; national enthusiasm alone does not transfer to a state that doesn't like
that ideology. (This is presented as the *correct/original* design — "how V said
to do it.")

### (b) A SEPARATE +1 (designed at 75% chance) for matching the state's preferred ideology (POST 7–9)
Distinct from the enthusiasm bonus. Ark (POST 7): in presidential elections "the
candidate gets a **+1 for having an ideology matching the state's liked
ideology**" — but not from meters. Ted confirms **both apply** (POST 8):
> "imagine Conservative enthusiasm is +3 Red, and a state prefers Conservatives. A
> **Red Conservative** gets the **+3 from enthusiasm PLUS a 75% chance of +1** for
> matching preferred ideology. A **Blue Conservative** does **NOT** get the +3
> enthusiasm (Conservatives prefer red), but **WOULD still get 75% of +1** for
> matching preferred ideology. Think of **Joe Manchin** … a Conservative blue …
> winning in West Virginia."

So two separate ideology terms: (1) the *party-tied enthusiasm* bonus (gated on
state-ideology match per (a)), and (2) a *party-agnostic* "+1 at 75%" for the
candidate's ideology == the state's preferred ideology. Manchin gets (2) but not
(1).

★ **But Ted admits the 75% term never actually shipped that way** (POST 9):
> "annoyingly I did *probably* forget to set up the 75% columns in the elections
> (this was **when the state bias matches were guaranteed**)."

I.e. the *shipped* (forum-rules) behavior collapsed the intended **75% chance of
+1** into a **guaranteed +1** for the ideology match. Design intent = 75%;
implemented intent (in the forum ruleset) = guaranteed.

### (c) Enthusiasm is computed at the END of the Lingering phase (POST 6)
Ted: "I calculate **faction ideology enthusiasm from the meters at the end of the
lingering phase, not right before elections**." So in the designed pipeline,
enthusiasm is a *snapshot derived from meters once per turn at end-of-Lingering*,
then read by the election step — not recomputed at election time.

### (d) ★ Quality-of-Life + Planet's-Health meters are ERA-GATED unlocks (POST 3)
Tyler: "Quality and Life and Planet Health wouldn't be active, right? **They
unlock later on**, unless I'm crazy." (Unchallenged → treated as agreed.) The
**8 meters** seen in this thread:
1. Rev-Budget (revenue)
2. Econ-Stab (economic)
3. Mil-Prep (military)
4. Dom-Stab (domestic)
5. Honest-Gov (honest)
6. **Quality of Life** — *later-era unlock*
7. **Planet's Health** — *later-era unlock*
8. Party Pref (the national party-lean meter, distinct from the 7 ideology-shift
   meters)

So **not all meters are live from game start**; QoL and Planet's-Health activate
in a later era. In 1916 Tyler argues they shouldn't yet be contributing the
Libs +1 / LW-Pop +1 shifts Ark listed. (Ambiguous whether 1916 is "later enough"
to have unlocked them — Ark applied them, Tyler doubted; see open questions.)

### (e) Elections are a designer-acknowledged REWORK target (POST 10)
Ted: "Yeah, **I'd like to really rework how elections work in general**, but I
don't think I'm going to get that far before September 19th." → Treat the entire
election scoring model as *explicitly slated for redesign*, not settled canon.

---

## 3. Code verification vs. shipped build

Verified against `src/engine/phaseRunners.ts` `calcStateVote` (the single election
scoring function, used by president/governor/senate-pre17/house — lines
**3685–3723**), the meter model (`NationalMeters`, `types.ts:1399`), the
enthusiasm model (`Enthusiasm`, `types.ts:1415`), the `State` type
(`types.ts:1318`), and scenario seeds (`scenario1856.ts`, `scenario1772.ts`).

**Shipped `calcStateVote` score (per candidate):**
```
score = 50
      + baseLean * 5        // baseLean = ±state.bias by party
      + partyPref * 5       // ±game.partyPreference by party
      + enthusiasm * 2      // game.enthusiasm[ideology][party]  (NOT gated)
      + pv * 0.1            // pvCache (office-weighted PV)
      + factionBias         // interest/lobby-card driven, capped ±3
      + traitBonus          // PR4a trait election effects
      + (Math.random()-0.5) * 8   // ≈ ±4 noise
```
Winner = highest `pct` (share of summed scores) per state.

Point-by-point against the thread:

- **(a) enthusiasm-only-if-state-ideology — NOT IMPLEMENTED.** `enthusiasm * 2`
  (line 3696/3709) is applied **unconditionally**; the candidate gets the full
  national `enthusiasm[ideology][party]` regardless of the state. The build does
  exactly the thing Rezi/Ted say is *wrong* ("0 sense for a LW Pop to get a boost
  in Alabama"). **There is no per-state preferred-ideology field to gate on** —
  `State` has only `bias: number` (a single signed BLUE/RED scalar,
  `types.ts:1324`), no ideology preference (grep for
  `preferredIdeology|likedIdeology|stateIdeology|favoredIdeology` → **zero
  matches** in `src/`).

- **(b) the +1 ideology-match bonus (75% or guaranteed) — NOT IMPLEMENTED at
  all.** Neither the 75%-chance version (design intent) nor the guaranteed version
  (Ted's shipped-forum behavior) exists in `calcStateVote`. There is no candidate-
  ideology-vs-state-preference term whatsoever — again, because no state-preferred-
  ideology data exists. So the build is *behind even the forum build* here.

- **(c) enthusiasm computed at end-of-Lingering from meters — NOT IMPLEMENTED.**
  ★ Critically, **the build never derives enthusiasm from meters anywhere.**
  `game.enthusiasm` is a **static authored table** (`buildEnthusiasm()` in each
  scenario, e.g. `scenario1856.ts:18-31`) that is only ever *mutated by era-event
  effects* (`applyEffect`, `phaseRunners.ts:3229-3232`). Grep for
  `refreshEnthusiasm|computeEnthusiasm|enthusiasmFromMeters` → none. The entire
  meter→enthusiasm derivation pipeline this thread is *about* does not exist in
  code; meters and enthusiasm are decoupled. (Meters move other things — they
  appear as `effect.meters` and feed UI/legislation — but they do **not** feed the
  ideology-enthusiasm table that elections read.)

- **state-bias term — PARTIAL / DIFFERENT.** Designed: a flat **+5** for the
  candidate whose party matches the state lean (POST 1, "+5 from AL state bias").
  Shipped: `baseLean * 5` where `baseLean = ±state.bias` — a **continuous** signed
  term scaling with the magnitude of `state.bias`, not a flat +5. Same family
  (state lean × 5), but graduated rather than the binary +5 the worked example
  uses. (Cross-ref #247 dynamic-state-bias: the build's `state.bias` is already a
  drifting continuous value — see `IDEOLOGY_SHIFT_ODDS.drift.stateBias`,
  `phaseRunners.ts:903-906 / 2608` — which is more in line with #247's
  dynamic-bias direction than with this thread's flat +5.)

- **incumbent +1 — NOT IMPLEMENTED as a score term.** Grep
  `incumbentBonus|midterm|mediaCard|presParty` → **zero matches** in `src/`.
  Incumbency affects elections only *indirectly* via `pvCache` (office-weighted
  PV, `pv.ts`) flowing through `pv * 0.1`, and via a separate incumbent-challenge
  branch in the *appointment/seating* path (`phaseRunners.ts:~2040`), not via a
  `+1` in `calcStateVote`.

- **media-card +1 — NOT IMPLEMENTED.** No media-card concept in the election
  score (zero grep matches).

- **president's-party midterm penalty (−1) — NOT IMPLEMENTED.** No midterm /
  president-party term anywhere (zero grep matches). The build does not penalize
  the president's party in midterm-year elections.

- **(d) era-gated meters (QoL/Planet) — NOT IMPLEMENTED; opposite of intent.**
  Both `quality` and `planet` are permanent fields in `NationalMeters`
  (`types.ts:1399-1407`) and are **seeded with live values from turn one** —
  1856: `quality 0, planet 4`; 1772: `quality -1, planet 5`
  (`scenario*.ts STARTING_METERS`). `MetersPage.tsx:5` renders all 7 meters
  unconditionally. There is **no unlock/era-gate mechanism**; QoL and Planet are
  active in the 1772 and 1856 scenarios, contradicting POST 3's "they unlock
  later." Note also the build has **7 meters** (no separate "Party Pref" meter);
  party lean lives in `game.partyPreference` as its own scalar, not as an 8th
  meter.

- **die roll — present, but different shape.** Designed: a discrete die (values
  3/4 in the example), additive. Shipped: continuous `(Math.random()-0.5)*8`
  (≈ ±4) — and **non-deterministic** (`Math.random`), which violates the
  CLAUDE.md "keep engine deterministic, use `src/rng.ts`" rule. Worth flagging as
  an incidental bug independent of this thread.

Cross-refs: meter model #124/#12 — confirmed the 7-meter `NationalMeters` shape
and that meters are mutated by `effect.meters` but **not** wired into enthusiasm.
Dynamic state bias #247 — the build already uses a *continuous, drifting*
`state.bias` (closer to #247) rather than this thread's flat +5.

---

## 4. Open questions (for the human)

- **LW-Pop +1 vs +2 arithmetic (POST 1).** The net meter enthusiasm Ark lists is
  "LW Pop **+1**," but Henderson is scored "**+2** from meters (being LW Pop)."
  Source of the extra +1 is unstated — possibly a doubling, or an unlisted source,
  or simple inconsistency. The designed `enthusiasm * 2` multiplier in shipped
  code would turn a net "+1" into "+2", which may be exactly what Ark meant — i.e.
  the *raw* enthusiasm is +1 and the *applied* contribution is ×2. If so, the
  shipped `enthusiasm * 2` weight matches the worked example's intent.
- **When exactly do QoL / Planet unlock?** POST 3 asserts a later-era gate but no
  era/year is given; Ark (in 1916) applied them, Tyler doubted. Need the unlock
  era to build the gate. (If 1916 is post-unlock, the disagreement is just over
  whether 1916 qualifies.)
- **Is the +1 ideology-match meant to be 75% or guaranteed?** Design = 75%
  (POST 8); forum-shipped = guaranteed (POST 9, "this was when the state bias
  matches were guaranteed"). Pick one for the rework; the browser build currently
  has *neither*.
- **Does the midterm penalty apply to governor/house/senate alike, or only some
  offices?** The example is a Governor race in a midterm year and applies −1; the
  scope across office types isn't specified.

---

## 5. Deltas vs current build (headline)

1. **★ Canonical election vote-score formula (designed):**
   `enthusiasm-from-meters + party-pref + incumbent(+1) + media-card(+1) +
   state-bias(+5 on party match) + president-party-midterm-penalty(−1) + die roll`;
   highest sum wins (worked example: 1916 AL Gov, Henderson 13–6, POST 1/2). The
   shipped `calcStateVote` (`phaseRunners.ts:3685-3723`) keeps only enthusiasm,
   party-pref, and a *continuous* state-lean term; **missing: incumbent +1,
   media-card +1, midterm −1**, and it uses graduated `state.bias*5` rather than a
   flat +5.
2. **★ Enthusiasm-only-if-state-ideology gate (POST 5-6, "how V said to do it"):**
   NOT implemented. Build applies full national `enthusiasm*2` everywhere; there
   is **no per-state preferred-ideology field** on `State` to gate against
   (`types.ts:1318`, only `bias`). Requires adding a state preferred-ideology and
   gating the enthusiasm term on it.
3. **★ +1 ideology-match bonus (75% designed / guaranteed as shipped on forum)
   (POST 7-9):** entirely absent from the build — neither variant exists. Separate
   from enthusiasm (Manchin case). Depends on the same missing state-ideology data.
4. **★ Meter→enthusiasm derivation pipeline is MISSING (POST 6):** build's
   `game.enthusiasm` is a static authored table only nudged by era events
   (`scenario*.ts buildEnthusiasm`, `applyEffect:3229`); nothing derives it from
   meters, and nothing runs "at end of Lingering." This is the single biggest
   structural gap — the whole thread presumes a meter→enthusiasm step the engine
   doesn't have.
5. **★ Era-gated meters (POST 3):** NOT implemented and inverted — `quality` and
   `planet` are seeded live from turn one in both scenarios and shown
   unconditionally (`MetersPage.tsx:5`); no unlock mechanism. Designed: QoL +
   Planet's-Health activate only in a later era. Also note the design's 8th
   "Party Pref" meter is, in the build, the separate `game.partyPreference`
   scalar (7 meters, not 8).
6. **Elections flagged for full rework (POST 10):** designer explicitly wants to
   "really rework how elections work in general" — treat the scoring model as
   open, not canon.
7. **Incidental (not from thread):** `calcStateVote` uses non-deterministic
   `Math.random()` for the die-roll noise (line 3711), violating the CLAUDE.md
   deterministic-RNG rule (should use `src/rng.ts`).

---

*Source: `docs/game/sources/6801b9f4-meter-interpretation/chunk-001.md` (235
lines, 11 posts, ~7k chars). Code verified against `phaseRunners.ts`
(`calcStateVote` 3685, `applyEffect` 3209, `electionFactionBias` 1539),
`types.ts` (`NationalMeters` 1399, `Enthusiasm` 1415, `State` 1318),
`scenario1856.ts`/`scenario1772.ts` (`STARTING_METERS`, `buildEnthusiasm`),
`MetersPage.tsx`, `EnthusiasmPage.tsx`.*
