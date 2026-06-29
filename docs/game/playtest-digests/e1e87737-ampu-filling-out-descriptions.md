# Digest — "AMPU: Filling out Descriptions" (`e1e87737`)

**Type:** DEV-LOG / authoring-progress journal (Nov 2021), **NOT a playthrough**.
**Batch 53** · 32 posts / 1 chunk · author: **@vcczar** (tier-1 designer); two
short replies from **@MrPotatoTed** (playtest partner).
**Why it matters:** mostly a low-signal progress log of vcczar filling in *description*
text for Legis Props / General Events / Scripted Events / Pres Actions / Gov Actions,
era by era (Independence → Federalism → Republicanism → Democracy → Manifest Destiny →
Nationalism). Three design rulings are buried in it (below). This is contemporaneous
with the #221 content-primitive authoring surface (cf. `518fb253`); it confirms the same
master-spreadsheet pipeline and adds a few structural details + one new ruling.

---

## Design facts (the signal)

1. **★ State-abolition → President appoints the governors (NEW ruling, POST 3).**
   *"Abolishing the states will now lead to the President appointing the governors.
   Originally, I had governor actions eliminated, but I think someone would fill this
   vacuum."* Establishes (a) a **state-abolition mechanic** (a state can be abolished —
   presumably via a Legis Prop / amendment) and (b) its **consequence**: governorship
   does NOT go vacant; the **President appoints** the governor (a federal-takeover /
   power-vacuum model), replacing the elected-governor + gov-action loop for that state.

2. **★ General Events restructured: narrative + name-templating + a TARGET column
   (POST 6-7).** The old **"descriptions"** field (how the event works) was renamed
   **"Special"**, and the **"notes"** field was *folded into* "Special" too. Net effect:
   **General Events now emit a narrative**, with **blank spots filled by the relevant
   person's name** (name-templated text). A **new column records who the general event
   goes to** — i.e. an explicit **event TARGET / recipient**, which *"sometimes [should]
   go to a faction leader."* So general events are person-/faction-scoped, not just
   global. (POST 8: old language is outdated → rewriting it; also **adding new general
   events keyed to newer traits**.)

3. **★ >1,000 Legis Props; many lack a deactivation date / "what turns them off"
   (POST 2, 31).** POST 2: *"A lot of these don't have the deactivation date and some
   don't specify what turns them off, so I'm making notes on each one."* POST 31:
   *"There's well over 1,000 of them"* (he was ~10% through writing descriptions). Two
   data points: (a) a **content-volume datum** — the Legis-Prop catalog is **1,000+**;
   (b) **deactivation-date + turn-off-trigger are an unfinished, being-formalized
   attribute** of each legis-prop (ties to predicate/availability + expiry modeling).

## Secondary / process notes

- **To-do: tutorial or per-phase pop-up tips** (POST 32, MrPotatoTed). Onboarding
  concern — *"President Infinity can be pretty overwhelming if you've never played
  before, hoping to make AMPU a little more user-friendly."* First mention of an
  onboarding/tutorial requirement.
- **Content pipeline = master spreadsheets**, edited era-by-era; MrPotatoTed then
  imports finished pages into the live playthrough (POST 4-5). Consistent with the
  spreadsheet-authoring model behind #221.
- **Authoring-side era taxonomy** observed (POSTs 9, 16, 20, 24, 26): Era of
  Independence, Federalism, Republicanism, Democracy, Manifest Destiny, Nationalism —
  more granular than the shipped 4-value `Era` enum (`independence|federalism|nationalism|
  modern`, `types.ts:1337`). Corroborates the era-band-granularity gap (cf. #92/#206).
- Scripted Events have **two authoring passes** — descriptions first, then a second
  draft "once they are in the CPU" (POST 11), and their language must match the option
  language (POST 11, 17). No mechanics revealed.

---

## Shipped-vs-designed (verified against `src/` HEAD, 2026-06-27)

All three design facts are **UNBUILT** in the current code (this is a Nov-2021 thread;
status below is the *current* build):

- **State-abolition + appointed-governor — ABSENT.** No abolish-state action/flag
  anywhere in `src/` (`grep -i aboli` returns only the **Abolitionists** interest group /
  **Abolition** ideology card — slavery-era, unrelated). Governors are **elected only**:
  `runPhase_2_9_5_Governors` (`phaseRunners.ts:3816`) runs `calcStateVote(...,'governor')`
  and assigns `s.governorId` to the winner; the only unlock is `governorsExist` at 2.4.3
  (`phaseRunners.ts:2861-2866`). **No President-appoints-governor path, no state-abolition,
  no power-vacuum consequence.** Gov-action phase `runPhase_2_5_2_Governors`
  (`phaseRunners.ts:3382`) merely skips states whose `governorId` is null.
- **General-event TARGET / recipient + name-templating — ABSENT.** `EraEvent`
  (`types.ts:1466`) has a `decider` field (`'president'|'congress'|'cabinet'|'cc-president'
  |'auto'` — who *resolves* it) but **no `target`/`recipientId`/`goesTo` field** and **no
  faction-leader-recipient concept**. No name-template / blank-fill mechanism exists
  (no `{name}` substitution on event/effect `text`; `description`/`text` are static
  strings). `EventEntry` (`types.ts:1439`, the log record) likewise has no target. There
  is no separate "General Event" type at all — the build ships `EraEvent` (scripted),
  `anytimeEvents`, `anytimeNationalEvents`.
- **Legis-prop deactivation-date / turn-off trigger — ABSENT (and no authored pool).**
  `Legislation` (`types.ts:1506`) is a **runtime instance** record (sponsor, votes,
  status, `effects`) — **no `deactivationDate`/`expiry`/`repeal`/`turnsOff` field**. The
  only expiry-like field in the file is `failedBidExpiresYear` (`types.ts:1289`, politician
  failed-bid cooldown — unrelated). There is **no era-keyed authored Legis-Prop catalog**
  of 1,000+ entries; bills are generated from tiny inline `templates` arrays
  (`continentalCongress.ts` CC bills; a modern proposer at `phaseRunners.ts:3426+`).
  Predicate machinery *does* exist for era-events only (`Predicate` type, `types.ts:1487`)
  — but it gates event availability, not legis-prop activation/deactivation.
- **Tutorial / per-phase pop-up tips — ABSENT.** No tutorial/onboarding/tip system in
  `src/pages` or `src/components`.

---

## Candidate gaps for consolidation (hand-off list)

*(Consolidation agent owns the gap-log edit. NEW vs CORROBORATES flagged.)*

- **State-abolition → President-appointed governors — NEW.** No existing gap covers a
  state-abolition mechanic or an *appointed* (vs elected) governorship. Distinct from the
  gov-action work in `518fb253`/#20 (that's elected-governor actions). Cite POST 3.
- **General-event TARGET/recipient + name-templated narrative — NEW (event-system).**
  Events today carry only a `decider`, no recipient and no name-templating. May attach to
  an existing event-system gap if one exists; otherwise new. Cite POSTs 6-8.
- **Legis-prop deactivation-date / turn-off-trigger — CORROBORATES #258**
  (predicate/availability + deactivation modeling) and the **legis-prop-volume** rows
  (content/#221/#262): adds the **1,000+** count datum and the explicit
  *"deactivation date + what turns them off"* per-item attribute. Cite POSTs 2, 31.
- **Authored Legis-Prop pool absent — CORROBORATES #221** (content-primitive registry;
  same finding as `518fb253`). The 1,000+ count quantifies the missing catalog. Cite POST 31.
- **Tutorial / per-phase pop-up tips — NEW (onboarding).** No prior onboarding gap noted
  in adjacent digests. Cite POST 32.
- **Authoring era-band granularity (6+ named eras vs shipped 4-value `Era` enum) —
  CORROBORATES** the era-granularity gap (#92/#206). Cite POSTs 9, 16, 20, 24, 26.

### Provenance notes
- Single chunk; all 32 posts read. Pure dev-log — no GM die-rolls, no playthrough
  mechanics, no rulings beyond POST 3. Most posts are bare progress markers ("finished
  Era X descriptions").
- Codebase verified at `src/` HEAD on 2026-06-27. Thread date Nov 2021 ⇒ all
  shipped-status calls above reflect the **current** build, not 2021.
