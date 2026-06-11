import { Dashboard } from './Dashboard';
import { Roster } from './Roster';
import { CareerTracks } from './CareerTracks';
import { Relocations } from './Relocations';
import { Kingmakers } from './Kingmakers';
import { FactionLeaderPage } from './FactionLeaderPage';
import { CabinetPage } from './CabinetPage';
import { CongressPage } from './CongressPage';
import { CourtPage } from './CourtPage';
import { GovernorsPage } from './GovernorsPage';
import { MetersPage } from './MetersPage';
import { StatesPage } from './StatesPage';
import { InterestGroupsPage } from './InterestGroupsPage';
import { EnthusiasmPage } from './EnthusiasmPage';
import { DiplomacyPage } from './DiplomacyPage';
import { LegislationPage } from './LegislationPage';
import { ElectionsPage } from './ElectionsPage';
import { FactionsPage } from './FactionsPage';
import { EventLog } from './EventLog';
import { WarsPage } from './WarsPage';
import { SettingsPage } from './SettingsPage';
import { ContinentalCongressPage } from './ContinentalCongressPage';
import { RevWarDashboard } from './RevWarDashboard';
import { Draft } from './Draft';
import { DraftScouting } from './DraftScouting';
import { DraftHistory } from './DraftHistory';
import { TerritoriesPage } from './TerritoriesPage';

export type PageId =
  | 'dashboard'
  | 'roster'
  | 'careers'
  | 'relocations'
  | 'kingmakers'
  | 'factionLeader'
  | 'cabinet'
  | 'congress'
  | 'court'
  | 'governors'
  | 'meters'
  | 'states'
  | 'interestGroups'
  | 'enthusiasm'
  | 'diplomacy'
  | 'legislation'
  | 'elections'
  | 'factions'
  | 'eventLog'
  | 'wars'
  | 'settings'
  | 'continentalCongress'
  | 'revWar'
  | 'draft'
  | 'draftScouting'
  | 'draftHistory'
  | 'territories';

export const Pages: Record<PageId, () => JSX.Element> = {
  dashboard: Dashboard,
  roster: Roster,
  careers: CareerTracks,
  relocations: Relocations,
  kingmakers: Kingmakers,
  factionLeader: FactionLeaderPage,
  cabinet: CabinetPage,
  congress: CongressPage,
  court: CourtPage,
  governors: GovernorsPage,
  meters: MetersPage,
  states: StatesPage,
  interestGroups: InterestGroupsPage,
  enthusiasm: EnthusiasmPage,
  diplomacy: DiplomacyPage,
  legislation: LegislationPage,
  elections: ElectionsPage,
  factions: FactionsPage,
  eventLog: EventLog,
  wars: WarsPage,
  settings: SettingsPage,
  continentalCongress: ContinentalCongressPage,
  revWar: RevWarDashboard,
  draft: Draft,
  draftScouting: DraftScouting,
  draftHistory: DraftHistory,
  territories: TerritoriesPage,
};
