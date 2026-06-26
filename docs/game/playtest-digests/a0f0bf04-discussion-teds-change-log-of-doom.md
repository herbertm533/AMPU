# Digest — `a0f0bf04` "Discussion: Ted's Change Log of Doom"

> **Final committed thread-digest. DISCUSSION thread (rule-decision log), not a
> playtest.** 7 chunks / 408 posts / 319k chars (single-pass reduce — a
> decision-log catalog, chronological by Ted's section-by-section review pass).
> Citations are `===== POST n =====` markers. Raw chunks are
> gitignored/disposable; **this digest is the durable record.** This is the
> **SECOND DISCUSSION-thread ingest (batch 12b)** in the KB — the **designer's
> authoritative rule-decision channel**, opened by @MrPotatoTed in Sept 2024:
> *"This thread is where you can provide any feedback on the items I've listed
> in the Change Log of Doom thread. … At some point, I have to make a final
> decision … as we move forward to set our programmers up for success."* (POST 1).
>
> **★ Headline:** This is **Ted's section-by-section official-rulebook
> rewrite/cleanup pass**, run chronologically from phase 2.1 → 2.6 between
> Sept 2024 and Mar 2025, with a long pause then a resumption Oct 2025 on
> Lingering script details. Ted floats a draft change, the
> regulars (@Arkansas Progressive, @ebrk85, @vcczar, @matthewyoung123,
> @Umbrella, @10centjimmy) push back or refine, Ted issues a final ruling, and
> writes it to the canonical rules doc. **The ~25 Ted final-rulings here
> RESOLVE or NEW-LAND many open questions in the gap log** — most of which had
> been logged from PLAYTEST digests as unresolved. **★ Notably ABSENT from this
> thread (despite pass 12a's checklist):** the relocation-cap-4 ruling, the
> amendments-not-SCOTUS-challengeable rule, the Civil Rights Act
> not-repealable decision, Orange's 5%/faction-max death formula, and the
> generated-pol-for-uncontested-races rule — those were finalized in the
> companion `cf82a7d3` "small low priority changes" bug thread, NOT this
> change-log thread. The two discussion threads have **complementary scopes**:
> 12a is "small bugs + rule clarifications adjudicated case-by-case in the
> course of running a playtest"; 12b (this) is "Ted's intentional, systematic
> section-by-section rule-doc cleanup pass with all stakeholders in the room."
>
> **★ Disposition:** This thread is the **canonical source for Ted-finalized
> rule patches that landed in the official rules doc** between Sept 2024 and
> Mar 2025 — and a SECOND batch of late-Oct 2025 Lingering-script
> clarifications. Treat its rulings as **AUTHORITATIVE**: they override GA
> rulings from playtest digests where they conflict (with the user's final
> review-gate decisions as the absolute top). Many rulings settle long-standing
> open forks (career-track conversions, kingmaker→protégé trait inheritance,
> retirement-rate fixes by era, the famous "Pres uses Command for blunder
> mods" two-step rule, Mil-Prep meter level 4 fix, etc.).

---

## §0. Thread metadata

- **Title:** "Discussion: Ted's Change Log of Doom" (forum topic 5721,
  politicslounge), **Sept 18 2024 → Oct 27 2025** (latest post 408). Started
  by **@MrPotatoTed** as the official feedback channel for the parallel
  "Change Log of Doom" thread (not this one — the change log itself is a
  separate thread of Ted's enumerated proposed changes).
- **Participants:** ~15 distinct usernames, but the **rules-rewrite core** is
  **@MrPotatoTed ("Ted"; rules steward / sub-designer)**,
  **@Arkansas Progressive ("Ark"; dataset co-maintainer + rules co-author)**,
  **@ebrk85 ("Eric"; multi-playtest GM)**, **@vcczar ("V" / "Vee"; primary
  designer)**, **@matthewyoung123 ("Matt"; multi-playtest GM)**, **@Umbrella
  (CPU-rules experimenter / coder-side voice)**, **@10centjimmy (player)**,
  **@Bushwa777 ("Bushwa" / "Imperator Taco Cat"; 1772 playtest GM)**,
  **@Saucialiste**, **@Pius XIII**, **@Vee01**, **@Lars**, **@Largo833**,
  **@Nikk**.
- **Style:** **Section-by-section sequential review** of the rules doc
  starting at phase 2.1 (drafts, ideology shifts, conversions, kingmaker) →
  2.2 (leadership, faction leaders) → 2.3 (presidential appointments) → 2.4
  (death + retirement + AnytimeEvos) → 2.5 (Lingering) → 2.6 (legislation)
  → 2.9.8 (continental congress) → 2.10 (yearly cleanup). Each section gets
  a Ted draft + 5-15 reply posts of pushback/refinement + a Ted final ruling
  + Ted writing it to the rules doc. The thread STOPS at phase 2.6 (Mar
  2025), then **resumes Oct 2025 on a Lingering script clarification by
  Ark** building a Python implementation.
- **Authority:** **THE most authoritative source for current rule wording in
  the entire forum corpus** — Ted explicitly states (POST 1) that this is
  the channel through which the official rules doc gets updated; throughout
  the thread Ted posts "Incorporated, thanks!" and "Updated the rules doc"
  acknowledgments after each ruling.
- **Critical context — Anthony coded ALONGSIDE this thread:** the build's
  programmer ("Anthony") was actively coding sections during the discussion.
  Several posts explicitly time-box rulings ("Anthony processed Era Evos
  yesterday — better make a decision today on this," POST 358; "before
  Anthony codes this, can we settle…," POST 290+). **This means rulings here
  are PROBABLY THE LATEST shipped-design-intent the build's programmer was
  targeting — a strong signal these rulings should be reflected in the
  current ruleset and the shipped build's behavior matched against them.**

---

## §1. What this thread is

This is **the designer's authoritative rule-decision pipeline**, NOT a playtest.
@MrPotatoTed opens it as the FEEDBACK CHANNEL for his parallel "Change Log of
Doom" thread (where he posts the actual enumerated rule-change proposals he's
considering). Players debate each proposal here, then Ted issues a final
ruling and writes it to the canonical rules doc. The thread is structured as
a **sequential phase-by-phase review pass** — Ted works through the rulebook
sections in order from 2.1 through 2.6 over 6 months, with each section
getting a small batch of proposed changes and resolutions.

**For the build:** this thread is the most current statement of what the
ruleset IS. Where this thread CONFLICTS with a playtest digest's GA ruling
(e.g. a `tea1772` GA call), this thread's ruling supersedes — the GA
rulings were case-by-case adjudication for a single playtest; this thread is
the canonical rewrite.

---

## §2. Timeline of design decisions — chronological table

Each row: the phase being reviewed / the topic / Ted's proposal /
community response / final ruling / status. **RULED** = Ted issued a final
decision + wrote to rules doc; **OPEN** = Ted left it open for further input
at thread end; **SUPERSEDED** = a later ruling overrode it.

### §2a. Phase 2.1 — Draft, ideology shifts, conversions (Sept-Oct 2024, POST 1-55)

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 9/18 | **Cabinet → lobby/enthusiasm REWORK** (★ NEW major rework) | Ted: 1) Lobby satisfaction gives **bonus POINTS** (to Pres + factions w/ matching lobbies) instead of enthusiasm. 2) **Ideology composition** drives enthusiasm — ≥50% cabinet of an ideology = +enth that ideology; ≤20% = −enth | Mixed support; Matt (POST 4) suggests roll-gated (e.g. Big-4 33%, others 25%) + the **3-shift-per-half-term cap** must stay | **RULED** (POST 1 + subsequent threads) — adopted in concept; specific percentages TBD; cap stays at 3 shifts/half-term | **RULED** | 1-4 |
| 9/18 | **CL #7 — random skill on draft** | Player picks the rookie's gained skill, including a 1/6 Command chance | 10centjimmy + Eric: prefer random; Ted: agrees, but **REMOVE the 1/6 Command chance** — "Presidents should come from somewhere" | **RULED — random skill gain, NO Command from this source.** | **RULED** | 5-7, 47 |
| 9/18 | **Can-Party-Flip draftees** | Old: both parties have 50% chance to draft (rule was buggy/contradicted itself) | Eric (POST 8): keep weighted to IRL party; Ted concedes was buggy | **RULED — REMOVED cross-party draft. Politicians always enter at their historically accurate party at age 25. Can party-flip later via 2.1.6.** | **RULED** | 8, 10, 48 |
| 9/19 | **Overeager / Late Bloomer traits removal** | Ted: remove (block player moves; nobody uses) | Universal agreement | **RULED — REMOVED both traits** | **RULED** | 14, 20, 23 |
| 9/19 | **★ LW-Pop ↔ RW-Pop ideology shift (the IDEOLOGY-IS-A-CIRCLE rule)** | Vee01 (POST 18): allow LW↔RW Pop shifts before Era of Nationalism — "blurry, Andrew Jackson could be either" | vcczar (POST 24): YES, **"all ideologies are now a CIRCLE, rather than a line"** — but make difficult (Bernie shouldn't → Trump easily); 10centjimmy: Integrity blocks at 10% + Puritan blocks at 0% will handle outliers; Euri (POST 28): **add Two-Faced automatically on the flip as a penalty** | **RULED — 25% base chance for the cross-circle LW↔RW Pop shift (vs 50% for other shifts), Two-Faced on flip.** This is **the canonical statement of the "ideology is a circle" rule (corroborates gap #99).** | **RULED** | 18-31, 51 |
| 9/22 | **Political conversion rates** | Eric (POST 34): 75% is way too high in modern eras for can-party-flip pols; Ted: 25% is too low (only 30% of pols qualify in cross-eligibility) | Compromise 33%, Matt agrees | **RULED — 33% conversion rate; removed special-Moderates rule.** | **RULED** | 34-39, 52 |
| 9/23 | **★ Same-party conversion adjacency (the ADJACENT-IDEOLOGY-CAN-CONVERT rule)** | Matt (POST 38): allow same-party conversion targets to be **same OR ADJACENT** ideology — was same-only (too restrictive, "same few pols always targeted") | Universal support | **RULED — adjacent ideology now eligible for same-party conversion.** Refines #76 (CPU conversion) + #99 (circle). | **RULED** | 38, 53 |
| 9/26 | **CPU draft kingmaker fix** | Umbrella (POST 40): CPU draft sometimes lands a kingmaker without a matching-ideology protégé pool; current rules don't have CPU try to shift the kingmaker | Ted: agreed | **RULED — 100% chance CPU Kingmaker w/ no protégé attempts to shift Kingmaker to a random potential-protégé's ideology if 1-step possible.** | **RULED** | 40-41, 54 |
| 10/3 | **Faction-leader random rookie alt-state/trait grants** | Ted: reduce from 5 → 1 per draft (CL #8/9/10) | Matt + Eric: 5→1 is 80% reduction, too steep; tie to draft size | **RULED — COMPROMISE at 3 random traits + 3 random alt-states per draft** | **RULED** | 15, 22, 50 |

### §2b. Phase 2.1.7 — Kingmaker trait inheritance (Oct, POST 42-45, 109-110)

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 9/19 | **★ Kingmaker→protégé GRADUAL trait transfer (★ NEW major rework — DROPPED)** | Ted proposed (POST 42): on Kingmaker-Protégé pairing, protégé gets ONE random thing immediately, then ONE more per 2-yr turn — slow burn instead of instant jackpot | Mixed; concerns: Kingmaker w/ few traits = "better"? could be a lot of cumulative gain over time | **DROPPED** ("solving a problem that maybe doesn't exist") | **SUPERSEDED — Ted didn't proceed** | 42-45 |
| 10/23 | **Kingmaker passable traits — Celebrity / Hale / Flip-flopper / Kingmaker** | Eric (POST 201): these 4 aren't on the not-allowed list but seem they should be (Frail + Two-Faced ARE blocked) | Ted (POST 203): defends keeping all 4; Euri (POST 281) strongly disagrees on Kingmaker; consensus shifts | **RULED — Kingmaker can be passed but Master/National Kingmaker cannot; Hale can be passed but Frail cannot; Flip-Flopper blocked; Celebrity can be passed.** Ted's stated reasoning: "Master Kingmaker is OP enough that it can't be passed; Hale represents lifestyle teaching, Frail represents cancer you can't teach." Euri rebuts (POST 282): "no political Kingmaker is gonna take their time getting their protégé off smoking" | **RULED** | 201-208, 279-283 |
| 10/11 | **Former Speakers/PPT/Senators/Pres/VP/Justices regaining protégé** | Ark (POST 109): can they regain protégé after leaving office? | Ted (POST 110): "doesn't automatically reconnect, but can be re-created during protégé phase" | **RULED — manual re-create allowed; no auto-reconnect** | **RULED** | 109-110 |
| 12/16 | **★ Kingmaker vs Master Kingmaker bonus scope** | Matt: bonus +1 is state-only (Kingmaker) OR national-only (Master), pick one. Eric: same +1 stacks (Kingmaker = +1 in state; Master = +1 in state AND +1 national) | **Ted (POST 316) RULED**: **basic Kingmaker = +1 in own state only (including state's Pres primary + state's general); Master = +1 in EVERY state (all Pres primaries + all generals).** Matt's "state OR national" reading WRONG; the bonus DOES extend to Master | **RULED** | 302-320 |

### §2c. Phase 2.2 — Leadership pipeline (Oct, POST 56-78)

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 9/30 | **★ 50/50 House split — majority determination** | Ted considers options: random / Westminster-style (former-Maj stays) / Speakership-by-whole-House | Discussion: Saucialiste, 10centjimmy, Ark; multiple options floated | **RULED — leadership of a tied House goes to the party NOT in control of the Senate.** "Best represents the kind of compromises that would need to be made within a 50/50 House" (POST 65). | **RULED** | 56-65 |
| 10/1 | **Passive politicians blocked as faction leaders** | Ted: change 25% chance Passive disqualifies → 100% (exception: elected Presidents always become FL) | Universal support; Eric jokes "this feels targeted against a President Oprah" | **RULED — Passive 100% blocks FL eligibility (except elected Pres)** | **RULED** | 62 |
| 10/3 | **Faction-leader gain traits — remove negatives** | Ted's "small fixes" thread proposal (POST 73): remove Uncharismatic / Incoherent / Passive / Predictable / Pliable / Easily Overwhelmed from FL trait gains | Mixed — Eric (POST 70) likes the randomness; community split | **RULED — compromise: 5% chance positive trait, 3% chance negative trait; first-time-as-FL only for negatives.** Refines pass-12a's #4 (cf82a7d3 §5a #4 was "MOSTLY ADOPTED" - here the final percentages are pinned) | **RULED** | 67-79 |
| 10/3 | **Crisis trait consolidation (3 → 1 or 2)** | Ted proposes merging Crisis Manager / Crisis Admin / Crisis Gov into **a single Crisis Manager trait** usable by anyone in any crisis-fixing role | vcczar (POST 78) worried about super-pols; Matt (POST 79) proposes Crisis Manager + Master Crisis Manager tier; Saucialiste suggests Problem Solver + Crisis Manager | **OPEN — TENDING TOWARD CONSOLIDATION** (Crisis Manager + Crisis Gov as a tier; vcczar will consider). NOT YET FINALIZED. | **OPEN** | 73, 77-87 |

### §2d. Phase 2.4 — Death + retirement + AnytimeEvos (Oct-Nov 2024, POST 89-275)

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 10/9 | **★ Death+retirement rate by era** | Ted flags 4 issues: (1) FLs can't retire, live to 100; (2) ex-Presidents live forever (retirement gates death); (3) 60-70 retirements too frequent in modern; (4) Pres implementation roll — Command or Admin? | Long debate; Matt (POST 90): FLs SHOULD die/retire normally, ex-Pres deaths should fire on retirement-roll-hits; Eric (POST 93) office-holder vs non-office-holder distinction; Ark (POST 95): just apply death-roll percentages to retirements | **MULTI-PART RULING:** (a) FLs DO retire/die normally; (b) **retired ex-Presidents do NOT roll for retirement, only for death** (POST 396 cements this — the final ruling); (c) **5%-of-faction-max retirement rate retained** (era-scaled percentages — the cf82a7d3 thread tracks this Orange-proposed rule too); (d) 60-65 retirements only at near-0% in modern era, scaling toward 80; (e) **cabinet members retire at END of half-term, not immediately on appointment**. The 5% rule **CORROBORATES cf82a7d3** (pass 12a checklist #4 - Orange's formula). | **RULED** | 89-100, 195-197, 396 |
| 10/9 | **★ Hale trait — death rules** | Bushwa (POST 137): Hale + 0% death = live forever; Ark (POST 138): Hale doesn't void retire-leaves-game | Ted (POST 143): simplest path — **RESTORE original rule: Hale = 1/2 the chance of death**. Matt (POST 144): roll Frail first, then Hale, then normies oldest to youngest. Ted (POST 148): **Death rolls — Frail rolled first; retirement rolls oldest to youngest regardless of trait** | **RULED — Hale = HALF the death chance; death-roll order is Frail-first then oldest-to-youngest; retirement-roll order is oldest-to-youngest (no Frail priority).** Hand-rolled details to Matt's "fill up the Frail % first" method (POST 151). | **RULED** | 137-148, 150-151 |
| 10/14 | **Auto-retire at 100** | Bushwa: didn't know this rule existed | Confirmed: **2.10 — pols auto-retire at 100 at the beginning of an election cycle** | **RULED — confirmed; was already in rules** | **RULED (preexisting)** | 178-184 |
| 10/10 | **President / VP retirement-eligible at age** | Ted: should Pres + VP be able to retire (announce non-re-election) at 60+? | Saucialiste, vcczar OK with it; only IF after their elected term completes | **RULED — Yes, Pres + VP can hit retirement rolls 60+, but it's "won't run for re-election" not instant; they finish elected term first.** Refines the auto-retire rule. | **RULED** | 105-108, 169-172 |
| 11/5 | **AnytimeEvo command-grant tightening** | Ted: events giving +1 Command to random pol w/ Manipulative/Leadership/Charisma should restrict targets to a **random Rep/Senator/Gov/Cabinet member** (not random anyone) | vcczar (POST 250) wants list-before-change-for-review; Ark/Eric OK | **RULED — tightened the random-target events to Rep/Sen/Gov/Cabinet only.** AnytimeEvo events 5, 17, 23, 24, 25, 39, 66, 117, 118, 119 explicitly modified (POST 255, 271). | **RULED** | 249-275 |
| 11/5 | **Assassination attempt target** | Ted: was any pol; proposed 50% Pres / 50% random Rep/Sen/Gov/Cabinet | Matt jokes "50% Pres / 50% other 9 faction leaders" — Ted intrigued | **RULED — 50% Pres / 25% random Rep/Senator / 25% random faction leader.** (POST 267) | **RULED** | 255, 258, 264-267 |
| 11/5 | **Natural disaster state-eligibility lists** | Ted: drought list wrong (CA missing!); proposed fixes via real-world data | vcczar (POST 258): keep disaster lists tied to **historical disaster-prone states** w/ off-chances allowed; veto on adding MA/RI to hurricane list | **RULED — drought list updated per CA/etc; hurricanes restricted (GA added but MA/RI rejected); earthquakes unchanged; major-flood allowed any state (Arizona+Nevada explicitly OK per real-world data).** No alt-state coverage. | **RULED** | 255-275 |
| 11/15 | **★ Integrity pol cannot nominate Controversial** (NEW rule) | Umbrella (POST 276): contradiction in rules — Integrity chair nominates Controversial → Integrity overrides → chair votes against own nominee | Ted (POST 277): **"Integrity folks probably shouldn't be able to nominate controversials" — agreed.** | **RULED — Integrity pol cannot nominate a Controversial appointee.** | **RULED** | 276-278 |
| 11/15 | **Confirmation threshold = 60% of TOTAL states (CC era)** | Umbrella (POST 276): rule ambiguous — 60% of states (8) OR 60% of delegates per state? | Ted (POST 277): **"60% of the total states"** | **RULED — 60% of total states (8 of 13 in pre-Constitution Continental Congress)** | **RULED** | 276-277 |

### §2e. Phase 2.5 — Lingering / Gov Actions / SCOTUS (Nov 2024-Feb 2025, POST 246-410)

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 11/2 | **Challenge Legislation Gov Action — can it challenge a REPEAL?** | Eric (POST 246): if Gov challenges a repeal, what's the SCOTUS ruling on (the now-gone-law)? | Ted asked ChatGPT (POST 247): no real-world precedent for SCOTUS overturning a repeal | **RULED — NO, Gov Challenge Legislation cannot target a repeal-bill.** ("We just don't allow it. There isn't a direct real world example we can cite," POST 248.) **NEW — this is a NEW rule, not in any earlier digest.** | **RULED** | 246-248 |
| 10/15 | **★★ Pres implementation/blunder rolls — the 2-step Admin-then-Command rule** | 10centjimmy (POST 159): Command or Admin for Pres impl rolls? Ted publishes the **canonical 2-step rule** (POST 163): **Step 1 — Pres rolls Admin for implementation, just like cabinet.** **Step 2 (Blunder check) — Pres COMMAND scales the blunder roll:** Cmd 5 = avoid blunder; Cmd 4 = 50% avoid; Cmd 3 = +1 to blunder; Cmd 2 = 50% chance +1; Cmd 1 = blunder normal; no Cmd / no expertise = −2 to blunder (unless Efficient on impl team); Incompetent = −3. Easily Overwhelmed skips step 2 entirely. | 10centjimmy (POST 164): "happy to announce I'm perfectly satisfied with this set of rules" | **★ RULED — the canonical hybrid Admin-roll-then-Command-modifies-blunder rule.** Resolves the cf82a7d3 §5a #3 ruling (the hybrid Pres-uses-Command for blunder impact). **This is the AUTHORITATIVE wording of that rule** (more specific than the cf82a7d3 thread captured). | **RULED** | 159-164 |
| 12/6 | **★ Mil-Prep meter level 4 fix (★ pass 12a checklist #7)** | Largo833 (POST 290): Mil-Prep level 4 "40% / 60% / 100%" adds to 200% — broken | Multi-way debate; Umbrella (POST 322): **proposed 30/40/30/0 (the cf82a7d3 thread also proposed 30/40/30 - POST 579 in that thread); Eric (POST 297): proposed 30/60/10 (also +5 was a typo for 10). Nikk (POST 297): 40/50/10** | **OPEN — Ted said "I did fix that in one of my playthroughs. I'll go back and take a look at what I did" (POST 294), then "Oh wait, that isn't better" (POST 296). No final ruling reached here.** **CROSS-REF: cf82a7d3 POST 579 proposed 30/40/30; this thread reaches the same proposal independently but does NOT close it.** | **OPEN** | 290-301, 322 |
| 2/18 | **Postmaster General appointment committee** | Largo833 (POST 352): rules don't state which committee chair appoints PMG in CC era | Ark (POST 353): **Domestic Committee, same as 2.3** | **RULED — Domestic Committee chair appoints PMG in CC era** | **RULED** | 352-355 |
| 2/19 | **Term-limit Gov actions in Era of Independence** | Umbrella: CPU ran term-limit Gov action → state ran out of candidates ("only senate creation gates," but senate doesn't exist until Federalism) | Eric (POST 363): 2.5.2 explicitly: "*Prior to the creation of a US Senate, or if the Senate is abolished, this requirement is void*"; Ark (POST 357): preferred to MOVE the term-limit actions to Era of Federalism start | **OPEN — Ted didn't rule.** Two paths flagged but no final selection. (Bushwa POST 367 reports they hit this same problem in Virginia 1818.) | **OPEN** | 356-367 |
| 3/4 | **★ Faithless electors mechanic — reworded** | Vee01 (POST 371) complains the rule doesn't track ("electors are chosen by state party not state at large"); Matt (POST 372) supplies the canonical 2-condition rule. Eric (POST 374): rewording suggested — "**if state won by candidate that has the LEAST PREFERRED ideology of the state.**" Ark: "+3 for the other party" | **OPEN — community agreed the rule is "wonky"; Ted didn't post a final ruling.** Faithless-elector rule wording remains as-is. | **OPEN** | 371-376 |
| 3/27 | **Chief Justice CPU selection** | Umbrella (POST 387): no CPU rules for CJ selection | Ark (POST 388): **highest Judicial ability from their party → multi-faction ties broken by own faction → Pres-ideology match → lowest-scoring faction; multi-candidate ties → matching-appointer-ideology → random** | **RULED — explicit CPU CJ selection rule.** Sharpens #52 (SCOTUS subsystem). | **RULED** | 387-390 |
| 4/1 | **★ Party rename — who triggers it?** | Vee01 (POST 391): proposed era of independence party names be "Pro-Administration" / "Anti-Administration"; Ark (POST 393): Republicans / Federalists 25%-per-half-term to fire 1800-1820. Matt (POST 394): PARTY LEADERS should rename parties, like factions have nicknames | Ark (POST 395): hashed-out in a separate party thread; no resolution; ERA EVOS are currently the play | **OPEN — no official solution. ERA EVOS continue as the rename trigger.** Matt's PL-as-renamer proposal NOT adopted. Refines #40 (faction nicknames + party rename). | **OPEN** | 391-395 |
| 4/1 | **VP-on-resignation must come from same party (relaxation?)** | Vee01 (POST 362): if VP resigns/dies you should be able to appoint VP from other party (for roleplay) | No follow-up | **OPEN** | **OPEN** | 362 |

### §2f. Phase 2.6 — Legislation (Nov-Dec 2024, late-thread)

Coverage of phase 2.6 is THIN in this thread; Ted explicitly says "diving into 2.6 next" (POST 289) but the section is short. Notable:

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 12/5 | **★ Pres signature step moved to 2.6 (from 2.10)** | Ark (POST 124): move Pres signature from 2.10 → 2.6 so military bills affect the meter BEFORE 2.7 Military Action phase | Ted (POST 126): "Definitely agree" | **RULED — Pres signature lives in 2.6** | **RULED** | 124-126 |
| 12/5 | **Date advance moved to before 2.9.1 (from 2.10)** | Matt (POST 127): if year doesn't advance pre-election, eligible 30-yr-olds show as 28; need to advance pre-election | Ted: agree, just need to check it doesn't break anything | **TENTATIVE — RULED in concept, Ted needs to verify no downstream breakage.** | **RULED (tentative)** | 120-128 |

### §2g. Phase 2.9.5-2.9.8 — Other elections + Universal Election Modifier (Oct 2024, POST 222-244)

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 10/25 | **★ First Continental Congress appointment rules (re-discovered + re-authored)** | Ted (POST 222): "Turns out we actually have no rules for appointing the First Continental Congress" — re-authoring 2.9.5-2.9.8. **CC representation per state: Big states (PA/MA/VA/MD) = 4 spots; medium = 3; small (GA/RI/DE/NH) = 2.** Faction with most pols from a state picks delegates pre-DoI; gov appoints post-DoI. | Umbrella (POST 235): clarify the no-governor-yet case in 2.9.8 too | **RULED — formalized CC composition + appointment rules.** The 1st CC = pre-DoI (faction-with-most-pols-in-state picks); 2nd CC = post-DoI (Gov picks). Confirms #92 (era band transitions) + #115 (scenario-boot procedure). | **RULED** | 211, 217-236 |
| 10/28 | **★★ Universal Election Modifier (NEW ★ major mechanic)** | Ted (POST 222): proposed a **Universal Election Modifier** common framework for ALL elections at all levels in all eras (primaries + generals), with: **+1 modifiers** (Puritan-in-primary / highest skill / most expertise / Celebrity / Charisma / Debate / Efficient / Leadership / Likable / Manipulative / Military Leader / Orator / Propagandist / Teflon / Everyman / Crisis Management) and **-1 modifiers** (under-40 / over-75 / Easily Overwhelmed / Pliable / Puritan-in-general / Controversial / Uncharismatic / Unlikable / Egghead / Incoherent / Incompetent / Obscure / Flip-Flopper/Two-Faced / Passive / lowest skill-primaries / fewest expertise-primaries / racial minority / woman / openly LGBT — until first-of-each-elected at that level) | Matt (POST 225): would stack to +4 (too powerful); Ark (POST 226): yes stacking is intended; Eric: 67% (not 60%) down-ballot bonus already exists; Saucialiste (POST 231): age modifiers should be era-keyed (drop for House post-Progressive) | **OPEN — proposed but NOT FINALIZED.** Ted floated it; community pushed back on stacking + age modifiers; **Ted didn't issue a final ruling.** This is a major **NEW design proposal that the build should NOT implement until finalized.** | **OPEN** | 222-241 |

### §2h. Phase 2.5 Lingering script — late-Oct 2025 resumption (POST 397-408)

The thread resumes Oct 2025 after a long pause, with Ark working on a Python implementation of the Lingering phase.

| Date | Topic | Proposal | Community response | Final ruling | Status | POST |
|---|---|---|---|---|---|---|
| 10/27 | **Tax/Tariff Volatility ordering vs Decay** | Ark (POST 397): "Volatility and tax decay are after lingering effects two steps before — ass-backwards. Skipping until clarified." | Ted (POST 404-405): follow the steps in order — never re-do. The decay impacts the NEXT 2-yr cycle, not the current one. | **RULED — Lingering follows steps 1→7 strictly in order; volatility rolls at step 7 are for THAT PHASE ONLY (not added to running totals); tax/tariff decay adjustments propagate forward across half-terms (step 3 in future phases).** Clarifies the ~9-part Lingering resolution (#67). | **RULED** | 397-408 |

---

## §3. Decisions that RESOLVE existing open questions / Decision-gated items

This is **the highest-value subsection** — the existing gap log entries that
this thread RESOLVES (closing OPEN questions, removing items from
Decision-gated, or settling forks).

| Gap / OPEN Q | What the gap was | Ted's ruling here | Resolution |
|---|---|---|---|
| **#99 (ideology-circle) RULE-SPECIFIC** | Was previously corroborated from `rep1800` + `nuke`; here Ted ANNOUNCES the rule + sets the cross-circle shift rate to **25% (vs 50% for normal shifts)** + **Two-Faced applied on flip**. (POST 24, 28-29, 51.) | **RESOLVED — canonical 25% LW↔RW Pop shift rate, Two-Faced applied on success.** | The gap row stays (the build doesn't have a circular ideology), but the SHIFT RATE for the cross-circle case is now pinned. |
| **#76 (CPU conversion) — same-party adjacency** | Existing gap had "targets must be Pliable AND same-or-adjacent ideology"; here Ted EXPLICITLY ADDS adjacency for SAME-PARTY conversions, not just inter-party. (POST 38, 53.) | **RESOLVED — same-party conversions allow adjacent-ideology targets too.** | Refines #76 gap row. |
| **cf82a7d3 §5a #3 (Pres uses Command for blunder impact)** — was "HYBRID ADOPTED" but wording fuzzy | The cf82a7d3 thread captured the hybrid in concept; **THIS thread publishes the authoritative 5-tier table (Cmd 5 / 4 / 3 / 2 / 1 / no-Cmd) + Easily-Overwhelmed-skips-step-2 + Incompetent-3.** (POST 163.) | **★ RESOLVED with FULL WORDING — the canonical 2-step Admin-then-Command-modifies-blunder rule.** | This is the rule the build needs to implement. **Supersedes the cf82a7d3 #5a #3 placeholder wording.** |
| **#18 (meters → election state-scope)** — OPEN at end of pass 12a | `dem1820` showed a GA-vs-designer FORK (Ted "every state" vs vcczar "ideology-leaning only" vs Matt "primaries only"); `arkzag` resolved it for ENTHUSIASM-SHIFT (matches `drums`'s 4-step rule) but the STATE-SCOPE of the per-ideology bonus stayed open | **★ NOT directly settled in this thread.** Ted's proposed Universal Election Modifier (POST 222) would attach the bonuses CANDIDATE-level (not state-level) — but this proposal is OPEN. So #18 stays OPEN. | **NO CHANGE — #18 remains OPEN.** |
| **#52 (player-controlled SCOTUS)** — fork between `pop` (vcczar disabled, POST 479-480) and `dem1820` (player-controlled delay/dismiss, POST 420-443) | This thread doesn't touch player-vs-CPU SCOTUS control. | **NOT touched. #52 remains UNSETTLED** | **NO CHANGE — #52 remains OPEN.** |
| **Delegate-class fork** (from `arkzag` ch3 POST 276 — Zagnut moved class assignment to AI-AUTO; Ted held rigging is INTENDED, POST 286) | Convention delegate-class assignment: AI-AUTO with EV×category formula vs human-set | **NOT touched in this thread.** | **NO CHANGE — fork remains UNSETTLED.** |
| **DH-25 / DH-56 (career-track election eligibility)** | Tyler's 2.1.2 citation in cf82a7d3 (POST 156) said CT pols CAN'T be in elections; build needs ONE coherent rule | This thread didn't address. | **NO CHANGE — DH-25 remains.** |
| **Faction-leader trait-gain pruning (cf82a7d3 §5a #4 — was MOSTLY ADOPTED)** | cf82a7d3 had "Passive dropped from leader gains; others kept" | **THIS thread settles the rates:** **5% positive trait + 3% negative trait, first-time-as-FL only for negatives.** (POST 79.) | **★ RESOLVED with numeric specifics.** Refines cf82a7d3 §5a #4. |
| **Kingmaker→Master Kingmaker bonus scope** (community-wide ambiguity, see playtests) | Stack? Override? Per-state vs national? | **RULED:** Kingmaker = +1 in own state (incl. state's Pres primary + state's general); Master = +1 in EVERY state. (POST 316.) | **★ RESOLVED.** |
| **Hale + retirement-roll vs death-roll** (Bushwa's John Adams immortality issue) | Hale was 0% death, Hale couldn't retire if already ex-Pres → immortal | **RULED:** **Restore original rule — Hale = 1/2 chance of death; retired ex-Presidents ONLY roll for death (not retirement); Frail rolled first, then oldest-to-youngest.** (POST 143, 148, 396.) | **★ RESOLVED.** |
| **Death+retirement rate by era** | cf82a7d3 had Orange's 5%-of-faction-max formula; rate needed era-keying | **RULED:** 5% rate retained; era-scaled retirement %s (60-65 near-0% in modern, scaling to 80); cabinet members retire at END of half-term not on appointment. | **★ RESOLVED.** Corroborates cf82a7d3 #4 checklist item. |
| **Mil-Prep meter level 4 (★ cf82a7d3 checklist #7)** | cf82a7d3 POST 579 proposed 30/40/30 | This thread independently re-discovers the bug (POST 290) + proposes 30/40/30 (Umbrella POST 322) + 30/60/10 (Eric POST 297) + 40/50/10 (Nikk POST 300) but **NO TED RULING.** | **NOT RESOLVED — Ted said "I'll check what I did" then "wasn't better" (POST 296). OPEN.** |
| **Civil Rights Act of 1964 not repealable (★ cf82a7d3 checklist #8)** | cf82a7d3 had it as "intentional, not fix-needed" | **NOT touched in this thread.** | **NO CHANGE.** |
| **Generated-pol-for-uncontested-races (★ cf82a7d3 checklist #5)** | cf82a7d3 had Orange's compromise proposal (POST 178) | **NOT touched in this thread.** | **NO CHANGE — OPEN.** |
| **Relocation-cap=4 (★ cf82a7d3 checklist #1, the QW0/BUG-0 question)** | cf82a7d3 POST 734-735 settled this 12-30-25 ("Approved by vczar 12-30-25") | **NOT touched in this thread.** The change-log channel was the cf82a7d3 bug thread for this one, NOT this discussion thread. | **NO CHANGE — already RESOLVED via cf82a7d3.** |
| **Amendments NOT SCOTUS-challengeable (★ cf82a7d3 checklist #3)** | cf82a7d3 POST 250-269 was the source | **NOT touched in this thread.** | **NO CHANGE — already RESOLVED via cf82a7d3.** |

---

## §4. Decisions that SUPERSEDE prior rules (Ted's calls override earlier GA decisions)

This thread is **THE authoritative rule channel**, so any of its rulings
override GA case-rulings from playtest digests.

| Prior ruling (digest / GA) | Ted's ruling here | Effect |
|---|---|---|
| Many playtest digests assumed Kingmaker bonus is "+1 in state for Kingmaker / +1 nationally for Master Kingmaker, EXCLUSIVELY" (Matt's reading; the way `nuke`/`pop` etc. operated) | **Ted: basic Kingmaker = +1 in own state (incl. state's Pres primary + state's general); Master = +1 in EVERY state (all Pres primaries + all generals).** Master GETS the same +1 in own state PLUS in every other state. | **SUPERSEDES** Matt's "either-or" reading. Future digest-rule applications should use Ted's expanded reading. |
| Various GMs ran ex-President death/retirement differently (some let retirement-rolls hit ex-Pres; some had Hale immortal) | **Ted: retired ex-Presidents ONLY roll for death (not retirement); Hale = 1/2 death chance.** (POST 396.) | **SUPERSEDES** the playtest-by-playtest GA improvisation. |
| Various playtests had inconsistent Mil-Prep level 4 treatment (Matt's 2-roll approach; Eric's 30/60/10 reading) | **Ted DID NOT issue a final ruling** — the bug is acknowledged but unresolved here. | **NO SUPERSESSION — open.** |
| `dem1820` had GA "strip Command from ≤40 boot pols" house rule (POST 82) — UNDOCUMENTED | This thread doesn't touch boot-procedure. | **NO SUPERSESSION.** |
| `tea1772` GA ruling: SCOTUS can overturn an Amendment (#100) | This thread doesn't touch amendment-SCOTUS. cf82a7d3 thread DOES (rules updated POST 269 — amendments NOT challengeable). | **NO TOUCH HERE** — but cf82a7d3 supersedes `tea1772`. |
| Earlier reading of `5/5 random traits + 5 random alt-states per draft` (CL #8/9/10) | **Ted: 3 random traits + 3 random alt-states per draft.** (POST 50.) | **SUPERSEDES** all earlier digests' assumptions of 5/5. |
| Earlier ambiguous integrity-nominates-controversial interpretation | **Ted: Integrity pol CANNOT nominate Controversial.** (POST 277.) | **SUPERSEDES** any prior digest's permissive reading. |
| Earlier kingmaker→protégé "all-at-once" trait transfer | Ted PROPOSED gradual but DROPPED. | **NO SUPERSESSION** — all-at-once stays. |
| Earlier RW-Pop ↔ LW-Pop NOT permitted | **Ted: 25% cross-circle shift now allowed (Two-Faced on success).** | **SUPERSEDES** the linear-ideology reading. |
| Earlier same-party conversion restricted to same-ideology | **Ted: same-party conversion now allows adjacent ideology.** | **SUPERSEDES**. |

---

## §5. NEW rules / mechanics introduced in this thread

| Rule | What it is | Status | POST |
|---|---|---|---|
| **★ Cabinet → enthusiasm rework — IDEOLOGY-COMPOSITION drives enthusiasm; LOBBIES drive POINTS (not enthusiasm)** | (1) Lobby satisfaction now gives **bonus points** to Pres + factions with matching lobby cards (was enthusiasm). (2) **Ideology composition** drives enthusiasm — ≥50% cabinet of an ideology = +enth that ideology; ≤20% representation = −enth. Cap of 3 shifts/half-term holds. Big-4 / rest-of-cabinet / cabinet-level might be weighted differently. | **RULED IN CONCEPT, percentages TBD.** Big enough rework that the build's cabinet-enthusiasm logic likely needs a rewrite. | 1-4 |
| **★ Universal Election Modifier (proposed common framework)** | A unified candidate-level +/-1 modifier table covering ALL elections (primaries + generals) at all levels in all eras, with ~17 +1 traits and ~16 -1 modifiers. Includes era-sensitivity for demographic-modifier expiry. | **OPEN — NOT FINALIZED.** Community pushed back on stacking + age modifiers. Major design proposal; build should NOT pre-implement. | 222-241 |
| **Integrity pol CAN'T nominate Controversial** | New rule (was a contradiction in the rules): Integrity-trait nominator + Controversial-trait nominee = the chair votes nay on his own pick. Ted: prohibit the nomination. | **RULED** | 277 |
| **Challenge-Legislation cannot target a REPEAL bill** | Gov Action Challenge-Legislation cannot challenge a repeal — no real-world precedent for SCOTUS overturning a repeal. | **RULED** | 246-248 |
| **Repeal-of-existing-laws scoping for Gov-Action SCOTUS challenge** | If existing law is repealed, Gov Action cannot SCOTUS-challenge — the law is gone. | **RULED** | 246-248 |
| **★ 1st Continental Congress appointment rules — REWRITTEN** | Big states (PA/MA/VA/MD) = 4 spots; medium = 3; small (GA/RI/DE/NH) = 2. Faction-with-most-pols-in-state picks pre-DoI; Gov picks post-DoI. (Rules had been LOST from doc; Ted re-authored.) | **RULED** | 211, 217-236 |
| **Hale = 1/2 death rate (RESTORED)** | Restoration of the original rule; was changed to 0% earlier. | **RULED** | 143 |
| **Frail rolled FIRST in death roll; retirement is oldest-to-youngest** | Death-roll order: Frail-first, then by age; retirement-roll order: oldest-to-youngest regardless of trait. | **RULED** | 148 |
| **Retired ex-Pres ONLY roll for DEATH, not retirement** | Closes the "John Adams immortal" loop. (Cabinet member who's an ex-Pres retires at end of half-term not on appointment.) | **RULED** | 396 |
| **Sept 2024 batch — explicit settlements:** | (Pass 12a cf82a7d3 mentioned these as the Sept 2024 batch but stated they live in the change-log-of-doom THREAD. Here, this thread RESOLVES the specific rules:) | | |
|   • **Random skill on draft — NO Command chance** | | RULED | 7, 47 |
|   • **Can-Party-Flip — no cross-party draft** | | RULED | 8, 10, 48 |
|   • **Remove Overeager / Late Bloomer** | | RULED | 14, 23 |
|   • **LW↔RW Pop shift at 25% + Two-Faced** | | RULED | 18-31, 51 |
|   • **Same-party conversion → adjacent eligible** | | RULED | 38, 53 |
|   • **Conversion rate 75% → 33%** | | RULED | 34-39, 52 |
|   • **5%/3% positive/negative FL trait gain** | | RULED | 79 |
|   • **3 random traits + 3 random alt-states per draft** | | RULED | 50 |
| **AnytimeEvo target-pool tightening** | Many events that previously affected "random pol" now affect only Rep/Sen/Gov/Cabinet. List in POST 255 + 271. | RULED | 255, 271 |
| **Assassination attempt = 50% Pres / 25% random Rep-Sen-Gov-Cabinet / 25% random faction leader** | Was "any politician." | RULED | 267 |
| **Lingering 7-step ordering** | Tax/Tariff Volatility = step 7 (this-phase-only); Decay = propagates forward across half-terms (adjusts step 3 in future phases). Steps run strictly in order, never re-done. | RULED | 397-408 |
| **CPU Chief Justice selection ladder** | Highest Judicial ability → own faction → Pres-ideology match → lowest-scoring faction → matching-appointer-ideology → random. | RULED | 388 |
| **Confirmation threshold (CC era Controversial) = 60% of TOTAL states** | Resolves an ambiguity in the rule. | RULED | 277 |
| **50/50 House split majority = party NOT in control of Senate** | Inverse-control rule. | RULED | 65 |
| **Postmaster General appointment goes through Domestic Committee in CC era** | Resolved an ambiguity. | RULED | 353-355 |
| **President signature step moves to 2.6 (from 2.10)** | So military bills affect Mil-Prep BEFORE 2.7 Military Action. | RULED | 124-126 |
| **Date advance moves to before 2.9.1 (from 2.10) (tentative)** | So 30-year-old eligibility candidates show correct age at primaries. | RULED (tentative) | 120-128 |

---

## §6. Open / still-deciding items at thread end

These rules Ted is mulling but never finalized in this thread. **Each is a
LIVE design hole.**

1. **Mil-Prep meter level 4 fix** — Ted said "I'll check what I did" then "wasn't better." Community has 3 different proposals (30/40/30 / 30/60/10 / 40/50/10). **NOT RESOLVED.**
2. **Universal Election Modifier** — proposed but pushback on stacking + age modifiers; Ted didn't finalize.
3. **Crisis trait consolidation** — Crisis Manager + Crisis Gov as a tier; vcczar "will consider"; not finalized.
4. **Term-limit Gov actions in pre-Senate era** — community split between "void Senator requirement" vs "move to Federalism start"; Ted didn't rule.
5. **Faithless-elector mechanic rewording** — community agrees current wording is "wonky" but Ted didn't post a final ruling.
6. **Party rename trigger — PL vs Era Evo** — Matt proposed Party Leader as the renamer (like factions); Ted didn't adopt; ERA EVOS stay.
7. **VP-must-be-same-party on resignation** — Vee01 proposed relaxation; no follow-up.
8. **Cabinet enthusiasm percentages** — Ted's rework is RULED IN CONCEPT but the actual numbers ("50% / 20%" Big-4 weighting etc.) are TBD.
9. **Whether Big-4 / rest-of-cabinet / cabinet-level get different ideology-enthusiasm weights** — Ted flagged but didn't finalize.

---

## §7. Cross-thread corroborations of the cf82a7d3 bug thread (pass 12a's 8 checklist items)

Pass 12a flagged 8 items to check in this thread:

| # | cf82a7d3 item | Found in `tedchange`? |
|---|---|---|
| 1 | **Relocation-cap-4 ruling (QW0/BUG-0)** — cf82a7d3 POST 734-735 ("Approved by vczar 12-30-25") | **NO** — this thread doesn't touch relocation cap. The change-log-of-doom thread had ALREADY closed its discussion pass by then (Oct 2025 last post is on Lingering); the cf82a7d3 bug thread became the channel for this ruling. |
| 2 | **Sept 2024 Ted batch of 8 proposed rule changes** | **PARTIAL** — this thread is the COMPANION/feedback thread to that batch. The 8 items from cf82a7d3 §5a are NOT directly numbered here, but the underlying rules they touched ARE addressed across §2a-2d (cabinet enthusiasm, command on draft, Iron-Fist PL block, primary challenge gating, etc.). The pres-Command-for-blunder rule (#3 in cf82a7d3) gets its CANONICAL 2-step wording in POST 163 of THIS thread. The "Passive blocked from FL" (#4 in cf82a7d3) gets the 100% chance ruling in POST 62 of THIS thread. The negative-trait rates (5%/3%) in POST 79. **Other #5-#8 items (incumbent challenge / Iron-Fist PL block / PL no-block / minor candidates) NOT explicitly addressed in this thread.** |
| 3 | **Amendments NOT SCOTUS-challengeable (cf82a7d3 #100 conflict)** | **NO** — this thread doesn't touch it. cf82a7d3 POST 250-269 was the channel. |
| 4 | **Orange's 5%-of-faction-max death/retirement formula** | **YES — corroborated.** Multiple posts (90-100, 195-197) discuss the 5% rule + Ted accepts it. (POST 196: "Personally I do not mind the 5% rule now for everyone.") |
| 5 | **Generated-pol-for-uncontested-races compromise** | **NO** — not touched in this thread. |
| 6 | **Career-track election eligibility (Tyler's 2.1.2 citation)** | **NO** — not touched. |
| 7 | **Mil-Prep meter level 4 fix (30/40/30 proposal)** | **YES — but NOT RESOLVED.** This thread INDEPENDENTLY discovers the bug (POST 290) + community proposes 30/40/30 (POST 322) + 30/60/10 (POST 297) + 40/50/10 (POST 300). Ted couldn't recall what he'd done. **OPEN — both threads have the bug logged but neither closes it.** |
| 8 | **Civil Rights Act not-repealable decision** | **NO** — not touched. |

**Net:** This thread CORROBORATES items 4 + 7 + (partially) 2 from the
cf82a7d3 checklist, and is INDEPENDENT of items 1, 3, 5, 6, 8 (those were
resolved in the bug thread, not this discussion thread). The two threads
have complementary scope.

---

## §8. Deltas vs current build (gap-log additions / changes)

This thread reveals **one new mechanic rework (cabinet→enthusiasm)**, **one
new common-framework proposal (UEM, OPEN)**, **multiple new specific rules**
that the build should bake in, and **clarifications/resolutions** of many
existing gap rows.

### §8a. NEW gap rows the build should add

| ID | Area | In the build today | Designed (this thread) | Delta |
|---|---|---|---|---|
| **#124** | **★ Cabinet → enthusiasm rework: IDEOLOGY-COMPOSITION drives enthusiasm; LOBBIES give bonus POINTS** | Cabinet has its own enthusiasm-via-lobby model (gap #31 "cabinet enthusiasm-via-lobbies overwhelms presidential signal," partially patched by #80 ±3 cap) | (1) Lobby satisfaction gives bonus POINTS to Pres + factions w/ matching lobby cards (not enthusiasm). (2) Ideology composition drives enthusiasm: ≥50% of an ideology = +enth that ideology; ≤20% = −enth. Big-4 / rest-of-cabinet / cabinet-level potentially weighted differently. 3 shifts/half-term cap holds. | Rewrite the cabinet→enthusiasm system to separate the POINTS path (lobby-driven) from the ENTHUSIASM path (ideology-composition-driven). Pairs with #31. **Status:** Ted RULED in concept; percentages OPEN. |
| **#125** | **★ Universal Election Modifier (UEM) — common framework across all elections** | Each election context has its own modifier set; no unified framework | A single +1/-1 modifier table applied to ALL elections (primary + general, all offices, all eras), with ~17 +1 traits and ~16 -1 modifiers; demographic modifiers expire on first-of-type-elected at each level | Build a single UEM table + per-election overlay. **Status: OPEN — Ted didn't finalize.** Community pushback on stacking + age modifiers. The build should NOT pre-implement this; wait for the user. |
| **#126** | **★ Pres implementation 2-step Admin-then-Command rule (CANONICAL WORDING)** | Pres implementation rolls are not the canonical 5-tier Command-gated model | **Step 1: Pres rolls Admin for impl, same as cabinet.** **Step 2 (Blunder check): Pres COMMAND modifies the blunder roll — Cmd 5 = avoid blunder; Cmd 4 = 50% avoid; Cmd 3 = +1 to blunder; Cmd 2 = 50% +1; Cmd 1 = normal; no Cmd/no expertise = −2 (unless Efficient on impl team); Incompetent = −3. Easily Overwhelmed skips step 2.** | **Implement the 2-step rule as the canonical Pres implementation flow.** Pairs with cf82a7d3 §5a #3 (this thread's POST 163 is the AUTHORITATIVE wording). |
| **#127** | **★ Ideology shift / conversion rate/rule schedule (CANONICAL)** | Various ideology-shift rates scattered | LW↔RW Pop cross-circle shift = 25% (vs 50% other shifts); Two-Faced on cross-circle success; same-party conversions can target same-OR-adjacent ideology; party-flip conversion rate 33%; no special-Moderates rule | **Codify the schedule of shift/conversion rates** + the adjacency relaxation + auto-Two-Faced. Pairs with #76 + #99. |
| **#128** | **★ Kingmaker / Master Kingmaker bonus scope (CANONICAL)** | Bonus mechanic exists; scope ambiguous in code | Kingmaker = +1 in own state ONLY (incl. state's Pres primary + state's general); Master = +1 in EVERY state (all Pres primaries + all generals). Master REPLACES the state-bonus with the national-bonus PLUS includes the state. | **Pin the +1 scope per tier** as a CONFIG. (POST 316.) |
| **#129** | **★ Trait-inheritance allowlist for Kingmaker→Protégé** | Trait inheritance allowed/blocked is partial | **Block list:** Master/National Kingmaker, Frail, Flip-Flopper, Two-Faced (was the existing block list). **Allow list:** Celebrity, Kingmaker (basic, not Master), Hale, all positive traits the Kingmaker has. | **Implement the explicit allowlist + blocklist** for Kingmaker→Protégé trait transfer. (POST 280, 203, 207.) |
| **#130** | **★ Retirement+death model with Hale-as-half-death + Frail-rolled-first + ex-Pres-no-retirement** | `MORTALITY_RULES` exists; this thread defines the rule schedule | Hale = 1/2 chance of death; death rolls oldest-to-youngest WITH Frail rolled first; retirement rolls oldest-to-youngest (no Frail priority); **retired ex-Presidents ONLY roll for death, never retirement**; cabinet members retire at END of half-term (not on appointment); auto-retire at 100; 5%-of-faction-max retirement rate; era-scaled retirement %s. | **Implement the full retirement+death schedule** as the canonical model. (POST 143, 148, 195-197, 396.) Pairs with cf82a7d3 #4 checklist. |
| **#131** | **★ Integrity-pol cannot nominate Controversial-pol — NEW RULE** | Pol nomination logic doesn't gate on Integrity | An Integrity-trait pol CANNOT nominate a Controversial-trait pol to any office (CPU + human players). | **Add the gate.** (POST 277.) |
| **#132** | **★ Challenge-Legislation Gov Action cannot target a REPEAL bill — NEW RULE** | Gov Challenge-Legislation can target any recent legislation | Repeal bills are NOT eligible Gov Challenge-Legislation targets. | **Add the filter.** (POST 248.) |
| **#133** | **★ 1st / 2nd Continental Congress composition rules (rewritten)** | 1772 scenario has CC logic but the appointment-rules-by-state-size are not formalized | Big states (PA/MA/VA/MD) = 4 delegates; medium = 3; small (GA/RI/DE/NH) = 2. Faction with most pols in a state picks delegates pre-DoI; Governor picks post-DoI ("2nd CC"). Articles of Confederation fires → prohibits consecutive election + requires 2/3 of states to pass + unanimous for amendments. | **Bake the size table + appointment-rule transition into the 1st/2nd CC logic.** Refines #43 (statehood gating, indirectly) + #92 (era-band transitions). Corroborates cf82a7d3's #4f rules. (POST 220, 222.) |
| **#134** | **Lingering 7-step strict ordering w/ tax/tariff decay propagating forward** | Lingering steps run; the explicit step-order + carry-forward is not pinned | Steps run 1→7 in order, never re-done. Volatility roll at step 7 = THIS-phase-only (not added to running). Tax/Tariff Decay propagates to NEXT phase's step 3 (decay continues across half-terms). | Pin the step order + decay carry-forward semantics. (POST 397-408.) Refines #67 (Lingering bank). |
| **#135** | **50/50 House split = leadership goes to party NOT in control of Senate** | Tied chamber handling unclear in code | Inverse-control rule. | **Implement the inverse-control rule.** (POST 65.) Pairs with #62 (contingent election + tied-chamber rules). |
| **#136** | **Random skill on draft has NO Command chance (canonical rule)** | Older rule had 1/6 Command chance on the random-skill draft gain | Random skill gain only — NEVER Command from this source. | **Remove Command from the random-skill-draft-gain pool.** (POST 7, 47.) |
| **#137** | **Can-Party-Flip draftees enter at IRL party (no cross-party draft)** | Older rule had both parties 50% chance to draft | Pols always enter at their historically accurate party at draft; can flip later via 2.1.6 conversion. | **Pin the draft-party rule.** (POST 10, 48.) |
| **#138** | **3 random traits + 3 random alt-states per draft (canonical count)** | Previous count was 5/5 | 3/3 is the canonical count. | **Pin the count.** (POST 50.) |
| **#139** | **President signature step lives in phase 2.6 (NOT 2.10)** | Build may have signature elsewhere | Pres signature in 2.6 so military bills affect Mil-Prep before 2.7. | **Move/keep Pres signature in 2.6.** (POST 124-126.) |
| **#140** | **AnytimeEvo target-pool tightening** | Some AnytimeEvos may give +1 Command to "any random pol" | Updated AnytimeEvo events (5, 17, 23, 24, 25, 39, 66, 117, 118, 119) restrict targets to Rep/Sen/Gov/Cabinet; Assassination = 50% Pres / 25% Rep-Sen / 25% FL. | **Restrict target-pool per the new event spec.** (POST 255, 271.) |
| **#141** | **Faction-leader trait gain — 5% positive / 3% negative; negatives first-time-as-FL only** | FL trait-gain rates not explicit | 5% positive trait gain per cycle (every time as FL); 3% negative trait gain (first time only). | **Pin the rates.** (POST 79.) Refines cf82a7d3 §5a #4. |
| **#142** | **CPU Chief Justice selection ladder** | CJ CPU selection ladder not specified | Highest Judicial ability from their party → multi-faction tie: own faction → Pres-ideology match → lowest-scoring faction; multi-candidate tie: matching-appointer-ideology → random. | **Implement the ladder.** Sharpens #52 (SCOTUS subsystem). (POST 388.) |

### §8b. Existing gap-row CORROBORATIONS / strengthenings

| Existing gap | What this thread adds | POST |
|---|---|---|
| **#99 (ideology = CIRCLE)** | **TED EXPLICITLY DECLARES the rule** (POST 24): "all ideologies are now a CIRCLE, rather than a line." Plus the 25% cross-circle shift rate + Two-Faced penalty. **3rd-thread corroboration** (after `rep1800` + `nuke`). | 24, 51 |
| **#76 (CPU conversion)** | **Adjacency rule EXTENDED to same-party conversion**. | 38, 53 |
| **#52 (SCOTUS subsystem)** | **CPU Chief Justice selection ladder** published (POST 388). | 388 |
| **#67 (Lingering bank ordering)** | **Strict 7-step ordering with tax/tariff decay propagating forward** clarified. | 397-408 |
| **#40 (faction nicknames / per-era relabel)** | **Party rename trigger: still ERA EVOS, not Party Leaders** (Matt's proposal NOT adopted). | 391-395 |
| **#62 (contingent election + tied-chamber)** | **50/50 House split = leadership goes to party NOT controlling Senate** (inverse-control rule). | 65 |
| **#31 (cabinet scoring / enthusiasm-via-lobbies)** | **Cabinet → enthusiasm REWORKED — see #124.** | 1-4 |
| **#19 (faithless electors)** | **Wording acknowledged "wonky"** but no rewording finalized. | 371-376 |
| **MORTALITY_RULES (codebase, src/types.ts)** | **Hale = 1/2 chance; ex-Pres only rolls for death; Frail first; 5%-of-faction-max with era-scaled %s.** | 143, 148, 195-197, 396 |
| **cf82a7d3 #4 (Orange's 5% formula)** | **Accepted, corroborated.** | 196 |
| **cf82a7d3 #7 (Mil-Prep meter level 4)** | **Independently re-discovered.** Community proposes 30/40/30 (also). **NOT FINALIZED.** | 290-301, 322 |

### §8c. NO-CHANGE — items NOT touched here that remain OPEN

- Relocation-cap-4 (cf82a7d3 handled)
- Amendments NOT SCOTUS-challengeable (cf82a7d3 handled)
- Generated-pol-for-uncontested-races
- Career-track election eligibility (DH-25 / DH-56)
- Civil Rights Act not-repealable
- Delegate-class fork (from `arkzag`)
- Player-controlled SCOTUS fork (#52 details)
- #18 meter→election state-scope fork
- Senate cloture threshold (batch 9 review-gate ruling held)

---

## §9. Conflicts with prior user review-gate decisions

**Batch 9's "60% cloture + majority" Senate ruling** — does Ted touch it
here?

**NO.** This thread does not discuss Senate cloture thresholds at all. The
only mention of "60%" in this thread is on the **CC-era controversial-nominee
confirmation threshold** (POST 312, 351) — that's 60% of states (8 of 13),
unrelated to Senate cloture. The batch-9 review-gate "60% cloture + majority"
ruling stands UNCONFLICTED.

**No other user review-gate decisions are conflicted by this thread.**

---

## §10. What this digest does NOT include

- Per-state CC delegate-eligibility tie-breakers (Umbrella POST 166 raised it; Ted said "I'd say feel free to choose how you want to run it" — no canonical rule).
- "Revolutionary War ends in War Weariness" 1780 event prerequisite (Umbrella POST 328; Ted: "this is important, we need to get it correct" but no edit posted).
- Cuba EVs apportionment historical complaint (POST 324-327; @jnewt complained Cuba undersized; Eric posted current per-decade values; no Ted ruling).
- St. Clair / Hamilton "natural-born citizen" reading (POST 378-389; Ark says he marks pre-Constitution-born as natural-born; no canonical rule change).
- William Sprague III/IV bio swap (POST 351; flag for cf82a7d3-style fix).
- Charles Mann Hamilton / Kerr / O'Niel draft-year fixes (POST 377; cf82a7d3-style fixes).
- Discussion of "No Greater Glory" 1991 SSI game art aesthetics (POST 331-350; not load-bearing).
- Federal-economic-legislation amendment proposal (POST 382; suggestion only).
