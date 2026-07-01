# cb91e00e — Vacancy-filling: career-track pull vs random-gen (design poll)

**Slug:** `cb91e00e-ampu-poll`
**Source:** `docs/game/sources/cb91e00e-ampu-poll/` (1 chunk, 6 posts, ~1.9k chars)
**Type:** design poll / vacancy-filling ruleset (not a playthrough)
**Date:** ~January 2022 (POST 6 edited Jan 20 2022, by Ich_bin_Tyler)
**Batch:** b60
**Scope:** How to fill an **elected seat** when its holder **dies/vacates and NO
replacement politician is available**. Small early design-discussion snapshot;
it is the *seed* of the later, fuller vacancy-fill ladder (game-context **#154**).

> **Why it matters:** This is a first-principles poll on the exact question the
> build still does NOT answer: when a Senator/Representative/Governor dies and no
> free pol exists to take the seat, what happens? The shipped engine simply
> **nulls the seat and moves on** — there is *zero* vacancy-fill logic. This
> thread debates the two candidate mechanisms (career-track pull vs procedural
> generation) that later crystallize into #154's canonical ladder, and it adds
> one nuance #154 does not: a **House-leaves-empty vs Senate-random-generate
> split** motivated by "a governor won't appoint the opposite party" and by
> making House deaths matter in a tight chamber. Provenance for #154/#289/#290.

---

## ★ Option A — pull a pol off the Career Track (the winning option)

The debate centers on whether a pol yanked off the Career Track to fill the seat
keeps the skills/traits accrued during their track time:

- **WITH benefits** (POST 3): "fully for taking someone off the career track and
  having their benefits so far — it will be rare enough that it won't be OP."
  Thematic argument (POST 6): career tracks represent lower-level pols in a state
  (e.g. a **Lt. Gov.**), so they *should* carry some skills from their track time.
- **WITHOUT benefits** (POST 2, POST 6): "as long as they don't get the
  benefits." Exploit worry (POST 6): otherwise you'd **park all your pols on
  career tracks and farm the benefits** while betting the state runs short of
  free pols — "risk/reward gameplay and theme."
- **Resolution (POST 5):** *"a combination of career tracks win"* — the
  career-track pull is adopted (the with/without-benefits toggle is **left
  unresolved** in this thread; treat as an open sub-decision).

## ★ Option B — procedurally generate a random politician (the fallback)

POST 2's alternative, and (per POST 4) the intended path for the **Senate**:

- **50/50 immediate-retirement roll** on generation: half the time the generated
  pol immediately retires (i.e. the seat stays effectively unfilled that cycle);
- else the pol has **bare-minimum stats** (deliberately weak, so a generated
  replacement is never a windfall).

## ★ House-vs-Senate split (the genuinely new nuance, POST 4)

The chambers should behave **differently** when no pol is available:

- **House → leave the seat EMPTY**, symbolizing an *unfilled special election*.
  Rationale: makes **deaths in a tightly-contested House matter** (an empty seat
  is a lost vote).
- **Senate → randomly generate** (Option B). Rationale: "I don't see a scenario
  where a governor would willingly **appoint someone of the opposite party**" —
  so the Senate seat is filled by generation rather than a hostile-governor
  appointment.

---

## Shipped-vs-designed (verified against `src/` HEAD)

- **Death/retire → seat handling is `vacateOffice` (phaseRunners.ts:2446).**
  On death (`markPoliticianDead`, :2328) or retire (`markPoliticianRetired`,
  :2333) — whether age-driven (2.4.1 `runPhase_2_4_1_Deaths` :2341-2380),
  event-driven (`death`/`forceRetire` anytime effects, :2717-2728), war
  (`revolutionaryWar.ts:92`), or court (:3657) — the engine only **nulls the
  office pointer and drops the holder** from the relevant list:
  `presidentId/vicePresidentId/speakerId/proTemId/chiefJusticeId` → `null`;
  `supremeCourtIds`/`senators`/`representativeIds`/`governorId`/`cabinet[k]`
  filtered/nulled (:2449-2477). **There is NO backfill of any kind.** The seat is
  simply **left vacant** and refilled only at the next scheduled election. So the
  build already does the *House variant by default* — but for **every** seat, and
  without the "special election" framing.
- **Career Track exists but CANNOT be pulled off to fill a seat.** `CareerTrack`
  is a 7-value track (`types.ts:43`); pols accrue skills/traits/expertise over up
  to `CAREER_TRACK_MAX_YEARS = 20` years via `runPhase_2_1_2_CareerTracks`
  (:401), governed by `CAREER_ODDS` (`types.ts:229`). A pol *exits* the track
  only by aging out (:427) or (per `CCDelegateDeclineModal`) accepting a CC
  appointment. **No code path pulls a track pol into a vacated Senate/House/Gov
  seat**, with or without benefits. The "with/without accrued benefits" toggle is
  therefore entirely undesigned in the build.
- **No procedural replacement generator.** Grep for
  `generate*Politician`/`randomPolitician`/national-names stub returns **nothing**
  in `src/`. There is no bare-min-stat generator and no 50/50 immediate-retire
  roll. (The only procedural draftee path is the flat draft fallback in
  `runPhase_2_1_1_Draft`, unrelated to vacancy-fill; that is gap **#290**.)
- **No special-election / governor-appointment path.** `grep -i "special
  election|vacan|appoint"` finds only cabinet/CC/committee *appointment* phases
  (2.3.x, `continentalCongress.ts`) and UI "Vacant" labels (Dashboard, Congress,
  Governors, Cabinet pages) — i.e. seats are *displayed* as Vacant, never
  auto-filled. No House special-election branch; no governor-appoints-Senator.
- **Immediate-retire vs age-retire.** Age retirement is a per-year bracket roll
  (`retireBracket`, 2.4.1 :2351-2380); `forceRetire` (:2723) sets `retiredYear`
  now. Neither is the poll's *generate-then-50/50-retire* mechanic.

**Net:** the shipped death→replacement path is `vacateOffice` → **null the seat,
no fill logic whatsoever**. The build coincidentally matches the poll's *House*
answer (leave empty) for all seats, but implements **none** of the career-track
pull, the random generator, the 50/50 retire, or the House/Senate distinction.

---

## Delta list

Maps to **existing** gaps — this poll is early **provenance**, not a new system:

- **#154** (Office/seat vacancy-fill ladder, RULED) — **PRIMARY MAP.** This poll
  is the Jan-2022 *seed* of #154's canonical ladder. #154 already captures both
  mechanisms debated here: **career-track pull** (its steps 1 & 3, same/other-
  party CT-pol-from-the-state) and **"randomly generate + give to the
  lowest-scoring faction"** as the terminal fallback (the fuller 6/7-step Ted
  spec). The **with/without-accrued-benefits** career-track toggle (POSTs 2/3/6)
  is a **sub-decision #154 does not pin** — this thread surfaces it and the
  farm-the-benefits exploit worry; leaves it **unresolved**. → *add to #154 as a
  provenance cite + flag the benefits toggle as an open sub-decision.*
- **#290** (procedural politician generator) — **MAP.** Option B (bare-min stats
  + **50/50 immediate-retire roll**) is exactly the terminal "randomly generate a
  replacement" leg. This thread supplies the **stat floor (bare-minimum)** and
  the **50/50 retire gate** design intent for the vacancy-fill generator.
- **#289** (three-tier stat model / career-track cohorts) — **WEAK MAP.** Only
  relevant via the theme argument (career-track pols = Lt.-Gov-tier, so they
  carry some skills) — reinforces that a pulled track pol has partial, not peak,
  stats. Not a new requirement.
- **NEW (consolidation to #154)** — **House-leaves-EMPTY (special-election
  framing) vs Senate-RANDOM-GENERATE split (POST 4).** #154's ladder is
  seat-type-uniform; this thread argues the **House** should differ (leave empty,
  symbolizing an unfilled special election, so deaths in a tight House matter)
  while the **Senate** uses generation ("governor won't appoint the opposite
  party"). This chamber-specific branch is not in #154 as written — consolidation
  should decide whether to fold it in as a #154 sub-rule or track separately.
  Loosely adjacent to **#150** (3.0.17 special-election conditions) which is a
  *different*, meter-gated post-war rule — do not merge.

**Open questions (for the human / consolidation):**
1. Does a career-track pol pulled into a seat keep accrued benefits? (POST 5
   adopts the pull but leaves this toggle unresolved; POST 6 argues both sides.)
2. Is the House-leave-empty vs Senate-generate split still canon, or superseded
   by #154's uniform ladder? (This poll predates #154's fuller spec.)
