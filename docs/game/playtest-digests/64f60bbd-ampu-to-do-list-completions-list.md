# Digest — "AMPU To-Do List: Completions List" (64f60bbd)

**Type:** DISCUSSION / CATALOG (the designers' *done-half* of their to-do backlog) — **NOT a playtest.**
**Source:** 178 posts / 3 chunks. **Dates:** Aug 23 – Sep 9, 2022 (the final pre-handoff sprint to get the spreadsheet game ready for "Anthony" to begin coding ~Sept 1).
**Authors:** @vcczar (designer, posts most completions) + @MrPotatoTed (co-designer, rules suggestions). Player helpers: Willthescout7, Arkansas Progressive, 10centjimmy, jvikings1, etc.
**Why it matters:** This is the single most authoritative **reconciliation** source in the batch — it records what the *reference (spreadsheet) game* considers DONE. Crucial caveat below.

**★ CRITICAL FRAMING:** "completed" here = the designers consider it done in **THEIR reference (forum/spreadsheet) game as of 2022**. Our gap-log "Built" = present in **OUR `src/` React/TS codebase**. These are different universes. Most items below are spreadsheet-rules completions that predate our code by years; many were **re-litigated later** (see `tedchange`, `smallbugs`). Tags used:
- **CONFIRMED-SHIPPED** = designer-done AND I verified it in our `src/` (cite `file:line`).
- **DESIGNER-DONE / UNVERIFIED** = designer says done; I did not find it / did not check our code.
- **NOT-IN-OUR-BUILD** = designer says done but it is clearly absent from our `src/` (stays a gap for us).

A 2022 spreadsheet "completion" is **NOT** grounds to close any gap. Treat every row as "designer-done in 2022; reconcile against current code + the later `tedchange`/`smallbugs` rulings before re-tagging."

---

## Completions by system

### Founding / Era of Independence (1772 scenario)
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| Only KY, TN, OH, VT proposable as states in Era of Independence; each Legis Prop now requires Rev War over (POST 8) | done 8/23/22 | #43, #2 | DESIGNER-DONE / UNVERIFIED |
| Const Convention placed in **Scripted-Event phase** (not the Legis phase); 3.0 contradiction deleted (POST 9) | done 8/23/22 | #159, #96 | DESIGNER-DONE / UNVERIFIED |
| Const Convention awards points to Gov of the state holding the **US Capital** (was PA Gov) (POST 10) | done 8/23/22 | #159, #133 | DESIGNER-DONE / UNVERIFIED |
| Scripted event **auto-ends Rev War** in last 4 half-terms of Era of Ind (no Yorktown); RevWar can no longer carry into Federalism (POST 11, 63) | done 8/23/22 | #45, #158, #92 | DESIGNER-DONE / UNVERIFIED (corroborates #158 CPU-RevWar-stall risk) |
| **Two** "Rev War ends" events: GB-weariness (needs independence declared; triggers Articles + Annapolis Convention) vs Colonies-weariness (no independence → **game over**, GB reasserts control) (POST 68) | done 8/28/22 | #45, #88, #158 | DESIGNER-DONE / UNVERIFIED |
| New-Const-Convention call gated to **lowest DomStab**; Gov Action, needs 2/3 of Govs, call persists while DomStab lowest, revoked when improved (POST 19, 42) | done 8/23–26/22 | #96, #159 | DESIGNER-DONE / UNVERIFIED |
| Convention delegate eligibility (not Pres of Congress / chairs / ambassadors; career-track must come off track); ahistorical planks get harsher penalties; abolition / all-races-vote / slaves-not-counted → DomStab to lowest (Civil-War risk, not guaranteed); women's suffrage 50% same (1st Convention only) (POST 19) | done 8/23/22 | #159, #58, #94 | DESIGNER-DONE / UNVERIFIED |
| **Foundational Legislation** rules re-added to 2.7 (vcczar had lost the originals) — pressure to build a functional govt vs point-farming (POST 58) | done 8/26/22 | #42 (Foundational bill typing) | DESIGNER-DONE / UNVERIFIED |
| 9 new **token Era-of-Ind Legis Props** created+filled (Model Treaty Cmte, diplomatic missions N/W/S, military excursion for artillery, postage rates, Rules of Prize sea/land, Councils of Safety coordination) — deliberately low-value filler (POST 17, 51, 72) | done 8/26–28/22 | #2, era-content | DESIGNER-DONE / UNVERIFIED |
| 1st/2nd Continental Congress: Foreign-Affairs/Military chairman appoints generals **except in events** (Pres of Congress keeps scripted events — to avoid a new code layer) (POST 48) | ruled 8/26/22 | #133, #49 | DESIGNER-DONE / UNVERIFIED (cf. later #133 rewrite in tedchange) |

### Constitution / Amendments / Census / Apportionment
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| Unicameral-Congress amendment keeps **both** options (proportional vs equal rep); no-House→no-midterms solved by 6-yr Senate terms + governorships (POST 7) | ruled 8/23/22 | #39, #62 | DESIGNER-DONE / UNVERIFIED |
| **US Rep Voting Power** simplified to per-delegation %; remainder → highest Legis Power (POST 69-70); committee votes do NOT use Voting Power (POST 85); stale pre-rule sentence fixed (POST 84) | done 8/28/22 | #34, #62 | NOT-IN-OUR-BUILD (no `votingPower` in `src/`; our reps are not vote-weighted this way) |
| **US Census** auto-active when US Constitution adopted; new EV/seat effects visible at start of census-year half-term (1792, 1802, …); old seats held by incumbents until that election (POST 93, 147) | done 8/29 / 9/5/22 | #34, #92 | DESIGNER-DONE / UNVERIFIED |
| EV tables filled for every census **up to 2090/2100** incl. 3 hypothetical states (POST 139, 155) | done 9/4–5/22 | #34, #55 | DESIGNER-DONE / UNVERIFIED (data, not code) |
| Census/era-bias **timing** ruling: new state bias begins at **census year**; mid-era (non-census) era changes need start-date biases folded into the census sheet; rising debate on half-step transition (POST 166-173) | ruled 9/9/22 (partly OPEN) | #34, #92, #109 | DESIGNER-DONE / UNVERIFIED — **open design tension** |
| **Gerrymandering** reworked for the new House-seats model: shifts house-deviation bias +1 to Gov's party (except +5 the other way); once per 10 yrs per state (POST 145) | done 9/4/22 | #20, #34 | NOT-IN-OUR-BUILD (no gerrymander action in `src/`) |
| US Constitution now **deactivates** "Tariffs Set by States" (POST 101) | done 8/31/22 | #147, #21 | DESIGNER-DONE / UNVERIFIED |

### Legislation system (bills, restrictions, lingering meters)
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| **Lingering-effect** meter math: reverted to the original "% chance to move, then weighted-by-raw-total direction" + small chance to move toward smaller raw # (POST 71-82) | reverted 8/28/22 | #67, #134, #50 | DESIGNER-DONE / UNVERIFIED — our build's lingering layer exists; the *exact 2022 formula* is superseded by `tedchange` #134 (7-step ordering). **Reconcile, don't close.** |
| **Spending-bill restrictions tied to ERAS** (not flat): ≤Nationalism 1/2/3/4; Gilded→Normalcy 2/4/5/6; Ideologies+ 3/6/8/10 (non-crisis caps; crises unrestricted) (POST 148-154) | done 9/4/22 | #42, #11 | DESIGNER-DONE / UNVERIFIED |
| Rev-Budget meter restrictions loosened generally (POST 148) | done 9/4/22 | #42, #27 | DESIGNER-DONE / UNVERIFIED |
| Bills that **trigger a next-session proposal**: president's party proposes (random member), does not count vs proposal total (POST 83) | done 8/28/22 | #8, #9 | DESIGNER-DONE / UNVERIFIED |
| Legis Props given **era deactivation dates** (Missouri Compromise, WWI Reparations can't fire in 2020); retaliatory embargo needs worse-than-friendly relations (POST 158) | done 9/5/22 | #109, #113 | DESIGNER-DONE / UNVERIFIED |
| Treaties confirmed **automatic** (no separate treaty rules needed); Gov of industry-leading state gains/**loses** points on treaty *results* (not flat gain) (POST 20-21, 24) | ruled 8/25/22 | #26, #35, #45 | DESIGNER-DONE / UNVERIFIED |
| Many **modern Legis Props added**: student-debt forgiveness Pres Actions (10k/50k/all) (POST 29); 3rd "Rebuild Infrastructure" = full Biden IIJA, marked passed 2021 (POST 30); 4 "Curb Inflation" bills modeled on 2022 IRA (POST 34); ~11 "Adam-Ruins-Everything"-style bills (ban tipping, sex-ed K-12, ban sugar cereals, luxury tax, food-expiration, ban slot machines, ban solitary, dissolve TSA, etc., created not filled) (POST 144) | done 8/25 / 9/4/22 | #113, #169, era-content | DESIGNER-DONE / UNVERIFIED (corroborates the post-2020 modern band #169) |

### Executive / President / Cabinet
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| **Acting Presidency** subsystem (3.0.33): VP can refuse Acting-Pres precedent via Pres Action; pliable/passive auto-accept; **Iron-Fist auto-refuse**; until precedent set, VP-as-Pres has no own cabinet / 1 Pres Action / no veto / no incumbency; 3rd-in-line is always Acting; CPU refuses 75% (100% if puritan/disharmonious/iron-fist); Acting Pres not auto party-leader (POST 97, 105, 141) | done 8/30–31 / 9/4/22 | #61, #112, #105 | NOT-IN-OUR-BUILD (no "acting"/Acting-Pres logic in `src/`; our succession is simpler) |
| **"Do Not Enforce …" Pres Actions** (10 of them: min-wage floor, slavery ban, desegregation, public-schools ban, evolution-teaching, LGBT protections, marijuana, hard drugs, gay-marriage protections, poll-tax) — lets states contradict federal law (not Amendments/Planks); contradictory Gov Actions = **double points, half effect** (POST 43, 74) | done 8/26–28/22 | #20, #21, #23 | NOT-IN-OUR-BUILD (no "do-not-enforce" Pres Actions in `src/`) |
| CPU **cabinet** rules: prioritize **regional balance** (POST 45); CPU **veto** rules added (POST 163) | done 8/26 / 9/6/22 | #73, #31, #75 | DESIGNER-DONE / UNVERIFIED |
| **Cabinet regional/diversity/equity penalty** era-scaling: pre-Gilded 50% DomStab −1 if not ≥1 officer per region (region ≥2 states); Gilded→Terror = −1 pres-election in snubbed region; Terror→future = must balance same-party **factions** or faction enthusiasm −1 + that FL +1 in primaries (POST 160-161) | done 9/6/22 | #31, #51, #151 | DESIGNER-DONE / UNVERIFIED (cf. #151 Era-of-Terror appointment-fairness — **reconcile**) |
| **Appointing chairs/members** rework: minority party appoints its own members once Minority Leader exists; Iron-Fist majority can reject 1 appointment per committee; vacancy ladder Leader>Whip>longest-serving (POST 159) | done 9/6/22 | #28, #8, #66 | DESIGNER-DONE / UNVERIFIED |
| Foreign-Affairs section **moved after** the Congressional Session (phase ordering) (POST 90) | done 8/29/22 | #110, #26 | DESIGNER-DONE / UNVERIFIED |

### Elections / Primaries / Conventions
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| Election die reverted **D+3 → D+6** (state biases were retuned to assume d6; d3 "breaks fluidity", no upsets) (POST 123-125, 142, 146, 153) | done 9/4/22 | #18, #51, #103 | CONFIRMED-SHIPPED (our `calcStateVote` resolves on a 0–6 biased scale, `phaseRunners.ts:727`; consistent with the d6 era) |
| **Endorsements in primaries**: 25% (major) / 10% (minor) chance of +1 momentum next primary stage (POST 46) | done 8/26/22 | #47, #183 | DESIGNER-DONE / UNVERIFIED — **note vs #183** (a later run found endorsement gives NO momentum; this 2022 rule says it should). **Reconcile #183.** |
| Two new **Primary Actions**: "Embrace Local Issue as Your Own" (+1 state, ideology-shift risk) and "Attack Rival" (d6 outcome table, debate/orator/propagandist/teflon modifiers) (POST 50) | done 8/26/22 | #47, #16 | DESIGNER-DONE / UNVERIFIED |
| **Pre-12th-Amendment** general-election rules updated/added (no true party ticket; the "50%→100% trait" rule doesn't apply pre-12th) (POST 59, 156) | done 8/27 / 9/5/22 | #93, #44, #19 | DESIGNER-DONE / UNVERIFIED |
| Per-candidate **action counts** for primaries/conventions/general clarified; turn order = lowest score → highest (random if tied) (POST 22) | ruled 8/25/22 | #13, #110 | DESIGNER-DONE / UNVERIFIED |
| **Generate-a-candidate** option: if a player lacks an eligible pol for a primary office, generate one (obscure/pliable/passive/lackey, −1 election penalty, bare-minimum stats, party-leader ideology+expertise, 40-60 yrs, random demographics, **cannot** generate a president); won't auto-resign (POST 88, 93, 103); formalized as rule 3.0.25 (POST 176) | done 8/29 / later | #115, #90, #43 | NOT-IN-OUR-BUILD (no player "generate candidate" flow in `src/`; only filler-pol seeding exists for staffing) |

### Traits
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| **Trait-conflict resolution = d6 roll** (3.0.34 "Trait Conflictions"): roll 1-2 = mutual cancellation, 3-6 = keep original; replaces the old "block vs cancel" ambiguity; full conflict-pair table given; Celebrity>Obscure, Master-Kingmaker>Kingmaker, Two-Faced>Flipflopper special cases (POST 98, 104-113) | done 8/30–31/22 | #138, #134, #69 | CONFIRMED-SHIPPED (our build resolves trait conflicts on a d6 — "the gain wins on a d6" / "holds on a d6", `phaseRunners.ts:345,374,1450,2684`; also Kingmaker→protégé inheritance uses it) |
| Faction-leader-roll "block" wording reconciled with "cancel" (POST 89, 94-100, 106-108) | done 8/30/22 | #29, #141 | DESIGNER-DONE / UNVERIFIED |
| New trait pairs: **Overeager ↔ Passive** cancel (POST 101); promotion to **Master Kingmaker** (protégé becomes Pres/VP nominee → 50% chance) (POST 86) | done 8/30/22 | #128, #78 | Overeager/Passive: DESIGNER-DONE/UNVERIFIED. **Master-Kingmaker PROMOTION trigger: NOT-IN-OUR-BUILD** (trait exists `types.ts:91` but no protégé-becomes-nominee→promote path found) |
| **Trait renames** (terminology poll, POST 174): Cop→**Lawful**, Low Brow→**Everyman** (kept Egghead); "Military expertise"→**Army expertise**; start dates→"starting cycles" (1788→1788-1790) | done 9/9/22 | #168 | NOT-IN-OUR-BUILD (neither old nor new names — Lawful/Everyman/Cop/Low Brow all absent from `types.ts` trait union; our roster is a different curated set) |
| **Trait definitions** doc started (one-line glossary per trait, 3.0.19) (POST 114-118) | started 8/31/22 | #168 (terminology) | DESIGNER-DONE / UNVERIFIED |
| Thomas Jefferson given **Teflon** (POST 117) | done 8/31/22 | dataset / #120 | NOT-IN-OUR-BUILD (no `Teflon` trait in `types.ts`) |

### War / Military
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| **Battle casualty rates** set: Difficult 5% kill General/Admiral + 7% random mil-track pol; Medium 1%/3%; Easy 1%/2% (POST 120) | done 8/31/22 | #45, #56, #155 | DESIGNER-DONE / UNVERIFIED |
| **Loans/credit diplomacy** clarified: relations ≥ neutral; extend credit = 10% relations + 10% EconStab; take loan = +1 Rev/Budget; not at Hostile+ (POST 162) | done 9/6/22 | #27, #107, #26 | DESIGNER-DONE / UNVERIFIED |

### Eras / Era content (Future split, climate, Reconstruction/Secession)
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| **"Era of the Future" SPLIT into two** (Near / Distant Future) — Legis Props, Gov Actions, Pres Actions, Scripted Events, SC cases, Gen Events, state biases all divided; Distant Future "quite chaotic" (POST 121-122, 126-136) | done 9/2–4/22 | #92, #161, #169, #109 | DESIGNER-DONE / UNVERIFIED (corroborates era-band model #92; future bands are NOT in our 2-scenario build) |
| **Rising-sea-level** events (Distant Future only, needs low Planet's Health): deplete **half** the EVs of affected coastal states → redistributed to interior states at next census; SW can become uninhabitable (POST 128-131) | done 9/3/22 | #34, #109, future-content | NOT-IN-OUR-BUILD |
| New **Gov Action column**: double success chance for certain Gov types (so Deep/Upper South quickly pass Jim-Crow-type laws) (POST 140) | done 9/4/22 | #20, #21 | DESIGNER-DONE / UNVERIFIED |
| **Secessionist Politicians** ruleset (3.0.35, replaces "Southern Unionist"): per-ideology/region % chances to stay with Union (90% Lib/Prog/LWPop, 99% black pols, etc.); office modifiers (Justices −25%, generals/Pres −10%); defectors earn **"Union Loyalist"** (+1 ticket pref during CW/Reconstruction, −1 in-state after); secessionists temporarily unavailable until pardon (POST 174 start, 177-178) | done 9/9/22 | #58, #121, #122, #157, #156 | NOT-IN-OUR-BUILD for the traits (no `Secessionist` / `Union Loyalist` / `Southern Unionist` in `types.ts`); our Secession-Winter loyalty decay exists as event logic only. **Directly maps to #121 (Secessionist trait absent) + #122 (pardons unspecified).** |
| **Start-date rosters** authored: 2024 (some slots blank), 2048 (young living pols, no fictional fill); mused Buttigieg as 2028 default Pres (POST 131-132) | done/planned 9/3/22 | #86, #164, #170 | DESIGNER-DONE / UNVERIFIED (our build has 1772 + 1856 only) |
| Fed Reserve Chairs added to start-date info (POST 87) | done 8/28/22 | #66, #95 | DESIGNER-DONE / UNVERIFIED |
| Era-event ⇒ Articles of Confederation + Annapolis Convention auto-trigger from RevWar-end event (POST 68) | done 8/28/22 | #89, #133 | DESIGNER-DONE / UNVERIFIED |

### Other rulings / rules-doc hygiene
| Completed item | Designer status / date | Likely gap # | Our-build tag |
|---|---|---|---|
| Retirements/resignation rules added (3.0.28) (POST 143) | done 9/4/22 | #36, #37, #130, #85 | DESIGNER-DONE / UNVERIFIED |
| Big/Medium/Small-state rules made consistent across Pres-Election + 3.0 docs (POST 6) | done 8/23/22 | #51, #103 | DESIGNER-DONE / UNVERIFIED |
| Judiciary Act typo fixed in SC Plank; SC rules in 3.0 accepted (POST 91-92) | done 8/29/22 | #52, #168 | DESIGNER-DONE / UNVERIFIED |
| CPU rules for Gov/US-Sen/US-Rep now weigh **state biases** (POST 6) | done 8/23/22 | #70, #72 | DESIGNER-DONE / UNVERIFIED |
| Whole rules-doc pass 2.1-3.0: accepted most of @MrPotatoTed's suggestions; **rejected** Kingmaker-teaches-Leadership/Teflon, rejected 100%-chance traits, **deleted youth penalties** (POST 54-63, 164-165) | done 8/27 / 9/8/22 | #168, #138, #128 | DESIGNER-DONE / UNVERIFIED (youth-penalty deletion is a notable design decision) |
| ~5 politicians/day backfilled (historical US Reps, era figures); list **finished** (POST 78); notable adds: Frederick Madison Roberts, Alexander Vindman (Integrity), Katharine St. George, "Honest" John Kelly, Harriet Hageman (POST 40-41, 47, 53, 62, 64-67) | ongoing → done 8/28/22 | #120 | DESIGNER-DONE / UNVERIFIED (dataset-pipeline territory; our dataset is generated, not this sheet) |
| Thread **renamed** to "Completions List" (POST 102) | 8/31/22 | — | n/a |

---

## Reconciliation candidates (for the consolidation agent + tech-lead — annotate, do NOT close without code verification)

1. **#138 / #134 / #69 (trait-conflict resolution)** — designer's 2022 d6 rule (1-2 cancel / 3-6 keep) **matches our shipped d6 logic** (`phaseRunners.ts`). Strong corroboration; consider annotating these gaps as code-aligned-on-the-mechanic (but later `tedchange` #134 7-step ordering is the current spec).
2. **#18 / #103 (election die roll)** — 2022 D+3→D+6 reversion is consistent with our 0–6 biased-mean `calcStateVote`. Annotate as corroborated.
3. **#121 (Secessionist trait absent) + #122 (pardons unspecified)** — this thread is the **authoritative source spec** for both (3.0.35, POST 178). Attach POST 178 as the design reference; both remain open in our build.
4. **#61 / #112 / #105 (succession / Acting-President)** — 2022 Acting-Presidency subsystem (3.0.33) is fully specified here but **absent from our `src/`**. Annotate #61/#112 with this spec; still a gap.
5. **#183 (endorsement = no momentum)** — **conflict to flag:** this 2022 thread (POST 46) says endorsements *should* give 25%/10% momentum, but a later run found none in practice. Tech-lead should decide whether our build dropped it or never had it.
6. **#34 / #62 (apportionment / Voting Power)** — per-delegation Voting-Power rule (POST 69-70, 85) is **not in our build**; our reps aren't vote-weighted. Annotate #34/#62 with this spec.
7. **#34 / #92 (census↔era-bias timing)** — POST 166-173 is an **unresolved design tension** (when biases switch on a non-census era boundary). Carry as an open question, not a completion.
8. **#168 (terminology standardization)** — the trait renames (Cop→Lawful, Low Brow→Everyman, Mil→Army expertise) and start-dates→"starting cycles" landed in 2022 but our trait roster uses **neither** old nor new names. Tech-lead: our trait set is a separate curated subset — reconcile naming intent only.
9. **#128 / #78 (Master Kingmaker)** — trait exists in our build, but the **promotion trigger** (protégé→Pres/VP-nominee → 50% gain, POST 86) is **not implemented**. Annotate.
10. **#20 / #21 / #23 ("Do Not Enforce" Pres Actions + state-contradicts-federal)** — 10 Pres Actions + the double-points/half-effect contradiction rule are **absent from our build**. Attach POST 43/74 as the spec.
11. **#42 / #11 (spending-bill restrictions)** — era-scaled caps (POST 152) are a concrete numeric spec the tech-lead can use; verify against any restriction logic in code.
12. **#31 / #151 (cabinet regional/faction-balance penalty)** — era-scaled penalty spec (POST 160-161) overlaps the later Era-of-Terror #151 ruling; reconcile the two into one rule.
13. **#161 / #92 / #169 (Era-of-Future split + post-2020 content)** — 2022 split into Near/Distant Future + the IRA/IIJA/student-debt modern content corroborates #169; none of these era bands exist in our 2-scenario (1772/1856) build.
