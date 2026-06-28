# Digest — `de64de1a-ampu-currency` ("AMPU Currency")

> **Batch 47, digest-only.** Source: `docs/game/sources/de64de1a-ampu-currency/`
> (1 chunk, 8 posts, ~5.1k chars). Forum topic 1183, started by **@vcczar**
> (designer). Genre: **policy CONTENT thread** (an authoring spec, not a
> playthrough). Status: **near-ratified authoring snapshot** — vcczar opens with
> "I think this looks good for the most part" and POST 2 concurs ("Yep looks
> good"). Era framing cross-checked against `docs/game/historical-context.md`
> (no historian ran this batch).
>
> **Why it matters:** POST 1 is a complete currency-policy tree **organized BY
> PREREQUISITE**, every item carrying an **action-type + era/ideology tag**. It is
> the single purest worked example in the corpus of the **#258 predicate-gated
> content engine** and the **#237 policy-genre framework**: it shows, concretely,
> the shape of the data model a generic policy/legislation system must support —
> chained prereqs, active-institution gates, economic-meter-state gates, and
> active-war/era gates. Preserve the prereq→content structure faithfully; that
> structure *is* the requirement.

---

## 1. Thread shape & provenance

- **POST 1** (@vcczar): the full Currency policy tree (transcribed verbatim in §3
  below), pinging ~25 players for review + "any other Era of the Future ideas."
- **POST 2**: ratification ("Yep looks good") + a joke that "Ban Crypto" being
  item #2 is "starting strong."
- **POSTS 3-8**: community add-on proposals (@ConservativeElector2 + others),
  several **adjudicated by vcczar** (POST 5). These are NOT yet in the tree; treat
  as backlog. See §4.
- This is an **authoring spec**, so there are no post-numbered "rulings in play."
  The one binding **designer ruling** is POST 5 (per-state dollar minting; §4).

---

## 2. Tag legend (decoded)

Each policy carries a tag `X-Yyy`:

- **Action type (`X`)** — who enacts it:
  - **L = Legislative** (a bill / Act of Congress). The bulk of the tree.
  - **P = Presidential** (a Gov/executive action). Only 3 items: Specie Circular
    (P-Dem), Bretton-Woods (P-Ide), Fiat Standard–Nixon Shock (P-Ide). Note
    Specie Circular was historically a **Jackson executive order (1836)** and
    Nixon Shock a **1971 presidential act** — so the L/P split tracks the real
    enactment mechanism, not just flavor. **[inference, high-confidence]**
- **Era/ideology suffix (`Yyy`)** — the era-band (and implied ideological flavor)
  the policy belongs to. Decoded from context + historical-context.md eras:

  | Tag | Expansion | Era band (historical-context §) | Confidence |
  |---|---|---|---|
  | **Ind** | Independence | Founding/Rev 1772–88 (§1) | high |
  | **Fed** | Federalist | 1788–1800 (§2) — Hamilton's Mint/Bank | high |
  | **Man** | Manifest Destiny | 1840–56 (§2.6); "Coinage Act of 1857" sits at the era's tail | high |
  | **Nat** | Nationalism | 1856–68 (§3) Civil War / Reconstruction — Greenbacks, Gold Std | high |
  | **Gild** | Gilded Age | 1868–96 (§4) — Silver/bimetallism fight (Bland-Allison, Free Silver) | high |
  | **Prog** | Progressive | 1896–1932 (§5) — Federal Reserve (1913) | high |
  | **Neo** | Neoliberal | post-1980 (modern); Fiat Standard | **medium** (suffix not in historical-context's era names; inferred from "Fiat Standard" + neoliberal monetary era) |
  | **Ide** | (Era of) Ideologies | modern/postwar band — Bretton-Woods (1944), Nixon Shock (1971), crisis gold-suspension | **medium** (era name appears in other digests' taxonomy; not in shipped enums) |
  | **Fut** | Future | undocumented post-present "Era of the Future" band — Bitcoin ban, Digital/Crypto currency | high (vcczar explicitly solicits "Era of the Future ideas," POST 1) |
  | **Dem** | (Era of) Democracy | Jacksonian 1828–40 (§2.6); Specie Circular (1836) | **medium** (matches the `cc37d770` "Era of Democracy" 1820-start taxonomy; flagged) |

  **Open tag questions (flag to PM):** the exact roster of game era-bands — and
  whether **Neo / Ide / Dem / Fut** are real engine eras or just authoring
  labels — is unresolved here. Shipped code has only `independence | federalism |
  nationalism | modern` (`Era` enum). The suffixes imply a **finer era
  taxonomy** than the build's 4 enums (corroborates the gap-log entry that the
  Gilded/Progressive/Future bands are unbuilt). See §5 delta D7.

---

## 3. The currency tree, BY PREREQUISITE (POST 1, verbatim structure)

This is the data model. Each group = a **precondition**; each line = a gated
policy. Preserve this grouping when modeling #258/#237.

### 3a. `No preqs` (always available)
- **Coinage Act of 1857** (L-Man)
- **Ban Bitcoin and other Cyber Currencies** (L-Fut)
- **Digital Currency Standard** (L-Fut)

### 3b. Preq: `No US Currency active`  *(the 1772 DEFAULT state)*
- **Rely on Spanish Dollar and State Scrip as primary currencies** (L-Ind-Default)
  — explicitly the **default** before any US currency exists.

### 3c. Preq: `Bank of the US` (active)
- **Establish US Mint** (L-Fed)

### 3d. Preq: `Crypto Currency Advocated`
- **Crypto Currency Standard** (L-Fut)

### 3e. Preq: `Bank of North America is active and not privatized`
- **Establish Continental Currency** (L-Ind)

### 3f. Preq: `US Mint` (active) — the standard-selection fork
- **Bimetallic Standard for US Dollar** (L-Fed)
- **Gold Standard for US Dollar** (L-Nat)
- **Silver Standard** (L-Gild)
- **Fiat Standard** (L-Neo)

### 3g. Preq: `Major War` **OR** `Economic Meter is at Panic or Worse` **OR** `Reconstruction is active`
- **Print Greenbacks** (L-Nat)

### 3h. Preq: `Economic Meter at Depression or Worse` **AND** `Gold Standard Active`
- **Temporarily suspend Gold Standard for Fiat during crisis** (L-Ide)

### 3i. Preq: `Rev War Active`
- **Ban the British Pound as Legal Currency** (L-Ind)

### 3j. Preq: `Federal Reserve is active` **AND** `economic meter is at panic or worst`
- **Allow Fed Reserve to Print Currency during crisis** (L-Prog)

### 3k. Preq: `Bimetalism Standard` (active)
- **Silver Purchase Act** (L-Gild)
- **Unlimited Coinage of Silver** (L-Gild)
- **Specie Circular** (P-Dem)

### 3l. Preq: `Many preqs` (vcczar's literal placeholder — chain not yet enumerated)
- **Bretton-Woods** (P-Ide)
- **Fiat Standard-Nixon Shock** (P-Ide)

> **Implicit chain (read off the tree):** `Bank of the US` → `US Mint` →
> {Bimetallic | Gold | Silver | Fiat} → (Bimetallic) → {Silver Purchase /
> Unlimited Coinage / Specie Circular}; and the crisis branch
> {Gold Standard active} → suspend-for-Fiat. So policies **install standing
> institution/standard STATE** (Bank, Mint, Fed, "Gold Standard active",
> "Bimetalism active") that **later policies read as preconditions**. This
> stateful "an enacted policy becomes a predicate other policies gate on" loop
> is the core requirement (see D2).

---

## 4. Community add-ons (POSTS 3-8) — backlog, not yet in the tree

1. **Currency-PEGGING for a small / non-superpower US** (@ConservativeElector2,
   POST 3). If a small US persists into the 20th c., Legis props to **peg the USD
   to the currency of the UK, Spain, France, or (if Germany wins the world wars)
   Germany**, then a **second tier to fully adopt** that currency. **Two tiers**;
   **short-term bad economic effects** in exchange for **later investment unlock
   + relationship/diplomacy boost** with the chosen partner. Explicitly a
   **states-controlled predicate** ("events can be preq'd based on states
   controlled" — i.e. gated on country size / # states held). vcczar did not
   reject this; "Something to consider." → maps to **#221 / #248** (small-US
   branch) and the **diplomacy meter** (`diplomacyAtLeast` predicate already
   exists; the size gate does not).
2. **Amero / North American Currency Union** (POST 3, re-raised POST 8). A
   **Future-era event** creating a Euro-like continental currency. vcczar: "no
   politicians talk about it, but lots of futurists talk about it… more
   Obama-era futurism than present-day." → **#206 (Future band)** content;
   pairs with the L-Fut crypto items.
3. **Per-state dollar minting** (@ConservativeElector2, POST 4) — each state mints
   its own dollar with unique state symbols, Euro-style.
   **★ DESIGNER RULING (POST 5, vcczar):** *"That's already the default at 1772
   and there's 0% chance it would ever go back to that once the US Dollar is made,
   so not going to add that."* → This is the **`No US Currency active` →
   Spanish Dollar + State Scrip** default (3b). **One-way transition:** once the
   US Dollar exists, the per-state-scrip state is **unreachable** (no path back).
   POST 6 counter (state-quarter-style symbols on a common USD) is noted but the
   ruling stands.
4. **Currency-FACE selection** (POST 6-7), modeled like the Mt. Rushmore
   people-picker: choose whose image goes on a bill —
   - "Place image of **1st President** on a bill" (POST 7: *"so we'd have
     **Benedict Arnold dollars** in the playtest?"* — a nod to the `fe15db25`
     federalism run where Arnold was first elected President; historical-context
     §2). 
   - "Place image of **1st Sec Treasury** on a bill."
   - "Place image of **______ (player selects)** on a bill."
   - Real-world hook: Jackson→Harriet Tubman swap; Presidential $1 coins, 50 State
     quarters, commemoratives — **Congress-authorized**, and vcczar notes
     **Governors probably could NOT authorize them** (a level-of-government gate).
5. **National symbols** (POST 7) — not strictly currency: the flag (stars &
   stripes design), **eagle vs. Ben Franklin's turkey** as national bird,
   accept/reject the **Statue of Liberty** gift. vcczar flags this may belong in
   a separate symbols thread ("This may OR may not be the place").

---

## 5. Deltas vs. current build

**Verified against shipped code:** `src/types.ts` (`Predicate` union L1487-1504,
`NationalMeters` L1399-1409, `EraEventResponseEffect` L1448-1457, `Era` enum),
`src/engine/eraGraph.ts` (`evalPredicate` L12-47). **There is NO currency,
banking, Mint, Fed Reserve, monetary-standard, or generic-legislation-content
system in the shipped build** (`Grep` for currency/bank/mint/fiat/specie/Bretton
returns only era-event flavor and committee labels — never a mechanic). The whole
thread is **designed-but-unbuilt**. Specific deltas:

- **D1 — No policy/legislation CONTENT engine.** Shipped `Legislation`
  (types.ts:1506) is a sponsor+committee+vote record whose `effects` are a flat
  `EraEventResponseEffect`; there is **no library of prereq-gated, era/ideology-
  tagged enactable policies**. This whole tree is the canonical spec for **#237**
  (policy-genre framework) + **#258** (predicate-gating). **Requirement:** a
  data-driven policy catalog where each entry carries `{actionType: L|P, era/
  ideology tag, precondition: Predicate, effects}`.

- **D2 — `Predicate` union lacks the THREE predicate classes this tree needs.**
  Today `evalPredicate` (eraGraph.ts:12-47) gates **only era-events**, and its
  leaves are: year, eventCompleted/eventChose, meterAtLeast/AtMost,
  interestAtLeast, diplomacyAtLeast, warActive, warOutcome, stateAdmitted,
  officeControlledByPlayer, rosterHasSkill, flag (+ all/any/not). The currency
  tree requires **three new leaf CLASSES** (strong corroboration of #258 as the
  keystone):
  - **(a) Active-institution / active-policy predicates** — `Bank of the US`,
    `US Mint`, `Bank of North America active & not privatized`, `Federal Reserve
    active`, `Gold Standard active`, `Bimetalism Standard active`, `Crypto
    Currency Advocated`, `No US Currency active`. **None exist today.** The
    closest shipped analogs are *boolean game-state flags* (`constitutionRatified`,
    `articlesOfConfederation`, `governorsExist`) reachable only via the bespoke
    `flag`/`eventChose` leaves — there is **no generic "is policy/institution X
    currently enacted/active" predicate**, and no concept of a policy being
    *privatized* or *repealable* (the `not privatized` qualifier). **This is the
    biggest single requirement.** It implies enacted policies must write durable,
    queryable state.
  - **(b) Economic-meter-STATE (band) predicates** — `Panic or worse`,
    `Depression or worse`. Shipped `NationalMeters.economic` (types.ts:1401) is a
    raw `number`; `meterAtMost` exists but there are **NO named bands** (no
    Panic/Recession/Depression thresholds defined anywhere). **Requirement:**
    either named economic bands (enum/thresholds) or documented numeric
    thresholds that `meterAtMost` can target. (Note historical-context confirms
    real Panics of 1819/1837/1857/1873/1893 — the bands are era-load-bearing.)
  - **(c) Active-war / era predicates** — `Major War`, `Rev War active`,
    `Reconstruction is active`. Partial coverage: `warActive` exists but is
    **hardwired to `revolutionaryWar` only** (eraGraph.ts:31) — there is no
    generic "a major war is active" or per-war predicate, and the `War` type
    (types.ts:1532) is separate from the RevWar system. **`Reconstruction
    active`** has **no representation at all** (the `nationalism` era exists, but
    Reconstruction as a gateable sub-state does not — corroborated by the
    house-divided digests flagging Reconstruction as unbuilt).

- **D3 — Era taxonomy is too coarse.** The suffix set (Ind/Fed/Man/Nat/Gild/Neo/
  Ide/Prog/Dem/Fut) implies **~10 era-bands**; shipped `Era` has only 4
  (`independence | federalism | nationalism | modern`). Gilded/Progressive/
  Neoliberal/Ideologies/Democracy/Future are **unbuilt bands** (matches the
  standing gap-log on Gilded/Progressive). Policy era-tagging needs the finer
  taxonomy (or a year→band mapping). → feeds **#206 (Future band)**.

- **D4 — Law-created institutions are unmodeled (banking gap + #66).** `Bank of
  the United States`, `US Mint`, `Federal Reserve`, `Bank of North America`,
  `Continental Currency` are all **institutions a law CREATES and that then
  persist as state** (and can be **repealed/privatized**). The build has **no
  institution layer** at all. → core input to **#66** (Mint/Fed/Bank-of-US as
  law-created institutions) and the **banking gap**. The `fe15db25` federalism
  run (historical-context §2) already played an ad-hoc "Bank of the US →
  repeal → repurpose" arc by GM fiat, confirming the demand.

- **D5 — One-way / unreachable transitions.** vcczar's POST 5 ruling
  ("0% chance it would ever go back" once the US Dollar exists) is an explicit
  **monotonic state transition**: the `No US Currency active` branch (3b) becomes
  permanently ineligible. The content engine needs to support **terminal/
  unreachable preconditions** (a `not` over an active-institution predicate gets
  this for free once D2(a) lands).

- **D6 — `P` (Presidential/Gov-action) policies vs `L` (Legislative).** The tree
  distinguishes executive actions (Specie Circular, Bretton-Woods, Nixon Shock)
  from bills. Shipped `Legislation` is congressional-only; there is **no
  executive-action policy path**. Plus the POST 6 **level-of-government gate**
  ("Governors probably couldn't authorize" coin programs) implies policies may be
  tagged by **enacting office** (Congress vs President vs Governor).

- **D7 — States-controlled / country-size predicate (community add-on).** The
  currency-pegging proposal (POST 3) needs a **"# states controlled" / "is the US
  a superpower"** predicate that **does not exist** (shipped `stateAdmitted`
  tests one state's presence, not a count or a power-tier). → feeds **#221 /
  #248** (small-US dynamics). Its two-tier peg→adopt with delayed-payoff
  (short-term econ hit, later investment + diplomacy boost) is a **deferred-
  effect** policy shape the flat `EraEventResponseEffect` cannot express today.

- **D8 — Currency-FACE & national-symbols pickers (community add-on).** The
  Mt-Rushmore-style people-picker (face on a bill; flag; eagle-vs-turkey; Statue
  of Liberty) implies a **cosmetic/symbolic selection subsystem** with no current
  analog. Lower priority; note as Future/flavor content (and the cross-link to the
  existing Mt. Rushmore picker referenced in POST 6).

---

## 6. Open questions for the PM

1. **Exact era-band taxonomy & whether Neo/Ide/Dem/Fut are engine eras** — see
   §2 tag table; reconcile with the shipped 4-value `Era` enum and other digests'
   "Era of Democracy/Ideologies/Future" labels.
2. **What enumerates `Many preqs`** (3l, Bretton-Woods / Nixon Shock)? vcczar left
   it as a literal placeholder — the full prerequisite chain for the
   postwar/modern monetary items is **undefined** in-thread.
3. **Economic-meter band thresholds** — what numeric `economic` values map to
   Panic / Recession / Depression? Undefined here; needed for D2(b).
4. **"Crypto Currency Advocated" source** (3d) — what enacts this prereq? An era
   event? An interest-group threshold? Unspecified.
5. **Coinage Act of 1857 = `No preqs` but tagged L-Man (1840-56 era).** Is it
   truly always-available, or is the era tag the *intended* availability window?
   The two seem to conflict (a `No preqs` item with an era tag).
6. Whether **national symbols** (flag, bird, Statue of Liberty) live in the
   currency genre at all (POST 7 — vcczar unsure).

---

## 7. Hand-off framing

Frame all of the above as inputs to: **#258** (THE worked predicate example —
chained preqs + the three new predicate classes: active-institution,
meter-band-state, active-war/era); **#237** (policy-genre content framework);
**#221 / #248** (small-US / states-controlled branch via the pegging add-on);
**#206** (Future band — crypto, digital currency, Amero); **#66 + the banking
gap** (US Mint, Federal Reserve, Bank of the US, Bank of North America,
Continental Currency as law-created, repealable institutions). This is an
**authoring snapshot, near-ratified** (POST 1-2), with five community add-ons
(POST 3-8) of which the per-state-minting one is **ruled out** (POST 5) and the
rest are open backlog.
