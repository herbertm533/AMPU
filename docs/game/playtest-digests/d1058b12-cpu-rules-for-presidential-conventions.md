# d1058b12 — "Discussion: CPU Rules for Presidential Conventions"

**Scope:** 11 posts / 1 chunk (`chunk-001`). politicslounge topic 6738, **Jan
2026**. **DIGEST-ONLY** — does not touch `game-context.md`. This is a
**canonical CPU rules-doc**: the full deterministic-CPU spec for the
**Presidential Nominating Convention** (vcczar's favorite phase; the 2.9.1
Primaries → 2.9.2 Conventions flow). It is a **major #20 (deterministic CPU)
spec** and the CPU-decision layer of **#185** (primary→brokered-convention
state-machine). Author/owner **@Arkansas Progressive** (AP); discussant
**@OrangeP47**; cc **@matthewyoung123 @ebrk85 @MrPotatoTed**. POST 1 is the
rewrite; POSTS 3-11 are the design debate.

> ⚠️ **Different convention.** This is the PRESIDENTIAL nominating convention,
> NOT the Constitutional Convention. The shipped `pendingConvention` /
> `makeConvention` / `constitutionalConvention.ts` is the founding-era
> *Constitutional* Convention — a wholly separate system. Do not conflate.

> **Provenance note (POST 1 framing + POST 4):** this is a **rewrite of an
> existing rules doc**, not a new design. AP lists the deltas vs the prior doc:
> (1) added 2nd/3rd/4th-place major-candidate rules, (2) added minor-candidate
> rules, (3) replaced the old promise roll (6× d100) with **a single d6**, (4)
> added VP positive-trait preference + negative-trait avoidance. Everything else
> is the previously-agreed compromise.

---

## 1. The CPU convention algorithm (transcribed — this is the point)

### 1.1 Candidate selection (POST 1)
- **Who the CPU faction runs:** faction **leader 75%** / **a celebrity with ≥1
  command 10%** / **no major candidate 15%**.
- **If no major candidate:** run **a minor candidate 50%** — but **75%** if the
  election has **no incumbent from their party**. **At least one faction per
  party MUST run a candidate** (floor, never an empty party field).
- **Nominators (for the major candidate's nom speech):** pick an **orator 60%**
  / **someone else 40%**. **Never anyone with Incoherent.** **No one who is
  running** can give the major candidate's nomination speech.

### 1.2 Balloting & inter-ballot actions (POST 1)
- **Threshold manipulation (rules change):** if the CPU's faction is **1st in
  delegates** → try to **LOWER** the nomination threshold **25%** (if possible);
  if **last in delegates** → try to **RAISE** it **25%** (if possible).
- **Offer targeting (universal):** all offers go **same-ideology first → closest
  ideology → random**.
- **Promise-eligibility fallback:** if an offered candidate is ineligible for a
  promise, it passes to **the faction** that was offered it. **Puritans never
  accept or make a presidential promise for a drop-out.**

#### ★ 1.2a Presidential-promise system — CPU major is **1st in delegates**
- **25%** of the time, offer **a non-faction candidate with <half the CPU's
  delegates** a **drop-out-for-endorsement promise**. (Split: **50%** offer it
  to the candidate / **50%** to the faction.)
- **The reward is rolled on a d6** (this d6 *replaces* the old 6× d100):

  | d6 | Reward | CPU ACCEPT odds |
  |----|--------|-----------------|
  | 1 | **Vice President** | 50% |
  | 2 | **Senior cabinet** — SecState 40% / SecTreasury 20% / SecWar(Defense) 20% / AG 20% | SecState 40%; Treasury/War/AG **33%** each |
  | 3 | **Minor cabinet** (random non-senior cabinet seat) | junior cabinet **25%** |
  | 4 | **Cabinet-level (non-secretary) OR ambassador** (random) | ambassador **20%** (non-sec cabinet ≈ junior 25%) |
  | 5 | **Supreme Court appointment** | 20% |
  | 6 | **Party-plank choice** | 20% |

  (Accept-odds list verbatim POST 1: VP 50% / SecState 40% / Treasury·War·AG 33%
  / junior cab 25% / ambassador 20% / SCOTUS 20% / platform plank 20%.)

#### 1.2b CPU major is **2nd / 3rd / 4th place**
- **33%**: drop out and **endorse the candidate with the most momentum** (tie →
  matching-ideology, randomize if >1 → random).
- **25%**: run the **presidential-promise logic** (§1.2a) as the offerer.

#### 1.2c CPU major is **LAST place**
- **50%**: make an offer to a candidate with **>half the CPU's delegates** —
  offering to be **VP 50%** / a **faction-eligible cabinet seat 50%** (per the
  §1.2a set-logic).
- **25%**: **drop out with NO presidential promise.** If last for the **3rd
  consecutive ballot**, this rises to **50%**.

#### 1.2d Minor-candidate drop logic (by faction place)
- **Faction 1st w/ a minor candidate:** if the major candidate **leads in
  momentum → drop out**; otherwise stay in for the next ballot.
- **Faction 2nd/3rd/4th w/ a minor candidate:** if the major leads momentum →
  drop out; **25%** drop & endorse the momentum leader matching the faction
  leader's ideology (→ random matching major → random).
- **Faction LAST w/ a minor candidate:** **50%** drop with **no** endorsement /
  **50%** drop & endorse the momentum leader (tie → faction-leader ideology →
  random).

#### 1.2e Standing CPU behaviors (POST 1)
- CPU candidates **always** attempt to: make appeals, influence the smoke-filled
  room, whip the party into compliance, or use kingmaker interference.
- **Ballot-shift calls:** a **1st-place** faction calls for a ballot shift if the
  leading major has **>50% of delegates**; the **last-place** faction calls one
  if the **2nd-place candidate has <half the front-runner's delegates**.

### 1.3 Compromise candidate & Dark Horse (POST 1)
- **Compromise trigger:** faction leaders call for a **compromise candidate** if
  **no one wins after 10 ballots**, at **25%**.
- **Compromise pick:** a candidate of **same or adjacent ideology** to the
  faction leader, **from an allied faction**: **50% current office-holder / 40%
  former office-holder / 10% anyone else.** Else support a compromise candidate
  of their ideology or bordering it (random on tie). If none border their
  ideology and they have no compromise candidate → call for a **Dark Horse ASAP**;
  if they can't → randomly support a compromise candidate.
- **Dark Horse trigger:** after **5 ballots of compromise candidates**, faction
  leaders call for a **Dark Horse at 25%**. **At 25 ballots the Dark Horse rule
  fires AUTOMATICALLY.**
- **Dark Horse pick:** the **party leader** selects an **of-age politician with
  ≥1 command from the faction with the LOWEST score**. **All CPUs support the
  Dark Horse.**

### 1.4 VP selection (POST 1)
- **Keep the incumbent VP 90%** (or vote for the VP if the convention chose the
  nominee). **Voided if** the VP has **Incompetent or Controversial**, or the
  player **declines** the offer.
- **Otherwise, source the VP:** **50%** eligible pol from the **lowest-scoring
  faction + a different region** / **25%** any faction with an eligible
  **office-holding** pol + different region / **25%** any faction with an
  eligible pol (any office).
- **Then trait preference:** **33%** of the time pick a VP with any of
  **harmonious / likable / provincial / cosmopolitan**; on tie or none-qualify,
  randomly choose a VP who is **not unlikable or disharmonious**.
- **Hard constraints:** **no VP from the same state as the nominee**; the CPU
  **always keeps a presidential promise** (a promised VP overrides the above).
- **Voting on a VP at the convention:** support **own faction** over others; if
  both options are the CPU's faction, pick the one with the **most of
  harmonious/likable/cosmopolitan/provincial** (tie/none → random).

### 1.5 Party platform & keynote (POST 1)
- **Platform stance (unless restricted by e.g. Puritan):** **50%** pick a stance
  favoring **own cards specifically** / **25%** favoring the **lowest-score
  same-party faction** / **25%** favoring the **lowest-enthusiasm same-party
  faction**. **Presidential promises are kept first** (plank promises override).
- **Micromanager nominee:** blocks & replaces an **ally's** plank **only 25%**,
  randomly replacing it with one that helps **the nominee's faction 50%** / **the
  party as a whole 50%**.
- **Keynote speaker:** from the **lowest-score same-party faction 50%** / next
  lowest **25%** / next lowest **25%**. From that faction, a **random
  office-holder with ≥1 command 75%** / random non-office-holder with ≥1 command
  **25%**. **Prioritize orators — pick an available one 75%.**

---

## 2. Design-intent debate (capture verbatim — feeds the design-rule log)

- **OrangeP47's motivation (POST 6):** "candidates for CPUs really don't do
  anything if they're not first and second or last," and the CPU "should
  prioritize picking VPs with good traits at least some of the time." This is why
  the rewrite adds 2nd/3rd/4th + minor-candidate rules and VP trait prefs.
- **★ The multi-ballot slow-roll is an INTENTIONAL prior compromise (AP, POSTS
  7, 10).** AP: "I'm pretty sure we had a big debate and it was **intentional to
  slow-roll the conventions to maintain the multi-ballot effect.** I don't want
  to re-litigate it." And POST 10: this was "**probably the single biggest
  argument (in terms of game mechanics) we've had on the forum** — I'm wary of
  touching the compromise we came up with beyond just tweaking the grammar/typos
  level of changes." OrangeP47 concedes (POST 8: "I actually did forget about the
  initial litigation").
- **Net status of this rewrite (POSTS 5-11):** OrangeP47 first calls it "too
  drastic" (POST 5); both converge that the **slow-roll / multi-ballot mechanic
  is settled and NOT being re-litigated** — the rewrite is being **demoted to
  wording / order-of-operations / typo clarity only**, applied via suggestion
  mode in the Google Doc (POST 11). So: **the algorithm above is the
  authoritative CPU-convention spec; the only *new mechanics* vs the prior
  compromise are the 2nd/3rd/4th + minor rules, the d6 promise roll, and the VP
  trait prefs (POST 4)** — and even those are framed as clarifications, not a
  re-design.

**DESIGN RULE (durable):** *Presidential conventions are deliberately
slow-rolled across many ballots to preserve the multi-ballot / brokered-
convention drama; CPUs are intentionally limited (no full optimization) for the
same reason. This is a settled, hard-won compromise — do not "improve" CPU
convention aggression without a designer mandate.*

---

## 3. Build vs. design — code-verified

**The presidential nominating-convention SYSTEM is ~0% shipped, and its CPU
logic is 0% shipped.** What exists today (`src/`):

- **2.9.1 Primaries — a single-winner stub, not a primary.**
  `runPhase_2_9_1_Primaries` (`phaseRunners.ts:3725-3750`) filters each party to
  `age 35-80 && command >= 2`, sorts once on `pvCache + command*5 + traitBonus`,
  and **picks the top one**. There are **no factions running candidates, no
  delegates, no nominators, no minor candidates, no celebrity path.** (Note the
  gate is `command >= 2`; the spec's celebrity path needs only `≥1` command —
  minor mismatch, but moot since the whole flow is unbuilt.)
- **2.9.2 Conventions — a one-line log stub.** `engine.ts:69`:
  `case '2.9.2': addLog(... 'Party conventions ratify the primary winners.'); return {};`
  **Zero** balloting, threshold manipulation, momentum, promises, compromise
  candidate, Dark Horse, platform, or keynote. The phase exists in
  `PHASE_SEQUENCE` (`phases.ts:40`) purely as a label.
- **No presidential-convention data model.** `grep` of `src/types.ts` for
  `delegate / ballot / momentum / darkHorse / presidentialPromise / threshold /
  keynote / platform / runningMate` → **nothing** (the only `delegate*` fields
  are the **Continental Congress** delegates, `types.ts:1348-1356`; the only
  `Convention` type is `ConstitutionalConvention`).
- **No VP / running-mate selection in the election flow.** `vicePresidentId`
  (`types.ts:1568`) is only **read** for display (`CabinetPage.tsx:20`,
  `Dashboard.tsx:14`), seeded once in 1856 (`scenario1856.ts:156`), and **only
  ever cleared**, never set, by the engine (`phaseRunners.ts:2450` on
  VP-vacate). `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752-3814`)
  runs a head-to-head EV race with **no running mate** and even **resets the
  cabinet to null** post-election. → §1.4 VP selection is wholly unbuilt.
- **No platform / plank / keynote engine.** No `platform`/`plank`/`keynote` in
  `src/engine` → §1.5 is wholly unbuilt (consistent with the separately-tracked
  #181/#10 platform epic).
- **`pendingConvention` is the Constitutional Convention** (`engine.ts:18`,
  `phaseRunners.ts:3183-3184`, `constitutionalConvention.ts`) — a different
  system; **not** evidence of a presidential convention.

**Conclusion:** this doc is the **complete CPU spec for an unbuilt system**. It
slots under the existing **#185** convention-state-machine gap (the
*system*) and **#20** deterministic-CPU gap (the *CPU logic*); the platform/
keynote portion overlaps **#181/#10**. None of its specific CPU rules (d6 promise
table, place-based drop-out, 10/25-ballot compromise/Dark-Horse, CPU VP-pick,
platform/keynote selection) are anywhere in the code.

---

## 4. Deltas for consolidation

*(consolidation agent owns the gap-log write — NEW vs corroborates-#)*

**Attaches to EXISTING gaps:**
- **#185 (primary→brokered-convention state-machine)** — the *system* this doc
  governs; still **specced-but-unbuilt** (2.9.2 is a log stub; no delegates/
  ballots/threshold/momentum). This doc is the canonical CPU-decision layer for it.
- **#20 (deterministic CPU engine)** — the headline. This is a full CPU-decision
  spec (gates-over-RNG, the established #20 pattern) for the convention; **0%
  shipped** for this phase.
- **#74 (CPU vote / down-ballot CPU decisions)** — the convention-floor voting
  rules (VP-vote support-own-faction, ballot-shift calls, Dark-Horse support)
  are CPU-vote logic; unbuilt.
- **#181 / #10 (convention/platform epic)** — §1.5 platform-stance + Micromanager
  plank-block + keynote selection are the CPU layer of the unbuilt platform
  engine; corroborates the platform-scorer is wholly absent (`grep platform =
  0`).
- **#183 (endorsement-momentum)** — the drop-out-and-endorse-momentum-leader
  rules (§1.2b/1.2c/1.2d) are CPU-side endorsement-momentum logic; still
  specced-but-unbuilt.
- **Seeded-RNG / determinism debt (the rng.ts requirement)** — every % here
  (75/10/15, the d6, accept-odds, 25%/33%/50%, 10/25-ballot triggers) must run
  through `src/rng.ts`, not `Math.random`, to stay deterministic. Standard
  constraint on building any of this.

**Genuinely NEW (first/authoritative articulation here):**
- **NEW — the d6 presidential-promise reward table + per-reward ACCEPT odds**
  (§1.2a): d6 → VP / senior-cabinet (State 40/Treas 20/War 20/AG 20) / minor
  cabinet / cabinet-level-or-ambassador / SCOTUS / party-plank, with accept odds
  VP 50 / SecState 40 / Treas·War·AG 33 / junior 25 / amb 20 / SCOTUS 20 / plank
  20. Explicitly **replaces the prior 6× d100** (POST 4). Unbuilt.
- **NEW — place-based candidate behavior (1st / 2nd-3rd-4th / last)** for both
  **major** and **minor** candidates (§1.2a-d), incl. the 3-consecutive-ballot-
  last escalation (25%→50%). The prior compromise only handled 1st/2nd/last;
  these fill the idle-middle-candidate gap OrangeP47 raised (POST 6). Unbuilt.
- **NEW — compromise/Dark-Horse thresholds** (§1.3): compromise call at **10
  ballots @25%**; Dark Horse after **5 compromise ballots @25%**; **automatic
  Dark Horse at 25 ballots** (party leader picks of-age ≥1-command pol from the
  lowest-score faction; all CPUs support). Unbuilt.
- **NEW — CPU VP-selection algorithm** (§1.4): keep-incumbent 90% (Incompetent/
  Controversial/declined voids) → 50/25/25 sourcing by faction-score+region →
  33% good-trait preference + avoid unlikable/disharmonious → never-same-state →
  always-keep-promise. Unbuilt (no VP is ever set by the engine today).
- **NEW — threshold-manipulation + ballot-shift CPU rules** (§1.2/1.2e): 1st-
  place lowers / last-place raises the nomination threshold @25%; ballot-shift
  call triggers (>50% front-runner; 2nd <half front-runner). Unbuilt.
- **NEW — CPU platform-stance + Micromanager plank-block + keynote-speaker
  selection** (§1.5): 50/25/25 stance (own-cards / lowest-score faction / lowest-
  enthusiasm faction); Micromanager blocks ally plank @25%; keynote from lowest-
  score factions (50/25/25), office-holder ≥1 command 75%, orators-first 75%.
  Unbuilt.
- **NEW (design rule) — intentional multi-ballot slow-roll; CPUs deliberately
  limited** (§2): the multi-ballot brokered-convention feel is a settled,
  hard-won compromise ("single biggest game-mechanics argument"); CPU convention
  passivity in the middle is *by design*, not a bug. **Do not re-litigate.**
  This is a binding constraint on any future convention build.

## 5. Open questions (for the human / consolidation)
- **The d6 promise table maps to systems that don't exist yet** (party planks,
  ambassador appointments, the "smoke-filled room", kingmaker interference,
  whip-the-party, appeals). Are those tracked elsewhere, or do they need rows of
  their own before §1.2a is buildable?
- **Celebrity-path command floor:** spec says celebrity needs **≥1 command** to
  run; the shipped primary gate is **`command >= 2`** (`phaseRunners.ts:3729`).
  When #185 is built, which floor governs the *convention* candidate set?
- **"Faction score" and "faction enthusiasm"** drive Dark-Horse, VP-sourcing,
  platform, and keynote picks. Confirm these map to existing faction
  `enthusiasm`/score fields or need definition before the CPU logic is buildable.
- This is a **Google-Doc rewrite in suggestion mode** (POST 11) — treat POST 1 as
  the authoritative text, but the doc may receive further wording edits the
  forum thread won't capture.
