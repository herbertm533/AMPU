# Digest — bace280c: SCOTUS ahistorical-outcome & case-effect model

- **Slug:** `bace280c-supreme-court-case-question`
- **Source:** `docs/game/sources/bace280c-supreme-court-case-question/` (1 chunk, 4 posts, ~1.8k chars)
- **Type:** SCOTUS ahistorical-outcome mechanics Q&A
- **Date / people:** Aug 12 2025 — Bushwa777 (player Q), vcczar, MrPotatoTed
- **Batch:** b61. **Sibling:** `45601d66` ("Supreme Court case review") owns SCOTUS case CURATION + per-half-term cadence + cases-don't-affect-meters. **This digest's lane:** the ahistorical-outcome / **case→policy-effect model**, the ★ designer confirmation SC is unprogrammed, and the per-case "would-it-change-the-game-if-flipped" authoring problem. Consolidation merges the two.

> **Why it matters:** A named historical case can be decided **against history** in-game (here a 7-1 "Yay" on *Prigg v. Pennsylvania*), and the player expects that verdict to **change a policy** (negate the fugitive-slave law). The design has **no model** for a case verdict flipping a game-state flag, and the designer confirms SCOTUS is entirely **unprogrammed**. Each case needs an authored "what changes if decided the other way" effect — a per-case research + authoring task nobody has done.

## ★ The ahistorical 7-1 Prigg outcome — does it flip the fugitive-slave-law policy?
- Player's in-game Supreme Court voted **7-1 "Yay" on *Prigg v. Pennsylvania*** — an **unhistorical** outcome (historically *Prigg* (1842) upheld the Fugitive Slave Act of 1793 / federal supremacy over slave rendition) (POST 1).
- Player reads the case's question as: **"if a slave reaches a free state, is he free?"** and asks whether the ahistorical "Yay" would now **negate the fugitive slave law** (POST 1).
- vcczar's ruling: **if the spreadsheet doesn't say anything to that effect, ignore it for now**; can change **after the official 1st release** (POST 2).
- So the intended model is: a case carries an authored consequence *only if the source spreadsheet specifies one*; absent that, a verdict is **cosmetic** (no game-state change). The Prigg entry evidently carries **no such spec** today.

## ★ Designer confirmation — Supreme Court is UNPROGRAMMED (vcczar)
- vcczar: "now would be a better time to fix it… **I don't think Anthony has programmed any Supreme Court stuff yet**, unless I'm mistaken." (POST 3)
- **Code-verified — this is essentially correct.** SC exists only as inert scaffolding:
  - `SupremeCourtCase` type (`src/types.ts:1548`) *does* carry an optional `effect?: EraEventResponseEffect` field — the data model can hold a per-case consequence — **but nothing reads it.**
  - `pendingCourtCases: SupremeCourtCase[]` is seeded `[]` in **both** scenarios (`scenario1856.ts:175`, `scenario1772.ts:95`) and is **never referenced** anywhere else in `src/` (no `.ts`/`.tsx` reader; no UI). It is **dead state**.
  - The only live SCOTUS logic is `runPhase_2_5_3_Court` (`src/engine/phaseRunners.ts:3397`): a **50% chance** to invent an **abstract** case from a hardcoded 4-title array ("Property rights vs. federal regulation," etc.), rule by **ideology headcount** (conserv vs. liberal justices), log a fake vote tally, and nudge `game.partyPreference` by **±0.1**. It never touches `pendingCourtCases`, never names a real case, never applies an `effect`.
- **Consequence for this thread:** there is **no named-case pathway at all** — *Prigg* cannot occur in the shipped engine, and even the abstract cases that do occur have **no policy consequence** (only a party-pref nudge). A case *outcome* (historical vs. ahistorical) has **no mechanical effect**. Confirmed.

## ★ Per-case "would-it-change-the-game-if-flipped" authoring requirement (MrPotatoTed)
- MrPotatoTed: "the main issue is **determining whether or not this case would really change the game had it been decided the other way**. I have to research it and I don't have time right now… I'm sure there's **other cases that need to go through this same process** and I don't have time to go through all the cases right now." (POST 4)
- This defines an unbuilt authoring pipeline, **per case**:
  1. **Research** the case's real holding and its counterfactual (what a reversed verdict would have meant).
  2. **Decide** whether that counterfactual would materially change AMPU's game state (many cases may be inert / symbolic).
  3. **Author** a concrete effect (a law/flag/meter change) for the non-inert ones, stored on the case (candidate home: `SupremeCourtCase.effect`).
- No such per-case effects are authored today, and no code applies them. This is a **content + engine** gap, not just data entry.

## Slavery / fugitive-slave-law flag — the missing target
- For the Prigg counterfactual to mean anything, the engine would need a **slavery-adjacent flag/policy** for the verdict to flip. **No such flag exists.**
- Nearest existing surface is legislative-only: `BILL_TEMPLATES` (`phaseRunners.ts:3426–3427`) has a **"Fugitive Slave Act Strengthening"** bill (meters `domestic -1`; Planters +3 / Abolitionists −3) and a **"Personal Liberty Law"** bill — but these are one-shot passed-bill *meter/interest-group* effects, **not a persistent fugitive-slave-law state** a court could negate. There is **no** boolean/policy flag a *Prigg* verdict could toggle.
- Cross-refs the slavery-flag gap (consolidation #288): an ahistorical *Prigg* would need to flip a slavery-adjacent flag the engine does not model.

## Shipped-vs-designed
| Aspect | Shipped today (code-verified) | Designed / expected (this thread) |
|---|---|---|
| SCOTUS system | Inert. Abstract random cases via `runPhase_2_5_3_Court`; ideology headcount → ±0.1 `partyPreference`. `pendingCourtCases` dead, never read. | Curated **named** cases (e.g. *Prigg*) the court actually rules on; sibling `45601d66` covers curation + cadence. |
| Named/historical cases | Not present — engine invents 4 abstract titles only. | Real cases with historical baselines and ahistorical-verdict possibility. |
| Case verdict → policy | **None.** Verdict changes only `partyPreference` (±0.1); no law/flag/meter link. `effect?` field exists on type but is **never applied**. | Per-case authored **effect**: "what changes if decided the other way" (a law/flag/meter). Applies **only when the spreadsheet specifies one** (vcczar); otherwise cosmetic. |
| Fugitive-slave-law state | No persistent flag. Only transient passed-bill meter/IG effects. | A flippable slavery-adjacent policy flag so an ahistorical *Prigg* can negate it (cross-ref #288). |
| Authoring pipeline | None. | Per-case research → decide-if-material → author effect; acknowledged as time-consuming, deferred, applies to **many** cases. |

## Delta list
- **#270 (SCOTUS content/effects) — CONFIRM + SHARPEN.** Direct designer confirmation SC is **~0% programmed** ("I don't think Anthony has programmed any Supreme Court stuff yet"). Code-verified: `pendingCourtCases` is dead state; only inert abstract cases nudge `partyPreference`. **Adds requirement:** a **per-case outcome→policy-effect model** — each case needs an authored "what changes if decided the other way" effect (home: `SupremeCourtCase.effect`, currently unread), and the engine must apply it. Includes the ahistorical-verdict case (historical vs. non-historical outcome must be able to diverge in consequences). Designer stance: authored effect applies **only where the source spreadsheet specifies one**; else cosmetic.
- **#288 (slavery / fugitive-slave-law flag) — CROSS-REF.** The Prigg counterfactual has no target: no persistent fugitive-slave-law flag exists (only transient `BILL_TEMPLATES` meter/IG effects). An ahistorical *Prigg* would need to flip a slavery-adjacent flag the engine doesn't model.
- **NEW (consolidation to assign ID) — per-case effect-authoring pipeline.** Author-time process, per case: research real holding → decide if the counterfactual materially changes AMPU state → author a concrete effect for the non-inert cases. Explicitly deferred by MrPotatoTed; applies to **many** cases. Consolidation may fold this into #270 as a sub-requirement rather than a standalone ID. **Be conservative — likely a sharpening of #270, not a new top-level gap.**
- **Sibling boundary:** curation of the case list + per-half-term cadence + cases-don't-affect-meters live in `45601d66`. This digest owns the **effect model / ahistorical-outcome** side. Consolidation merges both under the SCOTUS umbrella (#270).

## Open questions (for consolidation / human)
- Where does an authored case effect live — extend `SupremeCourtCase.effect` (an `EraEventResponseEffect`, i.e. meters/IGs), or a richer effect type that can toggle **persistent policy flags** (needed for fugitive-slave-law negation)?
- Does "the spreadsheet" (source-of-truth case list) already exist with per-case effect columns, or does it need to be built? (vcczar's "if it doesn't say anything to that effect on the spreadsheet" implies a spreadsheet exists but many entries lack effects.)
- Is a slavery/policy flag layer (#288) a prerequisite for *any* meaningful ahistorical case outcome, or can early case effects be limited to meter/IG nudges that the type already supports?
