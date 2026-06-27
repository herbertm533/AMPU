# Digest — 4266d56e-revamping-politician-value ("Revamping Politician Value")

**Type:** DESIGN thread (PV / trait-valuation spec). 99 posts / 2 chunks. Feb 2023.
**Cast:** vcczar (tier-1 designer/GM), MrPotatoTed (tier-1), OrangeP47 (the de-facto math/coder voice), Cal, jnewt, Murrman104, Willthescout7, ShortKing, Rezi, et al.
**One-line:** vcczar re-evaluates every trait/ability's **Politician-Value (PV) point contribution** on a fixed bucket scale (25/10/7/3 / −3/−7/−10, plus ±25 extremes). Multiple players post full rankings; **vcczar posts his own (POST 33)** = the tier-1 disposition for this thread. The thread then pivots to *display scaling* (0-100 vs 0-200 vs raw "pink") and **ends UNRESOLVED / handed off** (POST 95-99: vcczar steps back, "new GM" Will takes over 1772). **Caveat:** uses OLD forum trait vocabulary — many names do NOT match the shipped `Trait` union (see §6 naming-drift, a hard delta).
**Why it matters:** PV is core — `pv.ts` `computePV`/`refreshPv`; "PV drives elections — change it carefully" (CLAUDE.md). This thread is the **designer-authoritative spec** for what each trait SHOULD be worth; the shipped formula uses a flat ±4/−5, which this thread explicitly supersedes.

---

## 1. Headline deliverable — the trait→PV point-value table

**Scale (POST 1, vcczar):** `25` most-ideal · `10` wholly positive · `7` mostly positive (< a 10) · `3` mixed-bag-net-positive · `−3` mixed-bag-net-negative · `−7` mostly negative (< a −10) · `−10` wholly negative · `−25` absolute worst. OrangeP47 (P2, P7-9) objected the 10→25 jump "breaks math" (ratio inflation → small traits become noise); vcczar (P3) said the **numbers are placeholders, the RANKING/tier is the point** — OrangeP47 would fit a proper formula afterward. So treat buckets as **tiers, not final coefficients.**

**Authoritative column = vcczar's own list (POST 33).** "Community" column = the convergent value where MrPotatoTed(P19)/Cal(P31,P40)/Murrman(P32)/jnewt agree or the modal proposal; divergences noted. vcczar caveated even his own list: *"I disagree with just using 25,10,7,3,-3,-7,-10,-25… but this gives you an idea how I'd group them"* (P33).

### Abilities (per-point; first point worth more — see §2)
| Ability | vcczar P33 | Community modal | Notes |
|---|---|---|---|
| Command (per level) | **25** | 25 (1st), +5 each after (Cal P32/P40) | Universally #1. Tied to the "restrict who's born with Command" fight (§4). |
| Legislative | 7 | 10 (Ted/Cal); 15 (P51); 25 (P43) | Most-contested ability. |
| Governing | 7 | 10 (Ted); 7 (Cal) | |
| Military | 3 | 5-7 | |
| Judicial | 7 | 5 (Ted/Cal); 3 (Cal P40) | jnewt/Cal: judicial 1≈5, "least fleshed-out ability" (P36). |
| Administrative | 7 | 10 — **but +10 starting at the 2nd point** (jnewt P35, "cabinet-eligible at 2"); Cal: 3 then 10 | Admin/Military "1" doesn't cross the viability bar like other skills (P36). |
| Expertise (each) | 3 | 2-3 | |
| Interest (each, e.g. RW/LW Activist) | 7 | 5 — **but Media interest = 7** (Ted/Cal) | |

### Traits (vcczar P33 authoritative; community range for context)
| Trait (forum name) | vcczar P33 | Community range | Disposition / notes |
|---|---|---|---|
| Iron Fist | **25** | 3 → 25 | vcczar/Cal/Murrman = 25 ("most valuable", P34). Ted/jnewt = 10. **Wide split.** |
| Kingmaker | **25** | 10 | vcczar 25; everyone else 10/15. |
| Leadership | **25** | 3-10 | vcczar 25; others 7-10. |
| Magician | **25** | 3-10 | vcczar 25; others 3-10. |
| Teflon | **25** | 1 → 10 | vcczar 25; P51 = +1; Ted/Cal = 10. **Huge split.** |
| Master Kingmaker | **25** | 25 (consensus) | One of the few near-unanimous 25s (+ Iron Fist). |
| Charisma | 10 | 7 → **25** (Cal P40: "AI should value — makes excellent party leaders") | |
| Celebrity | 10 | 3 (Ted) → 15 (P51) | |
| Debater | 10 | 7 (modal) | |
| Efficient | 10 | 10 → **15** (Cal/Murrman) | |
| Likable | 10 | 5-7 | |
| Manipulative | 10 | 7-10 | |
| Orator | 10 | 7 (modal) | |
| Propagandist | 10 | 5-7 (most) → 10 (P51) | |
| Military Leader | 7 | 3 (modal) | |
| Integrity | 7 | 5-7 | |
| Hale | 7 | 7-10 | |
| Cosmopolitan | 7 | 3 (modal) | vcczar higher than field. |
| Provincial | 7 | 3 (most); **−3** (P43) | Sign disagreement. |
| Bookkeeper | 7 | 3 → 10 (P51) | |
| Crisis Manager | 7 | 3 (most) → **25** (P51); Cal: "≈neutral, too rare" | |
| Crisis Gov | 7 | 3-5 | |
| Crisis Admin | 7 | 3 → **10** (Cal/Murrman: "only crisis trait likely to fire") | |
| Decisive General | 7 | 3-5 | |
| Egghead | 3 | 5-7 | |
| Puritan | 3 | 3 (modal); **−7** (P43) | Sign disagreement. |
| Geostrategist | 3 | 3 → 10 (P51) | |
| Domestic Warrior | 3 | 3 → 10 (P51) | |
| Harmonious | 3 | **−3** (Cal/Murrman: "prevents inter-party conversion targeting") | Sign flip — Cal says it's a drawback. |
| Everyman | 3 | 3-5; −3 (P43) | |
| Micromanager | 3 | −3 (Ted/Cal/jnewt); +3 (vcczar/P43) | vcczar treats positive; field negative. |
| Lawful (/Cop) | 3 | 10 (P51) | |
| Jurisprudence | 3 | 3 → 10 (P51) | |
| Union Loyalist | 7 (guess; "haven't played CW") | 7 → 10 (P51); 3 (P43) | Several admit not knowing what it does. |
| Frail | −3 | −7 (most); **−25** (P43); −10 (P51) | |
| Numberfudger | −7 | −3 (most); +3 (P43) | Sign disagreement. |
| Disharmonious | −7 | −5 to −10 | |
| Naive Strategist | −3 | −3 (consensus) | |
| Lackey | **−10** | −3 (most) → **−20** (P51) | The trigger trait — a typo tanked Lackey PV (§3). |
| Carpetbagger | −3 | −7 (most); +1/+3 (P43/P51) | |
| Late Bloomer | 0 | "does nothing mid-game" (Ted/Cal P52: career-track only) | **Career-track only — 0 PV justified.** |
| Overeager | 0 | −3/−5 (Cal/Murrman: "leaves track early"); +7 (P43) | Career-track only. |
| Delegator | −3 | −3 (most); +1/+3 (P43/P51) | |
| Illicit | −3 | −3 (most); vcczar "don't remember what it does" | |
| Domestic Apathy | −3 | −3 (consensus) | |
| Uncharismatic | −10 | −7 → −10 | |
| Unlikable | −10 | −7 (most) | |
| Pliable | −10 | −7 to −10 | |
| Controversial | −10 | −7 to −10 | |
| Incoherent | −10 | −7 → −20 (P51) | |
| Obscure | −10 | **−3 (Ted/Cal: "≤10% ever affected")** → −15 (P51); vcczar −10 | **Live design debate P37-39** (see §5). |
| Two-faced | −10 | −7 → **−25** (Cal P40) | |
| Flipflopper | −10 | −7 → **−25** (P43/P51) | |
| Passive | −10 | −3 (P43) → −25 (P51) | |
| Predictable | −10 | −1 (P51) → −7 (most) | vcczar harsher than field. |
| Easily Overwhelmed | **−25** | −25 (consensus); −10 (P43) | Near-unanimous worst. |
| Incompetent | **−25** | −25 (consensus); −10 (P43/P51) | Near-unanimous worst. |

**Count:** ~8 abilities + ~57 traits valued (≈65 line-items). **Near-unanimous extremes:** +25 = Master Kingmaker; −25 = Easily Overwhelmed, Incompetent. **Most-contested:** Iron Fist, Teflon, Crisis Manager, Obscure, Harmonious/Micromanager/Numberfudger (sign flips).

---

## 2. PV philosophy / weighting

- **Designer mental model (vcczar P41-42):** PV is modeled on **Romance of the Three Kingdoms** + **Madden** overall-ratings — a single glance number ranking historical figures. Confirmed needed **for AI even if hidden** (OrangeP47 P42; jnewt P59: hide from players, keep for CPU).
- **First-point-worth-more rule (Cal P32/P40, jnewt P35):** the 1st point of an ability is worth more than later points (e.g. Command 25 then +5; Legislative 10 then +3). **Admin is the exception** — its 1st point is near-worthless; +10 should start at the 2nd point (cabinet-eligibility threshold, jnewt P35). Same logic for Military (P36: "1 admin/military guy = absolute trash"). **This is a non-flat per-point curve the shipped flat `skill × weight` does not model.**
- **"Wholly positive" (10) vs "mostly positive" (7) vs "mixed bag" (±3):** a 3-pt trait has real downsides; ±3 is the "net but marginal" band. The point of large buckets: differentiate rockstars from filler (Ted P10/P18: avoid the Madden trap where 70s are dead weight).
- **Scale calibration was the real fight, never resolved (see §7):** vcczar wanted "avg pol = 50 on 0-100" (P16) → Ted (P18) and jnewt (P29,P59) pushed back ("artificial inflation, rockstars should tower"). OrangeP47 floated 0-200 (P20). Negatives bother vcczar/Ted "like nails on a chalkboard" (P88) → fix = add a flat `+X` floor offset so the min = 0 while keeping granularity (P90-91).

---

## 3. The actual trigger + cross-references

- **Trigger (Rezi/Cal P13):** *"there's a typo in the formula that tanks PV for someone with Lackey"* — a Lackey carrier was being over-penalized. The revamp rode along: "the actual use of each trait has changed since the formula was first created" so values were re-evaluated wholesale.
- **★ Trait-EFFECT changes are in a DIFFERENT thread (not in this batch):** POST 1 — *"I made some adjustments to what these traits **do**, so see the **Groupthinking the Political Value** thread to see those changes."* This thread is the *point-value* pass; the *effect* changes live in the "Groupthinking the Political Value" thread. **Flag for consolidation: that companion thread is the authoritative source for trait EFFECTS and is NOT yet ingested.** Within this thread, the only effect facts stated are incidental: Late Bloomer/Overeager = career-track-only (P52), Harmonious prevents inter-party conversion targeting (Cal P32/P40), Overeager may pull a pol off a career track early (Cal P31).

---

## 4. Tied sub-debate — "restrict who's BORN with Command"

A recurring (admittedly perennial — P46-47 "death, taxes, debate on pols being drafted with command") fight bolted onto this thread because Command = +25:
- **Proposal (Ted P12):** only **real-life nominees** should be born with 1 Command — to stop nobodies (Richard Ojeda, Lawrence Lessig) getting a +25 windfall from a token presidential run. Cal (P34) offered to supply convention-ballot/primary data to set the bar ("nominee" vs "competitive").
- **Opposition (OrangeP47 P46-48, Bushwa/others):** "vehemently oppose" — puts the game "on rails," kills alt-history fun, shrinks fanbase. P45/P49/P50: restricting Command **breaks modern-start scenarios** (not enough Command pols to field presidential candidates) and **breaks the 3rd-party-run rules** (which key off Command) — and the "earn command" house rule is **untested vs a 3rd-party trigger**.
- **Disposition:** UNRESOLVED in-thread; surfaces as a live tension, not a ruling. (Relates to existing draft/Command gap rows.)

---

## 5. Notable rulings / data points

- **Obscure debate (P37-39):** Cal wanted Obscure = high penalty (−10) to make non-Obscure pols rise; Ted argued Obscure only matters for ≤10% of a faction's pols (faction-leader/President eligibility) → over-penalizes everyone for a rare case (−3). Both agreed the *right* fix is **bonus points for LACKING a trait** ("opposite of Obscure"), which the additive-only model can't express. **Open design idea: per-trait "absence bonus".**
- **vcczar's model run (POST 55) — sample PV at draft under his P33 values (RAW, no scaling):** Napoleon **341** (highest in game), Jefferson 201, Henry Clay 197, T. Roosevelt 184, FDR 171, LBJ 170, Jackson 166, Franklin 161, Lincoln 152, Washington 144, Blaine 130, JQ Adams 79, Trump 72, Biden 50, Hulk Hogan 0, JFK Jr **−5**, … John Payne Todd **−34**. (Why Napoleon tops everything: P60-61 — only joins post-exile, huge Command+Military, born-Leadership, Charisma, Iron Fist.)
- **★ Theoretical PV bounds (vcczar P64):** under the P33 spec, **highest possible ≈ 648, lowest ≈ −79** (later refits show wider, e.g. −209/688 P66, −418/1376 P91 as buckets shifted). The realistic ceiling is far lower — "no pol would ever hit that" (P65).
- **Confirms top-of-game ranking (P59-60):** **Napoleon #1, Jefferson #2** are the two strongest pols in the game (designer-confirmed).
- **JFK case (P15):** the motivating example — JFK has standout rare traits (Charisma/Orator/Likable/Debater/Teflon) dragged to PV 34 by Controversial/Frail/Pliable, tying him with nobodies; the revamp should make rare standout traits **outweigh** mild negatives so the CPU covets him.

---

## 6. ★ Shipped-vs-designed deltas (for tech-lead)

The shipped `pv.ts` `computePV` diverges sharply from this spec:

| # | Shipped `pv.ts` today | This thread's design intent | Delta / requirement |
|---|---|---|---|
| D1 | **Flat trait values: every POSITIVE = `+4`, every NEGATIVE = `−5`** (`pv.ts:76-77`). | **Per-trait tiered values** (25/10/7/3/−3/−7/−10, ±25 extremes) — the entire point of the thread. | Replace flat ±4/−5 with a **per-trait point table** (vcczar P33 = authoritative tiers). This is the headline build ask. |
| D2 | Skills are **flat `skill × officeWeight` then ×4** (`pv.ts:70-73`) — every point worth the same. | **First-point-worth-more curve**; Admin/Military 1st point ≈ worthless, Admin +10 from the 2nd point (cabinet bar). | Add a non-linear per-ability curve (esp. Admin/Military thresholds). |
| D3 | `command * 10` flat per level (`pv.ts:74`). | Command per level worth **+25** (1st), +5 each after (Cal); the single highest-value attribute. | Re-weight Command (≈25/level vs shipped 10) + decreasing-returns; relates to the "who's born with Command" restriction debate (§4). |
| D4 | **`Kingmaker` hard-coded `+6`** on top of its POSITIVE `+4` (`pv.ts:79`) — i.e. Kingmaker ≈ +10 effectively, but as a one-off special-case, not table-driven. | Kingmaker = 10-25 tier; Master Kingmaker = 25. | Fold Kingmaker/Master-Kingmaker into the table (drop the magic `+6`); Master Kingmaker not separately weighted today. |
| D5 | Office prestige, faction-leader `+8`, age penalties (>70, <30), `flipFlopperPenalty*5` are all in `computePV` (`pv.ts:80-87`). | Thread scopes **traits+abilities only**; says nothing about office/age/FF terms (those come from elsewhere — the P55 numbers are "at the draft," i.e. pre-office). | Office/age/FF terms are **out of scope of this spec** — keep but don't conflate; the trait table is additive to them. Note `flipFlopperPenalty` ≈ the Flipflopper trait penalty the thread also values (don't double-count). |
| D6 | `computePV` clamps to **`Math.max(0, …)`** (`pv.ts:88`) — negatives already floored to 0. | vcczar/Ted want negatives gone too (P88) — fix via a **flat `+X` floor offset** to preserve granularity (P90-91), NOT a hard clamp (a clamp loses ordering among bad pols). | Consider replacing the `Math.max(0,…)` clamp with a **constant offset** so sub-zero pols keep relative ordering (the CPU needs it; P57/P88). |
| D7 | **No PV display-scaling layer** — `pvCache` is the raw number, shown as-is. | Long debate over 0-100 / 0-200 / %-of-Napoleon / %-of-best / raw ("pink") presentations (P66-91). **Consensus leaned "pink" (raw) for human display** (P75-85: scaled views bunch pols too close, e.g. Santos 22 vs Biden 28); yellow/0-200 only acceptable if **AI-only**. | If PV is shown to players, the design preference is **raw (no 0-100 normalization)**; a normalized scale is acceptable only for a hidden/AI value. **UNRESOLVED** (no final vote). |
| D8 | **Trait NAMING DRIFT (hard delta).** Shipped `Trait` union (types.ts:62-117) does NOT contain: `Easily Overwhelmed`, `Disharmonious`, `Pliable`, `Lackey`, `Bookkeeper`, `Geostrategist`, `Teflon`, `Lawful`/`Cop`, `Illicit`, `Incoherent`, `Everyman`, `Late Bloomer`, `Jurisprudence`, `Military Leader`, `Union Loyalist`, `Flipflopper`(→`Flip-Flopper`), `Two-faced`(→`Two-Faced`). Shipped-only traits absent from this list: most `PR4b`/`PR6` traits (`Likable`✓ but `Uncharismatic`✓; `Cosmopolitan`✓/`Provincial`✓ present; `Crisis Admin`/`Crisis Gov`✓; but `Decisive General`✓; missing here: `Nationalist/Globalist/Reformist/Loyal/Ambitious/Opportunist/Impressionable/Scandalous/Corrupt/Traitor/Outsider/Domestic Apathy`✓…). | The 2023 forum trait vocabulary ≠ the current code vocabulary — the game's trait set was **renamed/reworked** between this thread and today. | **Before applying any value from this table, the tech-lead MUST map forum trait names → current `Trait` union** (some are renames: Flipflopper→Flip-Flopper; some are gone: Teflon/Lackey/Bookkeeper/Geostrategist/Easily Overwhelmed/Incoherent/Pliable/Disharmonious; some shipped traits had no 2023 value: the whole `Nationalist/Globalist/Reformist/Loyal/Ambitious` axis). Treat the table as **tiers to re-map**, not literal keys. |

---

## 7. Resolution status — UNRESOLVED / handed off

- The **trait/ability tiering** has a clear tier-1 anchor (vcczar P33) but vcczar himself disowned the exact numbers (P33) and OrangeP47 never delivered the promised fitted formula in-thread.
- The **display-scale vote** (pink/yellow/orange/0-200) was **never finalized** — multiple "I prefer pink" posts (P75-85), Ted's one hard demand "no negative numbers" (P88), but **no poll was run / no decision locked**.
- **Thread dies on handoff (P95-99):** Bushwa777 (P95) "we cannot move forward in 1772 unless it is [decided]"; vcczar had stepped back; **"the new gm did not want to" use the old version** (P97) and **Will took over 1772** (P98-99). So this PV revamp was **left undecided** when the thread closed.

**Net:** treat vcczar's P33 tiers as the **designer-authoritative trait-RANKING** (high confidence on extremes, medium on the contested middle), and treat both the **exact coefficients** and the **display scale** as **open** (the build is free to fit/calibrate — that's exactly what OrangeP47 was deferred to do).

---

## Candidate gaps for consolidation (for the consolidation agent)

> Scope note: digest-only run; I did NOT edit game-context.md. The following are proposed deltas. No existing gap-log row was found for the PV trait-value spec — these appear NEW; cross-refs to PV-adjacent rows (#18, #51, #184/DH-72, #192) noted.

1. **NEW — Per-trait tiered PV table replaces flat ±4/−5** (`pv.ts:76-77`). Designer-authoritative tiers = vcczar POST 33; ~65 line-items. **The headline reconciliation: shipped `computePV` ignores per-trait value entirely.** (D1) — pairs-with the PV mentions in #18/#51 but is a distinct *trait-valuation* gap. `GM⇒App` (PV is the CPU's draft/leadership heuristic).
2. **NEW — Non-linear per-ability PV curve (first-point-worth-more; Admin/Military thresholds).** Shipped is flat `skill×weight×4` (`pv.ts:70-73`). (D2) — jnewt/Cal P32/P35/P36/P40.
3. **NEW — Command re-weight (~25/level, decreasing returns) + the "restrict born-Command to nominees" tension.** Shipped `command*10` flat (`pv.ts:74`). (D3, §4) — relates to existing draft/Command gap rows; the restrict-Command fight is UNRESOLVED and breaks modern-start + 3rd-party rules (P45/P49/P50).
4. **NEW — Drop the hard-coded `Kingmaker +6` magic number; table-drive Kingmaker + Master Kingmaker** (`pv.ts:79`). Master Kingmaker (consensus +25) is not separately weighted in the build today. (D4)
5. **NEW — Negative-PV handling: replace `Math.max(0,…)` clamp (`pv.ts:88`) with a constant floor-offset** so the CPU keeps ordering among bad pols (P57/P88/P90-91). (D6)
6. **NEW — PV display-scaling layer is UNRESOLVED design;** designer lean = **raw ("pink") for human display**, normalized only if AI-hidden (P66-91). No final vote. (D7) — sharpens the PV-presentation side of #18/#192.
7. **NEW (hard, blocking) — Trait-name reconciliation: 2023 forum trait vocabulary ≠ shipped `Trait` union.** ~15 forum trait names are renamed or gone (Teflon/Lackey/Bookkeeper/Geostrategist/Easily Overwhelmed/Incoherent/Pliable/Disharmonious/…; Flipflopper→Flip-Flopper). **Any value-table application MUST map old→new names first.** (D8) — affects the whole table.
8. **CROSS-REF (NOT in this batch) — companion thread "Groupthinking the Political Value" holds the authoritative trait-EFFECT changes** (POST 1). Flag as an un-ingested source the consolidation/roadmap should chase for what traits actually DO (this thread only sets their POINT VALUES). Effect facts captured incidentally here: Late Bloomer/Overeager = career-track-only (P52); Harmonious blocks inter-party conversion targeting (P32/P40); Overeager exits career tracks early (P31).
9. **Minor design idea — per-trait "absence bonus"** (points for LACKING a trait, e.g. not-Obscure) that the additive model can't currently express (P37-39). Both Cal and Ted endorsed the concept; not built.

**Reconciliation headline for tech-lead:** `src/pv.ts` is at a *pre-revamp* state — flat ±4 / −5 traits, flat `command*10`, magic `Kingmaker +6`, `Math.max(0,…)` clamp. This thread is the designer spec that supersedes all four, but (a) its exact coefficients are explicitly non-final, (b) its display scale is undecided, and (c) its trait names predate the current code vocabulary. Apply as **tiers + a re-mapping + a fit pass**, not a literal transcription.
