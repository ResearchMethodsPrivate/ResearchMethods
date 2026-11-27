export type Person = 'Alvi' | 'Anik' | 'Atul' | 'Samim';
export type Model = 'mlp' | 'xgboost';

/** One run of one dataset, size and model: per-seed test errors, in the authors' seed order. */
export interface Cell {
  who: Person;
  platform: 'Windows' | 'Mac';
  dataset: string;
  rows: number;
  model: Model;
  /** True for the runs we had seen before writing the hypotheses. */
  known: boolean;
  plain: number[];
  crda: number[];
  plain10: number[];
  paperChange: number;
  /** Seeds (of 15) whose error equals the authors' saved value. */
  sameAsPaperPlain: number;
  sameAsPaperCrda: number;
}

export interface Data {
  cells: Cell[];
  pending: { who: Person; dataset: string; rows: number; model: Model }[];
  /** Hours of laptop time for all main runs, from the logs (10-model tests not included). */
  runHours: number;
}
