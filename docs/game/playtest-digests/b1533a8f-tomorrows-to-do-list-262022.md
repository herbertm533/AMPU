# Digest — b1533a8f "Tomorrow's To-Do List 2/6/2022"

**Type:** CONTENT-AUTHORING / CHANGELOG (NOT a playthrough). Tier-1 dev **@vcczar**
posts a to-do + open crowdsourcing call on the PoliticsLounge forum (Feb 6–7,
2022); ~12 players + Discord reply with content ideas. **48 posts / 1 chunk (all
covered).** Two deliverables vcczar is authoring: (1) **alternate-government-form
content** — Pres Actions + Legis Props for if the USA *becomes* **Fascist /
Communist / Theocratic** (a NEW scenario/branch axis); (2) more **Era-of-the-
Future** content — Pres Actions, Legis Props, **Gov Actions, Scripted Events** —
**explicitly excluding** foreign-affairs / military / science / robots / tech
(POST 1, 14). Roughly posts 26–42 are an off-topic Nazi-and-religion flame war
(no game content); GM closes it at POST 42. Modern-era framing throughout.

---

## 1. The alternate-government-form axis (Fascist / Communist / Theocratic USA) — **NEW**

vcczar's POST-1/2 plan: *"Add pres actions and legis props for if the US becomes
Fascist, Communist, or Theocratic."* He treats each as a **government-form the
USA can transition INTO**, unlocking a distinct menu of Pres Actions + Legis Props
(and, per POST 20, also Scripted Events — he confirms he "added a ton of things
(haven't filled them out) to Pres Actions, Legis Props, Scripted Events"). This is
a registry/content addition layered on the existing Pres-Action/Legis-Prop content
spine (the #221 per-administration registry shape), **gated on a government-form
state flag** rather than on year/era.

**What vcczar does NOT specify in-thread (open questions, below):** the *trigger*
for becoming Fascist/Communist/Theocratic, and whether the resulting state is a
**win / loss / persistent branch**. He only solicits *content*, not the
transition rule or end-state semantics. The crowdsourced ideas strongly imply a
**playable branch** (you govern *as* the new regime), not an instant game-over.

### Model as authored (vcczar's own POST 43 is the authoritative content seed)
vcczar's POST 43 is the dev's own canonical list (others' posts are suggestions he
may cherry-pick). Key structural signals:

- **Fascist USA** (POST 43, +9/10/11/12 suggestions): Social Darwinism, Eugenics,
  ban on immigration, nationalization of all businesses, **"Fascist interpretation
  of the Constitution, abolish the Constitution, or replace it with a Fascist
  Constitution,"** state church (if Nazism, e.g. Positive Christianity), race-based
  citizenship, ban opposition parties, **dissolve Congress / transfer power to the
  President**. **Possible Leaders** named (Huey Long, Lindbergh, McCarthy, Rockwell,
  Duke…) — i.e. the branch has its own candidate pool.
- **Communist USA** (POST 43, +9/10/12): Marxism, **nationalization of all
  businesses**, universal healthcare, state media, **Personality Cult**, ban/restrict
  religion, internationalism, **"spread the revolution"** to Canada/Mexico, show
  trials, **"Blue Scare"** (capitalist analog of Red Scare — POST 9, endorsed POST
  13), "Socialism with American Characteristics," **Possible Leaders** named (Gus
  Hall, Angela Davis, Paul Robeson…). **NOTE ties to batch-31 Business/Labor
  "Communist → Nationalize Unions" prereq** — nationalize-X-sector is the recurring
  Communist Legis-Prop primitive here too (POST 9/10: "nationalize the agriculture
  sector… the healthcare sector, etc.").
- **Theocracy USA** (POST 43, +7/8/11/12): branches **by denomination/religion** —
  vcczar enumerates **Episcopalian (liberal: pro-LGBT, social justice, liberation
  theology), Evangelical (abortion ban, creationism in schools, anti-LGBT),
  Roman Catholic (Inquisition, Pope > political leader, anti-Protestant), Muslim
  (Sharia, hijab, ban apostasy), and (for fun) State Atheism (ban/tax religion,
  every policy dictated by Science).** Each sub-form carries its own
  fiscal/social policy vector. Simplest gating suggestion (POST 9/11): **only
  politicians with a `Theocrat` trait can hold office.** A player (POST 8) flags
  the hard coding problem: the engine "would have to know to assign one of these
  denominations to each politician" and form party splits along denominational
  lines.

**Cross-cutting government-form primitives that recur across all three** (the
reusable mechanics buried in the content): *ban opposition parties; dissolve/empower
the executive via constitutional amendment (POST 5: amendments that "'protect' and
'update' the constitution but in reality just give the president a metric-shitton of
power and make it extremely hard for other parties to win"); ban classes of
politicians from office (by ideology/race/religion); state media; secret police /
camps; transfer state power to the federal gov't.* These read as a **shared
"authoritarian-regime" Pres-Action/Legis-Prop kit** specialized per form.

**`GM⇒App`:** this is content the human dev hand-authored for a future build; the
branch state, its trigger, and its menu-gating are all engine work that does not
yet exist (see §3).

---

## 2. Era-of-the-Future non-tech content — **corroborates #206 / #221**

The thread's second purpose is filling the **Era-of-the-Future** proposal stub
(#206 = Future era is DOUBLY UNBUILT: under-content'd AND absent from the shipped
`Era` enum). vcczar explicitly scopes it to **NON-tech** content (POST 1, restated
POST 14): no foreign-affairs, military, science, robots, or tech-based items —
i.e. the Economic / Judicial / Domestic / Cultural-flavor categories of the
~2024–3000 band. (Players repeatedly ignore the constraint and suggest robots/
androids/fusion/Mars — POST 4/11 — which vcczar would filter out.)

Authored/solicited content categories (POST 1, refined POST 20):
- **Economic (2024–3000):** peak oil, post-capitalist thought, bailouts/banking,
  bubbles bursting (gold/bitcoin/stock/housing — POST 48), **"USCoin"** /
  bitcoin-as-official-currency vs. bitcoin dies (POST 6/47), abolition of currency →
  universal digital credit (POST 44), three end-state economic theories: mega-corp
  capitalism / mixed-market social-democracy / capitalism collapses → socialism
  (POST 47).
- **Judicial:** **congressional-election-system changes** (MMP, PR, Ranked-Choice,
  Parallel voting — POST 45), copyright-term extension (Disney lobby), legalize all
  drugs, US becomes officially bilingual (POST 45), election reform, drugs, guns,
  immigration, national security (POST 1).
- **Domestic:** service industry dies, **hustle/BYOC-app culture**, climate-change
  fork (slow down vs. suffocate), space tourism, **white-people-no-longer-majority →
  reactionary instability** (POST 6/47), Civil Service/education/environment/
  healthcare/infrastructure/welfare (POST 1).
- **Cultural / flavor (the explicitly-requested non-tech "color"):** music/art/
  literature/film evolution, **vocaloids as headline artists, hologram fashion,
  cyberpunk counterculture** (POST 44), futuristic fads/sports (low-gravity sports,
  space races — POST 22), new religions & spiritualities rise, gender norms
  liberalize, **"Future Shock," "Back to the Land movement II"** (POST 9),
  earthworm-flavored ice cream / world-fusion music (POST 45), a joke **"Tom Brady
  retires (2020–2099)"** event (POST 20).
- **Optimistic / utopian "more perfect union" (POST 20 ask, 22/44 answers):**
  e-democracy (citizens vote on everyday legislation online), cure cancer/world
  hunger, age-enhancement, one-world utopian government, universal world language,
  ocean/Antarctic terraforming. (vcczar wanted explicitly *non-dystopian* future
  content to balance the dark branches.)

**`GM⇒App`:** corroborates that the Future era is a **content-authoring frontier**
the dev is actively populating (matches #221 "content stops cold at Biden/2022"
and the #206 stub). No new architecture beyond what #206/#207 already log.

---

## 3. Shipped-vs-designed (spot-read of `src/`)

- **No government-form branch exists.** Searched `fascist|communist|theocra|
  governmentForm` (case-insensitive) across `src/` → the ONLY hit is a
  **`Theocrats` faction** in `src/data/factions1856.ts:28` (one entry in a faction
  list — a pressure-group faction, NOT a USA-government-form state). No Fascist /
  Communist / Theocratic *regime* flag, transition, or menu anywhere. **Flag for
  tech-lead: the entire alternate-government-form axis is unbuilt.**
- **No Pres-Action / Legis-Prop / Gov-Action / Scripted-Event content system at
  all.** Searched `presAction|legisProp|govAction|scriptedEvent` (+ Pascal-case) →
  **zero files.** The content primitives this whole thread authors *for* do not
  exist as engine concepts in the shipped build. (Shipped content lives in
  `eraEvents1772.ts` / `eraEvents1856.ts` / `anytimeEvents.ts`, a different shape.)
- **No Era-of-the-Future scenario/era.** Only two scenarios ship
  (`scenario1772.ts`, `scenario1856.ts`); no 2024–3000 band, no Future `Era` enum
  value — confirms #206. No end-condition / win-loss / collapse logic tied to
  government form (the `collapse` hits in `anytimeEvents.ts` are flavor strings).

Net: this thread is **100% designed-intent, 0% shipped**; it widens the
designed-vs-built gap rather than closing any.

---

## Candidate gaps for consolidation (hand-off to the consolidation agent)

**NEW**
- **[NEW — government-form axis] Alternate-government-form scenarios (Fascist /
  Communist / Theocratic USA).** The USA can *transition into* a non-democratic
  government form, each unlocking its own Pres-Action/Legis-Prop (+Scripted-Event)
  menu and (for the named regimes) candidate pool; **Theocracy further branches by
  denomination** (Episcopalian/Evangelical/Catholic/Muslim/State-Atheism), each with
  a distinct policy vector. **Unbuilt in `src/` (only a `Theocrats` faction exists).**
  Shared "authoritarian kit" primitives: ban opposition parties, dissolve/empower
  executive via amendment, ban classes of politicians from office, state media,
  nationalize sectors. Source: b1533a8f POST 1/5/8/9/20/43. *Distinct from the
  existing gap-log "communist" rows (#354 / gap #6), which are mid-era social-
  MOVEMENT factions, NOT a government-form state of the USA — flag the distinction.*
- **[NEW — open question for the axis] Government-form transition trigger +
  end-state semantics UNSPECIFIED.** Thread authors *content* but not what triggers
  the transition, nor whether the resulting regime is **win / loss / persistent
  branch**. Players (POST 3) speculate triggers (Business-Plot / FDR-figure /
  governmental incompetence → local fascist movements). Touches the #88/#188
  end-condition model. Needs a dev ruling.

**CORROBORATES**
- **Corroborates #206 / #221:** Era-of-the-Future content actively being authored
  (Economic / Judicial / Domestic / Cultural-flavor + an optimistic-utopian
  category), explicitly **non-tech / non-foreign / non-military**. No new
  architecture beyond #206/#207. Source: POST 1/6/9/20/44/45/47/48.
- **Corroborates batch-31 Business/Labor "Communist → Nationalize Unions" prereq:**
  "nationalize sector X" is the recurring Communist Legis-Prop primitive here too
  (agriculture/healthcare/all-business). Source: POST 9/10/43.

**Open questions (forum-unanswered):**
1. Trigger condition(s) for each government-form transition.
2. Win / loss / branch status of each regime end-state.
3. How the engine assigns a **denomination** to each politician for the Theocracy
   branch and forms denominational party splits (POST 8 raises this as the hard part).
4. Whether `Theocrat` is the gating trait for the Theocracy branch (POST 9/11) — and
   how it relates to the existing `Theocrats` faction in 1856.
