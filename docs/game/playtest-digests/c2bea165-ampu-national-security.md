# Digest — "AMPU National Security" (`c2bea165`)

**Type:** CONTENT-AUTHORING / crowdsourcing thread (politicslounge topic 1195, **Apr 2022**,
opened by **@vcczar**, tier-1 designer), **NOT a playthrough.** A policy-genre CONTENT drop
that **EXTENDS the policy-genre sweep** (sibling of `1bf19872-taxation`, `145db158-military`,
`518fb253-legis-props/exec/gov-actions`, environment / immigration / education / civil-rights /
welfare / banking / currency / etc.). **3 posts / 1 chunk** (chunk-001, all covered).
Source CSV ~2.5 KB.
**Why it matters:** adds the **National Security** policy genre to the corpus, **CORROBORATES**
the #221 three-primitive framework, and surfaces two sharp signals: (1) vcczar's explicit
**Pres-Actions = high-need / nearly-empty** flag plus **Gov-Actions = n/a**, the recurring
thinnest-primitive hole; (2) a **Privacy Amendment that "would disable most National Security
legislation"** — a clean **counter/repeal predicate** (one law turning OFF a whole class of
prior laws), the strongest example yet of #258-style content-state gating.
An **UNTAGGED** drop (no `L-/P-/G-` mechanism prefix, no era-band tag, no `Preq:` block — same
authoring stage as taxation/welfare/banking/currency/environment). An **authoring SNAPSHOT, not
designer-ratified final content.** Content primitives remain **0% shipped** (verified this run).

> **DIGEST-ONLY batch** — writes ONLY this file; touches no living doc (the gap log is owned by
> a later consolidation agent). No historian ran this batch; era framing is inferred from the
> content + standard US history.

---

## The National Security policy genre (the core artifact, POST 1) — UNTAGGED form

vcczar posts under the standard **three flat header partitions**, no schema tags, and leads with
the coverage diagnosis: *"Obviously, the high need area is Pres Actions."*

- **Legis Prop** — the dominant primitive, **~30 rows** (POST 1).
- **Pres Actions** — **1** (POST 1): **National Security Advisor** (the rest is an explicit hole —
  vcczar's flagged high-need band).
- **Gov Actions** — **n/a** (POST 1): **zero** authored. The thinnest-primitive hole in its most
  extreme form for this genre.

No mechanism prefix, no era-band abbreviation, no `Preq:` block — confirms the genre pipeline
still ingests raw pre-tag lists awaiting the schema-tagging pass. Era bands + prereqs are IMPLIED
by content but are NOT explicit fields.

### Legis Prop list (summarized by THEME, not pasted verbatim — POST 1)

The ~30 rows cluster into five themes:

- **Intelligence / law-enforcement INSTITUTIONS (the #66 agency-creation spine):** **Create FBI** ·
  **CIA** · **Director of National Intelligence** · **National Security Council** ·
  **National Security Advisor** (also the lone Pres Action) · **Insurrection Act of 1807** ·
  Subsidize **secret police**. — These are law-created standing institutions, hard era-gated by
  their real founding dates (see era span below).
- **Surveillance / civil-liberties EXPANSION (the modern-state cluster):** **4th Amendment** ·
  Legalize police & FBI **wiretapping** · allow FBI to **covertly search** homes/records/businesses
  of "potential threats" · **mass phone-data collection program** · subsidize **expansion of
  surveillance systems** · **permanent national security at airports** · same **at the borders**.
- **Theocratic / authoritarian / repressive (overlaps #236 alt-government "authoritarian kit"):**
  **Ban opposing parties** · subsidize **forced conversion** to the endorsed brand of Christianity ·
  **mandatory public prayer** · **mandatory church attendance** · **national pagan religion** from
  American folklore · **make president head of state religion** · **ban religious from office Amdt** ·
  **ban non-Christians from office Amdt** · **ban religion** (the opposite pole) · **nationalize all
  private media** · **ban material/art** opposing the state ideology · **remove all monuments** not
  tied to the state ideology · various bills to **round up specific groups** (atheists/agnostics/
  socialists/capitalists/…) · various bills to **deport political enemies**.
- **Funding two-pole lever (#221 modifier verbs / #248 opposed pair):** **Increase funding to Nat Sec**
  ↔ **Decrease funding to Nat Sec**.
- **Federalism / scope:** **Leave National Security to the states** (the right-pole denial / devolution
  spine; note this genre's RW non-modifier content is thin — same skew as taxation/environment).

### Community ADD-ONS (POSTs 2–3) — content inputs, all UNRATIFIED

- **POST 2** — **★ Privacy Amendment** (modern-era) that **"would disable most National Security
  legislation."** A **counter/repeal** primitive: one passed law that turns OFF a whole *class* of
  prior laws. The strongest in-corpus instance of content-state gating (a law's availability /
  active-status conditioned on another law) and the clearest demand for a "policy-active / repealed-by"
  predicate relationship — exactly the gap #258 names.
- **POST 3** (by @Timur) — **Ban watching/reading/listening to (or spreading) foreign propaganda media**
  (cites the real South Korea KCNA / North-Korea-TV law: illegal pre-1999, then legal to watch but not
  to spread) · **Make Freemasonry illegal** (Anti-Masonic Party analogue — an early-19c, ~1820s–30s row).

---

## Era span & predicate-gating (era-aware framing)

National-security content is intrinsically era-banded; this is the genre's headline structural
signal and makes era-bands + prereqs essential at schema-tag time. **No historian this batch** —
anchors from standard US history:

- **Founding / early band (~1772–1830s):** **4th Amendment** (1791) · **Insurrection Act of 1807** ·
  **Make Freemasonry illegal / Anti-Masonic** (~1820s–30s). These are the genre's only naturally
  *early* rows.
- **Modern / 20c+ band:** **FBI** (1908/1935) · **CIA** (1947) · **National Security Council** (1947) ·
  **National Security Advisor** (1953) · **Director of National Intelligence** (2004) · **mass
  phone-data collection** / wiretapping / covert-search / **airport security** (post-2001) · **Privacy
  Amendment** (modern, POST 2) · **nationalize private media** / state-religion / ban-parties items
  (modern authoritarian). The bulk of the genre is modern-gated — which is why **Pres Actions and
  Gov Actions (modern-heavy primitives) are the thin bands here**, dovetailing with vcczar's high-need
  flag and #206 (Future/modern under-content'd).
- **★ Predicate-gated examples implied INLINE (no explicit `Preq:` field):** Privacy Amendment →
  **disables a whole class of prior Nat-Sec laws** (a "policy-active / repealed-by" relationship —
  no current `Predicate` variant expresses "law X is active/passed/repealed") · CIA/DNI/NSC/airport
  security → era-window gates · Insurrection Act → 1807+ window · Anti-Masonic → ~1820s–30s window.

---

## Engine facts (verified this run, do not re-derive)

- `src/types.ts` `interface Legislation` (**1506–1520**) has only the 4-value `committee`
  (`Domestic | Foreign | Economic | Justice`) and **NO `subtype`, NO `policyGenre`, NO prereq/condition
  field** — confirmed. Cannot tag a "National Security" genre, cannot represent the funding
  increase↔decrease lever, and cannot represent the Privacy-Amendment-disables-prior-legislation
  relationship.
- The only `condition`-shaped construct is the serializable `Predicate` tree (`types.ts:1487–1504`:
  `yearAtLeast`, `eventCompleted`, `meterAtLeast`, `warActive`, `stateAdmitted`, `rosterHasSkill`, …)
  wired **ONLY** to the 2.4.3 era-event graph. **No variant expresses "a law is active / passed /
  repealed" or "an agency exists"** — so the Privacy-Amendment counter/repeal mechanic and the
  CIA/FBI/DNI "exists" gates are unrepresentable (same gap as #258).
- **No `policyGenre` / `presAction` / `govAction` / `subtype` / `prereq` / `nationalSecurity` / `FBI` /
  `CIA` / `surveillance` / `wiretap` / `insurrectionAct` / `secretPolice` / `freemason` token anywhere
  in `src/`** (grepped this run — zero hits). The three #221 content primitives + scripted-event
  registry remain **designed-only, 0% shipped.** **Pres Actions and Gov Actions as content primitives
  do not exist in the build at all** (so the lone "National Security Advisor" Pres Action has no shipped
  home, and the n/a Gov-Action band is moot).
- **The entire shipped legislation content library is 8 generic `BILL_TEMPLATES`**
  (`phaseRunners.ts:3420–3429`), randomly drawn for CPU factions (`phaseRunners.ts:3443–3458`). The
  closest security/justice-adjacent rows are **`Naval Expansion`** (Foreign; `military +1`) and
  **`Fugitive Slave Act Strengthening`** / **`Personal Liberty Law`** (Justice). There is **NO** FBI,
  CIA, DNI, NSC, NSA-advisor, Insurrection Act, surveillance, wiretapping, phone-data, airport/border
  security, secret-police, ban-party, state-religion, nationalize-media, deport/round-up, Privacy
  Amendment, or anti-Masonic bill anywhere in the build.
- **`Era` IS a shipped enum** — `'independence' | 'federalism' | 'nationalism' | 'modern'`
  (`types.ts:1337`) — and `'modern'` is used today **only** for trait/death-rate/scandal *scaling*
  tables (e.g. `types.ts:511`, `1080`), **NOT** for content gating. Shipped **scenarios are 1772 and
  1856 only** (`scenario1772.ts:69`, `scenario1856.ts:149`); there is no modern *scenario* despite the
  modern Era value existing, so the genre's modern-heavy content has no scenario to land in yet. → Net:
  pure design provenance; adds NO shipped behavior; **extends** the 0%-shipped policy-genre corpus by
  one genre (National Security) and adds the **first clean counter/repeal (policy-disables-policy)
  example** to the corpus.

---

## Candidate deltas for consolidation (map to EXISTING IDs — do NOT assign new numbers)

- **#221 (3-primitive content system + scripted-event registry)** — CORROBORATE, still **0% shipped.**
  Populates the primitives for a NEW genre (National Security): **L≈30 / P=1 / G=0** (POST 1) + 3
  community add-ons (POSTs 2–3). The funding increase↔decrease pair is a clean #221 modifier-verb lever;
  the agency-creation rows are #66 base-program instances. Source: POST 1–3.
- **#262 (content-COVERAGE / per-ideology + per-primitive balance)** — **STRONG CORROBORATE; headline.**
  vcczar's explicit ASK (POST 1, opening line): **Pres Actions are the high-need area** (only 1 authored),
  and **Gov Actions are n/a** (zero authored) — the **most extreme thin-primitive split in the sweep so
  far** (vs L≈30). Same recurring per-primitive imbalance flagged for taxation (P=2/G=3) and the
  518fb253 authoring call. Also a familiar **RW-non-modifier thinness** (the only clear right-pole row is
  "leave to the states"; the authoritarian items are an axis of their own, not balanced affirmative
  Cons/Trad content). Source: POST 1.
- **#258 (prereq / predicate-gated availability FIELD)** — **STRONG CORROBORATE; NEW emphasis on
  counter/repeal.** The **Privacy Amendment "disables most National Security legislation"** (POST 2) is
  the corpus's clearest case of **one law turning OFF a whole CLASS of prior laws** — a "policy-active /
  repealed-by" predicate relationship with **no existing `Predicate` variant**. Plus era-window gates for
  CIA/DNI/NSC/airport-security/Insurrection-Act/anti-Masonic implied inline. Demands the prereq field +
  a content-state predicate class ("law X active/passed/repealed", "agency Y exists"). Source: POST 1–3.
- **#236 (alt-government-form axis / "authoritarian kit")** — **STRONG CORROBORATE.** A large block of
  this genre IS the authoritarian/theocratic kit: ban opposing parties, state religion (multiple forms,
  incl. ban-religion as the opposite pole), nationalize media, ban dissenting art, secret police,
  round-up/deport political enemies. These are exactly the Fascist/Communist/Theocratic-USA primitives
  #236 describes — i.e. National Security is partly a delivery vehicle for the alt-gov bundle. Source: POST 1.
- **#248 (subtype taxonomy + sub-sections + multi-category tagging)** — CORROBORATE + ENRICH. Themes give
  natural sub-sections (intelligence-agencies / surveillance / theocratic-authoritarian / repeal-counter /
  fund-up↔fund-down) and an opposed two-pole pair (Increase ↔ Decrease Nat-Sec funding; ban-religion vs.
  state-religion as opposed poles). **Cross-genre overlaps to route, not double-count:** the agency/justice
  items overlap **Crimes/Punishments** (`e456b6b3`), **Civil Rights** (`9bd91ee2`), **Courts** (`a863421c`),
  and **Military** (`145db158`); state-religion items overlap any "religion" genre; foreign-propaganda ban
  (POST 3) overlaps **Diplomacy/Foreign Affairs** (`b8aecb83`, `a2312dd2`). Source: POST 1–3.
- **#66 (office/institution lifecycle, created-by-law)** — CORROBORATE. **FBI / CIA / DNI / NSC / National
  Security Advisor** are law-created standing institutions, era-gated by real founding dates; none exists in
  the build. The Insurrection Act is a standing statutory authority in the same family. Source: POST 1.
- **#206 (Era-of-Future / modern band under-content'd)** — CORROBORATE (modern-band variant). The genre is
  modern-heavy; the thin Pres/Gov bands are precisely the modern-leaning primitives, and there is **no
  modern scenario** to host them despite a shipped `modern` Era value. Source: POST 1 + engine facts.

---

## Open questions (for consolidation / the human)

1. **Counter/repeal mechanic representation** — how is "Privacy Amendment disables a CLASS of Nat-Sec
   laws" modeled? Per-law `repealedBy` tag, a genre-level "disabled-by" flag, or a content-state
   predicate the availability filter reads? No shipped construct expresses it today. (#258)
2. **Pres-Action high-need band** — vcczar flags it explicitly, but **no Pres-Action primitive exists in
   the build at all**; the authoring hole (1 row) compounds the engineering hole (0 support). Same for the
   n/a Gov-Action band. (#221-P / #221-G, #262)
3. **National-Security ↔ alt-government boundary** — the theocratic/authoritarian block straddles this
   genre and the #236 alt-gov kit. Filed under National Security, under alt-gov, or multi-tagged? (#236, #248)
4. **Genre boundary churn** — agency/surveillance/justice rows overlap Crimes/Punishments, Civil Rights,
   Courts, Military, and Diplomacy. Routing/multi-tagging unresolved. (#248)
5. **Authoring SNAPSHOT** — none of the rows are designer-ratified (no accept/reject replies in this short
   thread). Treat counts (L≈30 / P=1 / G=0) as floors, not finals. The list is also un-deduped (National
   Security Advisor appears as both a Legis Prop and the lone Pres Action).

---

### Provenance notes

- Single chunk; all 3 posts read (`manifest.json` posts=3 / chunks=1). Pure design/crowdsourcing log —
  no die-rolls, no playthrough mechanics, no GM accept/reject ledger. **vcczar** (tier-1) authors the
  genre + the high-need framing (POST 1, with the standard `@`-roster); POSTs 2–3 are community add-on
  proposals (Privacy Amendment; foreign-propaganda ban; anti-Masonic), none ratified in-thread.
- Codebase verified at `src/` HEAD 2026-06-29: `Legislation` (`types.ts:1506–1520`) has no
  `subtype`/`policyGenre`/prereq field; `Predicate` tree (`types.ts:1487–1504`) ships for era events only
  and has no policy-active/agency-exists variant; the entire bill library is 8 generic `BILL_TEMPLATES`
  (`phaseRunners.ts:3420–3429`) with no nat-sec content; **zero** nat-sec/content-primitive tokens in
  `src/` (grepped). `Era` enum includes `'modern'` (`types.ts:1337`) but only for scaling tables;
  scenarios shipped are **1772 + 1856 only**. The framework (#221/#236/#248/#258/#262/#206/#66) remains
  **0% shipped** — consistent with every sibling content drop.
