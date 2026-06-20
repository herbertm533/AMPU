# CP0 Gap Analysis — Abilities, Expertise & Traits Alignment

**Goal:** align the AMPU engine with the canonical design reference
(`docs/research/source-abilities-expertise-traits.md`).
**Method:** three read-only codebase maps (abilities machinery, trait-effect
audit, expertise/lobby/cabinet survey), each cited inline.
**Verdict:** the reference defines **five systems**. AMPU implements the
numeric core well, but the **Expertise axis is entirely missing**, the **loss
machinery is absent across the board**, and **~63% of traits are decorative**.
This is a 6–8 PR epic, not one feature.

---

## The five systems at a glance

| System | Reference | AMPU today | Gap size |
|---|---|---|---|
| **Abilities** (6 numeric 0–5) | Command, Legislative, Governing, Judicial, Administrative, Military — each with long Earn/Use/Loss tables | 6 skills + separate `command`; ~6 grant sites; **zero loss sites** | ⚠️ Medium — structure OK, earn/loss thin |
| **Expertise** (19 tags) | Distinct axis; gates cabinet, faction ideology, gov actions | **No field exists**; 8 of 19 names mis-filed as *traits*, 11 absent | ❌ Large — axis must be built |
| **Traits** (57) | 57 flavored modifiers + old-age & d6-conflict loss | 46 traits, **17 mechanical / 29 decorative**; ~20 reference traits missing; no loss machinery | ❌ Large |
| **Lobbies** | Faction-leader lobby cards → expertise → state industry ±1 | Parallel `lobbyCards`/`interestCards`/31 `interestGroups`; **no lobby→expertise, no lobby→industry** | ⚠️ Medium — pieces exist, wiring absent |
| **Cabinet** | Big 4 + confirmation hearings; cabinet-level posts; expertise gating | 6 civilian + 2 military; **no confirmation, no expertise gate, no admin≥2**; FBI/CIA/Fed/NSA/UN absent | ⚠️ Medium-Large |

---

## System 1 — Abilities

**Structure (✅ mostly matches):** `Skills = Record<SkillKey, number>` 0–5
(`types.ts:24–41`) + separate `command` 0–5 (`types.ts:505`). PV weights skills
× per-office multipliers × 4, `command × 10`, traits ±4/±5 (`pv.ts:65–87`).

**Earn (⚠️ thin vs. reference):**
- ✅ Career-track thresholds grant the track's skill (50%/threshold, `phaseRunners.ts:298–310`)
- ✅ Command via anytime events (`commandBump`, `anytimeEvents.ts:303/316/348`) + kingmaker graduation (`phaseRunners.ts:1354/1365`)
- ❌ **Missing command grants** the reference lists: faction leader, party leader, committee chair/ranking member, CC President, Sec-of-State appt, Sr Gen/Adm in wartime, successful event/gov-action/legislation/filibuster, battle wins. None wired.
- ❌ **No primary/secondary track distinction** — all tracks grant one skill uniformly; reference wants primary (track's own) + secondary (other tracks).

**Use (✅ several gates exist):** command ≥2 presidential (`2986`), legislative ≥1 sponsor (`2732`), military ≥3 Gen / ≥2 Adm (`1941/1950`), judicial ≥2 SCOTUS (`2937`), governing→gov-action % (`2678`), cabinet skills→meter drift (`2650–2661`), battle planning (`revolutionaryWar.ts:118–141`). ❌ admin≥2 cabinet minimum absent (sort only, `1926`).

**Loss (❌ ENTIRELY ABSENT):** grep found **no** skill/command decrement
anywhere. Reference wants loss via old-age rolls, anytime evos, and battle
losses. Death/retire only set flags. This is the single biggest abilities gap.

---

## System 2 — Expertise (the missing axis)

❌ **No `expertise` field on `Politician`** (`types.ts:480–515`: only skills,
command, traits, ideology). Of the 19 tags:

- **8 mis-filed as traits:** Agriculture, Business, Economics, Education,
  Environment, Media, Military, Naval (`types.ts:76–86`) — all decorative.
- **11 fully absent:** Energy, Foreign Affairs, Healthcare, Housing, Justice,
  Labor, Science, Technology, Trade, Transportation, Welfare.

Downstream consequences: faction ideology is computed from member-ideology
median (`factionCenter`, `phaseRunners.ts:629–643`), **not** expertise; cabinet
has no expertise gating; lobbies can't map to expertise. **Everything the
reference hangs on expertise is unbuilt.**

---

## System 3 — Traits

46 traits; **17 mechanical, 29 decorative** (audit below).

- ✅ **Mechanical (17):** Orator, Crisis Manager, Kingmaker, Manipulative,
  Leadership, Loyal, Opportunist, Ideologue, Impressionable, Flip-Flopper,
  Frail, Ambitious, Failed Bid, Naval, Corrupt, + Celebrity/Egghead (grant-gates only).
- ⚠️ **Decorative (29):** Charismatic, Integrity, Efficient, Debater,
  Propagandist, Numberfudger, Harmonious, Magician, the 8 expertise-traits,
  Nationalist/Globalist/Reformist, Incompetent, Passive, Unlikable, Puritan,
  Domestic Apathy, Scandalous, Controversial, Obscure, Traitor, Carpetbagger,
  Outsider — **seeded but never read in engine logic.** The reference says most
  of these have election effects.
- ❌ **~20 reference traits missing entirely:** Bookkeeper, Lawful,
  Cosmopolitan, Crisis Admin, Crisis Gov, Decisive General, Delegator,
  Disharmonious, Domestic Warrior, Easily Overwhelmed, Geostrategist, Hale,
  Illicit, Incoherent, Iron Fist, Jurisprudence, Lackey, Late Bloomer, Likable,
  Everyman, Master Kingmaker, Micromanager, Military Leader, Naive Strategist,
  Overeager, Pliable, Predictable, Provincial, Southern Unionist, Teflon,
  Two-Faced, Uncharismatic.
- ❌ **Loss machinery absent:** no old-age trait loss; no d6 conflict roll. Only
  the Carpetbagger ladder (`phaseRunners.ts:516`) and Failed-Bid 6-turn decay.
- 🔸 **AMPU-invented (no reference equivalent):** Nationalist, Globalist,
  Reformist, Incompetent, Corrupt, Scandalous, Traitor, Outsider, Ideologue,
  Impressionable, Loyal, Opportunist, Ambitious, Failed Bid — keep or retire?

---

## System 4 — Lobbies

⚠️ AMPU has a *parallel* system, not the reference's:
- `Faction.lobbyCards` (15 scenario-flavored: Patriots, Planters, Abolitionists…
  `types.ts:272–276`), `interestCards` (15), `interestGroups` (31 — these *do*
  resemble the reference's economic lobbies: WallStreet, LaborUnions, BigTech,
  BigOilGas, BigAg, MilitaryIndustrial…). `lobbyToInterest` map exists (`295–311`).
- ❌ No lobby→expertise table; ❌ no "Points for Industry ±1 by lobby" logic.
- ⚠️ `State.industries: Record<string, number>` exists (`types.ts:552`) but key
  names (agriculture, manufacturing, finance…) don't match the reference's 8
  (Mining, Manufacturing, Finance, Plantation, High Tech, Alt Energy, Maritime,
  Natural Gas).

---

## System 5 — Cabinet

⚠️ 6 civilian + 2 military offices (`types.ts:449–471`), appointed by
party-match + admin-sort (`phaseRunners.ts:1918–1958`).
- ❌ No confirmation hearings (committee/floor vote).
- ❌ No expertise gating (Sec State→Foreign Affairs, Treasury→Economics, AG→Justice).
- ❌ No admin≥2 minimum.
- ❌ Cabinet-level posts absent: FBI, CIA/DNI, Fed Chair, UN Amb, NSA, PMG.
  `Ambassador` office type exists but has no appointment phase.

---

## Reconciliation decisions needed before sequencing

- **D1 — `backroom` skill.** Reference has no backroom *ability* (it's only a
  career track, flavor carried by Kingmaker/Master-Kingmaker traits). AMPU has a
  7th `backroom` skill, load-bearing in PV + the Backroom track.
  **Recommend: KEEP** as an AMPU extension (removing it guts dataset + PV).
- **D2 — `command` placement.** Reference counts Command among the 6 abilities;
  AMPU keeps it a separate field (×10 PV weight, many gates).
  **Recommend: KEEP separate** — it's a cosmetic disagreement, not worth a refactor.
- **D3 — migrate 8 expertise-traits out of the Trait union.** This is the
  structural crux. Doing it right means removing Agriculture/Business/Economics/
  Education/Environment/Media/Military/Naval from `Trait` and seeding them as
  `expertise` instead — which touches the **generated** draft dataset
  (`politicians-dataset.csv`, `defaultDraftClasses.ts`, `standard-draft-classes.json`)
  and the regen scripts. **Recommend: YES, migrate** — it's the whole point of
  the axis — but budget for a dataset regeneration.
- **D4 — AMPU-invented traits.** Keep the 14 AMPU-only traits (Nationalist,
  Loyal, Opportunist, etc.) or retire the ones with no reference analogue?
  **Recommend: KEEP** the mechanical ones (Loyal/Opportunist/Ideologue/
  Impressionable/Ambitious/Failed-Bid drive real systems); revisit the
  decorative ones (Nationalist/Globalist/Reformist) during the trait passes.

---

## Proposed PR sequence (dependency-ordered)

| # | PR | Scope | Depends on | Size |
|---|---|---|---|---|
| **1** | **Expertise axis foundation** | Add `Expertise` type (19) + `expertise` field; migrate the 8 mis-filed traits → expertise (D3); seed expertise from tracks/cabinet/committee/gov-re-election; surface on politician UI | — | L |
| **2** | **Ability earn/loss alignment** | Wire missing command grants (faction/party leader, committee, CC pres, cabinet, legislation, battles); add the **loss** machinery (old-age, anytime evo, battle losses) for all 6; primary/secondary track grants | — (parallel to 1) | M |
| **3** | **Trait loss + conflict machinery** | Old-age trait loss (advantageous); d6 conflict roll on gaining a conflicting trait; define conflict pairs | — | S–M |
| **4** | **Trait pass A — election-facing** | Give effects to decorative election traits (Charismatic, Integrity, Debater, Propagandist, Unlikable…) + add Likable, Uncharismatic, Cosmopolitan, Provincial, Two-Faced, Predictable, Orator-polish | 3 | L |
| **5** | **Cabinet overhaul** | Confirmation hearings; expertise gating; admin≥2 gate; cabinet-level posts (FBI/CIA/Fed/UN/NSA/PMG) | 1 | L |
| **6** | **Trait pass B — governance/cabinet-facing** | Bookkeeper, Lawful, Geostrategist, Crisis Admin/Gov, Domestic Warrior/Apathy, Numberfudger(teeth), Iron Fist, Micromanager, Delegator, Easily Overwhelmed, Master Kingmaker, Military Leader… | 1, 5 | L |
| **7** | **Lobbies → expertise → industry + faction ideology** | Lobby→expertise wiring; reconcile state-industry names; "Points for Industry ±1"; faction ideology from expertise | 1 | M |

**Recommended start: PR 1 (Expertise axis).** It's foundational — PRs 5, 6, 7
all depend on it — and it resolves the single clearest structural error (an
entire axis filed under the wrong system). PR 2 (abilities earn/loss) can run in
parallel since it only touches the existing skill/command code.

Each PR runs the full `/build-feature` pipeline (spec → brief → build → review →
playtest → PR), gated at each checkpoint.
