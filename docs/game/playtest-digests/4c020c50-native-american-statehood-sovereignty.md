# Digest — 4c020c50 "Are there any Native American states that can be admitted?"

**Source:** `docs/game/sources/4c020c50-are-there-any-native-american-states-that-can-be-admitted/` (1 chunk, 4 posts, ~0.8k chars)
**Type:** Native-statehood + Indian-Sovereignty content Q&A (short forum answer; not a playthrough log). Dated Jun 2023 (POST 1 edited 6/23/2023, theFreezerFlame).
**Scope:** Which Native American nations could exist as admittable AMPU states, and the **Indian Sovereignty** status by which a region can *leave* player control and behave like a foreign country.

> **Why it matters:** This is the first source that names the **Native-nation states** as intended roster content (Sequoyah, Lakota, Haudenosaunee, Dinétah) AND describes **Indian Sovereignty** — a mechanic where a region becomes a **foreign-country-like non-player entity, out of the player's control**. That mechanic is the *inverse* of the foreign-annexation-as-conquest gap (#333) and sits alongside the "sell/cede a state" lever (#334): both are regions *leaving* the union, where #333 is a region *joining*. Neither the Native states nor any sovereignty mechanic ships today (only Oklahoma is in the roster; the Six Nations exist merely as a diplomacy nation, not a state).

---

## ★ Candidate Native-nation states (POST 1, 3)

Community-proposed set, with the admission path each was floated under:

| Nation (state) | IRL / admission path (per thread) | Suggested EV |
| --- | --- | --- |
| **Sequoyah** | "Most notable" — **petitioned for statehood IRL** (~1905, the Sequoyah Convention). The flagship candidate. | (not stated — sized like a real state, IRL ~5 counties of Indian Territory) |
| **Haudenosaunee** (Iroquois / Six Nations) | Could be **offered statehood during the American Revolution** (POST 3) — i.e. an early-1772-era admission branch. | (not stated) |
| **Dinétah** (Navajo) | "Would likely just be an **always-3-EV state**" (POST 3) — a fixed small-state. | **3 (fixed)** |
| **Lakota** | Same — "always-3-EV state" (POST 3). | **3 (fixed)** |

Two distinct sizing classes emerge: **Sequoyah/Haudenosaunee** treated as full/normal states with real admission events; **Dinétah/Lakota** as a **fixed-EV=3 small-state class** (never grows with census).

## ★ Indian Sovereignty — a foreign-country-like non-player status (POST 2)

- "**Indian Sovereignty can be granted in most regions.** If that is the case those areas would be **out of the player's control** since it would essentially **act as a foreign country**." (POST 2)
- So this is a **status a region can enter** (grantable across "most regions", not just Native territory) whereby it stops being a player-owned/admittable state and behaves as a **foreign nation** (diplomacy target, outside player control). It is the **inverse of annexation**: a region *exiting* the union to foreign-like status, rather than entering it.
- Left unresolved: what *grants* it (event? law? player choice?), whether it is reversible, and whether it interacts with the diplomacy-nation system that already exists (see below).

## ★ Not in the current roster (POST 4)

- Direct GM answer: "in the current list of states. **No. Sequoyah is not in the list of states, only Oklahoma.**" (POST 4)
- So as of this thread, **none** of the four Native states existed; **Oklahoma** stands in for the whole Indian-Territory region.

---

## Shipped-vs-designed (verified against `src/` HEAD)

- **Roster — confirms POST 4:** `src/data/expansionStates.ts` contains **only `oklahoma`** (`{ id: 'oklahoma', name: 'Oklahoma', abbr: 'OK', region: 'South' }`, `:97`). grep `Sequoyah|Lakota|Haudenosaunee|Dinetah|Dinétah|Navajo` in `src/` returns **zero state entries** — no Native-nation states anywhere in the roster (1772, 1856, or expansion). **Sequoyah/Lakota/Haudenosaunee/Dinétah are 0% built.**
- **No "always-3-EV" small-state class:** every expansion state is stamped with a **flat `electoralVotes: 4, bias: 0`** (`expansionStates.ts:178-179`, the `DEFS.map(...)` seed). There is no per-state EV, no fixed-EV=3 class, and no census-driven EV growth — `admitState` (`engine/territories.ts`) just copies the seed. The Dinétah/Lakota "always 3 EV" idea has no home in the current model. (Matches the b58 flat-EV=4 finding.)
- **★ No Indian-Sovereignty mechanic — 0% shipped (flag):** grep `sovereignty|Sovereignty|indian|Indian|native|Native|tribal|tribe` across `src/` finds **no region-status mechanic**. All hits are unrelated: **"popular sovereignty"** (`eraEvents1856.ts:19` Kansas; `factions1856.ts:6` Pop-Sov Democrats), **"state sovereignty"** (`phaseRunners.ts:3403` an ideology-card string), and Treaty-of-Paris flavor (`GameOverScreen.tsx:10`). **No state can become a foreign-country-like non-player entity today.** The `State.region` enum (`types.ts:1322`) has **no** "Native"/"Sovereign"/"Tribal"/"Foreign" category — sovereignty status is unrepresentable.
- **Haudenosaunee exists only as a diplomacy nation, not a state:** the Six Nations / Haudenosaunee appear as a **1772 era-event treaty + diplomacy counterpart** — Treaty of Fort Stanwix (`eraEvents1772.ts:492-512`, `diplomacy: [{ nation: 'SixNations', ... }]`) and the follow-on frontier-conflict event, plus Hopewell treaties (Cherokee/Choctaw/Chickasaw, `:522+`). So Native nations are modeled *as foreign powers you negotiate with* (a `diplomacy` map keyed by nation name, `types.ts:1454/1574`) — **never as admittable states, and never as a region that leaves player control.** This is the closest existing shape to the thread's ideas, but it is a foreign-relations flavor layer, not statehood and not the sovereignty status.
- **Statehood-during-the-Revolution path:** the Haudenosaunee-during-Revolution admission would ride the 1772 territories/admission pipeline (`engine/territories.ts admitState`); no such Native-admission branch exists.

---

## Delta list (map to EXISTING gap IDs; NEW flagged for consolidation)

- **Native-nation states as roster content** — Sequoyah / Lakota / Haudenosaunee / Dinétah as addable states. Roster-cluster content, adjacent to **#55** (state-roster/apportionment) but **distinct**: these are *pre-1900* Native-statehood additions (Indian Territory / Revolution-era), not the modern annexed roster (Cuba/PR/DC) #55 covers. No existing gap names them. **Likely NEW** (consolidation to assign an ID) — a Native-statehood content item; may fold under the expansion-roster/#55 or the alt-states/expansion cluster. Conservative: flag as **NEW content, map candidate #55 / expansion cluster.**
- **★ Indian-Sovereignty foreign-country-like status** — a grantable region status that removes a region from player control and makes it behave as a foreign nation. **The INVERSE of #333** (foreign-annexation-as-conquest: region *joins* the union) and a sibling of **#334** ("sell/cede a state": region *leaves* voluntarily for fiscal gain). No existing gap covers a region *becoming foreign-like*. **NEW (consolidation to ID)** — likely a sub-item folded under #333 or #334 (the "region leaves player control" cluster), or its own mechanic. **Flag: 0% shipped.**
- **Fixed-EV=3 small-state class** (Dinétah/Lakota "always 3 EV") — no per-state / fixed-EV support today (flat EV=4). Corroborates the b58 flat-EV=4 finding; feeds the census/EV-recompute part of **#55**.
- **Haudenosaunee-during-Revolution admission branch** — an era-gated Native-statehood event on the 1772 admission pipeline; no such branch exists. Ties to the Native-statehood content item + territories/`admitState`.

## Cross-references

- **#333** (foreign-annexation-as-conquest, b59 `501a43f6`) — the direct inverse; reconcile Indian Sovereignty as its mirror.
- **#334** (SELL-A-STATE fiscal↔territory lever, b59 `53f0759d`) — sibling "region leaves the union" mechanic.
- **#55** (53-state alt roster / apportionment / census-EV) — the roster + fixed-EV home.
- **#60** (Canada conquest → era-gated statehood) & the **Canada/alt-states expansion cluster** (`250bd843`) — same "un-modeled territory → new states" pattern (there, provinces; here, Native nations).
- Six Nations diplomacy-nation modeling: `eraEvents1772.ts` Group G (Fort Stanwix / Hopewell) — the existing foreign-relations treatment of Native nations.

## Open questions (for the human)

- What **grants** Indian Sovereignty (event / law / player choice / AI action), and is it **reversible**? Does a sovereign region reappear in the existing `diplomacy` nation system?
- For Sequoyah/Haudenosaunee: full census-sized states, or fixed-EV like Dinétah/Lakota? What EV/bias/era-availability for each?
- Is Native statehood mutually exclusive with Indian Sovereignty for the same region (admit **or** grant sovereignty), and does Oklahoma get split out of / replaced by Sequoyah?
