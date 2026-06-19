import type { FullGameSnapshot, Politician, State } from '../types';
import { IDEOLOGY_ORDER } from '../types';
import { addLog } from './log';
import { chance, pick } from '../rng';
import { ensureCC } from './continentalCongress';

// ============================================================================
// First Continental Congress builder (phase 2.9.6, 1772 scenario only).
//
// Pure helpers + one mutating commit. The phase runner walks colonies in
// alphabetical-by-abbr order, returning needsPlayer for the player's faction
// and inlining AI picks otherwise. See docs/specs/first-continental-congress.md
// for the binding acceptance criteria.
// ============================================================================

// Period-correct selecting-body labels per AC #19. Surfaced in the page header
// beneath the colony name. The Georgia label carries the abstraction caveat at
// the per-colony level in addition to the roster footnote.
const SELECTING_BODY_LABELS: Record<string, string> = {
  nh: 'The New Hampshire town deputies select...',
  ma: 'The Massachusetts House of Representatives, meeting at Salem, selects...',
  ri: 'The Rhode Island General Assembly selects...',
  ct: 'The Connecticut House of Representatives selects...',
  ny: 'The New York city and county committees select...',
  nj: 'The New Jersey provincial committee selects...',
  pa: 'The Pennsylvania Assembly selects...',
  de: 'The Delaware county assemblies select...',
  md: 'The Maryland county-committee convention at Annapolis selects...',
  va: 'The First Virginia Convention selects...',
  nc: 'The First North Carolina Provincial Congress at New Bern selects...',
  sc: 'The South Carolina general meeting at Charleston selects...',
  ga: 'The Georgia provincial meeting selects... (game-mechanic abstraction)',
};

export function selectingBodyLabel(stateId: string): string {
  return SELECTING_BODY_LABELS[stateId] ?? `The ${stateId.toUpperCase()} assembly selects...`;
}

// AC #1, #2. The phase 2.9.6 gate: 1772 scenario, year >= 1774, intolerable_acts
// resolved, and the resolved response chose 'ok' ("Convene CC").
export function cc1774GateMet(snap: FullGameSnapshot): boolean {
  const g = snap.game;
  if (g.scenarioId !== '1772') return false;
  if (g.year < 1774) return false;
  if (!g.eraEventsCompleted.includes('intolerable_acts')) return false;
  const intolerable = g.pendingEraEvents.find(
    (e) => e.templateId === 'intolerable_acts' && e.resolved,
  );
  if (!intolerable || intolerable.chosenResponseId !== 'ok') return false;
  return true;
}

// AC #5, #6. Alphabetical-by-abbr colony order. Deterministic.
export function colonyOrder1774(snap: FullGameSnapshot): State[] {
  return [...snap.states]
    .filter((s) => s.isColony !== false)
    .sort((a, b) => a.abbr.localeCompare(b.abbr));
}

// AC #7-9. Selecting faction = most living politicians in colony; tiebreaker
// is aggregate `pvCache` of the tied factions' colony politicians.
export function selectingFactionFor(
  snap: FullGameSnapshot,
  state: State,
): { factionId: string; tiebreakerNote?: string } {
  const inState = snap.politicians.filter(
    (p) => p.state === state.id && p.factionId && !p.deathYear && !p.retiredYear,
  );
  const counts = new Map<string, Politician[]>();
  for (const p of inState) {
    const arr = counts.get(p.factionId!) ?? [];
    arr.push(p);
    counts.set(p.factionId!, arr);
  }
  if (counts.size === 0) {
    // No-one in the colony — default to the player faction so the page can
    // still render a header. Phase runner handles 0-eligible separately.
    return { factionId: snap.game.playerFactionId };
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1].length - a[1].length);
  const top = ranked[0][1].length;
  const tied = ranked.filter(([, arr]) => arr.length === top);
  if (tied.length === 1) return { factionId: tied[0][0] };
  // Aggregate-state-PV tiebreaker.
  const sums = tied.map(([f, arr]) => ({
    f,
    sum: arr.reduce((s, p) => s + p.pvCache, 0),
  }));
  sums.sort((a, b) => b.sum - a.sum);
  return { factionId: sums[0].f, tiebreakerNote: 'tied; aggregate state PV broke the tie' };
}

// AC #7-8. Eligibility pool with fallback. De-dupes against already-seated.
export function eligiblePoolFor(
  snap: FullGameSnapshot,
  state: State,
  alreadySeated: Set<string>,
): Politician[] {
  const alive = snap.politicians.filter(
    (p) =>
      p.state === state.id
      && p.factionId
      && !p.deathYear
      && !p.retiredYear
      && !alreadySeated.has(p.id),
  );
  const slots = state.ccDelegateSlots ?? 2;
  const primary = alive.filter((p) => p.skills.legislative >= 1);
  if (primary.length >= slots) return primary;
  // Fallback: any alive state politician.
  return alive;
}

// AC #16. Used by aiPickDelegate to skip over heavily invested politicians.
export function applyAIDeclineRule(p: Politician): boolean {
  return p.careerTrack != null && p.careerTrackYears >= 4;
}

function ideologyDistance(a: Politician['ideology'], b: Politician['ideology']): number {
  return Math.abs(IDEOLOGY_ORDER.indexOf(a) - IDEOLOGY_ORDER.indexOf(b));
}

// Map a faction `personality` band to its center-of-mass ideology for distance
// math. LW -> Progressive (idx 1), Center -> Moderate (idx 3), RW -> Traditionalist (idx 5).
function personalityIdeology(personality: 'LW' | 'Center' | 'RW'): Politician['ideology'] {
  if (personality === 'LW') return 'Progressive';
  if (personality === 'RW') return 'Traditionalist';
  return 'Moderate';
}

// AC #14, #15, #16. AI walks T1 -> T2 -> T3, applies 12% wild-card, applies
// deterministic decline for careerTrackYears >= 4.
export function aiPickDelegate(
  snap: FullGameSnapshot,
  _state: State,
  pool: Politician[],
  selectingFactionId: string,
  _alreadySeated: Set<string>,
): { politicianId: string; tier: 'T1' | 'T2' | 'T3' | 'Wild' } | null {
  const selectingFaction = snap.factions.find((f) => f.id === selectingFactionId);
  if (!selectingFaction) return null;
  const usable = pool.filter((p) => !applyAIDeclineRule(p));
  // If every pool member is heavily career-track-invested, the spec says the AI
  // reluctantly serves the lowest-invested politician (edge case 2).
  const candidates = usable.length > 0 ? usable : pool;
  if (candidates.length === 0) return null;

  // Tier classifiers.
  const t1 = candidates.filter((p) => p.factionId === selectingFactionId);
  const t2 = candidates.filter(
    (p) => p.factionId !== selectingFactionId && p.partyId === selectingFaction.partyId,
  );
  const center = personalityIdeology(selectingFaction.personality);
  const t3 = candidates.filter(
    (p) =>
      p.partyId !== selectingFaction.partyId && ideologyDistance(p.ideology, center) <= 2,
  );

  // Wild-card per AC #15. Roll once per slot; on fire pick anyone outside the
  // deterministic tier that would otherwise win.
  if (chance(0.12)) {
    const deterministicTierSet = new Set<string>(
      (t1.length > 0 ? t1 : t2.length > 0 ? t2 : t3).map((p) => p.id),
    );
    const wildcards = candidates.filter((p) => !deterministicTierSet.has(p.id));
    if (wildcards.length > 0) {
      const chosen = pick(wildcards);
      return { politicianId: chosen.id, tier: 'Wild' };
    }
  }

  if (t1.length > 0) {
    const sorted = [...t1].sort((a, b) => b.pvCache - a.pvCache);
    return { politicianId: sorted[0].id, tier: 'T1' };
  }
  if (t2.length > 0) {
    const sorted = [...t2].sort((a, b) => {
      const di = ideologyDistance(a.ideology, center) - ideologyDistance(b.ideology, center);
      if (di !== 0) return di;
      return b.pvCache - a.pvCache;
    });
    return { politicianId: sorted[0].id, tier: 'T2' };
  }
  if (t3.length > 0) {
    const sorted = [...t3].sort((a, b) => {
      const di = ideologyDistance(a.ideology, center) - ideologyDistance(b.ideology, center);
      if (di !== 0) return di;
      return b.pvCache - a.pvCache;
    });
    return { politicianId: sorted[0].id, tier: 'T3' };
  }

  // No tier match — last-resort pick by PV from anyone left.
  const sorted = [...candidates].sort((a, b) => b.pvCache - a.pvCache);
  return { politicianId: sorted[0].id, tier: 'T3' };
}

// MUTATING. Appends to cc.delegates, clears careerTrack/careerTrackYears
// on the politician (AC #12), logs per AC #24, advances the cursor.
export function commitDelegate(
  snap: FullGameSnapshot,
  stateId: string,
  politicianId: string,
  tier: 'T1' | 'T2' | 'T3' | 'Wild' | 'Player',
  selectingFactionId: string,
): void {
  const cc = ensureCC(snap);
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p) return;
  // De-dupe (impossible by construction but defensive).
  if (cc.delegates.find((d) => d.politicianId === politicianId)) return;
  // AC #12. Career-track reset on acceptance.
  if (p.careerTrack != null) {
    p.careerTrack = null;
    p.careerTrackYears = 0;
  }
  cc.delegates.push({
    stateId,
    politicianId,
    factionId: selectingFactionId,
    tier,
  });
  const state = snap.states.find((s) => s.id === stateId);
  const faction = snap.factions.find((f) => f.id === selectingFactionId);
  const abbr = state?.abbr ?? stateId.toUpperCase();
  const fname = faction?.name ?? selectingFactionId;
  addLog(
    snap,
    '2.9.6',
    'appointment',
    `${p.firstName} ${p.lastName} (${abbr}, ${fname}) seated to the First Continental Congress.`,
    tier === 'Player' ? undefined : { tier },
  );
  // Advance cursor slot.
  const cur = snap.game.ccBuilderCursor;
  if (cur) cur.slotIdx += 1;
}
