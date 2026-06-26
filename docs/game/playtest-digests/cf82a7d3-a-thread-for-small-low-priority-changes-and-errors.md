# Digest — `cf82a7d3` "A Thread for small low priority changes and errors"

> **Final committed thread-digest. DISCUSSION thread, not a playtest.** 10 chunks /
> 804 posts / 496k chars (single-pass reduce — a structured catalog, not a play
> narrative). Citations are `===== POST n =====` markers. Raw chunks are
> gitignored/disposable; **this digest is the durable record.** This is the
> **first DISCUSSION-thread ingest (batch 12a)** in the KB — a community-curated
> **dataset + small-mechanical-error catalog**, started by `@Imperator Taco Cat`
> April 2023 and **still being updated through May 2026** (latest post 804). The
> OP's framing: *"This is not a thread for major changes to game rules or systems
> but fixing small errors. Pols with stats mixed, not being labeled the right
> religion or legislation with swapped around effects."* POST 1.
>
> **★ Headline:** A **3-year+ rolling backlog of fixable defects** the build
> inherits — ~50+ named-politician dataset bugs (wrong religion, missing skills,
> wrong birth years, swapped bios, duplicate entries, missing draft-class
> figures), ~30+ small mechanical bugs (swapped bill ideology effects, wrong
> committee assignments, event-prerequisite typos, sign-bugs on
> ideology/lobby/interest gains), and ~25+ **@MrPotatoTed designer rulings** that
> resolve longstanding rules ambiguities and authoritatively patch the
> ruleset. Most items are low-priority polish; **the high-signal extract is the
> designer-ruling section** + the few systemic gaps (no "secessionist trait" in
> the dataset; statehood-committee-routing inconsistency; bundling-rules
> rewrite; pardon rules absent).
>
> **★ Disposition:** This thread is the **canonical authoritative source for
> small dataset/mechanical fixes** — entries are made by player playtesters who
> hit a defect in a live playtest and report it here. Almost every entry has
> @MrPotatoTed, @vcczar (designer), or @Arkansas Progressive (dataset
> co-maintainer) acknowledging the bug; many entries report "fixed in master
> sheet" inline. **This digest deliberately does NOT enumerate every bug** — it
> buckets them. Use the section sub-tables as an index pointing back to specific
> POSTs in the raw chunks for the actual fix details.

---

## §0. Thread metadata

- **Title:** "A Thread for small low priority changes and errors" (forum topic
  1882, politicslounge), Apr 18 2023 → ongoing (last captured POST 804 = May
  2026). Started by **@Imperator Taco Cat** (also "Bushwa777" — same person)
  with the explicit charter: *"not… major changes to game rules or systems but
  fixing small errors"* (POST 1). @OrangeP47 later sharpened: *"This isn't an
  errors thread Will it's a typos thread essentially and I don't want it to get
  out of hand"* (POST 25). Despite that, scope crept slightly into rule
  clarifications and minor-tuning suggestions over 3 years.
- **Participants:** ~25 distinct usernames, but the dataset-maintenance core is
  the recurring **@vcczar** (designer; "V"), **@MrPotatoTed** ("Ted"; rules
  steward / sub-designer), **@Arkansas Progressive** ("Ark"; dataset
  co-maintainer + heavy contributor), **@ebrk85** ("Eric"; GM of multiple
  playtests + dataset access), **@OrangeP47** (the 1840 playtest GM + frequent
  contributor + tech-support-by-trade), **@matthewyoung123** ("Matt"), and
  **@ConservativeElector2** (dataset access). Subordinate roles: **"Anthony" =
  the coder building the actual app** (not a forum participant; referred to in
  third person as "rushed to Anthony before he uses this as an excuse to work
  on PI 2035," POST 127; the dataset/rules are explicitly held back until
  Anthony reaches the relevant rule).
- **Style:** A rolling catalog. Each post is typically one bug or
  one suggestion. Long discussion threads are rare — most fixes are
  acknowledged within 1–2 reply posts and either fixed inline ("Fixed in master
  sheet") or deferred ("we'll deal with that when Anthony needs that specific
  bill"). A few entries spawn multi-post debates (Isolationist lobby
  restriction; career-track elections; "Command depletion" proposal; the
  generate-pol-for-uncontested-race rule).
- **Authority:** Not a playtest, so **no GM rulings on a running game** — but
  the thread is the channel through which **@MrPotatoTed (rules) and @vcczar
  (designer) issue authoritative rule patches** that fold into the main
  ruleset. Several rule changes "go live" mid-thread via a post + an explicit
  Basecamp ping to Anthony.
- **Scope of changes:** Three buckets, in volume order:
  1. **Dataset bugs** (~50+ items) — named politicians with wrong religion,
     skills, traits, birth year, party, alt-state, or bio. Mostly minor, almost
     all fixable in a single CSV row.
  2. **Small mechanical bugs** (~30+ items) — swapped bill ideology effects,
     event prerequisites missing, era flags pointing wrong way, "
     forbidden-industry" event conflicts, bills referencing nonexistent SCOTUS
     cases, ahistorical event timings.
  3. **Rule clarifications + designer rulings** (~25 items) — @MrPotatoTed
     proposing changes to committee eligibility, command depletion, Iron-Fist
     blocking, primary actions, faction-leader trait gains; @vcczar
     adjudicating ambiguous cases.

---

## §1. What this thread is and how to use this digest

A 3-year community backlog of polish-tier fixes. **Almost every entry is a one-line
hand-off to the build**, of the form "X is wrong; should be Y." A handful are
designer-issued rule patches that supersede earlier text. The digest's job is
NOT to enumerate every fix — that's what the raw chunks are for. The digest's
job is to:

1. Capture **every authoritative @MrPotatoTed / @vcczar ruling** (§5 — the
   single most valuable section).
2. **Bucket and count** dataset/mechanical fixes by category so the
   dataset-maintenance work item can be sized.
3. Surface the few **new systemic gaps** this thread reveals (§6).
4. Point readers to **specific POST# anchors** for any individual fix they need.

Open this digest first to plan the dataset-maintenance pass; open the raw chunks
to execute it.

---

## §2. Dataset bugs catalog — politicians

The build's politicians dataset is **generated** from `scripts/seedDataset.mjs`
+ external sources (see CLAUDE.md). All fixes below go via `CURATED_ROWS`
overrides in that script — do NOT hand-edit `public/standard-draft-classes.json`
or `defaultDraftClasses.ts`. This catalog is the **input list for one
dataset-maintenance pass**.

### §2a. Religion mislabels (Protestant → Catholic, etc.)
A common Catholic-as-Protestant bug, scattered throughout the dataset.

| Politician | Bug | Post |
|---|---|---|
| Mike O'Callaghan | Marked Protestant; was Catholic | 1 |
| Mario Biaggi | Marked Protestant; was Catholic | 1 |
| Dick Davis | Marked Protestant; was Catholic ("first Catholic elected statewide in VA," per his bio) | 33 |
| Richard M Daley | Marked Protestant; was Catholic (father Richard J Daley is correctly Catholic) | 126 |
| Mike Lawler | Marked Protestant; was Catholic | 261 |
| William T Sherman | Marked Protestant; was Catholic (irreligious but Catholic) | 447 |
| Moses Alexander | Marked Mormon; was Jewish | 465 |
| Malcolm X | Should be marked Muslim by his draft date (1952; practicing since 1948) | 118 |

This is a known pattern; the maintenance pass should sweep the full dataset
against authoritative religion sources rather than fix one at a time.

### §2b. Wrong/missing skills + traits

| Politician | Bug | Post |
|---|---|---|
| William Hathaway | Lacks 1 Military (was a WWII POW shot down over Romania) | 1 |
| Bob Scott | NC Gov but only 1 draft Legislative | 1 |
| Stephen Mallory | CSA Sec of Navy, 0 Military skill **and** not marked secessionist | 2 |
| John A Love | 0 Governing, was Gov of CO | 71 |
| Bill Richardson | Starts with `Lackey` trait — unclear why; GM agrees (POST 75, 78, 82) — should be cleaner, maybe `Illicit` not `Lackey` | 72-82 |
| John M Palmer | Has BOTH `Pliable` AND `Puritan` simultaneously (trait conflict) | 214 |
| Quinn (a pop pol) | Both `Integrity` AND `Controversial` simultaneously — DH-27 reinforced from a 3rd thread | (corroborates DH-27, `pop` POST 1139) |
| Cesar Chavez | Should start with Agriculture expertise (currently only Labor + Media) | 32 |
| Benjamin Williams | Was NC Gov; starts with 0 Gov | 374 |
| James (Rood) Doolittle | Wrong stats; should be 1 Leg + 1 Judicial + 1 Gov, experience Justice not Army (fixed POST 379) | 375 |
| Chauncey Goodrich | Missing Gov and Judicial (was Lt Gov of CT + state SC justice) | 392 |
| Raymond Spruance | Has 0 Mil and 2 Judicial (was WW2 Naval Admiral; skills clearly transposed; **fixed in master sheet**) | 434 |
| Theodore Roosevelt V | Wrong birth year (1976 instead of 1942) **AND** ideology — listed as Prog Dem; should be Red Mod (his son TR VI is the actual progressive — confusion between TR V and TR VI; **fixed POST 533, then partially reverted**) | 531-544 |
| Pelosi / McCarthy | Pelosi lacks Iron Fist; McCarthy should lose Manipulative + maybe gain Incompetent (designer punted — would affect leader-selection odds) | 124-125 |
| Thomas B Robertson | LA Gov in 1820, lacks Governing (**fixed POST 530**) | 529 |
| Stephen Van Rensselaer | Lacks Business expertise that he's listed as starting with | 524 |
| Carl Schurz | Question raised whether he should have Union Loyalist + WI as alt-state | 661 |
| Rand Paul / Rodrigo Duterte / Jair Bolsonaro | Have BOTH `Pliable` AND `Puritan` — Ark dropped Pliable for all (POST 786) | 786 |
| **Recency-bias modern draft classes** (post-2000): Elon Musk overpowered (Iron Fist + Kingmaker); Gavin Newsom listed as Progressive; AOC has Unlikable + Disharmonious; Richard Ojeda has Integrity + Provincial; Archie Roosevelt listed Conservative, should be RW-Pop/Trad (John Birch Society) | "There's some recency bias that came to play" — corroborates DH-51 from a 2nd thread | 531, 564, 784 |
| Charles R Sherman | Father of William T + John Sherman, marked as their brother | 281 |
| Daniel Jenfer | Born 1791, signed 1787 Constitution — impossible | 282 |
| William Preston | Bio says served Pierce/Fillmore cabinet AND CSA; born 1729 (impossible) | 129 |
| Return J Meigs Jr | Bio says "father of Gov Return J Meigs Jr" (self-parent) | 272 |
| Thomas Mann Randolph Jr | Died 1828, can't have served CSA Army (it's his son) | 280 |
| William Sprague III / IV | Bios swapped (**fixed in master sheet**) | 573, 736 |
| James G Blair / James T Blair Jr | Bios swapped or misplaced | 487 |
| Henry W Hoffman | Bio says rep in 1855; born 1870 (impossible) | 764 |
| John A Anderson (1868 draft) | Listed 22 yrs younger than IRL | 43 |
| James H Johnson (1928 draft) | Has 1944 peak-abilities + 1928 draft year + 1802 birth year + died 1887 — should be 1844 + 1828 ("born 1802, undead for another 41 years", POST 799) | 27, 797 |
| Richard Butler | Draft year 1772 at age 29; should be 1768 | 562 |
| John Ashe | Draft year 1772 at age 47; should be 1752 (vcczar: "there's two John Ashes from what I remember") | 562-563 |
| Mary Todd Lincoln | Listed 1816; actually 1818 (verified correct in master, POST 576) | 575-576 |

### §2c. Foreign-born / alt-state / party-flag missing
The "can party swap" + "can be independent" + Foreign-Born flags are often
missing from politicians who biographically warranted them.

| Politician | Missing flag | Post |
|---|---|---|
| Irish Blitch | Switched parties — lacks "can party swap" | 1 |
| Lester Maddox | Ran with American Independence Party — lacks "can be independent" | 1 |
| Thomas Burke | Born in Ireland — not Foreign-Born | 20 |
| James Jackson | Born in England — not Foreign-Born | 20 |
| William Preston | Born in Ireland — not Foreign-Born | 20 |
| James Gunn | Federalist; should be RED-Party not BLUE | 20 |
| John Armstrong Jr | Listed in PA, real-life NY senator, NY not an alt-state | 20 |
| Horatio Gates | Bio mentions move to NY in later life; NY not alt-state | 20 |
| Harold Ford Jr | Should have NY alt-state (~20 years there, considered 2010 Senate run) — **fixed already in master per POST 456** | 401-402 |
| Ulysses S. Grant | Has OH + IL alt-state; should add MO (wife from there + lived/voted there) | 491 |
| Frances Perkins | Missing from master pol sheet entirely (FDR's labor sec + first female cabinet) — **was a filtered-view artifact, POST 600-601** | 599-601 |
| Robert N C Nix Sr | PA Rep, missing from master pol sheet | 65 |
| Stephen Hopkins | Declaration of Independence signer, missing | 144 |
| Otis F. Glenn | IL senator from 1928 special elex; deliberately omitted (special elex only) | 466 |
| Joseph A Scranton (Rep 1892) / Charles James Faulkner (WV Sen) | Missing from pols | 802 |
| Richard Bland Lee I | Listed as VA starting rep in 1788 era files but not in 1788 game (drafted later) | 602-606 |
| Samuel Johnston | Listed as both NC Gov AND Senator in 1788 (he literally appointed himself) — replace Gov with Alexander Martin | 606 |
| Donald Trump | RW-Pop Democrat 1976; debatable but should be Mod Blue at his draft year, OR Prog Blue / RW-Pop Red consistently | 220 |
| Elizabeth Warren | Listed Prog Republican 1976; debatable — see above | 220 |

### §2d. Duplicates / name collisions

| Issue | Detail | Post |
|---|---|---|
| Two William Strong in 1868 | Need disambiguation | 35 |
| Two "Tyre York"s | Need disambiguation | 218 |
| Two "Asher Dreier" / John Smith collisions | Same name, same era; eric ruling — disambiguate with state suffix `"John Smith (VA)"` (POST 46) | 43-53 |
| James A Hughes vs J A Hughes (both 1888 draft) | Same person | 765 |
| Ruth B Pratt vs Ruth Baker Pratt (1904, Red) | Same person | 664 |
| Throwlow Weed | Should be **Thurlow** Weed; misspelled; missing from 1868 despite being alive | 34 |
| Kika de la Garza | Listed as "Kiki de la Garza" | 224 |
| Shirley Temple | Should be "Shirley Temple Black" (her preferred name + the name she went by politically) — vcczar: keep as "more common name" (POST 444) | 443-444 |

### §2e. Missing historical/alt-history figures (suggested additions)

| Suggested addition | Rationale | Post |
|---|---|---|
| Frances Perkins | (turned out to be filtered, exists in dataset) | 599 |
| Éamon de Valera | Born NYC; what-if candidate like Boris Johnson / Napoleon | 710 |
| Sequoyah state | The 1905 Native-led proposed state had a convention; absent | 560, 697 |
| Yazoo state (pre-Indian Removal alt) | Would block AL/MS, replace with West Florida; auto-disable on Indian Removal Act | 697 |
| de Valera, etc. | What-if figures of US-born immigrant returnees | 710 |
| Nova Scotia / New Brunswick | Quebec join-as-state event should include them (Smithsonian: "14th colony") — designer agreed POST 384 | 381-385 |

### §2f. Bio corrections (informational; not gameplay-impacting)

Many bios have minor errors that don't impact gameplay but should be fixed for
polish — see POSTs 272-282, 374-378, 487-488, 573-577, 597-606, 661-663,
764-767. Most flagged by @Bushwa777 + @Arkansas Progressive while playing /
prepping era starts.

---

## §3. Small mechanical bugs — bills, events, points-tables

### §3a. Swapped/reversed bill effects (sign bugs)
This is the **highest-impact class** of dataset fix: bills whose
ideology/lobby/interest gain/loss columns are reversed. **Corroborates DH-53 (bill
→ meter effect tables) from a 4th thread.**

| Bill | Bug | Post |
|---|---|---|
| `Ban the Teaching of Evolution` | Progs+Libs get points, Trads+Pops lose — should be reverse; but **Ark also raised the era-sensitivity question** (left coalition opposed it pre-Scopes; right-leaning post-Scopes); also Interests+ = Theocrats and Interests- = LW Activists (so Interests row + Ideology row contradict each other, POST 742) | 29-31, 742 |
| `Abolish Slavery by Compensating Owners Act` | LW Activists / RW Activists had their gains/losses reversed (**fixed**) | 620 |
| `Pro-French Trade and Foreign Policy Rhetoric` (exec action) | Mirror of Pro-British, but didn't swap + and − on relations effect (**fixed POST 683**) | 682-683 |
| `Grant the President the Power to Create National Monuments` | "Traditionalists" listed under interests; **should be in ideology column** (moved POST 707) | 707 |
| `Abolish Debtors Prisons` | Erroneously labeled as Amendment when it isn't (**fixed POST 708**) | 708 |
| `Increase Welfare Benefits` | Missing "Decrease" replacement requirement | 760 |
| `Require a Balanced Budget…` | Welfare lobby gains and Wall St loses — feels reversed | 793 |
| `Lochner v New York` SCOTUS effect | Big Corporations getting +200 on the ahistorical (pro-state) ruling — should be Labor Unions; **debate POST 768-770 confirms current code is actually correct (Nay=200pts to corps is the historical ruling)** | 768-770 |
| `Set average tariff rate to 42% AND peacetime income tax 2%` | Description says "congress with the house only" — partial-description bug | 28 |
| `Construct a Navy of Six Frigates` + `Wooden Sail-Driven Navy` | Both null for party points = literally impossible to pass + only Frigates a crisis bill; needs +Mil-Industrial, +Expansionist, +Cons/Mod (POST 674-675) | 671-675 |
| Native American + land-grant laws ("**Until passed, −1 EV in each state**" → should be "**When passed, +1 EV**") | Corroborates DH-53 in dem1820 (already logged) | (see DH-53) |

### §3b. Event prerequisite / era-flag bugs

| Event | Bug | Post |
|---|---|---|
| `US conquered by British and Native Forces` gameover event | References War of 1812, but expires at start of Era of Federalism — incompatible | 36 |
| `General Napoleon Bonaparte Dominating in Europe` | Requires "Rev War Active" — should be "French Rev War Active" | 38 |
| `Kosciuszko Makes US Permanent Residence` | Should require **Kosciuszko Returns to Poland NOT have occurred** (not itself NOT occurred) | 109 |
| `Declaration of Independence` | Marked "repealable" — can't be repealed | 110 |
| `Boom in Iron Ore, Flour, and Wheat in Maryland` | Gives +1 Mining, but MD has Mining as forbidden industry; designer ruling: ADD mining (Maryland should have it), not remove (POST 407) | 403-410 |
| `Force Open Trade with Japan` | No prereq for owning a Pacific port — corroborates DH-60 from arkzag | 677 |
| `Stubborn Cherokee` | Should require Indian Removal Act passed — corroborates DH-60 | 676 |
| `Congress of Panama` | Requires "Latin Colombia" (Gran Colombia) to be independent; wording awkward, **also "Colombia" misspelled "Columbia" across all sheets** | 731-733 |
| `Pro-French Trade and Foreign Policy Rhetoric` | Both Pro-French and Pro-British exec actions had identical effect (fixed POST 683) | 682-683 |
| `Invade Canada as a Bargaining Chip` (legis prop) | Requires Rev War Active but extends to Gilded Age — should expire at Federalism (**fixed POST 504**) | 503-505 |
| `Cap House at 100 Reps` | Math breaks badly for 50 states; vcczar agreed POST 142 — *"I'll have Anthony delete it… he already has all the legis props in his system (although not workable), so me deleting it now won't do anything"* — DESIGN: limit caps to 435/500/1000, 100 is broken | 138-143 |
| `Boom Industry in MD` | Adds +1 Mining to MD which is forbidden — fix is to unforbid MD mining, not remove the event | 403-410 |
| `Watergate` historical year | Listed as 1974 (actual: 1972) — but @OrangeP47 clarifies this only marks "has occurred at start," doesn't affect firing | 202-205 |
| `Set the SC Justices to 5` | Listed as "Judicial Act of 1802"; should be 1801 (1802 Act kept it at 6); **fixed POST 511** | 506-517 |
| `Cap House at 100 Reps` | Math problem with 50 states (each state gets 3-5 EVs) — vcczar: *"I should change that then. I'll have Anthony delete it once he puts out Early Release."* | 138-143 |
| `Natural Born Citizenship for those whose Parents Born in the US` | Listed as Era of Federalism, but historically 1787 (Const Convention) — should be Era of Independence; **fixed POST 572** | 567-572 |
| `War in Afghanistan: Phase I Invasion` | Multiplier=1 + 90% easy battles + 50% next-battle chance = ~<1% chance to win in first term; should be multiplier=2 like Barbary/Haiti | 336-339 |
| Ground-Phase-Number column | Outdated unused from old battle system — should be cleaned up | 341-344 |
| Red Cloud's War / Modoc War / Yakima War / Dakota War | "No land name battles" listed — but Ark posted them all (POST 348); needs to be added to War Charts | 347-348 |
| `Red Cloud's War` | Doesn't exist in War Chart per ebrk; **Ark found at row 66** — labeling/findability issue | 779-781 |
| `Mil Prep` meter level 4 | Listed 60% +15, 40% +10, 100% +5 — doesn't add to 100% + makes level 4 BETTER than level 5; proposed fix (30% +15, 40% +10, 30% +5, POST 579) | 331, 578-580 |
| `Meters tab` enthusiasm row vs effects row | Backwards (effects in enthusiasm row, vice versa) — Umbrella + Ark flagged | 577 |
| `Iraqi Assassination event` | Says "president during Gulf War dies"; per description the actual event was foiled — should be 25% chance not 100% | 796 |
| `Civil Rights Act of 1964` | Marked non-repealable; player wanted to repeal; **debate POST 277**: 547 of 1802 bills are non-repealable + no-replacement; repealing would un-deactivate segregation actions ⇒ "would be not good from a mechanics standpoint" | 276-277 |
| `Wyoming Rule` / `Real House Act` | Existing "Wyoming Rule" bill is a flat 585 cap; Ark proposed renaming to "Real House Act" + setting at 585 cap proposed Era of Populism (POST 475); also proposed Wyoming-Rule-as-1.31×EV formula at 2000 Census (POST 451) | 451, 475 |
| `Scandalous Office Holder` (Anytime Evo) | Forced-resignation pol can be re-appointed to same job next phase — needs prohibition window | 618 |
| `American Samoa Territory`, `Guam`, `Virgin Islands` (legis props) | All three have `?` in requirements column — placeholder text | 5 |

### §3c. Statehood / Industries / regions

| Issue | Detail | Post |
|---|---|---|
| Statehood bills routed to Foreign/Military Committee | Should be Domestic OR Foreign — be consistent; vcczar punted; Matt + Ebrk agreed (POST 499-500) | 499-501 |
| `Alberta Statehood` specifically | Should move from Domestic to Foreign/Military | 498 |
| Region map | IL listed as Great Plains (should be Midwest), WV as Midwest (should be Upper South), MT as Great Plains (should be Mountain). Designer ruling (POST 728): "states need to stay in the regions I have them in. They're there for a reason. So don't alter the official spreadsheets" — i.e., region map is intentional, not historical | 117, 714-728 |
| `Industries by era` table | Exists but not referenced by rules; need a referencing rule for it (POST 580-587) | 580-589 |
| Industry appearance events | "Manufacturing Appears" / "High Tech Appears" don't formalize whether industry is locked-out before — but some states START with manufacturing before that event. Open Q | 580 |
| New state industries on admission | Not specified; refer to `Industries by Era` sheet but no rule says to | 580-585 |
| Lobbies activation | Some events activate lobbies; rules say need X pols to acquire — open Q whether the event is gating or just narrative; proposed: "eliminate the lobby-create events; pols-count alone gates" | 580 |
| Plantation Economy ending | No rules for what happens to Plantation industry stack; Ark proposes 3:1 conversion to Agriculture | 145 |
| Census issues (1830 VA double-stat) | Off-by-one row in copy-paste; VA listed as +Cons/Trad AND -Trad/RW-Pop; caused by missing "n" in "Minus" header (**fixed POST 309**) | 303-309 |
| 1820 Census MA | Libs +1 AND Libs -1 — same off-by-one error; **fixed POST 763** | 761-763 |
| Census/EV state restriction `if state has 3 EV (1 CD)` | Should disable EV split mechanic until 4 EVs (matches IRL ME/NE law); designer agreed POST 438 | 430-441 |
| Reconstruction Misc Rules 3.0.22 | Northern-secession-symmetric flagging (POST 134) | 134-136 |
| Missouri Reconstruction Bill | Missing for the border state; **created POST 690** | 688-693 |
| Subtype "Expansionist" mistakenly used | AL, AR Reconstruction bills had subtype Expansionist; **fixed POST 690** | 690 |
| `Manufacturing Appears` etc. | Per-state +1 manufacturing also triggers in pre-Federalism — unclear when industry is gated | 580 |
| Industry Forbidden — MD Mining, NJ Mining, PR Maritime | Designer ruling: "I have good reasons for making some industries 'forbidden' for game purposes" (POST 414) — not all forbidden industries map to historical reality; intentional balance | 414, 412-417 |
| Industries by era for new states | Sheet exists ("Industries by Era") but no rule references it | 580-587 |
| Industry on admission (CA in 2025 hypothetical) | Open Q — should CA enter with full modern industries if admitted in 2025? Not handled | 585 |

### §3d. Rule-text / wording cleanup

| Issue | Detail | Post |
|---|---|---|
| `Executive Branch Interference` bonus phrasing | "Proposer AND the person who picks it up receive double points" — but they're the same person; needs "bonus only applies once per faction" (POST 617) | 608-617 |
| `Frontrunner not winning + second place` (convention) | What if they're the same person? Needs cleanup | 740-758 |
| `Wooden Sail-Driven Navy / Construct a Navy of Six Frigates` | Both null for party points — neither passable; needs to be re-pointed (Mil-Industrial, Expansionist, Cons/Mod) | 671-675 |
| `Faithless electors` in pre-12A | Designer ruling needed: if two top vote-getters tie in points, both win EVs but who wins POP? Ark default: d6 reroll; ebrk POST 661: reroll for the 2; need firmly written rule | 659-661 |
| Bill packaging rules — bundling section | "Perhaps the worst part of the rules"; multiple voices agree it needs a rewrite; covers what to bundle + spending-limit failure cascades + sign/veto on partially-failed bundles | 624-651 |
| `Institute Filibuster` going through House+Senate | Should be Senate-only; but no class for Senate-only bills | 642-651 |
| Bill packaging — should fail entire bundle on spending limit | Confirmed POST 626-627 (Matt + Ark + Vee01 agree) | 624-651 |
| Convention promise weights | When making offer to faction with less delegates: State/AG/War/Treasury 50%, other cabinet 25%, Ambassadorships 10% (POST 137) — proposed by Ark | 137 |

---

## §4. Missing / under-specified categories — data gaps

These are areas where the dataset/rule has a **structural absence** rather than a
fix-this-one-row bug.

### §4a. NEW gap — `Secessionist trait` not in the politicians dataset
- **POST 3, @Imperator Taco Cat:** *"in that we don't have a secessionist trait
  in the original politician database. It won't apply for most games, but it is
  very important for 1868, if that's a start date in the game."*
- **POST 121 follow-up:** "the event to form the Democratic Party will now
  almost never fire because the Southern Unionist trait has been removed,
  unless that's been reintroduced?" — @ebrk85 answers POST 122: "It's still in
  the game as far as I know. There is still a column for it in the Master pol
  doc. But it's called **Union Loyalist** now."
- **Disposition:** Two related traits actually exist — `Southern Unionist` →
  `Union Loyalist` (intentionally rebrand-renamed). The **counterpart `Secessionist`
  trait is not in the dataset** as of the OP's report; @Imperator Taco Cat manually
  marked everyone for it in his playtest (POST 2). This is a **NEW gap on top of
  the `Southern Unionist` family** documented in game-context glossary. The
  build's CSA secession trigger relies on this.
- **POST 783-785:** Question raised about whether `Southern Unionist` (i.e.,
  `Union Loyalist`) should be in the not-passable-by-Kingmaker list; ebrk: it
  has been passable down to protege historically.

### §4b. Pardons — no rules at all
- **POST 113, @Bushwa777:** *"Pardon rules not spelled out. What happens if pres
  pardons someone? Do they lose traits they got like controversial? If not
  pardoned do they get retired from game?"*
- **Disposition:** **No follow-up.** Pardons are entirely unspecified in the
  ruleset. New gap. (Pairs with #112's impeachment-machinery and the
  Controversial-trait apparatus.)

### §4c. Bill-class for "Senate-only" / "House-only" votes
- Currently no bill class for bills that should require only one chamber's vote.
  `Institute Filibuster` and `Majority of the Majority Rule` are surfaced as
  cases — filibuster is Senate-only, majority-rule is House-only — but both
  currently go through both chambers. Need a new bill-class. POST 642-651.
- @vcczar already created a class for "bills that don't need to be signed into
  law" (procedures + amendments; POST 643-647) — closely related but distinct.

### §4d. Career-track elections (corroborates DH-25)
- Long discussion POSTs 147-181: can career-track pols run for President? Run
  for any office? Players had multiple inconsistent rule interpretations. **3rd
  thread to corroborate DH-25** (alongside `pop`, `dem1820`).
- @Tyler ruling (POST 156): rule 2.1.2 says they CAN'T be in elections or
  appointed. Appointment was removed from rule update but the rule wasn't
  updated. **The build must pick one coherent rule.** Pairs with DH-25/DH-56.

### §4e. Generated-pol policy for uncontested races
- Long debate POSTs 159-180. Current rule: any faction without an eligible pol
  can generate one for any race. Strong opposition: "abhorrent to a functioning
  game"; would cause bloat. **OrangeP47 proposed middle ground (POST 178)**: in
  the primary era, lowest-scoring faction of the relevant party can generate a
  pol for an uncontested race; if they lose, the generated pol is deleted
  (already in rules somewhere).
- **No formal designer ruling yet**, but consensus in-thread is to adopt the
  Orange compromise.

### §4f. Other small gaps mentioned

| Gap | Detail | Post |
|---|---|---|
| Continental Congress activation | Per Bushwa777 POST 127, never explicitly fires in 1772 era evos; ConservativeElector2 (POST 128): "you just begin in 1774 WITH electing the Continental Congress" — i.e., implicit | 127-128 |
| Tied CC delegate appointments | No rules for ties; Ark rolled randomly (POST 59) → Ted's ruling: lowest-score faction makes the appointment, then random if still tied | 59-60 |
| Run-off elections rules | Nothing in rules; Ark adding for the run-off amendment that becomes available in Era of Progressivism (POST 395, 400) | 395-401 |
| Grandfather-clause language for governor-term-limit changes | When a Gov action enacts/lifts a lifetime term limit, what happens to incumbents and people previously barred? Ark suggested both grandfathered | 61 |
| Term-limit retirement of ex-presidents | Long analysis POST 186 with historical math: 50% one-term, 5% two-term seek another office is roughly accurate; this is a NON-bug | 186 |

---

## §5. Designer / GA rulings (@MrPotatoTed and @vcczar)

**The most valuable section** — every authoritative call from a designer that
the build should bake in.

### §5a. The Sept 2024 @MrPotatoTed proposed-rule-changes batch (POSTs 350-372)
Ted floated 8 proposals; community feedback resolved them as follows:

| # | Proposal | Disposition | Post |
|---|---|---|---|
| 1 | Committee appointment must require matching expertise | **DROPPED** (no support; "would make committees more tedious") | 350-380 |
| 2 | Pols lose 1 Command if they didn't run for President in 2.9 | **COMPROMISE**: 50% chance to lose 1 Command after passing up a NON-INCUMBENT cycle | 350-381 |
| 3 | Presidents use Command (not Admin) for implementation rolls | **HYBRID ADOPTED** (POST 387-388): Admin is still used for the roll itself; if blundered, **Command determines how the blunder affects the President**. Vcczar: confirmed. | 350-388 |
| 4 | Remove Uncharismatic / Incoherent / Passive / Predictable / Pliable / Easily Overwhelmed from faction leader trait gains | **MOSTLY ADOPTED** (Passive dropped from leader gains; others kept) | 357 |
| 5 | Incumbent Presidents cannot be primary-challenged unless challenger is `Disharmonious` (enters as Minor) | **ADOPTED with PRIMARY-ERA gating** + "Can Be Independent" added to disharmonious criterion (POST 362-368) | 358 |
| 6 | Iron Fist Party Leaders can only be challenged by Minor candidates unless challenger is `Disharmonious` | **ADOPTED** | 358 |
| 7 | Other PLs cannot block challengers at all (currently random block roll) | **ADOPTED** | 358 |
| 8 | Minor candidates get many same powers as Major (weakened state — limit actions, increase broke chance) | **ADOPTED in concept** (POST 361, 365); detailed implementation by Ark (POST 364) | 361 |

### §5b. Other authoritative rulings

| Topic | Ruling | Post |
|---|---|---|
| **Amendments cannot be SCOTUS-challenged** | @vcczar POST 250: *"I'm going to make it so Govs can't challenge amendments"*; @OrangeP47 POST 251: the Constitution is by definition constitutional. **Rule doc updated POST 269.** Bushwa777 retroactively un-overturned the 13A in his playtest (POST 260). Logged as the 2nd `Cohens`-style hold. Distinct from #100 (`tea1772`'s "SCOTUS can overturn an amendment") — **resolves #100 in the opposite direction**: amendments are NOT challengeable by Govs (but `tea1772` says SCOTUS CAN overturn one via Gov-requested judicial review; tension to resolve) | 236-269 |
| **Drafting politicians from unorganized territories** | @vcczar POST 266: *"No drafting from places that aren't territories, except if it's ME (part of MA) or WV (part of VA)."* Confirms #92's territory-content-filter. Bushwa777's MO draft of Lewis & Clark caused problems — needs late Lewis-and-Clark event OR early MO statehood, or random pol assignment | 259-267 |
| **Isolationist lobby criteria** | Long debate POSTs 310-325; consensus rule: *"Isolationist Lobby (Foreign Affairs) must have LW Populist, Progressive, Traditionalist or RW Populist but won't join Expansionists, Moderates, or whomever already has the Globalist Lobby"* — adds an ideology-REQUIREMENT in addition to the restriction. **MrPotatoTed concurred POST 318.** | 40-42, 310-325 |
| **War-multiplier on Afghanistan + Barbary-like** | Designer ruling implicit from Ebrk85 POST 339; Ark agreed; war-multiplier should be 2 for Afghan-Invasion | 336-339 |
| **Statehood-bills SCOTUS challenge** | Per OP47 POST 240: statehood bills can't be SCOTUS-challenged anymore (recent change); same logic now extends to amendments | 236-251 |
| **The Wyoming-Rule bill** | vcczar (per Anthony) coded the original; Ark proposed renaming to "Real House Act" with 585 cap at Era of Populism start, AND/OR formulating Wyoming Rule as 1.31× current EVs at 2000 Census (POST 451, 475) | 451, 475 |
| **Iron Ore Boom in MD** | vcczar POST 408: *"I should ADD mining ability [to MD], rather than remove mining"* — i.e., MD shouldn't be forbidden Mining | 407-410 |
| **Forbidden industries (Plantation N states, PR Maritime, etc.)** | vcczar POST 414: *"I have good reasons for making some industries 'forbidden' for game purposes"* — intentional design, not bug. Don't try to "fix" them to historical reality | 414-417 |
| **Regions map** | vcczar POST 728: *"In the actual game, the states need to stay in the regions I have them in. They're there for a reason. So don't alter the official spreadsheets."* Likewise intentional, not historical | 728 |
| **CPU president sign/veto decision** | POSTs 417-423: ambiguous case where party gets net 0 but other party gets +1000; vcczar ruling: **CPU signs** if any factions in his party score, as long as party total isn't negative | 417-423 |
| **`Charter Bank of the United States` recharter bill** | Ark POST 349: the Bank operates like an expirable bill — must be re-passed every 20 years or it goes uncharted (and the associated cabinet position becomes unfillable) — corroborates #116 (`arkzag`) | 349 |
| **CPU drafts Supreme Court Justices** | vcczar POST 70: added SCOTUS Justices into CPU draft preference list, *more important than Governors, less important than Senators* | 70 |
| **CPU drafting fallbacks (when no eligible pol matches criteria)** | vcczar POST 70: added "eligible" to all instructions; added fallback to "drafts the highest eligible PV" when rolled-for criteria are infeasible | 67-70 |
| **Pardon system** | NO FORMAL RULING. Open gap | 113 |
| **Reconstruction subtype** | All bills should have subtype="Reconstruction"; ebrk85 fixed AL, AR (POST 690). Reconstruction lingering effects in 3.0; individual bills shouldn't linger (POST 692-693) | 688-693 |
| **`Stubborn Cherokee` event** | vcczar POST not direct — Ark posted POST 676 that it should require Indian Removal Act. No designer override. | 676 |
| **`Lochner v New York`** | NOT a bug — ebrk85 POST 769 confirms: Nay = $200pts to Big Corporations IS the historical ruling; Aye = $200pts to Labor Unions IS the ahistorical alternative — current code is correct | 768-770 |
| **House-cap to 100 Reps removal** | vcczar POST 142: *"I should change that then. I'll have Anthony delete it once he puts out Early Release"* — 100-cap legis is broken, will be removed | 138-143 |
| **Death+retirement rate** | OrangeP47 POST 195: change from 2 retires/1 death per faction → 5% of faction max, 50/50 split. **MrPotatoTed said he'd use it (POST 197)**. Corroborates the 5%/half-term rule that `drums` patched | 195-197 |
| **Contingent election penalty** | Tyler POST 188: 50% chance Controversial gain + 50% chance DomStab drop for the winner; community broadly approved | 188-196 |
| **Career-track CT pols can/can't run** | Tyler POST 156 confirms 2.1.2 says they CAN'T be in elections; needs build to pick one coherent rule. Corroborates DH-25 + DH-56 | 147-161 |
| **CPU bundling decision rule** | UNRESOLVED. Anthony moved on; community has no rule. Ark default: bundle everything if all conditions met + d≤75 (POST 638) | 624-650 |
| **`Pro-French / Pro-British Trade Rhetoric` mirror bug** | **Fixed** POST 683 | 682-683 |
| **`Frances Perkins` missing** | Was a filter-view artifact, exists in sheet POST 601 | 599-601 |
| **`Continental Congress` activation** | Implicit — game starts in 1774 with CC election | 127-128 |
| **NUKES to the UN (Henry Wallace pitch)** | vcczar POST 455-459: rejected on historical grounds — no UN evidence + USSR wouldn't have accepted | 452-460 |
| **`Soviet Union stabilizes` event** | vcczar POST 459: rejected — *"That assumes it would have stabilized. I don't think it would have."* But: "if we get to 2000s without USSR dying that's unique enough to deserve its own event" remains an open suggestion | 459-462 |
| **Boom-in-Iron-Ore-MD** | vcczar POST 408: *"I should add mining ability, rather than remove mining"* — MD un-forbidden for Mining | 407-410 |

---

## §6. Deltas vs. current build (gap-log additions)

This thread reveals **one new mechanical/category gap** (the Secessionist trait
missing), **one new mechanical gap** (Pardons unspecified), and reinforces (or
adds new instances of) several existing gaps and DH-* entries. Most of the
catalog content rolls up into an umbrella "dataset accuracy" gap.

### §6a. Umbrella dataset gap (new aggregation row)
**One umbrella row** for the entire catalog at sizing-S, scriptable via
`scripts/seedDataset.mjs` `CURATED_ROWS` overrides:
- ~50 named politician fixes (religion/skills/traits/birth/bio/party/alt-state)
- ~30 small mechanical bug fixes (swapped bill effects, missing event
  prereqs, era-flag typos, region-table off-by-ones)
- Plus the ~20 dataset additions (Sequoyah, Yazoo, de Valera, Perkins, etc.)

### §6b. NEW gap — Secessionist trait absent from politicians dataset
A category-level gap: the `Southern Unionist` → `Union Loyalist` trait exists,
but there is NO **counterpart `Secessionist` trait** column in the dataset. The
1856/1868 secession mechanics rely on this. POST 2-4, 121-122.

### §6c. NEW gap — Pardon rules unspecified
No rules for what happens when the President pardons a pol. Open Q from POST
113. Pairs with the Controversial-trait apparatus + impeachment machinery
(#112). Author-time decision.

### §6d. Existing-row corroborations / strengthenings (cross-references)

| Existing gap | What this thread adds | Posts |
|---|---|---|
| **DH-27** (trait-conflict adjudication slips in boot data) | **3rd-thread corroboration**: John M Palmer = Pliable+Puritan; Quinn = Integrity+Controversial; Rand Paul/Duterte/Bolsonaro = Pliable+Puritan | 214, 786 |
| **DH-51** (modern-era pols overpowered, recency bias) | **3rd-thread corroboration**: Elon Musk (Iron Fist + Kingmaker), Gavin Newsom (Progressive), AOC (Unlikable+Disharmonious), Archie Roosevelt (Conservative not RW-Pop), Donald Trump (RW-Pop Dem), Eliz Warren (Prog Rep), TR V/VI confusion | 220, 531-547, 564, 784 |
| **DH-53** (bill→meter effect tables, sign bugs) | **4th-thread corroboration** + 8+ new concrete sign-bug instances (Evolution, Compensated Abolition, Pro-French Rhetoric, National Monuments, Welfare/Balanced-Budget, Six-Frigates, etc.) | (multiple, §3a) |
| **DH-60** (era events fire with no territory/asset prereq) | **2nd-thread corroboration**: `Force Open Trade with Japan` + `Stubborn Cherokee` flagged here too (independently of arkzag's flagging) | 676-677 |
| **DH-25 + DH-56** (career-track election eligibility) | **3rd-thread corroboration** (alongside `pop`, `dem1820`): 14-post 2023-12 debate confirms self-contradicting rule (2.1.2 vs other sections) | 147-161 |
| **#19 / DH-13** (faithless electors) | Indirect corroboration — POST 659 raises tie-resolution Q in pre-12A (related to faithless mechanic), no faithless-elector content here | 659 |
| **#38** (relocation cap; build is STALE at 5) | **POST 734-735 — DIRECT FIX SHIPPED ON 12-30-25:** *"A faction is limited to FOUR total attempted moves per half-term. A politician that moves to an ALT-STATE does NOT count against the FOUR total moves. (Approved by vczar 12-30-25)."* — sent to Anthony for updating. **This thread is the channel through which the relocation-cap-4 change went into the rules doc.** | 734-735 |
| **#21** (state policy flags incl. SLAVERY) | POSTs 651-655: After "Abolish Slavery by Compensating Owners Act" with 3/5 compromise active, should EV counts swell? Designer ruling pending; mechanic exists in the Slavery Article + 13A bills but not in this compensated-slavery bill. Brings up #21 EV recompute question | 651-655 |
| **#39** (amendments durable + ratification) | POSTs 250-269 + 783-785: Govs can NOT challenge amendments via SCOTUS — distinct from #100 (`tea1772`'s SCOTUS-overturns-amendment); the design is actually that amendments are constitution-by-definition-constitutional. **Tension to resolve in #100/#39** | 250-269 |
| **#43** (statehood + procedural pol-gen) | Several missing-state suggestions (Sequoyah, Yazoo, Nova Scotia) | 381-385, 560, 697 |
| **#46/#52** (SCOTUS) | POST 678-687: `United States v. Schooner Amistad` is referenced as an event but absent from SCOTUS Cases list; **vcczar created the case POST 686**, asked Ark to verify, will ping Anthony | 678-687 |
| **#106 / DH-45** (Cold War never ends, USSR collapse) | POST 458-462: stabilizes-event suggestion; vcczar rejects on historical grounds but acknowledges open suggestion; corroborates DH-45's "no end-state model" theme | 458-462 |
| **#12b** (Executive Branch Interference rules) | POST 608-617: rules language unclear ("proposer AND the person who picks it up" = same person); needs "bonus only applies once per faction" clarifier | 608-617 |
| **Statehood committee routing** | All statehood bills currently routed to Foreign/Military; consensus they should be Domestic OR Foreign — be consistent. Designer punted | 499-501 |
| **Bundling rules** | "Perhaps the worst part of the rules" — full rewrite warranted | 624-651 |

### §6e. Open / unresolved policy choices the build must decide
1. **Generated-pol policy for uncontested races** (Orange compromise vs current "any faction can generate" rule)
2. **Career-track election eligibility** (DH-25/DH-56 — need ONE coherent rule)
3. **Pardon mechanics** (entirely unspecified)
4. **Bundling rules** (full rewrite, including spending-fail cascade + CPU decision rule)
5. **`Wyoming Rule` formula** (Real House Act 585-cap OR 1.31× formula at 2000 Census)
6. **Pre-12A tied-EV popular-vote winner** (re-roll vs faction-based tie)
7. **SCOTUS-overturns-amendment** (#100 from `tea1772` vs the @vcczar-confirmed
   "amendments CAN'T be challenged by Govs" rule from POST 250-269 — TENSION)
8. **Statehood committee routing** (Domestic vs Foreign)
9. **Tariff/Wyoming Rule 100-cap House** scheduled for removal but not yet
   removed by Anthony

---

## §7. Open questions

Things the thread raised and explicitly did not settle:

- **Pardon mechanics** — entirely undefined. POST 113.
- **Run-off election rules** — Ark added a section to 3.0 (POST 395-401) but for
  the run-off-amendment specifically. General run-offs in popular-vote elections
  not addressed.
- **Implementation difficulty levels for many exec actions** — POST 329 flagged
  by Ark that a "whole bunch of executive actions… require implementation but
  do not have a difficulty level assigned."
- **The Bushwa/Bushwa777 retire/death-rate question** — accepted that aging
  + death rolls process old→young, so pols who historically died young can
  outlive their historical deaths. POST 737-740; Zagnut's compromise: lose Frail
  if they pass their historical death year.
- **3-state SCOTUS challenge** — designer ruling needed: not just amendments and
  statehood bills (now both off-limits), but how broad is "constitution
  protects"?
- **Pliable + Manipulative trait combo** — not flagged but adjacent; see DH-27
  trait conflict
- **CPU bundling decision rule** — UNRESOLVED. Anthony coded around it.
- **Eligible-CC delegate ties** — Ted ruled lowest-score faction makes the
  appointment, then random if still tied (POST 60). Now resolved.
- **`Repeat-events-if-declined`** — vcczar's open suggestion POST 330; some
  events (Recognize Haiti) could repeat until accepted, but not all. Need a
  per-event flag.

---

## §8. What batch-12b should especially watch for

The companion thread **"Change Log Thread of Doom"** (batch 12b) is the
playmaker-perspective complement to this typo/error thread. The 12b game-pm
pass should especially cross-check:

1. **The relocation-cap=4 ruling (POST 734-735)** — was this directly entered
   into the change-log thread? It IS the rule change the build must apply
   (#38's stale-at-5 fix); 12a captures it via this thread, 12b should confirm
   it as a `vcczar`-approved entry in the change log.
2. **The Sept-2024 Ted-batch of 8 proposed rule changes (POSTs 350-372)** — at
   least #3 (Pres uses Command for blunder impact), #5 (incumbent challenge
   rules), #6 (Iron-Fist PL block rule), #7 (PL no-block) likely have
   corresponding change-log entries. Look for the canonical wording there.
3. **The amendment-not-challengeable-by-SCOTUS rule (POST 250-269)** — this
   resolves part of #100. Verify whether the change log captures this in the
   same form.
4. **Death/retirement-rate change (POST 195-197)** — Orange's "5% of faction
   max" formula was adopted by Ted for his 1856 game; check if the change log
   captures it formally.
5. **The compromise on generated-pols in uncontested races (POST 178)** — has
   there been a formal change-log entry? It's contested in 12a.
6. **Career-track-election-eligibility (POSTs 147-161)** — Tyler's POST 156
   citation of 2.1.2; check if the change log records the in-rules-doc
   correction (the 2.1.2 text says CT pols can't run but other sections allow
   it; the change log entry would be the "fix this contradiction" item).
7. **Mil Prep meter level 4 fix (POST 579)** — proposed 30/40/30 fix; check if
   in change log.
8. **The "amendments can't be SCOTUS-challenged" RULE_DOC update (POST 269)** —
   Ark posted *"Rules doc has been updated to reflect this."*
9. **CIVIL RIGHTS ACT OF 1964 not repealable** — long debate POST 276-277; check
   if change-log records this as intentional or as a fix-needed item.

The change-log thread is likely where many of these **provisional fixes get
formalized into the canonical ruleset**. Use 12a as the source for "what was
the bug" and 12b as the source for "what was the canonical fix."
