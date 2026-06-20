# Spec: Abilities Earn/Loss Alignment (PR2)

## Vision (as given)

Second slice of the abilities / expertise / traits alignment epic (PR1, the
expertise axis, has merged). The canonical design reference defines six abilities
(Command, Legislative, Governing, Judicial, Administrative, Military), each with a
detailed **Earned / Use / Loss** table. AMPU implements the Use gates well, the
Earn coverage thinly, and **the Loss machinery not at all** — no engine code ever
decrements a skill or command. PR2 closes that gap: add the loss system
(old-age decay, negative anytime evolutions, battle-loss penalties) and expand the
earn coverage (the ~12 reference command grants plus the primary/secondary
career-track nuance) so AMPU's seven numeric stats accrue and erode the way the
reference describes.

Because abilities drive PV and PV drives elections, every magnitude here is a
balance lever, so the work is scoped conservatively and — per the headline
recommendation below — **split**, with this spec covering **PR2a: the Loss
machinery only**.

## Historical grounding (binding)

Source of mechanics: `docs/research/source-abilities-expertise-traits.md`
(BINDING design reference, the six **ABILITIES** Earn/Use/Loss tables, plus the
**Leadership** trait's own loss list). Source of scope:
`docs/research/abilities-expertise-traits-gap-analysis.md` ("System 1 —
Abilities"). This is an engine-alignment PR, not era content, so there is no
separate historian brief — the design reference is ground truth. The locked
reconciliation decisions D1 (`backroom` stays a skill) and D2 (`command` stays a
separate field) govern how the reference's six abilities map onto AMPU's seven
numeric stats (six skills + `command`).

Binding facts carried from those documents (the F-facts restate them as testable
constraints):

- **F-LOSS triggers (reference).** The reference's only ability-loss triggers are
  **old-age rolls**, **negative anytime evolutions**, and **losing battles by
  difficulty tier**. No other loss source exists, and PR2a adds none.
- **F-BATTLE-TIER mapping (reference, per ability).** Battle-loss penalties are
  tier- and ability-specific:
  - **Legislative** — loses on **moderate or easy** losses.
  - **Governing** — loses on **moderate or easy** losses.
  - **Administrative** — loses on **moderate or easy** losses, **and** on losing
    the **majority of battles that phase** of the war.
  - **Military** — loses on **difficult, moderate, and easy** losses.
  - **Judicial** and **Command** — **no** battle-loss penalty (old-age + anytime
    only).
  - The **Leadership trait** is lost on **medium or easy** battle losses and on
    old-age rolls — flagged as adjacent, deferred to the trait-loss PR (PR3); see
    Out of scope.
- **F-COMMAND-LOSS scope.** Per the reference, Command loss comes **only** from
  old-age and anytime evolutions — **never battles**. This is load-bearing: it
  protects the presidential-eligibility gate (see F-PV-GATE).
- **F-CAP (locked context).** Abilities are integers **0–5**, capped at
  `ANYTIME_EVENTS_RULES.skillCap = 5` / `commandCap = 5`
  (`src/types.ts:434–435`). Loss is the mirror: floored at **0**.
- **F-PV-GATE (balance).** PV is `skills × office-weight × 4 + command × 10`
  (`src/pv.ts:65–87`), and presidential candidacy requires `command >= 2`
  (`phaseRunners.ts:3007`). Therefore any loss directly lowers PV (election
  strength) and a `command` loss can drop a politician below the presidential
  gate. Magnitudes must be conservative (see Open Questions Q2/Q3).
- **F-DETERMINISM (CLAUDE.md).** Engine code is pure over the snapshot and must
  use `src/rng.ts` (`chance`, `d`, `pick`, `clamp`) for any roll — never
  `Math.random`. (Note: `src/rng.ts` currently wraps `Math.random` internally and
  `revolutionaryWar.ts:86,95` calls `Math.random` directly — a pre-existing
  convention violation; PR2a must not add new direct `Math.random` calls and
  should route its battle hooks through `rng.ts`. Fixing the existing two calls is
  a tracked nicety, flagged Q6, not required for PR2a.)

## Player experience

Abilities stop being a one-way ratchet. An aging legend slowly loses a step — a
73-year-old former general's `military` ebbs, a long-tenured senator's edge dulls
— so the player feels real pressure to cycle in fresh talent rather than ride one
superstar forever. A general who loses winnable battles takes a competence hit,
making battlefield failure sting beyond the casualty list. The losses are gentle
and legible (a log line each time, conservative magnitudes), so the game gains
the *tension of decline* without feeling punishing or random. This is the half of
the ability lifecycle AMPU has never had.

## User story

As a player managing a faction across decades, I want my politicians' abilities to
**erode** through old age, misfortune, and battlefield defeat — not just grow — so
that aging and failure carry real strategic weight and I must keep developing new
talent instead of leaning on immortal, ever-improving stars.

## Scope of THIS spec (PR2a — Loss machinery only)

Per the headline recommendation (Open Questions Q1), the abilities earn/loss gap
is **split** and this spec covers **only the Loss machinery**: old-age ability
decay, negative anytime evolutions, and battle-tier loss penalties, across all
seven numeric stats per the reference's per-ability tables. The **Earn expansion**
(the ~12 command grants + primary/secondary career-track grants + cabinet /
leadership / governor-tenure earn nuance) is specified as **PR2b** and deferred
(see Out of scope and Open Questions Q1). Rationale and the PR2b outline are in
Open Questions.

## Acceptance criteria

Tagged `[Locked]` (decision baked in) or `[Open @ CP1]` (human/architect resolves
at checkpoint; PM recommendation in parentheses). The headline `[Open @ CP1]` is
the split decision (Q1).

### A. A single loss helper + tuning const (mirror the PR1 pattern)

1. **[Locked]** A new tuning const `ABILITY_LOSS_RULES` is added to
   `src/types.ts` (placed near `ANYTIME_EVENTS_RULES` / `MORTALITY_RULES`,
   `as const satisfies …` like its neighbors) holding **all** magnitudes and odds
   PR2a introduces — no magic numbers in engine bodies. It is the single source
   for the old-age, anytime, and battle-loss tunables named in this spec.
2. **[Locked]** A pure helper (recommend `src/engine/abilities.ts`, mirroring
   `src/engine/expertise.ts`'s `addExpertise`) exposes a single decrement
   primitive used by **every** loss path, e.g.
   `loseSkill(p, key, amount): boolean` and `loseCommand(p, amount): boolean`,
   each clamping to **0** and returning `true` iff the value actually dropped (so
   callers gate their log line on a real change). No loss path mutates
   `p.skills` / `p.command` directly.
3. **[Locked]** The helper is **deterministic and pure** (no `Math.random`; any
   probability comes from `chance()` *at the call site*, not inside the helper)
   and never touches PV directly — PV recomputes via the existing `refreshPv`
   sweeps already present in the affected phases (`phaseRunners.ts:2065` for
   old-age; the engine refreshes PV after the war/battle phase).

### B. Old-age ability decay (in `runPhase_2_4_1_Deaths`)

4. **[Locked]** Old-age decay is evaluated in `runPhase_2_4_1_Deaths`
   (`phaseRunners.ts:2024–2066`), the existing mortality phase, for every living,
   non-retired politician — **after** the death/retire rolls so a politician who
   just died/retired this tick is not also decayed (those branches `continue`
   already). It uses the phase's existing `MORTALITY_RULES.eraConfig[era]` loop
   shape and the single trailing `refreshPv` (line 2065) recomputes PV.
5. **[Locked]** Decay is **age-gated and probabilistic**: below a threshold age
   (`ABILITY_LOSS_RULES.oldAge.minAge`, recommend **70**, aligned with the
   existing PV age-penalty break at `pv.ts:83` and the 70+ death/retire brackets)
   the chance is **zero**; at/above it, a per-turn `chance(...)` roll (recommend a
   small base, **~8–12%**, optionally rising with age via the existing bracket
   pattern) decides whether **one** decay event occurs this turn.
6. **[Open @ CP1 — recommend −1 to ONE random eligible stat]** When a decay event
   fires, it removes **one point** from **one** stat. Recommend choosing the stat
   **randomly via `rng.ts` (`pick`)** from the politician's stats that are
   currently **> 0**, applying `−1` (floored at 0). Rationale: random-single keeps
   the hit small and legible and avoids gutting a specialist in one turn.
   Alternatives the architect may pick at CP1: decay the politician's **highest**
   stat (models "losing your best step") or **all** stats by a fractional/periodic
   schedule (rejected as too punishing — see Edge cases).
7. **[Locked]** Old-age decay **may** target `command` (the reference lists
   old-age as a Command-loss source) and **all seven** numeric stats including
   `backroom` (D1 — `backroom` is treated like the other abilities for loss, since
   the reference's old-age loss is general; flagged Q4). Judicial is eligible
   (reference lists old age for Judicial).
8. **[Locked]** Each decay that actually lowers a stat writes one `addLog` line
   under phase `2.4.1` consistent with the surrounding death/retire logs (e.g.
   `"{name} ({state}, age N) has lost a step — Military 3 → 2."`), carrying
   `politicianId`. A fired-but-no-op roll (all stats already 0 — vanishingly rare)
   is silent.
9. **[Open @ CP1 — recommend the `Hale` mitigation, defer the rest]** Longevity
   should feel fair: recommend that a politician with a longevity trait
   (`Hale`, if present in the trait union; otherwise skip) has a **reduced** decay
   chance (multiplier in `ABILITY_LOSS_RULES.oldAge`), mirroring how `Frail`
   multiplies death odds (`phaseRunners.ts:2044`). If `Hale` is not yet in the
   trait union (it is a reference trait flagged absent in the gap analysis), this
   AC is **deferred** to the trait PRs and old-age decay ships without a longevity
   modifier. The architect confirms at CP1.

### C. Negative anytime evolutions (data + applier fix)

10. **[Locked]** PR2a enables anytime events to **lower** a stat. The
    `AnytimeEventEffect` union already supports `skillBump`/`commandBump` with an
    arbitrary `amount` (`src/data/anytimeEvents.ts:25–26`); a negative `amount`
    is a loss. No new effect kind is required.
11. **[Locked — BUGFIX, prerequisite]** The applier's cap guard currently **blocks
    all mutation at the cap regardless of sign**:
    `if (p.skills[eff.skill] < ANYTIME_EVENTS_RULES.skillCap) { … }`
    (`phaseRunners.ts:2307`) and the matching `commandBump` guard (line 2315). A
    stat **at 5** can therefore never be decremented by a negative bump. The guard
    must be widened so a negative `amount` applies when the stat is **> 0** (and a
    positive `amount` still only applies when **< cap**), routing the actual write
    through the Part-A `loseSkill`/`loseCommand` helper (floor 0) for the negative
    branch and the existing `clamp(..., 0, cap)` for the positive branch.
    `didMutate` is set only on a real change (the helper's boolean return).
12. **[Open @ CP1 — recommend 2–4 templates, modest weight]** A small set of
    negative-evolution templates is added to `ANYTIME_EVENT_TEMPLATES`
    (`src/data/anytimeEvents.ts`) so the loss path actually fires in play.
    Recommend **2–4** era-flavored templates (e.g. a scandal/burnout that costs
    `legislative −1`; a governing setback `governing −1`), each with a **low
    weight** relative to the existing positive/illness pool and a `pvHit` sibling
    consistent with the existing `pvHit`/`pvBump` invariant
    (`phaseRunners.ts:2148`). Exact templates/text/weights are tuning calls for
    the architect/designer; the *capability* (negative bumps fire and apply) is
    `[Locked]`.
13. **[Locked]** The anytime-template validator (`validateAnytimeTemplates`,
    `phaseRunners.ts:2108–2150`) must continue to pass. Its `FORBIDDEN_SKILLS`
    list (`['admin','judicial','military','backroom']`, line 2124) currently bars
    those skills from anytime bumps; any negative template PR2a adds must target a
    **permitted** skill (`legislative`, `governing`) or `command`, **or** the
    architect must consciously relax `FORBIDDEN_SKILLS` for the loss case
    (recommend: keep the restriction for PR2a and only ship `legislative` /
    `governing` / `command` negatives — flagged Q5). Adding a forbidden-skill bump
    throws at startup by design, so this is compile-/boot-enforced.

### D. Battle-loss penalties (in the Revolutionary War battle resolver)

14. **[Locked]** Battle-loss ability penalties are applied in
    `runRevWarBattles` (`src/engine/revolutionaryWar.ts:106–176`), at the point
    each battle's `win`/`loss` outcome and (for ground battles) `difficulty` are
    known (the ground loop resolves `difficulty` at line 143 and `win` at 146; the
    naval engagement resolves `win` at 122 — naval has **no** difficulty tier).
    The penalty is applied to the **relevant commander(s)** for that battle: the
    **senior general** (and participating generals) for ground losses, the
    **senior admiral** for naval losses, consistent with how the resolver already
    scopes participants (`revolutionaryWar.ts:80–84, 112–113`).
15. **[Locked]** Penalties follow **F-BATTLE-TIER** exactly:
    - On a **lost ground battle**: the commanding general loses `military −1`
      (all tiers), `governing −1` and `legislative −1` only on **moderate or
      easy** losses (per the reference's Governing/Legislative tables), and
      `admin −1` only on **moderate or easy** losses.
    - On a **lost naval battle**: the admiral loses `military −1`. (Naval battles
      carry no difficulty tier in AMPU, so the moderate/easy-only penalties do not
      apply to the naval engagement — flagged as an edge case; recommend treating
      a naval loss as the `military` hit only.)
    - **Command** and **Judicial** are **never** touched by battle losses
      (F-COMMAND-LOSS / reference).
    These writes go through the Part-A helper (floor 0). The architect may scope
    "which generals" (senior only vs. all participating, AC #14) at CP1; recommend
    **senior commander only** to keep the magnitude small (Q3).
16. **[Open @ CP1 — recommend DEFER to PR2b]** "Losing the **majority** of
    battles that phase" → `admin −1` (reference, Administrative). The resolver
    already tallies `currentGroundWins` / `currentGroundLosses` and runs 1–3
    ground battles per phase (`revolutionaryWar.ts:158–161`), so a phase-level
    majority check is *computable* after the ground loop. Recommend including the
    **majority-loss `admin −1`** in PR2a only if low-cost (the tallies are right
    there); otherwise defer. The architect confirms at CP1. (The symmetric Admin
    *earn* for winning the majority is PR2b regardless.)
17. **[Locked]** Each battle-loss penalty that actually lowers a stat writes one
    `addLog` under phase `2.7.2` next to the existing battle logs (e.g.
    `"{name} falters after the defeat at {battle} — Governing 2 → 1."`). The
    resolver's downstream `refreshPv` recomputes PV; PR2a adds no PV write.
18. **[Locked]** PR2a does **not** alter the existing battle **earn** at
    `revolutionaryWar.ts:101–103` (survivors gain `military +1` on a 10% roll) —
    that is pre-existing and stays. PR2a also does not change casualty logic
    (`applyCasualties`), win/loss thresholds, or the French-alliance path; it only
    **adds** the ability-loss-on-defeat hook.

### E. Cross-cutting guardrails (assert nothing leaked in)

19. **[Locked]** PR2a makes **no change to the PV formula** (`src/pv.ts`) and **no
    change to any Use gate** (presidential `command >= 2` at 3007; SCOTUS
    `judicial >= 2`; Gen `military >= 3` / Adm `military >= 2`; sponsor
    `legislative >= 1`; gov-action `governing` %). Loss feeds those gates only by
    lowering the underlying stat — the gates themselves are untouched.
20. **[Locked]** PR2a adds **no new field** to `Politician`, `GameState`, or any
    snapshot type, and **no save migration** is required: it only reads/decrements
    existing `skills` / `command` and adds a const + helper + templates + log
    lines. Old saves load and play unchanged (they simply begin to experience loss
    going forward).
21. **[Locked]** `npm run build` (tsc + vite) passes and `npm run lint` (tsc
    `--noEmit`) is clean. The `as const satisfies Record<Era, …>` exhaustiveness on
    any era-keyed addition compiles.

## Edge cases

- **Stat already at 0** — any loss path is a **no-op** (helper returns `false`, no
  log). A politician with all stats at 0 (only possible for a bench filler) never
  logs spurious decay.
- **Stat at 5** — old-age decay and **negative anytime evos must still apply**;
  the current applier guard (`< cap`) wrongly blocks this and is fixed by AC #11.
  (Battle losses are `−1` and naturally apply at 5.)
- **`command` dropping below the presidential gate** — a politician at `command 2`
  who loses a point via old-age/anytime falls to `command 1` and becomes
  **ineligible to run for President** (`phaseRunners.ts:3007`). This is intended
  (decline has stakes), but it is the single sharpest balance edge: keep
  command-loss **rare** (old-age/anytime only, never battles) and conservative, so
  star executives are not casually disqualified. Flagged Q2.
- **Old-age decay feeling punishing** — the explicit anti-goal. Decay must be
  **at most one point, one stat, per turn**, gated to age ≥ ~70 at a single-digit
  base chance; a politician should not visibly crater over a couple of turns. If
  the optional `Hale` mitigation (AC #9) is unavailable, lean to the **low** end
  of the chance range. Reviewer/playtester verifies it reads as a gentle ebb.
- **Naval loss with no difficulty tier** — the naval engagement
  (`revolutionaryWar.ts:117–134`) has no `difficulty`; treat a naval loss as the
  `military −1` hit only (the moderate/easy-only penalties have no tier to key
  on). Flagged in AC #15.
- **Senior commander dies in the same battle** — `applyCasualties`
  (`revolutionaryWar.ts:64–104`) can kill participants and **spares the senior
  general/admiral** (line 84). The ability-loss hook must skip any commander who
  was just killed this battle (check `deathYear`), so a dead general is not also
  "demoted." Order the loss hook to read the post-casualty state.
- **War with no senior general/admiral assigned** — the resolver auto-appoints
  (`appointMilitary`, line 110) before resolving; if a commander slot is still
  empty (no eligible military politicians), there is simply no one to penalize —
  no-op, no crash.
- **Multiple losses in one phase** — the ground loop can produce up to 3 losses in
  a turn; each lost battle applies its own `−1` (floored), so `military` can drop
  by up to 3 in a disastrous turn. Recommend capping per-phase battle loss to the
  commander's available points (natural via the 0 floor) and accepting the
  worst-case as intended (a catastrophic campaign). Flag for playtest balance.
- **CPU vs. player politicians** — all loss paths run for **every** politician
  (old-age and battles already iterate all; anytime fires faction-agnostically),
  so CPU stars decline symmetrically. Only the player's roster surfaces the detail,
  but the data stays consistent (matters for future PRs).
- **Pre-existing `Math.random` in the resolver** — `applyCasualties` uses
  `Math.random` at lines 86/95. PR2a's new hooks must **not** add more; route any
  randomness (e.g. which-stat, if the architect makes battle loss probabilistic)
  through `rng.ts`. Cleaning the two existing calls is optional (Q6).

## Out of scope

Named explicitly so the architect does not pull adjacent or later-PR work into
PR2a:

- **The entire Earn expansion = PR2b** — the ~12 reference **command grants**
  (becoming faction leader, party leader, committee chair / ranking member,
  initial Sec-of-State appointment, Sr General/Admiral in wartime, successful
  event implementation, succeeding a gov action / again on a meter move, crisis
  legislation signed, successful filibuster, legislation that moves a meter,
  winning a battle / a majority of battles / a major war), the **primary/secondary
  career-track** skill nuance (secondary cross-track grants; primary already
  exists at `phaseRunners.ts:300–313`), **cabinet-confirmation → Administrative**
  (doubled with Egghead/Efficient), **2+ terms as governor/senator → Admin**, and
  congressional-leadership → Legislative. PR2a builds **none** of these.
  - NOTE (verified, corrects the gap analysis): several command grants the gap
    analysis called "missing" **already exist** — CC President grants `+1 command`
    (`continentalCongress.ts:145`), Constitutional-Convention framers grant
    `+1 command` (`constitutionalConvention.ts:157,167`), and battle survivors
    grant `military +1` (`revolutionaryWar.ts:102`). PR2b should reconcile against
    these (avoid double-granting), not re-add them.
- **Trait loss** — old-age advantageous-trait loss and the d6 trait-conflict roll,
  **including the reference's `Leadership`-trait loss on medium/easy battle
  losses** (F-BATTLE-TIER note), are **PR3**. PR2a touches **numeric stats only**,
  never traits — even where a battle loss would, per the reference, also cost a
  trait.
- **Expertise loss** — the reference defines none; PR1 added expertise as
  grant-only; PR2a adds no expertise change.
- **New abilities/Use gates** — admin≥2 cabinet minimum and other un-wired Use
  rules are PR5 (cabinet overhaul). PR2a changes no gate.
- **Generalizing loss to non-Revolutionary-War combat** — AMPU's only battle
  system today is `revolutionaryWar.ts`; PR2a hooks **that** resolver. If a future
  era adds war, its loss hook is that PR's job.
- **Fixing the seeded-RNG gap in `rng.ts`** — `rng.ts` wraps `Math.random`
  despite CLAUDE.md describing it as seeded; making the engine truly deterministic
  is a separate concern (Q6). PR2a only commits to *not adding* new `Math.random`.

## Open questions / assumptions

Decision-first ordering. Q1 is the CP1 headline.

1. **(HEADLINE — one PR or split? PM recommends SPLIT, Loss first; this spec is
   PR2a.)** The gap is large: a brand-new loss system **plus** ~12 command-earn
   hooks **plus** primary/secondary + cabinet/leadership/governor-tenure earn
   nuance. Recommendation: **split into PR2a (Loss) and PR2b (Earn), ship Loss
   first**, for three code-grounded reasons:
   - **Self-containment / reviewability.** Loss touches **three** well-bounded
     sites (the mortality phase `phaseRunners.ts:2024`, the anytime applier+data
     `2306`/`anytimeEvents.ts`, the battle resolver `revolutionaryWar.ts:106`) and
     adds **one** helper + **one** const. The Earn expansion, by contrast, fans out
     across ~8 phases (faction-leader, party-leader, committee, cabinet, military
     appointment, legislation floor, gov actions, battle wins) and must
     **reconcile with grants that already exist** (CC President, Con-Con,
     battle-survivor military) — a much larger, more entangled diff.
   - **Balance-testing surface.** Loss and Earn each move PV in opposite
     directions; shipped together, a playtest cannot tell whether the net feel
     comes from new decay or new grants. Landing Loss alone lets the human tune
     decay magnitudes against a known earn baseline, then tune Earn against a known
     loss baseline.
   - **Highest value, lowest risk first.** Loss is the single biggest *capability*
     gap (it is **entirely absent**), yet the **cleanest** to build; Earn is
     mostly additive polish on top of a working ratchet. Doing Loss first delivers
     the missing half of the lifecycle with the smallest, most reviewable change.
   - **Dependency:** neither half blocks the other; both are parallel-safe with the
     PR1 expertise code. If the human prefers one PR, fold the PR2b outline below
     in — but the recommendation is split.
   - **PR2b outline (follow-up):** wire the ~12 command grants at their phase hook
     points (reusing the PR1 `OFFICE_EXPERTISE`-style const pattern for an
     office→command / track→secondary-skill table), add secondary cross-track skill
     grants in `rollThreshold` (`phaseRunners.ts:294–340`), and add the
     cabinet-confirmation / governor-&-senator-tenure / congressional-leadership
     earn nuance — **reconciling against the already-wired CC-President, Con-Con,
     and battle-survivor grants** so nothing double-counts.
2. **(Command-loss magnitude vs. the presidential gate — the sharpest balance
   risk.)** Command loss (old-age/anytime only) can drop a politician below
   `command >= 2` and disqualify them from the presidency
   (`phaseRunners.ts:3007`). Recommend keeping command-loss **rare and capped at
   −1/event**, and confirming with the human that occasionally disqualifying an
   aging executive is *desired* drama, not a bug. (Conservative default: command
   is eligible for old-age decay but at the **low** end of the chance band.)
3. **(Battle-loss blast radius — senior commander only vs. all participants, and
   per-phase stacking.)** Recommend **senior commander only** and accept that 1–3
   ground losses in one turn can stack to `military −3` (floored at 0) as intended
   catastrophe. Architect/human confirms the radius and whether to cap per-phase
   stacking. This is the second-largest balance lever after Q2.
4. **(`backroom` loss — treat like the others? recommend YES.)** D1 keeps
   `backroom` a skill; the reference's old-age loss is general. Recommend
   `backroom` is **eligible for old-age decay** like the other six stats (it has no
   battle/anytime loss source anyway). Confirm at CP1; trivial to exclude if the
   designer prefers `backroom` immune.
5. **(`FORBIDDEN_SKILLS` and negative anytime evos.)** The anytime validator bars
   `admin/judicial/military/backroom` from anytime bumps (`phaseRunners.ts:2124`).
   Recommend PR2a ships negative anytime templates only for the **permitted**
   `legislative`/`governing`/`command`, leaving the restriction intact; relaxing it
   to allow e.g. an `admin −1` scandal is a conscious designer call deferred unless
   wanted. Confirm at CP1.
6. **(Assumption — `rng.ts` determinism + the existing `Math.random` calls.)**
   `rng.ts` currently wraps `Math.random`, and `revolutionaryWar.ts:86,95` calls
   `Math.random` directly (pre-existing CLAUDE.md violations). PR2a **assumes**
   these are out of scope and only commits to **not adding** new direct
   `Math.random`. Flagged so it is a conscious deferral, not an oversight; the
   human may fold the two-line cleanup into PR2a if desired.
7. **(Assumption — old-age decay defaults.)** In the absence of designer numbers,
   PR2a assumes: minAge **70**, base chance **~8–12%/turn** (optionally
   age-rising), **−1 to one random >0 stat** per fired event, optional `Hale`
   mitigation if the trait exists. All live in `ABILITY_LOSS_RULES` for one-place
   tuning; the human adjusts at playtest. Stated as the riskiest *game-feel*
   assumption (the spec's whole "not punishing" guardrail rides on these).

---

**Spec file:** `/home/user/AMPU/docs/specs/abilities-earn-loss.md`
