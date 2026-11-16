/**
 * Every number on the Week 9 slides comes from this file. Values are copied from
 * the raw result files and re-checked against them by tests/unit/results.test.ts:
 *   paper  = the authors' saved Table 1 files (tests/fixtures/paper/, from github.com/mhmohebbi/CRDA @ 811e82e)
 *   alvi / anik / samim = results/<name>-<laptop>/ in the group repo
 * `change` = mean over seeds of the per-seed % change in error (as the paper reports it).
 * `p` = mean over seeds of the per-seed Wilcoxon p (10 cross-validation folds).
 */
export type Source = 'paper' | 'alvi' | 'anik' | 'samim';
export type Dataset = 'EnergyEfficiency' | 'ConcreteStrength';
export type Model = 'MLP' | 'XGBoost';

export interface Run {
  source: Source;
  dataset: Dataset;
  model: Model;
  seeds: number;
  /** Test error (MSE) of the plain model, mean over seeds. */
  plain: number;
  /** Test error (MSE) with CRDA, mean over seeds. */
  crda: number;
  change: number;
  p: number;
  /** Seeds where CRDA lowered the error. */
  improved: number;
  /** Seeds where the safety check passed. */
  gate: number;
}

export const runs: Run[] = [
  { source: 'paper', dataset: 'EnergyEfficiency', model: 'MLP', seeds: 15, plain: 0.0005273753522654251, crda: 0.0003479677094177402, change: -28.30554218361815, p: 0.013020833333333334, improved: 13, gate: 12 },
  { source: 'alvi', dataset: 'EnergyEfficiency', model: 'MLP', seeds: 15, plain: 0.0005273753522653645, crda: 0.00033534720576728353, change: -28.692563028831536, p: 0.015950520833333332, improved: 13, gate: 12 },
  { source: 'anik', dataset: 'EnergyEfficiency', model: 'MLP', seeds: 15, plain: 0.0005273753522654251, crda: 0.0003211293283857858, change: -32.1664309054976, p: 0.0048828125, improved: 14, gate: 13 },
  { source: 'paper', dataset: 'EnergyEfficiency', model: 'XGBoost', seeds: 15, plain: 0.0009675013237280992, crda: 0.0007612863356135901, change: -20.960276522224618, p: 0.0419921875, improved: 13, gate: 11 },
  { source: 'alvi', dataset: 'EnergyEfficiency', model: 'XGBoost', seeds: 15, plain: 0.00100254567973541, crda: 0.0007827045734232119, change: -21.68789839994609, p: 0.041015625, improved: 13, gate: 11 },
  { source: 'anik', dataset: 'EnergyEfficiency', model: 'XGBoost', seeds: 15, plain: 0.0009675013237280992, crda: 0.0007786155116237578, change: -18.227523806989236, p: 0.024479166666666666, improved: 12, gate: 12 },
  { source: 'paper', dataset: 'ConcreteStrength', model: 'MLP', seeds: 15, plain: 0.004223894172177673, crda: 0.0030642383857213966, change: -26.89615264428095, p: 0.0009765625, improved: 15, gate: 15 },
  { source: 'samim', dataset: 'ConcreteStrength', model: 'MLP', seeds: 15, plain: 0.004223894172177675, crda: 0.0031797075859321742, change: -24.24400723943358, p: 0.0018229166666666667, improved: 15, gate: 15 },
  { source: 'paper', dataset: 'ConcreteStrength', model: 'XGBoost', seeds: 15, plain: 0.0028980347676566772, crda: 0.002559415335784662, change: -12.186742199668496, p: 0.0099609375, improved: 15, gate: 14 },
  { source: 'samim', dataset: 'ConcreteStrength', model: 'XGBoost', seeds: 15, plain: 0.0029584747389718117, crda: 0.0025327064436263544, change: -14.583301888081902, p: 0.008528645833333333, improved: 15, gate: 14 },
];

/** Samim's Energy Efficiency runs with the safety check left ON: seeds that fail it are dropped. */
export interface FilterRun extends Omit<Run, 'source'> {
  droppedSeeds: number[];
  /** Positions (0–14) of the dropped seeds in the order the 15 repeats ran. */
  droppedPositions: number[];
}
export const filterOn: FilterRun[] = [
  { dataset: 'EnergyEfficiency', model: 'MLP', seeds: 13, plain: 0.0005363629802466716, crda: 0.00033146122396961246, change: -31.58874017976604, p: 0.007436899038461538, improved: 11, gate: 13, droppedSeeds: [117952, 359783], droppedPositions: [3, 7] },
  { dataset: 'EnergyEfficiency', model: 'XGBoost', seeds: 11, plain: 0.0010054849133669423, crda: 0.0008007031956770396, change: -19.764635715139043, p: 0.007279829545454545, improved: 9, gate: 11, droppedSeeds: [117952, 963395, 359783, 735831], droppedPositions: [3, 4, 7, 13] },
];

/** One example of how much a single repeat can move: Alvi's Energy Efficiency neural-network run. */
export const perSeedSpread = { source: 'alvi', dataset: 'EnergyEfficiency', model: 'MLP', min: -66.60786116489237, max: 24.661639773593333 } as const;
