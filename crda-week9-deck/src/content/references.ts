/**
 * Reference list (Harvard style): only sources cited on the Week 9 slides.
 * URLs were checked live on 19 Oct 2026 (paper, code, project page, datasets).
 */
const ACCESSED = 'Accessed: 19 October 2026';

export const referenceGroups: { title: string; items: string[] }[] = [
  {
    title: 'The paper and its code',
    items: [
      'Mohebbi, H., Schulte, O., Li, K. and Poupart, P. (2026) ‘Counterfactual residual data augmentation for regression’, <em>Proceedings of the 43rd International Conference on Machine Learning (ICML)</em>, PMLR 306. Seoul, South Korea.',
      `Mohebbi, H. <em>et al.</em> (2026) <em>CRDA: official code repository</em> [software]. GitHub. Available at: https://github.com/mhmohebbi/CRDA, commit 811e82e (${ACCESSED}).`,
      `Mohebbi, H. <em>et al.</em> (2026) <em>CRDA project page</em>. Available at: https://crda-project.github.io/ (${ACCESSED}).`,
    ],
  },
  {
    title: 'Data we use',
    items: [
      'Tsanas, A. and Xifara, A. (2012) <em>Energy Efficiency</em> [dataset]. UCI Machine Learning Repository. Available at: https://archive.ics.uci.edu/dataset/242/energy+efficiency.',
      'Yeh, I.-C. (1998) <em>Concrete Compressive Strength</em> [dataset]. UCI Machine Learning Repository. Available at: https://archive.ics.uci.edu/dataset/165/concrete+compressive+strength.',
    ],
  },
  {
    title: 'Statistics and our results',
    items: [
      'Wilcoxon, F. (1945) ‘Individual comparisons by ranking methods’, <em>Biometrics Bulletin</em>, 1(6), pp. 80–83.',
      'Fantastic Four (2026) <em>CRDA reproduction: raw results, logs and problem log</em> [data files]. Group repository, <code>results/</code> folder (Alvi, Anik, Samim; 13–16 November 2026).',
    ],
  },
];

export const references: string[] = referenceGroups.flatMap((g) => g.items);
