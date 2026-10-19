/**
 * Reference list (Harvard style). Only sources that are actually cited on the
 * slides. Dataset references are pulled in automatically from the scope in
 * deck.config.ts. URLs were checked live on 19 Oct 2026.
 */
import { scope } from '../config/deck.config';
import { datasets } from './paper';

const ACCESSED = 'Accessed: 19 October 2026';

const core: string[] = [
  'Mohebbi, H., Schulte, O., Li, K. and Poupart, P. (2026) ‘Counterfactual residual data augmentation for regression’, <em>Proceedings of the 43rd International Conference on Machine Learning (ICML)</em>, PMLR 306. Seoul, South Korea.',
  `Mohebbi, H. <em>et al.</em> (2026) <em>CRDA: official code repository</em> [software]. GitHub. Available at: https://github.com/mhmohebbi/CRDA (${ACCESSED}).`,
  `Mohebbi, H. <em>et al.</em> (2026) <em>CRDA project page</em>. Available at: https://crda-project.github.io/ (${ACCESSED}).`,
  'Chawla, N.V., Bowyer, K.W., Hall, L.O. and Kegelmeyer, W.P. (2002) ‘SMOTE: synthetic minority over-sampling technique’, <em>Journal of Artificial Intelligence Research</em>, 16, pp. 321–357.',
  'Kotelnikov, A., Baranchuk, D., Rubachev, I. and Babenko, A. (2023) ‘TabDDPM: modelling tabular data with diffusion models’, <em>Proceedings of the 40th ICML</em>, PMLR 202, pp. 17564–17579.',
  'Pearl, J. (2009) <em>Causality: Models, Reasoning, and Inference</em>. 2nd edn. Cambridge: Cambridge University Press.',
  'Spirtes, P., Glymour, C. and Scheines, R. (2000) <em>Causation, Prediction, and Search</em>. 2nd edn. Cambridge, MA: MIT Press.',
  'Wilcoxon, F. (1945) ‘Individual comparisons by ranking methods’, <em>Biometrics Bulletin</em>, 1(6), pp. 80–83.',
  'Xu, L., Skoularidou, M., Cuesta-Infante, A. and Veeramachaneni, K. (2019) ‘Modeling tabular data using conditional GAN’, <em>Advances in Neural Information Processing Systems</em>, 32.',
  'Yao, H., Wang, Y., Zhang, L., Zou, J.Y. and Finn, C. (2022) ‘C-Mixup: improving generalization in regression’, <em>Advances in Neural Information Processing Systems</em>, 35, pp. 3361–3376.',
];

const datasetRefs: Record<string, string> = {
  tsanas: 'Tsanas, A. and Xifara, A. (2012) <em>Energy Efficiency</em> [dataset]. UCI Machine Learning Repository. Available at: https://archive.ics.uci.edu/dataset/242/energy+efficiency.',
  yeh: 'Yeh, I.-C. (1998) <em>Concrete Compressive Strength</em> [dataset]. UCI Machine Learning Repository. Available at: https://archive.ics.uci.edu/dataset/165/concrete+compressive+strength.',
  pmlb: 'Olson, R.S., La Cava, W., Orzechowski, P., Urbanowicz, R.J. and Moore, J.H. (2017) <em>PMLB: Penn Machine Learning Benchmarks</em>. Available at: https://github.com/EpistasisLab/pmlb.',
  wind: 'Haslett, J. and Raftery, A.E. (1989) <em>Irish wind speed (Malin Head, 1961–1978)</em> [dataset], as cited in Mohebbi et al. (2026).',
  kaggle: 'Montoya, A. and DataCanary (2016) <em>House Prices – Advanced Regression Techniques</em>. Kaggle.',
  parkinsons: 'Tsanas, A. and Little, M. (2009) <em>Parkinsons Telemonitoring</em> [dataset]. UCI Machine Learning Repository.',
  wine: 'Cortez, P., Cerdeira, A., Almeida, F., Matos, T. and Reis, J. (2009) <em>Wine Quality</em> [dataset]. UCI Machine Learning Repository.',
};

const scopedDatasetRefs = [...new Set(scope.datasets.map((k) => datasets[k].refKey))].map((k) => datasetRefs[k]);

const firstAuthor = (s: string) => s.replace(/<[^>]+>/g, '').toLowerCase();

/** Core refs plus the datasets in scope, alphabetical except the paper and repo stay first. */
export const references: string[] = [
  ...core.slice(0, 3),
  ...[...core.slice(3), ...scopedDatasetRefs].sort((a, b) => firstAuthor(a).localeCompare(firstAuthor(b))),
];
