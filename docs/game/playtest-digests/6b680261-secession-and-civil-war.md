# Digest — `6b680261-secession-and-civil-war` ("Secession and Civil War")

**Type:** ★ CANONICAL RULES-DOC — the comprehensive **Secession / Civil-War / Reconstruction
ruleset "AMPU v1.3"**, vcczar-APPROVED (POST 4, 27) and folded into Union doc rules
**3.0.32 & 3.0.35** (POST 8). **10 posts / 1 chunk** (chunk-001, all read; CSV ~25 KB).
politicslounge topic 6626, **Oct 25 – Nov 8, 2025.** Authors: **Bushwa777** (OP — got the
Civil War in his playtest, found secession rules "very slim," asks for one consolidated category,
POST 1) + the rules author (POST 4, the full spec; ran it by ebrk85/10centjimmy/Zagnut/Arkansas
Progressive/Largo833, sent to vcczar who approved) + **theFreezerFlame** (POST 9 — the accepted
**Provincial = 100% secession-or-loyalty** addition).

This thread is **the deep spec** for the secession gaps already tracked (esp. the
`isSlaveState`-ships-but-unread-for-secession gap; the war engine; regions; the
loyalty traits). It is the *point of the thread* to transcribe the algorithm, so the tables
below are verbatim. **Build status (code-verified 2026-06-29): the secession/Civil-War/Reconstruction
ENGINE is almost entirely UNSHIPPED.** What ships is a PR6 "Secession Winter" *event* (cabinet
defections + a meter band that can flag `startWar: 'American Civil War'`) — but that war becomes a
**name-only `War` object** in `snap.wars` with **no battle engine, no theaters, no secessionist
government, no Reconstruction.** Data primitives `isSlaveState` and `region` exist; `Provincial`
exists only as an *election-modifier* trait; **`Union Loyalist`/`Southern Unionist` do not exist.**

---

## ★ 1. SECESSION TRIGGERS BY ERA (the entry points; POST 4)

Many events can break up the Union. Summary (not every option):
- **Federalism** — *Quaker Petition to Abolish Slavery, Option B* → early **Upper-South + Deep-South
  secession convention.**
- **Republicanism** — *Essex Junto* → **NY + New England** form a separate nation. *Hartford
  Convention* + state conventions → **MA, CT, RI, NH, VT, and ME (if formed).**
- **Democracy** — *Nullification Crisis* → **SC secedes**, other Deep-South states get the convention
  option. *Texas Revolution, opt-C (aid Mexico)* → TX can join a Deep-South Confederacy. *Mormon
  Extermination Order, opt-B BLUNDERED* → Upper/Deep-South secession crisis.
- **Nationalism** —
  - *John Brown's **Raid**, opt-B BLUNDERED* → automatic conventions + Civil War (Upper + Deep South).
  - *John Brown's **Uprising*** (distinct from the Raid): the raid **WORKED** → nationwide **slave
    uprising** against masters. Branches on opt-C/D: opt-C = US military disperses it (amid Northern
    secession debates); opt-D = Congress *abolishes slavery* (ends uprising) **or** *fails to abolish*
    → the **North** secedes & uprising continues.
  - **CSA formation after the last elections** (no John Brown needed): FL, AL, GA, MS, LA, TX, SC, NC,
    TN, AR, VA form the Confederacy — triggers **after a RED election win where NO southern state voted
    for the candidate.** Seceded-state pols go **inactive** unless **Union Loyalist**, until states are
    regained.
  - **Border-state spread:** **MD, DE, KY, MO** join the established Confederacy.
  - **Northern variants:** "Northern States Vote to Secede" (NY + New England → Northern Confederacy);
    Southern variant (Upper South + Deep South + TX).

## ★ 2. STATE SECESSION CONVENTION — the Gov action vote (ideology-keyed; POST 4)

A **Gov action**. Each state's politicians vote; ideology sets the probability. *(Border-state table is
separate — §4.)*

| Ideology | SOUTHERN Civil War (vote FOR secession) | NORTHERN Civil War (vote FOR secession) |
|---|---|---|
| Traditionalist | **75%** | 0% *(proposed)* |
| RW Populist | **75%** | 0% *(proposed)* |
| Conservative | **50%** | 25% *(proposed)* |
| Moderate | **30%** | **50%** |
| Liberal | **0%** | 50% *(proposed)* |
| Progressive | **0%** | **75%** (incl. *proposed* LW Pop/Prog 75%) |
| LW Populist | **0%** | **75%** *(proposed)* |
| **Nationalist** (modifier) | **−25% likelihood** | **−25% likelihood** |
| **Union Loyalist** (trait) | **NEVER** votes for it | **NEVER** votes for it |
| Civil Rights / LW Activist | — | **75%** |

> NORTHERN-CW rows tagged *(proposed)* are the author's suggested addition (POST 4: *"I believe it
> should also add…"*) — LW Pop/Prog 75%, Lib/Mod 50%, Cons 25%, Trad/RW Pop 0%. Reasoning (POST 4):
> in the North it's the LW Pops/Progs (abolitionists) leading secession after failed nationwide
> abolition (or Hartford/Essex compromise collapse), the mirror of Trad/RW Pop leading in the South.

**Vote outcomes (POST 4):**
- **Secede** → state leaves, joins any other seceded state to form a Confederacy.
- **Vote NO** → **administration −1 in elections in that state next national election** + **50% chance
  domestic-stability −1.** ("A state may find they are an island unto themselves" if it stays but all
  neighbors leave.)

## ★ 3. WHICH POLITICIANS LEAVE (politician-secession table; POST 4)

**Union Loyalist trait → never secedes, regardless of state.** Otherwise:

**SOUTHERN secession — % chance a pol STAYS with the Union:**
| Group | Stay % |
|---|---|
| Liberal / Progressive / LW Populist | **90%** |
| Black politicians | **99%** |
| Nationalist | **50%** |
| Moderate, Upper South | **10%** |
| Moderate, Southwest | **10%** |
| Conservative, Upper South | **5%** |
| Moderate, Deep South | **3%** |

**NORTHERN secession — % chance a pol STAYS with the Union** (its own table):
| Group | Stay % |
|---|---|
| LW Populist / Progressive (abolitionists leaving the slave-Union) | **10%** |
| Black politicians | **1%** |
| Liberal | **25%** |
| Moderate | **50%** |
| Nationalist (any ideology) | **75%** |
| Traditionalist | **75%** |
| RW Populist | **90%** |

**National-figure modifiers** (applied to the secede chance):
- Gov / US Sen / US Rep of a seceding state: **+5% more likely to secede**
- President / VP / cabinet / cabinet-level officers: **−10% to secede**
- SC Justices: **−25% to secede**
- Generals & Admirals: **−10% to secede**

**Trait rules (the heart of the loyalty system):**
- **Union Loyalist** (EARNED by pols who defy a seceding home state): never secede; **+1 party
  preference to a presidential ticket** during CW/Reconstruction (if ≥1 ticket member has it);
  **−1 in their home-state elections AFTER Reconstruction**; they **keep their seceded home state**
  as residence. Seceded states **cannot send Reps/Senators to US Congress or get new SC justices**,
  but loyal pols from those states **can serve in the US military, cabinet, or as Ambassador.**
- **Provincial** (accepted addition, POST 9–10): **100% secession-or-loyalty by region, regardless of
  ideology** — overrides the % tables.
- **Southern Unionist** trait also referenced (the loyalty-to-Union-from-a-Southern-state archetype).
- Seceded-state pols are **not playable** until an Executive reinstatement or Congressional
  readmission/pardon (§9). Playtest handling: move them off faction sheets to a separate tab so their
  interests aren't counted for card distribution (they're no longer US citizens).

## ★ 4. BORDER-STATE secession (MD, DE, KY, MO — Southern-secession case; POST 4)

Ideology-keyed **chance to SECEDE** (Union Loyalist never secedes):
| Ideology | Secede % |
|---|---|
| RW Populist / Traditionalist | **75%** |
| Conservative | **50%** |
| Moderate | **25%** |
| Liberal / Progressive / LW Populist | **10%** |

## ★ 5. CIVIL WAR = a MAJOR WAR (theater structure; POST 4)

- **Northern secession** → **ONE front (Northeast) + sea.** US must win the front and at sea.
- **Southern secession** → **TWO theaters (East + West), each its own theater, + sea in BOTH.** US
  must win **both** land theaters **and** at sea in both to win the war.

**Secessionist Government (POST 4):** the new Confederacy (N or S) appoints **at random** a President,
VP, Senior Admiral, Senior General — criteria **mirror the US**:
- Pres & VP: ≥35 yrs, reside in a seceding state, ≥1 Command point.
- Sr Admiral: Naval interest + ≥1 Military skill. Sr General: Military/Army interest + ≥1 Military skill.
- These four are the "Senior leaders." Optional: a secessionist cabinet + Ambassadors + lower
  Generals/Admirals, all on **identical US-cabinet criteria.**

**Guerilla Warfare (POST 4):** even after the conventional Civil War is **WON**, there's a chance for a
**guerilla war = a separate MINOR War** fought in the "back woods." Affected states enter military
reconstruction with heavy military presence, but **states CANNOT be readmitted until the guerilla war
is finished.**

## ★ 6. RECONSTRUCTION — state readmission (Union victory; POST 4)

Triggered **immediately** on Union victory. Two halves: bringing states back + resolving seceded pols.

**Mechanics & phase liberties (game-phase order forces a few):**
- On war end (**phase 2.7**), formerly-seceded states go **immediately** into zones of military
  occupation (don't wait for the Congressional phase), then auto-proposed in Congress for "affirmation"
  (or via Presidential exec action).
- *"Create Military Districts to establish Martial Law"* → **5 military districts**, Union Generals
  governing. **President appoints Governors (2-year / half-term terms, in phase 2.8 Executive)** — Gov
  needs ≥1 Gov skill + residence in-state; **all real-life pols (Blue & Red) must be appointed before
  any are created**; no term limits. State gets **no Congressional representation** until Congress
  readmits it. As states return via Congress, the President **loses** Gov-appointment power there.
- Readmission also requires **14th-Amendment ratification.**

**The 3 readmission plans (Congress OR President-by-exec-action; all already in the game's bill list):**
1. **Immediate / pre-war bias** — bring states back at once, no reconstruction, with pre-war biases.
2. **10% Ironclad Oath plan** (Andrew Johnson's; 10% of pre-war pop swears loyalty) — all states back,
   **no party-preference penalty.**
3. **"Establish Strict Majority Loyalty w. Ironclad Oath"** — states voted on **individually**; each
   readmitted state shifts **+2 toward the incumbent** AND its Gov/Congress party-pref shifts **+2 in
   the OPPOSITE direction of the historical state majority** for **8 YEARS / 4 HALF-TERMS.** (e.g.
   TN Blue+2 → neutral; CT Red+1 → Blue+1.)

**★ AUTO-READMIT (if Congress does NOTHING):** states **automatically readmit after 12 YEARS / 6
HALF-TERMS** with **NO party-pref penalty** — mirrors 1865–1877. So Congress has **6 half-terms** to
act or the Strict-Majority penalty never lands.

**State representation on readmission (POST 4):** states keep their **pre-secession House seat count
until the next census.** That census **should count CW casualties** (more the longer the war ran) and,
for a Southern Confederacy, **freed slaves if given the vote.** → couples to the census/apportionment
gap.

## ★ 7. RECONSTRUCTION — politicians who seceded (5 escalating citizenship-strip options; POST 4)

Congress **or** President may decide pol citizenship (unlike state readmission, Congress-only). Five
options, **least → most severe**, each with a **±250-pt ideology swing** (Southern secession shown;
Northern = opposite points unless noted):

1. **Restore Citizenship of Former Confederates** — all seceded pols return, pardoned. **+250** RW
   Pop/Trad/RW Activist, **−250** LW Pop/Prog/LW Activist.
2. **Strip Senior Confederate leaders only** (Pres, VP, Sr Admiral, Sr General removed); all others
   pardoned; Reconstruction active. **+250** Trad & Cons, **−250** Lib & Prog.
3. **Strip ALL Confederate leaders** (Pres, VP, Cabinet-if-selected, senior military) — *"closest to
   what historically happened"*; others pardoned. **+250** Cons/Mod/Lib, **−250** RW Pop/LW Pop. *(Same
   if Northern secession.)*
4. **Strip all Confederate leaders + all who held office at secession** (Govs, Reps, Senators, cabinet,
   senior military officers removed); others pardoned. **+250** Mod/Lib, **−250** RW Pop/LW Pop/RW
   Activist/LW Activist. *(All cases.)*
5. **Strip ALL who seceded** — every pol who declared for the Confederacy removed permanently.
   **EXCEPTION:** pols **draftable during the war are exempt** (the war began before they could "swear
   allegiance" — e.g. the **draft class of 1864 and later survive**). **+250** LW Pop/Prog/LW Activist,
   **−250** RW Pop/Trad/RW Activist.

**Plus a Presidential exec action — "Pardon Confederate Soldiers"** (cannot be deactivated): pardons
rank-and-file soldiers after a loyalty oath; does **NOT** pardon any politician.

## ★ 8. RECONSTRUCTION election bonuses (while penalties last; POST 4)

- **Black candidates +1 in EVERY election** in readmitted states — *as long as Blacks have the vote* —
  reflecting freed-slave enthusiasm. Lasts as long as the state's party-pref penalty is in effect.
- **Civil Rights-interest candidates +1** (for Gov / Rep / Senator) in any former Confederate state —
  *if slavery is abolished by Congress during the war or the half-term after.* Same duration.
- On return, a state runs Gov/Rep (and Senator if directly elected) elections with the bias penalty
  added to existing bias (e.g. Blue+5 votes as Blue+3 for 8 yrs; a Blue+1 seat becomes Red+1).

---

## Build-vs-design (CODE-VERIFIED — `src/` HEAD 2026-06-29)

**Headline: the secession/CW/Reconstruction ENGINE is ~unbuilt. Data primitives exist; the algorithm
does not.** What ships is a narrow PR6 *event*, not the system.

**What SHIPS:**
- **`State.isSlaveState: boolean`** — `types.ts:1329`. Set at statehood (e.g. territory conversion
  `isSlaveState: t.region === 'South' || t.region === 'Border'`, `phaseRunners.ts:3175`). **Never read
  by any secession/CW logic** (confirms the tracked gap — ships-but-unread-for-secession).
- **`State.region`** — `types.ts:1322`, a **fixed enum** `'Northeast'|'Midwest'|'South'|'West'|
  'Border'|'Canada'|'Caribbean'|'Latin America'|'Pacific'|'Atlantic'`. **NO "Upper South" / "Deep
  South" / "Southwest"** granularity the politician-secession table (§3) requires. `'Border'` exists
  but isn't restricted to MD/DE/KY/MO.
- **PR6 "Secession Winter" EVENT** — `eraEvents1856.ts` (`southern-secession-threat` templ. yr 1860,
  `secession-winter` templ. yr 1861) + `phaseRunners.ts:2834-3053`. Runs **cabinet-officer defection
  rolls** (Treasury/War/Interior/State seats may resign "to join the Confederacy," `:3028-3053`),
  computes a meter **band multiplier** (`secessionWinterBand`, `:3001`), and if **N≥2 defectors** sets
  `out.startWar = { name:'American Civil War', against:'Confederate States' }` (`:2980`). This is the
  *only* secession mechanic in the build, and it's an **event + meter + cabinet-resignation flavor
  layer**, NOT the convention-vote / politician-secession algorithm.
- **`domestic` meter** — `NationalMeters.domestic` (`types.ts:1403`) + `domesticStability?` effect
  field (`types.ts:1453`, `phaseRunners.ts:3209`). The "domestic-stability −1 on a no-secede vote"
  (§2) has a meter to write to — but no convention-vote code writes it.
- **`Provincial` trait** — `types.ts:107,170` — exists but **only as a PR4b ELECTION-modifier trait**
  (geographic-horizon negative; election bands at `types.ts:916-933`). **Not wired to secession
  loyalty** (the POST 9 "100% by region" rule).

**What does NOT ship (the spec, unbuilt):**
- **`Union Loyalist` and `Southern Unionist` traits do NOT exist** in the `Trait` union
  (`types.ts:62-117`). The entire Union-Loyalist system (earn-on-defiance, +1 ticket party-pref,
  −1 home-state post-Reconstruction, keep-seceded-home-state) has no type or logic.
- **State secession-convention VOTE** (§2 ideology table): no code. No per-state ideology-keyed roll,
  no no-secede penalty (admin −1 + 50% domestic −1).
- **Politician-secession table** (§3) + **national-figure modifiers** + **border-state table** (§4):
  no code. No mechanism moves pols out of factions on secession (only the 4 cabinet seats defect, and
  that's a flat resignation, not the ideology/region table).
- **Civil War battle engine / theaters:** **NONE.** `startWar` pushes a **name-only generic `War`**
  into `snap.wars` — `{ id, name, enemy, startYear, warScore:0, generals, battles:[] }`
  (`phaseRunners.ts:3242-3251`). The actual battle engine (`revolutionaryWar.ts`) is **single-front**
  (`currentGroundWins`/`groundWinsNeeded`, one naval tally; win/loss at `:254-263`) and **only runs on
  `game.revolutionaryWar`**, NOT on `snap.wars`. So the Civil War, once "started," **has no battles, no
  East/West theaters, no two-theater win condition** (`RevolutionaryWar` type, `types.ts:1371-1387`,
  has no theater/`isCivilWar` field). 2.7.2 Military only fires when `revolutionaryWar?.active`
  (`phases.ts:134`).
- **Secessionist Government** (random Pres/VP/Sr Adm/Sr Gen, §5): no code; no Confederate-side roster.
- **Guerilla war as a separate Minor War blocking readmission** (§5): no code.
- **Reconstruction — ALL of it:** no Reconstruction phase (`phases.ts` has 2.7 Foreign/Military and
  2.8 Executive but **no military-district / martial-law / Gov-appointment-under-occupation / readmit
  step**); no `readmission`/`reconstruction`/`militaryDistrict` anywhere in `src/`. The 3 readmission
  plans, the 12-yr/6-half-term auto-readmit, the 5 citizenship-strip options, "Pardon Confederate
  Soldiers," and the Black/Civil-Rights +1 election bonuses are **all unbuilt.** (Note POST 4 claims
  the bills exist "in the game already" — that's the **forum/spreadsheet** game's bill list, not the
  browser build, where none of these exist.)
- **Census coupling** (§6 — count CW casualties + freed slaves): the census subsystem itself is
  unbuilt (separate census gap), so this requirement has nowhere to attach yet.

**Determinism note:** all the §2–§4 rolls (convention vote, who-leaves, border-state) must use the
seeded RNG (`src/rng.ts`) to keep the engine deterministic — relevant to the seeded-RNG gap. The
existing Secession-Winter defection rolls already go through the engine's RNG path.

---

## Candidate deltas for consolidation
*(Consolidation owns the gap-log write + numbering. Mapped to EXISTING gaps where one fits; new
subsystems flagged. Cite: this digest + file:line.)*

### Attach to EXISTING gaps
- **`isSlaveState` ships-but-unread-for-secession (existing — the secession gap, ~b47).** This thread
  is its **deep spec.** Confirmed: `isSlaveState` (`types.ts:1329`) is written at statehood
  (`phaseRunners.ts:3175`) and **read by no secession/CW code.** The convention-vote (§2) and
  politician-secession (§3) tables are exactly what should consume it. POST 4.
- **Civil-War / generic war engine (existing war gaps — generic war-system + Major/Minor/Operation
  tiers).** Civil War is a **Major War** with N-secession = 1 front+sea, S-secession = **2 theaters +
  sea in both** (§5). SHIPPED: Civil War is a **name-only `War`** in `snap.wars`
  (`phaseRunners.ts:3242`) with **no battle engine**; `revolutionaryWar.ts` is single-front and runs
  only on `game.revolutionaryWar`. The theater structure + guerilla-Minor-War feed the war gaps. POST 4.
- **Census counts CW casualties + freed slaves (existing census gap).** Readmitted states keep
  pre-secession House seats until the next census, which must count casualties + freed voters (§6).
  Census subsystem itself unbuilt. POST 4.
- **Region granularity (existing regions gap).** Politician-secession table needs **Upper South / Deep
  South / Southwest / border (MD,DE,KY,MO)**; `State.region` (`types.ts:1322`) only has coarse
  `'South'`/`'Border'`. POST 4.
- **Union Loyalist / Southern Unionist / Provincial-as-loyalty traits (existing loyalty-traits gap).**
  `Union Loyalist` & `Southern Unionist` **absent** from `Trait` (`types.ts:62-117`); `Provincial`
  exists only as an **election modifier** (`types.ts:916-933`), not the POST-9 "100% secession-or-
  loyalty by region" rule. Union-Loyalist's full effect set (earn-on-defiance, +1 ticket pref, −1
  home-state post-Reconstruction, keep-seceded-home-state) is unbuilt. POST 4, 9, 10.
- **Seeded RNG for the rolls (existing seeded-RNG gap).** §2–§4 convention/who-leaves/border rolls
  must route through `src/rng.ts`. POST 4.

### Genuinely NEW
- **NEW — State secession-convention VOTE (ideology-keyed % table + no-secede penalty).** Per-state
  Gov action: Trad/RW Pop 75% / Cons 50% / Mod 30% / Lib·Prog·LW Pop 0% (Southern); Northern table
  with Mod 50% / Civil-Rights·LW-Activist 75% + proposed LW Pop·Prog 75% / Lib·Mod 50% / Cons 25%;
  Nationalist −25%; Union Loyalist never. No-secede → admin **−1** in that state next national election
  + **50% domestic −1.** Zero code today. §2 / POST 4.
- **NEW — Politician-secession table (who leaves) + national-figure modifiers + border-state table.**
  Separate Southern & Northern stay-% tables keyed to ideology/race/region; office modifiers (Gov·Sen·
  Rep +5%, Pres·VP·cabinet −10%, Justice −25%, Gen·Adm −10%); border-state secede table (RW Pop·Trad
  75% / Cons 50% / Mod 25% / Lib·Prog·LW Pop 10%). Moves pols out of factions on secession; only flat
  cabinet defection ships. §3·§4 / POST 4.
- **NEW — Civil-War theater structure + Secessionist Government + guerilla-as-Minor-War.** S-secession
  = East+West land theaters + sea in both (win all); N-secession = Northeast + sea. Random Confederate
  Pres/VP/Sr Adm/Sr Gen on US-mirrored criteria (+ optional cabinet/officers). Guerilla = separate
  Minor War that **blocks readmission** until won. §5 / POST 4.
- **NEW — Reconstruction readmission system: 3 plans + 12-yr/6-half-term AUTO-readmit.** Immediate /
  10% Ironclad-oath / Strict-Majority-Loyalty (+2 toward incumbent & +2 opposite historical majority
  for 8 yrs/4 half-terms, voted individually); **★ auto-readmit after 12 yrs/6 half-terms with no
  penalty if Congress does nothing.** Plus military districts/martial law, President-appointed Govs
  (2-yr, phase 2.8) until Congress readmits, 14th-Amendment requirement. No Reconstruction phase exists
  (`phases.ts`). §6 / POST 4.
- **NEW — Reconstruction politician readmission: 5 escalating citizenship-strip options + "Pardon
  Confederate Soldiers."** Least→most severe, each ±250-pt ideology swing; draft-class-1864+ exempt
  from the harshest; the soldier-pardon exec action (un-deactivatable) pardons rank-and-file only.
  §7 / POST 4.
- **NEW — Reconstruction election bonuses: Black +1 (if Blacks vote) & Civil-Rights +1 (if slavery
  abolished) in readmitted states, while penalties last.** §8 / POST 4.

### Provenance notes
- Single chunk; all 10 posts read. **Canonical rules-doc** (vcczar-approved, in Union rules 3.0.32 &
  3.0.35), NOT a playthrough. Load-bearing post is **POST 4** (the entire spec, ~200 lines); POST 9–10
  add the **Provincial 100%-by-region** rule. POSTs 1–3/5–8 are the request + approval thread.
- Codebase verified at `src/` HEAD 2026-06-29: `State.isSlaveState`/`region` (`types.ts:1322,1329`);
  `Trait` union has `Provincial` but no Union/Southern-Unionist (`types.ts:62-117`); Provincial =
  election modifier only (`types.ts:916-933`); PR6 Secession-Winter event
  (`eraEvents1856.ts` `southern-secession-threat`/`secession-winter`; `phaseRunners.ts:2834-3053`,
  `secessionWinterBand` `:3001`, defections `:3028`, `startWar` inject `:2980`); generic `War` push
  (`phaseRunners.ts:3242-3251`); single-front battle engine (`revolutionaryWar.ts:254-263`,
  `RevolutionaryWar` type `types.ts:1371-1387`); no Reconstruction/readmission/militaryDistrict in
  `phases.ts` or anywhere in `src/`; `domestic` meter `types.ts:1403`.
