/**
 * Our own run of the authors' demo (demo/demonstration.ipynb, Energy Efficiency,
 * one seed, CPU only) on each presenter's laptop, 22 Oct 2026.
 * Source: the three reports in docs/demo-reports/ — raw values copied verbatim
 * from each machine's results.csv. Nothing here is from the paper's Table 1.
 *
 * `authors` = the output stored in the authors' own notebook cells (cell 6 / 11).
 */
import type { MemberId } from '../config/deck.config';

export interface ModelResult { before: number; after: number; p: number }
export interface Machine {
  owner: MemberId;
  /** Short tag shown next to the presenter's name, so the audience can match name to machine. */
  label: string;
  /** Marketing name as reported by the OS. */
  cpu: string;
  gpu: string;
  ram: string;
  os: string;
  /** Exact interpreter and wheel versions used for the run. */
  python: string;
  /** Wall-clock seconds for the whole script (both models). */
  seconds: number;
  mlp: ModelResult;
  xgb: ModelResult;
}

export const authors: { mlp: ModelResult; xgb: ModelResult } = {
  mlp: { before: 0.0013208531242431083, after: 0.0006385091123391668, p: 0.0009765625 },
  xgb: { before: 0.001300772579836663, after: 0.0009294087500910523, p: 0.0419921875 },
};

export const machines: Machine[] = [
  {
    owner: 'A',
    label: 'M2',
    cpu: 'Apple M2 (8 cores)',
    gpu: 'Apple M2 (built in)',
    ram: '8 GB',
    os: 'macOS 14.6.1',
    python: '3.11.5',
    seconds: 41,
    mlp: { before: 0.0013208531242431083, after: 0.0006385091123391668, p: 0.0009765625 },
    xgb: { before: 0.001300772579836663, after: 0.0009294087500910523, p: 0.0419921875 },
  },
  {
    owner: 'B',
    label: 'Ryzen 7 · RTX 3070',
    cpu: 'AMD Ryzen 7 5800H (8 cores)',
    gpu: 'NVIDIA RTX 3070 Laptop',
    ram: '64 GB',
    os: 'Windows 11 (build 26340)',
    python: '3.11.15',
    seconds: 184,
    mlp: { before: 0.0013208531242431085, after: 0.0006385091123391672, p: 0.0009765625 },
    xgb: { before: 0.001265737172655872, after: 0.0009523574719362728, p: 0.0322265625 },
  },
  {
    owner: 'C',
    label: 'M5 Pro',
    cpu: 'Apple M5 Pro',
    gpu: 'Apple M5 Pro (built in)',
    ram: '24 GB',
    os: 'macOS 27.0.1',
    python: '3.11.17',
    seconds: 34,
    mlp: { before: 0.0013208531242431085, after: 0.0006385091123391665, p: 0.0009765625 },
    xgb: { before: 0.001300772579836663, after: 0.0009294087500910523, p: 0.0419921875 },
  },
];

/** Library versions pinned by the authors' requirements.txt and used on all three machines. */
export const pinned = { torch: '2.7.0', scikitLearn: '1.7.0rc1', xgboost: '3.0.1', numpy: '2.2.6' };

/** Percentage change in test MSE, as the repo defines it: 100·(aug − base)/base. */
export const pctChange = (r: ModelResult) => (100 * (r.after - r.before)) / r.before;

/** Relative gap of the BASELINE error to the authors' recorded one. */
export const baselineGap = (r: ModelResult, ref: ModelResult) => Math.abs(r.before - ref.before) / ref.before;

/** "identical" if every recorded number agrees to ~1e-9 relative; otherwise "differs". */
export const matchesAuthors = (r: ModelResult, ref: ModelResult) =>
  Math.abs(r.before - ref.before) / ref.before < 1e-9 &&
  Math.abs(r.after - ref.after) / ref.after < 1e-9 &&
  Math.abs(r.p - ref.p) < 1e-9;

/** Deviations found while getting the demo to run — first entries of the obstacle log. */
export const deviations = [
  'A library version wouldn’t run on new macOS; a newer one gave the same results',
  'Windows XGBoost differs, even for the plain model (0.00127 vs 0.00130); we don’t know why yet',
];
