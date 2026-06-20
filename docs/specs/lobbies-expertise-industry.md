# Spec: Lobbies → expertise → industry + faction ideology (PR7)

## Vision (as given)
Wire the four loose ends of the Lobbies system (gap analysis System 4 / roadmap
row 7): (1) connect a faction's lobby cards to politician **expertise**, (2) let
held lobby cards nudge the **industry** values of relevant states by ±1,
(3) reconcile the reference doc's 8 industry buckets with the era state-industry
keys, and (4) let member **expertise** (a faction's economic base) inform
**faction ideology** — as a bias, never a determinant. Depends only on PR1
(Expertise axis), which is shipped.

## Historical grounding (binding)
Source: `docs/research/lobbies-expertise-industry-historical-context.md`,
"Binding facts / anachronism watch-outs" (items 1–8). The mechanics here respect:
- **A subset of lobby cards is non-economic** and gets *no* industry nudge and
  only a loose expertise link (item 2): 1772 = Patriots, NationalUnity,
  Reformers; 1856 = Abolitionists, EvangelicalReform, ProUnion, Nativists.
- **"Faction ideology follows economic base" is a tendency, not a law** (item 3):
  refuted in its hard form for 1772 (Beard → McDonald) and thin for 1856's
  party axis (Benson ethnocultural thesis); it holds only for the 1856
  sectional/slavery axis. Therefore expertise is **one small weighted bias**
  into faction ideology, never a deterministic mapping.
- **No anachronistic industries** (item 5): drop Natural Gas, High Tech, Alt
  Energy. **No union-vs-manufacturing sign** (item 4): UrbanLabor maps to Labor
  expertise but applies **no** industry nudge in 1856. **Cotton is 1856-not-1772
  dominant** (item 6) and **no free/slave economic binary in 1772** (item 7):
  the per-era tables below honor both.
This spec adopts the historian's per-era lobby→expertise / lobby→industry tables
and the industry crosswalk verbatim, refined only to use exact in-game keys.

## Player experience
The player's faction-building choices (which lobby cards the faction holds, which
expertise their drafted/cultivated politicians carry) start to *mean* something
beyond flavor: a faction stacked with Agriculture experts and the Planters/
SlavePower lobby reads — and slowly behaves — as a more conservative agrarian
bloc, and the states it champions visibly tilt toward their signature industries.
The tension: economic base now gently tugs a faction's center, so a player can
either lean into their base or actively fight the drift to hold a chosen ideology.

## User story
As a player steering a faction, I want my faction's lobby cards and my
politicians' expertise to influence their expertise growth, the industries of
the states they represent, and (subtly) my faction's ideological center, so that
my faction's economic identity has mechanical weight without railroading my
ideology.

## Scope item 1 — Lobby → expertise wiring

Add a single source-of-truth map `LOBBY_EXPERTISE: Record<LobbyCardId, Expertise
| null>` (in `src/types.ts`, beside `ALIGNMENT_RULES`, so engine + any UI legend
share it). Values use existing `Expertise` tags (`src/types.ts:182`) and existing
`LobbyCardId`s (`src/types.ts:316`). `null` = non-economic lobby, no grant.

| LobbyCardId | Expertise | Era(s) it appears |
|---|---|---|
| Merchants | Business | 1772 |
| Planters | Agriculture | 1772 |
| SmallFarmers | Agriculture | 1772 & 1856 |
| Lawyers | Justice | 1772 |
| Patriots | `null` | 1772 |
| NationalUnity | `null` | 1772 |
| Reformers | `null` | 1772 |
| SlavePower | Agriculture | 1856 |
| NorthernIndustry | Business | 1856 |
| Expansionists | Foreign Affairs | 1856 |
| UrbanLabor | Labor | 1856 |
| Abolitionists | `null` | 1856 |
| EvangelicalReform | `null` | 1856 |
| ProUnion | `null` | 1856 |
| Nativists | `null` | 1856 |

**Where it fires:** a new deterministic grant pass during the existing draft/
career career-gain window (phase 2.1.2, alongside the other `addExpertise`
callers). For each non-player and player faction, for each held lobby card with a
non-null expertise X, members of that faction have a **chance** (single tunable
odds constant `LOBBY_EXPERTISE_GRANT_ODDS`, e.g. 0.10 per eligible member per
year, in a `LOBBY_RULES` const) to gain X via the existing `addExpertise(p, X)`
helper (which already dedupes and returns whether a tag was added). Grants log
through `addLog` exactly like the existing committee/office expertise grants.
This is a slow trickle, not an instant stamp — it must not flood every member
with the same tag in one turn.

## Scope item 2 — Lobby → industry (±1)

Add `LOBBY_INDUSTRY: Record<LobbyCardId, string[]>` (industry keys are the exact
era `State.industries` keys). Non-economic lobbies map to `[]` (no nudge). Keys
differ by era; a lobby only nudges keys that actually exist on a given state, so
a single combined map is safe (a 1772 state simply has no `cotton`-dominant
entry to push hard, etc.).

| LobbyCardId | Industry keys nudged +1 | Notes |
|---|---|---|
| Merchants | shipping, finance | 1772 maritime/commerce |
| Planters | tobacco | 1772 plantation = tobacco-led (item 6: **not** cotton) |
| SmallFarmers | agriculture | both eras |
| SlavePower | cotton, tobacco | 1856 |
| NorthernIndustry | manufacturing, coal | 1856 |
| Expansionists | agriculture | 1856 frontier farming |
| UrbanLabor | *(none)* | item 4: no union-vs-manufacturing sign in 1856 |
| Patriots / NationalUnity / Reformers / Abolitionists / EvangelicalReform / ProUnion / Nativists | *(none)* | item 2: non-economic |

**Mechanic:** a deterministic per-year pass (engine-pure). For each state, for
each faction with a member representing that state (a member whose `state` or
seated office ties them to the state — use the simplest existing tie: members
whose `state === s.id`), the union of that faction's held lobby cards' nudged keys
that **already exist** on `s.industries` is bumped by **+1**, **clamped to a max
of 5** (matching the 0–5 industry scale in the data). Each (state, key) is bumped
at most **+1 per year total**, regardless of how many factions/cards point at it
(dedupe per key per year). Keys not already present on a state are **not**
created — PR7 nudges existing industries, it does not invent new ones for a state.
No decay/down-nudge in PR7 (out of scope; see Out of scope).

**Determinism:** the nudge is fully deterministic (no RNG) — iterate
`snap.states` and `snap.factions` in array order.

## Scope item 3 — Industry-name reconciliation

The reference doc's 8 buckets are reconciled to era keys via this crosswalk
(historian's table, anachronistic buckets dropped). This lives as documentation +
a `INDUSTRY_CROSSWALK` const **only if** code needs it; item 2's map already uses
concrete era keys directly, so the crosswalk is primarily a doc artifact and a
guard so future PRs don't reintroduce the dropped buckets.

| Reference bucket | Era key(s) used | Status |
|---|---|---|
| Plantation | cotton, tobacco, sugar (1856); tobacco, cotton (1772) | mapped |
| Manufacturing | manufacturing | mapped |
| Finance | finance | mapped |
| Maritime | shipping, fishing | mapped |
| Mining | mining, coal | mapped |
| Natural Gas | — | **dropped (anachronistic)** |
| High Tech | — | **dropped (anachronistic)** |
| Alt Energy | — | **dropped (anachronistic)** |

`agriculture`, `lumber`, `cattle`, `sugar` are first-class era keys with no
reference bucket and are treated as their own keys.

## Scope item 4 — Faction ideology from expertise (the careful one)

**Existing computation:** faction ideology = `factionCenter(snap, factionId)`
(`src/engine/phaseRunners.ts:682`): the living-member mean of
`IDEOLOGY_ORDER.indexOf(p.ideology)`, leader weighted by
`LEADERSHIP_RULES.ideologyWeightInFactionCenter` (1.5), `Math.round`ed (x.5 →
RW). This is the single source of "faction ideology" consumed across the engine
(ideology shifts 2.1.5, conversions, leadership fit, alignment drift 2.1.8) and
several pages.

**Change:** introduce an additive **expertise bias term** blended into the raw
mean *before* rounding, small enough to bias not override:

1. Compute the existing leader-weighted ideology mean as today → `rawMean`
   (a float on the 0–6 `IDEOLOGY_ORDER` index scale).
2. Compute an **economic-lean score** from living members' expertise:
   `econLean = sum over members of EXPERTISE_IDEOLOGY_LEAN[x]` for each expertise
   tag the member holds, divided by member count (mean per-member lean). Define
   `EXPERTISE_IDEOLOGY_LEAN: Partial<Record<Expertise, number>>` with values in
   {-1, 0, +1} on the LW(−)…RW(+) axis. Only economically-meaningful tags get a
   sign; the rest default 0. Conservative defaults grounded in the brief:
   - **Agriculture → +1** (RW: agrarian/planter base, both eras).
   - **Business → +0.5** (mildly RW: commercial/industrial base; deliberately
     half-weight because 1772 commerce was *Federalist/center* and 1856 Northern
     industry was *Republican/center-left* — sign is weak and era-ambiguous).
   - **Labor → −1** (LW: wage-worker base).
   - All others (Foreign Affairs, Justice, Education, …) → 0.
   *(Exact values are tunable constants; the point is small magnitude and that
   the historiographically-contested signs stay weak.)*
3. **Blend:** `biasedMean = rawMean + FACTION_EXPERTISE_BIAS_WEIGHT * econLean`,
   where `FACTION_EXPERTISE_BIAS_WEIGHT` is a small constant (proposed **0.5**,
   i.e. at most a ~half-step on a 7-point scale even when the whole faction is
   single-base). Then **clamp `biasedMean` to [0, 6]** and `Math.round` with the
   same x.5→RW tie rule as today.
4. The result is still a `0–6` integer index — every existing caller is
   unchanged in shape.

**Why a bias, not a determinant (binding):** per historian item 3, economics is
one tendency among several (ideology cards, member ideology, leader, ethnocultural
factors). With weight 0.5 and per-member leans in [−1,+1], the maximum total
shift is ±0.5 index — it can tip a faction sitting exactly on a boundary, but
cannot move a faction more than one ideology step, and cannot override a clear
member-ideology consensus. This matches McDonald's "three dozen interests" and
keeps the 1856 party axis from collapsing into the refuted Whig-Democrat-as-class
myth, while still letting a strongly single-base faction lean correctly.

**Where it runs:** inside `factionCenter` itself, so all consumers inherit it
consistently and there is exactly one definition of faction ideology. No new
phase. `factionCenter` stays a pure function over the snapshot.

**Downstream / top balance risk:** `factionCenter` does **not** feed
`calcStateVote` directly (elections score on per-candidate `c.ideology` +
`electionFactionBias`). The election impact is **indirect**: a biased center
changes which members the 2.1.5 ideology-shift pass pulls toward center, slowly
moving members' actual ideologies, which then change enthusiasm-driven vote
share over several turns. This indirect-but-real path is the reason the weight
must stay small; it is the designated playtest focus (see Acceptance criteria 12).

## Acceptance criteria
1. [ ] `LOBBY_EXPERTISE`, `LOBBY_INDUSTRY`, `EXPERTISE_IDEOLOGY_LEAN`, and the
   tuning constants (`LOBBY_EXPERTISE_GRANT_ODDS`,
   `FACTION_EXPERTISE_BIAS_WEIGHT`) exist as single-source consts in
   `src/types.ts`, typed against existing `LobbyCardId` / `Expertise` and the
   era industry-key strings.
2. [ ] Every `LobbyCardId` has a `LOBBY_EXPERTISE` entry; the seven non-economic
   lobbies (Patriots, NationalUnity, Reformers, Abolitionists, EvangelicalReform,
   ProUnion, Nativists) map to `null` and the four non-economic-in-1856 / three-
   in-1772 produce **no** industry nudge.
3. [ ] In a started game, advancing through phase 2.1.2 over several years grants
   the mapped expertise to some faction members holding the relevant lobby card,
   via `addExpertise`, with a log line — and does **not** grant all members the
   tag in a single turn (trickle, gated by `LOBBY_EXPERTISE_GRANT_ODDS`).
4. [ ] A faction with a held economic lobby card raises matching **existing**
   industry keys on states its members represent by **+1/year**, clamped to ≤5,
   and never creates a new key on a state that lacked it.
5. [ ] UrbanLabor produces a Labor expertise grant but **zero** industry change
   (no −manufacturing), in 1856.
6. [ ] Planters (1772) nudges **tobacco** (not cotton); SlavePower (1856) nudges
   cotton and tobacco — verifying the era-correct plantation crop.
7. [ ] A given (state, industry-key) is bumped at most +1 in a single year even
   if multiple factions/cards target it.
8. [ ] The industry nudge and the faction-ideology blend are deterministic:
   re-running the same phase from the same snapshot/seed yields identical
   `state.industries` and identical `factionCenter` results. **No `Math.random`**
   is introduced (use seeded `rand`/`chance` from `src/rng.ts` for the item-1
   trickle only; item-2 and item-4 use no RNG).
9. [ ] `factionCenter` returns a 0–6 integer (or `null` for empty factions)
   exactly as before; with all `EXPERTISE_IDEOLOGY_LEAN` set to 0 the function is
   numerically identical to today's behavior (proves the blend is purely additive
   on top of the existing mean).
10. [ ] With non-zero leans, a faction whose living members are uniformly
    Agriculture experts and sit on an LW/RW ideology boundary rounds **one step**
    toward RW vs. the same faction with the bias weight zeroed; a faction not on a
    boundary is unaffected — demonstrating bias-not-override (max ±0.5 index).
11. [ ] Industry values are surfaced (not just keys) on the existing
    `StatesPage` (e.g. `cotton: 5`) so the nudge is observable; no net-new
    screen, modal, or lobby-card-management UI is added.
12. [ ] `npm run build` (tsc + vite) passes, and a playtest of both the 1772 and
    1856 scenarios over ~10+ years shows faction centers and election outcomes
    that move plausibly and slowly — no faction lurching ideology or sweeping
    elections because of the expertise bias.

## Edge cases
- **Empty / dead-only faction:** `factionCenter` already returns `null`; the
  blend must short-circuit before dividing by member count (no NaN).
- **Single-member or leader-only faction:** leader weight (1.5) still applies to
  `rawMean`; `econLean` uses the same living-member set (count includes the
  leader once for the lean mean — keep it simple, do not double-weight the leader
  in the lean term).
- **Member with no expertise tags:** contributes 0 to `econLean` (counts in the
  denominator) — large untagged factions naturally have a weak lean. Acceptable.
- **Industry key absent on a state:** skip (no creation). State with an empty
  `industries` object: no-op.
- **Industry already at 5:** clamp; no overflow, no log spam (only log on an
  actual change, mirroring `addExpertise`'s "real change" convention).
- **Draft years (`year % 4 === 0`):** item-1 grants ride the existing 2.1.2
  window and must not collide with or double-count career/committee expertise
  grants (each grant is independent; `addExpertise` dedupes).
- **Player vs. CPU factions:** lobby→expertise and lobby→industry apply to **all**
  factions including the player's (the player benefits/suffers symmetrically);
  faction-ideology blend applies to all factions, consistent with `factionCenter`
  being global.
- **Cross-era safety:** because maps key on `LobbyCardId` (era-specific card sets)
  and nudge only existing industry keys, the same consts are correct in both
  scenarios with no era branch; the modern/nationalism eras have no scenario yet
  and are unaffected.
- **PV interaction:** none. Expertise does not enter `pv.ts`; the industry nudge
  does not enter PV or `calcStateVote`. Election impact is only the indirect
  2.1.5-mediated ideology path described above.

## Out of scope
- Any new lobby-card UI (acquiring/dropping/trading lobby cards), new industries,
  industry **down**-nudges/decay, or modern-era scenarios.
- The three dropped industry buckets (Natural Gas, High Tech, Alt Energy) — not
  added to any era.
- Making `state.industries` *values* feed elections, PV, governance, or any other
  system (today values are presentational; PR7 keeps it that way besides the
  StatesPage value display).
- Changing `electionFactionBias`, the `lobbyToInterest` proxy map, interest-group
  scores, or `calcStateVote` math (including the pre-existing `Math.random` at
  `phaseRunners.ts:3652` — flagged below but **not** PR7's to fix).
- Reworking expertise *earn* sources from PR1 (tracks/committee/office/cabinet) —
  item 1 only **adds** the lobby source.
- Any change to skills (0–5), the 7-point ideology scale, draft-on-`year % 4`, or
  the PV election driver beyond the indirect path noted.

## Open questions / assumptions
- **(Riskiest) `EXPERTISE_IDEOLOGY_LEAN` signs/magnitudes and
  `FACTION_EXPERTISE_BIAS_WEIGHT`=0.5 are my call and are the top balance risk.**
  Per historian item 3 the signs are historiographically contested (esp.
  Business in both eras and the whole party axis in 1856). I chose weak, mostly-
  Agriculture(+1)/Labor(−1)/Business(+0.5) signs and a cap of ±0.5 index so it
  can never override member ideology. **Confirm the weight, the cap, and whether
  Business should carry any sign at all** at the checkpoint; these are tuning
  knobs the architect/human can dial without structural change.
- **Assumption: the state↔faction tie for the industry nudge is `member.state ===
  s.id`** (the simplest existing field). If the intended tie is "faction holds the
  governorship / a Congress seat for that state," that's a larger lookup — flag
  for confirmation. I picked residence because it's deterministic, cheap, and
  needs no new data.
- **Assumption: item-1 expertise grants ride the existing 2.1.2 career-gain
  window** rather than a brand-new phase, to avoid a `PHASE_SEQUENCE` change.
  Confirm placement is acceptable.
- **Assumption: no new *persisted* fields.** `factionCenter` recomputes from the
  snapshot, so the ideology blend persists nothing new. `state.industries`
  already persists (so nudges save automatically with no migration). The new
  consts are static. Therefore **no IndexedDB save migration is required.** If the
  architect prefers a cached per-faction biased-center field for perf, that would
  add a persisted field and a migration — I recommend against it for PR7.
- **Deviation flag (minor):** the historian's 1772 expertise table offered
  "Business *or* Trade" for Merchants and "Media *or* Military" for Patriots; I
  picked Business and `null` (Patriots is non-economic → no expertise) to keep the
  map single-valued and the non-economic set clean. No binding fact is violated.
- **Assumption: the `+1` industry magnitude and per-year cadence** match the
  reference's "Industry ±1" intent; I dropped the "−" direction entirely for PR7
  (only economic lobbies, only +1) consistent with item 4's anachronism guard.
