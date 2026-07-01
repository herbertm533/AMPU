# Digest — a19001a5 "Can a nuclear war happen? Is it possible in the game?"

- **Slug:** `a19001a5-can-a-nuclear-war-happen-is-it-possible-in-the-game`
- **Source:** `a19001a5-Can_a_nuclear_war_happen_is_it_possible_in_the_game.csv` (7 posts, 1 chunk, ~841 chars)
- **Date:** Sep 22–24, 2024
- **Type:** thin Q&A / lore-confirmation. NOT a playthrough — no mechanics, no numbers, no GM ruling. Two posts are literally just `bomb` / 💣.
- **Scope:** confirms **nuclear-apocalypse game-end scenarios exist as designed content** (modern era). Zero implementation detail.

> **Why it matters:** independent *player-side* confirmation (not a designer/GM statement) that a **nuclear apocalypse can end the game** — corroborating the "big red button" nuclear-war loss (#188) and the apocalypse meter-floor end-state (#88). Load-bearing value is small: it re-affirms this is real designed content but adds no new mechanic. Notably, the player answering ("I don't know all the scenarios off the top of my head") signals the trigger conditions are **not common player knowledge** — consistent with #188's finding that the nuclear loss is premise-only and has never been observed firing in any playtest.

## ★ The one substantive fact

Player Q ("Can it happen") → answered by two experienced players:

- Joe303300 (POST 6): *"Yes, there are nuclear apocalypse scenarios that will result in game ends."*
- Anonymous (POST 5): *"It can happen. I don't know all the scenarios off the top of my head but do know good chance it's game ending if it happens."*
- Arkansas Progressive (POST 7) quotes & re-affirms Joe's answer; OP replies "Thanks."

So: **plural** nuclear-apocalypse scenarios exist (designed), each a probable **game-ender**. That's the entire substance. This is a modern-era (Cold-War/Nuclear-Age) content genre — the game ships **no modern scenario** today (1772 & 1856 only).

## Shipped-vs-designed

- **Game-end MECHANIC exists in the build**, but only for 1772: `EraEvent.triggersGameEnd?` → `GameState.gameEnded {year, reason, templateId}` → `GameOverScreen` (`types.ts:1476`, `types.ts:1635`, `App.tsx:341`, `phaseRunners.ts:2869-2872`). Only **three terminal nodes** ship, all in `eraEvents1772.ts` (header comment, line 8). So the *plumbing* for "an event ends the game" is real; the *nuclear* content is not.
- **No modern era ships:** `Era = 'independence' | 'federalism' | 'nationalism' | 'modern'` (`types.ts:1337`) — `'modern'` is enumerated but there is **no `scenario` modern file** (only `scenario1772.ts` / `scenario1856.ts`). Nuclear war is a modern-era mechanic ⇒ 0% reachable in the current build.
- **No nuclear/war/doomsday NationalMeter:** the 7 meters are `revenue, economic, military, domestic, honest, quality, planet` (`types.ts:1399-1407`). Closest is `planet` (environmental apocalypse, ties #88's Planet-Health clock) and `military` — neither models a nuclear/MAD/security escalation to an apocalypse end-state. No war/security/doomsday meter exists.
- **grep for `nuclear|apocalypse|doomsday|endCondition`** in `src/` → **zero** hits. The only shipped end-condition machinery is the generic `gameEnded`/`triggersGameEnd` era-event hook above.

## Delta list — CORROBORATION only, maps to existing gaps

- **#188** ("big red button" nuclear-war loss is premise-only, never fired) — *primary map.* This thread is independent player-side evidence the nuclear game-end is real designed content; still no mechanic/trigger detail, still no observed firing. **Corroborates, adds nothing new.**
- **#88** (APOCALYPSE meter-floor game-end model; Planet-Health 10-yr clock; the one game-end actually observed in `terror2000` was a HonestGov-floor "Autocratic Coup", not nuclear) — corroborates the general "meter-floor / catastrophe → game-end" family.
- **#106** (modern war-as-meter) — corroborates (nuclear escalation is the modern-war extreme).
- **#221 family** (National-Security / modern policy-content genre; catalogued b51 `c2bea165`, #221-family) + the **Era enum stops before a shipped modern scenario** — corroborates that this whole content genre is 0% shipped.
- **War/escalation cluster #45/#56/#85** — tangential corroboration (nuclear war is the terminal escalation of the war engine, itself unbuilt/redesign-pending).
- **NEW gaps: none.** A distinct nuclear/doomsday end-state is already captured by #188 (nuclear loss) + #88 (apocalypse end model). Nothing here warrants a new ID.

## Open questions (unchanged / not answerable from this thread)

- What are the actual **trigger conditions** for a nuclear-apocalypse end (meter floor? decision-event branch? a specific era event)? — still open under #188; even veteran players here didn't know.
- Is it **one** end-state or several ("scenarios," plural)? Post 6 implies multiple; no enumeration.
