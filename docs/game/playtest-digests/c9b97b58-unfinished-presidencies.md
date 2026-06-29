# Digest — "Unfinished presidencies" (topic 1717, thread `c9b97b58`)

**Scope:** A short design Q&A (13 posts, ~7.5k chars; Jan–Feb 2023) about how the
game handles presidencies cut short (Lincoln/Kennedy/McKinley/Nixon) and whether
**assassinations** are possible. Yields the **canonical assassination general-event
spec** (the 50/25/25 distribution) plus several designer-floated refinements that
are NOT (yet) in the build. No playthrough; pure design discussion among the dev
team (Willthescout7, ebrk85, Cal, Vols21, MrPotatoTed) and players.

**Batch 49, DIGEST-ONLY.** Era framing per `docs/game/historical-context.md`
(no historian ran this batch). Cross-refs: **b46 #283** (assassination system),
**b45/b46 #283** (Pineapple Primary), the **general-event / era-content-band**
system, **Hale/Frail** traits, **domestic-stability** meter.

---

## 1. Era-start framing — fixed predetermined eras, not free-start (POST 1–2)

- **Q (POST 1, Chuckstar):** "How will the game handle presidencies cut short?
  Kennedy, Lincoln, McKinley, Nixon… fire up a game start in 1865 — is Lincoln
  dead or will I have the option to play through to see if he can accomplish
  reconstruction?"
- **A (POST 2, Willthescout7):** "**The game will start in predetermined eras.**
  If Kennedy or Lincoln is President in one of those, then yes, you will have an
  opportunity to see what they would have done. Of course, **they can also die
  and history just repeat itself.**"
- **Confirms the fixed-era-scenario design** (start dates are curated era openings,
  not an arbitrary year picker). A cut-short historical figure who is in office at
  an era start is a *playable counterfactual* — the player can try to let them
  finish, OR a (random/scripted) death event recreates history. This is the
  thread's reason-for-being and the lens for the whole assassination discussion.
- Matches the KB consensus that **eras are game-state content-bands** (see
  historical-context.md §1 corroboration note: era labels re-emit at the same
  in-game dates across saves; "eras are game-state content-bands, not calendar
  gates").

## 2. ★ Assassination = a general event — the canonical 50/25/25 spec (POST 3–6)

- POST 3 (jnewt): are assassinations possible, and only for Presidents? (Huey Long
  cited as a non-President who was assassinated.)
- POST 4–5 (Willthescout7, ebrk85): "If they are, it'll be an event, either
  **scripted or general**." → "It's a **general event** that can fire."
- **★ POST 5–6 (ebrk85), the canonical spec — quote verbatim:**
  > **Assassination Attempt** — Random politician that is holding an office has a
  > **50% chance of death, 25% chance of wounding (−1 of all abilities), 25%
  > chance of no serious injuries.**
- Distribution to capture exactly: **50% death / 25% wound / 25% unharmed**, where
  **wound = −1 to ALL abilities** (i.e. −1 to every skill in `admin, legislative,
  judicial, military, governing, backroom`, presumably command too). Target is **a
  random *office-holder*** — answers POST 3: NOT President-only (any office, hence
  Long-type victims are in scope).
- This is the concrete spec behind the assassination system flagged at **b46 #283**.

## 3. Designer-floated refinements (proposed, NOT confirmed shipped) (POST 7–13)

These are wishlist/design ideas raised in-thread; treat as **designed intent**,
not shipped reality (see §5 for what the build actually does).

- **Weight the target toward non-obscure office-holders** (POST 7, Cal): since the
  event is rare, bias it to hit Lincoln/JFK/Long/Roosevelt/Reagan/Bush rather than
  "the far more abundant **random schmucks**." (POST 8–9 are flavor mocking random
  no-name victims: "they just shot Harley Orrin Staggers and Juanita Krep"; "They
  killed Hiester!")
- **There are already "a few other events that specifically target the big
  w(h)igs"** (POST 10, Cal) — i.e. marquee-targeting events exist beyond the random
  assassination card; Cal declines an exhaustive list.
- **Suggested office weighting** (POST 11, Vols21): "**40% President, 30% Gov, 20%
  Senator, 10% Rep.**"
- **Extra trigger conditions** (POST 11, Vols21): beyond the random card, certain
  events could trigger an assassination-attempt roll — **after a Civil War**, **if
  domestic stability falls below a certain level**, and **certain eras where it was
  prevalent (e.g. the 1960s)**, for which a **once-per-cycle check during the early
  primaries / before the convention** (mirroring "the scandal roll now, but just do
  it once") could test for an attempt on a candidate.
- **★ Hale vs Frail affects survival** (POST 11, Vols21): **Hale → much more likely
  to survive, attempt may even be thwarted; Frail → more likely to end in death or
  severe wounding** that forces them out of politics to recover. (Designer wants the
  existing robustness trait pair wired into the assassination roll.)

## 4. ★ Era-varying general-event rates — CONFIRMED by the dev (POST 12)

- POST 12 (Vols21): "**General events (including assassination attempts) already
  vary by era.** So there's no chance of a **cyber attack in 1788** for example…
  I'm sure the odds [of assassinations] **ebb and flow by era just like any other
  general event.**"
- Confirms the **era-as-content-band** system applies to the *general/random* event
  pool too (not just scripted era events): each era exposes a different pool + rate.
  This is corroborated in code (see §5).

## 5. Pineapple Primary + USS Princeton (POST 10, 13)

- **Pineapple Primary** (POST 13, MrPotatoTed): "There also already is an
  assassination attempt event (**pineapple primary**) which **specifically targets
  a random candidate in the next presidential primaries.**" → a candidate-targeted
  assassination event already exists at the *primary* stage. Cross-ref **b45/b46
  #283**. (NOTE: not found by name in current `src/` — see deltas.)
- **USS Princeton** (POST 10, Cal): a **non-assassination mass-casualty** event —
  "rewind 1840 and see how hyped we were for the USS Princeton… not so much an
  assassination as it is **gross negligence resulting in multiple cabinet-level
  deaths**." (Historical: the Feb 1844 Princeton gun explosion killed the SecState
  and SecNavy among others.) Example of marquee-targeting flavor events beyond
  assassination.

---

## 6. Code verification — shipped vs. designed

Verified against the build (`src/data/anytimeEvents.ts`, `src/engine/phaseRunners.ts`,
`src/types.ts`). The shipped "general event" system is the **anytime-events** system
(phase **2.4.2**, `runPhase_2_4_2_Anytime`), split into a **personal** pool
(`ANYTIME_EVENT_TEMPLATES`) and a **national** pool (`ANYTIME_NATIONAL_TEMPLATES`).

- **Assassination IS shipped — but NOT as one 50/25/25 event.** It's **two** weighted
  personal templates, both gated `eras: ['nationalism','modern']`
  (`anytimeEvents.ts:222–238`):
  - `assassination-attempt-survived` — **weight 2** — effects: `grantTrait
    Charismatic` + `pvBump +8` ("public sympathy surges"). *Survives and is buffed.*
  - `assassination-killed` — **weight 1** — effect: `death`.
  - ⇒ once an assassination template is selected, the implied split is **~67%
    survive (buffed) / ~33% killed** — **NOT 50% death / 25% wound / 25% unharmed**.
    The **−1-to-all-abilities WOUND branch does not exist at all** (no template
    applies a uniform −1 across every skill). The shipped "survive" outcome even
    *helps* the victim (Charismatic + PV), the opposite of a wound.
- **Target selection is uniform-random, NO office weighting.** `rollPersonalEvents`
  loops every living politician and rolls a flat `baseFireChance` (0.05) × era
  `fireMult` independently for each (`phaseRunners.ts:2655–2660`); the picked
  template is `pickWeighted` over the era-eligible pool. There is **no 40/30/20/10
  President/Gov/Senator/Rep weighting** and **no bias toward marquee/non-obscure
  office-holders** — exactly the "random schmucks" problem Cal/Vols21 wanted fixed
  (POST 7, 10, 11). (Region is filtered; office/PV/notability is not.)
- **★ Era variation IS implemented (confirms POST 12).** Two mechanisms:
  (a) per-era rates in `ANYTIME_EVENTS_RULES.eraConfig` — `fireMult`
  0.8/0.9/1.0/1.1 and `nationalFireMult` 0.9/0.95/1.0/1.1 across
  independence/federalism/nationalism/modern (`types.ts:1076–1085`); and
  (b) per-template `eras?: Era[]` filtering + `eraWeightMult` in the selection pool
  (`phaseRunners.ts:2663–2673`). Assassination being `['nationalism','modern']`-only
  literally encodes "no assassination general event in early eras" — the analogue of
  POST 12's "no cyber attack in 1788." **But the engine has only 4 coarse eras**
  (`independence/federalism/nationalism/modern`), so the forum's fine-grained
  "1960s spike" (POST 11–12) **cannot** be expressed — the 1960s fall inside the
  single broad `modern` band.
- **Hale/Frail do NOT influence assassination** (contra POST 11). The traits exist
  (`types.ts:84,102`) and affect: mortality decay (`frailDeathMult: 1.5`,
  `haleChanceMult`; `phaseRunners.ts:2362,2392`) and the **Revolutionary-War** wound
  roll (`revolutionaryWar.ts:99–117`, where a wound grants Frail / a Hale carrier can
  shrug it off on a d6). They are **not** consulted by `rollPersonalEvents` for the
  assassination templates — no survival/thwart modifier.
- **No domestic-stability / post-Civil-War / pre-convention assassination trigger**
  (contra POST 11). `domesticStability` exists only as the `domestic` meter shorthand
  (`types.ts:1453`; `phaseRunners.ts:3218`) and is never read to gate or boost an
  assassination roll. There is **no candidate-targeted, once-per-cycle pre-convention
  assassination check** (the scandal-roll-analogue idea is unbuilt).
- **No "Pineapple Primary" in code** (contra POST 13). `grep -i pineapple` over
  `src/` = no matches. The shipped assassination events fire in the generic 2.4.2
  anytime phase over *all* politicians, not specifically against a candidate in the
  *next presidential primary*. Either the named event was never shipped, was removed,
  or lives outside the engine. (Open question — flag for b45/b46 #283 reconciliation.)
- **USS Princeton** (POST 10): no Princeton-specific or "cabinet mass-casualty"
  template found in `anytimeEvents.ts` / national pool. Unbuilt as a named event.

---

## 7. Deltas / confirmations vs current build

**Headline:** the canonical **50/25/25 assassination general event** + **era-varying
general-event rates (CONFIRMED in code)** + the unbuilt **office-weighting /
Hale-Frail / domestic-stability-trigger** refinements.

**CONFIRMS (build already matches design):**
- ✅ **Fixed predetermined era starts** (POST 1–2) — scenarios are curated era
  openings; cut-short figures are playable counterfactuals.
- ✅ **Assassination exists as a general (random) event**, any office-holder eligible
  (POST 3–6) — present in the 2.4.2 anytime pool.
- ✅ **General-event pools & rates vary by era** (POST 12) — `eras[]` filter +
  per-era `fireMult`/`eraWeightMult` (`types.ts:1076–1085`, `phaseRunners.ts:2663–2673`).
  Assassination is `nationalism`+`modern`-only.

**DELTAS (designed but NOT in the build — roadmap candidates):**
1. **Assassination outcome distribution is wrong.** Spec = **50% death / 25% wound
   (−1 ALL abilities) / 25% unharmed** (POST 5–6). Build = two templates implying
   **~67% survive-and-BUFFED / ~33% death**, with the survive outcome granting
   Charismatic +PV (opposite of a wound). **The −1-all-abilities WOUND branch is
   entirely missing.** Requirement: a 3-way roll incl. a uniform −1-to-all-abilities
   wound effect (no analogue exists in `AnytimeEventEffect`).
2. **No office/notability weighting on the target.** Build picks a uniform-random
   living politician (`baseFireChance` per head). Spec asks to bias toward
   non-obscure office-holders — suggested **40% Pres / 30% Gov / 20% Sen / 10% Rep**
   (POST 7, 10, 11). Requirement: office- (or PV-) weighted victim selection.
3. **Hale/Frail don't affect assassination survival** (POST 11). Traits exist and
   gate mortality + the war-wound roll, but not assassination. Requirement: Hale →
   higher survive/thwart, Frail → higher death/severe-wound, on the assassination roll.
4. **No conditional assassination triggers** (POST 11): after a Civil War, when
   **domestic stability** drops below a threshold, or in high-risk eras (1960s).
   `domestic` meter exists but isn't wired. Requirement: stability-/event-gated extra
   assassination rolls.
5. **No once-per-cycle pre-convention candidate assassination check** (POST 11) —
   the "scandal-roll, but once" idea targeting a primary candidate is unbuilt.
6. **"Pineapple Primary" candidate-targeted assassination event** (POST 13) — claimed
   to already exist, but **not found in `src/`**. Reconcile with b45/b46 #283: shipped,
   removed, or out-of-engine? (Open question.)
7. **Engine has only 4 coarse eras**, so the forum's fine-grained "1960s assassination
   spike" cannot currently be modeled — 1960s sits inside the broad `modern` band.
   (Era-granularity gap; cross-ref era-content-band system.)
8. **USS Princeton / cabinet mass-casualty** flavor event (POST 10) — unbuilt.

**Open questions (for the human):**
- Does the −1-all-abilities wound need a new effect kind, or compose from per-skill
  `skillBump -1` × all + `commandBump -1`?
- Is "Pineapple Primary" a renamed/removed event, or implemented somewhere outside
  the anytime-event engine? (Reconcile with b45/b46 #283.)
- Should the 50/25/25 spec replace the current two-template behavior, or coexist as a
  separate "major" assassination path distinct from the lightweight random one?

---

*Cross-refs:* b46 #283 (assassination system) · b45/b46 #283 (Pineapple Primary) ·
era-content-band / general-event system · Hale/Frail traits · domestic-stability meter.
*Code anchors:* `src/data/anytimeEvents.ts:222–238` (assassination templates),
`src/engine/phaseRunners.ts:2650–2791` (`rollPersonalEvents` / `runPhase_2_4_2_Anytime`),
`src/types.ts:1073–1095` (`ANYTIME_EVENTS_RULES` era config), `src/types.ts:84,102`
(Hale/Frail), `src/engine/revolutionaryWar.ts:99–117` (Hale/Frail wound roll).
