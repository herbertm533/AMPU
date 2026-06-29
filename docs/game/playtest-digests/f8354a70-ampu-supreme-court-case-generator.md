# Digest — `f8354a70-ampu-supreme-court-case-generator` ("AMPU Supreme Court Case Generator")

**Type:** DESIGN ARTIFACT drop — vcczar's **first working draft of the procedural SC Case Generator**
(a spreadsheet tab he posts, "under SC Cases spreadsheet, 2nd tab," POST 1). NOT a playthrough; no
die-rolls, no GM narration. **7 posts / 1 chunk** (chunk-001, all 7 covered; source CSV ~2 KB).
**May 2022** (politicslounge topic 1245; CE2's reply timestamped 5/6/2022). **Authors:** **@vcczar**
(tier-1; built the generator, POSTs 1/4) + **@ConservativeElector2** (the design-insight commenter,
POST 3) + Ted/@MrPotatoTed (the @-target, POST 1). POSTs 6 ("This is awesome!") = unattributed praise.

**★ Why it matters / placement in the SC cluster:** this is the **missing MIDDLE** of the SC-case
provenance chain. `07fa6116` (b41) = the GENERATOR IDEA + rationale (MrPotatoTed's "random name v
random name," vcczar's "generator + ~50 specific cases"). `964b8857`/`aa227625` = the HAND-AUTHORED
docket + Landmark scoring. **THIS thread is the generator's first ACTUAL SCHEMA + sample output** —
it resolves the abstract "#270 generator" into a concrete **8-column case row** with a per-side
effect payload. All deltas map to **EXISTING #270** (SC-case content system + generator); this is its
strongest concrete spec for the *generated* (vs authored) branch.

---

## ★ 1. The SC CASE GENERATOR row schema (the load-bearing artifact)

Each generated case = **one row, 8 fields**, two symmetric ruling sides (Yea / Nay), each side
carrying **(a) a 25%-chance METER modification + (b) an interest/ideology-GROUP reward**:

```
Part A  | v. | Part B            | Points | Yea-mod (25% chance ± METER) | Yea-group | Nay-mod (25% chance ± METER) | Nay-group
Orr     | v. | City of Philadelphia | 200 | 25% + rev/budg               | Trads     | 25% − honest gov             | LW Pop       (POST 1)
Sheng   | v. | Bao to Seitan        | 200 | 25% − quality of life        | Libs      | 25% + rev/budg               | Civil Rights (POST 2)
Assis   | v. | Dunder Mifflin       | 200 | 25% + quality of life        | WallStreet| 25% + honest gov             | Labor Unions (POST 5)
Hoar    | v. | Ghostbusters         | 100 | 25% + rev/budg               | WallStreet| 25% + honest gov             | Reformists   (POST 7)
```

Mechanic decomposed:
- **Case NAME = procedural `<Part A> v. <Part B>`** — random surname/entity vs random surname/entity.
  Names are **random and often nonsensical / pop-culture** ("Bao to Seitan," "Dunder Mifflin,"
  "Ghostbusters"). (This is the name-DB composition #270/`#115` reuses; `07fa6116` POST 25's origin
  form was bare "random name v random name" — same here, NOT yet resolved to `<person> v. <state>`,
  though "City of Philadelphia" hints at the entity-side variety.)
- **POINTS = 100 or 200** (a per-case weight/stake; the only two values observed). NEW datum vs #270
  as logged — the authored `964b8857` cases have no points; **points are a generator-branch field.**
- **Per ruling side (Yea AND Nay independently):**
  - **(a) a METER MODIFICATION at a flat 25% CHANCE**, signed ±, on a named meter:
    **`rev/budg` (= revenue), `honest gov` (= honest), `quality of life` (= quality)** — i.e. the
    ruling MIGHT (25%) move a national meter up or down. Only 3 meters appear in the sample; the meter
    pool is presumably wider.
  - **(b) an INTEREST/IDEOLOGY-GROUP REWARD** (the group that *wins* if that side is chosen):
    `Trads`, `LW Pop`, `Libs`, `Civil Rights`, `Wall Street`, `Labor Unions`, `Reformists`. This is a
    **mix of ideology-bucket labels** (Trads / LW Pop / Libs) and **interest-card groups** (Wall
    Street / Civil Rights / Labor Unions / Reformists) — see §3 for the code mapping.

## ★ 2. The DESIGN GOAL — conflicting interests on the SAME side of the aisle (POST 3, vcczar agrees POST 4)

The praised design insight, the reason the per-side group rewards are independent random draws:

- **★ ConservativeElector2 (POST 3):** *"I especially like that you have to make sacrifices here.
  Arguably left-wingers favor both Libs and Civil Rights, but you have to decide in a way besides
  liberal vs. conservative. Amazing direction to have **conflicting interests on one side of the aisle**
  as well!"* — i.e. the *Sheng v. Bao* row (POST 2) makes **Yea reward Libs but Nay reward Civil
  Rights** (both left-coded), so a left player must **trade off two allied groups**, not just pick
  left-vs-right. This is the **deliberate generator design intent**: produce intra-coalition dilemmas.
- **★ vcczar's caveat (POST 4):** *"Yeah, well, **it's totally random. So some cases probably won't
  make sense.**"* — the same-side-conflict EMERGES from pure randomness; vcczar explicitly accepts a
  **content-quality cost**: random name + random meter + random group ⇒ some rows are incoherent (a
  nonsensical name and/or a group pairing that doesn't track the "case"). This is the
  **random-generation vs curated-coherence tension** (relevant to content-quality / authored-docket
  combo — `07fa6116` POST 28's "generator + ~50 specific cases" exists precisely to backstop this).

---

## 3. ★ Shipped reality — CODE-VERIFIED (`src/` HEAD 2026-06-29)

The PRIMITIVES the generator needs mostly EXIST; the GENERATOR and the per-side case payload DON'T.

**The court phase = bare coin-flip; the case payload is dead.**
- `runPhase_2_5_3_Court` (`src/engine/phaseRunners.ts:3397-3415`): **50%/turn** any case fires; picks
  `title` from **4 hardcoded generic strings** (`phaseRunners.ts:3399-3404`, e.g. "Interstate commerce
  dispute"); rules `conservative`/`liberal` by **raw justice-ideology HEADCOUNT** (`:3407-3409`);
  nudges `partyPreference` by **±0.1** (`:3412-3413`). **No name generator, no points, no Yea/Nay
  payload, no meter move, no interest-group reward.** Phase 2.5.3 is the SC slot (`src/phases.ts:27`),
  skipped pre-Constitution (`phases.ts:92-93`) — confirms the prior-batch "token SC phase" finding.
- **`SupremeCourtCase` type EXISTS but is unused** (`src/types.ts:1548-1556`): `{ id, year, title,
  description, decided, ruling?: 'majority'|'minority', effect?: EraEventResponseEffect }`. It has a
  **single `effect?`** (no Yea/Nay split, no `points`, no 25%-chance modifier). `pendingCourtCases`
  (`types.ts:1587`) is **initialized to `[]` in both scenarios** (`scenario1772.ts:95`,
  `scenario1856.ts:175`) and **never read or written** — `runPhase_2_5_3_Court` ignores it entirely.
  So the case type is a **dead stub**; the generator (#270) is **0% shipped** (re-confirms the
  `07fa6116`/`964b8857`/`aa227625`/`a863421c` cluster null).

**The METERS in the thread = ALL real meters** (`NationalMeters`, `src/types.ts:1399-1407`):
`{ revenue, economic, military, domestic, honest, quality, planet }`. Mapping confirmed:
**`rev/budg` → `revenue`**, **`honest gov` → `honest`**, **`quality of life` → `quality`**. The meter
system ships and is live (era events / bill templates write it via `meters?`). The generator's
25%-chance ± meter move would just be a probabilistic write to existing meters.

**The INTEREST/IDEOLOGY GROUPS = mostly real, but a SPLIT taxonomy:**
- `InterestCardId` (`types.ts:310-314`) includes **`WallStreet`, `CivilRights`, `Reformers`, `Workers`**
  → covers the thread's **Wall Street, Civil Rights, Reformists, Labor Unions** (Labor Unions≈`Workers`
  / lobby `UrbanLabor`; Reformists≈`Reformers`). `InterestGroupScores` (`types.ts:1411-1413`,
  game-state field `interestGroups`, `types.ts:1572`) is the live score map these write into.
- **`Trads`, `LW Pop`, `Libs` are IDEOLOGY labels, not interest cards** — they correspond to the
  `Ideology` 7-point enum (`Traditionalist`, `LW Populist`, `Liberal`; `types.ts:6-12`), surfaced as
  the **`enthusiasm` system** (per-ideology party mood, `types.ts:1415-1418`). So the thread mixes TWO
  reward channels: **interest-group score** (Wall St / Civil Rights / Labor / Reformists) AND
  **ideology enthusiasm** (Trads / LW Pop / Libs). A faithful generator reward must target BOTH.
- **The payload shape ALREADY ships:** `EraEventResponseEffect` (`types.ts:1448-1457`) has BOTH
  **`meters?: Partial<NationalMeters>`** AND **`interestGroups?: {id;delta}[]`** AND
  **`enthusiasm?: {ideology;party;delta}[]`** — exactly the three reward kinds a generated case row
  needs. It's used live by bill templates (`phaseRunners.ts:3421-3428`) and era events. **The
  generator's per-side payload is buildable from this existing effect type** — what's missing is (a)
  the GENERATOR that synthesizes rows, (b) a **Yea/Nay (two-effect) case shape** (current
  `SupremeCourtCase.effect?` is single), (c) a **`points`** field, and (d) the **25%-chance** wrapper
  on the meter half of the payload.

**Net:** meters ✅ ship, interest-group + enthusiasm reward channels ✅ ship, the effect-payload type
✅ ships — but the **SC case GENERATOR, the points field, the Yea/Nay dual-payload case, and the
per-ruling 25%-chance meter modifier all 0% shipped**; the court phase remains a 4-string coin-flip
and `pendingCourtCases`/`SupremeCourtCase.effect` are dead.

---

## Candidate deltas for consolidation (map to EXISTING #270 — DO NOT assign new numbers)

Ordered by load-bearing-ness. This thread is the **concrete SCHEMA spec** for #270's generated branch.

1. **★ SC CASE GENERATOR row SCHEMA → #270 (the concrete spec).** First actual generator output:
   case = **`<Part A> v. <Part B>` (procedural name) + POINTS (100/200) + Yea{25%-chance ±meter,
   group} + Nay{25%-chance ±meter, group}`**. Adds to #270 (whose provenance was idea-level
   `07fa6116` + authored-level `964b8857`): (a) the **8-column row shape**, (b) a **`points`
   weight** field (NEW — authored cases lack it), (c) the **per-ruling-side dual structure** (Yea AND
   Nay each carry their own effect — current `SupremeCourtCase.effect?` is single), (d) the
   **25%-CHANCE meter-modification** wrapper (a probabilistic effect half, NEW mechanic). Source:
   `f8354a70` POST 1, 2, 5, 7.

2. **★ Same-side-of-the-aisle CONFLICTING-INTEREST design goal → #270 (design rationale).** The
   generator deliberately makes a single case reward two ALLIED groups on opposite rulings (Yea→Libs
   vs Nay→Civil Rights), forcing intra-coalition trade-offs "besides liberal vs. conservative" (CE2
   POST 3, vcczar agrees POST 4). This is the **design INTENT behind the independent per-side group
   draw** — the reason the schema is two symmetric payloads. Source: `f8354a70` POST 2, 3, 4.

3. **★ Random-generation vs curated-coherence TENSION → #270 (+ content-quality / #221 family).**
   vcczar accepts that "**it's totally random, so some cases probably won't make sense**" (POST 4):
   random names ("Bao to Seitan," "Ghostbusters") + random meter + random group ⇒ incoherent rows.
   This is the **explicit content-quality cost** of the generator, and the design reason for the
   `07fa6116` POST 28 **"generator + ~50 SPECIFIC authored cases"** combo (curated cases backstop the
   nonsensical generated ones). Attach to the existing content-generation/coherence concern. Source:
   `f8354a70` POST 4.

4. **Meter / interest-group / enthusiasm REWARD-CHANNEL mapping → #270 (build-bridge, corroborating).**
   Code-confirms the generator's vocabulary maps onto SHIPPED primitives: meters `rev/budg→revenue,
   honest gov→honest, quality of life→quality` (`types.ts:1399-1407`); group rewards split across
   **interest-card scores** (Wall St/Civil Rights/Labor≈Workers/Reformists≈Reformers,
   `types.ts:310-314`) AND **ideology ENTHUSIASM** (Trads/LW Pop/Libs, `types.ts:6-12,1415-1418`); and
   the **`EraEventResponseEffect` payload (`types.ts:1448-1457`) already supports meters +
   interestGroups + enthusiasm** — i.e. #270's per-side payload is buildable on existing types. The
   missing pieces are the GENERATOR, a Yea/Nay dual-effect case shape, `points`, and the 25%-chance
   wrapper. Corroborating + reduces #270's build cost estimate. Source: codebase verify.

5. **Shipped-court null re-confirmation → #270/#52/#249/#218.** Re-verified: court =
   `phaseRunners.ts:3397-3415` coin-flip on 4 hardcoded strings by justice headcount, ±0.1
   `partyPreference`; `SupremeCourtCase` (`types.ts:1548`) + `pendingCourtCases` (`:1587`, seeded `[]`)
   are dead. SC-case generator system 0% shipped; SC remains a token phase. Corroborating. Source:
   codebase verify.

### Open questions (for the human, via consolidation)
- **Two reward channels — intended, or label drift?** The sample mixes interest-card groups (Wall St,
  Civil Rights, Labor, Reformists) with ideology labels (Trads, LW Pop, Libs). Does a generated case
  reward an **interest-group score**, an **ideology enthusiasm bump**, or **either at random**? (Code
  has both channels but they're distinct systems.)
- **Points semantics.** What do the 100/200 points DO — a stake the player wins/loses, a Landmark/
  importance weight (cf. `aa227625` Landmark scoring), or a difficulty/score for a court mini-game?
  Unspecified in-thread.
- **±-direction / 25%-chance scope.** Is the 25% chance ONLY on the meter half (group reward is
  guaranteed)? The sample shows the group with no probability, the meter always gated at 25% — confirm
  the group reward is deterministic and only the meter move is probabilistic.
- **Name composition.** Pure `name v. name` here (this thread + `07fa6116` POST 25) vs #270's later
  `<person> v. <state>` ("City of Philadelphia" is the only entity-side hint). Confirm final form.

### Provenance notes
- Single chunk; all 7 posts read. Tiny artifact thread (~2 KB): POSTs 1/2/5/7 = the four sample case
  rows; POST 3 = CE2's design insight; POST 4 = vcczar's agreement + "totally random" caveat; POST 6 =
  unattributed praise. Cite POST 1 for the schema/first row, POST 3+4 for the same-side-conflict design
  goal + randomness caveat.
- **Sibling SC-cluster digests** (same #270 provenance): `07fa6116` (generator IDEA + rationale, b41),
  `964b8857` (authored Era-of-Future docket), `aa227625` (Landmark scoring), `a863421c` (AMPU Courts).
  THIS thread is the generator's **first concrete SCHEMA + sample output** — the implementation middle
  between the idea and the authored cases.
- Codebase verified at `src/` HEAD 2026-06-29: court phase `phaseRunners.ts:3397-3415`;
  `SupremeCourtCase` `types.ts:1548-1556`; `pendingCourtCases` `types.ts:1587` seeded `[]`
  (`scenario1772.ts:95`, `scenario1856.ts:175`), no reader/writer; `NationalMeters` `types.ts:1399-1407`;
  `InterestCardId`/`LobbyCardId` `types.ts:310-320`; `Ideology` `types.ts:6-12`; `enthusiasm`
  `types.ts:1415-1418`; `EraEventResponseEffect` (meters+interestGroups+enthusiasm) `types.ts:1448-1457`.
