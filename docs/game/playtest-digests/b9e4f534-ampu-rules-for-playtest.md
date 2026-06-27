# Digest — b9e4f534 "AMPU Rules for Playtest" (THE CANONICAL RULEBOOK)

**Scope:** 40 posts / 3 chunks (~137k chars). Author **@vcczar** (tier-1, game
designer) posts the polished rules section-by-section, phase-by-phase — "the rules
of the game 95% of the time" (POST 1). This is the **single most authoritative
mechanics spec in the corpus**: it is a *designer statement of intent*, not a
playthrough. Where it contradicts a playthrough digest or the shipped build,
**this document is the design ground-truth** for the rule's *normal* form (a
few values were later tweaked in the change-log threads `tedchange`/`oopscpu`,
which are MORE current on wording — see notes inline).

**Caveats from the author:** (POST 1) the players are starting under **Era-of-
Independence special rules**, so "some of these rules won't yet be available" at
the 1774 start. (POST 33) the **Election Rules and the Special Rules are NOT
posted here** — "kind of massive" — so primaries / conventions / general election
math and the per-system "special rules" are out of scope of this rulebook thread.
(POST 40) "Finalized in the sense that all the rules are written… a living
document… constantly tweaking." Coverage is the per-turn loop **2.1 → 2.8** plus
SCOTUS nomination; it STOPS before the election phases.

This rulebook covers **~24 systems/phases**. Below is a scannable rules reference
ordered by the turn loop, then a **reconciliation-candidates** list of rulebook-
vs-shipped deltas + open questions it settles.

---

## A. Era system (POST 2) — THE headline reconciliation item

- "Historical eras are **automatically updated when their trigger date is
  reached**." The active era influences **legislation/event availability, state
  population sizes, preferred ideologies, and the death rate** of statesmen.
  Players get an **alert explaining what changed** at each era transition.
- **Canonical era table with trigger election-cycle years** (settles many open
  questions on era names + boundaries):
  | Era | Trigger cycle |
  |---|---|
  | Era of Independence | 1774-1776 *(special rules)* |
  | Era of Federalism | 1788-1790 |
  | Era of Republicanism | 1800-1802 |
  | Era of Democracy | 1820-1822 |
  | Era of Manifest Destiny | 1840-1842 |
  | Era of Nationalism | 1856-1858 |
  | Era of the Gilded Age | 1868-1870 |
  | Era of Progressivism | 1892-1894 |
  | Era of Normalcy | 1916-1918 |
  | Era of Ideologies | 1928-1930 |
  | Era of the Nuclear Age | 1948-1950 |
  | Era of Neocons | 1972-1974 |
  | Era of Terror | 2000-2002 |
  | Era of Populism | 2012-2014 |
  | Era of the Future | begins after the current real-world election cycle is met |

  > ★ **DELTA (gap #92):** the rulebook here says eras are **date-triggered**
  > ("when their trigger date is reached"). The shipped build has a **4-value
  > `Era` enum** (`independence | federalism | nationalism | modern`,
  > types.ts:1337) with `year % 4`/`year % 2` predicates and era transitions
  > driven by **game events** (Constitution ratification → federalism). The
  > *playthrough* digests (#92) found eras behave as **content-bands gated by
  > game-state + territory, not strictly calendar year**. So there are now
  > **THREE descriptions to reconcile:** (a) this rulebook's 15 date-triggered
  > eras, (b) the #92 content-band model, (c) the shipped 4-enum + event-gated
  > model. **Reconciliation read:** the 15 named eras are the *designer's
  > calendar of era LABELS / point-bank boundaries*; #92 says the **transition
  > predicate** is game-state, not pure year; the shipped enum collapses 15
  > labels into 4 mechanical buckets. The trigger-year table is the missing
  > authoritative spec for the **band labels** the build lacks.

- **Per-era death-rate brackets** are pinned numerically (POST 17, see §M).

---

## B. Politician Draft — phase 2.1.1 (POST 3)

- Done **once every four years**. Each faction drafts from the year's rookie
  class; rookies enter ~age 25. **Draft order = lowest faction score → highest**;
  ties broken randomly; continues until all drafted. **Automated-draft option**
  always available.
- Each politician has a **draft value** (potential signal), but lower-value pols
  can be situationally better.
- **Post-draft random-trait sprinkle:** one of each trait (minus exclusions) is
  auto-assigned to random rookies — **no rookie gets >1 random trait, no trait
  goes to >1 rookie**, additive to scripted traits, and a random trait that
  **conflicts** with a scripted one is cancelled.
- **Traits EXCLUDED from random sprinkle:** `celebrity`, `two-faced`,
  `military hero`, `incompetent`, `flip-flopper` — **except in the Era of the
  Future**, which allows them.
- **Celebrity special rule:** shown at draft, then **hidden** once drafted until
  the politician's historic "obscure remove" date. **Running/appointing them
  before that date permanently removes `celebrity`**; waiting grants full
  celebrity benefits.
- **Suffrage gate:** politicians flagged `woman` or any racial minority are
  **NOT draft-eligible until their demographic can legally vote**; once suffrage
  is attained they enter the **next** draft (if ≥25 and before historic death).
- **CPU draft:** picks one of the **top 10 available**; prefers one matching its
  ideology card, else random among the top 10.

---

## C. Career Track — phase 2.1.2 (POST 4)

- Done **once every four years**. Each rookie can be on **one** track; each
  faction can place **one** rookie per track (always more rookies than slots).
  On-track pols are **ineligible for elections/appointments**.
- Longer on track ⇒ larger exit boost; **auto-removed after 20 years** for max
  benefit unless pulled early. **Military track auto-ends sooner** (age limits).
- **Seven tracks:** Private Sector, Military, Judicial, Governing, Legislative,
  **Backroom Politics** (kingmaker/pawn-runner archetype), [the 7th is implied —
  the build's 7 are admin/legislative/judicial/military/governing/backroom +
  one; rulebook lists 6 by name + "seven career tracks"]. Specific gains live in
  the **Career Track Chart** (not in this thread).
- **CPU:** always fills all 7 tracks, keeps pols to auto-exit; sends the rookie
  with the **highest starting skill** for that track (random on ties / none).
  > NOTE: only **2 elections** pass before the next chance to pull a pol off-track
  > (POST 4 player tip) — a key timing rule for the build's track UI.

---

## D. Flip-Flopper cleanup — phase 2.1.3 (POST 5)

- Temporary **`flip-flopper` penalty** (from switching ideology) has a **1/3
  chance** of auto-removal this phase. **`Two-Faced`** (excessive flip-flopping)
  is **permanent, never removed**. *(Corroborated by `tedchange` POST 51.)*

---

## E. Relocations — phase 2.1.4 (POST 6)

- Move to a flagged **Alternate State**. To an **ahistoric** state (e.g. acquired
  Canada/Mexico): any pol may move **if from an "overpopulated" state (>20
  politicians)**. To an **underpopulated historical** state: in-region pol **1/3**
  success, out-of-region **1/6**.
- **One move per lifetime** unless scripted for multiple states/moves; can only
  return to origin if marked for multiple moves. **Sitting Rep/Senator/Governor
  cannot move** (occupying a state office).
- **Special:** pols flagged Canada/Brazil/Mexico/South America move freely within
  those regions, start randomly in one (same office restriction).
- **CPU:** **20% chance** to move an eligible pol if a move exists (random pick,
  excluding state-office holders).

---

## F. Ideology Shifts — phase 2.1.5 (POST 7)

- 7-point axis **LW Populist → Progressive → Liberal → Moderate → Conservative →
  Traditionalist → RW Populist**. Player may shift a pol **one step** L or R.
- A shift carries a **1/3 chance of temporary `flip-flopper`** (**−1 in primaries
  & general elections**) and a **1/3 chance of permanent `pliable`**.
- **LW Pop ↔ RW Pop is allowed** but applies permanent **`Two-Faced`** (**−1 all
  future primaries+generals**).
- **Trait interactions:** `lackey` can NEVER shift; `puritan` loses puritan +
  gains flip-flopper; shifting WHILE flip-flopper ⇒ permanent two-faced;
  `propagandist` avoids two-faced if the faction holds LW/RW Media (still rolls
  flip-flopper).
- **CPU:** shifts toward its ideology card(s) when reachable in one step, **≤5
  pols/phase**, **always avoids two-faced**.

---

## G. Politician Conversions (poaching/party-flip) — phase 2.1.6 (POST 8)

- Party & faction leaders with certain traits sway "vulnerable" pols. **Max 1
  target per leader per 2-yr term** (**`efficient` ⇒ 2**).
- **Party Leader w/ `manipulative`:** convert opposing pol — **1/3** if
  `party flipping`, **10%** if `pliable`, **5%** if `moderate`. With
  `manipulative`+`debater`: **50% / 25% / 10%**.
- **Protected from party-switch:** President, VP, Cabinet, Congressional Leader,
  Party Leader, Faction Leader. **Dynasty** member is protected if a same-dynasty
  member shares their faction (unless converter is party leader or same dynasty).
- **Faction Leader w/ `manipulative`:** steal from an **allied (same-party)**
  faction if target is `pliable` or shares the FL's ideology — **1/3**, **50%**
  with `propagandist`+`debater`. **Cannot steal another faction's leader.** A
  Party Leader is always also a Faction Leader (may do both attempts).
- **Lowest-enthusiasm exodus:** a faction at the **lowest ideology-enthusiasm**
  level — **every `party flipping`-eligible pol has 25% to auto-flip** (no attempt
  needed by the other side).
- **Conversion cap:** a pol can only convert as many times as historically marked
  (usually once; some 2-3). *(Rate corroborated by `tedchange` POST 52/53.)*
- **Special:** pols in **`max`/`high` enthusiasm** factions **cannot be targeted**;
  a leader with `max`/`high` enthusiasm **doubles** conversion odds; two maxed
  factions can't target each other.
- **CPU:** prioritizes highest-score player of its own party (50% highest-value
  flippable / 50% random) + the highest-scoring other-party player; **prefers
  cross-party over intra-party** steals.

---

## H. Kingmakers & Protégés — phase 2.1.7 (POST 9)

- Kingmakers pair with protégés. **1 activation per faction per 2-yr phase; max 5
  active kingmakers/faction.** No two kingmakers from the same state. **Kingmaker
  must be ≥35 and not on a career track**; no limits on protégés.
- A kingmaker gets **1 protégé from own faction+state**; with `leadership`, **3**
  from their state; a protégé **with `leadership`** may be picked from **any
  state**.
- **Bonus:** permanent election bonus to protégé; protégé earns **DOUBLE points**
  for the faction on office gains (and loses double on losses); **+100 pts to the
  faction if the protégé becomes President**.
- **Ends** on death/retire/party-or-faction switch, or protégé reaching
  President/VP/Chief Justice/Speaker/Senate Majority Leader (these offices can't
  hold a kingmaker). A kingmaker with no protégés deactivates.
- **CPU:** builds chains when eligible — 75% non-officeholding kingmaker, 75%
  "big state", 75% newest draft class, 75% highest PV protégé (25% random each).
  > Corroborates the gap-log "Master Kingmaker"/#128 scope; this is the canonical
  > base form.

---

## I. Faction Personalities (the CARD ENGINE) — phase 2.1.8 (POST 10)

The most data-dense post. Each faction holds **Ideology + Interest + Lobby**
cards forming its personality; cards **re-evaluate every 2 years** and generate
**+/- points** when relevant laws/events occur. Cards are driven by the
**strengths of the faction's own politicians**.

- **Ideology cards (6):** Progressive, Liberal, Moderate, Conservative,
  Traditionalist, **Populist** (= most LW+RW Populists combined). Each goes to the
  faction with the **most pols of that ideology** (plurality wins, e.g. 40 Lib /
  39 Mod / 38 Con ⇒ Liberal). Ties ⇒ multiple factions share a card; a faction
  may hold **>1** ideology card. **Every faction MUST have ≥1 ideology card** — if
  none after distribution, it gets its **party's Historical-Era ideology** (era-
  specific; multi-ideology eras ⇒ the one it has most pols for; random tie).
- **Interest cards (8):** Nationalist, Expansionist, RW Activist, LW Activist,
  Reformist, Civil Rights, Pacifist, Theocrat. Distributed by **most pols with
  that interest**; a faction may have **>1 or zero**. **Compatibility bans** (POST
  10): Civil Rights ✗ Con/Trad cardholder; Expansionist ✗ Progressive; Nationalist
  ✗ Lib/Mod; Pacifist ✗ Con/Mod; LW Activist **only** Lib/Prog; RW Activist
  **only** Con/Trad; Reformist ✗ Moderate; Theocrat ✗ Progressive.
- **Lobby cards:** go to the faction with **most matching-expertise pols**; >1 or
  zero allowed. **Full ban table in POST 10** — 25+ lobbies keyed to an expertise,
  e.g. Wall Street(Economics) ✗ Progressive/Populist/Reformist; Big Oil & Gas ✗
  Prog/Lib/LW-Activist; LW Media **must** have Lib/Prog card; RW Media **must**
  have Con/Trad; Military-Industrial ✗ Progressive/Pacifist; Big Agriculture &
  Transportation join anyone. When a faction is **ineligible**, the card cascades
  to the next-most-relevant **eligible** faction.
- **5-politician floor:** interest AND lobby cards each require the faction to
  have **≥5 pols** with the required interest/expertise; if no faction qualifies,
  **no one gets that card**.

  > ★ **DELTA (gaps #50/#51):** this is the canonical, era-aware **card-
  > assignment algorithm** (plurality + compatibility/ban tables + 5-pol floor +
  > cascade). The shipped meters set + enthusiasm engine is partial; the
  > playthrough digests track the card→enthusiasm/Score machinery as #50/#51.
  > **This post is the authoritative source spec** for that engine's card layer.

---

## J. Congressional Leadership — phase 2.2.1 (POST 11)

- **Office unlock by era:** earlier starts have fewer offices. **Independence =
  Continental Congress rules** (separate doc). **From 1788 (Constitution):**
  Speaker + **Senate Pro Tempore** (acts as Senate Majority Leader) created;
  other offices (Majority/Minority Leaders, Whips) created over time. **Once
  Senate Majority Leader exists, the Pro Tempore loses power** but stays for
  presidential succession and earns **50 pts/phase**; Pro Tem then = longest-
  serving majority senator (tie → earliest birthdate → random).
- **Voting:** Speaker etc. elected by the party with the most **influential
  Representatives** (votes = # influential Reps); Senate offices by the party with
  most Senators (votes = # Senators). If minority offices don't exist, minority
  votes with majority.
- **Incumbent protection:** an incumbent **cannot be challenged** unless they fail
  prerequisites OR a faction's ideology enthusiasm drops **below neutral** (then
  the challenger must come from that below-neutral ideology).
- **Per-office prerequisites + on-election trait/skill rolls** are fully pinned
  (POST 11). Highlights:
  - **Speaker:** Rep, **Legislative ≥5**, prior committee chair, no `Obscure`,
    has `Leadership`. On (re)election: 50% lose Obscure / 50% gain Leadership /
    50% +1 Legislative / 50% Kingmaker / 25% Manipulative / 25% Unlikable.
  - **House/Senate Maj-Min Leader:** Legislative ≥4 + prior chair; Whips ≥3.
  - **Senate Majority Leader:** Senator, **Legislative ≥5**, prior chair, no
    Obscure, has Leadership.
  - **Every leadership (re)election earns the player 50 pts.**
- **CPU:** challenges an incumbent only at lowest enthusiasm; runs highest-
  legislative eligible legislator (tie → random `manipulative` → longest-serving);
  declines to re-run an incumbent that lost/failed to gain the majority.

---

## K. Committees — phase 2.2.2 (POST 12)

- **4 standard committees** + an optional Special Committee:
  - **Domestic** (Education, Labor, Environment, Transportation, Agriculture,
    Energy, Welfare, Healthcare, Housing)
  - **Foreign/Military** (Military, Naval, Foreign Affairs)
  - **Economics** (Economics, Trade, Business)
  - **Judicial** (Judicial, Housing, Labor, Business, Welfare)
- **Chair:** Rep/Senator, Legislative ≥2, **prior member of that same committee**.
  Appointed by the Speaker (House) / Sen Maj Ldr or Pro Tem (Senate). Member
  needs Legislative ≥1. **All committee positions earn 50 pts** on appointment.
- **Committee SIZE scales with the union:** 1788 = chair + 1 same-party + 1
  ranking other-party. At **20 states** add +1 member per party; **per +10 states
  add +1 per party** (so 50 states ⇒ 11-member committees). Chair breaks ties.
- **Majority-flip reshuffle:** Ranking Member → 3rd member, Chair → Ranking
  member, a random former-majority member removed if odd count.
- **Iron Fist Speaker / no minority leader** ⇒ Speaker appoints the minority
  members too.
- **CPU:** chairs = highest legislative (tie → allied faction w/ lowest
  enthusiasm); other members fully random.

---

## L. Faction Leaders (2.2.3) & Party Leaders (2.2.4) — POST 13-14

- **Faction Leader (POST 13):** must match the faction's **ideology card** + have
  ≥1 interest/expertise matching a lobby/interest card + have `Leadership` or
  `Kingmaker` while in office (or have served Pres/VP/SecState), OR hold
  Pres/VP/Speaker/Sen-Maj-Ldr/SecState. **Cannot be `Obscure`.** An incumbent
  President elected in their own right is **automatically Party Leader AND Faction
  Leader**. The FL's personal ideology determines which **ideology-enthusiasm
  meter** the faction is bound to (but all cards still score).
- **Party Leader (POST 14):** FLs endorse or challenge the incumbent. **An
  in-own-right incumbent President cannot be challenged.** Voting: allied FLs vote
  with **votes = # `Kingmaker` pols they control, modified by a d6** (`Leadership`
  ⇒ roll 2d6 take highest; `Leadership`+`Iron Fist` ⇒ 3d6 highest). **50%+1 to
  win**, else runoff between top two (tie → lowest-score faction's FL → random).
  - **3×-elected Party Leader:** 25% each +1 command / Kingmaker / Iron Fist; 25%
    Unlikable (unless Likable) + Controversial (unless Integrity); **party
    preference −1**.
  - Detailed enthusiasm math: new PL's bound ideology cards ⇒ **+2 enthusiasm**
    (re-elected **+1**); non-bordering ideology cards **−1 each**; Moderate **−2**
    under a LW/RW-Pop PL & vice-versa; `Leadership` ⇒ 25% no drops; `charisma` ⇒
    +1 party pref (−1 if uncharismatic); ±1 party pref 25% if likable/unlikable.
  - **`easily overwhelmed` can't be PL**; former PL can't return unless
    `charisma`. **Becoming Party Leader earns 100 pts.**

---

## M. Presidential Appointments — phase 2.3 (POST 15)

- **President must fill ALL cabinet offices.** 1788 defaults: **Sec of State,
  Treasury, War** (War→Defense later). All other cabinet seats are **created via
  legislation**; **no cabinet exists at the 1774 start** (must be created).
- All cabinet members need **Admin ≥1**; **4-term cabinet max**.
- **Presidential PROMISES** (made during the election) **must be honored** here
  unless (1) Pres is `disharmonious` and (2) the only eligible person is gone.
  Broken promise ⇒ **−3 faction enthusiasm** for the wronged faction.
- **Expertise scoring:** each seat has required + **priority** expertise (priority
  = extra points), `egghead` bonus, and **+10 pts** to Pres & the cabinet
  officer's FL if the officer comes from a faction with the seat's matching lobby
  card (full seat↔lobby map in POST 15).
- **Reelected Pres** may retain **≤5** prior cabinet members (no egghead bonus
  unless shifted to a new seat); retained officers roll admin/`Efficient`/
  `Easily Overwhelmed` changes.
- **Sec of State is "most prestigious"** — anyone who served it **refuses any
  other cabinet office** later.
- **Enthusiasm geometry:** cross-party SecState/Treasury/War/AttGen ⇒ 5-6 roll +1
  enthusiasm for that faction; Pres's party **−1** if most cabinet isn't from his
  faction; allied factions **−1** if under-represented (avoided by `Iron Fist`);
  **era-gated diversity rules** — from **Era of Ideologies** Moderate/Reformist
  cards **−2** if no opposition member in cabinet; from **Era of Terror**
  Civil-Rights/Reformist/LW-Activist cards **−2** unless ≥2 women + ≥3 minorities
  appointed; **pre-Era-of-Terror** +1 enthusiasm if every region represented.
- **Pliable president** ⇒ Speaker/Sen-Maj-Ldr may recommend a cabinet officer
  (ignoring it risks that leader's enthusiasm).
- **Lower offices** appointed after cabinet (filled by Pres, or by cabinet
  nominees if Pres pliable; egghead cabinet may suggest); **lower offices have no
  confirmation hearing; cabinet-level officers DO**.
- **Per-seat meter map** pinned (POST 15): SecState→Trade/Foreign Rel/Global
  Prestige; Treasury→Econ Stability & Budget; Defense→Mil Prep; AttGen→Urban;
  Agriculture/Interior/Transp→Revenue (Interior→Planet from Era of Neocons);
  Health/VA→Quality of Life; Education→Education; Energy→Nat Prod; etc.
- **CPU:** honors promises; highest admin (tie → priority expertise → `efficient`
  → lowest-scoring faction → random); reappoints only **20%**; one other-party
  member **50%** of the time, never more than one.

### M2. Cabinet Confirmation in the Senate — phase 2.3 (POST 16)

- **Default 60% Senate vote** to confirm. The **Sen Maj Ldr** (not Pro Tem in
  early years) can alter via the **nuclear option** (→ simple majority, VP breaks
  tie; **1-2 roll −1 party pref**; can revert for **5-6 roll +1 party pref**).
- **Party-wide block:** Sen Maj Ldr needs `Manipulative` or `Leadership` + a
  reason — **Controversial / Too Partisan (LW/RW Activist) / Inexperienced (admin
  ≤2) / Wrong Personality (Disharmonious or Unlikable) / Just for Spite (Iron
  Fist only)**. `harmonious` Sen Maj Ldr can only block on **inexperience**.
- **Filibuster:** a committee-relevant Senator with `Puritan` can filibuster one
  cabinet officer (officer withdraws) unless bypassed; **`invoke cloture`** (Sen
  Maj Ldr w/ Manipulation + higher Legislative than filibusterer forces a vote).
- **President's tools:** higher Legislative than Sen Maj Ldr ⇒ compel
  confirmation; `Iron Fist` (same-party Sen Maj Ldr) ⇒ compel; Legislative ≥1 ⇒
  convert up to (Legislative #) moderate/pliable/own-ideology Senators (5-6 roll;
  4-6 vs pliable).
- **Initial-vote auto-leans** by trait/ideology (Puritan/Integrity/low-brow/
  egghead/disharmonious/lackey/harmonious; Trad vs Prog auto-oppose; Mod vs
  Populist auto-oppose — suppressed if Pres has Leadership + Legislative ≥1).
- **Block cap = opposing leader's Legislative Power.** Blocked officer ⇒ Pres
  picks a replacement that **alleviates the stated concern** (Controversial→needs
  Integrity; Too Partisan→Lib/Mod/Con; Inexperienced→admin ≥3; etc.), **auto-
  confirmed**.
- **Office-vacancy cascades:** confirming a sitting Governor ⇒ faction appoints a
  placeholder same-state Lt-Gov (or Vacant-but-party-controlled); confirming a
  sitting Senator ⇒ the Governor replaces or leaves vacant until next election.

  > ★ **MAJOR DELTA (gaps #172 confirm-threshold/Nuclear-Option, DH-76
  > filibuster-without-cloture):** the **shipped `runPhase_2_3_1_Cabinet`
  > (phaseRunners.ts:2158) auto-picks the top-scored candidate and logs them
  > "confirmed" with NO Senate vote, NO party-wide block, NO filibuster/cloture,
  > NO nuclear option, NO presidential promises.** This entire post (the most
  > elaborate single-phase ruleset in the thread) is **designed-not-built**. It
  > is the canonical spec for #172 + DH-76 + the promise system (#181).

---

## N. Random Death / Retirement — phase 2.4.1 (POST 17)

- Uses a **0-100% system, not a d6**. Era-bracketed death chance (age measured at
  **start of the 2-yr cycle**, not updated mid-cycle):
  | Era band | 25-55 | 55-75 | 75+ | 90+ |
  |---|---|---|---|---|
  | **1972-present** | 1% | 3% | 5% | 20% |
  | **1900-1972** | 2% | 10% | 25% | — |
  | **pre-1900** | **5% (25-50), 10% (51-60), 25% (61-74)** | | **40% (75+)** | — |
- `Frail` ⇒ +5% & rolled first; `Hale` ⇒ not rolled until the 75 bracket. **Auto-
  retire at age 100.**
- **Caps:** a faction loses **≤3** pols to death/retire — **2 random retirements
  (never Pres/VP/Speaker/Sen-Maj-Ldr/party-leader) + 1 death** per faction
  (brackets rolled oldest→youngest, frail in oldest bracket).
- **Immediate succession rules** pinned: Senators←Governors; Governors←controlling
  faction; Congressional leaders cascade (Whips promote, Maj Ldr→Speaker);
  President fills cabinet (re-confirmation); SecState fills ambassadors;
  Sec-War fills officers; VP/line-of-succession → President; **SCOTUS seats stay
  vacant until the next nomination phase**.
- **Per-era cause-of-death tables** (10 equal-chance causes each, era-specific —
  typhoid/smallpox in Independence … cancer/heart-attack/virus in Terror/
  Populism) — POST 17.
  > Corroborates the gap-log canonical death/retirement schedule (#130/#143);
  > this is the source numeric table.

---

## O. General Events (2.4.2) & Scripted Events (2.4.3) — POST 18-19

- Both use **0-100%**, not d6. **General events** can fire any era (per-era %),
  routed to the relevant player (usually the President). **Egghead cabinet** may
  suggest a response; **pliable** Pres can be steered (manipulative cabinet);
  **VP acts if Pres `easily overwhelmed`**. Multiple eligible non-Pres actors ⇒
  lowest-score player acts first.
- **Scripted events** = unique, often once-only, larger consequences, can spawn
  further scripted events; **all go to the President**.
- **Cadence:** **2-8 scripted events per half-term** — reroll if <2; if the era's
  scripted set is exhausted, **general events backfill**; if >8, use the first 8.
- **Negative-partisanship rule:** if the opposition controls **neither** the
  Presidency nor the House, a "hurt" faction **GAINS** enthusiasm (roused anger)
  instead of losing it — **suspended if the opposition controls a House**.
- **Card-driven enthusiasm rolls** (gain-only cards ⇒ 5-6 roll +1; lose-only ⇒
  1-2 roll −1; etc.). Some scripted events spawn **military/economic/climate/
  health crises** or **linger** if ignored. Industry point effects hit that
  state's Governor + 2 Senators. **Scripted-event rules differ in the Era of
  Independence** (separate doc).

---

## P. Lingering Phase — phase 2.5.1 (POST 20)

- **0-100% system.** Economic crises/booms **never last >10 years**. Meter maxed
  >4 yrs ⇒ 1-2 roll to decay; meter at worst ⇒ 5-6 roll to improve.
- **Each era increases the chance of a meter falling.** **Tariffs & income tax
  DECAY 10% every 2 years once age ≥10; at age 20 they do nothing ⇒ trigger a
  tariff crisis / income-tax crisis.** Volatility rolls at the 2/4/8-yr marks
  (5%-20% swings).
- **Resolution algorithm (multi-roll):** (1) pit each meter's positive% vs
  negative% from lingering legislation; (2) roll if it moves; (3) roll the winning
  direction vs no-change (**top-2/bottom-2 meters ⇒ 25% no-change, else 50%**).
- **Cabinet save:** below-mid meters can be rescued — relevant cabinet member by
  admin: **5 admin = 5-6 up/1 down; 4 = 6 up/1 down; 3 = none up/1 down; 2 = /1-2
  down; 1 = /1-3 down.** `efficient` doubles at worst meter; `easily overwhelmed`
  can't help/hurt; `incompetent` can't roll the positive.
- **Meter↔cabinet map** pinned: Revenue-Budget←Treasury & Commerce; Economic←
  Treasury & Fed Chair; Foreign Rel←State & UN Amb; Mil Prep←War/Defense &
  Homeland; Domestic←AttGen & HUD & Labor; **Honest Government** = special;
  Quality of Life←Health/Education/Agriculture; Planet←Energy & (hypothetical
  Science/Environment).
- **Honest-Government special:** tally Controversial vs Integrity among Govs/
  Senators/Reps/Justices — more Controversial ⇒ 1-2 roll honest decrease; more
  Integrity ⇒ 5-6 roll increase.
  > ★ **DELTA (gap #179 lingering-roll engine; #134 7-step ordering):** this is
  > the canonical lingering algorithm + decay carry-forward. The shipped 2.5.1 is
  > a simpler meter tick. This post is the spec for #179.

---

## Q. Governor Actions — phase 2.5.2 (POST 21)

- States have an **industry + alternate industries**; most-invested = leading
  industry (ties ⇒ multiple). **Governor of a leading-industry state earns 100
  pts** this phase.
- **Amendment ratification happens here:** Congress-passed amendments are voted
  Aye/Nay by **every Governor; 75% of states needed to ratify.** Puritan Govs
  auto-vote by faction interest; others auto-vote by industry point impact;
  Pliable Govs convertible by a Party Leader (1-2 roll; better with Leadership/
  Iron Fist).
- **Secession crises** handled here (special rules).
- **Then governor actions:** 1 action (**`efficient` ⇒ 2**; `incompetent` ⇒ 1-2
  roll to lose the action). Success by governing skill: **1-2 gov = 5-6 roll; 3 =
  4-6; 4 = 3-6; 5 = 2-6.** A higher-judicial **Attorney General** may challenge a
  Governor's gerrymander/anti-corruption action in the SC (once per half-term,
  one state, at Pres discretion).

---

## R. Supreme Court Decisions — phase 2.5.3 (POST 22)

- Assoc Justice = **50 pts/phase**, Chief = **100 pts/phase**. **Automated-SC
  option** available ("acts independently of faction/party").
- **The SC must be created by legislation with a set # of justices.** Without it,
  **states can nullify federal laws** (no court above state courts) ⇒ creating it
  is "a top priority."
- Cases arrive like events + via **state challenges (if Judicial Review exists)**.
  Chief may **delay one case** one half-term (two if highest judicial on the
  bench; a higher-judicial Associate can prevent the delay).
- **Simple majority decides; tie ⇒ delayed to an odd-bench phase.** Puritan
  justices vote their ideology. **Initial vote → conversion attempts** gated by
  judicial-skill advantage (manipulative vs pliable, debate vs moderate, 5-skill
  vs moderate, AttGen blocks, Iron-Fist Pres compels same-party non-Integrity,
  etc.). Chief can compel **unanimous** under strict conditions (5 judicial, no
  Puritan/Activists, dice gates).
- **CPU justices** vote by the **Justice's own ideology** (NOT faction cards),
  always for points, never to lose points.

---

## S. Diplomacy — phase 2.7.1 (POST 23)

- Treaties triggered by Pres/cabinet/legislature/events resolve here, then go to
  **Congress for ratification next legislative phase**. **An alliance treaty is
  required to move a relations meter to "ally"** (the meter caps just below ally
  until the treaty).
- SecState suggests actions per ambassador (pliable Pres + manipulative SecState
  ⇒ forced). Ambassadors **can't be sent to Enemies/Hostiles** (except via
  events). **Ambassador success by ADMIN skill:** 0-1 = 0 success/1-3 fail; 2-3 =
  6 success/1-2 fail; 4 = 5-6 success/1 fail; 5 = 4-6 success/0 fail.
- **Actions:** Increase Relations (±1); Increase Trade Relations (needs ≥neutral;
  5-6 roll +revenue); Extend/Take Credit (needs ≥neutral); **Provoke (retaliatory
  tariff/embargo)** — needs Congress approval **until the President is granted full
  tariff powers**, drops relations 1, 1-2 roll of war.
- **CPU:** never worsens relations; 50% improve / 25% loan / 25% trade.

---

## T. Military Action — phase 2.7.2 (POST 24)

- Wars are **Major / Minor / Operation** with different lingering effects (Major:
  80% +budget, 30% −incumbent party pref; etc.). **Incumbent party-pref penalty
  DOUBLES every 4 years a war lingers.**
- **Win-by-battles:** check "Leads to Another War"; **Major war ⇒ `Celebrity` to
  the top military+naval officer & last-ground-battle winner** (war heroes), +2
  party pref, +1 faction enthusiasm (not if Pres Pacifist), **Pres permanent +1
  in elections.** Minor/Operation give smaller bonuses.
- **Lose-by-battles:** check "Leads to invasion of the US"; permanent −1 elections
  + −1 mil ability to top officers, Pres permanent −1 elections, party pref −2.
- **Combat order:** abroad ⇒ **win all naval battles before ground**; domestic ⇒
  ground or naval any time.
- **Special:** any Major war = a military crisis; **losing an invasion of the US
  ENDS THE GAME**; per-battle officer skill/`Military Leader`/`Efficient` rolls;
  Pres may remove a losing officer (Sec-Defense refills unless Pres mil 4-5);
  reelected wartime Pres gains Military expertise +1 mil; >2 wars/half-term ⇒
  `Expansionist`; **difficult battles** carry a 1-die wound/kill roll; court-
  martial machinery.
- **CPU:** replaces a military officer if its mil ability ≤2.
  > Corroborates the 1772 RevWar trace (#155) and the "generic war engine
  > relabeled per era" finding (Cold War etc.).

---

## U. Congressional Proposals — phase 2.6.1 (POST 25)

- **"Spending Bill"** = any bill that may raise the budget; meters can restrict
  Spending Bills (first proposed get first passage chance; excess stripped).
- **Tariff/Tax replacement point table** pinned (POST 25): graduated by size of
  change (≤5% = minor 10 pts; 6-10% = 50; 11-25% = 100; >25% = rare-major **500
  pts**), with **era-conditional sign flips** (e.g. pre-Era-of-Ideologies Big
  Corps/Wall Street like tariff hikes, after they dislike; LW/RW Pop dislike
  tariff hikes until Era of Neocons, then like them).
- **Proposal frequency limits:** new income-tax **bracket once / 4 years**; new
  **tariff once / 8 years**; **no repeal within 2 years of passage** unless a
  House flips party.
- **Who proposes:** **Ranking & 3rd committee members** (Party Leader w/ higher
  Legislative can swap in one per half-term). **Supermajority (≥60% of a House)
  ⇒ committee Chairs may also propose** in that House. One proposal each per
  half-term (**`Efficient` or Legislative 5 ⇒ 2**). **Repeal counts as a
  proposal** (double points if a Traditionalist's repeal succeeds).
- **All committee members must propose a bill or repeal** unless they hold the
  **Traditionalist card**. **Proposers must vote for their own bill** (exception:
  packaged with point-losing bills). **Crisis-meter bills: no faction nets
  negative + points DOUBLE.** Proposers may only propose bills that **help one of
  their cards or an ongoing crisis** (exception: wartime military-ability bills).
- **Cabinet proposals:** 4-5 admin cabinet members may propose dept legislation
  (Pres-approved) for same-party pickup; SecState (efficient/4-5 admin) treaty
  and SecTreasury proposals **don't count** against legislator quotas.
- **CPU:** 50% crisis bill (puritan: only faction-ideology), 25% faction, 25%
  party.

---

## V. Committee Review — phase 2.6.2 (POST 26)

- Proposals route to House/Senate committees (House↔House, Senate↔Senate — **never
  merge House + Senate packages**). **Chair may block ONE proposal** if higher
  Legislative than the proposer (replace with a chair's own committee-bill,
  auto-passed) — unless `incompetent`/`harmonious`; `efficient` members are
  unblockable unless chair is `efficient`/`iron fist`.
- `Debate` member ⇒ 5-6 roll to flip a committee vote (flipped twice ⇒ gains
  pliable 50/50). **Majority-of-Majority rule** (if active): Speaker/Sen-Maj-Ldr
  w/ `Manipulative` blocks one opposing-party committee bill.
- **2 of 3 votes pass committee.** Passing bills are **packaged** (amendments
  stay solitary) and sent to the House as one package. A 5-Legislative+efficient
  chair can build **mega-packages during a related crisis** (+3 own proposals, one
  a tax increase); a manipulative+efficient chair can **split packages** into
  isolated bills.

---

## W. Floor Votes — phase 2.6.3 (POST 27)

- **Bill goes to House first, then Senate** (simple majority each; **VP breaks
  Senate ties; a House tie FAILS**). Then to the President.
- Failed bills can still move meters / award points (usually reversed). State-
  industry-aligned votes give reelection ±1 rolls.
- **Rogue votes** by Puritan/Integrity/Pliable pols; **Iron-Fist Speaker / Sen-
  Maj-Ldr with Legislative 5 holds all party votes** on the initial vote.
- **Vote-conversion machinery** (post-initial): Pres/Party-Leader convert by
  Legislative 4 (1 each chamber) / 5 (2 each); `orator` speeches flip 3 Senate +
  3 House votes (debate = 2 each, plain = 1 each; 5-6 roll); Manipulative leaders
  convert allied/pliable votes; same-state Senator w/ +2 Legislative converts;
  **Congressional Promises** (5-Legislative leaders trade package support).
  Passed packages → President; **passed amendments → states (Governor phase),
  bypassing the President.**
- **Statehood-vote rule:** voting against a statehood bill ⇒ opposing party 1-2
  roll −1 bias in that future state + FL −1 in that region's elections.
- **CPU:** 50% vote for card-helping bills, 25% party, 25% crisis; always tries
  conversions.

---

## X. Signing / Veto / Override — phases 2.6.3-end & 2.8 (POST 28-29)

- **President cannot veto/sign an AMENDMENT** (goes straight to states).
- **>1 package vetoed per half-term ⇒ a Legislative-5 Speaker may impeach for
  "abuse of power."** Vetoing a crisis-resolving bill ⇒ Pres 1-2 roll −1
  reelection.
- Pliable Pres can be overridden internally by manipulative/leadership cabinet/
  advisor/VP (5-6 roll; 4-6 advisor). Card-driven enthusiasm/party-pref rolls on
  signing.
- **Override:** House first needs **2/3 of Legislative Voting Power**, then Senate
  **2/3**. Override ⇒ **Pres −100 pts + 1-2 roll `disharmonious`**; **Speaker &
  Sen-Maj-Ldr +100 each**. Post-initial conversion machinery reused.

---

## Y. Executive Actions — phase 2.8.1 (POST 30)

- **President may take as many executive actions per half-term as he has Command
  Points.** Can **deactivate** prior administrations' actions. Pliable Pres ⇒
  manipulative VP/advisor/cabinet makes the first action (5-6 roll). Card-driven
  enthusiasm/party-pref rolls; deactivating a card-hurting action ⇒ −100 pts +
  leader penalties.
  > ★ **DELTA / SETTLES (#182 command=action-budget):** the rulebook explicitly
  > pins **Command = the per-half-term executive-action budget** — the canonical
  > source for the #182 "command is the action economy" finding.

---

## Z. SCOTUS Management — phase 2.8.2 (POST 31-32)

- **Compelled retirements (POST 31):** a player may retire their own Justice at
  **age ≥75 or ≥12 years served**; Pres may remove a Justice by appointing them
  elsewhere. **Iron-Fist** Pres ⇒ 4-6 roll to force one same-party Justice out
  (immune: 5 judicial + Integrity); **Manipulative** Pres ⇒ compel any 12-yr
  Justice (5-6 roll; automatic if Pres has higher judicial). Trait immunities
  (Integrity/5-judicial/harmonious/incompetent/lackey/disharmonious) pinned.
  Retired Justice ⇒ 1-5 roll to leave the game.
- **Nomination & confirmation (POST 32, re-quoted POST 34):** Pres nominates any
  pol with **Judicial expertise + Judicial ≥2** (designer **confirms the floor =
  2, not 1**, POST 35 — resolving an inconsistency CE2 flagged in POST 34/36).
  **Pres & Justice each get 100 pts PER judicial skill** of the nominee (5
  judicial ⇒ 500 each; **doubled for Chief**). Cross-party/same-ideology/puritan
  appointment rolls pinned. **60% Senate confirmation**; reuse the cabinet block
  rules (substitute "inexperienced" = judicial ≤2). **Nuclear Option** (→
  majority) and **"Merrick Garland"** delay (only in a 2nd-term lame-duck OR for
  an unelected VP-president). Blocked nominee ⇒ Pres picks moderate/other-party,
  auto-confirmed.
  > **DELTA:** the shipped 2.8.2 fills vacancies but lacks the full
  > confirmation/Merrick-Garland/Nuclear-Option machinery (parallels the cabinet
  > #172 gap). This is the canonical SCOTUS-confirmation spec.

---

## NOT covered (author-declared out of scope, POST 33)

- **The entire Election system** — primaries (2.9.1), conventions (2.9.2), third
  party (2.9.3), presidential general (2.9.4), governor (2.9.5), congressional
  (2.9.6). "The Election Rules are kind of massive… not going to post those."
  ⇒ This rulebook does **NOT** settle the primary/brokered-convention/general
  math (gaps #13/#47/#111/#183/#184/#185 remain owned by the playthrough digests,
  esp. `redbutton`).
- **All "Special Rules"** per system (incl. the **Era-of-Independence special
  rules** the playtest actually started under, and the **Implementation rules**
  referenced repeatedly) — not posted here.
- **The Career Track Chart, Cabinet-office doc, Gov-Actions spreadsheet, War
  Charts** — referenced as external spreadsheets, not in-thread.

---

## ★ Reconciliation candidates for consolidation (rulebook-vs-shipped + settled questions)

**Deltas (rulebook says X; build/earlier-digest differs — hand to tech-lead):**
1. **Era model (#92).** Rulebook (POST 2): **15 named eras with date-triggers**
   + the canonical trigger-year table. Build: **4-value `Era` enum + `year%4`
   predicates + event-gated transitions**. Digests (#92): **content-bands gated by
   game-state/territory**. Reconcile the three; the trigger-year table is the
   authoritative source for the **band labels** the build collapses.
2. **Cabinet confirmation (#172, DH-76, #181).** Rulebook (POST 15-16): full
   Senate **60%** confirmation + party-wide block + filibuster + **invoke
   cloture** + **nuclear option** + **presidential promises**. Build
   (`runPhase_2_3_1_Cabinet`, phaseRunners.ts:2158): **auto-picks top score, logs
   "confirmed," no vote at all.** Entire confirmation subsystem is unbuilt.
3. **SCOTUS confirmation (#172 sibling).** Rulebook (POST 32): **60%** vote,
   Merrick-Garland delay, Nuclear Option, judicial-skill auto-confirm. Build:
   vacancy fill without the confirmation machine.
4. **Lingering algorithm (#179, #134).** Rulebook (POST 20): the multi-roll
   positive/negative-pit + **tariff/tax 10%/2yr decay → crisis at age 20** +
   volatility rolls + admin-keyed cabinet save. Build: simpler meter tick.
5. **Card-assignment engine (#50/#51).** Rulebook (POST 10): canonical plurality
   + compatibility/ban tables + **5-politician floor** + cascade for ideology/
   interest/lobby cards. The authoritative spec for the enthusiasm/Score layer.
6. **Conversions, kingmakers, leadership trait-rolls (#128/#179-cluster).** POST
   8/9/11-14 give the canonical base %s and trait gates (already corroborated by
   `tedchange` POST 51/52/53 — this is the primary source).
7. **Death/retirement schedule (#130/#143).** POST 17: the authoritative per-era
   age-bracket % table + 2-retire/1-die caps + succession cascade + cause tables.

**Open questions this rulebook SETTLES:**
- **Command = the per-half-term executive-action budget** (POST 30) — settles
  **#182**.
- **Cabinet confirmation threshold = 60%** (POST 16) and **SCOTUS = 60%** (POST
  32), Nuclear Option → simple majority — settles the threshold half of **#172**
  (matches the `modernday` Ted ruling).
- **SCOTUS nominee floor = Judicial ≥2** (designer-confirmed POST 35, NOT 1) —
  resolves the POST 34 inconsistency.
- **Override threshold = 2/3 of Legislative Voting Power in each chamber** (POST
  29).
- **Amendment ratification = 75% of states, voted by Governors in 2.5.2** (POST
  21); **amendments bypass the President** (POST 27/28).
- **Committee size scaling: 1788 base, +1/party at 20 states, +1/party per +10**
  (POST 12) — settles the committee-data gap (#174-ish).
- **Tariff/tax cadence: new bracket once/4yr, new tariff once/8yr, no repeal
  within 2yr** (POST 25); **tariff/tax decay 10%/2yr from age 10, dead at 20**
  (POST 20).
- **Scripted-event cadence = 2-8 per half-term** (POST 19); **death uses 0-100%
  not d6** (POST 17), as do general/scripted/lingering phases.
- **Negative-partisanship rule** (opposition out of Pres+House ⇒ "hurt" faction
  GAINS enthusiasm) — appears identically in events/legislation/exec-actions
  (POST 19/25/28/30); a single cross-cutting rule for the engine.

**Open questions this rulebook does NOT settle:** all **Election math**
(primary/convention/general/governor/congressional, #13/#47/#111/#183/#184/#185),
all **Special Rules** (incl. the Era-of-Independence special rules the playtest
ran under, and **Implementation rules**), and the external charts (Career Track,
Cabinet, Gov-Actions, War). Author explicitly withheld these (POST 33).
