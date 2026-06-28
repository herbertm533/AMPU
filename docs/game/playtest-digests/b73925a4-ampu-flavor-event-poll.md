# Digest — b73925a4-ampu-flavor-event-poll ("AMPU Flavor Event Poll")

**Type:** POLL + DESIGN BRAINSTORM (not a playthrough). vcczar (tier-1) opens a
poll on whether to add a large bank of **flavor events** keyed to
businesses / brands / cultural institutions, and how they should fire. Thread
ends **deadlocked 10–10** and **deferred** ("wait until Anthony has coded more,"
POST 37). MrPotatoTed (Ted, tier-1) weighs in late (POST 38).
**Scope:** 39 posts / 1 chunk (chunk-001, all covered). Source CSV ~25.9KB.
April 10–11, 2025 (forum timestamps).

**Maps entirely to EXISTING gaps — no new gap IDs.** Primary corroboration for
**#221** (the scripted-vs-flavor tier flag) and **#261** (runtime firing budget /
cap); touches **#92**/**#206** (flavor events span all eras incl. Future).

---

## 1. What a "flavor event" IS (sharpens the #221 flavor tier)

A **flavor event** = a low-stakes, atmospheric scripted-event tied to a named
business / brand / cultural institution — a company founding, a product launch, a
cultural moment. It is the **cosmetic/narration sub-category** of the
scripted-event content system (#221): minimal-to-zero mechanical effect, pure
era ambiance. The opening post (POST 1, reposted POST 18) lists ~75 "A"-prefix
examples to set the SHAPE — businesses (7-Eleven, A&W, Amazon, Apple, Arby's,
Anheuser-Busch), media (20th Century Fox, ABC, AOL, Atlantic Records), tech (4chan,
Adobe Photoshop, Activision, Airbnb), finance/insurance (Allstate, AETNA, AIG,
American Express), sports leagues (ABA, AFL), and advocacy/cultural institutions
(ACLU, American Red Cross, Audubon Society, AWSA). Breadth, not the full list, is
the point.

**This pins the #221 tier flag from the OTHER side:** #221 already records that
vcczar's content model tracks *scripted (non-flavor)* events as modeled and treats
**flavor events as a deferred, narration-only tier**. This thread is the canonical
flavor-side source: it quantifies the tier and debates its firing rules.

**Tier-counts (POST 23, vcczar — the load-bearing number):** the current authored
bank is **2,484 events, of which 1,355 are ALREADY flavor events** (so ~55%
flavor today) vs ~1,129 non-flavor scripted events. The proposed brand bank is
**~4,300 more** (POST 2/13 say "over 4,000"), which would make the game
**5,655 flavor : 1,129 scripted** — vcczar's stated reason the all-fire design is
unworkable ("90%+ of players would just click OK to get through them," POST 23).

## 2. ★ Candidate flavor-event sub-type / flag (the design Q for consolidation)

Is "flavor" a first-class **content sub-type / tag** (e.g. an `isFlavor` boolean
or a flavor-event *category*) or does it just fold into #221's tier flag? The
thread points at a **first-class flag**, for two concrete reasons:

1. **It gates a player TOGGLE.** MrPotatoTed's ruling (POST 38, **tier-1
   decision**): *"I like the idea of having an on/off switch for flavor events
   that have no choices or impact on points. Great idea."* An on/off switch
   presupposes the engine can **identify** which events are flavor → a queryable
   flag. The toggle was first floated by Saucialiste (POST 24/38: a "skip other
   flavor events" box in the pop-up corner) so RP players keep ambiance and
   others skip it.
2. **vcczar's own definition couples flavor ⇔ "no choices / no point impact"**
   (echoed by Ted POST 38). So the flag is effectively *derivable*
   (`responses` empty / no `EraEventResponseEffect`) OR an explicit tag. Recommend
   logging it under #221 as: **flavor = an explicit content tag** (not merely
   "empty responses"), because the firing-budget rule (§3) needs to *select on it*
   independent of effects.

**Verdict for the gap log: fold into #221** as the flavor tier's concrete shape
(an explicit `isFlavor` / category tag + the player on/off toggle it enables),
rather than a brand-new row. No new architecture beyond #221's tier flag + a UI
toggle.

## 3. ★ The firing mechanism — random subset, NOT all-fire (sharpens #261)

The central debate is **how flavor events fire**, and it is a near-exact restatement
of the #261 firing-budget question, applied to flavor:

- **Shipped/current rule that blocks it (POST 10, vcczar):** *"all events are
  required to fire at some point in their era."* So a random-subset design
  **requires a NEW mechanism** — vcczar would *"make a new column in the
  spreadsheet"* marking events that fire only sometimes, with a per-event
  probability. He cites the existing tuning band: *"Most things are set for 5% to
  25% on any given half-term … some at 50% or 100%"* (POST 10) — i.e. a
  **per-event, per-half-term fire-probability field already exists** for non-flavor
  events; flavor events would get a low one (he muses 1% or 5%).
- **The popular community design (ShortKing POST 2/10, +1 by many — POST 22/23/29):**
  keep the **whole bank** (~4,300) but fire only a **limited random subset per
  playthrough**, split by era — *"one playthrough you get Arby's + Tesla, the next
  you get Amazon + SpaceX."* Explicitly framed as a **replayability** mechanic.
- **Brocklin POST 4 (+1 POST 19):** hybrid — some flavor events **"always firing,"**
  the rest random.
- **Saucialiste POST 29:** a concrete **cap** — *"no more than 40% flavor event
  per phase."*

**This directly informs #261's OPEN QUESTION** (is "5–15" a per-era authored-pool
bound or a runtime per-turn cap?): for *flavor* events the community + vcczar
converge on a **runtime per-playthrough random-selection budget** (a probability
field + a per-phase cap), NOT "author fewer / all fire." So #261's runtime-cap
interpretation is the live one for the flavor tier. Note the fallback the thread
agrees on if the mechanism is too costly: **author far fewer, higher-quality
events instead** (POST 13/22/23) — i.e. #261's budget is the lever that lets the
big bank exist at all.

## 4. Content-quality steer: prefer NARRATIVE/cultural arcs over "X was founded"

Strong, repeated minority steer (Vee01 POST 18/20/21/39, +Brocklin) that the
better flavor content is **multi-beat cultural/industry NARRATIVES**, not flat
"company X was founded" one-liners — examples: the **film industry → Hays Code →
*Gone with the Wind*** arc, the **1980s video-game crash**, spiritualist/theosophist
movements, Tom Thumb's fame, the murder of Stanford White. vcczar confirms **"I
have those too"** (POST 20) — so the flavor bank already contains both founding
one-liners AND cultural-arc events. *Design note for #221: flavor events are not a
monolith; the cultural-arc sub-kind overlaps the prereq-CHAIN shape (one beat
unlocks the next), same family as the Agriculture tech-tree / obscenity-doctrine
supersession chains already on #221 — but as low-stakes narration.* Cites
brand-foundation samey-ness as the risk to immersion (POST 21/39).

## 5. Eras & meta (corroborates #92 / #206)

- **Span all eras:** the proposed events are **"split by era"** (POST 2) — historical
  brands → modern (Tesla, SpaceX, Amazon) → implicitly Future. Reinforces #92
  (era = content band) and #206 (the Future band as a content frontier; flavor
  fills its atmospheric layer). No new era datum.
- **The Event phase is the delivery surface (POST 24, Saucialiste):** flavor events
  fire in the existing **Event phase** ("Oh, newsflash!" phase) — they don't
  interrupt mid-action (POST 26) — so no new phase is needed; they ride the shipped
  `EraEvent`/2.4.x pipeline (gated by the tier flag + budget).
- **No IP/real-brand-name concern was raised** in-thread (the named brands are real;
  nobody flagged trademark risk). **Open item** — worth a human call before
  shipping real brand names; not discussed here.
- **Mostly meta / off-topic tail (POST 5–9, 14–17, 24–35):** a long argument about
  whether "gamers" will complain that flavor events "do nothing" (OrangeP47, citing
  CK3 event-spam discourse; Vee01 counters CK3's problem is *too few* flavor events).
  vcczar's relevant ruling (POST 11): he will **only take feedback via this forum**,
  with respect rules. Not a mechanics datum; logged only as context for why the cap
  (§3) + toggle (§2) matter (pre-empt the "useless feature" complaint).

---

## 6. Shipped reality (verified — no re-derivation needed)

- The shipped event shape is **`EraEvent`** (`src/types.ts:1466`): `id`, `year`,
  `title`, `description`, `responses[]`, `decider`, `postEffects` — **a single
  uniform shape with NO `isFlavor` / tier flag and NO per-event fire-probability**.
- **No flavor-event category, no `isFlavor` flag, no firing-budget / per-phase cap,
  no player on/off toggle** exist anywhere in `src/`. The "all events fire once in
  their era" assumption (`game.eraEventsCompleted` / `eraEventsResolved`) matches
  vcczar's POST 10 statement of the current rule.
- The whole scripted-event content SYSTEM #221 governs is itself **0% shipped**.
- **Net:** everything in this thread — the flavor tier flag, the random-subset
  firing budget, the per-phase cap, the on/off toggle — is **0% built**; it
  sharpens existing 0%-shipped gaps (#221, #261), it does not reveal new
  architecture.

---

## Candidate gaps for consolidation (consolidation agent owns the gap-log write)

1. **[sharpens #221 — flavor tier]** Flavor events = the cosmetic/narration
   sub-category of scripted events: tie to a named business/brand/cultural
   institution; **no choices / no point impact** (vcczar + Ted's definition).
   Concrete shape to fold into #221: an explicit **`isFlavor` flag / flavor
   category** on the event record (so the engine can select on it) **+ a player
   on/off toggle** for flavor events (Ted's tier-1 ruling, POST 38). Current
   bank = 2,484 events / 1,355 already flavor (POST 23). Source:
   `flavorevent` POST 1, 18, 23, 24, 38.
2. **[sharpens #261 — firing budget, resolves its OPEN QUESTION for flavor]** The
   agreed flavor-firing mechanism is a **runtime random subset per playthrough**,
   NOT all-fire — requires a **per-event fire-probability field** (vcczar: a new
   spreadsheet column; existing non-flavor events already use 5–25% / 50% / 100%
   per-half-term, POST 10) **+ a per-phase cap** ("no more than 40% flavor per
   phase," POST 29). This is #261's *runtime per-turn cap* reading, confirmed for
   the flavor tier. Fallback if the mechanism is too costly: author far fewer,
   higher-quality events (POST 13/22/23). Source: `flavorevent` POST 2, 4, 10, 19,
   22, 23, 29.
3. **[sharpens #221 — content sub-kind]** Flavor content is not monolithic:
   prefer **multi-beat cultural/industry NARRATIVE arcs** (film→Hays Code→GWTW;
   1980s video-game crash) over flat "company X founded" one-liners — overlaps
   #221's prereq-CHAIN shape but at the flavor/narration tier. Source:
   `flavorevent` POST 18, 20, 21, 39.
4. **[corroborates #92 / #206]** Flavor bank is **era-split** and spans historical
   → modern → Future (Tesla/SpaceX/Amazon); fires via the existing **Event phase**
   (no new phase). No new era datum. Source: `flavorevent` POST 2, 24.
5. **[open question → human]** The proposed flavor events use **real brand/company
   names** (Amazon, Apple, Arby's, 4chan…); **no IP/trademark concern was raised
   in-thread** — flag for a human call before shipping real brand names. Source:
   `flavorevent` POST 1, 18 (absence of any IP discussion).
6. **[status / hygiene]** Thread DEADLOCKED **10–10 and was DEFERRED** ("wait until
   Anthony has coded more of the game," POST 37) — flavor events are **explicitly
   post-launch / lower-priority scope**, consistent with #221's "flavor = deferred
   tier." Do NOT treat the brand bank as committed in-scope content. Source:
   `flavorevent` POST 37.
