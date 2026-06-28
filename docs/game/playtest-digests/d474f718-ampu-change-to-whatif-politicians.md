# Digest: AMPU — Change to What-If Politicians (`d474f718`)

**Type:** DESIGN-ORIGIN thread for the **WHAT-IF (counterfactual) POLITICIAN
ENTRY system** (NOT a playtest; no historian). 1 chunk / 14 posts.
GM @vcczar (tier-1) + @MrPotatoTed / Ted (tier-1); contributors @OrangeP47,
@eveofanticreation. May 4 2022 (the core design) → Jun 10 2022 (community list).
**Core signal:** vcczar reworks how what-if pols enter play. The headline
mechanic is **scripted-event-GATED entry**: what-if pols are *draftable but you
don't know if they'll ever be PLAYABLE* — a scripted event resolves whether they
ever come into play. A second class is **condition-GATED** (a game-state
predicate — suffrage / expansion / citizenship — must hold before they can
appear at all). Plus a **"Frail" de-tagging ruling** and a ~24-name what-if data
list + radical community suggestions.
**Provenance only — no living-doc edits (consolidation agent owns the gap log).**
Citations: `POST n` = `===== POST n =====` markers.

---

## ★ 1. Scripted-event-GATED entry — the novel core (POST 1, 8; cross-ref #221)

> "I'm adding Scripted Events that allow for the possibility of What-if
> Politicians entering the game… you'll have a chance of seeing 'Joseph P Kennedy
> Jr Killed in Battle' a majority of the time. However, there's a chance of
> '…Returns from Battle to Enter Politics,' in which case he's playable.
> Currently, the mechanism would be that all What-if politicians would be
> draftable, you just don't know if you'll ever get to play them." (POST 1)

The mechanic, fully stated:
- **What-if pols are DRAFTABLE but conditionally PLAYABLE.** They sit in the
  draft pool like anyone; a **scripted event** later decides if they ever
  activate. The "killed" branch fires *a majority of the time*; the "survives →
  enters politics" branch is the minority.
- **Speculative drafting is the intended player behavior:** "players will likely
  draft them towards the end of a draft, even if their overall grade is high"
  (POST 1) — you spend a late pick on a gamble. **Napoleon** is the extreme case:
  *"the highest rated politician in all of AMPU, but the chance of ever getting
  him is very slim, and he'll be a few years from a likely death by the time you
  get him"* (POST 1) — high reward × very-low odds × near-death-on-arrival.
- **No "re-enter at correct age/stats in the next draft" hand-off.** Ted asked
  whether a drafted Joe Kennedy Jr put on the *legislative* (not military) track
  should still die in battle, and proposed: trigger the enter-event → he becomes
  available in the *following* draft at the right age/stats (POST 2). vcczar
  REJECTED this: *"Nah. It will just be assumed he was a state legislator that
  served in the war. There were a ton of politicians serving in the military in
  WWII. They'd take a break from politics to fight."* (POST 3) → the drafted
  what-if stays where drafted; the entry event resolves in place, no re-draft.
- **The kill branch requires an ACTIVE war.** Ted: "Does there need to be an
  actual war active for him to die in it?" vcczar: "Yeah" (POST 4, 6) → the
  "killed in battle" resolution is **gated on a war being in progress**, not a
  free-floating coin flip (so a battle-death what-if can't resolve in peacetime).
- **OPEN — DRAFT RULES UNSPECIFIED:** *"I need to make draft rules for this."*
  (POST 1). The speculative-draft handling (grading, pick cost, how the
  draftable-but-maybe-dead pol is presented) is explicitly undefined.

Engine reality (verified, do-not-re-derive): `ImportedDraftee` (`src/types.ts:1780`)
has **no `isWhatIf` / `playable` / `enterEvent` field** — what-if pols are
indistinguishable dataset rows today; `grep -ri 'whatif|playable|counterfactual'
src/` finds only the era-event spine/branch tree (`eraEvents1772.ts`), unrelated
to draft entry. Scripted events are **0% shipped** (no `ScriptedEvent` in `src/`;
the draft is `runPhase_2_1_1_Draft`). So this entire entry mechanism is unbuilt.

## ★ 2. Condition-GATED what-ifs — a predicate class (POST 1, 8; cross-ref #258/#260/#238)

A SECOND, distinct gate: some what-ifs need a **game-state condition** before
they can appear AT ALL (independent of the scripted-event coin flip):

| What-if pol | Required game-state condition | Predicate family |
|---|---|---|
| **Fidel Castro** | **Cuba taken** (expansion) | expansion (#260) |
| **Harriet Tubman** | votes for **BOTH blacks AND women** (suffrage) | suffrage (#238) |
| **Tecumseh** | **citizenship for Native Americans** | suffrage/citizenship (#238) |
| **Susan B Anthony** | **votes for women** (women's suffrage) | suffrage (#238) |
| **Napoleon** | **"rescued from St. Helena"** (his own category) | bespoke event |

(POST 1, repeated POST 8.) These are "Geographic, racial, or gender-related
politicians [that] require expansion or changes to suffrage to occur" (POST 1).
**Distinct from §1:** §1 is a *random* event (survive-or-die); §2 is a *predicate
precondition* (the world must reach a state). A pol can be both (condition unlocks
draftability; scripted event then gates playability).

Engine note: a serializable `Predicate` tree + pure `evalPredicate(snap,pred)`
ALREADY ship (`src/types.ts:~1487-1497`: `all/any/not`, `yearAtLeast/atMost`,
`eventCompleted`/`eventChose`, `meterAtLeast/atMost`, `interestAtLeast`) but are
wired ONLY to the era-event graph — exactly the #258 gap. There is **no
suffrage/expansion/citizenship predicate** and no draftability gate that consumes
one. So the "Castro needs Cuba / Tubman needs suffrage" gating is the #258
predicate interpreter applied to a NEW surface (draft-pool availability) plus NEW
predicate kinds (suffrage-by-demographic, territory-held).

## ★ 3. "Frail" de-tagging ruling (POST 5–7; design-origin of the #226 scoping)

Ted: "should we remove 'frail' from the what-if candidates, as the what-if
scenario is that they survived whatever canonically killed them at a young age?"
(POST 5). vcczar (POST 7):

> "Yeah, I'll have to do that for all politicians that died early from non-health
> reasons. It was just easier to tag all the people that die before the age of
> 60. Exceptions are people assumed to have had bad health but happened to have
> been killed anyway — Lincoln and JFK."

The ruling, precisely:
- vcczar admits he **wholesale-tagged "died before 60" ⇒ Frail** (the #226 rule).
- **Correction:** REMOVE Frail from what-if pols whose canonical early death was
  **NON-health** (battle / assassination) — the what-if premise is they survived,
  so seeding Frail (a death-rate multiplier) is wrong.
- **EXCEPTION:** keep Frail on pols **judged likely to die by 60 on health
  grounds anyway** — **Lincoln, JFK** (assassinated, but "historian-doctors"
  thought both likely to die by 60 regardless).

Engine reality (verified): Frail is a real, load-bearing death lever — a
mortality multiplier (`MORTALITY_RULES.frailDeathMult`, `phaseRunners.ts:2362-2364`)
and granted IN PLAY by battle wounds (`revolutionaryWar.ts:99-117`, with a Hale
resist roll). So a survived-what-if wrongly carrying Frail dies too often →
de-tagging matters. These are GENERATED dataset rows (`scripts/seedDataset.mjs`
→ `defaultDraftClasses.ts` / `standard-draft-classes.json`); do NOT hand-edit
the outputs (CLAUDE.md). **This thread (May 2022) is the chronologically-earlier
design-origin of the exact "natural-lifespan, NOT battle-death" scoping that
#226 already records from the later `kiaofficers` thread (POST 20-21).**

## 4. What-if data — the ~24-name list + community suggestions (POST 9, 12–14)

**vcczar's canonical what-if list (POST 9/12)** — *excludes* famous women (few
exceptions), Native Americans, blacks, and ahistorical-state leaders (those are
the §2 condition-gated set, listed separately):
JFK Jr · Tallulah Bankhead · Rosa Parks · Margaret Sanger · Lady Bird Johnson ·
Karl Marx · Marquis de Lafayette · Emperor Norton · Thomas Penn · Tadeusz
Kosciuszko · Joseph P Kennedy Jr · Winston Churchill · Nathan Hale · Quentin
Roosevelt · Tad Lincoln · Philip Hamilton · William Franklin · Boris Johnson ·
Willie Lincoln · Abraham Lincoln II · Benjamin Pierce II · William B Travis ·
Martin Luther King Jr · Malcolm X. (≈24 names.) Rationale (Ted POST 12 quote-add):
"Stuff like this only makes the game more replayable."

**Community RADICAL/unorthodox suggestions (@eveofanticreation, POST 13/14)** —
"assuming they're not already in here," tagged by ideology:
- *LW Populist:* Jim Jones, Vito Marcantonio, Frank Zeidler, Tom Kahn
- *Moderate Conservative:* Ted Bundy (Rockefeller staffer / '68 RNC delegate)
- *RW Populist:* Robert Rice Reynolds, Ellison "Cotton-Ed" Smith, John E. Rankin

vcczar (POST 14): "Three, possibly four of the people are in the game." All share
a **scandal-prone** profile (Jones/Bundy explicitly "incredibly prone to
scandal") — a flavor note for trait authoring, not a confirmed add.

**Ahistorical-state pols are SPARSE (POST 10–11).** OrangeP47 asked how fleshed
out they are; vcczar: "Just a token number… maybe 20 to 25 Canadians. Like 5 to
10 Brazilians. It's definitely not enough but the chance of getting these places
is so rare" → low-priority, **volunteer-fill later** (same disposition as the
`kiaofficers` and `ERA_FIGURES` content backlog). vcczar half-joked he'd make an
MLB mod where Castro is drafted by the Yankees (POST 8) — color, not scope.

Data routing: all of the above are GENERATED dataset rows. Per CLAUDE.md they go
into `scripts/seedDataset.mjs` (`ROWS`/`CURATED_ROWS` for marquee, `ERA_FIGURES`
additive-only, sub-floor electoral stats for never-served) → regenerate; NEVER
hand-edit `defaultDraftClasses.ts` / `standard-draft-classes.json` /
`politicians-dataset.csv`. The what-if pool is the alt-history extension of the
existing `ERA_FIGURES` mechanism (already noted on #24/#115).

---

## Candidate gaps for consolidation

**This thread is the MAY-2022 DESIGN-ORIGIN of the what-if-pol ENTRY system.**
The corpus already has the what-if *pool* folded into #24/#115 (the curated
draftable-pool toggle, `georgemartha`/`f735601c`#263) and the suffrage/gender
gate at #238. The genuinely NEW contribution here is **entry-via-scripted-event +
speculative drafting** and the **war-active kill gate** — neither is captured by
the existing "what-if pool" rows, which only make pols *draftable*, not
*conditionally-playable-via-event*.

1. **★ [CANDIDATE NEW — or sub-row under #221, consolidation's call] What-if
   ENTRY via scripted event + speculative draft.** What-if pols are draftable
   but PLAYABILITY is resolved by a later scripted event (kill-in-battle majority
   vs survives-to-enter minority); the kill branch is **gated on an active war**;
   the drafted pol resolves IN PLACE (no re-draft at correct age — vcczar
   rejected that, POST 3). Needs: a `whatIf`/`enterEvent` marker on the draftee
   row (none exists on `ImportedDraftee`, `types.ts:1780`); a scripted-event tier
   (0% shipped — **this is a NEW CONSUMER of #221's scripted-vs-flavor event
   taxonomy**); and a **draftability-without-playability** state the draft UI and
   `runPhase_2_1_1_Draft` must represent. The **entry-via-event + speculative
   pick is the novel part**; the pool/toggle side folds onto #24/#115/#263.
   (POST 1, 2-4, 6, 8). *Cross-ref #221 (scripted-event tier) + #24/#115 (pool).*

2. **★ [CORROBORATES + EXTENDS #258] Predicate-gated what-if availability.**
   Castro→Cuba-taken, Tubman→black+women suffrage, Tecumseh→Native citizenship,
   Anthony→women's suffrage, Napoleon→rescued-from-St-Helena. These are #258's
   predicate interpreter applied to a NEW surface (draft-pool availability) and
   require NEW predicate KINDS: **suffrage-by-demographic** and
   **territory/expansion-held**. (POST 1, 8). *Cross-ref #258 (predicate field;
   interpreter ships, wired only to era-events) + #260 (expansion/territory) +
   #238 (suffrage/gender eligibility). Napoleon's "rescued from St. Helena" =
   a bespoke event precondition (ties #221).*

3. **[CORROBORATES #226 — and is its EARLIER design-origin] Frail de-tagging on
   non-health early deaths.** Remove Frail from what-if pols who died young by
   battle/assassination (the survived premise); KEEP it on health-likely-by-60
   cases (Lincoln, JFK). This is the exact "natural-lifespan, NOT battle-death"
   scoping #226 already records from `kiaofficers` (POST 20-21) — **this thread
   (May 2022) predates it.** Frail is a real death multiplier
   (`phaseRunners.ts:2362`) + earned-in-play wound trait (`revolutionaryWar.ts`),
   so seeding it onto a survivor is a balance bug. Dataset rule for
   `scripts/seedDataset.mjs`. (POST 5-7). *Cross-ref #226 (Frail/Hale lifespan
   auto-trait) + the dataset pipeline.*

4. **[CONTENT — folds onto #24/#115, dataset-fill] What-if roster + ahistorical
   states.** The ~24-name list (POST 9/12) + community radical suggestions
   (POST 13/14, 3-4 already in game) + sparse ahistorical-state pols (~20-25
   Canadians, 5-10 Brazilians; volunteer-fill, POST 10-11). Route to
   `seedDataset.mjs` `ROWS`/`ERA_FIGURES` with sub-floor electoral stats; the
   what-if pool is the alt-history extension of `ERA_FIGURES`. *Cross-ref
   #24/#115 (curated pool, already folds the what-if toggle), #240 (CURATED_ROWS
   authoring), #263 (the setup-time "leave what-if candidates in" toggle).*

5. **[OPEN — feeds #115/#263] "I need to make draft rules for this."** (POST 1).
   The speculative-draft handling — how a draftable-but-maybe-never-playable pol
   is graded/presented, the pick-cost trade-off, late-round behavior — is
   UNSPECIFIED by vcczar. An open design question for the draft-procedure work
   (#115 boot/draft procedure; #263 settings umbrella).

**NEW:** item 1 (what-if entry-via-scripted-event + speculative draft — the one
genuinely novel mechanic; candidate new top-level gap OR sub-row under #221).
**Corroborates/extends:** #258 (+ new predicate kinds), #260, #238 (item 2);
#226 — and is its earlier design-origin (item 3); #24/#115/#240/#263 (item 4);
#221 (scripted-event tier, the entry vehicle); #115/#263 (open draft rules,
item 5).

## Open questions (for the human / consolidation)

- **Is the what-if entry-via-scripted-event a NEW top-level gap or a sub-row of
  #221?** The pool/toggle is already folded into #24/#115/#263; the *entry event
  + speculative-draft-without-known-playability* is not captured anywhere — that
  is the load-bearing novelty. Consolidation decides placement.
- **Draft rules for speculative picks** are undefined (POST 1). How is a
  maybe-dead high-grade pol scored/ranked, and does the CPU ever draft one?
- **Which of the radical suggestions are already in?** vcczar said "three,
  possibly four" (POST 14) — not enumerated; verify against `ROWS`.
- **Predicate vocabulary:** does #258 need first-class `suffrage(demographic)`
  and `territoryHeld(state)` predicates, or are these expressed via existing
  meter/event predicates? (Affects how Castro/Tubman/Tecumseh gates are authored.)
