# Digest — aed35c6e "AMPU House Poll"

**Type:** DESIGN-DECISION POLL + author worklog (NOT a playtest). Batch 33.
**Scope:** 41 posts / 1 chunk (`chunk-001.md`). Aug 18-21, 2022 (forum: politicslounge.com topic 1483).
**The decision:** vcczar (tier-1) polls the community on whether to replace the **"focus reps"** US-House model
(Large state = 3 Reps, Medium = 2, Small = 1) with **modeling every real House seat** (~435). He flags huge
authoring cost (per-seat historical biases), CPU/perf risk, and player-tedium risk, and warns even a "Yes" might
not ship without volunteers + a Sept-1 deadline.
**This is the design decision BEHIND #219** (US-Rep proportional representation, batch 31) and the source of the
canonical **"3.0.16 Determining US Reps"** rule. It RESOLVES the focus-reps-vs-every-seat question and SHARPENS
#219/#55/#34/#62/#191.

---

## 1. The poll: KEEP focus-reps vs MODEL EVERY SEAT (the framing)

vcczar's opening case (POST 1):
- **Shipped model = "focus reps":** Large state = 3 Reps, Medium = 2, Small = 1 (the #55 abstraction; shipped as
  `State.representativeIds: string[]` per state, types.ts:1327 — a flat per-state rep list, no size enum in code).
- Admits focus-reps "can lead to **unrealistic results**, although close enough to not be a gamebreaker" (the
  known-flaw acknowledgment behind #191/#192).
- Every-seat cost list (POST 1): (a) delays release — must compute historical biases for *every* seat; (b) perf —
  too many seats slows the game; (c) tedium — player drowns in seats/pols to fill; (d) data — US has had **>10,000
  Reps** historically; he will NOT author 10-20k pols, so a **politician generator** would be required to contest
  seats. Needs volunteers; deadline Sept 1 (<2 weeks at time of writing).

Mitigations floated for the every-seat path (did NOT win, but feed other gaps):
- **Auto-pilot elections** (POST 2): past a threshold, let CPU rules auto-fill open seats so the player only
  micromanages races they care about. (→ relates #189 down-ballot automation / playability.)
- **Give everyone 1 Legislative** (POST 3): opens Congress to all pols so seats are contestable — but hurts
  historical accuracy (Zachary Taylor in Congress). REJECTED in spirit.
- **Generated challengers** (POST 15/19): generate pols to contest each seat with an **election penalty** so every
  election can be contested but generated guys rarely win; cap the count + restrict. (→ ties #189 + the
  generate-a-candidate spec.)

## 2. POLL OUTCOME — KEEP focus-reps (community), but vcczar EXPANDS the tiers

**The community vote leaned KEEP / status-quo** (no every-435 support):
- POST 12: "stick with what we have" — every-district is for "AMPU 2 / another update", not the Sept release.
- POST 13: a Yes-ish vote is really a "present" — wants Matt's compromise, not 435.
- POST 14: status-quo OR Matt's idea; 435 would "slow the game mechanics and CPU processing down too much."
- **NO post advocates the full every-seat / 435 model.** matthewyoung123 explicitly **"VOTE 106 over 435!!"**
  (POST 7, 15). So the result is: **reject every-seat; keep the focus-rep abstraction but make it finer-grained.**

**vcczar's disposition (the actual ruling):** He does NOT do every-seat. Inspired by Matt's tiered compromise
(POST 4/5/7), he ADOPTS an expanded, apportionment-driven focus-rep model (POST 15-19) and then **immediately
executes it** across all historical start dates (POSTs 27-41). So the "might not happen without volunteers" caveat
(POST 1) was MOOT — he proceeded himself (with delegated help from matthewyoung123 POST 25/27, Willthescout7
POST 35) because the chosen path was cheap (adds only ~3 net reps, POST 7/15 — NOT 435).

## 3. The ADOPTED model = expanded focus-reps, EV-derived ("3.0.16 Determining US Reps", POST 19/20)

This is the canonical rule vcczar wrote and is the direct **resolution of #219**. Replaces flat 3/2/1 with an
apportionment ladder driven by each state's real apportioned US-Rep count:

**Step A — how many US Reps a state has (census-driven):**
- A **census election = the first election after a decade** (1860 = decade year, no recalc; **1862 midterm**
  recalcs EVs + US Reps). (Confirms/extends #34 census timing: run decade N, effect at N+2.)
- **US Reps = historical EVs − 2** for that election year (16 EV → 14 US Reps), modified by in-game events/actions.
  Ahistorical drift carries forward (if your Ohio is 2 EV behind history, stay 2 behind in later censuses).
- Early-joining state → 3 EV + 1 US Rep, added to the historical total; late/not-yet-joined state → erase its EVs.
- (Note: vcczar told sheet-playtesters they may cap the rep count for sanity — POST 19/17 — i.e. the ladder is
  the canonical engine target; manual playtests may simplify.)

**Step B — US Reps → number of Focus Reps (the new ladder, POST 19):**
| US Reps in state | Focus Reps |
|---|---|
| ≤5 | 1 |
| 6-10 | 2 |
| 11-15 | 3 |
| 16-20 | 4 |
| 21-25 | 5 |
| 26-30 | 6 |
| 31-35 | 7 |
| 36-40 | 8 |
| 41-45 | 9 |
| ≥46 | 10 |

**Step C — voting power (THIS IS THE #219 RULE, verbatim):** a Focus Rep's voting power = `state US Reps ÷ focus
Reps`; **odd remainder → the highest-Legislative rep gets the extra vote(s)**, randomized if tied. (e.g. 30 US Reps
/ 6 focus = 5 votes each; 31 → top-Legislative rep gets 6.) **This EXACTLY matches #219's "21 reps / 3 influential
= 7 each, remainder → highest-Legislative" rule** — so #219 is confirmed-authoritative and this thread is its
origin spec, NOT a separate idea. (Supersedes the old flat-3/2/1 "Big/Small state" definition: POST 23 redefines
**Small state = 1 Focus Rep, Large state = 4+ Focus Reps**.)

**Step D — per-seat partisan bias (this is the per-seat "deviant bias" model = #191, authored here):**
- Any state reaching **5+ Focus Reps** must have a **minority-party seat** if none exists, started at **Bias +2**
  for the minority party (the "Kevin McCarthy rule" / Ted's "≥20% Red Reps in CA" ask, POST 7/17/18).
- New-seat bias roll: **25% +1 toward state majority party** (Gov+Sen+Rep, tie→random) / **25% tossup** / **50%
  to the party holding the most era-keyed growth lobbies.** Growth-lobby set is era-gated:
  - **Pre-Progressivism:** Big Agriculture, Big Oil & Gas, Transportation, Isolationist.
  - **Progressivism onward:** Public Housing, Labor Unions, Technology, Welfare.
- **Seat GAIN — existing districts re-roll** (each independently): 50% no change / 25% → tossup / 25% → the
  most-growth-lobby party.
- **Seat LOSS — existing districts re-roll:** 50% no change / 25% → tossup / 25% → the party with the **fewest**
  growth lobbies (rationale: shrinking states trend nostalgic/conservative — OH/PA/MI/WV; growing states trend
  liberal — GA/AZ/VA/TX). This is the explicit per-seat realignment-by-population engine behind #20/#191.

## 4. Author worklog — the expanded model was BUILT into every start date (POSTs 27-41)

vcczar reauthored historical US-House rosters for all start dates, tuning focus-rep counts to hit historical
party-margin %. Durable provenance (start date → result):
- **1788** (POST 27): focus reps 25→**20** (the ONE era with a reduction); Federalists 55% House (hist 56%; old
  rules had Jeffersonians +1 — i.e. old 3/2/1 was *backwards*). Cut Blue seats to fit; preserved prominent pols
  (Fisher Ames, Sedgwick kept; Elbridge Gerry's lone-Blue-MA seat cut).
- **1800** (POST 28): 28→**29** focus reps; Blue 65% (was 61%; hist 64%). **VA = first state >3 focus reps → 4
  (all Blue).**
- **1820** (POST 29): **NY joins VA at >3 reps**; margin "right on the nail." Blue holds **83%** of House (many
  Blue reps in Red-bias districts → vulnerable-seat-defense gameplay). Fixed a data error (Hendricks → Rep,
  Taylor → Senator); adds Silas Wood F-NY.
- **1840** (POST 30): margins within 2% of historic; adds John McKeon D-NY.
- **1856** (POST 31): longest to tune; +~5 new PA/NY pols incl. Tammany boss John Kelly.
- **1868** (POST 32): margins now "perfect" (were off 5%); adds obscure NY/PA pols (Orange Ferriss).
- **1892** (POST 34), **1916** (POST 35, Dems +1 focus rep over GOP; volunteers fill new pols), **1928** (POST 36,
  +2 women reps; "larger states even more important"), **1948** (POST 37), **1972** (POST 39, adds Augustus
  Hawkins, Barry Goldwater Jr, TX first GOP rep Bill Archer), **2000** (POST 40, Ron Paul now a rep), **2012**
  (POST 41) all completed.
- **2024** (POST 40): deferred until after midterms; plan = assume all incumbents hold (Biden-Harris 2nd term) or
  educated guess on a narrow Biden reelection.
- Authoring policy (POST 37/39): fill new seats from existing pols first; add only when none fit; deliberately add
  **women, minorities, ethnic surnames, long-serving Reps** to fill vacancies (a diversity-of-roster authoring
  rule).

**Net effect: the expanded model ADDED only ~3 reps overall** (POST 7: 106 vs old 103) yet made every era's
House party-margin markedly more historically accurate — the core justification for choosing it over both flat
3/2/1 and full 435.

## 5. Related House mechanics raised

- **No penalty for LOSING a House election** unless you're the incumbent (POST 17, vcczar). (Relevant to #37
  defeated-incumbent retire / #189 down-ballot stack.)
- Known unrealism of old 3/2/1 (POST 6/10centjimmy-era feedback): a single NY Rep could hold ~20 of 30 state votes
  = unbalanced super-rep; players were skipping NY/CA pols entirely as unwinnable (300 NY guys "doing nothing").
  This is the concrete failure the new ladder + per-seat bias fixes.
- "Big/Small state" definition is now **focus-rep-count-derived** (POST 23): Small = 1 focus rep, Large = 4+ —
  supersedes any hard-coded size labels; relevant anywhere code keys off state size.
- Don't-forget hook (POST 16): the census/EV-change rules for **ahistorical** seat changes must stay wired to this
  (→ #34). vcczar confirms the new rule still honors ahistorical EVs (POST 21 "passes my muster").
- Future-proofing (POST 19): "the game may eventually allow alternative-history growth of the US based off Gov
  Actions and Federal legislation" — i.e. US-Rep counts should be mutable by gameplay, not static (relates #43/#33
  territory growth, #34 census).

---

## Candidate gaps / resolutions for consolidation

1. **#219 — RESOLVED + ORIGIN FOUND (KEEP).** This thread is the origin spec of #219's proportional rule. Confirm
   #219 verbatim: focus-rep voting power = `floor(stateUSReps / focusReps)`, **remainder → highest-Legislative
   rep** (POST 19/20). #219 should be marked **DESIGNER-DECIDED: KEEP focus-rep abstraction (every-435 REJECTED),
   expanded to an EV-derived 1-10 ladder**, sourced to this digest (POST 1, 19) in addition to summer2021 59-63.
2. **Focus-reps-vs-every-seat POLL OUTCOME = KEEP focus-reps.** Community rejected modeling all ~435 seats
   (perf/tedium/authoring; POST 12-14); matthewyoung123 "106 over 435" (POST 7/15). vcczar's disposition: did NOT
   do every-seat; ADOPTED + already BUILT the expanded ladder himself (POSTs 27-41) — the Sept-deadline/volunteer
   caveat was moot. **No new "every-seat" gap should be opened; every-seat is explicitly an "AMPU 2" parking-lot
   item.**
3. **Sharpen #55 (focus-Rep abstraction):** replace the flat "Large=3/Med=2/Small=1" description with the
   EV-derived 1-10 focus-rep ladder + redefine Small=1 / Large=4+ focus reps (POST 19/23). Shipped reality is
   still the flat list (`representativeIds: string[]`, types.ts:1327) — DELTA: build lacks the EV→ladder sizing,
   the per-seat vote-weight split, and the census recompute.
4. **Sharpen #191 (per-seat "deviant bias"):** this thread AUTHORS the full per-seat-bias engine #191 only
   gestured at — minority-party-seat guarantee at 5+ focus reps (Bias +2), the 25/25/50 new-seat bias roll, and
   the seat gain/loss re-roll tables keyed to era-gated growth lobbies (Big Ag/Oil/Transport/Isolationist pre-Prog;
   Public-Housing/Labor/Tech/Welfare after). Add this as the concrete spec for #191; pairs with #20 census/#34.
5. **Sharpen #34 (census/EV):** confirms census = first election after a decade (decade-year skips, N+2 applies),
   US Reps = EVs−2, ahistorical-drift-carryforward, early-join = +3EV/+1Rep, late-join = erase EVs. Adds the
   focus-rep recompute as a census effect.
6. **Down-ballot / playability (relates #189):** "no penalty for losing a House race unless incumbent" (POST 17);
   the **auto-pilot/CPU-fill elections** idea (POST 2) + **generated challengers w/ election penalty** (POST 15/19)
   as the tedium mitigations — fold into #189 (down-ballot automation) and the generate-a-candidate spec, NOT new
   rows.

**Open question for the human:** the canonical "3.0.16 Determining US Reps" rule (POST 19) is a *manual-playtest*
spec ("playtesters may cap reps for sanity"); the engine target is the full ladder. Tech-lead should confirm
whether the shipped engine should auto-derive focus-rep counts from EV at each census, or keep the static authored
per-start-date rosters vcczar hand-built (POSTs 27-41).
