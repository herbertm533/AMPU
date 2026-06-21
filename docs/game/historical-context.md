# AMPU — Historical Context

> **Bootstrap pass (ingest mode).** One section per era the knowledge base
> currently touches: **Founding/Revolution (1772–1788)**, **Federalist era
> (1788–1800)**, **Antebellum (c. 1856)**, **Gilded Age (1868–1892)**. This is
> the game-pm / game-master's ground-truth reference for era-accurate framing —
> what really happened, what the game models, and where the two **diverge or
> risk anachronism**. It is *research, not design*: it states historical facts
> and flags mismatches; it does not prescribe mechanics.
>
> **How to read it.** Each era has: a one-line **window**, **binding facts**
> (treat as ground truth), **key figures**, a tight **timeline**, the real
> **factions/ideologies**, **period terminology** (the load-bearing part — see
> the polarity-flip warnings), **pop-history corrections**, and a **Game
> treatment vs. real history** subsection (concrete divergence notes citing the
> shipped data + a digest + a source). Confidence is tagged inline:
> **[consensus]**, **[contested]**, **[inference]**.
>
> **The single most important cross-era fact:** party labels and the
> left/right meaning of BLUE/RED **reverse across the timeline**. Do not carry a
> faction's polarity from one era into another. See "Cross-era polarity map"
> immediately below, then each era's terminology section.

## Cross-era polarity map (read first)

The game's two parties are fixed tokens **BLUE** and **RED**; their real-world
identity and left/right polarity change era to era. Current shipped mapping
(`factions1772.ts:26-29`, `factions1856.ts:19-22`):

| Era | BLUE = | RED = | Left pole sits with | Note |
|---|---|---|---|---|
| 1772 Founding | "Patriots (Anti-Federalist)" | "Federalists" | BLUE (Patriots) | **Anachronistic labels** — neither party existed in 1772; see Founding §terminology |
| 1788 Federalist | Democratic-Republicans (Jefferson) | Federalists (Hamilton) | BLUE (Dem-Reps) | The *fed* digest assigns BLUE=Dem-Rep, RED=Federalist (digest post 2) |
| 1856 Antebellum | **Democratic Party** | **Republican Party** | **RED (Republicans)** | **POLARITY FLIP**: here the antislavery/progressive pole is RED, the conservative/pro-slavery pole is BLUE (`scenario1856.ts:18-31` enthusiasm table) |
| 1868 Gilded Age | Democrats ("Solid South") | National Republicans | RED (Republicans) | Continues the 1856 polarity (Republicans = the Union/Reconstruction party); *gilded* digest post 298 |

**[consensus]** The word "Federalist" alone reverses meaning twice across this
range: a *position* in 1787-88 (pro-Constitution), then *Hamilton's party*
(1791-1815), and the polarity of "states' rights" migrates from the
Anti-Federalist/Jeffersonian left-of-center to the antebellum Southern
Democratic right. Treat every era's party framing as independent.

---

## 1. Founding / Revolution / Confederation (1772–1788)

### Era window
1772 (Gaspee Affair) → 1788 (ninth state ratifies the Constitution, **June 21,
1788**). Engine era `independence`; transitions to `federalism` on ratification
(`constitutionalConvention.ts:198`). The shipped 1772 scenario lives entirely
here.

### Binding facts (ground truth)
- **No political parties existed in this period.** **[consensus]** During the
  1787-88 ratification fight, "Federalist" and "Anti-Federalist" were *labels
  for positions on the Constitution*, not organized parties; formal parties did
  not exist, and leading politicians distrusted "factions." Federalists became a
  party only *after* the new government convened in 1789, and the opposition
  organized later still. ([LoC](https://www.loc.gov/exhibits/creating-the-united-states/formation-of-political-parties.html), [Battlefield Trust](https://www.battlefields.org/learn/articles/rise-political-parties))
- **The colonists were not a unified bloc.** **[consensus]** Modern scholarship:
  ~15-20% of adult white males remained Loyalist; ~40-45% of the free population
  actively supported the Patriots; the remainder were neutral/fence-sitting. The
  popular "John Adams said one-third / one-third / one-third" claim is a myth —
  Adams's 1815 letter was about French-Revolution sympathy, not the American
  Revolution. ([Journal of the American Revolution](https://allthingsliberty.com/2013/02/john-adamss-rule-of-thirds/), [NPS](https://www.nps.gov/teachers/classrooms/loyalists-in-american-revolution.htm))
- **The Constitution required nine of thirteen states; ratification was close
  in the states that mattered.** **[consensus]** Delaware ratified first
  (unanimous, 30-0, Dec 7 1787); New Hampshire was the decisive ninth (57-47,
  June 21 1788); Massachusetts 187-168, Virginia 89-79, New York 30-27 — narrow
  Federalist wins. ([National Archives](https://www.archives.gov/founding-docs/more-perfect-union), [Constitution Center](https://constitutioncenter.org/blog/the-day-the-constitution-was-ratified))
- **There was no national executive, no presidency, no federal judiciary, and no
  standing two-party Congress until the Constitution.** Governance ran through
  the Continental Congress (1774-81) and then the Articles of Confederation
  (in force 1781-89), under which Congress had no taxing power and states were
  near-sovereign. **[consensus]**

### Key figures
- **Samuel Adams** — organized the Committees of Correspondence and Boston
  agitation. The game references him in event flavor (`eraEvents1772.ts`
  boston_tea_party, committees_of_correspondence). **[consensus]**
- **Thomas Jefferson** — principal author of the Declaration (1776). Game faction
  "Jefferson's Patriots" (BLUE/RW, `factions1772.ts:16`). *Note:* placing
  Jefferson at the **RW Populist** pole in 1772 is an artifact of mapping him
  forward to his later states'-rights identity; in 1772 the relevant axis is
  Patriot vs. Loyalist, not left/right. **[inference]**
- **George Washington** — commander of the Continental Army (1775-83); later the
  unanimous first president. Game faction "Washington Patriots" (RED/Center). **[consensus]**
- **Benjamin Franklin, John Jay, John Adams** — diplomats/negotiators (Treaty of
  Paris 1783) and, later, leading Federalists. Game has "Franklin Patriots,"
  "Jay Federalists," "Adams Patriots." **[consensus]**
- **Oliver Ellsworth** — Connecticut delegate, later Chief Justice; the game's
  "Ellsworth Progressives" (RED/LW) is a stretch — Ellsworth was a Federalist
  centrist, not a progressive. **[inference]**

### Timeline of relevant events
- **1772** — Gaspee Affair (RI colonists burn HMS Gaspee). **[consensus]**
- **1772-73** — Committees of Correspondence organize. **[consensus]**
- **1773** — Tea Act (May); Boston Tea Party (Dec 16, 342 chests). **[consensus]**
- **1774** — Coercive/"Intolerable" Acts; First Continental Congress (Sept-Oct,
  Philadelphia). **[consensus]**
- **1775** — Lexington & Concord (Apr 19); Second Continental Congress; Continental
  Army created (Washington commander, June). **[consensus]**
- **1776** — *Common Sense* (Jan); Declaration of Independence (July 4). **[consensus]**
- **1777-81** — Articles of Confederation drafted (1777), ratified (1781);
  French alliance (1778). **[consensus]**
- **1783** — Treaty of Paris ends the war. **[consensus]**
- **1786-87** — Annapolis Convention → Constitutional Convention (Philadelphia,
  summer 1787). **[consensus]**
- **1787-88** — Ratification, state by state. **[consensus]**

### Era-appropriate factions / ideologies / interests
The real cleavages, in rough order of salience: **Patriot vs. Loyalist** (the
dominant axis), then within the Patriot camp **radical independence men**
(Sam Adams, Henry) vs. **reconciliationists/moderates** (Dickinson). After 1781,
the live fight was **Confederation vs. stronger central union** — the seedbed of
the 1787-88 Federalist/Anti-Federalist split. Economic interests: **merchants**
(coastal, pro-trade), **planters** (Southern, slaveholding), **small farmers**
(Western, debtor-leaning, anti-tax — Shays's Rebellion 1786-87). The game's
"Sons of Liberty / Merchants / Planters / Settlers" interest cards
(`factions1772.ts`) map onto this reasonably.

### Period-specific terminology
- **Use:** Patriot, Loyalist (or Tory), Whig (colonial sense = pro-liberty),
  delegate, the Continental Congress, the Confederation. Colony-correct executive
  titles (the *1772s* digest researched these: "President of the Supreme
  Executive Council of Pennsylvania," "1st President of Delaware") — the game
  currently uses a generic "Governor" label (gap-log A5).
- **Avoid / handle with care:** "Federalist" and "Anti-Federalist" as *party*
  names before ~1787; "Democrat"/"Republican" (neither exists); modern
  "liberal"/"conservative" (the operative axis is loyalty to crown, not
  left/right); "President of the United States" before 1789.

### Common pop-history simplifications and what they get wrong
- **"The Founders were a unified bloc."** **[consensus]** They were not — the
  Convention itself was a fight (large vs. small states, North vs. South over
  slavery and trade), and ratification nearly failed in Virginia and New York.
- **"Everyone supported the Revolution."** False (see Loyalist figures above).
- **"The Three-Fifths Compromise counted slaves as 3/5 of a person as a measure
  of their worth."** **[consensus, neutral framing]** Mechanically it apportioned
  House seats and direct taxes by counting each enslaved person as 3/5 for
  representation — a *political* bargain inflating Southern congressional power,
  not a statement of human worth. Describe it as the apportionment device it was.

### Game treatment vs. real history (divergence notes)
- **Anachronistic party labels.** `factions1772.ts:26-29` ships BLUE = "Patriots
  (Anti-Federalist)" and RED = "Federalists" *in 1772* — but neither party
  existed until ~1787-88, and "Anti-Federalist" as a label is *defined by
  opposition to a Constitution that won't be written for 15 years*
  ([LoC](https://www.loc.gov/exhibits/creating-the-united-states/formation-of-political-parties.html)).
  The *1772s* digest itself runs the era as **Patriot proto-blocs**, and the
  game-context already flags Party Leaders / inter-party conversion as
  **off in `independence`** (digest posts 6-7; gap-log #30). Framing guidance:
  treat BLUE/RED in 1772 as *pre-party coalitions* (Patriot-leaning vs.
  cautious/elite-mercantile), not the named First-Party-System parties.
- **Ideology axis is forward-projected.** The 7-point `LW Populist … RW Populist`
  scale is applied in 1772 (factions carry `eligibleIdeologies`), but the real
  1772 axis is Patriot/Loyalist + radical/moderate. "Jefferson's Patriots = RW
  Populist" and "Ellsworth Progressives = LW" are forward-projections, not 1772
  reality. **[inference]** Acceptable as a game abstraction; just don't narrate
  it as historical.
- **No-government start is accurate.** The scenario correctly boots with no
  president/cabinet/courts and unlocks them via era events
  (`scenario1772.ts:99-105`, governorsExist:false) — this matches the real
  institutional vacuum under the Continental Congress/Articles. **[consensus]**
- **Event spine is solid.** `ERA_GRAPH_1772` (gaspee → tea_act → boston_tea_party
  → intolerable_acts → …) matches the real chronology closely. The *1772s* digest
  flags a *scheduling-model* divergence (historical-year-sorted vs. the build's
  precondition graph) but not a factual one (digest B1).

---

## 2. Federalist era (1788–1800)

### Era window
1788/89 (first federal elections; Washington inaugurated **April 1789**) →
1800/01 (Jefferson's election, the first partisan turnover). Engine era
`federalism`. **No shipped scenario** — the *fed* digest (1788 "Orange
Democracy") is the de facto spec.

### Binding facts (ground truth)
- **Parties did not exist at the 1788-89 founding elections and formed
  *during* the 1790s.** **[consensus]** Washington was elected unanimously (all
  69 electors, 1789) with no running-mate concept and no party machinery; both
  loose factions backed him. The **Federalist Party coalesced ~1791 around
  Hamilton's program**; the **Jeffersonian Republican (Democratic-Republican)
  Party organized ~1792**; **1796 was the first genuinely partisan presidential
  election.** ([Reagan Library / National Archives](https://www.reaganlibrary.gov/american-elections-and-campaigns-1788-1800-rise-political-factions-early-republic), [First Party System overview](https://en.wikipedia.org/wiki/First_Party_System))
  *Note:* the "1791 vs 1792" founding dates are approximate and debated by
  historians — **[contested]**; treat party formation as a *process across
  1791-96*, not a single dated event.
- **The defining fight was Hamilton's financial program vs. Jefferson/Madison's
  agrarian states'-rights opposition.** Assumption of state debts, the Bank of
  the United States, the Mint, the tariff, excise taxes — all Hamiltonian, all
  opposed by the emerging Republicans. ([First Party System](https://en.wikipedia.org/wiki/First_Party_System), [Battlefield Trust](https://www.battlefields.org/learn/articles/rise-political-parties))
- **Presidential electors were chosen by *state legislatures* in many states well
  into the 1790s** — not by popular vote. This was decisive in close elections.
  **[consensus]** (The *fed* digest models this as a per-state `electionMethod`;
  gap-log #44.)
- **Senators were chosen by state legislatures** (until the 17th Amendment,
  1913) — both shipped scenarios already assume this (`senatePre17`). **[consensus]**
- **Sectional/slavery tension was already live but state-level:** several
  Northern states passed gradual-abolition laws in this window, while the cotton
  gin (1793) began making Southern slavery more entrenched. **[consensus]**

### Key figures
- **Alexander Hamilton** — Treasury Secretary; architect of the financial
  program and the Federalist Party. The *fed* player runs "Arch Federalists =
  Hamilton" (RED). **[consensus]**
- **Thomas Jefferson** — Secretary of State, then opposition leader; founder of
  the Democratic-Republicans. **[consensus]**
- **James Madison** — Hamilton's *Federalist Papers* co-author who then broke
  with him to co-found the Republican opposition (a key non-obvious arc). **[consensus]**
- **George Washington** — president 1789-97; nominally above party but governed
  with a Hamiltonian tilt; Farewell Address (1796) warned against parties. **[consensus]**
- **John Adams** — Federalist; president 1797-1801; the Federalists' high-water
  mark and then their decline (Alien & Sedition Acts; the 1800 loss). **[consensus]**

### Timeline of relevant events
- **1789** — Washington inaugurated; Judiciary Act; first Congress; cabinet
  formed. **[consensus]**
- **1790** — Compromise of 1790 (assumption of debt ⇄ capital on the Potomac). **[consensus]**
- **1791** — Bank of the United States chartered; Federalist Party coalescing. **[consensus]**
- **1792** — Republican opposition organizing; Washington re-elected. **[consensus]**
- **1793** — Cotton gin; Neutrality Proclamation (French Revolutionary wars). **[consensus]**
- **1794** — Whiskey Rebellion (suppressed); Jay Treaty (UK). **[consensus]**
- **1796** — First partisan election (Adams over Jefferson). **[consensus]**
- **1798** — XYZ Affair; Quasi-War with France; Alien & Sedition Acts. **[consensus]**
- **1800** — Jefferson elected ("Revolution of 1800"); peaceful party turnover. **[consensus]**

### Era-appropriate factions / ideologies / interests
**Federalists** (RED in *fed*): commercial/financial North, pro-British-trade,
strong central government, loose constitutional construction, elite-leaning.
**Democratic-Republicans** (BLUE): Southern planters + Western farmers +
artisan/urban democrats, pro-French, strict construction, states'-rights,
agrarian. **[consensus]** This is a **Moderate/Conservative-dominated era** on
the game's scale (the *fed* digest: "those [LW] ideos don't really matter this
era," post 136) — strong support for an era-specific drafting profile (gap-log #4).

### Period-specific terminology
- **Use:** Federalist (now meaning *Hamilton's party*), Democratic-Republican /
  Jeffersonian Republican / "Republican" (Jefferson's party — **not** the modern
  GOP), Anti-Federalist (fading; the older ratification-opponents), "the
  Republican interest," states'-rights, strict vs. loose construction.
- **Avoid:** "Democrat" as a party name (the Democratic Party proper dates from
  the late 1820s, Jackson); modern "liberal/conservative." Note the
  **terminology trap:** the era's "Republicans" are the *ancestors of the modern
  Democratic Party*, the polar opposite of the 1856+ Republicans.

### Common pop-history simplifications and what they get wrong
- **"The Founders intended a two-party system."** **[consensus]** The opposite —
  Washington's Farewell Address and *Federalist No. 10* warned against parties;
  parties emerged *despite* the framers' intentions.
- **"Washington was a Federalist."** **[contested/inference]** He never formally
  joined a party and styled himself above faction, though his administration
  leaned Hamiltonian. Narrate him as nonpartisan-in-name.
- **"Jefferson's Republicans = today's Republicans."** False — opposite lineage
  (they become the Democratic Party).

### Game treatment vs. real history (divergence notes)
- **Era is unbuilt; the digest is the spec.** No `scenario1788`, no federalism
  faction roster in shipped data (game-context gap-log #1/Federalism). The *fed*
  digest supplies a 10-faction roster (post 2) with **period-correct names**
  (Arch Federalists, Old Republicans, Fusion Democratic-Republicans) that are
  far more era-accurate than the generic 1772 placeholder names.
- **"Party-formation as era events" is historically apt.** The *fed* digest
  fires "Federalists Formed" / "Jeffersonian Republicans Formed" as ~1792 events
  (post 140) — this correctly models that **the party names literally did not
  exist at game start in 1788** ([Reagan Library](https://www.reaganlibrary.gov/american-elections-and-campaigns-1788-1800-rise-political-factions-early-republic)).
  Good fidelity; preserve it.
- **Per-state legislature-vs-popular elector selection is real and load-bearing.**
  The digest's `electionMethod` flag (CT/GA/MA/NJ/NY/RI/SC legislature-chosen in
  1796; gap-log #44) matches the historical record **[consensus]**. The specific
  state list should be **verified against a source before committing to a
  mechanic** — *uncertain* which exact seven, as practice changed election to
  election.
- **The "1800-start loses the Louisiana Purchase" bug** (BUG-1) is a *content
  gating* defect, not a history error — but note the Louisiana Purchase (1803)
  is genuinely a *nationalism*-era event, not federalism, so era-locking it
  correctly is also a chronology question. **[consensus]**

---

## 3. Antebellum / sectional crisis (c. 1856)

### Era window
Shipped 1856 scenario, engine era `nationalism`. Event spine runs 1856 (Bleeding
Kansas) → 1861 (Trent Affair) (`eraEvents1856.ts`). Bounding context: Compromise
of 1850 → Kansas-Nebraska Act (1854) → secession (1860-61).

### Binding facts (ground truth)
- **The 1856 party system was brand new and three-way.** **[consensus]** The
  **Republican Party formed in 1854** out of anti-slavery Whigs, **Free-Soilers**,
  and anti-Nebraska Democrats, to oppose slavery's *expansion*; the Whig Party had
  collapsed. ([History of the Republican Party](https://en.wikipedia.org/wiki/History_of_the_Republican_Party_(United_States)), [Free Soil Party](https://en.wikipedia.org/wiki/Free_Soil_Party))
- **The Know-Nothing / American Party was a SEPARATE party in 1856, not a
  Republican faction.** **[consensus]** It was nativist/anti-Catholic, ran Millard
  Fillmore, and the 1856 race was a three-sided Democrat vs. Republican vs.
  Know-Nothing contest. Northern Know-Nothings later defected toward the
  Republicans, but in 1856 they were a rival. ([Republican Party history](https://en.wikipedia.org/wiki/History_of_the_Republican_Party_(United_States)), [AP via NY1](https://ny1.com/nyc/all-boroughs/ap-top-news/2025/07/09/how-the-know-nothings-free-soilers-and-other-third-parties-shaped-us-politics))
- **1856 result:** Buchanan (Democrat) **174 electoral votes**, Frémont
  (Republican) **114**, Fillmore (American) **8**. **[consensus on outcome;
  exact EC numbers consistent across National Archives + Britannica snippets but
  could not directly fetch the archive page — verify the 174/114/8 split before
  baking into a fixed mechanic.]** Frémont won a *plurality of free states*
  (~45% there) but had **virtually zero Southern support**; Buchanan was the only
  truly national candidate. ([Wikipedia 1856 election](https://en.wikipedia.org/wiki/1856_United_States_presidential_election), [Britannica](https://www.britannica.com/event/United-States-presidential-election-of-1856))
- **The defining issue was slavery's *expansion into the territories*, not
  (yet) nationwide abolition.** Democrats backed "popular sovereignty"/expansion;
  Republicans opposed expansion (Free Soil); only a minority were abolitionists.
  **[consensus]** ([Miller Center](https://millercenter.org/president/buchanan/campaigns-and-elections))
- **Buchanan was president (inaugurated March 1857), not in 1856.** The scenario
  correctly seats Buchanan (`scenario1856.ts` boots mid-government). **[consensus]**

### Key figures
- **James Buchanan** (Democrat) — won 1856, president 1857-61; widely ranked a
  failure for aggravating sectional crisis. Seated in the scenario. **[consensus]**
- **John C. Frémont** (Republican) — first Republican presidential nominee, 1856. **[consensus]**
- **Millard Fillmore** (American/Know-Nothing) — ex-Whig president running on the
  nativist ticket. **[consensus]**
- **Stephen Douglas** (Democrat) — "popular sovereignty"; Kansas-Nebraska author.
  **[consensus]**
- **Roger Taney** — Chief Justice; *Dred Scott* (1857), modeled as an era event
  (`eraEvents1856.ts` dredScott1857). **[consensus]**

### Timeline of relevant events
- **1854** — Kansas-Nebraska Act; Republican Party founded. **[consensus]**
- **1856** — "Bleeding Kansas" violence; Brooks canes Sumner; Buchanan elected. **[consensus]**
- **1857** — *Dred Scott*; Panic of 1857. **[consensus]**
- **1859** — John Brown's raid on Harpers Ferry. **[consensus]**
- **1860** — Lincoln elected; South Carolina secedes (Dec). **[consensus]**
- **1861** — Secession Winter; Fort Sumter (Apr, war begins); Trent Affair (Nov). **[consensus]**

### Era-appropriate factions / ideologies / interests
**Democrats** (BLUE): the dominant national party, split North/South — Southern
"slave power" (planters, pro-expansion) + Northern "popular sovereignty"
(Douglas) + Unionist/border + Northern urban/immigrant (the game's
Loco-Foco/Jacksonian wings). **Republicans** (RED): a Northern sectional
coalition — Free-Soilers, antislavery ex-Whigs, a smaller radical/abolitionist
wing, Northern industry/protectionism. **Know-Nothings** (nativist) are a
*separate* party. **[consensus]** Interest blocs that matter: Slave Power /
Planters, Abolitionists, Northern Industry/Manufacturers, Free-Soil Settlers,
Immigrants vs. Nativists.

### Period-specific terminology
- **THE BIG ONE — polarity is flipped vs. modern usage.** In 1856 the
  **Democratic Party is the conservative, states'-rights, pro-slavery party**
  and the **Republican Party is the new antislavery/free-labor/(relatively)
  progressive party**. The shipped enthusiasm table encodes exactly this:
  Traditionalist/RW-Populist/Conservative lean **BLUE** (Democratic);
  Progressive/Liberal/LW-Populist lean **RED** (Republican)
  (`scenario1856.ts:18-31`). **Do not** import the modern "Democrat=left,
  Republican=right" mapping.
- **Use:** Free Soil, popular sovereignty, "the Slave Power," Fire-Eaters
  (Southern radical secessionists), Border Ruffians, Copperheads (later),
  Unionist, Doughface (a Northern man with Southern sympathies, e.g. Buchanan).
- **Avoid:** treating "Republican" as the modern GOP or "Democrat" as the modern
  party; "civil rights" in the modern sense; "liberal/conservative" without the
  era-flip caveat.

### Common pop-history simplifications and what they get wrong
- **"Republicans in 1856 wanted to abolish slavery."** **[consensus]** No — the
  mainstream Republican position was *no expansion* (Free Soil); abolitionists
  were a minority wing. Lincoln in 1860 ran on non-extension, not abolition.
- **"The Know-Nothings were Republicans."** False — separate party in 1856 (see
  binding facts).
- **"The North was solidly antislavery and the South solidly pro-secession."**
  **[consensus]** Both regions had deep internal cleavages — Northern Democrats
  and Doughfaces; Southern Unionists and non-slaveholding whites; border states
  that never seceded.
- **"Manifest Destiny was a national consensus."** **[consensus]** The term was
  coined by O'Sullivan in 1845 and became prominent largely *because Whigs
  attacked it*; Whigs and antislavery Northerners opposed expansion as a
  "slave-power" scheme. The game's `Manifestdestiny` ideology card on the
  Popular-Sovereignty Democrats (`factions1856.ts:6`) should be read as a
  *Democratic* position, not a shared one. ([Manifest Destiny](https://en.wikipedia.org/wiki/Manifest_destiny))

### Game treatment vs. real history (divergence notes)
- **Mostly strong fidelity.** The 1856 factions (`factions1856.ts`) are the
  best-researched in the shipped data: Conservative/Popular-Sovereignty/
  Unionist/Jacksonian/Loco-Foco Democrats and Crittenden/Moderate/Liberal/
  Radical/Know-Nothing Republicans capture the real intra-party wings.
- **Two faction-placement flags:**
  - **"Know-Nothing Republicans"** (`factions1856.ts:16`) folds the nativist
    American Party *into* RED as a Republican sub-faction. Historically the
    Know-Nothings were a **separate party** running Fillmore in 1856
    ([Republican Party history](https://en.wikipedia.org/wiki/History_of_the_Republican_Party_(United_States))).
    Northern Know-Nothings *did* drift Republican afterward, so as a
    forward-looking abstraction it is defensible — but the game-master should
    narrate them as recent converts, not original Republicans, and remember
    Fillmore's 8 EVs in 1856 came from the *American Party*, not RED.
  - **"Crittenden Republicans"** (`factions1856.ts:12`, compromise/gradual
    emancipation) is anachronistic as a label: John J. Crittenden was a Unionist
    *Whig/Constitutional Unionist*, not a Republican; his famous compromise came
    in 1860-61. As a "moderate Unionist" wing it works; the *name* is a stretch. **[inference]**
- **Three-way race compressed to two parties.** The engine's BLUE/RED forces the
  1856 *three*-party reality (Dem / Rep / Know-Nothing) into two — an inherent
  abstraction. Fine as a game model; the game-master should know Fillmore's
  candidacy and the Whig collapse are the missing third leg
  ([Britannica](https://www.britannica.com/event/United-States-presidential-election-of-1856)).
- **Event spine is accurate and well-dated** (Bleeding Kansas 1856, Dred Scott
  1857, Panic 1857, John Brown 1859, secession 1860-61). The Trent Affair
  cabinet-decider framing (`eraEvents1856.ts:180-219`) correctly reflects the
  Dec 26 1861 cabinet meeting. **[consensus]**

---

## 4. Gilded Age (1868–1892)

### Era window
The *gilded* digest runs 1868-1872; the era is conventionally **1868-1896**
(Reconstruction tail → before the 1896 realignment). Engine: no dedicated era
value — runs on the `modern` enum or a future `gilded`/`progressive` split
(game-context gap-log #41). **No shipped scenario.** The forward arc the threads
gesture at is **Gilded Age → Populist surge (1890s) → Progressive Era**.

### Binding facts (ground truth)
- **Party polarity continues from 1856: Republicans = the Union/Reconstruction
  party (North), Democrats = the "Solid South" + Northern machines.**
  **[consensus]** After 1877 the Democrats won every former-Confederate state;
  the Republican base was the North, Union veterans (the GAR), and protective
  tariff. ([Gilded Age politics](https://www.americanhistorycentral.com/entries/gilded-age-politics/), [WGBH](https://lsintspl3.wgbh.org/en-us/the-gilded-age/))
- **Both parties were internally factionalized, and elections were razor-close.**
  **[consensus]** Republicans split into **Stalwarts** (Conkling; pro-patronage)
  vs. **Half-Breeds** (Blaine; mild civil-service reform) vs. **Mugwumps**
  (reformers who bolted to back Cleveland in 1884). Democrats had the
  low-tariff, hard-money, laissez-faire **Bourbon Democrats** (Cleveland).
  ([Gilded Age politics](https://www.americanhistorycentral.com/entries/gilded-age-politics/), [Fiveable APUSH](https://fiveable.me/apush/unit-6/politics-gilded-age/study-guide/8nIh2AsuMR3xXcKSZRaq))
- **The defining national issues were the tariff, the currency (gold vs. silver /
  greenbacks), civil-service reform, and railroad/trust regulation** — *not*
  primarily slavery (settled) or, yet, the income tax. **[consensus]** ([Gilded Age politics](https://www.americanhistorycentral.com/entries/gilded-age-politics/))
- **"Waving the bloody shirt"** — Republicans ran on Civil War memory to mobilize
  Northern voters against Democrats for two decades after 1865. **[consensus]** ([Fiveable](https://fiveable.me/apush/unit-6/politics-gilded-age/study-guide/8nIh2AsuMR3xXcKSZRaq))
- **The "Solid South" was Democratic but not internally monolithic** —
  Bourbon/planter elites, agrarian Populist insurgents (1890s), and the
  disenfranchisement of Black (and many poor white) voters via poll taxes and
  Jim Crow built that solidity rather than reflecting consensus. **[consensus]**

### Key figures
- **Ulysses S. Grant** — Republican president 1869-77; administration
  scandal-ridden (Crédit Mobilier, Whiskey Ring). **[consensus]**
- **Roscoe Conkling** (Stalwart) / **James G. Blaine** (Half-Breed) — the
  Republican faction bosses. **[consensus]**
- **Grover Cleveland** — Bourbon Democrat; the only Democrat to win the
  presidency in the era (1884, 1892); low-tariff, gold-standard. **[consensus]**
- **William Jennings Bryan** (forward arc) — Free Silver/Populist Democrat, 1896
  "Cross of Gold"; the realignment that *ends* this era. **[consensus]**

### Timeline of relevant events
- **1868** — Grant elected; 14th Amendment ratified. **[consensus]**
- **1873** — Coinage Act ("Crime of '73," demonetizing silver); Panic of 1873. **[consensus]**
- **1877** — Compromise of 1877 ends Reconstruction; "Solid South" sets in. **[consensus]**
- **1883** — Pendleton Civil Service Act (merit system). **[consensus]**
- **1887/1890** — Interstate Commerce Act; Sherman Antitrust Act; McKinley Tariff. **[consensus]**
- **1892** — Populist (People's) Party peaks; Cleveland re-elected. **[consensus]**
- **1896** — Bryan vs. McKinley realignment (era's close). **[consensus]**

### Era-appropriate factions / ideologies / interests
**Republicans** (RED): North, business, protective tariff, hard money, Union
veterans; split Stalwart/Half-Breed/Mugwump. **Democrats** (BLUE): Solid South +
Northern urban machines (Tammany) + immigrant working class; Bourbon
(pro-business, low-tariff, gold) vs. emerging agrarian/Populist (Free Silver)
wings. **[consensus]** Rising interest blocs the *gilded* digest surfaces:
Big Corporations, Wall Street, Railroads, Labor Unions, and the forecast
movements (feminists, prohibitionists, Populists) that "influence the next era."

### Period-specific terminology
- **Use:** Stalwart, Half-Breed, Mugwump, Bourbon Democrat, Solid South, Free
  Silver / Goldbug / Greenback, bimetallism, the tariff (a literal percentage,
  a top campaign issue), "waving the bloody shirt," the spoils system / civil-
  service reform, trusts, Granger/Populist.
- **Avoid:** modern "liberal/conservative" (the era's reform energy
  ["Liberal Republicans" of 1872] meant *classical-liberal, anti-spoils,
  free-trade* — closer to small-government than to modern progressivism); "Big
  Tech / Big Pharma / Globalist / Environmentalist" (anachronistic interest
  cards — see below); "civil rights movement" (modern sense).

### Common pop-history simplifications and what they get wrong
- **"Liberal Republican" meant left-wing.** **[consensus]** No — the 1872 Liberal
  Republicans were classical liberals: anti-corruption, free-trade,
  end-Reconstruction. The word "liberal" here ≠ 1932 ≠ today. This is a prime
  spot for anachronistic mislabeling.
- **"The Gilded Age had a dominant party."** **[consensus]** The opposite —
  fiercely competitive, near-tied national elections, frequent split government;
  two presidents (Hayes 1876, Harrison 1888) won the EC while losing the popular
  vote.
- **"The Solid South was a natural, unified bloc."** Built through
  disenfranchisement and violence, with real agrarian-vs-Bourbon class conflict
  inside it. **[consensus]**

### Game treatment vs. real history (divergence notes)
- **Era is unbuilt; runs on `modern` tuning rows** (no scenario; game-context
  gap-log #41). The *gilded* digest (post 1) names the real issue axes —
  tariff, currency (gold vs. free silver), civil-service reform, imperialism —
  none of which exist in shipped code (gap-log #3). When built, these are the
  *correct* era issues; slavery and 1850s sectionalism should be retired.
- **Anachronistic interest-group cards.** `factions1856.ts:24-31` ships a single
  flat `INTEREST_GROUPS` list reused across eras, including **Big Tech, Big Oil &
  Gas, Globalists, LW/RW Media** — all anachronistic for 1868. The *gilded*
  digest already flags this (digest §C: "Many anachronistic for 1868 — these are
  the multi-era card pool"; gap-log #5). Framing guidance: era-gate the card pool
  (no Big Tech in 1868; the period's blocs are Railroads, Wall Street, Big
  Corporations, Labor Unions, Grangers, Prohibitionists).
- **Faction *names* should track the real factions.** The *gilded* digest's
  "War Democrats / Finance NR / Radical Republicans / Re-Sprague-licans"
  (post 298) gesture at the right thing, but the historically load-bearing
  faction names for 1868-92 are **Stalwart / Half-Breed / Mugwump / Bourbon /
  Liberal Republican / Greenback-Populist** — use these for era-accurate flavor
  ([Gilded Age politics](https://www.americanhistorycentral.com/entries/gilded-age-politics/)).
- **State-policy flags (Jim Crow, poll tax, prohibition, women's suffrage) are
  era-correct here.** The *gilded* digest models them as governor actions /
  state flags (gap-log #21) — and they *are* the real Gilded-Age/Progressive
  state-level battleground. Just note Jim Crow/disenfranchisement intensifies
  *after* 1877 (Reconstruction's end), so gating matters. **[consensus]**

---

## Citations
Ordered by importance to this brief.

- [Library of Congress — Formation of Political Parties](https://www.loc.gov/exhibits/creating-the-united-states/formation-of-political-parties.html) — parties did not exist at the founding; emerged in the 1790s. (Orientation only; fetch blocked, used via search snippet.)
- [Reagan Library / National Archives — 1788-1800: Rise of Political Factions](https://www.reaganlibrary.gov/american-elections-and-campaigns-1788-1800-rise-political-factions-early-republic) — no parties in 1788-89; factions, not parties; Washington unanimous.
- [Wikipedia — First Party System](https://en.wikipedia.org/wiki/First_Party_System) — Federalist Party ~1791, Republican ~1792, 1796 first partisan election (dates contested; treat as a process).
- [American Battlefield Trust — The Rise of Political Parties](https://www.battlefields.org/learn/articles/rise-political-parties) — Hamilton/Jefferson/Madison party formation; ratification context.
- [National Archives — Constitution: A More Perfect Union](https://www.archives.gov/founding-docs/more-perfect-union) and [Constitution Center — The Day the Constitution Was Ratified](https://constitutioncenter.org/blog/the-day-the-constitution-was-ratified) — nine-state requirement; close state votes (MA 187-168, VA 89-79, NY 30-27); NH ninth June 21 1788.
- [Journal of the American Revolution — John Adams's Rule of Thirds](https://allthingsliberty.com/2013/02/john-adamss-rule-of-thirds/) and [NPS — Loyalists in the American Revolution](https://www.nps.gov/teachers/classrooms/loyalists-in-american-revolution.htm) — the one-third myth; Loyalist ~15-20%, Patriot ~40-45%.
- [Wikipedia — 1856 United States presidential election](https://en.wikipedia.org/wiki/1856_United_States_presidential_election) and [Britannica — 1856 election](https://www.britannica.com/event/United-States-presidential-election-of-1856) — three-way race; EC 174/114/8; sectional split.
- [Miller Center — Buchanan: Campaigns and Elections](https://millercenter.org/president/buchanan/campaigns-and-elections) — party positions on slavery expansion; popular sovereignty.
- [Wikipedia — History of the Republican Party](https://en.wikipedia.org/wiki/History_of_the_Republican_Party_(United_States)) and [Free Soil Party](https://en.wikipedia.org/wiki/Free_Soil_Party) — Republican Party founded 1854 from Free-Soilers/anti-Nebraska Whigs; Know-Nothings a separate party.
- [Wikipedia — Manifest Destiny](https://en.wikipedia.org/wiki/Manifest_destiny) — O'Sullivan 1845; Whig opposition; not a consensus.
- [American History Central — Gilded Age Politics](https://www.americanhistorycentral.com/entries/gilded-age-politics/) and [Fiveable APUSH — Politics in the Gilded Age](https://fiveable.me/apush/unit-6/politics-gilded-age/study-guide/8nIh2AsuMR3xXcKSZRaq) — Stalwarts/Half-Breeds/Mugwumps/Bourbons; bloody shirt; tariff/currency; Solid South.
- [American Battlefield Trust — Hartford Convention](https://www.battlefields.org/learn/articles/hartford-convention) — Federalist collapse 1814-15 → one-party Era of Good Feelings (orientation for the polarity timeline).
- Internal: shipped data `src/data/factions1772.ts`, `factions1856.ts`, `scenario1772.ts`, `scenario1856.ts`, `eraEvents1772.ts`, `eraEvents1856.ts`; digests `docs/game/playtest-digests/` (`1772s` 85f8e6b4, `fed` f55d3e21, `gilded` f4c7c2c4); `docs/game/game-context.md`.
