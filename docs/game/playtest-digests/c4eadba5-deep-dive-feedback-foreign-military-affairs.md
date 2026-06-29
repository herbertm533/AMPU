# Digest — "Deep Dive Feedback 2.7 — Foreign/Military Affairs" (`c4eadba5`)

**Type:** WAR / COMBAT-SYSTEM DESIGN thread (politicslounge topic 1533, Sep 2022).
**NOT a playthrough** — a designer/tester feedback round on the **battle-casualty system**,
part of the **"2.x Deep Dive" feature series** (2.3 done/locked; 2.8 = exec actions + SCOTUS
noms in progress; **2.7 = foreign/military, this thread**; @vcczar's **Sep-19 deadline**).
Participants: **MrPotatoTed** (Ted, implementer), **@vcczar** (tier-1 designer), **Vols21**
(tester, casualty-chart author). **9 posts / 1 chunk** (chunk-001, all covered). Source CSV ~7.2 KB.

> **DIGEST-ONLY** — touches no living doc (no `game-context.md` edit). All proposals here are an
> in-flight **design discussion**, NOT designer-ratified final. Cross-links last batch's
> `067233f3-ampu-guns` **#300** (firearms-research military-tech → combat modifier) and the
> existing war-engine gaps (#45/#56/DH-81, Hale-Frail death-schedule #85).

---

## ★ HEADLINE FINDING (lead with this): the shipped casualty system already exists — it's just TUNED TOO SOFT

Unlike the Guns #300 (which is **0% shipped**), the battle-casualty system this thread debates is
**SUBSTANTIALLY BUILT TODAY** in `src/engine/revolutionaryWar.ts` → `applyCasualties()`
(lines **67–123**), called per ground battle (line **231**) from the rev-war battle loop
(`runRevWarBattles`, invoked at `phaseRunners.ts:3595`). **This is a BALANCE-TUNING finding on a
LIVE system, not a greenfield build.** Ted (POST 8): *"there were existing rules for killing off
military career-track folks... but the chances are so small, I think it only happened once in two
wars that lasted a combined 14 years in the 1840 test. To me, that's not very risky."* Vols21/Ted
agree the target is **the midpoint between TOO MANY and TOO FEW** losses (POST 4).

---

## What the thread proposes (DESIGN)

**1. "ALL HANDS ON DECK" mobilization (POST 2, vcczar).** For a war, pull into a "military" action
phase **ALL politicians with ≥1 MIL ability who are NOT already career-tracked or employed**, PLUS
all **Military-track** politicians. (Intent: a faction-wide wartime draft of its statesmen, not just
appointed generals.)

**2. Per-battle outcome table, difficulty-scaled (POST 2):** each battle, *regardless of win/loss*,
yields a fixed-ish casualty band (dice-rolled within it):

| Difficulty | wounded-or-die | get random +1 MIL | get random military trait |
|---|---|---|---|
| EASY | 1–2 | 1–2 | 1–2 |
| MEDIUM | 2–3 | 2–3 | 2–3 |
| DIFFICULT | 3–4 | 3–4 | 3–4 |

**3. WOUNDED state (POST 2):** a wounded pol **loses 1 MIL**, is **removed from ALL future combat**,
and **gains FRAIL**. Framed as "better than killing them off."

**4. The random military-trait grant (POST 2)** — battles as a **trait-acquisition path**. ~20-trait
pool (positive + negative): Disharmonious, Easily Overwhelmed, Efficient, Iron Fist, Leadership,
Likeable, Military Leader, Propagandist, Controversial, Unlikeable, Lackey, Magician, Harmonious,
Kingmaker, Delegator, Micromanager, Two Faced, Predictable, Crisis Manager, Decisive General.

**5. Vols21's casualty dice chart (POSTs 3–4) — to BOUND deaths low:**
`1 → 2 deaths · 2 → 1 death · 3 → 2 wounded · 4 → 1 wounded · 5–6 → no casualties`;
**+1 to killed/wounded for the bloodiest (DIFFICULT) battles** (POST 5/6). Realism quibble (POST 3):
wounded vets (Bob Dole, McCain) weren't "frail" → wounded→FRAIL is a slight mismodel (noted, not blocking).

**6. FRAIL / HALE roll interactions (POSTs 5–7, OPEN):** should **FRAIL** raise death odds (list a
frail pol multiple times in the random-pick pool)? Should **HALE** roll twice (wounded only if the
**second** roll also fails)?

**7. Method (POSTs 5–9):** run **isolated sample wars** (e.g. the **Mexican War on the 1840 sheet**)
testing different casualty charts to find the right mix **without drastically changing the game** —
*"possibly the existing rule works best"* (POST 9). Ted (POST 8) adds: casualties are *"another
potential way to increase your stats... the most risky way to do it."*

---

## SHIPPED vs DESIGN (code-verified this run — file:line)

The shipped `applyCasualties` is a **near-implementation of Vols21's chart + the wounded→Frail +
Hale logic**, but with several concrete deltas vs the design above:

- **Casualty counts (rev-war:69–81).** `difficult`: deaths `d6 ≤2→1, ≤4→2, else→3`; wounds same →
  **1–3 each** (close to design's 3–4, slightly low). **`moderate` AND `easy` are IDENTICAL**:
  `deaths = d6≥4 ? 1 : 0`, `wounds = d6≥4 ? 1 : 0` → **0–1 each**. **DESIGN wants EASY 1–2 /
  MEDIUM 2–3** and the two tiers distinct. **SHIPPED caps are too low and EASY≡MEDIUM** — the direct
  mechanical root of Ted's "~1 death / 14 war-years" complaint. ★ primary balance delta.
- **Vols21's exact chart NOT used.** Shipped uses separate `d6≥4` gates per tier, not the literal
  `1→2deaths…5–6→none` table. Design asks to A/B-test charts → shipped is one candidate among several.
- **WOUNDED loses 1 MIL — NOT shipped.** `applyCasualties` wound branch (rev-war:96–118) **only
  grants FRAIL**; it does **NOT** decrement `skills.military`. DESIGN says wounded = −1 MIL. **Delta.**
- **WOUNDED "removed from all future combat" — INDIRECTLY shipped.** No explicit `wounded`/combat-locked
  flag on `Politician`; but the participant/appointment filters exclude `traits.includes('Frail')`
  (rev-war:43, 83), so a wound (→Frail) **does** remove the pol from later battles. `BattleRecord` has
  `killed?: string[]` / `wounded?: string[]` (`types.ts:1367–1368`) and they are populated
  (rev-war:84, 99). Effectively shipped via the Frail gate; no dedicated wounded state.
- **HALE/FRAIL interaction — PARTIALLY shipped, but NOT as designed.** `tryGrantTrait(victim,'Frail')`
  (traits.ts:41–59) is conflict-aware: Hale↔Frail are a conflict pair (`TRAIT_CONFLICTS`,
  `types.ts:679–680`). A Hale carrier resists Frail on a **d6 < 4** (`conflictD6Threshold=4`,
  `types.ts:638`); on d6 ≥ 4 they **shed Hale, gain Frail** (rev-war:101–116, with distinct log lines).
  → Hale already gives a **one-roll save**, NOT the design's *"roll twice, wounded only if 2nd fails."*
  And **FRAIL does NOT raise death odds** — the death pool excludes Frail entirely (rev-war:83), the
  OPPOSITE of the "list a frail pol several times" idea. **Both #85 open questions land on real,
  divergent shipped behavior.**
- **+1 MIL survivor grant — shipped but DIFFERENT shape (rev-war:120–122).** Every surviving
  participant rolls `chance(0.1)` for +1 MIL (capped at 5). DESIGN wants a fixed **1–2/2–3/3–4 by
  difficulty**, not a flat 10% per head. **Delta.**
- **Random military-trait-from-combat — NOT shipped.** No combat code grants the 20-trait pool;
  survivors get only the +1 MIL roll. (All but a few of the named traits exist in the `Trait` union —
  see naming note — but **none is awarded by battle**.) ★ entirely unbuilt mechanic.
- **"ALL HANDS ON DECK" mobilization — NOT shipped.** `appointMilitary` (rev-war:41–65) only seats a
  senior general + ≤4 generals + senior admiral + ≤2 admirals from the MIL≥1 pool; there is **no
  faction-wide pull of every uncareered MIL≥1 pol into a war action phase**. Casualties are computed
  over **all** MIL≥1 non-Frail pols (rev-war:83) — i.e. the *exposure* pool is already broad — but the
  designed *participation/action* phase does not exist. ★ new mechanic.
- **Senior commanders are spared (rev-war:87)** — death/wound candidates exclude `seniorGeneralId` /
  `seniorAdmiralId` ("more historical"). Not in the design text; a shipped nicety to note.
- **Casualties fire on EVERY ground battle, win or loss (rev-war:231)** — matches design intent
  ("no matter WHAT the outcome"). Win/loss instead drives *commander* skill earn/loss
  (`applyBattleLoss`/`applyBattleEarn`, rev-war:128–173).

### Scope / engine-shape facts
- **The casualty system exists ONLY in the Revolutionary War.** `applyCasualties` / `runRevWarBattles`
  live in `revolutionaryWar.ts`; there is **NO generic war engine and NO Mexican-War / 1840-era war
  loop**. The thread's proposed test (Mexican War on the 1840 sheet, POST 6) **has no code to run on**
  — testing it requires either generalizing the rev-war engine or a throwaway harness. (Ties to
  DH-81 / #45 war-end and #56 — the war system is rev-war-only.)
- **`warActive` is a `Predicate` token** (era-event graph; `phaseRunners.ts:2252,2267`) but does not
  spawn a battle loop for non-rev-war wars.
- **#300 cross-link (military-tech → combat modifier):** still **0% shipped** — the ground target is
  `planning + military×10 + (frenchAlliance?25:0) + diffMod` (rev-war:212–218); naval is
  `military×10 + admin + 30` (rev-war:186–191). **No weapon/firearm-tech term, no military-tech
  program-state.** The casualty work (this thread) and the tech-modifier work (#300) are **two
  independent extensions of the same rev-war battle resolution.**
- **Trait-name divergence (minor):** design's pool uses some names absent from the shipped `Trait`
  union — `Two Faced`→**`Two-Faced`** (`types.ts:99`), `Unlikeable`→**`Unlikable`** (`types.ts:157`);
  **`Military Leader`, `Likeable`, `Lackey`** are **not in the union at all**. Most others exist
  (Efficient, Iron Fist, Leadership, Propagandist, Controversial, Magician, Harmonious, Kingmaker,
  Delegator, Micromanager, Predictable, Crisis Manager, Decisive General; Disharmonious / Easily
  Overwhelmed — verify on build). The 20-trait list is **partly aspirational**.
- **Determinism caution:** `applyCasualties` picks victims with **`Math.random()`** (rev-war:89, 97),
  violating CLAUDE.md's seeded-RNG / determinism rule (the rest of the file uses `d`/`d100`/`chance`/
  `pick` from `rng.ts`). Any retune of this code should also fix the RNG source. (Implementation note,
  not a design delta.)

---

## Open questions (for the human / consolidation)

1. **Tune vs. rebuild:** is the ask to (a) raise the existing `applyCasualties` counts (make
   easy/medium distinct, lift caps toward 1–2 / 2–3 / 3–4) — small tuning — or (b) re-architect to
   Vols21's literal chart + add wounded-−1-MIL + the trait-grant + the All-Hands phase? Thread leans
   (a) ("without drastically changing the game", "possibly the existing rule works best").
2. **FRAIL→higher death odds vs. shipped FRAIL→excluded-from-combat:** these contradict. Today a wound
   makes you Frail which **removes** you from future battles (so you can't die later). The design's
   "list Frail pols several times to raise death odds" is **incompatible** with the current exclusion.
   Which wins? (#85)
3. **HALE save shape:** keep the shipped one-roll d6 conflict-save, or switch to the design's
   "roll twice, wounded only if 2nd fails"? (#85)
4. **Generic war engine:** does the Mexican-War test (and 1856+/future wars generally) get a
   generalized battle engine, or stay rev-war-only with ad-hoc harnesses? (DH-81 / #45 / #56)
5. **Trait union additions:** add `Military Leader` / `Likeable` / `Lackey` (and reconcile
   `Two Faced`/`Unlikeable` spellings) before the combat-trait grant can use the full design list?

---

## ★ Deltas vs. current build (hand-off list)

1. **★ BALANCE (existing system, #85/#45): battle-casualty chance too low.** `applyCasualties` ships
   the chart but `easy≡moderate` (0–1 each) and `difficult` caps at 1–3 → ~1 death / 14 war-years
   (POST 8). DESIGN wants easy 1–2 / medium 2–3 / difficult 3–4, tiers distinct. **Tune the counts.**
2. **Wounded → −1 MIL: NOT shipped.** Wound branch grants Frail only (rev-war:96–118); design wants
   the MIL decrement too. **Add −1 MIL on wound.** (extends the wounded-state, #85)
3. **★ NEW: combat-as-trait-acquisition (20-trait grant).** No battle code awards traits; survivors
   get only a flat 10% +1 MIL. Couples the war engine to the trait system; needs ~3 union additions.
   **Genuinely new.**
4. **★ NEW: "ALL HANDS ON DECK" mobilization phase.** No faction-wide pull of uncareered MIL≥1 pols
   into a war action phase; only generals/admirals are seated. **Genuinely new.** (exposure pool is
   already broad in casualty calc, but the participation phase is absent.)
5. **★ NEW-ish: explicit WOUNDED state.** Shipped wound = Frail-via-`tryGrantTrait` (effectively
   combat-locks via the Frail filter) but no dedicated wounded flag and no −1 MIL. Design wants a
   first-class wounded outcome. (overlaps #85 Hale/Frail death-schedule.)
6. **#85 FRAIL/HALE-vs-combat: shipped behavior CONTRADICTS the design questions.** Today FRAIL is
   **excluded** from death/wound pools (rev-war:83) — opposite of "FRAIL raises death odds"; HALE gets
   a **one-roll** d6 save (rev-war:101–116), not the "roll twice" design. **Resolve direction.**
7. **#300 (military-tech → combat modifier): still 0% shipped.** No weapon-tech term in the rev-war
   target (rev-war:212–218). Independent of, but co-located with, the casualty work. (carry forward.)
8. **DH-81 / #45 / #56 (war-end + generic war engine): the casualty system is rev-war-ONLY.** No
   Mexican-War / 1856+ war loop exists; the thread's own proposed test has no code to run on. Tuning
   or generalizing battles implicates the broader war-engine gap.
9. **Impl note (not a design delta): `Math.random()` in `applyCasualties` (rev-war:89,97)** breaks the
   seeded-RNG determinism rule; fix when retuning.

**All proposals above are an in-flight design discussion (Sep 2022, pre-2.7 cutoff), NOT ratified
final mechanics.**

---

*Digest line count: see `wc -l docs/game/playtest-digests/c4eadba5-deep-dive-feedback-foreign-military-affairs.md`.*
