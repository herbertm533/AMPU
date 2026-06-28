# Digest — 215f0676 "July 2023 AMPU Playtest Updates" (topic 4507)

**Scope:** Cross-era playtest **highlight reel** (July–Aug 2023) — a direct
continuation of the monthly "playtest updates" series (cf. digest
`0b896cf9` June 2023). Anecdotes are pooled for a backer email (POST 1 "For next
update"; POST 5 "post any interesting updates that I can give to Anthony"). 25
posts, 1 chunk (~11k chars). **Anecdotal** — the value is in **mechanics
signals**, not narrative; this digest extracts signals and drops the color.

Four campaigns surface:
- **1868 "Gilded Age" run** (Bushwa777, EYates, Imperator Taco Cat, Arkansas
  Progressive) — reached the **1876–1878** game window. Era framing per
  `docs/game/historical-context.md` §4 (Gilded Age 1868–1892).
- **1948 "Nuclear Age" run** (jnewt, ebrk85, Murrman104, matthewyoung123) —
  reached **1964–1966**; JFK presidency. Framing per
  `docs/game/historical-context-1948-coldwar.md`.
- **1840 run** (OrangeP47, matthewyoung123) — reached **1884–1886**;
  Whig/Dem era. Framing per `historical-context.md` (Manifest Destiny → Gilded
  Age bands; "original Civil War" run in sibling digest).
- **1800 "Era of Republicanism" run** — reached the **1808** election;
  Jefferson/Federalist era. Framing per `historical-context.md` §3
  (Jeffersonian/Era of Good Feelings).

Participants reference "Anthony" (vcczar, owner/dev) and the rules drafter; no
historian ran this batch, so all era anchoring is via the historical-context
docs above.

---

## ★ HEADLINE: presidential MORTALITY / FALL / SCANDAL rate is a balance crisis (POST 18-25)

The dominant signal of the thread. Across multiple post-1856 runs, playtesters
report that presidents **almost never survive a full term intact** — they are
serially removed by the **fall / illness / scandal** event tables.

Provenance (the load-bearing quotes):
- POST 18 (Bushwa777): *"Has any president ever finished 2 terms in this whole
  game?"* — the question that triggers the thread.
- POST 20 (jnewt, re: **1948**): *"No. Excluding Presidents Barkley and Brooke
  (who each served less than one term), we've had **three straight Presidents
  resign in their second terms**."*
- POST 23 (ebrk85, re: **1948**): *"Idk why any politician would want to be
  President in the 1948 playtest. You are **guaranteed to have a nasty fall and
  if you survive that a major scandal will take you down**."*
- POST 24 (re: **1868**): *"Same in 1868. We have **not had 1 president do a
  full 1 or 2 terms without falling**."*
- POST 25 (Murrman104, re: JFK in 1948): *"JfK had **two major scandals and an
  Illness. Teflon my ass**"* → even a **Teflon**-trait politician got hit twice
  + an illness, i.e. the trait does not blunt the rate enough.
- Concrete 1948 instance (POST 17): **President Kennedy resigns** facing *"a
  combination of Scandal, Illness and a poor 1966 midterm performance,"* replaced
  by VP Lewis Douglas. (Note: JFK had *just* won a second term in 1964 by a
  landslide, POST 4 — so the fall came mid-second-term, consistent with the
  "second-term resign" pattern.)

**Frame as a strong balance signal:** the presidential **fall / illness /
scandal** event rates (especially in **post-1856 eras**) are too punishing —
pairs with the **b45 senior-general death-protection** signal and the general
**mortality / scandal tables**. The compounding is the problem: a "fall" event,
if survived, is followed by a scandal that finishes the term.

**★ Counter-evidence — severity looks era / RNG-scaled, NOT universal:**
- POST 21 (matthewyoung123): *"James K. Polk did **2** [terms] in 1840. **Francis
  Granger had 3 terms**. **Howell Cobb also had 2 terms**."* → the **1840** run
  produced full / multi-term presidents routinely.
- POST 12 (1800 run): **Thomas Jefferson wins a precedent-breaking THIRD term**
  in 1808 — *"unanimous victory in the electoral college,"* Jefferson+Burr.
- POST 19: *"We've had several, and one even finish three. **Human players are
  just a losing proposition**"* — i.e., the survivors are CPU presidents; the
  fall/scandal pain is felt most by **human-controlled** presidents (possible
  player-vs-CPU asymmetry, or selection effect since humans pursue the office).
- POST 22 (jnewt): clarifies the "no two-termer" claim was **scoped to the 1948
  test specifically**, and *"pretty much every other playtest has had a President
  serve two terms."*

⇒ Open question for the human: is the fall/scandal/illness rate **scaled by
era** (heavier 1948 / 1868, lighter 1840 / 1800), or is the difference pure RNG
variance across these specific runs? Either way, the **1948 and 1868** tables
read as too harsh to playtesters.

---

## ★ Legislative (Speaker) misconduct → expulsion hearing & conviction (POST 14)

A legislative-misconduct charge/expulsion mechanic, **sibling of the
judicial-misconduct charge-roll (gap #270)** and the **impeachment cluster
(#273)**.

- POST 14 (Arkansas Progressive): Speaker **James G. Blaine** — *"controversy
  resulted in a hearing to result in possible expulsion. The committee
  **convicted Blaine on Contempt of Congress, Bribery, and Public Indecency**.
  Blaine was **removed from the Speakership but allowed to remain in
  Congress**."*

Signal: this is the **legislative** analogue of the judicial-misconduct flow
seen in the June digest (general-event → GM rolls a charge list → committee
hearing → conviction). Note the **graduated penalty**: conviction stripped the
**Speakership/leadership office** but did **not** expel from the chamber — a
distinct outcome tier from full expulsion or from a justice's resignation.
Capture as a sibling mechanic of #270/#273, not a duplicate; the open question
of how the trial half is codified (raised in #273) applies here too.

---

## ★ House incumbency bonus is DECISIVE (POST 9-11) — cross-ref b46 House-incumbency digest

Concrete in-run evidence that the **+2 House incumbency bonus** flips a seat:
- POST 9 (EYates): *"Incumbent Speaker **James G. Blaine won by 1 point in deep
  red maine**"* — i.e. a sitting Speaker barely held a seat in a state that
  should be safe for his party.
- POST 10 (Imperator Taco Cat): *"only by luck."*
- POST 11 (Bushwa777): *"It was **his incumbency that saved him. Without it the
  Dems would have flipped it**."*

Corroborates the b46 House-incumbency-bonus discussion: incumbency is large
enough to be outcome-determining in a ~1-point race. Same run also shows
incumbency holding **governorships** (POST 8: *"Many of the narrowly missed out
on Governorships stayed Republican due to incumbents running for re-election"*).

---

## Other mechanics signals

- **Speaker election can SPLIT a winning party** (POST 13): in the 1868 run the
  Dems **won the House majority** but *"the chance of Fernando Wood to become
  speaker went up in flames when the party split and **two factions voted for
  the current speaker James G Blaine** for another term."* ⇒ the Speaker vote is
  faction-resolved, not a simple majority-party automatic; intra-party faction
  splits can hand the chair to the **other party's incumbent**. (Cross-ref the
  same Blaine then facing the expulsion hearing above.)

- **War → territory acquisition** (POST 3, 8): the 1868 run *"has gone to war
  with **Germany / the new German Confederation** over the **Samoan Islands**"*
  and *"would win"* (POST 8). War-acquisition mechanic; cross-ref **b44 #277**
  and **b45 Spain→Puerto-Rico**. Casus belli is explicitly stated: *"the US does
  not wish to share the islands with Germany"* (POST 3).

- **Scripted economic crisis → defections + opposition gains** (POST 3, 8): the
  **Panic of 1877** (POST 3 dates it "(1873)"; matches the historical Panic of
  1873 / "Crime of '73" per `historical-context.md` line 1217) hits *"the
  rapidly industrialising United States."* Downstream effects observed:
  - Public mood swings to the Democrats *"for the first time since the civil
    war"* (POST 8).
  - **Senate party-defections**: *"several Republican senators would **defect to
    the Democrats**"* following the Panic (POST 8).
  - Democratic House blowout in the 1878 midterms (see metrics below).
  ⇒ a **scripted economic event** with concrete mechanical consequences
  (mood/defection/seat swings), era-anchored to the Gilded Age.

- **Policy → economy consequence (bimetallism)** (POST 7, 15): in the 1840 run
  the Whigs took the trifecta in 1884 and *"the economy did a rapid 180 thanks to
  **bimetallism** (technically an outgoing Cobb policy, but **blamed on
  Curtis**)."* Two signals: (a) **monetary policy is an economy lever** with a
  delayed, term-spanning effect; (b) **blame attribution** lands on the
  *current* officeholder, not the policy's author — public punishes the sitting
  party (POST 7: 1886 midterms — Dems flip **12 governorships**, House majority
  of 100+).

- **Procedural / structural legislation exists** (POST 7): the only two bills
  the Whig Congress passed that term were both procedural —
  *"Establishing the Congressional leadership offices"* (i.e. leadership offices
  can be *created by legislation*, relevant to the Speaker/leadership mechanics
  above) and *"Making sec state 3rd in line of presidency."* Also noted: a
  house-rule **"fill VP vacancy amendment"** passed ahistorically in the 1840s
  (POST 7) — relevant to the succession chain below.

- **Succession chain works on presidential fall** (POST 15, 17): in 1840,
  President **Curtis died** (old age) and **VP Frederick Douglass succeeded**
  — *"effective both politically and policy wise, but got no credit from the
  public"* (POST 15). In 1948, JFK's resignation elevated **VP Lewis Douglas**
  (POST 17). ⇒ VP→President succession is implemented; **successor gets little
  public-approval credit** (a flavor/scoring signal worth noting alongside the
  fall-rate crisis — successions are frequent precisely *because* of the
  fall rate).

- **Third / multi-terms are reachable** (POST 12, 21): Jefferson 3rd term
  (1808, unanimous); Francis Granger 3 terms; Polk & Cobb 2 terms each — i.e.
  term limits are NOT hard-coded; multi-term presidencies happen in milder-RNG
  runs. (Same data point that anchors the era/RNG-scaling counter-evidence
  above.)

- **Presidential convention can take multiple ballots + rules changes** (POST
  16): in 1880 *"After **three ballots and a rules change** Speaker George
  Pendleton of Ohio wins the convention over New Jersey governor Theodore Fitz
  Randolph."* Multi-ballot nomination contests are modeled.

- **Judicial supremacy ruling** (POST 3): SCOTUS in the 1868 run held *"federal
  law trumps state law in the case of **Talon v Mayes**"* — a court system
  producing doctrine rulings (flavor; cross-ref the courts/SCOTUS gap clusters).

- **Anti-lynching law passed** (POST 6): 1868 run — a Reconstruction/civil-rights
  legislative item is available in that era (flavor; era-appropriate legis pool).

---

## Concrete metrics (for balance reference)

1868 run — **1878 midterms** after the Panic of 1877 (POST 8):
- **Governors:** Dems net **+6** (their largest net gain), → 25 R / 20 D. Dem
  surprise wins in **Nevada, Vermont**; missed (held R by incumbents) in NY, PA,
  WV, AL, GA. Several seats stayed R because Dems *fielded no candidate*.
- **House:** GOP **−81** seats; Dems take majority, nearly doubling their count
  → **163 D / 134 R**.
- **Senate:** Dems gain but can't break the GOP supermajority; GOP majority cut
  from ~30+ to **20** (55 R / 35 D), aided by post-Panic R→D defections.

1840 run — **1886 midterms** after bimetallism wrecked the economy (POST 7):
- Dems flip **12 governorships** (first nationwide majority since pre-Civil War).
- Dem House majority of **100+** seats.
- BUT the **Class I Senate map** was so unfavorable that Whigs **gained** in the
  Senate and held the majority despite the wave → **Senate class/map structure
  can decouple Senate outcomes from a national wave** (notable mechanic).

---

## Deltas vs current build / signals (handoff)

1. **★ Presidential fall / scandal / illness rate is a balance crisis**
   (POST 18-25). Playtesters report presidents serially fail to finish terms in
   **1948** ("three straight resign in 2nd term"; "guaranteed nasty fall then a
   scandal") and **1868** ("not 1 president … without falling"). Even a
   **Teflon** trait did not prevent 2 scandals + an illness (POST 25). **Pairs
   with b45 senior-general death-protection** and the general
   mortality/scandal tables. **Likely era/RNG-scaled, not universal** —
   counter-evidence: 1840 had Polk/Cobb 2-term + Granger 3-term; Jefferson 3rd
   term 1808 (POST 12, 21). Possible **human-vs-CPU asymmetry** (POST 19: "Human
   players are just a losing proposition").

2. **★ Legislative-misconduct → expulsion is a SIBLING of #270 / #273** (POST
   14). Speaker Blaine: committee hearing → **convicted of Contempt of Congress,
   Bribery, Public Indecency** → **removed from Speakership but kept his seat**.
   Mirrors the judicial-misconduct charge-roll (#270) and impeachment cluster
   (#273); note the **graduated penalty tier** (lose office, keep chamber). Trial
   half likely as un-codified here as in #273.

3. **★ House (and gubernatorial) incumbency bonus is DECISIVE** (POST 9-11, 8).
   Sitting Speaker held "deep red Maine" by **1 point** — explicitly "without
   incumbency the Dems flip it." Corroborates the **b46 House-incumbency-bonus**
   digest; bonus is outcome-determining in close races.

4. **Speaker election is faction-resolved and can split a winning party** (POST
   13): Dems won the House but a faction split re-elected the *opposing*
   incumbent Speaker. Speakership ≠ automatic to majority party.

5. **War → territory acquisition** confirmed again (POST 3, 8): US beat the
   German Confederation for **Samoa**. Cross-ref **b44 #277 / b45
   Spain→Puerto-Rico**.

6. **Scripted economic crisis with mechanical teeth** (POST 3, 8): **Panic of
   1877** (= hist. Panic of 1873) → mood swing + **Senate R→D defections** +
   House blowout. Confirms scripted economic events drive defection & seat swings.

7. **Monetary policy is a delayed economy lever; blame lands on incumbent**
   (POST 7, 15): **bimetallism** crashed the 1840-run economy a term later;
   public punished the *current* officeholder, not the policy's author.

8. **Senate class/map can decouple from a national wave** (POST 7): a huge Dem
   wave still let the Whigs *gain* Senate seats due to the unfavorable **Class I**
   map — Senate-class scheduling is a real, sometimes counterintuitive mechanic.

9. **Succession works; successor gets no public credit** (POST 15, 17): VP→Pres
   succession implemented (Douglass→1840, Lewis Douglas→1948); successors are
   "effective but get no credit" — a flavor/scoring note that compounds with the
   high fall rate (successions are frequent *because* presidents keep falling).

**Open questions for the human:**
- Is the presidential fall/scandal/illness rate **era-scaled** (1948/1868 harsh,
  1840/1800 mild) or just RNG variance across these runs?
- Is there a **human-vs-CPU asymmetry** in who falls (POST 19)?
- How is the **legislative-misconduct trial/penalty ladder** (office-removal vs
  full expulsion) codified vs GM-adjudicated? (same open question as #273).

---

`wc -l` of this digest: **275 lines**.
