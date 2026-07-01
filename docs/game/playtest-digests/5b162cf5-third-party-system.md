# Digest — "How are third parties handled in the game?" (topic 5b162cf5)

- **Slug:** `5b162cf5-how-are-third-parties-handled-in-the-game`
- **Source CSV:** `5b162cf5-How_Are_Third_Parties_Handled_In_The_Game.csv`
- **Posts:** 2 (1 chunk, ~1.4k chars). Opened by **Cholbus** (POST 1, the question).
- **Date stamp in-thread:** Jul 10, 2024 (POST 2 quotes the 7/10/2024 9:20 AM question).
- **Type:** **Authoritative third-party mechanics Q&A.** POST 2 is the designer's
  single-post, end-to-end statement of the THIRD-PARTY RULESET (spawn gate,
  nominee criteria, event-triggered spawn, impermanence + win-and-absorb
  realignment). NOT a playthrough — no years/eras are *played*; it is the
  canonical "how does this subsystem work" answer.
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** It is the **authoritative, whole-system spec for
> third parties** — the one place the designer states the *complete* lifecycle in
> order: (1) the **spawn GATE** (party-preference neutral AND an ideology's
> enthusiasm neutral → a third party from a faction holding that neutral
> ideology), (2) **nominee criteria**, (3) an **event-triggered spawn** path that
> bypasses the gate, and (4) the **impermanence rule** — third parties are
> transient **unless they win a presidential election AND an event fires letting
> the new party ABSORB one of the two existing parties**. It **CORROBORATES and
> SHARPENS the existing spawn owner #48** (which already has the party-pref-band
> + ideology-discontent gate from `nuke`/`modern`) and is the **authoritative
> statement of the "absorb-the-winner" realignment rule that DH-55 flags as the
> open design decision**. Status: **designer-authoritative** (this is the
> designer answering a direct mechanics question), and **~0% built** — the
> shipped app has a Third-Party phase that is a hardcoded no-op and a `PartyId`
> type hard-wired to exactly `'BLUE' | 'RED'`.**

---

## ★ Spawn GATE — party-preference-neutral AND ideology-enthusiasm-neutral → neutral-ideology faction (POST 2)

The designer's exact statement of when a third party *organically* occurs:

> "the game contains meters for enthusiasm of the different ideologies for the
> parties as well as the national party preference. If the party preference is
> neutral, so not favoring either party, and an ideology enthusiasm does not
> favor either party then a third party can occur. It would come from a faction
> that has the neutral ideology."

- Two-condition **AND gate**, both meters must be neutral:
  1. **National party-preference is NEUTRAL** — not favoring BLUE or RED. (Ships
     as `game.partyPreference`, a signed scalar clamped ±5; `types.ts:1570`,
     `:1093-1094`. "Neutral" = at/near 0.)
  2. **Some ideology's enthusiasm is NEUTRAL** — that ideology's enthusiasm
     favors neither party. (Ships as `game.enthusiasm`, an
     `ideology → { BLUE, RED } −5..+5` table; `types.ts:1415-1418`, `:1571`.
     "Neutral" = that ideology's BLUE≈RED, favoring neither.)
- **Origin of the third party = a faction that HOLDS the neutral ideology.** The
  spawning faction is the one whose ideology is the discontented/neutral one.
  On the 7-point scale (`types.ts:5-12`) the literal center is **`Moderate`**,
  but the rule is stated in terms of *whichever* ideology sits neutral, not
  hard-coded to Moderate.
- ★ **This is the same gate #48 already owns** (from `nuke`/`modern`): #48 = "3rd
  party spawns when Party Pref sits in the middle 3 boxes AND an ideology is
  discontented-with-both (sits Neutral); the discontented faction of the
  incumbent's party runs independent." This Q&A is the **designer restating that
  gate in his own words** — it CONFIRMS the two-meter-neutral gate and the
  neutral-ideology-faction origin. (This Q&A does NOT restate #48's
  incumbent-party carve-out or the LW-Pop/RW-Pop bid detail — those remain #48's
  finer grain; no conflict.)

## ★ Nominee criteria — "politicians have to meet certain criteria" (POST 2)

> "Politicians have to meet certain criteria to be the presidential nominees for
> the third parties."

- The designer confirms a **third-party nominee is GATED by per-politician
  criteria** — a third party cannot field just anyone; the candidate must
  qualify. The Q&A does not enumerate the criteria here, but #48/`nuke` supply
  the concrete gate: **a "can be independent" pol tag** + **Command** + being of
  the neutral/discontented ideology, with a **Celebrity** candidate appearing
  nationwide. (The discrete `canBeIndependent` pol TAG is itself a known ask —
  roadmap notes Ron Paul lacks it despite a 1988 third-party run.)
- Contrast with shipped major-party nominee criteria (`runPhase_2_9_1_Primaries`,
  `phaseRunners.ts:3728-3729`): alive, non-retired, **age 35–80**, **command ≥ 2**,
  ranked by `pvCache + command*5 + trait bonus`. That gate exists **only for the
  two parties** (`for … ['BLUE','RED']`) — there is **no third-party nominee
  path** at all in code.

## ★ Event-triggered spawn — bypasses the meter gate (POST 2)

> "There are also some events that trigger third parties even if the meters are
> not allowing for one."

- A **second spawn path**: scripted/era EVENTS can force a third party even when
  party-preference and ideology-enthusiasm are NOT neutral (i.e. the organic gate
  would forbid it). This is the "historical lower-stakes 3rd-party run" path #48
  gestures at (e.g. Carlson-1984 / John-B-Anderson expy in `nuke`).
- Not currently expressible: era-event effects (`EraEventResponseEffect`,
  `types.ts:1448-1457`) can move `partyPreference`, `enthusiasm`,
  `interestGroups`, `meters`, `diplomacy`, `startWar` — but there is **no
  `spawnThirdParty` / third-party-trigger effect field**. Events can nudge the
  meters *toward* neutrality, but cannot directly instantiate a third party.

## ★ Impermanence + win-and-absorb REALIGNMENT rule (POST 2) — the authoritative "absorb-the-winner" statement

> "The third parties do not become permanent though, in most cases, unless they
> win a presidential election and an event triggers to allow for their new party
> to absorb one of the original existing parties."

- **Default: third parties are TRANSIENT** — they contest an election and then
  dissolve; they do NOT persist as a standing party "in most cases."
- **The ONLY path to permanence is a two-condition AND:**
  1. The third party **WINS a presidential election**, **AND**
  2. **an event fires** that lets the new party **ABSORB one of the two existing
     parties** (a realignment — the winner's party displaces/merges an incumbent
     major party, keeping the party count at 2).
- ★ **This is the authoritative statement of the rule DH-55 flags as UNRESOLVED.**
  DH-55 records that the engine is hard-wired to exactly 2 parties and that a
  winning independent today "just becomes that side's Party Leader," with the
  open decision being **"keep the 2-party hard-wire with the absorb-the-winner
  rule"** vs. supporting >2 dynamic parties. **This Q&A RESOLVES the designer's
  intent toward the absorb-the-winner rule:** permanence is achieved by the new
  party **absorbing** an existing one (not by adding a 3rd standing party) — i.e.
  the count stays at two, consistent with (an event-gated relaxation of) the
  2-party hard-wire. This is a **party-realignment / party-absorption mechanic**,
  gated on (win + event), which nothing in `src/` implements.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-07-01)

**The third-party subsystem is ~0% built.** There is a Third-Party *phase slot*
in the election sequence, but it is a hardcoded no-op that always logs "no
challenge," and the party model is a hard binary type that cannot represent a
third party at all.

- **★ Third-Party phase = HARDCODED NO-OP.** Phase `2.9.3` "Third Party — Third
  party challenge check" exists in `PHASE_SEQUENCE` (`phases.ts:41`), but its
  entire engine body is one line:
  `case '2.9.3': addLog(snap, '2.9.3', 'election', 'No third-party challenge this cycle.'); return {};`
  (`engine.ts:70`). It **never reads `partyPreference` or `enthusiasm`**, never
  rolls, never spawns anything. The gate, nominee criteria, and event path all
  have a *reserved slot* but **zero logic**. (This is a strong "designed-slot,
  unbuilt-body" signal — the design was known when the phase was scaffolded.)
- **★ `PartyId` is a HARD BINARY — a third party cannot exist.**
  `export type PartyId = 'BLUE' | 'RED';` (`types.ts:3`). Every party-keyed
  structure is two-valued: `game.enthusiasm[ideo] = { BLUE, RED }`
  (`types.ts:1415-1418`), primaries iterate `['BLUE','RED']`
  (`phaseRunners.ts:3728`), the general builds `candidates = [blueCand, redCand]`
  and **hard-returns `null` if either is missing** (`phaseRunners.ts:3752-3754`)
  — there is no third slot on the ballot. `PARTIES_1856` is a fixed 2-element
  array (`factions1856.ts:19-22`). Representing a third party is an
  **architectural change** (DH-55), not a config tweak.
- **★ The GATE inputs SHIP; nothing reads them for a spawn.** `partyPreference`
  (signed, clamped ±5; `types.ts:1570`, `:1093-1094`; surfaced in `TopBar.tsx:14`)
  and the per-ideology `enthusiasm` table (`types.ts:1415-1418`, `:1571`;
  surfaced in `EnthusiasmPage.tsx:18`) both exist and are moved by events
  (`applyEffect`, `phaseRunners.ts:3226-3233`). But **no code reads "party-pref
  neutral AND some ideology-enthusiasm neutral → spawn."** The gate substrate is
  present; the gate itself is unbuilt.
- **★ NEUTRAL ideology = `Moderate` exists but is not a spawn source.** The 7-point
  scale has `Moderate` at the literal center (`types.ts:5-12`, index 3 of 7).
  Factions carry ideology, but **no code selects a neutral-ideology faction to
  field an independent.**
- **★ Third-party NOMINEE criteria = UNBUILT.** The only nominee gate in code is
  the two-party primary (age 35–80, command ≥ 2, PV+command+trait sort;
  `phaseRunners.ts:3728-3746`). There is **no `canBeIndependent` pol tag**, no
  Celebrity-nominee path, no third-party candidate selection anywhere.
- **★ Event-triggered spawn = UNBUILT.** `EraEventResponseEffect`
  (`types.ts:1448-1457`) has no third-party field; events can move the meters but
  cannot instantiate a third party.
- **★ Win-and-absorb REALIGNMENT = UNBUILT.** Grep of `src/` for
  `absorb|merge.*party|party.*merge` = 0 party-absorption logic. `realign` exists
  only as (a) a log-string flavor in a diplomacy event
  (`anytimeNationalEvents.ts:186`) and (b) a card-move `reason: 'realigned'`
  (`phaseRunners.ts:1707`) — neither is party-absorption. A winning independent
  cannot exist (see `PartyId`), so the "becomes a Party Leader" fallback DH-55
  describes is itself not reachable through 2.9.3 today. No mechanic converts a
  third-party presidential win into absorbing a major party.
- **`spoiler` / vote-drain (#228) also absent** — grep `spoiler`/`thirdParty` in
  `src/` = 0. (The DRAIN half is #228; this thread is the SPAWN + LIFECYCLE half.)

**Net for tech-lead:** the whole third-party lifecycle — organic spawn gate,
nominee gate, event-triggered spawn, and the win-and-absorb realignment — is
**unbuilt**. The election sequence *reserves* the slot (`2.9.3`) but the body is
a one-line no-op (`engine.ts:70`), and the party model is a hard `'BLUE'|'RED'`
binary (`types.ts:3`) that cannot represent a third party without an
architectural change (DH-55). The gate's *inputs* (`partyPreference`,
`enthusiasm`) ship and are event-driven; the two-party nominee primary ships. So
the build has the SUBSTRATE but none of the third-party MECHANISM.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold / assigns any NEW id.)*

- **HEADLINE → #48 (Third-party challenge TRIGGER / spawn — the owner).** This
  Q&A is the **designer-authoritative restatement** of #48's spawn gate:
  party-preference NEUTRAL **AND** some ideology's enthusiasm NEUTRAL → a third
  party from **a faction holding that neutral ideology**. CONFIRMS #48's
  "middle-band party-pref + ideology-discontent → neutral-ideology faction"
  gate (already sourced to `nuke`/`modern`). SHARPEN #48's provenance to add this
  Jul-2024 direct-answer confirmation. **~0% built** (phase `2.9.3` = no-op,
  `engine.ts:70`).
- **SHARPENS #48 — adds the EVENT-TRIGGERED spawn path.** #48 gestures at
  historical lower-stakes runs; this Q&A states the rule explicitly: **events can
  spawn a third party even when the meter gate forbids it.** No third-party
  effect field on `EraEventResponseEffect` (`types.ts:1448-1457`). Fold into #48
  (or note as its event sub-path).
- **SHARPENS #48 — nominee CRITERIA gate confirmed.** "Politicians must meet
  certain criteria to be the presidential nominee" — corroborates the
  `canBeIndependent`-tag + Command + Celebrity nominee gate #48/`nuke` describe.
  No `canBeIndependent` tag ships; third-party nominee path 0% built.
- **HEADLINE → DH-55 (2-party HARD-WIRE / absorb-the-winner decision) — RESOLVES
  the designer's intent.** DH-55 records the open choice: keep the 2-party
  hard-wire **with the absorb-the-winner rule** vs. support >2 dynamic parties.
  This Q&A states the designer's rule: third parties are **transient UNLESS they
  win a presidency AND an event lets the new party ABSORB an existing party** —
  i.e. the **absorb-the-winner path** (count stays at 2). SHARPEN DH-55 with this
  authoritative absorption/realignment ruleset. `absorb|merge`-party logic = 0 in
  `src/`; `PartyId` hard-wired `'BLUE'|'RED'` (`types.ts:3`). ~0% built.
- **CROSS-REF #228 (third-party spoiler VOTE-DRAIN).** #228 owns how a spawned
  third party DRAINS votes from the majors (party-of-origin + shared-ideology +
  incumbency + Charisma escalation). This thread is the SPAWN + LIFECYCLE half;
  #228 is the effect half. Same subsystem, complementary — cross-reference, no
  overlap. Also `spoiler`/`thirdParty` = 0 in `src/`.
- **CROSS-REF #292 (`calcStateVote` / party-pref + per-state scoring) & the
  enthusiasm engine (#18/#51/#124).** The spawn gate READS the party-preference
  scalar and the per-ideology enthusiasm table — the exact meters #292 and the
  #18/#51/#124 meter→enthusiasm pipeline own. The gate needs a "meter is NEUTRAL"
  predicate over both. Substrate ships (`types.ts:1570`, `:1415-1418`);
  neutral-check predicate + spawn wiring unbuilt.
- **CROSS-REF #4 (faction ideology profile).** The spawn ORIGIN is "a faction
  that has the neutral ideology" — depends on faction-ideology assignment (#4)
  and the `Moderate` center of the 7-point scale (`types.ts:5-12`). No code
  selects a neutral-ideology faction to spawn an independent.
- **CROSS-REF party-realignment owners (#247 / #108).** The win-and-absorb rule
  is an event-gated PARTY realignment; #247 (event-keyed partisan-lean
  realignment) and #108 (realignment levers) are the adjacent realignment
  family, but neither owns **third-party→absorb-a-major-party**. That
  absorb-a-party mechanic is best owned by **DH-55** (which names it). Flag: if
  consolidation judges the absorb/realignment piece unowned by DH-55, it may be
  **NEW** — but DH-55 explicitly references "the absorb-the-winner rule," so map
  it there and SHARPEN.
- **PROVENANCE note (no new id):** confirms `2.9.3` is a **designed-slot /
  unbuilt-body** — the phase was scaffolded (`phases.ts:41`, `engine.ts:70`)
  knowing a third-party check belongs there; the entire body is a no-op. Useful
  evidence that the third-party subsystem is *specced-and-slotted* but unbuilt.
