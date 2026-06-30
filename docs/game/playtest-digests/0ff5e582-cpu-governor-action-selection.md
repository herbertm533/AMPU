# Digest — "How should CPU choose Governor Actions?" (topic 1430)

- **Slug:** `0ff5e582-how-should-cpu-choose-governor-actions`
- **Source CSV:** `0ff5e582-How_should_CPU_choose_Governor_Actions.csv`
- **Posts:** 5 (1 chunk, ~3.6k chars). Opened by **@MrPotatoTed** ("Ted", the
  CPU-faction/AI maintainer).
- **Date stamp in-thread:** Aug 3–4, 2022.
- **Type:** **Design discussion, NOT a playthrough.** No years/eras are *played*;
  this is a call-for-ideas to *improve* how the CPU picks Gov Actions. References
  (1840s Dems, "Era of Nationalism") are simming anecdotes, not a chronicle.
- **Participants:** MrPotatoTed (opener, will "draft them into the rules for
  Vcczar's consideration" — POST 1), OrangeP47 (the "industry-expansion = help"
  interpretation, POST 2/3). POST 5 is an unsigned bullet sketch of a multi-bucket
  selection structure (continuation, likely Ted/OrangeP47).
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** It is the **concrete CPU Governor-Action
> SELECTION heuristic** — the deep spec behind the **#20 gov-action overhaul**
> (the b53 *governor-trait-gated + industry↔expertise* gov-action work). Where
> the sibling thread `a938ac91` ("Should some Gov Actions be Scripted Events",
> Oct 2022) argues the *delivery* mechanism (scripted-event auto-fire vs manual
> action) and sketches the trait/ideology rework at a high level, THIS thread
> (2 months earlier) gives the **actual percentage ruleset**: it states the
> CURRENT 25/25/50 CPU rule, names its flaws, and proposes a multi-bucket
> replacement (trait-gated, expertise-as-guide, industry-as-help, election-law,
> special-passion). **Status: human-table ("spreadsheet") rule + proposed
> improvement; NOT designer (vcczar)-ratified, NOT built.** The current rule is
> how players run the CPU faction by hand at the table — it is NOT the app's
> behavior (see Shipped-vs-designed).

---

## ★ CURRENT CPU Gov-Action rule (the baseline to replace) — POST 1

The rule players use today to drive a CPU governor's action choice:

| Bucket | Chance | What the CPU does |
|---|---|---|
| **Ideology card** | **~25%** | something that helps the faction's **ideology card** |
| **Crisis** | **~25%** | something that helps a **crisis** |
| **"Help the party overall"** | **~50%** | a catch-all "helps their party overall" action |

**Named flaws (POST 1):**
1. **Many eras/situations have NO ideology-card option** — the 25% ideology
   bucket dead-ends with nothing to do.
2. **"Help the party overall" is too poorly defined to be a CPU action** — the
   dominant 50% bucket has no operational meaning; the human running the CPU has
   to improvise (which is *why* the thread exists).
3. **Traits don't matter** — Ted wants "traits to play a bigger part" (POST 1).

> NOTE this is the **table/spreadsheet rule for the human running a CPU faction**,
> not the app's logic. The shipped app does something entirely different and
> simpler (a flat skill nudge — see Shipped-vs-designed). So the 25/25/50 rule
> is itself a DESIGN datum that the app has never implemented.

## ★ PROPOSED replacement — a multi-bucket % selection structure (POST 1, 2, 5)

A weighted set of buckets; roll a bucket, then (where noted) a sub-roll for the
specific action. Synthesized from POST 1 (traits), POST 2/3 (industry-as-help),
POST 5 (the explicit bucket list):

1. **% Improve a state industry** — *second roll* to pick WHICH industry if the
   governor's state has more than one (POST 5).
2. **% Ideology card + lobby cards + crisis benefits** — "as we have now"
   (POST 5) — i.e. the *survivable* part of the current rule, folded into one
   bucket instead of two.
3. **% Tinker with election laws** — gerrymander, term limits, etc., **gated on
   qualifications being met** (example: ≥1 same-party Senator) (POST 5). "Could
   be a subset of one above."
4. **% Special passion** — e.g. **Civil Rights** or **Theocrat**: roll a chance
   the governor uses that passion to guide the action (POST 5).
5. **(cross-cutting) Trait-gated overrides** (POST 1) and
   **(cross-cutting) Expertise-as-guide** (POST 5) — see below; these *select
   within* buckets (mainly election-law and improve-industry).

### ★ Trait-gated Gov-Actions (POST 1) — the headline b53 ask, concretized

> "governors with **integrity** have a 50% chance of trying to institute firmer
> **term limits**. Governors with **controversial/manipulative** have a 50%
> chance of trying to **remove term limits**."

- `Integrity` → **50%** institute / tighten term limits.
- `Controversial` OR `Manipulative` → **50%** remove term limits.
- → traits DRIVE the action choice (not just modify election odds). This is the
  concrete instance of the b53 "governor-trait-gated gov-action" requirement.
  All three traits exist in the shipped `Trait` union (`types.ts:64/73/103`) but
  nothing reads them in the gov phase.

### ★ Expertise-as-guide (POST 5) — the b53 industry↔expertise coupling, concretized

> "**% Use their personal expertise as a guide.** … under 'type' it lists most of
> these — example: **Judicial** might focus on **police and prisons**. If
> **Business/Econ** expert, more inclined to **improve a state industry**
> (especially if the industry is one of their other expertise like **Ag**)."

- `Justice` (Judicial) expertise → focus on **police / prisons**.
- `Business` / `Economics` expertise → **improve a state industry**, *preferring
  an industry that matches another of the governor's expertise tags* (e.g. a
  Business+Agriculture governor improves agriculture). This is the concrete
  **industry ↔ governor-expertise coupling** the b53 overhaul tracks.
- Maps onto the shipped `Expertise` axis (19 tags, `types.ts:182-192`;
  `Justice`, `Business`, `Economics`, `Agriculture` all present). Nothing in the
  gov phase reads `gov.expertise`.

### ★ Industry-expansion AS "help" → lobby points (POST 2, 3, 4)

> OrangeP47: "I've been interpreting 'help' as sometimes triggering an
> **industry expansion move**, because technically those can give points to cards
> — agriculture expansion can give points to **big-ag**, finance can give points
> to **wall street**. It really helps when the AI 'doesn't know what to do'."
> Ted (POST 3): "agreed, I've been including that as help too."

- Players already operationalize the undefined "help party overall" bucket as
  **improve a state industry → that industry feeds the matching lobby card**
  (Agriculture → Big-Ag; Finance → Wall Street). This is the natural fallback
  when "the AI doesn't know what to do."
- POST 4 (corroboration): in an 1840s game where 3 same-party factions all held
  **Big-Ag**, "what helps the party as a whole" was trivially = expand
  agriculture. So industry-expansion-as-help is *especially* clear when multiple
  factions share a lobby card.
- ★ **DIRECTION MATTERS for the build:** the thread wants **industry-expansion ⇒
  lobby-card POINTS** (governor improves industry → the matching lobby card gains
  value). The shipped #294 `LOBBY_INDUSTRY` coupling runs the **REVERSE** arrow:
  held lobby cards bump the matching state industry (`phaseRunners.ts:1638-1656`).
  Same table, opposite causal direction; the gov-action use case is unbuilt
  (see Shipped-vs-designed).

## Open questions raised in-thread (parking lot — POST 5)

- **Q1 — improving an un-leadable industry:** "is there a benefit to improving an
  industry even though there's no chance of ever being the top state (say you have
  3 industries at 4, others at 8–10)?" → if industry rank only matters for being
  the *top* state, a CPU governor improving a hopeless industry is wasted; needs a
  payoff (lobby-points-regardless?) or a guard so the CPU doesn't pick it.
- **Q2 — tax-cut-attracts-industry:** "should lowering taxes / repealing a state
  income tax offer a chance for **attracting industries** (manufacturers, possibly
  finance, encouraged to come to a state with favorable tax structures)?" → a NEW
  proposed gov-action coupling: tax policy → industry migration. (Relates to the
  taxation threads `1bf19872`/`1f72600c` but is a distinct gov-action mechanic.)
- **Q3** — should the election-law-tinker bucket be its own bucket or a "subset of
  one above"? (POST 5, unresolved.)

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-30)

**NONE of this thread is built.** The shipped CPU governor action is a single
flat skill nudge that reads no traits, no expertise, no cards, no crisis, and no
industry; there is no 25/25/50 rule, no trait/expertise gating, no industry-
expansion action, no election-law action, and no special-passion path in code.
The Governors page is read-only.

- **★ Shipped gov-action = flat 30% skill-only `bias` nudge (NOT 25/25/50).**
  `runPhase_2_5_2_Governors` (`phaseRunners.ts:3382-3392`) is the ENTIRE governor
  turn: for each state with a governor, **30%** chance (`chance(0.3)`, seeded RNG)
  to nudge `s.bias` by `(gov.skills.governing − 1) * 0.05`, signed by party
  (BLUE −, else +), clamped ±5. That is it. It reads **only** `gov.skills.governing`
  and `gov.partyId`. → **Confirms the task framing:** the app does a flat skill
  nudge; the 25/25/50 rule is the spreadsheet/table rule, never the app. Delta =
  replace this stub with the multi-bucket selector.
- **★ NO trait gate in the gov phase (#20 / b53 trait-gating).** Code-grep of the
  gov phase (`phaseRunners.ts:3382-3392`) reads no `gov.traits`. `Integrity`,
  `Controversial`, `Manipulative` all exist in the `Trait` union
  (`types.ts:64`, `:73`, `:103`) and are used elsewhere (election bands
  `:747+`), but **0% wired to any governor action.** Term-limit-by-integrity /
  remove-by-controversial is unbuilt.
- **★ NO expertise gate in the gov phase (#20 / b53 industry↔expertise).**
  `gov.expertise` (`Politician.expertise: Expertise[]`, `types.ts:1277`) is never
  read by the gov phase. The `Justice`/`Business`/`Economics`/`Agriculture` tags
  exist (`types.ts:182-192`) but drive no gov-action choice. Unbuilt.
- **★ Industry-expansion-as-gov-action = UNBUILT; `LOBBY_INDUSTRY` runs the
  OPPOSITE direction (#294).** `s.industries` is `Record<string, number>`
  (`types.ts:1328`); the governor phase never touches it. The only consumer of
  `LOBBY_INDUSTRY` (`types.ts:398-414`) is the 2.1.8 alignment-drift pass
  (`phaseRunners.ts:1638-1656`), which bumps a state's industry +1 from **held
  lobby cards** — i.e. **lobby-card ⇒ industry**, the REVERSE of the thread's
  **industry-expansion ⇒ lobby-card-points**. So #294 is *partially* shipped but
  the gov-action arrow the thread wants (improve-industry feeds the lobby card,
  as a governor's "help" move) is unbuilt, AND the direction differs.
- **★ Election-law gov-action (term limits / gerrymander) = UNBUILT.**
  `termLimits` exists ONLY as a constitutional-convention article
  (`'two_terms' | 'no_limits'`, `types.ts:1396`; set in `constitutionalConvention.ts:120`,
  default `scenario1856.ts:189`) — there is **no governor mechanism** to set or
  remove term limits, and **no `gerrymander` field anywhere** in `src/`
  (grep = 0). The "≥1 same-party Senator" qualification gate is also unbuilt.
- **Special-passion path (Civil Rights / Theocrat) = UNBUILT as a gov-action.**
  `CivilRights` exists as a lobby/interest card (`types.ts:313/327`) and
  `Theocrats` as an 1856 interest card (`factions1856.ts:28`), but neither is a
  per-politician "passion" attribute, and nothing routes a governor's action
  through one. No `specialPassion`/`passion` field on `Politician`.
- **GovernorsPage is read-only (confirms framing).** `GovernorsPage.tsx` is a
  static table (State/Region/Governor/Party/Ideology/Gov-Skill); no actions, no
  player-facing gov-action UI at all.
- **Seeded-RNG for the rolls already available (#296).** The gov phase already
  uses `chance` from `../rng` (seeded), so the multi-bucket rolls can be made
  deterministic with the existing helper — `chance`/`pick`/`pickWeighted` are all
  imported (`phaseRunners.ts:9`). No new RNG plumbing needed.

**Net for tech-lead:** the entire CPU-governor-action *brain* is the 11-line stub
at `phaseRunners.ts:3382-3392` (flat 30% governing-skill `bias` nudge). The 25/25/50
table rule, every proposed bucket (trait-gated term limits, expertise→police/
industry, industry-expansion-as-help→lobby points, election-law-with-qualifications,
special-passion), and any player-facing gov-action UI are **all unbuilt**. Two of
the proposal's building blocks DO ship as data/infra — the `Trait` union (incl.
Integrity/Controversial/Manipulative), the 19-tag `Expertise` axis, `LOBBY_INDUSTRY`
(but reversed-direction), `termLimits` (convention-only), and seeded `chance` — so
the overhaul is wiring existing pieces into a new selector, not building from zero.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold.)*

- **HEADLINE → #20 (gov-action overhaul, b53 trait-gated + industry↔expertise).**
  This thread is the concrete SELECTION ruleset for #20: multi-bucket %, trait-gated
  term limits (`Integrity`→tighten, `Controversial`/`Manipulative`→remove, 50% ea),
  expertise-as-guide (`Justice`→police/prisons, `Business`/`Economics`→improve
  industry, prefer matching expertise). SHIPPED = flat 30% governing-skill `bias`
  nudge, reads no traits/expertise (`phaseRunners.ts:3382-3392`). 0% built.
- **CORROBORATES the b53 governor-trait-gating sub-item.** Integrity/Controversial/
  Manipulative all exist in `Trait` (`types.ts:64/73/103`) and are read by election
  bands, but NOT by the gov phase. Concrete spec now captured. 0% built.
- **CORROBORATES the b53 industry↔governor-expertise coupling sub-item.** 19-tag
  `Expertise` axis ships (`types.ts:182-192`); gov phase reads none of it. 0% built.
- **TOUCHES #294 (industry / `LOBBY_INDUSTRY`) — DIRECTION CONFLICT.** Thread wants
  industry-expansion ⇒ lobby-card POINTS (governor "help" move). Shipped
  `LOBBY_INDUSTRY` runs the REVERSE (held lobby cards ⇒ industry +1,
  `phaseRunners.ts:1638-1656`). Same table, opposite arrow; gov-action use unbuilt.
- **ANALOG to #323 (CPU bill-scoring).** The multi-bucket weighted-roll selector is
  the governor-action twin of the CPU legislation-scoring problem; share the
  card/crisis/ideology weighting machinery. No code overlap yet; design parallel.
- **CORROBORATES #296 (seeded RNG for rolls).** Gov phase already imports seeded
  `chance`/`pick`/`pickWeighted` from `../rng` (`phaseRunners.ts:9`); the new
  bucket rolls inherit determinism for free. Infra present.
- **RELATED to sibling `a938ac91` (#258 predicate-gated / #221 content registry).**
  That thread (Oct 2022) proposes converting some gov-actions to scripted events +
  sketches the same trait/ideology rework; THIS thread (Aug 2022) is the earlier,
  concrete % selection spec. Cross-reference; same #20 family.
- **NEW — the concrete 25/25/50 CPU baseline + its named flaws.** The exact current
  table rule (25% ideology-card / 25% crisis / 50% "help party overall") and why it
  fails ("help party overall" undefined; no-ideology-card eras). Not previously
  captured as a numeric baseline. It is a TABLE rule, never the app (app = flat 30%).
- **NEW — the multi-bucket selection STRUCTURE.** %improve-industry (+2nd roll for
  which) / %ideology+lobby+crisis / %election-law-tinker / %special-passion, with
  trait + expertise overrides selecting within buckets. 0% built.
- **NEW — election-law-tinker WITH qualifications path.** Gerrymander / term-limit
  actions gated on qualifications (e.g. ≥1 same-party Senator). `termLimits` ships
  convention-only (`types.ts:1396`); no `gerrymander` field (grep=0); 0% as
  gov-action.
- **NEW — special-passion path (Civil Rights / Theocrat).** A per-pol "passion"
  guiding the gov-action via a roll. No `passion` attribute on `Politician`; cards
  named exist (CivilRights, Theocrats) but unwired. 0% built.
- **NEW (open question) — tax-cut-attracts-industry.** Lowering / repealing a state
  income tax → chance to attract manufacturers/finance to favorable-tax states. A
  proposed tax↔industry gov-action coupling; relates to taxation threads but
  distinct. Unbuilt; unresolved.
- **NEW (open question) — un-leadable-industry payoff.** Is improving an industry
  worth it when you can never be the top state? Needs a non-rank payoff (lobby
  points regardless) or a CPU guard. Unresolved.
