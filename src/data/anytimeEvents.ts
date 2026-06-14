import type { Era, State, Trait, SkillKey } from '../types';

export interface AnytimeEventTemplate {
  id: string;
  category:
    | 'illness-acute' | 'illness-chronic' | 'illness-epidemic'
    | 'injury' | 'transport-accident'
    | 'violence-duel' | 'violence-assault' | 'violence-assassination'
    | 'scandal-financial' | 'scandal-sexual' | 'scandal-verbal'
    | 'breakthrough-speech' | 'breakthrough-crisis'
    | 'family-event' | 'financial-event' | 'war-service';
  eras?: Era[];
  regions?: State['region'][];
  weight: number;
  eraWeightMult?: Partial<Record<Era, number>>;
  scandalScaled?: boolean;
  effects: AnytimeEventEffect[];
  text: string;
}

export type AnytimeEventEffect =
  | { kind: 'grantTrait';  trait: Trait }
  | { kind: 'pvHit';        amount: number }
  | { kind: 'pvBump';       amount: number }
  | { kind: 'skillBump';    skill: SkillKey; amount: number }
  | { kind: 'commandBump';  amount: number }
  | { kind: 'death' }
  | { kind: 'forceRetire' };

export const ANYTIME_EVENT_TEMPLATES: AnytimeEventTemplate[] = [
  // ---------------- illness-acute (3) ----------------
  {
    id: 'illness-acute-pneumonia',
    category: 'illness-acute',
    weight: 6,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is bedridden with pneumonia. Recovery is slow.',
  },
  {
    id: 'illness-acute-fever',
    category: 'illness-acute',
    weight: 5,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is laid low by a sudden fever.',
  },
  {
    id: 'illness-acute-cardiac',
    category: 'illness-acute',
    eras: ['modern'],
    weight: 5,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) suffers a heart attack — disclosed publicly.',
  },

  // ---------------- illness-chronic (3) ----------------
  {
    id: 'illness-chronic-tb',
    category: 'illness-chronic',
    eras: ['independence', 'federalism', 'nationalism'],
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is diagnosed with consumption. Long shadow over the career.',
  },
  {
    id: 'illness-chronic-cirrhosis',
    category: 'illness-chronic',
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) shows signs of liver failure — long habits catching up.',
  },
  {
    id: 'illness-chronic-cancer',
    category: 'illness-chronic',
    eras: ['modern'],
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) announces a cancer diagnosis. Treatment begins.',
  },

  // ---------------- illness-epidemic (4) ----------------
  {
    id: 'epidemic-yellow-fever',
    category: 'illness-epidemic',
    eras: ['independence', 'federalism'],
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is felled by yellow fever in the summer outbreak.',
  },
  {
    id: 'epidemic-cholera',
    category: 'illness-epidemic',
    eras: ['federalism', 'nationalism'],
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is stricken by cholera as the outbreak reaches the capital.',
  },
  {
    id: 'epidemic-1918-flu',
    category: 'illness-epidemic',
    eras: ['nationalism'],
    eraWeightMult: { nationalism: 1.0 },
    weight: 3,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) catches the Spanish influenza in the pandemic wave.',
  },
  {
    id: 'epidemic-polio',
    category: 'illness-epidemic',
    eras: ['nationalism', 'modern'],
    weight: 3,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is paralyzed by polio. The career adapts to a new public posture.',
  },

  // ---------------- injury (2) ----------------
  {
    id: 'injury-hunting-accident',
    category: 'injury',
    weight: 3,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is injured in a hunting accident.',
  },
  {
    id: 'injury-fall',
    category: 'injury',
    weight: 3,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) takes a serious fall. Mobility is reduced.',
  },

  // ---------------- transport-accident (5) ----------------
  {
    id: 'transport-horse-fall',
    category: 'transport-accident',
    eras: ['independence', 'federalism'],
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is thrown from a horse on the road home.',
  },
  {
    id: 'transport-carriage',
    category: 'transport-accident',
    eras: ['independence', 'federalism'],
    weight: 3,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is hurt when a carriage overturns on rough ground.',
  },
  {
    id: 'transport-train-wreck',
    category: 'transport-accident',
    eras: ['federalism', 'nationalism'],
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is injured in a train wreck while traveling.',
  },
  {
    id: 'transport-auto-crash',
    category: 'transport-accident',
    eras: ['nationalism', 'modern'],
    eraWeightMult: { nationalism: 0.3, modern: 1.0 },
    weight: 4,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is injured in an automobile crash.',
  },
  {
    id: 'transport-plane-crash',
    category: 'transport-accident',
    eras: ['modern'],
    weight: 2,
    effects: [{ kind: 'death' }],
    text: '{first} {last} ({state}) dies in a small-plane crash en route to a campaign event.',
  },

  // ---------------- violence-duel (4: I/F universal + N South-only fading) ----------------
  {
    id: 'duel-survived-iF',
    category: 'violence-duel',
    eras: ['independence', 'federalism'],
    weight: 3,
    effects: [{ kind: 'grantTrait', trait: 'Controversial' }, { kind: 'pvHit', amount: -3 }],
    text: '{first} {last} ({state}) survives a pistol duel with an opponent of honor.',
  },
  {
    id: 'duel-lost-iF',
    category: 'violence-duel',
    eras: ['independence', 'federalism'],
    weight: 2,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is wounded in a duel — the affair of honor leaves a lasting mark.',
  },
  {
    id: 'duel-survived-southern',
    category: 'violence-duel',
    eras: ['nationalism'],
    regions: ['South', 'Border'],
    weight: 3,
    eraWeightMult: { nationalism: 0.2 },
    effects: [{ kind: 'grantTrait', trait: 'Controversial' }, { kind: 'pvHit', amount: -3 }],
    text: '{first} {last} ({state}) survives a pistol duel — the Southern code of honor endures.',
  },
  {
    id: 'duel-lost-southern',
    category: 'violence-duel',
    eras: ['nationalism'],
    regions: ['South', 'Border'],
    weight: 2,
    eraWeightMult: { nationalism: 0.2 },
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is wounded in a duel — the affair of honor leaves a lasting mark.',
  },

  // ---------------- violence-assault (1) ----------------
  {
    id: 'assault-caning',
    category: 'violence-assault',
    eras: ['federalism', 'nationalism'],
    weight: 2,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) is beaten on the floor of the chamber by a political rival.',
  },

  // ---------------- violence-assassination (2) ----------------
  {
    id: 'assassination-attempt-survived',
    category: 'violence-assassination',
    eras: ['nationalism', 'modern'],
    weight: 2,
    effects: [{ kind: 'grantTrait', trait: 'Charismatic' }, { kind: 'pvBump', amount: 8 }],
    text: '{first} {last} ({state}) survives an assassination attempt — public sympathy surges.',
  },
  {
    id: 'assassination-killed',
    category: 'violence-assassination',
    eras: ['nationalism', 'modern'],
    weight: 1,
    effects: [{ kind: 'death' }],
    text: '{first} {last} ({state}) is killed by an assassin\'s bullet.',
  },

  // ---------------- scandal-financial (3) ----------------
  {
    id: 'scandal-bribery',
    category: 'scandal-financial',
    weight: 5,
    scandalScaled: true,
    effects: [{ kind: 'grantTrait', trait: 'Scandalous' }, { kind: 'pvHit', amount: -10 }],
    text: '{first} {last} ({state}) is exposed in a bribery scheme — newspapers run the story for weeks.',
  },
  {
    id: 'scandal-speculation',
    category: 'scandal-financial',
    weight: 4,
    scandalScaled: true,
    effects: [{ kind: 'grantTrait', trait: 'Scandalous' }, { kind: 'pvHit', amount: -8 }],
    text: '{first} {last} ({state}) is caught insider-speculating on government contracts.',
  },
  {
    id: 'scandal-federal-investigation',
    category: 'scandal-financial',
    eras: ['nationalism', 'modern'],
    weight: 3,
    scandalScaled: true,
    effects: [{ kind: 'grantTrait', trait: 'Scandalous' }, { kind: 'pvHit', amount: -12 }],
    text: '{first} {last} ({state}) is named in a federal investigation. Subpoenas follow.',
  },

  // ---------------- scandal-sexual (2) ----------------
  {
    id: 'scandal-affair',
    category: 'scandal-sexual',
    weight: 4,
    scandalScaled: true,
    effects: [{ kind: 'grantTrait', trait: 'Scandalous' }, { kind: 'pvHit', amount: -8 }],
    text: '{first} {last} ({state}) is caught in a private affair — the pamphlets are vicious.',
  },
  {
    id: 'scandal-modern-misconduct',
    category: 'scandal-sexual',
    eras: ['modern'],
    weight: 3,
    scandalScaled: true,
    effects: [{ kind: 'grantTrait', trait: 'Scandalous' }, { kind: 'pvHit', amount: -12 }],
    text: '{first} {last} ({state}) is at the center of a public-misconduct scandal — the press cycle is brutal.',
  },

  // ---------------- scandal-verbal (1) ----------------
  {
    id: 'scandal-gaffe',
    category: 'scandal-verbal',
    weight: 4,
    scandalScaled: true,
    effects: [{ kind: 'grantTrait', trait: 'Unlikable' }, { kind: 'pvHit', amount: -5 }],
    text: '{first} {last} ({state}) makes a disastrous public statement that circulates nationally.',
  },

  // ---------------- breakthrough-speech (1) ----------------
  {
    id: 'breakthrough-speech',
    category: 'breakthrough-speech',
    weight: 4,
    effects: [
      { kind: 'grantTrait', trait: 'Orator' },
      { kind: 'commandBump', amount: 1 },
      { kind: 'pvBump', amount: 10 },
    ],
    text: '{first} {last} ({state}) delivers a memorable speech that defines the issue of the day.',
  },

  // ---------------- breakthrough-crisis (1) ----------------
  {
    id: 'breakthrough-crisis',
    category: 'breakthrough-crisis',
    weight: 4,
    effects: [
      { kind: 'grantTrait', trait: 'Crisis Manager' },
      { kind: 'commandBump', amount: 1 },
      { kind: 'pvBump', amount: 10 },
    ],
    text: '{first} {last} ({state}) handles a crisis with calm command — reputation rises.',
  },

  // ---------------- family-event (1) ----------------
  {
    id: 'family-death',
    category: 'family-event',
    weight: 2,
    effects: [{ kind: 'grantTrait', trait: 'Frail' }, { kind: 'pvHit', amount: -3 }],
    text: '{first} {last} ({state}) mourns the death of a close family member — visibly worn.',
  },

  // ---------------- financial-event (1) ----------------
  {
    id: 'financial-windfall',
    category: 'financial-event',
    weight: 2,
    effects: [{ kind: 'pvBump', amount: 3 }, { kind: 'skillBump', skill: 'governing', amount: 1 }],
    text: '{first} {last} ({state}) closes a profitable land or business deal.',
  },

  // ---------------- war-service (1) ----------------
  // Spec §1.3 flags Military/Naval grant as overlap with TRACK_THEMED_TRAITS;
  // brief validator forbids those traits. v1 ships command + skill bump only.
  {
    id: 'war-service-heroism',
    category: 'war-service',
    weight: 2,
    effects: [
      { kind: 'commandBump', amount: 1 },
      { kind: 'pvBump', amount: 6 },
    ],
    text: '{first} {last} ({state}) distinguishes himself in combat — promotion and honors follow.',
  },
];
