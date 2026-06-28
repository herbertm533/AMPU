# Digest — `f735601c` "AMPU Rules Update"

> **Batch (5-thread).** A short **rules-restructure + game-SETTINGS design
> thread** (Aug 28–31, 2021). 20 posts / 1 chunk (~14.7 KB). NOT a playtest —
> no in-game year is played. It is a **design conversation**: vcczar is breaking
> the monolithic rules doc into linked per-section documents and, in the process,
> deciding **what should become a togglable game SETTING vs. a fixed rule.**
> Two tier-1 outcomes worth pinning: (1) the **floated settings list** = the
> design origin of an options/settings model the build does not have, and (2) a
> **decisive command-skill ruling** (eligibility stays ability-gated, not
> trait-gated) plus **two new command-GAIN mechanics**.
>
> Authority: **vcczar** (designer) + **MrPotatoTed / "Ted"** (co-designer) =
> tier-1; **Cal** + **ConservativeElector2** = contributors. The
> "make-it-about-Chinese-history" exchange (POST 12–13, 15) is a **joke** — ignored.

## Scope & cast

| Field | Value |
|---|---|
| Type | Rules-restructure + settings-design discussion (no gameplay played) |
| Date | Aug 28–31 2021 (very early — pre-software, forum-rules era) |
| Tier-1 | vcczar (designer/final say), MrPotatoTed/Ted (co-designer, makes the pitches) |
| Contributors | Cal (rules-clarifier), ConservativeElector2 (pro-requirements) |
| Era band | None played. Examples cited: founding (Benedict Arnold path), early-republic (Lewis Cass / Michigan 1812–36). |

---

## A. ★ Candidate NEW gap — a game-SETTINGS / options system (design origin)

vcczar is, for the first time in the corpus, **explicitly designing a settings
menu**: start-of-game toggles that **gate engine rules**. The build today has
**no settings/options framework** — only scattered single toggles live as
separate gap rows (#171 draft-restriction, #213/#4/#232 draft-ideology, #115
boot setup, #238 gender-eligibility, #24/#115 what-if pool). **No umbrella
"options model" gap exists** → flag this thread as the design origin.

Full floated list (POST 1–3, 11):

| Proposed setting | Effect (gates which rule) | Source | Maps to existing |
|---|---|---|---|
| **Randomize politician start dates** | You never know when a given politician will arrive in a draft | POST 1 | NEW (no existing gap; vs. fixed `draftYear` = nearest mult-of-4 to birthYear+25) |
| **Allow politicians to move to any state** | Removes the home-state restriction on relocation | POST 1 | NEW (no existing relocation-freedom gap found) |
| **Turn off giving rookies a random trait** | Rookies enter without an auto-assigned trait | POST 1 | NEW (cross-ref rookie-trait/skill cluster) |
| **Women/minorities draftable before suffrage** | Lets disenfranchised figures into drafts pre-suffrage (rules say no; GMs had been leaving them in anyway) | POST 2–3 | **#238** (gender/suffrage-eligibility model) + **#24/#115** (what-if pool) |
| **Factions divided by party vs. draft-anyone-regardless-of-party** | Toggles the party-affiliation constraint on faction drafting | POST 2–3 | **#171** (draft-restriction toggle) / **#4** |
| **Leave "what if" candidates in** | Keep ahistorical "what-if" figures in the pool | POST 2–3 | **#24/#115** (curated what-if draft-pool toggle) |
| **Turn OFF ability requirements ("unrealistic mode")** | Disables ability prereqs for office eligibility | POST 11 | NEW toggle on **#182** (command-as-gate) — vcczar's ONLY concession (see §B) |

vcczar's framing (POST 11): "**no more overhauls**" — fundamental mechanic
changes are closed; he will only accept changes deliverable **as game settings**,
and wants the game **≥50% realistic**. So the settings model is the sanctioned
channel for ahistorical play. **The candidate NEW gap is the settings/options
SYSTEM itself** (a start-of-game options screen + the engine plumbing for each
toggle), distinct from the individual toggles already logged.

---

## B. ★ Command-skill ruling — SETTLED (tier-1, decisive)

**Ted's proposal (POST 7):** scrap `command` as the Pres/VP-eligibility gate
(too few ways to earn it, especially for non-rookies) and replace it with
**traits** — Charisma / Leadership / Celebrity / Debater / Likable / Orator;
likewise replace **`admin`** as the Secretary prereq with Leadership / Efficient
/ Egghead.

**vcczar REFUSED (POST 8, 10).** Settled ruling — **eligibility = abilities,
NOT traits**:
- Command **stays**. It is **deliberately rare and hard to earn**; that rarity
  is the point ("it's for those who have the personal ambition to run for
  president"). A no-command figure (Benedict Arnold) must wait for an event that
  grants the ambition/command.
- Abilities define the **RANGE of jobs** a politician can hold; **traits only
  enhance/hurt performance** within that range. (POST 8/10, 16)
- Trait-gating "doesn't make sense": plenty of real presidents/cabinet members
  have none of those traits — so traits can't be the gate.
- Rationale: ability gates keep **historical figures going where they belong**;
  remove them and "one might as well not have historical figures and just play
  the Political Process on Steam."
- Ted conceded ("you're the boss"); ConservativeElector2 agreed requirements are
  a good **play-incentive** (POST 16). Cal/CE2 wanted ahistorical fun (Senator
  Alito > Justice Alito, POST 9, 14) — addressed only via the setting below.

**vcczar's ONLY concession (POST 11):** a **game SETTING to turn OFF ability
requirements** for "very unrealistic play." This is the unrealistic-mode toggle
in §A. → **This is a ruling on the EXISTING command-as-gate design (#182), not a
new system.** It confirms #182's eligibility model is intentional and closes the
trait-gate alternative.

---

## C. Command-GAIN mechanics — NEW (capture)

Directly answering Ted's "too few ways to gain command" complaint, vcczar
**added two new command-acquisition paths** during the thread:

1. **Keynote Speaker at the Convention** (POST 17) — becoming the convention
   keynote speaker gives a **small chance of +1 command**, available to
   **ANYONE, even someone at 0 command**. This is the first documented
   bootstrap-from-zero command source that isn't a scripted event.
2. **Tiny % chance of command via certain career tracks** (POST 20) — some
   career tracks now carry a **small per-track chance to gain command**
   (explicitly "won't help Benedict Arnold" — he's not on a track that grants it).

Cal worked the timeline (POST 19) as a feasibility check: a no-command figure
(Arnold) could reach the presidency only by surviving to the Constitutional
Convention, passing the 12th-Amendment party-ticket/convention system, keynote
speaking (~1792), then winning (~1796) — i.e. command-gain is intentionally slow.

→ These are **NEW mechanics on existing systems** (the convention + career
tracks). Cross-ref: **#153** (command-gain canonical: rookies at 0 command +
doubled gain %), **#136/#143** (command rulings), **#163** (career-track
skill-growth seeding), **#182/#214/#215** (command as gate / in PV — the thing
these new sources feed). They are the **design origin of "earn command in-game"**
that #153 later doubles the rate of.

---

## D. Draft eligibility by territory status — rule clarification

Ted/Cal surfaced (POST 3–6) that politicians from a state **not yet organized
into a TERRITORY** currently **cannot be drafted at all** (they'd been bending
this in playtests for Vermont / Kentucky / Ohio figures).

**Designer intent (vcczar/Cal, POST 4–6):** such figures **CAN be drafted for
the MILITARY and CABINET (appointed roles)** but **CANNOT hold ELECTED office**
until their state achieves statehood. Worked example: **Lewis Cass** held posts
1812–36 (US Senator, Pres nominee, Sec of State) only **after** Michigan became
a state. The current rules wording (e.g. the Northwest Territory legislative
proposal: "politicians from this state can now be drafted") gates them at the
**pre-territory** stage, which vcczar called possibly **unintentional** —
"**I might change that**" (POST 6), i.e. relax the pre-territory bar.

→ **Ruling/clarification on EXISTING systems** (draft + territories). Cross-ref:
**#32** (cabinet-eligibility ties to state status — appointed side), **#33/#43**
(territory acquisition / statehood-by-bill), `admitState`
(`src/engine/territories.ts`), and the draft phase. The new nuance: split
eligibility by office TYPE — **appointed (mil/cabinet) allowed pre-statehood,
elected blocked until statehood** — with the pre-TERRITORY bar possibly to be
loosened.

---

## NEW systems vs. rulings — quick classifier

| Item | Kind | Existing-gap mapping |
|---|---|---|
| Settings/options SYSTEM (the menu + per-toggle engine plumbing) | **NEW system** | none — candidate NEW gap (design origin) |
| Randomize-start-dates / move-to-any-state / no-rookie-trait toggles | **NEW** (toggles) | none individually |
| Women/minorities-before-suffrage toggle | toggle | **#238** + #24/#115 |
| Factions-by-party vs draft-anyone toggle | toggle | **#171** / #4 |
| Leave-what-if-candidates toggle | toggle | **#24/#115** |
| Turn-off-ability-requirements ("unrealistic mode") toggle | toggle | NEW toggle on **#182** |
| Command stays the eligibility gate (not traits); admin stays Secretary prereq | **RULING** (existing) | **#182** (+ #214/#215) |
| Keynote-Speaker → +1 command (anyone, even 0) | **NEW mechanic** (existing convention) | #153 / #136 / #143 |
| Tiny % command via certain career tracks | **NEW mechanic** (existing tracks) | #163 / #153 |
| Pre-territory figures draftable for mil/cabinet but not elected office | **RULING/clarification** (existing) | #32 / #33 / #43 |

---

## Cross-references / gap-log impact (candidates — consolidation pass assigns numbers)

- **Candidate NEW gap:** a **game-SETTINGS / options SYSTEM** — start-of-game
  togglable options that gate engine rules. This thread is its **design origin**
  and supplies the **canonical floated list** (§A). No umbrella settings gap
  exists in game-context.md today (only scattered single toggles).
- **Corroborates / extends #182** (command = office-eligibility gate): vcczar's
  decisive refusal to trait-gate eligibility **settles #182's model as
  intentional**; the only escape hatch is the "unrealistic mode" SETTING.
- **Feeds #153 / #136 / #143** (command-gain rules): supplies the **origin** of
  in-game command acquisition (Keynote Speaker; career-track %) that #153 later
  formalizes (rookies 0-command + doubled gain %).
- **Cross-ref #163** (career-track skill-growth/seeding): a career track now
  carries a tiny command-gain %.
- **Cross-ref #238 + #24/#115 + #171 + #4** (gender/suffrage eligibility,
  what-if pool, draft-restriction toggle): the settings list maps onto these
  existing rows as **togglable** behaviors.
- **Ruling on #32 / #33 / #43** (state-status eligibility / territories): split
  draft eligibility by office type — appointed (mil/cabinet) allowed
  pre-statehood, elected blocked until statehood; pre-territory bar possibly to
  be relaxed.

## Open questions for the human

1. Should the **settings/options system** be one umbrella gap (a new-game options
   screen + per-toggle plumbing), or should each toggle remain folded into its
   existing rule-gap (#171/#238/#24/#182…)? This thread argues for an umbrella —
   the toggles share a single sanctioned channel ("changes only via settings,
   ≥50% realism floor, no more overhauls").
2. The **command-as-gate ruling (#182)** vs. the **per-trait PV revamp
   (#214/#215)**: traits don't gate eligibility but DO modify PV/performance — is
   that division still the intended model, or did a later thread revisit it?
3. Did vcczar ever **relax the pre-territory draft bar** (POST 6, "I might change
   that"), or does the appointed-only-pre-statehood rule stand? Affects the draft
   + `admitState` guards.
4. Are the **Keynote-Speaker** and **career-track** command-gain odds ever
   quantified beyond "small / tiny %"? #153's "doubled gain %" implies a base
   table exists somewhere downstream.
