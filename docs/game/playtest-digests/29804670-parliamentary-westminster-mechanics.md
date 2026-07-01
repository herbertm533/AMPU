# Digest — "Can we run a playtest to try out Parliamentary mechanics in the Constitutional Convention" (`29804670`)

- **Type:** parliamentary / Westminster government-structure design idea (playtest proposal)
- **Source:** `docs/game/sources/29804670-can-we-run-a-playtest-to-try-out-parliamentary-mechanics-in-the-constit/` — 4 posts, ~513 chars, chunk-001.md
- **Scope:** one concrete government-structure variant (Westminster) framed as an outcome the Constitutional Convention should be able to produce, plus a cheap way to playtest it.
- **Code-verified against** `src/` HEAD `982cb57`.

> **Why it matters:** This is a *concrete instance* of the already-logged "radically-different governing structure" wish (`8a0a14a1` → gap **#301**, the b51 `radicalstructure` structural-flexibility cluster). It names the single most-requested alternative government form — a **Westminster/parliamentary system with no separate presidency** — and pins exactly what the shipped model cannot express: the Constitutional Convention's `executive` article has options but they are **never read downstream**, and the game hard-couples a separately-elected `presidentId` distinct from the `speakerId`. It SHARPENS #301 with the specific "House-only + Speaker-as-executive" shape; it does not open a new gap.

---

## ★ The Westminster rule: House-only legislature + Speaker as de-facto executive (POST 1)

> "It would basically be this. Only US House and Speaker of the House is de-facto president." (POST 1)

The proposed government structure has two coupled parts:
1. **No separate presidency.** The executive is *fused* into the legislature — there is no independently-elected President.
2. **The Speaker of the House IS the executive.** Whoever commands the House majority (the Speaker) governs "as de-facto president" — a Westminster/prime-minister model.

Jokingly branded **"AMPUK" / "Ampuke"** (POSTs 2-3) — a UK-flavored variant. POST 3: "But would be cool..." — i.e. a genuine playtest ask, not just a bit.

## ★ Framed as a Constitutional-Convention outcome (thread title)

The thread title places this squarely at the **Constitutional Convention**: the parliamentary structure is something the players want the ConCon to be able to *choose/produce*, not a hardcoded scenario. This is exactly the framing of gap **#159** (the founding per-article ConCon machine, `ted1772`) and the "underpowered/non-CPU-pushable alt-Convention outcomes" limb of **#301** — the Convention is supposed to be able to yield ahistorical constitutions, and Westminster is a maximal example.

## ★ Implementation idea: borrow the 1772 playtest gamestate, CPU the factions (POST 4)

> "Maybe we can 'borrow' the 1772 playtest gamestate and try to play and CPU the faction as if a westminsterian Congress was established. Maybe it's less of an hassle than to initialize a brand new game." (POST 4)

Proposed method: **reuse an existing 1772 gamestate** and run all factions as CPU "as if a Westminsterian Congress was established," rather than standing up a fresh game. This is a *test-harness / start-anywhere* idea (reuse a snapshot to exercise a structural variant) — overlaps the scenario-boot / start-from-existing-state cluster (**#115 / K4** scenario-boot; the "borrow a gamestate to test a variant" motive is the informal ancestor of a boot-AT-a-variant, cf. #301's "scenario the scenario can't express" and #332's "scenario-boot-AT-a-ConCon" limb). Note: this was a *forum spreadsheet* convenience (cheaper than re-initializing by hand); in the browser build the analogue is a scenario/config toggle, not a manual snapshot copy.

---

## Shipped-vs-designed (verified against `src/` HEAD `982cb57`)

**The shipped government is hardcoded presidential separation-of-powers. A parliamentary/Westminster option is 0% built.**

- **ConCon offers an `executive` article, but only presidential variants — and it is never read.** `makeConvention` (`constitutionalConvention.ts:16-24`) offers three `executive` options: `elected_president`, `congressional_president` ("President elected by Congress"), `executive_council` ("A multi-member council, no single executive"). **None fuses the executive into the House / makes the Speaker the executive.** `executive_council` is the *closest* (a plural executive) but is still a body distinct from the legislature. Critically, per #301's code-verify the whole `ConstitutionalArticles` record (incl. `executive` and `legislature`) is **stored but never read downstream** — `applyConvention` writes `snap.game.constitutionalArticles` (`:145`) and nothing consumes it. The government shape is hardcoded regardless of the vote.
- **Separate President is hard-coupled.** `snap.game.presidentId` (`types.ts:1349`, `:1567`) is set exclusively by `runPhase_2_9_4_PresidentialGeneral` (`phaseRunners.ts:3752`, `snap.game.presidentId = winner.id` `:3803`) — a national presidential general election that always exists in presidential years. There is no phase, article, or flag that suppresses the presidency or routes the executive to the House majority.
- **Speaker is a legislative office with zero executive coupling.** `SpeakerOfHouse` (`types.ts:1128`) and `snap.game.speakerId` (`types.ts:1581`) are set by the House-leadership logic (`phaseRunners.ts:1854,1871`); the Speaker is read only for display (`CongressPage.tsx:15`, `Dashboard.tsx:17`). `speakerId` and `presidentId` are **independent fields** — the Speaker never governs. `grep` for `de.?facto` / Speaker-as-executive coupling = 0.
- **House-only / no-Senate legislature is inert.** The `legislature: 'bicameral' | 'unicameral'` article + field (`constitutionalConvention.ts:8-15`, `types.ts:1391`) is never read; legislature is hardcoded bicameral (CC → House + Senate; 1856 hardcodes `'bicameral'`). So even the *first half* of the Westminster rule (House-only) has an inert data slot but no mechanic — already captured in #301(a).
- **No structural transition to a fused-executive form.** No `governmentForm` / parliamentary / Westminster flag anywhere in `src/` (grep = 0, consistent with #236's finding for the fascist/communist/theocratic axis). The government is separation-of-powers (President + Congress + Court) by construction.

**Net:** shipped = hardcoded presidential separation-of-powers; the ConCon's government-structure articles are recorded-but-inert; parliamentary/Westminster (House-only + Speaker-as-executive) is **0% built** and *not expressible* by the current scenario/types model.

---

## Delta list — maps to EXISTING gap IDs (no new IDs assigned; consolidation owns the gap log)

| # | Delta / requirement | Maps to | Verdict |
|---|---|---|---|
| D1 | **Westminster government structure = House-only legislature + Speaker/House-majority as the executive (no separate President).** Concrete, named instance of the "radically-different governing structure" wish. | **#301** (b51 `radicalstructure` structural-flexibility cluster — already covers unicameral/no-Senate + underpowered alt-Convention outcomes + non-representable exec forms) → **SHARPEN** with the specific fused-executive/Westminster shape. Origin thread of #301 is `8a0a14a1`. | SHARPENS #301 |
| D2 | **The ConCon `executive` article must be able to yield a fused (parliamentary) executive AND be actually read/enforced.** Today it offers only presidential variants and is inert (stored, never consumed). | **#159** (founding ConCon per-article machine → ahistorical constitutions) + **#301** (the "non-CPU-pushable / underpowered alt-Convention outcomes" limb) + **#236** (alt-government-form axis). | SHARPENS #159/#301/#236 |
| D3 | **Removing the separate presidency + routing the executive to the Speaker/House majority requires decoupling `presidentId`/`runPhase_2_9_4` from being unconditional.** Shipped model hard-couples a separately-elected President. | **#301** (types/scenario model "cannot express" these structural modes). | SHARPENS #301 |
| D4 | **"Borrow the 1772 gamestate, CPU all factions as if a Westminster Congress was established"** — reuse an existing snapshot to playtest a structural variant instead of re-initializing. | Overlaps **#115 / K4** scenario-boot / start-from-existing-state; touches #332's "scenario-boot-AT-a-ConCon" limb. Test-harness motive, not a mechanic. | Corroboration of #115/K4 (context) |

**No NEW gap.** A distinct "government-structure-at-ConCon" gap is already owned (the ConCon executive/legislature articles under #159, and the "articles are inert / structural modes inexpressible" cluster under #301, with the alt-government-form axis under #236). This thread adds specificity, not a new area.

**Note on the brief's #74 reference:** the brief tagged this "#74 radically different governing structure." In the current KB **#74 is the CPU legislation-voting / vote-by-cross-party-damage heuristic** (roadmap L1966/5066/5074), not a governing-structure gap. The "radically-different governing structure" digest is `8a0a14a1`, whose canonical gap-log home is **#301** (b51 `radicalstructure` cluster). This digest therefore maps to **#301** (primary), #159, #236 — not #74. Flagging for consolidation to reconcile the ID.

## Open questions (for the human / consolidation)

- **Speaker-selection under Westminster:** in a fused system the Speaker/PM is the House-majority leader — does the existing Speaker-election logic (`phaseRunners.ts:1854-1871`) become the executive-selection mechanism, or is a confidence/majority-formation step needed (coalitions across the 10 factions)?
- **Cabinet / presidential phases (2.9.x, 2.3 cabinet):** under Westminster the ~30 governing/implementation phases keyed to `presidentId` would need to re-target the Speaker or a majority-appointed cabinet. Scope unclear from this short thread.
- **Trigger:** the thread ties this to the *founding* ConCon (via the 1772 borrow). Is Westminster a ConCon-choosable outcome only, or also a mid-game #332 crisis-convention outcome? Thread implies founding-ConCon.
- **ID reconciliation:** confirm this consolidates to #301 (+#159/#236), and that the brief's "#74" is a numbering slip.
