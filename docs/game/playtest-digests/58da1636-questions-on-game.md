# Digest — 58da1636 "Questions on game" (the project FAQ / designer-ruling compendium)

**Source:** `docs/game/sources/58da1636-questions-on-game/` — 4 chunks, ~192k chars,
**347 posts** (Dec 2022 → Jun 2026). A long-running playtester Q&A thread where
players ask @vcczar (creator "Anthony"/"V"), @MrPotatoTed, and other senior GMs
(ebrk85, Ich_bin_Tyler, matthewyoung123, Arkansas Progressive, Willthescout7,
Cal, OrangeP47) about the rules and get **authoritative answers**. Lower per-post
density than a playthrough thread, but the single richest cross-system source of
small **durable rulings** in the KB.

This is a **rules/FAQ thread, not a campaign** — there is no era spine to trace.
Rulings are organized below **by system**. Provenance: forum rules doc (sections
cited inline as "2.x"/"3.0.x"), GM consensus. Where a ruling is clearly
engine-relevant and an obvious shipped match exists, a shipped-vs-designed note is
flagged; per batch instructions this is a broad FAQ, so coverage is selective, not
exhaustive. Era framing per `docs/game/historical-context.md`.

> **Chunk coverage:** chunk-001 = POSTs 1–97; chunk-002 = 98–197; chunk-003 =
> 198–281; chunk-004 = 282–347. All four summarized chunk-by-chunk (not held
> simultaneously).

> **Caveat on authority:** many answers are senior-GM *interpretations* of
> ambiguous rules text ("block vs vote," reconstruction modularity, etc.), often
> flagged "needs a fix / flag it in the feedback thread." Treat vcczar's own
> answers as canon; treat GM-consensus answers as strong-but-provisional. The
> rules doc itself is admitted to be **piecemeal / inconsistent across versions**
> (POST 161, 264–265) and **even the creator doesn't have it memorized** (POST 53).

---

## ★ Headline rulings (the load-bearing ones)

- **Difficulty model = your faction's ideology vs. the era. There is NO
  easy/hard toggle** (POST 10–11). vcczar: "I don't think so because I don't know
  how to have my CPU rules enforce that." Difficulty IS ideology-fit:
  - **Easy:** Moderate in most eras; Liberal/Conservative in later eras.
  - **Difficult:** Progressive (except **1892–1968**, where Prog = moderate
    difficulty); LW Pop or RW Pop **after 1892**.
  - **Extremely difficult:** Traditionalist, or LW/RW Pop **before 1892**.
  - Beginners → assign Moderates; most experienced → Traditionalists.
- **Legislation/actions come AFTER deaths/resignations/events in phase order**
  (POST 1–3) — "the most logical spot," makes sense once you play beyond the first
  half-term. A President resigning mid-term was a **general event, not a bug**.
- **You must vote FOR bills you propose** — anti-gaming rule (POST 12–13). Can't
  propose to committee then vote against on the floor. "This is to prevent gaming
  the system."
- **"Block" ≠ "vote."** (POST 158–165, 255–265; re-litigated twice.) Players may
  always *vote* however they like for their faction. **Blocking** = a Senate
  Majority Leader (Iron Fist) refusing to bring a nominee to a vote at all
  (nomination fails, no vote). A SML can only block a judicial/cabinet nominee
  **>1 ideology away** from the SML's ideology, **unless** the nominee has
  *controversial*; a *harmonious* leader won't block a non-controversial nominee;
  an *integrity* leader won't block an *integrity* nominee. Rules text uses the
  two words interchangeably in places — "sloppy writing" (POST 264).
- **Enthusiasm bonus is STATE-conditional; other meter bonuses are GLOBAL.**
  (POST 119–124, 208–210.) A "+2 Moderate" enthusiasm applies **only in states
  with a Moderate bias, regardless of party bias**, in **both primaries and the
  general**. By contrast a meter effect like "QoL → +1 Liberal" applies **across
  the board**, not state-gated ("look, the liberal ideology is working"). This
  **corrected a widespread misreading** ("Time to recalculate all the election
  sheets," POST 124).

---

## Elections, primaries & conventions

| Ruling | Detail | Cite |
|---|---|---|
| Politicians cast few EVs (4–5) | Deliberate abstraction; 435 reps + challengers "wouldn't have been feasible." | POST 28–29 |
| Challenge order = lowest→highest score | Incumbent declares re-run first, then challenges resolve lowest-score to highest. Playtests relax strict ordering for speed. | POST 24–25 |
| Enthusiasm = state-conditional (see headline) | +2 only in states biased toward that ideology, any party, primaries+general. | POST 119–124 |
| Non-enthusiasm meter election bonuses = global | e.g. QoL→Liberal applies everywhere; applied **at start of election** (when they matter). Meter chart labels them "election bonus/penalty." | POST 208–210, 282–283 |
| **Seat bias overrides state bias** (Rep elections) | If a seat has its own bias, use **only** that (ignore state bias). Blank seat → default to state bias. "Toss-Up" seat → no bias at all. | POST 321–322 |
| Industry/lobby election modifiers | Pres/VP from a faction whose lobby card matches a state's leading industry: +1 (+2 if matching expertise too); worst industry: −1/−2. Capped at ±2 even with both ticket members. | POST 180 |
| Can't run for two offices simultaneously | All candidates for all races are entered **at once**; a pol is limited to one race. Prevents lose-Pres→lose-Gov→lose-Sen→win-Rep cheese; also a candidate in multiple races could block challengers. Multi-office runs deemed too complex for core systems. | POST 223–227 |
| Pre-12th-Amendment: a state can't cast for two of its own | If two home-state candidates finish 1st & 2nd in a popular-vote state, the 2nd-place home candidate is skipped; electors go to 1st + **3rd**. | POST 286–289 |
| Primary "focus states" modifier | Candidate picks 3 focus states; rolls +/−1 (ranges shift by charisma/likable/uncharismatic/unlikable; orator boosts +; sole "debate"-skill candidate gets 5–6 → +1 nationally). Rules 2.9.1; obscure/under-used. | POST 154–157 |
| Convention rules-change (unit rule, ½/⅔/¾/unanimous threshold) | Needs **two** faction leaders to request a vote; votes weighted by # of *kingmaker*-trait pols. Iron Fist PL sets all rules unilaterally (and may block votes); Leadership PL rolls 5–6 to force. Candidates **may take no inter-ballot action** (still face scandal rolls). | POST 170–175 |
| Convention ballot rules persist | After substitute candidates appear, balloting continues under whatever rules are in place — does **not** revert. | POST 174–175 |
| Pineapple Primary (assassination card) | Used **at the convention** (before it, pre-primary era). Has killed Grant/Tweed in playtests. | POST 167–169 |
| Winner-take-all vs split EVs | A **Governor action** chooses winner-take-all or split for the state. (Possibly era-dependent.) | POST 176–181 |
| Third parties | Multiple 3rd parties **can** run; a "major" 3rd party (~15%+) joins debates etc. **Can win** (2.9.4) but parties don't change except the 3rd-party nominee becomes party leader. An EraEvos-mandated 3rd-party run **overrides** the meter-triggered one (no double 3rd party). | POST 311–313 |
| Capital city | A legislative proposal; options seen: Boston, NY, Philadelphia, DC, Charleston, Baltimore, New Orleans, Princeton, Chicago, SF, Williamsburg VA, Lebanon KS, San Marcos TX. Moving to **Washington DC finalizes** it (others can be moved repeatedly). DC is **auto-named after the first President** when created. | POST 76–85 |

## Legislation & the courts

| Ruling | Detail | Cite |
|---|---|---|
| Must vote for own bills (see headline) | Anti-gaming. | POST 12–13 |
| Not all laws are repealable | Deliberate — "some stuff would just never be repealed and once done it's done." Repealability is per-law. | POST 268–269 |
| Reduce # of SC justices → attrition, no removal | Passing a smaller court size removes nobody; vacancies just go unfilled until the bench drops to the new number (mirrors the real 1866 10→7 reduction). | POST 219–222 |
| Gov SC-challenge of a law → points only, not enthusiasm | Enthusiasm is tied to the *phase*, not the legis. | POST 106–108 |
| Reconstruction is **modular / per-state legis** | Each state's reconstruction is its own piece of legislation; a Governor can challenge it (rules-as-written don't stop challenging *another* state's — flagged as needing a fix). Ends only via 20-yr expiry, an EO, or passing a Strict/Lenient Readmission Plan; a generic "restrict federal troops" law does **not** auto-end it. | POST 107–116, 241–245 |
| Poll taxes ≠ segregation | Modeled separately; ending segregation leaves poll taxes in force (matches real history: needed amendment + SCOTUS). | POST 203–205 |
| "Ban Naturalization for Native Americans born outside US" | Cosmetic / card-points only; no draft-eligibility effect (Native draftability is gated by the citizenship EO / another bill, which supersedes). | POST 277–280 |
| Mormon office-ban law | "Mormons can't hold office outside Utah" blocks even a faction-leader-with-command from running for President. **Does not auto-expire** at a new era (no sunset clause) — the "expires in Progressivism" special rule means *repealable from 1892*, not auto-repealed. Stays until repealed or struck down. | POST 323–329 |
| Popular/unpopular-legislation point doubling | Discussed but **not actually in the rules doc** (searches confirm absent); meant to double/halve points but unused mechanically. | POST 182–185 |
| Tax/tariff replacement cooldown | 4-yr (tax) / 8-yr (tariff) bar on replacement — open question whether crisis replacements are exempt (unanswered). | POST 333 |

## Drafts, stats, careers & traits

| Ruling | Detail | Cite |
|---|---|---|
| Stats: real-life vs in-game | Most skills/traits seeded from real-life achievement, **but command, leadership, (and ~controversial) must be EARNED in-game** — unless the start year is past when they earned them IRL. All stats can change in play. | POST 100–101 |
| Women/Black politicians draftable before usable? | **Decided NO** to pre-draft. They are added to the **first draft in which they can hold office** (e.g. Susan B. Anthony enters 1872 as a 52-yr-old rookie). Rationale: pre-drafting would drive ahistorical early enfranchisement votes (everyone wants to use their pols). Unusable for almost all offices otherwise. | POST 17–23 |
| Command points — the full source list | (POST 199 is the authoritative enumeration; ~22 ways.) Highlights: **faction leader 20%; party leader 75% first election / 25% after; winning Pres election 50%; re-elected VP 25%; Sec of State 10% first confirm; Continental Congress pres 20%; committee chair 10%; military leadership 20% in major war; governing/senate longevity; protégé of a command-kingmaker; events & crisis legislation 10%; keynote/filibuster small chances.** Losing a medium/easy battle can **lose** command. | POST 195–200 |
| Draft penalty stacking | Penalties (out-of-ideology + out-of-state) are **additive**, not multiplicative. | POST 193–194 |
| Out-of-ideology draft ±1; ideology is a **circle** | If out of your ideologies you may draft a pol 1 ideology away; with the ring topology, B1 (LW edge) could draft RW-Pop (e.g. Jackson) since they're adjacent on the circle. | POST 300–301 |
| Military career-track expertise | Granting army/naval on track removal: if the pol **already** has one, they do **not** get the other. | POST 237–238 |
| Career-track gov who never gained Gov | A 0-Gov successor who took the governing track but died/term-ended before gaining Gov is **ineligible to run for his own term** (serve out only). Same for reps who lost all Legis. Rare-but-real quirk. | POST 290–292, 302 |
| Removing the **incompetent** trait | Only by gaining a conflicting trait (Bookkeeper, Lawful, Crisis Admin/Gov/Manager, Decisive General, Domestic Warrior, Geostrategist, Efficient, Jurisprudence, Magician, Master Kingmaker) then rolling to mutually drop both. A general who gains incompetent is effectively stuck (can't be in cabinet to earn a conflicting trait). | POST 341–344 |

## Kingmakers & protégés

| Ruling | Detail | Cite |
|---|---|---|
| One kingmaker per protégé | A protégé can have only one kingmaker; can't stack a second (master) kingmaker on the same protégé. Flag for rules. | POST 228–233 |
| Chains need a Master Kingmaker | A kingmaker-trait pol can be a protégé but can't take their own protégé **while** the pairing is active — **unless** the link uses a Master Kingmaker (only one kingmaker activatable per state, so non-master blocks the chain). Old "chain bonuses" were removed. | POST 233–236 |
| Re-pairing after loss is allowed (cheese caveat) | If a kingmaker dies/drops the protégé, the protégé **can** get a new kingmaker — flagged as a possible fast-leveling "cheese." | POST 303–305 |
| 4(+) ways a pairing ends | (1) protégé elected Pres/VP (kingmaker becomes Key Advisor, pair dissolves); (2) kingmaker dies; (3) non-master kingmaker moves state; (4) ideology drifts >1 apart (each may drift 1, not 2); plus **disharmonious pair drops at 10%/cycle**. Protégés can't be SC Justices or Congressional leaders. | POST 305–307 |
| Kingmaker "bonus" notes on protégé | Just bookkeeping by GMs (so they remember to delete the +1 when the kingmaker dies); the actual +1 belongs to the protégé. | POST 103–105 |

## Cabinet, appointments & the military

| Ruling | Detail | Cite |
|---|---|---|
| Generals/admirals: removal conditions | Removed **only** by retirement, death, voluntary resignation, seeking higher office, event, or (president's choice) on losing a battle. President **cannot** fire/hire at will during the appointment phase — **except** an Iron Fist president before a new war begins. | POST 39–45, 253–254 |
| Chair JCS | 4-year non-renewable term (and/or must be replaced each term). | POST 41–43 |
| Military service & the 16-yr cap | Political office is capped at 16 yrs total; **military service does not count** toward it. Mandatory retirement age is settable via **Pres Ex Actions**. | POST 253–254 |
| Senior general loses *Military Leader* mid-war | Stays until the next appointment (unlike gaining **Incompetent**/Easily Overwhelmed, which removes immediately). | POST 308–310 |
| Re-appointing a removed general/admiral | After West Point exists, a removed/vacated major officer can be re-appointed **only during a Major War**. | POST 310 |
| End-of-war loser-roll vs victory | Open question: highest officers roll penalty for losing a majority of battles — unclear if it still fires when the war is won (could fire a general "in disgrace" amid victory). Unresolved. | POST 284 |
| Chief of Staff (Gilded-Age army/navy reform) | Single 4-yr term, renewed only by major war; whether they can serve, step down, and return later is **unspecified** — vcczar: "just do whatever; we'll fix it when programmed." | POST 330–332 |
| Cabinet member resignation | Auto-resign on winning office; possibly voluntary resignation to run or make way (refs in rules, not firmly settled — no Hatch-Act distinction modeled). | POST 214–218 |
| Cabinet death → replacement still needs confirmation | No recess-appointment shortcut; replacement goes through committee + Senate (mimics real life). | POST 268–269 |
| Bank-of-the-US President | Can't be removed (or **promoted**, which counts as removal) unless the US President is **of his faction**; otherwise stays unless the bank is unchartered. | POST 270–271 |
| Foreign-affairs country roster | Fixed set (UK, France, Spain, Germany, Russia, China, Japan, Israel). Deliberately bounded ("had to draw the line"); other nations appear via **events**. Wars possible vs any ambassador-nation, your own nation, historical foes incl. native tribes, Central/South America expansion, and many **Era of the Future** wars (per George Friedman's *The Next 100 Years* — fragmented China/Russia, Poland, a Lebanese War, etc.). A war-chart file lists ~300 possible wars. | POST 46–58 |
| Foreign policy stays generalized | Spain is always "Spain," France "France" even if WWI is averted — focus is domestic; **losing a war is the big consequence**. Some alt-hists for other nations exist (e.g. "no Napoleon" playtest) but are largely outside player control. | POST 246–250 |
| China/PRC ambassador | Unless relations are hostile-or-worse, the US **has** a PRC ambassador after China falls to Mao; "China Thaw" only raises relations above Neutral. (Player notes this diverges from real history — no PRC ambassador until 1979; suggests an EraEvos to model Taiwan-first recognition.) | POST 345–347 |
| NATO/SACEUR slot | None — game has no multilateral alliances; existing general slots + readiness mechanisms suffice ("pretend it's the SACEUR"). | POST 334–337 |

## Governors & governor actions

| Ruling | Detail | Cite |
|---|---|---|
| Winner-take-all / split | Gov action (see Elections). | POST 176–181 |
| Gerrymander | +1 in House elections for 10 years; **outlasts the governor** (stays the full 10 yrs regardless of who wins Gov, unless a future Gov undoes it via the appropriate action). | POST 266–267 |
| Gov SC-challenge → points not enthusiasm | (see Legislation/courts). | POST 106–108 |
| Territorial governors | Not modeled — "nothing for territory governors to do." Imagine it as part of a governing-track pol's activity. | POST 239–240 |

## Events, mortality & alt-history

| Ruling | Detail | Cite |
|---|---|---|
| President can die on a random death roll | Yes — not only via assassination events. | POST 63–64 |
| Truman's mid-term resignation | A **general event**, not a bug (anchors the "events fire mid-term" model). | POST 1–3 |
| Event-named historical figures aren't auto-killed | Events kill a figure **only if the event text says so**. Joseph Smith has **no kill event** (Illinois Mormon War / Extermination Order don't remove him) — he survives unless random death gets him; if Pres doesn't intervene, Mormons reach Utah as in OTL. (Smith: drafted 1832 at 27, starts with Leadership, has *frail*; died IRL 1844 so can't reach Peak Abilities in 1848 unless he survives & climbs.) | POST 293–299 |
| Open Japan early | Possible if the event fires early; **~1840 earliest**. | POST 201–202 |
| State ideology assignment | By **decade** by default; events can shift it (e.g. refusing to admit Hawaii). | POST 88–89 |
| Foreign alt-hists exist but bounded | DLC may add more. | POST 248–251 |

## Eras, scenarios & territory

| Ruling | Detail | Cite |
|---|---|---|
| Era names live in the rules doc | "near the top of 2.1: Faction Re-Alignment." (Matches the KB's Republicanism→Democracy→Manifest Destiny→Nationalism→Gilded Age→Progressivism banding.) | POST 73–75 |
| Era-banding by name | Players reference "Era of Manifest Destiny," "Age of Progressivism (1892)," "Gilded Age," "Nationalism" as live in-game labels. | POST 293, 320, 325 |
| Constitutional Convention | Always occurs at the **end of the Era of Independence**, triggered by events (Continental Congress → ConCon; no separate Articles-of-Confederation step the player toggles). | POST 35–38 |
| ConCon government types | Can choose e.g. **president-for-life**, a different presidential election method — but **no monarchy/dictator** option (those arise later via policy & presidential powers). | POST 26–27 |
| Territory acquisition | Via **scripted events** and **military peace treaties** (not free conquest). | POST 33–34 |
| Rapid state admission | States are **era-locked** (can add 10–20 yrs early, not 50). Penalties exist for a party **refusing** to admit a state that would favor the opponent (ahistorical) — possibly over-tuned. New states ~3 EV for a while, so swing is small and self-correcting. | POST 139–145 |
| Civil War | All pols who join the secession movement are **unavailable** for the duration; **two random pols** are rolled for CSA/secession President & General-in-Chief. Use rules **3.0.35 Secessionist Politicians** to determine who secedes. | POST 190–192, 272–274 |
| Interest/lobby cards need 5 pols | A faction gets a card for whatever qualifying interest it has **≥5 pols** in; many 1772-start factions get none. | POST 186–189 |
| Faction ideology-card adjacency | Cards must be contiguous on the 7-point scale. Keep what you have **most** of (e.g. keep Mod; drop non-adjacent Prog/LW-Pop). Orphaned ideologies with no qualifying faction attach to whoever holds the **neighboring** card. | POST 211–213 |

## Meters & UI / information

| Ruling | Detail | Cite |
|---|---|---|
| The meter list | Budget, economic stability, military preparedness, domestic stability, global/planet health (climate), per-country relations meters, per-ideology lean meters, party popularity, **Quality of Life**. Abstractions, not hard stats (no unemployment/GDP). | POST 65–67 |
| QoL meter | Low importance until ~the Progressive Era. | POST 68–69 |
| Meter→ideology effects when meter inactive | If a meter isn't active in an era, its effects **don't apply** (GM-consensus, not unanimous). | POST 315 #4, 316–317 |
| Enthusiasm processed at election time | Starting enthusiasm 5; meter modifiers applied at start of election (not continuously). | POST 281–283 |
| Legislation "who-it-benefits" info display | Hoped-for but uncertain how much info the final UI will show; not yet built in software. | POST 15–16, 61–62 |
| Game-history recording | Desired but a **performance** concern (Paradox/CK3 slow down storing years of data). | POST 6 |
| Final-UI questions | Largely unknown; design beyond rules is "Anthony's field and he doesn't come here." | POST 86–87, 251–252 |

## Difficulty

- **No easy/hard setting; difficulty = ideology-vs-era** (POST 10–11 — see
  headline). This is the single most-cited design statement in the thread and the
  project's de-facto difficulty model.

## Misc / process

- Rules doc is **piecemeal across versions**, cleaned section-by-section as
  vcczar works through it (POST 161). Cite section numbers when asking (POST 159).
- The dev **Discord** is low-activity; real coordination is per-playtest group
  chats (POST 146–153).
- "Wheeling and dealing" (trading a post for a vote) is loved by players but **no
  viable CPU system exists** for it yet (POST 96–98).
- Rounding/dice: a roll *equal* to the chance succeeds (POST 126–130); fractional
  % (2.5% on a d100) is GM-discretion / "roll d1000" (POST 131–138).
- Reset-points-per-era is GM habit, not enforced — some bank/carry points across
  eras (POST 319–320).

---

## CPU/initialization rules — under-specified areas (Umbrella's audit, POST 315–318)

A 12-point list of places where the **CPU rules and game-setup are vague enough
that GMs make human calls** — high-value for the build because they're exactly the
ambiguities a software implementation must pin down. vcczar/MrPotatoTed
acknowledged most ("we need a *How To Start A Playtest* guide," POST 316):

1. **Initial-draft stat sets** (First-Year / Midway / Historic / Peak) — no clear
   rule for when to use Midway or how to round .5 values, or how to assign
   Expertise to non-Historic pols. GMs improvise (POST 315 #1, 316 #1).
2. **"Benefits their faction" (Gov actions)** is undefined for a CPU — points?
   industry-building? state-tilt? Open. (#2)
3. **Hard-maxed meters & crisis actions** — if a meter can't move (e.g. capped in
   Independence), do crisis actions still "address the crisis"? Should Funding Act
   be flagged as dealing with the Revenue-Budget crisis? (#3)
4. **Inactive-era meter effects** — do they apply? (Consensus leaning **no**, POST
   317.) (#4)
5. **Proposer-selection ties** — sort by Legis then party; ties among equal-Legis
   pols broken how? MrPotatoTed does it literally (stop at the count); Umbrella
   uses PV (not in rules). (#5, 316 #5)
6. **Conversion order / Pliable→Puritan** — which faction leader converts first?
   Rules: **ascending faction size, ties random** (POST 318). Gaining Puritan vs
   the trait-conflict path (3.0.34) is murky. (#6)
7. **Gov-vs-Rep eligibility** — which does the CPU run a dual-eligible pol for?
   (Umbrella defaults to Gov.) (#7)
8. **Election candidate-selection** should weight ±1 election modifiers and traits
   (Provincial for local, Military post-war) — currently doesn't. (#8)
9. **Ideology-shift CPU rules** don't protect Integrity/Puritan pols, so they
   gain Flipflopper/Two-Faced too often. (#9)
10. **Early ConCon** (possible ~1780–82) leaves a gap: post-ratification you'd
    expect Pres/Senate/SC elections, but many rule sections "don't apply until
    Era of Federalism" (diplomacy, exec actions, end-of-term retirement). (#10)
11. **Initial SC Chief Justice selection** unspecified; tends to seat an
    all-one-party court. (#11)
12. **Pre-party Pres elections** pick candidates by most-kingmakers (no party
    leader in Independence); alternate-candidate rules rarely fire. (#12)

---

## Key durable rulings + deltas vs current build (handoff)

**Headline:** This thread is the project's **FAQ / designer-ruling compendium** —
hundreds of small authoritative rulings across every system. The load-bearing
ones:

1. **Difficulty = faction ideology vs. era; no easy/hard toggle** (POST 10–11).
   *Delta:* shipped game offers scenario choice but **no ideology-keyed difficulty
   guidance/labeling**. A "recommended-difficulty by faction/era" surface would
   match designer intent.
2. **Phase order: deaths/resignations/events BEFORE legislation/actions** (POST
   1–3). *Cross-ref:* matches the engine's `PHASE_SEQUENCE`/`shouldRunPhase`
   ordering — confirm legislation phases sort after mortality/event phases.
3. **Must vote FOR your own bills** (POST 12–13) — anti-gaming. Engine-relevant if
   the build ever lets a proposer cast a floor vote.
4. **Block ≠ vote** (POST 158–165, 255–265): SML/Iron-Fist *blocking* (>1
   ideology, unless controversial; harmonious/integrity exemptions) is distinct
   from ordinary voting. *Delta:* verify the build models a **block/refuse-to-vote
   path** separate from tallying votes — likely a designed-but-unbuilt nuance.
5. **Enthusiasm is state-conditional; other meter election-bonuses are global**
   (POST 119–124, 208–210). *Delta / engine flag:* the shipped engine carries a
   single per-state `bias` and a card-derived `electionBias` (phaseRunners.ts
   ~1537–1560); confirm whether **ideology-enthusiasm is gated to matching-bias
   states** and whether **global meter→ideology election bonuses** exist. This is
   the highest-value election delta to check.
6. **Seat bias overrides state bias in Rep elections; "Toss-Up" = no bias** (POST
   321–322). *Delta:* shipped House is abstracted via `representativeIds` with
   **state-level `bias` only — no per-seat/per-district bias field** is evident.
   The designed per-seat bias (with Toss-Up) is **not in the current abstraction**;
   a build that wants district-level results would need it.
7. **Command must be earned in-game** with a precise ~22-source table (POST
   199); losing easy/medium battles can *lose* command. *Delta:* check `pv.ts` /
   phase runners actually award command via these channels (FL 20%, PL 75%/25%,
   Pres-win 50%, etc.) — a concrete spec for an under-built area.
8. **Women/Black pols enter only at first office-eligible draft** (POST 17–23) —
   not pre-draftable. Drives dataset `draftYear` / eligibility gating.
9. **Reconstruction = per-state modular legislation; not-all-laws-repealable;
   poll-tax ≠ segregation; Mormon-ban has no era sunset** (POST 107–116, 203–205,
   268–269, 323–329) — concrete legislation-system semantics for the antebellum→
   Gilded arc.
10. **Kingmaker constraints** (one per protégé; chains need Master Kingmaker;
    4 dissolution paths + 10% disharmony drop; protégés can't be Justices/Cong
    leaders) (POST 228–236, 305–307) — a tight spec for the mentor system.
11. **CPU/initialization is admittedly under-specified** (POST 315–318): 12
    enumerated ambiguities (stat-set selection, "benefits faction," inactive-era
    meters, tie-breaks, early-ConCon institution gating, initial Chief-Justice
    pick). *These are direct requirements for a deterministic engine* — anywhere a
    GM "makes a human call," the code must decide.

**Other engine-relevant rulings:** president can die on random rolls (POST 64);
Gov winner-take-all & gerrymander-outlasts-Gov are Gov actions (POST 176, 266);
SC-size reduction = attrition not removal (POST 219–222); military exempt from the
16-yr cap, mandatory-retirement settable via Pres Ex Actions, no fire-at-will
except Iron-Fist-pre-war (POST 253–254); civil-war joiners unavailable + 2 random
secession officers (POST 190–192); state ideology set by decade (POST 88); foreign
roster fixed at 8 + event-driven wars + Era-of-Future (Friedman) war set (POST
46–58); China/PRC ambassador auto-exists unless hostile (POST 345–347, flagged as
ahistorical by a player).

**No new gap numbers assigned** (digest-only batch). Living-doc owner should
cross-ref the difficulty model, the enthusiasm/seat-bias election deltas, the
command-earning table, and the CPU-initialization ambiguities into the gap log.
