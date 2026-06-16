# Historical Context: Independence-Era Event Graph (Phase 2.4.3)

> Grounds the branching decision-graph expansion of phase 2.4.3 for the **1772
> scenario**. Scope is the Independence era only: flowchart nodes **0–48**
> (Gaspee Affair → the two Indian treaties / "Keowee War"). The French
> Revolution node (idx 49) begins the Federalism era and is **out of scope**.
>
> Design contract: `docs/research/independence-era-flowchart-source.md` (node
> text + 31 recovered edges) and the two screenshots (`IMG_1889.png`,
> `IMG_1890.png`, authoritative for structure). Existing implementation of the
> spine: `src/data/eraEvents1772.ts` (the current 7+-event scripted chain).
>
> Confidence levels are marked per claim: **(a)** consensus history,
> **(b)** contested-but-reasonable, **(c)** my own inference/synthesis.

## Era window

- **1772–1788** (with a soft tail to 1791 for Vermont statehood).
- **Opening bound:** the Gaspee Affair, **June 9–10, 1772** — the earliest
  spine node, and the year the 1772 scenario begins.
- **Closing bound (the era seam the PM must respect):** ratification of the
  Constitution. Nine states ratified when **New Hampshire** ratified on
  **June 21, 1788**; the first federal government under the Constitution began
  **March 4, 1789**. Everything from the **French Revolution node onward
  (idx 49+) is Federalism**. (a)
  [Census](https://www.census.gov/about/history/stories/monthly/2023/june-2023.html),
  [Avalon](https://avalon.law.yale.edu/18th_century/ratnh.asp)
- Within this window there is **no President of the United States** (that
  office is created by the 1789 government). This single fact reshapes the
  decider mapping for every wartime/foreign-policy decision in the era — see
  the decider section.

## Binding facts (PM should treat these as ground truth)

Table format: **event → year → historical decider → one-line → source**. All
dates verified from secondary sources; confidence (a) unless noted.

| Event (flowchart node) | Year | Who actually decided | One-line | Source |
|---|---|---|---|---|
| Gaspee Affair (0) | 1772 (Jun 9–10) | local actors (`auto`) | RI merchants board & burn the grounded customs schooner HMS *Gaspee*; the threat of trial-in-England inflamed the colonies. | [Britannica/WHE](https://www.worldhistory.org/Gaspee_Affair/), [USHistory](https://www.ushistory.org/declaration/related/gaspee.html) |
| Committees of Correspondence (1) | 1772 (Boston, Nov) – 1774 | colonial assemblies / Sam Adams (`auto`) | Town & colony committees coordinate resistance; Boston's formed Nov 1772, Virginia's intercolonial committee Mar 1773. | [Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/first-continental-congress) |
| "Tax Act" = **Tea Act** (2) | **1773** (May) | Parliament (`auto`) | Grants the East India Co. a tea monopoly while keeping the 3-pence Townshend tea duty; the chart's "Tax Act" in post-1772 position is the Tea Act. | [Britannica](https://www.britannica.com/event/Tea-Act), [Wikipedia](https://en.wikipedia.org/wiki/Tea_Act) |
| Boston Tea Party (3) | 1773 (Dec 16) | Sons of Liberty (`auto`) | ~342 chests dumped in Boston Harbor in protest of the Tea Act. | [History.com](https://www.history.com/articles/tea-act) |
| Intolerable/Coercive Acts (implied, leads to CC) | 1774 (spring) | Parliament (`auto`) | Punitive acts (Boston Port, Massachusetts Government, Administration of Justice, Quartering) → trigger the First Continental Congress. | [Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/first-continental-congress) |
| (First) Continental Congress (4) | 1774 (Sep 5 – Oct 26) | the Congress itself (`cc-president`) | 12 colonies meet at Carpenters' Hall, Philadelphia; presided by Peyton Randolph (then Henry Middleton from Oct 22). | [AmHistoryCentral](https://www.americanhistorycentral.com/entries/first-continental-congress-facts/) |
| Declaration of Resolves (5) | 1774 (Oct) | the Congress (`cc-president`) | Statement of colonial rights + the **Continental Association** boycott (signed Oct 20, 1774). | [Encyclopedia Virginia](https://encyclopediavirginia.org/primary-documents/continental-association-october-20-1774/) |
| Lexington & Concord (6) | 1775 (Apr 19) | British commander on the ground (`auto`); colonial response via `cc-president` | British regulars repulsed seizing militia stores; opens the shooting war. | [LOC timeline](https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/american-revolution-1763-1783/revolutionary-war-groping-toward-peace-1781-1783/) |
| Second Continental Congress / **Create Continental Army** (13) | 1775 (May; army Jun 14–15) | the Congress (`cc-president`) | Congress adopts the army & appoints **Washington commander-in-chief** Jun 15, 1775. | [LOC](https://www.loc.gov/collections/continental-congress-and-constitutional-convention-from-1774-to-1789/articles-and-essays/timeline/1787-to-1788/) |
| Conciliatory Resolution (24) | **1775** (Feb 20/27) | Parliament (`auto` offer); Congress rejects (`cc-president`) | Lord North's olive branch: a colony taxing itself for defense could be spared parliamentary taxation; rejected as too little. | [Wikipedia](https://en.wikipedia.org/wiki/Conciliatory_Resolution), [HistoryCentral](https://historycentral.com/documents/North.html) |
| Declaration of Independence (12) | 1776 (Jul 2 vote / Jul 4 adopted) | the Congress (`cc-president`) | Lee's Resolution (Jul 2) then the Declaration (Jul 4); 13 colonies become independent states. | [LOC](https://www.loc.gov/collections/continental-congress-and-constitutional-convention-from-1774-to-1789/articles-and-essays/timeline/) |
| Articles of Confederation (14) | drafted **1777** (Nov), ratified **1781** (Mar 1) | the Congress / states (`cc-president`) | Confederal framework: each state one vote, 9/13 to legislate, unanimity to amend. | [LOC](https://www.loc.gov/) |
| Treaty of Alliance w/ France (21) | **1778** (Feb 6) | the Congress ratifies (`cc-president`) | Military alliance + Amity & Commerce; France requires US independence as a peace condition; turning point of the war. | [Britannica](https://www.britannica.com/event/Franco-American-Alliance), [Archives](https://www.archives.gov/milestone-documents/treaty-of-alliance-with-france) |
| Carlisle Peace Commission (23) | **1778** (arrived Jun) | Parliament's offer; Congress rejects (`cc-president`) | Britain offers self-rule within the empire (repeals Tea & Massachusetts Govt Acts, disclaims the Declaratory Act) but **not independence**; Congress refuses. | [Britannica](https://www.britannica.com/topic/Carlisle-Commission), [Wikipedia](https://en.wikipedia.org/wiki/Carlisle_Peace_Commission) |
| Spain enters war (vs. Britain) | **1779** (Jun 21) | Spanish crown (`auto`) | Spain joins **France** (Treaty of Aranjuez, Apr 12, 1779) and declares war on Britain — but **never formally allies with the US**. | [Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/treaty-of-aranjuez-1779) |
| North ministry falls / Parliament authorizes peace (hook for nodes 30–33) | **1782** (Mar 5 bill; North resigns Mar 22) | **Parliament**, not the King (`auto`) | After Yorktown, Commons authorizes peace and North's government collapses; Rockingham opens negotiations. | [HistoryOfParliament](https://historyofparliament.com/2013/09/04/lord-north-and-yorktown/), [Wikipedia](https://en.wikipedia.org/wiki/Second_Rockingham_ministry) |
| Dutch recognition + loans (28, 29) | **1782** (Apr 19 recognition; loan Jun 1782) | the Congress's envoy **John Adams** (`cc-president` / treat as a diplomatic actor) | Dutch Republic is the 2nd nation to recognize the US; Adams floats a ~5-million-guilder Amsterdam loan, opening US credit. | [AmRevMuseum](https://www.amrevmuseum.org/the-netherlands-and-the-american-revolution), [Beursgeschiedenis](https://www.beursgeschiedenis.nl/en/moment/the-netherlands-finances-the-us/) |
| Treaty of Paris (27) | **1783** (signed Sep 3; ratified by Congress **Jan 14, 1784**) | the Congress ratifies (`cc-president`) | Britain recognizes US independence; western border set at the **Mississippi**, roughly doubling US territory. | [State Dept](https://2001-2009.state.gov/r/pa/ho/time/ar/14313.htm), [History.com](https://www.history.com/this-day-in-history/september-3/treaty-of-paris-signed) |
| Republic of Vermont (15, 16, 19) | **proclaimed 1777** (Jan 15); statehood **1791** (Mar 4) | Vermont's own convention; later **Congress** admits (`cc-president` → post-1789 `congress`) | De-facto independent republic over disputed NH/NY grants; NY drops its claim for $30,000 (1790), VT becomes the 14th state. | [Wikipedia](https://en.wikipedia.org/wiki/Vermont_Republic), [WCAX](https://www.wcax.com/2026/03/06/vermont-became-14th-state-march-4-1791-heres-how-it-got-there/) |
| Annapolis Convention (36) | **1786** (Sep 11–14) | the delegates (`auto` / advisory) | Only 5 states attend; Hamilton's report calls for a full convention at Philadelphia in May 1787. | [Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/annapolis-convention), [BillOfRights](https://billofrightsinstitute.org/essays/the-annapolis-convention/) |
| Treaty of Fort Stanwix (41) | **1784** (Oct 22) | the **Confederation Congress'** commissioners (`congress`/`cc-president`) | Six Nations cede Ohio-country & western NY claims; punishes the 4 nations that backed Britain; Buffalo Creek council later repudiates it. | [NPS](https://www.nps.gov/articles/000/treaty-and-land-transaction-of-1784.htm), [Wikipedia](https://en.wikipedia.org/wiki/Treaty_of_Fort_Stanwix_(1784)) |
| Treaty of Hopewell (45) | **1785–86** (Cherokee Nov 28, 1785; Choctaw Jan 3, 1786; Chickasaw Jan 10, 1786) | the **Confederation Congress'** commissioners (`congress`/`cc-president`) | Three treaties "on the Keowee" (SC) set boundaries with the Cherokee, Choctaw, Chickasaw; almost immediately violated by settlers. | [Wikipedia](https://en.wikipedia.org/wiki/Treaty_of_Hopewell), [MississippiEnc](https://mississippiencyclopedia.org/entries/treaty-of-hopewell/) |
| Constitutional Convention (39) | **1787** (May 25 – Sep 17) | the state-appointed delegates (`auto` → game's dedicated Convention screen) | Drafts the Constitution; already modeled in-game as a special interactive screen (`constitutionalConvention.ts`). | [Constitution Annotated](https://constitution.congress.gov/browse/essay/intro.5-3/ALDE_00000050/) |
| Federalist & Anti-Federalist Papers (40) | **1787–88** (Federalist Oct 27, 1787 – May 28, 1788) | partisan authors / the public ratification debate (`auto`) | 85 "Publius" essays vs. the "Brutus"/Anti-Federalist essays argue ratification state-by-state. | [Battlefields](https://www.battlefields.org/learn/articles/federalist-papers), [NY Courts](https://history.nycourts.gov/about_period/antifederalist-papers/) |

## Key figures

The game already seeds the era via its 1772 draft dataset and faction names
(`src/data/factions1772.ts` — "Sons of Liberty," "Jefferson's Patriots,"
"Washington/Adams/Jay Patriots," etc.). For THIS feature the load-bearing
roles are the **offices**, not the individuals, because decisions are gated on
who holds the office. The figures who historically filled the relevant roles:

- **President of the Continental/Confederation Congress** — the in-game
  `cc-president` decider. Held successively by **Peyton Randolph** (1774,
  briefly 1775), **Henry Middleton** (late Oct 1774), **John Hancock**
  (1775–77, presided over the Declaration), and others (Laurens, Jay,
  Huntington, etc.). **Crucial:** this office was deliberately weak — a
  neutral presiding moderator who could **not** set the agenda, appoint
  committees, or act independently of Congress. It is **not** a head of state
  and **not** the ancestor of the U.S. presidency.
  [House.gov](https://history.house.gov/People/Continental-Congress/Presidents/),
  [Wikipedia](https://en.wikipedia.org/wiki/President_of_the_Continental_Congress) (a)
- **George Washington** — Commander-in-Chief of the Continental Army from
  **Jun 15, 1775**. All *military* decisions in the war (whether to give
  battle, the army's existence/disbandment) historically ran through the
  commander-in-chief acting under Congress, **not** through any "president."
  The game already references "Create Continental Army" (node 13) and a
  `continentalArmy` unlock — Washington is the correct authority anchor there. (a)
- **Benjamin Franklin, Silas Deane, Arthur Lee** — the commissioners who
  negotiated the **French alliance (1778)**; the chart's precondition "Amb to
  France Exists" (node 20) maps to this diplomatic-commissioner role, which
  Congress appointed. [Britannica](https://www.britannica.com/event/Franco-American-Alliance) (a)
- **John Adams** — sole envoy who won **Dutch recognition and the 1782 loan**;
  the chart's "Dutch Recognize the US" / "US can now take out loans" (28, 29)
  are his work, again a Congress-appointed diplomatic actor, not an executive. (a)
- **Benjamin Hawkins / Andrew Pickens / Joseph Martin / Lachlan McIntosh** —
  the **Hopewell** commissioners (1785–86). **Benjamin Hawkins** also a Stanwix
  context figure. These were Congress-appointed Indian commissioners — the
  correct authority for nodes 41 and 45 is the **Confederation Congress**, not a
  president. [Wikipedia](https://en.wikipedia.org/wiki/Treaty_of_Hopewell) (a)
- **Lord North** — British PM whose ministry's policies (and whose 1775
  Conciliatory Resolution & 1778 Carlisle Commission) drive the British-side
  branches; his ministry **fell in March 1782**, the real hook for the
  war-ending counterfactuals. (a)

## Timeline of relevant events (chronological)

- **1772 Jun 9–10** — Gaspee Affair (node 0). (a)
- **1772 Nov** — Boston Committee of Correspondence formed; intercolonial spread
  through 1773–74 (node 1). (a)
- **1773 May** — Tea Act ("Tax Act," node 2). (a)
- **1773 Dec 16** — Boston Tea Party (node 3). (a)
- **1774 (spring–summer)** — Coercive/Intolerable Acts (the trigger for the CC). (a)
- **1774 Sep 5 – Oct 26** — First Continental Congress; **Oct 20** Continental
  Association; **Oct** Declaration of Resolves (nodes 4, 5). (a)
- **1775 Feb 20/27** — Lord North's **Conciliatory Resolution** (node 24). (a)
- **1775 Apr 19** — Lexington & Concord (node 6); Revolutionary War begins (7). (a)
- **1775 May** — Second Continental Congress convenes; **Jun 15** Washington made
  C-in-C; **Jun 14–15** Continental Army created (node 13). (a)
- **1776 Jul 2/4** — Independence voted/Declared (node 12). (a)
- **1777 Jan 15** — Vermont declares itself an independent republic (node 15). (a)
- **1777 Nov** — Articles of Confederation drafted (node 14). (a)
- **1777 Oct 17** — Saratoga (the victory that brought France in) — adjacent,
  not a chart node, but it constrains the timing of the French alliance. (a)
- **1778 Feb 6** — Treaty of Alliance + Amity & Commerce with France (node 21). (a)
- **1778 (Jun)** — Carlisle Peace Commission arrives; Congress rejects (node 23). (a)
- **1779 Jun 21** — Spain declares war on Britain (allied to France, not the US). (a)
- **1781 Mar 1** — Articles of Confederation ratified. (a)
- **1781 Oct 19** — Cornwallis surrenders at Yorktown (the war-weariness hook). (a)
- **1782 Mar 5 / Mar 22** — Commons authorizes peace; **North ministry falls**
  (real basis for nodes 30–34). (a)
- **1782 Apr 19** — Dutch recognition; **Jun 1782** Amsterdam loan (nodes 28, 29). (a)
- **1783 Sep 3** — Treaty of Paris signed; **1784 Jan 14** ratified by Congress
  (node 27). (a)
- **1784 Oct 22** — Treaty of Fort Stanwix (node 41). (a)
- **1785 Nov 28 – 1786 Jan 10** — Treaties of Hopewell (node 45). (a)
- **1786 Aug–Sep** — Shays' Rebellion (already in-game) + **Annapolis Convention**
  Sep 11–14 (node 36). (a)
- **1787 May 25 – Sep 17** — Constitutional Convention (node 39). (a)
- **1787 Oct 27 – 1788 May 28** — Federalist Papers; Brutus essays from Oct 18,
  1787 (node 40). (a)
- **1788 Jun 21** — New Hampshire ratifies (9th state); Constitution adopted. (a)
- **1789 Mar 4** — First federal government begins (**era seam → Federalism**). (a)
- **1791 Mar 4** — Vermont admitted as the 14th state (node 19; tail of the era). (a)

## Counterfactual-plausibility table

The chart's non-historical branches, each rated and given a historical hook.
Plausibility is my synthesis (c) over consensus facts (a) about what
contemporaries actually weighed.

| Branch (node) | Plausible? | Historical hook | Source |
|---|---|---|---|
| **Carlisle Peace Commission** path — settle short of independence (23) | **High** | Real: in 1778 Britain genuinely offered self-rule within the empire (repealing the Tea & Massachusetts Govt Acts, disclaiming the Declaratory Act). It failed only because Congress demanded full independence. A "negotiated dominion status" ending is the single best-grounded counterfactual in the tree. | [Britannica](https://www.britannica.com/topic/Carlisle-Commission) |
| **Conciliatory Resolution** path — pre-war settlement (24) | **Medium-high** | Real Feb 1775 offer; plausible *before* Lexington but the Coercive Acts had already hardened opinion. A 1775 off-ramp is defensible but historically rejected fast. | [Wikipedia](https://en.wikipedia.org/wiki/Conciliatory_Resolution) |
| **"Rev War Ends Due to War Weariness in Great Britain"** (33; year-gate 1786 is late) | **High (mechanism); timing wrong** | British war-weariness was real and decisive — it toppled North in **March 1782** and produced the peace. **Correction:** the hook is **1782**, not 1786. The chart's "Year is 1786" gate (node 34) is too late for British-side weariness; 1786 better fits *American* domestic exhaustion. | [HistoryOfParliament](https://historyofparliament.com/2013/09/04/lord-north-and-yorktown/) |
| **"Rev War Ends Due to War Weariness in the Colonies"** (31; year-gate 1780, node 32) | **Medium** | American war-weariness, currency collapse, mutinies (e.g., Pennsylvania Line, 1781) were real. A negotiated/collapse ending around 1780–81 is plausible — but a *colonial* collapse would more likely mean reabsorption than a clean "autonomy grant." | [LOC](https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/american-revolution-1763-1783/) |
| **"King George III Grants America Autonomy as Cost of War Too Much"** (30) | **Mechanism plausible / attribution wrong** | War-cost-driven concession is real, BUT George III was a **constitutional monarch** — he could not "grant autonomy" by personal fiat. **Parliament** authorized peace (1782). Reframe the *actor* as Parliament/the British government; the King is the wrong decider. | [NatGeo](https://www.nationalgeographic.com/history/article/king-george-iii-american-revolution), [Britannica](https://www.britannica.com/biography/George-III/Norths-ministry-1770-82) |
| **"Won but Independence not proclaimed"** (8) | **Low-medium** | Hard to ground directly — a military win without a declaration is counterfactual. The nearest real analogue is the *dominion-status* idea (win concessions, stay within the empire) — which is the Carlisle path, not a battlefield "win." Treat as a stylized fork, flavor it as "autonomy within empire," not "independent but silent." (c) | — |
| **"Won" (no independence) → Treaty of Fort Stanwix** (9 → 41) | **Plausible as sequencing** | Whatever the political settlement, the **Indian treaties (Stanwix 1784, Hopewell 1785–86) really happened** and the victorious US really did dictate land cessions. Gating the treaties behind a war "win" is historically sound. | [NPS](https://www.nps.gov/articles/000/treaty-and-land-transaction-of-1784.htm) |
| **Lost-war / "Game End"** ending (11) | **Plausible** | A British reconquest was a live fear through 1776–77 (before Saratoga/France). A loyalist-reabsorption "game over" has a real basis in the period's contingency. (b) | [LOC](https://www.loc.gov/) |
| **"Liberty Treaty w/ Spain" / "Spain meter moves to ally"** (25, 26) | **FANTASY — reframe** | Spain **never formally allied with the United States.** It allied with **France** (Aranjuez, 1779) and fought Britain for its own aims (Gibraltar, the Floridas), deliberately withholding direct recognition of US independence lest it inspire Spain's own colonies. There was **no** US–Spain "alliance treaty" in this era. Reframe as Spanish *belligerence against Britain* / covert aid via Louisiana (real: goods flowed up the Mississippi), **not** a US alliance. The real US–Spain treaty (Pinckney's, 1795) is Federalism-era and already a separate later chart node. | [AmRevMuseum](https://www.amrevmuseum.org/spain-and-the-american-revolution), [Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/treaty-of-aranjuez-1779) |
| **Alliance w/ France → "Cannot lose Rev. War"** (21 → 22) | **High (defensible simplification)** | The French alliance is genuinely regarded as *the* turning point; "defeat is no longer possible" overstates it (the war dragged on to 1781) but is a reasonable game abstraction. The existing in-game text already says "Defeat is no longer possible." | [Britannica](https://www.britannica.com/event/Franco-American-Alliance) |
| **Dutch recognition → "US can now take out loans"** (28 → 29) | **High** | Real and causal: Adams's 1782 Amsterdam loan opened US public credit; gating a "loans" mechanic on Dutch recognition is historically exact. | [Beursgeschiedenis](https://www.beursgeschiedenis.nl/en/moment/the-netherlands-finances-the-us/) |
| **Vermont: "Claim" vs "Do not claim"** (15–18) | **High** | Real dispute: Vermont was a de-facto independent republic 1777–91; NY and NH both claimed it; NY relented in 1790 for $30,000. Both the "claim it" and "let it be independent" forks are grounded. | [Wikipedia](https://en.wikipedia.org/wiki/Vermont_Republic) |
| **Annapolis → "A: Constitutional Convention follows" vs "B: Confederation remains"** (36–38) | **High** | Real fork: the Annapolis Convention *could* have fizzled (only 5 states came). The "Articles persist" counterfactual is exactly the road not taken. | [BillOfRights](https://billofrightsinstitute.org/essays/the-annapolis-convention/) |
| **Stanwix A/B** — make peace vs. "manipulative treaty, respect their lands" (42/43) | **High (real moral/strategic debate)** | The treaty really *did* split the Six Nations (it punished the 4 pro-British nations) and the Buffalo Creek council **repudiated** it as unauthorized. A "respect their lands" option reflects a real contemporaneous critique. Note label fix below. | [Wikipedia](https://en.wikipedia.org/wiki/Treaty_of_Fort_Stanwix_(1784)) |
| **Hopewell A/B** — settle boundaries vs. "we'll break it anyway" (46/47) | **High (the US did break it)** | The US **did** violate Hopewell almost immediately (3,000 State-of-Franklin settlers were already over the line; the US failed to enforce Article 7). The cynical "B" option is historically the accurate outcome. | [Britannica](https://www.britannica.com/event/Cherokee-wars-and-treaties) |
| **"Iroquois League War"** conflict node (44) | **Reframe label** | No single "Iroquois League War" followed Stanwix; the Six Nations *fragmented* rather than waging a unified war. The real post-treaty violence in the era is settler-Iroquois friction and the broader Northwest frontier conflict (which culminates in the **1790s Northwest Indian War**, Federalism-era). Treat node 44 as "frontier conflict with the Six Nations," not a named war. (b)/(c) | [Wikipedia](https://en.wikipedia.org/wiki/Treaty_of_Fort_Stanwix_(1784)) |
| **"Keowee / War"** conflict node (48) | **Reframe label** | "Keowee" is the *river/place* Hopewell was signed "on" — not a war. The real Cherokee resistance is the **Chickamauga / Cherokee–American wars (1776–1794)** under Dragging Canoe, with renewed violence after Hopewell. Reframe node 48 as the **Chickamauga/Cherokee frontier war**. | [Wikipedia](https://en.wikipedia.org/wiki/Cherokee%E2%80%93American_wars), [Chattanoogan](https://www.chattanoogan.com/2012/8/1/231368/Chickamauga-Cherokee-Wars---Part-1-of.aspx) |

## Decider-role mapping (CRITICAL)

**The single most important correction for this feature:** there is **no
President of the United States anywhere in the Independence era.** The game's
`decider` union is `'president' | 'congress' | 'cabinet' | 'cc-president' |
'auto'`. For 1772–1788, `'president'` and `'cabinet'` **must not be used** —
those offices do not exist until the 1789 government. The existing
`eraEvents1772.ts` already does this correctly (it uses `cc-president` for
Declaration of Resolves, Lexington, Lee's Resolution, Declaration of
Independence, Articles, etc.) — the new graph should preserve that discipline.

Recommended mapping of each flowchart decision to the era-appropriate authority:

| Flowchart decision (node) | Real authority | Recommended `decider` |
|---|---|---|
| Declaration of Resolves adopt/table (5) | First Continental Congress | `cc-president` |
| Lexington response — raise army / leave to Mass. (6→13) | Second Continental Congress (army); Washington executes | `cc-president` (the *decision*; the army's command is Washington's) |
| Create Continental Army (13) | Congress adopts; Washington commands | `cc-president` (adopt) |
| Lee's Resolution / Declaration of Independence (12) | Continental Congress | `cc-president` |
| Articles of Confederation ratify (14) | Congress + states | `cc-president` |
| Alliance with France accept (21) | Congress ratifies the commissioners' treaty | `cc-president` |
| Carlisle / Conciliatory — accept terms vs. demand independence (23, 24) | Continental Congress | `cc-president` |
| Treaty of Paris ratify (27) | Confederation Congress | `cc-president` (or `auto` as the game currently does — it's a fait accompli) |
| Dutch recognition / loans (28, 29) | Congress's envoy (Adams) | `auto` for the event; if a *choice*, `cc-president` |
| Claim Vermont vs. not (16–18) | Congress (and NY state) | `cc-president` (pre-1789); `congress` if it resolves post-ratification |
| Annapolis → call a convention vs. not (36–38) | the convention delegates / Congress endorses | `auto` for the call; `cc-president` if Congress must endorse (it did, Feb 1787) |
| Fort Stanwix A/B (41–43) | Confederation Congress's Indian commissioners | `congress` (post-Articles, the body is the Confederation Congress) or `cc-president` |
| Hopewell A/B (45–47) | Confederation Congress's commissioners | `congress` or `cc-president` |
| Constitutional Convention (39) | state-appointed delegates | dedicated Convention screen (already in-game) / `auto` kickoff |
| "King George grants autonomy" (30) | **British Parliament**, NOT the King | `auto` (it's a foreign actor's decision, not a player decision) — and **rename** away from "King George grants" |

**Note on `congress` vs `cc-president` after 1781:** once the Articles take
effect (Mar 1781), the body is the **Confederation Congress**. The game already
renames it ("Congress is renamed the Confederation Congress" — see
`eraEvents1772.ts` Articles event). For Stanwix/Hopewell (1784–86) either
`congress` or `cc-president` is era-correct; `cc-president` keeps the same
decider semantics the rest of the era uses, which is cleaner. (c)

## Period-specific terminology (use vs. avoid)

**Use:**
- "Continental Congress" (1774–81), "Confederation Congress" / "Congress of the
  Confederation" (1781–89), "President of Congress" (the presiding officer).
- "Patriots" and "Loyalists" (or "Tories"); "Whigs" (pro-colonial) — the game's
  faction names already lean on these correctly.
- "Federalists" vs. "Anti-Federalists" — but **only as ratification-debate
  positions (1787–88)**, not as the era's two parties. See anti-patterns.
- "Commander-in-Chief," "Continental Army," "Continental Navy," "militia."
- "Crown," "Parliament," "ministry," "Lord North," "the King-in-Parliament."
- "Articles of Confederation," "Continental Association," "Declaration of
  Resolves," "Coercive/Intolerable Acts."
- For the Indian treaties: "Six Nations"/"Haudenosaunee"/"Iroquois
  Confederacy"; "Cherokee," "Choctaw," "Chickasaw."

**Avoid (anachronistic in this era):**
- "President of the United States," "the White House," "the Cabinet," "Secretary
  of State/Treasury/War" — **none exist before 1789.**
- "Democrat" / "Republican" as party labels (the first-party system, Federalist
  vs. Democratic-Republican, is a **1790s** phenomenon — Federalism era).
- "Liberal" / "Conservative" in the modern ideological sense (the game's 7-point
  ideology scale is fine as an abstraction, but era flavor text should use
  Patriot/Loyalist/Whig framing, not "liberals" and "conservatives").
- "Wall Street," "national bank," "the Treasury," "the Mint," "the dollar" as a
  national currency — all Federalism-era. (The chart correctly places Buttonwood,
  the national bank, and Hamiltonian finance after the French Revolution node.)
- "Manifest Destiny" (1840s coinage) for the westward-treaty branches.

## Common pop-history simplifications and what they get wrong

- **"The Founders were a unified bloc."** False, and central to this feature.
  Independence was *contested at every step*: the Conciliatory Resolution (1775)
  and Carlisle Commission (1778) were real off-ramps; Congress hesitated over
  Lee's Resolution; loyalists were a substantial minority. The branching tree's
  whole premise (negotiated settlements, loyalist endings) is **historically
  appropriate**, not fantasy — except where noted (Spain). (a)
- **"King George III personally caused/ran the war."** He was a constitutional
  monarch; **Parliament** made colonial policy and **Parliament** authorized
  peace in 1782. The chart's "King George grants autonomy" personifies a
  parliamentary decision. (a)
- **"Spain was America's ally."** No — Spain fought Britain for Spanish aims and
  withheld recognition of the US. Conflating Spanish belligerence with a US
  alliance is the chart's clearest factual error. (a)
- **"The President of the Continental Congress was a proto-president."** No — it
  was a weak, near-ceremonial presiding office with no executive power, unrelated
  to the later presidency. Don't let `cc-president` imply head-of-state powers. (a)
- **"The Treaty of Fort Stanwix settled things peacefully with one united
  Iroquois nation."** No — it **split** the Six Nations (punishing the four
  pro-British nations) and the Buffalo Creek council **repudiated** it. The "this
  is a manipulative treaty" option (node 43) reflects a real contemporary view. (a)
- **"Hopewell protected Cherokee land."** The US **broke** it almost immediately;
  settlers were already over the line and the US never enforced Article 7. The
  cynical Hopewell-B option is the accurate outcome, not a villain fantasy. (a)
- **"Vermont was always part of the U.S."** It was an **independent republic for
  14 years** (1777–91) and only joined when NY dropped its claim. (a)
- **"The Articles were an obvious failure replaced on schedule."** The move to a
  convention was contingent — Annapolis nearly failed (5 states), and "the
  Confederation persists" (node 38) is a genuine road-not-taken. (a)

## Anti-patterns / anachronism guards (must NOT appear in this era's nodes)

1. **No U.S. President / Cabinet / executive departments pre-1789.** Never set a
   node's `decider` to `'president'` or `'cabinet'` for any node 0–48. Wartime
   and foreign-policy decisions route through **`cc-president`** (the Continental/
   Confederation Congress); military execution is **Washington as C-in-C**. This
   is the top guard.
2. **"King George III grants autonomy" is an attribution error.** The decision to
   end the war and concede was **Parliament's** (1782), not the King's personal
   act. Rename node 30 and route it as a foreign-actor (`auto`) outcome, framed as
   "Parliament/the British government concedes," with the *real* trigger being
   post-Yorktown war-weariness (1782), not 1786.
3. **No US–Spain alliance.** Cut or reframe nodes 25–26 ("Liberty Treaty w/
   Spain," "Spain meter moves to ally"). Spain allied with **France**, fought
   Britain for its own ends, and withheld recognition. Period-correct Spanish
   involvement = belligerence vs. Britain + covert aid via Louisiana, **not** a US
   alliance. (Pinckney's Treaty, 1795, is a separate Federalism node.)
4. **No first-party-system party labels.** "Federalist" and "Anti-Federalist" are
   **ratification-debate positions (1787–88)** — they map to the game's BLUE/RED
   *factions/positions*, **not** to "the Democrats" and "the Republicans."
   Recommendation: keep the game's BLUE = "Patriots (Anti-Federalist)" and RED =
   "Federalists" framing (as `factions1772.ts` already does), but **do not** call
   them "parties" in the modern sense, and don't let "Federalist" leak modern
   connotations. (Note also that "Federalist" *reverses polarity* later in the
   game's range — flag for cross-era consistency, but out of scope here.)
5. **No national-finance institutions in the Independence era.** No national bank,
   Treasury, Mint, Wall Street/Buttonwood, or "the dollar" as national currency.
   The chart correctly gates all of these behind the French Revolution node
   (Federalism). The one in-era financial fact is the **Dutch loan (1782)** —
   foreign credit, not a domestic bank.
6. **State/territory existence.** In 1772–88, **Vermont** is an independent
   republic (not yet a state until 1791); **Kentucky** (1792) and **Tennessee**
   (1796) are frontier districts/territories, **not** states; the **Northwest
   Territory** isn't organized until the 1787 Ordinance. Don't show these as
   states on the era map.
7. **Correct the Indian-nation specifics.** Stanwix (node 41) is the **Six Nations
   / Haudenosaunee** (Mohawk, Oneida, Onondaga, Cayuga, Seneca, Tuscarora — the
   chart's "six Iroquois tribes" wording in node 43 is right). Hopewell (node 45)
   is **three distinct nations** (Cherokee, Choctaw, Chickasaw) via **three
   separate treaties on different dates**, not one event — the chart's "three
   tribes" framing in nodes 46–47 is right, but the single-node compression should
   be understood as standing in for three treaties.
8. **Rename the loose conflict labels.** "Iroquois League War" (44) → frontier
   conflict with the Six Nations (no unified "league war" occurred; the Six
   Nations fragmented). "Keowee War" (48) → the **Chickamauga / Cherokee–American
   wars** (Keowee is the river Hopewell was signed on, not a war).
9. **"Tax Act" = Tea Act (1773).** The spine node 2 is the **Tea Act**, not the
   1767 Townshend Acts or the 1765 Stamp Act. The existing game implementation
   already labels it "Tea Act" correctly; keep that. (Townshend 1767 and Stamp
   1765 predate the 1772 scenario start and are background, not spine nodes.)

## Era boundary (definition)

- **Independence era = nodes 0–48**, roughly **1772–1788** (tail to 1791 for
  Vermont statehood). It ends at **Constitution ratification (Jun 21, 1788) /
  first federal government (Mar 4, 1789)**.
- **Federalism era begins at node 49 (French Revolution)** and the Hamiltonian
  economic arc (Buttonwood/Wall Street, Compromise of 1790, the national bank,
  the Whiskey/Excise tax, Louisiana, War of 1812, Napoleon). These are the **next
  era's build** and are correctly out of scope for 2.4.3.
- **The seam test for the PM:** any node that presupposes a President of the
  United States, a Cabinet, executive departments, a national bank, a national
  currency, or the Federalist/Democratic-Republican *party* system belongs to
  Federalism, not Independence. Nodes 0–48 should contain none of those.

## Citations (ordered by importance to the brief)

1. [President of the Continental Congress — Wikipedia](https://en.wikipedia.org/wiki/President_of_the_Continental_Congress) — the weak, near-ceremonial nature of the `cc-president` office; not a head of state.
2. [Presidents of the Continental & Confederation Congresses — House.gov](https://history.house.gov/People/Continental-Congress/Presidents/) — succession of presiding officers (Randolph, Middleton, Hancock, …).
3. [George III — National Geographic](https://www.nationalgeographic.com/history/article/king-george-iii-american-revolution) & [Britannica: North's Ministry](https://www.britannica.com/biography/George-III/Norths-ministry-1770-82) — George as constitutional monarch; Parliament, not the King, made colonial policy and peace.
4. [Spain and the American Revolution — Museum of the American Revolution](https://www.amrevmuseum.org/spain-and-the-american-revolution) & [Treaty of Aranjuez (1779) — Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/treaty-of-aranjuez-1779) — Spain allied with France, not the US; the "Spain ally" branch is fantasy.
5. [Carlisle Peace Commission — Britannica](https://www.britannica.com/topic/Carlisle-Commission) & [Wikipedia](https://en.wikipedia.org/wiki/Carlisle_Peace_Commission) — 1778 British offer of self-rule short of independence; the best-grounded counterfactual.
6. [Conciliatory Resolution — Wikipedia](https://en.wikipedia.org/wiki/Conciliatory_Resolution) — Lord North's Feb 1775 olive branch.
7. [Lord North and Yorktown — History of Parliament](https://historyofparliament.com/2013/09/04/lord-north-and-yorktown/) & [Second Rockingham ministry — Wikipedia](https://en.wikipedia.org/wiki/Second_Rockingham_ministry) — British war-weariness; Commons authorizes peace (Mar 1782); North falls.
8. [Treaty of Fort Stanwix (1784) — Wikipedia](https://en.wikipedia.org/wiki/Treaty_of_Fort_Stanwix_(1784)) & [NPS](https://www.nps.gov/articles/000/treaty-and-land-transaction-of-1784.htm) — Six Nations cessions; the treaty split the Confederacy; Buffalo Creek repudiation.
9. [Treaty of Hopewell — Wikipedia](https://en.wikipedia.org/wiki/Treaty_of_Hopewell) & [Mississippi Encyclopedia](https://mississippiencyclopedia.org/entries/treaty-of-hopewell/) — three treaties (Cherokee/Choctaw/Chickasaw), 1785–86, "on the Keowee."
10. [Cherokee–American (Chickamauga) wars — Wikipedia](https://en.wikipedia.org/wiki/Cherokee%E2%80%93American_wars) & [Britannica: Cherokee wars and treaties](https://www.britannica.com/event/Cherokee-wars-and-treaties) — the real referent for the "Keowee War" label; Hopewell violated immediately.
11. [Franco-American Alliance — Britannica](https://www.britannica.com/event/Franco-American-Alliance) & [Treaty of Alliance — National Archives](https://www.archives.gov/milestone-documents/treaty-of-alliance-with-france) — Feb 6, 1778; turning point; independence as a peace condition.
12. [The Netherlands and the American Revolution — Museum of the American Revolution](https://www.amrevmuseum.org/the-netherlands-and-the-american-revolution) & [The Netherlands finances the US — Exchange History](https://www.beursgeschiedenis.nl/en/moment/the-netherlands-finances-the-us/) — Apr 19, 1782 recognition; Adams's 1782 Amsterdam loan opens US credit.
13. [Treaty of Paris 1783 — US Dept of State Archive](https://2001-2009.state.gov/r/pa/ho/time/ar/14313.htm) & [History.com](https://www.history.com/this-day-in-history/september-3/treaty-of-paris-signed) — signed Sep 3, 1783; ratified Jan 14, 1784; Mississippi border.
14. [Vermont Republic — Wikipedia](https://en.wikipedia.org/wiki/Vermont_Republic) & [WCAX](https://www.wcax.com/2026/03/06/vermont-became-14th-state-march-4-1791-heres-how-it-got-there/) — independent republic 1777–91; NY drops claim for $30,000; 14th state 1791.
15. [Annapolis Convention — Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/annapolis-convention) & [Bill of Rights Institute](https://billofrightsinstitute.org/essays/the-annapolis-convention/) — Sep 1786, 5 states, call for the Philadelphia convention.
16. [First Continental Congress — American History Central](https://www.americanhistorycentral.com/entries/first-continental-congress-facts/) & [Continental Association — Encyclopedia Virginia](https://encyclopediavirginia.org/primary-documents/continental-association-october-20-1774/) — Sep–Oct 1774; Declaration of Resolves; Oct 20 Association.
17. [Tea Act — Britannica](https://www.britannica.com/event/Tea-Act) & [Wikipedia](https://en.wikipedia.org/wiki/Tea_Act) — 1773; East India Co. monopoly; 3-pence Townshend duty retained; the spine "Tax Act."
18. [Gaspee Affair — World History Encyclopedia](https://www.worldhistory.org/Gaspee_Affair/) & [USHistory.org](https://www.ushistory.org/declaration/related/gaspee.html) — Jun 9–10, 1772; the era's opening node.
19. [Federalist Papers — American Battlefield Trust](https://www.battlefields.org/learn/articles/federalist-papers) & [Anti-Federalist Papers — NY Courts](https://history.nycourts.gov/about_period/antifederalist-papers/) — 1787–88 ratification debate; positions, not modern parties.
20. [New Hampshire ratification — Avalon Project](https://avalon.law.yale.edu/18th_century/ratnh.asp) & [1788 ratification — Census](https://www.census.gov/about/history/stories/monthly/2023/june-2023.html) — Jun 21, 1788 (9th state); the era seam; first government Mar 4, 1789.
