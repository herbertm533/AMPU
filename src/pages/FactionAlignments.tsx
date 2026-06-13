import { useGame } from '../state/GameContext';
import { useNavigation } from '../state/NavigationContext';
import { SortableTable, type Column } from '../components/SortableTable';
import { PartyBadge } from '../components/PartyBadge';
import {
  ALIGNMENT_RULES,
  type InterestCardId, type LobbyCardId, type IdeologyCardId, type Faction,
  type FactionAlignmentDriftEntry, type FullGameSnapshot,
} from '../types';
import { factionCenter, BILL_TEMPLATES } from '../engine/phaseRunners';
import { buildEraEventsForYear } from '../data/eraEvents1856';

const KIND_LABELS: Record<FactionAlignmentDriftEntry['kind'], string> = {
  'personality-shift': 'Personality',
  'card-added': 'Added',
  'card-dropped': 'Dropped',
  'card-swapped': 'Swapped',
};
const REASON_LABELS: Record<NonNullable<FactionAlignmentDriftEntry['reason']>, string> = {
  crashed: 'Crashed', emerging: 'Emerging', realigned: 'Realigned', composition: 'Composition',
};

function cardProfiles(snap: FullGameSnapshot, id: string): {
  strengthenedBy: { title: string; delta: number }[];
  weakenedBy: { title: string; delta: number }[];
} {
  const hits: { title: string; delta: number }[] = [];
  for (const tpl of BILL_TEMPLATES) {
    const imp = tpl.effect.interestGroups?.find((ig) => ig.id === id);
    if (imp) hits.push({ title: tpl.title, delta: imp.delta });
  }
  for (const ev of buildEraEventsForYear(snap.game.year)) {
    for (const r of ev.responses) {
      const imp = r.effect.interestGroups?.find((ig) => ig.id === id);
      if (imp) hits.push({ title: `${ev.title} — ${r.label}`, delta: imp.delta });
    }
  }
  return {
    strengthenedBy: hits.filter((h) => h.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 3),
    weakenedBy: hits.filter((h) => h.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 3),
  };
}

export function FactionAlignments(): JSX.Element {
  const { snapshot } = useGame();
  const { navigateTo } = useNavigation();
  if (!snapshot) return <div />;

  const playerFactionId = snapshot.game.playerFactionId;
  const rosterRows: Faction[] = [
    ...snapshot.factions.filter((f) => f.id === playerFactionId),
    ...snapshot.factions.filter((f) => f.id !== playerFactionId),
  ];
  const factionName = (id: string): string => snapshot.factions.find((f) => f.id === id)?.name ?? '(unknown)';

  const rosterColumns: Column<Faction>[] = [
    {
      key: 'name', label: 'Faction',
      sortValue: (f) => f.name,
      render: (f) => (
        <span className="font-semibold">
          {f.name}{f.id === playerFactionId && <span className="ml-1 text-xs text-emerald-600">(you)</span>}
        </span>
      ),
    },
    {
      key: 'party', label: 'Party',
      sortValue: (f) => f.partyId,
      render: (f) => <PartyBadge party={f.partyId} />,
    },
    {
      key: 'personality', label: 'Personality',
      sortValue: (f) => f.personality,
      render: (f) => {
        const c = factionCenter(snapshot, f.id);
        const title = c == null ? 'No living members' : `Center: ${c.toFixed(2)}`;
        return <span title={title} className="text-xs">{f.personality}</span>;
      },
    },
    {
      key: 'interest', label: 'Interest cards',
      render: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.interestCards.map((c) => {
            const sc = snapshot.game.interestGroups[c] ?? 0;
            const tense = sc <= -3 ? 'border-yellow-500' : sc >= 3 ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600';
            return (
              <span
                key={c}
                title={`Score: ${sc.toFixed(1)}`}
                className={`rounded border px-1 text-[10px] bg-blue-50 dark:bg-blue-900/30 ${tense}`}
              >
                {c}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      key: 'lobby', label: 'Lobby cards',
      render: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.lobbyCards.map((c) => {
            const proxy = ALIGNMENT_RULES.lobbyToInterest[c];
            const sc = snapshot.game.interestGroups[proxy] ?? 0;
            const tense = sc <= -3 ? 'border-yellow-500' : sc >= 3 ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600';
            return (
              <span
                key={c}
                title={`Proxies → ${proxy} (score ${sc.toFixed(1)})`}
                className={`rounded border px-1 text-[10px] bg-purple-50 dark:bg-purple-900/30 ${tense}`}
              >
                {c}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      key: 'ideology', label: 'Ideology cards',
      render: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.ideologyCards.map((c) => (
            <span key={c} className="rounded px-1 text-[10px] bg-amber-50 dark:bg-amber-900/30 border border-slate-300 dark:border-slate-600">
              {c}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const feed = (snapshot.game.factionAlignmentDrift ?? []).slice(-30).reverse();

  type C1Row = { id: InterestCardId; bucket: 'LW' | 'Center' | 'RW'; score: number; holders: string[]; profiles: ReturnType<typeof cardProfiles> };
  const c1Rows: C1Row[] = (Object.keys(ALIGNMENT_RULES.interestCardBucket) as InterestCardId[]).map((id) => ({
    id,
    bucket: ALIGNMENT_RULES.interestCardBucket[id],
    score: snapshot.game.interestGroups[id] ?? 0,
    holders: snapshot.factions.filter((f) => f.interestCards.includes(id)).map((f) => f.name),
    profiles: cardProfiles(snapshot, id),
  }));

  type C2Row = { id: LobbyCardId; proxy: InterestCardId; bucket: 'LW' | 'Center' | 'RW'; score: number; holders: string[]; profiles: ReturnType<typeof cardProfiles> };
  const c2Rows: C2Row[] = (Object.keys(ALIGNMENT_RULES.lobbyToInterest) as LobbyCardId[]).map((id) => {
    const proxy = ALIGNMENT_RULES.lobbyToInterest[id];
    return {
      id, proxy,
      bucket: ALIGNMENT_RULES.interestCardBucket[proxy],
      score: snapshot.game.interestGroups[proxy] ?? 0,
      holders: snapshot.factions.filter((f) => f.lobbyCards.includes(id)).map((f) => f.name),
      profiles: cardProfiles(snapshot, proxy),
    };
  });

  type C3Row = { id: IdeologyCardId; bucket: 'LW' | 'Center' | 'RW'; holders: string[] };
  const c3Rows: C3Row[] = (Object.keys(ALIGNMENT_RULES.ideologyCardBucket) as IdeologyCardId[]).map((id) => ({
    id,
    bucket: ALIGNMENT_RULES.ideologyCardBucket[id],
    holders: snapshot.factions.filter((f) => f.ideologyCards.includes(id)).map((f) => f.name),
  }));

  const scoreCell = (score: number): JSX.Element => {
    const pct = ((score + 10) / 20) * 100;
    return (
      <div className="flex items-center gap-2 w-32">
        <span className="font-mono text-xs w-8 text-right">{score.toFixed(1)}</span>
        <div className="flex-1 h-1.5 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div className={`h-full ${score >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  const c1Columns: Column<C1Row>[] = [
    { key: 'id', label: 'Card', sortValue: (r) => r.id, render: (r) => <span className="font-semibold">{r.id}</span> },
    { key: 'bucket', label: 'Fits', sortValue: (r) => r.bucket, render: (r) => <span className="text-xs">{r.bucket}</span> },
    { key: 'score', label: 'Score', sortValue: (r) => r.score, render: (r) => scoreCell(r.score) },
    { key: 'strengthened', label: 'Strengthened by', render: (r) => <span className="text-[11px]">{r.profiles.strengthenedBy.map((b) => `${b.title} (+${b.delta})`).join('; ') || '—'}</span> },
    { key: 'weakened', label: 'Weakened by', render: (r) => <span className="text-[11px]">{r.profiles.weakenedBy.map((b) => `${b.title} (${b.delta})`).join('; ') || '—'}</span> },
    { key: 'holders', label: 'Held by', sortValue: (r) => r.holders.length, render: (r) => <span className="text-[11px]">{r.holders.join(', ') || '—'}</span> },
    { key: 'bonus', label: 'Bonus', render: () => <span className="text-[11px] font-mono">+{ALIGNMENT_RULES.cardBiasPerDelta} × Δ</span> },
  ];

  const c2Columns: Column<C2Row>[] = [
    { key: 'id', label: 'Lobby', sortValue: (r) => r.id, render: (r) => <span className="font-semibold">{r.id}</span> },
    { key: 'proxy', label: 'Proxies →', sortValue: (r) => r.proxy, render: (r) => <span className="text-xs font-mono">{r.proxy}</span> },
    { key: 'bucket', label: 'Fits', sortValue: (r) => r.bucket, render: (r) => <span className="text-xs">{r.bucket}</span> },
    { key: 'score', label: 'Score', sortValue: (r) => r.score, render: (r) => scoreCell(r.score) },
    { key: 'strengthened', label: 'Strengthened by', render: (r) => <span className="text-[11px]">{r.profiles.strengthenedBy.map((b) => `${b.title} (+${b.delta})`).join('; ') || '—'}</span> },
    { key: 'weakened', label: 'Weakened by', render: (r) => <span className="text-[11px]">{r.profiles.weakenedBy.map((b) => `${b.title} (${b.delta})`).join('; ') || '—'}</span> },
    { key: 'holders', label: 'Held by', sortValue: (r) => r.holders.length, render: (r) => <span className="text-[11px]">{r.holders.join(', ') || '—'}</span> },
    { key: 'bonus', label: 'Bonus', render: () => <span className="text-[11px] font-mono">+{ALIGNMENT_RULES.cardBiasPerDelta} × Δ</span> },
  ];

  const c3Columns: Column<C3Row>[] = [
    { key: 'id', label: 'Card', sortValue: (r) => r.id, render: (r) => <span className="font-semibold">{r.id}</span> },
    { key: 'bucket', label: 'Belongs to', sortValue: (r) => r.bucket, render: (r) => <span className="text-xs">{r.bucket}</span> },
    { key: 'holders', label: 'Held by', sortValue: (r) => r.holders.length, render: (r) => <span className="text-[11px]">{r.holders.join(', ') || '—'}</span> },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Faction Alignments</h2>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>See also:</span>
        <button onClick={() => navigateTo('ideology')} className="underline hover:text-blue-600">Ideology Shifts</button>
        <button onClick={() => navigateTo('conversions')} className="underline hover:text-blue-600">Faction Conversions</button>
        <button onClick={() => navigateTo('legislation')} className="underline hover:text-blue-600">Legislation</button>
        <button onClick={() => navigateTo('dashboard')} className="underline hover:text-blue-600">Dashboard</button>
        <button onClick={() => navigateTo('interestGroups')} className="underline hover:text-blue-600">Interest Groups</button>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        2.1.8 is silent — the player's choices in 2.1.5 (ideology), 2.1.6 (conversions), 2.6 (legislation),
        and 2.9 (elections) shape every faction's identity here. Cards that crash drop; aligned interest
        groups that emerge get added. Held cards bias every vote on bills that touch their group and tilt
        election share toward candidates from factions with high-scoring allies.
      </p>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">A — Faction roster</h3>
        <SortableTable rows={rosterRows} columns={rosterColumns} rowKey={(f) => f.id} />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">B — Recent drift</h3>
        <ul className="space-y-1">
          {feed.length === 0 && <li className="text-xs text-slate-500">No alignment drift yet.</li>}
          {feed.map((e, i) => (
            <li key={i} className="text-xs flex items-baseline gap-2 border-b border-slate-200 dark:border-slate-700/50 py-1 flex-wrap">
              <span className="font-mono w-12">{e.year}</span>
              <span className="font-semibold">{factionName(e.factionId)}</span>
              <span className="rounded bg-slate-200 dark:bg-slate-700 px-1 text-[10px]">{KIND_LABELS[e.kind]}</span>
              {e.cardType && <span className="rounded bg-blue-100 dark:bg-blue-900/40 px-1 text-[10px]">{e.cardType}</span>}
              {e.cardId && <span className="font-mono text-[11px]">{e.cardId}</span>}
              {e.fromCardId && <span className="text-slate-500 text-[10px]">← {e.fromCardId}</span>}
              {e.fromPersonality && e.toPersonality && (
                <span className="text-[10px] text-slate-600 dark:text-slate-300">{e.fromPersonality} → {e.toPersonality}</span>
              )}
              {e.reason && <span className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 text-[10px]">{REASON_LABELS[e.reason]}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">C — Values reference library</h3>
        <details className="rounded border border-slate-300 dark:border-slate-700 p-2 text-xs">
          <summary className="cursor-pointer font-semibold">How alignment drift works</summary>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>Interest groups that score ≤ {ALIGNMENT_RULES.dropThreshold} for {ALIGNMENT_RULES.stableTurns} consecutive ticks get dropped from a faction's card list ('crashed').</li>
            <li>Interest groups that score ≥ {ALIGNMENT_RULES.addThreshold} for {ALIGNMENT_RULES.stableTurns} consecutive ticks become emerging cards if they fit the faction's bucket.</li>
            <li>Personality buckets: LW (center &lt; {ALIGNMENT_RULES.personalityBuckets.lwMax}), RW (center ≥ {ALIGNMENT_RULES.personalityBuckets.rwMin}), else Center.</li>
            <li>Vote bias: every held card adds <span className="font-mono">{ALIGNMENT_RULES.cardBiasPerDelta}</span> × bill delta to a voter's pass chance when the bill impacts that group.</li>
            <li>Election bias: a candidate's faction-card scores add <span className="font-mono">{ALIGNMENT_RULES.electionBiasPerScore}</span> × (sum of held group scores), capped ±{ALIGNMENT_RULES.electionBiasCap}.</li>
            <li>Soft cap: at most {ALIGNMENT_RULES.cardCapPerType} interest cards and {ALIGNMENT_RULES.cardCapPerType} lobby cards per faction.</li>
          </ul>
        </details>

        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">C1 — Interest cards</h4>
          <SortableTable rows={c1Rows} columns={c1Columns} rowKey={(r) => r.id} />
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">C2 — Lobby cards</h4>
          <SortableTable rows={c2Rows} columns={c2Columns} rowKey={(r) => r.id} />
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">C3 — Ideology cards</h4>
          <SortableTable rows={c3Rows} columns={c3Columns} rowKey={(r) => r.id} />
        </div>
      </section>
    </div>
  );
}
