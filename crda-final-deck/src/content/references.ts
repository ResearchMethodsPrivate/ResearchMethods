/**
 * ACM style (numbered, alphabetical), as in the module's literature review template.
 * Entries other than Holm (1979) are taken from the paper's own reference list.
 */
export interface Reference { key: string; text: string }

const list: Reference[] = [
  { key: 'optuna', text: 'Takuya Akiba, Shotaro Sano, Toshihiko Yanase, Takeru Ohta, and Masanori Koyama. 2019. Optuna: A next-generation hyperparameter optimization framework. In <em>Proc. KDD ’19</em>, 2623–2631.' },
  { key: 'xgboost', text: 'Tianqi Chen and Carlos Guestrin. 2016. XGBoost: A scalable tree boosting system. In <em>Proc. KDD ’16</em>, 785–794.' },
  { key: 'wine', text: 'Paulo Cortez, António Cerdeira, Fernando Almeida, Telmo Matos, and José Reis. 2009. Wine Quality [dataset]. UCI Machine Learning Repository.' },
  { key: 'wind', text: 'John Haslett and Adrian E. Raftery. 1989. Irish Wind Speed [dataset].' },
  { key: 'holm', text: 'Sture Holm. 1979. A simple sequentially rejective multiple test procedure. <em>Scandinavian Journal of Statistics</em> 6, 2, 65–70.' },
  { key: 'tabddpm', text: 'Akim Kotelnikov, Dmitry Baranchuk, Ivan Rubachev, and Artem Babenko. 2023. TabDDPM: Modelling tabular data with diffusion models. In <em>Proc. ICML ’23</em>, 17564–17579.' },
  { key: 'parkinsons', text: 'Max A. Little. 2009. Parkinsons Telemonitoring [dataset]. UCI Machine Learning Repository.' },
  { key: 'crda', text: 'Hossein Mohebbi, Oliver Schulte, Ke Li, and Pascal Poupart. 2026. Counterfactual residual data augmentation for regression. In <em>Proc. ICML ’26</em>, PMLR 306.' },
  { key: 'code', text: 'Hossein Mohebbi et al. 2026. CRDA: official code repository, commit 811e82e. https://github.com/mhmohebbi/CRDA' },
  { key: 'house', text: 'Anna Montoya and DataCanary. 2016. House Prices: Advanced Regression Techniques [dataset]. Kaggle.' },
  { key: 'pmlb', text: 'Randal S. Olson, William La Cava, Patryk Orzechowski, Ryan J. Urbanowicz, and Jason H. Moore. 2017. PMLB datasets 227 cpu small, 294 satellite image and 623 fri. Penn Machine Learning Benchmarks.' },
  { key: 'ada', text: 'Noam Schneider, Shirin Goshtasbpour, and Fernando Perez-Cruz. 2023. Anchor data augmentation. <em>Advances in Neural Information Processing Systems</em> 36, 74890–74902.' },
  { key: 'energy', text: 'Athanasios Tsanas and Angeliki Xifara. 2012. Energy Efficiency [dataset]. UCI Machine Learning Repository.' },
  { key: 'wilcoxon', text: 'Frank Wilcoxon. 1945. Individual comparisons by ranking methods. <em>Biometrics Bulletin</em> 1, 6, 80–83.' },
  { key: 'ctgan', text: 'Lei Xu, Maria Skoularidou, Alfredo Cuesta-Infante, and Kalyan Veeramachaneni. 2019. Modeling tabular data using conditional GAN. <em>Advances in Neural Information Processing Systems</em> 32.' },
  { key: 'cmixup', text: 'Huaxiu Yao, Yiping Wang, Linjun Zhang, James Zou, and Chelsea Finn. 2022. C-Mixup: Improving generalization in regression. <em>Advances in Neural Information Processing Systems</em> 35, 3361–3376.' },
  { key: 'concrete', text: 'I-Cheng Yeh. 1998. Concrete Compressive Strength [dataset]. UCI Machine Learning Repository.' },
];

export const references = list;

/** "[3, 8]" for footers and slide text. Fails loudly on a key that does not exist. */
export const cite = (...keys: string[]) =>
  `[${keys
    .map((k) => {
      const i = list.findIndex((r) => r.key === k);
      if (i < 0) throw new Error(`Unknown reference: ${k}`);
      return i + 1;
    })
    .sort((a, b) => a - b)
    .join(', ')}]`;
