/** Team settings for the final presentation. Change speakers here and the footer and notes follow. */
export type MemberId = 'A' | 'B' | 'C' | 'D';

export const group = {
  name: 'Fantastic Four',
  date: '11 December 2026',
  module: 'ECS7029P Research Methods · 2026/27',
};

/** Set to false when the team has rewritten and approved the slides. Removes the DRAFT mark. */
export const DRAFT = true;

export const members: { id: MemberId; name: string }[] = [
  { id: 'A', name: 'Anik' },
  { id: 'B', name: 'Alvi' },
  { id: 'C', name: 'Samim' },
  { id: 'D', name: 'Atul' },
];

/** Suggested split: three content slides each. */
export const speaking: Record<string, MemberId[]> = {
  title: ['A'], question: ['A'], background: ['A'], method: ['A'],
  hypotheses: ['B'], design: ['B'], replication: ['B'],
  platforms: ['C'], extension: ['C'], weaknesses: ['C'],
  ethics: ['D'], verdict: ['D'], roles: ['D'], references: ['D'],
};

export const team = { members, speaking };

export const researchQuestion =
  'Do the authors’ improvements hold up when we re-run their own code, and where do they not?';

/** To confirm with the team before submission; listed by `npm run validate:ready`. */
export const toConfirm = {
  /** Anik: replace with the checked licence of each data source, then set to ''. */
  dataLicences: 'Licences of the nine datasets: to check',
  /** Everyone: set true after reading your own line on the “who did what” slide. */
  rolesAgreed: false,
};
