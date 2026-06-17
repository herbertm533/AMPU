# Historical Context: Events-Phase Manual Trigger & Data Visualization

## Scope note

This is a **UX feature**, not a content change. The engine, predicates, event
data, and effect math are all unchanged; we're exposing the existing
`Predicate` tree, `EraEvent` payload, and `EraEventResponseEffect` to the
player in phases **2.4.2 (Anytime Events)** and **2.4.3 (Era Events)**. The
historical-content brief for the 1772 graph remains
`docs/research/independence-era-events-historical-context.md` and is the
binding source for what each event *is*. This brief covers only the narrow
labeling-correctness call the PM asked about: era-period vs. mechanical
phrasing of predicate / effect / decider chips, plus the `warVictoryGuaranteed`
flag's UI framing.

The fields we'll be surfacing (per `src/types.ts`): `Predicate` variants
(`yearAtLeast`, `eventCompleted`, `eventChose`, `warActive`, `warOutcome`,
`meterAtLeast`, `interestAtLeast`, `diplomacyAtLeast`, `stateAdmitted`,
`officeControlledByPlayer`, `rosterHasSkill`, `flag`), and effect fields
(`meters`, `partyPreference`, `enthusiasm`, `interestGroups`, `diplomacy`,
`startWar`).

## Per-era labeling guidance

### 1772 (Independence era)

**Predicates.** Period-language tooltips are safe and historically correct
because the spine events are real and named (Gaspee, Tea Act, Lexington,
French alliance, Yorktown/Parliament-authorizes-peace, Annapolis). Prefer
period phrasing in the primary surface and keep the mechanical key
(`warActive: true`, `eventCompleted(lexington_concord)`) in a hover/debug
view. Two specific guards:

- `warActive: true` should render as **"the Revolutionary War is being
  fought"** or **"the colonies are at war with Britain"** — *not* "the US
  is at war." There is no "United States" as a sovereign nation until July
  1776 at the earliest, and arguably not until the Treaty of Paris
  (Sep 3, 1783) / its ratification (Jan 14, 1784). Pre-Independence
  framing should say "colonies" or "Continental forces."
- `officeControlledByPlayer: 'cc-president'` should render as
  **"President of the Continental Congress"** (1774–1781) or
  **"President of the Confederation Congress"** (1781–1789). The existing
  modal uses "President of Congress," which is the contemporary
  short-form and fine. Do **not** render it as "President" alone — that
  would imply the U.S. presidency, which does not exist until **Mar 4,
  1789** (confidence: a).

**Effects.** Most labels in `EraEventModal.tsx` are era-neutral
(meters, diplomacy). Two corrections:

- `interestGroups` IDs include modern coalitions (`WallStreet`,
  `MilitaryIndustrial`, `BigTech`, `LWMedia`, etc., see
  `factions1856.ts`). Pre-1789 events should only surface era-appropriate
  IDs — the existing 1772 graph correctly uses `frontier` (Stanwix,
  Hopewell). If a 1772-era event ever surfaces e.g. `WallStreet`, that's
  the anachronism to catch (Wall Street as a financial center starts
  with Buttonwood, 1792 — Federalism era).
- `enthusiasm` chips render as `Ideology→D` / `Ideology→R` in the
  current modal. For 1772, these should be **`→Patriot (BLUE)`** /
  **`→Federalist (RED)`**, not D/R. The first U.S. party system
  (Federalist vs. Democratic-Republican) is a **1790s** phenomenon;
  Democrats / Republicans as named parties belong to 1828+ and 1854+
  respectively (confidence: a). The game's `factions1772.ts` already
  names the parties "Patriots (Anti-Federalist)" / "Federalists," so
  re-using those names is era-correct.

**Decider labels.** The modal currently emits the raw `event.decider`
string when it isn't `cc-president`. For 1772 events the decider should
only ever be `cc-president` or `auto` (per the prior brief's hard guard);
if a 1772 event surfaces `president` or `cabinet` it's a content bug, not
a label issue.

**`warVictoryGuaranteed` flag.** This was set as **narrative-only** in
the prior brief. Surfacing "this branch guarantees war victory" is
historically misleading because the French alliance (Feb 6, 1778) is
the basis for it and the actual war dragged on **3.5 more years** to
Yorktown (Oct 19, 1781). The in-game flavor text already overstates
this ("defeat is no longer possible"); the UI chip should soften it.
Suggested phrasing: **"French alliance: defeat unlikely"** or
**"Great-power ally secured"** — not "victory guaranteed." The
historical truth is the alliance made British victory implausible,
not that American victory was inevitable on any timetable (confidence: a,
[Britannica](https://www.britannica.com/event/Franco-American-Alliance)).

### 1856 (Antebellum / sectional crisis)

**Predicates.** Period-language is also safe — these are well-known events
(Bleeding Kansas, Dred Scott, Panic of 1857, Harpers Ferry, secession
crisis). One guard:

- `officeControlledByPlayer: 'cc-president'` should not fire in 1856 (no
  Continental Congress); if surfaced, it's a content bug.
- `warActive` in 1856 means the Civil War (post-`startWar`), which is
  fine to render literally.

**Effects.** `eraEvents1856.ts` already uses
`partyPreference: -0.3 / -0.5` etc. with negative meaning
"helps Democrats (BLUE)" and positive meaning "helps Republicans (RED)"
in the antebellum frame. The current chip labels "Party Pref +/-" with
red/blue colors are unambiguous. The one labeling risk:

- `enthusiasm` chips rendering `Ideology→D` / `Ideology→R` are
  **correct for 1856** — the Democratic Party (founded 1828) and the
  Republican Party (founded 1854) are both contemporaneously named that
  way ([Britannica: Democratic Party](https://www.britannica.com/topic/Democratic-Party),
  [Britannica: Republican Party](https://www.britannica.com/topic/Republican-Party-political-party-United-States)).
- Interest-group labels like `Abolitionists`, `Planters`, `Settlers`,
  `Workers`, `Nativists`, `LawAndOrder`, `WallStreet` are all
  contemporaneously plausible for 1856 (Wall Street is functional as a
  financial center; "Nativist" is the actual self-description of the
  Know-Nothings). No correction needed.

**Decider labels.** The 1856 events use `president` and `cabinet`.
The modal currently shows the raw string. Render `president` as
**"President of the United States"** and `cabinet` as **"Your Cabinet"**
or the specific seat (the four 1856 events use `president` × 3 and
`cabinet` × 1 for Dred Scott — the Dred Scott "cabinet" decider is odd
historically since SCOTUS rulings don't go to the cabinet for endorsement;
that's a content choice already in the data, not a labeling problem).

## Binding facts for the PM (narrow)

- **Pre-1789, never label any decider as "President" alone.** The U.S.
  presidency begins **Mar 4, 1789**. For 1772 events, label
  `cc-president` as "President of the Continental Congress" (pre-Mar 1781)
  or "President of the Confederation Congress" (Mar 1781 onward).
  (Confidence: a; [Avalon: NH ratification, Jun 21, 1788](https://avalon.law.yale.edu/18th_century/ratnh.asp).)
- **Pre-1787, never use "Anti-Federalist" or "Federalist" as faction
  labels for events.** Those terms describe **ratification-debate
  positions (1787–88)**, not parties. They're correct from the
  Federalist Papers node (Oct 27, 1787) onward and fine as the game's
  *faction names*, but a predicate label "Decided by: Anti-Federalist
  bloc" should not appear on a 1775 or 1781 event. (Confidence: a;
  [American Battlefield Trust](https://www.battlefields.org/learn/articles/federalist-papers).)
- **Pre-1776, do not render `warActive` as "the United States is at
  war."** There is no United States until the Declaration (Jul 4, 1776
  at the earliest) and arguably until the Treaty of Paris (Sep 3, 1783).
  Use "the colonies are at war" / "the Revolutionary War is being
  fought." (Confidence: a.)
- **`warVictoryGuaranteed` should be labeled softly.** "Great-power
  alliance secured" or "defeat unlikely" — not "victory guaranteed." The
  French alliance (Feb 6, 1778) was decisive but the war ran to Yorktown
  (Oct 19, 1781) and Paris (1783). The flag is narrative; the UI label
  should reflect that. (Confidence: a;
  [National Archives: Treaty of Alliance](https://www.archives.gov/milestone-documents/treaty-of-alliance-with-france).)
- **`enthusiasm` chips: `→D` / `→R` is anachronistic for 1772.** For
  1772 events render as `→Patriot` / `→Federalist` (matching the game's
  own `PARTIES_1772` names). For 1856 events `→D` / `→R` is contemporaneously
  correct. (Confidence: a.)
- **Interest-group label era-gating.** Most IDs in
  `factions1856.ts:INTEREST_GROUPS` (`BigTech`, `MilitaryIndustrial`,
  `LWMedia`, `RWMedia`, `Globalists`, `Pacifists`) are 20th/21st-century
  coalitions and should never surface on a 1772-era event chip. The
  existing 1772 graph respects this (only `frontier` is used); flag any
  new 1772 content that doesn't.
- **Prefer period language in the primary chip, mechanical key in
  hover/debug.** "The Revolutionary War is being fought" reads better
  than `warActive: true`; the latter is fine in a "show raw predicate"
  expand-view for debugging. Both eras benefit from this split.

## Web sources cited

- [Treaty of Alliance with France — National Archives](https://www.archives.gov/milestone-documents/treaty-of-alliance-with-france) — Feb 6, 1778; basis for the `warVictoryGuaranteed` framing.
- [Franco-American Alliance — Britannica](https://www.britannica.com/event/Franco-American-Alliance) — alliance's actual military effect (decisive, not instant-victory).
- [Federalist Papers — American Battlefield Trust](https://www.battlefields.org/learn/articles/federalist-papers) — Oct 27, 1787 publication start; defines the Federalist/Anti-Federalist label window.
- [New Hampshire ratification — Avalon Project](https://avalon.law.yale.edu/18th_century/ratnh.asp) — Jun 21, 1788; Constitution adopted, first government Mar 4, 1789.
- [Democratic Party — Britannica](https://www.britannica.com/topic/Democratic-Party) — Democratic Party founded ~1828.
- [Republican Party — Britannica](https://www.britannica.com/topic/Republican-Party-political-party-United-States) — Republican Party founded 1854; both labels contemporaneously correct for 1856.
- Prior brief: `docs/research/independence-era-events-historical-context.md` — binding for what each 1772 event *is*; this brief inherits its decider mapping and anti-pattern list.
