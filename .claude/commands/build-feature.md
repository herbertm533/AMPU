---
description: Checkpoint-heavy feature pipeline for AMPU — vision → spec → brief → build → review → PR, pausing for your approval at each gate.
argument-hint: <your feature vision, in plain language>
---

Feature vision: $ARGUMENTS

Run the AMPU feature pipeline below. It is **checkpoint-heavy**: STOP at every
checkpoint and wait for my explicit approval. Do NOT proceed past a checkpoint on
your own. Use the `AskUserQuestion` tool at each checkpoint so I can approve or
redirect from my phone. Keep each checkpoint summary tight (a few lines).

If the vision is vague, ask me clarifying questions BEFORE step 1 rather than
guessing.

**Game knowledge base.** Lean on the living docs in `docs/game/` (see
`docs/game/README.md`) throughout this pipeline — they are the durable, compact
distillation of the playtest sources, so read them instead of raw forum exports:
`game-context.md` (what the game is + the Built-vs-Designed gap log),
`game-mechanics.md` (how the rules work), `technical-guide.md` (architecture /
build guide), and `roadmap.md` (the ordered backlog this feature should trace
to). Skim `game-context.md` now to situate the feature; the PM and architect
steps below read the rest.

### 1. Historical context (mandatory; no checkpoint)
Invoke the `historian` agent FIRST. The historian researches the era(s) the
feature touches (using WebSearch + WebFetch to ground claims in real sources)
and writes a binding research brief to `docs/research/<slug>-historical-context.md`.
The PM treats this as ground truth in the next step. Skim the historian's
summary; if it surfaces an anachronism or factual problem with the vision
itself, briefly flag it to me before invoking the PM (but don't stop — the
PM can address it in the spec). **No checkpoint** — the brief is committed
alongside the spec/brief/code artifacts.

### 2. Spec
Invoke the `product-manager` agent to turn the vision into `docs/specs/<slug>.md`.
Tell the PM to read the historian's research brief at
`docs/research/<slug>-historical-context.md` BEFORE drafting the spec, and to
treat its binding facts as constraints on the design. Also tell the PM to read
`docs/game/game-context.md` (esp. the Built-vs-Designed gap log) and
`docs/game/game-mechanics.md` so the spec fits the documented game design, the
known deltas, and the existing rules.
Then present the user story, acceptance criteria, and the riskiest assumptions.
**CHECKPOINT 1 — approve the spec.** Wait for my go (or revise and re-present).

### 3. Explore + brief
Invoke the `Explore` agent to map the affected code, then the `architect` agent to
write `docs/briefs/<slug>.md` (state/type changes, engine-vs-UI split, exact file
list, test plan, risks). Tell the architect to read
`docs/game/technical-guide.md` (the living architecture / build guide) alongside
the Explore map. Present the approach, the file list, and the top risk.
**CHECKPOINT 2 — approve the brief.** Wait for my go (or revise and re-present).

### 4. Build
Implement strictly per the approved brief. Follow CLAUDE.md (pure engine logic,
deterministic RNG, minimal comments, match existing patterns). Run `npm run build`
and fix all type/build errors before continuing.

### 5. Review
Invoke the `reviewer` agent to audit the diff against the spec's acceptance
criteria and run the build. Fix anything it flags, then re-review until the
verdict is CLEAN.

### 6. QA smoke (engine-only)
Invoke the `qa-tester` agent. It writes `scripts/playtest<Slug>.ts` per
`docs/conventions/playtest-script.md`, runs it via `npx tsx`, and produces
`docs/playtest/<slug>/engine-trace.json` plus a coverage report. The smoke
verifies helper contracts (with stubbed RNG), drives a 1772 (and/or 1856)
scenario through ~500 phases, and counts feature-specific event signatures.

The qa-tester **cannot** test UI rendering, balance, or anything gated behind
phases 2.4.2 / 2.4.3 (Vite `import.meta.env` skip). It reports those gaps
honestly. The benefit: the human playtest checklist at the next checkpoint
shrinks to exactly the items the smoke could not reach.

If the smoke reports a contract failure or engine exception, go back to
step 4 (build) — do not paper over. **No checkpoint** here; the artifacts
are committed alongside the build.

### 7. Pre-merge
Summarize what changed, then give me the **pruned** playtest checklist (the
qa-tester's coverage gaps, not the reviewer's full list) and the exact
playtest steps (`npm run dev`, which scenario, which screen, what to look
for). **CHECKPOINT 3 — pre-merge.** Wait for me.
Only commit/push or open a PR AFTER I explicitly approve. Never push or merge on
your own, and never use destructive git.
