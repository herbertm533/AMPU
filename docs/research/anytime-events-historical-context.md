# Historical Context: Anytime Events (Phase 2.4.2)

## Era window
1772 — present. The feature spans the full game timeline across all four
era buckets (independence, federalism, nationalism, modern). Several event
categories — duels, smallpox, mass-media wire scandals, automobile crashes,
TV-debate disasters — are sharply era-bounded and must not leak across the
era seams.

## Binding facts (PM should treat these as ground truth)

**1. Dueling was a real occupational hazard for politicians from ~1790
through ~1860, very unevenly by region.** Pennsylvania criminalized dueling
as early as 1794; by the 1830s duels were rare in the North; the Southern
"code duello" persisted until the Civil War experience discredited it; by
1868 most state constitutions had anti-dueling clauses. Hamilton (1804),
Clay-Randolph (1826), the Foote-Benton pistol-draw on the Senate floor
(April 17, 1850), and the Brooks caning of Sumner (May 22, 1856, with
Sumner kept from the Senate until December 1859 from "physical and
psychological injuries") all happened. [Consensus — see PBS, Senate.gov,
LOC, Wikipedia caning entry citations below]
*Design implication:* a "duel/political violence" event type must be
gated by both era (independence + federalism, fading early in
nationalism, none in modern) and by region/state (much more Southern).
Modern political violence is **assassination/attempt**, not duel.

**2. Hidden vs. public illness is era-dependent.** Calhoun's tuberculosis
was visible — his March 4, 1850 Senate speech had to be read by Senator
Mason because Calhoun was too weak. Webster's cirrhosis killed him in
office. W.H. Harrison's death after 31 days was attributed to "pneumonia"
by contemporaries (modern scholarship suggests enteric fever from
White-House-area sewage-contaminated water). FDR's polio was actually
*known* to contemporaries despite the modern myth that it was hidden;
Eisenhower's 1955 heart attack was disclosed within hours but initially
softened ("mild"); Wilson's 1919 stroke WAS hidden by his wife and
physician for 17 months. The pattern: pre-1900 illness was visible because
politicians lived among their colleagues; 20th-century illness could be
managed/hidden via controlled press access; modern era illness is mostly
visible again because of constant scrutiny. [Consensus per Senate.gov,
Cambridge Politics & Life Sciences, FDR Library, History.com citations]
*Design implication:* the same illness event can have different visible-
to-other-politicians consequences by era. The PM may or may not model
visibility; either way, don't assume "Frail" was always equally legible.

**3. The mass-media scandal cycle is a post-1880s phenomenon.** Wire
services (Associated Press, 1846) plus the Pulitzer-Hearst yellow press
circulation wars (1883–1898) created the first nationally-amplified,
sensational political scandal apparatus. Pre-1880s scandal existed
(Hamilton/Reynolds 1797 pamphlet; Credit Mobilier 1872 exposed by the New
York Sun) but ran on partisan pamphlets and party-aligned papers — slower,
less viral. The Reynolds pamphlet is paradigmatic of pre-mass-media
scandal management: Hamilton voluntarily published a 95-page self-defense
that admitted adultery to refute corruption charges, an unimaginable move
in any post-1900 media environment. [Consensus — Britannica yellow
journalism, NYAM history, History.com Hamilton]
*Design implication:* the PV/career hit from "scandal" should scale up
across eras as media reach grows — small in independence, moderate in
federalism, big in nationalism, biggest in modern.

**4. Career-ending scandal was historically rare even when scandal
fired.** Credit Mobilier (1872) implicated VP Schuyler Colfax, Speaker
Blaine, Rep. Oakes Ames, Rep. James Brooks, and roughly a dozen members —
"few consequences" was the verdict; Blaine was the 1884 Republican
presidential nominee. Albert Fall was the FIRST cabinet officer ever
convicted of a crime (Teapot Dome, sentenced 1929). Abscam (1980)
convicted seven members of Congress for bribery — still a small share of
total membership. Bill Clinton was impeached, acquitted, and finished his
term. Hamilton's Reynolds Pamphlet damaged his presidential prospects but
he remained a major Federalist figure until his 1804 death. [Consensus —
House.gov, Britannica, FBI history]
*Design implication:* "scandal fires" is much more common than "career
ends from scandal." Pool weighting should reflect this; outright career
end belongs in a separate retire/death-equivalent branch, not the default
scandal outcome.

**5. Antebellum epidemic disease was a genuine politician-mortality
factor, not just a civilian one.** Yellow fever hit Philadelphia annually
1793–1805 (1798: 3,645 deaths in Philadelphia alone). Washington and
Jefferson fled the 1793 outbreak. James K. Polk died of cholera June 15,
1849, age 53, three months after leaving the presidency, during the
1846–1860 cholera pandemic that killed 311 in Nashville (population
~10,000) in 1849. Smallpox inoculation was practiced from the 1720s; it
became a politician-relevant risk-management decision Franklin championed
after losing his son in 1736. [Consensus — Foreign Affairs, NYAM, Polk
Museum, Tennessee state historical sources]
*Design implication:* an "epidemic illness" event category is era-tagged
to independence + early federalism (yellow fever) and federalism (cholera
1832, 1849). Polio is 1900–1955 specifically. After ~1955 the dominant
illness-event categories are cardiac, cancer, and stroke.

**6. Skill discovery / breakthrough is a real biographical phenomenon
but rare and usually represents the public surfacing of long-held latent
ability, not genuine mid-career skill acquisition.** Clay's mastery of
legislative compromise was visible from his first day as Speaker in 1811,
not "acquired" later. William Jennings Bryan's "Cross of Gold" speech
(July 8, 1896) DID transform a 36-year-old two-term ex-Congressman into
the Democratic presidential nominee overnight — an authentic case of an
event-driven public recognition jump. LBJ's "treatment" was a Senate-years
development of skills already evident in his House years. Reagan's TV
mastery was 30 years of radio and Hollywood training. [Consensus —
Britannica Bryan, World History Encyclopedia Clay, Reagan biographies]
*Design implication:* "+1 skill" event types are defensible but should
be rare; "breakthrough public recognition" (a single great speech, a
crisis-management moment) is more historically grounded than
"discovers a hidden talent." Be skeptical of mid-career +1 admin or
+1 judicial from a random event — those skills accrue slowly through
the career-track system already in the game.

**7. Religious conversion produced real political realignment during the
Second Great Awakening (~1790–1840) and again during 1890s populism, but
NOT uniformly across eras.** The Second Great Awakening directly fueled
abolitionism (Garrison), temperance, women's rights, and education
reform; "personal moral responsibility" theology converted Northern
politicians into reformers in identifiable cohorts. The 1890s populist
moment converted Southern Democrats like Tom Watson (elected 1890, joined
Populists 1891) — and after defeat radicalized Watson into white
supremacism by 1900, a hard reminder that conversions can go in any
ideological direction. [Consensus — UNG University Press, Georgia
Encyclopedia, Cambridge Social Science History]
*Design implication:* "religious conversion" and "ideological conversion"
events should fire more frequently in 1790–1840 and 1890–1910 windows,
much less in 1840–1890 and post-1910. Direction of conversion is NOT
uniformly toward the player's own ideology.

**8. Period-appropriate fatal accidents change shape across eras.** Pre-
1900: horse falls, drowning, frontier violence, dueling, war-wound
infection. 1900–1955: train wrecks, early auto crashes, early aviation
deaths. Post-1955: car crashes (Chappaquiddick 1969 — Kennedy survived,
Kopechne drowned, career derailed but not ended), commercial flight
(Carnahan 2000, Wellstone 2002 both died campaigning). [Consensus per
History.com, ABC News, VOA, Seattle Times reporting]
*Design implication:* "transportation accident" is era-keyed; the same
event template needs different flavor text per era; the death-vs-injury
outcome split is plausible across eras but the *kind* of conveyance
is not interchangeable.

## Key figures (anchors for event templates)

- **Calhoun** (TB-frail in 1849–50; speech read by Mason March 4, 1850; died
  March 31, 1850 at 68) — anchor for "Frail acquired late career, still in office."
- **Webster** (cirrhosis-frail in 1852; died in office Oct 24, 1852 at 70) — anchor for
  "alcohol-related illness," era-agnostic but never named as alcoholism in 1850s press.
- **W.H. Harrison** (died 31 days into presidency 1841, "pneumonia"/sepsis) —
  anchor for "sudden-onset acute illness kills."
- **Polk** (died of cholera 3 months after leaving office, 1849, age 53) — anchor
  for "epidemic during retirement years."
- **Hamilton** (Burr duel 1804; Reynolds pamphlet 1797) — anchors for BOTH dueling-
  death AND publicly-confessed sex scandal.
- **Sumner** (Brooks caning 1856; out of Senate until Dec 1859) — anchor for
  "political violence injury, multi-year recovery, Frail trait gained."
- **Andrew Jackson** (Lawrence assassination attempt Jan 30, 1835; both pistols
  misfired) — anchor for "near-miss attempt, no injury, narrative momentum."
- **Lincoln, Garfield, McKinley, JFK** — four assassinated presidents; anchor
  for "assassination during office."
- **FDR** (polio 1921 at 39; presidency 1933–45) — anchor for "polio acquired
  mid-career, governs while disabled."
- **LBJ** (heart attack July 2, 1955, age 47, as Senate Majority Leader; full
  recovery, became VP 1961, Pres 1963) — anchor for "major heart event,
  recovers, returns to high office."
- **Eisenhower** (heart attack Sept 24, 1955; disclosed quickly; ran for and
  won 1956) — anchor for "modern disclosed cardiac event, no career harm."
- **Wilson** (stroke Oct 2, 1919, age 62; hidden by wife/doctor 17 months) —
  anchor for "hidden incapacity," but historically anomalous (the Wilson case
  is famous *because* it was unusual even for 1919).
- **Bryan** (Cross of Gold July 8, 1896) — anchor for "single speech that
  vaults a politician to national stature" (PV/command bump, not skill+1).
- **Tom Watson** (1890 Democrat → 1891 Populist → 1900+ white-supremacist
  reactionary) — anchor for "ideological/religious conversion in either
  direction."
- **Albert Fall** (Teapot Dome; first cabinet officer convicted, 1929) —
  anchor for "scandal → prison → career destruction" (rare outcome).

## Timeline of relevant events

- **1736**: Franklin loses son to smallpox; champions inoculation.
- **1793–1805**: Annual yellow fever outbreaks; Philadelphia 1798 = 3,645 dead.
- **1797**: Reynolds Pamphlet — first American sex scandal in print.
- **1804** (Jul 11): Hamilton-Burr duel.
- **1826** (Apr 8): Clay-Randolph duel — both miss.
- **1832, 1849, 1854, 1866**: Major US cholera epidemics.
- **1835** (Jan 30): Andrew Jackson assassination attempt — both pistols misfire.
- **1841** (Apr 4): W.H. Harrison dies, 31 days into office.
- **1849** (Jun 15): Polk dies of cholera at 53.
- **1850** (Apr 17): Foote draws pistol on Benton in the Senate.
- **1850** (Mar 31): Calhoun dies (TB).
- **1852**: Clay (Jun) and Webster (Oct) die in office.
- **1856** (May 22): Brooks canes Sumner; Sumner absent from Senate until
  Dec 1859.
- **1865** (Apr 14): Lincoln assassinated.
- **1872**: Credit Mobilier exposed by New York Sun.
- **1875**: Whiskey Ring — 238 indictments, 110 convictions.
- **1881** (Jul 2): Garfield shot, dies Sept 19.
- **1883–1898**: Pulitzer-Hearst yellow journalism circulation war.
- **1896** (Jul 8): Bryan's Cross of Gold speech.
- **1901** (Sep 6): McKinley shot, dies Sept 14.
- **1919** (Oct 2): Wilson stroke (hidden 17 months).
- **1921** (Aug): FDR contracts polio at 39.
- **1923** (Apr): Teapot Dome exposed; Fall convicted 1929.
- **1955** (Jul 2): LBJ heart attack at 47. (Sep 24): Eisenhower heart attack.
- **1963** (Nov 22): JFK assassinated.
- **1968**: RFK and MLK assassinated.
- **1969** (Jul 18): Chappaquiddick.
- **1972–74**: Watergate.
- **1980** (Feb 2): Abscam exposed.
- **1981** (Mar 30): Reagan shot, survives.
- **1987**: Gary Hart-Donna Rice "Monkey Business" — first modern
  campaign-ending sex scandal.
- **1998**: Clinton-Lewinsky; Clinton impeached, acquitted.
- **2000** (Oct 16): Mel Carnahan dies in plane crash three weeks before
  winning his Senate election posthumously.
- **2002** (Oct 25): Paul Wellstone dies in plane crash 12 days before
  election.
- **2011**: Anthony Weiner sexting scandal — resigns from Congress.

## Recommended event-type taxonomy

The PM should think in roughly these categories. Each row lists eras of
strongest activity and a representative game effect (the PM owns the
exact mapping). Era ordering: I=independence, F=federalism, N=nationalism,
M=modern.

| Category | Active eras | Sample sub-events | Plausible trait/skill effect |
|---|---|---|---|
| Acute illness — non-epidemic | All | Pneumonia, "fevers," cardiac (modern), stroke (modern) | +Frail, occasional PV hit; rarely outright death (that's 2.4.1) |
| Acute illness — epidemic | I, F (yellow fever, cholera, smallpox); M (flu pandemic 1918/COVID 2020) | Yellow fever (1793–1805), cholera (1832/49/54/66), 1918 flu, polio (1900–55) | +Frail; small PV hit; era-bounded flavor text |
| Chronic illness onset | All | TB (pre-1900), cirrhosis (era-agnostic, framed differently), polio (1900–55), cardiac (modern), cancer (modern) | +Frail; one skill-point loss |
| Injury — non-political | All | Horse fall (I/F), train wreck (F/N), auto crash (N/M), plane crash (M) | +Frail; small chance death |
| Political violence — duel | I, F (Southern), early N (Southern) | Duel survived/wounded/killed/declined | command/+/- depending; trait shift; rarely death |
| Political violence — assault | F especially; sporadic across all | Brooks caning, Foote-Benton, modern brawls | +Frail (Sumner); +Controversial |
| Political violence — assassination/attempt | F (Jackson 1835); N (Lincoln, Garfield, McKinley); M (JFK, RFK, Wallace, Reagan, Trump 2024) | Attempt missed / wounded / killed | death OR +Charismatic from sympathy bump (Reagan); rare event |
| Scandal — financial/ethical | All; intensity rises | Bribery, insider stock (Credit Mobilier), tax fraud (Whiskey Ring), oil-lease bribery (Teapot Dome), FBI sting (Abscam) | +Scandalous, +Corrupt, PV hit; rare career-end |
| Scandal — sexual | All; visibility era-dependent | Hamilton/Reynolds, modern affairs/sexting | +Scandalous; usually no career-end pre-modern; can end modern career |
| Scandal — verbal/oratorical disaster | All; medium-amplified | Bad speech (any era); radio/TV gaffe (M); social-media meltdown (post-2008) | +Controversial; PV hit |
| Religious conversion | I (Awakening 1790s); F (Second Great Awakening 1790–1840); peak N for populist conversions 1890–1910 | Personal revival; conversion to abolitionism; conversion to populism | Ideology shift one step; +Puritan/+Ideologue |
| Ideological conversion (secular) | All; sharper in M | Joins/leaves party position; lukewarm-to-zealot transition | Ideology shift; +Ideologue, +Flip-Flopper risk |
| Skill/talent recognition (NOT acquisition) | All | "Great speech" (Bryan 1896), "great compromise" (Clay 1820, 1850), "great cross-examination" (court setting) | command +1 or +Orator/+Debater/+Charismatic; PV bump; NOT a raw skill point bump in the engine |
| Mentorship / backroom apprenticeship | All; usually inside Kingmaker system already | Senior senator mentors junior on procedure | +Backroom Operator-equivalent (+Manipulative/+Kingmaker/+Numberfudger) |
| Financial windfall/reverse | All | Land speculation gain/loss, panic-of-19xx ruin, marriage to heiress | +Business or PV change; rarely career-affecting |
| Family event | All | Death of child/spouse; marriage; war service of a son | Temporary PV hit; possible "Frail" if grief is described as breaking health |
| War service / heroism (when at war) | I (Revolution), F (1812, Mexican-American), N (Civil War, Spanish-American, WWI), M (WWII, Korea, Vietnam) | Combat injury, decoration, command moment | +Military/+Naval/+Leadership; +Frail if wounded |

## Era-specific event tags (must NOT appear outside their era)

- **Duel** — I, F. Vanishingly rare in N (post-1865 Southern fade), absent in M.
- **Smallpox / yellow fever / cholera** — I, F. Polio: only ~1900–1955.
  1918 flu: nationalism. COVID/modern pandemic: M.
- **Horse fall / drowning crossing river** — I, F primarily; rare in N+.
- **Caning / floor fistfight** — F peak; occasional in others (the 1798
  Griswold-Lyon spitting-and-cane fight on the House floor; modern brawls
  exist but are uncommon).
- **Train wreck** — F (post-1840) through N; rare M.
- **Automobile accident** — late N (post-1908) onward; absent before.
- **Airplane crash** — only M (post-1930 for survivable; 1960+ realistic for
  campaigning politicians).
- **Telegraph-amplified scandal** — F (1846+) onward.
- **Yellow-press national scandal cycle** — N (1880s+) onward.
- **Radio gaffe** — M (1920+).
- **TV-debate disaster** — M (1960+).
- **Social-media meltdown** — M (2006+ realistic, 2011+ for Weiner-style).
- **FBI sting / federal corruption probe** — M (post-1908 FBI founding;
  realistically post-1960 for sophisticated stings).
- **Religious revival / awakening conversion** — I (First Great Awakening
  echoes), F (Second Great Awakening 1790–1840 peak), late N (Third Great
  Awakening 1850–1900); much rarer in M for politicians specifically.

## Period-specific terminology

- Pre-1900 illness vocabulary: "consumption" (TB), "the fevers" (yellow
  fever, cholera, typhoid lumped), "apoplexy" (stroke), "dropsy" (heart
  failure / edema), "neurasthenia" (post-Civil-War overwork), "alienism"
  (mental illness). Avoid "polio" pre-1900 (the term enters medical
  literature 1874 but doesn't reach political vocabulary until FDR).
- "Scandal" itself is a period-correct word in all eras; "sex scandal" is
  post-1880s as a discrete genre. Pre-1880: "affair of honor," "the
  Reynolds affair."
- "Duel" / "code duello" / "affair of honor" / "satisfaction" — period-
  correct I-F. Modern: "altercation," "incident."
- "The Treatment" — LBJ-specific; do NOT label any pre-1950 backroom
  persuader with that phrase.
- "Great Communicator" — Reagan-specific; do NOT apply to pre-1950s figures.
- "Great Compromiser" — Clay-specific (federalism era); the trope of
  compromise exists in all eras but the title belongs to Clay.

## Common pop-history simplifications and what they get wrong

- **"FDR hid his polio."** Partial-myth. He was photographed with leg
  braces, walked publicly on aides' arms, and journalists/contemporaries
  knew. He minimized wheelchair imagery for the *gait* of authority, not
  to conceal disability. [Tobin via NPR]
- **"W.H. Harrison's long inaugural speech killed him."** Recent
  scholarship blames White-House-area sewage contamination → enteric
  fever, not the chilly inauguration. The "cold rain" story is popular but
  medically incomplete.
- **"Dueling was illegal everywhere by 1800."** False. Pennsylvania 1794
  was an early outlier; Northern duels fade by 1830s; Southern duels
  persist until the Civil War; most state constitutional bans are 1860s.
- **"Watergate ended careers en masse."** Partially. It elected the
  "Watergate Babies" Class of 1974 (91 new House members, mostly D), but
  the senior Republicans tarred were mostly NOT criminally prosecuted —
  Nixon was pardoned, most Congressional Republicans survived. Conviction
  in scandal is rare even in famous scandals.
- **"Senators rarely died in office historically."** Inverted. Per UMN
  Smart Politics, nearly 4× as many senators died per year 1789–1972 than
  in the last half-century. The Senate chamber gained a "death trap"
  reputation between 1916–24 when 22 senators died in office. [Senate.gov]
- **"Ideological conversion only goes leftward / rightward."** Tom Watson
  is the cautionary tale: Populist champion of Black-white agrarian
  alliance in 1890s; white-supremacist demagogue by 1910. Conversions
  travel in all directions.

## Frequency calibration

The user's vision says "every politician would have a small chance
something fires." For calibration anchors:

- A US senator serving 1916–24 had roughly a 22/96 ≈ 23% chance of dying
  in office over an 8-year tranche just from background mortality —
  about 3%/year of fatal illness alone in that window. Death-in-office
  is one specific narrow category; "anything notable happens" should
  fire substantially more often than fatal illness.
- Pre-1900 newspaper coverage of senators was personal-event-heavy: a
  congressional career spanned 2–5 years on average (per CRS R41545), and
  multiple personal events per term were routinely reported (illness,
  duel, family death, business reverse). Translating: a typical senator
  probably had 1–2 "newspaper-worthy personal events" per 2-year term in
  the 19th century.
- Modern senators get a "personal event story" arguably every 2–4 years
  on average, though the threshold for what gets reported is much higher.
- Combined with the deaths-retirements bracket already in MORTALITY_RULES
  (which fires 0.5–18% per year depending on age), the PM should
  treat 2.4.2 as the *much more common* event pool — "something notable
  happened to Senator X this year" is fired more often than the death
  bracket. A reasonable target: **3–8% per politician per year** so that
  across a 30-year career roughly 60–90% of politicians accumulate at
  least one anytime event. A 1%/year rate (≈26% over 30 years) feels too
  empty for the "world feels alive" goal; 10%+/year (≈96% over 30
  years) risks event fatigue.

## Trait acquisition rules (era-agnostic guidance)

Reviewing the `Trait` union at `/home/user/AMPU/src/types.ts:62-108`:

**Plausible mid-career acquisition via anytime event:**
- `Frail` (illness/injury/age — strong signal across all eras)
- `Charismatic` / `Orator` / `Debater` (single great-speech event — Bryan
  1896 paradigm; rare but real)
- `Crisis Manager` (visible crisis-handling moment — Lincoln 1861,
  Eisenhower D-Day, Reagan shooting; rare)
- `Manipulative` / `Numberfudger` / `Kingmaker` (mentorship event — LBJ
  Senate-floor apprenticeship to Rayburn; consider overlap with the
  Kingmaker subsystem already in `KINGMAKER_RULES`)
- `Scandalous` / `Corrupt` (scandal event — Credit Mobilier, Teapot Dome,
  Abscam paradigms; the "trait sticks" outcome of a scandal event)
- `Controversial` (post-1880 media flap; can apply earlier with less force)
- `Flip-Flopper` (ideological-conversion event; this trait already exists
  as a possible outcome of `IDEOLOGY_SHIFT_ODDS`)
- `Reformist` (religious-conversion-to-reform event, Second Great Awakening)
- `Puritan` (religious-revival event — narrower than Reformist)
- `Ideologue` (deep-conviction event; already in `IDEOLOGY_SHIFT_ODDS`
  seed)
- `Unlikable` (visible personal-failure event — Hart "Monkey Business")
- `Celebrity` (mass-media event creating recognition spike — post-1880s
  realistic)
- `Failed Bid` (already an existing event-driven trait elsewhere; not 2.4.2)
- `Loyal` / `Opportunist` (in-game faction-conversion-related; already
  seeded by `CONVERSION_ODDS.seed`)

**Should NOT be acquired via 2.4.2:**
- `Aristocratic` — N/A (not in the current Trait union; if added later,
  fixed-at-draft based on background only).
- `Frontier-Born` — N/A (not in the current Trait union; would be fixed-
  at-draft if added).
- `Carpetbagger`, `Outsider` — already owned by the relocation system
  `RELOCATION_ODDS.carpetbagger`; don't duplicate via anytime events.
- `Naval`, `Military`, `Egghead`, `Education`, `Economics`, `Business`,
  `Agriculture`, `Environment`, `Media` — these are biographical/career
  identifiers usually set at draft from background; mid-career acquisition
  is implausible without long retraining, and these are already handled
  by the career-track system (`TRACK_THEMED_TRAITS`). Anytime events
  should not duplicate that channel.
- `Traitor` — historically a Civil War or treason-trial event; if added,
  belongs to a dedicated war/treason mechanic, not anytime events.
- `Obscure`, `Failed Bid` — derived from career outcomes, not random
  events.

**Already owned by other phases (do not double-grant from 2.4.2):**
- `Ideologue`, `Impressionable`, `Flip-Flopper` — `IDEOLOGY_SHIFT_ODDS`.
- `Loyal`, `Opportunist` — `CONVERSION_ODDS`.
- `Carpetbagger`, `Outsider` — `RELOCATION_ODDS`.
- `Kingmaker`, `command` bumps — `KINGMAKER_RULES`.
- Career-track-themed traits — `TRACK_THEMED_TRAITS`.

## Anachronisms / anti-patterns (must NOT be in the pool)

- "Automobile accident" pre-1908. Use "carriage overturned" / "horse fall"
  for I/F.
- "Plane crash" pre-1930 for survival, pre-1955 realistic for politicians.
- "TV-debate disaster" pre-1960 (Nixon-Kennedy 1960 is the first).
- "Social-media gaffe" pre-2006 (Twitter founding) — realistically 2011+
  for Congress-relevant scale.
- "FBI investigation" pre-1908 (FBI founded as Bureau of Investigation
  1908; pre-1908 federal investigation belonged to Justice Dept marshals
  and Treasury agents).
- "Radio scandal" pre-1920 (KDKA broadcast 1920).
- "Polio" pre-1900 medically present but politically obscure; not a viable
  flavor before FDR.
- "Diagnosed with cancer" pre-1900 — cancer existed but politicians' cancer
  diagnoses are largely 20th-century phenomena due to diagnostic limits.
- "Duel" post-1870 anywhere; post-1840 outside the South.
- "Federal corruption sting" pre-1970 (Abscam paradigm); pre-Abscam federal
  bribery prosecutions exist (Teapot Dome) but as investigations of
  completed acts, not undercover stings.
- "Conversion to Modern Liberal / Conservative ideology" by name in
  pre-1933 contexts — "Liberal" meant something different in 1856 than in
  1956. Use period-appropriate frames: "joins the Free-Soil Democrats,"
  "becomes a Mugwump," "joins the Populist insurgency," etc.
- "Coming out" / contemporary identity events pre-1970 (Stonewall is 1969).
- "DUI" pre-1910 (drunk-driving laws are post-automobile-era; political
  consequences of drunkenness existed in all eras but framed as
  intemperance / habits of dissipation).

## Citations

- [Caning of Charles Sumner — Senate.gov Minute](https://www.senate.gov/artandhistory/history/minute/The_Caning_of_Senator_Charles_Sumner.htm) — May 22, 1856, Sumner absent Dec 1859.
- [Caning of Charles Sumner — Wikipedia](https://en.wikipedia.org/wiki/Caning_of_Charles_Sumner) — recovery timeline, "physical and psychological injuries."
- [Bitter Feelings In the Senate Chamber — Senate.gov](https://www.senate.gov/artandhistory/history/minute/Bitter_Feelings_In_the_Senate_Chamber.htm) — Foote draws pistol on Benton, April 17, 1850.
- [Hamilton-Burr Duel — Britannica](https://www.britannica.com/event/Burr-Hamilton-duel) — July 11, 1804.
- [12 famous Americans killed/involved in duels — Constitution Center](https://constitutioncenter.org/amp/blog/famous-americans-killed-involved-in-duels) — Clay-Randolph 1826 details.
- [The History of Dueling in America — PBS American Experience](https://www.pbs.org/wgbh/americanexperience/features/duel-history-dueling-america/) — North 1830s fade, Southern persistence to Civil War.
- [Dueling in the Southern United States — Wikipedia](https://en.wikipedia.org/wiki/Dueling_in_the_Southern_United_States) — region-specific persistence.
- [Smallpox Epidemics in America in the 1700s — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7335227/) — Franklin inoculation context.
- [The First Yellow Fever Pandemic — NYAM](https://nyamcenterforhistory.org/2018/10/15/yellow-fever-pandemic/) — Philadelphia 1793, 1798 (3,645 deaths), New York/Baltimore figures.
- [American Fevers, American Plagues — Science History Institute](https://www.sciencehistory.org/stories/magazine/american-fevers-american-plagues/) — yellow fever political alignment with Federalist/Republican lines.
- [Death of James K. Polk — James K. Polk Museum](https://jameskpolk.com/history/the-death-of-james-k-polk/) — cholera, June 15, 1849, age 53.
- [Tennessee cholera epidemic 1849–50 — Wikipedia](https://en.wikipedia.org/wiki/Tennessee_cholera_epidemic_(1849%E2%80%931850)) — 311 deaths Nashville 1849.
- [Last Illness of Daniel Webster — PMC reprint](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10438576/) — cirrhosis Oct 24, 1852.
- [Calhoun, Clay & Webster — American Battlefield Trust](https://www.battlefields.org/learn/articles/calhoun-clay-webster-great-triumvirate) — Great Triumvirate biographical context.
- [W.H. Harrison death — College of Physicians of Philadelphia](https://collegeofphysicians.org/programs/education-blog/what-killed-william-henry-harrison/) — pneumonia vs. enteric-fever differential.
- [Did W.H. Harrison really die from pneumonia? — History.com](https://www.history.com/articles/did-william-henry-harrisons-inauguration-speech-kill-him) — White House water contamination thesis.
- [Attempted assassination of Andrew Jackson — Senate.gov](https://www.senate.gov/artandhistory/history/minute/Attempt_to_kill_King_Andrew.htm) — Jan 30, 1835.
- [Smithsonian: Attempted Assassination of Andrew Jackson](https://www.smithsonianmag.com/history/attempted-assassination-andrew-jackson-180962526/) — both pistols misfiring, 1-in-125,000 odds.
- [Presidential Assassinations — Britannica](https://www.britannica.com/topic/Assassinations-and-assassination-attempts-involving-U-S-presidents-and-presidential-candidates) — Lincoln, Garfield, McKinley, JFK.
- [List of US presidential assassination attempts — Wikipedia](https://en.wikipedia.org/wiki/List_of_United_States_presidential_assassination_attempts_and_plots) — TR, FDR, Truman, Ford, Reagan, Trump.
- [Members of Congress killed/wounded — Wikipedia](https://en.wikipedia.org/wiki/List_of_United_States_Congress_members_killed_or_wounded_in_office) — Eliakim Sherrill (Gettysburg) etc.
- [Hamilton-Reynolds affair — Wikipedia](https://en.wikipedia.org/wiki/Hamilton%E2%80%93Reynolds_affair) — Reynolds Pamphlet Aug 25, 1797.
- [Scandal That Ruined Hamilton's Chances — History.com](https://www.history.com/articles/alexander-hamilton-maria-reynolds-pamphlet-affair) — political effect of Reynolds.
- [Credit Mobilier — House.gov History](https://history.house.gov/Historical-Highlights/1851-1900/The-Credit-Mobilier-scandal/) — Ames, Brooks, Colfax, Blaine implicated.
- [Whiskey Ring — Britannica](https://www.britannica.com/money/Whiskey-Ring) — 238 indictments / 110 convictions, 1875.
- [Teapot Dome — Wikipedia](https://en.wikipedia.org/wiki/Teapot_Dome_scandal) — Fall first cabinet officer convicted, 1929.
- [Teapot Dome / Albert Fall — FJC](https://www.fjc.gov/history/cases/famous-federal-trials/us-v-albert-b-fall-teapot-dome-scandal) — federal trial record.
- [Abscam — FBI](https://www.fbi.gov/history/famous-cases/abscam) — seven Congress convictions, 1980–81.
- [Yellow Journalism — Britannica](https://www.britannica.com/topic/yellow-journalism) — Pulitzer-Hearst era, 1883–1898.
- [Cooling Off the Senate — Senate.gov](https://www.senate.gov/artandhistory/senate-stories/cooling-off-the-senate.htm) — 22 senators died in office 1916–24.
- [Senators Who Die In Office — CRS IF12393](https://www.congress.gov/crs-product/IF12393) — 301 deaths in office since 1789.
- [Long live our US senators — UMN Smart Politics](https://smartpolitics.lib.umn.edu/2014/01/03/long-live-our-us-senators) — 4× more senators died per year 1789–1972 vs. 1972–today.
- [Eisenhower's 1955 Heart Attack — Cambridge Politics & Life Sciences](https://www.cambridge.org/core/journals/politics-and-the-life-sciences/article/eisenhowers-1955-heart-attack-medical-treatment-political-effects-and-the-behind-the-scenes-leadership-style/BE13973F3E46E7CC12E3085CA978FDBB) — disclosed "mild coronary thrombosis."
- [The presidential heart attack that changed America — AHA](https://www.heart.org/en/news/2024/02/15/the-presidential-heart-attack-that-changed-america) — Eisenhower context, ran 1956.
- [LBJ 1955 heart attack — Time](https://time.com/archive/6840691/medicine-the-heart-of-l-bj/) — July 2, 1955, age 47.
- [Wilson stroke — History.com](https://www.history.com/articles/president-hidden-stroke-woodrow-wilson) — Oct 2, 1919, hidden 17 months.
- [FDR Polio — FDR Library](https://www.fdrlibrary.org/polio) — 1921, age 39.
- [Roosevelt's Polio Wasn't a Secret — NPR / James Tobin](https://www.npr.org/2013/11/25/247155522/roosevelts-polio-wasn-t-a-secret-he-used-it-to-his-advantage) — contemporary awareness, modern myth correction.
- [Bryan Cross of Gold — Britannica](https://www.britannica.com/event/Cross-of-Gold-speech) — July 8, 1896.
- [Henry Clay Great Compromiser — World History Encyclopedia](https://www.worldhistory.org/Henry_Clay/) — 1811 first day Speaker.
- [LBJ "Treatment" — History Hit](https://www.historyhit.com/president-johnson-treatment-explained/) — Senate Majority Leader persuasion technique.
- [Reagan Great Communicator — PLOS One case study](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0301324) — TV-medium mastery roots in radio/film.
- [Second Great Awakening reforms — UNG University Press chapter 13](https://ung.edu/university-press/_uploads/files/us-history/us-history-i-chapter-13.pdf) — abolitionism, temperance, education reform pipeline.
- [Religious activism Second Great Awakening — Cambridge Social Science History](https://www.cambridge.org/core/journals/social-science-history/article/power-of-religious-activism-in-tocquevilles-america-the-second-great-awakening-and-the-rise-of-temperance-and-abolitionism-in-new-york-state/8769D5957684002ED8B5DCE6667B6B38) — quantitative reform mobilization.
- [Tom Watson — New Georgia Encyclopedia](https://www.georgiaencyclopedia.org/articles/history-archaeology/thomas-e-watson-1856-1922/) — 1890 Democrat → Populist → post-1900 white supremacist trajectory.
- [Bleeding Kansas — American Battlefield Trust](https://www.battlefields.org/learn/articles/bleeding-kansas) — frontier violence 1855–59, Brown Pottawatomie May 1856.
- [Chappaquiddick — History.com](https://www.history.com/articles/ted-kennedy-chappaquiddick-incident-what-really-happened-facts) — July 18, 1969.
- [Wellstone plane crash — VOA](https://www.voanews.com/a/a-13-a-2002-10-25-19-us-67551232/387648.html) — Oct 25, 2002, 12 days before election.
- [Carnahan plane crash — Fox News politicians-and-plane-crashes](https://www.foxnews.com/politics/politicians-and-plane-crashes.amp) — Oct 16, 2000, posthumous Senate win.
- [Death of the political scandal — NPR 2026](https://www.npr.org/2026/06/04/nx-s1-5844547/death-of-the-political-scandal) — modern scandal-survivability trend.
- [Anthony Weiner sexting scandals — Wikipedia](https://en.wikipedia.org/wiki/Anthony_Weiner_sexting_scandals) — 2011 resignation.
- [Common Diseases of 18th-19th Century — American Battlefield Trust](https://www.battlefields.org/learn/articles/common-diseases-18th-and-19th-century) — period disease vocabulary anchor.
