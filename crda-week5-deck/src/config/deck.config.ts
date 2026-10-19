/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONE FILE TO EDIT.
 *  Group details, speaking split, replication scope and Week 9 targets all live
 *  here. Anything we have not decided yet is marked TODO / PLACEHOLDER and is
 *  rendered on-screen with a dashed amber outline so it cannot slip through.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { DatasetKey } from '../content/paper';

export type MemberId = 'A' | 'B' | 'C';

export interface Member {
  id: MemberId;
  /** Replace with the real name, e.g. 'Priya Shah'. */
  name: string;
  role: string;
  owns: string[];
  /** Whose work this person independently checks (drawn as an arrow). */
  checks: MemberId;
  crossCheck: string;
}

export interface Milestone {
  title: string;
  /** Measurable "done" criterion. */
  doneWhen: string;
  /** Evidence we will show at Week 9. */
  evidence: string;
  owners: MemberId[];
  /** e.g. 'Week 6'. */
  due: string;
}

/** Speaking split: which member presents each slide (by slide id). */
export type SpeakingSplit = Record<string, MemberId[]>;

interface TeamPreset {
  members: Member[];
  speaking: SpeakingSplit;
}

// ── 1. Group ────────────────────────────────────────────────────────────────
export const group = {
  name: 'TODO: Group name / number',
  module: 'ECS7029P Research Methods · 2026/27',
  session: 'Week 5 · First interim presentation',
  date: 'TODO: presentation date',
};

// ── 2. Team size: set to 2 or 3 ─────────────────────────────────────────────
export const MEMBER_COUNT = 3 as 2 | 3;

const threePeople: TeamPreset = {
  members: [
    {
      id: 'A',
      name: 'TODO: Member A',
      role: 'Environment & reproducibility',
      owns: [
        'Python 3.11 env from the authors’ pinned requirements',
        'Run the demo notebook end-to-end',
        'Seed, config and version logging',
      ],
      checks: 'B',
      crossCheck: 'Re-runs one of B’s configs independently',
    },
    {
      id: 'B',
      name: 'TODO: Member B',
      role: 'Experiment execution',
      owns: [
        'Baseline vs CRDA runs (MLP, XGBoost)',
        'Controlled splits and seeds',
        'Saves every config.json / results.csv',
      ],
      checks: 'C',
      crossCheck: 'Recomputes C’s comparison table from raw results',
    },
    {
      id: 'C',
      name: 'TODO: Member C',
      role: 'Analysis, documentation & delivery',
      owns: [
        'Our ΔMSE vs the paper’s Table 1',
        'Obstacle and deviation log',
        'Slides, timing and rehearsal',
      ],
      checks: 'A',
      crossCheck: 'Rebuilds A’s environment from the written steps',
    },
  ],
  speaking: {
    title: ['A'],
    problem: ['A'],
    naive: ['A'],
    mechanism: ['B'],
    assumption: ['B'],
    plan: ['C'],
    team: ['A', 'B', 'C'],
    targets: ['C'],
    references: ['C'],
  },
};

const twoPeople: TeamPreset = {
  members: [
    {
      id: 'A',
      name: 'TODO: Member A',
      role: 'Environment, reproducibility & analysis',
      owns: [
        'Python 3.11 env + demo notebook run',
        'Seed, config and version logging',
        'Our ΔMSE vs the paper’s Table 1',
      ],
      checks: 'B',
      crossCheck: 'Re-runs one of B’s configs independently',
    },
    {
      id: 'B',
      name: 'TODO: Member B',
      role: 'Experiments, documentation & delivery',
      owns: [
        'Baseline vs CRDA runs (MLP, XGBoost)',
        'Obstacle and deviation log',
        'Slides, timing and rehearsal',
      ],
      checks: 'A',
      crossCheck: 'Rebuilds A’s environment from the written steps',
    },
  ],
  speaking: {
    title: ['A'],
    problem: ['A'],
    naive: ['A'],
    mechanism: ['A'],
    assumption: ['B'],
    plan: ['B'],
    team: ['A', 'B'],
    targets: ['B'],
    references: ['B'],
  },
};

export const team: TeamPreset = MEMBER_COUNT === 2 ? twoPeople : threePeople;

// ── 3. Replication scope (adjustable without touching the slides) ────────────
export const scope = {
  /** First dataset is the primary target; the authors' demo also uses it. */
  datasets: ['EnergyEfficiency', 'ConcreteStrength'] as DatasetKey[],
  models: ['MLP', 'XGBoost'],
  /** The paper averages over 15 seeds; we may start smaller and say so. */
  seeds: 'TODO: e.g. 3 seeds first pass (paper: 15)',
  /** Status shown on the plan slide. Do not change until work is done. */
  status: 'Proposed — not yet started',
};

// ── 4. Targets before Week 9 ────────────────────────────────────────────────
export const milestones: Milestone[] = [
  {
    title: 'Environment reproduced',
    doneWhen: 'Authors’ demo notebook runs end-to-end on our machine',
    evidence: 'pip freeze, OS / CPU note, demo output',
    owners: ['A'],
    due: 'TODO: Week 6',
  },
  {
    title: 'Baselines logged',
    doneWhen: 'Unaugmented MLP + XGBoost on dataset 1, fixed seeds',
    evidence: 'config.json + results.csv per run',
    owners: ['B'],
    due: 'TODO: Week 7',
  },
  {
    title: 'First CRDA comparison',
    doneWhen: 'Our ΔMSE next to the paper’s Table 1 row',
    evidence: 'Side-by-side table, Wilcoxon p-values',
    owners: MEMBER_COUNT === 2 ? ['A', 'B'] : ['B', 'C'],
    due: 'TODO: Week 8',
  },
  {
    title: 'Obstacle log',
    doneWhen: 'Every deviation recorded with its fix or open question',
    evidence: 'Shared log, discussed at Week 9',
    owners: MEMBER_COUNT === 2 ? ['B'] : ['C'],
    due: 'Ongoing',
  },
];

// ── 5. Closing research question ────────────────────────────────────────────
export const researchQuestion =
  'Do CRDA’s reported gains hold when we re-run the authors’ own pipeline — and where do they not?';
