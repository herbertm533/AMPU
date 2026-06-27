# Digest — b9028796 "Deep Dive Feedback: Presidential Appointments & Confirmation Process"

**Type:** FOCUSED DESIGN-REVIEW thread (not a playthrough). **Lead:** @MrPotatoTed
(tier-1 designer) doing a section-by-section "deep dive" to **rewrite & finalize the
2.3 Rules Document** — Presidential appointments (cabinet, sub-cabinet, military,
ambassadors) + the confirmation process — for realism / "gameplayism" / outsider
readability, then lock 2.3 "until early release." **Dated Sept 11–16, 2022 — this is
the AUTHORITATIVE DESIGN ORIGIN of the appointment/confirmation ruleset** that later
digests (`fixes`, `nuke`, `modern`, `modernday`, `tedchange`, `pop2012b`) captured as
*cleanup passes on this same text*. 102 posts / 3 chunks, all read. Ted = tier-1;
final authority deferred to @vcczar ("It's his game," POST 25/74–75). Disposition
codes below: **ACCEPTED** (Ted/V committed it to 2.3), **PROPOSED** (raised, no commit),
**DEFERRED** (good but punted, often "AMPU 2 / programming realm"), **OPEN** (unresolved).

Polarity/era note: this is a rules doc, era-agnostic; offices are **era-keyed** (1772 =
no cabinet exists, must be created by Congress/Exec-Action; later eras unlock more).

---

## A. Appointer & cadence (who nominates, when)

| Rule | Detail | Disp | Post |
|---|---|---|---|
| Appointment cadence | Appointments done **every half-term**, except before Independence is declared | ACCEPTED | 19,40 |
| Office creation | Every post must first be **created by legislative proposal OR Executive Action**; in 1772 none exist. **Only exception: Key Advisor** (always available, no Congress) | ACCEPTED | 40 |
| Continental-Congress mode | While CC exists, **committee chairs nominate**: Foreign/Military Chair → Generals, Admirals, Ambassadors, Sec State, Sec War/Defense; Economic Chair → Sec Treasury. Delegates vote to confirm; if vote fails, **incumbent stays**; if no incumbent, **CC President picks freely** | ACCEPTED | 19,30,40 |
| President mode (firing precedent NOT set) | President appoints; appointees are effectively **"for life"** — removable only by event/military outcome/random death-retirement/voluntary removal. Pre-1800 starts begin here | ACCEPTED | 19,22,40 |
| President mode (firing precedent SET) | Set via **"Set Precedence for Firing Cabinet Members"** Exec Action (historically late-Adams); **auto-set for post-1800 starts**. President may **retain up to 5 incumbents** total (cabinet + cabinet-level + ambassadors); rest auto-vacated; must fill all vacancies | ACCEPTED | 19,22,40 |
| Moving an incumbent | Re-slotting an incumbent **does NOT count against the 5-retention cap**, but they **must pass Senate confirmation again** | ACCEPTED | 19,40 |
| **Acting President** (not recognized as "real") | Appointer becomes **Senate Majority Leader** (or **President Pro Tempore** if no SML yet). Incumbents stay; acting Pres fills only **vacancies that occur**; SML may retain ≤5 / refills rest (drafted both ways across the thread — see OPEN) | ACCEPTED | 28–34,40 |
| Acting-Pres incumbent overflow | V/Ted: cabinet incumbents **remain even if over the 5-cap** under an acting Pres ("Yeah, I assume so") | ACCEPTED | 33–34 |
| **Pliable/Passive Pres + Iron-Fist same-party Senate Leader** | Iron-Fisted SML makes a nomination instead of the Pres: **Pliable → 50%**, **Passive → 75%**, **both → 100%**; **roll per available office**. Same 5-retention cap applies | ACCEPTED | 40 |
| Presidents now appoint military & ambassadors | "as is accurate to real life" — previously these were committee/auto; **all nominations now made & voted SIMULTANEOUSLY** (ambassadors + generals alongside Secretaries) | ACCEPTED | 39 |

## B. Eligibility / office-holder requirements (cabinet, cabinet-level, ambassadors)

| Rule | Detail | Disp | Post |
|---|---|---|---|
| Min skill | **≥1 admin** to hold any non-military cabinet/cabinet-level/ambassador post | ACCEPTED | 40 |
| Tenure cap | **16 years total** as Secretary / cabinet-level / ambassador (cumulative); **4-term max**, whichever first. **Military service does NOT count**; **CIA/DNI & FBI exempt** (no term limit). Era of Independence has no terms (committee chairs may replace every 2 yrs). **NEW expansion this thread:** 16-yr cap broadened from Secretaries-only to *everything but military*, and made cumulative | ACCEPTED | 39,40,144,146 |
| Trait gates | **Incompetent** cannot accept any cabinet post; **Easily-Overwhelmed** declines 50% of the time — both lifted only if no one else available; apply to reappointments too | ACCEPTED | 40 |
| Fired/quit ban | A pol previously **fired or quit via event or botched implementation roll** can never be appointed again | ACCEPTED | 40 |
| Broken Presidential Promise | Naming-then-not-fulfilling a promised nomination → **−2 ideology enthusiasm** for that faction | ACCEPTED | 40 |
| **Cross-party appointment gate** | Opposing-party nominee may accept only if: Pres's ideology / Moderate / "can party switch" / "can be independent" / has Integrity / is the incumbent being retained. **No Controversial.** **Max 1 ideology slot apart** (a Mod Red serves a Lib Blue, NOT a Prog Blue). **Caps: ≤1 cross-party in the Top-Four** (State/War-Def/AG/Treasury), **≤3 cross-party total** — uncapped only if Pres is "can be independent" | ACCEPTED | 40 |

## C. Scoring — meters, traits, expertise, lobbies (nomination considerations)

| Rule | Detail | Disp | Post |
|---|---|---|---|
| **Admin → meter (Lingering)** | Confirmed appointees impact a portfolio meter during the **Lingering phase**: higher admin = more positive, **low admin can HARM** the meter. Full **officer→meter map** given (Treasury→Revenue/Econ; State/UN-Amb→Foreign Rel; SecWar/Def/Navy/DNI/CIA/JCS/NSA/Sr.Gen/Sr.Adm→Mil-Prep; AG/HUD/Labor/Religion→Domestic; Media/Postmaster→Honest Gov; Health/Edu/Ag/Welfare/Tech→Quality of Life; Energy/Sci/Env/Interior→Planet's Health; Postmaster/Key-Advisor→Party Pref). **Key Advisor potentially hits EVERY meter** | ACCEPTED | 40 |
| Trait multipliers | **Efficient → 2× meter impact** (good or bad); **Egghead → extra pts for egghead + Pres factions**; role-specific trait fits (Bookkeeper great at Treasury, **Numberfudger toxic** there) | ACCEPTED | 40 |
| **Expertise scoring (NEW MODEL)** | Replaced old **"bold expertise"** rule. Each role has a list of accepted expertises; nominee must have **≥1**; **each expertise beyond the first = +50 pts to the President**. Added more expertises to most roles. Full per-office expertise lists enumerated | ACCEPTED | 39,40 |
| **Lobby/interest enthusiasm** | Cabinet pick from a faction holding the matching lobby/interest card → each holding faction has **25% chance +1 enthusiasm** (roll individually). Ignored lobby cards → **25% chance −1 enthusiasm** each. **No penalty if no matching post exists.** **Cabinet-LEVEL posts use 10%** (not 25%). Full per-office lobby maps enumerated | ACCEPTED | 40 (lists 162–234) |
| Special-office rules | **Postmaster**: must have Kingmaker, cannot have Integrity, Pres's party, +party-pref/−honest-gov patronage. **DNI/CIA**: no term limit, removable at Appointment 25%−mil-prep unless incompetent/easily-overwhelmed/over-70, doesn't count vs the 5. **FBI**: 10-yr terms, reappoint = 10% +DomStab / 10% −honest-gov, doesn't count vs 5. **US-Bank Pres**: must go to a faction controlling the Wall Street lobby. **JCS Chair**: promoted from Gen/Adm + Military-Leader trait (waived if none). **Key Advisor**: requires Kingmaker, Pres's party, optional unless Pres was a kingmaker's protégé; "better left vacant than incompetent" | ACCEPTED | 40 |

## D. Ambassadors & military appointments

| Rule | Detail | Disp | Post |
|---|---|---|---|
| Ambassador term/rotation | Caps mirror cabinet: **16-yr service limit**, rotate only **once per full term** ("which is what they do IRL"). Fix for the observed bug of 4–5★ ambassadors **endlessly musical-chairing posts** in a cabinet-less 1772 game | ACCEPTED | 4,5 |
| Ambassador prereq | Final prereq: **Foreign Affairs, Business, or Trade** (Ted "had already set it" before settling the debate). Earlier leaning was FA-required only | ACCEPTED | 43,45,47,160 |
| Ambassador admin-gain | Ambassadors get a **+1 admin chance on INITIAL appointment** (Germany→Russia move is not "new") | ACCEPTED (to-add) | 3 |
| **Isolationist/Nationalist ambassador → relations penalty** | Appointing an **isolationist** (or nationalist) ambassador should roll to **harm relations** with the host country (Joe Kennedy/UK WWII precedent). Subtlety RULED: the **lobby enthusiasm boost** comes from the *faction*, but the **relations penalty** attaches to an ambassador who *personally* has Foreign-Affairs in the Isolationist faction (i.e., is actually an isolationist) → "you can't keep them there long" | ACCEPTED-in-principle | 51–56 |
| **Senior military confirmation** | **Senior Generals & Senior Admirals MUST be confirmed by Congress** the next Legislative Session (Foreign/Military Committee → full chamber; it's mandatory "business," not member-proposed). Non-senior officers auto. Historical compromise so SecWar/Def has something to do | ACCEPTED | 21,23,24 |
| Voted-down military officer | If a senior officer is rejected → behaves **like a defeated SCOTUS nominee**: a new appointment is made, and the **2nd appointment is auto-confirmed** to keep the game moving | ACCEPTED | 22–24 |
| Branch lock | A **General can't become an Admiral** (and vice-versa); **Seniors can't be demoted** to regular military leaders (note already at bottom of doc) | ACCEPTED | 36–38 |
| Military lobby interest | Lobbies may influence ambassador/military picks; Ted toned the **military** list down to **Military-Industrial Complex only** (others argued Expansionist/Isolationist stay); ambassadors: Expansionist/Nationalist/Pacifist/Globalist/Isolationist (+Free-Trade suggested) — **bonus/malus pts only, NOT the destabilizing drop** for military | PROPOSED/partial | 44–50 |

## E. Nomination acceptance odds (who says yes) — **CPU-only; humans freely accept/decline except VP**

| Candidate type | Acceptance behavior | Disp | Post |
|---|---|---|---|
| Senate/House officers, SC justices | **10%** top-cabinet (State/Treasury/AG/War-Def), **25%** for Sec State; **never** accept lower-cabinet/cabinet-level/ambassador | ACCEPTED | 40 |
| Senators (non-officer), Governors | **90%** top / **75%** lower / **50%** cabinet-level / **10%** ambassador (UN-Amb is cabinet-level) | ACCEPTED | 40 |
| Representatives | **Always** accept (unless a House officer) | ACCEPTED | 40 |
| Generals/Admirals/military | **Always** accept unless **Disharmonious (50%)** | ACCEPTED | 40 |
| Career-track pols | cabinet **100%** / cabinet-level **75%** / ambassador-or-military **50%**; if confirmed, **pulled off career track** with milestone benefits earned so far | ACCEPTED | 40 |
| Incumbent movement | Top-cabinet only retain/move to another top post; lower-cabinet retain or move **up 100%** / to cabinet-level **50%** / to ambassador **25%**; cabinet-level & ambassadors accept all | ACCEPTED | 40 |
| Sitting VP | **Cannot** accept any nomination | ACCEPTED | 40,250 |

## F. CPU appointment & retention logic (`GM⇒App` — must move into the app's AI)

| Rule | Detail | Disp | Post |
|---|---|---|---|
| CPU fill priority | **Key Advisor → crisis-helpful posts → top secretaries → lower cabinet → cabinet-level → ambassadors** (ambassadors filled lowest-relations first) | ACCEPTED | 40,236 |
| Key Advisor floor | CPU appoints Key Advisor **only with ≥3 admin**, else leaves vacant | ACCEPTED | 236,238 |
| **Crisis-position selection** | For crisis-impacting posts (incl. Defense/Navy during war), CPU takes the **highest-admin** eligible pol **regardless of all else**. Tie-break: Efficient → most lobbies/factions → most expertises → appointer party → appointer faction → random | ACCEPTED | 240 |
| Non-crisis selection | Otherwise CPU prioritizes **lobbies/factions → expertises → party → faction → admin (last)** — Ted flags this **produces 1★ nominees** (who then lose); explicitly OPEN for feedback | ACCEPTED-but-flagged | 100,242,83 |
| Non-crisis resolution | Settled via a **CPU roll**: choose to prioritize admin OR prioritize lobby. (Earlier code did this but kept picking lobby mid-crisis → split crisis vs non-crisis priority tables) | ACCEPTED | 100,102 |
| CPU retention | CPU **doesn't "keep" anyone** — just re-runs the fill rules; incumbent wins if best & under the 5-cap; once at cap, incumbents become "ineligible" to stay | ACCEPTED | 29,32 |
| CPU FBI churn | CPU replaces FBI Director: **75%** if Pres is LW/RW-Pop; else **50%** if director is other-party, **25%** if same-party different-ideology | ACCEPTED | 244 |
| CPU cross-party support | Faction leaders **from the Pres's party are inclined to support cross-party nominees** unless traits dictate otherwise | ACCEPTED | 84 |
| Iron-Fist CPU SML | CPU SML with Iron Fist **defaults to forcing a vote on every nominee outside its own faction** (this is the "always vote" path that addresses the auto-confirm complaint) | ACCEPTED | 74 |
| CC-mode CPU removal | (CC era) CPU voluntarily removes its appointee if they drop **below 2** in the relevant skill, if a ≥2 replacement exists | ACCEPTED | 19,40 |
| SML replacement-list pick | When a nominee is defeated, the **SML recommends the 5 most-qualified** replacements (traits/ideology can shift the list, as in voting) | ACCEPTED | 82 |

## G. **THE CONFIRMATION-PROCESS SPEC** (final, post-debate)

This thread is the **origin of the confirmation process**; the resulting spec:

| Step / rule | Detail | Disp | Post |
|---|---|---|---|
| **Confirmer** | The **Senate** (committee first, then floor). In CC era → CC delegates. With no Senate at all → see #112/#159 (remaining chamber / automatic) | ACCEPTED | 30,57,138 |
| **Auto-confirm gate** | A nominee is auto-confirmed **ONLY IF ALL of:** ≥3 admin (military for officers) **AND** not Controversial **AND** SML is not Iron-Fist **AND** **NOT one of the Top-Four** (State/Defense/Treasury/War). Otherwise → full hearing | ACCEPTED (final) | 57,82,87,88 |
| **Forced full hearing** | An **Iron-Fist Senate Majority Leader can force a full hearing for ANY nominee(s)** regardless of all else (CPU SML defaults to doing this vs out-of-faction picks) | ACCEPTED | 57,74,138 |
| **Top-Four always vote** | **COMPROMISE that resolved the blow-up:** State/Defense/Treasury/War **always go to a full Senate vote** (no auto-confirm), because those carry the biggest impact/bonuses and are what players want to fight over | ACCEPTED (Ted) | 82,100,102 |
| Full hearing structure | **Relevant committee first, then Senate-wide vote.** Ted **rejected** simulating per-senator questioning/scandal rolls ("fun for 1 hearing, not 30 every 2 years for 200 years") | ACCEPTED | 57,61 |
| **Admin-1 penalty** | If nominee has only **1** in the relevant skill, a senator who'd otherwise vote AYE has a **50/50 chance to flip to NAY** | ACCEPTED | 82 |
| Ideology voting | Populists vote against Moderates and vice-versa; some traits vote against anyone off their personal ideology — **only when a vote occurs at all** | ACCEPTED | 81 |
| **Trait→vote probability** | Trait impact on a confirmation vote changed from 100% certainty to **75%** (some still 100% or 50/50) — so human players can no longer predict every vote with certainty | ACCEPTED | 93 |
| **Defeated-nominee fallout (FINAL)** | On rejection: **33% the President is blamed → nominee gains Controversial; 33% the SML is blamed (politics); 34% nobody cares (no trait).** If the nominee **already had Controversial** and is denied → **lifetime ban** from Cabinet/Cabinet-Level roles (may still serve as Ambassador or no-confirmation roles) | ACCEPTED (Ted, final) | 92 |
| Voter-side trait effect | Senators voting NAY may gain **Controversial or Integrity** depending on how the vote is perceived | ACCEPTED | 61 |
| Vetting (D6 pre-nomination) | Roll D6 when a nominee accepts vetting: 1=career-ending retire, 2=Controversial, 3–5=nothing, 6=Integrity. Ted himself: too slow ("30 hearings…"), and group concurred it's playtest-impractical | DEFERRED | 6–8,20,233,251 |

## H. Designer-flagged deferrals & AMPU-2 ideas (record the rationale)

| Item | Detail | Disp | Post |
|---|---|---|---|
| **Auto-confirm toggle** | Ted: "I'm all for EVERYTHING being toggled on and off… I have no control over that, I'm not the programmer." V: no change for now, revisit post-release. The Top-Four-always-vote compromise (G) was the actual resolution | DEFERRED to programming/options | 72,74,75,82 |
| **"Fog of War" hidden ability** | Toggleable game option: a nominee's Admin (and in a full version, hidden internal traits) shown as a **range/blurb, not a number**, scoutable; President may **vet** to reveal. Both Ted & vcczar liked it; "more programming realm than rules"; flagged for **AMPU 2 / post-release update**. Tagged for @vcczar → Anthony (programmer) | DEFERRED (AMPU-2) | 94–98 |
| Acting-Pres cabinet authority | Whether a VP-turned-Pres (not yet "real" Pres) keeps/over-caps the inherited cabinet at midterm; two drafts in-thread (incumbents stay & only fill vacancies, vs SML retains ≤5). V leaned "appoint only on vacancy." Later resolved in `nuke`/`completions` acting-presidency spec | OPEN (drafted, see #112) | 28–34 |

---

## Built-vs-design context (shipped reality, spot-checked)

- Codebase HAS: `CABINET_SEAT_SCORING` (types.ts:1221), PV office weights incl. military/ambassador (pv.ts:12–60), and **`ABILITY_EARN_RULES.cabinetConfirmAdmin`** — the F-DOUBLING admin-gain-on-confirmation ladder (types.ts:570–595) which is the *coded* face of POST 3's retained-officer admin-gain rolls.
- Codebase LACKS: any **confirmation-vote logic** (no threshold/auto-confirm/Iron-Fist-force-vote tokens), any **Lingering meter-roll engine**, any **defeated-nominee trait cascade**, the **±1-ideology cross-party gate**, the **5-retention / firing-precedent** state, the **acting-Pres / Pliable-Pres appointer substitution**, the **+50-pts-per-expertise** scoring, the **per-office lobby-enthusiasm rolls**, and ambassador **tenure/rotation** limits. All of the above are **designed-but-unbuilt**.

---

## Candidate gaps for consolidation (NEW vs corroborates-#)

**Strongly CORROBORATES / SHARPENS (this thread is the Sept-2022 ORIGIN spec; later digests are its cleanup):**
- **#179** (cabinet Lingering-roll meter engine) — **CORROBORATES + provides the canonical officer→meter map, the Efficient=2× rule, the admin→meter direction, and Key-Advisor-hits-every-meter** (Section C; POST 40). This is the earliest full statement of the rule #179 calls "the most-repeated unfinished designer ask."
- **#199** (rejected-nominee trait cascade) — **CORROBORATES but UPDATES the disposition: the final 2022 rule is NOT the Controversial→Incompetent cascade.** Ted (POST 88–92, with Cal's 9-historical-rejection analysis) **replaced it** with: 33/33/34 blame roll → Controversial-or-nothing, and **already-Controversial → lifetime Cabinet/Cabinet-Level ban** (Ambassador still allowed). #199 (sourced from `fixes`) records the *superseded* version; flag for reconciliation.
- **#217** (president/cabinet implementation sub-engine + governing traits) — **CORROBORATES** the trait-modified meter layer (Efficient/Egghead/role-trait fits, Numberfudger-at-Treasury), and the Pliable/Passive appointer-override (Section A) is the same governing-trait family.
- **#172** (era-keyed confirmation thresholds + Nuclear-Option) — **CORROBORATES the structure** (committee→floor, threshold vote) and supplies the **auto-confirm gate + Top-Four-always-vote + Iron-Fist-force-vote** that #172's modern thresholds sit on top of.
- **#112** (modern institutional layer: ±1-ideology gate, failed-nominee recovery, Iron-Fist force-vote, acting-Pres) — **CORROBORATES & is the ORIGIN** of the ±1-ideology cross-party gate, the SML-names-5-replacements recovery, and the acting-presidency drafts.
- **#25** (firing-precedent gate + tenure) — **CORROBORATES & ORIGINATES** the firing-precedent Exec-Action, the 5-retention cap, the 16-yr cumulative tenure (and its expansion to non-military), the cross-party caps, and the CIA/FBI/term exemptions.
- **#31 / DH-23** (cabinet scoring: region/lobby) — **CORROBORATES** the lobby-enthusiasm scoring mechanic and the CPU lobby-vs-admin selection tension (the **explicit acknowledged cause** of DH-23's 1★-nominee / low-pass-rate bug is right here: POST 83/100/242 — "consider everything before admin → 1★ nominees").
- **#49** (military-leadership appointment tier) — **CORROBORATES & ORIGINATES** the senior-military-confirmation rule, branch-lock (Gen≠Adm), no-demotion, and the JCS-from-Gen/Adm + Military-Leader requirement.
- **#142** (CPU Chief-Justice ladder) — adjacent: the **defeated-military-officer = "like SCOTUS" with auto-confirmed 2nd pick** (POST 22–24) mirrors the SCOTUS-replacement pattern; minor corroboration.

**NEW (not cleanly in the gap log; recommend new rows or sharpening):**
1. **N1 — Nomination-acceptance odds table (CPU) + "humans freely accept/decline except VP."** The full per-candidate-type acceptance matrix (Section E, POST 40) is the *appointee-side* of the appointment phase; gap log has the human/CPU split (pop2012b POST 820-821) but not this odds table as a build requirement. **Likely NEW build requirement.**
2. **N2 — `+50 pts per extra expertise` scoring model (replaces "bold expertise") + per-office expertise lists.** A concrete, enumerated scoring rule (POST 39–40) with no current gap-log home. **NEW.**
3. **N3 — Ambassador tenure/rotation limits (16 yrs; rotate once per full term) + isolationist-ambassador relations penalty.** The endless-musical-chairs fix and the Joe-Kennedy relations-penalty rule (POST 4–5, 51–56) — ambassador-specific, not covered by #49 (military) or #31 (cabinet scoring). **NEW.**
4. **N4 — Auto-confirm gate + Top-Four-always-vote compromise as the *confirmation control structure*.** #172 has the *threshold numbers*; this thread defines the **gate that decides whether a vote happens at all** (≥3 admin ∧ ¬Controversial ∧ ¬IronFist-SML ∧ ¬Top-Four → auto). **NEW sub-structure under #172** — and the design-rationale debate (POST 62–82) is worth recording as the canonical realism-vs-gameplayism tradeoff.
5. **N5 — Pliable/Passive-Pres → Iron-Fist-SML appointer-substitution probabilities (50/75/100%, roll per office).** Concrete numbers (POST 40); #112 mentions Iron-Fist force-vote but not this *who-nominates* substitution. **NEW (or sharpen #112).**
6. **N6 — "Fog of War" hidden-ability/hidden-trait game option (AMPU-2 deferral).** Designer + vcczar both endorsed; explicitly punted to post-release/AMPU-2 and the programmer. Record as a **DEFERRED roadmap parking-lot item**, not a v1 gap.
7. **N7 — Vetting D6 pre-nomination roll.** Repeatedly raised, repeatedly DEFERRED as playtest-impractical; pairs with N6 fog-of-war. Parking-lot.

---

## Open questions for the human
- **#199 reconciliation:** the gap log's Controversial→Incompetent cascade is **superseded** by this thread's 33/33/34-blame + already-Controversial-lifetime-ban rule (POST 88–92). Which is canonical — was #199 a *later* re-revision, or does this 2022 final stand? (This thread is older than `fixes`, so likely `fixes`/#199 is the newer word — but the digest text in #199 says "already implemented in the 2022 forum game," which is THIS game; needs a human call.)
- **Top-Four auto-confirm exemption:** confirm the final list is **State/Defense/Treasury/War** (a/k/a War=Defense) — Ted writes "State, Defense, Treasury, War" (POST 82) which double-lists the war post; AG is the *cross-party-cap* Top-Four (POST 40) but NOT in the always-vote Top-Four. The two "Top-Four" sets differ — flag.
- **Auto-confirm as a toggle:** V declined to make it optional pre-release; Ted wants everything toggleable. Roadmap should decide whether confirmation-mode is a game option.
