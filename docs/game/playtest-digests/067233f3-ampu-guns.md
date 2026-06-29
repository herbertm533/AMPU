# Digest — "AMPU Guns" (`067233f3`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (politicslounge topic 1190, Apr 2022,
by **@vcczar**, tier-1 designer), **NOT a playthrough.** A policy-genre CONTENT drop for a
**Guns** subtype — another entry in the policy-genre sweep (sibling of `9f2ab25f-environment`,
`1bf19872-taxation`, `faf2d8b3-drugs`, plus immigration / education / civil-rights / welfare /
healthcare / banking / regulations / currency / agriculture …). **6 posts / 1 chunk**
(chunk-001, all covered). Source CSV ~3.2 KB. `wc -l chunk-001.md = 163`.
**Why it matters:** adds the **Guns** policy genre to the corpus and **CORROBORATES** the
framework (#221 / #237 / #248 / #258 / #262 / #206 / #66). An **UNTAGGED** drop (3 flat
header partitions, no `L-/P-/G-` prefix, no era-band tag, no `Preq:` block — same authoring
stage as Environment / Taxation / Drugs). Content primitives remain **0% shipped** (verified
this run). **PLUS one genuinely NEW mechanic** the prior content threads do NOT surface: a
**firearms-research military-tech upgrade tree that feeds the combat-victory modifier.**

> This is **DIGEST-ONLY** — touches no living doc (no `game-context.md` edit). No historian
> ran this batch; era framing per `docs/game/historical-context.md` + standard US gun-law
> history (anchors cited inline below). All content here is an **authoring SNAPSHOT, not
> designer-ratified final.**

---

## The Guns policy genre (the core artifact, POST 1) — UNTAGGED 3-partition form

vcczar posts under the standard **three flat header partitions**, no schema tags. Counts:
**Legis Prop ~22 · Pres Actions 0 (n/a) · Gov Actions 2.**

vcczar's **explicit ask** (POST 1, line 10): *"I think the major areas of need here are
**pres actions, gov actions, and stuff for Era of the Future**."* → the recurring thin-primitive
/ thin-Future holes again (#262 / #221-P / #221-G / #206). Note **Pres Actions = `n/a`** here:
this genre ships ZERO authored Pres Actions (the thinnest the primitive has been).

### Legis Props (POST 1) — ~22 rows, grouped by THEME for skimmability (do not re-list verbatim)

- **Bans / restrictions (the gun-control pole — dominant content):** Ban cop-killer guns ·
  sawed-off shotguns · snubnosed handguns · machine guns · 3-D printed ghost guns · bump
  stocks · assault weapons · large-capacity magazines · **Ban Private Ownership of Firearms
  (Amendment)** (the far pole, a constitutional amendment — #66) · Restrict sale of handguns ·
  Ban interstate gun sales · Regulate interstate/mail gun sales · **Brady Act** · ban gun
  purchases by mentally-ill / felons / drug-users · Regulate the Firearms Industry.
- **Deregulation / pro-gun pole:** **2nd Amendment** (the constitutional enabler — #66) ·
  **Federal Open Carry Law** · **Arm School Teachers**.
- **State-vs-federal authority axis:** **Leave All Matters Pertaining to Personal Weapons to
  the States** (the genre's devolution / federalism pole — see POST 5/6 SHIPPED note below).
- **★ Era-of-the-Future band (#206):** **Mandate Police Convert to Non-Lethal Weaponry** ·
  **Replace Human Police w/ Robot Law Enforcement** (the headline Future rows vcczar wants
  more of — speculative law-enforcement-tech policy).

### Pres Actions (POST 1) — **0 (n/a)** — the thinnest-primitive hole, explicitly flagged.

### Gov Actions (POST 1) — 2 rows (vcczar flags this as a primitive he wants grown):
**Arm teachers** (state-scope mirror of the Legis row) · **Restrictive gun laws** (the
state-scope restriction pole; counterpoint to "leave to states" at federal scope).

---

## Community-suggested ADD-ONS (POSTs 2–6) — content inputs, all UNRATIFIED

**POST 2:** **Legalize civilian ownership of military weaponry** (the far deregulation pole —
anti-pole to the "Ban Private Ownership" amendment).

**POST 3** — five add-ons, two of them structurally distinctive:
- **★ State reciprocity** — *"all states will respect the laws of other states in regards to
  citizens traveling with firearms."* A **cross-state policy-active relationship** (state A's
  carry permit honored in state B) — a predicate/policy-active linkage, not a flat lever.
- **★ Authorize firearms research** — *"upgrading firearms of the military — flintlocks → percussion
  cap → repeating rifles → bolt action → semi-auto → fully auto. Upgrading military firearms
  should slightly increase the chance of victory in combat."* **A military-tech UPGRADE TREE
  that feeds a combat-victory modifier.** See "Distinctive mechanics" below — this is the one
  genuinely NEW system this thread surfaces, tying the Guns genre to the war/combat engine.
- Restrict firearm ownership to those who vote · Ban handguns · Ban long rifles · Ban all
  firearms · Require firearms safety class · Gun-buyback program · Require gun safes · Require
  firearm registration (no grandfather clauses) · Ban gun-show / private sales w/o background checks.

**POST 4** (typo-correction on POST 1's "cop killer guns" → "cop killer **bullets**") + six add-ons:
- Conceal-carry without a permit · Require **gun-owner insurance** · **★ Exempt gun
  manufacturers from lawsuits over gun crimes — "and the counter would be to open them up to
  lawsuits"** (an explicit OPPOSED / PAIRED-COUNTER policy, PLCAA-analog — #248) · Forbid guns
  on school property · **Remove all "gun-free" zones** (anti-pole to the prior) · **"Class X"
  harsher penalties for using/possessing a firearm during a crime** (a sentencing-enhancement law).

**POST 5** (@Timur): **Leave gun laws to the states** (duplicate of POST 1's devolution row —
confirms the list is NON-EXHAUSTIVE / un-deduped).

**POST 6** (@vcczar, quoting POST 5): *"The game has that."* → **vcczar's claim that
"leave gun laws to the states" already exists.** **CAUTION — this is NOT a shipped gun-policy
lever in the codebase** (see Engine facts): the only "states-rights" construct in `src/` is the
`StatesRights` **ideology card** on factions, not a gun-specific devolution policy. vcczar is
referring to his master design list / the federalism ideology framing, **not** shipped Guns content.
Log as **DESIGN-ASSERTED-SHIPPED but UNVERIFIED in build.**

---

## ★ Distinctive mechanics (the two things beyond plain policy content)

**1. Firearms-research military-tech upgrade tree → combat-victory modifier (POST 3) — NEW.**
A linear tech ladder (flintlock → percussion cap → repeating rifle → bolt-action → semi-auto →
fully-auto) where each upgrade **slightly raises the chance of winning a battle.** This is the
first content thread to propose a **military equipment-tech progression that mutates the combat
math** — it does NOT map cleanly onto the existing policy-genre framework IDs; it is a **war/combat
system extension** that the Guns genre would gate/trigger. **Build reality:** the only combat
system is `revolutionaryWar.ts`; its battle target is
`planning + generalScore(military×10) + frenchAlliance(25) + difficultyMod` (`revolutionaryWar.ts:212–218`
ground; `186–192` naval) — **there is NO weapon/firearm/equipment-tech term anywhere in the
target computation, and no military-tech state on the snapshot.** So this is a fully designed-only
new modifier + a new persistent "current military-firearm tier" program-state, plus the era-banded
tech ladder itself (flintlock = founding; fully-auto = modern). Likely SAME-AS or sibling-of the
broader military / "rethinking how war works" threads (`145db158-ampu-military`, `0fd0f2e5`,
`a2312dd2-foreign-affairs/military`) — cross-link there; **flag as a candidate NEW delta**, not a
pure content-engine corroboration.

**2. State reciprocity + paired-counter policies (POSTs 3, 4) — maps to #248 / #258.**
- **State reciprocity** (POST 3): a **cross-state "is policy X active in state B?" linkage** —
  when active, every state honors every other's carry law. A policy-active predicate spanning
  states; the `Predicate` tree has no "policy active in state" variant (only `stateAdmitted`).
- **Manufacturer liability shield ↔ open to lawsuits** (POST 4): an **explicit opposed PAIR**
  vcczar's own community names as "X and the counter would be Y" — the canonical #248
  opposed-lever specimen, plus a **program-state** (a shield is in force) the counter-law repeals.
  Other opposed sets in this genre: 2nd Amendment ↔ Ban-Private-Ownership amendment; Open-Carry /
  remove-gun-free-zones ↔ forbid-guns-on-school-property / restrictive-laws; legalize-military-
  weaponry ↔ ban-all-firearms; arm-teachers ↔ (gun-control bans).

---

## Era span & predicate-gating (era-aware framing — IMPLIED, not authored; no historian this batch)

vcczar dropped era/prereq fields, but the content is intrinsically era-banded — the **widest
era spread of any content genre so far**, which is exactly why it stresses #258 era-gating:
- **Founding / early band (~1791):** **2nd Amendment** (ratified 1791); **flintlock** tech tier
  (the firearms-research ladder's base, war-era-appropriate); "Leave to the States" (the
  perennial federalism pole, live from the founding). [inference, standard history]
- **Early-modern band:** **National Firearms Act-style bans** — machine guns / sawed-off
  shotguns (NFA 1934); cop-killer-bullet / snubnose / handgun restrictions (mid-20th c.).
- **Modern band (~1990s+):** **Brady Act** (1993; the explicit named row), assault-weapons /
  large-cap-magazine bans (1994 AWB), manufacturer-liability shield (PLCAA 2005), open-carry /
  conceal-carry-without-permit (constitutional-carry, 2010s+), state reciprocity (current debate),
  red-flag-adjacent "ban mentally-ill / felon purchases."
- **Contemporary / leading-edge:** **3-D printed ghost guns · bump stocks** (2017–2020s).
- **★ Future band (#206):** **Mandate non-lethal police weaponry · Replace human police with
  robot law enforcement** — speculative; the **fully-auto** tech tier is the ladder's modern
  cap (no Future tier proposed for firearms research itself).
- **Predicate-gating (#258) implied:** firearms-research-upgrade rows → "previous tier
  researched" prereq + era gate (no percussion-cap before ~1820s); "increase penalties /
  open-to-lawsuits" → "shield in force" program-state; reciprocity → "states honor each
  other" cross-state policy-active state; robot-police / non-lethal-mandate → Future-era gate;
  2nd Amendment → early gate; bump-stock / ghost-gun → modern gate. **None written as an
  explicit `Preq:` field** (same prereq-field gap as #258, explicitly dropped here).

---

## Engine facts (verified this run, do not re-derive)

- **ZERO gun-policy content in the build.** Grepped `src/` for
  `gun|firearm|2nd/second amendment|open carry|conceal carry|brady|bump stock|assault weapon|ghost gun|gun control|robot police|non-lethal|reciprocity` —
  the **only** hit is the unrelated comment `// …removes a future-foot-gun.`
  (`phaseRunners.ts:2303`). No firearm, 2nd-Amendment, NFA-ban, Brady, open-carry, ghost-gun,
  bump-stock, robot-police, or non-lethal-weaponry content exists anywhere.
- **"Leave gun laws to the states" is NOT shipped as a gun-policy lever** (contra vcczar POST 6).
  The only "states-rights" construct in `src/` is the **`StatesRights` ideology card** on
  factions (`types.ts:323`, `361`; `factions1772.ts:16`, `factions1856.ts:5–6`) — a faction
  ideology tag, **not** a gun-specific devolution policy. vcczar's "the game has that" refers to
  the master design list / federalism framing, not shipped Guns content. **DESIGN-ASSERTED-SHIPPED,
  build-UNVERIFIED.**
- **No military firearm-tech / weapon-upgrade modifier in combat.** `revolutionaryWar.ts`
  computes the ground-battle target as `planning + generalScore(military×10) +
  (frenchAlliance?25:0) + difficultyMod` (lines **212–218**) and the naval target as
  `planning + adminScore + 30` (lines **186–192**). **No firearm-tier, equipment, or
  military-tech term feeds either.** There is **no "current firearm tech tier" field** on the
  `RevolutionaryWar` interface or anywhere on the snapshot — the entire firearms-research
  upgrade-tree + its combat modifier is **designed-only, 0% shipped.**
- **`interface Legislation`** (`types.ts:1506–1520`) carries only the 4-value `committee`
  (`Domestic | Foreign | Economic | Justice`) — **NO `subtype`, NO `policyGenre`, NO weapon-class
  field, NO prereq/condition field.** The only condition construct is the serializable `Predicate`
  tree (`types.ts:1487–1504`: `yearAtLeast`, `eventCompleted`, `warActive`, `stateAdmitted`,
  `meterAtLeast`, `rosterHasSkill`, etc.), wired **ONLY** to the 2.4.3 era-event graph. It
  **cannot** express "the liability shield is in force", "states honor each other's carry laws",
  "the military has reached the bolt-action tier", or the weapon-class / state-reciprocity
  granularity this genre needs.
- **No `policyGenre` / `presAction` / `govAction` / `subtype` / `prereq` tokens anywhere in `src/`.**
  The three #221 content primitives + scripted-event registry remain **designed-only, 0% shipped.**
  **Pres Actions and Gov Actions as content primitives do not exist in the build at all** (and
  this genre authors **0** Pres Actions besides).
- **The entire shipped legislation content library is 8 generic `BILL_TEMPLATES`**
  (`phaseRunners.ts:3420–3429`), randomly drawn for CPU factions — Tariff Increase/Reduction,
  Homestead Act, Internal Improvements, Naval Expansion, Fugitive-Slave / Personal-Liberty,
  Pacific Railroad. **There is no gun, firearm, Brady, 2nd-Amendment, open-carry, or
  weapon-ban bill / amendment / office / meter anywhere in the build.**
- → **Net: pure design provenance; adds NO shipped behavior; EXTENDS the 0%-shipped policy-genre
  corpus by one genre (Guns)** and surfaces ONE candidate-new system (firearms-research
  military-tech combat modifier) + the state-reciprocity cross-state policy-active linkage.

---

## Open questions (for the human / consolidation, not answerable mid-run)

1. **Firearms-research combat modifier:** is the military-tech upgrade tree a NEW war-system
   feature (its own delta), or folded into the existing #221 content primitives as a Pres/Gov
   Action with a side-effect on the combat target? Where does the "current firearm tier"
   program-state live (on `RevolutionaryWar`? a new generic military-tech struct used by future
   eras' wars too)? How big is "slightly increase the chance of victory" numerically?
2. **State reciprocity / cross-state policy-active:** does the build model "policy X is active in
   state Y" at all (no current `Predicate` variant)? Reciprocity needs a cross-state honor-linkage
   the engine entirely lacks.
3. **Weapon-class taxonomy:** how many buckets (handgun / long-rifle / shotgun / machine-gun /
   assault-weapon / ghost-gun / bump-stock / large-cap-magazine …)? Each ban/restrict row may
   need a weapon-class variant — same enum-granularity question as Drugs' substance classes.
4. **"Leave gun laws to the states" — actually shipped?** vcczar says yes (POST 6); the build
   shows only a `StatesRights` ideology card. Is there an intended (unbuilt) gun-devolution lever,
   or does the federalism ideology card stand in for it? Resolve the design-vs-build discrepancy.
5. **Pres-Action void:** the genre authors **0** Pres Actions. Is that a genuine "guns have no
   presidential lever" call, or just the thin-primitive hole vcczar flags (e.g. exec orders on
   bump stocks / pistol braces would be Pres Actions)?

---

## ★ Deltas vs. current build (the hand-off list)

1. **Guns policy genre = 0% shipped.** No firearm/2nd-Amendment/Brady/open-carry/ghost-gun/
   robot-police content exists; the only `src/` "gun" is a `future-foot-gun` comment. New genre,
   fully designed-only. (#237)
2. **All three #221 content primitives unbuilt for this genre** — Legis (~22 + ~16 community),
   **Pres Actions (0 authored — thinnest yet)**, **Gov Actions (2)**; Pres/Gov-Action primitives
   don't exist in the engine at all. (#221 / #262)
3. **#248 opposed / paired-counter levers** — manufacturer-liability-shield ↔ open-to-lawsuits
   (community names it as "X and the counter Y"), 2nd-Amendment ↔ ban-private-ownership amendment,
   open-carry / remove-gun-free-zones ↔ forbid-on-school-property, legalize-military-weaponry ↔
   ban-all-firearms. Build has no opposed-lever / option-set / program-state model. (#248, #237)
4. **#258 prereq / program-state gating** — "shield in force" (gates the open-to-lawsuits counter),
   weapon-tech-tier prereqs, era gates (2nd-Am 1791 → NFA 1934 → Brady 1993 → ghost-guns modern →
   robot-police Future). No `Preq:` field; `Predicate` is era-event-only. Widest era spread of any
   genre so far. (#258, #206)
5. **#206 Future band content** — Mandate non-lethal police weaponry · Replace human police with
   robot law enforcement (vcczar's headline Future ask). Corroborates Future-doubly-unbuilt. (#206)
6. **#66 amendments embedded** — 2nd Amendment + Ban-Private-Ownership amendment as content; no
   amendment object / constitutional-content system exists. (#66)
7. **★ NEW: firearms-research military-tech upgrade tree → combat-victory modifier.** Flintlock →
   percussion → repeating → bolt-action → semi-auto → fully-auto, each tier raising battle-win
   chance. **No equipment/weapon-tech term in `revolutionaryWar.ts`'s battle target, no military-tech
   program-state on the snapshot.** Does NOT map to the content-engine IDs — a war/combat-system
   extension (cross-link `145db158-military`, `0fd0f2e5-rethinking-war`). **Candidate NEW delta.**
8. **★ NEW-ish: state reciprocity / cross-state policy-active linkage.** "All states honor each
   other's carry laws" needs a "policy X active in state Y" predicate spanning states; `Predicate`
   has only `stateAdmitted`. No cross-state policy-active model in the build. (extends #258, but the
   cross-state honor-linkage is novel.)
9. **Weapon-class taxonomy is a NEW sub-model** (handgun / long-rifle / shotgun / machine-gun /
   assault-weapon / ghost-gun / magazine …) — no weapon-class field; mirrors Drugs' substance-class
   enum question. (#248)
10. **Build-vs-design discrepancy logged:** vcczar asserts "leave gun laws to the states" is shipped
    (POST 6); the build has only a `StatesRights` **ideology card**, not a gun-devolution policy.
    DESIGN-ASSERTED-SHIPPED, build-UNVERIFIED. (#237)

**All of the above is an authoring SNAPSHOT (un-deduped — "leave to states" appears twice, era/prereq
fields explicitly dropped), NOT designer-ratified final content.**

---

*Digest line count: see `wc -l` of this file (`docs/game/playtest-digests/067233f3-ampu-guns.md`).*
