# aa227625 — "SC Case Era of the Future Scoring"

**Type:** CONTENT-AUTHORING + DESIGN-SURVEY (NOT a playthrough). GM @vcczar posts the
**Era-of-the-Future SCOTUS case docket** (~45 cases) and asks players to score which are
**"Landmark Tier"** — as big a deal as Roe / Brown / Plessy / Dred Scott. Thread is
explicitly **content-frozen** ("PLEASE DO NOT SUGGEST ANY NEW CASES UNTIL EARLY RELEASE",
POST 1/7) — these are the canonical Era-of-Future cases, not an open brainstorm.
**Scope:** 13 posts / 1 chunk (chunk-001), ~17KB, May 2022 (forum timestamps 5/10/2022).
**Feeds:** #25/E25 (the SCOTUS docket DATA), #52 (who decides cases), #206/#221 (Era-of-Future
content), #218 (Rule of Four). **Two NEW findings:** a case-importance TIER model + a
context-dependent significance (AMPU-2) model.

---

## 1. The Era-of-Future SCOTUS docket (content — the data #25/E25 needs)

vcczar posts a flat list of cases. **The record shape is dead simple:**
**case name** (`Plaintiff v Defendant`) + **the constitutional question** (one sentence).
No outcome, no statute, no tier field, no era tag in the data itself — the era ("Era of the
Future") is **thread-level metadata** (POST 1). This is exactly the docket content that
#25/E25 (`src/data/scotusCases<Era>.ts` + `GameState.scotusDocket`) is specced to hold but
which **does not exist in the build** (verified: no `scotusDocket`, no `ScotusCase` type, no
`scotusCases*.ts` file; shipped court is the `phaseRunners.ts:3397` coin-flip on 4 hardcoded
generic title strings — see §4).

**The full Era-of-Future docket** (initial set, POST 1/7 — ~40 cases):

*Robot / AI personhood & rights (the thematic core):*
- **Advanced Robot Inc v California** — Do constitutional rights apply to robots / AI-guided objects? *(consensus #1, see §2)*
- **Anikan Vader-C v South Carolina** — Can a US citizen lose personhood by becoming more machine than human?
- **Bender v New York** — Can a state ban a person from marrying a robot / heavily-AI-augmented human?
- **Texas v Robot Car Factory Union** — Can a state seek permanent deactivation of robots that accidentally killed humans?
- **Robot Loan Services v Dept of Transportation** — Is involuntary deactivation of robots for transport justified?
- **New Mexico v Lopez** — May an arrestee resist a robot bounty-hunter by means that permanently malfunction the state agent?
- **Mississippi v Gobot Kelly** — Does modifying one's body to become primarily AI legally constitute suicide?
- **Jefferson Bot-C-1826 v United States** — Can a person more robot than human, born/created abroad, gain residency/naturalization?

*Consciousness upload:*
- **Jones v Alabama** — Right to upload one's consciousness to the internet?
- **Quackenbush v Schyster** — Can a state tax those who upload their consciousness?

*Body modification / trans-species:*
- **Dracul v Arkansas** — Can a state prevent modifying one's body with another species'?

*Space / sea colonies & jurisdiction:*
- **Benevolent Citizens Assoc v Texas** — May a state house inmates in prison colonies in space?
- **Florida v Alabama** — Do sea colonies operate under federal (not state) authority, even in historically state waters?
- **Fergus v FAA** — Can the government ban private spaceports?
- **Space Colony v US Courts** — Do federal courts have jurisdiction over US space colonies?

*Crypto / economy:*
- **Televangelist Inc v Future Transactions** — Can businesses mandate that customers use cryptocurrency?

*Animal / environmental rights:*
- **Woodworks Inc v Oregon DEQ** — Can trees be declared to have the same rights as humans?
- **Animal Rights Advocacy v South Dakota** — Does hunting constitute unnecessary cruelty?
- **Fishing Ban Now PAC v Michigan** — Does fishing constitute unnecessary cruelty to sea animals?
- **Maine Lobster Industries v NYC** — Can a city ban a product despite harming a whole industry?

*Speech / 1A / 2A / criminal procedure (carryover-era issues into the future):*
- **Minnesota Justice v City of Minneapolis** — Does advocating to abolish police qualify as advocacy of domestic terrorism?
- **Electronic Warfare v City of San Francisco** — Is a ban on war/violence videogames constitutional?
- **Roscoe v Montgomery Public Schools** — Does punishing racist language violate 1A free speech?
- **Martin v Doe** — Does a masked witness's testimony violate the 6th Amendment?
- **Michigan v Know your Abortionist, Inc.** — Does forced shutdown of a site advocating murder of abortion doctors violate 1A?
- **Weissenberg v City of Provo** — Does involuntary DNA collection violate the 4th Amendment?
- **California v Gooch** — Should the 2nd Amendment apply only to firearms that existed at ratification?
- **Maxwell v Arkansas** — Does executing a death-row inmate diminished by a lightning strike violate the 8th Amendment?
- **Utah v Nelson** — Is a ban on polygamy (state/federal) illegal in all instances between consenting adults?
- **Roe Jr v Wade Jr** — Do abortion bans from prior cases violate a woman's constitutional rights?
- **United States v United States** — Does the US have the authority to dissolve itself? *(GM-flagged favorite, POST 2/6)*

**Final pre-release additions** (POST 10/11/13 — 5 more, closing the content set):
- **Walton-Koch v United States** — Can a business entity (social platform, mega-church, mega-corp) declare itself a sovereign nation? *(GM puts ONLY this one in "Landmark Tier", POST 11)*
- **Skeli v Bernie Bros, Inc** — Can a company buy the rights/secrets of the cancer cure to sell to highest bidders?
- **Robotnik-Robby v Warehouse USA** — Must businesses provide lunch breaks for robot employees that need no rest/food?
- **Data-TNG-B v California** — Can a state deny a robot's request to be modified into a human (partially-tested science)?
- **AmyZahn, Inc v New York** — Is it legal for states to set speed limits for drones?

> Note: spelling drift across reposts (`Woordworks`/`Woodworks`, `Anikan`, `subsiquently`) —
> docket names should be normalized at content-authoring time.

---

## 2. ★ NEW — case-importance TIER model ("Landmark Tier")

**The thread's central new mechanic: SCOTUS cases carry an importance/impact TIER.** The
prompt defines the top tier by analogy — "as big a deal as Roe / Brown / Plessy / Dred Scott"
(POST 1). vcczar names it explicitly **"Landmark Tier"** (POST 11). Players give it a sharper
working definition (POST 9, @ player): a Landmark case is **a ruling that can create or fuel a
political MOVEMENT by itself** — "like how the Roe decision led to the birth of the Pro-Life
movement." That couples the tier directly to the **social-movement system** (#6/#354) and the
charter's movement-spawning content: a Landmark ruling is an event that can SPAWN a faction/
movement, not just nudge a meter.

**Player scoring → the consensus Landmark set** (who flagged what):
- **Advanced Robot Inc v California — the clear consensus #1.** Flagged by every scorer
  (POST 2, 5, 9, 12); POST 9 calls it the single biggest Roe-potential case; POST 4 notes
  "far reaching consequences… could even impact military weapons"; POST 12 "define what it
  means to be a citizen."
- **Strong consensus (3+ mentions):** Anikan Vader-C v South Carolina, Bender v New York
  (personhood / marriage-rights cluster).
- **Multiple mentions:** Jones v Alabama, Dracul v Arkansas, Mississippi v Gobot Kelly,
  Weissenberg v City of Provo, California v Gooch, Utah v Nelson, Space Colony v US Courts,
  United States v United States, Televangelist Inc v Future Transactions, Roe Jr v Wade Jr,
  Texas v Robot Car Factory Union, Fergus v FAA, Jefferson Bot-C-1826 v United States,
  Woodworks Inc v Oregon DEQ, Michigan v Know your Abortionist, Roscoe v Montgomery.
- **GM's own Landmark picks** (POST 2): the 11 above ("biases probably showing… fairly
  permissive"); of the 5 late additions (POST 11) ONLY **Walton-Koch v United States**
  (corporate-sovereignty) is Landmark.

**Design takeaway for the gap log:** the docket data needs **at minimum a 2-tier importance
field** (Landmark vs. lesser/"less influential tier" — the latter term used in POST 9).
Tier is **not binary-obvious**: POST 9 explicitly puts Utah/Weissenberg/Roscoe/Texas-Robot
"in this category, but I could also see them going into a less influential tier" — i.e. tier
is **fuzzy / context-sensitive**, which sets up §3. This is NOT in the build (the shipped court
has no per-case identity at all, let alone a tier).

---

## 3. ★ NEW — context-dependent significance (AMPU-2 model, POST 8)

The highest-design-value post. A player (POST 8) argues a case's importance **should not be a
fixed tier at all** — "it will often depend entirely on the context of the playthrough… public
opinion on almost any of these topics could be vastly different depending on how the country
has developed." Proposed **AMPU-2 solution: national OPINION METERS** that drift over time
based on cumulative policy, and the **significance of a court case is computed FROM those
meters**:

- **Proposed meters:** **Religious Affiliation**, **Fundamentalism**, **Luddism** ("I'm sure
  there's other things that could be tracked").
- **Meters MOVE from sustained policy** (length-of-time a policy is in place, not a one-shot):
  e.g. disproportionately more evolution-over-creationism education legislation → Religious
  Affiliation drifts toward agnosticism/atheism over time; legislation discriminating against
  religious groups → Fundamentalism rises; long-term access to quality education → Luddism
  drops. (This is the same **"policy-genre over time"** dynamic as #237 businesslabor — a
  stateful policy store feeding a meter.)
- **Case significance = a FUNCTION of the meters at decision time.** Worked example
  (POST 8): *Roe Jr v Wade Jr* is huge when religious affiliation is SPLIT + fundamentalism is
  high; it's explosive if the court rules pro-abortion in a high-religion/high-fundamentalism
  country, OR rules anti-abortion in a low-religion/low-fundamentalism country (significance =
  ruling AGAINST the population's drift). Robot/AI-marriage cases (Bender) → keyed to a
  **combination of Luddism + Religious affiliation + Fundamentalism**.

**Flag as aspirational AMPU-2** (the poster's own framing). It's an extension of #25/#52 (the
docket + who decides) crossed with a **new national-meter system** (siblings: the shipped
`NationalMeters`, the #237 policy-genre meters, the enthusiasm/meter election model #18/#51).
It **reframes #2 (the tier model)** as a possible v1 STATIC approximation of a v2 DYNAMIC,
meter-driven significance score. Worth capturing as the design's stated end-state for
"how big is this case."

---

## 4. Relation to existing gaps (mostly corroborating context)

- **#25 / E25 (SCOTUS docket DATA) — this is the Era-of-Future docket content.** E25's shape
  (`src/data/scotusCases<Era>.ts`, era-keyed; `GameState.scotusDocket`) matches what's posted:
  case name + question, era-keyed at thread level. **Content-frozen** ("no new cases until
  release") = this docket is a stable content set to seed E25's Future file. **NEW vs E25:**
  the per-case **importance tier field** (§2) and the **context-dependent significance**
  computation (§3) are not in E25's current scope — E25 is the docket-and-coin-flip-replacement;
  tier + significance are additions on top.
- **#52 (who decides cases) — not exercised here.** This thread is content/scoring only; it
  does not touch the unsettled all-CPU-vs-player-controlled-court question (`dem1820` delay/
  dismiss/vote-by-ideology vs `pop` "vcczar disabled it"). But §2's "Landmark ruling spawns a
  movement" and §3's "ruling-against-the-drift = high significance" both presume an OUTCOME
  per case — so #52's decision mechanism and this importance model are coupled: the engine must
  produce a ruling (conservative/liberal) AND score that ruling's significance.
- **#206 / #221 (Era-of-Future content) — corroborates** that Era-of-Future is a real,
  authored era with bespoke content (here: its SCOTUS docket), reinforcing #206 (Era-of-Future
  is under-content'd in the build / absent from the shipped `Era` enum). The docket is a
  **content-primitive type** (a SCOTUS-case primitive) alongside Legis-Prop/Pres-Action/
  Gov-Action (#221) — a candidate addition to the content-primitive registry.
- **#218 (Rule of Four) — adjacent, not invoked.** Rule-of-Four governs cert/which cases the
  court agrees to HEAR; this thread is about which heard cases MATTER (tier/significance).
  Complementary: docket (#25) → granted by Rule-of-Four (#218) → decided (#52) → scored for
  importance (§2/§3).

## 5. Shipped reality (verified spot-check)

The shipped Supreme Court (`src/engine/phaseRunners.ts:3397` `runPhase_2_5_3_Court`):
**50% chance per turn** of any case; picks a `title` from **4 hardcoded generic strings**
("Property rights vs federal regulation", "Interstate commerce dispute", "Free speech under
wartime laws", "State sovereignty over federal authority"); rules `conservative` vs `liberal`
by **raw justice-ideology count**; nudges `game.partyPreference` by **±0.1**. **No
`scotusDocket`, no `ScotusCase` type, no `src/data/scotusCases*.ts`, no case identity, no
importance tier, no Rule of Four, no era-keyed content, no player input.** So EVERYTHING in
this thread — the docket content, the tier model, the significance model — is 0% shipped.

---

## Candidate gaps for consolidation (consolidation agent owns the gap-log write)

1. **★ NEW — case-importance TIER model.** SCOTUS cases carry an importance/impact tier
   ("Landmark Tier" = Roe/Brown-level, defined as a ruling that can spawn/fuel a political
   MOVEMENT by itself) vs. a lesser tier. Per-case `tier` field on the docket record;
   consensus #1 = Advanced Robot Inc v California (robot personhood). Couples to the
   movement-spawn system (#6/#354). **Extends #25/E25; ties to #52.** Source:
   `scotusfuture` POST 1, 2, 9, 11, 12.
2. **★ NEW (AMPU-2 / aspirational) — context-dependent case significance.** Case importance
   is computed from drifting national OPINION METERS (proposed: Religious Affiliation,
   Fundamentalism, Luddism) that move from SUSTAINED policy over time; significance = a
   function of meter state + the ruling's direction vs. that state (ruling-against-the-drift =
   high impact). Reframes the static tier (#1) as a v1 approximation of a v2 dynamic score.
   New national-meter axis (sibling of `NationalMeters` / #237 policy-genre meters / #18/#51).
   **Extends #25 + #52 + the meter system.** Source: `scotusfuture` POST 8.
3. **Era-of-Future SCOTUS DOCKET content (→ #25/E25, #206/#221).** ~45 authored, content-FROZEN
   Era-of-Future cases (record = case name + constitutional question; era = thread-level key),
   themed robot/AI personhood, consciousness upload, space/sea colonies, crypto, corporate
   sovereignty, US-self-dissolution. The concrete content to seed E25's Future docket file;
   a SCOTUS-case content-primitive for the #221 registry. Names need normalization. Source:
   `scotusfuture` POST 1, 7, 10.
4. **Shipped-vs-designed delta confirmation (→ #25/E25/#52).** Verified the shipped court is a
   coin-flip on 4 hardcoded title strings with no docket/case-identity/tier/Rule-of-Four/player
   input (`phaseRunners.ts:3397`) — docket, tier, and significance are all 0% shipped.
   Corroborating, not new. Source: codebase spot-check + `scotusfuture` whole thread.
