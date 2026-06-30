# Digest — 70a67176 "Deep Dive Feedback: Executive Orders / Supreme Court Nomination–Confirmation"

**Type:** FOCUSED DESIGN-REVIEW thread (not a playthrough). **Lead:** @vcczar
(a.k.a. MrPotatoTed in-thread, the tier-1 designer) doing the **2.8 "Executive
Office / Executive Orders / Supreme Court nominations" deep dive** — the sequel
to the 2.3 appointments/confirmation deep dive (see digest `b9028796`). Goal:
finalize & lock the 2.8 ruleset. **Dated Sept 15–16, 2022.** 9 posts / 1 chunk,
all read. This is the **canonical design origin of the SC nomination/confirmation
mechanic** and its key unresolved design fork.

Era note: rules-doc thread, era-agnostic. The Supreme Court is era-keyed (exists
already in the 1856 scenario; absent at the 1772 start until created).

---

## A. Headline design decisions / debate

| # | Item | Detail | Disposition | Post |
|---|---|---|---|---|
| ★1 | **SC confirmation mirrors cabinet confirmation** | vcczar: 2.8 SC nominee handling will "mostly mirror cabinet confirmation processes." Whatever 2.3 settles for cabinet (committee→floor vote, auto-confirm gate, Top-Four-always-vote, etc.) carries to SC justices. | ACCEPTED (design baseline) | 3,5 |
| ★2 | **AUTO-CONFIRM vs ALWAYS-VOTE — the core fork** | vcczar floats **auto-confirming** an SC nominee *if enough factions vote against but the Majority Leader doesn't "block."* Players push back HARD for **always voting on each SC nominee**. UNRESOLVED in-thread. | OPEN (design fork) | 2,5–9 |
| ★3 | Always-vote arg (a) — **competitive selling point** | Rival political games are frequently *asked* for the ability to vote on SC justices "even if the court isn't in the game." Letting players vote on each nominee is a marketing differentiator → "push this game ahead of the pack, help it sell better." | PROPOSED (pro-vote) | 6 |
| ★4 | Always-vote arg (b) — **ideology-sneak risk** | Auto-confirm could **sneak extreme justices onto the court** (e.g. an RW-Pop faction with **3 Judicial** ramming nominees through) because the makeup "wasn't allowed to moderate by voting." Court has major game impact → an extreme court blocks e.g. desegregation. | PROPOSED (pro-vote) | 8,9 |
| ★5 | **Either/or with automated court DECISIONS** | Willthescout7: "I like the way we have the court DECISIONS automated now by ideology, but… that's an either/or with confirmation automation, not something you can have both of." I.e. if decisions are ideology-driven, confirmation MUST be a real vote (the vote is the only ideology check). | PROPOSED (key constraint) | 9 |
| ★6 | **Compromise-candidate requirement** (if auto-confirm is kept) | Auto-confirm should require a **"compromise" nominee** a majority would agree on (more moderate, high Judicial). Real precedent: Reagan's 2 blocked nominees → Rehnquist, overwhelmingly approved. | PROPOSED | 7 |
| ★7 | **Real playtest BUG — the auto-confirm replacement is just as unconfirmable** | In the live playtest, a nominee was voted down for being **extreme (RW), under 30, still in law school, J1**. The "auto-confirmed" replacement was **also under 30, also J1, this time extreme LW** — which the Senate "would likely vote down again for the same reasons." (Auto-confirm currently picks a second *equally bad* candidate.) | BUG / motivates ★6 | 7 |
| ★8 | **SC-nominee AGE-min / Judicial-rating gate** | Add an **age minimum of 30** (stop law students/undergrads). **Huge penalty under 40 (or 35).** Alternative = tie the floor to Judicial rating: **J5→30, J4→35, J3→40** (appoint w/o penalty); **J2 or J1→45+**. | PROPOSED | 7 |
| ★9 | **Veto / sign-laws RELOCATED out of 2.8** | "President signs laws / veto procedures" moves **to the legislative session** (out of the executive 2.8 phase). Rationale: "makes scoring so much easier." Both vcczar & MrPotatoTed agree. | ACCEPTED | 3,4 |
| 10 | Minority "leave it alone" view | One player: current confirmation system is "fine… not broken," happens less often than cabinet noms so "won't be as annoying" → don't change it. (Minority; the always-vote camp dominated.) | PROPOSED (dissent) | 5 |

**Net:** ★2 (auto-confirm vs always-vote) is left OPEN. The weight of argument
(★3–★5, ★8) and the live bug (★7) push toward **always-vote + nominee gates**;
auto-confirm survives only if it adds a compromise-candidate rule (★6).

---

## B. Built-vs-design (shipped reality — code-verified)

**There IS a 2.8 executive phase and a court-management step, but NOTHING in the
thread's design is implemented. No SC vote, no nominee gates, no compromise rule.**

| Topic | Shipped today | file:line | Design (this thread) | Delta |
|---|---|---|---|---|
| 2.8.1 Executive Orders | **50% coin-flip on 4 hardcoded EO strings** (Post Office / enforce law / pardon / trade treaty), tiny meter nudges | `phaseRunners.ts:3632` `runPhase_2_8_1_Executive` | Real executive-order system (out of scope of this thread; thread only finalizes the *court* piece + relocates veto) | EO system is a stub (separate gap) |
| **SC nomination / confirmation** | **NONE.** Justices are never nominated-by-faction and **never voted on**. Replacement happens only reactively in 2.8.2. | `phaseRunners.ts:3648` `runPhase_2_8_2_CourtMgmt` | Per-nominee process mirroring cabinet (committee→floor vote), with the auto-confirm-vs-always-vote decision pending | **Whole confirmation flow unbuilt** |
| Justice replacement logic | On retirement, **auto-picks highest-`judicial` (≥2), same party as President** → instantly "confirmed as Associate Justice." No vote, no opposition, no compromise. | `phaseRunners.ts:3661-3667` | Vote (or auto-confirm w/ compromise candidate); ideology must be checkable | Auto-pick ignores ideology-sneak risk (★4); no compromise pick (★6); reproduces the ★7 bug shape |
| **Age-min on appointee** | **NONE.** `age >= 75` only *triggers retirement*; no floor on new justices. A 20-yr-old could be seated. | `phaseRunners.ts:3655` (retire), `3661` (no age in candidate filter) | Age-min 30; penalty <40/35; or Judicial-keyed floor (J5→30 … J1→45+) | **Age/Judicial gate unbuilt** |
| **Judicial-rating gate** | Only floor is `judicial >= 2` in the auto-pick filter; J1 excluded from auto-pick but no penalty model, no Judicial↔age coupling | `phaseRunners.ts:3661` | J5→30 / J4→35 / J3→40 (no penalty); J2/J1→45+ | **Gate table unbuilt** |
| **Court DECISIONS automated by ideology** | **YES.** 50% coin-flip per phase; counts Conservative/Trad/RW-Pop vs Liberal/Prog/LW-Pop justices; greater side wins; ±0.1 partyPreference. Hardcoded 4-title list; **ignores `pendingCourtCases`**. | `phaseRunners.ts:3397` `runPhase_2_5_3_Court` (titles 3399-3404; ideology count 3407-3409) | The thread CONFIRMS this exists & treats it as the reason confirmation must be a real vote (★5). | Matches thread's premise; but it's a coin-flip stub on hardcoded strings, not real SC-case system |
| Cabinet confirmation (the "mirror") | **Auto-scored, no Senate vote.** Best-scored eligible pol is set into the seat and logged "confirmed"; no committee/floor vote, no opposition. | `phaseRunners.ts:2191-2198` `runPhase_2_3_1` | 2.3 deep dive (digest `b9028796`) specifies committee→floor vote + auto-confirm gate; SC is to mirror it | The mirror itself is unbuilt → SC inherits the gap (#66) |
| Court data model | `SupremeCourtCase { ruling?: 'majority'\|'minority' }`; `pendingCourtCases: SupremeCourtCase[]`; `supremeCourtIds[]` + `chiefJusticeId` | `types.ts:1548-1556`, `1584-1587` | A nomination/confirmation model would need nominee/vote/ideology fields the type lacks | No nominee/confirmation state on the model |

Court seats are populated only from scenario seed data (`scenario1856.ts:138-139`
seeds the 1856 Taney court; `scenario1772.ts:92-93` starts empty) — there is no
path to *grow* the court except the reactive 2.8.2 retire-and-replace.

---

## C. Gap-log mapping (for the consolidator)

**CORROBORATES / SHARPENS existing gaps:**
- **#66** (cabinet/SC confirmation = Committee/Floor vote vs auto-score) — **CORROBORATES and EXTENDS to SCOTUS.** Confirms SC confirmation is meant to *mirror* cabinet, and that cabinet confirmation ships as auto-score (`phaseRunners.ts:2191`) — so SC justices are likewise un-voted (`phaseRunners.ts:3648-3667`). Adds the **SC-specific ideology-sneak rationale** (★4) for why a real vote matters more for the court than for cabinet.
- **#270** (SC-case / court-decision system) — **CORROBORATES.** Thread confirms court DECISIONS are "automated now by ideology"; code = `runPhase_2_5_3_Court` coin-flip on 4 hardcoded strings, ignoring `pendingCourtCases`. Adds the **either/or constraint (★5)**: ideology-automated decisions REQUIRE a real confirmation vote (the two are coupled). Also corroborated by sibling digest `b9028796` (defeated-officer "= like SCOTUS, 2nd pick auto-confirmed" pattern, that digest's POST 22–24).
- **#20** (CPU decision-making) — **TOUCHES.** The auto-pick "highest judicial, same party" justice selection (`3661`) is CPU logic that produces the ★7 bug (an equally-extreme/under-age replacement); the compromise-candidate rule (★6) is a CPU-selection requirement.
- Any **judicial / SCOTUS gap** — corroborates that the court exists as a *scored object* but has no human-facing nomination/confirmation interaction.

**NEW (no clean gap-log home — recommend new rows):**
1. **N1 — Auto-confirm-vs-always-vote design DECISION (OPEN fork).** The unresolved question of whether SC nominees are always voted on or can be auto-confirmed. Record as a roadmap design-decision item with the pro-vote case (competitive selling point ★3; ideology-sneak ★4) and the **either/or-with-automated-decisions constraint ★5**. Not the same as #66's *mechanism* — this is the *should-a-vote-happen-at-all* policy for SCOTUS specifically.
2. **N2 — Compromise-candidate requirement for any auto-confirm.** If auto-confirm is kept, the auto-pick must be a moderate, high-Judicial nominee a majority would accept (★6) — directly fixes the live ★7 bug where the 2nd auto-pick was just as unconfirmable. (Generalizes the cabinet "SML recommends 5 most-qualified replacements" idea from `b9028796` to SCOTUS, but with a *moderation* constraint that is new.)
3. **N3 — SC-nominee age-minimum / Judicial-rating gate.** Age-min 30; big penalty <40 (or 35); OR tie to Judicial: **J5→30, J4→35, J3→40** (no penalty), **J2/J1→45+** (★8). Nothing like this ships — current filter only requires `judicial >= 2` with no age floor. NEW build requirement.
4. **N4 — Veto / sign-laws RELOCATION (2.8 → legislative session).** "President signs laws / veto procedures" moves out of the executive phase into the legislative session "to make scoring easier" (★9). Today neither a 2.8 nor a legislative veto/sign step is implemented as such — record as a placement decision + unbuilt feature. (Pairs with whatever the legislative-session digests specify.)

---

## D. Open questions for the human
- **The ★2 fork is undecided in this thread.** Was auto-confirm-vs-always-vote ever resolved in a later thread? The argument here leans heavily to **always-vote** (★3–★5 + the ★7 bug), and sibling digest `b9028796` shows the *cabinet* resolution was a hybrid (Top-Four always vote; others auto-confirm behind a ≥3-admin / ¬Controversial / ¬Iron-Fist gate). If SC "mirrors cabinet," does SCOTUS get that same hybrid gate, or — given ★5 — must EVERY justice be voted on? Needs a call.
- **★8 gate form:** flat age-min+penalty vs the Judicial-keyed table (J5→30 … J1→45+)? The table is more elegant and self-balancing; confirm which the designer wants.
- The thread's "MrPotatoTed" and "vcczar" appear to be the same lead author / final authority (consistent with `b9028796`); confirm if treating them as one designer voice is correct.
