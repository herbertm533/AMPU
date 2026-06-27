# Digest — "Welcome To The Future: A Hands-Off, All-CPU Playthrough (2022–2072)"

- **Slug:** `c54b7a9d-welcome-to-the-future-a-handsoff-allcpu-playthrough-2022-2072`
- **Source:** forum thread, 380 posts / 7 chunks (~304 KB). Host/GM: **MrPotatoTed**; dev: **vcczar**.
- **Scope:** A spreadsheet (pre-app) campaign **booting at the 2022 U.S. midterms** with a stated PLAN to run a **hands-off, all-CPU** game to **2072**. **The march to 2072 is never reached.** The captured corpus covers only: (a) a long **setup/data-prep** phase (posts 1–128) and (b) **exactly one in-game turn — the 2022 midterm cycle and its post-election/cabinet/event resolution** (posts 129–380). Thread ends mid-2022-turn (during the 2022–2024 event phase, **before** the legislative voting phase, **before** the 2024 draft). Never reaches 2024, never reaches the "Era of the Future" proper.
- **Two caveats that reframe the batch-29 note:**
  1. **Not strictly all-CPU.** Two human players are chosen (**@Arkansas Progressive** runs the Bernie/LW-Pop faction; **@10centjimmy** runs the JEB!/Moderate-GOP faction); the other **8 of 10 factions are CPU** (posts 118). So it is **"hands-off" (GM rolls everything mechanically) with 8 CPU + 2 light-touch human factions**, not a pure all-CPU run like `oopscpu`/`drums`. Still the corpus's clearest mass-CPU-faction behavior sample at modern scale.
  2. **Era-of-the-Future is a STUB, and the game starts at the *tail of the prior era*, not inside Future.** Dev confirms the era is real but unfinished (post 6); the GM confirms event density is thin at the era edge (post 378). A 2022 start sits at the **end of the Era of Populism / start of Era of the Future band**, so the Future content is barely exercised.

---

## Headline 1 — "Era of the Future" as the terminal era band (content vs. stub)

| Fact | Detail | Source |
|---|---|---|
| **Dev confirms it's a real-but-partial era band** | "The only issue is that **Era of the Future isn't completely fleshed out.** So you might want to **create some proposals** and stuff. **Events are fairly solid. Mainly I need more proposals.**" | post 6 |
| **Events solid, proposals/legislation the gap** | Corroborates: the era's **scripted-event** spine exists; its **legislation/proposal** library is the missing piece. Same shape as the §2 Federalism gap (events before legislation). | post 6 |
| **The game starts at the *tail of an era*, not inside Future** | GM, on running scripted events for the 2022 turn: "There is **only one scripted event capable of occurring right now — that's what I get for starting a game at the tail end of an era.** … that one scripted event will fire, and then the rest will be general events again." Confirms 2022 is the **trailing edge** of the (modern/Populism) band; thin scripted-event density at era boundaries. | post 378 |
| **The lone era-edge scripted event** | The single fireable scripted event at 2022 is **"Transgender Rights"** (LGBT legislation worth double next phase). Everything else degrades to **general events** (Relations Deteriorate, Major Oil Spill, Terrorist Attack on US Troops, Race Riots, Sex Scandal, Scandalous President, etc.). | posts 376–378 |
| **Does the era end? Is there a game-over?** | **Unknown / not reached.** The thread never plays into or out of the Future band. The stated **2072 end is an arbitrary author cutoff** ("I'd be 89… 50 years was a nice round number"), **not** a documented in-engine game-over. No evidence of a terminal era boundary or victory/end condition anywhere in the corpus. | post 20 |
| **Roster assumption for late Future** | Author assumes "the entire list of politicians by [2072] will be **all randomly generated**" — i.e., the real-politician pool runs out and generation takes over (see Headline 3). Stated as an assumption to be tested, never reached. | post 20 |

**Shipped-reality check (codebase):** the shipped engine `Era` type is **`'independence' | 'federalism' | 'nationalism' | 'modern'`** (`src/types.ts:1337`). **There is NO `future` (or `populism`) era band in code** — `'modern'` is the only modern tuning shipped. The "Era of the Future" exists **only** in the forum's master-spreadsheet **Historical Era tab** (post 55 lists "Update Historical Era Tab" as a prep task). So the era is **doubly unbuilt**: not just under-content'd (per dev) but **absent from the shipped era enum entirely**.

---

## Headline 2 — Hands-off / mass-CPU behavior (the AI-play observation)

With the GM mechanically resolving every roll and **8 of 10 factions on CPU rules** (humans only nudged faction-leader/leadership/vote choices), the run progressed cleanly through a full modern turn **without stalling or looping**. Key CPU behaviors observed:

| System | CPU behavior observed | Source |
|---|---|---|
| **Draft (post-1772 start rules)** | New CPU draft algorithm (rewritten mid-thread after the first draft produced "bizarre teammates" from 3 ideologies): **50%** highest eligible *sitting* officeholder in order **President→VP→Senators→Governors→Reps→Cabinet**; **50%** highest draft-value; **25%** highest-value w/ Kingmaker; **10%** highest from a state where faction already has a Kingmaker; **5%** each for leadership / charisma / efficient; **always** drafts to match ideology cards; **from round 4** drafts **dynasty members** of pols already on the faction. Factions trimmed to **2 draft-eligible ideologies** (3 was too broad). | posts 112–113 |
| **Candidate selection / elections** | CPU fields incumbents and primary winners; the GM ran a **D6 + state/seat historic-bias** model. Results judged **highly realistic** (net **R+1 Senate → 51-49**, **House R+33 → 246-189**), matching real 2018/2010-scale swings. CPU loses gracefully (no stall). | posts 129–135, 201–202 |
| **Empty-slot failure (NEW bug class)** | CPU **cannot field a candidate** where the real-data pool is exhausted: **Alabama had no eligible Republican** for an open seat (Sessions auto-retired at 75+unemployed; others already placed). GM hand-added real reps to avoid a Dem sweep. Pool-exhaustion is a structural CPU/roster failure, not an AI-logic failure. | posts 137, 144, 148–149 |
| **Vacancy appointments** | CPU governor appointments follow a preference chain: own faction's eligible → **appointer's own ideology** (NOT the faction-leader's — GM corrected himself mid-thread). Produced a cross-faction appointment (Hochul→Suozzi). | posts 223–228 |
| **Ideology shifts / conversions** | CPU attempts ideology shifts (mostly fail, gain `pliable`/`flip-flopper`) and **party conversions**; raids concentrate on the **Moderate faction** because everyone else sits at **max enthusiasm "thanks to current polarized politics"** (only moderates are raidable). PenceCPU successfully converts Romney. | posts 231–244 |
| **Kingmakers/proteges** | CPU master-kingmakers (e.g., Ronna McDaniel → DeSantis/Hawley/Palin/Trump) auto-assign proteges and grant interest/expertise/trait bonuses. | posts 238–239 |
| **Leadership selection** | CPU runs **multi-round plurality votes** (drop lowest, endorse, re-tally) for Speaker/Leader/Whip. **PenceCPU swept all 3 House leadership posts** by being the largest, easy-to-coalesce bloc. Senate Minority Leader went to a come-from-behind single-vote win (Tester). | posts 250–266, 301–303 |
| **Meter management** | Lobby/interest reactions to cabinet picks move per-ideology **enthusiasm meters** (e.g., net **+9 Blue Moderate** from a moderate cabinet; RW/Trad shift Red when ignored). CPU does not "manage" meters strategically — they're an *output* of CPU appointment choices. | posts 350–354 |
| **Cabinet for a *pliable* President** | Because Biden is `pliable`, the **Senate Minority Leader (Tester) does the appointing** — a notable succession-of-agency rule. | posts 307, 315–316 |
| **Filibuster (no CPU override rule)** | CPU senators with the right profile filibuster nominees (Mike Lee kills Sullivan + Locke; Cruz kills Solis); filibustered pols gain `Controversial`. **GM flags there is NO rule for whether a CPU Majority Leader overrides a filibuster** — improvised "won't override own party unless it targets his faction." | posts 331, 343 |

**Net read:** at modern scale, hands-off resolution **works and produces plausible outcomes**, but exposes that large swaths of CPU behavior are **unspecified** (filibuster override, maj/min-leader vote logic, cross-party cabinet caps) and were **invented on the fly** by the GM — exactly the "★ subsume the human GM" (`GM⇒App`) surface area.

---

## Headline 3 — Roster / random-politician generation (the pool runs dry)

| Fact | Detail | Source |
|---|---|---|
| **The real-politician pool is finite and runs out going forward** | "draft classes **dry up in modern years** because we don't know what current 20- and 30-somethings will be relevant 30 years from now." Past eras are fine (we know who rose); the **future is data-starved**. | posts 369 |
| **Generation is the intended fill** | The game "**has the ability to randomly generate young and potentially upcoming statesmen**" — author plans to test it as a core feature of this run; **2024 draft** is when generated up-and-comers first enter. | posts 26, 180 |
| **2072 ⇒ all-generated roster (assumption)** | "the entire list of politicians by [2072] will be **all randomly generated**." | post 20 |
| **Generation quality / naming** | The name **generator produces deliberately odd names** ("Let us know if you find some more crazy names" / "I'd just have fun with the name generator"). No quality complaint logged in-corpus (generation never actually ran, since 2024 isn't reached). | posts 59–60 |
| **Generated "career tracks" idea (NEW design ask)** | To fix the empty-officeholder problem at a modern start, proposal to **pre-generate fake career-track cohorts** "whose stats would look like they were drafted in 2020, 2016, 2012, 2008, 2004" — i.e., synthetic incumbents to backfill Reps/Admirals/Ambassadors/Justices a real 2022 boot lacks. | posts 364–369 |

---

## The 2022 modern boot (scenario-boot deltas)

| Area | Observation | Source |
|---|---|---|
| **Significant-House-rep selection** | Core unsolved boot problem: the game shows only **"significant" reps per state** (leadership, whips, chairs, ranking members, "+ AOC"); the rest filled by **seniority**. Real 2022 D leadership (Hoyer, Clyburn, K. Clark, **Jeffries**, Aguilar) + R leadership (McCarthy, Scalise, Stefanik) entered by hand. | posts 22, 3–4 |
| **Manual rep backfill at runtime** | Where no accurate real candidate exists, GM adds **1-legislative / 1-experience / no-trait** real reps (e.g., Mike Rogers AL) — a deliberate **sub-floor** fill mirroring the dataset's sub-floor rule. | posts 148, 150, 153 |
| **Stat-bootstrap formula** | All ~900 statesmen re-statted via a flat heuristic: **10 yrs rep/senator → ≥2 legislative; committee chair → 3; whip/leader → 4; Speaker → 5.** | post 12 |
| **Pruning the stale** | Retirement rolls to fix the "2000 playthrough" bug (long-dormant ex-governors all becoming governor again): **50% cut** for anyone irrelevant 10 yrs; **30%/60%** variants applied later; **auto-retire any unemployed pol 75+.** | posts 12, 17, 66 |
| **Cabinet confirmations** | Full modern cabinet confirmation chain played: party-wide block attempt → committee vote (50%+1) → floor (51) → swing voting → filibuster. Cross-party picks felt **too easy** ("weird that it's so Republican") → GM **rewrote cross-party cabinet rules mid-thread** (≤25% accept w/o integrity; ≤1 cross-party in top-4; ≤3 total; ≤1 ideology step away). | posts 307–316, 320–349 |
| **Ex-President / Ex-Nominee special role (NEW mechanic)** | Living ex-Presidents (2-term or out >20 yrs) get an **"Ex President" job**: cannot hold office, but act as a **super-Kingmaker** (Kingmaker + pick proteges **from any state**). Hillary gets bespoke **"Ex Nominee"** (same). Trump kept as a **normal, still-eligible** pol. Purpose: model lasting party influence + see when they die. | posts 27, 46 |
| **Polarity** | Fully modern: **BLUE = Democrats (left), RED = Republicans (right)** — no caveat. Faction leaders: Bernie/Biden/Harris/Warner/Buttigieg (BLUE); Trump/Pence/McConnell/JEB!/Rubio (RED). | posts 117–118 |
| **Faction ideology assignment is era-transitional** | Factions get assigned 2 draft-eligible ideologies **for now**, but "**Starting in 2026, factions will no longer have assigned ideologies for the drafts.**" — a forward era rule the build does not model. | post 68 |

---

## House rules & mechanics surfaced (durable detail)

- **Election engine:** D6 die + **state historic bias** and a separate **seat bias** (stand-alone for that seat only if it deviates from state); tossup sets bias to **0** (post 125). "Easily re-elected" = no D6 outcome could flip it; "Upset" = die boosted the underdog (post 129). Margin computed from final points vs. state lean (e.g., 8-3 in a Blue+4 state → margin 5, no bias bonus, post 173). Validated as **realistic** by multiple players.
- **Candidate penalty:** a losing candidate takes **-1 in elections for 6 years** (posts 210, 212).
- **Death/retirement reasons are flavor strings** (a vcczar addition): "allegedly pressured out," "to become a lobbyist," "deadly accident," "nervous system ailment," etc. (posts 119, 123).
- **Age degradation:** advancing age grants negative traits (`pliable`, `easily overwhelmed`, `uncharismatic`, `incoherent`, `passive`) and **-1 to skills**; can cancel opposing traits (`pliable` cancels `puritan`). Mass-applied (posts 208, 211).
- **Office gains:** winning office grants **+skill / random expertise / traits**; committee seats grant the committee's **interest/expertise** to every member; chairs/leaders shed `obscure`. (posts 210–212, 276–290.)
- **Retirement timing rule (proposed):** a sitting Gov/Sen/Rep selected to retire **stays until the next election**, then is removed (post 367).
- **Pliable President ⇒ appointing power passes to the Senate floor leader** (post 307).

---

## Candidate gaps/bugs for consolidation

> Tag legend: **NEW** = not previously in gap log to my knowledge; **corroborates #N** = strengthens an existing logged item. Cite this digest + post.

1. **NEW — "Era of the Future" band is wholly unbuilt in code.** Shipped `Era` enum (`src/types.ts:1337`) has no `future`/`populism` member; `'modern'` is the only modern tuning. The era exists only as a forum-spreadsheet content band; dev confirms it's "not completely fleshed out — mainly I need more proposals" (post 6). *Requirement:* add the era band + its **legislation/proposal library** (events reportedly already solid). [post 6, 55, 378]
2. **NEW — No documented game-over / terminal era boundary.** The 2072 end is an arbitrary author cutoff (post 20), not an engine end-state. Corpus still contains **no thread that plays *through* a future era** — this source refines the standing negative result: the era is *defined as a stub* but never *played*. *Requirement:* decide whether the timeline has an end condition. [post 20, 378]
3. **NEW — CPU/roster pool-exhaustion at modern+future starts.** CPU cannot field candidates where real data runs out (Alabama R seat). *Requirement:* generated-politician backfill must trigger automatically for empty officeholder/candidate slots, not require GM hand-adds. [posts 137, 144, 148]
4. **NEW — Pre-generated "career-track cohorts" for non-1772 start scenarios.** A real 2022 boot is missing Ambassadors, most Admirals, lower Justices, and bench Reps. *Requirement:* synthesize sub-floor incumbents stat-dated to prior cycles (2004–2020) for modern starts. [posts 364–369]
5. **GM⇒App / NEW — CPU legislative/confirmation logic is unspecified.** GM improvised: (a) **no rule for CPU Majority Leader overriding a filibuster**; (b) **no rule for how maj/min leaders themselves vote** (invented: support own party + within-2-ideology-clicks; iron-fist → within-1); (c) cross-party cabinet caps. *Requirement:* formalize these as engine rules. [posts 322, 331, 343]
6. **GM⇒App / corroborates "subsume the GM" charter — full modern turn loop was hand-cranked.** Every phase (elections, age rolls, gov-stat gains, conversions, kingmakers, leadership votes, cabinet confirmation, ambassadors, events) resolved manually by the GM over weeks. This is the most complete modern turn in the corpus and a concrete spec for the modern engine loop. [posts 129–380]
7. **NEW — "Ex President" / "Ex Nominee" super-Kingmaker role.** Out-of-office former Presidents/nominees as office-ineligible super-kingmakers (proteges from any state). Not in shipped systems; players want it in the main game. [posts 27, 46, 30]
8. **NEW — Era-conditional faction-ideology assignment.** Drafts use assigned faction ideologies pre-2026, then drop them ("starting in 2026, factions will no longer have assigned ideologies"). Build does not model an era-conditional draft-ideology rule. [post 68]
9. **NEW — Pliable-President ⇒ floor-leader-appoints rule.** A `pliable` President cedes appointment authority to the Senate floor leader. Worth confirming against shipped cabinet logic. [posts 307, 315]
10. **Corroborates (gerontocracy / age model) — modern roster skews very old.** Mass age-degradation + 75+ auto-retire produced an explicit "the country is a gerontocracy" observation (Leahy→Welch at 82→75). Validates the age/retirement model but flags that a modern start front-loads near-retirement officeholders. [post 182]
11. **Minor data bugs (forum-side, low signal):** Crenshaw mislabeled NY (TX in-game, post 81); "Al Brooks"=Mo Brooks (post 213); Kempthorne/DeMint state typos. All GM transcription slips, not engine bugs — noted for traceability only.

---

## Open questions (for the human)

- Is the **Era of the Future** meant to be a distinct engine era band (with its own meters/legislation), or just `'modern'` continued past ~2024 with generated rosters? The spreadsheet treats it as its own band; the code has no slot for it.
- Should the timeline have a **terminal state** (a 2072-like cutoff, a victory condition, or open-ended play)? No source answers this.
- Is the **"Ex President / Ex Nominee" super-kingmaker** intended for the shipped game (players asked twice), or a playtest-only convenience?
- Does the shipped build already implement the **pliable-President ⇒ floor-leader-appoints** rule and **filibuster** mechanics, or are these GM-only spreadsheet rules?
