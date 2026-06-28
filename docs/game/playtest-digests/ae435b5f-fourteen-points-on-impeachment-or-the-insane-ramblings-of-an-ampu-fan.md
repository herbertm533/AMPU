# Digest — ae435b5f "Fourteen Points on Impeachment, or The Insane Ramblings of an AMPU Fan"

**Type: IMPEACHMENT SUBSYSTEM — the canonical DESIGN-SPEC thread** (rules design,
not a playthrough). **48 posts / 2 chunks**, dated **Apr 2 – May 4, 2023.**

This is the **authoritative consolidated design source for the entire impeachment
subsystem** — and it is **directly the follow-up to the `ideo1928` "Improper SC
Justice" / Justice Sanford episode** that DH-66 records (the OP, 10centjimmy, is
the same GA who ran that game and wrote it up here). The thread does two things:
(1) it **diagnoses why the existing rule 3.05 is unworkable** (a fuller, cited
version of DH-33/DH-66's complaint), and (2) it produces **TWO competing rewrite
proposals** — the OP's elaborate "Fourteen Points" and **Ted's deliberately
simpler counter-proposal (POST 4/6) which BECAME the working consensus**. Ted's
counter-proposal is the **design ORIGIN of the impeachment model already recorded
in #112** (impeachment = a legislative proposal → House Judiciary → full House →
Senate 2/3 trial; resign-at-any-stage; Controversial-gated). So this thread is
the *primary source* behind a model the KB currently attributes only to in-play
`nuke`/`modernday` observation.

**★ Engine reality (do NOT re-derive — established by batch-40 tech-lead, b39):**
`impeach` is **absent from `src/`** — the impeachment subsystem is **0% built**.
The coup subsystem (#264) assumes treason-trials "reuse impeachment plumbing"
that **does not exist**. This thread is the spec for that whole unbuilt system.

**★ Provenance caveat (load-bearing): NOT designer-ratified.** **vcczar
(Anthony, tier-1 ruleset owner) DEFERRED the entire thread** — *"I'm not going to
have time. Remind me when Anthony gets closer to where these rules are relevant"*
(POST 47, confirmed 48). The consensus reached is **tier-1 Ted-led + GA/playtester
agreement**, with **vcczar's final sign-off explicitly PENDING**. Treat every
proposed number below as **designed-intent-in-progress, not canon.**

**Authority / cast:**
- **MrPotatoTed** (Ted) — **tier-1** (the build). **Authored the consensus
  rewrite (POST 4, 6)** and made most of the converging rulings here. Owns the
  rewrite ("I can take the lead on these," POST 4).
- **vcczar** (Anthony) — **tier-1** ruleset owner; **gave a blanket "I'm fine with
  this"** to Ted taking the lead (POST 5) but **deferred reading/ratifying the
  detail** (POST 47/48). His "I'll look on Thursday" (POST 16) never happened.
- **10centjimmy** (Jimmy) — the **OP / "Fourteen Points" author**, a **GA (tier-4)**
  and the GA who ran `ideo1928`. Tier-4: his 14 points are a *proposal*, mostly
  **explicitly not adopted** (Ted built a simpler model instead).
- **Playtesters (tier-4):** ShortKing, Willthescout7, ebrk85, matthewyoung123 —
  raised the exploit/meter-gaming critiques and the "drop the Senate committee
  vote" simplification that **Ted accepted**.

---

## 1. ★ The CURRENT rules (3.05) and WHY they are broken (POST 1, 2)

The OP's diagnosis — a fuller, post-cited version of DH-33/DH-66. The 3.05
process as written:

1. **Eligibility gate:** the office-holder must have the **"Controversial"** trait
   to be impeached (POST 1, 14). *(The triggering event also targeted Judicial < 3,
   creating the Controversial-vs-<3-judicial inconsistency DH-66 already records.)*
2. **House Judicial Committee builds the articles:** **every member of the
   committee** picks a **"qualifying offense"** from a list of **13 qualifying
   offenses** (or none if none qualify).
3. **★ The structural break (POST 1, confirmed POST 2):** with the **current
   25-member committee** (chair + ranking minority + 23), "every member picks one"
   yields **~25 articles of impeachment** — *"excessive, and unlikely."* **Ted's
   root-cause (POST 2):** the rule **predates the current House** — *"It used to be
   that each committee only had 3 members… so that's why it says 'every member of
   the committee' — it used to only be 3 people, not 25."* The rules are **so old
   they don't fit the current game** (POST 4: tied to the **old 3-member-committee
   House** that was completely revamped). It is also **unclear what a "qualifying
   offense" even is** or why each member proposes one (POST 1).
4. **Whole-House vote:** Integrity reps **must** vote to impeach a Controversial
   statesman; an **Iron-Fist + Leadership Speaker** rolls to whip the party;
   same-party converts can flip if the target is **Unlikable + Controversial**;
   then standard House vote-conversion. Simple majority ⇒ impeached.
5. **Senate conviction trial** follows.

**★ The trigger / how this surfaced (POST 1 — the DH-66 episode):** in `ideo1928`,
the **General Event "Improper SC Justice"** fired, and **because General-Event
actions fire AUTOMATICALLY, the game dove straight into an impeachment trial
*before* the Scripted-Events phase** — and **skipped the "Special Committee"
(rule 2.2.2)** entirely. The event called for impeaching a justice with
Controversial OR Judicial < 3; no justice had Controversial, so the GA rolled
among <3-Judicial justices and **landed on Justice Sanford (2 Judicial, no
Controversial)** — who, by luck of the draw, entered a trial the eligibility rule
(Controversial-required) says shouldn't happen. **This auto-fire-skips-the-
investigation interaction is the General/Scripted-event problem #221 owns.**

**Ted's framing of WHY this is fixable now (POST 4):** *"he can't program the
existing version of the impeachment rules because they just don't work — they're
both too complicated and too vague, are tied to the old version of how the House
worked, and conflict with various other sections of the rules and events… I
believe we can quickly fix all of this before Anthony gets anywhere close to this
section of the rules."* Will (POST 36): impeachment is **"filling a void, not
messing with the load-bearing beams,"** so a rewrite is low-risk.

---

## 2. The OP's "FOURTEEN POINTS" (POST 1) — the elaborate proposal (mostly NOT adopted)

Capturing the **load-bearing structure**; dice details summarized. **Status: this
is the tier-4 proposal Ted ultimately replaced with a simpler model (§3). Several
points the OP himself said were "purely for flavor" (POST 3).** Logged because it
is the richest enumeration of the *design space* and several hooks recur.

**Front-end / routing:**
- **(1)** An event-called "Impeachment Trial" should route through the **Special
  Committee (2.2.2)** flow, **built immediately** when the event fires (votes to
  investigate the office-holders, determines impeachable offenses), resolving
  **before 2.5** — requires **timeline reconciliation across 2.2 / 2.4 / 2.6**
  (the Special Committee is enacted in 2.2 but 2.4 runs after; the OP argues for
  immediate build). **Requires editing the General/Scripted events to allow
  immediate in-House committee creation.** *(This is the front-end the OP wants;
  Ted's counter-proposal §3 DELETES the Special Committee entirely.)*
- **(2)** If an event requires "Controversial" and **none exists** → **randomly
  award Controversial** to a relevant office-holder, then **proceed with the
  Special Committee, or skip it** (since it's the office-holder's first time with
  the trait).
- **(3)** Once the Special Committee rules an office-holder **"impeachable" or
  "at-fault"** (2.2.2 terms; implies they have Controversial), it dissolves and
  the **House Judicial Committee** takes over.

**★ Articles of Impeachment — built by Chair + Ranking Member, NOT all 25** (POST
1.3a–d) — the OP's key fix for the 25-articles break:
- **(3a) Chair** selects from the **13 articles**: base **1**, **+1 if Leadership**,
  **+1 if Lawful**, **+2 if Integrity** (max **5** with all three). **Die per
  selection: 4-6 confirms** an article (then locked from others). **Blocked
  entirely if Chair is Disharmonious / Illicit / Controversial.**
- **(3b) Ranking Member** selects **2** (excluding the Chair's), **+1 if Integrity**
  (max 3). **Die 5-6 confirms.** Same Disharmonious/Illicit/Controversial block.
- **(3c) Members in Leg-Ability order** each select **1** (**+1 if Integrity**,
  max 2). **Die 6 confirms.** Same block.
- **(3d)** If all 13 are confirmed before everyone selects, selection stops; the
  **13 Articles are compiled and submitted to a full-House vote.**
- **Pattern to carry forward:** the **qualifying-offense / Articles-of-Impeachment
  model** = a curated **list of 13 named offenses**, gated by **trait** (who may
  propose) with **dice-confirmation thresholds that ease with seniority/role**.

**Resignation & vote machinery:**
- **(4) Voluntary resignation** before trial: **CPU resigns 33%.** On resignation,
  **33%** the office-holder auto-retires (removed from game). If they stay: dice
  for trait change — **5-6 → Illicit**, **4 → Disharmonious**, **2-3 → Teflon**,
  **1 → lose Controversial + gain Integrity**.
- **(5) House votes each Article individually.** **Integrity** reps always AYE
  regardless of party; **Lawful** reps always AYE if the target has **Illicit**;
  factions vote per normal in-session rules; a **Leadership + Iron-Fist Speaker**
  can override faction votes on a 25% roll; CPU factions impeach opposite-party,
  acquit same-party.
- **(6) If House passes 50%+1** → impeached → Senate. **Per Article: the managing
  player loses 100 pts; the faction leader faces a 33% roll for −1 in their next
  election.**

**Senate trial (POST 1.7–14) — heavy on trait/special-interest flavor (the OP and
Ted both flag POST 3 these as "purely for flavor"):**
- **(7) Senate votes each Article individually**; CPU votes party-line (Blue won't
  convict Blue, Red won't convict Red). Override layers: **(a)** Integrity/Lawful
  senators 50%-convict if target is Controversial + (Disharmonious/Illicit/
  Manipulative); **(b)** ideology/special-interest groups (RW-Activist/Theocrat,
  Reformist/Pacifist, Nationalist/Expansionist, LW-Activist/Civil-Rights) **always
  convict on specific named Articles** — i.e. **each of the 13 offenses is tagged
  to an interest group** (a concrete enumeration of the 13: Public Indecency,
  Perjury, Unethical Private Behavior, Corruption, Contempt of Congress, Unlawful
  decision-making, Tax Evasion, Obstruction of Justice, Bribery, Abuse of Power,
  Inciting Violence, Unethical Political bias — that's 12 named; **the 13th is
  unspecified in-thread**); **(c)** if the target is Likable/Charismatic/
  Harmonious, Moderate Pliable/Lackey/Harmonious senators acquit on a **stacking
  25%** roll; **(d)** LW/RW Populists never convict a fellow LW/RW Populist.
- **(8)** Media-card / Likable enthusiasm & party-preference rolls during trial.
- **(9)** Standard Senate vote-conversion; **any Article hitting 2/3 → convicted →
  removed from game immediately.**
- **(10) Conviction penalties:** controller loses **1,000 pts (5,000 if in 1st
  place)** — **avoided if they resigned first**; party-pref decrement roll; extra
  party/faction penalties if convicted person is a party/faction leader (stacks
  with point-6 hit). **Acquittal blowback:** congressional leaders who voted to
  impeach risk Unlikable (1-2 roll); the pro-impeachment party risks −1 party-pref.
- **(11)** On conviction, factions controlling **Senate Majority Leader + Speaker
  each gain 1,000 pts**; on failure they lose 1,000.
- **(12)** Presidential-acquittal party-pref outcome = **25/25/25/25** split
  (no-change / −1 Pres-party / −1 faction-ideology-enthusiasm / +1 Pres-party).
- **(13)** Reps/senators who voted to impeach/convict a **same-party President or
  VP**: 25% Disharmonious / 50% Integrity / 25% nothing; +5% Can-Party-Flip; +25%
  Independent; 75% −1 / 25% −2 next primary.
- **(14)** No special gains/losses for office-holders other than President/VP.

> **★ KB cross-link:** points (12) and (13) are **the same concrete numbers
> already recorded on #112/DH-54** (from `fixes` §J POST 393, designer-authoritative).
> **This thread (Apr 2023) is plausibly the ORIGIN of those numbers** — they
> appear here first as the OP's proposal and were later ratified/implemented in the
> `fixes` thread. Worth noting for provenance dating.

---

## 3. ★ TED'S COUNTER-PROPOSAL (POST 4, 6) — THE WORKING CONSENSUS (and the #112 origin)

Ted's deliberately simpler model, offered as "simple and effective" against the
OP's 14 points. **This is what the thread converged on** and is **the design
ORIGIN of the impeachment pipeline #112 records.** **vcczar approved Ted leading
it (POST 5) but deferred the detail.**

**The four pillars (POST 4):**
1. **★ ELIMINATE the Special Committee (2.2.2) entirely** — *"an unnecessary
   complication. We'll leave any 'special committee' duties to the Judicial
   committee, which is currently underutilized."* **This DIRECTLY CONTRADICTS the
   OP's point (1)** (which wanted Special Committee as the front-end). **Decision:
   the House Judicial Committee is the front-end; no Special Committee.**
2. **Impeachment is a LEGISLATIVE PROPOSAL** — create proposals to impeach the
   **President, VP, Cabinet member, Senator, Representative, or Supreme Court
   Justice** (historical precedent for each except Representative).
3. **A trait-based voting guide** (CPU); humans decide for themselves, but their
   pols may defect like on any legislative proposal.
4. **Outcome rules** for impeached-not-convicted / convicted / not-impeached /
   resigned.

**★ The full ruleset (POST 6) — the spec:**

**Who can be impeached:** sitting **President, VP, US Senator, Representative,
Cabinet (incl. cabinet-level), or Supreme Court Justice.** **Governors, military
leaders, and ambassadors CANNOT be impeached.** *(★ Non-Presidential impeachment
is explicit — justices & cabinet are in scope; the `ideo1928` trigger was a
Justice. This is the scope the coup #264 treason-trial reuses.)*

**Who can propose & eligibility gates** (proposer must be a **US House member**):
- Proposer **cannot be Harmonious**;
- **Domestic Stability must be below level 5**;
- **One** of: target has **Controversial** / target has **Unlikable** / target is
  **≥4 ideologies from the proposer** (pure ideological impeachment — a LW-Populist
  may impeach a Traditionalist for no other reason; a Moderate can't qualify on
  this alone) / **proposer is Disharmonious** (may impeach anyone).
- **POST 8-9 (Jimmy + Ted agree):** add **Illicit** as an impeachable trait, and
  **Lawful pols are FORCED to vote to impeach an Illicit target.** *(Ted defers to
  vcczar on what Illicit/Lawful are meant to represent — POST 9 — so this addition
  is UNRATIFIED.)*
- **POST 11 (Will) — OPEN, Ted "considered but feels rare enough":** require **2-of-4
  or 3-of-4** conditions, not 1, to keep impeachment rare. **Ted declined** (POST
  13: conviction is already hard and the proposer risks −1,000, so it self-limits).
  **Logged as an open balance lever.**

**Pipeline (POST 6, simplified by POST 31-34):**
- Proposal → **House Judicial Committee** (chair may block/replace per committee
  rules, **but cannot replace an unrelated bill *with* an impeachment**, and an
  impeachment may only be packaged with other impeachments) → **50%+1** →
- **full House** (50%+1) →
- **★ Senate trial. POST 31-34 (ebrk85 proposed, Ted + others AGREED): DROP the
  Senate Judicial Committee vote** — go **straight from full House to full Senate**
  (matches real impeachment: no second committee, Chief Justice presides
  ceremonially, senators are the jury). **Senate at-large requires 2/3 to convict.**
- **POST 11/13 (Will, Ted AGREED):** if the impeachment passes the House, the
  **proposer gains +1 Command and becomes the "impeachment manager"** (the Adam-Schiff
  role) with a **vote-sway opportunity during the Senate trial.**

**★ Outcomes (POST 6) — the three terminal states + resignation:**
- **CONVICTED:** removed from game immediately; **faction −1,000 pts**; **proposer
  gains Integrity + faction +1,000 pts**; seat refilled by established succession
  (Presidency → succession rules; cabinet → nomination; Senator → Governor
  appointee); **DomStab −1 AND Honest-Gov −1** ("witch-hunt perception").
- **DEFEATED** (at any stage — committee, at-large, or chair-blocked): target
  stays; **their faction +1,000 pts**; **failed proposer gains Controversial +
  faction −1,000 pts**; **DomStab −1 AND Honest-Gov −1** ("got away with it").
- **RESIGNS** (allowed any time **before the Senate at-large vote**): ends the
  process; removed from office but **stays in the game**; **gains Controversial +
  permanent −3 to all future elections + cannot be appointed to any position**;
  **faction −500 pts**; **no gain for the proposer**; **DomStab +1 AND Honest-Gov
  +1** ("right thing was done").

**★ Voting guide (POST 6) — the trait-priority cascade** (applies to BOTH committee
and at-large votes; CPU + as a default for human pols):
1. **Integrity** → AYE if target is Controversial, NAY if not.
2. **Disharmonious** → always AYE; **Harmonious** → always NAY (unless step 1
   already decided).
3. **Puritan** → AYE for different-ideology targets, NAY for same-ideology (unless
   1-2 decided). *(POST 6 introduces "Puritan" as the ideological-zealot gate —
   distinct from the OP's "Lawful"; reconcile the trait vocabulary.)*
4. **Everyone else** → follows faction vote (human decides; CPU: proposer's faction
   leader always AYE, target's faction leader always NAY; else **75% AYE if target
   is opposite party, 25% if same party**).

---

## 4. ★ The unresolved DESIGN DEBATES (the open questions this thread leaves)

These are the deltas a builder must resolve; **vcczar never adjudicated them.**

**(A) Meter-gaming exploit — automatic DomStab/Honest-Gov movements (POST 14-17,
35-43; raised by ShortKing, corroborated live in `nuke`/1948).** Because the
meter moves are **assured (no roll)**, players can **weaponize impeachment/
resignation to pump meters**:
- ShortKing (POST 14): in the **1948 playtest** the DomStab crisis was killing the
  GOP; any GOP rep could open impeachment against any eligible pol (Taft was
  Unlikable), and a **voluntary resignation auto-bumps DomStab + Honest-Gov +1**
  — *"most legislation can't even do that at a 100% success rate."* With three
  Unlikable GOP officeholders, **could resign all three to move the meters +3** in
  one turn. POST 35 confirms it **actually happened**: a Republican President
  faced auto-DomStab-to-rock-bottom *even on acquittal*, so **resigning was
  strictly the better outcome than fighting** — a pure cost/benefit, not organic.
- matthewyoung123 (POST 18): the inverse — **tank for the #1 draft pick** by
  eating the −500 (sports-league tanking).
- **Ted's defenses (POST 15, 17, 37):** the **−500/−1,000 point losses are the
  real cost** (*"the points are the whole game"*); and a President resigning to
  save the country is *"an interesting emergent-gameplay narrative"* (Ted **likes**
  the fall-on-your-sword dynamic; notes Pres+VP rarely share a faction, so resign
  is a real sacrifice). **ShortKing/ebrk85 counter** that −500 ≈ one lost
  re-election, cheap if it escapes a −2/−3 DomStab election penalty.
- **★ The proposed FIX (POST 38-43; Jimmy + ShortKing, Ted leans toward it):**
  replace the **automatic** meter swing with a **public-opinion DICE ROLL** (like
  the election October Surprise). Jimmy's draft (POST 38): **1-2 DomStab drop / 3
  DomStab rise / 4-5 Honest-Gov drop / 6 Honest-Gov rise** — *"there shouldn't
  just be a switch flicked."* **Scope: likely Presidential resignations only** (a
  Secretary of Commerce resigning shouldn't move national meters — maybe a
  100-sided roll for lesser offices). **Ted (POST 40):** wants it **heavily
  weighted** toward resign=good-for-country / fight=bad, but agrees with Jimmy
  (POST 40-41) that **fighting can have benefits** (the **Clinton precedent** —
  the impeaching party gets hit for overreach; *"I think we could've seen that in
  1948 with the Democratic majority taking the brunt"*). **STATUS: agreed in
  principle (roll, not switch), exact weights OPEN.**

**(B) Pardons (POST 10, 40-44) — OPEN, unspecified.** Raised but never specced:
does a **presidential pardon** remove the resignation election-penalties /
appointment ban? Ted (POST 40): *"we gotta figure out what a pardon means — at
least it can be a free executive action."* The **Ford-pardons-Nixon** motive
(protect domestic stability) is discussed as flavor. **No rule reached.**

**(C) CPU rules — partially specced, needs ratification:**
- **When CPU PROPOSES (POST 22, 28):** Jimmy's draft — a CPU faction with a
  **Disharmonious + Debater/Orator** statesman proposes impeachment **only if their
  party holds the House majority (50%+1 seats), 25% of the time**, when the
  eligibility gates are met. Ted: *"about right — you'd want it especially rare from
  the CPU, but not impossible."*
- **When CPU RESIGNS vs fights (POST 29-30):** Will's draft — if the **opposite
  party controls the Senate AND conviction looks likely** (traits + makeup), CPU
  **resigns 75%** / fights 25%; if survival looks likely, **fights 75%** / resigns
  25% (Will POST 30: maybe lean harder to resign if opposition holds **60%+** of
  the Senate; CPU is point-driven, won't risk −1,000). **STATUS: drafted, plausible,
  unratified.**

**(D) OFF-TOPIC but logged (POST 19-27):** Jimmy floated a **"top-faction-at-era-end
awards a free trait to a statesman"** incentive (to counter the *being-good-gets-you-
worse-draft-picks* dynamic Matt/Will/ShortKing describe). **Ted rejected** it as a
"rich-get-richer" incentive. Tangential color on the **draft-position-rewards-losing**
balance tension (relates to existing draft-order gaps); **not an impeachment rule.**

---

## 5. ★ SHIPPED-vs-DESIGNED

This is **rules design**; it asserts no shipped behavior beyond the `ideo1928`
trigger and the `nuke`/1948 observations. The standing KB record (b39 tech-lead):

- **`impeach` is ABSENT from `src/` → the impeachment subsystem is 0% built.** No
  legislative-proposal-to-impeach, no Judicial-Committee article step, no
  House/Senate trial pipeline, no resign-at-any-stage flow, no Controversial gate,
  no impeachment-manager Command grant, no meter-effect package. (Tech-lead to
  reconfirm; established empty in batch 40.)
- The **Special Committee (2.2.2)** front-end the OP wanted is **moot** under the
  consensus — **Ted's model deletes it** (verify whether any 2.2.2 / special-
  committee code exists; almost certainly not).
- **General/Scripted-event auto-fire (#221)** is the real interaction bug exposed:
  events fire their actions automatically, so an "Impeachment Trial" event jumps
  straight into a trial with no investigation/committee gate. Any built impeachment
  must decide **when** an event-triggered impeachment runs (Ted POST 4/§3.1 of the
  OP: process it immediately, like other gen-events) — this is the #221 surface.
- The **treason-trial reuse by coup #264** has **no plumbing to reuse** — this
  thread is the spec that must be built (or co-built) for #264 to work.

---

## 6. ★ Mapping to existing gaps (NO new gap numbers assigned — for the consolidation pass)

This thread is the **consolidated design SPEC** behind a cluster the KB currently
tracks only as **scattered "broken/not-written" flags** (DH-33, DH-54, DH-66) plus
a **partial build-requirement (#112)** plus a **dependency (#264)**. It supplies
the *end-to-end design* none of those rows carries.

- **★ DH-66 — DIRECT FOLLOW-UP / RESOLUTION-DIRECTION.** DH-66 records the
  `ideo1928` "Improper SC Justice" / Justice Sanford episode and that *"Ted drafted
  a rewrite (POST 861)."* **THIS THREAD IS THAT REWRITE** (and the OP is the same
  GA). DH-66's "Build TODO" (article generation / trial timing / Controversial-vs-
  <3-judicial gate) is **answered here**: articles built by Chair+Ranking (OP) or
  by a single legislative proposal (Ted-consensus); trial timing = process the
  event-impeachment immediately (POST 4/§3.1) BUT route via Judicial Committee not
  a Special Committee; eligibility = Controversial (Ted drops the <3-judicial path
  by making impeachment a proposal, not an auto-event-target). **Update DH-66 to
  cite this thread as the rewrite source.**

- **★ DH-33 — same broken-3.05 ruleset, now fully cited.** DH-33 = impeachment
  "outdated, doesn't work" (`rep1800`/`hd`). This thread gives the **precise
  diagnosis** (POST 1-2): the rule predates the **3→25-member House-committee
  revamp**, so "every member picks a qualifying offense" produces ~25 articles;
  "qualifying offense" undefined; conflicts with current events. **Cite here for
  the root-cause.**

- **★ DH-54 — the "never written into the rules doc" flag this thread CLOSES (in
  design).** DH-54 = impeachment + VP-vacancy "never in rules doc," "made up as we
  go." This thread is **the missing written impeachment ruleset** (Ted-consensus).
  **Also: points (12)/(13) here are the SAME numbers DH-54/#112 already record from
  `fixes` POST 393 — this thread (Apr 2023) is plausibly their ORIGIN.** (VP-vacancy
  fill is NOT covered here — that half of DH-54 stays open.)

- **★ #112 — DESIGN ORIGIN of the modern-layer impeachment pipeline.** #112 records
  impeachment as *"legislative proposal → House Judiciary → full House → Senate
  trial; resign-at-any-stage; resignation penalties (−3 future / no appointment /
  −500 / loses Integrity); Controversial-gated"* — attributed to in-play `nuke`/
  `modernday`. **EVERY one of those rules is Ted's POST 6 proposal here**, ~6 months
  earlier. **Update #112's source to credit this thread as the design origin** (the
  playthroughs are corroboration, not origin). This thread ADDS to #112: the
  **proposer eligibility gates** (not Harmonious / DomStab<5 / Controversial-or-
  Unlikable-or-≥4-ideologies-or-Disharmonious), the **drop-the-Senate-committee**
  simplification, the **impeachment-manager +1-Command** rule, the **trait-priority
  voting cascade**, the **convicted/defeated/resigned meter packages**, and the
  **CPU propose/resign odds.**

- **★ #264 — the treason-trial DEPENDENCY this thread is the spec for.** #264 (coup
  subsystem) assumes treason-trials "reuse impeachment plumbing… DH-29..DH-35";
  the b39 note already flags impeachment is itself unbuilt. **This thread is the
  authoritative impeachment spec #264 depends on** — specifically the
  **non-Presidential impeachment scope** (Senators/SCOTUS/cabinet, POST 6) and the
  **remove-from-game-and-replace** outcome, which is exactly the treason-trial
  shape. **Cross-link #264 → this digest as the impeachment-plumbing spec.**

- **#61 — succession/acting-president adjacency.** #61 already notes a live
  impeachment subsystem (House impeaches → Senate supermajority-convicts) applied
  to a Justice and threatened against a President, resolving in the legislative
  phase (`summer2021`). Consistent with the **impeachment-as-legislation** model
  here. The **refill-on-conviction** rules (POST 6: succession / nomination /
  Governor-appointee) tie to #61's succession line.

- **#221 — the auto-fire interaction.** The General-Event "Improper SC Justice"
  firing **automatically into a trial, skipping investigation** is the #221
  scripted/general-event-payload surface. Any built impeachment needs the #221
  decision of **when** an event-triggered impeachment runs.

- **DH-29..DH-31/#88 — adjacency only.** DH-29 (Reconstruction) / DH-30
  (event-floor) / DH-31 (procedure-bill routing) are the rest of the founding-
  cluster the coup digest cross-refs as "impeachment plumbing"; only the
  *impeachment* member (DH-33) is substantively this thread's subject.

### ★ RECOMMENDATION (consolidation decides): create ONE consolidated row

**Recommend a NEW consolidated gap — "Impeachment subsystem (Legislative-Proposal →
House Judicial Committee → full House → Senate 2/3 trial; resign-at-any-stage;
trait-gated voting; meter/point packages; non-Presidential scope)"** — rather than
continuing to scatter the design across DH-33/DH-54/DH-66/#112. Rationale (mirrors
the coup digest's #88 recommendation):
- The subsystem is **0% built** and has **no single owner row** — DH-33/DH-54/DH-66
  are all *flags that it's broken/unwritten*, not the *spec*; #112 carries a partial
  build-requirement bundled with 5 other modern-layer features; #264 *depends* on it.
- This thread provides the **complete end-to-end design** (the consolidation target).
- The consolidated row should **subsume DH-33/DH-54/DH-66 as corroborating flags**,
  **link #112** (modern-layer instance) and **#264** (treason-trial reuse) as
  consumers, and carry the **open levers** (meter-swing-as-roll vs auto §4A; 1-vs-2-of-4
  gates §3; pardons §4B; CPU odds §4C; Special-Committee deleted vs kept; trait
  vocabulary reconcile — Lawful/Puritan/Illicit/Teflon).
- **★ Tag the whole row "DESIGN-INTENT, NOT designer-ratified — vcczar DEFERRED
  (POST 47/48)."** This is the single most important caveat: the consensus is
  Ted-led, not signed off by the ruleset owner.

*(If consolidation prefers minimal churn: at minimum fold this thread's full spec
INTO #112 and update DH-33/DH-54/DH-66 to cite it as the rewrite source.)*

---

## 7. Open questions for the human (impeachment-specific)

1. **Ratify the model.** vcczar deferred (POST 47/48). Pick: **Ted's
   legislative-proposal model (consensus)** vs the OP's elaborate 14-point/Special-
   Committee model. (Recommend Ted's — it's the convergence and the #112 basis.)
2. **Special Committee (2.2.2): delete or keep as front-end?** Ted deletes it (POST
   4); the OP's whole point (1) depends on it. Decide before building (affects #221).
3. **Meter swing: automatic or public-opinion roll?** (§4A) Agreed-in-principle to
   make it a roll; **weights + scope (Presidential-only vs all offices) OPEN.**
4. **Eligibility gates: 1-of-4, 2-of-4, or 3-of-4?** (§3, Will vs Ted) — balance
   lever for impeachment frequency.
5. **Pardons** (§4B) — entirely unspecced. Does a pardon void resignation penalties /
   the appointment ban? Is it a free executive action?
6. **Trait vocabulary reconcile:** Lawful (OP) vs Puritan (Ted) for the ideological-
   zealot vote; add Illicit as impeachable + Lawful-forced-vote (POST 8-9, unratified);
   the OP's Teflon-on-resignation trait. Settle the canonical trait set.
7. **CPU propose/resign odds** (§4C) — drafted (Disharmonious+Debater/Orator, 25%,
   House-majority gate; resign 75% if opposition Senate + likely conviction) — ratify.
8. **Article model:** does the build use the OP's **13-named-offense + Chair/Ranking
   dice-confirmation** machinery, or Ted's **single-proposal** abstraction? (Affects
   whether the 13 qualifying offenses need authoring as content; note the OP's list
   names only 12 — the 13th is unspecified.)
9. **Pres+VP simultaneous impeachment packaging** (POST 6 allows it) — confirm.

---

## Sources

- **ae435b5f** "Fourteen Points on Impeachment" (politicslounge topic 1862), **48
  posts / 2 chunks, Apr 2 – May 4 2023.** Tier-1 **MrPotatoTed** (authored the
  consensus rewrite, POST 4, 6) + **vcczar** (approved Ted leading it POST 5,
  **DEFERRED ratification POST 47/48**); tier-4 **10centjimmy** (OP / Fourteen
  Points, the `ideo1928` GA) + playtesters **ShortKing, Willthescout7, ebrk85,
  matthewyoung123**. The **design-spec follow-up to the DH-66 `ideo1928` Justice-
  Sanford episode** and the **design ORIGIN of the #112 impeachment pipeline**.
  Cited posts: **1, 2, 4, 5, 6, 8, 9, 11, 13, 14, 15, 17, 18, 22, 28, 29, 30,
  31-34, 35, 36, 37, 38, 40, 41, 47, 48.**
