import type { State } from '../types';

// 13 colonies as of 1772. Bias is loosely Patriot (Blue) vs Loyalist (Red).
// ccDelegateSlots and colonySize per spec.
type ColonySeed = Omit<State, 'governorId' | 'senators' | 'representativeIds'>;

export const COLONIES_1772: ColonySeed[] = [
  { id: 'nh', name: 'New Hampshire', abbr: 'NH', region: 'Northeast', electoralVotes: 0, bias: 0.0, industries: { fishing: 3, lumber: 3 }, isSlaveState: false, admissionYear: 1788, isColony: true, colonySize: 'small', ccDelegateSlots: 2 },
  { id: 'ma', name: 'Massachusetts', abbr: 'MA', region: 'Northeast', electoralVotes: 0, bias: 1.5, industries: { fishing: 4, manufacturing: 3, shipping: 4 }, isSlaveState: false, admissionYear: 1788, isColony: true, colonySize: 'large', ccDelegateSlots: 4 },
  { id: 'ri', name: 'Rhode Island', abbr: 'RI', region: 'Northeast', electoralVotes: 0, bias: 1.0, industries: { manufacturing: 2, shipping: 3 }, isSlaveState: false, admissionYear: 1790, isColony: true, colonySize: 'small', ccDelegateSlots: 2 },
  { id: 'ct', name: 'Connecticut', abbr: 'CT', region: 'Northeast', electoralVotes: 0, bias: 0.5, industries: { manufacturing: 2, shipping: 2 }, isSlaveState: false, admissionYear: 1788, isColony: true, colonySize: 'medium', ccDelegateSlots: 3 },
  { id: 'ny', name: 'New York', abbr: 'NY', region: 'Northeast', electoralVotes: 0, bias: -0.5, industries: { shipping: 4, manufacturing: 3, finance: 3 }, isSlaveState: true, admissionYear: 1788, isColony: true, colonySize: 'medium', ccDelegateSlots: 3 },
  { id: 'nj', name: 'New Jersey', abbr: 'NJ', region: 'Northeast', electoralVotes: 0, bias: 0.0, industries: { agriculture: 3 }, isSlaveState: true, admissionYear: 1787, isColony: true, colonySize: 'medium', ccDelegateSlots: 3 },
  { id: 'pa', name: 'Pennsylvania', abbr: 'PA', region: 'Northeast', electoralVotes: 0, bias: 0.5, industries: { manufacturing: 3, agriculture: 3, shipping: 3 }, isSlaveState: true, admissionYear: 1787, isColony: true, colonySize: 'large', ccDelegateSlots: 4 },
  { id: 'de', name: 'Delaware', abbr: 'DE', region: 'Border', electoralVotes: 0, bias: 0.0, industries: { agriculture: 3 }, isSlaveState: true, admissionYear: 1787, isColony: true, colonySize: 'small', ccDelegateSlots: 2 },
  { id: 'md', name: 'Maryland', abbr: 'MD', region: 'Border', electoralVotes: 0, bias: -0.5, industries: { agriculture: 3, tobacco: 3 }, isSlaveState: true, admissionYear: 1788, isColony: true, colonySize: 'large', ccDelegateSlots: 4 },
  { id: 'va', name: 'Virginia', abbr: 'VA', region: 'South', electoralVotes: 0, bias: 0.0, industries: { agriculture: 4, tobacco: 4 }, isSlaveState: true, admissionYear: 1788, isColony: true, colonySize: 'large', ccDelegateSlots: 4 },
  { id: 'nc', name: 'North Carolina', abbr: 'NC', region: 'South', electoralVotes: 0, bias: -0.5, industries: { agriculture: 4, tobacco: 2 }, isSlaveState: true, admissionYear: 1789, isColony: true, colonySize: 'medium', ccDelegateSlots: 3 },
  { id: 'sc', name: 'South Carolina', abbr: 'SC', region: 'South', electoralVotes: 0, bias: -1.0, industries: { agriculture: 4, cotton: 3, shipping: 2 }, isSlaveState: true, admissionYear: 1788, isColony: true, colonySize: 'medium', ccDelegateSlots: 3 },
  { id: 'ga', name: 'Georgia', abbr: 'GA', region: 'South', electoralVotes: 0, bias: -1.5, industries: { agriculture: 3 }, isSlaveState: true, admissionYear: 1788, isColony: true, colonySize: 'small', ccDelegateSlots: 2 },
];
