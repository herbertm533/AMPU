import type { Ideology, Trait, Politician, ImportedDraftee, Skills } from '../types';
import { IDEOLOGY_ORDER, POSITIVE_TRAITS, NEGATIVE_TRAITS } from '../types';
import { uid } from '../rng';

export type { ImportedDraftee };

export const ALL_TRAITS: Trait[] = [...POSITIVE_TRAITS, ...NEGATIVE_TRAITS];

export const CSV_COLUMNS = [
  'draftYear',
  'firstName',
  'lastName',
  'state',
  'ideology',
  'birthYear',
  'age',
  'admin',
  'legislative',
  'judicial',
  'military',
  'governing',
  'backroom',
  'command',
  'traits',
] as const;

// Generate a CSV template with header, a few example rows, and a reference
// block (as trailing comment lines) listing valid values.
export function buildCsvTemplate(): string {
  const header = CSV_COLUMNS.join(',');
  const examples = [
    '1860,Ulysses,Grant,oh,Moderate,1822,,2,1,1,5,2,3,3,Military|Crisis Manager',
    '1860,Mark,Twain,mo,Liberal,1835,,1,2,1,0,1,2,2,Celebrity|Media',
    '1776,Alexander,Hamilton,ny,Conservative,1755,,4,3,2,2,1,3,3,Egghead',
    '1776,James,Madison,va,Liberal,1751,,3,4,3,0,2,3,3,Egghead|Reformist',
  ];
  const reference = [
    '',
    '# ---------------------------------------------------------------------',
    '# REFERENCE — delete these comment lines before importing if you like;',
    '# the importer ignores any line starting with #',
    '#',
    '# draftYear : the year this politician enters the draft pool. Must be a',
    '#             draft year (a multiple of 4, e.g. 1776, 1860, 1864).',
    '# state     : two-letter state/colony abbreviation (case-insensitive).',
    '#             1856 states: ME NH VT MA RI CT NY NJ PA DE MD VA NC SC GA',
    '#             FL AL MS LA TX AR TN KY MO OH IN IL MI WI IA CA',
    '#             1772 colonies: NH MA RI CT NY NJ PA DE MD VA NC SC GA',
    '# ideology  : one of — ' + IDEOLOGY_ORDER.join(' | '),
    '# birthYear : year of birth. Age is derived as draftYear - birthYear.',
    '#             Preferred. Leave the age column blank if you set this.',
    '# age       : optional fallback if birthYear is blank (integer 25-70).',
    '# skills    : admin, legislative, judicial, military, governing,',
    '#             backroom — each an integer 0 to 5',
    '# command   : integer 0 to 5',
    '# traits    : zero or more, separated by a pipe |  (NOT commas)',
    '#             Valid: ' + ALL_TRAITS.join(' | '),
    '# ---------------------------------------------------------------------',
  ];
  return [header, ...examples, ...reference].join('\n') + '\n';
}

export interface ParseResult {
  draftees: ImportedDraftee[];
  errors: string[];
  warnings: string[];
}

function normalizeIdeology(raw: string): Ideology | null {
  const t = raw.trim();
  const exact = IDEOLOGY_ORDER.find((i) => i.toLowerCase() === t.toLowerCase());
  return exact ?? null;
}

function normalizeTrait(raw: string): Trait | null {
  const t = raw.trim();
  if (!t) return null;
  const exact = ALL_TRAITS.find((tr) => tr.toLowerCase() === t.toLowerCase());
  return exact ?? null;
}

function clampSkill(raw: string): number {
  const n = parseInt(raw.trim(), 10);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

// Minimal CSV line splitter that supports double-quoted fields.
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function parseDraftCsv(csv: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const draftees: ImportedDraftee[] = [];

  const lines = csv.split(/\r?\n/).map((l) => l).filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));
  if (lines.length === 0) {
    return { draftees, errors: ['File is empty.'], warnings };
  }
  // First non-comment line is the header
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const idx = (name: string): number => header.indexOf(name.toLowerCase());

  const required = ['draftyear', 'firstname', 'lastname', 'state', 'ideology'];
  for (const r of required) {
    if (idx(r) === -1) errors.push(`Missing required column: ${r}`);
  }
  if (idx('birthyear') === -1 && idx('age') === -1) {
    errors.push('Need at least one of: birthYear or age column.');
  }
  if (errors.length > 0) return { draftees, errors, warnings };

  for (let li = 1; li < lines.length; li++) {
    const cells = splitCsvLine(lines[li]);
    const get = (name: string): string => {
      const i = idx(name);
      return i >= 0 && i < cells.length ? cells[i].trim() : '';
    };
    const rowNum = li + 1;

    const draftYear = parseInt(get('draftYear'), 10);
    if (Number.isNaN(draftYear)) {
      warnings.push(`Row ${rowNum}: invalid draftYear, row skipped.`);
      continue;
    }
    const firstName = get('firstName');
    const lastName = get('lastName');
    if (!firstName || !lastName) {
      warnings.push(`Row ${rowNum}: missing name, row skipped.`);
      continue;
    }
    const state = get('state').toLowerCase();
    const ideology = normalizeIdeology(get('ideology'));
    if (!ideology) {
      warnings.push(`Row ${rowNum} (${firstName} ${lastName}): unknown ideology "${get('ideology')}", defaulting to Moderate.`);
    }
    // Resolve birthYear/age. birthYear is primary; age derived as
    // draftYear - birthYear. If only age given, derive birthYear.
    const birthYearRaw = parseInt(get('birthYear'), 10);
    const ageRaw = parseInt(get('age'), 10);
    let birthYear: number;
    let age: number;
    if (!Number.isNaN(birthYearRaw)) {
      birthYear = birthYearRaw;
      age = draftYear - birthYearRaw;
      if (age < 0) {
        warnings.push(`Row ${rowNum} (${firstName} ${lastName}): birthYear ${birthYearRaw} is after draftYear ${draftYear}; age clamped to 25.`);
        age = 25;
        birthYear = draftYear - 25;
      }
    } else if (!Number.isNaN(ageRaw)) {
      age = ageRaw;
      birthYear = draftYear - ageRaw;
    } else {
      age = 35;
      birthYear = draftYear - 35;
      warnings.push(`Row ${rowNum} (${firstName} ${lastName}): no birthYear or age, defaulting to age 35.`);
    }
    const skills: Skills = {
      admin: clampSkill(get('admin')),
      legislative: clampSkill(get('legislative')),
      judicial: clampSkill(get('judicial')),
      military: clampSkill(get('military')),
      governing: clampSkill(get('governing')),
      backroom: clampSkill(get('backroom')),
    };
    const command = clampSkill(get('command'));
    const traitsRaw = get('traits');
    const traits: Trait[] = [];
    if (traitsRaw) {
      for (const part of traitsRaw.split(/[|;]/)) {
        const t = normalizeTrait(part);
        if (t) traits.push(t);
        else if (part.trim()) warnings.push(`Row ${rowNum} (${firstName} ${lastName}): unknown trait "${part.trim()}" ignored.`);
      }
    }
    draftees.push({
      draftYear,
      firstName,
      lastName,
      state: state || 'ny',
      ideology: ideology ?? 'Moderate',
      birthYear,
      age,
      skills,
      command,
      traits,
    });
  }

  if (draftees.length === 0 && warnings.length > 0) {
    errors.push('No valid rows found. See warnings.');
  }
  return { draftees, errors, warnings };
}

// Instantiate Politicians from the imported draftees that match a given year.
export function instantiateDraftees(draftees: ImportedDraftee[], year: number): Politician[] {
  return draftees
    .filter((d) => d.draftYear === year)
    .map((d) => ({
      id: uid('pol'),
      firstName: d.firstName,
      lastName: d.lastName,
      state: d.state,
      factionId: null,
      partyId: null,
      ideology: d.ideology,
      age: d.age,
      birthYear: d.birthYear,
      skills: { ...d.skills },
      traits: [...d.traits],
      currentOffice: null,
      careerTrack: null,
      careerTrackYears: 0,
      command: d.command,
      interests: [],
      isKingmaker: d.command >= 4,
      flipFlopperPenalty: 0,
      pvCache: 0,
      isHistorical: false,
    }));
}
