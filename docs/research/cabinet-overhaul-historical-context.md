# Historical Context — Cabinet Overhaul (PR5)

**Audience:** PM authoring CP1 specs for the era-conditional, expertise-aware
cabinet overhaul. Covers both AMPU scenarios.
**Status:** Research brief. Historical ground truth, not mechanic design.

> Confidence levels used below:
> **(C)** consensus history (still cited where the specific date/number/vote
> matters); **(R)** contested but defensible; **(I)** my synthesis / inference.

The AMPU `Expertise` union actually shipped (per `src/types.ts:162`) is
**`Agriculture, Business, Economics, Education, Energy, Environment, Foreign
Affairs, Healthcare, Housing, Justice, Labor, Media, Military, Naval, Science,
Technology, Trade, Transportation, Welfare`**. The PR5 spec text listed an
older, hypothetical set (`Diplomacy / Finance / Reform / Industry / Slavery /
Commerce / Domestic / Law / Administration`). **All expertise recommendations
below use the SHIPPED union.** The existing `OFFICE_EXPERTISE` table at
`src/types.ts:944` already maps State→Foreign Affairs, Treasury→Economics,
War→Military, AG→Justice, GeneralInChief→Military, Admiral→Naval. PR5
expertise recommendations build on this.

---

## Era window

Two AMPU scenarios; both span the **entire pre-cabinet-reform window**:

- **1772 scenario** (`scenarioId: '1772'`, era `'independence'` → `'federalism'`):
  Continental Congress, Revolution, ratification (1788), Washington admin
  (1789) through approximately 1820. **This scenario starts BEFORE the
  cabinet exists at all** — the cabinet system is born inside the scenario
  with the Constitution.
- **1856 scenario** (`scenarioId: '1856'`, era `'nationalism'`): starts
  Buchanan-era cabinet (1857 baseline), runs through Civil War, Reconstruction,
  and into early Gilded Age. Player will see the Lincoln 1861 cabinet
  re-formation mid-game.

Key cabinet-structural inflection dates that bound any era-conditional spec:

| Date | Event | Cite |
|------|-------|------|
| 1789-07-27 | Department of Foreign Affairs (→ State) created | [state.gov](https://www.state.gov/former-secretaries-of-state) |
| 1789-09-11 | Hamilton sworn as first Treasury Sec (department created Sept 2) | [home.treasury.gov](https://home.treasury.gov/about/history/prior-secretaries/alexander-hamilton-1789-1795) |
| 1789-09-24 | Judiciary Act creates Attorney General position | [justice.gov](https://www.justice.gov/ag/bio/randolph-edmund-jennings) |
| 1789-09-26 | Samuel Osgood appointed first Postmaster General (Post Office sat inside Treasury, NOT cabinet rank) | [USPS](https://about.usps.com/who/profile/history/pdf/pmg-osgood.pdf) |
| 1798-04-30 | Department of the Navy created (Stoddert sworn 18-21 May) | [navy.mil](https://www.history.navy.mil/browse-by-topic/commemorations-toolkits/navy-birthday/OriginsNavy/the-establishment-of-the-department-of-the-navy.html) |
| 1829-03-09 | Jackson elevates Postmaster General to cabinet rank (Barry) | [USPS](https://about.usps.com/who/profile/history/pdf/pmg-barry.pdf) |
| 1849-03-03 | Department of the Interior created (Polk signs lame-duck day before leaving) | [DOI](https://www.doi.gov/about/history) |
| 1849-03-08 | Ewing sworn as first Interior Sec under Taylor | [Miller Center](https://millercenter.org/president/taylor/essays/ewing-1849-secretary-of-the-interior) |
| 1862-07-16 | Congress creates rear admiral rank for Farragut — FIRST US admiral of any kind | [Defense Media Network](https://www.defensemedianetwork.com/stories/civil-war-naval-hero-was-the-navy%E2%80%99s-first-admiral/) |
| 1870-06-22 | Act creating Department of Justice; AG becomes department head (no department under them before this) | [justice.gov](https://www.justice.gov/ag/bio/randolph-edmund-jennings) |

These dates are the binding scaffolding for any era-conditional table.

---

## 1. Per-seat history

### Secretary of State

**Founded:** July 27, 1789, as Secretary of Foreign Affairs; renamed
Department of State by act of Sept 15, 1789. Thomas Jefferson sworn
1790-03-22 ([state.gov](https://www.state.gov/former-secretaries-of-state)).

**Portfolio:** Diplomatic relations (treaty negotiation + ambassadorial
network), territorial expansion via diplomacy (Louisiana, Florida, Texas,
Oregon, Alaska — all routed through State, not War), domestic
proclamation of laws, custody of the Great Seal, passport issuance.
In the pre-1850 era State was also the **default heir-apparent post**:
five of the first six Secretaries (Jefferson, Madison, Monroe, JQ Adams,
Van Buren — Adams's son John Quincy excepted in non-VP sequence) ascended
to the presidency from State or via State. (C)

**Tenures, 1789–1869** (each from
[history.state.gov](https://history.state.gov/departmenthistory/people/principalofficers/secretary)
and [state.gov](https://www.state.gov/former-secretaries-of-state)):

- Thomas Jefferson, VA, 1790-03-22 to 1793-12-31 (Washington)
- Edmund Randolph, VA, 1794-01-02 to 1795-08-20 (Washington)
- Timothy Pickering, MA/PA, 1795-12-10 (acting from Aug) to 1800-05-12 (Washington, Adams; FIRED by Adams)
- John Marshall, VA, 1800-06-13 to 1801-02-04 (Adams; later Chief Justice)
- James Madison, VA, 1801-05-02 to 1809-03-03 (Jefferson)
- Robert Smith, MD, 1809-03-06 to 1811-04-01 (Madison; politically weak, replaced)
- James Monroe, VA, 1811-04-06 to 1817-03-03 (Madison; also acting Sec of War 1814-15)
- John Quincy Adams, MA, 1817-09-22 to 1825-03-03 (Monroe) — widely rated greatest Sec of State ever ([Britannica](https://www.britannica.com/biography/John-Quincy-Adams); negotiated Adams-Onís 1819, ghost-wrote Monroe Doctrine 1823) (C)
- Henry Clay, KY, 1825-03-07 to 1829-03-03 (JQ Adams; the "Corrupt Bargain" appointment)
- Martin Van Buren, NY, 1829-03-28 to 1831-03-23 (Jackson)
- Edward Livingston, LA, 1831-05-24 to 1833-05-29 (Jackson)
- Louis McLane, DE, 1833-05-29 to 1834-06-30 (Jackson)
- John Forsyth, GA, 1834-07-01 to 1841-03-03 (Jackson, Van Buren)
- Daniel Webster, MA, 1841-03-06 to 1843-05-08 (Harrison, Tyler) — Webster-Ashburton Treaty 1842-08-09 ([state.gov](https://history.state.gov/milestones/1830-1860/webster-treaty))
- Abel P. Upshur, VA, 1843-07-24 to 1844-02-28 (Tyler; killed by Princeton gun explosion)
- John C. Calhoun, SC, 1844-04-01 to 1845-03-10 (Tyler; pushed Texas annexation)
- James Buchanan, PA, 1845-03-10 to 1849-03-07 (Polk; later President)
- John M. Clayton, DE, 1849-03-08 to 1850-07-22 (Taylor; Clayton-Bulwer Treaty)
- Daniel Webster (again), 1850-07-23 to 1852-10-24 (Fillmore; died in office)
- Edward Everett, MA, 1852-11-06 to 1853-03-03 (Fillmore)
- William L. Marcy, NY, 1853-03-08 to 1857-03-06 (Pierce; Gadsden Purchase 1853 routed via Marcy's department)
- Lewis Cass, MI, 1857-03-06 to 1860-12-12 (Buchanan; resigned over Buchanan's secession-crisis passivity)
- Jeremiah S. Black, PA, 1860-12-17 to 1861-03-05 (Buchanan)
- William H. Seward, NY, 1861-03-06 to 1869-03-04 (Lincoln, A. Johnson) — Trent Affair de-escalation 1861; Alaska Purchase 1867 for $7.2M ([Britannica](https://www.britannica.com/biography/William-H-Seward))

**Great vs bad picks (historian flags):**

- **Great** by track record: Jefferson, JQ Adams, Webster, Seward — each
  delivered a treaty or doctrine that became a national-frame event.
  (C) Common diplo trait stack: foreign-language facility, prior
  ambassadorial posting (JQA: Netherlands/Prussia/Russia/UK), deep
  congressional experience for the ratification fight.
- **Patronage / political picks:** Henry Clay 1825 (the "Corrupt Bargain"
  — appointed to neutralize him as 1828 rival; toxic to JQA's
  presidency) (C); Robert Smith 1809 (Madison forced to take him as
  a Senate-appeasing concession after Gallatin was blocked from State);
  Edward Livingston 1831 (regional balancing).
- **Influential but disastrous:** Calhoun 1844-45 (used State purely as
  pro-slavery Texas-annexation lever; deepened sectional crisis). (R)

### Secretary of Treasury

**Founded:** Sept 2, 1789. Hamilton sworn 1789-09-11
([home.treasury.gov](https://home.treasury.gov/about/history/prior-secretaries/alexander-hamilton-1789-1795)).

**Portfolio:** Public credit, debt management, customs and excise
collection (the only significant federal revenue source pre-1862),
coinage and (after 1862) currency issuance, federal payroll, oversight
of the national bank (1791-1811, 1816-1836) when one existed,
infrastructure recommendations (Gallatin's 1808 road/canal report).
**Until the Post Office split off in 1829, the Postmaster reported up
through Treasury.** ([USPS / Britannica](https://www.britannica.com/topic/United-States-Postal-Service))

**Tenures, 1789–1864:**

- Alexander Hamilton, NY, 1789-09-11 to 1795-01-31 (Washington) — debt
  assumption ($75M war debt), customs system, First Bank 1791
  ([home.treasury.gov](https://home.treasury.gov/about/history/prior-secretaries/alexander-hamilton-1789-1795)) (C)
- Oliver Wolcott Jr., CT, 1795-02-02 to 1800-12-31 (Washington, Adams)
- Samuel Dexter, MA, 1801-01-01 to 1801-05-13 (Adams, briefly Jefferson)
- Albert Gallatin, PA, 1801-05-14 to 1814-02-08 (Jefferson, Madison) —
  longest-serving Treasury Sec in history at ~13 years; reduced debt
  by $23M in 8 years despite Louisiana Purchase
  ([Miller Center](https://millercenter.org/president/jefferson/essays/gallatin-1801-albert-secretary-of-the-treasury);
  [home.treasury.gov](https://home.treasury.gov/north-plaza-gallatin-statue)) (C)
- George Campbell, TN, 1814-02-09 to 1814-09-26 (Madison)
- Alexander Dallas, PA, 1814-10-14 to 1816-10-21 (Madison; chartered Second Bank 1816)
- William H. Crawford, GA, 1816-10-22 to 1825-03-06 (Madison, Monroe; 1824 presidential candidate)
- Richard Rush, PA, 1825-03-07 to 1829-03-05 (JQ Adams)
- Samuel D. Ingham, PA, 1829-03-06 to 1831-06-20 (Jackson)
- Louis McLane, DE, 1831-08-08 to 1833-05-28 (Jackson; moved to State)
- William J. Duane, PA, 1833-05-29 to 1833-09-22 (Jackson; FIRED for refusing to remove deposits from Second Bank)
- Roger B. Taney, MD, 1833-09-23 (recess) to 1834-06-25 (Jackson) —
  **first cabinet nominee formally rejected by Senate, 18-28, on
  1834-06-24** ([senate.gov](https://www.senate.gov/about/powers-procedures/nominations/first-cabinet-rejection.htm)) (C)
- Levi Woodbury, NH, 1834-07-01 to 1841-03-03 (Jackson, Van Buren)
- Thomas Ewing, OH, 1841-03-05 to 1841-09-11 (Harrison, Tyler; resigned in Whig cabinet revolt)
- Walter Forward, PA, 1841-09-13 to 1843-03-01 (Tyler)
- John C. Spencer, NY, 1843-03-08 to 1844-05-02 (Tyler)
- George M. Bibb, KY, 1844-07-04 to 1845-03-07 (Tyler)
- Robert J. Walker, MS, 1845-03-08 to 1849-03-05 (Polk; Walker Tariff 1846)
- William M. Meredith, PA, 1849-03-08 to 1850-07-22 (Taylor)
- Thomas Corwin, OH, 1850-07-23 to 1853-03-06 (Fillmore)
- James Guthrie, KY, 1853-03-07 to 1857-03-06 (Pierce)
- Howell Cobb, GA, 1857-03-07 to 1860-12-08 (Buchanan; resigned to lead Georgia into secession,
  [Miller Center](https://millercenter.org/president/buchanan/essays/cobb-1857-secretary-of-the-treasury))
- Philip F. Thomas, MD, 1860-12-12 to 1861-01-14 (Buchanan)
- John A. Dix, NY, 1861-01-15 to 1861-03-06 (Buchanan; famous "shoot him on the spot" order)
- Salmon P. Chase, OH, 1861-03-07 to 1864-06-30 (Lincoln) — Legal
  Tender Act 1862, greenbacks, National Banking Act 1863
  ([home.treasury.gov](https://home.treasury.gov/about/history/prior-secretaries/salmon-p-chase-1861-1864)) (C)

**Great vs bad picks:**

- **Marquee expertise picks:** Hamilton (designed the system); Gallatin
  (numerical mastery); Chase (rebuilt wartime finance, founded the
  Bureau of Engraving and Printing) (C).
- **Cautionary tales:** Cobb and Thomas under Buchanan presided over a
  collapsing Treasury during secession and resigned to join the
  Confederacy ([American Heritage](https://www.americanheritage.com/corruption-and-treason-buchanan-cabinet)) (C).
- **Pure patronage:** Duane was fired specifically because he wouldn't
  obey Jackson on bank deposits; Taney replaced him in a recess
  appointment. The 1833-34 Treasury sequence is the canonical case of
  the seat being weaponized to executive will (C).

### Secretary of War (1789–1947)

**Founded:** Aug 7, 1789. Knox sworn 1789-09-12; carried over from his
Confederation-era role as Secretary at War.

**Portfolio:** Standing army administration, frontier garrison logistics,
fortifications, **Indian affairs and removal** (Bureau of Indian
Affairs created under Calhoun 1824 and stayed in War Dept until moved
to Interior 1849), West Point operations, militia coordination, war
prosecution when declared. Pre-1798 also handled naval matters; after
1798 the Navy split to its own department. Pre-1849 also handled
public-lands and patents.

**Tenures, 1789–1869:**

- Henry Knox, MA, 1789-09-12 to 1794-12-31 (Washington) — humane-language
  Indian policy; built West Point precursor
  ([Miller Center](https://millercenter.org/president/washington/essays/knox-1789-secretary-of-war)) (C)
- Timothy Pickering, MA, 1795-01-02 to 1795-12-10 (Washington; moved to State)
- James McHenry, MD, 1796-01-27 to 1800-05-13 (Washington, Adams; fired)
- Samuel Dexter, MA, 1800-05-13 to 1801-01-31 (Adams; doubled with Treasury)
- Henry Dearborn, MA, 1801-03-05 to 1809-03-07 (Jefferson)
- William Eustis, MA, 1809-03-07 to 1813-01-13 (Madison; failed early War of 1812 admin)
- John Armstrong Jr., NY, 1813-02-05 to 1814-09-27 (Madison; resigned after Washington burned)
- James Monroe (interim), VA, 1814-09-27 to 1815-03-02 (Madison; concurrent State)
- William H. Crawford, GA, 1815-08-08 to 1816-10-22 (Madison; moved to Treasury)
- John C. Calhoun, SC, 1817-10-08 to 1825-03-07 (Monroe) — **the
  reorganizing genius**: bureau system, expansible-army doctrine,
  debt down from $45M to $3M, Bureau of Indian Affairs 1824, West
  Point reforms
  ([Miller Center](https://millercenter.org/president/monroe/essays/calhoun-1817-secretary-of-war)) (C)
- James Barbour, VA, 1825-03-07 to 1828-05-23 (JQ Adams)
- Peter B. Porter, NY, 1828-05-26 to 1829-03-09 (JQ Adams)
- John Eaton, TN, 1829-03-09 to 1831-06-18 (Jackson; Petticoat Affair)
- Lewis Cass, OH/MI, 1831-08-01 to 1836-10-05 (Jackson) — Black Hawk War,
  Seminole Wars, Indian removal implementation, Trail of Tears
  ([Britannica](https://www.britannica.com/biography/Lewis-Cass)) (C)
- Benjamin Butler (acting), NY, 1836-10-05 to 1837-03-07 (Jackson)
- Joel Poinsett, SC, 1837-03-07 to 1841-03-05 (Van Buren) — Second Seminole War prosecution
- John Bell, TN, 1841-03-05 to 1841-09-13 (Harrison, Tyler; resigned in Whig revolt)
- John C. Spencer, NY, 1841-10-12 to 1843-03-03 (Tyler; moved to Treasury)
- James M. Porter, PA, 1843-03-08 to 1844-02-15 (Tyler; Senate refused to confirm — recess appointee)
- William Wilkins, PA, 1844-02-15 to 1845-03-04 (Tyler)
- William L. Marcy, NY, 1845-03-08 to 1849-03-04 (Polk; Mexican War management)
- George W. Crawford, GA, 1849-03-08 to 1850-07-23 (Taylor)
- Charles M. Conrad, LA, 1850-08-15 to 1853-03-07 (Fillmore)
- Jefferson Davis, MS, 1853-03-07 to 1857-03-06 (Pierce) — **rated
  "most active and effective secretary of war since the 1820s"**:
  doubled regular army to four regiments, minié ball adoption, Pacific
  RR surveys, Camel Corps
  ([Miller Center](https://millercenter.org/president/pierce/essays/davis-1853-jefferson-secretary-of-war)) (C)
- John B. Floyd, VA, 1857-03-06 to 1860-12-29 (Buchanan) — resigned
  amid arms-transfer-to-South allegations
  ([Britannica](https://www.britannica.com/biography/John-Buchanan-Floyd)) (R: contemporary "treason" framing
  contested by modern historians, but the resignation was forced over
  contractor-draft scandal)
- Joseph Holt, KY, 1861-01-18 to 1861-03-05 (Buchanan; Unionist holdover)
- Simon Cameron, PA, 1861-03-05 to 1862-01-14 (Lincoln; **fired for
  graft and Russia-posting as diplomatic dump**, per
  [White House Historical](https://www.whitehousehistory.org/abraham-lincolns-cabinet))
- Edwin M. Stanton, OH, 1862-01-20 to 1868-05-28 (Lincoln, A. Johnson) —
  reorganized War Dept, seized telegraph network, eradicated graft
  ([Miller Center](https://millercenter.org/president/johnson/essays/stanton-1865-secretary-of-war);
  [History.com](https://www.history.com/articles/edwin-m-stanton)) (C)

**Great vs bad picks:**

- **Marquee expertise picks** (Military + Admin): Knox, Calhoun, Davis,
  Stanton. All four ran the army at high competence in distinct contexts
  (founding, reorganization, expansion, total war). Notable that none
  of the four "great" War Secs were primarily soldiers — they were
  administrators with strategic vision.
- **Patronage / disaster:** Eustis 1809 (incompetent during War of 1812
  buildup); Cameron 1861 (graft, pushed out within 10 months).
- **Politically loaded:** Eaton 1829 (Petticoat Affair forced him out);
  Floyd 1857-60 (Southern partisan whose tenure ended in the contractor
  scandal). (C)

### Secretary of the Navy (1798–1947)

**Founded:** April 30, 1798. Benjamin Stoddert nominated by Adams
1798-05-18, confirmed three days later
([navy.mil](https://www.history.navy.mil/browse-by-topic/commemorations-toolkits/navy-birthday/OriginsNavy/the-establishment-of-the-department-of-the-navy.html)).
**This means in the 1772 AMPU scenario, the Navy seat does not exist
before 1798 — the War Sec covered naval administration in the years 1789–1798.**

**Portfolio:** Naval administration, shipbuilding programs, ports and
yards, blockades when at war, naval expeditions (Stoddert: Quasi-War
with France 1798-1800; Welles: Anaconda Plan blockade).

**Tenures, 1798–1869:**

- Benjamin Stoddert, MD, 1798-06-18 to 1801-03-31 (Adams, Jefferson) —
  Quasi-War prosecution; created officer corps from scratch
- Robert Smith, MD, 1801-07-27 to 1809-03-07 (Jefferson; later State)
- Paul Hamilton, SC, 1809-05-15 to 1812-12-31 (Madison)
- William Jones, PA, 1813-01-19 to 1814-12-01 (Madison; double-hatted Treasury)
- Benjamin Crowninshield, MA, 1815-01-16 to 1818-10-01 (Madison, Monroe)
- Smith Thompson, NY, 1819-01-01 to 1823-08-31 (Monroe)
- Samuel L. Southard, NJ, 1823-09-16 to 1829-03-03 (Monroe, JQ Adams)
- John Branch, NC, 1829-03-09 to 1831-05-12 (Jackson; Petticoat Affair casualty)
- Levi Woodbury, NH, 1831-05-23 to 1834-06-30 (Jackson; later Treasury)
- Mahlon Dickerson, NJ, 1834-06-30 to 1838-06-30 (Jackson, Van Buren)
- James Paulding, NY, 1838-07-01 to 1841-03-03 (Van Buren)
- George Badger, NC, 1841-03-06 to 1841-09-11 (Harrison, Tyler; Whig revolt)
- Abel P. Upshur, VA, 1841-10-11 to 1843-07-23 (Tyler; later State)
- David Henshaw, MA, 1843-07-24 to 1844-02-18 (Tyler; recess, rejected)
- Thomas Gilmer, VA, 1844-02-19 to 1844-02-28 (Tyler; killed on Princeton)
- John Y. Mason, VA, 1844-03-26 to 1845-03-10 (Tyler)
- George Bancroft, MA, 1845-03-11 to 1846-09-09 (Polk; founded Naval Academy 1845)
- John Y. Mason (again), 1846-09-10 to 1849-03-07 (Polk)
- William B. Preston, VA, 1849-03-08 to 1850-07-22 (Taylor)
- William A. Graham, NC, 1850-08-02 to 1852-07-25 (Fillmore)
- John P. Kennedy, MD, 1852-07-26 to 1853-03-07 (Fillmore)
- James C. Dobbin, NC, 1853-03-08 to 1857-03-06 (Pierce; major mid-1850s naval expansion)
- Isaac Toucey, CT, 1857-03-06 to 1861-03-06 (Buchanan; allegations of pro-South ship-scattering)
- Gideon Welles, CT, 1861-03-07 to 1869-03-04 (Lincoln, A. Johnson) —
  **Navy grew ~10× during war; ironclads; blockade**
  ([Britannica](https://www.britannica.com/biography/Gideon-Welles);
  [American Battlefield Trust](https://www.battlefields.org/learn/biographies/gideon-welles)) (C)

**Great vs bad picks:**

- **Marquee picks** (Naval + Admin): Stoddert (built the institution),
  Bancroft (founded Annapolis), Welles ("Lincoln's Neptune"; Anaconda).
- **Patronage / regional balance picks**: most antebellum Navy Secs
  were drawn from coastal states (MD, MA, NY, NC, VA, NJ) but the seat
  was rarely strategically central; it was often a regional consolation
  prize. (I)
- **Tainted:** Toucey 1857-61 (faced congressional inquiry over allegedly
  dispersing US ships to weaken Northern position pre-secession). (R)

### Attorney General (1789–)

**Founded:** Sept 24, 1789, by the Judiciary Act. Randolph appointed
1789-09-26
([justice.gov](https://www.justice.gov/ag/bio/randolph-edmund-jennings)).

**Crucial distinction — historian flag:** Until **1870-06-22** (Act to
Establish the Department of Justice), there was **no Department of
Justice**. The AG was the President's lawyer and Supreme Court advocate,
not a department head. There was "no provision for a Department of
Justice or even for subsidiary officers or clerical staff" pre-1870
([justice.gov](https://www.justice.gov/ag/bio/randolph-edmund-jennings)).
This means the "admin" skill is **less load-bearing for AG pre-1870**
than for any other cabinet seat — the AG ran a one-man legal office,
not a department.

**Tenures, 1789–1869 (abbreviated):**

- Edmund Randolph, VA, 1789-09-26 to 1794-01-26
- William Bradford, PA, 1794-01-28 to 1795-08-23
- Charles Lee, VA, 1795-12-10 to 1801-03-04
- Levi Lincoln, MA, 1801-03-05 to 1804-12-31
- John Breckinridge, KY, 1805-08-07 to 1806-12-14
- Caesar Rodney, DE, 1807-01-20 to 1811-12-05
- William Pinkney, MD, 1811-12-11 to 1814-02-10
- Richard Rush, PA, 1814-02-10 to 1817-10-30 (later Treasury)
- **William Wirt, VA, 1817-11-13 to 1829-03-03 — longest-tenured AG in
  history (~12 years); argued *McCulloch v. Maryland* 1819 and
  *Gibbons v. Ogden* 1824; established record-keeping**
  ([Miller Center](https://millercenter.org/president/monroe/essays/wirt-1817-attorney-general)) (C)
- John MacPherson Berrien, GA, 1829-03-09 to 1831-07-20
- Roger B. Taney, MD, 1831-07-20 to 1833-09-23 (moved to recess-appointed Treasury → rejected)
- Benjamin F. Butler, NY, 1833-11-15 to 1838-09-01
- Felix Grundy, TN, 1838-09-01 to 1839-12-01
- Henry Gilpin, PA, 1840-01-11 to 1841-03-04
- John J. Crittenden, KY, 1841-03-05 to 1841-09-13 (Whig revolt)
- Hugh S. Legaré, SC, 1841-09-13 to 1843-06-20
- John Nelson, MD, 1843-07-01 to 1845-03-03
- John Y. Mason, VA, 1845-03-06 to 1846-10-13
- Nathan Clifford, ME, 1846-10-17 to 1848-03-17
- Isaac Toucey, CT, 1848-06-21 to 1849-03-03
- Reverdy Johnson, MD, 1849-03-08 to 1850-07-22
- John J. Crittenden (again), 1850-07-22 to 1853-03-03
- Caleb Cushing, MA, 1853-03-07 to 1857-03-04 (Pierce; previously
  rejected for Treasury 3× by Tyler 1843-03-03,
  [VisitTheCapitol](https://www.visitthecapitol.gov/artifact/president-john-tylers-third-message-nominating-caleb-cushing-secretary-treasury-march-3))
- Jeremiah Black, PA, 1857-03-06 to 1860-12-17 (moved to State)
- Edwin Stanton, OH, 1860-12-20 to 1861-03-04 (later War)
- Edward Bates, MO, 1861-03-05 to 1864-11-24 (Lincoln team-of-rivals)
- James Speed, KY, 1864-12-02 to 1866-07-17
- Henry Stanbery, OH, 1866-07-23 to 1868-03-12
  ([Miller Center](https://millercenter.org/president/johnson/essays/stanbery-1866-attorney-general))
  — resigned to defend Johnson at impeachment; Senate then **refused
  to re-confirm him** (1868); Stanbery never returned (C)
- William M. Evarts, NY, 1868-07-15 to 1869-03-03

**Great vs bad picks:**

- **Marquee** (Justice + courtroom skill): Wirt, Taney (pre-rejection),
  Black, Bates, Stanton. AG quality predicts Supreme Court argument
  quality in nation-shaping cases — McCulloch, Gibbons, Dred Scott (which
  was technically Court not AG, but the Buchanan AG Black was deeply
  involved).
- **Pure regional balance:** Felix Grundy, John Y. Mason, John Nelson
  — short-tenure caretaker appointments under crisis-era Tyler and Polk.
- **Tainted nominee history:** Cushing (rejected 3× for Treasury 1843,
  later seated as AG 1853); Stanbery (rejected on re-nomination 1868).

### Postmaster General (1789– / cabinet rank 1829–1971)

**Founded:** 1789-09-26 as sub-cabinet officer (Osgood, post office
inside Treasury).
**Elevated to cabinet rank:** 1829-03-09 by Jackson (Barry first cabinet-rank PMG)
([USPS Barry PDF](https://about.usps.com/who/profile/history/pdf/pmg-barry.pdf);
[Britannica USPS](https://www.britannica.com/topic/United-States-Postal-Service)).
**Demoted out of cabinet:** 1971-07-01 by Postal Reorganization Act of
1970 ([House History](https://history.house.gov/Historical-Highlights/1951-2000/hh_1970_08_06_postal-reorganization-act/)).

**HISTORIAN FLAG, BINDING:** In the 1772 AMPU scenario, **Postmaster
General is NOT a cabinet seat** through the entire scenario window
(1772–~1820). It existed but reported up through Treasury and is not
listed in any contemporary cabinet enumeration before Jackson. In the
1856 AMPU scenario, **Postmaster IS cabinet rank** (Aaron Brown when
the scenario opens; later Joseph Holt; Lincoln seats Montgomery Blair).

**Portfolio after 1829:** Mail routes (~8,000 postmaster jobs by Jackson's
inauguration), **patronage machine** (the seat became the heart of the
Jacksonian spoils system — postmaster appointments were the most
numerous federal patronage slots in the country until ~1880s) (C),
contract negotiation, postal rates.

**Tenures 1829–1869:**

- William T. Barry, KY, 1829-03-09 to 1835-04-10 (Jackson; corruption-ridden,
  [Miller Center](https://millercenter.org/president/jackson/essays/barry-1829-postmaster-general)) (C)
- Amos Kendall, KY, 1835-05-01 to 1840-05-18 (Jackson, Van Buren) —
  **the architect of the Kitchen Cabinet, not just PMG**;
  speech-ghostwriter for Jackson, central Bank War strategist
  ([Encyclopedia.com](https://www.encyclopedia.com/people/history/us-history-biographies/amos-kendall)) (C)
- John M. Niles, CT, 1840-05-26 to 1841-03-03
- Francis Granger, NY, 1841-03-06 to 1841-09-13 (Whig revolt)
- Charles A. Wickliffe, KY, 1841-10-13 to 1845-03-06
- Cave Johnson, TN, 1845-03-06 to 1849-03-05
- Jacob Collamer, VT, 1849-03-08 to 1850-07-22
- Nathan K. Hall, NY, 1850-07-23 to 1852-08-31
- Samuel D. Hubbard, CT, 1852-08-31 to 1853-03-07
- James Campbell, PA, 1853-03-07 to 1857-03-06
- Aaron V. Brown, TN, 1857-03-07 to 1859-03-08 (died in office; **PMG when
  1856 AMPU scenario opens**)
- Joseph Holt, KY, 1859-03-14 to 1860-12-31 (moved to War)
- Horatio King, ME, 1861-02-12 to 1861-03-06 (Buchanan)
- Montgomery Blair, MD, 1861-03-09 to 1864-09-23 (Lincoln team-of-rivals)
- William Dennison, OH, 1864-09-24 to 1866-07-16
- Alexander W. Randall, WI, 1866-07-25 to 1869-03-04

**Great vs bad picks:**

- **The PMG was rarely an "expertise" seat post-1829.** It was a
  political-machine seat. Kendall was a propagandist and patronage
  manager, not a logistics specialist. (I, supported by C citations on
  Kendall's role)
- The honest case is Joseph Holt (KY Unionist) — but Holt's reputation
  comes from his post-PMG War Department role, not from running the mail.
- **What makes a "bad" PMG historically**: not incompetence, but
  insufficient party loyalty — Granger 1841 lasted six months because
  he refused to play Tyler's faction game. (R)

### Secretary of the Interior (1849–)

**Founded:** Act of 1849-03-03 (Polk's last day of office), implemented
under Taylor ([DOI](https://www.doi.gov/about/history)). Ewing sworn
1849-03-08. **Does not exist in the 1772 AMPU scenario at all.** **Does
exist in 1856 AMPU.**

**Portfolio:** Consolidated four bureaus from other departments —
**General Land Office** (from Treasury), **Patent Office** (from State),
**Bureau of Indian Affairs** (from War, where Calhoun put it in 1824),
**Pension Office** (from War). This made Interior the **dominant
federal agency for the West**: public-domain land sales (the biggest
federal program by acreage), Indian relations and removal,
patents/innovation. By the 1857-61 Buchanan era, Interior was a major
patronage prize for Southern Democrats.

**Tenures, 1849–1865:**

- Thomas Ewing, OH, 1849-03-08 to 1850-07-22 (Taylor; "Butcher Ewing"
  for political-replacement firings,
  [Miller Center](https://millercenter.org/president/taylor/essays/ewing-1849-secretary-of-the-interior)) (C)
- Thomas McKennan, PA, 1850-08-15 to 1850-08-26 (Fillmore; resigned in 11 days)
- Alexander H.H. Stuart, VA, 1850-09-12 to 1853-03-07 (Fillmore)
- Robert McClelland, MI, 1853-03-08 to 1857-03-09 (Pierce; aggressive land-policy modernizer)
- Jacob Thompson, MS, 1857-03-10 to 1861-01-08 (Buchanan; resigned
  ahead of Mississippi secession; later Confederate spymaster,
  [Miller Center](https://millercenter.org/president/buchanan/essays/thompson-1857-secretary-of-the-interior)) (C)
- Caleb B. Smith, IN, 1861-03-05 to 1862-12-31 (Lincoln; one of the
  weaker Lincoln cabinet picks, mostly health-related)
- John P. Usher, IN, 1863-01-01 to 1865-05-15
- James Harlan, IA, 1865-05-15 to 1866-08-31

**Great vs bad picks:**

- **The Interior seat is the policy front for western expansion and
  Indian policy.** Strong fits in this period: McClelland, Stuart
  (both ran the seat as a serious admin job). Thompson before secession
  was rated highly by both parties on competence.
- **Politically pivotal:** Thompson 1857-61 ran Indian funds, land sales,
  and the patent office during the secession buildup. His resignation
  on 1861-01-08 (the day before Mississippi seceded) is the canonical
  case of Buchanan cabinet collapse.
- **In AMPU spec terms**: Interior is the seat where a high-Admin,
  Welfare-expertise, or Agriculture-expertise pick changes the western
  meters (settlement, frontier order, Indian relations).

### General-in-Chief / Commanding General of the Army

**The rank existed 1821-1903, with gaps.** Created informally 1821
when Jacob Brown was named Commanding General; Macomb 1828-1841;
Winfield Scott 1841-1861 (longest tenure); McClellan 1861-62; Halleck
1862-64; Grant 1864-69
([Wikipedia](https://en.wikipedia.org/wiki/Commanding_General_of_the_United_States_Army)) (C).

**HISTORIAN FLAG, BINDING for 1772 scenario:** The rank/office did not
exist before 1821. The Revolutionary Continental Army had Washington
as commander-in-chief from 1775-1783. After 1783 there was no
permanent senior commander; the small frontier army was led variously
by brigade-rank generals. The first peacetime "Commanding General"
(Jacob Brown) was named the year before AMPU's federalism era
arguably ends. **For the 1772 scenario, "GeneralInChief" before 1821
historically corresponds to: (a) Washington in the Revolution, then
(b) nobody until Anthony Wayne's frontier command in the 1790s, then
(c) a series of senior field generals without a formal headquarters
role.** (C, with [Britannica](https://www.britannica.com/biography/Winfield-Scott)
on Scott's eventual long tenure)

**Portfolio when the office actually existed:** Senior uniformed
commander, distinct from civilian Sec of War. Often a fraught dual
chain (Scott vs Polk during Mexican War, Scott vs Stanton in 1861).

### "Admiral" / senior naval officer

**HISTORIAN FLAG, MOST BINDING IN THE BRIEF:**

- **Before 1862-07-16, "Admiral" was not a rank in the US Navy.** Congress
  created the rank of *rear admiral* specifically for Farragut on
  1862-07-16 (a single rank, not the multi-grade structure of European
  navies)
  ([Defense Media Network](https://www.defensemedianetwork.com/stories/civil-war-naval-hero-was-the-navy%E2%80%99s-first-admiral/);
  [history.navy.mil](https://www.history.navy.mil/browse-by-topic/people/historical-figures/david-glasgow-farragut.html)) (C)
- *Vice admiral* created for Farragut 1864-12-31 by Lincoln.
  *Admiral* (full) created for Farragut 1866-07-25 by congressional act.
  He was **the first US Navy officer ever to hold the rank** (C).
- Before 1862, the highest active rank was **Captain**, with
  **Commodore** used as a *courtesy title* (and, briefly, a formal rank)
  for captains commanding squadrons. David Porter Sr., who adopted
  Farragut, was a "Navy Commodore" in this sense ([NHHC](https://www.history.navy.mil/browse-by-topic/people/historical-figures/david-glasgow-farragut.html)).
- **In the 1772 AMPU scenario**, "Admiral" is an anachronism across the
  entire scenario window (1772-~1820). The Continental Navy had captains;
  there was no admiral. In the 1856 AMPU scenario, "Admiral" is also
  anachronistic from 1856 until 1862. After 1862-07-16 it exists for
  exactly one man (Farragut) until 1866-07.

**Per AMPU spec language:** the cleanest historical move is to **route
all senior-naval responsibilities through the Secretary of the Navy
seat** for both scenarios. The Sec of the Navy is the historically
correct senior naval authority for both AMPU eras. If a uniformed naval
hero is needed for command bonuses, the era-correct term is
**Commodore** (1772-era: John Paul Jones held Continental Navy captain
rank with commodore courtesy; 1856-era: David Conner, Matthew Perry,
Foote, Du Pont were all "commodores"). **Naval personalities are
relevant to the game, but the "Admiral" *office* should not be
appointed prior to 1862.**

---

## 2. Era-conditional cabinet timeline (binding for spec)

Compressed table; each transition is cited above.

| Window | Cabinet seats present | Notes |
|--------|----------------------|-------|
| 1772–1788 | NONE (no cabinet — Confederation has Secretaries of Foreign Affairs, War, Treasury Board, and Postmaster, all under Congress not President) | 1772 scenario opens here |
| 1789-04 → 1798-04 | **4 seats**: State, Treasury, War, AG. Postmaster exists but is sub-cabinet, lives inside Treasury. | Washington's actual cabinet had no Navy seat — see Knox covering both |
| 1798-04-30 → 1829-03-09 | **5 seats**: State, Treasury, War, **Navy**, AG | The Navy seat joins post-Quasi-War buildup |
| 1829-03-09 → 1849-03-08 | **6 seats**: + **Postmaster General** elevated by Jackson | 1772 scenario likely ends before this (game window ~1772-1820); 1856 scenario opens in this configuration's successor |
| 1849-03-08 → 1870 | **7 seats**: + **Interior** | **This is the 1856 AMPU scenario configuration** |
| 1870-06-22 → 1903 | 7 seats; **AG now heads Dept of Justice** (no new seat, but the AG transforms from one-man legal officer to department head) | 1856 scenario may run through this transition |
| 1862-07-16 onward | "Admiral" as a naval rank exists (Farragut only, then expanded) | Note this is a *rank* not a *seat*; the seat is still Sec of Navy |

**Two AMPU-specific consequences:**

1. The 1772 scenario starts BEFORE the cabinet exists at all. Cabinet
   first becomes definable when the Constitution is ratified (1788) and
   Washington begins appointing in 1789. The scenario data
   (`src/data/scenario1772.ts:88`) seeds an empty cabinet structure
   immediately; historically the cabinet doesn't exist for the first
   ~17 years of the scenario.
2. The 1856 scenario opens with the **6-seat Buchanan cabinet** in
   place (State Marcy→Cass, Treasury Cobb, War Floyd, Navy Toucey,
   Interior Thompson, AG Black, PMG Aaron Brown then Holt) — i.e. the
   7-seat configuration above minus VP. The current seed
   (`src/data/scenario1856.ts:128-135`) only seeds State and leaves the
   rest null, then doesn't include Interior or Navy in the type. **This
   is a historical incompleteness in the existing data.**

---

## 3. Expertise mappings recommendation

Using AMPU's actual shipped `Expertise` union (`src/types.ts:162-172`):
`Agriculture, Business, Economics, Education, Energy, Environment,
Foreign Affairs, Healthcare, Housing, Justice, Labor, Media, Military,
Naval, Science, Technology, Trade, Transportation, Welfare`.

| Seat | Primary expertise | Secondary candidates | Era-anchor figures |
|------|-------------------|----------------------|--------------------|
| Secretary of State | **Foreign Affairs** | Trade (treaty trade clauses); Media (Seward used the partisan press) | Jefferson, JQ Adams, Webster, Seward |
| Secretary of Treasury | **Economics** | Trade (Tariff is the primary federal revenue → Walker, Corwin); Business (Hamilton's banking) | Hamilton, Gallatin, Chase |
| Secretary of War (pre-1947) | **Military** | Transportation (Davis's Pacific RR surveys); Welfare (Knox-era Indian policy, framed as humane administration) | Knox, Calhoun, Davis, Stanton |
| Secretary of the Navy (1798+) | **Naval** | Military (overlap with War); Trade (anti-piracy / merchant protection mandate) | Stoddert, Bancroft, Welles |
| Attorney General | **Justice** | Media (Wirt was a noted author / orator who shaped public legal opinion) | Wirt, Taney, Black, Bates |
| Postmaster General (cabinet rank 1829+) | **Transportation** (mail routes literally are the federal transport network of the era) | Media (PMG controlled the franking privilege + newspaper postage — directly shaped 1830s-50s press economy); Welfare is NOT a great fit | Kendall, Blair |
| Secretary of the Interior (1849+) | **Agriculture** (public-domain land sales + western settlement) or **Welfare** (BIA, pensions) — see anchor below | Energy/Environment too anachronistic; Education a stretch (no federal education function yet) | Ewing, McClelland, Thompson |

**Anchor commentary:**

- **Treasury → Economics is solid both eras.** Hamilton and Gallatin
  built the discipline; Chase invented modern paper currency. The
  word "Finance" the spec used isn't in the union; Economics is the
  correct mapping.
- **State → Foreign Affairs is solid.** The PR5 spec floated "Reform"
  as secondary; not historically right — there is no "reform" lobby
  attached to State in either AMPU era. Trade is the better secondary
  because reciprocity / commercial treaties were a State portfolio item
  through the entire 1789-1869 window.
- **Interior is the hardest mapping.** The seat fundamentally combines
  land policy (Agriculture is the closest shipped tag), Indian affairs
  (Welfare is the closest), and patents (Science/Technology is the
  closest). **Pre-Civil War, the land-and-settler agenda dominated the
  seat's politics.** Welfare is the safer single tag, but the PM should
  know the seat was effectively the "western development" portfolio,
  not modern HHS. Either way it earns expertise on confirmation.
- **PMG → Transportation, with Media as the meaningful secondary.** This
  is era-specific: from the 1792 Postal Service Act through ~1880, the
  Post Office *was* the federal transportation budget, and the PMG
  controlled mail subsidies that propped up early stagecoach, then
  railroad, networks. Equally important, the PMG controlled the
  franking privilege and the printing rate that determined whether
  newspapers could be distributed nationally — this is why Kendall was
  a power center in the partisan-press era. (I, anchored in
  [USPS Kendall PDF](https://about.usps.com/who/profile/history/pdf/pmg-kendall.pdf))
- **AG → Justice is correct.** Pre-1870 the seat doesn't grant a real
  "administration" skill since there's no department.

---

## 4. Selection-formula historical advice

The current selection (`src/engine/phaseRunners.ts:2096`) is a pure
`b.skills.admin - a.skills.admin` sort. Historical commentary:

- **Admin is universally relevant but historically *under*-load-bearing
  pre-1850.** Hamilton's Treasury employed maybe ~70 staff in
  Philadelphia. Knox's War Department was even smaller. The AG was
  effectively a one-person operation through 1870. Gallatin ran the
  entire Treasury with a small Washington staff for 13 years.
- **By the 1856 era, departments had hundreds of staff**, and admin
  matters much more. Stanton's reorganization of the War Dept in
  1862 is the canonical case where pure administrative competence
  saved a failing department.
- **Era-scaling admin weight is historically defensible.** A higher
  admin weight in the 1856 scenario than in 1772 maps to the actual
  expansion of the federal workforce. ([Brookings on the early federal workforce](https://www.brookings.edu/wp-content/uploads/2018/05/the-early-federal-workforce-by-p-kastor.pdf))
- **`governing` skill is probably the better fit than `admin` for cabinet
  seats overall.** "Governing" in AMPU's career-track scheme appears to
  mean executive portfolio management (cf. `TRACK_SKILL.Governing =
  'governing'`). Historically, the strongest Sec of Treasury picks
  (Hamilton, Gallatin, Chase) and Sec of War picks (Calhoun, Davis,
  Stanton) were all serious portfolio managers, not just clerks. (I)
- **Legislative skill is genuinely load-bearing for State Sec.** State's
  treaty work is meaningless without Senate ratification — JQA spent
  much of 1819-21 managing the Senate on Adams-Onís. Webster lost
  the 1850s on the Senate floor. (R)
- **Judicial skill is load-bearing for AG.** Wirt's reputation rests
  on his courtroom work, not his department management.
- **Military skill** dominates War + Navy + (when present)
  GeneralInChief. Calhoun is an exception — he was a politician-
  administrator with no military skill, yet rebuilt the army.

**The historical answer to "should weighting era-scale?":** Yes —
specifically admin matters more in 1856 era than in 1772 era. The
underlying federal-state-capacity transition (~1820-1860) is
well-documented. (C, [Brookings](https://www.brookings.edu/wp-content/uploads/2018/05/the-early-federal-workforce-by-p-kastor.pdf))

---

## 5. Cabinet effects on governance — historical leverage

This section flags how cabinet quality *actually* moved the needle in
the historical record, for PR5 scoping. PM uses to decide which meters
each seat should bump.

- **Treasury → revenue + economic + national-debt levers.** Hamilton's
  debt assumption set the credit terms for the next two centuries
  (C). Gallatin's debt reduction sustained the Jeffersonian limited-state
  vision (C). Chase invented modern wartime finance (C). **The most
  reliably load-bearing seat across both AMPU eras.**
- **State → foreign affairs + war/peace + territorial expansion levers.**
  Almost every major territorial gain in US history (Louisiana, Florida,
  Oregon boundary, California via Mexican War, Gadsden, Alaska) went
  through the State Department's treaty process or a State-Department-
  negotiated peace. Hawaii and the rest of the post-1898 expansion is
  out of AMPU scope.
- **War → military readiness + war-prosecution + Indian affairs (pre-1849).**
  Calhoun rebuilt the army after the disastrous War of 1812 (C). Davis
  modernized weaponry and built the antebellum army (C). Stanton ran
  the day-to-day Civil War. (C)
- **Navy → war prosecution at sea, blockade, post-1815 commercial
  protection.** Welles's blockade was a strategic victory. Stoddert's
  Quasi-War prosecution built the federal navy. (C)
- **AG → legal-opinion + Supreme Court argument + (after 1870) DOJ admin.**
  Pre-1870 the seat's leverage is courtroom-and-opinion, not bureaucratic.
  Wirt's arguments in *McCulloch* and *Gibbons* shaped federalism (C).
- **PMG (1829+) → patronage + (R) partisan press economy + appointment
  flow.** Kendall was probably more powerful than half the cabinet
  combined in the mid-1830s, but his power was patronage-network not
  policy. (C on the patronage flow; I on relative weight.)
- **Interior (1849+) → western lands + Indian removal + patents/innovation.**
  Thompson 1857-61 ran a department whose budgets and patronage drove
  much of the late-antebellum western-development politics. (C)

**For PR5 scope:** the historical leverage strongly supports
**Treasury > State > War > Navy > Interior > AG > PMG** as the rough
"how much cabinet quality matters" ordering, but each era reweights
this. In the 1772 scenario's first decade (1789-1798) the order is
**Treasury > State > War > AG** (no Navy or others). In 1856-1865, the
order shifts dramatically toward **War > Treasury > Navy > State** as
the Civil War crisis dominates.

---

## 6. Cross-party / team-of-rivals appointment history

Concise. This determines whether PR5 should model cross-party friction.

- **Washington's first cabinet (1789-1793) was cross-party-ish** — Hamilton
  (proto-Federalist) + Jefferson (proto-Republican) — because
  parties didn't formally exist yet. The Hamilton-Jefferson rivalry
  *forced the formation* of parties through 1791-93. (C)
- **Adams (1797-1801) retained Washington's Federalist holdovers**
  (Pickering, Wolcott, McHenry), who covertly took orders from
  Hamilton against Adams's interests. Adams fired Pickering and
  McHenry in May 1800; the affair contributed to his 1800 loss. (C)
- **Jefferson (1801-09) appointed only Democratic-Republicans.** Madison,
  Monroe, JQ Adams, Jackson all followed suit. (C)
- **Pre-Civil War norm:** cabinet from president's own party. Tyler 1841
  appointed a Whig cabinet that resigned in mass on 1841-09-11 because
  he wasn't enough of a Whig — only Webster stayed. Tyler then ran a
  mixed/Democratic cabinet at war with the Whig Senate, which rejected
  multiple of his nominees. (C)
- **Lincoln 1861 "team of rivals" is the canonical exception** —
  Seward (former Whig/Republican rival), Chase (Republican rival),
  Bates (former Whig), Cameron (Republican machine, fired), Stanton
  (Democrat), Welles (former Democrat), Blair (Democrat). Goodwin's
  *Team of Rivals* (2005) is the standard popular narrative.
  ([Library of Congress](https://www.loc.gov/exhibits/lincoln/a-team-of-rivals.html);
  [White House Historical](https://www.whitehousehistory.org/abraham-lincolns-cabinet)) (C)
- **Andrew Johnson 1865-69** retained Lincoln's Republican cabinet
  including Stanton, then tried to fire Stanton, triggering the Tenure
  of Office Act crisis and Johnson's impeachment. This is the most
  consequential cross-party cabinet conflict in US history. (C)

**Historian take for PR5 spec:** cross-party cabinet picks were
**historically rare but not absent**. The Lincoln 1861 case is famous
*because* it was unusual. For 1856 AMPU scenario, the realistic norm
is same-party cabinet with occasional defections (Cobb, Thompson,
Floyd) when a sectional crisis tears the party apart. For 1772 era's
late-window (post-1789), Washington's cabinet was the only cross-party
precedent and it ended badly.

---

## 7. Confirmation friction history

For PR5 scoping. Confirmation rejections through 1869:

- **1789-1825: confirmations were essentially pro-forma.** Washington's,
  Adams's, Jefferson's, Madison's, Monroe's, JQ Adams's cabinet
  nominations all confirmed. ([Senate.gov first-cabinet-rejection](https://www.senate.gov/about/powers-procedures/nominations/first-cabinet-rejection.htm))
- **1834-06-24: Roger Taney rejected for Treasury, 18-28.** First cabinet
  rejection in US history. Senate Whigs were retaliating for Jackson's
  removal of Bank of the United States deposits, which Taney had executed
  during his recess appointment. The same Senate had formally censured
  Jackson over the deposit removal earlier in 1834. ([senate.gov](https://www.senate.gov/about/powers-procedures/nominations/first-cabinet-rejection.htm)) (C)
- **1843-03-03: Caleb Cushing rejected 3× for Treasury** under Tyler on
  one day, by 27-19, 27-10, and 29-2 votes — the most extraordinary
  cabinet-rejection sequence in US history. The Senate, frustrated with
  Tyler's lack of party identity, refused to seat his Treasury pick at all.
  ([VisitTheCapitol](https://www.visitthecapitol.gov/artifact/president-john-tylers-third-message-nominating-caleb-cushing-secretary-treasury-march-3)) (C)
- **1843-1844: Tyler also lost David Henshaw (Navy), James Porter (War),
  and several others.** (C)
- **1868: Henry Stanbery re-nominated for AG after resigning to defend
  Johnson at impeachment.** Senate refused.
  ([Miller Center](https://millercenter.org/president/johnson/essays/stanbery-1866-attorney-general)) (C)

**Through 1869, total cabinet rejections were on the order of a dozen,
clustered in three crises: Jackson-Bank-War (1834), Tyler-Whig-revolt
(1843-44), and Johnson-impeachment-fight (1867-68).** In the 1856 AMPU
scenario window, the Tyler precedent is in the recent memory of
players and the Johnson crisis falls within the scenario's typical run.

---

## 8. KeyAdvisor placeholder

**Recommendation: drop the KeyAdvisor seat from cabinet enumeration in
both eras.**

- **There is no historical analog before the 20th century.** Jackson's
  "Kitchen Cabinet" was informal — Kendall, Francis Blair Sr., Lewis,
  William Lewis, Andrew Donelson — none of them held the title "Key
  Advisor" or any office that wasn't either (a) a real cabinet seat
  (Kendall got PMG in 1835) or (b) a junior auditor / private secretary
  position. ([Britannica Calhoun + Encyclopedia.com Kendall](https://www.encyclopedia.com/people/history/us-history-biographies/amos-kendall))
- Lincoln's private secretaries (John Nicolay, John Hay) had real
  influence but were not cabinet-rank — they ran the President's mail
  and message traffic, salary ~$2,500 a year. (C)
- Chief of Staff is a 20th-century invention (formally 1946 under
  Truman; the title in current form ~1961).
- In AMPU specifically, `KeyAdvisor` is **already absent from
  `OFFICE_EXPERTISE` and from `OFFICE_COMMAND_GRANT`**
  (`src/types.ts:507-521`) — the engine doesn't treat it as a real
  expertise grant. The seat is essentially dead weight.

**If the PM wants to keep a slot for the Kitchen Cabinet flavor in
the 1828+ era**, the historically grounded options are:

- A *non-cabinet* "Confidant" or "Chief of the Kitchen Cabinet" role
  that doesn't appear in confirmation phase
- An "Advisor to the President" hook that grants PV-style influence
  rather than a portfolio
- Folding the slot's leverage into the Kingmaker / mentorship system
  already in place (`src/types.ts:275-288`)

But as a formal cabinet position, KeyAdvisor is anachronistic in both
AMPU eras.

---

## 9. Era-event integration flags

Which existing AMPU 1856 era events would naturally route through
cabinet expertise. (Skim from `src/data/eraEvents1856.ts` if PR6
hooks needed.)

- **Kansas-Nebraska / Bleeding Kansas (1854-58)**: Pierce + Davis (War)
  + Cushing (AG) — federal troops to Kansas, Lecompton constitution
  legal opinions. **Cabinet hook: AG opinion quality + War Sec army
  readiness.** (C)
- **Dred Scott (1857)**: Buchanan + Black (AG) — Buchanan inappropriately
  lobbied Justice Grier; Black wrote legal opinions for the administration's
  pro-Dred-Scott position. **Cabinet hook: AG.** (R: Buchanan's
  lobbying is well-documented; the cabinet's specific role is more
  intimate than other crises.)
- **John Brown raid (1859)**: Floyd (War) sent in Robert E. Lee with US
  Marines to retake Harpers Ferry. **Cabinet hook: War Sec military
  competence.** (C)
- **Election crisis / secession winter (1860-61)**: Cobb (Treasury) and
  Thompson (Interior) and Floyd (War) all resigned for the Confederacy;
  Holt + Stanton + Dix scrambled to hold the cabinet. **The strongest
  case in the period that cabinet quality + loyalty matters.** (C)
- **Civil War prosecution (1861-65)**: Stanton (War), Welles (Navy),
  Chase (Treasury), Seward (State) — **the entire cabinet is the war
  cabinet**. Every meter routes through some seat. (C)
- **Compromise of 1850 / Fugitive Slave Act**: Fillmore + Webster (State)
  + Crittenden (AG) handled enforcement opinions and the politics of
  the bill. Less directly cabinet-dependent than the later crises. (R)
- **Whig collapse (1854-56)**: cabinet quality not the lever — this was
  a party-system event, not an administrative one.
- **Know-Nothing rise**: ditto.

**Recommended for PR5 deferral**: hook AG to *Dred Scott* and *Kansas-
Nebraska legal opinions*; War to *John Brown raid* and *Civil War
prosecution*; Navy to *blockade*; Treasury to *Civil War finance*;
State to *Trent Affair* and *European recognition prevention*. These
are the canonical cabinet-routed events in the 1856 era.

For 1772 era: no real cabinet to hook anything to until 1789, then
Hamilton's economic plan (Treasury), Jay Treaty (State), Whiskey
Rebellion (War + Treasury), Quasi-War (Navy + State), Louisiana
Purchase (State + Treasury jointly).

---

## 10. Anachronism summary

Specific lines in the AMPU codebase / spec that need historical correction:

- **`src/data/scenario1772.ts:88`**: seeds a 6-seat cabinet
  (`SecretaryOfState, SecretaryOfTreasury, SecretaryOfWar,
  AttorneyGeneral, PostmasterGeneral, KeyAdvisor`) at year 1772.
  Historically the cabinet does not exist until 1789, and even then
  PMG is not cabinet rank until 1829 and Navy doesn't exist until 1798.
  **The 1772 scenario should NOT have Postmaster as a cabinet seat —
  it sat inside Treasury through 1828.** (C)
- **`src/data/scenario1856.ts:128-135`**: seeds a 6-seat cabinet
  excluding Interior, Navy, and (during the Buchanan baseline) PMG-Brown.
  Historically the 1856 cabinet had 7 seats: State, Treasury, War,
  Navy, Interior, AG, PMG. Missing Navy and Interior is a real gap.
- **`src/types.ts:918-940` (OfficeType)**: includes `Admiral` as an
  office. In 1772 era this is anachronistic for the entire scenario
  window. In 1856 era it's anachronistic until 1862-07-16. (C)
- **`src/types.ts:918-940` (OfficeType)**: includes `KeyAdvisor` as an
  office. No historical analog in either era. (C)
- **`src/engine/phaseRunners.ts:2092`**: iterates a fixed list of 6
  cabinet positions identical in both scenarios. Era-blind. **The
  binding fact is that the cabinet shape *changes 4 times* in the
  AMPU game range** (per the timeline table in §2).
- **"Cabinet" as a term**: era-correct in both eras. Washington began
  using "the heads of Departments and the Attorney General" in 1789
  and the modern term came into normal usage by his second term (C,
  per Chervinsky, *The Cabinet*, Harvard UP 2020).
- **"Secretary" of [department]**: era-correct in both eras.
- **"Confirmation" / "Senate confirms"**: era-correct in both eras
  (Article II, Section 2).
- **"Department head"**: era-correct for State / Treasury / War / Navy /
  Interior / PMG-after-1829. **Anachronistic for AG before 1870** — the
  AG was not a department head. PR5 spec text should probably say
  "Cabinet-rank officer" rather than "Department head" generically.

---

## 11. Open questions for the PM (historian flags, not design)

1. **Should the 1772 scenario hide the cabinet phase entirely until
   1789?** The cabinet does not historically exist before this. (Or
   show a Continental Congress / Confederation analogue: Foreign
   Affairs, Finance, Treasury Board, War, Marine — these existed under
   the Articles, with different officeholders, e.g. Robert Morris as
   Superintendent of Finance 1781-84. This is in scope for the
   independence era graph already.)
2. **In the 1772 scenario after 1798, should Navy come online
   automatically?** Historically, the Navy Department was a direct
   response to the Quasi-War with France. AMPU's revolutionaryWar
   module is the more obvious parallel — if AMPU's late-1790s
   diplomatic state mirrors the historical Quasi-War, Navy appears
   organically.
3. **Should the 1856 scenario seed all 7 seats (State, Treasury, War,
   Navy, AG, PMG, Interior) per the Buchanan baseline?** Currently it
   seeds only State and GeneralInChief.
4. **Should "Admiral" be removed from `OfficeType` entirely**, or kept
   as a 1862+ availability? The historical answer favors removal in
   AMPU's scenario window unless the spec wants a Farragut event.
5. **Should "KeyAdvisor" be dropped from `OfficeType`**, or repurposed
   as a non-cabinet Kitchen Cabinet flavor slot for 1829+? Historical
   recommendation is drop.
6. **AG in the 1856 scenario post-1870**: if scenarios actually run that
   long, should the AG transform from one-person legal officer to
   department head with admin-skill consequences?

---

## Citations (URL + 1-line description)

### Primary government sources

- [history.state.gov — Principal Officers](https://history.state.gov/departmenthistory/people/principalofficers/secretary) — full list of Secretaries of State, foundational dates
- [state.gov — Former Secretaries of State](https://www.state.gov/former-secretaries-of-state) — confirms 1789-07-27 founding date
- [history.state.gov — Webster-Ashburton Milestones](https://history.state.gov/milestones/1830-1860/webster-treaty) — Webster treaty details 1842
- [history.state.gov — Florida Milestones](https://history.state.gov/milestones/1801-1829/florida) — Adams-Onís Treaty context
- [home.treasury.gov — Hamilton bio](https://home.treasury.gov/about/history/prior-secretaries/alexander-hamilton-1789-1795) — first Treasury Sec; debt assumption
- [home.treasury.gov — Treasury history overview](https://home.treasury.gov/about/history/history-overview/history-of-the-treasury) — department history
- [home.treasury.gov — Chase bio](https://home.treasury.gov/about/history/prior-secretaries/salmon-p-chase-1861-1864) — wartime finance, greenbacks
- [home.treasury.gov — Gallatin statue page](https://home.treasury.gov/north-plaza-gallatin-statue) — longest-tenured Treasury
- [navy.mil — Establishment of Navy Dept](https://www.history.navy.mil/browse-by-topic/commemorations-toolkits/navy-birthday/OriginsNavy/the-establishment-of-the-department-of-the-navy.html) — 1798-04-30 founding
- [navy.mil — Farragut bio](https://www.history.navy.mil/browse-by-topic/people/historical-figures/david-glasgow-farragut.html) — 1862 admiral rank creation
- [navy.mil — Stoddert bio](https://www.history.navy.mil/our-collections/photography/us-people/s/stoddert-benjamin.html) — first Navy Sec
- [justice.gov — Office of AG / Randolph](https://www.justice.gov/ag/bio/randolph-edmund-jennings) — 1789 founding; 1870 DOJ creation
- [DOI — History of Interior](https://www.doi.gov/about/history) — 1849-03-03 founding
- [senate.gov — First Cabinet Rejection](https://www.senate.gov/about/powers-procedures/nominations/first-cabinet-rejection.htm) — Taney 1834 rejection vote
- [USPS — Osgood PDF](https://about.usps.com/who/profile/history/pdf/pmg-osgood.pdf) — first PMG, 1789
- [USPS — Barry PDF](https://about.usps.com/who/profile/history/pdf/pmg-barry.pdf) — first cabinet-rank PMG, 1829
- [USPS — Kendall PDF](https://about.usps.com/who/profile/history/pdf/pmg-kendall.pdf) — Kitchen Cabinet patronage
- [House History — Postal Reorganization 1970](https://history.house.gov/Historical-Highlights/1951-2000/hh_1970_08_06_postal-reorganization-act/) — 1971 demotion of PMG out of cabinet
- [LOC — Lincoln's Team of Rivals](https://www.loc.gov/exhibits/lincoln/a-team-of-rivals.html) — 1861 cross-party cabinet
- [LOC — Stanton Papers](https://www.loc.gov/collections/edwin-mcmasters-stanton-papers/about-this-collection/) — War Sec wartime management

### Secondary scholarly / institutional sources

- [Miller Center — Calhoun as War Sec](https://millercenter.org/president/monroe/essays/calhoun-1817-secretary-of-war) — 1817-25 reorganization
- [Miller Center — Knox as War Sec](https://millercenter.org/president/washington/essays/knox-1789-secretary-of-war) — first War Sec, Indian policy
- [Miller Center — Gallatin Treasury](https://millercenter.org/president/jefferson/essays/gallatin-1801-albert-secretary-of-the-treasury) — long-tenured Treasury
- [Miller Center — Davis as War Sec](https://millercenter.org/president/pierce/essays/davis-1853-jefferson-secretary-of-war) — 1853-57 reforms
- [Miller Center — Cobb at Treasury](https://millercenter.org/president/buchanan/essays/cobb-1857-secretary-of-the-treasury) — Buchanan-era Treasury
- [Miller Center — Thompson at Interior](https://millercenter.org/president/buchanan/essays/thompson-1857-secretary-of-the-interior) — Buchanan-era Interior
- [Miller Center — Stanton at War](https://millercenter.org/president/johnson/essays/stanton-1865-secretary-of-war) — wartime War Sec
- [Miller Center — Welles at Navy](https://millercenter.org/president/johnson/essays/welles-1865-secretary-of-the-navy) — Lincoln's Neptune
- [Miller Center — Stanbery at AG](https://millercenter.org/president/johnson/essays/stanbery-1866-attorney-general) — Senate refused re-confirmation 1868
- [Miller Center — Wirt at AG](https://millercenter.org/president/monroe/essays/wirt-1817-attorney-general) — longest-tenured AG
- [Miller Center — Ewing at Interior](https://millercenter.org/president/taylor/essays/ewing-1849-secretary-of-the-interior) — first Interior Sec
- [Miller Center — Barry at PMG](https://millercenter.org/president/jackson/essays/barry-1829-postmaster-general) — first cabinet-rank PMG
- [White House Historical — Lincoln Cabinet](https://www.whitehousehistory.org/abraham-lincolns-cabinet) — team-of-rivals composition
- [White House Historical — Jackson Cabinet](https://www.whitehousehistory.org/andrew-jacksons-cabinet) — Kitchen Cabinet context
- [Britannica — Seward](https://www.britannica.com/biography/William-H-Seward) — Trent Affair, Alaska
- [Britannica — Welles](https://www.britannica.com/biography/Gideon-Welles) — blockade, ironclads
- [Britannica — Cass](https://www.britannica.com/biography/Lewis-Cass) — Indian removal
- [Britannica — JQ Adams](https://www.britannica.com/biography/John-Quincy-Adams) — Sec of State legacy
- [Britannica — Floyd](https://www.britannica.com/biography/John-Buchanan-Floyd) — Buchanan War Sec resignation
- [Britannica — USPS](https://www.britannica.com/topic/United-States-Postal-Service) — Post Office inside Treasury before 1829
- [Britannica — Webster-Ashburton](https://www.britannica.com/event/Webster-Ashburton-Treaty) — 1842 treaty
- [Britannica — Stanton](https://www.britannica.com/biography/Edwin-M-Stanton) — Civil War management
- [American Battlefield Trust — Welles](https://www.battlefields.org/learn/biographies/gideon-welles) — Navy expansion
- [American Battlefield Trust — Naval war](https://www.battlefields.org/learn/articles/navies-civil-war) — Civil War navy scope
- [VisitTheCapitol — Cushing rejection 3rd msg](https://www.visitthecapitol.gov/artifact/president-john-tylers-third-message-nominating-caleb-cushing-secretary-treasury-march-3) — 1843 Treasury rejections
- [VisitTheCapitol — Taney nomination](https://www.visitthecapitol.gov/artifact/president-andrew-jacksons-nomination-roger-b-taney-be-secretary-treasury-june-23-1834) — Taney 1834 nomination
- [VisitTheCapitol — Taney vote tally](https://www.visitthecapitol.gov/artifact/senate-vote-tally-sheet-roger-b-taneys-nomination-be-secretary-treasury-june-24-1834) — 18-28 rejection vote
- [Encyclopedia.com — Kendall](https://www.encyclopedia.com/people/history/us-history-biographies/amos-kendall) — Kitchen Cabinet architect
- [Defense Media Network — Farragut admiral rank](https://www.defensemedianetwork.com/stories/civil-war-naval-hero-was-the-navy%E2%80%99s-first-admiral/) — 1862 rear admiral creation
- [American Heritage — Buchanan Cabinet](https://www.americanheritage.com/corruption-and-treason-buchanan-cabinet) — Cobb / Thompson / Floyd resignations
- [Brookings — Early Federal Workforce](https://www.brookings.edu/wp-content/uploads/2018/05/the-early-federal-workforce-by-p-kastor.pdf) — federal-capacity growth 1789-1860
- [Connecticut History — Welles](https://connecticuthistory.org/gideon-welles-us-secretary-of-the-navy-and-lincolns-neptune/) — Navy buildup
- [Library of Congress — Salmon Chase](https://blogs.loc.gov/inside_adams/2013/01/salmon-p-chase-lincolns-treasury-secretary/) — Lincoln Treasury

### Background / orientation

- [Wikipedia — Commanding General of the US Army](https://en.wikipedia.org/wiki/Commanding_General_of_the_United_States_Army) — office created 1821; tenure list
- [Wikipedia — Winfield Scott](https://en.wikipedia.org/wiki/Winfield_Scott) — 1841-1861 tenure
- [Wikipedia — Henry Halleck](https://en.wikipedia.org/wiki/Henry_Halleck) — 1862-64 General-in-Chief
- [Wikipedia — Postal Reorganization Act](https://en.wikipedia.org/wiki/Postal_Reorganization_Act) — 1970 act, 1971 implementation
- [Wikipedia — US Post Office Department](https://en.wikipedia.org/wiki/United_States_Post_Office_Department) — department history
- [Wikipedia — Cabinet of the United States](https://en.wikipedia.org/wiki/Cabinet_of_the_United_States) — orientation
- [HistoryNet — USPS history](https://historynet.com/history-us-postal-service/) — Jackson elevation of PMG
- [Chervinsky / New Books Network on Washington's Cabinet](https://newbooksnetwork.com/lindsay-m-chervinsky-the-cabinet-george-washington-and-the-creation-of-an-american-institution-harvard-up-2020) — origin of "cabinet" term
