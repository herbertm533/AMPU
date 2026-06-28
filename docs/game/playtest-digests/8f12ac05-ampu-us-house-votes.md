# Digest — `8f12ac05-ampu-us-house-votes` ("AMPU: US House Votes")

**Type:** DESIGN-DECISION thread (NOT a played-forward game) — vcczar (tier-1) proposes a
**major, AGREED change to House voting** and polls for "quick responses." 22 posts, 1 chunk
(chunk-001.md, all 22 covered). **May 17, 2022.** Authorities present: vcczar (proposer),
MrPotatoTed/"Ted" (tier-1, AGREES), Cal (originated the correction, cited not posting here),
plus players Rezi, ShortKing, matthewyoung123, 10centjimmy, Willthescout7, ConservativeElector2,
jvikings1, and others — **broad agreement, no dissent** (only matthewyoung123 raises balance
caveats while still approving).

**Chronology / where this sits:** this is the **DESIGN-ORIGIN of the weighted-House-vote rule
(#219)** — it PREDATES `housepoll` (aed35c6e, Aug 2022, which RESOLVED + built #219) and sits
just after the sibling `electiondisc` (5a5d988f, Apr 2022, the seat-competition fork #250 /
"Kevin McCarthy problem" #191 origin). The 1960 playtest is the live reference ("I thought
this was the rule we were operating under for the 1960 playtest," POST 3/8). **Net:** sharpens
**#219 / #55 / #34 / #191 / #255 / #250** — no new gap; this is the corroborating design seed.

---

## ★ The change: WEIGHTED House votes (the headline ruling — #219 DESIGN-ORIGIN)

vcczar, POST 1 (Ted AGREES POST 7; "+1"/"like it" across POSTs 2, 5, 11, 15, 17, 22):
- **The named-Rep model STAYS:** each state still has **3 / 2 / 1 influential, elected US
  Reps** (the focus-Rep abstraction #55). This is NOT changed.
- **What changes — voting power:** instead of **1 vote each**, each named Rep's voting power
  = **the state's real delegation size split among its named reps.** Worked example (POST 1):
  CA has 53 real US Reps, 3 named → 53/3 = 17.7 → **18 / 18 / 18 = 54**, one too many, so the
  rep with the **LOWEST legislative ability loses a vote** (randomized on ties) → **18 / 18 /
  17.** This is a **REVERT to an old rule** vcczar had previously removed.
  - ⚠ **REMAINDER-DIRECTION DISCREPANCY (flag for consolidation):** this thread expresses the
    remainder as **DROP a vote from the LOWEST-legislative rep** (round up then subtract). #219
    / `housepoll` (POST 19/20) express the canonical rule as **ADD the remainder to the
    HIGHEST-legislative rep** (floor then add). Net effect is the same ranking-by-legislative,
    but the two formulations can differ by where the off-vote lands — tech-lead should pick ONE
    canonical formulation. (housepoll's `floor(stateReps/focusReps)` + remainder→highest-Leg is
    the later, more-built spec; this thread is the earlier, looser statement.)
- **Rationale (POST 1):** (1) **bigger states SHOULD matter more in the House** — "CA being
  tied with MI doesn't seem right"; (2) it **meshes with legislation that resizes the US
  House** (explicit cross-ref to the House-size cap, #255). vcczar's stated reason for having
  removed it before: "it was a pain in the ass to playtest on a forum" (i.e. a forum-tedium
  removal, NOT a design rejection — relevant: the browser build removes that objection).
- **Ted's load-bearing AGREE (POST 7):** Cal pointed out this "was supposed to be the rule all
  along"; after a long debate Cal **proved it matters** — *"or else the House was just the same
  as the Senate."* → **the design intent of weighted votes is to make the House mechanically
  DISTINCT from the Senate** (1 named senator ≠ a weighted-share rep).

## Apportionment coupling — how many named reps a state gets (#55 / #34)

matthewyoung123 (POST 6/9) asks the apportionment questions; vcczar/Ted answer:
- **Named-rep count (1/2/3) is POPULATION-RANK + ERA keyed** (Ted, POST 9): "**top 3 states
  have 3 reps, then later top 5 states have 3 reps, and eventually top 10 states have 3 reps in
  the modern era**" — the count of states allowed 3 named reps GROWS by era. (Corroborates the
  #55 era-keyed ladder; note this thread caps at 3 named reps, whereas `housepoll` POST 19 later
  EXPANDED the ladder to 1-10 focus reps. So this thread = the pre-expansion 3-2-1 statement.)
- **★ vcczar has a per-era per-state reps-size progression DOCUMENT** (POST 10): *"I have a
  whole document that shows the progression of the US Reps sizes for each state for each era."*
  → **AUTHORED DATA the build needs** (the per-era, per-state named-rep-count table) — same
  artifact `housepoll` POSTs 27-41 later hand-built across start dates.
- **Census coupling (#34):** Ted (POST 9 pt.2): MI < CA in population ⇒ **MI has fewer House
  VOTES even with the same number of named reps** (because votes = delegation share, not named
  count). matthewyoung123 (POST 6) asks whether the **10-year census** shifts named-rep counts
  (states gaining/losing reps, "NY & PA losing to NC & TX") — answered yes, count tracks
  population rank, recomputed by era (the census-recompute #34/`housepoll` §3 later formalizes).
- **House-establishment timing (10centjimmy, POST 12, UNANSWERED here):** when a House is first
  established post-Constitutional-Convention, is the rep ceiling set then? (Historically pop-based,
  x people = 1 rep.) Left open in-thread → ties #255 (chamber-size) + #34.

## Open balance worry + mitigations (#191 — the "McCarthy Rule" / per-seat variability)

matthewyoung123's caveat (POST 6 pt.3, 13, 14 — the one substantive pushback, still approving):
- With only a **3-named-rep cap**, a 53-seat delegation's 3 reps **over/under-represent** the
  state's real partisan split. CA example: 42 D / 10 R / 1 vacant — if Dems take all 3 named
  seats the **10 R seats vanish** (under-rep); if R gets 1 named seat it carries ~17 votes
  (over-rep). A **4-5 named-rep cap** would be fairer (≈13 / ≈10-11 votes each), and a close
  historic House (within ~10 votes) could otherwise flip to the wrong majority party under a
  3-cap (POST 13).
- **vcczar WON'T add ~20k more Reps** (POST 14): *"I'd have to add too many more politicians if
  I did a system other than 3-2-1… I'm not adding 20,000 US Reps."* (Same authoring-cost wall as
  `housepoll` — the every-seat path; here it blocks even a 4-5 cap.) Ted (POST 16) deflects the
  realism worry: the sim diverges from history fast ("our first president in the 1772 playthrough
  was Benedict Arnold") — "a simulation, not a documentary."
- **Mitigations floated (these are #191 seed material):**
  - **Per-seat party-preference variability** (ShortKing, POST 3): add variability to large
    states' **individual seat party lean** to simulate the minority party's share — cites real
    GOP leaders holding seats they couldn't win if every seat shared the state lean. vcczar
    (POST 8): **"Yep, we've already fixed that issue."** → the per-seat deviant-bias work (#191)
    was ALREADY in progress as of May 2022.
  - **★ The "McCarthy Rule"** (POST 21, named for Kevin McCarthy): **guarantee the minority
    party 1 of a big state's named seats**, with a swing **"slightly biased to one party based
    on historical splits."** This is the **minority-party-seat guarantee** `housepoll` POST
    17-18 later authored (the "≥20% Red Reps in CA" rule / +2 minority bias). POST 21 also notes
    a **by-year demographics MAP by state already exists** ("research… pretty much done, just
    have to pull out the results and implement") — more authored data the build needs. NB: this
    thread's "guarantee a minority seat" sits in tension with `electiondisc`'s consensus
    ("don't GUARANTEE a seat, just make it swingy") — an unresolved #191 sub-fork.

## Downstream effects to capture (pure-mechanic — confirms the legislative-voting engine)

- **Vote-swaying becomes higher-stakes** (POST 4): swaying a **CA rep worth 18 votes ≫ a VT
  rep worth 1 vote** — vote-swaying during voting is "more unpredictable and exciting." So the
  sway mechanic's value must scale with the swayed rep's WEIGHTED votes, not headcount.
- **Speaker elections reshape** (Willthescout7 POST 18, elaborated POST 20): *"just because you
  have the most reps would no longer mean you have the most votes"* — most named reps ≠ most
  House votes, so Speaker math requires cross-player alliances ("real sketchy real quick").
- **Primaries become high-value targets** (POST 18/20): a big-state seat (e.g. CA-1, worth ~18
  votes) is a **high-value primary target** → crowded primaries, higher loss/penalty risk, a
  save-him-for-another-office decision. (Same seat-as-prize logic as #250's competition fork.)

---

## NEW vs. corroborating

**Corroborating (no new gap — strengthens existing):**
- **#219** (US-Rep proportional representation) — **this thread is its DESIGN-ORIGIN** (May
  2022), predating both the `summer2021`-cited statement and the `housepoll` resolution. Core
  rule verbatim here: vote power = delegation-size / named-reps, remainder by legislative
  ability. NEW supporting facts: the **REVERT-of-an-old-rule** provenance, the **"or else the
  House is just the Senate"** rationale (Ted POST 7), and the **remainder-direction discrepancy**
  (this thread: drop from LOWEST-Leg; #219/housepoll: add to HIGHEST-Leg) — flag for tech-lead.
- **#55** (focus-Rep abstraction + era-keyed sizing) — confirms named-rep count = population-rank
  + era keyed (top-3→top-5→top-10 by modern era), capped at 3 here (pre-`housepoll` expansion to
  1-10), and surfaces the **per-era per-state reps-size progression DOC** (POST 10) as authored
  data the build needs.
- **#34** (census-driven apportionment) — confirms named-rep counts shift by population at the
  10-year census; smaller-pop state = fewer House VOTES even at equal named count (POST 9).
- **#191** (per-seat deviant bias / "Kevin McCarthy problem") — corroborated TWICE: ShortKing's
  per-seat party-preference variability ("already fixed," POST 3/8) and the explicit **"McCarthy
  Rule"** minority-seat guarantee + by-year state-demographics MAP (POST 21). This thread + the
  sibling `electiondisc` are the two May/Apr-2022 design seeds for what `housepoll` later built.
- **#255** (House-size cap / resize legislation) — corroborated as the explicit motivation for
  weighting ("makes more sense with the legislation that can increase or reduce the size of the
  US House," POST 1); 10centjimmy's House-establishment ceiling question (POST 12) ties here.
- **#250** (seat-competition / seats as primary prizes) — corroborated by the primary-targeting
  (POST 18/20) and Speaker-math (POST 20) downstream effects; a big weighted seat is a prize.

**NEW (candidate gaps):** none. Every datum maps to an existing gap; this thread is the
originating design discussion for the weighted-House-vote rule (#219) and corroborates the
apportionment/seat cluster (#55/#34/#191/#255/#250).

## Engine facts (NOT to re-derive — tech-lead verifies)
- The named-rep / state-delegation model + legislative vote tally live in
  `src/engine/phaseRunners.ts` (`calcStateVote` and the congressional-vote logic).
- Shipped House = the flat focus-rep abstraction (`State.representativeIds: string[]`,
  `types.ts:1327`) with **1 vote per named rep, NO weighted/delegation-share vote power, NO
  per-era named-rep ladder, NO census recompute** — exactly the #219/#55 DELTA.
- House has **no chamber-size variable** today (#255).

## Open questions (for the human / consolidation)
1. **#219 remainder direction:** canonical formulation = drop-from-lowest-Legislative (this
   thread, POST 1) OR add-to-highest-Legislative (#219/`housepoll` POST 19/20)? Pick one — they
   can place the off-vote differently.
2. **Named-rep cap:** stays **3** (vcczar firm, POST 14 — won't add ~20k pols) — confirm the
   build keeps 3 (or the `housepoll`-expanded 1-10 ladder, which supersedes this thread).
3. **#191 sub-fork:** does the minority get a **GUARANTEED** named seat (this thread's "McCarthy
   Rule," POST 21; `housepoll`'s +2 minority guarantee) or only a **SWINGY/winnable** seat
   (`electiondisc` consensus — guaranteeing "removes the election aspect")? Unresolved across the
   three threads.
4. The **per-era per-state reps-size progression DOC** (POST 10) and the **by-year state
   demographics MAP** (POST 21) are referenced authored artifacts — confirm they are sourced for
   implementation (same artifacts `housepoll` POSTs 27-41 used).
