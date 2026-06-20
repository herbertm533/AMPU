# Spec: Abilities Earn Expansion (PR2b)

## Vision (as given)

Third slice of the abilities / expertise / traits alignment epic. PR1 (the
expertise axis) and PR2a (the loss machinery — old-age decay, negative anytime
evos, battle-loss penalties) have merged. PR2b closes the other half of the
ability lifecycle: the **earn** expansion. The reference's Earn lists for the
six abilities call out ~15 grant trigger points (the long Command list plus
per-ability secondary-track / leadership / cabinet-confirmation / tenure
grants) that AMPU does not yet wire. Several of the gap analysis's "missing"
grants are **already implemented** (CC President +1 command, Constitutional
Convention framers +1 command, battle survivors `military +1`, career-track
primary skill, Kingmaker-protege graduation +1 command) — PR2b reconciles
against those and **adds the remaining hooks only**, following the PR1 / PR2a
pattern of one tuning const + one helper module + grants at existing phase
hooks. Because abilities drive PV and PV drives elections, every grant is a
balance lever moving PV **upward** — the mirror of PR2a's decline pressure.

## Historical grounding (binding)

Source of mechanics: `docs/research/source-abilities-expertise-traits.md`
(BINDING design reference, the six **ABILITIES** Earn lists, plus the
**Leadership** trait's own Earn list). Source of scope:
`docs/research/abilities-expertise-traits-gap-analysis.md` ("System 1 —
Abilities"), with the corrections recorded in PR2a's spec
(`docs/specs/abilities-earn-loss.md`) re-verified against current main. This
is an engine-alignment PR, not era content, so there is no separate historian
brief — the design reference is ground truth. Locked reconciliation decisions
**D1** (`backroom` stays a skill — eligible for no new Earn grant since the
reference excludes Backroom from the secondary-skill list) and **D2**
(`command` stays a separate field) carry through unchanged.

Binding facts carried from those documents (the F-facts restate them as
testable constraints):

- **F-EARN triggers (reference).** PR2b adds **only** the earn paths the
  reference's six Earn lists name. No invented gains. The **F-RECONCILE**
  table below names every reference earn item × (already-covered file:line /
  new in PR2b / DEFER with reason) and is binding.
- **F-CAP (locked context).** Abilities are integers **0–5**, capped at
  `ANYTIME_EVENTS_RULES.skillCap = 5` / `commandCap = 5` (`src/types.ts:479–480`).
  A grant at the cap is a **no-op** — the helper returns `false`, no log line.
- **F-PV-GATE (balance — the headline risk).** PV is `skills × office-weight ×
  4 + command × 10` (`src/pv.ts:65–87`); presidential candidacy requires
  `command >= 2` (`phaseRunners.ts:3051`). PR2b grants directly raise PV and
  thus election strength; magnitudes are conservative (`+1` per event, no
  stacking inside one phase per politician unless the reference explicitly
  stacks via Egghead/Efficient cabinet doubling — see F-DOUBLING).
- **F-DOUBLING (cabinet-confirmation Administrative).** The reference says
  cabinet confirmation grants **Administrative**, **doubled if Egghead**,
  **doubled if Efficient**, **and stacks if both** — i.e. the grant ladder is
  **+1 / +2 / +2 / +4** (none → Egghead alone → Efficient alone → both). This
  is the **only** stacking grant PR2b introduces; every other grant is `+1`.
- **F-DETERMINISM (CLAUDE.md).** Engine code is pure over the snapshot and
  must use `src/rng.ts` for any roll — never `Math.random`. PR2b's grants are
  **guaranteed-on-trigger** (no rolls), so the determinism question is moot
  *inside* the grants — but PR2b must add no direct `Math.random` calls
  anywhere.
- **F-RECONCILE (the binding "already covered / new in PR2b / DEFER" table).**
  Verified against current `main` (post-PR1, post-PR2a):

  | Reference earn item | Status | Anchor |
  |---|---|---|
  | **Command** — anytime evos (`commandBump`) | ALREADY COVERED | `src/data/anytimeEvents.ts` + `phaseRunners.ts:2314` applier |
  | **Command** — kingmaker-protege graduation (`+1`, 45% command branch / 45% both branch) | ALREADY COVERED | `phaseRunners.ts:1361–1363`, master-kingmaker bonus l.1373 |
  | **Command** — CC President | ALREADY COVERED | `continentalCongress.ts:145` (`winner.command = Math.min(5, winner.command + 1)`) |
  | **Command** — Constitutional-Convention "Father of the Constitution" | ALREADY COVERED | `constitutionalConvention.ts:157` (`father.command = Math.min(5, father.command + 1)`) |
  | **Command** — Constitutional-Convention Federalist Paper authors (3) | ALREADY COVERED | `constitutionalConvention.ts:167` (each: `+1 command`) |
  | **Military** — battle survivors (10% roll on `military +1`) | ALREADY COVERED | `revolutionaryWar.ts:104` |
  | **Per-ability** — career-track **primary** skill at threshold (50% per `n=thresholdYears/4`) | ALREADY COVERED | `phaseRunners.ts:301–313` via `rollThreshold` + `TRACK_SKILL` |
  | **Command** — becoming **faction leader** | NEW in PR2b | hook `runPhase_2_2_3_FactionLeaders` install branch (`phaseRunners.ts:1809–1819`) and challenge-success branch (`1860–1871`); also seed-fire in `recordFactionLeadership` callers (see AC #4) |
  | **Command** — becoming **party leader** | NEW in PR2b | hook `runPhase_2_2_4_PartyLeaders` (`phaseRunners.ts:1908–1925`) on a real leader change |
  | **Command** — becoming **committee chair** | NEW in PR2b | hook `runPhase_2_2_2_Committees` (`phaseRunners.ts:1729–1736`) + CC chairs in `appointCCCommittees` (`continentalCongress.ts:163–169`) |
  | **Command** — initial appointment to **Secretary of State** | NEW in PR2b | hook `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:1930–1950`), only when `pos === 'SecretaryOfState'` AND the appointee did not already hold it |
  | **Command** — **Senior General/Admiral** while a major war is active | NEW in PR2b | hook `runPhase_2_3_2_Military` (`phaseRunners.ts:1955–1982`) — but **only** when a war is active (gate: `snap.game.revolutionaryWar?.active || snap.game.wars.length > 0`) |
  | **Command** — **legislation that improves a meter** (sponsor reward) | NEW in PR2b | hook `runPhase_2_6_3_Floor` (`phaseRunners.ts:2853–2921`) on `bill.status = 'passed'` when `bill.effects.meters` contains a **positive** delta (sponsor only). See Open Question Q3 for the "improve" definition |
  | **Command** — **proposing crisis legislation that's signed** | DEFER | AMPU has no "crisis legislation" tag; no clean trigger. Out of scope (Q4) |
  | **Command** — **successful filibuster** | DEFER | AMPU has no filibuster mechanic. Out of scope (Q4) |
  | **Command** — **successful event implementation** (unless Efficient + handled) | DEFER | `resolveEraEvent` (`phaseRunners.ts:2462`) has no "implementer" politician concept — event responses apply national effects, not assigned to a specific politician. Out of scope (Q4) |
  | **Command** — **succeeding at a gov action** (except guaranteed, not 5 Gov) + again if it moves a meter | DEFER | `runPhase_2_5_2_Governors` (`phaseRunners.ts:2737–2747`) adjusts state `bias` not a national meter; the "moves a meter" sub-clause cannot be detected. Out of scope (Q4) |
  | **Command** — **winning a battle** / **majority of battles** / **winning a major war** | DEFER for command | `revolutionaryWar.ts:128–212` resolves wins but the reference's command grant on battle wins is ambiguous vs. the already-existing `military +1` survivor grant. The pre-existing survivor-`military +1` (10%) and the F-RECONCILE "battle survivors" line cover the per-battle skill earn; the reference's added **command** grant on a *major war won* could be added but the reference also adds **military** to active admirals/generals at war-won, and AMPU has no "war won" terminal hook beyond `war.outcome = 'win'` in `revolutionaryWar.ts:204`. **Recommend OPTIONAL** in PR2b — see AC #9 |
  | **Per-ability** — career-track **secondary** skills (all tracks but Backroom/Judicial grant Legislative; Admin/Mil/Gov/Judicial/Private grant Administrative; Legislative/Admin/Judicial/Private grant Governing; "all other tracks" grant Governing) | NEW in PR2b | hook `rollThreshold` (`phaseRunners.ts:295–341`), a second roll with a **lower** odds curve than primary. See AC #14 + Open Question Q2 for the secondary-skill table |
  | **Legislative** — **congressional leadership** (Speaker / Senate Pro Tem) | NEW in PR2b | hook `runPhase_2_2_1_CongressLeadership` (`phaseRunners.ts:1679–1711`) on a real change of `speakerId` / `proTemId` |
  | **Legislative** — being **re-elected as party leader** | NEW in PR2b | hook `runPhase_2_2_4_PartyLeaders` when an incumbent retains the seat (see AC #7) |
  | **Legislative** — becoming **faction leader** | NEW in PR2b | hook `runPhase_2_2_3` install + challenge-success (paired with the command grant — same site, two grants) |
  | **Legislative** — appointment to **committee or committee chair** | NEW in PR2b for **chair**; rank-and-file membership absent in AMPU — DEFER for membership |
  | **Governing** — becoming **faction leader** / **party leader** | NEW in PR2b | same sites as the command grants above (stacked at the same hook) |
  | **Administrative** — **cabinet confirmation** (doubled if Egghead, Efficient, stacks if both → +1/+2/+2/+4 — F-DOUBLING) | NEW in PR2b | hook `runPhase_2_3_1_Cabinet` for each of the Big-4 + cabinet-level positions (Sec of State, Treasury, War, AG; PMG and KeyAdvisor included per Q5) |
  | **Administrative** — **becoming faction leader** | NEW in PR2b | same hook as command/legislative — three grants at one site |
  | **Administrative** — **winning the majority of battles that phase of the war** | DEFER | The symmetric loss exists (PR2a, `revolutionaryWar.ts:191–197`); adding the symmetric earn is *low cost* off the same tallies (~6 lines, mirror of PR2a Q16) — **Recommend OPTIONAL** in PR2b (Q6) |
  | **Administrative** — **2+ terms as Governor or Senator** | DEFER | No term-counter on `Politician` today. Adding one is a separate state-shape PR (Q5/Q7). Out of scope for PR2b |
  | **Military** — career-track exit (primary), 2 Rev-War-era evos, battle wins | ALREADY COVERED (primary via `TRACK_SKILL.Military`) + DEFER (Rev-War-era anytime tag absent; battle-wins-on-command see above) |
  | **Judicial** — career-track exit (primary) only | ALREADY COVERED (`TRACK_SKILL.Judicial`) |
  | **Ambassador**-related command grants ("national ambassadors / UN Ambassador if at war with their nation") | DEFER | No ambassador appointment phase (consistent with PR1's defer) |

  The F-RECONCILE table is the single binding source for the "what PR2b
  builds vs. skips" decision. Any new earn site not on this table is **out of
  scope** for PR2b.

## Player experience

The "ability lifecycle" feels alive in both directions: PR2a made aging and
battlefield defeat **erode** a politician's stats, and PR2b makes the marquee
career milestones — winning a faction-leader fight, being installed as Speaker
or party leader, taking a Big-4 cabinet seat, chairing a committee, sponsoring
a bill that moves the country, leading the senior army during a war — visibly
**reward** a politician with the matching stat bump. A young general handed
the senior command during the Revolutionary War feels their Command grow as
the office matters; a Sec of Treasury accumulates Administrative experience
across confirmation hearings (doubled for an Egghead, doubled again for the
Efficient ones); a long-running faction leader is broadly competent (Command +
Legislative + Governing + Admin at the install) the way the reference
describes. Decline still bites (PR2a) — but the player now has plenty of
counter-pressure: every milestone is also a payoff, not just a stepping stone.

## User story

As a player developing a faction across decades, I want my politicians'
abilities to **grow** at the major milestones the reference calls out — taking
faction or party leadership, chairing a committee, being confirmed to the
cabinet, sponsoring a meter-moving bill, holding the senior military command
in wartime — so that those promotions feel *load-bearing* in the player's PV
math, not just narrative beats, and the new losses from PR2a have visible
upward counter-pressure.

## Scope of THIS spec (PR2b — Earn expansion only)

Per the headline scoping recommendation (Open Question Q1), the earn
expansion is **one PR** (Option A) rather than a sub-split. This spec
covers all earn grants in the F-RECONCILE "NEW in PR2b" rows above. The
**Loss machinery** is PR2a (merged); **trait loss / d6 conflict** is PR3;
**cabinet overhaul (admin≥2 gate, expertise gating, confirmation hearings)**
is PR5; **lobbies → expertise → industry** is PR7.

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human/architect
resolves at checkpoint; PM recommendation in parentheses). The headline
`[Open @ CP1]` is the scoping decision (Q1) — one PR vs. sub-split — followed
by the secondary-skill table (Q2) and the meter-improvement detection (Q3).

### A. A single earn helper + tuning const (mirror PR1 / PR2a)

1. **[Locked]** A new tuning const `ABILITY_EARN_RULES` is added to
   `src/types.ts` (placed near `ABILITY_LOSS_RULES`, `as const satisfies …`
   like its neighbors) holding **all** magnitudes PR2b introduces — no magic
   numbers in engine bodies. It is the single source for the cabinet-confirm
   F-DOUBLING ladder (+1/+2/+2/+4), the secondary-track skill odds curve
   (lower than `CAREER_ODDS.skill = 0.5`), and any one-off magnitudes.

2. **[Locked]** New table constants are added to `src/types.ts`, **mirroring
   the PR1 `OFFICE_EXPERTISE` / `COMMITTEE_EXPERTISE` / `TRACK_EXPERTISE`
   pattern** so the data lives in one place and the engine bodies just look it
   up: at minimum `OFFICE_COMMAND_GRANT` (Sec of State → 1), `OFFICE_ADMIN_GRANT`
   (Sec of State / Treasury / War / AG / PMG / KeyAdvisor → 1, with the
   F-DOUBLING ladder applied at the call site), and `TRACK_SECONDARY_SKILLS`
   (per `CareerTrack`, an array of `SkillKey` granted at a lower odds — see
   AC #14 and Open Question Q2 for the table).

3. **[Locked]** A pure helper module (recommend extending the existing
   `src/engine/abilities.ts` from PR2a — same file, additional exports —
   mirroring `src/engine/expertise.ts`'s `addExpertise`) exposes single
   increment primitives used by **every** earn path, e.g.
   `addSkillPoint(p, key, amount): boolean` and `addCommandPoint(p,
   amount): boolean`, each clamping to **5** and returning `true` iff the
   value actually rose (so callers gate their log line on a real change). No
   earn path mutates `p.skills` / `p.command` directly; the helpers are
   **deterministic and pure** (no `Math.random`; any roll is at the call
   site) and never touch PV directly — PV recomputes via the existing
   `refreshPv` sweeps already present in each phase.

### B. Command grants (the long Command list, NEW rows of F-RECONCILE)

4. **[Locked]** **Becoming faction leader** grants `command +1`,
   `legislative +1`, `governing +1`, and `admin +1` (the union of the four
   reference Earn lists that name "becoming faction leader"). Hook
   `runPhase_2_2_3_FactionLeaders` at the **Step 2 install** branch
   (`phaseRunners.ts:1807–1820`) and the **Step 3 challenge-success** branch
   (`phaseRunners.ts:1860–1872`). The grant fires **only on a real change** —
   if `f.leaderId === winner.id` already (re-validation no-op), nothing
   grants. Each stat that actually rose writes one `addLog` under phase
   `2.2.3` with the `appointment` kind, consistent with the surrounding logs.

5. **[Locked]** **Becoming party leader** grants `command +1`. Hook
   `runPhase_2_2_4_PartyLeaders` (`phaseRunners.ts:1908–1925`) on a real
   change of `party.leaderId` (the diff: old `leaderId` vs. the newly
   computed top). The president-is-party-leader shortcut at lines 1910–1915
   also grants on the first time it makes someone party leader (i.e. they
   were not already `party.leaderId`). Log under `2.2.4` `appointment`.

6. **[Locked]** **Becoming committee chair** grants `command +1` and
   `legislative +1`. Hook the existing PR1 chair-appointment site in
   `runPhase_2_2_2_Committees` (`phaseRunners.ts:1729–1736`) where
   `COMMITTEE_EXPERTISE[c]` already fires; the new grants slot in next to
   the expertise grant (so each chair gets command + legislative + expertise
   at once, all guarded by real-change booleans). Mirror for the 1772 CC
   chairs in `appointCCCommittees` (`continentalCongress.ts:163–169`) where
   the PR1 `addExpertise` grant already lives. Log under `2.2.2`.

7. **[Locked]** **Re-elected as party leader** grants `legislative +1`. Hook
   `runPhase_2_2_4_PartyLeaders` on the path where `party.leaderId` is
   **unchanged** AND the politician was already the party leader the prior
   tick (i.e. survived a real party-leader evaluation, not the first install
   in AC #5). The first install does **not** grant `legislative` here — only
   re-election does. Determining "re-elected" cleanly: PR2b assumes the
   simplest possible signal — `party.leaderId` was non-null before the phase
   and equals the same id after — and grants on each phase tick that
   satisfies this condition. Flag in Open Question Q8 (semantic refinement
   may be wanted).

8. **[Locked]** **Initial appointment to Secretary of State** grants
   `command +1`. Hook `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:1930–1950`)
   inside the `pos === 'SecretaryOfState'` branch; the grant fires **only**
   if the appointee did **not** previously hold the office (idempotency: a
   re-appointment to the same post in a later term does not regrant — see
   F-RECONCILE wording "initial appointment"). The cleanest signal: the
   helper returns `true` only when the underlying `command` actually rose,
   AND the `pos === 'SecretaryOfState'` branch additionally checks that the
   politician's `currentOffice` did not equal `SecretaryOfState` going in
   (i.e. this is a fresh seating, not a same-tick re-vacate-rehire). PR2b
   does NOT add a "has previously held office X" durable record (out of
   scope, see Q9); the boolean-on-actual-change `addCommandPoint` covers the
   common case where the same politician at command=5 is silently a no-op.
   Log under `2.3.1` `appointment`.

9. **[Locked]** **Senior General or Senior Admiral while a war is active**
   grants `command +1`. Hook `runPhase_2_3_2_Military`
   (`phaseRunners.ts:1955–1982`), inside both the `!snap.game.cabinet.GeneralInChief`
   and `!snap.game.cabinet.Admiral` initial-appointment branches, **gated**
   on war-active: `(snap.game.revolutionaryWar?.active === true) ||
   snap.game.wars.length > 0`. (Both gates are necessary because the
   independence-era war lives on `revolutionaryWar`; later eras hang on
   `snap.game.wars`.) Re-appointment in peacetime does **not** grant. Log
   under `2.3.2`.

10. **[Locked]** **Legislation that improves a meter** grants `command +1`
    to the **sponsor**. Hook `runPhase_2_6_3_Floor`
    (`phaseRunners.ts:2853–2921`) — both the CC era branch (lines 2854–2877)
    and the 1856+ branch (lines 2879–2921) — at the `bill.status = 'passed'`
    site, **before** the `applyEffect(snap, bill.effects)` call. Compute the
    "improves a meter" condition by inspecting `bill.effects.meters`: if
    **any** entry has a positive delta, grant. (The cleanest reading of the
    reference is "improves" = positive delta on any national meter. The
    domestic-stability shorthand `effect.domesticStability` also counts —
    treat a positive value as "improves the domestic meter".) Sponsor
    resolution: `snap.politicians.find((p) => p.id === bill.sponsorId)`.
    Idempotency: the grant fires per-bill-passed, so a sponsor with three
    passed meter-moving bills in one tick gets +3 (floored at the cap). Log
    under `2.6.3`. See Open Question Q3 for the "improve" definition.

11. **[Open @ CP1 — recommend OPTIONAL: skip in PR2b]** **Winning a battle /
    majority of battles / a major war** as a separate **command** grant. The
    reference lists command for these but AMPU already grants `military +1`
    to all battle survivors (`revolutionaryWar.ts:104`) on a 10% roll, which
    serves the per-battle Military Earn. Recommend **NOT** adding a separate
    command grant for battle wins in PR2b: (a) it would re-litigate the
    existing battle-survivor balance; (b) the senior general/admiral already
    get a one-time `command +1` from AC #9 when appointed. If the human
    explicitly wants the reference's full coverage, add `+1 command` to the
    senior general on a `war.outcome = 'win'` terminal at
    `revolutionaryWar.ts:204` (~3 lines). Architect confirms at CP1.

### C. Per-ability secondary career-track grants

12. **[Locked]** A **secondary skill** roll is added to `rollThreshold`
    (`phaseRunners.ts:295–341`), executing after the primary skill roll
    (lines 301–313) and before the themed-trait roll (line 318). The
    secondary roll uses `ABILITY_EARN_RULES.secondaryTrack` odds, set
    **lower** than the primary's 50% (recommend `0.25` — half the primary,
    conservative — Open Question Q2c). On a successful roll, pick uniformly
    from `TRACK_SECONDARY_SKILLS[track]` (excluding any already at cap; if
    all are at cap, no-op). The roll is independent of the primary skill
    roll (a politician can gain both in the same threshold).

13. **[Open @ CP1 — recommend the table below]** `TRACK_SECONDARY_SKILLS`
    table (per the reference's per-ability Earn lists, "all other tracks
    but X grant Y as secondary"):
    - `Administration` → `['legislative', 'governing']` (Admin track grants
      legislative + governing as secondaries; admin itself is primary)
    - `Military` → `['admin']` (the reference lists Military as granting
      Administrative only via "all other tracks" — keep narrow)
    - `Governing` → `['admin', 'legislative']`
    - `Legislative` → `['governing', 'admin']` (note the reference excludes
      Legislative from granting Admin as secondary — but the reverse holds
      "all other tracks but Legislative grant Admin"; Legislative track
      itself does NOT grant admin secondary — corrected per the source text)
    - `Judicial` → `[]` (the reference is **explicit**: Judicial earns
      Judicial only; no secondaries)
    - `Private` → `['governing', 'admin']`
    - `Backroom` → `[]` (the reference excludes Backroom from secondaries
      and `Backroom` carries no ability-axis identity per D1)

    The corrected table (resolving the reference's slightly tangled wording
    "all other tracks but X grant Y"): a track grants Y as secondary iff Y
    is not the track's primary AND the reference's Y-Earn list includes
    that track. The architect/designer confirms the table at CP1; the
    *trigger* (extra roll inside `rollThreshold`) is `[Locked]`.

14. **[Locked]** The secondary roll respects the existing primary cap
    semantics: a `5/5` skill is skipped (filtered out of the pool); an empty
    pool is a no-op; a successful pick increments via `addSkillPoint` and
    is recorded via `recordCareerGain` (`phaseRunners.ts:280–290`) with
    `kind: 'skill'` (same shape as primary) so the existing career-gain feed
    surfaces it. The secondary roll never grants `backroom` (reference does
    not name it as a secondary anywhere) or `judicial` (Judicial track is
    the only judicial-earn site per F-RECONCILE).

### D. Cabinet-confirmation Administrative (F-DOUBLING)

15. **[Locked]** **Confirmation to a cabinet seat** grants `admin +1`,
    **doubled if the politician has the `Egghead` trait, doubled again if
    they have `Efficient`, stacks if both** (the +1 / +2 / +2 / +4 ladder).
    Hook `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:1930–1950`) for each of
    `SecretaryOfState`, `SecretaryOfTreasury`, `SecretaryOfWar`,
    `AttorneyGeneral`, `PostmasterGeneral`, `KeyAdvisor` (the six positions
    the phase iterates). The compute: `amount = 1 * (hasEgghead ? 2 : 1) *
    (hasEfficient ? 2 : 1)`. Call `addSkillPoint(pick, 'admin', amount)`;
    log under `2.3.1` `appointment` on real change. Idempotency: like AC #8,
    the grant fires per-seating; the helper's cap return covers re-grants
    naturally (a politician at admin 5 silently no-ops on re-seating). See
    Open Question Q5 for the PMG/KeyAdvisor inclusion call.

16. **[Locked]** PR2b does **NOT** alter the existing `runPhase_2_3_1_Cabinet`
    selection logic (admin-sort, party-match, age<75) or add an admin≥2
    floor — that is PR5 (cabinet overhaul). It only adds the post-seating
    grant.

### E. Legislative grants beyond committee chair

17. **[Locked]** **Congressional leadership (Speaker, Senate Pro Tem)**
    grants `legislative +1`. Hook `runPhase_2_2_1_CongressLeadership`
    (`phaseRunners.ts:1679–1711`) at both speaker and pro-tem install sites,
    **only on a real change** (the old `snap.game.speakerId` /
    `snap.game.proTemId` differs from the newly elected candidate). A tick
    that re-elects the same Speaker is a no-op. Log under `2.2.1`.

18. **[Open @ CP1 — recommend DEFER beyond Speaker / Pro Tem]** The
    reference's "congressional leadership" also names Majority / Minority
    Leader and Majority / Minority Whip (and Whip "only if congressional
    officers are created"). AMPU has **no** majority-leader / whip selection
    today (`grep` confirms no `MajorityLeader` / `MinorityLeader` / `Whip`
    field). Recommend **defer** to a future PR that adds those officers; do
    not invent them in PR2b. Documented so it is not mistaken for an omission.

### F. Faction-leader and party-leader Administrative + Governing

19. **[Locked]** **Becoming faction leader** also grants `admin +1` and
    `governing +1` (in addition to `command +1` and `legislative +1` from
    AC #4) — the reference lists faction leader on all four Earn tables.
    All four grants ship at the **same** site, each guarded by its own
    `addSkillPoint` / `addCommandPoint` real-change boolean. One log line
    per stat that actually rose (so a fresh leader at all-below-cap gets
    four lines; a leader already at command 5 / admin 5 sees fewer).

20. **[Locked]** **Becoming party leader** also grants `governing +1` (per
    the reference's Governing Earn list). Hook same as AC #5
    (`runPhase_2_2_4_PartyLeaders`), real-change only. Log under `2.2.4`.

### G. Cross-cutting guardrails (assert nothing leaked in)

21. **[Locked]** PR2b makes **no change to the PV formula** (`src/pv.ts`)
    and **no change to any Use gate** (presidential `command >= 2`; SCOTUS
    `judicial >= 2`; Gen `military >= 3`; Adm `military >= 2`; sponsor
    `legislative >= 1`; gov-action `governing` %). Grants feed those gates
    only by raising the underlying stat.

22. **[Locked]** PR2b adds **no new field** to `Politician`, `GameState`, or
    any snapshot type, and **no save migration** is required: it only
    reads/increments existing `skills` / `command` and adds constants +
    helpers + grant sites + log lines. Old saves load and play unchanged
    (they simply begin to accrue earn going forward). The cap (5) and the
    PR2a loss-helper semantics are unchanged.

23. **[Locked]** PR2b **does not duplicate** any grant in the
    "ALREADY COVERED" rows of F-RECONCILE. Specifically, no new command
    grant is added at the CC-President, Father-of-the-Constitution,
    Federalist-author, kingmaker-protege graduation, or battle-survivor
    sites; no new primary career-track skill grant is added. The reviewer
    can audit by grepping for any new `command +1` insertion at those
    file:line anchors.

24. **[Locked]** `npm run build` (tsc + vite) passes and `npm run lint` (tsc
    `--noEmit`) is clean. Any `as const satisfies` exhaustiveness on the
    new constants compiles.

25. **[Open @ CP1 — recommend OPTIONAL: skip in PR2b unless trivial]**
    **Symmetric majority-ground-wins → `admin +1`** (the mirror of PR2a's
    `majorityGroundLossAdmin`). PR2a already keeps the per-phase tallies
    `groundWinsBefore` / `lostThisPhase` / `wonThisPhase` at
    `revolutionaryWar.ts:161–197`; adding `if (wonThisPhase > lostThisPhase
    && wonThisPhase > 0) { applyBattleEarn(snap, general, { admin: 1 }) }`
    is ~6 lines. Recommend **IN** if the helper symmetry is clean
    (an `addSkillPoint`-routed `applyBattleEarn` mirror of PR2a's
    `applyBattleLoss`), **OUT** if it bloats the PR. Architect confirms at
    CP1.

## Edge cases

- **Stat already at cap (5)** — every grant is a **no-op**: helper returns
  `false`, no log line. A politician at `command 5` does not log a spurious
  "no change" line on becoming faction leader.

- **F-DOUBLING for cabinet-confirmation hitting the cap mid-grant** — a
  politician at `admin 4` with Egghead and Efficient earns `admin +4` in
  raw arithmetic, but `addSkillPoint` clamps to 5 and returns `true` on the
  single actual rise from 4 → 5. The log line reads `"admin 4 → 5"`, not
  `"4 → 8"`. The reference does not specify cap behavior; clamp-at-cap is
  consistent with all other AMPU stat changes.

- **First install vs. re-validation in faction-leader phase** — the
  faction-leader phase has three paths: Step 2 install (no incumbent / 
  invalidation), Step 3 challenge-success, and the Step 4 invariant sweep
  (which may re-validate without changing anyone). PR2b grants ONLY on
  Step 2 install and Step 3 challenge-success; the invariant sweep is a
  no-op.

- **Same politician returning to a cabinet post in a later term** — AC #8
  ("initial appointment to Sec of State") wording: per F-RECONCILE the
  reference says "initial appointment". Without a durable "has held office
  X before" field (out of scope, Q9), PR2b uses the `addCommandPoint`
  boolean: if the politician's command is already at 5 (likely if they
  previously held the office and got the bump), the re-grant silently no-ops.
  Acceptable approximation; flag Q9 for a future "office history" pass.

- **Cabinet-confirm F-DOUBLING and the Sec of State command grant stack** —
  on appointment to Sec of State, AC #8 grants `command +1` AND AC #15
  grants `admin +1/+2/+2/+4`. These are two separate grants at the same
  site; both log lines fire (where they cause real changes). Intended:
  the reference lists Sec of State on both the Command and Admin Earn lists.

- **War-active gate flips mid-phase** — `runPhase_2_3_2_Military` runs
  during phase 2.3.2; war-active is checked at the call site. If a war
  starts the same tick as a Sr Gen appointment (`runPhase_2_4_3_Events`
  fires later in the tick), the gate sees no active war and grants no
  command. This is the correct semantics (the reference says "while a major
  war is active"); PR2b does not change the phase order.

- **Bill with mixed meter deltas (e.g. `revenue +1, economic -0.5`)** —
  AC #10 says "any positive delta improves". The current
  `BILL_TEMPLATES` (`phaseRunners.ts:2775–2784`) all have at least one
  positive on the canonical bills; the Tariff Reduction has only `revenue
  -0.5, economic +0.5` — the +0.5 grants. Logging text should be neutral
  ("`{sponsor} gains command from passage of {bill.title}`") rather than
  asserting an unambiguous direction. Flag Q3 for the human to confirm.

- **Sponsor of a passed bill who is also the faction leader** — they get
  the command from the bill passage (AC #10) but no double-grant from being
  faction leader (the leader grant fires only at the leadership phase, not
  per-bill). Likewise the speaker grant (AC #17) does not stack with the
  per-bill sponsor grant unless they are different events on different
  ticks.

- **CPU vs. player politicians** — all grants fire for **every** politician
  (the existing phase logic already iterates all factions). CPU stars
  accrue symmetrically; only the player's roster surfaces the detail, but
  the data stays consistent (matters for downstream PRs).

- **Career-exit secondary-skill pool empties** — the AC #12 secondary roll's
  pool is `TRACK_SECONDARY_SKILLS[track].filter((k) => p.skills[k] < 5)`;
  an empty pool is a silent no-op (mirrors the existing themed-trait
  pool-empty behavior at `phaseRunners.ts:320`).

- **Senior General appointment during peacetime followed by war** — AC #9
  gates on war-active **at the moment of appointment**. A general appointed
  before a war starts does NOT retroactively get the bump when the war
  begins. To grant on war-start would require a separate "war-start sweep"
  hook (not built in PR2b; documented as a possible refinement).

- **Pre-existing `Math.random` in the resolver** (the PR2a Q6 deferral) —
  PR2b adds no new randomness, so the question is moot. PR2b's
  `Math.random` count is unchanged.

## Out of scope

Named explicitly so the architect does not pull adjacent or later-PR work
into PR2b:

- **Trait gains, trait loss, expertise changes.** PR1 covers expertise
  earn; PR3 covers trait loss + conflict; PR4 covers trait election effects.
  PR2b adds no trait or expertise grant — the cabinet-confirm doubling
  *reads* `Egghead` / `Efficient` but does not grant them.
- **Ranking member as an office.** AMPU does not implement ranking-member
  (`grep` confirms — `runPhase_2_2_2_Committees` writes only `chairs`). The
  reference names ranking members as a Command and Legislative earn site;
  PR2b skips it. DEFER.
- **Filibuster.** AMPU has no filibuster phase or trigger. The reference's
  "successful filibuster → +1 command" Earn is DEFER.
- **Successful event implementation (Efficient exemption).** No
  per-politician implementer concept in `resolveEraEvent`; DEFER.
- **Gov action → command (+1, +1 again if it moves a meter).** Governor
  actions move state `bias`, not national meters, and there is no
  "guaranteed vs. rolled" distinction. DEFER until governor actions are
  redesigned.
- **2+ terms as Senator / Governor → admin.** No term counter on
  `Politician` today. Adding one is a state-shape PR. DEFER (Q7).
- **Ambassador appointment** (and the at-war-with-their-nation Command
  bump). AMPU has no ambassador appointment phase (consistent with PR1).
  DEFER.
- **Rev-War-era anytime evos granting `military` 2× the normal rate.** The
  reference says "2 Rev War-era evos" for Military earn; AMPU's anytime
  templates do not tag era-of-origin. DEFER until anytime tagging adds it.
- **The `Leadership` trait's own Earn list** (e.g. "all career tracks except
  Judicial mint Leadership"). The Leadership trait is mechanical, not an
  ability. Trait gain is PR4; PR2b touches numeric stats only.
- **Master Kingmaker effects.** Master Kingmaker is a reference trait
  flagged absent in the gap analysis; mentioned for completeness, not
  built in PR2b.
- **Majority Leader / Minority Leader / Whip selection.** AMPU has no such
  field. DEFER (AC #18).
- **PV formula changes.** Earn raises the underlying stat; PV recomputes
  via the existing `refreshPv` sweep. PR2b does not touch `src/pv.ts`.

## Open questions / assumptions

Decision-first ordering. Q1 is the CP1 headline.

1. **(HEADLINE — one PR or sub-split? PM recommends ONE PR / Option A.)**
   Walking the F-RECONCILE "NEW in PR2b" rows: the actual insertion sites
   are **~9 phase hooks**, each adding **1–4 lines** of "look up the const,
   call `addCommandPoint` / `addSkillPoint`, log on real change":
   - `runPhase_2_2_1_CongressLeadership` (~2 sites: speaker, pro-tem)
   - `runPhase_2_2_2_Committees` chair + `appointCCCommittees` chair (2 sites)
   - `runPhase_2_2_3_FactionLeaders` install + challenge-success (2 sites,
     each granting 4 stats — but one helper-route each)
   - `runPhase_2_2_4_PartyLeaders` (install + re-elect distinguished by AC #7)
   - `runPhase_2_3_1_Cabinet` (cabinet-confirm admin + Sec-of-State command
     — one loop iteration covers both)
   - `runPhase_2_3_2_Military` (Sr Gen + Sr Adm, gated)
   - `runPhase_2_6_3_Floor` (bill-passed meter-improve sponsor command)
   - `rollThreshold` (secondary-skill roll)

   Plus `src/types.ts` (one const + three tables: `OFFICE_COMMAND_GRANT`,
   `OFFICE_ADMIN_GRANT`, `TRACK_SECONDARY_SKILLS`, the `ABILITY_EARN_RULES`
   tunable) and the helper module extension (~10 lines). **Estimated diff:
   well under 300 lines, mostly `+1` grants and log strings.** Self-contained
   per-phase; nothing entangled across sites. Reviewer can audit hook-by-hook.

   **Recommendation: ONE PR (Option A)**, three reasons:
   - **Diff size is bounded.** The pattern is mechanical and well-rehearsed
     (PR1's `addExpertise` already at every same hook). No new state shape,
     no new RNG path.
   - **Coherent balance lever.** Earn grants all push PV up; reviewing them
     together lets the playtester tune the *total* upward pressure against
     PR2a's downward pressure, not piece by piece.
   - **No internal dependencies forcing a split.** Each grant is independent;
     a sub-split would just be arbitrary slicing of identical patches.

   Sub-split (Option B) would only make sense if (a) the diff exceeds ~300
   lines (it should not — confirm at build), or (b) the human wants the
   command grants in isolation to playtest the presidential-eligibility
   feel before adding the cabinet/leadership PV bumps. State Option B for
   the human's call: **PR2b-i = command grants** (AC #4–#11) + **PR2b-ii =
   per-ability secondaries, cabinet-confirm, Speaker/ProTem** (AC #12–#20).

2. **(Secondary-track skill table.)** Confirm `TRACK_SECONDARY_SKILLS` in
   AC #13. The reference's wording "all other tracks but X grant Y" is
   slightly tangled; PR2b's table is the cleanest reading. Confirm:
   - Admin → `[legislative, governing]`
   - Military → `[admin]`
   - Governing → `[admin, legislative]`
   - Legislative → `[governing, admin]`
   - Judicial → `[]`
   - Private → `[governing, admin]`
   - Backroom → `[]`
   This is a designer call; the trigger (extra `rollThreshold` roll) is
   locked. **(c)** Confirm the secondary-roll odds: recommend **0.25**
   (half the primary 0.50) so secondary skills accrue at half the rate of
   primaries — keeps the existing primary-feel dominant and adds gentle
   secondary growth.

3. **(Meter-improve detection — what counts as "improves a meter"?)**
   Recommend **"any positive delta in `bill.effects.meters` OR a positive
   `bill.effects.domesticStability`"**, evaluated **statically** at the
   bill template's effect (not at the post-`applyEffect` meter state — that
   would double-count the meter clamp). Per AC #10. Confirm at CP1; the
   alternative (post-apply delta) is more expensive and not obviously
   better.

4. **(F-RECONCILE DEFERs the human should sanity-check.)** Crisis
   legislation, successful filibuster, gov-action command, event-impl
   command (Efficient exemption), and battle-win command are all DEFER —
   none have clean hooks. Confirm the human is comfortable that PR2b ships
   without those (~5 reference Earn lines unwired). They are listed in
   F-RECONCILE for a future PR that builds the missing systems.

5. **(PMG and KeyAdvisor in the cabinet-confirm admin doubling.)** The
   reference does not split cabinet-level posts by tier. Recommend
   **including** both in `OFFICE_ADMIN_GRANT` (both seats grant `+1/+2/+2/+4`
   on confirmation) — they are full cabinet positions in
   `runPhase_2_3_1_Cabinet`. The architect can exclude them (replicating
   PR1's PMG / KeyAdvisor expertise-none stance) at CP1; trivial flag flip.

6. **(Symmetric majority-ground-wins → admin +1, AC #25.)** Recommend
   **IN** for symmetry with PR2a's majority-loss admin penalty (the
   tallies are already there; ~6 lines via an `applyBattleEarn` mirror).
   The architect can defer if it bloats the PR.

7. **(2+ terms as Senator/Governor → admin: how to track terms.)** PR2b
   does not add a term counter. Adding `termsAsSenator: number` /
   `termsAsGovernor: number` to `Politician` would touch the type, every
   factory site, `repair()`, and incrementation logic in
   `runPhase_2_9_5_Governors` / `runPhase_2_9_6_Congressional`. This is a
   meaningful state-shape PR worth its own slice — recommend **DEFER**
   as a follow-up (with PR2c or rolled into the cabinet overhaul PR5
   where Sen/Gov tenure starts to matter for confirmation hearings).

8. **("Re-elected as party leader" semantic refinement.)** AC #7 uses the
   simple signal "`leaderId` unchanged from prior tick AND the politician
   was the leader". This grants `legislative +1` **every tick the
   incumbent retains the seat** — potentially too generous (a 30-year
   party-leader would gain `legislative +1` per phase tick, capped at 5).
   Mitigation: the cap (5) bounds it; the helper no-ops past cap. But the
   reference may mean "every party-leader election cycle" rather than
   "every tick". Recommend confirming at CP1 — a cycle-based check (e.g.
   gated by year % 4 === 0 to match the presidential cycle) would be more
   conservative. **Default in PR2b: every-tick with the cap as the
   safety**; designer can dial back.

9. **(AC #8 "initial appointment to Sec of State" idempotency.)** PR2b
   does not add a "has previously held office X" durable record. The
   approximation: `addCommandPoint` is a no-op at cap, so a returning Sec
   of State at command 5 silently no-ops; one already at 4 would gain
   again (small designer concern). Strict idempotency would require a
   `previousOffices: OfficeType[]` field on `Politician`. Flag as a
   refinement; default acceptance is the cap-bounded approximation.

10. **(Assumption — no Master Kingmaker effects yet.)** The reference's
    "becoming protege of a master kingmaker (guaranteed command +1)" Earn
    is on the Command list. AMPU's kingmaker graduation grants command
    via the 45% / 45% / 10% weighted roll (`phaseRunners.ts:1356–1369`),
    not a guaranteed `+1` for master-kingmaker proteges (Master Kingmaker
    is an absent reference trait — gap analysis line 79). PR2b does NOT
    add Master Kingmaker. Mentioned so it is a conscious DEFER, not an
    oversight.

11. **(Assumption — no field changes / no migration.)** Per AC #22, PR2b
    is field-additive only on constants and helpers, never on snapshot
    types. Old saves load and play. Confirmed against `Politician`
    interface (`src/types.ts:547–590`) — no new optional field is
    needed for any earn path PR2b builds.

12. **(Determinism — secondary-roll RNG path.)** AC #12's secondary roll
    uses `chance(ABILITY_EARN_RULES.secondaryTrack)` from `src/rng.ts`,
    consistent with the primary roll. No new `Math.random` is introduced
    anywhere. (`src/rng.ts` still wraps `Math.random` per the PR2a Q6
    deferral; PR2b does not relitigate this.)

---

**Spec file:** `/home/user/AMPU/docs/specs/abilities-earn-expansion.md`
