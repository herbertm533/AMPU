import type { ImportedDraftee } from '../types';

// =============================================================================
// STANDARD DRAFT CLASSES — shipped with the game for ALL players.
//
// This file is the canonical, bundled draft dataset. Every game (new or
// existing save) automatically draws future draft classes from here: a year
// with matching `draftYear` rows uses these politicians instead of random
// rookies. A player can still override per-game via Settings → Custom Draft
// Classes (an imported CSV takes precedence for the years it covers).
//
// HOW THIS GETS POPULATED: this file is AUTO-GENERATED from a source CSV by
//   node scripts/csvToDefaults.mjs path/to/filled.csv
// Send the filled-in template and it will be regenerated and committed so the
// dataset becomes standard for everyone. Until then this is intentionally
// empty and the game falls back to random rookie generation.
// =============================================================================

export const DEFAULT_DRAFT_CLASSES: ImportedDraftee[] = [];
