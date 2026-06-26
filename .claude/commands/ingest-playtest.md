---
description: Ingest a batch of AMPU playtest forum exports (CSV) and update the four living game docs (context, mechanics, technical guide, roadmap) through the PM → Game Master → Tech Lead → Project Manager roles. One review gate per batch.
argument-hint: <path(s) to uploaded CSV file(s) or their folder> — or "bootstrap" to (re)generate the docs from the current codebase
---

Batch to ingest: $ARGUMENTS

Run the AMPU knowledge-ingestion pipeline below. The goal is to fold large
playtest forum exports into the **four living docs in `docs/game/`** so future
`/build-feature` runs can rely on compact, current knowledge instead of re-reading
1MB CSVs. There is **one review gate per batch** (the user chose this cadence):
run all four roles, then present a consolidated summary and wait for approval
before committing/pushing. Keep summaries tight.

If no path is given and there are no `docs/game/sources/*` chunks, ask the user
for the file path(s) before proceeding. If the argument is `bootstrap`, skip
step 0 and run each role in **bootstrap mode** (source = the current codebase;
no thread digest is produced).

### Pre-flight: branch base (do this BEFORE any work)
Create the batch branch off the **remote** main, never stale local `main`:
`git fetch origin && git checkout -b claude/ingest-<era-slug> origin/main`
(if continuing an unmerged same-era branch instead, confirm it already descends
from origin/main: `git merge-base --is-ancestor origin/main HEAD` must succeed).
**A branch cut from a stale local `main` silently misses prior batches' doc
content, so every role then edits outdated files and the branch can't fast-forward
main.** This actually happened once (a batch branched off a 5-batch-old local
main); the fix was an expensive mid-batch `git reset --hard origin/main` + redo.
Pin the base up front to avoid it.

### 0. Preprocess (no checkpoint)
For each uploaded CSV, run:
`node scripts/playtestToText.mjs <path> [more...]`
This writes cleaned, chunked text to `docs/game/sources/<thread-slug>/` (gitignored)
plus a `manifest.json`. Report the post/chunk counts. If a file isn't a forum CSV
(no `Post` column), say so and skip it. The raw uploads and these chunks are
disposable; only the digest + living docs are committed.

### 1. Historian (historical context)
Invoke the `historian` agent in **ingest mode**. It does a light scan to pin the
era(s) the batch covers, researches the real history (WebSearch + WebFetch), and
updates the living `docs/game/historical-context.md` (era-by-era), flagging where
the game's treatment diverges from real history. This runs FIRST so its context
informs the PM and Game Master. No checkpoint — committed with the batch.

### 2. Game PM (digest + context)
Invoke the `game-pm` agent. Tell it to read the historian's
`docs/game/historical-context.md` for era-accurate framing. It reads the chunks
(via the manifest), writes a compact per-thread digest to
`docs/game/playtest-digests/<thread-slug>.md`, and updates
`docs/game/game-context.md` — especially the **Built vs. Designed gap log**.
Skim its returned delta list; this is the batch's core signal.

### 3. Game Master (mechanics)
Invoke the `game-master` agent. Tell it to read the historian's
`docs/game/historical-context.md` so era framing in the mechanics stays accurate.
It reads the new digest (spot-reading chunks / codebase as needed) and updates
`docs/game/game-mechanics.md` with newly-revealed or changed rules and system
interactions, labeling shipped-vs-designed.

### 4. Tech Lead (technical guide + sequencing)
Invoke the `tech-lead` agent. It updates `docs/game/technical-guide.md` against
the codebase and this batch's deltas, and produces **dependency/sequencing
advice** for the roadmap. Capture that advice for the next step.

### 5. Project Manager (roadmap)
Invoke the `roadmap-planner` agent. It turns the game-pm gap log into a
dependency-ordered, sized backlog in `docs/game/roadmap.md`, ordered per the
tech-lead's sequencing advice.

### 6. Review gate (CHECKPOINT — one per batch)
Present a consolidated summary: post/chunk counts, the era(s) the historian
grounded, the new digest, the key deltas the PM logged, the mechanics
added/changed, the tech-lead's top sequencing call, and the top of the updated
roadmap. Use `AskUserQuestion` so the user can approve or redirect from their
phone.

Before presenting the gate, run a **final integrity check** on every changed
living doc: line count ≥ its `origin/main` version and `diff` of section headers
shows additions only (per the large-doc guardrail in Notes). Surface any
discrepancy in the summary.

Only after explicit approval: commit the digest + the five `docs/game/*.md`
living docs (historical-context, game-context, game-mechanics, technical-guide,
roadmap — NOT the gitignored `docs/game/sources/`) and push to the working
branch. Never push to main, never open a PR, and never use destructive git
without explicit instruction.

### Notes
- **★ Protect the large living docs (`game-mechanics.md` ≈9k lines,
  `technical-guide.md` ≈5k, `roadmap.md` ≈3k, `game-context.md` ≈1.5k).** They are
  too large to safely rewrite wholesale — an agent that does a whole-file `Write`
  can silently truncate the tail or drop earlier batches' content. In each role
  prompt (steps 1–5) instruct the agent: **edit its living doc with targeted
  `Edit` calls ONLY — never `Write`; note `wc -l` before and after and confirm the
  count GREW, not shrank.** (The `historian` agent has only `Write`, so for big
  parent files have it return a *targeted-additions list* or write a small
  companion file instead of rewriting — see how `historical-context-*.md`
  companions are used.) **After each role returns, the orchestrator VERIFIES the
  doc against `origin/main`:** `diff <(git show origin/main:<doc> | grep -E '^#+ ')
  <(grep -E '^#+ ' <doc>)` must show **additions only** (no lost section headers),
  and the line count must not drop. If a doc was truncated/degraded, restore it
  (`git checkout origin/main -- <doc>`) and re-apply that batch's additions before
  continuing. Catching this early (right after the role) is cheap; catching it at
  the review gate is not.
- The five roles run **in order** (historian → game-pm → game-master → tech-lead
  → roadmap-planner; each later role reads the earlier outputs), so do not
  parallelize them within a batch. (When a single batch has multiple threads, the
  per-thread game-pm digests may be parallelized since they write separate files.)
- For very large batches, the game-pm should summarize chunk-by-chunk rather than
  holding all chunks in context at once; the other roles read the compact digest,
  not the raw chunks.
- Keep every living doc **scannable** — these are read often. Prefer tables and
  tight sections; prune stale content as the game evolves.
