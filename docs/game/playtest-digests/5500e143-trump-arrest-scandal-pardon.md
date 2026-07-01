# Digest — How Best to Handle Trump's Arrest in AMPU

- **Slug:** `5500e143-how-best-to-handle-trumps-arrest-in-ampu`
- **Source:** `docs/game/sources/5500e143-how-best-to-handle-trumps-arrest-in-ampu/` (1 chunk, 4 posts, ~1.6k chars, Apr 4 2023)
- **Type:** arrest / scandal / pardon design discussion (feature-request thread, no playthrough)
- **Participants:** Imperator Taco Cat (proposer), MrPotatoTed (designer/"MrPotatoTed said")
- **Era relevance:** modern (present-day scenario, well past the shipped 1772/1856 eras); mechanics proposed are era-agnostic

> **Why it matters:** A tiny thread but a clean *design-bar* statement from the designer. It asks whether a former-president's arrest/indictment should be its own mechanic and — importantly — the designer sets the bar: it is only worth building if there is a **legal block against RUNNING** (a candidacy block), not merely a politician *choosing* not to run. Absent that, it collapses to "a random gains-Controversial event on a candidate who already has Controversial" — i.e., duplicative flavor. The thread also floats a **pardon** mechanic (president or governor lifting an office-lock) and a concrete **enthusiasm / party-preference / domestic-stability** effect model with an **acquitted-bonus / convicted-malus** next-election roll. The pardon action and the running-block appear to be **unbuilt** and possibly **unowned** in the gap log.

## ★ The arrest → office-lock-unless-pardoned proposal (POST 2)

Imperator Taco Cat's proposal, in order of preference:
1. **Reuse the Debs's-arrest handling** — "do it however we do Debs's arrest." (POST 2)
2. **If that's inapplicable**, a composite event:
   - an **election penalty**,
   - **force-set his state** (pin the politician's state),
   - **prevent appointment to an office UNLESS pardoned** — by the **president OR governor depending on the crime** (federal vs state),
   - optionally **expand this to ALL Controversial politicians** (generalize the office-lock to the trait, not just Trump).

This is a sibling to the shipped **Disgraced → office-prohibition** direction (see Delta list, #327): a trait/status that locks a politician out of *appointed* office, with a **release valve (pardon)** that #327 does not have.

## ★ The PARDON mechanic — president / governor (POST 2)

The key novel ask: an arrested/locked politician **cannot take an office until pardoned**, and the pardon authority is **role-dependent** — **president** for federal crimes, **governor** for state crimes. This is a *lifting* action on an office-lock.

**Shipped state: no such mechanic exists.** The only `pardon` token in the codebase is a flavor executive action, `'Pardon political prisoners.'` (`phaseRunners.ts:3639`), which merely nudges `game.partyPreference` ±0.2 and targets no politician — it does **not** lift any lock, does not target a specific pol, and is not governor-available. There is **no** politician-targeted pardon action for either president or governor. Flag as **NEW** (see Delta list) unless consolidation finds it already owned.

## ★ Legal-block-on-RUNNING vs. choosing-not-to-run (POST 3 — the designer's bar)

MrPotatoTed's gate for building this at all:

> "Unless it has a real impact on the election — by which I mean if there ends up being some kind of **legal block against him running (not just him choosing not to run)** — then I could see adding it in some way. Otherwise, it's just a random 'gains controversial' event applied to a candidate who already has controversial." (POST 3, repeated POST 4)

Two distinct capabilities are separated here:
- **Candidacy block** (barred from *running* / standing for election) — what the designer says would justify the feature.
- **Removal / retirement** (taken out of play) — what the engine *can* already do (`forceRetire`).

**Shipped state:** the engine has **removal** (`forceRetire` retires a pol, `phaseRunners.ts:2723-2728`) but **no candidacy block** — grep for `candidacyBlock|barred|ineligible|cannotRun|canRun` returns **zero** matches. There is no field/flag that lets a living, un-retired politician be prevented from *running* while remaining in play. This is the crux delta: the designer's bar is a *candidacy* block, which is a different mechanic from the removal the engine already executes.

## ★ The effect model — enthusiasm / party-pref / domestic-stability + acquitted/convicted roll (POST 4)

MrPotatoTed's concrete counter-proposal (the "if we do add it, here's how" version):
- **Raise RW / LW-populist enthusiasm** for the **party of the former president**;
- **a roll** for **moderate enthusiasm** going **the other way** (backlash);
- plus **party-preference** and **domestic-stability** effects;
- **a second roll** giving the former president a **bonus (if acquitted)** or **malus (if convicted)** in the **next election**.

**Shipped state — the *event-effect* half already fits the existing type.** `EraEventResponseEffect` (`types.ts:1448-1457`) already carries exactly these fields: `partyPreference?: number`, `enthusiasm?: { ideology: Ideology; party: PartyId; delta: number }[]`, and `domesticStability?: number`. So the enthusiasm-by-ideology-and-party + party-pref + domestic-stability portion is **expressible today** as an era/anytime-event response — no new type needed; it needs a *template* that emits it.

**Shipped state — the *acquitted-bonus / convicted-malus next-election modifier* does NOT exist.** There is **no per-politician election modifier** carried into the *next* election, and **no acquit/convict resolution** anywhere (grep `acquit|convict|nextElection|electionModifier` → zero). Election trait effects are static per-trait bands in `types.ts` (e.g. Controversial `presGeneral` = −MEDIUM, `types.ts:831`), not a one-shot per-pol modifier seeded by a prior event roll. Adding a stateful "next-election bonus/malus on this pol" is a new capability (relates to the election-scoring gaps #292/#189).

## ★ The Debs-arrest precedent (POST 2)

Proposal #1 was to reuse "however we do Debs's arrest" as the template.

**Shipped state: there is NO Debs event, and no Debs politician, in the build.** Grep `Debs|debs` across `src/` returns **zero** matches. The precedent the proposer wanted to reuse is not present in the shipped game (Debs is a modern/Progressive-era figure; the shipped eras are 1772/1856). So the "reuse Debs" path is a **dead reference** against HEAD — any arrest mechanic would be net-new, not a re-skin.

## Shipped-vs-designed (verified against `src/` HEAD)

| Element (proposed) | Shipped reality (verified) | Verdict |
|---|---|---|
| Reuse "Debs's arrest" handling | No `Debs` politician or event exists (`grep Debs` → 0) | **Absent** — dead reference |
| Prevent appointment to office UNLESS pardoned | No office-lock-with-pardon-release; sibling of Disgraced→office-prohibition (#327, itself a gap) | **Not built** |
| Pardon by president / governor (role-by-crime) | Only flavor `'Pardon political prisoners.'` exec action → ±0.2 `partyPreference`, targets no pol (`phaseRunners.ts:3639`); no governor path | **Not built** → likely NEW |
| Legal block against RUNNING (candidacy block) | Engine has removal (`forceRetire`, `phaseRunners.ts:2723`) but no candidacy block (`grep cannotRun/barred/ineligible` → 0) | **Not built** — the designer's bar |
| Force-set the politician's state | No arrest-driven state-pin observed | **Not built** |
| Election penalty on arrest | Static per-trait bands only (Controversial `presGeneral` −MEDIUM, `types.ts:831`); no event-seeded per-pol modifier | **Partial** (trait bands ≠ event penalty) |
| Enthusiasm(RW/LW ↑, moderate roll ↓) + party-pref + domestic-stability | `EraEventResponseEffect` already has `enthusiasm[]`, `partyPreference`, `domesticStability` (`types.ts:1448-1457`) | **Expressible** — needs a template, not a type |
| Acquitted-bonus / convicted-malus in next election | No acquit/convict resolution; no per-pol next-election modifier (`grep` → 0) | **Not built** |
| "gains Controversial" event | Exists: `Controversial` trait (`types.ts:103`); scandal/duel anytime events grant it (`anytimeEvents.ts:180,198`; `scandal-*` at `:240+`) | **Built** — hence designer's "just another gains-Controversial event" point |
| `forceRetire` executes but no template emits it | Confirmed: engine handles it (`phaseRunners.ts:2723-2728`); only occurrence in `src/data` is the type union `anytimeEvents.ts:28` — **no template emits it** | Matches QW49 (#140) |

## Delta list

Maps to **existing** gap IDs where possible; NEW items flagged for consolidation to assign the ID.

1. **#327 (Disgraced/scandal → office-prohibition, b57)** — the arrest → **office-lock-UNLESS-pardoned** is a **sibling of #327 with a release valve**. #327 locks out of appointed office; this thread adds a *pardon* to *lift* the lock and a crime-type (federal/state) split on who pardons. **Extends #327** with a release mechanic. (POST 2)
2. **#140 (scandal → removal / `forceRetire` / QW49)** — the "force set state / prevent office" family sits alongside #140's removal path. Re-confirmed at HEAD: `forceRetire` is executed by the engine but **no data template emits it** (only `anytimeEvents.ts:28` union decl). #140's removal is *retirement*, not a candidacy block — so #140 does **not** satisfy the designer's bar. (POST 2/3)
3. **NEW: PARDON mechanic (president / governor lifts an office-lock)** — no politician-targeted pardon exists (only flavor `partyPreference` nudge, `phaseRunners.ts:3639`). Grep the gap log for "pardon" — **likely unowned; flag NEW → consolidation to assign ID.** Crime-type routes the authority: president (federal) vs governor (state). (POST 2)
4. **NEW: legal block against RUNNING (candidacy block, distinct from removal)** — the designer's explicit bar for the whole feature. Engine has removal, **not** a candidacy block (`grep` → 0). A living pol cannot currently be barred-from-running while staying in play. **Likely NEW / distinct from #140's removal → consolidation to assign or map.** (POST 3/4)
5. **Relates to #292 / #189 (election scoring) — acquitted-bonus / convicted-malus NEXT-election modifier** — a **stateful per-politician one-shot election modifier** seeded by a prior arrest→acquit/convict roll. No such field/resolution today (trait bands are static). Cross-refs the election-scoring gaps. (POST 4)
6. **Effect-model portion is already expressible (no delta on the type):** enthusiasm-by-ideology-and-party ↑/↓ + `partyPreference` + `domesticStability` all exist on `EraEventResponseEffect` (`types.ts:1448-1457`). Delta is only a **missing template** that emits an arrest response, not a type change. (POST 4)
7. **Cross-ref #216 (Illicit/scandal traits) and the Menendez/Illicit b57 thread** — "expand to all Controversial politicians" (POST 2) is the same generalize-a-scandal-trait-into-a-mechanic pattern; the office-lock-on-a-trait idea should be reconciled with the Illicit/Disgraced trait family rather than added as a Trump one-off.
8. **Debs precedent is a dead reference** — no Debs entity/event at HEAD; the "reuse Debs" path cannot be honored and implies any arrest mechanic is net-new. No gap ID; noted so consolidation doesn't chase a nonexistent precedent.

### Open questions (for consolidation / human)
- Does the gap log already own a **pardon** action anywhere? (Grep suggests no in code; verify the log before assigning NEW.)
- Should the **candidacy block** be a general capability (usable by scandal/legal/eligibility rules broadly) or an arrest-specific flag? The designer frames it generally ("a legal block against running").
- Is a **modern/present-day scenario** even on the roadmap? All of this is moot for the shipped 1772/1856 eras; the mechanics are era-agnostic but the *arrest event* is modern-flavored.
