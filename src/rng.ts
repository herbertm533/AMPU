// Deterministic-ish RNG. We use Math.random by default, but expose seeded option.
// For now, simple wrappers; deterministic seeding can be plugged in later.

export function rand(): number {
  return Math.random();
}

export function d(sides: number): number {
  return Math.floor(rand() * sides) + 1;
}

export function d100(): number {
  return d(100);
}

export function rollVs(target: number): { roll: number; success: boolean; margin: number } {
  const roll = d100();
  return { roll, success: roll <= target, margin: target - roll };
}

export function pickWeighted<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((sum, o) => sum + Math.max(0, o.weight), 0);
  if (total <= 0) return options[0].value;
  let pick = rand() * total;
  for (const o of options) {
    pick -= Math.max(0, o.weight);
    if (pick <= 0) return o.value;
  }
  return options[options.length - 1].value;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function chance(probability: number): boolean {
  return rand() < probability;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
