# Digest — "Faction Ideology Default" (`8189b724`)

**Type:** DESIGN / rules-origin thread (**9/23/2021**), **NOT a playthrough**.
7 posts / 1 chunk · designers: **@vcczar** + **@MrPotatoTed (Ted)** = **tier-1**
(both decisive here); @jvikings1, @DakotaHale, @ConservativeElector2, @Cal, @Rodja,
@Rezi, @Hestia = players/contributors (tier-4, no rulings in-thread).
**Why it matters:** this is the **DESIGN ORIGIN of "default mode"** — the
realistic, ideology-restricted faction/draft ruleset that the build's existing
gaps **#4** (per-(faction,era) draft profile) and **#171** (era-keyed
restriction toggle) describe. The thread predates every other restriction-citing
playtest in the corpus and supplies the **canonical per-slot priority ranges +
the per-era "FactNumber" table**, names the **5-factions-per-party** structure,
and establishes default-vs-alternate as a **SETTING** (→ #263). vcczar also adds
a **brand-new charismatic-leader faction-poaching rule** in-thread (→ #76).

---

## The "default mode" ruleset (vcczar, POST 1) — capture verbatim

vcczar: *"Starting with the Era of Federalism, we will switch to the default
rules to test those out."* Two structural changes:

### ★ 1. Five factions per party (down from six)
- **REDCPU and BLUECPU are REMOVED** (POST 1). These were the **catch-all CPU
  factions**; killing them drops each party from **6 → 5 factions**.
- **Points:** the removed faction's points are **divided EVENLY among the
  remaining allies** ("to keep the score as it is").
- **Politicians:** the removed faction's pols are **divided evenly, but
  PRIORITIZED to the faction that best matches the pol's ideology** (POST 1).
- → **Resolves game-context open question** (line ~1447: *"Per-party faction cap:
  both forum games run 5 Blue + 5 Red = 10. Is the design capped at 5 factions
  per party?"*) — **default mode = YES, 5/party**; alternate (original) mode is
  the 6/party world with the REDCPU/BLUECPU catch-alls. So **6/party is not a
  contradiction — it's the alternate-mode count.**

### ★ 2. Per-faction ideology PRIORITY draft range (the core default-mode rule)
*"This default mode attempts to create realistic playthrough by restricting the
priority range that a faction can draft… JViking must draft Progressives,
Populists, or Liberals from his party first. Once they are all off the board, he
can draft Moderates, Conservatives, and Traditionalists."* (POST 1)

- **Two-tier priority, not a hard wall:** draft from the PRIORITY set FIRST; only
  **once the priority pool is off the board** may a faction draft outside its
  range. (This is the **same shape** #4 records as "off-profile picks succeed at
  reduced odds / adjacent ideologies open once the profile pool is exhausted" —
  this thread is the **earliest statement of that mechanic**.)
- **Era-keyed:** *"there is a new tab in your spreadsheet called 'FactNumber'
  that has all this info for every era"* (POST 1) — a **per-era table** keyed by
  faction slot. Each party's 5 slots are **Red1…Red5 / Blue1…Blue5**; the ranges
  **shift across eras** (the table below already shifts Independence→Federalism
  for slot 3).

**Canonical per-slot priority ranges (POST 1 "FactNumber" excerpt):**

| Slot | Player (this thread) | Independence (1774–88) | Federalism (1788–1800) |
|------|----------------------|------------------------|------------------------|
| Red 1 | JViking | Progressive / Populists / Liberals | Progressive / Populists / Liberals |
| Red 2 | SilentCPU | Liberals / Moderates | Liberals / Moderates |
| Red 3 | DakotaHale | **Moderates** | **Moderates / Conservatives** |
| Red 4 | ConservativeElector | Conservatives / Moderates | Conservatives / Moderates |
| Red 5 | Cal | Traditionalists / Populist / Conservatives | Traditionalists / Populist / Conservatives |
| Blue 1 | Rodja | Progressive / Populists / Liberals | Progressive / Populists / Liberals |
| Blue 2 | Rezi | Liberals / Moderates | Liberals / Moderates |
| Blue 3 | TMPCPU | **Moderates** | **Moderates / Conservatives** |
| Blue 4 | WVPCPU | Conservatives / Moderates | Conservatives / Moderates |
| Blue 5 | Hestia | Traditionalists / Populist / Conservatives | Traditionalists / Populist / Conservatives |

- **Symmetric across parties** (Red_N priority == Blue_N priority) in these two
  eras — the ideology *slots* are mirrored; party identity (which coalition holds
  the LW vs RW end) is layered separately (cf. #108 realignment / Blue carries LW
  in early eras per #4).
- **Slot 3 (the Moderate anchor) is the one that drifts** Independence→Federalism
  (Moderates → Moderates/Conservatives) — concrete proof the ranges are
  era-keyed and shift, not static.

### ★ 3. Default vs. alternate = a SETTING the player picks
vcczar: *"I'm okay with switching back to the original (now **alternate**)
drafting rules at some point, but we need to play this out enough times to see
how it works with the game."* (POST 1)
- **Default mode** = ideology-restricted (this thread, the realistic ruleset).
- **Alternate mode** = the **original, unrestricted** drafting (any-ideology, the
  pre-existing rules) + presumably the 6/party catch-all structure.
- → This is the **earliest design-origin** of the **"factions divided by party
  vs draft-anyone"** toggle that #263 (the settings/options umbrella) catalogs as
  canonical option **#5**, and the conceptual seed of #171's "restriction ON vs
  OFF" toggle (here it's a *global mode*, not yet era-keyed-automatic).

---

## Designer Q&A rulings (POST 2–7) — capture

**Q1 (Ted, POST 2): RW vs LW Populists — specify, or draw from both?**
- **vcczar (POST 3): EITHER kind of Populist.** Rationale: *"There aren't many
  populists and for a lot of the history, LW and RW Populists had a lot of
  overlap. It will naturally divide them when we get closer to contemporary
  times."*
- → Populist priority slots draft **both LW-Populist AND RW-Populist**; the two
  wings **converge in early/historical eras and diverge near the present**. This
  is an **early seed of the later "ideology chart is a CIRCLE not a line" rule**
  (#76: LW-Pop ↔ RW-Pop made adjacent) — here it's the *historical-overlap*
  justification, before the circle was formalized.

**Q2 (Ted, POST 2): mismatched statesmen — pols who don't fit their faction's new
ideology (e.g. WVPCPU holds many Progressives)?**
- **vcczar (POST 3): NOTHING automatic — they STAY put unless converted.**
  *"They stay where they're at unless converted."*
- vcczar **speculated** a rule that pols *~two ideologies away* are *easier to
  convert*, but **was unsure it existed**: *"I think I have it where people that
  don't fit a faction, like two ideologies away, are easier to convert or
  something. Forget if that's included."*
- **Ted (POST 4) could NOT confirm it was in the rules** (*"I don't think that's
  in the rules, unless you've recently added it"*); vcczar (POST 5) admitted he
  *"got confused with the low enthusiasm rule that sees an exodus."*
- → **Mismatched-pol handling on a mode-switch = leave-in-place** (no
  redistribution beyond the one-time REDCPU/BLUECPU split). The
  "2-ideologies-away easier to convert" idea is **NOT confirmed shipped in the
  ruleset as of this thread** — but it directly anticipates **#76's
  same-OR-adjacent-ideology conversion gating**. Note also the **"low-enthusiasm
  exodus" rule** referenced as real (the faction-enthusiasm machinery).

---

## ★ NEW RULE added in-thread: charismatic-leader faction poaching (POST 5, 7)

vcczar (POST 5): *"I've added this new rule though: If a faction leader has
**charismatic**, then there's a **10% chance** that allied faction politicians
with the **same ideology as the charismatic faction leader** will join that
faction. **No more than 1 politician per allied faction** can switch to the
charismatic faction each time this phase is reached."*

Ted (POST 6): *"Will they leave even if their own faction leader is charismatic
and/or matches their personal ideology?"* →
vcczar (POST 7): *"Made it where **they can't steal people from a faction with
the same ideology**. **Charisma won't play a role for the opponent.**"*

**Canonical spec (assemble exactly):**
- **Trigger:** a faction leader has the **Charismatic** trait.
- **Effect:** each **allied** (same-party) faction's pols whose ideology **==**
  the charismatic leader's ideology have a **10% chance** to JOIN the charismatic
  leader's faction, evaluated when this phase is reached.
- **Cap:** **at most 1 pol per allied faction per phase** may switch in.
- **Immunity 1:** **cannot steal from a faction of the SAME ideology** as the
  charismatic leader (POST 7) — i.e. no poaching a faction already built around
  that ideology.
- **Immunity 2 / scope:** **same-party (allied) only — charisma does NOT poach
  across to the opponent party** (POST 7).
- → This is a **new faction-switch pathway distinct from CPU conversion (#76)**:
  it's leader-trait-driven, intra-party, ideology-matched, capped, and has its
  own immunity list. It belongs to the **faction-leader + enthusiasm/migration
  machinery** (cf. the "low-enthusiasm exodus" rule referenced POST 5).

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-28)

**The ideology-restricted draft + the mode toggle + the charismatic-poach rule
are UNBUILT.** Notably, the **faction COUNT already matches default mode.**

- **★ Faction count = ALREADY 5/party in the build.** Both shipped scenarios ship
  **exactly 10 factions = 5 per party** (`factions1772.ts` 10 `fact_` ids;
  `factions1856.ts` 10 `fact_` ids). So the build already lives in the
  **default-mode (5/party)** world — there is **no REDCPU/BLUECPU catch-all
  faction**, and **no alternate-mode (6/party) variant**. The *count* delta is
  resolved; what's missing is the **toggle** that would re-introduce the 6/party
  alternate mode (→ #263 / #171).
- **No draft-ideology priority field on `Faction`.** `Faction` (types.ts:1293)
  carries `personality: 'LW'|'Center'|'RW'`, `ideologyCards[]`, `leaderId`, etc.
  — but **no `priorityIdeologies` / `draftIdeologies` field**, and **no per-era
  "FactNumber" table**. `grep -rniE "draftIdeolog|priorityIdeolog|factNumber|
  ideologyRestrict|allowedIdeolog" src/` → **ZERO**. The draft
  (`runPhase_2_1_1_Draft`, phaseRunners.ts:107) is dataset-driven with **no
  ideology gate** (corroborates #4 / #171 = 0% built at the type level).
- **No mode toggle / settings.** No default-vs-alternate switch; no settings
  framework exists at all (corroborates #263 — the umbrella is unbuilt; this
  toggle would be option #5 on its list).
- **No charismatic-faction-poach logic.** `Charismatic` exists ONLY as a **trait
  string** on pols (e.g. politicians1856.ts:75, 86) and in the trait registry
  (types.ts:208). `grep` for charismatic + faction/poach/join/convert → no
  migration rule. The conversion phase (#76 cluster) is the nearest machinery;
  this leader-trait pathway is **additional and unbuilt**.

---

## Candidate gaps for consolidation

*(Map to EXISTING IDs. No new numbers assigned here — consolidation owns the
gap-log edit + any numbering.)*

- **#4 (era-specific per-faction draft profile + off-profile/adjacency)** —
  **DESIGN ORIGIN + CANONICAL DATA.** This thread is the **earliest source** of
  #4's mechanic and supplies the **authoritative per-slot priority ranges** (the
  table above) + the **per-era "FactNumber" table** name/structure + the
  **two-tier "priority first, then outside the range once the pool is off the
  board"** rule (== #4's exhaustion→adjacent). Adds: slots are **Red1…5/Blue1…5**,
  **symmetric across parties**, **slot 3 = the drifting Moderate anchor**.
  Cite POST 1.
- **#171 (era-keyed draft-restriction ON early / OFF modern, toggle)** —
  **CORROBORATE + PREDATE.** Earliest evidence the restriction is a **mode you
  switch** (default vs alternate), here **global/manual** rather than
  era-automatic; #171 later makes it era-keyed-automatic (trump2024/modernday).
  This thread = the genesis of the toggle. Cite POST 1.
- **#263 (settings/options umbrella)** — **CORROBORATE + DATE.** Earliest
  design-origin (Sept 2021, predating the Aug-2021-listed `f735601c`? — note
  both ~late 2021) of the **"ideology-restricted (default) vs unrestricted
  (alternate) drafting"** toggle == #263's canonical option **#5**
  ("factions divided by party vs draft-anyone"). The default-vs-alternate framing
  is the sanctioned-channel pattern #263 formalizes. Cite POST 1.
- **#76 (CPU conversion AI + same-or-adjacent-ideology gating + ideology-circle)**
  — **CORROBORATE + ADD A SIBLING RULE.** (a) The **"2-ideologies-away easier to
  convert"** idea seeds #76's adjacency gating — but is **NOT confirmed shipped**
  as of this thread (Ted couldn't find it; vcczar conflated it with the
  low-enthusiasm exodus). (b) The **LW/RW-Populist overlap → "naturally divide
  near contemporary times"** is an early seed of #76's **ideology-CIRCLE** rule
  (LW-Pop↔RW-Pop adjacency). Cite POST 3, 4, 5.
- **★ CANDIDATE NEW GAP — Charismatic-leader intra-party faction poaching.**
  Distinct from #76 (CPU active-poach/disgruntled-flip): this is a
  **leader-TRAIT-triggered, same-party, same-ideology, 10%, capped-at-1-per-
  allied-faction-per-phase** migration with its own immunity list (can't steal
  from a same-ideology faction; never crosses to the opponent party). It rides on
  the **faction-leader + enthusiasm/migration** machinery (cf. the
  "low-enthusiasm exodus"), not the conversion %-table. **0% built** (Charismatic
  is a bare trait string; no poach logic). **Consolidation call:** likely folds
  as a **named sub-rule under #76** (the faction-switch cluster) OR a thin new row
  cross-linked to #76 + #78 (FL machinery). Source: POST 5, 6, 7.
- **Resolves game-context OPEN QUESTION** (line ~1447 "Per-party faction cap…"):
  **default mode = 5/party** (alternate = 6/party with the REDCPU/BLUECPU
  catch-alls). Hand this to consolidation to close the open Q. Cite POST 1.

---

### Open questions (carry forward)

- **Full per-era "FactNumber" table** — only the Independence + Federalism columns
  are in this excerpt (POST 1). The later eras' slot ranges (Nationalism →
  Gilded → … → modern) live in Ted's spreadsheet tab and are **not in-thread**;
  needed to fully specify #4's per-era profile.
- **Alternate-mode (6/party) faction identities** — what were REDCPU/BLUECPU's
  draft ranges / role before removal? (They were catch-alls; presumably
  any-ideology. Unconfirmed.)
- **"2-ideologies-away easier to convert"** — does it actually exist in the
  shipped ruleset, or was it only ever the low-enthusiasm-exodus rule? vcczar/Ted
  left it **unresolved** (POST 3–5). Folds into #76's adjacency question.
- **Charismatic poach — exact phase & ordering** — "each time this phase is
  reached" (POST 5): which phase, and does it run before/after CPU conversion
  (#76)? Tie-break if multiple allied factions have a same-ideology Charismatic
  leader? Unspecified.
- **Does the LW/RW-Populist "natural divide near contemporary times" have a
  concrete era cutoff** (when do populist slots stop drafting both wings)?
  Unspecified — relates to #76's ideology-circle era-keying.

---

### Provenance notes

- Single chunk; all **7 posts** read (POST 2 quotes POST 1; POSTS 4/6 re-quote
  3/5 — the substantive content is POST 1, 3, 5, 7). Authoritative signal =
  **vcczar** (designs the ruleset + adds the poach rule) and **Ted**
  (clarifying questions; co-tier-1). No tier-4 player posts in this thread.
- Codebase verified at `src/` HEAD 2026-06-28: `Faction` (types.ts:1293) has **no
  draft-priority-ideology field**; both scenarios ship **5 factions/party**
  (factions1772.ts / factions1856.ts, 10 ids each); the draft
  (`runPhase_2_1_1_Draft`, phaseRunners.ts:107) has **no ideology gate**; no
  settings/toggle framework; `Charismatic` is a bare trait (types.ts:208,
  politicians1856.ts:75/86) with **no faction-poach logic**.
- **Dating:** thread is **9/23/2021** (post timestamps) — among the **earliest
  design-origin threads** in the corpus; predates the restriction-citing
  *playtests* (`fed`, `rep1800`, `nixon1972`, `modernday`, `trump2024`) that
  corroborate #4/#171 from gameplay.
