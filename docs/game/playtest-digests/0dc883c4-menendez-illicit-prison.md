# Digest — `0dc883c4-menendez-officially-in-prison` ("Menendez officially in prison")

> **MINOR FLAVOR / FEATURE-REQUEST thread, NOT a playtest.** 1 chunk / 4 posts /
> ~1.7KB (read in full). Prompted by the real Bob Menendez prison sentencing
> (Jun 17 2025). Citations are `===== POST n =====` markers. Raw chunk is
> gitignored/disposable; this digest is the durable record. Part of **batch 57**.
> Nick `menendez`.
>
> **★ Headline:** **theFreezerFlame** (POST 1) proposes that office-holding
> politicians with the **Illicit** trait get a **small chance of being removed
> from the game**, with flavor text *"[Politician], [age], has been sentenced to
> prison for corruption charges."* ("It would be kinda funny tbh.") **★ vcczar's
> ruling (POST 4):** *"There are already random events that can remove
> controversial politicians from office and/or the game."* → a
> controversial/scandal removal mechanic **already exists in the designed game**,
> so this is an **Illicit-targeted flavor refinement of an existing removal
> mechanic, NOT a new system.** (Jokes only: POST 2 "won't have any Illinois
> politicians left," POST 3 "You Blagojevich'ed him!")

---

## What it asks for (the only signal)

A **trait-targeted scandal-removal event:** condition on a politician (a) holding
office AND (b) having the **Illicit** trait → roll a **small chance** → **remove
from the game** with the corruption/prison flavor line. Net-new vs. the existing
removal mechanic = (1) it keys specifically on **Illicit** rather than generic
"controversial," and (2) the **prison-for-corruption flavor text**. The mechanism
itself (a random event that pulls a controversial pol from office/game) vcczar
says is **already present** in the designed game.

---

## Build-vs-design (code-verified, light)

- **"Illicit" trait — NOT shipped.** No `Illicit` token anywhere in `src/`
  (grep, 0 hits). The shipped `Trait` union (`src/types.ts:62-117`, 60 traits)
  has the **corruption-adjacent negatives `Corrupt` (100), `Scandalous` (101),
  `Controversial` (103)** but no `Illicit`. So "Illicit" is **forum/design
  vocabulary**; in the current build the nearest carriers are Corrupt/Scandalous/
  Controversial. (theFreezerFlame's "Illicit" likely = a design-side trait or an
  umbrella for these.)
- **Controversial/scandal REMOVAL event — vcczar says "already exist," but the
  current BUILD has NO scandal-driven removal.** What ships:
  - `src/data/anytimeEvents.ts` has a **`scandal-financial` / `scandal-sexual` /
    `scandal-verbal`** category bank (bribery, speculation, federal-investigation,
    affair, modern-misconduct, gaffe — lines 240-291, 360-386). Every one only
    **grants `Scandalous`/`Controversial` + a `pvHit`** — none removes the
    politician.
  - The effect union **does** include `{ kind: 'death' }` and
    `{ kind: 'forceRetire' }` (`anytimeEvents.ts:27-28`) — i.e. the **removal
    primitive exists**. But `death` is used by only **2 templates, both
    violence/accident** (assassination L236, small-plane-crash L170), and
    **`forceRetire` is defined but used by ZERO templates** (grep: 1 hit, the type
    decl only). `src/data/anytimeNationalEvents.ts` has a
    `civic-executive-scandal` Treasury-scandal event (L202-210) that likewise does
    not remove anyone.
  - **⇒ vcczar's "already exist" describes the DESIGNED game, not the shipped
    build.** The build has the removal *effect kind* and a scandal *event family*,
    but **no event that wires scandal/corruption → removal-from-game.** The wiring
    + the trigger probability are unbuilt.
- **Flavor text per-event — partially shipped.** Anytime events already carry a
  `text` field with `{first} {last} ({state})` interpolation (e.g. L283), so the
  prison flavor line is trivially expressible; the `[age]` token is not currently
  a template variable.

---

## Candidate deltas (consolidation agent owns the gap-log write)

1. **[attaches to EXISTING gap — the scandal/controversial-REMOVAL anytime-event
   (vcczar: "already exist" in design)]** A random event that **removes a
   controversial/scandalous politician from office and/or the game** is
   **designed** (POST 4) but **NOT shipped**: the build's scandal-* anytime events
   only grant `Scandalous`/`Controversial` + `pvHit` and never remove; the
   `forceRetire` effect kind (`anytimeEvents.ts:28`) is **defined-but-unused** and
   `death` is wired only to violence/accident. Requirement: wire a
   scandal/corruption → removal event (forceRetire/death) with a small trigger
   probability. Source: `menendez` POST 4; `anytimeEvents.ts:21-28, 240-291`.
2. **[attaches to EXISTING gap — the trait roster]** **"Illicit" trait is not in
   the shipped `Trait` union** (`types.ts:62-117`); design uses it as a
   corruption tag, build covers the space with `Corrupt`/`Scandalous`/
   `Controversial`. Open: is "Illicit" a missing trait to add, or an alias for the
   existing three? Source: `menendez` POST 1; `types.ts:100-103`.
3. **[GENUINELY NEW (small) — Illicit-targeted prison-corruption removal flavor]**
   The specific refinement: an **office-holder + Illicit-trait → small chance →
   removed from game**, with flavor *"[Politician], [age], has been sentenced to
   prison for corruption charges."* This narrows the (designed) generic
   controversial-removal to the Illicit trait and adds prison-corruption flavor +
   an `[age]` template token (not currently a variable). Low priority / "kinda
   funny." Source: `menendez` POST 1.

## Open questions

- Is **"Illicit"** a distinct trait to add, or shorthand for the existing
  `Corrupt`/`Scandalous`/`Controversial`? (POST 1, unresolved.)
- vcczar says removal events "already exist" — **in the forum/design build**; the
  current code does not implement scandal→removal. Confirm whether design intends
  it generic (any Controversial) or trait-gated (Illicit only). (POST 4.)
