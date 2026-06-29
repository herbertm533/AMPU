# Digest — a06b07df "Territorial Delegates / Territorial Governors" (★ REJECTED)

**Source:** `docs/game/sources/a06b07df-can-a-position-for-territorial-delegate-be-added-for-the-house-can-terr/`
(1 chunk, 11 posts). politicslounge topic 5024, **Nov 29 – Dec 1, 2023**.
**Type:** Feature *request* thread, not a playthrough. **@theFreezerFlame** pitches
two new offices to give pre-statehood territories gameplay; **@vcczar (V, the
canonical author/designer) REJECTS it**, repeatedly and on the record.

> ★ **STATUS: REJECTED / DEFERRED.** This proposal "has come up like 3-4 times and
> every time V has been very vehement against it" (POST 2). Logged here so it is
> **not re-proposed as a build gap.** Re-open *only* if all three deferral
> conditions are met (see below).

---

## The proposal (theFreezerFlame, POST 1)

Goal: territories should have "more gameplay instead of just being there until
statehood." Two new positions:

- **Territorial Delegates**
  - Created by a law: **"Establish the Offices of Territorial Delegates."**
  - **Elected the same as the House.**
  - Can **serve on committees and propose legislation**, but **get NO floor votes
    until statehood** (i.e. a non-voting House member).
  - **Bonus points** to a delegate who proposes a **statehood-admission act that
    passes.**
- **Territorial Governors**
  - "Just governors but for territories."
  - New special **Gov Action: "Call on Congress to Admit Territory as State"** —
    **auto-succeeds**, with a **25% chance of a point bonus** to the party that
    passes it in Congress.
  - Possible alt action: a Territorial Governor can **"call for independence"
    instead if Domestic Stability is low enough.**
- **Shadow delegations** floated as a further position but explicitly
  deprioritized ("just having Delegates and Terr Govs is enough for me").

## The rejection (vcczar, POSTs 5, 8) — the durable part

V's reasoning, verbatim-sourced:

1. **Low value.** "Don't really see it as adding much to the game." (POST 5)
2. **Performance / turn-length cost.** Would be "helping make the turns take
   longer and probably helping slow down the processor." (POST 5)
3. **Politician-roster cost (the core blocker).** "I'd have to add terr govs and
   terr delegates to the house for **all terrs and hypothetical terrs**. Im
   imagining this means **at least 100 more people—most so obscure that even I
   haven't even heard about them**." (POST 8) — and V *is* the dataset author, so
   that is the obscurity bar (POST 9).

**Deferral conditions (POST 5) — all three required to revisit:**
> "If anything is done in regards to this it will be **(1) after early release**,
> and **(2) if there's popular demand** for it, and **(3) if it can be added to
> the game fairly easily**."

**Partial-overlap counter (theFreezerFlame, POST 10):** many real territorial
delegates *already exist* in the dataset because they were **elected to Congress
after statehood** — e.g. **John Crowell of Alabama** — "I assume most of them are
already there." So the **+100 estimate is partly overlap.** (Confirmed plausible:
the dataset is sourced from everyone who served in Congress — see deltas. But
this softens the cost; it does not overturn V's other two objections, and the
*hypothetical-territory* governors/delegates and never-served delegates remain
genuinely un-modeled.) POST 11 links Wikipedia's "Non-voting members of the U.S.
House" list as the candidate roster.

---

## Build-vs-design (code-verified, light)

Verified: `src/types.ts` (OfficeType, State, meters), `src/engine/territories.ts`,
`src/data/expansionStates.ts`, `src/engine/phaseRunners.ts`, `src/phases.ts`.

- **No territorial offices exist.** `OfficeType` (types.ts ~1111) is President …
  Senator / Representative / Governor / cabinet / court / leadership — **no
  Territorial Delegate, no Territorial Governor, no non-voting / no-floor-vote
  member concept** anywhere (`floorVote`/`nonVoting` greps: zero hits).
- **Territories have no pre-statehood gameplay — exactly the gap the pitch
  targets.** `admitState` (`territories.ts`) is a one-shot **seed-copy**: a
  territory does not exist as a `State` (with governor/reps/senators) until it is
  admitted; before that it is only a registry entry in `expansionStates.ts`. So
  "just being there until statehood" is literally the shipped behavior, and there
  is **no committee/propose/elect layer for territories.**
- **No player-proposed statehood-admission act.** Statehood happens only via
  **era-graph nodes** (e.g. `vermont_statehood` → `admitState(snap,'vt')`,
  phaseRunners ~3147), God Mode, or the Territories page. There is **no
  legislation type for admitting a state**, hence no "bonus for proposing a
  passing statehood act."
- **Domestic Stability EXISTS as a meter** — `snap.game.meters.domestic`
  (clamped −5..+5), written by era-event effects (`domesticStability` shorthand,
  phaseRunners ~3218; labels.ts ~251). So the **substrate for a "low-stability →
  independence" trigger is present**, even though no such trigger is wired.
- **Governor Actions phase exists but is thin & AI-only.** Phase **2.5.2 Governor
  Actions** (`runPhase_2_5_2_Governors`, ~3380) just nudges state `bias` by the
  governor's `governing` skill at 30% chance — **no player gov-action menu, no
  "Call on Congress to Admit Territory" action.** A new gov-action would be a
  net-new system, not an extension of an existing menu.
- **Roster cost is real and grounds V's objection.** `expansionStates.ts`
  registers **~150 annexable/expansion seeds** (all Canada provinces, full Mexico
  carve-up, Caribbean, all of Latin America, Pacific micro-states, remaining US
  states/territories) — every one a "terr" or "hypothetical terr." A delegate +
  governor per territory is exactly the "100+ obscure politicians" V cites, and
  the curated draft pipeline is **additive, sub-floor** for obscure figures
  (CLAUDE.md dataset rules) — i.e. real authoring cost per head.
- **Overlap counter is plausible:** the runtime dataset
  (`public/standard-draft-classes.json`) is built from *everyone who served in
  Congress*, so post-statehood-elected delegates (Crowell-type) are indeed likely
  already present — but **never-served delegates and hypothetical-territory
  officials are not**, so the gap is reduced, not eliminated.

---

## Open questions (for the human / consolidation)

- None blocking. The designer's call stands. The only live judgment is whether
  any *sub-mechanic* below should be salvaged independently of the rejected whole.
