/** The few statistics the deck needs, as set out in results/hypotheses.md. */

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Percentage change of each `b` error relative to the matching `a` error. Negative = `b` is better. */
export const pctChange = (a: number[], b: number[]) => a.map((x, i) => (100 * (b[i] - x)) / x);

/**
 * Exact one-sided paired Wilcoxon signed-rank test: p-value for "a is lower than b".
 * Enumerates all sign patterns, so it is meant for the 15 seeds used here (zeros dropped, no tie correction).
 */
export function wilcoxonLess(a: number[], b: number[]): number {
  const d = a.map((x, i) => x - b[i]).filter((v) => v !== 0);
  const n = d.length;
  if (n === 0) return 1;
  if (n > 20) throw new Error('exact test is only meant for small samples');
  const order = d.map((_, i) => i).sort((i, j) => Math.abs(d[i]) - Math.abs(d[j]));
  let observed = 0;
  order.forEach((i, rank) => { if (d[i] > 0) observed += rank + 1; });
  // ways[s] = number of sign patterns whose positive ranks add to s
  const ways = new Array<number>((n * (n + 1)) / 2 + 1).fill(0);
  ways[0] = 1;
  for (let r = 1; r <= n; r++) for (let s = ways.length - 1; s >= r; s--) ways[s] += ways[s - r];
  let atMost = 0;
  for (let s = 0; s <= observed; s++) atMost += ways[s];
  return atMost / 2 ** n;
}

/** Holm step-down correction: which p-values stay below `alpha` for the whole family. */
export function holm(ps: number[], alpha = 0.05): boolean[] {
  const passed = ps.map(() => false);
  const order = ps.map((_, i) => i).sort((i, j) => ps[i] - ps[j]);
  for (let rank = 0; rank < order.length; rank++) {
    if (ps[order[rank]] >= alpha / (ps.length - rank)) break;
    passed[order[rank]] = true;
  }
  return passed;
}
