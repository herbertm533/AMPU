# Digest — "I'm improving the Politician Generator"

- **Slug:** `5e8dc484-im-improving-the-politician-generator`
- **Title / topic:** "I'm improving the Politician Generator," topic year **1900**
- **Author:** @vcczar (designer), with a reply from @MrPotatoTed (POST 2)
- **Posts:** 6 (single chunk, ~3.4k chars) — a **design-discussion** thread, not a playthrough
- **Scope:** the **PROCEDURAL politician generator** — the *random fallback pool*
  used when no historical draft class exists for a draft year. This is **distinct
  from** the curated/historical draft dataset (`unitedstates`/MEDSL → standard
  draft classes). See "Shipped vs. designed" below.
- **Era framing:** the generator is era-agnostic in spirit but the worked
  examples are modern (50-state, Blue/Red, AL/AK/AR/CA/CO/CT). For region
  framing see `docs/game/historical-context.md`; no historian ran this batch.

---

## What the thread reveals (the generator-revamp design)

### 1. Regional + party-specific generation (POST 1)
vcczar is doing "a big revamp of the politician generator":
- **Given names AND surnames become regionally specific** (no longer drawn from
  one uniform national pool).
- **Ideologies, interests, "and etc." are generated regionally AND
  party-specifically** — i.e. a Blue Deep-South generated pol and a Red
  Mountain-West generated pol should not have identically-distributed ideology
  rolls. Generation becomes **weighted by region × party**, not uniform random.

### 2. ★ The generated-draft SHAPE — "Noah's Ark" (POST 1)
The headline structural rule. Each generated draft contains:
> **4 politicians for each state, 2 per party, each a male or female — "Noah's Ark."**

So the procedural fallback pool has a **fixed per-state / per-party / per-gender
lattice**: per state = {Blue Male, Blue Female, Red Male, Red Female}. The
worked table in POST 1 is literally this 4-row block per state (AL, AK, AR, CA,
CO, then CT cut off mid-block — the last two CT rows have State/Party/Gender but
blank names, i.e. the sheet rows exist but names not yet filled).

### 3. Gender model + future NB/trans (POST 1)
- Generated pols currently carry a **Gender = Male | Female** column.
- Non-binary / trans are presently **lumped under an "LGBT" flag** (no distinct
  representation).
- Designer **wants real non-binary / trans generated politicians**, plus
  **NB/trans name pools**, because "we will certainly have more of them in the
  future." Explicitly deferred: "might not happen until after early release …
  could get it done during the summer when I have more time." → **roadmap item,
  post-early-release.**

### 4. Region-specific name pools — Deep South worked (POST 4)
Method for a region's pool: **start from the original database, then ADD** more of:
- the **25 most common surnames** (region-weighted),
- region-appropriate **male & female given names**, and for the Deep South
  specifically **black, Cuban-American, and creole given names + surnames**.
- **Outliers still allowed** — generation is *weighted*, not hard-restricted.
  vcczar's own example (POST 4): of Charles Levin / Adda Beveridge / Rufus
  Connor / Abby Slappy, "aside from the name Abby, none … are the most common
  for the Deep South." So the lattice fills mostly-typical names but tolerates
  atypical draws.
- **★ Race is NOT yet linked to names** (POST 4): "I'm not sure how I'm going to
  link names to race. That might be something I won't be able to figure out how
  to code in google sheets." → an **open design problem**, not a shipped feature.

### 5. Provenance / data-cleanliness quirk (POST 2-3)
- The original random-name database was **seeded from a contributor's
  (MrPotatoTed's) high-school yearbook** — first names and last names entered to
  populate the file (POST 2). Useful provenance: the procedural name corpus has
  no historical-authenticity guarantee; it's crowd/yearbook-sourced.
- Bug surfaced & owned: classmate **"Justin Tomazich"** was stored as a
  **surname-only** (visible in POST 1's CT block: First="William",
  Last="Justin Tomazich"). MrPotatoTed: "I apparently put in [him] as just a
  last name instead of splitting … into the two separate files. Whoops!"
  vcczar: "I'll fix it." (POST 3). A **data-cleanliness fix**, not a mechanic.
- POST 5 is a throwaway joke ("Adda Beveridge" / "Add a beverage") — no signal.

### 6. ★ Dependency on future draft rules (POST 6)
> "Just be sure to tell me when you've finalized the new future draft rules so I
> can re-calc the math for **alt-state drafts**."

The generator's **per-state draft math is downstream of the (not-yet-final)
draft-count / draft rules** and the **alt-states** work. Cross-ref the
alt-states EV / draft-count threads. Generator porting/finalization is
**blocked** until those rules land.

---

## ★ Shipped vs. designed (verified against the codebase)

**Where the procedural generator lives in the build:** `runPhase_2_1_1_Draft`
(`src/engine/phaseRunners.ts`). Source precedence for a draft year (code
comment, lines 143-146):
1. player's per-game imported dataset (Settings) →
2. bundled **standard draft classes** (the historical dataset) →
3. **random rookie generation** (the procedural fallback — lines **177-238**).

The shipped procedural fallback is a **flat, uniform stub** — it implements
almost none of the designed generator:

| Designed (this thread) | Shipped today (`phaseRunners.ts`) |
|---|---|
| Names **regionally specific**, weighted pools per region | **15 hardcoded national first-names + 15 last-names**, `pick()` uniform (lines 181-182: "John/James/William…", "Hughes/Carter/Beecher…"). No region input at all. |
| Ideology generated **region × party-specific** | **Uniform random**: `pick(ideologies)` over all 7 (line 186). Party is `null` at generation (line 205) — pols are unaffiliated until drafted, so per-party generation is impossible in the current model. |
| **Interests** generated regionally/party-specifically | Generated pols get `interests: []` (line 217) — empty. |
| Pool = **4 per state, 2 per party, M/F ("Noah's Ark")** | Pool size = `factions.length * 2` (≈20 total), each pol's `state = pick(stateIds)` **random** (line 203). **No per-state quota, no party split, no gender split.** |
| **Gender** field (Male/Female; future NB/trans + LGBT flag) | **No `gender` field exists** on `Politician` (`types.ts:1251`) or `ImportedDraftee` (`types.ts:1780`). No LGBT/NB/trans/race fields anywhere. |
| Region-aware (Deep South black/Cuban/creole pools) | `State` HAS a `region` enum (`types.ts:1322`: Northeast/Midwest/South/West/Border/Canada/Caribbean/Latin America/Pacific/Atlantic) used by **relocation & Secession Winter** — but the **generator never reads it**. |
| Weighted draws with outliers | Pure uniform `pick()` — no weighting machinery. |

Additional shipped notes:
- The generator block uses **`Math.random` directly** (lines 188-198, 203, 210,
  etc.), violating CLAUDE.md's "keep engine code deterministic / don't use
  `Math.random`" rule. The seeded RNG (`src/rng.ts`, incl. `pickWeighted`) is
  **not** wired into this legacy path. Any generator revamp should also move it
  onto seeded RNG.
- Skills are rolled 0-1 with one boosted stat to 2-3 (lines 187-197); a 30%
  chance of one positive trait (line 210). No expertise, no command, no
  region/party/gender conditioning — confirming this is a placeholder.
- The designed generator is an **author-time Google Sheets tool** (POST 4
  explicitly: "code in google sheets"), producing a names/ideology corpus. Its
  **port status into the TS engine is unknown / not done** — the shipped
  fallback predates this revamp. **Needs confirming with the user** whether the
  Sheets output is meant to feed a build-time dataset (like the historical
  pipeline) or a runtime generator.

**★ Distinction restated:** this thread is about the PROCEDURAL generator (the
random fallback, source #3 above), **NOT** the curated historical draft dataset
(`scripts/legislatorsToDataset.mjs` → `standard-draft-classes.json`, source #2).
The historical pipeline already covers ~18.5k real figures with real
names/birthdays; the procedural generator only matters for draft years with **no
historical class** (e.g. future/late-game years, or alt-states with no roster) —
which is exactly why POST 6 ties it to alt-state draft math.

---

## Open questions (for the human)
1. **Port target:** is the revamped generator meant to (a) emit a build-time
   dataset like the historical pipeline, or (b) run at runtime in the engine
   (replacing the lines-177-238 fallback)? The thread shows only the Sheets tool.
2. **Party-at-generation:** the design wants per-party ideology generation, but
   shipped generated pols are `partyId: null` until drafted. Does the new model
   pre-assign party (Blue/Red) at generation, breaking the current
   "unaffiliated rookie" convention?
3. **Gender as a stored field:** does Male/Female (and later NB/trans + an LGBT
   flag) become a real `Politician`/`ImportedDraftee` field, and does it carry
   any *mechanical* weight or is it purely flavor/name-pool selection?
4. **Race↔name** (POST 4): unresolved by the designer himself — likely won't be
   coded in Sheets. Is race a target entity field at all, or only an implicit
   name-pool weighting?
5. **Alt-state draft math** (POST 6): blocked on the "future draft rules."
   What is the final per-state draft count, and how do alt-states draw?

---

## Deltas vs. current build
- **Headline:** designed = a **region × party × gender-structured procedural
  generator** with **weighted regional name/ethnicity pools** (Deep South adds
  black/Cuban-American/creole names + top-25 surnames, outliers allowed) and a
  **future NB/trans model**. Shipped = a **flat uniform 20-rookie stub** (15
  hardcoded national first/last names, uniform-random ideology, random state, no
  party/gender/region/interests). Mostly an **author-time Google-Sheets tool**
  whose **port status into the engine is unverified** and likely not done.
- **Generated-draft shape:** add the **"Noah's Ark" lattice** — 4 pols/state,
  2 per party, 1 Male + 1 Female per party. (Today: 20 total, random states, no
  quotas.)
- **Gender field:** introduce `gender` (Male/Female) on the politician model;
  today **no gender field exists**. Future: distinct NB/trans + dedicated name
  pools (currently lumped under an "LGBT" flag that the build doesn't model).
- **Regional name pools:** per-region weighted first/last-name corpora; Deep
  South adds black/Cuban-American/creole names + 25 most-common surnames, with
  outliers allowed. Today: one 15+15 national uniform pool.
- **Region × party ideology/interest generation:** generated ideology &
  interests must be conditioned on (region, party). Today: ideology uniform
  random, interests empty, party null at generation.
- **Wire generator onto seeded RNG** (`src/rng.ts`): the fallback uses
  `Math.random` directly — a determinism violation to fix during the revamp.
- **Data cleanliness:** name corpus is yearbook-sourced; "Justin Tomazich"
  surname-only bug (fix owned, POST 3). Relevant only if Sheets corpus is ported.
- **Blocked-by:** alt-state draft math (POST 6) depends on finalized future
  **draft rules** + **alt-states** EV/draft-count work — sequence those first.

---

`wc -l` of this digest: see file. (Self-count omitted — generated at write time.)
