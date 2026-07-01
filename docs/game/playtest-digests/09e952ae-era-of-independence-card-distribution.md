# Digest — "Cards for the Era of Independence" (topic 09e952ae)

- **Slug:** `09e952ae-cards-for-the-era-of-independence`
- **Source CSV:** `09e952ae-Cards_for_the_Era_of_Independence.csv`
- **Posts:** 1 (1 chunk, ~1.15k chars). Single designer post (Vcczar-voice — the
  spreadsheet author who owns the "Cards Held Tab").
- **Type:** **Authoritative card-distribution SPEC** for the 1772 Era of
  Independence playtest. Not a playthrough — no years are played; it states the
  starting card *inventory* the playtest will be seeded with.
- Cites `POST n` = `===== POST n =====` (only POST 1 exists).

> **Why this thread matters.** It is the designer's **exact 1772 starting card
> distribution** — how many factions hold each ideology / interest / lobby card
> when the Era of Independence begins. It also names a **"Cards Held Tab"**: a
> per-ERA model of *how many* of each card are in play (more cards in later eras;
> some cards "not yet possible" in 1772). This is the concrete 1772 instance of
> the **#4 per-(faction,era) ideology/card profile** and directly exercises the
> **card system** (ideology/interest/lobby cards). It also lands squarely on the
> **#293 gap** (the shipped 3-bucket `Faction.personality` cannot express this
> ideology-resolution). **Status: designer spec, authoritative for the playtest;
> the shipped 1772 factions do NOT match it (see Shipped-vs-designed).** Two big
> caveats up front: (a) the spec's *ideology* cards are named by the 7-point
> ideology (Conservative/Moderate/…), whereas shipped `IdeologyCardId`s are
> era-flavor names (Independence/Federalism/…); (b) the spec's interest/lobby
> names (Nationalist, Big Agriculture, LW/RW Media, …) mostly match the national
> **`INTEREST_GROUPS`** scoreboard, NOT the faction `interestCards`/`lobbyCards`
> taxonomy shipped for 1772. So this is a *different card vocabulary* than the
> build currently uses in this era.

---

## ★ Ideology-card distribution — 1772 (POST 1)

> "One faction can have more than one ideology card." — so these are **card
> counts across factions**, and a faction may hold several. Named by the 7-point
> ideology scale (`Ideology`, `types.ts:5-12`), NOT by era-flavor card IDs.

| Ideology card | # of factions holding it |
|---|---|
| **Conservative** | 3 |
| **Moderate** | 2 |
| **Traditionalist** | 2 |
| **Liberal** | 1 |
| **Progressive** | 1 |
| **Populist** ("LW Populist") | 1 |
| RW Populist | 0 (not present in 1772) |

Total ideology-card *holdings* = **10** (may be spread over fewer than 10
factions, since one faction can hold >1). Skew is center-right (Conservative +
Traditionalist = 5 of 10).

## ★ Interest-card distribution — 1772 (POST 1)

| Interest card | # of factions holding it |
|---|---|
| **Nationalist** | 2 |
| **Expansionist** | 1 |
| **Pacifist** | 1 |
| **Reformist** | 1 |

Total interest-card holdings = **5**. Only these four interest cards are "possible"
in 1772; the rest are gated to later eras (per the Cards Held Tab, below).

## ★ Lobby-card distribution — 1772 (POST 1)

| Lobby card | # of factions holding it |
|---|---|
| **Big Agriculture** | 2 |
| **Big Corporations** | 1 |
| **Law & Order** | 1 |
| **LW Media** | 1 |
| **RW Media** | 1 |
| **Military-Industrial** | 1 |
| **Free Trade** | 1 |
| **Protectionist** | 1 |

Total lobby-card holdings = **9**. Eight distinct lobby cards active in 1772.

## ★ "Cards Held Tab" — the per-ERA card-count model (POST 1)

The designer keeps a **"Cards Held Tab"** that stores, **per era**, "the number
of cards required for that era." Three explicit rules stated:

1. **Card counts are era-keyed.** Each era has its own required number of each
   card type. The three tables above are the **1772** row of that tab.
2. **"Later eras have more cards."** The pool grows over time — 1772 is the
   smallest inventory; antebellum/later eras add more card types and more copies.
3. **Some cards are "not yet possible in this era."** In 1772 whole card
   *types* are absent (e.g. only 4 interest cards exist; no RW-Populist ideology
   card). Card **availability is era-banded** — a card can only appear once its
   era unlocks it.
4. **Tie rule:** "There can be more if there is a tie at 1st." I.e. the stated
   count is a *baseline*; if factions tie for the 1st (top) holding of a card,
   the count can exceed the table value. (This implies the counts derive from a
   ranking/leaderboard of factions on each card — a mechanic not otherwise
   described here; **open question** on exactly how the ranking is computed.)

This is a genuine **model** the shipped code lacks: an era-keyed registry of
"how many of each card are in play." The nearest shipped analog is a *flat*
`ALIGNMENT_RULES.cardCapPerType: 4` per-faction soft cap (`types.ts:338`), which
is neither era-keyed nor a required-count — see Shipped-vs-designed.

## ★ Rule: one faction may hold more than one ideology card (POST 1)

Explicitly stated. The shipped model already permits this — `Faction.ideologyCards`
is `IdeologyCardId[]` (an array; `types.ts:1298`) and shipped 1772 factions do
carry 1–2 ideology cards each. So the *cardinality* rule matches; the *card
vocabulary* and *counts* do not (below).

## ★ Card-availability is era-banded (POST 1)

"Quite a few cards are not yet possible in this era." Card existence is a function
of era: 1772 exposes a small subset; later eras unlock more. This is the
availability half of the #4 per-(faction,era) profile — the card *set* itself is
era-scoped, on top of which factions get their per-era holdings.

---

## Shipped-vs-designed (verified against `src/` HEAD)

The build **does** have a three-type faction card system (ideology / interest /
lobby) and era-specific faction sets — but the shipped 1772 distribution does
**not** match this spec, and there is **no era-keyed "Cards Held" count model**.

- **★ Three card TYPES ship, held per-faction.** `Faction` carries
  `ideologyCards: IdeologyCardId[]`, `lobbyCards: LobbyCardId[]`,
  `interestCards: InterestCardId[]` (`types.ts:1298-1300`), plus a 3-bucket
  `personality: 'LW' | 'Center' | 'RW'` (`types.ts:1297`). Card IDs are closed
  unions: `IdeologyCardId` (`types.ts:322-327`), `InterestCardId`
  (`types.ts:310-314`), `LobbyCardId` (`types.ts:316-320`). So "3 card types,
  held by factions" is real — but the *names* differ from the spec (below).
- **★ Ideology-card VOCABULARY differs.** Spec names ideology cards by the
  7-point `Ideology` (Conservative/Moderate/Traditionalist/Liberal/Progressive/
  Populist). Shipped `IdeologyCardId` are **era-flavor** names — 1772 uses
  `Independence, Republicanism, Whiggery, Tradition, StatesRights, Reformism,
  Compromise, Federalism, StrongCenter` (`factions1772.ts:12-23`). These are
  bucketed to LW/Center/RW via `ALIGNMENT_RULES.ideologyCardBucket`
  (`types.ts:356-362`), NOT to the 7-point ideology. So no shipped 1772 faction
  holds a card literally named "Conservative"/"Moderate"/"Traditionalist".
- **★ Shipped 1772 ideology-card COUNTS ≠ spec.** Tallied from
  `factions1772.ts`: `Republicanism 3, Federalism 3, Independence 2, Tradition 2,
  Whiggery 1, StatesRights 1, Reformism 1, Compromise 1, StrongCenter 1` (10
  holdings over 10 factions). Spec wants `Conservative 3, Moderate 2,
  Traditionalist 2, Liberal 1, Progressive 1, Populist 1`. Even mapped through
  the LW/Center/RW buckets the shape does not line up with the 7-point spec.
- **★ Interest/lobby card names live mostly in `INTEREST_GROUPS`, not faction
  cards.** The spec's interest cards (Nationalist, Expansionist, Pacifist,
  Reformist) and lobby cards (Big Agriculture=`BigAg`, Big Corporations, Law &
  Order=`LawAndOrder`, LW Media=`LWMedia`, RW Media=`RWMedia`,
  Military-Industrial=`MilitaryIndustrial`, Free Trade=`FreeTrade`,
  Protectionist=`Protectionists`) match the **national `INTEREST_GROUPS`
  scoreboard** (`factions1856.ts:24-31`, a `Record<string, number>` national
  meter, all init 0 in both scenarios — `scenario1772.ts:36`,
  `scenario1856.ts:35`), **not** the faction `InterestCardId`/`LobbyCardId`
  taxonomy. Verified: `Nationalists, Pacifists, BigAg, LWMedia, RWMedia,
  Protectionists` are **absent from `types.ts` card-ID unions entirely** and
  appear only as `INTEREST_GROUPS`. So the spec's card vocabulary maps onto the
  national scoreboard names, which the shipped 1772 faction cards do not use.
- **★ Shipped 1772 faction interest/lobby cards use a DIFFERENT set.** Tallied:
  interest cards `Manufacturers 5, Settlers 3, Reformers 2, Planters 2`; lobby
  cards `Merchants 4, Patriots 2, Planters 2, SmallFarmers 1, Reformers 1,
  NationalUnity 1, Lawyers 1` (`factions1772.ts`). None of these is a spec card
  name; `Reformers`(interest) is the closest proxy for the spec's "Reformist".
- **★ NO era-keyed "Cards Held" count model.** Grep for
  `per.?era`/`byEra`/`eraCards`/`requiredCards`/`numCards`/`cardsFor` = 0. The
  only card-count knob is `ALIGNMENT_RULES.cardCapPerType: 4` (`types.ts:338`) —
  a **flat, non-era** soft cap on interest/lobby cards per faction
  (`phaseRunners.ts:1734,1791`; surfaced in UI at `FactionAlignments.tsx:258`),
  and it does **not** cap ideology cards. There is no store of "the number of
  each card required for era X", no tie-at-1st rule, and no ranking of factions
  per card.
- **★ Card availability is NOT era-banded in code.** Card sets are picked by
  which faction file a scenario loads (`FACTIONS_1772` vs `FACTIONS_1856`), but
  the card-ID unions themselves are **shared/global** (one `IdeologyCardId`,
  one `LobbyCardId`, one `InterestCardId` union across all eras) with no
  per-era "possible in this era" gate. Availability is implicit in the seed
  data, not a modeled era band.
- **★ 1772 faction set is inaugural-only, hand-authored.** `FACTIONS_1772` is 10
  bespoke factions, 5 per proto-party, each with an extra `eligibleIdeologies`
  field for the 1772 expansion-style draft (`factions1772.ts:6-24`; ids
  `fact_red_lw_1772` … `fact_blue_rw_1772`). These are the concrete objects the
  spec's distribution would have to be re-seeded onto.
- **`personality` is 3-bucket, can't express the spec's resolution (#293).** The
  spec's ideology distribution is stated on the 7-point scale; the shipped
  `Faction.personality` is only `LW | Center | RW` (`types.ts:1297`) and the
  alignment engine buckets everything to those three
  (`ALIGNMENT_RULES.ideologyCardBucket`, `personalityBuckets`, `types.ts:337`).
  The 7-point-by-faction card resolution this spec asks for cannot be represented
  by `personality` — this is the exact #293 gap, instantiated for 1772.

**Net for tech-lead:** the *shape* (3 card types held per faction, arrays,
one-faction-many-ideology-cards) already ships and is close to the spec's intent.
What does NOT ship: (1) the spec's **7-point-ideology card vocabulary** (shipped
uses era-flavor `IdeologyCardId`s bucketed to LW/Center/RW); (2) the spec's
interest/lobby **card names** (they exist only as the national `INTEREST_GROUPS`
scoreboard, not as faction cards, and several aren't card IDs at all); (3) the
**exact 1772 counts** (shipped `factions1772.ts` holdings don't match); (4) the
**era-keyed "Cards Held" required-count model** with the tie-at-1st rule (only a
flat `cardCapPerType: 4` exists); (5) **era-banded card availability** as a
modeled thing (card-ID unions are global). Reconciling these two vocabularies
(faction cards vs `INTEREST_GROUPS`) is a prerequisite before this distribution
can be seeded.

---

## Open questions (parking lot)

- **OQ1 — two card vocabularies.** Is the spec's card set meant to *replace* the
  shipped era-flavor `IdeologyCardId`s / faction lobby+interest cards, or is it a
  view over the national `INTEREST_GROUPS` scoreboard? The names align with
  `INTEREST_GROUPS`, not the faction card taxonomy — needs the designer to say
  which system the "Cards Held Tab" governs. (Likely they are the *same* intended
  system and the build has drifted into two.)
- **OQ2 — how is "held" determined / the tie-at-1st rule.** The tie rule implies
  cards are assigned by *ranking* factions (top holder = "1st"). What metric
  ranks a faction on a card, and how does a tie at 1st add copies? Not specified.
- **OQ3 — ideology-card counts on 7-point vs 3-bucket.** Does the app need to
  move `Faction.personality`/ideology cards to the full 7-point scale (#293) to
  seed this, or can the 7-point counts collapse into the LW/Center/RW buckets
  without loss? The spec (Liberal vs Progressive vs Populist all distinct)
  suggests the finer scale is required.
- **OQ4 — which specific 1772 factions hold which spec cards.** POST 1 gives
  *counts* only, not the faction↔card mapping. The per-faction assignment (needed
  to re-seed `factions1772.ts`) is not in this thread.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold. Conservative:
this SHARPENS #4; flags NEW only for the genuinely unowned "Cards Held" model.)*

- **HEADLINE → SHARPENS #4 (per-(faction,era) ideology/card profile).** This is
  the **authoritative 1772 instance** of #4: exact per-card counts across
  factions for ideology (Cons 3 / Mod 2 / Trad 2 / Lib 1 / Prog 1 / Pop 1),
  interest (Nationalist 2 / Expansionist 1 / Pacifist 1 / Reformist 1), and lobby
  (Big-Ag 2 / Big-Corp 1 / Law&Order 1 / LW-Media 1 / RW-Media 1 / Mil-Ind 1 /
  Free-Trade 1 / Protectionist 1). SHIPPED `factions1772.ts` holdings do NOT
  match (different vocabulary AND different counts). Attach these three tables to
  #4 as the 1772 target.
- **TOUCHES the card system (ideology/interest/lobby cards).** Confirms 3 card
  types ship as faction arrays (`types.ts:1298-1300`) — the *structure* matches
  the spec. The delta is vocabulary + counts, not the existence of the system.
- **CROSS-REF #293 (3-bucket `personality` vs the fuller card/ideology ladder).**
  This spec is the **concrete 1772 case** #293 warns about: it resolves ideology
  cards on the 7-point scale (Liberal ≠ Progressive ≠ Populist), which
  `Faction.personality: LW|Center|RW` (`types.ts:1297`) cannot represent. Reinforces
  #293 with a real distribution that needs the finer scale.
- **CONFLICT/VOCAB → the interest+lobby card NAMES map to `INTEREST_GROUPS`, not
  faction cards.** Spec's Nationalist/Pacifist/Big-Ag/LW-Media/RW-Media/
  Protectionist exist only as national `INTEREST_GROUPS` (`factions1856.ts:24-31`),
  several absent from the `InterestCardId`/`LobbyCardId` unions entirely. The
  shipped 1772 faction cards use a disjoint set (Merchants/Planters/Patriots/
  Manufacturers/…). Reconciling the two vocabularies is a prerequisite for #4.
  (Likely folds under #4 / card-system; flag for consolidation as a naming-drift
  item.)
- **NEW (consolidation to ID) — era-keyed "Cards Held" required-count model +
  tie-at-1st rule.** A per-era registry of *how many* of each card are in play,
  with counts growing by era and a "ties at 1st add copies" rule. No shipped
  analog beyond a flat `ALIGNMENT_RULES.cardCapPerType: 4` (`types.ts:338`, not
  era-keyed, ideology uncapped). This is a distinct model — likely a sub-item of
  #4 (the era axis of the per-(faction,era) profile); flag NEW only if #4 does
  not already own the "required count per era" concept.
- **NEW (consolidation to ID) — era-banded card AVAILABILITY as a modeled gate.**
  "Some cards not yet possible in this era; later eras have more." Shipped card-ID
  unions are global (no per-era availability gate); availability is only implicit
  in which faction file loads. Folds under #4's era axis; flag if unowned.
- **CORROBORATES cardinality rule already shipped.** "One faction can hold >1
  ideology card" — already true (`ideologyCards: IdeologyCardId[]`; 1772 factions
  hold 1–2 each). No delta; noted so consolidation doesn't over-scope.
