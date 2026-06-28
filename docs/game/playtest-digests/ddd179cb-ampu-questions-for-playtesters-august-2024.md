# Digest — `ddd179cb-ampu-questions-for-playtesters-august-2024` ("AMPU — Questions for Playtesters, August 2024")

**Type:** PLAYTESTER FEEDBACK SURVEY (qualitative UX / balance / fun signal). NOT a playthrough.
**Scope:** 22 posts / 1 chunk, Aug 6–26 2024. vcczar (tier-1) posts a 10-question + bonus survey
(POST 1); ~8 playtesters answer (tier-4). The rest is community chatter (POST 3-8, 16-19 — a
missing-player in-joke; ignore). The sibling upload `754a0a4c-group-discussion-2-3-appointments`
is a byte-identical duplicate of this thread — ignore it.
**Value:** The corpus's single best **direct UX/balance/fun signal on the real build**. Where playthrough
digests show what *happened*, this shows what players think *works*, what's *not fun*, and the ONE thing
each would change. Highest-value items: **Q8 (not-fun) + Q10 (one change) + the Bonus (ideology-disadvantage
/ repeal-mechanics balance hypothesis)**. Citations are to `===== POST n =====` markers.
**No new architecture deltas** — this thread CORROBORATES + adds qualitative weight to existing gaps.
Tier note: vcczar = tier-1 (posed the Qs + the Trad/repeal hypothesis); answers = tier-4 opinion.

The 10 Qs (POST 1): 1 favorite pol · 2 most-annoying opponent · 3 "Henry-Clay-like" outsized pol ·
4 most-skilled playtesters · 5 favorite legis/military battle · 6 favorite election · **7 moment of FUN** ·
**8 moment of NOT-fun** · **9 what works BEST (pick one)** · **10 the ONE change you'd make**. Bonus =
the ideology-disadvantage / repeal-weakness balance hypothesis.

---

## ★ THE BONUS — ideology-disadvantage + repeal/Traditionalist weakness (the actionable balance hypothesis)

vcczar's tier-1 hypothesis (POST 1, verbatim-repeated each survey re-post): **Libs/Mods/Cons dominate
the political timeline, so LW-Pop / RW-Pop / Progs / Trads should feel disadvantaged.** "I'm most worried
about **Trads because repealing bills seem to get overlooked or gain little support**. Rarely do people
want to go backward even if they rhetorically speak in the language of nostalgia." Every playtester data
point on this:

- **★ Repeal mechanics are HIDDEN / hard to find — the load-bearing, recurring finding.** Two independent
  players flag that the repeal lever is buried in the rules sheets, not that it's mathematically broken:
  - jnewt (POST 20): "The note about **gaining points for attempting a repeal for trad-favorable
    legislation or vice versa is definitely well hidden in 2.6**." → the repeal-incentive rule *exists*
    (in rule section 2.6) but is undiscoverable. A UX/legibility problem as much as a balance one.
  - pman (POST 21): "the main issue for repealing is that the **option isn't really easy to see in
    sheets**. I think rework could make it better but it might be too late for that."
  - **Synthesis:** the repeal mechanic is under-used because it is *invisible*, not because the payoff is
    nominally zero. Surfacing it (a first-class "repeal" action with visible point payoff) is the implied fix.
- **Is the disadvantage historically accurate?** Strong tier-4 consensus = **yes, period-accurate, keep it**
  (do not "fix" by buffing extremes):
  - 10centjimmy (POST 13, plays prog/LW-Pop): "Left pops/progs certainly are tough, but I wouldn't say
    it's unrealistic… haven't played trad so hard to say."
  - jnewt (POST 20, primarily prog/LW-Pop): "yea, the cards are not in favor for us most of the time…
    such extreme views are historically derided and it is **period accurate**… overall I find it
    **challenging in a good way**." Notes **settings (#263) would eventually make extremes easier**.
  - pman (POST 22): "I don't think those are at a significant disadvantage. **Red Trads are at a big
    advantage from the era of Neocons on.** I've never been LW Pop — I assume they'd be disadvantaged
    throughout. **Red 1 [far-left Red faction] never gets 'an era' to dominate like Red 5 does**" →
    nuance: disadvantage is FACTION/ERA-specific, not blanket-by-ideology. Far-left-Red (Red 1) is the
    structurally worst seat; RW-Trad is strong post-1980.
  - RW-Pop strategy is "shift Mods/Cons rightward via deals," reported as hard-but-doable (pman POST 22;
    cf. ShortKing's Mike Castle "left-wing of a rightward-shifting party" challenge, POST 20).
- **★ Moderate content gap (a DISTINCT, opposite-direction balance datapoint).** matthewyoung123 (POST 11
  Bonus): "**there are too few bills that give points to Moderates. It almost always seems like it's a
  battle between Trads/Cons and Libs/Progs.**" vcczar's tier-1 REBUTTAL (POST 12): intentional —
  moderates are the *majority* of politicians (advantages elsewhere) and "pay the price" of being
  moderate (excite no one, drive little change); **he'll only adjust post-release if moderates are
  getting obliterated on scoring.** → A designer-declared "won't-fix-yet" with a measurable trigger.

**Bonus takeaway:** the Trad/extreme disadvantage is mostly *intended and liked*; the real, fixable defect
is that **the repeal incentive is invisible in the sheets** (POST 20-21). The Moderate-content question is
a separate, explicitly-deferred balance watch (POST 11-12). Both map to existing coverage/balance gaps —
see deltas.

---

## ★ Q8 — moments of NOT-fun (the pain inventory) + ★ Q10 — the ONE change (each player's top ask)

The two highest-value questions. Pains and asks clustered by area; attribution in parens.

**Cabinet assembly — POLARIZING (fun for some, the worst part for others).**
- NOT-fun: ShortKing (POST 2): "**Every single time we have to build a Cabinet.** Difficult to get folks
  well-qualified AND satisfy the lobby, ideology, and faction interests — which is by design but it's
  never fun."
- Fun, same mechanic: Euri (POST 9, Q7): "**Cabinet creation is by far my favorite part.** I like all the
  competing variables." MrPotatoTed (POST 14, Q7): "love having to balance everything when creating a
  cabinet." → The cabinet-constraint solver is *working as designed* (#31 diversity/regional/equity
  penalties, #25 firing/tenure); the friction it produces is the intended difficulty — keep, don't flatten.

**Lingering / "Processing Lingering" — the GA/CPU bookkeeping tarpit (strongest single pain cluster).**
- matthewyoung123 (POST 11, Q8, as Game Administrator): "**Processing Lingering! Ugh, the most
  time-consuming, boring portion of being a GA.**"
- jnewt (POST 20, Q8): "I concur, **lingering has to be the most time-consuming aspect** of the game's
  phases. Just so much to check and re-check."
- MrPotatoTed (POST 14, Q10): "I'd make it into a **computer game so I didn't have to CPU all the time**."
  → This is the THESIS for the whole browser port: the manual GA/CPU labor (Lingering chief among it) is
  the load-bearing cost the app removes. Maps squarely to #114 (manual-CPU burden) + the Lingering engine
  rows #179/#134/#67.

**Random events as President — feels punishing + too negative.**
- Euri (POST 9, Q8): "**Random events as President. You can do everything right and still get absolutely
  skewered.** Also I feel like **not enough of them are positive.** Positive stuff happens in America too."
  → A *content-mix/tuning* ask (more positive presidential-tier event outcomes), distinct from the
  "is it fun?" of the chaos itself (which MrPotatoTed loves, POST 14 Q7: "I love all of 2.4… the absolute
  chaos… is perfection"). The signal: skew the 2.4/2.8 outcome distribution less relentlessly negative.

**Dice-roll variance — "it's basically Risk."**
- 10centjimmy (POST 13, Q8): "Sometimes I struggle with dice rolls. **It's almost like Risk where you can
  have every possible advantage and still lose when you roll a 1 and the other guy gets a 6… multiple
  races in a row!**" pman (POST 22, Q8): the meta-version — "when I took winning too seriously. It's a
  game." → Perceived swinginess of the d100-vs-threshold model when the favorite still loses a streak;
  a *feel* note on variance, not a request to remove luck (others cite upsets as the BEST part, Q7).

**Governor phase — boring / dead air (TWO votes; vcczar concurs with a fix already planned).**
- MrPotatoTed (POST 14, Q8): "**Governor actions.** Anything can happen in any phase… and then there's
  Governor Actions, where **nothing interesting at all happens for an entire phase.**" Q10 echo: "I'd
  **simplify the Governor phase** — I don't find it interesting and want to get it over with."
- vcczar's tier-1 REPLY (POST 15): a planned (hopefully free) **DLC fleshing out governors/states — no
  new offices, but more randomization: regional events that gate or modify action success.** → A
  designer-acknowledged weak phase with a committed direction (more randomized regional flavor on #20).

**Executive Actions — too hard to implement / not worth the points / blunders too easy.**
- jnewt (POST 20, Q10): "**Executive Actions are two-fold too difficult to implement (or aren't worth the
  points) and the blunders for implementation are too easy to come by.**" → A balance-tuning ask on the
  Exec-Actions library (#23): lower the difficulty/blunder rate or raise the payoff. (Earlier-thread
  rulings #131/#132 also touch Exec/Gov-action eligibility.)

**Skill-development bottleneck — too many pols stuck at floor stats with nowhere to grow (TWO votes — the
most-requested Q10 change).**
- ShortKing (POST 2, Q10): "**make it a little easier to earn ability in legis.** So many pols end up
  useless because admin/judicial/military is too low to do anything, the career track to develop them is
  filled up, and they **languish — can't even run for anything to earn abil increases through committee
  assignments.**"
- Euri (POST 9, Q10): "**Admin is the most important skill** and it's hard to have enough competent pols
  in it. Making it easier to gain Admin via random events or another mechanism would alleviate that and
  **reduce the number of pols stuck on 1 Admin with nowhere to go.**" (POST 9 Q9 also: Admin is the
  most-important skill, in his view.)
  → Strong two-player consensus: the skill-gain economy traps low-stat (esp. low-Admin / low-Legis) pols
  in a dead end because the committee/career path to grow them is gated by stats they don't have
  (chicken-and-egg). Closest existing home = #163 (career-track seeding to fix "generational pols stuck at
  floor stats") + #190 (expertise-as-election-modifier) + #252 (committee→expertise coarseness); but
  none owns the **skill-gain accessibility / anti-floor-trap balance** as the asked-for lever. Candidate
  to confirm a home exists; flagged below.

**Foreign affairs — too inert / under-developed (TWO distinct asks).**
- 10centjimmy (POST 13, Q10): "I'd want a **more involved foreign affairs phase. Anyone with admin should
  be eligible to be an Ambassador**, and their actions could have more flavor."
- pman (POST 22, Q10): "I'd change foreign policy — **not having NATO automatically impact the foreign
  relations meter frustrates me, specifically Article 5.**" → alliances should auto-move the
  relation meter.
  → Both map to the Diplomacy subsystem #107 (per-nation relation ladder + ambassador menu): broaden
  ambassador eligibility (any-Admin), add action flavor, and wire alliance-membership (NATO/Art.5) to
  auto-adjust relations. pman's NATO/Article-5 point also touches the treaty subsystem #267.

**Military / war + treaties — wants an overhaul (and several players just don't enjoy war).**
- matthewyoung123 (POST 11, Q10): "**the Military combat system and how many Generals/Admiral slots there
  are at various times. The Military/War system and treaties could use a good review and overhaul.**"
- War-aversion datapoints (relevant to war-frustration gaps): pman (POST 22, Q5) "I don't particularly
  enjoy the military aspect"; matthewyoung123 (POST 22 — wait, pman) and others lead with legislation, not
  war, as their favorite battle. → Corroborates the war-system gripes #45/#155 (generic war engine +
  Union-too-easy balance) and folds in a NEW-ish specific: **General/Admiral SLOT COUNTS vary oddly by
  era** and **treaties need review** (treaty review = #267).

**Judicial / Supreme Court — wants a real RNG-driven overhaul.**
- pman (POST 21, Q10): "**Entire Judicial System** is the main issue I have. Needs an overhaul, especially
  the Supreme Court — I'd allow **random acts to be tested in the Supreme Court** (laws determining which
  cases it can take and how many). This RNG would heighten surprise — you'd have to account for SCOTUS too."
  (POST 21 Q5: a player took a slavery-compensation act to SCOTUS, which *downgraded* rather than repealed
  it — SCOTUS as a working strategic lever already exists.) → Maps to the judiciary-overhaul cluster
  #251 (Judicial Philosophy + Focus Courts, mostly AMPU-2) and #252 (committee→judicial-expertise too
  coarse). pman's specific add: **a randomized cert/docket mechanic** (random laws challenged, count gated
  by law) — a flavor on #251's Rule-of-Four cert path.

---

## ★ Q9 — what works BEST (the strengths — what NOT to break)

Overwhelming, near-unanimous answer: **the legislative phase (Congress, proposal → executive action) and
the primaries are the game's core strength.** Protect these.

- **Legislation / Congress (the clear #1 — 5+ votes).** matthewyoung123 (POST 11): "legislation in
  Congress — on its face easy, but peel back the layers and there are all sorts of tricks, shenanigans,
  and traits that figure into getting a bill passed." 10centjimmy (POST 13): "the legislative phase from
  proposal to executive action works **exactly as it should** — impacts are felt, votes change, strategy
  comes into play." pman (POST 21): "national politics, congress to president… shows how the USA was built
  on compromising." pman again (POST 22): "the legislative phase — tons of fun." (Several Q5 favorite-battle
  answers are also legislative: alt-14th-Amendment passage POST 11; carriage excise-tax saga POST 20;
  passing conservative bills under a liberal President POST 22.)
- **Primaries (#2).** ShortKing (POST 2): "the primaries feel very well-fleshed-out and one of the most
  dynamic and engaging parts." (cf. Q6 favorites: 1980 Dem primary with the first minor-candidate
  momentum-rise POST 13; 1968 acting-President beating two intra-party challengers POST 9.)
- **Elections — least-ambiguous, most-trusted resolution.** jnewt (POST 20): "Elections hands down have
  the **least ambiguous determination for how it's processed.**" (Contrast pman wanting MORE RNG in
  SCOTUS — players value elections precisely for being *legible*.)
- **The career-ladder in the legislative phase (designer's own pick).** MrPotatoTed (POST 14): proud of
  career advancement as a ladder — committee → chair → whip → Leader/Speaker — and that "**there isn't a
  safe place to dump Representatives or Senators** where they'll be out of the way. They can cause problems
  anywhere; all you control is which problems they get the power to cause." (Tension worth noting: this
  *designed* no-safe-dump property is the flip side of ShortKing/Euri's POST 2/9 complaint that low-stat
  pols can't grow — the ladder works for the able and traps the unable.)
- **Per-politician individuality + alt-history (the core *concept* draw).** Euri (POST 9): "all the
  politicians are represented individually — I like that most about it as a concept." matthewyoung123
  (POST 11, Q7): the historian's joy of watching real figures (Clay, Lincoln, TR) and unknowns (Silas
  Wood, Francis Granger, Robert Pattison) rise or fall. → This is the irreplaceable hook; #114's solo-app
  must preserve the named-individual roster + emergent alt-history.

**Q9 takeaway for the charter:** the legislation engine + primaries + legible election resolution are the
crown jewels. The browser port must NOT trade their depth/legibility for automation convenience.

---

## Q3 — "Henry-Clay-like" outsized non-president pols (an EMERGENT-BALANCE signal worth keeping)

Players repeatedly cite a **powerful Senate/Speaker leader who dominates without the Presidency** as a
*beloved* emergent outcome — i.e. the legislative-leadership power curve is producing the intended
"kingmaker" archetype:
- **LBJ as iron-fist Senate Majority Leader** — cited by 3+ (ShortKing POST 2 "more fun than being
  President"; 10centjimmy POST 13; jnewt POST 20; vcczar pairs LBJ + Mansfield POST 2). The single
  most-cited "punches above his weight in Congress" figure.
- **Ulysses S. Grant** dominating the Gilded-Age GOP — "could handpick any president he wanted" (ShortKing
  POST 21, re pman's Grant). **Francis Cockrell** — 40-yr MO Senator, perennial "kingmaker… never got the
  nod himself" (matthewyoung123 POST 11). **John Thune** as 2016 Senate Majority Leader "basically
  defeated an entire slate of cabinet officials himself — I think we changed those rules thanks to him"
  (pman POST 22 — a balance nerf already applied to over-strong Majority-Leader cabinet-blocking). **Ted
  Stevens** as a 5-legislative Senate Majority Leader "gives you so many options" (pman POST 22).
- → The Q9 strength (legislative phase) and the Q3 archetype are the same engine. The one historical
  *correction* applied: Majority-Leader unilateral cabinet-blocking was over-strong and got reined in
  (pman POST 22) — corroborates the cabinet-confirmation tuning lineage.

---

## Q1/Q5/Q6 — flavor/alt-history color (LOW gap value; corpus-coverage cross-refs)

Largely emergent-narrative delight (the Q9 "individuality + alt-history" draw in action). A few
mechanically-relevant or coverage-relevant items:
- **Line-item veto + term-limit-repeal = an all-powerful-presidency exploit (historical, now patched).**
  MrPotatoTed's marquee story (POST 14): as G.W. Bush he played both parties' extremists off each other,
  won the line-item veto AND repealed presidential term limits, then ran for a 3rd term. "I remember I
  convinced Republican extremists to **repeal the right for black Americans to vote** in like 2004 —
  preposterous and **no longer a valid move; back then ANY law could be repealed.**" → Direct
  corroboration of the **per-law repealability flag #175** (the un-repealable / replace-only law class
  was added precisely to kill this kind of move). Note: also confirms line-item-veto and term-limit-repeal
  as real reachable game-states.
- **Canada invasion = a celebrated rare win.** 3 players cite invading/annexing Canada as a favorite
  military moment (Euri-as-Buchanan POST 9; 10centjimmy's 1858 invasion POST 13 — "the only time in a
  test the US has won an invasion, excited to see Canadian politicians") → corroborates territory-via-war
  (#178) + that *winning* offensive wars is RARE (consistent with the war-balance gaps).
- **SCOTUS as a working strategic lever** — a slavery-compensation act taken to the Court and *downgraded*
  (not repealed), continuing slavery only in pro-slavery states (pman POST 21 Q5). Working judicial-review
  mechanic in evidence (context for the #251/#252 overhaul asks and pman's Q10).
- **Minor-candidate momentum works** — Milton Shapp (first minor candidate to win a primary phase and gain
  momentum, 1980 Dem primaries, 10centjimmy POST 13). Relevant to the withdrawal/endorsement-momentum gap
  #183 (momentum value generally) — here momentum is shown *working* for an insurgent.
- **Playtest cross-references (corpus-coverage; many likely have/need own digests):** 1840-start
  (Ich_bin_Tyler / OrangeP47 — Pattison, Granger, Cockrell, POST 11); 1800-start (ebrk85 GM — "Pottery
  Barn" Wood/Clay ticket, carriage excise tax, jnewt/Jefferson dominance, POST 11/13/20/21/22); 1948-start
  (Soapy Williams, Ted Stevens, conservative-bills-under-liberal-President, POST 13/22); 1868 "Gilded Age"
  (Blaine, Grant, end-Reconstruction-for-cabinet deal, POST 21); 2016 "modern day" (Thune, Bush-extremist
  play, Oprah 2004 candidate, Benedict-Arnold-for-President goal, POST 14/22); 1828/1856/1860/1868/1980/1980
  elections referenced. Confirm each maps to an existing digest.

---

## Candidate gaps for consolidation (all map to EXISTING gaps — no new IDs)

Mapped in the delta list returned to the orchestrator. Two items are flagged as possibly-unowned and need a
home decision by the consolidation pass:
1. **Skill-gain accessibility / anti-floor-trap balance** (POST 2, 9 — the most-requested Q10 change:
   make it easier to grow low-Admin/low-Legis pols; too many languish because the career path to earn
   skill is itself stat-gated). Closest existing: #163 (career-track seeding for floor-stat pols), #190,
   #252 — but none owns the *skill-gain-economy accessibility* as the lever players ask for. Candidate.
2. **Presidential random-event outcome mix is too negative** (POST 9 — "not enough are positive"). A
   content-mix/tuning ask on the 2.4/2.8 event tables; verify whether any coverage/tuning gap owns
   event-outcome *positivity balance* (adjacent to #262 coverage + #221 content engine). Candidate.

## Open questions (for the human)
- **Repeal legibility (POST 20-21):** is the fix purely UI (surface the repeal point-payoff that already
  exists in rule 2.6) or also a buff to repeal support values? Players say it's *hidden*, not *broken* —
  lean UI-first. (Engine: repeal + Trad support is the suspected weak spot; #132/#175 touch repeal rules.)
- **Moderate scoring (POST 11-12):** vcczar deferred any moderate-content buff to post-release pending
  evidence moderates are "getting obliterated." Define the measurable trigger (#262 coverage tracking).
- **War General/Admiral slot counts vary oddly by era (POST 11):** is the slot count a tunable already, or
  a new sub-requirement under the war-system overhaul (#45/#155)?
