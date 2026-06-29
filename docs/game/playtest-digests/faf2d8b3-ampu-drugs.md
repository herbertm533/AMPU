# Digest — "AMPU Drugs" (`faf2d8b3`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (topic 1185, by **@vcczar**, tier-1
designer), **NOT a playthrough.** A policy-genre CONTENT drop for the **Drugs** subtype —
the latest in the policy-genre sweep (sibling of b46 `9f2ab25f-environment`, b47
`1bf19872-taxation`, plus immigration / education / civil-rights / agriculture /
welfare / banking / regulations / currency / and the b47–49 prereq-tree genres
Currency / Credit-Debt / Bailouts). **9 posts / 1 chunk** (chunk-001, all covered).
Source CSV ~3.4 KB. `wc -l chunk-001.md = 149`. `wc -l` of this digest noted at end.
**Why it matters:** adds the **Drugs** policy genre to the corpus and **CORROBORATES**
the framework (#221 / #237 / #248 / #206 / #66 / #262). Content primitives remain
**0% shipped** (verified this run — no drug/prohibition/marijuana content exists in the build).

> This is **batch 49, DIGEST-ONLY** — one of five parallel digest writers. Writes ONLY this
> file; touches no living doc. **No historian ran this batch**; era framing per
> `docs/game/historical-context.md` (cross-era polarity map + the Prohibition / War-on-Drugs
> anchors cited inline below). All content here is an **authoring SNAPSHOT, not designer-ratified final.**

---

## ★ FORMAT CHANGE — note vs. the b47/b48 prereq-trees (POST 1, lines 10–14)

Unlike the immediately-prior prereq-structured trees (Currency / Credit-Debt / Bailouts),
vcczar here **reverts to the simpler 3-partition flat form** and **explicitly DROPS eras +
prereqs "to save time"**:

> *"Here are the drug policies. I also have a new format. I'm not going to put the eras and
> pre-reqs to save time doing these posts. I've also organized them by Legis Prop, Gov Action,
> and Pres Action, which might be more user-friendly for you all."* — POST 1

So this genre is captured in the **UNTAGGED 3-partition form** (like b46 Environment /
b47 Taxation), **not** the tagged prereq-tree form (b48 Currency etc.). **Two authoring
styles now coexist in the corpus** — the schema-tagging / era-band / prereq pass is still
deferred for this genre. Era bands + prereqs below are **IMPLIED by content**, not authored fields.

vcczar's **explicit ask** (POST 1, line 12): *"What I need for drug policies are definitely
some **Era of the Future** drug policies. **More Gov Actions** too. Also open to other ideas."*
→ the recurring thin-primitive / thin-Future holes again (#206 / #221-G / #262).

---

## The Drugs policy genre (the core artifact, POST 1) — UNTAGGED 3-partition form

Three flat header partitions, no schema tags. Counts: **Legis Prop ~14 · Pres Action 4 · Gov Action 2.**

### Legis Props (POST 1, lines 18–78) — ~14 rows, verbatim, grouped for skimmability

- **State-vs-federal authority axis:** **Leave Drug Policies to the States** (the federalism
  pole — the genre's main devolution row; cf. dry-states discussion POSTs 4/6).
- **Marijuana opposed pair (#248):** **Federal Legalization of Marijuana** ↔ **Federal
  Criminalization of Marijuana**.
- **Hard-drugs opposed pair (#248):** **Federal Legalization of Hard Drugs** ↔ **Federal
  Criminalization of Hard Drugs**.
- **Tobacco (criminalization pole):** **Criminalize Tobacco** (anti-pole to Gov "Strict Tobacco
  Laws"; community adds "Ban Tobacco", POST 5).
- **Drug-court / treatment institutions (#66-adjacent):** **Establish Federal Drug Courts** ·
  **Subsidize treatment and research to combat opioid addiction** (the affirmative public-health pole).
- **★ The Prohibition amendment pair — the genre's marquee #66 / #248 set:**
  - **18th Amendment** (institutes Prohibition) ↔ **21st Amendment** (repeals it) — a real
    amendment↔repeal pair, **the cleanest historical #248 option-set in the whole genre.**
  - **Legalization of Alcohol Amendment** (a third worded form of the repeal/legalize pole —
    note this duplicates the *function* of the 21st; list is non-deduped at this stage).
  - **Increase Punishments for Violating Prohibition** (a #221 modifier-verb law on an active
    Prohibition regime — predicate-gated on "Prohibition is in force").
  - **Grant the Federal Gov't the legal authority to enforce Prohibition** (the enforcement-power
    enabler — Volstead-Act analog; gated on Prohibition existing).
- **Min-drinking-age opposed pair (#248 option-set):** **Min Drinking Age 18** ↔ **Min Drinking Age 21**.

### Pres Actions (POST 1, lines 80–96) — 4 rows

- **Institute War on Drugs** → **Expand War on Drugs** (a base-action + escalation modifier ladder, #221-P).
- **★ Apply War on Drugs to Video Game Addiction** — explicitly **(Future)** band (#206) — the
  satirical / future-extension of the War-on-Drugs frame to behavioral/digital "addiction".
- **Drug Czar** — a **law/exec-created standing institution / office** (#66; the Office of National
  Drug Control Policy director analog).

### Gov Actions (POST 1, lines 98–106) — 2 rows (vcczar flags this as the THIN primitive he wants grown)

- **Legalize Marijuana** (state-level legalize pole; mirrors the federal Legis row at state scope).
- **Strict Tobacco Laws** (state-level tobacco-restriction pole; anti-pole to community "Legalize"/light-touch).

---

## Community-suggested ADD-ONS (POSTs 2–9) — content inputs, all UNRATIFIED

**POST 2** (@ConservativeElector2-ish design note):
- **★ Psychedelics as a SEPARATE category** — *"Psychedelics should have their own separate
  category aside from 'hard drugs', which they should not really be considered a part of anymore."*
  → a **taxonomy request**: split the drug-class enum into ≥3 buckets (marijuana / hard drugs /
  **psychedelics**), not 2. Affects every legalize/criminalize/decriminalize/tax row (each may need
  a psychedelics variant). Re-asserted in POST 8 (decriminalize psychedelics) and POST 9.

**POST 3** — religious-ritual exemption:
- **Gov action: allow exemptions for drug use in accordance with religious rituals** —
  *"Could also set up a court case."* → ties the Drugs genre to the **courts / SCOTUS-case system**
  (cf. the `07fa6116` future-Supreme-Court-cases thread): a Gov Action that can trigger a
  free-exercise constitutional challenge. Real-world anchor: *Employment Division v. Smith* (1990,
  peyote) and RFRA / *Gonzales v. O Centro* (2006). [inference, no historian this batch]

**POST 4** (@ConservativeElector2) — **dry states** (state-default substrate):
- *"Three states—Kansas, Mississippi, and Tennessee—are entirely dry by default: counties
  specifically must authorize the sale of alcohol… Alabama specifically allows cities and counties
  to elect to go dry by public referendum."* → a request for **state-default drink-policy state**
  (default-dry KS/MS/TN; local-option AL) and a **county/local-option sub-state granularity**
  the build has no model for. Maps to the **state-vs-federal authority axis** + the gov-action layer.

**POST 5** — sin-policy add-ons (both behavioral-substance regulation):
- **Ban Tobacco** (reinforces Legis "Criminalize Tobacco") · **Tax / Don't Tax Drugs** (an opposed
  #248 fiscal pair — note this is the **same sin-tax cluster** the *Taxation* digest POST 5 raised:
  "Tax Marijuana / psychedelics / all drugs, same with fed leg" — cross-genre overlap) ·
  **Ban / Legalize E-Cigarettes** (an opposed pair; a *new substance class* — vaping — beyond the
  marijuana/hard/psychedelic/tobacco/alcohol set).

**POST 6** (@vcczar reply to POST 4):
- *"Prohibition and banning alcohol of a certain proof are both options for the states. Maybe I
  forgot to post it."* → confirms **state-level Prohibition + proof-cap Gov Actions** are *intended*
  to exist (already in vcczar's master list, omitted from this thread's paste) — i.e. the Gov-Action
  layer is **thicker in design than the 2 rows shown here**; this thread's paste is non-exhaustive.

**POST 7** — Future-band:
- **★ "virtual" drugs, aka mind sims, etc.** **(Future, #206)** — a new Future substance class
  (digital/neural intoxicants), parallel to POST 1's "War on Drugs for Video Game Addiction".
  Partly answers vcczar's Future ask.

**POST 8** (@themiddlepolitical) — Gov-Action decriminalization cluster (answers the "more Gov Actions" ask):
- **Gov: decriminalize all drugs** · **Gov: decriminalize psychedelics** (the latter re-asserting
  POST 2's separate-psychedelics taxonomy). Decriminalize = a *distinct middle pole* between
  legalize and criminalize (#248 three-way, not just two).

**POST 9** (@vcczar, quoting POST 8): *"Also legalize ofc"* — confirms **decriminalize AND legalize**
should both exist as Gov Actions → the genre wants the full **criminalize / decriminalize / legalize**
three-pole option-set at state scope, per substance class.

---

## Framework mapping (map to EXISTING IDs — do NOT assign new numbers)

- **#221 (3-primitive content system + scripted-event registry)** — CORROBORATE, still **0% shipped.**
  Populates all three primitives for a NEW genre (Drugs): **L≈14 / P=4 / G=2** (POST 1) + ~12
  community add-ons (POSTs 2–9). The **Institute → Expand War on Drugs** chain and **18th → Increase
  Punishments / Grant enforcement authority** sequence are clean #221 base-action + modifier-verb ladders.
  Source: POST 1–9.
- **#237 (stateful policy-genre framework)** — CORROBORATE + **EXTEND the genre count.** Drugs is a
  **further** concrete genre beyond the prior sweep, in UNTAGGED 3-partition form. Reinforces "the
  framework is open-ended, not complete at N genres."
- **#248 (opposed / option-set policy levers)** — **STRONGLY CORROBORATE; this genre is the richest
  #248 specimen so far.** Opposed pairs / option-sets present:
  - legalize ↔ criminalize for **marijuana** (Legis) and **hard drugs** (Legis);
  - **18th Amendment ↔ 21st Amendment** (the Prohibition institute↔repeal pair — also overlaps #66);
  - **Min Drinking Age 18 ↔ 21**;
  - **Tax ↔ Don't-Tax** drugs (POST 5); **Ban ↔ Legalize E-Cigarettes** (POST 5);
  - **★ a THREE-pole set** at Gov scope per substance: **criminalize / decriminalize / legalize**
    (POSTs 8–9) — pushes #248 beyond binary toward graded option-sets.
- **#206 (Era-of-the-Future band)** — CORROBORATE (real-in-design, thin-in-content). Future rows:
  **War on Drugs for Video Game Addiction** (POST 1) and **virtual drugs / mind sims** (POST 7).
  vcczar's headline ask is **more Future drug policies** → Future band confirmed under-populated again.
- **#66 (law-created institutions / amendments)** — CORROBORATE. Embedded #66 instances:
  **18th Amendment** & **21st Amendment** (constitutional amendments as content), **Drug Czar**
  (a standing exec office), **Federal Drug Courts** (a standing institution), and the **"Grant the
  Fed gov't authority to enforce Prohibition"** enabler (Volstead-analog). All era-gated by content.
- **#262 (content-balance / left-skew note)** — **★ NOTABLE CONTRAST.** Unlike the **left-skewed**
  Environment (b46) and Taxation (b47) genres — where vcczar flagged the RW side as repeal-only —
  **Drugs is fairly BALANCED**: both legalize/decriminalize (left/libertarian) AND
  criminalize/Prohibition/War-on-Drugs/strict-tobacco (right/authoritarian) poles are natively
  present. vcczar's #262-style ask here is **NOT** "right-leaning affirmative content" but rather
  **thin-primitive growth** (Future + Gov Actions). So this genre needs no left/right rebalancing —
  log it as the **counter-example** to the Environment/Taxation skew.

### Taxonomy / sub-state model requests this genre surfaces (new design inputs)
- **Substance-class enum ≥3 buckets** (marijuana / hard drugs / **psychedelics** / + tobacco /
  alcohol / **e-cigarettes** / **virtual drugs**) — POSTs 2, 5, 7, 8.
- **Three-pole policy stance per substance** (criminalize / decriminalize / legalize) — POSTs 8–9.
- **State-default drink-policy + county local-option** (dry-by-default KS/MS/TN, local-option AL) —
  POST 4; implies a **sub-state (county) granularity** the build entirely lacks.
- **Drug-policy → court-case trigger** (religious-ritual exemption → free-exercise challenge) — POST 3.

---

## Era span & predicate-gating (era-aware framing — IMPLIED, not authored; no historian this batch)

vcczar dropped era/prereq fields (POST 1), but the content is intrinsically era-banded. Anchors
from `docs/game/historical-context.md` (Progressive/1920s §5) + standard US drug-policy history
[inference]:
- **Progressive / 1920s band (~1917–1933):** the **18th Amendment** (ratified Jan 1919; in force
  Jan 1920 via the **Volstead Act** — the "Grant Fed authority to enforce Prohibition" row) and the
  **21st Amendment** (Dec 1933 repeal) are **historically dated, era-locked content** — historical-
  context.md §5 already lists "18th (Prohibition, 1919) and 19th… Amendments" as Progressive-era
  binding facts, and flags the **"wet"/"dry"** axis and Al Smith's 1928 anti-Prohibition candidacy.
  → these rows demand a **Progressive-band era gate** + a **"Prohibition-in-force" program-state
  predicate** (which Increase-Punishments and the enforcement-authority rows gate on).
- **Modern band (~1971+):** **War on Drugs** (Nixon, 1971; "Drug Czar" / ONDCP, 1988), federal
  marijuana/hard-drug criminalization (Controlled Substances Act, 1970), drug courts (1989+),
  opioid treatment/research subsidies (2000s–2010s), state marijuana legalization (2012+),
  e-cigarette regulation (2010s). The bulk of the genre is modern-band.
- **Future band (#206):** War-on-Drugs-for-video-game-addiction, virtual drugs / mind sims —
  the off-timeline rows vcczar wants more of.
- **State-vs-federal axis spans all bands:** "Leave Drug Policies to the States", dry-states, and the
  Gov-Action decriminalize/legalize/strict layer model the genuine **state-primacy of US drug/alcohol
  policy** (alcohol regulation was state/local pre-1919 and again post-1933; marijuana is state-led today).
- **Predicate-gating (#258) implied:** Increase-Punishments / Grant-enforcement-authority → "Prohibition
  active" gate; 21st / Legalize-Alcohol Amendment → "18th passed" gate; War-on-Drugs-expand → "War on
  Drugs instituted" gate; Future rows → Future-era gate. **None written as an explicit `Preq:` field**
  (same prereq-field gap as #258, and explicitly dropped here per POST 1).

---

## Engine facts (verified this run, do not re-derive)

- **ZERO drug / prohibition / marijuana / alcohol-policy content in the build.** Grepped `src/` for
  `drug|marijuana|cannabis|opioid|prohibition|tobacco|psychedelic|narcotic|drinking age|War on
  Drugs|e-cigarette|alcohol` — the **only** hits are **"tobacco" as a state-industry / commodity
  tag**: `states1772.ts` / `states1856.ts` `industries: { … tobacco: N }` (VA/NC/TN/KY/MD) and
  `types.ts:400–402` interest-group commodity maps (`Planters: ['tobacco']`,
  `SlavePower: ['cotton','tobacco']`). These are **economic/commodity tags, NOT drug policy.**
- **No "Drugs" Expertise tag.** `types.ts:182–192` defines exactly **19 Expertise tags**
  (Agriculture…Welfare); there is no Drugs/Substance/PublicHealth tag. The nearest policy hooks a
  drug genre would attach to are the existing **Healthcare** and **Justice** expertises — but no
  drug-specific content uses them. (So even the "possible Expertise tag" the brief anticipated does
  **not** exist.)
- **No `policyGenre` / `presAction` / `govAction` / `subtype` / `prereq` tokens anywhere in `src/`.**
  The three #221 content primitives + scripted-event registry remain **designed-only, 0% shipped.**
  **Pres Actions and Gov Actions as content primitives do not exist in the build at all.**
- **`interface Legislation`** (`types.ts:1506–1520`) carries only the 4-value `committee`
  (`Domestic | Foreign | Economic | Justice`) — **NO `subtype`, NO drug-class field, NO prereq/condition
  field.** The only condition construct is the serializable `Predicate` tree (`types.ts:1484–1504`:
  `yearAtLeast`, `eventCompleted`, `warActive`, `stateAdmitted`, `meterAtLeast`, `rosterHasSkill`),
  wired **ONLY** to the 2.4.3 era-event graph. It **cannot** express "Prohibition is in force", "the
  War on Drugs was instituted", "marijuana is legal in this state", or the substance-class /
  state-default / county-local-option granularity this genre needs.
- **The entire shipped legislation content library is 8 generic `BILL_TEMPLATES`**
  (`phaseRunners.ts` ~3420–3429), randomly drawn for CPU factions — Tariff Increase/Reduction etc.
  **There is no drug, prohibition, marijuana, drinking-age, drug-court, drug-czar, opioid, or
  e-cigarette bill / office / amendment / meter anywhere in the build.**
- → **Net: pure design provenance; adds NO shipped behavior; EXTENDS the 0%-shipped policy-genre
  corpus by one genre (Drugs)**, and surfaces new sub-models (substance-class enum, three-pole stance,
  county local-option, policy→court-case trigger).

---

## Open questions (for the human / consolidation, not answerable mid-run)

1. **Substance-class enum granularity:** how many buckets does the build adopt — 2 (marijuana / hard),
   3 (+ psychedelics, POST 2), or the full 5–7 (+ tobacco / alcohol / e-cigarettes / virtual)? Every
   legalize/criminalize/decriminalize/tax row multiplies by this.
2. **Three-pole stance (criminalize/decriminalize/legalize, POSTs 8–9)** vs. the binary #248 model
   used elsewhere — does the policy-lever system support graded (3+) option-sets, or only opposed pairs?
3. **Sub-state granularity (POST 4 dry-states / county local-option):** the build models policy at
   state scope; county/local-option is a new tier. Adopt, or approximate at state level?
4. **Prohibition as program-state:** does "Prohibition active" become a first-class predicate
   (gating Increase-Punishments / enforcement-authority / 21st-repeal), or is it modeled purely as a
   passed-amendment flag? (Same #258 program-state-predicate gap.)
5. **Drug-policy → court-case linkage (POST 3):** is the religious-exemption→free-exercise-challenge
   wired into the courts/SCOTUS-case system, or left as flavor?

---

## ★ Deltas vs. current build (the hand-off list)

1. **Drugs policy genre = 0% shipped.** No drug/prohibition/marijuana/alcohol-policy content
   exists; the only `src/` "tobacco" is a state commodity tag. New genre, fully designed-only. (#237)
2. **All three #221 content primitives unbuilt for this genre** — Legis (~14), **Pres Actions (4)**,
   **Gov Actions (2)**; Pres/Gov-Action primitives don't exist in the engine at all. (#221)
3. **#248 graded option-sets needed** — marijuana & hard-drug legalize↔criminalize, **18th↔21st
   Amendment**, min-drinking-age 18↔21, tax↔don't-tax, ban↔legalize e-cigs, and a **3-pole**
   criminalize/decriminalize/legalize set at Gov scope. Build has no opposed-lever or option-set model.
4. **#66 institutions/amendments unbuilt** — 18th & 21st Amendments, Drug Czar, Federal Drug Courts,
   Volstead-style "grant Fed enforcement authority." No amendment object, exec-office content, or
   institution-creation system exists.
5. **#206 Future band thin (vcczar's headline ask)** — only War-on-Drugs-for-video-games + virtual
   drugs/mind-sims; needs more Future drug policy.
6. **Substance-class enum + 3-pole stance + county local-option are NEW sub-models** the build lacks
   (no drug-class field, no decriminalize tier, no sub-state granularity, no "dry-by-default" state seed).
7. **No program-state predicate** ("Prohibition in force" / "War on Drugs instituted" / "legal in
   state X") — the `Predicate` tree can't gate the modifier-verb rows (Increase-Punishments, Expand-WoD).
8. **No "Drugs" Expertise tag** (19 tags, Healthcare/Justice are the only adjacent hooks) — even the
   minimal Expertise hook anticipated does not exist.
9. **#262 counter-example:** this genre is **balanced** (legalize AND criminalize poles native),
   unlike left-skewed Environment/Taxation — needs primitive-depth growth, **not** left/right rebalancing.

**All of the above is an authoring SNAPSHOT (un-deduped, era/prereq fields explicitly dropped per
POST 1), NOT designer-ratified final content.**

---

*Digest line count: see `wc -l` of this file (`docs/game/playtest-digests/faf2d8b3-ampu-drugs.md`).*
