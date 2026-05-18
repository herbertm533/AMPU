import type { ImportedDraftee } from '../types';
import { DEFAULT_DRAFT_CLASSES } from './defaultDraftClasses';

// The engine reads STANDARD_DRAFT_CLASSES synchronously. It starts as the
// small curated built-in set (founders + marquee in-game figures) so the 1772
// inaugural draft always works immediately and offline. At app start we fetch
// the full ~12k historical set (public/standard-draft-classes.json, ~2.7MB)
// and swap it in for later draft years, keeping it out of the app JS bundle.
export let STANDARD_DRAFT_CLASSES: ImportedDraftee[] = DEFAULT_DRAFT_CLASSES;

let loaded = false;

export async function loadStandardDraftClasses(): Promise<void> {
  if (loaded) return;
  loaded = true;
  try {
    const url = `${import.meta.env.BASE_URL}standard-draft-classes.json`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = (await res.json()) as ImportedDraftee[];
    if (Array.isArray(data) && data.length > 0) {
      STANDARD_DRAFT_CLASSES = data;
    }
  } catch {
    // keep the curated built-in fallback
  }
}
