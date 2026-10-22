/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONE FILE TO EDIT.
 *
 *  WHAT IS CONFIRMED (keep this block honest):
 *   ✔ Presenters: exactly three — Anik, Alvi, Atul (that spelling).
 *   ✔ Speaking split: Anik slides 1–3, Alvi 4–5, Atul 6–7 and 9–10; everyone
 *     speaks to their own row/card on slides 7 and 8.
 *   ✔ Group name "Triple A" and presentation date 23 October 2026.
 *   ✔ Research roles + cross-check pairs, replication scope, and milestone
 *     weeks/owners — confirmed 22 Oct 2026 by Alvi, relaying the group's
 *     decision to keep them exactly as listed below. (Anik and Atul: shout if
 *     that isn't right; set the matching `*Status` back to 'proposed' and the
 *     slides will show "Proposed" labels again.)
 *
 *  `npm run validate:deck`  — development checks (passes with proposals).
 *  `npm run validate:ready` — presentation-ready checks (fails until every
 *                             PROPOSED/UNKNOWN item above is confirmed).
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { DatasetKey } from '../content/paper';

export type MemberId = 'A' | 'B' | 'C';
export type Status = 'confirmed' | 'proposed';

export interface Member {
  id: MemberId;
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
  /** Set once the evidence exists. Only true for things that have actually happened. */
  done?: { on: string };
}

/** Speaking split: which member presents each slide (by slide id). */
export type SpeakingSplit = Record<string, MemberId[]>;

// ── 1. Group (null = unknown → not displayed; validate:ready fails) ──────────
export const group: { name: string | null; date: string | null; module: string; session: string } = {
  name: 'Triple A',
  date: '23 October 2026',
  module: 'ECS7029P Research Methods · 2026/27',
  session: 'Week 5 · First interim presentation',
};

// ── 2. Team — exactly three confirmed presenters ────────────────────────────
export const members: Member[] = [
  {
    id: 'A',
    name: 'Anik',
    role: 'Environment & reproducibility',
    owns: [
      'Python 3.11 env from the authors’ pinned requirements',
      'Environment notes for every platform we use',
      'Seed, config and version logging',
    ],
    checks: 'B',
    crossCheck: 'Re-runs one of Alvi’s configs independently',
  },
  {
    id: 'B',
    name: 'Alvi',
    role: 'Experiment execution',
    owns: [
      'Baseline vs CRDA runs (MLP, XGBoost)',
      'Controlled splits and seeds',
      'Saves every config.json / results.csv',
    ],
    checks: 'C',
    crossCheck: 'Recomputes Atul’s comparison table from raw results',
  },
  {
    id: 'C',
    name: 'Atul',
    role: 'Analysis, documentation & delivery',
    owns: [
      'Our ΔMSE next to the paper’s Table 1',
      'Obstacle and deviation log',
      'Slides, timing and rehearsal',
    ],
    checks: 'A',
    crossCheck: 'Rebuilds Anik’s environment from the written steps',
  },
];

/** Research-role allocation above. Confirmed 22 Oct 2026 (see header). */
export const rolesStatus = 'confirmed' as Status;

/** Confirmed by the team brief. */
export const speaking: SpeakingSplit = {
  title: ['A'],
  problem: ['A'],
  naive: ['A'],
  mechanism: ['B'],
  assumption: ['B'],
  plan: ['C'],
  demo: ['A', 'B', 'C'],
  team: ['A', 'B', 'C'],
  targets: ['C'],
  references: ['C'],
};

export const team = { members, speaking };

// ── 3. Replication scope (confirmed initial scope) ──────────────────────────
export const scope = {
  /** First dataset is the primary target; the authors' demo also uses it. */
  datasets: ['EnergyEfficiency', 'ConcreteStrength'] as DatasetKey[],
  models: ['MLP', 'XGBoost'],
  /** First-pass seeds per configuration; the paper averages 15. */
  seeds: 3,
  paperSeeds: 15,
  status: 'confirmed' as Status,
};

// ── 4. Targets before Week 9 (confirmed weeks and owners) ───────────────────
export const milestones: Milestone[] = [
  {
    title: 'Environment reproduced',
    doneWhen: 'Authors’ demo runs end-to-end on our laptops',
    evidence: 'Exact versions + CPU/OS logged; 3 laptops (docs/demo-reports/)',
    owners: ['A'],
    due: 'Week 6',
    done: { on: '22 Oct' },
  },
  {
    title: 'Baselines logged',
    doneWhen: 'Unaugmented MLP + XGBoost on dataset 1, fixed seeds',
    evidence: 'config.json + results.csv per run',
    owners: ['B'],
    due: 'Week 7',
  },
  {
    title: 'First CRDA comparison',
    doneWhen: 'Our ΔMSE next to the paper’s Table 1 row',
    evidence: 'Side-by-side table, Wilcoxon p-values',
    owners: ['B', 'C'],
    due: 'Week 8',
  },
  {
    title: 'Obstacle log',
    doneWhen: 'Every deviation recorded with its fix or open question',
    evidence: 'Shared log, discussed at Week 9',
    owners: ['C'],
    due: 'Ongoing',
  },
];
export const milestonesStatus = 'confirmed' as Status;

// ── 5. Closing research question ────────────────────────────────────────────
export const researchQuestion =
  'Do CRDA’s reported gains hold when we re-run the authors’ own pipeline — and where do they not?';

/** Open team decisions, listed by validate:ready and the README checklist. */
export const openDecisions = (): string[] => [
  ...(group.name ? [] : ['Group name / number (group.name)']),
  ...(group.date ? [] : ['Presentation date (group.date)']),
  ...(rolesStatus === 'confirmed' ? [] : ['Agree research roles and cross-check pairs (rolesStatus)']),
  ...(scope.status === 'confirmed' ? [] : ['Agree replication scope: datasets, models, seeds (scope.status)']),
  ...(milestonesStatus === 'confirmed' ? [] : ['Agree milestone weeks and owners (milestonesStatus)']),
];
