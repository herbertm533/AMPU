import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  GameState,
  Politician,
  Faction,
  Party,
  State,
  EventEntry,
  Legislation,
  ElectionResult,
  War,
  FullGameSnapshot,
} from './types';

interface AmpuDB extends DBSchema {
  game: {
    key: string;
    value: GameState;
  };
  politicians: {
    key: string;
    value: Politician;
    indexes: { 'by-faction': string; 'by-party': string };
  };
  factions: {
    key: string;
    value: Faction;
    indexes: { 'by-party': string };
  };
  parties: {
    key: string;
    value: Party;
  };
  states: {
    key: string;
    value: State;
  };
  events: {
    key: string;
    value: EventEntry;
    indexes: { 'by-year': number };
  };
  legislation: {
    key: string;
    value: Legislation;
    indexes: { 'by-year': number };
  };
  elections: {
    key: string;
    value: ElectionResult;
    indexes: { 'by-year': number };
  };
  wars: {
    key: string;
    value: War;
  };
}

const DB_NAME = 'ampu-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<AmpuDB> | null = null;

export async function getDb(): Promise<IDBPDatabase<AmpuDB>> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB<AmpuDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('game')) {
        db.createObjectStore('game', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('politicians')) {
        const store = db.createObjectStore('politicians', { keyPath: 'id' });
        store.createIndex('by-faction', 'factionId');
        store.createIndex('by-party', 'partyId');
      }
      if (!db.objectStoreNames.contains('factions')) {
        const store = db.createObjectStore('factions', { keyPath: 'id' });
        store.createIndex('by-party', 'partyId');
      }
      if (!db.objectStoreNames.contains('parties')) {
        db.createObjectStore('parties', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('states')) {
        db.createObjectStore('states', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('events')) {
        const store = db.createObjectStore('events', { keyPath: 'id' });
        store.createIndex('by-year', 'year');
      }
      if (!db.objectStoreNames.contains('legislation')) {
        const store = db.createObjectStore('legislation', { keyPath: 'id' });
        store.createIndex('by-year', 'year');
      }
      if (!db.objectStoreNames.contains('elections')) {
        const store = db.createObjectStore('elections', { keyPath: 'id' });
        store.createIndex('by-year', 'year');
      }
      if (!db.objectStoreNames.contains('wars')) {
        db.createObjectStore('wars', { keyPath: 'id' });
      }
    },
  });
  return dbInstance;
}

export async function loadSnapshot(): Promise<FullGameSnapshot | null> {
  const db = await getDb();
  const game = await db.get('game', 'game');
  if (!game) return null;
  const [politicians, factions, parties, states, events, legislation, elections, wars] = await Promise.all([
    db.getAll('politicians'),
    db.getAll('factions'),
    db.getAll('parties'),
    db.getAll('states'),
    db.getAll('events'),
    db.getAll('legislation'),
    db.getAll('elections'),
    db.getAll('wars'),
  ]);
  return { game, politicians, factions, parties, states, events, legislation, elections, wars };
}

export async function saveSnapshot(snapshot: FullGameSnapshot): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(
    ['game', 'politicians', 'factions', 'parties', 'states', 'events', 'legislation', 'elections', 'wars'],
    'readwrite'
  );
  await Promise.all([
    tx.objectStore('game').put({ ...snapshot.game, lastSavedAt: Date.now() }),
    ...snapshot.politicians.map((p) => tx.objectStore('politicians').put(p)),
    ...snapshot.factions.map((f) => tx.objectStore('factions').put(f)),
    ...snapshot.parties.map((p) => tx.objectStore('parties').put(p)),
    ...snapshot.states.map((s) => tx.objectStore('states').put(s)),
    ...snapshot.events.map((e) => tx.objectStore('events').put(e)),
    ...snapshot.legislation.map((l) => tx.objectStore('legislation').put(l)),
    ...snapshot.elections.map((e) => tx.objectStore('elections').put(e)),
    ...snapshot.wars.map((w) => tx.objectStore('wars').put(w)),
  ]);
  await tx.done;
}

export async function clearDb(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(
    ['game', 'politicians', 'factions', 'parties', 'states', 'events', 'legislation', 'elections', 'wars'],
    'readwrite'
  );
  await Promise.all([
    tx.objectStore('game').clear(),
    tx.objectStore('politicians').clear(),
    tx.objectStore('factions').clear(),
    tx.objectStore('parties').clear(),
    tx.objectStore('states').clear(),
    tx.objectStore('events').clear(),
    tx.objectStore('legislation').clear(),
    tx.objectStore('elections').clear(),
    tx.objectStore('wars').clear(),
  ]);
  await tx.done;
}

export async function exportJson(): Promise<string> {
  const snap = await loadSnapshot();
  if (!snap) return '{}';
  return JSON.stringify(snap, null, 2);
}

export async function importJson(json: string): Promise<void> {
  const snap = JSON.parse(json) as FullGameSnapshot;
  await clearDb();
  await saveSnapshot(snap);
}
