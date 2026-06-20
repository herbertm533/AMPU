# Historical Context: 1772 UX Polish Pass

**No historical research required for this UX-polish feature; era content is unchanged.** The three spikes (What-Just-Happened pass, inaugural-draft signage, Campaign-Over recap) are presentation-layer work over existing engine state. The only line that touches era content is the Campaign-Over "historical contrast" callout, which keys off the terminal era-event node that fired.

## Historical-contrast reference lines for Campaign-Over

The 1772 era graph (`src/data/eraEvents1772.ts`) has exactly **three** terminal nodes (`triggersGameEnd: true`). One contrast line per node, grounded in real history:

### 1. `lost_war` — "Defeat and Reabsorption"
Counterfactual ending; the Continental cause collapses and Britain reconquers the colonies.

> *Historically, the colonies declared independence on July 4, 1776, and the Continental Army's victory at Yorktown (October 1781) forced Britain to the negotiating table; Britain formally recognized U.S. sovereignty at the Treaty of Paris, signed September 3, 1783. In your timeline, the Revolution failed and the colonies were reabsorbed into the British Empire.*

Sources: [State Department Office of the Historian — Treaty of Paris, 1783](https://2001-2009.state.gov/r/pa/ho/time/ar/14313.htm); [Library of Congress — Treaty of Paris primary documents](https://guides.loc.gov/treaty-of-paris). (Consensus history.)

### 2. `dominion_autonomy` — "Autonomy Within the Empire"
Counterfactual ending; reached via accepting the Carlisle Commission, the Conciliatory Resolution, or settling out of war-weariness. The colonies become a self-governing dominion of the Crown without ever declaring independence.

> *Historically, Congress rejected Lord North's Conciliatory Resolution (1775) and the Carlisle Peace Commission (1778), insisting on full independence; Britain conceded it at the Treaty of Paris (1783). In your timeline, the colonies settled for self-rule within the British Empire — independence was never declared.*

Source: game data file (`src/data/eraEvents1772.ts`, `conciliatory_resolution` and `carlisle_commission` templates, both grounded in real 1775/1778 British peace overtures Congress historically refused); [Britannica — Peace of Paris (1783)](https://www.britannica.com/event/Peace-of-Paris-1783). (Consensus history; dominion outcome is the contested counterfactual.)

### 3. `confederation_remains` — "The Confederation Endures"
Real-event branch terminating at the Annapolis Convention decision; no Constitutional Convention is called.

> *Historically, the Annapolis Convention's 1786 report led Congress to call a Constitutional Convention; delegates met in Philadelphia from May 25 to September 17, 1787, and the Constitution was ratified when New Hampshire became the ninth state on June 21, 1788, replacing the Articles of Confederation. In your timeline, no convention was called and the Confederation endured.*

Sources: [HISTORY.com — U.S. Constitution ratified, June 21, 1788](https://www.history.com/this-day-in-history/june-21/u-s-constitution-ratified); [Teaching American History — New Hampshire's Ratification of the Constitution](https://teachingamericanhistory.org/blog/new-hampshires-ratification-of-the-constitution/); [GPO — States and Dates of Ratification](https://bensguide.gpo.gov/j-states-ratification). (Consensus history.)

## Bonus: time-out / no-terminal-fired contrast line

If the campaign ends without a terminal node firing (e.g., scenario simply runs out the clock mid-war or mid-Confederation), a generic fallback:

> *Historically, the United States declared independence in 1776, won the Revolutionary War in 1783, replaced the Articles of Confederation with the Constitution in 1787–88, and inaugurated George Washington as first President in 1789. In your timeline, the story remained unfinished.*

Source: same as above; foundational consensus history.

## Citations

- [State Department Office of the Historian — Treaty of Paris, 1783](https://2001-2009.state.gov/r/pa/ho/time/ar/14313.htm) — Treaty signed Sept 3, 1783; preliminary articles Nov 30, 1782.
- [Library of Congress — Treaty of Paris primary documents](https://guides.loc.gov/treaty-of-paris) — Confirms ratification by Continental Congress Jan 14, 1784.
- [HISTORY.com — U.S. Constitution ratified, June 21, 1788](https://www.history.com/this-day-in-history/june-21/u-s-constitution-ratified) — Convention dates (May 25–Sept 17, 1787); NH ratified June 21, 1788.
- [Teaching American History — New Hampshire's Ratification of the Constitution](https://teachingamericanhistory.org/blog/new-hampshires-ratification-of-the-constitution/) — NH ratification vote 57–47.
- [GPO Ben's Guide — States and Dates of Ratification](https://bensguide.gpo.gov/j-states-ratification) — Canonical ratification dates by state.
- [Britannica — Peace of Paris (1783)](https://www.britannica.com/event/Peace-of-Paris-1783) — Background on Lord North's Conciliatory Resolution and Carlisle Commission as real off-ramps Congress refused.
- `src/data/eraEvents1772.ts` — Identifies the three `triggersGameEnd: true` nodes (`lost_war` chartIndex 11; `dominion_autonomy` chartIndex 8; `confederation_remains` chartIndex 38).
