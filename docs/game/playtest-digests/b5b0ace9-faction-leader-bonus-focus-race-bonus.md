# Digest — `b5b0ace9-faction-leader-bonus-focus-race-bonus` ("Faction Leader bonus / Focus Race bonus")

**Type:** DESIGN / RULE-PROPOSAL thread (**5/2/2025**, politicslounge topic 6223).
**NOT a playthrough.** 11 posts / 1 chunk (chunk-001.md, all 11 covered — POSTs 2/6/9/10
re-quote earlier posts; substantive content = POSTs 1, 3, 6, 7, 8, 10).
**Era:** era-agnostic (a general election-mechanics proposal, all eras).
**Participants:** **matthewyoung123** (proposer), **10centjimmy** (Euri — skeptic / floats
an alternative), **vcczar** (designer — sets the approval gate). vcczar = tier-1 (decides);
no ruling issued here beyond the gate — both ideas are **proposed, not approved**.
**Net:** two NEW unbuilt election-bonus mechanics + a simpler alternative, all gated behind
vcczar's "needs several historical examples" approval bar. None is shipped. Touches the
faction-leader / party-leader machinery (which *is* modeled, but only feeds elections
indirectly via PV) and the trait-election-bonus channel (the obvious shipping vehicle).

---

## The two proposed mechanics (matthewyoung123, POST 1) — capture exactly

### ★ 1. Faction-leader election bonus (flat)
- **+2 in primaries, +1 in general elections.** "Easy. Simple." (POST 1)
- **Non-presidential only** — author clarifies "this is all non presidential" (POST 7).
- **Reserved for faction leaders who AREN'T party leaders** (POST 6): a party leader does
  NOT additionally get the faction-leader +2 (i.e. it is not "+5 in primaries" stacked —
  POST 3/4/6 explicitly reject the stacked reading).
- **No stacking with the party-leader bonus** (POST 10): "You get the larger of the two
  bonuses." Implies a **party-leader election bonus already exists / is assumed** (+1 in the
  prez primary is referenced as small — POSTs 5, 9), and the faction-leader bonus is the
  bigger flat number for non-party-leaders.

### ★ 2. "Focus race" (hidden, per-faction, die-rolled campaign-focus bonus)
- Each election, **every faction may secretly designate ONE non-presidential race** to
  "focus" on — **Gov, Senator, OR Rep** (POST 1). One focus race per faction per election.
- **Never the Presidency** (presidential campaigns instead "focus on a region or a state" —
  noted but left as a separate idea, not specced). (POST 1)
- **Hidden until results:** opponents don't learn which race a faction picked until after the
  candidate-entry deadline / when results post. Two factions may unknowingly pick the same
  race. Stated goal: "another level of thought and planning without getting way too complex."
  (POST 1)
- **Flavor:** represents **national-party campaign focus** or a **donor cash influx** to a
  particular race. (POST 1)
- **Bonus is NOT guaranteed — a die roll** (POST 1):
  - **5–6 → +2**
  - **3–4 → +1**
  - **1–2 → nothing**

### Alternate proposal (10centjimmy, POST 8) — simpler catch-all
- Skip the faction-leader-specific rule; instead a **blanket 50% roll for +1 if a politician
  is BOTH "not obscure" AND "has leadership."** Explicitly framed as a "catch all" to avoid
  the leader/party-leader bookkeeping. (POST 8)
- 10centjimmy never warms to the faction-leader version even after the stacking clarification
  ("still don't really care for it lol" — POST 11). So the faction-leader rule has an active
  in-thread dissent, not consensus.

---

## Designer approval gate (vcczar, POST 2) — capture verbatim

> "Obviously, I'll have to approve any changes, but with any **real rule change suggestions,
> I'll need several historical examples that show the realism of such a change.**"

- This is a **standing design gate**, not specific to this thread: rule-change proposals
  must be backed by **several historical examples** before vcczar approves. Neither mechanic
  here was approved in-thread — no examples were supplied. **Both remain PROPOSED-ONLY.**
- (Consistent with the sanctioned-channel / realism-justification pattern other DESIGN
  threads record.)

---

## Built vs designed (verified against `src/` HEAD, 2026-06-29)

**Faction-leader & party-leader are MODELED as roles and grant PV — but neither confers the
proposed FLAT per-context (+2 primary / +1 general) election bonus. The party-leader
"election bonus" the thread assumes does NOT exist as a flat term; it's only PV. Focus race
is 0% built. 10centjimmy's "Leadership trait → 50% +1" path is also unbuilt (Leadership has
no election-effect row).**

- **Faction-leader / party-leader roles EXIST.** `Politician.factionLeaderOf` (types.ts:1290),
  `Faction.leaderId` (types.ts:1301), `Party.leaderId` (types.ts:1309); selection phases
  **2.2.3 Faction Leaders** (`runPhase_2_2_3_FactionLeaders`, phaseRunners.ts:1940) and
  **2.2.4 Party Leaders** (`runPhase_2_2_4_PartyLeaders`, phaseRunners.ts:2130). So the
  *entities* the proposal keys on are real and tracked.
- **Leadership's electoral effect today is INDIRECT, via PV only:**
  - `FactionLeader: 8` and `PartyLeader: 14` office-prestige PV (pv.ts:25-26); `factionLeaderOf`
    adds **+8 PV** (pv.ts:83). Becoming a leader also grants skill/command points
    (`applyFactionLeaderGrants` phaseRunners.ts:1573; `applyPartyLeaderGrants` 1595), which
    raise PV further.
  - PV reaches elections only through **`pv * 0.1`** in `calcStateVote` (phaseRunners.ts:3699,
    3709) and `c.pvCache` in `runPhase_2_9_1_Primaries` (phaseRunners.ts:3733). There is
    **NO leadership-keyed flat term** in either scorer.
- **The proposed flat faction-leader +2/+1 election bonus = DESIGN-ONLY.** `calcStateVote`
  (phaseRunners.ts:3685-3723) sums only `baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 +
  factionBias + traitBonus + jitter`. The primary scorer (phaseRunners.ts:3730-3733) sums only
  `pvCache + command*5 + traitBonus`. **No `factionLeaderOf` / `leaderId` read in either.**
- **The assumed party-leader flat election bonus also does NOT exist** as a flat term — party
  leadership only affects elections via the same PV channel. (The thread's "+1 party-leader in
  prez primary" / "larger of the two" framing presumes a flat bonus the build doesn't have.)
- **Focus race = 0% built.** `grep -riE "focusRace|campaignFocus|focusState|cashInflux|donor"
  src/` → ZERO. No per-faction secret race designation, no campaign-focus die roll, no
  hidden-until-results state anywhere.
- **10centjimmy's "Leadership + not-obscure → 50% +1" alternative = DESIGN-ONLY.** `Leadership`
  exists as a **trait** (types.ts:80, 137) but has **NO row in `TRAIT_ELECTION_EFFECTS`**
  (types.ts:738+) — so it confers no direct election bonus today (it only adds the generic +4
  positive-trait PV in pv.ts:76, and gates faction-leader tenure stability at
  phaseRunners.ts:1684). `Obscure` is not wired into any leadership/election-bonus path.
- **Shipping vehicle note (for tech-lead):** the existing additive trait-bonus channel already
  uses bands **SMALL=2 / MEDIUM=4 / LARGE=8** (types.ts:721-725) summed into the same score as
  `traitBonus`. The proposed faction-leader +2 (primary) / +1 (general) and the focus-race
  +2/+1 map cleanly onto this additive-into-score pattern; the primary scorer would also need a
  matching term (it currently takes no leadership/focus bonus). Election context enum
  (`ElectionContext`: presPrimary/presGeneral/house/senatePre17/governor/internalParty) already
  distinguishes primary vs general, which the +2-primary/+1-general split requires.

---

## Candidate gaps for consolidation

*(All PROPOSED, gated behind vcczar's "needs several historical examples" bar — none approved
in-thread. Consolidation owns numbering / dedupe against any existing election-bonus rows.)*

- **[NEW — proposed, unbuilt] Faction-leader flat election bonus (+2 primary / +1 general),
  non-presidential only.** Build models faction-leader as a role + PV (pv.ts:25,83) but applies
  **no flat election term** (calcStateVote phaseRunners.ts:3685-3723; primaries 3730-3733).
  Reserved for faction leaders who aren't party leaders; **no stacking with party-leader bonus
  — take the larger** (POST 6, 7, 10). DESIGN-ONLY.
- **[NEW — proposed, unbuilt] "Focus race": secret per-faction, one non-presidential race
  (Gov/Sen/Rep) per election, die-rolled bonus (5–6 → +2 / 3–4 → +1 / 1–2 → nothing), hidden
  until results.** 0% built — no focus-race concept exists anywhere in `src/`. Represents
  national-party campaign focus / donor cash influx. DESIGN-ONLY. (POST 1)
- **[NEW — proposed alternative, unbuilt] Catch-all leadership election bonus: 50% roll for
  +1 if a politician is "not obscure" AND has the Leadership trait.** `Leadership` has no
  `TRAIT_ELECTION_EFFECTS` row (types.ts:738+); `Obscure` not in any election-bonus path.
  DESIGN-ONLY; an alternative to the faction-leader rule, with in-thread dissent. (POST 8)
- **[clarifies — assumed-but-absent] Party-leader flat election bonus.** The thread treats a
  flat party-leader election bonus (e.g. +1 in prez primary) as already existing and as the
  thing the faction-leader bonus must not stack with (POST 5, 9, 10). In the build, party
  leadership affects elections **only via PV** (PartyLeader +14 PV, pv.ts:26) — there is **no
  flat party-leader election term**. Flag: if the faction-leader rule is adopted, the
  "larger-of-two, no-stack" rule presumes a party-leader flat bonus that must be built too.
- **[process] Designer approval gate:** real rule-change proposals require **several historical
  examples of realism** before vcczar approves (POST 2). Reinforces the sanctioned-channel /
  realism-justification design norm. No code delta; context for the roadmap (these three
  mechanics are unratified).

---

### Open questions (carry forward)

- **Does a flat party-leader election bonus actually exist (designed) anywhere?** The thread
  assumes one; the build has none. Need the canonical party-leader bonus number to make the
  "larger of the two / no stacking" rule well-defined. Unresolved in-thread.
- **Focus-race ordering / reveal mechanics:** when exactly is the pick locked (POST 1 says "the
  deadline to enter candidates"), and how does the hidden-then-revealed flow work in a
  single-player build with CPU factions? Unspecified.
- **Which (if any) of the three got historical-example backing afterward?** None supplied
  in-thread; status of vcczar's gate for these specific mechanics is open (see other May-2025
  election threads for any follow-up).
- **Focus race for President** ("focus on a region or a state") was floated but not specced
  (POST 1) — separate, undefined.
