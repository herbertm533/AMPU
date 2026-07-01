# Digest — Era of Independence poll (`cebb576a`)

- **Slug:** `cebb576a-ampu-poll-era-of-independence`
- **Source:** `docs/game/sources/cebb576a-ampu-poll-era-of-independence/` — 1 chunk, 4 posts, ~1.8k chars, Oct 2022
- **Type:** light community poll / flavor. Not a playthrough.
- **Era:** 1772 "Era of Independence" (founding scenario).

## Why it (barely) matters
A social poll from early playtest days: players pick a **home state** for their
1772 persona and the **politician they're most excited to play**. Near-zero
mechanical content — it corroborates two things already in the design and adds
no new mechanics. Kept only for provenance and as two thin datapoints.

## ★ Mechanical footnotes (the only two)

- **Home-state choice is flavor, not a mechanic** (POST 2). One player recalls
  picking Rhode Island for 1772 by "threw a dart at the board … no real reason,"
  would pick NY as a "conscious decision," or PA "given family history." Treated
  as pure roleplay; no home-state rule (bonus, starting seat, etc.) is invoked.
  *Code check:* `Politician.state` is a dataset field (types.ts:1255); there is
  no player-chosen home-state field — the state-adjacent fields are relocation
  only (`altState`/`altStateSeeded`/`lastRelocationAttemptYear`, types.ts:1256-58).
  State assignment is dataset-driven, consistent with the thread's roleplay read.

- **John Jay = maximally versatile across offices** (POST 3). Praised as able to
  be "President, Gov, Chief Justice, Diplomat … a realistic path to achieve it
  all." A dataset datapoint on multi-office-capable pols, not a mechanic.
  *Code check:* fully expressible — `Skills` spans `admin, legislative, judicial,
  military, governing, backroom` (types.ts:32-41) plus separate `command`
  (types.ts:1281). A pol high across all of these is a dataset value; the bundled
  classes are generated (do NOT hand-edit `defaultDraftClasses.ts` /
  `standard-draft-classes.json`). Color notes only: John Adams "hasn't lived up
  to his real-life self in most playtests" (POST 3); Benjamin Rush floated as a
  fun underdog beyond "Father of American Psychiatry" (POST 4).

## Shipped-vs-designed
No gap. Both footnotes are corroborated by the current model: the
`Skills`/`Politician` types support a versatile-across-offices profile, and there
is no home-state-selection mechanic (matching the thread's flavor treatment).

## Delta list
- **No mechanical delta.** Corroboration only; zero new gaps.
- Multi-office versatility (John Jay) → corroborates the existing
  **politician skills/command model** (`Skills` + `command`). CORROBORATION.
- Home-state pick is roleplay → corroborates that **state assignment is
  dataset-driven**, with no player home-state mechanic; cross-ref existing
  **alt-state / relocation** gap(s) (`altState*`). No new item — flag NEW only if
  consolidation later decides a "designed home-state selection" gap is warranted
  (thread gives NO evidence for one).

## Open questions
None material. (Whether a home-state *selection* feature was ever designed is not
answerable from this poll — the thread treats state as flavor and shows no such
rule.)
