# AMPU — Historical Context

> **Ingest mode, by era.** One section per era the knowledge base touches:
> **Founding/Revolution (1772–1788)**, **Federalist era (1788–1800)**,
> **Jeffersonian Republic / Era of Good Feelings (1800–1828)**, **Jacksonian /
> Second Party System (1828–1856)**, **Antebellum (c. 1856)**, **Gilded Age
> (1868–1892)**, and the **modern arc the
> 1948 campaign traverses** — **Progressive/WWI/1920s (1896–1932)**, **New
> Deal/WWII/postwar (1932–1965)**, **Civil Rights/Vietnam (1965–1980)**,
> **Reagan/end-of-Cold-War (1980–1992)**, **post-Cold-War 1990s (1992–2000)**,
> and the **modern polarized era (2000–present)**. This is the game-pm /
> game-master's ground-truth reference for era-accurate framing — what really
> happened, what the game models, and where the two **diverge or risk
> anachronism**. It is *research, not design*: it states historical facts and
> flags mismatches; it does not prescribe mechanics.
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
> left/right meaning of BLUE/RED **reverse across the timeline**, then **re-sort
> into the modern alignment across 1932–~2000**. Do not carry a faction's
> polarity from one era into another. See "Cross-era polarity map" immediately
> below, then each era's terminology section.

## Cross-era polarity map (read first)

The game's two parties are fixed tokens **BLUE** and **RED**; their real-world
identity and left/right polarity change era to era. Current shipped mapping
(`factions1772.ts:26-29`, `factions1856.ts:19-22`); modern mapping confirmed by
the *1948-continued* thread (BLUE = Democrats, RED = Republicans, modern
alignment — e.g. "The Democrats will hold their 2008 convention… The Republicans
will hold their 2008 convention," chunk-001 post 14):

| Era | BLUE = | RED = | Left pole sits with | Note |
|---|---|---|---|---|
| 1772 Founding | "Patriots (Anti-Federalist)" | "Federalists" | BLUE (Patriots) | **Anachronistic labels** — neither party existed in 1772; see Founding §terminology |
| 1788 Federalist | Democratic-Republicans (Jefferson) | Federalists (Hamilton) | BLUE (Dem-Reps) | The *fed* digest assigns BLUE=Dem-Rep, RED=Federalist (digest post 2) |
| **1800–1828 Jeffersonian** | **Democratic-Republicans ("Republicans"/Jeffersonians)** | **Federalists (dying; gone nationally by ~1820)** | **BLUE (Dem-Reps)** | **Same polarity as 1788.** The 1800-playtest names it explicitly: "the 'Blue Party' or Democratic-Republicans… the 'Red Party' or Federalists" (6aa7309a chunk-001 post 1). Note "Republican" here = **Jeffersonian Dem-Rep**, NOT the modern GOP and NOT the 1856 antislavery party. The game's "**Era of Republicanism**" label = this Dem-Rep dominance. |
| **1828–1856 Jacksonian / 2nd Party System** | **Democrats (Jackson; the modern Democratic Party is born here)** | **National Republicans → Whigs (Clay; anti-Jackson)** | **Split / cross-cutting** (Jacksonians = the *popular/common-man* pole; Whigs = the *commercial/improvement* pole) | The real parties realign. **The game keeps the OLD 1788 labels far too long** — Daniel Webster is "leader of the **Federalists**" as late as 1840 in-game (chunk-074 post 6204) — so its BLUE=Dem-Rep / RED=Federalist tokens persist where real history had already become **Democrat vs. Whig** by ~1834. The game's internal era names for this span are "**Era of Manifest Destiny (1840-1856)**" (chunk-074 post 6203) preceded by the late Era of Republicanism. |
| 1856 Antebellum | **Democratic Party** | **Republican Party** | **RED (Republicans)** | **POLARITY FLIP**: here the antislavery/progressive pole is RED, the conservative/pro-slavery pole is BLUE (`scenario1856.ts:18-31` enthusiasm table) — confirmed in play, "Blue = Democrats, Red = Republicans… 1856-era Republicans are the antislavery party" (*house-divided* partial-03). The game calls this the "**Era of Nationalism**" (6aa7309a chunk-117: "the final turn of the Era of Nationalism"). |
| 1868 Gilded Age | Democrats ("Solid South") | National Republicans | RED (Republicans) | Continues the 1856 polarity (Republicans = the Union/Reconstruction party); the *house-divided* Part-2 thread plays straight from 1856 into 1868 with this polarity intact; *gilded* digest post 298 |
| 1896–1932 Progressive/1920s | Democrats (Bryan→Wilson; Solid South + agrarian) | Republicans (dominant, pro-business; also TR/insurgent progressives) | **Split / in flux** | **The hinge.** Progressivism lived in *both* parties; the modern left/right party mapping does **not** apply cleanly yet. See §5 terminology. |
| 1932–1965 New Deal/postwar | **Democrats (New Deal coalition)** | Republicans | **BLUE (Democrats)** — *for economics* | **THE REALIGNMENT BEGINS.** "Liberal" acquires its modern Democratic, pro-government meaning here (1932). **But race is cross-cutting:** the Solid South is still *Democratic*, so the party's left/right identity is not yet uniform. |
| 1965–1980 Civil Rights/Vietnam | Democrats (losing the white South) | Republicans (gaining it; "Southern Strategy") | BLUE (Democrats), nationally | **THE SOUTHERN REALIGNMENT (gradual).** Begins 1948 (Dixiecrats), accelerates 1964 (Goldwater)/1968 (Nixon) at the *presidential* level — **but not an instant flip**; see §7. |
| 1980–1992 Reagan | Democrats (left/liberal) | **Republicans (conservative coalition)** | BLUE (Democrats) | "Conservative" acquires its modern Republican-movement meaning; "Reagan Democrats" defect. Modern polarity now essentially in place at the *national* level. |
| 1992–2000 post-Cold-War | Democrats (Clinton/New Democrat center-left) | Republicans (Gingrich; the South's down-ballot flip completes) | BLUE (Democrats) | **Down-ballot realignment completes** (1994 "Republican Revolution"). Modern alignment now holds top *and* bottom of the ballot. |
| 2000–present modern | **Democrats (left)** | **Republicans (right)** | **BLUE (Democrats)** | **Fully modern alignment** — finally matches everyday usage. The era the *1948-continued* thread actually plays (2004→2020+). Era of partisan **sorting** and rising polarization. |

**[consensus]** The word "Federalist" alone reverses meaning twice across this
range: a *position* in 1787-88 (pro-Constitution), then *Hamilton's party*
(1791-1815), and the polarity of "states' rights" migrates from the
Anti-Federalist/Jeffersonian left-of-center to the antebellum Southern
Democratic right. Treat every era's party framing as independent.

**[consensus]** The label "**Republican**" is the single worst terminology trap
in the whole timeline: in **1788–1828** it means **Jefferson's Democratic-
Republican Party** (the ancestor of today's *Democrats*); the **modern
Democratic Party** splits off and takes the bare name "**Democrats**" under
**Jackson (~1828)**; and the name "**Republican**" is then *reused for an
entirely unrelated, opposite party* — the **antislavery GOP founded in 1854**
(§3). Three different "Republicans"/"Democrats" across three eras. See §2.5/§2.6
terminology. The game compounds this by keeping the *Federalist* label alive
into the 1840s (see polarity-map note), so always anchor to the **year**, never
the bare party word.

**[consensus]** The two **biggest** polarity events in the whole timeline are
the **New Deal realignment (1932)** — which redefines "liberal" and makes the
*economic* left Democratic — and the **Civil Rights / Southern realignment
(c. 1948–1994)** — which is **gradual, not a single-year flip**, and finally
lines the *South* up with the national party polarity. Only *after* both, by
roughly **2000**, do BLUE=Democrat=left / RED=Republican=right mean what they
mean in everyday modern usage. The 1856/1868 polarity is the **reverse** of
this; the 1896–1932 era is the muddled hinge in between. The **1828 Jacksonian
realignment** (§2.6) is a third, earlier hinge: it ends the First Party System
and *creates the Democratic Party*, but does **not** produce the modern
left/right meaning of the labels.

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

## 2.5 Jeffersonian Republic / Era of Good Feelings (1800–1828) — game era: "Era of Republicanism"

### Era window
**1800/01** (Jefferson's "Revolution of 1800") → **1824/28** (the disputed
1824 election → Jackson's 1828 win, which ends one-party rule). The
**6aa7309a "1800 Playtest: Era of Republicanism (1800-1868)"** thread *opens*
here and plays it continuously forward; this thread is the **early half of the
same campaign** whose later half (1868+, the Gilded Age) was ingested in batch 1
(`f4c7c2c4` *gilded* digest). The game's internal era label for this span is
"**Era of Republicanism**" (chunk-001 post 1; chunk-002 post: "Era of
Republicanism in more ways than one"). No engine `nationalism`/`federalism`
boundary is documented for it in shipped code; it is a host-run era. **No shipped
scenario.**

### Binding facts (ground truth)
- **"Republican" in this era = Jefferson's Democratic-Republican Party — the
  ancestor of today's *Democrats*, NOT the modern GOP and NOT the 1854
  antislavery Republicans.** **[consensus]** This is the single most important
  terminology pin for the section. The 1800-playtest names it directly: "the
  'Blue Party' or Democratic-Republicans… the 'Red Party' or Federalists"
  (chunk-001 post 1). ([First Party System](https://en.wikipedia.org/wiki/First_Party_System))
- **The "Revolution of 1800" was the first peaceful transfer of power between
  rival parties — and it nearly broke.** **[consensus]** Jefferson and his
  running mate Aaron Burr **tied at 73 electoral votes each** (Adams 65,
  C.C. Pinckney 64) because electors could not yet distinguish president from
  vice-president. The tie threw the election to the lame-duck Federalist House,
  which deadlocked for **36 ballots** before electing **Jefferson on Feb 17,
  1801, by a 10-state-to-4 delegation vote** (with Hamilton quietly steering
  Federalists away from Burr). ([Constitution Center](https://constitutioncenter.org/blog/on-this-day-a-true-constitutional-crisis-ends-in-the-washington), [Britannica — 1800 election](https://www.britannica.com/event/United-States-presidential-election-of-1800), [Monticello](https://www.monticello.org/research-education/thomas-jefferson-encyclopedia/election-1800/)) *(The 73/73/65/64 split and the 36-ballot/10-4 outcome appear across National Archives, Britannica, and Monticello; treat as consensus.)*
- **The 12th Amendment (ratified 1804) fixed the flaw** by having electors cast
  *separate* ballots for president and vice-president — in force for the 1804
  election onward. **[consensus]** ([Constitution Center](https://constitutioncenter.org/blog/on-this-day-a-true-constitutional-crisis-ends-in-the-washington))
- **The Louisiana Purchase (1803) doubled the country and forced Jefferson to
  swallow his own strict-construction principles.** **[consensus]** Treaty signed
  **April 30, 1803** (~$15 million for ~827,000 sq. mi.); Senate ratified
  **24-7 on Oct 20, 1803**. Jefferson privately believed the Constitution gave no
  power to acquire/incorporate foreign territory and drafted an amendment, then
  dropped it for speed ("the less that is said about any constitutional
  difficulty, the better"). ([State Dept Office of the Historian](https://history.state.gov/milestones/1801-1829/louisiana-purchase), [National Archives — Prologue](https://www.archives.gov/publications/prologue/2003/spring/louisiana-purchase.html), [Senate — ratification](https://www.senate.gov/about/powers-procedures/treaties/senate-approves-louisiana-purchase-treaty.htm))
- **The Embargo Act (1807) and War of 1812 were Republican policies opposed by
  the Federalists** — the reverse of the modern war/trade alignment. **[consensus]**
  Jefferson's 1807 embargo (a response to British/French seizures of US shipping)
  devastated New England trade; the **War of 1812** (declared June 1812 under
  Madison) was a Republican "war hawk" project that New England Federalists
  bitterly opposed. The 1800-playtest frames exactly this: "the 'Blue Party'
  favors an aggressive response to Britain, going so far as to seek an embargo or
  war, [while] the 'Red Party' wishes to do nothing that could disrupt trade"
  (chunk-001 post 1; in-game "Welcome to 1812-1814," chunk-025). ([Era of Good Feelings](https://en.wikipedia.org/wiki/Era_of_Good_Feelings))
- **The Federalist Party collapsed as a national force after the Hartford
  Convention (1814-15); the "Era of Good Feelings" was effective one-party
  Democratic-Republican rule.** **[consensus]** Monroe won 1816 over Federalist
  Rufus King and ran essentially unopposed in 1820. By the end of Monroe's
  presidency the Democratic-Republicans held ~90% of Congress (Senate 44-4, House
  189-24). ([Era of Good Feelings](https://en.wikipedia.org/wiki/Era_of_Good_Feelings), [ushistory.org](https://www.ushistory.org/us/23a.asp))
- **The Missouri Compromise (1820) was the era's great sectional rupture and a
  preview of everything to come.** **[consensus]** It admitted **Missouri as a
  slave state** and **Maine as a free state** (preserving the 11-11 balance) and
  banned slavery in the Louisiana Territory **north of 36°30′**. The Tallmadge
  Amendment (Feb 1819) to restrict slavery in Missouri passed the House on
  Northern votes but died in the Senate. Congress passed it March 3, Monroe
  signed it **March 6, 1820**. Jefferson called the crisis "a fire bell in the
  night." ([National Archives — Missouri Compromise](https://www.archives.gov/milestone-documents/missouri-compromise), [Battlefield Trust](https://www.battlefields.org/learn/articles/missouri-compromise))
- **The 1824 election shattered the one-party system into personal factions.**
  **[consensus]** Four Democratic-Republicans ran (Jackson, J.Q. Adams, Crawford,
  Clay); **Jackson won the popular vote and the most electoral votes but not a
  majority**, so the House chose **John Quincy Adams** — the "**Corrupt
  Bargain**" (Clay backed Adams, then became Secretary of State). This is the
  proximate trigger for the Democrat/Whig split. ([Era of Good Feelings](https://en.wikipedia.org/wiki/Era_of_Good_Feelings))

### Key figures
- **Thomas Jefferson** (Dem-Rep) — president 1801-09; Louisiana Purchase, the
  embargo, the *Marbury v. Madison* (1803) confrontation with the courts. The
  1800-playtest seats him as the **Blue 5 (Con/Trad/RW Pop)** faction leader at
  game start (chunk-001 post 1) — *note:* placing the era's dominant figure at
  the **right** pole reflects his strict-construction/states'-rights identity,
  the game's standing forward-projection (cf. §1). **[consensus on his real role]**
- **James Madison** (Dem-Rep) — president 1809-17; the War of 1812. Game start:
  "Sec of State James Madison" heads **Blue 3 (Moderates)** (chunk-001 post 1). **[consensus]**
- **James Monroe** (Dem-Rep) — president 1817-25; the "Era of Good Feelings," the
  Missouri Compromise, the Monroe Doctrine (1823). Game start: "Gov James Monroe"
  in Blue 3 (chunk-001 post 1). **[consensus]**
- **Aaron Burr** (Dem-Rep) — Jefferson's VP via the 1800 tie; later killed
  Hamilton in an 1804 duel and was tried for treason (1807). Game start: "VP
  Aaron Burr" heads **Blue 1 (LW Pop/Prog/Lib/Mod)** (chunk-001 post 1). **[consensus]**
- **Albert Gallatin** (Dem-Rep) — Jefferson/Madison Treasury Secretary; the
  Republican answer to Hamilton on finance. Game start: in **Blue 2** (chunk-001). **[consensus]**
- **John Quincy Adams** — son of John Adams; here a *Federalist-turned-Republican*
  diplomat (Treaty of Ghent, the Monroe Doctrine) who wins the contested 1824
  election and becomes a National Republican. Game start: heads **Red 2
  (Moderates)** (chunk-001 post 1). **[consensus]**
- **Alexander Hamilton** — leader of the dying Federalists until his 1804 death;
  the game keeps him alive as **Red 4 (Conservatives)** leader at the 1800 start
  (chunk-001 post 1), an acceptable game-start convenience. **[consensus on real death 1804]**
- **John Marshall** — Federalist Chief Justice (1801-35); *Marbury v. Madison*
  (1803) established judicial review; *McCulloch v. Maryland* (1819) upheld the
  national bank and "implied powers." Game start: heads **Red 5 (Conservatives)**
  (chunk-001 post 1). **[consensus]**
- **Andrew Jackson** — in **1800 a minor figure**; the game correctly seats him
  *small*, as a member of **Blue 4 (Conservatives)** at the 1800 start (chunk-001
  post 1), a generation before he leads the next era. **[consensus]**
- **Henry Clay** — Speaker/"War Hawk," author of the "American System" and the
  Missouri Compromise; the "Corrupt Bargain" maker of 1824. In the game he rises
  across the era to become its top politician by ~1840 ("Rep Henry Clay 305…
  continues to lead his faction," chunk-074 post 6204). **[consensus]**

### Timeline of relevant events
- **1801** — House resolves the 1800 tie (Feb 17, 36th ballot); Jefferson
  inaugurated; *Marbury v. Madison* litigation begins. **[consensus]**
- **1803** — Louisiana Purchase (treaty Apr 30; ratified Oct 20); *Marbury v.
  Madison* decided (judicial review). **[consensus]**
- **1804** — 12th Amendment ratified; Jefferson re-elected in a landslide;
  Burr-Hamilton duel. **[consensus]**
- **1807** — Embargo Act; Chesapeake-Leopard affair. **[consensus]**
- **1812-15** — War of 1812 (declared June 1812; Treaty of Ghent Dec 1814; Battle
  of New Orleans Jan 1815). **[consensus]**
- **1814-15** — Hartford Convention; Federalist Party's terminal decline. **[consensus]**
- **1816** — Monroe elected; Second Bank of the United States chartered. **[consensus]**
- **1819** — *McCulloch v. Maryland*; Panic of 1819; Adams-Onís Treaty (Florida);
  Tallmadge Amendment fight begins. **[consensus]**
- **1820** — Missouri Compromise (signed Mar 6); Monroe re-elected ~unopposed. **[consensus]**
- **1823** — Monroe Doctrine. **[consensus]**
- **1824** — Four-way Dem-Rep election; no majority → House chooses J.Q. Adams. **[consensus]**
- **1825** — "Corrupt Bargain" charge; Clay made Secretary of State. **[consensus]**

### Era-appropriate factions / ideologies / interests
The story of the era is **one party fragmenting into personal factions**.
**Democratic-Republicans** (BLUE) dominate throughout — but split between
**Old Republicans / "Quids"** (strict-construction purists, e.g. John Randolph,
Nathaniel Macon — note the game seats "Speaker Nathaniel Macon" in Blue 5,
chunk-001) and **National Republicans / nationalists** (Clay's "American System":
tariff, national bank, internal improvements — the wing that becomes the Whigs).
**Federalists** (RED) shrink to a New England rump and vanish nationally after
1815. Live interests: **Western farmers/settlers** (cheap land, expansion),
**Southern planters** (slavery, low tariff), **Northern merchants/manufacturers**
(tariff protection after 1816), and the new **sectional fault line over slavery
in the territories** (Missouri). **[consensus]**

### Period-specific terminology
- **THE TERMINOLOGY PIN.** In **1800-1828, "Republican" = Jefferson's
  Democratic-Republican Party = the BLUE party = the ancestor of the modern
  *Democrats***. It is **not** the modern GOP and **not** the 1854 antislavery
  Republicans. The game's era name "**Era of Republicanism**" refers to *this*
  Dem-Rep dominance. **[consensus]**
- **Use:** Democratic-Republican / "Republican" / Jeffersonian; Federalist
  (dying); "Old Republican" / "Quid" (strict-construction wing); National
  Republican (Clay/Adams nationalist wing, emerging ~1824); the "American
  System"; strict vs. loose construction; the "Era of Good Feelings";
  "war hawk"; "Corrupt Bargain" (1824).
- **Avoid:** "Democrat" as a *party* name before ~1828 (the Democratic Party
  proper is born under Jackson — see §2.6); "Whig" before ~1834; modern
  "liberal/conservative" (the live axes are agrarian/commercial and
  strict/loose construction, not the modern left/right). **Never** read the
  era's "Republican" as the GOP.

### Common pop-history simplifications and what they get wrong
- **"Jefferson's Republicans are today's Republicans."** **[consensus]** False —
  opposite lineage; they become the *Democrats*. The modern GOP (§3) is the
  *anti*-Jacksonian, antislavery party founded 30 years later in 1854.
- **"The Era of Good Feelings was a time of real consensus and no conflict."**
  **[consensus]** Misleading — it had no second *party*, but it was riven by the
  **Panic of 1819**, the **Missouri crisis (1820)**, and intense *personal*
  rivalries that exploded in 1824. One-party did not mean harmonious.
- **"Jefferson the strict-constructionist would never have stretched the
  Constitution."** **[consensus]** He did — the Louisiana Purchase (1803) was a
  loose-construction act he undertook against his own stated principles, dropping
  a planned constitutional amendment for expediency. ([Office of the Historian](https://history.state.gov/milestones/1801-1829/louisiana-purchase))
- **"Andrew Jackson dominated this whole period."** **[consensus]** No — in 1800
  he was a minor figure; his national rise begins with the 1824/1828 elections.
  The 1800-playtest correctly starts him small (Blue 4 member, chunk-001).

### Game treatment vs. real history (divergence notes)
- **Period-correct party framing at the START.** The 1800-playtest opens with
  exactly the right First-Party-System polarity: **"the 'Blue Party' or
  Democratic-Republicans… the 'Red Party' or Federalists,"** with the Blue party
  "champion[ing] the expanded rights of the common American over those of the
  Eastern establishment" and the Red party tied to "Northern banks and foreign
  trade" (chunk-001 post 1). This is faithful — and it preserves the **§2
  polarity (BLUE = Dem-Rep = the left-of-center/agrarian-democratic pole)**, the
  *same* mapping as the Federalist era, **not** the 1856 flip.
- **The starting faction roster is well-cast** to the real Jeffersonian board:
  Jefferson, Burr, Gallatin, Madison, Monroe, Macon, A. Jackson (BLUE);
  Rufus King, J.Q. Adams, Hamilton, John Marshall, Gouverneur Morris (RED)
  (chunk-001 post 1) — all genuine 1800-era figures in roughly correct
  party/wing positions.
- **THE BIG DIVERGENCE — the game keeps the dead "Federalist" label alive far
  too long, and it becomes an alt-history.** In real history the **Federalist
  Party was gone nationally by ~1820** and the **Whig Party formed ~1834**
  (§2.6). The game instead keeps **RED = "Federalists"** running for *decades*
  past their real death: by 1840 in-game, "Daniel Webster [is] Current leader of
  the **Federalists**" (chunk-074 post 6204) and players are still asking "Are we
  Whigs yet?" / "Maybe we'll finally get the Whig party lol" (chunk-088 post 929;
  chunk-073 post 457). So the game runs the **First-Party-System labels straight
  through the period that was historically the Second Party System** — a
  deliberate label-persistence, but a real divergence the game-master should
  flag. Real anchor: Federalists dead ~1815-20; Democrats 1828; Whigs ~1834.
- **Alt-history personnel accumulate fast.** By the late era the game's
  presidents are fictional/alt (e.g. "Pres Wood," "Pres Wilson" who *resigns*,
  "Pres Cahoon," "Pres Randolph Jr.," then "President Martin Van Buren" elected
  ~1838-40; chunk-074 post 6204) and a "Sec of the Treasury Edward Livingston…
  finally achieved the successful purchase of the Louisiana territory from
  France" — i.e. the **Louisiana Purchase happens via a player action on a
  divergent schedule**, not Jefferson's 1803 treaty. Game-master framing: use the
  real Jeffersonian chronology/figures for *texture*, but treat named
  officeholders and the *timing* of set-piece events (Louisiana, war) as the
  campaign's own timeline.
- **The game models the era's real issue axis well** even as outcomes diverge:
  the embargo/war-vs-trade split (chunk-001), the tariff and the seeds of
  nullification (carried into the next era), and Western expansion all appear as
  live in-game issues. The **Era of Good Feelings** is even invoked by name as
  flavor ("Era of good feelings moment," chunk-017).

---

## 2.6 Jacksonian democracy / Second Party System (1828–1856) — game eras: "Era of Manifest Destiny" (1840–1856) and late "Era of Republicanism"

### Era window
**1828** (Jackson's election; birth of the Democratic Party) → **1854/56**
(Kansas-Nebraska Act → Whig collapse → Republican founding, which opens §3). The
6aa7309a 1800-playtest plays this whole span continuously (in-game markers
"Welcome to 1828-1830," chunk-055; "Welcome to the **Era of Manifest Destiny
(1840-1856)**," chunk-074; through "Welcome to 1850-1852," chunk-092, into the
1856 Era of Nationalism). The game's internal era names here are the late "Era of
Republicanism," then "**Era of Manifest Destiny (1840-1856)**" (explicitly
bounded, chunk-074 post 6203; chunk-086), and the engine references a
"**Jacksonian**" era in its secession logic (chunk-082). **No shipped scenario.**

### Binding facts (ground truth)
- **The modern Democratic Party is born here (~1828), and the Whig Party forms
  to oppose it (~1833-34) — this is the Second Party System.** **[consensus]**
  The **Democratic Party** (the oldest continuous US party) coalesced in **1828**
  around Andrew Jackson, organized by **Martin Van Buren** out of state machines.
  The **Whig Party** formed **~1833-34** from National Republicans, Anti-Masons,
  and anti-Jackson men; the name cast Jackson as "**King Andrew**" (English Whigs
  = the anti-monarchy party). Historians date the system **~1828-1854**.
  ([Second Party System](https://en.wikipedia.org/wiki/Second_Party_System), [Whig Party](https://en.wikipedia.org/wiki/Whig_Party_(United_States)), [History of the Democratic Party](https://en.wikipedia.org/wiki/History_of_the_Democratic_Party_(United_States)))
- **The Jackson/Whig divide was NOT the modern left/right divide.** **[consensus]**
  **Democrats** = Jackson's coalition of the "common man," Western farmers,
  Southern planters, urban workers; pro-territorial-expansion, anti-national-bank,
  states'-rights-leaning, low-tariff, limited federal economic role. **Whigs** =
  Clay/Webster's coalition of commercial and manufacturing interests, the
  "American System" (national bank, protective tariff, federally funded internal
  improvements), evangelical reform, and *skepticism* of rapid expansion. So the
  **pro-government-economic-activism** pole was the **Whigs**, not the Democrats —
  the reverse of the post-1932 alignment. ([Second Party System](https://en.wikipedia.org/wiki/Second_Party_System), [Whig Party — HISTORY](https://www.history.com/articles/whig-party))
- **The Nullification Crisis (1832-33) pitted South Carolina's states'-rights
  doctrine against Jackson's Unionism — and previewed secession.** **[consensus]**
  Reacting to the **Tariff of 1828 ("Tariff of Abominations")**, VP **John C.
  Calhoun** anonymously wrote the *South Carolina Exposition and Protest* (1828)
  arguing a state could **nullify** federal law; SC's convention nullified the
  tariffs **Nov 24, 1832**. Jackson called it treason; Congress passed the
  **Force Bill** authorizing military enforcement, paired with **Henry Clay's
  Compromise Tariff of 1833** (gradual reduction to 1842). SC repealed its
  ordinance. ([Nullification crisis](https://en.wikipedia.org/wiki/Nullification_crisis), [Battlefield Trust](https://www.battlefields.org/learn/articles/nullification-crisis), [House History — Tariff of Abominations](https://history.house.gov/Historical-Highlights/1800-1850/The-Tariff-of-Abominations/))
- **The Bank War (1832-36) was Jackson's defining domestic fight.** **[consensus]**
  Jackson **vetoed the re-charter of the Second Bank of the United States on July
  10, 1832** (a class-framed veto: "the planters, the farmers, the mechanic and
  the laborer" vs. "the monied interest"), won re-election, then removed federal
  deposits to state "**pet banks**." The **Specie Circular (1836)** (gold/silver
  only for federal land) plus the credit contraction helped trigger the **Panic
  of 1837** and a depression lasting to ~1843. ([Bank War](https://en.wikipedia.org/wiki/Bank_War), [LoC — Bank veto](https://guides.loc.gov/this-month-in-business-history/july/renewal-second-bank-united-states-vetoed), [Hermitage](https://thehermitage.com/andrew-jackson-the-bank-war))
- **"Manifest Destiny" was a Democratic, partisan, and CONTESTED idea — not a
  national consensus.** **[consensus]** The term was coined by editor **John L.
  O'Sullivan in 1845**; it expressed the (largely Democratic) expansionist
  program, while **Whigs and antislavery Northerners actively opposed** expansion
  as a slave-power scheme. Treat it as a partisan slogan, not a settled creed.
  ([American Yawp — Manifest Destiny](http://www.americanyawp.com/text/12-manifest-destiny/), [HISTORY — Manifest Destiny](https://www.history.com/topics/19th-century/manifest-destiny))
- **The Mexican-American War (1846-48) was a Democratic (Polk) war the Whigs
  opposed; its conquests reignited the slavery-in-the-territories fight.**
  **[consensus]** War 1846-48; the **Treaty of Guadalupe Hidalgo (Feb 2, 1848)**
  ceded California, the Southwest, and more. The **Wilmot Proviso (Aug 8, 1846)**
  — to bar slavery from any conquered land — passed the House on sectional lines
  but died in the Senate, framing the next 15 years. ([Treaty of Guadalupe Hidalgo](https://en.wikipedia.org/wiki/Treaty_of_Guadalupe_Hidalgo), [OpenStax — Mexican-American War](https://openstax.org/books/us-history/pages/11-4-the-mexican-american-war-1846-1848), [Wilmot Proviso](https://en.wikipedia.org/wiki/Wilmot_Proviso))
- **The Compromise of 1850 was a five-bill package that postponed disunion.**
  **[consensus]** Designed by **Whig Henry Clay** and **Democrat Stephen
  Douglas**, signed by **Whig president Millard Fillmore**, passed as **five
  separate statutes in September 1850**: California admitted free; Utah and New
  Mexico territories on popular sovereignty; a Texas boundary/debt settlement;
  the DC slave *trade* abolished; and a tougher **Fugitive Slave Act**.
  ([Compromise of 1850 — National Archives](https://www.archives.gov/milestone-documents/compromise-of-1850), [Bill of Rights Institute](https://billofrightsinstitute.org/essays/the-compromise-of-1850/))
- **The Kansas-Nebraska Act (1854) destroyed the Whigs, split the Democrats, and
  created the Republican Party — the hinge into §3.** **[consensus]** Douglas's
  act (signed **May 30, 1854**) organized Kansas/Nebraska on **popular
  sovereignty**, **repealing the Missouri Compromise's 36°30′ line**. The
  backlash birthed the **Republican Party** (the name first adopted at Ripon, WI,
  **March 20, 1854**; first state convention at Jackson, MI, **July 6, 1854**)
  from anti-Nebraska Whigs, Free-Soilers, and anti-slavery Democrats; the **Whig
  Party collapsed**. ([Kansas-Nebraska Act](https://en.wikipedia.org/wiki/Kansas%E2%80%93Nebraska_Act), [Senate — Kansas-Nebraska](https://www.senate.gov/artandhistory/history/minute/Kansas_Nebraska_Act.htm), [EBSCO — Birth of the Republican Party](https://www.ebsco.com/research-starters/history/birth-republican-party))

### Key figures
- **Andrew Jackson** (Democrat) — president 1829-37; founder/figurehead of the
  Democratic Party; Indian Removal (Trail of Tears), the Bank War, Unionist in
  the Nullification Crisis. **[consensus]**
- **Martin Van Buren** (Democrat) — the *organizer* who built the Democratic
  Party machine; VP then president 1837-41 (inherited the Panic of 1837). The
  1800-playtest elects an alt-history **"President Martin Van Buren"** ~1838-40
  (chunk-074 post 6204) — right figure, divergent timeline. **[consensus]**
- **Henry Clay** (National Republican → Whig) — "the Great Compromiser":
  American System, the 1833 Compromise Tariff, the Compromise of 1850; perennial
  losing presidential candidate. The game tracks his rise to era-dominant PV by
  ~1840 (chunk-074 post 6204). **[consensus]**
- **Daniel Webster** (Whig) — nationalist orator (Webster-Hayne debate; "Liberty
  and Union"); Whig leader. The game **mislabels him "leader of the Federalists"
  in 1840** (chunk-074 post 6204) — the live divergence (real: he was a *Whig*).
  Players also reference "Dan Webster" and the 1840s suffrage/Dorr-War fights as
  Whig-vs-Democrat class issues (chunk-086). **[consensus]**
- **John C. Calhoun** (Democrat, S. Carolina) — VP under Adams then Jackson;
  architect of nullification and the intellectual of states'-rights/pro-slavery
  doctrine. **[consensus]**
- **Stephen A. Douglas** (Democrat) — "popular sovereignty"; floor-manager of the
  Compromise of 1850 and author of Kansas-Nebraska (1854) — the bridge into §3.
  Appears as a notable draftee in the game's 1840 class (chunk-074 post 6203). **[consensus]**
- **Millard Fillmore** (Whig) — president 1850-53; signed the Compromise of 1850;
  later the 1856 Know-Nothing/American candidate (§3). Appears as a notable RED
  draftee in the game's 1828 class (chunk-055 post 4525). **[consensus]**
- **James K. Polk** (Democrat) — president 1845-49; the Manifest-Destiny
  president (Texas annexation completed, Mexican-American War, Oregon settlement). **[consensus]**

### Timeline of relevant events
- **1828** — Jackson elected; Democratic Party founded; "Tariff of Abominations." **[consensus]**
- **1830** — Indian Removal Act; Webster-Hayne debate. **[consensus]**
- **1832** — Jackson vetoes the Bank re-charter (Jul 10); SC nullifies the tariff
  (Nov 24); Jackson re-elected. **[consensus]**
- **1833** — Force Bill + Clay's Compromise Tariff resolve the crisis; the Whig
  Party begins to coalesce. **[consensus]**
- **1834** — "Whig" name adopted by the anti-Jackson coalition. **[consensus]**
- **1836** — Specie Circular; Van Buren elected; Texas wins independence from
  Mexico. **[consensus]**
- **1837** — Panic of 1837; depression to ~1843. **[consensus]**
- **1840** — "Log Cabin" campaign; Whig W. H. Harrison defeats Van Buren (the
  Whigs' first presidential win). **[consensus]** *(In-game: an alt-history Van
  Buren wins instead, chunk-074.)*
- **1844** — Polk (Democrat) elected on expansion ("Fifty-Four Forty or Fight"). **[consensus]**
- **1845** — Texas annexed; O'Sullivan coins "Manifest Destiny." **[consensus]**
- **1846-48** — Mexican-American War; Wilmot Proviso (Aug 1846, fails); Treaty of
  Guadalupe Hidalgo (Feb 2, 1848). **[consensus]**
- **1850** — Compromise of 1850 (five bills, September); Fugitive Slave Act. **[consensus]**
- **1852** — Whig Winfield Scott crushed; the Whig Party's last presidential run. **[consensus]**
- **1854** — Kansas-Nebraska Act (May 30); Republican Party founded; Whigs
  collapse → **into §3**. **[consensus]**

### Era-appropriate factions / ideologies / interests
**Democrats** (the Jacksonian coalition): the "common man," Western/frontier
farmers, Southern planters and slaveholders, urban immigrant workers (esp. Irish
Catholics later); pro-expansion, anti-Bank, low-tariff, hard-money, limited
federal economic role, states'-rights-leaning. **Whigs**: Northern manufacturers
and merchants, commercial farmers, evangelical/reform-minded Protestants, much of
the planter elite who wanted the American System's credit/infrastructure;
pro-Bank, pro-tariff, pro-internal-improvements, expansion-skeptical. Internal
cleavages that matter (and which Kansas-Nebraska detonates): **"Conscience
Whigs"** (antislavery) vs. **"Cotton Whigs"** (pro-Southern); the **Free Soil
Party** (1848, anti-expansion); and the nativist **Know-Nothing/American** surge
(1850s, reacting to Irish/German Catholic immigration — the game flags "a rise in
nativist views" explicitly, chunk-074 post 6203). The slavery-in-the-territories
question is the cross-cutting axis that ultimately breaks *both* parties.
**[consensus]**

### Period-specific terminology
- **Use:** Democrat / Jacksonian / "the Democracy" (period self-name for the
  Democratic Party); Whig / "Conscience Whig" / "Cotton Whig"; National Republican
  (the pre-Whig anti-Jackson label, ~1825-33); the "American System";
  nullification / states'-rights / "the Force Bill"; the Bank War / "pet banks" /
  Specie Circular; "King Andrew"; Manifest Destiny; popular sovereignty; Free
  Soil; Wilmot Proviso; Fugitive Slave Act; Know-Nothing / American Party
  (nativist). **The Democratic Party is now a real, named party** — unlike §2/§2.5.
- **Avoid / handle with care:** **"Republican"** in this era — the Jeffersonian
  "Republicans" are *over* (their nationalist wing became Whigs, their Jacksonian
  wing became Democrats), and the **antislavery Republican Party does not exist
  until 1854** (the very end of the window). Calling anyone a "Republican" mid-era
  is wrong on both counts. Also avoid modern "liberal/conservative": the
  *pro-government-activism* pole here is the **Whigs**, the reverse of post-1932.
- **THE GAME-SPECIFIC TRAP:** the game keeps **RED = "Federalists"** alive into
  the 1840s instead of "Whigs," and **BLUE = "Democratic-Republicans"** instead
  of "Democrats." When narrating real history, use **Democrat vs. Whig** for
  ~1834-1854; treat the game's persistent First-Party labels as its own
  convention (see Game-treatment).

### Common pop-history simplifications and what they get wrong
- **"The Jacksonian Democrats were the modern left / the Whigs the modern
  right."** **[consensus]** No — the activist-government, pro-tariff,
  pro-infrastructure pole was the **Whigs**; the small-federal-government,
  hard-money, states'-rights pole was the **Democrats**. The economic polarity is
  the *reverse* of the post-New-Deal alignment.
- **"Manifest Destiny was a shared national mission."** **[consensus]** It was a
  *partisan Democratic* slogan (coined 1845) that **Whigs and antislavery
  Northerners opposed**. ([American Yawp](http://www.americanyawp.com/text/12-manifest-destiny/))
- **"Jacksonian democracy expanded democracy for everyone."** **[consensus,
  neutral framing]** It expanded the white-male franchise (dropping property
  qualifications) while presiding over **Indian Removal** and the entrenchment of
  slavery; "the common man" meant white men. State it as the franchise mechanic
  it was, without modern editorializing.
- **"The slavery crisis only started in the 1850s."** **[consensus]** The
  territorial-slavery fight runs continuously from the Missouri Compromise (1820,
  §2.5) through the Wilmot Proviso (1846) and Compromise of 1850 to
  Kansas-Nebraska (1854); the 1850s were the *culmination*, not the start.
- **"The Compromise of 1850 was one law (Clay's omnibus)."** **[consensus]** The
  omnibus *failed*; Douglas broke it into **five separate bills** that each passed
  with different coalitions in September 1850. ([National Archives](https://www.archives.gov/milestone-documents/compromise-of-1850))

### Game treatment vs. real history (divergence notes)
- **The game's internal era names track the real periodization loosely but
  rename it.** The span the game calls late "**Era of Republicanism**" → "**Era
  of Manifest Destiny (1840-1856)**" → "**Era of Nationalism (1856-1868)**"
  (chunk-074; chunk-117) maps onto real Jacksonian/Second-Party-System →
  expansion/sectional-crisis → Civil-War periodization. The **"Era of Manifest
  Destiny" framing text is era-accurate**: it names the Pacific gaze, Mexican/
  British-Canada border tension, the Texas purchase, the *contained* (non-
  expanding) slavery question, the **tariff→nullification→Union** debate, and the
  **nativist reaction to Irish/German Catholic immigration** (chunk-074 post
  6203) — all real 1840s issues. **[consensus that these are the right issues]**
- **THE LOAD-BEARING DIVERGENCE — persistent First-Party labels.** As in §2.5,
  the game runs **BLUE = "Democratic-Republicans"** and **RED = "Federalists"**
  through a period that was historically **Democrat vs. Whig**. Daniel Webster
  (a real Whig) is "leader of the **Federalists**" in 1840 (chunk-074 post 6204);
  players openly note the gap ("IRL, the Democratic-Republicans wouldn't lose the
  House majority until 1841 when the Whigs took over," chunk-034 post 2783; "Are
  we Whigs yet?", chunk-088). Game-master guidance: when grounding play in real
  history, **say Democrat/Whig for ~1834-1854**; the game's token labels are a
  continuity convenience, not the historical party names. **This is the single
  most important note for this section.**
- **It is an alt-history of officeholders and event-timing, not a re-enactment.**
  Fictional/alt presidents (Wood, Wilson-who-resigns, Cahoon, Randolph Jr.) and a
  player-driven **Louisiana Purchase on a divergent schedule** (Treasury Sec
  Livingston "finally achieved the successful purchase," chunk-074 post 6204)
  show the campaign diverging from the real Jackson→Van Buren→Harrison→Polk
  sequence even while drafting the real *figures* (Van Buren, Clay, Webster,
  Douglas, Fillmore, Stephens, Stanton — chunks 055/074). Use the real
  chronology for texture; treat named leaders and set-piece *dates* as the
  campaign's timeline.
- **Era-gated mechanics roughly match real chronology, with noted slips.**
  Players observe content that *should* be available earlier being gated late
  (e.g. "Increase state jobs doesn't enter… until the Era of Nationalism, so he's
  about 12 years early," chunk-083; a constitutional-convention item "historically
  passed in 1787… doesn't become an option for us until the Era of Manifest
  Destiny," chunk-083). These are *gating* quirks, not history errors, but they
  indicate the era-event scheduling is approximate.
- **Secession/Unionism logic already encodes the era's real fault line.** The
  engine's secession rules branch on "**Jacksonian** or Era of Manifest Destiny/
  Era of Nationalism" and weight Trad/RW-Pop/Conservative ideologies toward
  secession with **"Southern Unionists will never vote for it"** (chunk-082) —
  i.e. it correctly carries the nullification-era states'-rights cleavage forward
  into the Civil-War subsystem (§3). **[consensus that this is the right cleavage]**
- **Connects directly to §3.** Because this is the *same campaign* as the
  1868-Gilded-Age batch, the Kansas-Nebraska → Republican-founding hinge at the
  end of this window is exactly where the game transitions into its "Era of
  Nationalism" (1856) — the antebellum era documented in §3, whose polarity then
  **flips** (RED becomes the antislavery party). The polarity continuity of
  §2.5/§2.6 (BLUE = the Jeffersonian/Jacksonian descent) **ends here**.

---

## 3. Antebellum / sectional crisis (c. 1856)

### Era window
Shipped 1856 scenario, engine era `nationalism`. Event spine runs 1856 (Bleeding
Kansas) → 1861 (Trent Affair) (`eraEvents1856.ts`). Bounding context: Compromise
of 1850 → Kansas-Nebraska Act (1854) → secession (1860-61).

**Note on the "A House Divided" Part 2 playtest:** despite the "1856" label, that
campaign does **not** stay in the antebellum era — it boots at 1856 and plays
*continuously through 1900*, with explicit in-thread era transitions to the
**Gilded Age at 1868** ("Welcome to 1868, the Era of the Gilded Age," chunk-031)
and to **Progressivism at 1892** ("Welcome to the Era of Progressivism," chunk-106;
final half-term 1898-1900, chunk-126). So this single thread is the real-history
bridge from §3 *into* §4 (Gilded Age) and toward §5 (Progressive). For the
**1868→1900** real history this campaign also traverses — Reconstruction's end,
Stalwart/Half-Breed/Mugwump/Bourbon factional politics, the tariff/currency/
civil-service issues, the 1896 realignment — **see §4 (and §5)**; only the
antebellum-specific real history stays in §3 below.

**Note on the "Drums of War" all-CPU playtest:** an even longer-running thread
(an all-CPU mechanical stress-test of the Civil War subsystem) **starts in
1841** under President Harrison/VP Tyler with the late Jacksonian-Whig
second-party system intact ("Welcome everyone to an all CPU playtest of the
Civil War years… start after the 1840 elections," chunk-001 post 1) and runs
*continuously through the Civil War, Reconstruction, Gilded Age, and Progressive
eras into mid-1924* (the final chunk-117 covers the 1922-24 half-term under
President Hearst: League of Nations debate, Kellogg-Briand pact, London Naval
Treaty, Nazi Party emergence). So it corroborates §3 (antebellum/Civil War) and
extends it backward into the **1840s Whig-Democrat era** — and the same thread
also corroborates §4 (Gilded Age) and §5 (Progressive/WWI/1920s). It surfaces
no new real-history detail beyond what §2.6 and §3-§5 already document; the
historical content is the same Whig/Democrat → Republican/Democrat → Progressive
arc. **The 1840s opening framing** (Harrison/Tyler/Webster/Clay/Calhoun; Whigs vs.
Democrats; Mexican-border tensions; "Manifest Destiny" debates) is era-accurate
for the late-Jacksonian/Whig second party system that immediately precedes the
1856 Republican founding — see **§2.6** for that period's real history and the
Manifest-Destiny note.

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
  truly national candidate. ([Wikipedia 1856 election](https://en.wikipedia.org/wiki/1856_United_States_presidential_election), [Britannica](https://www.britannica.com/event/United-States-presidential-election-of-1856)) *(The game opens at exactly this result — "174 electoral votes… Fremont 114… Fillmore only 8," chunk-001 post 1 — then diverges, see Game-treatment notes.)*
- **The defining issue was slavery's *expansion into the territories*, not
  (yet) nationwide abolition.** Democrats backed "popular sovereignty"/expansion;
  Republicans opposed expansion (Free Soil); only a minority were abolitionists.
  **[consensus]** ([Miller Center](https://millercenter.org/president/buchanan/campaigns-and-elections))
- **Buchanan was president (inaugurated March 1857), not in 1856.** The scenario
  correctly seats Buchanan (`scenario1856.ts` boots mid-government). **[consensus]**
- **The Lecompton Constitution fight (1857-58) split the Democratic Party North
  vs. South — the pivotal pre-secession party rupture.** **[consensus]** Buchanan
  backed admitting Kansas as a slave state under the pro-slavery Lecompton
  Constitution (his Feb 2, 1858 message to Congress); **Stephen Douglas broke
  with him** (Dec 9, 1857) as a violation of popular sovereignty and sided with
  Republicans to block it. The English-Bill compromise sent it back to Kansas,
  where voters rejected it **11,300–1,788 (Aug 2, 1858)**. This intra-Democratic
  split is what made a Republican 1860 win possible. ([Battlefield Trust — Lecompton](https://www.battlefields.org/learn/articles/lecompton-constitution), [Miller Center — Buchanan key events](https://millercenter.org/president/james-buchanan/key-events))
- **Real secession sequence (the anchor the game's alt-history diverges from):**
  **after Lincoln's Nov 1860 election**, **South Carolina seceded first on Dec 20,
  1860**; six more Deep-South states followed by Feb 1, 1861; in **Feb 1861
  Jefferson Davis** (with VP Alexander Stephens) was chosen provisional CSA
  president, inaugurated **Feb 18, 1861, in Montgomery, AL**; the upper South
  (VA, AR, NC, TN) seceded only **after Fort Sumter (Apr 1861)**. **[consensus]**
  ([House History — Secession of South Carolina](https://history.house.gov/Historical-Highlights/1851-1900/The-secession-of-South-Carolina/), [Battlefield Trust — Fort Sumter](https://www.battlefields.org/learn/civil-war/battles/fort-sumter))

### Key figures
- **James Buchanan** (Democrat) — won 1856, president 1857-61; widely ranked a
  failure for aggravating sectional crisis (Lecompton, *Dred Scott* deference).
  Seated in the scenario as president and one human faction's leader (Conservative
  Democrats, chunk-001 post 1). **[consensus]**
- **John C. Frémont** (Republican) — first Republican presidential nominee, 1856. **[consensus]**
- **Millard Fillmore** (American/Know-Nothing) — ex-Whig president running on the
  nativist ticket. **[consensus]**
- **Stephen Douglas** (Democrat) — "popular sovereignty"; Kansas-Nebraska author;
  the Lecompton break with Buchanan; the seven **Lincoln-Douglas debates (1858)**.
  Heads the game's Popular Sovereignty Democrat faction (chunk-001 post 1). **[consensus]**
- **Roger Taney** — Chief Justice; *Dred Scott* (1857), modeled as an era event
  (`eraEvents1856.ts` dredScott1857); the game keeps him on the Court as the
  aging CJ (chunk-001 post 1; survives repeated retire/death rolls in play). **[consensus]**
- **Abraham Lincoln** — Free-Soil Republican; the Lincoln-Douglas debates raised
  his national profile; **in real history won the 1860 presidency**, triggering
  secession. *In the game's alt-timeline he is NOT the 1860 winner* — he is a
  member of the Crittenden Republican faction at game start and is instead
  nominated for president by the Republicans in **1868** (chunk-001 post 1;
  partial-03). **[consensus on real history]**
- **William H. Seward** (Republican) — NY senator/governor, antislavery leader;
  the real-history 1860 GOP front-runner whom Lincoln beat for the nomination.
  *In the game he is the RED party leader and the faction the campaign elevates
  to the presidency* (see Game-treatment). **[consensus on real history]**
- **John J. Crittenden** — Kentucky Unionist (Whig/Constitutional Unionist); his
  Crittenden Compromise came in 1860-61. Lends his name to a game Republican
  faction (a label stretch — see Game-treatment). **[consensus]**
- **Jefferson Davis** — Mississippi senator/Pierce's War Secretary; the real
  CSA president (1861). *The game's alt-timeline instead makes him the Democratic
  party leader and seats a different figure (Quitman) as CSA president.* **[consensus on real history]**

### Timeline of relevant events
- **1854** — Kansas-Nebraska Act; Republican Party founded. **[consensus]**
- **1856** — "Bleeding Kansas" violence; Brooks canes Sumner; Buchanan elected. **[consensus]**
- **1857** — *Dred Scott*; Panic of 1857; Lecompton Constitution drafted; Douglas
  breaks with Buchanan over it (Dec). **[consensus]**
- **1858** — Lecompton rejected by Kansas voters (Aug 2); the seven **Lincoln-Douglas
  debates** (Aug–Oct, for the Illinois Senate seat — chosen by the state
  legislature, which returned Douglas). **[consensus]** ([Battlefield Trust — Lincoln-Douglas Debates](https://www.battlefields.org/learn/articles/lincoln-douglas-debates), [NPS](https://www.nps.gov/liho/learn/historyculture/debates.htm))
- **1859** — John Brown's raid on Harpers Ferry (Oct). **[consensus]**
- **1860** — Lincoln elected (Nov); South Carolina secedes (Dec 20). **[consensus]**
- **1861** — Secession Winter; Davis inaugurated CSA president (Feb 18,
  Montgomery); Fort Sumter (Apr, war begins); upper South secedes; Trent Affair
  (Nov–Dec). **[consensus]**

### Era-appropriate factions / ideologies / interests
**Democrats** (BLUE): the dominant national party, split North/South — Southern
"slave power" (planters, pro-expansion) + Northern "popular sovereignty"
(Douglas) + Unionist/border + Northern urban/immigrant (the game's
Loco-Foco/Jacksonian wings). **Republicans** (RED): a Northern sectional
coalition — Free-Soilers, antislavery ex-Whigs, a smaller radical/abolitionist
wing, Northern industry/protectionism. **Know-Nothings** (nativist) are a
*separate* party. **[consensus]** Interest blocs that matter: Slave Power /
Planters, Abolitionists, Northern Industry/Manufacturers, Free-Soil Settlers,
Immigrants vs. Nativists. As the war approaches, two further real groupings the
campaign uses appear: **Copperheads** (Northern antiwar/Peace Democrats — a game
faction, partial-03) and **Fire-Eaters / secessionists** vs. **Southern
Unionists** (the cleavage the game's per-politician secession rolls model).

### Period-specific terminology
- **THE BIG ONE — polarity is flipped vs. modern usage.** In 1856 the
  **Democratic Party is the conservative, states'-rights, pro-slavery party**
  and the **Republican Party is the new antislavery/free-labor/(relatively)
  progressive party**. The shipped enthusiasm table encodes exactly this:
  Traditionalist/RW-Populist/Conservative lean **BLUE** (Democratic);
  Progressive/Liberal/LW-Populist lean **RED** (Republican)
  (`scenario1856.ts:18-31`), and the playtest confirms it in plain terms — "Blue =
  Democrats, Red = Republicans… 1856-era Republicans are the antislavery party;
  the dominant force this era" (*house-divided* partial-03). **Do not** import the
  modern "Democrat=left, Republican=right" mapping anywhere in 1856–1900. **Also
  note** this RED=Republican party is a *brand-new* party (1854), unrelated to the
  Jeffersonian "Republicans" of §2.5 (which were the *Democrats'* ancestor).
- **Use:** Free Soil, popular sovereignty, "the Slave Power," Fire-Eaters
  (Southern radical secessionists), Border Ruffians, Copperheads (later),
  Unionist/Southern Unionist, Doughface (a Northern man with Southern sympathies,
  e.g. Buchanan), Lecompton, secession convention.
- **Avoid:** treating "Republican" as the modern GOP or "Democrat" as the modern
  party; "civil rights" in the modern sense; "liberal/conservative" without the
  era-flip caveat.

### Common pop-history simplifications and what they get wrong
- **"Republicans in 1856 wanted to abolish slavery."** **[consensus]** No — the
  mainstream Republican position was *no expansion* (Free Soil); abolitionists
  were a minority wing. Lincoln in 1860 ran on non-extension, not abolition.
- **"The Know-Nothings were Republicans."** False — separate party in 1856 (see
  binding facts).
- **"The Democratic Party split only at the 1860 convention."** **[consensus]**
  The fracture was already structural by **1857-58 over Lecompton** (Buchanan vs.
  Douglas); the 1860 Charleston/Baltimore split into Northern (Douglas) and
  Southern (Breckinridge) tickets was the culmination, not the cause.
- **"The North was solidly antislavery and the South solidly pro-secession."**
  **[consensus]** Both regions had deep internal cleavages — Northern Democrats
  and Doughfaces; Southern Unionists and non-slaveholding whites; border states
  (DE, MD, KY, MO) that never seceded.
- **"Manifest Destiny was a national consensus."** **[consensus]** The term was
  coined by O'Sullivan in 1845 and became prominent largely *because Whigs
  attacked it*; Whigs and antislavery Northerners opposed expansion as a
  "slave-power" scheme. The game's `Manifestdestiny` ideology card on the
  Popular-Sovereignty Democrats (`factions1856.ts:6`) should be read as a
  *Democratic* position, not a shared one. ([Manifest Destiny](https://en.wikipedia.org/wiki/Manifest_destiny))

### Game treatment vs. real history (divergence notes)
- **Mostly strong fidelity at the START.** The 1856 factions (`factions1856.ts`)
  are the best-researched in the shipped data: Conservative/Popular-Sovereignty/
  Unionist/Jacksonian/Loco-Foco Democrats and Crittenden/Moderate/Liberal/
  Radical/Know-Nothing Republicans capture the real intra-party wings, and the
  game opens *exactly* at the real 1856 result (Buchanan 174 / Frémont 114 /
  Fillmore 8; chunk-001 post 1).
- **THE BIG DIVERGENCE — this is an alt-history once play begins.** The campaign
  is a multiplayer, multi-term playthrough that **rewrites the sectional crisis**:
  - **Republican William H. Seward (not Lincoln) wins the 1860 presidency**
    (199-103 EV over Pendleton) and is **re-elected in 1864** (219-15 over
    Alexander Stephens) — partial-02/03. So the man who in real life *lost* the
    1860 nomination to Lincoln is the game's wartime president.
  - **Secession is triggered ~1863, not 1860-61, by a bungled event.** In the
    game, secession fires when President Seward **blunders the "John Brown's Raid"
    decision** (failed implementation roll → "automatic secession convention and
    Civil War"); 11 states leave and form the CSA *mid-1860s* (partial-02 post
    1166-1168; partial-03 "10 Southern states seceded late 1863"). Real history:
    secession followed **Lincoln's 1860 election**, beginning **Dec 20, 1860**.
  - **The CSA president is John A. Quitman (with VP John Letcher), not Jefferson
    Davis** (partial-02). In the game, **Davis is instead the *Democratic* party
    leader**. Capital Richmond and a UK-recognition threat match the real CSA.
  - **Lincoln is nominated by the Republicans only in 1868** (6th ballot;
    chunk-001 post 1, partial-03) — i.e. the game defers his rise by eight years.
  > Game-master framing: use the **real** sectional-crisis chronology and figures
  > for ideological/era texture, but treat this campaign's *named wartime leaders,
  > the secession year, and who is CSA president* as its own divergent timeline.
- **The Civil War is a large multi-term subsystem, almost certainly unbuilt in
  the shipped engine.** The playtest fights it as a structured combat phase
  separate from the turn loop: **two theaters (East/West), 3 naval wins gate
  ground combat, a per-battle success formula, a per-theater War Score with a +10
  auto-win, named historical battles, and named-officer casualties** (partial-02
  post 1332; partial-03 posts 1710/1977). The shipped `eraEvents1856.ts` spine
  ends at the Trent Affair (1861) and has **no** Civil War combat model — so the
  war the campaign actually plays is host-improvised content, not in the build.
  The *Drums of War* all-CPU thread independently corroborates this — it is
  explicitly framed as a stress-test of "Civil War rules" with the same
  out-of-engine combat model and similarly improvised faction/figure choices
  (e.g. President Hearst as 1922-24 chief executive, chunk-117).
- **Reconstruction is an end-of-era subsystem the campaign reaches (1865-68),
  also unbuilt.** Post-victory readmission plans (Ironclad-Oath loyalty / military
  districts requiring 14th-Amendment ratification / pardoning rank-and-file
  Confederates), the 13th/14th/15th-equivalent amendment session, and "African-
  Americans can now hold office" all appear as host rulings (partial-03 posts
  1960-1988). This belongs to §4's era (Gilded Age) chronologically.
- **Two faction-placement flags (start-of-game labels):**
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
    in 1860-61. As a "moderate Unionist" wing it works; the *name* is a stretch.
    The campaign uses this faction as Lincoln's home wing at start (chunk-001
    post 1). **[inference]**
- **Three-way race compressed to two parties.** The engine's BLUE/RED forces the
  1856 *three*-party reality (Dem / Rep / Know-Nothing) into two — an inherent
  abstraction. Fine as a game model; the game-master should know Fillmore's
  candidacy and the Whig collapse are the missing third leg
  ([Britannica](https://www.britannica.com/event/United-States-presidential-election-of-1856)).
- **Shipped event spine is accurate and well-dated** (Bleeding Kansas 1856, Dred
  Scott 1857, Panic 1857, John Brown 1859, secession 1860-61). The Trent Affair
  cabinet-decider framing (`eraEvents1856.ts:180-219`) correctly reflects the
  Dec 26 1861 cabinet meeting. **[consensus]** *(The shipped events are faithful;
  it is the campaign's downstream play that diverges, per above.)*

---

## 4. Gilded Age (1868–1892)

### Era window
The *gilded* digest runs 1868-1872; the era is conventionally **1868-1896**
(Reconstruction tail → before the 1896 realignment). Engine: no dedicated era
value — runs on the `modern` enum or a future `gilded`/`progressive` split
(game-context gap-log #41). **No shipped scenario.** The forward arc the threads
gesture at is **Gilded Age → Populist surge (1890s) → Progressive Era**. *(The
"A House Divided" Part-2 campaign — see §3 — also plays this whole window,
transitioning in at "Welcome to 1868, the Era of the Gilded Age" and running to
its 1892 Progressive transition; so the real history here governs that thread's
back two-thirds as well.)* *(The "Drums of War" all-CPU stress-test thread —
see §3 — likewise transits this entire era continuously from a 1841 start, so
the real history here also governs its 1868-1892 in-game years; it surfaces no
new real-history detail beyond what this section already documents.)* *(The
6aa7309a "1800 Playtest" — see §2.5/§2.6 — is the **early half of the same
campaign** as the *gilded* batch and runs *into* this era at its 1868 finale
("Welcome to 1866-1868!", chunk-117; "the final turn of the Era of Nationalism"),
i.e. it hands off to the Gilded Age this section documents.)*

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
  *correct* era issues; slavery and 1850s sectionalism should be retired. *(The
  "A House Divided" thread reaches this era as an alt-history continuation of
  1856 — by 1868 it has a CSA defeated and readmitted under a Reconstruction
  plan, an annexed Canada with new states, and Lincoln only just nominated; so
  its Gilded-Age roster/map diverges sharply from the real 1868 even though the
  real *issues* converge.)*
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

## 5. Progressive Era / WWI / 1920s (1896–1932) — the realignment hinge

### Era window
The *1948-continued* thread starts already past this era (in 2004), so it is not
*played* in that batch — but it is the **bridge** between the documented Gilded
Age and the New Deal, and the era where the modern party polarity has **not yet**
formed. Bounding events: Realignment of **1896** (McKinley def. Bryan) →
**1932** (FDR). Engine: would run on `modern`/`progressive` tuning (no scenario).
*(The "A House Divided" Part-2 campaign explicitly enters this era — "Welcome to
the Era of Progressivism" at 1892, running through its 1898-1900 finale — so this
section also frames that thread's closing years, as an alt-history.)* *(The
"Drums of War" all-CPU stress-test thread — see §3 — runs even further into this
era, ending mid-1924 under President Hearst with the League of Nations debate,
Kellogg-Briand pact, London Naval Treaty, and Nazi-Party emergence in chunk-117;
all era-accurate 1920s events, no new real-history detail beyond what this
section already documents.)*

### Binding facts (ground truth)
- **1896 was a critical realignment that locked in Republican national dominance
  for a generation.** **[consensus]** McKinley (Republican, gold standard,
  pro-business, pro-tariff) beat Bryan (Democrat-Populist fusion, "Free Silver,"
  "Cross of Gold"); McKinley was the first president to win a popular *majority*
  since 1872. From 1896 to 1932 Democrats held the presidency **only** during
  Wilson's two terms (1913-21). ([Britannica — 1896 election](https://www.britannica.com/event/United-States-presidential-election-of-1896), [Miller Center — McKinley](https://millercenter.org/president/mckinley/campaigns-and-elections))
- **Progressivism was a cross-party movement, NOT a party.** **[consensus]** It
  ran through *both* parties — Republican (Theodore Roosevelt, Robert La Follette,
  Hiram Johnson) and Democratic (Bryan, then Wilson) — plus a freestanding
  Progressive ("Bull Moose") third party in 1912. There was no single
  "progressive party," and "progressive" did not yet map to one side of the
  red/blue divide. ([Britannica — Progressive movement](https://www.britannica.com/place/United-States/Theodore-Roosevelt-and-the-Progressive-movement))
- **Wilson's 1912 win was a fluke of a split Republican vote.** **[consensus]**
  The GOP vote divided between incumbent Taft and ex-president TR on the Bull
  Moose ticket, letting Wilson win with ~42% of the popular vote.
  ([Britannica — Progressive era](https://www.britannica.com/place/United-States/The-Progressive-era))
- **Major structural reforms in this window:** the 16th Amendment (federal income
  tax, 1913), 17th Amendment (direct election of senators, 1913), 18th
  (Prohibition, 1919) and 19th (women's suffrage, 1920) Amendments; the Federal
  Reserve (1913); antitrust (Clayton Act, FTC, 1914). **[consensus]**
- **The 1920s were Republican-dominated and pro-business** (Harding, Coolidge,
  Hoover; "the business of America is business"); the Democratic Party was split
  between its dry/rural/Southern wing and its wet/urban/immigrant wing
  (the 1924 convention deadlocked 103 ballots; Al Smith's 1928 Catholic
  candidacy cracked the Solid South for the first time). **[consensus]**

### Key figures
- **William Jennings Bryan** (Democrat) — three-time nominee (1896/1900/1908);
  bridges Populism to Progressivism; "one of the most liberal members of his
  party" in the period's sense (pro-"little guy," anti-monopoly, but also rural,
  dry, and religiously traditionalist). **[consensus]**
- **Theodore Roosevelt** (Republican, then Progressive) — trust-busting,
  conservation, "Square Deal"; bolts the GOP to run third-party (Bull Moose)
  in 1912. A *progressive Republican* — illustrates that progressivism wasn't
  Democratic-coded yet. **[consensus]**
- **Woodrow Wilson** (Democrat) — the lone Democratic president 1913-21; "New
  Freedom"; Federal Reserve, income tax, antitrust; WWI; also re-segregated the
  federal civil service. **[consensus]**
- **Robert La Follette** (Republican) — "Fighting Bob," Wisconsin progressive;
  ran as a Progressive in 1924. **[consensus]**

### Timeline of relevant events
- **1896** — McKinley def. Bryan; realignment; gold over silver. **[consensus]**
- **1901** — McKinley assassinated; TR becomes president. **[consensus]**
- **1912** — Four-way race; Wilson wins on a split GOP; Bull Moose Progressives. **[consensus]**
- **1913** — 16th & 17th Amendments; Federal Reserve. **[consensus]**
- **1917-18** — US enters WWI; Espionage/Sedition Acts. **[consensus]**
- **1919-20** — 18th (Prohibition) & 19th (suffrage) Amendments; Red Scare. **[consensus]**
- **1920-29** — Republican "return to normalcy"; 1920s prosperity. **[consensus]**
- **1929** — Stock market crash → Great Depression. **[consensus]**

### Era-appropriate factions / ideologies / interests
**Republicans** (the dominant national party): Northern business, finance, the
protective tariff, the gold standard — *but* also house a **progressive
insurgent wing** (TR, La Follette, Johnson). **Democrats**: the Solid South +
Northern urban machines + immigrants + Bryan's agrarian populists; internally
split dry/rural/Protestant vs. wet/urban/Catholic. Cross-cutting **interest
blocs**: trusts/big business, railroads, Wall Street, organized labor (AFL),
farmers (Grange/Populist heirs), Prohibitionists, suffragists, nativists
(immigration restriction peaks 1921/1924). **[consensus]**

### Period-specific terminology
- **Use:** Progressive (cross-party reform movement), Bull Moose, trust-busting,
  muckraker, Free Silver/gold standard (fading after 1896), "return to
  normalcy," dry/wet (Prohibition), the tariff. "Liberal" in this era still
  leans toward its *classical* (free-market, anti-monopoly individualist) sense,
  though Bryan/Wilson begin bending it toward active government.
- **Avoid / handle with care:** mapping "progressive" onto one modern party — it
  was **both**; modern "liberal = Democrat / conservative = Republican" (does
  **not** hold yet). "Conservative" in the 1920s describes the *dominant
  Republican* business establishment, the opposite of where the realignment ends.

### Common pop-history simplifications and what they get wrong
- **"Progressives were Democrats."** **[consensus]** No — progressivism was a
  bipartisan movement; some of its biggest names (TR, La Follette, Johnson) were
  *Republicans*. This is the single biggest trap for this era.
- **"Bryan was a modern liberal."** **[contested/inference]** Economically
  left-populist, yes — but also dry, rural, evangelical, and the prosecution's
  star at the 1925 Scopes trial. Period "liberalism" doesn't map onto the modern
  cultural-left package. **[consensus that the package differs.]**
- **"The 1920s were uniformly prosperous and conservative."** Farmers were in
  depression through the decade; labor and immigrants were excluded from the
  boom; the Klan revived as a mass movement. **[consensus]**

### Game treatment vs. real history (divergence notes)
- **Not directly played in the 1948 batch; no scenario.** The *1948-continued*
  thread starts in 2004, so the game-master's accumulated 1948+ alt-history
  *already passed through* this era's outcomes (the 16th/17th/18th/19th
  Amendments, the Fed, the New Deal) — but note the thread shows the game can
  **diverge** from real amendments: e.g. in 2008 the game is still debating
  ratifying a presidential **two-term-limit amendment** (chunk-001 post 15,
  "H.R.9 Two-Term Limit for Presidents Amendment… would not apply to Pres
  Cuomo") — the real-life 22nd Amendment passed in **1951**. Treat the campaign's
  institutional history as a *divergent alt-timeline*, not a mirror of real dates.
  *(The "A House Divided" thread, by contrast, actually plays this era's opening
  years 1892-1900 as a direct continuation of its 1856 alt-history.)* *(The
  "Drums of War" all-CPU thread also actually plays this era — through WWI and
  into mid-1924 under President Hearst — and shows the engine handling 1920s
  events at real-history texture: League of Nations, Kellogg-Briand, the London
  Naval Treaty, even the Nazi Party emergence in Germany; chunk-117. So this
  era's *event content* is engine-tested even if the period has no shipped
  scenario.)*
- **Polarity guidance for any future build:** if a `progressive` era is ever
  scenario-ized, the BLUE/RED → Democrat/Republican mapping should be treated as
  **in flux**, with progressivism deliberately spanning both parties — the
  opposite of the clean modern split.

---

## 6. New Deal / WWII / postwar consensus (1932–1965) — the realignment that redefines "liberal"

### Era window
**1932** (FDR's first win; the New Deal realignment) → **1964/65** (LBJ landslide;
Great Society; Civil Rights & Voting Rights Acts open the next phase). The
*1948-continued* campaign's **starting point (1948)** sits inside this era, and
its accumulated legislative record (Cold War statutes, the FDA, NASA subsidies,
"use of military force in SE Asia to defend against the spread of Communism" —
all visible being *repealed* in chunk-032) was built up across this era. Engine:
`modern` tuning (no dedicated scenario).

### Binding facts (ground truth)
- **1932 is the realignment that makes the Democratic Party the party of the
  *economic left* and redefines "liberal."** **[consensus]** FDR's Democrats
  replaced the Republicans as the majority party; the direction of federal policy
  shifted "from conservative to liberal — and liberalism itself was redefined in
  the process," from its older free-market sense to **active, pro-government,
  pro-regulation, pro-labor** policy. ([Britannica — Democratic Party](https://www.britannica.com/topic/Democratic-Party), [Miller Center — FDR campaigns](https://millercenter.org/president/fdroosevelt/campaigns-and-elections))
- **The "New Deal coalition" was a broad, cross-cutting alliance:** Southern white
  Protestants + Northern urban machines + Catholics + Jews + organized labor
  (the new CIO) + Northern Black voters (newly shifting Democratic) + small
  farmers + intellectuals/liberals. **[consensus]** It held, with strains, into
  the 1960s. ([Miller Center — FDR campaigns](https://millercenter.org/president/fdroosevelt/campaigns-and-elections), [Britannica — Democratic Party](https://www.britannica.com/topic/Democratic-Party))
- **CRUCIAL — the realignment was *economic*, not yet *racial*.** **[consensus]**
  The Solid South was still **Democratic**; the same party contained both
  Northern liberals/labor *and* Southern segregationists. So although BLUE
  (Democrats) = the economic-left pole from 1932 on, the party was **not yet
  ideologically uniform** — its racial conservatives sat on the *same side* as
  its labor liberals. This internal contradiction is what the *next* era's
  realignment resolves.
- **A bipartisan "conservative coalition" of Republicans + Southern Democrats**
  blocked further New Deal expansion in Congress from ~1937 on and shaped
  legislation for decades. **[consensus]** ([Britannica — Democratic Party](https://www.britannica.com/topic/Democratic-Party))
- **Postwar "Cold War consensus":** both parties broadly agreed on containment
  abroad (NATO, the Truman Doctrine, Korea, the early Vietnam commitment) and
  accepted the New Deal's core at home; Eisenhower (R) did not roll back Social
  Security. The sharp left/right culture-war split comes *later*. **[consensus]**

### Key figures
- **Franklin D. Roosevelt** (Democrat) — president 1933-45; the New Deal; WWII;
  the architect of the modern Democratic coalition and modern "liberalism." **[consensus]**
- **Harry Truman** (Democrat) — president 1945-53; Fair Deal; **desegregated the
  armed forces (Executive Order 9981, 1948)** and ran on a strong civil-rights
  plank — the act that **triggered the 1948 Dixiecrat walkout** (the campaign's
  start year). **[consensus]**
- **Strom Thurmond** — 1948 **States' Rights Democratic ("Dixiecrat")**
  presidential candidate; the leading edge of Southern white defection — though
  he stayed a Democrat until 1964 (see §7). **[consensus]** ([Britannica — Dixiecrat](https://www.britannica.com/topic/Dixiecrat), [Senate — Thurmond bio](https://www.senate.gov/senators/FeaturedBios/Featured_Bio_Thurmond.htm))
- **Dwight Eisenhower** (Republican) — president 1953-61; "Modern Republicanism";
  accepts the New Deal settlement — exemplifies the postwar consensus. **[consensus]**

### Timeline of relevant events
- **1932** — FDR elected; realignment. **[consensus]**
- **1933-38** — New Deal (FDIC, SEC, Social Security 1935, Wagner Act 1935, FLSA 1938). **[consensus]**
- **1937** — Court-packing fight; "conservative coalition" forms in Congress. **[consensus]**
- **1941-45** — WWII; the US as a superpower. **[consensus]**
- **1947-49** — Cold War onset: Truman Doctrine, Marshall Plan, NATO. **[consensus]**
- **1948** — Truman desegregates the military (EO 9981); **Dixiecrat revolt**;
  Truman upsets Dewey. **[consensus]** *(Campaign start year.)*
- **1950-53** — Korean War; McCarthyism / Second Red Scare. **[consensus]**
- **1954** — *Brown v. Board* (school desegregation). **[consensus]**
- **1957** — Civil Rights Act of 1957 (weak); Thurmond's 24-hour filibuster. **[consensus]**
- **1964-65** — Civil Rights Act (1964) & Voting Rights Act (1965); Great Society. **[consensus]**

### Era-appropriate factions / ideologies / interests
**Democrats** (BLUE): the New Deal coalition — labor, urban ethnics, Catholics,
Jews, Northern Blacks, small farmers, liberals — **plus** the still-Democratic
**Solid South** (segregationist conservatives). The party's internal fault line
is North-liberal vs. South-conservative. **Republicans** (RED): business, the
Northeast/Midwest middle class, fiscal conservatives — split between an Eastern
"moderate/Modern Republican" establishment (Eisenhower, Dewey) and a rising
conservative/anti-New-Deal wing (Taft, then Goldwater). Interest blocs:
organized labor (now huge), business, farmers, the emerging civil-rights movement.
**[consensus]**

### Period-specific terminology
- **THE TERMINOLOGY HINGE — "liberal" now means modern (Democratic, pro-
  government).** From 1932, "liberal" = New Deal liberal = active government, the
  welfare state, labor, civil rights. This is the **first era in the whole
  timeline where "liberal" maps roughly onto the modern Democratic sense** —
  though without today's full cultural-left package. **[consensus]**
- **Use:** New Deal, the New Deal coalition, Fair Deal, Dixiecrat / States'
  Rights Democrat, Solid South (now Democratic but cracking), conservative
  coalition, Cold War liberal, "Modern Republicanism," containment, Red Scare /
  McCarthyism.
- **Avoid / handle with care:** treating the South as Republican in this era (it
  is **Democratic**); assuming the parties are already ideologically sorted (they
  are **not** — segregationists and labor liberals share the Democratic tent);
  "conservative" as synonymous with "Republican" (many of the fiercest
  conservatives here are *Southern Democrats*).

### Common pop-history simplifications and what they get wrong
- **"The parties have always meant what they mean now."** **[consensus]** This is
  the era that *creates* the modern economic meaning — and even here it's only
  half-done, because the racial axis still cross-cuts party.
- **"FDR's coalition was a natural left coalition."** It yoked Northern liberals
  to Southern segregationists — a marriage of convenience that the civil-rights
  era ultimately broke. **[consensus]**
- **"The Cold War was a partisan fight."** Largely the opposite at first —
  containment was a **bipartisan consensus**; Vietnam was escalated by Democratic
  presidents (Kennedy, Johnson) with broad Republican support. **[consensus]**

### Game treatment vs. real history (divergence notes)
- **This is the campaign's *origin* era (1948), played in the prior thread; the
  accumulated statute book is visible here.** Chunk-032 shows the legislature
  repealing era-defining laws — "Create the Food and Drug Administration,"
  "Subsidize NASA," "Grant the President the power to use military force in SE
  Asia to defend against the spread of Communism," "Create the National Monetary
  Commission" — which is exactly the New-Deal-through-Cold-War legislative layer
  this era deposits. **The game lets players *un-build* it**, so the campaign's
  present is a *divergent alt-history*, not the real 1948→2020 record.
- **Alt-history personnel.** By 2008 the game's president is "Cuomo," with Franken
  and Bush as governors (chunk-001 posts 14-15) — i.e. the New-Deal-era starting
  point produced a very different roster of officeholders. Game-master framing:
  use the *real* era for institutional/ideological texture, but don't assume the
  campaign's named leaders or enacted laws match history.
- **Polarity note for any build:** in a 1948-era scenario, BLUE (Democrats)
  should be the *economic-left* pole **but** must contain a Southern-conservative
  wing — modeling the Democrats as uniformly "left" in 1948 would be the central
  anachronism. The South does **not** belong to RED yet.

---

## 7. Civil Rights / Vietnam / the Southern realignment (1965–1980)

### Era window
**1965** (Voting Rights Act; Great Society in full) → **1980** (Reagan's
election). The pivotal era for the **Southern realignment** and the breakup of
the New Deal coalition. Engine: `modern` tuning.

### Binding facts (ground truth)
- **The Civil Rights / Southern realignment was GRADUAL — not a single-year
  flip.** **[consensus]** It unfolds over *decades*: the **1948** Dixiecrat
  revolt is the leading edge, **1964** (Goldwater carries five Deep South states;
  Thurmond switches to the GOP in September 1964) and **1968** (Nixon's "Southern
  Strategy"; Wallace's third-party run) accelerate it at the **presidential**
  level — but most Southern Democrats who bolted in 1948 *returned*, and the
  region's **congressional, state, and local** offices stayed majority-Democratic
  for **another generation**, only flipping in the 1980s-90s (see §8-9). Beware
  the pop-history "instant 1964 flip." ([Britannica — Southern strategy](https://www.britannica.com/topic/Southern-strategy), [Britannica — Dixiecrat](https://www.britannica.com/topic/Dixiecrat), [Brookings — Southern realignment](https://www.brookings.edu/articles/vital-stats-southern-committee-chairs-congress/))
- **The Civil Rights Act of 1964 vote was REGIONAL, not cleanly partisan —
  Republicans backed it at *higher* rates than Democrats.** **[consensus]**
  Senate final passage **73-27** (June 19, 1964): Democrats **46-21**,
  Republicans **27-6** — the opposition was overwhelmingly **Southern** (of both
  parties). House passage **289-126** (July 2) required ~80% of the GOP
  conference (138 Republicans) because so many Democrats (the Southern bloc)
  opposed it. ([Senate — Civil Rights Act of 1964](https://www.senate.gov/artandhistory/history/common/generic/CivilRightsAct1964.htm), [GovTrack — Senate vote 88-1964/s409](https://www.govtrack.us/congress/votes/88-1964/s409), [National Archives — Senate roll call](https://www.archives.gov/legislative/features/civil-rights-1964/senate-roll-call.html))
- **Why the realignment happened is genuinely contested.** **[contested]**
  - *Race-primacy thesis* (**Carmines & Stimson, *Issue Evolution***): the
    parties' divergence on civil rights triggered the permanent defection of
    racially conservative Southern whites — a racial "issue evolution."
  - *Economic-development thesis* (**Shafer & Johnston, *The End of Southern
    Exceptionalism***): postwar Southern economic growth and a new middle class
    drove the shift, with race as a *brake* on (not the engine of) GOP growth.
  Present both; do not assert a single cause. ([Cambridge — Transformation of Southern Politics Revisited](https://www.cambridge.org/core/journals/british-journal-of-political-science/article/abs/transformation-of-southern-politics-revisited-the-house-of-representatives-as-a-window/B0D710855EC663879079F1CD5B7B952B), [Harvard UP — End of Southern Exceptionalism](https://www.hup.harvard.edu/books/9780674032491))
- **Vietnam and the cultural upheaval fractured the New Deal coalition from the
  left, too.** **[consensus]** The 1968 Democratic split (Humphrey vs.
  antiwar McCarthy/RFK; the Chicago convention) and the white-ethnic/working-
  class backlash created the "Reagan Democrat" before Reagan.

### Key figures
- **Lyndon B. Johnson** (Democrat) — Great Society, Civil Rights Act 1964, Voting
  Rights Act 1965, Medicare/Medicaid; also Vietnam escalation; reportedly
  foresaw the South's loss to the GOP. **[consensus]**
- **Barry Goldwater** (Republican) — 1964 nominee; voted against the 1964 Civil
  Rights Act (on federalism grounds); carried five Deep South states — the first
  crack of the **presidential** Southern flip. **[consensus]**
- **Richard Nixon** (Republican) — 1968/1972; "Southern Strategy," "law and
  order," the "Silent Majority"; détente abroad; Watergate (1972-74). **[consensus]**
- **George Wallace** (Democrat, then independent) — segregationist Alabama
  governor; 1968 American Independent run carried five Deep South states,
  siphoning Democrats rightward. **[consensus]**
- **Strom Thurmond** — switched **Democrat → Republican in September 1964**, the
  emblem of elite Southern defection. **[consensus]** ([Senate — Thurmond bio](https://www.senate.gov/senators/FeaturedBios/Featured_Bio_Thurmond.htm))

### Timeline of relevant events
- **1964** — Civil Rights Act; Goldwater carries the Deep South; Thurmond switches. **[consensus]**
- **1965** — Voting Rights Act; Medicare/Medicaid; Vietnam escalation; Watts. **[consensus]**
- **1968** — MLK & RFK assassinated; Chicago convention chaos; Nixon wins;
  Wallace's third-party run. **[consensus]**
- **1972** — Nixon landslide (49 states); McGovern; Watergate break-in. **[consensus]**
- **1973** — *Roe v. Wade*; OPEC oil embargo / stagflation begins. **[consensus]**
- **1974** — Nixon resigns; Ford. **[consensus]**
- **1976** — Carter (Democrat) wins, briefly re-uniting parts of the old coalition
  (a Southern Democrat sweeping the South one last time). **[consensus]**
- **1978-80** — Stagflation, energy crisis, Iran hostage crisis. **[consensus]**

### Era-appropriate factions / ideologies / interests
**Democrats** (BLUE): the **fracturing** New Deal coalition — labor + Black
voters (now overwhelmingly Democratic after 1964-65) + liberals + the
**still-substantial but shrinking** Southern white bloc + the new
antiwar/student/feminist/"New Politics" left. **Republicans** (RED): business +
suburban middle class + the rising **New Right** + newly recruited Southern
whites + "Silent Majority" / law-and-order voters. New interest blocs:
the civil-rights movement, organized labor (peaking then declining), the
antiwar movement, second-wave feminism, environmentalists (first Earth Day 1970),
and the nascent religious right. **[consensus]**

### Period-specific terminology
- **Use:** Great Society, Southern Strategy, Silent Majority, "law and order,"
  Reagan Democrat (emerging), New Politics / New Left, the counterculture,
  stagflation, détente, busing, white backlash. "Liberal" is now firmly the
  Democratic/active-government label; **"conservative" is acquiring its modern
  movement-Republican meaning** (Goldwater → Reagan), but is **not yet** the
  South's default label.
- **Avoid / handle with care:** the **"the South flipped in 1964" shorthand** —
  it is the central anachronism for this era; the flip is *presidential-first and
  decades-long*. Don't narrate the 1964 Civil Rights Act as a *party-line* vote
  (it was regional; Republicans supported it more).

### Common pop-history simplifications and what they get wrong
- **"The South flipped to the GOP in 1964 (or overnight after the Civil Rights
  Act)."** **[consensus that this is wrong]** The *presidential* South began
  flipping 1964-68, but Democrats held most Southern Senate seats, House seats,
  governorships, and legislatures into the 1980s-1994; the realignment completed
  down-ballot only in the 1990s-2010s (see §8-9). ([Brookings](https://www.brookings.edu/articles/vital-stats-southern-committee-chairs-congress/))
- **"The 1964 Civil Rights Act was Democrats vs. Republicans."** False — it was
  **non-South vs. South**; Republicans voted for it at *higher* rates than
  Democrats (see binding facts).
- **"The realignment was purely about race"** (or "purely about economics").
  **[contested]** Genuine scholarly disagreement (Carmines/Stimson vs.
  Shafer/Johnston); present both.

### Game treatment vs. real history (divergence notes)
- **Played in the prior 1948 thread; the statute book reflects it.** The
  Vietnam-era "use of military force in SE Asia to defend against the spread of
  Communism" law being *repealed* in 2004+ (chunk-032) is precisely this era's
  Cold War legislative residue — the game carries it forward as accumulated state.
- **Polarity is the load-bearing thing for any 1965-era build.** If a scenario
  ever covers this window, the South must be modeled as **still substantially
  Democratic at the down-ballot level even as it trends Republican
  presidentially** — a *gradual* migration, not a switch. Modeling the South as
  Republican in, say, 1968 House/Senate/governor races would be the signature
  anachronism. **[consensus]**
- **Black-vote shift is the other load-bearing realignment here:** Black voters
  move overwhelmingly Democratic after 1964-65 — the mirror image of the white
  South's drift. A faithful model needs *both* migrations, in opposite
  directions, on different timetables.

---

## 8. Reagan realignment / end of the Cold War (1980–1992)

### Era window
**1980** (Reagan's election) → **1992** (Clinton; end of the GOP's 12-year White
House run; the Cold War just ended). Engine: `modern` tuning. This is where the
**national** party polarity becomes essentially modern.

### Binding facts (ground truth)
- **1980 capped the rise of the conservative movement and fixed "conservative" as
  the modern Republican label.** **[consensus]** Reagan is often described as the
  first true *movement-conservative* president in over 50 years: tax cuts,
  deregulation, a smaller domestic-government philosophy, Cold War buildup.
  ([Miller Center — Reagan campaigns](https://millercenter.org/president/reagan/campaigns-and-elections), [Britannica — 1980 election](https://www.britannica.com/event/United-States-presidential-election-of-1980))
- **"Reagan Democrats": working-class/socially-conservative Democrats defected to
  Reagan**, accelerating the New Deal coalition's breakup. **[consensus]**
  ([Miller Center — Reagan campaigns](https://millercenter.org/president/reagan/campaigns-and-elections))
- **The "New Right" fused economic conservatives, Cold War hawks, and a newly
  mobilized *religious right* (Moral Majority, 1979; evangelicals).** **[consensus]**
  This coalition is the spine of the modern GOP. ([Miller Center — grassroots conservatism](https://millercenter.org/the-presidency/teacher-resources/recasting-presidential-history/presidency-and-grassroots-conservatism))
- **At the *national/presidential* level the modern alignment is now in place:**
  Democrats = liberal/left, Republicans = conservative/right. **[consensus]**
  *But* the South's **down-ballot** realignment is still incomplete — Democrats
  held many Southern congressional seats and statehouses until 1994 (see §9).
- **The Cold War ends in this window:** Berlin Wall falls 1989; USSR dissolves
  December 1991 — removing the foreign-policy consensus glue and opening the
  1990s' more domestically focused, culture-war politics. **[consensus]**

### Key figures
- **Ronald Reagan** (Republican) — president 1981-89; "Reaganomics," tax cuts,
  deregulation, defense buildup; reframed conservatism as optimistic and
  mainstream; 1984 49-state landslide. **[consensus]**
- **George H. W. Bush** (Republican) — VP then president 1989-93; managed the end
  of the Cold War and the Gulf War (1991); "read my lips" tax reversal cost him
  with the Right. **[consensus]**
- **Tip O'Neill** (Democrat) — Speaker; the era's leading Democratic
  counterweight; symbol of the old New Deal liberalism on the defensive. **[consensus]**
- **Jerry Falwell** (Moral Majority, 1979) — organizer of the religious right
  into the GOP coalition. **[consensus]**

### Timeline of relevant events
- **1980** — Reagan def. Carter; GOP takes the Senate (first since 1954). **[consensus]**
- **1981** — Reagan tax cuts (ERTA); air-traffic-controller (PATCO) firing. **[consensus]**
- **1984** — Reagan 49-state re-election landslide. **[consensus]**
- **1986** — Tax Reform Act; Iran-Contra breaks. **[consensus]**
- **1987** — INF Treaty (Reagan-Gorbachev). **[consensus]**
- **1989** — Berlin Wall falls. **[consensus]**
- **1991** — Gulf War; USSR dissolves (December). **[consensus]**
- **1992** — Clinton def. Bush (Perot third-party). **[consensus]**

### Era-appropriate factions / ideologies / interests
**Republicans** (RED): the assembled **New Right / Reagan coalition** — economic
conservatives + Cold War hawks + the religious right + Reagan Democrats + the
now-decisively-Republican white South (presidentially). **Democrats** (BLUE): the
post-New-Deal coalition on the defensive — labor (declining), Black and Hispanic
voters, liberals, women (the emerging "gender gap"), and the South's *remaining*
Democratic officeholders. Interest blocs: business/deregulation, defense, the
religious right, organized labor (shrinking), environmentalists, the
emerging tech/finance economy. **[consensus]**

### Period-specific terminology
- **Use:** Reaganomics / supply-side, the New Right, Moral Majority / religious
  right, Reagan Democrats, the "gender gap," détente→buildup→INF, "evil empire,"
  the Cold War's end. "Conservative" now = the Reagan/Republican movement;
  "liberal" becomes a GOP **epithet** for Democrats ("the L-word," prominent by
  1988). **[consensus]**
- **Avoid / handle with care:** assuming the South is *fully* Republican
  down-ballot (not until ~1994); treating "liberal/conservative" as anything
  other than the now-modern Democratic/Republican mapping at the national level.

### Common pop-history simplifications and what they get wrong
- **"Reagan instantly made the South Republican."** **[consensus]** At the
  *presidential* level the GOP South was largely set by the 1980s, but the
  **congressional/state** South stayed substantially Democratic until the 1994
  Republican Revolution and after (see §9). ([Brookings](https://www.brookings.edu/articles/vital-stats-southern-committee-chairs-congress/))
- **"Everyone loved Reagan / it was a uniform conservative era."** The "Reagan
  Revolution" coexisted with a Democratic House throughout (Democrats held the
  House 1981-95) — i.e. divided government, not a one-party era. **[consensus]**

### Game treatment vs. real history (divergence notes)
- **Played in the prior thread; not in this batch.** Relevant as the era where
  the BLUE=left/RED=right mapping the *2004+* thread uses became locked in
  nationally — confirming the modern polarity the game applies to 2004→2020+.
- **Polarity guidance:** by ~1980-92, modeling BLUE=Democrat=liberal and
  RED=Republican=conservative is **historically correct at the national level**
  — this is the first era where the game's modern faction polarity needs no
  caveat for the presidency, even though Southern *down-ballot* offices still
  warrant the gradual-realignment caveat from §7.

---

## 9. Post-Cold-War 1990s (1992–2000) — the realignment completes down-ballot

### Era window
**1992** (Clinton) → **2000** (Bush v. Gore). The decade when the modern
alignment finishes spreading from the *presidency* down to *Congress, states,
and localities* — especially in the South. Engine: `modern` tuning.

### Binding facts (ground truth)
- **The 1994 "Republican Revolution" is when the realignment completed
  down-ballot.** **[consensus]** Republicans took the House for the first time in
  40 years (since 1954) under Newt Gingrich's "Contract with America"; in the
  South, a large majority of whites were now firmly Republican at the
  congressional level — the culmination of the decades-long shift. ([Miller
  Center — Clinton campaigns](https://millercenter.org/president/clinton/campaigns-and-elections), [Brookings — Southern realignment](https://www.brookings.edu/articles/vital-stats-southern-committee-chairs-congress/))
- **Clinton governed as a centrist "New Democrat" (DLC).** **[consensus]** He
  moved the party to the center: welfare reform (1996), NAFTA (1993), "the era of
  big government is over," a balanced budget by the late 1990s — a deliberate
  repositioning after the New Deal/Great Society liberal label became an
  electoral liability. ([Miller Center — Clinton campaigns](https://millercenter.org/president/clinton/campaigns-and-elections))
- **This is the takeoff of modern partisan polarization.** **[consensus]** Pew's
  long series shows ideological consistency and cross-party animosity beginning
  their sustained rise from **1994** onward — the Gingrich era is the inflection
  point into the modern polarized politics the 2004+ thread plays in.
  ([Pew — Political Polarization in the American Public, 2014](https://www.pewresearch.org/politics/2014/06/12/political-polarization-in-the-american-public/))
- **Globalization, the tech boom, the post-Cold-War "unipolar moment," and
  culture-war flashpoints** (gays in the military, the 1994 crime bill, the
  Clinton impeachment 1998-99) define the decade's substance. **[consensus]**

### Key figures
- **Bill Clinton** (Democrat) — president 1993-2001; New Democrat centrism;
  impeached 1998 (acquitted 1999); presided over the 1990s boom. **[consensus]**
- **Newt Gingrich** (Republican) — Speaker after 1994; "Contract with America";
  architect of the confrontational, nationalized congressional politics that
  pushed polarization. **[consensus]**
- **George H. W. Bush / Ross Perot** — the 1992 three-way race; Perot's deficit-
  focused independent run (~19%) presaged later anti-establishment populism. **[consensus]**

### Timeline of relevant events
- **1992** — Clinton def. Bush; Perot third-party. **[consensus]**
- **1993** — NAFTA; failed health-care reform ("HillaryCare"). **[consensus]**
- **1994** — Republican Revolution (House + Senate); Contract with America. **[consensus]**
- **1996** — Welfare reform (PRWORA); Clinton re-elected; Defense of Marriage Act. **[consensus]**
- **1998-99** — Clinton impeachment and acquittal. **[consensus]**
- **2000** — Bush v. Gore; Florida recount; decided by the Supreme Court. **[consensus]**

### Era-appropriate factions / ideologies / interests
**Democrats** (BLUE): New Democrat center-left — labor, minorities, women,
educated professionals, urban; the South now mostly *gone* down-ballot.
**Republicans** (RED): the Reagan coalition plus the **now-Republican Southern
white majority at every level**; the Gingrich-era confrontational conservatism;
the religious right; business/free-trade and deregulation. Interest blocs: tech
and finance (booming), free trade/globalization, the religious right, labor
(still shrinking), gun-rights (NRA ascendant). **[consensus]**

### Period-specific terminology
- **Use:** New Democrat / DLC / "Third Way," Contract with America, "Republican
  Revolution," welfare reform, "the era of big government is over," culture war,
  the "soccer mom"/"angry white male" voter tropes, the unipolar moment.
  "Liberal/conservative" now fully track Democrat/Republican.
- **Avoid:** any residual 1856/1868 polarity framing — by the 1990s it is fully
  reversed and fully sorted top-to-bottom. Treating the South as Democratic
  down-ballot (it has now largely flipped).

### Common pop-history simplifications and what they get wrong
- **"The realignment was finished in the 1960s."** **[consensus]** The
  *presidential* shift was advanced by then, but the **down-ballot** South only
  decisively flipped in/after **1994** — a 1990s, not a 1960s, completion.
  ([Brookings](https://www.brookings.edu/articles/vital-stats-southern-committee-chairs-congress/))
- **"Clinton was a New Deal/Great Society liberal."** **[consensus]** He governed
  as a *centrist* New Democrat (welfare reform, NAFTA, balanced budgets) —
  precisely *because* the older liberal label had become a liability.
- **"Polarization is brand-new."** It has been rising steadily since ~1994; the
  2000s/2010s are its acceleration, not its origin. ([Pew](https://www.pewresearch.org/politics/2014/06/12/political-polarization-in-the-american-public/))

### Game treatment vs. real history (divergence notes)
- **Immediately precedes the played window; sets up the modern polarity the
  thread uses.** By the time the *1948-continued* thread picks up in 2004, the
  alignment is fully modern and fully sorted — which is why the thread can treat
  BLUE=Democrat and RED=Republican with no caveats.
- **Polarity guidance:** from ~1994 onward, the game's modern faction polarity is
  correct at **every** level of the ballot; the gradual-realignment caveats from
  §7-8 no longer apply.

---

## 10. Modern polarized era (2000–present) — the era the 1948 campaign actually plays

### Era window
**2000 → present (2020+ in this campaign).** The *1948-continued* thread plays
in-game years **2004 → 2020** (forum "Welcome to 2006-2008" … "Welcome to
2018-2020"; chunk-001 opens at the 2008 conventions), with real-world posting
running into 2026 — i.e. it has run *past* the present day as an alt-history.
The newly ingested *era-of-populism* thread (added this update) opens at
**2012 — Obama's reelection campaign** (chunk-001 post 1, "Playtest begins with
2012 election, reelection campaign of President Barack Obama") and runs as the
game's fictional, alt-history **"Era of Populism"** scenario (one of the
game's named modern eras, with a forthcoming "Era of the Future" beginning
~2024; chunk-013). Engine: `modern` (the only fully shipped modern tuning).

### Binding facts (ground truth)
- **The modern alignment is fully in place and matches everyday usage:**
  **Democrats = the left/liberal party, Republicans = the right/conservative
  party**, sorted top-to-bottom across the country. **[consensus]** This is the
  *end state* of the long realignment chronicled in §6-9 and the **reverse** of
  the 1856/1868 polarity. ([Pew — Changing Partisan Coalitions, 2024](https://www.pewresearch.org/politics/2024/04/09/changing-partisan-coalitions-in-a-politically-divided-nation/))
- **Sharply rising polarization and partisan sorting.** **[consensus]** Pew: the
  share of Americans with consistently liberal *or* consistently conservative
  views roughly **doubled (10%→21%) from 1994 to 2014**; by 2014, **92% of
  Republicans were to the right of the median Democrat and 94% of Democrats to
  the left of the median Republican**; cross-party animosity more than doubled.
  ([Pew — Political Polarization in the American Public, 2014](https://www.pewresearch.org/politics/2014/06/12/political-polarization-in-the-american-public/))
- **Demographic/educational sorting** increasingly defines the divide (race,
  ethnicity, geography — urban/rural — and especially the **education** split
  among white voters). **[consensus]** ([Pew, 2024](https://www.pewresearch.org/politics/2024/04/09/changing-partisan-coalitions-in-a-politically-divided-nation/))
- **Populism is the defining political style of the 2010s, on BOTH right and
  left, with a shared 2008-financial-crisis lineage.** **[consensus]** The 2008
  bank bailouts catalyzed two parallel populist insurgencies: the **right-wing
  Tea Party** (2009; anti-government, anti-tax, anti-Washington) and the
  **left-wing Occupy Wall Street** (2011; anti-corporate, "the 99%," structural
  inequality). Both framed politics as ordinary "people" vs. a corrupt
  "establishment" — the textbook populist frame — but identified *different*
  elites and very different remedies. Their legacies "powerfully shaped the
  campaigns of Donald Trump and Senator Bernie Sanders" in 2016: Sanders
  channeled progressive/anti-Wall-Street populism within the Democratic primary
  (Wall Street, billionaires, "the rigged economy"); Trump channeled
  nationalist/anti-immigration/anti-trade populism within the Republican primary
  (immigration, "the wall," NAFTA/TPP, "drain the swamp"). Scholars stress that
  both campaigns shared the *form* (people-vs.-establishment, anti-elite
  rhetoric) while differing sharply on the *content* (left-progressive vs.
  right-reactionary) — "populism" itself is a style/strategy that can attach to
  left or right substance. ([BU Journal of History — Two Paths of Populism](https://www.bujh.org/two-paths-of-populism-the-tea-party-and-occupy-wall-street-historical-perspective.html), [PBS NewsHour — 2008 crisis fuels populism](https://www.pbs.org/newshour/politics/how-the-2008-financial-crisis-fuels-todays-populist-politics), [FPRI — Populism in American Elections: Sanders & Trump](https://www.fpri.org/article/2020/06/populism-in-american-elections-bernie-sanders-and-donald-trump/), [Democratic Erosion — Trump and Sanders](https://www.democratic-erosion.com/2022/03/14/trump-and-sanders-populism-on-the-right-and-the-left/))
- **Defining real-world events of the period** (orientation; the game's are
  alt-history): 9/11 (2001) and the "war on terror"; Iraq War (2003); the 2008
  financial crisis & Great Recession; the Tea Party (2009-10) and the Affordable
  Care Act (2010); the rise of social media in politics; populist revolts on both
  right and left from the mid-2010s. **[consensus]**

### Key figures (real-world, for orientation — the campaign's are alt-history)
- **George W. Bush** (Republican, 2001-09), **Barack Obama** (Democrat, 2009-17)
  — the period's two-term presidents in real life. In the game, by contrast, the
  2008 incumbent in the 1948-continued thread is **"Pres Cuomo"** with
  **"Gov Bush"** running the GOP convention (chunk-001 posts 14-15) — a
  divergent roster — while the *era-of-populism* thread treats Obama as the
  real-history 2012 incumbent (chunk-001 post 1) and so its starting state
  matches real history more closely.
- **Real-world period figures** the game pool draws on (its draft classes are
  generated from real legislators — see CLAUDE.md dataset pipeline): the era's
  senators/governors (e.g. Baldwin, Franken, Lott, Braun, Chenoweth-Hage all
  appear as bill sponsors in chunk-032) populate the modern draft.
- **2010s populist figures the game models directly:** the *era-of-populism*
  thread's faction leaders are the real-life standard-bearers of left and right
  populism — **B1 Bernie Sanders / RBG / Barney Frank** as the LW-Populist /
  Progressive Democratic wing, and **R1 Donald Trump / Ron Paul / Sarah Palin**
  as the RW-Populist / Traditionalist Republican wing (chunk-001 post 1). This
  is the era where pairing Sanders and Trump as parallel-but-opposite populists
  is the academic consensus framing (see binding-facts citation).

### Timeline of relevant events (real world, for orientation)
- **2000** — Bush v. Gore. **2001** — 9/11. **2003** — Iraq War. **[consensus]**
- **2008** — Financial crisis; Obama elected. **[consensus]**
- **2009-10** — Tea Party emerges; ACA; GOP retakes the House. **[consensus]**
- **2011** — Occupy Wall Street. **[consensus]**
- **2016** — A populist-realignment election (Trump nominated R / Sanders runs
  Sanders strong in the D primary); the educational/urban-rural divide
  sharpens. **[consensus]**
- **2020** — COVID-19; a high-turnout, highly polarized election. **[consensus]**

### Era-appropriate factions / ideologies / interests
**Democrats** (BLUE): urban, younger, more educated, racially diverse coalition;
internal center-left (establishment) vs. progressive-left tension — the
**Sanders/Warren left-populist wing vs. the Clinton/Biden establishment** is
the era's signature intra-Democratic axis. **Republicans** (RED): suburban/rural,
the white working class (increasingly), the religious right, business
conservatives; internal establishment vs. populist tension — the **Trump
right-populist wing vs. the McConnell/Romney establishment** is the era's
signature intra-Republican axis. Interest blocs that are now era-appropriate
(and that the shipped flat `INTEREST_GROUPS` list — Big Tech, Big Oil & Gas,
Globalists, LW/RW Media — **finally fits**, unlike in 1856/1868): Big Tech,
energy, finance/Wall Street, labor, the religious right, gun-rights,
environmentalists, immigration advocates/restrictionists, partisan media.
**[consensus]**

### Period-specific terminology
- **Use (and it now means what it says):** liberal/progressive (Democratic),
  conservative (Republican), the culture war, polarization, partisan sorting,
  "the base," populism (left and right), Tea Party, Occupy, the resistance,
  "MAGA," "the 99%," "drain the swamp," "the establishment," red state/blue
  state, swing/purple state. **This is the one era where modern political
  vocabulary is fully period-accurate.**
- **Avoid:** importing *any* earlier-era polarity — by now BLUE=left/RED=right is
  simply correct. The only caveat is alt-history divergence (below), not polarity.
- **A populism-specific note:** "populist" in this era is a *style* (people-vs.-
  establishment) that attaches to *both* poles — the Sanders left and the Trump
  right are both populists in form but ideological opposites in content. Do not
  treat "populist" as a synonym for either left *or* right.

### Common pop-history simplifications and what they get wrong
- **"The parties have always been this polarized."** **[consensus]** No — measured
  polarization is a *recent and rising* phenomenon (sustained since ~1994); the
  mid-20th-century parties were ideologically *mixed* (see §6-7). ([Pew, 2014](https://www.pewresearch.org/politics/2014/06/12/political-polarization-in-the-american-public/))
- **"Red = Republican / Blue = Democrat is a timeless convention."**
  **[consensus]** The red/blue color coding only standardized after the **2000**
  election; before then networks used the colors inconsistently. (Relevant
  because the game's *fixed* BLUE/RED tokens are *not* the real-world color
  convention for most of the timeline.)
- **"Populism is right-wing"** (or "Populism is left-wing"). **[consensus]**
  Both — the 2010s produced *parallel* populist movements (Tea Party / Trump on
  the right, Occupy / Sanders on the left) sharing a common anti-elite frame
  and the same 2008-bailout origin point, but pointing in opposite ideological
  directions. ([BU Journal of History](https://www.bujh.org/two-paths-of-populism-the-tea-party-and-occupy-wall-street-historical-perspective.html))

### Game treatment vs. real history (divergence notes)
- **This is the era both modern playtests actually play — and the game's polarity
  is correct.** BLUE=Democrats, RED=Republicans, modern left/right (1948-continued
  chunk-001 post 14; era-of-populism chunk-001 post 1, with Democratic factions
  Sanders/Biden/Warren/Clinton/Obama and Republican factions
  Trump/McConnell/Perry/Thomas/McCain). No polarity caveat needed; the
  game-master can use plain modern political language.
- **The "Era of Populism" name is the game's own fictional/alt-history era
  label, but it tracks a real political phenomenon.** The game runs ~10 years
  behind real time and uses fictional era names ("Era of Terror," "Era of
  Populism," forthcoming "Era of the Future" at ~2024; chunk-013). The Era of
  Populism scenario opens at 2012 — chronologically *after* the Tea Party (2009)
  and Occupy Wall Street (2011), and *before* the 2016 Sanders/Trump populist
  primaries that made the era's name retroactively obvious. So the era label
  itself is corroborated by real history: this *is* the period when populism
  becomes a defining force in American politics. The faction roster
  (Sanders/RBG/Barney Frank as the LW-Populist wing; Trump/Ron Paul/Sarah Palin
  as the RW-Populist wing) maps cleanly onto the real left/right populist
  archetypes of the period.
- **Populist issues the playtest surfaces are era-accurate.** Bills and
  governor-actions in the era-of-populism thread name the genuine 2010s populist
  flashpoints: **immigration reform and "the border wall"** (chunk-008 posts
  1305-1551, both Obama "calls for immigration reform" and Republican "call for
  immigration reform and the border wall" appear as in-game actions); **Keystone
  XL and Dakota Access pipelines** (chunk-007 post 528, "Subsidize Keystone XL
  and Dakota Pipelines"); **federal surveillance state** ("Send Federal funds to
  states to build Surveillance Systems," chunk-007 post 528); **drilling on
  federal land**, **Green New Deal state policy** (chunk-014 post 1127),
  **legalize marijuana / animal-cruelty / "arm teachers"** (chunk-014 posts
  1126-1136). These are exactly the issue menu of real 2010s politics; the
  game-master should treat them as period-accurate framing, even as the *votes*
  and *outcomes* in the playtest diverge.
- **It is an *alt-history*, not a re-enactment.** The 1948-continued campaign
  began in 1948 and 60 in-game years of player decisions produced a **divergent
  present**: a President "Cuomo" in 2008 (not Bush/Obama); a presidential
  two-term-limit amendment *still unratified* in 2008 (chunk-001 post 15) though
  the real 22nd Amendment passed in 1951; and a statute book that still contains
  — and is now *repealing* — New-Deal/Cold-War-era laws (FDA, NASA subsidies,
  SE-Asia war powers, the National Monetary Commission; chunk-032). The
  era-of-populism thread, by contrast, opens *at* a real-history starting state
  (Obama as 2012 incumbent) and lets divergence accumulate forward from there.
  **Game-master framing: use real history for ideological/era texture and the
  *menu* of plausible issues, but treat named officeholders, election outcomes,
  and the enacted-law record as the campaign's own divergent timeline.**
- **Interest-group cards finally fit the era.** The shipped flat `INTEREST_GROUPS`
  pool (Big Tech, Big Oil & Gas, Globalists, LW/RW Media — anachronistic in 1856
  and 1868 per §3-4) is **era-appropriate here**. The era-of-populism factions
  carry interest tags that read as 2010s-real: "Environmentalists, Welfare,
  Public Housing" on the Sanders/B1 wing; "Wall Street, Environmentalists, Big
  Pharma" on the Obama/B5 wing; "RW Media, Isolationists" on the Trump/R1 wing;
  "Corporations, Wall Street, Oil and Gas" on the Perry/R3 wing; "Military
  Industrial Complex" on the McCain/R5 wing (chunk-001 post 1). These match the
  real interest-group lineups of the period.
- **The "draft real politicians" model is most accurate here.** Per CLAUDE.md the
  draft classes are generated from real legislators; in the modern era this yields
  genuinely period-correct names (the chunk-032 bill sponsors are all real
  late-20th/early-21st-century members, and the era-of-populism roster is openly
  built on a "2012 sheet" of real pols, chunk-001 post 1), so the draft texture
  matches history even where the *outcomes* diverge. *Note:* by the Era of
  Populism / Era of the Future (~2024 onward), the game switches to **generated
  rather than real** politicians as the historical record runs out (chunk-013
  rule 3.0.18) — so this is the era where the real-politician draft model
  begins to give way to generated drafts.

---

## Citations
Ordered by importance to this brief.

**Founding through Gilded Age (eras 1-4):**
- [Library of Congress — Formation of Political Parties](https://www.loc.gov/exhibits/creating-the-united-states/formation-of-political-parties.html) — parties did not exist at the founding; emerged in the 1790s.
- [Reagan Library / National Archives — 1788-1800: Rise of Political Factions](https://www.reaganlibrary.gov/american-elections-and-campaigns-1788-1800-rise-political-factions-early-republic) — no parties in 1788-89; Washington unanimous.
- [Wikipedia — First Party System](https://en.wikipedia.org/wiki/First_Party_System) — Federalist ~1791, Republican ~1792, 1796 first partisan election (dates contested).
- [American Battlefield Trust — The Rise of Political Parties](https://www.battlefields.org/learn/articles/rise-political-parties) — Hamilton/Jefferson/Madison party formation.
- [National Archives — A More Perfect Union](https://www.archives.gov/founding-docs/more-perfect-union) and [Constitution Center — The Day the Constitution Was Ratified](https://constitutioncenter.org/blog/the-day-the-constitution-was-ratified) — nine-state rule; close state votes; NH ninth June 21 1788.
- [Journal of the American Revolution — Adams's Rule of Thirds](https://allthingsliberty.com/2013/02/john-adamss-rule-of-thirds/) and [NPS — Loyalists](https://www.nps.gov/teachers/classrooms/loyalists-in-american-revolution.htm) — the one-third myth.

**Jeffersonian–Jacksonian (1800–1856; eras 2.5-2.6):**
- [Constitution Center — A tied presidential election ends in Washington](https://constitutioncenter.org/blog/on-this-day-a-true-constitutional-crisis-ends-in-the-washington), [Britannica — 1800 election](https://www.britannica.com/event/United-States-presidential-election-of-1800), [Monticello — Election of 1800](https://www.monticello.org/research-education/thomas-jefferson-encyclopedia/election-1800/) — the 73-73 tie, 36 House ballots, Jefferson 10-4 on Feb 17 1801, Hamilton's role, the 12th Amendment.
- [State Dept Office of the Historian — Louisiana Purchase, 1803](https://history.state.gov/milestones/1801-1829/louisiana-purchase), [National Archives — Prologue: Louisiana Purchase](https://www.archives.gov/publications/prologue/2003/spring/louisiana-purchase.html), [Senate — Louisiana Purchase Treaty ratified](https://www.senate.gov/about/powers-procedures/treaties/senate-approves-louisiana-purchase-treaty.htm) — Apr 30 1803, $15M, doubled the country, ratified 24-7 Oct 20 1803, Jefferson's strict-construction qualms.
- [Wikipedia — Era of Good Feelings](https://en.wikipedia.org/wiki/Era_of_Good_Feelings) and [ushistory.org — Era of Good Feelings & Two-Party System](https://www.ushistory.org/us/23a.asp) — Federalist collapse after the 1814-15 Hartford Convention; Monroe's ~90%-of-Congress one-party dominance; the 1824 split.
- [National Archives — Missouri Compromise (1820)](https://www.archives.gov/milestone-documents/missouri-compromise) and [American Battlefield Trust — The Missouri Compromise](https://www.battlefields.org/learn/articles/missouri-compromise) — Missouri slave / Maine free; 36°30′ line; Tallmadge Amendment; signed Mar 6 1820.
- [Wikipedia — Second Party System](https://en.wikipedia.org/wiki/Second_Party_System), [Wikipedia — Whig Party (US)](https://en.wikipedia.org/wiki/Whig_Party_(United_States)), [Wikipedia — History of the Democratic Party](https://en.wikipedia.org/wiki/History_of_the_Democratic_Party_(United_States)), [HISTORY — Whig Party](https://www.history.com/articles/whig-party) — Democrats founded 1828 (Van Buren/Jackson), Whigs ~1833-34 ("King Andrew"), system ~1828-1854, the non-modern economic polarity.
- [Wikipedia — Nullification crisis](https://en.wikipedia.org/wiki/Nullification_crisis), [American Battlefield Trust — Nullification Crisis](https://www.battlefields.org/learn/articles/nullification-crisis), [House History — The Tariff of Abominations](https://history.house.gov/Historical-Highlights/1800-1850/The-Tariff-of-Abominations/) — Tariff of 1828, Calhoun's Exposition, SC ordinance Nov 24 1832, Force Bill + Compromise Tariff 1833.
- [Wikipedia — Bank War](https://en.wikipedia.org/wiki/Bank_War), [LoC — Renewal of the Second Bank vetoed (Jul 10 1832)](https://guides.loc.gov/this-month-in-business-history/july/renewal-second-bank-united-states-vetoed), [Andrew Jackson's Hermitage — Bank War](https://thehermitage.com/andrew-jackson-the-bank-war) — the July 10 1832 veto, pet banks, Specie Circular (1836), Panic of 1837.
- [American Yawp — Manifest Destiny](http://www.americanyawp.com/text/12-manifest-destiny/) and [HISTORY — Manifest Destiny](https://www.history.com/topics/19th-century/manifest-destiny) — O'Sullivan coined the term 1845; contested, Whig-opposed.
- [Wikipedia — Treaty of Guadalupe Hidalgo](https://en.wikipedia.org/wiki/Treaty_of_Guadalupe_Hidalgo), [OpenStax — The Mexican-American War 1846-1848](https://openstax.org/books/us-history/pages/11-4-the-mexican-american-war-1846-1848), [Wikipedia — Wilmot Proviso](https://en.wikipedia.org/wiki/Wilmot_Proviso) — war 1846-48, treaty Feb 2 1848, Wilmot Proviso Aug 8 1846 (passed House, died Senate), Whig opposition.
- [National Archives — Compromise of 1850](https://www.archives.gov/milestone-documents/compromise-of-1850) and [Bill of Rights Institute — The Compromise of 1850](https://billofrightsinstitute.org/essays/the-compromise-of-1850/) — five separate bills, September 1850, Clay/Douglas/Fillmore, Fugitive Slave Act.
- [Wikipedia — Kansas-Nebraska Act](https://en.wikipedia.org/wiki/Kansas%E2%80%93Nebraska_Act), [Senate — The Kansas-Nebraska Act](https://www.senate.gov/artandhistory/history/minute/Kansas_Nebraska_Act.htm), [EBSCO — Birth of the Republican Party](https://www.ebsco.com/research-starters/history/birth-republican-party) — signed May 30 1854; repealed the Missouri Compromise line; destroyed Whigs, founded the GOP (Ripon Mar 20 1854, Jackson MI Jul 6 1854).

**Antebellum & Gilded Age (eras 3-4):**
- [Wikipedia — 1856 election](https://en.wikipedia.org/wiki/1856_United_States_presidential_election) and [Britannica — 1856 election](https://www.britannica.com/event/United-States-presidential-election-of-1856) — three-way race; EC 174/114/8.
- [Wikipedia — History of the Republican Party](https://en.wikipedia.org/wiki/History_of_the_Republican_Party_(United_States)) and [Free Soil Party](https://en.wikipedia.org/wiki/Free_Soil_Party) — GOP founded 1854; Know-Nothings separate.
- [American Battlefield Trust — Lecompton Constitution](https://www.battlefields.org/learn/articles/lecompton-constitution) and [Miller Center — Buchanan key events](https://millercenter.org/president/james-buchanan/key-events) — Lecompton 1857-58; Buchanan vs. Douglas split; Kansas rejects it 11,300-1,788 (Aug 1858).
- [American Battlefield Trust — Lincoln-Douglas Debates](https://www.battlefields.org/learn/articles/lincoln-douglas-debates) and [NPS — The Lincoln-Douglas Debates of 1858](https://www.nps.gov/liho/learn/historyculture/debates.htm) — seven debates Aug-Oct 1858 for the IL Senate seat (legislature-chosen); Douglas retained.
- [House History — The Secession of South Carolina](https://history.house.gov/Historical-Highlights/1851-1900/The-secession-of-South-Carolina/) and [American Battlefield Trust — Fort Sumter](https://www.battlefields.org/learn/civil-war/battles/fort-sumter) — SC secedes Dec 20 1860; Davis provisional CSA president Feb 18 1861; Fort Sumter Apr 1861.
- [American History Central — Gilded Age Politics](https://www.americanhistorycentral.com/entries/gilded-age-politics/) and [Fiveable APUSH — Politics in the Gilded Age](https://fiveable.me/apush/unit-6/politics-gilded-age/study-guide/8nIh2AsuMR3xXcKSZRaq) — Stalwarts/Half-Breeds/Mugwumps/Bourbons; tariff/currency; Solid South.

**Modern arc (eras 5-10):**
- [Britannica — 1896 election](https://www.britannica.com/event/United-States-presidential-election-of-1896) and [Miller Center — McKinley campaigns](https://millercenter.org/president/mckinley/campaigns-and-elections) — 1896 realignment; GOP dominance 1896-1932; Wilson the exception.
- [Britannica — Theodore Roosevelt and the Progressive Movement](https://www.britannica.com/place/United-States/Theodore-Roosevelt-and-the-Progressive-movement) and [Britannica — The Progressive era](https://www.britannica.com/place/United-States/The-Progressive-era) — progressivism cross-party; 1912 split; reforms.
- [Britannica — Democratic Party](https://www.britannica.com/topic/Democratic-Party) — 1932 realignment redefines "liberal"; New Deal coalition; conservative coalition.
- [Miller Center — FDR: Campaigns and Elections](https://millercenter.org/president/fdroosevelt/campaigns-and-elections) — New Deal coalition composition (labor/CIO, ethnic, regional).
- [Britannica — Dixiecrat](https://www.britannica.com/topic/Dixiecrat) and [Senate — Strom Thurmond bio](https://www.senate.gov/senators/FeaturedBios/Featured_Bio_Thurmond.htm) — 1948 revolt; most returned; Thurmond switches Sept 1964.
- [Britannica — Southern strategy](https://www.britannica.com/topic/Southern-strategy) — the South's gradual, presidential-first realignment.
- [Senate — Civil Rights Act of 1964](https://www.senate.gov/artandhistory/history/common/generic/CivilRightsAct1964.htm), [GovTrack — Senate vote 88-1964/s409](https://www.govtrack.us/congress/votes/88-1964/s409), [National Archives — Senate roll call (June 19, 1964)](https://www.archives.gov/legislative/features/civil-rights-1964/senate-roll-call.html) — CRA vote 73-27; Dem 46-21, Rep 27-6; House needed ~80% of GOP; opposition regional.
- [Cambridge — The Transformation of Southern Politics Revisited (BJPS)](https://www.cambridge.org/core/journals/british-journal-of-political-science/article/abs/transformation-of-southern-politics-revisited-the-house-of-representatives-as-a-window/B0D710855EC663879079F1CD5B7B952B) and [Harvard UP — The End of Southern Exceptionalism (Shafer & Johnston)](https://www.hup.harvard.edu/books/9780674032491) — the race-vs-economic-development scholarly debate (vs. Carmines & Stimson's *Issue Evolution*).
- [Miller Center — Reagan: Campaigns and Elections](https://millercenter.org/president/reagan/campaigns-and-elections) and [Britannica — 1980 election](https://www.britannica.com/event/United-States-presidential-election-of-1980) — Reagan realignment; Reagan Democrats; New Right.
- [Miller Center — Grassroots Conservatism](https://millercenter.org/the-presidency/teacher-resources/recasting-presidential-history/presidency-and-grassroots-conservatism) — religious right / New Right network.
- [Miller Center — Clinton: Campaigns and Elections](https://millercenter.org/president/clinton/campaigns-and-elections) and [Brookings — Southern committee chairs / realignment](https://www.brookings.edu/articles/vital-stats-southern-committee-chairs-congress/) — New Democrat centrism; 1994 down-ballot completion of the Southern realignment.
- [Pew — Political Polarization in the American Public (2014)](https://www.pewresearch.org/politics/2014/06/12/political-polarization-in-the-american-public/) and [Pew — Changing Partisan Coalitions (2024)](https://www.pewresearch.org/politics/2024/04/09/changing-partisan-coalitions-in-a-politically-divided-nation/) — ideological consistency doubled since 1994; demographic sorting; modern alignment.
- [BU Journal of History — Two Paths of Populism: The Tea Party and Occupy Wall Street](https://www.bujh.org/two-paths-of-populism-the-tea-party-and-occupy-wall-street-historical-perspective.html) and [PBS NewsHour — How the 2008 financial crisis fuels today's populist politics](https://www.pbs.org/newshour/politics/how-the-2008-financial-crisis-fuels-todays-populist-politics) — Tea Party (2009, right-populism) and Occupy Wall Street (2011, left-populism) both born of 2008 bailouts; their legacies shape Trump and Sanders in 2016.
- [FPRI — Populism in American Elections: Bernie Sanders and Donald Trump](https://www.fpri.org/article/2020/06/populism-in-american-elections-bernie-sanders-and-donald-trump/) and [Democratic Erosion — Trump and Sanders: Populism on the Right and the Left](https://www.democratic-erosion.com/2022/03/14/trump-and-sanders-populism-on-the-right-and-the-left/) — academic framing of Trump (right-populist) and Sanders (left-populist) as parallel-but-opposite populists sharing the people-vs.-establishment form.

**Internal sources:**
- Shipped data: `src/data/factions1772.ts`, `factions1856.ts`, `scenario1772.ts`, `scenario1856.ts`, `eraEvents1772.ts`, `eraEvents1856.ts`; `CLAUDE.md` (draft pipeline).
- Digests: `docs/game/playtest-digests/` (`1772s` 85f8e6b4, `fed` f55d3e21, `gilded` f4c7c2c4); `docs/game/game-context.md`.
- 1948-continued batch: `docs/game/sources/3a9ac985-ampu-1948-playtest-continued-2004-and-beyond/` — chunk-001 (2004-08 start; BLUE=Dem/RED=Rep mapping, "Pres Cuomo," two-term-limit amendment), per-era "Welcome to" markers, chunk-032 (2004+ repeals of New-Deal/Cold-War statutes).
- "A House Divided" 1856 Part 2 batch: `docs/game/sources/77db6e6f-a-house-divided-1856-ampu-playtest-part-2/` — chunk-001 (1856 start; Buchanan 174/Frémont 114/Fillmore 8; BLUE=Dem/RED=Rep; the four factions incl. Crittenden Republicans w/ Lincoln); "Welcome to" era markers (1860-61 chunk-011, 1868 Gilded-Age chunk-031, 1892 Progressivism chunk-106, 1898-1900 chunk-126); partial-02 (chunks 11-20: Seward wins 1860; John-Brown's-Raid blunder → secession & Civil War engine; CSA pres Quitman); partial-03 (chunks 21-30: Seward re-elected 1864; Union victory; Reconstruction; Lincoln nominated 1868). Campaign spans 1856→1900.
- "Drums of War" all-CPU Civil War stress-test batch: `docs/game/sources/e1776bbd-drums-of-war-an-allcpu-playtest-of-the-civil-war/` — chunk-001 (1841 start under Pres Harrison/VP Tyler; Whig/Democrat second-party system; Webster/Clay/Calhoun/Jefferson Davis/Lincoln/Seward all on the board); chunk-117 (mid-1924 finale under President Hearst — League of Nations and Kellogg-Briand decisions, London Naval Treaty, Dada/Surrealism, Nazi Party emergence). All-CPU mechanical stress-test of the Civil War subsystem; covers ~83 in-game years (1841→1924), corroborating §2.6/§3 antebellum, §4 Gilded Age, and §5 Progressive/WWI/1920s without surfacing new real-history detail beyond those sections.
- "1800 Playtest: Era of Republicanism (1800-1868)" batch (added this update): `docs/game/sources/6aa7309a-ampu-1800-playtest-era-of-republicanism-18001868/` — chunk-001 post 1 (1800 start; "the 'Blue Party' or Democratic-Republicans… the 'Red Party' or Federalists"; embargo/war-vs-trade split; opening faction roster: Jefferson/Burr/Gallatin/Madison/Monroe/Macon/A.Jackson BLUE, King/J.Q.Adams/Hamilton/Marshall/Morris RED); chunk-002 ("Era of Republicanism in more ways than one"); chunk-017 ("Era of good feelings moment"); chunk-025 ("Welcome to 1812-1814"); chunk-034 (player note: "IRL, the Democratic-Republicans wouldn't lose the House majority until 1841 when the Whigs took over"); chunk-055 ("Welcome to 1828-1830"; 1828 draft incl. Fillmore/Seward RED); chunk-073/088 ("Are we Whigs yet?"); chunk-074 ("Welcome to the **Era of Manifest Destiny (1840-1856)**"; alt-history "President Martin Van Buren," "Daniel Webster… leader of the **Federalists**," "Henry Clay 305," Treasury Sec Livingston's player-driven Louisiana Purchase); chunk-082 (engine secession logic branching on "Jacksonian or Era of Manifest Destiny/Era of Nationalism," Southern-Unionist exception); chunk-083 (era-gating slips); chunk-086 (1840s Dorr-War/suffrage Whig-vs-Democrat issue); chunk-092 ("Welcome to 1850-1852"); chunk-117 ("Welcome to 1866-1868! …the final turn of the Era of Nationalism"). **This thread is the EARLY half (1800-1868) of the same campaign whose later half (1868+) is the `f4c7c2c4` *gilded* batch (§4).** Corroborates and now anchors the new §2.5/§2.6 (Jeffersonian/Jacksonian) and the §3 lead-in; the load-bearing divergence is the **persistence of the Federalist label into the 1840s** where real history had Democrat vs. Whig.
- "Era of Populism" playtest batch: `docs/game/sources/c50d9da7-era-of-populism-playtest/` — chunk-001 post 1 (2012 start; "reelection campaign of President Barack Obama"; faction roster pairing Sanders/RBG/Frank as LW-Populist B1 with Trump/Paul/Palin as RW-Populist R1; BLUE=Dem/RED=Rep modern polarity); chunk-007 post 528 (Keystone XL + Dakota pipelines, federal surveillance funding, federal drilling subsidies as period-accurate bill content); chunk-008 posts 1305-1551 (immigration reform and "border wall" as in-game presidential/legislative actions); chunk-013 rule 3.0.18 (the "Era of Populism" → forthcoming "Era of the Future" ~2024 transition where generated draft pols replace real ones); chunk-014 (governor actions: state Green New Deal, "arm teachers," legalize marijuana, animal-cruelty bans). Corroborates §10 modern-polarized era — including the alt-history era-naming convention and the dual left/right populism academic frame — without surfacing new real-history detail beyond §10.
