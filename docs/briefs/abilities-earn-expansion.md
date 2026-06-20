# Brief: Abilities Earn Expansion (PR2b)

## Approach

Close the **earn** half of the ability lifecycle — the mirror of PR2a's loss
machinery. Politicians' six abilities now grow at the ~9 marquee career
milestones the reference's Earn lists name, using one tuning const, two
parallel lookup tables (placed alongside PR1's `OFFICE_EXPERTISE` /
`COMMITTEE_EXPERTISE`), and **two new exports added to the existing
`src/engine/abilities.ts`** — `addSkillPoint(p, key, amount): boolean` and
`addCommandPoint(p, amount): boolean`, the precise inverses of PR2a's
`loseSkill` / `loseCommand` (clamp at **5**, return `true` iff the value
actually rose, so callers gate their `addLog` on a real change). Every grant
fires at an existing phase hook with a 2–4 line "look up the const, call the
helper, log on real change" pattern. The F-DOUBLING ladder (`+1/+2/+2/+4` for
cabinet confirmation under Egghead/Efficient) is applied **at the call site**
in `runPhase_2_3_1_Cabinet` — the helper stays pure and probability-free, the
amount is computed from the picked politician's traits and routed through
`addSkillPoint`'s real-change boolean (so a politician already at admin=5
silently no-ops on the +4 grant). The single new random roll — the secondary
career-track skill in `rollThreshold` — uses `chance()` from `src/rng.ts`; no
new `Math.random` is introduced.

**Locked guardrails (do not relitigate):** PV formula untouched
(`src/pv.ts:65–87`); no Use gate changed (presidential `command >= 2`,
SCOTUS `judicial >= 2`, Gen `military >= 3`, Adm `military >= 2`, sponsor
`legislative >= 1`); no new field on `Politician` or `GameState`; no
migration / `repair()` change; PR1's `addExpertise` grants remain in place at
the existing chair/cabinet sites (the earn grant slots in **beside** the
expertise grant, both guarded by their own boolean). PR2b ships as **one
PR** (spec Q1 ONE PR/Option A) — the ~9 hooks are all independent +1/+2/+4
grants at established phase boundaries; sub-splitting would only fragment a
mechanical pattern.

**Alternative rejected — a probability-bearing earn helper.** A
`gainSkill(p, key, chance)` that rolled internally would centralize odds but
break the pure-helper invariant PR2a established and PR1's `addExpertise`
precedent. Keeping the helper a pure clamp-and-ceiling primitive and rolling
at each call site (only one call site rolls — `rollThreshold`'s secondary —
the rest are guaranteed-on-trigger) is the chosen design and matches the
exact shape of `loseSkill` / `loseCommand` for symmetry.

## State & type changes

### `src/types.ts` — new tuning const + two parallel lookup tables, no type/interface change

Add **immediately after** `ABILITY_LOSS_RULES` (closes at `types.ts:464` with
`} as const satisfies …`) and **before** `ANYTIME_EVENTS_RULES` (line 466).
This keeps the loss/earn tunings adjacent (mirroring PR1's `OFFICE_EXPERTISE`
/ `COMMITTEE_EXPERTISE` adjacency to the `OfficeType` declaration).

```ts
export const ABILITY_EARN_RULES = {
  // Independent secondary-skill roll inside rollThreshold (AC #12 / Q2c).
  // Half of CAREER_ODDS.skill (= 0.5), so secondaries accrue at half the rate
  // of primaries; the existing primary roll is unchanged.
  secondaryTrack: 0.25,
  // Cabinet confirmation -> admin (AC #15 / F-DOUBLING). Ladder:
  //   none           -> base                    = 1
  //   Egghead alone  -> base * eggheadMult      = 2
  //   Efficient alone-> base * efficientMult    = 2
  //   both           -> base * both mults       = 4
  // Computed at the call site:
  //   amount = base * (Egghead ? eggheadMult : 1) * (Efficient ? efficientMult : 1)
  // Clamped at 5 by addSkillPoint; a politician at admin=4 with both traits
  // jumps to 5, not 8, and the helper returns true on the single 4->5 rise.
  cabinetConfirmAdmin: {
    base: 1,
    eggheadMult: 2,
    efficientMult: 2,
  },
  // Every other earn site grants the literal +1 (no const slot needed); the
  // F-RECONCILE table names them and the call sites pass `1` directly.
} as const satisfies {
  secondaryTrack: number;
  cabinetConfirmAdmin: { base: number; eggheadMult: number; efficientMult: number };
};

// Office -> command grant on initial appointment (AC #8). Only Secretary of
// State today (the reference's "initial appointment to Secretary of State"
// Command Earn). PMG and KeyAdvisor deliberately absent.
export const OFFICE_COMMAND_GRANT: Partial<Record<OfficeType, number>> = {
  SecretaryOfState: 1,
};

// Office -> admin grant on cabinet confirmation (AC #15). The F-DOUBLING
// ladder is applied at the call site (see ABILITY_EARN_RULES.cabinetConfirmAdmin);
// the value here is the BASE (1). All six positions iterated by
// runPhase_2_3_1_Cabinet are included (Q5 IN).
export const OFFICE_ADMIN_GRANT: Partial<Record<OfficeType, number>> = {
  SecretaryOfState: 1,
  SecretaryOfTreasury: 1,
  SecretaryOfWar: 1,
  AttorneyGeneral: 1,
  PostmasterGeneral: 1,
  KeyAdvisor: 1,
};

// Career-track exit -> secondary skill pool (AC #13, corrected per the
// reference: "all other tracks but Legislative grant Admin" -> Legislative
// track does NOT grant Admin as a secondary). Judicial and Backroom are []
// because the reference's per-ability Earn lists do not include them as
// secondary-granters.
export const TRACK_SECONDARY_SKILLS: Record<CareerTrack, SkillKey[]> = {
  Administration: ['legislative', 'governing'],
  Military:       ['admin'],
  Governing:      ['admin', 'legislative'],
  Legislative:    ['governing'],     // admin EXCLUDED per source text
  Judicial:       [],
  Private:        ['governing', 'admin'],
  Backroom:       [],
};
```

`OfficeType`, `CareerTrack`, and `SkillKey` are all declared above this point
in `types.ts`. The `Partial<Record<OfficeType, number>>` shape mirrors PR1's
`OFFICE_EXPERTISE` exactly. No `Era`-keyed exhaustiveness is needed.

### Save / migration impact

**None.** AC #22: PR2b adds no field to `Politician`, `GameState`, or any
snapshot type, and requires **no `repair()` change**. It only reads/increments
existing `skills` / `command` and adds constants + helper exports + grant
sites + log lines. Old IndexedDB saves load and play unchanged; they simply
begin to accrue earn going forward (a politician at command 5 from an old
save silently no-ops on every grant via the cap-bounded helper). The cap (5)
and PR2a loss-helper semantics are unchanged.

## Engine changes (pure logic)

All deterministic over the snapshot. **One** new `chance()` call (the
secondary-track roll); every other grant is guaranteed-on-trigger. No
`Math.random` added anywhere (PR2a's two pre-existing `Math.random` calls at
`revolutionaryWar.ts:88,96` remain out of scope; AC #12 secondary roll uses
`chance` from `src/rng.ts`).

### `src/engine/abilities.ts` — extend, do not replace (AC #3)

Add two pure exports beside the existing `loseSkill` / `loseCommand`
(`abilities.ts:1–20`). Same contract, opposite direction: clamp to **5**,
return `true` iff the value actually rose.

```ts
// Increment a skill by `amount` (default 1), capped at 5. Returns true iff
// the value actually rose, so callers gate their addLog line on a real change.
// Pure: probability is decided at the call site, never here.
export function addSkillPoint(p: Politician, key: SkillKey, amount = 1): boolean {
  const next = Math.min(5, p.skills[key] + amount);
  if (next === p.skills[key]) return false;
  p.skills[key] = next;
  return true;
}

// Same contract for the separate `command` field.
export function addCommandPoint(p: Politician, amount = 1): boolean {
  const next = Math.min(5, p.command + amount);
  if (next === p.command) return false;
  p.command = next;
  return true;
}
```

Use `Math.min(5, …)` directly (no import of a `clamp` helper) — matches
PR2a's `Math.max(0, …)` floor pattern exactly, keeps the module
dependency-free.

### `src/engine/phaseRunners.ts` — six insertion points + the import

**Imports.** Extend the existing types-side import at **line 2**: add
`ABILITY_EARN_RULES, OFFICE_COMMAND_GRANT, OFFICE_ADMIN_GRANT,
TRACK_SECONDARY_SKILLS` to the named list. Extend the helper import at
**line 5**: from `'./abilities'` add `addSkillPoint, addCommandPoint`. (Line
5 already imports `loseSkill, loseCommand`.) `chance`, `pick`, `clamp` are
already imported from `'../rng'` (line 6).

---

**(a) `rollThreshold` — secondary-skill roll (AC #12, #13, #14).**
`phaseRunners.ts:295–341`. Insert the secondary roll **after** the primary
skill roll (closes at line 313) and **before** the themed-trait roll (line
318). The primary roll is unchanged; the secondary is independent (the same
politician can gain both in one threshold). Pool is filtered to `< 5` so a
maxed candidate is dropped; an empty pool is a silent no-op (matches the
themed-trait pool-empty behavior at line 320). On a successful pick the
helper increments and `recordCareerGain` (line 277–291) tags it as
`'skill'`, surfacing it in the existing career-gain feed.

```ts
  // 1b. Secondary skill (PR2b — half the primary's odds, lower curve).
  // TRACK_SECONDARY_SKILLS[track] is the corrected reference table:
  // Judicial/Backroom -> [] (silent no-op); Legislative omits admin per the
  // source's "all other tracks but Legislative grant Admin" wording.
  if (chance(ABILITY_EARN_RULES.secondaryTrack)) {
    const pool = TRACK_SECONDARY_SKILLS[track].filter((k) => p.skills[k] < 5);
    if (pool.length > 0) {
      const k = pick(pool);
      if (addSkillPoint(p, k, 1)) {
        recordCareerGain(snap, p, thresholdYears, 'skill', k, false);
      }
    }
  }
```

`addSkillPoint` returns `false` only if already at 5 (filtered out of `pool`
by construction), but the boolean guards a future-proofing edge and matches
PR2a's idiom. No `addLog` line here — the career-gain feed is the surface
(consistent with the existing primary roll at lines 301–313, which also
writes `recordCareerGain` but no `addLog`).

---

**(b) `runPhase_2_2_1_CongressLeadership` — Speaker / Pro Tem (AC #17).**
`phaseRunners.ts:1679–1711`. The phase is era-split: the `independence`
branch returns at line 1684 after `electCCPresident(snap)` — **no PR2b
grant** in the CC branch (CC President's command grant is already covered;
F-RECONCILE row). Insert after the existing Speaker addLog (~line 1702) and
after the Pro Tem addLog (~line 1709), gated on a **real change** of
`snap.game.speakerId` / `snap.game.proTemId`. The code currently assigns
without diff-checking; capture the prior value at the top of the function:

```ts
export function runPhase_2_2_1_CongressLeadership(snap: FullGameSnapshot): void {
  if (snap.game.currentEra === 'independence') {
    if (snap.game.continentalCongress === null) return;
    electCCPresident(snap);
    return;
  }
  const formerSpeakerId = snap.game.speakerId;
  const formerProTemId  = snap.game.proTemId;
  // ... existing senate/house majority + sort ...
  if (speakerCandidate) {
    snap.game.speakerId = speakerCandidate.id;
    addLog(snap, '2.2.1', 'appointment', `${speakerCandidate.firstName} ${speakerCandidate.lastName} elected Speaker of the House.`);
    if (speakerCandidate.id !== formerSpeakerId && addSkillPoint(speakerCandidate, 'legislative', 1)) {
      addLog(snap, '2.2.1', 'appointment',
        `${speakerCandidate.firstName} ${speakerCandidate.lastName} gains Legislative from the Speaker's gavel.`);
    }
  }
  if (proTemCandidate) {
    snap.game.proTemId = proTemCandidate.id;
    addLog(snap, '2.2.1', 'appointment', `${proTemCandidate.firstName} ${proTemCandidate.lastName} elected Senate Pro Tempore.`);
    if (proTemCandidate.id !== formerProTemId && addSkillPoint(proTemCandidate, 'legislative', 1)) {
      addLog(snap, '2.2.1', 'appointment',
        `${proTemCandidate.firstName} ${proTemCandidate.lastName} gains Legislative from the Pro Tem chair.`);
    }
  }
}
```

A tick that re-elects the same Speaker/Pro Tem is a no-op (the id check
fails before the helper runs). A different politician already at
`legislative 5` writes the office addLog (existing) but no gain addLog (the
helper returns false).

---

**(c) `runPhase_2_2_2_Committees` — chair grants (AC #6).** Both era paths:

- **1856+ branch** (`phaseRunners.ts:1726–1737`). The PR1 expertise grant
  already lives at line 1732–1735. Add command/legislative grants **next to**
  the expertise grant, all three guarded by their own real-change boolean.
  Each chair can fire up to **three** logs (command, legislative, expertise),
  in addition to the existing appointment log:

  ```ts
  if (candidate) {
    snap.game.committeeChairs[c] = candidate.id;
    addLog(snap, '2.2.2', 'appointment', `${candidate.firstName} ${candidate.lastName} chairs ${c} committee.`);
    if (addCommandPoint(candidate, 1)) {
      addLog(snap, '2.2.2', 'appointment',
        `${candidate.firstName} ${candidate.lastName} gains Command from chairing ${c}.`);
    }
    if (addSkillPoint(candidate, 'legislative', 1)) {
      addLog(snap, '2.2.2', 'appointment',
        `${candidate.firstName} ${candidate.lastName} gains Legislative from chairing ${c}.`);
    }
    const xp = COMMITTEE_EXPERTISE[c];
    if (addExpertise(candidate, xp)) {
      addLog(snap, '2.2.2', 'appointment',
        `${candidate.firstName} ${candidate.lastName} gains ${xp} expertise.`);
    }
  }
  ```

  Note: the 1856+ phase re-runs every half-term and picks the **top-PV
  same-stat** member each time — it can repeatedly select the same person.
  The cap-bounded helper handles this correctly (5/5 silently no-ops); no
  diff-check needed for this path because committee-chair-on-self is itself
  the grant event (per the reference's "appointment to committee or
  committee chair" wording). This is the same idempotency stance PR1 took.

- **1772 CC branch** in `appointCCCommittees` (`continentalCongress.ts:152–
  175`). PR1 grants expertise per-chair via the `grantChair` local helper at
  lines 163–169. Extend `grantChair` to **also** grant command and
  legislative, each via its own real-change boolean:

  ```ts
  const grantChair = (pol: Politician | undefined, xp: 'Welfare' | 'Foreign Affairs' | 'Economics' | 'Justice'): string | null => {
    if (!pol) return null;
    if (addCommandPoint(pol, 1)) {
      addLog(snap, '2.2.2', 'appointment',
        `${pol.firstName} ${pol.lastName} gains Command from chairing ${xp === 'Welfare' ? 'Domestic' : xp === 'Foreign Affairs' ? 'Foreign/Military' : xp === 'Economics' ? 'Economic' : 'Judicial'}.`);
    }
    if (addSkillPoint(pol, 'legislative', 1)) {
      addLog(snap, '2.2.2', 'appointment',
        `${pol.firstName} ${pol.lastName} gains Legislative from the committee chair.`);
    }
    if (addExpertise(pol, xp)) {
      addLog(snap, '2.2.2', 'appointment', `${pol.firstName} ${pol.lastName} gains ${xp} expertise.`);
    }
    return pol.id;
  };
  ```

  Add `addCommandPoint, addSkillPoint` to the existing helper import at
  `continentalCongress.ts:3` (currently `import { addExpertise } from
  './expertise';` — add `import { addCommandPoint, addSkillPoint } from
  './abilities';`).

---

**(d) `runPhase_2_2_3_FactionLeaders` — install + challenge-success (AC #4,
#19).** `phaseRunners.ts:1743–1903`. The phase has three relevant paths;
**only Step 2 install** (`1807–1820`) and **Step 3 challenge-success**
(`1860–1872`) fire grants. The Step 4/5 invariant sweep
(`1885–1897`) is intentionally skipped (no leadership *transition* occurs
there; the spec Edge case "First install vs. re-validation" is binding).

Each transition fires **four** grants — `command +1`, `legislative +1`,
`governing +1`, `admin +1` — each via its own helper-with-boolean check;
each that actually rises writes one `addLog`. A leader already at four-caps
silently no-ops on all four; a fresh leader below all caps gets four lines.

**Helper-side simplicity.** Define a small private helper near the top of
`runPhase_2_2_3_FactionLeaders` to keep the call site DRY (mirrors PR2a's
`applyBattleLoss` shape):

```ts
function applyFactionLeaderGrants(snap: FullGameSnapshot, p: Politician, factionName: string): void {
  if (addCommandPoint(p, 1)) {
    addLog(snap, '2.2.3', 'appointment',
      `${p.firstName} ${p.lastName} gains Command leading the ${factionName}.`);
  }
  if (addSkillPoint(p, 'legislative', 1)) {
    addLog(snap, '2.2.3', 'appointment',
      `${p.firstName} ${p.lastName} gains Legislative leading the ${factionName}.`);
  }
  if (addSkillPoint(p, 'governing', 1)) {
    addLog(snap, '2.2.3', 'appointment',
      `${p.firstName} ${p.lastName} gains Governing leading the ${factionName}.`);
  }
  if (addSkillPoint(p, 'admin', 1)) {
    addLog(snap, '2.2.3', 'appointment',
      `${p.firstName} ${p.lastName} gains Admin leading the ${factionName}.`);
  }
}
```

Place it as a module-level `function` (after `recordFactionLeadership` at
~line 1476) so it's in scope. Then call **once** in Step 2's `if (winner) {
…; newSeats++; }` (after the existing addLog at `1818–1819`):

```ts
applyFactionLeaderGrants(snap, winner, f.name);
```

And **once** in Step 3's `if (chance(successChance)) { … unseated++; }`
branch (after the existing addLog at `1870–1871`):

```ts
applyFactionLeaderGrants(snap, challenger, f.name);
```

The Step 3 **loss** branch (`1873–1882`) does **not** grant — the challenger
did not become leader. The Step 5 invariant log at `1895` (no-eligible-leader
edge) does not grant — no transition occurred.

---

**(e) `runPhase_2_2_4_PartyLeaders` — install + re-election (AC #5, #7, #20).**
`phaseRunners.ts:1908–1925`. The phase has two paths inside the
`for (const party of snap.parties)` loop:

1. **President-as-leader shortcut** (lines 1910–1915): assigns
   `party.leaderId = pres.id` and `continue`s; **no existing addLog** in this
   branch.
2. **Top-PV fallback** (lines 1917–1923): sorts members by `pvCache` and
   assigns; logs `"X leads the Y"` only.

Both paths can be either an **install** (the politician was not previously
party leader) or a **re-election** (same `leaderId` as the prior tick). Per
spec Q8: **the install fires `command +1` and `governing +1`; a re-election
of the same leader fires `legislative +1`**. Capture the prior id and
distinguish:

```ts
export function runPhase_2_2_4_PartyLeaders(snap: FullGameSnapshot): void {
  for (const party of snap.parties) {
    const formerLeaderId = party.leaderId ?? null;
    if (snap.game.presidentId) {
      const pres = snap.politicians.find((p) => p.id === snap.game.presidentId);
      if (pres && pres.partyId === party.id) {
        party.leaderId = pres.id;
        applyPartyLeaderGrants(snap, pres, party.name, formerLeaderId);
        continue;
      }
    }
    const members = snap.politicians.filter((p) => p.partyId === party.id);
    members.sort((a, b) => b.pvCache - a.pvCache);
    party.leaderId = members[0]?.id ?? null;
    if (party.leaderId) {
      const ldr = snap.politicians.find((p) => p.id === party.leaderId);
      if (ldr) {
        addLog(snap, '2.2.4', 'appointment', `${ldr.firstName} ${ldr.lastName} leads the ${party.name}.`);
        applyPartyLeaderGrants(snap, ldr, party.name, formerLeaderId);
      }
    }
  }
}
```

Helper (place at module level, e.g. after `runPhase_2_2_3_FactionLeaders`):

```ts
function applyPartyLeaderGrants(
  snap: FullGameSnapshot, p: Politician, partyName: string, formerLeaderId: string | null,
): void {
  const isInstall = p.id !== formerLeaderId; // Q8: real change of party.leaderId
  if (isInstall) {
    if (addCommandPoint(p, 1)) {
      addLog(snap, '2.2.4', 'appointment',
        `${p.firstName} ${p.lastName} gains Command leading the ${partyName}.`);
    }
    if (addSkillPoint(p, 'governing', 1)) {
      addLog(snap, '2.2.4', 'appointment',
        `${p.firstName} ${p.lastName} gains Governing leading the ${partyName}.`);
    }
  } else {
    // Re-elected (same leaderId across the tick): legislative +1 (AC #7).
    if (addSkillPoint(p, 'legislative', 1)) {
      addLog(snap, '2.2.4', 'appointment',
        `${p.firstName} ${p.lastName} gains Legislative — re-elected leader of the ${partyName}.`);
    }
  }
}
```

**Q8 resolution (architect's call): install vs. re-election distinguished by
`party.leaderId` real-change across the tick.** Every tick that re-confirms
the same leader fires `legislative +1` (capped at 5 — a long-tenured
party leader plateaus). The spec's alternative (cycle-based, gated by
`year % 4 === 0`) is more conservative but adds plumbing; the cap-bounded
every-tick approach is consistent with the rest of PR2b's "real-change
boolean + cap" idiom. This is the highest balance lever in the brief — flag
under Risks.

---

**(f) `runPhase_2_3_1_Cabinet` — admin (F-DOUBLING) + Sec of State command
(AC #8, #15).** `phaseRunners.ts:1930–1950`. The PR1 expertise grant already
lives at lines 1944–1947 inside the `if (pick)` block. Add **two** grants
next to it (computed in order: F-DOUBLING admin first, then Sec-of-State
command). Both share the existing `if (pick)` site — one phase tick can fire
both addLogs.

```ts
  if (pick) {
    snap.game.cabinet[pos] = pick.id;
    pick.currentOffice = { type: pos as 'SecretaryOfState' };
    addLog(snap, '2.3.1', 'appointment', `${pick.firstName} ${pick.lastName} confirmed as ${pos}.`);

    // F-DOUBLING admin grant (AC #15). Base is OFFICE_ADMIN_GRANT[pos] (= 1
    // for all six positions per Q5). Doubled per Egghead, doubled per
    // Efficient, stacking: +1 / +2 / +2 / +4. Clamped at 5 by the helper.
    const base = OFFICE_ADMIN_GRANT[pos as OfficeType];
    if (base) {
      const r = ABILITY_EARN_RULES.cabinetConfirmAdmin;
      const amount = r.base
        * (pick.traits.includes('Egghead')   ? r.eggheadMult   : 1)
        * (pick.traits.includes('Efficient') ? r.efficientMult : 1);
      if (addSkillPoint(pick, 'admin', amount)) {
        addLog(snap, '2.3.1', 'appointment',
          `${pick.firstName} ${pick.lastName} gains Admin from confirmation.`);
      }
    }

    // Sec of State -> command +1 on initial appointment (AC #8). Idempotency
    // per Q9: cap-bounded approximation — a returning Sec of State at
    // command=5 silently no-ops. No previousOffices field added.
    const cmdBase = OFFICE_COMMAND_GRANT[pos as OfficeType];
    if (cmdBase && addCommandPoint(pick, cmdBase)) {
      addLog(snap, '2.3.1', 'appointment',
        `${pick.firstName} ${pick.lastName} gains Command from the Secretary of State portfolio.`);
    }

    // PR1 expertise grant (unchanged).
    const xp = OFFICE_EXPERTISE[pos as OfficeType];
    if (xp && addExpertise(pick, xp)) {
      addLog(snap, '2.3.1', 'appointment', `${pick.firstName} ${pick.lastName} gains ${xp} expertise.`);
    }
  }
```

The F-DOUBLING is **read-only** on `pick.traits` — PR2b does not grant
Egghead/Efficient. A picked politician with Egghead at admin=4 + Efficient
gets `amount = 1*2*2 = 4`; `addSkillPoint(pick, 'admin', 4)` clamps to 5,
returns `true` on the single 4→5 rise, and the addLog reads "gains Admin
from confirmation" — the engine does not surface the doubled magnitude in
the log line (the underlying stat shift speaks for itself). At admin=5 the
helper returns `false`, no log line, no spurious "no change" surface.

---

**(g) `runPhase_2_3_2_Military` — Senior General / Admiral command, war-
gated (AC #9).** `phaseRunners.ts:1955–1982`. The PR1 expertise grant lives
at lines 1963–1966 / 1976–1979 inside each `if (!snap.game.cabinet.X)`
initial-appointment branch. Add a war-active gate at the function head and a
command grant inside each branch:

```ts
export function runPhase_2_3_2_Military(snap: FullGameSnapshot): void {
  // PR2b: senior Gen/Adm command grant fires ONLY while a war is active.
  // The independence-era war hangs on game.revolutionaryWar; later eras on
  // game.wars (string[]). Either being truthy/active triggers.
  const warActive =
    snap.game.revolutionaryWar?.active === true || snap.game.wars.length > 0;

  if (!snap.game.cabinet.GeneralInChief) {
    // ... existing pick + addLog + PR1 expertise grant ...
    if (warActive && addCommandPoint(candidates[0], 1)) {
      addLog(snap, '2.3.2', 'appointment',
        `${candidates[0].firstName} ${candidates[0].lastName} gains Command as wartime General in Chief.`);
    }
  }
  if (!snap.game.cabinet.Admiral) {
    // ... existing pick + addLog + PR1 expertise grant ...
    if (warActive && addCommandPoint(navalCandidates[0], 1)) {
      addLog(snap, '2.3.2', 'appointment',
        `${navalCandidates[0].firstName} ${navalCandidates[0].lastName} gains Command as wartime Admiral.`);
    }
  }
}
```

Each branch already runs `if (!snap.game.cabinet.X)` — so the grant only
fires on a fresh seating (re-appointment after a vacancy gets the grant
again, but `addCommandPoint` caps at 5). Peacetime appointment is silent.
The war-active gate flipping mid-phase is correctly handled (spec Edge case)
— the gate is read at function entry, so a war that starts later in the
same tick does **not** retroactively grant.

---

**(h) `runPhase_2_6_3_Floor` — meter-improving bill sponsor (AC #10).**
`phaseRunners.ts:2853–2921`. Two branches; both grant. The "improves a
meter" predicate is computed against `bill.effects` (which is
`EraEventResponseEffect` per `types.ts:802–811`):

```ts
function billImprovesAnyMeter(bill: Legislation): boolean {
  const m = bill.effects.meters;
  if (m) {
    for (const v of Object.values(m)) {
      if (v != null && v > 0) return true;
    }
  }
  // domesticStability shorthand IS a meter improvement (applyEffect routes
  // it into snap.game.meters.domestic — phaseRunners.ts:2649–2651).
  if (bill.effects.domesticStability != null && bill.effects.domesticStability > 0) {
    return true;
  }
  return false;
}
```

Place this as a module-level helper near `applyEffect` (~line 2640). It is
**Q3's locked predicate**: any positive delta in `bill.effects.meters` OR a
positive `bill.effects.domesticStability`, evaluated **statically** on the
bill template's effect (not on post-`applyEffect` meter state, which would
double-count clamps and miss bills whose net is positive but pre-clamp). A
bill with mixed deltas (e.g. Tariff Reduction's `revenue −0.5, economic
+0.5`) **grants** — any positive counts.

**Sponsor resolution and grant site.** Both branches already have access to
the bill. Sponsor is `snap.politicians.find((p) => p.id === bill.sponsorId)`
(the 1856+ branch already does this at line 2882). Insert the grant
**immediately after** `bill.status = 'passed'` and **before** `applyEffect`
in each branch:

- **CC branch (1772)** at `phaseRunners.ts:2861–2866`:
  ```ts
  if (result.passed) {
    bill.status = 'passed';
    if (billImprovesAnyMeter(bill)) {
      const sponsor = snap.politicians.find((p) => p.id === bill.sponsorId);
      if (sponsor && addCommandPoint(sponsor, 1)) {
        addLog(snap, '2.6.3', 'appointment',
          `${sponsor.firstName} ${sponsor.lastName} gains Command from passage of "${bill.title}".`);
      }
    }
    applyEffect(snap, bill.effects);
    // ... existing PASSED log + recordBillPassed ...
  }
  ```

- **1856+ branch** at `phaseRunners.ts:2909–2913`:
  ```ts
  if (house.yea > house.nay && senate.yea > senate.nay) {
    bill.status = 'passed';
    if (billImprovesAnyMeter(bill)) {
      // sponsor already defined at line 2882; reuse it.
      if (sponsor && addCommandPoint(sponsor, 1)) {
        addLog(snap, '2.6.3', 'appointment',
          `${sponsor.firstName} ${sponsor.lastName} gains Command from passage of "${bill.title}".`);
      }
    }
    applyEffect(snap, bill.effects);
    // ... existing PASSED log + recordBillPassed ...
  }
  ```

(The 1856+ branch's `sponsor` is already declared at line 2882 inside the
loop — reuse the existing binding, no shadowing.) Per-bill grant fires per
loop iteration: a sponsor with three passed meter-moving bills in one tick
gets up to +3 command, clamped at 5. Logging text is neutral ("gains Command
from passage of …") — does not assert direction (spec Edge case for
mixed-delta bills).

### `src/engine/revolutionaryWar.ts` — symmetric majority-ground-wins earn (AC #25, Q6 IN)

The architect's call on Q6: **IN**. PR2a's `applyBattleLoss` and the per-
phase win/loss diff at `revolutionaryWar.ts:161–197` are the mirror; the
symmetric earn is ~6 lines and lives next to its loss counterpart so a
future reader sees both halves of the admin tally in one place.

**Imports.** Already imports `loseSkill` (line 6) and `ABILITY_LOSS_RULES`
(line 2). Add `addSkillPoint` to the abilities import: `import { loseSkill,
addSkillPoint } from './abilities';`. No new type import needed
(`Partial<Record<SkillKey, number>>` already covered by the existing
`SkillKey` import at line 1).

**Helper.** Define `applyBattleEarn` immediately after the existing
`applyBattleLoss` (closes at line 126). Same shape, opposite direction —
route through `addSkillPoint`, log on real change:

```ts
// Mirror of applyBattleLoss: apply a per-stat earn map to one commander.
// Skips a dead commander (deathYear set by applyCasualties). Logs each stat
// that actually rises. Used for the majority-ground-wins admin grant
// (AC #25 / PR2b Q6 IN); kept here for symmetry with applyBattleLoss.
function applyBattleEarn(
  snap: FullGameSnapshot,
  commander: Politician | undefined,
  earns: Partial<Record<SkillKey, number>>,
  context: string,
): void {
  if (!commander || commander.deathYear) return;
  for (const [skill, amount] of Object.entries(earns) as [SkillKey, number][]) {
    const before = commander.skills[skill];
    if (addSkillPoint(commander, skill, amount)) {
      addLog(snap, '2.7.2', 'event',
        `${commander.firstName} ${commander.lastName} grows in stature commanding ${context} — ${skill[0].toUpperCase() + skill.slice(1)} ${before} → ${commander.skills[skill]}.`,
        { politicianId: commander.id });
    }
  }
}
```

**Call site.** Inside `runRevWarBattles`'s ground-phase tail
(`revolutionaryWar.ts:193–197`), next to the existing majority-loss check:

```ts
    const lostThisPhase = war.currentGroundLosses - groundLossesBefore;
    const wonThisPhase  = war.currentGroundWins   - groundWinsBefore;
    if (lostThisPhase > wonThisPhase && lostThisPhase > 0) {
      applyBattleLoss(snap, general, { admin: ABILITY_LOSS_RULES.battle.majorityGroundLossAdmin }, 'the campaign');
    }
    // PR2b symmetric earn: majority of ground wins this phase -> admin +1.
    if (wonThisPhase > lostThisPhase && wonThisPhase > 0) {
      applyBattleEarn(snap, general, { admin: 1 }, 'the campaign');
    }
```

Magnitude `1` is hard-coded (mirrors PR2a's `ABILITY_LOSS_RULES.battle.
majorityGroundLossAdmin`). If the human wants this in `ABILITY_EARN_RULES`,
flip later — keeping it inline matches PR2a's hard-coded `1` in
`majorityGroundLossAdmin` precedent (the rule is named, not the magnitude
varied). **Asymmetric edge:** an even-split phase (`won == lost > 0`) grants
neither (strict `>` on both sides), matching PR2a's "majority" semantics.

## UI changes

**None.** PR2b adds no field, no screen, no component. Earn surfaces
through:
- Existing log feeds (`2.2.1`, `2.2.2`, `2.2.3`, `2.2.4`, `2.3.1`, `2.3.2`,
  `2.6.3`, `2.7.2` entries) — the Half-Term Summary / log feed already
  render these phases.
- The Roster, which reads `p.skills` / `p.command` live — a bumped stat
  shows automatically.
- The career-gain feed for the secondary-skill roll (via `recordCareerGain`,
  unchanged plumbing).

No new column, no new modal. This matches AC #22 (no new field) and PR2a's
"UI: none" precedent.

## Files to touch (exact, ordered)

All files exist; no new modules. PR2b is **extension-only**.

1. `src/types.ts` — add `ABILITY_EARN_RULES`, `OFFICE_COMMAND_GRANT`,
   `OFFICE_ADMIN_GRANT`, `TRACK_SECONDARY_SKILLS` (after
   `ABILITY_LOSS_RULES` at line 464, before `ANYTIME_EVENTS_RULES` at line
   466). No interface change.
2. `src/engine/abilities.ts` — add `addSkillPoint(p, key, amount)` and
   `addCommandPoint(p, amount)` exports (mirror of existing
   `loseSkill`/`loseCommand`, clamp-to-5, return-boolean-on-real-change).
3. `src/engine/phaseRunners.ts` — imports (lines 2 & 5); six insertion
   points:
   - (a) `rollThreshold` secondary-skill roll between lines 313–318;
   - (b) `runPhase_2_2_1_CongressLeadership` Speaker/Pro-Tem grants
     gated by id-diff (~1700–1710);
   - (c) `runPhase_2_2_2_Committees` chair command+legislative grants
     beside the PR1 expertise grant (~1729–1736);
   - (d) `runPhase_2_2_3_FactionLeaders` 4-grant install + challenge-
     success via `applyFactionLeaderGrants` (~1818, ~1871);
   - (e) `runPhase_2_2_4_PartyLeaders` install vs. re-election split via
     `applyPartyLeaderGrants` (~1908–1925);
   - (f) `runPhase_2_3_1_Cabinet` F-DOUBLING admin + Sec-of-State command
     beside the PR1 expertise grant (~1940–1948);
   - (g) `runPhase_2_3_2_Military` war-active gated Sr Gen/Adm command
     beside the PR1 expertise grants (~1955–1982);
   - (h) `runPhase_2_6_3_Floor` `billImprovesAnyMeter` predicate + sponsor
     command grant in both CC and 1856+ branches (~2861, ~2909) plus the
     helper near `applyEffect` (~2640).
4. `src/engine/continentalCongress.ts` — extend `grantChair` helper in
   `appointCCCommittees` (~163–169) with command+legislative grants beside
   the PR1 expertise grant; add `addCommandPoint, addSkillPoint` to the
   `./abilities` import (line 3 region).
5. `src/engine/revolutionaryWar.ts` — add `applyBattleEarn` helper after
   `applyBattleLoss` (~127); add the majority-ground-wins admin earn call
   site immediately after the existing majority-ground-loss check (~197);
   extend the `./abilities` import (line 6) to include `addSkillPoint`.

**File count delta:** 5 files modified, 0 new. **No UI, no dataset regen, no
`repair()`/migration, no `pv.ts` change.**

**Not touched (guardrails):** `src/pv.ts` (no PV-formula change, AC #21);
`src/rng.ts` (no new `Math.random`); `src/phases.ts`;
`GameContext.tsx`/`repair()` (no migration, AC #22); the cabinet selection
logic in `runPhase_2_3_1_Cabinet` (admin-sort, party-match, age<75 —
unchanged, AC #16); all Use gates (presidential `command >= 2`, etc., AC
#21) — earn feeds them only by raising the underlying stat. **No new
secondary-skill on `Backroom` or `Judicial`** (table entries are `[]`); **no
new command grant at the ALREADY COVERED sites** (CC President, Father of
Constitution, Federalist authors, kingmaker-protege graduation, battle
survivor — F-RECONCILE / AC #23). PR2a's `runPhase_2_4_1_Deaths` decay,
`rollPersonalEvents` cap-guard rewrite, `applyBattleLoss` battle-tier
penalties, and `revolutionaryWar.ts` majority-ground-loss admin are
**unchanged**; the PR2b earn slots in **next to** them, never in place of.

## Test / verification plan

**Build / typecheck.** `npm run build` (`tsc -b && vite build`) and
`npm run lint` (`tsc -b --noEmit`) must both pass (AC #24). Tripwires to
expect: the `ABILITY_EARN_RULES` `as const satisfies` shape (any typo in
the `cabinetConfirmAdmin` keys fails); the `Object.values(m).filter(v => v >
0)` predicate over `Partial<NationalMeters>` (typed correctly because
`bill.effects.meters` is `Partial<NationalMeters>`); the `Partial<Record<
OfficeType, number>>` shape on the two grant tables (mirrors PR1's
`OFFICE_EXPERTISE` precedent exactly).

**Engine smoke test (recommended — mirror PR2a's 23-assertion script).** A
tiny Node smoke script that imports `addSkillPoint` / `addCommandPoint` and
exercises:
- `addSkillPoint(p, 'admin', 1)` on a fresh `Politician` at admin=0 → returns
  `true`; admin=1.
- `addSkillPoint(p, 'admin', 4)` on admin=4 → returns `true`; admin=5 (single
  step, capped — the F-DOUBLING ladder at the cap edge).
- `addSkillPoint(p, 'admin', 1)` on admin=5 → returns `false`; admin=5 (cap
  no-op).
- `addCommandPoint(p, 1)` on command=5 → returns `false`; command=5 (cap
  no-op, AC #8 idempotency-via-cap).
- F-DOUBLING ladder at the call-site formula: with
  `base=1, eggheadMult=2, efficientMult=2`, compute `amount` for the four
  trait combinations: `(none) → 1`, `(Egghead) → 2`, `(Efficient) → 2`,
  `(both) → 4`. Spot-check the formula matches the spec's `+1/+2/+2/+4`
  ladder.
- The secondary-track table is correctly populated: `TRACK_SECONDARY_SKILLS.
  Legislative` does **not** include `'admin'` (the corrected reading);
  `TRACK_SECONDARY_SKILLS.Backroom` and `TRACK_SECONDARY_SKILLS.Judicial`
  are `[]`.
- The bill-improves-meter predicate: a bill with `{ meters: { economic:
  +0.5, revenue: -0.5 } }` returns `true` (Tariff Reduction case); a bill
  with all-negative or empty `meters` returns `false`; a bill with
  `domesticStability: +1` returns `true`; a bill with only
  `interestGroups`/`enthusiasm`/`partyPreference` and no meters returns
  `false` (the spec's "improves a national meter" reading).

The smoke script is optional but high-value — three of the six insertion
points compose helpers/predicates that the build alone cannot fully verify.

**Playtest (per CLAUDE.md — `npm run dev`, exercise each earn path).**

> **Determinism caveat (state up front, carried from PR2a):** `src/rng.ts`
> wraps `Math.random`, so runs are **not** bit-reproducible. Verify each
> behavior **qualitatively** (the grant happens; magnitudes are +1 or +2/+4
> at the F-DOUBLING site; log lines read right), not by reproducing an
> exact seed. CPU politicians accrue invisibly to the UI — verify via the
> log feed and DevTools/IndexedDB save inspection.

- **Faction-leader install grants four stats (highest-leverage site).**
  Start 1772 (or load a save mid-game). Force an install: easiest is the
  invariant — a faction with no leader at the top of `2.2.3`. Watch the
  `2.2.3` log for **up to four** "gains X leading the …" lines on the new
  winner. Confirm in DevTools that the same politician's `skills.legislative`,
  `skills.governing`, `skills.admin`, and `command` each rose by 1 (where
  not at cap). The challenge-success branch (Step 3) similarly grants four
  on the challenger.

- **Cabinet confirmation with Egghead+Efficient (F-DOUBLING).** Hand-craft a
  save where the next Sec of Treasury pick has both Egghead and Efficient
  traits and `admin=2`. Run `2.3.1`. Confirm admin jumps `2 → 5` (clamped
  at the cap from +4), a single "gains Admin from confirmation" log line
  fires (the cap-clamp doesn't suppress the line — it returns true on the
  single 2→5 rise), and the player's politician at cap silently no-ops on
  re-seating. Repeat with neither trait (admin 2 → 3, `+1`), Egghead-only
  (2 → 4, `+2`), Efficient-only (2 → 4, `+2`).

- **Sec of State command stack with F-DOUBLING.** A politician picked for
  Sec of State with Egghead+Efficient at admin=2, command=3: confirm
  **two** addLog lines — "gains Admin from confirmation" (admin 2→5) AND
  "gains Command from the Secretary of State portfolio" (command 3→4).
  Confirm the stack is intentional (the reference lists Sec of State on
  both the Admin and Command Earn lists).

- **Speaker / Pro Tem change.** Advance to a `2.2.1` tick where the House
  majority flips (or the prior Speaker died). Confirm the new Speaker gets
  one "gains Legislative from the Speaker's gavel" line; a tick that re-
  elects the same Speaker is silent (id-diff guard).

- **Bill sponsor command on meter-improver.** Either let the CC pass an
  early bill (the Continental Army or Continental Navy bills, which the CC
  passes early) or in 1856 pass a tariff bill. Confirm one "gains Command
  from passage of …" line per meter-improving passed bill; a mixed-delta
  bill (e.g. Tariff Reduction's `revenue −0.5, economic +0.5`) still
  grants; an all-neutral bill (no positive meter delta) does not.

- **Secondary-skill roll.** Run several half-terms with CPU politicians on
  Administration or Governing tracks. Watch the `careerGains` feed
  (DevTools or in-game UI) for `kind: 'skill'` entries that fired on
  secondary skills (e.g. Administration politician gaining `governing` or
  `legislative`). With odds `0.25`, on a 20-year track (5 thresholds) the
  expected count of secondary fires is ~1.25 per politician — qualitative
  "it happens but stays below the primary rate" check.

- **Sr Gen / Adm wartime command grant.** During the Rev War, force a
  Senior General appointment (e.g. clear `snap.game.cabinet.GeneralInChief`
  in DevTools, run `2.3.2`). Confirm the new General gets a "gains Command
  as wartime General in Chief" line. Then end the war (let `2.7.2` resolve
  to victory or load a post-war save), clear the Admiral slot, run `2.3.2`
  again — peacetime appointment grants no command (`warActive` is false).

- **Symmetric majority-ground-wins admin earn.** Play through a Rev War
  phase that wins more ground battles than it loses (3 wins, 0–1 losses).
  Confirm a "grows in stature commanding the campaign — Admin N → N+1"
  log line on the senior general; a phase with equal win/loss is silent;
  the dead-general edge (if applicable) is silent (the helper guards on
  `deathYear`).

**Edge cases to verify manually (from the spec):**
- Politician already at command=5 (or relevant skill=5) → grant is a no-op,
  no log line.
- A re-election of the same party leader → only `legislative +1` (not
  command/governing); subsequent ticks compound (cap-bounded).
- Faction-leader Step 5 invariant log "No eligible leader" → no grant
  (no install occurred).
- Tariff Reduction-style mixed bill (any positive meter) → sponsor grants.
- Sec of State at `command=5` returning to office in a later term → silent
  no-op (Q9 cap-bounded approximation; no spurious "regrant" log).
- Bill with only `interestGroups` deltas (e.g. a card-targeted bill) → no
  command grant (no meter improvement detected).
- Senior General appointment **before** war starts → no command grant; if
  the war later starts, no retroactive grant (spec Edge case "war-active
  gate flips mid-phase").

## Risks

Ordered, highest first.

1. **PV inflation across the board — the headline balance lever.** Every
   PR2b grant moves PV **upward**; in aggregate they could meaningfully tilt
   elections relative to a pre-PR2b save. The cap (5) bounds magnitude
   per-stat, but the *aggregate* upward pressure is the spec's stated
   counter-weight to PR2a's downward pressure. The riskiest individual
   grant is the cabinet-confirmation F-DOUBLING (`+4` for Egghead+Efficient
   picks), which alone can move a Sec of Treasury's PV by `4 weight × 4
   amount = 16` plus downstream stat-gate effects (admin=5 unlocks DCIA/
   DNI per the reference's Use list, though those gates are not in AMPU
   today). Mitigation: every magnitude lives in `ABILITY_EARN_RULES` or the
   two grant tables for one-place tuning; the human dials back the
   `eggheadMult` / `efficientMult` ladder, the `secondaryTrack` odds, or
   the per-grant base if playtest shows the new earn outpacing PR2a's
   decay.

2. **Re-elected party leader compounds `legislative +1` per tick.** Q8's
   "every-tick on `leaderId` unchanged" semantic — a 20-year party leader
   gains `legislative +1` every tick they retain the seat, plateauing at 5.
   At AMPU's half-term cadence that is 4 ticks/year and ≤ ~4 ticks before
   cap — the bound is short but the *signal* (any retained leader gets the
   full bump fast) may be too generous. Mitigation: cap-bounded so it
   self-limits; the alternative (cycle-based, `year % 4 === 0`) is a
   one-line gate flip if playtest finds the current semantic too generous.
   **This is the second sharpest balance lever** — flagged explicitly per
   the user's Q8 framing.

3. **Faction-leader 4-stat grant overshadows the rest.** A fresh install
   below all caps gains `command +1, legislative +1, governing +1, admin
   +1` in one phase — `4 × ~4 PV weight = ~16 PV` plus the command term in
   the PV formula. If a faction's leader churns (a tight challenge cycle),
   the new leader gets the full bump each transition. Mitigation: the cap
   (5) limits per-stat ceiling; the spec recognized this and locked the
   4-stat grant (AC #4 + #19 + AC #4 commentary). PR3 / PR4 trait election
   work may further dilute this single PR's contribution.

4. **The F-DOUBLING cap-clamp drops information silently.** A politician
   at admin=4 with Egghead+Efficient earns `amount=4` but admin caps at 5
   — the helper returns `true` on the single 4→5 rise and one addLog
   fires. The player sees "gains Admin from confirmation" but cannot tell
   whether the trait doubling mattered for their politician's outcome
   (compared to a `+1` they would have gotten without traits at admin=4 →
   5 anyway). Mitigation: this is the spec's documented Edge case ("F-
   DOUBLING for cabinet-confirmation hitting the cap mid-grant"), and the
   log line is intentionally neutral so the reader does not over-interpret
   the magnitude. No code change recommended unless playtest finds it
   confusing.

5. **Q3 predicate edge — `applyEffect` reads `bill.effects.meters` AND
   `bill.effects.domesticStability` separately.** A bill with both
   `meters.domestic: +0.5` and `domesticStability: +0.3` triggers the
   grant via `meters.domestic` (positive); `domesticStability` is a
   shorthand that `applyEffect` routes into the same `meters.domestic`
   field but the predicate checks them independently — both positive
   counts as "any positive", so the grant fires once (not twice; the
   sponsor grant is per-bill, not per-positive-delta). No
   double-counting; the predicate's `||` semantics are correct. Flagged
   here because the dual-field handling in `EraEventResponseEffect` is a
   minor footgun that could trip a future maintainer who only reads
   `effects.meters`.

## Definition of Done

- `npm run build` passes (`tsc -b && vite build`) and `npm run lint`
  (`tsc -b --noEmit`) is clean (AC #24).
- `ABILITY_EARN_RULES`, `OFFICE_COMMAND_GRANT`, `OFFICE_ADMIN_GRANT`,
  `TRACK_SECONDARY_SKILLS` all live in `src/types.ts` immediately after
  `ABILITY_LOSS_RULES`, each `as const satisfies …` shape-checked; **no
  magic numbers** in any engine body (AC #1, #2).
- `src/engine/abilities.ts` exports pure `addSkillPoint` / `addCommandPoint`
  (clamp-to-5, return-boolean-on-real-change, no RNG, no PV); **every** earn
  path routes through them (AC #3); PR2a's `loseSkill`/`loseCommand` are
  unchanged.
- All six command grant sites fire on a real change with the correct
  guards (AC #4 faction-leader 4-stat × 2 paths; AC #5 party-leader
  install command+governing; AC #6 committee chair command+legislative in
  both eras; AC #8 Sec-of-State command; AC #9 Sr Gen/Adm with war-
  active gate; AC #10 bill-sponsor meter-improver in both branches).
- AC #12/#13/#14 secondary-track roll fires inside `rollThreshold` with
  odds `0.25`, uses the corrected `TRACK_SECONDARY_SKILLS` table
  (Legislative omits admin, Judicial/Backroom empty), dedupes-by-cap,
  records via `recordCareerGain` with `kind: 'skill'`.
- AC #15 F-DOUBLING ladder (`+1/+2/+2/+4`) computed at the cabinet call
  site, all six positions (Sec State/Treasury/War/AG/PMG/KeyAdvisor)
  granted via `OFFICE_ADMIN_GRANT`, `addSkillPoint` clamps at 5.
- AC #17 Speaker / Pro Tem `legislative +1` on real change; AC #25
  symmetric majority-ground-wins `admin +1` via `applyBattleEarn` next to
  PR2a's `applyBattleLoss`.
- `src/pv.ts` unchanged; no Use gate changed; no new field; no migration;
  no UI (AC #16, #21, #22).
- All PR1 grants (`addExpertise` at chair/cabinet/military sites) and PR2a
  grants (`loseSkill`/`loseCommand` at decay/anytime/battle sites) remain
  intact; no F-RECONCILE "ALREADY COVERED" site has a duplicate command
  grant added (AC #23).
- **Playtest** (per CLAUDE.md): faction-leader install observed granting 4
  stats; cabinet confirmation with Egghead+Efficient observed jumping the
  appointee to the F-DOUBLING ladder; Speaker change observed granting
  legislative; bill-sponsor on a meter-improving bill observed gaining
  command — all verified **qualitatively** given the rng.ts determinism
  caveat, with CPU observation via the log feed + DevTools/save
  inspection.

---

**Checkpoint summary (for approval):**

- **Approach:** add the earn half of the ability lifecycle via one tuning
  const (`ABILITY_EARN_RULES`) + two parallel grant tables
  (`OFFICE_COMMAND_GRANT`, `OFFICE_ADMIN_GRANT`, `TRACK_SECONDARY_SKILLS`)
  alongside PR1's `OFFICE_EXPERTISE`/`COMMITTEE_EXPERTISE`, plus two new
  exports on `src/engine/abilities.ts` (`addSkillPoint`, `addCommandPoint`
  — the precise inverses of `loseSkill`/`loseCommand`). All ~9 NEW
  F-RECONCILE hooks ship in one PR; F-DOUBLING (`+1/+2/+2/+4`) applied at
  the cabinet call site; secondary-track roll added to `rollThreshold` at
  odds `0.25`; symmetric majority-ground-wins admin earn ships next to
  PR2a's loss tally. PV, Use gates, fields, migration, and UI all
  untouched.
- **Files:** 5 (1 extended `src/engine/abilities.ts`, 1 const-only
  `src/types.ts`, 3 modified engine files —
  `phaseRunners.ts`, `continentalCongress.ts`, `revolutionaryWar.ts`). No
  new module, no UI, no dataset, no migration.
- **Q2/Q3/Q5/Q6/Q8/Q9 resolutions:** **Q2** secondary-roll odds **0.25**
  (half the primary 0.5). **Q3** "improves a meter" = any positive value
  in `bill.effects.meters` OR positive `bill.effects.domesticStability`,
  evaluated statically on the bill effect (not post-`applyEffect`). **Q5**
  PMG and KeyAdvisor **IN** the cabinet-confirm admin doubling (`OFFICE_
  ADMIN_GRANT` covers all six positions). **Q6** symmetric majority-
  ground-wins admin earn **IN** via `applyBattleEarn` next to
  `applyBattleLoss`. **Q8** "re-elected party leader" = real-change of
  `party.leaderId` across the tick (install fires command+governing;
  same-id retention fires legislative+1). **Q9** "initial Sec of State"
  uses the **cap-bounded approximation** (no `previousOffices` field;
  `addCommandPoint` no-ops at 5).
- **Highest balance risk:** aggregate PV inflation across all earn sites,
  with the cabinet F-DOUBLING (`+4` for Egghead+Efficient) as the single
  largest per-event move; the re-elected party leader's per-tick
  `legislative +1` is the second sharpest because it compounds across
  ticks (cap-bounded but reaches 5 fast). All magnitudes live in one
  const/table for one-place tuning.
- **Decided beyond the spec:** (a) corrected `TRACK_SECONDARY_SKILLS.
  Legislative` to `['governing']` only (admin excluded per the source
  text's "all other tracks but Legislative grant Admin"); (b)
  faction-leader 4-stat grant routed through a single
  `applyFactionLeaderGrants` helper inside `runPhase_2_2_3_FactionLeaders`
  to keep the two call sites (Step 2 install, Step 3 challenge-success)
  DRY; (c) party-leader install vs. re-election routed through
  `applyPartyLeaderGrants` with a `formerLeaderId` captured at the top of
  each per-party loop iteration; (d) `billImprovesAnyMeter` predicate as a
  module-level helper near `applyEffect` so both era branches in
  `runPhase_2_6_3_Floor` share one source of truth; (e) `applyBattleEarn`
  defined immediately after `applyBattleLoss` in `revolutionaryWar.ts` so
  future readers see both halves of the admin tally in one place; (f) Sr
  Gen / Adm war-active gate is computed once at the top of
  `runPhase_2_3_2_Military` (not per-branch) for clarity; (g) F-DOUBLING
  ladder constants (`base: 1, eggheadMult: 2, efficientMult: 2`) baked into
  `ABILITY_EARN_RULES.cabinetConfirmAdmin` so the call-site arithmetic
  reads from one named place — a future trait rebalance changes one
  field.

**Brief file:** `/home/user/AMPU/docs/briefs/abilities-earn-expansion.md`
