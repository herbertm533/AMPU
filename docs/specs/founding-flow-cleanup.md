# Spec: Founding Flow Cleanup (1772 — Event-Gated CC Assembly)

> Foundation pass for the 1772 era. NOT a new mechanic — the goal is that the
> Continental Congress, its President, and its delegate roster are gated by
> the Intolerable Acts event (First CC) and then scheduled reassemblies every
> CC_TERM_YEARS thereafter, instead of silently materializing on turn 1, with
> proper OfficeType plumbing and a persistence model so delegates don't churn
> every turn. This is the clean ground the Constitutional Ratification feature
> next will assume.

## Vision (as given)
Foundation cleanup of the 1772 founding-era flow so the CC, its President, and
its delegates are gated by historical events rather than silently appearing on
turn 1. Drop the SpeakerOfHouse hack with a real `OfficeType.CCPresident`. Flip
the historically-backwards tiebreak (dominant faction picks, not the underdog).
Persist delegate terms across turns instead of churning every cycle. Wire the
"Convene the First Continental Congress" Intolerable Acts response to actually
assemble the body. Fold the Second Continental Congress into the
Lexington/Concord postEffect. Make existing mid-game saves continue to work.

## Player experience
On a fresh 1772 game the player sees no Continental Congress until they choose
"Convene the First Continental Congress" on the Intolerable Acts modal — that
click is the historical moment, not a passive turn-tick. From then on the same
delegate roster persists turn to turn (it's a body that sits, not a meeting that
re-forms every cycle); a re-appointment fires at Lexington/Concord (the Second
CC) and again at the Articles ratification (the Confederation Congress) so the
player feels the membership churn at the moments that mattered historically.

## User story
As a player running a faction in the 1772 scenario, I want the Continental
Congress to assemble in response to my Intolerable Acts decision rather than
already existing on turn 1, with a real CC President office and a stable
delegate roster between assemblies, so the founding turns feel like a sequence
of historical decisions and the body my faction is fighting to control has a
visible "called into being" moment instead of appearing by engine fiat.

## Verified engine facts (drive the design; architect must not re-derive)
- **`runPhase_2_10_End`** (phaseRunners.ts:2480–2491) ends every independence-era
  turn with an unconditional `appointDelegates(snap)` call inside
  `if (currentEra === 'independence')` — this is the silent-turn-1 source.
  Removing this call is the central engine change. The era guard means after
  Constitution ratifies (`applyConvention` flips era to `'federalism'` and sets
  `continentalCongress = null`, constitutionalConvention.ts:188–189) 2.10 is
  already inert for the CC; no cross-era safety added by this spec is needed —
  the existing guard suffices (verified).
- **`appointDelegates`** (continentalCongress.ts:13–90) **clears `cc.delegates`
  at line 19 every call** and immediately re-fills. Its post-Articles
  no-consecutive rule (line 33) compares against `previousServed`, a set built
  from the *current* delegate list at entry — so the no-consecutive logic only
  ever works if you call `appointDelegates` *twice in succession* against the
  same roster (term 1 → term 2). With persistence in place, `previousServed`
  must be computed BEFORE the clear, which it already is — the rule survives
  the persistence change unchanged. (This is the binding correctness check.)
- **`ensureCC`** (continentalCongress.ts:92–101) lazily creates an empty
  `ContinentalCongress` (`delegates: [], presidentId: null, committeeChairs:
  {…null}`) when accessed. `generateCCBills` (continentalCongress.ts:197) and
  `voteCC` (continentalCongress.ts:164) both early-return when the president
  is missing — so 2.6.1 / 2.6.3 in pre-Intolerable-Acts turns will safely no-op
  even if `ensureCC` materializes a shell during their lookup. **However**,
  `ensureCC` materializing a shell when the cleanup intent is "stay null" is a
  hazard the architect must avoid — see open question #8.
- **`electCCPresident`** (continentalCongress.ts:105–140) has the historically
  backwards tiebreak at lines 115–123 ("pick the tied faction with lowest total
  PV") AND the SpeakerOfHouse hack at line 138
  (`winner.currentOffice = { type: 'SpeakerOfHouse' }`). Compare 2.2.3
  `runPhase_2_2_3_FactionLeaders` (phaseRunners.ts:1670–1677): faction leader =
  top-PV member — the *dominant* pattern. The 2.2.1 federal pattern
  (phaseRunners.ts:1625–1634) similarly picks "top-PV House member of *majority*
  party". The new tiebreak must match these.
- **`OfficeType` union** (types.ts:325–346) is a string-literal union; adding
  `'CCPresident'` is a one-line addition. **`OFFICE_PRESTIGE` map** (pv.ts:7–29)
  is a `Record<string, number>`; adding the entry is also one line. **`officeWeights`**
  (pv.ts:31–61) has a switch on `office?.type` with a `default` arm that returns
  flat weights — adding `case 'CCPresident':` is recommended so PV weights the
  legislative skill (matching the Senator/Speaker bucket).
- **`vacateOffice`** (phaseRunners.ts:1768–1797) does NOT currently handle a CC
  Presidency in any special way (the SpeakerOfHouse hack incidentally clears
  `snap.game.speakerId` at line 1773, which is a hidden side effect the cleanup
  removes). With a real `CCPresident` type, `vacateOffice` must clear
  `snap.game.continentalCongress?.presidentId` — this is a NEW cleanup site
  introduced by the type.
- **`presidentId` is on the CC object** (`ContinentalCongress.presidentId`,
  types.ts:443) — there is NO top-level `game.ccPresidentId` field, and this
  spec adds none. The CC presidency clears via `cc.presidentId = null`.
- **Intolerable Acts event** (eraEvents1772.ts:47–58) has an inline-built event
  with `decider: 'auto'` and a single `'ok'` response labeled "Convene the
  First Continental Congress" whose effect is text + a `meters.domestic: -2`
  bump. `postEffects: []` today. This response is the assembly trigger.
- **Lexington/Concord** (eraEvents1772.ts:94–119) is `decider: 'cc-president'`
  with responses 'a' (Aid Massachusetts → start Rev War) and 'b' (decline).
  `postEffects: []` today; the Rev-War start is dispatched via
  `handleScripted1772Consequences` (phaseRunners.ts:1894–1899) keyed on
  `templateId === 'lexington_concord' && responseId === 'a'`. **No CC
  reassembly hook is added here** — Second CC and onwards reassemble on
  schedule (Checkpoint 1 decision; see open question #2).
- **`EraEvent.postEffects`** (types.ts:569) is currently typed as
  `{ type: 'startWar' | 'unlockGovernors' | 'unlockArticles' | 'startConvention'
  | 'endWar' | 'addPolitician'; payload?: unknown }[]`. **`postEffects` is
  declared but never read by the engine** (verified — grep returns only data-side
  references in eraEvents1772.ts; the engine's actual consequence-dispatch path
  is `handleScripted1772Consequences` keyed on `templateId`, phaseRunners.ts:1875).
  The architect has two implementation choices for the assembly trigger:
  (a) add the cases to `handleScripted1772Consequences` (the established
  pattern — recommended, smaller diff, no postEffects engine work); or
  (b) finally wire `postEffects` as a generic dispatch loop and use new types
  `'assembleCC'` / `'reassembleCC'`. **The spec mandates the *behavior*; the
  vision recommends postEffects but the established pattern in the codebase is
  templateId-keyed consequences — recommendation flipped to option (a) per
  audit, see open question #1.**
- **`articlesOfConfederation` flip** is verified at phaseRunners.ts:1906 —
  fires when the `articles_of_confederation` template's response 'a' (the only
  response) resolves. No bug; spec depends on it.
- **`governorsExist` flag** flips at the Declaration of Independence (verified
  via `event.unlocks?.includes('governors')` at phaseRunners.ts:1867–1872 AND
  via templateId case at phaseRunners.ts:1900–1903 — a redundant pair, but it
  flips reliably). After the Declaration, `appointDelegates` switches branches
  inside the function (line 27: `if (governorsExist && state.governorId)`).
  Reassembly logic must respect this.
- **`ContinentalCongressPage`** (pages/ContinentalCongressPage.tsx:8–14)
  ALREADY renders an empty-state message "No delegates appointed yet. The
  First Continental Congress will assemble after the Intolerable Acts." This
  exactly matches the cleanup intent — no page changes needed beyond
  letting cc be null/empty (verified). The page header (line 34) already
  switches "Continental Congress" vs "Confederation Congress" based on
  `articlesOfConfederation` — good.
- **`addLog`** (engine/log.ts:4) takes `(snap, phase, category, text, meta?)`.
  Categories include `'appointment'` and `'system'`. The existing assembly log
  inside `appointDelegates` (line 89) uses phase `'2.10'`, category
  `'appointment'`. The first-time log will use phase `'2.4.3'` (the era-event
  phase that triggered it), category `'appointment'`.

## Mechanics (decided values)

### 1. The new office: `OfficeType.CCPresident` (binding — drops the hack)
- Add `'CCPresident'` to the `OfficeType` union (types.ts:325–346).
- Add `CCPresident: 25` to `OFFICE_PRESTIGE` (pv.ts:7–29). **Magnitude
  rationale:** 25 sits +20 above Senator (5), +13 above SpeakerOfHouse (12),
  −5 below President (30) — accurately reflects that the CC President is the
  chief presiding officer of the pre-constitutional federal government (more
  consequential than a state Senator or even a sitting Speaker) but not yet a
  national executive. Vision said +25, audit confirms.
- Add a `case 'CCPresident':` arm to `officeWeights` (pv.ts:31–61) returning
  the same legislative-leaning bucket as Senator/SpeakerOfHouse:
  `{ admin: 0.5, legislative: 2.5, judicial: 0.5, military: 0, governing: 0.5,
  backroom: 1 }`. Falling into `default` (flat weights) would silently
  understate the legislative weighting of an actual presiding-officer role.
- Add a `vacateOffice` arm: `if (t === 'CCPresident')
  snap.game.continentalCongress.presidentId = null` (with the null check on
  `continentalCongress`). This is a NEW vacate-site introduced by the type.
- `electCCPresident` line 138 changes from `winner.currentOffice = { type:
  'SpeakerOfHouse' }` to `{ type: 'CCPresident' }`. The hidden side effect of
  the hack (clearing `game.speakerId` via the SpeakerOfHouse branch in
  `vacateOffice`) is also removed — no behavioral loss because the CC
  President was never simultaneously the actual federal Speaker.

### 2. Assembly gating — the Intolerable Acts as the trigger (binding)
- **Remove** the unconditional `appointDelegates(snap)` call from
  `runPhase_2_10_End` (phaseRunners.ts:2487–2489). The `if (currentEra ===
  'independence')` block becomes empty and can be deleted entirely, or kept as
  a single-line comment placeholder. Until an assembly event fires,
  `snap.game.continentalCongress` stays `null`.
- **Wire the Intolerable Acts response** to call `appointDelegates(snap)` via
  the established pattern: add a `case 'intolerable_acts':` to
  `handleScripted1772Consequences` (phaseRunners.ts:1875–1949) that calls
  `appointDelegates(snap)` (which itself calls `ensureCC` to lazily create the
  CC object first), then `electCCPresident(snap)` to seat a President, then
  `appointCCCommittees(snap)`. Calling order matches what 2.2.1/2.2.2 would
  have done on the next turn anyway — but doing it here means the body is
  fully constituted the moment the player clicks the response (no awkward
  one-phase delay where the modal closes and a President doesn't exist until
  the next 2.2.1 tick).
- A `'2.4.3'` `'appointment'` log entry fires from inside the new case BEFORE
  `appointDelegates` (so the log order reads "First Continental Congress
  convenes…" then "delegates appointed: N …"): `addLog(snap, '2.4.3',
  'appointment', \`First Continental Congress convenes in Philadelphia.
  Delegates from \${snap.states.length} colonies.\`)`. **This is the
  "first-time-only" log distinct from `appointDelegates`'s own per-call line**
  — the architect SHOULD also dampen the per-call line on the first assembly
  to avoid log noise (suggested: skip the `appointDelegates` line entirely
  when the CC was null on entry; both the first-assembly and reassembly cases
  below get their own bespoke log line).

### 3. Delegate term persistence (binding — the no-churn fix)
- Add a field to `ContinentalCongress`:
  `delegateTermStartYear?: number` (optional for save-compat).
  Set by `appointDelegates` at the end of its body: `cc.delegateTermStartYear
  = snap.game.year`. **No new `delegateTermLength` field** — the term length
  is derived from `articlesOfConfederation` (see below).
- **Term length is 4 years pre-Articles, 2 turns (= 4 years — same) post-Articles.**
  Each game turn is 2 years; one term spans two turns. (Vision suggested
  "4 years pre-Articles, 2 turns post-Articles" — the audit notes both are
  the same calendar duration, so a single constant `CC_TERM_YEARS = 4` is the
  cleanest expression. Recommendation in open question #3.)
- **2.10 in the independence era no longer appoints unconditionally.** Instead
  a new tiny check at the top of 2.10 (still inside the era guard): if
  `cc !== null` AND `cc.delegateTermStartYear !== undefined` AND
  `(snap.game.year - cc.delegateTermStartYear) >= CC_TERM_YEARS`, call
  `appointDelegates(snap)` (which respects the existing no-consecutive Articles
  rule). Add a `'2.10'` `'appointment'` log: "Continental Congress delegates
  re-seated for a new term." Post-Articles the no-consecutive rule auto-applies
  via the existing `previousServed` set computed at the head of
  `appointDelegates` (line 17, before the clear — verified safe).
- Result: between assembly events, the SAME delegates persist across turns;
  every 4 years (every 2 turns) they re-seat (which IS a re-appointment with
  whatever current rules apply — including the no-consecutive Articles rule
  once that flag is set). This matches historical Continental Congress practice
  (delegates were appointed by states for terms, not turn-by-turn).
- The PRESIDENT does NOT auto-rotate every term. The President holds office
  until they vacate (death/retire/defect/CC dissolves) OR a triggered
  re-election (#5 below). This is the cleanest model and respects the
  one-and-done historical practice of figures like Hancock and Laurens
  presiding for extended terms.

### 4. Re-assembly triggers — Scheduled + Confederation Congress (binding)
- **Second CC and all subsequent reassemblies are SCHEDULED, not event-gated**
  (Checkpoint 1 decision). Section 3's term-based reassembly is the ONLY
  mechanism after the First CC is called by Intolerable Acts. The Second CC
  fires at `firstAssemblyYear + CC_TERM_YEARS = 1774 + 4 = 1778` (modulo turn
  alignment — fires on the first 2.10 where the term has elapsed). No special
  Lexington/Concord case is added to the consequences switch; that event
  resolves via its existing text/meters/Rev-War-start path only.
- **Articles of Confederation** (eraEvents1772.ts:220–235): when the existing
  `case 'articles_of_confederation':` flips `articlesOfConfederation = true`
  (phaseRunners.ts:1905–1908), ALSO call `electCCPresident(snap)` after the
  flag flip — the Confederation Congress historically elected its own first
  president (Samuel Huntington in real history, but this is roll-driven so it
  picks the dominant-faction delegate). The existing CC President's
  `currentOffice` is cleared (via `vacateOffice` on them) before the new
  election so the seat is open. Log entry: `addLog(snap, '2.4.3',
  'appointment', 'The Confederation Congress elects its first President.')`.
  Delegate roster is unchanged here (no `appointDelegates` call) — same body,
  new name, new president.

### 5. Dominant-faction tiebreak (binding — fixes the historically backwards rule)
- `electCCPresident` lines 115–123: **flip** `sums.sort((a, b) => a.sum -
  b.sum)` to `sums.sort((a, b) => b.sum - a.sum)`, picking the highest-total-PV
  tied faction. Same comparator pattern as 2.2.3 faction leader selection
  (phaseRunners.ts:1674: `members.sort((a, b) => b.pvCache - a.pvCache)`)
  and the federal 2.2.1 Speaker/Pro Tem picks (phaseRunners.ts:1631, 1637).
- The comment at line 116 ("an underdog tiebreak") is removed.

### 6. The first-time assembly log (binding — distinct from reassembly logs)
- Three distinct event-triggered log lines (all in `2.4.3` `'appointment'`):
  1. First CC: `"First Continental Congress convenes in Philadelphia.
     Delegates from {N} colonies."` (fired from the Intolerable Acts case;
     N = the state count at the time of the call.)
  2. Second CC: `"Second Continental Congress convenes in Philadelphia."`
     (fired from the Lexington/Concord case.)
  3. Confederation: `"The Confederation Congress elects its first President."`
     (fired from the Articles case, AFTER `articlesOfConfederation` is flipped
     so the page header switches with the entry.)
- One re-seat log line in `2.10` `'appointment'`:
  `"Continental Congress delegates re-seated for a new term."` (post-Articles,
  the header swaps to "Confederation Congress" but the log message can stay
  generic — `articlesOfConfederation` is the toggle, not a separate log
  category.)
- The existing `appointDelegates` line 89 log ("Continental Congress delegates
  appointed: N delegates from M states.") is **kept** but the architect SHOULD
  consider suppressing it on first assembly when the bespoke "convenes" log
  was already emitted, to avoid double-logging. Recommendation: emit the
  bespoke log first, then `appointDelegates` emits its line — both appear in
  the feed, the first as flavor and the second as factual. (Two-line entries
  for big historical moments are fine.)

### 7. Save migration (binding)
- All new fields optional (`delegateTermStartYear` is `?:`); no repair() needed.
- **Defensive load check** in `GameContext` after snapshot load (the spot where
  `loadSnapshot` returns): if `game.scenarioId === '1772'` AND `game.currentEra
  === 'independence'` AND `game.continentalCongress === null` AND
  `game.eraEventsCompleted.includes('intolerable_acts')`, autonomously call
  `appointDelegates(snap)` then `electCCPresident(snap)` then
  `appointCCCommittees(snap)` and write a synthetic system log: "Continental
  Congress restored from save state." This handles mid-game saves that were
  taken with the old unconditional-appoint behavior AND saves where the player
  had clicked "Convene" but loads in a corrupted state.
- For saves where `continentalCongress` already has delegates: do nothing —
  the existing roster is kept. If `delegateTermStartYear` is missing, treat as
  `game.year` (clock starts now; no surprise re-seat on first turn after load).
- For 1856 saves: zero impact (no CC in that era).

### 8. President fate on CC dissolution (binding — Constitution ratifies)
- `applyConvention` (constitutionalConvention.ts:186–197) sets
  `game.continentalCongress = null` at line 189 when the Constitution ratifies.
  Before that null-out, the architect MUST:
  1. Find the current CC President (if any): `const cc = snap.game.continentalCongress;
     const pres = cc?.presidentId ? snap.politicians.find((p) => p.id ===
     cc.presidentId) : null;`
  2. If found: clear `pres.currentOffice = null;`. **No retire, no death.**
     The ex-CC-President becomes a free agent eligible for federal office in
     the new republic.
  3. Then `game.continentalCongress = null` (line 189, unchanged).
- This is a one-time site inside `applyConvention`; doesn't touch `vacateOffice`
  (because dissolving the body is different from vacating one seat).

## State shape changes
- `OfficeType` union (types.ts:325–346) gains `'CCPresident'`.
- `ContinentalCongress` interface (types.ts:441–450) gains
  `delegateTermStartYear?: number;`.
- New constant `CC_TERM_YEARS = 4` (placed near other 1772 era constants in
  types.ts; if no obvious cluster exists, near `CCDelegate` interface).
- `OFFICE_PRESTIGE` (pv.ts:7–29) gains `CCPresident: 25`.
- `officeWeights` (pv.ts:31–61) gains a `case 'CCPresident':` arm with the
  legislative-leaning bucket (same shape as Senator/SpeakerOfHouse).
- `vacateOffice` (phaseRunners.ts:1768–1797) gains
  `if (t === 'CCPresident' && snap.game.continentalCongress) snap.game.continentalCongress.presidentId = null;`
- `handleScripted1772Consequences` (phaseRunners.ts:1875–1949) gains ONE
  case (`'articles_of_confederation'` — President re-election on Articles
  flip). The Intolerable Acts assembly is wired via the new
  `applyPostEffects` dispatcher (Checkpoint 1 decision — postEffects path).
  The Lexington/Concord case is UNTOUCHED — Second CC reassembly is
  scheduled, not event-driven (Checkpoint 1 decision). The
  `'articles_of_confederation'` case extends the existing logic: flip
  `articlesOfConfederation = true` (unchanged), THEN vacate the old CC
  President's office and re-run `electCCPresident` (new — models the
  Confederation Congress electing its first president).
- `electCCPresident` (continentalCongress.ts:105–140): tiebreak comparator
  flipped; SpeakerOfHouse hack replaced with `'CCPresident'`.
- `appointDelegates` (continentalCongress.ts:13–90): set
  `cc.delegateTermStartYear = snap.game.year` at end of function (after the
  log line).
- `runPhase_2_10_End` (phaseRunners.ts:2480–2491): the unconditional
  `appointDelegates(snap)` call is replaced by a term-check that calls it only
  when `cc.delegateTermStartYear` is set and the term has elapsed.
- `applyConvention` (constitutionalConvention.ts:186–197): clear the CC
  President's `currentOffice` before the `continentalCongress = null` line.
- GameContext load path: defensive autonomous re-assembly when the
  Intolerable Acts template is in `eraEventsCompleted` but CC is null.

## Acceptance criteria

### Empty initial state (binding behavioral change #1)
- [ ] 1. On a fresh 1772 game at turn 1 (year 1772), the
  `ContinentalCongressPage` renders the empty-state message ("No delegates
  appointed yet. The First Continental Congress will assemble after the
  Intolerable Acts.") — already present at page line 12 — and
  `snap.game.continentalCongress` is `null` AFTER the entire turn-1 sequence
  runs (including 2.10).
- [ ] 2. Phase 2.2.1 in the independence era short-circuits cleanly when
  `continentalCongress` is null or its `delegates` array is empty:
  `electCCPresident`'s existing `if (cc.delegates.length === 0) return;`
  guard at continentalCongress.ts:107 is the relied-upon mechanism (verified).
  Phase 2.2.2 (`appointCCCommittees`) similarly relies on the president lookup
  returning falsy (continentalCongress.ts:145–146). 2.6.1 (`generateCCBills`)
  and 2.6.3 (`voteCC`) also early-return on a missing president.
  **Architect MUST NOT add new early-return checks elsewhere** — verify that
  these existing checks remain effective when `cc` is null (the calls go
  through `ensureCC`, which materializes an empty shell; the inner
  `delegates.length === 0` / missing-president guards still trip). If
  `ensureCC` materializing a shell is observable on the page (it could be — a
  null check on page line 8 would no longer trigger), the architect MUST
  refactor `ensureCC` or these phase entry points so that the CC stays
  literally `null` until the Intolerable Acts assemble it. **Recommendation:**
  guard the runner entry points (`if (snap.game.continentalCongress === null)
  return;` at the top of `runPhase_2_2_1_CongressLeadership`'s independence-era
  branch, the parallel 2.2.2, and the 2.6.1/2.6.3 independence branches) so
  the lazy `ensureCC` is never called speculatively. (See open question #8.)

### Assembly on the Intolerable Acts response (binding behavioral change #2)
- [ ] 3. Clicking "Convene the First Continental Congress" on the Intolerable
  Acts era-event modal causes (in this order, atomically, before the modal
  closes): (a) `appointDelegates` runs and fills the roster from the colonies;
  (b) `electCCPresident` runs and seats the President with `currentOffice.type
  === 'CCPresident'`; (c) `appointCCCommittees` runs and fills the four chair
  slots; (d) `delegateTermStartYear = snap.game.year`; (e) a `2.4.3`
  `'appointment'` log entry reads "First Continental Congress convenes in
  Philadelphia. Delegates from {N} colonies." with N = `snap.states.length` at
  call time. After the modal closes, the `ContinentalCongressPage` shows the
  full roster, the President card with a real PV, and the four chairs.

### OfficeType.CCPresident (binding behavioral change #3)
- [ ] 4. `'CCPresident'` is in the `OfficeType` union. `OFFICE_PRESTIGE` has
  `CCPresident: 25`. `officeWeights` has a `case 'CCPresident'` arm returning
  the legislative-leaning weights bucket. The seated CC President's PV
  recompute returns a value reflecting +25 prestige and the legislative
  weighting (verified by `refreshPv` covering the politician).
- [ ] 5. `electCCPresident` line 138 sets `winner.currentOffice = { type:
  'CCPresident' }`. The SpeakerOfHouse hack is gone. `snap.game.speakerId` is
  NEVER touched by the CC election (no hidden side effect).
- [ ] 6. `vacateOffice` has an `if (t === 'CCPresident')` arm that clears
  `snap.game.continentalCongress.presidentId` (with the null check on
  `continentalCongress`). Tested: if the CC President dies at 2.4.1, the
  next render shows the President seat as "Vacant" on
  `ContinentalCongressPage`.

### Dominant-faction tiebreak (binding behavioral change #4)
- [ ] 7. `electCCPresident` lines 115–123: the tied-faction sort is `b.sum -
  a.sum` (dominant-PV faction wins the tiebreak), matching the 2.2.3 / 2.2.1
  patterns. The misleading comment ("an underdog tiebreak") is removed.
  Tested: in a two-faction tie at first-CC seating, the higher-total-PV
  faction's top delegate is the President.

### Delegate persistence (binding behavioral change #5)
- [ ] 8. `ContinentalCongress` has `delegateTermStartYear?: number`.
  `appointDelegates` sets it to `snap.game.year` at end of function.
- [ ] 9. After the First CC convenes (year 1774 say), advancing one full turn
  (to year 1776, but BEFORE Lexington/Concord) does NOT clear or refill
  `cc.delegates` — the same roster persists. `runPhase_2_10_End`'s old
  unconditional `appointDelegates(snap)` is removed.
- [ ] 10. When `(snap.game.year - cc.delegateTermStartYear) >= CC_TERM_YEARS`
  (= 4), 2.10 calls `appointDelegates(snap)` once, updating
  `delegateTermStartYear` to the current year. A `2.10` `'appointment'` log
  reads "Continental Congress delegates re-seated for a new term." Tested: a
  delegate seated in 1774 is re-seated (possibly with different politicians,
  per the existing factional logic) in 1778.
- [ ] 11. The no-consecutive Articles rule (continentalCongress.ts:33)
  continues to work: when `articlesOfConfederation === true`, term-rollover
  reseats EXCLUDE politicians from the immediately-prior roster (the
  `previousServed` set is built BEFORE the line-19 clear; this is verified
  but architect must NOT move the `previousServed` line). Tested: after the
  Articles flip, a delegate seated in term N is NOT in the term-N+1 roster.

### Scheduled reassemblies and Confederation Congress (binding behavioral change #6)
- [ ] 12. After the First CC is called by Intolerable Acts, the CC reassembles
  automatically at `delegateTermStartYear + CC_TERM_YEARS` via the section-3
  term-based path in `runPhase_2_10_End`. No special Lexington/Concord case
  exists in `handleScripted1772Consequences`; the Lex/Concord event resolves
  via its existing text/meters/Rev-War-start path only (no roster refresh
  hook). The "Second CC" is whatever the scheduled reassembly that fires
  after 1774 — typically year 1778, modulo turn alignment.
- [ ] 13. Each scheduled reassembly writes a `2.4.3` `'appointment'` log with
  ordinal naming: "Second Continental Congress convenes in Philadelphia",
  then "Third Continental Congress convenes…", etc. A small counter on the
  CC object (`assemblyOrdinal: number` starting at 1 for the First CC and
  incrementing each reassembly) drives the label. The CC President carries
  over across scheduled reassemblies if still a delegate after the refresh;
  if not, `electCCPresident` re-runs defensively: `if (cc.presidentId &&
  !cc.delegates.find((d) => d.politicianId === cc.presidentId))
  { electCCPresident(snap); }`. Same defensive pattern, just at the
  scheduled-reassembly site instead of Lex/Concord.
- [ ] 14. When the `articles_of_confederation` event's response 'a' resolves
  (existing case at phaseRunners.ts:1905–1908): in this order: vacate the
  current CC President's `currentOffice` (sets `cc.presidentId = null` via
  the new `vacateOffice` arm); call `electCCPresident(snap)`; emit a `2.4.3`
  `'appointment'` log: "The Confederation Congress elects its first
  President." Delegate roster is unchanged. The page header switches to
  "Confederation Congress" (existing line-34 conditional already handles
  this).

### Save migration (binding behavioral change #7)
- [ ] 15. A mid-game 1772 save taken AFTER the Intolerable Acts response was
  clicked under the OLD code (CC is fully populated) loads under the new
  code unchanged — roster, president, committee chairs all intact. If
  `delegateTermStartYear` is undefined in the save, the GameContext load
  path sets it to `snap.game.year` (no surprise re-seat on the first
  post-load turn).
- [ ] 16. A mid-game 1772 save where `eraEventsCompleted.includes
  ('intolerable_acts')` but `continentalCongress === null` (defensive case —
  shouldn't happen but might from a corrupted save) autonomously re-assembles
  on load: `appointDelegates`, `electCCPresident`, `appointCCCommittees`
  fire, and a system log "Continental Congress restored from save state."
  is written.
- [ ] 17. A mid-game 1772 save BEFORE the Intolerable Acts (CC is null,
  `eraEventsCompleted` does NOT include `'intolerable_acts'`) loads with
  CC still null — the player will assemble it via the event when it fires.

### Cross-system safety (binding)
- [ ] 18. `applyConvention` (constitutionalConvention.ts:186–197): when the
  Constitution ratifies, the current CC President (if any) has
  `currentOffice = null` set BEFORE `game.continentalCongress = null` is set.
  No retire, no death. Tested: after ratification, the ex-CC-President is
  eligible for federal office in the federalism era (no `currentOffice` block).
- [ ] 19. 1856 scenario is unaffected: smoke-test that an 1856 turn 1 → turn 2
  sequence produces the same logs and state shape as before this feature.
  (The era guards in 2.10, 2.2.1, 2.2.2, 2.6.1, 2.6.3 already gate all CC
  code behind `currentEra === 'independence'`.)

### Definition of done (per CLAUDE.md)
- [ ] 20. `npm run build` passes.
- [ ] 21. Playtested in 1772: turn 1 reaches 2.4.3 with `continentalCongress
  === null` (verified via `ContinentalCongressPage` empty-state); the
  Intolerable Acts modal fires (after the prerequisite chain Gaspee →
  Committees → Tea Act → Boston Tea Party → Intolerable Acts); clicking
  "Convene" populates the CC fully (delegates, President with `CCPresident`
  type, committee chairs); advancing turns 1774 → 1776 → 1778 shows the
  roster persists, then re-seats in 1778; Lexington/Concord (when it fires)
  refreshes the roster with the "Second Continental Congress convenes" log
  regardless of response; the Articles ratification re-elects the President
  with the "Confederation Congress elects its first President" log and the
  page header swaps. Constitutional Convention ratification clears the CC
  President's office without retiring them.

## Edge cases
- **Player advances past turn 1 with no CC, before Intolerable Acts has
  fired**: CC stays null; 2.2.1 / 2.2.2 / 2.6.1 / 2.6.3 in independence
  branches short-circuit cleanly (existing guards + the recommended
  null-check on `continentalCongress` at the runner head). No crashes, no
  empty-shell artifacts. 2.4.2 anytime events are first-turn-skipped
  (phases.ts:114) but on subsequent pre-Intolerable-Acts turns may fire —
  they don't touch CC.
- **Intolerable Acts response click happens mid-2.4.3, but Lexington/Concord
  is the NEXT event** (template chain) — that's fine, they fire on different
  turns (gateYears 1774 vs 1775). The reassembly on Lexington/Concord
  re-shuffles the roster as the Second CC.
- **CC President dies between turns (2.4.1)**: `vacateOffice` clears
  `cc.presidentId` via the new arm. Next 2.2.1 (independence branch) calls
  `electCCPresident` again on the existing delegate roster — verified the
  function's `cc.delegates.length === 0` guard would NOT trip because
  delegates persist. The current 2.2.1 unconditionally calls
  `electCCPresident` if independence era (phaseRunners.ts:1613–1616), so
  vacancy is auto-filled. **Architect verify**: this is the desired behavior
  (vacancy = next-turn auto-election from sitting delegates).
- **CC President defects to another faction (2.1.6)**: their faction changes
  but they remain a delegate (delegates are politicians, not faction-locked
  seats) AND remain President (cc.presidentId is by id). This is fine — the
  re-election only fires at scripted moments (Articles flip) or vacancy.
  Faction-strength tally on the page will show the new faction with one more
  delegate, the old one with one fewer.
- **Lexington/Concord's reassembly removes the President from the roster**
  (their state's largest faction shifted): defensive re-election kicks in
  per criterion #13 above.
- **Player reloads mid-CC**: the load-path defensive check (#15–#17) keeps
  the roster intact. `delegateTermStartYear` backfill = `game.year` means
  the first post-load turn won't trigger a surprise re-seat (the term clock
  effectively resets, which is the least-surprising legacy behavior).
- **Constitution ratifies WHILE there is no CC President** (someone died
  same turn, before ratification was processed): the `pres` lookup in
  `applyConvention` returns null; the clear-office step is a no-op; the
  `continentalCongress = null` line proceeds normally. No crash.
- **`appointDelegates` when `state.governorId` exists but the governor is
  retired/dead**: the existing code (continentalCongress.ts:30) does
  `snap.politicians.find((p) => p.id === state.governorId)` and uses it for
  preference weighting; a not-found governor just means no preference bonus.
  The governor-branch path runs as long as `governorsExist` is true and
  `state.governorId` is set. Term-rollover post-Articles correctly uses the
  governor-branch. No change.
- **Manipulative governor takes their own delegate seat** (existing
  continentalCongress.ts:44–49): vacates `state.governorId = null`. This is
  preserved; persistence doesn't change the appointment logic, only its
  frequency. The 35% chance fires only on `appointDelegates` calls — so the
  Manipulative-grab can only happen at term-rollover or scripted reassembly,
  not every turn. Net effect: more selective use of the trait. Acceptable.

## Out of scope
- **No new CC powers, bills, or committee mechanics** (binding) beyond
  removing the SpeakerOfHouse hack. `voteCC`, `appointCCCommittees`,
  `generateCCBills` internals are unchanged.
- **No new era events** (binding). The three trigger events (Intolerable
  Acts, Lexington/Concord, Articles ratification) all exist in
  `SCRIPTED_1772` today and have their responses set up — the cleanup wires
  consequences to them, doesn't author new events.
- **No new pages** (binding). `ContinentalCongressPage` already handles the
  empty-state and the populated state and the header swap.
- **No reform of the Constitutional Convention assembly model** (binding —
  that's the next feature, Ratification). This spec only ensures the
  existing `applyConvention` plays nicely with the new CCPresident type.
- **No Speaker / Pro Tem changes** beyond removing the OfficeType hack from
  CC President. `game.speakerId` and `game.proTemId` are untouched by this
  spec.
- **No 1856 changes** — verified by smoke (criterion #19); the era guards
  cleanly partition.
- **No `phases.ts` changes** (verified — the first-turn skip list at lines
  111–119 already handles 2.2.1/2.2.2 first-turn, and that skip remains
  correct; subsequent turns' 2.2.1/2.2.2 are gated by the new
  null-CC short-circuits, not by phase skipping).
- **No `postEffects` engine machinery** (architect choice, per the audit
  rationale in open question #1): consequences are wired via the existing
  `handleScripted1772Consequences` template-id switch, not via a new generic
  `postEffects` dispatch loop. The `postEffects` field on `EraEvent` stays
  declared-but-unused for now (an existing harmless dead-code situation).
  If the architect prefers to finally wire it, they may — the behavior is
  identical and the open question flags the choice.
- **No removal of `SpeakerOfHouse` from the `OfficeType` union** — it's a
  real federal-era office; only the CC's misuse of it is removed.
- **No changes to `cardVoteBias`, the existing voting math, or
  `articlesOfConfederation`-gated thresholds in `voteCC`** (those are
  correct).

## Open questions / assumptions
Riskiest first:

1. **`postEffects` is the wiring path (Checkpoint 1 decision — overrides the
   spec's prior recommendation).** The architect lights up the
   declared-but-unused `EraEvent.postEffects` field as a generic engine-side
   dispatcher (a small switch on `postEffect.type` invoked from the era-event
   resolution path). Only ONE postEffect type is needed in v1:
   `{ type: 'assembleCC' }` wired to the Intolerable Acts "Convene" response.
   The Articles re-election (binding behavioral change #6) stays in the
   templateId switch (the templateId-switch path already handles the
   `articles_of_confederation` case and the re-election is a one-liner that
   fits there). The architect picks the postEffect dispatcher's exact
   signature; recommended shape: a tiny `applyPostEffects(snap, event,
   response)` helper called from the same site that resolves text/meters/
   interestGroups today, sourcing the postEffects array from the chosen
   response (NOT the event's top-level postEffects, which the audit found is
   unread and stays unused in v1). **This is the binding implementation
   path.**

2. **Second CC (and all future CCs) are SCHEDULED, not event-gated
   (Checkpoint 1 decision — overrides the spec's prior recommendation).**
   The First CC still triggers off the Intolerable Acts "Convene" response —
   that single event-driven assembly is the calling-into-being moment.
   After that, the CC reassembles automatically on the schedule (every
   `CC_TERM_YEARS = 4` years; see section 3) — no special
   Lexington/Concord hook, no `reassembleCC` postEffect. The Lex/Concord
   event resolves through its existing text/meters/Rev-War-trigger path
   only. Historically the Second CC convened in May 1775 about 7 months
   after the First — but for game-flow simplicity, the schedule-based
   reassembly cleanly models "the CC keeps reassembling at its term
   intervals" without a per-event trigger. **This is the binding
   behavior.**

3. **Delegate term length = 4 years (pre AND post Articles).** Vision said
   "2-turn term (4 years pre-Articles, 2 turns post-Articles)" — a turn is
   2 years, so 4 years and 2 turns are identical durations. The audit
   collapses both to a single constant `CC_TERM_YEARS = 4`. The post-
   Articles **no-consecutive** rule (continentalCongress.ts:33) is the
   meaningful post-Articles difference, not the term length. If the
   designer wants post-Articles to be SHORTER (e.g., 2 years = re-seat
   every turn, matching the Confederation Congress's annual practice), use
   `cc.delegateTermStartYear` + a derived `termLen = articlesOfConfederation
   ? 2 : 4` — the architect can wire this either way for one extra const.
   **Recommendation: 4 years both eras** (cleanest, matches vision).

4. **New `OfficeType.CCPresident` prestige magnitude = 25.** Vision
   suggested +25 PV; audit confirms it sits cleanly between Senator (5)
   and President (30), above Speaker (12) and Chief Justice (18) —
   reflects the presiding role of the body. If playtest finds the CC
   President's PV swamps everyone else mid-1770s, drop to 15–20.

5. **Confederation Congress = label-only with a one-time re-election.**
   Vision said "label-only (Articles rules already in code)" — audit
   confirms the no-consecutive rule already lives in `appointDelegates`
   line 33. The re-election on Articles flip is added (vision suggested
   "yes — a small re-election trigger") because the Confederation
   Congress's first president was historically a new figure. **Net:
   label-only for delegate appointment rules, but a re-election for the
   presidency.** Recommended.

6. **CC-empty page message: keep as-is.** Vision said yes; audit found
   `ContinentalCongressPage` already at line 12 renders "No delegates
   appointed yet. The First Continental Congress will assemble after the
   Intolerable Acts." — exactly the cleanup intent. No page change.
   Recommended.

7. **President fate on CC dissolution = clear `currentOffice`, no
   retire.** Vision said the same; audit confirms the ex-President should
   be a free agent eligible for federal office in the new republic.
   Recommended. Documented in criterion #18.

8. **`ensureCC` materializing an empty shell hazard.** `ensureCC`
   (continentalCongress.ts:92–101) lazily creates a `ContinentalCongress`
   object when accessed even if logically it should stay null. The
   existing call sites that rely on the inner guards
   (`if (cc.delegates.length === 0) return;`) still work, BUT if
   `electCCPresident` is called BEFORE delegates are appointed (e.g., 2.2.1
   in independence era on a turn where Intolerable Acts hasn't fired), the
   shell would be created and `continentalCongress` would no longer be
   literally null — which would break the page's `!cc || cc.delegates.length
   === 0` empty-state check (page would render the populated layout with
   "Vacant" President and 0 delegates). **Mitigation, binding:** the
   architect must add `if (snap.game.continentalCongress === null)
   return;` (or equivalent — without going through `ensureCC`) at the head
   of the independence-era branches in `runPhase_2_2_1`, `runPhase_2_2_2`,
   `runPhase_2_6_1`, `runPhase_2_6_3` before any `electCCPresident` /
   `appointCCCommittees` / `generateCCBills` / `voteCC` call that would
   trigger `ensureCC`. The page's existing `cc.delegates.length === 0`
   fallback (line 8) is a safety net but the architect should prefer
   "literally null" as the source of truth.

9. **No `postEffects` audit fixup beyond what we use.** The existing
   `postEffects: []` empty arrays on the Intolerable Acts and
   Lexington/Concord events stay empty (we route via the template switch).
   This is consistent with the codebase's current
   "postEffects-declared-but-unread" state; this spec doesn't fix that
   broader inconsistency.

10. **Manipulative-governor self-appointment frequency drops.** With
    persistence, `appointDelegates` runs ~6× over a 12-year independence
    arc instead of every turn — so the 35% Manipulative-grab fires
    correspondingly less often. Net effect: the trait stays meaningful but
    isn't constantly proc'ing. Accepted as a thematic improvement (a
    governor shouldn't be re-grabbing the same delegate seat every two
    years).
