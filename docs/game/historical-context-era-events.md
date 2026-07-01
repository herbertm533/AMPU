# AMPU — Historical Context: the Era-Event Corpus (companion)

> **Companion to `historical-context.md`** — do not fold into the parent. This
> grounds the **authoritative 2,475-event era-event corpus** ("Era Evos
> Standardizing" sheet, tag `era-events`, source `b41ac9b1`) in real American
> history: era coverage/density, a fidelity spot-check with citations, the
> deliberate **future / alt-history** class, and how the corpus's `Requires`
> preconditions encode historical cause-and-effect. It states facts and flags
> divergences; it does not design mechanics.
>
> **What the corpus is.** 2,475 scripted era-events × 49 columns, spanning **16
> game eras** from the **Era of Independence (1772)** to the **Era of the
> Distant Future** (speculative, no calendar). Historic-Year values run **1772 →
> 2022** (n≈1,436 dated; the rest are `alt`/`n/a`). Each event = a real (or
> speculative) event + a Wikipedia link + a **President-response menu (A–F)**
> resolved by an **ability** (Admin unless stated) that shifts **meters** and
> **faction/office points**. Analysis: `docs/game/sources/era-events/analysis.md`;
> samples: `.../sample.md`; raw: `.../eraevos.csv`, `.../eventsbyhalfterm.csv`.
>
> **Confidence tags** (as in the parent): **[consensus]**, **[contested]**,
> **[inference]**.

---

## 1. Era coverage & density — does it track real eventfulness?

The corpus's **16 eras** are the game's internal era-band names, not calendar
gates (the parent §1 establishes eras are game-state content-bands). Crosswalk
to real history and the parent's sections, with the normalized event count and
the `EventsbyHalfTerm` pacing total (the two counts differ: the era-total column
counts **first-appearance** scripted events per half-term; the normalized count
is the deduped row count — treat both as density signals, not exact-equal):

| Game era | Real span (approx.) | Parent § | Norm. events | HalfTerm total | Density read |
|---|---|---|---|---|---|
| Era of Independence | 1772–1787 | §1 | 71 | 56 | Smallest historical era; ~15yr, pre-party, few offices — real "national politics" barely exists yet. **Density fits.** |
| Era of Federalism | 1788–1799 | §2 | 134 | 36 | New govt, Washington/Adams, Quasi-War, Jay Treaty. HalfTerm low (36) but norm-count high (134) — many events are *replayable/branching* (e.g. Louisiana Purchase lives here). |
| Era of Republicanism | 1800–1819 | §2.5 | 95 | 92 | Jeffersonian/Good-Feelings; Louisiana, embargo, War of 1812, Missouri. **Fits.** |
| Era of Democracy | 1820–1839 | §2.6 | 121 | 83 | Jacksonian 2nd party system; nullification, Bank War, Trail of Tears. **Fits.** |
| Era of Manifest Destiny | 1840–1855 | §2.6→§3 | 153 | 106 | Texas/Mexican War/1850/Kansas-Nebraska — a genuinely dense, high-stakes run-up to war. **Fits (top-tier).** |
| Era of Nationalism | 1856–1867 | §3 | 157 | 91 | Sectional crisis, secession, **Civil War**, early Reconstruction. **Fits (top-tier).** |
| Era of the Gilded Age | 1868–1891 | §4 | 252 | 173 | **3rd-densest.** Reconstruction→industrialization, labor wars, machine politics, closing frontier. Real history *is* eventful here; density fits, and the game has a shipped/played Gilded surface (§4). |
| Era of Progressivism | 1892–1915 | §5 | 238 | 153 | **4th-densest.** Populist surge, 1896 realignment, TR/Wilson reform, imperial wars, run-up to WWI. **Fits.** |
| Era of Normalcy | 1916–1927 | §5 | 145 | 101 | WWI, 1918 flu, suffrage, Prohibition, 1920s boom, Teapot Dome. **Fits.** |
| Era of Ideologies | 1928–1947 | §5→§6 | 283 | 125 | **2nd-densest.** Crash→Depression→New Deal→WWII — the single most consequential domestic+foreign stretch. **Fits (top-tier);** the `e45a756c` 1928 campaign plays this. |
| Era of the Nuclear Age | 1948–1971 | §6→§7 | **304** | 155 | **Densest.** Cold War, Korea, civil rights, Cuba, Vietnam, space race, Great Society. Fits; but see §5 note — foreign-military density here is very high. |
| Era of the Neocons | 1972–1999 | §7→§9 | 156 | (labeled "Ideologies" ×150 in HalfTerm) | Watergate→Reagan→end-of-Cold-War→Gingrich/Clinton. **Fits.** ⚠ **Naming artifact:** the HalfTerm tab mislabels the 1972-99 band as a *second* "Era of the Ideologies" (150) — reconcile to "Neocons" on ingest. |
| Era of Terror | 2000–2011 | §10 | 120 | 50 | 9/11, Iraq/Afghanistan, 2008 crash. Norm-count (120) >> HalfTerm (50) → heavy branching/foreign-military. **Fits.** |
| Era of Populism | 2012–2022 | §10 | 95 | 64 | Tea Party/Occupy→Trump/Sanders; the game's own alt-history era name (parent §10) that *tracks a real phenomenon*. Thins toward the present (2022-23: 2 events) as the record runs out. |
| **Era of the Near Future** | ~2023–? (speculative) | — (parent §10 "Era of the Future" stub) | 70 | — | ★ **Not history.** Speculative near-term (population decline, Russia reclaims Soviet territory, cloning notifications). See §3. |
| **Era of the Distant Future** | speculative | — | 81 | — | ★ **Not history.** Sentient robots, AI-human augmentation, climate-refugee coasts, new parties. See §3. |

**[inference]** **The density curve tracks real American eventfulness well.**
The four peaks — **Nuclear Age (304), Ideologies/New-Deal-WWII (283), Gilded Age
(252), Progressivism (238)** — are exactly the four stretches a historian would
call the most event-dense in U.S. political history (Cold War, Depression+WWII,
industrialization+labor+machine politics, Populist/Progressive reform+WWI
run-up). The trough — **Independence (71)** — is the shortest, pre-party,
pre-mass-politics era where a "national event menu" is genuinely thin. The
HalfTerm tab shows the same shape at finer grain: the single densest half-terms
are **1890-91 (26)**, **1920-21 & 1924-25 (24/23)**, **1954-55 (23)** — the
Populist climax, the Roaring-Twenties peak, and the mid-Cold-War peak. The one
place density **out-runs the game's playable surface** is the pre-1948 modern
eras: shipped `src/data/` only models ~105 events across 2 eras
(`analysis.md` "Coverage vs shipped"), so the corpus is a ~24× superset — the
density is authored ahead of what any current scenario exercises.

**Type mix by era is period-appropriate.** Corpus-wide: **Flavor 1,348**,
**Foreign Affairs/Military 621**, **Domestic 428**, **Economics 71**,
**Judicial 7**. The Flavor majority = ambient cultural/scientific/world texture
(e.g. Nike opening 1973, Sears Tower 1973, Apple founded 1976, the Lucy fossil
1974, Rocky Horror 1975 — all correctly typed Flavor, real-dated, mostly
precondition-free; `eraevos.csv:1182-1207`). Foreign-Military swells exactly
where you'd expect (Nuclear Age, Terror). **[inference]** Economics (71) and
**Judicial (7)** are conspicuously thin given how much U.S. politics turns on
the Supreme Court and the economy — *Marbury*, *Dred Scott*, *Lochner*,
*Brown*, *Roe*, and every panic/depression are mostly filed as Domestic or
Flavor rather than getting their own genre. Flag for the PM only as a *coverage
observation*, not an error: the corpus under-weights the judicial and economic
genres relative to their real historical weight.

---

## 2. Fidelity spot-check (13 events, cited)

Picked across eras from `sample.md` + spot-reads of `eraevos.csv`. Verdict
columns: **Date** (Historic Year vs real), **Type**, **Description/precondition
coherence**. Overall: **fidelity is high** — events are real, correctly dated,
sensibly typed, and their `Requires` chains mostly mirror real causation.

| # | Event (era) | Corpus Year / Type | Real history | Verdict |
|---|---|---|---|---|
| 1 | **Gaspee Affair** (Independence) | 1772 / Economics | HMS *Gaspee* ran aground chasing the *Hannah* and was burned to the waterline off Warwick RI the night of **June 9–10, 1772**, by men led by **Abraham Whipple & John Brown**; it enforced the Navigation/customs Acts. ([Museum of the Amer. Rev.](https://www.amrevmuseum.org/read-the-revolution/the-burning-of-his-majesty-s-schooner-gaspee), [NEHGS](https://newenglandhistoricalsociety.com/the-1772-gaspee-affair-rhode-islands-tea-party-ship-burned/)) | ✅ Accurate. Names, date, cause all correct. "Economics" is defensible (customs/smuggling enforcement); "Domestic/Foreign-Mil" would fit too. |
| 2 | **Committees of Correspondence** (Independence) | 1772 / Domestic; **Requires: Gaspee Affair occurred** | **Nov 1772**, Boston: **Samuel Adams, Joseph Warren, Mercy Otis Warren** formed the committee *in response to the Gaspée affair* (and Crown-paid judges); 100+ MA towns followed. ([American History Central](https://www.americanhistorycentral.com/entries/committees-of-correspondence/), [MassHist](https://www.masshist.org/revolution/committees.php)) | ✅ Accurate **and the precondition is a real causal chain** — Gaspée → Committees is textbook cause-and-effect. Figures exact. |
| 3 | **Louisiana Purchase** (Federalism→) | 1803 / Foreign-Mil; Leads-to-Treaty: Yes | **Apr 30, 1803**, $15M, doubled the country; Napoleon needed war funds, **Talleyrand opposed**, envoy **Barbé-Marbois**; Jefferson's strict-construction/"necessary and proper" qualms. ([State Dept](https://history.state.gov/milestones/1801-1829/louisiana-purchase), [Natl Archives](https://www.archives.gov/publications/prologue/2003/spring/louisiana-purchase.html)) | ✅ Accurate and richly correct (envoy, Talleyrand's opposition, the constitutional worry, the carved states). Placed in **Federalism** era-band by *start-state* gating, not the 1803 calendar — see §4. |
| 4 | **Missouri Compromise** (Republicanism) | 1820 / Domestic | **Mar 1820**: Missouri slave / Maine free; **36°30′** line; Tallmadge Amendment fight. ([Natl Archives](https://www.archives.gov/milestone-documents/missouri-compromise)) | ✅ Accurate, correctly dated, sensibly Domestic (a case for Economics/slavery-genre exists). |
| 5 | **Bleeding Kansas** (Manifest Destiny) | 1854 / Domestic; **Requires: Constitutional Crisis in Kansas** | Violence **1854–59** between "Border Ruffians" (pro-slavery) & "Free Staters" after the Kansas-Nebraska Act. ([Kansas-Nebraska Act — Senate](https://www.senate.gov/artandhistory/history/minute/Kansas_Nebraska_Act.htm)) | ✅ Accurate; 1854 start correct; the precondition (Kansas constitutional crisis → violence) mirrors the real Lecompton/pop-sovereignty chain. |
| 6 | **Pullman Strike** (Gilded Age) | 1894 / Domestic; **Requires: Labor movement** | **May–Jul 1894**; led by **Eugene V. Debs**; Cleveland/AG **Olney** used a federal injunction + troops to break it. ([Wikipedia — Pullman Strike](https://en.wikipedia.org/wiki/Pullman_Strike)) | ✅ Accurate; Debs named; the "order the Att Gen to break the strike" response mirrors Olney's real move; precondition (a prior labor-movement event) is real causation. |
| 7 | **Cuban Missile Crisis** (Nuclear Age) | 1962 / Foreign-Mil; **Requires: Bay of Pigs was blundered** | Bay of Pigs **Apr 1961** → Operation Mongoose → **Oct 1962** U-2 photos → 13-day standoff; blockade; missiles removed. ([State Dept](https://history.state.gov/milestones/1961-1968/cuban-missile-crisis)) | ✅ Accurate; **the precondition reflects real chronology** (Bay of Pigs *preceded* and helped precipitate the crisis). Branches into "WWIII: Iron Curtain / US Invasion of Cuba" counterfactuals — see §3. |
| 8 | **Gulf of Tonkin Incident** (Nuclear Age) | 1964 / Foreign-Mil; **Requires: Vietnam War active, US not yet at war w/ Vietnam** | **Aug 1964** reported attacks on U.S. destroyers → Gulf of Tonkin Resolution → escalation. | ✅ Accurate era & causal placement (precondition correctly requires an *active Vietnam War but pre-declared-war* state). *Verify the 1964 Historic-Year field before any date-exact mechanic.* [consensus on the event; **uncertain** only that the sheet's exact year cell reads 1964] |
| 9 | **Watergate** (Neocons) | 1974 / Domestic; **Requires: President with `Controversial` trait eligible for reelection** | Break-in **Jun 1972**; Nixon resigned **Aug 1974**. ([Wikipedia — Watergate scandal](https://en.wikipedia.org/wiki/Watergate_scandal)) | ⚠ **Deliberately generic, not Nixon-specific** — trait-gated so *any* controversial incumbent can commit "the Watergate crime" (wiretap the opposition, 50–60% chance of getting caught → Special Committee). Real event; **ahistorical-by-design branch**. Not an error; note it. |
| 10 | **Conciliatory Resolution** (Independence) | 1775 / Foreign-Mil; **Requires: Rev War occurred & not ended** | Lord North's **Conciliatory Resolution (Feb 1775)** — Parliament's offer to colonies. ([sample.md](/home/user/AMPU/docs/game/sources/era-events/sample.md)) | ✅ Real & correctly dated; precondition is real (it came *during* the escalating conflict). Note "**Game ends if option B is selected**" = a counterfactual "colonies accept, stay British" branch. |
| 11 | **Coup in Cyprus (1974)** (Neocons) | 1974 / Foreign-Mil | Real **1974 Cypriot coup d'état** → Turkish invasion. ([eraevos.csv:1195](/home/user/AMPU/docs/game/sources/era-events/eraevos.csv)) | ✅ Real, correctly dated & typed — evidence the corpus tracks *world* (not just U.S.) foreign-affairs events. |
| 12 | **Franco Dies / Juan Carlos King** (Neocons) | 1975 / Flavor; **Requires: Franco took control, Spain not Communist** | Franco d. **Nov 1975**; monarchy restored under Juan Carlos. | ✅ Real & correctly dated; the precondition ("Franco took control … Spain not Communist") shows even Flavor events can be **gated on prior world-state**, allowing an alt-branch where Spain went communist and this never fires. |
| 13 | **Sears Tower / Apple / Nike** cluster (Neocons) | 1973–76 / Flavor | Sears Tower topped out 1973; Apple founded 1976; Nike's first store 1966 (brand 1971). ([eraevos.csv:1182-1207](/home/user/AMPU/docs/game/sources/era-events/eraevos.csv)) | ✅ Cultural texture, correctly typed **Flavor**, real-dated, mostly precondition-free. Confirms Flavor = ambient period color. (Minor: "Nike starts selling shoes … 1973" vs. store 1966/brand 1971 — a soft date, low stakes.) |

**Top-line fidelity finding:** across 13 checks spanning 8 eras, **every event is
a real (or, for #7/#10, real-but-branchable) historical event, and dates/types
are right or defensible.** No hard anachronism surfaced in the historical eras.
The recurring *soft* issues are (a) **genre under-use** — big judicial/economic
turning points filed as Domestic/Flavor (§1), and (b) **era-label placement by
game-state rather than calendar** (Louisiana Purchase in the "Federalism" band;
Watergate in "Neocons"), which is correct engine behavior but can look off
against a wall-clock (§4).

---

## 3. ★ The alt-history / future / counterfactual class — intentional, not errors

Three overlapping speculative sub-corpora. **[consensus] These are authored
speculative content and must NOT be treated as historical errors or "wrong
dates."** They carry Historic Year = **`alt`** or **`n/a`** precisely to mark
"no real-world date."

- **Near Future (70 events, ~2023+ speculative):** near-term extrapolation —
  *Rapid Population Decline in the US and Developed World* (offers "human
  cloning" or "boost Social Security" responses), *Russia Declares War for
  former Soviet Territories* (`eraevos.csv:1563-1565`). Plausible-adjacent, no
  fixed date.
- **Distant Future (81 events, no calendar):** hard speculation — **sentient
  robots** (Robot Controversy, Robot Soldiers, First Sentient Robot State Judge,
  Fundamentalist Robot Terrorism), **AI–human augmentation** (Human-AI
  Augmentation Invented; AI vs. Augmented-Human Riots; a "Hacked AI-Augmented
  General Marches on the Capital with a Robot Army"), **human cloning of
  historical figures** ("Clone of Napoleon becomes President of France," "Clones
  of the Beatles Go on World Tour," "Historian & Clone Doctor Clones our First
  President"), **climate-refugee coasts** (Rising Sea-Levels Making the
  Eastern/Gulf/West Coast Cities Uninhabitable), **new speculative parties**
  (Earth Party, Science Party, Universe Party, Humanitarian Party), and
  geopolitical fragments ("Chinese Becomes the World Language," "China Makes
  Breakthrough in Human Cloning," Antarctica declaring nationhood).
  `eraevos.csv:1556-1565, 2138-2181`.
- **Counterfactual branches inside historical eras (via `Requires` + "game
  ends"/branch flags):** the corpus *forks* real history when the player makes
  ahistorical choices. Clearest examples:
  - **Louisiana Purchase pair** — the main event gates on "**France has
    regained Louisiana from Spain**," while a sibling **"Louisiana Purchase from
    Spain"** (`eraevos.csv:1549`) gates on "**France has NOT regained
    Louisiana from Spain**." Two mutually-exclusive branches modeling which
    power the U.S. buys from. (Both also require "Napoleon is not a US
    politician" — an in-world escape hatch.)
  - **Cuban Missile Crisis** branches on the player's Bay-of-Pigs outcome into
    "**World War III: Iron Curtain**" / "**US Invasion of Cuba**" — an
    ahistorical WWIII line the real crisis avoided.
  - **Conciliatory Resolution / SpaceBotUSA** — "**Game ends**" terminal
    branches: colonies accept British terms (Revolution ends early), or a
    mega-corporation's private army defeats the U.S. Army (`sample.md`).

**[inference]** This class is the seam where the corpus **connects to the game's
future-era work** already in the living docs — the parent §10 "Era of the
Future" **partial stub** (batch 29, `c54b7a9d`: "Events are fairly solid …
mainly I need more proposals"), and the reconciliation targets flagged in
`analysis.md` §★★: the b61 event-chain DSL digest
(`8f7ae0b9-era-of-future-event-chains`, the `->`/AND/OR/NOT chains incl.
China/Russia-fragment lines), plus the Trump-2.0 / Biden-era / 2025-2029 content
catalogs (b58/b62/b63). **Open question for game-pm/game-master (from
`analysis.md`):** is this sheet a *superset* of that forum future-era content, or
do those threads add chains/events not here? The robot/AI/China-fragment themes
overlap enough that they must be cross-referenced before either is treated as
canonical — do **not** assume the sheet subsumes b61's chain content.

---

## 4. Precondition → historical causality

**1,664 / 2,475 events (67%) carry a `Requires` precondition** (`analysis.md`);
it's the sheet's expression of historical cause-and-effect and maps to the
shipped serializable `Predicate` tree (`types.ts:1484`, the #258 eraGraph,
currently wired 1772-graph-only).

**[inference] Where preconditions encode *real* causation (the majority
pattern):**
- **Gaspée Affair → Committees of Correspondence** — exact real sequence (#2).
- **Bay of Pigs blundered → Cuban Missile Crisis** — matches the real
  1961→1962 chronology (#7); the crisis is even gated to *only* the "blundered"
  path, i.e. the historical outcome.
- **Kansas constitutional crisis → Bleeding Kansas**; **prior labor-movement →
  Pullman Strike**; **Rev War active & unended → Conciliatory Resolution** —
  each mirrors the real precipitating condition.
- **World-state gates** on foreign events (Franco "took control … Spain not
  Communist" → his death restores the monarchy; "Bahamas owned by UK" →
  independence) correctly require the real prior condition to exist.

**Where preconditions *enable ahistorical branching* (by design):**
- **Trait/eligibility gates** decouple an event from its real actor — Watergate
  fires for *any* `Controversial` incumbent (#9), not just Nixon; this lets the
  event recur in a divergent timeline.
- **Mutually-exclusive "regained/not-regained" gates** (the Louisiana pair)
  fork the map by prior outcome.
- **Blunder/branch flags** ("if Response A blunders, activate WWIII: Iron
  Curtain"; "Game ends if option B") let a resolved event *rewrite the
  world-state* the next tier of preconditions reads — this is what turns a chain
  of events into an **alt-history tree** rather than a fixed timeline.

**Conclusion.** **[inference]** The precondition graph is **historically
literate at the link level** — the individual "A occurred → B becomes possible"
edges track real causation with high fidelity in the spot-checked cases — **but
it is explicitly a *branching* causality, not a rail.** The `Requires` model
plus blunder/"game-ends"/regained-state flags is engineered so that player
choices (and RNG) can peel the timeline off history at defined forks. That is
consistent with how the game's actual playthroughs behave (parent §10: the
1948-continued campaign produced a "President Cuomo" 2008, an unratified
term-limit amendment, etc.) — real history seeds the *menu and the early links*,
and divergence accumulates forward. So: **use the corpus's preconditions as an
accurate map of real cause-and-effect for era framing, but expect any given run
to follow ahistorical branches once a fork is taken.**

---

## 5. Methodology the corpus reveals (how the designer authors events)

**[inference]** A consistent template, visible across all spot-checks:
1. **A real event** (or, past ~2023, a speculative one) with a one-paragraph
   in-character **Description** written from an advisor's POV.
2. **A Wikipedia link** (`Wiki` col) as the source anchor — the designer is
   working straight from Wikipedia era-event lists (dates/spellings track WP).
3. **A President-response menu (A–F)**, usually **1 response (1,319 events) or 2
   (460)** — often a "hawk vs. dove" / "intervene vs. don't" pair — each
   **resolved by an ability check** (`Resolve`, "Admin unless stated"; e.g.
   Louisiana = a Pres/State/Ambassador *modification*, Pullman = Pres *judicial*
   ability, Bleeding Kansas = Pres *Gov* ability) with named cabinet/office
   responders.
4. **Effects as meter shifts + faction/office points**, frequently
   **probabilistic** ("25% chance − dom stab," "90% chance − rel with France")
   and naming concrete factions to reward/punish (Big Agriculture, Expansionists,
   Globalists, Law & Order, Labor Unions, Military-Industrial).
5. **Gating + branching metadata**: `Era Starts` / `Deactivate`, `Requires`,
   `Percent Chance`, `Leads to Treaty`, and free-text `Special Rules` that can
   activate follow-on events or **end the game**.

Two shipped-model deltas the game-pm should carry forward from `analysis.md`
(reconciliation table): the sheet's **`Type` genre** and its **per-response
*ability* resolution** have **no direct field** on the shipped `EraEvent`
(`types.ts:1466`; shipped `decider` is an *office*, not an ability check), and
**office-points + 10% next-election carry** aren't in
`EraEventResponseEffect`. These are content the model doesn't yet capture, not
history questions.

---

## 6. Targeted additions for the parent `historical-context.md` (one-liners)

1. **Add a game-era ↔ real-span crosswalk row-set** to the parent's "Cross-era
   polarity map," including the two later labels the parent under-specifies:
   **"Era of the Neocons" = ~1972–1999** (Watergate→Reagan→Gingrich) and the
   terminal **Near/Distant Future** speculative bands — so game-master reads era
   names against real dates. (Source: this companion §1; `eraevos.csv:1182-1207`.)
2. **Flag the corpus's `Requires` graph as historically-literate-but-branching**
   in §10's alt-history note: real causal links (Gaspée→Committees, Bay-of-Pigs→
   Cuban Missile) but engineered forks (Louisiana France/Spain pair; trait-gated
   Watergate) — reinforcing "seed with history, expect divergence."
3. **Note the genre/coverage skew** (Flavor 1,348; **Judicial only 7**;
   Economics 71): major court/economic turning points are filed as
   Domestic/Flavor, so era framing should not lean on a "judicial event" genre
   that barely exists.
4. **Record the speculative future class as intentional** (Near 70 / Distant 81,
   Historic Year `alt`/`n/a`) and cross-reference the b61 future-chain digest —
   so no one "corrects" robot/AI/cloning events as historical errors.

---

## Citations
Ordered by importance to this companion.

- [State Dept — Cuban Missile Crisis, Oct 1962](https://history.state.gov/milestones/1961-1968/cuban-missile-crisis) and [State Dept — Bay of Pigs, Apr 1961](https://history.state.gov/milestones/1961-1968/bay-of-pigs) — the Bay-of-Pigs→missile-crisis chronology that validates event #7's precondition.
- [Museum of the American Revolution — Burning of the Gaspée](https://www.amrevmuseum.org/read-the-revolution/the-burning-of-his-majesty-s-schooner-gaspee) and [New England Historical Society — 1772 Gaspée Affair](https://newenglandhistoricalsociety.com/the-1772-gaspee-affair-rhode-islands-tea-party-ship-burned/) — Gaspée date (Jun 9–10 1772), Whipple/Brown (#1).
- [American History Central — Committees of Correspondence](https://www.americanhistorycentral.com/entries/committees-of-correspondence/) and [MassHist — Committees of Correspondence](https://www.masshist.org/revolution/committees.php) — Nov 1772; Adams/Warren/Warren; formed *in response to Gaspée* (#2, the causal chain).
- [State Dept — Louisiana Purchase](https://history.state.gov/milestones/1801-1829/louisiana-purchase) and [National Archives — Prologue: Louisiana Purchase](https://www.archives.gov/publications/prologue/2003/spring/louisiana-purchase.html) — Apr 30 1803, $15M, Talleyrand/Barbé-Marbois, strict-construction qualm (#3).
- [National Archives — Missouri Compromise (1820)](https://www.archives.gov/milestone-documents/missouri-compromise) — Mar 1820, 36°30′ (#4).
- [Senate — The Kansas-Nebraska Act](https://www.senate.gov/artandhistory/history/minute/Kansas_Nebraska_Act.htm) — the Act that precipitates Bleeding Kansas (#5).
- [Wikipedia — Pullman Strike](https://en.wikipedia.org/wiki/Pullman_Strike) — 1894, Debs, Olney injunction (#6).
- [Wikipedia — Watergate scandal](https://en.wikipedia.org/wiki/Watergate_scandal) — 1972 break-in / 1974 resignation, for the trait-gated event #9.

**Internal sources:**
- `docs/game/sources/era-events/analysis.md` (schema, era/type distributions, model-reconciliation, data-quality, §★★ reconcile mandate); `sample.md` (Gaspée, SpaceBotUSA, Population Decline, Conciliatory Resolution); `eraevos.csv` (spot-read rows: Louisiana 109, Missouri 187, Bleeding Kansas 360, Pullman 651, Cuban Missile 1127, Gulf of Tonkin 1140, Watergate 1191, Neocons flavor cluster 1182-1207, Louisiana-from-Spain 1549, Near/Distant-Future 1556-1565 & 2138-2181); `eventsbyhalfterm.csv` (pacing totals).
- `docs/game/historical-context.md` — parent era model & game-era→date anchors (Cross-era polarity map; §1 "eras are content-bands"; §2.5/§2.6 game-era names; §10 alt-history & "Era of the Future" stub). Companions: `-1820-democracy.md`, `-1948-coldwar.md`, `-1960-coldwar.md`, `-politician-roster.md`.
- Shipped model: `src/types.ts` (`EraEvent` 1466, `Predicate` 1484, `Era` enum 1337). Reconciliation & future-era digests referenced in `analysis.md` §★★ (`8f7ae0b9`, `df11a769`, `27711296`, `c8d3fd84`, `0b1adc59`).
