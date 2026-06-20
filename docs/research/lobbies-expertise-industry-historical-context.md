# Historical Context: PR7 — Lobbies → expertise → industry + faction ideology

## Summary
PR7 wires faction lobby cards to politician **expertise**, nudges state
**industry**, reconciles two industry vocabularies, and lets member expertise
(the economic base) feed **faction ideology**. The historical record strongly
supports a *lobby → economic-interest → expertise* chain in both eras: the
real interest groups of 1772 (merchants, planters, small farmers, artisans,
land speculators) and 1856 (cotton planters, Northern manufacturers, Western
farmers, finance, urban labor) map cleanly onto the game's existing lobby
cards and expertise tags. The fourth link — **"faction ideology follows
economic base"** — is the one to handle carefully. It is broadly defensible
in **1772** (the Federalist/Anti-Federalist split tracked commercial vs.
agrarian/debtor interests reasonably well) and for the **sectional** axis in
1856 (slavery interest ≈ Southern Democrats; free-labor/industry ≈
Republicans). But historians have *decisively* complicated the simple version
for both eras: the Beard "economic interpretation" of the Constitution was
refuted in the 1950s-60s, and the Second Party System's mass base was driven
as much by **ethnocultural/religious** identity as by economic class. The PR
should treat economic base as *one input that biases* faction ideology, not a
deterministic mapping. Details, citations, and a per-era correspondence table
below.

---

## Game vocabulary this brief must speak in (verified from the codebase)
So the PM's mappings are expressible in existing terms:

- **Expertise tags** (`src/types.ts:182`): Agriculture, Business, Economics,
  Education, Energy, Environment, Foreign Affairs, Healthcare, Housing,
  Justice, Labor, Media, Military, Naval, Science, Technology, Trade,
  Transportation, Welfare.
- **1772 lobby cards** in use (`src/data/factions1772.ts`): Patriots,
  Merchants, NationalUnity, Planters, SmallFarmers, Lawyers, Reformers.
- **1856 lobby cards** in use (`src/data/factions1856.ts`): SlavePower,
  Expansionists, ProUnion, UrbanLabor, NorthernIndustry, Abolitionists,
  EvangelicalReform, Nativists, SmallFarmers, ProUnion.
- **1772 state-industry keys** in use (`src/data/states1772.ts`): fishing,
  lumber, manufacturing, shipping, finance, agriculture, tobacco, cotton.
- **1856 state-industry keys** in use (`src/data/states1856.ts`): fishing,
  lumber, manufacturing, finance, agriculture, tobacco, cotton, coal,
  shipping, sugar, cattle, mining.
- **Reference vocabulary** the design doc (`source-abilities-expertise-traits.md:314`)
  used for "industry ±1": Mining, Manufacturing, Finance, Plantation, High
  Tech, Alt Energy, Maritime, Natural Gas. **These do NOT match the era state
  keys above** — that mismatch is exactly the "name reconciliation" PR7 owns.
  *Confidence: (a) — read directly from the files.*

---

## ERA 1 — 1772 founding era

### Real economic interest groups ("lobbies")
The concept of an organized "lobby" is itself anachronistic for 1772 (see
Anachronism watch), but distinct **economic interests** were real and
politically active:

- **Merchants / shipping (maritime trade):** Concentrated in New England
  (Boston) and the middle-colony ports (New York, Philadelphia). Boston and
  Newport merchants earned heavily from carrying goods within the British
  Empire and trading fish, grain, and livestock to the West Indies;
  shipbuilding thrived on New England timber. *Confidence: (a).* [Iowa State /
  Rosenbloom; Library of Congress colonial-business guide]
- **Planters (cash-crop, enslaved-labor agriculture):** Tidewater Virginia
  and Maryland (tobacco); coastal South Carolina and Georgia (rice, indigo,
  and rising cotton) relied heavily on enslaved labor. *Confidence: (a).*
  [Exploros / GMU colonial regions]
- **Small farmers / yeomanry & the backcountry:** The numerical majority.
  Middle colonies (NY, PA, NJ) were the "breadbasket," exporting wheat,
  flour, and salted meat. Backcountry farmers were frequently debtors,
  cash-poor, and politically estranged from the eastern seaboard elite —
  a cleavage that surfaced in Shays's Rebellion (1786-87). *Confidence: (a).*
- **Artisans / mechanics / tradesmen (urban):** Coopers, smiths,
  shipwrights, printers in the port cities. They were the "middle-class
  muscle" of the Revolution and tended to be **more radical** than merchants
  in opposition to Britain; nonimportation built artisan-merchant alliances.
  *Confidence: (a)/(b).* [Colonial Williamsburg; Revolutionary War Journal]
- **Land speculators:** Overlapping with planters and merchants; western land
  claims were a major economic-political interest (and a Constitution-era
  fault line). *Confidence: (b).*
- **Lawyers:** Disproportionately represented among colonial assembly leaders
  and Sons of Liberty organizers; a professional rather than strictly
  economic interest. *Confidence: (b).* [Colonial Williamsburg]

### Dominant industries by region (matches the game's 1772 state data)
- **New England (NH, MA, RI, CT):** fishing, lumber, shipping, some
  manufacturing — the game already seeds MA as `fishing/manufacturing/shipping`.
- **Middle colonies (NY, NJ, PA):** diversified — grain agriculture,
  manufacturing, shipping, and **finance** (NY). The game seeds NY with
  `shipping/manufacturing/finance`. Note: **NY and PA were slave colonies in
  1772** (`isSlaveState: true` in the data — historically correct; NY did not
  abolish slavery until 1827, PA's gradual-abolition act passed 1780).
  *Confidence: (a).* [History.com; PA Historical & Museum Commission]
- **Chesapeake (MD, VA, DE):** tobacco + general agriculture (game seeds
  `agriculture/tobacco`).
- **Lower South (NC, SC, GA):** plantation agriculture, rice, rising cotton
  (game seeds SC with `agriculture/cotton/shipping`).

### Did faction ideology follow economic base in 1772-88?
**Partially, and this is contested.** The cleanest economic story is the
**Federalist vs. Anti-Federalist** ratification fight (1787-88): the
traditional view holds Federalists drew on **commercial and creditor**
interests (merchants, public-securities holders, manufacturers, large
landowners wanting stable currency and contract enforcement), while
Anti-Federalists drew on **agrarian and debtor** interests (small farmers,
rural/backcountry South and West). *Confidence: (a) for the broad pattern.*
[Albert.io; Encyclopedia.com; CSAC Wisconsin]

**The major caveat the PM must respect:** Charles Beard's *An Economic
Interpretation of the Constitution* (1913) pushed the hard version — that the
framers designed the Constitution to enrich their own personal-property
holdings (securities, money-at-interest, shipping). Beard's thesis was the
standard view until **Robert E. Brown (1956)** and **Forrest McDonald's *We
the People* (1958)** dismantled it; by the early 1960s the profession
considered the Progressive economic interpretation "decisively refuted."
Crucially, **McDonald argued there were not two interests (landed vs.
mercantile) but ~three dozen** identifiable, cross-cutting interests that
forced bargaining. *Confidence: (a) — this is settled historiography.*
[EH.net; Wikipedia "Economic Interpretation"; Claremont Review]

**Implication for feature point #4:** an economic base *biases* faction
ideology but does not determine it — exactly McDonald's "three dozen
interests" picture. "Economics → ideology" is a reasonable *tendency* to model
in 1772, not a law.

### 1772 lobby → expertise correspondence (game terms)
*Confidence: (b)/(c) — my synthesis, grounded in the cited economic facts.*

| Lobby card (in game) | Real interest | Expertise (game tag) | Industry nudged +1 |
|---|---|---|---|
| Merchants | maritime trade / commerce | Business (or Trade) | shipping; finance |
| Planters | cash-crop slave agriculture | Agriculture | tobacco; cotton |
| SmallFarmers | yeoman / backcountry farming | Agriculture | agriculture |
| Patriots | revolutionary mobilization (not economic) | Media *(propaganda/pamphleteering)* or Military | — (or none) |
| Lawyers | legal profession | Justice | — |
| NationalUnity | nationalist/federal cause (not economic) | Foreign Affairs or Economics | — |
| Reformers | reform movement (not economic) | Education or Justice | — |

Note: **Patriots, NationalUnity, and Reformers are political/ideological
lobbies, not economic ones** — they have no clean industry to nudge. The PM
should expect a subset of lobbies to have no industry effect (the reference's
list also only assigns industry to the *economic* lobbies). *Confidence: (a)
for "these are not economic interests"; (c) for the expertise picks.*

---

## ERA 2 — 1856 antebellum era

### Real economic interest groups ("lobbies")
By the 1850s the sections had economically diverged sharply:

- **Cotton planters / "Slave Power":** The South's dominant interest. By 1860
  the South produced ~**two-thirds to three-quarters of the world's cotton**,
  and cotton was ~**58% of all US exports** ($191M of $333M total). Cotton had
  eclipsed tobacco, rice, and sugar. Geographically concentrated in the
  **Black Belt** and the Old Southwest — Alabama, Mississippi, Louisiana,
  Georgia, into Texas and Arkansas. Most free Southern capital went into
  **purchasing enslaved people** (rising in price) rather than industry.
  *Confidence: (a).* [American Battlefield Trust "Cotton is King"; American
  Heritage; OER cotton lessons]
- **Northern manufacturing / industry:** Concentrated in New England and the
  Mid-Atlantic. By 1860 the North had ~**101,000 factories vs. the South's
  ~21,000**, produced ~**90% of US manufacturing output**, **93% of pig
  iron**, **17×** the textiles and **32×** the firearms of the South, and had
  ~**20,000 miles of railroad vs. ~9,000** in the South. *Confidence: (a).*
  [NPS "Industry and Economy during the Civil War"; ushistory.org]
- **Western / free-state farming:** The Old Northwest (OH, IN, IL, IA, WI,
  MI). In 1860 Northern states produced **half the nation's corn, four-fifths
  of its wheat, seven-eighths of its oats**. ~40% of the North was still in
  agriculture vs. ~84% of the South. *Confidence: (a).* [same census/NPS data]
- **Finance / banking:** New York City the center (the game seeds NY
  `finance: 5`); Boston secondary. *Confidence: (a)/(b).*
- **Railroads:** A booming 1850s interest, overwhelmingly Northern/Midwestern;
  Southern lines mostly fed plantation districts to ports. *Confidence: (a).*
- **Urban labor / immigrants:** Wage workers in Northern cities; by the 1850s
  factories had displaced many artisans. Tied to the Loco-Foco / Jacksonian
  wing and to the nativism backlash. *Confidence: (a)/(b).*

### Dominant industries by region (matches the game's 1856 state data)
- **Deep South (SC, GA, AL, MS, LA, FL, AR, TX):** cotton (game seeds these
  `cotton: 5` / `cotton: 4`); LA adds sugar; TX cattle.
- **Upper South / Border (VA, NC, TN, KY, MO, MD, DE):** tobacco + general
  agriculture (game matches).
- **Northeast (MA, RI, CT, NY, NJ, PA, NH):** manufacturing + finance; PA adds
  coal (game seeds PA `coal: 5`); NY `finance/manufacturing/shipping` all 5.
- **Midwest / Old Northwest (OH, IN, IL, MI, WI, IA):** agriculture + some
  manufacturing; MI lumber/mining (game matches).
- **West (CA):** mining + shipping (game matches).

### Did faction ideology follow economic base in 1856?
**Two different answers depending on which axis you mean.**

1. **The sectional / slavery axis: YES, strongly.** The defining 1856 cleavage
   was slavery extension, and it tracked economic base tightly. The
   slave-plantation economy underwrote the Southern Democracy; the free-labor
   /free-soil ideology of the new Republican Party rested on Northern
   industry and Western family farming. The game already encodes this well
   (SlavePower → Conservative Democrats; NorthernIndustry → Moderate
   Republicans; Abolitionists → Radical/Liberal Republicans). *Confidence:
   (a).*

2. **The older party-class axis (Whig/Democrat economics): NO, not cleanly —
   and this is the big watch-out.** The **Second Party System** (~1828-1854)
   *did* have a real economic-policy contrast: **Whigs** favored an
   activist state (national bank, protective tariff, internal improvements);
   **Democrats** opposed it (states' rights, anti-bank, anti-tariff,
   hard-money agrarianism). *Confidence: (a).* [LibreTexts; NC ANCHOR;
   Archives.gov two-party ebook] **BUT** the ethnocultural school of
   historians — led by **Lee Benson, *The Concept of Jacksonian Democracy*
   (1961)** — showed via quantitative analysis that for the mass electorate,
   **ethnic and religious affiliation predicted party better than economic
   class**: evangelical/"pietist" Protestants leaned Whig (and later
   Republican); Catholics and immigrants leaned Democratic. Note the critique
   too: Edward Pessen argued the ethnocultural model doesn't hold everywhere
   (e.g., NY merchants; the South, where it had little purchase). *Confidence:
   (a) for the thesis; (b) for how universal it is.* [Princeton UP / Benson;
   drbairdonline historiography]

**Implication for feature point #4:** modeling "faction ideology follows
economic base" is *historically right for the slavery axis* in 1856 but
*historically thin for the left-right economic axis* of the party system,
where religion/ethnicity/nativism (already in the game as Nativists,
EvangelicalReform, Immigrants) often dominated. The PR should let economic
expertise be one bias term among several, not the sole driver — otherwise it
will over-fit the Whig-Democrat-as-class myth the historiography rejects.

### 1856 lobby → expertise correspondence (game terms)
*Confidence: (b)/(c) — my synthesis, grounded in the cited economic facts.*

| Lobby card (in game) | Real interest | Expertise (game tag) | Industry nudged |
|---|---|---|---|
| SlavePower | cotton/slave plantation bloc | Agriculture | +cotton; +tobacco |
| NorthernIndustry | manufacturing/industrialists | Business | +manufacturing; +coal |
| SmallFarmers | yeoman / free-soil farming | Agriculture | +agriculture |
| Expansionists | territorial / land expansion | Foreign Affairs *(or Agriculture)* | +agriculture (frontier) |
| UrbanLabor | wage workers / unions | Labor | −manufacturing? *(see note)* |
| Abolitionists | antislavery reform (moral, not economic) | Justice or Education | — |
| EvangelicalReform | religious reform (not economic) | Education | — |
| ProUnion | unionist political bloc (not economic) | Foreign Affairs | — |
| Nativists | anti-immigrant (ethnocultural, not economic) | Media or Justice | — |

Notes: **Abolitionists, EvangelicalReform, ProUnion, and Nativists are
moral/ethnocultural/political lobbies, not economic ones** — no clean industry
nudge, mirroring 1772. The reference's "Labor Unions: −Manufacturing" sign is
**anachronistic for 1856** — organized industrial labor unions barely existed
(the AFL is 1886; the Knights of Labor 1869); 1850s "urban labor" was
unorganized wage workers and immigrant tradesmen. Do **not** import the modern
union-suppresses-manufacturing mechanic into 1856 without flagging it.
*Confidence: (a) for the dating; (c) for the expertise picks.*

---

## Industry-name reconciliation (the PR's point #3)
The reference doc's 8 industry names don't exist in the era state data. The
era data uses concrete period commodities instead. A defensible crosswalk
*(Confidence (b)/(c) — synthesis)*:

| Reference name | Era equivalent(s) already in state data |
|---|---|
| Plantation | cotton, tobacco, sugar (1856); tobacco, cotton (1772) |
| Manufacturing | manufacturing |
| Finance | finance |
| Maritime | shipping, fishing |
| Mining | mining, coal |
| Natural Gas | *(no era equivalent — anachronistic; omit pre-1900)* |
| High Tech | *(no era equivalent — anachronistic; omit pre-1900)* |
| Alt Energy | *(no era equivalent — anachronistic; omit pre-1900)* |

`agriculture`, `lumber`, `cattle` in the era data have no reference bucket;
they are best treated as their own keys (agriculture ≈ a generic farming
industry; lumber/cattle as regional commodities).

---

## Binding facts / anachronism watch-outs (PM must honor)

1. **"Lobby" as an organized pressure group is anachronistic for 1772 and
   loosely so for 1856.** The modern lobbying-industry sense postdates the
   Gilded Age. In-era these were **economic interests / blocs / factions**,
   not chartered lobbies. The game's lobby *cards* are fine as an abstraction;
   just don't surface era flavor text implying K-Street-style organized
   lobbying. *Confidence: (a).*
2. **Several lobby cards are non-economic** (1772: Patriots, NationalUnity,
   Reformers; 1856: Abolitionists, EvangelicalReform, ProUnion, Nativists).
   They have **no defensible industry nudge** and only loose expertise links.
   Expect the lobby→industry map to be partial. *Confidence: (a).*
3. **"Faction ideology follows economic base" is a tendency, not a law.**
   Refuted in its hard form for 1772 (Beard → McDonald/Brown, "three dozen
   interests") and complicated for 1856's party axis (Benson ethnocultural
   thesis: religion/ethnicity often beat class). It **does** hold for the 1856
   *sectional/slavery* axis. Model economics as one weighted input. *Confidence:
   (a).*
4. **Reference's "Labor Unions: −Manufacturing" is anachronistic before
   ~1870-1886.** No industrial union movement existed in 1772 or 1856. Map
   UrbanLabor → Labor expertise, but don't carry the union-vs-manufacturing
   sign into either scenario as-is. *Confidence: (a).*
5. **Natural Gas / High Tech / Alt Energy industries don't exist in 1772 or
   1856.** Drop them from both eras' industry sets; they belong to 20th/21st-c.
   scenarios the game doesn't yet have. *Confidence: (a).*
6. **Cotton is era-specific.** Cotton is economically *minor* in 1772 (it
   surges only after Whitney's gin, 1793) but *dominant* by 1856 (~58% of US
   exports). The game already seeds a little SC cotton in 1772 — fine as a
   nascent crop, but a 1772 SlavePower-style cotton lobby would be
   anachronistic; the 1772 plantation interest is **tobacco/rice-led**.
   *Confidence: (a).* [American Battlefield Trust]
7. **NY and PA were slave jurisdictions in 1772** (the data's `isSlaveState:
   true` is correct). Northern abolition is *gradual and post-Revolution* (PA
   1780, NY 1827); New England *merchants* were deeply enmeshed in the Atlantic
   slave trade (Newport/RI dominated it). So a clean "free North vs. slave
   South" economic split is a **1856** framing, **not** a 1772 one. Don't let
   the lobby→ideology logic assume a free/slave economic binary in the founding
   era. *Confidence: (a).* [PA HMC; RI slave-trade sources]
8. **Term hygiene across eras (already correct in the data, keep it):** 1856
   "Democrat" = pro-slavery/states'-rights agrarian party; 1856 "Republican" =
   new antislavery/free-labor/pro-industry party — the *opposite* economic-base
   polarity from their modern namesakes. 1772 "Federalist" = pro-commercial,
   strong-central-government — again not the later usage. *Confidence: (a).*

---

## Citations
1. [EH.net — Economic Interests and the Adoption of the U.S. Constitution](https://eh.net/encyclopedia/economic-interests-and-the-adoption-of-the-united-states-constitution/) — peer-reviewed economic-history survey of the ratification interests and the Beard debate (incl. McDonald, McGuire & Ohsfeldt). *Could not fetch full text (403); used as cited via search snapshot — verify before quoting verbatim.*
2. [Wikipedia — An Economic Interpretation of the Constitution](https://en.wikipedia.org/wiki/An_Economic_Interpretation_of_the_Constitution_of_the_United_States) — orientation on Beard thesis and the Brown (1956) / McDonald (1958) refutations; verify specifics elsewhere.
3. [CSAC, Univ. of Wisconsin — The Debate Over Property, Class, and Government](https://csac.history.wisc.edu/document-collections/constitutional-debates/property-class/) — Federalist (commercial/creditor) vs. Anti-Federalist (agrarian/debtor) interest framing.
4. [NPS — Industry and Economy during the Civil War](https://www.nps.gov/articles/industry-and-economy-during-the-civil-war.htm) — North/South 1860 industrial statistics (factories, pig iron, railroads, textiles, firearms).
5. [American Battlefield Trust — "Cotton is King"](https://www.battlefields.org/learn/articles/cotton-king) — cotton as share of US exports, world cotton share, Hammond 1858 speech.
6. [American Heritage — The South's Mighty Gamble on King Cotton](https://www.americanheritage.com/souths-mighty-gamble-king-cotton) — cotton = $191M of $333M (58%) of 1860 US exports.
7. [Princeton University Press — Lee Benson, *The Concept of Jacksonian Democracy*](https://press.princeton.edu/books/hardcover/9780691647623/the-concept-of-jacksonian-democracy) — ethnocultural thesis: religion/ethnicity over economic class in party affiliation.
8. [Dr. Baird Online — Historiographical Impact of Benson's *Concept of Jacksonian Democracy*](https://www.drbairdonline.com/about-my-research/historiography/the-historiographical-impact-of-the-concept-of-jacksonian-democracy-at-the-end-of-its-run/) — reception and critiques (Pessen) of the ethnocultural model.
9. [LibreTexts — The Second Party System](https://human.libretexts.org/Bookshelves/History/National_History/United_States_History_to_1877_(Locks_et_al.)/12:_Jacksonian_America_(1815-1840)/12.03:_The_Second_Party_System) — Whig vs. Democrat economic-policy contrast (bank, tariff, improvements).
10. [Library of Congress — Colonial America Business: Craftsmen & Tradesmen](https://guides.loc.gov/colonial-america-business-research/craftsmen) — colonial artisan/tradesman economic roles. *403 on fetch; cited via search.*
11. [Colonial Williamsburg — Who Were the Sons of Liberty?](https://research.colonialwilliamsburg.org/foundation/journal/winter12/liberty.cfm) — composition (lawyers, merchants, master craftsmen) and radicalism of urban artisans.
12. [Revolutionary War Journal — Colonial Artisans / Mechanicks](https://revolutionarywarjournal.com/colonial-artisan-mechanicks-middle-class-muscle-behind-the-american-revolution/) — artisans as Revolutionary middle-class base.
13. [Iowa State (Rosenbloom) — The Colonial American Economy](https://dr.lib.iastate.edu/server/api/core/bitstreams/8b683996-1c99-408d-9199-4da0b3535d5f/content) — regional colonial economic structure (New England shipping, middle-colony grain, Southern cash crops).
14. [GMU CHNM — Differences Among Colonial Regions](https://chnm.gmu.edu/tah-loudoun/blog/lessons/differences-among-colonial-regions/) — regional colonial economies.
15. [PA Historical & Museum Commission — Act for the Gradual Abolition of Slavery (1780)](https://www.phmc.state.pa.us/portal/communities/documents/1776-1865/abolition-slavery.html) — PA 1780 gradual abolition; dating Northern abolition as post-Revolution.
16. [Archives.gov — The Two-Party System: A Revolution in American Politics, 1824-1840 (PDF)](https://www.archives.gov/files/legislative/resources/ebooks/two-party-system.pdf) — second-party-system structure.
17. [ushistory.org — Strengths and Weaknesses: North vs. South](https://www.ushistory.org/us/33b.asp) — North/South 1860 comparison figures (population, factories, railroads).
