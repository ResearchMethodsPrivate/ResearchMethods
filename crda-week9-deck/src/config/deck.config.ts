/**
 * Everything team-specific for the Week 9 progress update.
 *
 *  ✔ Presenters: Anik, Alvi, Atul, Samim (that spelling), group "Triple A".
 *  ✔ Speaking split below follows each person's role (suggested in
 *    results/atul/week9_outline.md). Change it here and the notes, footer and
 *    timing model follow.
 *  ✔ Presentation date: 20 November 2026 (confirmed by Alvi, 16 Nov 2026).
 *
 *  `npm run validate:deck` — development checks.
 *  `npm run validate:ready` — presentation-ready (fails while a team decision is open).
 */
export type MemberId = 'A' | 'B' | 'C' | 'D';

export interface Member {
  id: MemberId;
  name: string;
  role: string;
}

export const group: { name: string; date: string | null; module: string; session: string } = {
  name: 'Triple A',
  date: '20 November 2026',
  module: 'ECS7029P Research Methods · 2026/27',
  session: 'Week 9 · Progress update',
};

export const members: Member[] = [
  { id: 'A', name: 'Anik', role: 'Setting up the code' },
  { id: 'B', name: 'Alvi', role: 'Running the experiments' },
  { id: 'C', name: 'Atul', role: 'Comparing and presenting' },
  { id: 'D', name: 'Samim', role: 'Statistics and code checks' },
];

/** Which member presents each slide (by slide id). */
export type SpeakingSplit = Record<string, MemberId[]>;

export const speaking: SpeakingSplit = {
  title: ['A'],
  progress: ['A'],
  method: ['B'],
  results: ['B', 'D'],
  matched: ['C'],
  safety: ['D'],
  next: ['C'],
  references: ['C'],
};

export const team = { members, speaking };

export const researchQuestion =
  'Do the authors’ improvements hold up when we re-run their own code, and where do they not?';

/** Open team decisions, listed by validate:ready. */
export const openDecisions = (): string[] => [
  ...(group.date ? [] : ['Presentation date (group.date)']),
];
