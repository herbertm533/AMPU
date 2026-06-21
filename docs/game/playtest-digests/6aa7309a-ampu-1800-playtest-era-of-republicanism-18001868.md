# Digest — `6aa7309a` "AMPU 1800 Playtest: Era of Republicanism 1800–1868"

> **Final committed thread-digest (2-stage reduce).** 120 chunks (POSTS 1–9943,
> ~400 pages) → 12 map-partials → 3 section-digests (A: 1800→1822, B: 1822→1850,
> C: 1846→1868) → this. Citations are `===== POST n =====` markers; section-digest
> cross-refs are §A/§B/§C. The raw chunks + section-digests are gitignored/
> disposable; **this digest is the durable record.** This is the **7th ingested
> thread.**
>
> **★ TWO headline findings, lead with both:**
> 1. **This batch FILLS THE 1800–1856 GAP** — the Jeffersonian → Era-of-Good-
>    Feelings → Jacksonian → Manifest-Destiny early-republic period had **no prior
>    coverage** in the KB. It is the most new-era-content-rich batch since the
>    earliest ones.
> 2. **★ ERAS ARE CONTENT-BANDS GATED BY GAME-STATE + TERRITORY OWNERSHIP, NOT
>    CALENDAR YEAR.** This campaign's clock runs *decades* behind its content (LA
>    Purchase fires 1834, Texas 1834, Indian Removal 1834–38) because eras advance
>    on game state, not dates. This **contradicts the shipped `year % 4` / `year %
>    2` era predicates** (phases.ts:49–58) and the 4-value `Era` enum
>    (types.ts:1337) — calendar year is essentially cosmetic in the design.

---

## §0. Thread metadata + the eras-are-content-bands finding

### Provenance
- **Title:** "AMPU 1800 Playtest — Era of Republicanism 1800–1868" (forum topic 1877,
  politicslounge). The forum title is **only the topic name**; the campaign's
  *internal* final era is "Era of Nationalism," not "Republicanism" (§C-9, POST
  9717). §A POST 1.
- **GM/DM = `ebrk85`** ("Eric"). A **player-run** playtest of `vcczar`'s ("V"'s)
  ruleset — NOT designer-GM'd (distinct from the `hd`/`drums` threads where vcczar/
  Tyler rule in-thread). V's rules live in an **off-forum living Google Doc**; the
  GM sees only V-approved text and **improvises the gaps**. §A POST 1, 12, 635,
  2008–2010.
- **Build team aware but not running it:** `vcczar` (engine) + **MrPotatoTed**
  ("Ted", *doing the computer build*) appear only as @-mentions for feature
  requests. The single-player build ("AMPU 2") is coded **in parallel by "Anthony"
  per Matt/Ted/Tyler's rules calls** — direct, dated evidence the forum drives the
  build (§B POST 6240, 6278; §A POST 15, 17, 19, 415).
- **Players:** 10 humans, **2 teams of 5** (Blue = Democratic-Republicans, Red =
  Federalists→National Republicans); roster swaps + CPU takeovers mid-thread (e.g.
  `@Nikk` onboarded by taking the last-place CPU faction at an era boundary). §A
  POST 1, 24; §B POST 6187.
- **Distinct alt-history campaign, end-to-end now documented:** this is the **direct
  predecessor of batch-1's `f4c7c2c4`** ("1800-continued / 1868") — same GM
  `ebrk85`, ~400 pages, **identical roster** (dkh64, jnewt, Vicx, Brocklin,
  10centjimmy, matthewyoung123, Arkansas Progressive + CPU), ends at exactly the
  1868 era boundary where `f4c7c2c4` opens (the explicit "new thread" handoff lives
  in `f4c7c2c4`'s opening, not here). **Provenance note: the 1800 campaign is now
  documented end-to-end — 1800→1868 here, 1868→Gilded in batch 1.** §C-9, POST 9943.
- **Distinct from `house-divided` (the 1856 native run).** This is a *different*
  Civil War in a *different* campaign — independent corroboration + divergent
  outcomes (see §3). §C-1.

### ★ Eras are content-bands gated by game-state + territory ownership (the headline architecture)
The single biggest structural delta vs the codebase. The clock reads 1832–1838 but
US history runs ~30 yrs behind, because events fire by **game-state/meter/territory
triggers, not by matching real dates** (§B POST 4329, 5255–5256, 5608):
- **LA Purchase only succeeds in calendar 1834**, after *decades* of failed
  attempts by multiple in-game presidents (the implementing trio kept blundering
  the roll — a running joke). Players openly *preferred to fail it* so they could
  later seize Louisiana by war in Manifest Destiny. §B POST 4281, 4672, 4918, 5255.
- **Texas purchased from Mexico in 1834** via Executive Action (not annexation of an
  independent Republic of Texas); the same Min-France son-in-law (Edward Livingston)
  completed both LA Purchase and Texas in 4 yrs. §B POST 5602, 5608.
- **Indian Removal / Five Civilized Tribes treaties fire 1834–1838**; **the
  Federalists never die on schedule and never become Whigs** (they stay the second
  party). §B POST 5248, 5255, 5879, 5669–5680.
- **Territory acquisition GATES content:** bills/draftees/era-events for un-owned
  land are *invalid* (Indian Removal gated behind owning LA; Louisiana-born pols not
  playable until LA owned; MO/MI/FL residency gated until admitted). ⇒ **An "era" is
  a fixed band of available bills/events/draftees + a state-bias table, advanced by
  half-term, NOT by year-gating.** §B POST 5082, 5140, 5828–5837.

**Core delta:** the code uses `isDraftYear`/`isPresidentialYear` (`year % 4`) and
`isElectionYear` (`year % 2`); the `Era` enum is 4 fixed values. The design gates
content on game state + territory ownership and advances eras at game-state
boundaries. **This is the central architecture question for the build.** It
reconciles with / refines the era-keystone era-boundary work and contradicts the
shipped year-driven era model. (Game-context delta-row ★ + #92.)

### Internal era names vs the shipped enum (finer-grained than the build)
The forum runs **finer-grained eras** than the 4-value `Era` enum:

| Forum-internal era | Year band (this campaign) | Maps to shipped `Era` |
|---|---|---|
| (Era of Federalism — pre-playtest) | <1800 | `federalism` |
| **Era of Republicanism / "Era of Democracy"** (GM uses both, §B POST 4798) | 1800–1820 / 1820–1840 | (sub-bands of) `nationalism` |
| **Era of Manifest Destiny** | 1840–1856 | `nationalism` |
| **Era of Nationalism** (= antebellum/Civil-War/Reconstruction) | 1856–1868 | **`nationalism`** (confirmed — §C-9, POST 9717, 9425) |

The internal era names (Republicanism → Democracy → Manifest Destiny → Nationalism)
are **sub-bands of the shipped `nationalism` enum**. "Era of Nationalism" = the
antebellum/Civil-War era = the shipped `nationalism` value (reconciles with the
1856 scenario booting into `nationalism`). The Republicanism/Democracy/Manifest-
Destiny bands have **no shipped enum representation at all.** §A open-Q 1; §C-9.

---

## §1. The early-republic era arc (1800–1856) — the GAP-FILL

### The 1800 scenario boot — "mid-government continuation"
The 1800 start is a **mid-government continuation boot** (like 1856, unlike 1772's
cold boot), seeded fresh from "1800 start data" — NOT a continuation of a prior
thread. **Extends the BootSheet / scenario-boot model** (game-context #86). §A POST
24, 80, 159.
- **Government pre-populated:** sitting Pres (Jefferson), VP (Aaron Burr), full
  Cabinet (Madison/Gallatin/Dearborn/R.Smith/Levi Lincoln…), Senior Admiral +
  Admiral, governors, a **6-member Supreme Court** (Marshall CJ + 5), Speaker
  (Macon), Senate PPT (Baldwin), sitting Reps/Senators. Some seats start VACANT and
  are appointment-filled in setup. §A POST 80, 105, 159.
- **Still runs a 1800 ROOKIE DRAFT** (phase 2.1.1, snake order — the era's new
  25-yr-old class, NOT the whole pool). So pre-seeded officeholders **PLUS** a normal
  rookie draft. Draftees already holding "1800 start" offices keep them and **can't
  be career-tracked** ("unique to the first rookie draft," same as 1948's Lloyd
  Bentsen). §A POST 50, 55, 80, 123.
- **★ NO faction leaders or party leaders at start** (chosen in setup 2.2.3/2.2.4
  *after* meta-passes). Resolved as intentional — leaders don't exist IRL so can't
  be predefined, and pols aren't faction-locked at draft. **Consequence: phase
  2.1.6 (Conversions) is SKIPPED turn 1.** (Matches the `pop` fresh-modern boot:
  no faction leaders at boot — game-context #86.) §A POST 82, 90–96.
- **GM hand-seeded the career track** to patch the later-start "you inherit a
  generation of 1-skill pols" hole: **7 pols/faction pre-placed (1/track), spread
  across cohorts** (1@16yr, 2@12, 2@8, 2@4). A recognized **design hole for later-
  start scenarios** + an explicit BUILD ASK (§4). §A POST 6, 15–19.
- **First-cabinet special rule:** normal cabinet-retention rules suspended for the
  very first appointment so Jefferson could retain any/all seeded cabinet. §A POST 159.

### Era: REPUBLICANISM (1800–1820) — Jeffersonian / Good Feelings
- **Party frame INVERTED vs later eras:** **BLUE = Democratic-Republicans
  (dominant)**, **RED = Federalists (doomed minority)**. Era flavor = British
  maritime aggression/impressment vs France. §A POST 1, 8.
- **★ Explicit "Red unwinnable 1800–1840" balance hole:** static map biases make a
  Federalist win nearly impossible ("even New York prefers the D-R until the era
  changes"). By 1804 Blue held House **142–0**; Jefferson won 1808 **179-0** and
  1816 **197-15** even with Red at +3 party-pref +1 economy. Players quit over it.
  Root cause = **static, non-policy-reactive era biases** deferred to "AMPU 2.0"
  (§4 DH). §A POST 22, 350, 720–724, 743, 747, 2444–2457.
- **Draft-ideology profile:** Mod/Cons/Trad/Lib-heavy; **"Progressives don't really
  exist in this era."** §A POST 1659.
- **Era-event spine (event-STARVED — droughts filled by 5 random anytime events):**
  ACS Founds Liberia ("Liberia now a US Possession"), NJ Abolishes Slavery (RW
  Activists +1 — inverted sign), South-American/Spanish-Empire independence wave
  (Monroe-Doctrine undercurrent), **"Good Feelings"** (the literal Era-of-Good-
  Feelings engine event: +meters, Party Pref +2 Blue, every ideology +1 Blue),
  Second Great Awakening (Theocrats +1), Populist Movement, Star-Spangled Banner,
  Napoleonic-Wars-end (alt-history: Napoleon WINS, invades England). EV-shifting
  events stash deltas for the next census, owned states only (PA Canals +5 EV; NYC
  +4 EV). **Trait-gated AUTO-fired branch** (NEW pattern): "Seminole's Crossing
  Border" → Response C automatic if a Controversial/Impulsive General exists. §A
  POST 198–205, 477, 871, 1119, 1713, 2668, 2918.
- **Finite era SCOTUS docket (only 4 cases, burns out fast):** McCulloch (aye),
  **Cohens v. Virginia (TIE → randomized → ahistorical Nay → state-law supremacy
  → the substrate for the whole slavery design**, §2), Dartmouth (aye). §A POST
  231, 530.
- **War engine fully exposed** (batch-1 had no active war): Chesapeake–Leopard →
  War of 1812 + Invasion of Canada (both WON ~1812–14) **but the Treaty-of-Ghent
  implementation roll FAILED → Canada NOT annexed**; **Barbary War LOST** across two
  half-terms. **★ Treaty must be IMPLEMENTED separately — you can WIN a war but fail
  to claim territory.** (Concrete spec of the generic cross-era war system —
  game-context #45/#56.) §A POST 1114, 1188, 1568–1597, 2151, 2744.
- **Foreign powers = era-specific 4: UK / France / Spain / Prussia** (NO China/
  Russia yet — confirms the power roster is era-dependent; game-context #25b/#67). §A POST 1121.

### Era: DEMOCRACY (1820–1840) — Jacksonian / Second Party System onset
- Begins at 1820 with a **fresh state-bias table** (wholesale swap, separate from
  the decennial census). §A POST 3167, 3174, 2450.
- **Defining issues (verbatim era-brief, §A POST 3174):** universal white-male
  suffrage, the national bank (**Bank War**), federal internal improvements, the
  tariff, and slavery.
- **Second Bank of the US** created as a Crisis Bill (recreates the President-of-
  US-Bank cabinet office; **20-yr recharter clock**; office UNREMOVABLE while the
  Bank exists). Jefferson's exec action "Weaken US Bank by Removing Deposits → State
  Banks" = **the Bank War in miniature**; the Bank had **lapsed** by the era
  boundary (next President didn't reverse). §A POST 954, 2123, 2161, 2350, 3175.
- Red factions begin renaming toward the Second Party System (Anti-Masons, Free
  Soil D-R, National Federalists, proto-Whig Clay Federalists). §A POST 3174, 3264–3269.

### Era: MANIFEST DESTINY (1840–1856)
- **Issue menu (canonical brief, §B POST 6203):** eye to the Pacific / dominate
  Western Hemisphere; **Texas already peacefully purchased**; clamor for more
  Mexican territory (→ possible war); **slavery "abolished" & cannot expand to new
  territories but still exists in the South**; tariff contention + **SC secession
  threat** → births the Union-vs-secession-legality debate; new nativism axis from
  Catholic (Irish/German) immigration.
- **★ PARTY LINEAGE DIVERGENCE — Federalist → National Republican, NOT Whigs.** A
  *different lineage* than real history / `house-divided` / Tyler's parallel
  playtest (which IS still Whigs vs Democrats). Players joked about wanting the
  Whig party; GM: "we need the National Republican party first." The **"Whig"
  nickname is unearnable in this timeline.** §B POST 6121–6123, 6344, 6500, 6521.
- Era-events catalog: Erie Canal Completed (+6 NY EV), **Plot to Provoke Mexico
  into War** (set up but Mexico didn't fire → no war), Gold on Cherokee Lands,
  Congress of Panama, Uncle Tom's Cabin, **Cotton Plantations Grow (DomStab
  IMPROVES — slavery entrenchment stabilizes the South)**, Irish Potato Famine,
  Clayton-Bulwer, Telegraph, 1837–38 Rebellions (response-gated by meter state).
  §B POST 5248, 5798, 5990, 6344–6347, 6650.

### ★ Era-boundary machinery (NEW — first explicit capture, §B POST 6187/6201/6203)
At the **"End of Historical Era" phase**:
1. **Faction-trade window** — players trade factions by mutual agreement; **CPU
   factions auto-accept** trades.
2. **Point-banking formula:** most-points faction **+5**; most-points-faction-of-
   the-OTHER-party **+3**; 2nd-most if same party as winner **+3**; ALL factions
   in the top-scoring party **+3**; **penalty −1** if the winning party/faction has
   an allied faction finishing last/next-to-last.
3. **Points reset** — all non-banked points reset to 0; only banked points carry to
   end-game. (GM forgot once + fixed it, §B POST 6421.)
4. **New-era issue brief** posted (the canonical issue-menu).
5. **Draft order for the new era = points from the JUST-COMPLETED era only** (not
   cumulative). §B POST 6201.
6. **Per-era state-bias table** — each era ships a wholesale new bias/census table.

(Refines game-context #68 per-era point-banking + the BootSheet/era-content rows.
This is the concrete capture of the per-era boundary the prior threads inferred.)

---

## §2. New early-republic SUBSYSTEMS

### A. The 12th-Amendment BEFORE/AFTER state machine (era-specific, absent from later threads)
A genuine era-specific state machine; all later threads start post-12A. §A POST
222, 264, 276, 502, 638.
- **PRE-12A:** **no conventions**; many states use **legislature-chosen presidential
  electors** — for those, the EV winner = decided by **who holds Gov/Sen/Rep** in
  the state (majority party; Gov-party breaks ties), **NOT by PV+dice** (analogous
  to the `senatePre17` flag — call it `electorsByLegislature`). Per-state, phases
  out by amendment; the GM recomputes EV *after* the popular tally for legislature
  states. In 1804: CT/GA/MA/NJ/NY/SC/VT legislature-decided; rest popular-vote. §A
  POST 691, 708, 2468.
- **Passing the in-game "President Elections by Party Tickets Amendment" (= 12A)**
  flips the game into **party-ticket + convention** mode and **adds the separate
  VP-on-the-ticket** rule. "Separate VP Election" and **"Send VP to Shore Up
  Support" are gated behind 12A being active** (independently confirmed by `pop`
  POST 951 → game-context #91). §A POST 264, 276, 325, 1932.
- **★ First fully-recorded FIRST convention** (post-12A, observed live; the most
  detailed first-convention record for ANY era — resolves batch-1 open-Q #10).
  Captured verbatim: host-Gov sets delegate-class distribution (5 weight tiers);
  Major/Minor/Favorite-Son candidate types; multi-ballot + unit rule + majority-to-
  win; the inter-ballot action library (Force Rules Change, Presidential Promise,
  Drop-out+Endorse, Whip, appeals to Integrity/Credibility/Will-of-People/Lies);
  VP-impact scoring checklist; platform 3-check (5 planks). **★ An Iron-Fist PL's
  vote is the ONLY one that counts on rules changes** ("Jefferson rules supreme").
  Keynote "did not officially exist until the Era of Progressivism" (era-gated
  feature this early era partly lacks). (Corroborates game-context #13/#14/#15;
  these conventions are 5-7-era confirmed.) §A POST 502, 638, 1832–1924, 2356–3107.
- **Nationwide Surge in Legalized Popular Vote era-event** (Manifest Destiny, §B
  POST 6650): **every state except SC** switches to popular-vote electors —
  **RETIRES the early-era legislature-chooses-electors mechanic** (only SC keeps
  it). +Reformists/LW-Pop/RW-Pop; Honest Gov +1. (The end-state of the 12A state
  machine.)

### B. Slavery-as-state-flag + Cohens-v-Virginia Amendment-only-abolition (major NEW model)
- **Slavery ON/OFF is a persistent state-level policy flag tied to the Plantation
  industry.** A successful abolition bill turns OFF Plantation nationwide and
  permanently deactivates all slavery legislation; abolition "counts" only when NO
  state has it active. Extends batch-1's state-policy-flag pattern (Jim Crow/poll-
  tax) backward — the gap-era flag is `slavery`/Plantation. §A POST 2161, 2180–2182;
  §B POST 3363, 3366.
- **★ The ahistorical `Cohens v. Virginia` precedent blocks legislative abolition.**
  This timeline's Marshall held **federal law does NOT supersede existing state
  law** → **slavery in a slave state can ONLY be ended by a constitutional Amendment**
  (or a per-state Gov action). Net: slavery abolished only where it already didn't
  exist + **all new states/territories enter free**; existing slave states keep it;
  spread halted. **This is the engine substrate for the whole sectional design** —
  and there is **no mechanism to reverse an ahistorical SCOTUS ruling via amendment**
  (a cross-thread AMPU-2 need). §A POST 2180–2182, 2675; §B POST 4329, 5567, 5820.
- **Free/Slave-state balance is a tracked tally** driving meter/enthusiasm/election
  effects (the sectional-balance crisis engine — game-context #59). §A POST 250, 940.

### C. Statehood-by-bill + unorganized-territory gating
- **Statehood-by-bill** mints a state mid-game (distinct from 1772's `admitState`/
  era-graph): Ohio, Mississippi (11th slave → DomStab −2), Alabama, Indiana, Maine
  (split from MA), etc. A new state then needs a Gov election + Class I/II/III
  Senator appointments; new-state bias can init +1 Red if its enabling vote was
  sabotaged. (Confirms game-context #43.) §A POST 250, 308, 332, 889, 2117, 2161–2167.
- **★ Unorganized-territory gating (NEW):** LA-Purchase land + Michigan ("owned but
  never organized into a territory") have pols who are **undraftable AND unrelocatable
  until an organizing bill passes**. **Territory→statehood is two steps** (org →
  state); exceptions skip the territory stage (ME/WV/TX-from-Republic/VT/CA). GM
  admits the draft pool **wrongly includes** pols from unorganized territories (a
  dataset/territory-gating bug). **Refines game-context #43** (territory must be
  organized before pols are draftable/relocatable there). §A POST 1999–2002, 1393,
  3350; §B POST 5082, 5140, 5828–5837; §C POST 9127.

### D. Second Bank recharter clock + Bank War exec action
See §1 (Democracy era). The **Bank is a toggleable, cabinet-seat-granting
institution with a 20-yr recharter clock**; "Weaken US Bank by Removing Deposits"
is the Bank-War exec action. (NEW institutional/economic row.) §A POST 954, 2123,
2161, 2350, 3175.

### E. Amendments mutate core rules mid-game (the "Sexenio" experiment)
Amendments pass Congress → **2/3 of state govs ratify** (an earlier amendment
lowered it from 3/4); take effect the **next half-term**; govs vote per faction
except **Puritan/Integrity overrides**. §B POST 5352, 5579, 6411.
- **★ Three amendments ratified 1834 mutate the Presidency into a Mexico-style
  single 6-year term ("Sexenio"):** 16th = Universal White Male Suffrage; 17th =
  One-Term Limit; 18th = Six-Year Presidential Term → produced a **6-yr single-term
  Presidency** in play (25th-Amendment-style succession: a VP elevated past the
  half-way point can't run). Later context shows terms back to normal — i.e.
  **player-passed amendments mutating core rules mid-game** (term length, one-term
  limit, suffrage, tariff cadence). **No grandfather clause** modeled (player
  flagged the real 22nd exempts the incumbent; GM: "my rules" — design hole). §B POST
  5484–5595, 6095, 6134, 6431. (Refines game-context #39/#64 amendments-as-state +
  #16 amendments-toggle-capabilities.)

### F. The ideology chart becomes a CIRCLE (mid-era rule change, §B POST 5717)
**LW Populist ↔ RW Populist shifts are now allowed at 25% base** — the two ends of
the 7-point scale become **adjacent**. Conversions extend to **adjacent** ideologies
too (same-party other-faction pols of same OR adjacent ideology; was same-only
earlier, §B POST 5730). **This directly contradicts a linear `Ideology` enum — the
design wraps the scale into a ring.** (Refines game-context's 7-point ideology
model + conversion adjacency #76.) §B POST 5717, 5730.

### G. The 1800 mid-government boot (extends the BootSheet model)
See §1. The 1800 boot is the **earliest mid-government continuation boot** captured;
it extends the BootSheet/scenario-boot model (game-context #86) with the GM-hand-
seeded career track patching the later-start 1-skill-pol hole and the no-leaders-at-
boot baseline. §A POST 6, 24, 80, 82, 159.

---

## §3. Antebellum + alt-Civil-War + Reconstruction (1846–1868) — the House-Divided DIVERGENCE

`house-divided` (the 1856 native run) is a *separate* playthrough; this 1800-
campaign's war is mechanically and historically divergent — **independent
corroboration + divergent outcomes.** §C-1.

### The alt-Civil-War (divergence from House Divided)
- **★ Fires ~15 yrs EARLY (~1846), and NOT via a secession convention.** Secession
  is triggered by the era-event **"Southern States form the CSA"** firing off
  **Domestic Stability = 1** (the meter floor) — not a John Brown / Hartford /
  Nullification convention event. GM flags this CSA-formation event as the **one**
  CW trigger that does NOT spawn a secession-convention gov-action (likely a missing
  event field). §C POST 6884, 6905, 6909–6914.
- **★ The sitting President defected to lead the CSA — "Oaths to Two Masters."** Pres
  James Barbour resigned, joined VA's secession, and was chosen **President of the
  Confederacy** (achievement: *"have a president from your faction secede and become
  president of a revolting country — CSA, Hartford Convention, or the Northern
  Secession"*). **Confirms the engine models Hartford-Convention + Northern-Secession
  CW VARIANTS, not just a Southern one.** §C POST 6934, 6943.
- **A VP assassinated his own President and defected to the CSA** — pivotal
  ahistorical event. **ALL border states seceded** (MO/KY/MD/DE pulled in by a later
  "Secession Fervor Reaching Border States" event). §C POST 8002, 8142, 7256.
- **Theaters: East + West + a UK-Intervention theater.** A 3rd "UK Intervention in
  the Civil War" theater spawned from a blundered "UK Considering Recognition of CSA"
  event; UK went **Hostile**, propping up the insurgency + triggering "Enemy Takes
  Defenseless US" risk. §C POST 6909, 7253–7256, 7695.
- **Union won the conventional war but a GUERRILLA 4th stage kept it unresolved
  across the era boundary.** CSA rolled to not concede (23/25) → "ACW: Guerilla War";
  GM had **no chart rule** and improvised ("making this up as I go"). Ran ~1848→1858,
  won on a low-odds end-war roll in 1858. §C POST 7404, 7418, 8652.
- **1850 census INVERTED the sectional realignment → "red north, blue south"** —
  opposite polarity to OTL; with the South gone, "Blue has zero support in this era."
  §C POST 7916, 7969, 8753.
- The Confederacy ran its **own internal president & elections** during the war (on
  its 3rd/4th CSA president by war's end). **Appomattox Agreement** (war won): Party
  Pref +4 Blue, DomStab/EconStab +1, Pres gains a **permanent +1 in future
  elections**; a blunder on the implementation roll does NOT undo the treaty (only
  land-acquisition events require successful implementation). §C POST 8542–8550, 8654, 8661.
- **CW VARIANTS** = the row to refine (game-context #56 Civil War engine): early-
  trigger off DomStab=1; President-defects-to-CSA; Hartford/Northern-secession; UK
  intervention theater; guerrilla 4th stage. Battle %-engine multi-confirmed (§C-2).

### Compromise of 1850 compound + the sectional-crisis subsystems
- **Compromise of 1850 era-event** (President-decided A/B/C, §B POST 6650): a
  **compound mechanic regardless of choice** — all slavery/free/slave legislation
  worth **DOUBLE** next term; Speaker + Sen Maj Ldr +1,000 pts each if slave/free
  legislation ends balanced; **DomStab reset to Neutral** (if compromise pursued);
  **all non-slavery domestic proposals INACTIVE that legis phase**; +Moderates,
  Party Pref +1 Red. (The era-coded double-points pattern of game-context #87.)
- **★ "Call for New Constitutional Convention" — 20-state crisis subsystem** (§B POST
  6356, 6360): a Gov action available during a DomStab crisis; needs **20 states to
  call**; the call **persists until 20 reached OR DomStab improves above level 1**.
  A separate "New Constitutional Convention Amendment" bill needs 20 states (2/3) to
  ratify. (NEW crisis subsystem.)
- **★ DomStab-as-Civil-War / game-ender gate:** at low DomStab the GM warns it's
  "potential Civil War or game-ender" — **DomStab is the secession/CW trigger meter**
  for this era. §B POST 6348–6351.

### The full Reconstruction subsystem (the richest find of §C; §3.0.32 + GM-authored)
Almost certainly **absent from the shipped build** (CLAUDE.md lists only 1772-era
war/CC/Convention systems). §C-3.
- **Auto-trigger on Union victory:** defeated South → state bias moves **Red +2**;
  Northern-Reconstruction mirror exists. Seceded states **won't seat a pol who had
  seceded** during Reconstruction.
- **Military governors, president-appointed, SAME-PARTY ONLY** (stricter than normal
  vacancy rules, which allow the opposite party); if no valid same-party pol, a pol
  is **generated**. Re-appointed every 2 yrs. "Create Military Districts to establish
  Martial Law" auto-activates/deactivates with readmission. §C POST 8673–8677, 8910.
- **Readmission = REPEALING state bills, not passing them** (GM-authored workaround):
  the named "X Reconstruction" bills are **state-readmission bills**; you *repeal*
  them to readmit. "In Reconstruction" still counts as being in the Union for later
  elections. §C POST 8910, 8737, 8893.
- **★ TWO competing readmission-plan bills:**
  - **Lenient 10% Loyalty plan** → Reconstruction ends automatically at end of half-
    term, all states readmitted, **no bias change**.
  - **Strict Majority Loyalty w/ Ironclad Oath plan** → readmission state-by-state;
    once readmitted, bias moves **+2 toward Red for 4 cycles (8 yrs)**. §C POST 9374, 9396.
- **FOUR Confederate-citizenship options:** Restore Citizenship / Strip leaders &
  pardon others / **Mass Trials & Punishments** (what passed — removes non-Nationalist
  seceded pols) / Strip Citizenship of Known Confederates (the only one repealable).
  Net = **red-lined ex-Confederate pols** until citizenship is legislatively
  restored. §C POST 8910, 8957.
- **Escalating 4 / 8 / 10-yr penalties** (lingering, "stop dragging it out" pressure):
  meter-drop chances scaling by #states-in-Recon; CPU factions vote to end at
  50%/75%; at **10+ yrs a 25% chance the Civil War RENEWS** (whole Upper+Deep South
  secedes again, all battles Difficult). §C POST 8911, 9842.
- **★ DESIGN PHILOSOPHY — hard-coded Red Southern bias even in a BLUE-won alt-
  history.** A Blue president won this war, yet Reconstruction still forces Red +2 /
  Blue "zero support" — players repeatedly call it **"historical sim, not alt-
  history"** (Reconstruction bias is keyed to *real history*, not the campaign's
  outcome). §C POST 8659, 8662, 8753.
- **★★ KEY HOLE — the Strict/Ironclad plan can essentially NEVER pass with CPU
  factions → SOLO RECONSTRUCTION IS UNRESOLVABLE.** GM, **POST 9170 (verified):**
  *"the CPU factions will never vote for that bill… including red, only 3 factions
  would ever consider voting for it. A real problem when it is the historical plan
  passed and **in a single player game it basically can never pass.**"* GM names this
  as a **primary driver of the in-progress CW/Reconstruction rules rewrite.** The
  Lenient plan was considered un-passable post-guerrilla-war by the human side too
  (POST 9166). **Solo-play blocker for ANY antebellum/CW scenario — flag prominently.**
- **Mass-readmission finale (~1868):** 14 states repealed at once → "All states
  readmitted!" Rev/Bud +6, DomStab +1, Honest Gov +3. **The big late-game meter
  relief came from ENDING Reconstruction.** §C POST 9871–9898.
- **Black politicians** added to the draft pool at the 1856 boundary but **barred
  from office until enfranchised**; first Black officeholders in-game = Frederick
  Douglass (Gov of NY, 1866) + Hiram Revels (Senator, MS). Post-abolition draft was
  **heavily Red-weighted** (~100 red vs ~40 blue). §C POST 8463, 8999, 9117, 9699–9700.

(Refines game-context #57 Reconstruction readmission subsystem; the Lenient-10% vs
Strict-Ironclad plans, red-lined ex-Confederates, 25% renewal, and the hard-coded
Red+2 corroborate `hd`/`drums`; **the CPU-never-passes-Ironclad solo blocker is the
new prominent flag.**)

### Expansion (differs from House Divided)
- **War for Florida vs Spain** → Treaty of St Augustine, FL acquired (the US never
  got FL earlier in this timeline). §C POST 6883, 9330, 9411–9414.
- **Cuba = 36th state** via "Cuban Statehood" bill, in a **new "Caribbean" region**
  (PR, Santo Domingo, Bahamas, Antilles, Haiti); Cuba first bought via a "Purchase
  Cuba" event. §C POST 8556–8557, 9396, 9723.
- **Mexican Cession (NM + AZ) PURCHASE** bill → "New Mexican Territory"; later a
  Gadsden Purchase event. **California still owned by Mexico throughout.** §C POST
  9396, 9607, 9720.
- **Texas = 4 states (W/E/N/S Texas)** — each separately reconstructed/readmitted
  (likely a permanent map feature). **Improvised Indian wars** (Red Cloud's War,
  Apache Wars) ran as "Operations" because they're **missing from the war chart**.
  §C POST 6044, 8944, 9611, 9678, 9833, 9906.
- **Territory-before-statehood rule** (§C POST 9127): except the 13 originals +
  VT/TX/CA/Deseret/Mexican-Cession/Quebec, every state must pass Territory status
  first.

### Coup-at-low-meters + meters-driven game-over
- **Meters-driven game-over is REAL.** When meters sit at the worst level the game
  can END on a per-event-phase roll (~20%). **Game-end triggers enumerated** (§C POST
  7274): Autocratic Coup (HonestGov=1, scaled by an "Era of Democracy" meter, 0%
  until 1868), Standard Coup (DomStab≤2 AND EconStab≤2 → 10%), Attempted Coup, Economic
  Collapse (20% if EconStab=1), Enemy Takes Defenseless US (MilPrep=1 AND a foreign
  power < Neutral). §C POST 7275, 7836–7838, 9853.
- **Coup-at-low-meters mechanic (3.0.2)** — two "Standard Coup" anytime-events fired;
  opposition PL chooses Move On With Coup / Condemn. But coups are **effectively dead
  mid/late game** — "Our military is at max prep so a coup is damned near impossible"
  (MilPrep + foreign relations trivially maxed with a decent cabinet). **Balance
  note.** §C POST 9317, 9322, 9593.

(Links to the APOCALYPSE endgame, game-context #88, as another meter-driven end
condition — this is the early-era's enumerated meter-driven game-over set.)

---

## §4. Design holes + the forum-drives-build evidence

### NEW design holes (candidates for DH-29..)
1. **★ Era-events-predating-start-DROPPED (BUG-1 class).** GM-confirmed data bug:
   an era event whose trigger window predates the scenario's start year is
   **silently unavailable**. Verbatim (§A POST 2668): *"the Louisiana Purchase… is
   listed under the previous Era of Federalism. And since we started in 1800 it
   wasn't included… So I have added it in now in 1816."* LA Purchase hand-added →
   fired but blundered → the US never acquired Louisiana for decades. **Same class
   as BUG-1** (era events don't deactivate/activate correctly for non-1772/1856
   start years) — independent live confirmation; merge or extend BUG-1.
2. **★ Event-scheduler has a MAX but no MIN floor** (§A POST 2919–2932). Events are
   scaled by a fixed number per era (over a 20-yr era a 25%-event ≈94% cumulative).
   "the limit is a max not a min… which isn't what we discussed." **Agreed fix:
   minimum = 20% of the era's max (round down)**; if still none fire, fall back to 5
   generic anytime events. A rejected alt (hard year-windows) was declined because
   *"events not happening every playthrough has been explicitly stated to be how the
   game operates"* (load-bearing for alt-history). (NEW DH.)
3. **★ Procedure-subtype bills BYPASS the veto, but the engine MIS-ROUTES them to
   the President** (§A POST 2342–2348). Buried-in-rules `subtype: procedure` bills
   (Institute Filibuster, create-whip-offices) should NOT go to the President. (NEW
   DH; corroborates `hd` DH-8-class procedure routing.)
4. **★ SCOTUS can VOID a STATE → "a state cannot be ruled unconstitutional."** The
   Maine episode: "Pickens v. Maine's Existence" / "Pickens v. Maine" passed 5-1 →
   Maine statehood voided AFTER a census counted it. Consensus fix: add a rule that a
   state cannot be ruled unconstitutional (territory can be revoked; secession is the
   only un-making). §A POST 2180–2182 (principle); §B POST 3632, 3646–3652. (NEW DH.)
5. **★ Impeachment rules "outdated, don't work."** The mini-flow runs but the
   canonical rules are flagged outdated/non-functional and improvised (an Integrity
   justice got accused of bribery — nonsensical; only resignation avoids the
   DomStab/Honest-Gov drop). §A POST 465–474; §B POST 3594, 3620. (NEW DH.)
6. **★ Static era-biases are unfixable ("AMPU 2.0").** Players want **policy-reactive
   biases** (abolish slavery → South swings Red); GM + Willthescout7 confirm dynamic
   biases are "too complicated / not part of the AMPU vision… maybe AMPU 2.0." The
   single most-repeated complaint of the whole campaign; the root of the Red-
   unwinnable hole. §A POST 2641, 2711–2713, 1328–1335. (NEW DH.)
7. **★ Reconstruction Strict/Ironclad plan can NEVER pass with CPU → solo
   unresolvable** (§C POST 9170, verified). The headline solo-play blocker — drove
   the in-progress CW/Reconstruction rules rewrite. (NEW DH — flag prominently;
   refines game-context #57.)
8. **★ Thin early-era presidential agency ("this era is a bore").** In the pre-
   primary eras the President's only exec actions are flavor tours; the modern
   toolkit (primaries, rich exec actions) isn't unlocked yet → feeds the "Blue auto-
   wins, governing is dull" sentiment. §A POST 2756–2760, 2930, 3110. (NEW DH.)

### Carried/corroborated holes (already in the gap log — strengthened, not new)
- **Veto-override POINTS rule reads BACKWARDS** ("Speaker & Sen Maj Ldr lose 100pts
  for voting AGAINST a bill; Pres gains 100" — flagged nonsensical). §A POST 327,
  328, 2333. (Corroborates the veto-override row #82.)
- **>2-term presidential malus intended-but-UNWRITTEN** (Jefferson served five terms
  with no penalty). §A POST 1318–1321, 1938–1955.
- **Amendment ratification = one-shot** (no open window; fail → re-propose). §A POST
  2957–2959. (Corroborates #39/#64.)
- **Ambassador-to-enemy-nation rule self-contradictory** (blocked treaty
  implementation). §A POST 1487–1503. (Corroborates `hd` DH-12-class.)
- **CPU race/ethnicity appointment penalty** (Hispanic pol needs +2 ability; FL pols
  Spanish-citizen-ineligible until acquired). §B POST 6611, 6617. (Likely intentional
  flavor; flag for the CPU spec.)
- **Relocation cap DECIDED-AS-UNLIMITED here** (Ted declined a cap; only brake =
  Carpetbagger). **Contradicts `hd`'s cap-of-4** — the build must pick a stance.
  *"Anthony was programming it last week and I told him there was no restriction"*
  (§B POST 6240–6245). (Sharpens game-context #38 — note the cross-thread conflict.)
- **Realignment/era-party-formation triggers UNMEETABLE** (GM fired "National
  Republicans Formed" despite failing requirements — "too stringent to ever fire").
  **60% realignment flip too high + no leader/President exemption** (sitting Pres +
  a SCOTUS Justice flipped; ~80 pols in one phase). §B POST 6344, 6497–6522.
  (Corroborates the deterministic-rename-trigger need, #40.)
- **Sec of State trivially maxes foreign relations; SCOTUS rulings irreversible;
  legislation/territory options must be filtered by owned land; "can't propose a bill
  that hurts your own cards" unenforced; Master-Kingmaker bonus scope GM-disputed.**
  §B POST 6004–6006, 5082, 6372–6377, 6262–6289. (All corroborate existing rows /
  `drums` DH cluster.)

### The forum-drives-build evidence (explicit build-spec calls to the coder)
- **The single-player build is coded in parallel by "Anthony" per Matt/Ted/Tyler's
  rules calls** — direct, dated evidence the forum is the design source of truth.
  Explicit build-spec hand-offs: relocation cap ("told him there was no
  restriction," §B POST 6240); career-track auto-seeding for later starts (formally
  requested, vcczar/Ted to-do, §A POST 15–19); procedure-bill routing; the event-
  scheduler min-floor fix. **"Ted" (MrPotatoTed) does the computer build; "Anthony"
  is the coder; "V"/vcczar owns the engine ruleset.** §A POST 15, 17, 19, 415; §B POST
  6240, 6278.
- **The build's value prop is automating the bookkeeping:** a player edited the
  shared election spreadsheet → GM paused & locked it; the GM runs two playtests at
  once and posts in the wrong thread. §B POST 4127.

---

## §5. Corroborations (terse — the core loop matches all 6 prior threads)
The full numbered phase taxonomy (2.1.1 Draft → 2.1.8 Personalities → 2.2.x
Leadership → 2.3.1 Cabinet → 2.4.1–2.4.3 Death/Anytime/Era → 2.5.x Lingering/Gov/
SCOTUS → 2.6.x legislation → 2.7.x diplomacy/war → 2.8.x sign/veto/override/exec →
2.9.x conventions/elections → 2.10 retirements) runs exactly as documented;
advances **2 yrs per pass**. Skills 0–5 + Command + traits[] + 7-pt ideology;
brokered conventions (unit rule, momentum, inter-ballot menu, VP-impact + platform
3-check); the meter bank + enthusiasm/Party-Pref engine; career tracks (graduate
8/12/16/20 yrs, forced-remove at 20); kingmakers/protégés; cabinet 60%-Senate
confirm + regional/diversity scoring; filibuster (no cloture until legislated);
amendments-by-Govs; faithless electors; **all behave as documented — no
contradictions.** The novelty is purely the **era CONTENT + the boot model + the
content-band architecture** above. §A/§B/§C "corroboration" sections.

---

## §6. Notable figures (draft-class authoring provenance)
- **Marquee kits:** Jefferson (Charismatic/Likable/Teflon; as PL 5 Command, Iron
  Fist + Manipulative, Domestic Warrior, Naïve Strategist; hidden "Horrifically Bad
  Luck"); Andrew Jackson (Iron Fist + Controversial → banned from cabinet after a
  failed General confirmation); Hamilton (Crisis Admin; **led two factions
  simultaneously** — leader-uniqueness not enforced, §A POST 1014); John Marshall
  (starts obscure, as Red PL ends ≥1 in all 6 skills); Sam Adams (Puritan/Passive/
  Kingmaker, retired at 98). §A POST 4, 31, 51–52, 136, 145–157.
- **Draft-class fidelity confirmed** (the 18.5k dataset surfaces the right cohort by
  draft-year): 1804 (Clay, Taney, Story); 1808 (Webster, Calhoun, Van Buren); 1820
  (Polk, Houston, Thaddeus Stevens); 1824/1828/1832 (Pierce, R.E. Lee); **1836
  (Lincoln, Chase, Jefferson Davis, A. Johnson)**; 1840 (Stephen A. Douglas,
  Stanton); 1844 (**Frederick Douglass + Karl Marx as draftable career-trackers**).
  §A POST 735, 1348; §B POST 3871, 5140, 6764–6779.
- **One-party convergence quirk:** both PLs Conservative-ideology sharing the
  Conservative card via Iron Fist → **all 10 factions briefly became "Conservative"**
  ("Era of Republicanism in more ways than one"). §A POST 162, 165, 442.

---

## §7. Open questions (for the human / roadmap)
1. **Does the shipped build model a 1800 start at all** (only 1772/1788/1856 are
   designed/shipped)? The 1800 boot is a distinct mid-government scenario.
2. **Era enum granularity:** the build has 4 `Era` values but the forum runs
   Republicanism/Democracy/Manifest-Destiny as sub-bands of `nationalism`. Are these
   distinct enum values, sub-phases, or just content-band markers on a game-state
   gate?
3. **Era advancement:** game-state/territory triggers (the design) vs the shipped
   `year % 4` predicates — the central architecture question. What is the game-state
   condition that advances each era band?
4. **Cohens-v-Virginia state-supremacy precedent:** how is a persistent ahistorical-
   SCOTUS rule-modifier on legislation represented (the substrate for slavery-only-
   by-amendment)? And is there ANY mechanism to reverse an ahistorical ruling?
5. **Relocation cap conflict:** this thread says UNLIMITED (Ted's call); `hd` says 4;
   shipped is 5. Which is canonical?
6. **12A state machine:** is `electorsByLegislature` a per-state flag (like
   `senatePre17`), and does the "Party-Ticket Amendment" unlock conventions + VP-on-
   ticket as a single toggle?
7. **Bank recharter clock + Bank-War exec action:** is the 20-yr clock + the
   removing-deposits deactivation modeled, with the President-of-US-Bank
   unremovable-while-Bank-exists rule?
8. **Ideology-as-circle:** does the build wrap the 7-point scale (LWPop↔RWPop
   adjacency) for shifts + conversions, or treat `Ideology` as linear?
9. **Does the LA Purchase ever succeed?** Confirmed: **yes, calendar 1834** (§B) —
   resolves §A open-Q 10. The SCOTUS-voids-Maine episode confirmed at §B POST 3632.
10. **Event-scheduler min-floor:** is "20% of the era's max" the adopted fix (with
    spill-to-5-anytime-events)?
