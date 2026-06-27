# Digest — dc0316f0-ampu-businesslabor ("AMPU Business/Labor")

**Type:** CONTENT-AUTHORING / DESIGN thread (not a playthrough). vcczar (tier-1)
authors the **Business/Labor policy axis** — the master list of Presidential
Actions, Governor Actions, legislation, and scripted events keyed to it, all
era-tagged (incl. Era of the Future) and ideology-favoring. The driving ask
(#1/#5): "more B/L things that are **Era of the Future**, **Pres/Gov Actions**,
that **favor Traditionalists / RW-Populists / Conservatives**" (non-repeal
options). Defines an **"If No B/L Policies Active"** baseline state.
**Scope:** 23 posts / 1 chunk (chunk-001, all covered). Source CSV ~24.4KB.

---

## The Business/Labor policy-axis model (the core artifact)

B/L is a **named policy genre** ("policy genre" is vcczar's own term, #17 — he
distinguishes B/L from the separate **Currency** and **Copyright** genres).
Within the genre, individual policies are discrete, toggleable, often
prerequisite-gated entries. Structure observed:

1. **Baseline / default state** — `If No B/L Policies Active:` →
   **"Business and Labor Policies Left to the States" (L-Ind-Default)** (#1/#5).
   A sub-genre **"If no Minimum Wage Active"** → "No Federal Minimum Wage
   (L-Ind-Default)". So the axis is **stateful**: absence of policy IS a state
   (a `*-Default` entry), and policies shift it away from the states-rights
   baseline. (Player Q #12 asks whether the no-policy default could instead be
   driven by a state's political makeup — vcczar does not commit; open design Q.)
2. **Policy entries carry two codes**: a **letter prefix** = mechanism type, and
   a **parenthetical era/ideology tag**.
   - Prefixes: **L-** = Legislation, **P-** = Presidential Action, **G-** =
     Governor Action, **S-** = Scripted event. (e.g. `Pro-Business Over Labor
     (P-Prog)`, `Establish State Minimum Wage (G-Ide)`, `Labor Movement
     (S-Gild)`.)
   - Parenthetical tag = **era band** the entry belongs to (the same era-band
     vocabulary as the #92/#206 content registry): **Ind, Fed, Dem, Rep, Prog,
     Gild, Nat, Nuc, Neo, Norm, Ter, Pop, Ide, Fut, Luc**, etc. `-Fut` = **Era
     of the Future**; `-Default` = baseline. (Tags appear to double as ideology
     lean in some cases — Ide/Pop/Prog skew left, Norm/Ter/Neo skew right — but
     vcczar uses them primarily as era keys; exact tag semantics not stated.)
3. **Prerequisite chains** — many entries are `Preq:`-gated on prior state:
   - On other B/L policies: "A Minimum Wage is Active" → unlocks the Raise-Min-
     Wage ladder (75¢ → $1 → $1.60 → $2 → $3.10 → $5.15 → $7.25 → $10.10 → $12 →
     $15, plus Tie-to-Inflation / Cost-of-Living, +$20 #22). "Federal 30-Hour
     Work Week active" → "Apply 30-Hour Week to Private Sector". "Any Child Labor
     Ban active" → unlocks more child-labor entries.
   - On scripted events / world-state: "Manufacturing Spreads" → II → III;
     "AFL exists & unions not outlawed" → AFL-CIO; "Labor Movement occurred" →
     Haymarket / 1,200 Strikes / Pullman; "Intercontinental RR built" → Great
     Railroad Strike.
   - **On the Economic Meter** (the shipped `economic` meter — corroborates the
     EconStab cluster): "Economic Meter better than Stagnant" gates End of
     Indentured Servitude / Golden Age of Productivity; "Recession or Worse" →
     Create Government Work; "Depression or Worse" → Create WPA / PWA. **This is
     the meter the axis feeds off (reads), and policies presumably feed back into
     it** (FDR-style stimulus framing) — confirms B/L ↔ economic-meter coupling.
   - On party type: "Communist/Fascist/Theocratic as Major Party" → Ban Women
     from Labor Force (L-Norm); "American Communist Party major" → Nationalize
     Labor Unions (#1; player joke #2 re CPUSA being anti-feminist).
   - On future tech / scenario flags: "Human-AI Augmentation Invented" → Restrict
     Human-AI Employees; "Robot Era Workforce Crisis" → Restrict Robot Employees;
     "Wealthiest American Declares Company Sovereign Nation" → Ban Corps from
     Being Sovereign Nations; "US Subsidizing a Sea Colony" → Regulate Sea Colony
     Industry; "US controls Brazil" → Subsidize Lumber in Brazil; "Major Solar-
     System Resources Discovered" → antimatter spacecraft; "Usable Fusion" →
     Subsidize Fusion. (All Era-of-Future content — corroborates #206.)
4. **Scripted-event reactions** — S-entries are world events; the **President
   reacts** to them with options not listed here (#20: "presidential reactions to
   the scripted events involving labor unions ... I list the events but not the
   options"). So each S-event has an attached Pres-Action decision node.

**What meter(s) it feeds:** primarily the **Economic Meter** (read as a gate;
coupling is explicit). No separate "Business/Labor meter" is described — B/L is a
**set of stateful policy flags**, not a -5..+5 dial. Implicit secondary effects
named in flavor: real-estate / environment (Work-from-Home #23), state industry
strength (G-Ind Improve/Neglect a State Industry).

---

## Era-of-Future B/L content (corroborates #206)

Future-tagged entries (`-Fut`): Subsidize Drone Use for Business; Subsidize
Lab-Grown Meat; Ban Private Companies in Space; Federal 30-Hour Week + apply to
private sector; Restrict Human-AI Employees; Restrict Robot Employees; Ban Corps
from Being Sovereign Nations; Subsidize antimatter spacecraft; Subsidize Fusion.
**Player-pitched future content:** company-town / company-scrip revival as a
pro-corporate "alternate route" that normalizes rather than bans the practice
(OrangeP47 #3/#6/#10 — vcczar "will consider"); **Crypto USD / fully digitalized
economy** (Pringles #15 — vcczar redirects: belongs to the **Currency** genre,
#17); **Work-from-Home Law** (#23, env-positive / real-estate-negative).

## Ideology-favoring design (Traditionalist / RW-Pop / Conservative tilt)

The explicit gap vcczar is filling: most right-favoring B/L options are
**repeals/reversals**, and he wants **non-repeal** right-coded content. Player
proposals to fill it:
- **National Business Council / "National Business-Affairs Board"** as a
  pro-business **counterpart to the NLRB**; possibly a new **Secretary of
  Business** cabinet seat (Pringles #11, +1 by Pringles #13; both note Sec. of
  Commerce already exists). **Strong corroboration that the axis is meant to be
  symmetric** (pro-business institutions mirroring pro-labor ones).
- **Hardcore-traditionalist legislation:** narrow the Interstate Commerce Clause
  to specific actors/activity (not aggregate) — gated on "Wickard v. Filburn
  decided historically" (Pringles #14).
- **Union-weakening Pres/Gov Actions** (Vols21 #19): break a strike with federal
  troops (Jackson), fire striking workers (Reagan/PATCO) — vcczar #20 confirms
  "those are on the list."
- **Youngstown** branch (#21): rule Truman's EO proper → executive can nationalize
  via EO; conservative variant → nationalize-then-sell-to-private-entities.
- Right-coded entries already in the list: Taft-Hartley, Right-to-Work
  (nationwide / state), Ban Union Dues requirement, Ban anti-union-message ban,
  Ban Communist union officers, various drilling/pipeline subsidies.

---

## Shipped-vs-designed status (flag for tech-lead)

**No Business/Labor policy axis exists in `src/` today.** Verified:
- `src/types.ts` — "Business" and "Labor" appear ONLY as (a) two of the 19
  **`Expertise`** character tags (L183-191) and (b) **faction economic-lean
  signs**: `EXPERTISE_IDEOLOGY_LEAN` { Agriculture:1, **Business:0.5, Labor:-1** }
  (L421-425) and the 1856 faction→economic-tag map (NorthernIndustry→Business,
  UrbanLabor→Labor, L375-406). These are static ideology-lean inputs, **not** a
  stateful policy system.
- Shipped meters (`NationalMeters`, L1399-1407; `MetersPage.tsx`): `revenue,
  economic, military, domestic, honest, quality, planet` — a -5..+5 dial set
  updated by cabinet competence + events in the Lingering Phase. **No B/L meter,
  no policy-flag store, no "policies left to the states" default.**
- No `policyAxis` / "policy genre" / B/L-baseline construct anywhere in `src/`.

**Conclusion:** this thread documents a **wholly designed, fully-authored
system with NO shipped implementation.** The `economic` meter it reads/gates off
DOES exist; the policy-axis machinery on top of it does not.

## NEW system vs. extension of an existing one

This is a **NEW system, distinct from the interest-cards / lobbies cluster.**
Lobbies (`LobbyCardId`, `LOBBY_INDUSTRY`) are faction influence cards that nudge
state industries; B/L is a **national + per-state policy-flag axis** with a
baseline default, prereq chains, and Pres/Gov/Legislation/Scripted action types.
It is the **same era-band content vocabulary** as the #92/#206 era-content
registry (so it slots INTO that registry as one "policy genre"), and it is one of
**a family of parallel policy genres** vcczar maintains — **Currency** and
**Copyright** genres surface in-thread (#17, #22 gold/silver/bitcoin, #22
copyright-term ladder), implying B/L is one axis of a broader stateful policy
framework not yet captured.

---

## Candidate gaps for consolidation

1. **[NEW] Stateful policy-axis framework** — discrete toggleable policies with a
   "no policies active" **`*-Default`** baseline (e.g. "Left to the States"),
   prereq chains, and per-policy era-band + mechanism (`L/P/G/S`) tags.
   **Shipped status: ABSENT in `src/`** (Business/Labor exist only as Expertise
   tags + faction lean signs; no policy store). Source: this digest #1/#5/#12/#17.
2. **[NEW] Business/Labor policy genre content** — the full authored list
   (min-wage ladder, child-labor chain, union-formation/strike rights,
   right-to-work, manufacturing/strike scripted-event chain, etc.). Source #1/#5.
3. **[corroborates #206] Era-of-the-Future B/L content** — drones, lab-grown
   meat, AI/robot-employee restrictions, sovereign-corporation ban, sea-colony /
   Brazil / antimatter / fusion subsidies, Work-from-Home law. Source #1/#23.
4. **[corroborates EconStab/#116/#160] B/L ↔ Economic Meter coupling** — policies
   are gated by Economic-Meter thresholds (Stagnant / Recession / Depression →
   WPA/PWA/Gov-Work). The `economic` meter is SHIPPED; the gating + feedback is
   not. Source #1 (FDR-stimulus entries).
5. **[NEW] Symmetric pro-business institutions** — National Business Council /
   Business-Affairs Board as an NLRB counterpart; possible **Secretary of
   Business** cabinet seat; explicit need for **non-repeal** right-coded
   (Traditionalist/RW-Pop/Conservative) options. Source #11/#13/#14/#1.
6. **[corroborates #20 Gov/Pres-Actions] Union-weakening + scripted-event reaction
   nodes** — Jackson/Reagan strike-breaking Pres/Gov Actions; each S-event has an
   attached Pres-reaction decision node (options unlisted). Source #19/#20/#21.
7. **[NEW — adjacent] Parallel policy genres** — **Currency** (gold/silver/crypto-
   USD/bitcoin) and **Copyright** (term ladder) genres named in-thread; same
   framework, separate axes. Source #15/#17/#22.
8. **[open question]** Should the "no B/L policy" default be a flat "left to the
   states" placeholder, or computed from a state's political makeup? Unresolved
   (#12). Hand to human.
