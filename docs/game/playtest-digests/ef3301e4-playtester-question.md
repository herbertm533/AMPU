# Digest — `ef3301e4-playtester-question` ("Playtester Question — favorite part of the game to playtest and why?")

> **Type:** SENTIMENT / DESIGN-INTENT thread (NOT a playthrough). 1 chunk / 11 posts
> / ~9.6k chars (read in full). politicslounge topic 4538. Citations are
> `===== POST n =====` markers. Raw chunk is gitignored/disposable; **this digest is
> the durable record.** Part of **batch 54**. Nick **`playtesterfav`**.
>
> **Disposition:** Affirmation-heavy — players name their *favorite* systems, which
> doubles as a ranked signal of which loops the game must keep producing. Most of
> it **CONFIRMS shipped systems** (career-track, elections, faction-leader, legis,
> events, intraparty infighting). Two genuinely-new/under-built items: ★ the
> **faction-leader-is-the-only-major-presidential-candidate (aside from celebs)**
> rule (stated as a hard rule by a player; **NOT enforced in code**) and an ★
> **inter-party-cooperation-rewards WISH** (POST 9). Also re-corroborates several
> existing gaps (per-district House bias, contested PPT/Speaker, faction MEDIA card
> election bonus, recent-war election bonus). No net-new architecture beyond these.

---

## §1. Concrete mechanics asserted (confirmable rules) — build-verified

### ★ Career-track phase + multi-year LOCKS (POST 2) — the named favorite
Player's mental model: career-track choice = **legislative vs administrative vs
backroom vs private-sector**, each a multi-year LOCK with trade-offs.
- **Private sector** = a bonus but the pol is **locked away ~4+ years** ("at least
  four more years"); the gamble is pulling them out early for an open swing-state
  Governor's race vs. leaving them in for a bigger bonus (POST 2).
- **Backroom-politics track** can build a **kingmaker/protégé** East-Coast network
  but locks the pol away **"up to twenty years"** — risking *"waking up in a
  dramatically altered political landscape"* where the pol's state/region has faded
  (POST 2).
- Worked example: a pol equally good at legislative + administrative, from an
  agricultural state with a 20-yr-senior incumbent senator → legislative track to
  become the senator's "legitimate successor" vs. admin track for a cabinet shot
  (POST 2). New Englanders "already positioned" for legislative ⇒ send yours to
  backroom (POST 2).

**SHIPPED — CONFIRMED (with one caveat).** Career tracks are real: 7 tracks incl.
`Private` and `Backroom` (`src/types.ts:43-60`, `CAREER_TRACKS`). Lock/exit logic
in `runPhase_2_1_2_CareerTracks` (`src/engine/phaseRunners.ts:401-461`): a pol is
held on-track and **exits at `careerTrackYears >= CAREER_TRACK_MAX_YEARS` (= 20)**
(`src/types.ts:236`; tick at `phaseRunners.ts:427,459`). Backroom→kingmaker/protégé
graduation at `KINGMAKER_RULES.graduationYears` (= 20) (`src/types.ts:302`).
- **CAVEAT / minor delta:** there is **no per-track lock duration**. The "private
  sector ~4yr" figure is NOT a distinct constant — the only lock is the single
  20-yr max applied to every track; tracks roll skill/trait at 4-yr marks
  (`phaseRunners.ts:460`) but can only EXIT at year 20 (or via manual re-select,
  `setPlayerCareerTrack`, `phaseRunners.ts:495`, which RESETS the counter). So the
  "pull out after 4 years" gamble the player describes is **player-initiated
  re-selection**, not a 4-yr private-sector unlock. Confirm whether a shorter
  Private lock is intended (POST 2 implies ~4yr is the floor for Private).

### Elections — candidate selection + the "die-roll = turnout" + bonus stack (POST 3)
Player's model of picking a candidate: (a) voter preference in the state; (b) for
Congress, a **SEAT BIAS**; (c) **ideology fit** ("a Progressive flops in a
Traditionalist state"); (d) **a die roll = primary voter turnout / name
recognition** ("roll a 6 and… yes they did!"); with **bonuses from charisma /
Propagandist trait / a faction MEDIA card / recent war performance** (POST 3).

**SHIPPED — PARTIAL.** `calcStateVote` (`src/engine/phaseRunners.ts:3685-3713`)
composes the score from: `state.bias` (the lean), `partyPreference`, `enthusiasm`,
`pvCache*0.1`, `factionBias`, **trait bonuses**, and **`(Math.random()-0.5)*8`**
— the random term IS the "die-roll / turnout / name-recognition" the player
describes. Ideology fit is carried by `enthusiasm[ideology][party]` +
`electionFactionBias`. Charisma & Propagandist land via `TRAIT_ELECTION_EFFECTS`
(`src/types.ts:738-776`; Propagandist/Charismatic rows per context). **GAPS in the
stack:**
- **Faction MEDIA card bonus → NOT in `calcStateVote`.** No `Media`/media-card term
  in the election score (cards exist for *faction alignment*, `ALIGNMENT_RULES`, not
  as a per-candidate election bonus). Re-corroborates the cards-don't-feed-elections
  gap.
- **Recent-war-performance bonus → NOT in `calcStateVote`.** No war/battle-history
  term in the election score. War performance grants Command/traits earlier
  (`phaseRunners.ts:2247-2284`), which feed PV/eligibility indirectly — but there is
  no direct "fought well in a recent war" election bump.
- **Per-SEAT bias → NOT shipped.** House elections (`phaseRunners.ts:3913-3939`,
  `'house'` ctx) use **state-level `state.bias`**; `representativeIds` is a flat
  per-state list with no district-level lean. (See §2 House-district item.)
- Engine uses `Math.random()` here, not the seeded `src/rng.ts` — noted in passing
  (determinism note per CLAUDE.md), not a thread claim.

### ★ Faction-leader = only major presidential candidate, aside from celebs (POST 5)
Stated as a hard rule by the player: *"only your faction leader can be a major
candidate for President (aside from celebs)."* Drives the build-up dilemma:
elevate an already-strong pol to leader vs. invest long-term in a young blank
slate; build-up carries risk of gaining bad traits (POST 5).

**★ NOT SHIPPED (key delta).** The presidential primary
(`runPhase_2_9_1_Primaries`, `src/engine/phaseRunners.ts:3725-3749`) selects the
nominee from **any party member** with `age 35-80` and `command >= 2`, ranked by
`pvCache + command*5 + trait bonus`. There is **no `factionLeaderOf` gate and no
`Celebrity`-trait gate** on presidential candidacy. So the described rule —
faction-leader-only (plus celeb exception) — is **designed/forum-canon but NOT
enforced in the build**. Faction-leader machinery exists
(`factionLeaderOf`, `runPhase_2_2_3` leader election, `phaseRunners.ts:1969-2018`)
but is **not wired to gate the presidential field**. Attaches to the existing
faction-leader / presidential-eligibility gap rows.

### Contested PPT / Speaker election with minority concessions (POST 10)
Player describes a real-feeling mechanic: when in the **minority** and there is a
**contested PPT or Speaker election**, you trade **concessions** to install a more
favorable officer — then get backstabbed (POST 10: the Democrats traded for a
repeal-of-Reconstruction promise that the other side never intended to honor).

**NOT SHIPPED.** Speaker and President pro tempore are **auto-appointed** to the
**top-PV member of the majority party** (`runPhase_2_2_1`,
`src/engine/phaseRunners.ts:1866-1888`). There is **no contest, no minority
participation, and no concession mechanic**. The described horse-trade is a
forum/GM-adjudicated dynamic with no code analog. Re-corroborates the
congressional-officer-selection gap (officers are PV-deterministic, not elected).

### Census is automated + wants good summary screens (POST 4)
Player (a "stats nerd," hand-crunches census in forum play) notes it'll be
**automated** in the program but *"it better have some good summary screens every
time it happens."* — a **UI ask** (census summary screen), not a mechanic gap.

### Legis phase — near-infinite options (POST 4)
*"even by the mid-1800s there's no way you can possibly go through them all"* — a
favorite for the breadth of the legislation pool. Affirmation of the legislation
catalog as a depth engine; no delta.

### Events — generic + era-scripted, unpredictable (POST 6, 8)
Both **generic** events and **scripted** era-specific events; *"you never know what
might happen to mess up your best laid plans"* (win the Presidency, then a
panic + scandal hit) (POST 6). POST 8 affirms era + anytime events ("literally
anything can happen"). Affirmation of the events system; no delta.

---

## §2. Re-corroborated existing gaps (NOT net-new)

- **House per-DISTRICT bias (POST 3, 7).** POST 7: *"I spend an inordinate amount of
  time looking at district biases and trying to position the best candidates in each
  seat."* POST 3 names a per-"Congressional seat" bias. **Build has only state-level
  `state.bias`** (`calcStateVote` `'house'` path, `phaseRunners.ts:3913-3939`) — no
  per-seat/per-district lean. The "best candidate per seat by district bias"
  strategy the players love is **not at seat granularity** in the build. Attaches to
  the House-representation / district-bias gap.
- **Faction MEDIA card → election bonus (POST 3).** See §1 elections — absent from
  `calcStateVote`. Attaches to the cards-don't-feed-elections gap.
- **Recent-war-performance → election bonus (POST 3).** See §1 — no direct election
  term. Attaches to the war→election-influence gap.
- **Contested PPT/Speaker + concessions (POST 10).** See §1 — officers are
  auto/PV-deterministic. Attaches to the congressional-officer-selection gap.
- **Intraparty infighting / cross-faction-in-one-party tension (POST 6, 9, 10).**
  Dixiecrats + Progressives in one party (POST 6); non-aggression pacts that break
  down, primarying each other (POST 10). The faction/leadership/conversion systems
  exist (`LEADERSHIP_RULES`, `CONVERSION_ODDS`); the *negotiated pacts/backstabbing*
  layer is GM-adjudicated, not a coded mechanic — consistent with prior digests
  (no separate gap row needed; it is emergent + human-table).

---

## §3. ★ Net-new design ask

- **★ Inter-party cooperation REWARDS (POST 9).** Player WISH: *"I personally wish
  there was more to be gained with inter-party cooperation"* — e.g. a **con-Red
  faction + left-Dem faction** strike a deal: **remove Reconstruction in exchange
  for the Gold Standard** (POST 9). I.e. a structured cross-aisle bargain that
  *grants* something to both sides (a logrolling/quid-pro-quo legislative deal
  across parties). **NOT in the build** — legislation passes by vote tallies; there
  is no cross-party deal/exchange mechanic that rewards cooperation. Small new
  design ask; pairs with the contested-officer-concession dynamic (POST 10), which
  is the same logrolling family. **NOTE:** POST 10 also shows the *risk* side
  (concessions get reneged) — any reward mechanic should model defection.

---

## §4. Other content (no design value / affirmation only)

- POST 3, 7, 11: love of **alt-history divergence** (Polk two terms; Boss Tweed
  assassinated pre-nomination; the GOP never forming / staying Whigs; What-If states
  & special candidates; a 20-yr unknown governor; a one-term congressman becoming
  President 20 yrs after retiring). Affirms the emergent-narrative thesis already in
  the corpus (`4f90149c-best-playtest-moments`) — no delta.
- POST 11: **industry / lobby / state / region dominance paths** (1948 far-left
  labor Democrats benefiting in the industrial Midwest) — affirms the lobby/industry
  systems (`LOBBY_INDUSTRY`, `LOBBY_EXPERTISE`, `src/types.ts:373-432`); no delta.
- POST 6, 11: **GM perspective** — watching human players treat their CPU
  counterparts and choose party-vs-faction interest. Affirms multiplayer/CPU dynamic;
  no delta.
- POST 1: the prompt itself (vcczar, "for the next update email"). No content.

---

## §5. Open questions

- **Private-sector lock duration:** POST 2 implies a ~4-yr Private floor distinct
  from the 20-yr max. Build has only the single 20-yr `CAREER_TRACK_MAX_YEARS`. Is a
  shorter, per-track (esp. Private) lock intended, or is the 4-yr figure just the
  player's framing of the player-initiated early re-select?
- **Faction-leader presidential gate:** is the POST-5 rule ("only the faction leader
  + celebs can be a major presidential candidate") a real intended design rule to
  build into primary eligibility, or forum-table shorthand for "leaders have the PV
  to win"? It is asserted as a hard rule but is **unenforced in code** — needs a
  human ruling before it becomes a gap-log requirement.
