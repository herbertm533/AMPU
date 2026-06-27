# Digest — "Cal's Most Influential Politicians in American History: 1783"

- **Slug:** `b0bf5d78-cals-most-influential-politicians-in-american-history-1783` | **56 posts / 2 chunks** | Sep 2021 → Feb 2022.
- **Type:** PLAYTEST-NARRATIVE / RANKING RECORD (companion thread). @Cal maintains a running top-10 "most influential politicians" leaderboard, re-issued per 4-year phase with prose on each figure's in-game arc; thread terminates when it's published to the AMPU blog (POST 52).
- **Which playtest:** ★ **The `fe15db25` "Summer 2021 AMPU Playtest" (`summer2021` digest, batch 26 — ALREADY INGESTED).** Definitive match: identical alt-history presidential line **Benedict Arnold → Francis Lightfoot Lee → Pierce Butler → (Daniel Hiester)** [game-context.md L688-689 / L1847-1848]; same founding polarity (RED=Federalist / BLUE=Anti-Federalist), same VP-Washington detail, same relay GMs (@vcczar/@MrPotatoTed/@Rezi all post here; @Cal is the leaderboard author). **Not a new missing upload** — corpus-coverage cross-ref only.
- **Hard-gap value: LOW** (it's commentary on an ingested run). **Signal value: the cleanest narrative confirmation of the PV / "influence" model** (#214/#215/#192) — what makes a pol rank, observed across four phase-snapshots.

## The leaderboards (per-phase, with movement)

**1783** (POST 1) — pre-Constitution, war just won:
1 Artemis Ward · 2 Benedict Arnold · 3 Joseph Bloomfield · 4 Benjamin Franklin · 5 William Paterson · 6 Alexander Martin · 7 Samuel Huntington · 8 Roger Sherman · 9 John Langdon · 10 William Franklin. Watch: Daniel Hiester (Blue), C.C. Pinckney (Red).

**1784** (POST 13) — gubernatorial elections + CC appointments only:
1 Ward (=) · 2 Bloomfield (+1) · 3 B.Franklin (+1) · 4 Paterson (+1) · 5 A.Martin (+1) · **6 Arnold (−4** — ambassadorship done, "nowhere to rise without a faction-leader roll") · 7 W.Franklin (+3) · 8 Elbridge Gerry (NEW) · 9 Huntington (−2) · 10 George Washington (NEW, as 7th CC President). Dropped: Sherman, Langdon (lost office → "no longer significant").

**1788** (POST 20) — post-Constitutional-Convention, first federal elections:
1 TIED **Arnold (+5** — unanimously elected first President) & **Bloomfield (+1** — signed Constitution) · 3 Ward (−2, snubbed at CC) · 4 Paterson (=) · **5 George Wythe (NEW** — chosen to lead the CC + authored the Constitution; "most meteoric rise") · 6 B.Franklin (−3) · 7 A.Martin (−2) · 8 Washington (first VP) · 9 W.Franklin (−2) · 10 Andrew Adams (NEW, proposed the House/Senate bicameral system). Dropped: Huntington, Gerry.

**1797** (POST 42) — two presidencies in the books:
1 Arnold (=, one-term Pres, lost reelection in a landslide) · **2 Francis Lightfoot Lee (NEW** — 2nd President) · 3 Bloomfield (−1, Gov NJ) · 4 Paterson (=, first Chief Justice) · 5 Wythe (=, President Pro Tem) · 6 Ward (−3, **killed in battle** vs natives) · 7 B.Franklin (−1) · **8 Daniel Hiester (NEW** — 2nd VP, "Renaissance man" from a lucky start-of-game event) · 9 Washington (−1, now Rep) · 10 William Paca (NEW, 17-yr Gov of MD). Watch: Andrew Jackson (Blue), Pres. Pierce Butler (Red, "richest person in America", succeeded Arnold).

## What drives "influence" (= PV/office signal — for #214 / #215 / #192)

The leaderboard is an organic, human-authored proxy for PV ordering, and it tracks **office held** above all — strong corroboration that AMPU influence ≈ high PV ≈ office:

- **★ Presidency dominates everything.** @Cal's explicit thesis (POST 27): "this list will trend heavily towards presidents… they just have so much more individual influence rather than the sharing of responsibilities from Congress." Arnold leaps **+5 to #1 the cycle he wins the Presidency** (POST 20); Lee debuts at **#2 the cycle he becomes 2nd President** despite being "pretty much unimportant before his presidency" (POST 56). This is the office→PV weighting (#215) made visible: the office, not the résumé, sets the rank.
- **★ Office LOSS = immediate PV collapse.** Sherman & Langdon fall off the instant they lose their seat/appointment ("important because you were always there. And then you weren't" POST 13); Arnold drops **−4** the moment his ambassadorship concludes (POST 13). Influence is held-office-gated, not cumulative-legacy — consistent with the shipped PV being office-weighted (`pv.ts`), and a counterpoint to the proposed legacy/monument system (#180).
- **★ Military command ranks #1 *early*, then decays.** War-hero Ward holds #1 in 1783/84 on pure command (0 domestic — "doesn't have a leg to stand on domestically", POST 1) but slides to #3→#6 once the war ends and others gain office; the **0-domestic war-hero at #1** is exactly the trait/command over-weighting flagged for #214/#192. Note the symmetry: Arnold (Chief Admiral, naval war) ranks #2 *for the same reason* and only sustains it by converting it into the Presidency.
- **★ Founding-document authorship + CC presidency are durable PV anchors.** @Cal calls "Author of the Constitution," "President of the Constitutional Convention," and "First President" **guaranteed list spots** (POST 14). Wythe rockets to #5 purely on writing the Constitution; Paterson holds top-5 across all four lists on DoI-authorship + Chief Justice. Maps to the #215 office curve crediting CC-President / document-author roles.
- **Backroom / faction-conversion = real but secondary influence.** Arnold's #2 in 1783 is credited largely to **converting Muhlenberg, Ward, W.Franklin, Moultrie, Armstrong to the Traditionalist faction** (POST 1) — a backroom/leadership effect — but it doesn't sustain rank once he's out of office. Michael Jenifer Stone is floated for "almost completely controll[ing] Congress" via the Speakership (POST 40), and Hiester's value is "Faction Leader… thorn in the side" (POST 42) — congressional/faction power is acknowledged but explicitly judged "VERY small fish" vs the Presidency (POST 27).
- **Command is a hard gate on presidential ambition.** POST 45: Bloomfield "has no command, and as long as Hiester is still active, Bloomy has essentially zero chance" at the Presidency — corroborates Command as the presidential-run prerequisite/action-budget (#182; `summer2021` #182).
- **Mismatch / debate datum:** the #1-influence call is contested in-thread (vcczar POST 3 "Arnold is #5 at best"; later concedes #1 is "debatable" once Arnold wins the Presidency, POST 19/23). Shows the community itself treats raw influence-ordering as noisy at the top when command-heroes and office-holders are weighed against each other — the same tension the #214 trait/command re-weight aims to settle.

## Mechanics glimpsed (all corroborating, no new systems)

- **Treaty of Paris** = a team roll involving the **Ambassador (Arnold) + Sec. of War (John Jay) + possibly Sec. of State (Jefferson)**; uncertainty in-thread over which office owns it (POST 23-26) — corroborates the federalism diplomacy/ambassador spine (#177) and shows the GM himself was fuzzy on office ownership.
- **NW-Indian-War losses** persist into the Arnold/Lee presidencies ("lost again and again to natives in Ohio", POST 42) — corroborates #178.
- **Veto + override**: Lee = first president to veto (US Mint, Cotton Tax) and first to have a veto **overridden by 2/3 of Congress** (POST 42) — corroborates the 2/3-each-chamber override rule.
- **Peaceful transition precedent**: Arnold refuses to contest results / declines martial-law urging from military loyalists (POST 42) — emergent narrative, no mechanic.
- **Pacamandering / Court-Paca-ing**: William Paca "invented" in-state gerrymandering + court-packing as Gov of MD for 17 yrs (POST 36, 42) — flavor labels for state-level redistricting/judiciary control; no evidence of a discrete shipped mechanic (likely GM narration over governor actions).
- **"Lucky random event"** gave Daniel Hiester ability in every area at game start (POST 42) — a start-of-game skill-boost event, consistent with per-2-yr skill rolls / random-event traits.
- **History tab** referenced as the source of record for who-served-when (POST 8) — UI confirmation only.

## Candidate gaps for consolidation (LOW volume — by design)

1. **PV-SIGNAL (corroboration, no new row) — #214 / #215 / #192.** Strongest *narrative* evidence in the corpus that AMPU "influence" tracks **office-weighted PV**: Presidency >> document-authorship/CC-Pres > governorship/Congress > faction-leadership; office LOSS = instant PV collapse (no legacy carry); early-game war-command over-weights (0-domestic hero at #1 → #6) exactly as the #214 trait/command re-weight targets. Useful as the human-authored sanity check for "does in-game influence track PV sensibly?" — answer per this thread: **yes for office, over-weighted for raw command early.** Feed to #215 office-curve + #214 command re-weight.
2. **CORPUS-COVERAGE cross-ref (NOT a missing upload).** This leaderboard = the companion/record artifact of the **already-ingested `fe15db25` `summer2021` playtest** (Arnold→Lee→Butler→Hiester line; same polarity/GMs). Confirms `summer2021`'s alt-history president roster from an independent in-thread source; adds nothing to the ≥7-missing-playtests list.
3. **Command-as-presidential-gate (corroboration) — #182.** "No command → essentially zero chance at the Presidency" (POST 45) reconfirms Command as the presidential-eligibility/action-budget gate already logged via `summer2021` #182.
4. **(Possible, weak) legacy/monument tension — #180.** This thread's rule that influence does NOT survive leaving office is a design-tension counterweight to the proposed monument/legacy-trait system (#180): a built "legacy" stat would change who ranks here. Flag for the #180 owner; not a new gap.

## Open question (minor)

- **Treaty / diplomacy office-ownership** (POST 23-26): Ambassador vs Sec. of War vs Sec. of State — which office "owns" treaty negotiation rolls is unsettled even to the GM. Pin a canonical owner when #177 is specced.
