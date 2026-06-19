import type { FullGameSnapshot, PhaseId, Politician, EraEvent, Legislation, ElectionResult, NationalMeters, Ideology, PartyId, SkillKey, Trait, CareerTrack, State, RelocationEntry, RelocationBand, IdeologyShiftEntry, ConversionEntry, KingmakerEntry, FactionAlignmentDriftEntry, FactionLeadershipEntry, InterestCardId, LobbyCardId, IdeologyCardId, Era } from '../types';
import { IDEOLOGY_ORDER, SKILLS, POSITIVE_TRAITS, TRACK_SKILL, TRACK_THEMED_TRAITS, CAREER_RANDOM_NEGATIVES, CAREER_ODDS, CAREER_TRACK_MAX_YEARS, CAREER_TRACK_CAP, CAREER_GAINS_CAP, RELOCATION_ODDS, RELOCATION_ATTEMPTS_PER_TURN, RELOCATIONS_CAP, CARPETBAGGER_LADDER, IDEOLOGY_SHIFT_ODDS, IDEOLOGY_ATTEMPTS_PER_TURN, IDEOLOGY_SHIFTS_CAP, CONVERSION_ODDS, CONVERSION_ATTEMPTS_PER_TURN, CONVERSIONS_CAP, KINGMAKER_RULES, KINGMAKERS_CAP, ALIGNMENT_RULES, ALIGNMENT_DRIFT_CAP, LEADERSHIP_RULES, LEADERSHIP_FEED_CAP, MORTALITY_RULES, ANYTIME_EVENTS_RULES } from '../types';
import { addLog } from './log';
import { uid, chance, d100, pick, pickWeighted, clamp, shuffle, rand } from '../rng';
import { refreshPv } from '../pv';
import { ANYTIME_EVENT_TEMPLATES, type AnytimeEventTemplate } from '../data/anytimeEvents';
import { ANYTIME_NATIONAL_TEMPLATES, type AnytimeNationalTemplate } from '../data/anytimeNationalEvents';
import { buildEraEventsForYear } from '../data/eraEvents1856';
import { FACTIONS_1772 } from '../data/factions1772';
import { selectEraGraphNode, pickAIResponse, isAutoResolved, validate as validateEraGraph } from './eraGraph';
import { admitState } from './territories';
import { appointDelegates, electCCPresident, appointCCCommittees, generateCCBills, voteCC, CC_TERM_YEARS, numberToOrdinal, ensureCC } from './continentalCongress';
import { cc1774GateMet, colonyOrder1774, selectingFactionFor, eligiblePoolFor, aiPickDelegate, commitDelegate } from './firstContinentalCongress';
import { startRevWar, runRevWarBattles, applyTreatyOfParis, applyFrenchAlliance } from './revolutionaryWar';
import { makeConvention } from './constitutionalConvention';
import { instantiateDraftees } from '../data/draftImport';
import { STANDARD_DRAFT_CLASSES } from '../data/standardDraftClasses';

// ============================================================================
// 2.1.1 Draft
// ============================================================================
function getEligibleIdeologies(factionId: string): Ideology[] | null {
  const f = FACTIONS_1772.find((x) => x.id === factionId);
  return f?.eligibleIdeologies ?? null;
}

function pickBestForFaction(snap: FullGameSnapshot, factionId: string): Politician | null {
  const eligible = snap.politicians.filter((p) => snap.game.pendingDraftPool.includes(p.id));
  if (eligible.length === 0) return null;
  const faction = snap.factions.find((f) => f.id === factionId);
  if (!faction) return null;
  const isExpansion1772 = snap.game.scenarioId === '1772' && snap.game.year === snap.game.startYear;
  const eligIdeos = isExpansion1772 ? getEligibleIdeologies(factionId) : null;
  let pool = eligible;
  if (eligIdeos) {
    const strict = eligible.filter((p) => eligIdeos.includes(p.ideology));
    pool = strict.length > 0 ? strict : eligible;
  }
  const scored = pool.map((p) => {
    const ideoMatch = faction.personality === 'LW' ? (p.ideology === 'LW Populist' || p.ideology === 'Progressive' || p.ideology === 'Liberal') :
      faction.personality === 'RW' ? (p.ideology === 'Conservative' || p.ideology === 'Traditionalist' || p.ideology === 'RW Populist') :
      (p.ideology === 'Moderate' || p.ideology === 'Liberal' || p.ideology === 'Conservative');
    return { p, score: p.pvCache + (ideoMatch ? 25 : 0) + (eligIdeos?.includes(p.ideology) ? 50 : 0) };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].p;
}

function recordDraftPick(snap: FullGameSnapshot, factionId: string, politicianId: string): void {
  const faction = snap.factions.find((f) => f.id === factionId);
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!faction || !p) return;
  p.factionId = faction.id;
  p.partyId = faction.partyId;
  p.draftedYear = snap.game.year;
  snap.game.pendingDraftPool = snap.game.pendingDraftPool.filter((id) => id !== p.id);
  snap.game.draftRoundOrder.shift();
  addLog(snap, '2.1.1', 'draft', `${faction.name} drafted ${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, ${p.ideology}, PV ${p.pvCache}).`);
  if (!snap.game.draftHistory) snap.game.draftHistory = [];
  let yearEntry = snap.game.draftHistory.find((y) => y.year === snap.game.year);
  if (!yearEntry) {
    yearEntry = { year: snap.game.year, picks: [] };
    snap.game.draftHistory.push(yearEntry);
  }
  const pickNumber = yearEntry.picks.length + 1;
  const factionCount = Math.max(1, snap.factions.length);
  const round = Math.ceil(pickNumber / factionCount);
  yearEntry.picks.push({ pickNumber, round, factionId, politicianId });
}

export function simOneDraftPick(snap: FullGameSnapshot): { needsPlayer: boolean } {
  if (snap.game.draftRoundOrder.length === 0) return { needsPlayer: false };
  const eligible = snap.politicians.filter((p) => snap.game.pendingDraftPool.includes(p.id));
  if (eligible.length === 0) {
    const dropped = snap.game.draftRoundOrder.length;
    snap.game.draftRoundOrder = [];
    snap.game.pendingDraftPool = [];
    if (dropped > 0) addLog(snap, '2.1.1', 'draft', `Draft pool exhausted; ${dropped} scheduled picks skipped.`);
    snap.game.lastDraftYear = snap.game.year;
    return { needsPlayer: false };
  }
  const factionId = snap.game.draftRoundOrder[0];
  if (factionId === snap.game.playerFactionId) return { needsPlayer: true };
  const picked = pickBestForFaction(snap, factionId);
  if (!picked) return { needsPlayer: false };
  recordDraftPick(snap, factionId, picked.id);
  if (snap.game.draftRoundOrder.length === 0) snap.game.lastDraftYear = snap.game.year;
  return { needsPlayer: false };
}

export function autoPickForPlayer(snap: FullGameSnapshot): { needsPlayer: boolean } {
  if (snap.game.draftRoundOrder.length === 0) return { needsPlayer: false };
  const factionId = snap.game.draftRoundOrder[0];
  const picked = pickBestForFaction(snap, factionId);
  if (!picked) return { needsPlayer: false };
  recordDraftPick(snap, factionId, picked.id);
  if (snap.game.draftRoundOrder.length === 0) snap.game.lastDraftYear = snap.game.year;
  return { needsPlayer: false };
}

export function runPhase_2_1_1_Draft(snap: FullGameSnapshot, autoOnly: boolean): { needsPlayer: boolean; draftPool: Politician[] } {
  const isExpansion1772 = snap.game.scenarioId === '1772' && snap.game.year === snap.game.startYear;

  // 1772 inaugural draft is CSV-driven: merge the dataset's start-year class
  // (user import takes precedence over the bundled standard) into the filler
  // bench, then rebuild the snake order over the full pool. Done once.
  if (isExpansion1772 && !snap.game.inauguralDraftSeeded) {
    const userClass = (snap.game.customDraftClasses ?? []).filter((d) => d.draftYear === snap.game.year);
    const source = userClass.length > 0 ? (snap.game.customDraftClasses ?? []) : STANDARD_DRAFT_CLASSES;
    const validStateIds = new Set(snap.states.map((s) => s.id));
    const imported = instantiateDraftees(source, snap.game.year, validStateIds);
    if (imported.length > 0) {
      snap.politicians.push(...imported);
      snap.politicians = refreshPv(snap.politicians);
      snap.game.pendingDraftPool = [...snap.game.pendingDraftPool, ...imported.map((p) => p.id)];
      const factionPvSum = snap.factions.map((f) => ({
        id: f.id,
        sum: snap.politicians.filter((p) => p.factionId === f.id).reduce((s, p) => s + p.pvCache, 0),
      }));
      factionPvSum.sort((a, b) => a.sum - b.sum);
      const order = factionPvSum.map((x) => x.id);
      const rounds = Math.max(2, Math.ceil(snap.game.pendingDraftPool.length / Math.max(1, snap.factions.length)));
      snap.game.draftRoundOrder = [];
      for (let r = 0; r < rounds; r++) {
        snap.game.draftRoundOrder.push(...(r % 2 === 0 ? order : [...order].reverse()));
      }
      addLog(snap, '2.1.1', 'draft', `Inaugural draft class (${userClass.length > 0 ? 'imported' : 'standard'}): ${imported.length} historical figures entered the pool.`);
    }
    snap.game.inauguralDraftSeeded = true;
  }

  // Don't rebuild if we already drafted this year — the runner empties the pool
  // and order on completion (lines below), so without this gate the next call
  // (advance → runCurrentPhase) loops the player back into a fresh draft.
  const alreadyDraftedThisYear = snap.game.lastDraftYear === snap.game.year;
  if (snap.game.pendingDraftPool.length === 0 && !isExpansion1772 && !alreadyDraftedThisYear) {
    // Source precedence for this year's class:
    //   1. player's per-game imported dataset (Settings)
    //   2. the bundled standard classes shipped with the game
    //   3. random rookie generation
    const userClass = (snap.game.customDraftClasses ?? []).filter((d) => d.draftYear === snap.game.year);
    const effectiveSource = userClass.length > 0
      ? (snap.game.customDraftClasses ?? [])
      : STANDARD_DRAFT_CLASSES;
    const custom = effectiveSource.filter((d) => d.draftYear === snap.game.year);
    if (custom.length > 0) {
      const validStateIds = new Set(snap.states.map((s) => s.id));
      const imported = instantiateDraftees(effectiveSource, snap.game.year, validStateIds);
      const heldBack = custom.length - imported.length;
      if (heldBack > 0) {
        addLog(snap, '2.1.1', 'draft', `${heldBack} draftee(s) held back — their home state is not yet part of the Union.`);
      }
      snap.politicians.push(...imported);
      snap.politicians = refreshPv(snap.politicians);
      snap.game.pendingDraftPool = imported.map((p) => p.id);
      const factionPvSum = snap.factions.map((f) => ({
        id: f.id,
        sum: snap.politicians.filter((p) => p.factionId === f.id).reduce((s, p) => s + p.pvCache, 0),
      }));
      factionPvSum.sort((a, b) => a.sum - b.sum);
      const order = factionPvSum.map((x) => x.id);
      // Enough snake rounds to drain the imported class
      const rounds = Math.max(2, Math.ceil(imported.length / Math.max(1, snap.factions.length)));
      snap.game.draftRoundOrder = [];
      for (let r = 0; r < rounds; r++) {
        snap.game.draftRoundOrder.push(...(r % 2 === 0 ? order : [...order].reverse()));
      }
      const sourceLabel = userClass.length > 0 ? 'imported' : 'standard';
      addLog(snap, '2.1.1', 'draft', `${sourceLabel === 'imported' ? 'Imported' : 'Standard'} draft class for ${snap.game.year}: ${imported.length} politicians entered the pool.`);
    } else {
    // Generate new rookie pool
    const pool: Politician[] = [];
    const stateIds = snap.states.map((s) => s.id);
    const ideologies: Ideology[] = ['LW Populist', 'Progressive', 'Liberal', 'Moderate', 'Conservative', 'Traditionalist', 'RW Populist'];
    const firsts = ['John', 'James', 'William', 'Henry', 'Charles', 'Robert', 'Edward', 'Thomas', 'Samuel', 'Francis', 'George', 'Joseph', 'Frank', 'Alfred', 'Stephen'];
    const lasts = ['Hughes', 'Carter', 'Beecher', 'Howard', 'Dawes', 'Logan', 'Sherman', 'Cooke', 'Pendleton', 'Reid', 'Ferry', 'Boutwell', 'Conkling', 'Morton', 'Frye'];
    const factions = snap.factions;
    const draftSize = factions.length * 2; // 20 rookies
    for (let i = 0; i < draftSize; i++) {
      const ideo = pick(ideologies);
      const skills = {
        admin: Math.floor(Math.random() * 2),
        legislative: Math.floor(Math.random() * 2),
        judicial: Math.floor(Math.random() * 2),
        military: Math.floor(Math.random() * 2),
        governing: Math.floor(Math.random() * 2),
        backroom: Math.floor(Math.random() * 2),
      };
      // boost one skill randomly
      const boost = pick(['admin', 'legislative', 'judicial', 'military', 'governing', 'backroom'] as const);
      skills[boost] = 2 + Math.floor(Math.random() * 2);
      const age = 28 + Math.floor(Math.random() * 12);
      const p: Politician = {
        id: uid('pol'),
        firstName: pick(firsts),
        lastName: pick(lasts),
        state: pick(stateIds),
        factionId: null,
        partyId: null,
        ideology: ideo,
        age,
        birthYear: snap.game.year - age,
        skills,
        traits: chance(0.3) ? [pick(['Charismatic', 'Orator', 'Efficient', 'Reformist', 'Integrity'] as const)] : [],
        currentOffice: null,
        careerTrack: null,
        careerTrackYears: 0,
        command: 0,
        interests: [],
        flipFlopperPenalty: 0,
        pvCache: 0,
        isHistorical: false,
      };
      pool.push(p);
    }
    snap.politicians.push(...pool);
    snap.politicians = refreshPv(snap.politicians);
    snap.game.pendingDraftPool = pool.map((p) => p.id);

    // Snake order: factions ranked by reverse PV-sum
    const factionPvSum = factions.map((f) => ({
      id: f.id,
      sum: snap.politicians.filter((p) => p.factionId === f.id).reduce((s, p) => s + p.pvCache, 0),
    }));
    factionPvSum.sort((a, b) => a.sum - b.sum);
    snap.game.draftRoundOrder = [];
    // 2 rounds
    const order = factionPvSum.map((x) => x.id);
    snap.game.draftRoundOrder = [...order, ...order.slice().reverse()];
    addLog(snap, '2.1.1', 'draft', `Draft pool generated: ${pool.length} rookies. Snake order set.`);
    }
  }
  // Have CPU make picks until it's player's turn (or pool empty)
  while (snap.game.draftRoundOrder.length > 0) {
    const eligible = snap.politicians.filter((p) => snap.game.pendingDraftPool.includes(p.id));
    if (eligible.length === 0) {
      // Pool exhausted — drain remaining scheduled picks and end the draft
      const dropped = snap.game.draftRoundOrder.length;
      snap.game.draftRoundOrder = [];
      snap.game.pendingDraftPool = [];
      if (dropped > 0) addLog(snap, '2.1.1', 'draft', `Draft pool exhausted; ${dropped} scheduled picks skipped.`);
      break;
    }
    const factionId = snap.game.draftRoundOrder[0];
    const isPlayer = factionId === snap.game.playerFactionId;
    if (isPlayer && !autoOnly) {
      return { needsPlayer: true, draftPool: eligible };
    }
    const picked = pickBestForFaction(snap, factionId);
    if (!picked) break;
    recordDraftPick(snap, factionId, picked.id);
  }
  // Pool empty — finalize draft
  snap.game.pendingDraftPool = [];
  snap.game.draftRoundOrder = [];
  snap.game.lastDraftYear = snap.game.year;
  runDraftKingmakerTopUp(snap);
  return { needsPlayer: false, draftPool: [] };
}

export function playerDraftPick(snap: FullGameSnapshot, politicianId: string): void {
  const factionId = snap.game.draftRoundOrder[0];
  if (!factionId || factionId !== snap.game.playerFactionId) return;
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p) return;
  if (!snap.game.pendingDraftPool.includes(p.id)) return;
  recordDraftPick(snap, factionId, politicianId);
}

// ============================================================================
// 2.1.2 Career Tracks (auto-process: CPU assigns; player UI handles theirs)
// ============================================================================
function recordCareerGain(snap: FullGameSnapshot, p: Politician, thresholdYears: number, kind: 'skill' | 'trait', detail: SkillKey | Trait, negative: boolean): void {
  if (!snap.game.careerGains) snap.game.careerGains = [];
  const arr = snap.game.careerGains;
  arr.push({
    year: snap.game.year,
    politicianId: p.id,
    factionId: p.factionId!,
    track: p.careerTrack!,
    thresholdYears,
    kind,
    detail,
    negative,
  });
  if (arr.length > CAREER_GAINS_CAP) arr.splice(0, arr.length - CAREER_GAINS_CAP);
}

// Three independent rolls at a threshold (N = thresholdYears / 4). Pool
// selection happens only on a successful roll; failed/wasted rolls are silent.
function rollThreshold(snap: FullGameSnapshot, p: Politician, thresholdYears: number): void {
  const track = p.careerTrack!;
  const n = thresholdYears / 4;

  // 1. Skill (50%). Private draws a random skill, re-drawing once from the
  // below-cap set if the first draw is capped.
  if (chance(CAREER_ODDS.skill)) {
    let k = TRACK_SKILL[track];
    if (track === 'Private') {
      k = pick(SKILLS);
      if (p.skills[k] >= 5) {
        const below = SKILLS.filter((s) => p.skills[s] < 5);
        k = below.length > 0 ? pick(below) : null;
      }
    }
    if (k && p.skills[k] < 5) {
      p.skills[k] = clamp(p.skills[k] + 1, 0, 5);
      recordCareerGain(snap, p, thresholdYears, 'skill', k, false);
    }
  }

  // 2. Themed trait (rising curve, capped 75%). Filtering out held traits IS
  // the dedup rule — no re-roll loops.
  if (chance(CAREER_ODDS.themedByThreshold[n - 1])) {
    const pool = TRACK_THEMED_TRAITS[track].filter((t) => !p.traits.includes(t));
    if (pool.length > 0) {
      const t = pick(pool);
      p.traits.push(t);
      recordCareerGain(snap, p, thresholdYears, 'trait', t, false);
    }
  }

  // 3. Random off-track trait (flat), 75/25 positive/negative.
  if (chance(CAREER_ODDS.random)) {
    const positive = chance(CAREER_ODDS.randomPositiveShare);
    const pool = positive
      // Ideologue (2.1.5) and Loyal (2.1.6) are seeded by their tick only,
      // never career-gained.
      ? POSITIVE_TRAITS.filter((t) => t !== 'Ideologue' && t !== 'Loyal' && !TRACK_THEMED_TRAITS[track].includes(t) && !p.traits.includes(t))
      : CAREER_RANDOM_NEGATIVES.filter((t) => !p.traits.includes(t));
    if (pool.length > 0) {
      const t = pick(pool);
      p.traits.push(t);
      recordCareerGain(snap, p, thresholdYears, 'trait', t, !positive);
    }
  }
}

// Best-uncapped rule: highest skill below cap, ties broken by SKILLS order
// (stable sort over the SKILLS-ordered list). Skips tracks that are full so
// the CPU falls through to its next-best skill with room.
function bestAvailableTrack(p: Politician, isTrackFull: (t: CareerTrack) => boolean): CareerTrack | null {
  const candidates = SKILLS.filter((k) => p.skills[k] < 5).sort((a, b) => p.skills[b] - p.skills[a]);
  for (const k of candidates) {
    const entry = (Object.entries(TRACK_SKILL) as [CareerTrack, SkillKey | null][]).find(([, s]) => s === k);
    if (entry && !isTrackFull(entry[0])) return entry[0];
  }
  return null;
}

export function runPhase_2_1_2_CareerTracks(snap: FullGameSnapshot): void {
  // Eager init: once a save has run one new-code tick, repair()'s legacy
  // migration (gated on careerGains == null) can never fire again.
  if (!snap.game.careerGains) snap.game.careerGains = [];

  // Per-faction per-track live slot count (alive, not retired). Paused
  // in-office politicians hold their slot.
  const trackCount = new Map<string, number>();
  const slotKey = (fid: string, t: CareerTrack): string => `${fid}:${t}`;
  for (const p of snap.politicians) {
    if (!p.factionId || p.deathYear || p.retiredYear) continue;
    if (p.careerTrack) {
      const k = slotKey(p.factionId, p.careerTrack);
      trackCount.set(k, (trackCount.get(k) ?? 0) + 1);
    }
  }

  // Pass 1 — CPU management. Mid-track CPU politicians are never touched.
  // Cap-aware per track: a full track is skipped and the CPU falls through to
  // the next-best skill with room; legacy-save overflow drains naturally via
  // exhaustion (which always clears).
  for (const p of snap.politicians) {
    if (!p.factionId || p.factionId === snap.game.playerFactionId) continue;
    if (p.deathYear || p.retiredYear || p.currentOffice) continue;
    const fid = p.factionId;
    const isFull = (t: CareerTrack): boolean => (trackCount.get(slotKey(fid, t)) ?? 0) >= CAREER_TRACK_CAP;
    if (p.careerTrack && p.careerTrackYears >= CAREER_TRACK_MAX_YEARS) {
      const oldKey = slotKey(fid, p.careerTrack);
      trackCount.set(oldKey, (trackCount.get(oldKey) ?? 1) - 1);
      p.careerTrack = null;
      p.careerTrackYears = 0;
      if (p.age < 60) {
        const next = bestAvailableTrack(p, isFull);
        if (next) {
          p.careerTrack = next;
          trackCount.set(slotKey(fid, next), (trackCount.get(slotKey(fid, next)) ?? 0) + 1);
        }
      }
    } else if (!p.careerTrack && p.age < 50) {
      const next = bestAvailableTrack(p, isFull);
      if (next) {
        p.careerTrack = next;
        p.careerTrackYears = 0;
        trackCount.set(slotKey(fid, next), (trackCount.get(slotKey(fid, next)) ?? 0) + 1);
      }
    }
  }

  // Pass 2 — accrual + thresholds, all factions (player included). Office
  // pauses accrual but keeps track+years.
  for (const p of snap.politicians) {
    if (!p.careerTrack || !p.factionId) continue;
    if (p.deathYear || p.retiredYear || p.currentOffice) continue;
    p.careerTrackYears += 2;
    if (p.careerTrackYears % 4 === 0 && p.careerTrackYears <= CAREER_TRACK_MAX_YEARS) {
      rollThreshold(snap, p, p.careerTrackYears);
      // Mentor acceleration: LIVE predicate. A mentor who died at last turn's
      // 2.4.1 (NOT yet swept until next turn's 2.1.7) does NOT accelerate —
      // hasMentor requires alive, non-retired, same-faction. Do not optimize
      // into a raw protegeId lookup; the live read is the ordering invariant.
      if (hasMentor(snap, p)) {
        rollMentorBonusSkill(snap, p, p.careerTrackYears);
      }
    }
  }

  snap.politicians = refreshPv(snap.politicians);
}

export function setPlayerCareerTrack(snap: FullGameSnapshot, politicianId: string, track: Politician['careerTrack']): boolean {
  if (snap.game.phaseId !== '2.1.2') return false;
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p || p.factionId !== snap.game.playerFactionId) return false;
  if (p.currentOffice || p.deathYear || p.retiredYear) return false;
  if (track === p.careerTrack) return false; // re-select must not reset the counter
  // Per-track cap: block assignment to a full track (clearing always allowed;
  // the no-op check above means p is never counted on the target track).
  if (track !== null) {
    const onTarget = snap.politicians.filter((pp) =>
      pp.factionId === snap.game.playerFactionId
      && !pp.deathYear && !pp.retiredYear
      && pp.careerTrack === track
    ).length;
    if (onTarget >= CAREER_TRACK_CAP) return false;
  }
  p.careerTrack = track;
  p.careerTrackYears = 0;
  return true;
}

// ============================================================================
// 2.1.3 Flip-Flopper cleanup
// ============================================================================
export function runPhase_2_1_3_FlipFlopper(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (p.flipFlopperPenalty > 0) {
      p.flipFlopperPenalty = Math.max(0, p.flipFlopperPenalty - 1);
    }
  }
  snap.politicians = refreshPv(snap.politicians);
  addLog(snap, '2.1.3', 'system', 'Flip-flopper penalties checked and reduced.');
}

// ============================================================================
// 2.1.4 Relocations (auto)
// ============================================================================
// Lazy year normalization — the only counter accessor. Same-year counts always
// survive (the player's pre-tick attempts already stamped the year).
function attemptCounts(snap: FullGameSnapshot): Record<string, number> {
  const g = snap.game;
  if (!g.relocationAttempts || g.relocationAttempts.year !== g.year) {
    g.relocationAttempts = { year: g.year, counts: {} };
  }
  return g.relocationAttempts.counts;
}

// Shared band/odds math — used by the resolver AND the page picker, so the
// odds displayed are structurally the odds rolled.
export function relocationOdds(p: Politician, from: State, dest: State): { band: RelocationBand; success: number; carpetbagger: number } {
  const sameRegion = from.region === dest.region;
  const isAlt = p.altState === dest.id;
  const band: RelocationBand = sameRegion
    ? (isAlt ? 'sameRegionAlt' : 'sameRegion')
    : (isAlt ? 'crossRegionAlt' : 'crossRegion');
  const carpetBase = sameRegion ? RELOCATION_ODDS.carpetbagger.sameRegion : RELOCATION_ODDS.carpetbagger.crossRegion;
  return {
    band,
    success: RELOCATION_ODDS.success[band],
    carpetbagger: carpetBase * (isAlt ? RELOCATION_ODDS.carpetbagger.altStateFactor : 1),
  };
}

function recordRelocation(snap: FullGameSnapshot, entry: RelocationEntry): void {
  if (!snap.game.relocations) snap.game.relocations = [];
  const arr = snap.game.relocations;
  arr.push(entry);
  if (arr.length > RELOCATIONS_CAP) arr.splice(0, arr.length - RELOCATIONS_CAP);
}

// The single attempt path (CPU and player both come through here).
// Returns null = REJECTED (no attempt happened); non-null = the attempt RAN —
// counter, cooldown, and feed are mutated whether the roll succeeded or not.
function resolveRelocation(snap: FullGameSnapshot, p: Politician, destStateId: string): RelocationEntry | null {
  const g = snap.game;
  if (g.phaseId !== '2.1.4') return null;
  if (p.deathYear || p.retiredYear || p.currentOffice || !p.factionId) return null;
  const from = snap.states.find((s) => s.id === p.state);
  const dest = snap.states.find((s) => s.id === destStateId);
  if (!from || !dest || destStateId === p.state) return null;
  if (p.lastRelocationAttemptYear === g.year) return null;
  const counts = attemptCounts(snap);
  if ((counts[p.factionId] ?? 0) >= RELOCATION_ATTEMPTS_PER_TURN) return null;

  counts[p.factionId] = (counts[p.factionId] ?? 0) + 1;
  p.lastRelocationAttemptYear = g.year;
  const fromState = p.state;

  const { band, success: pS, carpetbagger: pC } = relocationOdds(p, from, dest);
  const success = chance(pS);
  const traitsGained: Trait[] = [];
  if (success) {
    p.state = dest.id;
    if (p.altState === dest.id) p.altState = undefined; // consumed only when used
    if (chance(pC)) {
      const t = CARPETBAGGER_LADDER.find((tr) => !p.traits.includes(tr));
      if (t) {
        p.traits.push(t);
        traitsGained.push(t);
      }
    }
  }

  const entry: RelocationEntry = {
    year: g.year,
    politicianId: p.id,
    factionId: p.factionId,
    fromState,
    toState: dest.id,
    band,
    success,
    traitsGained,
  };
  recordRelocation(snap, entry);
  return entry;
}

// Contract differs from setPlayerCareerTrack: TRUE means the attempt RESOLVED —
// a failed roll returns true and HAS mutated state (cooldown + counter + feed),
// so the caller must persist. FALSE only for rejected attempts.
export function attemptPlayerRelocation(snap: FullGameSnapshot, politicianId: string, destStateId: string): boolean {
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p || p.factionId !== snap.game.playerFactionId) return false;
  const entry = resolveRelocation(snap, p, destStateId);
  if (!entry) return false;
  if (entry.traitsGained.length > 0) snap.politicians = refreshPv(snap.politicians);
  return true;
}

export function runPhase_2_1_4_Relocations(snap: FullGameSnapshot): void {
  if (!snap.game.relocations) snap.game.relocations = [];

  // Seed pass — one-shot altState assignment per politician (lazy: covers all
  // construction paths and legacy saves; never re-rolled, never re-routed).
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear || p.altStateSeeded) continue;
    const home = snap.states.find((s) => s.id === p.state);
    if (home) {
      const r = rand();
      if (r < RELOCATION_ODDS.seed.sameRegion) {
        const pool = snap.states.filter((s) => s.region === home.region && s.id !== home.id);
        if (pool.length > 0) p.altState = pick(pool).id;
      } else if (r < RELOCATION_ODDS.seed.sameRegion + RELOCATION_ODDS.seed.crossRegion) {
        const pool = snap.states.filter((s) => s.region !== home.region);
        if (pool.length > 0) p.altState = pick(pool).id;
      }
    }
    p.altStateSeeded = true;
  }

  attemptCounts(snap); // lazy counter reset for the new year

  // CPU pass. Resident counts snapshot at tick start (deterministic & cheap).
  const residentCount = new Map<string, number>();
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    residentCount.set(p.state, (residentCount.get(p.state) ?? 0) + 1);
  }
  for (const p of snap.politicians) {
    if (!p.factionId || p.factionId === snap.game.playerFactionId) continue;
    if (p.deathYear || p.retiredYear || p.currentOffice) continue;
    if (p.lastRelocationAttemptYear === snap.game.year) continue;
    if ((attemptCounts(snap)[p.factionId] ?? 0) >= RELOCATION_ATTEMPTS_PER_TURN) continue;
    const altUsable = p.altState && p.altState !== p.state && snap.states.some((s) => s.id === p.altState);
    if (altUsable) {
      if (chance(RELOCATION_ODDS.cpuGate.withAltState)) resolveRelocation(snap, p, p.altState!);
    } else if (chance(RELOCATION_ODDS.cpuGate.withoutAltState)) {
      // Thin-state heuristic: same region first, then fewest residents, then id.
      const home = snap.states.find((s) => s.id === p.state);
      const candidates = snap.states.filter((s) => s.id !== p.state);
      if (candidates.length === 0) continue;
      candidates.sort((a, b) => {
        const aSame = home && a.region === home.region ? 0 : 1;
        const bSame = home && b.region === home.region ? 0 : 1;
        if (aSame !== bSame) return aSame - bSame;
        const ra = residentCount.get(a.id) ?? 0;
        const rb = residentCount.get(b.id) ?? 0;
        if (ra !== rb) return ra - rb;
        return a.id.localeCompare(b.id);
      });
      resolveRelocation(snap, p, candidates[0].id);
    }
  }

  snap.politicians = refreshPv(snap.politicians);
}

// ============================================================================
// 2.1.5 Ideology shifts (auto)
// ============================================================================
// Lazy year normalization — the only ideology-attempts counter accessor.
function ideologyAttemptCounts(snap: FullGameSnapshot): Record<string, number> {
  const g = snap.game;
  if (!g.ideologyAttempts || g.ideologyAttempts.year !== g.year) {
    g.ideologyAttempts = { year: g.year, counts: {} };
  }
  return g.ideologyAttempts.counts;
}

function traitMult(p: Politician, kind: 'drift' | 'self' | 'opposed'): number {
  let m = 1;
  if (p.traits.includes('Ideologue')) m *= IDEOLOGY_SHIFT_ODDS.traitMods.Ideologue[kind];
  if (p.traits.includes('Impressionable')) m *= IDEOLOGY_SHIFT_ODDS.traitMods.Impressionable[kind];
  return m;
}

// Living-member mean ideology index, rounded half-up (x.5 rounds toward RW).
// Deliberately diverges from 2.1.8's unfiltered (dead-counting) rollup.
export function factionCenter(snap: FullGameSnapshot, factionId: string): number | null {
  const members = snap.politicians.filter((p) => p.factionId === factionId && !p.deathYear && !p.retiredYear);
  if (members.length === 0) return null;
  const faction = snap.factions.find((f) => f.id === factionId);
  const leaderId = faction?.leaderId ?? null;
  let sum = 0, count = 0;
  for (const p of members) {
    const w = (leaderId !== null && p.id === leaderId)
      ? LEADERSHIP_RULES.ideologyWeightInFactionCenter
      : 1;
    sum += IDEOLOGY_ORDER.indexOf(p.ideology) * w;
    count += w;
  }
  return Math.round(sum / count);
}

export function getFactionLeader(snap: FullGameSnapshot, factionId: string | null | undefined): Politician | null {
  if (!factionId) return null;
  const f = snap.factions.find((ff) => ff.id === factionId);
  if (!f || !f.leaderId) return null;
  const leader = snap.politicians.find((p) => p.id === f.leaderId);
  if (!leader) return null;
  if (leader.deathYear || leader.retiredYear) return null;
  return leader;
}

function stepToward(fromIdx: number, targetIdx: number): number {
  return fromIdx === targetIdx ? fromIdx : fromIdx + Math.sign(targetIdx - fromIdx);
}

// Shared odds/step math — used by the resolver AND the page preview, so the
// odds displayed are structurally the odds rolled.
export function ideologyShiftOdds(p: Politician, kind: 'self' | 'opposed', actorCenter: number, actorLeader?: Politician | null): { success: number; ffRisk: number; from: Ideology; to: Ideology } {
  const oratorBonus = actorLeader?.traits.includes('Orator')
    ? LEADERSHIP_RULES.oratorIdeologyShiftBonus
    : 0;
  const success = clamp(IDEOLOGY_SHIFT_ODDS.attempt[kind] * traitMult(p, kind) + oratorBonus, 0, 1);
  const ffRisk = kind === 'opposed' ? IDEOLOGY_SHIFT_ODDS.attempt.ffRisk : 0;
  const fromIdx = IDEOLOGY_ORDER.indexOf(p.ideology);
  return { success, ffRisk, from: p.ideology, to: IDEOLOGY_ORDER[stepToward(fromIdx, actorCenter)] };
}

function recordIdeologyShift(snap: FullGameSnapshot, entry: IdeologyShiftEntry): void {
  if (!snap.game.ideologyShifts) snap.game.ideologyShifts = [];
  const arr = snap.game.ideologyShifts;
  arr.push(entry);
  if (arr.length > IDEOLOGY_SHIFTS_CAP) arr.splice(0, arr.length - IDEOLOGY_SHIFTS_CAP);
}

// The single attempt path (CPU and player, self and opposed — kind is DERIVED
// from actor vs subject faction, never passed). Returns null = REJECTED (no
// attempt happened); non-null = the attempt RAN — counter, stamp, and feed are
// mutated whether the roll succeeded or not.
function resolveIdeologyShift(snap: FullGameSnapshot, actorFactionId: string, p: Politician): IdeologyShiftEntry | null {
  const g = snap.game;
  if (g.phaseId !== '2.1.5') return null;
  if (p.deathYear || p.retiredYear) return null; // in-office IS a valid subject
  if (!p.factionId) return null;
  const kind: 'self' | 'opposed' = p.factionId === actorFactionId ? 'self' : 'opposed';
  const center = factionCenter(snap, actorFactionId);
  if (center === null) return null;
  if (IDEOLOGY_ORDER.indexOf(p.ideology) === center) return null; // nothing to gain
  if (p.lastIdeologyAttemptYear === g.year) return null; // one attempt per subject per turn
  const counts = ideologyAttemptCounts(snap);
  if ((counts[actorFactionId] ?? 0) >= IDEOLOGY_ATTEMPTS_PER_TURN) return null;

  counts[actorFactionId] = (counts[actorFactionId] ?? 0) + 1;
  p.lastIdeologyAttemptYear = g.year; // stamps failures too
  const from = p.ideology;

  const actorLeader = getFactionLeader(snap, actorFactionId);
  const { success: pS, ffRisk, to } = ideologyShiftOdds(p, kind, center, actorLeader);
  const success = chance(pS);
  let flipFlopper = false;
  if (success) {
    p.ideology = to;
    if (kind === 'opposed' && chance(ffRisk)) {
      p.flipFlopperPenalty += 1;
      flipFlopper = true;
    }
  }

  const entry: IdeologyShiftEntry = {
    year: g.year,
    politicianId: p.id,
    subjectFactionId: p.factionId,
    actorFactionId,
    kind,
    fromIdeology: from,
    toIdeology: success ? to : from,
    success,
    flipFlopper,
  };
  recordIdeologyShift(snap, entry);
  return entry;
}

// Contract clone of attemptPlayerRelocation: TRUE means the attempt RESOLVED —
// a failed roll returns true and HAS mutated state (counter + stamp + feed),
// so the caller must persist. FALSE only for rejected attempts.
export function attemptPlayerIdeologyShift(snap: FullGameSnapshot, politicianId: string): boolean {
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p) return false;
  const entry = resolveIdeologyShift(snap, snap.game.playerFactionId, p);
  if (!entry) return false;
  if (entry.flipFlopper) snap.politicians = refreshPv(snap.politicians);
  return true;
}

export function runPhase_2_1_5_Ideology(snap: FullGameSnapshot): void {
  if (!snap.game.ideologyShifts) snap.game.ideologyShifts = [];

  // Trait-seed pass — one-shot per politician (lazy: covers all construction
  // paths and legacy saves; mutually exclusive; never re-rolled).
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear || p.ideologyTraitsSeeded) continue;
    if (!p.traits.includes('Ideologue') && !p.traits.includes('Impressionable')) {
      const r = rand();
      if (r < IDEOLOGY_SHIFT_ODDS.seed.ideologue) p.traits.push('Ideologue');
      else if (r < IDEOLOGY_SHIFT_ODDS.seed.ideologue + IDEOLOGY_SHIFT_ODDS.seed.impressionable) p.traits.push('Impressionable');
    }
    p.ideologyTraitsSeeded = true;
  }

  ideologyAttemptCounts(snap); // lazy counter reset for the new year

  // Tick-start center map: the drift pass measures the turn-start environment,
  // untouched by this tick's CPU successes.
  const centers = new Map<string, number | null>();
  for (const f of snap.factions) centers.set(f.id, factionCenter(snap, f.id));

  // CPU pass.
  let cpuAttempts = 0;
  for (const f of snap.factions) {
    if (f.id === snap.game.playerFactionId) continue;
    const center = factionCenter(snap, f.id);
    if (center === null) continue;
    const counts = ideologyAttemptCounts(snap);

    const selfCandidates = snap.politicians
      .filter((p) => p.factionId === f.id && !p.deathYear && !p.retiredYear
        && IDEOLOGY_ORDER.indexOf(p.ideology) !== center && p.lastIdeologyAttemptYear !== snap.game.year)
      .sort((a, b) => {
        const da = Math.abs(IDEOLOGY_ORDER.indexOf(a.ideology) - center);
        const db = Math.abs(IDEOLOGY_ORDER.indexOf(b.ideology) - center);
        if (da !== db) return db - da;
        if (a.pvCache !== b.pvCache) return b.pvCache - a.pvCache;
        return a.id.localeCompare(b.id);
      });
    let selfUsed = 0;
    for (const p of selfCandidates) {
      if ((counts[f.id] ?? 0) >= IDEOLOGY_ATTEMPTS_PER_TURN) break;
      if (selfUsed >= IDEOLOGY_SHIFT_ODDS.cpu.selfBudget) break;
      if (!chance(IDEOLOGY_SHIFT_ODDS.cpu.selfGate)) continue;
      if (resolveIdeologyShift(snap, f.id, p)) {
        selfUsed++;
        cpuAttempts++;
      }
    }

    const opposedCandidates = snap.politicians
      .filter((p) => p.factionId && p.factionId !== f.id && !p.deathYear && !p.retiredYear
        && p.currentOffice && IDEOLOGY_ORDER.indexOf(p.ideology) !== center && p.lastIdeologyAttemptYear !== snap.game.year)
      .sort((a, b) => (a.pvCache !== b.pvCache ? b.pvCache - a.pvCache : a.id.localeCompare(b.id)))
      .slice(0, IDEOLOGY_SHIFT_ODDS.cpu.opposedScan);
    for (const p of opposedCandidates) {
      if ((counts[f.id] ?? 0) >= IDEOLOGY_ATTEMPTS_PER_TURN) break;
      if (!chance(IDEOLOGY_SHIFT_ODDS.cpu.opposedGate)) continue;
      if (resolveIdeologyShift(snap, f.id, p)) cpuAttempts++;
    }
  }

  // Passive drift — up to three rolls, at most one move; first success ends
  // the chain. Skips anyone already attempted this turn.
  let driftCount = 0;
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (p.lastIdeologyAttemptYear === snap.game.year) continue;
    const dm = traitMult(p, 'drift');
    if (dm === 0) continue; // Ideologue immunity, zero draws
    const idx = IDEOLOGY_ORDER.indexOf(p.ideology);
    let moved: { newIdx: number; kind: 'drift' | 'stateBias' } | null = null;

    const center = p.factionId ? centers.get(p.factionId) ?? null : null;
    if (center !== null && idx !== center && chance(IDEOLOGY_SHIFT_ODDS.drift.faction * dm)) {
      moved = { newIdx: stepToward(idx, center), kind: 'drift' };
    }
    if (!moved) {
      const st = snap.states.find((s) => s.id === p.state);
      if (st && Math.abs(st.bias) >= IDEOLOGY_SHIFT_ODDS.drift.stateBiasMin) {
        const ni = idx + (st.bias > 0 ? 1 : -1); // positive bias = red = higher index
        if (ni >= 0 && ni < IDEOLOGY_ORDER.length && chance(IDEOLOGY_SHIFT_ODDS.drift.stateBias * dm)) {
          moved = { newIdx: ni, kind: 'stateBias' };
        }
      }
    }
    if (!moved && chance(IDEOLOGY_SHIFT_ODDS.drift.residual * dm)) {
      const ni = idx + (chance(0.5) ? 1 : -1); // direction drawn after the rate hit
      if (ni >= 0 && ni < IDEOLOGY_ORDER.length) moved = { newIdx: ni, kind: 'drift' };
    }

    if (moved) {
      const from = p.ideology;
      p.ideology = IDEOLOGY_ORDER[moved.newIdx];
      recordIdeologyShift(snap, {
        year: snap.game.year,
        politicianId: p.id,
        subjectFactionId: p.factionId ?? null,
        kind: moved.kind,
        fromIdeology: from,
        toIdeology: p.ideology,
        success: true,
        flipFlopper: false,
      });
      driftCount++;
    }
  }

  snap.politicians = refreshPv(snap.politicians);
  if (driftCount + cpuAttempts > 0) {
    addLog(snap, '2.1.5', 'system', `Ideological currents: ${driftCount} politicians drifted; ${cpuAttempts} shift attempts resolved.`);
  }
}

// ============================================================================
// 2.1.6 Faction conversions
// ============================================================================

// Lazy year normalization — the only conversion-attempts counter accessor.
function conversionAttemptCounts(snap: FullGameSnapshot): Record<string, number> {
  const g = snap.game;
  if (!g.conversionAttempts || g.conversionAttempts.year !== g.year) {
    g.conversionAttempts = { year: g.year, counts: {} };
  }
  return g.conversionAttempts.counts;
}

// Loyal short-circuits to 0; else 2% × Opportunist factor. Read by both the
// passive pass AND the own-roster Risk % column (preview === roll).
export function passiveConversionChance(p: Politician): number {
  if (p.traits.includes('Loyal')) return 0;
  const mult = p.traits.includes('Opportunist') ? CONVERSION_ODDS.traits.Opportunist.passive : 1;
  return CONVERSION_ODDS.passive.rate * mult;
}

// Anchored mentor bond requires partner to share the politician's CURRENT
// faction and be alive/non-retired. Bonds to defected partners do NOT anchor.
export function mentorBondAnchored(snap: FullGameSnapshot, p: Politician): boolean {
  if (!p.factionId) return false;
  if (p.protegeId) {
    const partner = snap.politicians.find((q) => q.id === p.protegeId);
    if (partner && partner.factionId === p.factionId && !partner.deathYear && !partner.retiredYear) return true;
  }
  return snap.politicians.some((m) => m.protegeId === p.id && m.factionId === p.factionId && !m.deathYear && !m.retiredYear);
}

// Shared odds/factor composition — used by the resolver AND the page confirm
// card so the itemized preview is structurally what the engine rolls.
export interface ConversionOdds {
  kind: 'sign' | 'poach';
  crossParty: boolean;
  inOffice: boolean;
  base: number;
  factors: { fit: number; ffHistory: number; mentorBond: number; highPv: number; flipFlopperTrait: number; loyal: number; opportunist: number };
  success: number;
  ffOnSuccess: number;
}

export function conversionOdds(snap: FullGameSnapshot, actorFactionId: string, p: Politician): ConversionOdds {
  const actor = snap.factions.find((f) => f.id === actorFactionId)!;
  const kind: 'sign' | 'poach' = !p.factionId ? 'sign' : 'poach';
  const current = kind === 'poach' ? snap.factions.find((f) => f.id === p.factionId) : undefined;
  const crossParty = kind === 'poach' && !!current && current.partyId !== actor.partyId;
  const inOffice = !!p.currentOffice;
  const base = kind === 'sign'
    ? CONVERSION_ODDS.sign.base
    : CONVERSION_ODDS.poach.matrix[crossParty ? 'cross' : 'same'][inOffice ? 'inOffice' : 'notInOffice'];

  let fit = 1;
  const idx = IDEOLOGY_ORDER.indexOf(p.ideology);
  if (kind === 'poach') {
    const actorC = factionCenter(snap, actorFactionId);
    const currentC = factionCenter(snap, p.factionId!);
    if (actorC !== null && currentC !== null) {
      const dA = Math.abs(idx - actorC);
      const dC = Math.abs(idx - currentC);
      fit = dA < dC ? CONVERSION_ODDS.willingness.fitBetter : dA > dC ? CONVERSION_ODDS.willingness.fitWorse : 1;
    }
  } else {
    const actorC = factionCenter(snap, actorFactionId);
    if (actorC !== null) {
      const d = Math.abs(idx - actorC);
      fit = d <= CONVERSION_ODDS.sign.fitCloseMax ? CONVERSION_ODDS.sign.fitBandClose
        : d >= CONVERSION_ODDS.sign.fitFarMin ? CONVERSION_ODDS.sign.fitBandFar
        : 1;
    }
  }

  const ffHistory = p.flipFlopperPenalty > 0 ? CONVERSION_ODDS.willingness.ffHistory : 1;
  const mentorBond = kind === 'poach' && mentorBondAnchored(snap, p) ? CONVERSION_ODDS.willingness.mentorBond : 1;
  const highPv = p.pvCache >= CONVERSION_ODDS.willingness.highPvThreshold ? CONVERSION_ODDS.willingness.highPv : 1;
  const flipFlopperTrait = p.traits.includes('Flip-Flopper') ? CONVERSION_ODDS.willingness.flipFlopperTrait : 1;
  const loyal = p.traits.includes('Loyal') ? CONVERSION_ODDS.traits.Loyal.attempt : 1;
  const opportunist = p.traits.includes('Opportunist') ? CONVERSION_ODDS.traits.Opportunist.attempt : 1;

  const actorLeader = getFactionLeader(snap, actorFactionId);
  const manipulativeBonus = actorLeader?.traits.includes('Manipulative')
    ? LEADERSHIP_RULES.manipulativeConversionBonus
    : 0;
  const success = clamp(base * fit * ffHistory * mentorBond * highPv * flipFlopperTrait * loyal * opportunist + manipulativeBonus, 0, 1);
  const ffOnSuccess = kind === 'poach' ? CONVERSION_ODDS.ffStacks[crossParty ? 'cross' : 'same'] : 0;

  return {
    kind, crossParty, inOffice, base,
    factors: { fit, ffHistory, mentorBond, highPv, flipFlopperTrait, loyal, opportunist },
    success, ffOnSuccess,
  };
}

// Tick-start within-party rank: factions sorted by living-center ascending,
// id tiebreak. Empty-centered factions are excluded from their party's ranks.
function factionRankMap(snap: FullGameSnapshot): Map<string, { rank: number; partyRanks: string[] }> {
  const result = new Map<string, { rank: number; partyRanks: string[] }>();
  for (const partyId of ['BLUE', 'RED'] as const) {
    const list = snap.factions
      .filter((f) => f.partyId === partyId)
      .map((f) => ({ id: f.id, center: factionCenter(snap, f.id) }))
      .filter((x): x is { id: string; center: number } => x.center !== null)
      .sort((a, b) => (a.center !== b.center ? a.center - b.center : a.id.localeCompare(b.id)));
    const partyRanks = list.map((x) => x.id);
    list.forEach((x, i) => result.set(x.id, { rank: i, partyRanks }));
  }
  return result;
}

function defectionDestination(
  snap: FullGameSnapshot,
  p: Politician,
  rankMap: Map<string, { rank: number; partyRanks: string[] }>,
  partyId: PartyId,
  oneAway: boolean,
): { toFactionId: string; crossParty: boolean } | null {
  if (oneAway) {
    const entry = rankMap.get(p.factionId!);
    if (!entry || entry.partyRanks.length <= 1) return null;
    const last = entry.partyRanks.length - 1;
    // Edges forced inward; interior 50/50.
    const dir = entry.rank === 0 ? 1 : entry.rank === last ? -1 : (chance(0.5) ? 1 : -1);
    return { toFactionId: entry.partyRanks[entry.rank + dir], crossParty: false };
  }
  const pool = snap.factions.filter((f) => f.id !== p.factionId && factionCenter(snap, f.id) !== null);
  if (pool.length === 0) return null;
  const dest = pick(pool);
  return { toFactionId: dest.id, crossParty: dest.partyId !== partyId };
}

function recordConversion(snap: FullGameSnapshot, entry: ConversionEntry): void {
  if (!snap.game.conversions) snap.game.conversions = [];
  const arr = snap.game.conversions;
  arr.push(entry);
  if (arr.length > CONVERSIONS_CAP) arr.splice(0, arr.length - CONVERSIONS_CAP);
}

// The single active attempt path (CPU and player, sign and poach — kind is
// DERIVED from subject state, never passed). Returns null = REJECTED (no
// attempt happened); non-null = the attempt RAN — counter, stamp, and feed
// are mutated whether the roll succeeded or not.
function resolveConversion(snap: FullGameSnapshot, actorFactionId: string, p: Politician): ConversionEntry | null {
  const g = snap.game;
  if (g.phaseId !== '2.1.6') return null;
  if (p.deathYear || p.retiredYear) return null;
  if (p.factionId === actorFactionId) return null; // own members rejected
  const kind: 'sign' | 'poach' = !p.factionId ? 'sign' : 'poach';
  if (p.lastConversionAttemptYear === g.year) return null;
  const actor = snap.factions.find((f) => f.id === actorFactionId);
  if (!actor) return null;
  if (kind === 'poach') {
    const current = snap.factions.find((f) => f.id === p.factionId);
    if (!current) return null;
  }
  const counts = conversionAttemptCounts(snap);
  if ((counts[actorFactionId] ?? 0) >= CONVERSION_ATTEMPTS_PER_TURN) return null;

  counts[actorFactionId] = (counts[actorFactionId] ?? 0) + 1;
  p.lastConversionAttemptYear = g.year;
  const fromFactionId = p.factionId;
  const fromPartyId = p.partyId;

  const odds = conversionOdds(snap, actorFactionId, p);
  const success = chance(odds.success);
  if (success) {
    p.factionId = actor.id;
    p.partyId = actor.partyId; // always rewrite — same-party is identity-safe
    if (kind === 'poach') p.flipFlopperPenalty += odds.ffOnSuccess;
  }

  const entry: ConversionEntry = {
    year: g.year,
    politicianId: p.id,
    fromFactionId,
    toFactionId: actor.id,
    fromPartyId,
    toPartyId: actor.partyId,
    actorFactionId,
    kind,
    crossParty: odds.crossParty,
    success,
    ffGained: success ? odds.ffOnSuccess : 0,
  };
  recordConversion(snap, entry);
  return entry;
}

// Contract clone of attemptPlayerIdeologyShift: TRUE means the attempt
// RESOLVED — a failed roll returns true and HAS mutated state
// (counter + stamp + feed), so the caller must persist. FALSE only for
// rejected attempts.
export function attemptPlayerConversion(snap: FullGameSnapshot, politicianId: string): boolean {
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p) return false;
  const entry = resolveConversion(snap, snap.game.playerFactionId, p);
  if (!entry) return false;
  if (entry.ffGained > 0) snap.politicians = refreshPv(snap.politicians);
  return true;
}

export function runPhase_2_1_6_Conversions(snap: FullGameSnapshot): void {
  if (!snap.game.conversions) snap.game.conversions = [];

  // Trait-seed pass — Loyal/Opportunist, mutually exclusive, one-shot per
  // politician (lazy: covers all construction paths and legacy saves). Free
  // agents and in-office politicians ARE seeded; only dead/retired skipped.
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear || p.conversionTraitsSeeded) continue;
    if (!p.traits.includes('Loyal') && !p.traits.includes('Opportunist')) {
      const r = rand();
      if (r < CONVERSION_ODDS.seed.loyal) p.traits.push('Loyal');
      else if (r < CONVERSION_ODDS.seed.loyal + CONVERSION_ODDS.seed.opportunist) p.traits.push('Opportunist');
    }
    p.conversionTraitsSeeded = true;
  }

  conversionAttemptCounts(snap); // lazy counter reset for the new year
  const rankMap = factionRankMap(snap);

  // CPU pass — sign first (cheap growth), then poach.
  let cpuAttempts = 0;
  for (const f of snap.factions) {
    if (f.id === snap.game.playerFactionId) continue;
    const counts = conversionAttemptCounts(snap);

    const signCandidates = snap.politicians
      .filter((p) => !p.factionId && !p.deathYear && !p.retiredYear && p.lastConversionAttemptYear !== snap.game.year)
      .map((p) => ({ p, odds: conversionOdds(snap, f.id, p).success }))
      .sort((a, b) => (a.odds !== b.odds ? b.odds - a.odds : (a.p.pvCache !== b.p.pvCache ? b.p.pvCache - a.p.pvCache : a.p.id.localeCompare(b.p.id))))
      .slice(0, CONVERSION_ODDS.cpu.signScan);
    let signUsed = 0;
    for (const { p } of signCandidates) {
      if ((counts[f.id] ?? 0) >= CONVERSION_ATTEMPTS_PER_TURN) break;
      if (signUsed >= CONVERSION_ODDS.cpu.signBudget) break;
      if (!chance(CONVERSION_ODDS.cpu.signGate)) continue;
      if (resolveConversion(snap, f.id, p)) {
        signUsed++;
        cpuAttempts++;
      }
    }

    const poachCandidates = snap.politicians
      .filter((p) => p.factionId && p.factionId !== f.id && !p.deathYear && !p.retiredYear && p.lastConversionAttemptYear !== snap.game.year)
      .map((p) => ({ p, odds: conversionOdds(snap, f.id, p).success }))
      .sort((a, b) => (a.odds !== b.odds ? b.odds - a.odds : (a.p.pvCache !== b.p.pvCache ? b.p.pvCache - a.p.pvCache : a.p.id.localeCompare(b.p.id))))
      .slice(0, CONVERSION_ODDS.cpu.poachScan);
    for (const { p } of poachCandidates) {
      if ((counts[f.id] ?? 0) >= CONVERSION_ATTEMPTS_PER_TURN) break;
      if (!chance(CONVERSION_ODDS.cpu.poachGate)) continue;
      if (resolveConversion(snap, f.id, p)) cpuAttempts++;
    }
  }

  // Passive defection pass — own loss-cap counter; passive entries never
  // write the subject stamp (the pass is the turn's last actor). Iteration
  // order matters: earlier politicians leave before the source-faction cap
  // closes the gate.
  let defects = 0;
  const lossCounter = new Map<string, number>();
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear || !p.factionId) continue;
    if (p.lastConversionAttemptYear === snap.game.year) continue;
    const chanceNow = passiveConversionChance(p);
    if (chanceNow === 0) continue; // Loyal short-circuit, zero RNG draws
    if ((lossCounter.get(p.factionId) ?? 0) >= CONVERSION_ODDS.passive.lossCapPerFaction) continue;
    if (!chance(chanceNow)) continue;

    const oneAway = chance(CONVERSION_ODDS.passive.oneAway);
    const dest = defectionDestination(snap, p, rankMap, p.partyId!, oneAway);
    if (!dest) continue;
    const destFaction = snap.factions.find((f) => f.id === dest.toFactionId)!;
    const fromFactionId = p.factionId;
    const fromPartyId = p.partyId;
    p.factionId = destFaction.id;
    p.partyId = destFaction.partyId;
    const ffDelta = CONVERSION_ODDS.ffStacks[dest.crossParty ? 'cross' : 'same'];
    p.flipFlopperPenalty += ffDelta;
    lossCounter.set(fromFactionId, (lossCounter.get(fromFactionId) ?? 0) + 1);
    defects++;
    recordConversion(snap, {
      year: snap.game.year,
      politicianId: p.id,
      fromFactionId,
      toFactionId: destFaction.id,
      fromPartyId,
      toPartyId: destFaction.partyId,
      kind: 'defect',
      crossParty: dest.crossParty,
      success: true,
      ffGained: ffDelta,
    });
  }

  snap.politicians = refreshPv(snap.politicians);
  if (defects + cpuAttempts > 0) {
    addLog(snap, '2.1.6', 'system', `Realignment currents: ${defects} defections; ${cpuAttempts} recruitment attempts resolved.`);
  }
}

// ============================================================================
// 2.1.7 Kingmakers & Protégés
// ============================================================================

function eraCommandGate(scenarioId: string): number {
  return KINGMAKER_RULES.commandGateByScenario[scenarioId] ?? KINGMAKER_RULES.commandGateDefault;
}

// Prodigy-direction only: someone in p's CURRENT faction mentors p.
// Used by 2.1.2 acceleration — must be a LIVE read (ordering invariant).
export function hasMentor(snap: FullGameSnapshot, p: Politician): boolean {
  if (!p.factionId) return false;
  return snap.politicians.some((m) => m.protegeId === p.id && m.factionId === p.factionId && !m.deathYear && !m.retiredYear);
}

// One extra skill roll for bonded protégés. Mirrors the skill block of
// rollThreshold exactly — re-resolves below-cap from scratch because the
// primary roll may have raised this politician's chosen skill.
function rollMentorBonusSkill(snap: FullGameSnapshot, p: Politician, thresholdYears: number): void {
  const track = p.careerTrack;
  if (!track) return;
  if (!chance(CAREER_ODDS.skill)) return;
  let k: SkillKey | null = TRACK_SKILL[track];
  if (track === 'Private') {
    k = pick(SKILLS);
    if (p.skills[k] >= 5) {
      const below = SKILLS.filter((s) => p.skills[s] < 5);
      k = below.length > 0 ? pick(below) : null;
    }
  }
  if (k && p.skills[k] < 5) {
    p.skills[k] = clamp(p.skills[k] + 1, 0, 5);
    recordCareerGain(snap, p, thresholdYears, 'skill', k, false);
  }
}

export function protegeCandidates(snap: FullGameSnapshot, kingmakerId: string): Politician[] {
  const k = snap.politicians.find((p) => p.id === kingmakerId);
  if (!k || !k.factionId || k.deathYear || k.retiredYear) return [];
  if (!k.traits.includes('Kingmaker')) return [];
  return snap.politicians.filter((c) => {
    if (c.id === k.id) return false;
    if (c.factionId !== k.factionId || !c.factionId) return false;
    if (c.state !== k.state) return false;
    if (c.deathYear || c.retiredYear) return false;
    // one-mentor-per-prodigy
    if (snap.politicians.some((m) => m.protegeId === c.id && !m.deathYear && !m.retiredYear)) return false;
    if (c.traits.includes('Kingmaker')) return false;
    if (c.age >= KINGMAKER_RULES.protegeMaxAge) return false;
    const t = c.currentOffice?.type;
    if (t && t !== 'Representative' && t !== 'Governor') return false;
    if (c.pvCache < KINGMAKER_RULES.protegeMinPv) return false;
    return true;
  });
}

function recordKingmaker(snap: FullGameSnapshot, entry: KingmakerEntry): void {
  if (!snap.game.kingmakers) snap.game.kingmakers = [];
  const arr = snap.game.kingmakers;
  arr.push(entry);
  if (arr.length > KINGMAKERS_CAP) arr.splice(0, arr.length - KINGMAKERS_CAP);
}

// Contract clone of attemptPlayerConversion: TRUE means the assignment APPLIED
// (mutation + feed written, caller must persist); FALSE means rejected.
export function assignProtege(snap: FullGameSnapshot, kingmakerId: string, protegeId: string): boolean {
  const g = snap.game;
  if (g.phaseId !== '2.1.7') return false;
  const k = snap.politicians.find((p) => p.id === kingmakerId);
  if (!k || k.deathYear || k.retiredYear || !k.factionId) return false;
  if (!k.traits.includes('Kingmaker')) return false;
  if (k.protegeId) return false;
  const candidates = protegeCandidates(snap, kingmakerId);
  const c = candidates.find((cc) => cc.id === protegeId);
  if (!c) return false;
  k.protegeId = c.id;
  c.bondedYear = g.year;
  recordKingmaker(snap, {
    year: g.year, kind: 'bonded',
    politicianId: c.id, mentorId: k.id, protegeId: c.id,
    factionId: k.factionId, actor: 'player',
  });
  return true;
}

export function releaseProtege(snap: FullGameSnapshot, kingmakerId: string): boolean {
  const g = snap.game;
  if (g.phaseId !== '2.1.7') return false;
  const k = snap.politicians.find((p) => p.id === kingmakerId);
  if (!k || !k.protegeId || !k.factionId) return false;
  const c = snap.politicians.find((p) => p.id === k.protegeId);
  const protegeId = k.protegeId;
  k.protegeId = null;
  if (c) c.bondedYear = undefined;
  recordKingmaker(snap, {
    year: g.year, kind: 'dissolved',
    politicianId: protegeId, mentorId: k.id, protegeId,
    factionId: k.factionId, reason: 'released', actor: 'player',
  });
  return true;
}

// Draft-year per-faction floor top-up. Called from runPhase_2_1_1_Draft AFTER
// the pool finalizes — every rookie has a factionId by then. The floor is a
// faction-count guarantee, not a command gate (era trait-grant lives in 2.1.7).
function runDraftKingmakerTopUp(snap: FullGameSnapshot): void {
  let granted = 0;
  for (const f of snap.factions) {
    const members = snap.politicians.filter((p) => p.factionId === f.id && !p.deathYear && !p.retiredYear);
    const haveTrait = members.filter((p) => p.traits.includes('Kingmaker')).length;
    const needed = KINGMAKER_RULES.factionFloor - haveTrait;
    if (needed <= 0) continue;
    const noTrait = members.filter((p) => !p.traits.includes('Kingmaker'));
    if (noTrait.length === 0) continue;
    // Uniform-random from the top half by PV — higher-value but not strictly highest.
    const sorted = [...noTrait].sort((a, b) => b.pvCache - a.pvCache || a.id.localeCompare(b.id));
    const topHalf = sorted.slice(0, Math.ceil(sorted.length / 2));
    const shuffled = shuffle(topHalf);
    const grants = shuffled.slice(0, Math.min(needed, shuffled.length));
    for (const g of grants) {
      g.traits.push('Kingmaker');
      recordKingmaker(snap, {
        year: snap.game.year, kind: 'anointed',
        politicianId: g.id,
        factionId: f.id, reason: 'draft-floor',
      });
      granted++;
    }
  }
  if (granted > 0) snap.politicians = refreshPv(snap.politicians);
}

export function runPhase_2_1_7_Kingmakers(snap: FullGameSnapshot): void {
  // Phase 1: eager init
  if (!snap.game.kingmakers) snap.game.kingmakers = [];

  const gate = eraCommandGate(snap.game.scenarioId);
  let anointed = 0;
  let bonded = 0;
  let graduated = 0;
  let dissolved = 0;

  // Phase 2: trait-grant pass — newly-minted Kingmakers can assign this tick.
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (!p.factionId) continue;
    if (p.command < gate) continue;
    if (p.traits.includes('Kingmaker')) continue;
    p.traits.push('Kingmaker');
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'anointed',
      politicianId: p.id,
      factionId: p.factionId,
    });
    anointed++;
  }

  // Phase 3: lifecycle sweep — break dead/retired/cross-faction bonds.
  for (const k of snap.politicians) {
    if (!k.protegeId) continue;
    const c = snap.politicians.find((q) => q.id === k.protegeId);
    let reason: 'death' | 'retire' | 'defect' | null = null;
    if (!c) reason = 'defect';
    else if (k.deathYear) reason = 'death';
    else if (c.deathYear) reason = 'death';
    else if (k.retiredYear) reason = 'retire';
    else if (c.retiredYear) reason = 'retire';
    else if (c.factionId !== k.factionId) reason = 'defect';
    if (!reason) continue;
    const protegeId = k.protegeId;
    k.protegeId = null;
    if (c) c.bondedYear = undefined;
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'dissolved',
      politicianId: protegeId, mentorId: k.id, protegeId,
      factionId: k.factionId ?? c?.factionId ?? '',
      reason,
    });
    dissolved++;
  }

  // Phase 4: graduation pass — dual trigger; weighted legacy roll.
  for (const k of snap.politicians) {
    if (!k.protegeId) continue;
    if (k.deathYear || k.retiredYear || !k.factionId) continue;
    const c = snap.politicians.find((q) => q.id === k.protegeId);
    if (!c || c.deathYear || c.retiredYear) continue;
    const bondYear = c.bondedYear ?? snap.game.year;
    const tenure = snap.game.year - bondYear >= KINGMAKER_RULES.graduationYears;
    const officeTrigger = c.currentOffice?.type === 'Senator' || c.currentOffice?.type === 'President';
    if (!tenure && !officeTrigger) continue;
    const trigger: 'tenure' | 'office' = officeTrigger ? 'office' : 'tenure';

    // Single weighted rand() across the 0.45 / 0.45 / 0.10 split.
    const r = rand();
    const commandBranch = r < KINGMAKER_RULES.graduationOdds.command;
    const traitBranch = !commandBranch && r < KINGMAKER_RULES.graduationOdds.command + KINGMAKER_RULES.graduationOdds.trait;
    const bothBranch = !commandBranch && !traitBranch;

    if (commandBranch || bothBranch) {
      c.command = Math.min(KINGMAKER_RULES.commandCap, c.command + 1);
    }
    if (traitBranch || bothBranch) {
      const inheritable = k.traits.filter((t) => POSITIVE_TRAITS.includes(t) && !c.traits.includes(t));
      if (inheritable.length > 0) {
        c.traits.push(pick(inheritable));
      }
    }

    const mentorFactionLeader = getFactionLeader(snap, k.factionId);
    if (mentorFactionLeader?.traits.includes('Kingmaker') && chance(LEADERSHIP_RULES.kingmakerProtegeBonus)) {
      c.command = Math.min(KINGMAKER_RULES.commandCap, c.command + 1);
    }

    // Mentor reward — independent of which branch fired for the protégé.
    if (!k.traits.includes('Leadership')) k.traits.push('Leadership');

    const factionId = k.factionId;
    k.protegeId = null;
    c.bondedYear = undefined;
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'graduated',
      politicianId: c.id, mentorId: k.id, protegeId: c.id,
      factionId, trigger,
    });
    graduated++;
  }

  // Phase 5: CPU auto-assign — CPU factions only; same-state-gated; free.
  for (const k of snap.politicians) {
    if (!k.factionId || k.deathYear || k.retiredYear) continue;
    if (!k.traits.includes('Kingmaker')) continue;
    if (k.protegeId) continue;
    if (k.factionId === snap.game.playerFactionId) continue;
    const candidates = protegeCandidates(snap, k.id);
    if (candidates.length === 0) continue;
    const c = pick(candidates);
    k.protegeId = c.id;
    c.bondedYear = snap.game.year;
    recordKingmaker(snap, {
      year: snap.game.year, kind: 'bonded',
      politicianId: c.id, mentorId: k.id, protegeId: c.id,
      factionId: k.factionId, actor: 'cpu',
    });
    bonded++;
  }

  // Phase 6: PV refresh — trait grants + command/trait graduation payoffs.
  snap.politicians = refreshPv(snap.politicians);

  // Phase 7: conditional summary log.
  if (anointed + bonded + graduated + dissolved > 0) {
    addLog(snap, '2.1.7', 'system', `Mentorship: ${anointed} anointed; ${bonded} bonds formed; ${graduated} graduated; ${dissolved} dissolved.`);
  }
}

// ============================================================================
// 2.1.8 Faction Alignment Drift
// ============================================================================

// Additive per-voter bias when a bill's interest-group impacts overlap the
// faction's held interest cards (or lobby cards via lobbyToInterest proxy).
export function cardVoteBias(
  snap: FullGameSnapshot,
  factionId: string | null,
  impacts: { id: string; delta: number }[] | undefined,
): number {
  if (!factionId || !impacts || impacts.length === 0) return 0;
  const faction = snap.factions.find((f) => f.id === factionId);
  if (!faction) return 0;
  let total = 0;
  for (const imp of impacts) {
    const heldAsInterest = (faction.interestCards as readonly string[]).includes(imp.id);
    const heldAsLobby = faction.lobbyCards.some(
      (l) => ALIGNMENT_RULES.lobbyToInterest[l] === imp.id,
    );
    if (heldAsInterest || heldAsLobby) {
      total += ALIGNMENT_RULES.cardBiasPerDelta * imp.delta;
    }
  }
  return total;
}

// Per-candidate election-share bias from faction's currently-held cards,
// summed over live interestGroup scores; capped ±electionBiasCap.
export function electionFactionBias(snap: FullGameSnapshot, factionId: string | null, candidateId?: string): number {
  if (!factionId) return 0;
  const faction = snap.factions.find((f) => f.id === factionId);
  if (!faction) return 0;
  let score = 0;
  for (const ic of faction.interestCards) {
    score += snap.game.interestGroups[ic] ?? 0;
  }
  for (const lc of faction.lobbyCards) {
    const proxy = ALIGNMENT_RULES.lobbyToInterest[lc];
    if (proxy) score += snap.game.interestGroups[proxy] ?? 0;
  }
  const raw = ALIGNMENT_RULES.electionBiasPerScore * score;
  let bias = clamp(raw, -ALIGNMENT_RULES.electionBiasCap, ALIGNMENT_RULES.electionBiasCap);
  if (
    candidateId != null
    && faction.leaderId === candidateId
    && snap.game.currentEra !== 'independence'
  ) {
    bias *= LEADERSHIP_RULES.electionOnBallotMul;
  }
  return bias;
}

function recordFactionLeadership(snap: FullGameSnapshot, entry: FactionLeadershipEntry): void {
  if (!snap.game.factionLeadership) snap.game.factionLeadership = [];
  const arr = snap.game.factionLeadership;
  arr.push(entry);
  if (arr.length > LEADERSHIP_FEED_CAP) arr.splice(0, arr.length - LEADERSHIP_FEED_CAP);
}

function recordAlignmentDrift(snap: FullGameSnapshot, entry: FactionAlignmentDriftEntry): void {
  if (!snap.game.factionAlignmentDrift) snap.game.factionAlignmentDrift = [];
  const arr = snap.game.factionAlignmentDrift;
  arr.push(entry);
  if (arr.length > ALIGNMENT_DRIFT_CAP) arr.splice(0, arr.length - ALIGNMENT_DRIFT_CAP);
}

export function runPhase_2_1_8_FactionPersonalities(snap: FullGameSnapshot): void {
  if (!snap.game.factionAlignmentDrift) snap.game.factionAlignmentDrift = [];
  if (!snap.game.alignmentStability) snap.game.alignmentStability = {};
  const stability = snap.game.alignmentStability;
  const year = snap.game.year;
  const K = ALIGNMENT_RULES.stableTurns;
  let personalityShifts = 0, added = 0, dropped = 0, swapped = 0;

  // Step 1: personality refresh from living-only factionCenter (bug fix).
  for (const f of snap.factions) {
    const center = factionCenter(snap, f.id);
    if (center === null) continue;
    const before = f.personality;
    const next: 'LW' | 'Center' | 'RW' =
      center < ALIGNMENT_RULES.personalityBuckets.lwMax ? 'LW' :
      center >= ALIGNMENT_RULES.personalityBuckets.rwMin ? 'RW' : 'Center';
    if (next !== before) {
      f.personality = next;
      delete stability[`${f.id}|__personality`]; // bucket change resets the ideology-swap clock
      recordAlignmentDrift(snap, {
        year, factionId: f.id, kind: 'personality-shift',
        fromPersonality: before, toPersonality: next,
      });
      personalityShifts++;
    }
  }

  // Step 2: per-faction card drift — ideology swap → interest drop+add → lobby drop+add.
  for (const f of snap.factions) {
    const center = factionCenter(snap, f.id);
    if (center === null) continue;
    const bucket: 'LW' | 'Center' | 'RW' =
      center < ALIGNMENT_RULES.personalityBuckets.lwMax ? 'LW' :
      center >= ALIGNMENT_RULES.personalityBuckets.rwMin ? 'RW' : 'Center';
    const dropK = K + (getFactionLeader(snap, f.id)?.traits.includes('Leadership')
      ? LEADERSHIP_RULES.leadershipDropStableTurnsBonus
      : 0);

    // 2a. IdeologyCard drift — K-stable bucket triggers one swap.
    const persoKey = `${f.id}|__personality`;
    const persoEntry = stability[persoKey];
    if (!persoEntry) {
      stability[persoKey] = { firstSeenYear: year };
    } else if (year - persoEntry.firstSeenYear >= K) {
      const outOfBucket = [...f.ideologyCards]
        .filter((c) => ALIGNMENT_RULES.ideologyCardBucket[c] !== bucket)
        .sort();
      const candidatesIn = (Object.keys(ALIGNMENT_RULES.ideologyCardBucket) as IdeologyCardId[])
        .filter((c) => ALIGNMENT_RULES.ideologyCardBucket[c] === bucket && !f.ideologyCards.includes(c))
        .sort();
      if (outOfBucket.length > 0 && candidatesIn.length > 0) {
        const fromCardId = outOfBucket[0];
        const cardId = candidatesIn[0];
        f.ideologyCards = f.ideologyCards.filter((c) => c !== fromCardId);
        f.ideologyCards.push(cardId);
        recordAlignmentDrift(snap, {
          year, factionId: f.id, kind: 'card-swapped', cardType: 'ideology',
          fromCardId, cardId, reason: 'realigned',
        });
        swapped++;
      }
    }

    // 2b. InterestCard drift — DROP then ADD.
    for (const c of [...f.interestCards]) {
      const score = snap.game.interestGroups[c] ?? 0;
      const key = `${f.id}|interest:${c}`;
      if (score <= ALIGNMENT_RULES.dropThreshold) {
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= dropK) {
          f.interestCards = f.interestCards.filter((x) => x !== c);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-dropped', cardType: 'interest',
            cardId: c, reason: 'crashed',
          });
          dropped++;
        }
      } else if (stability[key]) {
        delete stability[key];
      }
    }
    if (f.interestCards.length < ALIGNMENT_RULES.cardCapPerType) {
      const heldProxy = new Set(f.lobbyCards.map((l) => ALIGNMENT_RULES.lobbyToInterest[l]).filter(Boolean));
      const candidates = (Object.keys(ALIGNMENT_RULES.interestCardBucket) as InterestCardId[])
        .filter((cand) => !f.interestCards.includes(cand))
        .filter((cand) => !heldProxy.has(cand))
        .filter((cand) => (snap.game.interestGroups[cand] ?? 0) >= ALIGNMENT_RULES.addThreshold)
        .filter((cand) => ALIGNMENT_RULES.interestCardBucket[cand] === bucket)
        .sort();
      for (const cand of candidates) {
        const key = `${f.id}|interest:${cand}`;
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= K) {
          f.interestCards.push(cand);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-added', cardType: 'interest',
            cardId: cand, reason: 'emerging',
          });
          added++;
          break;
        }
      }
      for (const key of Object.keys(stability)) {
        if (!key.startsWith(`${f.id}|interest:`)) continue;
        const cardId = key.slice(`${f.id}|interest:`.length) as InterestCardId;
        if (f.interestCards.includes(cardId)) continue;
        const sc = snap.game.interestGroups[cardId] ?? 0;
        if (sc < ALIGNMENT_RULES.addThreshold && sc > ALIGNMENT_RULES.dropThreshold) {
          delete stability[key];
        }
      }
    }

    // 2c. LobbyCard drift — identical shape, proxy-scored, namespaced keys.
    for (const c of [...f.lobbyCards]) {
      const proxy = ALIGNMENT_RULES.lobbyToInterest[c];
      const score = snap.game.interestGroups[proxy] ?? 0;
      const key = `${f.id}|lobby:${c}`;
      if (score <= ALIGNMENT_RULES.dropThreshold) {
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= dropK) {
          f.lobbyCards = f.lobbyCards.filter((x) => x !== c);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-dropped', cardType: 'lobby',
            cardId: c, reason: 'crashed',
          });
          dropped++;
        }
      } else if (stability[key]) {
        delete stability[key];
      }
    }
    if (f.lobbyCards.length < ALIGNMENT_RULES.cardCapPerType) {
      const candidates = (Object.keys(ALIGNMENT_RULES.lobbyToInterest) as LobbyCardId[])
        .filter((cand) => !f.lobbyCards.includes(cand))
        .filter((cand) => {
          const proxy = ALIGNMENT_RULES.lobbyToInterest[cand];
          return (snap.game.interestGroups[proxy] ?? 0) >= ALIGNMENT_RULES.addThreshold;
        })
        .filter((cand) => {
          const proxy = ALIGNMENT_RULES.lobbyToInterest[cand];
          return ALIGNMENT_RULES.interestCardBucket[proxy] === bucket;
        })
        .sort();
      for (const cand of candidates) {
        const key = `${f.id}|lobby:${cand}`;
        const entry = stability[key];
        if (!entry) {
          stability[key] = { firstSeenYear: year };
        } else if (year - entry.firstSeenYear >= K) {
          f.lobbyCards.push(cand);
          delete stability[key];
          recordAlignmentDrift(snap, {
            year, factionId: f.id, kind: 'card-added', cardType: 'lobby',
            cardId: cand, reason: 'emerging',
          });
          added++;
          break;
        }
      }
      for (const key of Object.keys(stability)) {
        if (!key.startsWith(`${f.id}|lobby:`)) continue;
        const cardId = key.slice(`${f.id}|lobby:`.length) as LobbyCardId;
        if (f.lobbyCards.includes(cardId)) continue;
        const proxy = ALIGNMENT_RULES.lobbyToInterest[cardId];
        const sc = snap.game.interestGroups[proxy] ?? 0;
        if (sc < ALIGNMENT_RULES.addThreshold && sc > ALIGNMENT_RULES.dropThreshold) {
          delete stability[key];
        }
      }
    }
  }

  snap.politicians = refreshPv(snap.politicians);

  const total = personalityShifts + added + dropped + swapped;
  if (total > 0) {
    addLog(snap, '2.1.8', 'system',
      `Alignments: ${personalityShifts} personality shifts; ${added} added; ${dropped} dropped; ${swapped} swapped.`);
  }
}

// ============================================================================
// 2.2.1 Congressional Leadership (auto)
// ============================================================================
export function runPhase_2_2_1_CongressLeadership(snap: FullGameSnapshot): void {
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    // Election of CC President
    electCCPresident(snap);
    return;
  }
  // Determine majority party: count senators per party
  const senateMembers = snap.states.flatMap((s) => s.senators.map((sn) => snap.politicians.find((p) => p.id === sn.politicianId))).filter(Boolean) as Politician[];
  const houseMembers = snap.states.flatMap((s) => s.representativeIds.map((id) => snap.politicians.find((p) => p.id === id))).filter(Boolean) as Politician[];
  const senateBlue = senateMembers.filter((m) => m.partyId === 'BLUE').length;
  const senateRed = senateMembers.filter((m) => m.partyId === 'RED').length;
  const houseBlue = houseMembers.filter((m) => m.partyId === 'BLUE').length;
  const houseRed = houseMembers.filter((m) => m.partyId === 'RED').length;
  const senateMajority: PartyId = senateBlue >= senateRed ? 'BLUE' : 'RED';
  const houseMajority: PartyId = houseBlue >= houseRed ? 'BLUE' : 'RED';

  // Speaker = top PV House member of majority party
  const speakerCandidate = houseMembers
    .filter((m) => m.partyId === houseMajority)
    .sort((a, b) => b.pvCache - a.pvCache)[0];
  if (speakerCandidate) {
    snap.game.speakerId = speakerCandidate.id;
    addLog(snap, '2.2.1', 'appointment', `${speakerCandidate.firstName} ${speakerCandidate.lastName} elected Speaker of the House.`);
  }
  const proTemCandidate = senateMembers
    .filter((m) => m.partyId === senateMajority)
    .sort((a, b) => b.pvCache - a.pvCache)[0];
  if (proTemCandidate) {
    snap.game.proTemId = proTemCandidate.id;
    addLog(snap, '2.2.1', 'appointment', `${proTemCandidate.firstName} ${proTemCandidate.lastName} elected Senate Pro Tempore.`);
  }
}

// ============================================================================
// 2.2.2 Committee chairs (auto)
// ============================================================================
export function runPhase_2_2_2_Committees(snap: FullGameSnapshot): void {
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    appointCCCommittees(snap);
    return;
  }
  const committees: ('Domestic' | 'Foreign' | 'Economic' | 'Justice')[] = ['Domestic', 'Foreign', 'Economic', 'Justice'];
  const senateMembers = snap.states.flatMap((s) => s.senators.map((sn) => snap.politicians.find((p) => p.id === sn.politicianId))).filter(Boolean) as Politician[];
  const houseMembers = snap.states.flatMap((s) => s.representativeIds.map((id) => snap.politicians.find((p) => p.id === id))).filter(Boolean) as Politician[];
  const all = [...senateMembers, ...houseMembers];
  for (const c of committees) {
    const skillKey: keyof Politician['skills'] = c === 'Justice' ? 'judicial' : c === 'Economic' ? 'admin' : c === 'Foreign' ? 'admin' : 'legislative';
    const candidate = all.sort((a, b) => b.skills[skillKey] - a.skills[skillKey])[0];
    if (candidate) {
      snap.game.committeeChairs[c] = candidate.id;
      addLog(snap, '2.2.2', 'appointment', `${candidate.firstName} ${candidate.lastName} chairs ${c} committee.`);
    }
  }
}

// ============================================================================
// 2.2.3 Faction leaders (auto)
// ============================================================================
export function runPhase_2_2_3_FactionLeaders(snap: FullGameSnapshot): void {
  const year = snap.game.year;
  const era = snap.game.currentEra;
  const cfg = LEADERSHIP_RULES.eraConfig[era];

  // Step 0: Failed Bid decay sweep.
  for (const p of snap.politicians) {
    if (p.failedBidExpiresYear !== undefined && year >= p.failedBidExpiresYear) {
      p.traits = p.traits.filter((t) => t !== 'Failed Bid');
      p.failedBidExpiresYear = undefined;
    }
  }

  // Step 1: Ambitious seed pass (one-shot lazy; matches 2.1.5/2.1.6 pattern).
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear || p.ambitiousSeeded) continue;
    if (chance(LEADERSHIP_RULES.ambitiousSeedRate)) {
      if (!p.traits.includes('Ambitious')) p.traits.push('Ambitious');
    }
    p.ambitiousSeeded = true;
  }

  // Steps 2 & 3: per-faction validation + Election OR Challenge (mutually exclusive).
  let challenges = 0, unseated = 0, newSeats = 0;
  for (const f of snap.factions) {
    const current = f.leaderId
      ? snap.politicians.find((p) => p.id === f.leaderId) ?? null
      : null;
    const invalid =
      !current
      || !!current.deathYear
      || !!current.retiredYear
      || current.factionId !== f.id
      || current.factionLeaderOf !== f.id;

    if (invalid) {
      // Step 2 path: Election (no incumbent OR invalidation).
      if (current && current.factionLeaderOf === f.id) {
        current.factionLeaderOf = null;
      }
      const center = factionCenter(snap, f.id);
      const eligible = snap.politicians.filter((p) =>
        !p.deathYear && !p.retiredYear
        && p.factionId === f.id
        && !p.traits.includes('Failed Bid'),
      );
      const scoreOf = (p: Politician): number => {
        const idol = IDEOLOGY_ORDER.indexOf(p.ideology);
        const fitPenalty = center !== null
          ? LEADERSHIP_RULES.fitPenalty * Math.abs(idol - center)
          : 0;
        const posCount = p.traits.filter((t) => POSITIVE_TRAITS.includes(t)).length;
        const traitBonus = Math.min(
          LEADERSHIP_RULES.traitBonusCap,
          LEADERSHIP_RULES.traitBonusPerPositive * posCount,
        );
        return p.pvCache - fitPenalty + traitBonus;
      };
      eligible.sort((a, b) => {
        const sa = scoreOf(a), sb = scoreOf(b);
        if (sa !== sb) return sb - sa;
        return a.id.localeCompare(b.id);
      });
      const winner = eligible[0] ?? null;
      if (winner) {
        const formerLeaderId = current?.id;
        f.leaderId = winner.id;
        f.leadershipStartYear = year;
        winner.factionLeaderOf = f.id;
        recordFactionLeadership(snap, {
          year, factionId: f.id, kind: 'installed',
          leaderId: winner.id,
          formerLeaderId,
          reason: 'election',
        });
        addLog(snap, '2.2.3', 'appointment',
          `${winner.firstName} ${winner.lastName} elected to lead the ${f.name}.`);
        newSeats++;
      } else {
        f.leaderId = null;
        f.leadershipStartYear = undefined;
      }
      continue;
    }

    // Step 3 path: Challenge roll (only on valid incumbent).
    const leader = current!;
    const pool = snap.politicians.filter((p) =>
      !p.deathYear && !p.retiredYear
      && p.factionId === f.id
      && p.id !== leader.id
      && p.pvCache >= LEADERSHIP_RULES.challengerPvFloor
      && !p.traits.includes('Failed Bid'),
    );
    if (pool.length === 0) continue;
    pool.sort((a, b) =>
      a.pvCache !== b.pvCache ? b.pvCache - a.pvCache : a.id.localeCompare(b.id),
    );
    const challenger = pool[0];

    const center = factionCenter(snap, f.id) ?? IDEOLOGY_ORDER.indexOf(leader.ideology);
    const ideoDist = Math.abs(IDEOLOGY_ORDER.indexOf(leader.ideology) - center);
    const pvGap = Math.max(0, (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer);
    const ideologyTrigger = ideoDist / 6;
    const patronageTrigger = pvGap;
    let fireRaw = cfg.baseFireChance
      + cfg.ideologyTriggerWeight * ideologyTrigger
      + cfg.patronageTriggerWeight * patronageTrigger;
    if (challenger.traits.includes('Ambitious')) fireRaw += LEADERSHIP_RULES.ambitiousFireBonus;
    const fireChance = clamp(fireRaw, 0, LEADERSHIP_RULES.fireCap);

    if (!chance(fireChance)) continue;

    challenges++;
    const edge = (challenger.pvCache - leader.pvCache) / LEADERSHIP_RULES.scoreNormalizer;
    const successChance = clamp(0.5 + edge - cfg.incumbencyAdvantage / 100, 0.05, 0.95);

    if (chance(successChance)) {
      leader.factionLeaderOf = null;
      challenger.factionLeaderOf = f.id;
      f.leaderId = challenger.id;
      f.leadershipStartYear = year;
      recordFactionLeadership(snap, {
        year, factionId: f.id, kind: 'challenged',
        leaderId: challenger.id, formerLeaderId: leader.id,
        challengerId: challenger.id, success: true, reason: 'challenge-win',
      });
      addLog(snap, '2.2.3', 'appointment',
        `${challenger.firstName} ${challenger.lastName} unseats ${leader.firstName} ${leader.lastName} as leader of the ${f.name}.`);
      unseated++;
    } else {
      if (!challenger.traits.includes('Failed Bid')) challenger.traits.push('Failed Bid');
      challenger.failedBidExpiresYear = year + 2 * LEADERSHIP_RULES.failedBidDecayTurns;
      recordFactionLeadership(snap, {
        year, factionId: f.id, kind: 'challenged',
        challengerId: challenger.id, success: false, reason: 'challenge-loss',
      });
      addLog(snap, '2.2.3', 'appointment',
        `${challenger.firstName} ${challenger.lastName}'s bid to lead the ${f.name} fails; the chair holds.`);
    }
  }

  // Step 4: single refreshPv at end.
  snap.politicians = refreshPv(snap.politicians);

  // Step 5: end-of-phase invariant check.
  for (const f of snap.factions) {
    if (f.leaderId) continue;
    const hasEligible = snap.politicians.some((p) =>
      p.factionId === f.id && !p.deathYear && !p.retiredYear && !p.traits.includes('Failed Bid'),
    );
    if (hasEligible) {
      addLog(snap, '2.2.3', 'system', `No eligible leader for ${f.name}.`);
    }
  }

  if (challenges + newSeats > 0) {
    addLog(snap, '2.2.3', 'system',
      `Leadership: ${challenges} challenges resolved (${unseated} unseated); ${newSeats} new leaders installed.`);
  }
}

// ============================================================================
// 2.2.4 Party leaders
// ============================================================================
export function runPhase_2_2_4_PartyLeaders(snap: FullGameSnapshot): void {
  for (const party of snap.parties) {
    if (snap.game.presidentId) {
      const pres = snap.politicians.find((p) => p.id === snap.game.presidentId);
      if (pres && pres.partyId === party.id) {
        party.leaderId = pres.id;
        continue;
      }
    }
    const members = snap.politicians.filter((p) => p.partyId === party.id);
    members.sort((a, b) => b.pvCache - a.pvCache);
    party.leaderId = members[0]?.id ?? null;
    if (party.leaderId) {
      const ldr = snap.politicians.find((p) => p.id === party.leaderId);
      if (ldr) addLog(snap, '2.2.4', 'appointment', `${ldr.firstName} ${ldr.lastName} leads the ${party.name}.`);
    }
  }
}

// ============================================================================
// 2.3.1 Cabinet (auto for CPU)
// ============================================================================
export function runPhase_2_3_1_Cabinet(snap: FullGameSnapshot): void {
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (!president) return;
  const partyId = president.partyId;
  const positions: (keyof typeof snap.game.cabinet)[] = ['SecretaryOfState', 'SecretaryOfTreasury', 'SecretaryOfWar', 'AttorneyGeneral', 'PostmasterGeneral', 'KeyAdvisor'];
  for (const pos of positions) {
    if (snap.game.cabinet[pos]) continue;
    const candidates = snap.politicians.filter((p) => p.partyId === partyId && !p.currentOffice && p.age < 75);
    candidates.sort((a, b) => b.skills.admin - a.skills.admin);
    const pick = candidates[0];
    if (pick) {
      snap.game.cabinet[pos] = pick.id;
      pick.currentOffice = { type: pos as 'SecretaryOfState' };
      addLog(snap, '2.3.1', 'appointment', `${pick.firstName} ${pick.lastName} confirmed as ${pos}.`);
    }
  }
}

// ============================================================================
// 2.3.2 Military
// ============================================================================
export function runPhase_2_3_2_Military(snap: FullGameSnapshot): void {
  if (!snap.game.cabinet.GeneralInChief) {
    const candidates = snap.politicians.filter((p) => !p.currentOffice && p.skills.military >= 3);
    candidates.sort((a, b) => b.skills.military - a.skills.military);
    if (candidates[0]) {
      snap.game.cabinet.GeneralInChief = candidates[0].id;
      candidates[0].currentOffice = { type: 'GeneralInChief' };
      addLog(snap, '2.3.2', 'appointment', `${candidates[0].firstName} ${candidates[0].lastName} appointed General in Chief.`);
    }
  }
  if (!snap.game.cabinet.Admiral) {
    const navalCandidates = snap.politicians.filter((p) => !p.currentOffice && (p.skills.military >= 2 || p.traits.includes('Naval')));
    navalCandidates.sort((a, b) => b.skills.military - a.skills.military);
    if (navalCandidates[0]) {
      snap.game.cabinet.Admiral = navalCandidates[0].id;
      navalCandidates[0].currentOffice = { type: 'Admiral' };
      addLog(snap, '2.3.2', 'appointment', `${navalCandidates[0].firstName} ${navalCandidates[0].lastName} appointed Admiral.`);
    }
  }
}

// Proactive cleanup invoked at every 2.4.1 death/retire transition.
// Closes the 1-turn window between this phase and the next 2.2.3 / 2.1.7
// validation sweeps. Read-site defenses already cover correctness; this
// keeps DevTools state clean and removes a future-foot-gun.
function cleanupLeadershipAndProtegeChains(snap: FullGameSnapshot, p: Politician): void {
  if (p.factionLeaderOf != null) {
    const f = snap.factions.find((ff) => ff.id === p.factionLeaderOf);
    if (f) {
      f.leaderId = null;
      f.leadershipStartYear = undefined;
    }
    p.factionLeaderOf = null;
  }

  if (p.protegeId) {
    const protege = snap.politicians.find((q) => q.id === p.protegeId);
    if (protege) protege.bondedYear = undefined;
    p.protegeId = null;
  }

  for (const q of snap.politicians) {
    if (q.protegeId === p.id) {
      q.protegeId = null;
    }
  }
}

// Shared by 2.4.1 (deaths/retirements) and 2.4.2 (anytime-events death/forceRetire).
function markPoliticianDead(snap: FullGameSnapshot, p: Politician): void {
  cleanupLeadershipAndProtegeChains(snap, p);
  vacateOffice(snap, p);
}

function markPoliticianRetired(snap: FullGameSnapshot, p: Politician): void {
  cleanupLeadershipAndProtegeChains(snap, p);
  vacateOffice(snap, p);
}

// ============================================================================
// 2.4.1 Deaths & Retirements
// ============================================================================
export function runPhase_2_4_1_Deaths(snap: FullGameSnapshot): void {
  const cfg = MORTALITY_RULES.eraConfig[snap.game.currentEra];

  const deathRateFor = (age: number): number => {
    for (const b of MORTALITY_RULES.deathBracket) {
      if (age >= b.minAge) return b.rate;
    }
    return 0;
  };
  const retireRateFor = (age: number): number => {
    for (const b of MORTALITY_RULES.retireBracket) {
      if (age >= b.minAge) return b.rate;
    }
    return 0;
  };

  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;

    const baseDeath = deathRateFor(p.age);
    const frailMult = p.traits.includes('Frail') ? MORTALITY_RULES.frailDeathMult : 1;
    const crisisMult = p.traits.includes('Crisis Manager') ? MORTALITY_RULES.crisisManagerDeathMult : 1;
    const deathChance = clamp(baseDeath * cfg.deathMult * frailMult * crisisMult, 0, 1);

    if (chance(deathChance)) {
      p.deathYear = snap.game.year;
      addLog(snap, '2.4.1', 'death', `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has died.`);
      markPoliticianDead(snap, p);
      continue;
    }

    const retireChance = clamp(retireRateFor(p.age) * cfg.retireMult, 0, 1);
    if (chance(retireChance)) {
      p.retiredYear = snap.game.year;
      addLog(snap, '2.4.1', 'retire', `${p.firstName} ${p.lastName} (${p.state.toUpperCase()}, age ${p.age}) has retired.`);
      markPoliticianRetired(snap, p);
    }
  }

  snap.politicians = refreshPv(snap.politicians);
}

function vacateOffice(snap: FullGameSnapshot, p: Politician): void {
  if (!p.currentOffice) return;
  const t = p.currentOffice.type;
  if (t === 'President') snap.game.presidentId = null;
  if (t === 'VicePresident') snap.game.vicePresidentId = null;
  if (t === 'SpeakerOfHouse') snap.game.speakerId = null;
  if (t === 'SenateProTem') snap.game.proTemId = null;
  if (t === 'ChiefJustice') snap.game.chiefJusticeId = null;
  if (t === 'AssociateJustice') snap.game.supremeCourtIds = snap.game.supremeCourtIds.filter((id) => id !== p.id);
  if (t === 'Senator') {
    for (const s of snap.states) {
      s.senators = s.senators.filter((sn) => sn.politicianId !== p.id);
    }
  }
  if (t === 'Representative') {
    for (const s of snap.states) {
      s.representativeIds = s.representativeIds.filter((id) => id !== p.id);
    }
  }
  if (t === 'Governor') {
    for (const s of snap.states) {
      if (s.governorId === p.id) s.governorId = null;
    }
  }
  if (t === 'CCPresident' && snap.game.continentalCongress) {
    snap.game.continentalCongress.presidentId = null;
  }
  // cabinet
  for (const k of Object.keys(snap.game.cabinet) as (keyof typeof snap.game.cabinet)[]) {
    if (snap.game.cabinet[k] === p.id) snap.game.cabinet[k] = null;
  }
  p.currentOffice = null;
}

// ============================================================================
// 2.4.2 Anytime events
// ============================================================================

let anytimeValidatorRan = false;

function validateAnytimeTemplates(): void {
  if (anytimeValidatorRan) return;
  anytimeValidatorRan = true;

  const FORBIDDEN_TRAITS: Trait[] = [
    'Ideologue', 'Impressionable', 'Flip-Flopper',
    'Loyal', 'Opportunist',
    'Carpetbagger', 'Outsider',
    'Ambitious', 'Failed Bid',
    'Kingmaker', 'Manipulative', 'Numberfudger',
    'Leadership', 'Debater', 'Reformist', 'Integrity',
    'Efficient', 'Magician', 'Harmonious', 'Egghead',
    'Propagandist',
    'Naval', 'Military', 'Education', 'Economics', 'Business',
    'Agriculture', 'Environment', 'Media', 'Nationalist',
    'Globalist', 'Celebrity',
    'Traitor', 'Obscure', 'Puritan',
  ];
  const FORBIDDEN_SKILLS: SkillKey[] = ['admin', 'judicial', 'military', 'backroom'];
  const SCANDAL_CATS = new Set(['scandal-financial', 'scandal-sexual', 'scandal-verbal']);

  for (const t of ANYTIME_EVENT_TEMPLATES) {
    let hasMutator = false;
    for (const e of t.effects) {
      if (e.kind === 'grantTrait' && FORBIDDEN_TRAITS.includes(e.trait)) {
        throw new Error(`anytime template ${t.id} grants forbidden trait ${e.trait}`);
      }
      if (e.kind === 'skillBump' && FORBIDDEN_SKILLS.includes(e.skill)) {
        throw new Error(`anytime template ${t.id} bumps forbidden skill ${e.skill}`);
      }
      if (e.kind === 'grantTrait' || e.kind === 'skillBump' || e.kind === 'commandBump' || e.kind === 'death' || e.kind === 'forceRetire') {
        hasMutator = true;
      }
    }
    if (SCANDAL_CATS.has(t.category) && !t.scandalScaled) {
      throw new Error(`scandal template ${t.id} missing scandalScaled: true`);
    }
    if (t.scandalScaled && !SCANDAL_CATS.has(t.category)) {
      throw new Error(`non-scandal template ${t.id} has scandalScaled: true`);
    }
    const hasPv = t.effects.some((e) => e.kind === 'pvHit' || e.kind === 'pvBump');
    if (hasPv && !hasMutator) {
      throw new Error(`anytime template ${t.id} has pvHit/pvBump without trait/skill/command/death/forceRetire sibling`);
    }
    if (t.eras?.length === 1 && t.eras[0] === 'independence') {
      if (t.category === 'transport-accident' && /\b(auto|train|plane|rail)\b/i.test(t.text)) {
        throw new Error(`anytime template ${t.id} anachronism: independence transport-accident mentions modern transit`);
      }
      if (t.category === 'illness-epidemic' && /\b(polio|flu)\b/i.test(t.text)) {
        throw new Error(`anytime template ${t.id} anachronism: independence epidemic mentions polio/flu`);
      }
    }
    if (t.eras?.length === 1 && t.eras[0] === 'modern') {
      if (t.category === 'violence-duel') {
        throw new Error(`anytime template ${t.id} anachronism: modern duel`);
      }
      if (t.category === 'illness-epidemic' && /\b(yellow fever|cholera)\b/i.test(t.text)) {
        throw new Error(`anytime template ${t.id} anachronism: modern epidemic mentions yellow fever/cholera`);
      }
    }
  }

  const NATIONAL_SCANDAL_CATS = new Set(['civic-executive-scandal']);
  const seedIds = new Set([
    'national:bumper-harvest',
    'national:railroad-accident',
    'national:patriotic-groundswell',
    'national:immigration-wave',
    'national:treasury-scandal',
  ]);
  for (const t of ANYTIME_NATIONAL_TEMPLATES) {
    if (t.scandalScaled && !NATIONAL_SCANDAL_CATS.has(t.category)) {
      throw new Error(`national template ${t.id} has scandalScaled but is not civic-executive-scandal`);
    }
    if (t.category === 'cultural-technology' && t.eras?.includes('independence')) {
      if (/\b(telegraph|radio|tv|internet|automobile|plane|railroad)\b/i.test(t.text)) {
        throw new Error(`national template ${t.id} anachronism: independence cultural-technology mentions modern tech`);
      }
    }
    if (t.category === 'natural-epidemic' && t.eras?.length === 1 && t.eras[0] === 'independence') {
      if (/\b(polio|1918 flu|modern pandemic)\b/i.test(t.text)) {
        throw new Error(`national template ${t.id} anachronism: independence natural-epidemic mentions modern disease`);
      }
    }
    if (t.category === 'economic-panic' && t.eras?.includes('independence')) {
      throw new Error(`national template ${t.id} anachronism: independence economic-panic`);
    }
  }
  for (const id of seedIds) {
    if (!ANYTIME_NATIONAL_TEMPLATES.some((t) => t.id === id)) {
      throw new Error(`national pool missing stub-seed id ${id}`);
    }
  }
}

function applyNationalEffects(
  snap: FullGameSnapshot,
  tpl: AnytimeNationalTemplate,
  cfg: typeof ANYTIME_EVENTS_RULES.eraConfig[Era],
): void {
  const scandalMult = tpl.scandalScaled ? cfg.scandalMagnitudeMult : 1;
  for (const eff of tpl.effects) {
    switch (eff.kind) {
      case 'meterTick': {
        snap.game.meters[eff.meter] = clamp(
          snap.game.meters[eff.meter] + eff.amount * scandalMult,
          ANYTIME_EVENTS_RULES.meterClampLow,
          ANYTIME_EVENTS_RULES.meterClampHigh,
        );
        break;
      }
      case 'interestTick': {
        snap.game.interestGroups[eff.group] =
          (snap.game.interestGroups[eff.group] ?? 0) + eff.amount;
        break;
      }
      case 'partyPref': {
        snap.game.partyPreference = clamp(
          snap.game.partyPreference + eff.amount * scandalMult,
          ANYTIME_EVENTS_RULES.partyPreferenceClampLow,
          ANYTIME_EVENTS_RULES.partyPreferenceClampHigh,
        );
        break;
      }
      case 'stateBias': {
        if (!tpl.regions) break;
        for (const s of snap.states) {
          if (tpl.regions.includes(s.region)) {
            s.bias = clamp(s.bias + eff.amount, -1, 1);
          }
        }
        break;
      }
    }
  }
}

function rollNationalEvent(
  snap: FullGameSnapshot,
  era: Era,
  cfg: typeof ANYTIME_EVENTS_RULES.eraConfig[Era],
): void {
  const fireChance = ANYTIME_EVENTS_RULES.nationalBaseFireChance * cfg.nationalFireMult;
  if (!chance(fireChance)) return;

  const eligible = ANYTIME_NATIONAL_TEMPLATES.filter((t) => !t.eras || t.eras.includes(era));
  if (eligible.length === 0) return;

  const tpl = pickWeighted(eligible.map((t) => ({
    value: t,
    weight: t.weight * (t.eraWeightMult?.[era] ?? 1),
  })));

  applyNationalEffects(snap, tpl, cfg);

  const text = tpl.text
    .replace('{era}', era)
    .replace('{region}', tpl.regions?.join('/') ?? 'the country');

  addLog(snap, '2.4.2', 'event', text, {
    templateId: tpl.id,
    pool: 'national',
    category: tpl.category,
  });
}

function rollPersonalEvents(
  snap: FullGameSnapshot,
  era: Era,
  cfg: typeof ANYTIME_EVENTS_RULES.eraConfig[Era],
): boolean {
  const fireChance = ANYTIME_EVENTS_RULES.baseFireChance * cfg.fireMult;
  let mutated = false;

  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    if (!chance(fireChance)) continue;

    const region = snap.states.find((s) => s.id === p.state)?.region;
    const pool = ANYTIME_EVENT_TEMPLATES.filter((t) => {
      if (t.eras && !t.eras.includes(era)) return false;
      if (t.regions && (!region || !t.regions.includes(region))) return false;
      return true;
    });
    if (pool.length === 0) continue;

    const tpl = pickWeighted(pool.map((t) => ({
      value: t,
      weight: t.weight * (t.eraWeightMult?.[era] ?? 1),
    })));

    let didMutate = false;
    for (const eff of tpl.effects) {
      switch (eff.kind) {
        case 'grantTrait':
          if (!p.traits.includes(eff.trait)) {
            p.traits.push(eff.trait);
            didMutate = true;
          }
          break;
        case 'skillBump':
          if (p.skills[eff.skill] < ANYTIME_EVENTS_RULES.skillCap) {
            p.skills[eff.skill] = clamp(
              p.skills[eff.skill] + eff.amount, 0, ANYTIME_EVENTS_RULES.skillCap,
            );
            didMutate = true;
          }
          break;
        case 'commandBump':
          if (p.command < ANYTIME_EVENTS_RULES.commandCap) {
            p.command = clamp(
              p.command + eff.amount, 0, ANYTIME_EVENTS_RULES.commandCap,
            );
            didMutate = true;
          }
          break;
        case 'death':
          p.deathYear = snap.game.year;
          markPoliticianDead(snap, p);
          didMutate = true;
          break;
        case 'forceRetire':
          p.retiredYear = snap.game.year;
          markPoliticianRetired(snap, p);
          didMutate = true;
          break;
        case 'pvHit':
        case 'pvBump':
          break;
      }
    }

    if (tpl.scandalScaled) {
      const mult = cfg.scandalMagnitudeMult;
      if (mult >= 1.0 && !p.traits.includes('Corrupt')) {
        p.traits.push('Corrupt');
        didMutate = true;
      }
      if (mult >= 1.2) {
        p.flipFlopperPenalty += LEADERSHIP_RULES.failedBidPvStamp;
        didMutate = true;
      }
    }

    if (didMutate) mutated = true;

    const pvEff = tpl.effects.find((e) => e.kind === 'pvHit' || e.kind === 'pvBump');
    const text = tpl.text
      .replace('{first}', p.firstName)
      .replace('{last}', p.lastName)
      .replace('{state}', p.state.toUpperCase());

    addLog(snap, '2.4.2', 'event', text, {
      templateId: tpl.id,
      politicianId: p.id,
      pool: 'personal',
      category: tpl.category,
      pvDelta: pvEff && (pvEff.kind === 'pvHit' || pvEff.kind === 'pvBump') ? pvEff.amount : undefined,
    });
  }

  return mutated;
}

export function runPhase_2_4_2_Anytime(snap: FullGameSnapshot): void {
  if (import.meta.env.DEV) validateAnytimeTemplates();
  const era = snap.game.currentEra;
  const cfg = ANYTIME_EVENTS_RULES.eraConfig[era];

  rollNationalEvent(snap, era, cfg);
  const mutatedAny = rollPersonalEvents(snap, era, cfg);

  if (mutatedAny) snap.politicians = refreshPv(snap.politicians);
}

// ============================================================================
// 2.4.3 Era events
// ============================================================================
export function runPhase_2_4_3_Era(snap: FullGameSnapshot): EraEvent | null {
  if (snap.game.scenarioId === '1772') {
    if (import.meta.env.DEV) validateEraGraph();
    if (snap.game.gameEnded) return null; // an ending already fired
    // Walk the graph. Foreign-actor (auto) nodes and nodes whose decider the
    // player doesn't control are auto-resolved in the engine (by the
    // controlling faction's ideology); the first player-controlled decision is
    // returned for the modal. An ending short-circuits the loop (AC 29).
    let event = selectEraGraphNode(snap);
    while (event && isAutoResolved(snap, event)) {
      const respId = pickAIResponse(snap, event);
      resolveEraEvent(snap, event.id, respId);
      if (snap.game.gameEnded) return null;
      event = selectEraGraphNode(snap);
    }
    return event ?? null;
  }
  if (snap.game.pendingEraEvents.length === 0) {
    const fresh = buildEraEventsForYear(snap.game.year);
    snap.game.pendingEraEvents = fresh;
  }
  const next = snap.game.pendingEraEvents.find((e) => !e.resolved);
  return next ?? null;
}

export function resolveEraEvent(snap: FullGameSnapshot, eventId: string, responseId: string): void {
  const event = snap.game.pendingEraEvents.find((e) => e.id === eventId);
  if (!event) return;
  const resp = event.responses.find((r) => r.id === responseId);
  if (!resp) return;
  // For the 1772 graph: a node not controlled by the player was resolved by the
  // AI (tag the feed so the Era Events page can badge it). Computed BEFORE we
  // mark resolved/applyEffect, since control depends on current state.
  const aiResolved = snap.game.scenarioId === '1772' && isAutoResolved(snap, event);
  applyEffect(snap, resp.effect);
  event.resolved = true;
  event.chosenResponseId = responseId;
  addLog(snap, '2.4.3', 'event', `${event.title}: ${resp.label}. ${resp.effect.text}`, { eraEvent: true, templateId: event.templateId, aiResolved });
  // Track completion for scripted scenarios
  if (event.templateId) snap.game.eraEventsCompleted.push(event.templateId);

  // Handle 1772-specific consequences
  if (snap.game.scenarioId === '1772') {
    handleScripted1772Consequences(snap, event, responseId);
  }

  // Generic engine-side postEffects dispatcher.
  applyPostEffects(snap, event);

  // Generic unlocks
  if (event.unlocks?.includes('governors')) {
    snap.game.governorsExist = true;
    // Promote colonies to states
    for (const s of snap.states) s.isColony = false;
    addLog(snap, '2.4.3', 'system', 'Governors will now be elected. The colonies are now states.');
  }

  // Terminal endings: consume triggersGameEnd (no existing consumer — the
  // GameOverScreen gate reads game.gameEnded). Set once.
  if (event.triggersGameEnd && !snap.game.gameEnded) {
    snap.game.gameEnded = { year: snap.game.year, reason: event.title, templateId: event.templateId ?? event.id };
    addLog(snap, '2.4.3', 'system', `The campaign ends: ${event.title}.`);
  }
}

function applyPostEffects(snap: FullGameSnapshot, event: EraEvent): void {
  if (!event.postEffects || event.postEffects.length === 0) return;
  for (const pe of event.postEffects) {
    switch (pe.type) {
      case 'assembleCC': {
        const ccExisting = snap.game.continentalCongress;
        if (ccExisting && ccExisting.delegates.length > 0) break;
        // 1772 First-CC gate-swap: defer to phase 2.9.6's interactive builder
        // when the Intolerable Acts -> "Convene CC" path is the trigger.
        if (
          snap.game.scenarioId === '1772'
          && event.templateId === 'intolerable_acts'
          && event.chosenResponseId === 'ok'
        ) {
          addLog(snap, '2.4.3', 'system',
            'The First Continental Congress is called to meet at Philadelphia. Delegations will be chosen by the colonies.');
          break;
        }
        appointDelegates(snap);
        electCCPresident(snap);
        appointCCCommittees(snap);
        const cc = snap.game.continentalCongress;
        if (cc) cc.assemblyOrdinal = 1;
        addLog(snap, '2.4.3', 'appointment', `First Continental Congress convenes in Philadelphia. Delegates from ${snap.states.length} colonies.`);
        break;
      }
      default:
        addLog(snap, '2.4.3', 'system', `Unhandled postEffect type: ${pe.type}.`);
        break;
    }
  }
}

function handleScripted1772Consequences(snap: FullGameSnapshot, event: EraEvent, responseId: string): void {
  switch (event.templateId) {
    case 'boston_tea_party': {
      // Sam Adams (LW Blue faction leader) gains Celebrity
      const samAdams = snap.politicians.find((p) => p.firstName === 'Samuel' && p.lastName === 'Adams');
      if (samAdams && !samAdams.traits.includes('Celebrity')) {
        samAdams.traits.push('Celebrity');
        addLog(snap, '2.4.3', 'event', 'Samuel Adams gains the Celebrity trait.');
      }
      break;
    }
    case 'common_sense': {
      const paine = snap.politicians.find((p) => p.firstName === 'Thomas' && p.lastName === 'Paine');
      if (paine) {
        if (!paine.traits.includes('Celebrity')) paine.traits.push('Celebrity');
        paine.traits = paine.traits.filter((t) => t !== 'Obscure');
      }
      break;
    }
    case 'lexington_concord': {
      if (responseId === 'a') {
        startRevWar(snap);
      }
      break;
    }
    case 'declaration_of_independence': {
      snap.game.governorsExist = true;
      for (const s of snap.states) s.isColony = false;
      break;
    }
    case 'articles_of_confederation': {
      snap.game.articlesOfConfederation = true;
      const cc = snap.game.continentalCongress;
      if (cc) {
        const oldPres = cc.presidentId ? snap.politicians.find((p) => p.id === cc.presidentId) : null;
        if (oldPres && oldPres.currentOffice?.type === 'CCPresident') oldPres.currentOffice = null;
        cc.presidentId = null;
        electCCPresident(snap);
        addLog(snap, '2.4.3', 'appointment', 'The Confederation Congress elects its first President.');
      }
      break;
    }
    case 'french_alliance': {
      if (responseId === 'a') {
        applyFrenchAlliance(snap);
        // Narrative-only (CP1-WAR): recorded/shown in flavor; NO revolutionaryWar.ts
        // hook forces the outcome. (The war engine already blocks a loss while
        // war.frenchAlliance is set.)
        snap.game.graphFlags = { ...snap.game.graphFlags, warVictoryGuaranteed: true };
      }
      break;
    }
    case 'dutch_recognition': {
      // The only in-era finance flag: foreign credit, not a national bank.
      snap.game.graphFlags = { ...snap.game.graphFlags, loansEnabled: true };
      break;
    }
    case 'vermont_statehood': {
      if (responseId === 'a') admitState(snap, 'vt');
      break;
    }
    case 'treaty_of_paris': {
      applyTreatyOfParis(snap);
      // Add western territories: OH KY TN MS AL as undeveloped territories
      const territories: { id: string; name: string; abbr: string; region: 'Northeast' | 'Midwest' | 'South' | 'West' | 'Border' }[] = [
        { id: 'oh', name: 'Ohio Territory', abbr: 'OH', region: 'Midwest' },
        { id: 'ky', name: 'Kentucky Territory', abbr: 'KY', region: 'Border' },
        { id: 'tn', name: 'Tennessee Territory', abbr: 'TN', region: 'South' },
        { id: 'ms', name: 'Mississippi Territory', abbr: 'MS', region: 'South' },
        { id: 'al', name: 'Alabama Territory', abbr: 'AL', region: 'South' },
      ];
      for (const t of territories) {
        if (snap.states.find((s) => s.id === t.id)) continue;
        snap.states.push({
          id: t.id,
          name: t.name,
          abbr: t.abbr,
          region: t.region,
          electoralVotes: 0,
          bias: 0,
          governorId: null,
          senators: [],
          representativeIds: [],
          industries: { agriculture: 1 },
          isSlaveState: t.region === 'South' || t.region === 'Border',
          admissionYear: snap.game.year,
          isColony: false,
        });
      }
      break;
    }
    case 'constitutional_convention_kickoff': {
      // Open the Convention as a pending interactive screen
      snap.game.pendingConvention = makeConvention(snap.game.year);
      break;
    }
  }
}

export function applyEffect(snap: FullGameSnapshot, effect: { meters?: Partial<NationalMeters>; partyPreference?: number; enthusiasm?: { ideology: Ideology; party: PartyId; delta: number }[]; interestGroups?: { id: string; delta: number }[]; domesticStability?: number; diplomacy?: { nation: string; delta: number }[]; startWar?: { name: string; against: string }; text?: string }): void {
  if (effect.meters) {
    for (const k of Object.keys(effect.meters) as (keyof NationalMeters)[]) {
      const v = effect.meters[k];
      if (v != null) snap.game.meters[k] = clamp(snap.game.meters[k] + v, -5, 5);
    }
  }
  // domesticStability is shorthand for the domestic meter (the type declared it
  // but applyEffect previously ignored it).
  if (effect.domesticStability != null) {
    snap.game.meters.domestic = clamp(snap.game.meters.domestic + effect.domesticStability, -5, 5);
  }
  if (effect.diplomacy) {
    for (const dpl of effect.diplomacy) {
      snap.game.diplomacy[dpl.nation] = clamp((snap.game.diplomacy[dpl.nation] ?? 0) + dpl.delta, -5, 5);
    }
  }
  if (effect.partyPreference != null) {
    snap.game.partyPreference = clamp(snap.game.partyPreference + effect.partyPreference, -5, 5);
  }
  if (effect.enthusiasm) {
    for (const e of effect.enthusiasm) {
      const slot = snap.game.enthusiasm[e.ideology];
      if (slot) slot[e.party] = clamp(slot[e.party] + e.delta, -5, 5);
    }
  }
  if (effect.interestGroups) {
    for (const g of effect.interestGroups) {
      snap.game.interestGroups[g.id] = clamp((snap.game.interestGroups[g.id] ?? 0) + g.delta, -10, 10);
    }
  }
  if (effect.startWar) {
    const warId = uid('war');
    snap.wars.push({
      id: warId,
      name: effect.startWar.name,
      enemy: effect.startWar.against,
      startYear: snap.game.year,
      warScore: 0,
      generals: snap.game.cabinet.GeneralInChief ? [snap.game.cabinet.GeneralInChief] : [],
      battles: [],
    });
    snap.game.wars.push(warId);
    addLog(snap, '2.4.3', 'war', `${effect.startWar.name} begins against ${effect.startWar.against}.`);
  }
}

// ============================================================================
// 2.5.1 Lingering Phase
// ============================================================================
export function runPhase_2_5_1_Lingering(snap: FullGameSnapshot): void {
  const treasury = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfTreasury);
  const war = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfWar);
  const state = snap.politicians.find((p) => p.id === snap.game.cabinet.SecretaryOfState);
  const ag = snap.politicians.find((p) => p.id === snap.game.cabinet.AttorneyGeneral);

  const drift = (skill: number | undefined): number => {
    if (skill == null) return -0.3;
    if (skill >= 4) return 0.5;
    if (skill >= 3) return 0.2;
    if (skill >= 2) return 0;
    if (skill >= 1) return -0.2;
    return -0.5;
  };

  const apply = (k: keyof NationalMeters, delta: number) => {
    const before = snap.game.meters[k];
    const next = clamp(before + delta, -5, 5);
    snap.game.meters[k] = next;
    if (Math.abs(delta) > 0.01) {
      addLog(snap, '2.5.1', 'meter', `${k}: ${before.toFixed(1)} -> ${next.toFixed(1)} (${delta > 0 ? '+' : ''}${delta.toFixed(1)})`);
    }
  };

  apply('revenue', drift(treasury?.skills.admin));
  apply('economic', drift(treasury?.skills.admin) * 0.7);
  apply('military', drift(war?.skills.military) * 0.8);
  apply('domestic', drift(ag?.skills.admin) * 0.5 + (snap.game.wars.length > 0 ? -0.5 : 0));
  apply('honest', drift(ag?.skills.admin) * 0.5 - 0.1);
  apply('quality', drift(treasury?.skills.admin) * 0.4);
  apply('planet', -0.05);

  // Diplomacy drift from SoS
  if (state) {
    for (const k of Object.keys(snap.game.diplomacy)) {
      snap.game.diplomacy[k] = clamp(snap.game.diplomacy[k] + drift(state.skills.admin) * 0.2, -5, 5);
    }
  }

  // National debt
  snap.game.nationalDebt = Math.max(0, snap.game.nationalDebt - snap.game.meters.revenue * 1_500_000);
}

// ============================================================================
// 2.5.2 Governor actions
// ============================================================================
export function runPhase_2_5_2_Governors(snap: FullGameSnapshot): void {
  for (const s of snap.states) {
    if (!s.governorId) continue;
    const gov = snap.politicians.find((p) => p.id === s.governorId);
    if (!gov) continue;
    if (chance(0.3)) {
      const adjustment = (gov.skills.governing - 1) * 0.05;
      s.bias = clamp(s.bias + (gov.partyId === 'BLUE' ? -adjustment : adjustment), -5, 5);
    }
  }
}

// ============================================================================
// 2.5.3 Supreme Court
// ============================================================================
export function runPhase_2_5_3_Court(snap: FullGameSnapshot): void {
  if (chance(0.5)) {
    const titles = [
      'Property rights vs. federal regulation',
      'Interstate commerce dispute',
      'Free speech under wartime laws',
      'State sovereignty over federal authority',
    ];
    const justices = [snap.game.chiefJusticeId, ...snap.game.supremeCourtIds].map((id) => snap.politicians.find((p) => p.id === id)).filter(Boolean) as Politician[];
    if (justices.length === 0) return;
    const conserv = justices.filter((j) => ['Conservative', 'Traditionalist', 'RW Populist'].includes(j.ideology)).length;
    const liberal = justices.filter((j) => ['Liberal', 'Progressive', 'LW Populist'].includes(j.ideology)).length;
    const ruling = conserv > liberal ? 'conservative' : 'liberal';
    const title = pick(titles);
    addLog(snap, '2.5.3', 'court', `Supreme Court rules on ${title}: ${ruling} majority (${ruling === 'conservative' ? conserv : liberal}-${ruling === 'conservative' ? liberal : conserv}).`);
    if (ruling === 'conservative') snap.game.partyPreference = clamp(snap.game.partyPreference - 0.1, -5, 5);
    else snap.game.partyPreference = clamp(snap.game.partyPreference + 0.1, -5, 5);
  }
}

// ============================================================================
// 2.6 Congress (proposals, committee, floor)
// ============================================================================
export const BILL_TEMPLATES = [
  { title: 'Tariff Increase', committee: 'Economic' as const, description: 'Raise duties on imported manufactured goods.', effect: { text: 'Tariffs raised.', meters: { revenue: 1, economic: -0.5 }, interestGroups: [{ id: 'Manufacturers', delta: 2 }, { id: 'FreeTrade', delta: -2 }] } },
  { title: 'Tariff Reduction', committee: 'Economic' as const, description: 'Lower duties to encourage trade.', effect: { text: 'Tariffs reduced.', meters: { revenue: -0.5, economic: 0.5 }, interestGroups: [{ id: 'FreeTrade', delta: 2 }, { id: 'Manufacturers', delta: -1 }] } },
  { title: 'Homestead Act', committee: 'Domestic' as const, description: 'Free land to settlers in the West.', effect: { text: 'Homesteads granted.', interestGroups: [{ id: 'Settlers', delta: 3 }, { id: 'Planters', delta: -2 }] } },
  { title: 'Internal Improvements', committee: 'Domestic' as const, description: 'Federal funds for roads and canals.', effect: { text: 'Infrastructure built.', meters: { quality: 0.5, revenue: -1 }, interestGroups: [{ id: 'Workers', delta: 1 }, { id: 'Manufacturers', delta: 1 }] } },
  { title: 'Naval Expansion', committee: 'Foreign' as const, description: 'Build new warships.', effect: { text: 'Navy expanded.', meters: { military: 1, revenue: -1 }, interestGroups: [{ id: 'MilitaryIndustrial', delta: 2 }] } },
  { title: 'Fugitive Slave Act Strengthening', committee: 'Justice' as const, description: 'Federal enforcement of slave catching.', effect: { text: 'Federal slave catchers empowered.', meters: { domestic: -1 }, interestGroups: [{ id: 'Planters', delta: 3 }, { id: 'Abolitionists', delta: -3 }] } },
  { title: 'Personal Liberty Law', committee: 'Justice' as const, description: 'State protections for free black residents.', effect: { text: 'State liberty laws strengthened.', meters: { domestic: -0.5 }, interestGroups: [{ id: 'Abolitionists', delta: 2 }, { id: 'Planters', delta: -2 }] } },
  { title: 'Pacific Railroad Bill', committee: 'Domestic' as const, description: 'Charter a transcontinental railroad.', effect: { text: 'Railroad chartered.', meters: { economic: 1, revenue: -1 }, interestGroups: [{ id: 'WallStreet', delta: 2 }, { id: 'Settlers', delta: 1 }] } },
];

export function runPhase_2_6_1_Proposals(snap: FullGameSnapshot): void {
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    generateCCBills(snap);
    return;
  }
  snap.game.pendingLegislation = [];
  for (const f of snap.factions) {
    const members = snap.politicians.filter((p) => p.factionId === f.id);
    if (members.length === 0) continue;
    const sponsor = members.sort((a, b) => b.skills.legislative - a.skills.legislative)[0];
    if (!sponsor || sponsor.skills.legislative < 1) continue;
    if (chance(0.6)) {
      const tpl = pick(BILL_TEMPLATES);
      const bill: Legislation = {
        id: uid('bill'),
        year: snap.game.year,
        title: tpl.title,
        description: tpl.description,
        sponsorId: sponsor.id,
        sponsorFactionId: f.id,
        committee: tpl.committee,
        status: 'proposed',
        effects: tpl.effect,
      };
      snap.legislation.push(bill);
      snap.game.pendingLegislation.push(bill.id);
      addLog(snap, '2.6.1', 'legislation', `${f.name} (${sponsor.firstName} ${sponsor.lastName}) proposes "${tpl.title}".`);
    }
  }
}

export function runPhase_2_6_2_Committee(snap: FullGameSnapshot): void {
  if (snap.game.currentEra === 'independence') {
    // CC has no separate committee step — pass all to floor
    for (const billId of snap.game.pendingLegislation) {
      const b = snap.legislation.find((bb) => bb.id === billId);
      if (b) b.status = 'passed_committee';
    }
    return;
  }
  for (const billId of snap.game.pendingLegislation) {
    const bill = snap.legislation.find((b) => b.id === billId);
    if (!bill) continue;
    bill.status = 'committee';
    const chairId = snap.game.committeeChairs[bill.committee];
    const chair = snap.politicians.find((p) => p.id === chairId);
    if (!chair) {
      bill.status = 'passed_committee';
      continue;
    }
    const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
    const sameParty = chair.partyId === sponsor?.partyId;
    const passChance = clamp(
      (sameParty ? 0.85 : 0.25) + cardVoteBias(snap, chair.factionId, bill.effects.interestGroups),
      0, 1,
    );
    if (chance(passChance)) {
      bill.status = 'passed_committee';
      addLog(snap, '2.6.2', 'legislation', `"${bill.title}" passes ${bill.committee} committee.`);
    } else {
      bill.status = 'killed_committee';
      addLog(snap, '2.6.2', 'legislation', `"${bill.title}" killed in ${bill.committee} committee.`);
    }
  }
}

export function runPhase_2_6_3_Floor(snap: FullGameSnapshot): void {
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    for (const billId of snap.game.pendingLegislation) {
      const bill = snap.legislation.find((b) => b.id === billId);
      if (!bill || bill.status !== 'passed_committee') continue;
      const result = voteCC(snap, bill);
      bill.votes = { house: { yea: result.aye, nay: result.nay }, senate: { yea: 0, nay: 0 } };
      if (result.passed) {
        bill.status = 'passed';
        applyEffect(snap, bill.effects);
        addLog(snap, '2.6.3', 'legislation', `"${bill.title}" PASSED Continental Congress (${result.aye} aye / ${result.nay} nay / ${result.abstain} abstain).`);
        // Special handling: Establish Continental Army/Navy unlocks military
        if (bill.title.includes('Continental Army') || bill.title.includes('Continental Navy')) {
          // appointMilitary will run during Military phase
        }
      } else {
        bill.status = 'failed';
        addLog(snap, '2.6.3', 'legislation', `"${bill.title}" FAILED Continental Congress (${result.aye} aye / ${result.nay} nay / ${result.abstain} abstain).`);
      }
    }
    snap.game.pendingLegislation = [];
    return;
  }
  for (const billId of snap.game.pendingLegislation) {
    const bill = snap.legislation.find((b) => b.id === billId);
    if (!bill || bill.status !== 'passed_committee') continue;
    const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
    if (!sponsor) continue;
    const senateMembers = snap.states.flatMap((s) => s.senators.map((sn) => snap.politicians.find((p) => p.id === sn.politicianId))).filter(Boolean) as Politician[];
    const houseMembers = snap.states.flatMap((s) => s.representativeIds.map((id) => snap.politicians.find((p) => p.id === id))).filter(Boolean) as Politician[];
    const sponsorLeader = getFactionLeader(snap, sponsor.factionId);
    const sponsorIsLeader = !!(sponsorLeader && sponsorLeader.id === sponsor.id);
    const tally = (members: Politician[]) => {
      let yea = 0, nay = 0;
      for (const m of members) {
        const sameParty = m.partyId === sponsor.partyId;
        const sameFaction = m.factionId === sponsor.factionId;
        let p = sameFaction ? 0.92 : sameParty ? 0.6 : 0.15;
        // ideology distance
        const dist = Math.abs(IDEOLOGY_ORDER.indexOf(m.ideology) - IDEOLOGY_ORDER.indexOf(sponsor.ideology));
        p -= dist * 0.05;
        const leaderSponsorBonus = (sponsorIsLeader && m.factionId === sponsor.factionId)
          ? LEADERSHIP_RULES.sponsorFloorBias
          : 0;
        p = clamp(p + cardVoteBias(snap, m.factionId, bill.effects.interestGroups) + leaderSponsorBonus, 0, 1);
        if (chance(p)) yea++;
        else nay++;
      }
      return { yea, nay };
    };
    const house = tally(houseMembers);
    const senate = tally(senateMembers);
    bill.votes = { house, senate };
    if (house.yea > house.nay && senate.yea > senate.nay) {
      bill.status = 'passed';
      applyEffect(snap, bill.effects);
      addLog(snap, '2.6.3', 'legislation', `"${bill.title}" PASSED. House ${house.yea}-${house.nay}, Senate ${senate.yea}-${senate.nay}.`);
    } else {
      bill.status = 'failed';
      addLog(snap, '2.6.3', 'legislation', `"${bill.title}" FAILED. House ${house.yea}-${house.nay}, Senate ${senate.yea}-${senate.nay}.`);
    }
  }
  snap.game.pendingLegislation = [];
}

// ============================================================================
// 2.7 Foreign Affairs / Military
// ============================================================================
export function runPhase_2_7_1_Diplomacy(snap: FullGameSnapshot): void {
  for (const k of Object.keys(snap.game.diplomacy)) {
    if (chance(0.2)) {
      snap.game.diplomacy[k] = clamp(snap.game.diplomacy[k] + (chance(0.5) ? 0.5 : -0.5), -5, 5);
    }
  }
}

export function runPhase_2_7_2_Military(snap: FullGameSnapshot): void {
  if (snap.game.currentEra === 'independence' && snap.game.revolutionaryWar?.active) {
    runRevWarBattles(snap);
    return;
  }
  for (const warId of snap.game.wars) {
    const war = snap.wars.find((w) => w.id === warId);
    if (!war || war.endYear) continue;
    const general = snap.politicians.find((p) => p.id === snap.game.cabinet.GeneralInChief);
    const milPower = snap.game.meters.military + (general?.skills.military ?? 0);
    const enemyPower = 1 + Math.random() * 4;
    const roll = d100();
    const win = milPower * 10 + roll > enemyPower * 10 + 50;
    const battleName = `Battle of ${pick(['Bull Run', 'Antietam', 'Shiloh', 'Manassas', 'Gettysburg', 'Vicksburg', 'Chickamauga', 'Chancellorsville'])}`;
    war.battles.push({
      year: snap.game.year,
      name: battleName,
      outcome: win ? 'win' : 'loss',
      text: `${battleName}: ${win ? 'Victory' : 'Defeat'} (Power ${milPower.toFixed(1)} vs ${enemyPower.toFixed(1)}, roll ${roll}).`,
    });
    war.warScore += win ? 10 : -5;
    addLog(snap, '2.7.2', 'war', `${battleName}: ${win ? 'VICTORY' : 'DEFEAT'} (war score ${war.warScore}).`);
    if (war.warScore >= 50) {
      war.endYear = snap.game.year;
      addLog(snap, '2.7.2', 'war', `${war.name} ends in our victory.`);
    } else if (war.warScore <= -50) {
      war.endYear = snap.game.year;
      addLog(snap, '2.7.2', 'war', `${war.name} ends in our defeat.`);
    }
  }
  snap.game.wars = snap.game.wars.filter((id) => {
    const w = snap.wars.find((ww) => ww.id === id);
    return w && !w.endYear;
  });
}

// ============================================================================
// 2.8 Executive
// ============================================================================
export function runPhase_2_8_1_Executive(snap: FullGameSnapshot): void {
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (!president) return;
  if (chance(0.5)) {
    const actions = [
      { text: 'Issue an executive order to streamline the Post Office.', effect: () => { snap.game.meters.honest = clamp(snap.game.meters.honest + 0.3, -5, 5); } },
      { text: 'Direct the army to enforce federal law in territories.', effect: () => { snap.game.meters.domestic = clamp(snap.game.meters.domestic - 0.3, -5, 5); snap.game.meters.military = clamp(snap.game.meters.military + 0.3, -5, 5); } },
      { text: 'Pardon political prisoners.', effect: () => { snap.game.partyPreference = clamp(snap.game.partyPreference + (president.partyId === 'BLUE' ? -0.2 : 0.2), -5, 5); } },
      { text: 'Negotiate a trade treaty.', effect: () => { snap.game.diplomacy.Britain = clamp(snap.game.diplomacy.Britain + 0.5, -5, 5); snap.game.meters.economic = clamp(snap.game.meters.economic + 0.3, -5, 5); } },
    ];
    const a = pick(actions);
    a.effect();
    addLog(snap, '2.8.1', 'event', `President ${president.lastName}: ${a.text}`);
  }
}

export function runPhase_2_8_2_CourtMgmt(snap: FullGameSnapshot): void {
  // Old justices may be pressured if president and chief are different parties
  const president = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (!president) return;
  for (const id of [...snap.game.supremeCourtIds]) {
    const j = snap.politicians.find((p) => p.id === id);
    if (!j) continue;
    if (j.age >= 75 && chance(0.15)) {
      j.retiredYear = snap.game.year;
      vacateOffice(snap, j);
      addLog(snap, '2.8.2', 'retire', `Justice ${j.firstName} ${j.lastName} retires from the Supreme Court.`);
      // Replace with new justice
      const candidates = snap.politicians.filter((p) => !p.currentOffice && !p.deathYear && !p.retiredYear && p.partyId === president.partyId && p.skills.judicial >= 2);
      candidates.sort((a, b) => b.skills.judicial - a.skills.judicial);
      const newJustice = candidates[0];
      if (newJustice) {
        newJustice.currentOffice = { type: 'AssociateJustice' };
        snap.game.supremeCourtIds.push(newJustice.id);
        addLog(snap, '2.8.2', 'appointment', `${newJustice.firstName} ${newJustice.lastName} confirmed as Associate Justice.`);
      }
    }
  }
}

// ============================================================================
// 2.9 Elections
// ============================================================================
function ideologyAlignment(ideo: Ideology, party: PartyId): number {
  const map: Record<Ideology, number> = {
    'LW Populist': -3, 'Progressive': -2, 'Liberal': -1,
    'Moderate': 0, 'Conservative': 1, 'Traditionalist': 2, 'RW Populist': 3,
  };
  const v = map[ideo];
  return party === 'BLUE' ? v : -v;
}

function calcStateVote(snap: FullGameSnapshot, stateId: string, candidates: Politician[]): { politicianId: string; partyId: PartyId; pct: number; votes: number }[] {
  const state = snap.states.find((s) => s.id === stateId)!;
  const totalVotes = 100_000 + state.electoralVotes * 5000;
  const scores = candidates.map((c) => {
    const partyId = c.partyId!;
    const enthusiasm = snap.game.enthusiasm[c.ideology]?.[partyId] ?? 0;
    const baseLean = partyId === 'BLUE' ? -state.bias : state.bias;
    const partyPref = partyId === 'BLUE' ? -snap.game.partyPreference : snap.game.partyPreference;
    const pv = c.pvCache;
    const factionBias = electionFactionBias(snap, c.factionId, c.id);
    const score = 50 + baseLean * 5 + partyPref * 5 + enthusiasm * 2 + pv * 0.1 + factionBias + (Math.random() - 0.5) * 8;
    return { c, score: Math.max(1, score) };
  });
  const total = scores.reduce((s, x) => s + x.score, 0);
  return scores.map(({ c, score }) => ({
    politicianId: c.id,
    partyId: c.partyId!,
    pct: (score / total) * 100,
    votes: Math.round((score / total) * totalVotes),
  }));
}

export function runPhase_2_9_1_Primaries(snap: FullGameSnapshot): { BLUE: Politician | null; RED: Politician | null } {
  const out = { BLUE: null as Politician | null, RED: null as Politician | null };
  for (const partyId of ['BLUE', 'RED'] as PartyId[]) {
    const candidates = snap.politicians.filter((p) => p.partyId === partyId && !p.deathYear && !p.retiredYear && p.age >= 35 && p.age <= 80 && p.command >= 2);
    candidates.sort((a, b) => b.pvCache + b.command * 5 - (a.pvCache + a.command * 5));
    const top = candidates[0] ?? null;
    out[partyId] = top;
    if (top) addLog(snap, '2.9.1', 'election', `${top.firstName} ${top.lastName} wins ${partyId === 'BLUE' ? 'Democratic' : 'Republican'} primary.`);
  }
  return out;
}

export function runPhase_2_9_4_PresidentialGeneral(snap: FullGameSnapshot, blueCand: Politician | null, redCand: Politician | null): ElectionResult | null {
  if (!blueCand || !redCand) return null;
  const candidates = [blueCand, redCand];
  let blueEv = 0, redEv = 0;
  let bluePop = 0, redPop = 0;
  const stateResults: { state: string; winner: PartyId; bluePct: number; redPct: number }[] = [];
  for (const s of snap.states) {
    const tally = calcStateVote(snap, s.id, candidates);
    const blue = tally.find((t) => t.partyId === 'BLUE')!;
    const red = tally.find((t) => t.partyId === 'RED')!;
    if (blue.pct > red.pct) blueEv += s.electoralVotes;
    else redEv += s.electoralVotes;
    bluePop += blue.votes;
    redPop += red.votes;
    stateResults.push({ state: s.id, winner: blue.pct > red.pct ? 'BLUE' : 'RED', bluePct: blue.pct, redPct: red.pct });
  }
  const winner = blueEv > redEv ? blueCand : redCand;
  const result: ElectionResult = {
    id: uid('elec'),
    year: snap.game.year,
    type: 'presidential',
    candidates: [
      { politicianId: blueCand.id, partyId: 'BLUE', votes: bluePop, pct: (bluePop / (bluePop + redPop)) * 100 },
      { politicianId: redCand.id, partyId: 'RED', votes: redPop, pct: (redPop / (bluePop + redPop)) * 100 },
    ],
    winnerId: winner.id,
    electoralVotes: [
      { politicianId: blueCand.id, ev: blueEv },
      { politicianId: redCand.id, ev: redEv },
    ],
  };
  snap.elections.push(result);
  addLog(snap, '2.9.4', 'election', `Presidential election: ${winner.firstName} ${winner.lastName} wins (${winner.partyId === 'BLUE' ? blueEv : redEv} EV vs ${winner.partyId === 'BLUE' ? redEv : blueEv}).`);
  // Swear in: vacate old president
  const oldPres = snap.politicians.find((p) => p.id === snap.game.presidentId);
  if (oldPres) vacateOffice(snap, oldPres);
  winner.currentOffice = { type: 'President' };
  snap.game.presidentId = winner.id;
  // Reset cabinet
  for (const k of Object.keys(snap.game.cabinet) as (keyof typeof snap.game.cabinet)[]) {
    const id = snap.game.cabinet[k];
    if (id) {
      const p = snap.politicians.find((pp) => pp.id === id);
      if (p) vacateOffice(snap, p);
    }
    snap.game.cabinet[k] = null;
  }
  return result;
}

export function runPhase_2_9_5_Governors(snap: FullGameSnapshot): void {
  for (const s of snap.states) {
    if (chance(0.4)) {
      const candidates = snap.politicians.filter((p) => p.state === s.id && p.factionId && !p.currentOffice && p.age >= 30 && p.age <= 75);
      if (candidates.length === 0) continue;
      const blue = candidates.filter((c) => c.partyId === 'BLUE').sort((a, b) => b.pvCache - a.pvCache)[0];
      const red = candidates.filter((c) => c.partyId === 'RED').sort((a, b) => b.pvCache - a.pvCache)[0];
      const list = [blue, red].filter(Boolean) as Politician[];
      if (list.length < 2) continue;
      const tally = calcStateVote(snap, s.id, list);
      tally.sort((a, b) => b.pct - a.pct);
      const winnerId = tally[0].politicianId;
      const winner = snap.politicians.find((p) => p.id === winnerId);
      if (!winner) continue;
      // vacate old governor
      const old = snap.politicians.find((p) => p.id === s.governorId);
      if (old) vacateOffice(snap, old);
      winner.currentOffice = { type: 'Governor', stateId: s.id };
      s.governorId = winner.id;
      const result: ElectionResult = {
        id: uid('elec'),
        year: snap.game.year,
        type: 'governor',
        stateId: s.id,
        candidates: tally,
        winnerId,
      };
      snap.elections.push(result);
    }
  }
}

export interface CCBuilderPayload {
  stateId: string;
  pool: Politician[];
  selectingFactionId: string;
  declineRequired?: boolean;
}

export function runPhase_2_9_6_Congressional(
  snap: FullGameSnapshot,
): { needsPlayer?: boolean; payload?: CCBuilderPayload } | void {
  // 1772 First-CC builder gate-swap (AC #3). When the gate is met, the
  // interactive builder owns this phase; the 1856 Senate/House logic below
  // does not run.
  if (snap.game.scenarioId === '1772' && cc1774GateMet(snap)) {
    return runCCBuilderWalk(snap);
  }
  // 1/3 of senators every 2 years (class equal to year mod). House: all reps every 2.
  const senateClass = ((snap.game.year - 1856) / 2) % 3 + 1;
  for (const s of snap.states) {
    // Senate: class equal to senateClass
    for (const sen of [...s.senators]) {
      if (sen.classId !== senateClass) continue;
      const candidates = snap.politicians.filter((p) => p.state === s.id && p.factionId && !p.currentOffice && p.age >= 30 && !p.deathYear && !p.retiredYear);
      if (candidates.length < 2) continue;
      const blue = candidates.filter((c) => c.partyId === 'BLUE').sort((a, b) => b.pvCache - a.pvCache)[0];
      const red = candidates.filter((c) => c.partyId === 'RED').sort((a, b) => b.pvCache - a.pvCache)[0];
      const list = [blue, red].filter(Boolean) as Politician[];
      if (list.length < 2) continue;
      const tally = calcStateVote(snap, s.id, list);
      tally.sort((a, b) => b.pct - a.pct);
      const winnerId = tally[0].politicianId;
      const winner = snap.politicians.find((p) => p.id === winnerId);
      if (!winner) continue;
      const incumbent = snap.politicians.find((p) => p.id === sen.politicianId);
      if (incumbent && incumbent.id !== winner.id) vacateOffice(snap, incumbent);
      winner.currentOffice = { type: 'Senator', stateId: s.id };
      sen.politicianId = winner.id;
    }
    // House: redo all reps
    const oldReps = [...s.representativeIds];
    for (const oldId of oldReps) {
      const old = snap.politicians.find((p) => p.id === oldId);
      const candidates = snap.politicians.filter((p) => p.state === s.id && p.factionId && !p.currentOffice && p.age >= 25 && !p.deathYear && !p.retiredYear);
      if (candidates.length < 2) continue;
      const blue = candidates.filter((c) => c.partyId === 'BLUE').sort((a, b) => b.pvCache - a.pvCache)[0];
      const red = candidates.filter((c) => c.partyId === 'RED').sort((a, b) => b.pvCache - a.pvCache)[0];
      const list = [blue, red].filter(Boolean) as Politician[];
      if (list.length < 2) continue;
      const tally = calcStateVote(snap, s.id, list);
      tally.sort((a, b) => b.pct - a.pct);
      const winnerId = tally[0].politicianId;
      const winner = snap.politicians.find((p) => p.id === winnerId);
      if (!winner) continue;
      if (old && old.id !== winner.id) vacateOffice(snap, old);
      s.representativeIds = s.representativeIds.filter((id) => id !== oldId);
      winner.currentOffice = { type: 'Representative', stateId: s.id };
      s.representativeIds.push(winner.id);
    }
  }
  addLog(snap, '2.9.6', 'election', 'Congressional elections complete.');
}

// ============================================================================
// 1772 First Continental Congress builder (phase 2.9.6 gate-swap)
// ============================================================================

// Drives the alphabetical colony walk. For each colony: resolve the selecting
// faction + eligibility pool; if the selecting faction is the player, return
// `needsPlayer` and let the UI take over. Otherwise AI picks all slots inline
// and the loop advances to the next colony. On completion writes the capstone
// log per AC #26 and clears the cursor.
function runCCBuilderWalk(
  snap: FullGameSnapshot,
): { needsPlayer?: boolean; payload?: CCBuilderPayload } | void {
  const cc = ensureCC(snap);
  // Durability check (AC #27): if the CC is already seated and no cursor is
  // active, treat the phase as already-built and exit cleanly.
  if (cc.delegates.length > 0 && snap.game.ccBuilderCursor == null) {
    return;
  }
  if (snap.game.ccBuilderCursor == null) {
    snap.game.ccBuilderCursor = { colonyIdx: 0, slotIdx: 0 };
  }
  const order = colonyOrder1774(snap);
  const cursor = snap.game.ccBuilderCursor;

  while (cursor.colonyIdx < order.length) {
    const state = order[cursor.colonyIdx];
    const slots = state.ccDelegateSlots ?? 2;

    // Slot done for this colony — roll forward.
    if (cursor.slotIdx >= slots) {
      cursor.colonyIdx += 1;
      cursor.slotIdx = 0;
      cursor.excludedThisColony = undefined;
      continue;
    }

    const alreadySeated = new Set<string>(cc.delegates.map((d) => d.politicianId));
    for (const ex of cursor.excludedThisColony ?? []) alreadySeated.add(ex);

    let pool = eligiblePoolFor(snap, state, alreadySeated);
    const { factionId: selectingFactionId } = selectingFactionFor(snap, state);

    // Edge case: 0 eligible even after fallback — log and skip the colony.
    if (pool.length === 0) {
      addLog(
        snap,
        '2.9.6',
        'event',
        `No suitable delegates available — ${state.name} sends no representatives this session.`,
      );
      cursor.colonyIdx += 1;
      cursor.slotIdx = 0;
      cursor.excludedThisColony = undefined;
      continue;
    }

    if (selectingFactionId === snap.game.playerFactionId) {
      return {
        needsPlayer: true,
        payload: {
          stateId: state.id,
          pool,
          selectingFactionId,
        },
      };
    }

    // AI pick (inline).
    const choice = aiPickDelegate(snap, state, pool, selectingFactionId, alreadySeated);
    if (!choice) {
      // Defensive: no candidate at all (pool was non-empty but aiPickDelegate
      // returned null). Skip the colony to avoid an infinite loop.
      addLog(
        snap,
        '2.9.6',
        'event',
        `No suitable delegates available — ${state.name} sends no representatives this session.`,
      );
      cursor.colonyIdx += 1;
      cursor.slotIdx = 0;
      cursor.excludedThisColony = undefined;
      continue;
    }
    // AC #16 decline-log: if a higher-ranked T1 politician was passed over
    // because they were >= 4 years invested in a career track, log it once.
    // (Cheaper than threading the skipped list out of aiPickDelegate.)
    const declined = pool.filter(
      (p) => p.factionId === selectingFactionId && p.careerTrack != null && p.careerTrackYears >= 4,
    );
    for (const d of declined) {
      if (d.id === choice.politicianId) continue;
      addLog(
        snap,
        '2.9.6',
        'event',
        `${d.firstName} ${d.lastName} declines appointment to the Continental Congress.`,
      );
    }

    commitDelegate(snap, state.id, choice.politicianId, choice.tier, selectingFactionId);
  }

  // Walk complete. Capstone log per AC #26.
  const seated = cc.delegates.length;
  const colonies = new Set(cc.delegates.map((d) => d.stateId)).size;
  addLog(
    snap,
    '2.9.6',
    'appointment',
    `First Continental Congress seated: ${seated} delegates from ${colonies} colonies.`,
  );
  cc.assemblyOrdinal = 1;
  snap.game.ccBuilderCursor = undefined;
}

// Player-action helpers — UI invokes these via the GameContext callbacks. After
// each helper, the caller re-runs `runCurrentPhase` to either resume the colony
// walk (next AI slot/colony) or surface the next `needsPlayer` payload.

export function playerCCDelegatePick(
  snap: FullGameSnapshot,
  stateId: string,
  politicianId: string,
): void {
  const cursor = snap.game.ccBuilderCursor;
  if (!cursor) return;
  const order = colonyOrder1774(snap);
  const state = order[cursor.colonyIdx];
  if (!state || state.id !== stateId) return;
  const { factionId: selectingFactionId } = selectingFactionFor(snap, state);
  if (selectingFactionId !== snap.game.playerFactionId) return;
  const alreadySeated = new Set<string>(
    (snap.game.continentalCongress?.delegates ?? []).map((d) => d.politicianId),
  );
  for (const ex of cursor.excludedThisColony ?? []) alreadySeated.add(ex);
  const pool = eligiblePoolFor(snap, state, alreadySeated);
  if (!pool.find((p) => p.id === politicianId)) return;
  commitDelegate(snap, state.id, politicianId, 'Player', selectingFactionId);
}

export function playerCCDelegateDecline(
  snap: FullGameSnapshot,
  stateId: string,
  politicianId: string,
): void {
  const cursor = snap.game.ccBuilderCursor;
  if (!cursor) return;
  const order = colonyOrder1774(snap);
  const state = order[cursor.colonyIdx];
  if (!state || state.id !== stateId) return;
  const p = snap.politicians.find((pp) => pp.id === politicianId);
  if (!p) return;
  if (!cursor.excludedThisColony) cursor.excludedThisColony = [];
  if (!cursor.excludedThisColony.includes(politicianId)) {
    cursor.excludedThisColony.push(politicianId);
  }
  addLog(
    snap,
    '2.9.6',
    'event',
    `${p.firstName} ${p.lastName} declines appointment to the Continental Congress.`,
  );
}

// ============================================================================
// 2.10 End of Half-Term
// ============================================================================
export function runPhase_2_10_End(snap: FullGameSnapshot): void {
  for (const p of snap.politicians) {
    if (p.deathYear || p.retiredYear) continue;
    p.age += 2;
  }
  snap.politicians = refreshPv(snap.politicians);
  // 1772: scheduled CC reassembly when the term clock has elapsed (First CC
  // assembled by the Intolerable Acts postEffect; subsequent reassemblies fire
  // here every CC_TERM_YEARS).
  if (snap.game.currentEra === 'independence' && snap.game.continentalCongress) {
    const cc = snap.game.continentalCongress;
    const termStart = cc.delegateTermStartYear ?? snap.game.year;
    if (snap.game.year - termStart >= CC_TERM_YEARS) {
      appointDelegates(snap);
      cc.assemblyOrdinal = (cc.assemblyOrdinal ?? 1) + 1;
      const ordinal = numberToOrdinal(cc.assemblyOrdinal);
      addLog(snap, '2.10', 'appointment', `${ordinal} Continental Congress convenes in Philadelphia.`);
      if (cc.presidentId && !cc.delegates.find((d) => d.politicianId === cc.presidentId)) {
        electCCPresident(snap);
      }
    }
  }
  addLog(snap, '2.10', 'system', `End of ${snap.game.year - 2}-${snap.game.year} term.`);
}

// suppress unused
export { shuffle };
