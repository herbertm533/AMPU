# Historical Context — Trait Pass B, governance traits + era-event expertise routing (PR6)

**Audience:** PM authoring CP1 specs for PR6 — the 10 new governance traits +
the 4-6 era events that route through cabinet expertise and traits.
**Status:** Research brief. Historical ground truth, not mechanic design.
Pairs with PR4a/PR4b election-trait briefs and the PR5 cabinet overhaul brief.

> Confidence levels used below:
> **(C)** consensus history (still cited where the specific date/number/vote
> matters); **(R)** contested but reasonable; **(I)** my synthesis / inference.

PR4a/PR4b shipped 22 election-facing traits with per-context magnitudes for
6 election contexts. PR5 shipped the era-conditional cabinet (4 -> 7 seats
across 1789-1849) with expertise scoring and cross-party RNG. PR6 closes the
"governance-effect of traits + cabinet expertise" loop with 10 new traits
operating in 4 governance contexts (`governance_crisis`, `lingering_phase`,
`military_command`, `internal_party`) plus expertise routing on 4-6 picked
era events. This brief grounds each trait in named figures and shapes the
event picks. **All directional bands (SMALL / MEDIUM / LARGE) match PR4a's
band scheme** (`TRAIT_ELECTION_BANDS = 2 / 4 / 8`); PM may reuse or rescope
for governance.

The existing AMPU `Trait` union (`src/types.ts:62-107`) already carries
**Crisis Manager** (Q3-resolved as an old-age mortality multiplier in
`MORTALITY_RULES.crisisManagerDeathMult`), **Kingmaker** (a Backroom-themed
positive in `TRACK_THEMED_TRAITS`), **Leadership**, **Nationalist**, and
**Globalist**. PR6's "Crisis Admin" / "Crisis Gov" / "Master Kingmaker"
must distinguish themselves from these. I treat the existing **Crisis
Manager** trait as the umbrella "competent under pressure" tag and the new
**Crisis Admin** / **Crisis Gov** as specialized expertise-conditioned
forks. (I) The PM should decide whether PR6's new traits are co-grantable
with the existing Crisis Manager or whether Crisis Manager is retired.

---

## Section 1 — Per-trait historical grounding (10 traits)

### 1.1 Crisis Admin

**Concept.** Competence at managing a **financial / fiscal** crisis (panic,
debt restructuring, bank failure, war finance). Distinguishes the figure
who *acts decisively in markets* from the figure who *acts decisively at
the cabinet table*. (I)

**Canonical 1772 era figure — Alexander Hamilton (1791-1792).** Hamilton
formally managed the Panic of 1792 from the Treasury, the United States'
first true financial crisis. Securities prices dropped roughly 25% in two
weeks in March-April 1792; Hamilton funneled Treasury funds through banks
to make open-market purchases of securities, organized banks to absorb
unwanted paper, and stabilized the market by May 1792. He implemented
classic central-bank crisis tools eight decades before Walter Bagehot
codified them. (C) See
[NY Fed Liberty Street Economics](https://libertystreeteconomics.newyorkfed.org/2014/05/crisis-chronicles-central-bank-crisis-management-during-wall-streets-first-crash-1792/)
and [NBER Sylla paper](https://users.nber.org/~confer/2006/si2006/dae/sylla.pdf).

**Other 1772-era candidates:**
- **Robert Morris (1781-1784)** — Superintendent of Finance during the
  Confederation's near-bankruptcy. By 1781 the US owed ~$25M and could not
  pay the Continental Army; Morris personally financed Army payroll via
  "Morris notes" backed by his own credit, founded the Bank of North
  America (1782), and held off the Newburgh Conspiracy and Pennsylvania
  Line mutiny. (C) [Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/robert-morris).
- **Albert Gallatin (1801-1814)** — Jefferson/Madison Treasury Sec; held
  the post longest in US history; managed War of 1812 financing strain
  including the August 1814 Treasury suspension. (C)

**Canonical 1856-era figure — Salmon P. Chase (1861-1864).** Chase
designed Civil War finance from scratch: pushed the Legal Tender Act
(1862, "greenbacks"), the first US fiat paper currency since the
Continental dollar; established the national banking system via the
National Banking Acts of 1863-64; sold $400M of "five-twenties" and $800M
of "seven-thirties" war bonds. (C)
[Treasury](https://home.treasury.gov/about/history/prior-secretaries/salmon-p-chase-1861-1864).

**Directional bucket:**
- `governance_crisis` **+LARGE** during financial-flavored events (Panic
  of 1857, Confederation finance, war-finance shocks).
- `lingering_phase` **+SMALL** revenue meter drift (small competence
  bonus on routine fiscal management).
- `military_command` no effect.
- `internal_party` **+SMALL** (treasury patronage is real but not the
  dominant intra-party tool).

**Conflict pair candidate:** No clean opposite in AMPU's current set. The
historical antonym is "panicked" or "indecisive" — neither exists as a
trait. Recommend **standalone** (no symmetric conflict pair); the negative
counterpart is implicit in NOT having Crisis Admin during a financial
event. (I)

**Anachronism check:** "Crisis Admin" as a label is borderline
technocratic — neither 1772 nor 1856 contemporaries would have used the
word "administrator" in this sense. The PM may keep the code label and
display it as **"Financier"** or **"Steady Hand"** in UI. (I)

---

### 1.2 Crisis Gov

**Concept.** Competence at managing a **constitutional / political**
crisis (secession, civil disorder, succession). Distinguishes "knows when
to act and how to frame action" from the financial-management archetype
above. (I)

**Canonical 1856-era figure — Abraham Lincoln (1861).** First Inaugural,
March 4, 1861 — Lincoln chose conciliatory framing ("we are not enemies,
but friends … the better angels of our nature") while announcing the
intent to "hold, occupy, and possess" federal property. (C) Combined with
April 27, 1861 habeas corpus suspension between DC and Philadelphia (to
secure the Maryland-DC rail corridor) and the July 1861 special-session
message claiming the constitutional power of "extreme necessity." (C)
[History.com](https://www.history.com/this-day-in-history/may-28/lincolns-suspension-of-habeas-corpus-is-challenged),
[Britannica Ex parte Merryman](https://www.britannica.com/event/Ex-Parte-Merryman).

**Anti-case — James Buchanan (December 1860-March 1861).** Buchanan
declared secession illegal AND declared federal coercion equally illegal,
producing four months of paralysis as seven states seceded, three of his
own cabinet officers resigned to join the Confederacy, and his "Star of
the West" relief mission to Fort Sumter was turned back January 9, 1861.
(C) [Miller Center](https://millercenter.org/president/james-buchanan/key-events).
Buchanan is the canonical "non-Crisis-Gov president fumbling secession"
case the PM should anchor the negative-side rules to.

**1772-era figures:**
- **George Washington (Whiskey Rebellion, 1794)** — personally led 13,000
  militia into western PA; the only sitting president to lead troops in
  the field. (C)
- **John Adams (XYZ Affair / Quasi-War, 1798)** — navigated declared
  hostilities with France without a formal congressional war declaration,
  resisted Hamiltonian-Federalist war fever, signed the Convention of
  1800 against his own party's wishes. (C)
- **James Madison (1812-1814)** — anti-case in part (Washington burned
  August 1814) but successfully held the Republic together through
  invasion + Hartford Convention. (R)

**Directional bucket:**
- `governance_crisis` **+LARGE** during non-financial crisis events
  (Secession Winter, John Brown raid, Whiskey Rebellion, XYZ).
- `lingering_phase` **+SMALL** domestic meter drift.
- `military_command` no direct effect (Lincoln was not a field commander;
  the political-cover for generals is captured here, not command).
- `internal_party` **+SMALL** (crisis-managed presidents tend to hold
  fragile coalitions, but this is downstream).

**Conflict pair candidate:** "Passive" already exists in the union (one
of NEGATIVE_TRAITS) and reads as the natural inverse — Buchanan's
"didn't do anything" profile is literally **Passive** in AMPU terms.
Recommend **Crisis Gov ↔ Passive** as conflict pair *if* the PM wants
Buchanan to carry Passive automatically. (I) Otherwise standalone.

**Anachronism check:** "Crisis Gov" reads modern (the abbreviation
"Gov." for Governance is itself 20c). Concept fine in both eras.
Recommend display name **"Statesman in Crisis"** or **"Steady Statesman"**. (I)

---

### 1.3 Decisive General

**Concept.** Wartime command effectiveness — sees the decisive moment,
acts, accepts casualties for victory. Distinct from peacetime command
competence. (I)

**Canonical 1856-era figures:**
- **Ulysses S. Grant (1864-1865)** — Overland Campaign + Petersburg
  siege; the willingness to accept ~55K casualties in the Wilderness /
  Spotsylvania / Cold Harbor for strategic effect that McClellan would
  never have absorbed. (C)
- **William T. Sherman (Atlanta 1864 → March to the Sea)** — flanking
  Joseph Johnston, breaking Hood, devastating the Georgia interior to
  end the war. (C)
- **Thomas "Stonewall" Jackson (1862 Valley Campaign, Chancellorsville
  flank march 1863)** — Confederate side; tactical aggressiveness as
  template. (C)
- **Edwin Stanton (Sec of War, 1862-1865)** — *administrative* rather
  than field decisiveness; he should carry **Crisis Admin** more cleanly
  than Decisive General (his contribution was logistics and personnel
  policy, not generalship). (I)

**Canonical 1772-era figures:**
- **George Washington (Trenton, December 25-26 1776; Princeton, January 3
  1777)** — the Trenton-Princeton sequence is the canonical "decisive at
  the right moment" Revolutionary case. (C)
- **Andrew Jackson (Battle of New Orleans, January 8 1815)** — tactical
  ferocity against numerically superior British force. (C)
- **Nathanael Greene (Southern Campaign 1780-1781)** — strategic
  withdrawal-and-engage; the "we fight, get beat, rise and fight again"
  pattern that wore Cornwallis down. (C)

**Directional bucket:**
- `military_command` **+LARGE** while war active (Q: PM, this should
  modulate the existing `command` rolls in `revolutionaryWar.ts`).
- `governance_crisis` **+SMALL** during military-flavored crises.
- `lingering_phase` no effect.
- `internal_party` no effect (generals don't typically reshape
  intra-party dynamics from the field).

**Conflict pair:** **Decisive General ↔ Naive Strategist** (PM's
suggestion — confirmed historically correct; McClellan-vs-Grant is the
clean A/B).

**Anachronism check:** Both eras fine.

---

### 1.4 Naive Strategist

**Concept.** Wartime command incompetence at the strategic level — over-
estimates the enemy, hesitates, refuses to accept casualties for decisive
effect, fights yesterday's war. (I)

**Canonical 1856-era figures:**
- **George B. McClellan (Peninsula Campaign, April-July 1862).** The
  archetype. Consistently over-estimated Confederate strength (often by
  ~2× per flawed Pinkerton reports); month-long Yorktown siege April
  5-May 3, 1862; reached within ~5 miles of Richmond without serious
  assault; refused to commit reserves at Antietam (September 17, 1862).
  (C) [American Battlefield Trust](https://www.battlefields.org/learn/articles/peninsula-campaign-mcclellans-strategic-masterstroke-and-tactical-blunder).
- **Ambrose Burnside (Fredericksburg, December 13 1862)** — frontal
  assaults on Marye's Heights; ~12,500 Union casualties. (C)
- **John Pope (Second Bull Run, August 28-30 1862)** — outmaneuvered by
  Jackson; bombastic pre-campaign orders vs catastrophic field result.
  (C)
- **John B. Floyd (Sec of War 1857-1860)** — mishandled the Utah War
  (1857-58, the Mormon Expedition), redistributed Army garrisons in ways
  Buchanan's critics later called pro-Southern; arguably he is the
  *cabinet-level* anti-strategist. (R)
  [Encyclopedia Virginia](https://encyclopediavirginia.org/entries/floyd-john-b-1806-1863/).

**Canonical 1772-era figures:**
- **Arthur St. Clair (Wabash / St. Clair's Defeat, November 4 1791).**
  Largest single Native American victory over US forces — ~900 US
  casualties out of ~1,400, larger than Little Bighorn. St. Clair failed
  to scout, post adequate sentries, or fortify the camp. (C)
  [Army.mil](https://www.army.mil/article/65594/st_clairs_campaign_of_1791_a_defeat_in_the_wilderness_that_helped_forge_todays_u_s_army).
- **William Hull (Detroit, August 16 1812).** Outnumbered the British,
  surrendered without firing a shot; later court-martialed and sentenced
  to death; Madison commuted. The only US general sentenced to death by
  court-martial. (C)
  [History.com](https://www.history.com/this-day-in-history/august-16/detroit-surrenders-without-a-fight).
- **Horatio Gates (Camden, August 16 1780)** — fled the battlefield while
  the militia broke around him. (C)

**Directional bucket:**
- `military_command` **-LARGE** while war active.
- `governance_crisis` **-SMALL** during military-flavored crises.
- `lingering_phase` no effect.
- `internal_party` no effect.

**Conflict pair:** **Decisive General ↔ Naive Strategist** (confirmed).

**Anachronism check:** Both eras fine. "Strategist" was in use by 1810s
military writing.

---

### 1.5 Domestic Warrior

**Concept.** Legislative / domestic-policy bonus — the politician who
*lives* in domestic combat. (I) Spec example: Calhoun on nullification,
Sumner on slavery, Clay on compromise. Note the trait reads positive in
governance even though "warrior" connotes conflict — these figures **make
domestic legislation move**.

**Canonical 1856-era figures:**
- **John C. Calhoun (1828-1850).** "South Carolina Exposition and
  Protest" (anonymously authored 1828); Vice-presidential resignation
  Dec 28, 1832 to enter Senate; nullification doctrine in *Discourse on
  the Constitution and Government of the United States*. (C)
  [Britannica](https://www.britannica.com/topic/Nullification-Crisis).
- **Henry Clay (1820 / 1833 / 1850 compromises).** The "Great
  Compromiser" — Missouri Compromise (1820), Tariff Compromise (1833,
  defusing nullification), Compromise of 1850 (delivered the Fugitive
  Slave Act, popular sovereignty for the Mexican Cession). (C)
- **Charles Sumner (1851-1874).** Mass. Sen, "Crime against Kansas"
  speech May 19-20 1856 → Brooks caning May 22 1856; durably the loudest
  abolitionist voice in the Senate. (C)
- **Alexander Stephens (CSA VP, before that GA congressman 1843-1859).**
  Cornerstone Speech (March 21 1861). (C)

**Canonical 1772-era figures:**
- **James Madison (Bill of Rights drafting 1789; *Federalist* essays
  1787-88; Virginia and Kentucky Resolutions 1798).** Domestic structural
  combat across two decades. (C)
- **Patrick Henry (Anti-Federalist leadership 1788; Virginia
  ratification convention)** — domestic political combat archetype. (C)

**Directional bucket:**
- `lingering_phase` **+MEDIUM** on domestic meter drift / +SMALL on
  legislative phase outcomes.
- `internal_party` **+MEDIUM** (domestic-policy fighters set faction
  agendas).
- `governance_crisis` **+SMALL** for non-financial domestic crises.
- `military_command` no effect.

**Conflict pair:** "Domestic Apathy" already exists in the union and is
literally the inverse. Recommend **Domestic Warrior ↔ Domestic Apathy**
as conflict pair. (I)

**Anachronism check:** "Domestic" was used in both eras for non-foreign
affairs. "Warrior" as a political term is fine (19c rhetoric routinely
used "political warrior"). PM may prefer display **"Domestic Champion"**
to avoid the modern-coded "warrior". (I)

---

### 1.6 Iron Fist

**Concept.** Authoritarian governing style — enforces decisions, willing
to use coercive state power; honest meter +, free / domestic meter -. (I)

**Canonical 1856-era figures:**
- **Andrew Jackson (1832-33 Nullification, Bank War).** Proclamation to
  the People of South Carolina (Dec 10 1832) threatened force; Force Bill
  (March 1833). Vetoed Second Bank of US recharter July 10 1832; ordered
  Treasury Secretary Roger Taney to remove federal deposits Sept 1833.
  (C) Cite: nullification crisis sources above. Jackson is the
  prototypical "Iron Fist" in the 1856 dataset — but he predates the
  scenario start (died 1845). The trait should attach to his *successors*
  who modeled themselves on him (Polk).
- **James K. Polk (1845-1849).** Per Charles Sellers and Mark Eaton
  biographies: "didn't like to delegate authority," "became involved in
  the everyday affairs of his Cabinet members," 25-volume diary tracking
  every department decision. (C) [PBS US-Mexican War](https://usmexicanwar.kera.org/prelude/jp_bluffs_and_boundaries.php).
- **Abraham Lincoln (1861-65).** Habeas suspension April 27 1861; ignored
  *Ex parte Merryman* (Taney, May 1861); suspended habeas nationally
  Sept 24 1862; military commissions for civilians. (C) The Lincoln-as-
  Iron-Fist case is contested — Lincoln framed every step as temporary
  war necessity. (R) [Quod.lib.umich.edu Lincoln habeas analysis](https://quod.lib.umich.edu/j/jala/2629860.0029.205).
- **Edwin Stanton (Sec of War 1862-1868).** Wartime press suppression,
  arrest of Confederate sympathizers. (C)
- **John B. Floyd (Sec of War 1857-1860) / Howell Cobb (Sec Treasury
  1857-1860)** — authoritarian Southern Democrats; both resigned to join
  CSA. (R)

**Canonical 1772-era figures:**
- **George Washington (Whiskey Rebellion, August-November 1794).** Led
  ~13,000 militia personally. (C)
- **John Adams (Alien and Sedition Acts, July 14 1798).** Prosecution of
  newspaper editors under Sedition Act. (C)

**Directional bucket:**
- `lingering_phase` **+SMALL honest meter / -SMALL domestic meter** per
  spec hint (honesty: rule of law enforced; domestic: civil-liberties
  cost).
- `governance_crisis` **+MEDIUM** during crisis events where decisive
  authority is required (this is the pair-with-Crisis-Gov case).
- `military_command` **+SMALL** (chain-of-command discipline).
- `internal_party` **+SMALL** (intimidates internal challengers).

**Conflict pair candidate:** "Reformist" (already in AMPU's positive
union, Legislative-track themed) is **NOT** a clean opposite — Reformists
can be authoritarians (Theodore Roosevelt). The clean historical opposite
is "Conciliator" or "Pragmatic Compromiser" — neither exists. Recommend
**standalone** for Iron Fist. (I) The PM may consider pairing with
**Harmonious** (already in union, the consensus-builder archetype) but
historically Lincoln was both Iron Fist *and* Harmonious — so a hard
pair would mis-encode him. Leave standalone.

**Anachronism check:** "Iron Fist" — the phrase "iron hand" appears in
English at least to the 17c; "iron fist" specifically dates to the
mid-19c. Both eras fine for code label. (C)

---

### 1.7 Delegator

**Concept.** Delegates substantively to cabinet; multiplier UP on cabinet
effects. (I)

**Canonical 1856-era figure — Abraham Lincoln (Team of Rivals).** Per
Doris Kearns Goodwin's *Team of Rivals* (the canonical secondary): three
of his four major cabinet picks had run against him for the 1860 GOP
nomination (Seward, Chase, Bates; plus Cameron). Lincoln let Seward run
foreign affairs (notably the Trent Affair climb-down, see Section 2);
let Chase design wartime finance from scratch (greenbacks, national
banking); replaced ineffectual Cameron with Stanton at War January 1862
and let Stanton run the War Department with a free hand. (C)
[LOC Team of Rivals exhibit](https://www.loc.gov/exhibits/lincoln/a-team-of-rivals.html),
[White House Historical](https://www.whitehousehistory.org/abraham-lincolns-cabinet).

**Canonical 1772-era figure — George Washington (1789-1797).** Deferred
to Hamilton on finance (the Funding Act, Bank, Whiskey Tax, Reports on
Public Credit / Manufactures); deferred to Jefferson on foreign policy
until 1793; signed the Jay Treaty over Jefferson's objection on Hamilton's
counsel. The "first among equals" cabinet model. (C, I synthesis)

**Other 1856-era candidates:**
- **William McKinley (out of scenario, illustrative)** — deferred to Mark
  Hanna on party affairs and to John Hay on diplomacy.
- **Zachary Taylor (1849-50)** — military man unfamiliar with civilian
  governance; deferred broadly to his cabinet. (R)

**Directional bucket:**
- `governance_crisis` **multiplier +0.5** on cabinet-effect contribution
  (PM's mechanism — confirmed historically apt).
- `lingering_phase` cabinet-effect multiplier scaled UP.
- `military_command` no direct (the delegation is to civilian SecWar
  who in turn delegates to generals; modeled separately).
- `internal_party` **+SMALL** (delegated patronage builds intra-party
  goodwill).

**Conflict pair:** **Delegator ↔ Micromanager** (confirmed — clean A/B).

**Anachronism check:** "Delegator" — modern HR-speak; the verb "delegate"
in this sense is 16c+ but the noun form "delegator" is late-19c. Concept
universally fine. PM may prefer display **"Hands-off"** or **"Cabinet
Builder"**. (I)

---

### 1.8 Micromanager

**Concept.** Personal involvement in cabinet decisions; multiplier DOWN
on cabinet effects, president stats UP. (I)

**Canonical 1856-era figure — James K. Polk (1845-1849).** "Polk can be
described as a micro-manager who immersed himself in the duties of the
office and was involved in literally every detail of the Washington
bureaucracy" — quoting Dickinson College's published analysis of Polk's
diary. (C) [Dickinson](https://blogs.dickinson.edu/hist-282pinsker/2017/02/14/polks-diary-and-the-war-with-mexico/).
He overrode SecState Buchanan on Mexican territorial demands during the
Mexican War, micromanaged Treasury (Walker tariff 1846), and personally
drafted instructions to General Winfield Scott. The 25-volume diary is
itself the documentary evidence of micromanagement. (C)

**Canonical 1772-era figure — John Adams (1797-1801, especially XYZ
1798).** Adams kept Washington's cabinet largely intact but never trusted
them (rightly — Pickering and McHenry were Hamilton loyalists). Adams
personally negotiated the Convention of 1800 over the objections of his
Hamiltonian cabinet, firing Pickering May 12 1800. (C) [State.gov
Pickering tenure](https://www.state.gov/former-secretaries-of-state).

**Other candidates:**
- **John Quincy Adams (1825-29)** — work habit was to rise at 5am, write
  alone; very personal style of administration. (R)
- **Andrew Johnson (1865-69)** — distrustful of Lincoln's holdover
  cabinet, tried to fire Stanton → impeachment. Out of scenario but
  archetype. (C)

**Directional bucket:**
- `governance_crisis` **multiplier -0.5** on cabinet-effect contribution
  AND **+SMALL** on president-stat weighting (PM's mechanism — confirmed).
- `lingering_phase` cabinet-effect multiplier scaled DOWN, president
  meter contribution UP.
- `military_command` **+SMALL** (Polk's Mexican War micromanagement
  produced strategic results, even if Scott resented it).
- `internal_party` **+SMALL** (controls patronage personally).

**Conflict pair:** **Delegator ↔ Micromanager** (confirmed).

**Anachronism check:** "Micromanager" is 20c usage (term coined ~1960s).
Concept fine in both eras. Recommend display **"Hands-On"** or **"Personal
Ruler"**. (I)

---

### 1.9 Overeager

**Concept.** Initiates / triggers events at lower threshold than baseline.
Acts before circumstances warrant. (I)

**Canonical 1856-era figures:**
- **Franklin Pierce (Kansas-Nebraska Act, May 30 1854).** Per Miller
  Center: "Although Pierce dislikes the proposal and worries that it will
  create national controversy, he succumbs to pressure from various
  senators who threaten to block appointments." (C) The "overeager"
  reading is Pierce signing despite his own forecast of catastrophe.
  Alternative reading: Pierce as Domestic Apathy + Impressionable (he
  yielded). (R) [Miller Center Pierce key events](https://millercenter.org/president/franklin-pierce/key-events).
- **James K. Polk (May 13, 1846 — declaration of war on Mexico).** Polk
  sent Taylor to the disputed Texas-Mexico border, then asked Congress
  for war 11 days after first US casualties. Spot Resolutions (Lincoln,
  Dec 1847) challenged whether the casualties were on US soil at all.
  (C, R) [Zinn Education](https://www.zinnedproject.org/news/tdih/congress-approves-declaration-of-war-against-mexico/).
- **Charles Wilkes (Trent Affair, November 8 1861)** — seized Mason and
  Slidell without orders; the *military* overeager case (see Section 2).

**Canonical 1772-era figures:**
- **Henry Clay (War Hawk, 1811-1812)** — pushed Madison toward War of
  1812; the "War Hawks" caucus. (C)
- **Hamilton (Quasi-War advocacy, 1798)** — pushed Adams toward larger
  Provisional Army than Adams wanted; Adams resented and eventually
  rejected the escalation. (C)

**Directional bucket:**
- `governance_crisis` **trigger threshold lowered** — i.e. events that
  require a meter low to fire will fire at a milder meter under an
  Overeager president. (PM mechanism call.)
- `lingering_phase` no direct meter effect.
- `military_command` **+SMALL** (decisive engagement) but **-SMALL**
  preparation (acts before ready); historical net ~neutral.
- `internal_party` **+SMALL** (the activist within a faction).

**Conflict pair candidate:** "Passive" (already in union — Buchanan-
archetype) is the natural inverse. Recommend **Overeager ↔ Passive**. (I)
The trade-off being "fires too eagerly" vs "fires too late." This conflicts
with my Crisis-Gov suggestion above (also pairing with Passive). PM should
pick one — recommend **Overeager ↔ Passive** as the cleaner pair (the
behavioral mirror is exact). Leave Crisis Gov standalone.

**Anachronism check:** Both eras fine. "Overeager" appears in English
1814+. (C)

---

### 1.10 Master Kingmaker

**Concept.** Intra-party power — installs faction leaders, dark-horse
nominations, machine politics. Distinct from AMPU's existing "Kingmaker"
trait (a generic Backroom-themed positive). (I) "Master Kingmaker" is the
upgrade tier.

**Canonical 1856-era figures:**
- **Henry Clay (1824 Corrupt Bargain).** Clay finished fourth in 1824 EC;
  as Speaker of the House he delivered Adams the House vote of February 9,
  1825; Adams appointed him Sec of State March 7, 1825. The archetypal
  kingmaker move. (C) [Bill of Rights Institute](https://billofrightsinstitute.org/essays/the-corrupt-bargain/).
- **Martin Van Buren (Albany Regency, 1820s; engineering Jackson 1828;
  Polk dark-horse 1844).** "The leading figure in the Albany Regency,
  a group of politicians who for more than a generation dominated much
  of the politics of New York and powerfully influenced those of the
  nation." (C) [Wikipedia Albany Regency](https://en.wikipedia.org/wiki/Albany_Regency)
  — note Wikipedia is acceptable as orientation here; the Regency facts
  are uncontroversial. Van Buren engineered Polk's 1844 dark-horse
  nomination by holding the 2/3 rule at the Baltimore convention. (C)
- **Thurlow Weed (1840s-1860s).** New York Whig boss, kingmaker for
  Seward; later forced to accept Lincoln 1860. (C)
- **Stephen A. Douglas (1850s)** — engineered Pierce 1852 dark-horse
  nomination (49 ballots), the Kansas-Nebraska Act 1854. (C)

**Canonical 1772-era figures:**
- **Alexander Hamilton (1796, 1800)** — engineered the Pinckney-over-
  Adams maneuver 1796 (failed); the 1800 Federalist breach with Adams
  ("Letter from Alexander Hamilton, Concerning the Public Conduct and
  Character of John Adams, Esq."). (C)
- **Aaron Burr (Tammany 1800, electoral count manipulation)** — the
  1800 Burr-Jefferson tie was partly Burr's own machine work. (C)

**Directional bucket:**
- `internal_party` **+LARGE** — faction-leader install bonus, primary
  dark-horse boost.
- `governance_crisis` **+SMALL** (can move party in crisis).
- `lingering_phase` no direct meter effect.
- `military_command` no effect.

**Conflict pair candidate:** "Outsider" (already in union) is the natural
inverse — the kingmaker works the machine, the outsider works against it.
Recommend **Master Kingmaker ↔ Outsider** as conflict pair. (I) Note
"Outsider" already has election-context effects in `TRAIT_ELECTION_EFFECTS`
so this pair has cross-system consequences — PM may prefer leaving Master
Kingmaker standalone to keep PR6 contained.

**Anachronism check:** "Kingmaker" as a political term: the *Oxford
English Dictionary* dates the metaphorical political sense to the 19c
(earlier referred to the Earl of Warwick, 15c). "Master Kingmaker" is
fine in both eras as code label. (C)

---

## Section 2 — Per-event historical grounding (recommended 4 events for PR6 wiring)

PR6 picks 4-6 events from the candidate list. **Recommended wire-up: 4
events** (Dred Scott, Secession Winter, John Brown, Trent Affair). Defer
Bleeding Kansas (overlapping with existing 2.4.3 events) and KS-NE-Act
fallout (too diffuse — better modeled as a multi-turn meter drag than a
single event). (I)

---

### 2.1 Dred Scott Decision (March 6, 1857)

**Existing AMPU event:** YES. `eraEvents1856.ts:30-52`. Currently
`decider: 'cabinet'` — the only `cabinet`-decider event in the file.

**Historical facts.** Chief Justice Roger Taney delivered the decision
March 6, 1857, two days after Buchanan's inauguration. Per the
Smithsonian: on **February 3, 1857**, president-elect Buchanan began
corresponding with Justice **John Catron** of Tennessee, asking when the
country would learn the decision and how broadly framed it would be. On
**February 23, 1857**, Justice **Robert Grier** of Pennsylvania wrote
back tipping Buchanan off: "six if not seven will declare that the
compromise law of 1820 to be non-effect." Buchanan lobbied Grier (a
Northerner) to join the Southern majority to disguise sectional cleavage.
(C) [Smithsonian](https://www.smithsonianmag.com/smart-news/president-james-buchanan-directly-influenced-outcome-dred-scott-decision-180962329/).
Buchanan's inaugural address (March 4, 1857) explicitly anticipated the
ruling.

**Cabinet expertise dependencies:**
- **Attorney General** — primary advisor. In 1857-60 this was **Jeremiah
  Black (PA)**, an able lawyer who later denounced the ruling in private.
  AG's `Justice` expertise is the canonical gate. A high-Justice AG would
  have plausibly counseled the president *not* to engineer the decision's
  breadth. (R)
- **Secretary of State** — institutional voice on whether to publicly
  endorse. **Lewis Cass** (Buchanan's first SecState, 1857-60) carried
  high `Foreign Affairs` expertise but no Justice; he would have been
  bypassed in this event. (I)

**Trait dependencies:**
- President carrying **Iron Fist** would *worsen* outcome (Buchanan's
  "endorse and crush dissent" path was historically what made Dred Scott
  toxic).
- President carrying **Crisis Gov** would *improve* outcome (Lincoln's
  later approach — partial compliance, public denunciation, build
  political response — would have been the Crisis-Gov counterfactual).
- AG carrying **Integrity** + high Justice expertise — substantial bump
  to a "concerns expressed, comply" outcome (r2 in existing event).

**Outcome shape recommendation:** Currently the AMPU event has 3
responses (endorse / measured / resist). Recommend keeping 3 responses
but **banding within each** by AG expertise + president traits: full
endorse → very bad if Iron Fist, bad if Naive Strategist, partial if
Crisis Gov. Five-band (very good / good / partial / bad / very bad) is
overkill for an event with already-strong response branching — keep
ternary outcome and modulate magnitudes. (I)

---

### 2.2 John Brown's Raid on Harpers Ferry (October 16-18, 1859)

**Existing AMPU event:** YES. `eraEvents1856.ts:78-100`. `decider:
'president'`.

**Historical facts.** Brown and 21 followers seized the federal arsenal
at Harpers Ferry, VA, October 16, 1859. **Colonel Robert E. Lee**
(US Army, on leave from his Texas command) led the Marine detachment
that stormed the engine house October 18; Brown was captured, tried for
treason against Virginia (not the US — federal indictment was secondary),
hanged December 2, 1859. (C) Note: Lee's dispatch was an *Army* matter
routed through SecWar Floyd, not directly president-to-Marines. (C)
Brown's letters and the Secret Six funding came out in the trial, deepening
Northern abolitionist sympathy.

**Cabinet expertise dependencies:**
- **Secretary of War (Floyd)** — primary military responder. Floyd's
  `Military` expertise (low — Floyd was a politician, not soldier) is
  what dispatched Lee to the scene. A high-Military SecWar might have
  responded faster or with more federal force. (R) Per Encyclopedia
  Virginia, Floyd was already under scandal cloud by late 1859 (Indian
  Bond fraud broke 1860).
- **Attorney General (Black)** — handled the federal-vs-Virginia
  jurisdictional question. Black let Virginia try Brown for treason
  rather than federal court. (R)

**Trait dependencies:**
- President carrying **Iron Fist** → worsens (the "crackdown on
  abolitionists" response — historically Buchanan considered this).
- President carrying **Crisis Gov** → partial improve (Lincoln's later
  framing of Brown as a sympathetic lunatic vs Northern radicalism).
- SecWar **Decisive General** → faster, cleaner military response.
- SecWar **Naive Strategist** → bungled response (worst case: Brown
  escapes, sparks broader uprising).
- President + SecWar **Slavery-position** (the spec asks for slavery
  position as a check): pro-slavery cabinet → harsher Virginia outcome
  → larger Northern backlash; antislavery → muted Virginia outcome but
  larger Southern outrage at perceived federal weakness. Note: **AMPU
  doesn't currently carry an explicit slavery-position attribute** on
  politicians — closest proxy is `ideology` (Traditionalist + Conservative
  → pro-slavery; LW Populist + Progressive in 1856 RED faction →
  antislavery). PM should decide whether to read ideology or add a flag.
  (I)

**Outcome shape recommendation:** Ternary OK (current event already
has good/measured/crackdown branching). Modulate by SecWar
Decisive/Naive General trait and President Iron Fist.

---

### 2.3 Secession Winter (December 1860 - March 1861)

**Existing AMPU event:** PARTIAL. `eraEvents1856.ts:102-124` has
"Southern Secession Threat" for `year >= 1860`. Not the same as
**Secession Winter** as PR6 spec describes — the existing event is the
1860 pre-election threat; the *Winter* is the November 1860 - March 1861
post-election unraveling. PM may want to add a distinct Secession Winter
event keyed Nov 1860 - Mar 1861.

**Historical facts — the cabinet collapse.** This is the strongest single
historical case for "cabinet loyalty as governance check":
- **December 8, 1860** — Howell Cobb (Sec Treasury, GA) resigns to join
  GA secession effort. First Buchanan cabinet rupture. (C) [Miller
  Center](https://millercenter.org/president/buchanan/essays/cobb-1857-secretary-of-the-treasury).
  Cobb later headed the Provisional Confederate Congress (Feb-Nov 1861).
- **December 29, 1860** — John B. Floyd (Sec War, VA) honors Buchanan's
  resignation request after the Abstracted Indian Bonds scandal AND
  Floyd's order to ship 124 cannons to Ship Island, MS and Galveston, TX.
  Floyd resigned ostensibly over Fort Sumter policy. (C) [American
  Battlefield Trust](https://www.battlefields.org/learn/biographies/john-buchanan-floyd).
- **December 12, 1860** — Lewis Cass (Sec State, MI) resigns in protest
  of Buchanan's refusal to reinforce the Charleston forts. (C)
  [Smithsonian via earlier reference].
- **January 8, 1861** — Jacob Thompson (Sec Interior, MS) resigns "in
  anticipation of Mississippi's secession the following day." Thompson
  promptly tipped off Charleston about the *Star of the West* relief
  mission. (C) [Miller Center](https://millercenter.org/president/buchanan/essays/thompson-1857-secretary-of-the-interior).
- **January 9, 1861** — *Star of the West* fired upon and turned back at
  Charleston Harbor. (C)
- **South Carolina secedes December 20, 1860.** Six more by February 1.
- **CSA formed at Montgomery February 4, 1861.**
- **March 4, 1861** — Lincoln inauguration; full cabinet rotation.

**Cabinet expertise dependencies:**
- **All three Southern-sympathizer cabinet exits** are the load-bearing
  historical reality. The mechanic this should fire is **cabinet loyalty
  checks** — Treasury + Interior + War (and State) all simultaneously
  failed Buchanan. A *loyalty* attribute isn't currently in AMPU's data
  model; closest proxy is `factionId` cross-party (the Buchanan cabinet
  was all-Democratic but split BLUE-Southern vs BLUE-Unionist factions).
- **Sec Treasury** — `Economics` expertise. Cobb's resignation triggered
  a Treasury cash crisis (Buchanan had to borrow on personal terms). (C)
- **Sec War** — `Military` expertise. Floyd's pre-resignation cannon
  redistribution is the strongest single anti-loyalty case.
- **Sec Interior** — `Agriculture` expertise (per AMPU's existing
  `OFFICE_EXPERTISE`). Interior in 1861 actually handled Indian Affairs,
  Patent Office, Land Office, Pension Bureau — none of which mattered
  for the secession-leak question. Thompson's leak was politically
  motivated, not job-specific. (R) PM may want to override the Interior
  expertise check for this event.

**Trait dependencies:**
- President **Crisis Gov** → containment outcome (Lincoln's path).
- President **Passive** → Buchanan's actual outcome (full collapse).
- President **Iron Fist** → reinforced posture but historically Buchanan
  *failed* the Iron Fist test by not preempting the cannon shipment.
- Cabinet **Loyal** (existing in union) → if any Southern Sec carries
  Loyal, they stay; without it, they walk.
- Cabinet **Opportunist** (existing in union) → leaves earlier; takes
  intelligence with them.
- Cabinet **Traitor** (already in union as negative trait) — historically,
  Floyd, Thompson, and Cobb all carried what AMPU calls Traitor by Feb
  1861.

**Outcome shape recommendation:** **Banded (5 outcomes)** — this is the
event where outcome banding matters most. Very good (containment +
peaceful resolution) is historically counterfactual; good (Lincoln-style
containment + 4-year war); partial (Buchanan-style paralysis + 4-year
war as actual history); bad (cabinet defection + immediate confederate
control of federal property); very bad (cabinet defection + extended
peacefully-acknowledged secession). (I)

---

### 2.4 Trent Affair (November 8, 1861 - January 1, 1862)

**Existing AMPU event:** NO. Not in `eraEvents1856.ts`. PR6 introduces.

**Historical facts.** **November 8, 1861** — Captain Charles Wilkes,
commanding USS *San Jacinto*, intercepted the British mail packet
*Trent* in the Bahama Channel and seized Confederate commissioners
**James Mason** (en route to London) and **John Slidell** (en route to
Paris) by force. (C) Initial Northern jubilation. British government
issued an ultimatum demanding apology and release. Some 8,000 British
troops embarked for Canada in late November 1861. (C)
[History.gov state.gov Trent](https://history.state.gov/milestones/1861-1865/trent-affair),
[NPS](https://www.nps.gov/articles/000/the-trent-affair.htm).

**Resolution:** Cabinet meeting December 25-26 1861. Seward drafted the
release note **December 26, 1861**, dispatched **December 27**. Mason
and Slidell released **January 1, 1862**. No formal apology — Seward
framed Wilkes as having "erred in failing to bring the *Trent* into port
for adjudication," a face-saving formula. (C)

**Cabinet expertise dependencies:**
- **Secretary of State** — primary actor. Seward's `Foreign Affairs`
  expertise was the central determinant. A low-Foreign-Affairs SecState
  would have plausibly mishandled the British ultimatum (either by
  capitulating with apology, alienating Northern public opinion, or
  by refusing to release, triggering war). (R) Seward's pre-war
  reputation as the Anglophobe was itself a complication — his climb-down
  carried weight precisely *because* he was the hawk.
- **Sec War (Stanton, by 1862)** — secondary. The military preparation
  question (8,000 British troops in Canada).
- **Sec Navy (Welles)** — Wilkes's chain of command. Whether Welles
  endorsed or repudiated Wilkes was a domestic-politics question.

**Trait dependencies:**
- President **Delegator** → boost (Lincoln let Seward handle it; this is
  the cleanest Delegator-improves-outcome case in the brief).
- President **Micromanager** → degrade (Polk-style direct intervention
  would have been worse — Seward's diplomatic finesse required
  presidential silence).
- SecState **Crisis Gov** → improve.
- SecState **Domestic Apathy** → degrade.
- SecState **Iron Fist** → degrade (refusing release would have meant
  war).

**Outcome shape recommendation:** Ternary (good / partial / bad). Avoid
banding — the historical resolution is binary in effect (release or war
with UK), with the "partial" being apology-included-or-not as the third
choice.

---

### 2.5 — DEFERRED — Bleeding Kansas (1855-1859)

**Existing AMPU event:** YES. `eraEvents1856.ts:6-28`. `decider:
'president'`.

**Recommendation: DEFER from PR6.** Already exists. Wiring it through
PR6's cabinet expertise would mean retrofitting the existing event,
risking destabilizing the 2.4.3 era-event graph. Defer to a future PR.

If the PM does wire it: **Sec War + AG dependencies** (Cushing under
Pierce, Black under Buchanan); **President Iron Fist** worsens (sends
federal troops); **Crisis Gov** improves; **Naive Strategist SecWar**
mishandles the Free-State / pro-slavery militia confrontations.

---

### 2.6 — DEFERRED — Kansas-Nebraska Act Fallout (1854 ongoing)

**Recommendation: DEFER from PR6.** The Act itself predates the 1856
scenario start (signed May 30, 1854 — six months too early to be a
fireable scenario event). The fallout is structural background, not a
single resolvable event. Better modeled as a multi-turn meter drag in
the lingering phase.

---

## Section 3 — Conflict pair recommendations

| Trait pair | Recommendation | Rationale |
|------------|----------------|-----------|
| Decisive General ↔ Naive Strategist | **PAIR** | Clean A/B (Grant vs McClellan) |
| Delegator ↔ Micromanager | **PAIR** | Clean A/B (Lincoln vs Polk) |
| Domestic Warrior ↔ Domestic Apathy | **PAIR (re-use existing Domestic Apathy)** | Exact inverse; Domestic Apathy already in union |
| Master Kingmaker ↔ Outsider | **PAIR (re-use existing Outsider)** | Machine vs anti-machine; both already have election effects |
| Overeager ↔ Passive | **PAIR (re-use existing Passive)** | Behavioral mirror (acts too soon vs too late) |
| Crisis Admin ↔ ? | **STANDALONE** | No clean opposite in union; "panicked" doesn't exist as trait |
| Crisis Gov ↔ ? | **STANDALONE** | Could pair with Passive but Passive better pairs with Overeager; leave standalone |
| Iron Fist ↔ ? | **STANDALONE** | Reformist not the natural inverse; no clean opposite |

**Total new conflict pairs added to `TRAIT_CONFLICTS`:** 5 pairs × 2
directions = 10 entries (the 5 PAIR rows above). PR6 spec asked for 2-5
new conflict pairs; this lands at 5.

---

## Section 4 — Marquee CURATED_ROWS attributions

Per the spec template, 2-4 figures per trait. **Total: 27 figures**
across the 10 traits, leaning into figures already curated for AMPU.

| Trait | Founding-era figures | Antebellum-era figures |
|-------|----------------------|------------------------|
| **Crisis Admin** | Alexander Hamilton, Robert Morris, Albert Gallatin | Salmon P. Chase, Edwin Stanton (administrative) |
| **Crisis Gov** | George Washington (Whiskey 1794), John Adams (XYZ 1798) | Abraham Lincoln (1861), Stephen Douglas (1860 stump) |
| **Decisive General** | George Washington (Trenton/Princeton), Nathanael Greene, Andrew Jackson (New Orleans 1815) | Ulysses S. Grant, William T. Sherman, Stonewall Jackson (CSA) |
| **Naive Strategist** | Arthur St. Clair (Wabash 1791), William Hull (Detroit 1812), Horatio Gates (Camden 1780) | George McClellan, Ambrose Burnside, John Pope, John B. Floyd |
| **Domestic Warrior** | James Madison, Patrick Henry, Fisher Ames | John C. Calhoun, Henry Clay, Charles Sumner, Alexander Stephens |
| **Iron Fist** | George Washington (Whiskey), John Adams (Sedition), Andrew Jackson (1832-33, pre-scenario) | Abraham Lincoln (habeas), Edwin Stanton, James K. Polk |
| **Delegator** | George Washington (1789-97) | Abraham Lincoln (Team of Rivals), Zachary Taylor (1849-50) |
| **Micromanager** | John Adams (1797-1801), John Quincy Adams (1825-29) | James K. Polk (1845-49), Andrew Johnson (1865-69, post-scenario) |
| **Overeager** | Henry Clay (1812 War Hawk), Alexander Hamilton (1798 escalation) | Franklin Pierce (KS-NE 1854), Charles Wilkes (Trent 1861), James K. Polk (1846 declaration) |
| **Master Kingmaker** | Alexander Hamilton (1800), Aaron Burr (1800) | Henry Clay (1824), Martin Van Buren (Albany Regency / 1844 Polk dark-horse), Thurlow Weed, Stephen Douglas (1852 Pierce engineering) |

**Notes:**
- **Polk carries 3 traits** (Iron Fist, Micromanager, Overeager).
  Historically defensible per the Pinsker / Dickinson / Sellers
  analyses. (C, R)
- **Lincoln carries 3 traits** (Crisis Gov, Delegator, Iron Fist).
  The Iron Fist case is contested (Lincoln framed every use of authority
  as temporary war necessity). PM may scope to 2. (R)
- **Hamilton carries 3 traits** (Crisis Admin, Master Kingmaker,
  Overeager). All historically clean. (C)
- **Washington carries 3 traits** (Decisive General, Crisis Gov,
  Delegator, plus a borderline Iron Fist for Whiskey Rebellion).
  Over-attribution risk; PM may prune to Decisive General + Delegator
  to avoid Washington dominating every event. (I)
- **Stanton carries 2 traits** (Crisis Admin for administrative
  decisiveness, Iron Fist for press suppression). NOT Decisive General
  per the spec — Stanton wasn't a field commander. (I, deliberate
  correction of spec hint.)
- **Buchanan carries 2 traits** (Naive Strategist, **Passive** —
  existing trait, not new). The PR6 spec suggested "Iron Fist" for
  Buchanan on John Brown response, but Buchanan's *core* trait is
  Passive (the absence of decisive action). Recommend Buchanan
  = Passive + Naive Strategist; he may carry Iron Fist intermittently
  but the dominant signal is Passive. (I)

---

## Section 5 — Anachronism flags

| Trait | Code label | Display label recommendation | Era OK? |
|-------|-----------|------------------------------|---------|
| Crisis Admin | `Crisis Admin` | "Financier" or "Steady Hand" | term borderline (technocratic); concept fine both eras |
| Crisis Gov | `Crisis Gov` | "Steady Statesman" | term modern (abbrev "Gov." for governance); concept fine |
| Decisive General | `Decisive General` | (keep) | both eras fine |
| Naive Strategist | `Naive Strategist` | (keep) | both eras fine |
| Domestic Warrior | `Domestic Warrior` | "Domestic Champion" | "warrior" politically OK both eras; modern reads OK |
| Iron Fist | `Iron Fist` | (keep) | mid-19c phrase OK; both eras |
| Delegator | `Delegator` | "Hands-off" or "Cabinet Builder" | late-19c noun form; concept universally fine |
| Micromanager | `Micromanager` | "Hands-On" or "Personal Ruler" | 20c term; concept fine both eras |
| Overeager | `Overeager` | (keep) | both eras fine (English 1814+) |
| Master Kingmaker | `Master Kingmaker` | (keep) | 19c metaphorical political sense fine |

**Recommendation:** Keep code labels as-is for engine simplicity; add a
`DISPLAY_TRAIT_LABEL` map if/when era-appropriate UI is wanted. (I) PR4b
already accepted "Propagandist" as anachronism-borderline-OK on the same
principle.

---

## Section 6 — Era 1772 scope recommendation

**Recommendation: (a) PR6 scopes era-event routing to 1856 only; 1772
traits land in the union and on the 1772 dataset's CURATED_ROWS but are
NOT wired to events in PR6.** Reasons:

1. The 1772 era event roster sits inside the 2.4.3 graph (~49 nodes,
   `eraEvents1772.ts`), which is **scripted and counterfactual-aware** in
   a way the 1856 era events are not. Wiring expertise/trait routing
   into 2.4.3 means re-touching graph preconditions and may destabilize
   the spine/counterfactual probability balance (`ERA_GRAPH_RULES`).
2. The 1772 cabinet doesn't exist until 1789 (`cabinetSeatsForYear`
   returns `[]` for year < 1789). Most 1772-spine events (Gaspee through
   Lexington-Concord, 1772-1775) are pre-cabinet by 14-17 years.
3. The 1772 governance crises that *would* exercise these traits
   (Whiskey 1794, XYZ 1798, St. Clair 1791, Hull 1812) sit on or after
   the federalism-era cabinet but most are not currently represented as
   2.4.3 nodes.

**Compromise option (b) PR6 wires 1-2 1772 era events:** If the PM
wants 1772 scope, the cleanest hooks are:
- **Whiskey Rebellion (1794)** → President Crisis Gov / Iron Fist;
  SecWar Decisive General; SecTreasury Crisis Admin (Hamilton's tax was
  the trigger).
- **XYZ Affair (1798)** → President Crisis Gov; SecState Foreign Affairs
  expertise; Adams's Micromanager is the canonical anti-Delegator case.

Neither is currently a 2.4.3 graph node, so wiring would also mean
authoring 2 new graph entries. **Cost: ~2 days incremental.**

**My recommendation: ship (a) PR6.** Defer 1772 governance event wiring
to a follow-up PR sized for the graph-extension work.

---

## Section 7 — Cabinet expertise gating mechanism per event

Compressed reference:

| Event | Consulting Sec(s) | Expertise gate | Mechanism | Historical case |
|-------|-------------------|----------------|-----------|-----------------|
| Dred Scott (1857) | AG (primary), SecState (secondary) | `Justice` (AG), `Foreign Affairs` (SecState — minimal) | **Multiplier on meter swing** — high Justice expertise lets a "concerns expressed" response soften the domestic meter hit by 50% | Jeremiah Black's law training would have moderated the Buchanan letter to Grier — counterfactually. (R) |
| John Brown (1859) | SecWar (primary), AG (secondary) | `Military` (SecWar), `Justice` (AG) | **Both** — Military expertise → faster response shape; Justice expertise → federal-vs-state framing | Floyd's low Military expertise (politician, not soldier) made the Lee dispatch the only good outcome. (R) |
| Secession Winter (1860-61) | Treasury, Interior, War, State (all four) | `Economics` (Treasury), `Military` (SecWar), `Foreign Affairs` (SecState); **Interior expertise should be overridden** for this event since the loyalty question is non-portfolio | **Loyalty check** (faction + cross-party + ideology proxy for slavery position) → multi-cabinet defection result | The Cobb/Floyd/Thompson/Cass quad is the canonical disloyal-cabinet case. (C) |
| Trent Affair (1861) | SecState (primary), SecNavy (secondary, chain of command) | `Foreign Affairs` (SecState), `Naval` (SecNavy) | **Multiplier on meter swing + log voice shift** — high Foreign Affairs expertise produces the Seward December 26 climb-down framing; low expertise produces apology + Northern outrage OR refusal + UK war | Seward's high Foreign Affairs expertise (career diplomatist + NY Senator) is the load-bearing reason war was avoided. (C) |

**My structural recommendation:** Multiplier on meter swing AND log
voice shift for **Trent Affair only** — that event has unusually
language-rich historical resolution (Seward's note framing). For the
other three, multiplier-only is sufficient. (I)

---

## Section 8 — Delegator / Micromanager mechanism check

**Both PM-proposed directional rules are historically correct.**

- **Delegator (Lincoln, Washington)** → cabinet effects matter MORE.
  Lincoln's wartime effectiveness sat on Seward's diplomacy, Chase's
  finance, Stanton's logistics. Washington's first-term sat on
  Hamilton's finance / Jefferson's diplomacy. Both presidents' personal
  intervention was *less* than the magnitude of their cabinet outputs.
  (C, I)
- **Micromanager (Polk, Adams 1798)** → cabinet effects matter LESS,
  president stats matter MORE. Polk's diary documents his personal
  decision-making on every department's work. Adams's 1798 negotiation
  of the Convention of 1800 with France was executed over the express
  objection of his Federalist cabinet. (C, I)

**Caveat the PM should know:** The *historical magnitudes are
asymmetric*. Delegator helps a president with a great cabinet a lot
(Lincoln) but hurts a president with a poor cabinet (Buchanan would
have been *worse* as a Delegator with Cobb-Floyd-Thompson). Micromanager
helps a president with poor cabinet (Polk's micro-Buchanan was probably
the right call for the Mexican War) but cripples a president with a
great cabinet (counterfactually: a micromanager Lincoln would have
broken Seward's Trent climb-down). (I) The multiplier mechanism captures
the directional logic; the asymmetry is a downstream balance question
for the PM.

---

## Section 9 — Open questions for the PM

1. **Which 4-6 era events to wire?** Recommendation: 4 events — Dred
   Scott (modify existing), John Brown (modify existing), Secession
   Winter (new, distinct from existing 1860 secession threat event),
   Trent Affair (new). Defer Bleeding Kansas (existing, retrofit risk)
   and KS-NE Act fallout (not a single resolvable event).
2. **Cabinet expertise: multiplier or log-voice or both?** Recommend
   multiplier on swing for all; log-voice shift only for Trent Affair
   where Seward's framing is part of the historical fact.
3. **Trait magnitude bands: reuse PR4a's 2/4/8 or new governance
   bands?** I have no view; this is a balance question. The historical
   asymmetry is real (Crisis Gov + Lincoln in 1861 is a much larger
   effect than Crisis Gov + Cleveland in 1893), so PM may want
   governance bands different from election bands.
4. **1772 era scope?** Recommend (a) — 1856 event routing only; 1772
   traits land in union + dataset but unwired this PR.
5. **Overeager's gameplay hook — lower threshold, flat flavor, or
   logged-only?** Historical anchor is Pierce signing KS-NE despite his
   own warnings — that's a *threshold-lowering* effect, not flavor.
   Recommend threshold-lowering on governance_crisis fire chance.
6. **Master Kingmaker's gameplay hook — faction-leader install, primary
   dark-horse, both?** Historical anchor is Van Buren (Polk dark horse
   1844) + Clay (1824 corrupt bargain). Both hooks are historically
   warranted; recommend wiring BOTH if PR6 budget allows, or
   faction-leader install only as MVP.
7. **Buchanan's trait stack** — recommend **Passive + Naive Strategist**
   (drop Iron Fist for Buchanan; he was the anti-Iron-Fist). This
   contradicts the PR6 spec's "Buchanan = Naive Strategist + Iron Fist"
   suggestion.
8. **Lincoln's trait stack** — Iron Fist is contested. Recommend
   Crisis Gov + Delegator as core; PM optional Iron Fist.
9. **Crisis Manager vs new Crisis Admin / Crisis Gov** — the existing
   trait union has **Crisis Manager** as a positive trait already used
   in `MORTALITY_RULES` (death rate multiplier). Recommend Crisis Manager
   becomes the umbrella tag granting both old-age mortality benefit AND
   small `governance_crisis` benefit; Crisis Admin / Crisis Gov are the
   specialized expertise-conditioned forks granting LARGE benefit. PM
   to confirm.
10. **Conflict pair total** — recommended 5 new pairs (DG↔NS, D↔M,
    DW↔DA, MK↔O, OE↔P). Three reuse existing-union negatives (Domestic
    Apathy, Outsider, Passive), so adding 5 new traits with 2 standalone
    + 3 reuse leaves Crisis Admin, Crisis Gov, Iron Fist standalone.

---

## Section 10 — Things I couldn't ground

- **Domestic-Warrior magnitude on lingering_phase domestic meter
  drift.** No clean historical case where the trait alone produced a
  measurable meter shift over a 2-year window — Calhoun and Clay both
  operated in years dominated by other shocks. PM should treat the
  +MEDIUM directional as a designer's guess, not a historical bind. (I)
- **Master Kingmaker's exact magnitude on `internal_party`.** The
  spec's existing `KINGMAKER_RULES` (Backroom track gating, command
  cap) is internally consistent but doesn't decompose into the LARGE/
  MEDIUM/SMALL bands cleanly. PM may want to keep Master Kingmaker as a
  *separate* gating mechanism rather than a magnitude on
  `internal_party`.
- **Overeager's threshold-lowering numeric.** I can confirm Pierce
  signed KS-NE despite forecasting catastrophe; the exact percentile of
  "threshold lowered" is a balance question, not a historical one.
- **Cabinet loyalty mechanism for Secession Winter** — AMPU doesn't
  currently model a "loyalty" attribute on cabinet members. Closest
  proxies are `factionId` cross-party and ideology bucket. PM call
  whether to add explicit loyalty or read existing proxies.
- **Slavery-position attribute** for the John Brown raid event. AMPU
  doesn't carry an explicit slavery flag on politicians. Closest proxies:
  ideology + faction. PM may want explicit slavery position for the
  1856 scenario specifically.

---

## Citations (consulted sources, ordered by importance)

1. [NY Fed — Hamilton 1792 crisis management](https://libertystreeteconomics.newyorkfed.org/2014/05/crisis-chronicles-central-bank-crisis-management-during-wall-streets-first-crash-1792/) — Crisis Admin anchor for 1772 era
2. [Smithsonian — Buchanan / Catron / Grier letters](https://www.smithsonianmag.com/smart-news/president-james-buchanan-directly-influenced-outcome-dred-scott-decision-180962329/) — Dred Scott event
3. [Miller Center — John B. Floyd biography](https://millercenter.org/president/buchanan/essays/floyd-1857-secretary-of-war) — Naive Strategist + Iron Fist case + Secession Winter
4. [Miller Center — Howell Cobb biography](https://millercenter.org/president/buchanan/essays/cobb-1857-secretary-of-the-treasury) — Secession Winter
5. [Miller Center — Jacob Thompson biography](https://millercenter.org/president/buchanan/essays/thompson-1857-secretary-of-the-interior) — Secession Winter; Star of the West leak
6. [NPS — Trent Affair](https://www.nps.gov/articles/000/the-trent-affair.htm) — Trent Affair event
7. [history.state.gov — Trent Affair](https://history.state.gov/milestones/1861-1865/trent-affair) — Trent Affair, Seward note
8. [American Battlefield Trust — Peninsula Campaign analysis](https://www.battlefields.org/learn/articles/peninsula-campaign-mcclellans-strategic-masterstroke-and-tactical-blunder) — McClellan / Naive Strategist
9. [LOC — Lincoln Team of Rivals exhibit](https://www.loc.gov/exhibits/lincoln/a-team-of-rivals.html) — Delegator anchor
10. [White House Historical Assn — Lincoln's Cabinet](https://www.whitehousehistory.org/abraham-lincolns-cabinet) — Delegator anchor
11. [Dickinson — Polk's diary and Mexican War](https://blogs.dickinson.edu/hist-282pinsker/2017/02/14/polks-diary-and-the-war-with-mexico/) — Micromanager + Iron Fist anchor
12. [Britannica — Nullification Crisis](https://www.britannica.com/topic/Nullification-Crisis) — Iron Fist + Domestic Warrior (Calhoun)
13. [US Senate — Calhoun VP profile](https://www.senate.gov/about/officers-staff/vice-president/VP_John_Calhoun.htm) — Domestic Warrior
14. [Bill of Rights Institute — Corrupt Bargain 1824](https://billofrightsinstitute.org/essays/the-corrupt-bargain/) — Master Kingmaker (Clay)
15. [Constitution Center — Van Buren legacy](https://constitutioncenter.org/blog/martin-van-burens-legacy-was-more-than-just-muttonchops-2) — Master Kingmaker (Van Buren)
16. [Treasury — Salmon Chase tenure](https://home.treasury.gov/about/history/prior-secretaries/salmon-p-chase-1861-1864) — Crisis Admin (Chase)
17. [Mount Vernon — Robert Morris](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/robert-morris) — Crisis Admin 1772
18. [Army.mil — St. Clair's Campaign 1791](https://www.army.mil/article/65594/st_clairs_campaign_of_1791_a_defeat_in_the_wilderness_that_helped_forge_todays_u_s_army) — Naive Strategist 1772
19. [History.com — Hull surrender 1812](https://www.history.com/this-day-in-history/august-16/detroit-surrenders-without-a-fight) — Naive Strategist 1772
20. [Britannica — Ex parte Merryman](https://www.britannica.com/event/Ex-Parte-Merryman) — Iron Fist (Lincoln habeas)
21. [Miller Center — Pierce Key Events](https://millercenter.org/president/franklin-pierce/key-events) — Overeager (Pierce KS-NE)
22. [Miller Center — Buchanan Key Events](https://millercenter.org/president/james-buchanan/key-events) — Crisis Gov anti-case
23. [NBER — Sylla on Panic of 1792](https://users.nber.org/~confer/2006/si2006/dae/sylla.pdf) — Crisis Admin (Hamilton)
24. [Encyclopedia Virginia — Floyd entry](https://encyclopediavirginia.org/entries/floyd-john-b-1806-1863/) — Naive Strategist + Secession Winter
25. [Albany Regency — Wikipedia (orientation only)](https://en.wikipedia.org/wiki/Albany_Regency) — Master Kingmaker
