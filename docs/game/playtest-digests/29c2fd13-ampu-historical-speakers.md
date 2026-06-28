# Digest — 29c2fd13 "AMPU Historical Speakers"

**Type:** RECORD / DATA thread (NOT a playtest). 11 posts / 1 chunk (~6.3 KB).
vcczar (in the 1840-history forum playthrough) periodically posts the **historic
Speaker of the House roster + the major bills passed during each Speaker's
tenure**, tagged to year / president / president-party. This is a *result log of
the run's legislative output*, not new rules. **Value = corroboration**: (1) the
named-bill **legislation-content pool** authored per era/administration (#221),
(2) the **era-keying** of that content (#92), (3) the Speaker roster as a
**dataset** of in-game leaders (#240-adjacent), plus (4) two small **Speaker-power**
notes. Cites `POST n` = `===== POST n =====` markers.

---

## The Speaker-record format (POST 1)
A flat table, one row per (Speaker × bill), columns:

`Speaker | Speaker Party | Year | Pres | Pres Party | Legis(lation)`

…closed by a per-Speaker `<Speaker> TOTALS | N Major Bills` row. Implies a model
where **each major bill is attributable to (a) the sitting Speaker's tenure and
(b) the administration (president + party) it passed under** — i.e. the bill pool
is **era/administration-keyed**, exactly the axis #221/#92 describe. "Major bills"
is a curated tier (matches #221's importance-curation rule; minor/flavor laws are
not counted).

### Party labels are the in-game two-party abstraction
Parties are recorded as **"Red" / "Blue"** (the game's generic Federalist-era
duopoly), NOT historical names — consistent with the KB's Red/Blue framing and the
ahistorical-Constitution founding. Party *flips* are tracked: **Muhlenberg flips
Red→Blue (POST 5)** in reaction to the US Bank / Hamilton agenda.

---

## The roster + bills logged (compact — founding era, this run)
All under **Pres Washington (Red)** unless noted; "MB" = Major Bills total.

| Speaker | Party | Yrs | Pres | Bills (MB) |
|---|---|---|---|---|
| **F Muhlenberg** | Red | 1789–90 | Washington | Judiciary Act, Lighthouse Act, Bill of Rights, Hamilton I Tariff, Create Standing Army, Naturalization Act, Crimes Act, Non-Intercourse Act, Hamilton II Tariff, Funding Act **(10)** |
| **J Trumbull Jr** | Red | 1791–92 | Washington | Vermont Statehood, Hamilton III Tariff, Kentucky Statehood, Militia Acts, US Mint, **+US Bank** (POST 5 addendum) **(6)** |
| **F Muhlenberg** | **Blue** | 1793–94 | Washington | Fugitive Slave, Naval Act **(2)** — "two parties sharing power for the first time" (POST 5) |
| **J Dayton** | Red | 1795–98 | Washington→**J Adams** | Naturalization Act, Tennessee Statehood, Dept of Navy, Alien Acts, Sedition Act, Naturalization Act, Maritime Healthcare **(7)** — *1st re-elected Speaker; 1st to serve 2 presidents* (POST 6) |
| **Th Sedgwick** | Red | 1800–01 | J Adams | Library of Congress, Midnight Judges **(2)** — *"last Federalist Speaker… first insignificant Speaker"* (POST 7–8) |
| **N Macon** | **Blue** | 1802–07 | Jefferson | Repeal Midnight Judges, Repeal Some A&S Acts, West Point Mil Acad, Ohio Statehood, Land Act, National Road, Embargo on UK, Slave Trade Ban, Insurrection Act, Seventh Circuit Act **(10)** — *1st 3-consecutive-term Speaker; 1st major Blue Speaker* (POST 9) |
| **J B Varnum** | Blue | (Jeff/Madison) | Jefferson/Madison | **n/a (0)** — *1st Speaker with no major bill* (POST 10) |
| **H Clay** | Blue | 1812 | Madison | Louisiana Statehood **(1)** (first Speakership) |
| **L Cheves** | Blue | (Madison) | Madison | **n/a (0)** — "filled in during a quiet time" (POST 10) |
| **H Clay** | Blue | 1816–20 | Madison→Monroe | Indiana/Mississippi/Illinois/Alabama/Maine Statehood, Dallas Tariff, Extend National Road, 1st Mil Pension, **Restrict Slavery (Missouri C)** **(9)** (POST 10) |

**Note on the run's chronology:** this is the *playthrough's* timeline, which
runs **behind real history** — the Missouri-Compromise-equivalent ("Restrict
Slavery (Missouri C)") lands at in-game **1820** under Monroe here, and a single
playthrough's Speaker selections only match the real historical Speaker **~50%
of the time** (OrangeP47, POST 2; vcczar "that's what I'm hoping for," POST 3) —
the game **regenerates its own leadership/legislative history**, it does not
replay a fixed script. Reinforces #92 (era = content *band*, not a calendar
rail) and #1075 (Speaker chosen by the in-game election ladder each cycle).

---

## Speaker-power notes (corroborate #1005 / #28 Speaker role)
Two explicit designer remarks on **how much power the Speaker office carries**,
tracking the KB's finding that the early Speaker is weak and the role strengthens:

- **POST 1 (Muhlenberg):** *"highly successful in only 2 years, although he
  personally had very little power"* — the early Speaker presides over heavy
  legislative output **without strong office powers** (output is the era/standing-
  government effect, not the office). Matches #1005's "Muhlenberg benefited by
  presiding as the government was being created" (POST 11).
- **POST 10 (Clay):** *"When Henry Clay returned, he transformed the Speakership
  into an office with actual powers and influence."* — the in-game arc mirrors the
  historical strengthening of the Speakership. Corroborates #1005's asymmetric
  Speaker on-win bundle (Speaker gains Leadership/Legis+1/Kingmaker) and #28
  (Speaker role grants ±points/traits) as the *mechanical* expression of "the
  Speaker becoming powerful."

No NEW Speaker mechanic is specified here — these are *flavor/observation* on the
existing modeled Speaker office, not rules.

---

## Cross-run "top Speakers by bills presided" leaderboard (POST 11)
A separate ranking spanning the **whole timeline of the run(s)** (founding →
modern), confirming the legislation-content pool extends across **all eras** and
that Speaker tenures are the unit it's bucketed by. Top 9 + vcczar's one-line era
gloss (verbatim-ish):

1. **John W. McCormick — 20** ("LBJ's Great Society… high point of legislative production")
2. **Thomas Bracket Reed — 18** ("Gilded Age Speaker")
3. **Sam Rayburn — 15** ("Longest-serving Speaker")
4. **Henry Clay — 12** ("first powerful speaker… speaker the most times")
5. **Frederick Muhlenberg — 12** ("first Speaker… benefited as government was being created")
6. **Jim W Martin — 11** ("most productive post-WWII GOP Speaker; opposition leader of Rayburn")
7. **Galusha Grow — 11** ("Speaker during most of the Civil War")
8. **Joseph Cannon — 11** ("most powerful Speaker ever")
9. **Nathaniel Macon — 10** ("benefited from Jefferson-Madison-Monroe domination")

These are *in-game results*, but the names are **canonical historical Speakers**
the run surfaced — i.e. they exist in the **draftee dataset** as eligible pols
(corroborates #240: marquee historical figures must be in the curated rows so
the engine can elect them to leadership). Eras named confirm the multi-era span
(founding / Civil War / Gilded Age / FDR / Great Society / post-WWII) of #92.

---

## Shipped-reality spot-check (corroborates #221 "0% built")
Codebase-verified 2026-06-27: **none** of the named major bills in this thread
exist as authored, era-keyed legislation-content in `src/` —
`grep -rniE "Judiciary Act|Bill of Rights|Hamilton.*Tariff|Funding Act|Midnight Judges"`
returns only an unrelated 1856 "Missouri Compromise" *era-event response label*
(`eraEvents1856.ts:118`), a `mo` state row, and a comment. There is **no
era-keyed authored proposal pool** (matches #221: the Legis-Prop/Pres-Action/
Gov-Action content SYSTEM is 0% built; bills today come from tiny inline
`templates` arrays). This thread is therefore a **sourcing record for the very
founding-era bill pool #221 says must be authored** — a useful corroboration that
the pool is designed/listed but unshipped.

---

## Candidate gaps for consolidation (mostly corroboration — no NEW gap)
Hand-off note for the consolidation agent. This is a record thread; it manufactures
no new delta — it **strengthens existing rows**:

- **Corroborates #221 (legislation-content registry):** confirms the founding-era
  **major-bill pool** is authored/curated ("Major Bills" tier) and **keyed to
  era + administration (president + party) + Speaker tenure**. Concrete founding-era
  bill names enumerated above are candidate seed entries for that pool. Reinforces
  the importance-curation tiering (only "major" bills counted) and the still-0%-built
  shipped status (spot-check above).
- **Corroborates #92 (era = content band, not calendar):** the run's Speaker/bill
  timeline runs behind real history and is **regenerated per-playthrough** (~50%
  Speaker match, POST 2-3); content spans all eras (founding→Great Society, POST 11).
- **Corroborates #240 (curated dataset of marquee figures):** the historical
  Speaker roster (Muhlenberg, Trumbull, Dayton, Sedgwick, Macon, Clay, Cheves,
  Varnum, Reed, Rayburn, Cannon, McCormick…) are pols the engine elects to
  leadership ⇒ they must exist in the curated draft rows.
- **Corroborates #1005 / #28 (Speaker office power arc):** designer notes that the
  early Speaker has "very little power" (Muhlenberg) and that Clay "transformed
  the Speakership into an office with actual powers" — the narrative behind the
  asymmetric Speaker on-win bundle. No NEW mechanic.

**Open question (minor):** is per-Speaker-tenure attribution a *modeled* field the
build should record (a history-tab "bills passed under Speaker X" rollup, as
vcczar mined from the 1840 history tab, POST 2), or purely a forum bookkeeping
convenience? Likely the latter (a derived view, not a content-model field) — flag,
do not promote to a gap unless it recurs.
