#!/usr/bin/env node
// Convert the open `unitedstates/congress-legislators` dataset (+ executives)
// into the AMPU draft schema.
//
// Inputs (download first into .legis/ — see scripts/fetchLegislators.sh):
//   .legis/legislators-current.yaml
//   .legis/legislators-historical.yaml
//   .legis/executive.yaml
//
// Outputs:
//   public/standard-draft-classes.json   (full set, runtime-loaded)
//   politicians-dataset.csv               (human-reviewable, full set)
//
// The hand-curated Phase-1 rows (scripts/seedDataset.mjs ROWS) override the
// bulk-derived rows for the same person, so marquee in-game figures keep their
// tuned stats. Stats for everyone else are heuristic (party->ideology,
// tenure->skills) — explicitly approximate, as agreed for the mass set.

import { readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { CURATED_ROWS, ERA_FIGURES } from './seedDataset.mjs';

const FLOOR = 1772;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const draftYearFor = (b) => Math.max(FLOOR, Math.round((b + 25) / 4) * 4);
const wiki = (t, first, last) =>
  'https://en.wikipedia.org/wiki/' +
  encodeURIComponent((t || `${first} ${last}`).replace(/\s+/g, '_'));

// postal -> our canonical state id (base 1856 ids are postal-lowercased and
// already match; only the later-added states/territories need remapping)
const STATE_MAP = {
  AK: 'alaska', AZ: 'arizona', CO: 'colorado', HI: 'hawaii', ID: 'idaho',
  KS: 'kansas', MN: 'minnesota', MT: 'montana', NE: 'nebraska', NV: 'nevada',
  NM: 'new_mexico', ND: 'north_dakota', OK: 'oklahoma', OR: 'oregon',
  SD: 'south_dakota', UT: 'utah', WA: 'washington', WV: 'west_virginia',
  WY: 'wyoming', DC: 'district_of_columbia', PR: 'puerto_rico', GU: 'guam',
  VI: 'us_virgin_islands', AS: 'american_samoa', MP: 'northern_marianas',
};
const stateId = (postal) => {
  if (!postal) return 'ny';
  const up = postal.toUpperCase();
  return STATE_MAP[up] ?? postal.toLowerCase();
};

function ideologyFor(party) {
  const p = (party || '').toLowerCase();
  if (/federalist|pro-administration/.test(p)) return 'Conservative';
  if (/anti-administration|democratic-republican|jeffersonian/.test(p)) return 'Liberal';
  if (/^republican|^national republican|gop/.test(p)) return 'Conservative';
  if (/democrat/.test(p)) return 'Liberal';
  if (/whig/.test(p)) return 'Moderate';
  if (/anti-jackson|adams|nullifier|states.?rights|constitutional union/.test(p)) return 'Traditionalist';
  if (/jackson/.test(p)) return 'Liberal';
  if (/free soil|readjuster|liberal republican/.test(p)) return 'Progressive';
  if (/populist|greenback|farmer|labor|socialist|progressive|silver/.test(p)) return 'LW Populist';
  if (/conservative|dixiecrat|states/.test(p)) return 'Traditionalist';
  return 'Moderate';
}

function record(person, isExec) {
  const name = person.name || {};
  const bio = person.bio || {};
  const terms = person.terms || [];
  const first = (name.first || '').trim();
  const last = (name.last || '').trim();
  if (!first || !last) return null;

  let birthYear = null;
  if (bio.birthday && /^\d{4}/.test(bio.birthday)) birthYear = parseInt(bio.birthday.slice(0, 4), 10);

  // total years served (sum term spans)
  let years = 0;
  let lastParty = '';
  let lastState = '';
  let anySenate = false;
  for (const t of terms) {
    const s = t.start ? parseInt(t.start.slice(0, 4), 10) : null;
    const e = t.end ? parseInt(t.end.slice(0, 4), 10) : null;
    if (s && e) years += Math.max(1, e - s);
    if (t.party) lastParty = t.party;
    if (t.state) lastState = t.state;
    if (t.type === 'sen') anySenate = true;
  }
  if (birthYear == null) {
    // estimate from first term: assume ~age 35 at first election
    const firstStart = terms[0]?.start ? parseInt(terms[0].start.slice(0, 4), 10) : null;
    const execStart = isExec && person.terms?.[0]?.start ? parseInt(person.terms[0].start.slice(0, 4), 10) : null;
    const ref = firstStart ?? execStart;
    if (ref) birthYear = ref - 35;
  }
  if (birthYear == null || birthYear < 1700 || birthYear > 2005) return null;

  const draftYear = draftYearFor(birthYear);
  const leg = clamp(2 + Math.floor(years / 8), 1, 5);
  const back = clamp(1 + Math.floor(years / 12), 0, 4);
  let admin = 1, gov = 1, jud = 1, mil = 0, cmd = clamp(Math.floor(years / 14), 0, 3);
  if (anySenate) cmd = clamp(cmd + 1, 0, 4);
  if (isExec) { admin = 4; cmd = clamp(cmd + 2, 1, 5); gov = 3; }

  return {
    draftYear,
    firstName: first,
    lastName: last,
    state: stateId(isExec ? lastState || 'ny' : lastState),
    ideology: ideologyFor(lastParty),
    birthYear,
    age: draftYear - birthYear,
    skills: { admin, legislative: leg, judicial: jud, military: mil, governing: gov, backroom: back },
    command: cmd,
    traits: isExec ? ['Leadership'] : [],
    expertise: [],
    party: lastParty || (isExec ? 'President' : ''),
    wikiUrl: wiki(person.id?.wikipedia, first, last),
  };
}

// ---- MEDSL failed-candidate ingestion -------------------------------------
// Serious challengers who LOST (runner-up, >=15% share) for House/Senate/
// President 1976-2018. No birth dates in this data -> estimate. Stats are
// deliberately BELOW the elected baseline (elected get legislative>=2 via the
// tenure heuristic; losers get legislative 1, command 0, no positive traits)
// so their PV stays under anyone who actually served and they rarely win.
function splitCsv(line) {
  const o = []; let c = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"' && line[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { o.push(c); c = ''; }
    else c += ch;
  }
  o.push(c); return o;
}
const BAD_NAME = /write|scatter|blank|^others?$|void|under ?vote|over ?vote|all ?other|none of|^n\/?a$|^total$|unknown|^#|tbd|withdrew|no candidate|^vacan/i;
const title = (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
const SUFFIX = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v']);
function parseName(raw) {
  let s = (raw || '').replace(/\s+/g, ' ').trim();
  if (!s || s.length < 3 || BAD_NAME.test(s) || !/[a-z]/i.test(s)) return null;
  s = s.replace(/\([^)]*\)/g, '').trim();
  let first, last;
  if (s.includes(',')) {
    const p = s.split(',');
    last = p[0].trim();
    first = (p[1] || '').trim().split(' ')[0];
  } else {
    const t = s.split(' ').filter((x) => !SUFFIX.has(x.replace(/\./g, '').toLowerCase()));
    if (t.length < 2) return null;
    first = t[0];
    last = t[t.length - 1];
  }
  first = title(first.replace(/[^A-Za-z'.-]/g, ''));
  last = title(last.replace(/[^A-Za-z'.-]/g, ''));
  if (!first || !last) return null;
  return { first, last };
}
function medslLosers() {
  const recs = [];
  const num = (x) => { const n = parseInt(x, 10); return Number.isNaN(n) ? 0 : n; };

  for (const [file, office] of [['1976-2018-house.csv', 'H'], ['1976-2018-senate.csv', 'S']]) {
    let lines;
    try { lines = readFileSync(new URL(`../.legis/${file}`, import.meta.url), 'utf8').split(/\r?\n/); }
    catch { continue; }
    const head = splitCsv(lines[0]).map((h) => h.replace(/"/g, ''));
    const ix = (n) => head.indexOf(n);
    const races = new Map();
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      const r = splitCsv(lines[i]).map((v) => v.replace(/^"|"$/g, ''));
      if (r[ix('stage')] !== 'gen') continue;
      if (String(r[ix('writein')]).toUpperCase() === 'TRUE') continue;
      const nm = parseName(r[ix('candidate')]);
      if (!nm) continue;
      const year = num(r[ix('year')]);
      const po = r[ix('state_po')];
      const dist = office === 'H' ? r[ix('district')] : 'sw';
      const special = r[ix('special')];
      const rk = `${year}|${po}|${dist}|${special}`;
      const ck = `${nm.first} ${nm.last}`.toLowerCase();
      if (!races.has(rk)) races.set(rk, { year, po, total: 0, cands: new Map() });
      const race = races.get(rk);
      race.total = Math.max(race.total, num(r[ix('totalvotes')]));
      const cur = race.cands.get(ck) || { nm, party: r[ix('party')], votes: 0 };
      cur.votes += num(r[ix('candidatevotes')]);
      race.cands.set(ck, cur);
    }
    for (const race of races.values()) {
      const ranked = [...race.cands.values()].sort((a, b) => b.votes - a.votes);
      const runnerUp = ranked[1];
      if (!runnerUp || race.total <= 0) continue;
      if (runnerUp.votes / race.total < 0.15) continue; // serious challenger only
      recs.push(mkLoser(runnerUp.nm, runnerUp.party, race.po, race.year, office));
    }
  }

  // President: aggregate national votes per candidate per year
  try {
    const lines = readFileSync(new URL('../.legis/1976-2016-president.csv', import.meta.url), 'utf8').split(/\r?\n/);
    const head = splitCsv(lines[0]).map((h) => h.replace(/"/g, ''));
    const ix = (n) => head.indexOf(n);
    const byYear = new Map();
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      const r = splitCsv(lines[i]).map((v) => v.replace(/^"|"$/g, ''));
      if (String(r[ix('writein')]).toUpperCase() === 'TRUE') continue;
      const nm = parseName(r[ix('candidate')]);
      if (!nm) continue;
      const year = num(r[ix('year')]);
      const ck = `${nm.first} ${nm.last}`.toLowerCase();
      if (!byYear.has(year)) byYear.set(year, { total: 0, cands: new Map() });
      const y = byYear.get(year);
      y.total += num(r[ix('candidatevotes')]);
      const cur = y.cands.get(ck) || { nm, party: r[ix('party')], votes: 0 };
      cur.votes += num(r[ix('candidatevotes')]);
      y.cands.set(ck, cur);
    }
    for (const [year, y] of byYear) {
      const ranked = [...y.cands.values()].sort((a, b) => b.votes - a.votes);
      for (let i = 1; i < ranked.length; i++) {
        if (y.total > 0 && ranked[i].votes / y.total >= 0.15) {
          recs.push(mkLoser(ranked[i].nm, ranked[i].party, 'us', year, 'P'));
        }
      }
    }
  } catch { /* file missing */ }
  return recs;
}
function mkLoser(nm, party, po, year, office) {
  const birthYear = year - (office === 'P' ? 57 : 53);
  const draftYear = draftYearFor(birthYear);
  // Strictly below the elected baseline (elected: legislative>=2, tenure cmd).
  const skills = { admin: 1, legislative: 1, judicial: 0, military: 0, governing: 1, backroom: 1 };
  const command = office === 'P' ? 1 : 0;
  return {
    draftYear,
    firstName: nm.first,
    lastName: nm.last,
    state: office === 'P' ? 'ny' : stateId(po),
    ideology: ideologyFor(party),
    birthYear,
    age: draftYear - birthYear,
    skills,
    command,
    traits: [],
    expertise: [],
    party: party ? title(party) : '',
    wikiUrl: wiki(null, nm.first, nm.last),
  };
}
// ---------------------------------------------------------------------------

const load = (f) => yaml.load(readFileSync(new URL(`../.legis/${f}`, import.meta.url), 'utf8'));

const out = new Map(); // key: lowercase "first last"
let scanned = 0;
for (const [file, isExec] of [['legislators-historical.yaml', false], ['legislators-current.yaml', false], ['executive.yaml', true]]) {
  for (const person of load(file)) {
    scanned++;
    const r = record(person, isExec);
    if (!r) continue;
    const key = `${r.firstName} ${r.lastName}`.toLowerCase();
    if (!out.has(key)) out.set(key, r); // first occurrence (historical before current)
  }
}

// Overlay curated rows (in-game marquee figures keep tuned stats/ideology)
for (const c of CURATED_ROWS) {
  const key = `${c.firstName} ${c.lastName}`.toLowerCase();
  out.set(key, c);
}

// Founding-era figures / notable early losers — era-aware additive merge.
// A name match is only treated as "same person, skip" when an existing
// same-named entry was born within a generation of the era figure. If every
// same-named person is from a far-off era, it's a DIFFERENT historical person
// (e.g. Gen. John Sullivan b.1740 vs. a Congressman John Sullivan b.1868), so
// we add them under a distinct key and never overwrite the later member.
const ERA_SAME_PERSON_WINDOW = 25; // years; ~one generation
const nameBirthIndex = new Map(); // "first last" -> [birthYear, ...]
for (const v of out.values()) {
  const k = `${v.firstName} ${v.lastName}`.toLowerCase();
  const arr = nameBirthIndex.get(k);
  if (arr) arr.push(v.birthYear);
  else nameBirthIndex.set(k, [v.birthYear]);
}
let eraAdded = 0;
let eraSkipped = 0;
for (const e of ERA_FIGURES) {
  const key = `${e.firstName} ${e.lastName}`.toLowerCase();
  const sameName = nameBirthIndex.get(key);
  const sameEra = sameName && sameName.some((by) => Math.abs(by - e.birthYear) <= ERA_SAME_PERSON_WINDOW);
  if (sameEra) { eraSkipped++; continue; } // likely the same person / already covered
  const uniqueKey = sameName ? `${key}#${e.birthYear}` : key;
  out.set(uniqueKey, e);
  if (sameName) sameName.push(e.birthYear);
  else nameBirthIndex.set(key, [e.birthYear]);
  eraAdded++;
}

// Add serious failed challengers — only if the name isn't already present
// (anyone who ever served, or a curated figure, keeps their stronger record).
let losersAdded = 0;
for (const l of medslLosers()) {
  const key = `${l.firstName} ${l.lastName}`.toLowerCase();
  if (!out.has(key)) { out.set(key, l); losersAdded++; }
}

const list = [...out.values()].sort((a, b) => a.draftYear - b.draftYear || a.lastName.localeCompare(b.lastName));

// JSON (runtime asset) — drop review-only fields the engine doesn't use
const jsonList = list.map(({ party, wikiUrl, age, ...keep }) => keep);
writeFileSync(new URL('../public/standard-draft-classes.json', import.meta.url), JSON.stringify(jsonList));

// CSV (human review) — full, with party + wikiUrl
const header = ['draftYear','firstName','lastName','state','ideology','birthYear','age','admin','legislative','judicial','military','governing','backroom','command','traits','expertise','party','wikiUrl'];
const lines = [header.join(',')];
for (const r of list) {
  lines.push([
    r.draftYear, csv(r.firstName), csv(r.lastName), r.state, r.ideology, r.birthYear, '',
    r.skills.admin, r.skills.legislative, r.skills.judicial, r.skills.military, r.skills.governing, r.skills.backroom,
    r.command, r.traits.join('|'), (r.expertise ?? []).join('|'), csv(r.party), r.wikiUrl,
  ].join(','));
}
function csv(v) { const s = String(v ?? ''); return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }
writeFileSync(new URL('../politicians-dataset.csv', import.meta.url), lines.join('\n') + '\n');

// Curated built-in fallback (founders + marquee in-game figures) — small,
// bundled, guarantees the 1772 inaugural draft works offline / pre-fetch.
const fallback = CURATED_ROWS.map(({ party, wikiUrl, ...keep }) => keep);
const banner = `import type { ImportedDraftee } from '../types';

// =============================================================================
// CURATED BUILT-IN FALLBACK — small set (founders + marquee in-game figures).
// AUTO-GENERATED by scripts/legislatorsToDataset.mjs from the curated rows in
// scripts/seedDataset.mjs. The FULL ~12k historical set is loaded at runtime
// from public/standard-draft-classes.json; this is the offline fallback that
// keeps the 1772 inaugural draft working before/without that fetch.
// =============================================================================

export const DEFAULT_DRAFT_CLASSES: ImportedDraftee[] = ${JSON.stringify(fallback, null, 2)};
`;
writeFileSync(new URL('../src/data/defaultDraftClasses.ts', import.meta.url), banner);

console.log(`Scanned ${scanned} people; added ${eraAdded} era figures (${eraSkipped} skipped as same-era name match), ${losersAdded} failed challengers; emitted ${list.length} unique to public/standard-draft-classes.json and politicians-dataset.csv`);
