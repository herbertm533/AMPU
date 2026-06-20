# Spec: Cabinet overhaul — era-conditional, expertise-aware (PR5)

## Vision (as given)

PR5 makes the cabinet **era-conditional, expertise-aware, and historically
faithful for both AMPU eras.** Today (`phaseRunners.ts:2086-2165`) the cabinet
loop iterates a fixed six-seat list identical in both scenarios — State,
Treasury, War, AG, Postmaster, KeyAdvisor — picks the highest-`admin`
co-partisan, and grants admin + state's command + a fixed expertise per the
hand-coded `OFFICE_EXPERTISE` table. The 1772 scenario seeds the same six
slots at year 1772 — seventeen years before any cabinet actually existed
(`scenario1772.ts:88`). The 1856 scenario opens the Buchanan baseline with
**only** State seeded and no Navy / Interior in the type or seed at all
(`scenario1856.ts:128-135`). The "KeyAdvisor" slot has no historical analog
in either era. The "Admiral" slot is anachronistic through both scenario
windows. PR5 rebuilds this loop on top of a four-transition timeline
(**1789 cabinet exists / 1798 + Navy / 1829 + PMG / 1849 + Interior**),
replaces the pure-admin sort with a composite expertise-aware score, gives
the AG pre-1870 the historically-correct one-person-legal-office treatment
(near-zero admin weight), drops KeyAdvisor and Admiral from `OfficeType`,
seeds the 1856 cabinet with all seven historical Buchanan-era seats, and
adds a small per-seat governance bonus in 2.5.1 Lingering so cabinet
quality has at least one visible gameplay tell. Senate confirmation
friction, cross-party "team of rivals", anytime-event expertise routing,
and DOJ-1870 admin transition are all explicitly deferred to PR6+.

## Historical grounding (binding)

Source: `docs/research/cabinet-overhaul-historical-context.md` (the
historian's PR5 brief, ~1,000 lines, all citations primary or institutional).
Companion: `docs/research/abilities-expertise-traits-gap-analysis.md`
(row 5: "Cabinet overhaul"). Era contexts:
`src/data/scenario1772.ts` + `src/data/scenario1856.ts`.

**Binding facts from the historian's brief — every mechanic below
respects these. Deviations are flagged in Open questions.**

- **F-FOUR-TRANSITIONS (historian §2 timeline table; PRIMARY FINDING).**
  The cabinet shape changes FOUR times within the AMPU scenario window,
  not two: **1789-04** (cabinet exists, 4 seats: State/Treasury/War/AG),
  **1798-04-30** (+ Navy → 5 seats), **1829-03-09** (+ PMG cabinet-rank →
  6 seats), **1849-03-08** (+ Interior → 7 seats). Each transition is
  primary-cited (state.gov, navy.mil, USPS, DOI). The user's vision listed
  only two; the historian doubled the count. PR5 ships all four.
- **F-1772-NO-CABINET-PRE-1789 (historian §2 + §10 + §11 Q1).** The 1772
  scenario opens 17 years BEFORE any cabinet exists. The Confederation had
  Foreign Affairs / War / Treasury Board / Postmaster officers under
  Congress (not President), modeled elsewhere in AMPU's
  `continentalCongress` and `revolutionaryWar` systems. 1772-scenario
  phase 2.3.1 must NOT run before year 1789. (The current seed at
  `scenario1772.ts:88` populating a 6-seat cabinet at year 1772 is an
  anachronism — PR5 corrects.)
- **F-AG-NO-DEPARTMENT-PRE-1870 (historian §1 AG; §10 anachronism row).**
  Until 1870-06-22 (DOJ creation), the AG was the President's lawyer and
  Supreme Court advocate, **not a department head** — "no provision for
  a Department of Justice or even for subsidiary officers or clerical
  staff." Admin skill is therefore not load-bearing for AG pre-1870; the
  `Justice` expertise dominates. PR5 down-weights admin in the AG
  scoring formula across both scenario windows (both end before 1870 in
  current scope; the per-seat formula is era-stable for this seat).
- **F-ADMIRAL-ANACHRONISTIC (historian §1 Admiral; "MOST BINDING IN THE
  BRIEF").** Before 1862-07-16, "Admiral" was not a US Navy rank —
  Congress created *rear admiral* for Farragut on that date. The 1772
  scenario window (1772-~1820) has zero admiral years. The 1856 scenario
  window has 6 anachronistic admiral years (1856-1862) and the rank only
  exists for ONE man (Farragut) until 1866. PR5 routes all senior-naval
  responsibility through the Sec of the Navy and drops the office.
- **F-PMG-SUB-CABINET-PRE-1829 (historian §1 PMG; §10 row).** The
  Postmaster General existed 1789-onward but reported up through Treasury
  and was NOT a cabinet officer until Jackson elevated Barry 1829-03-09.
  The 1772 scenario's entire window has no cabinet-rank PMG. The 1856
  scenario opens with PMG cabinet (Aaron Brown).
- **F-KEYADVISOR-NO-ANALOG (historian §8).** No historical analog before
  the 20th-century White House Chief of Staff (formally 1946). Jackson's
  Kitchen Cabinet was informal and its members held either real cabinet
  seats (Kendall got PMG 1835) or junior secretarial positions, never a
  "Key Advisor" title. PR5 drops `KeyAdvisor` from `OfficeType`.
- **F-EXPERTISE-MAPPINGS (historian §3 table).** Using AMPU's shipped
  `Expertise` union: State→**Foreign Affairs** (Trade secondary), Treasury
  →**Economics** (Trade / Business secondary), War→**Military**
  (Transportation / Welfare secondary), Navy→**Naval** (Military / Trade
  secondary), AG→**Justice** (Media secondary), PMG→**Transportation**
  (Media secondary), Interior→**Welfare** (Agriculture secondary). The
  historian rejects "Reform" / "Finance" / "Domestic" tags the original
  PR5 vision floated — they're not in the shipped Expertise union and the
  historian's mappings use only shipped tags.
- **F-CROSS-PARTY-RARE (historian §6).** Cross-party cabinet picks were
  historically rare exceptions (Washington proto-1789, Lincoln 1861) —
  the norm was same-party. Same-party-only for PR5 is historically
  defensible; the Lincoln team-of-rivals dynamic is PR6+ territory.
- **F-CONFIRMATION-RARE (historian §7).** Cabinet rejections through
  1869 totaled ~a dozen, clustered in three crises (Jackson-bank 1834,
  Tyler-Whig 1843-44, Johnson-impeachment 1867-68). Baseline confirmation
  was pro-forma. Auto-confirm for PR5 is historically defensible.

## Player experience

For the first time in AMPU, the cabinet **shape grows over the scenario**
the way history did: a 1772 player has no cabinet phase at all until the
Constitution year 1789, then watches 4 seats appear, then a Navy seat at
1798 as the Quasi-War buildup arrives. An 1856 player opens with all 7
historical Buchanan seats already seeded (Cobb at Treasury, Floyd at War,
Toucey at Navy, Thompson at Interior, Black at AG, Brown at PMG, Cass at
State) instead of the current 5-blank, 1-filled mess. **The seat
selection rewards the right expertise**: drafting an Economics-expertise
politician to Treasury, or a Justice-expertise to AG, gets them the seat
over a higher-admin generalist. **The AG seat specifically stops
favoring high-admin clerks** — pre-1870 the AG was a courtroom advocate
(Wirt's *McCulloch*, Black's Dred Scott opinions), so Justice expertise +
judicial skill carry the seat, not admin. **Cabinet quality reads in
governance**: a Sec of Treasury with Economics expertise gives a small
extra meter bump per turn in 2.5.1 Lingering, so building a competent
cabinet has at least one mechanical tell beyond cosmetic. The KeyAdvisor
slot — which never had a historical analog — quietly disappears. The
Admiral slot — which never existed pre-1862 — also disappears, with naval
responsibility routed through Sec of the Navy where it historically
belongs. **Era-conditional shape transitions hit mid-game** as years pass:
in a long 1772-scenario run, a sitting cabinet at year 1798 sees the
Navy seat appear and the next 2.3.1 fills it from the eligible pool. The
player sees the cabinet's silhouette change over the decades the way the
real cabinet did 1789→1849.

## User story

As a player running a scenario across multiple decades, I want the
**cabinet to grow seat-by-seat as history added them** (4 transitions:
1789 / 1798 / 1829 / 1849), the **selection to favor era-correct
expertise** (not just whoever has the highest admin), the **AG seat
specifically to reward Justice expertise rather than admin** (no DOJ
existed pre-1870), the **anachronistic seats (KeyAdvisor, Admiral) to be
gone**, and a **small governance bonus per occupied seat** so cabinet
quality reads in 2.5.1 Lingering — so my cabinet-building strategy
finally has shape and the historical periods finally look like
themselves.

## Scope of THIS spec (PR5 — XL)

PR5 covers:

- **(A)** `OfficeType` union surgery: ADD `SecretaryOfNavy`,
  `SecretaryOfInterior`; REMOVE `KeyAdvisor` and `Admiral`. Plus save
  migration to scrub legacy field references.
- **(B)** New `CABINET_SEATS_BY_YEAR(year): OfficeType[]` table /
  function. Four transitions: pre-1789 = `[]`, 1789-1797 = 4 seats,
  1798-1828 = 5 seats, 1829-1848 = 6 seats, 1849+ = 7 seats.
- **(C)** Revised `OFFICE_EXPERTISE` table with historian-locked mappings
  for the 7 cabinet seats (using shipped `Expertise` union only).
- **(D)** New `CABINET_SEAT_SCORING` table mapping each seat to its
  composite scoring formula. Per-seat overrides for AG (admin
  near-zero) and Treasury (admin retained higher than other seats).
- **(E)** `runPhase_2_3_1_Cabinet` rewrite: replace the hardcoded 6-seat
  loop with `CABINET_SEATS_BY_YEAR(snap.game.year)`; replace the pure-
  admin sort with the composite score from `CABINET_SEAT_SCORING`; keep
  same-party-only + age<75 + no-current-office constraints; preserve
  the existing F-DOUBLING admin grant + command grant + expertise grant
  side-effects, extended to the 2 new seats.
- **(F)** `runPhase_2_3_2_Military`: drop the Admiral block entirely;
  GeneralInChief logic unchanged.
- **(G)** Phase gating: `shouldRunPhase('2.3.1', year, game)` skips 2.3.1
  in the 1772 scenario before year 1789. The `independence`-era hard
  skip at `phases.ts:90` already covers most of this window; PR5 adds
  an additional `federalism`-era year check so any future scenario that
  reaches federalism before 1789 doesn't fire 2.3.1 either.
- **(H)** Scenario seed corrections:
  - `scenario1772.ts:88` — seed `cabinet: {}` (empty Partial) instead of
    6 named-null slots, AND remove the `PostmasterGeneral` slot. The
    cabinet doesn't exist at scenario open year 1772.
  - `scenario1856.ts:128-135` — seed all 7 active 1857 Buchanan seats
    (State / Treasury / War / Navy / Interior / AG / PMG) with the
    historical occupant IDs where the scenario already has those
    politicians, else `null`. Requires either matching seeded
    politicians by `currentOffice.type === '<seat>'` (as the State seed
    does today) or, where the seed politicians don't currently carry
    those offices, leaving the seat null for the 2.3.1 run to fill from
    the next eligible pick.
- **(I)** Modest cabinet effects on governance in 2.5.1 Lingering: per
  occupied cabinet seat, add a small fixed meter bonus (`+0.2` to a
  named meter) IF the seated Sec carries the seat's primary expertise.
  Hard cap: bonus is conditional on expertise present, not unconditional.
  Per-seat meter mapping defined inline below.
- **(J)** Save migration in the existing `repair()` flow
  (`GameContext.tsx:91`): scrub `KeyAdvisor` and `Admiral` from
  `cabinet[]`; scrub from any politician's `currentOffice.type`
  (politicians dangling on dropped seats get `currentOffice = null` so
  they re-enter the eligible pool).
- **(K)** Type / lookup-table cleanup for KeyAdvisor + Admiral
  references in `OFFICE_PRESTIGE` (`pv.ts:7-30`), `officeWeights`
  (`pv.ts:32-63`), `OFFICE_ADMIN_GRANT` (`types.ts:514-521`), and the
  `POSITIONS` array on `CabinetPage.tsx:5-14`. Add Navy + Interior to
  `OFFICE_PRESTIGE` + `officeWeights` + `OFFICE_ADMIN_GRANT` + the page
  list.

PR5 does **NOT** cover (PM enforces strictly):

- **Senate confirmation friction.** Auto-confirm for PR5. Per F-CONFIRMATION-RARE
  the historical baseline through 1869 was pro-forma confirmation; the
  Taney 1834 / Cushing 1843 / Stanbery 1868 clusters are PR6 territory.
- **Cross-party "team of rivals" picks.** Same-party-only for PR5 (the
  current code's behavior at `phaseRunners.ts:2095`). Lincoln 1861 is
  the canonical historical exception, but it's a 1-of-N event, not the
  baseline. PR6+ if at all.
- **Cabinet resignation / firing mechanic.** Buchanan's Cobb / Floyd /
  Thompson resignations and the Tyler 1841 Whig cabinet revolt are
  era-event territory. Out of PR5.
- **Modern-era (post-1900) cabinet positions.** Defense (1947 replaces
  War + Navy), HHS, HUD, Energy, Education etc. Neither scenario
  reaches 1900 reliably; defer to a future modern-scenario PR.
- **AG → DOJ 1870 transition (admin weight ramp-up).** PR5 ships the
  AG-pre-1870 admin-near-zero rule as a flat formula across both
  scenario windows because both end before 1870 in practice. If a save
  reaches 1870+, the AG seat keeps its low-admin scoring; the
  department-head admin uplift is a future PR.
- **Reworking the 2.5.1 Lingering base formula.** PR5 only ADDS small
  per-seat bonuses (Section I above). The existing drift /
  apply-meter wiring at `phaseRunners.ts:2952-2993` stays.
- **Anytime / era-event expertise routing.** Dred Scott routed through
  AG, John Brown raid through War, Civil War prosecution through
  War+Navy+Treasury+State — historian §9 flags these but they're
  PR6 Trait Pass B / governance work.
- **Cabinet `prevPositions` tracking on Politician** (the "this
  politician served as X" history). PR2b deferred this; PR5 also defers.
  Idempotency on the cabinet command/admin grants stays cap-bounded
  approximation (existing behavior).
- **Officer Corps / Cabinet patronage tracker.** Out of PR5.
- **Continental Congress / Confederation administration analogue**
  (Robert Morris as Superintendent of Finance 1781-84, etc.). Historian
  §11 Q1 floats this as in-scope for the `independence` era graph
  already; PR5 takes the simpler "no cabinet phase pre-1789" path
  (per Open Q5 below).
- **A "Commodore" or other senior-naval-uniformed-officer slot to
  replace Admiral.** Historian's "naval personalities" path is era-
  correct (John Paul Jones, Perry, Du Pont, Foote) but the *office*
  isn't AMPU-shaped today and would require a separate slot. PR5
  routes naval seniority through Sec of the Navy and shelves any
  uniformed-naval office for a future PR.
- **Mid-game seat-addition celebration UI or notification.** When 1798
  arrives in a long 1772 run and Navy appears, the next 2.3.1 fills
  it and the existing appointment-log line fires. No special UI.

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human
adjudicates at checkpoint; PM recommendation in parentheses). The
headline `[Open @ CP1]` items are Q1 (cabinet effects scope),
Q2 (composite scoring formula), Q4 (cross-party scope), and Q8
(1856 Interior expertise primary). Q3 (Admiral handling), Q5 (1772
pre-1789 handling), Q6 (Senate confirmation), and Q7 (save migration
shape) carry PM recommendations clearly.

### A. OfficeType union + cabinet field changes

1. **[Locked]** The `OfficeType` union at `src/types.ts:918-940` gains
   exactly two new members and loses exactly two:
   - **ADD** `SecretaryOfNavy` and `SecretaryOfInterior` (placed after
     `SecretaryOfWar` and `AttorneyGeneral` respectively for readable
     ordering matching the historical 1849 7-seat list).
   - **REMOVE** `KeyAdvisor` and `Admiral`.

2. **[Locked]** `GameState.cabinet` shape (`types.ts:1290`) stays
   `Partial<Record<OfficeType, string | null>>`. No structural change —
   the type-level removal of `KeyAdvisor` and `Admiral` flows through;
   the `Partial<Record<…>>` shape accepts the 2 new members. Old saves
   with `cabinet.KeyAdvisor` field set persist their JSON value through
   load but the field is unreachable at the type level after migration
   (Section J handles).

3. **[Locked]** All other `OfficeType` consumer sites are updated to
   the new union:
   - `src/pv.ts:7-30` `OFFICE_PRESTIGE`: remove `KeyAdvisor: 8` and
     `Admiral: 10`; add `SecretaryOfNavy: 10` (parity with War —
     historically the Navy seat ranked alongside War on the cabinet
     order-of-precedence) and `SecretaryOfInterior: 8` (parity with
     AG — Interior was a junior seat in 1849-1869).
   - `src/pv.ts:32-63` `officeWeights`: remove the `KeyAdvisor` and
     `Admiral` cases; add `SecretaryOfNavy` (sharing the
     SecretaryOfState/Treasury/War 2.5-admin weight bucket) and
     `SecretaryOfInterior` (same bucket).
   - `src/types.ts:507-509` `OFFICE_COMMAND_GRANT`: unchanged — only
     SoS grants command today. PM call: no Navy command grant (the
     seat is administrative; uniformed-naval-command is the
     deferred Commodore territory).
   - `src/types.ts:514-521` `OFFICE_ADMIN_GRANT`: remove `KeyAdvisor:
     1`; add `SecretaryOfNavy: 1` and `SecretaryOfInterior: 1`.
     `PostmasterGeneral: 1` retained — the seat is cabinet-rank
     1829+ and earns admin then.

4. **[Locked]** `src/pages/CabinetPage.tsx:5-14` `POSITIONS` array
   updated: remove `KeyAdvisor` and `Admiral`; add `SecretaryOfNavy`
   and `SecretaryOfInterior`. Page rendering remains the simple
   render-each-position pattern. PR5 does NOT add era-conditional
   hiding at the UI layer (a 1772 player at year 1785 will see the
   page render all 7 positions with `—` placeholders for seats that
   don't exist yet; the engine simply won't fill them via 2.3.1).
   UI era-conditional rendering is a follow-up polish PR.

### B. Era-conditional position list (CABINET_SEATS_BY_YEAR)

5. **[Locked]** A new pure function `CABINET_SEATS_BY_YEAR(year:
   number): OfficeType[]` is added to `src/types.ts` near
   `OFFICE_EXPERTISE`. The function returns the active cabinet seat
   list for a given year. The four transitions are locked per
   F-FOUR-TRANSITIONS:

   ```
   year < 1789       → []
   1789 <= year < 1798 → ['SecretaryOfState', 'SecretaryOfTreasury',
                           'SecretaryOfWar', 'AttorneyGeneral']
   1798 <= year < 1829 → above + ['SecretaryOfNavy']
   1829 <= year < 1849 → above + ['PostmasterGeneral']
   year >= 1849      → above + ['SecretaryOfInterior']
   ```

   Seat list order matches the historical order-of-precedence on the
   cabinet table: State, Treasury, War, Navy, AG, Interior, PMG (with
   the post-1829 PMG appended at the end because it's the latest
   addition in the cabinet-rank year sequence; architect may reorder
   to match `OFFICE_PRESTIGE` ordering if useful — locked at the
   *set*, not the *order*).

6. **[Locked]** The function is deterministic and pure — no `Math.random`,
   no snapshot read, no closure capture. A unit test (architect
   adds) covers boundary years 1788/1789, 1797/1798, 1828/1829,
   1848/1849, plus 1772 (returns `[]`), 1850 (returns 7 seats), 1900
   (still returns 7 seats — no further transitions in PR5 scope).

7. **[Locked]** `runPhase_2_3_1_Cabinet` reads `CABINET_SEATS_BY_YEAR
   (snap.game.year)` at the top of the function and iterates that list
   in place of the current hardcoded `positions` array
   (`phaseRunners.ts:2092`). If the function returns `[]`, the runner
   returns early — no log line, the phase simply no-ops (the
   `shouldRunPhase` gate in Section G is the primary skip path, but
   the runner stays defensively correct if called directly).

### C. OFFICE_EXPERTISE table revision

8. **[Locked]** `OFFICE_EXPERTISE` at `types.ts:944-951` is revised
   per F-EXPERTISE-MAPPINGS. The locked mapping:

   ```
   SecretaryOfState     → 'Foreign Affairs'    (unchanged from current)
   SecretaryOfTreasury  → 'Economics'          (unchanged)
   SecretaryOfWar       → 'Military'           (unchanged)
   SecretaryOfNavy      → 'Naval'              (NEW)
   AttorneyGeneral      → 'Justice'            (unchanged)
   SecretaryOfInterior  → 'Welfare'            (NEW — per Open Q8)
   PostmasterGeneral    → 'Transportation'     (NEW — was absent)
   GeneralInChief       → 'Military'           (unchanged)
   ```

   The `Admiral` row at `types.ts:950` is removed.
   `PostmasterGeneral: 'Transportation'` is a NEW addition; the
   current table omits PMG (no expertise was granted on confirmation).
   PR5 grants Transportation expertise to a cabinet-rank PMG
   (1829+); this fits the seat's actual era role (mail-routes-as-
   federal-transport).

9. **[Locked]** No secondary-expertise field is added in PR5. The
   historian's brief lists secondaries (State→Trade, Treasury→Trade/
   Business, etc.) but PR5's selection formula (Section D) uses
   primary-expertise as a boolean ("has primary or not"). Adding a
   secondary-expertise tier is a future PR. The current
   `OFFICE_EXPERTISE` shape (`Partial<Record<OfficeType, Expertise>>`,
   single-valued) is preserved.

### D. CABINET_SEAT_SCORING table + composite score formula

10. **[Open @ CP1 — recommend (b) symmetric admin+governing + (d)
    per-seat AG override]** A new tuning const `CABINET_SEAT_SCORING`
    is added to `src/types.ts` (placed near `OFFICE_EXPERTISE`,
    `as const satisfies …` like its neighbors). It holds per-seat
    weight tuples used by 2.3.1 selection to replace the pure-admin
    sort (`phaseRunners.ts:2096`).

    The PM-recommended formula, **per-seat**:

    ```
    score(politician, seat) =
        admin_weight[seat]      * politician.skills.admin
      + governing_weight[seat]  * politician.skills.governing
      + secondary_weight[seat]  * politician.skills[seat.secondarySkill]
      + (hasPrimaryExpertise(politician, seat) ? expertise_bonus : 0)
    ```

    Where:

    ```
    expertise_bonus = 5  (lockstep across all seats)

    Per-seat weights:
      SecretaryOfState      admin=2  governing=1  secondary=legislative*1
      SecretaryOfTreasury   admin=2  governing=1  secondary=none(0)
      SecretaryOfWar        admin=1  governing=1  secondary=military*2
      SecretaryOfNavy       admin=1  governing=1  secondary=military*2
      AttorneyGeneral       admin=0  governing=0  secondary=judicial*2     ← F-AG-NO-DEPARTMENT-PRE-1870
      SecretaryOfInterior   admin=2  governing=1  secondary=none(0)
      PostmasterGeneral     admin=1  governing=2  secondary=backroom*1     ← patronage seat
    ```

    Rationale:
    - **State**: legislative weight because treaty ratification is a
      Senate floor management job (JQA on Adams-Onís; Webster losing
      the 1850s on the Senate floor — historian §4).
    - **Treasury**: highest admin weight — Hamilton's Treasury was the
      most actually-administered department of the founding era.
    - **War / Navy**: military as a doubled secondary — the seat
      benefits from a strategist-administrator (Calhoun, Davis,
      Stanton, Stoddert, Welles all rated by historian §1).
    - **AG**: admin AND governing ZERO; judicial doubled. Per
      F-AG-NO-DEPARTMENT-PRE-1870, the seat is a one-person legal
      office; the courtroom signal (Wirt, Black, Bates) carries it.
      An AG with no Justice expertise and only a moderate judicial
      skill becomes a poor pick — intended.
    - **Interior**: standard admin+governing because the seat was a
      real department from day 1 (1849, four bureaus inherited from
      Treasury / State / War).
    - **PMG**: governing-weighted higher than admin because the seat
      was a patronage-network seat (Kendall as Jackson's Kitchen
      Cabinet architect; historian §1 PMG); backroom skill as
      tiebreaker on the patronage flow.

    Alternatives the human may lock at CP1:
    - **(a)** Uniform formula: `score = 2*admin + 1*governing + 5*hasPrimary`.
      Simpler. Misses the AG / War / PMG texture.
    - **(c)** Era-conditional weights (`pre-1820` admin=1, `1820+`
      admin=2 etc.) per historian §4 federal-capacity ramp. PM
      considered: defer to future tuning PR. PR5 ships per-seat
      static weights; era-scaling is a sub-mechanic.

    PM rec: **(b)+(d) above** — per-seat formula with AG override.

11. **[Locked]** The selection pool stays the current filter
    (`phaseRunners.ts:2095`): `p.partyId === partyId && !p.currentOffice
    && p.age < 75`. No new age band; no expertise gate (a candidate
    without expertise scores lower but is still eligible — the seat
    will be filled even by an imperfect pick).

12. **[Locked]** Tie-break: when two candidates score equally, the
    higher PV wins (architect compares `pvCache` desc as secondary
    sort key). If still tied, lower-id wins for determinism (no
    Math.random; the engine RNG is reserved for explicit rolls).

13. **[Locked]** The log line on confirmation gains the seat's primary
    expertise marker when present, so the player can read what's
    happening at the cabinet selection layer:
    - With primary expertise: `"<name> confirmed as <Seat> (<Expertise>
      specialist)."`
    - Without primary expertise: `"<name> confirmed as <Seat>."`
    (current log text, unchanged).

### E. AG pre-1870 special handling

14. **[Locked]** Section D's per-seat scoring (AC #10) already encodes
    the F-AG-NO-DEPARTMENT-PRE-1870 rule: admin=0, governing=0,
    judicial=2, expertise_bonus=5. No additional era branch is
    needed — both AMPU scenarios end well before 1870 in normal play,
    so the AG seat keeps its low-admin formula throughout. (The 1856
    scenario CAN reach 1870 in a long run; historian §11 Q6 flags
    the eventual DOJ transition. PR5 defers — the AG keeps
    pre-1870 weights even into 1870+ play; a future PR can ramp
    admin in.)

15. **[Locked]** The cabinet-confirmation F-DOUBLING admin grant
    (`ABILITY_EARN_RULES.cabinetConfirmAdmin` at `types.ts:494-498`)
    is NOT changed for AG. The grant remains base=1 with Egghead /
    Efficient multipliers. PR5's selection formula doesn't pick an
    admin-heavy candidate for AG; if a high-admin politician
    nonetheless lands there (e.g. by other paths) the confirmation
    grant still fires. PM call: keep the grant; it's symmetric with
    other seats, and the gameplay leverage is in *who gets the
    seat*, not in the post-confirmation grant.

### F. runPhase_2_3_1_Cabinet rewrite

16. **[Locked]** `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2088-2134`)
    is rewritten on top of the new tables. Required behavior:
    - **a.** Bail early if `snap.game.presidentId == null`
      (unchanged).
    - **b.** Compute `seats = CABINET_SEATS_BY_YEAR(snap.game.year)`.
      Return early if empty.
    - **c.** For each `seat` in `seats` not already filled
      (`snap.game.cabinet[seat] != null`):
      - Build the eligible pool with current filter (AC #11).
      - Score each candidate via `CABINET_SEAT_SCORING[seat]` (AC #10).
      - Pick the top (with tie-break per AC #12).
      - Assign: `snap.game.cabinet[seat] = pick.id`,
        `pick.currentOffice = { type: seat }`.
      - Log the confirmation (AC #13).
      - Fire the existing F-DOUBLING admin grant (the current code
        at `phaseRunners.ts:2107-2117`), now extended to Navy +
        Interior via `OFFICE_ADMIN_GRANT` updates (AC #3).
      - Fire the SoS command grant (unchanged).
      - Fire the expertise grant (the current code at `phaseRunners.ts:
        2128-2131`), now using the revised `OFFICE_EXPERTISE`.

17. **[Locked]** Same-party-only constraint is retained per F-CROSS-
    PARTY-RARE and per Open Q4 (PM rec: stay same-party). If Open Q4
    is locked to cross-party at CP1, the filter at AC #11 relaxes.

18. **[Locked]** No `pendingCabinetVacancies` field touch
    (`types.ts:1287`). PR5 fills vacancies inside 2.3.1 only. The
    `pendingCabinetVacancies` slot is used elsewhere for death/
    retirement triggers; PR5 doesn't reshape that flow.

### G. runPhase_2_3_2_Military: drop Admiral, GeneralInChief untouched

19. **[Locked]** Per F-ADMIRAL-ANACHRONISTIC, the Admiral block at
    `phaseRunners.ts:2165-2181` is **deleted entirely.** The naval
    skill path that fed it (`p.expertise.includes('Naval')`) is
    preserved at the candidate level — Naval expertise is granted by
    the new `SecretaryOfNavy` seat via AC #8 — but the Admiral
    selection branch no longer exists.

20. **[Locked]** `runPhase_2_3_2_Military` GeneralInChief block
    (`phaseRunners.ts:2148-2164`) is untouched. The function continues
    to run in both scenarios. Era-gating GeneralInChief by 1821
    (the historian's first-Commanding-General year, per §1
    GeneralInChief) is **NOT** done in PR5 — historian flagged this
    as binding for 1772 era, but the existing AMPU code uses the
    seat across the entire 1772-1856 window. PR5 takes a deliberate
    deviation here (see Open questions § "Deviation from historian").

21. **[Locked]** `OFFICE_PRESTIGE.Admiral` and `officeWeights`'
    `Admiral` case (`pv.ts:19, 41`) are removed alongside the office
    drop in AC #3. A politician carrying `currentOffice.type ===
    'Admiral'` on save load gets nulled in Section J migration; PV
    recomputation post-migration places them on the default 1-1-1-…
    weight bucket (`pv.ts:60-62`) until they take a new office.

### H. Scenario data: scenario1772.ts + scenario1856.ts seed corrections

22. **[Locked]** `src/data/scenario1772.ts:88` cabinet seed becomes:
    ```
    cabinet: {},
    ```
    The 6-seat seed (`SecretaryOfState: null, SecretaryOfTreasury:
    null, SecretaryOfWar: null, AttorneyGeneral: null,
    PostmasterGeneral: null, KeyAdvisor: null`) is removed entirely.
    Per F-1772-NO-CABINET-PRE-1789, the 1772 scenario opens with no
    cabinet existing; the empty Partial expresses this faithfully.
    When year 1789 arrives in long play, 2.3.1 (now reachable per
    Section G phase gating) populates the 4 seats from
    `CABINET_SEATS_BY_YEAR(1789)`.

23. **[Locked]** `src/data/scenario1856.ts:128-135` cabinet seed
    becomes the full 7-seat 1857 Buchanan baseline. The
    `KeyAdvisor: null` line is removed; new lines for `SecretaryOfNavy
    : null`, `SecretaryOfInterior: null` are added; the existing
    `PostmasterGeneral: null` line stays. The result:

    ```
    const cabinet = {
      SecretaryOfState: politicians.find((p) =>
        p.currentOffice?.type === 'SecretaryOfState')?.id ?? null,
      SecretaryOfTreasury: null,
      SecretaryOfWar: null,
      SecretaryOfNavy: null,
      AttorneyGeneral: null,
      SecretaryOfInterior: null,
      PostmasterGeneral: null,
    } as GameState['cabinet'];
    ```

    The first 2.3.1 run in the 1856 scenario fills the 6 nulls with
    the highest-scoring candidates from the player and CPU factions.

24. **[Locked]** PR5 does **NOT** hand-author Buchanan-era cabinet
    seeds in `politicians1856.ts`. The historian's brief lists the
    actual occupants (Cobb at Treasury, Floyd at War, Toucey at
    Navy, Thompson at Interior, Black at AG, Brown at PMG) and a
    future dataset-regen PR (the seedDataset.mjs pipeline per
    CLAUDE.md) can attach `currentOffice` to those figures. PR5's
    surface is the engine + types + seed shape; the named-occupant
    attribution is dataset work.

25. **[Locked]** Existing scenario1772.ts seed politicians (if any)
    carrying `currentOffice.type === 'KeyAdvisor'` or `'Admiral'`
    are caught by the Section J save migration on next load. PR5
    does NOT pre-emptively scrub the source data — the 1772 seed at
    year 1772 has no occupied cabinet seats today (all null), so
    this concern is theoretical for fresh starts.

### I. Modest cabinet effects on governance (per Open Q1 resolution)

26. **[Open @ CP1 — recommend (c) conditional bonus only]** PR5 ships
    a small per-seat meter bonus in `runPhase_2_5_1_Lingering`
    (`phaseRunners.ts:2952-2993`) that fires **only when** the seated
    Secretary carries the seat's primary expertise. The bonus is
    fixed at `+0.2` per qualifying seat per turn, applied additively
    to the named meter via the existing `apply()` helper. Mapping:

    ```
    Seat                    Bonus meter   Notes
    SecretaryOfState        domestic      +0.2 (foreign-policy → public mood)
    SecretaryOfTreasury     economic      +0.2 (Hamilton/Gallatin/Chase)
    SecretaryOfWar          military      +0.2 (Calhoun/Davis/Stanton)
    SecretaryOfNavy         military      +0.2 (Stoddert/Welles)
    AttorneyGeneral         honest        +0.2 (Wirt-style courtroom)
    SecretaryOfInterior     quality       +0.2 (settlement + infra + patents)
    PostmasterGeneral       quality       +0.2 (mail-as-infrastructure)
    ```

    Total cap when all 7 expertise-matched seats fill: `+1.4` total
    per turn across 4 distinct meters (domestic, economic, military
    [War + Navy stack], honest, quality [Interior + PMG stack]). The
    existing drift formula at `phaseRunners.ts:2958-2965` runs first;
    these bonuses layer on top via the same `apply()` helper. Bonuses
    are skipped if the seat is vacant OR if the seated Sec lacks the
    primary expertise.

    Rationale: this is "scoping option (c) — conditional bonus only"
    per the user's PR5 brief. Option (a) "every occupied seat
    contributes" was rejected because a cabinet of high-admin
    generalists (current engine's default pick) would automatically
    earn meter swings that don't reflect cabinet *quality* —
    breaking the playtest goal of "good cabinet visibly helps". Option
    (b) "PR5 selection-only, defer effects" was rejected because the
    user's vision explicitly wanted at least one visible governance
    effect tied to cabinet quality; selection-only PR5 reads as
    cosmetic until PR6 lands.

    Alternatives the human may lock at CP1:
    - **(a)** Every occupied seat contributes `+0.1` to the named
      meter, expertise-gated bonus contributes additional `+0.1`
      (so total `+0.2` if expertise present, `+0.1` if not).
    - **(b)** No meter effects in PR5; selection-only; defer to PR6.

    PM rec: **(c) above** — expertise-gated bonus only, `+0.2` per
    qualifying seat. Cleanest signal-to-noise on the playtest goal.

27. **[Locked]** The cabinet meter bonus log line is suppressed for
    `+0.2` magnitude (per the existing `Math.abs(delta) > 0.01`
    threshold at `phaseRunners.ts:2971` — `0.2` passes the threshold;
    the line will fire). The architect can choose to label the
    bonus-source in the log text ("revenue: 1.0 -> 1.2 (+0.2 cabinet
    bonus)" vs the base drift line) or to let the bonus accumulate
    into the single per-turn drift line. PM call: **single combined
    line** for log-noise reasons; the player sees `economic: 0.5 ->
    0.9 (+0.4)` and the breakdown lives in a tooltip / future
    inspector PR.

28. **[Locked]** PR5 does NOT add bonuses for seats that don't
    historically map cleanly to existing AMPU meters: there's no
    meter for "patent activity" or "Indian affairs" or "diplomatic
    standing" specifically; the table above approximates Interior →
    `quality` and PMG → `quality` (both contribute to infrastructure-
    like outcomes). If playtest reveals these meter mappings feel
    off, architect can rebalance in a tuning pass without spec
    rework.

### J. Save migration: KeyAdvisor + Admiral scrub

29. **[Open @ CP1 — recommend (b) explicit scrub in repair()]** Save
    migration logic is added to the existing `repair()` flow in
    `src/state/GameContext.tsx:91-194`. Required behavior:
    - **a.** If `s.game.cabinet.KeyAdvisor` exists (as a saved JSON
      field even though the type union no longer includes it), call
      `delete s.game.cabinet.KeyAdvisor` and set `dirty = true`.
    - **b.** If `s.game.cabinet.Admiral` exists, same: delete + dirty.
    - **c.** For every politician with `p.currentOffice?.type ===
      'KeyAdvisor'`, set `p.currentOffice = null` and `dirty = true`.
      (The politician returns to the eligible cabinet pool and
      becomes pickable in the next 2.3.1.)
    - **d.** Same for `p.currentOffice?.type === 'Admiral'`.
    - **e.** A migration log line fires once per `dirty` save:
      `[migration] Dropped legacy KeyAdvisor / Admiral fields from
      cabinet and politician currentOffice.` Architect picks the log
      surface (console.log or a `_migrationLog` array on the snapshot
      — PR5 takes console.log for simplicity).

    Implementation notes:
    - Since TypeScript no longer recognizes `'KeyAdvisor'` or
      `'Admiral'` as valid `OfficeType` literals, the cleanup code
      accesses these via string keys cast through `as unknown as`
      or via a per-politician `(p.currentOffice as
      { type: string } | null)?.type === 'KeyAdvisor'` check.
      Architect picks the idiom; the existing `repair()` already has
      precedent for similar legacy migrations (the LEGACY_EXPERTISE
      block at `GameContext.tsx:173-191` does string-key migration).

    Alternatives the human may lock at CP1:
    - **(a)** Silently ignore extra cabinet keys (no scrub). The
      `Partial<Record>` shape accepts unknown keys at runtime
      without complaint, so the JSON persists indefinitely. A
      politician with `currentOffice.type = 'KeyAdvisor'` dangles —
      PV recomputation falls through to the default 1-1-1-… weight
      bucket so no crash, but the politician is "stuck" in a phantom
      office and never re-enters the eligible pool. PM rejected as
      a slow-leak save-corruption.
    - **(c)** Type-level cast — keep the runtime data, just no
      longer expose the type. Same risk profile as (a). PM rejected.

    PM rec: **(b) explicit scrub in repair()**.

30. **[Locked]** PR5 does NOT migrate `OFFICE_PRESTIGE.KeyAdvisor` /
    `Admiral` references in saved politician PV caches. The PV cache
    will recompute on the next phase that touches `refreshPv` (most
    phases call it indirectly). A migrated politician whose
    `pvCache` was computed under the old prestige table will have a
    minor PV staleness until the next refresh — acceptable as
    eventual consistency.

### K. Cross-cutting guardrails (assert nothing leaked in)

31. **[Locked]** PR5 makes **no change to the PV formula's flat trait
    weights** (`pv.ts:65-87`). The 7 cabinet seats continue to
    contribute via `OFFICE_PRESTIGE` only. Cabinet quality reads in
    elections via the existing PV → vote pipeline; no new PV
    special case.

32. **[Locked]** PR5 makes **no change to election arithmetic** in
    `calcStateVote`, primaries, or faction-leader scoring. The new
    Section I per-seat meter bonuses are confined to 2.5.1
    Lingering. Election PRs (PR4a / PR4b) continue to operate on PV
    + per-context trait swings.

33. **[Locked]** PR5 adds **no new RNG path**. All selection scoring
    is deterministic (skills + expertise check + tie-break). The
    cabinet 2.5.1 meter bonuses are deterministic (`+0.2` is a
    constant). Per CLAUDE.md "engine code is pure over the snapshot",
    no `Math.random`.

34. **[Locked]** `npm run build` (tsc + vite) passes and `npm run
    lint` (tsc `--noEmit`) is clean. The `OfficeType` union surgery
    and the `OFFICE_EXPERTISE` / `OFFICE_PRESTIGE` / `OFFICE_ADMIN_
    GRANT` / `officeWeights` / `POSITIONS` updates land in one
    coherent compile. The `as const satisfies` exhaustiveness on
    constants involving `OfficeType` is preserved.

35. **[Locked]** Save loadability: old saves load via the Section J
    migration. After load:
    - Politicians with no cabinet seat behave unchanged.
    - Politicians who held KeyAdvisor / Admiral pre-migration are
      stripped to `currentOffice = null` and re-enter the next
      2.3.1 eligible pool.
    - The cabinet shape grows organically on the next 2.3.1 / 2.3.2
      runs.

36. **[Locked]** PR5 keeps the `pendingCabinetVacancies` field
    untouched. The death/retirement vacancy pipeline that uses this
    field (`types.ts:1287`) continues to function. A vacancy that
    arises mid-game in a 1789+ AMPU year populates this list per
    existing code; 2.3.1 reads from it as before. The era-conditional
    `CABINET_SEATS_BY_YEAR` gating means a vacancy on a seat that
    doesn't yet exist in-year (e.g. Navy in year 1795) would never
    arise in the first place — the seat literally isn't in the
    cabinet.

37. **[Locked]** No new field is added to `Politician` or
    `GameState`. The `prevPositions` history tracking that PR2b
    deferred remains deferred. The cabinet's current-occupant data
    lives entirely in `game.cabinet` + `politician.currentOffice` as
    today.

## Edge cases

- **Vacancy mid-game in a 1789+ AMPU run.** The
  `pendingCabinetVacancies` pipeline is unchanged. When a Sec dies
  or retires, the existing death-handling code adds the office to
  the pending list; the next 2.3.1 reads `CABINET_SEATS_BY_YEAR`
  (which still contains that seat) and re-fills. No-op for the
  era-conditional layer.

- **1798 mid-game transition (1772 scenario).** A long 1772-scenario
  run reaches year 1798. The previous 2.3.1 ran in 1797 with
  `CABINET_SEATS_BY_YEAR(1797) = [State, Treasury, War, AG]`. The
  1798 turn's 2.3.1 reads `CABINET_SEATS_BY_YEAR(1798) = [State,
  Treasury, War, Navy, AG]`. The 4 existing seats are
  `snap.game.cabinet[seat] != null` so are skipped; the new `Navy`
  seat is filled from the eligible pool. The seated Navy Sec gets
  expertise, admin, and (per Section I) the `+0.2 military` bonus
  if they carry Naval expertise. **No special UI / log handling
  for the seat-appearing event in PR5** — a deferred polish.

- **1829 mid-game transition.** Same shape as 1798: PMG goes from
  not-in-cabinet to cabinet-rank. PR5 fills the seat at the next
  2.3.1; the previous turn's PMG (who held the sub-cabinet office)
  is NOT auto-promoted — they have to win the seat through the
  new selection formula like any other candidate. Architect note:
  if a politician carries `currentOffice.type === 'PostmasterGeneral'`
  in 1828 (which is pre-cabinet-rank for that seat per
  F-PMG-SUB-CABINET-PRE-1829), they'd be in `currentOffice` already
  and would be filtered out of the eligible pool. **Possible edge
  case for architect**: if the engine currently seats PMG as a
  cabinet office pre-1829, a long 1772-run could have a PMG
  politician stuck. Resolution: the new selection treats this
  politician as already-occupying the seat (`snap.game.cabinet.
  PostmasterGeneral` would be set from a pre-1829 2.3.1 run UNDER
  the new gating, which is impossible because pre-1829
  `CABINET_SEATS_BY_YEAR` doesn't list PMG, so 2.3.1 wouldn't fill
  it). Net: the 1829 transition simply fills an empty PMG slot.

- **1849 mid-game transition.** Interior appears. Same shape as
  1798 / 1829 — next 2.3.1 fills the new seat from the eligible
  pool.

- **AG carrier in long 1856 run reaches 1870.** Per AC #14, PR5
  leaves the AG admin-near-zero formula in place. A future PR can
  ramp admin in. No mid-game seat *changes*; the seat continues to
  fill at the existing low-admin score.

- **Sec dies the same turn they're confirmed.** Existing death
  handler runs in 2.4.1 (Deaths), AFTER 2.3.1 (Cabinet). The Sec
  fills the seat in 2.3.1, dies in 2.4.1, the vacancy is added to
  `pendingCabinetVacancies`, the NEXT turn's 2.3.1 re-fills. PR5
  doesn't disturb this flow.

- **No eligible candidate for a seat.** Existing behavior (the
  `pick` is `undefined`, no log line, no assignment) is retained.
  The seat stays `null` and re-fills next turn. The `+0.2` meter
  bonus for that seat is skipped (Section I conditional on
  occupant + expertise).

- **Cross-party scenario where the player's faction has no
  Justice-expertise candidate for AG.** Per AC #11, the seat fills
  with the highest-scoring same-party candidate even without
  expertise. The seat gets a politician with low admin (per AG
  formula), maybe some judicial skill. The Section I `+0.2 honest`
  bonus is skipped. Cabinet quality reads as visibly weak; player
  feels the cost.

- **A politician at age 75 holding a cabinet seat continues
  there.** The age <75 filter (`phaseRunners.ts:2095`) gates ENTRY
  to the pool, not retention. A 76-year-old Sec keeps their seat
  until natural retirement / death (the 2.4.1 retirement code
  handles age-out separately).

- **Save loaded post-PR5 with a politician carrying
  `currentOffice.type === 'KeyAdvisor'`.** Section J migration
  scrubs to `currentOffice = null`. The politician re-enters the
  eligible pool. Their PV cache is stale on first read (the
  prestige table no longer includes `KeyAdvisor`) but `refreshPv`
  recomputes at the next phase boundary.

- **Save loaded post-PR5 with `snap.game.cabinet.Admiral = <id>`.**
  Section J migration scrubs the field. The politician (per the
  preceding edge case) loses their `currentOffice`. No cabinet
  seat seats them. No drama; clean state.

- **1856 scenario opens with State pre-seeded per
  `politicians1856.ts`.** The current State seed at
  `scenario1856.ts:128-129` is preserved (the find-by-office
  pattern), but the other 6 seats are null at scenario open. The
  first 2.3.1 run fills them. PR5 does NOT pre-populate the other
  6 seats with historical occupants — that's dataset work.

- **Mid-game era transition (`federalism` → `nationalism`) in 1772
  scenario.** AMPU's 1772 scenario currently runs through
  `independence` (pre-1789) and `federalism` (post-1789). The
  era-based phase gating at `phases.ts:80-135` already disables
  2.3.1 in `independence`. PR5 adds the year-1789 gate as a
  **second** check inside `federalism` so a scenario that
  somehow advances to federalism before 1789 (edge case) still
  skips 2.3.1 until 1789 lands. This is belt-and-suspenders.

- **`CABINET_SEATS_BY_YEAR(year)` called with year < 1772 or year
  > 1900.** The function returns `[]` for year < 1789 and the
  full 7-seat list for year >= 1849. No upper bound on year in
  PR5; the 1947 Defense-replaces-War transition is out of scope
  per "Out of scope" list. A 1950+ AMPU year would still get the
  1849 7-seat list — historically incorrect but stable for PR5.

- **`runPhase_2_3_1_Cabinet` called when `presidentId == null`.**
  Existing early-bail at `phaseRunners.ts:2089-2090` preserves.

- **The Section I cabinet meter bonus stacking interacts with the
  existing drift baseline.** The drift baseline at
  `phaseRunners.ts:2976-2982` already reads `treasury?.skills.admin`,
  `war?.skills.military`, `state?.skills.admin`, `ag?.skills.admin`.
  These reads continue. PR5 adds the conditional `+0.2` per
  qualifying seat. A Treasury Sec at admin=5 with Economics
  expertise contributes the existing `apply('revenue', drift(5))`
  (which is `+0.5` per the drift table) PLUS the new `+0.2` to
  `economic` — these are independent meters; no double-count.

- **Existing `ag?.skills.admin` read in drift formula
  (`phaseRunners.ts:2979-2980`).** Per AC #14, PR5's selection
  formula picks low-admin AGs. The 2.5.1 drift baseline still
  reads `ag?.skills.admin` for `domestic` and `honest` drift.
  This means a low-admin AG (the new norm) causes negative drift
  on those meters. **Intended**: the AG seat IS a one-person
  office pre-1870; meter drift on `domestic` and `honest` from
  an under-administered AG is the historical signal. Architect
  may revisit at CP2 if playtest feels off, but PR5 ships the
  formula as-is.

## Out of scope

Named explicitly so the architect doesn't pull adjacent work in:

- **Senate confirmation rejection mechanic** (Taney 1834 / Cushing
  1843 / Stanbery 1868). Auto-confirm only in PR5. PR6+ territory.
- **Cross-party "team of rivals"**. Same-party only. Lincoln 1861
  is a single-event exception, not a baseline mechanic. PR6+.
- **Cabinet resignation / firing**. Buchanan's Cobb / Floyd /
  Thompson, Tyler's Whig revolt. Era-event PR territory.
- **Modern-era cabinet seats** (Defense replaces War+Navy 1947,
  HHS, HUD, Energy, Education, DHS 2002). Out of AMPU's two
  current scenarios; future modern-scenario PR.
- **DOJ-1870 AG admin-ramp-up**. AC #14 ships AG-pre-1870 flat
  across both windows; future PR can branch.
- **Anytime / era-event expertise routing.** Dred Scott → AG,
  John Brown → War, Trent Affair → State, Civil War prosecution
  → War+Navy+Treasury+State. Historian §9 listed these as PR6
  Trait Pass B / governance work.
- **Era-conditional `OFFICE_EXPERTISE` mappings.** PR5 ships a
  single mapping per seat. If the State seat's effective
  expertise emphasis changes between `federalism` (Foreign
  Affairs dominant) and `nationalism` (Trade / commercial
  expansion emphasis), a future PR can era-branch the table.
- **Continental Congress / Confederation administration analogue**
  (Robert Morris as Superintendent of Finance 1781-84, Marine
  Committee, Board of War). Historian §11 Q1 floats this; PR5
  takes the simpler "no cabinet phase pre-1789" path. The
  existing AMPU `continentalCongress` and `revolutionaryWar`
  systems already cover the Confederation administrative shape;
  PR5 doesn't expand them.
- **A "Commodore" or other uniformed-naval-officer slot to
  replace Admiral.** Naval personalities (John Paul Jones, Perry,
  Du Pont, Foote) are era-correct as captains-with-commodore-
  courtesy, but the office shape requires a new slot the engine
  doesn't have. Defer.
- **Mid-game seat-addition celebration UI / notification.** When
  1798 arrives and Navy appears, the next 2.3.1 fills it with the
  existing appointment-log line. No banner / popup / animation.
  Polish PR.
- **`CabinetPage.tsx` era-conditional rendering.** PR5 renders all
  7 positions with `—` placeholders for seats that don't yet
  exist in-era. Era-aware hide is polish.
- **`prevPositions` tracking on Politician.** Idempotency on the
  cabinet command / admin grants stays cap-bounded approximation
  per existing comment at `phaseRunners.ts:2120-2122`.
- **Officer Corps / Cabinet patronage tracker.** Aside from PMG's
  governing weight reflecting patronage, no patronage tally lands.
- **Secondary expertise table.** PR5's selection formula reads
  primary expertise as boolean. A future PR can layer secondary
  (State→Trade, PMG→Media, etc.) for a smaller bonus.
- **Dataset regen to attach `currentOffice` to historical Buchanan-
  cabinet figures** (Cobb at Treasury, Floyd at War, Toucey at
  Navy, Thompson at Interior, Black at AG, Brown at PMG). PR5
  leaves the slots null at 1856 open; the first 2.3.1 fills them.
  Historian-attributed dataset work is a future regen PR.
- **Year-gated GeneralInChief (1821+)**. Per historian §1
  GeneralInChief, the office formally exists 1821-1903. PR5
  deliberately deviates and keeps GeneralInChief available across
  both scenarios as the existing code does. See "Open questions"
  for the explicit justification.
- **Frontend "cabinet builder" interactive UI** (player picks who
  goes where instead of auto-selection). PR5 keeps auto-selection
  for both player and CPU factions; an interactive cabinet builder
  is a future UX PR.

## Open questions / assumptions

Decision-first ordering. CP1 (human/PM locks at checkpoint) are
the headline items; CP2 (architect-deferable) are listed after.

### CP1 items

1. **(CP1 — Cabinet effects on governance scope per AC #26.)** PR5
   ships **(c) conditional-bonus-only**: per-seat `+0.2` meter
   bonus IFF Sec has primary expertise. PM rec is **(c)** — gives
   cabinet quality a visible gameplay effect without breaking the
   PR5 selection-formula's gating logic. Alternatives:
   - (a) Per-seat `+0.2` on every occupied seat (no expertise
     gate). Bigger meter swings; rewards filling more than
     filling-well. PM rejected.
   - (b) PR5 selection-only, no meter effects, defer all cabinet-
     quality leverage to PR6. Cleanest scope but reads cosmetic.
     PM rejected per playtest goal.

2. **(CP1 — Composite scoring formula per AC #10.)** PR5 ships
   **(b)+(d)**: per-seat formula with AG override (admin=0,
   judicial=2). PM rec is **(b)+(d)**. Alternatives:
   - (a) Uniform formula `2*admin + 1*governing + 5*hasPrimary`.
     Simpler. Misses AG / War / PMG texture.
   - (c) Era-conditional weights. Defer to future tuning PR.

3. **(CP1 — Admiral handling per AC #19.)** PR5 ships **(a) drop
   entirely** from `OfficeType` + `runPhase_2_3_2_Military`. PM
   rec is **(a)**. Alternatives:
   - (b) Gate to year >= 1862; keep the union member. Cleaner if
     a future scenario reaches 1862+ regularly. PM call: drop now,
     re-add cleanly if/when a 1862-scenario lands.
   - (c) Rename to Commodore + keep across both eras. Anti-
     historian. Rejected.

4. **(CP1 — Cross-party appointments per AC #17.)** PR5 ships
   **(a) same-party only** (current code behavior). PM rec is
   **(a)** for PR5 scope. Alternatives:
   - (b) Allow rare cross-party with admin score penalty (-3) +
     probabilistic gate. Lincoln-1861 archetype. PR6 territory.
   - (c) Same-party + manual UI override. UI work out of PR5.

5. **(CP1 — 1772 pre-1789 cabinet handling per Section G.)** PR5
   ships **(a) phase 2.3.1 skips entirely** in 1772 scenario before
   year 1789. PM rec is **(a)**. Alternatives:
   - (b) Empty cabinet with one-time "No cabinet established" log
     line. Adds nothing; player sees no cabinet on the page.
     Rejected.
   - (c) Continental Congress / Confederation administration
     placeholder entries (Foreign Affairs Committee, Board of
     Treasury, Board of War). Historian-correct but expands scope
     into the `independence`-era graph systems. PR5 takes the
     simpler path; future PR can re-visit.

6. **(CP1 — Senate confirmation friction per Out of scope list.)**
   PR5 ships **(a) auto-confirm** (current behavior). PM rec is
   **(a)** for PR5 scope. Alternatives:
   - (b) Small flat probabilistic rejection (5%) with retry.
     PR6 governance work.
   - (c) Full party-line counting mechanic. Far out of scope.

7. **(CP1 — Save migration shape per AC #29.)** PR5 ships **(b)
   explicit scrub in `repair()`**. PM rec is **(b)**. Alternatives:
   - (a) Silently ignore extra keys. Politicians stuck with
     phantom `currentOffice` dangling. Slow-leak corruption.
     Rejected.
   - (c) Type-level cast — same risk as (a). Rejected.

8. **(CP1 — 1856 Interior expertise primary per AC #8.)** PR5
   ships **Welfare** as the Interior primary expertise per
   historian §3 mapping (Welfare = BIA + pensions). PM rec is
   **Welfare** because the 1849-1869 Interior seat was
   dominantly Indian Affairs + pensions + GLO (land sales), and
   Welfare is the closest shipped Expertise tag covering the
   Indian-affairs portion. Alternative:
   - (b) **Agriculture** as primary (land-office / settler-policy
     emphasis). Historian's brief explicitly lists both as
     candidates and notes "the seat fundamentally combines land
     policy (Agriculture closest), Indian affairs (Welfare
     closest), and patents (Science/Technology closest)." Either
     is defensible. PM picked Welfare for the Indian-affairs +
     pensions readiness; Agriculture is the alternative the human
     can lock at CP1 if the western-land-sales reading
     dominates the spec's playtest tuning.

### CP2 items (architect-deferable)

9. **(CP2-deferable — PMG expertise primary per AC #8.)** Per
   historian §3, PMG primary is **Transportation** with **Media**
   as the meaningful secondary (Kendall's franking-privilege power
   in the partisan-press era). PR5 ships Transportation as primary
   only; secondary-expertise is not modeled in PR5 (AC #9). If a
   future PR adds a secondary-expertise tier, PMG gets Media as
   secondary.

10. **(CP2-deferable — Era boundary at 1849 in 1856 scenario.)** The
    1856 scenario opens with the Interior seat already cabinet-rank
    (1849+). The seed at AC #23 places Interior in the 1857
    baseline. No mid-scenario transition needed; the seat is in
    `CABINET_SEATS_BY_YEAR(1856)`. Architect verifies the seed-time
    population covers all 7 seats.

11. **(CP2-deferable — Cabinet meter bonus log line shape per AC
    #27.)** PR5 ships a combined-line log ("revenue: 1.0 -> 1.2
    (+0.2)"). Architect at CP2 may elect to add an explicit
    "(cabinet bonus)" annotation if the log readability suffers.

12. **(CP2-deferable — Order of CABINET_SEATS_BY_YEAR return list
    per AC #5.)** PR5 locks the SET of seats per year-range, not
    the iteration ORDER. Architect picks the most readable order
    (recommended: match `OFFICE_PRESTIGE` desc). The selection
    loop is order-independent (each seat fills independently from
    the eligible pool); the order matters only for the log-line
    sequence on first-ever 2.3.1 run in a scenario.

13. **(CP2-deferable — Tie-break determinism per AC #12.)** PR5
    locks "higher PV wins; lower-id second" as the tie-break.
    Architect verifies no hidden Math.random in `pvCache` reads.
    Existing `pvCache` is engine-computed via `refreshPv`; no
    rng dependency.

14. **(CP2-deferable — Migration log surface per AC #29e.)** PR5
    locks `console.log` as the migration breadcrumb surface.
    Architect may switch to a `snapshot._migrations` array if
    future migrations want a paper trail.

### Deviations from historian (explicit, justified)

A. **GeneralInChief kept available pre-1821 in 1772 scenario.**
Historian §1 GeneralInChief flags the office as formally existing
1821-1903 (gaps), with the Revolutionary Continental Army's
Washington-as-CinC 1775-1783 the only earlier analog. PR5 keeps
the seat in the current AMPU shape — `runPhase_2_3_2_Military`
fills GeneralInChief in both scenarios at any year — because:
- AMPU's `revolutionaryWar.ts` system already runs the
  Washington-as-CinC dynamic separately and would be duplicative
  to re-route through GeneralInChief.
- The 1772 scenario reaches 1821 in a long-but-plausible run, so
  era-gating GeneralInChief to >= 1821 would make the seat empty
  for ~50 years of normal play — gameplay-empty.
- The Sec of War seat already covers the pre-1821 civilian-
  military authority. GeneralInChief in pre-1821 years is an
  AMPU abstraction over "senior field general" (Knox / Wayne /
  Wilkinson / Brown era).
The deviation is gameplay-pragmatic; future PR can era-gate if
the abstraction reads unhistorical at playtest.

B. **`OFFICE_EXPERTISE.PostmasterGeneral` added (was absent).**
Current `OFFICE_EXPERTISE` (`types.ts:944-951`) omits PMG entirely
— a cabinet-confirmed PMG gets no expertise grant today. The
historian §3 table strongly endorses Transportation. PR5 ADDS PMG
to the table at primary=Transportation. This is a deviation FROM
the current code TOWARD the historian's mapping. (Strictly the
deviation is from the existing AMPU shape, not from the
historian's brief.)

### Assumptions

1. **(Assumption — F-FOUR-TRANSITIONS dates are calendar-accurate
   in CABINET_SEATS_BY_YEAR.)** Per F-FOUR-TRANSITIONS, the four
   transitions land at 1789-04-30 (Treasury created Sept 2;
   Foreign Affairs July 27 — earliest is April-ish for the
   Constitution-ratified government), 1798-04-30 (Navy Dept act),
   1829-03-09 (Jackson elevates PMG), 1849-03-08 (Interior).
   `CABINET_SEATS_BY_YEAR` reads on integer year boundaries (the
   game year tick is annual / biennial per AMPU's 2-year turns).
   Boundary year semantics are locked at:
   - year >= 1789 → 4 seats (the cabinet exists starting in
     calendar year 1789 regardless of intra-year month).
   - year >= 1798, 1829, 1849 — same.
   Architect verifies AMPU's year-tick math (`year % 2 === 0`
   election years; 2-year turn advance per `phases.ts:161`) puts
   the player at year 1789 / 1798 / 1829 / 1849 within a
   reasonable in-game cadence.

2. **(Assumption — The 1856 scenario opens at year 1856.)** The
   scenario seed builds at year 1856 per `scenario1856.ts`. At
   year 1856, `CABINET_SEATS_BY_YEAR(1856) = 7 seats` (post-1849).
   PR5's AC #23 seeds all 7 slots accordingly. If the scenario
   start year shifts to 1857 (the historical Buchanan
   inauguration year), the spec is unaffected — `CABINET_SEATS_
   BY_YEAR(1857)` still returns 7 seats.

3. **(Assumption — Section I meter bonuses don't dominate the
   per-turn meter drift budget.)** Existing drift magnitudes at
   `phaseRunners.ts:2958-2965` range -0.5 to +0.5 per skill per
   turn per meter, multiplied by various coefficients. A typical
   drift line on `economic` is in the `-0.4` to `+0.4` range. The
   `+0.2` cabinet bonus is ~50% of a strong drift — meaningful
   but not dominant. The 4-meter cap of `+1.4` total per turn
   across all 7 expertise-matched seats is ~14% of the meter's
   `[-5, +5]` clamp range per turn, which is within the existing
   budget. Architect may rebalance the `+0.2` to `+0.1` at CP2
   if playtest reveals meter inflation.

4. **(Assumption — Save migration is one-shot.)** The Section J
   migration runs once on the first repair() pass after PR5
   ships. Subsequent loads find the fields already scrubbed and
   no-op. Migration is idempotent (delete-a-nonexistent-key is a
   no-op).

5. **(Assumption — `npm run build` covers all consumer sites.)**
   The `OfficeType` union surgery (`KeyAdvisor` and `Admiral`
   removal) flows through all switch / record consumers. The
   architect's CP2 build pass catches any missed site at compile
   time. Pre-flagged sites: `OFFICE_PRESTIGE`, `officeWeights`,
   `OFFICE_ADMIN_GRANT`, `OFFICE_COMMAND_GRANT`, `OFFICE_EXPERTISE`,
   `CABINET_SEAT_SCORING` (new), `CabinetPage.POSITIONS`, the seed
   data files. Indirect consumer: any `OfficeRef` parsing path
   (e.g. `data/draftImport.ts` — verified clean per Grep).

6. **(Assumption — No mid-game UI re-render needed for cabinet
   shape change.)** When 1798 arrives and Navy appears on the
   cabinet page, the existing CabinetPage render reads
   `POSITIONS` which now includes Navy; the page picks up the
   change on next render without special handling. No staleness
   issue.

7. **(Assumption — The `OFFICE_PRESTIGE` weights for Navy and
   Interior are gameplay-balanced at 10 and 8.)** Per AC #3, Navy
   gets parity-with-War (10) and Interior gets parity-with-AG
   (8). These match the historical order-of-precedence. If
   playtest reveals Navy is over- or under-weighted for PV, the
   architect tunes at CP2.

8. **(Assumption — Scenario1856 seed does not yet attach
   `currentOffice` to the 6 named Buchanan-era figures (Cobb /
   Floyd / Toucey / Thompson / Black / Brown).)** Per AC #24, PR5
   leaves dataset attachment for a future regen PR; the first
   2.3.1 in the 1856 scenario picks from the eligible pool. If
   the architect later adds `currentOffice` attachments to those
   figures in `politicians1856.ts`, the cabinet seed at AC #23 will
   auto-pick them up via the same find-by-office pattern the State
   seed uses.

---

**Spec file:** `/home/user/AMPU/docs/specs/cabinet-overhaul.md`
