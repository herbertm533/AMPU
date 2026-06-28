# Digest — "AMPU Political Parties" (`7d0dfeec`)

**Type:** DESIGN / content-spec thread (May–Jun 2022), **NOT a playthrough**.
**Batch (b37)** · 30 posts / 1 chunk · designer: **@vcczar** (tier-1) + **@MrPotatoTed**
(tier-1); community (OrangeP47, Arkansas Progressive, 10centjimmy, matthewyoung123,
Timur, eveofanticreation, AnonAssister) = proposers (GA / tier-4).
**Why it matters:** this is the **canonical roster + transformation-rules spec for the
party-evolution system** — the *content/data* behind the already-documented era-specific
BLUE/RED party names (game-context §entities lines 439/495-497). vcczar opens (POST 1) by
stating he has **added scripted events that create new parties**, and that **every party
formation AFTER the first for each party has REQUIREMENTS that must be met** — i.e. party
identity *transforms* over a campaign via the scripted-event/content system, not just a
cosmetic rename. He lists the **full Blue branch roster, full Red branch roster, and the
cross-coalition Era-of-the-Future parties**. Pure design intent; corroborated **0% built**
below (only a party's `name` string is mutable at runtime; no roster, no branches, no
formation triggers, no prereqs exist in code).

---

## The two-coalition branch model (the spec)

Every party is a **branch of one of two fixed coalitions, BLUE or RED** (matches the
shipped `PartyId = 'BLUE' | 'RED'`, types.ts:3). A campaign moves through a *sequence* of
branch identities within each coalition, driven by **scripted-event party-formation
triggers** with **prereqs** (POST 1). vcczar notes he **amended the requirements so the
Federalists and Jeffersonian Republicans now last much longer** (POST 1) — the prereqs are
tunable knobs controlling how long a branch persists before the next forms.

**BLUE roster (POST 1):** Jeffersonian Republican · Democratic · Labor · Liberal ·
Liberal Republican · Populist (1890s version) · Dixiecrat · Progressive · Democratic
Socialist · American Socialist · American Communist · Green.

**RED roster (POST 1):** Federalist · National Republican · Whig · Republican · Know
Nothing (= the American Party, confirmed POST 14-15) · Conservative · Bull Moose · Party
of Jesus Christ · American Fascist · **National Populist** (the MAGA-populist branch,
*renamed from* "Nationalist Populist", POST 5-7) · Libertarian.

**Era-of-the-Future cross-coalition parties (can land BLUE *or* RED, POST 1):**
- **Science Party → Technocratic Party** (rename accepted, POST 2-3) — pure science/tech,
  efficiency/results "without regards to the struggles of the people."
- **Humanitarian Party** (name kept, POST 2-3) — human-centric in a space/science/tech era.
- **Earth Party → Earth First Party** (rename accepted, POST 2-3) — Earth-affairs + US
  exceptionalism, *opposed to* human imperialism in Space.
- **Universe Party → name UNDECIDED** (POST 1-10, 27-29) — space-focused + one-world-
  government-friendly. vcczar rejected "Universal" (POST 3); candidates floated and left
  open: Solar, Transplanetary, Apollo, Galactic, Astropolitik ("that's an idea," POST 29),
  Neo-Expansionist, Unity Coalition, etc. **No final pick in-thread.**
- **Trigger timing:** "Naturally the triggers for these parties will happen **very late in
  the game**" (POST 1) — they fire in the terminal Era-of-the-Future band.

---

## KEY MECHANIC: scripted-event party formation with prereqs

- **First formation of each party = unconditional; every formation thereafter = gated by
  REQUIREMENTS** (POST 1, verbatim: *"All party formations, aside from the first for each
  party, has requirements that must be met."*). This is the structural rule that turns the
  roster into a **prereq'd transformation graph**, not a flat list.
- Mechanism = **scripted events that create new parties** (POST 1) → this is the
  scripted-event content primitive (**#221**), applied to the party axis. Party formation is
  one *kind* of scripted-event payload (alongside legislation/pres-action/gov-action/SC-case
  events the #221 cluster catalogs).
- Persistence is tunable per-branch via its prereqs (the Federalist / Jeffersonian-Republican
  longevity amendment, POST 1) — corroborates the **era-band content model** (#92/#206/#116):
  which branch is *available/forms* is gated on game-state, and the Future branches are
  band-gated to the terminal era.

---

## Designer rulings (capture verbatim — decisive)

- **"National Populists"**, not Nationalist Populist (*"one too many ist's"*, proposed POST 5;
  vcczar: *"I think National Populists will be where I'll go with that one."* POST 7).
- **Dixiecrat STAYS** — *"Dixiecrat is staying because of historical reasons"* (POST 7),
  over a proposal to rename it "Southern Conservatives" (POST 5; rationale: Dixiecrat only
  makes sense given a Democratic Party exists). Note: Dixiecrat is a **BLUE** branch (matches
  game-context's "Dixiecrats start INSIDE Blue" realignment finding).
- **Socialist parties trimmed to TWO** — keep **American Socialist + Democratic Socialist**;
  *"I'm probably not going to include three socialist parties"* (POST 7); a third (Social
  Democrats) was floated as a possible swap-in but the two-party set was confirmed final
  (POST 9). (American Communist is separate and remains on the Blue roster.)
- **Single-issue parties EXCLUDED** as too narrow: **Anti-Masonic** rejected (*"too
  single-issue… the rest of their platform was kind of vague"*, POST 16-17); by the same
  logic **Prohibition** and other single-issue/frivolous parties are out of scope (POST 25
  raised Prohibition/American-Independent/Constitutional-Union; no adoption).
- **Reform Party = could be BLUE *or* RED** — *"Reform could be Blue or Red actually. I
  might consider them"* (POST 19-20) — a candidate cross-coalition branch, not yet committed.
- **Open historical-naming proposals (NOT adopted in-thread)** — POST 30 (eveofanticreation):
  rename "Know Nothing" → "Native American Party", "American Fascist" → "American Nazi Party",
  "National Populist" → "Patriot Party"; and asks where Union Party (1936) / Share-the-Wealth
  would sit (LW-populist w/ fascist members). vcczar did **not** rule on these — carry as open.

**Authority tiers (for ruling weight):** vcczar / MrPotatoTed (Ted) = **tier-1** (decisive);
all other posters here are **tier-4 GAs** (proposals). MrPotatoTed's only substantive posts
are joke-party riffs (POST 12, 23) — not rulings.

**Out-of-scope noise (do NOT catalog):** a long joke-party tangent — Birthday Party (POST 11,
later noted as Kanye West's real party, POST 23/26), NewYears/IJustWanna/etc. (POST 11),
Pirate Party (POST 13), "Die PARTEI"/"Party Party" (POST 12, 23), a frivolous-parties
Wikipedia link (POST 24). Pure flavor banter, no design content.

---

## Shipped-vs-designed (verified against `src/`, 2026-06-28)

**The party-roster + scripted prereq'd-transformation SYSTEM is UNBUILT. Only a party's
`name` string is mutable at runtime.**
- `src/types.ts:1306` `Party = { id: PartyId; name: string; leaderId?; color }` — a **flat
  record keyed to one of exactly two fixed `PartyId`s** (`'BLUE' | 'RED'`, types.ts:3). There
  is **NO party-branch type, NO branch enum, NO formation-event type, NO prereq fields, NO
  per-coalition roster data**. A party can only have its single `name` string changed.
- `grep -rniE "partyFormation|partyTransform|partyBranch|coalition|redCoalition|blueCoalition"
  src/` → **ZERO**. No roster file (`src/data/` ships scenarios/factions/states/draft/era-
  events only; no party-branch catalog).
- Scripted-event party formation rides on the **#221 scripted-event primitive**, which is
  **0% shipped** (`grep …scriptedEvent… src/` = ZERO; corroborated batch-32/33). So the
  trigger mechanism this thread relies on does not exist either.
- **Adjacent-but-different shipped reality:** the engine *does* model era-specific party
  *names* and a **deterministic faction-rename trigger** (gap **#40** / #78 — e.g. the
  Whig→"Conservative Party" 3-condition trigger), but that is **cosmetic relabeling within
  the two fixed coalitions**, gated by leader traits / win-streaks. It is **NOT** party
  *formation/transformation* (a new branch identity with its own platform, unlocked by a
  prereq'd scripted event). This thread's roster + prereq graph is the larger, unbuilt system
  that #40's rename triggers are a thin shadow of.

---

## Candidate gaps for consolidation

*(Map to EXISTING IDs; flag the one genuine NEW candidate. Consolidation agent owns the
gap-log edit + any new numbering — this is the hand-off list, no new IDs assigned here.)*

- **CANDIDATE NEW GAP — Party-branch roster + scripted prereq'd party-transformation DATA
  model.** Distinct from #221 (the scripted-event *primitive/engine*), from #40 (cosmetic
  per-era *rename* within a fixed coalition), and from #92/#206 (the era-band model). What's
  missing as DATA: (a) a **per-coalition branch ROSTER** (full Blue + Red lists above +
  cross-coalition Future parties); (b) **party-formation events with PREREQ/requirement
  fields** ("every formation after the first is gated"); (c) **tunable branch-longevity
  knobs** (the Federalist/Jeffersonian-Republican amendment); (d) **branch metadata**
  (platform blurb, BLUE/RED/either assignment). Shipped `Party` is a flat 2-value record
  with a mutable `name` only → 0% built. Source: this digest, POST 1, 7, 19-20.
- **#221 (scripted-event content primitive)** — CORROBORATE + ENRICH. **Party formation is a
  scripted-event payload TYPE** ("I've added a few scripted events to create some new
  parties," POST 1) — adds the party-creation event to #221's catalog axis (alongside
  legis-prop / pres-action / gov-action / SC-case / war events). The realm-of-possibility /
  importance curation rule recurs here as **exclude single-issue & joke parties** (Anti-
  Masonic/Prohibition too narrow, POST 16-17, 25; joke parties out, POST 11-13, 24).
  Cite POST 1, 16-17, 25.
- **#92 / #116 (era-as-content-band, game-state-gated)** — CORROBORATE. Which party branch
  forms is gated on game-state via prereqs; Future-band parties trigger "very late in the
  game" (POST 1). The Federalist/Jeffersonian-Republican longevity-via-prereq amendment is a
  per-band content-availability knob.
- **#206 (Era-of-the-Future = doubly-unbuilt stub)** — CORROBORATE + ADD CONTENT. Names the
  Future-band party set (Technocratic / Humanitarian / Earth-First / [Universe-TBD]) as
  terminal-era content that triggers last (POST 1). The Future band is `absent from the
  shipped 4-value Era enum` (no `future` member, types.ts:1337) — these parties have no enum
  band to attach to. **Open Q surfaced:** Era-of-the-Future "Universe/space-government" party
  NAME is undecided (POST 3-10, 27-29). Cite POST 1, 2-3, 27-29.
- **#40 / #78 (faction nicknames + deterministic party-rename triggers)** — CONTRAST /
  RELATE (do NOT merge). #40 is cosmetic *rename within a fixed coalition* gated by leader
  traits/win-streaks; this thread is *party FORMATION/transformation* (new branch, prereq'd
  scripted event). They are adjacent but structurally different layers; the candidate-new
  roster/transformation gap is the superset, #40's rename triggers a thin special case.

---

### Open questions (carry forward)

- **Era-of-the-Future "Universe/space-government" party NAME unresolved** (POST 3-10, 27-29).
  Candidates left on the table: Solar, Transplanetary, Apollo, Galactic, Astropolitik. No
  designer pick. (Technocratic / Humanitarian / Earth-First are settled.)
- **Reform Party** — flagged as a possible BLUE-or-RED branch, "might consider them" (POST
  19-20); committed? Unknown.
- **Social Democrats** — floated as a possible third-socialist swap-in, but the two-socialist
  set (American + Democratic) was confirmed final (POST 7, 9); is SocDem in or out? Reads OUT.
- **Historical-renaming proposals from POST 30** (Know-Nothing→Native-American Party, American
  Fascist→American Nazi Party, National-Populist→Patriot Party) — vcczar did not rule; status
  unknown. Union Party (1936) / Share-the-Wealth placement also unanswered.

---

### Provenance notes
- Single chunk; all 30 posts read. Authoritative signal = vcczar's accept/reject replies
  (POST 1, 3, 7, 9, 15, 17, 19, 29) and the POST 1 roster itself; everyone else proposes.
- ~⅓ of the thread (POST 11-13, 22-24, 26) is joke-party banter — flagged out-of-scope, not
  cataloged.
- Codebase verified at `src/` HEAD 2026-06-28: `Party` (types.ts:1306) is a flat 2-value
  record with a mutable `name`; `PartyId` (types.ts:3) is `'BLUE' | 'RED'`; no party-branch /
  formation / prereq / coalition tokens exist; the #221 scripted-event primitive (the trigger
  mechanism) is 0% shipped.
