# Digest — "AMPU Question: Tulsi Gabbard" (topic 1572, Oct 2022)

- **Slug:** `036f0dce-ampu-question-tulsi-gabbard`
- **Source:** `036f0dce-AMPU_Question_Tulsi_Gabbard.csv` → 1 chunk, 14 posts (~6.4k chars; chunk `wc -l` = 94)
- **Type:** Dataset-classification + ideology-model **design discussion** (not a playtest).
- **Date:** 16 Oct 2022. **Participants:** vcczar (a practicing political scientist), OrangeP47, Rodja, MrPotatoTed.
- **Scope:** One real-time hard-case (Tulsi Gabbard, mid-2022 party exit) used as a lens onto two standing systems: the **7-point ideology model** and the **independent / party-flip trait handling**. Era framing: modern-day ("Era of Populism" 2012+, see `docs/game/historical-context.md` for the Trump-era populism backdrop).
- **No code shipped in-thread.** Findings below are designer intent vs. the current build, verified against `src/`.

---

## ★ HEADLINE — the 7-point ideology model has no axis for non-ideological / "pure" populism (DESIGNER-ACKNOWLEDGED, DEFERRED)

The core design finding (POST 9-14). The discussion converged on a real limitation of the shipped model, then **explicitly chose not to fix it yet**:

- POST 9 (OrangeP47): Gabbard is *"more of a pure populist than Sanders or Trump… populist without any real ideological restrictions. She's advocating instinct more than policy."*
- POST 10 (vcczar): *"'personal gain' is not on the ideological spectrum so I couldn't rate where it falls."*
- POST 11 (OrangeP47): *"pure populism (non-ideological) among politicians is almost exclusively driven by personal gain or ambition."*
- **POST 12 (vcczar, the headline):** *"our 7 point model doesn't really account for that. It's probably why people with extreme views sometimes get mistaken for 'moderate'."* → i.e. an ambition-driven figure with no fixed ideology has no home on `LW Populist … RW Populist`, so the rater defaults them toward the **center** — a **systematic mis-classification**, not a one-off.
- **POST 13 (OrangeP47, the deferral):** *"I'll change the model if we get many more Gabbards. She's sort of like a 1 in 1,000 case."*
- **POST 14 (vcczar, the floated fix):** *"making the call on LW/RW for pop, and then having a trait about it would probably be the simplest thing. If it came to that. But… there's not enough pols that fit the description to make it worthwhile at this point."*

**Two deferred fix options on record:**
1. **Cheap / preferred:** keep the 7-point scale, force a left/right populist call, and add a **dedicated "pure / non-ideological populist" trait** to flag the ambition-driven distinction (POST 14).
2. **Expensive:** expand the ideology model itself with a new axis (POST 12-13) — judged **not worth it** at current population.

**Status: LIMITATION acknowledged by the model's own author (a political scientist); fix DEFERRED behind a "many more Gabbards" trigger.** This is a known accuracy ceiling of the ideology model, not a bug to file. Roadmap relevance is contingent: revisit only if extreme-but-non-ideological figures become common (later eras; populist-heavy scenarios).

- Minor / illustrative (POST 8): a "horseshoe theory" aside — OrangeP47 *"couldn't wrap around Douglas MacArthur II to LW Pop"* in the 1960 run. Same model gap (the two populist poles don't meet), explicitly **facetious** and disavowed; not a separate ask.

---

## Interim handling captured by the thread (the in-flux figure problem)

These are the workarounds the team actually used in 2022 for a figure mid-switch, *short of* the deferred model change.

### Independent → "caucus-with-a-party" mechanic (POST 1)
- AMPU has **no Independent party** as a primary affiliation. *"independent politicians have to take a side to 'caucus with.' So Sanders and Angus King are Blue."* (POST 1). An independent is mapped onto BLUE/RED by their caucus, not stored as a third party.
- Open at the time: should Gabbard caucus **Red** (she was campaigning for GOP candidates in NH against Dem incumbents)? Left unresolved — see snapshot caveat below.

### Traits "Can be Independent" + "Can Party Flip" (POST 2-3)
- The resolution for an **in-flux** figure: assign **two traits** rather than hard-set a party-switch event (POST 2, vcczar: *"Since she isn't GOP officially yet, I would just give her Can be Independent and Can Party Flip traits."*).
- POST 3 (Rodja, the implementer): Gabbard *"has the former [Can be Independent]. I'll give her the latter [Can Party Flip]."* → confirms both were real Excel-era trait tags applied to live records.
- Cross-ref **b44**: the "1% chance to GAIN can-party-flip" rule (#279) and the trait-transfer cluster (#129) — these traits are part of a broader can-flip / trait-mobility system, here applied manually to a known real-world flip.

### Party-switch date convention (POST 1)
- Historical figures can carry a **party-switch date** (a year at which their affiliation flips). The thread's lead question was whether to set Gabbard's to **2022** (and flip her Blue→Red). **Declined** — judged premature; the traits-only handling (above) was used instead.

### Dataset = a real-time SNAPSHOT, revised as events unfold (POST 7)
- vcczar (POST 7): classifying a currently-active figure is inherently provisional — *"the moment is too active to say for sure… my professional opinion as a political scientist is that the moment is too active to say."* The dataset captures a **point-in-time call**, expected to be revised.
- Reinforces the standing **"dataset is a snapshot, not a final verdict"** convention (cross-ref the b41 / b42 snapshot corrections). The active-figure case is the sharpest expression of it: an entry can be deliberately left "behind" reality until the dust settles.

---

## Shipped reality check (verified against `src/` + runtime dataset)

| Thread concept | In the build today | Note |
|---|---|---|
| 7-point ideology scale | **SHIPPED, exact.** `src/types.ts:5-12` `Ideology = 'LW Populist' \| 'Progressive' \| 'Liberal' \| 'Moderate' \| 'Conservative' \| 'Traditionalist' \| 'RW Populist'` (also `IDEOLOGY_ORDER`, line 14). | Matches the model the thread critiques. No pure/non-ideological-populist axis or flag exists. |
| Non-ideological-populist axis / trait | **ABSENT.** No such `Ideology` value and no such `Trait` (full union `src/types.ts:62-117`). | The deferred fix (POST 14) was never built — consistent with the explicit deferral. |
| `Can be Independent` trait | **ABSENT** from shipped `Trait` union (`src/types.ts:62-117`). | 2022 Excel-era concept; not in the regenerated TS model. |
| `Can Party Flip` trait | **ABSENT** from shipped `Trait` union. Nearest shipped trait is **`Flip-Flopper`** (`types.ts:98`) — but that is a *negative electoral* trait (instability penalty), semantically distinct from a party-affiliation/can-flip flag. | No mechanic in the current build flips a politician's party at runtime via a trait. |
| Independent party / caucus field | **ABSENT.** `PartyId = 'BLUE' \| 'RED'` only (`src/types.ts:3`); no INDEPENDENT value, no `caucus`/`party`/`switchYear`/`partySwitchDate` field found on the politician model. | The "caucus-with" mapping (POST 1) is a pre-import authoring step, not stored state. |
| Party-switch date | **ABSENT** as a dataset/runtime field (no `switchYear`/`partySwitch` in `types.ts` or the dataset schema). | The convention discussed never became a shipped per-politician field. |
| **Gabbard's actual shipped record** | `public/standard-draft-classes.json`: `Tulsi Gabbard, draftYear 2008, state hawaii, ideology **"Liberal"**, traits **[]**, legislative 3, all else low.` | **Confirms the POST 12 prediction.** She shipped neither `RW Populist` nor any flip/independent trait — she landed mid-scale ("Liberal", one step off Moderate), the exact "extreme views → mistaken for moderate" outcome. The 2022 interim traits did **not** survive into the regenerated runtime dataset. |

> Pipeline note: `public/standard-draft-classes.json` is **generated** (see CLAUDE.md draft pipeline) from `congress-legislators` + curated rows; per-row hand-tags like the 2022 `Can be Independent`/`Can Party Flip` traits live in the old Excel/author flow and are not represented in the current generator's `Trait` vocabulary — which is why they're gone.

---

## Open questions (for the human)

- **Is the deferred ideology fix still deferred?** The "many more Gabbards" trigger (POST 13) is subjective. Has the modern/populist-era roster grown enough (Trump-era + later) to justify either a non-ideological-populist **trait** (POST 14, cheap) or an **axis** (POST 12, expensive)? If yes, this is a model change, not a data fix.
- **Do `Can be Independent` / `Can Party Flip` need a home in the shipped model at all?** They were live in 2022 Excel data but are absent from the current `Trait` union and dataset schema. Were they (a) intentionally dropped, (b) folded into `Flip-Flopper` / the b44 can-flip system, or (c) lost in the dataset regeneration? Cross-ref b44 #279/#129 before assuming intent.
- **Should "caucus-with-a-party" be stored?** Real independents (Sanders, King, in-flux Gabbard) are currently flattened to BLUE/RED at authoring time. If an in-game Independent status is ever wanted, the model needs an INDEPENDENT `PartyId` + a caucus pointer — neither exists today.
- Gabbard's shipped `ideology: "Liberal"` predates her Red turn. Per the snapshot convention (POST 7) this is *expected* to be stale — but flag whether the live dataset should now reflect the post-2022 RW shift.

---

## Deltas vs current build (handoff)

1. **★ Ideology model gap — DESIGNER-DEFERRED (not a bug).** The shipped 7-point `Ideology` scale (`types.ts:5-12`) has **no axis/flag for non-ideological, ambition/personal-gain-driven "pure" populism**; such figures get pulled toward the **center** and **mis-rated as moderate** (POST 12, by the model's own author). Two recorded fix options: a left/right-pop call **+ a dedicated trait** (cheap, POST 14) or a **new model axis** (expensive, POST 12-13). Both **explicitly out of scope until "many more Gabbards"** (POST 13). Revisit only if extreme-non-ideological figures become common.
2. **`Can be Independent` + `Can Party Flip` are the documented interim handling for in-flux figures** (POST 2-3), but **neither exists in the shipped `Trait` union** (`types.ts:62-117`). Nearest shipped analog `Flip-Flopper` is a different (negative-electoral) concept. Decide: re-add, fold into the b44 can-flip system (#279/#129), or confirm dropped.
3. **No Independent party / caucus model in code.** `PartyId = 'BLUE' | 'RED'` only (`types.ts:3`); the "independents caucus with a side" rule (POST 1) is an authoring-time flatten, not stored state. Any future in-game Independent status needs an `INDEPENDENT` value + caucus pointer.
4. **Party-switch-date convention is unimplemented** (POST 1): no `switchYear`/`partySwitchDate` field on the politician model or dataset schema.
5. **Snapshot-classification convention reaffirmed** (POST 7): the dataset is a deliberately-provisional point-in-time call for active figures, revised as events unfold — no code delta, but it governs how stale entries (e.g. Gabbard's shipped `ideology: "Liberal"`, traits `[]`) should be read. Cross-ref b41/b42 snapshot corrections.
