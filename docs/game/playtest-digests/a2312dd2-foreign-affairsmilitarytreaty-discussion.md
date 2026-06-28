# Digest — a2312dd2 "Foreign Affairs/Military/Treaty discussion"

**Type: WAR / TREATY BALANCE-FIX design thread** (not a playthrough, not a content drop). 17 posts /
1 chunk, dated **Apr 15–16, 2022**. Triggered by a **live playtest exploit**: President Butler lost
multiple wars but **Cal IGNORED the losing treaties** because passing them hurt MORE than ignoring
(the meters the treaty would dock were already floored), so ignoring was strictly better — *"Smart
play! But not very historic"* (POST 1). MrPotatoTed (Ted) opens with 3 fix options, the design circle
debates, and **Ted merges everything into a direction (POST 15/17)**: auto-proposed treaties + a
Senate confirm-or-renew-the-war vote + a 50%-chance-of-more-battles war-length change. Largo833 (POST
16) widens it into a **systemic flaw**: a meter at its floor is a dead deterrent.

This thread chronologically **bridges the two war design-origin threads already in the KB**: it is
**later than `fixes` (a852d451, Mar–Apr 2022, the war-DECLARATION/preparedness side)** and **earlier
than `rethinkwar` (0fd0f2e5, Sept 2022, the COMBAT/War-Score side)**. Its own contribution is the
**TREATY/war-end side + war-length unpredictability + the meter-floor-deterrent systemic flaw** — most
of which folds into the existing **#45** generic-war gap, with **one candidate NEW systemic gap**
(meter-at-floor = no deterrent, cross-ref #88).

Authority tiers (per task): **vcczar (Anthony, lead) + MrPotatoTed (Ted) = tier-1 (authoritative)**;
**Cal, Willthescout7, 10centjimmy, Arkansas Progressive, Largo833 = contributors.** Where a tier-1
designer committed/picked, flagged **[tier-1]**; otherwise **[FLOATED]**. Items that are
**balance/exploit fixes (DH-style bug rows)** rather than design gaps are marked **[DH-style]**.

---

## 1. ★ THE TRIGGER — two shipped exploits this thread exists to fix

### 1a. SHIPPED EXPLOIT — "ignore the losing treaty" (POST 1) [DH-style; ▸ #45]
On the playtest, the **Secretary can delay/ignore a treaty** and the **Senate can reject it**. When
the loss-penalty meters a treaty would dock are **already at their minimum**, ignoring the treaty is
**strictly better than signing it** — signing applies a penalty package on top of a war you already
lost, while ignoring costs nothing the meters can still register. Cal exploited exactly this with
President Butler's lost wars. **This is a shipped balance hole in the treaty-handling code** (tech-lead
to verify how the engine applies/skips a losing treaty and whether the ignore-path is penalty-free at
meter floor). Live-playtest proof of the systemic flaw in §3.

### 1b. SHIPPED EXPLOIT (systemic) — "meter-at-floor = no deterrent" (Largo833, POST 16) [candidate NEW; ▸ #88]
The treaty exploit is *"partly just a symptom"* of a deeper flaw: once **Domestic Stability /
party-preference reach their worst possible value**, further penalties are **toothless**, so the
incumbent has **nothing to lose** by reckless acts. Largo's in-universe objection: a nation in "open
rebellion" at DomStab 1 wouldn't think *"at least it can't get any worse."* This is a **general
balance flaw, NOT treaty-specific** — it will recur anywhere a penalty targets an already-floored
meter. See §4 for the two floated fixes. **Not captured anywhere in game-context.md today** → candidate
NEW systemic gap (cross-ref #88's meter-driven game-over clock; Largo's second fix is literally a
modifier on that clock).

---

## 2. The three treaty options debated → Ted's merged direction

### The three options (Ted, POST 1)
1. **Wars last forever until you pass a treaty**, with **escalating lingering penalties** to force a
   close (−party-pref, −revenue/budget, −DomStab if long enough). Win-condition floated: **Skirmish =
   +1 net win, Minor war = +3 net, Major war = +5 net** for the WIN treaty; opposite (−1/−3/−5 net) →
   the LOSING treaty; else **White Peace**. *[Arkansas Progressive fleshed this into a per-phase
   penalty ladder — see §2a.]* vcczar (POST 4): **prefers #1 as most realistic.**
2. **Keep as-is, make the ignore-penalty worse** (e.g. −5 party-pref). Ted's own caveat: *"even that
   would have done nothing here as they'd already maxed out their negative party preference"* (POST 1)
   — i.e. option 2 alone **does not fix the floored-meter root cause**. Cal (POST 2) liked #2 **but
   only with a 10–20-year minimum during which party-pref can only slowly tick back up** (so it
   counters an already-maxed value). Arkansas Progressive (POST 14): keep it as is but auto-propose.
3. **Treaties automatic** — can't be delayed/ignored by the Secretary, can't be rejected by the
   Senate. **vcczar's speed pick** (POST 3): *"It's a good opportunity to speed up the game."* Ted
   (POST 6): #3 *"might be easier for the sake of moving a game along."*

### 2a. Arkansas Progressive's per-phase lingering-penalty ladder (POST 7) [FLOATED, for option 1]
A concrete 2-year-increment escalation if option 1 is chosen — penalties compound the longer the war
drags, mixing **guaranteed** and **%-chance** hits to **Revenue/Budget, Party Preference, relations
with any non-allied country, and Domestic Stability**:
- **Phase 1 (0–2 yr):** −1 Revenue/Budget only.
- **Phase 2 (2–4 yr):** −1 Rev/Budget; 25% another −1 Rev/Budget; 25% −1 Party-Pref.
- **Phase 3 (4–6 yr):** −1 Rev/Budget; 50% another −1; 50% −1 Party-Pref; 25% −1 a non-allied country.
- **Phase 4 (6–8 yr):** −1 Rev/Budget; 75% another −1; 75% −1 Party-Pref; 50% −1 non-allied country;
  **25% −1 Domestic Stability** (DomStab first appears at 6–8 yr).
- **Phases 5–10 (8–20 yr):** the hits keep stacking (−2/−3 Rev/Budget guaranteed, −2 Party-Pref,
  multiple non-allied-country hits, up to −2/−3 DomStab) so a stubborn war eventually **wrecks the
  country**. *"…until you either get the big win, give up and accept neutrality/defeat, or wreck your
  country over your stubborn refusal to quit."*
- 10centjimmy (POST 5) independently described the **same "negotiated behind the scenes, then
  auto-presented to the Senate"** shape: every loss makes the treaty worse, every win better; refusing
  ratification costs party-pref AND continues the war one more phase (with the risk the next treaty is
  worse) — explicitly pairs with the war-length unpredictability of §5.

### 2b. ★ TED'S MERGED DIRECTION (POST 15, restated POST 17) [tier-1 — the adopted spec direction]
Merging all feedback, Ted's stated position (he remained "open to further discussion"):
1. **Treaties are AUTO-PROPOSED in the next legislative session when a war is won or lost.** **White
   Peace can be proposed by the Sec of State BEFORE winning or losing, but NOT after.**
2. **The Senate votes to confirm the treaty.** **Failing to confirm can cause backlash against the
   Senate Majority Leader AND can renew the war.**
3. **Keep the military phase largely as-is, but with a 50% chance of whether to do more battles after
   the first two** (the war-length change, §5).
- **POST 17 (10centjimmy) additions, Ted-endorsed in spirit:** also **penalize the senators who vote
  AGAINST the treaty** ("blame on the folks unnecessarily prolonging a won or lost war"); and **throw
  in the more-engaged ambassador/SecState role** (§6) "but understand if that opens up too many
  issues."

> **Delta vs the build & vs #45's current capture:** #45 already records *"treaties are AUTOMATIC"*
> (from `completions` §Legislation POST 20-24). This thread adds the **Senate confirm-or-renew-the-war
> machinery** that the bare "automatic" capture does NOT have: (a) auto-PROPOSAL timing (next legis
> session on win/loss; White Peace only pre-resolution), (b) a **Senate confirmation vote**, (c)
> **failure → backlash vs Senate Majority Leader + war RENEWS**, (d) **anti-treaty senators
> penalized**. Reconcile: "automatic" = auto-PROPOSED, NOT un-rejectable (Ted POST 15 keeps a Senate
> down-vote with heavy consequences, walking back option 3's "can't be rejected"). Fold into #45.

---

## 3. ★ Live-playtest scenario + WHO EATS THE PENALTY (POST 10, 16) [corroborates #45 instigator-attribution]

The Butler scenario surfaced an **attribution** question (Largo833 POST 16; Wiseman-style follow-up
POST 10): if Butler (Red) is replaced by a **Blue** president who then **signs Butler's "defeat"
treaty**, does **Blue eat ALL the loss-penalties** even though *"basically the entire war took place
during Butler's term"*? Largo: Red could **deflect the penalty by just waiting out the term** and
leaving Blue the brunt — which "seems weird." Understandable only if Blue *chose* to prolong the war.
- **POST 10 (a contributor) wants the successor to retain agency:** a new administration should be
  able to choose between **signing immediately** vs **trying to actually win / snatch a stalemate** —
  *"if the war's already lost and it's just a question of who we lose it under,"* options 1/2 offer
  limited utility, but the option to **turn the tide** is worth keeping on the table. (A design
  constraint on any "auto-sign the predecessor's treaty" rule.)
- **This directly corroborates the existing #45 sub-rule "War-Declaring-President FUTURE PENALTIES"**
  (instigator attribution — the instigating FACTION eats the loss-penalty *even under a later
  president*, from `fixes` §1c POST 5/6). This thread is a **fresh, live-playtest instance** of that
  exact problem and confirms it is real, not theoretical. Open nuance THIS thread adds: the penalty
  should attach to the **instigator** UNLESS the successor *elects* to prolong (then the successor
  shares blame) — a refinement of #45's flat "instigator eats it" rule.

---

## 4. ★ Largo833's two fixes for the meter-floor flaw (POST 16) [candidate NEW; ▸ #88/#188]

For the §1b systemic flaw, Largo floated two mechanisms (both *"not sure how feasible…"* — design
spitballs, no tier-1 commitment in-thread):
1. **Spill-over:** when a score *would* drop but is **already at minimum**, the penalty **spills into
   OTHER scores** (so there's always something left to lose).
2. **Shorten the game-over timer:** when a floored meter would drop, a **% chance to shorten the
   loss-countdown** — Largo's example: **DomStab at 1 → 50% chance the game-over window drops from 8
   years to 6.** *(This is a direct modifier on the meter-driven game-over clock already logged in
   #88 — the `pop` 10-yr APOCALYPSE countdown / the `rep1800` coup-at-low-meters set; the "8yr→6yr"
   figure implies a multi-year loss-countdown exists once a meter floors.)*
- **Why this is a candidate NEW gap (not just a #45 fix):** Largo and Ted both frame the treaty
  exploit as *one symptom* of a game-wide flaw ("likely to cause similar problems with other aspects
  of the game"). The fix belongs to the **meters/game-over subsystem**, not the war engine. Nothing
  in game-context.md captures "penalty against an already-floored meter is toothless" or either fix →
  flag as candidate NEW systemic gap, cross-ref #88 (meter-driven game-over) + #188 (the floored-meter
  loss path) + the loss-debuff package in #45.

---

## 5. War-length unpredictability — the other half (POST 1, 8–13, 15) [▸ #45/#56]

### The problem (POST 1)
Today *"you can look at the chart and know whether there's any chance of losing the war within this
two-year period or not."* Wars are **deterministic/readable per phase** — no suspense.

### The floated change
- **vcczar (POST 1):** **50% chance of fighting another battle after each previous battle**, OR **roll
  a d6 for the number of battles**. **Ted's merged pick (POST 15): a 50% chance of whether to do more
  battles after the first two** — i.e. a guaranteed first two battles, then a coin-flip to continue.
- **Win/loss thresholds floated (Ted, POST 1, for option 1):** **Skirmish = +1 net win; Minor war =
  +3 net; Major war = +5 net** → the WIN treaty; **opposite net** (−1/−3/−5) → the LOSING treaty; else
  **White Peace**. (A war-TIER-scaled net-score threshold, distinct from `rethinkwar`'s later
  |score|×10% per-phase roll — reconcile under #45/#56's Major/Minor/Operation tiers.)

### ★ WAR-LENGTH DATA (the playtest baseline — POST 11, 12) [empirical; corroborates #45/#56 length tuning]
Willthescout7 asked the average (POST 8). The playtest's **six wars so far**:
| War | In-game years | Length | Result |
|---|---|---|---|
| Revolutionary War | ~1776–1784 | ~8 yr | won — *Ted flags it may need an EXCEPTION to "war gets more painful," or any invasion where surrender = game-over* |
| Northwest Indian War | 1786–1798 | 12 yr | won |
| Barbary War | 1798–1804 | 6 yr | lost |
| War of 1800 | 1800–1804 | 4 yr | won |
| Invasion of Canada | 1800–1804 | 4 yr | lost |
| Invasion of Brazil | 1800–? | ongoing | — |
- **Historical comparison (POST 12):** RevWar ~7 yr, NW Indian ~10 yr, Barbary ~4 yr, War of 1812 <3
  yr → *"We're pretty close to historical accuracy for war lengths!"* (NB the NW Indian War at 12
  in-game yr is the outlier long war.)
- **★ CONSENSUS on a penalty CUSHION (POST 8, 13):** **minimum ~4 years (2 phases) of fighting before
  any penalties** ("a fair shot at winning"), then **start penalizing at ~6 years** to force a White
  Peace / quick end. This is the **tuning constant** for §2a's lingering ladder. (vcczar, POST 9, is
  open to a battles-and-time-range model where the result is the % of wins / a decisive victory —
  pairs with the unpredictability change.)

---

## 6. SecState/ambassador ACTIVE ROLE — "give SecState something to do" (10centjimmy, POST 6) [FLOATED; ▸ #45/#26]

10centjimmy's detailed proposal to give the **Secretary of State + relevant ambassador** an active
hand in war/treaty resolution (worked through a fake War-of-1812-style war):
- **Negotiation component in the Foreign Affairs phase:** cumulative **SecState + ambassador admin**
  adjusts the **required number of victories** — **cumulative admin < 5 raises** the victories needed,
  **> 7 lowers** them. (Ambassador = the opponent's ambassador, e.g. UK; in non-native conflicts =
  the highest-admin ambassador.) **Set ONCE** at war start (or when the ambassador
  dies/retires/is replaced — *changing the SecState does NOT re-roll it*).
- **Per-phase loss-threshold roll:** a **5% chance each Foreign Affairs phase** to raise or shrink the
  number of losses that mean defeat, **weighted by traits — Geostrategic / Egghead (positive) vs
  Lowbrow / Disharmonious (negative)** on either the ambassador or SecState.
- **White-Peace prompt:** a **33% chance every Foreign Affairs phase** the SecState is prompted with a
  White-Peace treaty to accept and submit to the Senate. **No penalty for the SecState to refuse**
  white peace UNLESS they have the **Integrity** trait — then a **50-point faction loss + they LOSE
  the Integrity trait.**
- **Senate ratification penalty package (POST 6, the harsher pre-merge version):** if the Senate
  **rejects** a (non-white-peace) treaty: every NAY senator gets a **4-yr electoral penalty + faction
  −100**; the **Senate Majority offices each −200, 8-yr electoral penalty, party-pref moves opposite
  +1** (if maxed, the **party leader** gets the 8-yr penalty instead); **DomStab −1**; **penalties
  COMPOUND each term** the treaty stays unratified. If the Senate approves → President signs (the
  **President is REQUIRED to sign**), standard penalties/bonuses apply. *(These exact magnitudes are
  10centjimmy's proposal, not a tier-1 ruling — the merged POST 15 version softens "can't be rejected"
  into "rejection has heavy consequences + can renew the war.")*
- **Roadmap note:** this is the design-side answer to the recurring **"SecState/cabinet agency"** want
  — Ted (POST 17) wants it in but flags it "might open up too many issues." Cross-ref the diplomacy
  actions gap **#26** and any cabinet-agency want. **Candidate to fold into #45** as the
  treaty-negotiation sub-design (or note on #26).

---

## 7. AMPU-2 deferral (vcczar, POST 3)

A **back-and-forth, month-to-month NEGOTIATED treaty** (real diplomatic give-and-take) is **explicitly
deferred to AMPU-2**: vcczar — *"Maybe in AMPU 2 I can create a way to cobble together a treaty, but
that would probably involve changing AMPU from phases to month-to-month base or something, since you
need back and forth on a treaty."* For AMPU-1, treaties are a single auto-proposed Senate up/down
vote (§2b), not a negotiation. (Log on the AMPU-2 wishlist; pairs with the existing AMPU-2 deferrals.)

---

## 8. Relation to existing gaps (mapping — NO new IDs assigned)

- **▸ #45 (Generic war system)** — the primary home. Corroborates AND extends:
  - **EXTENDS (not yet in #45's delta):** the **Senate confirm-or-renew-the-war treaty machinery**
    (auto-PROPOSAL timing on win/loss; White Peace pre-resolution only; Senate up/down vote; failure →
    backlash vs **Senate Majority Leader** + **war RENEWS**; anti-treaty senators penalized). #45 today
    only records bare "treaties are AUTOMATIC." **Reconcile:** automatic = auto-PROPOSED, NOT
    un-rejectable.
  - **EXTENDS:** **war-length unpredictability** — guaranteed first two battles, then **50% chance of
    more battles** (Ted POST 15); plus the **tier-scaled net-score thresholds** (Skirmish +1 / Minor
    +3 / Major +5 net → win-treaty; opposite → losing-treaty; else White Peace).
  - **EXTENDS:** the **SecState + ambassador treaty-negotiation component** (admin adjusts victories
    needed; trait-weighted per-phase rolls; 33% white-peace prompt) — §6.
  - **CORROBORATES:** the **instigator-attribution** sub-rule (#45's "War-Declaring-President FUTURE
    PENALTIES") via the live Butler→Blue-successor case, **with a refinement** (successor keeps agency
    to fight on / snatch a stalemate vs auto-eating the predecessor's penalty) — §3.
  - **CORROBORATES (date/bridge):** this thread (**Apr 15–16, 2022**) sits **between** `fixes`
    (Mar–Apr 2022, war-declaration side) and `rethinkwar` (Sept 2022, combat/War-Score side) — the
    treaty/war-end side of the same evolving war design.
- **▸ DH-79 (naval bug, inside #45)** — corroborated as the motivation: the whole "rethink how the
  military/treaties work" effort (POST 1) is the same balance pass that produced the naval-feeds-land
  fix; this thread is the treaty/war-length half.
- **▸ #88 (meter-driven game-over clock) + #188 (floored-meter loss path)** — Largo's "min-meter →
  50% chance the game-over countdown drops 8yr→6yr" (POST 16) is a **direct modifier on #88's clock**;
  the spill-to-other-scores fix is the alternative. Cross-ref for the candidate NEW systemic gap.
- **▸ #56 (Civil-War two-theater + tiered war framework)** — the Skirmish/Minor/Major net-score
  thresholds (POST 1) feed the Major/Minor/Operation tier system already on #56; the ~4-yr-cushion /
  6-yr-escalate tuning (POST 13) is a length-tuning datum.
- **AMPU-2 wishlist** — month-to-month negotiated treaty deferred (POST 3).

---

## Candidate gaps for consolidation (one-liners — NO new IDs)

- **▸ #45 — Treaty confirm-or-renew machinery (EXTEND #45's "treaties are automatic"):** on a war
  win/loss the treaty is **auto-PROPOSED in the next legislative session** (White Peace proposable by
  SecState only BEFORE resolution); the **Senate votes up/down**; **rejection → backlash vs the Senate
  Majority Leader + the war RENEWS**, and **anti-treaty senators are penalized**. Walks back option
  3's "un-rejectable." *(Source: a2312dd2 POST 5, 6, 15, 17.)*
- **▸ #45 — War-length unpredictability:** replace the readable per-phase chart with **guaranteed
  first two battles, then a 50% chance of more battles** (or roll a d6 for battle count); resolve via
  **tier-scaled net-score thresholds** (Skirmish +1 / Minor +3 / Major +5 net → win; opposite →
  loss; else White Peace), with a **~4-yr cushion before penalties, escalating at ~6 yr** (playtest
  baseline: 6 wars, RevWar ~8yr / NW-Indian 12yr / Barbary 6yr / War-of-1800 4yr / Canada 4yr /
  Brazil ongoing). *(Source: a2312dd2 POST 1, 8, 11, 12, 13, 15.)*
- **▸ #45 / #26 — SecState + ambassador active treaty-negotiation role:** cumulative SecState+ambassador
  **admin adjusts the # of victories required** (<5 raises, >7 lowers; set once / re-set on ambassador
  change); **5% per-phase loss-threshold roll** + **33% per-phase white-peace prompt**, trait-weighted
  (Geostrategic/Egghead vs Lowbrow/Disharmonious); Integrity gates refusing white peace. *(Source:
  a2312dd2 POST 6, 17.)*
- **▸ #45 [DH-style bug] — "ignore the losing treaty" shipped exploit:** the Secretary can delay/ignore
  a treaty and the Senate can reject it; when the loss-penalty meters are already floored, ignoring is
  **strictly better than signing** (penalty-free at floor). Live playtest proof (Butler). Tech-lead to
  verify the treaty-handling code. *(Source: a2312dd2 POST 1.)*
- **▸ #45 (corroborates instigator-attribution) — successor-eats-predecessor's-treaty:** confirms #45's
  "War-Declaring-President FUTURE PENALTIES" via the Butler→Blue case; **refinement:** a successor who
  *chooses* to fight on / snatch a stalemate should keep that agency rather than auto-eat the
  predecessor's loss-penalty. *(Source: a2312dd2 POST 10, 16.)*
- **★ candidate NEW (systemic) — "meter-at-floor = no deterrent" (cross-ref #88/#188):** once
  DomStab / party-pref hit minimum, further penalties are **toothless → the incumbent has nothing to
  lose**. A game-wide flaw, not treaty-specific. Floated fixes: (a) a penalty against a floored meter
  **spills into other scores**; (b) a floored meter that would drop has a **% chance to shorten the
  game-over countdown** (DomStab 1 → 50% the loss window drops 8yr→6yr — a direct modifier on #88's
  clock). *(Source: a2312dd2 POST 1, 16.)*
- **AMPU-2 — month-to-month negotiated (back-and-forth) treaty** explicitly deferred to AMPU-2; AMPU-1
  keeps a single auto-proposed Senate up/down vote. *(Source: a2312dd2 POST 3.)*

## Open questions for the human
- **Successor agency vs attribution:** when a war is inherited, should the loss-penalty always land on
  the **instigating faction** (#45's current rule), or land on the **successor** only if the successor
  *chooses* to prolong the war (POST 10/16)? The two are in tension and the thread did not settle it.
- **Is the meter-floor flaw one gap or two?** Largo offered spill-to-other-scores **and**
  shorten-the-countdown (POST 16) — no tier-1 designer picked one in-thread. Consolidation must decide
  whether this is a NEW systemic gap or a sub-row of #88.
- **Reconciling the two war-end models:** this thread's **tier-scaled net-score thresholds** (Skirmish
  +1 / Minor +3 / Major +5) vs `rethinkwar`'s later **|raw-score|×10% per-phase roll** (already in
  #45) — are they the same mechanic stated two ways, or did the design move from thresholds (Apr) to
  the %-roll (Sept)? (Chronology suggests the latter superseded this.)
- **Treaty-handling code today:** how does the shipped engine actually apply vs skip a losing treaty,
  and is the ignore-path genuinely penalty-free at meter floor? (DH-style verification for tech-lead.)
