# Digest — "What is the most difficult faction to win with?" (`8b4f8164`)

**Type:** DESIGN-DISCUSSION / difficulty-CALIBRATION thread (May 2024,
politicslounge topic 5405), **NOT a playthrough**. **Batch 54** · 13 posts /
1 chunk. OP **@vcczar** ("Just collecting opinions for research"); key voices
**@vcczar**, **@pman** (the fullest argument), **@Euri**, plus Will/Cal-adjacent
playtesters. References to live multiplayer playtests (the 1948 run "in the
1980s", a "Ted playtest").

**Why it matters:** this is the single most CONCRETE per-faction calibration of
the **difficulty = faction-ideology × era** model (gap **#293**). It does not
invent a mechanic — it supplies the DATA: which factions are favored/shut-out in
which eras, why fringe > center in difficulty, and the **lobby-access asymmetry**
that is part of the faction-difficulty calculus. Almost everything CORROBORATES
or SHARPENS existing gap rows (#293 difficulty model, #306 per-faction
awards/structure, #262 fringe/coverage balance, #247 era-driven state-lean). The
genuinely new deltas are the **era-favorability-WINDOW table per faction** and
the **lobby-card-access-by-faction asymmetry** as explicit inputs to #293.

**Faction naming note (era-aware):** the thread uses the forum's persistent
**Red1–Red5 / Blue1–Blue5** ideology-spectrum labels (Red1 = LW-Pop "lefty red"
… Red5 = RW-Pop/Traditionalist; cross-ref the `8189b724` faction-default table:
Red1=Progressive/Populist/Liberal, Red5=Traditionalist/Populist/Conservative).
★ **The SHIPPED build has NO Red1–Red5 axis** — `Faction.personality` is a
3-bucket `'LW'|'Center'|'RW'` (`types.ts:1297`) and factions are era-specific
named sets (1772, 1856), not a persistent 1–5 ideology ladder. So this thread's
fine-grained Red1-vs-Red5 distinction has no representational home in `src/` yet.

---

## §1. ★ KEY DESIGN FACT — faction = the difficulty selector (reconfirms #293)

- **vcczar (POST 3):** *"Since this game won't have easy, moderate, difficult,
  very difficult — the difficulty levels are SET BY THE FACTION you select."*
  Onboarding corollary: in multiplayer, experienced players take FRINGE factions,
  beginners take MODERATES. (Verbatim-restates the #293 thesis and the b52
  `7d91c4c7` "players choose difficulty via faction" statement.)
- **vcczar single-player concern (POST 4):** the faction-as-difficulty model is
  great for MULTIPLAYER but raises the open question for **1-player-vs-CPU** —
  *"are the hardest factions worthwhile to play OR too difficult for most players
  to find enjoyment from"* (no friends to bail you out). Plus a
  mode-divergence observation: **multiplayer trends to "win elections at any
  cost, with almost no focus on points"; single-player has "a lot more emphasis
  on the points structure."** → the hardest-faction enjoyment question is a
  SINGLE-PLAYER-specific design risk for #293/#114.

## §2. ★ Per-faction difficulty calibration (the substance)

Whole-thread consensus: **Red5 = hardest EARLY/overall by most votes; pman
argues Red1 is the hardest of all** (never gets a friendly era). General laws:
**any Red faction is rough; any FRINGE faction is harder than center-left/
center-right; Blue is rarely shut out.**

| Faction | Difficulty verdict | Era-favorability WINDOW | Why (lobby/era) | Source |
|---|---|---|---|---|
| **Red5** (RW-Pop/Trad) | Hardest EARLY; most-voted hardest overall | Shut out 1800s + first ~25% of game; South SECEDES (takes most Red5 states); Gilded-Age South that fits its ideology is solid Blue; brief 1900s–1920s window, then New-Deal shutout. **DOMINATES post-1974** (New Right / era-of-future draft shift) | Strong in Reconstruction-adjacent late game; **easiest of the Reds to ACQUIRE Big Oil/Big Business/Finance/Big Ag**; can grab **RW Media** card when it matters most | POST 1, 2, 5, 8, 9, 12 |
| **Red1** (LW-Pop, "lefty red") | pman: **HARDEST OVERALL** | ★ The ONLY faction that NEVER gets a friendly era. The few times Red is strong, Red1 is disadvantaged vs the rest of its party; post-1974 Red5 is king while Red1 is "essentially unplayable until you make them a mod faction" | HARD to get Big Oil/Business/Finance/Big Ag (the Red-targetable lobbies favor Red5); no RW-Media access | POST 6, 9, 10, 12 |
| Red1 counter | Euri: Red1 ≈ **Radical Republicans** in Reconstruction | But Reconstruction is SHORT vs 1974→future, and **Mod-Red's Big-Business/Finance cards dominate even that era** (POST 9) | — | POST 7, 9 |
| **Any Red** | Rough | **Shut out of government until ~1850** (barring flukes — e.g. **Silas Wood**), and **again during the New Deal** | — | POST 6 |
| **Blue** (any) | Easiest party-wide | **Rarely shut out — except during RECONSTRUCTION** | — | POST 6 |
| **Fringe (any party)** | Harder than center | Fringe factions always tougher than the **center-right / center-left** factions | — | POST 3, 6 |

Corroborating live-playtest anecdotes: the 1948 run (now "in the 1980s") — Will's
Red5-type faction is "the strongest faction… set up to control the game for the
rest of that playtest," even with the CPU having run it part of the time (POST
10); a "Ted playtest" saw a "100% red sweep in the early eras" before it died
(POST 13) — i.e. Red CAN win early as a fluke, not as the base rate.

## §3. ★ Lobby-access asymmetry (NEW input to #293)

pman (POST 6, 9): **lobby access is part of the faction-difficulty calculus.**
The Red-targetable lobbies — **Big Oil, Big Business, Finance, Big Ag** — are
*much easier for Red5 to acquire and a ton harder for Red1*; **Red5 alone can
grab the RW-Media card** when it matters most. This is presented as a structural
reason Red1 < Red5, not a tuning aside → it implies a **lobby-card-acquisition
weighting that varies by faction ideology**, beyond party.

---

## §4. Build-vs-design (code-verified)

★ **Is there any per-faction difficulty / win-favorability model?** NO.
- `Faction` (`types.ts:1293-1304`) has `id/name/partyId/personality
  ('LW'|'Center'|'RW')/ideologyCards/lobbyCards/interestCards/leaderId/isPlayer`
  — **no `difficulty`, no `favorability`, no per-era field, no Red1–Red5 rank.**
- The only `difficulty` in `src/` is the **Revolutionary War battle tier**
  (`'easy'|'moderate'|'difficult'`, `types.ts:1363`, `revolutionaryWar.ts`) —
  unrelated to factions.
- No achievements/awards system exists (the #306/`7d91c4c7` per-faction-win
  award sub-req is also 0% built).

★ **Does faction-ideology × era affect win odds today?** NO (only emergently via
per-state bias + card-driven bias).
- `calcStateVote` (`phaseRunners.ts:3685-3713`) score =
  `50 + baseLean*5 + partyPref*5 + enthusiasm*2 + pv*0.1 + factionBias +
  traitBonus + noise`. `baseLean = state.bias` (PER-STATE, static — not
  per-faction-era), `partyPref` is a single global scalar, `enthusiasm` is keyed
  by `[ideology][party]`. **There is NO faction-ideology × era favorability
  term.** Era enters ONLY through trait bonuses (`applyTraitElectionBonus`, era
  arg) — not through any faction-era favorability.
- `electionFactionBias` (`phaseRunners.ts:1539-1561`) is **card-driven**: sums
  the faction's interest/lobby cards × current interest-group scores, clamped
  ±3, ×leadership-mul. It carries **no era-favorability and no ideology weight**.
  → The forum's era WINDOWS (Red shut-out pre-1850, Blue-only-in-Reconstruction,
  Red5-dominant-post-1974) would arise only as a byproduct of state-bias +
  party-pref drift, which is **NOT era-scripted by faction** in the build.

★ **The eras the calibration references DON'T EXIST in the build.**
- `Era = 'independence' | 'federalism' | 'nationalism' | 'modern'`
  (`types.ts:1337`). There is **NO Reconstruction, Gilded Age, New Deal, or
  post-1974 / New-Right era** — the entire era-favorability table is keyed to
  eras the shipped scenarios (1772→`independence`, 1856→`nationalism`) do not
  enumerate. So this calibration can't even be expressed against current eras.

★ **Lobby-card-to-faction affinity — partial, COARSE (3-bucket), not per-faction.**
- Lobby cards DRIFT in/out by faction via `ALIGNMENT_RULES` in PR8
  (`phaseRunners.ts:1770-1829`). A faction can ACQUIRE a candidate lobby only if
  its proxy interest-group bucket **matches the faction's own LW/Center/RW
  bucket** (`interestCardBucket[proxy] === bucket`, `:1798-1801`) AND that
  interest group is above the add-threshold. So a RW faction can't pick up an LW
  lobby — the **direction** of the forum's asymmetry exists at the 3-bucket
  level. BUT there is **no finer Red1-vs-Red5 differentiation** (no 1–5 axis to
  differentiate on) and **no ideology-weighted ease-of-acquisition** — within a
  bucket, acquisition is gated only by the interest-group score, identically for
  every faction in that bucket.
- ★ **The forum's modern lobby names are NOT `LobbyCardId` values.** `LobbyCardId`
  (`types.ts:316-320`) is only the 1772/1856 historical set (Patriots, Merchants,
  Planters, SlavePower, NorthernIndustry, Abolitionists, Nativists…). **Big Oil,
  Big Business, Finance, Big Ag, RW Media exist only as INTEREST-GROUP / label
  strings** (`BigOilGas`/`BigAg`/`WallStreet`/`RWMedia`/`LWMedia`/`BigTech`/
  `MilitaryIndustrial` in `factions1856.ts:24-31` `INTEREST_GROUPS`, mirrored in
  `labels.ts:61`) — there are no playable modern lobby CARDS, and no
  modern-era faction set, for the post-1974 calibration to attach to.

→ **Net:** #293's emergent-difficulty model is real but UNMODELED as a surface;
this thread is the richest calibration data for it. None of the era-windows or
the lobby-access asymmetry is representable in `src/` today (no faction-era model,
no Red1–Red5 axis, no modern eras/lobbies, only a coarse 3-bucket lobby gate).

## §5. Open questions (for the human)

- **Single-player hardest-faction enjoyment** (vcczar POST 4): are Red5/Red1
  playable-but-fun in 1-vs-CPU, or do they need a CPU handicap / points-mode
  cushion the multiplayer "win-at-any-cost" mode doesn't? A balance/UX call.
- Should the difficulty surface (#293) bake these **per-faction era-windows**
  explicitly (e.g. a "Red5: brutal until ~1974, then dominant" label), or only
  the coarse ideology×era table already in #293?
- Does the design want **faction-ideology-weighted lobby acquisition** (Red5
  easier→Big Oil/Finance/RW-Media; Red1 harder), beyond today's 3-bucket gate?

---

## Disposition

No new mechanic invented. This is **high-value calibration DATA for #293** plus
two sharper-than-prior inputs. Reconciliation with prior digests:
`8189b724` supplies the Red1–Red5 default-ideology table; `ddd179cb` already
logged the high-level *"Red1 never gets an era to dominate like Red5 does"*
(POST 48-49) and the RW-Trad-strong-post-1980 note — **this thread is the
DEDICATED, granular treatment** (full era windows + the lobby-access mechanism)
and is the citation of record for that calibration. The single-player-enjoyment
framing and the lobby-access-by-faction asymmetry are the freshest contributions.

**Posts cited:** 1–13 (all). Headline ruling POST 3 (vcczar); single-player
framing POST 4; Red1-hardest argument POST 6, 9, 10, 12; lobby asymmetry POST 6,
9; Radical-Republican counter POST 7, 9.
