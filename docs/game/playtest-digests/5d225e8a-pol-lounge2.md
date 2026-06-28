# Digest — 5d225e8a-pol-lounge2  ("Pol_Lounge2" filename is a misnomer)

**Real topic:** forum topic 5647 **"Group Discussion 2.3 — Appointments"**.
**Type:** FOCUSED DESIGN-REWORK thread (not a playthrough). **Lead:** @MrPotatoTed
(tier-1 designer), opening a fresh redraft pass on the **2.3 Appointments phase**
rules document, Aug 24–26 2024. Participants: @ebrk85, @Ich_bin_Tyler,
@Arkansas Progressive, ref to @matthewyoung123 ("matt"). **15 posts / 1 chunk, all read.**

**Provenance note:** This is the Appointments thread **owed from batch 43** — the b43
`754a0a4c` upload was a byte-identical mis-export of the "Questions for Playtesters"
thread, so the real 2.3 content was never captured until now. This digest is that capture.

**Relation to `b9028796`:** `b9028796` (Sept 2022) is the AUTHORITATIVE ORIGIN of the
2.3 appointment/confirmation ruleset. **THIS thread is a ~2-year-later (Aug 2024)
maintenance + critique pass on that same ruleset** — it confirms parts now work
(CPU voting), flags parts as still-broken (lobby→enthusiasm, cabinet too strong),
and proposes new tweaks (career-track removal guard, Big-Four enthusiasm tiers,
puritan-ideology gate). It does NOT redefine the base spec; it audits it.

**Shipped-vs-designed framing:** Almost everything here is **manual Google-Sheets rules
/ designer intent**, NOT the shipped engine. The shipped 2.3 is a thin CPU auto-fill
(see "Shipped reality" below). Dispositions: **WORKS-NOW** (fixed & confirmed in play),
**FLAGGED** (acknowledged broken/too-strong, overhaul pending), **PROPOSED** (raised,
no commit), **SPEC** (statement of an existing manual rule).

---

## A. Ted's redraft scope & priorities (POST 1)

Ted is making "another run at editing the rules," starting at **section 2.3** because
"Anthony" (programmer) has already coded aspects of **2.1 and 2.2** and Ted wants to
**avoid disturbing already-programmed sections**. (Implication: if the programmer
changes, those earlier sections re-open.) Five stated priorities:

| # | Priority | Note |
|---|---|---|
| 1 | Fix spelling/grammar | — |
| 2 | Clarify | "read in a way that makes total sense to a total AMPU noob" |
| 3 | Simplify | for GMs **and coders**; reduce burden **without removing systems/fun** |
| 4 | Realism where possible | within sim limits; not adding new complexity |
| 5 | **Consistency** | cites a live inconsistency: **§2.4 an incompetent President is clearly in charge, but §2.8 he clearly isn't** — wants cohesive trait application across the doc |

> NOTE: §2.4 / §2.8 are *manual rules-doc* sections (governance vs. executive
> actions), not engine phase 2.4/2.8 IDs. The Incompetent-President-authority
> inconsistency is a **doc-level design bug** flagged for the rewrite.

---

## B. CPU appointment-voting fix — WORKS NOW (POSTs 2–4, 6)

- **Longstanding bug:** CPU voted against **too many nominees**, vs. the historical
  reality that confirmations were rarely controversial (POST 2, @ebrk85).
- **Fix:** @ebrk85 made "an adjustment to the cpu rules" — now working properly (POST 2).
- **Confirmed:** @Ich_bin_Tyler (whose playtests are **CPU-vs-CPU**, complementing
  ebrk's human games): "CPU appointment works very well now with [the] rules being
  updated by @ebrk85" (POST 4). Ted: "If Tyler and Eric are happy, I'm happy" (POST 6).
- **Cross-ref:** this is the fix to the over-rejection problem `b9028796` Section G
  addressed structurally (auto-confirm gate + Iron-Fist-SML defaults). This thread is
  the **playtest confirmation** that the CPU side of that now behaves.

**Open data ask (POST 5):** Ted wants real-world data on **how often Senators vote
against a same-party President's nominee** (theory: almost never, absent a mass
revolt). If confirmed, he'd **strip some trait-dictated confirmation NAY votes** — but
notes traits must still *do* something. Unresolved; no data found in-thread.

---

## C. Lobby/interest → enthusiasm is too powerful — FLAGGED for full rebuild (POSTs 2, 3)

The single section Ted/ebrk flag as needing a **complete overhaul**:

- Even **with the ±3 cap**, lobby/interest effects on the enthusiasm meters have "way
  too much power" (POST 2).
- **Uncapped**, the 2000 test produced **~20-point enthusiasm swings** ("CRAZY!!!!").
- Also judged **"way too complicated"** — needs a simpler calculation.
- Explicitly earmarked as its **own future group discussion** (a rebuild, not a tweak).
- @ebrk85 + @MrPotatoTed both agree (POST 3).

**Cross-ref:** the lobby-enthusiasm scoring rule itself is specced in `b9028796`
Section C (25% per matching faction for cabinet / 10% cabinet-level). THIS thread is
the **playtest verdict that that rule is overtuned and over-complex** — i.e. the gap-log
"cabinet lobby-enthusiasm rolls" item should carry a flag that the *design itself* is
slated for rebuild, not just implementation.

---

## D. Career-track pols accepting offers — debated, leaning toward a removal-guard (POSTs 8, 11–14)

**The existing SPEC** (POST 11, restated by Ted; matches `b9028796` Section E):
> Career-track individuals accept **cabinet 100% / cabinet-level 75% / ambassador or
> military 50%**. If confirmed, they are **immediately withdrawn from the career track**
> and receive benefits earned so far, **rounded down to the most recently passed
> milestone**. **Applies to humans AND CPU** (not a CPU-only rule).

**The critique (@Ich_bin_Tyler, POST 8):**
- Because career-track pols **always accept**, this is "a really nasty way of stunting
  CPU growth," especially picking off **other-party** career-trackers.
- It's the **only way career-track pols get removed early** (besides governor
  replacement) — i.e. it short-circuits an otherwise protected development path.
- Proposes **possibly removing the rule**.

**The single-player power-creep angle (Ted, POST 14):** In the **1840 game** the faction
exploiting this most is the **human player (@matthewyoung123)**. Ted's concern: if AMPU
is played **mostly single-player**, this becomes a **"gamer move" to snipe rival
factions** that threaten you → **player power creep**. (This is the load-bearing
single-player balance worry — the rule reads fine for a multiplayer forum game but
becomes an exploit vs. CPUs.)

**Ted's original rationale (POSTs 13, 14):** flavor realism — a mayor/state rep/"Assistant
to the Deputy Under Secretary of the Whatever" called up to the big leagues is "packing
their bag for the next flight." Intended to cover players + CPU alike.

**Proposed compromise (@ebrk85, POST 12; Tyler concurs):** keep career-track pols
protected from mid-cycle removal *except* — **only allow nominating a career-track pol
if there is no one with at least 2 Admin available and eligible** for that position.
→ Disposition: **PROPOSED, leaning accept; not finalized in-thread.**

---

## E. Presidential-trait-gated cabinet ideology — PROPOSED (POST 8, @Ich_bin_Tyler)

Idea: presidential traits should constrain *who* a President will appoint by ideology.
Worked example with the **Puritan** trait:
- A Puritan president only appoints ideologies **within 2 steps** of their own.
- *Prog Puritan* → can appoint **Mod … LW Pop**; *RW-Pop Puritan* → can appoint
  **Con … RW Pop**.

Tyler hedges ("could just be me"); Ted does not commit. Disposition: **PROPOSED.**
(Distinct from, and tighter than, the existing **±1-ideology cross-party gate** in
`b9028796` Section B — that gate is cross-*party* and ≤1 slot; this is a *same-side*
ideology window keyed to a presidential trait.)

---

## F. Cabinet too powerful in impacting meters — FLAGGED, with a caveat (POSTs 8, 9, 10)

- @Ich_bin_Tyler: "the cabinet is too powerful in impacting meters" (a lingering issue,
  POST 8). @ebrk85 mock-retracts support (POST 9, jokey).
- **Important caveat (POST 10):** "I feel like it's the only reliable way to positively
  impact the meters though, right?" → the cabinet may be the **only dependable POSITIVE
  meter lever** in the game, so nerfing it needs a replacement positive lever.
  Disposition: **FLAGGED, unresolved tradeoff.**

**Cross-ref / shipped:** this is the admin→meter Lingering mechanic
(`b9028796` Section C) and it IS partially shipped (see "Shipped reality" — 2.5.1
applies cabinet→meter bonuses). So this complaint targets a **built** lever's tuning,
unlike most of the thread.

---

## G. Tracked rule change Ted already made — CPU cabinet auto-resign (POST 7) — SPEC (manual)

For the **era between "Continental Congress dissolves" and "President sets precedent for
firing cabinet members"** (previously had **no** CPU rule for this case):

| Rule | Detail |
|---|---|
| Auto-resign | A **CPU** cabinet member **automatically resigns** their post if they drop **below 2 in the relevant skill (usually admin)**. Mirrors existing **Continental-Congress-era** CPU behavior. |
| **Life-tenure exception (NEW)** | If the **President is from the opposite party**, a CPU cabinet member **serving for life will NOT resign** regardless of how low the relevant skill falls. |

**Cross-ref:** `b9028796` Section A defines the "firing precedent" Exec-Action and the
"for-life" appointee state; Section F has the CC-era "remove below 2 if ≥2 replacement
exists." This POST 7 rule **fills the gap between those two regimes** and adds the
opposite-party-spite carve-out. Disposition: **SPEC — Ted committed it to the rules doc.**

---

## H. Big-Four vs. lower-cabinet enthusiasm tiers — matt's proposal, worked by Arkansas Progressive (POST 15) — PROPOSED

Recalled from a "massive suggestion" by **matt** (@matthewyoung123): enthusiasm should
roll **differently by cabinet level** — Top 4 → upper cabinet → lower cabinet →
ambassadors. As detailed by @Arkansas Progressive:

**Two tiers, rolled SEPARATELY:**

| Tier | Members | Roll chance |
|---|---|---|
| **Big Four** | State, Treasury, **War/Defense**, **Attorney General** | **20%** per met/unmet lobby/interest |
| **Lower cabinet + ambassadors** | Navy, Labor, Commerce, Postmaster General, …, all Ambassadorships | **10%** per met/unmet lobby/interest |

**Logic (per tier):**
- A lobby/interest is **satisfied** when a confirmed/retained cabinet member is from a
  faction holding that matching card.
- **POSITIVE roll:** if a lobby/interest is satisfied **more than once** across the
  cabinet → each faction holding that card has the tier's % chance of enthusiasm **+1
  toward the President's party**.
- **NEGATIVE roll:** if a lobby/interest is **not satisfied at all** → that card's
  faction(s) have the tier's % chance of moving enthusiasm **away** from the
  President's party by 1. **Roll once** per unsatisfied lobby (negative) and once per
  multiply-satisfied lobby (positive).
- **No penalty** if a lobby is satisfied exactly once; only unmet (penalty) or
  multiply-met (bonus) trigger rolls. **The two tiers are rolled separately.**

**Worked example (Sec of State, POST 15):** Sec of State is wanted by **9
lobbies/interests** — Globalists, Isolationists, Big Corporations, Military-Industrial
Complex, Welfare, Expansionists, Nationalists, Pacifists, Reformists. Fill it with a
faction holding 4 of them (e.g. Globalist + Mil-Industrial + Welfare + Expansionist) →
those 4 satisfied (no decrease roll); the other 5 (Isolationist, Big Corps,
Nationalist, Pacifist, Reformist) must be satisfied by **other** cabinet posts or face
the negative roll. A second pick (Sec of Treasury holding Big Corps, Reformist,
Mil-Industrial, Nationalist) only satisfies the **Treasury-relevant** lobbies it
matches (Big Corps & Reformist also matter to Treasury → now multiply-satisfied → roll
for +); Mil-Industrial & Nationalist do **not** count for Treasury (Treasury doesn't
want them) and stay unsatisfied unless met elsewhere.

> **Tension w/ Section C:** this tiered model is a *refinement* of the very
> lobby→enthusiasm mechanic Ted flagged in POST 2/3 as **too powerful and slated for
> full rebuild/simplification**. So H is a candidate *design* for the rebuild, but the
> rebuild's stated goal is **simpler**, and H is arguably *more* elaborate. Flag the
> conflict for the human: adopt H's per-tier % structure, or rip the whole lobby
> enthusiasm system out for something simpler? Disposition: **PROPOSED (unreconciled
> with the C overhaul).**

---

## Shipped reality (spot-checked against the codebase)

The shipped 2.3 is **far thinner** than this rules doc:

- **Phases exist:** `PHASE_SEQUENCE` has `2.3.1 Cabinet Appointments` and
  `2.3.2 Military Appointments` (`src/phases.ts:18–19`); **both are SKIPPED entirely in
  the independence era** (`phases.ts:89–90`). Lingering is `2.5.1` (`phases.ts:25`).
- **`runPhase_2_3_1_Cabinet`** (`src/engine/phaseRunners.ts:2158`) is a deterministic
  **auto-fill, no human nomination UI in this path, NO confirmation vote at all** —
  it just scores eligible pols (`scoreCabinetCandidate`, admin/governing/secondary +
  expertiseBonus from `CABINET_SEAT_SCORING`, types.ts:1221) and seats the top one;
  log literally says "confirmed as …" with no vote.
- **Cross-party gate as shipped is NOT the designed ±1-ideology gate:** it's a flat
  **10% per-seat chance to relax the same-party filter** (`CABINET_CROSS_PARTY_RATE`)
  with a **−3 score penalty** for cross-party picks (`CABINET_CROSS_PARTY_PENALTY`,
  types.ts:1233–1234). No ideology-distance check, no Top-Four cap, no presidential-
  trait gate.
- **Admin-on-confirm grant IS shipped:** `ABILITY_EARN_RULES.cabinetConfirmAdmin`
  (types.ts:565–595) → F-doubling per Egghead/Efficient (phaseRunners.ts:2200–2211).
- **Lingering cabinet→meter bonuses ARE shipped** (`runPhase_2_5_1_Lingering`,
  phaseRunners.ts:3258–3360): seat→meter map + per-trait modulation. This is the
  "cabinet too powerful in meters" lever (Section F) — i.e. that complaint targets
  *built* behavior.
- **Lobby/interest → ENTHUSIASM rolls are NOT shipped at all.** `enthusiasm` is mutated
  *only* via era-event effects (`applyEffect`, phaseRunners.ts:3229–3232) and *read* in
  elections (`calcStateVote` ~line 3696/3709). The entire Section C / Section H
  lobby-enthusiasm system is **designed-but-unbuilt**. (Lobbies DO feed two other
  shipped systems — lobby→expertise trickle in `runPhase_2_1_2_CareerTracks`, and
  lobby→industry nudge — but neither touches enthusiasm.)
- **Career-track acceptance odds are NOT shipped** as an appointment gate (no 100/75/50
  cabinet acceptance, no "withdraw from track on confirm w/ rounded-down benefits").
  Career tracks exist as a development system (`runPhase_2_1_2_CareerTracks`,
  CAREER_TRACK_MAX_YEARS/CAP), but the **appointment-side interaction is design-only.**
- **CPU auto-resign-below-2** (Section G) and the opposite-party-life-tenure carve-out:
  no such cabinet-resignation logic found in the shipped 2.3 path. Design-only.
- **No confirmation vote, no Iron-Fist-SML force-vote, no defeated-nominee fallout,
  no 5-retention/firing-precedent state** in the shipped cabinet path — consistent with
  `b9028796`'s build audit.

---

## Deltas vs current build (for consolidation → gap log)

> Most are **NOT new design** — they corroborate / re-flag `b9028796` items with a
> 2024 playtest verdict. Treat as **sharpen existing gaps**, plus a few genuinely new asks.

1. **Lobby/interest → enthusiasm rolls: designed-but-unbuilt AND design-flagged for
   rebuild.** Shipped engine has zero enthusiasm-from-cabinet logic. Beyond "not built,"
   add the verdict: even the *manual* rule is **overtuned (~20pt swings; ±3 cap
   insufficient) and too complex → slated for a simplifying rewrite** (POST 2,3).
   Sharpens the `b9028796` Section C lobby-enthusiasm item. **Do not build as-specced;
   awaiting the rebuild.**
2. **Big-Four (20%) vs. lower-cabinet/ambassador (10%) enthusiasm tiers, rolled
   separately; satisfied-once = no roll, multiply-satisfied = +roll, unmet = −roll.**
   matt/Arkansas Progressive proposal (POST 15). A candidate *design* for #1's rebuild
   — but **conflicts with the "simplify" goal**; flag the conflict. **NEW (proposed).**
   Note Big-Four here = State/Treasury/**War-Def/Attorney General** (matches the
   cross-party-cap Top-Four in b9028796, NOT the always-vote Top-Four which swaps AG↔War).
3. **Career-track removal guard.** Shipped: no career-track acceptance gate at all.
   Designed-but-unbuilt: the 100/75/50 accept + withdraw-on-confirm rule. **NEW
   single-player-balance requirement (PROPOSED, leaning accept):** only allow
   nominating a career-track pol **if no one with ≥2 Admin is available/eligible** for
   the post (POST 12) — to stop human "sniping" of rival-faction career-trackers
   (player power creep, POST 8/14). Pairs with gap-log career-track + appointment items.
4. **Presidential-trait-gated cabinet ideology window** (e.g. Puritan → appoint only
   ≤2 ideology steps away). **NEW (proposed).** Distinct from the shipped flat −3
   cross-party penalty and from b9028796's ±1 cross-party gate.
5. **CPU cabinet auto-resign when relevant skill (usually admin) < 2**, in the
   post-CC / pre-firing-precedent era, **except** an **opposite-party life-tenure**
   member never resigns. Design-only (committed to rules doc, POST 7); not in shipped
   2.3 path. Sharpens b9028796 Section A/F regime-transition coverage.
6. **CPU over-rejection of nominees: FIXED & playtest-confirmed** (POST 2–4,6). Not a
   build gap to open — instead **close/annotate** any existing "CPU votes against too
   many nominees" gap as resolved in the 2024 forum build (ebrk's CPU-rule change;
   Tyler's CPU-vs-CPU confirmation). Note the shipped engine has **no confirmation vote
   at all**, so this fix lives only in the manual ruleset, not the code.
7. **Cabinet meter impact is too strong — but may be the only reliable POSITIVE meter
   lever** (POST 8/10). Targets the **shipped** 2.5.1 Lingering cabinet→meter bonuses
   (phaseRunners.ts:3301–3360) → a **tuning** gap, not a missing-feature gap; any nerf
   needs a replacement positive lever.
8. **§2.4 vs §2.8 Incompetent-President authority inconsistency** (POST 1) — a
   *rules-doc-level* design bug (incompetent Pres in charge in one section, not the
   other). Feeds the broader "consistent trait application" cleanup; relates to
   governance/exec-action trait handling. Doc-fix, not necessarily code.
9. **Open data dependency:** the question of whether trait-dictated confirmation NAY
   votes should be trimmed (POST 5) is gated on real-world same-party-rejection data
   that was **not found** — leave as an open question, not a build item.

**Cross-refs:** companion to `b9028796` (origin spec). Tangential to gap **#273
(impeachment)** only insofar as both concern removal of officials — but this thread is
about **cabinet** resignation/non-confirmation, not presidential impeachment; no direct
overlap to fold.

## Open questions for the human
- **Lobby-enthusiasm rebuild direction:** adopt matt/Ark's tiered 20%/10% model (#2,
  more elaborate) or rip the system out for something genuinely simpler (Ted's stated
  goal, #1)? They conflict.
- **Career-track guard final form:** remove the early-removal entirely, or keep with the
  "≥2 Admin available" exception (POST 12)? Tyler/ebrk lean toward the guarded version;
  Ted hadn't committed.
- **Puritan ideology-window (#4):** adopt, and does it stack with / replace the existing
  ±1 cross-party gate?
