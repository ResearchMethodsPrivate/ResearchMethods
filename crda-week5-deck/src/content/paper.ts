/**
 * Facts taken from the paper and the official repository. Every number here
 * was checked against paper.pdf (Table 1, abstract, Alg. 1) and the repo's
 * README / experiments/*.csv. Do not add numbers that are not in a source.
 *
 * These are REPORTED BY THE ORIGINAL AUTHORS — not our replication results.
 */

export const paper = {
  title: 'Counterfactual Residual Data Augmentation for Regression',
  short: 'CRDA',
  authors: ['Hossein Mohebbi', 'Oliver Schulte', 'Ke Li', 'Pascal Poupart'],
  affiliations: ['University of Waterloo', 'Vector Institute', 'Simon Fraser University'],
  venue: 'ICML 2026 · PMLR 306',
  cite: 'Mohebbi et al., 2026',
  repo: 'github.com/mhmohebbi/CRDA',
  project: 'crda-project.github.io',
  /** Abstract & §5.2: average MSE change across the nine benchmark datasets. */
  headline: { mlp: -22.9, xgb: -6.4 },
};

export type DatasetKey =
  | 'CPUPerformance'
  | 'SatelliteImage'
  | 'WindPower'
  | 'SyntheticRegression'
  | 'ConcreteStrength'
  | 'EnergyEfficiency'
  | 'HousePrice'
  | 'Parkinsons'
  | 'WineQuality';

export interface DatasetInfo {
  label: string;
  /** Rows in the authors' preprocessed CSV (repo README / paper Table 3). */
  n: number;
  file: string;
  refKey: string;
  /** Paper Table 1: [training-subset size, XGB ΔMSE %, MLP ΔMSE %], mean of 15 seeds. */
  table1: [number, number, number][];
}

export const datasets: Record<DatasetKey, DatasetInfo> = {
  CPUPerformance: { label: 'CPU Performance', n: 8192, file: '227_cpu_small.csv', refKey: 'pmlb',
    table1: [[1638, -6.99, -20.24], [3276, -9.47, -14.03], [4914, -6.2, -11.31], [6552, -4.13, -10.48], [8190, -5.19, -10.23]] },
  SatelliteImage: { label: 'Satellite Image', n: 6435, file: '294_satellite_image.csv', refKey: 'pmlb',
    table1: [[1287, -4.54, -18.36], [2574, -3.73, -16.69], [3861, -4.79, -23.14], [5148, -4.73, -23.72], [6435, -5.31, -19.66]] },
  WindPower: { label: 'Wind Power', n: 6574, file: '503_wind.csv', refKey: 'wind',
    table1: [[1314, -2.82, -7.22], [2628, 0.2, -9.17], [3942, -1.33, -9.03], [5256, -1.4, -6.15], [6570, -1.08, -5.56]] },
  SyntheticRegression: { label: 'Synthetic Regression', n: 1000, file: '623_fri_c4_1000_10.csv', refKey: 'pmlb',
    table1: [[200, -12.0, -28.8], [400, -3.16, -36.93], [600, -7.94, -27.91], [800, -2.23, -34.12], [1000, -4.59, -42.33]] },
  ConcreteStrength: { label: 'Concrete Strength', n: 1005, file: 'ConcreteCompressiveStrength.csv', refKey: 'yeh',
    table1: [[201, -8.01, -17.8], [402, -8.43, -19.83], [603, -9.75, -17.64], [804, -15.72, -24.77], [1005, -12.19, -26.9]] },
  EnergyEfficiency: { label: 'Energy Efficiency', n: 768, file: 'EnergyEfficiency.csv', refKey: 'tsanas',
    table1: [[153, -13.33, -25.1], [306, -12.2, -28.13], [459, -10.55, -42.98], [612, -19.35, -40.71], [765, -20.96, -28.31]] },
  HousePrice: { label: 'House Price', n: 1000, file: 'HousePrice.csv', refKey: 'kaggle',
    table1: [[200, -14.23, -40.57], [400, -5.39, -37.02], [600, -4.87, -30.14], [800, -9.86, -30.32], [1000, -6.5, -26.97]] },
  Parkinsons: { label: 'Parkinson’s Monitoring', n: 5875, file: 'ParkinsonsTelemonitoring.csv', refKey: 'parkinsons',
    table1: [[1175, -8.4, -36.17], [2350, -6.6, -31.82], [3525, -2.79, -36.6], [4700, -6.26, -46.4], [5875, 1.65, -47.23]] },
  WineQuality: { label: 'Wine Quality', n: 5318, file: 'WineQuality.csv', refKey: 'wine',
    table1: [[1063, 0.31, -0.34], [2126, 1.01, -5.24], [3189, -0.33, -3.63], [4252, -0.61, -4.44], [5315, -1.08, -4.99]] },
};

/** Things we noticed while auditing the repo; framed as questions, not findings. */
export const auditQuestions = [
  'Their main table switches CRDA on even when the safety test says no',
  'Their final score averages 10 models, not one as the paper describes',
];
