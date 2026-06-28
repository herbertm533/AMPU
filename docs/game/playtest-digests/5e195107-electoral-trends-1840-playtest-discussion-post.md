# Digest — Electoral Trends: 1840 playtest Discussion Post

- **Slug:** `5e195107-electoral-trends-1840-playtest-discussion-post`
- **Source:** `5e195107-Electoral_Trends__1840_playtest_Discussion_Post.csv` (topic 5399, politicslounge.com)
- **Size:** 26 posts, 1 chunk (~9.5k chars). Dates: May 19–20, 2024.
- **Participants:** Arkansas Progressive (OP), OrangeP47, matthewyoung123, vcczar (designer), Willthescout7; pinged Ich_bin_Tyler, pman.
- **What this is:** Out-of-character **analysis thread** for the **OWED OWED 1840-start playtest** (one of the two runs the user flagged as owed). The campaign is a long-running **1840 antebellum → Gilded Age (~1930)** forum game (matthewyoung123 / OrangeP47 / Arkansas Progressive). This thread is the partners discussing **electoral biases/trends** they have observed and posting "Party System" maps; it is a *discussion* post, not the playthrough log itself, so it reads as commentary on emergent mechanics rather than narrative. **Era framing:** see `docs/game/historical-context.md` §2.6 (Jacksonian/2nd Party System, the "Era of Manifest Destiny 1840–1856") and §3/§4 (antebellum → Gilded Age). No historian ran this batch.

---

## Headline finding — TIME-INDEXED (decade-keyed) state biases

The thread's central mechanic: **state partisan bias is tracked as a series that shifts by era/decade**, not a single fixed number. Concrete data the players quote from their campaign's master sheet:

- **Durango (DU), an alt-state:** generally Blue-biased, but the bias drifts by band (POST 11–13):
  - **1840–1870: B+2**
  - **1870–1890: Even**
  - **1890–1930: B+1**
  - Players note it "has gone Whig more often than not" in the most recent 3 elections despite the underlying Blue lean (POST 11) — i.e. the lean is a base that election rolls can override.
- **California split into two alt-states** (POST 2, 5): **Lower California (LC) is blue-biased**, **Upper California (UC) is red-biased**; the two **split their EVs** in close elections ("the states split their winning votes often in close elections"). This is the game's stand-in for a single CA that votes one way — here EV-splitting between two adjacent alt-states.
- **New England votes Whig en bloc** (POST 2, 5): Massachusetts has gone Democrat **only twice** in the whole run — **1880 (Cobb)** and **1908 (Pattison)**. Arkansas Progressive flags this tracks IRL: real MA didn't reliably vote Dem until **1928 (Al Smith** turning out the Catholic/ethnic vote). In this campaign the Dems made "absolutely no efforts" on New England until **1904**, when they put RI Senator **Garvin** on the ticket as VP (POST 5).
- **MN and OR each voted for "their" party only once, on statehood** (POST 10) — newly admitted states behave distinctly in their first cycle.
- Map convention: **darker color shade = more straight-ticket / consistent voting** (POST 9); the maps cover **1844–1856** in the slice shown (POST 9).

**Why this is a delta:** the build models state lean as a **single static scalar `state.bias`** (`types.ts:1324`, range `[-5,5]` per game-mechanics.md:402; consumed by `calcStateVote` at `phaseRunners.ts:3709` plus the ideology-drift `stateBias` term at `phaseRunners.ts:903-906`). The 1856 scenario hand-sets one value per state (e.g. SC −2.4, VT 1.6 per the `fc461242` dynamic-state-leans digest). There is **no decade/era-indexed bias series** in shipped code. The forum game instead runs a **per-state, per-census-decade bias table** — exactly the "Census sheet" data asset documented in the **b44 Passion-Projects digest** (`e07f0cc1`, POST 1/5–7/12: biases rendered as decade-by-decade maps on an `R+4 / D+1` scale; "move slowly" but do change). The two threads describe the same artifact from different campaigns. The `fc461242` brainstorm is the dedicated design thread for converting the static scalar into a decade/era schedule (bias-SETS-per-decade vs. event-keyed modifiers). **This thread is fresh empirical corroboration that the decade-indexed bias is how the game is *meant* to play, with real numbers (DU's B+2 → Even → B+1 walk).**

---

## Era-gated statehood (alt-states + admission gates)

- **Durango (DU):** admitted from Mexican-cession land, held as an **exclave** (no contiguous territory connecting it) (POST 13–15). "Is it the only state ya'll took from Mexico? … you have Durango as an exclave?" — confirmed: DU is the only state taken from Mexico in this run.
- **Baja Sonora:** held as a **territory that cannot become a state until 1916** (POST 15). Rationale given is a **population/era gate**: "The land there is basically Arizona, but worse… and Arizona/New Mexico didn't become a state until 1910ish." Long-term its population is projected to **eclipse Durango's** (POST 15), but in the antebellum/Gilded-Age window it correctly stays a territory.
- This shows the campaign enforces **era-/population-gated admission** for alt-territories — a territory exists on the map but is barred from statehood until a date/threshold is hit. Cross-ref the build's `admitState` (`engine/territories.ts`) and `expansionStates.ts` / `admissionYear` (`types.ts:1330`); whether the build models a *hard year gate that blocks admission until then* (vs. an event/threshold) is the question this raises. Alt-state existence + EV-splitting (LC/UC) and exclaves (DU) are content/geography features the shipped 1772/1856 scenarios don't obviously cover.

---

## ★ Party-rename / party-morphology system — designer-acknowledged tuning gap

The campaign never spawned a "Republican" party, so it is **stuck on Democrats (Blue) and Whigs/Federalists (Red)** decades past where real history realigned (matches `historical-context.md` §2.6's "the game keeps the dead Federalist label alive too long" — here the players note "In 1800 we're still the Federalists," POST 22). The game has **events that rename the parties** when conditions are met, but those conditions have **fired for nobody yet**.

**The prereqs, quoted verbatim by the players (POST 21–22):**
- **Conservative Party** (renames Red): *"The Republican Party does not exist; Red Party leader has the Protectionist Lobby; Blue Party has won **three** presidential elections in a row."*
- **Labor Party** (renames Red, sequentially after Conservative): *"The Red Party is known as the Conservative Party; The Red Party has won **three** presidential elections in a row."*

**Fire chance:** initially stated as "100% going to fire… just a matter of time" (POST 15), then corrected to **50% per check** even once prereqs are met (POST 17). The blocker is the **three-presidential-wins-in-a-row** clause: "I don't think either party has won 3 elections in a row in a while, so that's probably why it's never fired" (POST 22).

**Designer + players explicitly flag this as too restrictive:**
- matthewyoung123: *"Might be too restrictive to get party names"* (POST 22).
- Arkansas Progressive (or partner): *"Yeah, might need to loosen those up a bit"* (POST 23).
- Earlier: *"due to the stringent requirements and low chance to fire, parties will probably never change from Democratic-Republicans and Federalists"* (POST 14).

**vcczar's design rationale (party MORPHOLOGY ruling, POST 24 & 26):** the restrictive threshold is **intentional and historically grounded** — *"Those parties only collapsed because one of those parties dominated so long that they destroyed the rival and themselves. So that pretty much has to happen. There's a chance both of those parties would have survived if they're competitive."* The OP paraphrases: *"So party morphology has to cannibalize itself"* (POST 26). So realignment/rename is **gated behind a 3-win dominance streak** by design — one party must dominate long enough to "cannibalize" itself and the rival before a new party morphology emerges. The tension: the rule is *correct in spirit* but *too tight in practice* (it essentially never fires in competitive games), and the designer agrees it needs loosening.

> **Consolidation note (no gap number assigned here):** capture this as a concrete **designer-flagged balance/threshold gap** feeding the existing party-system / faction-rename gap. The delta is specifically (a) the **three-consecutive-presidential-wins** prerequisite and (b) the **50% fire roll on top of it**, which together make the rename events effectively dead in competitive campaigns. The party-morphology principle (rename requires dominance-driven cannibalization) is the *intended* rule; only the thresholds are flagged for tuning. Cross-ref the broader party-system/faction gaps in the living docs — do NOT mint a new gap # here.

---

## Third-party viability (live but rare path)

- **Weaver (third-party) almost won the presidency** (POST 16, 18, 19): he "did better than he did IRL and **eclipsed Third Party Teddy**" — i.e. outperformed even a third-party Theodore-Roosevelt-style run in this timeline.
- Mechanism: **both major-party candidates "belly-flopped" their election rolls** that cycle ("so bad it was almost divine intervention," POST 19), opening the lane. Weaver himself **failed to roll well**, so he fell short; had he also rolled well he "likely would have won enough additional states to actually get an EV majority" (POST 19).
- OrangeP47 "did the math at the time" and confirms **Third-Party President Weaver was genuinely on the table** — "100% within the realm of possibility… still insanely difficult" (POST 16). Had he won, it would have **triggered party-election chaos** ("all hell would have broken loose with party elections," POST 16) — the rename/realignment machinery keys off who holds the presidency, so a third-party president breaks the two-party assumptions.
- Takeaway: the **election RNG + third-party path is functional**, just low-probability — it needs *both* majors to roll badly *and* the third party to roll well. This is the desired shape (third parties possible but rare), and it stress-tests the party-rename prereqs (which assume a Red/Blue winner).

## Other notes

- **Assassinations have "garbage timing"** (POST 20, 25): "Yates was positioned to be one of the strongest Whigs ever… and then proved it is possible to faceplant into another dimension, and then an **Assassin's bullet**." Confirms an **assassination event** can remove a strong politician at an inopportune moment — a live random event in this campaign (cross-ref any assassination/death event handling in the build).
- The thread also confirms forum admins can **edit topic titles** (POST 4–8 housekeeping: the thread was mis-titled "1848," corrected to "1840") — not a game mechanic.

---

## Deltas vs current build

1. **★ Time-/decade-indexed state bias.** Build uses a **single static scalar `state.bias`** (`types.ts:1324`; `[-5,5]` per game-mechanics.md:402; read by `calcStateVote` @ `phaseRunners.ts:3709` and ideology-drift @ `phaseRunners.ts:903-906`). The forum game runs a **per-state, per-census-decade bias series** — concrete: **DU B+2 (1840–70) → Even (1870–90) → B+1 (1890–1930)**. Same artifact as the b44 Census-sheet maps (`e07f0cc1` POST 6/12). Design home: `fc461242` dynamic-state-leans brainstorm. **Headline requirement.**
2. **★ Over-restrictive party-rename prereqs (designer wants loosened).** Red→Conservative needs *(no Republican Party) + (Red leader holds Protectionist Lobby) + Blue wins 3 presidential elections in a row*; Conservative→Labor needs *Red is "Conservative" + Red wins 3 in a row* — plus a **50% fire roll**. Designer + players agree these are **too tight to ever fire in competitive play** (POST 22–23). Tune thresholds (esp. the 3-consecutive-wins clause) while keeping the intended "dominance-cannibalization" morphology rule. Feeds the existing party-system/faction-rename gap (no new gap # minted here).
3. **Alt-states with EV-splitting & exclaves.** Lower/Upper California (blue/red-biased, **split their EVs** in close races); **Durango** admitted as a Mexican-cession **exclave**. Build's scenarios don't obviously model EV-splitting between paired alt-states or exclave geography.
4. **Era-/population-gated statehood.** **Baja Sonora barred from statehood until 1916** (pop/era gate; "Arizona but worse"). Question whether the build's `admitState`/`admissionYear` enforces a hard year/threshold gate that *blocks* admission until met.
5. **New-state first-cycle behavior.** Newly admitted states (MN, OR) vote distinctly in their first election (POST 10) — possible content/mechanic the build doesn't special-case.
6. **Third-party viability + assassination timing — confirmed working, not deltas.** Third-party president is reachable but rare (needs both majors to roll badly); assassination events can remove strong politicians at bad moments. Logged as corroboration; a third-party president would expose the party-rename machinery's two-party assumption (delta #2).

## Open questions

- Does the build's `admitState`/territory model support a **hard admission-year gate** that blocks statehood until a date (Baja Sonora 1916), or only event/threshold-driven admission?
- Can the build represent **EV-splitting within or between states** (LC/UC), or are EVs winner-take-all per state?
- The exact party-rename **event IDs / fire-chance** in shipped code — verify whether the build even *has* these rename events (the forum's are the source of truth; build status unconfirmed from this thread).
- Are the **DU/LC/UC/Baja Sonora alt-states** part of any shipped scenario's geography, or forum-only content?

## Sources
- `chunk-001.md` (POST 1–26) — sole chunk. Cross-refs: `e07f0cc1` (b44 Census-sheet / time-varying bias maps), `fc461242` (dynamic-state-leans brainstorm — static scalar vs decade sets), `historical-context.md` §2.6/§3 (era framing). Build refs: `types.ts:1324` (`state.bias`), `phaseRunners.ts:3709` (`calcStateVote`), `scenario1856.ts:18-31` (enthusiasm table), `engine/territories.ts` (`admitState`).
