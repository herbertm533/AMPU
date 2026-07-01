# AMPU — Historical Context: the hand-authored politician roster

> **Companion to `historical-context.md`.** This grounds the **authoritative
> hand-authored 7,349-politician roster** (the curated ground-truth draft set,
> NOT the ~18.5k generated `standard-draft-classes.json` superset) in real
> American political history. It is the historian's ingest output for the
> **politician-dataset** batch (sources `a960dbad` skills CSV + `0ce36d10`
> traits JS + `2506843f` bios JS, merged → `merged.json`; aggregate in
> `docs/game/sources/politician-dataset/analysis.md`).
>
> The parent doc frames eras from playtests; **this file frames the roster that
> populates them.** Read the parent's **"Cross-era polarity map"** first — the
> single most important cross-era fact (BLUE/RED are fixed tokens whose
> real-world identity and left/right polarity change era to era) is the lens for
> everything below. Confidence tags match the parent: **[consensus]**,
> **[contested]**, **[inference]**.

---

## What the roster is (and what it reveals)

- **7,349 hand-authored records**, each `{name, draftValue (PV), state, team
  (Red/Blue), ideology, draftYear, celebrity, skills{6×0–5}, traits[], bio}`.
- **`Draft Value` (DV) is a curated prestige/PV score**, not a derived stat:
  min **−25**, median **13**, p90 **30**, max **241** (Napoleon), 110 negatives.
  The marquee tier (Clay 140, Franklin 140, TR 139, Lincoln 118, Washington 120,
  FDR 114, Jackson 113, Jefferson 104, Calhoun 96) sits far above the long tail
  of minor relatives and one-term members (DV 1–20) and near-nobodies (negative
  DV). **[inference]** DV is the designer's hand-ranking of historical
  weight/electability, and it is the roster's clearest editorial fingerprint.
- **Skills are sparse and role-shaped.** Averages: Legislative 1.03, Governing
  0.57, Admin 0.51, Military 0.30, Judicial 0.22, **Command 0.17** (Command is
  the scarcest — only 30 of 7,349 have Command ≥ 4; it is reserved for the
  genuine top-tier). Most figures are 0–1 across the board; the game leans on a
  thin elite. **[inference]** Skills encode *what the person actually did*
  (legislators get Legislative, generals get Military/Command, administrators
  get Admin), not a uniform power budget.
- **Traits are hand-picked historical characterizations.** 99.4% carry
  `Obscure` (the default "you start unknown" flag); the *distinctive* traits are
  sparse and evocative — `Integrity` (642), `Egghead` (592, scholars),
  `Controversial` (513), `Propagandist`/`Orator`/`Debater` (communicators),
  `Iron Fist`, `Kingmaker`, `Crisis Manager`. **[inference]** Traits are the
  designer's prose-level read of each figure, not a mechanical rollup.
- **Data-quality caveats carried from analysis.md:** name is NOT a unique key
  (40 duplicate names across different eras/people, e.g. Daniel Webster×2, and
  note **"John Kennedy" LA/1976 = the modern Sen. John Neely Kennedy, NOT
  JFK**); dirty ideology/team values leak across columns ("Red" as an ideology,
  "RW Pop" as a team); CSV header typo "Administative"; a few empty bios. Key on
  row index, normalize on import.

---

## Era coverage (by Draft Year; bands from analysis.md)

Draft Year ≈ nearest multiple of 4 to `birthYear + 25`, so the band is roughly
"when this person came of political age." The roster spans **1716→2020** — far
beyond the two shipping scenarios.

| Era band (Draft Year) | Count | Density | Maps to game era |
|---|---|---|---|
| Pre-1789 founding | 560 | Dense for its length | **Ships: 1772 founding scenario** |
| 1789–1829 early republic | 953 | Dense | Playtest eras (Federalist/Jeffersonian; 1800/1820 starts) |
| 1830–1855 antebellum | 992 | **Densest** | **Ships: 1856 antebellum scenario** (feeds it) |
| 1856–1876 CW/Reconstruction | 854 | Dense | Playtest (house-divided 1856→1868) |
| 1877–1899 Gilded | 773 | Solid | Playtest (gilded 1868+) |
| 1900–1932 Progressive | **1046** | **Peak count** | Playtest hinge (1928 start) |
| 1933–1944 New Deal/WWII | 352 | **Thin** (short + fewer authored) | Playtest (1948 start feeds off this) |
| 1945–1968 postwar | 794 | Solid | Playtest (1948/1960 starts) |
| 1969–2000 modern | 915 | Solid | Playtest (1948-continued runs to 2020+) |
| 2001+ contemporary | 110 | **Sparsest** | Tail of modern play |

**Shape:** the roster is **front-and-middle-loaded** — the 19th century
(antebellum + CW + Gilded = ~2,600) and the Progressive Era (1,046) are the
richest seams, precisely covering the two shipping scenarios and the most-played
playtest starts. It **thins sharply after the New Deal** (the 1933–44 band is
the smallest non-contemporary band despite being a marquee era) and is **thinnest
at 2001+** (110). **[inference]** Coverage tracks *authoring effort against the
game's actual play surface*: dense where scenarios ship and playtests cluster
(1772–1900), thinner where play is rarer or the figures are living/recent.

---

## Fidelity spot-check (representative, ~15 figures, cited)

Assessment: **skills, ideology, and bios are historically defensible across
eras**; the roster reflects a designer with real command of the material. Errors
found are minor (mostly OCR/transcription "G-for-C" artifacts in bios, e.g.
"Gommander," "Gettysburg" rendered "Getty…"), not factual. Team-color placements
that *look* wrong are the era-relative mapping working as designed (see next
section).

**Founding / early republic**
- **George Washington** (VA, Red, Mod, DV 120; Cmd 4/Mil 4). Bio: "technically
  independent, almost all of his appointments were Federalists, including all his
  Supreme Court appointments… deferred to Alexander Hamilton early on." ✅
  **Accurate.** Washington was the only president to remain formally non-partisan,
  favored Hamilton's agenda, and filled the *entire* original federal bench
  (Jay + 5) — all Federalist-leaning. ([Mount Vernon](https://www.mountvernon.org/george-washington/the-first-president/george-washington-and-the-supreme-court), [Presidency of Washington, Wikipedia](https://en.wikipedia.org/wiki/Presidency_of_George_Washington)) "Mod/Red" = the era's Federalist-adjacent pole; fits the parent's 1788 mapping (RED = Federalist).
- **Thomas Jefferson** (VA, Blue, RW Pop, DV 104; Cmd 5). Founder of the
  Democratic-Republicans, agrarian, weak-central-government. ✅ Bio accurate. The
  **"RW Pop" ideology is era-relative** — Jefferson's agrarian/states'-rights
  small-government populism reads as the "right-wing populist" pole *in the
  founding taxonomy*, not the modern one; BLUE matches the parent (Dem-Reps =
  BLUE). **[inference]** defensible, though a fair reader could argue "LW Pop."
- **Alexander Hamilton** (NY, Red, Cons, DV 92; Admin 5). Architect of US
  finance, Caribbean-born, Federalist Papers, first Treasury Secretary. ✅
  Accurate; Admin 5 is apt for the system-builder. Red/Cons = Federalist pole.
- **Benjamin Franklin** (PA, Red, Mod, DV 140; Admin 4). Diplomat to France,
  first Postmaster General, governed PA 1785–88. ✅ Accurate.

**Antebellum / Jacksonian**
- **Andrew Jackson** (TN, Blue, RW Pop, DV 113; Cmd 5/Mil 3). First Democratic
  president, "popular democracy," 1824 "Corrupt Bargain," War of 1812/Creek/
  Seminole. ✅ Accurate. BLUE/RW-Pop fits the Jacksonian *common-man* pole in the
  parent's 1828–56 mapping.
- **Henry Clay** (KY, Blue, Mod, DV 140; **Legislative 5**). "Great Compromiser,"
  Speaker, founder of National Republican + Whig parties, American System. ✅
  Accurate; Legislative 5 is the roster's signature for the master legislator.
  *Note:* Clay was the **anti-Jackson** (Whig) leader, yet is BLUE here alongside
  Jackson — a reminder the game's 1828–56 BLUE token is the older Dem-Rep/
  Jacksonian bucket and does **not** cleanly separate Whig-vs-Democrat (matches
  the parent's note that the game keeps the old labels too long).
- **John C. Calhoun** (SC, Blue, Cons, DV 96). ✅ Nullification/states'-rights/
  pro-slavery — Cons ideology and the Southern-Democratic BLUE pole both fit.
- **Stephen A. Douglas** (IL, Blue, Mod, DV 91) and **Frederick Douglass** (NY,
  Red, Prog, DV 53). ✅ Douglas = Northern Democrat (Blue), Douglass = the
  antislavery/progressive pole (Red/Prog, matching the 1856 flip where RED = the
  antislavery party). Clean.

**Civil War / Reconstruction**
- **Abraham Lincoln** (IL, Red, Mod, DV 118; Cmd 5). ✅ Bio accurate (16th
  President, preserved the Union, abolished slavery, transcontinental railroad,
  Gettysburg Address, assassinated). RED = the 1856/1868 antislavery-Republican
  polarity; "Mod" fits Lincoln's pragmatic self-positioning.
- **Ulysses S. Grant** (OH, Red, Mod, DV 66; Cmd 5). ✅ Union commanding general,
  unanimously nominated by Republicans, elected 1868, enforced Reconstruction.
  ([NPS: "Let Us Have Peace"](https://www.nps.gov/articles/000/-let-us-have-peace-ulysses-s-grant-and-the-election-of-1868.htm), [Miller Center](https://millercenter.org/president/grant/life-in-brief)) Red = Republican; Command 5 well-earned.

**Progressive Era**
- **Robert La Follette** (WI, Red, Prog, DV 70). ✅ "Fighting Bob," Wisconsin
  progressive, a Republican for most of his life, ran his own Progressive Party
  in 1924 (16.6% of the popular vote). ([Senate bio](https://www.senate.gov/senators/FeaturedBios/Featured_Bio_LaFollette.htm), [Britannica](https://www.britannica.com/biography/Robert-M-La-Follette)) Red/Prog captures the *insurgent-Republican progressive* exactly — a good illustration that in the 1896–1932 hinge, progressivism lived inside the RED (Republican) party.
- **Theodore Roosevelt** (NY, Red, Lib, DV 139) / **William Jennings Bryan**
  (NE, Blue, Prog, DV 72) / **Woodrow Wilson** (NJ, Blue, Lib, DV 88). ✅
  Era-consistent: TR = Republican (Red); Bryan/Wilson = Democrats (Blue). "Lib"
  for TR/Wilson is period-correct (early-20th-c. reform "liberalism"), not the
  modern sense — anchor to year, per the parent.

**New Deal / postwar / modern**
- **Franklin D. Roosevelt** (NY, Blue, Lib, DV 114) — ✅ New Deal Democrat, BLUE,
  and "Lib" in its *newly redefined* 1932 sense (the parent's key polarity event).
- **Ronald Reagan** (CA, **Blue**, Cons, DV 99, draftYear **1936**) — the
  standout mapping case. **Reagan was a registered Democrat and New Deal/FDR
  supporter until he registered Republican in fall 1962.** ([PolitiFact](https://www.politifact.com/factchecks/2010/mar/30/charlie-crist/crist-says-reagan-was-democrat-converting-gop/), [TIME](https://content.time.com/time/specials/packages/article/0,28804,1894529_1894528_1894518,00.html)) At his draft-era (mid-1930s) his real alignment was Democratic — so **BLUE is defensible under the era-relative convention** even though he is the archetypal Republican; the "Cons" ideology captures his mature character. This one entry is the cleanest proof that the roster assigns team by *era-of-entry alignment*, not by a figure's most-famous party.
- **Richard Nixon** (CA, Red, Cons, 1940) vs **Reagan** (Blue, 1936): two
  Republican presidents on **opposite teams**. Same for **Donald Trump** (NY,
  Blue, RW Pop, 1972) and **Nancy Pelosi** (CA, Blue, Lib, 1968) both **BLUE**
  despite opposite modern parties, while **Joseph McCarthy** (WI, Red, RW Pop,
  1936) is Red. ✅ These are not errors — they are the era-relative token doing
  its job (see next section).

**Verdict:** high fidelity. Across ~15 checks spanning every era, no factual
ideology/skill error surfaced; the only defects are cosmetic OCR artifacts in
bio prose and the known dirty-value/duplicate-name issues from analysis.md.

---

## ★ Alt-history / counterfactual / imported entries (intentional content)

The roster **deliberately** includes non-historical entries. These are **game
content, not data errors** — flag them so downstream agents don't "correct" them.
Three classes:

1. **Counterfactuals (real person, alt-history premise).**
   - **Napoleon Bonaparte** (LA, Red, Mod, **DV 241 = roster max**; Cmd 5/Mil 5/
     22 traits). Bio: *"What if Napoleon had escaped his captors and landed in
     New Orleans?"* In reality Napoleon died in **British captivity on St. Helena,
     May 5, 1821**, and never escaped (Gov. Hudson Lowe was appointed expressly to
     prevent a repeat of his Elba escape). ([napoleon.org](https://www.napoleon.org/en/young-historians/napodoc/from-waterloo-to-the-island-of-st-helena/), [HISTORY](https://www.history.com/this-day-in-history/may-5/napoleon-dies-in-exile)) The premise (a French emperor in Louisiana ~1796–1815) is pure alt-history; his god-tier DV/skills make him an intentional wildcard unit. **[consensus]** on the real fate; the entry is knowingly fictional.
2. **Fictional / joke entries.**
   - **"Duopoly Patine-Mambo"** (Canada, Blue, LW Pop, **DV −25 = roster min**) —
     the last row, an invented name at the floor of the DV distribution. A
     deliberate placeholder/joke unit, not a historical figure. **[inference]**
3. **Imported-foreign (real non-Americans placed on the US board).**
   - **Stephen Harper** ("Canada", Blue, Cons, 1984) — the real Canadian PM,
     imported. Several `state:"Canada"` entries exist; treat as intentional
     foreign imports, not mis-stated US politicians.

**Do-not-confuse note:** not every "Bonaparte" is alt-history. **Charles J.
Bonaparte** (MD, Red, Lib, 1876, DV 21) is a **real American** — Napoleon's
grandnephew, TR's Secretary of the Navy then Attorney General, who founded the
Bureau of Investigation (later FBI) on July 26, 1908, and championed
"progressive and liberal causes" (matching his Red/Lib tag).
([DOJ bio](https://www.justice.gov/ag/bio/bonaparte-charles-joseph), [FBI](https://www.fbi.gov/history/history-publications-reports/the-birth-of-the-federal-bureau-of-investigation)) The roster distinguishes the historical Bonaparte (DV 21, real bio) from the counterfactual one (DV 241, "what if").

---

## Ideology / team mapping vs. real party alignment

**Conclusion (confirms + extends the parent's "Cross-era polarity map"):** the
authored `Initial Team Color` (Red/Blue) is an **ahistorical, era-relative
token, assigned by each figure's alignment in their draft-era**, and it does
**NOT** encode modern GOP-red / Dem-blue. The roster is in fact **stronger
evidence for this than the playtests**, because it exposes cases that break
*within-party* consistency:

- **Two Republican presidents on opposite teams:** Reagan = **Blue** (drafted
  1936, when he was a real FDR Democrat), Nixon = **Red** (drafted 1940). Team
  tracks *era-of-entry alignment*, not lifetime party.
- **Modern opposites share a team:** Trump (Blue/RW Pop) and Pelosi (Blue/Lib)
  are both **Blue**; McCarthy is **Red**. So Blue ≠ "the Democrats" as a fixed
  identity across the file.
- **The 1856 flip is baked in:** antislavery figures are **Red** (Lincoln,
  Grant, Douglass, Sumner, Chase, Stevens, La Follette-lineage Republicans),
  pro-slavery/Southern-Democratic figures are **Blue** (Calhoun, Jefferson Davis,
  Douglas) — the **reverse** of modern polarity, exactly as the parent's map and
  `scenario1856.ts` enthusiasm table specify.
- **Founding pole:** Federalists **Red** (Washington, Hamilton, Adams,
  Franklin), Jeffersonians **Blue** (Jefferson, Madison) — the parent's
  1788/1800/1820 mapping.

**Ideology values** (`Mod` 46%, `Cons` 26%, `Lib` 15%, `Trad`/`Prog`/`LW Pop`/
`RW Pop` the tails) are likewise **era-relative labels applied to each figure's
own time**: "Lib" means Progressive-Era reform liberalism for Wilson/TR and New
Deal liberalism for FDR/Reagan-era Democrats and modern liberalism for Obama —
three different things. **Anchor every ideology read to the figure's `draftYear`,
never the bare word** — the same discipline the parent already prescribes.

**[inference]** The mapping's internal rule appears to be: *place a figure on the
team of the coalition they belonged to when they entered politics, and label
their ideology in that era's spectrum.* This is coherent and deliberate; it just
must never be read through the modern lens.

---

## Targeted additions for the parent `historical-context.md` (2–4 bullets)

The orchestrator could later fold these one-liners into the named era sections:

- **Founding §1 & Federalist §2:** add a note that the **hand-authored roster
  grounds these eras** — Washington (Red/Mod, "independent but Federalist
  appointments"), Hamilton (Red/Cons, Admin 5), Jefferson (Blue/RW-Pop),
  Franklin (Red/Mod) — team polarity matching the parent's 1788 map.
- **Cross-era polarity map (read-first):** cite the roster's **Reagan=Blue
  (drafted 1936, a real FDR-era Democrat) vs Nixon=Red** pair as the crispest
  single illustration that team = era-of-entry alignment, not lifetime party.
- **Antebellum §3:** note the roster **feeds the 1856 scenario from its densest
  band (992 antebellum + 854 CW)** and encodes the flip (Red = antislavery
  Lincoln/Grant/Douglass/Sumner; Blue = Calhoun/Davis/Douglas).
- **Data/authoring note (anywhere global):** the roster carries intentional
  **alt-history units** (Napoleon, DV 241, "what if… New Orleans"; the fictional
  DV −25 "Duopoly Patine-Mambo"; imported foreigners like Stephen Harper) —
  these are content, not errors, and must not be "corrected."

---

## Citations

- Mount Vernon — Washington & the Supreme Court (all-Federalist original bench, non-partisanship): https://www.mountvernon.org/george-washington/the-first-president/george-washington-and-the-supreme-court
- Wikipedia — Presidency of George Washington (favored Hamilton's agenda; non-partisan): https://en.wikipedia.org/wiki/Presidency_of_George_Washington
- DOJ — AG bio, Charles Joseph Bonaparte (real Bonaparte; Navy Sec → AG under TR): https://www.justice.gov/ag/bio/bonaparte-charles-joseph
- FBI — Birth of the Bureau of Investigation (Bonaparte, July 26, 1908): https://www.fbi.gov/history/history-publications-reports/the-birth-of-the-federal-bureau-of-investigation
- napoleon.org — Waterloo to St. Helena (British captivity; Lowe prevents escape): https://www.napoleon.org/en/young-historians/napodoc/from-waterloo-to-the-island-of-st-helena/
- HISTORY — Napoleon dies in exile, May 5, 1821: https://www.history.com/this-day-in-history/may-5/napoleon-dies-in-exile
- PolitiFact — Reagan was a Democrat before converting to the GOP (registered Republican 1962): https://www.politifact.com/factchecks/2010/mar/30/charlie-crist/crist-says-reagan-was-democrat-converting-gop/
- TIME — The Crist Switch / Reagan 1962 party defection: https://content.time.com/time/specials/packages/article/0,28804,1894529_1894528_1894518,00.html
- U.S. Senate — Robert La Follette featured bio ("Fighting Bob," Republican progressive, 1924 Progressive Party): https://www.senate.gov/senators/FeaturedBios/Featured_Bio_LaFollette.htm
- Britannica — Robert M. La Follette (progressivism; 16.6% in 1924): https://www.britannica.com/biography/Robert-M-La-Follette
- NPS — "Let Us Have Peace": Grant & the Election of 1868 (Republican nominee, Reconstruction): https://www.nps.gov/articles/000/-let-us-have-peace-ulysses-s-grant-and-the-election-of-1868.htm
- Miller Center — Ulysses S. Grant, Life in Brief (commanding general; broke with Johnson): https://millercenter.org/president/grant/life-in-brief
- Internal: `docs/game/sources/politician-dataset/analysis.md` (schema, distributions, reconciliation, data-quality), `sample.md` (decoded marquee), `merged.json` (7,349 records), and `historical-context.md` "Cross-era polarity map".
