# Digest — AMPU Terminology Change Poll (`b474593e-ampu-terminology-change-poll`)

**Scope:** 43 posts / 1 chunk (chunk-001). **Type:** TERMINOLOGY / DESIGN thread, Sept 2022 (forum 3.0 era). @vcczar (designer) + @MrPotatoTed drive renames of **expertises, industries/lobbies, and traits**; Cal/ShortKing/Vols21/Lars/ConservativeElector2 weigh in. **This is the authoritative SOURCE for several renames already flagged downstream (esp. #216 "Military"→"Army" and "Low Brow"→"Everyman").** Two new sub-threads: a **Celebrity** definition ruling (ties #225) and a **NEW judicial-committee-expertise gap**. No code; pure design intent. Cite `POST n`.

> Shipped-reality check (`src/types.ts`): `Expertise` union (L182-186) ships BOTH `'Military'` and `'Naval'` and `'Justice'` and `'Technology'`; `Trait` union (L62-117) ships `'Celebrity'` but **no** "Low Brow"/"Everyman" and **no** anti-wonk trait; `LobbyCardId` (L316-320) is the 1772/1856 era set only — **none** of the modern industries/lobbies below ("Wall Street", "Big Business/Corporations", "Natural Gas", "Big Tech", "Big Agriculture") exist in the build. So all renames here are DESIGN-INTENT over a NOT-YET-SHIPPED modern-era layer, except **Military→Army** and **Celebrity**, which act on shipped tags.

## Rename decisions (term → new term, disposition)

| Original | Renamed to | Disposition | Source |
|---|---|---|---|
| **Expertise "Military"** | **"Army"** | ★ **AGREED** (Ted proposes, vcczar agrees). Rationale: Navy is also military, so keep Navy/Army split so historical naval officers → Navy and generals → Army; vcczar refuses making it random. Air Force/Marines folding (Vols21) raised, not decided. | POST 5,12,13,16,17,40,41 |
| **Trait "Low Brow"** | **"Everyman"** | **CONSENSUS** (ShortKing proposes; Ted, vcczar/"Agreed", Lars agree). Other options (Commoner, Uninformed, Simplistic, Shallow, Man-of-the-people) rejected as too negative. | POST 4,20,22,23,37,38,39 |
| **"anti-wonk" trait word** | *(undecided)* | **UNRESOLVED.** Candidates floated: Skeptic, Outsider, Anti-establishment, Authentic, Instinctual/Experiential, Anti-intellectual. vcczar wants something leaning "anti-intellectual"; "charisma" framing rejected. | POST 5,7,11,12,13,14,19 |
| **Oil industry** | **"Natural Gas"** | Already changed in-build per vcczar ("I forgot I had made this change"). Note: Ted's alt naming = Industry "Petrochemical" / Experience "Energy" / Lobby "Big Oil & Gas" (not adopted). | POST 2,4 |
| **Agriculture *industry*** | **"Farming"** | AGREED to rename the **industry**, but **keep Expertise = "Agriculture"** (broader than farming) and **keep Lobby = "Big Agriculture"**. (Ted alt: Agrifood/Rural-Agroindustrial Complex — not adopted.) | POST 3,4,8 |
| **"Big Business"** | **"Big Corporations"** | vcczar RULING: it's **Big Corporations**, NOT Wall Street. Rejects Ted's swap (Big Business→Wall Street, Wall Street→Big Banks). "Wall Street stands for the entire financial industry in media lingo." | POST 35,36 |
| **Technology lobby** | **"Big Tech"?** | OPEN — Ted "wondering if" it should be Big Tech. No ruling. | POST 34 |
| **Trait "Celebrity"** | *(kept; not renamed)* | "Renown" floated (Cal) and rejected — vcczar keeps **Celebrity**. See definition ruling below. | POST 27,28,31 |

## Celebrity — definition ruling (ties #225)
vcczar (POST 28,31) + Ted (POST 32) nail the intended meaning:
- **Nationwide recognition ONLY; celebrity transcends a field.** War heroes, sports figures, in-field business/legal fame, and state-level fame do **NOT** qualify (no paparazzi for war heroes). Examples: Trump/PT Barnum/Beyoncé = celebrity; Steve Largent / John Morgan / Herschel Walker = NOT.
- **Origin:** vcczar folded the old separate **"War Hero" trait into Celebrity** (same effect); created Celebrity mainly for Trump (few other electable traits).
- **Earned-celebrity is allowed but disliked** — "I allowed people to earn it even though I personally don't favor that." (Direct corroboration of #225 = celebrity-earned/expiry concern.)
- **House-rule precedent:** Ted **stripped Herschel Walker of Celebrity** in his 2022 playthrough (left him "not obscure"). POST 31,32.
- Open sub-idea (Vols21, POST 39): a **state-level "celebrity"** tier for figures famous only in-state (Walker @ UGA) — not adopted.

## ★ NEW gap — Judicial-committee expertise is too coarse
Vols21 (POST 40) + vcczar/Ted (POST 41,42) surface a design hole in the **committee→expertise mapping**:
- The **Judicial committee grants only "Justice"** expertise, whereas **other committees offer several expertise options**. Players want sub-expertises: **Civil Rights, Constitution, crime, terrorism, immigration.**
- vcczar/Ted ruling: **NOT added as their own expertises.** "Civil Rights is an *interest*, which is different from *experience*"; the other four "could be under judicial, military, welfare, etc but don't exist as their own experience thing." So: acknowledged-but-WONTFIX as separate experiences — but the underlying complaint (Justice-only judicial track) is explicitly conceded ("never been happy with how Judicial committee is just Justice").
- ShortKing (POST 42) defends the status quo as flavor: junk judicial assignments simulate undesirable committees / punishing minority factions.
- Bonus mechanic confirmed (Ted, POST 43): **Senate Judicial committee approves Supreme Court nominees.**

## Other notes
- vcczar will issue a **follow-up poll** (POST 18) and intends to **re-map which traits are gained where** to match the (3.0) trait descriptions (POST 26) — Ted reviewed the 3.0 trait descriptions (POST 24).
- "Martial" floated as the *skill* name with "Arms & Armor"/"Warplanning" as the experience (Ted, POST 4) — not adopted; the Army rename won instead.

## Candidate gaps for consolidation
*(For the consolidation agent — this digest does NOT touch game-context.md / roadmap.md.)*

1. **#216 SOURCE / CONFIRM — Expertise "Military" → "Army"** (CORROBORATING + authoritative source). vcczar AGREED (POST 5,13,16,17). Acts on the shipped union `types.ts:185` which has both `Military` and `Naval`. This is the definitive ruling behind the previously-flagged #216/#240 "Military"→"Army" rename.
2. **#216 SOURCE / CONFIRM — Trait "Low Brow" → "Everyman"** (CORROBORATING + authoritative source). Consensus (POST 22,23,38). Note shipped `Trait` union has neither name — Low Brow is a 3.0/modern-era trait not yet in the build.
3. **#225 CORROBORATING — Celebrity = nationwide-only, earned-but-disliked, War-Hero folded in, Walker house-rule strip.** Definition ruling (POST 28,31,32). Directly supports #225 (celebrity earned/expiry).
4. **NEW — Modern industry/lobby rename set** (forward-design; NONE shipped in `LobbyCardId`): Oil industry = **Natural Gas**; Agriculture *industry* = **Farming** (keep Agriculture expertise + Big Agriculture lobby); **Big Business = Big Corporations** (NOT Wall Street; Wall Street = whole financial industry); Technology lobby → **Big Tech?** (open). POST 2,3,34,35,36.
5. **★ NEW — Judicial-committee-expertise gap** (committee→expertise mapping). Judicial committee grants only `Justice`; other committees grant several; players want Civil Rights/Constitution/crime/terrorism/immigration; designer concedes the coarseness but WONTFIX-es them as separate *experiences* (interest ≠ experience). Sub-fact: Senate Judicial approves SC nominees. POST 40,41,42,43.
6. **NEW (open question) — "anti-wonk" trait name still undecided** (Skeptic/Outsider/Anti-establishment/Authentic/Anti-intellectual). No shipped anti-wonk trait exists. POST 5-19.
