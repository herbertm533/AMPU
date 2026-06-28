# Digest — 4c14847b "AMPU Question: How to handle the Jan 6th Insurrection"

**Type: COUP / INSURRECTION SUBSYSTEM — design-origin thread** (not a playthrough).
23 posts / 1 chunk, dated **Nov 6–7, 2022**. This is the **canonical design source for
the whole coup subsystem** — the `rule 3.0` coup rules. It predates `rep1800`'s in-game
enumeration of the coup end-conditions (gap **#88**, §C POST 7274), supplying the
*structural intent* behind it: the **two coup types**, their triggers, the **"Following
the Coup" consequence package**, and the **countercoup** ruling. Most of this is a
**rules-doc subsystem that is likely partly/wholly UNBUILT** in `src/` — flag for the
tech-lead to verify whether ANY coup / treason-trial / domestic-stability-threshold code
exists (see §6).

**Authority:** **vcczar** (Anthony, lead/ruleset owner) and **MrPotatoTed** (Ted, the
build) are tier-1; **Willthescout7** is the **co-author of the coup rules** (he holds the
rulebook and makes most of the structural calls here — POSTs 4, 8, 11, 12, 17). OrangeP47
tagged. The thread is mostly Will + vcczar converging on a final ruleset, with Ted
weighing in on domestic-stability framing (POST 5) and the Benedict-Arnold precedent.

---

## 1. The question being decided (POST 1)

vcczar OPENs by asking whether to **keep the rule-3.0 coup rules at all**: he included
them because *"the Western Hemisphere is rife with coup attempts,"* but they are
**complicated and rarely going to occur**, and he floats **replacing them with a single
Era-of-Populism scripted event** under certain conditions. He is **not set either way**.

**Decision reached:** **keep coups, but** (a) drop OR event-gate Standard Coups (they
keep them, event-gated — POST 11), (b) keep Populist Coups, and (c) **strengthen the
consequences dramatically** so a coup "really matters" (POST 2, 4). Will & vcczar also
want a **"Following the Coup" lasting-results section** added to the rulebook (added POST
12) and a **countercoup clarification** (added POST 17).

---

## 2. TWO COUP TYPES (the core taxonomy)

### A. Standard Coup — **event-triggered** (NOT a free choice)
- Launched by the **OPPOSITION leader** (against an "awful" President), as a **choice
  offered only when an event fires** (POSTs 4, 7–11).
- **Conditions:** opposition leader AND President have **certain traits**; **Domestic
  Stability in the WORST position**; **military prep < slightly prepared** (POST 8/9).
  The general "Attempted Coup" event was **HARDENED this thread** (POST 11) to require
  **Economy ≤ Great Recession AND Military ≤ Slightly Unprepared AND Domestic Stability ≤
  Violent Unrest**, AND the **opposing leader has Controversial or Leadership** to choose
  to launch.
- **★ Triggering events (POST 11, vcczar found these by keyword-searching "coup"):**
  1. An **Authoritarian Government is in place** + a **scripted event to overthrow the
     regime** fires → President can **resign or face the coup**.
  2. **"Newburgh Conspiracy is Real"** scripted event occurs.
  3. The **"Attempted Coup" general event** occurs (now hardened, above).
- **Designers leaned toward DROPPING Standard Coups** as historically implausible /
  never-advantageous-to-the-player (vcczar POST 4: *"drop Standard Coups"*; Will POST 10:
  *"I don't think the country has ever been in a position where a coup has been
  feasible"*). **Resolution: KEPT but explicitly event-gated** (POST 11/12) — *"It has to
  have a trigger or it will happen too frequently. The requirements without a trigger
  aren't that rare."* (POST 9.)

### B. Populist Coup — **a CHOICE of the incumbent President**
- A **choice of the incumbent President** (when they have **certain traits**), available
  when **Domestic Stability is worse-than-neutral** AND **military is worse-than-slightly-
  prepared** (POST 8/9). This is the **Jan-6 analogue**: an incumbent who **LOST
  re-election** launching a coup **to stay in power** (POST 4, 21).
- **Stays in the game** (POST 4) — but with the strengthened consequences (§3).
- **In every playtest so far, NO President had met the Populist requirements** (POST 10/16)
  — **except one near-miss:** President **Benedict Arnold** *could* have launched a
  Populist Coup after losing re-election; **@Cal chose not to** (POST 16, 18). Note: Arnold
  *became* Populist mid-game via Faction-Leader mechanics (he started Traditionalist) — POST
  18–20. So this path is **extremely rare in practice**.

---

## 3. ★ "FOLLOWING THE COUP" — the consequence package (POST 4; codified POST 12)

**Designed to be EXTREME / game-changing** (POST 4: *"purposely designed to be extreme,
so it could be watered down… if we are going to keep them then there needs to be lasting
change. Simply being President for another term then moving on isn't enough."*). Applies
when the **incumbent survives** the coup. The "Following the Coup" section is written to
apply to **both** Standard and Populist coups (POST 17).

1. **Install loyalists — rewrite congressional delegations.** The President **appoints the
   winner of EACH federal election that cycle** (House **and** Senate).
2. **Treason trials.** Every **opposition** member **not up for reelection** this cycle
   (i.e. **Senate, military, and Supreme Court**) faces a **treason trial**; **losers are
   removed from the game** and the **President appoints replacements** → the President gets
   a **supermajority in all branches**.
3. **+3 federal-election buff.** All **same-party** members get an **automatic +3 in all
   federal elections**; any **opposition** challenger who runs against them **and loses is
   removed from the game**. The buff lasts **as long as that President is in office OR a
   set number of years (~10)** — symbolizing the "new corrupt nature" of the game.
4. **Meter penalties.** Plus the rulebook's existing **domestic-stability penalty** and a
   **foreign-relations penalty** (POST 4).

Net design intent (POST 4): *"if you lose a coup roll you get wrecked. Standing against
that party becomes incredibly risky and punishing. … If you start a coup, then you better
be prepared to finish it because if you lose then you're out of power for a long time."*

---

## 4. ★ COUNTERCOUP — ruling: REINSTATE THE ACTUAL ELECTION WINNER (POST 13–23)

- In a **Populist Coup**, the **opposition leader launches a countercoup** (countercoup
  rules already existed but just said *"follow the standard coup rules,"* POST 14/15).
- **★ The ruling (POST 13, confirmed POST 22/23):** if the countercoup succeeds, the
  **ACTUAL WINNER of the Presidential election is reinstated as President — NOT the
  opposition leader** who launched the countercoup. That actual winner is **added to the
  treason / impeachment rolls** too (POST 13).
- **Worked example (POST 21, the canonical illustration):** 2020 Populist Coup → **Trump**
  launches a coup to stay in office despite losing → if he succeeds, the **Democratic party
  leader (Pelosi, treated as party leader over Biden)** launches the countercoup → if
  **Pelosi wins, BIDEN (the actual election winner) becomes President, not Pelosi.**
  vcczar/Will confirm: *"It should reinstall the president."* (POST 22/23.)
- Open authoring task left (POST 17): the "Following the Coup" section must **differentiate
  countercoup outcomes** (the reinstatement clause) since it otherwise reads identically for
  Standard and Populist.

---

## 5. TRIGGERS, ODDS & TURN-LOOP PLACEMENT

- **★ Tie coup likelihood to DOMESTIC STABILITY** (Ted, POST 5; vcczar, POST 6: *"The
  standard Coup is set to domestic stability (it has to be in the worst position) and
  populist just has to be worse than neutral."*). Ted's framing: the US is *"increasingly
  unstable… until a politician with a strong enough following can cause enough doubt to
  inspire things like Jan 6 with reckless commentary"* — i.e. a **high-following Controversial/
  Leadership leader** is what tips low DomStab into a coup.
- **★ CPU odds rise across eras but CAP LOW** (POST 4, 6): **~1–5% early-game → ~25% by the
  2020 election if conditions are met.** A **rare occurrence by design.** No civil-war path
  was added (POST 6: *"people will turn to keyboards"* — a deliberate choice NOT to model a
  modern civil war; cf. the 1856 Civil War which is its own arc).
- **★ Turn-loop placement (POST 8/9):** coups resolve **AFTER the Lingering phase, BEFORE
  Legislation** — *"so there is time to do a treason trial that same turn."* (Both vcczar &
  Will assume this; it is NOT yet spelled out in the rules.)
- vcczar may add a **recurring event** that lets **radical parties (or reactions to radical
  parties)** trigger coups more frequently (POST 9).

---

## 6. SHIPPED-vs-DESIGNED — flag for the tech-lead

This thread is **rules-doc design**; it asserts no shipped behavior. The standing KB record
(gap **#88**) says `EraEvent.triggersGameEnd` exists (`types.ts:1635`) but is **event-driven,
not meter-driven, and has NO coup path** in code. So **the coup subsystem described here is
very likely UNBUILT** — the tech-lead should verify whether ANY of the following exist in
`src/`:
- a **coup / countercoup** procedure of either type;
- a **treason-trial** mechanic (remove-from-game + appoint-replacement → supermajority);
- the **"install loyalists"** (President appoints federal-election winners) effect;
- the **+3-federal-election buff** + opposition-challenger-removal effect;
- a **Domestic-Stability / Military-Preparedness THRESHOLD** that gates a coup (the meters
  themselves ship — see DomStab/MilPrep references in #88/#92 — but the **coup-gate logic**
  almost certainly does not);
- the **turn-loop hook** between Lingering and Legislation (those phases live in
  `phaseRunners.ts`; whether a coup/treason step is wired between them is unverified).

**Recommendation:** if NO existing gap fully owns the coup PROCEDURE (as opposed to the
end-condition ROLL), the coup subsystem warrants its own consolidation row. Today **#88**
owns the coup *end-condition roll set* (the loss path); this thread adds the *survive-and-
consolidate* path + countercoup + treason trials, which #88 does not currently capture.

---

## 7. Relation to existing gaps

- **★ #88 (meter-driven game-over: coup/collapse end-conditions)** — THIS IS THE DESIGN
  ORIGIN. #88 already enumerates (from `rep1800` §C POST 7274) the **Standard Coup**
  (DomStab≤2 AND EconStab≤2 → 10%), **Attempted Coup** (EconStab≤2 AND MilPrep≤3 AND
  DomStab≤2 → 10%), and **Autocratic Coup** (HonestGov-floor). **This thread is where those
  rules were written/hardened (Nov 2022) and dates them**, AND it adds **three structural
  pieces #88 does NOT currently capture:** (1) the **Populist Coup as an incumbent-President
  CHOICE** (the Jan-6 analogue, distinct from the opposition-led Standard Coup); (2) the
  **"Following the Coup" consequence package** (install loyalists / treason trials → super-
  majority / +3 buff for ~10 yrs); (3) the **countercoup → reinstate-the-actual-winner**
  ruling. Recommend folding these into #88 (or a new coup-PROCEDURE row), not just the loss-
  roll. Also **corroborates #88's balance caveat** that coups are effectively rare/dead: in
  every playtest no President met the Populist bar (POST 10/16), Standard Coups are
  event-gated to be rare, and the CPU cap is ≤25%.
- **#221 (scripted-vs-flavor event taxonomy + event-triggered content)** — the **Standard
  Coup is event-triggered** (Authoritarian-overthrow scripted event, "Newburgh Conspiracy
  is Real," "Attempted Coup" general event). Confirms a coup is a **choice offered by a
  scripted/general event**, exactly #221's model (event payload → choice). The hardened
  Attempted-Coup event is a concrete instance of an event with a multi-meter precondition.
- **#258 (game-STATE predicate-gating field) / #92 (era-as-game-state-band)** — the coup
  triggers are **game-state-meter predicates** (DomStab worst/worse-than-neutral; MilPrep
  worse-than-slightly-prepared; Economy ≤ Great Recession), plus **trait predicates**
  (President & opposition leader Controversial/Leadership). These are exactly the
  `meterAtLeast/atMost` + trait predicate classes #258 calls for on content primitives —
  the coup events need that predicate field. Era-scaling of CPU odds (1–5% → 25%) is the
  era-band axis of #92.
- **DH-29..DH-35 (founding-cluster design holes, incl. "impeachment-broken")** — the
  **treason-trial** mechanic (remove-from-game + appoint replacement) is adjacent to the
  broken impeachment procedure; a treason trial is effectively a coup-driven impeachment/
  removal. Worth reconciling whether treason trials reuse impeachment plumbing.
- **#207 (no terminal game-over reached) / #188 ("big red button")** — the coup is one of
  the **dramatic end/loss conditions that exist as intent more than as a played-through built
  system**; reinforces the #88/#188/#207 pattern. (The only coup ever to FIRE in the corpus
  is the Autocratic Coup in `terror2000`, gated on HonestGov not the DomStab/MilPrep gates
  this thread hardens — consistent with #88's note that the MilPrep coup gates are the
  trivially-maxed / effectively-dead ones.)

---

## Candidate gaps for consolidation

- **EXTEND #88 — Coup PROCEDURE (not just the loss-roll): two distinct coup types.** #88
  today records only the coup *end-condition roll*. Add the structural taxonomy this thread
  defines: **(A) Standard Coup = opposition-leader choice, EVENT-TRIGGERED** (Authoritarian-
  overthrow scripted event / "Newburgh Conspiracy is Real" / hardened "Attempted Coup"
  general event; gated DomStab-worst + MilPrep<slightly-prepared + trait gate); **(B)
  Populist Coup = incumbent-President CHOICE** (the Jan-6 analogue; DomStab worse-than-
  neutral + MilPrep worse-than-slightly-prepared + President-trait gate; e.g. an incumbent
  who lost re-election launching to stay in power). *(Source: 4c14847b POST 4, 8, 9, 11.)*

- **EXTEND #88 — ★ "Following the Coup" consequence package (designed EXTREME).** On a
  surviving coup: **install loyalists** (President appoints winners of that cycle's House &
  Senate elections); **treason trials** for opposition not up for reelection (Senate /
  military / SCOTUS) → losers removed from game + replaced → **supermajority in all
  branches**; party gets **+3 in ALL federal elections** for the President's tenure (or
  ~10 yrs) with opposition challengers who lose **removed from the game**; plus a
  **domestic-stability penalty + foreign-relations penalty.** *(Source: 4c14847b POST 4, 12.)*

- **EXTEND #88 — Countercoup ruling: reinstate the ACTUAL election winner.** In a Populist
  Coup the opposition leader launches a countercoup; if it succeeds, the **actual winner of
  the Presidential election is reinstated as President (NOT the opposition leader who
  launched it)**, and that winner is added to the **treason/impeachment rolls**. Worked
  example: 2020 → Trump coup → Pelosi countercoup → **Biden** reinstated. *(Source:
  4c14847b POST 13, 21, 22, 23.)*

- **CANDIDATE NEW (if no existing gap owns it) — TREASON-TRIAL mechanic.** A coup-driven
  removal procedure: try opposition members not up for reelection (Senate/military/SCOTUS),
  **remove losers from the game**, **appoint replacements**, run **same-turn** (hence the
  Lingering→coup→Legislation ordering). Adjacent to the broken impeachment of DH-29..DH-35
  (verify whether it reuses impeachment plumbing). *(Source: 4c14847b POST 4, 8.)*

- **CANDIDATE NEW / FLAG — coup turn-loop hook + CPU coup-odds curve.** Coups resolve
  **after Lingering, before Legislation** (`phaseRunners.ts`), so a treason trial runs the
  same turn. **CPU coup odds rise across eras but cap LOW (~1–5% early → ~25% by 2020 if
  conditions met).** Coup likelihood is **tied to the Domestic Stability meter** (and
  MilPrep / Economy). Tech-lead to verify NONE of this is wired today. *(Source: 4c14847b
  POST 4, 5, 6, 8.)*

- **Corroborates #88** — dates/hardens the Standard/Attempted/Autocratic coup gates to **Nov
  2022**; confirms the balance reality that coups are **rare-to-dead** (no Populist-eligible
  President in any playtest; the one near-miss, Benedict Arnold, declined). *(POST 6, 10, 16.)*
- **Corroborates #221** — Standard Coup is a **scripted/general-event-triggered choice**
  (event payload → opt-in coup). *(POST 7, 9, 11.)*
- **Corroborates #258 / #92** — coup triggers are **game-state-meter + trait predicates**
  (DomStab/MilPrep/Economy thresholds; Controversial/Leadership), and CPU odds scale by
  **era band**. *(POST 4, 6, 8, 11.)*

## Open questions for the human

- **Is the coup subsystem worth building given its rarity?** vcczar (POST 4) and Will (POST
  10) repeatedly note coups will *almost never* fire (no Populist-eligible President in any
  playtest; Standard Coups are "historically implausible"). The OP (POST 1) explicitly
  floats **replacing the whole subsystem with a single Era-of-Populism scripted event**.
  Decide: full two-type coup subsystem vs. a lightweight scripted-event analogue.
- **Buff duration:** the +3 federal-election buff is *"as long as that President is in
  office OR a set number of years like 10."* Pick one (tenure vs fixed clock).
- **"Party leader" identification** for the countercoup (Pelosi-over-Biden, POST 21) — needs
  a defined rule for who the opposition's leader is when it differs from the President-elect.
- The **"Following the Coup" section needs to differentiate countercoup outcomes** in the
  rulebook (the reinstatement clause) — left as an open authoring TODO (POST 17).
