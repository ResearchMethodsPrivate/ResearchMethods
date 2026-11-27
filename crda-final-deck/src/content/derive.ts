/** Hypothesis results computed from data.json, so slides and notes never repeat a number by hand. */
import { holm, mean, pctChange, wilcoxonLess } from '../lib/stats';
import raw from './data.json';
import type { Cell, Data, Model } from './types';

export const data = raw as Data;

export interface Scored extends Cell {
  change: number; // CRDA vs one plain model
  averaging: number; // 10 plain models vs one plain model
  over: number; // CRDA vs 10 plain models
  p1: number;
  p3a: number;
  p3b: number;
  h1: boolean;
  h2: boolean;
  h3a: boolean;
  h3b: boolean;
}

export const score = (c: Cell): Scored => {
  const change = mean(pctChange(c.plain, c.crda));
  const p1 = wilcoxonLess(c.crda, c.plain);
  const p3a = wilcoxonLess(c.plain10, c.plain);
  const p3b = wilcoxonLess(c.crda, c.plain10);
  return {
    ...c,
    change,
    averaging: mean(pctChange(c.plain, c.plain10)),
    over: mean(pctChange(c.plain10, c.crda)),
    p1, p3a, p3b,
    h1: change < 0 && p1 < 0.05,
    h2: Math.abs(change - c.paperChange) <= 5,
    h3a: p3a < 0.05,
    h3b: p3b < 0.05,
  };
};

export const scored = data.cells.map(score);
/** The cells the hypotheses were written for. */
export const fresh = scored.filter((c) => !c.known);
export const known = scored.filter((c) => c.known);
export const PLANNED = 30;

export type Hypothesis = 'h1' | 'h2' | 'h3a' | 'h3b';

export const tally = (h: Hypothesis, model?: Model, cells: Scored[] = fresh) => {
  const set = cells.filter((c) => !model || c.model === model);
  return { yes: set.filter((c) => c[h]).length, of: set.length };
};

/** Cells that still pass after the Holm correction over all new cells (H2 is not a test). */
export const tallyHolm = (h: Exclude<Hypothesis, 'h2'>, cells: Scored[] = fresh) => {
  const p = { h1: 'p1', h3a: 'p3a', h3b: 'p3b' } as const;
  const ok = holm(cells.map((c) => c[p[h]]));
  return cells.filter((c, i) => ok[i] && (h !== 'h1' || c.change < 0)).length;
};

/** Cells whose CRDA errors equal the authors' saved ones on every seed, per platform. */
export const exactRuns = (platform: Cell['platform'], cells: Scored[] = fresh) => {
  const set = cells.filter((c) => c.platform === platform);
  return { yes: set.filter((c) => c.sameAsPaperCrda === 15).length, of: set.length };
};

/** Largest gap between our average plain error and the authors', in percent, per platform and model. */
export const plainGap = (platform: Cell['platform'], model: Model) => {
  const paperPlain = (c: Scored) => c.sameAsPaperPlain;
  const set = fresh.filter((c) => c.platform === platform && c.model === model);
  return { exact: set.filter((c) => paperPlain(c) === 15).length, of: set.length };
};

export const NAMES: Record<string, string> = {
  EnergyEfficiency: 'Energy Efficiency',
  ConcreteCompressiveStrength: 'Concrete Strength',
  HousePrice: 'House Price',
  '623_fri_c4_1000_10': 'Synthetic',
  '227_cpu_small': 'CPU Performance',
  '294_satellite_image': 'Satellite Image',
  '503_wind': 'Wind',
  ParkinsonsTelemonitoring: 'Parkinson’s',
  WineQuality: 'Wine Quality',
};
export const MODEL: Record<Model, string> = { mlp: 'Neural network', xgboost: 'XGBoost' };

/** "−28.3%" with a real minus sign, one decimal. */
export const signed = (v: number) => {
  const r = Math.round(Math.abs(v) * 10 + 1e-9) / 10;
  return `${v < 0 && r ? '−' : v > 0 && r ? '+' : ''}${r.toFixed(1)}%`;
};
