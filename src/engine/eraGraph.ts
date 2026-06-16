import type { FullGameSnapshot, EraEvent, Predicate } from '../types';
import { ERA_GRAPH_RULES } from '../types';
import { chance, pickWeighted } from '../rng';
import { ERA_GRAPH_1772, type GraphNode } from '../data/eraEvents1772';

// ============================================================================
// 2.4.3 Independence-era event graph — pure predicate evaluator + walker + AI
// auto-resolve. No React, no I/O, no Math.random (seeded rng wrappers only).
// ============================================================================

// Recursive interpreter over the serializable Predicate tree (CP1-2).
export function evalPredicate(snap: FullGameSnapshot, pred: Predicate): boolean {
  if ('all' in pred) return pred.all.every((p) => evalPredicate(snap, p));
  if ('any' in pred) return pred.any.some((p) => evalPredicate(snap, p));
  if ('not' in pred) return !evalPredicate(snap, pred.not);
  if ('yearAtLeast' in pred) return snap.game.year >= pred.yearAtLeast;
  if ('yearAtMost' in pred) return snap.game.year <= pred.yearAtMost;
  if ('eventCompleted' in pred) return snap.game.eraEventsCompleted.includes(pred.eventCompleted);
  if ('eventChose' in pred) {
    // chosenResponseId lives on the resolved node, which we keep durable in
    // pendingEraEvents for the life of the era (GameContext no longer wipes it).
    const node = snap.game.pendingEraEvents.find(
      (e) => e.templateId === pred.eventChose.template && e.resolved,
    );
    return node?.chosenResponseId === pred.eventChose.response;
  }
  if ('meterAtLeast' in pred) return snap.game.meters[pred.meterAtLeast.meter] >= pred.meterAtLeast.value;
  if ('meterAtMost' in pred) return snap.game.meters[pred.meterAtMost.meter] <= pred.meterAtMost.value;
  if ('interestAtLeast' in pred) return (snap.game.interestGroups[pred.interestAtLeast.group] ?? 0) >= pred.interestAtLeast.value;
  if ('diplomacyAtLeast' in pred) return (snap.game.diplomacy[pred.diplomacyAtLeast.nation] ?? 0) >= pred.diplomacyAtLeast.value;
  if ('warActive' in pred) return (snap.game.revolutionaryWar?.active ?? false) === pred.warActive;
  if ('warOutcome' in pred) return snap.game.revolutionaryWar?.outcome === pred.warOutcome;
  if ('stateAdmitted' in pred) return snap.states.some((s) => s.id === pred.stateAdmitted);
  if ('officeControlledByPlayer' in pred) {
    return pred.officeControlledByPlayer === 'general-in-chief'
      ? playerControlsDecider(snap, 'cc-president', true)
      : playerControlsDecider(snap, 'cc-president', false);
  }
  if ('rosterHasSkill' in pred) {
    const fid = snap.game.playerFactionId;
    return snap.politicians.some(
      (p) => p.factionId === fid && !p.deathYear && !p.retiredYear && p.skills[pred.rosterHasSkill.skill] >= pred.rosterHasSkill.min,
    );
  }
  if ('flag' in pred) return snap.game.graphFlags?.[pred.flag] === true;
  return false;
}

// "Player controls the decider" for the roster-gate. cc-president => the CC
// presiding officer is on the player's faction. Military forks => any
// player-faction general holds the Commander-in-Chief office. auto => never.
export function playerControlsDecider(snap: FullGameSnapshot, decider: EraEvent['decider'], military = false): boolean {
  const fid = snap.game.playerFactionId;
  if (military) {
    return snap.politicians.some(
      (p) => p.currentOffice?.type === 'GeneralInChief' && p.factionId === fid && !p.deathYear && !p.retiredYear,
    );
  }
  if (decider === 'cc-president') {
    const presId = snap.game.continentalCongress?.presidentId;
    if (!presId) return false;
    const pres = snap.politicians.find((p) => p.id === presId);
    return pres?.factionId === fid;
  }
  return false; // 'auto' (and the validate()-forbidden president/cabinet)
}

function isMilitaryNode(node: GraphNode | undefined): boolean {
  return node?.military === true;
}

export function nodeForEvent(event: EraEvent): GraphNode | undefined {
  return ERA_GRAPH_1772.find((n) => n.templateId === event.templateId);
}

// True when a node should resolve without surfacing a modal (foreign-actor /
// fait-accompli auto nodes, or controlled-by-AI cc-president / military nodes).
export function isAutoResolved(snap: FullGameSnapshot, event: EraEvent): boolean {
  if (event.decider === 'auto') return true;
  return !playerControlsDecider(snap, event.decider, isMilitaryNode(nodeForEvent(event)));
}

// Pick a response on the AI's behalf, by the controlling faction's ideology,
// mirroring the constitutional-convention CPU-consensus precedent. Each decision
// node may carry an `aiBias` map keyed by faction personality (LW/Center/RW);
// the spine/historical response (id 'a') is the default. Deterministic (no roll
// needed — the bias is a direct lookup; chance() only tie-breaks Center).
export function pickAIResponse(snap: FullGameSnapshot, event: EraEvent): string {
  const node = nodeForEvent(event);
  const fallback = event.responses[0]?.id ?? 'a';
  if (!node?.aiBias) return fallback;
  // Controlling faction: the CC president's faction for cc-president nodes;
  // otherwise (auto) the historical/first response is used.
  let personality: 'LW' | 'Center' | 'RW' = 'Center';
  const presId = snap.game.continentalCongress?.presidentId;
  const pres = presId ? snap.politicians.find((p) => p.id === presId) : null;
  const faction = pres?.factionId ? snap.factions.find((f) => f.id === pres.factionId) : null;
  if (faction) personality = faction.personality;
  const chosen = node.aiBias[personality];
  // Validate the bias points at a real response; otherwise fall back.
  if (chosen && event.responses.some((r) => r.id === chosen)) return chosen;
  return fallback;
}

// The graph walker that replaces next1772Event. Returns the next EraEvent to
// surface (already pushed onto pendingEraEvents) or null if nothing fires.
export function selectEraGraphNode(snap: FullGameSnapshot): EraEvent | null {
  // One-per-turn cap: if an unresolved event is already queued, return it.
  const queued = snap.game.pendingEraEvents.find((e) => !e.resolved);
  if (queued) return queued;

  const completed = new Set(snap.game.eraEventsCompleted);
  const eligible = ERA_GRAPH_1772.filter(
    (n) => !completed.has(n.templateId) && evalPredicate(snap, n.precondition ?? { all: [] }),
  );
  if (eligible.length === 0) return null;

  // Core-spine nodes (the inevitable opening provocations) fire immediately,
  // bypassing the probabilistic roll, so the spine never stalls.
  const core = eligible.filter((n) => n.coreSpine);
  let chosen: GraphNode;
  if (core.length > 0) {
    chosen = core[0];
  } else {
    const spine = eligible.filter((n) => n.realEvent !== false);
    const cf = eligible.filter((n) => n.realEvent === false);
    // History pressure: when both classes are eligible, strongly favour the spine.
    let pool: GraphNode[];
    if (spine.length > 0 && cf.length > 0) {
      pool = chance(ERA_GRAPH_RULES.historyPressure) ? spine : cf;
    } else {
      pool = spine.length > 0 ? spine : cf;
    }
    chosen = pickWeighted(pool.map((n) => ({ value: n, weight: 1 })));
    // Probabilistic firing: an eligible non-core node may wait a turn.
    if (!chance(ERA_GRAPH_RULES.fireChance)) return null;
  }

  const event = chosen.build(snap.game.year);
  snap.game.pendingEraEvents.push(event);
  return event;
}

// Dev-only authoring guard (AC 2/7/11). Throws on a forbidden authoring shape.
const ANACHRONISM_DENYLIST = /\b(national bank|treasury|the mint|wall street|the dollar|democratic-republican)\b/i;

export function validate(): void {
  for (const node of ERA_GRAPH_1772) {
    const built = node.build(1772);
    if (built.decider === 'president' || built.decider === 'cabinet') {
      throw new Error(`eraGraph validate: node ${node.templateId} uses forbidden decider '${built.decider}' (no President/Cabinet pre-1789)`);
    }
    if (node.chartIndex >= 49) {
      throw new Error(`eraGraph validate: node ${node.templateId} has chartIndex ${node.chartIndex} >= 49 (French Revolution / Federalism is out of scope)`);
    }
    const haystack = [built.title, built.description, ...built.responses.flatMap((r) => [r.label, r.description, r.effect.text])].join(' ');
    const hit = haystack.match(ANACHRONISM_DENYLIST);
    if (hit) {
      throw new Error(`eraGraph validate: node ${node.templateId} references anachronistic term '${hit[0]}'`);
    }
  }
  // Vermont is admitted only via the statehood node, which must gate on the
  // claim-Vermont choice (never admitted unconditionally).
  const vt = ERA_GRAPH_1772.find((n) => n.templateId === 'vermont_statehood');
  if (vt && !JSON.stringify(vt.precondition ?? {}).includes('claim_vermont')) {
    throw new Error('eraGraph validate: vermont_statehood must gate on the claim_vermont choice');
  }
}
