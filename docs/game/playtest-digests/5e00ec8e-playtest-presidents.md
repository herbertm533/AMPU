# Digest — `5e00ec8e-playtest-presidents` ("Playtest Presidents")

**Type:** RECORD / CATALOG thread (community-compiled roster of presidents across
all forum playtests). **238 posts / 12 chunks**, read in full. Opened by **@vcczar**
(POST 1, 23 Sep 2022) as a running master-list ("name, party, length of service,
which playtest"); contributors maintain per-playtest president lists, mostly by
**editing-then-reposting** the same list each new election. Spans real-time **Sep
2022 → Jun 2026**. NOT a gameplay thread — almost no new mechanics; its value is
(a) a **cross-index of every playtest the community has run** (corpus-coverage map)
and (b) a **balance signal** on who wins the presidency.

**Reading note:** the bulk of the chunk bytes are *verbatim re-posts* of two long
running lists (the 1840 "Granger" line and Bushwa's 1800 "Stamping out tea" line),
re-pasted on every update. Those are noise; this digest captures the dedup'd rosters
+ the deltas. Post numbers cite the `===== POST n =====` markers.

Polarity note: party labels here are **per-era** — F/DR in the founding lines,
W/D in the 1840 line, R/D in the modern lines. A "W" (Whig) president in the
1840-start timeline has no equivalent in the shipped 1772/1856 builds.

---

## Per-playtest president rosters

Tables list the **distinct** presidents named (de-duplicated across re-posts).
"✓ ingested" = we have a sibling digest for this exact run; "✗ GAP" = not in corpus.

### A. Founding-era (1772 / 1788 / 1800) runs

**1772 multiplayer I** — F/DR. *(POST 1, 3)* — **✓ = `summer2021` (fe15db25, batch 26)**
| # | President | Party | Years |
|---|---|---|---|
|1| Benedict Arnold | F | 1789–1793 |
|2| Francis Lightfoot Lee | DR | 1793–1797 |
|3| Pierce Butler | F | 1797–1805 |
|4| Daniel Hiester | DR | 1805–1809 |
|5| Samuel Osgood | F | 1809– |
> **★ EXACT MATCH** to the alt-line recorded in the batch-26 `summer2021` digest
> (Arnold ["Arnold D.C."] → F.L. Lee → Butler [VP Washington dies] → long Hiester
> presidency → Osgood [beats Madison 1808]). This thread independently corroborates
> that roster — confirms `summer2021` = the forum's "1772 multiplayer I."

**1772 single-player** — F/DR. *(POST 1, 4, 19)* — **✓ = `principle1772` (049ce855, batch 25)**
| # | President | Party | Years |
|---|---|---|---|
|1| Abraham Whipple | F | 1789–1793 |
|2| Peleg Arnold ("Arnoldian DR") | DR | 1793–1797 |
|3| John Marshall | F | 1797– |
> Matches `principle1772`'s emergent line (Whipple-Red 1788 → Arnold-Blue 1792 →
> Marshall-Red ~1796). GM @MrPotatoTed; this is the designer-run single-player 1772.
> Note POST 4 flavor: "Constitution allows all races to vote but women left out,
> slavery in 12/13 states" = ahistorical-Constitution consequence (cf. `principle1772`).

**1772-onward (Cal & Rezi)** — *(POST 1, 13–15)* — **✓ = `grass1772` (5b1b2c33, batch 24)**
| # | President | Party | Years |
|---|---|---|---|
|1| John Bartram (botanist) | ? | 1780– (re-elected; turns 100 in office) |
> Matches `grass1772`'s **command-bootstrap emergent President** (90-yr-old CPU
> botanist John Bartram, 1780). POST 15: "rules state you auto-retire if over 100"
> (age-100 retirement cap — cf. governing rules).

**1788 (Original Playtest; defunct)** — *(POST 1, 18, 24)* — **✗ GAP (very old forum)**
| President | Party | Years |
|---|---|---|
| G. Washington | F | 1789–1797 (2 terms) |
| Albert Gallatin | DR | 1797–1801 |
| Alexander Hamilton | F | 1801–1809 |
| Aaron Burr | DR | 1809–1813 |
| Henry Clay | F? | 1813–1821 |
| Andrew Jackson | D? | 1821–1829 |
| Henry Clay | W? | 1829– |
> @vcczar saved the full **history page** (cabinet-by-cabinet grid, POST 18/24, 1788–1828).
> Ends with Jackson as "the final president" per @vcczar (POST 16); a near-twin run
> ended "Quincy III + Stephen Van Rensselaer" ticket (POST 17). NOT in corpus.

**1788 (2nd playtest ever; defunct)** — *(POST 1, 21)* — **✗ GAP**
| President | Party | Years |
|---|---|---|
| G. Washington | F | 1789–1793 |
| Thomas Paine | DR | 1793–1801 |
| Oliver Ellsworth | F | 1801–1805 |
| Philip Reed | DR | 1805– |

**1788 (3rd playtest ever?; defunct)** — *(POST 1, 12)* — **✗ GAP**
| President | Party | Years |
|---|---|---|
| G. Washington | F | 1789–1797 |
| Thomas Paine | DR | ? |
| Aaron Burr | DR | ? |
| James Jackson | DR | ? (ends on **military-dictatorship event** — game-ender) |
> @MrPotatoTed recalls the "really old version": Paine "drove the country to ruin,"
> then James Jackson "passed the rolls" for the military-dictatorship event ending
> the playthrough (POST 12). Early instance of the coup/game-over endgame (cf. #88).

**1800 Playtest = "Stamping out America's love for tea" (Bushwa)** — F/DR/W/D —
*(POST 79, 98, 102, 105–110, 114, 124, 138–142, 154, 175–178, 181, 185, 200, 213, 222, 226, 229–230)*
— **✓ = `tea1772` (ad0f2875)** *(title match; solo all-CPU 1772→1874 traversal, operator @Bushwa777)*
| # | President | Party | Years |
|---|---|---|---|
|1| William Moultrie | F | 1789–1791 (d. plague) |
|2| John Adams | F | 1791–1797 |
|3| Richard Henry Lee | DR | 1797–1801 |
|4| George Clinton | DR | 1801–1802 (forced resign — Vermont land scandal) |
|5| Benjamin Ogle | DR | 1802–1809 |
|6| John Page | DR | 1809–1813 |
|7| John Breckenridge | DR | 1813–1817 (impeached 1815 for beating slave to death; **not convicted**) |
|8| Isaac H. Williamson | F | 1817–1821 |
|9| Andrew Jackson | D | 1821–1829 (forms the Democratic Party; denied 3rd term) |
|10| David Holmes | D | 1829 (resigns — prostitution scandal; re-nominated, loses) |
|11| Wilson Cary Nicholas | D | 1829–1833 (caretaker after Holmes scandal) |
|12| John Pope | D | 1833–1837 |
|13| William H. Crawford | D | 1837 (d. typhoid, April 1837) |
|14| John Reynolds | D | 1837–1841 |
|15| Martin Van Buren | D | 1841–1845 (wins Mexican-American War) |
|16| Winfield Scott | F→? | 1845–1849 (d. pneumonia 1849) |
|17| Oliver Hazard Perry | ? | 1849–1853 |
|18| Alexandre Mouton | D | 1853–1859 *(1st president born after 1800, 1st Catholic, 1st w/ beard, POST 186/188)* |
|19| Paris Dunning | ? | 1859–1861 |
|20| Augustus Bradford | ? | 1861–1869 |
|21| Nathan Clifford | ? | 1869–1873 |
|22| Orange Ferriss | ? | 1873 (resigns, 1873 scandal) |
|23| Richard W. Thompson | ? | 1873–1877 |
> The single most-tracked roster in the thread (Bushwa re-posts it every election with
> full biographies). **Note:** the in-thread label "1800 Playtest" is Bushwa's shorthand,
> but the run **starts at 1788/1789** (Moultrie elected 1788) and is the "Stamping out
> tea" traversal = `tea1772`. Confirms `tea1772`'s named-band sequence (Federalist →
> Republicanism → Democracy → Manifest-Destiny → Nationalism) with concrete presidents,
> and corroborates **#61** (succession: Clinton/Holmes/Crawford → VP), **#105** (stat/scandal
> forced resignation), **#92** (Jackson "forms Democratic Party" = era-band party realignment).

**"Oops All CPUs" (1788 all-CPU)** — RED/BLUE founding — *(POST 52–55, 219–220)* — **✓ = `oopscpu` (699113d6)**
| President | Party | Years |
|---|---|---|
| Arthur St. Clair | RED | 1788 (forced resign after 1 yr: Depression + near-civil-war + Native relocation disaster) |
| Thomas Paine | BLUE | 1788– (acting) |
| *(later restart)* George Washington | RED | 1788–1795 (**dies in office**) |
| John Adams | RED | 1795– (inherits, **refuses "acting," sets VP-becomes-true-President precedent**) |
> POST 52 (St. Clair collapse) ↔ `ted1772`'s emergent-President St. Clair finding AND
> `oopscpu`'s 1788 run. POST 219–220: Washington dies in office → Adams inherits & sets
> the **VP-inherits-full-presidency** precedent — **exact match to `oopscpu` #61 ruling**
> (Washington died 1796 → Adams inherited; designer-authoritative, Ted-run).

**Orange Democracy (1788, OrangeP47)** — I/F/DR — *(POST 218, 224)* — **✓ = `fed` (f55d3e21)**
| # | President | Party | Years |
|---|---|---|---|
|1| George Washington | I-VA | 1789 (**resigns early yr-1** over postal-patronage outrage) |
|2| John Adams | F-MA | 1789–1793 |
|3| Thomas Jefferson | DR-VA | 1793–1797 (declares war on Britain 1795 for French Rev) |
|4| James Madison | DR-VA | 1797–1801 |
|5| John Eager Howard | F-MD | 1801– ("combo breaker," 1st non-historical pres, POST 224) |
> Matches `fed` (Orange Democracy 1788, Hamilton's Arch Federalists / @OrangeP47). The
> "War of 1795 vs Britain" + Washington early-resignation are this run's alt-spine.

### B. Antebellum / Civil-War (1840 / 1856 / 1868) runs

**1840 Playtest (OrangeP47)** — W/D — *(POST 2, 31, 34, 39, 56, 62, 68, 96, 108, 111, 158, 172)*
— **✗ GAP (a 1840-start scenario — no 1840 thread in corpus; longest-running game, ~100 in-game yrs)**
| # | President | Party | Years |
|---|---|---|---|
|9| William Henry Harrison | W-OH | 1841–1845 (doesn't die 1841) |
|10| William Marcy | D-NY | 1845–1849 (creates Dept of Interior) |
|11| Millard Fillmore | W-NY | 1849 (**dies — USS Princeton cannon explosion**, w/ Henry Clay) |
|12| Jacob Broom II | W-PA | 1849–1853 (1st VP to ascend → legitimizes succession) |
|13| James K. Polk | D-TN | 1853–1861 (1st re-elect since Jackson; loses 3rd-term bid 1860) |
|14| Francis Granger | W-NY | 1861–1873 (**Civil War pres**; wins war in 2 yrs; **3 terms**; "Lincoln+FDR") |
|15| Robert E. Lee | W-VA | 1873–1877 (Unionist; ends Reconstruction; not renominated) |
|16| Howell Cobb | D-GA | 1877–1885 (ex-Confederate; "Nixon w/o Watergate") |
|17| Benjamin R. Curtis | W-MA | 1885–1887 (d. in office 1887) |
|18| Frederick Douglass | W-NY | 1887–1889 (**former slave → President via succession**) |
|19| George H. Pendleton | D-OH | 1889–1897 |
|20| James A. Gary | W-MD | 1897–1901 (3rd Spanish-American War) |
|21| Richard Yates Jr | W-IL | 1901–1904 (**assassinated**) |
|22| Silas A. Holcomb | L/D-NE | 1904–1905 (Labor/Dem fusion; succession) |
|23| Robert E. Pattison | D-PA | 1905–1909, then **1913–1921** (non-consecutive, "pulled a Cleveland") |
|24| Theodore Roosevelt | W-NY | 1909–1913 |
|26| John J. Pershing | D-MO | 1921 (resigns — "Gateway Scandal," Watergate parallel) |
|27| William Randolph Hearst | D-NY | 1921– (appointed VP → succeeds) |
> The richest single roster in the thread. **Whig party persists as a major party**
> (no realignment) — a 1840-start the shipped build does not implement. Marquee alt-history:
> **Robert E. Lee AND Frederick Douglass both President** (POST 75–76). The community
> ranks Granger their best president (3 terms, POST 161–166). Strong source of an **1840-start
> scenario** the corpus otherwise never captures — a corpus-coverage gap.

**1856 Playtest (matthewyoung123 → Pius XIII)** — D/R — *(POST 65, 66, 122, 140, 153, 182/187)*
— **✓ ≈ `hd1` (c015a0cb, "A House Divided" PART 1; Chase-president 1856 run)** *(see note)*
| # | President | Party | Years |
|---|---|---|---|
|15| James Buchanan | D-PA | 1857–1859 (**assassinated** — lone gunman) |
|16| John C. Breckinridge | D-KY | 1859–1861 (VP→succeeds; 1st succession-by-murder) |
|17| Salmon P. Chase | R-OH | 1861–1869 (**Civil War**; John Brown's Raid → secession; wins war Oct 1864; 2 terms) |
|18| Abraham Lincoln | R-IL | 1869–1871 (Chase's VP → wins 1868; **d. diphtheria 1871**) |
|19| William A. Wheeler | R-NY | 1871– (succeeds) |
> *Then the roster diverges by ~1872 from `hd1`*: by POST 122/140 a SEPARATE 1856 line
> appears — **Seward (16th), Lincoln (17th), Matthews (18th), Morton (19th, after Matthews
> assassination), Grant (20th, 1884)** — i.e. the thread tracks **two different 1856 runs**
> (the "Chase" run = `hd1`/`c015a0cb`, and a later "Seward→Lincoln→Matthews" run = the
> **"1856 Second Run"** / `hd`-family per the miraheze wiki link, POST 207). Both 1856 runs
> have multiplayer alt-Civil-War + Reconstruction; **+2-Red-for-10-yrs-post-Reconstruction**
> state bias is stated explicitly by @matthewyoung123/@vcczar (POST 151–152) — corroborates
> the Reconstruction state-lean cluster (#56–#60). LW-Pop Shortridge nearly wins 1888 in
> the "era of beards" (POST 203–205) — see balance note.

**1868 Playtest (Bushwa777)** — R/D — *(POST 46–61, 66)* — **✗ GAP (a dedicated 1868-start; distinct from `gild1868`/`gilded`)**
| # | President | Party | Years |
|---|---|---|---|
| — | Grant | R | →1872 (declines 2nd term; contested 12-ballot convention) |
|19| William B. Washburn | R | 1872– (→ falls in office, resigns) |
| — | Joseph G. Cannon | R | (VP → elevated; VP Burnside **blocked by Dem House**) |
| — | Chauncey Depew | R | 1884– (VP **Red Cloud — 1st Native American VP**, POST 66) |
> "Every one has been a 1-term [Red] President" (POST 66) — a balance signal (see below).
> Likely a *different* 1868 thread than the ingested `bf590684`/`gild1868` (whose presidents
> RED/BLUE don't match Grant→Washburn→Cannon→Depew). Treat as a **possible coverage gap**
> unless a sibling 1868 digest confirms the roster.

### C. Modern (1916 / 1948 / 1960 / 1972 / 2000 / 2012 / 2016 / 2024) runs

**1916 Playtest** — D — *(POST 8)* — **✓ = `a0b7ef49-wilsons-vision-1916-playtest`**
| President | Party | Years |
|---|---|---|
| Woodrow Wilson (#28) | D | 1913–1921+ |
> "Avoided WWII due to isolationism / weird rolls" (POST 8). Matches the ingested
> `wilsons-vision` 1916 digest.

**1948 Playtest** — D/R — *(POST 27, 38, 67, 99, 117–119, 180, 210–211, 228)*
— **✓ = `nuke` (be4e0f70, 1948→2005) + `modern` (3a9ac985, 2004→2020)** *(one continuous campaign)*
| # | President | Party | Years |
|---|---|---|---|
|33| Harry S. Truman | D | 1947–1949 (resigns — Pendergast corruption, POST 27) |
|34| Alben W. Barkley | D | 1949–1953 (1st pres via predecessor *resignation*; 1st from KY) |
|35| Robert A. Taft | R | 1953–1957 (elected on 3rd try, contested) |
|36| Edward Brooke | R | 1957–1961 (**1st African-American President**, via Taft impeachment/resign) |
|37| John F. Kennedy | D | 1960–1964 ("Justice Democrats"; turbulent rise, POST 51) |
|38| Lewis Douglas | D | 1965–1969 |
|39| Clare Boothe Luce | R | 1969–1973 |
|40| Lyndon B. Johnson | D | 1973–1981 (1972 landslide 51/52 states, POST 67) |
|41| Stan Stephens | R | 1981–1985 (**1st foreign-born [Canadian] President** — via amendment, POST 99) |
|42| Wesley A. Brown | D | 1985–1989 (1st *elected* African-American pres, POST 117) |
|43| Tom Kindness | R | 1989–1993, then **1997–2005** (non-consecutive) |
|44| Shirley Chisholm | D | 1993–1995 |
|45| Bruce Babbitt | D | 1995–1997 |
|47| Mario Cuomo | D | 2005–2009 (won all 53 states 2004, POST 180) |
|48| Thad Cochran | R | 2009– |
| — | Ron Kirk | (D) | latest (POST 228, "longest running RP") |
> The deepest modern roster. **53 states** (alt-history, incl. Cuomo/Kirk presidents) =
> the `nuke`/`modern` campaign. Confirms `nuke`+`modern` succession/impeachment machinery
> (#112), foreign-born-pres amendment, multiple Black presidents, and the **Foreign-Born
> Presidents Amendment** as in-play legislation.

**1960 Playtest (defunct; → "1962" CPU revival)** — R/D — *(POST 6, 9, 11)* — **✗ GAP**
| President | Party | Years |
|---|---|---|
| John Bricker | R-OH | 1961– (def. JFK + running-mate **Ronald Reagan**; VP Paul Laxalt) |
> LBJ and Nixon both declined to run (POST 6). Died, revival attempted as CPU "1962"
> (POST 11). NOT in corpus — coverage gap (a 1960-start; distinct from the ingested
> `8bc0231c` "Big Red Button" 1960 playtest — different president, so likely a separate run).

**1972 Playtest** — *(implicit — LBJ 1972 landslide reported under 1948 line, POST 67)* —
**✓ = `nixon1972` (4853cf4d)** exists but that run stalled 1972–74; the LBJ-1972 win here
belongs to the **1948** campaign, not `nixon1972`. (No separate 1972 roster posted.)

**2000 Playtest (defunct, old)** — R/D — *(POST 5)* — **✗ GAP (old 2000 run; ≠ Ted's `terror2000`)**
| President | Party | Years |
|---|---|---|
| George W. Bush | R | 2001–2009 (line-item veto → unlimited terms; wars Iraq/Afghanistan/**Russia**) |
| Joe Biden | D | 2009– (inherits line-item veto + unlimited terms) |
> An *earlier* 2000 run "many rules changes ago" (POST 5) — distinct from Ted's native
> 2000 run below. Coverage gap.

**2000 Playtest (Ted, native)** — R/D — *(POST 115, 134–137)* — **✓ = `terror2000` (3843da)**
| President | Party | Years |
|---|---|---|
| George W. Bush | R | 2001–2005 (9/11, no Iraq war) |
| Oprah Winfrey | D | 2005–2009 (VP Biden; ends War on Terror) |
| Tom Ridge | R | 2009 (VP Gary Johnson; won neither home state) |
> Ends Jan 2009 on the **"Autocratic Coup Ends America" game-over** (POST 136 — "first
> playtest to reach an actual Game Over"; Ventura secedes MN, Harris flees CA). **Exact
> match to `terror2000`** (Oprah beats Bush 320-215, Rockefeather coup, #88, #152). NOTE
> the Oprah-2004 vignette also appears at POST 116/116 — same run.

**2012 / Era of Populism (Rodja)** — D/R — *(POST 116)* — **✓ = `pop` (c50d9da7) / `pop2012b` (409a7c18)**
| President | Party | Years |
|---|---|---|
| Barack Obama | D | re-elected 2012 (def. Jeb Bush 285-252; faithless elector → Ron Paul) |
> Matches the two ingested 2012-start "Era of Populism" runs (Rodja). Brief mention only.

**2016 Playtest** — D — *(POST 1, 7, 44–45)* — **✗ GAP (abandoned 2016-start; ended by @ebrk85 as un-useful)**
| President | Party | Years |
|---|---|---|
| Mark Warner | D-VA | 2017– (impeached for sex scandal, acquitted; VP Jay Inslee) |
> @themiddlepolitical's run; @ebrk85 took it over then **ended it** (early setup errors
> made it un-diagnostic, POST 45). Notable: this run is **why the 2-Admin-minimum for
> cabinet members was instituted** (pman "nuked an entire cabinet" tanking meters, POST 44).
> Also: the earlier 2016 list (POST 1) had Warner-D 2017– — same run. Coverage gap.

**2024 Playtest** — R/D — *(POST 30, 35–37)* — **✗ GAP (a 2024-start; ≠ Ted's `trump2024` setup-only)**
| President | Party | Years |
|---|---|---|
| Nikki Haley | R | 2024– (**1st female President in any playtest**; VP Jim Justice) |
| Jay Inslee | D | 2028– (def. Haley in landslide; VP Seth Moulton; "oldest pres ever," POST 36) |
> @MrPotatoTed flagged the Haley→Inslee landslide as "wildly unrealistic" (POST 43) —
> attributed to maxed-Blue Party-Pref + 6 meter crises (POST 28/45). A balance data point.
> Likely distinct from the ingested `trump2024` (51dfaef1, setup-only) — coverage gap.

---

## Corpus-coverage cross-reference (the headline of this digest)

**Playtests listed here that we HAVE ingested (sibling digests exist):**
| Forum label in thread | Ingested digest |
|---|---|
| 1772 multiplayer I (Arnold→…→Osgood) | `summer2021` (fe15db25) — **★ exact alt-line match** |
| 1772 single-player (Whipple→P.Arnold→Marshall) | `principle1772` (049ce855) |
| 1772 Cal & Rezi (Bartram) | `grass1772` (5b1b2c33) |
| "Oops All CPUs" 1788 (St.Clair; Washington-dies) | `oopscpu` (699113d6) |
| Orange Democracy 1788 (Washington-resigns→Howard) | `fed` (f55d3e21) |
| "Stamping out tea" 1788→1873 (Moultrie→…→Thompson) | `tea1772` (ad0f2875) |
| 1856 (Chase Civil-War run) | `hd1` (c015a0cb), w/ later "Seward run" ≈ `hd` (77db6e6f) |
| 1916 (Wilson) | `wilsons-vision` (a0b7ef49) |
| 1948 (Truman→…→Kirk, 53 states) | `nuke` (be4e0f70) + `modern` (3a9ac985) |
| 2000 native (Bush→Oprah→Ridge, coup) | `terror2000` (3843da) |
| 2012 Era of Populism (Obama re-elect) | `pop` (c50d9da7) / `pop2012b` (409a7c18) |

**Playtests listed here that we have NOT ingested (★ candidate future uploads):**
| Forum label | Why it's a gap |
|---|---|
| **1840-start** (Harrison→…→Hearst; Granger; Lee+Douglass) | **No 1840 thread in corpus.** Longest-running game (~100 in-game yrs, 27+ presidents). A whole **1840 start scenario** + persistent-Whig-party timeline. **Highest-value gap.** |
| **1868-start (Bushwa)** (Grant→Washburn→Cannon→Depew; Red Cloud VP) | Roster ≠ ingested `gild1868`/`gilded`; "all 1-term Red" run. Possible separate 1868 thread. |
| **1960-start** (Bricker def. JFK/Reagan) | President ≠ ingested `8bc0231c` 1960 run → likely a distinct 1960 thread; defunct, CPU-revived as "1962." |
| **2016-start** (Warner; cabinet-nuke) | Abandoned; the run that **drove the 2-Admin cabinet-minimum rule**. |
| **2024-start** (Haley→Inslee) | ≠ ingested `trump2024` (setup-only); Haley = 1st female pres. |
| **1788 "Original" + "2nd" + "3rd" playtests** (Washington/Gallatin/Hamilton…; Paine/Ellsworth/Reed; Paine/Burr/J.Jackson) | Pre-current-forum "really old version" runs; only @vcczar's saved history-grid exists (POST 18/24). Almost certainly unrecoverable, but **named in the record**. |
| **2000 "old" run** (Bush unlimited-terms → Biden) | An earlier 2000 run distinct from `terror2000`; defunct. |
> Also referenced: external **miraheze "AMPU wiki"** sandboxes hold full lists for the
> 1800 and 1856 runs (POST 143, 207) — a secondary archive, not ingested.

---

## Balance signal (feeds PV / election-balance #18 / #184 / #192) — light

- **No party hegemony.** @vcczar's recurring observation (POST 9–10): across playtests
  "we have **not had three terms of the same party in power**" AND "**not had one party
  in power the entire time**" — i.e. the engine produces **regular alternation**, no
  permanent lock. This is the single clearest cross-playtest balance datum (positive).
  *Exceptions exist:* 3-term presidents (Granger, Pattison) and long single-party stretches
  occur but reverse.
- **Incumbents lose a lot in the early/mid 19th-c. lines.** The 1840 line: Harrison,
  Marcy, Broom all fail re-election; "first re-elected since Jackson" is remarked of Polk
  (1856) — suggests **early-era incumbency is weak / volatile** (many House-decided
  contingent elections too: Polk 1852, Yates 1900, the 1840-line repeatedly).
- **Third parties throw elections to the House** repeatedly (Polk 1852, Yates 1900 [Labor
  2nd], Cogswell-vs-Colfax 1892, Matthews 1876 Liberal Republicans) — the contingent-election
  path fires often in these eras (corroborates #84/#93 contingent-election machinery).
- **Ideology/region wins that "shouldn't":** LW-Populist **Eli Shortridge nearly wins 1888**
  in the 1856-Second-Run "era of beards" (POST 203–205, deliberately engineered by a player);
  **failing-upward Silas Wood** (no cabinet/military, 4 command + integrity/charisma) sweeps
  the EC in the 1800 line (POST 79) — i.e. **command + personality traits can dominate
  résumé**, a PV-weighting signal worth noting for #18/#184.
- **Foreign-born eligibility** is a recurring friction point: an **amendment** is the only
  in-game path (POST 99, 192–199); conquered-territory natives (e.g. Canadian-born) stay
  ineligible for the presidency (designer-confirmed "natural BORN" reading, vcczar+Ted,
  POST 196–199) — bears on the succession/eligibility cluster (#61).

---

## Candidate gaps for consolidation (hand-off; expect FEW — this is a record)

1. **CORPUS-COVERAGE NOTE (primary output):** this thread enumerates **~20 distinct
   playtests**; **11 are ingested**, **≥7 are NOT** (1840-start [highest value], 1868-Bushwa,
   1960-start, 2016-start, 2024-start, the three "old-forum" 1788 runs, the "old" 2000 run).
   The **1840-start scenario** (persistent-Whig, ~100 in-game years, 27 presidents,
   Lee+Douglass) is the most valuable un-ingested run — recommend flagging for upload.
2. **Balance observation (light, → #18/#184/#192):** the designer's own cross-playtest read
   is **healthy party alternation** (never 3 same-party terms, never one-party-forever) —
   a *positive* signal the PV/election engine is not lopsided at the topline; but **trait/command
   over-weighting** (Silas Wood "failing upward," LW-Pop Shortridge upset) and **early-era
   incumbency weakness + frequent House-decided elections** are sub-signals worth a roadmap glance.
3. **No NEW mechanics/gaps to log** — every rule touched (succession/VP-inherits-full-presidency,
   age-100 retirement, post-Reconstruction +2-Red-10yr, foreign-born amendment, 2-Admin
   cabinet minimum origin, House contingent elections, military-dictatorship game-over) is
   **already captured** in sibling digests (#61, #56–#60, #84/#93, #88, governing rules).
   This thread **corroborates** them with concrete rosters; it does not extend them.

**Open question for the human:** are the **1840-start**, **1868-Bushwa**, **1960-start**,
**2016**, and **2024** runs available as forum exports? They are named, active-for-years,
and entirely absent from the ingested corpus.
