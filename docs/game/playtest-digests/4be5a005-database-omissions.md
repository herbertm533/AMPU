# Digest — `4be5a005` "Database Omissions"

> **Final committed thread-digest. DISCUSSION / dataset thread, NOT a playtest**
> (no historian/GA ran a game). 2 chunks / 106 posts / 60k chars (read in full).
> Citations are `===== POST n =====` markers. Raw chunks are gitignored/disposable;
> **this digest is the durable record.** Part of **batch 20**. Nick **`dbomit`**.
>
> **★ Headline:** A **missing-politician request thread** — the community
> compiling a list of historical/contemporary politicians NOT yet in the pol
> database, to be added when the team next does a dataset pass. **PURE DATASET
> WORK → folds entirely into the #120 umbrella.** No new mechanics. The durable
> extracts are (a) **vcczar's inclusion BAR** (who qualifies for the dataset), (b)
> the **bucketed catalog** of names requested, and (c) a handful of
> **demographic/trait standardization rulings** (Middle Eastern ethnicity; ditch
> Protestant/White as no-op defaults; "Crazy" trait rejected).
>
> **★ Disposition:** **Do NOT log a gap row per politician.** Everything here is
> input for the **one scheduled dataset-maintenance pass (#120)**, run via
> `scripts/seedDataset.mjs` `CURATED_ROWS` / `ERA_FIGURES` (NOT by hand-editing
> the JSON/CSV — `CLAUDE.md`). ~167 people were filled out during the thread
> (POST 75). This digest buckets, it does not enumerate.

---

## §0. Thread metadata

- **Title:** "Database Omissions" (forum topic 5625, politicslounge), **Aug 17
  2024 → ~Feb/May 2025** (last captured POST 106). Started by **@Zagnut** asking
  if there's a thread for reporting omissions (Ira Allen, Peter P. Smith missing).
- **Roles:** **@ConservativeElector2 ("CE2") put in charge** of collecting the
  missing-pol list (POST 12, vcczar) — community-curated; **@MrPotatoTed** project-
  manages all non-coders; **@vcczar (designer)** sets the inclusion bar + approves.
  @Pius XIII + @Euri + @Zagnut + @theFreezerFlame + @Arkansas Progressive
  contribute names/bios. **Authority: vcczar > CE2/community.**
- **Working method:** a shared Google Sheet (POST 13, 67) collecting name + wiki
  link + office-ran-for; bios written later (one-sentence blurbs for obscure
  pols). New 2024-election additions kept in a **separate tab** because **Anthony
  is using the pols as they were ~a year ago** (POST 100) — updates merged later.

---

## §1. vcczar's inclusion BAR (authoritative — the who-to-include rule)

The reusable rule for whether a politician qualifies for the dataset (POST 12,
50, 76, 83, 88; corroborates the draft-class authoring playbook):

1. **Viability test:** the pol must have **gotten within 0-9% of winning as US
   Rep, US Sen, or Gov**, OR be a **US Rep not yet in the game who should be**.
2. **Special allowances** only: an interesting **primary loser** if the primary
   was exceptionally close; a **celebrity / high-name-recognition** figure
   (vcczar-approved case-by-case).
3. **No state-level pols** (state reps/admins) unless they meet #1 — V will not
   approve obscure state pols who are "99% unlikely to be US Sen, Gov, etc."
4. **Generated pols fill the future:** V **prefers the name generator** over
   adding obscure youngest-state-legislators who likely go nowhere (POST 76,
   82-83) — a deliberate choice (CE2 mildly disagreed, POST 87-88, preferring real
   people; vcczar's view stands).
5. **Playtesters-as-pols allowed (POST 50):** a playtester who wants to be in the
   game gives birth-year, party, ideology, **1 skill (NOT Command)**, 1 expertise,
   1 interest, **no traits**, state-at-age-25 (+ alt-state if moved since 25) +
   demographics — i.e. **sub-floor rookie stats** ("we gotta kind of suck as
   rookie politicians").
6. **No rookie starts with Command** (cross-thread, planb POST 99-101).

**Consistency caveat (POST 89, Zagnut):** the bar is **unevenly applied** —
some borderline figures (Maebe A. Girl, an HOA board member capped at 12%; Kimberly
Hampton, a low-ranking military officer, not a politician) are in, while similar
others are rejected. Flags a dataset-consistency open question, not a mechanic.

---

## §2. Bucketed catalog of requested additions (→ #120; exemplars, NOT exhaustive)

~167 people were filled out (POST 75). Buckets:

- **Antebellum / 19th-c. notables:** Ira Allen ("the Metternich of Vermont"),
  Peter P. Smith (VT, between Jeffords & Sanders), **Robert Dale Owen** (IN, Blue
  LW Pop, Jacksonian socialist), Stephen Hopkins (RI Founding Father), Lincoln
  Diaz-Balart (FL — only created for the Terra playtest, never on the master).
- **Single-term / never-seated / brevity-of-service Reps** (the long obscure
  tail): worked from Wikipedia lists of single-term Reps, members-elect who never
  took their seats, and brevity-of-service members (POST 39, 49, 66) — CE2 worked
  up to the 5th Congress; reps-never-seated finished (POST 42).
- **2024-election cycle additions (POST 32-33, big slate, vcczar):** Tom Suozzi,
  Ruben Gallego, Kari Lake, Debbie Mucarsel-Powell, Elissa Slotkin, Mike Rogers
  (MI), Tim Sheehy, Sam Brown, Andy Kim, Bernie Moreno, David McCormick, Colin
  Allred, John Curtis, Eric Hovde, Jim Banks, Angela Alsobrooks, Shomari Figures,
  Amish Shah, Anna Paulina Luna, María Elvira Salazar, Austin Theriault, Marie
  Gluesenkamp Perez, Patrick Morrisey, Mike Kehoe, Joyce Craig, Josh Stein, Mark
  Robinson, Kelly Armstrong, Bob Ferguson, + Geoff Young, Mark Esper, George Helmy
  (NJ interim Sen — starts R, becomes D, can-be-independent), Ashley Moody (FL),
  Katie Porter, Sarah McBride (already in), Laura Friedman, Bob Onder.
- **State Supreme Court Chief Justices** serving >10 yrs (a recurring add-class,
  POST 66).
- **Playtester self-inserts** (incl. a Patine-based pol, POST 84-86).

---

## §3. Demographic / trait standardization rulings (small, authoritative)

- **Ethnicity: add "Middle Eastern"** as a category (POST 74) — Egyptians / North
  Africans aren't Black and can't be Asian; Western-Asian (Iran/Syria) can be
  Asian, but Middle Eastern is the cleaner catch-all.
- **Religion (POST 72-73, 94-99):** use **Theist/Spiritualist** as a catch-all for
  deists / non-organized believers. **Orthodox / Coptic NOT added** as a distinct
  faith — **Protestant is the default** (covers all non-Catholic Christian) and
  carries **no in-game bonus/penalty**; only **Catholic / Mormon / Jew** have
  historical bonuses/penalties. **Ditch the "Protestant" trait** (and "White"
  race) as a no-op default if nothing in-game references it ("No point to traits…
  that don't do anything," Ted/Euri/Ark POST 96-99). Catholic political
  significance = Quebec/AZ/NM bonus + New England debuff (POST 95).
- **"Crazy" trait REJECTED (POST 63-71, vcczar):** theFreezerFlame asked for a
  "Crazy" trait (−2 elections) for figures like Mark Robinson; **vcczar refused** —
  he used to have more-insulting traits but **fears lawsuits/threats** from
  campaigns; **Controversial** + Scandal general events + Incoherent/Incompetent
  collectively cover it. Would reconsider only if ~20 pols qualify as "crazy."
  NOTE: **Controversial is for scandal-liable pols** (Robinson goes in
  Controversial); **polarizing figures = LW/RW Activists**, NOT Controversial
  (vcczar POST 70).
- **Huey Long ideology debate (POST 56-59):** challenged as not-LW-Pop; vcczar
  keeps him LW Pop (Share-the-Wealth ≈ socialism; **LW Pop and RW Pop heavily
  overlap in the 1930s** — many MN/SD/ND/ID pols could be either). General
  principle: **ideology categorization is muddled pre-WWII** (Federalists/
  Jeffersonians/Jacksonians hard to bin); vcczar is satisfied with his 7,000+
  classifications.

---

## §4. Dataset-quality bugs surfaced (→ #120, corroborate existing rows)

- **Starting expertise wrong/missing (POST 44-45, Ted):** many pols have a
  starting expertise they're never shown to have later; **Media expertise
  mislabeled** on pols with no early media involvement (many should be Justice);
  found while running the 2004 draft (likely systemic).
- **"Army" listed as a starting EXPERTISE — but it's not an expertise (POST
  45-47):** should be **Military** (the experience was renamed Military→"Army" to
  differentiate from the Military *skill*, but not all references were updated —
  corroborates the **planb terminology-standardization** need / #168 + #120).
- **Death dates missing for pols who died since 2022/2023 (POST 90-92):** a
  tedious dataset pass needed before any 2024+ start date is created — audit every
  pol born before 1950 not flagged dead.
- **Bills / Bill-of-Rights era placement (POST 105, Ark):** ensure all
  Bill-of-Rights bills + constitution articles are in the correct eras.

---

## §5. Deltas vs. current build — gap-log additions

- **NO new gap rows.** Everything folds into existing rows:
  - **#120 (dataset-accuracy umbrella):** the entire missing-pol catalog (§2) +
    the dataset-quality bugs (§4: wrong/missing starting expertise, "Army"-as-
    expertise, missing death dates, Bill-of-Rights era placement) + the
    demographic/trait standardization (§3). Added as a count + exemplars; **no
    per-politician rows.**
  - **#168 (terminology standardization, NEW via planb):** the "Army" expertise
    rename incompleteness + the demographic-category standardization (§3) are the
    same pass.
  - **#115 (scenario-boot):** the named-starting-Reps-not-in-game cross-ref
    (POST 15-16, 25-26) — Reps named for a 2000/2004 start that aren't in the
    game.
- **Inclusion-bar principle (§1):** reinforces the draft-class authoring playbook
  (viability bar + sub-floor rookie stats + name-generator-for-the-future).
- **AMPU-2:** none raised here.

---

## §6. Open questions

- **Inclusion-bar consistency** (POST 89): the 0-9%-viability bar is applied
  unevenly (Maebe A. Girl / Kimberly Hampton in, similar others out) — needs a
  consistent rule if the dataset is ever audited for fairness.
- **Real-pols-vs-generated for the future** (POST 82-88): vcczar prefers the name
  generator; CE2 prefers real people. vcczar's stance stands for AMPU 1.

---

## §7. What the game-master / tech-lead / roadmap-planner should note

1. **Pure dataset work → #120.** This is an input catalog for the one scheduled
   dataset-maintenance pass; **no per-pol gap rows**; goes via
   `scripts/seedDataset.mjs`, NOT by hand-editing the JSON/CSV.
2. **Reusable inclusion bar (§1):** 0-9%-of-winning US Rep/Sen/Gov (or a missing
   US Rep) + sub-floor rookie stats + name-generator for the deep future — feeds
   the draft-class playbook.
3. **Small standardization rulings (§3):** add **Middle Eastern** ethnicity; drop
   no-op **Protestant/White** defaults; **"Crazy" trait permanently rejected**
   (use Controversial). These pair with the **planb terminology pass (#168)**.
4. **Tedious-but-required dataset chores:** death dates for post-2022 deaths;
   starting-expertise audit; "Army"-vs-Military expertise relabel.
