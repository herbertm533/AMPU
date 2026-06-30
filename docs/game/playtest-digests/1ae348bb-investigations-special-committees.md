# Digest — "Discussion: Launches Investigation in the Era of Populism or Later"

- **Slug:** `1ae348bb-discussion-launches-investigation-in-the-era-of-populism-or-later`
- **Source CSV:** `1ae348bb-Discussion_Launches_Investigation_in_the_Era_of_Populism_or_Later.csv`
- **Posts:** 3 (1 chunk, ~8.6k chars). Opened by **10centjimmy** (editing/ratifying
  a ruleset; tags `@matthewyoung123` as the original drafter, `@ebrk85`).
- **Date stamp in-thread:** "Edited January 14 by 10centjimmy" (year unstated;
  references ruleset version **3.0.40**).
- **Type:** **Ruleset (v3.0.40) DESIGN spec, NOT a playthrough.** No years/eras are
  *played*; this is the canonical procedural rule for **congressional special
  committees & investigations**. matthewyoung123 drafted §3.0.40; 10centjimmy adds
  the legis-prop-driven Era-of-Populism extension (his edits "UNDERLINED and
  ITALICIZED"); POST 2 ("Looks fine to me") and POST 3 are ratification/amendment.
- **King Caucus:** **NOT present** in this thread. The task flagged it as *possible*;
  it does not appear. (Pre-1830s nomination belongs to the sibling b58
  pre-primary-conventions thread + gap #185, not here.) No mention of caucus,
  nominating caucus, or any pre-convention presidential-nomination mechanic.
- Cites `POST n` = `===== POST n =====`.

> **Why this thread matters.** It is a genuinely **NEW system not previously
> captured anywhere in the KB**: a full **congressional INVESTIGATION / SPECIAL-
> COMMITTEE** procedure — how a faction launches an investigation, the **era gate**
> (Era of Populism and later), the **two launch paths** (Era/Random-Evo-triggered
> special committee vs. legis-prop-driven investigation committee), **5-member
> committee composition**, a **6d6 + trait/ideology-modifier roll** that produces a
> 6-band guilt scale, and outcomes that run from *gain Integrity* up to
> **removed-from-the-game-permanently** plus Honest-Gov / party-preference swings.
> This is the **design home for scandal→removal**: the shipped engine has the
> `forceRetire`/removal *machinery* but no template fires it (b57 finding, QW49);
> this ruleset is exactly what *should* fire it. **Status: human-table ruleset,
> ratified at the forum table ("Looks fine to me"), 0% built in the app.**

---

## ★ Launch path A — Era-Evo / Random-Evo special committee (the pre-Populism rule) — POST 1

The base §3.0.40 (matthewyoung123): when an **Era Evo or Random Evo** lets Congress
form a special committee to investigate an incident or a cabinet member:

| Rule | Value |
|---|---|
| Who may form it | **Speaker of the House** OR **Senate Majority Leader** |
| Which chamber | **House** if Senate Maj/Min Leader positions **don't exist yet**; **Senate** once they do — unless the event names a specific chamber |
| Forms when target is **same party** as the chamber majority | **50%** of the time |
| Forms when target is **opposite party** | **100%** of the time |

This path is **not era-gated** — it fires whenever an Evo grants it (so it can
occur before the Era of Populism). The Populism extension (path B) reuses its
machinery.

## ★ Launch path B — Legis-prop-driven investigation committee (Era of Populism and later) — POST 1

The headline NEW system. Beginning in the **Era of Populism**, there are **legis
props** that propose specific investigations (POST 1 lists them):

| Investigation legis prop | Status in thread |
|---|---|
| Investigate the Federal Banking and Finance Agencies | has "launch investigation" rule |
| Investigate a Congressional Committee | has rule |
| Investigate Lobby or Special Interest | has rule |
| Investigate US House Leadership | has rule |
| Investigate US Senate Leadership | has rule |
| Investigate Executive Branch | "triggers" investigation |
| Investigate Judiciary Branch | "triggers" investigation |
| Investigate Intelligence Agencies | **same proposal but MISSING the rule** (POST 1: "though they should") |
| Investigate the Military | **same proposal but MISSING the rule** |

**Procedure (era-gated to Populism+):**
1. Legis prop proposed in House or Senate → goes to that body's **Judicial
   Committee** vote.
2. If it passes committee → must pass **full House and Senate** votes.
3. If it passes → an **Investigation Committee** forms: **House** if a Rep
   proposed it, **Senate** if a Senator did.
4. **Composition:** **5 members**; **majority of seats to the party controlling
   that body**; appointed by the Speaker/Majority Leader; **≥1 seat to the
   out-of-power party** (CPU randomizes). **Chair** = the majority-party member
   with the **highest Legislative skill** (random if tied).
5. **The investigation is always initiated by the dominant party, and ALL targets
   are drawn from the OPPOSITION (non-dominant) party** — regardless of who
   proposed the prop.

### Target group by investigation type (POST 1; POST 3 amends Lobby)

| Investigation | "Investigates" (target group; one randomly selected) |
|---|---|
| Intelligence Agencies | FBI Director + CIA Director |
| The Military | SecDefense/War/Navy + Generals + Admirals |
| Federal Banking & Finance | Federal Reserve Chair + Sec Treasury |
| House Leadership | House leadership |
| Senate Leadership | Senate leadership |
| Congressional Committee | Committee Chairs |
| Executive Branch | President + cabinet **except** SecTreasury, SecDefense/War/Navy |
| Judiciary Branch | Supreme Court justices |
| Lobby / Special Interest | opposing-party **faction leaders** (excl. statesmen who fall under another category). **POST 3 amends:** specifically the opposition faction leader **who holds one of the cards being investigated** |

## ★ The investigation roll — 25% proceed gate, then 6d6 + modifiers → 6-band outcome — POST 1

**Pre-roll gate:** before a legis-prop investigation begins, roll **25/100** to
proceed. **Fail → "not enough evidence," no penalties/bonuses** beyond the normal
points for the legislation passing. **Pass → investigation proceeds.**

**Base roll:** **roll 1d6 for EACH of the 5 committee members, sum them** (range
5–30). Worked example in-thread: 4+5+1+3+5 = 18.

**Modifiers** (applied to the total; "use all that apply"; the OR-pairs cap so you
never double-count):

| Modifier | Applies when the investigated Statesman… |
|---|---|
| **−5** | has **Magician** OR **Teflon** (both → just −5) |
| **−4** | has **Integrity** |
| **−3** | is within 1 ideology slot of **all** their own-party committee members |
| **−2** | has **Leadership** OR **Harmonious** (both → just −2) |
| **−1** | shares a faction with **any** committee member |
| **+1** | shares a faction with **no** committee member |
| **+2** | has **Easily Overwhelmed** OR **Disharmonious** (both → just +2) |
| **+3** | is **not** within 1 slot of all own-party committee members |
| **+4** | is **Controversial** OR **Illicit** (both → just +4) |
| **+5** | is **Incompetent** |

**Outcome bands** (note in-thread overlap at 15 and 20 — verbatim, "15-20" and
"21-25" both include their endpoints; flagged as an open question below):

| Roll total | Outcome |
|---|---|
| **0–10** | Not guilty; **gains Integrity** (if lacking). 10% chance party-pref **+1 toward the President's party** ("witch hunt"). |
| **11–15** | Not guilty; **retains post**. |
| **15–20** | Not guilty, but **50% gains Disharmonious / 50% gains Manipulative**. |
| **21–25** | **Guilty** — must **resign current post**; **may never again serve cabinet/military/judiciary**; **but a sitting Rep/Senator does NOT resign**. Unemployed = barred from cabinet/judiciary/military but **may still run for office**. |
| **26–30** | Guilty, resigns, **gains Controversial or Illicit** (whichever they lack; random if neither); barred from cabinet/military/judiciary. 10% **Honest Gov +1**. |
| **31+** | Guilty, resigns, **removed from the game permanently**. Party-pref **+1 away from the incumbent President**. No Honest-Gov change ("rooting out corruption"). |

### Committee-member side-effects (POST 1)

| If GUILTY | If NOT GUILTY |
|---|---|
| Same-party-as-guilty members: **5% gain Integrity** | Same-party-as-target members: **5% gain Manipulative AND Propagandist** |
| Opposite-party members: **10% gain Leadership, 5% gain Integrity** | Opposite-party members: **5% gain Disharmonious, 10% gain Pliable** |
| **10% Honest Gov +1** | **10% Honest Gov −1** |

**Points award (POST 1):** during the **Executive Phase**, faction points are
awarded **as if the legislation were signed by the President**, regardless of the
guilty/innocent outcome. (I.e. passing the investigation prop pays out like any
bill, independent of verdict.)

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-30)

**NONE of this thread is built. There is no investigation/special-committee
mechanic in the shipped game at all (0%).** The only "committees" in code are the
**four legislative committees** (Domestic/Foreign/Economic/Justice) that review
*bills* — not investigations, not 5-member appointed panels, no targets, no
guilt roll. Verified by grep across `src/` for investigat/committee/expose/scandal.

- **★ NO investigation system; no phase, no entity, no roll (0% built).** The
  `PHASE_SEQUENCE` (`phases.ts:3-47`) has no investigation/special-committee phase.
  The shipped committees are legislative chairs only (`phaseRunners.ts:1894`
  `runPhase_2_2_2_Committees`, `:3463` `runPhase_2_6_2_Committee`), keyed to the
  4-value committee enum `'Domestic'|'Foreign'|'Economic'|'Justice'` (`types.ts:1237`),
  and they only move a `Bill` through `committee → passed_committee/killed_committee`
  (`types.ts:1514`). No 5-member appointed panel, no chair-by-highest-Legislative,
  no out-party seat, no target selection, no 6d6 guilt roll. **Entire system is new.**
- **★ The ruleset's "Judicial Committee" gate ≈ the shipped "Justice" committee,
  but does nothing of the sort.** The Justice committee only reviews Justice-tagged
  bills (`phaseRunners.ts:3476`); there is no path where a bill is routed to a
  committee that then *spawns an investigation*. The two-stage (committee → full
  House+Senate) vote the ruleset wants does exist for ordinary bills
  (`runPhase_2_6_2_Committee` → `2.6.3 Floor Votes`), so the *plumbing pattern*
  exists; the investigation use of it does not.
- **★ scandal→removal: machinery present, NEVER fired — corroborates b57 / QW49.**
  `forceRetire` is declared as an anytime-event effect kind at
  **`src/data/anytimeEvents.ts:28`** (`| { kind: 'forceRetire' }`) and the engine
  **executes** it at **`phaseRunners.ts:2723-2728`** (sets `retiredYear`,
  `recordRetirement`, `markPoliticianRetired`). **But grep of `src/data` for
  `kind: 'forceRetire'` = 0 matches** — no event template ever emits it. So
  scandal→forced-retirement is **designed-not-shipped**: the executor is dead code
  awaiting a trigger. This investigation ruleset's "guilty → resigns / removed"
  outcomes are the natural producer. (NOTE the ruleset's two strongest outcomes go
  *beyond* `forceRetire`: 21–25 = "may never serve cabinet/military/judiciary again
  but may still run" — a **partial office-ban with no shipped representation**; and
  31+ = **permanent removal from the game** — closer to the `death` effect kind
  `phaseRunners.ts:2717`, but semantically "removed," not "dead." Neither
  office-ban nor a non-death "removed" status exists.)
- **★ Scandal traits: PARTLY present, key ruleset traits ABSENT — corroborates
  #327 (Disgraced trait).** The shipped `Trait` union (`types.ts:62-117`) HAS:
  `Magician`(75), `Manipulative`(73), `Propagandist`(68), `Integrity`(64),
  `Harmonious`(72), `Leadership`(80), `Controversial`(103), `Incompetent`(92),
  plus `Scandalous`(101)/`Corrupt`(100). It does **NOT** have **`Teflon`,
  `Illicit`, `Disharmonious`, `Easily Overwhelmed`, `Pliable`, or `Disgraced`** —
  every one of these is a modifier or outcome trait the ruleset depends on (Teflon
  −5, Illicit +4 & granted-on-guilt, Disharmonious/Pliable granted to committee
  members, Easily Overwhelmed +2). b57 already logged Disgraced/Illicit/Disharmonious
  as absent (#327); this thread **adds Teflon, Easily Overwhelmed, and Pliable** to
  the missing-trait list. Existing scandal machinery (`scandal-*` anytime events,
  `data/anytimeEvents.ts:240+`) grants only `Scandalous`/`Corrupt`, never these.
- **★ Era gate "Era of Populism and later" is NOT EXPRESSIBLE today.** The `Era`
  enum is **4 values** — `'independence'|'federalism'|'nationalism'|'modern'`
  (`types.ts:1337`) — with **no "Populism" era and no future-era band**. "Populism"
  exists in code **only as an ideology card** (`IdeologyCardId` `'Populism'`,
  `types.ts:325`, mapped LW at `:357`), unrelated to era gating. So a Populism-era
  availability gate **cannot currently be written** without either a new Era value
  / era-band or a year threshold (Populism ≈ 1890s per historical-context). This
  corroborates the Era-enum/era-band limit (#206) and the predicate-gated-availability
  gap (#258, currently 1772-graph-only). The legis-prop set is also era-banded
  content the registry would need (#221-family).
- **★ Roles the ruleset needs but the office enum lacks: Senate Majority/Minority
  Leader.** The launch rule keys on "**Senate Majority Leader**" existing-or-not,
  but the shipped office set has only **`SpeakerOfHouse`** (`types.ts:1128`) +
  a Pro Tem in `runPhase_2_2_1` (`phases.ts:13` "Elect Speaker and Pro Tem"); there
  is **no Senate Majority/Minority Leader office**. Targets like FBI/CIA Director,
  Federal Reserve Chair, SecDefense/War/Navy as distinct cabinet slots also are not
  in the shipped cabinet model — these are modern/Populism-era offices the build
  doesn't represent.
- **Outcome levers that DO map to real state (the cheap wins).** Two of the
  ruleset's effects target existing fields: **Honest Gov ±1** → the shipped
  **`honest` meter** ("Honest Govt", `engine/labels.ts:52`, `components/Meter.tsx:8`);
  and **party-preference ±1** → the shipped **`partyPreference`** field, clamped
  ±5 (`types.ts:1093-1094`, `:1570`). So the meter/party-pref consequences are
  wireable to real state; the committee, roll, traits, office-ban, and removal are
  not.
- **King Caucus / Congressional Nominating Caucus: not in thread, not in code.**
  grep for caucus/nominating in `src/` → only a flavor blurb
  (`FactionLeaderPage.tsx:12` "1800s caucus era" description). No nomination-caucus
  mechanic exists, but this thread does not ask for one — relates to #185
  (nomination) only via the sibling b58 conventions thread, not here.

**Net for tech-lead:** this is a **new top-level system** (congressional
investigations / special committees), 0% built, but it sits on top of three things
that DO ship as infra: the **committee→floor two-stage vote pattern**, the
**`forceRetire` executor** (dead-code awaiting a trigger — QW49), and the
**`honest` meter + `partyPreference`** outcome fields. To build it you'd need: a new
investigation entity + phase; a 5-member appointment+chair selector; the 6d6 roll
with seeded RNG; **5–6 new traits** (Teflon, Illicit, Disharmonious, Easily
Overwhelmed, Pliable, plus #327's Disgraced if adopted); a **partial office-ban
status** and a non-death **"removed from game"** status; a **Populism era-band or
year gate** (not currently expressible, #206/#258); and **Senate Majority/Minority
Leader** + several modern cabinet/agency offices as targets.

---

## Delta list — map to EXISTING gap IDs (consolidation owns the gap-log write)

*(No new IDs assigned here. Consolidation decides NEW vs fold.)*

- **HEADLINE — NEW SYSTEM: congressional investigations / special committees
  (consolidation to a NEW ID).** Full v3.0.40 procedure captured: two launch paths
  (Evo-triggered 50%/100% special committee; legis-prop-driven Populism-era+
  investigation), Judicial-Committee→full-vote gate, 5-member out-party-inclusive
  committee with highest-Legislative chair, 25% proceed gate, 6d6+modifier roll,
  6-band guilt scale, committee side-effects, Executive-Phase point award. **0%
  built** (no investigation phase/entity/roll anywhere in `src/`). Not previously
  in the KB. This is the heart of the thread.
- **CORROBORATES the forceRetire-not-wired finding (b57 / near-term QW49).**
  `forceRetire` declared `data/anytimeEvents.ts:28`, executed `phaseRunners.ts:2723`,
  **no template emits it** (grep=0). This ruleset is the designed *producer* of
  scandal→removal. Designed-not-shipped, verified.
- **CORROBORATES #327 (Disgraced / scandal-trait gap) AND EXTENDS it.** Shipped
  traits lack `Disgraced` AND `Illicit` AND `Disharmonious` (b57) — **plus this
  thread adds `Teflon`, `Easily Overwhelmed`, `Pliable`** as required modifier/
  outcome traits absent from `Trait` (`types.ts:62-117`). 5–6 missing traits total.
- **CORROBORATES #206 (Era enum / era-band limits) and #258 (predicate-gated
  availability).** "Era of Populism and later" is **not expressible** — Era enum is
  4 values, no Populism/future band (`types.ts:1337`); "Populism" is only an
  ideology card (`:325`). Needs a new era-band or year gate; #258 predicate gating
  is 1772-graph-only today. The era-banded legis-prop set also touches the content-
  registry family (#221).
- **NEW — office/cabinet model gaps surfaced by the targets (consolidation: fold or
  new).** Ruleset keys on a **Senate Majority/Minority Leader** (shipped office enum
  has only `SpeakerOfHouse` + Pro Tem, `types.ts:1128`) and on modern offices as
  targets (FBI/CIA Director, Federal Reserve Chair, distinct SecDefense/War/Navy).
  These offices don't exist in the build.
- **NEW — two punishment states with no shipped representation.** (a) a **partial
  office-ban** ("never serve cabinet/military/judiciary again, but may still run for
  office") and (b) a non-death **"removed from the game permanently"** status. The
  engine has only `death` and `forceRetire` (full retirement) — neither expresses a
  *ban-but-electable* or a *non-death removal*.
- **CHEAP-WIN outcome levers already map to real state.** Honest-Gov ±1 → shipped
  `honest` meter (`labels.ts:52`); party-preference ±1 → shipped `partyPreference`
  (clamped ±5, `types.ts:1093/1570`). The verdict's meter/party consequences are
  wireable without new state.
- **RELATED to #185 (nomination) only via the sibling b58 conventions thread —
  King Caucus is NOT in this thread.** No caucus/nominating mechanic appears here;
  do not attribute King Caucus to this digest.
- **OPEN QUESTION (in-ruleset bug) — overlapping outcome bands.** "15-20" and
  "21-25" both claim the endpoints 15 and 20 (and 20/21 boundary); the worked
  example resolves 22 → guilty (21–25), but 15 and 20 are ambiguous as written.
  A build must pick half-open bands.
- **OPEN QUESTION — Intelligence Agencies & Military props lack the launch rule
  "though they should" (POST 1).** Two of the nine investigation props are defined
  but un-ruled; the designer intends them to get the rule but hasn't written it.
- **OPEN QUESTION — POST 3 narrows Lobby/Special-Interest targeting** to the
  opposition faction leader **who holds a card being investigated** — implies the
  investigation is parameterized by a specific lobby/interest *card*, which needs a
  card→target resolution the build has no analog for.
