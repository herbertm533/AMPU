# Digest — `094cc3a2` "Plan B (Non-Coding)"

> **Final committed thread-digest. DISCUSSION / PROCESS thread, NOT a playtest**
> (no historian/GA ran a game). 3 chunks / 146 posts / 102k chars (read in full).
> Citations are `===== POST n =====` markers. Raw chunks are gitignored/disposable;
> **this digest is the durable record.** Part of **batch 20** (4 small
> discussion/design threads). Nick **`planb`**.
>
> **★ Headline:** This is the **build-FINISHING PROCESS plan** for AMPU 1 —
> "Operation Plan B," the team's organized push to get the (huge) Google-Sheets
> design **clean and coded**. It is META about HOW the build gets finished, not a
> new mechanic. The OP (POST 1, **@MrPotatoTed**) lays out the team structure and
> a **7-project non-coding work slate**; the rest is the team self-assigning and
> grinding through it (Sept 2024 → Nov 2024). The most valuable extract is the
> **non-coding project slate** (terminology standardization + a database-quality /
> branch-path / meter / percentage sanity audit + a trait/interest compilation +
> a post-1772 start-game guide) and the **designer-authoritative framing**
> (vcczar: all changes must be approved by him; work in chronological order
> because Anthony imports pols/events in chronological order).
>
> **★ Disposition:** Few NEW gaps. Most content either (a) folds into **#120**
> (the dataset-accuracy umbrella — the modern-pol additions + trait-frugality
> rulings) or (b) is **process/quality work** that is logged as a small NEW gap
> for the terminology-standardization + branch-path/meter/percentage sanity-audit
> need. The thread also restates the **AMPU-2 quarantine** (full House deferred to
> AMPU 2, POST 97-98) and corroborates the era-content/era-event system.

---

## §0. Thread metadata

- **Title:** "Plan B (Non-Coding)" (forum topic 5692, politicslounge), **Sept 6
  2024 → ~Nov 20 2024** (last captured POST 146). Started by **@MrPotatoTed**.
- **Team structure (POST 1, authoritative):** **"Operation Plan B"** =
  @MrPotatoTed and @OrangeP47 named **co-managers**; **OrangeP47 oversees the
  PROGRAMMING work, Ted oversees the NON-programming work**; **@vcczar is the
  creator** ("V"). All three stay in close communication; the point of the
  non-coding work is "to make the programmer's lives easier." **@Anthony** is the
  (separate) programmer actually coding the app. **★ Mid-thread reorg:** OrangeP47
  **stepped down as co-manager** (POST 46); **@Arkansas Progressive took over the
  programming effort** (POST 50, 407); Ted remains project-managing all
  non-coders.
- **Authority tiers:** **@vcczar (creator/designer) > @MrPotatoTed (rules
  steward / non-coding lead) > community.** vcczar's POST 37 is the load-bearing
  governance statement: *"the non-coding part of Plan B isn't designed to recreate
  the game. It's to only make changes already agreed upon with me… all changes
  have to be approved by me. In most cases, if a change has strong support, I'll
  approve it unless I feel it too greatly dilutes historical realism."*
- **Volunteers self-assigned to projects:** @Saucialiste (style guide),
  @Ich_bin_Tyler (skills/interests/traits-usage review), @ebrk85 + @Euri
  (database error-fixing — Euri took Legislation, ebrk took Gov Actions, Ark took
  Events), @Pius XIII + @ConservativeElector2 (pol biographies/traits),
  @Arkansas Progressive (programming + a conflicting-trait flag macro).

---

## §1. How to use this digest

This is the PROCESS/build-finishing record. §2 is the canonical work slate (the
7 projects). §3 is the terminology-standardization decisions (the most concrete
durable output). §4 is the database-quality / branch-path / meter / percentage
sanity-audit effort. §5 is the modern-pol-addition work (→ #120). §6 is the gap
deltas. Cite POST# anchors for traceability.

---

## §2. The non-coding project slate (POST 1, MrPotatoTed) — the build-finishing plan

The OP enumerates **7 projects** "that will all need doing" to get AMPU 1 ready
to code. The brief flagged the first 4 as high-signal; all 7 listed for
completeness:

1. **Standardize terminology** — first author a style guide deciding e.g. "LW
   Pop" vs "Left Wing Populist" for every inconsistently-applied term; then
   implement the standardization across **all databases AND the rules**.
2. **Fix database errors** — typos, missing data (e.g. **laws missing the dates
   they went into effect**, even though they really did), **politicians starting
   with conflicting traits**.
3. **Deep database analysis** — "really nerding out": which events/laws lead into
   which (branch paths); do the **starting/ending eras** make sense; do the
   **meter changes** make sense; do the **percentage chances** make sense.
   Exemplars cited: **@Arkansas Progressive's "AMPU Branch Paths" thread** and
   Ted's own deep-dive on the **math of the Afghanistan War Phase I** (he found
   the **multiplier needs to be changed**) in the small-changes thread.
4. **Compile all traits & interests** — go through every rules set documenting
   **how each trait/interest is gained and what each one does**.
5. **Post-1772 start-game guide** — V has database(s) that are a good start, but
   the team needs a Word doc on how to implement a non-1772 start (e.g.
   **populating the career track with recent draft classes**), plus a close
   review of V's starting guide (the 2000 playtest found it named starting Reps
   for states **who weren't actually in the game**). Ideally the guides specify
   who has Command/Leadership/Controversial **by era** (Mark Sanford isn't
   Controversial until the hiking-the-Appalachian-Trail scandal).
6. **Rules consistency-flagging** — read the rules for interconnections, **flag
   (don't change)** anything inconsistent / unclear / imbalanced / not-fun for
   V + Ted to review.
7. **Recalculate Political Value (PV)** — give the PV formula another look so the
   way it weights traits still matches rules that "have probably changed 50
   times" (POST 24).

**→ Roadmap framing:** Projects 1-4 + 6 are **pre-build quality work** (cleaning
the design before/while it's coded). Project 5 folds into the existing scenario-
boot gap (**#115**) + the dataset umbrella (**#120**). Project 7 is a PV-formula
review (the build already has `src/pv.ts`).

---

## §3. Terminology standardization — concrete decisions (the durable output)

The single most reusable output of the thread. Decisions (Euri POST 54; Ted POST
46/68; Ark POST 55):

- **Ideologies are: `LW Pop, Prog, Lib, Mod, Cons, Trad, RW Pop`** (POST 54,
  Euri — the canonical short forms). (Matches the 7-point scale in `CLAUDE.md`,
  which spells them long: LW Populist / Progressive / Liberal / Moderate /
  Conservative / Traditionalist / RW Populist.)
- **Vocabulary buckets (Ted POST 46/68):** call Command/Legis/Gov/Admin/Military/
  Judicial **"Skills"** and points in them **"levels"**; call Business/Agriculture/
  Environment/etc **"Experience"**; call Civil Rights / RW Activists / etc
  **"Interests."**
- **Rename the military EXPERIENCE to "Army"** (since navy is part of the military,
  the experience can't be called "Military" — that's the skill). NOTE this rename
  is incomplete across docs and is itself a known dataset bug (see dbomit digest
  §"Army-not-an-expertise" + the corroboration that "Army" is mislabeled as a
  starting expertise).
- **"Human rights" vs "civil rights"** are confusingly close to new players;
  human-rights was designed to counter "Law & Order," so consider renaming it to
  e.g. **"criminal reform"** (verify against every laws/events reference first).
- **Trait-overwrite standardization** — decide whether gaining "Two-Faced"
  permanently erases "Flip-Flopper" (one trait overwriting a prior one).
- **Demographics standardization (POST 18, 29-32):** religion/gender/race need
  scrubbing; **"Tribal"** (Native-American religions, EUIV-Fetishist analog)
  wording is inconsistent rules-vs-database; a discrepancy exists over **which
  races/demographics are even tracked**.
- **Sheet conventions (POST 54-57):** `n/a` (not blank) for empty fields; `0` for
  meters a bill doesn't change; fix abbreviations ("Rev War") + random
  capitalization in legislation titles; add missing wiki links + effective dates.

---

## §4. Database-quality / branch-path / meter / percentage sanity audit

Project 3 in action. Items raised:

- **Branch-path analysis** — Ark's "AMPU Branch Paths" thread (charts which
  events/laws lead into which) is the model (POST 1, 42, 44-45); the team flagged
  potential issues there for V/Ted review (POST 44).
- **Meter-direction audit (Ted POST 46, 365):** verify the **+/- budget/revenue
  meter** moves the right way — **+ when it makes money, - when it spends** — some
  events/laws accidentally reverse this. (= corroborates **DH-53**, the per-bill
  effect-SIGN bug, from another thread.)
- **Percentage / multiplier audit:** Ted's **Afghanistan War Phase I multiplier**
  deep-dive (the multiplier needs changing) is the cited exemplar (POST 1, 42).
- **Alt-state event enter/exit columns SWAPPED** (POST 43, Ark): some alt-state
  events have their "enters"/"exits" era columns reversed (a stuck-mouse error) —
  check that the leave-era is after the enter-era, switch if not.
- **Conflicting-trait detection (POST 15, 47, 367):** Ark built a spreadsheet
  macro that **auto-flags conflicting traits**; it was moved onto the main
  character database so Pius could fix conflicts (= the 3.0 conflicting-traits
  list; corroborates **DH-27**).
- **Repealability audit (POST 82-84):** review which legislation should be
  **repealable** ("Create Minister to Great Britain" probably shouldn't be); V
  did a pass "years ago" but likely missed some.
- **Split-Electoral-Votes gov action is half-broken (POST 74-80):** the
  NE/ME-style split-EV gov action exists but "doesn't really do that" — currently
  just a **10% chance 1 EV from that state goes to the loser**; doesn't run
  separate per-district elections; doesn't make sense for large states. (Per-CD
  presidential allocation flagged as possibly an **AMPU-2** feature, POST 74.)
- **Future-era EV / state-size revision (POST 85-87):** a player argued FL keeps
  too many EVs through 2090 given climate; V notes a **climate-disaster event that
  reduces EVs (e.g. FL) if Planet's Health is bad** already exists.

---

## §5. Modern-politician additions & trait-frugality rulings → folds into #120

The thread doubles as live dataset work on the **2024-election modern slice**
(this is #120 territory — additions go via the dataset pipeline). Key
designer-authoritative rulings on stat/trait assignment (vcczar):

- **No rookie starts with Command (POST 99-101):** "No one should be starting
  with Command" — Command was **eliminated from rookies** so minor pols (e.g.
  Corey Stapleton, a MT SoS presidential candidate) can't be fast-tracked to
  President. (Corroborates **#136/#153** — rookie Command = 0.)
- **Be frugal with traits/stats on obscure pols (POST 114-115):** only assign
  **blatantly obvious** traits to minor politicians; "Efficient" is reserved for
  someone whose efficiency made them one of the greatest cabinet officers/
  legislators; strip Admin from pols with no cabinet/appointment record. (=
  corroborates the **sub-floor / who-to-include bar** in the draft-class playbook.)
- **The Elon Musk case study (POST 119-127, vcczar):** added a **celebrity gain
  date** (not born with it), **1 Command at draft** (unusable without a
  constitutional amendment), put **Obscure back** (removed once a celebrity — "no
  one should be born without obscurity in most cases"); **rejected** the
  community's pre-emptive Master Kingmaker / Geostrategist / Likable buffs as
  "insanely preemptive"; added **Unlikable** to Musk + Vivek. Added
  **Controversial** to Hegseth (community pushed back as unproven). General
  principle: **don't apply traits a pol hasn't actually demonstrated.**
- **Key-Advisor-must-be-Kingmaker (POST 127-130):** Ted floated removing the
  Kingmaker requirement for Key Advisor; ebrk warned it would make a **5-Admin
  Key Advisor** trivial (and Key Advisor affects all meters-he-has-experience-for
  during Lingering). NOTE Key Advisor was long-ago changed to **only influence
  meters he has the relevant experience for** (POST 129). (Open ruling.)
- **Roster-bloat discipline (POST 97-98, 158):** V will NOT add every US Rep
  because not every House seat is used; he keeps influential/interesting/"firsts"
  reps to avoid dragging the draft + CPU roster-scan. **A full House is an AMPU-2
  goal** (see §7). Trump-cabinet appointees + Musk go on a special tab to be added
  with priority (POST 95, 110).

---

## §6. Era-content corroboration (2023-2024 additions list, POST 133-134)

vcczar's list of **MAJOR 2023-2024 things to add** (the build's era-content/
era-event model — corroborates the era-content system, overlaps the **biden2021**
thread): Israel-Hamas War; Humanitarian Crisis in Gaza (auto-event requiring the
Gaza War); **Age and Health Concerns of President** (possibly a general event for
any president over 70); 2024-convention platform proposals; President joins the
picket line; Bipartisan Border Bill; No One is Above the Law Act; No King Act;
**Trump v. US (2024)**. Plus (from @matthewyoung123): "No tax on tips or overtime"
tax bill; increased border security (as a **pres action**, not a bill); deport
criminal aliens. vcczar's framing: *"Biden accomplished more in 2021-2022 than
Trump did his entire 1st term, [but] Biden barely did anything in 2023-2024"* —
so this short list is acceptable. (See the dedicated **biden2021** digest for the
full 2021-2025 content list.)

---

## §7. AMPU-2 / out-of-scope notes raised here (quarantine — NOT AMPU-1 gaps)

- **Full US House** = an **AMPU-2** goal (POST 97-98, vcczar): "AMPU 2 will have a
  full House… every politician that's ever been a general-election candidate for
  every elected officer (and unelected prior to popular vote in US Sen)." Folds
  into the AMPU-2 quarantine, not an AMPU-1 roadmap item.
- **Per-congressional-district presidential EV split** flagged as possibly an
  **AMPU-2 feature** (POST 74). (The current Split-Electoral-Votes gov action is
  the AMPU-1 stand-in; see §4.)
- See the dedicated **ampu2wish** digest for the full quarantined wishlist.

---

## §8. Deltas vs. current build — gap-log additions

- **NEW gap #168 — terminology standardization + database-quality / branch-path /
  meter / percentage sanity-audit (pre-build quality work).** The Plan-B
  non-coding slate (§2 projects 1-4 + 6) is real pre-coding cleanup the build
  inherits as a quality bar: a canonical terminology pass (ideology short forms;
  Skills/levels/Experience/Interests; "Army" experience rename; human-rights→
  criminal-reform; demographic-category standardization), the branch-path /
  meter-direction (+budget = makes money) / percentage-multiplier sanity audit
  (Afghanistan multiplier; alt-state enter/exit swaps; legislation repealability;
  Split-EV gov action half-broken), and the trait/interest compilation
  (how-gained + what-each-does). Distinct from #120 (dataset-row accuracy) and
  DH-53 (the build's effect-sign bugs): #168 is the **process/quality-pass +
  authoring-consistency** need + the Plan-B team-structure context.
- **Folds into #120:** the 2024 modern-pol additions (§5) + the trait-frugality
  rulings (Musk/Vivek/Hegseth; no-rookie-Command; Efficient-reserved) — all via
  the dataset pipeline (`scripts/seedDataset.mjs`).
- **Folds into #115:** the post-1772 start-game guide (§2 project 5) — incl.
  populating the career track with recent draft classes + the named-starting-Reps-
  not-in-game bug (also a #120 cross-ref).
- **Corroborations:** **DH-53** (meter-direction +/- audit, POST 46/365);
  **DH-27** (conflicting-trait flag macro, POST 15/367); **#136/#153**
  (no-rookie-Command, POST 99-101); the era-content system (§6); **#38**
  (Carpetbagger/relocation — not raised, n/a).
- **AMPU-2 quarantine (NOT a gap):** full House (POST 97-98); per-CD EV split
  (POST 74).

---

## §9. Open questions

- **Key-Advisor-must-be-Kingmaker** — keep the requirement, or drop it and risk a
  trivial 5-Admin Key Advisor affecting all meters? (POST 127-130, no ruling.)
- **Split-Electoral-Votes gov action** — should it run real per-district
  elections (currently a 10%-chance-1-EV-to-loser stub), and is per-CD allocation
  AMPU-1 or AMPU-2? (POST 74-80.)
- **Demographic categories** — the exact race/religion set to track (Middle
  Eastern? ditch Protestant/White as defaults?) is contested (POST 18, 29-32; see
  also the dbomit digest).
- **PV recalculation** (project 7) — no concrete proposal; just flagged.

---

## §10. What the game-master / tech-lead / roadmap-planner should note

1. **`planb` is the build-FINISHING PROCESS plan** — the team's organized push to
   clean the Sheets design and feed it to the programmer (Anthony) in
   **chronological order** (POST 72: Anthony imports pols/events chronologically,
   was on 1772-1774; edit everything else from after 1772 forward). This frames
   HOW the remaining roadmap work gets done.
2. **Designer governance (POST 37):** all changes go through vcczar; strong-support
   changes are approved unless they dilute historical realism. Treat the
   non-coding outputs as *cleanup*, not redesign.
3. **NEW gap #168** — the terminology-standardization + branch-path/meter/
   percentage sanity-audit + trait/interest-compilation quality pass.
4. **Most content folds into #120** (modern-pol additions + trait-frugality
   rulings) and **#115** (the post-1772 start-game guide).
5. **AMPU-2 quarantine:** full House + per-CD EV split are explicitly deferred —
   do NOT roadmap them for AMPU 1.
