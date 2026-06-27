# Digest — `c6f6dcc7-groupthinking-the-political-value-looking-for-feedback`

**Thread:** "Groupthinking the Political Value — looking for feedback" (politicslounge #1729)
**Type:** DESIGN / feedback survey (Feb 8–9, 2023). NOT a played-forward game. GM/designers: **@MrPotatoTed** opens, **@vcczar** (tier-1 creator) rules; respondents = experienced players (Murrman104, ShortKing, Willthescout7, ebrk85, 10centjimmy, jnewt).
**Coverage:** 1 chunk / 46 posts (`chunk-001.md`), ~42.6 KB source. Era-agnostic (formula/CPU design).

> ★ **THIS IS THE GATING THREAD for the PV epic (#214/#215/#220).** game-context.md flagged #214/#215 as "DOUBLE-GATED on the un-ingested 'Groupthinking the Political Value' trait-EFFECTS thread" — this is it. It is the **EFFECTS / philosophy / office-PV layer**; the sibling `4266d56e-revamping-politician-value` (batch 30, `revampPV`) set the point **VALUES**. Same forum, same week, same people, near-identical tier tables — **the two threads are one conversation.** This digest's job: resolve the gate.

---

## TL;DR — the PV-design decisions

1. **Keep PV** (do NOT scrap it) — *because the CPU/AI relies on it.* vcczar floated dropping PV (POST 4); shot down by himself + everyone: PV is "how the AI/CPU knows which politicians have higher potential/worth for things like stealing from other factions, putting forward for office, etc." (POST 5, vcczar). Reaffirmed POST 8/9/15/16. **CPU-coupling is the whole reason PV must be correct** — a reweight changes CPU play. (charter-relevant: PV is the AI utility function.)
2. **The lackey bug is CONFIRMED + the fix is RULED:** lackey is pulling **−53** PV (vs −20 Incompetent, −5/−10 for the rest); it was a **typo/spread error** in the shared spreadsheet (POST 22–25). **Ruling: Lackey = −5** (POST 26, MrPotatoTed: "Yep. −5"). Matches the brief ("lackey penalized ~4× too much"). → confirms shipped `pv.ts` flat −5 is *already* correct for lackey; the −53 was a forum-spreadsheet artifact, not a code bug. Players note lackey "rarely comes up… not that bad" (POST 3, 22).
3. **Kingmaker under-rewarded → boosted:** opener flags it (POST 1). New tiers put **Master Kingmaker = +30 (top), Kingmaker = +15** (POST 28). Shipped `pv.ts` gives Kingmaker only +6 over the +4 positive base (`pv.ts:79`) and has **no Master Kingmaker tier at all** → confirmed under-weight.
4. **Biggest BONUS traits (player consensus):** Master Kingmaker ≫ Kingmaker, Iron Fist, Leadership, Charisma; then Debater, Orator, Likable, Puritan (POST 2/3/7/15/17). 10centjimmy adds the technical/crisis traits (Crisis Manager/Gov/Admin, Bookkeeper, Geostrategist, Jurisprudence, Domestic Warrior) + Egghead/Everyman/Lawful (POST 17).
5. **Biggest PENALTY traits (consensus):** **Incompetent = "career killer," the worst** (POST 7/15/20/21, vcczar concurs) — NOT lackey. Then Easily Overwhelmed, Passive ("almost prevent gaining leadership… so worthless," POST 17), Pliable, Two-Faced, Predictable, plus Uncharismatic/Unlikable/Disharmonious/Flip-flopper/Carpetbagger. **Obscure = −25** treated as its own large penalty so non-obscure pols "shoot to the top" (POST 28).
6. **OFFICE-PV (Q3) — the headline open question:** *Should holding Rep/Senator/cabinet/President raise PV (and losing it lower it)?*
   - **Players: overwhelmingly YES** (Murrman104 POST 2/33-rationale, ShortKing POST 3/6, ebrk85 POST 15/18, 10centjimmy POST 17). Rationale: the CPU should prefer a sitting Senator over an "unemployed rando" of identical traits when picking faction leader / when stealing pols.
   - **MrPotatoTed: initially NO** "unless PV will actually impact elections… rather than just showing who's valuable" (POST 7) — but then **authors a full office→PV table anyway** (POST 28).
   - **vcczar (decider): NOT YET CONVINCED, but open** (POST 8 "a way to reflect offices held would be helpful"; POST 39 "haven't come around to yet… open to being convinced"; concedes POST 41 **"Yeah, maybe just for active draft"**). **Net lean: office-PV YES, scoped — primarily for the post-1772 active draft + persuasion/steal AI** (POST 40–42), so the AI drafts/steals high-office pols to stay competitive.
   - **Office values proposed (MrPotatoTed, POST 28):** Pres +1000, VP +500, Speaker/Sen Maj Leader +400, other Maj/Min Leaders +350, Whips +300, Senator/Upper Cabinet +250, Governor/rest of Cabinet +100, Rep/Cabinet-level +50, Military leader +20, Military/Ambassadors +10. **vcczar: "I would have half the points for offices. Those are too high" (POST 31)** → unresolved magnitude.
   - **"Lose some, not all" on leaving office:** desired by ShortKing/Willthescout7/vcczar (POST 3/6/8/9/15) but judged **not doable in the current Excel format** (POST 6, 18) without a new "previous offices" tracker column → deferred as too clunky for forum; **trivial in code** (the app already persists office history) — flag for the build.

---

## Trait-EFFECTS layer (the part `revampPV` lacked) — vcczar POST 33 / 46

vcczar: *"one thing you may need to factor in is that I am going to be changing what some of the traits DO"* (POST 19). The rough-draft effects (POST 33, **finalized POST 46** — "Unless I missed it, I see no objection… I'll implement these"). These define what traits DO mechanically, which in turn justifies their PV weight:

| Trait (pos / neg pair) | Designed EFFECT (vcczar POST 33) |
|---|---|
| **Cosmopolitan** | 25% chance +1 in 10 largest-EV states in *presidential* race; 25% −1 in Gov/US-Rep races; Senate races exempt. (Was "weak," now strong — POST 34.) |
| **Provincial** | 25% +1 in Gov/US-Rep races; 25% +1 home region in presidential; 25% −1 in non-home regions & top-10-EV states (unless home state). |
| **Lackey** | If in party-leader's faction, *cannot* be converted/manipulated by other faction leaders; cannot earn "Leadership" until lackey is lost; cannot be a major presidential candidate. (i.e. lackey's downside is mechanical lock-in, NOT a big PV hit → supports −5.) |
| **Magician** | Two die rolls during shenanigan phases (Congress in Session); takes the larger. |
| **Bookkeeper / Numberfudger** | +1 / −1 admin while Sec of Treasury, US Bank Pres, or Fed Chairman. |
| **Geostrategist / Naive Strategist** | +1 / −1 (admin) as Sec of State, Ambassador, or Nat Sec Advisor. |
| **Domestic Warrior / Domestic Apathy** | +1 / −1 as Sec of Labor, Health, HUD, Transportation, Education. |
| **Lawful / Illicit** | +1 / −1 as Attorney General, Homeland Security. |
| **Crisis Manager / Gov / Admin** | During relevant ongoing crisis: Crisis Mgr → temp +1 command when a meter is at 1–2, +1 to any ability the president needs to resolve a crisis event/action/legislation; Crisis Gov → temp +1 Gov during domestic/economic crisis; Crisis Admin → temp +1 admin if crisis is relevant to office. |

**Design principle stated (POST 1, vcczar/MPT):** because PV "can't be broken down by office," the **biggest PV bonuses go to the traits that help the MOST OVERALL** (office-agnostic ones like Kingmaker/Leadership/Iron Fist/Charisma), while narrow office-conditional traits (Bookkeeper, Geostrategist, the Crisis line) sit in the **+5 tier** — they only matter in one seat. This is the explicit rationale the brief asked for.

---

## PV tier table surfaced here (MrPotatoTed POST 28 — mirrors `revampPV` POST 33)

Abilities: **Command = 15× level; Legislative/Governing/Admin = 10× level; Military/Judicial = 5× level.** Topic **expertise = +5 each** (e.g. agriculture+transportation+welfare = +15).
- **+30** Master Kingmaker
- **+15** Kingmaker, Iron Fist, Leadership
- **+10** Charisma, Likable, Efficient, Manipulative, Hale, Magician
- **+5** Debater, Orator, Puritan, Integrity, Provincial, Cosmopolitan, Egghead, Everyman, Celebrity, Military Leader, Propagandist, Teflon, Bookkeeper, Geostrategist, Domestic Warrior, Harmonious, Lawful, Jurisprudence, Crisis Manager/Gov/Admin, Decisive General, Union Loyalist
- **−5** Controversial, **Lackey**, Numberfudger, Naive Strategist, Delegator, Micromanager, Illicit, Overeager
- **−10** Disharmonious, Frail, Uncharismatic, Unlikable, Incoherent, Flip-flopper, Domestic Apathy, Carpetbagger
- **−15** Pliable, Two-Faced, Predictable
- **−20** **Incompetent** (worst), Passive
- **−25** Obscure
- **(missing/added later:** Easily Overwhelmed — flagged POST 29/40 as omitted; vcczar wants it in.)

> NB this table is MrPotatoTed's "spitball… pending vcczar's changes" (POST 28), explicitly subordinate to vcczar's authoritative `revampPV` POST 33 list. **Use `revampPV` POST 33 as the canonical VALUES; use THIS thread's POST 33/46 as the canonical EFFECTS + the office-PV ruling.** Where they differ (e.g. this thread lists Incompetent in both −15 and −20 — a typo), defer to vcczar.

---

## Display-scale (#220) decision

vcczar wants PV on a **0–100 scale with 50 = the average politician** (POST 39, 44): "weak below 50, great above," normalize by averaging all ~9k pols and offsetting the title. Inspired by Madden / Romance of the Three Kingdoms ratings (POST 44). **jnewt gives the normalization math** (POST 43): assign trait values → sum the "average" pol → `ax = 50`, solve for `a`, scale all weights by `a`. **Caveat:** 0–100 is the *goal* but unresolved whether it's a hard cap or just centered-at-50 (POST 43–45; "it bothers me when I see PV over 100," POST 45). Tension: office bonuses of +1000 etc. (POST 28) are wildly incompatible with a 0–100 scale → the scale + office magnitudes must be reconciled.

## Elections-vs-PV (the "do NOT use PV in elections" ruling — important)

A recurring temptation, **explicitly rejected:** ShortKing proposed replacing the new "legis-helps-Congress-races / gov-helps-Gov-races" ability election bonus with a **highest-PV** bonus (POST 35). **Rejected by jnewt (POST 36), the room (POST 37), MrPotatoTed (POST 38):** using PV in elections would **double-count** traits already priced into both PV and the election roll. Consensus: keep the **50% chance of +1** ability bonus (models "voters sometimes pick the qualified candidate, sometimes don't" — POST 36/38). → **PV stays an AI/draft/persuasion utility metric, NOT an election input.** This bounds the office-PV change: office-PV exists *for the AI/draft*, not to tilt the vote.

## Smaller / parked ideas

- **"Elder Statesman" trait** (vcczar POST 8): career-accrual trait (nobody starts with it) that bumps PV for offices + gives convention/primary + faction-leader bonuses. Debated POST 9–14 and **largely talked down** as redundant with Kingmaker/Master Kingmaker (POST 13/14) — Kingmaker already serves as a "headcanon Elder Statesman" (POST 10). PARK; not adopted.
- **Age curve** (POST 30): vcczar — "ages 45 and below, and 75 and up, slightly penalized." Shipped `pv.ts` penalizes >70 (×1.5) and <30 (×0.8) — close but thresholds differ (designed = 45/75 band vs shipped = 30/70). Minor tuning delta. (Excel-feasibility doubted POST 32; trivial in code.)
- **Era-conditional minority penalties** (POST 28): MPT wishes for gender/race/orientation penalties "during eras where those were uncouth" but "not sure we could adjust the formula by era." → relevant to the era-aware demographics gaps (#238/#239), not a new PV requirement here.

---

## Built-vs-designed cross-checks (spot-read `src/pv.ts` only — do NOT edit gap log)

| Aspect | Shipped `pv.ts` today | This thread's design | Delta |
|---|---|---|---|
| Trait weighting | **flat +4 positive / −5 negative**, +6 extra for Kingmaker (`pv.ts:76-79`) | graduated **+30/+15/+10/+5 ; −5/−10/−15/−20/−25** tiers | Confirms **#214** (per-trait tiers replace the flat ±). Master Kingmaker tier entirely absent in code. |
| Command | `command × 10` (`pv.ts:74`) | **command × 15** (POST 28) | Re-weight = **#215**. |
| Ability curve | uniform skill×officeWeight, then ×4 (`pv.ts:67-73`) | **Legis/Gov/Admin ×10, Mil/Jud ×5** (flat, office-independent) | **#215** per-ability curve; note the design drops per-office skill weighting in favor of fixed multipliers (simpler than shipped `officeWeights`). |
| Lackey | already −5 (flat negative) | **−5** (ruled) | **Shipped is correct;** the −53 was a forum-spreadsheet typo (POST 24–26), not a code bug. DH-77 framing should note this. |
| Office bonus | `OFFICE_PRESTIGE` table, e.g. Pres +30, Senator +5, Rep +2 (`pv.ts:7-31`) — already office-additive | proposed Pres +1000…Rep +50 (POST 28), vcczar wants ~half (POST 31) | **Office-PV already shipped** but at a *much* smaller magnitude than proposed; the design's relative ordering matches code; magnitudes unreconciled with the 0–100 scale (#220). **This RESOLVES the "should PV change by office" question = YES (scoped to AI draft/steal).** |
| "Lose some, not all" on leaving office | shipped PV is recomputed from *current* office only → leaving = full loss, **no legacy carry** | desired (partial decay) but Excel-infeasible | **NEW sub-requirement:** code can do partial office-legacy decay the forum couldn't (corroborates `summer2021` "office loss = PV collapse, no legacy carry" as the #214/#215 target). |
| Display scale | raw, `Math.max(0, round(total))`, unbounded (`pv.ts:88`) | **0–100, 50 = average** (normalize) | **#220** (display-scale) — origin of the normalization-constant requirement; jnewt's `ax=50` method (POST 43). |
| PV → elections | not used in `calcStateVote` | **explicitly must NOT be** (double-count) | Bounds scope: PV is AI/draft only. |

---

## Candidate gaps / resolutions for consolidation

> Hand-off to the consolidation agent (do NOT edit the gap log myself). All cites are `c6f6dcc7 POST n`.

**RESOLVES / UNBLOCKS — #214 and #215 are now substantially UNBLOCKED:**
- **#214 (per-trait PV tiers):** ✅ unblocked. EFFECTS layer now exists (POST 33/46) to justify each tier; VALUES come from `revampPV` POST 33 (authoritative) corroborated by this thread's POST 28. Worst penalty = **Incompetent (−20)**, NOT lackey; **Lackey = −5 (typo fix ruled, POST 26)** — shipped code already correct, DH-77 should be re-scoped to "verify −5, add graduated tiers + Master-Kingmaker tier," not "fix lackey bug."
- **#215 (per-ability curve + Command re-weight + office→PV):** ✅ unblocked on direction. **Command ×15; Legis/Gov/Admin ×10; Mil/Jud ×5** (POST 28). **Office-PV ruling = YES**, scoped to the **post-1772 active draft + persuasion/steal AI** (vcczar POST 41–42), ordering Pres > VP > leaders > Senator/upper-cabinet > Gov/cabinet > Rep — already shipped via `OFFICE_PRESTIGE` but at far smaller magnitude.
- **#220 (display-scale):** ✅ direction ruled = **0–100 with 50 = average**, normalize via jnewt's `ax=50` (POST 43); decided goal but cap-vs-centered still soft.

**NEW candidate gaps:**
- **NEW — trait-EFFECTS rewrite (POST 33/46):** the office-conditional ability buffs (Bookkeeper/Numberfudger, Geostrategist/Naive Strat, Domestic Warrior/Apathy, Lawful/Illicit ±1 in matching cabinet seat), **Crisis Manager/Gov/Admin** temp buffs during relevant crises, **Magician** two-rolls-take-higher in shenanigan phase, **Cosmopolitan/Provincial** regional EV swings, **Lackey** behavioral lock-in (no conversion, no Leadership, no major-pres-candidate). The app implements none of these as trait effects → specced-but-unbuilt; this is the *mechanical* counterpart to the PV reweight and the thing that makes the weights defensible. (Sibling to #214's value table.)
- **NEW — office-PV scope is AI-utility, not vote-input:** consolidation should record the explicit ruling that **PV must NOT feed elections** (double-count, POST 36–38) — i.e. office-PV's purpose is AI draft/steal competitiveness only. Tightens #215.
- **NEW — partial office-legacy decay:** "lose some PV, not all" on leaving office (POST 3/6/8) — Excel-infeasible then, trivial in the build (office history persists). Small new requirement under #215.
- **REFINE DH-77:** the shipped −5 lackey is *correct*; the famous "−53" is a forum-spreadsheet artifact (POST 22–26). Re-scope DH-77 from "lackey bug" to "pv.ts is pre-revamp: flat ±4/−5 + command×10, needs graduated tiers + command×15 + Master-Kingmaker tier."
- **PARK — Elder Statesman trait** (POST 8–14): proposed, talked down as redundant with Kingmaker; do NOT add as a requirement.
- **TUNE — age band**: designed 45/75 (POST 30) vs shipped 30/70 (`pv.ts:85-86`); minor.
- **OPEN (for the human):** (a) office-bonus magnitudes — POST 28's +1000…+50 vs vcczar "half that" (POST 31) — are flatly **incompatible with the 0–100 #220 scale**; someone must reconcile office magnitudes ↔ display scale. (b) 0–100: hard cap or centered-at-50-unbounded? (POST 43–45 unresolved). (c) Easily Overwhelmed tier value (flagged omitted, POST 29/40).

**Bottom line:** the gate is **OPEN.** #214/#215/#220 are unblocked on *design direction and rationale*; what remains is purely numeric reconciliation (office magnitude vs 0–100 scale) + the trait-EFFECTS implementation, both now fully sourced. The two PV threads (`revampPV` = values, `c6f6dcc7` = effects + office-PV + scale) together constitute the complete PV spec.
