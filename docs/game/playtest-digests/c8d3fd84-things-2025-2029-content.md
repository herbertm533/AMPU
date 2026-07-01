# c8d3fd84 — Things to Be Added for Jan 2025 → Jan 2029 (2nd Trump term content)

- **Slug:** `c8d3fd84-ampu-things-to-be-added-for-jan-2025jan-2029`
- **Type:** 2025-2029 modern content catalog (designer's running inclusion list)
- **Scope:** 2 posts, ~1k chars, dated 4/8/2025. Covers the Jan-2025→Jan-2029 window (Trump term 2).
- **Batch:** b63

> **Why it matters:** A content-authoring stub for the modern era: the designer records real-world 2025 political events "significant enough for inclusion" — one Pres Action, one Bill, and a predicate-gated exec-action idea. All of it targets an era band the build cannot reach (only 1772 & 1856 ship; `Era` enum ends at `modern`, no `future` — `types.ts:1337`), and its two named mechanics (Congress-must-approve-tariffs, law-active-gated deportation) have no shipped machinery. Corroborates the modern/future content cluster; adds two candidate NEW mechanics for consolidation to weigh.

## ★ Proposed content

| Item | Type | Notes | Post |
|---|---|---|---|
| Increase tariffs on allies and trade partners | Pres Action | Designer commentary: Trump notably has *not* tariffed Russia/N. Korea — flavor, not a mechanic. Needs the exec-action content system (unbuilt) + likely the graduated tariff-rate model. | 1 |
| **Tariff Review Act** | Bill | Dem-backed, 7 GOP cosponsors. Would **require Congress to sign on to tariffs against allies** — i.e. a Congress-approval *gate* on executive tariff-setting. No such gate exists (shipped tariff = 2 binary bill templates). | 1 |
| SC Cases | — | n/a (none yet) | 1 |
| Gov Actions | — | n/a (none yet) | 1 |
| EraEvos (era events) | — | n/a (none yet) | 1 |
| **★ Alien-&-Sedition-gated deportation** | Pres Action (predicate-gated) | See note below. | 2 |

## ★ Alien-and-Sedition-gated deportation exec action

Post 2: *"If the Alien and Sedition Acts are active in a game, maybe an executive action that uses legislation to remove alien individuals without due process and send them to a foreign prison? …big and easy to grade (RW Pop, etc)."*

This is a **precondition-gated content instance**: an exec action whose *availability* depends on a prior law (the Alien & Sedition Acts) being **active** in the current game — an event/action chained on legislative state, not just era/year. Same shape as the predicate-gated availability model (#258, wired 1772-only via `Predicate`/`evalPredicate`/`eraGraph`). No "Alien & Sedition Acts active" flag exists in the build (grep `alien|sedition`: only a trait comment `types.ts:1041` naming Adams' Sedition Acts as flavor, and the word "alienating" in `eraEvents1856.ts:15`). Grading note ("RW Pop") = an ideology-scored choice, consistent with the exec-action-content pattern.

## Shipped-vs-designed

- **Tariffs (shipped):** 2 binary bill templates only — `Tariff Increase` / `Tariff Reduction` (`phaseRunners.ts:3421-3422`), each a fixed meter/interest-group delta. There is also an `economic-tariff` *anytime* national event (`anytimeNationalEvents.ts:77`), but it's a random regional-alignment shuffle, not player tariff policy. No graduated tariff *rate* magnitude (gap #303), and **no Congress-approval gate** on tariff-setting.
- **Exec actions (shipped):** `runPhase_2_8_1_Executive` is a hardcoded 4-action stub (`phaseRunners.ts:3632-3646`), all founding/1856-flavored (Post Office order, enforce federal law, pardon prisoners, trade treaty), fired at 50% chance with `pick`. No modern actions, no data-driven catalog, no deportation action (#169).
- **Predicate gating (shipped):** `Predicate`/`evalPredicate`/`eraGraph` exist but are wired 1772-only (#258). No "law X active" predicate; no legislation-state-conditioned availability.
- **Era reachability (shipped):** only 1772 & 1856 scenarios ship. `Era` = `independence | federalism | nationalism | modern` — no `future` (`types.ts:1337`). The 2025-2029 window maps to the 16-window start roster (b60, 2024-2026) + the future-era gap (b57). **All content here is 0% reachable today.**

## Delta list — maps to EXISTING gap IDs (consolidation owns assignment)

- **#303** (tariff-rate magnitude, b52 `40a3bac2`) — CORROBORATES. The "increase tariffs on allies" Pres Action wants graduated rates. **NEW (consolidation to ID): Congress-must-approve-tariffs gate** — the Tariff Review Act adds a legislative-approval *gate* on executive tariff-setting, a distinct mechanic from rate magnitude; likely a sub-item of #303 or a new adjacent gap.
- **#169** (exec-action content, b58 stub `phaseRunners.ts:3632-3646`) — CORROBORATES. Adds two modern exec-action instances: the tariff Pres Action and the deportation Pres Action.
- **#258** (predicate-gated availability, b61) — CORROBORATES. The Alien-&-Sedition-active deportation is a legislation-state-gated content instance. **NEW (consolidation to ID): a "law/legislation-active" predicate** (availability gated on a prior bill being in force) if #258's predicate set doesn't already cover legislative state.
- **#221 / #206** (modern content + era-band) — CORROBORATES the modern content catalog + era-band cluster.
- **Future-era gap (b57)** + **Trump-2.0 content (b58, `df11a769`)** — CORROBORATES. Same 2nd-term window; this is an additive content list for it.

## Open questions

- Does the Tariff Review Act's "Congress must approve" belong under #303 (tariff subsystem) or a general "legislative gate on executive powers" mechanic? (Deferred to consolidation.)
- Is "Alien & Sedition Acts active" the first of a broader "which laws are in force" flag set, or a one-off? The founding/modern eras both plausibly want a persistent enacted-law registry to gate downstream events.
