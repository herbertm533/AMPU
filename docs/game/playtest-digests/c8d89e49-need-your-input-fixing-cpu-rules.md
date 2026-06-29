# Digest — "Need Your Input: Fixing CPU Rules" (`c8d89e49`)

- **Source:** `docs/game/sources/c8d89e49-need-your-input-fixing-cpu-rules/chunk-001.md` (1 chunk, 56 posts, ~49k chars, **1224 lines**).
- **Topic by:** @MrPotatoTed (the designer/GM). Thread runs **Aug 24 – Oct 1 2025** — RECENT. Participants: MrPotatoTed, matthewyoung123, OrangeP47, 10centjimmy, Umbrella, Zagnut, Saucialiste, Arkansas Progressive (the rules-implementer), vcczar (engine), "Anthony" (the human dev coding the CPU).
- **Nature:** ★ HIGH-RELEVANCE **design thread**, not a playthrough. It is the designer's roadmap for making the **CPU AI deterministic and shippable**. No era-spanning campaign here; the running fiction is an "all-CPU game" used as a test harness (POST 1) and an "OOPS All CPU game" (POSTs 47, 55). Era framing is therefore incidental; where figures are named (Jefferson/Henry as B5 fringe-draft example POST 20; 1794 midterms POST 33; Revolutionary War POST 44) the **founding/federalism polarity holds** (BLUE = Dem-Reps, RED = Federalists — see `historical-context.md` cross-era polarity map). The thread is about **rules structure**, so most content is era-agnostic.
- **Scope:** This digest is the durable provenance for the **CPU Gov-Action decision spec** (the #20 gov-action / CPU-decision cluster) plus a cluster of adjacent CPU-rule fixes the thread also settled. **DIGEST-ONLY** — does not touch `game-context.md`.

---

## 1. The two stated OBJECTIVES (POST 1, restated POST 3)

The designer opens with two ranked goals for the whole CPU ruleset:

1. **FIRST PRIORITY — zero human interpretation.** "Make the CPU rules require absolutely no human thought/interpretation. Too much of it is vague/general guidelines instead of '20% of the time, it will do this, 40% it will do that,' etc, and then you just roll a die and do it." (POST 1)
2. **SECOND PRIORITY — more strategic / human-like CPU.** (POST 1)

**Focus area = Gov-Action CPU rules** ("One area I'd really like to build up is the CPU rules for Gov Actions," POST 1).

**The d100 convention (POST 2, POST 17-as-method):** "if it says 25% this, 25% that, I do d100, 1-25 is this, 26-50 that … You just have to reformat it." (POST 2) — i.e. every CPU rule should resolve to a **single d100 roll against cumulative percentage bands**. This is the exact mechanic the browser port must encode.

**Why vague rules are the problem (POST 4, POST 6):** legislation CPU is "pretty straight forward because it's points based," but gov actions are "more nebulous … there are strategic reasons to invest in an industry or adjust term limits, but they aren't directly points-based." The fix the group converges on is **"a kind of hierarchy of which gov actions are most beneficial … especially as If-Then statements."** (POST 4) "Anthony" (the dev) "knows the game less than any of us … I don't want to leave it to him to just guess." (POST 5) — explicit demand that the *design*, not the implementer, encode the decision tree.

---

## 2. The Gov-Action CPU decision DESIGN (POSTs 3-10)

The group's emergent decision hierarchy (most-human first). **This is the headline spec.**

### 2a. Hierarchy / if-then (POSTs 3, 4, 9-10)
1. **Political machine + gerrymander prioritized ABOVE ALL** — these are the "most human" actions (POST 9, endorsed POST 10). They are **non-points-based but party/faction-beneficial** (this is the "grey area" that points-logic misses, POST 10): "gerrymandering, and other actions which don't result in points CAN benefit a party/faction. That is where the grey area is that needs to be clarified."
2. **If the GOV meets the prerequisites for any special action** (build railroads, gerrymander, build political machine, etc.), **those are prioritized** over generic actions (POST 3).
3. **Most-important action class (POST 9):** actions that "provide faction, meter/crisis, ideo/lobby/IG, and party pref boosts." (i.e. faction-card / crisis-meter / ideology-lobby-interest-group / party-preference benefits.)
4. **Industry-investment = the reliable default ("when all else fails," POST 6):** "If you increase an industry, it gives points for that industry in leading states. In practice, basically increasing an industry is always a points boon … you can't go wrong with this, because you're sure to get some points (assuming you actually control some states)." If the GOV meets NO special-action requirements, "they look at adding/growing the largest industry in their state." (POST 3)
5. **Crisis-first (minority view, POST 17):** "I guess I'm the only one who prioritize Gov Actions dealing with the current crises." — rebutted POST 18: "That's what they're supposed to start with, but the most human strategy is to secure your faction ahead of anything else." (So: faction-security > crisis-response in the agreed ordering.)

### 2b. Industry sabotage — the strategic twist (POST 7)
**Decrease-industry to sabotage opponents:** "Decreasing an industry should take away points from those leading states. If the other party controls all those states, sabotage the economy." Flagged as possibly "out of control" — i.e. a guarded/conditional rule (only when an opponent leads ALL relevant states).

### 2c. Faction-lobby-tied industry priority (POST 9)
The default industry pick is **steered by the faction's lobby card**:
- **Wall Street lobby → increase Finance industry** wherever possible.
- **Big Ag → Agriculture.**
- **Big Corps → Mining / Manufacturing.**
- (Generalized: "Same with … etc.")

> **Code cross-ref:** this mapping already exists in the build as `LOBBY_INDUSTRY` (`src/types.ts:398-414`) — e.g. `Merchants → ['shipping','finance']`, `SmallFarmers → ['agriculture']`, `NorthernIndustry → ['manufacturing','coal']`. But it is consumed by the **PR7 passive nudge at phase 2.1.8**, NOT by any governor action (see §4).

### 2d. Hamstring rival ideologies (POST 9)
"Hamstring other factions by ensuring their ideo is most effective (state loyalists, poll tax, etc)." I.e. use gov actions like **Fill State Offices with Faction Loyalists / Poll Tax / state-loyalist** levers to make a rival ideology *over*-represented where that hurts them, or suppress their voters. (Non-points, strategic — same grey area.)

### 2e. Candidate selection for Gov seats — protégé-first + the "+1 bonus" expansion (POSTs 9-10)
- **Protégés should ALWAYS be the first choice for Gov candidates** (POST 9; POST 10 quotes it back).
- **Existing CPU rules quoted (POST 10):**
  - "**20% of the time they will select a protege that has a kingmaker.**" — 10centjimmy: "I could see making argument that it should be higher priority."
  - "**20% of the time they will select the eligible politician that has 'charisma,' 'leadership,' 'likable,' 'manipulative,' or 'integrity.'**"
- **Proposed expansion (POST 10):** widen that second rule to **anyone who has a +1 to their election chances** (via events or anything): "+1 to election is actually much more powerful than having the traits mentioned, since it is a guaranteed +1, where these others are only a possible +1." → **a guaranteed +1 beats the maybe-+1 traits.**

---

## 3. ★ The Gov-Actions Requirement List (POSTs 11-13)

Arkansas Progressive transcribed **"every single gov action organized by what requirements are needed"** (POST 11, declared complete POST 13; note POST 12 "I was not done but will update"). Two parsing keys stated at the top of POST 11:
- **"replace Judicial with Justice when implying expertise"** (the action text says "Judicial" but means the **Justice** expertise tag; cf. POSTs 15-16 — "Legalize Robot Marriage needs a gov with Judicial ability and not Justice"; consensus POST 16: should be **either Justice ability OR skill**).
- **"one same party US Senator"** is a recurring prerequisite ("Ditto … below").

### Structure (the durable part — a representative sample, not the full ~150-item list)

**Bucket A — NO REQUIREMENT** (any governor may attempt). Representative sample:
- Call on Congress to pass specific legislation in the next session
- Increase / Decrease State Gov Jobs
- Split Electoral Votes
- Advocate Environmentalism (*activates "Not RW Activist"*) / Equity for Blacks (Civil Rights) / Isolationism (Pacifist) / Military Service (Not Pacifist) / Nationalism / Political Reform (Reformist) / Social Mobility (LW Activist) / Traditional Family Values (Theocrat) / US Exceptionalism (Expansionist) — a whole **"Advocate X"** family that simply *activates* an ideology/interest flag.
- Build Hyperloops; Build State University; Call for New Constitutional Convention; Call for state secession convention; Create State Park System; Improve a Burgeoning Industry; Neglect Industry So that another might prosper; Lower/Raise taxes; Ratify Constitution; Set Primary Delegates; Volunteer State Funds to Central Government; Punish Tories; Promote Foreign Immigration; etc.
- Note several carry **inline parentheticals** that look like requirements but are really *activation conditions or de-activation actors* — e.g. "Property requirement for legal voters (Big Corp/Wall St to activate, LW Pop/RW Pop/Reformist to deactivate)"; "State Legislature selects President (… to deactivate)". These are toggle-state actions, distinct from hard prereqs.

**Bucket B — PREREQUISITE-GATED.** The requirement pattern is **trait AND/OR expertise AND (sometimes) "one same-party US Senator"** plus, occasionally, **same-party-Senator ideology conditions**. The list is organized into sub-headers, each a gate:
- **"1 Same Party U.S. Senator"** gate → term-limit toggles (No term limits / 1-term / 2-term / "can run after one term out"), Make faithless electors illegal, Remove Age Restrictions for Governor, State Primary placement/allow, **Build roads/bridges/canals**, Decrease Polling Stations, Legalize (Medical) Marijuana, Major Irrigation, Rebuild Infrastructure, Stand Your Ground, Winner-Takes-All toggles.
- **"Ditto Civil Rights Interest"** → Abolish Private Prisons, Legalize Hard Drugs, Abolish Death Penalty, Gun Buyback, Civil Rights Protections, **Poll Tax / Jim Crow / Literacy Test / Segregation / Strict Voting ID (all "deactivate")**, Make lynching illegal, Remove CSA Monuments.
- **"Ditto Activist Interest"** → big RW/LW-tagged toggle list (Arm Teachers RW-activate/LW-deactivate; Ban Child Labor LW; Abortion Restrictions RW; Recognize Gay Marriage LW; Restrictive/Concealed/Open Carry; Welfare/Overtime; etc.).
- **"Ditto Justice Expertise"** → Expand Prison System, Challenge Legislation, **Fill State Judges with Loyalists**, "Tough on Crime," Legalize Gambling/Prostitution/Lotteries, **Anti-Corruption Campaign (integrity or reformist)**, **Fair Redistricting (integrity or reformist)**, **Gerrymander (controversial OR Iron Fist)**, Make State Judges Elected.
- **"Ditto Transportation expertise"** → **Build Railroad**. **"Ditto Business expertise"** → **Build Railroad** (so Build Railroad has TWO entry expertises), State Healthcare, State Income Tax, Work-From-Home incentives, Weaken Labor Unions (Right to Work).
- **"Ditto Military expertise"** → Build Military Academy. **"Ditto Environmentalist"** → State Green New Deal, Protected Wildlife. **"Ditto Education"** → Emphasis on Public Schooling, Ban teaching Evolution (deactivate). **"Ditto Welfare / Agriculture / Labor / Economics / Trade / Healthcare / Energy / Science"** → the matching policy actions (Subsidies to Agriculture, State Minimum Wage, Strengthen Labor Unions, State Income Tax, etc.).
- **Ideology-gated** ("Ditto Populist/Progressive/Liberal/Traditionalist") → e.g. **Abolish Slavery (LW Pop, Prog, Lib, or Civil Rights — AND "No Sen is Trad or RW Pop")** appears repeatedly: a *compound* gate (governor's ideology/interest **AND** a negative condition on the state's Senators). Women's Suffrage, Prohibition, Ban Child Labor, Crack down on L/R-wing radicals (mirror pair RW Pop vs LW Pop), etc.
- **Interest-card-gated** ("Ditto Human Rights / Globalist / Public Healthcare / Law & Order / Public Education / Iron Fist / Controversial / Integrity cards") → e.g. **Gerrymander** also reachable via **Iron Fist** *or* **Controversial** cards (with Justice expertise); Integrity → Anti-Corruption / Fair Redistricting / Ban Animal Cruelty.
- **Multi-officeholder compound gates** (the most complex): "**Gov and Senator are same party and theocratic** → Ban Abortion"; "**Gov and Senator same party and RW Activist** → Practically Abolish Blacks from Serving on Juries"; "**Gov and both Senators are RW Activist** → Expand Slavery to Native Americans / Poor Whites"; "**Gov and Sen are 'can be independent'** → Non-Partisan Blanket Primaries"; "**Gov and Both Sens same party** → Purge Voter Rolls"; "**Gov has ≥1 Judicial ability** → Legalize Robot Marriage."

**Takeaway for the engine:** every action needs a machine-readable **requirement predicate** over `(governor.traits, governor.expertise/skills, governor.ideology, governor.interestCards, sameParty(senators), senatorIdeologies)` plus an **activate/deactivate** verb and an **era-availability** gate (POST 14-15: many actions are late-era-only, which OrangeP47 flags as the thing that "limits early game" — *content gap, not a bug*).

---

## 4. SHIPPED vs. DESIGNED — code verification

**Verified against the build (Opus, this batch):**

- **There is NO gov-action system and NO CPU gov-action decision logic in the build.** `grep` for `govAction|GovAction|governorAction` = **0 hits** across `src/` (matches batch-46). The word "industry" appears only in `types.ts`, `phaseRunners.ts`, `factions1856.ts`.
- **`src/pages/GovernorsPage.tsx` is purely READ-ONLY** — a `<table>` of State / Region / Governor / Party / Ideology / Gov Skill. No buttons, no actions, no dispatch. Registered passively as `governors: GovernorsPage` (`registry.ts:87`).
- **The only thing that mutates `state.industries` is the passive PR7 nudge at phase 2.1.8 (`runPhase_2_1_8_FactionPersonalities`, `phaseRunners.ts:1631-1656`)** — confirming the b46 finding that the industry-boost "fires on faction-card, not governor." It loops every state, and for each faction with a **living member resident in that state**, bumps each `LOBBY_INDUSTRY[card]` key that already exists on `s.industries` by +1 (clamp ≤5), deduped per (state,key) per year. **No governor, no decision, no action verb** — it is an automatic side-effect of faction lobby cards + residency, deterministic but not a *choice*. The designed "increase the largest industry in your state" / "Wall-St lobby → finance" gov action (POSTs 6, 9) is therefore **0% shipped as an action**; only the lobby→industry *mapping* exists, repurposed for a passive yearly tick.
- **State has the data fields a gov-action system would target but no action surface:** `State.industries: Record<string, number>` (`types.ts:1328`), `State.termLimits: 'two_terms' | 'no_limits'` (`types.ts:1396`), `State.electoralVotes: number` (`types.ts:1323`). So "adjust term limits," "split electoral votes," "increase industry" all have a **data target but no mutator/CPU rule**.
- **CPU decision machinery EXISTS for other phases** (so the pattern is proven, just not applied to gov actions): draft scoring (`runPhase_2_1_1_Draft`, auto-pick `Draft.tsx:99`), career-track assignment (2.1.2), ideology-shift CPU (`IDEOLOGY_SHIFT_ODDS.cpu`, `types.ts:261`; gates at `phaseRunners.ts:866-881`), conversion sign/poach CPU (`CONVERSION_ODDS.cpu`, `types.ts:289`; `phaseRunners.ts:1159-1188`), kingmaker auto-assign (`phaseRunners.ts:1482-1496`, `actor:'cpu'`), cabinet auto (2.3.1), constitutional-convention party-vote CPU (`constitutionalConvention.ts:79-82`). All resolve via `chance(gate)` over `Math.random()`.
- **Protégé / kingmaker system exists** (`assignProtege`, `types.ts:1283 protegeId`, kingmaker candidate selection) — but the designed **"protégé-first / +1-election-bonus" GOV-CANDIDATE selection (POSTs 9-10) is NOT implemented**: there is no governor-nomination CPU step that consults `protegeId` or trait lists. The "20% protégé / 20% charisma-etc" rules quoted in POST 10 are **forum-rules text, not code**.
- **★ DETERMINISM GAP — `rng.ts` is NOT seeded.** Despite CLAUDE.md's "seeded RNG; keep engine code deterministic," `src/rng.ts` uses **`Math.random()` directly** (its own header comment: *"deterministic seeding can be plugged in later"*). It DOES expose `d100()` and `rollVs(target): {roll, success, margin}` — the **exact d100-vs-threshold mechanic** the thread's OBJECTIVE 1 + POST 2 require — but they are non-deterministic today. The CPU-rule spec is "roll a die" (POST 1-2); to be reproducible/testable in the browser port, **the d100 rolls must run on a seeded RNG** (the `rollVs` helper is the right shape; it just needs a seeded backend). `uid()` and `pick/shuffle/pickWeighted` are also `Math.random`-based.

---

## 5. Adjacent CPU-rule fixes settled in this thread (smaller deltas)

These are not gov-action but are concrete CPU rules the thread *resolved* and the port will need:

- **Fringe-faction draft exception (POSTs 20-27).** Bug: a fringe faction (e.g. B5, "the only Blue faction that can take RW Pop") drafts a high-PV pol *only it can take* (Jefferson) ahead of a contested pol (Trad Patrick Henry) it shares with other factions — un-human. Agreed fix: **evaluate "only-I-can-take" pols at a *fraction* of real PV** so the fringe CPU swoops them late but before a bordering CPU (~30% cross-border attempt rate, POST 21) can steal them. POST 26 works the probability math (≈45% bordering-attempt ratio to expect one Jefferson grab over 3 rounds). *Code note:* draft is PV-based today (`runPhase_2_1_1_Draft`); the fringe-discount is unbuilt.
- **VP-with-President re-nomination + alternates (POST 31 — designer SHIPPED these to the rules in §2.9.4):** (1) a CPU incumbent President party-leader **always re-nominates their incumbent VP** if eligible; (2) during "proposing alternates" the CPU **nominates an alternate if no one else has** (avoids 50/50 ties, since vote-throwing controls outcomes); (3) CPU **prioritizes alternates from its own faction.**
- **Senate-appointment-vs-House-majority dilemma (POSTs 33-43).** When the only same-party Senate appointee is a **Focus Rep** whose seat then flips to the other party, the CPU shouldn't auto-appoint if it costs a thin House majority. Long debate; **final agreed rule (POST 42, OrangeP47):** "The CPU will consider a pol from the other party for a Senate appointment over a same-party Focus Rep if appointing the Focus Rep would reduce the CPU's House majority more than appointing the other party would damage its Senate majority." (Earlier candidates POSTs 36/39 keyed on ">3 vote share" / "<1% House diff.")
- **Efficient-cabinet meter reroll (POSTs 47-48).** Step-9 "lingering rules" let an Efficient cabinet member reroll a meter attempt but **has no CPU rule.** Agreed: **Admin 4-5 → reroll any non-improving roll; Admin 0-3 → reroll only decreasing rolls; meter-state override → if meter at lowest, reroll anything not improving; if at highest, don't reroll non-decreasing; in crisis always reroll.**
- **Vacancy-fill / nomination-acceptance gaps (POSTs 50-51).** §3.0 vacancy rules let the CPU wrongly pick VP/Senators/cabinet for a **Supreme Court** seat. Clarified: justice accepts top-cabinet only 10% → infer **top cabinet accepts SCOTUS ~90%, senators/reps/governors 100%**; **VP cannot accept** (elected with President, can't resign to switch jobs, POST 51).
- **Ideology-shift CPU rules (POST 55, tried in OOPS thread).** A 4-step ordered ruleset: (1) kingmaker w/ no protégé & no puritan/integrity → shift kingmaker toward a potential protégé (one move); (2) kingmaker w/ no protégé & has puritan/integrity → shift a protégé toward kingmaker, with a 6-way tiebreaker ladder (career-track / no-flipflopper / no-integrity / no-puritan combos); (3) **40% toward party's highest-enthusiasm ideology**; (4) **60% toward the politician's state's preferred ideology** — all "provided shift can be made in one move." Add-ons proposed: protect pols already Two-Faced/Pliable in tiebreak; any "Can Party Flip" pol whose ideology hit the party's *lowest* enthusiasm should pre-emptively shift to avoid being poached.
- **Tiebreaker convention (POST 56):** for "choose any faction" rules in §3.0.26 → **use lowest-scoring faction as tiebreaker, then random.**
- **Revolutionary War un-winnable under CPU rules (POSTs 44-46) — DEFERRED.** Umbrella: 9/10 sims lost; Mil Prep caps at 2 without the Militia Act (Federalism-era only), CPU rarely builds Continental Navy / Minister to France, and puts good officers (Washington) on the military career track so they're unavailable. Proposals: make Continental Navy a military crisis; decouple Mil Prep from Militia Act; "game-over war" special rules; alter military-career-track rules during a major war. **Designer ruled POST 46: "more like something to deal with after release."** (Logged as deferred, not in the gov-action critical path.) Cross-ref the b47 "rethinking-how-war-works" cluster.
- **Bundling rules (POST 19):** "the worst AI mess in the game … Whole thing should be thrown out and started over." — flagged, not specced here.

---

## 6. Open questions (for the human)

- **Full action catalog never finalized in-thread.** POST 11 is explicitly partial (POST 12: "I was not done"; POST 13 claims complete but the text shows truncations/dupes — "Split Electoral Votes" and "State Primary Placement" appear twice). The authoritative complete list lives in the team's rules spreadsheet, not this thread. **The port needs that sheet to enumerate every action + its exact requirement predicate, activate/deactivate verb, points/IG/meter effect, and era-availability.**
- **Judicial-vs-Justice ambiguity unresolved in code terms** (POSTs 15-16): is the gate the **Justice expertise tag** or the **judicial skill (0-5)**, or "either" as POST 16 wants? Engine distinguishes `skills.judicial` from an `Expertise` enum — needs a per-action decision.
- **Industry-sabotage guardrail (POST 7):** "might get out of control" — no agreed cap. Needs a rule (e.g. only when opponent leads *all* states in that industry; limit per turn).
- **Protégé-priority weight (POST 10):** keep the existing 20% or raise it? 10centjimmy argued higher; not settled.
- **"+1 election bonus" has no engine representation** (no `electionBonus` field; `Charismatic` is only a draft-trait seed). Implementing POST 10's expansion requires first modeling a per-politician election-bonus value.
- **Admin-3 reroll risk posture (POST 47):** conservative vs. gambling CPU — left as a tuning knob.

---

## 7. Deltas vs current build — handoff to tech-lead / roadmap-planner

**Headline requirement: a deterministic CPU Gov-Action decision spec for a gov-action system that is 0% shipped.** The build has the *data targets* (`State.industries`, `termLimits`, `electoralVotes`) and a proven *CPU-rule pattern* (gates over RNG in draft/ideology/conversion/kingmaker phases) but **zero gov-action surface** and **zero gov-action CPU logic**; `GovernorsPage` is a read-only table.

1. **Build a Gov-Action library + execution phase** (new phase, e.g. a "2.x Governor Actions" runner). Each action = `{ id, requirementPredicate(gov, sameParty(senators), senatorIdeos), verb: activate|deactivate, effect (points/IG/meter/faction/industry/term-limit/EV-split), eraAvailability }`. Source the full catalog from the team rules sheet (POST 11 is partial). Cross-ref #20 (Governor's actions library / CPU rework) and the b46 gov-action gaps.
2. **CPU Gov-Action decision hierarchy (deterministic, d100-rollable)** — encode POSTs 3-10 as ordered if-then:
   - (i) if eligible: **political machine / gerrymander** (top priority, "most human");
   - (ii) else any other **eligible special action** that yields faction/meter-crisis/ideo-lobby-IG/party-pref boosts;
   - (iii) **hamstring rival ideology** (state-loyalists/poll-tax) where applicable;
   - (iv) **default = increase industry**, steered by faction lobby (`LOBBY_INDUSTRY` already maps Wall-St→finance, Big-Ag→agriculture, Big-Corps→mfg/mining — reuse it as an *action chooser*, not just the 2.1.8 passive nudge);
   - (v) **industry-sabotage** (decrease) only when an opponent leads all relevant states (needs guardrail);
   - faction-security ranks ABOVE crisis-response (POST 18 over POST 17).
3. **CPU Gov-CANDIDATE selection rule** (POSTs 9-10): **protégés first**; then expand the "20% charisma/leadership/likable/manipulative/integrity" rule to **anyone with a guaranteed +1 election bonus** (requires modeling an `electionBonus` value first — none exists today).
4. **Seed the RNG (`rng.ts`).** `d100()`/`rollVs(target)` already exist and are the correct mechanic, but they run on `Math.random()` — contradicting CLAUDE.md. Back them with a seeded generator so every CPU d100 (gov-action + all other phases) is reproducible/testable in the browser port. This is a prerequisite for OBJECTIVE 1 ("roll a die and do it") being verifiable. Cross-ref the deterministic-RNG requirement and b47 predicate work (#288).
5. **Requirement-predicate primitives** the engine will need: `governorExpertise`/`governorSkill` (resolve the Judicial↔Justice and skill-vs-expertise ambiguity), `sameParty(gov, senator)`, `senatorIdeologyIs(...)`, `governorInterestCard(...)`, plus **activate/deactivate state-flag tracking** for toggle actions, and **era-availability gating** (POST 14-15: many actions late-era — content gap that starves early game).
6. **Adjacent CPU rules to port** (already resolved in-thread, see §5): fringe-faction draft discount; VP re-nomination + alternates (POST 31, designer-shipped); Senate-appointment-vs-House-majority comparator (POST 42); Efficient-cabinet meter-reroll by Admin+meter-state (POSTs 47-48); SCOTUS vacancy acceptance odds + VP-can't-accept (POSTs 50-51); the 4-step ideology-shift ruleset (POST 55); lowest-scoring-faction-then-random tiebreaker (POST 56). **Deferred:** Revolutionary-War winnability (POST 46, post-release) and the AI bundling rules (POST 19).
