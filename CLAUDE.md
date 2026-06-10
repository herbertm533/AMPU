# AMPU — Claude Code Project Guide

AMPU is a turn-based American political strategy game (single-player, browser).
You run a party/faction across historical eras (a 1772 founding scenario and an
1856 antebellum scenario): draft politicians, win elections, pass legislation,
and steer era events.

## Stack & commands
- React 18 + TypeScript (strict) + Vite + Tailwind. State persists in IndexedDB
  (`src/db.ts`). No router — pages are a registry.
- Dev server: `npm run dev` (open the printed localhost URL)
- Production build: `npm run build` (`tsc -b && vite build`) — run before calling code done
- Typecheck only: `npm run lint` (`tsc -b --noEmit`)
- Preview built app: `npm run preview`

## Architecture
- `src/types.ts` — all core types: `FullGameSnapshot` (the entire game state),
  `GameState`, `Politician`, `Skills`, `Ideology`, `ImportedDraftee`,
  factions/states/offices. **Start here.**
- `src/state/GameContext.tsx` — React context. Loads/saves the snapshot
  (IndexedDB via `src/db.ts`), autosaves each phase, and fetches the standard
  draft dataset on mount (`loadStandardDraftClasses`).
- `src/engine/` — **pure** functions over the snapshot (no React, no I/O):
  - `engine.ts` — `runCurrentPhase`, `advancePhase` (the turn loop)
  - `phaseRunners.ts` — per-phase logic, incl. the draft (`runPhase_2_1_1_Draft`) and elections (`calcStateVote`)
  - `territories.ts` (`admitState`); era systems `continentalCongress.ts`, `constitutionalConvention.ts`, `revolutionaryWar.ts`; `log.ts`
- `src/phases.ts` — `PHASE_SEQUENCE`, `shouldRunPhase`, year predicates:
  `isDraftYear`/`isPresidentialYear` (`year % 4 === 0`), `isElectionYear` (`year % 2 === 0`)
- `src/pv.ts` — `computePV`/`refreshPv`: a politician's Political Value, weighted
  by office. **PV drives elections** — change it carefully.
- `src/rng.ts` — seeded RNG; keep engine code deterministic (don't use `Math.random`)
- `src/data/` — scenarios (`scenario1772.ts`, `scenario1856.ts`) + seed
  politicians/factions/states/era-events; `expansionStates.ts`; draft data (below)
- `src/pages/` + `registry.ts` — screens (keyed by `PageId`); `src/components/` — shared UI + modals

## Draft dataset pipeline (author-time Node scripts in `scripts/`)
The bundled "standard draft classes" are **generated**, not hand-written. Do NOT
hand-edit `src/data/defaultDraftClasses.ts`, `public/standard-draft-classes.json`,
or `politicians-dataset.csv` — edit the scripts and regenerate.

> **Adding politicians from historical sources** (the user sends Wikipedia
> election pages, etc.): read **`docs/draft-class-authoring.md`** first — it's
> the playbook with the established conventions, the who-to-include bar, the
> sub-floor balance rule, stat/ideology heuristics, and a progress tracker.
- `scripts/seedDataset.mjs` — curated authoring source:
  - `CURATED_ROWS` — marquee in-game figures; **override** same-named dataset entries
  - `ERA_FIGURES` — founding-era notables who never served in Congress; **additive-only**
- `scripts/fetchLegislators.sh` — downloads sources into `.legis/` (gitignored):
  `unitedstates/congress-legislators` YAML (everyone who served, real birthdays) +
  MEDSL house/senate/president CSVs (failed candidates)
- `scripts/legislatorsToDataset.mjs` — merges all → `public/standard-draft-classes.json`
  (full ~18.5k, runtime-loaded), `politicians-dataset.csv` (human review),
  `src/data/defaultDraftClasses.ts` (small curated offline fallback)
- Regenerate: `bash scripts/fetchLegislators.sh && node scripts/legislatorsToDataset.mjs && npm run build`

### Dataset rules
- `draftYear` = nearest multiple of 4 to `birthYear + 25`, clamped to ≥ 1772 (the inaugural draft)
- Merge precedence: served members (real data) < `CURATED_ROWS` (override).
  `ERA_FIGURES` and failed candidates are added only if no same-name person exists
  within ~25 years (different era ⇒ different person ⇒ distinct key)
- Failed candidates / era figures get **sub-floor** electoral stats (legislative ≤ 1,
  low command) so they rarely win — a deliberate balance rule

## Domain quick-reference
- Skills are integers **0–5**: `admin, legislative, judicial, military, governing, backroom`. Plus `command` and `traits[]`.
- `ideology` is a 7-point scale: `LW Populist, Progressive, Liberal, Moderate, Conservative, Traditionalist, RW Populist`
- Drafts occur when `year % 4 === 0`; the 1772 inaugural draft is dataset-driven

## Conventions
- Minimal comments — only for non-obvious *why*. No speculative abstractions or backwards-compat shims.
- Engine code stays pure over the snapshot; UI lives in pages/components. TypeScript strict; match existing patterns.

## Definition of done
- `npm run build` passes (typecheck + build).
- For any gameplay/UI change, **playtest it**: `npm run dev`, start the relevant
  scenario, exercise the feature. Build/typecheck prove correctness — not that the
  game is fun or balanced. That judgment is human.
- Pushing and opening/merging PRs are **human-approved checkpoints**. Never push or merge without explicit approval.
