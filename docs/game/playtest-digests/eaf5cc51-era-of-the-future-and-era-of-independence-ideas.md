# Digest — eaf5cc51 "Era of the Future and Era of Independence Ideas"

**Type:** CONTENT-AUTHORING / crowdsourcing brainstorm (NOT a playthrough; no GM
rulings, no dice, no state). **Source:** `eaf5cc51-...csv`, 35 posts / 1 chunk
(read in full). **Date:** Mar 31 – Apr 7, 2022. **Authors:** @vcczar (creator,
sets the ask + rules in-thread), with community ideators @OrangeP47, @Mark_W,
@matthewyoung123, @MrPotatoTed, @ShortKing, @Rezi.

**One-line scope:** vcczar opens a content-collection call for the **two
"high-need" eras — Era of the Future + Era of Independence** — and frames it
with a **legislative-proposal SUBTYPE taxonomy** (~33 categories). This is a
**#221 content-authoring source** (the Legis-Prop / Pres-Action / Gov-Action
3-primitive model) whose **net-new contribution is the SUBTYPE taxonomy** — a
concrete schema axis (a `subtype` category field) for those primitives. Posts
20–35 drift fully OFF-TOPIC into personal genealogy/ancestry chat — no content.

---

## ★ NEW: the legislative-proposal SUBTYPE taxonomy (POST 1)

vcczar's framing post: *"Here are the legislative proposal subtype categories.
Use these to consider ideas for legislative proposals, governor actions,
presidential actions, and supreme court cases…"* — i.e. **the same category axis
spans all four content primitives** (Legis-Prop, Gov-Action, Pres-Action, SC
Case), not just bills. **The full list (33 categories, verbatim, POST 1):**

1. Agriculture
2. Bailout
3. Banking
4. Business/Labor
5. Civil Rights
6. Civil Service
7. Credit/Debt
8. Crimes/Punishments
9. Currency
10. Diplomacy
11. Drugs
12. Education
13. Elections
14. Environment
15. Expansion
16. Guns
17. Healthcare
18. Immigration
19. Infrastructure
20. Investigation
21. Military
22. National Security
23. Courts
24. Procedure
25. Reconstruction
26. Regulations
27. Slavery
28. Space
29. Taxation
30. Trade
31. Warfare
32. Welfare

**Schema implication (the gap):** Legis-Props — and per POST 1, **also
Pres-Actions, Gov-Actions, and SC Cases** — carry a **`subtype` (policy-area)
category** drawn from this fixed enumeration. This is a finer-grained axis than
anything shipped. The shipped `Legislation` interface (`src/types.ts:1506`) has
only a coarse 4-value `committee` routing field
(`Domestic | Foreign | Economic | Justice`) and **no policy `subtype`/`category`
field**. So the taxonomy is **0% shipped** and is a concrete addition to the
#221 primitive record schema.

**Relation to #237 (policy-GENRE framework, `businesslabor`):** note these are
TWO distinct concepts, not the same.
- **#237 GENRES** = stateful, toggleable policy *families* with `*-Default`
  baselines + prereq chains + `L/P/G/S` mechanism prefixes (Business/Labor,
  Currency, Copyright authored so far).
- **This taxonomy = SUBTYPES** = a flat *classification/tagging* enumeration for
  individual content items.
- They overlap by name (Business/Labor, Currency are both a genre AND a subtype),
  which suggests **a genre is one realization of a subtype**: subtypes are the
  superset filing categories; the #237 genres are the few subtypes that got the
  full stateful treatment. Most subtypes (Slavery, Space, Guns, Diplomacy, …)
  are likely just one-shot Legis-Props/Pres-Actions tagged with that subtype.

---

## Corroborating signals (not new)

- **Era-of-the-Future + Era-of-Independence are the two HIGH-NEED eras**
  (POST 1, vcczar, explicit) — directly corroborates **#206** (Era-of-Future
  doubly-unbuilt / under-content'd) and the Era-of-Independence (founding/Rev-War)
  content need. This thread is content being authored to FILL those gaps.
- **#221 three-primitive model** corroborated — POST 1 names Legis-Props,
  Gov-Actions, Pres-Actions (+ SC Cases + scripted events) as the content
  primitives being solicited.
- **vcczar's content-curation rule re-stated:** *"Don't want too many ahistorical
  things. I'm okay with failed proposals"* (POST 7) — and bills should be
  attributed to a real sponsor type (*"add that if a US Sen or US Rep proposes
  that"*, POST 7). Matches the #221 realm-of-possibility/importance curation rule
  (the `legisexecgov` digest) and the sub-floor failed-candidate convention.
- **LaFayette / "Petition France" already shipped** — vcczar POST 22: the
  "Petition France for immediate help (LaFayette appears as a General)" idea is
  *"already in the game, including LaFayette becoming a playable character in a
  faction."* (A small SHIPPED-reality confirmation for the Era-of-Independence
  Rev-War system / `revolutionaryWar.ts`.)
- **"Leadership change in a major foreign power → 50/50 better/worse relations"
  scripted event** — proposed by @MrPotatoTed (POST 17), vcczar accepts
  *"Yeah, I might do this"* (POST 18). A generalized geopolitics event for the
  Future era; corroborates the era-event system (#109/#113) + the
  great-power/foreign-relations interest (POST 10 names India/Brazil/Tanzania as
  emergent rivals; no "Cold War system" exists — consistent with prior batches).

---

## Content payload authored (candidate items for the #221 registry)

Brainstorm only — none ruled-in except the two vcczar-acknowledged items above.
Captured as raw content fodder, organized by the eras they target.

### Era of the Future (Pres-Action / Legis-Prop / Gov-Action / SC-Case / event)
- **Space/Sea:** Space colony representation/tensions/war; Sea colonies as a
  Gov-Action (revives state-v-state + state-v-federal water disputes); Space
  Jones Act; Space elevator (equator-sited → Infrastructure + Diplomacy host
  treaty); define legal "airspace vs space" boundary; US sovereign-space
  declaration; ban/restrict private companies in space; internationalize space
  via UN agency (POST 2,4,5).
- **Tech regs:** Flying-car regs (stricter interstate compact); encryption regs;
  genetic-enhancement regs (tiered: none / cosmetic / mental / physical);
  forensic-genealogy regs; biometric-data regs; online + "normal" privacy regs
  (codify what SCOTUS did via backdoor); cybernetics + "ship-of-Theseus" SCOTUS
  robot-rights/personhood dilemma; brain-computer "fantasy" stimulation regulated
  like drugs (Drugs subtype, Future) (POST 2,4,13,14,15).
- **Business/Labor:** "Corporate Marriage"; 4-day/3-day work week (by hours);
  microchipping-employees ban; portable/total work-benefit portability; federal
  control of work entitlements (POST 2,4,5).
- **Agriculture/Environment (Mark_W, POST 3):** Factory-farming ban; fishing bans
  (intensive farm / commercial / recreational / universal); hunting bans; ban
  import/export/sale of animal products (fur, ivory); cosmetic animal-testing ban;
  GM-crop regulation (bans + patent rights + "right to grow"); plastic/noble-gas
  (helium) byproduct legislation post-fossil-fuels; **Federal Interstate Water
  plan** for drought states (POST 11).
- **Healthcare:** Nationalize the insurance industry (vs build single-payer from
  scratch — different cost/anger modifiers, POST 6); prescription-drug price caps
  / direct subsidy (POST 5).
- **Education:** Free junior college (Gov-Action) → later 4-yr / law / med school
  tiers; ban/fund private schools; govt control of colleges; ban industry college
  donations; research-paper-funding disclosure (POST 4,5).
- **Guns:** 3D-printed / self-made firearm regs + SCOTUS cases (bypass existing
  controls, POST 4); flag-desecration amendment (failed by 1 vote 2005 → Future
  candidate, POST 19).
- **Currency/Economy:** Cashless society (fully electronic USD, not crypto);
  universal federal ID → fully electronic upgrade (POST 4).
- **Taxation:** End citizenship-based taxation of expats (all eras, POST 4); make
  taxation a solely-federal power via Constitutional Amendment (POST 5);
  compulsory superannuation; land tax (primary vs 2nd-home) (POST 5).
- **Military/Warfare:** Military-drone regs / international drone treaties; give
  up nukes; withdraw NATO/UN; chemical-weapons reservation; sign land-mine ban;
  online warfare vs unknown actor (POST 4,5).
- **Immigration:** Refugee + stateless-person regs (POST 4).
- **Elections:** Online voting; lower voting age; remove presidential age limit
  (POST 5).
- **Crime/Police:** Police-reform — lawsuit-payout source / mandatory liability
  insurance (POST 12).
- **Events:** Foreign-leadership-change 50/50 event (ACCEPTED, POST 17/18);
  emergent great-power rivals (India/Brazil/"Tanzania") (POST 10); + two joke
  April-Fools events (Mar-a-Lago residence / "2nd-rate Presidents museum",
  POST 5,5 — flavor, not real).

### Era of Independence (POST 9 = the structured @OrangeP47-style list; POST 19)
- **Legis-Props (POST 9):** establish continental currency; recognize/reject
  state currencies; refuse British pound; withhold/grant pay to foreign
  officers; invite foreign officers; pay slaveowners for slaves to serve;
  grant freedom to slaves who served; early "mule & 50 acres" for freed
  veterans; POW exchange with Britain; military prisons for British troops;
  authorize privateers; authorize black-market war supply; establish/consolidate
  armories by region (New England / Mid-Atlantic / Deep South);
  establish/reinforce West Point.
- **Gov-Actions (POST 9):** organize volunteer militia; establish state currency;
  fund/defund militia equipment; write/finalize state constitution; establish
  state judicial circuits. **← these are explicitly STATE-scoped (per-state),
  which sharpens #20** (Gov-Actions are flat/state-agnostic in the build today).
- **More (matthewyoung123, POST 19):** deport British sympathizers (~80k
  historically); the 1774 Galloway Plan (Grand Council — possible mechanics
  branch); appoint colonial justices (random +1 Justice trait per state);
  Petition France/LaFayette (ALREADY IN GAME, POST 22); restrict Admiralty
  Courts' seizure profit; forbid exporting accused criminals to England; adopt
  a national flag (multiple designs, datable).

---

## Open questions (for the human / consolidation)

1. **Is the subtype taxonomy CLOSED or extensible?** 33 listed; some are clearly
   era-specific (Slavery, Reconstruction → 1856/Reconstruction; Space → Future).
   Does each content item get exactly ONE subtype, or can it be multi-tagged
   (e.g. Space elevator = Infrastructure + Diplomacy, POST 4)? POST 4 repeatedly
   shows items spanning two subtypes → suggests **multi-valued** subtype tags.
2. **Subtype vs `committee` routing:** does the 33-subtype axis REPLACE or sit
   ATOP the shipped 4-value `committee` field? Likely a many-subtypes→1-committee
   mapping (e.g. Banking/Currency/Bailout → Economic).
3. **Subtype vs #237 genre:** confirm the relationship — is a #237 genre simply
   "a subtype with stateful baselines + prereqs," with most subtypes remaining
   plain tagged one-shots?

---

## Candidate gaps for consolidation

- **★ NEW — Legis-Prop/Pres-Action/Gov-Action/SC-Case `subtype` category field
  + the canonical 33-value subtype enumeration** (POST 1). A concrete data-model
  detail for the #221 primitive registry schema. 0% shipped (shipped
  `Legislation` has only the coarse 4-value `committee` field, `types.ts:1506`,
  and no policy-area subtype). Distinct from but adjacent to the #237 policy-GENRE
  framework (genres = the few subtypes given stateful treatment; subtypes = the
  flat filing/tagging axis over all four primitives). **→ extend #221's schema;
  cross-link #237.**
- **CORROBORATES #221** — the 3-primitive (+SC-case +scripted-event) content
  model; vcczar's realism/importance curation rule + sponsor-type attribution
  (POST 1, 7).
- **CORROBORATES #206** — Era-of-the-Future named a HIGH-NEED (under-content'd)
  era by the creator (POST 1); large Future content payload authored.
- **CORROBORATES the Era-of-Independence content need + #20** — POST 9's
  Gov-Actions are explicitly STATE-scoped (write state constitution, establish
  state currency / judicial circuits), reinforcing that flat/state-agnostic
  Gov-Actions in the build are a gap.
- **CORROBORATES #237** — Business/Labor + Currency appear as both subtypes here
  and genres in `businesslabor`, supporting the genre⊂subtype reading.
- **CORROBORATES era-event system (#109/#113)** + the no-"Cold War system"
  finding — foreign-leadership-change 50/50 event ACCEPTED (POST 17/18);
  emergent-rival flavor (POST 10).
- **SHIPPED-reality confirmation** — LaFayette/"Petition France" is already in
  the game incl. LaFayette as a playable faction character (vcczar, POST 22).
- **No net-new architecture beyond the subtype field;** posts 20–35 are
  off-topic genealogy with zero game content.
