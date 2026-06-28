# Digest — A More Perfect Judiciary: DLC or game-mechanic overhaul idea

- **Slug:** `fd4c3c4e-a-more-perfect-judiciary-dlc-or-game-mechanic-overhaul-idea` · **batch 36** · 18 posts / 1 chunk (~25 KB). Apr 2022.
- **Type:** JUDICIARY-OVERHAUL **design thread** (Cal's proposal) + a *design debate* + ONE shipped partial. **Not a playthrough.**
- **Status:** Cal's two big systems (**Judicial Philosophy**, **Focus Courts**) are explicitly punted to **AMPU 2 / a DLC** by both vcczar (#2,#4) and ConservativeElector2 (#6). The ONLY thing vcczar shipped here (in forum-era AMPU 1) is a small SC-justice ideology-drift rule (#15/#18). **None of it exists in the current browser build** — the shipped court is still the coin-flip (`phaseRunners.ts:3397`, #25/E25).
- **This thread is the DESIGN ORIGIN** of much of the SCOTUS cluster: it predates and seeds **#52** (player-controlled vs CPU court), **#218** (Rule of Four), **#249** (Landmark tier), and ties **#25/E25** (SCOTUS docket data structure). Cal authored it ~6 weeks before `scotusfuture` (batch 35).

---

## Core proposal A — Judicial Philosophy (NEW system layer on SCOTUS; AMPU 2)

A justice's behavior is a **separate axis from Personal Ideology** (POST 1, 16). Composed of two parts, **HIDDEN until revealed**:

### A1. Judicial Ideology — Conservative / Swing / Liberal scale (POST 1)
- **Base % derives from Personal Ideology**, then modified by Interests + Traits (POST 1). The 7-point personal-ideology → judicial-ideology base table:

| Personal ideology | Conservative | Swing | Liberal |
|---|---|---|---|
| RW Populist | 90 | 10 | 0 |
| Traditionalist | 80 | 20 | 0 |
| Conservative | 70 | 30 | 0 |
| Moderate | 15 | 70 | 15 |
| Liberal | 0 | 30 | 70 |
| Progressive | 0 | 20 | 80 |
| LW Populist | 0 | 10 | 90 |

- **Trait modifiers** (POST 1): LW Activist **+25 Liberal**; RW Activist **+25 Conservative**; Pliable **+50 Swing**; **Lackey +50 toward their active Kingmaker's direction**; Puritan **−50 Swing**. (Modifiers can push totals off 100%; Cal hand-waves a CPU re-normalize — flags this as an open UX question.)
- **Revealed** only via one of three paths (POST 1): (1) graduating the **Judicial Career Track** (proposes renaming "State Judicial Career Track" → **"Judicial Career Track"**); (2) appointment to a **Focus Court**; (3) **direct SC appointment** (a gamble — unscrutinized; but "the only way you'll reliably get justices under 45 on the court").

### A2. Judicial Doctrine — per-case aye/nay modifiers (POST 1)
- Each justice gets one/two **Judicial Doctrines** that add ±% to their aye-vs-nay chance **on specific tagged cases** — independent of ideology (the "Scalia joins the liberals on 4th-Amendment grounds" effect, POST 1, 14). Designed as the seed for a diverging-timeline + flavor-text expansion.
- Real-world taxonomy raised for flavor (POST 7-9, Edouard/Cal): **Textualism** (Scalia, "literalists"), **Intentionalism** ("finalists" — will of the legislator), **Purposivism** ("free interpreters" — adapt law to society). Cal: V's "Judicial Activism = LW Activism / Originalism = RW Activism" framing (POST 2) maps loosely onto these.

## Core proposal B — Focus Courts (NEW judicial sub-system; AMPU 2)

- **4 regional single-judge appellate courts** at game start (POST 1): **New England, Mid-Atlantic, Upper South, Deep South**. Each = one Focus Judge, President-appointed, serving to retirement.
- **Confirmation** like a SC justice, but **opposition rules relaxed** (lower-court appointments are scrutinized less IRL; a judge confirmed for a Focus Court can still lose votes when later elevated to SC) (POST 1).
- Focus Judge has **a chance to improve Judicial Ability on appointment**, and can gain SC-useful traits through interactions (POST 1). An affirmed Focus Judge has a **small chance to gain Jurisprudence** (POST 1).
- **Jurisdiction split** (POST 1): **Original Jurisdiction** cases → always go straight to SC, never a Focus Court. **Appellate Jurisdiction** cases → usually originate in a Focus Court, but have a chance to arrive at SC directly (simulating unrepresented lower courts). Focus Courts decide **independently of the player**; the Focus Judge's Judicial Philosophy sets aye/nay odds.
- **Rule of Four cert mechanic** (POST 1, = **#218**): after the Focus Court rules, SC decides whether to **grant cert** (≥4 of 9 justices). Since only the most influential cases are modeled, denial should be **rare but possible**, driven by who appointed each justice + traits + Judicial Philosophy. If cert granted, SC **affirms or reverses**.
- **Scoring rules (key, POST 1):**
  - **Points/meter effects do NOT change on affirm vs reverse** — only **aye-vs-nay** matters. Reversing the Focus Court has zero point/meter effect.
  - **Cert denied:** points/effects computed **as if the Focus Judge's ruling were the SC's**, EXCEPT SC justices get no points; the **Focus Judge gets points** for the case law instead.
  - **Deny cert on a Landmark case → the SC LOSES points** (ties #249's Landmark tier).
  - A Focus Judge authoring a ruling that **deducts the most points from the appointing President's faction** (while that President is in office) triggers a **dice roll for that faction's enthusiasm to drop** (discontent with the appointment).
- Manipulative / Iron Fist / Jurisprudence **party leaders** may get a chance to **interfere** with a granted-cert case (POST 1).
- Cal flags he is **ignoring state-supreme-court jurisdiction** (no statesmen to model it; out of scope) (POST 1).

---

## ★ What vcczar SHIPPED vs deferred

**SHIPPED (forum-era AMPU 1, POST 15/#18 — confirmed "partially redone"):**
- A **confirmed SC justice has a 10% chance to immediately shift ideology ±1** (one spot left or right) on confirmation.
- **Further shifts only every 10 years served** (via the SC-decision section).
- **+5% more likely to move leftward than rightward** ("historically justices overwhelmingly move left"). Overall shift chance is **very low**.
- Souter cited as the archetype (POST 3).

**DEFERRED to AMPU 2 / DLC (explicit):**
- The **entire Judicial Philosophy system** (Judicial Ideology + Judicial Doctrine + hidden/reveal mechanic) — vcczar (#2), CE2 (#6).
- **Focus Courts** (all of proposal B, incl. Rule of Four cert, jurisdiction split, scoring) — CE2 (#6: "Definitely an AMPU 2 thing, if it is added at all").
- Taking the SC **away from players → CPU-run by default** — vcczar **rejects as the default** (#3); see debate below.

**NOT in the current browser build (shipped-reality check, this repo):** The POST-15 partial itself is **absent** — the build's `runPhase_2_5_3_Court` is a **coin-flip** (`chance(0.5)`) on **4 hardcoded case strings**, ruling conservative/liberal by simple justice headcount and nudging `partyPreference` ±0.1; **no per-justice ideology drift, no confirmation shift, no Judicial Philosophy/Doctrine, no Focus Courts, no cert** (`src/engine/phaseRunners.ts:3397-3414`). The existing `ideologyShift` machinery in the build (phase **2.1.5**, `resolveIdeologyShift`) is the **general faction-conversion** system over personal ideology — it is **NOT** the SCOTUS-specific drift rule and does not target justices on confirmation. No `judicialIdeology`/`focusCourt`/`ruleOfFour` types exist in `src/types.ts`.

---

## ★ The #52 design debate (sharpens #52: player-controlled vs independent SC)

**ConservativeElector2's critique (POST 10, 12)** — the current player-controlled court is ahistorical:
- Justices are "directly and openly... controlled" by their faction by default, while **legislators (who at least answer to a leader) often defect** — backwards from reality, where justices have no accountability. Makes the appointee's ideology "pretty much pointless."
- Even the existing **"Puritans must vote their ideology" rule hasn't been followed** in play.
- Produces "ludicrous results": **Ginsburg voting down gay marriage, Scalia championing big government, Roberts never being a swing vote** (no player would tell their justice to vote against their faction).
- **Worked example (1960 game, POST 12):** On **Roe v. Wade**, the **only** point-affected players are the one holding the **Healthcare lobby** (aye) and the one holding the **Theocrat card** (nay) — here that's only @pman (Public Healthcare lobby, controls 2 justices). So **7 justices have no incentive** to vote either way, and via **wheeling-and-dealing you can have Scalia legalize abortion** in exchange for a party-leadership vote with **no point cost** — wildly unrealistic. → CE2: the **default should be independent courts**.

**vcczar's position (POST 3, 18):** wants to **keep the player-controlled SC**; an all-CPU court is **fine as an option but must NOT be the default** — the playable judiciary is a key selling point ("could attract law school students"). Reaffirms in the final post: "I vote against the running by the CPU by default... I wanna play the SC even though it's p basic rn."

**Cal's position (POST 1, 11, 13):** courts (Focus + SC) should be **insulated from player control once confirmed**, with votes predicted (not commanded) by Judicial Philosophy — but worries a fully-known-in-advance court "could get boring," so wants a **surprise element** (POST 13).

**CE2's interim compromise (POST 14)** — doable in AMPU 1 *without* the full overhaul: when independent, a justice rules a given way by a **percentage from ideology/personal interests** (not faction interest), so Scalia almost always rejects Roe but can still land "liberal-outcome" votes on 4th-Amendment / governmental-overreach cases. (This is the bridge between today's coin-flip and the full Judicial Philosophy model.)

**Other voices:** ConservativeElector2 supports keeping the court but as independent; **OrangeP47 (#17)** likes a CPU-by-default independent SC and notes the court will see far more action in a **1960 scenario** (1960s–70s landmark cases) than the 1772 playtest has shown; **OrangeP47 (#16)** cautions the forum is a biased (lawyer-heavy) sample and not to over-engineer the court for AMPU 1.

---

## Candidate gaps for consolidation (hand-off — DO NOT write the gap log here)

1. **Judicial Philosophy = Judicial Ideology + Judicial Doctrine** (NEW SCOTUS layer; AMPU 2). 7-point personal-ideology → Cons/Swing/Liberal base table + trait modifiers (LW/RW-Activist ±25, Pliable +50 Swing, Lackey +50 toward Kingmaker, Puritan −50 Swing); **hidden until revealed** via Judicial Career Track / Focus Court / direct SC appointment. Doctrine = per-case aye/nay modifiers. *Ties #52, #249, #25/E25.* (POST 1, 7-9, 16)
2. **Focus Courts** (NEW judicial sub-system; AMPU 2): 4 regional single-judge appellate courts; relaxed confirmation; Original vs Appellate jurisdiction routing; **Rule of Four cert** (= **#218**); affirm/reverse with **points unchanged by reverse**; **cert-denied → Focus Judge scores, SC justices don't**; **deny-cert-on-Landmark → SC loses points** (= **#249**); Focus Judge can gain Jurisprudence / Judicial Ability; appointing-President enthusiasm-drop dice-roll. (POST 1)
3. **SHIPPED partial (forum AMPU 1, NOT in this build):** confirmed SC justice **10% immediate ±1 ideology shift**, further shifts **per 10 yrs served**, **+5% leftward bias**. *Capture shipped-vs-deferred split precisely; verify against build — currently absent (coin-flip court at `phaseRunners.ts:3397`).* (POST 15, 18)
4. **#52 sharpened — player-controlled vs CPU-independent SC:** CE2 argues the current player-controlled court is ahistorical (Roe worked-example: 7 of 9 justices have no point incentive; wheeling-and-dealing lets Scalia legalize abortion); wants **independent-by-default**. vcczar wants the **player SC kept (CPU only as an option)**. CE2's interim: **ideology/interest-% independent voting** as the bridge from the coin-flip. (POST 3, 10-14, 17, 18)
5. **DESIGN-ORIGIN linkage:** this thread predates/seeds the SCOTUS cluster — **#218** (Rule of Four), **#249** (Landmark tier + context-dependent significance), **#25/E25** (SCOTUS docket data structure), **#52**, and corroborates the "★ subsume the human GM" trajectory (independent CPU courts). (POST 1, 12)

### Open questions (for the human, via consolidation)
- Re-normalizing Judicial-Ideology percentages past 100% (Cal asked for a UX/formula; POST 1).
- Does AMPU 1 adopt CE2's **interim ideology-% independent voting** (POST 14) as the bridge, or stay with the coin-flip until the full AMPU-2 system? (Unresolved in-thread.)
- The **rename** "State Judicial Career Track" → "Judicial Career Track" (POST 1) — is the build's career-track naming/scope to change?
