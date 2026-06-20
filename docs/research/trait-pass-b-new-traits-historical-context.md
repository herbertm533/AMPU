# Historical Context — Trait Pass B, new election-facing traits (PR4b)

**Audience:** PM authoring CP1 magnitudes for the 7 PR4b traits + resolving
the Orator-polish question.
**Status:** Research brief. Provides binding historical grounding, not
mechanics. Pairs with `trait-election-effects-historical-context.md` (PR4a).

> Confidence levels: **(C)** consensus history; **(R)** contested but
> reasonable; **(I)** my synthesis / inference.

PR4a anchored 15 existing traits in `TRAIT_ELECTION_EFFECTS`. PR4b adds 7
new traits (Likable, Uncharismatic, Cosmopolitan, Provincial, Two-Faced,
Predictable, Hale) and resolves Hale's relationship with PR3's old-age
decay. All seven trait definitions are drawn verbatim from the binding
spec at `docs/research/source-abilities-expertise-traits.md` lines
145–207 / 240–262.

---

## Cross-cutting eras / mechanics context (carry-overs from PR4a)

These remain load-bearing for PR4b — recapped tersely:

- **Senate elections in BOTH AMPU windows are state-legislature elections**,
  not direct popular vote, until the 17th Amendment (1913). The senate.gov
  archive describes the 1858 Illinois case: Republican legislative
  candidates polled ~125,000 to Douglas's ~121,000, yet the malapportioned
  legislature still seated Douglas 54–46. (C) Senate-context magnitudes for
  ALL PR4b traits should be filtered through "what do ~100 state
  legislators care about?" — generally not voter-personal-magnetism.
- **The 1840 "Log Cabin and Hard Cider" campaign is the watershed** for
  campaign style. Pre-1840 = press-pamphlet era; post-1840 = mass-rally /
  iconography era; the 1856-window scenario sits firmly in the post-1840
  style. (C) For Hale specifically, this matters: the stamina demands of
  stump campaigning post-1840 are higher than the pre-1840 gentleman-of-
  leisure model.
- **Presidential candidates did not personally campaign** with one major
  exception: Douglas in 1860 was "the first Presidential candidate to go on
  the stump" personally. (C) Lincoln stayed in Springfield. This means
  Hale's stamina effect on `presGeneral` is weaker than naive intuition
  suggests — it's the surrogates who needed the stamina, not the candidate.

---

## Per-trait grounding (7 traits)

### Likable

> Spec definition (`source-abilities-expertise-traits.md:206-207`): "hard
> to dislike; even opponents mention liking them; affects undecided voters,
> especially against an Unlikable opponent."

- **Distinct from Charismatic.** Charismatic = magnetism (Henry Clay's
  pull, Patrick Henry's pulpit voice); Likable = warmth and approachability
  (the storyteller-at-the-tavern register). A politician can be Likable
  without being magnetic; many were.
- **Historical examples — 1772 era:**
  - **Benjamin Franklin.** Walter Isaacson's biography (cited by multiple
    secondary sources) attributes Franklin's success to "personal magnetism"
    AND a "humble enquirer" style — listening, asking questions, treating
    a tradesman the same as a wealthy man. (C) Franklin is borderline
    Charismatic + Likable; the "approachable, accessible and even
    relatable" framing puts him cleanly on the Likable side.
  - **Henry Clay (late-period 1772 / cross-window into 1856).** American
    Heritage's 1956 essay literally titled "Everybody Liked Henry Clay"
    captures the canonical reading. Clay had Charismatic AND Likable in
    AMPU terms: "one of America's best-loved politicians" with "magnetism"
    AND a "genial figure" who was "still warm and likeable" a century
    later. (C) Clay over-qualifies on both axes — fine for the curated
    dataset to give him both.
- **Historical examples — 1856 era:**
  - **Abraham Lincoln.** "The streets seemed brighter when Abraham Lincoln
    appeared in them" (contemporary anecdote, cited by Lincoln's
    Classroom). Lincoln was the best yarn-spinner in Illinois — the
    storytelling-at-the-courthouse style is the clean 1856-era Likable
    archetype. NOT Charismatic in the magnetism sense (in 1860 he stayed
    in Springfield while Douglas barnstormed), but Likable beyond question.
    (C)
  - **Stephen A. Douglas.** Tavern bonhomie / "Little Giant" warm-personal
    style is the cross-aisle Likable example for 1856 — even his Southern
    enemies in 1860 mentioned personal regard. (C) Pairs cleanly with PR4a's
    Magician + Charismatic attributions.
- **Conflict-pair: Likable ↔ Uncharismatic.** This pair is logically
  awkward — the symmetrical inverse of Likable is Unlikable (already in
  the trait union). The vision proposes Likable ↔ Uncharismatic; the PM
  should know this is **a softer inverse** (Likable = warm, Uncharismatic =
  flat, not "cold/hated"). It works as a single dimension (warmth) but
  it's not the perfect logical inverse. **(R)** Acceptable for game
  purposes; consider noting in UI that the "opposite" of Likable in trait
  language is Unlikable, and Uncharismatic just can't coexist with it.
- **Election-context applicability:**
  - `presGeneral`: + small to + medium. Less than Charismatic because
    Likable doesn't drive enthusiasm, only undecideds. Lincoln 1860
    benefited from Likable but won via party machinery, not personal
    appeal — surrogates carried it.
  - `presPrimary` (= convention pre-1900): + small. Pierce 1852 wasn't
    Likable — he was Obscure; Likable isn't the canonical convention
    edge.
  - `house`, `governor`: + small to + medium. District-level warmth pays
    here.
  - `senatePre17`: + small. Legislators do have personal relationships
    but Likable is a popular-voter trait more than a backroom-pro trait.
  - `internalParty`: + medium. Personal regard from same-faction
    politicians is the most direct expression — Lincoln being well-liked
    by his Springfield circle is the model.
- **Opponent-conditional:** YES. Spec explicitly names "especially against
  an Unlikable opponent" — directly parallels PR4a's Integrity-vs-Scandalous
  row. **Suggested: Likable in `presGeneral` bumped LARGE vs an Unlikable
  opponent.**
- **Anachronism flag:** "Likable" as a word — 1730 usage, well in window for
  both. (C, per OED via etymology research.)
- **Sources:** [American Heritage — Everybody Liked Henry Clay](https://www.americanheritage.com/everybody-liked-henry-clay), [Lincoln's Classroom — Stories and Humor](https://www.abrahamlincolnsclassroom.org/abraham-lincoln-in-depth/abraham-lincolns-stories-and-humor/index.html), [Benjamin Franklin biographical analysis (criticsrant)](https://criticsrant.com/personality-traits-of-benjamin-franklin/), [Stephen A. Douglas — Britannica](https://www.britannica.com/biography/Stephen-A-Douglas)

### Uncharismatic

> Spec definition (`source-abilities-expertise-traits.md:261-262`):
> "scripted/wooden; hard to put a personal touch on a campaign; struggles
> to win uninspired and undecided voters."

- **Distinct from Unlikable.** Unlikable = actively disliked (Adams 1800);
  Uncharismatic = flat (Madison, Polk, Chase). Unlikable repels; Uncharismatic
  fails to attract.
- **Historical examples — 1772 era:**
  - **James Madison.** "Physically frail, nervous, and shy ... his voice
    was shrill" (DISC Insights summary citing multiple biographies).
    "Reserved, introverted public persona ... appeared aloof to those that
    didn't know him." "During an age in which fiery baroque oratory was
    revered, Madison wasn't an imposing public speaker. Unlike many of the
    other Founding Fathers, Madison was calm and shy, with little rhetorical
    skill." (C) The canonical Uncharismatic case — and crucially, Madison
    still made the presidency, because Uncharismatic doesn't disqualify in
    a party-machinery / Congressional-caucus era.
  - **James Monroe** (border case, R): warm in private, stiff in public;
    his post-1816 "Era of Good Feelings" was as much partisan vacuum as
    personal appeal.
- **Historical examples — 1856 era:**
  - **Salmon P. Chase.** "Habitually grave and reserved in demeanor; he
    did not often laugh, and had but a small appreciation of humor."
    Contemporary biographer Albert Bushnell Hart: Chase "had fewer warm
    friends and admirers than almost any one of these rivals." (C) "Chase's
    cold personality prevented him from unifying the Republican state
    party behind his presidential ambitions in both 1856 and 1860." (C)
    The cleanest 1856-window Uncharismatic case **with explicit electoral
    cost** — Chase ran for the Republican nomination in 1856, 1860, 1864,
    1868, 1872 and was blocked each time partly by this.
  - **James K. Polk.** "Polk had as much charisma as a puddle of mud."
    JQ Adams (in his diary): Polk has "no wit, no literature, no point of
    argument, no gracefulness of delivery, no elegance of language, no
    philosophy, no pathos, no felicitous impromptus." (C) But Polk still
    won 1844 — Uncharismatic was no bar in a caucus-and-machinery era.
- **Conflict-pair: Uncharismatic ↔ Likable.** As above. Works as a single
  warmth dimension. Madison-Chase-Polk vs Franklin-Clay-Lincoln is the
  intuitive split.
- **Election-context applicability:**
  - `presGeneral`: – small to – medium. Less damaging than Unlikable.
    Madison 1808/1812 + Polk 1844 are both Uncharismatic wins. The trait
    bites at the edges, not the core.
  - `presPrimary` (convention): – small. Convention delegates DON'T need
    to like you in the warm-personal sense; Pierce 1852 / Polk 1844 wins
    confirm.
  - `house`, `governor`: – small. District politics rewards
    likability-in-the-room more.
  - `senatePre17`: ~neutral to – very small. Legislators tolerate flat
    candidates more readily — Chase made it to the Senate (1849) before
    his presidential blockages.
  - `internalParty`: – medium. The trait's clearest cost is "factional
    cooperation" — Chase couldn't unify Republicans.
- **Opponent-conditional:** Optional. Could mirror PR4a's
  Unlikable-vs-Charismatic bumped row (Uncharismatic-vs-Charismatic
  bumped MEDIUM in `presGeneral` would be defensible — Polk 1844 vs. Clay
  the Charismatic = the cleanest historical contrast). **(I) Recommend
  YES but only in `presGeneral`.**
- **Anachronism flag:** "Uncharismatic" as a word is modern — "charismatic"
  itself enters political usage in the Max Weber-influenced 20th century
  (literal religious usage is older). **The CONCEPT (flat speaker) is
  fully period-native** ("wooden" and "scripted" are 19th-c usages); the
  WORD is jarring. Display-label decision for PM.
- **Sources:** [Slender Threads / Jim Buie — Madison shy nerdy](https://jimbuie.substack.com/p/james-madison-a-shy-nerdy-political), [Mr Lincoln's White House — Chase](https://www.mrlincolnswhitehouse.org/residents-visitors/cabinet-vice-presidents/cabinet-vice-presidents-salmon-p-chase-1803-1873/index.html), [Britannica — Salmon P. Chase](https://www.britannica.com/biography/Salmon-P-Chase), [Critics Rant — Personality of Polk](https://criticsrant.com/personality-of-james-k-polk/)

### Cosmopolitan

> Spec definition (`source-abilities-expertise-traits.md:145-148`): "more
> national figure than regional; attuned to the nation over their state /
> region; typically urban. Advantage in national offices (e.g. the
> presidency), disadvantage in local races (Governor, US Rep). Easy
> party-wide appeal."

- **Historical examples — 1772 era:**
  - **Thomas Jefferson.** Five years as Minister to France (1784–1789);
    "adapted to the effortless elegance of the Parisian way of life ...
    delighted by ... intellectual conversation and social life." (C) The
    architectural, dietary, and political consequences (Library of
    Monticello, French wines, Declaration's debt to Enlightenment thought)
    are downstream of Jefferson's Cosmopolitanism. **In-window for 1772
    via the pre-1789 phase of his career.**
  - **Alexander Hamilton.** Born on Nevis, apprenticed at a merchant
    house in St. Croix trading lumber and sugar across Caribbean and
    North American ports — "imbibed three distinct national mentalities"
    before age 16. (C) Per the City Journal essay, "New York was probably
    the most cosmopolitan settlement in the 13 colonies" and Hamilton
    was its model. The Federalist papers and Reports on Public Credit /
    Manufactures show the Cosmopolitan-as-national-network operator.
  - **Benjamin Franklin.** Years in London (1757–62, 1764–75) and
    Paris (1776–85). (C) Cosmopolitan at planet-scale.
- **Historical examples — 1856 era:**
  - **William H. Seward.** Visited Europe extensively; his post-Secretary-
    of-State retirement tour spanned 15 months and several continents.
    (C) As New York Governor (1839–43) he championed Irish immigrants and
    immigrant education — the Cosmopolitan strain that the Know-Nothings
    explicitly opposed.
  - **Charles Sumner.** Three-year European tour 1837–1840; "learned
    French, German, and Italian alongside the workings of European
    governments and jurisprudence." Paris 1838 directly shaped his views
    on racial equality, as he observed integrated cafes and theaters. (C)
    "Multilingual fluency ... adding to his cosmopolitan aura" is
    contemporary phrasing — see Mount Auburn cemetery bio. Sumner's
    Massachusetts Senate seat (state-legislature elected, 1851) shows
    Cosmopolitan + state-legislative-electorate alignment in the North.
- **Conflict-pair: Cosmopolitan ↔ Provincial.** Strongly historically
  coherent. (C) The spec literally treats them as opposed (national vs.
  regional accent), and historical politicians cluster cleanly. Recommend
  this pair stays as-vision.
- **Election-context applicability — strong regional variance:**
  - `presGeneral`: + medium nationally; **+ small Northern, − small to
    neutral Southern** post-1850. Cosmopolitan was a Northern strength,
    Southern liability by the sectional crisis. Seward 1860 lost the
    Republican nomination partly because he was TOO Cosmopolitan for
    Lincoln's Midwestern strength. (R)
  - `presPrimary` (convention): + small. Cosmopolitan delegates can build
    coalitions but the "obscure dark horse" pattern beats them.
  - `house`, `governor`: − small to − medium. Spec says "disadvantage in
    local races" explicitly.
  - `senatePre17`: **Era-scaled.** + medium in 1856-Northern legislatures
    (Sumner 1851, Seward), + small or neutral in 1856-Southern legislatures,
    + small in 1772-Federalist legislatures. State legislators in
    cosmopolitan states (MA, NY) responded to Cosmopolitan candidates.
  - `internalParty`: + medium. Spec explicitly says "easy party-wide
    appeal" — the Cosmopolitan trait's primary mechanic.
- **Opponent-conditional:** Optional. Cosmopolitan-vs-Provincial in
  `presGeneral` is the classic 1840 Harrison-vs-Van Buren / 1828 Jackson-
  vs-Adams dichotomy; bumped magnitude defensible. **Recommend YES, but
  use region/state filter rather than flat bump if game has that signal.**
- **Anachronism flag:** "Cosmopolitan" as a word — 1844 in the
  modern adjective sense per OED; the earlier 1640s noun sense is
  "citizen of the world." **In play but borderline for 1772 era** —
  contemporary writers would more likely have used "polished,"
  "polite," or "of the world." 1856 era usage is clean. (R)
- **Era-scaling flag:** Cosmopolitan benefits stronger in the
  `nationalism` era (1856) than `federalism` era (1789–1800) for two
  reasons: (a) the sectional crisis sharpened the regional cleavage; (b)
  the partisan press amplified the Cosmopolitan/Provincial polarity that
  Jacksonian rhetoric had introduced 1828-onwards.
- **Sources:** [Smithsonian — Hamilton on Nevis](https://www.smithsonianmag.com/travel/alexander-hamilton-nevis-caribbean-island-180964047/), [City Journal — Hamilton: New Yorker](https://www.city-journal.org/article/alexander-hamilton-new-yorker), [Monticello — Jefferson as Minister to France](https://www.monticello.org/research-education/thomas-jefferson-encyclopedia/minister-france/), [Mount Auburn — Charles Sumner](https://mountauburn.org/notable-residents/charles-sumner-1811-1874/), [Seward House Museum](https://sewardhouse.org/history/william-henry-seward), [Britannica — Charles Sumner](https://www.britannica.com/biography/Charles-Sumner)

### Provincial

> Spec definition (`source-abilities-expertise-traits.md:247-250`): "keenly
> attuned to local/regional politics; thick regional accent; appeals almost
> exclusively to their region (a Deep South provincial has no appeal in
> New England and vice versa); advantage for Governor/US Rep, struggles to
> become a major presidential candidate."

- **Historical examples — 1772 era:**
  - **Patrick Henry.** Hanover County rural background; "kept his
    audience captive ... encapsulated the views of many Virginians"
    rather than addressing a national audience. His Great-Awakening-
    derived oratorical style spoke "in the people's language and to
    their hearts." (C) Henry refused to attend the Constitutional
    Convention ("smelt a rat"), declined federal office, stayed firmly
    Virginia-focused. The clean 1772 Provincial archetype.
  - **Samuel Adams.** Boston caucus organizer; described as "America's
    first professional politician" but his career was Boston / Mass-
    centric. (C) When the imperial moment ended, Adams couldn't
    nationalize his appeal — he served as MA Lt Gov and Gov, not in
    national office.
- **Historical examples — 1856 era:**
  - **Andrew Johnson.** Born Raleigh NC, moved to Greeneville TN; tailor
    by trade; never attended school; learned to read with his wife's
    tutelage. (C) Johnson's appeal was specifically rural-Tennessee yeomanry
    against the planter aristocracy — Provincial in spec terms (regional
    accent, local-political style, "thick regional" — his East-Tennessee
    Unionism was unique to that micro-region). His 1857 Senate election
    came from TN state legislature, not popular vote — fits the senatePre17
    "Provincial helps locally" pattern. (C)
  - **Robert Toombs (Georgia).** Wilkes County planter family; "able and
    eloquent" but "intolerant, dogmatic, and extreme." (C) Falstaffian,
    regional, sarcastic — Toombs is Georgia-first, the canonical 1856-era
    Deep South Provincial.
- **Conflict-pair: Provincial ↔ Cosmopolitan.** Strongly historically
  coherent. (C) As above.
- **Election-context applicability — strong regional variance:**
  - `presGeneral`: − medium nationally; **+ small to + medium in candidate's
    home region**. The 1860 four-way race split exactly along Provincial
    regional lines: Bell (Upper South), Breckinridge (Deep South),
    Lincoln (Midwest), Douglas (national-Democrat — least Provincial).
  - `house`, `governor`: + medium. Spec says "advantage for Governor/US
    Rep" explicitly.
  - `senatePre17`: + medium. State-legislature-of-same-region responds
    to Provincial signals; Johnson 1857, Toombs 1853 won this way.
  - `internalParty`: − small to neutral. Provincial limits national
    party-building.
- **Opponent-conditional:** YES — symmetric to Cosmopolitan. Provincial
  in own-region vs Cosmopolitan opponent: + bump. Cosmopolitan in
  cross-region vs Provincial opponent: + bump. The historical pattern is
  cleanest in House/Governor.
- **Era-scaling flag:** Provincial bites harder presidentially in the
  1856 era (sectional polarization) than 1772 era (less developed
  regional consciousness pre-1820). The `federalism` era was more
  Cosmopolitan-tolerant than the `nationalism` era.
- **Anachronism flag:** "Provincial" as a pejorative is in use from
  ~1630s (OED, via etymology research), in English political vocabulary
  by the Founding era. (C) Term in play for both windows.
- **Sources:** [American Battlefield Trust — Patrick Henry](https://www.battlefields.org/learn/biographies/patrick-henry), [Encyclopedia Virginia — Patrick Henry](https://encyclopediavirginia.org/entries/henry-patrick-1736-1799/), [Bioguide — Andrew Johnson](https://bioguide.congress.gov/search/bio/j000116), [New Georgia Encyclopedia — Robert Toombs](https://www.georgiaencyclopedia.org/articles/history-archaeology/robert-toombs-1810-1885/), [NPS — Samuel Adams](https://www.nps.gov/articles/000/samuel-adams-boston-revolutionary.htm)

### Two-Faced

> Spec definition (`source-abilities-expertise-traits.md:259-260`):
> "flip-flops so much/so drastically that few voters trust them to say
> what they mean."

- **Distinct from Flip-Flopper (already in the trait union).** Spec at
  lines 175–177 explicitly distinguishes them: "Flipflopper — seen as
  having recently deviated from a once-firm stance ... Can disappear
  over time, but further political evolution before it does risks
  'Two-Faced.'" **Two-Faced is the chronic / multi-reversal version
  of Flip-Flopper** — earned by serial flip-flopping.
- **Historical examples — 1772 era:**
  - **Aaron Burr.** "In his time, Burr's fickle loyalties and duplicity
    earned the enmity of founding fathers George Washington and Thomas
    Jefferson." (C) H.W. Brands: "a complicated figure ... a model of
    brazen, self-centered opportunism." (C) Burr's career arc — running
    on Jefferson's ticket in 1800 then maneuvering to displace him in the
    contingent election, dueling Hamilton 1804, the 1805–07 Western
    conspiracy — is the canonical Founding-era Two-Faced case. **Many of
    his friends publicly shunned him but privately sought his advice.**
    (C) That asymmetry is exactly what Two-Faced means electorally.
  - **(R)** Talleyrand-style Founding-era candidates were scarce; Burr is
    the dominant 1772-window example.
- **Historical examples — 1856 era:**
  - **Daniel Webster, "7th of March" 1850.** Webster's lifelong Northern
    anti-slavery branding was reversed in a single Senate speech
    supporting the Fugitive Slave Law and the Compromise of 1850. "The
    reaction from the New England press was so severe and so persuasive
    that not a single congressman or senator from New England would go
    on record as supporting Webster's stance." Theodore Parker: "No
    living man has done so much to debauch the conscience of the
    nation." Horace Mann: "a fallen star! Lucifer descending from
    Heaven!" The Liberator: "The Satanic Statesman." (C) "Webster never
    recovered politically from the 7th of March fallout, and so intense
    was the pressure exerted by his party and constituents that Webster
    resigned from the Senate in 1850." (C) Webster died 1852 still
    Two-Faced'd. Note: this is technically a single reversal — borderline
    Flip-Flopper, but the magnitude pushes it into Two-Faced.
  - **Stephen Douglas on Kansas-Nebraska, 1854-58.** Initial 1854 KN Act
    repealed the Missouri Compromise (a reversal of his own earlier
    Compromise of 1850 position); 1857–58 Douglas opposed the Lecompton
    Constitution to defend popular sovereignty (a reversal toward the
    North). "In 1857 and 1858, Douglas lost southern support by opposing
    a proslavery constitution for Kansas." (C) Douglas paid Two-Faced
    costs — the 1860 Democratic Party split (Douglas-North,
    Breckinridge-South) was the consequence.
- **Conflict-pair: Two-Faced ↔ ? — RECOMMENDATION.**
  - Candidates considered: Predictable, Loyal, Integrity.
  - **My recommendation: Two-Faced ↔ Predictable.** Both center on
    position-stability — Predictable = "consistent in word, action, and
    values" per spec line 240; Two-Faced = "flip-flops so much voters
    don't trust them." These are direct logical inverses, and the
    AMPU spec explicitly puts Flip-Flopper/Two-Faced on a stability
    continuum.
  - Loyal is about party-fidelity (per existing TRAIT_CONFLICTS Loyal ↔
    Opportunist), a different axis.
  - Integrity is about moral character (per existing TRAIT_CONFLICTS
    Integrity ↔ Corrupt) — also different axis. (Although Two-Faced
    politicians *also* lack Integrity, the trait pairings should track
    the primary dimension.)
  - **Net:** This recommendation collapses the "Predictable ↔ ?" open
    question — Predictable IS Two-Faced's pair.
- **Election-context applicability:**
  - `presGeneral`: − medium. Voters punish chronic position-shifters but
    Webster (lost 1852) and Douglas (lost 1860) had multiple causes for
    losing besides Two-Faced.
  - `presPrimary` (convention): **− LARGE.** Party loyalists hate
    Two-Faced because they can't predict the candidate's behavior in
    office. Douglas's Two-Faced reading split the 1860 Democratic
    convention.
  - `house`, `governor`: − small to medium. District / state voters
    track positions less precisely than party regulars.
  - `senatePre17`: − medium. State legislators are political pros — they
    DO track positions; Webster lost his Senate seat partly because of
    7th of March.
  - `internalParty`: **− LARGE.** Same logic as primaries. Machine
    politicians need to predict their candidate.
- **Opponent-conditional:** Optional. Two-Faced vs Integrity-opponent
  could bump like Scandalous vs Integrity (PR4a). **(I) Suggest
  similar bump in `presGeneral` and `house`.**
- **Era-scaling flag:** Two-Faced bites harder in `nationalism` (1830+
  partisan-press era) than `federalism` (consensus / Federalist-era).
  Pre-1820 the press apparatus to expose flip-flops was less developed;
  post-1830 every reversal got nationally publicized.
- **Anachronism flag:** "Two-faced" as an idiom dates to early 17th
  century English (1610s, "deceitful, double-dealing"). (C) Folk
  vocabulary — fully era-appropriate for both windows.
- **Sources:** [World History — Aaron Burr](https://www.worldhistory.org/Aaron_Burr/), [Bill of Rights Institute — Burr and Hubris](https://billofrightsinstitute.org/lessons/aaron-burr-and-hubris/), [Senate.gov — Webster's 7th of March](https://www.senate.gov/artandhistory/history/common/generic/Speeches_Webster_7March.htm), [New England Historical Society — Webster 7th of March](https://newenglandhistoricalsociety.com/daniel-webster-risks-it-all-on-the-seventh-of-march/), [Constituting America — Lincoln-Douglas / Kansas-Nebraska](https://constitutingamerica.org/stephen-a-douglas-abraham-lincoln-in-congressional-debate-compromise-1850-kansas-nebraska-act-1854-daniel-a-cotter/)

### Predictable

> Spec definition (`source-abilities-expertise-traits.md:240-243`):
> "consistent in word, action, and values (comforting to some voters), but
> a lack of evolution to major events or manipulative strategies is poison;
> a predictable president is easily stymied by a manipulative opposing
> Speaker."

- **The spec frames Predictable as BOTH positive AND negative**, with the
  positive in popular elections (voters know what they're getting) and
  the negative in legislative gameplay (Manipulative opponents counter
  them). The PM should keep this duality: Predictable should have positive
  rows AND negative rows depending on context.
- **Historical examples — 1772 era:**
  - **George Mason.** "Suspicious of governments at all levels and ... a
    consistent advocate of republicanism." (C) Refused to sign the
    Constitution because of the missing Bill of Rights. Mason's
    consistency was such that even his allies could predict his
    objections — he was useless as a Constitution-ratifier but
    indispensable as a Bill-of-Rights-shaper.
  - **John Adams.** Lifelong republican-with-a-small-r consistency on
    monarchy/aristocracy questions. Less canonical but defensible. (R)
- **Historical examples — 1856 era:**
  - **John C. Calhoun.** The headline 1856-window Predictable case. "In
    his final years, Calhoun consistently supported slavery's expansion
    and states' rights ... Calhoun's main goal in the last decade of his
    life was to destroy party differences in the South and unite all
    southerners in a singular sectional block to extort pro-slavery
    policies from the North." (C) **Caveat:** historians distinguish
    Calhoun's early War-Hawk nationalism (1810s) from his late
    sectionalism (1830s+) — but within each phase he was relentlessly
    predictable, and the spec's "Predictable can be stymied by
    Manipulative" maps directly to how Henry Clay (Manipulative /
    Magician) repeatedly outflanked Calhoun in compromise legislation
    (1820, 1833, 1850 — all Clay wins over Calhoun's sectional vetoes).
  - **Charles Sumner.** Spec's "exists to promote their ideals; sees
    little merit in compromise" maps to Puritan (PR4a) more than
    Predictable, but Sumner's relentless abolitionism is also a
    Predictable archetype — he was the senator everyone could predict on
    every roll-call. The two traits overlap; the PM should decide
    whether a politician can hold both. (Spec doesn't forbid it.)
  - **William Lloyd Garrison.** Same logic. Outside government but
    referenced in PR4a.
- **Conflict-pair: Predictable ↔ Two-Faced.** Per the Two-Faced section
  above. Both rest on position-stability. Recommend.
- **Election-context applicability:**
  - `presGeneral`: + small (voters like knowing what they get); but − in
    games where Manipulative-opponents are present. Direction depends on
    the in-game interaction — PR4b might want simple flat + small.
  - `presPrimary`: + small. Loyalists like reliable nominees.
  - `house`, `governor`: + small. District-level "stability premium."
  - `senatePre17`: + medium. State legislators value reliability above
    almost everything in committee assignments and floor votes.
  - `internalParty`: + medium. Whip-can-count-votes positive.
- **Opponent-conditional (negative side):** YES, on the legislative /
  manipulative dimension. Spec literally says "Predictable president is
  easily stymied by a manipulative opposing Speaker." For PR4b election
  effects, this might be too narrow — Manipulative is already in the
  trait union but isn't an opponent often in election contexts; defer to
  legislative-mechanics PR (PR6).
- **Era-scaling flag:** No strong era split. Predictability is valued
  similarly across both windows.
- **Anachronism flag:** "Predictable" as a word — first usage 1820 per
  OED. **Borderline for 1772 era's earliest years** but the CONCEPT
  ("consistent" / "reliable" / "principled") is fully period-native.
  Display-label is fine for both eras. (R)
- **Sources:** [Britannica — John C. Calhoun](https://www.britannica.com/biography/John-C-Calhoun), [Britannica — Calhoun Legacy / Sectionalism](https://www.britannica.com/biography/John-C-Calhoun/Legacy), [George Mason — Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/george-mason), [Britannica — Charles Sumner](https://www.britannica.com/biography/Charles-Sumner)

### Hale

> Spec definition (`source-abilities-expertise-traits.md:181-182`): "more
> prone to mental and physical longevity; can hold office into their 80s/90s
> or beyond."

- **Hale is the conflict-pair of Frail** (already in trait union). PR3
  deferred this pairing pending PR4b — the historical evidence makes the
  pairing coherent.
- **Historical examples — 1772 era:**
  - **George Washington.** Survived smallpox as a child (immunity used
    at Valley Forge for mass inoculation). Rode 13+ hours daily during
    the Revolution, including the brutal Valley Forge winter 1777–78
    where 2,000+ soldiers died of disease — Washington remained with
    them and survived. (C) Died at 67 from a throat infection, after
    only a few days' illness. **Net: Hale through middle age, but death
    came suddenly. Not centenarian-long-lived — modest Hale.**
  - **Andrew Jackson.** Carried the 1806 Dickinson duel bullet in his
    chest wall for 26 years (until 1832 surgical removal in the White
    House, no anesthesia). Carried the 1813 Benton brothers' ball in his
    shoulder also. Refused amputation. Suffered "rotting teeth, chronic
    headaches, failing eyesight, bleeding in his lungs, internal
    infection, and pain from two bullet wounds" by his 1829 inauguration
    — and STILL ran a two-term presidency. Died 1845 at 78. (C) **The
    archetypal Hale case for AMPU.** His "Old Hickory" nickname literally
    means physical toughness — soldiers said he was "as tough as old
    hickory wood." (C)
  - **Benjamin Franklin.** Lived to 84 (1706–1790), active at the
    Constitutional Convention at 81. (C) Founding-era's clean
    "active into 80s" Hale archetype.
- **Historical examples — 1856 era:**
  - **John Quincy Adams.** Served in the House 1831–1848, age 64–81.
    Led the gag-rule fight for 8 years, won it 1844, collapsed on the
    House floor 1848 from a stroke. (C) "Old Man Eloquent" — Hale
    archetype as continuing-public-service.
  - **Sam Houston.** Multiple battle wounds (1814 Creek War: arrow in
    groin which "remained a running sore to his grave" + rifle wound in
    shoulder; 1836 San Jacinto: musket ball shattered ankle). (C)
    Despite this: TN Attorney General, US Rep, TN Governor, TX
    President (twice), US Senator (TX 1846–59), TX Governor (1859–61).
    Spans both AMPU scenarios. Died 1863 at 70 of pneumonia. Hale
    archetype with physical-wounds-overcome.
  - **Stephen A. Douglas (CONTRARY example — Frail).** At 5'4"
    height, Douglas was the "Little Giant" but his 1860 national
    speaking tour "left him physically and mentally exhausted" and he
    died June 3, 1861 of typhoid fever at 48 (worsened by tour
    exhaustion). (C) Despite the Magician + Charismatic credits in PR4a,
    Douglas's career-ending burnout makes him a Frail example, not
    Hale. **This is important context for the dataset attribution
    section below.**
- **Conflict-pair: Hale ↔ Frail.** Strongly coherent. (C)
- **Election-context applicability:**
  - `presGeneral`: + small. The 1840 Harrison campaign explicitly
    projected Hale (rugged frontier veteran), but the campaign was
    party-press-driven, not stamina-driven. The candidate himself
    typically didn't campaign.
  - `presPrimary` (convention): + small. Convention delegates didn't
    typically weigh stamina; Pierce 1852 won as Obscure, not Hale.
  - `house`, `governor`: + small. Districts care more.
  - `senatePre17`: + small to + medium. **Long Senate sessions are
    real**; state legislators picking senators do (sometimes) consider
    a candidate's ability to serve out a 6-year term. JQ Adams's House
    case (10+ terms via re-election) suggests the trait helps with
    longevity-in-office more than first-election.
  - `internalParty`: + small. Hale figures stay around long enough to
    accumulate party-leader / committee positions.
- **Opponent-conditional:** YES. Hale vs Frail in `presGeneral` is the
  Harrison-Van Buren 1840 archetype (Harrison the rugged Hale frontier
  hero vs. Van Buren the "champagne-sipping" Frail-looking aristocrat).
  Bumped LARGE in `presGeneral` recommended.
- **Era-scaling flag:** Hale matters MORE in the 1856 era (post-1840
  campaign-trail-stamina era — Douglas's 1860 tour was punishing) than
  in 1772 era (gentleman-of-leisure model). **Recommend era-scale
  positive bump on presGeneral for `nationalism` and `modern` vs.
  `independence` / `federalism`.**
- **Anachronism flag:** "Hale" — Old English root, "hale and hearty"
  in English by 1689 (Colbatch). (C) Era-appropriate, even faintly
  archaic-sounding now (which is fine for an 1772/1856 game).
- **Sources:** [Mount Vernon — Washington and Valley Forge](https://www.mountvernon.org/george-washington/the-revolutionary-war/valley-forge), [Doctor Zebra — Health History of Jackson](https://doctorzebra.com/prez/g07.htm), [History Facts — Jackson's bullet](https://historyfacts.com/famous-figures/fact/andrew-jackson-lived-with-a-bullet-in-his-body-from-a-dueling-injury/), [San Jacinto Museum — Sam Houston](https://www.sanjacinto-museum.org/Discover/The_Battle/Commanders/Sam_Houston/), [Texas Monthly — Sam Houston at 200](https://www.texasmonthly.com/being-texan/sam-houston-at-200/), [Mass Hist Society — JQ Adams final years](https://www.masshist.org/beehiveblog/2022/06/my-life-has-been-spent-in-the-public-service-john-quincy-adamss-final-years-1843-1848/), [Senate.gov — Stephen Douglas dies](https://www.senate.gov/artandhistory/history/minute/Senator_Stephen_Douglas_Dies.htm), [Tara Ross — Valley Forge](https://taraross.substack.com/p/tdih-valley-forge)

### Orator-polish (open question)

PR4b's line-item asks whether "Orator-polish" is:
- (a) an enhancement of existing `Orator` (e.g., flat vs. context-sensitive
  multipliers), or
- (b) a new distinct trait.

- **Historical record:** The reference spec at line 232–233 defines
  Orator as "one of the greatest speechmakers of their era; can create a
  flood of support from undecided and bipartisan opposition voters." The
  spec does NOT define a separate "Orator-polish" trait. "Polish" in
  rhetorical sense — refinement, drilled delivery — appears in classical
  rhetoric (Demosthenes' rehearsed style) and in 19th-century Senate
  oratory (Webster's drilled speeches before delivery), but the
  distinction is one of *degree of refinement*, not categorical.
- **Historical archetype distinctions:**
  - Patrick Henry = SPONTANEOUS / Great-Awakening style oratory (no
    "polish") — the unscripted register.
  - Daniel Webster = HIGHLY POLISHED / classical-style oratory (Webster
    revised his speeches before publication, the Second Reply to Hayne
    was carefully scripted).
  - Lincoln = MIDDLE-REGISTER / plain-prose style (Gettysburg, Cooper
    Union).
  - Charles Sumner = ELABORATE-CLASSICAL (his "Crime Against Kansas"
    speech was 5 hours over 2 days, prepared in advance).
- **(I) Recommendation:** Treat Orator-polish as a **per-context
  modifier within existing Orator**, NOT a new trait. The
  historical-evidence reading is that Polished orators (Webster, Sumner)
  outperform Spontaneous orators (Patrick Henry) in pre-17 Senate and
  presPrimary contexts (delegates / state legislators are pros and
  reward preparation); Spontaneous outperforms Polished in `presGeneral`
  and `governor` (popular-electorate stump speeches).
- **Net for PM:** PR4b should NOT add a new "Orator-polish" trait; instead,
  consider per-context magnitude tweaks to existing `Orator` to capture
  the polish/spontaneity distinction OR leave it for a later refinement
  pass. Either is defensible; my call is leave-as-is and document the
  distinction.

---

## Conflict-pair recommendations summary

| Trait | Pair | Confidence |
|---|---|---|
| Likable | Uncharismatic (per vision) | (R) Acceptable — soft inverse, not Unlikable |
| Cosmopolitan | Provincial (per vision) | (C) Strongly coherent |
| Hale | Frail (per vision) | (C) Strongly coherent |
| Two-Faced | **Predictable** | (R) RECOMMENDED — position-stability axis |
| Predictable | **Two-Faced** | (R) RECOMMENDED — same pairing |

This collapses the two open pair questions into a single answer.

---

## Anachronism summary table

| Trait | Word origin / era-fit | 1772 fit | 1856 fit |
|---|---|---|---|
| Likable | 1730 usage | Clean | Clean |
| Uncharismatic | "Charisma" itself becomes political ~1920 (Weber); WORD modern | **Borderline** (concept fine) | **Borderline** (concept fine) |
| Cosmopolitan | 1844 OED modern adjective sense | **Borderline** (use "polished" or "of the world" in 1772 UI?) | Clean |
| Provincial | ~1630s English pejorative | Clean | Clean |
| Two-Faced | 1610s English idiom | Clean | Clean |
| Predictable | 1820 OED | **Borderline-clean** for early 1772 window | Clean |
| Hale | Old English root; "hale and hearty" 1689 | Clean (archaic feel is era-appropriate) | Clean |

**PM decisions warranted:**
1. Display label for Uncharismatic in 1772/1856 UI (the WORD is modern, concept fine).
2. Display label for Cosmopolitan in 1772 UI (consider "Worldly" or "Polished" as era-friendly alternative; CONCEPT is fine).
3. No other anachronism is severe enough to need rename.

---

## Era anchoring summary

| Trait | Era scaling? | Direction |
|---|---|---|
| Likable | Flat | Same value across all 4 eras |
| Uncharismatic | Flat | Same value across all 4 eras |
| Cosmopolitan | **Era-scaled** | Stronger in `nationalism` (sectional polarization) than `federalism` |
| Provincial | **Era-scaled** | Provincial bites presidentially HARDER in `nationalism`/`modern` than earlier; helps state-level CONSISTENTLY |
| Two-Faced | **Era-scaled** | Negative magnitude larger in `nationalism`+ (partisan-press exposure) than `federalism` |
| Predictable | Flat | Stability premium roughly era-neutral |
| Hale | **Era-scaled** | Positive bigger in `nationalism`+ (post-1840 stump era stamina demands) than `federalism` |

Three of the seven traits warrant era scaling (Cosmopolitan, Two-Faced, Hale clearly; Provincial via its `presGeneral` row only). The other four can be flat across eras.

---

## Opponent-conditional summary

| Trait | Opp-conditional? | Trigger / context |
|---|---|---|
| Likable | YES | vs. Unlikable, in `presGeneral` (spec-explicit). Bumped LARGE. |
| Uncharismatic | OPTIONAL | vs. Charismatic, in `presGeneral`. Mirrors PR4a's Unlikable-vs-Charismatic. |
| Cosmopolitan | OPTIONAL | vs. Provincial, in `presGeneral` (region-conditional better than flat). |
| Provincial | OPTIONAL | vs. Cosmopolitan in own-region contexts. |
| Two-Faced | OPTIONAL | vs. Integrity in `presGeneral` / `house` (mirrors PR4a's Scandalous bumps). |
| Predictable | NO | (in election scope; the Manipulative-opponent dynamic is legislative/PR6.) |
| Hale | YES | vs. Frail in `presGeneral`. Bumped LARGE (1840 Harrison archetype). |

The three "clear yes" opponent-conditional rows (Likable, Hale, and the symmetric Two-Faced-vs-Integrity if adopted) directly parallel the PR4a established pattern.

---

## Marquee dataset attributions (for `scripts/seedDataset.mjs`)

The author-time CURATED_ROWS in `scripts/seedDataset.mjs` should receive
the following hand-attributions. Aiming for 2-4 figures per trait, balanced
across both AMPU eras.

### Likable
- **Benjamin Franklin (1772)** — "humble enquirer" style; per multiple
  bios. Currently in seedDataset.mjs:57 with `['Celebrity','Egghead']`;
  add Likable.
- **Henry Clay (1772 late / 1856 cross-window)** — "Everybody Liked Henry
  Clay" (American Heritage 1956). Both Charismatic AND Likable.
- **Abraham Lincoln (1856)** — Springfield storyteller; "the streets
  seemed brighter when Abraham Lincoln appeared in them."
- **Stephen A. Douglas (1856)** — tavern bonhomie; cross-aisle warmth.
  Already noted in PR4a as Magician + Charismatic — Likable layer too.

### Uncharismatic
- **James Madison (1772)** — shrill voice, shy. Currently in
  seedDataset.mjs:83 with `['Egghead','Reformist']`; add Uncharismatic.
- **Salmon P. Chase (1856)** — "habitually grave ... did not often
  laugh" — definitive example with documented electoral cost.
- **James K. Polk (1856)** — "as much charisma as a puddle of mud"; but
  still won 1844, so trait's primary cost should be felt at the convention
  step.

### Cosmopolitan
- **Thomas Jefferson (1772)** — 5 years in Paris; Cosmopolitan
  archetype.
- **Alexander Hamilton (1772)** — Caribbean origin + NYC merchant
  networks; "three distinct national mentalities."
- **Benjamin Franklin (1772)** — London + Paris years (overlaps with
  Likable above; that's fine, traits stack).
- **Charles Sumner (1856)** — 3-year European tour, multilingual,
  observed Paris equality. Currently absent from seedDataset.mjs but
  almost certainly in the legislators YAML — verify via dataset regen.
- **William H. Seward (1856)** — NY Gov; pro-immigrant; multi-continent
  retirement tour; Cosmopolitan made him too cosmopolitan to nominate.

### Provincial
- **Patrick Henry (1772)** — Hanover County, refused federal office,
  refused to attend Constitutional Convention. Currently in
  seedDataset.mjs:42 with `['Orator','Debater']`; add Provincial.
- **Samuel Adams (1772)** — Boston caucus; never nationalized.
  Currently in seedDataset.mjs:40 with `['Orator']`; add Provincial.
- **Andrew Johnson (1856)** — East TN tailor; rural-yeomanry register.
- **Robert Toombs (1856)** — Wilkes County GA planter; Falstaffian
  Deep South Provincial.

### Two-Faced
- **Aaron Burr (1772)** — fickle loyalties, duplicity per Washington
  + Jefferson contemporaries. Currently in seedDataset.mjs:85 with
  `['Manipulative']`; add Two-Faced. The Manipulative + Two-Faced combo
  is historically perfect.
- **Daniel Webster (1856)** — 7th of March speech; never recovered.
  Verify in legislators YAML.
- **Stephen Douglas (1856)** — Kansas-Nebraska / Lecompton reversal;
  but caveat that Douglas's Two-Faced was situationally tactical, not
  characterological. PM may want to *not* attribute Two-Faced to
  Douglas, keeping him as Magician + Charismatic + Likable only, to avoid
  over-stacking. (I)

### Predictable
- **George Mason (1772)** — consistent republican-with-small-r
  objections. Currently in seedDataset.mjs:49 with `[]`; add
  Predictable.
- **John C. Calhoun (1856)** — within his late-Southern-rights phase,
  relentlessly predictable. Will be in legislators YAML.
- **Charles Sumner (1856)** — relentless abolitionism. Overlaps with
  Puritan (PR4a) and Cosmopolitan above — stacking is acceptable.

### Hale
- **George Washington (1772)** — Valley Forge survival, smallpox
  immunity. Currently in seedDataset.mjs:55 with `['Leadership']`;
  add Hale.
- **Andrew Jackson (1772 late / 1856 cross-window)** — "Old Hickory"
  nickname literally about hardness; 38 years carrying bullets; ran
  two-term presidency in chronic pain. The archetypal Hale.
- **John Quincy Adams (1856)** — 9 House terms 1831–1848, age 64–81,
  led gag-rule fight, collapsed on floor at 81.
- **Sam Houston (1856)** — multiple battle wounds, sustained career
  across TN+TX spanning both AMPU scenarios.
- **Benjamin Franklin (1772)** — active at Convention age 81. Already
  attributed to Likable / Cosmopolitan; Hale stacks fine.

---

## Hale + Old Age decay (Option A/B/C recommendation)

The PR3 spec deferred Hale to PR4b. The concrete question for CP1:
should Hale interact with PR3's old-age decay machinery?

The PM's options:
- **Option A**: Hale = pure election bonus, doesn't affect decay (the
  separate-mechanic answer).
- **Option B**: Hale is in PR3's `fadingPool` (it CAN decay with age) — so
  it starts as a bonus then fades.
- **Option C**: Hale slows decay of OTHER traits/abilities (anti-fading
  effect) — bigger mechanic, likely out of scope.

**Historical evidence on Hale-typed politicians' decline:**
- **Washington** died at 67 from acute throat infection (quinsy) after a
  short illness. NOT a long decline. (C) Suggests Washington's Hale
  endured until terminal illness.
- **Jackson** carried bullets 38 years and ran a two-term presidency in
  chronic pain, then died at 78 of "dropsy, tuberculosis (debated), and
  heart failure" — i.e., a long decline. Health was visibly deteriorating
  by his second term (1833–37). (C) Suggests Hale CAN decay.
- **JQ Adams** collapsed on the House floor at 81 from a stroke after 17
  years of post-presidency service. (C) Hale-then-sudden-failure pattern.
- **Sam Houston** "recovered rather quickly from the ankle wound, as he
  did with his previous war injuries." (C) Hale-as-resilience pattern
  through his 1859–61 governorship at 67.
- **Franklin** continued to attend the Constitutional Convention at 81
  (1787) but was visibly enfeebled and contributed primarily via written
  speeches read out by James Wilson. (C) Hale-with-modest-late-decline.

**My read (I): Option B is best historically supported.** Multiple Hale
figures (Jackson, JQ Adams, Franklin, possibly Washington) showed
late-life decline — they were Hale "until they weren't." The clean
narrative is that Hale buys you extra years of robustness but doesn't
prevent decline indefinitely. This maps to including Hale in
`fadingPool`.

Option C (Hale slows OTHER decay) is appealing thematically but
historically thinner — there's no clear evidence Hale politicians
retained other abilities better than non-Hale.

Option A is the simplest implementation; defensible if the PM wants to
keep PR4b scope minimal. PM should weigh code-complexity vs.
historical-accuracy here.

**Bottom line recommendation: Option B, with Hale in `fadingPool` and a
modest age-extension before decay starts (e.g., Hale shifts old-age decay
minAge up by 5 years).**

---

## Cross-trait observations

- **The 1840 Log Cabin campaign is again the load-bearing inflection
  point** — for Hale this is the *clearest* historical anchor (Harrison
  the rugged Hale frontiersman vs. Van Buren the "champagne-sipping"
  Frail-looking aristocrat is the canonical opponent-conditional
  case). For Cosmopolitan/Provincial this is the era when the polarity
  fully crystallizes.
- **The state-legislature filter for pre-17 Senate** (PR4a F-SENATE-BOTH-
  ERAS) creates a clean test for Cosmopolitan / Provincial era-scaling:
  Northern legislatures vs Southern legislatures responded oppositely.
  Implementing this faithfully might require state-aware magnitude — the
  PM should consider whether PR4b can hook into state ideology / region
  signals or defer to a later refinement.
- **The Likable/Uncharismatic axis layers ON TOP of PR4a's
  Charismatic/Unlikable axis**, creating four corners: warm+magnetic
  (Clay), warm+flat (Lincoln), cold+magnetic (Adams 1800), cold+flat
  (Chase / Polk). Hamilton-style "magnetism without warmth" should be
  Charismatic alone; Lincoln-style "warmth without magnetism" should
  be Likable alone. Stacking is historically real.
- **Three traits that overlap heavily** (Provincial, Carpetbagger,
  Outsider — Carpetbagger is PR4a; Outsider too). All three penalize at
  the state level. PM should make sure magnitudes don't triple-dip on
  the same "non-establishment" mechanic.
- **Predictable's pair with Two-Faced is the most novel structural
  observation** in this brief — it provides a clean closed pair for both
  open questions and tracks the spec's existing Flip-Flopper → Two-Faced
  ladder.

---

## Open questions for the PM (PR4b CP1)

1. **Likable display label vs. Unlikable** — UI players will see Likable
   AND Unlikable as opposites visually; the conflict-pair logic puts
   Likable opposite Uncharismatic. Document the soft-inverse semantics
   in tooltip text.
2. **Cosmopolitan in 1772 era label** — keep the word or rename to
   "Worldly" / "Polished" for era display? The CONCEPT is fine; the
   WORD is borderline pre-1800.
3. **Two-Faced ↔ Predictable pair** — confirm acceptance of this
   recommendation (collapses two open questions to one resolved pair).
4. **Hale + old-age decay** — Option A vs B vs C. Recommendation is B.
5. **Era-scaling for Cosmopolitan/Provincial** — the PM has the
   F-DOMESTIC-APATHY-ERA-SCALED precedent from PR4a; recommend extending
   it. State-region-conditional bumps (per-state ideology / region) are
   bigger lift; defer if needed.
6. **Orator-polish — confirmed NOT a new trait?** Recommend deferring
   to a later trait refinement pass if at all; not in PR4b scope.
7. **Stephen Douglas — attribute Two-Faced?** Historical case is real
   but stacks heavily with his existing PR4a attributions. PM judgment
   on whether the curated dataset wants the stack.

---

## Citations (consolidated, by importance to the brief)

Primary spec / orientation:
- [source-abilities-expertise-traits.md](../research/source-abilities-expertise-traits.md) — binding trait definitions
- [trait-election-effects-historical-context.md](../research/trait-election-effects-historical-context.md) — PR4a brief

Likable / Uncharismatic anchors:
- [American Heritage — Everybody Liked Henry Clay (1956)](https://www.americanheritage.com/everybody-liked-henry-clay)
- [Abraham Lincoln's Classroom — Stories and Humor](https://www.abrahamlincolnsclassroom.org/abraham-lincoln-in-depth/abraham-lincolns-stories-and-humor/index.html)
- [Slender Threads / Jim Buie — Madison, shy nerdy political genius](https://jimbuie.substack.com/p/james-madison-a-shy-nerdy-political)
- [Mr Lincoln's White House — Salmon P. Chase](https://www.mrlincolnswhitehouse.org/residents-visitors/cabinet-vice-presidents/cabinet-vice-presidents-salmon-p-chase-1803-1873/index.html)
- [Britannica — Salmon P. Chase](https://www.britannica.com/biography/Salmon-P-Chase)
- [Critics Rant — Personality of James K. Polk](https://criticsrant.com/personality-of-james-k-polk/)
- [Critics Rant — Benjamin Franklin personality traits](https://criticsrant.com/personality-traits-of-benjamin-franklin/)

Cosmopolitan / Provincial anchors:
- [Smithsonian — Hamilton on Nevis](https://www.smithsonianmag.com/travel/alexander-hamilton-nevis-caribbean-island-180964047/)
- [City Journal — Alexander Hamilton: New Yorker](https://www.city-journal.org/article/alexander-hamilton-new-yorker)
- [Monticello — Jefferson as Minister to France](https://www.monticello.org/research-education/thomas-jefferson-encyclopedia/minister-france/)
- [Mount Auburn Cemetery — Charles Sumner](https://mountauburn.org/notable-residents/charles-sumner-1811-1874/)
- [Britannica — Charles Sumner](https://www.britannica.com/biography/Charles-Sumner)
- [Seward House Museum — William H. Seward](https://sewardhouse.org/history/william-henry-seward)
- [American Battlefield Trust — Patrick Henry](https://www.battlefields.org/learn/biographies/patrick-henry)
- [Encyclopedia Virginia — Patrick Henry](https://encyclopediavirginia.org/entries/henry-patrick-1736-1799/)
- [Bioguide — Andrew Johnson](https://bioguide.congress.gov/search/bio/j000116)
- [New Georgia Encyclopedia — Robert Toombs](https://www.georgiaencyclopedia.org/articles/history-archaeology/robert-toombs-1810-1885/)
- [NPS — Samuel Adams](https://www.nps.gov/articles/000/samuel-adams-boston-revolutionary.htm)

Two-Faced anchors:
- [World History Encyclopedia — Aaron Burr](https://www.worldhistory.org/Aaron_Burr/)
- [Bill of Rights Institute — Aaron Burr and Hubris](https://billofrightsinstitute.org/lessons/aaron-burr-and-hubris/)
- [Senate.gov — Webster's Seventh of March speech](https://www.senate.gov/artandhistory/history/common/generic/Speeches_Webster_7March.htm)
- [New England Historical Society — Webster Risks It All](https://newenglandhistoricalsociety.com/daniel-webster-risks-it-all-on-the-seventh-of-march/)
- [Constituting America — Lincoln-Douglas and Kansas-Nebraska](https://constitutingamerica.org/stephen-a-douglas-abraham-lincoln-in-congressional-debate-compromise-1850-kansas-nebraska-act-1854-daniel-a-cotter/)

Predictable anchors:
- [Britannica — John C. Calhoun](https://www.britannica.com/biography/John-C-Calhoun)
- [Britannica — Calhoun Legacy / Sectionalism](https://www.britannica.com/biography/John-C-Calhoun/Legacy)
- [Mount Vernon — George Mason](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/george-mason)
- [Antonin Scalia Law — George Mason, the Man](https://www.law.gmu.edu/about/mason_man)

Hale anchors:
- [Mount Vernon — Washington and Valley Forge](https://www.mountvernon.org/george-washington/the-revolutionary-war/valley-forge)
- [History Facts — Jackson's bullet](https://historyfacts.com/famous-figures/fact/andrew-jackson-lived-with-a-bullet-in-his-body-from-a-dueling-injury/)
- [Doctor Zebra — Health History of Andrew Jackson](https://doctorzebra.com/prez/g07.htm)
- [San Jacinto Museum — Sam Houston](https://www.sanjacinto-museum.org/Discover/The_Battle/Commanders/Sam_Houston/)
- [Texas Monthly — Sam Houston at 200](https://www.texasmonthly.com/being-texan/sam-houston-at-200/)
- [American Battlefield Trust — Sam Houston](https://www.battlefields.org/learn/biographies/sam-houston)
- [Mass Historical Society — JQ Adams's Final Years](https://www.masshist.org/beehiveblog/2022/06/my-life-has-been-spent-in-the-public-service-john-quincy-adamss-final-years-1843-1848/)
- [Britannica — JQ Adams Second Career](https://www.britannica.com/biography/John-Quincy-Adams/Second-career-in-Congress)
- [Senate.gov — Senator Stephen Douglas Dies](https://www.senate.gov/artandhistory/history/minute/Senator_Stephen_Douglas_Dies.htm)
- [Encyclopedia.com — Old Hickory](https://www.encyclopedia.com/history/dictionaries-thesauruses-pictures-and-press-releases/old-hickory)

Word-origin / anachronism checks:
- [Idiom Origins — Two-faced (1610s)](https://idiomorigins.org/origin/two-faced)
- [Oxford English Dictionary — predictable (1820)](https://www.oed.com/dictionary/predictable_adj)
- [Dictionary.com — predictable (1815–25)](https://www.dictionary.com/browse/predictable)
- [The Idioms — Hale and hearty (1689)](https://www.theidioms.com/hale-and-hearty/)
- [Stanford Encyclopedia — Cosmopolitanism](https://plato.stanford.edu/entries/cosmopolitanism/)
- [Two Min English — Likeable / Likable history (1730)](https://twominenglish.com/likeable-or-likable/)

Campaign-style / 1840 context (carry-overs from PR4a):
- [White House Historical — William Henry Harrison](https://www.whitehousehistory.org/bios/william-henry-harrison)
- [Wikipedia — Tippecanoe and Tyler Too](https://en.wikipedia.org/wiki/Tippecanoe_and_Tyler_Too)
- [Wikipedia — Harrison 1840 campaign](https://en.wikipedia.org/wiki/William_Henry_Harrison_1840_presidential_campaign)
