# Digest — 4e518e05 "AMPU Historical Relocation"

**Scope:** DESIGN-ORIGIN thread (politicslounge, 16–17 Jun 2021), 10 posts / 1
chunk (`chunk-001.md`, 5.4 KB). Topic: **vcczar is adding HISTORICAL RELOCATION
DATES to politicians** — the data + the modes by which a politician moves from
their birth/start state to an **alternate state** during the game. This is the
**design origin of the historical-relocation-date DATA layer and the
auto/manual/random relocation MODES**; the shipped turn loop already has a
**Relocate sub-phase (2.1.4)** + an alt-state concept + a relocation-cap rule
(overpopulated>40 → underpopulated<20). Mostly light banter (what-if pols:
Boris Johnson / Eamon de Valera as NYC-born) — the **mechanic** is the signal.
**DIGEST ONLY** — no living-doc edits.

Participants (authority): @vcczar (tier-1, designer — owns the feature),
@MrPotatoTed (Ted, tier-1; not vocal here), @ConservativeElector2 (contributor —
raised the conflict rule + random-alt-state Q), @Cenzonico (contributor —
proposed the realism setting), @Patine (contributor — de Valera/NYC trivia).
Cites `POST n` = `===== POST n =====`.

---

## ★ The mechanic — historical relocation dates + alternate states

**What's being added (POST 1, vcczar):** historical relocation dates per
politician, so that:
- **Politicians start in their PROPER state at each start date** (1772, 1856,
  …) — not just their birth state. (POST 1)
- A politician with an **alternate state** can **relocate** to it. (POST 1, 3)

**Why relocation is strategically important (POST 1, vcczar — the design
rationale; capture verbatim-in-spirit):**
1. **New-state head-start** — as the nation grows and new states are admitted,
   a faction wants to be FIRST there. Drafting **mediocre pols who carry an
   alt-state** can be a sound strategy "in the first 100 years of the game."
2. **Post-Civil-War Reconstruction** — many Northerners can **relocate South to
   Reconstruct**; in many cases these are **the only "Red Party" politicians in
   the South.** (Direct tie to the Carpetbagger mechanic — see #38.)
3. **Escape crowded / ideologically-monogenous states** — pols move from a
   packed or single-ideology state to one where they actually have **a shot at
   elected office.**

## ★ The MODE question — all options + the DEFAULT (POST 1–6)

The whole thread is essentially **how relocation is triggered.** Four modes
surfaced:

- **(a) AUTO-move at historical move dates** (POST 1, vcczar): "an option to have
  politicians automatically move at their historical move dates." **= a NEW
  mode** vs the shipped manual relocate phase. **Option, not default.**
- **(b) MANUAL — player relocates them when they wish, provided the pol has an
  alternate state** (POST 1, vcczar) = **★ THE DEFAULT.** (This is the mode the
  shipped 2.1.4 Relocate phase most resembles.)
- **(c) RANDOM alt-state via a GENERAL EVENT** (POST 3, vcczar, deciding):
  ConservativeElector2 asked (POST 2) if vcczar still considers "giving a small
  number of politicians a random alternate state option each turn"; vcczar
  (POST 3): **"I might just make random alternate state coming from a general
  event."** Cenzonico (POST 5) endorses — pols can have a **LOW CHANCE to start
  in the alt-state** ("so many small factors could have changed where people
  moved/lived"). → a **general-event-driven random-alt-state grant** (small #
  of pols / low chance per turn or at draft). Cross-ref the settings umbrella
  (#263) for this as a toggle, and #247/#260 (it shifts WHERE pols are).
- **(d) ANY politician may relocate** ("Risk-like") (POST 1, vcczar): considered,
  but **feared too unrealistic** ("as unrealistic as the game of Risk. Might be
  fun though"). ConservativeElector2 (POST 2) shares the unrealism fear.
  **Resolution (POST 6, Cenzonico):** gate it behind a **REALISM SETTING** the
  player ticks **on = realism takes precedence / off = wacky & zany scenarios.**
  → a binary realism toggle. **This is the same toggle later canonicalized as
  #263's "(2) allow politicians to move to ANY state"** — *this thread predates
  `f735601c` (Aug 2021) and is its EARLIER origin.*

## ★ The AUTO-RELOCATION CONFLICT rule (POST 2–4) — capture this exception

**The problem (POST 2, ConservativeElector2):** under auto-move mode, what if a
pol **holds an in-game office they did NOT hold IRL at that time?** Auto-moving
them would yank a sitting officeholder. Two candidate resolutions:
- **Cancel the auto-relocation** (ConservativeElector2's lean, POST 2: "I'd say
  automatic relocation is cancelled then").
- **OR the pol resigns the seat** (vcczar, POST 3: "That, or they resign their
  seat. I'm not sure which way it will go. **Maybe cancelling will make more
  sense.**").

**Leaning: CANCEL** (both vcczar POST 3 and the worked example agree). vcczar's
concrete example (POST 4): **"If Romney had been Senator of MA, I don't see him
moving to UT"** — i.e. an in-game office the pol didn't hold IRL **suppresses**
the historical auto-move. → **Auto-mode needs an officeholder-conflict guard:
if the pol holds a game office not held IRL at that date, the scheduled
historical move is CANCELLED.** (NEW exception, not in the shipped relocate
phase.)

## What-if pols / banter (low signal — extract, don't over-weight)

- **Boris Johnson** (POST 6, Cenzonico): "small chance for his parents to stay in
  NYC" → NYC-born Boris as a wacky-mode what-if. vcczar (POST 8/9) flags him as
  a **"what if politician"** (i.e. already in/tagged for the what-if pool —
  cross-ref #24/#115 the what-if candidate pool).
- **Eamon de Valera** (POST 7/10, Patine): was actually **born and raised in
  NYC** — floated as a "raging Irish man of New York City" what-if; vcczar
  (POST 10) didn't know it. No mechanic; just an alt-state/what-if anecdote.

These corroborate that **alternate-state / what-if assignment is a live design
axis** (a pol's start-state is mutable data), but contribute no new rule.

---

## Shipped-vs-designed (spot-read of the build — flag for tech-lead)

The shipped turn loop **already has the Relocate primitive** this thread is
adding DATA + MODES for (engine facts confirmed, not re-derived):

- **Relocate sub-phase ships as 2.1.4** (in `PHASE_SEQUENCE` / `phaseRunners.ts`)
  and politicians carry an **alternate-state concept**; a **relocation cap rule**
  exists (overpopulated>40 → underpopulated<20, per gap #38; the shipped
  `RELOCATION_ATTEMPTS_PER_TURN = 5`, types.ts:247). So the **MANUAL default mode
  (b) is broadly present.**
- **NOT shipped / unbuilt vs this design:**
  - **(a) AUTO-move at historical move dates** — no historical-move-date DATA on
    pols, no auto-move scheduler.
  - **The historical-relocation-date DATA layer itself** (the thing vcczar is
    "halfway done adding") — start-date-accurate proper-state placement at each
    scenario start + scheduled move dates.
  - **(c) random-alt-state-via-general-event** — no such event; cross-ref the
    event registry (#221) and the random-alt-state-at-draft idea.
  - **(d) realism SETTING** gating "any pol may relocate" — no settings framework
    exists at all (#263 is 0% built).
  - **The auto-move officeholder-CONFLICT guard** (cancel/resign) — N/A today
    because auto-mode itself isn't built.

**Net for tech-lead:** the build has the **Relocate phase + alt-state + cap**;
this thread is the **DESIGN ORIGIN of (i) the historical-move-date DATA, (ii)
the auto-move MODE + its officeholder-conflict guard, and (iii) the
random-alt-state-via-event MODE** — none of which ship. The Risk-like
"any-pol-relocate" + realism on/off is **already captured as a #263 toggle**
(this thread predates and seeds it). Relocation **moves WHERE pols are**, so it
couples to #247/#260 (state lean / population) but is a distinct lever.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

- **ENRICHES #38** (alt-state relocation + cap + auto-Carpetbagger) — **this
  thread is the DESIGN ORIGIN (Jun 2021) of the historical-relocation-date system
  that #38's alt-state mechanic implements.** Adds three facts not in #38's row:
  **(1) historical-relocation-date DATA** (pols start in proper state per start
  date; carry scheduled move dates) — POST 1; **(2) the AUTO-move-at-historical-
  dates MODE** + the **manual-default MODE** distinction — POST 1; **(3) the
  AUTO-RELOCATION OFFICEHOLDER-CONFLICT rule** — if a pol holds a game office not
  held IRL at that date, the scheduled auto-move is **CANCELLED** (leaning) or the
  pol resigns the seat — POST 2/3/4 ("Romney/MA→UT" example). Also reconfirms the
  **Reconstruction/Carpetbagger** strategic driver (Northerners relocate South,
  often the only Red-Party Southerners) — POST 1, the in-fiction rationale behind
  #38's Carpetbagger trait. (Source: this digest, POST 1/2/3/4.)

- **ENRICHES / PRE-DATES #263** (settings/options umbrella) — **this thread (Jun
  2021) is the EARLIER design origin of two toggles `f735601c` (Aug 2021) later
  canonicalized:** **(d) "any politician may relocate" (Risk-like)** = #263's
  "(2) allow politicians to move to ANY state" — POST 1; and the **REALISM
  SETTING** (on = realism precedence / off = wacky-zany) — POST 6, Cenzonico —
  which is the **general on/off realism framing** #263 expresses as vcczar's
  "≥50% realistic" floor / "unrealistic mode." Adds a THIRD togglable mode not in
  #263's floated list: **(c) random-alt-state via a general event** (small # of
  pols get a random alt-state each turn / low chance to START there) — POST 3/5 —
  which pairs with #263's "(1) randomize politician start dates" but is a distinct
  per-turn/at-draft random-alt-state grant. (Source: this digest, POST 1/3/5/6.)

- **CROSS-REF #247 / #260** (event-driven state LEAN / event→POPULATION shift) —
  relocation (esp. random-alt-state-via-event + new-state head-start +
  Reconstruction migration) **mutates WHERE politicians are located**, shifting a
  state's politician composition / effective lean — same population-geography
  family as #247 (lean) and #260 (population/spatial spread), but the lever here
  is **pol relocation**, not bias scalars or event-driven demographic magnitude.
  Flag as a coupling, not a merge. (Source: this digest, POST 1/3/5.)

- **CROSS-REF #24/#115** (curated what-if candidate pool) — Boris Johnson tagged a
  **"what if politician"** (POST 8/9) and de Valera floated as an NYC-born what-if
  (POST 7/10) corroborate that **alt-state / what-if start-state is mutable pol
  data** — minor reinforcement, no new requirement. (Source: this digest, POST
  6/7/8/9/10.)

**Consolidation call to make:** whether the **historical-move-date DATA + auto-
move MODE + officeholder-conflict guard + random-alt-state-via-event** warrant a
**NEW gap** (the "relocation MODES + historical-date data" layer, distinct from
#38's cap/Carpetbagger rule) **or fold onto #38** (as the design origin of its
alt-state mechanic). This digest leans **fold the DATA + manual/auto modes onto
#38** and **fold the any-pol-relocate + realism + random-event toggles onto #263**
— consolidation decides. (Recorded here so no gap number is pre-assigned.)

## Open questions (for the human / consolidation)

- **Auto-conflict: cancel vs resign?** Thread leans **cancel** (POST 3) but
  vcczar explicitly left it open ("I'm not sure which way it will go"). Needs a
  ruling before auto-mode ships.
- **Random-alt-state timing:** per TURN (small # of pols each turn, POST 3) vs at
  DRAFT (low chance to START in the alt-state, POST 5) — the two posts describe
  slightly different timings; pick one (or both).
- **Is the historical-move-date DATA itself in a later build/thread?** vcczar was
  "halfway done" in Jun 2021 — look for follow-up confirming whether the data
  landed and which modes shipped (the shipped 2.1.4 phase suggests only manual).
- **Does any-pol-relocate (realism OFF) ignore the cap?** Not specified; relates
  to #38's contested cap value (shipped 5 / hd 4 / rep1800 unlimited).
