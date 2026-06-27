# Digest — 38ecfaeb-ampu-playtest-draft ("AMPU Playtest Draft")

- **Type:** DRAFT-PROCESS record (multiplayer). GM = `vcczar`. 238 posts / 2 chunks, fully read.
- **Scope:** A single **founding-era (1772/1774) draft phase** run end-to-end on a Google Sheet. 12 factions: 5 human + 1 CPU (`MrPotatoTed`) per party (Blue/Red). Dates 7/5–8/11/2021.
- **Value:** The canonical record of the **standard within-party draft** — the baseline that #211's cross-party PV-snake is the *variant* of. Mostly corroborates existing gaps; one tail discussion (CC-President appointment adjudication) is a live GM⇒App rule change.
- **Citations:** `POST n` = `===== POST n =====` markers.

---

## The standard draft process (mechanics confirmed)

**Within-party constraint.** "Those of the Blue Party will only be able to draft Blue politicians. Those of the Red Party will only be able to draft Red politicians." (POST 1, 6, 86). Each party drafts from its **own color pool** on a shared "Draft" tab; a drafted pol moves under the drafter's named tab (POST 2, 86).

**Draft order = fixed per-party round-robin (NOT a snake, NOT PV-ranked).** A single ordering is set per party and **repeats each round** — it does **not** reverse between rounds:
- Blue: Rezi → themiddlepolitical → Rodja → WVProgressive → Hestia → MrPotatoTed(CPU) (POST 1)
- Red: jvikings1 → DakotaHale → SilentLiberty → Cal → ConservativeElector2 → MrPotatoTed(CPU) (POST 1)

Confirmed by the cyclic re-tagging throughout (e.g. POST 88→96→98→102→… returns to top of order each round). This is the key contrast with **#211** (`wilsons1916`), which used a cross-party **PV-summed snake**; here the order is a flat, GM-assigned per-party list. The two parties draft **in parallel / independently** (GM advances each color separately, e.g. POST 90 "@Rezi up for Blue; @jvikings1 up for Red").

**Two parties drafted UNEVEN counts.** Blue had ~10 picks/player, Red ~27.5/player (POST 196) — i.e. the **color pools are different sizes** (far more Red-coded founding pols), so per-player roster size differs by party. Draft runs **"until all politicians are drafted"** (POST 1); GM bulk-autodrafts the tail to close it (POST 181, 216–219).

**Turn cadence / timer.** 24h per pick; faster is encouraged (POST 6). Drafter must **tag the next picker** for their color (POST 6, 24). GM autodrafts after the timer (POST 72, 134 "23 hours… an hour before I autodraft"; POST 204, 206).

**State assignments / the Draft tab.** Each drafted pol carries a home state; players draft partly to **collect states** (POST 137 "throws me a bone in NC, giving me more states I have people from"). New players were pointed at the "Draft" tab to ask about states (POST 3). The skill→office primer (POST 3) is the standard eligibility table (command≥1 ⇒ president/exec actions; legis≥1 ⇒ US Senate/Rep; gov≥1 ⇒ governor; judicial≥1 ⇒ SC justice; military≥1 ⇒ general/admiral; admin≥1 ⇒ cabinet; expertise → committee/cabinet-type/policy bonus). Corroborates the shipped 0–5 skill model (CLAUDE.md).

---

## Preference-list automation (the #115/automation core, confirmed live)

- Players may **privately submit the GM a preference list** — names, OR "preferred skills, ideologies, etc." The GM "use[s] the list as if you were automating the draft." (POST 1).
- Exercised constantly: GM auto-drafts from a stored list when a player is AFK (POST 19, 39, 48–50, 62, 79, 82, 92, 105, 124, 140, 150). Lists are reusable until exhausted ("You need to make a new priority list. I think everyone has been drafted," POST 152).
- **Ad-hoc delegated autodraft** also allowed: a player can hand off a verbal heuristic instead of a list — e.g. "a high-rated character with business experience and few negative traits" (POST 73), or let *any* player roll for them (POST 132).
- Players opted into **full auto-draft for the remainder** once strategy was set (POST 158, 208 "im good to auto draft the rest of the way now").

**CPU autodraft rule (explicit):** the CPU pick = **roll a D10 → take the Nth-highest-ranked available pol** of that party ("if you roll an 8, give me the 8th highest ranking politician in that party," POST 132; in-use POST 14, 18, 29, 53, 76, 108, 147). This is a concrete, citable spec for the within-party CPU draft heuristic (PV-rank + small random offset).

---

## Founding-era rule recap (GM, POST 5) — corroborates #92 subsystem-gating

GM enumerated how the **Era of Independence** differs (drives what the draft is *for*):
- **No Kingmaker phase.**
- **Congressional Leadership → "Continental Delegation":** players bid per slot; big states (NY/PA/VA)=4 delegates, medium=3, small=2; delegates need **1 Legis**.
- **President of the Congress** needs **1 command**; acts like a Speaker (presides), but decides General & Scripted events (Congress must approve scripted responses) and appoints committees.
- **Voting: one vote per state** (4 NY delegates = same power as 2 DE delegates) (POST 5 §voting, also POST 5).
- **No US President / US Senate / US House elections** in-era; **Governor elections occur but Governor Actions don't** until Independence declared.
- **No Supreme Court; no diplomacy phase** (diplomacy via events); **military phase exists** (generals/admirals appointed).
- **Constitutional Convention triggers 1788** (can fire earlier, effective 1788); "game reverts to normal in 1788."

This is a clean restatement of the founding subsystem-gating already heavily logged under **#92** (corroborates `rookie1772`/`principle1772`).

---

## Era-gated draft pool (corroborates #24/#92/#4) + GM hand-adjudications (GM⇒App)

- **Pool is era/birth-gated:** David Crockett is **undraftable** — "It's 12 years before his birth right now" (POST 177–178). Confirms the draft pool is restricted to pols already "born/active" at the in-game date — the `draftYear` / era-availability behavior (pairs with #92 territory/era content-gating and the dataset `draftYear=birthYear+25` rule).
- **Double-draft collisions** (a stale Draft tab let two players pick the same pol) were hand-resolved "already taken, pick again" (POST 101–102, 123–124, 125). A **build requirement**: the engine must lock a pol the instant it's drafted (no stale-pool race) — corroborates the need for transactional draft state, not a fix-it-later sheet.
- **Faction-stat readouts mid-draft** (POST 116, 119): GM printed each faction's strongest ability / dominant ideology / top interest — i.e. the running tally that feeds card distribution.
- **Draft → Faction-Personality card pipeline (corroborates #24):** at draft close GM tallied per-faction **ideology + interest/lobby leads** (Progressive/Populist/Liberal/Conservative/Traditionalist/Moderate/Expansionist/Nationalist + Big Ag/Big Corp/Military-Industrial/Trade/Reformist/Law&Order…) and stated "**Some of this will translate into cards, but it will depend on the Red Party Draft**" (POST 218) — directly confirms #24 rule (a faction's cards derive from the ideologies/interests **most-represented among its drafted pols**, cross-party-relative). Also confirms the RW-Pop / LW-Pop split and an ideology-count automation on the sheet (POST 98, 104).

---

## Tail design discussion — CC-President appointment adjudication (live GM⇒App rule change)

POST 230–238 (`MrPotatoTed` ↔ `vcczar`): how should appointments (e.g. C-in-C of the Continental Army) be decided in the CC era? GM rejected "CPU just picks highest-value eligible" because the **CC President is a presiding role, not executive** (historically Adams *nominated* Washington; Hancock *called the vote*; delegates approved). Settled rule: **the chair of the relevant committee (e.g. Foreign/Military) nominates → delegates vote → CC President breaks ties** ("Ok, I'll make that change to the rules," POST 237–238). This is a **founding-era appointment mechanic** that pairs with the existing `continentalCongress.ts` system — a candidate refinement, not in the current draft scope but a concrete rule the build's CC appointments should follow.

---

## Candidate gaps for consolidation (mostly corroborating)

1. **CORROBORATES #211** — this thread IS the *standard within-party draft* that #211's cross-party PV-snake is the variant of. Sharpen #211's "build today" note: the shipped/baseline draft is a **fixed per-party round-robin** (not a snake, not PV-ordered), parties drafting independent same-color pools. (POST 1, 6, 86, 90, 196)
2. **CORROBORATES #115 (automation) + sharpens the CPU heuristic** — concrete, citable specs: (a) **preference-list autodraft** = GM drafts as-if-you from a names/skills/ideology list (POST 1, in-use throughout); (b) **CPU autodraft = D10 → Nth-highest-PV-ranked available pol of that party** (POST 132, used POST 14/18/29/53/76/108/147). Good source for the within-party draft-automation spec. (Distinct from the #115 *generate-a-candidate* backfill — this is automation of *picking*, not *creating*.)
3. **CORROBORATES #24** — draft→Faction-Personality card pipeline confirmed live: faction cards derive from most-represented ideologies/interests among drafted pols, **cross-party-relative** ("depends on the Red Party Draft," POST 218); running tallies POST 116/119.
4. **CORROBORATES #92 / #4** — founding-era subsystem-gating restated by GM (POST 5: no Kingmaker/SCOTUS/diplomacy/US-office elections in Independence; Continental Delegation; one-vote-per-state; ConCon@1788); draft pool **birth/era-gated** (Crockett undraftable, POST 177–178).
5. **(possible refinement, NOT clearly new) — transactional draft locking:** repeated double-draft collisions from a stale shared "Draft" tab (POST 101–102, 123–125) document that the build must atomically remove a pol from the pool on draft. Likely already implicit in `runPhase_2_1_1_Draft`; flag for tech-lead, do not necessarily open a new gap.
6. **(possible new, low-priority, founding-era appointment rule)** — CC-President appointment adjudication settled live: **committee chair nominates → delegates vote → CC Pres breaks tie** (POST 230–238). Pairs with `continentalCongress.ts`; candidate for a small CC-appointment row if not already covered by the federalism/CC cluster. Consolidation owner to judge novelty vs. existing CC gaps.

**NEW vs corroborating:** ~5 corroborations (#211, #115, #24, #92, #4) + at most 1 candidate-new (CC-President appointment rule, #6) + 1 build-note refinement (#5). Expected for a process thread — no manufactured gaps.
