# Historical Context: First Continental Congress Builder (Phase 2.9.6)

> Grounds the **First Continental Congress builder** for the 1772 scenario,
> gated on the `intolerable_acts` era event firing AND the
> "Convene the First Continental Congress" response being chosen. Scope is
> the **initial seating of the First CC only** — the CC President is selected
> later at phase 2.2.1 (1774) and is out of scope. Confidence levels: **(a)**
> consensus history; **(b)** contested/reasonable; **(c)** my synthesis.

## Convening date and the Intolerable Acts gate

- **The First Continental Congress convened Sept 5, 1774, at Carpenters' Hall,
  Philadelphia, and adjourned Oct 26, 1774.** (a) The Coercive/Intolerable
  Acts were passed by Parliament in **spring 1774** (Mar–Jun); colonial
  selection of delegates ran **June 3 (CT) through August (the latest)**. The
  player-side gate "Intolerable Acts → Create CC" therefore lands the
  selection process **in 1774**, and the body itself first sits in
  **September 1774**. ([Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/first-continental-congress),
  [American History Central — facts](https://www.americanhistorycentral.com/entries/first-continental-congress-facts/))
- **PM gate guidance:** the phase should fire in **game-year 1774**
  (precondition: `intolerable_acts` event completed AND its `assembleCC`
  response chosen AND `year >= 1774`). The existing
  `intolerable_acts` node in `eraEvents1772.ts` (chartIndex 4) already has
  `postEffects: [{ type: 'assembleCC' }]` — that's the correct trigger hook.
- The colonies historically chose delegates **before** the body convened;
  the in-game phase order (selection → seating) is era-accurate.

## Per-colony delegate breakdown (actual vs. the user's abstraction)

**Total delegates who attended: 56 from 12 colonies.** (a) Georgia did not
attend (see next section). Exact attendance counts, cross-checked across
multiple sources:

| Colony | **Historical count** | User's spec | Match? |
|---|---|---|---|
| New Hampshire | **2** (Sullivan, Folsom) | 2 (small) | yes |
| Massachusetts | **4** (J. Adams, S. Adams, Cushing, R.T. Paine) | 4 (large) | **off by 1 high** |
| Rhode Island | **2** (Hopkins, Ward) | 2 (small) | yes |
| Connecticut | **3** (Dyer, Deane, Sherman) | 3 (medium) | yes |
| New York | **5** (Duane, Jay, P. Livingston, Low, Boerum/Alsop; W. Floyd attended later) | 3 (medium) | **off by 2 low** |
| New Jersey | **5** (Kinsey, Wm. Livingston, DeHart, Crane, Smith) | 3 (medium) | **off by 2 low** |
| Pennsylvania | **7–8** (Galloway, Dickinson [seated late], Biddle, Mifflin, Humphreys, Morton, Rhoads, Ross) | 4 (large) | **off by 3–4 low** |
| Delaware | **3** (Rodney, McKean, Read) | 2 (small) | **off by 1 low** |
| Maryland | **5** (Chase, Paca, Johnson, Goldsborough, Tilghman) | 4 (large) | **off by 1 low** |
| Virginia | **7** (Randolph, Washington, P. Henry, R.H. Lee, Pendleton, Harrison, Bland) | 4 (large) | **off by 3 low** |
| North Carolina | **3** (Caswell, Hewes, Hooper) | 3 (medium) | yes |
| South Carolina | **5** (Gadsden, Lynch Jr., H. Middleton, E. Rutledge, J. Rutledge) | 3 (medium) | **off by 2 low** |
| Georgia | **0** (did not attend) | 2 (small) | **historical mismatch** |
| **Total** | **56** (actual; PA 8 here) | **39** | — |

([Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/first-continental-congress),
[American History Central — VA delegates](https://www.americanhistorycentral.com/entries/virginia-delegates-first-continental-congress/),
[Mass. Hist. Soc.](https://www.masshist.org/revolution/congress1.php))

**Ranking the user is defensible on (a vs. b):** the user's "large" group
(PA, MA, VA, MD) is roughly right in *prominence* but **not in delegation
size**. The actual top-5 by delegation size were **PA (7–8), VA (7), NY (5),
NJ (5), MD (5), SC (5)** — a six-way cluster at the top. Massachusetts (the
*political* heart of the crisis) sent only **4**. The user's spec
*overweights MA and underweights PA and the mid-Atlantic / SC delegations*. (a)

**Two practical takeaways for the PM:**
1. **Each delegation cast ONE vote at the actual Congress, regardless of
   size** (Suffolk Resolves debate, Continental Association vote, etc.). (a)
   Historically the *count* per colony was a function of who the colonial
   assembly could agree on, not a representational scheme. The user's
   abstraction (2/3/4 by "size") is a clean game-design choice, but it's an
   **abstraction**, not an attempt to model historical headcounts. The PM
   should be transparent in UI flavor about this.
2. The historical delegate sizes did **not** track 18th-century population
   reliably either — PA had ~300k people and sent 8; VA had ~500k people
   and sent 7; MA had ~270k and sent 4. The "Big/Medium/Small" abstraction
   is at least as accurate as any other simplification.

## Georgia question — plain answer

**Georgia did NOT send delegates to the First Continental Congress.** (a)
The decision was made by **Georgia's own assembly representatives on Aug 10,
1774**, not by Royal Governor James Wright fiat. Three reinforcing reasons:

1. **Military dependency on Britain.** Georgia faced ongoing frontier
   pressure from the **Creek** and depended on regular British troops and
   trade goods for defense; alienating London was militarily intolerable. (a)
2. **Economic ties.** Georgia was the youngest, smallest, and most
   commercially Britain-dependent colony. (a)
3. **Loyalist-tinged provincial leadership.** Governor Wright successfully
   discouraged participation; the Aug 10 meeting could not agree to send
   delegates. ([UGA Press: The American Revolution in Georgia](https://ugapress.manifoldapp.org/read/the-american-revolution-in-georgia-1763-1789/section/33501aa9-901a-4704-bf22-c1776290eb17))

**Georgia DID send delegates to the Second Continental Congress (May
1775)** — specifically, **Lyman Hall** as an unofficial delegate from St.
John's Parish in **May 1775**, and a full official delegation after
**July 1775**. (a) Honoring this historically means **Georgia is excluded
from the inaugural First CC build** and only enters at the Second CC.

**PM decision (your call):** the user's spec gives Georgia 2 reps. If the PM
honors history, the build either (a) skips Georgia entirely for the First
CC, with a flavor note "Royal Governor James Wright suppresses the call;
Georgia will join in 1775," or (b) lets Georgia send 2 with a debuff /
flavor caveat. Both are defensible game choices; only option (a) is
historically accurate.

## Selection mechanism per colony (the real process)

Historically, each colony chose its own delegates by its **own institutions
of resistance**, on its own timeline. (a) Patterns:

- **Connecticut (first to act, June 3, 1774)** — chosen by the colonial
  **House of Representatives** (the regular assembly, which was Patriot-led
  and could meet openly).
- **Rhode Island** — chosen by the **General Assembly**.
- **Massachusetts (June 17)** — chosen by the **House of Representatives,
  meeting at Salem** under cover (Royal Governor Gage had dissolved them;
  they reconvened informally and locked the doors).
- **Maryland (June 22)** — chosen at a **county-committee convention at
  Annapolis** (extra-legal — counties appointed committees that then sent
  representatives).
- **Virginia (Aug 1–6)** — chosen by the **First Virginia Convention**
  (extra-legal body of former Burgesses after Gov. Dunmore dissolved the
  House of Burgesses). Vote tallies preserved: Randolph 107, Washington
  106, Henry 105, R.H. Lee 103, Pendleton 100, Harrison 94, Bland 90.
  ([Encyclopedia Virginia](https://encyclopediavirginia.org/election-of-delegates-to-congress-in-philadelphia/),
  [American History Central — VA delegates](https://www.americanhistorycentral.com/entries/virginia-delegates-first-continental-congress/))
- **South Carolina (Jul 1)** — chosen at a **general meeting of the
  inhabitants** in Charleston; ratified by the South Carolina Assembly
  Aug 2.
- **New Hampshire (Jul 21)** — chosen by **deputies appointed by the
  several towns** (town-meeting basis).
- **Pennsylvania** — chosen by the **Assembly**, which was itself dominated
  by the Quaker / proprietary party; this is why PA's delegation was the
  *most conservative* (Galloway, who tried to keep the colonies in the
  empire) and the *largest*.
- **New York** — chosen by **city/county committees** (NY had no central
  Patriot body; NYC, Albany, Suffolk, etc., each appointed).
- **New Jersey** — chosen by a **provincial committee** drawn from
  county committees.
- **Delaware** — chosen by **county assemblies** of the three lower counties.
- **North Carolina (Aug 25)** — chosen at the **First Provincial Congress
  at New Bern** (extra-legal; Royal Gov. Martin tried to ban it).

(All above: [American History Central — facts](https://www.americanhistorycentral.com/entries/first-continental-congress-facts/),
[Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/first-continental-congress),
[Mass. Hist. Soc.](https://www.masshist.org/revolution/congress1.php))

**Common pattern (a):** in colonies with cooperative assemblies (CT, RI,
PA, MA's lower house when it could meet), the **regular assembly** chose.
In colonies with hostile Royal Governors who dissolved assemblies (VA, NC,
NY effectively), **extra-legal conventions / provincial congresses / town
or county committees** chose. This is the era's signature pattern:
**resistance institutions paralleled, then replaced, royal institutions.**

**The user's abstraction ("the faction with the most politicians from that
state chooses its delegates")** has no direct historical analogue, because
in 1774 there were **no national parties** and the colony-level
"factions" were **the assembly/convention itself, the radical committees of
correspondence, and the loyalist faction around the Royal Governor**. The
user has explicitly acknowledged this is a game-mechanic concession. The
honest grounding for the abstraction: the colonial assembly was usually
dominated by a faction (Patriot or Loyalist-leaning); in the game world,
which AMPU faction has more politicians in that state is a reasonable
stand-in for "which side controls the assembly / convention." Flavor it
that way in UI ("The assembly is dominated by [Faction X]; they choose
the delegation"). (c)

## Political composition + UI framing (CRITICAL — anachronism guards)

**The First CC was NOT split along First-Party-System lines.** (a) The
labels "Federalist" and "Anti-Federalist" do **not yet exist in 1774** —
they emerge **only with the ratification debate (1787–88)**, fully 13
years after the First CC convenes. "Democrat" and "Republican" as party
labels are even later (1790s+).

The PM's prior brief on the Independence event graph (the previous
session's work) already flagged this: the game's
`PARTIES_1772 = [BLUE "Patriots (Anti-Federalist)", RED "Federalists"]` is
a **forward-looking** label that's anachronistic when surfaced in 1774 UI.
The internal faction IDs can stay as they are (they have to map to
something durable), but the **UI strings** for the First CC builder should
NOT call delegates "Federalists" or "Anti-Federalists."

**The real factional cleavage at the First Continental Congress was
between RADICALS and CONSERVATIVES — within the broad "Patriot" coalition.**
(a) Conservatives wanted to pressure Parliament back to the pre-1763
status quo (Joseph Galloway, John Dickinson, John Jay, Edward Rutledge);
Radicals wanted to assert colonial autonomy and prepare for confrontation
(Samuel Adams, Patrick Henry, Christopher Gadsden, Richard Henry Lee).
**Loyalists** were a third position; some delegates (Galloway most
famously) became outright loyalists later but at the First CC were still
seated as colonial delegates. ([World History Enc.](https://www.worldhistory.org/First_Continental_Congress/),
[Wikipedia: Galloway's Plan of Union](https://en.wikipedia.org/wiki/Galloway%27s_Plan_of_Union) —
Galloway's plan was tabled 6–5 on Sept 28, 1774, the closest test vote of
the Congress.)

**Recommended UI framing:**
- **DO** label delegates by **colony and name first**; "Patriot" /
  "Loyalist" / "Moderate" as secondary flavor where it fits.
- **DO** display the AMPU faction badge if the PM wants the player to
  see internal AMPU politics — but with neutral framing ("Sons of Liberty
  delegate") rather than party-label ("Anti-Federalist delegate").
- **DO NOT** call delegates "Federalists," "Anti-Federalists,"
  "Democrats," or "Republicans" anywhere in the First CC UI.
- **DO NOT** display the proto-party RED/BLUE colors as
  "party affiliation" labels — color-by-faction is fine; color-by-party
  is anachronistic.
- The **body itself**: contemporaries called it simply **"Congress"** or
  **"the Continental Congress"**; the modern label **"First Continental
  Congress"** is retroactive (to distinguish from the Second). For UI:
  "Continental Congress (1774)" or "First Continental Congress" both
  read correctly to modern players; **never** call it just "Congress"
  without the "Continental" qualifier (that risks confusion with the
  post-1789 US Congress). ([Boston Tea Party Ship](https://www.bostonteapartyship.com/continental-congress))

## Notable declines / career-disrupted appointees

**Yes, several appointed delegates declined or could not serve.** (a) This
grounds the user's "may decline" rule:

- **James Bowdoin (Massachusetts)** — appointed as a 5th MA delegate;
  **declined due to ill health** (and family illness, his wife was ill).
  MA went with 4 delegates. ([Mass. Hist. Soc.](https://www.masshist.org/revolution/congress1.php))
- **Peyton Randolph (Virginia)** — served as **President** of the First
  CC but **departed mid-session (Oct 22)** to attend to Virginia's House
  of Burgesses; **Henry Middleton (SC)** was elected to replace him for
  the final days. (a) (Departure mid-service for state-level duties is a
  real pattern.)
- **John Dickinson (Pennsylvania)** — was **not initially elected**; the
  PA Assembly was so conservative under Galloway that Dickinson, the more
  moderate-Patriot voice, was **added late** (mid-October), illustrating
  in-session amendments to delegations. (a)
- **Patrick Henry (Virginia)** — accepted, served, but his famous "I am
  not a Virginian, but an American" speech at the First CC effectively
  ended his standing in Virginia's conservative Burgesses circles for
  some months (his political base in Hanover County survived; not a
  "career end" but a real factional cost). (b)
- **Joseph Galloway (Pennsylvania)** — the Plan of Union's defeat
  (tabled 6–5 on Sept 28) so demoralized him that he **refused
  reelection to the Second Continental Congress** and later fled to
  British lines in 1776. A delegate whose **career was destroyed by
  the experience**. ([Wikipedia: Galloway](https://en.wikipedia.org/wiki/Joseph_Galloway))

The user's "career-track politicians may decline" rule is well-grounded.
The historical pattern includes: declined for health/family (Bowdoin),
declined for ideological reasons (loyalist-leaning conservatives),
departure mid-session (Randolph), and post-CC career fallout (Galloway).
Per-colony Royal Governor obstruction (NJ's Franklin, NC's Martin, GA's
Wright) is also a real cause of "didn't show" — but at the *colony*
level, not the *individual* level. (c)

## Binding facts for the PM

1. **First CC convened Sept 5, 1774, in Philadelphia; adjourned Oct 26,
   1774. Gate the phase on year ≥ 1774** AND `intolerable_acts` event
   completed AND the "Convene CC" response chosen. The
   `postEffects: [{ type: 'assembleCC' }]` hook in `eraEvents1772.ts` is
   the correct trigger. (a) ([Mount Vernon](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/first-continental-congress))

2. **12 colonies sent delegates; Georgia did NOT.** Honoring history,
   Georgia should be **excluded** from the First CC build (with a flavor
   note about Gov. Wright and the Creek frontier). The user's spec gives
   Georgia 2 reps — **flag this and let the PM decide**: honor history
   (exclude) OR accept the game-mechanic shortcut (include). Either way
   is defensible; only exclusion is historical. ([UGA Press](https://ugapress.manifoldapp.org/read/the-american-revolution-in-georgia-1763-1789/section/33501aa9-901a-4704-bf22-c1776290eb17))
   Georgia joined the **Second** CC in 1775 (Lyman Hall in May, full
   delegation after July) — natural place to bring Georgia in later. (a)

3. **The user's "Big 4 / Medium 3 / Small 2" abstraction is a defensible
   simplification but NOT historically accurate per-colony counts.**
   The real top delegations were **PA (7–8), VA (7), MA (4), NY/NJ/MD/SC
   (5 each)**, Connecticut/NC/DE (3 each), NH/RI (2 each). The user's
   spec underweights PA/VA/NY/NJ/SC and overweights MA. If the PM wants
   tighter historical fidelity, a **3-tier {2,4,6}** or even named
   per-colony counts would be more accurate. **However**, the user's
   abstraction is internally consistent and the *prominence ranking*
   (PA/MA/VA/MD as "large") is at least partially right (these were the
   politically most active). The PM has license to keep the abstraction;
   the brief flags it. (a)

4. **Selection was by colonial assemblies, extra-legal conventions, OR
   committees — not by "parties."** The game's abstraction "the faction
   with the most politicians in the state chooses" is a clean stand-in
   for **"the political faction that dominates the colony's
   assembly/convention/committee."** UI flavor text should reference the
   relevant *body* ("the Virginia Convention chooses…", "the Connecticut
   House selects…"), not "Faction X chooses." This grounds the
   abstraction without lying about institutions. (a)

5. **NO First-Party-System labels in the UI.** Do not call delegates
   "Federalist," "Anti-Federalist," "Democrat," or "Republican."
   The real cleavages were **Radical vs. Conservative vs. Loyalist** within
   the broad Patriot coalition. Recommended labels: colony + name first,
   "Patriot/Moderate/Loyalist" leanings as flavor, AMPU faction badge if
   needed for game mechanics — but **never** modern party badges.
   `PARTIES_1772` color/labels stay internal; do not surface them as
   "(Anti-)Federalist" in First CC UI. (a)

6. **"May decline" is historically grounded** (Bowdoin/MA, Galloway/PA
   refused reelection later, Randolph mid-session departure, several
   appointed delegates with family/health reasons). The user's
   career-track / decline mechanic has solid period anchoring. The
   typical historical causes (health, family, ideology, royal-governor
   pressure, post-CC career damage) all map cleanly. (a)

## Web sources cited (ordered by importance)

1. [Mount Vernon — First Continental Congress](https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/first-continental-congress) — convening dates, Carpenters' Hall, 12 colonies, Georgia absence; the most-cited single source here.
2. [American History Central — First Continental Congress Facts](https://www.americanhistorycentral.com/entries/first-continental-congress-facts/) — per-colony selection methods and dates (CT Jun 3, MA Jun 17, MD Jun 22, SC Jul 1, NH Jul 21).
3. [American History Central — Virginia Delegates](https://www.americanhistorycentral.com/entries/virginia-delegates-first-continental-congress/) — VA's 7 delegates and the Aug 1774 vote tallies; First Virginia Convention as the selecting body.
4. [Mass. Hist. Soc. — Coming of the American Revolution](https://www.masshist.org/revolution/congress1.php) — MA's 4 delegates, Salem meeting, James Bowdoin's decline.
5. [Encyclopedia Virginia — Election of Delegates](https://encyclopediavirginia.org/election-of-delegates-to-congress-in-philadelphia/) — First Virginia Convention process, post-dissolution by Gov. Dunmore.
6. [UGA Press — The American Revolution in Georgia](https://ugapress.manifoldapp.org/read/the-american-revolution-in-georgia-1763-1789/section/33501aa9-901a-4704-bf22-c1776290eb17) — Georgia's Aug 10, 1774 decision not to send delegates; Gov. Wright; Creek-frontier dependence.
7. [Wikipedia — Joseph Galloway](https://en.wikipedia.org/wiki/Joseph_Galloway) — Galloway's Plan tabled 6–5 on Sept 28, 1774; refused reelection to Second CC; fled to British lines 1776.
8. [Wikipedia — Galloway's Plan of Union](https://en.wikipedia.org/wiki/Galloway%27s_Plan_of_Union) — the Conservative/Radical cleavage at the First CC.
9. [Boston Tea Party Ship — Continental Congress](https://www.bostonteapartyship.com/continental-congress) — contemporary naming; "Continental Congress" vs. "Grand Continental Congress" by July 1774.
10. [World History Encyclopedia — First Continental Congress](https://www.worldhistory.org/First_Continental_Congress/) — Radical vs. Conservative composition.
11. [American History Central — Sept 5, 1774 First Meeting](https://www.americanhistorycentral.com/entries/first-continental-congress-meeting-september-5-1774/) — NC delegation late arrivals (Hewes/Hooper Sept 14, Caswell Sept 17).
