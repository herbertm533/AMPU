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

### 1. Spec
Invoke the `product-manager` agent to turn the vision into `docs/specs/<slug>.md`.
Then present the user story, acceptance criteria, and the riskiest assumptions.
**CHECKPOINT 1 — approve the spec.** Wait for my go (or revise and re-present).

### 2. Explore + brief
Invoke the `Explore` agent to map the affected code, then the `architect` agent to
write `docs/briefs/<slug>.md` (state/type changes, engine-vs-UI split, exact file
list, test plan, risks). Present the approach, the file list, and the top risk.
**CHECKPOINT 2 — approve the brief.** Wait for my go (or revise and re-present).

### 3. Build
Implement strictly per the approved brief. Follow CLAUDE.md (pure engine logic,
deterministic RNG, minimal comments, match existing patterns). Run `npm run build`
and fix all type/build errors before continuing.

### 4. Review
Invoke the `reviewer` agent to audit the diff against the spec's acceptance
criteria and run the build. Fix anything it flags, then re-review until the
verdict is CLEAN.

### 5. Pre-merge
Summarize what changed, then give me exact playtest steps (`npm run dev`, which
scenario, which screen, what to look for) and what the reviewer says still needs a
human to verify. **CHECKPOINT 3 — pre-merge.** Wait for me.
Only commit/push or open a PR AFTER I explicitly approve. Never push or merge on
your own, and never use destructive git.
