# Digest — "Should Some Gov Actions Be Scripted Events" (topic 1595)

- **Slug:** `a938ac91-ampu-should-some-gov-actions-be-scripted-events`
- **Source CSV:** `a938ac91-AMPU_Should_Some_Gov_Actions_Be_Scripted_Events.csv`
- **Posts:** 14 (1 chunk, ~8.1k chars). Opened by **@vcczar** (the designer).
- **Type:** **Design discussion, NOT a playthrough.** No years/eras are *played*; mechanics are *proposed*. All "Era of Nationalism / 1840 / 1856" references are simming context, not a chronicle.
- **Era framing:** the canonical example (Jim Crow, governor ideology) is Reconstruction/Gilded-Age → Progressive-Era America; see `docs/game/historical-context.md` for the antebellum→Jim-Crow arc. The mechanic itself is **era-agnostic** (any governor-instituted historically-common action).
- **Participants:** vcczar (designer), MrPotatoTed/"Ted" (CPU-AI maintainer), OrangeP47, Arkansas Progressive (+ broad @-tag roster in POST 2).
- **Date stamp in-thread:** Oct 24, 2022.

> **Why this thread is a keystone hit.** It is a direct design source for **content-engine item #258 (predicate-gated availability)** and **#221 (content registry)**. It proposes converting select **Gov Actions → Scripted Events** that fire "on time" regardless of AI/player initiative, and — critically — gives the **archetype for predicate-gated content**: the *Jim-Crow-on-installation-of-a-friendly-governor* pattern (POST 3–4). It also sketches a **trait/ideology/card/experience-driven CPU Gov-action rework** (POST 6–14). **Status: designer intent, NOT ratified, NOT built** (vcczar, POST 6: "a significant undertaking that I haven't had the time to really focus on yet. Open to others trying their hand at it!").

---

## 1. The core proposal — Gov Actions → Scripted Events, keep both (POST 1, 3, 7)

- vcczar (POST 1): *"Many of the Gov Actions really should be Scripted Events, which is what I initially wanted to do except until I realized we needed a ton of Gov Actions."* Original intent was scripted-events; he fell back to Gov Actions for breadth. **@MrPotatoTed** revived the idea (state legislatures would prompt changes).
- **Design decision (POST 1):** create Scripted Events **AND** *leave the Gov Actions in place* "in the event one wants to make the change early or wants to manually change from the Scripted change." → **Dual-track: scripted auto-fire as the default/backstop + manual Gov Action as early/override path.** This is the "guaranteed-fire-with-manual-override" shape #258 needs.
- Rationale (Arkansas Progressive, POST 3): historically-common governor actions (Jim Crow named) should fire via scripted events so that if AI/player "fail to properly introduce them 'on time' they would happen regardless." Explicitly scoped: *"It wouldn't apply to everything but… something I could see regarding significant things governors instituted."*

## 2. ★ The Jim Crow archetype — PREDICATE-GATED scripted event (POST 4, quoted POST 6)

OrangeP47's proposed event formation (POST 4) is the load-bearing artifact:

> *"if {state} has {gov - trad/rw pop} then {do Jim Crow}"* — **NOT forced on all states simultaneously.** *"make the event happen upon the installation of the governor 'friendly' to the idea being event'd… This would still allow* who *the governor is to matter, but it'd just make the things that need to be automatic… automatic."*

- **Trigger = installation of a governor matching an ideology predicate** (Traditionalist / RW-Populist), evaluated **per state**, not a global tick.
- This is exactly the **predicate-gated-availability** pattern of #258: a content node whose firing is gated by a serializable condition over game state (here: `{state}.governor.ideology ∈ {Trad, RW-Pop}`).
- **Design caveat (consensus):** automation must NOT erase agency — *"as long as who the governor is still matters"* (Ted, POST 7; echoed POST 4). The predicate gate is precisely what preserves that: a hostile governor never triggers it.
- OrangeP47 wants this handled **case-by-case, not blanket** (POST 4): refuses to vote yes/no — *"it depends… I'd rather 'fix' each action as it comes up as mentioned by testers, Jim Crow could be one."* → implication for #221/#258: content authored **per-action with its own predicate**, not a global Gov-Action→Event switch.

## 3. Alternative design — governor sign/veto with penalty (POST 5)

OrangeP47's second option (preserves agency differently): *"have the events, but have the current sitting gov have to sign/veto it (like a real gov), and if they veto there's a penalty."* → A scripted event can present as a **decision to the sitting governor**, with a **veto cost**. (Compare shipped `EraEvent.decider` field — currently `'president' | 'congress' | 'cabinet' | 'cc-president' | 'auto'`; a `'governor'` decider does not exist.) Not adopted; offered as a variant.

## 4. ★ CPU Gov-action AI rework — trait / ideology / card / experience driven (POST 6–14)

Distinct sub-thread (POST 8 disambiguates: *"I'm not so much talking about random events but rather how CPU governors decide which Gov action to take"*). Designer + Ted converge:

- **vcczar (POST 6):** *"I've wanted to really rework the CPU decision making for Gov actions… prioritize various actions depending on ideologies, cards, experiences. Also tie growing/shrinking certain industries to having relevant experience too."* → **CPU governors should pick Gov actions weighted by trait/ideology/lobby-card/experience, not at random.** Flagged a **significant undertaking, not yet done, open to contributors.**
- **Ted (POST 9):** can prototype by simming in 1840, admits *"gov actions is something we're a bit lazy on."* Offers a **flow chart of improvement** over 2–3 cycles.
- **Industry boost — current practice vs intended (POST 11–13):**
  - **Current (Ted, POST 11):** *"If an AI rolls to help the faction or party, and the faction/party has a card that is tied to an industry, we… count that as being able to improve that industry in that state."* Result: *"a lot of dems boosting agriculture/plantation (and even some maritime!)."* (Note: a *human-run-CPU* convention, may not be uniform across GMs.)
  - **Intended (vcczar, POST 12):** *"I ultimately want to tie it to Gov experience so only govs with say agriculture experience would boost Ag or plantation."* → **gate industry boost on the governor's relevant gov-experience, not merely card possession.**
  - **Proposed new Gov action (Ted, POST 13):** *"Have governors roll for random expertise so that they have the chance to improve industry?"* → an action that **rolls random expertise** to unlock industry-boost capability.
- **Reformist-card governors → term limits / 4-yr terms (POST 14):** in the live run, govs whose faction held the **Reformist** card initiated **term-limits / 4-year-terms**, and some passed that way. **Emergent obstacle:** factions never won the relevant office *while* holding the card, and when they finally won, **realignment had moved the card to someone else.** → real signal that **card↔office timing + realignment churn** can starve predicate-gated/card-gated content of its trigger window. Relevant to any card-conditioned content gate (#258).

---

## Shipped-vs-designed mapping (verified against `src/`)

| Concept in thread | Shipped today? | Where / note |
|---|---|---|
| Serializable **`Predicate` tree + `evalPredicate`** | **YES** — but **era-event-graph only** | `src/engine/eraGraph.ts` (interpreter), `src/types.ts:1487` (`Predicate` union). Gates 1772 Independence-era graph nodes (`eraEvents1772.ts`). |
| Predicate clauses available | year, eventCompleted/eventChose, meter, interest, diplomacy, war, stateAdmitted, officeControlledByPlayer, rosterHasSkill, flag (`types.ts:1487–1504`) | **No `governorOf(state)` / governor-ideology / governor-trait clause exists** — the Jim-Crow predicate (POST 4) is **not expressible** with the shipped union. |
| **Scripted Event** concept | Partial — `EraEvent` w/ `templateId` (`types.ts:1466`, comment "for scripted scenarios") tracked in `eraEventsCompleted` | Scripted *era* events exist; **per-state, governor-installation-triggered** scripted events do **not**. |
| **Gov Actions** (any governor-driven action system) | **NO** — grep `govAction`/`GovAction`/`governorAction` = **0 hits** | `src/pages/GovernorsPage.tsx` is a **read-only roster table** (state/region/governor/party/ideology/gov-skill). No actions, no CPU gov-action AI. |
| `EraEvent.decider` includes `'governor'` | **NO** — `'president'|'congress'|'cabinet'|'cc-president'|'auto'` (`types.ts:1473`) | Governor sign/veto-with-penalty design (POST 5) has no decider hook. |
| **Industry boost when faction holds a card tied to industry** | **YES** — `LOBBY_INDUSTRY` nudge | `phaseRunners.ts:1638–1656` (phase 2.1.8). +1/clamp ≤5, deduped per (state,key)/yr. **Gated on `faction.lobbyCards` + a living faction member residing in-state — NOT on governor identity/ideology/experience.** Matches "current practice" (POST 11), **not** the intended experience-gate (POST 12). |
| **Expertise / gov-experience → industry** plumbing | Partial data only | `LOBBY_EXPERTISE` (`types.ts:373`), `OFFICE_EXPERTISE`, `Expertise` type (`types.ts:182`). The map from *governor's* experience to *which industries that governor may boost* is **not wired**; boost ignores the governor. |
| **Reformist-card → term-limits Gov action** | **NO** | No term-limit/4-yr-term gov-action mechanic in code. Realignment moving cards (POST 14) is a known churn but no card-trigger-window guard for content. |
| **CPU governor Gov-action selection by trait/ideology/card/xp** | **NO** | No gov-action selector exists to weight. Entirely designed-intent. |

---

## ★ Deltas vs. current build (hand-off to tech-lead / roadmap)

1. **[#258 archetype] Predicate-gated scripted Gov Action — the Jim-Crow pattern.** Need scripted content that auto-fires **per state on installation of a governor matching an ideology predicate** (`{state}.gov.ideology ∈ {Trad, RW-Pop} → do Jim Crow`), NOT a global tick. **Requires a new `Predicate` clause for governor identity/ideology/trait** (shipped `Predicate` union has no governor clause); the existing `eraGraph.ts` `evalPredicate` interpreter is the reuse target. Whoever the governor is must still matter (predicate IS the agency-preserver).
2. **[#258/#221] Dual-track availability — auto scripted-event + manual Gov-Action override.** Each "significant" governor action exists in **both** forms: scripted (fires on time as backstop) and manual (player/AI can trigger early or override the scripted change). Authored **case-by-case per action**, not a blanket switch (OrangeP47, POST 4).
3. **[#258 variant] Optional `'governor'` decider with sign/veto + veto-penalty** on scripted events (POST 5). `EraEvent.decider` would need a `'governor'` member; veto cost is new.
4. **CPU Gov-action selection rework** — CPU governors choose Gov actions weighted by **trait / ideology / lobby-card / experience**, not random. **No gov-action system or selector exists to extend** — this is greenfield, explicitly "open to others" (vcczar, POST 6, 9).
5. **Gate industry-boost on the governor's relevant gov-experience.** Shipped nudge (`phaseRunners.ts:1638`) boosts an industry whenever the *faction* holds a tied card + has a resident member — **the governor is ignored.** Designed intent: only a governor with the matching expertise (e.g., Agriculture) may boost Ag/plantation (POST 12). Plumbing (`LOBBY_EXPERTISE`, `OFFICE_EXPERTISE`, `Expertise`) exists but isn't wired to the boost.
6. **New Gov action: "roll random expertise"** so a governor can earn the chance to improve an industry (POST 13).
7. **Card-trigger-window risk for predicate/card-gated content.** Realignment reshuffles lobby cards (e.g., Reformist → term-limits, POST 14), so a faction can lose the gating card before it ever holds the relevant office. Any card-conditioned content gate (#258) needs to account for this churn / timing or it starves.

**Headline:** a **predicate-gated scripted-Gov-Action design (Jim-Crow-on-friendly-governor) = the canonical archetype for #258**, paired with a **trait/ideology/card/experience-driven CPU Gov-action rework** — both **designer-intent, unbuilt**. The shipped build has the *predicate primitive* (era-events only, no governor clause) and a *card→industry nudge* (faction-gated, NOT governor-experience-gated); it has **no Gov-action system at all**.

## Open questions (for the human)
- Which Gov Actions warrant scripted-event duals? OrangeP47 insists case-by-case "as testers flag them" (POST 4) — is there a curated list, or is Jim Crow the only confirmed one so far?
- Should the governor predicate match on **ideology** (Trad/RW-Pop, as written POST 4) or on **traits**, or both? (POST 6/8 say "traits/ideologies" interchangeably.)
- Sign/veto-with-penalty (POST 5) vs. pure auto-fire-on-predicate (POST 4): are these alternatives or composable (predicate gates *availability*, governor then signs/vetoes)?
- For the experience-gate (POST 12): is "Agriculture experience" a governor `Expertise` tag, a gov-skill threshold, or prior office history? Plumbing exists for all three.

---
_File length: see `wc -l` below._
