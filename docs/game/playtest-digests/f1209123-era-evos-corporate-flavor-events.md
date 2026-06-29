# Digest — `f1209123-era-evos-corporate-flavor-events` ("Era Evos: Corporate Flavor Events")

**Type:** CONTENT-AUTHORING drop (not a playthrough). **Arkansas Progressive**
supplies **@vcczar** a curated, hand-categorized **"List of Corporation Era Evos
by Category"** — authored content for the **"Era Evo"** event category (the
era-evolution FLAVOR-event line: real corporations + cultural milestones tied to
years and, often, HOME STATES). vcczar accepts it ("Perfect… this helps a lot",
POST 2). **2 posts / 1 chunk** (chunk-001, both covered; source CSV ~5.6 KB).
**Mar 24, 2025** (politicslounge topic 6116). POST 2 = a near-verbatim repost +
3 missing-corp adds.

**★ Headline:** maps ENTIRELY onto existing gaps — **no new gap IDs.** It is the
flavor-side / content-side companion to **#221** (scripted-vs-FLAVOR event tier),
**#248** (the 33-value `subtype` taxonomy — Business/Labor · Banking · Trade ·
etc.), and especially **#294** (whose design ALREADY names an **"era-evo →
industry/lobby ACTIVATION schedule"** — this thread is the FLAVOR-content sibling
of that mechanic) + the **census industry-shift → EV** coupling (`5e5735ec` /
`074b6d6f`, #305→#34). Code-verified 0% shipped: **no "Era Evo" event category,
no `isFlavor` flag, no corporation/company entity, no industry-sector taxonomy,
no corp→home-state→industry/EV link anywhere in `src/`.**

⚠️ **TERMINOLOGY COLLISION to flag:** "era-evo" is used TWO ways in the corpus.
(a) On **#294** it means an **industry/lobby UNLOCK schedule** (Wall-St born at
the Buttonwood Agreement, Natural-Gas requires Spindletop, Manufacturing rolls
out NE 1790 → all 1866, etc. — a MECHANICAL regional-availability gate). (b) In
THIS thread it is the **name of a FLAVOR-EVENT CATEGORY** — atmospheric
corp/cultural milestones with little/no mechanical effect. Same label, different
construct. The two are RELATED (a corp's founding event ≈ the cultural marker for
its industry's era-evo unlock) but should not be conflated when building.

---

## What an "Era Evo" IS, per this thread (the authoring artifact)

An **Era Evo** = an **era-evolution FLAVOR event**: a real corporation founding,
product launch, media debut, or cultural milestone, filed under an **industry/
media CATEGORY** and stamped with a **year** and (often) a **home STATE** and an
**owning corporation**. Distinct from scripted (mechanical) events — these are
atmosphere/period-texture, the same flavor tier #221 + the `b73925a4` Flavor-
Event Poll already define ("no choices / no point impact"; brand/business/
cultural-institution-tied). Authored **per era, by category** — i.e. the era-band
axis (#92/#206) is the implicit filing key (a corp event "fires" in the era its
year lands in).

**Categories + counts (the SHAPE, not a transcription):**
- **News & Journalism (4):** USS Maine Struck 1898 (Hearst/Pulitzer), Ida
  Tarbell's Standard Oil exposé 1904 (McClure's), First Pulitzer Prizes 1917,
  NYT begins 1851. → **Media + Big-Oil-muckraking flavor.**
- **Radio & Television (8):** Grand Ole Opry 1927 (WSM→NBC), NBC founded 1925,
  Lone Ranger 1925, Ed Sullivan 1948 (CBS), I Love Lucy 1955 (CBS), MTV 1981
  (Warner/AmEx→Paramount), Netflix streaming 2007 ("Streaming Wars" 2019), Judge
  Judy (CBS/Paramount). → **Media-industry arc; spans into the modern/Future
  bands (#206).**
- **Film & Plays (2):** Radio City Music Hall 1932 (MSG Entmt), The Great Train
  Robbery (Edison Mfg Co).
- **Finance & Industry (~38, the long list):** Bank of Manhattan 1799, first US
  life-insurance policy, Du Pont gunpowder (DE), American Fur Co, Campbell /
  Heinz / RJ Reynolds (Winston NC), Edison Electric, Dow Jones, J&J (Brunswick
  NJ), Singer electric sewing machine, GE, Kodak, Nabisco, Bayer aspirin,
  Carnegie Steel → US Steel, Harley-Davidson, Chevrolet-vs-Ford, Ford Assembly
  Line, Firestone, Blue Cross, Nissan (Japan), IBM hard drive, Apple, AT&T
  dominance, Enron bankruptcy, Toyota > GM, Amazon dominance, Hershey, Coca-Cola
  (GA), Pillsbury (Minneapolis), Crayola/Cracker Jack/Parker Bros/Hallmark, etc.
- **"Some missing corps" (POST 1–2):** **Coca-Cola — GA · General Mills — MN ·
  Chrysler (Stellantis) — MI** — explicitly given as **CORP → HOME-STATE** pairs.

**Natural mechanical hooks the list implies (all design-side, all 0% shipped):**
1. **Corp → industry SECTOR.** Each entry buckets to an industry: steel
   (Carnegie/US Steel), oil (Standard Oil), auto (Ford/Chevy/Toyota/GM/Chrysler),
   tech (IBM/Apple/Amazon), finance (Bank of Manhattan/Dow Jones), media
   (NBC/CBS/MTV/Netflix), insurance (Blue Cross/first life policy), CPG
   (Coca-Cola/Hershey/Heinz/Campbell). → maps onto **#294's industry taxonomy**.
2. **Corp → HOME STATE** (RJ Reynolds=NC, J&J=NJ, Du Pont=DE, Coca-Cola=GA,
   General Mills=MN, Chrysler=MI, Pillsbury=Minneapolis…). → an HQ→state link
   that, if it drove **state industry strength**, feeds the **census industry-
   shift → EV** roll (`5e5735ec` Step 3 / #294 / #305→#34): a corp HQ event could
   bump a state's industry → "leader-in-industry" / "primary-industry-change"
   triggers → ±EV. This is the concrete realization of that coupling.
3. **Corp/event → LOBBY / interest card.** Hearst/Pulitzer/NBC/MTV ⇒ a Media
   lobby; Standard Oil/Tarbell ⇒ Big-Oil; Carnegie/US Steel/AT&T ⇒ Big-Business;
   Bank of Manhattan/Dow Jones ⇒ Finance/Wall-St. → the **lobby/interest-card**
   cluster (`LobbyCardId`/`InterestCardId`); cf. #294's era-evo→lobby ACTIVATION
   schedule (Wall-St born at Buttonwood). NB: the SHIPPED card sets are
   era-specific 1772/1856 only — **no Big-Business / Big-Oil / Media / Finance
   card exists by those names** today.

---

## SHIPPED vs DESIGNED (code-verified 2026-06-29)

**Designed (this thread):** an "Era Evo" FLAVOR-event CATEGORY; ~50 corp/cultural
entries with year + category + (often) home-state + owning-corp; implicit
couplings to industry sector, home-state economy, and lobby/interest cards.

**Shipped:** none of it.
- **No "Era Evo" / flavor category or subtype on events.** `EraEvent`
  (`src/types.ts:1466`) is a single uniform shape — `id/year/title/description/
  responses/decider/postEffects` — with **NO `isFlavor` flag, no category /
  subtype field, no per-category era-activation**. (Same finding as #221 / the
  `b73925a4` Flavor-Event Poll.) No `era-evo`/`isFlavor`/`flavorEvent` token
  anywhere in `src/`.
- **No corporation / company ENTITY.** No `corporation`/`companyId`/`headquarters`
  identifier in `src/`. ("Company" appears only as event prose — East India Co.,
  Ohio Life Insurance & Trust Co. — `eraEvents1772.ts:84`, `eraEvents1856.ts:60`.)
  The shipped era-event data has zero corp/era-evo content.
- **No industry-SECTOR taxonomy.** `State.industries` is a free-form
  `Record<string, number>` (`src/types.ts:1328`); shipped KEYS are ad-hoc
  (shipping/finance/tobacco/agriculture/cotton/manufacturing/coal, 1772/1856
  only) and do NOT match any canonical sector list — exactly the **taxonomy
  mismatch logged on #294**. No "steel/oil/auto/tech/media" sectors; no Era-of-
  Industrialization/modern industry keys.
- **No corp → home-state → industry / EV link.** The ONLY industry mutator is the
  PR7 lobby→industry +1 nudge (`LOBBY_INDUSTRY`, `src/types.ts:398`;
  `phaseRunners.ts:1631-1656`), which can only RAISE an already-present key. It
  feeds METERS, never `electoralVotes`. The industry-shift→EV table the corp HQ
  link would drive is **0% built** (`5e5735ec`/#294/#305→#34).
- **Lobby/interest cards exist but don't match.** `LobbyCardId` /
  `InterestCardId` / `IdeologyCardId` (`src/types.ts:310-327`) are **era-specific
  faction influence cards** (Merchants, NorthernIndustry, WallStreet, Planters…).
  No generic **Big-Business / Big-Oil / Media / Finance** national lobby of the
  kind these corp events would feed; no event→lobby-activation hook.

**Net:** wholly designed content + couplings, **0% shipped**. It sharpens
existing 0%-shipped gaps; it reveals **no new architecture** beyond what #221 /
#248 / #294 / #206 / #261 already record. The one genuinely NEW *framing* worth
registering (folded, not a new row) is the **"Era Evo" flavor-event CATEGORY as a
named authored content line tying real corporations → year → home-state →
industry sector → lobby** — i.e. the FLAVOR-content half of #294's industry-evo
schedule, sitting on #221's flavor tier with a #248 subtype tag.

---

## Candidate gaps for consolidation (consolidation agent owns the gap-log write)

1. **[sharpens #221 — flavor tier]** "Era Evo" = an **era-evolution FLAVOR-event
   category**: real corp foundings / product launches / media debuts / cultural
   milestones, era-filed, little/no mechanical effect — the same flavor tier
   #221 + `b73925a4` define (`isFlavor` flag/category + player toggle). This
   thread is a concrete ~50-entry authored batch FOR that tier. ⚠️ Note the
   `b73925a4` Flavor-Event Poll DEADLOCKED 10-10 and was DEFERRED — do NOT treat
   this corp list as committed in-scope content. Source: POST 1-2.
2. **[sharpens #248 — subtype taxonomy]** Era-evo corp events carry an
   industry/sector SUBTYPE filing — they map onto the 33-value enum's
   **Business/Labor · Banking · Trade · (Media?)** values; the categories here
   (News/Radio-TV/Film/Finance-Industry) ARE a sub-section taxonomy of the kind
   #248 records. ★ Possible gap in the 33-enum: a dedicated **Media/Entertainment**
   value (NBC/CBS/MTV/Netflix/Hearst) is not obviously among the 33 — flag for
   the taxonomy-review pass. Source: POST 1 (category headers).
3. **[★ sharpens #294 — the CENTER of this thread]** #294 already names an
   **"era-evo → industry/lobby ACTIVATION schedule."** This list is the FLAVOR /
   provenance sibling: each corp HQ event is the cultural marker for an
   industry's era-evo, and it ties **corp → HOME STATE → industry sector**
   ("Coca-Cola — GA", "General Mills — MN", "Chrysler — MI"; RJ Reynolds=NC,
   J&J=NJ, Du Pont=DE). Reinforces (a) the **industry-TAXONOMY mismatch** (steel/
   oil/auto/tech/media sectors absent from the ad-hoc 12 keys) and (b) the
   **corp-HQ → state-industry → census industry-shift → ±EV** chain
   (`5e5735ec` Step 3 / #305→#34). Source: POST 1-2.
4. **[NEW *framing*, fold onto #294/#221 — corp→home-state→industry/EV link]** A
   data hook tying a corporation/HQ event to a state's industry level (and thus
   potentially EV) does NOT exist. Whether this warrants a first-class
   **corporation/company entity** is almost certainly **NO** — these are FLAVOR
   events, not simulated entities (vcczar accepts them as a list, not a system).
   Recommend: model as **flavor events that optionally carry `{homeState,
   industrySector}` tags** feeding the #294 industry layer, NOT a corp object.
   Hand the entity-vs-tag call to human if scoped. Source: POST 1-2 (the
   home-state adds).
5. **[corroborates #206 — modern/era bands]** Era-evo content runs historical →
   modern → Future (NYT 1851 → MTV 1981 → Netflix/Streaming-Wars 2007/2019 →
   "Amazon dominates"), so it needs the under-built modern/Future era bands #206
   records (and the content-stops-at-Biden-2022 limit — these MODERN entries are
   exactly the kind of late-band content #206 says is thin). Source: POST 1.
6. **[corroborates #261 — firing budget]** ~50 corp flavor events in ONE category
   (atop the 1,355 already-flavor events, `b73925a4` POST 23) reinforce the need
   for the per-half-term flavor firing budget / density cap #261 records. Source:
   POST 1.
7. **[corroborates lobby/interest-card cluster]** Media (Hearst/NBC/MTV),
   Big-Oil (Standard Oil/Tarbell), Big-Business (Carnegie/US Steel/AT&T), Finance
   (Bank of Manhattan/Dow Jones) — these corp events imply **national lobby /
   interest cards** that the SHIPPED era-specific `LobbyCardId`/`InterestCardId`
   sets (`types.ts:310-327`) do not include; cf. #294's era-evo→lobby activation
   gate (Wall-St at Buttonwood). Source: POST 1.

## Open questions (for human)

- **IP / real-brand-name risk** (Coca-Cola, Apple, Netflix, Disney-adjacent…) —
  same un-raised concern flagged on the `b73925a4` Flavor-Event Poll; needs a
  human call before shipping real brand names. Not discussed in-thread.
- **Entity vs tag:** model corporations as a first-class entity, or as optional
  `{homeState, industrySector, lobby}` tags on flavor events? (Recommend tags.)
- **"Media/Entertainment" subtype:** add to the #248 33-value enum, or fold into
  an existing value?
