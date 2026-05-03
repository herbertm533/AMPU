import type { EraEvent } from '../types';
import { uid } from '../rng';

// Scripted 1772 era event chain. Each event has a stable templateId so we can
// track which have already fired in game.eraEventsCompleted, and a `gateYear`
// (year on or after which it can fire) and `requiresTemplate` (a prior
// template that must have fired first).

export interface ScriptedEvent {
  templateId: string;
  gateYear?: number;
  requiresTemplate?: string;
  build: (year: number) => EraEvent;
}

const auto = (templateId: string, year: number, title: string, description: string, text: string, postEffects: EraEvent['postEffects'] = [], unlocks: EraEvent['unlocks'] = []): EraEvent => ({
  id: uid('era'),
  templateId,
  year,
  title,
  description,
  decider: 'auto',
  responses: [{ id: 'ok', label: 'Acknowledge', description: text, effect: { text } }],
  postEffects,
  unlocks,
});

export const SCRIPTED_1772: ScriptedEvent[] = [
  // 1772-1774 first turn — auto events
  {
    templateId: 'gaspee',
    build: (year) => auto('gaspee', year, 'Gaspee Affair', 'Rhode Islanders board and burn the British customs schooner HMS Gaspee.', 'Conservative and moderate factions condemn the act. Pro-independence sentiment quietly grows.'),
  },
  {
    templateId: 'committees_of_correspondence',
    build: (year) => auto('committees_of_correspondence', year, 'Committees of Correspondence', 'Samuel Adams and allies organize colony-wide committees of correspondence to coordinate resistance.', 'Patriot and progressive factions gain organizational momentum across the colonies.'),
  },
  {
    templateId: 'tea_act',
    build: (year) => auto('tea_act', year, 'Tea Act', 'Parliament passes the Tea Act, granting the East India Company a monopoly on colonial tea sales.', 'Colonial merchants are furious. Moderates lose ground.'),
  },
  {
    templateId: 'boston_tea_party',
    build: (year) => auto('boston_tea_party', year, 'Boston Tea Party', 'Sons of Liberty disguised as Mohawks dump 342 chests of tea into Boston Harbor.', "Samuel Adams' faction is celebrated. Patriot fervor erupts; moderates lose support."),
  },
  {
    templateId: 'intolerable_acts',
    build: (year) => ({
      id: uid('era'),
      templateId: 'intolerable_acts',
      year,
      title: 'Intolerable Acts',
      description: 'Parliament responds with the Coercive Acts: closing Boston Harbor, restructuring the Massachusetts government, expanding quartering of troops. Anger sweeps the colonies.',
      decider: 'auto',
      responses: [{ id: 'ok', label: 'Convene the First Continental Congress', description: 'The colonies will meet in Philadelphia to coordinate a response.', effect: { text: 'The First Continental Congress is called to meet.', meters: { domestic: -2 } } }],
      postEffects: [],
    }),
    requiresTemplate: 'boston_tea_party',
  },

  // 1774-1776 second turn
  {
    templateId: 'declaration_of_resolves',
    gateYear: 1774,
    build: (year) => ({
      id: uid('era'),
      templateId: 'declaration_of_resolves',
      year,
      title: 'Declaration of Resolves',
      description: 'The Continental Congress debates whether to formally object to the Intolerable Acts. The CC President must choose.',
      decider: 'cc-president',
      responses: [
        {
          id: 'a', label: 'State our grievances to the world',
          description: 'Adopt the Declaration and call for a boycott of British goods.',
          effect: { text: 'The colonies will speak with one voice.', partyPreference: 0.5, enthusiasm: [{ ideology: 'LW Populist', party: 'BLUE', delta: 2 }, { ideology: 'Progressive', party: 'BLUE', delta: 2 }] },
        },
        {
          id: 'b', label: 'Table the resolution',
          description: 'No need to provoke the British further.',
          effect: { text: 'A quieter response. Patriots are demoralized.', partyPreference: -0.3, enthusiasm: [{ ideology: 'LW Populist', party: 'BLUE', delta: -1 }] },
        },
      ],
    }),
    requiresTemplate: 'intolerable_acts',
  },
  {
    templateId: 'common_sense',
    gateYear: 1776,
    build: (year) => auto('common_sense', year, 'Common Sense', 'Thomas Paine publishes Common Sense, a pamphlet calling unequivocally for independence. It sells 120,000 copies in months.', 'Thomas Paine becomes a household name. Enthusiasm for independence surges.'),
    requiresTemplate: 'declaration_of_resolves',
  },
  {
    templateId: 'lexington_concord',
    gateYear: 1775,
    build: (year) => ({
      id: uid('era'),
      templateId: 'lexington_concord',
      year,
      title: 'Lexington and Concord',
      description: 'British regulars march to seize colonial militia stores. They are met at Lexington Green and repulsed at Concord.',
      decider: 'cc-president',
      responses: [
        {
          id: 'a', label: 'Aid Massachusetts!',
          description: 'Establish a Continental Army and Continental Navy. War begins.',
          effect: { text: 'The Revolutionary War begins.', meters: { domestic: -3, military: 1 } },
          // Use startWar marker; engine reads postEffects too
        },
        {
          id: 'b', label: 'A matter for Massachusetts',
          description: 'Decline to act federally.',
          effect: { text: 'A delay. Domestic stability suffers as factions blame each other.', meters: { domestic: -2 } },
        },
      ],
      postEffects: [], // engine treats response 'a' as triggering Rev War
    }),
    requiresTemplate: 'common_sense',
  },
  {
    templateId: 'proclamation_of_rebellion',
    gateYear: 1775,
    build: (year) => ({
      id: uid('era'),
      templateId: 'proclamation_of_rebellion',
      year,
      title: 'Proclamation of Rebellion',
      description: 'King George III declares the colonies to be in formal rebellion.',
      decider: 'cc-president',
      responses: [
        {
          id: 'a', label: 'Damn King George III!',
          description: 'Defiance.',
          effect: { text: 'Independence sentiment surges; domestic tension grows.', partyPreference: 0.5, meters: { domestic: -2 }, enthusiasm: [{ ideology: 'LW Populist', party: 'BLUE', delta: 2 }, { ideology: 'Progressive', party: 'BLUE', delta: 2 }] },
        },
        {
          id: 'b', label: 'Loyal to King, not Parliament',
          description: 'Walk a fine line.',
          effect: { text: 'A measured response. Both sides find it inadequate.', partyPreference: -0.1 },
        },
        {
          id: 'c', label: 'Proclaim loyalty to the Crown',
          description: 'Conservative response. The cause of independence loses steam.',
          effect: { text: 'Loyalists rejoice. Patriots feel betrayed. Risks ending the revolutionary cause.', partyPreference: -1, meters: { domestic: -1 }, enthusiasm: [{ ideology: 'Traditionalist', party: 'RED', delta: 2 }, { ideology: 'LW Populist', party: 'BLUE', delta: -3 }] },
        },
      ],
    }),
    requiresTemplate: 'lexington_concord',
  },
  {
    templateId: 'restraining_acts',
    gateYear: 1775,
    build: (year) => auto('restraining_acts', year, 'Restraining Acts', 'Parliament restrains trade in colonies declared in rebellion.', 'Colonial economies suffer. Manufacturers and shippers feel the squeeze.', [], []),
    requiresTemplate: 'proclamation_of_rebellion',
  },
  {
    templateId: 'foreign_trainers_kosciuszko',
    gateYear: 1776,
    build: (year) => auto('foreign_trainers_kosciuszko', year, "Tadeusz Kościuszko Arrives", 'A Polish military engineer offers his services to the Continental Army.', 'Kosciuszko joins the Continental Army as an engineering officer.'),
    requiresTemplate: 'lexington_concord',
  },
  {
    templateId: 'foreign_trainers_steuben',
    gateYear: 1777,
    build: (year) => auto('foreign_trainers_steuben', year, 'Baron von Steuben Arrives', 'A Prussian officer arrives to drill the Continental Army into a professional fighting force.', 'Continental troops gain training and discipline.'),
    requiresTemplate: 'foreign_trainers_kosciuszko',
  },
  {
    templateId: 'lafayette',
    gateYear: 1777,
    build: (year) => auto('lafayette', year, 'Marquis de Lafayette Arrives', 'A young French nobleman arrives to fight for the Patriot cause.', 'Lafayette joins the Continental Army. Relations with France warm.'),
    requiresTemplate: 'foreign_trainers_steuben',
  },

  // 1776-1778
  {
    templateId: 'lees_resolution',
    gateYear: 1776,
    build: (year) => ({
      id: uid('era'),
      templateId: 'lees_resolution',
      year,
      title: "Lee's Resolution",
      description: "Richard Henry Lee proposes a resolution declaring independence. The Continental Congress will vote.",
      decider: 'cc-president',
      responses: [
        {
          id: 'a', label: 'Adopt the resolution', description: 'A formal vote for independence.', effect: { text: 'The colonies move toward independence.' } },
        {
          id: 'b', label: 'Postpone',
          description: 'Delay the vote.',
          effect: { text: 'The colonies hesitate at the brink.' },
        },
      ],
    }),
    requiresTemplate: 'lexington_concord',
  },
  {
    templateId: 'declaration_of_independence',
    gateYear: 1776,
    build: (year) => ({
      id: uid('era'),
      templateId: 'declaration_of_independence',
      year,
      title: 'Declaration of Independence',
      description: 'A drafting committee, led by Thomas Jefferson, has produced a Declaration. The Continental Congress votes.',
      decider: 'cc-president',
      responses: [
        {
          id: 'a', label: 'Sign the Declaration',
          description: 'The thirteen colonies become free and independent states.',
          effect: { text: 'Independence is declared. The states are born. Governors will be chosen.', meters: { domestic: -1 }, partyPreference: 0.3 },
        },
      ],
      unlocks: ['governors'],
    }),
    requiresTemplate: 'lees_resolution',
  },
  {
    templateId: 'articles_of_confederation',
    gateYear: 1777,
    build: (year) => ({
      id: uid('era'),
      templateId: 'articles_of_confederation',
      year,
      title: 'Articles of Confederation',
      description: 'A confederal framework is drafted. Congress will need 2/3 of states to legislate; amendments require unanimity.',
      decider: 'cc-president',
      responses: [
        {
          id: 'a', label: 'Ratify the Articles', description: 'A loose confederation of sovereign states.', effect: { text: 'The Articles of Confederation take effect. Congress is renamed the Confederation Congress.' } },
      ],
    }),
    requiresTemplate: 'declaration_of_independence',
  },

  // 1778-1786
  {
    templateId: 'dunmores_proclamation',
    gateYear: 1775,
    build: (year) => ({
      id: uid('era'),
      templateId: 'dunmores_proclamation',
      year,
      title: "Dunmore's Proclamation",
      description: 'The Royal Governor of Virginia promises freedom to enslaved persons who join the British army.',
      decider: 'cc-president',
      responses: [
        { id: 'a', label: 'Denounce loudly', description: 'Rally Patriot opinion.', effect: { text: 'Outrage swells. Domestic stability dips but enthusiasm climbs.', meters: { domestic: -1 }, partyPreference: 0.2 } },
        { id: 'b', label: 'Quietly contain', description: 'Avoid provoking further.', effect: { text: 'A measured silence.', meters: { domestic: -1 } } },
      ],
    }),
    requiresTemplate: 'lexington_concord',
  },
  {
    templateId: 'french_alliance',
    gateYear: 1778,
    build: (year) => auto('french_alliance', year, 'Alliance with France', 'France formally allies with the United States after recent battlefield successes.', 'France enters the war. Defeat is no longer possible.'),
    requiresTemplate: 'lafayette',
  },
  {
    templateId: 'treaty_of_paris',
    gateYear: 1783,
    build: (year) => ({
      id: uid('era'),
      templateId: 'treaty_of_paris',
      year,
      title: 'Treaty of Paris',
      description: 'Britain recognizes American independence. The new nation gains the territories west to the Mississippi.',
      decider: 'auto',
      responses: [{ id: 'ok', label: 'Sign the Treaty', description: 'The Revolutionary War is over.', effect: { text: 'The Treaty of Paris ends the war. Continental Army and Navy are largely disbanded.', meters: { domestic: 1, military: -1 } } }],
    }),
    requiresTemplate: 'french_alliance',
  },
  {
    templateId: 'shays_rebellion',
    gateYear: 1786,
    build: (year) => auto('shays_rebellion', year, "Shays' Rebellion", 'Massachusetts farmers led by Daniel Shays rise against debt and taxes. The Confederation Congress is powerless.', 'The weakness of the Articles of Confederation becomes plain.', [], []),
    requiresTemplate: 'treaty_of_paris',
  },
  {
    templateId: 'annapolis_convention',
    gateYear: 1786,
    build: (year) => auto('annapolis_convention', year, 'Annapolis Convention', 'Delegates from five states meet in Annapolis to discuss commercial reforms; they call for a broader convention.', 'A Constitutional Convention is called to meet in Philadelphia.', [], []),
    requiresTemplate: 'shays_rebellion',
  },

  // 1787 — Constitutional Convention is a special interactive screen, not a normal era event.
  {
    templateId: 'constitutional_convention_kickoff',
    gateYear: 1787,
    build: (year) => ({
      id: uid('era'),
      templateId: 'constitutional_convention_kickoff',
      year,
      title: 'Constitutional Convention',
      description: 'Delegates gather in Philadelphia. The structure of the new government is on the table. (Open the Constitutional Convention screen from the menu to vote on each article.)',
      decider: 'auto',
      responses: [{ id: 'ok', label: 'Convene', description: 'Begin the Convention.', effect: { text: 'The Convention begins. Delegates vote on each article.' } }],
    }),
    requiresTemplate: 'annapolis_convention',
  },
];
