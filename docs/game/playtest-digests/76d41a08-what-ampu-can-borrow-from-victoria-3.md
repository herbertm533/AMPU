# Digest — "What AMPU Can Borrow from Victoria 3" (76d41a08)

**Type:** DISCUSSION / design-inspiration thread (Oct–Nov 2022). NOT a playtest.
**Scope:** 181 posts / 3 chunks, opened by **vcczar** (tier-1 designer) asking what
*Victoria 3* mechanics AMPU should consider. Authority tiers seen: **vcczar = tier-1
designer**, **MrPotatoTed (Ted) = tier-1 designer/co-author**, **themiddlepolitical
= core contributor**, **OrangeP47 = census/numbers SME (GA-tier)**.

**Read this as aspirational / parking-lot scope, not near-term gaps.** Almost
everything Vic3-specific is explicitly flagged by the designers as **"AMPU 2"** or
"too complex / scrapped." Critically, the thread **derails by POST 8** into a long
census/electoral-vote balance argument and then ~100 posts of vcczar hand-authoring
**172 new population/EV scripted events** (POST 84–180). That data-authoring work is
real and load-bearing but it is **balance/data work on EXISTING systems** (#35/#43/#92),
not Vic3 borrows — summarized at the bottom, not in the borrow table.

Net: **only ~5 genuine Vic3-borrow ideas**; the rest of the thread is an EV-cap /
census-balance debate that the title attracted by accident.

---

## Vic3-borrow ideas (by theme)

| # | Vic3 mechanic | Proposed AMPU adaptation | Proposer / disposition | Tag |
|---|---|---|---|---|
| B1 | **Interest Groups have an ideology + dynamically JOIN / FORM / SWITCH parties** (Vic3: IGs realign, can split off communist/people's parties, a farmer IG defects, the Whigs collapse to <1%) | Let AMPU's interest-groups/lobbies (which already carry ideology) **dynamically join or form new parties** over the campaign instead of the fixed 2-party BLUE/RED | **vcczar** proposes it as "one of my favorite things in Vicky 3" but **explicitly defers it: "would be an AMPU 2 thing"** (POST 4). **themiddlepolitical**: had a similar pre-V3 idea but **"realized it was too complex and scrapped it"** (POST 5). **Tier-1 SOFT-REJECT for v1** | **net-new aspirational** (beyond shipped 2-party model #389-390 + enthusiasm #50/#51; would require dynamic party creation, which AMPU does NOT have) |
| B2 | **Vic3 nation-building "agitate/advocate" decisions** that push national values | New **Gov Actions** that boost meters or score points for an interest bloc: *Improve Infrastructure, Advocate Nationalism, Advocate Social Mobility, Advocate Environmentalism (→climate/planet meter), Advocate Military Service (→MilPrep), Advocate Traditional Family Values, Advocate Equity for Blacks, Advocate Political Reform, Advocate Isolationism, Advocate US Exceptionalism* — each era-keyed with a start era (POST 15) | **vcczar** — actively building them; **"these are going to be the new gov actions"** (POST 6, 15). **Ted endorses/affirms**: agrees "more gov actions that affect meters are needed," notes current meter-actions are non-repeatable and a state goes "spent…forever" once popped (POST 7). **Tier-1 ENDORSED & in progress** | **aligns-with-existing-gap #20** (Governor's-actions library — these are net-additions to that enum; the "repeatable meter-boost" point sharpens #20). Era-keyed start = #92 |
| B3 | **Vic3 migration / pop-movement systems** | Gov Actions **Encourage Domestic Migration** (chance to raise a state's population at the expense of a random bordering state) and **Encourage Immigration** (raise population; **"Nationalists will hate it"** → ideology-faction friction) (POST 6, 15) | **vcczar** proposes & affirms (POST 6, 15) | **aligns-with-existing-gap #20** (new Gov Actions) + touches **#35/#92** (population/EV redistribution). The "steal from a bordering state" zero-sum mechanic prefigures vcczar's later live rule that a Gov-Action EV gain is **taken from another state** (POST 129, 139) |
| B4 | **Vic3 state/regional economy granularity** (each region has its own economic condition) | **State-level meters** (esp. **economy**), with **national meters becoming an AVERAGE of per-state meters**; governors would then have a real reason to fix their own state (POST 45) | **Ted**: *"I've always wished most of the meters were at the state level… But that's probably AMPU 2."* **Tier-1 ASPIRATIONAL / self-deferred to AMPU 2** | **net-new aspirational** (shipped `NationalMeters` are national-only, line 406-407; no per-state meter field). Big architectural shift |
| B5 | **Vic3 Pop/Interest-Group AGENDAS** (IGs pursue goals; satisfying them matters) | Use V3 pop/interest groups as a model to give **each lobby an era-by-era AGENDA**; the **faction that completes the highest % of its agenda gets a bonus**. vcczar notes he already has a **"benchmark" section** that is similar **"but I think I should rework it"** (POST 181) | **vcczar** — closing thought, exploratory ("part of me is wondering if…"). **Tier-1, UNDECIDED/exploratory** | **net-new aspirational**, but **anchors to an EXISTING "benchmark" system** vcczar wants to rework (relates to lobby/interest cards #387-388 + DH-11 "lobby cards too inelastic") |

---

## Anti-patterns / things the thread argued AGAINST

- **B1 / B4 dynamic-party + state-meters**: both tier-1 designers self-classified
  these as **"AMPU 2" / "too complex, scrapped"** — i.e. deliberately OUT of scope
  for the current build, not bugs to fix (POST 4, 5, 45).
- **"Just make events not move EVs"** (the simple fix to the census problem):
  OrangeP47 **rejects it** — "while it'd fix the problem it'd make events less fun"
  (POST 70); echoed by Ted on agency: nerfing player control "will discourage the
  player base" (POST 146). Disposition: agency must be preserved (vcczar concedes,
  chooses to *reduce* not remove player EV-agency, POST 145-147).

---

## Major NON-borrow content (census / EV balance + data authoring) — for awareness only

The bulk of the thread (POST 8–180) is **not** Vic3 material; it is a balance debate
+ data-authoring sprint on AMPU's **existing** census/industry/EV systems
(**#35 / #43 / #92**, and Gov-Action EV side-effects under **#20**). Captured here only
so it is traceable; these are refinements to shipped/designed systems, **not** new
aspirational scope.

- **Census double-dipping concern (Ted, POST 8).** Ahistorical EV events (Cotton
  Gin/Cotton Boom) stack on top of historical EV gains → projected runaway US
  population (Ted projects ~743 EV by 2020 uncapped, POST 38). OrangeP47 argues it's
  ~0.5–1%/decade and not a problem (POST 11, 14, 20, 50); the two **never fully agree**.
- **Designer rulings that emerged (tier-1, AUTHORITATIVE):**
  - **No EV equalization/cap exists today unless Congress passes a House-Cap law** —
    confirmed as intended by OrangeP47 (POST 18, 21) and vcczar accepts ("Ok, I won't
    fix it then," POST 22). 3.0 rules quoted verbatim by Ted (POST 25): census fires
    the **half-term after a decade** (1862, not 1860); ahistorical states get +3 EV;
    industry shifts roll for ±1 EV.
  - **Industry→EV roll nerfed 25% → 10%** by vcczar (POST 129) once the 172 events
    were added, to avoid over-wildness.
  - **Gov-Action EV gains become ZERO-SUM**: vcczar makes a state's EV gain/loss from a
    Gov Action **take/give the EV from/to another state** to keep the EC balanced
    (POST 129, 139). OrangeP47 flags this risks **"double-dipping" the fix** (POST 142-144).
  - **Move ALL inter-census EV change to EVENTS** (the approach `terror2000` later
    confirms as canon): vcczar resolves to **get rid of historical EVs and drive EV
    movement via scripted events**, mostly industry-tagged (POST 72-80).
- **The data sprint (POST 84–180):** vcczar hand-authored **172 new population/EV
  scripted events** covering all 50 states 1788→2020 (per-state +/- EV with a flavor
  reason each, e.g. NY +10 1810 Fulton's Steamboat; CA +19 1930; MS −1 2000), plus
  amended existing events / legis-props / pres-actions. Estimated ~100 hrs of work;
  ~101/172 filled by thread end (POST 178-180). This is the provenance for the
  **event-driven census model** now reflected in #92/#35.

---

## Candidate parking-lot items for consolidation (ASPIRATIONAL — NOT near-term gaps)

> All explicitly designer-tagged "AMPU 2" / exploratory; logged so the consolidation
> agent can park them, not promote them.

- **[PARKING-LOT] Dynamic party system** — interest-groups/lobbies (ideology-carrying)
  can join/form/split parties over a campaign, breaking the fixed 2-party model
  (Vic3 IG→party). Tier-1 "AMPU 2"; "too complex." (B1; vcczar POST 4, mp POST 5)
- **[PARKING-LOT] State-level meters** — per-state meters (esp. economy) with national
  meters as their average; gives governors stakes in their own state. Tier-1 "AMPU 2."
  (B4; Ted POST 45) — large architectural shift vs shipped national-only `NationalMeters`.
- **[PARKING-LOT] Per-lobby era AGENDAS + completion bonus** — each lobby gets an
  era-keyed agenda; faction that completes the highest % earns a bonus; rework of the
  existing "benchmark" system. Tier-1 exploratory. (B5; vcczar POST 181)
- **[NEAR-TERM-ADJACENT, NOT parking-lot] New meter-boosting + migration/immigration
  Gov Actions** (Advocate Nationalism/Environmentalism/Military-Service/…, Encourage
  Domestic-Migration/Immigration) — these are **#20 additions vcczar is actively
  building**, era-keyed (#92), with immigration creating Nationalist-faction friction.
  Flag to consolidation as **extends #20**, not a true parking-lot item. (B2/B3)
