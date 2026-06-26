# AMPU — Roadmap

> **★★★★ Batch-14 version — DOWNSTREAM GILDED-ERA CONTENT (NOT a re-sequence, NO new
> keystone). The FIRST dedicated native-1868 Gilded-Age campaign + the LARGEST thread
> in the KB: `gild1868` (`bf590684`, "1868 The Gilded Age", **6318 posts**, runs
> 1868→~1886, dies in GM burnout).** Batch 14 does **NOT change the top-of-queue** —
> it is **downstream era-content that lands AFTER the era model + the economic engine
> + the bill-relationship graph + Reconstruction.** `gild1868` is the richest single
> record of the Gilded-Age issue engine actually being PLAYED (tariff %, currency
> regime, civil-service, trusts, the 20-yr Reconstruction regime, AfAm
> enfranchisement, imperialism) — but **the Gilded Age is UNBUILT** (`Era =
> 'independence'|'federalism'|'nationalism'|'modern'` `types.ts:1337`, no `gilded`;
> only `scenario1772.ts`/`scenario1856.ts`; the era is hand-run on `modern` tuning,
> gap #41), so the thread is **almost entirely the unbuilt design.** The headline
> value is **(1) ONE NEW "gilded-era content" epic (EG)** — the five batch-14 deltas
> **#147–#150 + DH-63** are NOT five backlog rows; they are **ONE downstream era unit**
> gated on **K3/K4 (the era-content-band model) + #116/E4c (the economic engine) + #42
> (the bill-relationship graph) + #57/E3b (Reconstruction)** (§9.1.10, BINDING):
> **#147** tariff-as-%-rate (`game.tariffRate`) + the mutually-exclusive
> `MonetaryRegime = 'gold'|'bimetallic'|'freeSilver'|'nationalBank'` enum, replacing
> the ±0.5 flavor bill at `phaseRunners.ts:3421` (**M**, on #116/E4c + #42); **#149**
> civil-service merit-vs-spoils axis + State-Gov-Jobs spoils lever + era-gated reform
> content (**S–M**, on K3/K4); **#150** the "1872 Rule" disorganized-loser special-
> election branch (**S**, niche; pairs with #57/#148 + #48); **DH-63** currency-regime
> exclusivity **FOLDS INTO #42 + #147's MonetaryRegime** (the mutual-exclusion
> constraint those two already build — **XS–S, no standalone row**); **(2) #148
> EXTENDS the existing #57/E3b Reconstruction epic** (it does NOT open a new epic): the
> 20-yr auto-expiring Reconstruction timer (`game.reconstruction={startYear,endsYear}`,
> begins 1864, auto-ends ~1884 "to prevent a one-party state") + seceded-state seats
> APPOINTED by Speaker-faction (Reps) / PPT-faction (Senators) / majority-party Pres
> (military Govs) + a +2-RED bias-while-active that SUNSETS to a Blue Solid South at
> expiry (FL/GA/LA Blue+3→+5, VA Blue+2→+5, POST 5145) + per-state early end by
> repeal-bill — **S–M within E3b, inherits the DH-29 solo-blocker** (Strict/Ironclad
> never passes with CPU → resolve before any antebellum/CW/Reconstruction scenario,
> incl. a Gilded boot that turns the timer on, ships solo); **(3) #41 STRENGTHENED —
> `gild1868` is now its FULL NATIVE SPEC** for the dedicated `gilded` era +
> `scenario1868`: the red/blue-FLIPPED faction roster (**RED = Republicans**, **BLUE =
> Democrats** by 1868 — the OPPOSITE of the founding-era frame, `gild1868` POST 6 — so
> the era-content-band model must carry party-label-by-era), the Gilded nickname table
> (Stalwart/Half-Breed/Mugwump/Bourbon/Readjuster…), the era-event spine (Philippines-
> from-Spain, women's-suffrage A/B, census EV deltas, Labor Unions/RJ Reynolds/Twain/
> Nast/steamships), the bill catalog (tariff-rate/currency-regime/civil-service/ICC/
> statehood), the SCOTUS docket (Elk v Wilkins, Allgeyer v Louisiana), and the 20-yr
> Reconstruction timer — **`scenario1868` is "another scenario-as-data-row" once the
> BootSheet pipeline + content-band era model land, AFTER `scenario1788` (E1) + a
> mature `advanceEra`** (strengthen the existing E22/#41 home — do NOT build a bespoke
> Gilded code path; it is K4 content); **(4) CORROBORATIONS from a native start (no new
> rows)** — `gild1868 (b14)` tags appended to **#13** (convention delegate-
> apportionment), **#14** (5-plank platform incl. a Presidential-Action plank), **#15**
> (9-item VP rubric), **#52** (named-Justice SCOTUS docket + 10-yr drift + court-size
> bill), **#39** (amendment lifecycle), **#21** (extensible state-flag registry),
> **#42** (spending cap), **#3/#5/#6** (the Gilded content cluster); **(5) the 3rd
> GM-BURNOUT DEATH** (`gild1868`, after `new1772`/`dem1820`) — the spreadsheet
> legislative phase is the hardest to run by hand (POST 868) — **reinforces the
> automation-reduces-upkeep argument** behind the CPU suite (K5/E9) + #19/#20; **cite
> it in the justification, NOT a row.** **NO new keystone, NO re-sequence, NO new
> author-before-build or decision-gated items. The TOP OF THE QUEUE is UNCHANGED: QW0
> (cap=4 + alt-state guard, ship FIRST) → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` →
> `scenario1788` (E1). The gilded-content epic (EG) is downstream — it consumes
> K3/K4 + #116/E4c + #42 + #57/E3b.**
>
> **★★★ Batch-13 version — E9 DE-RISK (NOT a re-sequence). The SECOND all-CPU run +
> the FIRST deliberate CPU-ruleset interrogation: `oopscpu` (`699113d6`, "Oops, All
> CPUs", Ted-run all-CPU 1788 stress-test, 350 posts).** Batch 13 does **NOT change
> the K5/E9 build ORDER — it DE-RISKS E9** by field-validating the handler specs
> before they're built. Ted ran every faction on the CPU rules and stopped, live, at
> each spot the rules are vague/contradictory/impossible-without-human-judgment. The
> headline value is **(1) SIX E9 HANDLERS GO FROM "DESIGNED" TO "DESIGNED +
> FIELD-VALIDATED"** — handlers **#70 (9c leadership) / #72 (9a candidate + 9m VP) /
> #73 (9d cabinet) / #74 (9b legislation) / #75 (9g event) / #76 (9f conversion)**
> are now spec-complete with concrete failure modes + Ted's fixes (a build-confidence
> bump, NOT new rows); **9e (convention, #71) is the ONE handler NOT validated** (1788
> predates conventions → stays `drums`-spec-only, lower confidence; needs a post-12A
> all-CPU run to validate); **(2) the OC-1…OC-8 sub-gaps FOLD INTO the existing
> handler rows as sub-rules** — **★ OC-3 → handler 9b (legislation): the
> HIGHEST-PRIORITY, BALANCE-CRITICAL sub-rule** (an ideology-floor gate + a
> secession/slavery-active check so CPUs don't AYE crisis bills that betray their own
> ideology cards — the all-CPU run abolished slavery peacefully by 1792 with no
> secession); **OC-2 → handler 9c (leadership)** (ONE canonical
> `chamberControl(snap, chamber)` helper shared by leadership-select + the
> ≥60%-chamber proposer gate — fixes the minority-chairs-propose collision bug);
> **OC-1 + OC-5 → handler 9d (cabinet)** (scandal-resignee re-appointment cooldown
> [OC-1, ties DH-22 / handler 9l] + court-as-firing-precedent gate [OC-5]); **OC-6 →
> the kingmaker handler** (highest Com+Leg+Gov tiebreak for kingmaker→protégé
> pairing); **#72 sharpen on 9a/9m** (VP-retention HARD rule + the pre-12A nomination
> trio); **(3) #143 post-election Command decay (XS, RULED)** — 40% / −1 Command for
> non-Pres/VP candidates per presidential cycle, binds at `runPhase_2_10_End`
> (`phaseRunners.ts:4171`) gated on `isPresidentialYear` → joins the QW0 / XS
> consistency quick-win cluster as **QW17**; **(4) #61 death-branch RE-SCOPES E10b
> further (S)** — VP-inherits-on-DEATH = FULL President (refuses "Acting", no
> action-divert roll), NOT auto party/faction leader → re-run the leadership IRV;
> the "acting"/action-divert read is retained ONLY for the incapacity branch
> (Ted-RULED `oopscpu#POST 324-329`, SUPERSEDES the batch-11 `arkzag` read for the
> death case); **(5) DH-61 (S) + DH-62 (M) are `scenario1788` (E1) PREREQUISITES —
> NEITHER is optional for a 1788 boot:** **DH-61** = scenario-boot must seed
> era-active wars (they forgot the 1788 Northwest Indian War) → a
> `BootSheet.activeWars` field + a boot hook (folds into K4 / the `scenarioBoot`
> pipeline); **DH-62** = the pre-12A two-vote/no-ticket Electoral-College mode +
> same-state-EV exclusion → an era-keyed election-mode variant in the per-state-EC
> epic (E4); both wire as explicit deps on the E1 row; **(6) NEW designer-gated
> items → 11:** **OC-4** (off-ideology CPU draft gate — Ted wants "a better third
> way") + **OC-8** (define "office" + rewrite the Scandalous-Non-Office-Holder
> event) join the **designer-gated** sub-bucket (was 9 after batch 12 → now 11; OC-4
> and OC-8 are OPEN, NOT ready-to-build until Ted/vcczar closes them); **(7) the
> ALL-CPU-TEST is now a recommended REPEATABLE SPEC-VALIDATION METHODOLOGY** — it
> validated 6 handlers BEFORE they're built and is immune to GM-burnout (DH-36);
> **recommend a post-12A all-CPU run before building the convention handler #71 / 9e**
> (a methodology note, NOT a build row); **(8) corroborations** (no new rows): #70–#78
> field-validated from a founding angle; **#52 resolved for the all-CPU case** (CPU
> SCOTUS by ideology-distance — player-vs-CPU stays user-gated); **#76 4th-thread
> ideology-circle confirmation** (LW↔RW-Pop 25% cross-step); **#144 (pre-12A
> nomination trio) / #145 (OC-7 help-allies gov term-config) / #146 (procedural
> rulings)** slot into their topical homes. **NO new keystone, NO re-sequence. The TOP
> OF THE QUEUE is UNCHANGED: QW0 (cap=4 + alt-state guard, ship FIRST) → K0/K2 →
> K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) — but E1 now carries the
> DH-61 + DH-62 prerequisites, and #143 joins the XS quick-win cluster as QW17.**
>
> **★★★★★ Batch-12 version — DESIGNER-RULINGS INTEGRATION + QW0 FULLY CLOSES + ONE
> M-rework + 19 sized rulings slotted (NO re-sequence, NO new keystone, NO keystone
> moves). The FIRST DISCUSSION-THREAD INGEST in the corpus — two distinct discussion
> threads, not playtests: `smallbugs` (`cf82a7d3`, the community-curated 3-yr+ rolling
> bug + ruling catalog, 804 posts) + `tedchange` (`a0f0bf04`, Ted's official rules-doc
> rewrite/cleanup channel, 408 posts — the HIGHEST-AUTHORITY rules source in the
> corpus).** Batch 12 is **NOT a playtest**; it is the **DESIGNER's official rules-doc
> patches** (Ted in `tedchange`, vcczar in `smallbugs`'s nested rulings), so most
> findings **SUPERSEDE prior GA calls where they conflict** (authority hierarchy is
> now explicit: **Ted/vcczar > GA > inference**, game-mechanics §30.4). The headline
> value is **(1) QW0 FULLY CLOSES** (the relocation cap is now ruled `4` + alt-state
> exemption, `smallbugs#POST 734-735` vcczar-12-30-25, → **QW0 promoted from "open-
> design / build" to "ready-to-ship FIRST"**); **(2) ONE M-sized re-architecture lands
> as a TEARDOWN of E16** (#124 cabinet→enthusiasm rework: lobby satisfaction now
> writes POINTS to `Faction.score`, ideology composition drives enthusiasm via the
> ±3-cap clamp — **re-scope E16 to BUILD confirmation + #124 rework TOGETHER from day
> one, sized M (was XS-S); numeric percentages stay designer-gated**); **(3) 19 sized
> Ted-rulings slot into existing epics** — **12 XS** (#135 50/50 House inverse-control
> one-liner at `phaseRunners.ts:1864`, #136 no-Command in random-skill draft, #137 no
> cross-party draft `partyId` gate, #138 3 traits + 3 alt-states, #139 Pres signature
> step in 2.6, #141 FL trait gain 5%+/3%-, #142 CPU CJ ladder, #131 Integrity-can't-
> nominate-Controversial, #132 Challenge-Legislation-can't-target-REPEAL), **5 S**
> (#126 Pres 2-step Admin-then-Command blunder rule → E29; #127 ideology-shift /
> conversion schedule → E5b; #128 Kingmaker / Master Kingmaker scope → E20; #129
> Kingmaker→Protégé trait allowlist → E21 / Phase-1 #21; #130 death/retirement
> schedule + Hale + Frail-first → Phase-1 #19; #133 1st/2nd CC composition rewrite →
> E17; #140 AnytimeEvo target-pool tightening → Phase-1 #19 / E9 handler 9g), and
> **3 M** (#124 cabinet enthusiasm rework → E16; #134 Lingering 7-step strict
> ordering + tax/tariff carry-forward → Phase-1 #6 / E6; #120 `smallbugs` dataset
> umbrella → ONE coordinated `scripts/seedDataset.mjs` `CURATED_ROWS` pass, ~100
> items, also covers DH-43/DH-51/DH-28); **(4) BUILD-TARGET SIMPLIFICATION on E5/E25
> — Amendments NOT SCOTUS-challengeable** (`smallbugs#POST 250-269` vcczar OVERRIDES
> `tea1772` #100): **drop the SCOTUS-overturns-amendment branch from both E5 and E25
> scope** (keep E5's strike-a-statute + mutable-threshold; keep E25's docket + Justice
> drift + DH-32 state-guard); **(5) NEW Decision-gated SUB-BUCKET: designer-gated**
> (the existing user-gated bucket holds the human-design picks; the NEW designer-gated
> bucket holds the **9 open `tedchange` items** waiting on Ted/vcczar to close —
> Mil-Prep meter level 4 fix, **#125 Universal Election Modifier UEM**, Crisis trait
> consolidation, term-limit Gov actions in pre-Senate era, faithless-elector
> rewording, party rename trigger PL-vs-EraEvo, VP-must-be-same-party-on-resignation
> relaxation, cabinet enthusiasm percentages (the #124 numeric), cabinet ideology
> weighting Big-4-vs-rest-vs-cabinet-level); **(6) STRENGTHENINGS** (no new rows):
> **#76 CPU conversion adjacency** EXTENDED via `tedchange` (same-party can target
> same OR ADJACENT ideology); **#99 ideology=circle** now **TED-AUTHORITATIVE** (the
> 3-thread corroboration → designer-ruled; 25% LW↔RW rate pinned; auto-Two-Faced
> grant); **#67 Lingering bank ordering** = the strict 7-step + carry-forward NOW
> RULED → #134; **#100 Gov-requested SCOTUS review of amendments** OVERRIDDEN — mark
> superseded in the build-target; **(7) NEW gaps:** **#121** Secessionist trait
> missing from politicians dataset (XS — dataset + a one-row `Trait` union addition,
> folds into the #120 umbrella + the secession trigger #58); **#122** pardon mechanics
> entirely unspecified → **designer-gated open** (parking lot); **#123** small late-
> modern content bundle (Wyoming Rule → Real House Act 585-cap, runoff-amendment,
> Senate-Abolish-amendment) → folds into the modern-content row / Phase-2 #28 / #30.
> **The TOP OF THE QUEUE is now: QW0 (constant=4 + alt-state guard, ship FIRST) →
> K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788` (E1) …**
>
> **Batch-11 version — LATE-GAME-SYSTEM PLACEMENTS + one fork RESOLVED (NO
> re-sequence, NO new keystone, NO keystone moves). The first FULL-ARC 1820→1840
> continuation (`arkzag`, "Ark and Zags — The Era of Democracy", 152c2881, 2531
> posts) — the direct continuation of batch-10's `dem1820` 1820 save, run all the way
> to 1840.** Batch 11 is the thread that finally **exercised the LATE-GAME systems
> batch 10 never reached** (multi-cycle presidential elections, the Bank-War economic
> arc, amendment machinery, presidential assassination+succession) — so it is
> **placement + one fork-resolution, not a re-sequence**: (1) **★ #116 economic engine
> → NEW small epic `E4c`** (the Jacksonian Bank-War → Independent-Treasury long-run
> content **state machine**), placed **AFTER E2 + E6 + E4b(b)** — it sits on top of
> E4b(b)'s §27.6 Second-Bank institution (the Bank it recharters/replaces), needs E2's
> `Bill.type`/crisis-bypass, and needs E6's named EconStab meter + crisis/cascade.
> Build it **EMERGENT, not scripted** — recurring CRISIS bills resolving an EconStab
> CRISIS via a `Bill.replaces` field + a per-bill-class `lockedUntilYear` tariff
> cooldown (carry "scripted-vs-emergent" as a design note, not a blocker). Verified
> UNBUILT: `applyEffect` (`phaseRunners.ts:3209`) only nudges 7 meters; `Legislation`
> (`types.ts:1506`) has no `type`/`replaces`/`lockedUntilYear`. (2) **★ #119 amendment
> lifecycle → RE-SCOPES existing E5** (NOT a new epic): adds the explicit lifecycle
> state (propose→committee→floor→**governor-ratify**→active), the **active-amendment-
> blocks-a-legislation-class** hook (the proactive face of E5's existing *Pollock*
> gate), and the **un-bundleable** flag. Verified UNBUILT: no `amendments` field in
> `GameState`. (3) **★ #61 succession chain → RE-SCOPES existing E10b** (NOT a new
> epic): adds VP-succeeds-on-death → fill-VP (gated on E5's VP-vacancy amendment being
> `active`) → acting-president action-divert roll + trait-acquisition side-effect.
> NOTE the **kill trigger already SHIPS** (`assassination-killed` anytime event
> `anytimeEvents.ts:232` fires `{kind:'death'}`; death sets `presidentId=null` via
> `vacateOffice` `phaseRunners.ts:2449`) — the **succession ENGINE is the work**; the
> **line-of-succession/impeachment half stays parking-lot (DH-54)**. (4) **★ #51
> PROMOTED — now SETTLED** (the `arkzag` final chunk published the `drums` **4-step
> enthusiasm-reshuffle** verbatim, MATCHING `drums`, NOT Ted's "every state" nor
> Matt's "primaries-only"): the **4-step reshuffle + −100/waiver rule → E23, now
> `ready`**; the **±3 cap is UNCONDITIONALLY ready** (binds at `calcStateVote`
> `:3709-3711`, ships with E6). **Only the #18 state-scope sub-question stays a human
> decision-gate** — #51's "fork" entry LEAVES Decision-gated; **only #18 remains
> there.** (5) **★ NEW delegate-class fork → Decision-gated** (AI-allocator-by-EV-
> formula vs player-rigged): a human pick **before E10's delegate-apportionment
> sub-PR** (+ E24's primary apportionment), but does NOT block the rest of E10. (6)
> **Bugs:** **DH-59 (XS)** folds into **E12** when the 9-point relations scale is
> built (no standalone patch; today it clamps −5..5 at `applyEffect:3223`); **DH-60
> (S)** = the concrete face of #92 territory-gating → a **`requires?: Predicate` on the
> era-event row + a firing-path filter** = the **same surface as BUG-1 + K3's
> `territoryOwned`**, so **build with E15 + BUG-1** (`buildEraEventsForYear`
> `eraEvents1856.ts:4` gates only by year; `EraEvent` `types.ts:1466` has no
> precondition field). (7) **#115 scenario-boot priority UNCHANGED** (re-confirmed by
> the continuation-boot; stays at the front of the subsystem queue, §9.1.9). (8) **★★
> Meta-signal FLIPS POSITIVE:** no GA-burnout this time (heavy GA scripting absorbed
> the upkeep) — now a **3-thread signal** (2 burnout deaths + 1 survived-by-scripting)
> that STRENGTHENS the automation-reduces-upkeep argument behind E9/#55/#115. Cite it
> in the justification; NOT a row. **Corroborations** (multi-campaign tags, not new
> rows): #11 crisis scoring, #13 convention machinery, #44 elector method, #92 era/
> territory content-gating, #111 convention machinery, #52 SCOTUS docket. **Order is
> UNCHANGED: build top-to-bottom. The top of the queue is QW0 → K0/K2 → K3/K4 +
> `scenarioBoot`/`BootSheet` → `scenario1788` (E1) …**
>
> **Batch-10 version — SCENARIO-BOOT PROMOTION + decision-gating + small placements
> (NO re-sequence, NO new keystone). The first 1820-START gap-fill (`dem1820`,
> "1820 — The Era of Democracy", 947 posts, GA-burnout-killed at ~1822-23).**
> Batch 10 absorbed `dem1820` — a **NEW 1820 scenario start** (Monroe's 2nd term /
> late Era-of-Good-Feelings → Jacksonian "Era of Democracy"), 10-human MP with the
> **1788/1800 polarity** (BLUE = Dem-Republicans, RED = Federalists/National-
> Republicans, NOT the 1856 flip). It is a **short, corroboration-rich** thread
> (one new gap, #115) whose headline value is **PROMOTING the scenario-boot pipeline
> to the front of the subsystem queue** + **decision-gating two forks the build
> cannot pick on its own:** (1) **★ #115 scenario-boot PROMOTED to the front of the
> subsystem queue — but it is NOT a new keystone; it FOLDS into K4's `BootSheet`
> schema.** The single most build-relevant finding is that **there are NO documented
> rules for CREATING a game** — GA setup is improvised (a contested undocumented
> "strip Command from ≤40 boot pols w/o a job" house rule; the inaugural career-track
> seed from the **last-3 draft classes**; era-keyed industry init; Senate-class
> assignment; vacant-seat appointment-fill). The build's **shared
> `scenarioBoot(BootSheet)` pipeline** must canonicalize this. **Dependency order:
> K0 (seed boot rolls) → `scenarioBoot` + `BootSheet` (built WITH K4) → every
> scenario becomes a data row** — and it must be built **WITH the first new scenario
> (Phase-1 #1 / `scenario1788`), before the third hand-authored copy-paste** of a
> scenario. It is also the venue for the **XS boot validators** (QW8 DH-24
> Senate-class, QW9 DH-27 trait-conflict) + the **appointment-ladder** (#115b). (2)
> **★ TWO forks are DECISION-GATED — NOT ready-to-build** (each has 3 live models;
> a human must pick first — recorded under "Decision-gated" in the parking lot):
> **#52 player-controlled SCOTUS** (all-CPU-by-ideology vs player-controllable-with-
> restrictions vs trait-gated — but the **SCOTUS docket data structure is needed
> EITHER way**, → E25) and **#18/#51 meter→enthusiasm→election** (every-state-unless-
> penalized vs ideology-leaning-states-only vs primaries-only — the **settled part
> is meters move enthusiasm boxes + a hard ±3 cap; that ±3 cap is a queued XS clamp
> [QW3] whose binding-point + state-scope wait on this pick**). (3) **Sized
> corroborated fixes slotted into existing epics:** **DH-53 bill-EV-sign → S
> (author STRUCTURED bill-effect tables, NOT a sign-flip), pairs with E20 + K4**;
> **DH-24 Senate-class validator → XS into the boot pipeline (QW8)**; **focus-Rep
> (EV−2)/5 House (#55) → M into scaling-wall-(b) (E7) + the census epic (E28)**;
> **statehood→sectional-crisis (#59) → S additive at `admitState`, folds into E3b's
> sectional-crisis sub-PR (fires from 1820/Nationalism starts too)**; **appointment-
> ladder + replacement-gains timing (#115b) → XS each into the boot/appointment
> rules; the ladder pairs with DH-25 (parking lot)**. (4) **★ #92 era-band model is
> now 4-START-CONFIRMED** (1772 + 1800 + 1820 + 1948 — `dem1820`'s own draft table
> prints "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)") — a
> confidence bump on K3/K4, NOT new scope. (5) **★★ DH-36 is now the 2nd GA-burnout
> DEATH in the KB** (after `new1772`) — `dem1820`'s GA quit over **player friction
> from undocumented/inconsistent rules COMPOUNDED by manual upkeep**. This is **NOT
> a roadmap row** — it is the **prioritization ARGUMENT** for the upkeep-reducing
> items (#115 boot pipeline, #55 focus-Rep, E7 House-slate persistence, K5/E9 CPU
> suite): "automation reduces the manual-upkeep burden that's killing playtests" is
> now corroborated across **2 dead threads**. Reflect it in how the ordering is
> justified, not as a new item. **Order is UNCHANGED: build top-to-bottom. The top
> of the queue is QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` → `scenario1788`
> …**
>
> **Batch-9 version — CONFIDENCE + NEGATIVE-SCOPE + small placements (NO
> re-sequence, NO new keystone). The Nuclear-Age / Cold-War / modern-half gap-fill
> (`nuke`, the largest corpus in the KB — 12,228 posts).**
> Batch 9 absorbed `nuke` — a 1948-start "Nuclear Age 1948→Era-of-Terror ~2005"
> campaign, the **chronological predecessor of the already-documented `modern`
> 2004-2020 thread** (joined at the 2004 election). **The KB now spans a CONTINUOUS
> 1772→2020 timeline.** Despite the "Nuclear Age" title this is **mostly confidence
> + scope-control, not new scope**: it (1) **bumps K3/K4 again — the era model is
> now confirmed across a THIRD start year (1948)** and gains a **TWO-LEVEL
> refinement** (point-banked Historical Eras carrying **rule-deltas** — the
> Era-of-Terror cabinet rework proves bands change rules, not just content — AND a
> **separate per-decade census** doing bulk EV-realloc + state-bias re-lean +
> content-rotation; **do NOT collapse the two**) **+ a STRUCTURED-era-event-data
> requirement** (DH-48 — the Neocon census/EV events were LOST as free-text; typed
> `evDelta`/census fields + per-era completeness validation, in K4); (2) records the
> **★★ single most important scope-control finding in the batch — there is NO
> Cold-War subsystem to build** (verified: only `revolutionaryWar.ts` exists; no
> nuclear/MAD/NATO/space-race/military-branch engine). The Cold War is the **generic
> war engine (E3) RELABELED + the diplomacy subsystem (E12) + content (data)**; the
> REAL items underneath are **ONE generic war engine that must RESOLVE** (DH-47 —
> wars never end today; Korea ran ~2 decades; ideally army/navy/air branches) **+
> the diplomacy subsystem** (8 relation meters + ambassador actions; DH-46 add
> downward pressure; DH-45 fix the USSR-collapse trigger); (3) **★ elevates K5 +
> the CPU handler suite (E9) to a first-class LOAD-BEARING Phase-1 system** — the
> app is **1-human-vs-9-CPU** (#114; multiplayer "goes off the rails"), so the
> ENTIRE multiplayer apparatus must be CPU-AI-driven; K5 **stays after K0+K2 (no
> re-sequence)** but is no longer "optional/late"; (4) **strengthens E16** (mutable
> cabinet → **create-AND-abolish** seats: DOE/DHS created, **Postmaster General
> ABOLISHED**, HEW split — `Legislation.abolishesCabinetSeat?`); (5) records the
> **Senate pass-threshold RESOLVED + DESIGN CHOSEN**: code today is simple majority
> (`phaseRunners.ts:3562`, `yea > nay` both chambers, no cloture); human picked the
> **real-Senate model — 60% cloture, then simple-majority floor vote** (lands in
> E14c, `CLOTURE_THRESHOLD = 0.6`); (6) **adds TWO parking-lot items → 12** — a
> **population model + House cap** (DH-49, the one genuinely-new infra item; the
> Wyoming Rule + per-decade census are un-implementable without it) and an
> **impeachment / VP-vacancy / succession ruleset** (DH-54 — never in the rules doc
> across 3 campaigns); and (7) folds the rest (legislated-variable-SCOTUS-size →
> E25; `scenario1948` as a 4th `BootSheet` boot shape → E30; DH-45..DH-58 classified
> into their epics; #105/#108/#109/#112/#113 placed). **Order is UNCHANGED: build
> top-to-bottom. The top of the queue is still QW0 → K0/K2 → K3/K4 …**
>
> **Batch-8 version — CONFIDENCE-HARDENING pass (NO re-sequence). The two 1772
> threads + the multi-save era-model proof.**
> Batch 8 is **not a re-sequence**: the tech-lead confirmed no new keystones and
> no structural change. It (1) bumps **K3/K4 (the era model) to HIGHEST
> confidence** — now **MULTI-SAVE PROVEN** (two independent saves, 1772-start +
> 1800-start, 28 in-game years apart, emit identical era-bands at identical dates;
> game-context #102 / `tea1772` + `rep1800`); (2) **strengthens E16's
> justification** (`cabinetSeatsForYear` is now confirmed the WRONG model at BOTH
> ends of the timeline — founding offices-by-law + modern bill-creates-a-seat);
> (3) **adds ONE author-before-build parking-lot item** (DH-41, the general
> SCOTUS-ruling → downstream-statute cascade — UNBUILT, `vcczar`-deferred → 10
> total); (4) **folds the new small mechanics #100/#103/#104/#105 + DH-38/39/40/42/
> 43/44 into existing epics**; (5) records a **★ NEGATIVE RESULT** — no thread
> reaches a "future" era, so the roadmap does **NOT** scope one; and (6) cites
> **DH-36 (GM-burnout abandoned a 12-turn game)** as the META justification for the
> whole build. The two 1772 threads — **`new1772`** (the first MULTIPLAYER 1772
> founding campaign, abandoned at GM burnout) + **`tea1772`** (a solo all-CPU
> 1772→1874 fast-traversal that stalls mid-Gilded) — are the batch-8 sources.
> Order is **unchanged**: build top-to-bottom. The top of the queue is still
> **QW0 → K0/K2 → K3/K4 …**.
>
> **Batch-7 version — re-sequenced for the "Era of Republicanism 1800-1868"
> early-republic gap-fill.**
> This roadmap was stood up from the codebase + tech-lead bootstrap (6 items),
> rebuilt against batch 1 (`f4c7c2c4`, 1868 Gilded-Age → 14 items), re-sequenced
> into **two parallel tracks** for batch 2 (`f55d3e21` 1788 federalism + `85f8e6b4`
> 1772 aesthetic), re-sequenced into **three engine phases** for batch 3
> (`3a9ac985`, the 2276-post modern campaign), re-sequenced for batch 4 to absorb
> `77db6e6f` (the **9051-post 1856-native "A House Divided" Part 2** — the only
> source for the Civil-War / Reconstruction / secession machinery),
> re-sequenced for batch 5 to absorb `e1776bbd` — the **7540-post all-CPU
> 1841→1924 "Drums of War"** playtest (the first explicit forum record of CPU
> heuristics, thresholds, tie-breaks, and formulas) — re-sequenced for batch 6
> to absorb `c50d9da7` (a **1172-post, multiplayer "Era of Populism" 2012
> fresh-modern boot**) — and is now **re-sequenced for batch 7**, which absorbed
> `rep1800` — the **"Era of Republicanism" 1800→1868 campaign**, the first
> procedural record of the 1800–1856 early republic (Jeffersonian →
> Era-of-Good-Feelings → Jacksonian → Manifest-Destiny → Nationalism), the
> **predecessor of batch-1's `gilded`** — so **the 1800 campaign is now
> documented end-to-end**. Order within each track is binding from
> `technical-guide.md` §9.6 + **§9.1.5 / §9.1.6 / §9.1.7** + §6.6.1 — **build
> top-to-bottom.**
>
> **What changed vs. the batch-7 roadmap** (all from §9 batch-8 lead +
> §9.1.5's batch-8 confidence bump + the divergence-row updates, binding —
> **CONFIDENCE + small placements, NOT a re-sequence**):
> 1. **★ K3/K4 (the era model) → HIGHEST confidence: MULTI-SAVE PROVEN.** The
>    batch-7 reframe was inferred from a single 1800-start campaign (`rep1800`).
>    Batch 8 adds a fully *independent* save — `tea1772` (a 1772-start solo all-CPU
>    traversal, **28 in-game years earlier**) — that emits the **identical
>    era-band sequence** (Federalists → Republicanism → Democracy → Manifest-Destiny
>    → Nationalism) at the **same in-game dates**. Two saves, two start years, one
>    deterministic band sequence ⇒ the bands are **game-state content-gates, not
>    flavor**. **Nothing structural changes** — the K3/K4 spec was already
>    condition-driven from batch 7. This is a **priority/confidence raise only**:
>    the era keystones are now the **safest large bet in the roadmap**; treat the
>    content-band model as **settled**. **#102's dual era-scoring (per-era winner +
>    cumulative "winner so far") is the WIN-CONDITION scoreboard — it folds into
>    K3/K4's per-era point-banking (#68 banks the cumulative total); the win
>    condition is DUAL.** K3 + K4 rows + the Phase-0 preamble UPDATED (confidence,
>    not scope).
> 2. **★ E16 (dynamic cabinet-seat refactor / divergence #15) — justification
>    STRENGTHENED, no new work.** `cabinetSeatsForYear` (`types.ts:1196`) is now
>    confirmed the WRONG model at **BOTH ends of the timeline**: founding offices-
>    by-law (`new1772` — SCOTUS/Bank/Navy/AG/academies built by bills) AND modern
>    (`pop` — a Climate bill creates a cabinet seat). So the seat-list-as-mutable-
>    state refactor is **foundational to the offices-as-data theme, not a
>    modern-only nicety.** E16 row UPDATED (harder justification, same scope).
> 3. **★ DH-41 — ONE new author-before-build PARKING-LOT item (now 10 total).**
>    The general **SCOTUS-ruling → downstream-statute cascade** (a ruling that
>    *contradicts a law on the books* auto-voiding it) is **UNBUILT and was
>    explicitly DEFERRED by `vcczar`** (`tea1772` POST 124-126, Prigg→Fugitive-
>    Slave-Act). Today a contradicting ruling leaves the law operative. Distinct
>    from the *built* strike-a-single-law + the #100 overturn-an-amendment path.
>    **Author the cascade policy before building it; lands in the SCOTUS docket
>    (E25) once decided.**
> 4. **Small placements (fold into existing epics, no new rows):** #100
>    SCOTUS-overturns-a-ratified-Amendment + threshold-amendable → the amendments
>    item (E5) + SCOTUS docket (E25); #103 presidential-vote modifier stack +
>    era-stamped issue list → election-math / bill-scoring (E20); #104 lone-ideology
>    convention exploit → the convention CPU handler guard (E9 handler 9e); #105
>    stat-collapse → forced presidential resignation → succession (E10b).
> 5. **DH classification (place, don't necessarily schedule):** DH-38 (no
>    late-ratification / "Rogue Island" window) → E1 federalism/founding;
>    DH-39 (all-human Convention deadlock) → convention machinery (multiplayer);
>    DH-40 (SCOTUS-justice-count bill not auto-packaged → game STALLS) → an XS-S
>    bug-fix in the bill-packaging / SCOTUS-establish path (E14b / E25); DH-42
>    (national-meters swamp per-state lean → no close elections) → election-math
>    BALANCE (E4 / E20); DH-43 (Vermont has no home-state mapping) → an XS dataset
>    fix (**new QW11**); DH-44 (post-12A legislature-state vote count undecided) →
>    the 12A toggle (E4 / #93); DH-37 (no politician-to-politician trading) →
>    multiplayer / parking lot.
> 6. **★ NEGATIVE RESULT — do NOT scope an "Era of the Future."** No thread in the
>    corpus reaches a post-Gilded/post-modern era (`tea1772` "…to future" stalls at
>    1874 mid-Gilded; `hd`/`drums`/`pop` top out at Gilded/Progressive/Populism).
>    The future era is undocumented everywhere — **there is no build target. K4
>    adds EXACTLY `gilded` + `progressive`** (see the explicit guard at K4 + the
>    parking-lot note).
> 7. **META justification (cite, don't queue):** **DH-36 — GM burnout from manual
>    bookkeeping ABANDONED a 12-turn multiplayer 1772 game** (`new1772` POST 3607).
>    The **single strongest "why build AMPU at all" datum** in the corpus: the
>    computer must own the deterministic upkeep a human GM cannot sustain. It is
>    **not a row** — it is the motivation behind the whole build (esp. the scaling
>    walls E7/E8 + the CPU handler suite E9). Noted in the intro rationale below.
>
> **What changed vs. the batch-6 roadmap** (all from §9.6 + §9.1.5 + §9.1.6 +
> §9.1.7 + §9.3, binding):
> 1. **★ ERA-MODEL REFRAME re-specs K3 + K4 — NOT a new keystone (§9.1.5 /
>    divergence #18).** The biggest architectural reframe across all 7 batches.
>    K3's `advanceEra(snap, target)` becomes **`advanceEra(snap)`** — no `target`
>    arg; it watches an `era.advanceWhen(snap)` **game-state / meter / TERRITORY**
>    condition evaluated **per half-term** (the hard-coded `currentEra =
>    'federalism'` at `constitutionalConvention.ts:198` becomes the first such
>    condition). `year % 4` / `year % 2` stay as **phase CADENCE only**
>    (`phases.ts:49-59`, correct, keep). K4 gains the **per-era CONTENT-BAND
>    registry** `{bills, eraEvents, draftees, biasTable, advanceWhen}`; content
>    gates on `game.eraBand` + a **new `territoryOwned` predicate**, NOT the
>    calendar (un-owned-land bills/events/draftees are invalid — the mechanism
>    that *forces* `rep1800`'s ~30-yr content lag). The early sub-bands
>    (Republicanism / Democracy / Manifest-Destiny) are **content-band MARKERS,
>    not new enum values** (open Q; tech-lead's call: markers first). **RECONCILES
>    #68 point-banking + §26 BootSheet + §27.1 content-band finding into ONE era
>    system.** Both K3 + K4 stay **M**. K3 + K4 row descriptions UPDATED.
> 2. **★★ RECONSTRUCTION SOLO-BLOCKER (DH-29) = a hard DoD requirement on E3b
>    (§9.1.6).** GM-verified (`rep1800` POST 9170): the Strict/Ironclad-Oath
>    readmission plan can **NEVER pass with CPU factions** → solo Reconstruction
>    is UNWINNABLE, and AMPU is single-player. The 1856-arc epic's whole value is
>    *completing* the shipped 1856 scenario — so an unwinnable Reconstruction
>    means E3b ships an unwinnable scenario. **E3b's definition-of-done MUST
>    include a CPU-passable readmission path** — a CPU default-vote bias for the
>    flagged historical plan (via E9 handler #2 / a "historical-plan" flag
>    consulted *before* the §25.6 heuristic) **+** an era-boundary auto-resolution
>    backstop (via K3's condition-driven `advanceEra`). The readmission half of
>    E3b lands **after E9 handler #2** or carries the era-boundary auto-resolution
>    as its self-contained fallback. **Ties E3b to the CPU handler suite.** E3b
>    row UPDATED with the DoD requirement + the K5-handler-#2 dependency on the
>    readmission half.
> 3. **★ IDEOLOGY-AS-CIRCLE is FOUNDATIONAL — new Phase-1 #5b (§9.1.7 /
>    divergence #19).** `IDEOLOGY_ORDER` (`types.ts:14`) is LINEAR and distance is
>    **open-coded at 10+ sites** (`factionCenter` `phaseRunners.ts:715`,
>    `stepToward` `:740`, conversion adjacency `:993-1003`, sponsor `:3548`, a
>    private `firstContinentalCongress.ts:120` helper, + 3 UI pages) — **no
>    central helper exists**. Add a central `ideologyDistance(a, b, circular)`
>    helper + **migrate the 10+ sites to it** (behavior-preserving while the flag
>    is off) + gate the wrap on `GameState.ideologyIsCircular?`. **Place EARLY
>    (Phase-1 #5b)** — cheap/additive while off, and every later ideology consumer
>    (the conversion handler 9f, the SCOTUS within-1-step auto-AYE §26.6) calls it
>    from day one rather than open-coding distance an 11th/12th time. NEW row.
>    Not a keystone; M total (XS-S helper + migration; M for the flag +
>    conversion-adjacency).
> 4. **New early-republic subsystems fold into Phase-1 #4/#4b + the federalism
>    epic E1 (§9.6 note).** 12A legislature-elector toggle (#93 — a NEW
>    legislature-majority resolution branch; `senatePre17` does NOT model this;
>    extends the per-state EC #5/E4); slavery-flag + Cohens (#94 — **SMALLER than
>    assumed: `State.isSlaveState` ALREADY EXISTS at `types.ts:1329`**, so just
>    the abolition-toggle-off + the persistent `Cohens` SCOTUS rule-modifier);
>    Second Bank recharter clock + Bank War exec-action (#95 — ties K2 + the
>    dynamic seat list #89); statehood-by-bill ORGANIZE→ADMIT two-step +
>    unorganized-territory draft-gate (#95 — uses the SAME `territoryOwned`
>    predicate as the era reframe). E1 + E21 rows UPDATED; new E4b row.
> 5. **Design holes classified.** Era-events-predating-start is **MERGED into
>    BUG-1** (QW1 — `rep1800` LIVE-confirms it via the LA-Purchase-dropped-at-1800-
>    start episode, a 2nd same-class instance); **DH-30 event-scheduler-min-floor
>    added as a quick-win (QW10)** — its companion on the same scheduling surface
>    (min = 20% of the era's max, round down; spill to the 5 generic anytime
>    events). **DH-31** procedure-bill veto-misroute → fixed in the bill-typing
>    epic (E2 / divergence #21). **DH-32** SCOTUS-voids-a-STATE → a one-rule guard
>    in the SCOTUS docket (E25). **DH-33** impeachment-rules-broken → parking lot
>    (author-before-build, folds into E29). **DH-34** static-era-biases → a roadmap
>    DECISION (tech-lead's call: **ship static**, the forum's own stance). **DH-35**
>    thin-early-era agency → era-gate the action libraries (E11/E13/E24).
> 6. **`scenario1800`** = an optional later `BootSheet` instance (Phase 2, low
>    priority — `scenario1788` + `scenario1856` already cover the
>    federalism→nationalism band). Noted at E30/E31.
>
> **Carried from the batch-6 roadmap** (all from §9.6 + §9.1.4 + §9.3, binding):
> 1. **K4's `BootSheet` schema is THE cross-cutting batch-6 build constraint.**
>    Three documented mid-government boots — 1788 (designed) / 1856 (shipped) /
>    2012 (designed in `pop`) — share ONE shape: pre-built faction roster
>    (5 Blue + 5 Red) + per-faction archetype politicians + era-tuned
>    ideology/interest/lobby decks + sitting government keyed to start year +
>    **state roster keyed to `{era, startYear}`, NOT era alone** (divergence #17
>    — same `modern` enum has BOTH the 50+DC fresh-boot roster AND the 53-state
>    Wyoming-Rule continuation roster) + EXPLICITLY EMPTY at boot (no faction
>    leaders, no career-track pols, no inherited PV/legacy/Kingmaker pairs).
>    **Build the schema ONCE in K4**, instantiate per era. Era identity is
>    **data configuration**, not a code path. Plus **Senate-class verifier
>    (DH-24)** + **`TRAIT_CONFLICTS` validator (DH-27)** at the boot pipeline
>    (the two new XS validators below).
> 2. **APOCALYPSE meter-driven endgame folds into Phase-1 #6 (meter-model
>    generalization), sized M.** Verified shipped: only event-driven endgame
>    exists (`EraEvent.triggersGameEnd` → `phaseRunners.ts:2871` →
>    `game.gameEnded`); no meter-watcher, no countdown clock anywhere. The
>    forum adds a NEW model (`pop` POST 542, 548): bottom-tier band entry →
>    10-game-year countdown → mandatory game-end (recovery clears it). The
>    `planet` meter ships and ticks every era; the `game.gameEnded` sink is
>    shared with the event-driven path — both close cleanly through the same
>    sink. Folds into Phase-1 #6 (same code area `runPhase_2_5_1_Lingering`,
>    same termination sink). New `GameState.endgameClocks: { meter; threshold;
>    remainingYears; startedYear }[]` field + arm/decrement/terminate path.
>    **NOT Phase-2** — the model is meter-agnostic; the Populism Planet Health
>    clock is one configured row in a per-era table.
> 3. **K2 gains `requires?: AmendmentPredicate` from day one** (divergence
>    #16). One extra field on the `GameAction<Ctx>` shape + one filter step in
>    the picker reading `game.amendments.passed`. Cheap if early, expensive if
>    retrofit across 6 libraries. Canonical instance: the general-election
>    action "Send VP to Shore Up Support" requires the 12th Amendment. Same
>    `requires:` mechanism gates bill catalog entries (income-tax category) +
>    gov action rows — predicate field belongs at the registry-row level.
> 4. **E16 cabinet refactor absorbs the dynamic seat list** (divergence #15).
>    Verified: `cabinetSeatsForYear` (`types.ts:1196`) is pure derived with NO
>    mutable state today; `phaseRunners.ts:2162` recomputes it each turn.
>    Refactor: shipped function becomes the **boot seed only**; runners read
>    `GameState.cabinetSeats: SeatSpec[]`; bill-sign handler appends
>    `Legislation.createsCabinetSeat?: SeatSpec`. Folds into E16 (same code
>    area as cabinet retention, marginal additional cost). Pairs with #66
>    (Progressive institutional layer).
> 5. **Modern era epic SPLITS into TWO scenarios** (Phase 2). `scenario1948`
>    continuation (the 60-yr `modern` digest play-through that produces the
>    53-state Wyoming-Rule roster) AND `scenario2012` fresh-modern boot (the
>    canonical `BootSheet` instantiation — 10 pre-built faction decks
>    [R1=Trumpism, B1=Bernie-populism, etc.] + Obama/Biden + 9-named SCOTUS +
>    50+DC roster, EXPLICITLY EMPTY at boot). Both depend on K4's `BootSheet`
>    schema + DH-25 (career-track bootstrap) resolved. State roster fork:
>    `scenario1948` → 53-state Wyoming + 2-home-state pols; `scenario2012` →
>    50+DC.
> 6. **CPU handler #2 (legislation) and handler #4 (cabinet) consume the
>    conditional-vote-rules primitive** (`pop` POST 1111). Iron-Fist
>    controllers publish declarative `Predicate → {AYE/NAY}` policies stored
>    at `Faction.factionLeader.compelledVoteRule?`. Handler #2 consults this
>    BEFORE the §25.6 NAY/AYE heuristic; handler #4 consumes the same primitive
>    for auto-AYE-own-picks AND SCOTUS within-1-step auto-AYE (§26.6.1).
>    Promotes a §25.9 sub-effect to a first-class CPU primitive. Folds into E17
>    (Iron-Fist split) + the CPU handler suite (E9 handlers #2, #4).
> 7. **Two new XS quick-win validators (QW8 + QW9)** for boot-pipeline data
>    quality: **QW8 Senate-class verifier (DH-24)** + **QW9 `TRAIT_CONFLICTS`
>    validator at boot/dataset import (DH-27)**. Both land at K4's boot
>    pipeline; both are XS one-validator helpers.
> 8. **DH-25 (career-track bootstrap unresolved) is the biggest new parking-lot
>    item — it BLOCKS modern scenario shipping.** 3-year-stale design discussion
>    has no canonical rule for which existing pols start on career tracks at a
>    mid-game boot. Author the rule (Zagnut's "1996+, 1/track" houserule is on
>    the table) before `scenario1948` or `scenario2012` ships (Phase-2 #30/#31).
> 9. **DH-26 3rd-party VP-trait "prohibitive" folds into E26** (third-party
>    trigger) alongside DH-11's Dem-3rd-party bias. **DH-28 climate-meter-tag
>    completeness** folds into the dataset pipeline (a CI/dataset-time validator
>    at the existing `scripts/` regeneration step).
>
> Tags carried from prior batches: Source column `gilded`/`fed`/`1772s`/
> `modern`/`hd`/`drums`/`pop`/`rep1800`/**`new1772`/`tea1772`** are the **ten**
> digests; **NEW** = first appeared this batch; **CARRIED** = on a prior list;
> **HI-CONF** = corroborated ≥2 eras; **HI-CONF (N era)** = the strongest signal;
> **MULTI-SAVE PROVEN** = corroborated by two independent saves (the era-model
> #102). **status:** `ready` = buildable now; `needs-design` = rules must be
> authored first. Sizes are the tech-lead's.
>
> **★ Why this build exists (META rationale — DH-36).** The first multiplayer 1772
> campaign (`new1772`) **collapsed at GM burnout after 12 turns** under manual
> bookkeeping (`new1772` POST 3607). That is the strongest single datum for the
> entire roadmap: the value proposition is that **the computer owns the
> deterministic upkeep a human GM cannot sustain** — which is exactly what the
> scaling-wall items (E7 House-slate persistence, E8 procedural pol-gen) and the
> CPU handler suite (E9) deliver. It is not a scheduled item; it is the *reason*
> the schedule exists.
>
> **★ Hard scope guard — there is NO "Era of the Future" target (NEGATIVE
> RESULT).** No ingested thread reaches a post-Gilded/post-modern era (`tea1772`,
> titled "…to future," stalls at 1874 mid-Gilded; `hd`/`drums`/`pop` top out at
> Gilded/Progressive/Populism; **batch 9: `nuke` stalls at ~2005 / the Era of
> Terror and seams into `modern`**). The timeline content ends at modern everywhere
> and is now a **CONTINUOUS 1772→2020 span**. **K4 adds EXACTLY `gilded` +
> `progressive` and the roadmap does NOT scope a future era** — there is no source
> to build one from (see the parking-lot "Far-future / progressive era" note, which
> is the furthest the corpus documents).
>
> **★★ Hard scope guard (batch 9) — there is NO Cold-War subsystem; the Nuclear-Age
> era is DATA on top of the generic war engine + diplomacy (NEGATIVE SCOPE,
> §9.1.8 / §28.2).** This is the single most important scope-control finding in
> batch 9. Despite the "Nuclear Age 1948–2004" title, the design has **NO**
> purpose-built nuclear/MAD model, NATO/Article-5 bloc, space-race subsystem, or
> army/navy/air service branches — and the code has only `src/engine/revolutionaryWar.ts`
> (no generic war engine, no Cold-War engine). The forum ran the entire Cold War on
> the plain naval→land d100 roller; nukes were scripted events + one legislative ×2
> multiplier; "NATO" was a single point-swing event. **The roadmap must NOT queue a
> Cold-War epic.** The work the Cold-War label hides is exactly TWO items already on
> the roadmap — the **generic cross-era war engine (E3)** and the **diplomacy
> subsystem (E12)** — plus content (events/bills/lobby-cards as data, on K4's
> era-content registry). **Frame the Nuclear Age as a DATA era, like every other
> era.** (Mirrors the no-future-era guard; the same kind of negative result.)
>
> **★ Resolved-in-code, design CHOSEN post-batch-9 — Senate threshold = 60% CLOTURE, then simple majority.** Engine today is simple majority: `runPhase_2_6_3_Floor`
> (`phaseRunners.ts:3562`) passes a bill iff `house.yea > house.nay && senate.yea > senate.nay`
> — no cloture step (the only supermajority anywhere is the Articles-of-Confederation
> 2/3-of-states path in the independence-era CC, `continentalCongress.ts:224` — a
> different mechanism). **Human pick:** target the real-Senate model — a **60% cloture
> step (end-debate)** before the simple-majority floor vote. Lands as part of the
> **filibuster/cloture epic (E14c)** — that epic now has its threshold (`CLOTURE_THRESHOLD = 0.6` of voting senators) and its sequencing locked: filibuster toggles on by law → cloture vote at 60% → floor vote at simple majority. No new keystone; the constant lives in E14c.

---

## Now shipped (history)

Reverse-chronological. The expertise/abilities/traits/cabinet/lobby epic (PR1–7)
is complete; the knowledge-base infra and eight ingestion batches are knowledge
milestones (no code, but they are what every item below is traced to).

- **Batch-14 ingestion (knowledge milestone).** Absorbed `gild1868` — the **FIRST
  dedicated native-1868 Gilded-Age campaign** (`bf590684`, "1868 The Gilded Age",
  **6318 posts** — the **LARGEST thread in the KB**), a multiplayer campaign that runs
  **1868 → ~1886** and **dies in GM burnout** (the 3rd GM-burnout death in the corpus,
  after `new1772`/`dem1820`). Distinct value: it is the **richest single record of the
  Gilded-Age issue engine actually being PLAYED** (tariff %, currency regime, civil-
  service, trusts, the 20-yr Reconstruction regime, AfAm enfranchisement, imperialism)
  — but the **Gilded Age is UNBUILT** (`Era` has no `gilded`, `types.ts:1337`; only
  `scenario1772.ts`/`scenario1856.ts`; the era is hand-run on `modern` tuning, gap
  #41), so the thread is **almost entirely the unbuilt design.** Headline value is
  **DOWNSTREAM GILDED-ERA CONTENT, NOT a re-sequence, NO new keystone**: it (1) **adds
  ONE NEW "gilded-era content" epic (EG)** — the five deltas **#147–#150 + DH-63** are
  ONE downstream era unit gated on **K3/K4 + #116/E4c + #42 + #57/E3b** (§9.1.10):
  **#147** tariff-as-%-rate (`game.tariffRate`) + mutually-exclusive `MonetaryRegime`
  enum, replacing the ±0.5 flavor bill at `phaseRunners.ts:3421` (M, on #116/E4c + #42);
  **#149** civil-service merit-vs-spoils axis + State-Gov-Jobs spoils lever + era-gated
  reform content (S–M, on K3/K4); **#150** the "1872 Rule" disorganized-loser special-
  election branch (S, niche; pairs with #57/#148 + #48); **DH-63** currency-regime
  exclusivity **folds into #42 + #147's MonetaryRegime** (XS–S, no standalone row);
  (2) **EXTENDS the #57/E3b Reconstruction epic with #148** — the 20-yr auto-expiring
  Reconstruction timer (`game.reconstruction`, begins 1864, auto-ends ~1884) +
  appoint-seceded-seats-by-Speaker/PPT-faction + a +2-RED bias-while-active → Solid-
  South sunset (FL/GA/LA Blue+3→+5, VA Blue+2→+5) + per-state early end by repeal-bill
  (S–M within E3b, **inherits the DH-29 solo-blocker**); (3) **STRENGTHENS #41** —
  `gild1868` is now the **full native spec** for the dedicated `gilded` era +
  `scenario1868` (red/blue-FLIPPED roster: RED = Republicans / BLUE = Democrats by 1868,
  POST 6; the Gilded nickname table; the era-event spine; the bill catalog; the SCOTUS
  docket; the 20-yr timer) — `scenario1868` is another scenario-as-data-row AFTER
  `scenario1788` + a mature `advanceEra`; (4) **CORROBORATES the standing Gilded
  cluster from a native start** (no new rows): `gild1868 (b14)` tags on **#13** (convention
  delegate-apportionment), **#14** (5-plank platform incl. Presidential-Action plank),
  **#15** (9-item VP rubric), **#52** (named-Justice SCOTUS docket + 10-yr drift +
  court-size bill), **#39** (amendment lifecycle), **#21** (extensible state-flag
  registry), **#42** (spending cap), **#3/#5/#6** (the Gilded content cluster); (5)
  **the 3rd GM-burnout death** reinforces the automation-reduces-upkeep argument behind
  the CPU suite (K5/E9) + #19/#20 (cite, NOT a row). Gap log gained **#147–#150 + DH-63**
  (NEW) + corroborations of **#3/#5/#6/#13/#14/#15/#21/#39/#41/#42/#52/#57**.
  `technical-guide.md` §9 updated with the batch-14 LEAD BLOCK + §9.1.10 "gilded-era
  content epic" dependency table + the polarity-flip note; `game-mechanics.md` §31
  (Gilded-Age era systems) added (NO re-sequence, NO new keystone, NO keystone moves):
  **EG epic added (downstream era-content); #148 → E3b; #41 strengthened to its native
  spec; corroboration tags appended; top-of-queue UNCHANGED.** _Complete._
- **Batch-13 ingestion (knowledge milestone).** Absorbed `oopscpu` — the **SECOND
  all-CPU run** (`699113d6`, "Oops, All CPUs", **350 posts / 7 chunks**), a **Ted-run
  all-CPU 1788 stress-test** and the **first DELIBERATE CPU-ruleset interrogation**
  (explicitly "to find where the rules are insufficient", POST 1, 5) — the CPU-AI
  validation source for the #70–#78 handler cluster. Distinct value: it is the first
  batch that **systematically validates a whole subsystem's spec (K5 CpuController +
  the E9 §25 handler suite) BEFORE it is built.** Headline value is **E9 DE-RISK, NOT
  a re-sequence**: it (1) **field-validates 6 E9 handlers** — #70 (9c leadership) /
  #72 (9a candidate + 9m VP) / #73 (9d cabinet) / #74 (9b legislation) / #75 (9g
  event) / #76 (9f conversion) go from "designed" to "designed + field-validated with
  concrete failure modes + Ted's fixes" (build-confidence bump, no new rows); **9e
  (convention #71) is the ONE handler NOT validated** (1788 predates conventions →
  stays `drums`-spec-only); (2) **folds the OC-1…OC-8 sub-gaps into the handler rows
  as sub-rules** — **★ OC-3 → 9b** (the ★balance-critical crisis-vote ideology-floor +
  secession check — the peaceful-1792-abolition bug); **OC-2 → 9c** (canonical
  `chamberControl(snap,chamber)` helper); **OC-1 + OC-5 → 9d** (scandal-resignee
  cooldown + court-as-firing-precedent gate); **OC-6 → the kingmaker handler**
  (highest Com+Leg+Gov tiebreak); **#72 sharpen on 9a/9m** (VP-retention HARD rule +
  pre-12A nomination trio); (3) **adds #143 post-election Command decay** (XS, RULED —
  40%/−1 Command for non-Pres/VP candidates per presidential cycle; binds at
  `runPhase_2_10_End` `phaseRunners.ts:4171` gated on `isPresidentialYear`) → **QW17**
  in the XS quick-win cluster; (4) **RE-SCOPES E10b further with the #61 death-branch**
  (S — VP-inherits-on-DEATH = FULL President, no acting/action-divert, NOT auto
  party/faction leader → re-run leadership IRV; "acting"/action-divert retained ONLY
  for the incapacity branch; Ted-RULED `oopscpu#POST 324-329`, SUPERSEDES the
  batch-11 `arkzag` read for the death case); (5) **adds DH-61 (S) + DH-62 (M) as
  explicit `scenario1788`/E1 PREREQUISITES** — DH-61 boot-seed era-active wars (the
  forgotten 1788 NW Indian War → a `BootSheet.activeWars` field + boot hook, folds
  into K4); DH-62 pre-12A two-vote/no-ticket EC mode + same-state-EV (an era-keyed
  election-mode variant → E4); (6) **adds OC-4 + OC-8 to the designer-gated
  sub-bucket** (→ 11 items, was 9): OC-4 off-ideology CPU draft gate (Ted wants "a
  better third way"), OC-8 define "office" + rewrite the Scandalous-Non-Office-Holder
  event (flagged to vcczar) — both OPEN, NOT ready-to-build; (7) **adds the
  ALL-CPU-TEST as a recommended repeatable spec-validation METHODOLOGY** (validated
  6 handlers pre-build, immune to GM-burnout DH-36; recommend a post-12A all-CPU run
  before building #71 / handler 9e — a methodology note, NOT a row); (8)
  **STRENGTHENINGS** (no new rows): #70–#78 field-validated from a founding angle;
  **#52 resolved for the all-CPU case** (CPU SCOTUS by ideology-distance —
  player-vs-CPU stays user-gated); **#76 4th-thread ideology-circle** (LW↔RW-Pop 25%
  cross-step); #144/#145(OC-7)/#146 procedural rulings slot into their topical homes.
  Gap log gained **#143–#146** + **OC-1…OC-8** + **DH-61 + DH-62** (NEW) +
  corroborations of **#70–#78 / #52 / #76**. `technical-guide.md` §9 updated with the
  batch-13 LEAD BLOCK + §6.6.1 handler-table field-validation tags + §9.6 batch-13
  ordering block + §9.1.3 methodology note (NO re-sequence, NO new keystone, NO
  keystone moves): **E9 de-risked (6 handlers field-validated, 9e flagged); OC-*
  folded into handler rows; #143 → QW17; E10b re-scoped (#61 death-branch); DH-61/DH-62
  → E1 prerequisites; OC-4/OC-8 → designer-gated (→ 11); methodology note added.**
  _Complete._
- **Batch-12 ingestion (knowledge milestone).** Absorbed the FIRST DISCUSSION-THREAD
  pair in the corpus — `smallbugs` (`cf82a7d3`, "A Thread for small low priority
  changes and errors", **804 posts** — the 3-yr+ rolling community-curated bug +
  ruling catalog with vcczar's nested rulings) + `tedchange` (`a0f0bf04`, "Discussion:
  Ted's Change Log of Doom", **408 posts** — the DESIGNER Ted's official rules-doc
  rewrite/cleanup channel, Sept 2024 → Oct 2025; the **HIGHEST-authority rules source
  in the corpus**). Distinct shape from playtests (no campaign clock, no GA-of-record);
  same authority class for the rule-doc patches (Ted in `tedchange`; vcczar in
  `smallbugs`). Headline value is **DESIGNER-RULINGS INTEGRATION + QW0 fully closes +
  one M-rework lands + 19 sized rulings slot, NO new keystone, NO re-sequence**: it
  (1) **CLOSES QW0/BUG-0** — the relocation cap is now ruled `4` + alt-state exemption
  (`smallbugs#POST 734-735` vcczar-12-30-25 approved), promoting QW0 from "open-design
  / build" to **"ready-to-ship, top-of-queue"** (one-line `RELOCATION_ATTEMPTS_PER_TURN
  = 5 → 4` at `types.ts:247` + a guard at the relocation accumulator so alt-state
  moves don't decrement the budget; verify in `runPhase_2_1_4_Relocations`); (2)
  **RE-SCOPES E16 to BUNDLE cabinet confirmation + #124 enthusiasm REWORK from day
  one (sized M, was XS-S)** — Ted's `tedchange#POST 1-4` re-architects the
  cabinet→enthusiasm path: lobby satisfaction now writes **POINTS** to
  `Faction.score?` (NOT enthusiasm); ideology composition (≥50% / ≤20%) drives
  enthusiasm via the existing ±3-cap clamp; **lands AFTER K2 + K5** (cabinet picks
  are CPU actions; consumes the conditional-vote-rules primitive); **numeric
  percentages stay designer-gated open** (ship a const table that re-tunes post-
  design); (3) **SLOTS the 18 other Ted-rulings sized + placed**: **12 XS** (#135
  50/50 House inverse-control one-liner at `phaseRunners.ts:1864` → Phase-1 #19;
  #136/#137/#138 draft re-rules → Phase-1 #1 / E1; #139 Pres signature in 2.6 →
  Phase-1 #2 / #14; #141 FL trait gain 5%+/3%- → Phase-1 #19; #142 CPU CJ ladder →
  E25; #131 Integrity-can't-nominate-Controversial → E16 + E25 + diplomacy filter;
  #132 Challenge-Legislation-can't-target-REPEAL → E11 / E25 filter), **5 S** (#126
  Pres 2-step Admin-then-Command blunder rule → E29; #127 ideology-shift / conversion
  schedule → E5b ideology-circle helper PR; #128 Kingmaker / Master Kingmaker scope
  → E20 election math at `calcStateVote:3711`; #129 Kingmaker→Protégé trait allowlist
  → E5b + Phase-1 #21; #130 death/retirement schedule + Hale + Frail-first → Phase-1
  #19 / pairs with #85; #133 1st/2nd CC composition rewrite → E17; #140 AnytimeEvo
  target-pool tightening → Phase-1 #19 / E9 handler 9g), and **3 M** (#124 cabinet
  enthusiasm rework → E16; #134 Lingering 7-step strict ordering + tax/tariff
  carry-forward → Phase-1 #6 / E6; #120 `smallbugs` dataset umbrella → ONE coordinated
  `scripts/seedDataset.mjs` `CURATED_ROWS` pass, ~100 items, also subsumes DH-43 /
  DH-51 / DH-28); (4) **SIMPLIFIES E5 + E25 build-target** — **Amendments NOT SCOTUS-
  challengeable** (`smallbugs#POST 250-269` vcczar OVERRIDES `tea1772` #100): **drop
  the SCOTUS-overturns-amendment branch from both E5 and E25 scope** (keep E5's
  strike-a-statute + mutable-threshold + #119 lifecycle; keep E25's docket + Justice
  drift + DH-32 state-guard); (5) **ADDS the Decision-gated SUB-BUCKET split** — the
  existing user-gated bucket stays (waiting on the human's design call: #52 player-
  SCOTUS, #18 state-scope, the delegate-class fork, contingent-election #10/#84,
  §25.9 Iron-Fist split, DH-12/13/14/15, DH-25 career-track bootstrap, DH-33 + DH-54
  impeachment/succession, DH-41 SCOTUS cascade, DH-49 population model); the NEW
  designer-gated bucket holds the **9 open `tedchange` items** (NOT ready-to-build
  until Ted/vcczar closes them in `tedchange`/`smallbugs`): **(1) Mil-Prep meter level
  4 fix** (3 proposals 30/40/30, 30/60/10, 40/50/10), **(2) #125 Universal Election
  Modifier (UEM)** — proposed but pushback on stacking + age modifiers, **(3) Crisis
  trait consolidation**, **(4) term-limit Gov actions in pre-Senate era**, **(5)
  faithless-elector rewording**, **(6) party rename trigger PL-vs-EraEvo**, **(7)
  VP-must-be-same-party-on-resignation relaxation**, **(8) cabinet enthusiasm
  percentages** (the #124 numeric), **(9) cabinet ideology weighting Big-4-vs-rest-
  vs-cabinet-level**; (6) **STRENGTHENINGS, not new rows:** **#76 (CPU conversion
  adjacency)** EXTENDED via `tedchange` (same-party can target same OR ADJACENT
  ideology); **#99 (ideology=circle)** now **TED-AUTHORITATIVE** — 3-thread
  corroboration becomes designer-ruled (25% LW↔RW rate pinned; auto-Two-Faced grant);
  **#67 (Lingering bank ordering)** RULED → #134 (canonical 7-step + carry-forward);
  **#100 (Gov-requested SCOTUS review of amendments)** OVERRIDDEN by Ted/vcczar (mark
  superseded in the build-target); (7) **NEW gaps:** **#121 Secessionist trait
  missing from the politicians dataset** (XS — dataset addition + a one-row `Trait`
  union add; folds into the #120 umbrella + the secession trigger E3b sub-PR (a));
  **#122 pardon mechanics entirely unspecified** → **designer-gated parking-lot item**
  (no rules to build to yet); **#123 small late-modern content bundle** (Wyoming Rule
  → Real House Act 585-cap, runoff-elections for the runoff-amendment, Senate-Abolish
  amendment) → folds into Phase-2 #28 / #30 (the existing modern-content rows). Gap
  log gained **#120–#142** (NEW) + corroborations of **#67/#76/#99/#100** +
  DH-43/DH-51/DH-28. `technical-guide.md` §9 updated with the batch-12 LEAD BLOCK +
  §9.6 batch-12 paragraph + §2.1.1 batch-12 data-shape rows (NO re-sequence, NO new
  keystone, NO keystone moves): **QW0 fully closes (cap=4 + alt-state guard)**;
  **E16 re-scoped M to bundle cabinet confirmation + #124 from day one**; **18 other
  Ted-rulings sized + slotted into existing epics**; **E5 + E25 simplified by the
  amendments-NOT-SCOTUS build-target**; **Decision-gated split into user-gated +
  designer-gated buckets**; **#76 / #99 / #67 / #100 strengthened/superseded
  inline**. _Complete._
- **Batch-11 ingestion (knowledge milestone).** Absorbed `arkzag` — the **first
  FULL-ARC 1820→1840 continuation** ("Ark and Zags — The Era of Democracy",
  152c2881; **2531 posts**, the direct continuation of batch-10's `dem1820` 1820 save
  run forward through fictional D-R presidents Benton→Cheves→Enoch-Lincoln→Dudley to
  1840 — a party system that never realigns). It is the thread that finally
  **exercised the LATE-GAME systems batch 10 never reached**: multi-cycle presidential
  elections, the Bank-War→Independent-Treasury economic arc, Force-Bill/tariff fights,
  amendment machinery, and a presidential **assassination → succession**. The headline
  value is **placement + ONE fork-resolution, not a re-sequence**: it (1) **adds NEW
  small epic `E4c`** — the **#116 Jacksonian Bank-War → Independent-Treasury long-run
  ECONOMIC content state machine** — placed **AFTER E2 + E6 + E4b(b)** (it recharters/
  replaces E4b(b)'s Second Bank, needs E2's `Bill.type`/crisis-bypass + E6's EconStab
  meter); built **EMERGENT** (recurring CRISIS bills resolving an EconStab CRISIS via a
  `Bill.replaces` field + a per-bill-class `lockedUntilYear` tariff cooldown), with
  "scripted-vs-emergent" carried as a design note; (2) **RE-SCOPES E5** (amendments)
  with **#119**'s explicit lifecycle (propose→committee→floor→**governor-ratify**→
  active) + the **active-amendment-blocks-a-legislation-class** hook + the
  **un-bundleable** flag — NOT a new epic; (3) **RE-SCOPES E10b** (succession) with
  **#61**'s VP-succeeds-on-death → fill-VP (gated on E5's VP-vacancy amendment) →
  acting-president action-divert roll + trait side-effect — noting the **kill trigger
  already SHIPS** (`anytimeEvents.ts:232` → `vacateOffice` `phaseRunners.ts:2449`), so
  the **succession ENGINE is the work**; the **line-of-succession/impeachment half
  stays parking-lot (DH-54)**; (4) **PROMOTES #51 to E23 `ready`** — the `arkzag` final
  chunk published the `drums` **4-step enthusiasm-reshuffle + −100/waiver rule**
  verbatim (settling the `dem1820` fork to `drums`, NOT Ted's "every state" / Matt's
  "primaries-only") — and marks the **±3 cap UNCONDITIONALLY ready** (ships with E6);
  **#51's "fork" entry LEAVES the Decision-gated category**; (5) **adds a NEW
  delegate-class fork to Decision-gated** (AI-allocator-by-EV-formula vs player-rigged —
  a pick before E10's delegate-apportionment sub-PR), so Decision-gated stays at **2
  items (#18 state-scope + delegate-class)**; (6) **slots DH-59** (relations-meter
  under-floor, XS → **E12** when the 9-point scale is built) + **DH-60** (era-events
  fire with no territory/asset prereq, S → **E15 + BUG-1**, a `requires?: Predicate` on
  the era-event row); and (7) **re-confirms #115 scenario-boot priority UNCHANGED** (the
  continuation-boot proved a mid-game save can be picked up cleanly) + **flips the
  meta-signal POSITIVE** — no GA-burnout this time (heavy scripting absorbed the upkeep)
  → a **3-thread automation-reduces-upkeep signal** (cited as the E9/#55/#115
  prioritization argument, NOT a row). Gap log gained **#116** + **#119** (NEW),
  **#51 FORK-RESOLVED**, **DH-59 + DH-60** (NEW), + corroborations of
  #61/#13/#111/#11/#44/#92/#52/#59/#40/#85/#115. `technical-guide.md` §9 updated (NO
  re-sequence, NO new keystone, NO keystone moves): **E4c added (deps E2+E6+E4b(b),
  emergent)**; **E5/E10b re-scoped**; **#51 promoted to E23, ±3 cap un-gated**;
  **delegate-class fork added + #51 fork removed from Decision-gated**; **DH-59/DH-60
  slotted**. _Complete._
- **Batch-10 ingestion (knowledge milestone).** Absorbed `dem1820` — the **first
  1820-START** in the KB ("1820 — The Era of Democracy", cc37d770; a NEW 1820
  scenario start, Monroe's 2nd term / late Era-of-Good-Feelings → Jacksonian "Era of
  Democracy"; **947 posts**, 10-human MP with the **1788/1800 polarity** — BLUE
  Dem-Republicans + RED Federalists/National-Republicans). A **short, corroboration-
  rich** thread (runs ~1.5 turns to ~1822-23; **GA-burnout-killed in real-time Aug
  2025**, never reaches the 1824 cycle / Jackson / Nullification). The headline value
  is **PROMOTION + decision-gating, not new scope**: it (1) **promotes the scenario-
  boot pipeline (#115) to the front of the subsystem queue — folded into K4's
  `BootSheet` schema (NOT a new keystone)**: there are **NO documented rules for
  CREATING a game**, so the build's shared `scenarioBoot(BootSheet)` pipeline must
  canonicalize the improvised GA setup (strip-Command house rule, inaugural career-
  track seed from the last-3 classes, era-keyed industry init, Senate-class assign,
  vacant-seat fill); built **WITH the first new scenario before the third hand-
  authored copy**, and the venue for the XS boot validators + the appointment-ladder
  (#115b); (2) **decision-gates TWO forks** the build cannot pick alone — **#52
  player-controlled SCOTUS** (3 live models; docket data structure needed either way
  → E25) and **#18/#51 meter→enthusiasm→election** (3 live models; the settled ±3 cap
  is a queued XS clamp blocked on the pick); (3) **slots sized corroborated fixes** —
  **DH-53 bill-EV-sign S** (author structured bill-effect tables → E20/K4), **DH-24
  Senate-class XS** (boot pipeline / QW8), **focus-Rep (EV−2)/5 #55 M** (E7+E28),
  **statehood→sectional-crisis #59 S** (E3b additive at `admitState`),
  **appointment-ladder/replacement-gains #115b XS** (boot/appointment rules); (4)
  **makes the #92 era-band model 4-START-CONFIRMED** (1772+1800+1820+1948 — the
  draft table prints the Democracy/Manifest-Destiny bands), a confidence bump on
  K3/K4; and (5) **records the ★★ 2nd GA-burnout DEATH** (DH-36, after `new1772`) —
  the prioritization ARGUMENT for the upkeep-reducing items (NOT a row). Gap log
  gained **#115** (no rules for creating a game → scenario-boot pipeline) +
  corroborations of #1/#18/#24/#44/#51/#52/#55/#59/#61/#76/#86/#92/#101/#108 +
  DH-24/DH-25/DH-27/DH-36/DH-53 from a NEW start year. `technical-guide.md` §9
  updated (NO re-sequence, NO new keystone): **#115 promoted to the front of the
  subsystem queue inside K4's `BootSheet`**; **#52 + #18/#51 recorded decision-gated**;
  **DH-53/DH-24/#55/#59/#115b sized + slotted**; **#92 4-start confidence bump**;
  **DH-36 2nd-death cited as the upkeep-automation prioritization argument**.
  _Complete._
- **Batch-9 ingestion (knowledge milestone).** Absorbed `nuke` — the **Nuclear-Age
  / Cold-War / modern-half campaign** (a 1948-start "Era of the Nuclear Age
  1948–2000 → Era of Terror 2000–~2005" thread; at **12,228 posts the LARGEST
  corpus in the KB**). It is the **chronological predecessor of the
  already-documented `modern` 2004-2020 thread** — joined at the 2004 election — so
  the **KB now spans a CONTINUOUS 1772→2020 timeline.** The headline value is
  **confidence + scope-control, not new scope** (a *final-role* confirmation pass):
  it makes the **era model 3-START-CONFIRMED** (1772 `tea1772` + 1800 `rep1800` +
  **1948 `nuke`** all emit the band model) and adds the **two-level era refinement**
  (Historical Eras carry **rule-deltas** — the Era-of-Terror cabinet rework — AND a
  separate per-decade census doing EV-realloc + bias-re-lean + content-rotation),
  and it records the **★★ NEGATIVE SCOPE finding — no Cold-War subsystem to build**
  (only `revolutionaryWar.ts` exists; the Cold War = the generic war engine + the
  diplomacy subsystem + content). Gap log gained rows **#106–#114** (Cold-War =
  relabeled generic war [no nuclear/MAD/NATO/space/branch subsystem; USSR never
  falls]; the diplomacy subsystem [8 relation meters + ambassador actions]; gradual
  4-lever realignment; era CONTENT fires on its own scripted clock; the modern
  election machine; the modern institutional layer [impeachment/resignation/
  legislated-court-size/force-vote]; Era-of-Terror content; **★ #114 — the
  design-intent statement that the APP is 1-human-vs-9-CPU**) + design-holes
  **DH-45..DH-58** (USSR-collapse trigger chain stalls; diplomacy lacks downward
  pressure; **★ DH-47 wars NEVER resolve / no army-navy-air branches**; **★ DH-48
  era-event data needs structured `evDelta`/census fields — Neocon census events
  LOST as free-text**; era-event scheduling; **★ DH-49 no population model + House
  cap**; modern pols OVERPOWERED/recency-biased; landslide-margin-cap; bill-catalog;
  **★ DH-54 impeachment/succession never in the rules doc**; 3rd-party engine
  2-party-hard-wired; conflicting career-track rule-sets; convention/handler holes).
  `technical-guide.md` §9 hardened (NO re-sequence, NO new keystone): **★ K3/K4
  TWO-LEVEL refinement + structured-era-event-data requirement** (§9.1.5 updated;
  "Neocons" logged as a faction-rebrand NOT a band); **★★ the NEGATIVE-SCOPE
  Cold-War guard** (§9.1.8, new); **★ K5 + the handler suite elevated to
  load-bearing** (§9.1.3 priority bump); **E16 extended to create-AND-abolish cabinet
  seats**; **legislated-variable-SCOTUS-size folded into E25**; **`scenario1948`
  added as a 4th `BootSheet` boot shape at E30**; **Senate-threshold recorded
  resolved-in-code / open-design**; **DH-49 + DH-54 added to the parking lot (→ 12)**;
  **DH-45..DH-58 + #105/#108/#109/#112/#113 classified into existing epics**.
  _Complete._
- **Batch-8 ingestion (knowledge milestone).** Absorbed the **two 1772 threads**:
  **`new1772`** (the **first MULTIPLAYER 1772 founding campaign** — 10 humans
  1772→1796, the only thread that stands up the entire federal apparatus
  piece-by-piece from a 1772 start; **abandoned at GM burnout**) + **`tea1772`**
  (a 157-post **solo all-CPU 1772→1874 fast-traversal** that stalls mid-Gilded —
  "Stamping out America's love for tea"). The headline value is **confidence, not
  new scope**: this batch makes the era-model the **single most-corroborated
  architectural finding in the KB — MULTI-SAVE PROVEN** (two independent saves,
  1772-start `tea1772` + 1800-start `rep1800`, 28 in-game years apart, emit the
  **identical era-band labels at the same in-game dates** — game-context #102).
  Gap log gained rows **#100–#105** (SCOTUS-overturns-a-ratified-Amendment +
  threshold-amendable; the multi-save era-band proof; dual era-scoring [per-era +
  cumulative] as the WIN-CONDITION scoreboard; presidential-vote modifier stack +
  era-issue list; lone-ideology convention exploit; stat-collapse → forced
  presidential resignation) + nine design holes **DH-36..DH-44** (GM-burnout META;
  no pol-trading; late-ratification/Rogue-Island window; all-human Convention
  deadlock; SCOTUS-justice-count-not-auto-packaged → game-stall; ★ the general
  SCOTUS-ruling → downstream-statute cascade [UNBUILT, `vcczar`-deferred];
  national-meters swamp per-state lean; Vermont no-home-state; post-12A
  legislature vote-count). `technical-guide.md` §9 hardened (NO re-sequence): **★
  K3/K4 bumped to HIGHEST confidence** (§9.1.5 batch-8 confidence bump — multi-save
  proven); **★ E16's dynamic-seat refactor justification strengthened** (the WRONG
  model confirmed founding→modern); **★ DH-41 added to the author-before-build
  parking lot** (now 10); **#100/#103/#104/#105 + DH-38/39/40/42/43/44 folded into
  their epics**; **DH-43 added as QW11** (Vermont dataset fix); **DH-36 cited as
  the META justification** + **★ the no-future-era NEGATIVE-RESULT guard added**.
  _Complete._
- **Batch-7 ingestion (knowledge milestone).** Absorbed `rep1800` (the "Era of
  Republicanism" 1800→1868 early-republic campaign — the **first procedural
  record of the 1800–1856 early republic**, Jeffersonian → Era-of-Good-Feelings →
  Jacksonian → Manifest-Destiny → Nationalism → 1868; the **predecessor of
  batch-1's `gilded`**, so **the 1800 campaign is now documented end-to-end**).
  The headline value is an **architecture reframe** — eras are content-bands
  gated by game-state + territory ownership, NOT the calendar. Gap log gained
  rows #92 (★ eras-as-content-bands), #93–#98 (12A before/after state machine;
  slavery-as-state-flag + Cohens-v-Virginia amendment-only abolition; Second
  Bank recharter clock + Bank War; 20-state Call-for-Convention crisis;
  Civil-War VARIANTS [Pres-defects-to-CSA / Hartford / Northern / UK-intervention
  / guerrilla]; coup-at-low-meters meters-driven game-over set) + #99
  (ideology-scale-is-a-CIRCLE) + 7 design-holes DH-29..DH-35;
  `game-mechanics.md` gained §27 + §19 divergences #18-#22; `technical-guide.md`
  §9 re-sequenced: **★ K3/K4 re-specced for the era-model reframe** (§9.1.5 —
  `advanceEra` becomes CONDITION-DRIVEN; content gated on `eraBand` + a new
  `territoryOwned` predicate, not calendar; reconciles #68 + §26 + §27.1 — NOT a
  new keystone); **★★ the Reconstruction SOLO-BLOCKER (DH-29) added as a hard
  BUILD REQUIREMENT on E3b** (§9.1.6 — the Strict/Ironclad plan can NEVER pass
  with CPU → solo Reconstruction unwinnable); **★ ideology-as-CIRCLE added as
  Phase-1 #5b** (§9.1.7 — central `ideologyDistance` helper + migration behind an
  era-gated flag); **new early-republic subsystems** folded into E1 + Phase-1
  #4/#4b (12A elector toggle, slavery-flag+Cohens, Second Bank+Bank War,
  statehood-by-bill+territory-gate); **era-events-predating-start MERGED into
  BUG-1** (LIVE-confirmed) + **DH-30 event-scheduler-min-floor added as QW10**;
  **DH-31..DH-35 classified**; **`scenario1800` noted as an optional later boot
  sheet**. _Complete._
- **Batch-6 ingestion (knowledge milestone).** Absorbed `c50d9da7` (the "Era of
  Populism" 2012 fresh-modern boot playtest, 1172 posts — the **first dedicated
  fresh-boot of a modern-era scenario** in any ingested thread). The unique
  value is **scenario-boot model + a NEW meter-driven endgame**. Gap log
  gained rows #86–#91 (scenario-boot schema, era-coded double-points,
  APOCALYPSE meter clock, bill-creates-cabinet-seat, era-coded procedural
  pol-gen start-year, amendment-toggled VP action) + 5 new design-holes
  DH-24..DH-28 (Senate-class boot data, career-track bootstrap unresolved,
  3rd-party VP-trait prohibitive, `TRAIT_CONFLICTS` not enforced at boot,
  meter-tag completeness); `game-mechanics.md` gained §26 + §19 divergences
  #14-#17; `technical-guide.md` §9 re-sequenced: **K4 absorbs the `BootSheet`
  schema** as the cross-cutting build constraint; **K2 gains
  `requires?: AmendmentPredicate` from day one**; **Phase-1 #6 absorbs the
  APOCALYPSE meter-driven endgame** (sized M; §9.1.4); **E16 absorbs the
  dynamic cabinet seat list** (divergence #15); **Phase-2 modern epic splits
  into TWO scenarios** (`scenario1948` continuation + `scenario2012` fresh-
  boot); **2 new XS validators** (DH-24 Senate-class + DH-27 `TRAIT_CONFLICTS`)
  added as QW8 + QW9; **DH-25 career-track bootstrap** added to parking lot
  as a blocker on Phase-2 modern scenarios; CPU handlers #2 and #4 gain the
  **conditional-vote-rules primitive** (`pop` POST 1111). _Complete._
- **Batch-5 ingestion (knowledge milestone).** Absorbed `e1776bbd` (the all-CPU
  1841→1924 "Drums of War" playtest, 7540 posts — the **first explicit forum
  record of CPU heuristics**). The unique value is **agent-decision
  specification**, not new mechanics. Gap log gained rows #70–#85 (15 CPU
  handlers + 6 corroborating non-CPU items + DH-12..DH-23); `game-mechanics.md`
  gained §25 (720 lines, 15 CPU subsections) + §19.1 divergences #10–#13;
  `technical-guide.md` §9 re-sequenced: **K5 added as a new late-keystone** (~120
  lines, parallel with K3/K4); a **CPU handler suite epic** added at Phase-1 #9
  with 15 parallelizable PRs; the **cabinet 36% bug (DH-23) re-sized XS-S**
  because the system doesn't exist yet; generic war (E3) updated **multi-theater
  + tiered** with the multi-confirmed formula; **Iron Fist split** (§25.9) added
  as Phase-1 #17 (needs design); **divergences #10–#13** added; #79/#80/#82/#83/
  #85 marked READY (#85 as a new quick-win); contingent-election rules (#10/#84)
  + §25.9 + DH-12/DH-13/DH-14/DH-15 added to the parking lot. _Complete._
- **Batch-4 ingestion (knowledge milestone).** Absorbed `77db6e6f` (the
  1856-native "A House Divided" Part 2, 1856→1904, 9051 posts — the first
  1856-native procedural record and the only source for the Civil-War /
  Reconstruction / secession era). Gap rows #56–#69; divergence **#9** (the
  stale relocation cap → **BUG-0**); nine design holes **DH-3..DH-11**.
  `game-mechanics.md` gained §23 + §24 + the §2.5 banking note; `technical-
  guide.md` §9 re-sequenced (BUG-0 front; Civil-War epic at Phase-1 #3b; #54
  ready; point-banking folded into K3/K4). _Complete._
- **Batch-3 ingestion (knowledge milestone).** Absorbed `3a9ac985` (the modern
  1948→2020 multiplayer campaign, 2276 posts). Gap log grew with modern rows
  #47–#55 + A9 + DH-1/DH-2; `game-mechanics.md` gained §22 + divergences #7/#8;
  `technical-guide.md` §9 re-sequenced into Phase-0/1/2, pulling the two scaling
  walls + meter generalization near-term; the cabinet-wipe finding corrected.
  _Complete._
- **Batch-2 ingestion (knowledge milestone).** Absorbed `f55d3e21` (1788
  federalism, 732 posts) + `85f8e6b4` (1772 solo aesthetic, 90 posts). Gap log
  to ~54 rows + A1–A8 presentation + 3 confirmed bugs; `game-mechanics.md`
  gained §20–§21 + divergences #4–#6; `technical-guide.md` §9 → the two-track
  plan. _Complete._
- **Batch-1 ingestion (knowledge milestone).** The four planner docs stood up
  and absorbed the `f4c7c2c4` 1868 Gilded-Age dry-run: gap log to ~41 rows,
  ~12 new `game-mechanics.md` sections, the `ActionRegistry` keystone
  identified, three design divergences resolved. _Complete._
- **PR7 — Lobbies → expertise → industry + faction ideology.** Lobby cards
  trickle expertise to members (2.1.2), `LOBBY_INDUSTRY` nudges state industries
  (2.1.8), `EXPERTISE_IDEOLOGY_LEAN` biases `factionCenter`. _Complete._
- **PR6 — Trait pass B (governance/cabinet-facing).** `TRAIT_GOVERNANCE_EFFECTS`
  drive lingering meters, era-event modulation, military-command grants,
  Secession-Winter band. _Complete._
- **PR5 — Cabinet overhaul.** Per-seat scoring (`CABINET_SEAT_SCORING`),
  expertise gating + grants (`OFFICE_EXPERTISE`), admin double on confirm,
  era-conditional seats (`cabinetSeatsForYear`). _Complete._
- **PR4 — Trait pass A (election-facing).** `TRAIT_ELECTION_EFFECTS` /
  `TRAIT_ELECTION_BANDS` give real per-context magnitudes to election traits.
  _Complete._
- **PR3 — Trait loss + conflict machinery.** Old-age trait decay + d6 conflict
  arbitration (`TRAIT_CONFLICTS`, `tryGrantTrait`). _Complete._
- **PR2 — Ability earn/loss alignment.** Missing command grants + the loss
  machinery for all six skills + command; primary/secondary track grants.
  _Complete._
- **PR1 — Expertise axis foundation.** New `Expertise` type (19 tags) +
  `expertise` field; migrated the 8 mis-filed expertise-as-trait strings off the
  `Trait` union (incl. `repair()` save migration + dataset regen). _Complete._

---

## Up next

> **Two tracks, run in parallel by separate workstreams.** Within a track, order
> is the product — nothing depends on something below it. The engine track is the
> bottlenecked dependency chain in **three phases**: Phase 0 (keystones), Phase 1
> (near-term subsystems — the federalism epic, the Civil-War epic that completes
> 1856, the cross-cutting items the modern thread pulled forward, the **batch-5
> CPU handler suite**), Phase 2 (the far-end deep-modern epic, builds last). The
> presentation track shares only a handful of small additive `Politician`/
> `Party` fields + two deeper handoffs and can be staffed independently
> (tech-lead §9.4, §9.6).

### Quick-wins — land immediately (XS each, high feel-value)

Fixes + cheap divergence/balance resolutions. **★★ Batch-12 — BUG-0/QW0 IS NOW
FULLY SETTLED (cap=4 + alt-state EXEMPTION GUARD, vcczar-12-30-25 RULED via
`smallbugs#POST 734-735`) — DO IT FIRST, it's the top of the queue.** **BUG-1 is
the exception that matters:** it is XS but a **hard gate on the federalism epic**
— land it *in or just before* E1. **Batch 7: BUG-1 now ALSO subsumes the
era-events-predating-start-DROPPED hole** (LIVE-confirmed by `rep1800`'s
LA-Purchase-dropped-at-1800-start episode — a 2nd same-class instance; same bug,
merged). **QW10 (DH-30 event-scheduler-min-floor) is BUG-1's companion** on the
same scheduling surface. DH-2 (modern deck fired off-year cards) is the **same
scheduling surface** as BUG-1 + divergence #4 and is investigated at E15, not as
its own quick-win. **★ Batch-12 adds FIVE new XS quick-wins (QW12–QW16)** — pure
Ted/vcczar one-line/one-helper rulings that bind at known sites with no
dependency: **QW12 #135** 50/50 House inverse-control (one-line at
`phaseRunners.ts:1864`), **QW13 #131** Integrity-can't-nominate-Controversial
filter, **QW14 #132** Challenge-Legislation-can't-target-REPEAL filter, **QW15
#139** Pres signature in 2.6 (phase reorder), **QW16 #141** FL trait gain 5%+/3%-.
Each row is tagged with its `tedchange#POST N` for traceability. **★ Batch-12
absorbs QW11 (DH-43 Vermont) into the #120 dataset umbrella row below** — DH-43
ships as one item in the coordinated `scripts/seedDataset.mjs` pass, not as a
standalone quick-win. **★ Batch-13 adds ONE new XS quick-win (QW17)** — **#143
post-election Command decay** (40% / −1 Command per presidential cycle for any pol
who did NOT run for Pres/VP — "shit or get off the pot"), a Ted-RULED, tested-live
standalone that binds at one known site (`runPhase_2_10_End` `phaseRunners.ts:4171`,
gated on `isPresidentialYear`, after the 2.9.4 ticket roster is known) with no
dependency — it joins the QW0 / XS-consistency cluster. Tagged with its `oopscpu#POST N`.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| QW0 | **BUG-0 — relocation cap `5`→`4` + alt-state EXEMPTION guard (divergence #9 — ★★ batch-12 FULLY SETTLED, vcczar-12-30-25-RULED)** *(do FIRST — TOP OF THE QUEUE)* | **One-line const edit + a guard at the relocation accumulator.** `RELOCATION_ATTEMPTS_PER_TURN = 4` at `types.ts:247` (shipped value is `5`) **PLUS** a guard so **alt-state moves do NOT count against the 4-total budget** (verify alt-state accounting in `runPhase_2_1_4_Relocations`). **★★ Batch-12: `smallbugs#POST 734-735` (vcczar-12-30-25 "Approved by vczar") SETTLES BOTH halves:** *"A faction is limited to FOUR total attempted moves per half-term. A politician that moves to an ALT-STATE does NOT count against the FOUR total moves."* This **CLOSES** the long-running BUG-0 / QW0 / batch-10 top-of-queue item from "open-design + ready-to-build" to **fully settled and ready-to-ship FIRST**. Settled value, no migration (a tunable const + a guard, not a save field); no dependency. The auto-Carpetbagger + 10-yr-expiry *feature* is QW4 / E17 — this row is the **cap value + the exemption guard**. **The cheapest win in the whole roadmap.** No human review-gate; no designer-gate; the cap value AND the exemption are both authoritative. | — | XS | bug BUG-0 / divergence #9 (`hd` §0/I-1, 7062-7066, 7555) + codebase (`types.ts:247`) + **★★ `smallbugs#POST 734-735` vcczar-12-30-25 APPROVED — cap=4 + alt-state exemption both ruled** — CARRIED + SETTLED | ready (TOP OF QUEUE) |
| QW1 | **BUG-1 — era-event era-lock filter (now ALSO subsumes era-events-predating-start-DROPPED, batch 7)** *(federalism gate)* | Add an era-vs-start-year filter to `buildEraEventsForYear` (`phaseRunners.ts:2817`): an event whose era is past the scenario's start era is treated as already-happened and excluded from the roll table — **BUT** the official ruling (`fed` POST 524) also means a start year *past* an era wrongly **loses** that era's still-pending content (an **1800-start game wrongly loses the Louisiana Purchase**). **Batch 7 LIVE-CONFIRMS this exact bug:** `rep1800` §A POST 2668 — the GM found the LA Purchase was filed under the prior Era of Federalism and "not included" for an 1800-start game; he hand-added it in 1816. Same bug, **merged** (the era-events-predating-start-DROPPED hole is the same defect, not a new row). Latent today; **a blocker the moment a 3rd scenario (1788/1800) ships** — so this rides with E1. **Resolve together with QW10 (DH-30 min-floor) + DH-2 + divergence #4** (one scheduling surface, at E15). | — | XS | bug BUG-1 (`fed` 521-535; **`rep1800` §A 2668 LIVE-confirms**), DH-2 (`modern` 2221) — CARRIED + EXTENDED, HI-CONF (2 era) | ready |
| QW2 | **BUG-3 — no-PM-General fallback guard** | Defensive guard on the `GeneralInChief` fill path (`phaseRunners.ts:2255`): empty-pool ⇒ leave vacant + log (or auto-generate a stopgap officer — ties to E8 procedural pol gen). Closes a potential crash. | — | XS | bug BUG-3 (`fed` 5, 119) — CARRIED | ready |
| QW3 | **±3-per-phase meter-swing clamp (meter-model divergence; now confirmed live by `drums` #80)** | One-helper change: clamp every `NationalMeters` write to ±3 per phase (`types.ts:1399`). **Batch 5 extends this:** apply the same clamp to **cabinet ideology net-swings** and **per-phase ideology swings** at the same chokepoint (#80, `drums` POST 4574 — a live designer patch). Orthogonal to the full named-ordinal relabel (parked) and to E6's crisis/cascade rules (which build on it). Cheap balance/feel win. **★ Batch-11 — the ±3 cap is now UNCONDITIONALLY READY (no longer gated on any fork).** Batch 10 flagged the cap as the "settled half" of the #18/#51 fork; the `arkzag` continuation then **RESOLVED the #51 enthusiasm-SHIFT step** (the 4-step rule, verbatim `drums` — now at **E23, `ready`**), so the cap binds with no open dependency. **This QW3 clamp on `NationalMeters` writes is buildable NOW**, and the same ±3 cap on ideology+party-pref swings **ships with E6 at `calcStateVote` `phaseRunners.ts:3709-3711`** (which today applies enthusiasm UNIFORMLY with **NO ±3 cap and NO per-state penalty**). **The ONLY piece still BLOCKED on a human pick is #18's meter→election STATE SCOPE** (every-state-unless-penalized vs ideology-leaning-states-only — recorded under "Decision-gated", folds into E20/E23); the cap itself and the enthusiasm-SHIFT engine are NOT gated. | — | XS | meter model §21.8/§22.1/§22.2 (`1772s`; `modern`; **`drums` #80 POST 4574**) + **#51 ±3 cap settled (`dem1820`; `arkzag` ch33 2438-2456)** — CARRIED + EXTENDED, HI-CONF | ready |
| QW4 | **Auto-Carpetbagger on alt-state moves (divergence #2)** | Replace the 4-step probability ladder with auto-grant on a successful alt-state relocation; add 10-year expiry + exempt alt-state moves from the relocation cap (now 4/half-term after QW0). More legible; removes a dead dial. | QW0 (the cap value) | XS | gap #38, divergence #2 (`gilded` 36; `1772s` 3-52; `modern` 147; `hd` I-1; **`drums` POSTS 2627, 2630-2634, 2755, 7465 add the per-roll % table + recent-state filter**) — HI-CONF (5 era) | ready |
| QW5 | **DH-3 — bar career-track pols from the presidency** | Add a guard at presidential-candidate eligibility (and CPU presidential selection) so career-track pols can't run — closing a GM-acknowledged rules gap (career-track is already barred from Gov/Rep/leadership/Kingmaker). Relates to the primary (E22) but is a cheap standalone guard now. | — | XS | DH-3 (`hd` 8205-8219; relates to #63) — CARRIED | ready |
| QW6 | **DH-5 — Kingmaker-pairing dissolution on flip** | A rule in the conversion path: converting/flipping a Kingmaker no longer seizes his protégés (or their +1 election standing) — flagged "insanely OP." Same code area as Reconstruction amnesty (E3b prunes broken Kingmaker pairs). Cheap balance fix on shipped Kingmaker/conversion machinery (`KINGMAKER_RULES` `types.ts:295`, `CONVERSION_ODDS` `:268`). | — | XS–S | DH-5 (`hd` 7589, 8762; relates to #29/#30) — CARRIED | ready |
| **QW7** | **#85 — 5%/half-term retire/death + mandatory military-officer retire at 75** *(batch 5)* | A 1-line refinement of `MORTALITY_RULES` per-era table (`types.ts:485`): per-half-term **5% retirement/death roll for senators + cabinet** + mandatory **military-officer retire at 75** + ~10% baseline cabinet-decline roll. Tyler patched this mid-run (POST 5437) to solve CPU stagnation in long campaigns. **Pure tunable; no shape change; cheap.** | — | XS | #85 (`drums` 2493, 5437, 6469) — CARRIED | ready |
| **QW8** | **DH-24 — Senate-class verifier at K4 boot pipeline** *(NEW, batch 6)* | A one-helper `validateSenateClasses(snap)` that, at scenario-boot time AND at `loadStandardDraftClasses` (`standardDraftClasses.ts:13`), checks each sitting senator's last-election year against their assigned Senate class (I/II/III) and flags mismatches. `pop` POST 272/297/298: a fresh modern boot's seed data had Ron Johnson (WI) up in 2010 instead of 2012; GM had to swap classes mid-election. **One pure validator helper, run at K4's boot pipeline.** Lands at the K4 boot pipeline (does NOT require K4 to be fully built — can ship as a standalone helper now, then wire into the `scenarioBoot` pipeline when K4 lands). **★ Batch-10 — corroborated AGAIN from a 4th start year:** `dem1820`'s 1820 boot/sheet data shipped with wrong Senate-class assignment (`scenario1856.ts:86` does a naive assign; the 1856-hardcoded rotation lives at `phaseRunners.ts:3885`), so the validator is now a 2-start-confirmed XS boot-pipeline check — it belongs **inside** `scenarioBoot` (#115), not just adjacent to it. | — (helper); wires into the `scenarioBoot` pipeline (#115) when K4 lands | XS | DH-24 (`pop` 272, 297, 298; **`dem1820` reconfirms** — naive assign `scenario1856.ts:86`, rotation `phaseRunners.ts:3885`) — NEW + RECONFIRMED, HI-CONF (2 start) | ready |
| **QW9** | **DH-27 — `TRAIT_CONFLICTS` validator at dataset/boot import** *(NEW, batch 6)* | A one-helper `validateTraitConflicts(snap, dataset)` that runs `TRAIT_CONFLICTS` (`types.ts:658`) against `snap.politicians[]` at scenario-boot AND against the loaded dataset at `loadStandardDraftClasses` (`standardDraftClasses.ts:13`). Today `TRAIT_CONFLICTS` is consulted only on **trait-ADD events**, not on dataset/boot import — so boot/seed data can ship a pol with both `Integrity` AND `Controversial` (`pop` POST 1139: Quinn). **One pure validator helper.** Same pattern as QW8 — can ship now as a standalone helper, then wire into the `scenarioBoot` pipeline (#115). **★ Batch-10 — reconfirmed:** `dem1820`'s boot/sheet data again shipped trait-conflict + demographic corruption, so this validator belongs inside `scenarioBoot` alongside QW8. | — (helper); wires into the `scenarioBoot` pipeline (#115) when K4 lands | XS | DH-27 (`pop` 1139; `types.ts:658`; **`dem1820` reconfirms**) — NEW + RECONFIRMED | ready |
| **QW10** | **DH-30 — event-scheduler MIN floor (+ spill-to-anytime)** *(NEW, batch 7 — BUG-1's companion)* | The era-event scheduler has a **MAX per half-term but no MIN floor** — over a 20-yr era a 25%-event ≈94% cumulative, but a low-% era can fire *zero* events some playthroughs. `rep1800` POST 2918-2932: *"the limit is a max not a min… which isn't what we discussed."* **Agreed fix: minimum = 20% of the era's max (round down)**; if still none fire (all prereq-gated), **spill to the current 5 generic anytime events**. (A rejected alt — hard year-windows per event — was declined because *"events not happening every playthrough has been explicitly stated to be how the game operates"*, load-bearing for alt-history.) **Same scheduling surface as BUG-1 + divergence #4** — land it alongside QW1 / at E15. Small, additive; no new save shape. | — (pairs with QW1; full scheduling fork resolved at E15) | XS | DH-30 (`rep1800` §A 2918, 2919-2932; companion to BUG-1) — NEW | ready |
| **QW11** | **DH-43 — Vermont home-state mapping (dataset/data fix)** *(NEW, batch 8 — ★ batch-12 ABSORBED into the #120 dataset umbrella)* | Vermont-origin pols have **no home-state mapping**, so they cannot relocate "home" (`new1772`). **A pure dataset/data fix:** ensure VT's `homeStates`/region wiring exists. **★ Batch-12 — this row is now ABSORBED into the #120 `smallbugs` dataset umbrella (NEW Phase-1 row below):** the batch-12 #120 coordinated `scripts/seedDataset.mjs` `CURATED_ROWS` pass covers DH-43 alongside ~100 other dataset items + DH-51 + DH-28. **Kept here for traceability; ship as part of #120, not as a standalone QW.** | — | XS | DH-43 (`new1772`; relates to relocation/Carpetbagger) + **★ batch-12 ABSORBED into #120 umbrella** — CARRIED + ABSORBED | ready (ships with #120) |
| **QW12** | **★ batch-12 #135 — 50/50 House inverse-control rule (one-line edit, `tedchange#POST 65`)** *(NEW, batch 12)* | **One-line edit at `phaseRunners.ts:1864`.** Today `runPhase_2_2_1_CongressLeadership` computes `houseMajority = houseBlue >= houseRed ? 'BLUE' : 'RED'` (`:1863-1864`), which **silently defaults to BLUE on a 50/50 tie** — a real shipped bug. Ted's `tedchange#POST 65` rules: **a 50/50 House → leadership (Speaker + committee chairs) goes to the party that does NOT control the Senate.** Replace with: `houseMajority = houseBlue === houseRed ? (senateMajority === 'BLUE' ? 'RED' : 'BLUE') : (houseBlue > houseRed ? 'BLUE' : 'RED')`. **XS one-line edit; ship with QW0 + Phase-1 #19 small consistency.** **RULED by Ted (`tedchange#POST 56-65`).** | — | XS | gap **#135 / `tedchange#POST 56-65`** — NEW | ready |
| **QW13** | **★ batch-12 #131 — Integrity-pol cannot nominate Controversial-pol (filter helper, `tedchange#POST 277`)** *(NEW, batch 12)* | **One trait-aware filter helper used by every nomination/appointment path** (cabinet `phaseRunners.ts:2158`; CJ ladder; ambassadors; CC delegates; FL elections). Ted's `tedchange#POST 277` rules: **an Integrity-trait pol CANNOT nominate a Controversial-trait pol to any office** (CPU + human). **Tied to the cabinet & SCOTUS work (E16 + E25)** but the helper itself is XS and ship-immediately. **RULED by Ted (`tedchange#POST 276-278`).** | — | XS | gap **#131 / `tedchange#POST 276-278`** — NEW | ready |
| **QW14** | **★ batch-12 #132 — Challenge-Legislation Gov Action cannot target a REPEAL bill (filter, `tedchange#POST 248`)** *(NEW, batch 12)* | **One filter on the Challenge-Legislation Gov Action's target list** (built at E11 / E25). Ted's `tedchange#POST 248` rules: **a Gov-Action Challenge-Legislation cannot target a repeal-bill** ("we just don't allow it. There isn't a direct real world example we can cite"). XS as a target-list filter — **build-target constraint on E11 / E25, ship the filter helper now.** **RULED by Ted (`tedchange#POST 246-248`).** | — | XS | gap **#132 / `tedchange#POST 246-248`** — NEW | ready |
| **QW15** | **★ batch-12 #139 — Pres signature step lives in 2.6 (NOT 2.10) — phase-sequence reorder (`tedchange#POST 126`)** *(NEW, batch 12)* | **XS phase-sequence reorder in `src/phases.ts`** so military bills affect Mil-Prep BEFORE 2.7 Military Action. Ted's `tedchange#POST 124-126` rules: **Pres signature lives in 2.6** (not 2.10) so signed military bills affect Mil-Prep in time. Folds into Phase-1 #2 (bill typing + spending cap) + Phase-1 #14 (legislative micro-mechanics), but the reorder itself is XS and standalone. **RULED by Ted (`tedchange#POST 124-126`).** | — | XS | gap **#139 / `tedchange#POST 124-126`** — NEW | ready |
| **QW16** | **★ batch-12 #141 — FL trait gain rates 5% positive (per cycle) / 3% negative (first-time-as-FL only)** *(NEW, batch 12)* | **XS — refines the existing FL trait-gain const.** Positives roll **5% per cycle as FL**; negatives roll **3% first-time-as-FL only**. Ted's `tedchange#POST 79` refines `cf82a7d3 §5a #4` (which was "MOSTLY ADOPTED" without rates). Pure const refinement. **RULED by Ted (`tedchange#POST 73-79`; refines `cf82a7d3 §5a #4`).** | — | XS | gap **#141 / `tedchange#POST 73-79`** — NEW | ready |
| **QW17** | **★ batch-13 #143 — post-election Command decay ("shit or get off the pot") (NEW pass, `oopscpu#POST 224`)** *(NEW, batch 13 — RULED, tested live)* | **XS — one new pass at one known site.** After every presidential cycle closes, **every living politician who did NOT run for President or VP has a 40% chance of −1 Command.** Ted's marquee `oopscpu` proposal (floated POST 1), **RULED + TESTED LIVE** at POST 224 ("Politicians who don't run for President have a 40% chance of losing −1 Command after the Presidential election" — hit Gerry→0, Pinckney→2, Hancock→2). Purpose: stop Command piling up on pols who never contest the presidency, keeping the candidate pool meaningful (pairs with #72 candidate-selection + #136 "Presidents should come from somewhere"). **Binds at `runPhase_2_10_End` (`phaseRunners.ts:4171`), gated on `isPresidentialYear`, AFTER the 2.9.4 ticket roster is known** (so it can exclude Pres/VP candidates); applies via the existing `loseCommand` (`abilities.ts:15`). Pairs with #85/#130 death-schedule discipline (same `runPhase_2_10_End` site). Pin the 40% / −1 rate. No dependency; ship with the QW0 / XS-consistency cluster. **RULED by Ted (`oopscpu#POST 1, 224`).** | — | XS | gap **#143 / `oopscpu#POST 1, 224`** — NEW | ready |

---

### Engine track — Phase 0 (keystones)

**`K0 → (K1 ‖ K2 ‖ K3) → K4 ‖ K5`.** After K0, K1/K2/K3 are independent and
parallelizable across PRs; K4 depends on K3. **K5 is a new late-keystone (batch
5)** — sits after K0 + K2, parallel with K3/K4 + federalism (§9.1.3). K2 remains
the single most important keystone (~6× leverage) — **do it first if only one
lands**, because K5 depends on it (most handlers pick from a registry).
**Batch-4: per-era point BANKING (#68) is folded into K3/K4 — not a new item.**
**★ Batch-7: the era-model reframe RE-SPECS K3 + K4 — NOT a new keystone** (§9.1.5
/ divergence #18). `advanceEra` becomes condition-driven (game-state / meter /
TERRITORY, per half-term — no `target` arg); content gates on `game.eraBand` + a
new `territoryOwned` predicate, not the calendar; early sub-bands are content-band
markers. **No new keystones this batch.** See the updated K3 + K4 rows.
**★★ Batch-8: K3 + K4 are now MULTI-SAVE PROVEN — the HIGHEST-confidence large bet
in the roadmap** (§9.1.5 batch-8 confidence bump). Two independent saves —
`tea1772` (1772-start) and `rep1800` (1800-start, 28 in-game years apart) — emit
the **identical era-band sequence at identical in-game dates** (game-context #102),
so the content-band model is **settled, not speculative**. **Nothing structural
changes** (the K3/K4 spec was already condition-driven from batch 7); this is a
**confidence/priority raise only** — if engine staffing is scarce, K3/K4 are the
safest era investment to start. **#102's dual era-scoring (per-era winner +
cumulative "winner so far") is the WIN-CONDITION scoreboard** — it folds into
K3/K4's per-era point-banking (#68 banks the cumulative total; the win condition is
**DUAL**), NOT a new item. **No new keystones this batch either.**
**★★ Batch-9: K3/K4 are now 3-START-CONFIRMED (1772 + 1800 + 1948) and gain a
TWO-LEVEL refinement + a structured-era-event-data requirement — still NOT a new
keystone, NO re-sequence** (§9.1.5 updated, BINDING). The band model holds across a
THIRD start year (1948, `nuke`), and `nuke` splits it into **two distinct,
separately-fired mechanics that an earlier extractor conflated — BOTH must be built;
do NOT collapse them:** **(a) point-banked Historical Eras** (the #92/#68 content-band
mechanic) that carry **RULE-DELTAS, not just content** (the Era-of-Terror cabinet
rework — region stops mattering, replaced by diversity + faction-balance checks — is
the proof bands change rules); **(b) within-era decade/census boundaries** = a
**separate, schedule-fired** per-decade `AMPU Census` doing **bulk EV reallocation +
wholesale state-bias re-lean + content rotation** — distinct from #68's per-era
bias-table swap (it fires on a 10-yr calendar schedule WITHIN a band). PLUS **K4's
era-event data needs STRUCTURED `evDelta`/census fields (DH-48)** + per-era
completeness validation (the Neocon census/EV-delta events were LOST as free-text
flavor). **Logged correction: "Neocons"/"Corporate Republicans" is a FACTION REBRAND
(~1980), NOT an era band** — do not promote any faction nickname to a Historical Era.
These land **entirely inside K3 (the census-as-a-second-schedule + the rule-delta
hooks) and K4 (the structured era-event data + validators)** — no new keystone, no
re-order. See the updated K3 + K4 rows.
**★ Batch-9: K2 confidence — the per-half-term phase loop is now corroborated at
~25 sub-phases** (`nuke` walks the full 2.1.x→2.10 loop a 4th time across a 1948
campaign), reinforcing that the ActionRegistry (K2) is the right shared host for the
six+ action libraries the loop drives. No scope change; confidence only.
**★ Batch-9: K5 is now LOAD-BEARING, not optional/late (§9.1.3 priority bump,
BINDING).** `nuke` carries the designer's strongest design-intent statement (#114,
§28.12): the **APP is built for 1-human-vs-9-CPU** (multiplayer "goes off the rails";
the points system is for the CPUs, not humans). The app is a **solo adaptation of a
multiplayer game**, so the ENTIRE multiplayer apparatus (party-leader elections,
conversions, kingmaker pairings, committee assignment, cross-faction endorsements,
forced 3rd-party runs, the whole convention) **must be CPU-AI-driven** — and `nuke`
confirms that surface was **entirely UNEXERCISED** by the human playtest (it must be
authored from spec). **This does NOT re-sequence K5** (it still lands after K0 + K2,
parallel with K3/K4 + federalism) — but it raises K5 + the handler suite (E9) from
"force-multiplier" to **the load-bearing system that makes the product playable solo
at all.** Treat the handler suite as a first-class Phase-1 system.
**★★ Batch-10: K4 absorbs the `scenarioBoot(BootSheet)` PIPELINE — the most-requested
missing item (#115) — at the FRONT of the subsystem queue; still NOT a new keystone,
NO re-sequence** (§9.1.9, BINDING). `dem1820` records that **there are NO documented
rules for CREATING a game** — and verified shipped-state has NO shared boot
abstraction (`startNewGame` `GameContext.tsx:264` switches a literal into hand-
authored builders; `scenario1856.ts:44-214` seats Congress with raw `Math.random`).
So **build one pure `scenarioBoot(BootSheet): FullGameSnapshot` pipeline inside K4's
`BootSheet` schema**, in dependency order **K0 (seed boot rolls) → `scenarioBoot` +
`BootSheet` (with K4) → every scenario becomes a data row** — and build it **WITH the
first new scenario (`scenario1788` / E1), before the third hand-authored copy-paste.**
It is the venue for the XS boot validators (QW8/QW9) + the appointment-ladder
(#115b). See the updated K4 row.
**★ Batch-10: K3/K4 are now 4-START-CONFIRMED** (1772 `tea1772` + 1800 `rep1800` +
**1820 `dem1820`** + 1948 `nuke` all emit the band model — `dem1820`'s draft table
prints "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)", POST 946).
**Confidence bump only — no scope change, no re-order.**
**★ Batch-11: K3/K4's #92 model is now LIVE-EXERCISED end-to-end** — `arkzag` (the same
1820 save run forward to 1840) plays the era/territory content-gate live: the **tariff-
rate-change cooldown to 1836** (POST 928), **Minister-to-Japan creatable by exec action
ONLY in the Manifest-Destiny era** (POST 359), "military academy"/"state university"
gated to later eras (ch5) — AND it surfaces the **concrete defect that the territory
filter is MISSING** (DH-60: "Force Open Trade with Japan" fired with no Pacific port;
"Stubborn Cherokee" without owning the territory, POST 335-340), which lands as the
`requires?: Predicate` era-event gate at **E15 + BUG-1** (reusing K3's `territoryOwned`
predicate). **Confidence bump + DH-60 placement only — no scope change, no re-order, no
keystone move.**

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| K0 | **Seed the RNG** | Drop a real PRNG (mulberry32/xoshiro) into `rng.ts:5`; store `seed` + state on `GameState` (optional + `repair()` backfill); migrate the **14** raw `Math.random` engine calls (election jitter `phaseRunners.ts:3711`, generic-war `:3603`, draft fallback `:188-198`, `revolutionaryWar.ts:89,97`, `continentalCongress.ts:271`). Keep wrapper signatures. | — | S–M | debt #1–#3 (determinism prereq for multiplayer + replay + **K5 deterministic tie-breaks**) — CARRIED | ready |
| K1 | **`State.policies` + `State.electionMethod` data shapes** | Two additive `State` fields (`types.ts:1318`): `policies?: Partial<Record<StatePolicyId, StatePolicy>>` (Poll Tax/Jim Crow/Prohibition/Women's Suffrage/Segregation; `multiplierUntilYear`) + `electionMethod?: 'popular'\|'legislature'`. `repair()` backfill `{}` / `'popular'`. Extend `Predicate` with `{ statePolicyActive }` + `{ electionMethodIs }`. **Reads from the K5 governor handler (DH-19 / handler 9j) to prune no-op actions.** | K0 | XS | gap #21 (`gilded` 125; `modern` 25-2245; **`drums`** confirms; **★★ `gild1868 (b14)` corroborates #21 extensible state-flag registry from a native-1868 start**) + #44 (`fed` 194-373) — CARRIED, HI-CONF (native Gilded) | ready |
| K2 | **`ActionRegistry<Ctx>` keystone + `requires?: AmendmentPredicate` from day one (batch 6 / divergence #16)** | Define `GameAction<Ctx>` + `ActionRegistry<Ctx>` once in `src/engine/actionRegistry.ts` (one ~80-line type covering id/label/`isAvailable`/`resolve`/`persistence`) + one UI Action Picker + one JSON-serializable persistence shape. Used by **six+** action libraries (governor/exec/diplomacy/convention-inter-ballot/primary/general — plus the Reconstruction readmission-plan + secession-trigger rows at E3b). **~6× tax if built ad-hoc — the highest-leverage keystone.** **Hard prerequisite for K5** — most CPU handlers pick from a registry library. **Batch 6: the `GameAction<Ctx>` shape gains a `requires?: AmendmentPredicate` field from day one** (divergence #16). One extra field + one filter step in the picker reading `game.amendments.passed`. Canonical instance: the general-election action "Send VP to Shore Up Support" requires the 12th Amendment. Same `requires:` mechanism gates bill catalog entries (income-tax category) + gov action rows; predicate lives at the registry-row level, not the library level. **Cheap if early, expensive if retrofit** across 6 libraries. **Resolve DH-9 (canonical action ability-stat) before the `resolve` signatures harden.** | K0 | S | §6.6 (now confirmed **5 eras**; `hd` adds the Reconstruction/exec rows; `drums` raises the consumer count to 6+; **`pop` POST 951 adds `requires?` field for divergence #16**) + DH-9 — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| K3 | **`advanceEra(snap)` — CONDITION-DRIVEN (batch 7, ★ re-specced) — + era-content registry + content-band gating + per-era point BANKING (#68)** | Replace the hard-coded `currentEra = 'federalism'` in `constitutionalConvention.ts:198` with a pure callable transition. **★ Batch-7 reframe (the key change vs. the prior K3 spec): the era boundary is GAME-STATE / METER / TERRITORY-driven, evaluated PER HALF-TERM — NOT a year boundary** (§9.1.5 / divergence #18). `advanceEra` takes **no `target` arg** — it watches an `era.advanceWhen(snap)` condition (the early-republic bands advance on game-state + territory ownership; the Constitution-ratifies trigger at `:198` becomes the **first such condition**, not a hard-coded line). Verified: phases gate by `year % 4` / `year % 2` (`phases.ts:49-59`) — those are **correct for CADENCE and STAY**; there is **no year→era derivation anywhere** (`currentEra` is a plain field), so this is a **generalization of the one existing trigger, not a rewrite**. **★ Gate all content (bills / era-events / draftees / bias-table) on `game.eraBand` + a NEW `territoryOwned` predicate, NOT literal year** — un-owned-land content is invalid (Louisiana-born pols un-playable until LA is owned; this is the mechanism that *forces* `rep1800`'s ~30-yr content lag). **One new `territoryOwned(snap, requirement)` predicate** (a `Predicate` variant + one `evalPredicate` case at `eraGraph.ts:12`), **three consumers** (bill catalog, era-event walker, draft pool — the draft pool also excludes pols whose state/territory is un-owned/unorganized, = §27.5's gate). **The bank-and-zero boot pipeline (#68) fires AT the content-band boundary wherever it lands on the calendar:** bank the running per-era `Faction.score` into `eraPointBanks?: Record<Era,…>` + zero the running total, pay end-of-era awards, re-run pre-turn phases (2.1.x→2.3.1), swap content pools (card-pool + per-era card-count rescale, draft profile, SCOTUS set, nation renames, party-formation, **per-era state-bias table wholesale**). The per-era banks **sum toward the (open) cross-era win total**. Lift the **5** `ERA_GRAPH_1772` spots in `eraGraph.ts` (`:4,:73,:113,:148,:164`) to `ERA_GRAPHS: Record<Era, GraphNode[]>`. **No new top-level field beyond an optional `game.eraBand` marker (can reuse `currentEra`).** **RECONCILES #68 point-banking + §26 BootSheet boot model + §27.1 content-band finding into ONE era system** (debt #5/#9 dissolve here). **★ Batch-8 — MULTI-SAVE PROVEN (HIGHEST confidence, no scope change):** the content-band sequence is corroborated by TWO independent saves (`tea1772` 1772-start + `rep1800` 1800-start, 28 in-game years apart, identical bands at identical dates — #102), so the condition-driven model is settled, not speculative. **The per-era banks feed the DUAL win-condition scoreboard (#102): a per-era winner AND a cumulative "winner so far"** — the bank-and-zero already computes both (the running total is the cumulative scoreboard), so this is a labeling/exposure concern, NOT new banking logic. **★ Batch-9 — TWO-LEVEL refinement (3-START-CONFIRMED; §9.1.5), still inside K3:** the era model has **two distinct, separately-fired mechanics — build BOTH, do NOT collapse them.** **(a) The point-banked Historical Eras (the `advanceWhen` content-bands above) carry RULE-DELTAS, not just content** — the Era-of-Terror cabinet rework (region stops mattering → diversity + faction-balance checks) proves a band can change *rules*, so the boundary pipeline must support per-band rule-delta hooks, not only pool/bias swaps. **(b) A SEPARATE per-decade `AMPU Census` mechanic, schedule-fired (NOT a band boundary):** every ~10 in-game years it does **bulk EV reallocation vs the prior census + wholesale state-bias re-lean (Blue5..Tossup..Red5) + content rotation** (draft pool / lobby cards / era-activated industries) — distinct from #68's per-era bias swap (which fires at a band boundary). The census needs a per-state population model + House cap (parking-lot DH-49) before it can compute EV deltas. **Era CONTENT (events/SCOTUS docket) fires on yet a THIRD clock — a scripted ~5%/phase schedule decoupled from in-game history (#109)** — reinforcing §6.4: bands gate on game-state, the census fires on a 10-yr schedule, content fires on its own clock. **Logged correction: "Neocons" is a faction-rebrand at a census boundary, NOT a band — do not model it as one.** | K0 | M | gap #2 (`fed` 11,518; `modern` 1080,1172; `hd` I-12, 6679-6816) + **#92 (`rep1800` §B 4329, 5082, 5255-5256, 5602, 5828-5837; §A open-Q 1)** + **#102 multi-save proof + dual-scoring (`tea1772` 21/62/91/130/153 + `rep1800` 92/6201)** + **#106/#109 two-level + content-clock (`nuke` §27.1/§28.9)** + **#92 4th-start corroboration (`dem1820` POST 946 — "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)")** + #68 (banking) + divergence #18, debt #5/#9 — CARRIED + RE-SPECCED, **4-START-CONFIRMED (1772/1800/1820/1948), HIGHEST-CONF (4 independent saves / 7 era)** | ready |
| K4 | **Era enum growth + `scenario1788` + era-keyed tables + the `BootSheet` schema + the per-era CONTENT-BAND registry (batch 7, ★)** | Add the era value(s) the timeline needs — `gilded`/`progressive` between `nationalism` and `modern` (`Era`, `types.ts:1337`); fill every `Record<Era,…>` table the TS exhaustiveness check flags. **First new scenario is `scenario1788`, NOT gilded/modern** (§9.1.1): a mid-government boot on the `scenario1856` template (`scenario1856.ts:177-193`) — pre-seated Washington admin, start at phase 2.1.2. New files: `scenario1788.ts`, `factions1788.ts`, `states1788.ts`. Per-(faction, era) `FACTION_DRAFT_PROFILES`. **Era-keyed tables:** rookie draft-grant (#69: 3 traits + 3 alt-states; reverse-PV order + pick-position bonuses); amendment-ratifier/threshold stub (#64); **double-points-issues per era (#87 — Populism: Climate Crisis + Immigration); procedural-pol-gen `startYear` per era (#90 — Populism: 2020).** **Batch 6 — the `BootSheet<{era, startYear, factions, sittingGovernment, stateRoster, decks, …}>` schema.** Three documented mid-government boots (1788 designed / 1856 shipped / 2012 designed) share ONE shape: pre-built 5 Blue + 5 Red faction roster + per-faction archetype politicians + era-tuned ideology/interest/lobby decks + sitting government keyed to start year + **state roster keyed to `{era, startYear}`, NOT era alone** (same `modern` enum has BOTH the 50+DC fresh-boot roster AND the 53-state Wyoming-Rule continuation roster) + EXPLICITLY EMPTY baselines (no faction leaders at boot, no career-track pols, no inherited PV/legacy/Kingmaker pairs) + the generic-Major-candidate fallback for the first primary (1 command + matching ideology + matching interest/lobby). **Build the schema ONCE, instantiate per era.** Era identity is **data configuration**, not a code path (R1's "Trumpism" deck is the seed configuration of one faction, not a "Trumpism mechanic"). **★ Batch 7 — the era-content registry is the HOME of the CONTENT-BAND model** (§9.1.5 / divergence #18): each era is a `{bills, eraEvents, draftees, biasTable, advanceWhen}` record (the `advanceWhen` condition + the `territoryOwned` content-gate live here, consumed by K3). **The early-republic sub-bands (Republicanism / Democracy / Manifest-Destiny) are content-band MARKERS on the game-state gate, NOT new enum values** unless rule tables genuinely diverge from `nationalism` (open Q; tech-lead's call: **markers first** — cheapest, no exhaustiveness cascade; the shipped 4-value enum stays, `gilded`/`progressive` remain the two values K4 adds because *those* have divergent rule tables). **★ Batch-8 hard guard (NEGATIVE RESULT): K4 adds EXACTLY `gilded` + `progressive` — NO "future" era.** No ingested thread reaches a post-Gilded/post-modern era (`tea1772`, titled "…to future," stalls at 1874 mid-Gilded; `hd`/`drums`/`pop` top out at Gilded/Progressive/Populism), so there is **no source and no build target** for a future era — do not add an enum value for one. The **per-era state-bias table swaps in wholesale at the boundary** (#68 step 6 — pairs with DH-34's static-bias decision: ship static per-band tables). Wire **QW8 Senate-class verifier (DH-24)** + **QW9 `TRAIT_CONFLICTS` validator (DH-27)** into the boot pipeline. **★ Batch-9 — STRUCTURED era-event-data requirement (DH-48, §28.9), lands here:** era-event content rows must carry a **STRUCTURED `evDelta`/census field (not free-text)** + **per-era completeness validation** so a 10-yr census reallocation (K3 level (b)) always fires — the whole Neocon census/EV-delta event block was LOST in the source spreadsheet *because* the events were free-text flavor (stored alphabetically-by-era; EV-change events lacked the token "EV" → unsearchable → mis-moved to the wrong band). The typed field lives on K4's era-content registry; the completeness check lives at the dataset-build validators (sibling to QW8/QW9). **★ Batch-9 — `scenario1948` is a FOURTH `BootSheet` boot shape** (alongside 1772 / 1856 / 2012): a Cold-War mid-government boot (Truman/Barkley seated, **48 states** with AK/HI arriving as statehood bills, 5R/5B with **Dixiecrats INSIDE Blue + Reagan-a-Democrat** [the realignment start], the full modern+Cold-War cabinet incl. **Ambassador to the USSR**, a ~6-yr era→year clock offset). The schema is unchanged — `scenario1948` is one more instantiation; the *content* instantiation itself is the Phase-2 capstone E30. **★ Batch-10 — the shared `scenarioBoot(BootSheet)` PIPELINE is PROMOTED to the front of the subsystem queue (#115 / §9.1.9), and it FOLDS INTO this `BootSheet` schema — it is NOT a new keystone.** `dem1820` records the **single most-requested missing item in the forum's own words: there are NO documented rules for CREATING a game.** GA setup is improvised — verified shipped-state has **NO shared boot abstraction**: `startNewGame` (`GameContext.tsx:264`) switches on a literal into hand-authored `build1772Scenario`/`build1856Scenario`; `scenario1856.ts:44-214` seats Congress with raw `Math.random`, naive Senate-class assignment, full `EV-2` House reps, a 47-field `GameState` literal; no career-track seeding, no Command-stripping. So **build ONE pure `scenarioBoot(BootSheet): FullGameSnapshot` pipeline** that canonicalizes the deterministic setup algorithm the GA invents per game: the **strip-Command decision** (the contested "≤40 boot pols w/o a job lose Command" house rule — `dem1820` POST 82; a boot-pipeline policy), the **inaugural career-track seed from the LAST-3 draft classes** (the 1820/1816/1812 classes, POST 28 — pairs with DH-25), **era-keyed industry init for new states** (NOT 0, POST 532), **Senate-class assignment + the QW8 verifier**, **vacant-seat appointment-fill via the appointment-ladder** (#115b), and the **5+5 ideology ladder + era-tuned decks**. **Dependency order is LEGIBLE: K0 (seeds the boot rolls — drop the raw `Math.random` Senate/Congress seeding) → `scenarioBoot` + `BootSheet` (built HERE, with K4) → every scenario (1772/1788/1820/1856/1948/2012) becomes a DATA ROW fed through the one pipeline.** **★ Build it WITH the first new scenario — `scenario1788` (Phase-1 #1 / E1) — BEFORE the third hand-authored copy-paste of a scenario** (1772 + 1856 ship hand-authored today; `scenario1788` is the third — author the shared pipeline instead of copy-pasting `build1856Scenario` a third time). This is **also the venue for the XS boot validators** (QW8 Senate-class DH-24, QW9 trait-conflict DH-27 — both now confirmed wrong AGAIN in `dem1820`'s boot/sheet data) **and the appointment-ladder** (#115b — own-party-not-CT → own-party-CT → opposite-not-CT → opposite-CT → generate; an XS rule on the boot/appointment path). **★ Batch-10 — the #92 era-band model is now 4-START-CONFIRMED** (1772 `tea1772` + 1800 `rep1800` + **1820 `dem1820`** + 1948 `nuke`; `dem1820`'s own per-faction draft-ideology table prints "Era of Democracy (1820-1840)" → "Manifest Destiny (1840-1856)", POST 946) — a **confidence bump only**, no scope change; the early-republic sub-bands remain content-band markers as specced. **★★ Batch-13 — the `scenarioBoot` pipeline gains a NEW boot-seed step (DH-61, S): seed ERA-ACTIVE WARS.** The all-CPU 1788 run **forgot the Northwest Indian War entirely** ("lmao we literally forgot", `oopscpu#POST 338-344`) — scenarios boot at peace today except the 1772 Rev War. Add a **`BootSheet.activeWars` field + a boot hook** that reads a start-year active-wars table (1788 → NW Indian War: active, 20%-loss, **War Score −2**; 1840 Seminole; 1856/1868 Apache/Navajo; 1972 Vietnam −10; 2012 War on Terror) and instantiates each running war over the generic `War` model (E3). **This is a HARD `scenario1788` (E1) prerequisite — it lands HERE, in the boot pipeline, WITH E1.** Pairs with #45 (war engine) + #86/#115 (scenario boot). | K3 | M–L | gap #2, #4, #41 (`fed`; `modern`) + #69 (`hd` 3, 2155) + #64 stub (`hd` I-9) + #86/#87/#90 (`pop` 1, 12, 17, 30, 45, 264, 699, 1031-1033) + **#92 content-band registry (`rep1800` §B 5140, 5608; `dem1820` POST 946)** + **#102 dual era-scoring = the WIN-CONDITION scoreboard (`tea1772` + `rep1800`)** + **DH-48 structured era-event data + the `scenario1948` 4th-boot shape (`nuke` §28.1/§28.9)** + **#115 scenario-boot pipeline + the boot-PROCEDURE spec (`dem1820` POST 1, 2, 28, 32, 82, 159, 532; `GameContext.tsx:264`; `scenario1856.ts:44-214`)** + DH-24/DH-27 + **★★ DH-61 boot-seed active wars / `BootSheet.activeWars` (`oopscpu#POST 338-344`) — a `scenario1788`/E1 prerequisite, lands in this pipeline** + #143 binds at `runPhase_2_10_End` (separate, QW17) — CARRIED + RE-SPECCED + EXTENDED, **4-START-CONFIRMED (era model), HI-CONF (5-boot pattern)** | ready (now carries the DH-61 boot-seed-active-wars step for E1) |
| **K5** | **`CpuController` scaffold (NEW, batch 5)** *(parallel with K3/K4)* | New directory `src/engine/cpu/` holding (a) `CpuController` orchestrator (`controller.ts`), (b) `CpuHandler<Ctx, Decision>` interface (`types.ts`), (c) shared deterministic tie-break utilities (`tiebreaks.ts`: `pickWeighted`/`pickByLowestScore`/`breakByPolId`), (d) two `repair()` backfills for the persistent state the architectural-gap handlers need: `GameState.cpuCommitments?: {…}[]` (DH-20 reciprocity ledger) + `GameState.recentScandalIds?: {…}[]` (DH-22 scandal cooldown). Plus a determinism test (registers a fake handler, asserts same seed → same decision). **~120 lines total.** The orchestrator itself is *runtime* — no save shape; only handler *outputs* hit the snapshot. **K5 unlocks the 15 follow-on CPU-handler PRs in §6.6.1 — the §25 spec has nowhere else to live.** It does **not** block scenario work (`scenario1788` + 1856-arc can ship with today's CPU stubs and upgrade together when the handlers land). **★ Batch-9 — LOAD-BEARING, not optional/late (§9.1.3 priority bump):** `nuke` carries the designer's strongest design-intent statement (#114) — the **APP is 1-human-vs-9-CPU**; the app is a solo adaptation of a multiplayer game, so the entire MP apparatus (party-leader elections, conversions, kingmaker pairings, committee assignment, cross-faction endorsements, forced 3rd-party runs, the whole convention) **must be CPU-AI-driven**, and `nuke` confirms that surface was **entirely UNEXERCISED** by the human playtest (author from spec). **K5's PLACEMENT is unchanged (after K0+K2, parallel with K3/K4) — its PRIORITY rises:** K5 + the E9 handler suite are now a first-class system, the difference between a playable solo game and not. | K0, K2 | S (~120 lines) | gap #70-#78 (§25 master) + DH-8 (the marquee unstable surface) + DH-20/DH-21/DH-22 (architectural gaps need persistent state) + **#114 APP = 1-human-vs-9-CPU (`nuke` §28.12)** + **★ batch-13 — the scaffold's `recentScandalIds?` backfill is now exercised by OC-1 (scandal-resignee cooldown, handler 9d) and the spec is `oopscpu`-validated** — NEW + ELEVATED + VALIDATED | ready |

### Engine track — Phase 1 (subsystems, dependency-ordered)

Ordered exactly per tech-lead §9.6 to minimize rework. The federalism /
early-republic epic (E1) is one spine; **E3b (Civil War / Reconstruction) is the
second — it completes the already-shipped 1856 scenario** and sits right after
generic war (E3) + K2, **not** behind federalism or the modern tail (§9.1.2).
**Batch-7 additions: E4 folds in the 12A legislature-elector toggle; new E4b is
the early-republic cluster** (slavery-flag+Cohens / Second Bank+Bank War /
statehood-by-bill+territory-gate); **new E5b (ideology-as-circle) is the
foundational central-helper refactor placed early** (§9.1.7). Rows **E6–E8** are
the **NEAR-TERM cross-cutting items the modern thread pulled forward** — not
modern-only. **E9 is the CPU handler suite — 15 lightweight PRs once K5 lands;
★★ E9 handler #2 is the gate on E3b's Reconstruction readmission half (DH-29).**
**Batch-8 fold-ins (no new rows, no re-order):** **#100** SCOTUS-overturns-an-
amendment + amendable-threshold → E5 (amendments) + E25 (SCOTUS docket); **#103**
presidential-vote modifier stack + era-issue list + **DH-42** meter-vs-lean balance
→ E20 (election-math/scoring); **#104** lone-ideology convention exploit → E9
handler 9e (guard); **#105** stat-collapse → forced resignation → E10b
(succession); **DH-38** late-ratification/"Rogue Island" window → E1; **DH-40**
SCOTUS-justice-count-not-packaged → game-STALL → E14b (packaging) + E25
(SCOTUS-establish guard), XS-S; **DH-44** post-12A legislature vote-count → E4 (the
12A toggle); **DH-39** all-human Convention deadlock + **DH-37** no pol-trading →
multiplayer/parking lot.
**★ Batch-9 fold-ins (no new rows, no re-order — CONFIDENCE + NEGATIVE-SCOPE + small
placements):** the "Cold War" is **NOT a new epic** — it is **E3 (generic war)
RELABELED + E12 (diplomacy) + content (data on K4)** (§9.1.8). The two REAL items
under the label are already on the roadmap and gain hard build-holes: **E3 must
RESOLVE — DH-47: wars NEVER end today (Korea ran ~2 decades) → build a real
resolution/peace path (couples to DH-12 white-peace) + ideally army/navy/air
BRANCHES** (army generals command navies today); and **E12 (diplomacy) is the real
modern foreign subsystem — 8 relation meters + ambassador actions + DH-46 downward
pressure (the US ends up allied with everyone) + DH-45 fix the USSR-collapse trigger
chain (stalls at a ~5% gate) + a Cold-War ≤Neutral cap on USSR/China.** **E16 extends
to CREATE-AND-ABOLISH cabinet seats** (DOE/DHS created, **Postmaster General
ABOLISHED**, HEW split — `Legislation.abolishesCabinetSeat?`). The **modern
election/institutional layer** folds into existing rows: **#105** stat-collapse →
forced resignation + **DH-54** impeachment/VP-vacancy/succession ruleset →
**E10b/E29** (DH-54 author-before-build); **legislated variable SCOTUS size +
excess-not-replaced (#112)** → **E25**; **#108** gradual 4-lever realignment +
**#110** modern election machine → **E20/E23**; **#113** Era-of-Terror content →
E30 (data). DH placements: **DH-50/53** era-event scheduling + bill-catalog → E15 /
E2; **DH-52** landslide-margin-cap (no close elections) → E20 balance; **DH-51**
modern pols OVERPOWERED/recency-biased → the dataset pipeline (`scripts/`); **DH-55**
3rd-party region-weighted PV + engine-is-2-party-hard-wired → E26; **DH-57**
convention holes → E10 / handler 9e. **`scenario1948`** continuation-boot content →
**E30** (a 4th `BootSheet` shape).
**★ Batch-10 fold-ins (no new rows, no re-order — PROMOTION + decision-gating +
small placements):** **#115 scenario-boot pipeline** → **K4** (the `scenarioBoot(BootSheet)`
pipeline, PROMOTED to the front of the subsystem queue, built with `scenario1788`/**E1**
before the third hand-authored copy; the venue for **QW8/QW9** validators + the
**#115b** appointment-ladder). **TWO decision-gated forks** (parking-lot "Decision-
gated"): **#52** player-controlled SCOTUS (docket → **E25** either way; control surface
gated) + **#18/#51** meter→enthusiasm→election (settled ±3 cap → **QW3**; binding-point
+ state-scope → **E20/E23**, gated). **Sized fixes:** **DH-53** structured bill-effect
tables → **E20** (+ K4's DH-48 `evDelta` shape), S; **DH-24** Senate-class validator →
**QW8** / the boot pipeline, XS; **#55** focus-Rep `(EV−2)/5` + seat-locked incumbency →
**E7** (scaling-wall b) + **E28** (census epic), M; **#59** statehood→sectional-crisis →
**E3b** (b) additive at `admitState`/**E21**, S; **#115b** appointment-ladder +
replacement-gains timing → boot/appointment rules (**K4**/**E16**, pairs with **DH-25**),
XS. **#92 era-band model** → 4-START-CONFIRMED (**K3/K4** confidence bump). **DH-36**
(2nd GA-burnout death) → NOT a row; the prioritization ARGUMENT for the upkeep-reducing
items (#115, #55, E7, K5/E9).
**★ Batch-11 fold-ins (ONE new small epic, two re-scopes, one fork resolved, two
bug-folds — NO re-sequence, NO new keystone, NO keystone moves):** **#116 economic
engine** → **NEW small epic `E4c`** (deps **E2 + E6 + E4b(b)**; built EMERGENT via a
`Bill.replaces` field + a `lockedUntilYear` tariff cooldown; placed below E6 to keep
top-to-bottom buildability), S. **#119 amendment lifecycle** → **RE-SCOPES E5**
(propose→committee→floor→governor-ratify→active + active-amendment-blocks-a-legislation-
class + un-bundleable), +S. **#61 succession** → **RE-SCOPES E10b** (VP-succeeds →
fill-VP [E5-gated] → acting-president action-divert roll + trait side-effect; the kill
trigger already SHIPS at `anytimeEvents.ts:232`/`phaseRunners.ts:2449`; the
line-of-succession/impeachment half stays parking-lot **DH-54**). **#51** → **PROMOTED
to E23 `ready`** (the `arkzag` 4-step reshuffle + −100/waiver, verbatim `drums`); the
**±3 cap is UNCONDITIONALLY ready and ships with E6 (QW3)** — only **#18 state-scope**
stays Decision-gated, joined by a **NEW delegate-class fork** (→ **E10** delegate sub-PR
+ **E24**). **DH-59** relations under-floor clamp → **E12** (XS, folds in with the
9-point scale). **DH-60** era-event territory/asset prereq → **E15 + BUG-1** (S, a
`requires?: Predicate` reusing K3's `territoryOwned`). **Corroborations** (multi-campaign
tags, not rows): #13/#111 → **E10**, #11 → **E14**, #44/#16 → **E4**, #52 → **E25**,
#92 → **K3/K4** (now LIVE-exercised). **DH-36** → still NOT a row; the meta-signal
FLIPS POSITIVE (no GA-burnout this thread — a **3-thread automation-reduces-upkeep
signal**, strengthens #115/#55/E7/K5/E9).

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E1 | **Federalism / early-republic era epic (`scenario1788` content + the early-republic subsystems + ★ batch-12 draft re-rules #136/#137/#138)** | A high-value epic — **batch 7 widens it to the federalism + early-republic (Republicanism/Democracy/Manifest-Destiny) content band.** Era-event spine (Compromise of 1790, Hamiltonian program, Whiskey/Fries, French-Rev wars, Louisiana Purchase), party-formation events (~1792; `Party.formedYear`/`eraName`), 10-faction roster + nickname relabel, Mod/Cons draft profile, federalism SCOTUS set (`scotusFederalism.ts`). **Must land with BUG-1 (QW1) + QW10 (DH-30 min-floor).** **The early-republic subsystems this band needs land at Phase-1 #4 (E4 12A elector toggle) + #4b (E4b slavery-flag+Cohens / Second Bank+Bank War / statehood-by-bill+territory-gate)** — folded out into their own rows below so they sequence after their keystones. Expect sub-PRs (event spine, SCOTUS set). **Independent of E3b** — build whichever finishes a playable scenario faster (§9.1.2). **Can ship with stubbed CPU handlers** — K5 wires in later. **Batch-8 (DH-38) — model a late-ratification / "Rogue Island" multi-year ratification WINDOW in the Constitutional-Convention era system.** **★ Batch-10 — `scenario1788` is the THIRD scenario, so this is where the shared `scenarioBoot(BootSheet)` pipeline (#115, in K4) is BUILT** — author the pipeline here instead of copy-pasting `build1856Scenario` a third time. The boot validators (QW8/QW9) + the appointment-ladder (#115b) wire in here. **★★ Batch-12 — the DRAFT RE-RULES land WITH the federalism boot (because draft logic is at scenario-boot scope):** **(a) #136 (`tedchange#POST 7, 47`)** — random skill on draft has **NO Command chance** (verify the existing pool exclusion at `phaseRunners.ts:187-197` — Command is the separate `command` field on `Politician`, not in the 6-base-skills boost pool today; this may be a no-op verification in the current code path, but pin the rule); **(b) #137 (`tedchange#POST 8, 10, 48`)** — **no cross-party draft**: pols enter at IRL party at draft time (age 25); add a draft-time assignment gate that pins a rookie's `partyId` to the dataset's IRL party + excludes cross-party drafting in `pickBestForFaction` (`phaseRunners.ts:33-53`); flip via 2.1.6 conversion only; **(c) #138 (`tedchange#POST 50`)** — **3 random traits + 3 random alt-states per draft** (SUPERSEDES the 5/5 reading from earlier digests); goes in the era-config table (§6.1 pattern) — also corroborated by #69 (1856-native re-rule). XS each. **RULED by Ted (`tedchange#POST 5-12, 15-22, 47-50`).** **★★ Batch-12 #133 (`tedchange#POST 211, 217-236, 277, 352-355`, game-mechanics §17.1.y) — 1st / 2nd CONTINENTAL CONGRESS COMPOSITION REWRITE (S):** verified `continentalCongress.ts` + `firstContinentalCongress.ts` handle the CC entity, but the **state-size delegate quota (Big=4, Medium=3, Small=2) is NOT in code today** (the firstCC builder uses faction-by-pol-count, not the size table). Ted's rules: **Big states (PA/MA/VA/MD) = 4 delegates**; **Medium = 3**; **Small (GA/RI/DE/NH) = 2**. **Pre-DoI ("1st CC"): faction with most pols in state picks delegates.** **Post-DoI ("2nd CC"): Gov picks delegates.** **Articles of Confederation:** prohibits consecutive election + 2/3 of states for legislation + UNANIMOUS for amendments. **PMG appointment goes through Domestic Committee in CC era** (`tedchange#POST 352-355`). Rewrite the CC composition rules at `continentalCongress.ts`/`firstContinentalCongress.ts` accordingly. Pairs with #43 + #92 (era-band transitions); corroborates `cf82a7d3 §4f`. **RULED by Ted (`tedchange#POST 211, 217-236, 277, 352-355`).** **★★ Batch-13 — TWO `scenario1788` PREREQUISITES land WITH E1 (NEITHER is optional for a 1788 boot):** **(DH-61, S)** scenario-boot must **seed era-active wars** — the all-CPU 1788 run forgot the **Northwest Indian War** entirely ("lmao we literally forgot", `oopscpu#POST 338-344`); add a **`BootSheet.activeWars` field + a boot hook in `scenarioBoot`** that reads a start-year active-wars table (1788 → NW Indian War: active, 20%-loss, **War Score −2**; also 1840 Seminole, 1856/1868 Apache/Navajo, 1972 Vietnam −10, 2012 War on Terror) and instantiates each running war over the generic `War` model — **folds into K4 / the `scenarioBoot` pipeline (Phase-1 #3)**; **(DH-62, M)** the **pre-12A two-vote/no-ticket Electoral-College mode** — every state casts for TWO candidates who each take the state's full EVs, 1st = Pres / 2nd = VP regardless of party + **same-state-EV exclusion** (`oopscpu#POST 197`) + the throwaway-tie defense (the pre-12A nomination trio in handler 9a); an **era-keyed election-mode variant** alongside the per-state EC method + the `electorsByLegislature` flag — **folds into the per-state-EC epic (E4 / Phase-1 #4)**. **Both gate ANY `scenario1788`** — they MUST land with E1. | K4 (incl. the `scenarioBoot`/`BootSheet` pipeline — built here, #115, **+ DH-61 boot-seed active wars**), **E4** (**+ DH-62 pre-12A EC mode**), **QW1**, **QW10**, K1 | L (+ XS each for draft re-rules; **+ DH-61 S + DH-62 M prerequisites**) | gap #2, mechanics §20 (`fed`) + the early-republic band (`rep1800` §A/§B) + **DH-38 late-ratification window (`new1772`)** + **#115 scenarioBoot built here (`dem1820`; `GameContext.tsx:264`)** + **★★ #136/#137/#138 draft re-rules (`tedchange#POST 5-50`)** + **★★ DH-61 boot-seed active wars + DH-62 pre-12A EC mode (`oopscpu#POST 338-344, 192-199`)** — CARRIED + EXTENDED + designer-RULED | ready (carries the DH-61 + DH-62 prerequisites) |
| E2 | **Bill typing + budget-gated spending cap (+ batch-7 procedure-subtype veto-routing fix, DH-31)** | `Bill.type?: 'foundational'\|'spending'\|'crisis'` (`types.ts:1506`, none today) + numeric `game.spendingBudget?` reading the **numeric `nationalSurplus`/`nationalDebt`** (E18g), not the ordinal `revenue`. Non-crisis spending bills can pass the floor yet be "BLOCKED DUE TO BUDGET"; crisis bills bypass. `modern` adds a **bill-relationship/replacement graph** (its deep form rides E29, the type tag lands here). **Batch 7 — fix the procedure-subtype veto MIS-ROUTING (DH-31 / divergence #21):** confirm the bill `subtype` taxonomy and **skip the President sign/veto step for `subtype: procedure` bills** (Institute Filibuster, create-whip-offices) — `rep1800` POST 2342-2348 says the engine wrongly routes them to the President. Small verify-and-fix on the same bill-typing surface. Prereq for crisis bills + the Hamiltonian program + the investigation-bill type (E14) + Reconstruction readmission bills (E3b) + the Second Bank Crisis Bill + statehood-by-bill (E4b/E21) + free-Executive-proposal carry-pool (E14, per `drums` #74). | K0; **E18g** (numeric surplus — build that sub-item early) | M | gap #42 (`1772s` B4; `fed` 159-703; `modern` 32-2265; `drums` #74; **★★ `gild1868 (b14)` corroborates #42 spending cap from a native-1868 start — and DH-63 currency-regime exclusivity FOLDS INTO this bill-relationship/replacement graph, see the EG epic**) + **DH-31 / divergence #21 (`rep1800` §A 2342-2348)** — CARRIED + EXTENDED, HI-CONF (4 era + native Gilded) | ready |
| E3 | **Generic cross-era war system (divergence #6) — DESIGNED multi-theater + tiered** | Generalize one `War` model with the **multi-confirmed battle formula `Win% = Difficulty + Planning(SecMil+CoS) + Officer×10 + MilPrep + Benchmarks`** (d100); per-theater `WarScore`; **`WS ≥ +11` auto-win**; war-end `WarScore × 2 = %` to carry; post-war defeat `\|WS\| × 2 × 10 = %`; **officer KIA on natural-1**; catastrophic 100/100; momentum bonus (+1/-2 turn-vs-turn); **Major / Minor / Operation tiers** with per-tier multipliers; **naval-N-then-ground gating per-war** (Mexico=3, WWI=2); **Treaty A-D tier + Basic-vs-Special routing by Admin + 3-roll treaty chain** (Pres → Sec State → Amb); confirmation cascade (defeated commander → Incompetent + fired → Senate drama), loss-debuff. Replace the flat resolver (`phaseRunners.ts:3593-3627`) and **fold the 1772 Rev-War loop in as one configured instance**. **`drums` confirms the formula end-to-end across 5+ wars × 4 eras** (Eastern + Western + Utah + WWI + Mexico + Sioux); **the single most multiply-confirmed cross-era resolver in the knowledge base.** Outcome grants/denies territory (couples to E5/E9-statehood). **K5 touchpoints (commander selection per battle, theater focus, surrender/peace) live INSIDE this epic, not as separate handlers** — they are war-epic-internal. Pairs with A4 battle-card (P-track) + the Phase-2 military tier. **★ Batch-9 — this is THE engine the "Cold War" relabels (§9.1.8); there is NO separate Cold-War engine to build (verified: only `revolutionaryWar.ts` exists).** `nuke` confirms the formula across the Cold-War wars (Korea/Cuba/Gulf/War-on-Terror) AND surfaces two LOAD-BEARING build-holes the epic must close: **(DH-47a) wars NEVER resolve today** — the war-end roll's odds are so low Korea ran ~2 decades — so **build a real RESOLUTION / peace path** (couples to DH-12 white-peace; today's flat resolver never terminates); **(DH-47b) there are no army/navy/air BRANCHES** — army generals command navies, "naval" pols die in infantry — so **design the branch model.** The Cold-War "content" (nukes-as-×2-multiplier flag, NASA-prerequisite flag, scripted events) is DATA on K4's era-content registry, not engine work. | K0, **QW2** | M–L | gap #45, divergence #6 (`fed`; `1772s`; `modern`; `hd` I-1; **`drums`** POSTS 123, 1725-1731, 2199, 2539, 2728, 2881, 3278, 3540, 5111-5114, 5353, 6181, 6317, 6571, 6705-6712, 6928) + **DH-47 must-resolve + branches; §9.1.8 Cold-War-is-this-engine (`nuke` §28.2)** — CARRIED + EXTENDED, HI-CONF (7 era) | ready |
| **E3b** | **Civil-War / Reconstruction epic [1856-arc — COMPLETES the shipped 1856 scenario]** | The Major-tier instance of E3. **Placed here (right after E3 + K2) because it finishes a half-built playable scenario** — `scenario1856.ts` ships but its spine dead-ends at the Trent Affair (1861) (§9.1.2). **Split cheap-first into sub-PRs:** **(a) secession gating (#58)** — `Politician.allegiance?: 'union'\|'secessionist'` + a "Secessionists" inactive pool keyed to seceded/border-state membership + `Southern Unionist` trait reads + draft-pool tagging + no-relocate-into-rebel-state + CSA officeholder seeding (cheap, additive); **(b) free/slave sectional-balance crisis (#59)** — derived from the existing `SLAVE_STATES_1856` set: while free > slave in `nationalism`, the fixed score/meter/election penalty package fires, retired on emancipation (cheap, no new field). **★ Batch-10 — corroborated from a 1820 START + sized S additive at `admitState`:** `dem1820` fires the **free/slave sectional-balance crisis from a 1820 start, "ending the Era of Good Feelings"** — so this sub-PR is **NOT 1856-only**; it fires from **1820 / Nationalism starts too**. The cheapest home is a **balance check ADDED to `admitState` (`territories.ts:8`, which does NO balance check today)**: on each admission, compare the free/slave count (`State.isSlaveState` already EXISTS at `types.ts:1329` but is only read in UI today — wire it into the engine here) and arm/retire the penalty package. **An S additive at the statehood pipeline (E21), no new field** — the AR+MI statehood + 8%-tariff sequence in `dem1820` is exactly this trigger; **then the heavy parts:** **(c) the two-theater war (#56) + the batch-7 CW VARIANTS (#97)** — East/West theaters, 3-naval-wins-gate-land, per-theater WarScore (+10 auto-win + carry-roll), named-battle casualties on the military track, Union-victory reward incl. the **permanent president +1-all-elections**, war-hero <20yr bonus; **plus the `rep1800` variant branches** — DomStab=1 early-trigger, President-defects-to-CSA ("Oaths to Two Masters"), Hartford/Northern-secession variants, UK-intervention 3rd theater, guerrilla 4th stage, internal CSA government-runs-its-own-elections; **(d) Reconstruction readmission (#57)** — a `reconstruction?` state-status enum + per-state readmission **bills** (E2, **readmit-by-REPEAL** per `rep1800` §C) that gate Gov/Rep/Senate unlock + a time-boxed `+2-toward-incumbent` bias modifier + the 3-plan exec action (K2) + amnesty law that removes-or-returns pols (prune broken Kingmaker pairs — same code as QW6) + carpetbagger-doubling + a **Reconstruction END exec action** (`drums` POST 2812; AG-Admin roll + lobby payouts + White-League/Red-Shirts trigger). **★★ Batch-14 EXTENDS (d) with #148 — the 20-yr auto-expiring Reconstruction REGIME (S–M within E3b; `gild1868` native spec):** add a `game.reconstruction = { startYear, endsYear }` regime CLOCK (begins 1864, **auto-ends ~1884** "to prevent a one-party state," `gild1868` POST 73/76) on top of the per-state readmission bills above; while active, **seceded-state seats are APPOINTED** — military Govs by the majority-party President, **Senators by the PPT-faction**, **Reps by the Speaker-faction**, non-seceded appointees per the §23.1 Unionist tag (rules 3.0.32/3.0.35, POST 70/143/330; binds at the appointment / `vacateOffice` `phaseRunners.ts:2446` sites); a **+2-RED bias-while-active** that **SUNSETS to a Blue Solid South at expiry** (FL/GA/LA Blue+3→+5, VA Blue+2→+5, POST 5145 — a time-boxed per-state bias modifier); **per-state early end by repeal-bill.** **#148 does NOT open a new epic — it strengthens this (d) Reconstruction half, and it INHERITS the DH-29 solo-blocker** (the Strict/Ironclad readmission plan never passes with CPU factions, so solo Reconstruction must be resolved — same DoD requirement below — before ANY antebellum/CW/Reconstruction scenario, **including a Gilded boot that turns the timer ON**, ships solo). The Gilded-era content epic (EG) consumes this regime when `scenario1868` boots. **(e) Canada conquest → era-gated statehood (#60)** — per-(state,era) admission gating on the statehood pipeline (E21), a bonus Canadian draft pool on annexation, native-born relaxation, Canada-region election penalties. **★★ DEFINITION-OF-DONE REQUIREMENT (batch 7 / DH-29 / §9.1.6): the Reconstruction half is UNWINNABLE solo without a CPU-passable readmission path.** GM-verified (`rep1800` POST 9170): the historical Strict/Ironclad-Oath plan can **NEVER pass with CPU factions** ("only 3 factions would ever consider voting for it… in a single player game it basically can never pass"), and post-guerrilla-war even the Lenient-10% plan was effectively un-passable — so the epic delivers an **unwinnable scenario** unless (d) ships **(1) a CPU default-vote bias for the flagged "historical/required" readmission bill** (E9 handler #2 consults a "historical-plan" flag BEFORE the §25.6 NAY/AYE heuristic — the same shape as the conditional-vote-rules primitive) **AND (3) an era-boundary auto-resolution backstop** (Reconstruction auto-ends at the `nationalism→gilded` content-band boundary via K3's condition-driven `advanceEra`). **The readmission half (d) must land AFTER E9 handler #2** (for option 1) **OR carry the era-boundary auto-resolution as its self-contained fallback** (option 3, K3 only). This is the **one place the 1856-arc genuinely NEEDS the CPU handler suite**, not merely benefits from it. **Otherwise the first scenario to get a full K5 handler suite — wire CPU handlers as they land** (the antebellum pressure drives most CPU surfaces). | **E3** (multi-theater war), **K2** (readmission/secession actions); (d) needs E2 (bills) + `State.isSlaveState` (`types.ts:1329`, EXISTS) + **#148's 20-yr regime clock needs the §23.1 Unionist tag + the leadership/PPT runner (Speaker/PPT-faction appointment path)**; (e) needs E21 (statehood pipeline); **★★ the readmission half (d) — incl. #148's regime timer — needs E9 handler #2 (CPU default-vote bias) OR K3's condition-driven `advanceEra` (era-boundary auto-resolution) — DH-29 solo-blocker DoD** | L (split 5 sub-PRs; **+ #148 S–M timer/appointment/sunset within (d)**) | gap #56–#60 (`hd` I-1..I-5; secession I-2, sectional I-4; `drums` Reconstruction END action) + **#97 CW variants + DH-29 solo-blocker (`rep1800` §C 6884-8661, 9166, 9170)** + **★★ #148 20-yr auto-expiring Reconstruction timer + appoint-by-Speaker/PPT-faction + Solid-South sunset (`gild1868` POST 70/73/76/143/330/5145) — EXTENDS (d), inherits DH-29** — CARRIED + EXTENDED | **ready** (war half); **readmission half gated on E9 handler #2 or K3 — DH-29 DoD** |
| E4 | **Per-state presidential-election method (divergence #5) + the 12A legislature-elector toggle (batch 7, #93 / divergence #20)** | Legislature-method states award EV from seated-legislature party majority instead of popular vote in `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`). **Correction (`rep1800` §A): this needs a GENUINELY NEW resolution branch** — the shipped `senatePre17` context (`types.ts:701`) is NOT a legislature-majority tally, it's the same `calcStateVote` formula with a different `ctx` tag (`phaseRunners.ts:3896`); so `electorsByLegislature` must award EV by seated Gov/Senate/Rep party majority (Gov breaks ties), recomputed after the popular tally. Decisive in 1796/1804 (CT/GA/MA/NJ/NY/SC/VT legislature-decided). **Batch-8 (DH-44) — decide the canonical legislature-vote COUNT when building this branch:** the post-12A legislature-chosen-state vote count is undecided across `new1772`/`rep1800`/`hd` — Kingmaker votes vs. a Gov+Senators+focus-Reps headcount. **Author + lock the count as part of this resolution branch** (it is the concrete tally `electorsByLegislature` computes). **Batch 7 — the 12th-Amendment before/after state machine (#93):** add the 12A as a toggleable amendment state (E5) that is the SINGLE toggle **unlocking conventions + the separate VP-on-the-ticket** rule — so a **pre-12A global `conventionsEnabled = false` gate** disables the convention machinery (E10) + gates "Separate VP Election" / "Send VP to Shore Up Support"; the "Nationwide Popular-Vote Surge" era event later flips all states except SC off legislature-electors (the machine's end-state). Flipped per-state by era event, globally by amendment (E5). **Lands with the federalism/early-republic epic (E1).** **★★ Batch-13 — DH-62 is the THIRD pre-12A election-mode branch this epic must carry, and it is a HARD `scenario1788` PREREQUISITE (M):** the **pre-12A two-vote/no-ticket EC mode** — every state casts for TWO candidates who each take the state's full EVs, **1st place = President, 2nd = VP regardless of party**, no separate VP ballot. The all-CPU 1788 run exposed the **throwaway-vote TIE exploit** (CPUs each backing two of their own trivially tie) — Ted patched the CPU side (the pre-12A nomination trio in handler 9a: nominate an alternate when none exists; two-from-same-state can't both win a state — `oopscpu#POST 192, 197`), but the **election MODE itself needs a real spec**: how CPUs allocate their two votes, **same-state-EV exclusion**, 1st→Pres/2nd→VP cross-party tally, and tie→contingent resolution. An **era-keyed election-mode variant** alongside the `electorsByLegislature` flag (#93) and the per-state EC method (#5) — a genuinely new resolution branch. **MUST land with E1 / `scenario1788`** (a 1788 boot cannot run an election without it). Pairs with #44/#62/#72/#91. | K1 (the field), E5 (global flip + the 12A amendment), **E1 (this is a `scenario1788` prerequisite)** | M (+ M for DH-62) | gap #44, divergence #5 (`fed` 194-373) + **#93 / divergence #20 (`rep1800` §A 222, 264, 276, 502, 638, 691, 708)** + **DH-44 legislature-vote-count (`new1772`)** + **#44 popular-vote-surge event 4th-era corroboration (`dem1820` — "all states except DE+SC")** + **#44/#16 multi-cycle presidential elections run end-to-end (`arkzag` — the full 8-stage general exercised across 1824/1828/1832/1836, ch7 POST 584; per-state result = d6 vs d6, loser takes −1 on all future presidential bids ch7 606; candidate CANNOT campaign in person until the Primary Era — era-gated, POST 598)** + **★★ DH-62 pre-12A two-vote/no-ticket EC mode + same-state-EV (`oopscpu#POST 192-199`) — a `scenario1788`/E1 prerequisite** — CARRIED + EXTENDED, HI-CONF (multi-cycle) | ready (carries the DH-62 prerequisite) |
| **E4b** | **[early-republic, batch 7] Slavery-flag + Cohens + Second Bank + Bank War + statehood-by-bill organize→admit** | **The early-republic subsystem cluster — the substrate for the whole 1800–1856 antebellum design.** Split into sub-PRs: **(a) Slavery-as-state-flag + Cohens-v-Virginia amendment-only abolition (#94) — SMALLER than assumed:** `State.isSlaveState: boolean` **ALREADY EXISTS** (`types.ts:1329`, per-state, populated in `states1856.ts`, even set by the statehood path `phaseRunners.ts:3175`), so NET-NEW is only (i) the abolition-toggle-off + Plantation-industry binding (a successful abolition bill turns OFF Plantation nationwide [Plantation→Agriculture 2:1] + permanently deactivates slavery legislation; "counts" only when the flag is off in ALL states), (ii) a persistent **`Cohens v. Virginia` SCOTUS rule-modifier** disallowing *legislative* abolition where the flag is set (a SCOTUS-ruling-gates-a-bill-class pattern — same shape as the *Pollock*→income-tax hook in E5; rides the SCOTUS docket E25), (iii) all new states enter free, and (iv) the reverse-an-ahistorical-ruling-via-amendment mechanism (SCOTUS rulings are otherwise irreversible — the only legislative path to abolish is the Amendment, E5). Feeds E3b's free/slave sectional crisis (#59). **(b) Second Bank recharter clock + Bank War exec action (#95) — NEW stateful economic subsystem:** `game.secondBank?: { charteredUntilYear }`; a Crisis Bill (E2) creates the **President-of-US-Bank cabinet seat** (the dynamic seat list, E16) marked **unremovable while the Bank exists**; a "Remove Deposits → State Banks" exec-action (E13) kills it; a **20-yr recharter clock** that lapses unless re-chartered (the historical Bank War in miniature). Generalizes the offices-by-law layer (#66/E16) with a recharter clock. **(c) Statehood-by-bill ORGANIZE→ADMIT two-step + unorganized-territory draft gate (#95):** extend `admitState` (E21) with a `Territory.organized: boolean` two-step (land you own but haven't *organized* has undraftable/unrelocatable pols until an organizing bill passes — LA-Purchase land, Michigan) + the draft-pool filter for unorganized-territory pols — **using the SAME `territoryOwned` predicate as K3's era-content gate** (§9.1.5). | (a) SCOTUS docket (E25) for the `Cohens` rule-modifier + E5 (abolition amendment) + E3b #59 (sectional); (b) K2 (exec-action library E13) + the dynamic seat list (E16) + offices-by-law (#66, E16) + E2 (Crisis Bill); (c) E21 (statehood) + K3's `territoryOwned` predicate | M (split 3) | gap **#94 (`rep1800` §A 2161, 2180-2182, 2675; §B 3363, 4329)** + **#95 (`rep1800` §A 954, 2123, 2350, 3175; §C 8362)** — NEW | ready (note: (a)'s `Cohens` rule-modifier rides E25 SCOTUS; **E4c (#116, batch 11) is the Jacksonian economic CONTENT state machine that sits ON TOP of this (b) Second-Bank institution — listed below after E6, since it also depends on E6's EconStab crisis meter**) |
| E5 | **Constitutional amendments as durable state (incl. era-keyed ratifier #64; ★ batch-12: amendments NOT SCOTUS-challengeable — build-target SIMPLIFICATION)** | `GameState.amendments?: { id; passedYear; data? }[]` + amendment bill type + **2/3-House pass gate** + **cross-state ratification vote that can fail** + **grandfather clause**. **Ratifier + threshold are an era-keyed, in-game-changeable field (#64):** `fed`/`gilded` by legislatures; **`modern` by GOVERNORS (40 of 53)**; **1856 by 3/4 of GOVERNORS, with the threshold itself tunable by a passed amendment** (options table → faction-enthusiasm side effects; Gilded default drops to 2/3 of states). Effect-binding: term-length (4↔6), popular-vote-everywhere (→ E4), VP-vacancy fill (→ E10b), suffrage, court size. Add a **SCOTUS-ruling-gates-a-bill-class-until-amendment hook** (`hd`: *Pollock* → no income-tax bill until ratification; couples to E23). Extend `Predicate` with `{ amendmentPassed }`. **★★ Batch-12 (`smallbugs#POST 250-269` vcczar, game-mechanics §30.3) — AMENDMENTS NOT SCOTUS-CHALLENGEABLE: BUILD-TARGET SIMPLIFICATION.** vcczar's `smallbugs#POST 250-269` rules: **Govs CANNOT challenge a ratified amendment via SCOTUS** — the Constitution is by-definition constitutional. This **OVERRIDES** `tea1772`'s #100 ruling ("SCOTUS can overturn an amendment via Gov-requested review"). **★ DROP the Gov-requested judicial-review-of-a-ratified-Amendment branch from this row's scope** (the batch-8 #100 addition above is SUPERSEDED — strike that whole sub-path). **KEEP:** (a) the **strike-a-statute** path (SCOTUS rulings void/demote *statutes*, not amendments); (b) the **mutable-threshold field** (`ratifierThreshold` tunable by passed amendment — still applies). The amendment lifecycle is unaffected. **RULED by vcczar (`smallbugs#POST 236-269`, supersedes `tea1772` #100); pairs with E25's same SCOTUS-overturns-amendment branch DROP.** **★ Batch-11 (#119) — RE-SCOPED: model the amendment LIFECYCLE as an explicit state machine (NOT a new epic).** `arkzag` exercises the full machinery repeatedly across the 1820→1840 arc, so this row gains three concrete additions on top of the `GameState.amendments?` field above (verified still UNBUILT — no `amendments` field in `GameState` today, `types.ts:1558-1646`): **(1) the explicit lifecycle states `propose → committee → floor → governor-ratify → active`** (`arkzag` ch17 POST 453/496: amendments PEND then ratify by a **GOVERNOR vote** — the ratifier table above resolves *who* ratifies; this adds the staged *status* field, e.g. `Amendment.status`); **(2) the active-amendment-BLOCKS-a-legislation-class hook — the PROACTIVE face of the *Pollock* gate already on this row:** an `active` amendment can bar a whole bill class until repealed (the "Abolish Federal Excise Tax Amendment" bans any federal excise tax until repealed, ch29 — same shape as the *Pollock*→income-tax block and E4b(a)'s *Cohens* rule-modifier; one `blocksLegislationClass?` field on the amendment, read by the bill-eligibility filter); **(3) the un-bundleable flag** — amendments CANNOT be bundled with ordinary bills (ch24 POST 1530; an `unbundleable` flag honored by E14's packaging step). First-class era amendments the arc surfaces (content, not new mechanics): the succession **"Vice-President Vacancy Amendment"** (the in-game "13th" — consumed by E10b's #61 succession), the **"National Suffrage for White Male Property Owners"** (#59), the recurring **"Abolish Slavery Amendment" *CRISIS*** (always fails), "40-Year Min Age for SC Justices" (#52). **Gates BUG-2.** | K0; K4 (ratifier table stub) | M (+ #119 lifecycle S; the batch-12 simplification REMOVES the SCOTUS-review-of-amendment sub-path — small net reduction in scope) | gap #39 (`gilded`+`fed`+`modern`) + #64 (`hd` I-9) + ~~#100 amendment-review~~ **SUPERSEDED batch-12 / `smallbugs#POST 250-269` (`tea1772` #100 OVERRIDDEN by vcczar)** + #100's amendable-threshold half retained (`tea1772`) + **#119 amendment lifecycle + class-block + un-bundleable (`arkzag` ch17 453/496, ch24 1530, ch29)** + **★ batch-12 amendments-NOT-SCOTUS build-target (`smallbugs#POST 236-269`)** + **★★ `gild1868 (b14)` corroborates #39 amendment lifecycle from a native-1868 start (women's-suffrage A/B amendments + threshold machinery)** — CARRIED + EXTENDED + SIMPLIFIED, HI-CONF (4 era + founding + 1820 lifecycle + native Gilded + designer-RULED) | ready |
| **E5b** | **[batch 7, ★ FOUNDATIONAL; ★★ batch-12 designer-RULED] Ideology-as-CIRCLE — central `ideologyDistance` helper + migration + ★ #127 conversion/shift schedule + ★ #129 Kingmaker-Protégé allowlist (divergence #19 / #99 — TED-AUTHORITATIVE batch-12)** | **Place EARLY** (§9.1.7). `IDEOLOGY_ORDER` (`types.ts:14`) is a LINEAR array and ideology distance is **open-coded at 10+ engine/UI sites** — `factionCenter` (`phaseRunners.ts:715`), `stepToward` (`:740`), conversion adjacency (`:993-1003`), sponsor-distance (`:3548`), a **private `ideologyDistance` helper** in `firstContinentalCongress.ts:120`, plus `FactionLeaderPage.tsx:19-20,49` / `Relocations.tsx:107` / `Kingmakers.tsx:86` — **with NO central helper**. Steps: **(1)** add a central `ideologyDistance(a, b, circular)` engine util; **(2) migrate the 10+ open-coded sites to it** (a mechanical, **behavior-preserving** refactor while `circular = false`); **(3)** gate the wrap on `GameState.ideologyIsCircular?`; **(4)** extend conversion targeting (E9 handler 9f / §25.8) to **same-OR-adjacent** ideology under the ring. **★★ Batch-12 — #99 is NOW TED-AUTHORITATIVE** (3-thread corroboration → designer-ruled). **★ Batch-12 #127 (`tedchange#POST 18-31, 34-39, 38, 51-53`, game-mechanics §6.3.y + §6.4.y + §27.7) — IDEOLOGY-SHIFT / CONVERSION RATE SCHEDULE folds into this row:** **(a)** the **adjacency rule** (`tedchange#POST 38, 53` — same-party conversion can target same OR ADJACENT ideology, was same-only) is a one-site filter change at `phaseRunners.ts:993-1003`; **(b)** the **LW↔RW Pop 25% special-case cross-circle shift** + **auto-Two-Faced trait grant** on successful flip rides the circle helper at the wrap (`tedchange#POST 24, 28-29, 51`); **(c)** the **33% effective party-flip rate** for can-party-flip pols is a refinement of `CONVERSION_ODDS.poach.matrix.cross` (`tedchange#POST 34-39`) — base rate is roughly aligned today, refine post-willingness-amplifier; **(d)** corroborates and SHARPENS the existing #76 CPU conversion adjacency by extending same-party targeting to adjacent ideology. **★ Batch-12 #129 (`tedchange#POST 201-208, 279-283`, game-mechanics §6.5.y) — KINGMAKER → PROTÉGÉ TRAIT ALLOWLIST/BLOCKLIST:** a small data config — **PASS list:** basic Kingmaker / Celebrity / Hale / all positives; **BLOCK list:** Master+National Kingmaker / Frail / Flip-Flopper / Two-Faced. XS as a list addition to `KINGMAKER_RULES` (`types.ts:295`); ride with this PR or Phase-1 #21 (conversion refactor). **Steps 1-2 are cheap + additive while the flag is off (zero behavior change)**; **steps 3-4 + #127/#129 fold in once the helper exists**. **NOT a keystone** (nothing blocks on it) — cheapest early, most error-prone if deferred. **RULED by Ted (`tedchange#POST 18-31, 34-39, 38, 51-53` for #127; `tedchange#POST 201-208, 279-283` for #129; #99 is now designer-AUTHORITATIVE).** | — (independent; steps 1-2 land before E9's conversion/SCOTUS handlers so they call the helper) | M (XS-S helper+migration; M for the flag + #127 conversion-adjacency schedule; +XS for #129 allowlist data) | **#99 / divergence #19 (`rep1800` §B 5717, 5730; `types.ts:14`)** + **★★ #99 TED-AUTHORITATIVE batch-12** + **#127 conversion/shift schedule (`tedchange#POST 18-31, 34-39, 38, 51-53`)** + **#129 Kingmaker→Protégé allowlist (`tedchange#POST 201-208, 279-283`)** + **#76 adjacency EXTENDED batch-12 (same-party targets same OR adjacent)** — NEW + RULED, HI-CONF (3-thread + designer-RULED) | ready |
| E6 | **Meter-model generalization + meter-driven endgame clocks + ★ batch-12 #134 Lingering 7-step STRICT ordering + tax/tariff decay CARRY-FORWARD (NEAR-TERM; batch 6 absorbs APOCALYPSE; batch 12 absorbs the Lingering re-spec)** | Banded-text ladders over the existing 7 `NationalMeters` fields + crisis entry/exit by tier + cascade rules + top-of-ladder effects + numeric `nationalDebt` integer + `metersToElectionBonus()`. **A 1:1 WIDENING of `NationalMeters`, not a relabel.** `hd` extends to the **full ~16-meter bank** (#67): era-gated per-power relation meters + per-ideology enthusiasm meters + the **9-part Lingering resolution order** + hard caps (Mil-Prep/Planet-Health = 8) + tax/tariff decay timers + **policy-gated caps**. Builds on QW3's ±3-clamp (now extended to cabinet + ideology, #80). **Batch 6: ABSORBS the APOCALYPSE meter-driven endgame clock** (divergence #14 / #88). Verified shipped: only event-driven endgame exists; no meter-watcher, no countdown. Add **`GameState.endgameClocks?: { meter; threshold; remainingYears; startedYear; bandName? }[]`** + per-era `era.endgameClockRules?`. In `runPhase_2_5_1_Lingering`: arm/decrement/disarm; in `advancePhase`: terminate via `game.gameEnded` when `remainingYears ≤ 0`. **BOTH endgame paths share `game.gameEnded`**. **Meter-agnostic** — the Populism Planet Health 10-yr clock is one configured row per era. **Batch 7 corroborates an early-era enumerated meters-driven game-over set (#98)** — Autocratic/Standard/Attempted Coup + Economic Collapse + Enemy-Takes-Defenseless-US. **★★ Batch-12 #134 (`tedchange#POST 397-408`, game-mechanics §11.1.y) — LINGERING 7-STEP STRICT ORDERING + TAX/TARIFF DECAY CARRY-FORWARD (M, RE-SPEC of the meter-decay/volatility surface).** Verified shipped: `runPhase_2_5_1_Lingering` (`phaseRunners.ts:3260-3377`) runs cabinet-drift-driven meter writes + per-trait modulation + national-debt update but has **NO explicit 7-step ordering and NO tax/tariff volatility-vs-decay distinction**. Ted's `tedchange#POST 397-408` rules: **(1) steps run 1→7 in strict order, NEVER re-do a prior step**; **(2) volatility roll at step 7 is THIS-phase-only** (not added to running totals); **(3) tax/tariff decay PROPAGATES FORWARD to NEXT phase's step 3** (decay continues across half-terms). Add a **`game.taxTariffDecayQueue?: { decayDelta; appliesAtPhase: 3; lifeYears }[]`** carry-forward state (`repair()` backfills `[]`) + an explicit 7-step internal ordering on the runner. **SAME surface as the APOCALYPSE meter-watcher** (Lingering is where meters get written), so build it with this row. **Folds the existing #67 Lingering bank ordering into a designer-RULED canonical 7-step.** **RULED by Ted (`tedchange#POST 397-408`; refines #67 Lingering bank ordering).** **Phase 1, NOT Phase 2.** Benefits *every* era. | K0; E18g (the debt field) | **M (was M; batch-12 #134 adds the step-discipline + carry-forward queue inside the same row — same tick site, marginal incremental cost)** | gap #50 (`modern`) + #67 (`hd` I-12; **★ batch-12 RULED as canonical 7-step + carry-forward, `tedchange#POST 397-408` — #67 closes as a designer-ruled refinement**) + #80 ±3 (`drums` POST 4574) + #88 / divergence #14 (`pop` 542, 548) + **#98 enumerated game-over set (`rep1800` §C 7274)** + **★★ #134 Lingering 7-step strict ordering + tax/tariff carry-forward (`tedchange#POST 397-408`)** — CARRIED + EXTENDED + designer-RULED, HI-CONF (4 era + designer) | ready |
| **E4c** | **[early-republic, batch 11 — NEW small epic] Jacksonian Bank-War → Independent-Treasury long-run ECONOMIC content state machine (#116)** *(placed here, AFTER E2 + E6 + E4b(b), per its dependency chain — it is the early-republic ECONOMIC content that sits on top of E4b(b)'s Second-Bank institution)* | **The long-run content STATE MACHINE that sits ON TOP of E4b(b)'s §27.6 Second-Bank institution** — the Era-of-Democracy → Manifest-Destiny economic arc the `arkzag` full run plays out. **Build it EMERGENT, not scripted (tech-lead's binding call):** the Bank/Independent-Treasury arc is a chain of recurring **CRISIS bills** that RESOLVE an EconStab **CRISIS** state (E6) and REPLACE each other, NOT a hand-scripted timeline. Concretely, three additive mechanics: **(1) a `Bill.replaces?` field on `Legislation`** (`types.ts:1506`, none today) so a CRISIS bill can *supersede* the institution a prior CRISIS bill created — the canonical instance is **"Create a non-partisan independent treasury" REPLACING "Establish Bank of the United States"** under Pres Dudley c.1840 (`arkzag` ch33 POST 106: literal Bank→1840-Independent-Treasury arc); the Bank itself is the recurring CRISIS bill that is filibustered (the Puritan ≥2-legis rule, E14c/#10), returns next session, eventually passes (ch11/ch20); **(2) a per-bill-class `lockedUntilYear?` tariff COOLDOWN** — dueling 10%/40% tariff bills gated by a tariff-rate-change cadence ("can't change tariff rates until 1836", ch24 POST 928); a near-literal **FORCE BILL** ("Expand Presidential Power to Force States to Comply with Federal Revenue Laws", ch24) rides the same crisis-bill path; **(3) the Panic-of-1837 EconStab CRISIS as a multi-half-term meter state** (E6) with meter-crater catch-up Anytime-Evos ("Economic Collapse" at EconStab 3, #11) — armed/retired by EconStab thresholds, the bills above resolve it. Verified UNBUILT: `applyEffect` (`phaseRunners.ts:3209`) **only nudges the 7 named meters** (no Bank/tariff/treasury tokens anywhere in `src/`); `Legislation` (`types.ts:1506`) has **no `type` / `replaces` / `lockedUntilYear`** field. **Distinct from #3** (the static tariff/currency *axes* at E18d) — this is the *played event/bill arc*. **DESIGN NOTE (carry, not a blocker): "scripted-vs-emergent."** The arc *reads* historical (Bank → Panic → Independent Treasury) but the tech-lead's call is to build it as **emergent recurring CRISIS bills + a `replaces` graph + a tariff cooldown**, so the same machinery yields the arc without a bespoke 1820s timeline; revisit only if emergent play diverges unacceptably from the historical shape. | **E2** (`Bill.type` + crisis-bypass — extend it with `replaces?` + `lockedUntilYear?`), **E6** (named EconStab meter + crisis/cascade), **E4b(b)** (the §27.6 Second-Bank institution this recharters/replaces); E13 (the Bank-War exec-action lives at E4b(b)); E14c (filibuster, for the recurring-Bank-bill loop) | S (small epic) | gap **#116 (`arkzag` ch11 POST 26, ch20 POST 344, ch24 POST 906/928/960, ch33 POST 20/106; EconStab crisis ch17 POST 402, ch19 POST 2005, ch27)** + #11 crisis bills + #3 tariff axes — NEW | ready |
| E7 | **Persist + auto-fill House slates & committees [NEAR-TERM — scaling wall b]** | Store a faction's House candidate slate + committee rosters on the snapshot; **carry-forward + bulk auto-fill by default**. The "computer owns the deterministic tedium" theme. **A UX wall, not modern-only** — improves 1856's 31-state congress now; a human **quit** over the manual tedium at 53-state scale. Do **before** the deep-modern roster (E26). **CPU committee-staffing heuristics partially driven by K5 handlers (§25.5-adjacent).** **★ Batch-10 — the slate this persists is FOCUS-REPS, not full per-seat delegations** (#55, vcczar POST 704): the `(EV−2)/5` focus-Rep abstraction (built at E28) is what makes the House slate tractable to carry-forward + auto-fill at 53-state scale — pair the persistence shape with the focus-Rep unit so wall (b) and the focus-Rep abstraction land together. | `repair()` backfill for the new fields | M | gap A9, debt #20 (`modern`; also `1772s` Lingering/Committees) + **#55 focus-Rep unit (`dem1820` POST 704)** — CARRIED + EXTENDED | ready |
| E8 | **Procedural pol generation [NEAR-TERM — scaling wall a]** | A **runtime, seeded** generator (lives in `src/engine/`, uses `rng.ts`) emitting `ImportedDraftee` rows when the real ~18.5k dataset is dry; reuses `instantiateDraftees` (`phaseRunners.ts:114`). Stat/ideology/trait/demographic distribution (GM wanted "some moderates") + a **plausible, ethnically-varied, toggleable name engine**. **Required for ANY late-era play** AND fixes sparse-state filler (#43) AND BUG-3's stopgap officer. **The bridge to the portrait epic (P2)** — shares the demographic model with P2. | K0 (seeded RNG) | M–L | gap #43, A1, debt #19 (`modern`; `fed`) — CARRIED, HI-CONF | ready |
| **E9** | **CPU handler suite (batch 5 epic; batch 6 adds conditional-vote-rules primitive) — 15 lightweight PRs once K5 lands** | The §25 CPU spec wired against K5's scaffold. **Each handler is one PR** (50-200 lines of pure decision code, heuristic verbatim from §25). **Parallelizable** — once K5 lands, multiple handlers can land concurrently across contributors. **Order inside the epic is §6.6.1's handler-order table** (cheapest first; architectural-gap handlers later once the persistent state is exercised). Each handler reads the existing snapshot + a small `ctx` payload and returns the decision; the consuming runner replaces its inline stub with one `controller.decideFor(…)` call. **★ Batch-13 (`oopscpu`) DE-RISKS this epic — NO re-order, NO new handlers.** The Ted-run all-CPU 1788 stress-test field-validated SIX handler specs before they're built: **#70 (9c) / #72 (9a+9m) / #73 (9d) / #74 (9b) / #75 (9g) / #76 (9f)** are now "spec-complete + field-validated with concrete failure modes + Ted's fixes" — a **build-confidence bump per handler PR** (lower spec-risk), tagged inline below. **The OC-1…OC-8 sub-gaps FOLD INTO the relevant handler rows as sub-rules** (NOT new rows): OC-3→9b (★balance-critical), OC-2→9c, OC-1+OC-5→9d, OC-6→the kingmaker handler. **9e (convention) is the ONE handler NOT validated** — 1788 predates conventions → it stays `drums`-spec-only at LOWER confidence; **a post-12A all-CPU run is needed to validate it** (the all-CPU-test methodology, Sequencing notes). The all-CPU run also **resolves #52 for the all-CPU case** (CPU SCOTUS by ideology-distance; player-vs-CPU stays user-gated). **15 handlers, in this order:** **(9a) Candidate selection 75/25 + minor + open-seat** (§25.1 / #72) — cheapest; **★ batch-13 field-validated + SHARPENED (`oopscpu#POST 192-194, 197, 294`): add the pre-12A nomination trio** — (i) incumbent Pres re-nominates incumbent VP if eligible (the **VP-retention** rule, paired into 9m), (ii) nominate an alternate when none exists (anti-throwaway-vote-tie), (iii) own-faction priority + the same-state-EV exclusion (two same-state candidates can't both take a state's EVs); no-primary-incumbent corroborated; **(9b) Legislation NAY/AYE/NAY 3-step + conditional-vote-rules consumption (batch 6 addition, `pop` POST 1111)** (§25.6 / #74) — pairs with `Bill.type` (E2); **handler #2 consults `Faction.factionLeader.compelledVoteRule?: Predicate → Vote` BEFORE the §25.6 NAY/AYE heuristic** (Iron-Fist controllers publish declarative predicate → {AYE/NAY} policies, e.g. "Sen Maj Leader NAYs any nominee with Admin<3 unless faction holds Integrity"); **★★ batch-13 field-validated + the HIGHEST-PRIORITY, ★ BALANCE-CRITICAL sub-rule inside 9b is OC-3 (`oopscpu#POST 162-180`): a crisis-vote ideology-floor gate + secession/slavery-active check.** The all-CPU 1788 run abolished slavery PEACEFULLY by 1792 (no secession, no divisiveness) because every faction — incl. Southern — AYEd the Abolish-Slavery CRISIS bill on crisis-priority grounds (3.0.30 is "more lenient on crisis support for the majority than the opposition"; the rules "don't mention how CPUs vote on crisis if it hurts them"). Add **(i) an ideology-floor gate** — down-weight or floor-to-NAY the crisis-priority boost when the bill costs the faction's OWN ideology/lobby cards (so a CPU won't betray its own cards) — and **(ii) a secession/slavery-active check** that fires BEFORE an Abolish-Slavery crisis bill resolves (the CSA trigger needs slavery active; abolition currently never trips it). **S** (two predicates on the handler the epic already builds; the exact weighting is a design dial). Also corroborated: theme-blindness (point-math not theme — signed a Fugitive-Slave-Act then took Don't-Enforce because point-math helped an ally, `oopscpu#POST 95-96`, same class as DH-21); duplicate-bill resolution by point order (`#POST 282`); the Free-Executive carry-pool live (`#POST 154, 278`); era-gated law-unlocked filibuster (`#POST 90-92, 284`, #146f); **(9c) Leadership IRV bloc-vote + 3-ballot collective endorse** (§25.3 / #70) — most-corroborated; **★ batch-13 field-validated end-to-end across multiple founding-era Speaker/PPT/Party-Leader cycles (`oopscpu#POST 42, 115, 56-57, 329, 332`): the IRV ladder + faction bloc-vote + ties broken by the Party-Leader's backed candidate.** **OC-2 (`oopscpu#POST 151`) is the marquee collision bug folded in here:** closest-ideology leadership can hand chairs to the MINORITY party (all Senate chairs went BLUE while Red held 73%), then the "≥60%-chamber → may propose" gate read chamber control differently → minority chairs proposed under the majority's threshold. **Fix: ONE canonical `chamberControl(snap, chamber)` helper** shared by BOTH leadership-select AND the proposer gate — consolidate the inline `senateMajority`/`houseMajority` duplication at `phaseRunners.ts:1863-1864`. **S** (one helper + two call-site migrations); **(9d) Cabinet selection + Senate confirmation + conditional-vote-rules consumption (batch 6, `pop` POST 1111)** (§25.5 / DH-23 / #73) — **lands the 36% bug fix; replaces the one-step pick at `phaseRunners.ts:2158-2223` with a 2-step pick→Senate-vote**; default-AYE baseline + Iron-Fist Maj-Leader auto-AYE-own-picks (via the `compelledVoteRule?` primitive) + lobby-maximizer Admin-weighting + the **batch-6 SCOTUS within-1-step auto-AYE declarative rule** (§26.6.1) + Manipulative-Pres compel-retire as a distinct trait-power; **★ batch-13 field-validated: the crisis cabinet-fill LADDER (`oopscpu#POST 322`)** — highest-Admin first → eligible refuses → 3-Admin lobbies-tiebreak → next refuses → unemployed pol accepts (accept-roll); a Controversial nominee that fails committee → Pres offers a replacement (`#POST 184`). **OC-1 + OC-5 fold in here:** **OC-1 (`oopscpu#POST 65`) — scandal-resignee re-appointment cooldown:** the CPU recycles a disgraced (scandal-resigned / fired-Scandalous) pol straight onto another appointed office because it has NO scandal-smoother memory — the concrete instance of **DH-22 / §25.15.3 (handler 9l)**; reads the K5-introduced `recentScandalIds?` state + a cooldown of N phases; **OC-5 (`oopscpu#POST 184-187`) — court-as-firing loophole:** the CPU dumped its SecState + AG ONTO SCOTUS to vacate cabinet seats BEFORE the firing-precedent was set — **gate a cabinet-vacating SCOTUS appointment behind the firing-precedent rule (§21.4)**. **XS each** within 9d (OC-1 needs the scandal-cooldown persistent field); **(9e) Convention CPU (per-ballot menu + ballot-10 compromise + ballot-25 dark horse + Pineapple Primary + kingmaker-refusal list)** (§25.4 / #71) — **OWNS DH-8 (marquee unstable surface) + DH-17 (11-ballot deadlock fix: auto-drop-out after 2-3 ballots of 0 Momentum) + ballot-shift = next-round + DH-7 R/D threshold + DH-18 dark-horse resignation rolls + batch-8 #104 (guard the lone-ideology minor-candidate exploit — a single ideologically-isolated minor candidate can game the convention; the CPU handler must not be exploitable by an isolated minor, `tea1772`)**; highest-complexity handler; **★ batch-13 COVERAGE GAP — 9e is the ONE handler `oopscpu` could NOT field-validate** (1788 predates conventions; leadership IRV 9c was the only convention proxy), so it stays `drums`-spec-only at LOWER build-confidence than the other handlers. **A post-12A all-CPU run is needed to validate it** — it would exercise #71 exactly as `oopscpu` validated #70/#72/#73/#74 (see the all-CPU-test methodology note in Sequencing notes); **(9f) Conversion poach (Pliable + adjacency gating + failure-strip + multi-faction-collision tie-break)** (§25.8 / #76) — **★ batch-13 field-validated: the ideology-circle LW↔RW-Pop 25% cross-step (`oopscpu#POST 117-119, 127`)** confirms the #99 circle-adjacency conversion LIVE (rides E5b's central `ideologyDistance(a,b,circular)` helper) — 4th-thread confirmation; the disgruntled auto-flip layer + the restriction list also ran live (`#POST 40, 112, 307`). **OC-6 → the KINGMAKER handler (§25.11): highest Com+Leg+Gov tiebreak for kingmaker→protégé pairing** (`oopscpu#POST 308` — "Pius had two kingmaker-protégé possibilities; I chose by highest Com+Leg+Gov. If incorrect, we need more clarification"). The kingmaker-pairing tiebreak is an XS rule on the kingmaker-assign path consumed by 9e + the conversion/kingmaker machinery (DH-5 / QW6); **(9g) A/B/C event vote + president-ideology force + meter-guarding** (§25.7 / DH-21) — first handler to use the meter-impact aggregator; **★ batch-13 field-validated (`oopscpu#POST 191, 335-337`): Pliable Pres defers to cabinet majority; tie among advisors → President decides (Egghead-tiebreaker-only); a CPU president SKIPS its whole exec-action budget when no action nets points** (points-maximizing only — same theme-blindness class as DH-21); **(9h) Faction-leader replacement (4-condition removal + hard gates + stagnation-fix + positive-trait floor)** (§25.10 / #78); **(9i) Primary CPU (5-action template + frontrunner rule + better attack-targeting)** (§25.12 / #63); **(9j) Governor action picker (state-stack-aware; prunes Improve-Industry at 10/10)** (§25.15 #4 / DH-19); **(9k) Reciprocity / vote-trading enforcer** (§25.15 #1 / DH-20) — first DH-* architectural gap; reads + drains `cpuCommitments`; **(9l) Cascading-scandal smoother** (§25.15 #3 / DH-22) — era-event walker calls this to drop back-to-back at-most-once events; reads `recentScandalIds`; **(9m) VP selection (8-element rubric + retention curve)** (§25.2 / #72) — era-keyed; **★ batch-13 RULED (`oopscpu#POST 192`, #144): VP retention is now a HARD rule (at least pre-12A), NOT a curve** — an incumbent Pres ALWAYS re-nominates the incumbent VP if eligible (closes the `drums` #72 "no retention" designer-acknowledged bug; the era-keyed softening is subsumed, whether later eras soften it is open); **(9n) SCOTUS justice vote + Iron-Fist compel + 10-yr drift 25/10/5** (§25.14 / #79) — rides E23; **(9o) Faction rename trigger** (§25.13 / #40) — reads the rename-trigger predicate→name-generator registry. | **K5** scaffold + K0 (seed) + K2 (registry — handlers 9b/9d/9e/9i/9j pick from libraries); 9k/9l need the K5 persistent state; 9n rides E23 | **~15 × S–M** (each 50-200 lines) | gap #70-#78 (§25 master) + #40 #63 #79 + DH-7/8/17/18/19/20/21/22/23 + **`pop` POST 1111 (conditional-vote-rules primitive)** + **★ batch-13 FIELD-VALIDATION (`oopscpu` — 6 handlers spec-complete + OC-1…OC-8 sub-rules; #143 split out as QW17; #61 death-branch → E10b)** — CARRIED + EXTENDED + FIELD-VALIDATED (6/7 founding-era handlers; 9e convention untested) | ready (handlers 9a/9b/9c/9d/9f/9g/9m higher-confidence; 9e drums-spec-only) |
| E10 | **Convention machinery (2.9.2) — uses K5 handler 9e for CPU** | The **single biggest unbuilt subsystem** — replaces the `engine.ts:69` one-liner. Multi-ballot loop + momentum (carries across cycles) + unit-rule; **inter-ballot action library on K2** (Force Rules Change, Presidential Promise — *offer-DOWN/request-UP direction rule*, Drop & endorse, Kingmaker, Ballot shift); 5-plank platform + comparison (+ failed-platform <50%-planks penalty); VP-impact scorer; scandal/faithless-elector rolls; **host-advantage** + **PL-overrules-VP**; **CPU delegate engine** (per-state EV × category multiplier — shared with the Phase-2 primary). **CPU side is owned by handler 9e** — DH-8 + DH-17 + ballot-shift + DH-7 + DH-18 all firm there. **Resolve the ambiguous ballot-shift rule (next-round) + the DH-7 R/D threshold asymmetry + Iron-Fist-rules-change re-gate inside this epic.** **★ Batch-11 corroboration (#13/#111):** `arkzag` exercises multi-cycle BROKERED conventions LIVE across 1832 + 1840 — major + minor/favorite-son candidates, an Orator nominator's d6 momentum bonus, **party-asymmetric nomination thresholds** (NatRep 2/3 = 436/649 vs DemRep 50%+1 = 343/685, ch32 POST 2465-2466), **command-gated inter-ballot actions** (N command = N of: force-rules-change / presidential-PROMISE-to-a-fewer-delegate-candidate / appeal-to-credibility / drop-w-or-w/o-endorsement, ch21 POST 367/425), **presidential-promise BUYOUTS deciding the 1832 nomination** (Cheves buys Key's + Clay's endorsements with VP + Sec-State → wins ballot 2, POST 444-488), the **11-question VP-selection questionnaire** (POST 1721), and **5-plank platform scoring** (Econ/Domestic/Judicial/Foreign-mil/Pres-pledge, 3 yes/no Qs set Party Pref ±1, ch7 POST 548) — strong 2nd-campaign confirmation of #13/#111. **★ The delegate-apportionment sub-PR is GATED on the NEW delegate-class fork (Decision-gated)** — AI-allocator-by-EV-formula vs player-rigged (`arkzag` ch3 276 vs ch32 2466); the rest of the epic does NOT wait. **Split into ~3 sub-PRs** (ballot loop → inter-ballot library on K2 → platform/VP/scandal; the delegate-apportionment sub-PR waits on the fork). | K0, K2, **K5 + handler 9e**; **the delegate-apportionment sub-PR only is gated on the delegate-class fork (Decision-gated)** | L–XL (split 3) | gap #13–#19 (`gilded`/`fed`/`modern`; `hd` 3261-4726, 5594-5713; **`drums` §25.4 — the richest decoded subsystem**; **`arkzag` brokered conventions live 1832/1840 — ch3 276, ch21 367/425, ch32 2465-2466, POST 444-488/548/1721**; **★★ `gild1868 (b14)` corroborates #13 (convention delegate-apportionment verbatim engine), #14 (5-plank platform incl. a Presidential-Action plank), #15 (9-item VP rubric) from a native-1868 start**) + #111 + DH-7 + DH-8 + DH-17 + DH-18 — CARRIED + EXTENDED, HI-CONF (7 era + native Gilded) | ready |
| **E10b** | **Succession / eligibility / acting-president (#61) + contingent House election (#62) [1856-arc election additions]** | Two coupled election-system additions surfaced by `hd`. **(1) Succession/eligibility (#61):** `Politician.bornForeign?: boolean` gating the presidency (and convention Major candidacy); a **configurable, legislatable line of succession** (`successionOrder?: OfficeType[]`); an **`actingPresident?` state whose `command` (often 0) gates exec actions / SCOTUS-compel / re-election eligibility** (a 0-Command acting president is inert); era-gate the VP-vacancy-fill on the amendment (E5). **★ Batch-11 (#61) — the VP-succeeds / acting-divert SUCCESSION ENGINE is now ready-to-build, and the KILL TRIGGER already SHIPS.** `arkzag` corroborates the whole chain end-to-end from a 2nd campaign — President Cheves is **ASSASSINATED** (ch27 POST 276), **VP Enoch Lincoln succeeds "in accordance with the 13th Amendment"** and must then **nominate a new VP** (gated on E5's VP-vacancy amendment being `active`), and the **acting-president state fires**: on first assuming office the successor rolls whether to **refuse to act**, and because Lincoln has **Easily Overwhelmed the VP performs presidential actions in his stead ~50% of the time** (ch27 POST 441/454) — an **action-divert roll + a trait-acquisition side-effect** (vcczar: "first presidential assassination this run", POST 339). **Crucially the kill trigger is NOT the work — it already SHIPS:** the `assassination-killed` anytime event (`anytimeEvents.ts:232`) fires `{kind:'death'}`, and a death sets `presidentId = null` via `vacateOffice` (`phaseRunners.ts:2449`). So the **ready-to-build path is the succession ENGINE**: VP-succeeds-on-death → fill-VP (E5-gated) → acting-president action-divert roll + trait side-effect. **★★ Batch-13 (#61 death-branch, Ted-RULED `oopscpu#POST 324-329`) RECONCILES + SUPERSEDES the death case of the batch-11 `arkzag` read (S):** a Presidential **DEATH** → the VP becomes a **FULL President** (REFUSES "Acting" — **no action-divert roll** on a clean death), is **NOT auto party/faction leader** → the party **RE-RUNS the leadership IRV** (handler 9c → handler 9h picks the new PL). This SUPERSEDES the batch-11 "acting/action-divert" read **for the death case only**; the **`arkzag` acting-president + action-divert state is RETAINED ONLY for the INCAPACITY branch** (0-Command / ineligible-substitute / refuse-to-act). Binds at `vacateOffice`/the death path (`phaseRunners.ts:2446`) + the leadership runner (`:1844`). **S within E10b** (already re-scoped batch 11 for the kill→succeed→fill chain; `oopscpu` supplies the reconciled death-branch spec). **The line-of-succession / impeachment HALF stays parking-lot (DH-54)** — the configurable legislatable succession order (`successionOrder?`) past the VP, and the impeachment ruleset, still need a written spec first. **Batch-8 (#105) — stat-collapse → forced presidential resignation, a one-rule addition here:** a sitting President whose `command` + "most" skills hit a floor is **forced to resign** (`tea1772`) → triggers the succession line above. A small rule that lives NEAR the rest of the succession work, no new subsystem. **★ Batch-9 (DH-54) — the impeachment + VP-vacancy-fill + succession RULESET was NEVER in the rules doc** (`nuke` §28.5: no impeachment trigger — a Watergate-analog went undetected → pure upside — and VP-vacancy fill was "made up as we go"; corroborates `rep1800` DH-33 + `hd` across a THIRD campaign). **The impeachment/succession ruleset is AUTHOR-BEFORE-BUILD (parking lot):** the configurable line of succession + the acting-president gate + the VP-vacancy amendment hook all need a written ruleset before this row + the modern institutional layer (E29) are built. Pairs with #105. **(2) Contingent election (#62):** on no EC majority, a House contingent path — **1-vote-per-state by delegation majority, Governor-party tiebreak; Senate elects VP** — with a **configurable `contingentTopN: 2\|3` cutoff (DH-6: GM used top-2) + the tied-chamber inverse-control rule**. Slots into the same EC tally code as E4. **Folds DH-3** (career-track presidential bar — landed early as QW5, enforced here in the candidate pool). **⚠ Build is GATED on parking-lot resolution of divergence #10 / #84 — contingent-election rules don't exist** (`drums` POSTS 472-474: GM invented 5 rulesets mid-thread — top-2 vs top-3, outgoing-vs-incoming Congress, deadlock side-effects). Author the rules first, then build. | E10 (convention/EC work), E5 (VP-vacancy amendment); **#10/#84 + DH-6** must be authored first (parking lot) | M | gap #61 (`hd` I-6) + #62 (`hd` I-7) + DH-6 + DH-3 + #84 (`drums` 472-474, 810, 4467-4475, 5176, 5217-5221, 5250) + **#105 stat-collapse forced resignation (`tea1772`)** + **#61 legislatable line-of-succession 2nd corroboration (`dem1820` — Speaker→3rd-in-line by legislation)** + **#61 VP-succeeds/acting-divert engine + kill-trigger-already-ships (`arkzag` ch27 POST 276/339/441/454; `anytimeEvents.ts:232`, `phaseRunners.ts:2449`)** + **★★ #61 death-branch RECONCILED (`oopscpu#POST 324-329` Ted-RULED: death = FULL President, no acting/divert, re-run leadership IRV; SUPERSEDES `arkzag` for the death case; acting/divert retained for incapacity only)** — CARRIED + EXTENDED + RECONCILED, HI-CONF (4 era) | **needs-design** (#10/#84 contingent; DH-54 line-of-succession/impeachment); **VP-succeeds/death-branch path + the rest ready** |
| E11 | **Governor's actions library (2.5.2) — state-stack-aware via K5 handler 9j** | ~14 named, era-flavored actions on the registry; d100 vs 20·governing (Efficient → +1 action; **skill-match doubles success; 5-Gov autopass; success → 10% +1 Command except autopass; Gov incumbency decay after 8/12 yrs** — `hd`); per-action prereqs incl. **ideology gate** + **Honest-Gov't gate** + state-status; reads/writes `State.policies`; **small/large-state action-impact multiplier (×0.5/×2 — DH-15, needs design)**. Replaces the passive `bias` nudge at `phaseRunners.ts:3382`. Era row-sets via the per-era registry index (modern adds primary-control + voter-suppression + culture; `hd` adds "Activate State Primaries" #63; `drums` adds High-Tech industry actions #81 + faction-archetype CPU mapping — wired via handler 9j). **Batch 7 (DH-35): era-gate the row-sets with enough EARLY-era agency** — `rep1800` flags the pre-primary eras as "a bore" (governing dull, only flavor tours), so the early-republic band needs a real gov-action menu, not a thin one. | K1, K2, **K5 + handler 9j**; DH-15 from parking lot for multiplier | M | gap #20 (`gilded`/`fed`/`1772s`/`modern`; `hd` 2936-6997; `drums` archetype mapping + DH-19) + #81 + **DH-35 (`rep1800` §A 2756-2760)** — CARRIED + EXTENDED, HI-CONF (6 era) | ready |
| E12 | **Diplomacy actions library (2.7.1) — ★ batch-9: THE real modern/Cold-War foreign subsystem** | Increase Relations / Increase Trade / Extend Credit (adds debt) / Provoke (war-trigger) with success/blunder rolls, on the registry. Seed per-power roster on `GameState.diplomacy` (shape already right — `Record<string,number>`, `types.ts:1574`): era-dependent (5 federalism; +China gilded, Prussia→Germany 1871; **8 modern** +Japan/Israel). **Cap "Extend Credit to all nations" — DH-4** (a diminishing-returns / cap rule against the near-auto-win stacked bonus). **★ Batch-9 (§9.1.8 / §28.3) — this is the diplomacy subsystem the "Cold War" label hides, and `nuke` makes the 1948 action set canonical:** **8 per-nation relation meters** (9-point Hostile→Allies; UK/France/Spain/Germany/USSR/China/Japan/Israel) + ambassador actions (Sec-State suggests, Pres approves, **one per ambassador per phase**) + a **Provoke** action (retaliatory tariff/embargo, 1–2% war chance). Build-holes to own: **DH-46 — add DOWNWARD PRESSURE on the meters** (today the US ends up allied with everyone) + a **Cold-War ≤Neutral cap on USSR/China**; **DH-45 — fix the USSR-collapse trigger chain** (it stalls at a ~5% gate → re-tune so it can fire). **★ Batch-11 (DH-59, XS) — clamp the per-nation relations floor when the 9-point scale is built (NO standalone patch).** `arkzag` caught a relations meter under-flowing its documented minimum — "Japan: 1 → 0 (↓ -1) # Error, should be 1 minimum" (ch9 POST 1259) — a decrement allowed to fall below the floor. Today the shipped `applyEffect` already clamps relations to −5..5 (`phaseRunners.ts:3223`), but the documented design is the **9-point Hostile→Allies** scale above, so the floor changes when this row replaces the −5..5 model — **fold the corrected per-nation floor/ceiling clamp into the 9-point-scale build, not as a separate fix.** Couples to the national-surplus integer (Extend Credit / Take a Loan adds debt, gated on Rev/Budget — E18g). | K2 | M | gap #25b, #26 (`gilded`/`fed`/`modern`) + **#107 the diplomacy subsystem + DH-45/DH-46 (`nuke` §28.3)** + **DH-59 relations under-floor clamp (`arkzag` ch9 1259; `phaseRunners.ts:3223`)** + DH-4 (`hd` 7346) — CARRIED + EXTENDED, HI-CONF (4 era) | ready |
| E13 | **Executive actions library (2.8.1)** | N actions/half-term on the registry (N varies by traits; `Easily Overwhelmed` → VP hand-off; control-handoff chain Incompetent-Pres → VP → Manipulative advisor, open multi-manipulator tie-break). Persistent `GameState.activeExecutiveActions` with green/yellow expiry; **auto-deactivate sweep on admin change** (2.9.4); per-action policy/govt-type gating + blunder rolls. Replaces the 4 hardcoded one-shots at `phaseRunners.ts:3636`. **Encode the DH-10 `blunderStillScores?` per-action flag** (a blundered implementation scores + moves meters "as if it succeeded" unless an action overrides) **and apply the DH-9 canonical ability-stat** decided at K2. **Batch 7 (DH-35): the row-set is era-gated and the early-republic band needs enough agency** beyond "flavor tours" (the "this era is a bore" complaint) — the Bank-War "Remove Deposits → State Banks" exec-action (E4b) is one such early-era action that lives here. | K2; admin-change hook; DH-9 (from K2) | M | gap #23, #23b (`gilded`/`fed`/`modern`) + DH-10 (`hd` 8649-8672) + **DH-35 (`rep1800` §A 2756-2760, 3110)** — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E14 | **Legislative micro-mechanics (incl. investigation committees #54 — READY) + veto override 2/3 (#82) + midterm meter+enthusiasm (#83)** | Sub-PRs on 2.6.1–2.6.3: (a) committee block-and-replace (chair may replace only a bill whose proposer has LESS Legislative AND lacks Efficient — `hd`); (b) bill packaging (won't-bundle-net-negative-unless-statehood; no split-vote; **batch-8 DH-40: package the establish-SCOTUS bill WITH its justice-count bill so a passed-court-but-failed-count cannot STALL the game** — the packaging half of the DH-40 stall fix, paired with the E25 SCOTUS-establish guard; XS-S); (c) filibuster (a **standing rule toggled ON by a law**; Disharmonious filibusters twice; filibustered bills carry + must re-pass BOTH chambers; **no Cloture until the Cloture bill passes**, ⅔ — `hd`); (d) `(Crisis)` tag + `Legislation.resolvesCrisis?` + `GameState.activeCrises?`; **(e) investigation committees (#54 — READY): the authored 5d6 "3.0.40" spec (#65)** — Speaker forms Chair+Ranking+3, roll 5d6 + 4 modifiers, 21–25 ⇒ guilty (resign + cabinet ban + ripples), dominant-party targeting, Court-Martial-d6 fallback; **(f) veto override = 2/3 both chambers (#82)** — `drums` POSTS 2180-2187 designer ruling (60% was a reverted bug); **forward-only constant** since no veto code exists today, hardcode `VETO_OVERRIDE_THRESHOLD = 2/3`; **(g) midterm uses full meter+enthusiasm (#83)** — verify-vs-build: audit the mid-cycle Senate/House caller paths through `calcStateVote` (`phaseRunners.ts:3685`); widen the caller's term assembly to the `presGeneral`-equivalent set if it's a subset. | K0, E2 (crisis + investigation bill type) | M (split 7) | gap #8–#11 (`gilded`/`fed`/`modern`; `hd`; **`arkzag` corroborates #11 — named CRISIS states fire from EconStab/HonestGov meter thresholds across the full 1820→1840 arc, meter-crater Anytime-Evos below thresholds, ch17 402 / ch19 2005 / ch27, and the crisis-bill-FAILURE −100/waiver scoring rule ch24 1993-1994**) + #54 ready via #65 (`hd` I-10) + #82 (`drums` 2180-2187) + #83 (`drums` 299-304) + **DH-40 SCOTUS-establish packaging stall-guard (`tea1772`)** — CARRIED + EXTENDED, HI-CONF (7 era) | ready |
| E15 | **Era-event extensions** | Widen `EraEvent.decider: Role\|Role[]` (roll per role); foreign-territory grants en bloc (Oregon Treaty → BC/WA/OR/ID; organized/unorganized status); `GameState.pendingEvDeltas?` applied in 2.10 on `year % 10` (census timing: run decade N, take effect N+2; focus-rep seats); Egghead-cabinet advisory step + implementation-roll layer (difficulty tiers, trait re-rolls, blunder→scandal). **Resolve the scheduling fork [divergence #4 + BUG-1 + DH-2] here** — keep the graph, layer the cap. **Reads the K5 scandal-smoother (handler 9l) to drop back-to-back at-most-once events** (DH-22 cascade fix). **★ Batch-9: era CONTENT (events / SCOTUS docket) fires on its OWN scripted clock (#109 / DH-50), decoupled from in-game history** — a player who ends Jim Crow early still can't pre-empt the Civil-Rights content (the GM house-rules a ~5%/phase trigger). This is the THIRD scheduling clock (era bands gate on game-state [K3 level a]; the census fires on a 10-yr schedule [K3 level b]; content fires here on its own clock). Add the per-event scripted-schedule field + resolve DH-50's era-event-scheduling holes on this same surface. The **structured `evDelta`/census event field (DH-48)** lives on K4's registry but is *consumed* by this walker (the per-decade census-EV-delta events fire through here). **★ Batch-11 (DH-60) — add a `requires?: Predicate` on the era-event row + a firing-path FILTER (the concrete face of #92 territory-gating; SAME surface as BUG-1 + K3's `territoryOwned`).** `arkzag` flags two era-events firing with no asset/territory prerequisite — "Force Open Trade with Japan" fired with **NO Pacific port**, "Stubborn Cherokee" fired **without owning the relevant territory** (ch4 POST 335-340) — because the deck is **not territory/asset-gated**. Verified UNBUILT: `buildEraEventsForYear` (`eraEvents1856.ts:4`) gates **only by year**, and `EraEvent` (`types.ts:1466`) has **no precondition field**. The fix is **one optional `requires?: Predicate` field on the era-event row** (reuses K3's new `territoryOwned` predicate variant — own a Pacific port before the Japan event, own the territory before a removal event) **+ the firing-path filter that consults it** — exactly the same surface BUG-1's era-lock filter + K3's `territoryOwned` content-gate already touch, so **build it WITH E15 + BUG-1** (no standalone patch). | K1, K3 (the `territoryOwned` predicate DH-60 reuses); K5 + handler 9l; **BUG-1/QW1** (same firing-path surface) | M | gap #22, #33, #34, divergence #4 (`gilded`/`fed`/`modern`) + **#109 content-on-own-clock + DH-50 scheduling (`nuke` §28.9)** + **DH-60 era-event territory/asset prereq filter (`arkzag` ch4 335-340; `eraEvents1856.ts:4`, `types.ts:1466`)** + DH-22 (`drums` 7389) — CARRIED + EXTENDED, HI-CONF (4 era) | ready |
| E16 | **Cabinet & Congressional leadership richness + cabinet retention (#8) + ★★ batch-12 cabinet→enthusiasm REWORK (#124, M — bundled from day one with the confirmation system) + offices-created-by-law (#66) + dynamic cabinet seat list (batch 6, divergence #15)** | **Coupled jobs, share the code.** ★★ **Batch-12 — RE-SCOPED M (was XS-S):** confirmation system + #124 enthusiasm REWORK build TOGETHER from day one — do NOT build today-shape confirmation only to tear it apart for #124. (1) Richness: region-coverage + **diversity floor (≥25% women/minorities)** + **intra-party faction-equity** malus; state-status eligibility guard; Ministers-to-foreign-powers seats; **Congressional 9-role pipeline** (Speaker/Maj-Min Leaders/Whips/Pro-Tem-by-seniority; RCV/weighted vote; committee-eligibility-by-prior-service; CPU auto-fill); **6-criterion faction-leader cascade** + anointing; PL fatigue + on-elect bundle + **suppress 2.2.4 + inter-party conversion in `independence`**. (2) **Cabinet retention — replace the wipe:** remove the unconditional cabinet clear at **`phaseRunners.ts:3804-3812`** (it fires every presidential cycle, even on re-election); retain occupants (modern: keep ≤5, CIA/FBI exempt), add per-officer tenure + `firingPrecedentSet` gate on *replacement* + same-faction US-Bank guard + opp-party cap. (3) **★★ Cabinet-confirmation system (DH-23) + #124 cabinet→enthusiasm REWORK — built TOGETHER from day one (M, batch-12 re-scope).** The confirmation system DOES NOT EXIST: `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step scored pick that goes straight to `cabinet[seat] = pick.id` + `addLog("confirmed")` (`:2191-:2198`) — **no committee, no Senate vote, no NAY/AYE roll**. **Build it in the right shape from day one as a SIBLING of the retention step**: a Senate confirmation step (committee → floor) with **default-AYE baseline + low-% opposition reject (the lost rule)** + **Iron-Fist Maj-Leader auto-AYE-own-picks (the §25.5.2 designer ruling, via the `compelledVoteRule?` primitive)** + **Admin-weighted lobby-maximizer (not just lobby-maximizer)** + the 50/50 Admin-1 trap fix + PPT-5-alternatives auto-confirm chain after failure + the **batch-6 SCOTUS within-1-step auto-AYE declarative rule** (§26.6.1). **★★ Batch-12 #124 (`tedchange#POST 1-4`, game-mechanics §9.3.7) — the cabinet writes change shape from day one:** **(a) LOBBY satisfaction now writes POINTS to the existing `Faction.score?` ledger** (NOT enthusiasm) — moves the cabinet-lobby coupling from `enthusiasm` to the score-ledger write path; **(b) IDEOLOGY COMPOSITION drives ENTHUSIASM via the existing ±3-cap clamp** — ≥50% cabinet of an ideology = +enth that ideology; ≤20% = −enth; **(c) 3-shifts-per-half-term cap holds; (d) Big-4 / rest-of-cabinet / cabinet-level potentially weighted differently — NUMERIC PERCENTAGES STAY DESIGNER-GATED OPEN** (Ted RULED IN CONCEPT but the numbers are TBD; ship a const table that re-tunes post-design — see Decision-gated "designer-gated" #8/#9). **CPU side = handler 9d.** **★ Batch-12 #131 (`tedchange#POST 277`) — Integrity-pol cannot nominate Controversial-pol** — wire the `canNominate(nominator, nominee)` trait filter at the cabinet picker (also QW13 standalone). **LANDS AFTER K2 + K5** (cabinet picks are CPU actions; consumes the conditional-vote-rules primitive `pop` POST 1111). **RULED by Ted (`tedchange#POST 1-4`, `tedchange#POST 277`); percentages designer-gated (§30.2 #8/#9).** (4) **Offices-created-by-law (#66):** model offices as **data created/destroyed by bills + exec actions** (`createdOffices?`), not a fixed `cabinetSeatsForYear` — Fed Chair (6-yr; creating the Fed deactivates the Independent Treasury), Chief of Staff (+1 exec action), CNO (replaces Sr Admiral; +1 Command), FBI Director (10-yr, off the 5-cap), Commerce/Labor split. (5) **Dynamic cabinet seat list (batch 6, divergence #15 / #89).** Verified: `cabinetSeatsForYear(year)` (`types.ts:1196`) is **pure derived with NO mutable state**; `phaseRunners.ts:2162` recomputes it each turn. Refactor: shipped function becomes the **BOOT SEED only** (seeds `GameState.cabinetSeats: SeatSpec[]` at boot); runners read the mutable list; **bill-sign handler appends `Legislation.createsCabinetSeat?: SeatSpec` payload** to the array. **★ Batch-9 — the dynamic seat list must support CREATE-AND-ABOLISH, not just create:** **add `Legislation.abolishesCabinetSeat?: SeatSpec`** and make `GameState.cabinetSeats` support **removal** (modern: DOE/DHS created, Postmaster General ABOLISHED, HEW split; founding: Bank/Navy/AG created by bill). Folds into this same step (5). **Consider splitting cabinet vs. Congress vs. offices-by-law vs. confirmation+rework vs. dynamic-seat-list if any feels XL.** | K0; **K2 (registry — cabinet picks are CPU actions; `requires?: AmendmentPredicate` from day one); K5 + handler 9d (CPU confirmation + the conditional-vote-rules primitive `pop` POST 1111)** | **M (batch-12 re-scope; was L with a XS-S confirmation step — the #124 rework lifts the confirmation step itself to M because the lobby-POINTS + ideology-ENTHUSIASM rewrite must land together)** | gap #25, #28–#32, divergence #8 (`gilded`/`fed`/`1772s`/`modern`) + #66 (`hd` I-11) + DH-23 (`drums` 4702-4708, 4896-4900, 867-876, 1607-1626) + **#89 / divergence #15 (`pop` 699, 1100)** + **founding offices-by-law (`new1772` §24.6)** + **#112 create-AND-abolish (`nuke` §28.5)** + **#101 office-by-bill 4th-era corroboration (`dem1820` — Postmaster→cabinet by legislation)** + **★★ #124 cabinet→enthusiasm REWORK (`tedchange#POST 1-4`)** + **★ #131 Integrity-can't-nominate-Controversial (`tedchange#POST 277`)** — CARRIED + RE-SCOPED M (batch-12), HI-CONF (5 era + founding + designer-RULED) | ready (concept); **#124 numeric percentages designer-gated OPEN — see Decision-gated "designer-gated" #8/#9** |
| **E17** | **Iron Fist trait split (§25.9 / debt #25) — M; designer-flagged** | Split `'Iron Fist'` into **≥6 office-keyed traits** (e.g. `'Stifle Competition'` primary block, `'Force Vote'` chamber compulsion, `'Compel SCOTUS'` court compulsion, `'Fire Officers'` mid-war military replacement, etc.). **Touches:** the 4 governance rows (`types.ts:1043-1047`); 3 era-event multiplier readers (`phaseRunners.ts:2915,:2931,:2959`); the 6 grant-callers in §25.9 (PL+Honest-Gov-maxed gov control, Sen Maj Leader vote forcing, President officer-fire / SCOTUS-compel / challenger-stifle, Loans-from-Wealthy + IF PL gov takeover, Convention PL unilateral threshold, mid-war military replacement). `repair()` migrates `'Iron Fist'` → all child traits (over-broad but safe), then narrower readers move to specific child traits. **Independent of K5** — the trait readers are existing code, not CPU heuristics. **⚠ NEEDS DESIGN first** (parking lot, §25.9): the exact 6 child trait names + cascade rules need a designer call before build. | independent of keystones; **§25.9 design call** (parking lot) | M | gap #77 (`drums` 2433, 2511, 2784, 3241, 3660, 4896-4900, 5353, 6293, 6471, 6568, 6703, 6852, 6881, 6907, 6912, 6922, 7012, 7224, 7364) — NEW | **needs-design** (§25.9) |
| **E18d** | **★★ batch-12 #120 — `smallbugs` DATASET UMBRELLA: ONE coordinated `scripts/seedDataset.mjs` `CURATED_ROWS` pass (M, parallelizable, orthogonal to engine work) + ★ batch-12 #121 Secessionist trait (XS, folds in) + ★ batch-12 #123 small late-modern content bundle (XS, folds in)** | **Dataset maintenance** — author-time `scripts/` work, NOT engine. **★★ #120 (`smallbugs` §2 / §3 / §4):** the `smallbugs` thread is a 3-yr+ rolling catalog of ~100 community-reported defects in the bundled dataset: **~50 named-pol fixes** (religion mislabels, wrong skills/traits, wrong birth year, swapped/duplicate bios, party/alt-state flags missing, sub-floor stat audit, alt-state misses, missing-from-dataset entries — most-common patterns: Catholic-as-Protestant religion mislabels ≥8 named cases; modern-pol recency bias ≥6 cases; trait-conflict slips ≥5 named cases; per-bill sign bugs ≥8 named cases; duplicate/collision names ≥6 cases), **~30 small mechanical fixes** (swapped bill effects + missing event prereqs + era-flag typos + region-table off-by-ones + statehood-routing inconsistency), and **~20 dataset additions** (Sequoyah / Yazoo / de Valera / Otis Glenn / Richard Bland Lee I, etc.). **Build it ONE coordinated pass via `scripts/seedDataset.mjs` `CURATED_ROWS` overrides** (NOT by hand-editing the JSON/CSV — see CLAUDE.md). Sub-tasks: (a) the ~50 named-pol fixes; (b) the ~30 mechanical fixes (bills + events); (c) the ~20 missing-dataset entries; (d) automated audits — religion-sweep, modern-pol balance audit, trait-conflict-validator, bill-effect-sign-checker. **ALSO COVERS DH-43 (Vermont home-state mapping — absorbs QW11), DH-51 (modern pols recency-biased — corroborated across 4 threads now), DH-28 (trait-conflict validator at boot, runs on dataset import).** **★ #121 (`smallbugs` §4a / POST 2, 3, 121, 122) — `Secessionist` trait MISSING from politicians dataset:** the 1856/1868 secession arc (CSA defection, secession-Senator pool, post-CSA reset) needs to identify **who would actively secede**, not just who's unionist. Per Imperator Taco Cat: *"we don't have a secessionist trait in the original politician database. It won't apply for most games, but it is very important for 1868."* Stephen Mallory (CSA Sec of Navy) is the canonical exemplar. **(a) Add `Secessionist` to the `Trait` union** (XS, one-row addition to `types.ts`); **(b) Populate the historical CSA roster** in the dataset (XS, folds into the #120 named-pol fixes); **(c) Integrate with the secession trigger E3b sub-PR (a)** — gates who joins the CSA pool when secession fires. Distinct from `Union Loyalist` (both must exist as opposing flags). **★ #123 (`smallbugs` §3 / POST 451, 475, 395-401, 642-651) — small late-modern content bundle (XS):** **(a) Wyoming Rule → Real House Act 585-cap at Era of Populism** (Ark POST 475) OR **(b) Wyoming Rule as 1.31× current EVs at 2000 Census** (POST 451, alternative formulation — see DH-49 population-model gate); **(c) runoff-election rules for the runoff amendment** in Era of Progressivism; **(d) Senate-Abolish amendment** referenced as existing; **(e) Pardon mechanics** — that's the separate **#122 designer-gated open** (parking lot). Folds these small late-modern content bits into Phase-2 #28 census recompute + Phase-2 #30 modern-era content (the `scenario1948` row), not as new engine work. **No engine code change in this row.** Place orthogonally to engine work; parallelizable. **#120/#121 RULED by the catalog (vcczar-class spot rulings); #123 a small content addition.** | — (orthogonal to engine work) | M (the ~100-item coordinated pass; #121 + #123 fold in as XS each) | gap **★★ #120 dataset umbrella (`smallbugs` §2-§4)** + **#121 Secessionist trait (`smallbugs` §4a POST 2/3/121/122)** + **#123 small late-modern content bundle (`smallbugs` §3 POST 451/475/395-401/642-651)** + DH-43 / DH-51 / DH-28 ABSORBED — NEW + AUTHORED | ready |
| E18 | **Small consistency PRs (cluster) — ★ batch-12: now ALSO the home of the Ted-RULED small consistency batch (#130, #135, #140, #141)** | Cheap independent wins: (a) old-age stat decay (age-keyed; `modern` adds add-negative-trait / strip-trait); (b) defeated-incumbent auto-retire (only-if-ran; 6yr loss-malus amendment-gated; −1 defeat malus); (c) industry-leadership compute + scoring (per-era industry set incl. the modern 8; regional shifts; **High-Tech via era event #81 + Improve High-Tech gov action**); (d) tariff integer + change-cadence + president-tariff-power toggle; **(g) `GameState.nationalSurplus?`/`nationalDebt?: number` distinct from `meters.revenue` — prereq for E2's cap + E6's debt field; BUILD THIS SUB-ITEM EARLY.** (#85 5%/half-term retire-death + military-officer mandatory 75 already shipped as QW7; #80 ±3 ideology+cabinet swing cap shipped as QW3 extension.) **★★ Batch-12 #130 (`tedchange#POST 89-100, 137-148, 195-197, 396`, game-mechanics §10.1.y) — DEATH/RETIREMENT SCHEDULE (S, pairs with QW7/#85):** verified shipped: `MORTALITY_RULES` (`src/types.ts:485-516`) has rough shape but with `frailDeathMult = 1.5` (vs Ted's "Frail rolled FIRST in death roll") — multiplier is the wrong knob; needs an order-aware loop. Ted RULES: **(1) Hale = ½ death chance** — verified `Hale` is NOT in the `Trait` union (`types.ts:36`) today, add it + `haleDeathMult = 0.5` to `MORTALITY_RULES`; **(2) Frail rolled FIRST in death roll, then oldest-to-youngest**; retirement rolls oldest-to-youngest (no Frail priority) — verified today's death loop walks `snap.politicians` in array order (`phaseRunners.ts:2358`), refactor to order-aware; **(3) Retired ex-Presidents ONLY roll for DEATH, not retirement** (closes the "John Adams immortal" loop); **(4) Cabinet members retire at END of half-term, not on appointment**; **(5)** 5%/half-term retire-death + era-scaled %s (corroborates QW7/#85 + cf82a7d3 #4 Orange's formula); **(6) auto-retire at 100** already in 2.10. **Folds into this row (pairs with #85, which is already QW7).** **RULED by Ted (`tedchange#POST 89-100, 137-148, 195-197, 396`; SUPERSEDES cf82a7d3 #4 with the full schedule).** **★ Batch-12 #135 (`tedchange#POST 65`) — 50/50 House inverse-control (XS one-line at `phaseRunners.ts:1864`)** — ALSO landable as QW12 standalone; ride here if shipping the small consistency PRs as one bundle. **★ Batch-12 #140 (`tedchange#POST 249-275`, game-mechanics §10.2.y) — ANYTIMEEVO TARGET-POOL TIGHTENING (S):** verified `anytimeEvents.ts` exists. Ted RULES: events 5/17/23/24/25/39/66/117/118/119 restricted to **Rep/Sen/Gov/Cabinet only**; **Assassination = 50% Pres / 25% random Rep-Sen / 25% random faction leader.** Per-event filter wiring + AnytimeEvo template content edits. (Alternatively co-locate with E9 handler 9g A/B/C event vote.) **RULED by Ted (`tedchange#POST 249-272`).** **★ Batch-12 #141 (`tedchange#POST 73-79`) — FL TRAIT GAIN 5%+/3%- (XS, refines existing const)** — positives per cycle as FL; negatives first-time-as-FL only. Refines cf82a7d3 §5a #4. ALSO landable as QW16 standalone. **RULED by Ted (`tedchange#POST 73-79`).** | mostly — | XS–S each (incl. #130 S, #140 S; #135/#141 XS) | gap #35–#38, #27, #3 (`gilded`/`fed`/`1772s`/`modern`; **★★ `gild1868 (b14)` corroborates the Gilded content cluster #3/#5/#6 from a native-1868 start — note: the PLAYED tariff-rate + currency engine #147 lives at the EG epic on top of this (d) static-axis sub-item**) + #81 (`drums` 2809, 3074, 3085) + **★★ #130 death/retirement schedule (`tedchange#POST 89-100, 137-148, 195-197, 396`)** + **#135 50/50 House inverse-control (`tedchange#POST 65`)** + **#140 AnytimeEvo target-pool (`tedchange#POST 249-272`)** + **#141 FL trait gain 5%+/3%- (`tedchange#POST 73-79`)** — CARRIED + EXTENDED + designer-RULED, HI-CONF (4 era + designer) | ready |
| E19 | **Faction-personality 5-step distribution + per-era card pool + nicknames + rename triggers + conditional-vote-rules primitive (batch 6, `pop` POST 1111)** | The **full 5-step allocation** algorithm (`1772s` B9) alongside the existing per-half-term drift. Plus **per-era card-count rescale** at boundaries (can split Prog/LW-Pop across 2 factions). Plus the per-(party, era, ideology) nickname table gated by leader traits + player-edit override. Plus the **deterministic faction-rename trigger registry** (§25.13 Whig→"Conservative Party": 3-condition predicate — no Republican Party + Red leader has Protectionist + Blue won 3 prez in a row; auto-generates new name; per-era authored names pool replaces the GM-admitted "kinda stupid/silly" default). **CPU side = handler 9o** (reads the rename-trigger predicate→name-generator registry). **Rebalance inelastic lobby cards — DH-11** (raw-pol-count-driven → a trifecta party can lack lobbies). **Batch 6 — conditional-vote-rules primitive (`pop` POST 1111).** Add `Faction.factionLeader.compelledVoteRule?: Predicate → Vote` (a declarative AYE/NAY policy keyed by predicate; e.g. "Sen Maj Leader NAYs any nominee with Admin<3 unless faction holds Integrity"). Subsumes BOTH per-vote Iron-Fist compulsion AND the §25.5.2 auto-AYE-own-picks cabinet rule AND SCOTUS within-1-step auto-AYE (§26.6.1) under ONE primitive. Promotes a §25.9 sub-effect to a first-class CPU primitive. **Consumed by E9 handlers #2 (legislation) BEFORE the §25.6 NAY/AYE heuristic AND #4 (cabinet)** — the primitive lives on faction-personality, the consumers are CPU handlers. Pairs with E17 (Iron-Fist split). | K3/K4 (era enum); K5 + handler 9o | M | gap #24, #5, #40 (`1772s`/`gilded`/`fed`/`modern`; `drums` POST 7406) + DH-11 lobby half (`hd` 7799) + **`pop` POST 1111 (conditional-vote-rules)** — CARRIED + EXTENDED, HI-CONF (5 era) | ready |
| E20 | **Bill-scoring leaderboard (divergence #1, Phase A) + ★ batch-12 #128 Kingmaker / Master Kingmaker per-state bonus binding** | Add `legislativeScoring(bill, faction)` (±50/100/150 per matching ideology+lobby+interest card; **failed bills also score** + ±1 per-pol reelection deltas) onto a new `Faction.score?` ledger — **the same per-era running score K3 banks-and-zeros at the boundary (#68)** and the Phase-2 enthusiasm engine (E21) consumes. Keep `cardVoteBias` (`phaseRunners.ts:1516`) as the **vote-probability** input for floor votes. (Phase B parked.) **Batch-8 placements:** **(a) #103 pres-vote modifier stack + era-stamped issue list (`tea1772`);** **(b) DH-42 BALANCE — national meters swamp per-state lean (`tea1772`).** **Batch-9 placements:** **(c) DH-52 landslide-margin-cap;** **(d) #108 gradual 4-lever realignment;** **(e) #110 modern election machine** (deep form rides E23). **★ Batch-10 placement — DH-53 bill→EV/meter STRUCTURED-effect tables (S, NOT a sign-flip):** `dem1820` corroborates `nuke`'s recurring bill-effect sign bugs from a 3rd thread (POST 462-466). **The fix is NOT a sign-flip — AUTHOR the structured per-bill effect tables**: `Legislation.effects` has **no per-state EV field**, and `applyEffect` **cannot mutate `electoralVotes`** today. Pairs with K4's DH-48 structured-`evDelta` shape. **★★ Batch-12 #128 (`tedchange#POST 316`, game-mechanics §6.5.y) — KINGMAKER / MASTER KINGMAKER per-state BONUS SCOPE (S — pin the +1 binding sites):** verified shipped: the Kingmaker bonus is **NOT YET a state-vote bonus** — `calcStateVote` (`phaseRunners.ts:3685-3722`) does NOT consult Kingmaker state to add a per-state +1. Ted's `tedchange#POST 316` rules: **basic Kingmaker = +1 in own state only** (incl. state's Pres primary + state's general); **Master Kingmaker = +1 in EVERY state** (all Pres primaries + all generals, incl. own state). Pin the binding at `calcStateVote` `phaseRunners.ts:3711` (adjust the score sum) + a new helper `kingmakerBonus(snap, candidate, stateId): number` that returns +1 if any Kingmaker in the candidate's faction is from the same state (basic) or anywhere (Master). **SUPERSEDES Matt's "state OR national, pick one" reading.** **RULED by Ted (`tedchange#POST 302-320`).** | K0; K3 (banking consumes `Faction.score`); **K4** (shares the DH-48 structured-`evDelta` schema for DH-53) | M (+ DH-53 S + #128 S) | gap #12, divergence #1 (`gilded`/`1772s`/`modern`) + **#103 (`tea1772`)** + **DH-42 (`tea1772`)** + **#108/#110/DH-52 (`nuke`)** + **DH-53 structured bill-effect tables (`dem1820` POST 462-466)** + **★★ #128 Kingmaker / Master Kingmaker per-state bonus (`tedchange#POST 302-320`)** — CARRIED + EXTENDED + designer-RULED, HI-CONF (4 era + designer) | ready |
| E21 | **Bill-driven statehood + ORGANIZE→ADMIT two-step + auto-generated officials (incl. era-gated admission + the territory-gate, batch 7)** | Statehood/territory bills route → `admitState` (`territories.ts:8`, idempotent, today only 1772 era-event `postEffects`); event/war annexation; **filler officials via E8's generator**. Federalism admits VT/KY/OH/TN/AL + MS/IN/MI/IL/LA territories. **Add per-(state, era) admission gating** (the hook E3b's Canada arc #60 rides: 1856 Quebec→statehood directly, Ontario must be a territory, NL/NM/Utah locked until Gilded). **Batch 7 (#95) — the `Territory.organized: boolean` ORGANIZE→ADMIT two-step + the unorganized-territory draft gate** (land you own but haven't *organized* has undraftable/unrelocatable pols until an organizing bill passes — LA-Purchase land, Michigan; some admissions skip the territory stage: ME/WV/TX-from-Republic/VT/CA + the 13 originals) — **this is E4b(c), and it uses the SAME `territoryOwned` predicate as K3's era-content gate (§9.1.5): one predicate, three consumers (bills, era-events, draft pool).** Class-I/II/III senator-rotation + EV join on admission; sabotaged-enabling-vote → +1-bias seed. | E2 (bill route), E3 (war annexation), E8 (filler officials), **K3's `territoryOwned` predicate** | M | gap #43 (`fed`) + per-era gate (`hd` I-5 / #60) + **#95 organize→admit (`rep1800` §A/§B/§C)** — CARRIED + EXTENDED | ready |
| E22 | **Gilded scenario [#41 — ★★ batch-14: `gild1868` is now its FULL NATIVE SPEC]** | The Gilded-Age scenario boot, **once `advanceEra` (K3) + the action libraries (E11–E13) + the CPU handler suite (E9) are mature** (§9.1.1) **and AFTER `scenario1788` (E1) — `scenario1868` is "another scenario-as-data-row" through the K4 `BootSheet`/`scenarioBoot` pipeline (§9.1.9), NOT a bespoke Gilded code path.** Gilded issue *shells* (tariff integer from E18d, `MonetaryRegime` enum, civil-service/anti-corruption, imperialism naval bases) get a data home here; the **playable depth of those shells lands at the EG gilded-era content epic below.** Resolves the gilded-enum question (K4 adds `gilded` between `nationalism` and `modern`). **★★ Batch-14 — `gild1868` (the first dedicated native-1868 campaign, the LARGEST thread in the KB) is the FULL NATIVE SPEC for this scenario:** the **red/blue-FLIPPED faction roster** (by 1868 the parties have INVERTED — **RED = Republicans** [Grant, bloody shirt, Reconstruction, tariff/business, Stalwart/Half-Breed/Mugwump], **BLUE = Democrats** [Solid South, Tweed/Tammany, soft-money/Free-Silver], `gild1868` POST 6 — the OPPOSITE of the founding-era BLUE = Dem-Rep frame, so the era-content-band model [K3/K4] must carry **party-label-by-era**, not a fixed RED/BLUE↔party mapping), the Gilded **nickname table** (Stalwart/Half-Breed/Mugwump/Bourbon/Readjuster…), the **era-event spine** (Philippines-from-Spain, women's-suffrage A/B, census EV deltas, Labor Unions/RJ Reynolds/Vaudeville/Twain/Nast/steamships), the **bill catalog** (tariff-rate / currency-regime / civil-service / ICC / statehood), the **SCOTUS docket** (Elk v Wilkins, Allgeyer v Louisiana), and the **20-yr Reconstruction timer** (#148, lives at E3b). **The deep gilded SYSTEMS (#147 tariff-rate+MonetaryRegime, #149 civil-service, #150 1872-rule, DH-63) are split out into the EG epic below** (downstream era-content, gated on K3/K4 + #116/E4c + #42 + #57/E3b). | K3, K4 (incl. the `gilded` enum + the `scenarioBoot`/`BootSheet` pipeline), **E1 (`scenario1788` ships first)**, E11, E12, E13, E9 | M–L | gap #2, #3, #41 (`gilded`; **★★ `gild1868 (b14)` — full native spec: faction roster POST 6, nickname table, era-event spine, bill catalog, SCOTUS docket, 20-yr timer**) — CARRIED + STRENGTHENED |
| **EG** | **[batch 14, ★ NEW] Gilded-era content epic — tariff-rate + `MonetaryRegime` (#147) + civil-service merit-vs-spoils (#149) + the "1872 Rule" special election (#150) + DH-63 exclusivity *(DOWNSTREAM era-content, NOT a near-term quick win)*** | **The five batch-14 `gild1868` deltas are ONE downstream era unit (§9.1.10), NOT five backlog rows** — the playable depth behind E22's Gilded issue *shells*. Split into sub-PRs: **(a) #147 tariff-as-%-rate + the mutually-exclusive `MonetaryRegime` (M)** — add `game.tariffRate: number` set/changed by a `"Set Average Tariff Rate to N%"` bill type (+ a "standardize and reform" lower-rate variant), subject to the federalism §20.4 tariff change-CADENCE; add `MonetaryRegime = 'gold' | 'bimetallic' | 'freeSilver' | 'nationalBank'` where the regime bills are **MUTUALLY EXCLUSIVE** (passing one clears the others). Replaces the ±0.5 flavor bill at `phaseRunners.ts:3421-3422` (verified: tariff is "Tariff Increase" `meters:{revenue:1,economic:-0.5}` / "Tariff Reduction" `{revenue:-0.5,economic:0.5}` today — NO `game.tariffRate`, NO `MonetaryRegime`; `Legislation` `types.ts:1506` has no `type`/`replaces`). `gild1868` floors competing literal rate-bills ("Set average tariff rate to 36%" vs "to 25% and reform," POST 6240) + gold/bimetal/national-bank regime bills (POST 836, 884). **Distinct from #3** (the static tariff/currency *axes* at E18d) — this is the *played* tariff/currency engine. **(b) #149 civil-service merit-vs-spoils axis (S–M)** — a merit-reform bill (the in-game Pendleton Act, passes the 41st Congress, POST 842) that shifts how appointments are filled + the **State-Gov-Jobs spoils lever** feeding DomStab (Increase/Decrease State Gov Jobs gov actions, POST 770/803) + the Honest-Gov't / corruption interplay; **gate reform content** (Social Mobility gov action, income-tax bill) to the Progressive era via the era-content registry (POST 811, 2936). Sharpens #3. **(c) #150 the "1872 Rule" disorganized-loser special-election branch (S, niche)** — a meter-gated branch around `calcStateVote('presGeneral')` (`phaseRunners.ts:3752`): at the first election after Reconstruction begins, if party-pref is Red+2/+3 AND a d6 lands 1-2, field an opposite-party-INDEPENDENT nominee run by the loser's WEAKEST faction (rule 3.0.17, POST 49/774-775); pairs with #57/#148 + the #48 third-party trigger. **(d) DH-63 currency-regime exclusivity — FOLDS INTO #42 + #147's MonetaryRegime (XS–S, no standalone work)** — make currency-regime bills a mutually-exclusive set in the bill-relationship graph: activating one auto-deactivates the contradictory regimes (today Bimetallism AND the Gold-Standard Act can both be active, `gild1868` POST 6245-6246, because `Legislation` has no `type`/`replaces`); also flags the filibuster carry-over ambiguity (POST 939 — matches the `drums`/`hd` open Q on #10). **★ DOWNSTREAM era-content, NOT a near-term quick win** — the tariff/currency systems need the economic-content state machine and the bill-relationship graph to EXIST first; build this AFTER the era model + the economic engine land. The umbrella `gilded` era + `scenario1868` lives at E22/#41; **#148's 20-yr Reconstruction timer rides E3b, not here.** | **K3/K4** (the `gilded` enum + the era-content-band registry — era-gating for #149's reform content + #147's §20.4 cadence), **#116 / E4c** (the Jacksonian→Gilded economic content state machine #147's tariff/regime bills extend), **#42 / E2** (the bill-relationship/replacement graph — `Bill.type`/`replaces` for #147 + DH-63 exclusivity), **#57 / E3b** (Reconstruction-begins gate for #150 + #148's regime); E22/#41 (the `gilded` era + scenario this content fills) | **M (#147) + S–M (#149) + S (#150) + XS–S (DH-63 folds into #42+#147); ~M–L total (split 4 sub-PRs)** | gap **#147 tariff-rate + MonetaryRegime (`gild1868` POST 836/884/6240/6245-6246)** + **#149 civil-service merit-vs-spoils (`gild1868` POST 1/770/803/811/842/2936)** + **#150 "1872 Rule" special election (`gild1868` POST 49/774-775)** + **DH-63 currency-regime exclusivity (`gild1868` POST 939/6245-6246)** + #3 tariff/currency axes — NEW (batch 14) | ready |

### Engine track — Phase 2 (FAR-END modern epic — builds LAST, after gilded)

> The **deep-modern subsystems** — they sit at the end of the timeline and depend
> on the meter bank, the action libraries, and the scaling walls all landing
> first. Build them **after E22 (gilded)** (§9.6 Phase 2). The cross-cutting items
> the modern thread *also* surfaced are already pulled near-term into Phase 1
> (E6/E7/E8) — these rows are only the era-deep work.

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| E23 | **Enthusiasm / Party-Pref engine + Score economy [#51 — ★ batch-11: FORK-RESOLVED, the 4-step rule is now SETTLED]** | The **4-part reshuffle** after legislation scoring (`hd` dominant-party point-impact: most/least-earning faction shifts ±1, opposition-least +2 "furious"; `drums` independently confirms 4-step across a 3rd era POSTS 50/86/295/442/2537/2726/2879/3115) over the existing `enthusiasm`/`partyPreference` tables; `Faction.score` ledger (from E20) + **era-end awards + per-era banking (handled by K3) + lowest-faction-penalizes-teammates**. Wires into E6's `metersToElectionBonus`. The spine of the modern election engine. **★ Batch-11 (#51) — PROMOTED, the model is now SETTLED.** `dem1820` exposed a 3-way GA-vs-designer fork; the `arkzag` final chunk **published the 4-step rule VERBATIM and it MATCHES `drums`** (NOT Ted's "every state", NOT Matt's "primaries only"). Build the canonical 4 steps per Congress's by-card→by-faction legislation tally — **(1)** faction with MOST pts for the dominant party → its cards +1 enthusiasm toward the dominant party; **(2)** LEAST pts for the dominant party → −1 away; **(3)** MOST pts for the opposition → +1 toward the DOMINANT party ("taking care of their needs"), only if it gains pts; **(4)** LEAST pts from the opposition → +2 toward the OPPOSITION ("furious at the incumbent"), even if it gains pts — **shifts STACK** (`arkzag` ch33 POST 2530-2532). **Plus the −100/waiver crisis-bill-FAILURE rule:** a failed crisis bill normally scores −100 to the faction, **but the −100 is WAIVED if the bill conflicts with that faction's ideology → instead +1 enthusiasm** (ch24 POST 1993-1994). **The hard ±3 per-phase cap on ideology+party-pref swings is UNCONDITIONALLY ready and ships with E6** (it binds at `calcStateVote` `phaseRunners.ts:3709-3711`; cap source `arkzag` ch33 POST 2438-2456 / `drums` POST 4574) — it is NO LONGER gated. **The ONLY remaining open piece is #18's meter→election STATE-SCOPE** (does a per-ideology-card bonus apply to every state unless penalized, or only ideology-leaning states?) — that stays in **Decision-gated**, but it does NOT block this enthusiasm-SHIFT engine. | E6 (meter bank + the ±3 cap), E20 (`Faction.score`), K3 (era-end awards/banking) | M–L | gap #51 (`modern`; `hd` 1394-7799, I-12; **`drums`** 4-step confirmed 3rd era + era-end POST 4477; **★ `arkzag` SETTLES the fork — 4-step verbatim + −100/waiver, ch33 POST 2530-2532 / 1993-1994 / 2438-2456**) — CARRIED + EXTENDED + FORK-RESOLVED, HI-CONF (4 era) | ready |
| E24 | **Presidential primary subsystem (2.9.1) + Primary-Era opt-in (#63)** | Full subsystem: candidate eligibility + blocking (Iron-Fist PL blocks; running incumbent can't be primaried), focus-state charisma-trait table, numeric Strength score, per-Primary-Group loop (debate momentum / scandal / Broke check / actions). Uses the **CPU delegate engine** (from E10) + K2 primary action library + **K5 handler 9i** for CPU. **`hd` adds the emergent Primary-Era calendar (#63):** a Gov "Activate State Primaries" action (WTA/plurality/proportional + Primary-Group 1–5 assignment) flips a Primary-Era flag (primaries precede the convention), spreading by bill/Gov-action; Momentum carries between groups but halves when large; resign-to-run cascade. **`drums` adds the explicit CPU template** (fixed 5-action: Speech+Focus+Attack+Embrace+Promise; attack-target = highest-PV rival; presidential-promise acceptance < half-target; broke roll 5-6 → drop) — wired via handler 9i. New `needsPlayerInput: 'primary'` + `primary?` ledger. **The primary era is the modern toolkit that the pre-primary early-republic bands LACK (DH-35) — its unlock (the Primary-Era flag, gated on the 12A-era convention machine + #63) is what differentiates early-era from modern agency.** | K2, E10 (CPU delegate engine), K0, **K5 + handler 9i** | L | gap #47 (`modern`) + #63 (`hd` I-8; `drums` 5125-5732, 6754, 7135) + **DH-35 era-unlock (`rep1800` §A 3110)** — CARRIED + EXTENDED, HI-CONF (3 era) | ready |
| E25 | **SCOTUS named-Justice docket (divergence #7) — incl. #79 10-yr drift via K5 handler 9n + ★ batch-12 #142 CPU CJ ladder + #132 Challenge-Legislation filter; ★ batch-12 SIMPLIFIED — amendments NOT SCOTUS-challengeable** | From-scratch over a **stub** (4 hardcoded titles + `partyPreference ±0.1`, `phaseRunners.ts:3398-3414`). Per-term case docket (`src/data/scotusCases<Era>.ts`), per-Justice ideology votes, Iron-Fist/Manipulative compel-vote + compel-retire (12-yr min; **5 Judicial + Integrity = immune** — `hd`), dynamic court size + court-packing, 64/60% confirmation + moderate-auto-confirm recovery, appointee ideology reveal + **10-yr drift via handler 9n: 25% mid / 10% left / 5% right; Puritan blocks all shifts (#79 canonical, `drums` POST 7533)**, ruling→law-deactivation. **`hd` adds:** a **5-5 tie affirms the lower court & sets no precedent**, and a ruling can **block a whole bill class until an amendment passes** (couples to E5's #64 hook). **`drums` adds:** Manipulative-Pres compelled retirement = d6 5-6 (~33%; POST 1142); Iron-Fist compels cross-party justices without Integrity to vote Nay (POST 6293); SCOTUS sway = ONE vote per swayer + only if initial vote not unanimous (POSTs 4591, 4741, 5079). **Batch 7 adds:** **(a) the DH-32 guard — a STATE cannot be ruled unconstitutional** (one rule in the ruling-effect path: a territory can be revoked, secession is the only un-making of a state; `rep1800` "Pickens v. Maine's Existence" passed 5-1 and voided Maine AFTER a census counted it); **(b) the persistent `Cohens`-style ruling→bill-class rule-modifier (#94)** — the same SCOTUS-ruling-gates-a-bill-class shape E4b's slavery-abolition block rides (couples to E5's *Pollock* hook). **★★ Batch-12 (`smallbugs#POST 250-269` vcczar, game-mechanics §30.3) — AMENDMENTS NOT SCOTUS-CHALLENGEABLE: BUILD-TARGET SIMPLIFICATION.** vcczar's ruling **OVERRIDES `tea1772` #100**: Govs cannot challenge ratified amendments via SCOTUS. **★ DROP** the Gov-requested-judicial-review-of-an-amendment branch from this row's docket scope (the batch-8 #100 addition is SUPERSEDED — strike that whole sub-path). **KEEP** the strike-a-statute path, the DH-32 state-guard, the bill-class-block via amendment, Justice drift, court size, court-packing. Pairs with E5's same DROP. **Batch 8 also adds:** **(d) the DH-40 STALL guard — a SCOTUS-justice-COUNT bill must not strand the game:** if the establish-court bill passes but the justice-count bill fails (or vice-versa), the court is unusable and `tea1772` STALLED (an XS-S bug-fix — **package the two bills together OR guard the half-built-court stall**; this is the SCOTUS-establish half of the bill-packaging fix, the packaging half lives at E14b). **Batch 9 adds:** **(e) #112 — court size is LEGISLATED and variable, with excess-not-replaced semantics** (`nuke` §28.5: "Set SC to 10/5", court-packing-when-one-turns-70). Add a **`courtTargetSize` field** set by a bill (rides the bill-typing path E2) + the **excess-not-replaced** rule. Generalizes the dynamic-court-size/court-packing item already in this row. Gates BUG-2. **★★ Batch-12 #142 (`tedchange#POST 387-390`, game-mechanics §22.7.y) — CPU CHIEF JUSTICE SELECTION LADDER (XS, the ladder spec is FULLY AUTHORED):** **Highest Judicial ability from their party → multi-faction tie: own faction → Pres-ideology match → lowest-scoring faction; multi-candidate tie: matching-appointer-ideology → random.** Folds the existing CJ-replacement writer (`chiefJusticeId`) into a `pickChiefJusticeCpu(snap, vacancy, appointerFactionId)` ladder helper. **RULED by Ted (`tedchange#POST 387-390`; sharpens #52 player-SCOTUS fork — the CJ ladder is CPU-side regardless of which control-fork wins).** **★ Batch-12 #132 (`tedchange#POST 246-248`) — Challenge-Legislation Gov Action cannot target REPEAL bills** — wire a filter on the Challenge-Legislation action target list at this E25 docket / the E11 gov-actions surface (also QW14 standalone). **★ Batch-12 #131 (`tedchange#POST 277`) — Integrity pol cannot nominate Controversial pol** — extend the trait-aware `canNominate(nominator, nominee)` filter to CJ/Justice nominations as well as cabinet (also QW13 + E16). **★ Batch-10 — the SCOTUS DOCKET is needed EITHER WAY; only the player-vs-CPU control surface is decision-gated (#52, parking lot — user-gated):** `dem1820` runs a LIVE player-controlled court (delay/dismiss is a player action, votes by-ideology). **That fork does NOT block this row** — the per-term docket (`scotusCases<Era>.ts` + `GameState.scotusDocket`) is required whoever drives the votes (shipped court is a coin-flip at `phaseRunners.ts:3397,3648` with no docket). **Build the docket; gate only the player-input surface on the #52 pick** (delay/dismiss-as-player-action vs CPU-by-ideology). | K0, E5 (amendments + the bill-class-block hook), E2 (court-packing/set-count bills), **K5 + handler 9n**; **the player-input surface only is gated on the #52 decision (parking lot — user-gated) — the docket is not** | M–L (slightly REDUCED net by batch-12: drop SCOTUS-overturns-amendment branch; add the XS CJ ladder + the XS filters) | gap #52, divergence #7 (`modern`; `hd` 4616-8651; `drums` 39-7533 incl. canonical drift #79; **`dem1820` live player-controlled court — docket needed either way, control gated**) + **DH-32 + #94 rule-modifier (`rep1800` §B 3632, 3646-3652)** + ~~#100 amendment-review~~ **SUPERSEDED batch-12 / `smallbugs#POST 250-269`** + #100's threshold half retained + DH-40 stall-guard (`tea1772`) + **#112 legislated variable court size (`nuke` §28.5)** + **#52 by-ideology docket corroborated across the full arc + a CONTENT-SUPPLY gap (`arkzag` — Amistad/Barron-v-Baltimore/Antelope rulings, ch5 394 / ch13 71 / ch32; "40-Year Min Age for SC Justices" amendment recurs ch28)** + **★★ #142 CPU CJ ladder (`tedchange#POST 387-390`)** + **#132 Challenge-Legislation filter (`tedchange#POST 246-248`)** + **#131 Integrity nominator filter (`tedchange#POST 277`)** + **★ batch-12 amendments-NOT-SCOTUS build-target simplification (`smallbugs#POST 236-269`)** + **★★ `gild1868 (b14)` corroborates #52 from a native-1868 start (named-Justice docket: Elk v Wilkins, Allgeyer v Louisiana; 10-yr ideology drift; a court-size bill)** — CARRIED + EXTENDED + SIMPLIFIED, HI-CONF (6 era + founding + native Gilded + designer-RULED) | ready (docket); player-control surface decision-gated (#52 user-gated) |
| E26 | **Third-party challenge trigger (2.9.3)** | Party-pref-band + ideology-discontent check → spawn an independent ticket from the rule-selected faction; nationwide ballot for a Celebrity. **Fills the 2.9.3 stub.** **Rebalance the apparent Dem structural bias — DH-11** (Dems reportedly "won every instance a 3rd-party run mattered"). **★ Batch-9 (DH-55): the engine is 2-PARTY-HARD-WIRED + 3rd-party PV needs region-weighting.** `nuke` flags that a serious 3rd-party run is structurally near-impossible because the resolver assumes two parties and a 3rd-party candidate's vote isn't region-weighted (a strong regional candidate should over-perform in his region). When this stub is built, model **region-weighted 3rd-party PV** and ensure the spawn path isn't blocked by the 2-party assumption (pairs with DH-11 + DH-26's prohibitive-VP-trait, both already folded here). | E23 (enthusiasm/Party-Pref engine) | M | gap #48 (`modern`) + DH-11 3rd-party half (`hd` 7480-block) + **DH-55 region-weighted PV + 2-party-hard-wired (`nuke`)** — CARRIED + EXTENDED | ready |
| E27 | **Military-leadership appointment tier** | JCS / Army Chief / CNO / Generals / Admirals above the existing `GeneralInChief`/`Admiral` seats; auto-confirm; promotion back-fill; rank-mismatch + passed-over-resign rules. Feeds the generic-war per-battle modifiers (SecDef + Joint-Chiefs ×2, leading-officer ×10). Pairs with E3/E3b. | E3 (generic war), E16 (cabinet richness) | M | gap #49 (`modern`; pairs with `hd` #56; **`drums`** confirms officer KIA + replacement chain) — CARRIED, HI-CONF (3 era) | ready |
| E28 | **53-state roster + Wyoming-Rule apportionment + two-home-state pols + the focus-Rep (EV−2)/5 House abstraction (#55, batch-10 sized M)** | Modern 53-state roster (DC/CU/PR as full states); decennial recompute that resets EV + `bias` + adds/removes a focus-Rep (same `pendingEvDeltas` as E15, larger scale); `Politician.homeStates?: string[]` (audit relocation/Carpetbagger + kingmaker readers — also the alt-state add from #69). **Needs E7 (House-slate persistence) first** — the Wyoming-Rule House size (~572–601) is *why* wall (b) is a hard prerequisite. **★ Batch-10 — the House focus-Rep ABSTRACTION + seat-locked incumbency (#55, M):** `dem1820` makes the DESIGNED-not-shipped rep model concrete (vcczar ruling, POST 704) — represent each state's House delegation as **`(EV − 2) / 5` focus-Reps** with **seat-locked incumbency** (incumbents hold their seats EXCEPT in census/redistricting years), instead of the **full per-seat reps the engine ships today** (`scenario1856.ts:93` seats full delegations; `phaseRunners.ts:3913-3939` recomputes per-seat). This both **cuts the manual-upkeep burden** (the focus-Rep count is what makes a 53-state / ~572-seat House tractable — the DH-36 burnout argument) and is the unit the census recompute (#34) operates on. **Folds into scaling-wall-(b) (E7) + this census epic.** (vcczar's long-term wish is full per-district simulation [+30k pols] — a parking-lot "AMPU 2.0" alt, NOT what the build models; the build ships the focus-Rep abstraction.) | E7 (House-slate persistence), E15 (census-delta queue); **DH-49 population model (parking lot) for the EV/apportionment recompute** | M–L (+ focus-Rep M) | gap #55 (`modern`; **`dem1820` (EV−2)/5 + seat-locked incumbency, vcczar POST 704**), #34 (`modern`) — CARRIED + EXTENDED, HI-CONF (2 era) | ready |
| E29 | **Modern legislative depth (+ impeachment rewrite, batch 7 DH-33; ★ batch-12 #126 Pres 2-step Admin-then-Command blunder rule)** | Collective crisis-bill accountability (chamber lets most crisis bills die → controlling party loses Party Pref); bill-relationship/replacement graph (amendment-tier bills repealable only by amendment; downgrade-only policies); **Executive-Branch-Interference** (Admin 4–5 cabinet sec proposes dept bill w/ presidential assent; new-dept→new-seat). **#54 investigation committees already shipped at E14e** (5d6 spec ready). **DH-1 (filibustered MUST-pass remedy) still needs rules authored first** — author the deadlock rule, then build into E14c/here. **Batch 7 (DH-33): the impeachment ruleset is flagged broken/outdated across a 2nd campaign** (`rep1800` corroborates `hd`); only resignation avoids the DomStab/Honest-Gov drop. **The impeachment rewrite needs rules authored first (parking lot — DH-33 + DH-54)**, then built here. **★★ Batch-12 #126 (`tedchange#POST 159-164`, game-mechanics §14.1.y) — PRES IMPLEMENTATION 2-STEP ADMIN-THEN-COMMAND BLUNDER RULE (S, NOW CANONICAL — was OPEN as `cf82a7d3 §5a #3`):** verified shipped: no Pres-implementation path exists as a discrete code site — bill effects apply via `applyEffect` (`phaseRunners.ts:3209`) with NO Pres roll, NO Admin step, NO blunder. Ted's `tedchange#POST 159-164` publishes the **AUTHORITATIVE 5-tier Command-modifies-blunder table** (supersedes the fuzzy `cf82a7d3 §5a #3` "hybrid" wording): **Step 1:** Pres rolls Admin for impl (same as cabinet). **Step 2 (Blunder check):** Pres Command modifies the blunder — **Cmd 5 + relevant expertise = avoids blunder**; **Cmd 4 + expertise = 50% avoid**; **Cmd 3 + expertise = +1 to blunder**; **Cmd 2 + expertise = 50% chance +1**; **Cmd 1 + expertise = normal**; **no Cmd / no expertise = −2 to blunder** (unless Efficient on impl team); **Incompetent = −3**; **Easily Overwhelmed skips step 2 entirely.** Where it binds: the **Pres-implements-bill code in this row (`runPhase_2_6_*` extension)**, NOT in `applyEffect` itself (which stays the post-roll write). Size: S — a roll-table + a trait-gate; the trait readers exist. **NOW READY (was OPEN). RULED by Ted (`tedchange#POST 159-164`; SUPERSEDES `cf82a7d3 §5a #3`).** | E2 (bill typing), E14 (committees/filibuster); **DH-1 + DH-33 need rules authored first (user-gated)** | M (+ #126 S) | gap #54, #12b, DH-1 (`modern`) + **DH-33 (`rep1800` §A 465-474; §B 3594, 3620)** + **★★ #126 Pres 2-step Admin-then-Command (`tedchange#POST 159-164`; SUPERSEDES `cf82a7d3 §5a #3`)** — CARRIED + EXTENDED + designer-RULED | **needs-design** (DH-1 + DH-33 user-gated); #126 + rest ready |
| E30 | **`scenario1948` modern continuation + the Cold-War boot (split from the single modern epic, batch 6; ★ batch-9 details the boot)** | The continuation-mode capstone: modern faction roster + nickname menu, modern era-event spine (fictional eras: **Nuclear Age 1948–2000 → Era of Terror 2000–~2005 → Era of Populism**), modern bill/issue catalog, modern card pool (Big Tech/Big Oil/Globalists/LW-RW Media — correct *here*). Reached via `advanceEra` (continuous campaign) from gilded **OR booted directly** via the K4 `BootSheet` schema. **★ Batch-9 (`nuke`) details `scenario1948` as a FOURTH distinct boot shape** (alongside 1772 / 1856 / 2012): **Truman/Barkley seated; 48 states** (AK/HI arrive later as statehood bills); **5R/5B with Dixiecrats INSIDE Blue + Reagan-a-Democrat** (the realignment start, #108); the full modern + Cold-War cabinet (CIA/FBI/UN/Fed/NSA/Key-Advisor + **8 ambassador nations incl. Ambassador to the USSR**); a ~6-yr era→year clock offset. **Cold-War "content" is DATA, not a subsystem** — the war runs on the generic war engine (E3), foreign relations on the diplomacy subsystem (E12); the Era-of-Terror content (#113) is one more authored era-content block. **State roster: 53-state Wyoming-Rule + 2-home-state pols** — the product of 60 in-game years' worth of annexation events. **Needs the modern dataset slice to get a curation + parity pass — DH-51: modern pols are OVERPOWERED / recency-biased** (fix at the `scripts/` pipeline before this ships). Rides the K4 `BootSheet` schema (`scenario1948`'s faction decks differ from 2012's — e.g. no "Trumpism" deck yet). **BLOCKED on DH-25 (career-track bootstrap) being authored first** — `pop` POST 33: *"we've legit been having this discussion for almost three years now"* (corroborated by DH-56's conflicting career-track rule-sets). **Dead last in the continuation chain** — depends on every keystone + most subsystems above. | K3, K4 (BootSheet), DH-25 resolved (parking lot), DH-51 dataset pass, and most of E1–E29 | XL | gap #2, #41, mechanics §22 (`modern`) + #86/#90 (`pop`) + **the `scenario1948` boot + #113 Era-of-Terror content + DH-51 dataset balance (`nuke` §28.1)** — CARRIED + EXTENDED | **needs-design** (DH-25 only); rest ready (build last) |
| **E31** | **`scenario2012` fresh-modern boot — the canonical `BootSheet` instance (NEW, batch 6)** | A **second** capstone Phase-2 scenario, sibling to E30: a **fresh-modern boot** to 2012, the canonical `BootSheet` schema instance from §26.1 / `pop`. Pre-built sheet: **10 pre-built faction decks** (5 Blue + 5 Red — R1 = "Trumpism" RW Pop + Trad + Nationalist + Protectionist + RW Media + Isolationists; B1 = "Bernie-populism" LW Pop + Reformist + Welfare + Public Housing; etc.) + **per-faction archetype politicians** + **sitting government pre-loaded** (Obama + Biden + 7-Dept cabinet + 50-state Congress + 9-named SCOTUS justices, mapped to the 2012 historical snapshot) + **state roster: 50 + DC** (NOT 53 — `modern`'s 53-state alt-history is the product of 60 in-game years of annexation events, so the same `modern` enum has BOTH rosters; divergence #17 — registry keys on `{era, startYear}`) + **EXPLICITLY EMPTY at boot:** no faction leaders (selected after first general — AMPU primary where Major-eligibility falls back to generic 1-cmd + matching ideology + matching interest/lobby), no career-track pols (Zagnut "1996+, 1/track" houserule pending DH-25), no inherited PV/Kingmaker-Protégé/legacy. **Era-coded double-points issues** (#87): Climate Crisis + Immigration. **APOCALYPSE Planet Health clock** (E6) is live in this era. **Procedural pol generation starts in the 2020 draft** (#90 / rule 3.0.18; 1 new pol per state per cycle). **BLOCKED on DH-25 (career-track bootstrap) being authored first.** **The 2012 boot is the canonical `BootSheet` instance — schema instantiation, not new mechanics.** | K3, K4 (BootSheet — the canonical instance), E6 (APOCALYPSE clock), E8 (procedural pol-gen for 2020+), E23, E24, E25, E27, E28 (the 50+DC variant of the roster work); DH-25 resolved (parking lot) | XL | gap #86 (`pop` 1, 12, 17, 30, 38, 45, 50, 54, 264, 419, 422, 426, 475) + #88 + #90 + DH-25 — NEW | **needs-design** (DH-25 only); rest ready (build last) |
| **E32** | **(Optional, batch 7) `scenario1800` fresh boot — another `BootSheet` instance** | A **LOW-PRIORITY optional** later boot-sheet instantiation (§9.6): a fresh boot to 1800 with a pre-seeded Pres/VP/Cabinet/6-Court/Congress + a rookie draft, **NO faction leaders / career-tracks at boot** (the EXPLICITLY-EMPTY baseline). **NOT a priority** — it sits in the federalism→nationalism band that `scenario1788` (E1) + `scenario1856` (shipped) **already cover**; it adds no new mechanics, only another data instantiation. **Place it only once the K4 `BootSheet` schema + the early-republic subsystems (E4 12A toggle, E4b slavery-flag / Second Bank / statehood-by-bill) have landed** — at which point it's nearly free. | K4 (BootSheet), E1 (early-republic content), E4 + E4b (the early-republic subsystems) | M | **`rep1800` (the campaign itself; §9.6 batch-7 note)** — NEW | ready (build last, optional) |

### Presentation track (parallel — separate workstream)

> Almost all of P0–P4 are **read-only views over snapshot data that already
> exists** — independent of the keystones/engine subsystems. Sync points are a
> handful of small additive `Politician`/`Party` fields + **two deeper handoffs**:
> A4 (battle-card) wires real numbers when **E3 (generic war)** lands, and **P2
> (portraits) shares the demographic model with E8 (procedural pol generation)** —
> P2 must render *generated* pols. **Hard constraint, encode from day one: no
> AI-generated imagery or text in the shipped product.** **A9 is NOT on this track**
> — it is a state-shape + engine UX requirement (it lives at E7).

| # | Item | Scope | Depends on | Size | Source | Status |
|---|---|---|---|---|---|---|
| P0 | **Ideology→color palette** *(cross-cutting foundation — do first)* | `IDEOLOGY_COLORS: Record<Ideology, string>` in `src/theme/` (the per-*ideology* legend; `Party.color` exists but this does not). Many P-track items consume it. Independent of the engine track. | — | XS | gap A2, §9.1 K1.5 (`1772s`) — CARRIED | ready |
| P1 | **Politician card + roster/congress restyle (A2/A3/A5/A6)** | "Sport-card" infobox (portrait/traits/stats/PV/office), always-on styled scoreboard, era-correct office titles, honorific-memory + "remembered for…" legacy lines (small additive `Politician` fields). | P0 | M | gap A3, A5, A6 (`1772s`) — CARRIED | ready |
| P2 | **Procedural portrait pipeline (A1)** *(no AI in product)* | CK2-style layered-sprite procedural portraits for the ~18.5k long tail + hand-art slots for marquee figures. Asset-pipeline + renderer epic. Only engine touchpoint: the additive `Politician.portrait?` field. **Must cover GENERATED pols** — shares the demographic model with **E8**. **Hard no-AI-in-product.** | P0; `Politician.portrait` field; shares demographic model with E8 | L | gap A1 (`1772s`; `modern`) — CARRIED | ready |
| P3 | **Election-result maps + iconography (A7)** | Election-result maps + era-correct national/state flags. Prototyped on 1856; most valuable after more states exist. **Batch-3 bar:** auto-generate the **53-state map + per-state popular-vote % atlas**. | P0 | M | gap A7 (`1772s`; `modern`) — CARRIED | ready |
| P4 | **Narration voice (A8)** | A `log.ts` output-quality bar (in-character narration density), not a schema change. Smallest; ongoing. | — | XS–S | gap A8 (`1772s`) — CARRIED | ready |
| — | **A4 battle-card** *(wired by E3)* | The itemized additive-odds battle-card (difficulty + planning + commander + meters → % victory). Build the card shell early; wire real numbers when **E3 (generic war)** surfaces the itemized odds — and reuse it for E3b's two-theater Civil-War battles. | E3 | S | gap A4 (`1772s`; `hd` I-1; `drums` formula) — CARRIED | ready |

---

## Later / parking lot

Bigger, fuzzier, deferred, or **needs-design-before-build**.

### Author-before-build (design tasks — a PM/design job, not a `/build-feature` run)

These have **no rules to build to yet**; the rules must be **authored first**, then
they fold into the engine row noted. **★ Batch 9 adds TWO NEW author-before-build
items → 12 total:** **DH-49** — a **POPULATION MODEL + House cap** (the one
genuinely-NEW infrastructure item this batch: the per-decade census EV-reallocation
[K3 level (b)] and the Wyoming-Rule apportionment [E28] are un-implementable without
a per-state population model + a House-size cap, and **neither exists today** —
`State.electoralVotes` is a static seed; author it OR size it into the
census/apportionment epic E28 as its first sub-task); and **DH-54** — an
**impeachment / VP-vacancy / succession ruleset** (never in the rules doc across 3
campaigns; corroborates DH-33; folds into E10b + E29). **Batch 8 added ONE:**
**DH-41** — the general SCOTUS-ruling → downstream-statute cascade (UNBUILT,
`vcczar`-deferred; folds into the SCOTUS docket E25 once decided). **Batch 7 added
ONE:** DH-33 impeachment-ruleset rewrite (folds into E29) — plus a separate
**roadmap DECISION** (DH-34 static-era-biases — *resolved: ship static*; see the
note below, it is **not** an author task). **Batch 6 added ONE BLOCKER:** DH-25
career-track bootstrap (3-yr-stale design discussion; **BLOCKS Phase-2 modern
scenarios E30 + E31**). **Batch 5 added six items:** contingent-election rules
(#10/#84 is the biggest), §25.9 Iron-Fist split, DH-12 white-peace, DH-13
faithless-elector cap, DH-14 era-aware bill ideology, DH-15 small-state action
multiplier. **Batch 10 adds NO new author-before-build items** — its one new gap
(#115) is a buildable pipeline folded into K4 (not a rules-authoring hole), and the
**#115b** appointment-ladder is an XS item owned inside K4/E16. **Batch 11 adds NO
new author-before-build items either** — its two new gaps (#116 economic engine →
E4c, #119 amendment lifecycle → E5) are buildable subsystems, #61's succession ENGINE
is ready-to-build (its line-of-succession/impeachment half is the ALREADY-LISTED
**DH-54**), and DH-59/DH-60 are sized bug-folds. **★ Batch 12 adds ONE new author-
before-build item → 13 total: #122 PARDON MECHANICS** (entirely unspecified — no
rules in the doc; per Bushwa777 `smallbugs#POST 113`, what gets undone when a pres
pardons a Controversial pol with a scandal: trait, election malus, impeachment-
disqualification? what political cost on the pardoner? Pairs with the impeachment
machinery #112 + the resignation-while-impeached penalty pipeline + the cabinet-
Scandalous-Office-Holder loop; **author-time decision, no ruling yet** — folds into
**E29** when authored). The OTHER 18 batch-12 Ted-rulings are RULED + slotted (not
author-before-build), and #120/#121/#123 are dataset/content additions (not author-
before-build). **★ Batch 13 adds NO new author-before-build items** — its
buildable prerequisites (**DH-61** boot-seed active wars → K4 pipeline, **DH-62**
pre-12A EC mode → E4) are sized engine work that lands WITH E1, not rules-authoring
holes; **#143** is a RULED XS quick-win (QW17); the **#61 death-branch** is RULED
(re-scopes E10b); and its TWO open design calls (**OC-4** off-ideology draft gate,
**OC-8** define-an-office) go to the **designer-gated** Decision sub-bucket (waiting on
Ted/vcczar), NOT the author-before-build list. **★ Batch 14 adds NO new author-before-build
items either** — all five `gild1868` deltas are buildable engine work: **#147/#149/#150 +
DH-63** are the EG gilded-era content epic (downstream subsystems gated on K3/K4 + #116/E4c
+ #42, NOT rules-authoring holes), and **#148** is a sized S–M extension of E3b (the 20-yr
Reconstruction timer + appoint-by-Speaker/PPT-faction + Solid-South sunset). The Gilded
era + `scenario1868` is K4 content (#41/E22). **Total author-before-build items: 13** (UNCHANGED)
(DH-1, #10/#84, §25.9, DH-12, DH-13, DH-14, DH-15, DH-25, DH-33, DH-41, **DH-49**,
**DH-54**, **#122 pardon mechanics batch-12**). **Decision-gated category — held at 2 by batch 11, UNCHANGED by batch 14** (batch 10 introduced it
with #52 + #18/#51): the **#51 enthusiasm-SHIFT fork was RESOLVED** (`arkzag` 4-step →
E23, leaves the category), and a **NEW delegate-class fork ARRIVED** (AI-allocator vs
player-rigged), so the two remaining picks are **#52 player-controlled SCOTUS** and
**#18-state-scope + the delegate-class fork** (both election-engine). See the
**"Decision-gated"** subsection below.

- **DH-1 — filibustered "MUST-pass" bill remedy (needs-design).** A required
  bill filibustered to death has no rulebook remedy; the GM improvised a
  4-leader special-committee auto-pass with a per-day "shutdown" penalty clock.
  **Author the deadlock-resolution rule** (forced-compromise vs shutdown-clock
  vs fallback auto-pass), then build into **E14c (filibuster) / E29**. — DH-1,
  debt #21 (`modern` 640-716).
- **Divergence #10 / #84 — Contingent-election rules don't exist (NEW, batch 5).**
  GM Tyler invented **5 candidate rulesets** to settle 1848 tie (`drums` POSTS
  472-474): party-line state vote / faction-first then party / Speaker-Min-
  Leader-controls-state / momentum+swaying / state modifiers. All 5 favored
  Fillmore; GM picked #4 (momentum) to keep play moving. **Author rules
  BEFORE build:** (a) top-2 vs top-3 (DH-6: GM used top-2); (b) outgoing-vs-
  incoming Congress (GM nebulous, used incoming POSTS 4467-4475); (c) deadlock
  side-effects (EBR POST 5250: Controversial gain on elected Pres + 50/50 Dom
  Stab hit); plus 17 state delegations for Pres + 33 Senate for VP (POST 810).
  **Bundles with hd #62 at E10b.** — #10/#84/DH-6 (`drums` 472-474, 810,
  4467-4475, 5176, 5217-5221, 5250).
- **§25.9 — Iron-Fist exact split shape (NEW, batch 5).** The 6 office-keyed
  child trait names + cascade rules need a designer call before build. §25.9
  lists 6 candidate effects (PL+Honest-Gov-maxed gov control; Sen Maj Leader
  vote forcing; President officer-fire / SCOTUS-compel / challenger-stifle;
  Loans-from-Wealthy + IF PL gov takeover; Convention PL unilateral threshold;
  mid-war military replacement) but the **exact names** and **what cascades to
  what** are open. Author the split, then build **E17**. — gap #77 + §25.9
  (`drums` 2433-7364).
- **DH-12 — White-peace rules MISSING from the war system (NEW, batch 5).**
  Tyler (`drums` POSTS 6533-6541): *"There are, in fact, no rules about white
  peace"* — had to dig up old treaty docs. **Author the spec** (Moderate
  Implementation Pres+Sec State+Sec War; 75% −1 Party Pref; −100 Mil-Industry;
  −500 Expansionists; −500 President; return to antebellum status quo), then
  fold into **E3** (generic war) / **E3b** (Civil-War readmission). — DH-12.
- **DH-13 — Faithless-elector trigger cap (NEW, batch 5).** Current trigger
  fires "whenever winner's state has the other party's ideology enthusiasm
  maxed" — over-aggressive (`drums` POSTS 466, 469-471, 2912, 4441): 1876
  produced 22 faithless from Cobb + 12 from Fremont; 1892 produced 8 Whig →
  232-232 tie → House contingent; 1900 had an 8-elector defection. **Author
  the documented + capped trigger** (e.g. max-N per state + state-modifier
  table) + the EBR deadlock side-effect rule (POST 5250). Folds into **E26**
  3rd-party or a per-(state) cap inside the EC tally. — DH-13.
- **DH-14 — Bill ideology impacts not era-aware (NEW, batch 5).** Matt
  (`drums` POSTS 6691, 6878, 6912): Mods need to be removed from the
  negative-points side of Women's Suffrage in 1916 — should be era-sensitive.
  Tyler agreed. **Equal Voting Rights for Women never passes** (60.5% / 63.6%
  short of 2/3): GM: *"This amendment will never pass in a game with CPUs."*
  **Author the era-keyed bill ideology impact tables**, then fold into the bill
  catalog (E14 / E20). — DH-14.
- **DH-15 — Small/large-state action-impact multiplier UNCODIFIED (batch 5).**
  Tyler (`drums` POSTS 6676-6680): *"Since RI is a small state he would only
  succeed on impacting the meter at 2.5% [half of 5%]; large states double."*
  In playtest sheets ("Effects Meters?" column) but **not codified in the gov
  actions section of the rulebook**. **Author the multiplier rule + the
  small/large-state classification table**, then fold into **E11** (governor
  actions). — DH-15.
- **DH-25 — Career-track bootstrap unresolved (NEW, batch 6 — BLOCKS Phase-2
  modern scenarios E30 + E31).** Lars (`pop` POST 33): *"we've legit been
  having this discussion for almost three years now and somehow we've yet to
  change the rulebook or the game."* For a mid-game boot, the question is
  "which existing pols start on career tracks (Foreign / Military /
  Industrial / Academic / Bureaucrat) at boot?" — and no canonical rule
  exists. **Zagnut's houserule on the table:** anyone drafted in 1996+ goes
  onto one track each (POST 31). Rodja hand-populated by GM ad-hoc (POST 38,
  50). **Author the bootstrap rule before `scenario1948` (E30) or
  `scenario2012` (E31) ships** — both are gated on it. **The single biggest
  parking-lot item from batch 6.** **★ Batch-10 — `dem1820` reconfirms + sharpens
  this AND surfaces the SELF-CONTRADICTION (#86/DH-25/DH-56):** the 1820 GA seeded the
  **inaugural career-track from the LAST-3 DRAFT CLASSES** (1820/1816/1812, POST 28) —
  a concrete bootstrap variant for the rule to choose among — and exposed that **2.1
  says career-track pols "can't run or be appointed" while many sections pull them by
  election/appointment** (the GA ruled to ignore the bar — a friction point in the
  DH-36 burnout). **Author ONE coherent career-track-eligibility rule here too** (run/
  appoint allowed or not), since the boot pipeline (#115) and the appointment-ladder
  (#115b) both depend on it. **★ The appointment-ladder (#115b) PAIRS WITH this item
  (XS, into the boot/appointment rules):** when a seat must be appointment-filled at
  boot, the deterministic ladder is **own-party-not-CT → own-party-CT → opposite-not-CT
  → opposite-CT → generate** (the order the GA improvised); it lives in `scenarioBoot`
  (#115 / K4) once this CT-eligibility rule is authored. — DH-25 (+ #115b appointment-
  ladder; `dem1820` POST 28; #86/DH-56 CT-eligibility self-contradiction).
- **DH-33 — Impeachment ruleset broken/outdated (NEW, batch 7).** The
  impeachment mini-flow runs but the canonical rules are flagged
  non-functional / improvised — `rep1800` corroborates `hd`'s "impeachment
  super outdated and doesn't work" across a **2nd campaign** (an Integrity
  justice got accused of bribery — nonsensical; only **resignation** avoids
  the DomStab/Honest-Gov drop). **Author the impeachment rewrite before
  building it into E29** (modern legislative depth). — DH-33 (`rep1800` §A
  465-474; §B 3594, 3620; corroborates `hd` DH-14-impeachment).
- **★ DH-41 — general SCOTUS-ruling → downstream-statute cascade (NEW, batch 8
  — the headline batch-8 author-before-build item).** `tea1772` POST 124-126: a
  spectator argued **Prigg v. Pennsylvania** should auto-void the Fugitive Slave
  Act; `vcczar` **deferred** — *"V will need to think about it."* This is
  **distinct from the *built* strike-a-single-law** (`tea1772` POST 770-784) **and
  from #100's overturn-an-amendment-on-review** — it is the **general cascade**: a
  ruling that *contradicts a law on the books*. **Today a contradicting ruling
  leaves the law operative.** A genuinely undesigned policy: does the ruling
  void/neuter the conflicting law, or leave it operative (the current default)?
  **Author the cascade policy before building it**, then fold into the SCOTUS
  docket (**E25**). Cross-refs §24.4's *Pollock*→income-tax coupling (which IS a
  designed gate, already handled at E5/E25). — DH-41 (`tea1772` 124-126; cf. the
  built 770-784).
- **★ DH-49 — a POPULATION MODEL + House cap (NEW, batch 9 — the ONE genuinely-new
  infrastructure item this batch).** The per-decade census EV-reallocation (level
  (b) of the era model, K3 / §28.9) and the Wyoming-Rule apportionment (E28 /
  #34/#55) are **un-implementable without a real per-state population model + a
  House-size cap** — and **neither exists today** (`State.electoralVotes` is a
  static seed; there is **no population field** anywhere). Unlike most batch-9 items
  (which relabel/extend existing work), this is **new infrastructure.** **Author the
  population model + House cap before build, OR size it INTO the census/apportionment
  epic (E28) as its first sub-task.** Once it exists, the K3 census level (b) and the
  E28 Wyoming-Rule recompute both consume it. — DH-49 (`nuke` §28.9; the census +
  Wyoming-Rule items E28 / K3 depend on it).
- **★ DH-54 — impeachment / VP-vacancy / succession ruleset was NEVER in the rules
  doc (NEW, batch 9 — corroborates DH-33 across a THIRD campaign).** `nuke` (§28.5):
  there is **no impeachment trigger** (a Watergate-analog went undetected → pure
  upside) and **VP-vacancy fill was "made up as we go."** This corroborates
  `rep1800`'s DH-33 ("impeachment super outdated and doesn't work") + `hd` across a
  third campaign — the ruleset has never been written down. **Author the impeachment
  + VP-vacancy-fill + succession ruleset before building** the institutional layer:
  it gates the configurable line of succession + the acting-president gate (**E10b**)
  and the impeachment rewrite (**E29**). Pairs with #105 (stat-collapse→forced-
  resignation, the one *built-able* succession trigger). Distinct from DH-33 only in
  scope (DH-33 = "impeachment is broken"; DH-54 = "impeachment AND succession were
  never specified") — treat them as one author task. — DH-54 (`nuke` §28.5; cf.
  DH-33 `rep1800`).
- **★ #122 — Pardon mechanics entirely unspecified (NEW, batch 12 — the one new
  author-before-build item this batch).** `smallbugs#POST 113` (Bushwa777):
  *"Pardon rules not spelled out. What happens if pres pardons someone? Do they
  lose traits they got like controversial? If not pardoned do they get retired from
  game?"* — **no follow-up in the thread.** Pardons interact with: (a) the
  Controversial-trait apparatus, (b) the impeachment machinery (#112), (c) the
  resignation-penalty pipeline (resignation-while-impeached = permanent −3 future
  elections / barred from appointment / loses Integrity), (d) the cabinet-
  resignation-and-Scandalous-Office-Holder loop (POST 618 — a fired pol can be re-
  appointed next phase). **Author-time decision; no ruling yet.** **Specify:** who
  can be pardoned (any non-impeached citizen?), what gets undone (Controversial
  trait? scandal trait? election malus? impeachment-disqualification?), the
  political cost (pardoning a Controversial pol = pardoner gains Controversial?
  Honest-Gov drop?). **Author the rules before building, then fold into E29**
  (modern legislative depth) + the impeachment/resignation pipeline. — #122
  (`smallbugs (cf82a7d3)` §4b POST 113).

> **Author-before-build calls that are owned INSIDE a subsystem epic** (not
> standalone parking items — listed here so they aren't lost):
> - **DH-7** (R/D convention-threshold asymmetry + Iron-Fist unilateral change)
>   — document a chosen rule + re-gate the rules-change power inside **E10**
>   (handler 9e owns the CPU side).
> - **DH-8** (CPU convention AI unstable + ambiguous ballot-shift) — **owned
>   by E9 handler 9e** (the convention CPU handler) + **E10** (the player
>   convention epic). Ballot-shift = next-round (GM ruled).
> - **DH-9** (canonical exec/gov action ability-stat) — decide **at K2**,
>   before the action libraries author their `resolve` stat.
> - **DH-10** (blundered implementations still score) — a per-action
>   `blunderStillScores?` data flag, encoded at **E13**.
> - **DH-17** (convention auto-drop-out + 1-action/candidate cap) — fixed
>   inside **E9 handler 9e** (auto-drop-out after 2-3 ballots of 0 Momentum;
>   1-action cap replaced by Command-limited interballot actions).
> - **DH-18** (dark-horse compromise candidates dodge resignation rolls) —
>   fixed inside **E9 handler 9e** / **E10** (retroactive resignation rolls).
> - **DH-19** (CPU governor menu static; no industry-stack awareness) — fixed
>   inside **E9 handler 9j** + **E11** (state-stack-aware menu).
> - **DH-20** (CPU has no reciprocity / vote-trading) — fixed inside **E9
>   handler 9k** (the reciprocity enforcer; uses K5's `cpuCommitments`).
> - **DH-21** (CPU has no meter-guarding on event picks) — fixed inside **E9
>   handler 9g** (the A/B/C event vote + meter guard).
> - **DH-22** (cascading scandal sequencing hole) — fixed inside **E9 handler
>   9l** + **E15** (era-event extensions; uses K5's `recentScandalIds`).
> - **DH-23** (cabinet 36% pass-rate bug) — XS-S, **NOT a quick-win**; lands
>   inside **E16** (cabinet+confirmation system) as a sibling of the
>   cabinet-retention refactor + **E9 handler 9d** (CPU confirmation).
> - **Divergence #14 — APOCALYPSE meter-driven endgame (NEW, batch 6)** — folds
>   into **E6** (meter-model generalization) as a sibling refactor; `pop` POST
>   542, 548 documents the 10-yr Planet Health clock; model is meter-agnostic.
>   Phase 1, sized M (§9.1.4).
> - **Divergence #15 — Dynamic cabinet seat list (NEW, batch 6)** —
>   `cabinetSeatsForYear` becomes boot seed only; folds into **E16** sub-item;
>   bill-sign handler appends `Legislation.createsCabinetSeat?` payload.
> - **Divergence #16 — Amendments toggle CAPABILITIES (NEW, batch 6)** —
>   `requires?: AmendmentPredicate` field on `GameAction<Ctx>` at **K2 from
>   day one**; same field gates bill catalog entries + gov action rows.
> - **Divergence #17 — State roster keyed to `{era, startYear}` (NEW, batch 6)**
>   — folds into **K4 BootSheet schema** + **E28** (53-state roster) + **E30**
>   (`scenario1948` continuation, 53-state) + **E31** (`scenario2012`, 50+DC).
> - **Conditional-vote-rules primitive `compelledVoteRule?: Predicate → Vote`
>   (NEW, batch 6, `pop` POST 1111)** — the data lives on `Faction.factionLeader`
>   at **E19** (faction-personality); the consumers are **E9 handler #2**
>   (legislation, BEFORE the §25.6 heuristic) and **E9 handler #4** (cabinet,
>   subsumes auto-AYE-own-picks + SCOTUS within-1-step auto-AYE). Pairs with
>   E17 Iron-Fist split.
> - **DH-45 / DH-46 (NEW, batch 9) — diplomacy holes** — fixed inside **E12**
>   (diplomacy library): DH-46 add **downward pressure** on the 8 relation meters
>   (the US ends up allied with everyone) + a Cold-War ≤Neutral cap on USSR/China;
>   DH-45 re-tune the **USSR-collapse trigger chain** (stalls at a ~5% gate).
> - **★ DH-47 (NEW, batch 9) — wars never resolve / no army-navy-air branches** —
>   fixed inside **E3** (generic war): build a real **resolution/peace path** (Korea
>   ran ~2 decades; couples to DH-12 white-peace) + design the **branch model.**
> - **★ DH-48 (NEW, batch 9) — era-event data needs structured `evDelta`/census
>   fields** — fixed inside **K4** (era-content registry) + the dataset-build
>   validators (sibling to QW8/QW9); consumed by the **E15** era-event walker. The
>   Neocon census/EV events were LOST as free-text flavor.
> - **DH-50 (NEW, batch 9)** — era-event-scheduling holes → **E15** (the own-clock
>   content schedule, #109).
> - **DH-53 (batch 9, ★ SIZED batch-10) — bill→EV/meter STRUCTURED-effect tables, S**
>   — `dem1820` corroborates the sign-bug class from a 3rd thread (1820 laws mis-worded
>   "until passed −1 EV" vs "when passed +1 EV", POST 462-466). **Author the typed,
>   sign-checked per-bill effect schema** (incl. a per-state `evDelta`; `Legislation.effects`
>   has none today, `applyEffect` `phaseRunners.ts:3209` can't touch `electoralVotes`) →
>   **E20** (consumed by scoring) + **K4** (shares the DH-48 structured-`evDelta` shape).
>   NOT a sign-flip — an authoring item. (Was "bill-catalog completeness → E2"; the
>   batch-10 corroboration sizes + relocates it.)
> - **DH-52 (NEW, batch 9) — landslide-margin-cap / no close modern elections** —
>   an election-math BALANCE dial inside **E20** (the modern corroboration of DH-42).
> - **DH-51 (NEW, batch 9) — modern pols OVERPOWERED / recency-biased** — a
>   curation + parity pass at the **dataset pipeline** (`scripts/legislatorsToDataset.mjs`
>   or a sibling validator); blocks **E30** (`scenario1948`) shipping balanced.
> - **DH-55 (NEW, batch 9) — engine is 2-party-hard-wired + 3rd-party PV needs
>   region-weighting** — fixed inside **E26** (third-party trigger), alongside
>   DH-11 + DH-26.
> - **DH-56 (NEW, batch 9) — conflicting career-track rule-sets** — pairs with
>   **DH-25** (the career-track bootstrap blocker on the modern scenarios E30/E31);
>   author the one canonical rule there.
> - **DH-57 (NEW, batch 9) — convention holes** — fixed inside **E10** / **E9
>   handler 9e** (the convention CPU), alongside DH-7/DH-8/DH-17/DH-18.
> - **#115b (NEW, batch 10) — appointment-ladder + replacement-gains TIMING (XS
>   each)** — two XS rules on the boot/appointment path: **(1) the appointment-ladder**
>   (own-party-not-CT → own-party-CT → opposite-not-CT → opposite-CT → generate; lives
>   in `scenarioBoot` / **K4** + the cabinet path **E16**; depends on the **DH-25**
>   career-track-eligibility call); **(2) replacement-gains timing** — when a seat is
>   re-filled (a replacement officeholder appointed), the on-appointment gains must
>   apply at the right phase (the `dem1820` GA had to retro-fix stale gains — a sliver
>   of the DH-36 manual-upkeep burden the engine should own). Both are XS additions to
>   the appointment machinery (boot-time via #115; in-game via **E16**). — #115b
>   (`dem1820`; pairs with DH-25 + #115).
> - **★ NEW batch-12 — Ted/vcczar-RULED items owned INSIDE existing epics** (these
>   are RULED, not author-before-build; tracked here for fast lookup back to the row):
>   **#124 cabinet→enthusiasm rework (M)** → **E16** (re-scoped M, bundled with
>   confirmation system; numeric percentages designer-gated #8/#9 below); **#134
>   Lingering 7-step + tax/tariff carry-forward (M)** → **E6** (folds into the
>   meter-model + APOCALYPSE epic; same `runPhase_2_5_1_Lingering` surface); **#120
>   `smallbugs` dataset umbrella (M)** → **E18d** (one coordinated
>   `scripts/seedDataset.mjs` `CURATED_ROWS` pass; absorbs DH-43 / DH-51 / DH-28);
>   **#126 Pres 2-step Admin-then-Command blunder rule (S, CANONICAL — was OPEN as
>   cf82a7d3 §5a #3)** → **E29** (modern legislative depth); **#127 conversion /
>   ideology-shift schedule (S)** → **E5b** (ideology-circle helper PR; folds in
>   adjacency rule + LW↔RW 25% + auto-Two-Faced); **#128 Kingmaker / Master
>   Kingmaker scope (S)** → **E20** (binds at `calcStateVote:3711`); **#129
>   Kingmaker→Protégé trait allowlist (XS)** → **E5b** + Phase-1 #21; **#130
>   death/retirement schedule + Hale + Frail-first + ex-Pres-no-retirement (S)** →
>   **E18** (Phase-1 #19, pairs with QW7/#85); **#131 Integrity-can't-nominate-
>   Controversial (XS)** → **E16** + **E25** + diplomacy (also QW13 standalone);
>   **#132 Challenge-Legislation-can't-target-REPEAL (XS)** → **E11** + **E25** (also
>   QW14 standalone); **#133 1st/2nd CC composition rewrite (S)** → **E1** (rewrites
>   `continentalCongress.ts` + `firstContinentalCongress.ts`); **#135 50/50 House
>   inverse-control (XS)** → **E18** / standalone **QW12**; **#136/#137/#138 draft
>   re-rules (XS each)** → **E1** (federalism epic — draft logic is at scenario-boot
>   scope); **#139 Pres signature step in 2.6 (XS)** → **E18** / Phase-1 #2 / #14 /
>   standalone **QW15**; **#140 AnytimeEvo target-pool tightening (S)** → **E18** /
>   **E9** handler 9g; **#141 FL trait gain 5%+/3%- (XS)** → **E18** / standalone
>   **QW16**; **#142 CPU CJ ladder (XS)** → **E25** (the ladder is fully spec'd).
>   **#121 Secessionist trait (XS)** → **E18d** (dataset umbrella) + **E3b** sub-PR
>   (a); **#123 small late-modern content bundle (XS)** → Phase-2 **#28** / **#30**
>   modern-content rows. **All tagged with the originating `tedchange#POST N` or
>   `smallbugs#POST N` for traceability.**

### Decision-gated (NOT ready-to-build — split into TWO sub-buckets batch-12)

**The Decision-gated category now splits into TWO sub-buckets per the batch-12
authority-hierarchy update (Ted/vcczar > GA > inference, game-mechanics §30.4):**

- **(A) User-gated** (CARRIED — items waiting on the HUMAN's design call). These are
  NOT ready-to-build and are NOT author-before-build holes (rules EXIST — two or more
  competing models; the human picks). Then the item folds into the engine row noted.
- **(B) Designer-gated (NEW batch-12)** — items waiting on **Ted/vcczar** to close in
  `tedchange`/`smallbugs`. Ted floated each but did NOT finalize in the threads. **The
  roadmap-planner should NOT schedule these as ready-to-build until Ted/vcczar closes
  them.** Source: game-mechanics §30.2.

**Counts:** User-gated 3 items (#52 + #18 + delegate-class — UNCHANGED from batch-11);
Designer-gated **11 items** (9 from batch-12 + **2 NEW batch-13: OC-4 + OC-8**). **★ Batch 12
adds the (B) sub-bucket; (A) stays the batch-11 set; ★ batch 13 adds OC-4 + OC-8 to (B)
(9 → 11). #52 is now ALSO resolved for the all-CPU case** (CPU SCOTUS by ideology-distance,
`oopscpu`) — only the player-vs-CPU surface stays user-gated; **#18 state-scope RECURS
unresolved in `oopscpu` (POST 205-214)** — still user-gated.

#### (A) User-gated (the HUMAN must pick first)

**A HUMAN must choose the canonical model first; the build cannot pick one on its own.**
Distinct from "Roadmap decisions" below, which are tech-lead/planner calls already made.

- **★ #52 — Player-controlled SCOTUS: ALL-CPU vs PLAYER-CONTROLLABLE-WITH-
  RESTRICTIONS vs TRAIT-GATED (DECISION-GATED).** `dem1820` runs a **LIVE player-
  controlled court** (votes by-ideology-chart, but **delay/dismiss is a player action**;
  dismiss only Gov-Action cases; must hear ≥1 per term) — which **RE-ENABLES the
  control `pop` POST 479-480 said vcczar DISABLED** mid-design. So the three live
  models are: (a) **all-CPU-by-ideology** (the shipped intent per `pop`), (b)
  **player-controllable-with-restrictions** (the `dem1820` live model), (c)
  **trait-gated** control (Iron-Fist/Manipulative compel only). **A human must pick.**
  **★ BUT THE SCOTUS DOCKET DATA STRUCTURE IS NEEDED EITHER WAY** — regardless of who
  drives the votes, the per-term case docket must exist: it lives in
  `src/data/scotusCases<Era>.ts` + a `GameState.scotusDocket` ledger (the shipped court
  is a COIN-FLIP — `phaseRunners.ts:3397,3648` — with no docket and no player surface).
  **So E25 (the SCOTUS docket, → Phase-2 #25) is NOT blocked by this fork — build the
  docket; the player-vs-CPU surface is what waits on the pick.** Verified shipped:
  `phaseRunners.ts:3397,3648` (coin-flip), no docket. — #52 (`dem1820` delay/dismiss-
  only live court vs `pop` POST 479-480 disabled; docket → **E25**).
- **★ #18 — Meter→election STATE SCOPE: EVERY-STATE-UNLESS-PENALIZED vs
  IDEOLOGY-LEANING-STATES-ONLY (DECISION-GATED — NARROWED in batch 11).** Batch 10 had
  this as the 3-way **#18/#51** fork; the `arkzag` continuation **RESOLVED the #51
  enthusiasm-SHIFT step** (the 4-step rule, verbatim `drums`, NOT Ted's "every state"
  nor Matt's "primaries only" — now **E23, `ready`**) and **un-gated the ±3 cap**
  (ships with E6). So what REMAINS is purely the **STATE-APPLICATION step of the
  meter→election map**: does a per-ideology-card bonus apply to **every state unless that
  state penalizes the ideology** (Ted's reading) or only to **ideology-leaning states**
  (V's)? The `arkzag` model expresses the shifts per ideology card and leaves the
  state-application to the meter→election map (#18) — so this is the last open piece. **A
  human must pick.** Verified shipped: `calcStateVote` (`phaseRunners.ts:3685`, score
  `:3709-3711`) applies enthusiasm **UNIFORMLY with no per-state penalty** today.
  **Folds into E20/E23 (election math / enthusiasm engine) once chosen** — and does NOT
  block the E23 enthusiasm-SHIFT engine, which is `ready`. — #18 (`arkzag` resolves the
  #51 half → E23; `dem1820` POST 569/575/618 + `arkzag` ch15 POST 1230 state-scope fork;
  shipped `phaseRunners.ts:3685,:3709-3711`).
- **★ NEW (batch 11) — Convention DELEGATE-CLASS assignment: AI-ALLOCATOR-BY-EV-FORMULA
  vs PLAYER-RIGGED (DECISION-GATED).** `arkzag` exposes a GA-vs-designer fork: **Zagnut
  moved delegate-class assignment to AI-AUTO** (a published 5-category EV×1..×4 formula,
  "eliminates self-dealing + saves time", ch3 POST 276), but **Ted holds delegate-
  RIGGING is INTENDED design** — and the **1840 convention REVERTED to human-set
  classes** (ch32 POST 2466). So the two live models are: (a) an **AI/deterministic
  delegate allocator** (the EV×category formula, no player input), or (b) a
  **player-set/rigged allocator** (rigging as a feature). **A human must pick which is
  canonical** before the **delegate-apportionment sub-PR of E10** (the CPU delegate
  engine) and before **E24's primary-group apportionment** consume it — but it does
  **NOT block the rest of E10** (the ballot loop / inter-ballot library / platform/VP
  sub-PRs proceed; only the apportionment sub-PR waits). Pairs with #13/#71/#104
  (the lone-ideology delegate-sweep handling). — #13 delegate-class fork (`arkzag` ch3
  POST 276 AI-auto vs ch32 POST 2466 human-set; → E10 delegate sub-PR + E24).

#### (B) Designer-gated (Ted/vcczar must close — NEW batch-12)

**9 items Ted floated in `tedchange` but did NOT close** (per game-mechanics §30.2).
Each is a LIVE design hole — distinct from user-gated items in that the rules are
authoritative-but-incomplete (Ted started the work, didn't finish). **The roadmap-
planner should NOT schedule these as ready-to-build until Ted/vcczar closes them in
`tedchange`/`smallbugs`.** When a designer-gated item closes, it moves to a roadmap
row (often as an XS-S addition to an existing epic).

- **(B1) Mil-Prep meter level 4 fix (designer-gated open).** Ted said "I'll check what
  I did" then "wasn't better" (`tedchange#POST 290-301`). Community has three
  proposals: **30/40/30** (Umbrella + `smallbugs#POST 579`); **30/60/10** (Eric
  POST 297); **40/50/10** (Nikk POST 300). **NOT RESOLVED.** Both `tedchange` and
  `smallbugs` have the bug logged but neither closes it. → folds into **E6** (meter-
  model) when closed.
- **(B2) ★ #125 Universal Election Modifier (UEM) (designer-gated open).** Ted
  proposed (`tedchange#POST 222-241`) a single +1/-1 modifier table applied to ALL
  elections (primary + general, all offices, all eras), with ~17 +1 traits and ~16
  −1 modifiers. **Community pushback on stacking + age modifiers** (Matt POST 225:
  "this is way too powerful as-is"). Ted did NOT finalize. **Major design proposal —
  the build should NOT pre-implement until finalized.** → would fold into **E20**
  (election math) + every election context when closed.
- **(B3) Crisis trait consolidation (designer-gated open).** Ted proposed merging
  Crisis Manager / Crisis Admin / Crisis Gov into a single Crisis Manager trait, or a
  2-tier Manager + Master ladder (`tedchange#POST 73, 77-87`). vcczar "will consider";
  **OPEN tending toward consolidation.** → folds into the trait union work when
  closed.
- **(B4) Term-limit Gov actions in pre-Senate era (designer-gated open).** Umbrella
  reported CPU running a term-limit Gov action in 1818 → state ran out of candidates
  (`tedchange#POST 356-367`). Two paths flagged: (a) **void Senator requirement**
  (Eric: 2.5.2 already has the conditional language); or (b) **move term-limit
  actions to Era of Federalism start** (Ark). **Ted didn't rule.** → folds into **E11**
  (governor's actions) when closed.
- **(B5) Faithless-elector mechanic rewording (designer-gated open).** Community
  agrees the current rule is "wonky" (`tedchange#POST 371-376`). **Ted didn't post a
  final wording.** Faithless-elector rule remains as-is. → corroborates DH-13 (also
  user-gated above); folds into **E26** when closed.
- **(B6) Party rename trigger — PL vs Era Evo (designer-gated open).** Matt proposed
  Party Leaders rename parties (like factions get nicknames, `tedchange#POST
  391-395`); Ark hashed in a separate thread; **Ted did not adopt.** ERA EVOs continue
  as the rename trigger (cross-ref §25.13 Whig→Conservative). → folds into **E19**
  (faction-personality / rename triggers) when closed.
- **(B7) VP-must-be-same-party-on-resignation relaxation (designer-gated open).**
  Vee01 proposed relaxation (`tedchange#POST 362`). **No follow-up.** Currently same-
  party-only is enforced. → folds into **E10b** (succession) when closed.
- **(B8) Cabinet enthusiasm percentages (the #124 numeric — designer-gated open).**
  Ted's rework (#124) is **RULED IN CONCEPT** (`tedchange#POST 1-4`); the **actual
  numbers** (Big-4 33% / others 25% etc., POST 4) are **TBD**. → **#124 itself is the
  M-sized E16 re-scope ABOVE** — ship a const table that can be re-tuned when Ted
  closes the percentages. NOT a separate row; this entry tracks the numeric gate
  on **E16's #124 sub-item**.
- **(B9) Cabinet ideology weighting — Big-4 vs rest vs cabinet-level (designer-gated
  open).** Ted flagged but didn't finalize whether the three tiers get distinct
  ideology-enthusiasm weights (`tedchange#POST 1-4`). **Same E16 #124 row as (B8);
  same const table.** → **E16** when closed.
- **(B10) ★ OC-4 — CPU draft ideology-distance gate (designer-gated open — NEW batch-13).**
  The all-CPU 1788 run had **both left-of-center factions headhunt Andrew Jackson (RW Pop)**
  via the draft's 25% "go for the best off-ideology pol meeting the rolled goal" branch
  (`oopscpu#POST 227-228, 234-237`) — producing incoherent rosters AND trapping the strong
  pol (an off-ideology draftee can never become faction leader → can't run for President).
  Three live paths: (a) gate off-ideology draft like 2.1.6 (pliable + same/adjacent,
  Zagnut); (b) scrap draft restrictions wholesale (Kevin); (c) an existing per-era
  faction-switch option (Sauc/ebrk). **Ted wants "a better third way" — neither
  draft-strong-pol-off-ideology-but-can-never-lead nor strong-pol-uncontested-last-pick.
  OPEN — do NOT silently ship a hard gate.** → folds into **E1 / the draft pipeline + #72
  (candidate selection)** when closed. (The #146e 9th/10th-draft-bonus-to-first-PICK ruling
  IS closed and ships with E1; only the ideology-gate is gated.) — OC-4 (`oopscpu#POST 226-228,
  234-237, 252`).
- **(B11) ★ OC-8 — "What is an office?" definition + Scandalous-Non-Office-Holder event
  rewrite (designer-gated open — NEW batch-13).** The "Scandalous Non Office Holder" Anytime
  Evo's text says "force them out of office" yet it TARGETS a non-office-holder (text
  copy-pasted from "Scandalous Office Holder"). Ted flagged `@vcczar` (`oopscpu#POST 334, 336`):
  "We need to define what is and is not an office. **Is career track an office? Is faction
  leader and/or party leader (if they don't have another position) an office?**" — a request
  for a ruling, NOT a ruling. Affects every event keyed on "office"/"non-office" status
  (#140 AnytimeEvo target pools). **OPEN — needs a vcczar author call** (an is-an-office
  predicate + the event-text rewrite). It is the **events-side twin of OC-1** (OC-1 = the CPU
  recycles a scandal-resignee; OC-8 = the event can't even tell whether someone holds an
  office). → folds into **Phase-1 #19 / E9 handler 9g (AnytimeEvo target-pool spec, #140)** +
  the event-text rewrite when closed. — OC-8 (`oopscpu#POST 334, 336`).

### Roadmap decisions (a planner CALL, not an author task)

- **★ DH-34 — Static era-biases vs. policy-reactive biases → the Red-unwinnable
  "AMPU 2.0" hole (NEW, batch 7). DECISION: ship static biases.** The single
  most-repeated `rep1800` complaint: `State.bias` is a static per-era table that
  does **not** react to policy (abolish slavery → the South should swing Red, but
  doesn't), so the Federalists are acknowledged-**unwinnable 1800–1840** (Blue
  142-0 House by 1804; Jefferson 179-0 / 197-15) and players quit. The GM +
  designer's own stance: dynamic/policy-reactive biases are *"too complicated /
  not part of the AMPU vision… maybe AMPU 2.0."* **The planner must DECIDE: ship
  static (accept the imbalance — the cheap path the forum itself chose) vs. invest
  in policy-reactive biases (a large new system).** **Tech-lead's call, adopted
  here: SHIP STATIC for now** (it is the forum's own stance and the imbalance is a
  known-accepted property); revisit only if balance becomes a release blocker.
  **This means K4's per-era state-bias table swaps in wholesale at the boundary
  (#68 step 6) but does NOT react to policy.** Pairs with #21/#34 (bias as a
  field) + DH-29's solo-balance theme. — DH-34 (`rep1800` §A 22, 350, 720-747,
  1328-1335, 2444-2457, 2641, 2711-2713). **NOT an author-before-build item — it
  is resolved (ship static); no rules to write.**

### Balance dials (fold into the named subsystem; no standalone build)

- **DH-4** — cap "Extend Credit to all nations" → **E12** (diplomacy library).
- **DH-11** — apparent Dem 3rd-party bias → **E26**; inelastic lobby cards →
  **E19** (card algorithm).
- **DH-16** — reapportionment cap 435 likely never triggers in normal play
  (POST 5352: ~year 2000 before the cap binds). No fix needed; flag for the
  apportionment recompute (E28). — batch 5.
- **DH-26 — 3rd-party VP "same traits" rule is prohibitive (NEW, batch 6).**
  An independent presidential run requires *"a VP with the same traits"* as
  the presidential candidate (Lars `pop` POST 945-947), making 3rd-party
  tickets **nearly impossible** in practice. **Pairs with DH-11** (Dem
  3rd-party structural bias). Both 3rd-party design holes are addressed
  simultaneously inside **E26** (third-party trigger): relax the trait
  constraint AND fix the structural bias. → **E26**.
- **DH-28 — "Repeal climate crisis" tag completeness is gameable (NEW,
  batch 6).** Only some Repeal bills carry the "deals with climate crisis"
  tag (`pop` POST 552); players gamed this — bills that should affect
  Planet Health but aren't tagged slip through scoring. **Per-bill
  meter-impact tags must be complete and verified at dataset-build time**;
  generalizes to other meter-impact tags. Folds into the **existing
  dataset-regeneration scripts** at `scripts/legislatorsToDataset.mjs` (or
  a sibling validator) — a CI/dataset-time validator at the existing
  pipeline. Not a standalone build item. → **dataset pipeline (§7)**.
- (DH-3 / DH-5 / #85 were cheap enough to promote to quick-wins QW5/QW6/QW7;
  DH-24 / DH-27 promoted to QW8/QW9 batch 6; **DH-30 promoted to QW10 batch 7**.
  DH-31 → E2 [bill-typing]; DH-32 → E25 [SCOTUS docket]; DH-35 → E11/E13/E24
  [era-gate the action libraries]; DH-33 → author-before-build [E29]; DH-34 →
  roadmap-decision [ship static].)

### Deferred / parking lot

- **Multiplayer — hot-seat (M1).** Round-robin the existing `needsPlayerInput`
  mechanism (`engine.ts:9`) across human factions before `advancePhase`.
  **Hard-blocked on K0 (determinism) AND on K2 + all six action libraries AND
  on K5 + the CPU handler suite** — the player-input modalities *are* the
  action libraries, and any CPU faction in the rotation uses the K5 handlers.
  **`drums` (all-CPU) confirms solo + multiplayer are two modes of one
  engine**: the K5 handlers serve both cases identically — a human taking over
  a CPU faction mid-campaign just disables the handler for that faction
  (§9.5). Also needs the singleton refactor: `playerFactionId` →
  `playerFactionIds: string[]` + audit every "is this me?" call site (debt
  #10). — gap #1, §9.5.
- **Multiplayer — async / backend (M2, L–XL epic).** IndexedDB is per-browser
  (`db.ts`); shared state needs a server (or CRDT/host-authoritative sync).
  Hard-blocked on K0 + M1. Exposes debt #6 (whole-snapshot clone+save
  bottleneck). — gap #1, §9.5.
- **Politician-to-politician trading (DH-37, NEW batch 8 — the #1 AMPU-2
  wishlist item).** A trade window between factions to swap politicians. A
  genuine small feature, but **not on any critical path** — it pairs with the
  era-boundary faction-trade window (mechanics §27.2 step 1, which DOES exist in
  spec) and with multiplayer. Park it. — DH-37 (`new1772`).
- **All-human Convention deadlock handling (DH-39, NEW batch 8 — multiplayer
  convention machinery).** With every faction human-controlled, the Convention
  can deadlock with no CPU compromise/dark-horse path to break it (`new1772`).
  The CPU side of convention deadlock is owned by E9 handler 9e (auto-drop-out +
  dark-horse, DH-8/DH-17); the **all-human** case needs an explicit
  deadlock-resolution rule that only matters once multiplayer (M1) lands — so it
  rides the convention epic (E10) + multiplayer. Park until M1. — DH-39
  (`new1772`).
- **Bill-scoring Phase B (divergence #1).** Re-tune `cardVoteBias`
  (`phaseRunners.ts:1516`) per-card-aware once the E20 leaderboard is live
  and playtested. — divergence #1.
- **Conversion-targeting refactor (divergence #3).** **Keep shipped for
  now.** Revisit after E19 emits a rule-driven `Can Party Flip` signal
  cleanly. (Listed as Phase-1 #21 in §9.6 "if pursued"; bundle DH-5's
  pairing-dissolution here if QW6 is deferred.) **`drums` #76 supplies the
  full 2-layer Disgruntled-auto-flip + active-poach %-table + adjacency
  gating + failure-strip — which becomes the K5 handler 9f spec when the
  refactor is approached.** — divergence #3, debt #13.
- **Named-ordinal meter relabel (presentation half).** The full labeled-
  ordinal meter *presentation* (vs the ±3 clamp in QW3 + crisis/cascade in
  E6) touches every meter read/write + the UI; ride it on the presentation
  track only if playtest says the numbers read poorly. The first-class
  war-score meter rides E3. — §21.8/§22.1.
- **Far-future / progressive era (post-1892, pre-modern).** Feminists /
  socialists / communists / prohibitionists / eugenicists / labor activists;
  movement/coalition spawning across eras (#6). The `progressive` enum
  value is added in K4; a `progressive` scenario lifts in once a
  progressive digest lands. **★ This is the FURTHEST the corpus documents — there
  is NO "Era of the Future" beyond it (batch-8 NEGATIVE RESULT).** No ingested
  thread reaches a post-Gilded/post-modern era (`tea1772`, titled "…to future,"
  stalls at 1874 mid-Gilded), so a future era has **no source and no build
  target**; **do NOT scope one**. K4 adds exactly `gilded` + `progressive`. — gap
  #2, #6; batch-8 negative result (`tea1772`).
- **Gilded-Age issue *system* depth.** Per-issue interest groups, full
  era-event spines, imperialism annexation flow distinct from `admitState`
  — beyond the E22 data shells. — gap #3, #6.
- **Cabinet "free pick-up" legislation (12b) + foreign-volunteer scheduling
  (#46).** The 1772 Treasurer free-pickup variant; events scheduling a
  future-draftable figure (Lafayette 1784) routed to the lowest-scoring
  eligible faction. (The general Executive-Branch-Interference form is E29;
  Free Executive proposals from SecTreas/SecWar are wired into E14's bill
  pipeline.) — gap #12b, #46.

---

## Sequencing notes

Why the order is what it is — the tech-lead's binding calls (§9 batch-14 lead +
§9.1.10 gilded-era content epic + §9 batch-13 lead +
§6.6.1 batch-13 + §9.6 batch-13 + §9.1.3 methodology + §9 batch-12 lead +
§9.6 batch-12 + §9 batch-11 lead + §9 batch-10 lead + §9.1.9 + §9 batch-9 lead +
§9.1.5 + §9.1.8 + §9.1.3 + §9.6 + §9.1.6 + §9.1.7). **Batch 14 (`gild1868`) is
DOWNSTREAM era-content — the EG gilded-era content epic + #148 (Reconstruction timer →
E3b) + the #41 native-spec strengthening land AFTER the era model + the economic engine
+ the bill-relationship graph + Reconstruction; NO re-sequence, NO new keystone, NO new
author-before-build or decision-gated items.** The batch-14 lead comes first (below),
then batch-13, then batch-12, then batch-11, then batch-10, then batch-9, then batch-8,
then batch-7, then the carried batch-5 leads. **The order itself is UNCHANGED — the TOP
OF THE QUEUE is QW0 (constant=4 + alt-state guard, ship FIRST) → K0/K2 → K3/K4 +
`scenarioBoot`/`BootSheet` → `scenario1788` (E1) … — E1 still carries the
DH-61 (boot-seed active wars, in K4) + DH-62 (pre-12A EC mode, in E4) prerequisites,
and #143 joins the XS quick-win cluster as QW17.**

**★★★★ Batch-14 lead — `gild1868` is DOWNSTREAM GILDED-ERA CONTENT; it does NOT move the
top-of-queue. Reflect it by adding ONE downstream EG epic + extending E3b (#148) +
strengthening #41/E22 to its native spec + appending corroboration tags, NOT by
re-sequencing** (tech-lead §9 batch-14 lead + §9.1.10 — BINDING):
> "The five batch-14 deltas — #147, #148, #149, #150, DH-63 — are NOT five independent
> backlog rows; they are ONE 'gilded-era content' epic that rides on top of the era
> model + the economic engine + the bill-relationship graph + the Reconstruction epic.
> The Gilded Age is UNBUILT (`Era` has no `gilded`, `types.ts:1337`; only
> `scenario1772.ts`/`scenario1856.ts`; the era is hand-run on `modern` tuning, gap #41).
> It does NOT move the top of the queue — it is downstream content. Treat #41 as the
> umbrella and slot the epic AFTER `scenario1788` (E1) + a mature `advanceEra` + #116
> (E4c economic engine) + #42 (bill-relationship graph) + #57 (E3b Reconstruction)."
>
> The binding sequencing calls (lifted from §9.1.10):
> 1. **Top-of-queue is UNCHANGED by this batch.** QW0 → K0/K2 → K3/K4 + scenarioBoot →
>    E1 (`scenario1788`) still lead. Gilded is downstream era-content.
> 2. **#41 is the umbrella; `gild1868` is its full native spec** (red/blue-FLIPPED
>    roster: RED = Republicans, BLUE = Democrats by 1868, POST 6 — so the era-content-
>    band model carries party-label-by-era, not a fixed RED/BLUE↔party mapping; the
>    nickname table; the era-event spine; the bill catalog; the SCOTUS docket; the 20-yr
>    timer). **`scenario1868` is "another scenario-as-data-row" once the BootSheet
>    pipeline + content-band era model land — AFTER `scenario1788` + a mature
>    `advanceEra`.** Do NOT build a bespoke Gilded code path; it is K4 content. →
>    STRENGTHENED at the E22/#41 row.
> 3. **#147–#150 + DH-63 are ONE epic (EG) gated on K3/K4 + the era model + #116/E4c +
>    #42.** Not a near-term quick win — the tariff/currency systems need the economic-
>    content state machine and the bill-relationship graph to exist first. → ADDED as
>    the EG epic after E22.
> 4. **DH-63 folds into #42 + #147's MonetaryRegime** (the mutual-exclusion constraint)
>    — XS-S, no standalone work. → folded into the EG epic's (d) + tagged on E2/#42.
> 5. **#148 EXTENDS the existing #57/E3b Reconstruction epic** (the 20-yr timer +
>    appointment-by-Speaker/PPT-faction + Solid-South sunset). It does NOT open a new
>    epic, and it **inherits the DH-29 solo-blocker** — the Strict/Ironclad plan never
>    passes with CPU factions, so solo Reconstruction must be resolved before any
>    antebellum/CW/Reconstruction scenario (incl. a Gilded boot that turns the timer on)
>    ships solo. → EXTENDED at the E3b (d) Reconstruction sub-PR.
> 6. **The 3rd GM-burnout death** (`gild1868`, after `new1772`/`dem1820`) reinforces the
>    automation-reduces-upkeep argument (DH-36 family) — the spreadsheet legislative
>    phase is the hardest to run by hand (POST 868). **Cite it, do NOT queue it** — no
>    new mechanic. → it is the same prioritization ARGUMENT behind the CPU suite (K5/E9)
>    + the upkeep-reducing items (#19/#20, E7/E8/#55), now corroborated across 3 dead
>    threads (`new1772` + `dem1820` + `gild1868`); reflected in how the order is
>    justified, NOT as a row.

**★★★ Batch-13 lead A — `oopscpu` DOES NOT change the K5/E9 ORDER; it DE-RISKS E9.
Reflect it by folding OC-* into handler rows + bumping build-confidence, NOT by
re-sequencing** (tech-lead §9 batch-13 lead + §6.6.1 batch-13 — BINDING):
> "`oopscpu` is the first batch that systematically validates a whole subsystem's spec
> (K5 + the E9 §25 handlers) BEFORE it is built. It turns handlers
> #70/#72/#73/#74/#75/#76 from 'designed' into 'designed + field-validated with concrete
> failure modes + Ted's fixes' — higher build-confidence, lower spec-risk — without
> changing the build ORDER. Fold the OC-1…OC-8 sub-gaps into the relevant handler rows
> as sub-rules: **OC-3 → handler 9b (legislation): the highest-priority, ★
> balance-critical sub-rule** (an ideology-floor gate + a secession/slavery-active check
> so CPUs don't AYE crisis bills that betray their own ideology cards — the
> peaceful-1792-abolition bug, `#POST 162-180`); **OC-2 → handler 9c (leadership): ONE
> canonical `chamberControl(snap, chamber)` helper** shared by leadership-select + the
> ≥60%-chamber proposer gate (fixes the minority-chairs-propose collision, `#POST 151`);
> **OC-1 + OC-5 → handler 9d (cabinet)**: scandal-resignee re-appointment cooldown (OC-1,
> also DH-22 / handler 9l, `#POST 65`) + court-as-firing-precedent gate (OC-5, `#POST
> 184-187`); **OC-6 → the kingmaker handler (§25.11)**: highest Com+Leg+Gov tiebreak for
> kingmaker→protégé pairing (`#POST 308`); **#72 sharpen on 9a/9m**: the VP-retention HARD
> rule + the pre-12A nomination trio (`#POST 192-197`). **Handler 9e (convention, #71) is
> the ONE handler NOT validated** — 1788 predates conventions — so keep it
> `drums`-spec-only at LOWER confidence; a post-12A all-CPU run validates it."

So the E9 handler rows are **strengthened in place** (field-validation tags + OC-* sub-rules
folded in), build-confidence bumped on the 6 validated handlers, 9e flagged as the one
still needing validation — **no re-order, no new handlers.**

**★★ Batch-13 lead B — #143 (XS, RULED) → QW17; #61 death-branch (S) → E10b** (tech-lead
§9 batch-13 lead #2/#3 — BINDING):
> "#143 post-election Command decay (40% / −1 Command for non-Pres/VP candidates per
> presidential cycle) is XS standalone, RULED + tested live (`oopscpu#POST 1, 224`). It
> binds at `runPhase_2_10_End` (`phaseRunners.ts:4171`), gated on `isPresidentialYear`,
> after the 2.9.4 ticket roster is known; applies via the existing `loseCommand`
> (`abilities.ts:15`). Slot it near QW0 / the XS-consistency quick-wins. #61 death-branch:
> a Presidential DEATH → VP becomes FULL President (no acting, no action-divert roll), is
> NOT auto party/faction leader → re-run the leadership IRV (Ted-RULED `oopscpu#POST
> 324-329`). This SUPERSEDES the batch-11 `arkzag` 'acting/action-divert' read for the
> DEATH case — the acting state is retained ONLY for the incapacity branch. It folds into
> E10b (already re-scoped batch 11) as an S addition with the now-reconciled spec."

So **#143 lands as QW17** (the XS quick-win cluster) and **the #61 death-branch re-scopes
E10b** (S) with the reconciled death = full-President spec; acting/divert kept for incapacity.

**★★ Batch-13 lead C — DH-61 (S) + DH-62 (M) are `scenario1788` (E1) PREREQUISITES —
sequence WITH E1** (tech-lead §9 batch-13 lead #6 — BINDING):
> "Neither is optional for a 1788 boot. **DH-61 (S):** scenario-boot must seed era-active
> wars (they forgot the Northwest Indian War) → a `BootSheet.activeWars` field + a boot hook
> over the generic `War` model; folds into the scenario-boot pipeline (Phase-1 #3 / K4
> BootSheet). **DH-62 (M):** the pre-12A two-vote/no-ticket EC mode + same-state-EV → an
> era-keyed election-mode variant in the per-state-EC epic (Phase-1 #4 / E4). `scenario1788`
> (E1) is near the front of the queue, so these two must land WITH it — make the dependency
> explicit on the E1 row."

So **DH-61 is wired into K4 / the boot pipeline, DH-62 into E4 (per-state EC), and BOTH are
explicit deps on the E1 row** — a 1788 boot cannot run (no active wars seeded; no pre-12A
election mode) without them.

**★★ Batch-13 lead D — OC-4 + OC-8 → designer-gated sub-bucket (9 → 11)** (tech-lead §9
batch-13 lead #4 — BINDING):
> "OC-4 (off-ideology CPU draft gate — Ted wants 'a better third way' than
> draft-strong-pol-off-ideology vs. uncontested; do NOT silently ship a hard gate;
> `oopscpu#POST 227-228, 234`) and OC-8 (define 'office' for the Scandalous-Non-Office-Holder
> forced-out event + rewrite the event text; flagged to `@vcczar`, `oopscpu#POST 334, 336`)
> are OPEN design calls — add both to the designer-gated parking sub-bucket alongside the 9
> open `tedchange` items. NOT ready-to-build until Ted/vcczar closes them."

So **Decision-gated counts: User-gated 3 (unchanged) + Designer-gated 11** (9 batch-12 + OC-4 +
OC-8). The all-CPU run also **resolves #52 for the all-CPU case** (CPU SCOTUS by
ideology-distance) — the player-vs-CPU surface stays user-gated; **#18 state-scope RECURS
unresolved** (`oopscpu#POST 205-214`) and stays user-gated.

**★★ Batch-13 lead E — the ALL-CPU-TEST is a repeatable SPEC-VALIDATION methodology
(recommend it; NOT a build row)** (tech-lead §9 batch-13 lead #5 / §9.1.3 — BINDING):
> "Adopt the all-CPU test as a repeatable spec-validation tool. `oopscpu` validated SIX
> handlers (#70/#72/#73/#74/#75/#76) BEFORE they're built, surfaced 8 concrete sub-gaps
> (OC-1…OC-8), and — because an all-CPU game needs no human players — is **immune to the
> GM-burnout (DH-36)** that killed two playtests. It is cheap, repeatable, and the highest-ROI
> validation method for the CPU surface. **Recommend a POST-12A all-CPU run before building
> the convention handler #71 / handler 9e** — 1788 predates conventions, so #71 is the one
> handler `oopscpu` could not exercise; a post-12A all-CPU run would validate it exactly as
> `oopscpu` validated the other six. Record this as a methodology note, not a build row."

So this is a **methodology note, NOT a roadmap row**: run an all-CPU test to validate a CPU
subsystem's spec before building it, and specifically run a **post-12A all-CPU game to validate
handler 9e (convention)** before that handler is built. It reinforces (does not replace) the
upkeep-automation rationale (DH-36, below) — automation + spec-validation-without-humans both
reduce the manual burden that kills playtests.

**★★★★★ Batch-12 lead A — QW0 / BUG-0 FULLY CLOSES; promote it to top-of-queue
with const=4 + alt-state EXEMPTION guard** (tech-lead §9 batch-12 lead #1 — BINDING):
> "`smallbugs#POST 734-735` (vcczar-12-30-25 'Approved by vczar') settled the cap:
> 'A faction is limited to FOUR total attempted moves per half-term. A politician
> that moves to an ALT-STATE does NOT count against the FOUR total moves.' This
> closes the long-running BUG-0 / QW0 / batch-10 top-of-queue item from 'open-
> design + ready-to-build' to **fully settled and ready-to-ship**. Fix = a one-line
> constant edit + a guard at the relocation accumulator so alt-state moves don't
> decrement the budget (verify the alt-state accounting in
> `runPhase_2_1_4_Relocations`). **This is now the cheapest + safest win in the
> whole roadmap; do it FIRST.** No human review-gate; no designer-gate; the cap
> value AND the exemption are both authoritative."

So **QW0 is the new top of the queue** (it was previously the top, but the cap
value was open; now it's settled + the alt-state exemption is authoritative). The
top-of-queue order is now **QW0 → K0/K2 → K3/K4 + `scenarioBoot`/`BootSheet` →
scenario1788 (E1) …**.

**★★★★★ Batch-12 lead B — Cabinet → enthusiasm REWORK (#124) is the M-sized
teardown; LAND AFTER K2 + K5; build it WITH the confirmation system from day one**
(tech-lead §9 batch-12 lead #2 — BINDING):
> "Ted's `tedchange#POST 1-4` re-architects the lobby→enthusiasm path that was
> already on the roadmap as DH-23 / E16 cabinet confirmation. (a) LOBBY satisfaction
> now writes POINTS to `Faction.score?` (NOT enthusiasm — moves the cabinet-lobby
> coupling from `enthusiasm` to the per-faction score ledger). (b) IDEOLOGY
> COMPOSITION drives ENTHUSIASM — ≥50% cabinet of an ideology = +enth that ideology;
> ≤20% representation = −enth. (c) 3-shifts-per-half-term cap holds. (d) Big-4 /
> rest-of-cabinet / cabinet-level potentially weighted differently — the actual
> percentages are DESIGNER-GATED OPEN (Ted RULED IN CONCEPT but the numbers are
> TBD). LAND IT AFTER K2 (ActionRegistry) + AFTER K5 (CpuController) — cabinet picks
> are CPU actions, and the rework requires the conditional-vote-rules primitive +
> the lobby→score path that K2's registry mediates. **It lands in E16** as a sibling
> beat. **Re-scope E16 from 'add confirmation system in the right shape' to 'BUILD
> the confirmation + enthusiasm rework together in the right shape from day one'** —
> building the today-shape confirmation only to tear it apart for #124 is waste.
> **Size: M (was XS-S).** The numeric percentages stay designer-gated until Ted
> closes them — ship a const table that can be re-tuned post-design."

So **E16 is RE-SCOPED M (was L with a XS-S confirmation step inside)** — confirmation
+ #124 rework BUILD TOGETHER from day one; lands AFTER K2 + K5; **the numeric
percentages stay designer-gated in the new "designer-gated" sub-bucket items (8) +
(9) of the parking lot**.

**★★ Batch-12 lead C — the OTHER 18 Ted-rulings: 12 XS + 5 S + 3 M; sized + slotted
into existing epics** (tech-lead §9 batch-12 lead #3 — BINDING):
> "**12 XS:** #135 50/50 House inverse-control (one-line at `phaseRunners.ts:1864`)
> → Phase-1 #19 / standalone QW; #136 random skill on draft has NO Command → E1 /
> Phase-1 #1; #137 no cross-party draft (`partyId` gate) → E1; #138 3 traits + 3
> alt-states (era-config) → E1; #139 Pres signature step in 2.6 (phase reorder) →
> Phase-1 #2 / #14; #141 FL trait gain 5%+/3%- (refine existing const) → Phase-1
> #19; #142 CPU CJ ladder → E25; #131 Integrity-can't-nominate-Controversial (filter
> helper) → E16 + E25 + diplomacy; #132 Challenge-Legislation-can't-target-REPEAL
> (filter) → E11 + E25. **5 S:** #126 Pres 2-step Admin-then-Command blunder rule
> (CANONICAL — supersedes cf82a7d3 §5a #3) → E29; #127 ideology-shift / conversion
> rate schedule → E5b ideology-circle helper PR; #128 Kingmaker / Master Kingmaker
> scope (binds at `calcStateVote:3711`) → E20 election math; #129 Kingmaker→Protégé
> trait allowlist/blocklist → E5b + Phase-1 #21; #130 death/retirement schedule (Hale
> + Frail-first + ex-Pres death-only) → Phase-1 #19 (pairs with #85); #133 1st/2nd
> CC composition rewrite → E1 (`continentalCongress.ts` / `firstContinentalCongress.ts`);
> #140 AnytimeEvo target-pool tightening → Phase-1 #19 / E9 handler 9g. **3 M:**
> #124 cabinet→enthusiasm rework → E16 (per lead B); #134 Lingering 7-step strict
> ordering + tax/tariff carry-forward → Phase-1 #6 / E6 (same surface — Lingering
> is where meters get written); #120 `smallbugs` dataset umbrella → ONE coordinated
> `scripts/seedDataset.mjs` `CURATED_ROWS` pass (~100 items; also covers DH-43 /
> DH-51 / DH-28)."

So the **18 rulings slot into existing epics — no new epics, no re-sequence.** Each
row is tagged with its `tedchange#POST N` for traceability.

**★★ Batch-12 lead D — BUILD-TARGET SIMPLIFICATION on E5 + E25: amendments NOT
SCOTUS-challengeable; #100 overridden** (tech-lead §9 batch-12 lead #4 — BINDING):
> "Ted/vcczar's `smallbugs#POST 250-269` ruling: Govs CANNOT challenge amendments
> via SCOTUS — the Constitution is by-definition constitutional. This OVERRIDES
> `tea1772`'s #100 ruling ('SCOTUS can overturn an amendment via Gov-requested
> review'). The build target follows Ted/vcczar: **drop the SCOTUS-overturns-
> amendment branch from E25's docket scope and from E5's amendment lifecycle.**
> E5 retains the strike-a-statute path + the mutable-threshold field; E25 retains
> the docket + Justice drift + court size + DH-32 state-guard. This is a sequencing
> simplification, not a new item."

So **E5 + E25 are simplified** by the drop. **#100's review-of-amendment half is
superseded; the threshold half (3/4 → 2/3) is retained** (already implied by #64).

**★★ Batch-12 lead E — DECISION-GATED SPLIT: user-gated (3 carried) vs designer-
gated (9 NEW)** (tech-lead §9 batch-12 lead #5 — BINDING):
> "Batch 12 makes the authority hierarchy explicit — **Ted/vcczar > GA > inference**
> (§30.4 of game-mechanics.md). The Decision-gated category in the roadmap parking
> lot now splits into TWO sub-buckets: **User-gated** (existing — items waiting on
> the human's design call): the Senate cloture %, #18 state-scope, the player-SCOTUS
> fork (#52), the delegate-class fork, DH-1 filibustered-MUST-pass, DH-14 era-aware
> bill ideology, DH-15 small-state multiplier, §25.9 Iron-Fist split, divergence
> #10/#84 contingent-election, DH-25 career-track bootstrap, DH-33/DH-54
> impeachment, DH-41 SCOTUS cascade, DH-49 population model, DH-34 era-bias policy-
> reactive. **Designer-gated** (NEW — items waiting on Ted/vcczar to close): the 9
> open `tedchange` items per §30.2 — (1) Mil-Prep meter level 4 fix, (2) Universal
> Election Modifier (UEM #125), (3) Crisis trait consolidation, (4) term-limit Gov
> actions in pre-Senate era, (5) faithless-elector rewording, (6) party rename
> trigger PL-vs-EraEvo, (7) VP-must-be-same-party-on-resignation relaxation, (8)
> cabinet enthusiasm percentages, (9) cabinet ideology weighting Big-4-vs-rest-vs-
> cabinet-level. The roadmap-planner should NOT schedule designer-gated items as
> ready-to-build until Ted/vcczar closes them in `tedchange`/`smallbugs`."

So **Decision-gated category counts: User-gated 3 + Designer-gated 9.** **The
user-gated set is the batch-11 carry** (#52 + #18 + delegate-class); **the
designer-gated set is NEW this batch** (the 9 open `tedchange` items, NOT ready-
to-build).

**★ Batch-12 lead F — STRENGTHENINGS (no new rows, multi-thread corroboration)**
(tech-lead §9 batch-12 lead #6 — BINDING):
> "**#76 (CPU conversion adjacency)** EXTENDED via `tedchange` (same-party can
> target same OR adjacent ideology — folds into E5b's #127 schedule). **#99 (ideology
> = circle)** now **TED-AUTHORITATIVE** (3-thread corroboration → designer-ruled;
> 25% LW↔RW Pop rate pinned; auto-Two-Faced grant on cross-circle flip — folds
> into E5b). **#67 (Lingering bank ordering)** is RULED by Ted as the canonical
> 7-step + tax/tariff carry-forward → #134 (folds into E6). **#100 (Gov-requested
> SCOTUS review of amendments)** is OVERRIDDEN by Ted/vcczar (per lead D); mark
> superseded in the build-target."

So **no new rows for the strengthenings** — they fold inline into the existing
E5b / E6 / E5 + E25 rows, marked as designer-RULED / superseded.



**★ Batch-11 lead A — #116 economic engine = a NEW small epic `E4c`, placed AFTER
E2 + E6 + E4b(b); build it EMERGENT, not scripted** (tech-lead §9 batch-11 lead #1 —
BINDING):
> "#116 is the long-run content STATE MACHINE sitting on top of E4b(b)'s §27.6
> Second-Bank institution. It needs E2 (`Bill.type` / crisis bypass), E6 (named EconStab
> meter + crisis/cascade), and E4b(b) (the Bank it recharters/replaces). Build it
> EMERGENT — recurring CRISIS bills that resolve an EconStab CRISIS → Independent
> Treasury via a `Bill.replaces` field + a per-bill-class `lockedUntilYear` tariff
> cooldown — NOT scripted. Carry 'scripted-vs-emergent' as a design note, not a blocker.
> Verified UNBUILT: `applyEffect` (`phaseRunners.ts:3209`) only nudges 7 meters;
> `Legislation` (`types.ts:1506`) has no `type`/`replaces`/`lockedUntilYear`."

So **E4c sequences after E2 + E6 + E4b(b)** and is a SMALL epic (three additive fields
on a substrate that already exists). It is **content** sitting on the §27.6 Bank
institution — it does not move any keystone or re-order the spine.

**★ Batch-11 lead B — #119 RE-SCOPES E5, #61 RE-SCOPES E10b (do NOT open new epics)**
(tech-lead §9 batch-11 lead #2/#3 — BINDING):
> "#119 amendment lifecycle → ADD to E5: the explicit lifecycle (propose→committee→
> floor→governor-ratify→active), the active-amendment-blocks-a-legislation-class hook
> (the proactive face of E5's existing *Pollock* gate), and the un-bundleable flag (no
> `amendments` field in `GameState` today). #61 succession chain → ADD to E10b:
> VP-succeeds-on-death → fill-VP (gated on E5's VP-vacancy amendment being `active`) →
> acting-president action-divert roll + trait side-effect. The KILL TRIGGER already
> SHIPS (`anytimeEvents.ts:232` fires `{kind:'death'}`; death sets `presidentId=null`
> via `vacateOffice` `phaseRunners.ts:2449`) — so the succession ENGINE is the work; the
> line-of-succession/impeachment half stays parking-lot (DH-54)."

So **E5 + E10b are STRENGTHENED in place** — both sit in their existing Phase order
(E5 mid-Phase-1, E10b after E10). #61's VP-succeeds/acting-divert path is ready-to-build;
its line-of-succession half is the already-listed DH-54 author-before-build item.

**★ Batch-11 lead C — #51 PROMOTED (now SETTLED); only #18 + the NEW delegate-class
fork stay Decision-gated** (tech-lead §9 batch-11 lead #4/#5 — BINDING):
> "The 4-step enthusiasm-reshuffle + −100/waiver rule → E23, now `ready` (the `arkzag`
> final chunk published the 4-step rule verbatim, matching `drums`). The ±3 cap is
> UNCONDITIONALLY ready (binds at `calcStateVote` `:3709-3711`, ships with E6). Only the
> #18 state-scope sub-question stays a human decision-gate — move #51's fork OUT of
> Decision-gated, leave only #18. A NEW delegate-class fork (AI-allocator-by-EV-formula
> vs player-rigged) joins Decision-gated — a pick before E10's delegate-apportionment
> sub-PR (and E24's primary apportionment), but it does NOT block the rest of E10."

So **E23 is now `ready`** (the reshuffle is no longer fork-blocked), **QW3's ±3 cap is
un-gated** (ships with E6), and **Decision-gated holds at 2** (#52 SCOTUS + the merged
#18-state-scope/delegate-class election-engine picks).

**★ Batch-11 lead D — the bug-folds + the meta-signal** (tech-lead §9 batch-11 lead
#6/#8 — BINDING):
> "DH-59 (XS) folds into E12 when the 9-point relations scale is built — no standalone
> patch (today it clamps −5..5 at `applyEffect:3223`). DH-60 (S) = the concrete face of
> #92 territory-gating; add a `requires?: Predicate` on the era-event row + a firing-path
> filter — same surface as BUG-1 + K3's `territoryOwned`, so build with E15 + BUG-1
> (`buildEraEventsForYear` `eraEvents1856.ts:4` gates only by year; `EraEvent`
> `types.ts:1466` has no precondition field). META-SIGNAL FLIPS POSITIVE: no GA-burnout
> this time (heavy scripting absorbed the upkeep) — now a 3-thread signal (2 burnout
> deaths + 1 survived-by-scripting) that STRENGTHENS the automation-reduces-upkeep
> argument behind E9/#55/#115. Cite it; don't queue a row."

So **DH-59 → E12, DH-60 → E15+BUG-1** (no standalone rows), and the **3-thread
automation signal** is folded into the upkeep-reduction rationale (DH-36, below) rather
than queued. **#115 priority is UNCHANGED** (re-confirmed by the continuation-boot, §9.1.9)
and **no keystone moves.**

**★ Batch-10 lead A — the `scenarioBoot(BootSheet)` PIPELINE (#115) is PROMOTED to
the FRONT of the subsystem queue, but it FOLDS INTO K4's `BootSheet` schema — it is
NOT a new keystone** (tech-lead §9.1.9, §9 batch-10 lead #1 — BINDING):
> "#115 is the single most-requested missing item in the forum's own words — there
> are no documented rules for CREATING a game. Verified shipped-state: NO shared boot
> abstraction — `startNewGame` (`GameContext.tsx:264`) switches on a literal into
> hand-authored `build1772Scenario`/`build1856Scenario`; `scenario1856.ts:44-214`
> seats Congress with raw `Math.random`, naive Senate-class assign, full `EV-2` House
> reps, a 47-field `GameState` literal; no career-track seeding, no Command-stripping.
> Build the shared `scenarioBoot(BootSheet)` pipeline WITH the first new scenario
> (Phase-1 #1), before the third copy-paste of a hand-authored scenario. Dependency
> order: K0 (seed boot rolls) → `scenarioBoot` + `BootSheet` (with K4) → every
> scenario becomes a data row. This is the venue for the XS boot validators (DH-24,
> DH-27) and the appointment-ladder."

So **#115 sequences K0 → `scenarioBoot`/`BootSheet` (built with K4) → scenarios-as-
data**, and is **built with `scenario1788` (E1) before the third hand-authored copy.**
It is NOT a keystone (it folds into K4); QW8/QW9 + the #115b appointment-ladder live
inside it. No new keystone, no re-order — but the boot pipeline moves to the front of
the subsystem work because the next scenario (E1) needs it and would otherwise be a
third hand-authored copy.

**★ Batch-10 lead B — TWO forks are DECISION-GATED (a HUMAN design pick), NOT
ready-to-build** (tech-lead §9 batch-10 lead #2 — BINDING):
> "Each fork has 3 live models and needs a human design pick first. Player-controlled
> SCOTUS (#52): all-CPU-by-ideology vs player-controllable-with-restrictions vs
> trait-gated — but the SCOTUS docket data structure is needed either way (→ E25); it
> lives in `src/data/scotusCases<Era>.ts` + a `GameState.scotusDocket` ledger (shipped
> court is a coin-flip, `phaseRunners.ts:3397,3648`). Meter→enthusiasm→election
> (#18/#51): 'every state unless penalized' vs 'ideology-leaning states only' vs
> 'primaries only.' Settled part: meters move enthusiasm boxes + a hard ±3 cap. Shipped
> `calcStateVote` (`phaseRunners.ts:3685`, score `:3709-3711`) applies enthusiasm
> uniformly with NO ±3 cap, NO per-state penalty — the cap is a queued XS clamp (QW3)
> but its binding point + state-scope wait on this fork."

So both forks are recorded under **"Decision-gated"** in the parking lot — NOT in
"Up next." **The work that does NOT wait on the picks is buildable now:** the SCOTUS
**docket** (E25, the player-vs-CPU surface is what's gated) and the **meter-write ±3
clamp** (QW3, the enthusiasm-application binding is what's gated).

**★ Batch-10 lead C — the SIZED corroborated fixes slot into existing epics**
(tech-lead §9 batch-10 lead #3 — BINDING): **DH-53** bill-EV-sign = **S, author
STRUCTURED bill-effect tables** (NOT a sign-flip — `Legislation.effects` has no
per-state EV field; `applyEffect` `phaseRunners.ts:3209` can't mutate `electoralVotes`)
→ **E20** + K4's DH-48 `evDelta` shape; **DH-24** Senate-class validator = **XS into
the boot pipeline** (QW8); **focus-Rep (EV−2)/5 House (#55)** = **M into scaling-wall-
(b) (E7) + the census epic (E28)**; **statehood→sectional-crisis (#59)** = **S additive
at `admitState`** (`territories.ts:8` does no balance check; fires from 1820/Nationalism
starts too) → folds into **E3b** (b); **appointment-ladder + replacement-gains timing
(#115b)** = **XS each into boot/appointment rules** (the ladder pairs with **DH-25**).

**★ Batch-10 lead D — the era model is 4-START-CONFIRMED (confidence, not scope)**
(tech-lead §9 batch-10 lead #4): `dem1820`'s own draft table prints "Era of Democracy
(1820-1840)" → "Manifest Destiny (1840-1856)" (POST 946), so the #92 content-band model
now holds across **1772 + 1800 + 1820 + 1948**. K3/K4 stay the safest large bet; no
re-spec.

**★ Batch-10 lead E — DH-36 is the PRIORITIZATION ARGUMENT for the upkeep-reducing
items, NOT a row** (tech-lead §9 batch-10 lead #5): `dem1820` is the **2nd GA-burnout
DEATH** in the KB (after `new1772`), this one driven by **player friction from
undocumented/inconsistent rules COMPOUNDED by manual upkeep** (a 10-page/8-day midterm;
constant sheet repair). "Automation reduces the manual-upkeep burden that's killing
playtests" is now corroborated across **2 dead threads**, and the friction came from
**undocumented setup rules** — which is exactly the case for **#115 (the boot pipeline
canonicalizes the disclosed ruleset), #55 (focus-Rep cuts House upkeep), E7 (House-
slate persistence), and K5/E9 (the CPU suite owns the deterministic upkeep a human GM
can't sustain).** It justifies the ORDERING (boot pipeline + upkeep-reducers near the
front), not a new item.

**★ Batch-9 lead A — the era model is 3-START-CONFIRMED and gains a TWO-LEVEL
refinement + a structured-era-event-data requirement; still NOT a new keystone, NO
re-sequence** (tech-lead §9.1.5 updated, §9 batch-9 lead #1 — BINDING):
> "Two saves at two start years (batch 8) + a third start year (1948, batch 9), one
> deterministic band sequence ⇒ the era keystones (K3/K4) are the safest large bet
> in the roadmap… Both must be built; do NOT collapse them: (a) point-banked
> Historical Eras with RULE-DELTAS (the Era-of-Terror cabinet rework proves bands
> carry rule changes, not just content) AND (b) a separate per-decade census doing
> bulk EV-reallocation + state-bias re-lean + content-rotation… era-event data needs
> STRUCTURED `evDelta`/census fields (DH-48 — the Neocon census events were LOST as
> free-text). 'Neocons' is a faction-rebrand, NOT a band."

So K3 gains the census-as-a-second-schedule + the per-band rule-delta hooks; K4 gains
the structured era-event data + per-era completeness validators. Both stay **M**;
both land inside the existing keystones. No new keystone, no re-order.

**★★ Batch-9 lead B — NEGATIVE SCOPE: there is NO Cold-War subsystem; do NOT queue
one** (tech-lead §9.1.8, the single most important scope-control finding this batch
— BINDING):
> "Despite the 'Nuclear Age' title there is NO purpose-built Cold-War system — no
> containment engine, no nuclear/MAD model, no NATO/Article-5 bloc, no space-race
> subsystem, no army/navy/air branches… Grep confirms only `revolutionaryWar.ts`
> exists… Net: zero new engine subsystems for 'the Cold War.' The work is the generic
> war engine + diplomacy (both already on the roadmap) + content."

So the Nuclear-Age era is **DATA on top of E3 (generic war) + E12 (diplomacy)** — and
those two rows gain the load-bearing build-holes the label hides: **E3 must RESOLVE**
(DH-47: wars never end today; ideally army/navy/air branches), and **E12 is the real
modern foreign subsystem** (8 relation meters + ambassador actions; DH-46 downward
pressure; DH-45 USSR-collapse trigger). This mirrors the batch-8 no-future-era guard:
a negative result that prevents the biggest scope-creep risk in the modern era.

**★ Batch-9 lead C — CPU-faction AI is LOAD-BEARING (K5 + E9 elevated, NOT
re-sequenced)** (tech-lead §9.1.3 priority bump — BINDING):
> "The digital APP is built for 1-human-vs-9-CPU (multiplayer 'goes off the rails';
> the points system is for the CPUs, not humans)… the app is a solo adaptation of a
> multiplayer game, so the entire multiplayer apparatus must be CPU-AI-driven… This
> does NOT re-sequence K5 (it still lands after K0 + K2), but it raises K5 + the
> handler suite (E9) from 'force-multiplier' to the load-bearing system that makes
> the product playable solo at all."

So K5's **placement is unchanged** (after K0+K2, parallel with K3/K4); its
**priority/status rises** — the E9 handler suite is now a first-class Phase-1 system,
not a nice-to-have. The `nuke` thread also confirms the whole MP-apparatus surface was
**entirely UNEXERCISED** by the human playtest, so it must be authored from spec.

**Batch-9 small placements (no re-order):** E16 → **create-AND-abolish** cabinet
seats (`abolishesCabinetSeat?`); E25 → **legislated variable SCOTUS size +
excess-not-replaced** (#112); E10b/E29 → the modern institutional layer (#105 +
DH-54 author-before-build); E20 → realignment + landslide-cap (#108/#110/DH-52); E30
→ `scenario1948` as a 4th `BootSheet` boot + DH-51 dataset parity. **Senate
pass-threshold resolved-in-code = simple majority** (`phaseRunners.ts:3562`); the
60%/cloture design question stays OPEN for the human. **Parking lot → 12** (DH-49
population-model+House-cap, the one new infra item; DH-54 impeachment/succession).


**★ Batch-8 lead — the ERA MODEL (K3/K4) is now the HIGHEST-confidence finding in
the KB; this batch changes confidence, not structure** (tech-lead §9 batch-8 lead
/ §9.1.5 batch-8 confidence bump — NO re-sequence, NO new keystone):
> "Two independent saves emit the identical era-band sequence at identical in-game
> dates: `tea1772` (1772-start solo all-CPU) and `rep1800` (1800-start
> multiplayer), 28 in-game years apart. The bands are deterministic game-state
> content-gates, not GM flavor. **The K3/K4 spec was already condition-driven from
> batch 7 — nothing changes structurally.** This raises the era keystones to the
> **highest-confidence large bet in the roadmap**; treat the content-band model as
> settled."

So: (1) **K3/K4 are MULTI-SAVE PROVEN** — the safest large era bet; start there if
engine staffing is scarce. (2) **#102's dual era-scoring** (per-era + cumulative)
is the **WIN-CONDITION scoreboard** — it folds into K3/K4 point-banking (the win
condition is DUAL), not a new item. (3) **E16's dynamic-seat refactor is
reinforced** — `cabinetSeatsForYear` is the WRONG model at BOTH ends
(founding offices-by-law + modern bill-creates-a-seat), so it is foundational to
the offices-as-data theme, not modern-only. (4) **DH-41 is the one new
author-before-build item** (the general SCOTUS-ruling → statute cascade, deferred;
parking lot → 10 total). (5) **★ NEGATIVE RESULT — no thread reaches a "future"
era; the roadmap does NOT scope one (K4 adds exactly `gilded` + `progressive`).**
(6) **DH-36 (GM-burnout abandoned a 12-turn game) is the META justification** for
the whole build — cited in the intro, not queued. All other batch-8 deltas
(#100/#103/#104/#105 + DH-38/39/40/42/43/44) **fold into existing epics** with no
re-order; **DH-43 lands as QW11** (Vermont dataset fix).


**★ Batch-7 lead A — the ERA-MODEL REFRAME re-specs K3 + K4, it is NOT a new
keystone** (tech-lead §9.1.5 / §9.6 lead #0 / divergence #18 — the single most
important call this batch, and the biggest architectural reframe of the era
keystones across all 7 batches):
> "An 'era' in AMPU is a **content-band** — a set of available bills + era-events
> + draftees + a state-bias table — that the game advances through on **game-state
> / meter / territory-ownership triggers, evaluated per half-term**, NOT by
> matching a real calendar date… Verified: phases gate by `year % 4`/`year % 2`
> (`phases.ts:49-59`, **correct for cadence and stay**); the ONLY era advance is
> the hard-coded `currentEra = 'federalism'` at `constitutionalConvention.ts:198`;
> **there is no year→era derivation anywhere** — so this is a generalization of
> one existing trigger, not a rewrite. `advanceEra(snap)` watches an
> `era.advanceWhen` condition; content gates on `game.eraBand` + a new
> `territoryOwned` predicate, **not the calendar**. RECONCILES #68 per-era
> point-banking + §26 BootSheet boot model + §27.1 content-band finding into ONE
> era system."

So K3 changes from `advanceEra(snap, target)` to `advanceEra(snap)`; K4 gains the
per-era content-band registry `{bills, eraEvents, draftees, biasTable,
advanceWhen}`; the early sub-bands (Republicanism/Democracy/Manifest-Destiny) are
content-band **markers**, not new enum values (tech-lead's call: markers first).
Both stay **M**. The new `territoryOwned` predicate is **one predicate, three
consumers** (bills, era-events, draft pool).

**★★ Batch-7 lead B — the RECONSTRUCTION SOLO-BLOCKER (DH-29) is a hard BUILD
REQUIREMENT on E3b** (tech-lead §9.1.6 / §9.6 lead #1 — the second-most-important
call, a hard gate on the 1856-arc shipping as a winnable solo game):
> "GM-verified (`rep1800` POST 9170): the historical Strict/Ironclad readmission
> plan can **NEVER pass with CPU factions** → **solo Reconstruction is
> UNRESOLVABLE**, which dead-ends the 1856-arc as a winnable solo scenario (and
> AMPU is single-player). **E3b's definition-of-done must include a CPU-passable
> readmission path** — my rec: (1) a CPU default-vote bias for the flagged
> historical plan (K5 handler #2) **+** (3) an era-boundary auto-resolution
> backstop (K3). The readmission half of E3b should land AFTER K5 handler #2 or
> carry the era-boundary auto-resolution as its self-contained fallback. **Ties
> E3b to the CPU handler suite (K5 / E9).**"

So E3b's readmission half (sub-PR d) is **gated on E9 handler #2 OR K3's
condition-driven `advanceEra`** — the one place the 1856-arc genuinely *needs* the
CPU handler suite, not merely benefits from it. The war half (a–c) is unblocked.

**★ Batch-7 lead C — IDEOLOGY-AS-CIRCLE is FOUNDATIONAL — a central-helper
refactor behind an era-gated flag; place it EARLY-ish (Phase-1 #5b / E5b)**
(tech-lead §9.1.7 / §9.6 lead #2 / divergence #19):
> "`IDEOLOGY_ORDER` (`types.ts:14`) is **LINEAR** and ideology distance is
> **open-coded at 10+ engine call sites** (`factionCenter` `phaseRunners.ts:715`,
> `stepToward` `:740`, conversion adjacency `:993-1003`, sponsor `:3548`, a
> private `firstContinentalCongress.ts:120` helper, + 3 UI pages) — **there is NO
> central distance helper today**. Add `ideologyDistance(a, b, circular)`, migrate
> the 10+ sites (behavior-preserving while `circular = false`), gate the wrap on
> `GameState.ideologyIsCircular?`. Steps 1-2 are **cheap and additive while the
> flag is off**, and they pay down a latent consistency risk — every later
> ideology consumer (the SCOTUS within-1-step auto-AYE §26.6, the conversion
> handler #6, the faction-center math) gets the single helper for free. **Not a
> keystone** (nothing blocks on it), but the cheapest while early and the most
> error-prone if deferred."

So E5b lands the helper + migration **before** E9's conversion (9f) + SCOTUS (9n)
handlers, so they call it from day one rather than open-coding distance an
11th/12th time.

---

Carried batch-5 leads (still binding):

1. **K5 (`CpuController` scaffold) is a NEW late-keystone — after K0 + K2,
   parallel with K3/K4 + federalism** (tech-lead §9.6 call #1, §9.1.3 — the
   single most important batch-5 call):
   > "The shipped engine has **no agent-decision pass at all** (3 thin stubs
   > only). The §25 spec'd 15 subsystems have nowhere to live without it. K5
   > itself is ~120 lines (orchestrator + handler interface + tie-breaks + 2
   > `repair()` backfills + 1 determinism test). It **unlocks ~15 follow-on
   > handler PRs** that parallelize across contributors. K5 is a
   > force-multiplier, not a scenario gate — federalism + the 1856-arc epic
   > can ship with stubbed handlers and upgrade together."

   So K5 sits as the 6th Phase-0 keystone, parallel with K3/K4. The 15-handler
   suite is a single Phase-1 epic (E9) ordered by §6.6.1's handler-order table.

2. **Cabinet-confirmation system (DH-23) is XS-S, NOT M — because the broken
   system isn't built yet** (tech-lead §9.6 call #2, §9.3 #14):
   > "`runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2223`) is a one-step
   > scored pick with no Senate vote. So the fix is 'build the confirmation
   > step in the right shape from day one' (default-AYE baseline + Iron-Fist
   > Maj-Leader auto-AYE-own-picks + lobby-maximizer Admin-weighting), which
   > is CPU handler #4 (§6.6.1). Lands as a sibling of the cabinet-retention
   > refactor (Phase-1 #16)."

   So DH-23 is **not a quick-win**; it lands at E16 as the XS-S confirmation
   step + at E9 handler 9d for the CPU side.

3. **What's READY now vs. what still needs design** (tech-lead §9.6 call #3):
   > "**READY (no design task remaining):** the 13 §25 subsections #25.1–#25.8
   > + #25.10–#25.14 — all 15 CPU handlers can be authored against §25
   > verbatim. Plus #79 25/10/5 Justice drift, #80 ±3 swing cap, #82 veto
   > override 2/3, #83 midterm meter+enthusiasm, #85 5%/half-term
   > retire-death. **NEEDS DESIGN (parking lot):** divergence #10 / #84
   > contingent-election rules (5 rulesets invented mid-thread, no canonical
   > answer); §25.9 Iron-Fist split (the 6 child traits' exact names + cascade
   > rules); DH-1 filibustered-MUST-pass; DH-12 white-peace; DH-13
   > faithless-elector trigger; DH-14 era-aware bill impacts; DH-15
   > small-state multiplier."

   READY-now count went from ~30 to ~45+ this batch; needs-design grew from
   1 (DH-1) to 7 (DH-1 + #10/#84 + §25.9 + DH-12/13/14/15).

4. **BUG-0 is the cheapest win in the whole roadmap — do it first** (carried
   from batch 4):
   > "Verified: `RELOCATION_ATTEMPTS_PER_TURN = 5` at `types.ts:247`; one-line
   > const edit, no migration, no dependency."

   Sits at the very top of the quick-wins (QW0).

5. **Per-era point BANKING (#68) reshapes the era keystones + the win
   condition — not a new item** (carried from batch 4):
   > "The era boundary is a bank-and-zero + award + full 2.1.x→2.3.1 re-run +
   > content-swap pipeline; the per-era banks sum toward the (open) cross-era
   > win total. Build `advanceEra` with the bank step from the start."

6. **The Civil-War / Reconstruction epic lands EARLY-ish (E3b) because it
   COMPLETES a shipped scenario** (carried from batch 4):
   > "`scenario1856.ts` ships today but its era-event spine dead-ends at the
   > Trent Affair (1861); adding #56/#57/#58/#59 completes a half-finished
   > playable scenario."

   E3b sits right after generic war (E3) + K2, **not** behind federalism (E1)
   or the modern tail. **Batch 5 adds: it is the first scenario to get a full
   K5 handler suite — wire handlers as they land.**

7. **Generic war (E3) is DESIGNED multi-theater + tiered from day one — with
   the multi-confirmed formula** (tech-lead §9.6, sharpened batch 5):
   > "`drums` re-derives the formula `Win% = Difficulty + Planning + Officer×10
   > + MilPrep + Benchmarks` end-to-end across Eastern + Western + Utah + WWI
   > + Mexico + Sioux — the single most multiply-confirmed cross-era resolver
   > in the knowledge base. `WS ≥ +11` auto-win; war-end `WS×2 = %`; post-war
   > defeat `|WS|×2×10`; naval-N-then-ground per-war; Treaty A-D + 3-roll
   > chain. The Civil War is the Major-tier instance — a configured instance,
   > not a rewrite."

8. **K2 (ActionRegistry) remains the second-most-important keystone after K0**
   (~6× leverage across 6 action libraries) **AND is a hard prerequisite for
   K5** — most CPU handlers pick from a registry library. Do K2 first if only
   one keystone lands this quarter.

9. **The two-track parallelization is still the biggest schedule lever**
   (tech-lead §9.4, §9.6). Sync points: a handful of additive `Politician`/
   `Party` fields + two deeper handoffs (A4 ↔ E3 war odds; P2 ↔ E8 portraits).
   Start the presentation track immediately with P0.

10. **(carried) #8 cabinet, #7 SCOTUS, the two scaling walls, far-end vs
    near-term.** #8 is a real cabinet wipe→retention refactor (M, E16) —
    batch 2 wrongly said no wipe exists (`:3804-3812`). #7 SCOTUS is
    from-scratch over a *stub* (`:3398-3414`), far-end (E25). The two
    scaling walls (persist House slates E7; procedural pol gen E8) are
    NEAR-term, not modern-only. Federalism before gilded before modern;
    `scenario1788` before a fully-general `advanceEra`.

11. **RNG first (K0).** Determinism is the prerequisite for multiplayer
    AND for **K5's deterministic tie-breaks** (every CPU decision must be
    reproducible from the seed), AND any replay/test harness, a soft gate
    for every roll-heavy subsystem (war E3/E3b, convention E10, governor
    d100s E11, filibuster E14, primary E24), **and a hard gate for the
    seeded procedural pol generator (E8)**.

12. **Within-track dependency notes.** **E18g (numeric `nationalSurplus`/
    `nationalDebt`) is a prerequisite for E2's cap *and* E6's debt field —
    build that sub-item early.** E4's global flip + the 12A toggle need E5
    (amendments). **E4b (early-republic cluster) splits its deps: (a)
    slavery-flag+Cohens needs E25's SCOTUS docket [the `Cohens` rule-modifier]
    + E5 [the abolition amendment]; (b) Second Bank needs K2 + E13 + the E16
    dynamic seat list; (c) statehood-by-bill needs E21 + K3's `territoryOwned`
    predicate.** **E5b (ideology-as-circle) is independent but lands steps 1-2
    BEFORE E9's conversion (9f) + SCOTUS (9n) handlers so they call the central
    helper from day one.** E21's statehood needs E2 + E3 + E8 + K3's
    `territoryOwned` predicate; **E3b's Canada arc (#60) needs E21's per-era
    admission gate.** **★★ E3b's Reconstruction readmission half (DH-29) needs
    E9 handler #2 (CPU default-vote bias) OR K3's condition-driven `advanceEra`
    (era-boundary auto-resolution) — its DoD.** E10b's VP-vacancy fill needs
    E5. E14e (investigation) needs E2's bill type. E24 needs E10's CPU delegate
    engine + handler 9i. E26 needs E23. E28 needs E7. **All 15 E9 handlers
    need K5; 9k/9l also need K5's persistent state.** P1/P2/P3 consume P0.

### Estimate caution

Sizes are the tech-lead's. Rows that may still feel XL after a first pass:

- **E3 (generic war)** — sized M–L, but the **batch-9 build-holes may push it
  toward the top of that range**: DH-47 adds a **resolution/peace path** (wars
  never end today) and **army/navy/air branches** to the core formula. Ship the
  base resolver + the resolution path first (it is what makes the Cold-War wars,
  Korea, terminate); the branch model can be a follow-on sub-PR. Remember: this
  is the ONLY war engine — the Cold War relabels it, there is no second engine.
- **E3b (Civil-War / Reconstruction)** — sized L but it is a full subsystem;
  **ship as 5 sub-PRs** (secession #58 → sectional crisis #59 → two-theater
  war #56 + CW variants #97 → Reconstruction #57 → Canada #60), cheap-first.
  **★★ The Reconstruction sub-PR (d) carries the DH-29 solo-blocker DoD** —
  it lands AFTER E9 handler #2 (CPU default-vote bias) or carries K3's
  era-boundary auto-resolution as its self-contained fallback. Do not ship
  the readmission half without a CPU-passable path.
- **E1 (federalism / early-republic epic)** — sized L; expect the era-event
  spine and the SCOTUS set to each be their own sub-PR. The early-republic
  subsystems are folded OUT into E4 + E4b (sequenced after their keystones).
- **E4b (early-republic cluster)** — sized M but **3 independent sub-PRs**
  with different deps (slavery-flag+Cohens → SCOTUS docket + E5; Second Bank
  → K2 + E13 + E16 seat list; statehood-by-bill → E21 + K3's `territoryOwned`);
  ship them as they unblock, not as one epic.
- **E9 (CPU handler suite)** — **~15 PRs**, not one. Order by §6.6.1; ship
  one at a time. Handlers 9k/9l (the DH-* architectural gaps with persistent
  state) land **after** the simpler handlers have exercised the scaffold.
- **E10 (convention)** — the single biggest unbuilt subsystem; **split into
  ~3** (ballot loop → inter-ballot library on K2 → platform/VP/scandal).
  The CPU side is owned by handler 9e (E9), not by this epic.
- **E14 (legislative micro-mechanics)** — now **7 sub-PRs** sharing the bill
  pipeline (block-and-replace → packaging → filibuster → crisis tag →
  investigation #54 → veto override #82 → midterm #83).
- **E16 (cabinet + Congress + offices-by-law + confirmation + ★ batch-12 #124
  enthusiasm REWORK)** — **★★ batch-12 RE-SCOPED M (was L with a XS-S confirmation
  step inside)**. **Five coupled jobs** (9-role Congressional pipeline; cabinet-
  wipe→retention refactor; **confirmation + #124 enthusiasm rework BUILT TOGETHER
  from day one** — lobby = POINTS to `Faction.score?`, ideology composition =
  ENTHUSIASM via ±3-cap clamp; offices-created-by-law #66; dynamic seat list
  CREATE-AND-ABOLISH). **LANDS AFTER K2 + K5** (cabinet picks are CPU actions; uses
  the conditional-vote-rules primitive). **#124 numeric percentages stay designer-
  gated open** (Decision-gated "designer-gated" #8/#9); ship a const table that
  re-tunes post-design. **Split if any feels XL during scoping.**
- **E30 (modern era scenario)** — the XL capstone; decomposes into roster +
  era-event spine + bill catalog + card pool sub-PRs; gates on most of Phase
  1 + 2.
- **P2 (portrait pipeline)** — an asset-pipeline epic; the no-AI-in-product
  constraint shapes the tech choice from day one; must render generated pols
  (shared with E8).

---

## Provenance note

This reflects **batches 1–12** — **fourteen** ingested digests across **12 playtest
threads + 2 DISCUSSION threads** (the batch-12 additions are **`smallbugs`** and
**`tedchange`** — the FIRST DISCUSSION-THREAD INGESTS in the corpus, distinct from
playtests: **`smallbugs`** = `cf82a7d3` "A Thread for small low priority changes and
errors", 804 posts, the 3-yr+ rolling community-curated bug + ruling catalog with
vcczar's nested rulings; **`tedchange`** = `a0f0bf04` "Discussion: Ted's Change Log
of Doom", 408 posts, the DESIGNER Ted's official rules-doc rewrite/cleanup channel,
Sept 2024 → Oct 2025 — the **HIGHEST-authority rules source in the corpus**): the
`f4c7c2c4` 1868 Gilded-Age multiplayer dry-run, the
`f55d3e21` 1788 federalism solo-with-AI playtest, the `85f8e6b4` 1772 solo
aesthetic experiment, the `3a9ac985` modern (2004→2020) multiplayer campaign, the
`77db6e6f` **1856-native "A House Divided" Part 2** (9051 posts — the only source
for the Civil-War / Reconstruction / secession machinery), the `e1776bbd`
**all-CPU "Drums of War"** (7540 posts — the first explicit forum record of CPU
heuristics), the `c50d9da7` **"Era of Populism" 2012 fresh-modern boot** (1172
posts — the canonical `BootSheet` + meter-driven endgame), `rep1800` — the **"Era
`f4c7c2c4` 1868 Gilded-Age multiplayer dry-run, the
`f55d3e21` 1788 federalism solo-with-AI playtest, the `85f8e6b4` 1772 solo
aesthetic experiment, the `3a9ac985` modern (2004→2020) multiplayer campaign, the
`77db6e6f` **1856-native "A House Divided" Part 2** (9051 posts — the only source
for the Civil-War / Reconstruction / secession machinery), the `e1776bbd`
**all-CPU "Drums of War"** (7540 posts — the first explicit forum record of CPU
heuristics), the `c50d9da7` **"Era of Populism" 2012 fresh-modern boot** (1172
posts — the canonical `BootSheet` + meter-driven endgame), `rep1800` — the **"Era
of Republicanism" 1800→1868 early-republic campaign** (the first procedural record
of the 1800–1856 early republic and the predecessor of batch-1's `gilded`), the
**two batch-8 1772 threads** — **`new1772`** (the **first MULTIPLAYER 1772
founding campaign** — 10 humans 1772→1796, the entire federal apparatus stood up
piece-by-piece from a 1772 start; **abandoned at GM burnout**) + **`tea1772`** (a
157-post **solo all-CPU 1772→1874 fast-traversal** that stalls mid-Gilded) — and
now the **batch-9 `nuke`** thread: the **Nuclear-Age / Cold-War / modern-half
campaign** (1948→Era-of-Terror ~2005; at **12,228 posts the LARGEST corpus in the
KB**, the chronological **predecessor of `modern`**, joined at the 2004 election).
**The KB now spans a CONTINUOUS 1772→2020 timeline:** founding (1772, multiplayer
`new1772` + solo `tea1772`) → early republic (1800→1868, `rep1800`) → Gilded
(1868, `gilded`) → Nuclear Age / Cold War (1948→2005, `nuke`) → modern
(2004→2020, `modern` + Populism `pop`), with the antebellum (`hd`) and the all-CPU
war traversal (`drums`) corroborating across the span. **The era-band model is now
4-START-CONFIRMED — 1772 + 1800 + 1820 + 1948.** **Batch 12 is the FIRST DISCUSSION-
THREAD INGEST in the corpus** — `smallbugs` + `tedchange` are NOT playtests; they are
the **DESIGNER's official rules-doc patches** (Ted in `tedchange`, vcczar in
`smallbugs`), and most findings SUPERSEDE prior GA calls where they conflict
(authority hierarchy now explicit: **Ted/vcczar > GA > inference**, game-mechanics
§30.4). **This batch-12 pass is DESIGNER-RULINGS INTEGRATION + QW0 FULLY CLOSES +
ONE M-rework + 19 sized rulings slotted — NO re-sequence, NO new keystone:**

- **★★ QW0 / BUG-0 FULLY CLOSES** (cap=4 + alt-state EXEMPTION guard, vcczar-12-30-25
  `smallbugs#POST 734-735` RULED) — promote to "ready-to-ship FIRST" at the top of
  the queue;
- **★★ E16 RE-SCOPED M** to bundle the cabinet confirmation system + #124
  cabinet→enthusiasm REWORK from day one (lobby = POINTS to `Faction.score?`;
  ideology composition = ENTHUSIASM; numeric percentages stay designer-gated);
- **★ 18 OTHER TED-RULINGS sized + slotted into existing epics: 12 XS** (#135 / #136
  / #137 / #138 / #139 / #141 / #142 / #131 / #132), **5 S** (#126 / #127 / #128 /
  #129 / #130 / #133 / #140), **3 M** (#124 → E16, #134 → E6 Lingering 7-step + tax/
  tariff carry-forward, #120 dataset umbrella → ONE coordinated `scripts/seedDataset.mjs`
  pass);
- **★ E5 + E25 SIMPLIFIED** by the amendments-NOT-SCOTUS-challengeable build-target
  (vcczar `smallbugs#POST 250-269` OVERRIDES `tea1772` #100 — drop the SCOTUS-overturns-
  amendment branch from both rows; keep E5's strike-a-statute + mutable-threshold +
  #119 lifecycle, keep E25's docket + drift + DH-32 state-guard);
- **★ NEW Decision-gated sub-bucket "designer-gated"** (9 items, NOT ready-to-build
  until Ted/vcczar closes them in `tedchange`/`smallbugs`): Mil-Prep meter level 4
  fix, **#125 UEM**, Crisis trait consolidation, term-limit Gov actions in pre-Senate
  era, faithless-elector rewording, party rename PL-vs-EraEvo, VP-must-be-same-party-
  on-resignation, cabinet enthusiasm percentages (the #124 numeric), cabinet ideology
  weighting Big-4-vs-rest;
- **★ STRENGTHENINGS (no new rows):** **#76 (CPU conversion adjacency)** EXTENDED via
  `tedchange` (same-party can target same OR ADJACENT ideology); **#99 (ideology =
  circle)** now **TED-AUTHORITATIVE** (3-thread corroboration → designer-RULED, 25%
  rate pinned, Two-Faced auto-grant); **#67 (Lingering bank ordering)** RULED → #134
  (canonical 7-step + carry-forward); **#100 (Gov-requested SCOTUS review of
  amendments)** OVERRIDDEN by Ted/vcczar (mark superseded);
- **★ NEW gaps:** **#121** Secessionist trait missing from politicians dataset
  (XS — dataset addition + a one-row `Trait` union add; folds into #120 umbrella +
  E3b sub-PR (a)); **#122** pardon mechanics entirely unspecified → **NEW author-
  before-build item** (13th total; folds into E29 when authored); **#123** small late-
  modern content bundle (Wyoming Rule → Real House Act 585-cap, runoff-amendment,
  Senate-Abolish amendment) → folds into Phase-2 #28 / #30.

**This batch-10 pass (carried) is PROMOTION + decision-gating + small placements —
NO re-sequence, NO new keystone:**

- **★ PROMOTES the `scenarioBoot(BootSheet)` pipeline (#115) to the front of the
  subsystem queue, folded into K4's `BootSheet` schema** (NOT a new keystone): there
  are NO documented rules for CREATING a game; build the shared pipeline (K0 → boot
  rolls; `scenarioBoot` + `BootSheet` with K4; scenarios-as-data) WITH `scenario1788`
  (E1), before the third hand-authored copy. Venue for QW8/QW9 + the #115b appointment-
  ladder;
- **★ DECISION-GATES two forks** (new "Decision-gated" category, 2 items): #52
  player-controlled SCOTUS (3 models; docket needed either way → E25) + #18/#51
  meter→enthusiasm→election (3 models; settled ±3 cap → QW3, binding-point → E20/E23);
- **slots the sized fixes:** DH-53 structured bill-effect tables (S → E20 + K4),
  DH-24 Senate-class (XS → QW8/boot pipeline), focus-Rep (EV−2)/5 #55 (M → E7 + E28),
  statehood→sectional-crisis #59 (S → E3b additive at `admitState`), #115b appointment-
  ladder + replacement-gains (XS → boot/appointment rules, pairs with DH-25);
- **makes the #92 era-band model 4-START-CONFIRMED** (K3/K4 confidence bump);
- **records the 2nd GA-burnout DEATH (DH-36) as the prioritization ARGUMENT** for the
  upkeep-reducing items (#115, #55, E7, K5/E9) — NOT a row; author-before-build count
  stays **12**.

And the batch-9 pass that this one leaves UNCHANGED in order — **CONFIDENCE +
NEGATIVE-SCOPE + small placements, NO re-sequence, NO new keystone:**

- **★ K3/K4 (the era model) is now 3-START-CONFIRMED** (1772 + 1800 + **1948**)
  and gains a **TWO-LEVEL refinement** (point-banked Historical Eras carrying
  rule-deltas + a separate per-decade census doing EV-realloc + bias-re-lean +
  content-rotation; do NOT collapse them) **+ a STRUCTURED-era-event-data
  requirement** (DH-48, typed `evDelta`/census fields + per-era validation); the
  "Neocons" mislabel is logged as a faction-rebrand, NOT a band;
- **★★ records the NEGATIVE-SCOPE Cold-War guard** — there is NO Cold-War
  subsystem to build (only `revolutionaryWar.ts` exists); the Cold War = the
  generic war engine (E3) + the diplomacy subsystem (E12) + content (data), and
  those two rows gain the real build-holes (E3 must RESOLVE — DH-47; E12 needs
  downward pressure + the USSR-collapse fix — DH-45/46);
- **★ elevates K5 + the E9 handler suite to a first-class LOAD-BEARING Phase-1
  system** (the APP is 1-human-vs-9-CPU, #114; K5's placement is unchanged);
- **strengthens E16** (create-AND-abolish cabinet seats), **E25** (legislated
  variable SCOTUS size), and folds the modern election/institutional layer + the
  `scenario1948` 4th-boot + DH-45..DH-58 into existing epics;
- **records the Senate threshold as resolved-in-code (simple majority) / the
  60%-cloture question as an OPEN human decision**;
- **adds DH-49 (population model + House cap — the one new infra item) + DH-54
  (impeachment/succession ruleset) to the parking lot → 12.**

And the batch-8 confidence-hardening pass that this one leaves UNCHANGED in order:

- **★ bumps K3/K4 (the era model) to HIGHEST confidence — MULTI-SAVE PROVEN**
  (§9.1.5 batch-8 bump): `tea1772` (1772-start) + `rep1800` (1800-start, 28 in-game
  years apart) emit the identical era-band sequence at identical dates (#102), so
  the content-band model is settled. No structural change; **#102's dual
  era-scoring (per-era + cumulative) is the WIN-CONDITION scoreboard**, folded into
  K3/K4 point-banking (#68);
- **★ strengthens E16's dynamic-seat refactor justification** —
  `cabinetSeatsForYear` confirmed the WRONG model at BOTH ends (founding
  offices-by-law `new1772` §24.6 + modern bill-creates-a-seat `pop`), no new work;
- **★ adds DH-41 to the author-before-build parking lot (now 10 total)** — the
  general SCOTUS-ruling → downstream-statute cascade, UNBUILT and `vcczar`-deferred;
- **folds the new small mechanics into existing epics:** #100 (SCOTUS-overturns-
  amendment + amendable-threshold) → E5 + E25; #103 (pres-vote modifier stack +
  era-issue list) + DH-42 (meter-vs-lean balance) → E20; #104 (lone-ideology
  convention exploit) → E9 handler 9e; #105 (stat-collapse → forced resignation) →
  E10b; DH-38 (late-ratification/Rogue-Island window) → E1; DH-40 (justice-count
  not packaged → stall) → E14b + E25 (XS-S); DH-44 (post-12A vote count) → E4;
- **adds QW11** (DH-43 Vermont home-state dataset fix, XS);
- **parks** DH-37 (no pol-trading, #1 AMPU-2 wishlist) + DH-39 (all-human
  Convention deadlock) on the multiplayer track;
- **★ records the NEGATIVE RESULT** — no thread reaches a "future" era, so the
  roadmap does NOT scope one (K4 adds exactly `gilded` + `progressive`);
- **cites DH-36** (GM burnout abandoned a 12-turn game) as the META justification
  for the whole build (intro rationale, not a queued row).

The batch-7 re-sequence that this pass leaves UNCHANGED:

- **★ re-specs K3 + K4 for the era-model reframe — NOT a new keystone** (§9.1.5 /
  divergence #18): `advanceEra(snap)` becomes condition-driven (game-state /
  meter / TERRITORY, per half-term — no `target` arg; the CC `:198` line becomes
  the first `advanceWhen` condition); content gates on `game.eraBand` + a new
  `territoryOwned` predicate (one predicate, three consumers), not the calendar;
  the early sub-bands (Republicanism/Democracy/Manifest-Destiny) are content-band
  markers; the per-era content-band registry `{bills, eraEvents, draftees,
  biasTable, advanceWhen}` lands at K4. **Reconciles #68 + §26 + §27.1 into one
  era system.** `year % 4`/`year % 2` stay as phase cadence;
- **★★ adds the Reconstruction solo-blocker (DH-29) as a hard DoD requirement on
  E3b** (§9.1.6): the Strict/Ironclad readmission plan can NEVER pass with CPU →
  solo Reconstruction unwinnable; E3b's readmission half must ship a CPU
  default-vote bias (E9 handler #2) AND/OR an era-boundary auto-resolution (K3);
  ties E3b to the CPU handler suite;
- **★ adds ideology-as-circle as Phase-1 #5b (E5b)** (§9.1.7 / divergence #19):
  a central `ideologyDistance(a,b,circular)` helper + migration of the 10+
  open-coded sites, behind a `GameState.ideologyIsCircular?` flag — placed early
  so E9's conversion (9f) + SCOTUS (9n) handlers call it from day one;
- **folds the early-republic subsystems into E1 + Phase-1 #4/#4b** (E4 12A
  legislature-elector toggle #93; new E4b = slavery-flag+Cohens #94 [SMALLER —
  `State.isSlaveState` already exists] + Second Bank+Bank War #95 +
  statehood-by-bill organize→admit + territory-gate #95);
- **merges era-events-predating-start into BUG-1 (QW1)** — LIVE-confirmed by the
  LA-Purchase-dropped-at-1800-start episode — and **adds DH-30
  event-scheduler-min-floor as QW10**, BUG-1's companion;
- **places DH-31** (procedure-bill veto-misroute) at E2, **DH-32** (SCOTUS-voids-
  a-state guard + the `Cohens` ruling-bill-class modifier) at E25, **DH-35**
  (era-gate the action libraries) at E11/E13/E24;
- **adds DH-33** (impeachment-rewrite) to author-before-build (E29) and **resolves
  DH-34** as a roadmap DECISION (ship static era-biases — the forum's own stance);
- **notes `scenario1800` (E32)** as an optional later `BootSheet` instance (the
  band is already covered by `scenario1788` + `scenario1856`).

And the batch-8 confidence-hardening pass leaves all of the above **unchanged in
order** — it bumps K3/K4 to HIGHEST confidence (multi-save proven), strengthens
E16's justification, adds DH-41 to the parking lot, folds #100/#103/#104/#105 +
DH-38/39/40/42/43/44 into existing epics, adds QW11 (Vermont), and records the
no-future-era guard + the DH-36 META rationale.

And the **batch-9 pass (this one)** leaves ALL of the above **unchanged in order** —
it makes K3/K4 3-START-CONFIRMED + adds the two-level era refinement + the
structured-era-event-data requirement (all inside K3/K4), records the NEGATIVE-SCOPE
Cold-War guard (the Cold War = E3 + E12 + content), elevates K5 + E9 to load-bearing
(placement unchanged), strengthens E16 (create-AND-abolish) + E25 (legislated court
size), folds the modern election/institutional layer + `scenario1948` + DH-45..DH-58
into existing epics, records the Senate-threshold resolution, and adds DH-49 + DH-54
to the parking lot (→ 12).

And the batch-12 pass (this one) is **DESIGNER-RULINGS INTEGRATION + QW0 FULLY
CLOSES + ONE M-rework + 19 sized Ted-rulings slotted + ~100-item dataset umbrella +
build-target simplification on E5/E25 + Decision-gated split into user-gated +
designer-gated buckets**: it leaves all of the above order **unchanged** and
strengthens the order (QW0 is now the top-of-queue; E16 is RE-SCOPED M with #124
bundled; E5 + E25 simplified by Ted/vcczar's amendments-NOT-SCOTUS ruling; 9 new
designer-gated parking items added) **without** moving any keystone, splitting any
epic, or re-sequencing the spine.

**Still provisional.** Subsequent `/ingest-playtest` runs will refine scopes
(especially the CPU handler internals, the contingent-election rules, the
§25.9 split, the convention CPU specifics, the Civil-War sub-splits, the
~16-meter Lingering order, **the war resolution/peace + branch model (DH-47), the
diplomacy downward-pressure tuning (DH-45/46),** and the cross-era win-total number
the per-era banks sum to), may re-split currently L-sized rows, and may surface
items now parked or unknown. **The order above is buildable top-to-bottom today;
re-validate on every digest.** Open design calls that gate ordering
(contingent-election rules, §25.9 Iron-Fist split, DH-12 white-peace, DH-13
faithless-elector cap, DH-14 era-aware bill ideology, DH-15 small-state
multiplier, era-event scheduling hybrid, era-enum split, meter relabel,
procedural-generation distribution, DH-1 filibuster remedy, **DH-33 impeachment
rewrite**, **DH-41 the general SCOTUS-ruling → downstream-statute cascade policy
[batch 8 — author before building it into E25]**, draft 3/3-canonical, Civil-War
end-year, cross-era win total, the batch-7 era-model open Qs (are the early
sub-bands content-band markers or enum values [tech-lead's call: markers first];
the exact scope of the `territoryOwned` content-gate; which Reconstruction
readmission fix E3b ships [CPU bias #1 vs era-boundary auto-resolution #3 vs both
— tech-lead's rec: 1+3]), **and the batch-9 open Qs — the POPULATION-MODEL + House-
cap rule [DH-49, author before the census + Wyoming-Rule]; the impeachment / VP-
vacancy / succession ruleset [DH-54]; the war resolution + branch model [DH-47]; and
the human's Senate-threshold call [simple-majority-in-code vs require 60%/cloture];
**and the NEW batch-12 designer-gated open items — the 9 `tedchange` items Ted
floated but did NOT close: Mil-Prep meter level 4 fix, UEM #125, Crisis trait
consolidation, term-limit Gov in pre-Senate era, faithless-elector rewording, party
rename PL-vs-EraEvo, VP-must-be-same-party-on-resignation, cabinet enthusiasm
percentages (the #124 numeric), cabinet ideology weighting Big-4-vs-rest — all NOT
ready-to-build until Ted/vcczar closes them in `tedchange`/`smallbugs`; PLUS #122
pardon mechanics (NEW author-before-build)**)
are tracked in `game-context.md` → Open questions.

---

**Roadmap path:** `/home/user/AMPU/docs/game/roadmap.md`.
