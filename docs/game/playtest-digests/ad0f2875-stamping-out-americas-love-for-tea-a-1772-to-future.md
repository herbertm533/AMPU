# Digest — `ad0f2875` "Stamping out America's love for tea: A 1772 to future"

> **Final committed thread-digest (2-stage reduce).** 26 chunks (POSTS 1–157,
> 157 long narration-heavy posts) → 3 map-partials (01: chunks 1–9, 1772→1828;
> 02: chunks 10–18, 1828→1860; 03: chunks 19–26, Civil War→1874) → this.
> Citations are `===== POST n =====` markers. Raw chunks + partials are
> gitignored/disposable; **this digest is the durable record.**
>
> **★ THE HEADLINE — strongest era-band proof yet.** This **1772-start** save
> explicitly *names and scores* its era-bands at game-state-driven boundaries:
> Independence → **Era of Federalists** (~1800) → **Age of Republicanism**
> (~1820) → **Era of Democracy** (~1840) → **Era of Manifest Destiny** (~1856) →
> **Era of Nationalism** (~1868, after Reconstruction) → Gilded. These are the
> **identical band labels at the same in-game dates** as the batch-7 `rep1800`
> (`6aa7309a`) **1800-start** save. **Two independent saves, started 28 in-game
> years apart, traverse identically-named content bands at the same in-game
> dates** ⇒ definitive proof eras are **game-state content-bands with dual
> scoring (per-era winner + cumulative "winner so far"), NOT calendar gates.**
> Corroborates the headline gap-log row (game-context #92) and `rep1800` POST 92
> / 6201.
>
> **★ Secondary:** despite the "to future" title, the run **STALLS at 1874
> (mid-Gilded Age, POST 157)** — no future era reached, no game-over. "Era of
> the Future" remains undocumented across **all** ingested threads.

---

## §0. Thread metadata + mode

- **Title:** "Stamping out America's love for tea: A 1772 to future." The "to
  future" is **aspirational, never realized** — play stalls at 1874 (§1).
- **Mode: SOLO all-CPU fast-traversal run — NOT multiplayer.** A single operator
  drives the entire sim (all 10 factions are CPU, strictly following
  ideology+lobby; an initial "1 human vs 9 CPU" framing was dropped to 100% CPU,
  POST 1, 2, 28, 29). The forum "players" are **spectators/kibitzers, NOT
  faction-owners.** (Partial-02/03 loosely called it "multiplayer"; that is
  wrong — corrected here per the authoritative read. Contrast true multiplayer
  threads like `rep1800` with 10 humans on 2 teams.)
- **GM/narrator-operator: `Bushwa777`** for the bulk of the run (POSTS 1–~136);
  **`matthewyoung123`** takes over narrating the per-2-year summaries for the
  Civil-War→Gilded tail (POSTS 137–157). Cadence ≈ one 2-year turn per ~1 post.
- **Designer/rules authority: `vcczar` ("V")** — owns all rules calls; @-pinged
  for adjudications (POST 66, and the deferred Prigg cascade, POST 124–126).
  Other spectators who ask Qs / supply rules-clarifications: `matthewyoung123`
  (before he took over narration), `Arkansas Progressive`, `Zagnut`, `Limboman`,
  `Vee01`.
- **Posts:** 157 (per `manifest.json`), each a giant administrative-ledger
  "Summary" of one or more 2-year turns (drafts, relocations, ideology shifts,
  faction churn, cabinet, deaths, anytime/era evos, SCOTUS, Congress bills,
  diplomacy, conventions, elections). Very little prose; players interject
  mainly to question results, and the GM exposes the **die-roll math** (valuable
  for engine spec — §3).
- **Value vs prior corpus:** a **second all-CPU corpus** (like `drums`, e1776bbd)
  but covering the **founding→Jacksonian** band that `drums` (1841→) does not,
  and run from a **1772 start** end-to-end through the bands — the one corpus
  showing the **independence→federalism handoff in actual play** plus the full
  named-band sequence from a single save.

---

## §1. FUTURE-ERA CHECK — *negative.* Stalls at 1874 (mid-Gilded)

**Despite the title, the playthrough never reaches any era beyond the Gilded
Age. There is NO "Era of the Future" content.**

- **Last turn posted: 1872–1874 (POST 157)**, ending mid-Gilded-Age (43rd
  Congress; Pres Richard W. Thompson; Red Cloud's War; Darwin/evolution;
  transcontinental rail; Vanderbilt/Union Pacific; first advertising agency).
  No 20th-century content, no speculative/fictional "future" issues.
- The thread simply **stops** after POST 157 (the final row in the 157-post
  export). **No game-over, no era-complete banner for Gilded, no concluding
  post.** 1876 conventions are *announced* (POST 157: GOP Hamilton OH; DEM
  St. Louis MO) but never played. → **It STALLED, it did not COMPLETE.**
- Net: this thread does **not** extend documented coverage past the modern
  Gilded/Populism material. The documented timeline end-state is unchanged.

> **Open question (human):** is there a *separate continuation thread* carrying
> this 1772 campaign past 1874? If not, **no forum source yet reaches a
> post-modern era, and "Era of the Future" remains undocumented/hypothetical.**

---

## §2. ★ THE HEADLINE — era-bands named + scored at game-state boundaries

This 1772-start save emits **explicit named era-bands** and **scores each at its
boundary**, declaring a per-era winner AND a running cumulative "winner so far."

### Full named-band sequence traversed (one continuous 1772 campaign)

| Band (named in-thread) | Ends ~ | Boundary marker / cite | Notes |
|---|---|---|---|
| Independence / Revolution | ~1788 | (no govt at start; unlocks via era events) | Constitution ratified 1787; first Pres 1788 (POST 11–12) |
| **Era of Federalists** | **~1800** | "Score at end of Era of Federalists": Moderate Federalists won w/ 12,550 (POST 21) | |
| **Age of Republicanism** | **~1820** | "At the end of the Age of Republicanism: B4 is the winner" + cumulative all-faction ranking (POST 62) | |
| **Era of Democracy** | **~1840** | "End of Era of Democracy: Winner of round is B5 … Winner of Game so far: B4" (POST 91) | |
| **Era of Manifest Destiny** | **~1856** | "Winning Faction for Era of Manifest Destiny: B4 … winning faction for the entire playtest currently is: B4" (POST 130) | |
| **Era of Nationalism** (Civil War + Reconstruction) | **~1868** | "At the end of the Era of Nationalism the winner of this era is: R2. The winner of the game so far is: B4." (POST 153) | Closes between the 1866–68 turn (POST 152) and 1868–70 turn (POST 154) |
| Gilded (unnamed band) | — (stalls 1874) | no "Era of X" banner emitted for Gilded | Consistent with Gilded being under-labeled across threads |

### Why this is the definitive proof

- The band names this 1772-save emits — **Era of Democracy**, **Era of Manifest
  Destiny**, **Era of Nationalism** — are the **exact same sub-band labels** the
  `rep1800` (`6aa7309a`) **1800-start** save recorded (`rep1800` digest era table;
  its POST 92 era markers). **Two independent saves, started 28 in-game years
  apart, pass through identically-named content bands at the same in-game
  dates.** Strong evidence the bands are **deterministic content-gates on
  game-state, not flavor or per-thread GM invention.** Corroborates game-context
  **#92** (eras are content-bands, NOT calendar `year%4` / `year%2`).
- **Transitions are game-state-gated, not annual.** The Civil War here is
  triggered by an **era event** (John Brown's Harper's Ferry + a GM ruling that
  the President would quietly pardon Brown → Southern secession conventions →
  war), not by a date (POST 153 surround, §4). Reconstruction then **ends
  piecemeal by legislation** (POST 156: three separate "end Reconstruction in
  [states]" Acts, 41st Congress), not on a fixed date.
- Reached via a **1772 start**, "Era of Nationalism" still closes ~1868 on
  game-state (post-Reconstruction) — the band is **start-scenario-independent.**

### NEW mechanic — DUAL scoring (per-era + cumulative)

At each era boundary the engine declares **two** results:
1. a **per-era winning faction** ("winner of this era / round"), and
2. a running **cumulative "winner of the game so far"** spanning all bands.

Worked examples: POST 91 (round=B5, cumulative=B4); POST 130 (era=B4,
cumulative=B4); **POST 153 (era=R2, cumulative=B4)** — the per-era victor (R2)
differs from the cumulative leader (B4), proving the two scores are tracked
**independently**. POST 21 / 62 show the same shape earlier (per-band winner +
cumulative all-faction ranking "for all 3 ages"). Scores are **keyed to faction
slots `B1–B5` / `R1–R5`** (B = BLUE/Jeffersonian-Democrat side; R = RED/
Federalist-Whig side; 1–5 by ideology rank). This dual scoring is **not in the
build** and (cf. game-context) corroborates the `rep1800` per-era point-banking
formula (its POST 6201). → gap candidate; the exact point formula is **not
visible in this thread** (only the boundary announcements) — open question.

> **Faction polarity note (era-aware):** this run uses the **inverted founding
> frame** — BLUE = Anti-Federalist/Jeffersonian/Democratic-Republican/Democrat;
> RED = Federalist→National-Republican→Whig→Republican. Same inversion `rep1800`
> flagged. The 10 faction slots **rename every turn** (era-sensitive nicknames,
> §5) and shift meaning across bands.

---

## §3. NEW mechanics surfaced (not prominent / absent in prior digests)

### Amendments: durable, renumbered, AND judicially overturnable

- Amendments are **durable in-play game objects, renumbered for this timeline**
  (e.g. 11th = states-sued-by-out-of-state-residents; 12th = party-ticket pres
  elections, POST 32; **13th (this timeline) = "National Suffrage for White Male
  Property Owners"**, POST 37 — note ≠ OTL 13th). Ratified by a **counted set of
  state/governor votes** (e.g. "16 of 22"); **stragglers can ratify later in the
  Governor phase** even after passage (POST 16, 18, 21, 32, 675). Corroborates
  game-context **#39** (Amendments persist past the Convention).
- **★ SCOTUS can OVERTURN a ratified Amendment** via a **Governor-requested
  judicial review**: the 13th (white-male-suffrage) was **overturned 4–3**,
  reverting it to a mere governor-action (Congress may re-pass) (POST 48; the
  Taylor-McDowell law was similarly overturned, POST 50). **Judicial review of
  constitutional amendments is a real, used mechanic** — extends **#39** with a
  review/repeal loop.
- **★ The amendment threshold is itself amendable.** Convention set the bar at
  **3/4 of states** (POST 11); the **"Morris 2/3 Ratification Amendment" (this
  timeline's 14th) lowers it 3/4 → 2/3** (POST 57; ratified by governor/state
  vote, POST 675). The amendment-threshold is **mutable in play.**

### Legislation: bill-packaging, filibuster, SCOTUS-strikes-law

- **★ Bill-PACKAGING:** committee members can **unite multiple distinct bills
  into one vote** (e.g. "Gorman-Clairborne Act to establish DC AND Ohio
  Statehood"; "…Michigan AND Louisiana Territory"; "…Indiana AND Alabama
  Statehood"). House+Senate vote the package; each part enacts (POST 41, 43, 45).
  Recurs per the rules — likely a **gap** if absent from the build's legislation
  system.
- **Filibuster modeled:** POST 384 "Senator John Lyde Wilson did a successful
  filibuster on SR-4 … brought up again next Congress." Success is a roll;
  mechanic is **under-documented** (how rolled?).
- **SCOTUS can strike/repeal legislation:** the **Republic of Texas Act was
  passed then judicially REPEALED** (POST 770–784), state later re-admitted by
  Congress (POST 292). Law/court/territory systems *can* interact, but ad hoc.

### Impeachment — run live

Full pipeline exercised: House Judiciary lists charges → **House votes >51%** to
send to trial → **Senate needs 2/3 to convict**. **President Breckenridge
impeached: House 109–89 yes, Senate 19–17 → NOT convicted** (POST 53, 54).
Trigger was an anytime "controversial act" event. → House 51% → Senate 2/3
threshold is a concrete spec.

### Presidential-vote modifier stack (enumerated by GM)

The GM exposed a clean enumerated modifier stack for the EC general (valuable
engine spec — corroborates the modern digest's meter/penalty engine, here in the
1772/Nationalism era):
- **−1 for a 3rd-term bid** (term fatigue)
- **−1 for a "controversial vs integrity" trait matchup**
- **economy meter ±** (e.g. a "Great Recession" gave **−3 to the incumbent**,
  POST 139; "economic troubles" −1, POST 151)
- **−2 per major scandal** (POST 151: scandal ×2 = −4)
- plus regional/meter swings (e.g. a meter "+2 to GOP", POST 139)
The cleanest single statement is **POST 151** (the 1868 upset, GOP incumbent
loses 110–178: −1 third-term, −1 trait matchup, −1 economy, −2×2 scandals).

### Era-stamped Popular/Unpopular issue list (bill/platform tie-break)

For tie-breaking bills/platforms when ideology is silent, the GM prints an
**era-specific Popular/Unpopular issue list** (POST 137). For ~1860: **Popular**
= pro-deregulation, pro-increase-tariff, pro-increase-taxes, anti-Native-
American; **Unpopular** = women's suffrage, pro-labor, pro-social-security,
pro-welfare, pro-LGBT, going to war, pro-regulation, intervening in natural
disasters, anti-corruption. **Anachronistic items** (pro-LGBT, social-security
in 1860) reveal a **single global issue list with an era-sensitivity overlay** —
relevant to the "era-aware popularity" gap.

### Stat-collapse → forced presidential resignation

A president who **loses all Command points + most skills** is **forced to
resign** (POST 135 explicit: "Mouton forced to resign because Mouton lost all
command points and most of his skills"). A stat-floor → resignation rule.
Succession is exercised constantly in this run (Holmes resigns/scandal → Nicholas;
Crawford dies → Reynolds; Scott dies → Perry; Mouton resigns → Dunning; later
Ferriss resigns/bribery → Thompson, POST 157); a **"Presidential Succession Act
of 1852"** is also passed in-game (POST 755).

### Multi-phase, concurrent WAR engine (richer than the shipped Rev-War system)

Wars run as **turn-spanning, multi-round campaigns, several CONCURRENTLY**, won
by accumulating battle victories over turns, feeding back into commander stats:
- **Mexican-American War** runs **Phase 1 / Phase 2** across turns (POST 814 "not
  yet ready to fully commit … the war will continue"; POST 737 Phase 2 — Vera
  Cruz, Palo Alto, Santa Fe, Tucson, LA → negotiated peace **ceding 55% of
  Mexican territory for $15M**).
- **Simultaneously**, the **Apache Wars (Rounds 1–4)** and **Navajo Wars (Phases
  1–2)** run as *separate concurrent* multi-turn Indian-war campaigns (POST 732,
  738, 388, 785, 414). Each: named general leads from a named fort →
  ambush/siege battle → win/loss alters the general's command/skill/traits (POST
  787 "known as incompetent and is fired"; others gain "celebrity"/promotion) →
  enemy "sues for peace" → treaty (sometimes botched by a low-skill minister's
  bad translation, POST 420).
- Earlier cross-era wars confirm a **generic war engine**: Northwest Indian War
  (Kekionga, Fort Recovery, Fallen Timbers → Treaty of Greenville), Arikara War,
  Black Hawk War, **Tecumseh's War** (crosses into Canada w/ Governor-of-Canada
  permission) (POST 11, 13, 18, 19, 63, 65). Corroborates game-context **#45**
  (war is a generic cross-era system, not 1772-only) and adds the multi-round /
  concurrent / commander-feedback detail.

---

## §4. Civil War here is a CHOICE/ROLL-DRIVEN VARIANT (branch-point confirmation)

The Civil-War subsystem matches `hd` / `drums` / `gilded` (terse corroboration
in §5), **but the branch points play out differently here, confirming they are
decision/roll-driven, not scripted:**
- **The President does NOT defect.** A Republican (Bradford) prosecutes the war
  from the Union side (POST 140, 148) — a **variant** of the `hd` "President
  defects to the CSA" path. ⇒ the defect branch is **decision-driven**, not
  fixed.
- **NO UK intervention** this run — a **variant** of the `rep1800` UK-
  intervention path. ⇒ foreign intervention is a **roll/decision branch**, not
  fixed.
- War **triggered by an era event** (Harper's Ferry + GM pardon ruling →
  secession conventions), confirming the CW band opens on **game-state**, not a
  date (§2).

Net: across the corpus we now have **three distinct Civil-War outcomes** — `hd`
(Pres defects), `rep1800` (UK intervenes), and **this thread (neither)** —
strong evidence the CW subsystem's major branch points are **player/roll-driven
variables**, not a single scripted path.

---

## §5. CORROBORATIONS of already-documented content (terse — do NOT re-log as new)

These match prior digests (`rep1800`, `drums`, `house-divided`, `gilded`,
`modern`, `1772s`) and add no new requirement; logged for provenance only.

- **Founding spine** matches the shipped 1772 scenario (no govt → Continental
  Congress → Declaration → governors → Articles → Annapolis → Constitutional
  Convention → 1788 first President), run in real depth: CC elects a President of
  Congress over rounds + 4 committee chairs (Domestic/Foreign-Military/Economic/
  Judicial); Revolutionary War is sequential & command-sensitive (Senior General
  hired/fired on losses; traits/Military drift from outcomes); full era-event
  spine (Gaspee, Tea Act, Boston Tea Party, Intolerable Acts, Lexington/Concord,
  Treaty of Paris, Shays' Rebellion, Federalist papers, ratification). Constitution
  is data-authored at the Convention (Art.1–3, 3/5 compromise, amendment process).
  (POST 3–12.)
- **Per-2-year turn loop** (identical shape to prior all-CPU threads): Draft →
  career graduations (State Leg/Exec/Admin/Judicial/Military/Backroom/Private
  tracks) → Flip-Flopper removal → Relocations → Ideology shifts → Party/faction
  conversions → Kingmaker/Protégé (+1 Command, +1 skill, expertise, interest,
  trait) → Speaker+chairs → Pro Tem+chairs → Faction leaders + rename → Party
  leaders → Cabinet → Deaths/Retirements → Anytime Evos → Era Evos → industry
  leaders → Governor actions → SCOTUS docket → Congress bills → Diplomacy →
  Signing/veto → Exec actions → SCOTUS noms → (every 4 yrs) conventions +
  campaign + election. (Every summary post.)
- **Ideology shifts are ADJACENT-ONLY per turn** on the 7-point scale (GM was
  corrected after jumping multiple notches, POST 58, 59).
- **Faction nicknames are dynamic & era-sensitive** (BLUE: Populist Dem (LW),
  Popular-Sovereignty Dems, Conservative/Traditionalist Dems, Tertium Quids,
  **Free Soil Democrats** POST 128, **Doughface Democrats** POST 148; RED:
  Federalists → National Republicans → **Whigs** → Anti-Masons → Know-Nothings →
  **Abolitionists** POST 543 → **Cotton Whigs** / **Moderate Republicans** POST
  148). Major parties **emerge organically** as faction coalitions (the **Whig
  party forms** from National Republicans + Anti-Masons + anti-Jackson Democrats,
  POST 236; **Republican** emerges by 1860, POST 136/148).
- **Veto + override** routine (House then Senate; partial outcomes possible, POST
  19, 63). **Cabinet seats era-gated & growing** (State/Treasury/War/AG → +Navy,
  +Postmaster-General-by-bill; non-cabinet Bank President, Key Advisor, growing
  Ministers roster); **"firing precedent"** — a President cannot fire cabinet
  until a bill establishes the power ("Rush Cabinet Act," POST 18). **Office
  succession bills** set Speaker/Pres-Pro-Tem in line (POST 16, 32).
- **Presidential nomination subsystem** (deep): multi-ballot conventions to a
  party threshold (Dem-Rep 2/3, Federalist 3/4; can shift to winner-take-all/unit
  rule by faction-leader vote), nomination speeches give momentum, VP/cabinet-
  for-dropout deals, **5-plank platform** (Domestic/Foreign-Mil/Economic/Judicial/
  Pres-Exec-Act, point-costed 150/300/750), **keynote +1 to the ticket**;
  Sept/Oct general campaign w/ per-region speeches, scandals, media moving party
  preference / per-state enthusiasm (POST 31, 35, 50, 55, 137, 148).
- **SCOTUS docket** = era-set of real cases re-litigated by **named justices**
  (Initial + Final vote, 10-yr ideology drift, vote-conversion attempts), tagged
  **Historical/Unhistorical** (POST 18, 22, 32, 50, 137, 140, 148, 152, 154).
  Court size set by bill.
- **Diplomacy** = 5–6 fixed foreign ministers (UK/France/Spain/Prussia/Russia,
  **+China** when relations open, POST 652) each rolling one trade/credit/
  alliance action vs a named foreign head-of-state, budget-gated (POST 19, 22,
  55). **Industry-leader tracking** (agriculture/finance/manufacturing/maritime,
  **+mining** w/ gold rush POST 707, **+Big Oil & Gas** by 1874 POST 157).
- **Civil War subsystem** (matches `hd`/`drums`): Eastern/Western theaters, named
  battles (Bull Run, Wilson's Creek, Shiloh, Seven Days, Perryville), **ironclads
  (Monitor vs CSS Virginia)**, Anaconda-Plan exec action, siege of Richmond,
  Appomattox (POST 140, 148).
- **Reconstruction subsystem:** appointed Reconstruction governors, military
  districts/martial law, Iron-Clad Oath, Freedmen's Bureau, **15th/16th/17th
  Amendments** sent→ratified, **KKK handled by states not feds** (GM ruling),
  Reconstruction ended by legislation (POST 148, 152, 154, 156).
- **Gilded-Age issue menu** (matches `gilded`): **gold-standard vs free-silver**,
  tariff as a national integer set by law, civil-service/anti-corruption crises,
  **Chinese exclusion** ("Chinese Woman and Prostitute Ban" plank), poll
  taxes/literacy tests/**Jim Crow** as state governor-actions, women's suffrage as
  recurring scandal-bait, Alaska purchase, Hawaii protectorate plank, Native wars
  (Red River War, Red Cloud's War) + reservation/property bills (POST 154, 156,
  157).
- **Antebellum content** (matches `rep1800`/`drums`): Bank War / Bank-of-the-US
  recharter (POST 280, 656), Nullification Crisis (SC nullifies tariff →
  secession threat → Pres caves → lower-tariff compromise, POST 665), internal
  improvements, Indian Removal treaties (POST 202–204, 832), **Texas annexation
  arc** (POST 230–232, 264, 292), Oregon boundary (POST 691, 751), California
  gold rush + statehood (POST 654, 342), Free-Soil movement (POST 300),
  Compromise-of-1850 package (POST 340–362).
- **Statehood admits** new states mid-run (KY/TN/OH/LA/IN/AL/MS/IL/MO/ME) which
  **changes EC math** turn-over-turn (POST 18, 21, 57, 61). **State EV counts
  also drift per-campaign via events** (operator notes his EV totals differ from
  the standard map "due to events," POST 80–82) — EVs are **not static**.

---

## §6. Design holes / GM rulings / house rules (flag for tech-lead & roadmap)

- **★ SCOTUS ruling → existing-statute cascade is UNBUILT and explicitly
  DEFERRED by V.** A spectator argued **Prigg v. Pennsylvania** should logically
  void/neuter the Fugitive Slave Act, but the engine doesn't cascade that.
  Operator: "I argued that but was told that **V [vcczar] will need to think
  about it**" (POST 124–126). ⇒ **a SCOTUS ruling that contradicts a law on the
  books leaves the law operative.** Distinct from the *separate* (built) ability
  to strike a single law (Republic of Texas Act, POST 784) or overturn an
  Amendment on review (POST 48). The general **ruling→downstream-statute cascade**
  is the open design question. **Flag.**
- **Realism hole — national meters swamp state partisan-lean → geographically
  implausible maps.** The vote model produced **Deep-South states voting
  Republican in 1860** (POST 138–139) and **Dems winning IA + PA in 1864** (POST
  147); players disputed both. GM defends via the modifier-stack math (§3), but
  it shows **state partisan-lean / bias is a soft modifier easily overridden by
  national meters + candidate election-stat + scandal rolls + die variance**
  (also POST 112, 497, 504 "2 die roll away," 761, 768). Disputed-election
  balance/realism gap. **Flag.**
- **Mass sectional realignment event** — a bloc of named pols defecting at once
  over slavery (POST 647: "Believing the Democrat Party is not listening to their
  ideology: Salmon P Chase, Francis P Blair, John McLean, Sam Houston … switched
  to the Whig Party"). May be a **distinct realignment trigger** vs ordinary
  per-turn poaching. **Flag.**
- **House rule — GM hand-authors fill-in politicians.** POST 140: "James Estes
  (my own creation)" seated as a WV senator. The GM may invent pols to fill
  gaps.
- **House rule — Mormon office-ban gates candidacy.** Joseph Smith repeatedly
  wants to run but "the law against Mormons running for office" blocks him (POST
  152, 156, 157) — an era social-restriction on candidacy.
- **Alt-history adjudication** (expected; logged so future readers don't mistake
  it for design): anytime "controversial act" events force resignations/
  impeachment with GM-invented flavor (Monroe was an accidental-death data point
  narrated as a slave-kidnapping murder; R.H. Lee kicked by a controversial-act
  roll; POST 25, 26, 28). Drift examples: "Emperor Norton" becomes an actual
  Governor (POST 154, 156, 157); Robert E. Lee dies pre-war so "Lost Cause" fires
  for a Lee who never led the CSA (POST 152); **Jefferson Davis stays Union**, a
  US general (POST 141–144). Politicians enter ~age 25 via draft regardless of
  OTL dates and can serve past OTL death (R.H. Lee, Peyton Randolph; POST 17, 8).

---

## §7. Open questions (for the human / consolidation pass)

1. **Continuation thread?** Is there a separate thread carrying this 1772
   campaign past 1874? If not, "Era of the Future" is undocumented everywhere
   (§1).
2. **Exact dual-scoring formula** — per-era winner + cumulative leader are
   *announced* at each boundary (POST 21/62/91/130/153) but the **point formula
   is not shown** here. (Closest known formula is `rep1800` POST 6201.) What
   resets vs accumulates across bands?
3. **Bill-packaging** (POST 41/43/45) — represented in the build's legislation
   system, or a gap?
4. **Judicial review that overturns an Amendment** (POST 48) and **SCOTUS strikes
   a single law** (POST 784) — modeled in the build's era/amendment system?
5. **SCOTUS ruling → existing-statute cascade** — explicitly deferred by V (Prigg,
   POST 124–126). Open design question.
6. **Impeachment** (House 51% → Senate 2/3, POST 53) — a shipped phase/system?
7. **Filibuster** roll mechanic (POST 384) — how is success determined?
8. **EV reapportionment-by-event** (POST 80–82) — which events move a state's EVs?
9. **Mass sectional realignment** (POST 647) — distinct trigger or batched
   poaching?
10. **Stat-collapse → forced resignation** (POST 135) — the exact stat-floor.
11. Where exactly the **Independence→Federalist** and **Federalist→Republicanism**
    boundaries *trigger* (Constitution ratification 1788? a score event? a year?)
    — chunks imply Constitution-ratification + ~1800/1820 but the precise trigger
    is not stated.

---

## §8. Coverage map

- **Partial-01** = chunks 1–9 = POSTS 1–70 = **1772 → 1828** (founding draft →
  end of Federalist/Republicanism bands, into early Jacksonian).
- **Partial-02** = chunks 10–18 = POSTS 71–136 = **~1826 → 1860** (back half of
  Jacksonian/Democracy band → all of Manifest Destiny → 1860 Whig→Republican
  split opening the Civil-War band).
- **Partial-03** = chunks 19–26 = POSTS 137–157 = **Civil War → 1874** (Era of
  Nationalism Civil War + Reconstruction, closes ~1868 → Gilded band; **STALLS
  at 1874, mid-Gilded, POST 157**).
