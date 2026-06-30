# Digest — "Post-12th Amendment: Pre-primary conventions" (Matt's Modified/Clarified Rules)

- **Slug:** `fb8070f3-post-12th-amendment-preprimary-conventions`
- **Source CSV:** `fb8070f3-Post_12th_Amendment__Preprimary_conventions.csv`
- **Posts:** 9 (1 chunk, ~18k chars). Opened by **@matthewyoung123** ("Matt") — a
  prolific GM who states he has "been a part of 15 or more post 12th Amendment,
  but pre state primary conventions" and is rewriting the rules to clarify them.
- **Date stamp in-thread:** Oct 13–14, 2025.
- **Type:** **ruleset-design (canonical, HUMAN-side).** NOT a playthrough. This is
  the authoritative *table* spec for how a pre-primary national convention is run
  by players/GM; no game is played, only the procedure is laid out. Participants:
  matthewyoung123 (author), Saucialiste (clarifying Qs on dark-horse), OrangeP47
  (banter on winning ballot 1), one unsigned "Congressional Nominating Caucus"
  proposal (POST 7).
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** This is the **human-facing national-convention
> ruleset** for the era *after* the **12th Amendment (1804)** but *before* state
> primaries — the deep procedure that the **CPU-decision spec** (`d1058b12`,
> batch 55, which owns gap **#71/#72**) is built to automate, and that the **1960
> full-scale capture** (`redbutton`, gap **#185**) exercised in play. Where b55
> gives the CPU's *gates-over-RNG* choices and `redbutton` gives one observed
> run, THIS thread gives the **base rulebook both sit on**: delegate allocation
> (the quarter-rule), the win threshold (½/⅔/¾/unanimous), momentum, inter-ballot
> actions, brokered/deadlocked handling (compromise @10, dark horse @25), and the
> **slim-competition VP-promise shortcut**. It also surfaces a **NEW era gate**
> (POST 7): post-12A-but-pre-1830s nominations should run through a **Congressional
> Nominating Caucus** ("King Caucus"), *not* a convention. The whole system is
> ~0% shipped (2.9.2 is a one-line log stub); this digest is the design half of a
> total gap.

---

## ★ Era window & which mechanism applies when (POST 1, 7)

| Era window | Nominating mechanism | Status in KB |
|---|---|---|
| Pre-12th-Amendment (≤1804) | the old two-votes-per-elector / spoiler rules | owned on **#72** (`ted1772`, `oopscpu`) |
| **Post-12A, pre-~1830s** | **Congressional Nominating Caucus** — Pres+VP nominated by each party's senators+congressmen; "same logic as congress positions" (POST 7) | **NEW** — proposed, unowned |
| **~1830s → pre-state-primaries** | **National Convention** (this thread's ruleset) — "normalization of conventions in the 1830s (via event probably)" (POST 7) | maps to **#185 / #71 / #72** |
| Primary era onward | primaries then convention (2.9.1 → 2.9.2) | the shipped (stubbed) path |

The 12th Amendment is the hinge: it made electors vote **separately for President
and VP**, which is *why* a convention forms a deliberate **P+VP ticket** (the
ticket-balancing below) rather than the pre-12A "top-2-EV" accident.

## ★ Who may be nominated (POST 1)

- Each faction selects **two candidates max**: **one MAJOR + one MINOR/favorite-son.**
- **MAJOR** must be the **faction leader OR a politician with the Celebrity trait.**
- **MINOR/favorite son** = any politician.
- **All nominees need ≥1 Command point.**
- **Convention order:** the party **out** of the White House conventions **first**,
  then the party holding the White House.

## ★ Delegate allocation — the "quarter rule" (POST 1)

If the **unit rule is OFF**, each state's delegates split into **four equal parts**
(odd remainder → randomize/roll for the extra):

| Quarter | Goes to the candidate supported by… |
|---|---|
| ¼ | the **Governor's** faction's candidate |
| ¼ | the **Senior US Senator's** faction's candidate |
| ¼ | the **Junior US Senator's** faction's candidate |
| ¼ | the candidate with the **most Momentum** ("momentum delegates") |

Overrides / fallbacks, in order:
1. **Home-state lock:** a candidate **from** a state holds **ALL** that state's
   delegates (incl. momentum delegates) while he stays in, regardless of who the
   Gov/Sens are. Multiple home-state candidates → split as evenly as possible.
2. **No same-faction Gov/Sen → ideology fallback:** delegates go to the candidate
   matching the **state's preferred ideology** (multiple matches → split evenly).
3. **No ideology match → most Momentum.** (Also if no preferred ideology AND no
   Gov/Sen-faction candidate → most Momentum.)
4. **Major-vs-minor tie → MAJOR wins.**
- **UNIT RULE ON:** the candidate with the majority of a state's delegates takes
  **all** of them (WTA; tie → randomize).
- **After ballot 1 (unit rule off):** players **keep** their Gov/Sen delegates and
  **keep** ideology delegates *so long as they still hold that-ideology candidate*;
  **momentum delegates switch** to whoever now leads momentum.

## ★ Momentum (POST 1)

- The **party leader auto-starts at +1 Momentum**; **party leader wins all momentum
  ties** ("will always have the momentum if tied").
- **Nomination speech** (each major picks a non-candidate, non-Incoherent speaker;
  CPU prioritizes an **Orator**): roll **d6** → **1** = −1 Mo; **2-4** = nothing;
  **5** = nothing unless speaker is **Orator** (then +1); **6** = +1 Mo.
- **Frontrunner penalty:** **33% of the time**, if the pre-convention frontrunner
  (or the Party Leader's nominee, pre-primary era) **fails to win ballot 1**, he
  takes **−1 Mo** next ballot and the **2nd-place** balloter gets **+1 Mo**.
  Thereafter momentum goes to whoever sees the **greatest delegate gain** ballot-
  to-ballot. The momentum leader takes the momentum delegates each ballot.
- A **minor/favorite son can be PROMOTED to major** if he finishes **Top 2 in
  delegates after the 1st round** (so earliest at the end of ballot 2).

## ★ Win threshold & rule changes (POST 1)

- **Default threshold to win = whatever the kingmaker vote set** — choices are
  **½ (50%+1) / ⅔ (66%+1) / ¾ (75%+1) / unanimous (100%)**.
- **Force a Rules Change:** a faction leader OR major can call a vote (only fires
  if **two** of them request it). Votable rules: **suspend the unit rule / apply
  the unit rule / lower the delegate threshold.**
  - Each faction's votes = **# of its politicians with the `Kingmaker` trait**;
    majority wins; **tie = the change FAILS.**
  - **`Iron Fist` Party Leader** sets all rules unilaterally (or may allow a vote);
    **`Leadership` Party Leader** can roll **5-6 on d6** to force rules unilaterally.

## ★ Inter-ballot actions (POST 1) — the heart of the convention loop

A candidate may take **as many inter-ballot actions as he has Command points**
(more Command = more finesse). **Major candidates** may do any of:

| Action | Gate / roll |
|---|---|
| **Force a Rules Change** | (above; needs 2 requesters; kingmaker-weighted) |
| **Presidential Promise** | offer to a candidate/faction with **fewer delegates**; can't offer the same post twice in a round; recipient must **qualify** for the office. **+1 Mo per cross-faction candidate who drops & endorses** (own-faction minor drop = no Mo). Offer menu + CPU **accept** odds: **VP 50%**; **SecState 40%**, **Treasury/War/AG 33%**; **Junior cabinet 25%**; **Foreign Minister/Ambassador 20%**; **next SCOTUS seat 20%**; **next General/Admiral vacancy 20%**; **party platform 20%** |
| **Drop out (+endorse)** | no promise needed; **+1 Mo per cross-faction endorsement** |
| **Whip the Party** (Party-Leader candidate only) | d6: +1 Mo on **6** (5-6 with `Leadership`) |
| **Influence Smoke-Filled Rooms** (candidate is an active **protégé of an active Kingmaker**) | d6 **5-6** → +1 Mo |
| **Kingmaker Interference** (a non-candidate faction leader with `Kingmaker`) | d6 **5-6**: +1 Mo to own/allied candidate **or −1** to an allied candidate |
| **Appeal to Integrity** (candidate has `Integrity`, opponent `Controversial`) | d6 **5-6** → +1 Mo |
| **Appeal to Credibility** | economy worse-than-sound + `Economics`+≥1 admin → 5-6; OR ongoing war + `Military`/`Naval`+≥1 mil → 5-6; OR domestic meter at protest+ and `Justice`+≥1 admin → 5-6 (+1 Mo) |
| **"Reliable Party Nominee"** (candidate has `Predictable`, in 1st/2nd) | d6 **5-6** → +1 Mo |
| **"Will of the People"** (RW-Pop/LW-Pop + Nationalism/Civil Rights/RW-Activist/LW-Activist/Theocrat) | d6 **5-6** → +1 Mo |
| **"Lies and Propaganda"** (candidate has `Controversial`+`Propagandist`) | d6 **4-6** → +1 Mo, **but** 1-2 chance of **−1 party preference** on the National meter |
| **Request a Ballot Shift** | needs **2** factions; requesting leaders move their delegates to the **overall delegate leader** (to end the convention by accepting the frontrunner) |
| **Call for a Compromise Candidate** | **after 10 ballots**, needs **2** factions (see below) |
| **Call for a Dark Horse** | **after 5 compromise-ballots**, needs **2** factions; **AUTOMATIC after the 25th ballot** (see below) |

A **MINOR/favorite-son** candidate may ONLY: stay in; drop without endorsing; or
drop **and endorse** another candidate (major or minor).

## ★ Slim-competition VP-promise shortcut (POST 1)

If there are **only two total major candidates**, the delegate-leader may offer
**the VP slot to the 2nd candidate's faction as a Presidential Promise.** If
accepted → **ballot 1 is unanimous, skip straight to VP selection.** CPU **makes**
this offer 50% / **accepts** it 50%.

## ★ Brokered / deadlocked resolution (POST 1, 2-3, 8-9)

- **Compromise candidates @ ballot 10** (2 factions calling): every faction picks
  **one of-age, ≥1-Command** candidate it will accept **from an allied faction**;
  the pick **cannot** have been in the primaries/convention before ballot 10. These
  **replace** the calling factions' candidates and absorb their delegates after a
  ballot; if a faction's originals can't win, they (incl. favorite sons) drop.
  Same compromise candidate may be picked by multiple factions → possibly only one
  remains → that one is the nominee. **Limit 1 per faction.**
- **Dark Horse @ 5 compromise-ballots, AUTO @ 25 ballots** (2 factions calling):
  the faction **controlling the Party Leader** selects an of-age, **≥1-Command**,
  **Presidency-eligible (35+, native-born)** politician **from the LOWEST-overall-
  score faction** in its party (cascade up if that faction has no one eligible).
  May be on the Career Track. Auto-nominated.
  - **Clarification thread (POST 2-3, 8-9):** the dark-horse rule reads like "two
    selections" but the author confirms it is **ONE selection with two
    requirements** — (1) from the same party's lowest-score faction, (2) eligible
    for the Presidency. Saucialiste: "It's not two different selections, it's one,
    just with the two specific requirements."

## ★ NEW — Congressional Nominating Caucus ("King Caucus") era gate (POST 7)

> "Post-12th but before the normalization of conventions in the 1830s (via event
> probably) there should be the **Congressional Nominating Caucus** wherein
> candidates for president and vice president are nominated by the senators and
> congressmen of each party. It would basically just use the same logic as
> congress positions."

A distinct, **earlier** nominating mechanism for **~1804–1830s** that the KB has
not previously captured as a mechanic (the term appears only in
`historical-context.md` as background). Proposed implementation: reuse the
existing **congress-position selection logic**, fired between the 12A and a
~1830s "conventions normalized" era event.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-30)

**The entire post-12A nomination machine — caucus, convention, delegates,
balloting, momentum, ticket-formation — is ~0% shipped.** What ships is a
single-winner primary sort feeding a head-to-head EV race; the "convention" is a
log line.

- **★ 2.9.2 Conventions = a ONE-LINE LOG STUB.** `engine.ts:69`:
  `case '2.9.2': addLog(snap, '2.9.2', 'election', 'Party conventions ratify the
  primary winners.'); return {};`. **Zero** delegates, balloting, threshold,
  momentum, promises, compromise/dark-horse, VP, or platform. The phase exists in
  `PHASE_SEQUENCE` (`phases.ts:40`) purely as a label. **Confirms b55's finding.**
- **★ 2.9.1 Primaries = single-WINNER PV sort (no convention semantics).**
  `runPhase_2_9_1_Primaries` (`phaseRunners.ts:3725-3750`) filters each party to
  `age 35-80 && command >= 2`, sorts **ONCE** on `pvCache + command*5 +
  traitBonus`, and takes the **top one**. There are **no factions running
  candidates, no major/minor split, no Celebrity path, no delegates, no
  nominators**. → nominees are chosen **PV+Command-based**, exactly as `pv.ts`
  computes; nothing in this thread's ruleset (faction-leader-or-Celebrity major,
  ≥1-Command floor, momentum, kingmakers) is consulted. **Note the floor
  mismatch:** code gate is `command >= 2`; the thread's nominee floor is **≥1**
  Command (and the Celebrity/faction-leader path).
- **★★ `vicePresidentId` is NEVER SET by the election flow (verified).** The
  whole-codebase write surface of `vicePresidentId`:
  - **set to `null`:** `scenario1772.ts:76` (init), `phaseRunners.ts:2450`
    (cleared on VP-vacate);
  - **set once at scenario init:** `scenario1856.ts:156` (`vp?.id ?? null`);
  - **read for display only:** `CabinetPage.tsx:20`, `Dashboard.tsx:14`.
  `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752-3814`) runs a
  **head-to-head EV race with NO running mate**, sets `presidentId`, and **resets
  the cabinet to null** post-election — it never touches `vicePresidentId`. So the
  **12th-Amendment P+VP TICKET is entirely unmodeled**; there is no ticket
  formation, no VP-selection, no ticket-composition meter effect. **This is the
  headline shipped-vs-designed delta.**
- **★ NO presidential-convention DATA MODEL.** Grep of `types.ts` for
  `delegate*/ballot/momentum/darkHorse/presidentialPromise/threshold/keynote/
  platform/runningMate` → **nothing** for presidential nomination. The only
  `delegate*` fields are **Continental-Congress** delegates; the only `Convention`
  type is `ConstitutionalConvention`.
- **★ ⚠ DO NOT CONFLATE the constitutional convention.**
  `makeConvention`/`pendingConvention`/`constitutionalConvention.ts`
  (`engine.ts:18`, `phaseRunners.ts:3183-3184`) is the founding-era
  **Constitutional** Convention — a wholly separate system, **not** evidence of a
  presidential nominating convention.
- **No Congressional Nominating Caucus path** anywhere (grep = none); the term is
  only historical background. `isPresidentialYear` = `year % 4 === 0`
  (`phases.ts:53-55`); the nomination phases fire only in presidential years
  (`phases.ts:69-70`), with **no era branch** selecting caucus-vs-convention-vs-
  primary. The era-specific mechanism gating this thread describes does not exist.
- **Trait/Command primitives EXIST but are unwired to nomination.** `Kingmaker`,
  `Celebrity`, `Orator`, `Integrity`, `Controversial`, `Propagandist`,
  `Predictable`, `Leadership`, `Iron Fist`, `Incoherent` are all in the `Trait`
  union and `command` is a `Politician` field — but **none** is read by 2.9.1/2.9.2.
  The convention build is *wiring existing data into a new state-machine*, not
  inventing primitives.

**Net for tech-lead:** the post-12A nomination system is a **complete design
sitting on an empty stub.** 2.9.1 picks the single top-PV/Command pol; 2.9.2 logs
one sentence; **`vicePresidentId` is never set by any election path** (no
12A ticket); there is **no delegate/ballot/momentum/promise data model** and **no
era branch** to choose caucus vs convention vs primary. This thread is the
**human-rulebook source** under the CPU spec (#71/#72) and the 1960 capture
(#185); all three describe the same unbuilt machine.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold.)*

- **HEADLINE → #185 (the unbuilt primary→convention SYSTEM).** This thread is the
  **canonical HUMAN-side base ruleset** for it: quarter-rule delegate allocation,
  unit-rule, ½/⅔/¾/unanimous threshold + kingmaker-weighted rule-change vote,
  momentum (party-leader +1, speech d6, frontrunner −1 on ballot-1 loss), the full
  inter-ballot menu, slim-competition VP-promise shortcut, compromise@10, dark
  horse@5-compromise/auto@25. Companion to the 1960 capture already on #185.
  **Build state re-verified ~0% (2.9.2 = `engine.ts:69` log stub).**
- **MAPS TO #71 (CPU convention inter-ballot menu / compromise / dark horse).**
  This thread is the **rulebook the b55 CPU spec automates** — the 10-action menu,
  the d6 success rolls, Presidential-Promise reward odds (VP 50 / SecState 40 /
  Treas·War·AG 33 / junior 25 / ambassador·SCOTUS·general·platform 20),
  compromise@10 and dark-horse@25 all match. Confirms #71's design; 0% shipped.
- **MAPS TO #72 (CPU candidate/VP selection).** Provides the **eligibility rules**
  #72 selects within: MAJOR = faction-leader OR Celebrity, ≥1 Command; MINOR = any
  ≥1 Command; dark-horse = lowest-score faction + Presidency-eligible (35/native).
  The 12A **ticket-formation** here is the design the missing VP-retention/VP-
  selection logic (#72's acknowledged hole) plugs into.
- **MAPS TO #183 (endorsement → momentum).** This thread is a **source for the
  momentum primitive #183 needs:** "+1 Momentum per cross-faction candidate who
  drops & endorses" (own-faction minor = no Mo), plus the frontrunner −1 / 2nd-
  place +1 swing. Corroborates that the build lacks the momentum channel
  (`grep momentum|endorse` in `src/` = none).
- **★★ NEW (consolidation to ID) — 12th-Amendment P+VP TICKET FORMATION as an
  election-flow requirement.** `vicePresidentId` is **never set** by any election
  path (verified: only nulled/seeded/read). The whole "electors vote separately
  for Pres and VP ⇒ deliberate ticket-balancing" mechanic is unmodeled. May fold
  into #72 (VP-selection) + #185 (the system) or stand alone — flag for
  consolidation. **This is the load-bearing new delta.**
- **★ NEW (consolidation to ID) — Congressional Nominating Caucus ("King
  Caucus") era gate (POST 7).** A distinct **post-12A / pre-~1830s** nominating
  mechanism (Pres+VP chosen by each party's Congress members, "same logic as
  congress positions"), fired before a ~1830s "conventions normalized" era event.
  Not previously captured as a mechanic. Requires an **era branch** in the
  nomination phase (caucus vs convention vs primary) that the shipped
  `shouldRunPhase`/`isPresidentialYear` does not have.
- **★ NEW (consolidation to ID) — the era-selector for nomination mechanism.**
  The 4-row era table (pre-12A spoiler / post-12A caucus / 1830s+ convention /
  primary-era) implies a single gate choosing the mechanism by era. Shipped code
  has **one** path (primary→stub-convention) with no era branch. Likely a sub-item
  of #185.
- **NEW detail (fold into #185/#71) — the "quarter-rule" delegate allocation +
  home-state/ideology/momentum fallback ladder.** A concrete, numeric allocation
  model not previously spelled out from the human side (Gov ¼ / Senior Sen ¼ /
  Junior Sen ¼ / momentum ¼; home-state lock; ideology fallback; major-wins-tie).
- **NEW detail (fold into #71) — the FULL inter-ballot trait-appeal table.** The
  Integrity/Credibility/Predictable/Will-of-the-People/Lies-and-Propaganda appeals
  with their exact gates and d6 thresholds (incl. the Propaganda −1-party-
  preference side-effect) — corroborates #71's appeal set with the human-side
  numbers.
- **NEW detail (fold into #185) — Command-points = inter-ballot action budget.**
  "A candidate may take as many inter-ballot actions as his Command points." A
  clean rule tying the existing `command` field to convention agency; not
  previously captured.
- **CONFIRMS the b55 build-state findings.** Independently re-verifies (against
  `src/` HEAD) that 2.9.2 is a log stub, 2.9.1 is a single-PV-winner sort, and
  `vicePresidentId` is never set by the engine — matching `cpu-rules-for-
  presidential-conventions` (b55). No conflict.
