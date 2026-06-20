import type { FullGameSnapshot, HalfTermSummary, DeathCause, RetireCause, PhaseId } from '../types';

// Returns the active (open) summary, or null if none. A summary is "open"
// when startYear === current game.year AND endYear === startYear (close stamps
// endYear in 2.10, but for our purposes the head-of-list with matching startYear
// is the active one — close runs once at 2.10 then a new summary opens next turn).
export function activeSummary(snap: FullGameSnapshot): HalfTermSummary | null {
  const arr = snap.game.halfTermSummaries;
  if (!arr || arr.length === 0) return null;
  const head = arr[arr.length - 1];
  if (head.startYear !== snap.game.year) return null;
  return head;
}

// Idempotent. Called at the top of runCurrentPhase BEFORE the phase switch.
// If there is no active summary for the current game.year, opens a new one
// and pushes onto snap.game.halfTermSummaries.
export function openSummaryIfNeeded(snap: FullGameSnapshot): void {
  if (!snap.game.halfTermSummaries) snap.game.halfTermSummaries = [];
  const arr = snap.game.halfTermSummaries;
  const head = arr.length > 0 ? arr[arr.length - 1] : null;
  if (head && head.startYear === snap.game.year) return;
  const factionSizes: Record<string, number> = {};
  for (const f of snap.factions) factionSizes[f.id] = 0;
  for (const p of snap.politicians) {
    if (!p.deathYear && !p.retiredYear && p.factionId) {
      factionSizes[p.factionId] = (factionSizes[p.factionId] ?? 0) + 1;
    }
  }
  const pvSnapshot: Record<string, number> = {};
  for (const p of snap.politicians) {
    if (!p.deathYear && !p.retiredYear) pvSnapshot[p.id] = p.pvCache;
  }
  arr.push({
    startYear: snap.game.year,
    endYear: snap.game.year,
    metersStart: { ...snap.game.meters },
    metersEnd: { ...snap.game.meters },
    factionSizesStart: factionSizes,
    factionSizesEnd: { ...factionSizes },
    pvSnapshotStart: pvSnapshot,
    deaths: [],
    retirements: [],
    billsPassed: [],
    billsFailed: [],
    eraEventsResolved: [],
    milestones: [],
  });
}

// Called by runPhase_2_10_End. Stamps endYear, metersEnd, factionSizesEnd.
export function closeSummary(snap: FullGameSnapshot): void {
  const s = activeSummary(snap);
  if (!s) return;
  s.endYear = snap.game.year;
  s.metersEnd = { ...snap.game.meters };
  const factionSizes: Record<string, number> = {};
  for (const f of snap.factions) factionSizes[f.id] = 0;
  for (const p of snap.politicians) {
    if (!p.deathYear && !p.retiredYear && p.factionId) {
      factionSizes[p.factionId] = (factionSizes[p.factionId] ?? 0) + 1;
    }
  }
  s.factionSizesEnd = factionSizes;
}

function officeStringFor(snap: FullGameSnapshot, politicianId: string): string | undefined {
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p || !p.currentOffice) return undefined;
  const o = p.currentOffice;
  if (o.stateId) return `${o.type} (${o.stateId.toUpperCase()})`;
  return o.type;
}

export function recordDeath(snap: FullGameSnapshot, politicianId: string, cause: DeathCause): void {
  const s = activeSummary(snap);
  if (!s) return;
  s.deaths.push({
    politicianId,
    year: snap.game.year,
    cause,
    office: officeStringFor(snap, politicianId),
  });
}

export function recordRetirement(snap: FullGameSnapshot, politicianId: string, cause: RetireCause): void {
  const s = activeSummary(snap);
  if (!s) return;
  s.retirements.push({
    politicianId,
    year: snap.game.year,
    cause,
    office: officeStringFor(snap, politicianId),
  });
}

export function recordBillPassed(snap: FullGameSnapshot, billId: string): void {
  const s = activeSummary(snap);
  if (!s) return;
  s.billsPassed.push(billId);
}

export function recordBillFailed(snap: FullGameSnapshot, billId: string): void {
  const s = activeSummary(snap);
  if (!s) return;
  s.billsFailed.push(billId);
}

export function recordEraEvent(
  snap: FullGameSnapshot,
  eraEventId: string,
  templateId: string | undefined,
  aiResolved: boolean,
  chosenResponseId: string,
): void {
  const s = activeSummary(snap);
  if (!s) return;
  s.eraEventsResolved.push({ eraEventId, templateId, aiResolved, chosenResponseId });
}

export function recordMilestone(snap: FullGameSnapshot, phase: PhaseId, text: string): void {
  const s = activeSummary(snap);
  if (!s) return;
  s.milestones.push({ phase, text });
}
