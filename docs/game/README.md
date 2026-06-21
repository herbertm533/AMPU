# AMPU — Game Knowledge Base

This folder is the **durable, compact knowledge base** for AMPU, distilled from
playtest forum exports (and the codebase) so that build work can rely on it
without re-reading multi-MB source files. It is maintained by the
`/ingest-playtest` skill, which runs five roles in order.

## The five living docs

| Doc | Role / agent | Answers | Excludes |
|---|---|---|---|
| [`historical-context.md`](./historical-context.md) | Historian (`historian`, ingest mode) | **Real history** behind each era — timeline, figures, actual issues/alignments, period terminology, and where the game diverges from history | game design, code, the backlog |
| [`game-context.md`](./game-context.md) | Game PM (`game-pm`) | **What** the game is — vision, eras, entities, glossary, and the **Built vs. Designed gap log** | deep rule math, code, build order |
| [`game-mechanics.md`](./game-mechanics.md) | Game Master (`game-master`) | **The rules** — how every system works, the turn/phase flow across the whole timeline, how systems interact | the vision narrative, code, what's next |
| [`technical-guide.md`](./technical-guide.md) | Tech Lead (`tech-lead`) | **How** the game is built — architecture, data flow, patterns, how to add a system correctly | game rules, the backlog |
| [`roadmap.md`](./roadmap.md) | Project Manager (`roadmap-planner`) | **When / in what order** to build, sequenced per the Tech Lead's advice | how-to-build, the rules |

Lanes are intentionally crisp — history = REAL past, context = WHAT (+gaps),
mechanics = RULES, technical = HOW, roadmap = ORDER — so the docs don't drift
into duplicating each other. The historian runs first so its real-history
grounding informs the PM's framing and the Game Master's era-appropriate rules.

## Two-tier knowledge (why this survives the context window)

- **Per-thread digests** — `playtest-digests/<thread>.md`: a small, committed,
  citable summary of each ingested forum thread (provenance).
- **Living docs** — the five files above: synthesis *across* all digests.
- **Raw cleaned text** — `sources/<thread>/chunk-*.md`: bulky, **gitignored**,
  regenerable from the raw upload. Only the digests + living docs are committed.

When `/build-feature` runs, it reads the compact living docs — not the source
CSVs.

## How to add knowledge

1. Upload the forum CSV export(s).
2. Run `/ingest-playtest <path-to-file(s)>`.
3. The skill preprocesses the CSV → cleaned chunks, then runs:
   Historian (real-history context) → Game PM (digest + context) → Game Master
   (mechanics) → Tech Lead (technical guide + sequencing) → Project Manager
   (roadmap).
4. Review the one consolidated summary, then approve the commit.

To regenerate the docs from the current codebase alone: `/ingest-playtest bootstrap`.

## Provenance of the bootstrap

The initial versions of these docs were generated from the AMPU codebase and
CLAUDE.md (the game as shipped through the PR1–7 expertise/trait/cabinet/lobby
epic), **before** any forum file was ingested. Forum digests enrich and correct
them over time — where a doc says "designed, not built," that delta came from
playtest sources and is tracked in the gap log.
