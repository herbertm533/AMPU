# Digest — fc461242 "Dynamic State Leans Brainstorm"

**Scope:** DESIGN/brainstorm thread (politicslounge, 16–19 Mar 2023), 34 posts / 1
chunk (`chunk-001.md`, 29 KB). Topic: how a state's **party-preference modifier
("state lean" / "base bias")** should change across eras — and the core insight
that today it is keyed to a **hardcoded YEAR / historical-era tab**, not to the
**game-state EVENT** that historically caused the shift. **Same class of finding
as gap-log #92** (eras = content bands gated by game-state, not the calendar), but
applied to the **state party-lean / realignment** axis rather than bill/event/draft
bands. Forum implementation here is the **Excel census doc** (the spreadsheet game),
not the browser build. **DIGEST ONLY** — no living-doc edits.

Participants: @Umbrella (raised the bug, narrative GM), @OrangeP47 ("the census
expert" — owns the census doc), @Willthescout7, @MrPotatoTed, @10centjimmy, @pman,
+ refs to @Ich_bin_Tyler (1840 events). Cites `POST n` = `===== POST n =====`.

---

## ★ The core finding — event-driven, not year-driven, state leans

**The bug (POST 2, Umbrella — the canonical exhibit):** In the **1928 playtest** the
**market crash did NOT fire in-game** (it's a scripted/anytime event on a chance
roll, not automatic — see POST 12: "Right now it's a 50% chance"). So going into the
**1930 midterms** the economy/quality meters were *good*. **But** the "historical era
tab → **party modifiers** section" still moved most states **heavily blue / less red**
— i.e. as if the Depression had happened — because those modifiers are pinned to the
**year/era, not to the event.** Result: **Democrats swept the 1930 midterms** and the
incumbent Republicans got "buried" despite a good economy → **unrealistic, ahistorical-
for-*this*-timeline outcome.** (POST 10: "we went from almost a red supermajority to
blue taking control of congress.")

**The proposed fix (POST 2, broadly endorsed POST 3/5):** **tie the party-modifier
shift to the Depression scripted EVENT, not to the year 1928.** Generalized (POST 3,
Willthescout7): tie each era's demographic/bias shift to a **specific scripted event**
in that era (one scripted to fire early), instead of applying it the instant the era
flips on the calendar.

**Why this is #92's twin:** #92 says eras are content bands entered by game-state +
territory triggers, not `year %`. This thread is the **state-lean / party-realignment
projection of the same principle**: the *base bias table* should move when the
**causal game event occurs**, not when the wall-clock reaches the historical date. The
nuance the thread surfaces (POST 5, 15): **some** shifts ARE genuinely gradual /
non-event (POST 5: "gradual shifts over time, not necessarily tied to a specific
event") → for those, a **year/decade trigger still makes sense**. So the design space
is **per-shift: event-keyed vs. gradual-decade-keyed**, decided case by case.

**Important separation of concerns (POST 7/8/15, distinguishing two systems):**
- **Meters** already drive national, dynamic incumbent punishment/ideology swings
  (POST 9, 15: there is "already a 'Great depression' square on the meters" + nation-
  wide incumbent/ideology shifts). The 1930 blue dominance was **partly** meters
  (POST 7: "Blue Liberals are getting a huge bonus due to the state of the meters") +
  the **midterm −1 to all reds** (POST 7). These are NOT the bug.
- **State base lean / bias** is the **separate** layer at issue (POST 15, the cleanest
  statement): *"The meters can be whatever, but it's the **base lean** that needs a
  reason."* Without the Depression event there is "**nothing to justify the state leans
  moving to their decade set points**." The fix must NOT double-count by also keying off
  meters (POST 6: triggers "should be things that are NOT the meters … that would be
  stacking those effects").

## The open historical question the thread raises (unresolved)

POST 2/9 (Umbrella): **what actually causes the cross-era party-preference shifts?**
Concrete example given: **Era of Republicanism → Era of Democracy** shows "a hard shift
in many states **from blue to red**" — and Umbrella explicitly does not know *why*:
gradual drift away from the Democrats? the **emergence of the Whig party**? The thread
**never resolves this** — it's punted to members "with better historical knowledge."
The methodology agreed instead: **play it out in the 1840 playtest** and decide
per-event whether each shift is event-worthy (POST 11/24/28). **This is the canonical
list of "which realignments map to which causal events" that the build will eventually
need** and is currently undecided. Note (POST 4, OrangeP47): the **"era" modifiers are
"WAY out of date" — modifiers now change every DECADE regardless of era** (i.e. the
census doc already moved off era-keyed to decade-keyed bias sets; this thread is about
adding an **event-keyed layer on top**).

## Design options floated (no decision — "play it out in 1840")

1. **Multiple bias SETS per decade** (POST 6, OrangeP47): build 3 or 5 (odd; 7 is
   excessive) *sets* of state leans per decade; an event field reads "Switch to State
   Bias Set N Until Overwritten by Another Event" (e.g. crash event → most-blue set
   for the 20s/30s). Lets parties be boosted **and** weakened, not just slammed
   red/blue (POST 8). **Self-rejected** (POST 25): sets are "still completely arbitrary"
   and switching between them is "too complicated to model unless we want to completely
   rewrite the game" — easy from a programming view, hard from a historical-justification
   view.
2. **Industry-keyed event modifier** (POST 11/16/19/20, OrangeP47 — his preferred,
   "more elegant"): keep ONE set of base leans; an event applies a **time-boxed
   modifier** (e.g. "+1 blue for 10 years to all **agriculture-leading** states at the
   moment the event fires"). Leverages the **"underutilized Industry system"** (states
   already carry an `industries` map). The **bias shift comes from the event**; the
   **industry only selects which states** are affected at that moment (POST 19). These
   are **modifiers ON TOP of the existing decade core, not a replacement** (POST 20).
   Precedent cited: election losers already carry a temporary −1 for 6 years. Open
   sub-question (POST 16): **which industries shift a state right vs. left** is
   undetermined.
3. **Force the Depression event to auto-fire in the 1928–30 term** (POST 12,
   10centjimmy) — **rejected** (POST 13) as railroading history; also misses the point
   (POST 14: in the 1840 playtest the Depression "isn't for 60 years" — don't treat
   this as a Depression-specific fix).
4. **Remove historical bias entirely; start from start-date-accurate bias and let
   meters + Gov actions + industry/census carry it** (POST 17/18, MrPotatoTed). Counter
   (POST 18, 26): doing this **breaks how politicians enter the game** — standard
   politician party assignments assume the historical lean; a "red California / red
   Rhode Island / blue Idaho/Wyoming" in the modern day would mismatch hard-coded
   politician parties. (POST 26/27 tangent: Ted once wanted **no hard-coded parties at
   all** — emergent faction alliances — "but V hated that idea.")

## Additional landmark-event exhibits (corroborating the event-override thesis)

- **POST 30 (pman, 1948 playtest):** counterfactual **Taft (Red Pres) ends Jim Crow by
  executive action in 1953**, a decade before the real 1964 CRA. Argues a handful of
  events should **supersede era/state biases both macro and micro**: macro — if the GOP
  ended Jim Crow in '53, **the South does NOT flip red in '64/'72** and shows a stronger,
  more prolonged anti-Red Southern reaction; diverse states (NY, IL) lean MORE red and
  don't flip blue. Micro — **incoming pols / party switches** change: **MLK** (a
  Republican in '53, party-switches to D in '60 irl) would **stay Republican** after the
  GOP ended Jim Crow. → **realignment + politician party assignment must be reactive to
  counterfactual game events, not pinned to real-history dates.**
- **POST 31 (pman):** the design risk if NOT addressed — "everything tied to the era …
  negates many of the cool **counter-factual** historical aspects" (explicit contrast:
  *The New Campaign Trail* feels rigid because biases are era-locked). This is the
  product rationale for the whole #92/this-thread class of work.
- **POST 32/33 (pman + confirm):** **Reconstruction ALREADY differentiates bias for
  "Reconstruction going strong" vs. "Hayes ended it"** — i.e. **at least one
  event-driven (sub-era) bias shift already exists and "has generally worked well"** in
  the census doc. Precedent/proof-of-concept for the proposal.
- **POST 34 (closing concern):** because biases are "hard coded to real history," if
  the Depression fired with a **Democrat** as President, **state biases still swing blue
  and the D party still reaps the era's election bonuses** — i.e. the swing rewards the
  party **history** says it should, ignoring **who actually held office** in the
  playtest. Proposed north star: **keep *people* in character** (strong penalties for a
  human acting against a pol's ideology, e.g. Southern Dems shouldn't try to end slavery
  to swing biases) **while making *states / election variables* fluid** based on how the
  game actually plays out (wars, economic events, etc.). This is the **same
  human-fidelity tension as the "★ subsume the human GM" charter** — automate the
  bias/realignment response to events without letting it license out-of-character pol
  behavior.

---

## Shipped-vs-designed (spot-read of the browser build — flag for tech-lead)

The forum here describes the **Excel census doc** ("historical era tab," "party
modifiers section," decade bias "set points"). The **browser build does NOT implement
any of that machinery.** What ships today:

- **State bias is a single static scalar.** `src/data/states1856.ts` — every state has
  one `bias: number` (header comment: *"Bias is roughly historical: positive = Red lean,
  negative = Blue lean"*), hand-set per state (e.g. SC −2.4, VT 1.6). **No decade bias
  sets, no era party-modifier table, no per-year/per-era bias schedule** exists in the
  shipped data. So the **exact 1928 bug as described cannot occur in the build** (there
  is no year-keyed modifier table to mis-fire) — **but the converse gap is worse: there
  is essentially NO cross-era realignment of state lean at all in the shipped build.**
- **Two small *in-game-dynamic* bias nudges DO exist (and they ARE event/state-driven,
  which is on-thesis):**
  - `runPhase_2_5_2_Governors` (`phaseRunners.ts:3389`): each term, ~30% chance a
    governor nudges their state's `bias` by `(governing−1)*0.05` toward their party
    (clamped ±5). A gameplay-driven, not calendar-driven, drift.
  - Anytime-event `stateBias` effect (`phaseRunners.ts:2608-2614`): an event can shift
    `bias` by `eff.amount` for states in named `regions` — **clamped to ±1.** This is
    the **closest existing primitive to OrangeP47's "event applies a regional/industry
    modifier" idea (POST 11/19)** — but it is **region-keyed, not industry-keyed**, and
    appears **permanent/un-time-boxed** (no 10-year expiry), and the ±1 clamp makes it a
    nudge, not a realignment.
  - `bias` also feeds **politician ideology drift** (`phaseRunners.ts:903-906`,
    `stateBias` kind) and a **±3 on-ballot election bias** (`:1558`, `baseLean` at
    `:3697` = `partyId==='BLUE' ? -state.bias : state.bias`). So `bias` is genuinely the
    **state-lean lever** the thread is discussing — changing how it evolves directly
    moves elections.
- **No event→bias-SET switching, no industry-keyed realignment, no decade census-set
  rotation, no Reconstruction-style sub-era bias differentiation** in the shipped
  engine. The forum's whole "set points / era tab / census doc" layer is **unbuilt** in
  the browser game.
- **Politician-party coupling (POST 18/26/30):** the shipped draft pipeline assigns
  party to imported/standard pols; the thread's warning that **mutating long-run state
  leans would desync hard-coded politician parties** is a **real cross-system
  constraint** for whoever builds dynamic leans here. Flag for tech-lead.

**Net for tech-lead:** the build is *behind* the spreadsheet on this axis. It has the
right **scalar lever (`state.bias`)** and a **primitive regional event-effect** + two
small gameplay drifts, but **no era/decade realignment schedule and no event-keyed
realignment layer.** When this is built, **build it event-keyed from the start** (per
#92) — do NOT replicate the spreadsheet's year/era-tab pinning that caused the 1928
bug.

---

## Candidate gaps for consolidation (consolidation agent owns the gap-log write)

- **NEW — Event-driven state party-lean realignment.** Cross-era shifts of a state's
  base lean (`state.bias`) must be triggered by the **causal game-state EVENT** (e.g.
  the Depression scripted event), **not** by a hardcoded year / historical-era tab.
  Exhibit: 1928 playtest — crash never fired in-game, yet year-keyed party modifiers
  went blue → Democrats unrealistically swept the 1930 midterms (POST 2/10/15). Design
  unresolved between **bias-SETS-per-decade** (POST 6, self-rejected POST 25) and
  **industry-keyed time-boxed event modifier** (POST 11/16/19/20, preferred), both as
  **modifiers on top of a decade/start-date base** (POST 20); some shifts stay
  **gradual/decade-keyed** by design (POST 5/15). Must be **kept distinct from meters**
  to avoid double-counting (POST 6/7/15). Shipped build has NO realignment schedule —
  only a static `bias` + a ±1 region event-effect + governor/ideology drifts; **build it
  event-keyed.** (Source: this digest, POST 2/5/6/7/11/15/16/19/20/25.)
- **NEW (sub-finding) — Landmark events override era biases AND politician party
  assignment.** Counterfactual milestones (Taft ending Jim Crow 1953; CRA) must
  retroactively re-key both **regional realignment** (South doesn't flip; diverse states
  lean Red) **and** which party **incoming pols / party-switchers** (e.g. MLK) join —
  i.e. the **draft/party-assignment pipeline must be reactive to game events, not pinned
  to real-history dates.** (Source: POST 18/26/30.) Couples to the
  static-historical-party-assignment constraint (POST 18 warning).
- **NEW (precedent / proof-of-concept) — Sub-era bias differentiation already validated
  for Reconstruction.** Census doc already differentiates bias "Reconstruction strong"
  vs. "Hayes ended it" and it "has generally worked well" (POST 32/33). Concrete model
  for the event-keyed approach; **not in the shipped build.**
- **CORROBORATES #92** (eras = game-state-gated content bands, NOT calendar year) — this
  is the **state-lean / party-realignment projection** of the same principle; the 1928
  exhibit is a clean new instance of calendar-pinning producing ahistorical-for-this-
  timeline results. Also reinforces #92's nuance that some bands/shifts are genuinely
  gradual (POST 5/15) and that the era tab is already "WAY out of date" vs. the
  decade-keyed census (POST 4).
- **CORROBORATES #241** (variable cadence / replacing fixed year-predicate triggers) —
  same "stop keying behavior off the wall clock; key it off game-state" thesis, here for
  bias/realignment cadence.
- **CORROBORATES #205** (Vic3 AMPU-2 per-state meters / dynamic IG→party realignment,
  PARKING-LOT) — OrangeP47's **industry-keyed dynamic state lean** (POST 11/16/19) is the
  same family as the Vic3 "B1 dynamic IG→party realignment / B4 per-state meters" parked
  ideas; this thread is the **near-term, scoped, playtest-driven** version (deliberately
  "not *fully* dynamic," POST 6) rather than the AMPU-2 parking-lot scope.

## Open questions (for the human / consolidation)

- **Which historical realignments are event-keyed vs. gradual-decade-keyed?** The
  thread's central unanswered question (POST 2: Republicanism→Democracy blue→red — Whigs?
  gradual drift?). Needs a per-shift mapping the build can encode. Methodology chosen was
  "play it out in 1840 and flag events live" (POST 24/28) — **no canonical table
  produced in this thread.**
- **Which industries shift a state Red vs. Blue?** (POST 16, undetermined.)
- **Did the 1840-playtest "play it out" experiment yield a verdict** (sets vs.
  industry-modifier)? Not in this thread — look for a follow-up thread/digest.
- **Did the browser build's regional `stateBias` anytime-effect (±1) intentionally
  *replace* the spreadsheet's era/decade bias schedule, or is the schedule simply
  unbuilt?** (Tech-lead to confirm scope intent.)
