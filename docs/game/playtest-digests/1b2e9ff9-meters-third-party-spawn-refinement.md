# 1b2e9ff9 — "Something I noticed with the Meters": third-party spawn refinement

- **Slug:** `1b2e9ff9-something-i-noticed-with-the-meters`
- **Source:** `1b2e9ff9-Something_I_noticed_with_the_Meters.csv` (4 posts, ~2.7k chars, Sep 2025)
- **Type:** third-party-spawn design critique + proposal (meter-model)
- **Batch:** b64
- **Participants:** OP (proposer), MrPotatoTed (designer, POST 2), theFreezerFlame (POST 3), a fourth voice (POST 4)

> **Why it matters:** This thread finds a real **false-positive** in the third-party spawn rule (b62 / #48): the MIDDLE of the party-lean meter is *supposed* to mean "dislikes both parties," but under the shipped rule a bloc that both parties **actively courted** can land in the middle and still trigger a third party — a courted group should never bolt. The thread proposes both a big fix (a 2-D per-party satisfaction model, **explicitly deferred to AMPU 2**) and a cheap near-term fix (an extra spawn-gate condition: the neutral bloc must *also* dislike both platforms / score below the average faction). This directly SHARPENS the #48 spawn-gate spec that b62 just laid down, and cross-refs the spoiler-vote-drain gap.

## ★ The flaw: a courted bloc in the middle still bolts (POST 1)

- Party-lean meter middle = **dissatisfaction with both parties** ("no lean towards either").
- But the shipped/designed rule fires a third-party challenge from a **neutral-ideology** bloc regardless of *why* it's neutral.
- Failure case (POST 1): both Red and Blue **make a point to court** a Cons bloc; by election it lands **exactly in the middle**; the rules then say a **Cons third party emerges** — which "doesn't really make sense" (a courted group has no reason to defect). The middle-from-consensus and middle-from-neglect cases are indistinguishable to the current gate.

## ★ Proposal: 2-D per-party satisfaction — DEFERRED TO AMPU 2 (POST 1 → POST 2)

- **OP's model (POST 1):** replace the 1-D party-lean with a **two-dimensional satisfaction rating** — a *separate* approval per faction for **Red** and for **Blue** (each on a ±3-style scale in the example).
  - A Cons third party makes sense only when Red **≈ −3 AND** Blue **≈ −3** (both actively disliked).
  - If both are **≈ +3**, the bloc **splits evenly** between the majors → **no third party needed**.
  - Bonus: the more negative *both* approvals, the **stronger** the resulting third party.
  - **Election advantage = the DIFFERENCE between the Red and Blue approvals** (replaces the 1-D lean as the vote-shift driver).
- **Designer counter (MrPotatoTed, POST 2):**
  1. **It hasn't happened in practice.** Triggering the bad case needs a **trifecta** — both parties courting the *same* ideology, that ideology landing dead-center, **and** overall party popularity also balanced in the middle. Usually one side "gets credit and the other isn't"; minority parties normally live off "the scraps" (ideologies the majority offended), because "keeping everyone happy is damned near impossible by design."
  2. **Cost is prohibitive now.** A 2-D rework "would likely necessitate readjusting **every single legislative proposal, event, and even significant sections of the rules**," and **@vcczar just isn't going to do that at this stage.**
  - Verdict: **"Something to keep in mind for AMPU 2."** → the 2-D model is **explicitly out of scope for AMPU 1**, not rejected on merit. Record as a deferred / AMPU-2 item, **not** a near-term build.

## ★ Cheaper refinement: gate the spawn on "dislikes both platforms" (POST 3 → POST 4)

Rather than the full 2-D rework, add **one extra condition** to the existing neutral-bloc spawn gate:

- **theFreezerFlame (POST 3):** an ideological group goes third-party **only if it loses points from BOTH platforms**. Requisite = **"in the middle segment PLUS dislikes both party platforms."** (Adds a "both-disliked" test on top of the neutral condition, distinguishing middle-from-neglect from middle-from-consensus.)
- **Relaxation (POST 4):** don't require an absolute point *loss* — instead require the bloc to **score LESS than the average faction**. This "would prevent a courted Ideology to run, without restricting the runs too much." (A softer, relative gate: courted-and-happy blocs sit at/above average and won't bolt; genuinely-neglected blocs sit below average and can.)

Net near-term ask: **AND** the existing neutral/middle trigger with a "**below-average satisfaction** (or dislikes-both-platforms)" condition, so courted blocs are excluded without a full model change.

## Shipped-vs-designed (verified against `src/` HEAD)

- **Spawn gate ~0% built.** Phase **2.9.3** is a hardcoded no-op that always logs `'No third-party challenge this cycle.'` (`src/engine/engine.ts:70`). No spawn logic exists — the only `2.9.3` / "third party" references in `src/` are that log line, the `PhaseId` union, and `PHASE_SEQUENCE`; `phaseRunners.ts` has **no** third-party code. So the b62 spec (#48) and this refinement are both refining an **unimplemented** gate; the refinement lands as a spec change, not a code change (yet).
- **2-party hard-wire.** `type PartyId = 'BLUE' | 'RED'` (`src/types.ts:3`); every faction/politician/candidate is keyed to exactly those two (see DH-55 cluster). A spawned third party has no representable identity today.
- **Meter dimensionality — the load-bearing nuance for the 2-D proposal:**
  - `game.partyPreference` (`src/types.ts:1570`) is **1-D**: a single national lean, clamped **±5**. This is the meter the OP wants to retire.
  - `game.enthusiasm` (`src/types.ts:1571`) is **already 2-D per (ideology, party)**: `interface Enthusiasm { [ideology]: { BLUE: number; RED: number } }`, each ±5 (`types.ts:1415-1418`). **The per-party approval data the OP's proposal wants already exists in the enthusiasm structure** — the missing pieces are (a) *using* it as the third-party spawn gate and (b) making the election advantage the BLUE−RED *difference* rather than the 1-D `partyPreference`.
- **Elections consume both meters; no third-party / spoiler term.** `calcStateVote` (`phaseRunners.ts:~3696-3709`) computes each major's score as `50 + baseLean*5 + partyPref*5 + enthusiasm[ideology][partyId]*2 + pv*0.1` (partyPref sign-flipped for BLUE). There is **no** third-party candidate and **no** vote-drain/spoiler subtraction anywhere in the vote math (cross-ref #228). So even if a spawn fired, nothing would drain votes from the majors.

## Delta list

Maps to **existing gap IDs** (consolidation owns final assignment; IDs referenced, not reassigned):

- **#48 — third-party spawn trigger (SHARPEN).** b62 (`5b162cf5`) set the gate = *party-preference NEUTRAL AND an ideology's enthusiasm NEUTRAL → third party from that neutral-ideology faction*. This thread shows that condition is a **false-positive source**: a bloc **both parties courted** can be neutral and would wrongly bolt. Sharpen the spec: **AND** the neutral/middle trigger with a **"dislikes both platforms" / "scores below the average faction"** condition (POST 3/4) so courted-but-centrist blocs are excluded. Still ~0% built (`engine.ts:70` no-op); this is a spec refinement to #48.
- **2-D per-party satisfaction model — DEFERRED to AMPU 2 (record as deferred; likely NEW deferred note, consolidation to assign).** OP's proposal replaces 1-D `partyPreference` with per-(faction, party) approval and makes election advantage = BLUE−RED difference. **Explicitly out of scope for AMPU 1** per designer (POST 2). Note the partial-existence hook: `enthusiasm` is already 2-D `{BLUE,RED}`-keyed (`types.ts:1415`), so an AMPU-2 build would extend/repurpose it, not start from scratch. Cross-ref the meter/enthusiasm cluster **#292 / #18 / #51 / #124** and the 2-party hard-wire **DH-55**.
- **#228 — spoiler vote-drain (CROSS-REF).** Even a correctly-gated spawn is inert until the election math has a third-party candidate that drains votes from the majors; `calcStateVote` currently has no such term. The stronger-third-party-with-worse-approvals idea (POST 1) also depends on this.

## Open questions

- **Gate scale for the near-term fix:** "below the average faction" (POST 4) — average over *all* factions' satisfaction, or only same-ideology-adjacent? And measured on `enthusiasm[ideology][party]`, on a combined score, or on a to-be-defined satisfaction meter? (Consolidation / design call.)
- **Which meter feeds the gate:** since `enthusiasm` is already 2-D per party but `partyPreference` is 1-D, does the near-term "dislikes both platforms" test read the two `enthusiasm[ideology].{BLUE,RED}` slots (data already exists) — making even the *cheap* refinement partly a rewire rather than a pure rule addition?
