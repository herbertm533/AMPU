# AMPU — Historical Grounding of the Meter Trajectories

> Companion to `historical-context.md`. Grounds ONE dimension of the Meters dataset:
> the **"Meter Position by Start Date"** boot-seed (23 meters × 61 presidential cycles,
> 1772 → "Beyond"), the designer's judgment of each meter's **real historical trajectory**.
> Source artifact: `docs/game/sources/meters/meters_position_by_startdate.csv` (gitignored).
> Mechanics (effects/crises/scale) are covered in `sources/meters/analysis.md` — NOT re-derived here.
>
> **Scale:** positions run **1 (crisis/hostile/bad) → ~5 (neutral) → 8 (excellent)**;
> foreign-relations meters run to **9** (9 = closest alliance, 1 = at war).
> This is a **light** grounding pass — marquee inflection points spot-checked against
> well-known US history, not all 23×61 cells verified.
>
> Confidence: unmarked = consensus history (dated events cited below); **[design]** = a
> game-ification / designer read, not a factual error; **[flag]** = ahistorical or mistimed,
> see the game-master section.

---

## 1. Fiscal & economic

| Meter | Real-history arc | Key inflections (sheet pos) | Grounding |
|---|---|---|---|
| **Revenue-Budget** (5=balanced, high=surplus) | Revolutionary/Confederation debt crisis → Hamiltonian funding + tariff/land-sale surpluses → **national debt fully retired 1 Jan 1835** → Civil War & Gilded Age deficits → 1920s Mellon surpluses → New Deal & modern chronic deficits | 1772–88 = **2** (war/Confederation debt); 1832–36 = **7** (debt = $0, 1835); 1924–28 = **7** (Coolidge/Mellon surplus); 1932 = **3** (New Deal deficit); 2012–Beyond = **3** (modern deficits) | Solid. Debt-payoff peak lands exactly on 1835. Minor: 1812 = 6 understates War-of-1812 borrowing (debt tripled to ~$127M by 1815). |
| **Economic Stability** (5=stable, 8=boom) | Neutral early → Embargo/war shocks → 19th-c. panic cycle → Roaring 20s → Depression → postwar boom → stagflation → Reagan/Clinton boom → Great Recession → COVID | 1808–12 = **4** (Embargo 1807 / War of 1812); 1836 = **4** (Panic of 1837); 1860 = **4** (Panic of 1857 / secession); 1872–76 = **4** (Panic of 1873, Long Depression); 1892–96 = **4** (Panic of 1893); 1924 = **9** (Roaring 20s); **1932 = 1** (Great Depression nadir); 1976–80 = **4** (stagflation); 1984–2000 = **7** (Reagan/Clinton boom); 2008 = **3** (Great Recession); 2020 = **4** (COVID) | Strong — nadir at 1932 and 2008 both correct. **[flag]** Panic of 1819 (first major US financial panic) is **missing**: 1816–24 held at **8**. **[flag]** Panic of 1907 barely registers (1908 = 5). |

## 2. Foreign Relations — ★ activation timing (the sheet's most checkable claim)

Each non-UK/France/Spain meter should sit at neutral (5) until the two nations actually
engage. Activation timing verified against the founding treaty/event:

| Nation | Sheet activation (1st non-5) | Real "becomes salient" event + date | Verdict |
|---|---|---|---|
| **UK** | 1772 = **1** (born hostile) | Revolution; Treaty of Paris **1783**; Jay Treaty **1794**; War of 1812 | Correct. 1772 = 1 (war), recovers to 5 by 1796 (Jay Treaty), dips to 3 at 1808–12 (impressment/War of 1812), rises to **9** ("special relationship") from WWII (1944) on. |
| **France** | 1772 = **6**, 1788 = **9** | Treaty of Alliance **6 Feb 1778** (Revolutionary alliance) | Correct. Peaks 9 at 1788; **Quasi-War (1798–1800)** dip shown as a mild 9→6 at 1796–1800 **[design]** (understated but present); Civil War dip to 4 (Napoleon III / Maximilian in Mexico); 9 again at WWII liberation (1944); de Gaulle-era dip to 5 (1960, NATO exit 1966). |
| **Spain** | 1788 = **6** | Pinckney's Treaty (San Lorenzo) **1795**; Adams-Onís **1819** | Reasonable. Cordial early (Mississippi access), declines to 4 mid-century (Florida, Cuba/Ostend Manifesto), **nadir 3 at 1896** (pre-Spanish-American War 1898), Franco-era dip to 3 (1932–52), recovers post-Franco (1976 = 7). |
| **Germany** | **1912 = 4** | **German Empire proclaimed 18 Jan 1871**; Wilhelmine naval/colonial friction 1889–1903; US enters WWI 1917 | **[flag]** Activates ~**40 yrs after unification** and erases the pre-1871 Prussia relationship (US–Prussia Treaty of Amity & Commerce, 1785). Defensible as "salient to US only at WWI." Nadirs **1** at 1916 (WWI) & 1944 (WWII); Cold-War ally **9** from 1984. |
| **Russia** | 1868 = **6** (minor), 1912 = **4** | US–Russia relations from 1809; Civil War friendship 1863; **Alaska Purchase 1867**; 1832 commercial treaty **abrogated 1911**; USSR recognized 1933 | Reasonable. Kept low-salience early (correct); 1868 = 6 nicely marks Alaska; 1912 = 4 has a real basis (1911 treaty abrogation). **WWII alliance 9 at 1944 → crashes to 4/3 (Cold War) → thaw 5 at 1988 (Gorbachev) → post-Crimea decline to 3 by 2020.** |
| **China** | **1844 = 6** | **Treaty of Wanghia signed 3 Jul 1844** (first US–China treaty, Caleb Cushing) | **Excellent — exact.** Returns to neutral, then all marquee beats correct: WWII ally **9** (1944), Korea nadir **3** (1952, PRC 1949), **Nixon opening 5 (1972)**, modern trade-war decline to 3 (2020). |
| **Japan** | **1852–56 = 4** | **Perry expedition 1853; Convention of Kanagawa 31 Mar 1854** | **Excellent — exact.** Coercive-opening read as a dip to 4 **[design]**. 1930s decline (Manchuria/immigration), **Pearl Harbor nadir 1 (1944)**, post-war rehabilitation to ally **9** (1972+). |
| **Israel** | **1948 = 7** | **Truman recognition 14 May 1948** (US first country to recognize) | **Perfect — exact to the founding.** Deepens to **9** from 1972 (post-1967 alliance) onward. |

**Activation summary:** China (1844), Japan (1853/54), and Israel (1948) hit their real
activation dates precisely; Russia is reasonably kept low-salience until the Cold War;
**Germany is the one meaningfully mistimed meter** (1912 vs. 1871 unification / 1890s friction).

## 3. Military, domestic, governance, quality-of-life, environment

| Meter | Real-history arc | Key inflections (sheet pos) | Grounding |
|---|---|---|---|
| **Military Preparedness** | Weak Revolutionary force → episodic wartime ramps → interwar isolationism → Cold-War standing military | 1772–92 = **2** (weak Continental Army); 1848 = 7 (Mexican War); **1864 = 7** (Civil War mass army); 1908 = **8** (Great White Fleet, 1907–09); 1916 = 7 (WWI); 1928–36 = **4** (interwar disarmament); **1944 = 9** (WWII peak); 1984 = 7 (Reagan buildup) | Strong. **[design]** War of 1812 stays at 5 — but the US was famously *under*-prepared in 1812, so arguably accurate. |
| **Domestic Stability** | Revolutionary instability → Era of Good Feelings calm → sectional collapse → Reconstruction → 20th-c. cycles → modern polarization | 1796–1808 = 7 (Federalist order); **1820 = 9** (Era of Good Feelings peak); **1860–64 = 1** (secession/Civil War nadir); 1876 = 3 (disputed election); **1968 = 3** ('68 upheaval: MLK/RFK, riots); **2016–20 = 3** (polarization/2020 unrest) | Strong on the four expected dips (Civil War, late-1960s, 2020). **[flag]** Great Depression dip is **mild** (1932 = 4, not 1–2) — the Depression is carried by Economic Stability, not Domestic. **[flag]** 1924 = **9** likely overstates 1920s calm (KKK peak ~1924, Red Scare aftermath). |
| **Honest Government** | Founding-era virtue → Gilded Age machine corruption → Progressive/civil-service reform → Watergate → modern distrust | 1772–92 = 7; **1872–80 = 3** (Grant scandals, Crédit Mobilier 1872, Whiskey Ring, Tweed); 1884 = 4 (Pendleton Act 1883); **1972 = 3** (Watergate); 2016–Beyond declines 3→2 | Solid — the two classic corruption nadirs (Gilded Age, Watergate) both land. |
| **Quality of Life** | Slowly rising living standards; no sharp inflections | Flat ~4 through 19th c.; 5 in Progressive/New Deal era; **6 at 1968–72** (Great Society, Medicare/Medicaid 1965); mild modern decline to 3 | Reasonable as a slow-moving meter; Great Society bump is the one clear beat. Low granularity by nature. |
| **Planet's Health** | Pristine pre-industrial → monotonic decline with industrialization & climate change | 9 through 1856; begins declining ~1860 (industrialization); monotonic 9→1 to present (2020 = 1) | Broadly correct as a secular decline. **[design]** No post-1970 recovery (Clean Air Act / EPA 1970) — defensible if framed as cumulative climate rather than local air/water quality. |

## 4. Party Preference & the 7 Enthusiasm meters (largely game-mechanical)

These encode partisan tides / per-ideology energy — inherently a **design model**, not
objective history, and the polarity of "Party Preference" is a game convention. Still, the
**extreme swings align with real realignments**: Party Preference hits ceiling/floor at
1868–72 (post-Civil War Republican dominance), **1932–36 & 1964** (New Deal / LBJ Democratic
surges), and **1984** (Reagan landslide). Enthusiasm meters resonate at the margins —
Conservative Enthusiasm = 9 in 1896–1900 & 1920–28 (McKinley→Coolidge business GOP) and the
1980s (Reagan); **Right-Wing Populist & Traditionalist Enthusiasm sit near 1 for most of US
history and rise only in the modern era (2016–20 = 9)**, tracking the Trump-era populist right.

**[flag]** **Left-Wing Populist Enthusiasm = 1 at 1896** — counterintuitive, since the 1896
Bryan "Cross of Gold" / People's Party campaign was the agrarian-populist electoral *peak*.
Defensible only if read as *post-defeat collapse* (Populists were absorbed/broken after 1896).
Verify the intended reading before treating it as ground truth.

---

## Divergence flags for the game-master

1. **★ Germany activates too late (1912).** Germany unified **18 Jan 1871**; US–Prussia
   treaty relations date to 1785; Wilhelmine friction ran 1889–1903. The sheet holds Germany
   at neutral (5) until 1912, so a game booting 1872–1908 will show no German relationship
   despite Germany being a real rising power. Everything WWI-onward is correct.
2. **Panic of 1819 is missing from Economic Stability.** The first major US financial panic
   leaves no dip (1816–24 held at 8). Panic of 1907 also barely registers (1908 = 5). A boot
   at 1820 will read as a boom, not a bust.
3. **The Great Depression shows as economic, not domestic.** Economic Stability correctly
   craters to **1** at 1932, but Domestic Stability only dips to 4. If the design wants the
   Depression to feel like a *social* crisis (Bonus Army, unrest), Domestic Stability is
   under-weighted there; conversely 1924 Domestic = 9 likely overstates 1920s calm.
4. **Foreign-relations "coercive opening" convention.** Japan's forced opening (Perry 1853)
   is modeled as a *dip* to 4, not a rise — i.e., low = adversarial/coerced, not merely
   "no relationship." Applies to how the sheet reads early contact; note this when mapping
   FR positions to sentiment. (Timing is exact: China 1844, Japan 1853/54, Israel 1948.)
5. **Left-Wing Populist Enthusiasm = 1 at 1896** contradicts the naive read of the Bryan/
   Populist peak. Confirm whether the meter tracks *movement momentum* (should be high 1892–96)
   or *post-election outcome* (crash after 1896 defeat) before wiring it to events.

## Citations
- Treaty of Wanghia, 3 Jul 1844 — https://www.visitthecapitol.gov/artifact/treaty-wangxia-treaty-peace-amity-and-commerce-between-united-states-and-china-july-3-1844 ; context: https://history.state.gov/milestones/1830-1860/china-1
- Convention of Kanagawa, 31 Mar 1854 (Perry, 1853) — https://history.state.gov/milestones/1830-1860/opening-to-japan
- US recognition of Israel, 14 May 1948 (first nation) — https://www.trumanlibrary.gov/education/presidential-inquiries/recognition-israel ; https://www.archives.gov/milestone-documents/press-release-announcing-us-recognition-of-israel
- US national debt = $0, 1 Jan 1835 (only time in history) — https://www.history.com/this-day-in-history/january-1/andrew-jackson-national-debt-reaches-zero-dollars ; https://www.treasurydirect.gov/government/historical-debt-outstanding/
- Proclamation of the German Empire, 18 Jan 1871 — https://en.chateauversailles.fr/discover/history/key-dates/proclamation-german-empire-1871 ; https://www.britannica.com/event/Franco-German-War
- Creation of Israel, 1948 (State Dept milestone) — https://history.state.gov/milestones/1945-1952/creation-israel
- Consensus dates used without a fresh fetch (Franco-American Treaty of Alliance 6 Feb 1778; Jay Treaty 1794; Quasi-War 1798–1800; Panics of 1819/1837/1857/1873/1893/1907; Alaska Purchase 1867; Great White Fleet 1907–09; US entry into WWI 1917; WWII 1941–45; Great Society/Medicare 1965; Watergate 1972–74; EPA/Clean Air Act 1970).
