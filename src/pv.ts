import type { Politician, OfficeRef, Trait } from './types';

const POSITIVE: Trait[] = [
  'Charismatic', 'Integrity', 'Efficient', 'Orator', 'Debater', 'Propagandist',
  'Crisis Manager', 'Kingmaker', 'Numberfudger', 'Harmonious', 'Manipulative',
  'Celebrity', 'Magician', 'Naval', 'Education', 'Economics', 'Business',
  'Agriculture', 'Environment', 'Media', 'Nationalist', 'Globalist', 'Reformist', 'Military',
];

const NEGATIVE: Trait[] = ['Incompetent', 'Passive', 'Unlikable', 'Puritan', 'Domestic Apathy', 'Flip-Flopper', 'Corrupt', 'Scandalous'];

const OFFICE_PRESTIGE: Record<string, number> = {
  President: 30,
  VicePresident: 12,
  ChiefJustice: 18,
  AssociateJustice: 10,
  SecretaryOfState: 12,
  SecretaryOfTreasury: 10,
  SecretaryOfWar: 10,
  AttorneyGeneral: 8,
  PostmasterGeneral: 4,
  KeyAdvisor: 8,
  GeneralInChief: 12,
  Admiral: 10,
  SpeakerOfHouse: 12,
  SenateProTem: 10,
  CommitteeChair: 6,
  FactionLeader: 8,
  PartyLeader: 14,
  Senator: 5,
  Representative: 2,
  Governor: 6,
  Ambassador: 3,
};

export function officeWeights(office: OfficeRef | null): Record<string, number> {
  switch (office?.type) {
    case 'President':
    case 'VicePresident':
      return { admin: 2, legislative: 1, judicial: 0.5, military: 1, governing: 1, backroom: 1 };
    case 'ChiefJustice':
    case 'AssociateJustice':
      return { admin: 0.5, legislative: 0.5, judicial: 3, military: 0, governing: 0.5, backroom: 0.5 };
    case 'GeneralInChief':
    case 'Admiral':
      return { admin: 1, legislative: 0, judicial: 0, military: 3, governing: 0, backroom: 0.5 };
    case 'Senator':
    case 'SpeakerOfHouse':
    case 'SenateProTem':
    case 'Representative':
    case 'CommitteeChair':
      return { admin: 0.5, legislative: 2.5, judicial: 0.5, military: 0, governing: 0.5, backroom: 1 };
    case 'Governor':
      return { admin: 1, legislative: 0.5, judicial: 0.5, military: 0.5, governing: 2.5, backroom: 1 };
    case 'SecretaryOfState':
    case 'SecretaryOfTreasury':
    case 'SecretaryOfWar':
    case 'AttorneyGeneral':
    case 'PostmasterGeneral':
    case 'KeyAdvisor':
    case 'Ambassador':
      return { admin: 2.5, legislative: 0.5, judicial: 0.5, military: 0.5, governing: 0.5, backroom: 1 };
    default:
      return { admin: 1, legislative: 1, judicial: 1, military: 1, governing: 1, backroom: 1 };
  }
}

export function computePV(p: Politician): number {
  const weights = officeWeights(p.currentOffice);
  let total = 0;
  for (const k of Object.keys(p.skills) as (keyof typeof p.skills)[]) {
    total += p.skills[k] * (weights[k] ?? 1);
  }
  total *= 4; // bring 0-30 weighted skill range up to 0-120
  total += p.command * 10;
  for (const t of p.traits) {
    if (POSITIVE.includes(t)) total += 4;
    else if (NEGATIVE.includes(t)) total -= 5;
  }
  if (p.isKingmaker) total += 6;
  if (p.currentOffice) {
    total += OFFICE_PRESTIGE[p.currentOffice.type] ?? 0;
  }
  // age penalty over 70
  if (p.age > 70) total -= (p.age - 70) * 1.5;
  if (p.age < 30) total -= (30 - p.age) * 0.8;
  total -= p.flipFlopperPenalty * 5;
  return Math.max(0, Math.round(total));
}

export function refreshPv(politicians: Politician[]): Politician[] {
  return politicians.map((p) => ({ ...p, pvCache: computePV(p) }));
}
