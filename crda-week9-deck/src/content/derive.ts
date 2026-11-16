/** Lookups and wording helpers over results.ts, so slides never repeat a number by hand. */
import { averaging, filterOn, runs, type AveragingRun, type Dataset, type Model, type Run, type Source } from './results';

export const run = (source: Source, dataset: Dataset, model: Model): Run => {
  const r = runs.find((x) => x.source === source && x.dataset === dataset && x.model === model);
  if (!r) throw new Error(`No run for ${source} / ${dataset} / ${model}`);
  return r;
};

export const filtered = (model: Model) => {
  const r = filterOn.find((x) => x.model === model);
  if (!r) throw new Error(`No filter-on run for ${model}`);
  return r;
};

export const averaged = (model: Model): AveragingRun => {
  const r = averaging.find((x) => x.model === model);
  if (!r) throw new Error(`No 10-model test for ${model}`);
  return r;
};

/** Ours = everything that is not the paper. */
export const ours = runs.filter((r) => r.source !== 'paper');

/** "−28.3%" with a real minus sign, one decimal, half away from zero. */
export const signed = (v: number) => {
  const r = Math.round(Math.abs(v) * 10 + 1e-9) / 10;
  return `${v < 0 && r ? '−' : v > 0 && r ? '+' : ''}${r.toFixed(1)}%`;
};

/** Error reduction as a positive number: how far the error fell. */
export const drop = (r: { change: number }) => -r.change;

/** Plain errors are tiny; show them as 0.000527 (six decimals). */
export const mse6 = (v: number) => v.toFixed(6);

/** Relative gap of `a` to `b`, in percent, one decimal. */
export const gapPct = (a: number, b: number) => ((a - b) / b) * 100;

export const sourceLabel: Record<Source, string> = {
  paper: 'Paper',
  alvi: 'Alvi',
  anik: 'Anik',
  samim: 'Samim',
};

/** Which laptop each of us used (shown next to the name). */
export const laptop: Record<Exclude<Source, 'paper'>, { os: 'Windows' | 'Mac'; short: string }> = {
  alvi: { os: 'Windows', short: 'Windows · Ryzen 7' },
  anik: { os: 'Mac', short: 'Mac · M2' },
  samim: { os: 'Windows', short: 'Windows · i7' },
};

/** How many of our runs lowered the error on average (the full runs plus the two safety-test-on runs). */
export const ourRunCount = ours.length + filterOn.length;
export const ourRunsThatImproved = ours.filter((r) => r.change < 0).length + filterOn.filter((r) => r.change < 0).length;
