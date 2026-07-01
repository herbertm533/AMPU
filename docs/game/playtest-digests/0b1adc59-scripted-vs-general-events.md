# Digest — Scripted vs. general events (0b1adc59)

- **Thread:** `0b1adc59-what-new-events-have-been-added-so-far`
- **Source:** `docs/game/sources/0b1adc59-what-new-events-have-been-added-so-far/` (1 chunk, 2 posts, ~0.5k chars)
- **Era/years:** none stated — modern-era forum meta-thread, dated 10/5/2022
- **Type:** thin event-type clarification Q&A (single GM answer)
- **Why it matters:** tiny thread, but it names — in the GM's own words — the
  game's two-category event taxonomy, which corroborates the shipped split
  between authored, response-bearing events and random recurring pop-ups.

## ★ The scripted-vs-general event-type distinction (shipped-model corroboration)

A player asks whether real-world events (a recent hurricane; the Ukraine war)
get in-game events you can respond to (POST 1). The GM's whole answer (POST 2):

> "Ukrainian war is a **scripted event**. There are some possible responses.
> Hurricanes are **general events that pop up regularly from time to time**."

That is the entire substance — a clean two-category model:

| GM term | Meaning | Response affordance | Shipped type |
|---|---|---|---|
| **Scripted event** | specific, authored occurrence (e.g. Ukraine war) | "some possible responses" — the player chooses | `EraEvent` |
| **General event** | recurring, pops up regularly / randomly (e.g. hurricanes) | no rich response tree implied — it just happens | anytime event (`AnytimeEventTemplate` / `AnytimeNationalEvent`) |

This maps 1:1 onto the shipped types:

- **Scripted → `EraEvent`** (`src/types.ts:1466`): authored, `year`-anchored,
  carries `responses: EraEventResponse[]` (id/label/description/effect) and a
  `decider` (`'president' | 'congress' | 'cabinet' | 'cc-president' | 'auto'`).
  Authored in `src/data/eraEvents1772.ts` / `eraEvents1856.ts`; sequenced as
  era-graph nodes via `templateId` + serializable `Predicate` preconditions
  (`src/types.ts:1487`, engine `src/engine/eraGraph.ts`). The Ukraine-war case =
  exactly this shape (a scripted node with `responses[]`).
- **General/recurring → anytime events** (`src/data/anytimeEvents.ts:3`
  `AnytimeEventTemplate`; also `anytimeNationalEvents.ts`): `weight`-driven
  random pop-ups, no player response tree — just `effects[]` applied when they
  fire. The hurricane case = a general/national anytime pop-up.

Honest nuance: the shipped `AnytimeEventTemplate` catalog is mostly *per-
politician* pop-ups (illness, scandal, duel, breakthrough), while a "hurricane"
reads as a *national* pop-up. The build has a separate `anytimeNationalEvents.ts`
for national-scope pop-ups; both live in the same "general/recurring" category
the GM describes, distinct from scripted `EraEvent`s.

## Shipped-vs-designed

- **Match.** The GM's two-category taxonomy is already the shipped model:
  authored `EraEvent`s with `responses[]`/`decider` vs. weight-driven anytime
  pop-ups. No mechanic here is missing from the build.
- The one soft signal is *scope*: hurricanes imply national-scope recurring
  events. The build supports this (`anytimeNationalEvents.ts`), so it is
  corroboration, not a gap — no evidence the thread asks for anything unbuilt.

## Delta list

Corroboration only — no new mechanical delta. Maps to the existing content /
event cluster; assign no new gap IDs.

| Area | Finding | Maps to (existing) |
|---|---|---|
| Event taxonomy | GM confirms scripted-vs-general two-category model | #221 (content primitives), #258 (event-graph) |
| Scripted events | "scripted event … some possible responses" = `EraEvent.responses[]`/`decider` | #258 (event-graph), #221 |
| General/recurring events | "pop up regularly from time to time" = anytime pop-ups (`AnytimeEventTemplate` / national) | existing anytime-events system (cluster w/ #221) |

**No new gaps.** No new mechanical delta — corroborates the shipped
`EraEvent`-vs-anytime-event two-category model.
