# Digest — `4747b09f` "Ted's Change Log of Doom" (THE PRIMARY CHANGELOG)

> **Final committed thread-digest. PRIMARY-SOURCE CHANGELOG, not a playtest and
> not a discussion.** 1 chunk / 31 posts / 39k chars. Citations are
> `POST n`. Raw chunk is gitignored/disposable; **this digest is the durable
> record.**
>
> **★ What this is:** This is **@MrPotatoTed's actual "Change Log of Doom"** —
> the CLEAN, comment-locked thread (POST 1: *"PLEASE DO NOT COMMENT IN THIS
> THREAD"*) where Ted, doing his **final deep-dive cleanup pass on the official
> rules doc** "before we have to balance any future edits … to set our
> programmers up for success," posts his **section-by-section numbered rule
> changes** as he makes them. He keeps it clean so the **coders and playtesters**
> can review the deltas in one place. This is the **authoritative ruling /
> changelog source** — the actual edits, not the debate about them.
>
> **★ Relationship to `a0f0bf04`:** The *discussion* thread ABOUT this changelog
> was ingested separately (batch 12b) as `a0f0bf04-discussion-teds-change-log-of-doom.md`,
> which is the **decision-LOG** (proposal → debate → Ted ruling), spanning 408
> posts. THIS digest is the **PRIMARY SOURCE** — the concrete numbered edits Ted
> actually wrote to the rules doc. **Where a0f0bf04 said "percentages TBD" or
> "RULED in concept," this thread frequently HAS THE ACTUAL NUMBERS** (cabinet
> enthusiasm 20/10/5%, the full era-keyed retirement + death charts, the
> event-enthusiasm +100→+10% formula, the CC delegate counts). The two are
> complementary: read a0f0bf04 for *why* a change was made and what was debated;
> read THIS for the *exact final wording/numbers* of the change.
>
> **★ Disposition:** **AUTHORITATIVE.** This is Ted's own published changelog.
> Its entries are the canonical statement of the rules doc as of this pass
> (Sept 18 2024 → resumed late, last entry tracks "Anthony actively working on
> 1774-1788," POST 31). For the gap log: these are designer rulings →
> §30.x designer-ruling-index material; many pin numbers the build needs.
> **Scope of this 31-post chunk:** the pass runs **2.1 (drafts) → 2.1.4-2.1.8
> (relocate/ideology/conversion/kingmaker/cards) → 2.2 (congressional
> leadership) → 2.3 (cabinet enthusiasm) → 2.4 (death/retirement/events/Pres
> implementation) → 2.9.8 (First Continental Congress)**, then incorporates
> discussion-thread feedback as UPDATE edits. It STOPS at the CC section (the
> 2.5/2.6 work that a0f0bf04 records as discussion happened in later changelog
> entries not present in this 31-post export).

---

## §0. Thread metadata

- **Title:** "Ted's Change Log of Doom" (forum topic **5720**, politicslounge;
  note a0f0bf04 is the sibling *discussion* topic 5721). Started **Sept 18
  2024** by **@MrPotatoTed** ("Ted"; rules steward / sub-designer).
- **Comment lock:** Ted repeatedly forbids replies here ("PLEASE DO NOT COMMENT
  … use the emoji reactions … comment on the discussion board," POST 1, 4, 6, 9,
  15). A handful of posts late in the export (POST 27, 29) ARE other users
  (Umbrella) commenting/asking despite the lock — Ted redirects them to topic
  5721 (POST 30). So **POST 27 + 29 are NOT Ted**; everything else is Ted.
- **Authority:** This is the **canonical edit log for the official rules doc.**
  Ted's stated intent (POST 1): *"my intent is to NOT make big changes … nearly
  all of the changes will be so small you wouldn't notice them … However, there
  are some things that are either broken as written (and house ruled away by our
  playtesters), or conflict with other parts of the rules, or are overly
  complicated for no particular reason."* → **Every entry is one of: (a)
  clarification, (b) broken-as-written fix, (c) house-rule-codification, (d)
  conflict-resolution, (e) de-complication.**
- **"AB" notes:** Several entries reference bracketed `[AB …]` notes Ted found in
  the rules doc (e.g. "[AB have to set Geo Ideologies]", POST 7 #3; POST 29) —
  Ted reads these as **reminders left by the programmer "Anthony"** (Anthony
  Bennett) for himself; Ted leaves them in place pending Anthony's future on the
  project. **Signal: the rules doc was being co-edited with the programmer in the
  loop.** (Corroborates a0f0bf04 §0's "Anthony coded alongside this thread.")

---

## §1. The changelog — concrete edits by rule section

Format per entry: **what it WAS → what it BECAME → why** (cited). ★ = pins a
number/wording the build needs or touches a tracked gap. UPDATE rows are Ted's
later revisions after discussion-thread feedback (POST 11-16, 26, 28, 31).

### §1a. 2.1 — Draft rules (POST 2-5, 10-13, 31)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.1 #1 ★ | (nothing) | **When the plantation economy is eliminated (usually via the American Civil War), plantation industries convert to Agriculture at 2:1** (10 plantation → 5 Agriculture). | Accepted a playtester recommendation. **NEW economic rule — not in a0f0bf04.** Ties to abolition/ACW economy transition. | POST 2 |
| 2.1 #2 | "Players will have to abide by the assigned ideological restrictions by Historical Era during the draft." | **Removed** (kept the later, clearer ideology-restriction explanation). | "I didn't know what the heck that meant." De-complication. | POST 2 |
| 2.1 #3 | "In the inaugural draft, each player will choose a primary ideology, and they'll be allowed to draft from their **border ideologies**." | **"At the start of a new game, the player will choose a beginning faction, which will have 2-3 assigned draft ideologies. You may only draft from these ideologies, unless otherwise noted… your faction's draft ideologies may change from era to era."** | Old wording "isn't true." **Faction-driven draft-ideology set (2-3), era-variable.** ★ pins the draft-eligibility model. | POST 2 |
| 2.1 #4 | — | Reordered the draft explanation for flow; **no mechanical change.** | Readability. | POST 3 |
| 2.1 #5 ★ | Harmonious/disharmonious **faction leader** affected odds of drafting outside your draft ideologies (risking a lost pick). | **Now also considers the harmonious/disharmonious trait of the DRAFT TARGET.** FL and/or target harmonious → easier; either disharmonious → harder; **if one is disharmonious and one harmonious, disharmonious wins (harder).** | Make the out-of-ideology draft roll account for both parties. **NEW nuance — not in a0f0bf04.** | POST 3 |
| 2.1 #6 ★ | "Can party flip" pols were draftable by **either** party at **50%** during their draft year (so a "Democrat" Reagan wasn't actually auto-Democrat). | First clarified (retain can-party-flip; only applies to rookie not inaugural drafts) → **then REMOVED entirely (UPDATE, POST 11): pols can no longer party-flip during the draft. They enter as their historically accurate party in their draft year (Reagan enters Democrat, flips later via 2.1.6).** Also removed the CPU cross-party-draft rules. | Broken/contradictory as written; player feedback. ★ = gap **#137** (a0f0bf04). | POST 3, 11 |
| 2.1 #7 ★ | 9th/10th place gives **+1 to a randomly chosen skill (incl. Command)** to your first draft pick. | First → "you choose the skill, but **Command is no longer an option**" → **then UPDATE (POST 12): back to RANDOM, but Command stays unattainable this way.** Removed the CPU "which skill to take" rule (moot once non-choosable). | "Presidents should come from somewhere" — no free Command. ★ = gap **#136**. | POST 4, 5, 12 |
| 2.1 #7.1 | (CPU had no rule) | CPU rule: in 9th/10th place, **CPU gives the +1 to the skill the pol already has the most of** (ties random). NOTE: mooted by the POST 12 revert-to-random, but logged. | CPU determinism. | POST 5 |
| 2.1 #8 | Ambiguous | "Random traits to random rookies" applies **only to rookie drafts, NOT the inaugural draft.** | Clarification. | POST 5 |
| 2.1 #9-10 ★ | **5 random rookies** get random traits; **5** get alt-states. | First → **1 and 1** → **then UPDATE (POST 13): 3 random rookies get random traits + 3 get alt-states.** | "Too much randomness makes a Barack Obama no longer feel like Barack Obama." Compromise after feedback. ★ = gap **#138** (3/3 canonical). | POST 5, 13 |
| 2.1 #11 | — | If a newly-granted trait conflicts with an existing one, **roll on the trait conflict chart (3.0).** | Clarification. | POST 5 |
| 2.1 #12 | Rookies could only gain traits from an **"allowed" list** (no Celebrity, etc.). | **Removed the allowed-list** (too limiting — a 25-yr-old could plausibly be a celebrity). | De-restriction. | POST 5 |
| 2.1 #13 ★ | (allowed list) | **Replaced with a "NOT allowed" list** for random rookie traits: **Kingmaker, Military Leader, Two-Faced, Flip-Flopper, Decisive General, Master Kingmaker, Carpetbagger, Union Loyalist.** | Invert to a blocklist. ★ pins the rookie-random-trait blocklist. | POST 5 |
| 2.1 #14 | — | CPU inaugural-draft priorities now also include **military leadership, Generals, Admirals, Cabinet-Level Officers, Ambassadors** (die-roll dependent). | Fill out CPU draft logic. | POST 5 |
| 2.1 #15 ★ | — | CPU rule (ALL drafts): **if an instruction can't be followed, take the highest-PV draftee** (e.g. told to take a Kingmaker but none on board). | Fallback determinism. ★ general CPU-draft fallback. | POST 5 |
| 2.1 #16 | "he/she" | CPU's gender set to **"it"** (consistency goal across rules). | Style. | POST 5 |
| 2.1 #17 ★ | "5% drafts leadership, 5% drafts charisma" (risk: not on board). | Reworked to a **25% chance of taking the highest-PV pol who has ANY of [the priority traits]**. | Old per-trait percentages often whiffed. ★ CPU draft-priority rework. | POST 5 |
| 2.1 #18 ★ | — | CPU gets **25% chance to attempt drafting someone outside its draftable ideologies OR "can party flip"** if that's its top board pick; else move to next. | Mirrors player option. ★ CPU out-of-ideology draft rate = 25%. | POST 5 |
| 2.1 #19 | CPU tried to draft fellow **dynasty members starting round 4**. | **Removed** (no benefit to CPU). | De-complication. | POST 5 |
| 2.1 #20 ★ | Random Politician Generator for drafts started **Era of the Near Future**. | **Moved earlier to Era of Populism** (later drafts are rookie-thin). | Flesh out thin modern drafts. ★ generated-pol start era = Era of Populism. (Distinct from cf82a7d3's uncontested-race generation.) | POST 5 |
| 2.1 (cleanup) | "cop" trait | **Renamed "cop" → "lawful"** to match the Excel sheets. | Naming consistency. | POST 26 |
| 2.1.7 (KM transfer) ★ | (see §1e) | UPDATE (POST 31): added **Kingmaker, Hale, Flip-Flopper** to the do-NOT-transfer-from-Kingmaker list (Celebrity stayed — feedback 50/50). | Overwhelming tester feedback. ★ = gap **#129**. | POST 31 |

### §1b. 2.1 Career Track (POST 6)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| CT #1 ★ | (no codified backdating) | **At game start you may backdate career tracks by 3 draft classes** — e.g. starting in 2000, rookies from 2000/1996/1992/1988 can be slotted (a 1988 rookie → Year 12). | Codifies what GMs already do for post-1772 starts; deliberately **NOT all 5 classes** (avoid instant mega-pols who hadn't done much by the start date historically). ★ NEW scenario-boot rule — refines #115 (boot procedure). | POST 6 |
| CT #2 | — | A backdated rookie who **already holds a job (Rep, General, etc.) at start date cannot join the career track.** | Consistency. | POST 6 |
| CT #3 | "Rookie minorities not yet enfranchised can't be on the career track." | **Removed** (you can't draft them anyway; draft rules already bar women/racial minorities until enfranchised, who then enter the next draft at current age unless their historic death year passed). | Redundant. ★ corroborates the enfranchisement-gated draft rule. | POST 6 |
| CT #4 | (implicit) | Stated explicitly: **career-track pols advance every 4 years**, freeing slots for new rookies. | Clarification. | POST 6 |
| CT #5-10 ★ | Per-ideology career-track interest-gain lists + **10% per-interest** roll. | **Reworked interest lists + changed to a single 10% roll for ONE interest** (random among those pairing with the rookie's ideology). Specific list edits: RW Populist +Expansionist/+Theocrat; Traditionalist +Reformist/+Expansionist; Conservative +Reformist/+Expansionist/+Theocrat; Liberal +Civil Rights/+Reformist/+Pacifist; **Moderate −Expansionist (Moderates now gain NO career-track interests).** | Old per-interest rolls compounded; rebalance which ideologies can pick up which interests. ★ pins the career-track interest-gain table. | POST 6 |

### §1c. 2.1.4 Relocating + 2.1.5 Ideology Changes (POST 7)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.1.4 ★ | — | **NO CHANGE.** Ted stared at relocation for 3 days and couldn't improve it ("obviously it must be perfect"). | — Note: the **relocation-cap-4** ruling lives in the **cf82a7d3 bug thread**, NOT here (confirms a0f0bf04 §7 #1). | POST 7 |
| 2.1.5 #1 | "A player may MOVE a politician's ideology one step…" | "A player may **ATTEMPT TO** move…" (shifts can fail). | Accuracy. | POST 7 |
| 2.1.5 #2 ★ | CPU shifts ideology **20%** of the time when a pol is exactly one step from matching its state's or party leader's ideology. | **CPU now ALWAYS (100%) attempts** that shift. | Strengthen CPU behavior. ★ pins CPU ideology-shift trigger. | POST 7 |
| 2.1.5 #3 | "[AB have to set Geo Ideologies]" embedded in the 60%-toward-state-ideology rule | **Left as-is** (read as Anthony's self-note; the preferred state ideologies already exist; pending Anthony's status). | Don't touch programmer notes yet. | POST 7 |
| 2.1.5 #4 | Anthony's open question on "highest ideology enthusiasm in the party" | Ted answered in a comment (mechanism for determining it). | Clarification. | POST 7 |
| 2.1.5 #5 ★ | CPU capped how many pols it would try to ideology-shift. | **Removed the cap — CPU follows normal CPU action counts (3-9 depending on traits).** | Consistency w/ CPU action economy. | POST 7 |
| 2.1.5 #6 ★ | — | When picking pols to ideology-shift, **CPU prioritizes career-track pols.** | Mirrors a common human strategy (park a flip-flopper on the track 20 yrs, trait lapses). ★ CPU shift-target priority. | POST 7 |
| 2.1.5 (CPU 60/40) ★ | (ambiguous) | (POST 29-30, in answer to Umbrella) **CPU rolls the 60/40 [state-ideology vs highest-party-enthusiasm-ideology] chart ONCE PER POSSIBLE MOVE** (after the 100% Kingmaker-fix check); among eligible pols for the chosen shift type, **prioritize career-track (randomize within), then randomize the rest; only one-step-possible pols attempt.** | Resolve CPU shift-selection ambiguity. ★ pins the CPU ideology-shift selection algorithm. | POST 29-30 |

### §1d. 2.1.6 Politician Conversions (POST 8, 14-15)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.1.6 #1 ★ | Disgruntled auto party-flip chance = **25%**. | First → **75%** → **then UPDATE (POST 14): 33%** after feedback. | Hard to even trigger (4 conditions), so 25% too low; 75% too high. ★ disgruntled party-flip rate = **33%**. (Refines the conversion-rate gap; a0f0bf04 framed 75%→33% as the cross-party *conversion* rate — primary source ties the 33% to the **disgruntled auto-flip** specifically.) | POST 8, 14 |
| 2.1.6 #2 ★ | **No way to GAIN "can party flip"** (born-with-it only). | **NEW: 1% chance to gain "can party flip"** for a pol who'd face a disgruntled-flip roll but isn't marked flippable. Requires 4 triggers: personal ideology maxed toward the opposite party, not Puritan, not a faction leader, hits the 1%. **UPDATE (POST 14): removed the special 10%-for-Moderates; now 1% for all.** | Create a path to acquire the trait. ★ NEW rule — **not in a0f0bf04.** | POST 8, 14 |
| 2.1.6 #3 ★ | (proposed) faction leaders could steal **Pliable** pols whose ideology is **adjacent** to the FL's. | **REJECTED here** (POST 8): stealing FL's ideology must MATCH the pliable pol's. → **REVERSED later (POST 15): same-party conversion (stealing an ally's pol) IS now allowed if the stealing FL's ideology is ADJACENT to the target's.** | Note the **flip-flop**: Ted first rejected adjacency for *inter-party* pliable steals (POST 8), then granted adjacency for *same-party* steals (POST 15). ★ = gap **#76**/**#127** adjacency. The inter-party pliable-steal still requires an exact ideology match. | POST 8, 15 |
| 2.1.6 #4 ★ | Failed **inter-party** conversion could grant the target **Purity**. | **Extended:** a failed **opposition-party** conversion can now also grant **Purity**. | Symmetry. ★ pins failed-conversion → Purity rule. | POST 8 |

### §1e. 2.1.7 Kingmakers & Protégés (POST 9, 16, 31)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.1.7 #1 | "Anyone with a military office" couldn't be a protégé. | **Removed** that restriction. | De-restriction. | POST 9 |
| 2.1.7 #2 | (wordy) | Clarified protégé counts per Kingmaker type; **no mechanical change.** | Readability. | POST 9 |
| 2.1.7 #3 ★ | Master Kingmaker **+ Leadership = 4 protégés** (in one stray sentence). | **= 3 protégés.** Standardizes: **Master Kingmaker = protégés from ANY state; Leadership = 3 protégés.** | Fix a self-contradiction. ★ pins protégé-count stacking. | POST 9 |
| 2.1.7 #4 ★ | Master Kingmaker protégés had a **20% chance of +2 Command**. | **Removed the 20%/+2.** They still get a **guaranteed +1 Command.** | De-complication. ★ pins protégé Command grant = +1 flat. | POST 9 |
| 2.1.7 #5 | — | Added **Nationalist–LW Activist** to the interest pairs that can't be paired in the Kingmaker/Protégé phase. | Balance. | POST 9 |
| 2.1.7 #6 ★ | Kingmaker→protégé trait gain used a limited **"can-gain"** allowlist. | **Replaced with a "CANNOT-gain" blocklist:** Frail, Lackey, Incoherent, Obscure, Two-Faced, Late Bloomer, Overeager (latter two being removed from the game), Master Kingmaker, Carpetbagger. | Invert to blocklist. ★ — see UPDATE below. | POST 9 |
| 2.1.7 #6 (UPDATE) ★★ | (above blocklist) | **POST 31: ADDED Kingmaker, Hale, Flip-Flopper** to the no-transfer list (Celebrity kept — feedback 50/50). **So the final no-transfer set = Frail, Lackey, Incoherent, Obscure, Two-Faced, Late Bloomer, Overeager, Master Kingmaker, Carpetbagger, Kingmaker, Hale, Flip-Flopper.** | "Overwhelming tester feedback." ★ = gap **#129**. **NOTE conflict w/ a0f0bf04:** the *discussion* digest recorded Ted (POST 203, discussion) *defending* keeping Hale/basic-Kingmaker transferable; **the PRIMARY changelog (POST 31) shows he ultimately BLOCKED Kingmaker + Hale + Flip-Flopper.** Trust the changelog: **basic Kingmaker and Hale do NOT transfer.** This SUPERSEDES a0f0bf04's gap #129 wording ("Kingmaker basic / Hale CAN be passed") — they CANNOT. | POST 31 |
| 2.1.7 #7 | "Protégé earns double faction points; protégé-becomes-Pres = +1000 to the Kingmaker's faction." | **Moved out** of this section → to elections (later). | Misplaced. | POST 9 |
| 2.1.7 #8 | — | Added **Supreme Court Justice + House/Senate Minority Leaders** to the jobs that BREAK the Kingmaker/protégé bond when a protégé attains them (consistent with positions listed elsewhere as not allowed to have Kingmakers). | Consistency. | POST 9 |
| 2.1.7 (CPU) ★ | (no rule) | **POST 16: 100% chance — if a CPU Kingmaker has no protégé and no prospects, it attempts to shift its OWN Kingmaker toward a random potential protégé if doable in one step** (else fall through to other priorities). | Fix CPU dead-Kingmaker case. ★ = a0f0bf04 §2a 9/26 ruling, here as the written rule. | POST 16 |

### §1f. 2.1.8 Faction Cards (POST 10)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.1.8 #1 ★ | **Isolationist** card eligibility so restrictive it almost never got assigned in any era. | **Expanded eligibility** (Eric's version, already widely house-ruled). | Codify the house rule. ★ pins isolationist-card eligibility widening. | POST 10 |

### §1g. 2.2 Congressional Leadership Elected + 2.2.3 Faction Leaders (POST 17-18)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.2 #1 ★ | (no term cap) | **NEW: no pol may serve more than TWO terms (4 years) as President of the Continental Congress.** | Even John Jay served <3 yrs historically; 4-yr cap still generous. ★ NEW CC-Pres term limit. | POST 17 |
| 2.2 #2 ★ | (no rule) | **NEW: if House legislative power is split 50/50, the party that does NOT hold the Senate majority is the House Majority/Speaker.** | Models the compromises of a 50/50 House. ★ = gap **#135** (inverse-control rule). Possible historically (even Reps were once possible). | POST 18 |
| 2.2 #3 | — | Accepted: **CPU factions consolidate around a single congressional-leadership candidate by round 4 of voting.** | CPU convergence. | POST 18 |
| 2.2.3 #1 ★ | **25%** chance a Passive pol can't be a faction leader. | **100%** (Passive fully blocks FL) — **EXCEPTION: elected Presidents are always faction/party leaders.** | Strengthen. ★ pins Passive-blocks-FL = 100% + elected-Pres exception. | POST 18 |
| 2.2.3 #2 ★ | (some order) | **Reworked the "nobody qualifies for FL" fallback ladder:** drop "not obscure" → drop leadership req → drop career-track req → drop interest/lobby req → drop passive/lackey/incompetent reqs (leaving only: FL's personal ideology must match one of the faction's ideology cards). | Make the relaxation order explicit. ★ pins the FL-eligibility relaxation ladder. | POST 18 |

### §1h. 2.3 Cabinet → Enthusiasm (POST 19) ★★ HAS THE ACTUAL NUMBERS

> **★★ This is the most build-relevant entry and where the PRIMARY SOURCE beats
> a0f0bf04.** a0f0bf04 recorded the cabinet→enthusiasm rework as "RULED in
> concept, percentages TBD." **The changelog HAS the percentages.** Ted: old
> rules "led to huge enthusiasm swings based off of who the Sec of Interior was";
> this is the version "we've been testing successfully in the 2000 game."

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.3 #1 ★ | (undefined) | Defines **"Cabinet" = all Secretary positions + Attorney General**; **"Cabinet Level" = all non-Secretary/AG posts EXCEPT Ambassador, General, Admiral** (those get their own rule). | Disambiguate. ★ pins the cabinet-tier definitions. | POST 19 |
| 2.3 #2 ★★ | Conflicting old language; big swings from a single appointee. | **NEW cabinet-enthusiasm rule:** For each lobby/interest: **exactly ONE wanted Cabinet post → content (no change). ZERO wanted Cabinet posts → 20% chance ideology enthusiasm for any faction with that card drops −1 (away from Pres's party). MORE THAN ONE wanted Cabinet post → 20% chance +1 (toward Pres's party).** **Does NOT stack** (5 wanted posts = still one 20% roll). **One roll per lobby/interest** even if multiple factions share the card (the single outcome hits all of them). | The shipped fix from the 2000 playtest. ★★ = gap **#124** — the **actual numbers** the build needs: **20% per lobby for Cabinet, single non-stacking roll.** | POST 19 |
| 2.3 #3 ★ | — | **Cabinet-LEVEL posts work the same way but at 10% chance.** | Tiered influence. ★ pins Cabinet-Level = 10%. | POST 19 |
| 2.3 #4 ★ | — | **Generals/Admirals/Ambassadors work the same way but at 5% chance.** | Lowest tier. ★ pins Gen/Adm/Amb = 5%. | POST 19 |
| 2.3 #5 | (ambiguous) | The "will an official accept a nomination" section is **for the CPU only**; human players accept/decline freely. | Clarification. | POST 19 |

> **★ Reconciliation note:** a0f0bf04 §5 described the rework as "(1) lobbies
> drive POINTS, (2) ideology-COMPOSITION (≥50%/≤20%) drives enthusiasm." The
> **primary changelog POST 19 does NOT contain the ideology-composition (50%/20%)
> mechanic** — POST 19's shipped 2.3 rule is **lobby/interest-want-driven** with
> the 20/10/5% rolls above. The ideology-composition idea was a SEPARATE later
> proposal (a0f0bf04 POST 1-4, the discussion thread, dated 9/18 as a floated
> idea). **For the build: POST 19's 20/10/5% lobby-want model is the version Ted
> actually wrote to the rules doc in this pass.** Treat the 50%/20%
> ideology-composition rework as a LATER/parallel proposal whose final status is
> uncertain (not in this changelog export). This is a meaningful shipped-vs-
> proposed distinction the consolidation pass should flag.

### §1i. 2.4 Death / Retirement / Events / Pres Implementation (POST 20-24, 26, 28) ★★ FULL CHARTS

#### 2.4 office-vacancy + retirement framework (POST 20)

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.4 #1 ★ | Dead **party leader** replaced by the faction leader with highest PV. | **Dead party leader prompts a NEW Party Leader ELECTION.** | More dynamic. ★ pins party-leader-death → election. | POST 20 |
| 2.4 #2-4 ★ | (partial) | Explicit replacement rules: dead **Congressional officer** → re-elected normally; dead **committee chair/ranking** → re-appointed normally; **ranking members added to the vacancy-fill hierarchy** (filled immediately after open Chairs). | Complete the vacancy hierarchy. ★ pins the dead-office fill order. | POST 20 |
| 2.4 #5 ★ | Factions could lose **"no more than five politicians."** | **Up to 5% of the faction's politicians** instead. | Scale with faction size. ★ = the Orange "5%-of-faction-max" rule, here as the written rule (corroborates cf82a7d3 #4). | POST 20 |
| 2.4 #6 ★ | (assumed) | **Check RETIREMENTS first; if you've rolled all eligible and haven't hit the 5% cap, THEN check deaths.** | Explicit ordering. ★ pins retire-before-death ordering + shared 5% cap. | POST 20 |
| 2.4 #7 ★ | Gen/Adm/Amb/Cabinet-level retired **immediately**. | They (and Generals/Admirals/Ambassadors/Cabinet-level) **announce retirement at end of current term (2 yrs), not immediately.** | Avoid extra confirmation loops mid-term (only in-office deaths trigger them, and those are rare). ★ pins end-of-term retirement for appointed/military posts. | POST 20 |
| 2.4 #8 ★ | President/VP couldn't age-retire. | **President + VP CAN randomly retire due to age** — but like Senators they stay in office and **simply don't run for re-election** (retire at end of present term). | Discussion-thread support. ★ pins Pres/VP age-retirement-as-no-reelection. | POST 20 |

#### 2.4 RETIREMENT CHART (POST 21) ★★ — era-keyed, exact numbers

> **+20% to the chance if the individual does NOT currently hold an elected or
> appointed office.** Era bands and ages:

| Era band | 60-65 | 66-70 | 71-75 | 76-80 | 81+ |
|---|---|---|---|---|---|
| **1772-1820** (Independence→Republicanism) | 20% | 25% | 30% | 40% | 80% |
| **1820-1868** (Democracy→Nationalism) | 15% | 20% | 25% | 35% | 75% |
| **1868-1916** (Gilded Age→Progressivism) | 10% | 15% | 20% | 30% | 70% |
| **1916-1972** (Normalcy→Nuclear Age) | 5% | 10% | 15% | 25% | 65% |
| **1972-2100** (Neocons→Distant Future) | 0% | 5% | 10% | 20% | 60% |

★ = gap **#130** — these are the **exact era-scaled retirement percentages** the build needs (a0f0bf04 only described the trend "near-0% young in modern, scaling to 80").

#### 2.4 DEATH CHART (POST 22) ★★ — era-keyed, exact numbers

> Rules atop the chart: **Do not roll death if 5% of the faction already
> retired. Hale = 0% death regardless of age** *(LATER amended — see POST 26/28
> below)*. **Roll Frail pols first, doubling their %; after Frail, roll eldest→
> youngest. Max ONE death per faction.**

| Era band | 25-40 | 41-60 | 61-80 | 81+ |
|---|---|---|---|---|
| **1772-1820** | 5% | 25% | 30% | 60% |
| **1820-1868** | 4% | 20% | 25% | 50% |
| **1868-1916** | 3% | 15% | 20% | 40% |
| **1916-1972** | 2% | 10% | 15% | 35% |
| **1972-2100** | 1% | 5% | 10% | 30% |

★ = gap **#130** — exact death percentages + roll order (Frail-first-doubled, then eldest→youngest, max 1/faction).

#### 2.4 Hale + ex-President death corrections (POST 22, 26, 28) ★

| Edit | Detail | POST |
|---|---|---|
| Initial | "Hale pols do NOT roll for death (0%); still roll for retirement normally." | POST 22 |
| Correction 1 ★ | **"Retired" Presidents roll on the death chart NO MATTER WHAT** — because retirement doesn't remove them from the game, they'd otherwise live to 100+. | POST 26 |
| Correction 2 ★ | **Exception added to "Hale can't die": "unless they are a retired former President."** (A Hale retired ex-Pres like a Carter would otherwise live forever.) | POST 28 |

> **★★ NOTE — primary source vs a0f0bf04 on Hale:** a0f0bf04's gap #130 (and §3)
> recorded the final rule as **"Hale = 1/2 (half) the chance of death."** The
> **PRIMARY changelog says Hale = 0% death** (POST 22), later carved with the
> retired-ex-Pres exception (POST 26/28) — it does **NOT** say "half." The
> "Hale = half death chance" wording in a0f0bf04 came from the *discussion*
> thread (a different proposal Matt/Ted kicked around). **There is a genuine
> shipped-vs-design fork here:** the **written changelog = Hale 0% death (except
> retired ex-Pres rolls normally)**; the discussion floated **Hale = half**.
> **The consolidation pass MUST reconcile this** — they are materially different
> (0% immortal-except-ex-Pres vs merely halved). Lean toward the **changelog
> (0%, ex-Pres exception)** as the written rule, but flag for the user.

#### 2.4 EraEvos + event-driven enthusiasm (POST 23) ★★ — exact formula

| # | Was | Became | Why | POST |
|---|---|---|---|---|
| 2.4 (evo) #1 ★ | (one-shot) | **Certain EraEvos, if ignored/unresolved, KEEP their % chance to re-fire in future EraEvos cycles** until resolved or their final era passes. (Needs an EraEvos-sheet flag for which events qualify.) | Persistent unresolved events. ★ NEW recurring-event rule — refines the era-event subsystem. | POST 23 |
| 2.4 (evo) #2 ★★ | (old enthusiasm calc) | **NEW event-enthusiasm formula:** per event (decision or not) — **for each +100 (round down) a faction nets, +10% chance its FL's ideology enthusiasm moves +1 toward the Pres's party; for each −100 (round up), +10% chance it moves −1 away. If ≥6 factions net positive → +1 party preference for the Pres's party; if ≥6 net negative → −1 party preference for the Pres's party.** | Tie enthusiasm to event point swings deterministically. ★★ pins the **exact event→enthusiasm conversion** (per-100 → 10%/step, 6-faction party-preference threshold). Build-relevant; not in a0f0bf04 with numbers. | POST 23 |

#### 2.4 finale — Presidential implementation & the blunder roll (POST 24) ★★ CANONICAL

> **★★ This is the AUTHORITATIVE wording of the 2-step Pres-implementation rule
> (a0f0bf04 gap #126 / cf82a7d3 §5a #3).** Ted explicitly reverses his earlier
> stance ("Unlike my previous discussions where I argued Presidents should use
> Command on implementation"):

| # | Rule | POST |
|---|---|---|
| #1 | **Presidents are NOT directly involved in implementation UNLESS their cabinet blunders.** | POST 24 |
| #2 ★ | **STEP 1 — Presidents roll for implementation using ADMIN, just like cabinet** (not Command). | POST 24 |
| #3 | If the President has **Efficient**, only they roll for implementation (if cabinet also has Efficient, Pres chooses who rolls). | POST 24 |
| #4 | **Delegator** Presidents: 50% chance their roll is replaced by a second roll from a random applicable cabinet member (cabinet member no longer needs to be an Egghead). | POST 24 |
| #5 | Pres **Crisis Manager** rule clarified — it applies to EVENTS that have **≥10% chance of improving the crisis meter** (old text wrongly referenced legislation/executive action). | POST 24 |
| #6 | Renamed all **"Crisis Admin" → "Crisis Manager"** (merging the three crisis traits into Crisis Manager). | POST 24 |
| #7 ★ | **The blunder-roll check (after a failed implementation) uses the President's COMMAND** (was Admin). | POST 24 |
| #8 ★★ | **STEP 2 (Blunder roll) — skip if blunder resolved in Step 1; skip entirely if Pres is Easily Overwhelmed. With relevant expertise: Cmd 5 = avoid blunder roll; Cmd 4 = 50% avoid; Cmd 3 = +1 to blunder roll; Cmd 2 = 50% chance +1; Cmd 1 = blunder roll normal. No relevant expertise OR no Command = −2 to blunder roll (unless someone in the implementation phase is Efficient). Incompetent Pres = −3 to blunder roll.** | POST 24 |

★ = gap **#126**. **This is the canonical table** (a0f0bf04 captured the same numbers from the discussion thread; here it is in the rules doc itself). Note: a "−N to the blunder roll" is BAD (worse outcome); a "+N" / "avoid" is GOOD. Net design: **Admin gates whether implementation succeeds; Command only gates the SEVERITY of a blunder when implementation fails.**

### §1j. 2.9.8 First Continental Congress (POST 25, 27) ★

> Ted skipped ahead here "as that's what Anthony needs next to complete a full
> 1772-1774 term." The CC-appointment rules had been **entirely missing from the
> doc** (lost); Ted restored them.

| # | Rule | POST |
|---|---|---|
| 2.9.8 #1 ★ | **THE FIRST CONTINENTAL CONGRESS (1772-1774 term):** delegates from each state chosen by **the faction with the most politicians from that state.** **Tie → each tied faction appoints an equal number** (e.g. 2 factions tie in PA → each appoints 2 of PA's 4); **uneven leftover delegates assigned randomly** among tied factions. **Delegate counts: big states = 4, small = 2, rest = 3.** For the Era of Independence: **big = PA, MD, MA, VA; small = DE, GA, NH, RI; medium = all others.** | POST 25 |
| (open Q) | Umbrella asks (POST 27, NOT Ted): do CC appointees need ≥1 Legislative? If so it should be specified. **No Ted answer in this export** → OPEN. | POST 27 |

★ = gap **#133** — the **exact delegate counts + the big/small state lists** for 1772 (a0f0bf04 had PA/MA/VA/MD=4, GA/RI/DE/NH=2, but **note primary source says big = PA/MD/MA/VA and small = DE/GA/NH/RI** — same sets, confirms). ★ Pins the tie-resolution (equal split + random leftover).

---

## §2. Cross-references to tracked gaps / bugs / debt

| Tracked item | This thread (primary source) | Effect |
|---|---|---|
| **#124 (cabinet→enthusiasm rework)** | POST 19 gives the **actual shipped numbers: 20% Cabinet / 10% Cabinet-Level / 5% Gen-Adm-Amb, one non-stacking roll per lobby want.** a0f0bf04 said "TBD." | **Pins #124's numbers.** BUT flag: the 50%/20% ideology-composition variant in a0f0bf04 is NOT in this written changelog — likely a separate/later proposal. |
| **#126 (Pres impl 2-step)** | POST 24 #1-8 = the **canonical rules-doc wording**: Step 1 Admin, Step 2 Command-scales-blunder (5-tier table), Easily-Overwhelmed skips, Incompetent −3. | **Confirms + is the source of truth for #126.** |
| **#127 (ideology shift/conversion rates)** | LW↔RW Pop = 25% (POST 14); disgruntled auto-flip = 33% (POST 14); same-party steal allows adjacent (POST 15); 1%-gain-can-party-flip NEW (POST 8/14). | **Pins #127 + adds the 1%-acquire-flip rule (NEW).** |
| **#129 (Kingmaker trait allowlist)** | POST 9 + **POST 31**: final no-transfer set INCLUDES **Kingmaker, Hale, Flip-Flopper** (Celebrity stays). | **SUPERSEDES a0f0bf04 #129** — basic Kingmaker + Hale do NOT transfer (a0f0bf04 said they do). |
| **#130 (retirement+death model)** | POST 21 (retirement chart) + POST 22 (death chart) = **the full era-keyed numeric tables**; POST 20 #5-7 (5% cap, retire-before-death, end-of-term appointed retirement); POST 26/28 (retired ex-Pres rolls death regardless; Hale 0% except retired ex-Pres). | **Pins #130's numbers.** **Hale = 0% (not "half") — conflicts w/ a0f0bf04; reconcile.** |
| **#133 (CC composition)** | POST 25 = exact delegate counts (4/3/2) + state lists + tie rule. | **Pins #133.** |
| **#135 (50/50 House = inverse Senate control)** | POST 18 #2 = the written rule. | **Confirms #135.** |
| **#136 (no Command from random-skill draft)** | POST 4/12 = the written rule (random skill, Command excluded). | **Confirms #136.** |
| **#137 (draftees enter at IRL party)** | POST 11 = removed cross-party draft entirely. | **Confirms #137.** |
| **#138 (3/3 random traits/alt-states)** | POST 13 = the compromise. | **Confirms #138.** |
| **#141 (FL trait-gain rates)** | **NOT in this export** — the 5%/3% FL-trait-gain rates a0f0bf04 cites (POST 79, discussion) aren't in this changelog chunk; this chunk's 2.2.3 (POST 18) only covers the Passive-block + relaxation ladder. | No change from a0f0bf04; rates remain per a0f0bf04. |
| **Mil-Prep meter level 4 (cf82a7d3 #7)** | **NOT in this export.** | No change. |
| **Relocation cap = 4 / amendments-not-SCOTUS-challengeable / CRA-not-repealable** | **NOT here** (POST 7: relocation untouched). Those live in cf82a7d3. | No change. |
| **Impeachment (#273), war model (DH-81), skill-gain (#274), appointments** | **Impeachment/war model NOT in this export.** Appointments: the cabinet-enthusiasm + Pres-implementation + Integrity-nominate rules above are the relevant appointment-adjacent edits, but the specific Integrity-can't-nominate-Controversial rule from a0f0bf04 (POST 277) is **NOT in this 31-post chunk** (it was a later changelog entry). Skill-gain: POST 4/5 random-skill-draft is the in-scope skill-gain edit. | Mostly out of scope for this chunk. |

---

## §3. Notable shipped-vs-designed flags from this primary source

- **The cabinet-enthusiasm version Ted WROTE (POST 19) = lobby-want-driven
  20/10/5% rolls**, NOT the ideology-composition (50%/20%) model that a0f0bf04
  framed as the rework. If the build implements one of these, it should be the
  POST 19 model unless a later changelog supersedes it. **Open question for the
  consolidation pass: did the ideology-composition variant ever get written to
  the doc?** (Not in this export.)
- **Hale death rule fork (0% vs half):** changelog says **0% death, except
  retired ex-Presidents roll normally** (POST 22/28); a0f0bf04 says **half**.
  These are materially different. Build should follow the changelog (0%/ex-Pres
  exception) and flag.
- **Kingmaker/Hale/Flip-Flopper do NOT transfer to protégés** (POST 31) —
  supersedes a0f0bf04's reading that basic Kingmaker + Hale transfer.
- **`Math.random` / determinism caveat:** these are tabletop-percentage rules
  (20%, 33%, 5%-of-faction). The build's seeded RNG (`src/rng.ts`) must drive all
  of them; the charts above are the probability inputs.
- **`cop` → `lawful` trait rename** (POST 26): if the codebase/dataset still
  references a "cop" trait anywhere, it should be `lawful`.
- **Several entries are pure clarifications** (2.1 #4, 2.1.7 #2, 2.4 #2-4) with no
  code impact — do NOT mistake these for behavior changes.

---

## §4. Open items left in THIS thread (no Ted ruling in this export)

1. **CC appointees: ≥1 Legislative required?** Umbrella asked (POST 27); no Ted answer here.
2. **Cabinet ideology-composition (50%/20%) model** — whether it ever superseded the POST 19 lobby-want model is not in this export.
3. **Hale: 0% vs half death** — the changelog says 0% (POST 22/28); reconcile against a0f0bf04's "half."
4. **The `[AB …]` programmer notes** (Geo Ideologies, highest-enthusiasm-ideology determination) were left in the doc pending Anthony's status (POST 7) — design intent exists but implementation detail was the programmer's.
5. **This 31-post export STOPS at 2.9.8.** The 2.5 (Lingering), 2.6 (legislation), 2.10 (cleanup), faithless-electors, party-rename, Universal Election Modifier, etc. that a0f0bf04 records were **later changelog entries not present here.** Their authoritative wording, if it exists, is in a later slice of topic 5720 not yet ingested.

---

## §5. Deltas vs current build (for the consolidation pass)

Concrete numbers/rules this PRIMARY source pins (★ = build-actionable; cite `4747b09f POST n`):

1. ★ **Cabinet→enthusiasm (gap #124) ACTUAL NUMBERS:** per lobby/interest, **0 wanted Cabinet posts → 20% chance −1 enth (away from Pres party); >1 → 20% chance +1; exactly 1 → no change. Cabinet-Level = 10%, Gen/Adm/Amb = 5%. One non-stacking roll per lobby, applied to all factions sharing the card.** (POST 19.) Supersedes a0f0bf04's "TBD." Build should implement THIS, not the 50%/20% composition model (which isn't in the changelog).
2. ★ **Pres implementation (gap #126) CANONICAL:** Step 1 = Admin roll (like cabinet); Step 2 (only on blunder) = Command-scaled blunder table — Cmd5 avoid / Cmd4 50% avoid / Cmd3 +1 / Cmd2 50% +1 / Cmd1 normal / no-Command-or-expertise −2 (unless Efficient on team) / Incompetent −3; Easily Overwhelmed skips Step 2. Delegator = 50% reroll via random cabinet member. (POST 24.)
3. ★ **Retirement chart (gap #130):** full 5-era × 5-age-band table (POST 21), **+20% if not holding office.**
4. ★ **Death chart (gap #130):** full 5-era × 4-age-band table (POST 22), **max 1 death/faction, Frail first (doubled) then eldest→youngest, skip if 5% already retired.**
5. ★ **Hale death = 0% EXCEPT retired ex-Presidents roll normally** (POST 22/28) — **CONFLICTS with a0f0bf04's "Hale = half"; reconcile, lean changelog.**
6. ★ **Retired ex-Presidents always roll the death chart** (POST 26); cabinet/Gen/Adm/Amb retire at END of term, not immediately (POST 20 #7); Pres/VP age-retirement = "won't seek re-election" (POST 20 #8).
7. ★ **5%-of-faction retirement cap, retirements checked BEFORE deaths under a shared 5% cap** (POST 20 #5-6) — the Orange rule, written.
8. ★ **Event→enthusiasm formula:** per ±100 net for a faction → 10%/step enth shift; ≥6 factions net + → +1 Pres-party preference (− symmetric). (POST 23.)
9. ★ **Ideology/conversion rates (gap #127):** LW↔RW Pop shift = 25% (POST 14); disgruntled auto party-flip = 33% (POST 14); **NEW 1% chance to GAIN "can party flip"** (4 conditions, POST 8/14); same-party steal allows **adjacent** ideology (POST 15); inter-party pliable steal still needs exact match (POST 8); failed opposition conversion can grant Purity (POST 8).
10. ★ **Kingmaker no-transfer set (gap #129) FINAL:** Frail, Lackey, Incoherent, Obscure, Two-Faced, Master Kingmaker, Carpetbagger, **Kingmaker, Hale, Flip-Flopper** (Celebrity DOES transfer). Supersedes a0f0bf04. (POST 9, 31.) Master KM+Leadership = **3** protégés; protégé gets flat **+1 Command** (removed the 20%/+2). (POST 9.)
11. ★ **Random-skill draft (#136):** random skill, **Command excluded** (POST 4/12). Cross-party draft REMOVED — pols enter at IRL party (#137, POST 11). **3 random traits + 3 alt-states per draft** (#138, POST 13). Rookie random-trait BLOCKLIST: Kingmaker/Military Leader/Two-Faced/Flip-Flopper/Decisive General/Master Kingmaker/Carpetbagger/Union Loyalist (POST 5). Random-pol generator starts **Era of Populism** (POST 5 #20).
12. ★ **Career-track backdating = 3 draft classes at game start** (not 5), no-track if already holding a job; single 10% roll for ONE ideology-paired interest; Moderates gain NO interests. (POST 6.)
13. ★ **2.2.3 FL:** Passive blocks FL at **100%** (except elected Pres); explicit FL-eligibility relaxation ladder. (POST 18.)
14. ★ **50/50 House → majority goes to party NOT controlling the Senate** (#135, POST 18). **CC President 2-term (4-yr) cap** (POST 17).
15. ★ **First Continental Congress (#133):** big states (PA/MD/MA/VA)=4, small (DE/GA/NH/RI)=2, rest=3; faction-with-most-pols-in-state picks; tie → equal split + random leftover. (POST 25.)
16. ★ **Economy:** plantation→Agriculture **2:1** on plantation-economy elimination (usually ACW). (POST 2.) — NEW, not previously logged.
17. ★ **CPU draft/shift determinism:** out-of-ideology draft = 25% (POST 5 #18); "if instruction impossible, take highest PV" (POST 5 #15); CPU always (100%) attempts a 1-step ideology shift toward state/PL match (POST 7 #2); 60/40 chart rolled once per available move, career-track prioritized (POST 29-30); dead CPU Kingmaker shifts itself toward a protégé 100% if 1-step (POST 16).
18. ★ **`cop` trait renamed `lawful`** (POST 26) — check dataset/types for stragglers.
19. ★ **Isolationist faction-card eligibility widened** (POST 10); harmonious/disharmonious now considers the **draft target** too, "disharmonious wins" (POST 3 #5); failed-conversion→Purity extended (POST 8 #4).

**Reconciliation flags for consolidation (do NOT silently merge):** (a) cabinet
20/10/5% lobby-want model vs the 50%/20% ideology-composition variant; (b) Hale
0%-death-except-ex-Pres vs "half death"; (c) Kingmaker/Hale transfer (this
source: NO; a0f0bf04 #129: yes). In all three, **this primary changelog is the
written rules-doc text and should win**, with the user notified.
