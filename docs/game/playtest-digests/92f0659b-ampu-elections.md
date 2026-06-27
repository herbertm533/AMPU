# Digest — `92f0659b-ampu-elections` ("AMPU Elections")

**Type:** DESIGN / CONTENT thread (NOT a playtest; no GM-run forward, no historian).
**Scope:** The **elections design doc** — the canonical brainstorm list of election-system
*content primitives*: Legis Props (mostly Amendments), Pres Actions, Gov Actions, and a
call for Era-of-Future election content. Author **@vcczar** (tier-1), ~Apr 2022.
**Why it exists:** the canonical rulebook (batch 31, `rulebook`) **explicitly WITHHELD the
election phases** as "massive." This thread is the election-content half vcczar broke out
separately. It is the **content** side of the election cluster (the Legis-Prop / Action menu),
**distinct from** the `calcStateVote` scoring math (#18/#184/DH-72) and the primary→convention
machine (#185/#183).
**Size:** 11 posts / 1 chunk (`chunk-001.md`, 14.1 KB). vcczar opens (POST 1, re-quoted POST 6);
players (Tyler/themiddlepolitical/ConservativeElector2/Rezi/Murrman/jvikings1 et al.) crowdsource
additions POST 2-5, 7-11. **All designed; 0% shipped as a content catalog.**

---

## 1. The election-content catalog (the thread's payload) — content primitives, corroborates #221/#92/#206

vcczar's list is an **authoring source** for the election content registry — the same
administration/era-banded content axis `ampuData` mirrors (#221), gated per-era (#92/#206).
These are policy *cards/options*, not engine math. Buckets as posted (POST 1/6):

**Legis Props (≈70 items, overwhelmingly constitutional Amendments + named real acts):**
- *Suffrage / franchise devolution:* **Allow states to set suffrage laws for federal elections**;
  **Let states set voting age**; Universal/National White-Male-Suffrage Amendment; Votes for White
  Female Property Owners; Felons-vote; Lower voting age to 16; 75-yr max voting age; Literacy Test;
  Poll-tax-adjacent; **Abolish Popular Vote in All Federal Elections**.
- *Term / eligibility (see §2 for the NEW term-length items):* 22nd Amdt, One-term limit, Life-Term
  President, Life-Term Senators, Foreign-born Pres, Natural-born-for-territory-born, min/max-age
  Amendments (25/30/40-min, 65/70-max for Pres; 25-min Sen; 75-retire Sen), Two-term limit for Senators.
- *Real named acts (historical content):* **12th, 17th, 22nd, 23rd, 24th, 26th Amendments**, Voting
  Rights Act of 1965, Tillman Act, Shafroth Act, Bipartisan Campaign Reform Act, **McGovern-Fraser
  Commission**, Patine Act of 2022 (break up the duopoly), Wyoming Rule for EC.
- *EC / apportionment / districting:* Abolish Electoral College; Non-Partisan Redistricting; Abolish
  Gerrymandering; **Cap US House at 100 / 435 / 500 / 1,000** (or "+3 per new state"); Run-Off Election.
- *Modern / Era-of-Future flavor:* Force online voting / vote-by-mail; Ban social media in elections;
  Direct Democracy in the Post-Internet World; Universal Federal ID + mandate; National Voting Day.
- *Constitutional-Convention-only options* (a labeled sub-bucket): Appointed/Elected Life-Term President,
  Appointed Life-Term Senators, Foreign-Born Presidents, **Elected 4-year presidency** — i.e. founding-CC
  choices, mapping onto the shipped `ConstitutionalArticles` (see §3).

**Pres Actions (thin — vcczar's explicit ASK is "more Pres Action options"):**
Advocate Universal White-Male Suffrage; create a Federal Election Commission; "Consistently Claim
Elections Are Rigged Against You."

**Gov Actions (state-level election levers):** Allow State Primaries; set primaries WTA / not-WTA;
change primary placement; **set primary delegates for convention**; women's suffrage in state; poll
tax; literacy test; **Disenfranchise Blacks & Poor Whites (Jim Crow)**; fair redistricting /
gerrymander; **State Legislature Selects President (no pop vote)**; property requirements to vote;
**split electoral votes**; strict voter ID; gov term-limit variants (no/2-yr/4-yr/one-term/two-term;
term-limited-gov-can-run-after-a-term-out).

> Two Gov Actions directly **corroborate documented engine deltas:**
> - "State Legislature Selects President (No Pop vote)" + "Split Electoral Votes" = the
>   **`electorsByLegislature`** / EV-by-district model already in game-context (rep1800 §2-A;
>   the early-republic per-state legislature-chooses-electors flag) — confirms it is *designed as a
>   per-state policy toggle*, not a one-off scenario constant.
> - "Allow State Primaries" + "Set primary delegates for convention" + WTA/placement = the inputs to
>   the **primary→brokered-convention machine (#185)** — confirms primaries are gated/configured by a
>   Gov action, not always-on.

**Player additions (POST 2-5):** non-citizen voting, compulsory voting; separate Pres/VP elections;
separate Cabinet elections; **end all elections**; change Congress/legislature election method (MMP/PR);
ranked-choice for governors/primaries; jungle/blanket primaries; candidate runs for VP nomination
(old-style, e.g. 1860); abolish voting age / "lower to 5"; all-EVs-proportional; Bayh-Celler Amdt;
caucus-vs-primary delegate rules; territories vote for president; voting rights for AI; voting
machines vs paper ballots; ban/condition write-ins; ban the Red/Blue Party ("not sure it can be done").

---

## 2. ★ NEW design note + candidate gap: variable PRESIDENTIAL TERM LENGTH vs the hardcoded `year%4` cycle

vcczar **added two NEW Legis Props** at @themiddlepolitical's request (POST 1/6):
- **"6-year term presidency Amendment (may delete)"**
- **"2-year term presidency Amendment (may delete)"**

…and flagged the implementation risk **himself, in his own voice** (POST 1, verbatim):
> "I've added the 6-year pres term @themiddlepolitical wanted, **although Anthony might recommend
> against it as it might upset how the election cycles are programmed. Same with the two-year terms.**
> However, it might not be an issue or could be overlooked."

themiddlepolitical (POST 6): *"Really hope we get to keep 2 and 6 year presidencies."* The "(may
delete)" tag + the programmer caveat = **an unresolved designer/programmer tension**, not a settled rule.

**This is a real shipped-cycle-coupling concern, verified against the codebase:**
- The presidential/election cadence is **hardcoded to 4-/2-year arithmetic**, NOT a variable:
  `phases.ts:53-58` — `isPresidentialYear = year % 4 === 0`, `isDraftYear = year % 4 === 0`,
  `isElectionYear = year % 2 === 0`. `shouldRunPhase` keys off these (phases.ts:67-76). A 6-year or
  variable term would **break every one of these predicates** (and the 2-yr-per-turn rollover,
  phases.ts:161).
- **There is NO presidential-term-length field anywhere in `src/`** (grep
  `termLength|presidentialTerm|termYears` = ZERO). `ConstitutionalArticles.termLimits`
  (types.ts:1396) is a binary `'two_terms' | 'no_limits'` = a **count of terms**, NOT term *length*.
- The term length is in fact baked into a **label string**: the CC executive option reads
  *"Elected President (**4-year term**)"* (`constitutionalConvention.ts:19`) — 4 years is an implicit
  constant, never a value.

So @vcczar's instinct is correct: the 6-/2-year term **cannot be a mere content card**; it requires a
**variable election-cadence model** (term length as data driving the phase scheduler) in place of the
`year % 4`/`% 2` predicates. This **piggybacks directly on the #92 architecture row** (eras-as-content
gated by game-state, which already wants the `year % 4` predicates replaced) — the term-length feature
is a second, independent reason the hardcoded cadence must go. Flag as a **candidate gap** (NEW angle on
#92's predicate-replacement; also touches the election cluster #18/#184/#185, which assume a fixed
4-year presidential cycle).

---

## 3. Constitutional content maps onto shipped `ConstitutionalArticles` — but as ONE-TIME CC choices, no amendment→mutation path

Many Legis Props are constitutional changes that **already have a shipped data home** —
`ConstitutionalArticles` (types.ts:1389-1397): `executive`, `judiciary`, `amendmentProcess`,
`presidentialEligibility` ('natural_born' | 'any_citizen'), `termLimits` ('two_terms' | 'no_limits').
The thread's explicit **"For Constitutional Convention"** sub-bucket (Appointed/Elected Life-Term
President, Foreign-Born Presidents, Elected 4-year presidency) lines up 1:1 with the CC question set
(`constitutionalConvention.ts:17-60`).

**The delta:** these articles are set **exactly once, at the 1772 Constitutional Convention**, and are
**immutable thereafter** — there is **no pathway for a mid-game Amendment (Legis Prop) to mutate them**.
vcczar's list treats the SAME choices (foreign-born pres, term limits, judiciary election, life terms)
as **runtime Amendments** passable any era. So the design wants `ConstitutionalArticles` to be a
**living, amendable structure** (12th/22nd/foreign-born/direct-election-of-judges Amendments rewrite it
mid-campaign), and several Props need NEW article fields (e.g. franchise/suffrage scope, EC-on/off,
House-size cap, term length per §2). Corroborates #92/#221 (per-era content) and the amendment-ratify
rule (`rulebook`: 75%-of-states-via-Governors). Candidate gap (NEW; corroborates the content-registry
cluster).

---

## 4. Senate-vacancy appointment + Congressional-term-limit / re-election-curve items (smaller corroborations)

- **Senate-vacancy fill (POST 7-9, ConservativeElector2 + themiddlepolitical):** a proposed Gov action —
  on a Senate vacancy, the governor either (1) **fills by appointment to end of term** or (2) **calls a
  special election** ("could trigger an automatic election right away"), with an option to **require the
  appointee be same-party as the outgoing Senator**. Relevant to the seeded-vacancy/boot handling already
  logged (#115 vacant-seat appointment-fill) and to the senate-class/`senatePre17` model — *adds the
  governor-appointment-vs-special-election fork.* Minor corroboration.
- **Congressional term limits + a SCOTUS hook (POST 11):** add "Congress Term Limits" (6-yr/12-yr) as a
  **Gov Action that can trigger a Supreme Court case** (mirrors the IRL 1990s state term-limits struck
  down by SCOTUS → only doable by Amendment); also "add the Virginia Plan to the original CC" (rep term
  limits). Ties the content catalog to the **SCOTUS-case docket** (era content registry #221) and the CC.
- **★ Era-keyed re-election curve (POST 11) — corroborates #187-family:** in the early republic
  (pre-~mid-1800s, before railroads) "1/3 to half of Congress turned over each election"; proposal: make
  **each re-election progressively HARDER in that period (a re-election PENALTY), then flip to the modern
  re-election BONUS after the Civil War.** Player notes "I think it does this for President (and maybe
  Governor) already." This is an **era-banded incumbency modifier** — same family as the documented
  party-fatigue / re-election levers (#187) and era-content gating (#92). Corroborates; candidate gap if
  the Congressional (vs presidential) re-election curve isn't already covered.

---

## 5. Era-of-Future election content + a regions/alt-states aside

- **Era-of-Future ask (POST 1):** vcczar's #1 stated need is *"ideas for Era of the Future and for more
  Pres Action options."* The futuristic Legis Props (online/mail voting, ban-social-media, direct-internet
  democracy, universal federal ID, AI voting rights) are the **Era-of-Future election content** —
  corroborates the **doubly-unbuilt Future band (#206)** and the Era-of-Future content calls in
  `welcome2future`/`tomorrowlist` (#206/#221). Pure content; 0% shipped.
- **Regions / alt-states aside (POST 10, Tyler):** asks whether **region bonuses** are set up for
  states outside the real 50 (Brazil, Central America, Philippines), and proposes a **"Pacific" region**
  (move Hawaii out of West Coast, Alaska out of Mountains; add Guam + Pacific islands). Off-topic for
  elections but corroborates the **alt-states / region-bias** work (expansionStates + the per-era
  state-bias table, #92) and alt-state pol-gen (#43). Minor corroboration, logged for traceability.

---

## Candidate gaps for consolidation (consolidation agent owns the gap-log write)

1. **★ NEW (flag) — Variable presidential TERM LENGTH vs hardcoded `year%4` cadence.** 6-yr / 2-yr
   presidency Props (POST 1/6) + vcczar's own programmer caveat. Verified: no term-length field in
   `src/`; cadence is hardcoded `year%4`/`year%2` (phases.ts:53-58); `termLimits` is term-*count* only
   (types.ts:1396); 4-yr is baked into a CC label (constitutionalConvention.ts:19). Requires a variable
   election-cadence model. **NEW angle on #92** (another reason to replace the year predicates); touches
   election cluster #18/#184/#185. *This is the headline item.*
2. **NEW/corroborates #221/#92/#206 — Election-content catalog as content primitives.** ~70 Legis Props
   (mostly Amendments + named acts) + Pres Actions + Gov Actions (POST 1/6, 2-5) = an authoring source
   for the per-era election content registry. Corroborates the #221 registry shape and #92/#206 era-gating.
3. **NEW/corroborates — `ConstitutionalArticles` must become AMENDABLE mid-game.** The "For CC" Props +
   12th/22nd/foreign-born/term-limit/direct-election-of-judges Amendments map onto types.ts:1389-1397, but
   those articles are set once at the 1772 CC and never mutated by legislation. Design wants amendments to
   rewrite them (and adds new fields: suffrage scope, EC on/off, House-size cap, term length). Corroborates
   #92/#221.
4. **Corroborates #185 / `electorsByLegislature` / #115 — Gov-action election levers.** "Allow State
   Primaries" + "Set primary delegates" confirm primaries are Gov-action-gated inputs to the convention
   machine (#185); "State Legislature Selects President" + "Split EVs" confirm the per-state
   legislature-chooses-electors / EV-split model (rep1800 §2-A) is a *policy toggle*. Senate-vacancy
   appoint-vs-special-election fork (POST 7-9) corroborates #115 vacant-seat fill.
5. **Corroborates #187 / #92 — era-keyed re-election curve for CONGRESS.** POST 11: pre-Civil-War
   re-election PENALTY → post-war BONUS (player believes Pres/Gov already do this). Era-banded incumbency
   modifier; same family as the party-fatigue lever (#187) and era-content gating (#92). Candidate gap if
   the Congressional curve isn't covered.
6. **Corroborates #206 — Era-of-Future election content + (aside) alt-state regions (#43/#92).** Online/
   mail/AI/internet-democracy voting Props = Future-band content (doubly-unbuilt #206); POST 10 "Pacific"
   region + non-50-state region bonuses corroborates alt-states/state-bias.

**Open question for the human (carry to consolidation):** Is the 6-/2-year presidential term a feature
to BUILD (variable cadence) or to DROP (vcczar tagged both "may delete")? The answer gates whether #92's
predicate-replacement must also generalize term *length*, not just era *advance*.
