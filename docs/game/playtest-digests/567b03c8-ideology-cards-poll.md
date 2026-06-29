# Digest — "Ideology Cards Poll" (`567b03c8`)

**Type:** DESIGN / decision-poll thread (**Aug 26 2021**), **NOT a playthrough.**
9 posts / 1 chunk. GM **@vcczar** (tier-1, owns the decision) + **@MrPotatoTed /
Ted** (tier-1, proposed killing the cards); **@jvikings1** (tier-3, raises the
populist-disadvantage flaw); **@Hestia** (tier-4, "are factions coalitions or
ideologies?"). A long tag-list of voters (@Cal @Rodja @Rezi @WVProgressive
@themiddlepolitical @DakotaHale @SilentLiberty @ConservativeElector2) cast votes
but post no rulings.
**Why it matters:** this is the **DESIGN ORIGIN of the central faction-vs-personal-
ideology tension** and the **decision space for the personal-ideology card
system** that the build's draft-restriction gaps (**#4** per-(faction,era) draft
profile, **#171** era-keyed restriction toggle) descend from. It names the
**"Rand Paul Problem"** and the **populist draft-pool-scarcity** flaw. It is the
**immediate predecessor of `8189b724` (Faction Ideology Default, Sept 2021)** —
that thread chose and specced **option #3** (the "FactNumber" priority-range
ruleset); this thread is where the five options were first laid out and #3 was
front-runner. **Provenance only — no living-doc edits.** Citations: `POST n`.

> **Term disambiguation (critical).** This thread's "ideology card" = a **player's
> assigned PERSONAL-IDEOLOGY slot** on the 7-point scale (LW Populist …
> RW Populist) that governs *which politicians you may draft / how they vote*.
> This is **NOT** the same object as the build's shipped `IdeologyCardId` type
> (`Independence`, `Republicanism`, `Whiggery`, … — 22 **named policy/alignment
> cards** that drive faction alignment drift). The shipped "ideology cards" are a
> *different mechanic that reused the name.* Keep them separate when reading the
> gap log. (types.ts:322 vs the 7-point `Ideology`, types.ts:5.)

---

## The five-option decision space (vcczar, POST 1) — capture exactly

The framing premise (POST 1): *"the game is based on playing the part of a
faction, which is generally ideological. The issue is that there is often
contradictions between a faction's ideology and a politician's personal
ideology."* Constraint: *"The card system needs to stay for Lobbies and
Interests. Ideally, they stay for Ideology cards."* (cards are non-negotiable for
Lobby/Interest; the question is only the *ideology* card.)

| # | Option | Cards? | Mechanic | Stated downside |
|---|--------|--------|----------|-----------------|
| **1** | **Keep as-is** | KEEP | Player gets an ideology card even if faction members' personal ideologies don't align. **Cards may be assigned by RELATIVE DISTRIBUTION** — you might get "Traditionalist" even if most of your members are Moderate, *because another faction has more Moderates*. | (status quo; the mismatch persists) |
| **2** | **Draftees conform to drafter** | KEEP | Cards handed out at game start; drafted pols **automatically take the drafter's card ideology** (Bernie Sanders → Conservative if the Conservative player drafts him). | *"the simulation will be in no way realistic."* |
| **3** | **Draft within 1 of card + conform** | KEEP | May only draft pols **within 1 step** of your card ideology; **draftees then take on the card ideology** (a drafted Moderate/Traditionalist becomes Conservative). LW-Pop / RW-Pop can draft only their own kind + the single adjacent (Progressive / Traditionalist resp.). | *"the fringe players will have fewer politicians."* |
| **4** | **Abolish cards** | KILL | Draft anyone in the same **party**, no ideology gate. | *"moderates will likely be very powerful… Calhoun, Cruz, Ron Paul operating like moderates because the grand bulk of a player's politicians are likely to be moderates."* (the Rand Paul Problem) |
| **5** | **Abolish cards + off-ideology vote penalty** | KILL | Like #4, but a player is **heavily penalized for voting a pol against their PERSONAL ideology** (Ron Paul voting for Social Security loses many points) → can't bloc-vote; must hand-pick each pol's vote. | (big overhaul; per-pol vote micromanagement) |

**vcczar's position (POST 1, reaffirmed POST 8):** *"in favor of option #1 or
#3… against #4 or #5 mainly because it gets rid of what makes a Faction a
Faction… will require a huge overhaul."* POST 8: the choice will be **"#1 or #3
or a slight variation"** — made *"quickly because we still got things to do."*
POST 3 + 5: vcczar has a **new variant of #3** he'll present "tomorrow" → this is
**`8189b724` (Sept 2021), the priority-range / FactNumber spec** (which is the
two-tier "draft from your range first, then anyone" softening of #3).

---

## The two core tensions (the durable design content)

### ★ 1. Faction-ideology vs. personal-ideology contradiction (the root question)
POST 1 premise; sharpened by Hestia (POST 6) → *"do our factions set what is a
'faction' simply by having a coalition of people, or do the ideologies set the
factions? I think we've answered before with the first one, but I'm not sure
they'll always make sense like that."* vcczar (POST 6) concedes the realism
worry: a hard ideology gate *"isn't realistic [because] that's generally what
happens in history"* (coalitions hold ideologically-mismatched members). **This
is the open philosophical question under #4/#171:** a faction is a *coalition*
(any-ideology members, the realistic model) OR an *ideology* (gated membership,
the gameplay-legible model) — and the build must pick per surface.

### ★ 2. Populist / fringe draft-pool scarcity (jvikings1's flaw in #3) — names a real asymmetry
jvikings1 (POST 4, quoted): under #3, *"there is a major disadvantage to choosing
a populist faction (because they would only have ONE next to them as opposed to
2). And… if you get stuck outside of the 3 middle ones (liberal, moderate,
conservative), there wouldn't be a whole lot you could do [early-game]."*
- **The asymmetry is structural:** centre ideologies (Liberal/Moderate/
  Conservative) have **two** adjacents; the two endpoints (LW-Pop, RW-Pop) have
  **one** → under a within-1 rule, populist factions get a strictly smaller draft
  pool AND the pool is thin (few populist pols exist historically).
- **Mitigation floated (POST 4):** add **more what-if / minor statesmen** for
  fringe factions to fill their pools — *"but that could also result in uneven
  representation and unrealistic results for those who DID exist on the political
  fringe and should not have had so much power."* (The cure risks over-empowering
  genuine fringe figures.) → ties the **what-if-pol roster** work
  (`d474f718`/#24/#115) directly to draft-balance.

### ★ 3. The "Rand Paul Problem" — a NAMED design concern (POST 4, 7)
vcczar (POST 4, option-4 downside) and MrPotatoTed (POST 7) name it: under any
**non-gated** system (#4/#5), an ideologically-distinctive figure (Calhoun, Cruz,
Ron/Rand Paul) **behaves like a Moderate** because the bulk of any roster is
Moderate and nothing forces them to vote their ideology. Ted (POST 7): *"the
'Rand Paul Problem'… still exists in the CURRENT game, if he ends up happening to
be in the moderate faction."* → the problem is **not solved by the then-current
build**; it is the core motivation for either (a) draft gating (#3) or (b) the
off-ideology vote penalty (#5). **This is the canonical name** for "distinctive
pols flatten to centre under no ideology mechanic" — reference it by name.

### Relative-distribution card assignment (option #1 detail) — capture
Under #1, an ideology card is assigned **by which faction has the most of an
ideology, not by a faction's absolute member ideology** (POST 1: you might be
handed "Traditionalist" though most of your members are Moderate, because another
faction out-Moderates you). A **comparative/zero-sum** assignment, not absolute —
note this if #1 (or any "auto-assign the faction's ideology card") is ever built;
it interacts with `8189b724`'s **faction-ideology-default** auto-assignment.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-29)

**Report the CURRENT build, not the Aug-2021 then-state.** Net: a **partial
option-#3 draft gate ships, but ONLY in the 1772 inaugural draft**; outside it,
the draft is **soft-preference only** (option-#4-like). **No draftee-conformance
(#2/#3), no off-ideology vote penalty (#5).** Personal ideology **does NOT enter
PV / elections.**

- **★ Option-#3 draft-within-range — PARTIALLY SHIPPED (1772 inaugural draft only).**
  1772 factions carry a real **`eligibleIdeologies: Ideology[]`** field
  (`factions1772.ts:7`, populated per-faction lines 12–23). The draft consumes it
  via `getEligibleIdeologies` (`phaseRunners.ts:28`) and `pickBestForFaction`
  (`phaseRunners.ts:33`): **only when `isExpansion1772`** (the inaugural draft,
  line 38–39) does it filter the pool to eligible ideologies — with the **exact
  two-tier "priority first, then anyone" softening** the design wants
  (`const strict = eligible.filter(...); pool = strict.length>0 ? strict :
  eligible` — line 41–44). **This is the shipped seed of #4's priority-range
  rule.** It even encodes the **populist-asymmetry mitigation**: LW/RW endpoint
  factions are given 2–3 eligible ideologies, not 1 (e.g. `fact_blue_lw_1772` =
  `['LW Populist','Progressive']`; `fact_red_cr_1772` = `['Conservative',
  'Traditionalist','RW Populist']`), partly answering jvikings1's POST-4 flaw.
  **LIMITATIONS:** (a) it's a **`Faction1772`-only field**, NOT on base `Faction`
  (types.ts:1293, which has only `personality` + `ideologyCards[]`); 1856 factions
  (`factions1856.ts`) have **no `eligibleIdeologies`**; (b) it gates **only the
  inaugural draft** — every later draft year falls through to the soft path below.
- **Outside 1772-inaugural: SOFT PREFERENCE ONLY (option-#4-like, no gate).**
  `pickBestForFaction` scores by `p.pvCache + (ideoMatch ? 25 : 0)`
  (`phaseRunners.ts:45–52`), where `ideoMatch` tests the pol's ideology against
  the faction's **3-bucket `personality` ('LW'|'Center'|'RW')**, not a 7-point
  card. So a faction merely *prefers* on-bucket pols (+25 PV) but **can draft
  anyone in the pool** — this is **option #4 with a thumb on the scale**, not #3.
- **Option #2/#3 draftee-CONFORMANCE — NOT SHIPPED.** `recordDraftPick`
  (`phaseRunners.ts:55`) sets `p.factionId` / `p.partyId` but **never mutates
  `p.ideology`** — a drafted Moderate stays Moderate; the faction's card does not
  overwrite the pol's personal ideology. The "draftees take on the card ideology"
  half of #2 and #3 is **0% built.**
- **Option #5 off-ideology VOTE PENALTY — NOT SHIPPED.** `computePV` (`pv.ts:67`)
  has **no ideology term at all** (skills × office-weights, command, traits,
  office prestige, age — nothing reads `p.ideology`). Nothing penalizes a
  politician voting against their personal ideology; there is no per-pol vote
  selection surface. The #5 mechanic is **0% built** and would, as vcczar warned,
  require a vote-by-vote system that doesn't exist.
- **The 7-point "ideology card" object itself — NOT a distinct entity.** There is
  **no per-faction personal-ideology-card field** (the thread's "card"). The build
  models a faction's lean as the 3-bucket `Faction.personality` (types.ts:1297)
  plus `eligibleIdeologies` (1772 only). The shipped `IdeologyCardId` /
  `Faction.ideologyCards[]` (types.ts:322, 1298) are the **named policy cards**
  (alignment drift, `ALIGNMENT_RULES.ideologyCardBucket`, `phaseRunners.ts:1694`)
  — a *different* mechanic, present and working; the LOBBY/INTEREST cards the
  thread says "must stay" also ship (`LobbyCardId`/`InterestCardId`).
- **Personal ideology IS used elsewhere** (so the data exists to build #5/#3 on):
  `firstContinentalCongress.ts` uses `ideologyDistance` for CC selection
  (lines 145, 195, 217, 225); the **ideology-SHIFT / drift** system mutates
  `p.ideology` toward a faction center (`phaseRunners.ts:752, 789, 916`,
  `IDEOLOGY_SHIFT_ODDS` types.ts:253) — i.e. pols can be *converted* toward the
  faction over time (a softer cousin of #2's instant conformance). But none of
  this touches **elections/PV or draft-eligibility outside 1772-inaugural.**

---

## Candidate gaps for consolidation

*(Map to EXISTING IDs where possible; the consolidation agent owns numbering /
the gap-log edit.)*

- **#4 (era-specific per-faction draft profile + off-profile/adjacency)** —
  **DESIGN ORIGIN (decision-poll) + PARTIAL-BUILD EVIDENCE.** This thread is the
  **earliest statement of the option space** that #4 picks from; **`8189b724`
  (Sept 2021) chose option #3** and specced the FactNumber priority table — this
  is its predecessor. **NEW build finding for #4:** a **partial #3 gate already
  ships** via `Faction1772.eligibleIdeologies` (`factions1772.ts:7`) consumed in
  `pickBestForFaction`/`getEligibleIdeologies` (`phaseRunners.ts:28–44`) **but
  ONLY in the 1772 inaugural draft**, with the exact priority-then-fallback shape
  #4 describes; **1856 has no equivalent and later draft years fall through to a
  soft +25 PV preference.** So #4 is *partly built in one place* — the gap is
  generalizing it to all eras/draft-years and onto base `Faction`. Cite POST 1,
  3, 5; `factions1772.ts:7,12–23`, `phaseRunners.ts:28–52`.
- **#171 (era-keyed draft-restriction ON early / OFF modern, toggle)** —
  **CORROBORATE + PREDATE.** The five options ARE the toggle's design space
  (#1/#3 = restriction-on flavours; #4 = restriction-off). The faction-as-
  coalition-vs-ideology question (POST 6) is the *why* behind making restriction
  era-keyed (looser in modern, where coalitions are messier). Cite POST 1, 6.
- **★ [CANDIDATE — likely sub-row of #4/#171 OR new] "Rand Paul Problem"** — name
  + formalize. Under any non-gated draft (the shipped soft-preference path
  outside 1772-inaugural, and the designed #4/#5), distinctive pols (Calhoun,
  Cruz, Paul) **flatten to Moderate** because rosters are Moderate-heavy and
  ideology doesn't bind votes. **Still true in the current build** (no off-ideology
  binding; ideology absent from PV/elections — `pv.ts:67`). This is the **named
  motivation** for both the draft gate (#3) and the vote penalty (#5). Cite
  POST 4, 7.
- **★ [CANDIDATE NEW — feeds #5 / vote system] Off-ideology vote penalty
  (option #5).** A per-pol vote-selection surface where voting a pol against
  their PERSONAL ideology costs points (breaks bloc-voting). **0% built** —
  `computePV` has no ideology term (`pv.ts:67`); no per-vote selection exists.
  vcczar disfavored it (big overhaul) but it is the *only* option that solves the
  Rand Paul Problem **without** a draft gate. Likely a distinct gap from #4
  (different surface: legislation/voting, not the draft). Cite POST 1 (opt 5),
  POST 7.
- **[CANDIDATE — sub-row of #4 / `8189b724`] Draftee ideology-CONFORMANCE
  (option #2/#3 half).** Whether a drafted pol's `p.ideology` is overwritten to
  the faction's card. **0% built** (`recordDraftPick` never touches `p.ideology`,
  `phaseRunners.ts:55`). Note the **soft cousin DOES ship**: the ideology-drift
  system converts pols toward the faction center over time (`phaseRunners.ts:752,
  789`). Design choice: instant conformance (#2/#3) vs. gradual drift (shipped).
  Cite POST 1 (opt 2/3).
- **[CANDIDATE — feeds draft balance; ties `d474f718`/#24/#115] Populist /
  fringe draft-pool scarcity + what-if mitigation.** The endpoint-ideology
  factions have one adjacent (vs two) → thinner pools under #3; mitigation is
  more what-if/minor fringe statesmen, at the cost of unrealistically empowering
  genuine fringe figures. **The shipped 1772 `eligibleIdeologies` already
  half-mitigates** by granting endpoint factions 2–3 eligible ideologies
  (`factions1772.ts:12,22`). Ties the what-if-roster work to draft balance. Cite
  POST 4.
- **[TERMINOLOGY — flag for consolidation] "ideology card" name collision.**
  This thread's "ideology card" (7-point personal-ideology slot) ≠ shipped
  `IdeologyCardId` (named policy/alignment cards, types.ts:322). Ensure the gap
  log doesn't conflate them. Cite POST 1; types.ts:5 vs 322.

---

## Open questions (carry forward)

- **Coalition vs. ideology (POST 6):** is a faction defined by its *members*
  (any-ideology coalition, realistic) or by its *ideology* (gated membership,
  legible)? vcczar says "we've answered… the first one" but doubts it scales.
  Per-surface decision pending — drives how hard #4/#171 gate.
- **Which option did the poll land on, and what was vcczar's "new idea"?**
  Posts 3/5/8 promise a variant presented "tomorrow" but it is **not in this
  thread** — it lives in **`8189b724` (Sept 2021)**, which specs the FactNumber
  priority-range ruleset (the softened #3). Confirm the chain in consolidation.
- **Does the off-ideology vote penalty (#5) survive anywhere later?** vcczar
  disfavored it here; check whether any later legislation/voting thread revives
  per-pol ideology-bound voting (it would be a large new surface).
- **Populist-asymmetry fix beyond 1772:** the 1772 data grants endpoint factions
  2–3 eligibles, but 1856 has no `eligibleIdeologies` at all — how is the
  populist disadvantage handled in 1856 / later eras? Unspecified.

---

## Provenance notes

- Single chunk; all **9 posts** read. POSTS 4/5 and 6/7/8 re-quote each other; the
  substantive content is **POST 1** (the five options + vcczar's preference),
  **POST 4** (jvikings1's populist-disadvantage flaw + what-if mitigation),
  **POST 6** (Hestia, coalition-vs-ideology), **POST 7** (Ted, names the Rand Paul
  Problem persists in-build), **POST 8** (decision narrowed to #1/#3, fast).
- **Dating: Aug 26 2021** — one of the **earliest design-origin threads**;
  **immediate predecessor of `8189b724` (Faction Ideology Default, Sept 2021)**,
  which chose/specced option #3. Read the two together.
- Codebase verified at `src/` HEAD 2026-06-29: `Faction1772.eligibleIdeologies`
  (`factions1772.ts:7`) gates **only** the inaugural draft (`phaseRunners.ts:28,
  38–44`); outside it the draft is soft +25-PV preference on 3-bucket
  `personality` (`phaseRunners.ts:45–52`); `recordDraftPick` never mutates
  `p.ideology` (`:55`); `computePV` has **no ideology term** (`pv.ts:67`);
  shipped `IdeologyCardId`/`Faction.ideologyCards[]` (types.ts:322, 1298) are the
  **named policy/alignment cards**, a distinct mechanic from the thread's
  personal-ideology card.
