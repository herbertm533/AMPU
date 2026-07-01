# AMPU — Historical Context: the "Pol additions 2024" proposals + the 182-column data model

> **Companion to `historical-context.md`.** This grounds the **`pol-additions-2024`
> ingest** (tag `pol-additions-2024`, source `4b5d4ca7-Copy_of_Pol_additions_2024.xlsx`)
> in real American history. Two things were ingested:
> 1. **`Pols 2024`** — a community *proposal list* of **146 real politicians** to
>    add to the game's roster (Name / US-Rep? / win-chance / Wiki / Added-by / Bio).
> 2. **`Vstyle sheet`** — a **WIP 182-column "intended politician DATA MODEL"** with
>    **224 real figures** decomposed into it (name parts, dynasty links, demographics,
>    dated career/party arcs, election-point tiers).
>
> Reconcile vs the hand-authored **7,349-roster** (grounded in
> [`historical-context-politician-roster.md`](historical-context-politician-roster.md),
> which this file assumes and does not repeat): Pols-2024 = **145 genuinely new**
> of 146; Vstyle = **221 genuinely new** of 224; 131 names appear on both lists.
> So this batch is a **roster-expansion pass** (filling gaps) plus a **schema
> R&D pass** (the Vstyle model is far richer than the shipped `Politician` type).
>
> **★★ Playtester exclusion (user hard-rule):** the workbook's `Playtesters` tab was
> dropped entirely and **7 playtester "vanity" rows were removed from Vstyle** in
> preprocessing. This document references **no playtester** and grounds **only the
> real historical additions**. ("Added by" in Pols-2024 is contributor attribution,
> not a politician entry.) Also filtered: **69 `#VALUE!` error rows**.
>
> Confidence tags match the parent: **[consensus]**, **[contested]**, **[inference]**.
> Same era-relative BLUE/RED polarity convention as the parent's "Cross-era polarity
> map" and the roster companion (team = the figure's *era-of-entry* alignment, not
> lifetime party) — read those first.

---

## 1. Who the additions are — era & office spread

The two lists lean the same direction: **early-republic obscure Congressmen** +
a **wave of 2024-cycle candidates**, with a scattering across every era. Verified
by scanning the CSVs (`pols2024.csv`, `vstyle_clean.csv`) and their `Bio`/`WinChanceNote`
columns.

**By era (roughly, from Vstyle `Birth Year` / `Draft Year` and Pols-2024 bios):**

| Era band | Character of the additions | Examples (real) |
|---|---|---|
| **Founding / early republic (draft ~1772–1800)** | The **single densest cohort** — obscure 1st–5th-Congress US Reps, Continental-Congress delegates, and Revolutionary officers who *did* serve but never made the marquee roster. Many "Pro-Admin"/"Anti-Admin"-labeled (the pre-party 1st-Congress framing). | Silas Talbot, Thomas Truxtun (Quasi-War naval officers); Aedanus Burke (SC); Israel Jacobs, Thomas P. Carnes; Matthew Lyon; Ira Allen; Titus/Hezekiah Hosmer |
| **Antebellum / Jacksonian (draft ~1828–1855)** | Second-tier Congressmen, some reformers. | Robert Dale Owen (IN; Smithsonian bill); Chittenden Lyon (KY); Wm. Alexander Richardson (IL) |
| **Gilded Age / Progressive (draft ~1856–1912)** | Obscure Reps, **Reps-elect who died before taking office**, and turn-of-century figures. | B.H. Roberts (UT, excluded 1900); Xenophon P. Wilfley (MO); Andrew J. Campbell (NY, Rep-elect, died before seating) |
| **New Deal → late 20th c. (draft ~1936–2000)** | Mid-century Reps, mayors, athletes-turned-politicians. | Harold Washington (IL); Marion Barry (DC); George S. Patton I & IV; Lynn Swann; Bill "Spaceman" Lee |
| **Modern / 2024 cycle (draft ~2000–2024)** | The **largest deliberate theme:** **2024 Senate/House/Gov nominees and candidates**, winners and losers alike. | Angela Alsobrooks, Ruben Gallego, Elissa Slotkin, Bernie Moreno, Vince Fong, Vivek Ramaswamy, Josh Stein, Mark Robinson, Marie Gluesenkamp Perez |

**By office / type:** heavily **US Representatives** (the `US_Rep` column is populated
for ~55 of 146) and **statewide nominees** (Senate/Governor, esp. 2024); a distinct
**state-chief-justice run** in Pols-2024 (Paul Reiber, Stuart Rabner, Nathan Hecht,
Loretta Rush, Mike McGrath, et al. — "State chief justice for more than 10 years");
several **Reps-elect who died before taking office**; and a few **near-celebrities**
(NFL's Lynn Swann, MLB's Bill Lee, astronaut Jack Swigert, Vivek Ramaswamy).

**Why they'd be added:** to **fill the roster's thin seams**. The roster companion
flags 2001+ as the **sparsest band (110 records)** and the founding band as dense-
but-incomplete; these additions target **exactly those gaps** — the 2024 class
fattens the contemporary tail, and the ConsE2 tranche of 1790s–1810s Congressmen
deepens the founding bench the 1772 scenario draws from. **[inference]**

---

## 2. Fidelity spot-check (12 figures, cited)

Assessment: **high fidelity.** Names, states, party alignment, birth/death years,
and offices check out across eras. The proposals are correctly attributed and
era-appropriate. Two systematic issues surface (citizenship flag; some 2024 bios
now stale), detailed in §4.

**Founding / early republic**
- **Ira Allen** (VT, Red/Mod, b.1751 d.1814, Draft 1776) — ✅ Younger brother of
  Ethan Allen; **founder of Vermont**, Green Mountain Boys, VT legislature 1776–77,
  designed the Great Seal, endowed the University of Vermont. Later sought French
  arms to seize Canada ("United Columbia"), was captured, and **died in Philadelphia
  fleeing debt (1814)** — which is exactly why his Vstyle **Alternate State = PA,
  relocated 1803** is a nice touch. Agriculture expertise + Reformist interest fit.
  ([Wikipedia](https://en.wikipedia.org/wiki/Ira_Allen), [Medium/Fay bio](https://glennfay.medium.com/vermont-founder-ira-allen-1751-1814-db94c6be540c)) **[consensus]**
- **Silas Talbot** (NY, Red/Trad, b.1751 d.1813) — ✅ Continental Army *and* Navy
  officer, privateer, twice in the NY assembly, **US Rep from 1793**, then
  **commander of USS Constitution (1799–1801)** in the Quasi-War. Naval expertise
  + Military Leader trait correct. ([USS Constitution Museum](https://ussconstitutionmuseum.org/crew/silas-talbot/), [Wikipedia](https://en.wikipedia.org/wiki/Silas_Talbot)) **[consensus]**
- **Thomas Truxtun** (Vstyle PA, Red/Cons, b.1755 d.1822) — ✅ One of Washington's
  **first six Navy captains (1794)**, commanded **USS Constellation** in the
  Quasi-War's two most famous actions. Decisive-General trait apt. *Minor flag:*
  Vstyle lists **PA**; sources tie him to **NY/NJ** — verify state before committing.
  ([Wikipedia](https://en.wikipedia.org/wiki/Thomas_Truxtun)) **[consensus on identity]**
- **Matthew Lyon** (VT→KY, Blue, b.1749 d.1822) — ✅ **Irish-born** printer/farmer;
  US Rep for **Vermont (1797–1801) *and* Kentucky (1803–11)**; **first person tried
  under the Sedition Act of 1798**, won **re-election from his jail cell**, and had
  the famous 1798 House floor brawl with Roger Griswold. Vstyle correctly encodes
  the **VT→KY move as Alternate State KY, relocated 1801**. But see §4: he is flagged
  neither Natural-Born nor Foreign-Born despite being **Irish-born** (a real
  presidency-gate fact). ([House History](https://history.house.gov/Historical-Highlights/1800-1850/The-life-of-Representative-Matthew-Lyon-of-Vermont-and-Kentucky/), [1st-Amendment Encyclopedia](https://firstamendment.mtsu.edu/article/matthew-lyon/)) **[consensus]**

**Antebellum**
- **Robert Dale Owen** (IN, Blue/LW-Pop, b.1801 d.1877) — ✅ **Scottish-born**
  social reformer; managed his father Robert Owen's **New Harmony** utopian
  community; **US Rep IN 1843–47**, where he **passed the bill establishing the
  Smithsonian Institution**; later an abolitionist voice (1862 open letters).
  Media expertise + Reformist/LW-Activist interests fit. Two real dimensions the
  model *should* carry but doesn't: **father = Robert Owen** (dynasty) and
  **foreign-born** (citizenship). ([House History](https://history.house.gov/People/Listing/O/OWEN,-Robert-Dale-(O000152)/), [Britannica](https://www.britannica.com/biography/Robert-Dale-Owen)) **[consensus]**

**Gilded Age / Progressive**
- **B.H. Roberts** (UT, Mormon, b.1857 d.1933) — ✅ Elected a **Democrat to the
  56th Congress (1898)**; the House **refused to seat him, 268–50 (Jan 25, 1900),
  for practicing polygamy** (three wives). A crisp **representation-history**
  datapoint (religion + the era's Mormon-exclusion politics). ([Wikipedia](https://en.wikipedia.org/wiki/B._H._Roberts), [Utah History Encyclopedia](https://www.uen.org/utah_history_encyclopedia/r/ROBERTS_BRIGHAM.shtml)) **[consensus]**

**Mid–late 20th century**
- **Harold Washington** (IL, Blue/Lib, b.1922 d.1987) — ✅ **US Rep IL 1981–83**
  (worked to **extend the Voting Rights Act**); **first Black mayor of Chicago
  (1983–87)**; earlier IL House/Senate (drafted the 1980 Illinois Human Rights
  Act). Vstyle correctly tags **Black**. Bio's "critical *ally* of Richard J.
  Daley" is loose — Washington's coalition rose in *tension* with the Daley
  machine — but the office record is exact. ([Chicago Public Library bio](https://www.chipublib.org/mayor-harold-washington-biography/), [Chicago History Museum](https://www.chicagohistory.org/exhibition/harold-washington-1983-chicago-mayoral-election/)) **[consensus on record; contested on "ally" framing]**
- **Doris "Granny D" Haddock** (NH, b.1910 d.2010) — ✅ Campaign-finance-reform
  activist who **walked ~3,200 miles across the US (1999–2000)** at age 88–90;
  **2004 Democratic Senate nominee** vs. incumbent Judd Gregg (lost ~34%–66%);
  at 94 the **oldest-ever congressional candidate**. ([Wikipedia](https://en.wikipedia.org/wiki/Doris_Haddock), [Democracy Now obituary](https://www.democracynow.org/2010/3/11/dorris_granny_d_haddock_1910_2010)) **[consensus]**

**Modern / 2024**
- **Angela Alsobrooks** (MD, Blue/Mod, b.1971) — ✅ Prince George's County
  Executive; **won the 2024 MD Senate race over Larry Hogan**, becoming the
  **first Black U.S. senator from Maryland** (and, with Lisa Blunt Rochester,
  one of the first two Black women in the Senate simultaneously). *Bio now stale:*
  the Vstyle/Pols bio says "Democratic **candidate**/nominee" — written **pre-result**;
  she **won**. ([NBC News](https://www.nbcnews.com/politics/2024-election/angela-alsobrooks-wins-maryland-senate-race-defeating-republican-larry-rcna174770), [Washington Post](https://www.washingtonpost.com/dc-md-va/2024/11/05/maryland-senate-general-election-alsobrooks-hogan/)) **[consensus]**
- **Bernie Moreno** (OH, Red, b.1967) — ✅ **Colombian-born** businessman;
  **2024 Republican Senate nominee in Ohio** (defeated incumbent Sherrod Brown).
  Vstyle bio correctly says "Colombian-born," and encodes a **2021 ideology shift
  → RW Pop** (his MAGA turn) — but the **citizenship flag is mis-set** (see §4:
  he is a naturalized, *foreign-born* citizen, presidency-ineligible). ([Wikipedia](https://en.wikipedia.org/wiki/Bernie_Moreno)) **[consensus]**
- **Laphonza Butler** (Vstyle MS→MD→CA, Blue/Lib, b.1979) — ✅ Appointed to the
  **US Senate from California (2023)** after Feinstein's death; the model captures
  her mobility as **Alternate States MD, CA (relocated 2021, 2023)** — a good use
  of the alt-state schedule. ([Wikipedia](https://en.wikipedia.org/wiki/Laphonza_Butler)) **[consensus]**

**Verdict:** across 12 cross-era checks, **no identity/attribution errors** — the
proposals are real, correctly stated, and era-appropriate. Defects are (a) a
**systematic citizenship-flag gap** for naturalized/foreign-born figures, and
(b) **pre-election bios** on some 2024 candidates that reality has overtaken.

---

## 3. The 182-column model's historical dimensions — assessment

The Vstyle model is **well-motivated historically**: it tries to encode the things
that actually shaped 250 years of American political careers, which the flat shipped
`Politician` type flattens away. Dimension by dimension:

- **★ Family / dynasty (`Dynasty`, `Politician Father/Mother/Spouse`).**
  **Strongly motivated.** American politics is thick with dynasties — Adamses,
  Harrisons (Benjamin Harrison the signer → WHH → Benjamin Harrison the 23rd
  president), Lees, Roosevelts, Bushes, Kennedys, Tafts, Bayhs, Longs. The model
  *starts* to capture this: **Hezekiah L. Hosmer** correctly lists **father = Titus
  Hosmer** (a real Founding-era father→son pair, both in this batch). **But it's
  WIP and sparse:** the obvious **Matthew Lyon → Chittenden Lyon** (VT/KY father→son,
  both present) and **Robert Owen → Robert Dale Owen** links are left blank. As
  populated, dynasty tags would let the game model the **kingmaker/protégé and
  inherited-name advantage** that real dynasties conferred. **[inference]**
- **★ Demographics (race×6, religion×9, gender, sexuality, citizenship).**
  **Strongly motivated — this is the representation-history substrate.** The tags
  let the game encode the real sequence of *firsts* and *exclusions*: **first Black
  officeholders** (Harold Washington tagged Black; the 2024 class carries several),
  **the Mormon-exclusion politics** (B.H. Roberts, denied his seat 1900),
  **Catholic/Jewish** milestones (Israel Jacobs, a 1790s PA Rep, is a period Jewish
  officeholder), and **women/LGBT** entries in the modern additions. Historically
  these tags are load-bearing because **who was *eligible* to hold office changed
  radically** over the timeline (property→white-male suffrage → 15th/19th
  Amendments → Civil-Rights-era enfranchisement). Handled as tags, not as a slur or
  a score, this is defensible ground-truth data. **[consensus that the milestones
  are real; inference that tags are the right substrate]**
- **★ Natural-born vs foreign-born citizen.** **Motivated and specific:** Art. II
  §1 bars anyone but a **natural-born citizen** (or a citizen at the Constitution's
  adoption) from the presidency. So this flag is a **real eligibility gate**, and
  the batch contains genuine foreign-born figures it applies to — **Matthew Lyon**
  (Ireland), **Robert Dale Owen** (Scotland), **Bernie Moreno** (Colombia). The
  motivation is sound; the *population* of the flag is buggy (see §4). **[consensus]**
- **★ Temporal skill progression (`First Year` / `Midway` / `Historic` × 6 skills).**
  **Strongly motivated, and the model's biggest departure from shipped data.**
  Real careers *grow*: TR the Civil Service commissioner ≠ TR the Rough Rider ≠ TR
  the president; LBJ the backbench Congressman ≠ LBJ the Majority Leader. Shipped
  `Skills` are **static**; Vstyle encodes a **three-stage arc** (entry → peak →
  historic ceiling) plus **`Peak Abilities Year`** and **trait-gain years**
  (`Year Gains Celebrity/Leadership/Military Leader/Controversial`, `Obscure
  Removed`). E.g. **Silas Talbot** rises Military 1→(hist) as his naval career
  peaks; the many `Obscure` freshmen "lose obscurity" on a schedule. This is a
  **historically faithful** way to model that reputations are *earned over time*,
  not fixed at draft. **[inference]**
- **★ Party-flip + ideology-shift + alt-state dates.** **Strongly motivated.**
  American history is full of **party-switchers and relocations** the shipped
  single-`altState` field can't express: **Matthew Lyon** literally represented
  **two states** (VT→KY, encoded as an alt-state relocation 1801); **Laphonza
  Butler** MD→CA; **Bernie Moreno** and others carry **dated ideology shifts**
  (2021 → RW Pop) that mirror real MAGA-era realignments; the roster companion's
  **Reagan** (FDR Democrat → GOP 1962) is the archetype the flip-date fields exist
  to capture. Encoding these as **per-politician scheduled events** is exactly how
  the real careers behaved. **[consensus that switchers/movers are real; inference
  on the schema fit]**
- **Election-point tiers (`20/10/7/5/3/−3…−20 pts`) & `Historic Value` vs `Draft
  Value`.** These are the model's **electability-scoring** columns — the successor
  to the roster's single hand-ranked `Draft Value`. `Historic Value` (a figure's
  realized weight) vs `Draft Value` (draft-time prestige) is a reasonable
  historical distinction: many figures **peaked below or above their promise**.
  This is design-adjacent scoring, not a historical claim; noted for completeness.

**Net:** the 182-column model is a **historically literate** attempt to capture
**career arcs, dynasty, representation, citizenship gates, and party mobility** —
all real forces the flat roster elides. Its weaknesses are **coverage** (dynasty
and demographic fields are only partly filled) and **a specific citizenship bug**,
not conceptual.

---

## 4. Fidelity flags (mis-attributions, anachronisms, dubious/dirty entries)

- **★ Citizenship flag mis-populated for naturalized/foreign-born figures.**
  The most consequential fidelity issue. Confirmed foreign-born figures are **not**
  flagged Foreign-Born (and in at least one case appear Natural-Born):
  **Matthew Lyon** (Irish-born) — neither citizenship flag set; **Robert Dale Owen**
  (Scottish-born) — shows **Natural Born Citizen = 1**; **Bernie Moreno**
  (Colombian-born, per his own bio) — citizenship tail reads as Natural-Born. Since
  this flag is the **presidency eligibility gate**, mis-setting it would wrongly let
  naturalized citizens be modeled as president-eligible. **Verify each foreign-born
  figure's flag before wiring the gate to a mechanic.** **[consensus on their
  foreign birth; the flag values are a data-entry defect]**
- **Stale pre-election 2024 bios.** Bios/`WinChanceNote`s were authored **before
  Nov 2024**, so they say "candidate/nominee" for people who then **won**:
  **Angela Alsobrooks** (won MD Sen), **Bernie Moreno** (won OH Sen), **Ruben
  Gallego** (won AZ Sen), **Elissa Slotkin** (won MI Sen), **Vince Fong** (won
  CA-20). Treat these `Bio` strings as *snapshot-dated*, not current. **[consensus]**
- **`Age at Historic Death` garbage for living figures.** Rows for people **still
  alive** (blank `Death Year`) compute nonsense ages like **−1971** (Alsobrooks),
  **−1962** (Gloria Johnson), **−1950** (Dean Barkley) — a spreadsheet formula
  artifact (`death − birth` with death blank). Ignore negative `Age at Historic
  Death`. **[inference — clearly a formula bug, not a claim]**
- **Truxtun's state (PA vs NY/NJ).** See §2 — verify before committing.
- **`#VALUE!` rows already filtered (69).** Preprocessing removed them; no action.
- **Naming delta — "Army" vs "Military."** The Vstyle expertise axis is authored
  **"Army"** where the shipped `Expertise` type uses **"Military"** (analysis.md
  schema delta). Same concept, different label — reconcile on import, don't treat
  as two axes. **[consensus — it's a naming mismatch]**
- **"Naive Strategist" / trait spelling & header typo carryovers.** The model
  repeats the roster's `"Administative"` header typo and includes union/superset
  traits (Charisma, Teflon, Lackey, Geostrategist, Union Loyalist, etc.) not in the
  shipped set — content to reconcile, not errors of fact.
- **Not an error — intentional "never-served" cohort.** ~39 rows are **Reps-elect
  who died before taking office** (Andrew J. Campbell 1894, William Dowse 1812,
  Francis Jacob Harper 1836) or **Pro-Admin/Anti-Admin 1st-Congress** members.
  These are **real people** and period-correct labels; per the roster's balance
  rule such marginal figures get **sub-floor electoral stats** (their low
  `Draft`/`Historic Value` here matches). Don't "correct" them out. **[consensus]**

---

## 5. Methodology — what the Vstyle model reveals about the designer's intent

The model shows a designer moving from a **flat roster** to a **relational,
time-aware, demographically-tagged** characterization of each figure:

1. **Name decomposition** (First/Middle/Surname/Suffix + a stable `PoliticianID`)
   — enables disambiguation of the roster's known duplicate-name problem
   (`Daniel Webster×2`, etc.) via a real key instead of the display name.
2. **Dynasty links** (Father/Mother/Spouse/`Dynasty`) — models **inherited political
   capital** (the Hosmer father→son pair is the proof-of-concept; Lyon and Owen are
   the obvious next fills).
3. **Demographic tags** — encodes the **representation timeline** (firsts and
   exclusions) as data, so the game can reflect *who could hold office when*.
4. **Career arcs** (`First Year`/`Midway`/`Historic` skills, `Peak Abilities Year`,
   dated trait gains, `Obscure Removed`) — models **reputation earned over time**,
   not fixed at draft.
5. **Dated party/ideology/relocation schedules** — models **switchers and movers**
   (Lyon VT→KY; Butler MD→CA; Moreno's 2021 → RW Pop) as **per-politician events**.
6. **Two value scores** (`Draft Value` vs `Historic Value`) + an **election-point
   ladder** — separates *promise* from *realized weight*.

The **intent** is clear: characterize each politician the way a historian would —
by **lineage, identity, eligibility, and a career trajectory**, dated where it
matters — rather than as a static stat block. The additions themselves (obscure
Founding Congressmen + the 2024 class) show the same instinct: **deepen the bench
where the roster is thin**, at both ends of the timeline.

---

## 6. Targeted additions for the parent `historical-context.md`

Fold-in candidates (one-liners) for the named era sections:

- **Founding §1 / Federalist §2:** note that the roster's Founding bench is being
  **deepened** with real but obscure 1st–5th-Congress members and Revolutionary
  officers (Silas Talbot, Thomas Truxtun, Aedanus Burke, Israel Jacobs), plus the
  **Pro-Admin/Anti-Admin** pre-party labels — period-correct for the 1st Congress
  and consistent with §2's "parties didn't exist yet."
- **Cross-era polarity map (read-first):** **Matthew Lyon** (VT→KY) is a clean
  early illustration of the alt-state/relocation reality — one man, two states'
  delegations (1797–1801 VT, 1803–11 KY).
- **Representation / suffrage thread (wherever the parent tracks it, e.g. §6–§7):**
  the additions supply concrete **firsts and exclusions** — **B.H. Roberts**
  (denied his House seat, 1900, for polygamy), **Harold Washington** (first Black
  mayor of Chicago), **Angela Alsobrooks** (first Black MD senator, 2024) — useful
  anchors for the demographic/eligibility timeline.
- **Data/authoring note (global):** the **182-column Vstyle model** is the
  designer's intended richer schema — **career-arc skills, dynasty links,
  demographic tags, a natural-born/foreign-born presidency gate, and dated
  party/ideology/relocation events**. Flag the **citizenship-flag population bug**
  (foreign-born Lyon/Owen/Moreno mis-tagged) and the **stale pre-Nov-2024 bios**
  as the two things to fix before either is wired to a mechanic.

---

## Citations

- Ira Allen (VT founder; Green Mountain Boys; died fleeing debt in Philadelphia 1814): https://en.wikipedia.org/wiki/Ira_Allen • https://glennfay.medium.com/vermont-founder-ira-allen-1751-1814-db94c6be540c
- Silas Talbot (Continental Army/Navy; US Rep 1793; USS Constitution 1799–1801): https://ussconstitutionmuseum.org/crew/silas-talbot/ • https://en.wikipedia.org/wiki/Silas_Talbot
- Thomas Truxtun (first six Navy captains 1794; USS Constellation, Quasi-War): https://en.wikipedia.org/wiki/Thomas_Truxtun
- Matthew Lyon (VT & KY Rep; first Sedition Act prosecution; re-elected from jail): https://history.house.gov/Historical-Highlights/1800-1850/The-life-of-Representative-Matthew-Lyon-of-Vermont-and-Kentucky/ • https://firstamendment.mtsu.edu/article/matthew-lyon/
- Robert Dale Owen (Scottish-born; New Harmony; US Rep IN 1843–47; Smithsonian bill): https://history.house.gov/People/Listing/O/OWEN,-Robert-Dale-(O000152)/ • https://www.britannica.com/biography/Robert-Dale-Owen
- B.H. Roberts (elected UT 1898; House refused to seat him 268–50 for polygamy, 1900): https://en.wikipedia.org/wiki/B._H._Roberts • https://www.uen.org/utah_history_encyclopedia/r/ROBERTS_BRIGHAM.shtml
- Harold Washington (US Rep IL 1981–83; first Black mayor of Chicago; Voting Rights Act): https://www.chipublib.org/mayor-harold-washington-biography/ • https://www.chicagohistory.org/exhibition/harold-washington-1983-chicago-mayoral-election/
- Doris "Granny D" Haddock (cross-country walk 1999–2000; 2004 NH Sen nominee; oldest-ever candidate): https://en.wikipedia.org/wiki/Doris_Haddock • https://www.democracynow.org/2010/3/11/dorris_granny_d_haddock_1910_2010
- Angela Alsobrooks (won 2024 MD Senate over Larry Hogan; first Black MD senator): https://www.nbcnews.com/politics/2024-election/angela-alsobrooks-wins-maryland-senate-race-defeating-republican-larry-rcna174770 • https://www.washingtonpost.com/dc-md-va/2024/11/05/maryland-senate-general-election-alsobrooks-hogan/
- Bernie Moreno (Colombian-born; 2024 OH GOP Senate nominee): https://en.wikipedia.org/wiki/Bernie_Moreno
- Laphonza Butler (appointed CA senator 2023): https://en.wikipedia.org/wiki/Laphonza_Butler
- Internal: `docs/game/sources/pol-additions-2024/analysis.md` (two datasets, reconcile counts, 182-col categorization + schema deltas, exclusions), `pols2024.csv`, `vstyle_clean.csv`, `sample.md`; and `historical-context-politician-roster.md` (the 7,349-roster grounding + era-relative BLUE/RED convention this file assumes).
