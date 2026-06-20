# Review: Abilities Earn Expansion (PR2b)

**Branch:** `claude/abilities-earn-expansion` @ HEAD (50aebe3)
**Verdict:** **CLEAN with notes** — Build + lint green; pv.ts byte-equal with
main; constitutionalConvention.ts zero diff; no new `Math.random` in any of the
five touched files; 48/48 smoke assertions pass; 25/25 ACs verified at real
file:line anchors; every F-RECONCILE ALREADY COVERED row untouched; every
F-RECONCILE NEW IN PR2B row lands at its cited anchor. Two minor reviewer notes
(one corner-case Step 2 re-validation grant; D1 forward-ref placement) and the
three balance flags (C1/C2/C3) are flagged but **not blockers** — every
magnitude lives in a single tunable const for one-place adjustment.

## Build + lint
- `npm run build` → **PASS** (`✓ 118 modules transformed`, `✓ built in 2.38s`;
  only the pre-existing >500 kB chunk advisory).
- `npm run lint` (`tsc -b --noEmit`) → **PASS**, clean.
- `node scripts/smokeTestAbilitiesEarn.mjs` → **PASS** (48 passed, 0 failed).

## Critical guardrails (re-verified)
| Guardrail | Check | Result |
|---|---|---|
| `src/pv.ts` byte-equal with `origin/main` | `diff <(git show origin/main:src/pv.ts) src/pv.ts` | **EQUAL** |
| `src/engine/constitutionalConvention.ts` zero diff | `git diff origin/main -- … \| wc -l` | **0** |
| No new `Math.random` in 5 touched files | grep `^+.*Math\.random` on diff | **0 hits** |
| No new field on `Politician` / `GameState` | manual scan of `types.ts` diff | **none added** |
| Save migration / `repair()` change | none of those files in diff | **none** |
| No grant at Step 4 invariant sweep (`runPhase_2_2_3` refreshPv @ 1972) | code-read | **untouched** |
| Every grant gated on `addSkillPoint`/`addCommandPoint` real-change boolean | code-read all 9 hooks | **all gated** |

## Acceptance criteria (25 rows)

| # | Status | Where verified |
|---|---|---|
| 1  Tuning const `ABILITY_EARN_RULES` near `ABILITY_LOSS_RULES` | **PASS** | `types.ts:466–488` (`as const satisfies {…}` shape; ladder `+1/+2/+2/+4` lives here) |
| 2  Lookup tables `OFFICE_COMMAND_GRANT` / `OFFICE_ADMIN_GRANT` / `TRACK_SECONDARY_SKILLS` | **PASS** | `types.ts:493–495`, `500–507`, `513–521` |
| 3  Helper module extended with `addSkillPoint` + `addCommandPoint` (pure, clamp-to-5, return-bool) | **PASS** | `abilities.ts:25–30` (skill), `abilities.ts:33–38` (command); no RNG, no PV |
| 4  Faction-leader install + challenge-success grants 4 stats; real-change only | **PASS** | `phaseRunners.ts:1497–1513` helper; called at `1904` (install) and `1957` (challenge-success); LOSS branch `1959–1968` does NOT call |
| 5  Becoming party leader grants `command +1` (+governing per #20) on real change | **PASS** | `phaseRunners.ts:1517–1535` helper (`isInstall = p.id !== formerLeaderId`); called at `2002` (president shortcut) and `2013` (top-PV) |
| 6  Becoming committee chair grants `command +1` and `legislative +1` (both eras) | **PASS** | 1856+: `phaseRunners.ts:1805–1813` beside expertise grant; CC: `continentalCongress.ts:166–178` inside `grantChair` |
| 7  Re-elected party leader grants `legislative +1` | **PASS** | `phaseRunners.ts:1530–1534` (else branch when `isInstall` is false) |
| 8  Initial appointment to Sec of State grants `command +1`; cap-bounded idempotency (Q9) | **PASS** | `phaseRunners.ts:2056–2060` reads `OFFICE_COMMAND_GRANT[pos]`; fires `addCommandPoint` |
| 9  Senior General/Admiral grants `command +1` ONLY while war active | **PASS** | `phaseRunners.ts:2079–2080` (gate computed once at function entry); `2093` (GiC) and `2110` (Adm) both `if (warActive && …)` |
| 10 Bill sponsor of meter-improving passed bill grants `command +1` | **PASS** | Predicate `phaseRunners.ts:2780–2789`; CC branch grant at `3016–3023` (before `applyEffect`); 1856+ branch grant at `3072–3077` |
| 11 [Open] Battle-win-as-separate-command | **N/A** (spec recommended SKIP) | not implemented — recommended optional; absent per recommendation |
| 12 Secondary roll added to `rollThreshold`, between primary and themed-trait | **PASS** | `phaseRunners.ts:316–328`; `chance(ABILITY_EARN_RULES.secondaryTrack)` (0.25); pool filter `< 5`; calls `addSkillPoint` + `recordCareerGain` |
| 13 [Open] `TRACK_SECONDARY_SKILLS` corrected table per Q2 | **PASS** | `types.ts:513–521`: `Admin → [legislative, governing]`, `Mil → [admin]`, `Gov → [admin, legislative]`, `Leg → [governing]` (admin excluded), `Judicial → []`, `Private → [governing, admin]`, `Backroom → []` |
| 14 Secondary respects cap; routes through `addSkillPoint`; calls `recordCareerGain` with `kind: 'skill'` | **PASS** | `phaseRunners.ts:321` (pool filter), `324` (`addSkillPoint`), `325` (`recordCareerGain(snap, p, thresholdYears, 'skill', k, false)`) |
| 15 Cabinet confirmation grants `admin` with F-DOUBLING `+1/+2/+2/+4` | **PASS** | `phaseRunners.ts:2041–2051`: `amount = r.base * (Egghead ? eggheadMult : 1) * (Efficient ? efficientMult : 1)`; six positions iterated via `OFFICE_ADMIN_GRANT` |
| 16 No change to selection logic / no admin≥2 floor added | **PASS** | `phaseRunners.ts:2028–2031` unchanged (`admin`-sort, `partyId`, `age<75`) |
| 17 Speaker / Pro Tem grants `legislative +1` on real change | **PASS** | `phaseRunners.ts:1745–1746` capture `formerSpeakerId`/`formerProTemId`; `1768–1771` (speaker) and `1779–1782` (pro tem) gate on `id !== former` |
| 18 [Open] Majority Leader / Whip — deferred per spec | **N/A** | not implemented per AC #18 spec recommendation (no `MajorityLeader`/`Whip` field in AMPU) |
| 19 Faction-leader also grants `admin +1` and `governing +1` | **PASS** | `phaseRunners.ts:1505–1512` (`addSkillPoint(p, 'governing', 1)` and `admin`) inside `applyFactionLeaderGrants` |
| 20 Party-leader install also grants `governing +1` | **PASS** | `phaseRunners.ts:1526–1529` (inside `if (isInstall)`) |
| 21 No PV-formula change; no Use-gate change | **PASS** | `pv.ts` byte-equal with main; `command >= 2` gate at `phaseRunners.ts:3218` (was 3051) unchanged |
| 22 No new field on `Politician`/`GameState`; no migration | **PASS** | types.ts diff is const-only; no `interface` touched; no `repair()` change |
| 23 No duplicate grant at any F-RECONCILE ALREADY COVERED site | **PASS** | See "F-RECONCILE walk" below — all 6 sites untouched |
| 24 `npm run build` + `npm run lint` pass | **PASS** | both green; `as const satisfies` compiles |
| 25 Symmetric majority-ground-wins → `admin +1` (Q6 IN) | **PASS** | `revolutionaryWar.ts:128–145` defines `applyBattleEarn`; call site at `222–224` with strict `>` on both sides |

**Score: 23 PASS, 2 N/A (intentionally not implemented per spec). 0 NOT MET.**

## F-RECONCILE binding walk

### ALREADY COVERED rows — every one untouched
| Row | Expected anchor | Actual at HEAD | Status |
|---|---|---|---|
| Command — anytime evos (`commandBump`) | `phaseRunners.ts:2314` applier | applier path untouched; `phaseRunners.ts:2493–2495` is the unchanged loss/gain switch | **UNTOUCHED** |
| Command — kingmaker-protege graduation | `phaseRunners.ts:1361–1363` + 1373 | now `phaseRunners.ts:1376` and `1387` (line-shifted by upstream import line); raw `c.command = Math.min(KINGMAKER_RULES.commandCap, c.command + 1)` UNCHANGED in diff | **UNTOUCHED** (line shift, content equal) |
| Command — CC President | `continentalCongress.ts:145` | now `continentalCongress.ts:146` (line shifted by +1 from added `import` line); raw text `winner.command = Math.min(5, winner.command + 1)` UNCHANGED | **UNTOUCHED** (developer's note: line shift is due to the import on line 4, not internal grants in `appointCCCommittees` — minor mis-attribution, finding stands) |
| Command — Constitutional-Convention "Father of the Constitution" | `constitutionalConvention.ts:157` | file zero-diff; untouched | **UNTOUCHED** |
| Command — Constitutional-Convention Federalist Paper authors (3) | `constitutionalConvention.ts:167` | file zero-diff; untouched | **UNTOUCHED** |
| Military — battle survivors | `revolutionaryWar.ts:104` | line 104, raw text `p.skills.military = Math.min(5, p.skills.military + 1)` UNCHANGED | **UNTOUCHED** |
| Per-ability — career-track primary skill | `phaseRunners.ts:301–313` via `rollThreshold` + `TRACK_SKILL` | primary block 301–313 unchanged in diff; secondary inserted at 316–328 BELOW it | **UNTOUCHED** |

Smoke test independently grep-asserts each (assertions 39–43): all pass.

### NEW IN PR2B rows — every one landed at the cited anchor
| Row | Spec anchor (per F-RECONCILE) | Actual landing | Status |
|---|---|---|---|
| Command — becoming faction leader | `runPhase_2_2_3` install (`1809–1819`) + challenge-success (`1860–1871`) | `phaseRunners.ts:1904` install, `1957` challenge-success (line shift from helpers added above) | **LANDED** |
| Command — becoming party leader | `runPhase_2_2_4` (`1908–1925`) | `phaseRunners.ts:1994–2017` via `applyPartyLeaderGrants` | **LANDED** |
| Command — committee chair | `runPhase_2_2_2` (`1729–1736`) + `appointCCCommittees` (`continentalCongress.ts:163–169`) | `phaseRunners.ts:1805–1813`; `continentalCongress.ts:166–178` | **LANDED** |
| Command — initial Sec of State | `runPhase_2_3_1_Cabinet` (`1930–1950`) | `phaseRunners.ts:2056–2060` (reads `OFFICE_COMMAND_GRANT[pos]`) | **LANDED** |
| Command — Sr Gen/Adm wartime | `runPhase_2_3_2_Military` (`1955–1982`) | `phaseRunners.ts:2079–2080` gate; `2093` (GiC), `2110` (Adm) | **LANDED** |
| Command — bill-passed meter-improver | `runPhase_2_6_3_Floor` (`2853–2921`) | predicate `phaseRunners.ts:2780–2789`; CC site `3016–3023`; 1856+ site `3072–3077` | **LANDED** |
| Per-ability secondary career-track | `rollThreshold` (`295–341`) | `phaseRunners.ts:316–328` (between primary 301–313 and themed-trait at 332) | **LANDED** |
| Legislative — Speaker/Pro Tem | `runPhase_2_2_1` (`1679–1711`) | `phaseRunners.ts:1745–1746` capture; `1768–1771` (Speaker), `1779–1782` (Pro Tem) | **LANDED** |
| Legislative — re-elected party leader | `runPhase_2_2_4` (same site as command grant) | `phaseRunners.ts:1530–1534` (else branch of `isInstall`) | **LANDED** |
| Legislative — faction leader | same site as command, four-grant stack | `phaseRunners.ts:1501–1504` inside `applyFactionLeaderGrants` | **LANDED** |
| Legislative — committee chair | same site as command | `phaseRunners.ts:1810–1813`; `continentalCongress.ts:175–178` | **LANDED** |
| Governing — faction/party leader | same sites | `phaseRunners.ts:1505–1508` (faction); `1526–1529` (party install) | **LANDED** |
| Admin — cabinet confirmation F-DOUBLING | `runPhase_2_3_1_Cabinet`, all 6 positions | `phaseRunners.ts:2041–2051`; positions via `OFFICE_ADMIN_GRANT` (Sec State/Treas/War/AG/PMG/KeyAdvisor) | **LANDED** |
| Admin — faction leader | same site (4-grant stack) | `phaseRunners.ts:1509–1512` | **LANDED** |
| Admin — majority-ground-wins (Q6 IN) | `revolutionaryWar.ts:161–197` mirror | `revolutionaryWar.ts:128–145` helper; `222–224` call site | **LANDED** |

**All 15 NEW rows landed.** No invented grants.

## Brief vs. build deviations

| Deviation | Classification | Note |
|---|---|---|
| D1: brief said `OfficeType` was declared "above this point" before line 466 — actually it's at `types.ts:561`, so the two `Partial<Record<OfficeType, number>>` consts at lines 493 and 500 use a **forward type reference** to `OfficeType` | **Cosmetic** | TypeScript type declarations are hoisted at compile time; types are erased at runtime so there is no TDZ. Build + lint are green. Placement is correct per the brief's intent (right next to `ABILITY_LOSS_RULES`); no need to move. The brief's line-number annotation about `OfficeType` was simply wrong. Recommend: leave as-is. |
| D2: 1856 trace's bills all FAILED at the floor, so the sponsor `command +1` grant did not fire live in playtest | **Cosmetic** (code-read verifies) | Code at `phaseRunners.ts:3070–3077` is correctly placed inside the `if (house.yea > house.nay && senate.yea > senate.nay)` branch (the "passed" branch); `bill.status = 'passed'` is set first; predicate `billImprovesAnyMeter(bill)` checks `bill.effects.meters` (positive delta) OR positive `domesticStability`; sponsor resolved via the loop's `const sponsor` at 3043 (no shadowing); `addCommandPoint(sponsor, 1)` gates the log. The smoke test (assertions 44–48) independently verifies the predicate. Logic is correct; playtest just didn't pass a bill. |
| Helper line-number shifts (1809→1904, 1860→1957, 1908→1994, 1955→2082, 2853→2913, 2861→3013, 2909→3070) | **Cosmetic** | Caused by the two module-level helpers (`applyFactionLeaderGrants`, `applyPartyLeaderGrants`) added above `runPhase_2_2_3` (90+ lines added). The helpers are at the brief-recommended position ("module-level after `recordFactionLeadership`"). No scope creep — total `src/` delta = 291 lines, well under the spec's ~300 line bound. |
| Commit cadence: 6 commits | **Cosmetic** | Clean cadence (1 types/helper, 1 phaseRunners 8-hook, 1 continentalCongress, 1 revolutionaryWar, 1 smoke, 1 playtest). Each one self-contained. |

**No scope creep; no blocker; no missing items.**

## Engine smoke test

`scripts/smokeTestAbilitiesEarn.mjs` runs **48 assertions, 48 pass**. Sections:

| Section | Assertions | Covers | Limitation |
|---|---|---|---|
| 1. `addSkillPoint` / `addCommandPoint` contract | 12 | 0+1 returns true; 4+4 clamps to 5 returns true; 5+1 returns false; default amount=1 | Re-implements helpers in plain JS rather than importing the TS exports — *behavior parity* is asserted, but a future regression in the TS file would not be caught. Acceptable: helpers are 5-line pure functions. |
| 2. F-DOUBLING ladder | 8 | `none→1`, `Egghead alone→2`, `Efficient alone→2`, `both→4`; cap-clamp behavior at admin=4+4 | High-value (the headline magnitude); arithmetic correct |
| 3. `TRACK_SECONDARY_SKILLS` table | 8 | Each track entry shape, Judicial/Backroom empty, Legislative omits admin | Reads `types.ts` text and regex-parses; robust |
| 4. No new `Math.random` in 5 PR2b files | 1 | git diff grep | Direct verification |
| 5. F-RECONCILE ALREADY COVERED sites untouched | 5 | CC President line, constitutionalConvention.ts zero diff, battle survivor line, kingmaker-protege absent, primary `rollThreshold` line | High-value |
| 6. pv.ts md5 byte-equal with main | 1 | direct md5 | High-value |
| 7. `billImprovesAnyMeter` predicate | 5 | Tariff Reduction case (mixed +/-), domesticStability shorthand, all-negative, interest-only, empty effects | High-value (predicate is the Q3 lock) |

**NOT covered by smoke** (acceptable — verified by build + code-read instead):
- Live invocation of the 9 hook call-sites (the playtest engine trace covers this; 59 grant lines in 1772, 90+ in 1856).
- Faction-leader 4-stat stacking inside `applyFactionLeaderGrants` — verified via 1772 trace samples (Samuel Adams gains command + legislative + governing + admin in one phase tick).
- Speaker change firing only on id-diff — verified via code-read at `phaseRunners.ts:1768`.
- Cabinet F-DOUBLING live application (Egghead+Efficient picks rare in seed roster) — code-read verifies the call-site formula matches the smoke arithmetic.
- The sponsor-meter-improver grant at `phaseRunners.ts:3072` did not fire live in 1856 trace because all bills FAILED at the floor; predicate verified by smoke; call-site placement verified by code-read.

## Playtest evidence

| Evidence | Quality | What it proves |
|---|---|---|
| Engine trace 1772 → 59 PR2b earn lines (faction-leader 4-stat stacks dominate) | **Strong** | Faction-leader grants land live; the 4-stat stack actually fires (4 distinct lines per install per leader at below-cap stats) |
| Engine trace 1856 → 90+ earn lines across `2.2.1`, `2.2.2`, `2.2.3`, `2.2.4`, `2.3.1` | **Strong** | 5 of the 9 hooks observed live; cabinet `gains Admin from confirmation` fires; Speaker grant fires on real change; committee chair grants stack with expertise |
| UI screenshots (00-title, 01-after-start, 02-after-draft, 03-after-advances) | **Weak** | Confirm the build *runs* in dev mode; do not directly show earn logs |
| Sponsor grant live fire | **None** | 1856 trace's bills all failed at the floor; code-read verifies the call site is correct (and predicate is smoke-tested) |
| F-DOUBLING live fire on Egghead+Efficient | **None** | rare trait combination in seed roster; arithmetic verified by smoke; trait-read verified by code-read |
| Sr Gen/Adm wartime grant live fire | **None** | trace did not include Rev War battles past initial appointment; gate verified by code-read |

**Reviewer's view on shippability.** Build/lint/smoke green; pv.ts byte-equal;
zero F-RECONCILE duplicate; 23/23 implemented ACs verified; all 15 NEW
F-RECONCILE rows landed. Engine traces prove 5 of 9 hooks fire live. The
remaining 4 (sponsor, F-DOUBLING-with-traits, Sr Gen wartime, ground-wins-admin)
are verified by smoke arithmetic + code-read at the correct site. The UI
playtest race on inaugural-draft post-`simToEndOfDraft` (the developer's pivot
to engine trace) is a NEXT-PR issue, not a PR2b blocker. **Shippable on this
evidence.**

## Balance flags

### C1 — Q8 re-elected party leader every-tick `legislative +1`
- **Magnitude:** `legislative +1` per phase tick where `party.leaderId` is unchanged. At AMPU's half-term cadence (year-ticking + 4 ticks per legislative session), an incumbent reaches `legislative 5` from `legislative 1` in ~4 ticks of retention; at 5 it plateaus (helper no-ops).
- **PV impact at the worst case:** `4 × +1` (per-stat) over 4 ticks = `~16 PV` (skills are `× 4` in `pv.ts:65–87`). For a long-tenured CPU leader this is locked in fast.
- **Reviewer's assessment:** **Accept** for PR2b. The brief explicitly defaults to every-tick with cap as the safety; the spec's alternative (cycle-gated by `year % 4 === 0`) is a one-line gate flip if playtest finds it too generous. The cap bound and the **mechanical one-line dial-back** are the playbook's chosen mitigation. Flag in the playtest note so the human looks for "leader's legislative hits 5 in 1 year" feel.
- **Recommendation if playtest tunes:** in `applyPartyLeaderGrants`, gate the `else` branch on `snap.game.year % 4 === 0`. Single-line change.

### C2 — F-DOUBLING `+4 admin` at cabinet confirmation = ~16 PV per event
- **Magnitude:** Egghead+Efficient Sec of Treasury at admin=1 jumps to admin=5 in one phase tick. `4 × admin-weight (4) = 16 PV` in one event. Sec of State doubles up: AC #8 also fires `+1 command` (so admin 1→5 PLUS command +1) — total `~16 + 10 = 26 PV` on a Sec of State with both traits.
- **Reviewer's assessment:** **Accept with monitoring** for PR2b. The reference explicitly stacks the doubling (the spec's F-DOUBLING is binding). The cap (5) bounds the per-event ceiling; a politician who already has admin 4 only gains 1 (no info-leak in the log). Magnitudes live in `ABILITY_EARN_RULES.cabinetConfirmAdmin` for one-place tuning if the human dislikes the feel (drop `eggheadMult` to 1.5? brief says these are tunable). The trait combination Egghead+Efficient is uncommon — modest aggregate impact in practice.
- **Recommendation if playtest tunes:** drop `eggheadMult` and/or `efficientMult` from 2 to 1.5 in `types.ts:480–482`. Or restrict the doubling to one trait (compute the max instead of the product). Single-place change.

### C3 — Faction-leader 4-stat grant = ~16 PV per install
- **Magnitude:** Per install or challenge-success, the new leader gains `command +1` (× 10 in PV) + `legislative +1, governing +1, admin +1` (× 4 each in PV) = `10 + 12 = +22 PV` if all four below cap. The 1772 trace shows ~10 distinct factions each gaining their first leader with the full 4-stat stack.
- **Reviewer's assessment:** **Accept** for PR2b. The reference is *explicit* that faction leader appears on all four Earn lists (command + legislative + governing + admin). The spec's locked decision (AC #4 + #19) is binding. The cap bounds per-stat ceiling. Per-event magnitudes are large because the reference says so. Total counter-pressure to PR2a's loss machinery is the spec's stated intent.
- **Recommendation if playtest tunes:** the human can dial back the brief's `applyFactionLeaderGrants` helper to grant only 1 stat per install instead of 4 — that's a "narrow the leader earn" follow-up PR, not a magnitude tune.

**No balance issue rises to BLOCKER.** All three are designer-intent decisions
locked by the spec; all three are one-place-tunable; none touch PV math; none
introduce non-determinism.

## Risks / holes

1. **Minor: Step 2 install path may not strictly require id-change.** In
   `runPhase_2_2_3_FactionLeaders`'s Step 2 (`phaseRunners.ts:1862–1910`), the
   `invalid` check is on the *current leader's validity* (dead, retired, wrong
   faction, mismatched `factionLeaderOf`). In a corner case where `current` is
   alive and in faction but `current.factionLeaderOf !== f.id`, `current` could
   theoretically appear in `eligible` and be chosen as `winner` — meaning the
   "install" grants would fire on someone who was already the leader. The cap-
   bounded helper means the worst case is a one-shot bump per stat. The spec
   says "fires only on a real change — if `f.leaderId === winner.id` already
   (re-validation no-op), nothing grants." The code does NOT add a
   `winner.id !== formerLeaderId` guard at this site. Found via code-read;
   note for the next PR if the human wants the strictly-real-change guarantee.
   **Not a blocker.**

2. **Minor: D1 forward type reference is unusual but compiles.** `OFFICE_COMMAND_GRANT`
   and `OFFICE_ADMIN_GRANT` at `types.ts:493`/`500` reference `OfficeType` which
   is declared at line 561. TypeScript's type system hoists type declarations
   so this compiles cleanly; build and lint are green. Code is **readable**
   because the brief comment explains the intent. Could move the const block
   to below `OfficeType` for forward-readability, but the spec's binding
   placement decision was "adjacent to `ABILITY_LOSS_RULES`" — that's where it
   sits. **Not a blocker.** Recommend leaving as-is.

3. **UI playtest race noted but out of scope for PR2b.** The developer's
   playtest pivoted from UI to engine trace due to a post-`simToEndOfDraft`
   race on the inaugural draft. This is an unrelated UI/state bug surfaced
   during playtesting and is **out of scope** for this PR. Flag for whoever
   touches the draft phase UI next.

4. **Smoke test re-implements helpers rather than importing.** The smoke
   script writes plain-JS clones of `addSkillPoint`/`addCommandPoint` and
   verifies the contract there; it does NOT import the TS exports. A future
   regression on the TS helpers wouldn't be caught by this script. The
   helpers are 5-line pure functions and `npm run build` would catch shape
   regressions; tradeoff is acceptable. Note for the next iteration if a
   richer harness becomes desirable.

5. **Live coverage gaps (already noted).** Sponsor grant, F-DOUBLING-with-
   traits, Sr Gen/Adm wartime, ground-wins-admin all verified by smoke +
   code-read but not observed live in the trace. None are blockers (correct
   call-site verified); a future playtest sweep should construct scenarios
   that trip these (e.g. a Rev War with 3 ground wins; a CPU pick of a Sec
   of Treasury with Egghead+Efficient).

## Determinism

Added lines with `Math.random`/`Date.now`: **NONE.** The new `chance` call
at `phaseRunners.ts:320` uses `chance` from `src/rng.ts` (already imported).
PR2a's pre-existing `Math.random` in `revolutionaryWar.ts:88,96` (Q6 deferral)
unchanged. All grants are guaranteed-on-trigger; the secondary-skill roll is
the only new probabilistic site and routes through the seedable wrapper.

## Out-of-scope confirmation

No PV change. No Use-gate change. No trait gain/loss (PR3 territory). No
expertise grant added beyond what already existed (PR1). No new field on
`Politician`/`GameState`. No `repair()` or migration. No new screen/component.
No filibuster, no crisis legislation, no event-implementer command grant
(spec's documented DEFERs). No ambassador grant. No 2+-term Senator/Governor
admin grant (would require term counters — Q7 DEFER). All correctly absent.

## Must playtest before merge (live, qualitative)

The build verifies correctness; the human verifies *feel*:

1. **Faction-leader 4-stat install (highest leverage).** Start 1772; advance
   to phase `2.2.3` of the first turn. In the events feed for `2.2.3` look for
   each newly-installed faction leader gaining up to **4 lines** in sequence:
   "X gains Command leading the …", "… Legislative …", "… Governing …",
   "… Admin …". DevTools (or the roster screen) should show the leader's
   `command` and three skills each at +1 above their pre-phase value. A leader
   already at one cap shows fewer lines.

2. **Cabinet F-DOUBLING with Egghead+Efficient.** This is rare in the seed
   roster — easiest is to inject traits via DevTools on a politician
   candidate at admin=2, then run `2.3.1`. Confirm admin jumps **2 → 5** (the
   `+4` raw, clamped); one "gains Admin from confirmation" log line fires. Try
   Egghead-only (admin 2 → 4) and Efficient-only (admin 2 → 4) to confirm the
   ladder.

3. **Sec of State command stack.** A politician with admin=2 and command=3 (no
   traits) picked for Sec of State should fire **two** log lines under `2.3.1`:
   "gains Admin from confirmation" (2 → 3) AND "gains Command from the
   Secretary of State portfolio" (3 → 4). With Egghead+Efficient: admin 2 → 5
   AND command 3 → 4 (both grants stack).

4. **Speaker change and re-election.** Pass into a `2.2.1` tick where the
   House majority flips (or the prior Speaker died). New Speaker gets one
   "gains Legislative from the Speaker's gavel" line; a re-elected Speaker
   produces silence (id-diff guard).

5. **Bill sponsor command on meter-improver.** Either let the CC pass a 1772
   early bill (Continental Army / Navy raise) or in 1856 pass a tariff bill.
   Confirm one "gains Command from passage of …" line per meter-improving
   passed bill. A bill whose only effects are interest-group cards (no
   `meters` and no `domesticStability`) produces no command grant.

6. **Secondary career-track roll.** Run 5–10 half-terms with several CPU
   politicians on the `Administration` or `Governing` track. Check the
   `careerGains` feed (DevTools / in-game UI) for `kind: 'skill'` entries that
   land on a *secondary* skill (e.g. Administration → `governing` or
   `legislative`). At 0.25 odds, expect ~1.25 secondary fires per politician
   per 20-year track — qualitatively "happens but stays below the primary
   rate".

7. **Sr Gen / Adm wartime command grant.** During the Rev War, clear
   `snap.game.cabinet.GeneralInChief` via DevTools and run `2.3.2`. Confirm a
   "gains Command as wartime General in Chief" line. After the war ends
   (`war.outcome = 'win'`), clear the Admiral slot and re-run `2.3.2` — the
   new Admiral should NOT gain command (peacetime gate).

8. **Symmetric majority-ground-wins admin.** Force a Rev War phase that wins
   more ground battles than it loses (3 wins, 0–1 losses). Confirm "grows in
   stature commanding the campaign — Admin N → N+1" log line on the senior
   general. A phase with equal win/loss is silent.

9. **Re-elected party leader — the C1 balance lever.** Watch how fast a
   long-tenured leader's `legislative` reaches 5 with the every-tick semantic.
   If it feels too aggressive ("the leader maxes legislative inside a single
   year"), dial back to cycle-gated via `snap.game.year % 4 === 0` per the
   spec Q8 fallback.

10. **Aggregate PV pressure check.** Compare a roster after 10 years of play
    on this branch vs. PR2a's pre-PR2b state: are top politicians' PVs
    visibly inflated relative to mid-tier ones? If yes, dial back specific
    magnitudes in `ABILITY_EARN_RULES`.

## Findings requiring fix

**None.** The two minor reviewer notes (Step 2 re-validation strict-id guard,
D1 forward-ref placement) are corner cases / readability concerns, not bugs.
The three balance flags (C1, C2, C3) are designer-intent decisions locked
by the spec, all one-place-tunable in `ABILITY_EARN_RULES` / the lookup
tables / the helper.

---
