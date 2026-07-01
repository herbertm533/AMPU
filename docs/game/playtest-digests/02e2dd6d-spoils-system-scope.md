# Digest — "Spoils System" exec-order SCOPE (thread 02e2dd6d)

- **Slug:** `02e2dd6d-spoils-system`
- **Source CSV:** `02e2dd6d-Spoils_system.csv`
- **Posts:** 2 (1 chunk, ~0.6k chars). POST 1 = playtester question; POST 2 = ruling.
- **Type:** **spoils-system scope mechanics Q&A.** A rules clarification during a
  playtest, NOT a chronicle — no years/eras are played. President Jackson has just
  passed the **Spoils System executive order**; the question is how far its
  same-party rule reaches.
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** It pins down the **SCOPE of the Spoils System
> executive order** — an exec-order whose *content* is a live gap (#169, the
> exec-action stub has no real order library). The order's rule is a **half-term
> party-lock on the cabinet/ministers**, and this thread is the authoritative
> ruling that the lock **does NOT extend to the military or the Supreme Court**.
> Two durable game constitutional facts fall out: (1) **generals & admirals are
> NON-POLITICAL in-game** and never count toward opposite-party limits, and (2)
> **the President has NO power to remove a Justice** — justices leave only by
> **impeachment or resignation**. Both are the *designed* rule; the shipped build
> neither implements the spoils order nor the party-lock (see Shipped-vs-designed).

---

## ★ The Spoils System executive order — half-term cabinet/minister party-lock (POST 1)

- Passed by the President as an **executive order** (Jackson, in the playtest —
  the historical spoils-system fit).
- **Effect:** for the **next half-term**, **only same-party** politicians may sit
  in the **cabinet / serve as ministers** ("only Dems in cabinet or as ministers"
  — the President's own party). A *temporary* (one half-term) hard party-lock on
  executive appointments; the opposite-party appointment window is closed for the
  duration.
- Framed as a *standing effect with a duration*, not a one-off meter nudge — an
  exec-order that changes an appointment RULE for a bounded period.

## ★ SCOPE ruling — the lock is cabinet/ministers ONLY (POST 2)

The playtester asks whether the same-party lock also forces same-party in the
**military** and **Supreme Court** — i.e. does the President **fire and replace**
generals, admirals, and justices? Ruling:

- **★ Generals & Admirals — NO.** They are **considered non-political in-game and
  do NOT count toward the opposite-party limits.** The military is outside the
  spoils-system party rule; the President does not purge/replace officers to
  satisfy it. → **General constitutional fact: military officers are non-partisan
  for all party-composition purposes**, not just the spoils order.
- **★ Supreme Court — definitely NO.** The **President has NO authority to remove
  a Justice.** A Justice can only be removed by **impeachment or resignation**. The
  spoils order cannot touch the bench; there is no President-fires-Justice path at
  all. → **General constitutional fact: judicial tenure is immune to executive
  removal.**

Net: the Spoils System order's reach = **cabinet + ministers**, bounded to the
**next half-term**. Military and judiciary are explicitly out of scope.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-07-01)

**The Spoils System order is NOT built; the cabinet party-lock it imposes is NOT
built (the shipped cabinet rule runs the OPPOSITE way — a small cross-party
ALLOWANCE); the two scope-ruling facts (military non-political, Justice-immune)
ARE already true of the shipped model, but only implicitly / by omission.**

- **★ Spoils-system exec order = UNBUILT.** Grep `spoils|Spoils` across `src/` = **0
  hits**. The executive phase `runPhase_2_8_1_Executive`
  (`phaseRunners.ts:3632-3646`) is a **50%-fire, `pick`-one-of-4 hardcoded stub**
  (streamline Post Office / army-enforces-in-territories / pardon prisoners /
  trade treaty), each a one-tick meter or diplomacy nudge. There is **no
  spoils-system order, no order library, and no exec-order that installs a
  standing/duration effect.** → Confirms #169 (exec-action content is a stub).
- **★ Half-term cabinet party-lock = UNBUILT, and shipped default is the INVERSE.**
  `runPhase_2_3_1_Cabinet` (`phaseRunners.ts:2158-2224`) already leans same-party
  but by *penalty*, not lock: per seat it rolls `CABINET_CROSS_PARTY_RATE = 0.1`
  (`types.ts:1233`) — a **10% chance to ALLOW an opposite-party appointment** — and
  applies `CABINET_CROSS_PARTY_PENALTY = -3` (`types.ts:1234`) to cross-party
  candidates' scores. So the build's baseline is "usually same-party, occasionally
  cross-party," the *opposite* stance from a spoils hard-lock. The Spoils order, if
  built, would **force `crossPartyAllowed = false` (drop the 10% window) for a
  half-term.** No duration/standing-effect plumbing exists to hold that state.
- **★ "Ministers" ≈ cabinet seats.** The shipped cabinet is `game.cabinet:
  Partial<Record<OfficeType,string|null>>` (`types.ts:1580`), seats gated by era
  via `cabinetSeatsForYear` (`types.ts:1196`). No separate "minister" entity — the
  thread's "cabinet or as ministers" maps onto these cabinet seats. Confirm during
  build whether any non-cabinet appointee also counts.
- **★ Military officers are non-partisan in the shipped model (matches ruling).**
  `runPhase_2_3_2_Military` (`phaseRunners.ts:2246+`) appoints `GeneralInChief`
  purely on `skills.military >= 3` (highest military skill wins) and **never reads
  `partyId`.** Military appointment is a **separate phase (2.3.2)** from cabinet
  appointment (2.3.1) and is NOT subject to the cross-party gate. So generals are
  already effectively non-political — but by **omission**, not by an explicit
  `nonPolitical`/non-partisan flag (grep `nonPolitical|nonpartisan` = 0). The
  designed rule ("don't count toward opposite-party limits") holds today because
  no party limit is applied to the military at all. NOTE: there is no separate
  **Admiral/navy** appointment path in code — only `GeneralInChief` /
  `SecretaryOfWar`; the "admirals" half of the ruling has no built analog.
- **★ President cannot remove a Justice in the shipped model (matches ruling).**
  Justices leave ONLY via `runPhase_2_8_2_CourtMgmt` (`phaseRunners.ts:3648-3671`):
  age ≥ 75 → 15%/tick retire, then auto-replace with the highest-`judicial`
  same-party candidate (`≥ 2`). Plus death/retire via `vacateOffice`
  (`phaseRunners.ts:2454`, which pulls the id from `supremeCourtIds`). There is
  **no President-fires-Justice code path.** The order name in that phase ("Old
  justices may be pressured if president and chief are different parties") is only
  the retirement-nudge framing, NOT a removal. → Confirms "no executive removal of
  Justices."
- **★ Impeachment = UNBUILT (the ONLY designed removal path besides resignation).**
  Grep `impeach|Impeach` in `src/engine` = **0**. The ruling says a Justice can be
  removed by **impeachment or resignation**; resignation ≈ the age-retirement
  auto-path, but **impeachment as a removal mechanism does not exist in code** for
  justices (or anyone). So the designed judicial-removal rule is only half-shipped
  (resignation-analog yes, impeachment no). Cross-ref the impeachment gap (#112).

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold. Short thread — be
conservative.)*

- **→ #169 (exec-action content is a 4-action stub).** SHARPENS #169: names a
  specific missing order — the **Spoils System** — and specifies its effect
  precisely: a **half-term same-party lock on cabinet/ministers.** This is a
  standing/duration exec-order (not a one-tick meter nudge), which the stub
  (`phaseRunners.ts:3632-3646`) cannot express. 0% built.
- **→ cabinet party-composition rule (grep game-context "cabinet"/"cross-party").**
  SHARPENS: shipped rule is a **10% cross-party ALLOWANCE + −3 penalty**
  (`CABINET_CROSS_PARTY_RATE`/`_PENALTY`, `types.ts:1233-1234`); the Spoils order
  demands a **temporary hard party-lock** (force cross-party OFF for a half-term).
  The designed lock is the inverse of, and layered on top of, the shipped default.
  If no existing gap owns "cabinet cross-party composition," flag **NEW
  (consolidation to ID): spoils-driven half-term cabinet party-lock.**
- **→ #270 / #66 (SCOTUS).** SHARPENS the SC model with a **constitutional tenure
  rule: the President has NO authority to remove a Justice; removal is impeachment
  or resignation ONLY.** Shipped justices already can't be executive-removed
  (auto age-retire + replace, `phaseRunners.ts:3648-3671`); this ruling makes the
  rule explicit/intentional rather than incidental.
- **→ #112 (impeachment).** CROSS-REF: impeachment is one of the two designed
  Justice-removal paths and is **unbuilt** (grep `impeach` in `src/engine` = 0).
  Justice-resignation-analog ships (age-retire); Justice-impeachment does not.
- **→ military-non-political rule.** The ruling states **generals/admirals are
  non-political in-game and never count toward opposite-party limits.** Shipped
  military appointment (`phaseRunners.ts:2246+`) already ignores `partyId`, so this
  holds by omission — but there is **no explicit non-partisan flag** and **no
  Admiral/navy appointment path** at all (only `GeneralInChief`/`SecretaryOfWar`).
  If no existing gap owns "military-officer partisanship / non-political status,"
  flag **NEW (consolidation to ID): military officers are non-political (excluded
  from all party-composition limits).**
