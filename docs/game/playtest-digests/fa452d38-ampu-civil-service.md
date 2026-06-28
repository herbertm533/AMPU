# Digest — fa452d38-ampu-civil-service ("AMPU Civil Service")

**Type:** CONTENT-AUTHORING thread (Apr 2022), **NOT a playthrough**. 13 posts /
1 chunk (chunk-001, all covered; source CSV ~9.0 KB). Opener: **vcczar** (tier-1)
mass-tagging the community for the **next policy group = Civil Service**; replies
are community content ideas + a few **GM rulings by vcczar** (the load-bearing
posts). MrPotatoTed (Ted) tier-1; others (ShortKing, Rezi, jvikings1, Mark_W…)
contributors. **Why it matters:** this is the **raw authoring source for the
Civil Service policy genre** — one fully-tagged instance of the **#237 stateful
policy-genre framework** populating the **#221 content primitives**
(Legis-Prop `L-` / Pres-Action `P-` / Gov-Action `G-`) with **#248 subtype** =
Civil Service, **heavily #258 prereq-gated**, and — uniquely in the batch — it
makes **federal department/office LIFECYCLE the headline content** (create →
split → elevate → revert → merge → abolish), which is the data+rules model behind
**#66's "offices created by law."** Pure design intent — content primitives are
**0% shipped**; office lifecycle is **0% shipped** (`cabinetSeatsForYear` is a
hardcoded year-keyed function; `OfficeType` is a closed 23-value union — both
verified this run).

---

## The artifact — Civil Service as a #237 policy genre (tagged form)

POST 1 is the master list, **fully schema-tagged**: every row carries a
**mechanism prefix** (`L-`=Legislation, `P-`=Presidential Action, `G-`=Governor
Action) + an **era-band abbreviation**, partitioned into a **no-prereq block**
followed by **prereq-gated blocks** (each headed by a game-state predicate, then
its conditional rows). Counts are approximate — SHAPE captured, not every row
transcribed (see chunk for the full list).

- **Legis-Prop (`L-`)** — dominant primitive (~40 rows in POST 1). Mostly
  **"Create Dept of X"** (Navy, Justice, Energy, Manufacturing, Environment &
  Climate, Media & Propaganda, Religions, Tech & Innov., Peace & Humanit.,
  Interior, Homeland Sec, Commerce & Labor, HEW, HUD, Transportation, …) plus
  institutional offices (Congressional leadership posts; Attorney General; OMB;
  EOP; Council of Economic Advisors) and merit/structure laws (Hatch Act;
  "Require Most Gov't Positions Appointed by Merit not Party Loyalty" = Pendleton;
  Abolish-US-Senate amendment).
- **Pres-Action (`P-`)** — ~12 rows. Spoils-system / staffing actions (Enact
  Rotation in Office, Kitchen Cabinet, **Spoils System**, Fill via party
  loyalists), WH offices (WH Chief of Staff, EOP, CEA, National Sec Advisor,
  Office of Faith-Based Initiative), and **diplomatic posts** (Minister of
  Prussia/Russia/China/Japan, Ambassador to Israel, Minister of Indian
  Sovereignty) — see genre-boundary note below.
- **Gov-Action (`G-`)** — only **2 rows** ("Fill State Offices w/ Party
  Loyalists" G-Dem; "Req Appointees to Sudden Vacancy be Same Party as Last
  Officer" G-Fed). → directly seeds vcczar's ASK for **more Civil-Service Gov
  Actions** (POST 1, closing line).

### The `*-Ind-Default` baseline pattern (confirms #237 baseline)
Two "nothing active" baselines, tagged **`L-Ind-Default`** under `If No … `
prereq headers: **"No Federal Civil Service Legislation"** (`If No Civil Service
Legis`) and **"No Attorney General"** (`If No Attorney General`). Same
baseline-is-a-game-state design as Business/Labor and Civil Rights; `Ind` =
Independence-era genesis band where the default is seeded.

### Opposed / merit-vs-spoils axis (confirms #221 option-set)
Deliberate opposed pair on the merit↔patronage axis: **Spoils System (P-Dem)** /
"Fill positions by party loyalty" vs **"Require Most Gov't Positions by Merit"
(L-Gild = Pendleton)**. `Spoils System (P-Dem)` is itself **gated** behind `Law
Requiring Offices Awarded by Merit not Active` — i.e. the merit law and the
spoils action are mutually-exclusive game states.

---

## ★ HEADLINE: department/office LIFECYCLE as content (cross-ref #66)

The thread's distinctive contribution: federal departments/offices are not a
fixed list but a **lifecycle managed by content rows**. The full verb set
appears in POST 1 (+ vcczar's POST-4 ruling):

| Lifecycle verb | In-thread instance (verbatim-ish) | Prereq gate |
|---|---|---|
| **create** | "Create Dept of Justice/Navy/Energy/…"; "Establish Office of Att Gen" | mostly none / era-band |
| **split** | "Split Dept of Commerce & Labor into Two Depts" (L-Prog); "Split Dept of Education and Health into two Depts" (L-Neo) | parent dept must exist |
| **elevate to cabinet** | "Elevate PM Gen to Cabinet-Level" (L-Dem); "Elevate Dept of VA to cabinet-level" (L-Neo) | the independent agency must exist |
| **revert to independent agency** | "Revert Dept of Postal Service to Independent Agency" (L-Nuc) | Postal Dept exists |
| **merge** | "Merge Sec of War & Navy into new Sec of Def" | both Sec of War AND Sec of Navy exist |
| **abolish / repeal** | POST 3 (ShortKing): abolish Education/Commerce/Energy à la Rick Perry → **POST 4 (vcczar ruling):** *"That can happen by repealing the action or law that establishes the departments. **Some can't be removed however.**"* POST 6 (Rezi): *"Or you can prevent it from being proposed too."* | the creating law/action must be repealable |

**Implications for #66 (sharpen, don't re-find):**
- The cabinet is **not a fixed seat list** — it **grows well beyond** the current
  7 (POST 1 enumerates ~20 distinct departments/offices creatable by law).
- **Abolition = repeal the creating row** (vcczar's model), with a **"some can't
  be removed" undeletable flag** on certain offices — a NEW rule wrinkle #66's
  "offices created by law" should carry (the holdover/term ruleset #66 already has
  doesn't cover create/split/merge/abolish/elevate/revert state transitions).
- Confirms the **Continental-Congress → Confederation → Constitutional**
  founding sequence as content (`Rev War Over & Articles of Confed Signed` gates
  "Create Confederation Cabinet / Sec of State / Post Office / Treasury / War /
  Min to GB"; `Independence Declared` gates Min to France/Spain).

---

## Confirmation / appointment subsystem tie-ins

- **POST 13 (idea):** establish **Office of Personnel Management** → "really
  stringent background checks" → **fewer 'controversial' nominees accepted** —
  an OPM office that buffs the confirmation subsystem against the
  Controversial-nominee mechanic. (Cross-ref the appointments/confirmation
  subsystem and Controversial-nominee handling.)
- **POST 9-10 (ShortKing Q → vcczar ruling):** WH **Chief of Staff** "works in
  **CONJUNCTION** with Key Advisor, not replace" — Karl Rove was key advisor (not
  CoS); Bannon was Trump's initial key advisor. → CoS is an ADDED office, not a
  reskin of the existing Key-Advisor slot. (Cross-ref #66, which already grants CoS
  via exec action.)

---

## Diplomatic-post overlap (genre-boundary question)

Ministers/Ambassadors to specific nations are authored **here** (Prussia, Russia,
China, Japan, GB, France, Spain, Israel, Indian Sovereignty), but POST 1's opener
notes content "might be in other groups" and these **arguably belong in
Diplomacy** (a sibling batch-39 thread is Diplomacy). Boundary signals:

- **POST 7 (community):** argues for Min to Netherlands/Holland + Portugal
  (colonies in W. Hemisphere; trade; active war with Portugal over Brazil) — but
  explicitly "don't want 194 Ambassador positions."
- **★ Content-shape variant worth capturing (POST 7):** instead of naming every
  nation, have **1–5 random UNNAMED "minor-country" Minister posts** — a politician
  posted there **gains XP only**; minor nations **can't be asked for loans/troops**.
  (A procedural/abstracted diplomatic-post primitive vs the named-nation rows.)
- → **Genre-boundary open question:** are diplomatic posts a Civil-Service genre row
  or a Diplomacy genre row? The named-nation Ministers also tie into the
  loan/troop-request mechanic, suggesting they live closer to Diplomacy.

---

## Designer ASKs (coverage gaps — cross-ref #262)

vcczar's explicit ASK (POST 1, opener + closer): **needs more (1) Civil Service
Gov Actions** (only 2 authored — the thinnest primitive in this genre) **and
(2) Era-of-the-Future civil service.** Community floats (candidate content, not
ruled on):
- **Future departments (POST 2, 8):** Dept of **Space** (Future), Dept of **the
  Internet** (~Era of Terror), Dept of **Sports/Arts/Culture** (esp. authoritarian
  regimes — Soviet sports prestige).
- **Future / authoritarian civil-service actions:** "Require all Federal Employees
  to Undergo Human-AI Augmentation" (P-Fut, gated on `Human-AI Augmentation
  Exists`); "Government-sponsored Youth League to Promote Party" (L-Norm, gated on
  `Communist/Fascist/Theocratic 3rd Party is now Major`); civil-service education
  loan forgiveness; civil-service credit toward citizenship (military-based,
  Starship-Troopers flavor) (POST 8).
- **Spoils-era events (POST 11):** Blacks appointed to more positions under spoils
  (benefits Stalwart GOPs, angers Copperhead Dems / Half-Breed Republicans) —
  *Event*; **incumbent president assassination attempt if he pushes the Pendleton
  merit bill** — *Event* (the Garfield case). → `S-` scripted-event tie-ins to the
  merit/spoils axis.
- **POST 12:** Postal Service Sunday delivery (historical) → civil service
  open-on-Sundays content; theocrats-in-power → compel businesses to close Sundays
  (flagged as a different area = Business/Labor or Religion genre).

---

## Prereq vocabulary observed (corroborates #258)

Strong second witness for #258's predicate field. Distinct predicate CLASSES seen
gating Civil-Service rows (each a kind the shipped era-event `Predicate` enum
cannot express):

| Predicate class | Verbatim `Prereq:` headers in POST 1 |
|---|---|
| **no-policy / baseline** | If No Civil Service Legis; If No Attorney General |
| **institution-exists** | Dept of Commerce & Labor exist; Dept of HEW exists; Dept of Postal Service Exists; Independent Dept of VA exists; National Security Act is active |
| **multi-office compound** | Sec of War **and** Sec of Navy (both exist → merge) |
| **prior-event-occurred** | Rev War Over & Articles of Confed Signed; Independence Declared; Human-AI Augmentation Exists |
| **diplomatic-state flag** | Israel is Recognized; Trade Open with China; Trade Open with Japan; Indian Sovereignty Exists |
| **3rd-party-status** | Communist/Fascist/Theocratic 3rd Parties are now a Major Party |
| **anti-prereq / not-yet** | Not Already Created via Legis Prop / via Pres Action (EOP & CEA — the L↔P mutual exclusion); Law Requiring Offices Awarded by Merit **not** Active (gates Spoils System) |
| **scenario-mode** | **For Constitutional Convention Only** (gates "Establish US Senate & Reps / Unicameral / Maintain Continental Congress system") |

★ Note the **`Not Already Created via Legis Prop` / `Not Already Created via Pres
Action`** pair: EOP and CEA can each be created by EITHER an `L-` or a `P-` row,
and creating one path disables the other — a **cross-primitive mutual-exclusion
prereq** (an L and a P row referencing the same office state). New schema wrinkle
for #258 (predicate must reference "was this office created, by any primitive").

---

## Shipped-vs-designed (engine facts — verified this run)

- **Office LIFECYCLE = 0% shipped.** `cabinetSeatsForYear(year)` (`types.ts:1196-1208`)
  is a **hardcoded year-keyed function** returning a fixed `OfficeType[]`
  (max 7 seats: State/Treasury/War, +Navy≥1798, +AG, +Interior≥1849,
  +PMG≥1829). **`OfficeType` is a CLOSED 23-value union** (`types.ts:1111-1133`) —
  no Commerce/Justice/Energy/HEW/HUD/Transportation/DHS/etc., **no Minister-per-
  nation type** (only a generic `Ambassador`). There is **no create / split /
  merge / abolish / elevate / revert machinery, no "department" entity as data,
  no undeletable flag.** This is exactly what #66 wants generalized.
- **No `subtype` / no prereq field on `Legislation`** (`types.ts:1506-1514`) —
  only the 4-value `committee`. The Civil-Service #248 subtype and every `Prereq:`
  header above have no engine home. A serializable `Predicate` tree +
  `evalPredicate` ship (`types.ts:~1487-1497`) but are bound to era events only
  and lack the institution-exists / 3rd-party-status / cross-primitive-creation /
  scenario-mode / diplomatic-flag classes this genre needs (the #258 reuse-and-
  extend path).
- **Pres-Action & Gov-Action primitives = designed-only (#221, 0% shipped)** — the
  ~12 `P-` and 2 `G-` rows have no type/catalog.
- **OPM / confirmation buff, Spoils↔Merit axis, CoS-in-conjunction-with-Key-
  Advisor** — all designed-only; no representation.

→ Net: pure design provenance for the Civil Service genre. Adds NO shipped
behavior. Its UNIQUE contribution vs sibling content threads is the **office/
department LIFECYCLE verb set** (the concrete data+rules model behind #66) and a
**second strong witness for #258's prereq field** (new predicate classes:
institution-exists, cross-primitive-creation, scenario-mode, diplomatic-state-flag,
3rd-party-status).

---

## Candidate deltas for consolidation
*(Map to EXISTING gap IDs; consolidation agent owns the gap-log write. NO new
numbers assigned.)*

- **#66 (offices created by law / cabinet beyond fixed seat list)** — CORROBORATE
  + **SHARPEN with the LIFECYCLE verb set.** This thread is the data+rules model:
  create → split (Commerce&Labor→2; HEW→2) → elevate-to-cabinet (PMG; Dept of VA)
  → revert-to-independent-agency (Postal) → merge (War+Navy→Defense) → **abolish =
  repeal the creating law/action, with a "some can't be removed" UNDELETABLE
  flag** (vcczar ruling). Cabinet grows to ~20 departments/offices. NEW wrinkles
  #66 lacks: the 6 lifecycle state-transitions, the undeletable flag, and
  Minister-per-nation office typing (today only generic `Ambassador`). Engine
  verified: `cabinetSeatsForYear` hardcoded/year-keyed; `OfficeType` closed
  23-value union. Source: POST 1, 3-6, 9-10.
- **#258 (prereq / predicate-gated availability field)** — CORROBORATE STRONGLY
  (second headline witness). Civil Service is **heavily prereq-gated**; adds NEW
  predicate classes to #258's vocabulary: **institution-exists** (Dept-X exists,
  National Security Act active), **multi-office compound** (War AND Navy → merge),
  **cross-primitive mutual-exclusion** ("Not Already Created via Legis Prop / via
  Pres Action" — EOP/CEA), **scenario-mode** (Constitutional Convention Only),
  **diplomatic-state flag** (Israel Recognized; Trade Open w/ China/Japan),
  **3rd-party-status**, **anti-prereq** (merit-law NOT active → Spoils). Source:
  POST 1.
- **#237 (stateful policy-genre framework)** — CORROBORATE. Civil Service is a
  concrete fully-tagged genre instance (mechanism prefix + era band + prereq
  blocks + `L-Ind-Default` baselines: "No Federal Civil Service Legislation",
  "No Attorney General"). Merit↔Spoils opposed/mutually-exclusive pair. Source:
  POST 1.
- **#221 (content primitives)** — CORROBORATE. Populates L (~40) / P (~12) /
  G (2); the **Gov-Action primitive is the thinnest** (2 rows). Option-set axis
  (Spoils-action vs Merit-law). Source: POST 1.
- **#248 (legis-proposal subtype taxonomy)** — CORROBORATE. Implies a **Civil
  Service** subtype value applied across L/P/G primitives. Source: POST 1.
- **#262 (content-coverage / per-primitive balance)** — CORROBORATE. vcczar's
  explicit ASK: **more Civil-Service Gov Actions** (only 2 authored — per-primitive
  hole) and **Era-of-Future civil service** (per-band hole; floated: Dept of Space
  / Internet / Sports-Arts-Culture). Source: POST 1, 2, 8.
- **#206 (Era of the Future doubly unbuilt)** — CORROBORATE. Future-band
  civil-service content is wanted, not authored (Human-AI-augmentation requirement
  is the only `P-Fut` row). Source: POST 1, 2, 8.
- **Confirmation / appointments subsystem (map to the appointments-confirmation
  cluster + Controversial-nominee mechanic — flag to consolidation for the right
  gap ID)** — NEW datum: **OPM office → stringent background checks → fewer
  Controversial nominees accepted** (POST 13); **CoS works in conjunction with
  Key Advisor, not replacing it** (vcczar ruling, POST 9-10). Cross-ref #66.
- **Genre-boundary / Diplomacy overlap (OPEN QUESTION — defer to the Diplomacy
  sibling thread in batch 39)** — diplomatic Minister/Ambassador-per-nation posts
  authored here "arguably belong in Diplomacy"; they tie into the loan/troop-request
  mechanic. **Content-shape variant to capture:** **1–5 random unnamed minor-country
  Minister posts (XP-only, can't be asked for loans/troops)** as an abstracted
  alternative to naming all nations (POST 7). Likely folds into #237/#248 with a
  "Diplomacy" subtype + the Minister-office typing under #66.
- **Spoils/merit scripted-event tie-ins (map to #221 scripted-event primitive /
  #258 effect-gating)** — POST 11: spoils→Black appointments faction-swing *Event*;
  president-assassination-risk *Event* if he pushes the Pendleton merit bill
  (Garfield). Source: POST 11.

---

### Provenance notes
- Single chunk; all 13 posts read. POST 1 (vcczar's fully-tagged master list +
  the genre ASK) is the load-bearing datum; vcczar's **GM rulings** are POST 4
  (abolish = repeal creating law; "some can't be removed") and POST 10 (CoS in
  conjunction with Key Advisor). POSTs 2,3,5-9,11-13 are community content adds /
  questions (no accept/reject log beyond the two rulings).
- Engine facts VERIFIED against `src/types.ts` this run: `cabinetSeatsForYear`
  (lines 1196-1208, hardcoded year-keyed, max 7 seats); `OfficeType` (lines
  1111-1133, closed 23-value union, generic `Ambassador` only, no department
  entity); `Legislation` (lines 1506-1514, 4-value `committee`, no `subtype`/
  prereq); `Predicate`+`evalPredicate` (~1487-1497, era-event-only). Other
  shipped-status claims (#221/#237/#248/#262 0% shipped) carried from KB.
