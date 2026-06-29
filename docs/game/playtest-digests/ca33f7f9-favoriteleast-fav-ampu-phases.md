# Digest — "Favorite/Least-Fav AMPU Phases" (`ca33f7f9`)

**Type:** SENTIMENT POLL / discussion thread (Sep 2022, politicslounge topic 1507),
**NOT a playthrough**. **Batch 53** · 14 posts / 1 chunk · OP **@vcczar**; key
voices **@MrPotatoTed** ("Ted"), **@Vols21**, plus assorted playtesters. OP rule
(POST 1): *"Please only respond to this if you have playtested."*

**Why it matters:** the surface is a popularity poll on phases (mostly low-signal
mood), but it carries **four DESIGN-PRIORITY facts** that are largely *first-party
designer intent* (vcczar/Ted), not just player gripes:
1. **Gov-Actions need the most work — esp. for CPU** (Ted, POST 4; vcczar agrees +
   *"Put this in suggested fixes,"* POST 5). Two specific structural asks: gate
   gov-actions on the **individual governor's TRAITS** (so *who* the governor is
   matters) and couple **INDUSTRIES to governor EXPERTISE** (need an agriculture-
   expert governor to grow the agriculture industry).
2. **★ Designer history/intent (vcczar, POST 5):** Gov actions began as **"token
   actions just so Gov had something to do"** (Govs exist mainly because many run
   for President); **SC, Gov, and Mil were ALL initially "token" afterthought
   phases**, never designed as a focus, and vcczar **would AUTOMATE them** when
   playing. His real design love: the **President↔Congress dynamic**, scripted
   events, general events, legis props, and **Presidential Conventions** (his #1;
   feared CPU conventions would be boring — *"The whigs have proved me wrong,"*
   POST 7).
3. **Legislation discoverability problem** (Vols21, POST 13): hard to find legis
   matching your ideology/cards — much is era-locked or carries unstated rules.
   Asks **generic fallback legislation** (help/regulate an industry; a *"choose
   ideology × choose aspect [economic/foreign/education/…]"* bill) + **fluff bills**
   (name a battleship/airport — airport could be a Gov action).
4. **Gov actions are too hard to succeed** (Vols21, POST 13) → wants an **EXTRA
   gov-action attempt + a slightly better success chance.**

Plus a minor flavor idea: a player-kept **state-history log** (record feuds like
Burr v. Hamilton as narrative, POST 13). And the recurring theme that **Congress
is "a swamp of rules, counterrules and exceptions"** (POST 12) and housekeeping
phases (2.1/2.2) drag by hand but will be fine once automated (POST 3, 13, 14).

**Disposition:** No new mechanics *invented* here, but this is a **high-value
designer-intent source** — it pins WHY SC/Gov/Mil are thin (deliberate token
afterthoughts) and specifies the **gov-action overhaul shape** (trait-gated +
industry-expertise-coupled). Almost everything CORROBORATES existing gap rows
(#20 gov-actions, #294 industry model, content/#221 legislation primitives); the
trait-gating + expertise↔industry coupling + discoverability/generic-fallback
asks are **refinements/sub-asks** worth flagging.

---

## §1. Phase sentiment (the poll — brief)

Low-signal but recorded for completeness. **Favorites** cluster on **Elections**
(POST 2, 8, 13), **Random Events** (POST 4, 8, 10, 13 — *"who will drop dead and
what will happen next"*), **Appointments/Cabinet** (POST 2, 8), **Leaders Emerge**
(POST 6, 8), and **Presidential Conventions** (vcczar's stated #1, POST 5-7).
**Least-favorite:** split — **Faction Realignment** (POST 2; though POST 9
*"contractually obligated"* to love it, *"I always do 60+ shifts"*), **Leaders
Emerge** (POST 10), and the **housekeeping/Congress** phases 2.1/2.2 as tedious-
by-hand (POST 3, 12, 13, 14). Several posters hadn't finished a full round and
declined to vote (POST 3, 7, 8, 14). vcczar excluded **2.10** from the poll as
*"isn't much of a phase"* (POST 1).

## §2. ★ Designer intent — the high-signal section (vcczar, POST 5/7)

Authoritative first-party design history:
- **Gov actions = token by origin.** *"Initially I had no Gov actions because the
  game is about the Fed Gov. But then I created token actions just so Gov had
  something to do. Had to have Govs because so many Govs run for president."* Got
  fleshed out only because there was ~a year before Anthony (programmer) could
  start coding.
- **★ SC, Gov, and Mil are all afterthought phases.** *"I'm least interested in
  the SC, Gov, and Mil, which is why all of these were initially kind of token
  parts of the game as they weren't initially designed to be much of a focus.
  They're also all phases that I would probably automate when I'm playing."*
  → Explains the shipped reality (see §4): these three phases are the thinnest /
  most-automated in the engine. **Design-priority signal: these are the phases
  most in need of depth if they're to be player-facing rather than auto-resolved.**
- **vcczar's design focus** (where the richness is intended): President↔Congress
  dynamic, scripted events, general events, legis props, **Presidential
  Conventions** (his favorite — and CPU conventions surprised him by being fun,
  POST 7).

## §3. ★ The four concrete asks

| # | Ask | Source | Couples to |
|---|---|---|---|
| A | **Gov-actions gated on the individual governor's TRAITS** (who the gov *is* matters) | Ted POST 4-5; vcczar agrees | gov-actions ↔ trait system |
| B | **INDUSTRIES coupled to governor EXPERTISE** (need an Agriculture-expert gov to grow the Agriculture industry) | Ted POST 4-5 | gov-actions ↔ Expertise ↔ `State.industries` |
| C | **Generic FALLBACK legislation** (help/regulate an industry; *"choose ideology × choose aspect"* bill) **+ fluff bills** (name a battleship/airport; airport→gov action) — to fix legis **discoverability** (much is era-locked / has unstated rules) | Vols21 POST 13 | content registry / legis-prop pool |
| D | **EXTRA gov-action attempt + slightly higher success rate** (gov actions too hard to succeed in tests) | Vols21 POST 13 | gov-action resolution mechanic |
| E | *(minor)* player-kept **state-history log** (narrative feuds, e.g. Burr v. Hamilton) | Vols21 POST 13 | new flavor/UI subsystem |

Note tension for ask C: it runs **against** vcczar's standing **anti-fluff curation
rule** in the `518fb253` content thread (*"if I add a bunch of fluff legislation,
the Computer players might start selecting that instead of things that should be
more important"*). The generic-fallback bill is the more defensible half of the ask;
true fluff (name-a-battleship) the designer has historically resisted for CPU-realism
reasons. Flag the conflict, don't resolve it.

---

## §4. Shipped-vs-designed (verified against `src/`, 2026-06-29)

**The gov-action phase EXISTS but is a "token" auto-nudge — exactly as vcczar
describes. None of asks A–E are shipped.**

- **Gov-action phase = automatic, hidden, skill-only.** `runPhase_2_5_2_Governors`
  (**`src/engine/phaseRunners.ts:3382-3392`**) is the entire gov-action system: for
  each state with a governor, a **30% chance** to nudge `s.bias` by
  `(gov.skills.governing − 1) * 0.05` toward the gov's party. **Verified it reads
  NEITHER `gov.traits`, NOR `gov.expertise`, NOR `s.industries`** (grep of lines
  3382-3392 = NONE). No player choice, no action menu, no success/fail roll, no
  extra-attempt concept. This IS the "token action" — it's the literal code behind
  vcczar's admission.
- **No `govAction` concept anywhere.** `grep -rniE "govAction|governorAction" src/`
  → **0 hits** (corroborates prior-batch null results). There is no Gov-Action type,
  data file, or selectable-action registry.
- **`GovernorsPage` is READ-ONLY** (**`src/pages/GovernorsPage.tsx`**, 34 lines):
  a roster table (State / Region / Governor / Party / Ideology / Gov Skill). **No
  action UI** — players cannot direct a governor at all.
- **Ask A (trait-gating) — UNBUILT.** Traits exist on `Politician.traits`
  (`types.ts:1272`) but nothing in the gov phase consults them.
- **Ask B (industry↔expertise coupling) — UNBUILT, though the axes both exist.**
  `Expertise` is a 19-tag axis (`types.ts:182-186`) that **already includes
  `'Agriculture'`, `'Transportation'`, `'Energy'`, `'Business'`, etc.** — exactly
  the tags the ask wants to gate industry-growth on. `State.industries` is
  `Record<string, number>` (`types.ts:1328`). **But the ONLY thing that moves
  `industries` is the PR7 lobby→industry +1 nudge** (`phaseRunners.ts:1631-1652`,
  keyed off `LOBBY_INDUSTRY` `types.ts:398`) — there is **no governor-expertise →
  industry-growth path**, and no governor action that touches `industries` at all.
  The pieces (Expertise tags, industry map) are present and unconnected.
- **Ask C (generic fallback + fluff legislation) — UNBUILT.** No
  generic/fallback/fluff legislation primitive (`grep "fallback|generic.*legis|
  fluff"` → only unrelated game-over text + CC eligibility fallbacks). Bills come
  from a **small fixed inline `BILL_TEMPLATES` array** (`phaseRunners.ts:3420+`,
  ~tariff/homestead/internal-improvements/naval-expansion) plus the CC templates —
  **no era-keyed authored proposal pool, no "choose ideology × choose aspect"
  generator, no discoverability/filter UI.** Corroborates the #221 content-registry
  gap and the legis-discoverability problem.
- **Ask D (extra attempt + better success) — N/A to a system that doesn't expose
  attempts.** The gov phase is a single flat 30% bias-nudge with no per-governor
  action budget or success/fail surface to tune.
- **Ask E (state-history log) — UNBUILT.** No per-state narrative-history store
  (the log system `engine/log.ts` is event/phase logging, not a player-curated
  state journal).

---

## §5. Candidate gaps for consolidation (hand-off list — consolidation agent owns the gap-log edit)

*(All CORROBORATE existing rows; the trait-gating + expertise-coupling +
discoverability + extra-attempt asks are sub-refinements worth attaching.)*

- **#20 (Governor Actions / CPU gov-action system)** — CORROBORATE + sharpen.
  ★ This thread is the **designer's own statement that gov-actions are a "token"
  afterthought** (POST 5) and the **direct ask to make the gov-action overhaul the
  priority, esp. for CPU** (POST 4-5; vcczar: *"put this in suggested fixes"*).
  Shipped state confirmed: `runPhase_2_5_2_Governors` is a flat 30% skill-only
  bias-nudge (`phaseRunners.ts:3382`), `GovernorsPage` read-only, zero `govAction`
  refs. **Two NEW sub-requirements to attach to #20:** (A) **governor-TRAIT-gated**
  actions, (D) a **per-governor action budget (extra attempt) + tunable success
  rate**. Cite POSTs 4, 5, 13.
- **#294 (industry model)** — CORROBORATE + NEW coupling. ★ Ask **B: industry growth
  gated on governor EXPERTISE** (Agriculture-expert gov → grow Agriculture). Axes
  exist but are unconnected: `Expertise` enum (`types.ts:182`, has `Agriculture`
  etc.) ↔ `State.industries` (`types.ts:1328`); today only the PR7 lobby nudge moves
  industries (`phaseRunners.ts:1631`). **NEW requirement: an expertise→industry
  growth path, surfaced through gov-actions.** Cite POSTs 4, 5.
- **#221 / content-primitive registry (legis-prop pool) — + #262 (legis content) —**
  CORROBORATE. ★ Ask **C: generic FALLBACK legislation** (help/regulate an industry;
  *"choose ideology × choose aspect"* bills) **+ fluff bills**, motivated by a
  **legislation-discoverability problem** (era-locked, unstated rules). Shipped: a
  small fixed `BILL_TEMPLATES` array (`phaseRunners.ts:3420`), no authored era-keyed
  pool, no filter/discoverability UI. **Two flavors to log:** (C1) a **generic-
  fallback bill generator** + **legis-discoverability/filtering**; (C2) **fluff
  bills** — note the **conflict** with vcczar's anti-fluff CPU-realism curation rule
  (`518fb253`). Cite POST 13.
- **NEW (small) — player-curated state-history log (#E).** A per-state narrative
  journal for emergent feuds/storylines (Burr v. Hamilton). No equivalent in `src/`
  (`log.ts` is system logging). Low-priority flavor; flag as genuinely new but minor.
  Cite POST 13.
- **SC / Mil "afterthought-phase" corroboration** — the same POST-5 admission marks
  **Supreme Court** (`runPhase_2_5_3_Court`, `phaseRunners.ts:3397` = flat 50%
  ideology-majority coin-flip nudging partyPreference ±0.1) and **Military** as
  equally-token, auto-resolvable phases. Corroborates any existing SC-depth / Mil-
  depth gap rows: these are thin **by deliberate design**, not by oversight.

---

## §6. Open questions

- **Anti-fluff vs. generic-fallback tension** (POST 13 vs `518fb253`): vcczar wants
  CPUs to avoid low-importance bills, but Vols21 wants generic-fallback + fluff to
  fix discoverability. Does a later thread reconcile (e.g. human-only fluff, or
  fluff barred from the CPU pool)? Unresolved here.
- **Are SC/Gov/Mil meant to stay auto-resolvable, or get depth?** vcczar says he'd
  *automate* them — implying acceptable as CPU/auto phases — but Ted/Vols21 want the
  gov phase fleshed out. The intended end-state (deep player-facing vs. thin auto)
  is genuinely contested. Carry forward.

---

### Provenance notes
- Single chunk; all 14 posts read. Designer (vcczar) + rules-steward (Ted) posts are
  tier-1 intent; the rest are tier-4 sentiment. POSTs 5 and 7 are duplicated quote-
  blocks of the same vcczar reply (forum quoting) — counted once.
- Codebase verified at `src/` HEAD on 2026-06-29: `govAction` grep = 0;
  `runPhase_2_5_2_Governors` (`phaseRunners.ts:3382-3392`) reads only
  `skills.governing` + party (no traits/expertise/industries); `GovernorsPage.tsx`
  read-only; `Expertise` enum `types.ts:182`; `State.industries` `types.ts:1328`;
  industries moved only by PR7 lobby nudge `phaseRunners.ts:1631`; bills from inline
  `BILL_TEMPLATES` `phaseRunners.ts:3420`; no generic/fallback/fluff legis primitive.
