# 45601d66 — Supreme Court Case Review (content curation)

- **Slug:** `45601d66-supreme-court-case-review`
- **Source:** `45601d66-Supreme_Court_case_review.csv` (1 chunk, 7 posts, ~4.7k chars)
- **Type:** SCOTUS content curation — building the modern-era case roster
- **Participants:** ConservativeElector2 (author/curator), vcczar (tasked the work), dkh64 (mechanics question)
- **Date:** Feb 2026 (posts timestamped 2/27–2/28/2026)
- **Batch:** b61 (sibling SCOTUS thread: `bace280c` "Supreme Court Case Question" — ahistorical Prigg v. PA + "no SC stuff programmed"; consolidation merges the two)

> **Why it matters:** This is the **content-authoring spec** for the modern-era Supreme Court docket — the concrete case list vcczar wants seeded, plus the **cadence rule** ("2–4 most impactful cases per half-term"). It also surfaces two design questions with confirmed answers: (1) **cases don't affect meters / don't do anything mechanically**, and (2) the **only way to reverse a ruling is a constitutional amendment** (16th-over-Pollock pattern) — a mechanism that is *described by the GM as existing* but has **no reversal code path** in the shipped build. This feeds the empty `pendingCourtCases` slot (#270).

## ★ Case roster (the working spreadsheet, not in-app)

These live in a **SC case file / spreadsheet** (a "to be added" tab), NOT in the codebase. `pendingCourtCases` seeds `[]` — zero authored cases ship (verified below). Roster as of POST 1–6:

**Already in the case file (4 from 2022):**

| Case | Year | Legal question |
|---|---|---|
| Dobbs v. Jackson | 2022 | (abortion; named in file, question not restated in thread) |
| NFIB v. OSHA | 2022 | Was OSHA's vaccine mandate an unlawful exercise of power beyond its enabling statute? |
| NYSRPA v. Bruen | 2022 | Does denial of concealed-carry licenses for self-defense violate the 2nd Amendment? |
| Thompson v. Clark | 2022 | Must a malicious-prosecution plaintiff show affirmative exoneration? |

**"To be added" tab (4 staged):**

| Case | Year | Legal question |
|---|---|---|
| United States v. Cooley | 2021 | May a tribal officer detain/search a non-tribe member on a reservation for a state/federal violation? |
| 303 Creative LLC v. Elenis | 2023 | Does applying CO anti-discrimination law to compel an artist's speech violate the 1st Amendment Free Speech Clause? |
| Kennedy v. Bremerton | 2022 | Is a public-school employee's prayer during school sports protected speech? |
| United States v. Rahimi | 2024 | Does barring firearm possession by persons under DV restraining orders violate the 2nd Amendment? |

**Suggested adds by half-term (POST 2, 4, 6):**

| Case | ~Year | Half-term / note |
|---|---|---|
| Trump v. United States | 2024 | 2023–2025; "definite add" (POST 4), corroborated POST 2 |
| Loper Bright Enterprises v. Raimondo | 2024 | 2023–2025; important but "not sure it can be replicated for game purposes easily" |
| City of Grants Pass v. Johnson | 2024 | 2023–2025; homelessness |
| Murthy v. Missouri | 2024 | 2023–2025; social media |
| Students for Fair Admissions v. Harvard | 2023 | landmark (Wikipedia); affirmative action |
| United States v. Skrmetti | 2025 | 2025–now half-term (currently **zero** cases) |
| Free Speech Coalition v. Paxton | 2025 | 2025–now |
| Trump v. CASA | 2025 | 2025–now |
| Learning Resources, Inc. v. Trump | 2025 | 2025–now |
| Mahmoud v. Taylor | 2025 | 2025–now; "potentially the weakest… but may impact parents" |
| Trump v. Anderson | 2024 | landmark; **"might not occur without a Trump-like presidency"** — flagged as conditional/branching content tied to a specific presidency; POST 7 ties it to existing gov actions that "discriminate against former secessionists" for federal offices |

Half-term coverage self-assessment (POST 2): **2021–2023 = well covered; 2023–2025 = has 303 Creative + Rahimi, needs 1–2 more; 2025–now = zero, needs adds.** Caveat: "there still might come more important cases."

## ★ Cadence target: 2–4 impactful cases per half-term

POST 1 states the design target explicitly: **"determine the 2 to 4 most impactful SC cases with lasting importance for every half-term."** The curation is organized by **half-term buckets** (2021–2023, 2023–2025, 2025–now), each meant to hold **2–4 landmark-tier cases**. Selection bar = Wikipedia "landmark decisions" (POST 6): ConservativeElector2 cross-checked and found most already singled out. This is a **content-density spec** for the SCOTUS docket generator (#270), not a mechanic present in code.

## ★ Cases don't affect meters / do nothing mechanically (dkh64, POST 3) — CONFIRMED

> "The cases don't seem to affect meters or anything" (POST 3).

**Confirmed against `src/`.** The shipped court phase `runPhase_2_5_3_Court` (`phaseRunners.ts:3397-3415`) does NOT read the case file. It:
- fires on a `chance(0.5)` coin-flip **when the phase runs** (every governance turn, see cadence note below),
- picks one of **4 hardcoded abstract strings** (`'Property rights vs. federal regulation'`, `'Interstate commerce dispute'`, `'Free speech under wartime laws'`, `'State sovereignty over federal authority'`),
- counts Con/Trad/RW-Pop vs Lib/Prog/LW-Pop justices; greater side "wins",
- logs the ruling and nudges **`partyPreference` by ±0.1** (conservative ruling → −0.1, liberal → +0.1), clamped [−5,5].

No named-case policy effect, no meter change, no interest-group delta, no per-case content — the player's meters are untouched by any specific case. dkh64's observation is exactly right.

## ★ Legislative reversal = amendment only (POST 5) — mechanism DESIGNED, reversal code ABSENT

> Q (POST 3): "Is there a mechanism in-game to reverse a ruling legislatively?"
> A (POST 5): "The only one that exists are amendments, like the 16th Amendment overturning Pollock or other hypothetical amendments in-game."

The GM's stated design: **no ordinary bill can reverse a ruling; only a constitutional amendment can** (16th-Amendment-overturns-Pollock as the canonical example). Player intent (POST 3): "would be nice to have the option to try to reverse policy a player doesn't prefer."

**Shipped reality:** amendments exist **only as a constitution-drafting article** (`ConstitutionalArticles.amendmentProcess` in `types.ts:1394`; `constitutionalConvention.ts:43-116` lets the founding convention pick 3/4 / 2/3 / unanimous). There is **no in-game amendment-proposal mechanism** post-founding, and **no code linking any amendment to reversing a court ruling** — grep for `overturn|reverse|Pollock|16th|precedent` in `src/` yields only draft-order reversal and a carriage-overturn flavor event; nothing touches the court. So the "reverse via amendment" mechanism the GM describes is **forum lore / manual GM adjudication, not a shipped feature.**

## Shipped-vs-designed (verified against `src/` HEAD)

- **Zero authored cases ship.** `pendingCourtCases: []` in **both** scenarios (`scenario1856.ts:175`, `scenario1772.ts:95`); the field is **never written or read** by any producer. The 4+4+11 cases in this thread are spreadsheet data outside the app. ✓ confirms b58/b60.
- **`SupremeCourtCase` type is a dead stub** (`types.ts:1548-1556`): `{ id, year, title, description, decided, ruling?: 'majority'|'minority', effect? }`. Single `effect?` (no Yea/Nay split, no `points`, no importance/Landmark tier, no legal-question field distinct from `description`, no precedent/overturn link). Cannot represent the curated roster's structure (each case here has a distinct legal *question*; several are conditional on a "Trump-like presidency").
- **Court phase is abstract, not case-driven** (`phaseRunners.ts:3397-3415`): 4 hardcoded strings, ideology headcount, `partyPreference ±0.1` only. Ignores `pendingCourtCases` entirely.
- **Cadence mismatch.** Designed unit = **half-term** (2 years). Shipped: phase 2.5.3 runs on the normal governance turn loop (`engine.ts:53`), gated only by era (`phases.ts:92-93`: skipped in independence era until the Constitution ratifies). Within its own coin-flip it fires ~50% of the time it runs — there is **no half-term bucketing** and no per-half-term "2–4 cases" quota anywhere in code.
- **No reversal path.** No post-founding amendment mechanism; no bill/amendment → court-ruling reversal link. Amendments are founding-convention-only config (`constitutionalConvention.ts`).

## Delta list

Maps almost entirely to **#270** (SCOTUS content — the empty case slot); this thread is its **content-curation spec + cadence target**. Cross-ref **#66** (justice ideology, which the current abstract court already consumes). NEW/sharpen items flagged for consolidation.

1. **#270 (SHARPEN — content spec):** authoritative modern-era case roster to seed `pendingCourtCases` — 8 named cases already in the file (4 Dobbs-era 2022 + 4 staged: Cooley 2021, 303 Creative 2023, Kennedy 2022, Rahimi 2024) + ~11 candidate adds (Trump v. US, Loper Bright, Grants Pass, Murthy, SFFA v. Harvard, Skrmetti, FSC v. Paxton, Trump v. CASA, Learning Resources, Mahmoud v. Taylor, Trump v. Anderson). Each carries a distinct legal question (table above).
2. **#270 (SHARPEN — cadence target):** design cadence = **2–4 landmark cases per half-term** (half-term = 2yr buckets: 2021–23, 2023–25, 2025–now). Shipped court has **no half-term bucketing / no per-period quota** — it's a per-turn `chance(0.5)`. Selection bar = Wikipedia "landmark decisions."
3. **#270 (SHARPEN — cases do nothing):** CONFIRMED dkh64's "cases don't affect meters or anything." Shipped court touches only `partyPreference ±0.1` off abstract strings; no named-case policy/meter/interest-group effect. Requirement: a case must *do* something (direction-keyed effect) to be worth authoring.
4. **NEW (consolidation to ID — likely folds into #270, may split):** **legislative reversal of a ruling = constitutional amendment only** (16th-over-Pollock, per GM POST 5). Shipped build has **no post-founding amendment mechanism and no amendment→ruling-reversal link** — the mechanism is forum lore, not code. Player-requested feature: "try to reverse policy a player doesn't prefer."
5. **NEW (consolidation to ID — content flag on #270):** **conditional/branching cases** — Trump v. Anderson (and arguably others) "might not occur without a Trump-like presidency" (POST 6–7); tie-in to existing gov actions discriminating against former secessionists for federal office. Implies cases need a **precondition/trigger** field (presidency type / era state), which the dead `SupremeCourtCase` type lacks.
6. **#66 (CROSS-REF):** the shipped abstract court already consumes justice ideology (Con/Trad/RW-Pop vs Lib/Prog/LW-Pop headcount) — a real case docket would reuse the same bench-composition input; keep #66 and #270 coupled.

### Open questions (for the human)
- Does a case's outcome vary by bench composition, or is each curated case a **fixed historical outcome** (the roster lists real decisions)? The abstract court decides by ideology; a real-case docket must choose fixed-vs-simulated outcome.
- If reversal is amendment-only, is a **post-founding amendment proposal/ratification loop** in scope (net-new, spans legislature + states), or does reversal stay manual/GM? This is larger than #270.
- Half-term cadence: is "2–4 per half-term" a **content-density guideline** for authors, or a runtime quota the generator must enforce?
