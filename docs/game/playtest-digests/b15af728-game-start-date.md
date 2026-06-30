# Digest — `b15af728` "Discussion: When should a new game actually BEGIN?"

> **DESIGN-POLL / PROCESS thread, NOT a playtest** (no GM ran a game). 10 posts /
> 1 chunk (~5.4 KB, read in full). Forum topic 6314 (politicslounge), **Jun 19–21
> 2025**. Started by **@MrPotatoTed** (rules steward). Citations are
> `===== POST n =====` markers. Raw chunk is gitignored/disposable; **this digest
> is the durable record.** Part of **batch 56** (small discussion threads).
>
> **★ Headline:** A team poll on **WHERE a post-1772 game should BEGIN** — the
> start-PHASE-entry question for any non-1772 scenario. The rules **never specify**
> how to boot a post-1772 game or which phases to skip because incumbents are
> already seated. The poll frames 3 options (A/B/C); the team **leans B** (begin at
> phase **2.1**, post-election but **pre-cabinet**) for coding simplicity +
> accessibility, while several still like A (start with a confirmed cabinet, "more
> historicity"). Directly feeds the roadmap **`scenarioBoot`/`BootSheet`** keystone
> (top-of-queue) and the era-start gaps (#86/#115/#186/#187/#92).
>
> **★ Disposition:** Mostly **corroboration + one genuinely-new design decision.**
> NEW: the post-1772 **start-phase-entry choice** (A/B/C, B-leaning) as an explicit
> `scenarioBoot` sub-decision; the **2.4-start → no-Faction-Leader-turn-1 rules
> gap** (a real rules consequence of option A); and the **start-date-sheet
> error-class**. Everything else attaches to the existing scenario-boot keystone.

---

## §1. The design question (POST 1, MrPotatoTed)

The team has long used **@vcczar's "start-date sheet"** (a Google Sheet of
per-era starting positions). Its **unwritten assumption**: a game begins **AFTER
the most recent election AND after the cabinet is appointed/confirmed**. Worked
example: an **1856 start seats President Buchanan + his cabinet already** — which
is **ahistorically early**, since Buchanan won at the *end* of 1856, was sworn in
**1857**, and his cabinet was confirmed only after that (POST 1). **The rules
never state** how to start a post-1772 game or which phases get skipped (POST 1).

**The poll (POST 1):**
- **A — Leave as-is:** start **post-election WITH cabinet already confirmed**
  (1856 = Buchanan + cabinet in place; assumes the 1856 election played out
  historically).
- **B — Begin at 2.1:** **post-election but BEFORE cabinet nomination** (1856 =
  Buchanan won, but hasn't named a cabinet yet). ← the front-runner.
- **C — Begin at the election:** **no historical-accuracy assumption** — play the
  election out in-game (an 1856 start "could end with Buchanan losing, or even not
  running at all").
- **D — Other.**

OP's personal lean: **C, or at least B**; had previously accepted A as "already
decided" rather than re-do the sheet (POST 1).

## §2. Where the team landed (POST 2–10)

- **B is the front-runner** — explicitly favored for **coding simplicity +
  accessibility**: "jump in at 2.1, go right into a draft/career track, don't worry
  about existing leaders and cabinet" (POST 3); "simplest and most accessible…
  proceed like any other turn" (POST 7); "for coding purposes option 2 [B] would
  be the easiest" (POST 8); "biased to begin at 2.1, since it's the beginning of a
  turn… would prefer not to have a Cabinet cobbling thrown at me on turn 1"
  (POST 9).
- **A has real support too** — "feel most comfortable starting after the
  Presidential election AND after cabinet confirmation… skipping appointments"
  (POST 2); "I like appointing Cabinets and starting with historicity, so [B]
  covers all my bases" (POST 10 — note: this voter conflates wanting cabinet-
  appointment WITH option B, which *omits* the seated cabinet; an ambiguity).
- **★ KEY RULES CONSEQUENCE of option A (POST 7):** if the cabinet is already
  confirmed, the **first turn starts at phase 2.4** — which **by the rules as
  currently written means NO ONE has a Faction Leader for the first turn** (Faction
  Leaders are selected in phase 2.2.3, which option A skips). A genuine rules gap
  that A must address.
- **"Support BOTH eventually" wish (POST 4, 6):** ideal is to offer both A and B as
  options, "but it can't happen now"; **for the actual app "we're going to have to
  choose one or the other eventually."**
- **Forum vs app (POST 6):** for **forum** games a GM "can absolutely do it however
  you want" — but pre-election (option C) is **more GM work** because the master
  sheet is **prepped post-election**. POST 5: one GM ran a **mid-era 1960 start
  pre-election** and ignored the sheet's cabinet — so C/pre-election is already
  done informally in forum play.
- **★ "the only option is a 1772 start anyway" (POST 6, 59-corroborating):** as of
  **Jun 2025** the team states the **app only supports a 1772 start**. **STALE vs
  the current build** — see §3.

## §3. The start-date sheet has ERRORS (POST 1, 18-style)

While building an **1820 template** (helping @matthewyoung123), OP found
**sheet errors**: e.g. **Senate seats listed "vacant" that wouldn't actually
vacate until after the midterms**, plus "other little inconsistencies." OP intends
to **fix the sheet errors**, and "if I'm doing that already, it might be time to
adjust for a proper start date as well" (POST 1). → The per-era boot data the
build's `BootSheet` must canonicalize is **known to contain incumbent/seat errors**
(a data-quality bar for #186/#187).

---

## §4. Deltas vs. current build (code-verified)

> **Shipped reality (override the thread's "only 1772 ships"):** the build offers
> **BOTH 1772 and 1856** as user-selectable New-Game scenarios
> (`NewGameScreen.tsx:8-21`; `startNewGame(factionId, scenarioId?: '1772'|'1856')`,
> `GameContext.tsx:24,264-272`), with **1856 the DEFAULT**
> (`NewGameScreen.tsx:25`). So a **post-1772 start already ships** — the
> June-2025 forum statement (POST 6) predates it.

- **`scenarioBoot` start-PHASE-entry decision [NEW sub-decision; attaches to the
  scenario-boot keystone #86/#115/#186/#187].** The A/B/C choice (B-leaning) is
  the missing **"which phase does a non-1772 boot enter, and which turn-1 phases
  are skipped"** decision. **Shipped:** each scenario **hardcodes its entry phase**
  — 1772 enters `2.1.1` (inaugural draft; `scenario1772` + the
  `scenarioId==='1772' && year===startYear` special-case in `phases.ts:65-67`),
  **1856 enters `2.1.2` Career Tracks** (`scenario1856.ts:153`, comment "start past
  draft for first turn (rookie crop already included)"). There is **NO generic /
  configurable start-phase boot** and **no option-A/B/C toggle**.
- **The shipped 1856 boot ≈ a HYBRID of A and B, but matches NEITHER cleanly
  [NEW clarification].** It is **option-A-like** in seating incumbents
  (Buchanan as President, partial cabinet, SCOTUS, governors, full
  Senate+House — `scenario1856.ts:124-193`; `governorsExist:true`,
  `constitutionRatified:true`), i.e. the **ahistorical pre-1857-swearing-in**
  start the thread critiques (POST 1). But it is **NOT the option-A 2.4-start** —
  it enters at **2.1.2**, *upstream* of the 2.2.x leadership phases. And it is
  **NOT the option-B 2.1.1 draft-start** either — it **skips the turn-1 draft**
  (boots one phase later, at 2.1.2). So the shipped behavior is its **own
  third thing**: incumbents seated (like A) **+** boot into early-turn management
  (near B). The thread's A/B/C framing does not map 1-to-1 onto what ships → the
  boot-phase decision needs an explicit reconcile.
- **`2.4-start → no-Faction-Leader-turn-1` rules gap [NEW; option-A specific].**
  POST 7's finding: a true option-A boot (cabinet pre-confirmed ⇒ first turn at
  **2.4**) would **skip phase 2.2.3 Faction Leaders**, leaving every faction with
  **no Faction Leader for turn 1** by current rules. **Shipped:** N/A today,
  because 1856 boots at **2.1.2** (upstream of 2.2.3), so Faction Leaders ARE
  selected on turn 1 — the build **sidesteps** the gap by NOT using a 2.4-start.
  But **if the boot decision ever lands on option A (2.4-start) for any era**, this
  becomes a live rules hole the BootSheet must pre-seed (pre-assign turn-1 Faction
  Leaders) or the phase sequence must special-case.
- **Start-date-sheet error-class [NEW data-quality note; attaches to
  #186/#187].** The per-era boot source (vcczar's start-date sheet) has
  **incumbent/seat errors** — e.g. **Senate seats marked "vacant" that don't
  vacate until after the midterms** (POST 1) — plus other inconsistencies.
  **Shipped:** the 1856 boot **assigns senators algorithmically**
  (`scenario1856.ts:61-89`: historical seeds first, then party-leaning filler to
  fill all 62 seats), so it does **not** import the sheet's vacancy errors — but
  any future **data-driven `BootSheet`** (#186/#187) built from that sheet would
  inherit them. → quality bar: the per-year boot data needs a seat/incumbent
  correctness pass before it feeds the engine.
- **"Support both A and B as options" wish [folds into #263 settings / the boot
  keystone].** POST 4/6 want the start-style selectable; the app "must choose one
  eventually." **Shipped:** no setting; boot style is hardcoded per scenario. A
  future scenario-boot config could expose start-phase as a toggle (cf. the #263
  settings-surface gap).
- **Pre-election start (option C) [folds into the boot keystone + the convention
  state-machine #185].** A C-start means playing the seed-year election in-game
  (POST 1, 5). **Shipped:** no scenario boots into an election phase (2.9.x); both
  ship scenarios start at the **top** of a turn (2.1.x). Option C would require
  booting at/near 2.9 with no pre-seated incumbents — the heaviest of the three.

**Corroborations (NOT new):**
- **#92 era-band / start-anywhere model** — the whole premise (an "1820 template,"
  an "1840 template," mid-era 1960 starts) reconfirms the forum treats **arbitrary
  year-starts as off-the-shelf**, against the shipped `year % 4` era model
  (game-context.md #92; the `BootSheet` row at game-context.md L274).
- **#86/#115/#186/#187 scenario-boot keystone** — POST 1's "what phases are
  skipped because people are already in office" is **exactly** the
  `BootSheet`/back-dated-incumbents problem already logged (game-context.md L274:
  "Scenario boot: year-correct incumbents, seeded delegates, back-dated careers,
  retro-fatigue → a deterministic per-year `BootSheet`"). This thread adds the
  **start-PHASE-entry** axis to that item.
- **Designer/steward governance** — @MrPotatoTed drives the decision and will "do
  the work implementing it" pending the poll (POST 1, 20); consistent with the
  rules-steward role seen in `planb`.

---

## §5. Open questions (for the human / boot-decision owner)

1. **Pick A, B, or C for the app's canonical post-1772 boot.** Thread **leans B**
   (begin 2.1, post-election/pre-cabinet) but never formally resolves; the shipped
   1856 boot is a **hybrid that matches none** (incumbents seated + enters 2.1.2).
   Reconcile: does the app adopt B (drop pre-seated cabinet, boot 2.1.1/2.1.2), or
   keep the current incumbents-seated hybrid and just document it as the standard?
2. **If any era ever uses option A (2.4-start):** how is the **no-Faction-Leader-
   turn-1** gap (POST 7) handled — pre-seed turn-1 Faction Leaders in the BootSheet,
   or special-case the phase sequence to run 2.2.3 on a 2.4-boot's first turn?
3. **Cabinet on turn 1:** option B means a turn-1 cabinet-nomination phase
   (multiple players disliked "a Cabinet cobbling thrown at me on turn 1," POST 9);
   option A pre-seats it. Which is the intended onboarding UX?
4. **Start-date-sheet correctness:** the sheet's vacancy/seat errors (POST 1) must
   be fixed before it can feed a data-driven BootSheet — who owns that pass, and is
   it per-era (1820, 1840, … templates)?
5. **Forum vs app divergence:** forums can boot however they like (POST 6); the
   app must pick one. Document the app's choice as the canonical rule so future
   scenarios are consistent.

---

## §6. What the game-master / tech-lead / roadmap-planner should note

1. **This thread is the START-PHASE-ENTRY half of the `scenarioBoot`/`BootSheet`
   keystone.** The existing boot item (game-context.md L274) covered *who is seated*
   (incumbents, careers, delegates); this thread adds *which phase the turn enters
   and which turn-1 phases skip* (A=2.4 / B=2.1 / C=election). Fold the A/B/C
   decision into the boot keystone as a required design choice before E1.
2. **Override the thread on shipped reality:** **1856 already ships** and is the
   **default** scenario (`NewGameScreen.tsx:25`); the "only 1772 ships" claim
   (POST 6) is stale. The live boot enters **2.1.2** with incumbents seated
   (`scenario1856.ts:153`) — a hybrid that matches **neither** the thread's option
   A nor B; flag for reconcile.
3. **NEW rules gap (option-A-conditional):** a 2.4-start ⇒ **no Faction Leader on
   turn 1** (POST 7). Not live today (1856 boots upstream at 2.1.2), but a blocker
   if option A is ever adopted for any era.
4. **NEW data-quality note:** the per-era start-date sheet has **incumbent/seat
   errors** (Senate "vacant" pre-midterm; POST 1) — a correctness bar on any
   future data-driven BootSheet (#186/#187). The shipped 1856 boot sidesteps it by
   assigning senators algorithmically.
5. **Corroborates #92** (start-anywhere era bands) and the **#86/#115/#186/#187**
   boot keystone from a fresh design-discussion angle; no new playtest gameplay.
