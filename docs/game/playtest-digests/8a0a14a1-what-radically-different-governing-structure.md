# Digest — "What radically different governing structure / history would you most like to try out" (`8a0a14a1`, politicslounge topic 5026)

**Scope:** A short **meta/wish-list discussion** thread (16 posts, ~6.4k chars,
Nov 29 – Dec 9 2023; 1 chunk). Participants: pman, theFreezerFlame, ebrk85,
Largo833, Ich_bin_Tyler, plus one player planning a solo run. **Not a
playthrough** — players brainstorm counterfactual scenarios they'd like to test.
Its durable value is twofold: (1) a **catalog of desired structural-flexibility
modes** (alt legislature, alt Convention, regional remap, alt war outcome), and
(2) two **precise, quotable CPU-behavior facts** that corroborate and sharpen the
already-tracked deterministic-CPU work. **DIGEST-ONLY** — does not touch
`game-context.md`; consolidation owns the gap log.

**Cross-refs:** The CPU facts feed the EXISTING CPU gap cluster — the CPU
vote/decision model and the **un-seeded RNG / determinism** gap documented in the
`c8d89e49` "Fixing CPU Rules" digest (§4, §7). The "northern playtest /
radically different regions" and "CSA wins" wishes overlap the Civil-War /
secession cluster in the `9c383f22` digest (Northern secession, non-playable
rumps). The "alt Constitutional Convention" wish overlaps the Convention system
(`constitutionalConvention.ts`). **No gap numbers assigned — consolidation owns that.**

---

## 1. ★ The two CPU-behavior facts (highest-value content)

These are the headline. Capture them verbatim; they are the clearest statement
in the corpus of *how* the CPU is meant to decide, and they are in **tension**.

### 1a. "The CPU is programmed to want historical choices." (POST 8, restated POST 11)
- ebrk85 (a rules-implementer): **"The CPU is programmed to want historical
  choices. So yea human players have to band together to get anything
  ahistorical though a Convention. And even then it's really hard."** (POST 8).
- Corroborated by lived experience: Ich_bin_Tyler's group started a fresh
  playtest specifically to make the Constitutional Convention come out
  differently and **"the CPUs had other ideas"** — the only ahistorical thing
  they pushed through was **"Slaves not counted towards Electoral vote total of
  states"** (the "No counting" slave-compromise option), and an earlier attempt
  at "voting rights for all men" (POSTs 6-7).
- Design read: there is a **deliberate pro-historical bias** in CPU decision-
  making at branch points (Conventions, presumably era events / legislation).
  The default outcome trends toward the real-history outcome unless humans
  actively coordinate against it.

### 1b. "Effect on the faction's score is the largest single factor in how a CPU votes." (POST 11)
- Largo833: **"…given that effect on the faction score plays the largest part in
  how a CPU votes, I can easily imagine most games playing out where the slaves
  are never freed and women never get the right to vote."** (POST 11).
- Design read: the **core of the CPU vote model is faction-score optimization** —
  a CPU supports/opposes a measure primarily by its projected effect on the
  controlling faction's score, NOT by history. This is the operative scoring
  signal the browser port's deterministic CPU must encode.

### 1c. ★ The TENSION between 1a and 1b (capture explicitly)
- The two facts pull opposite ways: **"wants historical choices" (1a)** vs.
  **"optimizes faction score" (1b)**. Largo833 (POST 11) makes the tension the
  whole point: a **long-running 9-CPU game** (no human coordination) would
  plausibly produce **very AHISTORICAL** outcomes — slaves never freed, women
  never enfranchised — *because* CPUs chase faction score, not history. So the
  "historical bias" is not absolute; it is a tendency that **pure faction-score
  optimization can override** when no human forces the issue.
- **Reconciliation for the spec:** the historical bias is most likely (i) a
  *default/tie-break* layer or a *weighting nudge* on top of (ii) a primary
  faction-score objective. The forum does not specify the exact blend — **open
  question for the human** (see §4). The port must decide how the
  historical-preference weight composes with the faction-score objective.

### 1d. Eras 1-2 are heavily biased; coordinated Blue control pre-1840 is the lever (POST 13)
- pman: **"The first two eras of the game are so biased (as they were irl) that
  you could do a ton of damage to historical norms if you control the Blue Party
  until 1840."** A human controlling **2-3 center-Blue factions** could force
  extreme departures (e.g. **lifetime President**) "quite easy[ily]" (POST 13).
- Design read: the early-era CPU bias is *strong* (mirrors real history's path-
  dependence), so the **lever for ahistorical play is coordinated control of the
  Blue Party before 1840**. This is a balance/era-bias fact, not a new system —
  but it tells the roadmap that early-era CPU preferences are deliberately heavy.
- Caveat (POST 13): "really something we won't be able to test out until Beta" —
  i.e. this is asserted design intuition, not a verified playtest result.

---

## 2. Catalog of desired counterfactual / structural-flexibility modes

Players wish-list these as things they (and future real players) will inevitably
try. Frame each as a **scenario / structural-parameterizability requirement** —
"how parameterizable are the legislature, regions, and Convention outcomes?"

1. **Northern / regional remap** — "a playtest with radically different regions…
   a northern playtest" / "versions of the USA with massively different regions"
   (POSTs 1, 4). Overlaps the Northern-secession cluster (`9c383f22`).
2. **Radically different Constitutional Convention** — run a Convention with the
   explicit goal of a very different constitution (POSTs 2, 4, 6).
3. **Full 1772 → 2022 run** — a single campaign spanning every era end-to-end
   (POSTs 3, 5, 10). Constraint, not a rule: spreadsheet playtests are slow and
   "most playtests die before you'd get there"; longest reached ~50-60 yrs and is
   a **9-CPU game** (POSTs 5, 14). (Context for why late-era behavior is
   under-tested — feeds nothing mechanical, but explains thin late-game data.)
4. **No-Senate / House-only (unicameral) legislature** — "a playtest with no
   Senate and only the House since that could prove a little bit volatile"
   (POST 7). A **structural legislature-shape** parameter.
5. **CSA wins** — "a game where the CSA wins would be intriguing but definitely
   hard to pull off how things have been tested with the Civil War so far"
   (POST 7). Overlaps the South-wins Reconstruction branch (`9c383f22`).
6. **Lifetime-appointed President** — debated in the 1868 playtest (POST 1);
   one player plans a solo run "maybe… of having lifetime appointed president"
   (POST 10); cited as the marquee example of an extreme Convention outcome a
   coordinated Blue bloc could force (POST 13).

---

## 3. SHIPPED vs. DESIGNED — code verification (Opus, this batch)

**CPU vote model (the faction-score fact, 1b):**
- **The shipped CPU vote is an AFFILIATION model, not an explicit faction-score
  model.** `voteCC` (`continentalCongress.ts:199-226`) decides each delegate's
  aye/nay by a flat probability keyed on relationship to the bill's sponsor:
  **same-faction → 0.92, same-party → 0.60, else → 0.20**
  (`continentalCongress.ts:211-215`), nudged by `cardVoteBias(...)` over the
  bill's interest-group cards. There is **no computation of the bill's projected
  effect on the voting faction's score** — the forum's "effect on faction score
  is the largest factor" (POST 11) is **NOT how the shipped CC vote works**; the
  build uses party/faction *identity* as a proxy. (This is the only legislative
  vote in the build — it is CC-era; no general post-Convention legislature vote
  with a richer model exists yet.)
- **The vote is non-deterministic:** each delegate resolves via `chance(p)` →
  `rand()` → **`Math.random()`** (`rng.ts:4-6, 45-47`).

**Historical-preference bias (the historical fact, 1a):**
- **A pro-historical default DOES exist for era events, and it is deterministic.**
  `pickAIResponse` (`eraGraph.ts:88-109`) documents **"the spine/historical
  response (id 'a') is the default"** and falls back to the historical/first
  response when no faction bias applies; core-spine ("inevitable") nodes fire
  unconditionally (`eraGraph.ts:~118+`). So "CPU wants historical choices" is
  **partially shipped for the 1772 era-event graph** as a first-response default,
  not as a score-weighted preference.
- **The Convention CPU has NO historical-preference layer.** `autoFillCPUVotes` /
  `preferredOption` (`constitutionalConvention.ts:81-123`) pick each article by
  **party identity + `chance()` coin-flips** (e.g. legislature: RED→bicameral,
  BLUE→`chance(0.7)?bicameral:unicameral`; term limits: BLUE→two_terms,
  else→no_limits). There is **no "prefer the historical outcome" weighting** and
  no faction-score input — and the rolls are `Math.random`-based, so a "radically
  different Convention" (POST 2) is not reproducible/tunable today.

**Unicameral / no-Senate legislature (POST 7):**
- **Representable as a Convention VOTE, but mechanically INERT.** The Convention
  offers a `legislature` article with **`bicameral` vs `unicameral`** options
  (`constitutionalConvention.ts:8-15`) and `ConstitutionalArticles.legislature:
  'bicameral' | 'unicameral'` is a stored field (`types.ts:1390`). **BUT a
  grep shows `legislature` / `unicameral` are never READ downstream** — no
  House/Senate construction branches on the article. The legislature is
  effectively **hardcoded bicameral** (CC → House + Senate); choosing
  "Unicameral" records a value that **does nothing**. 1856 hardcodes
  `legislature: 'bicameral'` (`scenario1856.ts:183`). So a no-Senate playtest is
  **0% mechanically shipped** — the data slot exists, the structural consequence
  does not.

**Regional remap (POSTs 1, 4):**
- **Regions are a FIXED enum, not parameterized.** `State.region` is a closed
  union (`'Northeast' | 'Midwest' | 'South' | 'West' | 'Border' | 'Canada' |
  'Caribbean' | 'Latin America' | 'Pacific' | 'Atlantic'`, `types.ts:1322`) and
  each state's region is statically assigned in scenario data. There is **no
  mechanism to remap which states belong to which region** (a "radically
  different regions" / Northern playtest). Region drives loyalty decay and
  relocation today (`types.ts:1151,242-244`); it is consumed, not configurable.

**Lifetime President (POSTs 1, 10, 13):**
- Partial data slot only. The Convention `termLimits` article offers
  `two_terms | no_limits` (`constitutionalConvention.ts:60-66`;
  `ConstitutionalArticles.termLimits`, `types.ts`), and `State.termLimits` exists
  (`'two_terms' | 'no_limits'`). **"No limits" ≠ "lifetime appointed"** — there
  is no *appointed-for-life* executive option (the executive article tops out at
  elected/congressional/council, `constitutionalConvention.ts:18-24`), and no
  evidence the Convention's `termLimits` value is enforced on presidential
  re-eligibility. The marquee ahistorical lever the thread names is thus **not
  representable as designed** beyond an unenforced "no_limits" flag.

**CSA wins (POST 7):** see `9c383f22` digest — CW is a single scripted
`startWar` abstraction (`phaseRunners.ts:3001-3054`) with no win/loss branch.

---

## 4. Open questions (for the human)

- **How does the historical bias compose with faction-score?** (1a vs 1b, POSTs
  8, 11.) Is "wants historical choices" a default/tie-break, a fixed weight added
  to the faction-score objective, or an era-decaying nudge? The forum asserts both
  but never specifies the blend. The deterministic-CPU spec must pin this.
- **Is the faction-score the SINGLE input, or just the dominant one?** POST 11
  says "largest part" — implying secondary factors (party, ideology, interest
  cards). The shipped `voteCC` uses identity+card-bias; the designed model is
  score-led. Needs the team rules sheet to enumerate the full vote-scoring inputs.
- **Should `legislature: unicameral` actually do something?** If a no-Senate
  playtest (POST 7) is in scope, the article needs to drive legislature
  construction. Currently inert.
- **Is regional remap in scope at all, or only secession-driven regional change?**
  POST 1's "radically different regions" could mean a config-time remap or just
  the in-game Northern-secession path (`9c383f22`). Ambiguous.
- **"Lifetime appointed President"** (POST 10) — a new executive-article option,
  or just enforcing `termLimits: no_limits`? Not specified.

---

## 5. Deltas vs current build (handoff)

**Headline:** This meta-thread contributes **two precise CPU-model facts** that
sharpen the EXISTING deterministic-CPU gap, plus a **catalog of structural-
flexibility wishes** (unicameral legislature, regional remap, alt-Convention
outcomes, lifetime President) that are **largely unrepresentable or inert** in the
current scenario/types model.

1. **Faction-score-led CPU vote model (corroborates existing CPU gap).** Designed:
   "effect on faction score is the largest factor" (POST 11). Shipped: `voteCC`
   uses a flat same-faction/same-party/other affiliation probability + card-bias
   (`continentalCongress.ts:211-215`), **no faction-score computation**. Delta =
   replace identity-proxy with a score-weighted vote.
2. **Historical-preference bias is partial + has no faction-score blend (sharpens
   existing CPU gap).** Designed: "CPU programmed to want historical choices"
   (POST 8), in *tension* with #1. Shipped: a deterministic "historical = default
   response" exists only for the **1772 era-event graph** (`eraGraph.ts:88-109`);
   the **Convention CPU has no historical weighting** at all
   (`constitutionalConvention.ts:102-123`, pure party + coin-flip). Delta =
   define the historical-bias × faction-score composition and extend it to
   Conventions/legislation.
3. **Un-seeded RNG (existing determinism gap, re-confirmed).** All CPU
   decisions above (`voteCC`, `autoFillCPUVotes`/`preferredOption`, ratification)
   resolve via `chance()`/`pick()` → `Math.random()` (`rng.ts:4-6,45-47`),
   contradicting CLAUDE.md's "seeded RNG." A "radically different Convention"
   playtest is not reproducible/tunable until seeded. (Dup of `c8d89e49` §4.)
4. **Unicameral / no-Senate legislature — recordable but INERT (NEW structural
   gap).** `legislature: bicameral|unicameral` is a Convention article + stored
   field (`constitutionalConvention.ts:8-15`, `types.ts:1390`) but is **never
   read** — legislature is hardcoded bicameral. Delta = make the article drive
   legislature structure if no-Senate play (POST 7) is in scope.
5. **Regional remap — NOT parameterized (NEW structural gap).** `State.region` is
   a fixed enum (`types.ts:1322`), statically assigned; no remap mechanism for a
   "radically different regions" / Northern playtest (POST 1). Overlaps the
   `9c383f22` Northern-secession cluster.
6. **Alt-Convention outcomes underpowered (NEW/overlap).** The Convention offers
   articles but the CPU has no way to be *pushed* ahistorical via faction-score
   coordination (the human lever in POSTs 8, 13), and several outcomes
   (unicameral #4, lifetime President below) don't take effect. Delta = make
   Convention outcomes mechanically consequential + CPU-pushable.
7. **Lifetime-appointed President — not representable (NEW, low priority).**
   Only an unenforced `termLimits: no_limits` exists; no appointed-for-life
   executive option (`constitutionalConvention.ts:18-24,60-66`). (POSTs 1,10,13.)
8. **Early-era CPU bias is intentionally heavy; Blue-bloc pre-1840 is the
   ahistorical lever (balance note, not a system).** POST 13 — informs tuning of
   era-1/2 CPU preference strength, not a build feature.
