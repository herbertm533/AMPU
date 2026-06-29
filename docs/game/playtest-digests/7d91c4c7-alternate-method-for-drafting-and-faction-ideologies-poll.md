# Digest — "Alternate Method for Drafting and Faction Ideologies" Poll (`7d91c4c7`)

**Type:** DESIGN / decision-poll thread (**Aug 27 2021**), **NOT a playthrough.**
10 posts / 1 chunk. GM **@vcczar** (tier-1, owns the decision; POST 1 is an
"email to myself" pasted in) + **@MrPotatoTed / Ted** (tier-1) and **@Cal**
(tier-3/4) supplying the core objection; @jvikings1 @DakotaHale @Hestia
@SilentLiberty @Rezi @Rodja @ConservativeElector2 tagged as voters (no rulings).
**Why it matters:** this is the **DIRECT COMPANION to `567b03c8` (Ideology Cards
Poll, same author, same Aug-2021 window)** and the **concrete SPEC the draft-
restriction gap (#4) was waiting for** — it gives **two fully worked era-banded
eligible-ideology matrices** (the per-(faction,era) draft profile), names the
**10-faction fixed structure**, the **parties-only** and **unrestricted** modes,
**asymmetric fringe scoring**, and **per-faction difficulty + per-faction game
awards**. It is the **immediate predecessor of `8189b724` (Faction Ideology
Default, Sept 2021)**, which formalized the same matrix as the per-era
"FactNumber" priority table (the **softened two-tier** version of *this* thread's
hard eligible set). **Provenance only — no living-doc edits.** Citations: `POST n`.

> **Term disambiguation (carry from `567b03c8`).** "Ideologies" / "ideologies
> allowed to draft" here = the **7-point PERSONAL-ideology scale** (`Ideology`,
> types.ts:5: LW Populist…RW Populist). This is **NOT** the shipped `IdeologyCardId`
> (types.ts:322 — 22 named policy/alignment cards). Keep them separate in the gap log.

---

## ★ The era-banded eligible-ideology MATRIX (vcczar, POST 1) — the spec #4 waited for

Premise (POST 1): *"Potential Change to make the game more realistic,
ideologically. There are 10 factions, 5 per major party. Each faction will evolve
over time."* Core rule: *"Each faction will be allowed to draft politicians of
specific ideologies allowed for them **in the Historical Era**. Most factions will
be allowed two ideologies… Some will sometimes be allowed three and some allowed
only one."* → the allowed SET is **per-(faction-slot, era)** and **SHIFTS across
eras**. Two eras are worked in full:

**Era of Independence (1774–1788)** — Blue mirrors Red exactly:

| Slot | Eligible ideologies |
|------|---------------------|
| Red 1 / Blue 1 | Progressive / Populist / Liberal |
| Red 2 / Blue 2 | Liberal / Moderate |
| Red 3 / Blue 3 | Moderate (**1 only**) |
| Red 4 / Blue 4 | Conservative / Moderate |
| Red 5 / Blue 5 | Traditionalist / Populist / Conservative |

**Era of Populism (2012–2024)** — Red and Blue now **diverge** (the slots have
drifted; party no longer mirrors):

| Slot | Red | Blue |
|------|-----|------|
| 1 | Moderate / Liberal | Populist / Progressive |
| 2 | Moderate / Conservative | Liberal / Progressive |
| 3 | Conservative / Moderate | Liberal (**1 only**) |
| 4 | Traditionalist / Conservative | Moderate / Liberal |
| 5 | Populist / Traditionalist | Moderate / Conservative |

**Key shape facts:**
- **Slot 3 is the lone single-ideology anchor** in both eras (Moderate early →
  Con/Mod (Red) or Liberal (Blue) by 2012) — concrete proof the matrix is
  era-keyed and shifts, *and* that the two parties desynchronize by the modern era.
- **LW/RW Populist split is slot-bound (POST 1):** *"Populists, LW Pop and RW Pop
  will be separated again and Red 1 and Blue 1 will pick LW Pop politicians and
  Red 5 and Blue 5, RW Pop."* → endpoint slots draw the *matching* populist wing,
  not "either Populist." (Contrast `8189b724` POST 3, where vcczar later relaxes
  to **either** wing in early eras because they historically overlapped — the two
  threads disagree on this detail; the later one supersedes.)
- This is the **HARD-SET** form (you may draft *only* the allowed set). `8189b724`
  later **softens** it to a two-tier priority ("draft your set FIRST, then anyone
  once the pool is off the board"). The shipped 1772 code already implements the
  *soft* form (see build section) — i.e. the build matches the **later** thread.

---

## The other proposed mechanics (POST 1)

- **★ 10-faction FIXED structure + historical naming.** *"There are 10 factions,
  5 per major party… Players will get to **name their faction or pick from a list
  of historical names** ('Bourbon Democrats' 'New Democrats' etc.)."* Each faction
  **evolves over eras** (the matrix above is how). *"There will always be 10
  factions."* Non-human factions are CPU (POST 3, Ted endorses).
- **★ Asymmetric fringe scoring.** *"I'm going to **increase the points earned for
  fringe ideologies based on how uncommon** I think that party can score a
  success. They will **not be penalized any more for failing** in attempting that
  success, however."* → **reward-up, no added downside**: scoring a fringe success
  pays more (scaled by rarity), but a failed fringe attempt costs nothing extra.
  Deliberate asymmetry to offset the thin fringe draft pool (the populist-scarcity
  flaw raised in `567b03c8` POST 4).
- **★ Per-faction difficulty + per-faction game awards.** *"I think there should
  be **game awards for winning as each faction**… I don't think it will be a big
  deal that some factions have **innate strengths over others**. Players can
  **choose their difficulty based on the faction they select**."* → factions are
  *intentionally* unbalanced; faction choice **= difficulty selector**; an
  award/achievement per faction-win rewards clearing the hard ones. (Difficulty =
  faction × era, per the matrix.)
- **Rollout + optional modes.** Would start at **1788 (Era of Federalism)** —
  *"This will likely require adjusting the factions."* Plus two optional modes:
  **(a) parties-only** — *"modes in which there are no factions, only parties for a
  two player game"*; **(b) unrestricted** — *"an option to allow play without
  restrictions to ideologies."* (Same default-vs-alternate axis `8189b724` calls a
  SETTING and the settings-umbrella catalogs.)

---

## ★ The design TENSION (the playtesters' core objection) — durable content

The proposal drew immediate, substantive pushback that fixed eligibility **kills
the strategic ideology-shifting game** — the same realism-vs-legibility / coalition-
vs-ideology tension `567b03c8` POST 6 raised, now stated as a *fun* regression:

- **Cal (POST 4):** the hard matrix *"will significantly hamper my faction and the
  way I've planned for the future if I lose all moderates"* — he holds **18/27
  Moderates** and *"had planned on **ideology shifting to Conservative** at the
  earliest mark."* Forcing the eligible set **destroys a built, mid-game plan.**
- **MrPotatoTed (POST 5):** *"a **big part of strategy is drafting/shifting
  ideologies/etc to keep up with the times**. We did one playthrough where
  everyone's ideology and statesmen were **mandated** to them, and that seemed to
  be the **least fun version** of the game we'd played so far."* → an
  **empirically-tested verdict**: a prior fully-mandated run was the worst one.
- **vcczar's fallback (POST 6):** *"I could have you guys **pick which of these 10
  factions** you want to play. You keep your score, and we just do a 'draft' of
  the active players."* → retreat from forced-assignment to **pick-your-faction +
  keep score** (POST 8 confirms: 8 humans + 4 CPU; vcczar takes the unwanted
  factions as CPU *"so you're not stuck with traditionalists"*).
- **POST 9 (synthesis):** *"Maybe there's a way to **allow all these options as
  options**."* — i.e. ship hard-set / soft-priority / unrestricted all as modes.
- **POST 10:** *"Was there a decision on this? It will affect my ideology shifting
  strategy."* → **no decision reached in-thread**; the resolution is `8189b724`
  (the softened two-tier "default mode"), which preserves shifting by letting you
  draft outside the set once it's exhausted.

**The unresolved knot:** a hard eligible-set is *realistic + legible* but
**amputates the ideology-shifting metagame** that the veteran players value most.
The corpus answer (next thread) is the **two-tier soft priority**, not the hard set.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-29)

**Net:** the build implements the **soft two-tier** matrix (the `8189b724` form),
**but only for the 1772 inaugural draft**; the **hard era-banded matrix across all
eras, the 10-faction naming/structure-as-feature, parties-only/unrestricted modes,
asymmetric fringe scoring, and per-faction difficulty/awards are all UNBUILT.**

- **★ Era-banded eligible-ideology matrix — PARTIALLY SHIPPED (1772 inaugural only;
  soft form).** A real **`eligibleIdeologies: Ideology[]`** field exists, but
  **only on `Faction1772`** (`factions1772.ts:7`), populated per-faction
  (`:12–23`) — and the values **closely match this thread's Independence column**
  (slot1 Prog/Pop/Lib, slot2 Lib/Mod, slot3 Mod-anchor, slot4 Con/Trad, slot5
  Trad/RW-Pop; Red5 even gets the 3-wide `['Conservative','Traditionalist','RW
  Populist']`). The draft consumes it via `getEligibleIdeologies`
  (`phaseRunners.ts:28–31`) + `pickBestForFaction` (`:33–53`), but **only when
  `isExpansion1772`** (`:38–39`: `scenarioId === '1772' && year === startYear`).
  It is the **soft two-tier** form, not this thread's hard set:
  `const strict = eligible.filter(p => eligIdeos.includes(p.ideology)); pool =
  strict.length>0 ? strict : eligible` (`:41–44`) — i.e. *prefer* the set, fall
  back to anyone when empty. Scoring adds `+50` for an in-set ideology on top of
  the `+25` personality match (`:49`). **LIMITATIONS:** (a) **`Faction1772`-only**
  field — **base `Faction` has NO equivalent** (types.ts:1293–1304: only
  `personality`/`ideologyCards`/`lobbyCards`/`interestCards`/`leaderId`); (b)
  **`factions1856.ts` has ZERO `eligibleIdeologies`** (grep: 0 matches); (c) gates
  **only the inaugural draft** — every later draft year (incl. all of 1856) falls
  through to the soft `personality`-bucket `+25` preference (`:45–48`). **So #4 is
  built in exactly ONE place; the gap is generalizing the matrix to all eras/draft-
  years and onto base `Faction`.**
- **No PER-ERA matrix / "FactNumber" table — NOT SHIPPED.** `eligibleIdeologies`
  is a **single static array per 1772 faction**, with **no era dimension**. The
  "shifts per Historical Era" core of the proposal (and the `8189b724` FactNumber
  table) has **no representation** — no era-keyed lookup, no second column. (grep
  `priorityIdeolog|draftIdeolog|factNumber|allowedIdeolog|ideologyRestrict` → 0.)
- **10-faction structure — present as a COUNT, not as the designed feature.** Both
  scenarios ship exactly **10 factions = 5/party** (`factions1772.ts` 10 ids;
  `factions1856.ts` 10 ids) — count matches. But the **player-facing feature is
  absent**: **no faction-naming UI**, no **historical-name picker** ("Bourbon
  Democrats" etc.), no notion of a faction *evolving its identity* across eras.
- **Parties-only mode — NOT SHIPPED.** No "no-factions, parties-only" mode; no
  settings framework at all (grep `partiesOnly` → 0).
- **Unrestricted-ideology mode — NOT SHIPPED as a toggle.** There is no
  *explicit* unrestricted setting; ironically the build is **de-facto
  unrestricted everywhere except the 1772 inaugural draft** (soft preference only),
  so "unrestricted" is the *current default* outside one moment — but it's not a
  player-selectable mode opposed to a restricted one.
- **Asymmetric fringe scoring — NOT SHIPPED.** `computePV` (pv.ts) has **no
  ideology/fringe/rarity/score term whatsoever** (grep `ideology|fringe|difficulty|
  award|score` in pv.ts → 0): PV is skills × office-weights + command + traits +
  prestige + age. Nothing rewards a fringe success or scales by rarity. Personal
  ideology **does not enter PV or elections at all.**
- **Per-faction difficulty + per-faction awards — NOT SHIPPED.** No
  faction-difficulty model and no awards/achievements system (grep
  `difficulty|award|achievement` → only Rev-War-tier `difficulty` (types.ts:539,
  545, 1363) + Rev-War files, **unrelated** to faction selection). Factions carry
  no difficulty rating and there is no per-faction-win award registry.

---

## Candidate gaps for consolidation

*(Map to EXISTING IDs where possible; consolidation owns numbering / the gap-log edit.)*

- **#4 (era-specific per-faction draft profile + off-profile/adjacency)** — **THE
  CONCRETE SPEC.** This thread supplies the **fully-worked era-banded eligible-
  ideology matrix** (two columns: Independence + Populism, both transcribed above)
  that #4 was a placeholder for, incl. the **slot-3 single-anchor**, the
  **2/3/1-ideology counts**, the **endpoint LW/RW-Pop slot binding**, and the
  **Red/Blue desync by the modern era**. **Build finding:** the *soft* form already
  ships **1772-inaugural only** (`factions1772.ts:7,12–23` → `phaseRunners.ts:28–53`,
  gated `:38–39`); **no per-era dimension**, **no base-`Faction` field**, **1856
  empty**. Pairs with `8189b724` (the FactNumber/soft-priority sibling). Cite POST 1.
- **#171 (era-keyed restriction ON early / OFF modern, toggle)** — **CORROBORATE.**
  The rollout-at-1788 + parties-only + unrestricted modes are the toggle's design
  space; the matrix *shifting per era* is exactly the "era-keyed" half. Cite POST 1, 9.
- **#298 (conformance / draftee → faction ideology)** — **CORROBORATE the COST.**
  Cal's objection (POST 4: losing 18/27 Moderates blows up his plan) is the lived
  consequence of forcing pols to fit a faction's eligible set; build does **NOT**
  conform draftees (`recordDraftPick` `:55–75` never mutates `p.ideology`). Cite POST 4, 5.
- **#262 (content-balance / fringe scoring)** — **ATTACH the SPEC.** The
  **asymmetric fringe scoring** (reward scaled by rarity, **no extra fail
  penalty**) is the concrete scoring rule #262 needs. **0% built** (pv.ts has no
  ideology/fringe term). Cite POST 1.
- **#293 (difficulty = faction-ideology × era)** — **ATTACH the SPEC.**
  *"Players can choose their difficulty based on the faction they select"* +
  factions have *"innate strengths"* = difficulty is the faction×era cell. **0%
  built** (no faction-difficulty field). Cite POST 1.
- **#247 (faction-lean)** — **CORROBORATE.** The per-slot eligible set is the
  sharpest statement of each faction's ideological lean (and how it migrates per
  era); build models lean only as the 3-bucket `personality` (types.ts:1297) +
  the 1772-only `eligibleIdeologies`. Cite POST 1.
- **★ CANDIDATE NEW — 10-faction structure-as-feature: faction naming +
  historical-name picker + per-era identity evolution.** Distinct from the bare
  count (already 10/party). **0% built** beyond the count: no naming UI, no
  historical-name list, no era-evolving faction identity. Cite POST 1.
- **★ CANDIDATE NEW — Parties-only mode (no factions, 2-player).** A draft/play
  mode collapsing factions to parties. **0% built**; no settings framework. Cite POST 1.
- **★ CANDIDATE NEW (or sub-row of #263/#171) — Unrestricted-ideology mode as an
  explicit toggle.** Player-selectable "no ideology restrictions" mode opposed to
  the restricted matrix. **Not shipped as a toggle** (build is de-facto
  unrestricted outside 1772-inaugural). Cite POST 1, 9.
- **★ CANDIDATE NEW (likely sub-row of #293) — Per-faction game awards /
  achievements.** An award for *winning as each faction* (rewards clearing the
  hard ones). **0% built** (no achievements system). Cite POST 1.
- **[TERMINOLOGY — flag] "ideology" here = 7-point personal scale, not
  `IdeologyCardId`.** Same collision flagged in `567b03c8`. Cite POST 1; types.ts:5 vs 322.

---

## Open questions (carry forward)

- **Hard-set vs soft-priority — which is canonical?** This thread proposes the
  **hard** eligible set; `8189b724` + the build use **soft two-tier** (draft set
  first, then anyone). POST 9/10 leave it **undecided here**; treat `8189b724` as
  superseding. Confirm in consolidation.
- **LW/RW-Populist slot binding contradiction.** This thread (POST 1): slot 1 →
  LW-Pop *only*, slot 5 → RW-Pop *only*. `8189b724` (POST 3): populist slots draft
  **either** wing in early eras (historical overlap), diverging near the present.
  Which rule ships? (Build's 1772 data: `fact_blue_lw_1772` =
  `['LW Populist','Progressive']`, `fact_blue_rw_1772` = `['Traditionalist','RW
  Populist']` — i.e. **bound per wing**, matching *this* thread.)
- **Full per-era matrix.** Only Independence + Populism columns are given (POST 1);
  the intervening eras' cells (Federalism…Gilded…etc.) are unspecified here (and
  only Independence+Federalism appear in `8189b724`). Needed to fully spec #4.
- **Fringe-scoring magnitudes.** "Increase points… based on how uncommon" gives the
  *shape* but **no numbers** (how much, what rarity scale). Unspecified.
- **Faction-difficulty surfacing.** Is difficulty shown to the player at faction-
  select, and is it derived (from eligible-set width / pool size) or hand-rated?
  Unspecified.
- **What was the actual decision?** POST 10 asks; not answered in-thread → resolved
  in `8189b724` (soft "default mode"). Confirm the chain.

---

## Provenance notes

- Single chunk; all **10 posts** read. Substantive content is **POST 1** (the
  entire proposal: 10 factions, both era matrices, fringe scoring, difficulty,
  awards, modes, rollout), **POST 4** (Cal's built-plan objection), **POST 5**
  (Ted's "least fun version" verdict + the strategic-shifting defense), **POST 6**
  (vcczar's pick-your-faction fallback), **POST 9** ("allow all as options"),
  **POST 10** (no decision; affects shifting strategy). POSTS 2/3/7/8 are tag-list
  / quote-relays / CPU-assignment logistics.
- **Companion reading:** `567b03c8` (Ideology Cards Poll — the five-option decision
  space + Rand Paul Problem + populist scarcity, same author/window) and
  **`8189b724`** (Faction Ideology Default — the **softened two-tier FactNumber**
  resolution of *this* thread). Read all three together; this one is the **matrix
  spec**, `567b03c8` is the **option space**, `8189b724` is the **shipped-shape
  resolution**.
- **Dating: Aug 27 2021** (post timestamps) — one of the earliest design-origin
  threads; **immediately precedes `8189b724` (Sept 23 2021)**.
- Codebase verified at `src/` HEAD 2026-06-29: `eligibleIdeologies` is
  **`Faction1772`-only** (`factions1772.ts:7`), gates **only the 1772 inaugural
  draft** (`phaseRunners.ts:38–39`), soft two-tier (`:41–44`); base `Faction`
  (types.ts:1293–1304) and all of `factions1856.ts` have **no** such field;
  `computePV` (pv.ts) has **no ideology/fringe/difficulty/score term**; **no**
  per-era matrix, naming UI, parties-only/unrestricted toggle, fringe scoring, or
  faction-difficulty/awards system anywhere (grep-confirmed).
