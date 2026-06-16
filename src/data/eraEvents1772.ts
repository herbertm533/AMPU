import type { EraEvent, Predicate } from '../types';
import { uid } from '../rng';

// ============================================================================
// 2.4.3 Independence-era event GRAPH (1772 scenario). Chart nodes 0-48 only
// (Gaspee Affair -> the two Indian treaties). Real events form the spine
// (realEvent !== false); counterfactual branches fill the tree; three nodes are
// terminal campaign endings (triggersGameEnd). STOPs before the French
// Revolution (chartIndex 49 = Federalism, next era's build).
//
// Each node carries a stable templateId (tracked in game.eraEventsCompleted), a
// chartIndex (< 49, asserted by eraGraph.validate), an optional precondition
// (serializable Predicate tree, walked by evalPredicate), and a build(year)
// that produces the runtime EraEvent. The graph never reimplements
// CC/ConCon/RevWar/territory logic — it authors existing-shape consequences
// (postEffects / templateId-keyed handleScripted1772Consequences cases).
// ============================================================================

export interface GraphNode {
  templateId: string;
  chartIndex: number; // 0-48; validate() asserts < 49
  realEvent?: boolean; // default true (spine); false = counterfactual branch
  coreSpine?: boolean; // inevitable opening provocations: fire regardless of the probabilistic roll
  military?: boolean; // military fork — roster-gated on the Commander-in-Chief, not the CC president
  precondition?: Predicate; // replaces the old gateYear / requiresTemplate
  leadsTo?: string[]; // documentation only: downstream templateIds
  aiBias?: { LW?: string; Center?: string; RW?: string }; // AI response by controlling-faction personality
  build: (year: number) => EraEvent;
}

const auto = (
  templateId: string,
  year: number,
  title: string,
  description: string,
  text: string,
  postEffects: EraEvent['postEffects'] = [],
  unlocks: EraEvent['unlocks'] = [],
  extra: Partial<EraEvent> = {},
): EraEvent => ({
  id: uid('era'),
  templateId,
  year,
  title,
  description,
  decider: 'auto',
  responses: [{ id: 'ok', label: 'Acknowledge', description: text, effect: { text } }],
  postEffects,
  unlocks,
  ...extra,
});

// Convenience predicate builders.
const after = (template: string): Predicate => ({ eventCompleted: template });
const all = (...ps: Predicate[]): Predicate => ({ all: ps });
const chose = (template: string, response: string): Predicate => ({ eventChose: { template, response } });

export const ERA_GRAPH_1772: GraphNode[] = [
  // ==========================================================================
  // Group A — Pre-war provocations (spine, mostly auto)
  // ==========================================================================
  {
    templateId: 'gaspee',
    chartIndex: 0,
    coreSpine: true,
    precondition: { yearAtLeast: 1772 },
    leadsTo: ['committees_of_correspondence'],
    build: (year) => auto('gaspee', year, 'Gaspee Affair', 'Rhode Islanders board and burn the British customs schooner HMS Gaspee.', 'Conservative and moderate factions condemn the act. Pro-independence sentiment quietly grows.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'Pro-independence sentiment quietly grows.', effect: { text: 'Pro-independence sentiment quietly grows.', partyPreference: 0.3 } }] }),
  },
  {
    templateId: 'committees_of_correspondence',
    chartIndex: 1,
    coreSpine: true,
    precondition: after('gaspee'),
    leadsTo: ['tea_act'],
    build: (year) => auto('committees_of_correspondence', year, 'Committees of Correspondence', 'Samuel Adams and allies organize colony-wide committees of correspondence to coordinate resistance.', 'Patriot and progressive factions gain organizational momentum across the colonies.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'Patriots gain organizational momentum.', effect: { text: 'Patriots gain organizational momentum across the colonies.', partyPreference: 0.3 } }] }),
  },
  {
    templateId: 'tea_act',
    chartIndex: 2,
    coreSpine: true,
    precondition: all(after('committees_of_correspondence'), { yearAtLeast: 1773 }),
    leadsTo: ['boston_tea_party'],
    build: (year) => auto('tea_act', year, 'Tea Act', 'Parliament passes the Tea Act, granting the East India Company a monopoly on colonial tea sales while keeping the Townshend tea duty.', 'Colonial merchants are furious. Moderates lose ground.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'Moderates lose ground.', effect: { text: 'Colonial merchants are furious. Moderates lose ground.', enthusiasm: [{ ideology: 'Moderate', party: 'RED', delta: -1 }] } }] }),
  },
  {
    templateId: 'boston_tea_party',
    chartIndex: 3,
    coreSpine: true,
    precondition: after('tea_act'),
    leadsTo: ['intolerable_acts'],
    build: (year) => auto('boston_tea_party', year, 'Boston Tea Party', 'Sons of Liberty disguised as Mohawks dump 342 chests of tea into Boston Harbor.', "Samuel Adams' faction is celebrated. Patriot fervor erupts; moderates lose support.", [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'Patriot fervor erupts.', effect: { text: "Samuel Adams' faction is celebrated. Patriot fervor erupts; moderates lose support.", partyPreference: 0.5 } }] }),
  },
  {
    templateId: 'intolerable_acts',
    chartIndex: 4,
    precondition: after('boston_tea_party'),
    leadsTo: ['declaration_of_resolves'],
    build: (year) => ({
      id: uid('era'),
      templateId: 'intolerable_acts',
      year,
      title: 'Intolerable Acts',
      description: 'Parliament responds with the Coercive Acts: closing Boston Harbor, restructuring the Massachusetts government, expanding quartering of troops. Anger sweeps the colonies.',
      decider: 'auto',
      responses: [{ id: 'ok', label: 'Convene the First Continental Congress', description: 'The colonies will meet in Philadelphia to coordinate a response.', effect: { text: 'The First Continental Congress is called to meet.', meters: { domestic: -2 } } }],
      postEffects: [{ type: 'assembleCC' }],
    }),
  },
  {
    templateId: 'declaration_of_resolves',
    chartIndex: 5,
    precondition: all(after('intolerable_acts'), { yearAtLeast: 1774 }),
    leadsTo: ['lexington_concord'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'declaration_of_resolves',
      year,
      title: 'Declaration of Resolves',
      description: 'The Continental Congress debates whether to formally object to the Intolerable Acts. The President of Congress must choose.',
      decider: 'cc-president',
      responses: [
        // a = patriot/independence (LW); b = conciliatory (RW)
        { id: 'a', label: 'State our grievances to the world', description: 'Adopt the Declaration and the Continental Association boycott of British goods.', effect: { text: 'The colonies will speak with one voice.', partyPreference: 0.5, enthusiasm: [{ ideology: 'LW Populist', party: 'BLUE', delta: 2 }, { ideology: 'Progressive', party: 'BLUE', delta: 2 }] } },
        { id: 'b', label: 'Table the resolution', description: 'No need to provoke the British further.', effect: { text: 'A quieter response. Patriots are demoralized.', partyPreference: -0.3, enthusiasm: [{ ideology: 'LW Populist', party: 'BLUE', delta: -1 }] } },
      ],
    }),
  },

  // ==========================================================================
  // Group B — War onset & the army (cc-president decisions; military via C-in-C)
  // ==========================================================================
  {
    templateId: 'lexington_concord',
    chartIndex: 6,
    precondition: all(after('declaration_of_resolves'), { yearAtLeast: 1775 }),
    leadsTo: ['conciliatory_resolution', 'continental_army', 'lees_resolution'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'lexington_concord',
      year,
      title: 'Lexington and Concord',
      description: 'British regulars march to seize colonial militia stores. They are met at Lexington Green and repulsed at Concord.',
      decider: 'cc-president',
      responses: [
        // a = aid Massachusetts -> Revolutionary War (startRevWar in consequences case)
        { id: 'a', label: 'Aid Massachusetts!', description: 'Establish a Continental Army and Navy. The Revolutionary War begins.', effect: { text: 'The Revolutionary War begins.', meters: { domestic: -3, military: 1 } } },
        { id: 'b', label: 'A matter for Massachusetts', description: 'Decline to act federally.', effect: { text: 'A delay. Domestic stability suffers as factions blame each other.', meters: { domestic: -2 } } },
      ],
    }),
  },
  {
    templateId: 'continental_army',
    chartIndex: 13,
    precondition: all(after('lexington_concord'), { warActive: true }),
    aiBias: { LW: 'a', Center: 'a', RW: 'a' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'continental_army',
      year,
      title: 'Create the Continental Army',
      description: 'Congress moves to adopt the New England forces besieging Boston as a Continental Army and to appoint a Commander-in-Chief.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Adopt a Continental Army', description: 'A standing army under a single command.', effect: { text: 'The Continental Army is established under a Commander-in-Chief.', meters: { military: 1 } }, },
        { id: 'b', label: 'Rely on the state militias', description: 'Leave the fighting to militia.', effect: { text: 'Without a unified army, the war effort is improvised.', meters: { military: -1, domestic: -1 } } },
      ],
      unlocks: ['continentalArmy'],
    }),
  },
  {
    // Lord North's Feb 1775 olive branch — a real pre-/early-war off-ramp.
    templateId: 'conciliatory_resolution',
    chartIndex: 24,
    precondition: all(after('lexington_concord'), { warActive: true }, { yearAtLeast: 1775 }),
    leadsTo: ['dominion_autonomy'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'conciliatory_resolution',
      year,
      title: 'Conciliatory Resolution',
      description: "Lord North's resolution offers to spare any colony that taxes itself for defense from parliamentary taxation. Parliament has made its olive-branch offer; Congress must answer.",
      decider: 'cc-president',
      responses: [
        // a = reject (stay the independence course); b = accept (dominion off-ramp)
        { id: 'a', label: 'Reject — it is too little, too late', description: 'Demand the repeal of the Coercive Acts and recognition of colonial rights.', effect: { text: 'Congress rejects the resolution. The war continues.', partyPreference: 0.3 } },
        { id: 'b', label: 'Accept self-taxation within the empire', description: 'Settle for self-rule short of independence.', effect: { text: 'Congress signals willingness to remain within the empire. The drive for independence stalls.', partyPreference: -0.6, meters: { domestic: 1 }, diplomacy: [{ nation: 'Britain', delta: 2 }] } },
      ],
    }),
  },

  // ==========================================================================
  // Group C — Diplomacy (read/write game.diplomacy scalars only)
  // ==========================================================================
  {
    templateId: 'french_alliance',
    chartIndex: 21,
    precondition: all({ warActive: true }, { yearAtLeast: 1778 }),
    aiBias: { LW: 'a', Center: 'a', RW: 'a' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'french_alliance',
      year,
      title: 'Alliance with France',
      description: 'France, encouraged by recent battlefield successes, offers a treaty of alliance and commerce — on the condition of American independence.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Ratify the alliance', description: 'France enters the war as a full ally.', effect: { text: 'France enters the war. With a great-power ally, defeat is no longer possible.', diplomacy: [{ nation: 'France', delta: 4 }, { nation: 'Britain', delta: -1 }] } },
        { id: 'b', label: 'Decline foreign entanglement', description: 'Fight on alone.', effect: { text: 'Congress declines the alliance. The war remains a near-run thing.', meters: { domestic: -1 } } },
      ],
    }),
  },
  {
    // Britain's 1778 offer of self-rule short of independence — best-grounded CF.
    templateId: 'carlisle_commission',
    chartIndex: 23,
    precondition: all({ warActive: true }, { yearAtLeast: 1778 }),
    leadsTo: ['dominion_autonomy'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'carlisle_commission',
      year,
      title: 'Carlisle Peace Commission',
      description: 'Britain dispatches the Carlisle Commission offering self-rule within the empire — repeal of the Tea and Massachusetts Government Acts, the Declaratory Act disclaimed — but not independence.',
      decider: 'cc-president',
      responses: [
        // a = reject (demand independence); b = accept (dominion ending)
        { id: 'a', label: 'Reject — nothing short of independence', description: 'Refuse to negotiate without recognition of independence.', effect: { text: 'Congress refuses the commission. The fight for full independence goes on.', partyPreference: 0.4 } },
        { id: 'b', label: 'Accept self-rule within the empire', description: 'Settle for autonomy as a dominion of the Crown.', effect: { text: 'Congress accepts a settlement within the empire. The road to independence ends here.', meters: { domestic: 2 }, diplomacy: [{ nation: 'Britain', delta: 3 }] } },
      ],
    }),
  },
  {
    // Reframed from the chart's fantasy "Spain -> US ally": Spain fought Britain
    // for its own aims and never allied with the US. Diplomacy scalars only.
    templateId: 'spanish_belligerence',
    chartIndex: 25,
    realEvent: true,
    precondition: all({ warActive: true }, { yearAtLeast: 1779 }),
    build: (year) => auto('spanish_belligerence', year, 'Spain Enters the War Against Britain', 'Spain declares war on Britain (allied to France, not the United States) and quietly funnels supplies up the Mississippi from Louisiana. Spain withholds formal recognition of American independence.', 'Spanish belligerence stretches British forces; covert aid flows through New Orleans — but there is no Spanish alliance.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'British forces are stretched; covert aid flows up the Mississippi.', effect: { text: 'Spanish belligerence stretches British forces; covert aid flows through New Orleans. There is no formal US-Spain alliance.', diplomacy: [{ nation: 'Spain', delta: 2 }, { nation: 'Britain', delta: -2 }] } }] }),
  },
  {
    // Dutch recognition + the 1782 Amsterdam loan — the only in-era finance fact.
    templateId: 'dutch_recognition',
    chartIndex: 28,
    precondition: all({ warActive: true }, { yearAtLeast: 1782 }),
    build: (year) => auto('dutch_recognition', year, 'Dutch Recognition and a Loan', 'The Dutch Republic becomes the second nation to recognize the United States. John Adams secures a large loan in Amsterdam, opening foreign credit.', 'Foreign credit opens. The United States can now take out loans.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'Foreign credit opens.', effect: { text: 'The Dutch recognize the United States and extend credit. Foreign loans are now available.', diplomacy: [{ nation: 'Netherlands', delta: 3 }] } }] }),
  },

  // ==========================================================================
  // Group D — War outcomes & endings
  // ==========================================================================
  {
    // Reframed from "King George III grants autonomy": it was PARLIAMENT, 1782.
    templateId: 'parliament_authorizes_peace',
    chartIndex: 30,
    realEvent: true,
    precondition: all({ warActive: true }, { yearAtLeast: 1782 }),
    build: (year) => auto('parliament_authorizes_peace', year, 'Parliament Authorizes Peace', 'After Yorktown, the Commons authorizes peace negotiations and the North ministry collapses. The British government — not the King personally — moves to end a war grown too costly.', 'London opens negotiations. The path to a peace treaty is clear.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'London opens peace negotiations.', effect: { text: 'Parliament authorizes peace and North resigns. The road to the Treaty of Paris opens.', diplomacy: [{ nation: 'Britain', delta: 1 }] } }] }),
  },
  {
    // Counterfactual: American war-weariness / currency collapse, 1780-81.
    templateId: 'colonial_war_weariness',
    chartIndex: 31,
    realEvent: false,
    precondition: all({ warActive: true }, { yearAtLeast: 1780 }, { not: { warOutcome: 'win' } }),
    leadsTo: ['dominion_autonomy'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'colonial_war_weariness',
      year,
      title: 'War-Weariness in the Colonies',
      description: 'Currency collapse, unpaid troops, and mutinies sap the will to fight. Some in Congress press for a negotiated settlement.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Hold the line', description: 'Endure the hardship and fight on.', effect: { text: 'Congress resolves to fight on despite the exhaustion.', meters: { domestic: -2 } } },
        { id: 'b', label: 'Seek a negotiated settlement', description: 'Open talks for autonomy within the empire.', effect: { text: 'Congress sues for a settlement short of independence.', meters: { domestic: 1 }, diplomacy: [{ nation: 'Britain', delta: 2 }] } },
      ],
    }),
  },
  {
    // Counterfactual: British war-weariness toppled North in 1782 (NOT 1786).
    templateId: 'british_war_weariness',
    chartIndex: 33,
    realEvent: false,
    precondition: all({ warActive: true }, { yearAtLeast: 1782 }),
    build: (year) => auto('british_war_weariness', year, 'War-Weariness in Great Britain', 'The cost of the war turns British opinion against it. Pressure mounts in the Commons to concede and come to terms.', 'British resolve cracks. A concession to American demands grows likely.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'British resolve cracks.', effect: { text: 'British war-weariness pushes London toward concession and peace.', diplomacy: [{ nation: 'Britain', delta: 1 }] } }] }),
  },
  {
    // TERMINAL ENDING 1: lost war / loyalist reabsorption.
    templateId: 'lost_war',
    chartIndex: 11,
    realEvent: false,
    precondition: { warOutcome: 'loss' },
    build: (year) => auto('lost_war', year, 'Defeat and Reabsorption', 'The Continental cause collapses. Britain reconquers the colonies and the leaders of the rebellion face reprisal. There is no American republic to carry forward.', 'The Revolution has failed. The colonies are reabsorbed into the British Empire.', [], [], { responses: [{ id: 'ok', label: 'The Revolution has failed', description: 'The colonies are reabsorbed into the Empire.', effect: { text: 'The Revolution is crushed. Britain reasserts control and the rebellion ends.' } }], triggersGameEnd: true }),
  },
  {
    // TERMINAL ENDING 2: dominion / autonomy within the empire. Reached from
    // Carlisle-accept, Conciliatory-accept, or colonial-war-weariness-settle.
    templateId: 'dominion_autonomy',
    chartIndex: 8,
    realEvent: false,
    precondition: { any: [chose('carlisle_commission', 'b'), chose('conciliatory_resolution', 'b'), chose('colonial_war_weariness', 'b')] },
    build: (year) => auto('dominion_autonomy', year, 'Autonomy Within the Empire', 'The colonies secure self-government as a dominion of the Crown — independence in all but name, but never proclaimed. The British connection endures.', 'You have won autonomy within the British Empire. Independence was never declared.', [], [], { responses: [{ id: 'ok', label: 'A settlement within the Empire', description: 'Self-rule short of independence.', effect: { text: 'The colonies become a self-governing dominion within the British Empire.' } }], triggersGameEnd: true }),
  },

  // ==========================================================================
  // Group E — Founding government (spine)
  // ==========================================================================
  {
    templateId: 'lees_resolution',
    chartIndex: 12,
    // After the war has BEGUN (Lexington done) — not gated on it still being
    // active, so a fast war win or an unresolved war never strands the founding
    // spine. An off-ramp settlement reaches a terminal ending before this.
    precondition: all(after('lexington_concord'), { yearAtLeast: 1776 }),
    leadsTo: ['declaration_of_independence'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'lees_resolution',
      year,
      title: "Lee's Resolution",
      description: 'Richard Henry Lee proposes a resolution declaring independence. The Continental Congress will vote.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Adopt the resolution', description: 'A formal vote for independence.', effect: { text: 'The colonies move toward independence.', partyPreference: 0.3 } },
        { id: 'b', label: 'Postpone', description: 'Delay the vote.', effect: { text: 'The colonies hesitate at the brink.', partyPreference: -0.2 } },
      ],
    }),
  },
  {
    templateId: 'declaration_of_independence',
    chartIndex: 12,
    precondition: all(after('lees_resolution'), { yearAtLeast: 1776 }),
    leadsTo: ['articles_of_confederation'],
    aiBias: { LW: 'a', Center: 'a', RW: 'a' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'declaration_of_independence',
      year,
      title: 'Declaration of Independence',
      description: 'A drafting committee, led by Thomas Jefferson, has produced a Declaration. The Continental Congress votes.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Sign the Declaration', description: 'The thirteen colonies become free and independent states.', effect: { text: 'Independence is declared. The states are born. Governors will be chosen.', meters: { domestic: -1 }, partyPreference: 0.3 } },
      ],
      unlocks: ['governors'],
    }),
  },
  {
    templateId: 'articles_of_confederation',
    chartIndex: 14,
    precondition: all(after('declaration_of_independence'), { yearAtLeast: 1777 }),
    leadsTo: ['annapolis_convention'],
    aiBias: { LW: 'a', Center: 'a', RW: 'a' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'articles_of_confederation',
      year,
      title: 'Articles of Confederation',
      description: 'A confederal framework is drafted. Congress will need 2/3 of states to legislate; amendments require unanimity.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Ratify the Articles', description: 'A loose confederation of sovereign states.', effect: { text: 'The Articles of Confederation take effect. Congress is renamed the Confederation Congress.' } },
      ],
    }),
  },
  {
    templateId: 'treaty_of_paris',
    chartIndex: 27,
    precondition: all({ warOutcome: 'win' }, { yearAtLeast: 1783 }),
    build: (year) => ({
      id: uid('era'),
      templateId: 'treaty_of_paris',
      year,
      title: 'Treaty of Paris',
      description: 'Britain recognizes American independence. The new nation gains the territories west to the Mississippi.',
      decider: 'auto',
      responses: [{ id: 'ok', label: 'Sign the Treaty', description: 'The Revolutionary War is over.', effect: { text: 'The Treaty of Paris ends the war. The Continental Army and Navy are largely disbanded.', meters: { domestic: 1, military: -1 } } }],
    }),
  },
  {
    // Decision split (chart 36 -> 37/38): convention follows vs. confederation remains.
    templateId: 'annapolis_convention',
    chartIndex: 36,
    precondition: all(after('articles_of_confederation'), { yearAtLeast: 1786 }),
    leadsTo: ['constitutional_convention_kickoff', 'confederation_remains'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'annapolis_convention',
      year,
      title: 'Annapolis Convention',
      description: 'Delegates from only five states meet at Annapolis to discuss commercial reform. Hamilton drafts a report; Congress must decide whether to call a full convention.',
      decider: 'cc-president',
      responses: [
        // a = call the Constitutional Convention; b = confederation remains (terminal)
        { id: 'a', label: 'Call a Constitutional Convention', description: 'Summon delegates to Philadelphia to revise the framework of government.', effect: { text: 'A Constitutional Convention is called to meet in Philadelphia.', partyPreference: 0.2 } },
        { id: 'b', label: 'Let the Confederation stand', description: 'The Articles will remain the government.', effect: { text: 'No convention is called. The Confederation endures.' } },
      ],
    }),
  },
  {
    templateId: 'constitutional_convention_kickoff',
    chartIndex: 37,
    precondition: all(chose('annapolis_convention', 'a'), { yearAtLeast: 1787 }),
    leadsTo: ['federalist_papers'],
    build: (year) => ({
      id: uid('era'),
      templateId: 'constitutional_convention_kickoff',
      year,
      title: 'Constitutional Convention',
      description: 'Delegates gather in Philadelphia. The structure of the new government is on the table. (Open the Constitutional Convention screen from the menu to vote on each article.)',
      decider: 'auto',
      responses: [{ id: 'ok', label: 'Convene', description: 'Begin the Convention.', effect: { text: 'The Convention begins. Delegates vote on each article.' } }],
    }),
  },
  {
    // TERMINAL ENDING 3: the Articles persist; no Constitution (CP1-3 decision).
    templateId: 'confederation_remains',
    chartIndex: 38,
    realEvent: false,
    precondition: chose('annapolis_convention', 'b'),
    build: (year) => auto('confederation_remains', year, 'The Confederation Endures', 'No convention is summoned. The United States carries on under the Articles of Confederation — a loose league of sovereign states, never reforged into a federal union.', 'The United States persists under the Articles of Confederation. The Constitution is never written.', [], [], { responses: [{ id: 'ok', label: 'The Articles stand', description: 'A confederation of sovereign states endures.', effect: { text: 'The United States remains a confederation under the Articles. There will be no Constitution.' } }], triggersGameEnd: true }),
  },
  {
    // Ratification-debate flavor: Federalist vs Anti-Federalist POSITIONS
    // (mapped to RED/BLUE factions), never the modern party system.
    templateId: 'federalist_papers',
    chartIndex: 40,
    precondition: after('constitutional_convention_kickoff'),
    build: (year) => auto('federalist_papers', year, 'The Federalist & Anti-Federalist Papers', 'As the states debate ratification, "Publius" argues for the new Constitution while "Brutus" and other Anti-Federalist writers argue against it — a contest of positions, not yet of organized parties.', 'The ratification debate plays out in the press. Both sides sharpen their arguments.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'The ratification debate plays out in the press.', effect: { text: 'Federalist and Anti-Federalist writers contest ratification state by state.' } }] }),
  },

  // ==========================================================================
  // Group F — Vermont (territory branch)
  // ==========================================================================
  {
    templateId: 'republic_of_vermont',
    chartIndex: 15,
    precondition: { yearAtLeast: 1777 },
    leadsTo: ['claim_vermont'],
    build: (year) => auto('republic_of_vermont', year, 'Republic of Vermont Proclaimed', 'Settlers on the disputed New Hampshire Grants proclaim Vermont an independent republic, rejecting the rival claims of New York and New Hampshire.', 'A de-facto independent republic appears on the northern frontier.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'A de-facto republic appears on the frontier.', effect: { text: 'Vermont declares itself an independent republic on the contested grants.' } }] }),
  },
  {
    templateId: 'claim_vermont',
    chartIndex: 16,
    precondition: after('republic_of_vermont'),
    leadsTo: ['vermont_statehood'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'claim_vermont',
      year,
      title: 'Claim Vermont?',
      description: 'Congress must decide whether to press a claim on the Vermont republic and admit it to the Union, or leave it as an independent neighbor.',
      decider: 'cc-president',
      responses: [
        // a = claim (leads to statehood); b = do not claim (stays a republic)
        { id: 'a', label: 'Claim Vermont for the Union', description: 'Negotiate Vermont into the Union as a state.', effect: { text: 'Congress moves to bring Vermont into the Union.', partyPreference: 0.1 } },
        { id: 'b', label: 'Do not claim Vermont', description: 'Let it remain an independent republic.', effect: { text: 'Vermont remains an independent republic on the frontier.' } },
      ],
    }),
  },
  {
    templateId: 'vermont_statehood',
    chartIndex: 17,
    precondition: chose('claim_vermont', 'a'),
    aiBias: { LW: 'a', Center: 'a', RW: 'a' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'vermont_statehood',
      year,
      title: 'Vermont Statehood',
      description: 'With New York\'s rival claim bought out, Vermont is ready to be admitted to the Union.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Admit Vermont as a state', description: 'Vermont joins the Union.', effect: { text: 'Vermont is admitted to the Union as a state.', partyPreference: 0.1 } },
      ],
    }),
  },

  // ==========================================================================
  // Group G — Indian treaties (Confederation Congress; correct nations)
  // ==========================================================================
  {
    // Six Nations / Haudenosaunee (NOT a generic "Iroquois" treaty).
    templateId: 'fort_stanwix',
    chartIndex: 41,
    precondition: all({ warOutcome: 'win' }, { yearAtLeast: 1784 }),
    leadsTo: ['six_nations_frontier_conflict'],
    aiBias: { LW: 'b', Center: 'a', RW: 'a' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'fort_stanwix',
      year,
      title: 'Treaty of Fort Stanwix',
      description: "The Confederation Congress' commissioners meet the Six Nations to dictate land cessions in the Ohio country and western New York, punishing the four nations that backed Britain.",
      decider: 'cc-president',
      responses: [
        // a = make peace and settle PA (path to frontier conflict); b = respect their lands
        { id: 'a', label: 'Make peace so we can settle Pennsylvania', description: 'Dictate the cessions and open the land to settlers.', effect: { text: 'The Six Nations cede vast territory. The treaty splits the Confederacy and is bitterly resented.', interestGroups: [{ id: 'frontier', delta: 6 }], diplomacy: [{ nation: 'SixNations', delta: -2 }] } },
        { id: 'b', label: 'This is a manipulative treaty — respect their lands', description: 'Refuse a coerced cession and recognize their rights.', effect: { text: 'Congress declines to coerce the Six Nations. Settlers are angry; the frontier stays quiet.', interestGroups: [{ id: 'frontier', delta: -4 }], diplomacy: [{ nation: 'SixNations', delta: 2 }] } },
      ],
    }),
  },
  {
    // Reframed from "Iroquois League War": the Six Nations FRAGMENTED, no unified war.
    templateId: 'six_nations_frontier_conflict',
    chartIndex: 44,
    realEvent: false,
    precondition: chose('fort_stanwix', 'a'),
    build: (year) => auto('six_nations_frontier_conflict', year, 'Frontier Conflict with the Six Nations', 'The coerced cessions at Fort Stanwix spark scattered frontier violence. The Six Nations fragment rather than waging a single unified war; the Buffalo Creek council repudiates the treaty as unauthorized.', 'Sporadic frontier conflict follows the treaty. The Confederacy splinters.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'Sporadic frontier conflict follows.', effect: { text: 'Scattered violence flares on the frontier as the Six Nations splinter over the treaty.', meters: { domestic: -1 } } }] }),
  },
  {
    // Three compressed treaties (Cherokee/Choctaw/Chickasaw), 1785-86.
    templateId: 'hopewell_treaties',
    chartIndex: 45,
    precondition: { yearAtLeast: 1785 },
    leadsTo: ['cherokee_american_wars'],
    aiBias: { LW: 'a', Center: 'a', RW: 'b' },
    build: (year) => ({
      id: uid('era'),
      templateId: 'hopewell_treaties',
      year,
      title: 'Treaties of Hopewell',
      description: "On the Keowee, the Confederation Congress' commissioners negotiate three treaties — with the Cherokee, Choctaw, and Chickasaw — setting boundaries already crowded with settlers.",
      decider: 'cc-president',
      responses: [
        // a = settle boundaries in good faith; b = the cynical (historically accurate) option
        { id: 'a', label: 'Settle boundaries to live in peace', description: 'Set fair boundaries and try to enforce them.', effect: { text: 'Congress sets boundaries with the three nations and pledges to enforce them.', interestGroups: [{ id: 'frontier', delta: -2 }], diplomacy: [{ nation: 'Cherokee', delta: 2 }] } },
        { id: 'b', label: "We have no intention of keeping these boundaries", description: 'Sign, but expect settlers to overrun the lines.', effect: { text: 'Congress signs treaties it does not mean to enforce. Settlers are already over the line.', interestGroups: [{ id: 'frontier', delta: 4 }], diplomacy: [{ nation: 'Cherokee', delta: -2 }] } },
      ],
    }),
  },
  {
    // Reframed from "Keowee War" (a river, not a war): the Chickamauga / Cherokee-American wars.
    templateId: 'cherokee_american_wars',
    chartIndex: 48,
    realEvent: false,
    precondition: chose('hopewell_treaties', 'b'),
    build: (year) => auto('cherokee_american_wars', year, 'Cherokee-American Wars', 'With settlers pouring over the Hopewell lines, Dragging Canoe and the Chickamauga Cherokee renew their resistance. The frontier burns.', 'The Chickamauga / Cherokee-American wars flare along the southwestern frontier.', [], [], { responses: [{ id: 'ok', label: 'Acknowledge', description: 'The southwestern frontier burns.', effect: { text: 'The Chickamauga and Cherokee wage renewed war as settlers violate the Hopewell boundaries.', meters: { domestic: -1 } } }] }),
  },
];
