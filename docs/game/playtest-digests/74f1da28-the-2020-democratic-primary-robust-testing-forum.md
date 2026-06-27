# 74f1da28 — "The 2020 Democratic Primary: Robust Testing Forum"

**Scope:** 114 posts / 2 chunks (`chunk-001` POST 1-97, `chunk-002` POST 98-114).
A **deliberate balance / edge-case STRESS-TEST**, May 2022, hand-rolled on
spreadsheets — NOT a played-forward game. GM/roller **@Arkansas Progressive**
("A man from Colorado"/"ShortKing"); designers **@vcczar** (V) and
**@MrPotatoTed** (Ted) post **authoritative** rulings in-thread (designer >
roller). Modern polarity BLUE=Dem / RED=GOP. The thread does two things at once:
(1) re-runs the **2020 Dem primary** and the **2020 general** repeatedly with
real candidates (Biden/Sanders/Warren/Buttigieg/Bloomberg vs Trump-Pence) to
hunt for **balance breaks**, seeded by a deliberately **OP hypothetical** ("Alt
Hist Hypothetical James Dean": 2 command, 0 in everything else, a stacked
trait list, declared "OP — nuff said", POST 1-2); and (2) mid-thread pivots into
a **2022-start CPU draft** that is scrapped and redone for balance reasons.
**This thread is an ORIGIN source (May 2022)** — it predates `redbutton` (1960,
where #183/#184 were re-found) and `revampPV` (Feb 2023, #214-#220). Several
"new" gaps elsewhere are first articulated here.

The election math here is the **pre-revamp hand spec**: a per-state "sub-points"
sum of campaign bonuses/maluses, decided by a **D-something die** (D3/D6 swap
mid-thread), then a **state-bias margin amplifier**. Map this onto shipped
`calcStateVote` (`phaseRunners.ts:3685-3723`): `enthusiasm`/`partyPreference` =
the "meter"/"party pref" terms; `pv*0.1` = the (tiny) PV term; `(Math.random()-
0.5)*8` = the die. The bias amplifier and the per-bonus sub-point list are
**designed-but-unshipped detail**.

---

## 1. What makes a candidate "OP" (PV / trait / command findings — #214 evidence)

The James Dean case is the headline OP construction and the cleanest single
piece of **#214 PV-revamp evidence** in the thread:

- **The OP build (POST 2):** `2 command`, `0` in every skill, ideology Liberal,
  traits **Pacifist + Technology** (a founder-of-a-department trait) **+ Likable,
  Charisma, Orator, Propagandist, Celebrity, Passive, Cosmopolitan, Crisis
  manager**. Declared OP on the strength of the **trait stack alone** (skills are
  all 0). Ted and the roller both flag him "pretty overpowered" / "powerful"
  and explicitly ask "what would a *normal* candidate look like?" (POST 18, 20).
  → **Direct #214 signal:** in the hand-rules a fat trait list dominates even
  with 0 skills and only 2 command. Shipped `pv.ts:75-78` gives a flat **+4 per
  positive trait** — so an 8-trait pol = +32 PV from traits, swamping skills.
  This is exactly the over-weighting `revampPV` #214 (per-trait tiers) targets;
  the digest's OP build is the concrete "why a flat +4 is wrong" exhibit.
- **Command is cheap-but-decisive (POST 22, NEW corroboration of the command
  gate):** Dean wins OK on "regional bonus + meter effects → 2-2 tie, then won
  the rolls 5-3" — i.e. with **0 skills he is still a viable nominee/winner**
  purely on command(2)+traits+meters. The shipped primary gate
  (`phaseRunners.ts:3729`) requires `command >= 2` to even run, and the primary
  sort key is `pvCache + command*5 + traitBonus` — so a 2-command 0-skill
  trait-stack pol clears the gate and rides traits to the top. Corroborates the
  command-as-eligibility gate; **NEW** as a *balance* datapoint (command floor
  is too easy to satisfy for an otherwise-empty pol).
- **In-game traits that actually swung states (POST 31):** the per-state bonus
  ledger names concrete trait/identity effects worth ±1 each — **Puritan = −1**
  (fires for *both* candidates), **Experience = +1**, **home-state = +2**,
  **home-region = +1**, preferred/least-preferred ideology = ±1, debate wins
  = +1 each, "enthusiastic base" = up to +2 (meter + state-ideology), domestic
  & economic crisis = −2. → evidence for which trait/ability values the #214
  reweight must *price*: home-state/home-region and debate/experience are the
  high-value electoral knobs, far more than raw skills.
- **Charisma is a force-multiplier on the (designed) third-party spoiler rules**
  (POST 75): the spoiler -1 party-pref effect goes from regional→nationwide
  *if the 3rd-party nominee has Charisma*, 50%→75%. → another row where a single
  trait (Charisma) is disproportionately load-bearing; feeds #214's "which
  abilities are over-weighted" question.

**Office→PV table (POST 112) — direct #214/#215 corroboration + a delta vs
shipped `OFFICE_PRESTIGE` (`pv.ts:7-31`):** designers set, this thread,
"Positions now give increase to politician value":
President **+30**, Justice / Senate-Maj / Senate-Min / Speaker **+25**,
Senator / House-Maj / House-Min **+20**, Gov / VP **+15**, Rep **+10**, Cabinet **+5**.
Shipped values differ materially: Senator **5** (spec 20), Representative **2**
(spec 10), Governor **6** (spec 15), VP **12** (spec 15), Cabinet **8-12**
(spec 5), Speaker **12** (spec 25). → **NEW corroboration that the office-prestige
half of the PV revamp (#215) has a designer-authoritative table the shipped
numbers don't match.** This May-2022 table likely predates the Feb-2023
`revampPV` list; treat `revampPV` POST 33 as the later word, but log that the
office tier was already being raised dramatically (legislators/reps grossly
under-weighted in `pv.ts` vs design).

---

## 2. Primary-system mechanics & balance breaks (#185 / #183)

The thread runs the 2020 Dem primary **four+ times** and surfaces a full
withdraw/endorsement spec plus a reproducible balance break.

- **Brokered-convention is real (POST 4):** "nobody got a majority before the
  convention" — delegates split Bloomberg 402 / Warren 159 / **Buttigieg 600** /
  Biden 298 / Sanders 162. Corroborates **#185** (primary→brokered-convention
  state-machine; no-majority → convention).
- **★ The endorsement-MOMENTUM spec, in full (POST 5) — the OTHER side of the
  #183 CONFLICT.** GM's "official rules" for serial primary groups:
  - After group 1, **last-in-delegates: 60% withdraw**; on withdraw, endorse
    split **50% front-runner / 25% nearest-ideology / 25% most-states-won**.
  - Later groups: **last = 75% withdraw**, 2nd-to-last = 50%, endorsement split
    50/50 front-runner vs nearest-ideology.
  - Final three: last has 50% withdraw **unless delegate gap > 20%** (then auto).
  - **Puritan / Disharmonious spite rule:** on a triggered withdraw, a 4-6 d6
    means they **stay in to spite the front-runner, taking −2 in all future
    primary groups**.
  - **Withdraw chances were then DOUBLED as an "official rules change"** (POST 11).
  → This is a concrete, designer-blessed **endorsement-momentum** ruleset. It is
  the **ORIGIN of the #183 CONFLICT** the KB flags (2022 sheet says momentum
  exists, `redbutton` says none): the momentum/endorsement-redistribution spec
  *does* exist and is detailed here; what's missing is whether endorsed
  delegates *transfer* and whether the app implements any of it. (Shipped
  `runPhase_2_9_1_Primaries` just sorts once on PV+command+traits and picks the
  top — **no withdraw, no endorsement, no momentum, no convention**.)
- **Endorsements visibly redistribute delegates (POST 7, 11):** Biden withdraws,
  endorses Buttigieg → "245 Buttigieg, 81 Bloomberg" of his bloc moves; Sanders/
  Warren endorse Buttigieg. So endorsement = an actual delegate transfer with a
  split, not flavor. Strengthens the case that #183's momentum half is specced.
- **★ BALANCE BREAK — primary result is non-historical and "locked in" (POST 4,
  7, 8, 11):** **Buttigieg wins all three+ runs** (600 → 989 → 700 delegates);
  the two real front-runners (Biden, Sanders) are "mired toward the bottom".
  Player asks: stats, bad rolls, or systemic? **Designer answer (POST 12, Ted):
  systemic** — "in the modern era Liberals, Progressives and LW-populists have
  **maluses due to meter issues**. Biden is a Lib. The only Mods are Buttigieg
  and Bloomberg." → the modern meter state hands **Moderates** the primary; the
  ideology-enthusiasm meter, not candidate quality, decides it. **NEW** as a
  named primary-balance break: *modern Moderate over-performance is meter-driven
  and reproducible*, and it is the cause of a primary that won't reflect history.
- **Endorsements-not-modeled-in-the-app, designer-confirmed (POST 9-10):** the
  Clyburn/Biden-SC example prompts "I don't think endorsements are included
  outright… could be included easy enough (pick up endorsement based on die roll
  to get a bump in that state)." Corroborates **#183** (endorsement hole) and the
  general "election is a small slice; it's a die-roll sim, role-play the rest"
  design stance.

---

## 3. Election-scoring breaks (#18 / #184 / DH-72 / #214)

- **★ "The D6 was so very, very dumb" (POST 23) — the swing-die dominates.**
  Swapping D6→D3→D5→D6 changes who wins states and the EV total wildly off the
  *same* pre-roll sub-points (POST 22, 25, 27, 113). The hand "D = ±N per
  candidate" die is the shipped `(Math.random()-0.5)*8` jitter term in
  `calcStateVote`. **Direct corroboration of DH-72 / #18 / #184**: the random
  term is large enough to flip close states and to swamp the (deliberately
  small) PV contribution. POST 113's sweep is the cleanest datum: base 2020 map
  ranges **D 326-212 → 374-164** purely on die size; GM concludes **"D3 seems a
  pretty good strat"** (smaller die = more stable, more historical).
- **★ The state-bias margin amplifier is the platform/landslide lever (POST 28,
  31, 48, 54, 57-60) — ORIGIN-adjacent to #184/DH-72.** Rule: after sub-points,
  if a candidate's state margin ≥ a cutoff, **add a flat bias bonus by state
  lean**. Old spec: **+5/+10/+15 for D/R +1/+2/+3, cutoff "6 or more"**
  (V, POST 57, 60). Proposed re-tune: **+4/+6/+8/+10/+12 for +1..+5, cutoff 4**
  (POST 54), which V calls **"way too high"** (POST 56) and defers. → this flat
  per-lean amplifier is the same family as the **platform-overpower** finding
  (#184/DH-72): a flat additive bonus that, once a threshold trips, blows margins
  out (e.g. a +7 raw margin in MD becomes +22). **Corroborates #184/DH-72** and
  adds the **specific numbers and cutoff** under debate in May 2022 (provenance
  upgrade, not a new gap).
- **★ Landslides / wrong-state outliers — the map is too elastic (POST 18-20,
  26, 30, 40-50).** Repeatedly: Dem wins OK/KS/AK; "Florida votes to the right
  of Mississippi"; "Wyoming and Kentucky highly competitive"; CA/NV margins feel
  swapped. Root cause (POST 28): margin bonuses only fire at the ≥6 (later ≥4)
  sub-point cutoff, so safe states never lock and tiny rolls flip them. **NEW
  design proposal (POST 40-49, ShortKing + others):** **cap the competitive map**
  — only states with party-pref ≤1 (the **0-lean PA/WI + the ±1 list: ME/MI/NH/
  NV / AZ/FL/GA/MT/NC/OH**, POST 45-48) are true "battlegrounds"; everything
  else draws a margin from a bounded random range so MS/CA can't become swing
  states. V: "might wait until we can do elections on CPU… run 100+ tests a day"
  (POST 61). → **NEW gap candidate: a swing-state set / safe-state floor** so the
  modern map stops producing implausible flips. (Not in shipped `calcStateVote`,
  which scores every state identically and lets the jitter flip anything.)
- **State-bias data is stale across tools (POST 50-52):** V "updated the biases
  for every state… WY is now Red +5" but the roller is "using the old copy."
  Re-rolls/primaries had to be redone. → corroborates the perennial
  **single-source-of-truth-for-state-data** friction (data lives in a
  spreadsheet, app/sheets drift). Not a mechanics gap; a content-pipeline note.
- **Modern Moderate over-performance in the GENERAL too (POST 66-67):** "Moderates
  a bit strong" — Ted: in 2020 Moderates get **+1 in the general** (after −1 in
  the primary), are rarely any state's hated ideology, and are preferred in many
  R-leaning states. Buttigieg-Klobuchar repeatedly land at ~49.7% vs Trump
  (essentially a coin-flip, POST 64). → corroborates §2's meter-driven Moderate
  edge; the primary penalty + general bonus is an explicit, intentional knob that
  nonetheless reads as overpowered in 2020.

---

## 4. Third-party / spoiler system — DESIGNED, fully unbuilt (NEW detail)

A spoiler mechanic is **designed in-thread but does not exist in code** (no
`thirdParty`/`spoiler` anywhere in `src/`).

- **Balance break that motivated it (POST 68, 71-72):** with a Sanders/McKinney
  3rd-party ticket (6.85% PV), Blue **still won comfortably and even gained red
  states** — Ted: "feels like a popular blue third-party should have been much
  more devastating to Blue." V: 3rd parties currently only modeled vs the
  *incumbent*, "should also affect the challenging party if the 3rd party springs
  from it." → the spoiler currently mis-attributes its drain.
- **★ Designer-authored spoiler ruleset (POST 75, both designers like it,
  POST 76-77) — a NEW design spec:**
  - 3rd party sprung from a nominee's **party** → 50% chance **−1 party-pref** in
    the 3rd-party nominee's **home region**; expand **nationwide** at 50% **if the
    3rd-party nominee has Charisma**.
  - 3rd party shares a nominee's **personal ideology** → 50% **−1 party-pref
    nationwide**; → **75% if Charisma**.
  - **Incumbent** facing a major 3rd party → 50% **−1** if party-pref leans away
    from the incumbent party (rationale: Anderson 1980, Weaver 1892, Nader 2000).
  - Open extension (Ted, POST 77, V "I'll think about it"): if the 3rd-party
    ideology exists in only **one** party's factions, drain that party.
  → **NEW gap candidate:** a third-party/spoiler vote-drain sub-system keyed on
  party-of-origin, shared-ideology, incumbency, and the **Charisma** trait. Wholly
  absent from the build.

---

## 5. Draft / faction-formation balance (2022-start CPU draft — corroborates the
modern-boot + draft-restriction cluster)

The thread pivots to building a **2022-start** all-CPU game and **scraps the
first draft** for balance reasons — a clean modern-boot-is-hard datum.

- **★ Starting-draft ideology spread too wide → redo (POST 96, 99-104):** with
  **3 ideologies per faction**, the CPU produced absurdities: "**Joe Biden is in
  charge of Bernie Sanders and AOC**," only Seth Moulton can lead Harris/Warren,
  and **Trump landed in a faction he wasn't even allowed to lead** (so couldn't
  be Party Leader; the GM hand-traded him for Santorum "about the same political
  value", POST 95). Fix: **trim the starting draft to 2 ideologies/faction**
  (an explicit ten-faction ideology ladder, POST 96/99). V (POST 100): 3 is fine
  for a *rookie* (mid-game) draft but not a *starting-year* draft — "there's no
  established baseline to temper the factions"; for 1960 they **manually balanced
  starting pols**. → **corroborates the modern/era-start-friction cluster
  (#173/#186/#187)** with a *draft-specific* mechanism, and the
  **draft-ideology-restriction toggle (#171)**: here the restriction is *too
  loose* (3) at a cold start. NEW angle: **a starting-draft should use a tighter
  (2-ideology) restriction or manual seeding vs a mid-game draft (3).**
- **CPU draft holes (POST 96, designer-listed) — corroborates #114/DH-36:** the
  first draft proved (1) "added" non-served pols were **too OP** (state
  legislators rolling Charisma/Leadership — should be rare); (2) **no CPU rule to
  prioritize sitting office-holders** — CPU "passed the sitting President to grab
  people irrelevant for a decade"; (3) **too many pols have 2-3 command who
  shouldn't**; (4) ideology spread (above). Plus planned CPU rules: draft
  **dynasty members** of pols you already hold (POST 98), and restore the
  **"obscure" trait** to faded figures so faction-leaders don't "come out of
  nowhere" (POST 97). → all corroborate the **CPU-draft / CPU-decision-making
  gap (#114/DH-36)** and the **sub-floor balance rule** (failed/era figures must
  get weak electoral stats; here non-served pols leaked Charisma/command/leadership).
- **Lobby/interest acquisition by raw-count vs per-capita (POST 87-91):** V
  considers awarding a lobby by **% of faction members** holding the relevant
  pols rather than raw count (so a 152-member faction doesn't auto-dominate a
  105-member one). Ted: current raw-count is fine (many lobbies have restrictions
  anyway). Floated as a **rule toggle** (10centjimmy, POST 90). → minor design
  option on the interest-group acquisition rule; left as-is for now.
- **Influential-US-Rep proportional weighting (POST 79-85) — corroborates #219.**
  V rewrites the rule so a state's influential US Reps can hold **unequal** shares
  of the delegation's vote (to set historical Rep counts), via an 8-factor point
  system (district match, ideology match/anti-match, higher legis ability,
  Magician +1, incumbent +1, Provincial +1, Easily-Overwhelmed −1, Incompetent
  −2) then a die-rolled %-split (51-75 medium states / 35-50 big states). Needs
  automation (POST 81-82). → **corroborates #219** (US-Rep proportional
  representation) with the explicit point formula and the trait inputs.

---

## 6. Trait-semantics ruling (corroborates the trait taxonomy / #216 remap)

- **Crisis Manager ≠ Crisis Gov ≠ Crisis Admin — three job-specific traits, by
  design (POST 102, 105, 108-111).** Ted argues one "Crisis Manager" should cover
  all; V: **no** — Crisis Manager is **president-only**, Crisis Gov for governing,
  Crisis Admin for admin roles ("Lincoln a crisis manager *as president*… not
  necessarily as Gov or Sec of Interior"). Contrast with **Leadership**, which is
  a single trait regardless of office. → corroborates the **trait taxonomy**
  feeding the **#216 trait-name remap** and #214 valuation: some traits are
  **office-scoped** (Crisis Manager/Gov/Admin) and must be priced per-context,
  unlike flat traits. Useful when reconciling `revampPV`'s tier list against
  shipped flat `traits[]`.

---

## Candidate gaps for consolidation

**(consolidation agent owns the gap-log write — listed NEW vs corroborates-#)**

NEW (origin/first-articulation in this May-2022 thread; verify against later
designer word in `revampPV`/`redbutton`):
- **NEW — competitive-map / swing-state set (election scoring).** Cap which
  states can flip: only party-pref ≤1 states (PA/WI 0-lean + the ME/MI/NH/NV /
  AZ/FL/GA/MT/NC/OH ±1 list) are true battlegrounds; safe states draw a bounded
  margin so MS/CA never become swing states. Cause: flat margin-cutoff lets the
  jitter flip anything. (POST 28, 40-50.) Not in shipped `calcStateVote`.
- **NEW — third-party / spoiler vote-drain sub-system.** Wholly unbuilt
  (no `spoiler` in `src/`). Designer-authored ruleset keyed on party-of-origin,
  shared personal-ideology, incumbency, and **Charisma** (region→nationwide
  escalation). (POST 68-78.)
- **NEW (balance datum) — modern Moderate over-performance is meter-driven and
  reproducible** in BOTH primary and general: Liberals/Progressives/LW-pop carry
  modern-era enthusiasm-meter maluses → Moderates (Buttigieg/Bloomberg) win the
  2020 primary every run and edge the general; designer-confirmed cause, not
  rolls. (POST 8, 12, 66-67.) Feeds #18 (meter→election) and #214 valuation.
- **NEW (draft balance) — starting-year draft needs a tighter ideology
  restriction (2) or manual seeding than a mid-game/rookie draft (3).** Cold
  start with 3 produced incoherent factions (Biden over Sanders/AOC; Trump
  unleadable). (POST 96, 99-104.) Distinct angle on #171; corroborates #173/#186.

Corroborates / provenance-upgrades existing rows:
- **Corroborates #214 (trait→PV reweight) — the strongest *balance* exhibit:**
  the James Dean OP build (0 skills, 2 command, ~8 traits → "OP") proves a flat
  +4/trait swamps skills; in-game ±1 trait/identity electoral knobs enumerated
  (POST 2, 18, 31, 75). + the high-value knobs are home-state/region & debates,
  not skills.
- **Corroborates #215 (office prestige + Command reweight):** POST 112's
  office→PV table (Pres +30, Justice/Senate-lead/Speaker +25, Senator +20,
  Rep +10, Gov/VP +15, Cabinet +5) is a designer table the shipped
  `OFFICE_PRESTIGE` badly under-shoots for Senator/Rep/Gov/Speaker. Likely a
  May-2022 predecessor to `revampPV` POST 33.
- **Corroborates / ORIGIN of #183 (endorsement-momentum) — resolves the
  CONFLICT direction:** the full withdraw/endorsement-redistribution momentum
  spec EXISTS and is detailed (POST 5, 7, 11) with delegate transfers and a
  Puritan/Disharmonious spite penalty; the app implements none of it.
- **Corroborates #185 (primary→brokered-convention):** no-majority delegate
  splits → convention (POST 4); serial-group withdraw machine (POST 5).
- **Corroborates #184 / DH-72 (platform/flat-bonus overpower) + #18 (swing-die /
  meter→election):** "the D6 was so very, very dumb" — die-size flips states and
  EV totals off identical sub-points (POST 22-23, 25, 27, 113); the state-bias
  margin amplifier (+5/+10/+15, cutoff 6 → debated +4..+12, cutoff 4) is the same
  flat-additive-blows-out-margins family. Provenance upgrade with specific
  numbers under debate May 2022.
- **Corroborates #114 / DH-36 (CPU draft / decision-making):** CPU passed the
  sitting President; non-served pols leaked Charisma/command/leadership; planned
  CPU rules for office-priority + dynasty drafting + "obscure" restoration
  (POST 96-98).
- **Corroborates #219 (US-Rep proportional representation):** the 8-factor
  point formula + die-split %s for unequal influential-Rep weighting (POST 79-85).
- **Corroborates #216 trait taxonomy:** office-scoped Crisis Manager/Gov/Admin
  are deliberately three traits (POST 102-111).

## Open questions (for the human / consolidation)
- Does the #183 momentum spec (POST 5: 60/75/50% withdraw + endorsement splits +
  the doubled rates POST 11) supersede or conflict with the later 2022-sheet
  25%/10% and `redbutton`'s "none"? This thread is the earliest detailed version.
- POST 112's office→PV table vs `revampPV` POST 33 vs shipped `OFFICE_PRESTIGE`:
  which is canonical for the #215 reweight? (Likely revampPV, Feb 2023 > this.)
- Is the "competitive-map cap" a wanted feature or was it shelved as too late /
  "wait for CPU elections" (POST 61)? Worth a designer confirm before roadmapping.
