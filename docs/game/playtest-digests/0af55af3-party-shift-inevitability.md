# Digest — 0af55af3 "Is the party shift inevitable in game (as Red draftees become more conservative and Blue more liberal)?"

**Scope:** DESIGN-Q&A thread (politicslounge topic 5065, ~14 Dec 2023),
**7 posts / 1 chunk** (`chunk-001.md`, 3.2 KB). NOTE: the upload is mis-named
`Is_the_Pariberal`; the real title is above. Topic: a player asks whether the
modern **party shift** (Red → conservative, Blue → liberal over time) is
INEVITABLE, and whether a counterfactual (Republicans stay the liberal party,
draft AOC) is playable. **theFreezerFlame** (the answering authority here) gives
the definitive mechanic answer: the shift IS practically guaranteed under default
rules — and in doing so states the **per-faction, per-era eligible-ideology
matrix** as a concrete progression. **This is a THIRD independent witness for
gap #4** (after the b52 `7d91c4c7` 1774/2012 tables and the b55
`1892-era-of-progressivism` faction names) — the FIRST to give a single faction's
trajectory ACROSS three eras. Also confirms the **#171 era-keyed restriction
toggle**, the **#306 unrestricted mode**, the **#298/#314 ideology-drift**
inevitability mechanism, and surfaces TWO genuinely-new attributes (the
"can be independent" tag; an enthusiasm-driven-eligibility counter-proposal).
**DIGEST ONLY** — no living-doc edits. Cites `POST n` = `===== POST n =====`.

Participants (authority): **@theFreezerFlame** (tier-2, the substantive
mechanic authority in-thread; answers all design Qs, also recorded as the
poll/edit owner). **@Arkansas Progressive** (tier-3 contributor — the opening
inevitability claim POST 2; the enthusiasm-driven counter-proposal POST 3/5).
The opening hypothetical (POST 1) is an anonymous player Q. NOTE: not designer
(vcczar)-ratified — theFreezerFlame relays vcczar's design ("party cards are
determined by politicians, not vice-versa," POST 4); treat as authoritative
RELAY, not first-party design.

---

## ★ Party-shift INEVITABILITY mechanism (POST 2, 4, 6, 7)

The thread's thesis: **the modern partisan sort is practically guaranteed under
default rules**, and the WHY is a feedback loop:

1. A faction can only draft within its **era-restricted eligible ideologies**
   (the #4 matrix, below).
2. **Drafted pols then SHIFT ideology over time toward the faction's center**
   ("New draftees that align with Blue will turn more liberal over time," POST 2;
   "you can't keep parties from shifting because the pols they draft will shift,"
   POST 6).
3. → the faction's composition (and therefore its eligible band next era) drifts
   in the same direction → the historical realignment reproduces itself.

POST 7 (theFreezerFlame): **"default rules means that the party shift will happen
as it did historically, but if someone wants to play ahistorically that is
certainly possible."** → the inevitability is a property of DEFAULT (restricted)
mode; it is escapable only by turning restrictions OFF. This is the same #108
realignment-is-emergent-not-scripted thesis, stated compactly from the
draft-restriction angle.

vcczar's design principle (relayed, POST 4): **"Party cards are determined by
politicians, not the other way around"** — i.e. a faction's identity/card is a
FUNCTION of its current roster, not a fixed label that constrains the roster.
(This is the design reason the AP counter-proposal below was rejected.)

## ★★ HEADLINE — concrete era-banded eligible-ideology PROGRESSION (POST 6) — 3rd witness for #4

> "Currently the game is set up so that as each era changes, the restrictions on
> what ideologies each faction can draft also change. For example, **Red 1 can
> draft LW Pop, Prog, Lib in 1772 (independence). By 1892 they're limited to LW
> Pop and Prog. and by 2012 just Lib/Mod.**" (theFreezerFlame, POST 6)

This is the per-(faction-slot, era) **eligible-ideology matrix** (#4) seen as a
SINGLE FACTION'S TRAJECTORY across three eras — the first such witness:

| Faction | 1772 (Independence) | 1892 (Progressivism) | 2012 (Populism) |
|---|---|---|---|
| **Red 1** (Red's left-most slot) | LW Pop / Prog / Lib | LW Pop / Prog | Lib / Mod |

Two facts this nails down that prior witnesses only implied:
- **The eligible set SHIFTS rightward over time even for the LEFT-most Red slot**
  — Red1 starts able to draft the whole left wing (incl. LW Populist) in the
  founding era, sheds Liberal by 1892, and sheds the entire populist/progressive
  left by 2012 (Lib/Mod only). This is the realignment's gradient made literal:
  as the GOP becomes the right-party, even its left flank moves right.
- **★ The 1772 datum EXACTLY MATCHES the SHIPPED data:** the build's
  `fact_red_lw_1772` ships `eligibleIdeologies: ['LW Populist','Progressive','Liberal']`
  (`factions1772.ts:19`) — byte-for-byte theFreezerFlame's "Red 1 … LW Pop, Prog,
  Lib in 1772." So the 1772 column of #4 is BUILT and CONFIRMED; the **1892 and
  2012 columns are UNBUILT** (no later-era eligible-ideology tables ship — see
  Shipped-vs-designed). Reconciles cleanly with the b52 `7d91c4c7` matrix
  (Independence + Era-of-Populism 2012-24 columns) — this thread adds the
  intermediate **1892** column for the Red1 slot, and confirms the founding
  column against code.

(Heed the b52 contradiction note on populist endpoints: `7d91c4c7`/the shipped
1772 data bind endpoints per-wing, while `8189b724` relaxes to either wing in
early eras. This thread's "Red 1 … LW Pop" in 1772 FOLLOWS the shipped data
[`fact_red_lw_1772` includes 'LW Populist'] — i.e. the left-Red slot drafts the
LEFT-populist, consistent with the shipped 1772 file. No new contradiction.)

## ★ Draft restrictions are a SETTINGS TOGGLE (POST 6) — confirms #171 / #306

> "And now I'm forgetting that you can turn off draft restrictions like this in
> the settings, if you so choose. silly me" (POST 6)

Default = restrictions ON (historical party shift, per the matrix above);
**a settings switch turns the entire draft-ideology restriction OFF** (POST 7:
ahistorical play — Republicans-stay-liberal — "certainly possible"). This
corroborates:
- **#171** (era-keyed draft-ideology restrictions) — here stated as a manual
  GLOBAL settings toggle (in addition to / underneath the era-keyed automatic
  flip; same as the b41 `8189b724` "default vs alternate mode" framing). Both
  forms coexist: era-keying flips it OFF automatically in the modern present
  (#171 / `modernday`), AND the player can force it OFF anywhere via settings.
- **#306 / #263** (the unrestricted "alternate" drafting MODE as a settings home).

## ★ NEW — the "can be independent" draft/party-eligibility TAG (POST 6)

> "And unless a pol has a 'can be independent' tag, then only their starting
> party (Blue for AOC, Red for George H.W. Bush) can draft them." (POST 6)

A discrete per-politician attribute governing WHICH PARTY may draft a pol:
- **Default:** a pol can be drafted ONLY by their **starting (historical) party**
  (Blue for AOC; Red for GHW Bush). This is the draft-time party gate.
- **Exception:** a pol carrying a **"can be independent" tag** may be drafted by
  **EITHER party.**

This is a **distinct attribute** from the era-eligible-ideology matrix (#4, which
gates by IDEOLOGY) and from the party-switch system (#302, which moves a pol
between parties DURING a campaign). The "can be independent" tag is a
DRAFT-ELIGIBILITY relaxation (who may claim the pol at draft), keyed to
cross-party appeal. It RELATES to #302 (both concern a pol's party flexibility)
but is its own data field. **The roadmap/mechanics docs already list
`canBeIndependent` as a designed-but-unbuilt curated-override flag** (roadmap
rows ~1766/3736; reads "row 7 reads a discrete `canBeIndependent` tag, not office
status") — so this thread is an INDEPENDENT PLAYTEST-SIDE CONFIRMATION of that
flag's existence + a CRISP statement of its semantics (default = starting-party-
only; tag = either-party-eligible) and concrete examples (AOC, GHW Bush, the
either-party relaxation).

## ★ NEW — AP enthusiasm-driven-eligibility COUNTER-PROPOSAL (POST 3, 5; REJECTED)

Arkansas Progressive proposes an ALTERNATIVE to fixed per-era eligible tables:
**draftable ideologies should be determined by the ideologies of the pols you
CURRENTLY hold / by PARTY ENTHUSIASM**, not by a fixed era matrix (POST 3, 5):

> "the ideologies you can draft should be determined by the ideologies of the
> politicians you currently have. If the Blue Party enthusiasm is favored for
> Mods, Libs, and Progs, and the Red Party is favored for RW Pops, Trads, and
> Cons, with LW Pops being neutral, then shouldn't the Blue Party be able to
> draft Mods, Libs, and Progs regardless of starting party? … Either party could
> draft LW pop in this scenario." (POST 5)

So the counter-proposal: **eligibility = a function of party ENTHUSIASM per
ideology** (a live, state-dependent gate) rather than a fixed (faction, era)
table — with LW-Populist treated as PARTY-NEUTRAL (either party may draft it).
AP frames the current inevitability as "frankly … a flaw" (POST 3).

**Outcome: REJECTED by design** (POST 4) — vcczar's principle is that party cards
follow politicians, not vice-versa; an enthusiasm-driven eligibility gate would
invert that. theFreezerFlame instead explains the existing era-matrix +
settings-toggle (POST 6) as the answer. **Capture it as a parking-lot DESIGN
ALTERNATIVE** to the #4 fixed-matrix approach, not an adopted mechanic. NOTE it
overlaps conceptually with the b54 `410ed3c8` CPU-shift rule's "40% target = the
ideology with highest enthusiasm in the party" (#314) — AP's instinct (enthusiasm
should drive ideology decisions) appears elsewhere in the corpus for the SHIFT
system, just not for draft ELIGIBILITY.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-30)

**The 1772 column of the #4 matrix is BUILT and matches POST 6 exactly; the
later-era columns (1892, 2012), the "can be independent" tag, and a draft-
restriction settings toggle are all UNBUILT. The ideology-DRIFT loop (the
inevitability engine) IS shipped.**

- **#4 matrix — 1772 BUILT, later eras UNBUILT.** `eligibleIdeologies` is a field
  on the `Faction1772` extension ONLY (`factions1772.ts:6-7`), NOT on base
  `Faction`. It is consumed by `pickBestForFaction` (`phaseRunners.ts:33-53`) but
  **only when `isExpansion1772`** — i.e. `scenarioId === '1772' && year ===
  startYear` (`:38`), the inaugural draft. `fact_red_lw_1772` (Red's left slot)
  ships `['LW Populist','Progressive','Liberal']` (`factions1772.ts:19`) =
  POST 6's "Red 1 … LW Pop, Prog, Lib in 1772," **confirmed**. 1856 has NO
  `eligibleIdeologies`; every later draft-year falls through to a soft
  `+25 PV` 3-bucket `personality` preference (`:45-52`) — NOT a hard era band.
  → **The 1892 and 2012 columns POST 6 describes do not exist** (no later-era
  eligible-ideology tables). Delta = lift `eligibleIdeologies` onto base
  `Faction`, populate per-era, apply on EVERY draft (unchanged from #4).
- **Ideology-DRIFT toward faction center — BUILT (this is the inevitability
  engine).** `factionCenter` (`phaseRunners.ts:704-728`) computes the living-
  member mean ideology; `resolveIdeologyShift` (`:767-794`) steps a pol ONE
  toward that center on a successful roll (`stepToward` `:740-742`; odds
  `ideologyShiftOdds` `:746-754`). So the "drafted pols shift toward the faction"
  half of POST 2/6's inevitability claim IS shipped — confirming the mechanism,
  not just the design. (The exact CPU-shift RULE diverges from forum-canonical on
  every axis per #314, but the drift-toward-faction-center DIRECTION matches the
  thread's claim.)
- **"can be independent" tag — 0% BUILT.** Code-grep `canBeIndependent` over
  `src/` (+ `scripts/`, `public/*.json`, `politicians-dataset.csv`) = **ZERO**;
  the term appears ONLY in the docs (`docs/game/roadmap.md`,
  `game-mechanics.md`, `technical-guide.md`) as a designed/unbuilt curated-
  override flag. `Politician` (`types.ts:1265`) has `partyId`/`factionId` but no
  draft-party-eligibility flag. The shipped draft sets `p.partyId =
  faction.partyId` at pick time (`recordDraftPick` `phaseRunners.ts:60`) with **NO
  starting-party gate at all** — i.e. the build does not even ENFORCE the default
  ("only your starting party can draft you"); any faction's draft picks from the
  shared pool (`pendingDraftPool`) regardless of the pol's historical party. So
  BOTH the default starting-party gate AND the "can be independent" relaxation are
  unbuilt.
- **Draft-restriction SETTINGS TOGGLE — 0% BUILT.** Code-grep
  `draftRestriction | restrictDraft | unrestrictedDraft | eraDraftIdeologyRestrict |
  ignoreDraftRestrict` over `src/` = **ZERO** (term appears only in docs as the
  designed `eraDraftIdeologyRestrictions` boolean). There is no settings flag to
  turn draft-ideology restrictions on/off; the only restriction that ships is the
  hardcoded `isExpansion1772` branch (`:38`), which is neither era-keyed-general
  nor user-toggleable. Confirms #171/#306 remain unbuilt.

**Net for tech-lead:** the inevitability ENGINE (ideology-drift toward faction
center, `phaseRunners.ts:704-794`) ships and behaves as the thread describes. The
GATING that the thread treats as the realignment's other half is mostly absent:
the #4 eligible-ideology matrix exists for the 1772 inaugural draft only (and its
1772 data is byte-confirmed by POST 6), with later-era columns unbuilt; the
"can be independent" / starting-party draft gate is 0% built (the build enforces
NEITHER the default gate nor the tag); and the draft-restriction settings toggle
(#171/#306) is 0% built.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold.)*

- **CORROBORATES #4 (era-banded eligible-ideology matrix) — 3RD WITNESS, +1892
  column + a 1772 CODE-CONFIRM.** POST 6's "Red 1: LW Pop/Prog/Lib (1772) → LW
  Pop/Prog (1892) → Lib/Mod (2012)" is the first single-faction trajectory across
  three eras; matches the b52 `7d91c4c7` matrix (adds the intermediate 1892 Red1
  cell) and **matches the SHIPPED `fact_red_lw_1772` 1772 data EXACTLY**
  (`factions1772.ts:19`). Build status unchanged: 1772 column BUILT, later eras
  UNBUILT. Source: this digest, POST 6.
- **CORROBORATES #171 (era-keyed draft-restriction toggle) + #306/#263
  (unrestricted MODE).** POST 6 = "you can turn off draft restrictions … in the
  settings"; POST 7 = default-ON ⇒ historical shift, OFF ⇒ ahistorical play
  possible. A clean statement that the restriction is a user-facing settings
  toggle (the GLOBAL/manual form, atop the era-keyed automatic flip). 0% built
  (no settings flag in `src/`). Source: this digest, POST 6, 7.
- **CORROBORATES #298/#314 (ideology-SHIFT / drift) — as the INEVITABILITY
  ENGINE.** POST 2/6 = drafted pols shift toward the faction over time → parties
  can't stay un-shifted → the realignment is self-reinforcing (the #108 emergent-
  realignment thesis from the draft angle). The drift-toward-faction-center
  DIRECTION is BUILT (`phaseRunners.ts:704-794`); the exact CPU rule still
  diverges per #314. Source: this digest, POST 2, 6.
- **CORROBORATES #302 (party flexibility) + (NEW facet) the discrete
  "can be independent" TAG.** POST 6 names a per-pol "can be independent" tag:
  default = only the pol's STARTING party may draft them (AOC→Blue, GHW Bush→Red);
  with the tag, EITHER party may. This is a DRAFT-ELIGIBILITY attribute (distinct
  from #4's ideology gate and from #302's mid-game party-SWITCH). Already listed
  in docs as the unbuilt `canBeIndependent` curated-override flag — this thread is
  the playtest-side CONFIRMATION + crisp semantics + examples. 0% built; the build
  enforces neither the default starting-party gate nor the tag. Source: this
  digest, POST 6.
- **NEW (parking-lot DESIGN ALTERNATIVE to #4) — enthusiasm-driven draft
  ELIGIBILITY.** AP's POST 3/5 counter-proposal: draftable ideologies = a function
  of current roster / PER-IDEOLOGY PARTY ENTHUSIASM (Blue favored Mod/Lib/Prog,
  Red favored RW-Pop/Trad/Con, LW-Pop party-NEUTRAL/either-party), replacing the
  fixed (faction, era) matrix. **REJECTED by design** (POST 4: party cards follow
  pols, not vice-versa). Capture as an explicit alternative to #4's fixed-matrix
  approach — NOT adopted. Note the enthusiasm-as-ideology-driver instinct also
  appears (adopted) in the #314 CPU-shift "40% = highest-enthusiasm ideology"
  rule, but for SHIFT, not draft eligibility. Source: this digest, POST 3, 4, 5.

---

### Open questions (for the human / consolidation)

- **Does the build need to ENFORCE the default starting-party draft gate at all?**
  POST 6 implies the default is "only your starting party can draft you," but the
  shipped draft has no such gate (any faction picks from the shared pool). Is the
  starting-party gate (a) part of the unbuilt restriction system to add, or (b)
  intentionally relaxed in the build (every pol effectively "can be independent")?
- **Is "can be independent" its own flag or derived?** Like the #302 `flippable`
  question — is it a standalone curated-override boolean (docs imply yes,
  `canBeIndependent`) or derivable from cross-party appeal / multi-party history?
- **Where exactly does the 1892 Red1 cell sit vs the b52 matrix?** `7d91c4c7`
  gives Independence + 2012 columns for all 5 slots; this thread gives only the
  Red1 cell for 1892. The full 1892 column (all 10 faction slots) is still
  unenumerated in the corpus — needed to populate the per-era table.
- **Two toggle forms — reconcile.** #171 frames the restriction as era-keyed
  AUTOMATIC (OFF in the modern present); POST 6 frames it as a MANUAL global
  settings switch. Are these one setting (era-keyed default, user-overridable) or
  two (an era-default + an explicit override)? `modernday` showed the era-keyed
  auto-flip; this thread shows the manual switch. Likely both; confirm the spec.
