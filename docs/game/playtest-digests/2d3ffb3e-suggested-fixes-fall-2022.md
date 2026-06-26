# Digest — `2d3ffb3e` "Suggested fixes — Fall 2022"

> **Final committed thread-digest. DISCUSSION / suggestions thread, NOT a
> playtest** (no historian/GM ran a single game; this is a cross-playtest
> fixes-and-suggestions catalog). 15 chunks / 948 posts / 732k chars
> (single-pass chunk-by-chunk reduce — bucketed aggressively). Citations are
> `===== POST n =====` markers. Raw chunks are gitignored/disposable; **this
> digest is the durable record.** This is the **THIRD discussion-thread ingest
> (batch 19)** and the **EARLIEST** of the three: it runs **Oct 4 2022 → Sept 21
> 2023** (POST 1 → 948), i.e. it **predates** the `smallbugs` (cf82a7d3, Apr
> 2023→) catalog — which it **literally spawns** (POST 637-640: vcczar tells
> Murrman to "make a thread for [stat-mixed pols + swapped legislation]… low
> priority, won't be changed until early release") — and predates the
> Sept-2024 `tedchange` (a0f0bf04) rules-rewrite thread. OP (POST 1, vcczar):
> *"Just post any suggested fixes below. I won't look at them until Anthony says
> he's working on the game again."*
>
> **★ Headline:** The **pre-early-release fix/addition window** — the period
> when **vcczar (the designer) was building out content + clearing a to-do list
> for the programmer (Anthony)**, interleaved with cross-playtest balance
> suggestions from ~20 forum players. Three high-signal strata: (1) **vcczar's
> own SCRIPTED-EVENT BUILD-OUT** (~30+ new scripted events — the
> Shaw/John-Brown demographic-removal pattern, the state-policy scripted-event
> conversions: abolition / women's-suffrage / segregation / prohibition /
> gov-term-limits — completed POST 654); (2) **vcczar + Ted authoritative
> RULINGS** (~30+ rule decisions baked into the 3.0 doc, incl. the
> **Reconstruction "Secessionist Politicians" appointment rule**, the
> **game-over-vote CPU 75%-nay rule**, the **no-successor constitutional-crisis
> procedure**, the **no-reroll-on-held-expertise** rule, the **Fed-Chair/FBI
> never-held-office+3-admin** gate, the **50-50-Senate→VP's-party** rule, and
> the **Integrity/Controversial 100%→10-20% confirmation-inflation fix**); (3) a
> **dataset + bill/event sign-bug catalog** that feeds the **#120 umbrella**
> (and includes the **earliest corroboration of the #121 Secessionist-trait
> gap**, POST 641-644).
>
> **★ Disposition:** Bucket-heavy, corroboration-rich, few-NEW-gaps — exactly as
> expected for a fixes catalog. Almost every dataset/bill/event item folds into
> **#120** (the generated-dataset-accuracy umbrella; fixes go via
> `scripts/seedDataset.mjs` `CURATED_ROWS`, NOT by hand-editing the JSON/CSV —
> CLAUDE.md). The **highest-value section is §3 (vcczar/Ted rulings)** — many of
> which RESOLVE or earlier-corroborate items the KB logged from later threads
> (`tedchange` #124/#126/#135/#153; `terror2000` #135/#153; `oopscpu`/`ideo1928`
> CPU + era-bias clusters). **One genuinely-new mechanical gap is logged: #167
> (no-successor presidential constitutional-crisis subsystem).** Everything else
> strengthens existing rows.

---

## §0. Thread metadata

- **Title:** "Suggested fixes — Fall 2022" (forum topic 1551, politicslounge),
  **Oct 4 2022 → Sept 21 2023** (last captured POST 948). Started by **@vcczar**
  (the designer; "V") with the charter *"Just post any suggested fixes below"*
  (POST 1).
- **Two voices to distinguish (per the batch brief):**
  - **DESIGNER-DESCRIBED additions/rulings = AUTHORITATIVE (tier-1).** The OP
    interleaves vcczar describing his *own* work ("I created two new Scripted
    Events…", "Abolitionist John Brown has been added…", "I've now increased the
    requirements for being Fed Chair…", "I've change[d] the rule…") with
    community suggestions. **@vcczar (designer)** and **@MrPotatoTed ("Ted";
    rules steward)** issue authoritative rulings that fold into the 3.0 rules doc.
  - **COMMUNITY suggestions = tier-4** — balance ideas/gripes from playtesters
    (@pman, @jnewt, @ShortKing, @Cal, @Murrman104, @10centjimmy, @Ich_bin_Tyler,
    @Willthescout7, @ebrk85, @OrangeP47, @Arkansas Progressive, @Umbrella,
    @ConservativeElector2, @DJBillyShakes, @Bushwa777/Imperator Taco Cat, @Rezi,
    @Hestia, @Pringles, @0ccultist, @Cal, @Joe303300). Many were deferred to
    "after early release."
- **Critical context (provenance + the #18/#124 fork):** This thread is the
  channel through which **vcczar prepped content for Anthony's first coding
  push** (Spring 2023). Anthony coded **in rules-doc order and got STUCK on
  ideology enthusiasm** (~halfway into 2.1) — *"V sent him like four emails
  explaining it… the emails didn't bring me [Ted] any closer to being confident"*
  (POST 715-716); vcczar himself *"implement[s] it a new way accidentally"* each
  playthrough (POST 713). **Ideology enthusiasm (#18/#51/#124) is THE
  perennially-unspecified system — even the designer can't pin its mechanics.**
  By thread's end Anthony had coded only ~2.1 (POST 696-700).
- **Style:** A rolling catalog + several long design debates. vcczar/Ted
  repeatedly "close" changes then reopen them; OrangeP47/Will argue the churn is
  degrading the rules-doc and slowing Anthony (POST 702-717). Late chunks (13-15)
  are **Ted's section-by-section 2.2→2.4 rules-doc cleanup pass** — the direct
  precursor to the Sept-2024 `tedchange` thread.

---

## §1. How to use this digest

Open this first to plan the dataset-maintenance pass (§4 → #120) and to find
the authoritative rulings (§3 — the heart). The digest does NOT enumerate every
item; it buckets and points back to POST# anchors. New/strengthened gap-log rows
are in §6.

---

## §2. Scripted-event additions (vcczar, designer-authoritative) — corroborates the era-event/scripted-event system

The build HAS a robust scripted-event engine: `EraEvent` (`types.ts:1466`) with
`templateId`, data-driven `responses[]`/`EraEventResponseEffect`, a serializable
`Predicate` precondition tree (`types.ts:1487`), `triggersGameEnd`, `unlocks`,
and `postEffects` incl. **`addPolitician`** (an event can introduce a pol). This
thread is **vcczar building out that event catalog** — every item below maps
onto the shipped model and corroborates it.

| Scripted event(s) added | Pattern / mechanic exercised | Post |
|---|---|---|
| **Robert Gould Shaw** — "Sacrifice of the 54th Massachusetts" (historical: Shaw killed + **removed from game**) / "54th Massachusetts Takes Pivotal Fort" (ahistorical: Shaw lives + gains **Celebrity**) / neither fires → Shaw just enters w/o celebrity | **Historical/ahistorical fork + event REMOVES a pol from the game** (a pol who died before his draftable era can only enter via this) | 2 |
| **John Brown** events (killed OR pardoned → **removed from game**; if neither fires + he survives, stays for full life) | Same demographic-removal pattern; pairs with the **pardon** branch (note: pardon mechanics still otherwise unspecified — #122) | 3 |
| **New England / PA / NY / OH / NJ "state legislature abolishes slavery"** (fires if slavery not yet abolished + Gov is not RW Activist; awards Civil Rights pts but **election bonus to RW Activists**) — one event per historically-free state | State-policy gov-action → scripted event; ideology-gated firing (Gov trait) | 92-97 |
| **Popular-vote scripted events**: State Legislature flips **KY + NC early**, then a wave flips **all states except DE + SC** in the Era of Democracy | **★ Same "all states except DE+SC" event corroborated in `dem1820`/#44** | 99 |
| **"___ States Pass 4-year Governor Terms"** + **"___ States Pass Term Limits of Two Terms"** (many) | Gov-config gov-actions → scripted events | 100-101 |
| **States Ban Alcohol** (many) | Prohibition wave | 106 |
| **States enact/repeal Segregation Laws**; renamed Poll-Tax/Jim-Crow gov actions + added **General Jim Crow law** scripted events | Jim-Crow apparatus as events | 108, 110 |
| **States Grant Women the Right to Vote** | Suffrage wave | 109 |
| **Women + Black politicians enter the draft** (planned, demographic-gated, after the 19th Amendment) | **Demographic-gated draft-ENTRY via scripted event** (new capability flag) | 289 |
| **Trade-issue general events with select nations** (relations too easy to keep up; JQ-Adams/British example) | New relations-stressor events — corroborates DH-59 (relations under-floor) + the "relations too easy" theme | 424 |

**Designer rulings ON the scripted-event SYSTEM (authoritative):**
- **Event-firing rate / per-era cap (POST 114-123):** vcczar removed the old
  "2-min / 8-max events per half-term" cap (via an "Era Exit" column, then
  removed that too) — intends a cap "more than 8"; OrangeP47 flags a 1840
  **event log-jam** (only ~25% of events fired by era-end; wants a dynamic limit
  so ~70% fire per era). The era-event firing-rate model is **unsettled**.
- **★ Scripted-event boot-filtering for late starts (POST 413-423,
  vcczar-authoritative):** events are **prerequisite-based, NOT firm-era-based**
  by design (so alt-history can replay Civil-War events in a WWI-era no-slavery
  timeline) — **BUT a game that BEGINS in a later era starts with all
  pre-start-era events removed, incl. ahistorical outcomes**, assuming history
  was accurate until the start. Ted's proposed implementation aids: a yes/no
  "can occur in any era?" column (POST 419) or move evergreen game-over/war
  events to GENERAL events (POST 418). **This is the authoritative late-start
  event-filter rule** (corroborates the #92 era-gating family + the smallbugs
  "expired/anachronistic event" bugs).
- **Event prereq/timing fixes (vcczar):** "Rev War Ends Due to War Weariness"
  had a 100%-fire at 1780 (war ended 1783) → re-prereq'd to "Rev War active +
  Independence declared + Era of Federalism next half-term" (POST 675-677); Rev
  War peace treaty referenced President + Amb-to-UK that don't exist pre-victory
  → changed to CC Foreign-Affairs-Chair + Amb-to-Fr + a new CC Special-Envoy
  office created by a bill (POST 678-679). **Corroborates DH-60 (events fire
  referencing nonexistent offices/assets) + #101 (office-by-bill).**
- **★ Carlisle Peace Treaty game-over event (POST 622, 663):** the "rejoin
  England" response = automatic game-end; CPU rules made all CPUs + a CPU
  CC-President vote for it (only Nationalist faction got points to fight on), so
  CPU-heavy/single-player games very likely trigger it against the human's
  survival wish. **vcczar's FIX (POST 663):** a canonical 3.0 CPU rule — *"If a
  decision will result in the game automatically ending… the CPU will vote nay
  75% of the time regardless of any other considerations."* **★ Strongly
  corroborates OC-3/#88 (CPU crisis-vote-against-survival) from oopscpu/terror2000.**

---

## §3. Designer rulings — @vcczar [authoritative] & @MrPotatoTed [rules steward] (the high-signal section)

Distilled to the calls the build should bake in. Several RESOLVE forks the KB
logged from later threads (noted ★).

### §3a. Reconstruction / secession (corroborates #56–#60, #121, DH-64)
| Ruling | Detail | Post |
|---|---|---|
| **★ "Secessionist Politicians" / Reconstruction appointment rule (CANONICAL, vcczar)** | After Union Civil-War victory, the next legislative session **appoints the legislature in seceded states**: Reconstructed-state **governors appointed by the President** (must be Congressional-majority party); **US Senators** selected by the faction controlling the **Senate Pres Pro Tempore**; **US Reps** by the faction controlling the **Speaker**; **appointees CANNOT have seceded with their state**. vcczar chose this over OrangeP47's "mandatory-vote" mechanic ("needlessly adding a new mechanism"), confident the appointment-control makes the 13/14/15A pass | 364-365 (cf 248-250, 287, 354-363) |
| Amendments through Congress = **2/3** | OrangeP47 notes playtests erroneously used 50%+1 (POST 360); the 2/3 bar stands. Corroborates #39/#119 amendment lifecycle | 357-360 |
| The community Civil-War rec doc (tier-4) | (1) N-reconstruction-states bias Blue +2 / S Red +2 while active; (2) reconstruction-state congressmen MUST vote yes on "Reconstruction"-subtype legis + S states must support Civil-Rights-card props/amendments; (3) pols who fought the losing side can't PROPOSE reconstruction legis (faction can, via a loyal pol) — vcczar took to-do, partially superseded by his appointment rule above | 248-250, 287 |

### §3b. Appointments / cabinet / confirmation
| Ruling | Detail | Post |
|---|---|---|
| **"Compel cabinet member to resign" exec action (vcczar)** | **Removed expiration era**; changed Pres requirement to "does not have Passive" (any non-Passive pres can fire if the cabinet member has the required traits) — fixes lifetime-cabinet lock | 84-85 |
| **★ Fed Chair / Pres-of-Bank-of-US / FBI Director gate (vcczar)** | **Never held elected office + admin ≥3** (unless none eligible); CIA/Nat'l-Intel exempt (Dan Coats precedent); FBI later gets a %-auto-decline if held office. Fixes Tom-Udall-as-Fed-Chair realism. Pairs with #101 office-eligibility | 162-164, 184 |
| 1-admin nominees = **0% confirmation is INTENDED** (vcczar) | "I actually do want it to be 0%"; raised CPU nomination floor to **2 admin** so CPUs stop wasting picks on un-confirmable 1-admin pols | 166-170 |
| Cabinet shortlist same-person-on-multiple-lists | vcczar: "not what I intended but let's see" (no firm rule) | 145-148 |
| **★ Cabinet-confirmation block-vs-vote (RESOLVED, typo)** | The restriction "can't block a non-controversial nominee unless ≥2 ideologies from your **faction leader** / harmonious leader can't block any non-controversial" should reference **Majority Leader, NOT faction leader**, AND **"blocking" ≠ "voting"** — a player can always control their own confirmation VOTES even if they can't formally "block." Rule is fine once the typo + the block/vote distinction are clarified. Only the **Top-4** (State/Defense/Treasury/AG) need votes; the rest auto-confirm unless Controversial / low-admin | 605-621 (cf 206, 592-604) |
| Cabinet obstruction CPU rules (vcczar) | Moderates always support Mod/Lib/Cons (unless controversial); Libs support Prog/Mod; Harmonious supports anyone (unless controversial); high admin = less opposition. **Humans can still freely obstruct.** jnewt's penalty (party-pref drop for mass cross-party blocking 2+ ideologies apart) added to to-do | 206, 210-214 |
| **★ Integrity/Controversial confirmation-INFLATION fix (Ted)** | Controversial = de-facto cabinet ban: Integrity-Senators auto-vote-Nay on Controversial nominees, and a 79/104 iron-fist majority still can't confirm a 3-admin Sec-of-State. Root cause: **Integrity is gained 100% by every Senator who votes a nominee down** → 42% of the 1948 Senate had Integrity/Controversial. **FIX:** change Integrity/Controversial gain from **100%-for-all to 10-20% per individual Senator.** ★ AGREED but NOT YET implemented at thread's end (POST 906) | 883-895, 904-907 |
| **★ CPU cabinet-nominee 3-step rework (Ted)** | CPUs over-fail opposite-party nominees (pick 2-admin lobby-fitting pols + ignore Controversial). New: (1) crisis-relevant → most-qualified; (2) own-party Senate majority → max enthusiasm; (3) opposition majority → best non-Controversial, highest-admin, ≥1 related expertise. Corroborates oopscpu #145 CPU-nominee holes | 894-895 |
| Misc cabinet (Ted 2.3 cleanup) | **Incompetent pols can't be nominated** to cabinet/cabinet-level/ambassador/military; broken appointment-promise = **Pres's faction −1 enthusiasm per broken promise** (was 2); no party/ideology requirement on military-leadership positions; office-conditional bonuses (Number Cruncher/Geostrategist) **disappear when you leave the office** | 838, 840, 863 |
| Confirmed/retained appointees gain a random field-relevant **expertise** | Fixes the 10-yr-Sec-of-State-with-no-foreign-affairs problem (Geostrategist removed from Ambassadors, added to Sec of Defense/War) | 851, 863 |

### §3c. Career / leadership / candidacy
| Ruling | Detail | Post |
|---|---|---|
| **Leadership trait is deliberately VERY RARE (vcczar, stat principle)** | Only epoch-defining party-builders (Jefferson, Jackson) are "born" with it; Boehner-tier Speakers gain it in-game (faction leaders: 50%/2yrs). vcczar won't author a historical-Leadership-by-year column. **★ Key dataset-stat-assignment principle** — explains why many real leaders lack Leadership (intentional, not a bug) → informs #120 + the draft-class playbook | 397-402, 456 |
| **★ Gov→President difficulty fix (vcczar)** | Governors structurally can't lose Obscure / gain Leadership, so Senators dominate the presidency. Fix: gov **~10% chance to gain Command on a successful gov action** (POST 504); a gov **elected/reelected = 10% lose Obscure + 10% gain Leadership** (POST 522), consensus to **scale by state size** (Big 20% / Med 10% / Small 5%) | 504-505, 522-524 |
| Running for President = give up congressional-leadership office (100%) | The built-in deterrent; same as Govs can't run for Gov + President simultaneously | 461-462, 484 |
| The **Obscure** rule = vcczar's own design (modeled on Sarah Palin) | The VP-from-obscurity gamble is intentional | 510-511 |
| **★ Major-candidate gate reaffirmed (vcczar)** | A major presidential candidate must be an **eligible faction leader OR a Celebrity, with ≥1 command**; if none qualify → any eligible pol with ≥1 command; if none have command → any eligible faction leader. (Resolves jnewt's "Warren PV 172 stuck as minor candidate" debate — minor→major via the "Percy Method": top-2 in delegates after the 3rd primary group) | 807-812 (cf 437-453) |
| Pre-12A general election with **no party leader** → random faction leader (random faction) names the candidate | Resolves the pre-12A no-party-leader boot gap; corroborates pre-12A election mode #44/DH-62 | 807-808 |

### §3d. Kingmaker / protégé
| Ruling | Detail | Post |
|---|---|---|
| **Kingmaker-protégé bond cannot be voluntarily broken** ("no takesies-backsies") | Anti-cheese (stops re-roll-via-reassign abuse); already in rules | 262-265, 564-565, 821-824 |
| **Kingmakers cannot move states** (vcczar) | "A kingmaker is a kingmaker because of state influence"; protégés can't break the bond to move | 818-826 |
| **A protégé can have only ONE Kingmaker** | A Kingmaker (one state) + a Master Kingmaker (another) can't both take the same protégé. (Master-vs-regular Kingmaker distinction = `tedchange` #316) | 910 |
| 1 active Kingmaker per state | Limits chaining | 562 |

### §3e. Succession / crisis / offices (★ feeds NEW gap #167)
| Ruling | Detail | Post |
|---|---|---|
| **★ No-successor presidential constitutional-crisis procedure (vcczar + Ted, NEW SUBSYSTEM)** | If a President dies/resigns with **no eligible successor** (empty VP + no third-in-line bill): an **emergency Congress** forms; only **succession laws** are selectable; a random faction leader proposes one; voting continues until one passes; CPUs auto-support; the bill is **auto-signed, un-vetoable**. For **who becomes acting President**: the dead Pres's party picks a new party leader → **US House votes 1-vote-per-state between the two party leaders** (ineligible → highest-PV eligible faction leader; cascade if a party can't field one; CPU votes party-line except Integrity→incumbent-party, Can-Be-Independent→closest-ideology; tied states abstain; state-tie → SCOTUS/game-over). **DomStab penalty scaled by outcome**: incumbent-party-PL = 0; incumbent faction leader = −1; challenging PL = −2; challenging faction leader = −3. A **coup chance** if a player has Controversial + LW/RW-Pop or Military Leader (→ 3.0.2 coup rules). Interim PPT-as-acting-President accepted as the simpler default (POST 849-850). **→ logged as NEW gap #167** | 841-882 |
| Office fill-order when all vacate at once | President → VP → governors → … (POST 850) | 850 |
| PPT/Speaker becoming acting President **resigns from Congress** (branch-separation) | Senate then elects a new PPT | 859 |
| Current Generals/Admirals won't accept a **CC appointment** | Fixes the Washington-self-appoints-general-empties-foreign-chair problem (POST 256-257) | 672 |
| 50-50 Senate majority → **party with the Vice President** (no VP → random) | vcczar "by popular demand" (POST 803), superseding Ted's "random" placeholder (POST 796). **★ Corroborates #135 (50-50 Senate = VP's party) from terror2000** | 803 (cf 796-805) |

### §3f. Traits / expertise / rolls
| Ruling | Detail | Post |
|---|---|---|
| **★ No-reroll-on-held-expertise (CANONICAL, vcczar)** | vcczar **adopts Ted's house rule**: when you roll a new expertise you already have, **you do NOT re-roll — you get nothing** (was: re-roll until a new one). **★ This is the canonical source for `terror2000` #153 / the `tedchange` no-reroll rule — confirmed adopted here March 2023, the earliest instance** | 581-583, 645-650 |
| **★ Below-minimum-skill ≠ resign (vcczar)** | A pol who drops below the minimum skill to hold office does **NOT** resign — "they don't have to resign, they'll just suck"; they only can't be re-appointed/re-elected. The minimum is a requirement **to RUN/be appointed, not to remain** ("the Wilson event" precedent). Resolves a long debate | 624-636, 649 |
| **Presidential Ailment = random −1 to −3 Command** (was flat −3) | Eases the always-forced-to-resign problem (~50% fire / 28 yrs ≈ historically accurate) | 626-633, 649 |
| Iron-Fisted + Harmonious are **NOT conflicting** | Harmonious = bipartisan, Iron-Fisted = party-control; the conflict for Harmonious is **Disharmonious**. Canonical exemplar: Thomas Brackett Reed. Corroborates DH-27 (trait-conflict) | 566-568 |
| Trait-cancel when a rolled trait conflicts with TWO at once | Open: needs a roll-order (Murrman used alphabetical). Corroborates DH-27 | 6-7 |
| Convention frontrunner penalty fix (vcczar) | Was flat −1 momentum after ballot 1 (→ only-1-frontrunner-ever-won in 30 yrs); now **33% chance −1 on each ballot the frontrunner isn't leading** | 651 (cf 360, 636) |

### §3g. CPU candidate selection — fork RESOLVED (soft)
- **POST 740-759, 787-793:** Gov AND Senator CPU candidate-selection each had
  **TWO conflicting rule sets** in the doc — (a) "non-leadership pol matching
  state ideology bias, random if tied" vs (b) the **25%/25%/25%/25%** set
  (highest gov/leg ability / highest PV / has charisma-leadership-likable-
  manipulative-integrity / protégé-with-kingmaker). Also a 2nd fork:
  **pre-primary general-nominee selection** (most-kingmaker-pols-in-state vs a
  "sum kingmakers+protégés +2-incumbent +biases +bonuses +d6" formula).
- **Resolution (POST 787-793):** vcczar (per a recovered 1840 exchange)
  confirmed the **SECOND (25%-each + kingmaker) set is canonical**, the kingmaker
  rule being part of it — though he contradicts himself and has "no memory of how
  it happened"; won't fix until Anthony nears it. Will/ebrk highlighted the
  contradictions in-doc. **Corroborates the CPU-decision cluster #72-#76 + the
  oopscpu CPU-candidate holes.**

### §3h. Misc authoritative rulings
| Ruling | Detail | Post |
|---|---|---|
| Lee's Resolution (declare independence) = **prop, not foundational** | "Foundational" = bills urgent at Era-of-Federalism start (Judicial Act etc.); vcczar marks Lee's treatable-as-foundational + adds point-giving cards because **CPU won't propose it otherwise** (CPU follows its own proposal odds). Corroborates the CPU-proposal-bias problem | 338-352, 899-900 |
| **Make SCOTUS an elected position** (legisprop) | vcczar: election in the **election phase**, **national but simple** (like Sen/Gov, not presidential); flesh out later | 555-558 |
| 50-50 Senate, no VP → PPT must be **Can-Be-Independent** | ShortKing's David-Davis-1881 precedent (accepted as edge case) | 805 |
| Faction/Party leader vacancy on death | Replaced **immediately** if they die/randomly-retire; vacant-until-next-leader-phase only after losing an election (note: 2.4 says faction leaders can't randomly retire) | 569-572 |
| Naval vs Army | **No separate naval skill** (relies on Army/Naval Expertise + "once a General/Admiral, can't become the other"); battle order = naval first (50% chance of another), then ground. Rejects the naval-skill suggestion | 259-260, 902 |
| No panic/depression-relief legis pre-Great-Depression is **intentional** | Major intervention wasn't normalized until the New Deal (TR/JP-Morgan-1907); Reconstruction-lift revenue relief already modeled (Reconstruction deliberately expensive) | 944-945 |
| Era-of-Independence military disband is **intentional** | After Rev War all but ~1 general disband (small NW-Indian-War force); Militia Act unavailable until Era of Federalism — creates urgency for federal govt + early military laws | 832-834 |
| Voting-restriction amendment misread (vcczar) | "National Suffrage for White Male Property Owners Amendment" is NOT a rights-restriction; added prereqs: can't be proposed if any state allows >white-male-property suffrage / from Era of Normalcy / once blacks or women can vote. Rollback only for hypothetical parties (Nazi/Theocratic) | 43-45, 358 |

### §3i. Ted's section-by-section rules-doc cleanup (2.2–2.4) — the `tedchange` precursor
Chunks 13-15 are Ted cleaning up wording + adding clarifying rules **before
Anthony reaches each section** (the same systematic pass he later formalizes in
the Sept-2024 `tedchange` thread). Key NEW/clarified rules (all
designer-endorsed): can't hold two congressional-leadership posts at once (POST
796); PPT earns points regardless of Maj-Leader existence + can chair a
committee unless acting Maj-Leader (796); **ranking members get the same trait
bonuses/points as Chairs** (796, 804); mid-phase majority change (from deaths) →
no gains/points until the next legislative phase (837); Key Advisor auto-created
with the Presidency (838); iron-fisted Maj-Leader still follows all appointment
rules for a pliable/passive Pres (838); CPU picks its own CC-president delegate
100% of the time (796); SCOTUS Justices refuse military appointments unless a
Major War + refuse all non-excepted nominations (840).

---

## §4. Dataset additions & fixes — bucketed → the #120 umbrella

The bundled draft classes are **GENERATED** (`scripts/seedDataset.mjs` →
`public/standard-draft-classes.json`; do NOT hand-edit the JSON/CSV — CLAUDE.md).
**All items below fold into gap #120**; this is input for one
dataset-maintenance pass. **vcczar additionally ran his OWN audit of ~1800
legisprops for misplaced mechanics** ("audited 300 props… ~1 issue per 100,
mostly prereqs in wrong order," POST 367-369) — designer-acknowledged #120 +
DH-53 work.

**Count: ~20 named dataset/scenario-config items + ~10 bill/event/SCOTUS sign
bugs catalogued (bucketed; exemplars below).**

### §4a. Named-pol stat/flag/dup fixes (exemplars)
| Item | Fix | Post |
|---|---|---|
| **John Brown** (added) | Charisma + **1 admin, NO military** (deliberate: "an armed charismatic," not a general) — a stat-assignment principle | 3 |
| Asa Hutchinson | +1 command (considering a 2024 run) | 124 |
| **Bob Scott** | NC Gov but only 1 Leg → should be 1 Gov (**same fix as smallbugs §2b — cross-thread corroboration**) | 554, 637 |
| John Bartram | Age 98 in 1788; born 1699 → 89 | 396-398 |
| John Chafee | Listed Admiral at 28; was Marine Corps (army/navy mislabel) — vcczar: don't fiddle (pol-shortage risk) | 202, 216-217 |
| Two Jared Ingersolls (1822 Cons / 1824 Mod); Henry A. Coffeen (OH alt-state missing); James Withycombe (foreign-born, born England); James Withycombe/Henry-Coffeen alt-state | Disambiguation + alt-state + foreign-born fixes (corroborate smallbugs §2b-§2d patterns) | 290-294, 835, 923 |
| Nuclear-age Dixiecrats lack a filibuster-capable pol | Give Russell/Eastland/Stennis **Puritan** (filibuster gate) | 188 |
| 1928 scenario: Vail→Key Pittman, AZ 2-yr-gov-until-1968 | **Scenario-setup errors, NOT master-data** (vcczar POST 528: master is correct; GM set-up error) — frames #115 (boot-config vs master-data distinction) | 527-529 |
| Per-era party-pol-count imbalance (1948 Dems ~20 more/faction than Reps) | "Time to add more failed statewide candidates" (sub-floor failed-candidate dataset rule) | 233-234, 245 |
| Thin state benches (DE; AL Republicans after Kay Ivey dies 2020) | Add gov/legis candidates | 50, 168 |
| Add economists (Fed Chair realism); add real alt-state pols (PR etc., mostly random-generated); add Judge Judy/Frank Caprio (memes) | Dataset additions vcczar wants but lacks time for | 158, 696-699, 656-658 |
| Alt-state policy (vcczar) | Add an alt-state **only if the pol actually runs for a position there** (many pols change residence) — methodology ruling | 150-151 |

### §4b. Bill / event / SCOTUS effect sign bugs (→ #120 + DH-53)
| Item | Bug | Post |
|---|---|---|
| `Ban Bailout for "Too Big to Fail" Institutions` | +/- ideologies SWAPPED (mirrors the Wall Street bailout) | 366-367 |
| Dunmore Proclamation "denounce slavery" option | "Opposite of A" (helps Trads) — should be "Opposite of B" (helps LW-Pop + Civil Rights) | 623, 636 |
| Independence-Era budget props (e.g. continental army "boosts revenue") | Sign-flipped; vcczar **fixed** rev/budget issues | 639, 654 |
| §2.8 veto-override | Speaker + Maj-Ldr get 250 pts "if voted **against**" → should be "**for**" | 435-436 |
| `San Antonio ISD v. Rodriguez` SCOTUS | Trads/RW-Pops Yea, Libs/Progs Nay = REVERSED; should score Civil Rights not Education | 946 |
| Constitution Article 1 Option B/C (unicameral) | Small-state vs large-state Gov opposition flags REVERSED | 948 |
| "Advocate Isolationism" gov action | Boosts pacifists but gives the Isolationist-card faction nothing | 231 |
| Honest-Gov't meter "Corruption" bonus | References a trait that doesn't exist (Controversial was once split into 3 types incl. "corrupt") | 426-430 |
| Gov-Actions prereq wording | "Judicial expertise" (skill=Judicial, expertise=Justice); "Governor needs Law and Order" (that's a faction CARD) — skill/expertise/card disambiguation | 407-408 |
| Party-Leader rule contradiction | First-time PL gets Leadership 100%, but Leadership negates the >2-ideology −1 penalty → penalty never applies | 239 |
| "Scalawags" faction name requires Moderate AND Nationalist (conflicting cards); gilded pres-actions list "fugitive slave law enforcement" 2x | Card-config + duplicate | 559, 582 |

---

## §5. Community suggestions / rule ideas [tier-4] & bugs not yet resolved

Genuinely-new mechanical IDEAS (mostly OPEN / deferred to "after early release"):

| Idea | Who / disposition | Post |
|---|---|---|
| **LW/RW Media lobby = too strong** (only lobby with an automatic faction-wide +1 in BOTH primaries & general, all states) | pman/ShortKing; OrangeP47 amenable to adding **Wall St/Big Corporations + Labor** as counter-lobbies but "small/incremental, may not clear the lock." **OPEN** | 222-230, 370-394 |
| **±2/±3 cap on cabinet-appointment + legislative enthusiasm swings** | Cal documents +14 swings from cabinet alone (gameable via shared no-ideology lobby like Big Agriculture) + the legislative tie-at-net-0 swing-of-4-8 problem; Ted "open to both caps." **OPEN. ★ Earlier corroboration of #124 (cabinet→enthusiasm rework / ±3 cap #80) + the lobby-stacking asymmetry** | 659-670 |
| **2nd-term incumbency-fatigue penalty from 1948** | pman; Will's compromise: −1 if nominee is a different faction, −2 if same faction / incumbent seeking 3rd term (apply like the gov too-many-terms rule). Ark notes a hidden 8-yr party-leader penalty already exists. **OPEN** | 295-314, 327 |
| **Reconciliation bills** (budget-impacting, 3+ items, committee, simple majority) | 0ccultist. **OPEN** new mechanic | 143 |
| **Faction vote-splitting / "vote your conscience"** (reps revert to individual AI) | Ted (now that state-industry re-election penalties exist); needs AI individual-behavior rules. **OPEN** | 431-434 |
| **NATO / Article 5** (members auto-join when US attacked, regardless of relations, unless US starts an offensive war) + **war-score at start** for mid-war start dates | pman. **OPEN — foreign-policy gap** | 409-416, 519-521 |
| **Amendment ratification window** (governors vote immediately = wrong; make ratification a free Gov-phase action with a ~20-yr window; election-bonus timing) | pman; OrangeP47 opposes as a major overhaul (clogs gov actions, log-jam, AI rewrite). **OPEN — corroborates #119 amendment lifecycle** | 680-694 |
| **Draft-ideology lock = no player agency** ("kept Lincoln & Seward from careers"; some factions pointless across 3 eras) | OrangeP47 (scrap draft ideos) vs vcczar (Bernie+Manchin-vote-in-unison is why they exist); consensus to make draft ideos **toggle-able**. **OPEN — corroborates #92/#72** | 759, 773-787 |
| **Frail-pols-live-too-long / death-roll order + cap doesn't scale** | Polk died at 79 (26 yrs late); oldest-first rolls + ≤2/faction cap let frail-young pols dodge; suggest frail-first / age-banded caps / **%-of-faction death (3%)**. **★ Earlier corroboration of the smallbugs 5%/faction-max + drums/hd1 frail-death + DH-65 undead-pols** | 718-739 |
| **Iron Fist too common** from Senate elections (1948 Dems had 25); suggest 5% from 2nd term | jnewt. (Trait-inflation theme, with Integrity/Controversial) | 911 |
| **CPU never drafts party-flippers / outside its draft-ideologies** | 10cent/ebrk (player drafted Henry Clay across lines; CPU won't). **OPEN — corroborates OC-4/#72** | 912-913 |
| **American Civil War too easy as the Union** | Formal suggestion: war-score victory multiplier **1 → 0.5** + **per-theater, not cumulative** (must win both theaters). **OPEN — corroborates war-engine #152 + #56-#60** | 947 |
| **Relocation funnel unrealistic** (NY→Hawaii for cabinet balance); want ideology/demographic-bias moves + more alt-states | jnewt vs OrangeP47 (it's a mechanics-only safety funnel; AI moves 1 pol/round @20%; more options dilute the funnel). **OPEN — corroborates #38 relocation-cap (this is the same system, earlier)** | 924-940 |
| **Super-cabinet under-valued** (5-admin team can't stop a global-event depression) | pman; cap global-event meter shifts by lead-admin. **OPEN — corroborates #124/#31 + #160** | 941-943 |
| Young-nominee realism (O'Connor to SCOTUS at 26); Egghead-advisor cross-domain (Fed Chair deciding on invading Hungary → limit to Cabinet + Key Advisor); kingmaker/protégé re-roll every 4 yrs; deactivatable state primaries; top-draft-pick auto-loses-Obscure; voluntary retirement/inactive list | Assorted tier-4 ideas, mostly OPEN/deferred | 760-772, 908, 265-266/560, 543, 544-553, 538-542 |
| Impeachment-process concerns ("Fourteen Points on Impeachment" in a separate thread) | pman — **corroborates DH-33/DH-66 (impeachment broken)** | 671 |

**★ AI-design philosophy (meta, POST 939-940):** OrangeP47/Will state the CPU
must stay on a **tight leash** — *"the fewer options an AI has, the better it
will be… an AI smart enough to beat a human isn't possible… aim for competent,
not Jack-of-all-trades."* This frames the entire CPU-decision cluster
(#70-#76 / OC-* / #143-#146): the design intent is a **deliberately
narrow-option CPU**, so CPU "fixes" should add gates/rolls, not broaden choices.

---

## §6. Deltas vs. current build — gap-log additions

**Corroboration-rich, ONE new mechanical gap.** Most content folds into #120 +
strengthens existing rows.

### §6a. Folds into #120 (dataset-accuracy umbrella) — `fixes2022`/batch-19
~20 named dataset/scenario-config items + ~10 bill/event/SCOTUS sign bugs (§4),
PLUS vcczar's own ~1800-legisprop audit. Same `CURATED_ROWS`/scenario-config
work surface. **Cross-thread:** Bob Scott (= smallbugs §2b), the
Catholic/foreign-born/alt-state/duplicate/sign-bug patterns all recur. **The
scripted-event build-out (§2) corroborates the era-event/scripted-event system,
not a new gap** (the shipped `EraEvent`+`Predicate`+`addPolitician` model already
supports the Shaw/John-Brown removal pattern + demographic-gated entry).

### §6b. NEW mechanical gap — #167 (no-successor presidential constitutional-crisis subsystem)
The only genuinely-new mechanical capability this thread specifies that isn't
already a gap row: the **no-eligible-successor presidential crisis** (empty VP +
no third-in-line bill) — emergency-Congress succession-law vote (auto-signed,
un-vetoable) + House 1-vote-per-state acting-President election + scaled DomStab
penalty + optional coup branch. vcczar + Ted hammered out a full procedure
(POST 841-882). Distinct from #61 (normal VP-succession line) — this is the
**fallback when the whole line is empty.** → **#167.**

### §6c. Existing-row corroborations / strengthenings
| Existing | What this thread adds | Posts |
|---|---|---|
| **#120** (dataset umbrella) | 3rd-thread input list; vcczar's own legisprop audit; the smallbugs thread's GENESIS (637-640) | §4 |
| **#121** (Secessionist trait absent) | **★ EARLIEST corroboration** (predates smallbugs): Umbrella POST 641-644 — "useful to have a secessionist trait, similar to union loyalist… no way to tell who that is"; workaround = a **1/0 column (1=loyalist, 0=seceded, blank=non-Southern)**; "Union Loyalist isn't used anymore" / "Actually, it is. Or it will be again" | 641-644 |
| **DH-64** (Union Loyalist labeling) | Same 641-644 exchange + the Reconstruction "appointees can't have seceded" rule (364-365) | 364-365, 641-644 |
| **DH-53** (bill→meter sign bugs) | 8+ new instances (§4b): bailout, Dunmore, Indep-budget, veto-override, San-Antonio-ISD, unicameral-options, isolationism | §4b |
| **#124 / #31 / #80** (cabinet→enthusiasm) | **★ Earliest corroboration** of the cabinet/legislative enthusiasm-swing cap + lobby-stacking asymmetry (Cal, 659-670); the broken-promise −1 enthusiasm (838) | 659-670, 838 |
| **#153** (no-reroll-on-held-expertise) | **★ CANONICAL SOURCE** — vcczar adopted it here March 2023 (645-650), earliest instance | 581, 645-650 |
| **#126** (Pres impl Admin-then-Command) | Ted flags Pres-implementation is unspecified (does Pres roll or just modify?) — the question `tedchange` POST 163 later answers | 852 |
| **#135** (50-50 Senate = VP's party) | Earlier corroboration (vcczar POST 803) | 803 |
| **#88 / OC-3** (CPU crisis-vote-against-survival) | The 75%-nay-on-game-over CPU rule (663) + Carlisle Peace Treaty | 622, 663 |
| **#61** (succession / acting-president) | The no-successor crisis (→#167) + fill-order + PPT-resigns-from-Congress + acting-president-scope | 841-882 |
| **#56-#60** (Civil-War subsystems) | The "Secessionist Politicians" appointment rule (364-365) + the Civil-War rec doc (248-250) + Union-too-easy (947) | 248-250, 364-365, 947 |
| **#119 / #39** (amendment lifecycle) | 2/3 congressional bar (357-360) + the ratification-window debate (680-694) | 357-360, 680-694 |
| **#92 / #72 / OC-4** (era-gating / draft-ideology lock) | The draft-ideology-lock-as-no-agency debate + toggle-able intent (773-787); CPU won't draft outside draft-ideos / party-flippers (912-913) | 773-787, 912-913 |
| **#115** (scenario-boot procedure) | Scenario-setup errors ≠ master-data (528); Era-of-Independence-guide flags (incumbent-party determination, enthusiasm in a no-party era, for-life-appointment enthusiasm re-processing, Federalist-paper-author party gate) | 528, 828-831 |
| **#38** (relocation cap) | The relocation-funnel debate (this is the same overpopulated→underpopulated system, earlier) | 924-940 |
| **#101** (office-by-bill / Postmaster) | Postmaster=patronage/Kingmaker (130-133); CC Special-Envoy office created by bill (679) | 130-133, 679 |
| **#152** (war engine) | Battle order (naval-first→ground), 902; Civil-War-too-easy (947) | 902, 947 |
| **#160 / DH-67 / #108** (era-bias coupled to events) | **★ Earlier corroboration**: state biases shift WITHOUT a triggering event (Great-Depression bias w/o the event); OrangeP47's event-adds-party-pref-modifier proposal; vcczar's "make historical era trends more organic" to-do (deferred as possible-DLC) | 366/636, 652-655 |
| **#143** (post-election Command-loss) etc. | The CPU-on-a-tight-leash design philosophy (939-940) frames the CPU cluster | 939-940 |
| **DH-27** (trait conflicts) | Iron-Fisted+Harmonious = NOT-conflicting ruling (566-568); double-conflict roll-order (6-7) | 6-7, 566-568 |
| **#18 / #51** (enthusiasm fork) | **★ The strongest provenance fact**: enthusiasm is the system Anthony got STUCK on; even V re-implements it differently each time (713-716) | 701, 713-716 |
| **DH-33 / DH-66** (impeachment broken) | "Fourteen Points on Impeachment" separate-thread pointer | 671 |

---

## §7. Open questions

- **Era-event firing-rate / per-era cap** — vcczar wants a cap ">8" but the
  dynamic-limit model (target ~70% fire per era) is unsettled (114-123).
- **Cabinet/legislative enthusiasm swing caps** (Cal's ±2/±3) — Ted open, no
  ruling (659-670). Folds into #124.
- **LW/RW Media nerf + counter-lobbies** — OPEN (370-394).
- **2nd-term incumbency-fatigue penalty** — OPEN (295-314).
- **NATO / Article 5 + war-score-at-start** — OPEN foreign-policy gap (409-416).
- **Amendment ratification window** (immediate-vote vs Gov-phase free action +
  20-yr window) — OPEN, contested as a major overhaul (680-694).
- **Draft-ideology lock** — toggle-able vs intended-default; the "no player
  agency in some eras" complaint unresolved (773-787).
- **Death-roll order + cap scaling** (frail-first? %-of-faction?) — deferred to
  alpha data (718-739).
- **Integrity/Controversial 10-20% confirmation-inflation fix** — AGREED but NOT
  implemented at thread's end (906).
- **#167 details** — what if the acting-PPT/party-leader is ineligible
  (foreign-born/young); does the new PPT or the old keep the presidency after a
  PPT-3rd-in-line law; special-election-vs-House-choice-vs-game-over default —
  vcczar leaned "must go to the US House" but left edges open (857-882).

---

## §8. What the game-master / tech-lead / roadmap-planner should note

1. **Mostly #120 dataset work** — ~20 named items + ~10 sign bugs + vcczar's
   own ~1800-prop audit; all via `CURATED_ROWS`/scenario-config. Cross-thread
   dup of Bob Scott; same Catholic/foreign-born/alt-state/sign-bug patterns.
2. **The scripted-event system is corroborated, not gapped** — the shipped
   `EraEvent` + `Predicate` + `addPolitician` model already supports the
   Shaw/John-Brown removal pattern + demographic-gated entry; the open piece is
   the **late-start event-boot-filter** (POST 423, intended) + the era-event
   firing-rate cap.
3. **NEW gap #167** — the no-successor presidential constitutional-crisis
   subsystem (the only new mechanical capability).
4. **Authoritative rulings to fold into the design** (highest value): the
   Reconstruction "Secessionist Politicians" appointment rule; the game-over
   75%-nay CPU rule; no-reroll-on-held-expertise (#153 canonical source);
   below-minimum-skill-doesn't-resign; Fed-Chair/FBI never-held-office+3-admin;
   50-50-Senate→VP's-party (#135); the Integrity/Controversial 100%→10-20%
   confirmation-inflation fix; the CPU cabinet-nominee 3-step rework; the
   Gov→President Obscure/Leadership/Command rolls (state-size-scaled).
5. **Provenance:** this thread predates + spawns `smallbugs` (637-640) and
   predates `tedchange` (its chunks 13-15 are the same systematic 2.2-2.4 pass
   Ted later formalizes). The single most important context fact: **ideology
   enthusiasm (#18/#124) is the system the programmer got stuck on and even the
   designer can't pin** (713-716).
