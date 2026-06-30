# Digest — 92202e9a "Is there a way to have a Jeannette Rankin situation?"

**Type: DESIGN-QUESTION thread — women's-suffrage / female-candidate-eligibility gating.**
7 posts / 1 chunk, **Feb 17 2024** (politicslounge topic 5183). A short, high-signal
design exchange: how to let a **woman hold federal office BEFORE the federal women's-
suffrage amendment passes** — the real **Jeannette Rankin** case (elected US House **1916**,
four years before the 19th Amendment of 1920, because Montana granted women's suffrage at
the **state** level in **1914**).

**Authority:** **vcczar** (Anthony, ruleset owner) answers and adjudicates; **theFreezerFlame**
asks the OP; **Euri** proposes the two general-rule options. vcczar endorses the per-state
flag ("makes sense to me," POST 7) and floats the random-woman event (POST 2).

---

## 1. The question + the historical grounding (POST 1, 5, 6)

- **OP (POST 1):** "A woman was elected to the House before the 19th Amendment was ratified.
  Can this be replicated in game?"
- **Real history (settled in-thread):** vcczar first guessed Montana **didn't** have early
  suffrage (POST 5); Euri corrected him — **MT adopted women's suffrage in 1914, Rankin
  elected 1916** (POST 6). So the Rankin case is specifically a **per-STATE early-suffrage**
  case, NOT a federal-amendment case.

## 2. ★ CURRENT shipped behavior (vcczar, POST 2)

> "Rankine and other women are in the game **but currently that amendment has to be passed**.
> What I might end up doing after early release is **create an event that selects a random
> woman to relive the Rankin experience**."

- **Women ARE in the politician pool** (Rankin + others) in the forum build.
- **A woman cannot run/hold office until the women's-suffrage AMENDMENT passes** — a hard
  federal gate. So the Rankin situation (a woman in office *before* the 19th) **currently
  cannot happen** in the forum build.
- vcczar was **"stumped as to how to handle that"** — the per-state-vs-federal mismatch is
  an acknowledged open design problem.

## 3. ★ The three design options on the table

| # | Option | Proposed by | Status |
|---|---|---|---|
| A | **Post-release "Rankin event"**: a scripted/era event that picks a **random woman** to "relive the Rankin experience" (a one-off scripted exception to the gate) | vcczar (POST 2) | floated, "what I might end up doing" |
| B | **Per-STATE early-suffrage flag**: let women run in **states that have adopted women's suffrage even before the federal Amendment** (e.g. MT 1914) | Euri (POST 3) | vcczar: **"makes sense to me"** (POST 7) — the endorsed general rule |
| C | **Always-run with −5 penalty**: women **always** eligible but take a **severe −5 election penalty** until federal suffrage passes | Euri (POST 4) | alternative to B; not adjudicated |

Note A (event exception) and B (per-state rule) are not mutually exclusive — A is the
pre-release stopgap, B is the durable systemic rule. C is the simpler systemic alternative
to B (one global penalty vs. a per-state flag).

---

## 4. SHIPPED vs DESIGN — code-verified (THE CORE)

The forum build (POST 2) already has women in the pool gated behind the suffrage amendment.
**The shipped React/TS build in `src/` has NEITHER the gate NOR the gender attribute it would
key on.** Verified by full-tree grep for `gender|sex|isFemale|female|woman|women|suffrage|
Rankin` across `src/` (only coincidental hits: `scandal-sexual`, `governorsExist`, `eligIdeos`):

| Area | In the build today (`src/`) | In the documented design (this thread + 1916 digests) | Delta / requirement | Source |
|---|---|---|---|---|
| **Gender / sex attribute** | **ABSENT.** `Politician` (`types.ts:1251-1291`) and `ImportedDraftee` (`types.ts:1780-1793`) have NO `gender`/`sex`/`isFemale` field. The whole eligibility question is unrepresentable in code. | Women are in the pool and distinguishable (Rankin "and other women") | **Add a gender/sex field to `Politician` + `ImportedDraftee`** (and to the dataset pipeline, `scripts/`). Prereq for every option below. | POST 2; `types.ts:1251` |
| **Federal women's-suffrage gate on candidacy** | **ABSENT.** Candidate selection (`phaseRunners.ts` `calcStateVote` @3685, election runners) filters only on pool membership / faction / ideology — never on gender or a suffrage flag. No `GameState` suffrage flag (`types.ts:1558-1646`). | "that amendment has to be passed" before a woman can run/hold office | **Add a federal-suffrage game-state flag + an eligibility predicate** that bars female candidacy until it's set. | POST 2; `types.ts:1558` |
| **The suffrage amendment itself** | The 19th exists in the forum build as a **scripted era-event (A/B/C decision)** AND as a **legislative bill** that passes in human games (House 374-61 / Sen 79-17) — see 1916 digests. In `src/` data: **no suffrage event/bill** (`grep` of `src/data` = no matches), but `EraEvent`/`Legislation` machinery exists to author one. | The amendment passing is what flips the gate | **Author the suffrage amendment as content** AND wire its passage to flip the eligibility flag. | a0b7ef49 L86; 5027f0f3 L80/L125; `src/data` (none) |
| **Per-STATE early-suffrage flag (MT 1914)** [Option B] | **ABSENT.** `State` (`types.ts:1318-1335`) has no suffrage flag. The `Predicate` tree (`types.ts:1487-1504`) has `stateAdmitted` but **no per-state-flag / state-suffrage predicate**. | Women may run in states that adopted suffrage early, before the federal amendment | **Add a per-state `womenSuffrageYear`/flag on `State`** + a state-level branch in the eligibility check (a woman is eligible in state X if X's suffrage year ≤ current year, even pre-federal). | POST 3, 6, 7; `types.ts:1318`, `:1487` |
| **−5 election penalty channel** [Option C] | **PRESENT as a channel.** `calcStateVote` (`phaseRunners.ts:3685`) already sums signed additive biases into the per-candidate `score` (faction bias, trait bands ±2/4/8 via `TRAIT_ELECTION_EFFECTS`). A flat −5 "no federal suffrage yet" modifier on female candidates would slot in here. | Women always run but −5 until federal suffrage | **No new channel needed** — add a conditional −5 term in `calcStateVote` gated on (candidate.gender===female && !federalSuffrage && !stateSuffrage). Cheapest of the three. | POST 4; `phaseRunners.ts:3685` |
| **Random-woman "Rankin event"** [Option A] | **ABSENT, but authorable.** `EraEvent` + `postEffects` (`types.ts:1466-1482`, incl. `addPolitician`) could carry a scripted "grant one random woman an eligibility exception" effect. No such effect type exists today. | Post-release event picks a random woman to "relive the Rankin experience" | **Author a scripted event** + a per-politician eligibility-exception effect (a new `postEffects` kind or a per-politician flag). | POST 2; `types.ts:1466` |

**Bottom line:** the entire mechanic is **0% built in `src/`** — it presupposes a **gender
attribute that does not exist**. Even the simplest option (C, the −5) requires the gender
field first. This is a genuine **demographic-attribute gap**, not just an eligibility-rule gap.

---

## 5. Relation to existing gaps

- **#258 (game-STATE predicate-gating field)** — Options A/B/C are all **eligibility-gating
  on a game-state condition** (federal suffrage flag; per-state suffrage flag; or a penalty
  conditioned on the same). The `Predicate` tree (`types.ts:1487`) is the natural home for
  the suffrage gate, but it has **no per-state-flag predicate** today — the per-state MT-1914
  flag (Option B) is a NEW predicate class #258 would need to add (`stateAdmitted` exists;
  `stateFlag`/`stateSuffrage` does not).
- **DH-14 / #114 (women's-suffrage amendment passage; CPU-AI/era-weighting)** — the 1916
  digests already track the **19th Amendment as a fireable event + bill** that **passes in a
  human-majority game** (5027f0f3 L125; a0b7ef49 L86) and DH-14's "never passes with CPUs"
  framing. **This thread is the DESIGN-INTENT source for what the amendment's passage should
  GATE** — i.e. *why* the amendment matters mechanically (it unlocks female candidacy), which
  DH-14 records the existence of but not the consequence of.
- **Candidate-eligibility gating (general)** — the eligibility check `calcStateVote` /
  election runners perform is today purely faction/ideology/pool-based; this is the first
  digest to call for a **demographic** eligibility predicate. Adjacent to (but distinct from)
  the constitutional `presidentialEligibility: 'natural_born' | 'any_citizen'` field
  (`types.ts:1395`), which is a separate citizenship gate, not a suffrage/gender gate.
- **Election-penalty channel** — Option C reuses the same additive-bias path as the PR4a
  trait election bands (`TRAIT_ELECTION_EFFECTS`, `types.ts:738`); no new machinery, just a
  new conditional term.

---

## 6. Open questions for the human

- **Which option ships (A / B / C, or A-then-B)?** vcczar endorsed **B** (per-state flag,
  POST 7) as the rule and **A** (random event) as the pre-release stopgap; **C** (global −5)
  is the cheapest but least historically faithful. They are layerable.
- **Source for per-state suffrage years (Option B):** real states adopted women's suffrage on
  a long staggered timeline (WY territory 1869; many Western states 1910s; MT 1914). Need an
  authored per-state `womenSuffrageYear` table — and a decision on whether to model
  *territorial* vs *state* suffrage and partial (presidential/municipal-only) suffrage.
- **Scope of the gender attribute:** does it affect only candidacy, or also flavor/events
  elsewhere? Minimal viable = a single `Politician.gender` field consumed by the eligibility
  check; the dataset pipeline (`scripts/`) must then emit it.
- **Eras affected:** AMPU's two SHIPPED scenarios (1772, 1856) both end well before 1914/1920,
  so this gate is **inert in the current builds** — it's a requirement for the **documented-
  but-unbuilt Progressive-era (1916) scenario** the forum plays. Confirm whether it's worth
  building before that era ships.

## Source

`92202e9a` "Is there a way to have a Jeannette Rankin situation?" — 7 posts / 1 chunk,
politicslounge topic 5183, Feb 17 2024. A women's-suffrage / female-candidate-eligibility
design exchange grounded in the real Jeannette Rankin (House 1916 via MT state suffrage 1914,
pre-19th-Amendment). Cross-refs the 1916-era playthrough digests (5027f0f3, a0b7ef49) for the
suffrage event/bill as-built.
