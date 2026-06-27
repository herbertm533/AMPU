# Digest — `970616d5` "AMPU Updates"

> **Per-thread digest. PROGRESS / CHANGELOG thread, NOT a playtest** (no GA ran a
> game). 287 posts / 4 chunks / ~179k chars (read in full). Citations are
> `===== POST n =====` markers. Raw chunks are gitignored/disposable; **this digest
> is the durable record.** Part of **batch 30**. Nick **`ampuUpdates`**.
> **DIGEST-ONLY run** — no edits to `game-context.md`/`roadmap.md` (consolidation
> agent owns the gap-log; sibling digest agents run in parallel).
>
> **★ Headline — the GM⇒App charter origin doc.** This is vcczar's **own running
> log of building "the CPU game I'm making"** (POST 1), Apr 8 → Jul 11 2021. It is
> the **earliest, most explicit articulation of the GM-replacement project** in the
> corpus: vcczar single-handedly authoring the design data (events, legislation,
> war charts, pres/gov actions, name generator, ~9,000 politicians, era meters)
> and the rules, **so the game can be handed to a programmer ("Anthony") for
> development.** It PREDATES the "Plan B" reorg (`094cc3a2`, Sept 2024) by 3 years
> — this is the original solo push; Plan B is its later, organized successor. Tag
> the whole thread **`GM⇒App`**: nearly every line is a human authoring a rule/data
> table that the app must one day own.
>
> **★ Highest-value extracts:** (1) vcczar's **stated build sequence** (content
> authoring → rules → playtest → spreadsheet cleanup → screens → development); (2)
> **Era of the Future scope = "beyond the present to 2099"** (POST 2) with EVs
> authored **through the 2090 census** (POST 17) and hypothetical-state EVs
> "1788–3000" (POST 26) — sharpens **#206**; (3) the **name database / random-pol
> generator** build (POSTS 4/39/45/62) — sharpens **#115**; (4) **"any presidential
> term 1789–2021 (+ 1774) is a valid start"** (POST 102) = the scenario-boot charter
> (corroborates #86/#115/#186/#187); (5) a pile of mechanic decisions made
> author-side that the shipped build does not have.

---

## §0. Thread metadata

- **Title:** "AMPU Updates" (forum topic 17, politicslounge). **Apr 8 2021 → Jul 11
  2021** (POSTS 1–287). Started by **@vcczar**.
- **Nature:** A **dev changelog / status thread.** vcczar posts near-daily "Update:"
  entries on what he authored that day toward the computer game; others react,
  volunteer, and kibitz. NOT a playthrough — no game state, no GA adjudication.
- **Authority:** **@vcczar (creator/designer)** is the sole author of the content;
  **@MrPotatoTed** owns the rules rewrite (the 80→100+ page rulebook); **@Anthony**
  is the (absent, separate) programmer who would build the app;
  **@ConservativeElector2** is the chief volunteer (fills out ~half the new pols).
  Everything here is **designed intent / author-time data**, NOT shipped reality —
  reconcile against the code, do not treat as built.
- **Timeframe context:** vcczar states the game has been **"three years in the
  making"** (POSTS 90/134) — i.e. design began ~2018; this thread is the final
  data-authoring sprint before intended handoff. Target "done" date **May 1 2021**
  (POST 12), repeatedly slipped (POSTS 40/69/83/91/100…).

---

## §1. ★ The build sequence vcczar states (charter / roadmap signal)

vcczar lays out his **intended path to the computer game** at the top (POST 2) and
re-states it several times. This is the designer's own ordering of the
GM-replacement program:

1. **Content authoring** — fill out Scripted Events, Legislative Proposals, War
   Charts, Presidential Actions, Governor Actions, General Events, era meters /
   biases / lingering effects **for every era**, incl. the two new bookend eras
   (Era of Independence 1774–1788; Era of the Future) [POSTS 2/6/7/8/9/10/11/12/13].
2. **Rules** — MrPotatoTed rewrites/polishes the rulebook (trim, reflow, add a
   newcomer guide), with vcczar's CPU-movement additions [POSTS 13/43/137/214/227].
3. **Playtest** — a forum playtest of the new eras (Era of Independence first,
   since it begins the game) [POSTS 2/40/42/231].
4. **Spreadsheet cleanup** — pass over every sheet for obsolete language, fill
   holes, make "more user-friendly for use in developing the game" (incl. an
   **XML conversion** for import — POSTS 73/75/76/77/78) [POSTS 2/15/40/164].
5. **Screens** — improve the drafts of the UI screens (can't finalize until rules
   are done — POST 70) [POSTS 2/17/40/90].
6. **Development** — hand the package to Anthony to actually build the app
   [POSTS 2/19 ("it will be time for development once all of this done"), 91/92].

**★ Process reality:** the schedule never holds. The May 1 deadline slips
(POSTS 40/69), a personal-life crisis cuts vcczar's hours (POSTS 83/84/90/283),
and **Anthony never starts coding within the thread** — he is perpetually "a couple
more weeks" out, busy updating President Infinity (POSTS 100/108/116/247).
vcczar repeatedly threatens to **shop the game to other developers** (the maker of
"The Political Process"; Paradox/Picaresque/Redwood; a free sports-sim dev) if
Anthony stalls past Aug 1 (POSTS 93/95/138/139/247). **Corroborates the recurring
"build is gated on one absent/overloaded developer" + "GM-workload death" theme**
(see #114, DH-36 elsewhere). This is charter context: the app exists precisely so
this fragile single-human pipeline isn't the only path to playing AMPU.

---

## §2. ★ Era of the Future — scope to 2099 (sharpens #206)

The thread is the **most detailed designer statement of the Era of the Future** in
the corpus, and confirms its intended scope and its perpetual under-built status.

- **POST 2 (load-bearing):** *"filling out the Scripted Events, Legislative
  Proposals, War Charts, and Presidential Actions … for the Era of the Future
  (beyond the present to 2099)."* → **The Future band's intended span = present →
  2099.** (Note vs. **`welcome2future`** which planned 2022→2072: 2072 is a
  *playthrough* target, **2099 is the era's authored END.**)
- **Why it lags (POST 6, designer-flagged):** it is *"a massive era so it needs a
  massive number of Legis Props and actions to feel as full as the other eras"*;
  it is *"so geared towards science and tech that anyone that isn't holding these
  lobbies have a huge weakness — I need to balance it out"*; and it is **lowest
  priority** ("I'll be doing this last … I might still be working on this beyond the
  May 1st due date") [also POSTS 40/91/116/164/247/262].
- **Future content actually authored in-thread:** General Events for the Future era
  (POST 13); special **future-draft rule** — *"players will be able to draft any
  player so that parties can start resorting themselves and evolve their ideology
  to meet the dynamic future"* (POST 14, a generated 50-person sample class);
  Future-era lingering effects / biases (POST 10). Later he says he'll keep
  **"adding more to flesh out the years 2024–3000"** during the playtest (POST 262)
  and "fleshing out 2024-3000" (POST 238) — i.e. content authored well past 2099
  for hypothetical states even though the *era* ends 2099.
- **Future-state EV / map data:** hypothetical EVs **"through the 2090 US Census"**
  (POST 17); then **"EVs for all hypothetical states from 1788–3000"** (POST 26,
  *"most of these places sort of just explode in the 20th century"*). Industries,
  party biases, ideology biases, least-preferred ideology set for all hypothetical
  states **for each era** (POSTS 31/33/34/36).
- **★ Reconciliation vs. shipped build:** the shipped `Era` enum is
  `'independence' | 'federalism' | 'nationalism' | 'modern'` (`src/types.ts:1337`)
  — **no "future" era exists in code, and nothing runs past `modern`.** So the
  Future era is **DOUBLY UNBUILT** exactly as #206 records: under-content'd *by the
  designer's own admission* AND absent from the shipped enum. This thread is the
  **authoritative designer source for the Future era's INTENDED span (to 2099) and
  its content surface** (events/legis/war/pres-actions + science-tech-lobby tilt).
  **Corroborates #206; adds the to-2099 span + the science/tech-weakness balance
  hole as specifics.**

---

## §3. ★ Name database & random-politician generator (sharpens #115)

The thread documents the **birth of the procedural name + politician generator** —
the system #115 ("generate-a-candidate") points at, and a sibling to the bundled
draft-dataset pipeline.

- **The ask (POST 4):** *"We now have a database of given names and surnames.
  However, we need the CPU to know what gender a given name is and what race or
  religion is often attached with a surname… We got A LOT of names but a lot are
  also duplicated."* → confirms the three open data-tagging needs: **gender on
  given names, race/religion on surnames, and de-duplication.**
- **Tagging work (POST 39):** split given names + surnames into buckets — **"male",
  "female", "spanish", "french"** etc. — so generated names are demographically
  coherent (*"No need for a female politician named Bruce Popinski…"*). Sample
  bucket headers seen (POST 45): Male Given / Female Given / Surname / Given-Spanish
  / Given-Portuguese / Given-French / Given-Scandinavian.
- **Corpus size (POST 46):** **~6,600 names**, later expanded (POSTS 52/54/60);
  **"80% of the names come from the database of historical politicians… only 20%
  introduced from outside US history."** Distribution skews European; ~100 Asian,
  ~30 Native American, ~30 African at first, vcczar solicits more (POST 46) and
  Patine supplies categorized lists (POSTS 48/55).
- **Generator capability (POSTS 62/14):** beyond names, the generator assigns
  **state + number of starting abilities**, and is intended to compute **"ability,
  traits, expertise, interests, race, religion, etc."** Tiering rule for a generated
  draft class (**POST 14, load-bearing**): **1 standout** politician + **9
  second-tier** + **20 third-tier** + **20 bottom-tier** (the "noticeably more
  talented than the rest" structure). POST 62 refines: **~2 "Blue Chips" (4
  abilities) per class on average.**
- **★ On-demand backfill rule (POST 14, the #115 core):** *"I have rules for when a
  politician needs to be generated within the historical timeline. For instance, MT
  needs a governor but no player has a politician eligible for the spot. If this is
  the case, **a politician is generated with 1 Gov ability and the spot goes to the
  player with the lowest score**."* → This is the canonical **generate-a-candidate-
  to-fill-a-vacancy** rule: minimal stat (1 in the needed track), routed to the
  **lowest-scoring** faction. Mirrors the foreign-volunteer routing rule (cf. #46)
  and the sub-floor balance principle in the shipped dataset pipeline.
- **Use case (POST 62):** with 6,000+ historical pols the generator seems redundant
  *"unless one starts the game at the end of the historical timeline"* (i.e. the
  Future era) **or** a player opts to **"play with fictional politicians only."**
- **★ Reconciliation:** the shipped build has `ImportedDraftee` + the generated
  "standard draft classes" pipeline (CLAUDE.md), but **no runtime
  random-name/politician generator and no vacancy-backfill generator** is evidenced
  in code. **Corroborates #115**; adds the concrete tiering structure (1/9/20/20),
  the name-bucket schema (gender + heritage tags + dedup), and the lowest-score
  routing rule as the spec.

---

## §4. By-system milestone table (what vcczar authored / decided)

Each row is **designed intent / author-time data** unless marked. `GM⇒App` = a
hand-authored rule/table the app must own. **Verify all against code before
treating as built.**

| System | Milestone / decision (author-side) | Source | Disposition |
|---|---|---|---|
| **Build plan** | 6-stage sequence: content → rules → playtest → cleanup → screens → dev | POST 2, 40, 69, 91 | Charter/roadmap context (§1) |
| **Era of the Future** | Span = present→**2099**; content authored (events/legis/war/pres-actions); science-tech-lobby weakness flagged as balance hole; lowest priority | POST 2, 6, 13, 14, 40, 262 | **Corroborates #206** (§2) |
| **Era of Independence** | New **1774–1788** start era authored (scripted events, legis, gov/pres actions, special rules, war charts) — the era that *begins* the game | POST 6, 7, 8, 11, 12, 90 | Corroborates #92/era-content; 1774 start (not 1772/1788) is notable |
| **Name generator** | Names DB w/ gender + race/religion + dedup tagging; ~6,600 names (80% historical); buckets by sex/heritage | POST 4, 39, 45, 46 | **Corroborates #115** (§3) |
| **Politician generator** | Generates state + abilities + traits/interests/race/religion; class tiers **1 / 9 / 20 / 20**; ~2 Blue Chips/class | POST 14, 62 | **Corroborates #115** (§3) |
| **Generate-on-vacancy** | If no eligible pol for an office, generate one w/ 1 ability in needed track → lowest-score faction gets it | POST 14 | **Corroborates #115**; sharpens routing (cf. #46) |
| **Scenario boot / start dates** | **Any presidential term 1789–2021 (+1774)** is a valid start; incumbents pre-seated, **cabinet pre-appointed**, president "just elected", draft shows offices held | POST 102, 103, 104, 105, 109 | **Corroborates #86/#115/#186/#187** (modern boot) — strong NEW spec |
| **Roster size (dataset)** | ~**1,000–1,250 new pols** added for all start dates → ~**9,000+** total, all needing bios | POST 100, 109, 110, 111 | Corroborates dataset scale; bios mostly deferred |
| **Historical metadata cols** | Per-pol **relocation dates + #**, **party-flip dates + #** (Trump/Fob James/Joseph E Brown flip **3×**), obscure-trait removal date, dynasty tag, Southern-Unionist tag, `politician_id` (firstname_lastname + initial/#) | POST 127, 171, 172, 173, 174, 176, 180, 211, 213, 226 | Mostly NEW design data; informs dataset schema |
| **Ratings over time** | Need a way to **progress a pol's ratings historically** (so a later start shows their then-current stats) | POST 175, 177 | NEW design hole (time-varying stats) |
| **"What-if" draftables** | Asterisk pols gated by toggle: **Black/Women's/Native Suffrage** (early-enfranchisement triggers) + **"What-if"** opt-in (Churchill, Boris Johnson, Lafayette, First Ladies, Lydia Taft) | POST 75, 76, 205 | Corroborates suffrage-gated draftability; toggle taxonomy is NEW detail |
| **Celebrity trait rule** | "Celebrity" kept only if the celeb does **not** run for office before age 40 (Herschel Walker worked example) | POST 128 | NEW trait rule |
| **Frail / Hale traits** | "frail" = died <60; "hale" = lived **86+** (corrected from 80) | POST 253, 254 | NEW trait-assignment rule |
| **Committee scaling** | Committees = Chair + Majority + Ranking Minority (3); +1/party at 20 states, +1/party per +10 states → **11 at 50 states** | POST 236 | NEW mechanic (state-count-scaled committee size) |
| **Committee-chair enthusiasm** | 25% chance selecting a committee chair **raises ideological enthusiasm** (models Solid-South traditionalist chairs) | POST 240 | NEW mechanic |
| **Auto-flip on dissatisfaction** | 25% chance a flippable pol **auto-flips** (no conversion attempt) if their faction's ideology-satisfaction meter is at lowest level (models post-1964 Southern Dems) | POST 226 | NEW mechanic; ties to ideology-enthusiasm (#18/#51/#124) |
| **Trim-Roster phase REMOVED** | vcczar **cuts the Trim Roster phase** — random retirements handle it instead | POST 215 | **NEW — rules delta**; reconcile vs. shipped roster/retirement handling |
| **Gov: primary-date control** | Governors can move their state's primary earlier/later in the calendar | POST 20 | NEW gov action (cf. #20 gov-actions cluster) |
| **Delegate allocation** | A random Gov of each party sets primary/convention delegate #s — **5 allocation options** | POST 21 | Corroborates convention/delegate system (#185/#19/#20) |
| **Gov: 3rd non-consecutive term** | Term-limited govs may run again for a **3rd, non-consecutive** term | POST 82 | NEW gov action |
| **Big/Small state** | Determined by **that election's EVs** (even if EVs off), **not** by historical era | POST 35 | **Rules delta** vs. era-keyed sizing |
| **State-size action multiplier** | (context for DH-15) small states impact meters at half, large at double — implied by EV-driven sizing | POST 35 | Corroborates DH-15 |
| **Expansion / hypothetical states** | Brazil/Mexico/Canada=5 states each, Philippines/Central America/Caribbean split; super-states (Rio); empire **rare** (≤5% triggers, gated on enemy-relations/expansionist-pres/slavery|steel-navy, end ~Gilded 1868 / Progressive 1896); far-flung empire spawns a stability-loss General Event + a release-territory scripted event | POST 17, 22, 24, 25, 26, 27, 28, 29, 30 | NEW expansion/territory spec; corroborates territory/balkanization themes |
| **Other-power state ownership** | Need a sheet mapping how foreign powers can hold US states (for a Western-Hemisphere map) — *"crazy how balkanized the continental USA can become"* | POST 88 | NEW (balkanization map data) |
| **Bill of Rights split** | Bill of Rights = **10 separate bills**, proposable as a package or individually | POST 38 | NEW legislation structure |
| **Default legislation** | Each legislation sub-genre gets a "default" entry so the category reads sensibly when all its laws are inactive | POST 91 | NEW data-completeness rule |
| **Spending / volatility flags** | Bills tagged as spending bills; economic legis tagged with a **volatility roll** + its magnitude | POST 85 | Corroborates economic-volatility modeling |
| **Era meters / polarity** | Per-era ideology meters set; **balanced between parties for most of US history (except traditionalists); by 2000 all-but-moderates firmly sorted into one party** | POST 9 | Corroborates modern-polarity sorting; useful era-meter datum |
| **War charts** | Rev War chart + treaties authored; **Canada invasion = bargaining chip** to end war early w/ slim chance to annex Canada; flagged "must test it isn't impossible to win"; Northwest Indian War attempts ↑ for 1774 start; treaties renamed to real names (Treaty of Paris) | POST 8, 49, 50 | Corroborates war-system + white-peace (DH-12) gaps |
| **Dynasties** | Dynasty tagging across whole roster (Adams×14, Breckinridge×14, Bush×5, Fish/Roosevelt/Taft lines could "rule" 1788→present). **No point bonus**; vague non-points effect intended | POST 181, 182, 187, 190, 203, 205 | NEW flavor system; explicitly NOT a stat bonus |
| **Cong-leadership resign rule** | After ~1950, a pol stepping down from congressional leadership has a chance to **also resign from Congress** (modeled on Speaker behavior) | POST 285 | NEW mechanic |
| **Era-gated card pools** | Party-personality **ideology + interest + lobby** card counts vary by era (consult Historical Era tab) — *"help the game appear that one is traveling through time"* | POST 286, 284 | Corroborates era-content card-pool system |
| **Steam / achievements** | Anthony open to Steam; community-designed "achievements" may be used | POST 100 | Distribution note (non-mechanic) |

---

## §5. Player/community ideas surfaced (NOT adopted in-thread)

Logged for completeness; vcczar generally deferred these as "later update" since the
rules were already 100 pages and the priority was *finishing*, not adding (POSTS
250/251):

- **Career-track flavor offices** (CE2, POST 249): auto-assign cosmetic
  sub-offices by track (judicial→state justice/district judge; governing→lt-gov/
  mayor; legislative→state senator/city councilor; admin→state SoS/AG; military→
  lower ranks), or tie rank to **years-in-track** (Ted: lieutenant→captain→major
  every 4 yrs). Deferred (POSTS 250/251/252).
- **Overarching "stretch goal"** per player (Ted, POST 238): pick one hard win-con
  (end slavery w/o civil war; ban guns w/o civil war; lifetime presidency; conquer
  Canada+Mexico; elect a woman by year). vcczar: similar to old "platform goals."
- **Timeline shuffle / ahistorical matchups** (DakotaHale, POST 183): randomize
  which figures are prominent when (Trump vs. Jackson in 1940). Acknowledged as
  hard given scripted prominence; "thought about it."
- **Dynasty/name-recognition stat** (POST 191): an exposure stat from sharing a
  famous name (2010 SC Senate "Alvin Greene" case). No bonus committed.

---

## §6. Open questions (for the human / consolidation)

1. **Era of the Future span — 2099 vs. 3000?** POST 2 says the *era* ends **2099**,
   but EV/state data is authored to **3000** (POST 26) and Future content "fleshed
   out 2024–3000" (POSTS 238/262). Is 2099 the playable era boundary and 3000 just
   the EV table's open upper bound? (Refines #206.)
2. **Trim-Roster removal** (POST 215): is the shipped build's roster management
   aligned with "random retirements only," or does it still have an explicit trim
   step? (Reconcile.)
3. **Time-varying ratings** (POST 175): does any shipped scenario-boot apply
   then-current (vs. peak/dataset) stats for a pol at a later start year? Likely
   NOT — candidate boot-data gap (relates #86/#115).
4. **Generate-a-candidate**: does the shipped build generate names/pols at runtime
   at all, or only consume the pre-generated dataset? (Reconcile #115.)
5. **Committee size / chair-enthusiasm / auto-flip / celebrity / dynasty**: which
   (if any) of these author-side mechanics made it into code? All appear NEW/unbuilt
   but need a code check.

---

## §7. Candidate gaps for consolidation

> For the consolidation agent. **NEW** = not obviously in the current gap log;
> **corroborates-#** = strengthens/sharpens an existing row. None written to the
> gap log by this run.

**Corroborates existing gaps (with new specifics):**
- **#206 (Era-of-the-Future unbuilt)** — *sharpens with*: intended era span =
  **present→2099** (POST 2); authored content surface = scripted events / legis
  props / war charts / pres actions + General Events + future-draft rule; the
  **science/tech-lobby weakness** is a designer-flagged balance hole (POST 6); EVs
  authored through 2090 census (POST 17) and hypothetical states to 3000 (POST 26).
  Confirmed doubly-unbuilt vs. shipped `Era` enum (`types.ts:1337`).
- **#115 (generate-a-candidate / name DB)** — *sharpens with*: name-DB schema
  (gender on given names, race/religion on surnames, dedup — POST 4/39/45);
  ~6,600 names, 80% historical (POST 46); generator computes state + abilities +
  traits/race/religion (POST 62); class tiering **1/9/20/20** & ~2 Blue Chips
  (POST 14/62); **generate-on-vacancy → 1 ability → lowest-score faction** (POST 14).
- **#86 / #186 / #187 (scenario boot)** — *sharpens with*: **any presidential term
  1789–2021 (+1774) is a valid start**, incumbents seated, **cabinet pre-appointed**,
  president just-elected, draft surfaces offices held (POSTS 102–105). The canonical
  designer statement of the start-anywhere boot requirement.
- **#92 / era-content system** — Era of Independence (1774–1788) authored as a full
  era; era-gated ideology/interest/lobby card pools (POST 286); per-era meters/biases
  (POSTS 9/10/33/34/36).
- **#114 / DH-36 (GM-workload / build gated on one dev)** — the whole thread: a
  single human authoring all data + an absent/overloaded programmer (Anthony) =
  the fragility the app is meant to remove (POSTS 83/100/116/138/247).
- **#46 (event→generated figure routed by score+ideology)** — the vacancy-backfill
  routing (lowest-score faction, minimal stat) is the same routing family (POST 14).
- **#20 / #185 / #19 (gov actions, conventions, delegates)** — gov primary-date
  control + 3rd-term rule (POSTS 20/82); random-gov delegate allocation, 5 options
  (POST 21).
- **DH-12 (white peace) / war system** — Rev War charts + treaties, Canada
  bargaining-chip, "must test winnability" (POSTS 8/49/50).
- **DH-15 (state-size action multiplier)** — EV-driven big/small sizing (POST 35).
- **#18 / #51 / #124 (ideology enthusiasm)** — committee-chair +enthusiasm and
  auto-flip-on-low-satisfaction both hook this meter (POSTS 226/240).

**NEW candidate gaps (need a fresh row or a code check):**
- **N1 — Trim-Roster phase removed by designer** (POST 215): rules delta; reconcile
  vs. shipped roster/retirement handling.
- **N2 — Time-varying politician ratings** (POST 175): pols should present
  then-current stats at later start years; no evident shipped support.
- **N3 — Committee size scales with state count** (POST 236): 3 → 11 (50 states).
- **N4 — Committee-chair selection raises ideological enthusiasm (25%)** (POST 240).
- **N5 — Auto-flip on lowest faction satisfaction (25%, no conversion attempt)**
  (POST 226).
- **N6 — Celebrity trait expiry rule** (run for office before 40 ⇒ lose Celebrity)
  (POST 128).
- **N7 — Frail/Hale auto-traits by lifespan** (<60 frail; 86+ hale) (POSTS 253/254).
- **N8 — Dynasty system** (roster-wide tagging; explicitly **no point bonus**, vague
  non-points effect) (POSTS 181–205).
- **N9 — Congressional-leadership-resign chance post-1950** (POST 285).
- **N10 — Bill of Rights as 10 package-or-individual bills** (POST 38).
- **N11 — Default legislation per sub-genre** (POST 91).
- **N12 — Expansion/hypothetical-state spec** (foreign powers holding US states;
  super-states; ≤5% expansion triggers; empire stability General Event +
  release-territory scripted event) (POSTS 25–30/88).
- **N13 — Big/Small state from EVs, not era** (POST 35): reconcile vs. shipped sizing.
- **N14 — "What-if" draftable taxonomy** (Suffrage-trigger gates + opt-in What-if
  toggle for Churchill/Lafayette/First Ladies/etc.) (POSTS 75/76/205).
- **N15 — Per-pol relocation# / party-flip# (multi-flip, e.g. Trump 3×)** as dataset
  fields driving runtime relocation/flip eligibility (POSTS 226/213).

---

## §8. One-line scope (for game-context.md Sources list)

`970616d5` (`ampuUpdates`, batch 30) — **287 posts / 4 chunks**. vcczar's Apr–Jul
2021 **dev changelog for "the CPU game"**: the foundational GM⇒App content-authoring
sprint (events, legislation, war/gov/pres actions, ~6,600-name generator, ~9,000
pols, dynasties, era meters) + the build sequence (content→rules→playtest→cleanup→
screens→dev). **Authoritative designer source for Era-of-the-Future span (→2099,
#206) and the name-DB/generate-a-candidate spec (#115); strong scenario-boot
"start-anywhere 1789–2021/+1774" statement (#86/#186/#187).** All content is
**designed intent**, predates the build — reconcile vs. shipped reality.
