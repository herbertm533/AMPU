# Digest — `providence` (59d805be): "The Hand of Providence: The Story of a Nation"

> **Batch 50.** 97 posts / 3 chunks (~112k chars). A **leisurely, narrated
> all-CPU 1772-founding run** by **@Ich_bin_Tyler** (2025 — RECENT), self-styled
> "the Great Architect." 10 CPU factions, **no human player**: "My primary
> interest is to observe what these preprogrammed entities might achieve when
> left to their own internal logic" (POST 1). ★ Because it is all-CPU, it is a
> **CPU-behavior observation run** — the prose-rich sibling of the b50
> `c8d89e49` CPU-rules-fixing thread and of `1f72600c` (`cpufull`) /
> `oopscpu` / `tea1772` / `drums`. Its load-bearing value: (1) a **full,
> compact 10-faction seed roster for the 1772 scenario** (POST 2), and (2) a
> clean, narrated CPU traversal of every 1772-era system — Continental Congress,
> Revolutionary War, drafts, gov-actions, cabinet, faction-leader churn — that
> **CORROBORATES the CPU suite (#20 cluster)** end to end. The twist: a
> once-per-era GM intervention the author calls the **"Hand of Providence"** —
> a sanctioned single override for stability / alt-history (design idea, below).
> Covers **1772 → ~1787** (the full Era of Independence, Books 1 / Chapters 1-6):
> Gaspee Affair → Declaration → Revolutionary War → victory at White Plains →
> Treaty of Paris → Shays' Rebellion → Confederation cabinet. **Unlike `cpufull`
> it did NOT die to a CPU game-over** — the CPUs won the war and built a working
> confederation, a useful contrasting outcome.

## What this thread is

A narrated, all-CPU traversal of the **1772 founding scenario** run "by the
rules" by a single GM (no players steer factions). It is the fourth-or-fifth
independent capture of the all-CPU founding loop (`tea1772` solo, `cpufull`
GA-run, `oopscpu` Ted's stress-test, `drums` all-CPU 1841→1924), and the most
**narratively fleshed-out** — the author explicitly tests adding prose to war
narration (POST 41-42). GA-level, **not designer-authoritative**: rulings here
are corroborative, except where designers (@ebrk85, @matthewyoung123) drop in
with engine facts (POST 49-50). It is the contrasting bookend to `cpufull`'s
scripted CPU game-over: here the all-CPU Congress chose A on every loyalist/peace
decision-event, established army+navy, and **won the Revolution** (POST 73).

## The 1772 seed faction roster (POST 2) — the documentation payload

Ten CPU factions split into two **parties** by founding polarity. Both parties
are *Patriots* (the founding-era polarity; "Blue" = Anti-Federalist track,
"Red" = Federalist track — note this is the inverse of later-era color valence;
see historical-context.md Founding section). Leaders/identities/ideologies/lobbies
as authored:

| Slot | Faction | Leader | Identity | Ideology | Lobbies / lean | Key figures |
|---|---|---|---|---|---|---|
| **B1** | Sons of Liberty (LW) | Samuel Adams | Radical Vanguard | LW Populist + Reformist | LW Activism, Civil Rights, Big Agriculture | Thomas Paine, Ethan Allen, Elias Boudinot |
| **B2** | Hanson Patriots | John Hanson | Practical Pioneers | Moderate | Expansionist, Big Agriculture (later Mil-Ind, Free Trade) | John Hancock, George Clinton, Elbridge Gerry |
| **B3** | Randolph Patriots | Peyton Randolph | Genteel Expansionists | Moderate | Expansionist, Big Agriculture, Free Trade | Richard Henry Lee, R.R. Livingston, Peter Muhlenberg |
| **B4** | Patriots (Cons) | John Dickinson | Cautious Nationalists | Conservative + Reformist | Nationalist, Big Agriculture | Patrick Henry, Anthony Wayne, T. Kościuszko |
| **B5** | Sons of Liberty (RW) | Thomas Jefferson | Agrarian Radicals | Traditionalist + RW Populist | RW Activism, Big Agriculture | George Mason, Daniel Boone, John Paul Jones |
| **R1** | Livermore Patriots | Samuel Livermore | Moral Order | Moderate (Theocrat) | Law & Order, Private Education, Big Pharma | Benjamin Rush, Thomas McKean, Oliver Ellsworth |
| **R2** | Franklin Patriots | Benjamin Franklin | Scientific Globalists | Moderate | Civil Rights, Globalist, Human Rights, Mil-Ind, Welfare | John Jay, Charles Carroll, Daniel Morgan |
| **R3** | Moderate Patriots | Roger Sherman | Steady Hand | Moderate | Expansionist, Law & Order | George Washington, Sam Huntington, Wm Paterson |
| **R4** | Adams Patriots | John Adams | Sovereign Builders | Moderate | Expansionist, Mil-Ind, Big Agriculture, Wall St, Free Trade, Welfare | James Wilson, John Sullivan, James Otis Jr |
| **R5** | Patriots (Trad) | Benjamin Lincoln | Iron Guard | Conservative + Traditionalist | Nationalist, Theocrat, Big Corporations, Protectionist, Isolationist | Robert Morris, Henry Laurens, Philip Schuyler |

Notable: **R1 Livermore** is a Theocrat faction (Law&Order + Private Education +
Big Pharma) — readers flag it as unusual (POST 24); the author roots for it to
benefit from the Hand (POST 62). Cross-check this roster against
`src/data/scenario1772.ts` seed factions — if it diverges, the roster is the
authored intent for the 10 founding factions.

### CPU faction-leader churn (emergent, over the era)
- **B3 Randolph → Milton (John Milton)** when Peyton Randolph aged out — "finance
  & moneyed interests" replaces "Virginia gentry" (POST 23); later **Milton dies
  at 40 → Telfair (Edward Telfair)** (POST 66, 68); later **B2 Hanson → Clinton
  (George Clinton)** (POST 82). So CPU faction leadership re-selects on
  death/retirement and the faction **renames + re-profiles** to the new leader's
  ideology/lobby — a documented CPU pass (CORROBORATES leader-selection #70-ish).
- **B4 Dickinson → Josiah Bartlett** chosen because Bartlett "directly represents
  the military-industrial interest" — i.e. CPU leader pick is **lobby/skill-driven**,
  not seniority (POST 63).

## CPU behavior observed (corroborates the #20 / #70–#79 CPU suite)

| Decision | What the all-CPU game did | Maps to |
|---|---|---|
| **CC President election** | Faction with most delegates picks; **on a tie, go to points, then random** (Livermore vs Patriots(Trad) tied → tied on pts → random → Patriots(Trad), Henry Laurens Pres, POST 5). Later **"none of the Red delegates have the required Command"** → CPU picks the qualified candidate (George Clinton; Caesar Rodney as "only Red option," POST 52, 81) | CORROBORATES CPU-president / command-gated candidate selection (#72) |
| **Committee chairs/leadership by faction + expertise** | Domestic/Foreign/Economic/Judicial chairs slotted across factions; a new Pres deliberately puts Blue committee leads opposite the Red dept-heads "to set up a fight" (POST 6, 52) | CORROBORATES CPU leadership/committee assignment (#70) |
| **CPU bill proposals → committee votes → floor** | Each faction's delegates propose era-appropriate bills (Move Capital, Boycott British Goods, create Treasury/War/State depts, ministers to France/Spain, Bank of N. America, punish-Loyalists, western-lands framework); committee vote → full chamber needs **2/3 (9 states)** under the Articles (POST 10, 29, 57, 70-71, 93) | CORROBORATES CPU propose/committee-vote (#70/#9); Articles 2/3 threshold |
| **CPU votes by cross-party damage math** | "Pay Slaveholders to convert slaves" fails 8-3-2 — author: **"It would have passed if the rightwing red faction or center-right blue faction had less delegates"**; NH split Red/Blue, **the Blue delegate voted no because it would hurt their party if passed** (POST 29, 32-33) | CORROBORATES theme-blind vote-to-damage-other-party (#74) |
| **CPU event decisions (Pres picks A/B, Congress can override)** | Pres resolves decision-events (Declaration of Resolves, Common Sense, Dunmore's Proclamation→B, Articles→A, Lexington→A create-army, Shays'→A, Spain treaty→B); **Congress can override** — Spain Liberty Treaty: Pres Rodney picked B but **all factions but his own disagreed, all states voted No → Pres forced to A** (POST 9, 26, 89) | CORROBORATES CPU event-vote + Congress-override (#75) |
| **CPU enthusiasm / ideology drift (most/least-gained faction)** | Repeated "Mod -2 Red / Trad +2 Red / Lib +1 Blue …" deltas after each legislative+event batch (POST 13, 34, 58, 72, 94); also faction-pulse vs gov-election outcome decoupled (high Blue pulse but Red wins 11/13 govs, POST 47) | CORROBORATES enthusiasm-gated one-directional drift (#108) |
| **CPU kingmaker/protégé pairings (within ideology)** | Each cycle pairs a senior pol with a protégé who gains skill+interest+trait (Lincoln→Dalton: Admin+1, Agriculture, Nationalist, Leadership; Mason→Jefferson; Franklin→Mifflin; etc., POST 6, 22, 51) | CORROBORATES kingmaker/protégé pass (#86/#128) |
| **CPU draft** | Each cycle the 10 CPUs draft ~5-8 named historicals apiece in points order (POST 21); inaugural class is dataset-driven | CORROBORATES draft pass / 1772 dataset-seeded draft |
| **CPU relocations (region-roll)** | "Politicians continue to flee overpopulated PA for underpopulated DE and NJ" every cycle (POST 6, 22) | CORROBORATES region-keyed relocation rolls (#38) |
| **CPU governor actions** | Govs spend actions on **"Improve a Burgeoning Industry: Plantation/Maritime/Finance/Agriculture"** (→ +100 Gov&Dels, becomes/ties leader in that industry), term-limit reforms (+100 Reformist), raise/lower taxes (+100 LW/RW Activist) (POST 28, 56, 69, 92) | CORROBORATES gov-action menu + industry-leader / lobby scoring |
| **CPU conversions / party-switch gating** | "John Paul Jones earns Can-Party-Switch / Can-Be-Independent at half-term **unless the faction's ideology is improved**" (POST 54) — conversion/defection is enthusiasm-gated | CORROBORATES conversion/defection gating (#127/#76) |
| **CPU cabinet appointments + controversial-confirmation vote** | Dept secretaries nominated on creation; **controversial nominees (Franklin SoS, Arnold Sr Admiral) routed to committee then floor**, both **rejected 4-6** until the Hand forced Blue4 to flip (POST 34-35); later vacancy refills handled (Stoddert SoS, Laurens Amb-France) | CORROBORATES CPU cabinet/appointment + controversial-vote path |

## Revolutionary War engine (CPU-run, narrated) — CONFIRMATIONS + a designer ruling

The war fired off **Lexington & Concord** (POST 26): "Revolutionary War is
activated, but before [it] activates a special session of Congress to vote on
Create Continental Army and Continental Navy and appointments… **If no army/navy
created then military phases cannot be won.**" CPUs voted both 13-0 (POST 29).

- **Battle success formula (as run, POST 40, 59, 73):**
  `Success% = Planning(SecWar admin + officer mil) + Officer(mil × 10) + MilPrep
  + Benchmarks(e.g. +15 for 3/4) − Difficulty deduction (Easy 0 / Mod −10 / Hard
  −25)`, vs a d100 (low roll = win). Matches the shipped formula in
  `src/engine/revolutionaryWar.ts` (planning = SecWar.admin + officer.mil;
  officer.mil × 10; difficulty branch). ★ Shipped code applies a **fixed +25
  "French alliance" bonus**; the forum instead itemizes a **Benchmarks +15** term
  and a **naval→land bonus** (below) — possible content-doc vs build divergence
  in the *additive* terms (see deltas).
- **Senior General / Senior Admiral** drive the planning bonus; on creation:
  Sr Gen **Washington**, Sr Adm **Benedict Arnold** (POST 34). CONFIRMS the
  `seniorGeneralId` / `seniorAdmiralId` mechanic. Defeated commanders take stat
  hits but here **no commander was relieved** (Clinton "suffers no penalties"
  after Saratoga loss, POST 40) — softer than `cpufull`'s officer-relief cascade.
- **War Score** per battle: **win +1 to +3** (by roll quality), **lose −2/−3**
  (POST 40, 59, 73). CONFIRMS warscore accrual.
- **★ War-end multiplier — DESIGNER RULING (POST 49-50):** chance-to-end-war =
  `(WarScore) × multiplier → ×10 = %`. @ebrk85 (designer): **"we updated the war
  chart for the Revolution. The war end multiplier for it is now 0.5 instead of
  1"** — in testing the Revolution "was ending in one turn (usually as a loss)
  way too often for what was historically a longer war. **The master doc was
  updated.**" So the author recomputed `(3+1−2)×0.5 = 1 → 10%` (POST 50). This
  is an authoritative, RECENT (2025) balance change to the RevWar end-chance —
  **verify `src/engine/revolutionaryWar.ts` uses 0.5 for the Revolution's
  end-chance multiplier** (see deltas).
- **★ Naval→land bonus (POST 43-44, designer-confirmed):** @Arkansas Progressive:
  "naval battles give a bonus to succeeding land combat… might only be for
  landing in non-domestic wars"; author confirms: **"Correct and it did not roll
  the 75% to give the bonus"** — i.e. a **prior naval win grants a 75%-chance
  bonus to the next land battle**. Check whether the shipped engine wires
  `navalWins` into land-battle success (it tracks `navalWins` but the grep showed
  no land-bonus read).
- **Alliance with France** event (POST 67): "**Rev War cannot end in US defeat**"
  + Sr Gen Washington Mil+1 + permanent ally until war ends + MilPrep/Budget/Econ
  +1. A war-winnability floor delivered via era event — relevant to the RevWar
  winnability concern (#155): the *all-CPU* game reached this and then won at
  **White Plains** (rolled 13 ≤ 40% → "war will end," POST 73).
- **Post-war:** **Treaty of Paris** implemented via a 3-roll
  (Pres + Amb-France + Amb-Britain/SoS-sub) Admin check; only 1 of 3 rolls passed
  → only **Quality of Life +1** (POST 75) — multi-roll treaty resolution
  confirmed.

## The "Hand of Providence" — GM-intervention design idea

The thread's named twist: **once per era**, the GM (as "the Great Architect")
takes control of **one CPU faction's decision in one phase, or curates one
event**, "mainly to ensure stability in the nation (especially early on) or open
up paths to alternative history that the CPUs might not stumble upon" (POST 1).
Used exactly once in the Era of Independence (POST 35-38): the CPU Congress
**rejected** both Franklin (SoS) and Arnold (Sr Admiral) 4-6; the Hand **forced
Blue4 to vote yes**, swinging both to 8-2, "because the alternates were not great
if both went down" (POST 38). This is a **forum/GM convention, not a game
feature** — but it is a clean articulation of a desirable capability: a
**sanctioned single GM/player override per era** for stability or scripted
alt-history (relevant to the CPU-game-over problem #158 — `cpufull` had no such
escape hatch and died to a CPU vote; a once-per-era override would have saved it).
Note this run's contrasting outcome: with the Hand available and the CPUs
choosing A on every peace/loyalist event, the founding traversal **completed
successfully** (war won, confederation built) — a counter-example to
`cpufull`'s game-over showing the loop *can* resolve cleanly.

## Notable CPU emergent beats (alt-history)

- **Capital migration:** Baltimore (POST 10) → New York City after the war
  (POST 71). ★ **GAP surfaced (POST 71):** *two conflicting "Move Capital" bills
  both passed the same session* (NY and Boston); the GM ad-hoc'd a tiebreak
  ("pick the one with less No votes") and flagged: **"We probably should have
  this figured out for when two conflicting bills pass, or maybe it is there and
  I just don't see it."** A real **mutually-exclusive-bill conflict-resolution
  gap** (see deltas).
- **Reds dominate the whole era** (control 9-11/13 govs and ~23-31/39 delegates
  every cycle) despite a high Blue ideological pulse — the CPU electorate
  "chose stability of the established machine over radical reform" (POST 47, 60).
  Demonstrates pulse ≠ vote-share decoupling in CPU elections.
- **Articles barred consecutive CC terms** → the conservative First/Second-Congress
  bloc was broken and power rotated to other factions cycle-to-cycle (POST 48, 112-era
  reasoning) — CONFIRMS the Articles "no consecutive reelection" rule shapes CPU
  delegate turnover.
- **Washington resigns commission** (era event, POST 89) → CPU appoints **Nathanael
  Greene** Sr General → Israel Putnam backfill. CONFIRMS senior-general succession on
  the resign event.
- **Shays' Rebellion** (POST 89): Pres+SoT+SoW implement; **Adams "has Efficient,"
  rolls 1/50 → succeeds amazingly** → +250 Law&Order/Mil-Ind/Wall St/Mods. Trait
  (Efficient/Domestic-Warrior) gating on event-implementation rolls confirmed.
- **Confederation Cabinet** bill creates **Postmaster General** as the last
  uncreated cabinet office (non-cabinet level) (POST 93-97); **western-lands
  framework + Southwest Territory (TN)** → "Territories can now become states"
  (POST 93-94) — confirms the territory-admission gate is legislation-unlocked.
- **Inactive meters:** author repeatedly notes Quality-of-Life / national meters
  are **inactive** in this era and just banks the deltas "for when it goes active"
  (POST 76-78, 91 still shows a Lingering Phase with meter regression-to-mean).
  Note the tension: a **Lingering Phase ran with meter regression** (POST 91) even
  though QoL was called inactive — worth a build check on which meters are live in
  1772.

## Deltas / confirmations vs current build

- **HEADLINE:** A narrated **all-CPU 1772 founding run that stress-tests CPU
  behavior and documents the 10-faction seed roster** (POST 2). End-to-end
  **CORROBORATION of the #20 / #70–#79 CPU suite** from a single-GM all-CPU
  angle: CC-president/command-gating (#72), committee/leadership (#70),
  propose→committee→floor + 2/3 Articles (#70/#9), vote-to-damage-other-party
  (#74), event-vote + Congress-override (#75), enthusiasm/ideology drift (#108),
  kingmaker/protégé (#86/#128), conversion/defection gating (#127/#76),
  relocation rolls (#38), gov-actions, cabinet+controversial-confirmation, and
  the RevWar engine (#45). Pairs directly with `cpufull`/`oopscpu`/`tea1772`.
- **★ DESIGNER RULING to verify (POST 49-50, @ebrk85, RECENT 2025):** the
  **Revolution's war-end multiplier was changed from 1.0 → 0.5** (master doc
  updated) because the war ended in one turn too often. Confirm
  `src/engine/revolutionaryWar.ts` end-chance uses **0.5** for the Revolution.
- **★ POSSIBLE DELTA — naval→land bonus (POST 43-44, designer-confirmed):** a
  prior naval win should grant a **75%-chance bonus to the next land battle**
  (possibly only non-domestic landings). Engine tracks `navalWins`/`navalLosses`
  but no read into land-battle success was found — verify it is wired.
- **★ POSSIBLE DELTA — RevWar additive terms:** forum itemizes a **Benchmarks
  (+15 for 3/4)** term and the naval bonus; shipped code uses a single **fixed
  +25 French-alliance** add and no benchmark/naval term. The *core* formula
  (planning + officer×10 − difficulty) matches; the **additive bonus terms may
  diverge** between content doc and build.
- **★ GAP — mutually-exclusive bill conflict resolution (POST 71):** when two
  conflicting bills (two "Move Capital") both pass a session, there is **no
  defined resolution**; GM hand-waved "fewer No votes." Needs an engine rule for
  conflicting/superseding legislation.
- **NEW (design idea) — "Hand of Providence":** a **once-per-era sanctioned
  GM/player override** of one CPU faction-decision or one event, for stability /
  scripted alt-history (POST 1, 35-38). Not a build feature; a candidate escape
  hatch for the **CPU-game-over problem (#158)** that `cpufull` lacked. This run
  is the **contrasting clean completion** of the founding loop (no game-over) —
  useful counterpoint to `cpufull`'s scripted Carlisle game-over.
- **CONFIRM — Lingering Phase / meter activity in 1772:** author says QoL/meters
  are inactive yet a **Lingering Phase with meter regression-to-mean ran**
  (POST 76-78, 91). Worth a check on exactly which meters are live in the founding
  era vs banked.
- All other rulings are **GA-level / corroborative**, not authoritative (only the
  @ebrk85 war-multiplier note and the naval-bonus confirmation carry designer
  weight).

## Open questions

- Does the shipped RevWar end-chance use the **0.5 multiplier** for the
  Revolution (POST 49-50)? If not, the build lags the master doc.
- Is the **naval-win → land-battle 75% bonus** implemented (POST 43-44)? The
  `navalWins` counter exists but appeared unused by land battles.
- How should the engine resolve **two conflicting bills passing the same
  session** (POST 71)? No rule exists per the GM.
- Does `src/data/scenario1772.ts` match this **10-faction seed roster** (POST 2),
  including R1 Livermore as a Theocrat/Big-Pharma faction and the Blue/Red party
  split? (Roster captured here for diffing.)
- Should a **once-per-era override** ("Hand of Providence") become a real
  solo/GM feature to prevent CPU game-overs (#158) and enable curated
  alt-history?

## Source

`providence` (59d805be) "The Hand of Providence: The Story of a Nation" by
@Ich_bin_Tyler — **97 posts / 3 chunks (~112k chars)**; chunk-001 1913 lines,
chunk-002 1448, chunk-003 532. A narrated **all-CPU 1772-founding traversal**
(1772 → ~1787, full Era of Independence) with a once-per-era GM "Hand of
Providence" override. Documents the 10-faction seed roster and corroborates the
CPU suite (#20). GA-run (corroborative) except the @ebrk85 war-multiplier ruling
and the naval-bonus confirmation. Cited `POST n` (the `===== POST n =====`
markers).
