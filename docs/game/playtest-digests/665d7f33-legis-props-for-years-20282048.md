# 665d7f33 — "Legis Props for years 2028–2048"

**Type:** CONTENT-AUTHORING / brainstorm thread (NOT a playthrough). Era-of-the-Future
legislative-proposal idea dump, incl. **two ChatGPT-generated proposal lists**.
**Scope:** 35 posts / 1 chunk (`chunk-001.md`), ~20KB. Sept 2022 → Apr 2023
(forum: politicslounge.com topic 1510). Participants: **@vcczar** (tier-1),
**@MrPotatoTed** (=Ted, tier-1), and GAs (tier-4): Arkansas Progressive,
Willthescout7, ConservativeElector2, Umbrella, theFreezerFlame, OrangeP47-adjacent.
**Why it matters:** a **primary content-supply source for the Era-of-the-Future band**
(2028–2048+). It directly feeds the #221 3-primitive content backlog (Legis-Props),
the #206 Future-band content hole, the #248 subtype taxonomy, and the #237 policy-genre
framework. Also surfaces a **House-size-cap** datum (POST 34-35). 100% design intent —
**0% shipped** (no authored Legis-Prop pool, no `subtype` field; verified below).

---

## 1. What the thread is doing (the authoring frame)

vcczar opens (POST 1) noting the team's earlier future-proposal work skewed **post-2048**
("we were looking way into the future"), and asks for **near-future** proposals keyed to
+5 / +10 / +15 / +20 years (2027–2042), each framed as "compare the change from
2002/2007/2012/2017 to 2022" — i.e. **extrapolate recent real-policy drift forward**.
2022–2028 is considered "somewhat covered" (POST 2). vcczar repeatedly demands **partisan
balance** — explicitly asks for "pro-GOP legislation for this time also" (POST 7) and a
**GOP environmental platform** (POST 28). The thread is pure proposal-supply for the
Era-of-Future Legis-Prop catalog; vcczar confirms ingestion ("Okay, I added most of these",
POST 16).

**Era framing:** proposals are pinned to a **near-future Era-of-the-Future band**
(2027–2048), distinct from the post-2048 / 2050–2090 deep-future set vcczar separately
wants ChatGPT to generate (POST 31). Corroborates #206/#92: the Future band exists as
authored *content intent* with no shipped `Era` enum value to hold it.

## 2. Proposal categories/genres surfaced (NOT transcribed in full)

The raw lists (human POSTs 3-12, 17, 24; **ChatGPT lists POST 26 [~50 "liberal"] + POST 27
[~50 "conservative/GOP"]**) live in the source thread. They cluster into these **genres**
(map to #237 policy-genre framework / #248 subtype taxonomy):

| Genre cluster | Representative proposals (sample) | Posts |
|---|---|---|
| **Tech / AI / digital** | AI-tech regulation; loot-box-as-gambling; social-media-algorithm regs; VR-porn regs; autonomous-vehicle regs; surveillance-tech regs; next-gen telecom + ban foreign/foreign-gov telecom (5G/6G, TikTok) | 4, 6, 8, 12, 26 |
| **Energy / climate / environment** | EV tax credits; phase-out/ban gas vehicles; hydro-vehicle subsidies; climate-control subsidies; carbon tax; carbon-footprint disclosure; ban offshore drilling; ban factory farming; **GOP-side**: cut renewable subsidies, repeal EPA, deregulate energy/mining | 4, 6, 26, 27, 28 |
| **Abortion / family / social** | abortion at federal (VA/DoD) hospitals; fetal personhood; ban same-sex adoption w/o scrutiny; ban trans athletes; heartbeat/late-term bans; parental consent; defund Planned Parenthood | 3, 10, 27 |
| **Water / resource scarcity** | regulate agricultural/leisure water use, aquifers/watersheds (SW drought); **ban waterparks** to preserve water | 5, 6 |
| **Space / orbit** | regulate private entities in near-Earth/lunar/Lagrange orbit | 6 |
| **Food / bio** | industrial cultured/cultivated ("artificial") meat investment + regs; genetic-engineering regs | 6, 26 |
| **Labor / economy** | UBI; wealth tax; min-wage hike; CEO-pay/golden-parachute limits; paid leave (parental/sick/vacation); women-on-corporate-boards quota; **GOP-side**: flat tax/abolish IRS, corporate/cap-gains/estate tax cuts, repeal Dodd-Frank, work requirements | 11, 26, 27 |
| **Education** | eliminate Dept of Education; school choice/vouchers/charters; ban CRT; school prayer; "neutral" slavery teaching; out students to parents | 10, 11, 26, 27 |
| **Guns** | national concealed-carry / Stand Your Ground; gun-safety subsidies; gun buyback; national gun control | 10, 26 |
| **Immigration / language** | merit/test-based citizenship; border funding/E-Verify; **English as official language** (vcczar: "already in the game", POST 25); voter ID / voter-roll purges | 11, 24, 25, 27 |
| **Health / drugs / vice** | national healthcare; cross-state insurance; assisted suicide; legalize marijuana / psychedelics / prostitution / polygamy; ban menthol-to-U21; multi-level-marketing bans | 4, 11, 26 |
| **Public utilities** | end cost-of-production payments to utilities; net metering enact/repeal; ERCOT reform | 17 |
| **Symbolic / culture-war** | St. Patrick's Day federal holiday (POST 18, real 2023 Fitzpatrick bill); ban flag burning; ban fascist/communist/Nazi symbols; ban pro-China propaganda; ban corporal punishment | 12, 18, 24, 27 |
| **Named-figure platforms** | "what would AOC/Buttigieg/Rubio/MTG/Yang/Gabbard propose in 2040" — esp. **Green New Deal split into ~20-30 separate enforceable bills** (POST 14-15); Taxpayer Bill of Rights | 13, 14, 15 |

**No proposal here clearly demands a NEW subtype beyond the #248 33-value taxonomy** —
all map to existing genres (tech, energy/climate, social, economy, space, etc.). The
**named-figure "platform decomposition"** idea (Green New Deal → 20-30 atomic bills,
POST 14-15) is a *content-authoring pattern*, not a new subtype: it implies primitives
chain into **packages/ladders** (corroborates the escalating-ladder shape from `518fb253`).
The **utilities** and **water-scarcity** clusters are the least-covered by existing
genres — flag as candidate genre/subtype gaps for #248/#237 review.

## 3. ChatGPT-generated provenance + the curation caveat (★)

POSTs 26-33 are explicitly **AI-generated content** (ChatGPT, the free 2023 version):
- Ted generates a ~50-item "liberal" list (POST 26) then, flagged as one-sided, a ~50-item
  "conservative/GOP" list (POST 27). vcczar's process ask (POST 31): compile **only items
  not already in the game**, flag uncertains for him to double-check, and extend to
  **2030/2040/2050/2060/2070/2080/2090** decade sets.
- **Strong curation caveat, designer-attributed:** vcczar (POST 30): ChatGPT "is no real
  intelligence… grabs at information, making factual errors often" — useful only "for
  gaining simple ideas… or just for fun," NOT fact-based research; "I like the idea to use
  it for AMPU issues" (POST 30). Ted (tier-1) "hate[s] ChatGPT" for student-paper cheating
  but endorses it **for brainstorming only** (POST 29, 33).
- **★ Ties directly to the established curation rule** (from `518fb253` #221): low-quality /
  fluff proposals dilute the CPU selection pool ("the computer players might start selecting
  that instead of things that should be more important"). **AI-generated proposals are
  exactly the fluff-risk vector that rule guards against** — they need human vetting before
  entering the catalog, and vcczar's "compile only what's not already in + I'll double-check"
  (POST 31) is that vetting gate in action. Provenance flag for the consolidation pass: any
  Future-band Legis-Props sourced from this thread carry **AI-generated origin** and must be
  human-curated for the importance/realism bar before shipping.

## 4. House-size cap (POST 34-35) — ★ structural datum

theFreezerFlame proposes a **REAL House Act equivalent** (+150 House members; POST 34).
A GA (tier-4) replies (POST 35): *"There's already a lot of house cap options and they can
occur at pretty much any time, options are **100, 435, 500, 1000, or uncapped**."*

- **Floated/known cap options:** 100 / 435 / 500 / 1000 / uncapped. No clear *leaning* —
  framed as a menu of selectable caps that can trigger "at pretty much any time" (i.e. an
  event/legislation-driven chamber-resize, not a fixed constant).
- **Shipped reality (verified):** this is **forum-game / spreadsheet design, NOT the React
  build.** `grep -niE "435|1000|uncapped|houseCap|REAL House" src/` finds NO House-size-cap
  mechanism — the only `uncapped` hit (`phaseRunners.ts:389`) is an unrelated "best-uncapped"
  committee-chair skill rule. The shipped House is the **focus-rep abstraction**
  (`State.representativeIds: string[]`, no chamber-size variable) — see digest `aed35c6e`
  (the House-poll thread, which RESOLVED every-435-vs-focus-reps = KEEP focus-reps).
- **Delta:** the forum game supports a **variable/selectable House-size cap
  (100/435/500/1000/uncapped) triggerable by event/legislation**; the build has neither a
  chamber-size variable nor cap options. This is the chamber-size/apportionment structural
  question (twin of #219 focus-rep proportionality and #34 census/EV). The REAL-House-Act
  proposal (POST 34) is one such resize-legislation Legis-Prop instance (→ #221).

## 5. Shipped-vs-designed (verified against `src/`)

- **Authored Legis-Prop POOL is UNBUILT.** No era-keyed proposal catalog in `src/data/`;
  bills are generated from tiny inline templates (modern proposer in `phaseRunners.ts`),
  not a registry. Corroborates `518fb253` (the #221 3-primitive system is 0% shipped).
- **`Legislation` has NO `subtype` field.** `src/types.ts:1513` ships a 4-value
  `committee: 'Domestic' | 'Foreign' | 'Economic' | 'Justice'` and a 6-value `status`,
  plus `effects: EraEventResponseEffect` and `votes`. There is **no `subtype`** (the #248
  33-value taxonomy is designed-only) and **no policy-genre/state field** (#237 designed-only).
  → the genre clusters in §2 have nowhere to live in the shipped type yet.
- **No "Era of the Future" `Era` value.** The Future band these proposals target is absent
  from the shipped `Era` enum (#206/#92) — doubly-unbuilt: under-content'd AND no enum slot.
- **No variable House-size cap** (§4).

---

## 6. Candidate gaps / deltas for consolidation

*(Map to EXISTING gap IDs. Consolidation agent owns the gap-log edit; this is the hand-off.)*

- **#221 (3-primitive content system — Legis-Prop pool)** — CORROBORATE + SUPPLY. A
  primary **Era-of-Future Legis-Prop content source**: ~12 genre clusters (§2) + two
  ~50-item ChatGPT lists (POST 26-27) vcczar partly ingested (POST 16). Reinforces the
  primitive shape (era-keyed, partisan-balanced, importance-curated) and the
  **package/ladder** pattern (Green New Deal → 20-30 atomic bills, POST 14-15). 0% shipped.
- **#206 (Era-of-Future stub, doubly-unbuilt)** — CORROBORATE. Large Future-band Legis-Prop
  payload (2027–2048, extended to 2050-2090 via POST 31) with no shipped `Era` enum value
  and no authored pool to hold it. Direct content-side confirmation of the Future hole.
- **#248 (33-value legis-proposal `subtype` taxonomy)** — CORROBORATE + STRESS-TEST. All §2
  proposals map to existing genres/subtypes; **no proposal clearly forces a NEW subtype.**
  Weakest-covered clusters to review against the taxonomy: **public utilities** (POST 17),
  **water/resource scarcity** (POST 5-6), **AI/robot personhood-adjacent** (overlaps #221's
  Future docket). Shipped `Legislation` still has NO `subtype` field (types.ts:1513).
- **#237 (policy-genre framework)** — CORROBORATE. The genre clustering in §2 is exactly the
  axis #237 formalizes; utilities + water-scarcity are candidate genres. 0% shipped.
- **#92 (era-as-content-band)** — CORROBORATE. Proposals are era/date-keyed to a forward
  band; vcczar's "compare 2002→2022, extrapolate forward" method (POST 1) is the content-band
  authoring heuristic.
- **House-size cap (chamber-size/apportionment)** — candidate delta, likely maps to the
  **#219 / #34 / #55 House-apportionment cluster** (see `aed35c6e`), but is a **distinct
  sub-question**: a **variable, event/legislation-triggerable House cap**
  (100/435/500/1000/uncapped, POST 35) the forum game supports but the build lacks (no
  chamber-size variable). The REAL-House-Act (+150 members, POST 34) is a resize Legis-Prop
  instance → #221. Flag for the consolidation pass to decide whether this attaches to an
  existing apportionment gap or warrants its own row. **NO new gap number assigned here.**
- **AI-generated-content provenance / curation gate** — refinement to #221's curation rule:
  ChatGPT-sourced proposals (POST 26-27) require human vetting against the importance/realism
  bar before catalog entry (POST 29-31, vcczar/Ted tier-1 caveats). Not a new gap; a
  provenance caveat on any Future-band content traced to this thread.

## 7. Open questions (carry forward)

- Did vcczar's POST 31 ask (decade sets 2050-2090, "only items not already in game") ever get
  fulfilled in a later thread, or do those deep-future Legis-Props remain ungenerated?
- Does the **variable House-size cap** (POST 35) belong to an existing apportionment gap
  (#219/#34/#55) or its own structural row? The build has no chamber-size variable at all.
- How are **multi-bill packages** (Green New Deal decomposition, POST 14-15) represented in
  the #221 registry — as a tagged bundle, a prereq-chain, or independent entries?

---

### Provenance notes
- Single chunk; all 35 posts read. Authoritative signal = tier-1 replies (vcczar POST 1, 7,
  16, 25, 28, 30, 31; Ted POST 14, 29, 33); GA posts are proposals/observations. POSTs 18-25
  drift onto the (real-world) St. Patrick's Day bill; POSTs 26-33 are the ChatGPT exchange;
  POSTs 34-35 are the House-cap exchange.
- Codebase verified at `src/` HEAD on 2026-06-28: `Legislation` type at `types.ts:1513`
  (4-value `committee`, no `subtype`); no House-cap mechanism in `src/` (only an unrelated
  "best-uncapped" rule at `phaseRunners.ts:389`).
- Cross-refs: `518fb253` (the #221 3-primitive authoring source + curation rule),
  `aa227625` (Era-of-Future SCOTUS docket; #248 origin; #206), `aed35c6e` (House-poll;
  focus-reps-vs-435 RESOLVED), `eaf5cc51` (Era-of-the-Future ideas).
