<!-- Samim, Windows 11, Intel i7-13620H, run on 6 Nov 2026. Copied verbatim from his CRDA_all_results.md; only his Windows user name in file paths is replaced by <samim>. -->

# CRDA demo — complete results record

Every number below is copied verbatim from the files the run produced. Where a table repeats a published figure, it says whose it is.

- **Repo:** https://github.com/mhmohebbi/CRDA, HEAD `811e82ef29f34488384bffaa2fccf7775810345e` (Fri May 29 02:56:12 2026 -0400), cloned with `git -c core.longpaths=true clone --depth 1`
- **Working copy:** `C:\Users\<samim>\CRDA`
- **Generated:** 2026-11-06 13:16:06
- **Companion file:** `C:\Users\<samim>\CRDA_demo_report.md` — the short report in Alvi's template

## 1. Headline

| Model | Baseline MSE | Augmented MSE | Change | Wilcoxon p | Safety gate |
|---|---|---|---|---|---|
| MLP | `0.0013208531242431085` | `0.0006385091123391672` | -51.65934 % | `0.0009765625` | passed (`1.0`) |
| XGBoost | `0.001265737172655872` | `0.0009523574719362728` | -24.75867 % | `0.0322265625` | passed (`1.0`) |

Against the other records:

| Model | Authors' notebook (2025-05-23) | Alvi's Windows laptop | This laptop (both runs) |
|---|---|---|---|
| MLP | 0.00132 -> 0.00064, -51.7 %, p = 0.00098 | identical | 0.00132 -> 0.00064, -51.7 %, p = 0.00098 |
| XGBoost | 0.00130 -> 0.00093, -28.6 %, p = 0.042 | 0.00127 -> 0.00095, -24.8 %, p = 0.032 | 0.00127 -> 0.00095, -24.8 %, p = 0.032 |

**Verdict: PASS.** MLP reproduces the authors' recorded demo exactly. XGBoost improves 3.8 percentage points less than their recording (24.8 % against 28.6 %) but matches Alvi's Windows result digit for digit, and the safety gate passes in both models.

## 2. Machine and environment

| Item | Value |
|---|---|
| OS | Microsoft Windows 11 Home, 10.0.26300 |
| CPU | 13th Gen Intel Core i7-13620H |
| RAM | 15.6 GB |
| GPU | Intel UHD Graphics (integrated; the demo is CPU-only) |
| Default `python` on this machine (not used) | 3.14.4 |
| Test interpreter | CPython 3.11.18 (`uv venv --python 3.11`) |
| torch | 2.7.0+cpu |
| scikit-learn | 1.7.0rc1 |
| xgboost | 3.0.1 |
| causal-learn | 0.1.4.1 |
| graphviz (Python package) | 0.20.3 |
| Graphviz binaries (`dot -V`) | `dot - graphviz version 12.2.1 (20241206.2353)` |
| Installed packages | 236 in `~/CRDA/.venv/Lib/site-packages` |

## 3. What was executed

The repo ships only `demo/demonstration.ipynb`. This test added `demo/run_demo.py`, which builds the same two `Config` objects as the notebook and calls `Experiment(config, Logger()).run()` then `.plot_results()` for each, and ran it from inside `demo/`:

```bash
cd ~/CRDA/demo
PATH="$HOME/tools/gv/Graphviz-12.2.1-win64/bin:$PATH" ../.venv/Scripts/python.exe run_demo.py
```

## 4. Results — verbatim `results.csv`

### 4.1 MLP (`demo/EnergyEfficiency/mlp_20261106-130309/results.csv`)

```csv
dataset,metric,mean,std
EnergyEfficiency,mse,0.0013208531242431085,
EnergyEfficiency,aug_mse,0.0006385091123391672,
EnergyEfficiency,delta_mse,-51.65934042022624,
EnergyEfficiency,p_wilcoxon,0.0009765625,
EnergyEfficiency,should_proceed,1.0,
```

### 4.2 XGBoost (`demo/EnergyEfficiency/xgboost_20261106-130403/results.csv`)

```csv
dataset,metric,mean,std
EnergyEfficiency,mse,0.001265737172655872,
EnergyEfficiency,aug_mse,0.0009523574719362728,
EnergyEfficiency,delta_mse,-24.75867087493691,
EnergyEfficiency,p_wilcoxon,0.0322265625,
EnergyEfficiency,should_proceed,1.0,
```

The `std` column is empty in both: `run()` computes a standard error with `ddof=1` over a single seed, which is why the `Degrees of freedom <= 0` NumPy warnings appear.

## 5. Per-seed interim results — verbatim

### 5.1 MLP

```csv
dataset,seed,mse,aug_mse,delta_mse,p_wilcoxon,should_proceed,features_perturbed
EnergyEfficiency,985772,0.0013208531242431085,0.0006385091123391672,-51.65934042022624,0.0009765625,True,[8]
```

### 5.2 XGBoost

```csv
dataset,seed,mse,aug_mse,delta_mse,p_wilcoxon,should_proceed,features_perturbed
EnergyEfficiency,985772,0.001265737172655872,0.0009523574719362728,-24.75867087493691,0.0322265625,True,"[8, 4, 3, 1, 0]"
```

The `features_perturbed` column names the feature indices the filter actually chose: index 8 for MLP; indices 8, 4, 3, 1, 0 for XGBoost.

## 6. Configuration used — verbatim `config.json`

### 6.1 MLP

```json
{
  "timestamp": "20261106-130309",
  "experiment_name": "mlp_20261106-130309",
  "dataset_path": "../data/EnergyEfficiency.csv",
  "dataset_dir_path": null,
  "baseline": "mlp",
  "aug_data_size_factor": 1.0,
  "max_n_features_to_perturb": 1,
  "max_perturb_percent": 0.2,
  "min_perturb_percent": -0.2,
  "aug_data_weight": 1.0,
  "alpha": 0.05,
  "r_corr_threshold": 0.1,
  "p_corr_threshold": 0.05,
  "test_size": 0.2,
  "random_seed": 0,
  "num_seeds": 1,
  "p_wilcoxon_threshold": 0.05,
  "hyperparam_tune": false,
  "method_param_tune": false,
  "sample_sizes": null,
  "ignore_filter": false,
  "results_dir": "../demo/EnergyEfficiency",
  "save_plots": true,
  "save_models": true,
  "save_params": true,
  "experiment_dir": "../demo/EnergyEfficiency\\mlp_20261106-130309"
}
```

### 6.2 XGBoost

```json
{
  "timestamp": "20261106-130403",
  "experiment_name": "xgboost_20261106-130403",
  "dataset_path": "../data/EnergyEfficiency.csv",
  "dataset_dir_path": null,
  "baseline": "xgboost",
  "aug_data_size_factor": 1.0,
  "max_n_features_to_perturb": 5,
  "max_perturb_percent": 0.9,
  "min_perturb_percent": -0.9,
  "aug_data_weight": 1.0,
  "alpha": 0.05,
  "r_corr_threshold": 0.1,
  "p_corr_threshold": 0.05,
  "test_size": 0.2,
  "random_seed": 0,
  "num_seeds": 1,
  "p_wilcoxon_threshold": 0.05,
  "hyperparam_tune": false,
  "method_param_tune": false,
  "sample_sizes": null,
  "ignore_filter": false,
  "results_dir": "../demo/EnergyEfficiency",
  "save_plots": true,
  "save_models": true,
  "save_params": true,
  "experiment_dir": "../demo/EnergyEfficiency\\xgboost_20261106-130403"
}
```

## 7. Chosen parameters and fitted model — verbatim `params/*.json`

### 7.1 MLP

```json
{
  "best_aug_params": {
    "max_n_features_to_perturb": 1,
    "aug_data_size_factor": 1.0,
    "aug_data_weight": 1.0,
    "min_perturb_percent": -0.2,
    "max_perturb_percent": 0.2
  },
  "model_params": {
    "activation": "relu",
    "alpha": 0.0001,
    "batch_size": 32,
    "beta_1": 0.9,
    "beta_2": 0.999,
    "early_stopping": true,
    "epsilon": 1e-08,
    "hidden_layer_sizes": [
      64,
      32,
      16
    ],
    "learning_rate": "adaptive",
    "learning_rate_init": 0.001,
    "loss": "squared_error",
    "max_fun": 15000,
    "max_iter": 1000,
    "momentum": 0.9,
    "n_iter_no_change": 20,
    "nesterovs_momentum": true,
    "power_t": 0.5,
    "random_state": 985772,
    "shuffle": true,
    "solver": "adam",
    "tol": 0.0001,
    "validation_fraction": 0.1,
    "verbose": false,
    "warm_start": false
  }
}
```

### 7.2 XGBoost

```json
{
  "best_aug_params": {
    "max_n_features_to_perturb": 5,
    "aug_data_size_factor": 1.0,
    "aug_data_weight": 1.0,
    "min_perturb_percent": -0.9,
    "max_perturb_percent": 0.9
  },
  "model_params": {
    "objective": "reg:squarederror",
    "base_score": null,
    "booster": null,
    "callbacks": null,
    "colsample_bylevel": null,
    "colsample_bynode": null,
    "colsample_bytree": 0.8,
    "device": null,
    "early_stopping_rounds": null,
    "enable_categorical": false,
    "eval_metric": null,
    "feature_types": null,
    "feature_weights": null,
    "gamma": null,
    "grow_policy": null,
    "importance_type": null,
    "interaction_constraints": null,
    "learning_rate": 0.05,
    "max_bin": null,
    "max_cat_threshold": null,
    "max_cat_to_onehot": null,
    "max_delta_step": null,
    "max_depth": 6,
    "max_leaves": null,
    "min_child_weight": 1.0,
    "missing": NaN,
    "monotone_constraints": null,
    "multi_strategy": null,
    "n_estimators": 1000,
    "n_jobs": null,
    "num_parallel_tree": null,
    "random_state": 985772,
    "reg_alpha": 0.0,
    "reg_lambda": 1.0,
    "sampling_method": null,
    "scale_pos_weight": null,
    "subsample": 0.8,
    "tree_method": "hist",
    "validate_parameters": null,
    "verbosity": null
  }
}
```

## 8. Feature screening, as reported by the log

- MLP: `Selected features to perturb: ['F8']`
- XGBoost: `Selected features to perturb: ['F8', 'F4', 'F3', 'F1', 'F0']`
- In both runs a PC-algorithm causal graph was rendered before selection (`causal_graphs/EnergyEfficiency_causal_graph.png`), and a Pearson correlation matrix was written beside it.
- In both runs `Best augmentation parameters` is identical to the config passed in, i.e. the demo uses fixed settings, not a tuned search (`method_param_tune: false`, `hyperparam_tune: false`).

## 9. Timing

| Run | First log line | Last log line | Internal `Total time taken` |
|---|---|---|---|
| MLP | 2026-11-06 13:03:10 | 2026-11-06 13:04:02 | 53.79 s |
| XGBoost | 2026-11-06 13:04:06 | 2026-11-06 13:04:45 | 41.29 s |
| Whole script, repeat run | 13:03:09 | 13:04:45 | about 96 s |
| Whole script, first run | 12:47:45 | 12:50:20 | 159 s |

Both runs are far inside the brief's 15-minute allowance.

## 10. Determinism: the demo is not random

- `Config.random_seed` defaults to `0`. `Experiment.run()` calls `self.seeding(self.config.random_seed)` and only then draws the per-run seed with `np.random.randint(0, 1000000, num_seeds)`.
- Every run therefore derives the same seed, `985772`; both runs logged `Running experiment on dataset: EnergyEfficiency with seed: 985772`.
- A `diff` of the two runs' `results.csv` files reports no difference at all, at full float precision.

For the group's write-up: the demo cannot show seed variance, and a repeat on another machine with the same library versions should be bit-identical. This also explains why the XGBoost number matches Alvi's laptop exactly — that is determinism, not coincidence.

It does **not** explain the gap to the authors' notebook, because their notebook also logged seed `985772`. Their recorded lines, extracted from `demo/demonstration.ipynb`:

```text
2025-05-23 03:36:52 - INFO - Running experiment on dataset: EnergyEfficiency with seed: 985772
2025-05-23 03:36:53 - INFO - Best augmentation parameters:
2025-05-23 03:36:53 - INFO - Selected features to perturb: ['F8']
2025-05-23 03:36:59 - INFO - The p-value from the Wilcoxon signed-rank test is: 0.0009765625
2025-05-23 03:36:59 - INFO - Original MSE: 0.0013208531242431083, Augmented MSE: 0.0006385091123391668
2025-05-23 03:36:59 - INFO - Best augmentation parameters and model parameters saved to ../demo/EnergyEfficiency/mlp_20250523-033652/params/EnergyEfficiency_params_seed_985772.json
2025-05-23 03:36:59 - INFO - Total time taken: 6.26 seconds
2025-05-23 03:36:59 - INFO - Running experiment on dataset: EnergyEfficiency with seed: 985772
2025-05-23 03:37:00 - INFO - Best augmentation parameters:
2025-05-23 03:37:00 - INFO - Selected features to perturb: ['F8', 'F4', 'F3', 'F1', 'F0']
2025-05-23 03:37:05 - INFO - The p-value from the Wilcoxon signed-rank test is: 0.0419921875
2025-05-23 03:37:05 - INFO - Original MSE: 0.001300772579836663, Augmented MSE: 0.0009294087500910523
2025-05-23 03:37:05 - INFO - Best augmentation parameters and model parameters saved to ../demo/EnergyEfficiency/xgboost_20250523-033659/params/EnergyEfficiency_params_seed_985772.json
2025-05-23 03:37:05 - INFO - Total time taken: 5.55 seconds
```

Same seed, same data, different XGBoost value: the difference has to come from the xgboost build or the platform, not from the seed. That is precisely the kind of drift this module is meant to surface.

## 11. Files produced

| File (relative to `~/CRDA`) | Bytes |
|---|---|
| `demo\EnergyEfficiency\mlp_20261106-130309\causal_graphs\EnergyEfficiency_causal_graph.png` | 23,284 |
| `demo\EnergyEfficiency\mlp_20261106-130309\config.json` | 729 |
| `demo\EnergyEfficiency\mlp_20261106-130309\correlation_matrices\EnergyEfficiency_correlation_matrix.png` | 92,859 |
| `demo\EnergyEfficiency\mlp_20261106-130309\interim_results\EnergyEfficiency_interim_results.csv` | 191 |
| `demo\EnergyEfficiency\mlp_20261106-130309\models\baseline_EnergyEfficiency.params` | 512 |
| `demo\EnergyEfficiency\mlp_20261106-130309\models\baseline_EnergyEfficiency.pkl` | 113,894 |
| `demo\EnergyEfficiency\mlp_20261106-130309\params\EnergyEfficiency_params_seed_985772.json` | 693 |
| `demo\EnergyEfficiency\mlp_20261106-130309\results.csv` | 248 |
| `demo\EnergyEfficiency\mlp_20261106-130309\results_mse_percent_delta.png` | 102,000 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\causal_graphs\EnergyEfficiency_causal_graph.png` | 23,284 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\config.json` | 741 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\correlation_matrices\EnergyEfficiency_correlation_matrix.png` | 94,379 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\interim_results\EnergyEfficiency_interim_results.csv` | 204 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\models\baseline_EnergyEfficiency.params` | 921 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\models\baseline_EnergyEfficiency.pkl` | 2,894,716 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\params\EnergyEfficiency_params_seed_985772.json` | 1,102 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\results.csv` | 247 |
| `demo\EnergyEfficiency\xgboost_20261106-130403\results_mse_percent_delta.png` | 100,458 |
| `demo\run1_archive\mlp_20261106-124825\causal_graphs\EnergyEfficiency_causal_graph.png` | 23,284 |
| `demo\run1_archive\mlp_20261106-124825\config.json` | 729 |
| `demo\run1_archive\mlp_20261106-124825\correlation_matrices\EnergyEfficiency_correlation_matrix.png` | 92,859 |
| `demo\run1_archive\mlp_20261106-124825\interim_results\EnergyEfficiency_interim_results.csv` | 191 |
| `demo\run1_archive\mlp_20261106-124825\models\baseline_EnergyEfficiency.params` | 512 |
| `demo\run1_archive\mlp_20261106-124825\models\baseline_EnergyEfficiency.pkl` | 113,894 |
| `demo\run1_archive\mlp_20261106-124825\params\EnergyEfficiency_params_seed_985772.json` | 693 |
| `demo\run1_archive\mlp_20261106-124825\results.csv` | 248 |
| `demo\run1_archive\mlp_20261106-124825\results_mse_percent_delta.png` | 102,000 |
| `demo\run1_archive\xgboost_20261106-124917\causal_graphs\EnergyEfficiency_causal_graph.png` | 23,284 |
| `demo\run1_archive\xgboost_20261106-124917\config.json` | 741 |
| `demo\run1_archive\xgboost_20261106-124917\correlation_matrices\EnergyEfficiency_correlation_matrix.png` | 94,379 |
| `demo\run1_archive\xgboost_20261106-124917\interim_results\EnergyEfficiency_interim_results.csv` | 204 |
| `demo\run1_archive\xgboost_20261106-124917\models\baseline_EnergyEfficiency.params` | 921 |
| `demo\run1_archive\xgboost_20261106-124917\models\baseline_EnergyEfficiency.pkl` | 2,894,716 |
| `demo\run1_archive\xgboost_20261106-124917\params\EnergyEfficiency_params_seed_985772.json` | 1,102 |
| `demo\run1_archive\xgboost_20261106-124917\results.csv` | 247 |
| `demo\run1_archive\xgboost_20261106-124917\results_mse_percent_delta.png` | 100,458 |

The first run's folders are archived under `demo/run1_archive/`; their `results.csv` files are identical to the live ones. They were moved aside because the authors' `Experiment.__init__` refuses to start when a run with the same config is still sitting in the results directory.

## 12. Logs

| File | What it is |
|---|---|
| `demo/demo-run.log` | first successful run (12:47–12:50) |
| `demo/demo-run3.log` | repeat run (13:03–13:04) that produced the live outputs |
| `demo/demo-run2.log` | aborted second attempt, kept verbatim below |

### 12.1 The aborted attempt, verbatim

```text
Python 3.11.18 | Windows-10-10.0.26300-SP0 | Intel64 Family 6 Model 186 Stepping 2, GenuineIntel
torch 2.7.0+cpu | scikit-learn 1.7.0rc1 | xgboost 3.0.1
2026-11-06 12:59:12 - ERROR - Config has already been run in a previous experiment. Exiting.
2026-11-06 12:59:12 - ERROR - Previous experiment results are in: ../demo/EnergyEfficiency\mlp_20261106-124825
2026-11-06 12:59:12 - ERROR - If you want to run this experiment again, please use a different config or delete the previous results.
Traceback (most recent call last):
  File "C:\Users\<samim>\CRDA\demo\run_demo.py", line 41, in <module>
    exp = Experiment(config, Logger())
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\<samim>\CRDA\src\experiment.py", line 52, in __init__
    raise Exception(f"Existing experiment results found at: {os.path.join(self.config.results_dir, duplicate)}")
Exception: Existing experiment results found at: ../demo/EnergyEfficiency\mlp_20261106-124825
```

### 12.2 Full log of the repeat run

```text
Python 3.11.18 | Windows-10-10.0.26300-SP0 | Intel64 Family 6 Model 186 Stepping 2, GenuineIntel
torch 2.7.0+cpu | scikit-learn 1.7.0rc1 | xgboost 3.0.1
2026-11-06 13:03:09 - INFO - Experiment initialized with config:
Experiment Config (Name: mlp_20261106-130309)
  timestamp: 20261106-130309
  dataset_path: ../data/EnergyEfficiency.csv
  dataset_dir_path: None
  baseline: mlp
  aug_data_size_factor: 1.0
  max_n_features_to_perturb: 1
  max_perturb_percent: 0.2
  min_perturb_percent: -0.2
  aug_data_weight: 1.0
  alpha: 0.05
  r_corr_threshold: 0.1
  p_corr_threshold: 0.05
  test_size: 0.2
  random_seed: 0
  num_seeds: 1
  p_wilcoxon_threshold: 0.05
  hyperparam_tune: False
  method_param_tune: False
  sample_sizes: None
  ignore_filter: False
  results_dir: ../demo/EnergyEfficiency
  save_plots: True
  save_models: True
  save_params: True
  experiment_dir: ../demo/EnergyEfficiency\mlp_20261106-130309
2026-11-06 13:03:09 - INFO - Loaded 1 datasets


2026-11-06 13:03:09 - INFO - 






****************************************************************************************************
2026-11-06 13:03:09 - INFO - Running experiment on dataset: EnergyEfficiency
2026-11-06 13:03:09 - INFO - 



####################################################################################################
2026-11-06 13:03:09 - INFO - Running experiment on dataset: EnergyEfficiency with seed: 985772
2026-11-06 13:03:09 - INFO - Training mlp baseline model
2026-11-06 13:03:10 - INFO - Saved baseline model
2026-11-06 13:03:10 - INFO - Done training baseline model
2026-11-06 13:03:10 - INFO - Done calculating residuals

2026-11-06 13:03:10 - INFO - Filtering for features to perturb
2026-11-06 13:03:10 - INFO - Creating causal graph for EnergyEfficiency
2026-11-06 13:03:11 - INFO - Causal graph image saved to ../demo/EnergyEfficiency\mlp_20261106-130309\causal_graphs
2026-11-06 13:03:11 - INFO - Features that are not connected to Z (conditional independence): ['F8', 'F2', 'F0', 'F7', 'F4', 'F3', 'T', 'F6', 'F1', 'F5']
2026-11-06 13:03:11 - INFO - Correlation matrix saved to ../demo/EnergyEfficiency\mlp_20261106-130309\correlation_matrices
2026-11-06 13:03:11 - INFO - [Z vs F0]  r: 0.0813, p: 0.0243
2026-11-06 13:03:11 - INFO - [Z vs F1]  r: -0.0794, p: 0.0279
2026-11-06 13:03:11 - INFO - [Z vs F2]  r: -0.1135, p: 0.0016
2026-11-06 13:03:11 - INFO - [Z vs F3]  r: -0.0226, p: 0.5323
2026-11-06 13:03:11 - INFO - [Z vs F4]  r: 0.0117, p: 0.7463
2026-11-06 13:03:11 - INFO - [Z vs F5]  r: -0.0163, p: 0.6527
2026-11-06 13:03:11 - INFO - [Z vs F6]  r: 0.0137, p: 0.7051
2026-11-06 13:03:11 - INFO - [Z vs F7]  r: -0.0148, p: 0.6824
2026-11-06 13:03:11 - INFO - [Z vs F8]  r: -0.0048, p: 0.8946
2026-11-06 13:03:11 - INFO - Candidates (uncorrelated + not connected to Z): ['F8', 'F7', 'F4', 'F3', 'F6', 'F5']
2026-11-06 13:03:11 - INFO - Ranked candidate features:
  feature     score  r_with_T  r_with_Z
0      F8  0.971075  0.975862 -0.004787
2      F4  0.884092  0.895785  0.011694
3      F3  0.839979 -0.862547 -0.022567
4      F6  0.193828  0.207505  0.013677
1      F7  0.035737  0.050525 -0.014788
5      F5 -0.001975  0.014290 -0.016265
2026-11-06 13:03:11 - INFO - Done filtering.

2026-11-06 13:03:11 - INFO - Best augmentation parameters:
{'max_n_features_to_perturb': 1, 'aug_data_size_factor': 1.0, 'aug_data_weight': 1.0, 'min_perturb_percent': -0.2, 'max_perturb_percent': 0.2}

2026-11-06 13:03:11 - INFO - Selected features to perturb: ['F8']

2026-11-06 13:03:11 - INFO - Intervening on features to create augmented feature set
2026-11-06 13:03:11 - INFO - Generating counterfactuals for augmented target set
2026-11-06 13:03:11 - INFO - Original X train shape: (614, 9)
2026-11-06 13:03:11 - INFO - Augmented X train shape: (614, 9)
2026-11-06 13:03:11 - INFO - Combined X train shape: (1228, 9)
2026-11-06 13:04:02 - INFO - Done cross-validation evaluation
2026-11-06 13:04:02 - INFO - The p-value from the Wilcoxon signed-rank test is: 0.0009765625

2026-11-06 13:04:02 - INFO - Evaluation metrics for the experiment:
2026-11-06 13:04:02 - INFO - Original MSE: 0.0013208531242431085, Augmented MSE: 0.0006385091123391672


2026-11-06 13:04:02 - INFO - Best augmentation parameters and model parameters saved to ../demo/EnergyEfficiency\mlp_20261106-130309\params\EnergyEfficiency_params_seed_985772.json
2026-11-06 13:04:02 - INFO - ####################################################################################################
2026-11-06 13:04:02 - INFO - Interim results for seeds saved to ../demo/EnergyEfficiency\mlp_20261106-130309\interim_results\EnergyEfficiency_interim_results.csv. Aggregating results for EnergyEfficiency...
C:\Users\<samim>\CRDA\.venv\Lib\site-packages\numpy\lib\_nanfunctions_impl.py:2019: RuntimeWarning: Degrees of freedom <= 0 for slice.
  var = nanvar(a, axis=axis, dtype=dtype, out=out, ddof=ddof,
C:\Users\<samim>\CRDA\.venv\Lib\site-packages\numpy\_core\fromnumeric.py:4268: RuntimeWarning: Degrees of freedom <= 0 for slice
  return _methods._var(a, axis=axis, dtype=dtype, out=out, ddof=ddof,
C:\Users\<samim>\CRDA\.venv\Lib\site-packages\numpy\_core\_methods.py:215: RuntimeWarning: invalid value encountered in scalar divide
  ret = ret.dtype.type(ret / rcount)
2026-11-06 13:04:02 - INFO - ****************************************************************************************************
2026-11-06 13:04:02 - INFO - Total time taken: 53.79 seconds
2026-11-06 13:04:02 - INFO - All results saved to ../demo/EnergyEfficiency\mlp_20261106-130309\results.csv
2026-11-06 13:04:03 - INFO - Results plot saved to ../demo/EnergyEfficiency\mlp_20261106-130309\results_mse_percent_delta.png
2026-11-06 13:04:03 - INFO - Experiment initialized with config:
Experiment Config (Name: xgboost_20261106-130403)
  timestamp: 20261106-130403
  dataset_path: ../data/EnergyEfficiency.csv
  dataset_dir_path: None
  baseline: xgboost
  aug_data_size_factor: 1.0
  max_n_features_to_perturb: 5
  max_perturb_percent: 0.9
  min_perturb_percent: -0.9
  aug_data_weight: 1.0
  alpha: 0.05
  r_corr_threshold: 0.1
  p_corr_threshold: 0.05
  test_size: 0.2
  random_seed: 0
  num_seeds: 1
  p_wilcoxon_threshold: 0.05
  hyperparam_tune: False
  method_param_tune: False
  sample_sizes: None
  ignore_filter: False
  results_dir: ../demo/EnergyEfficiency
  save_plots: True
  save_models: True
  save_params: True
  experiment_dir: ../demo/EnergyEfficiency\xgboost_20261106-130403
2026-11-06 13:04:03 - INFO - Loaded 1 datasets


2026-11-06 13:04:03 - INFO - 






****************************************************************************************************
2026-11-06 13:04:03 - INFO - Running experiment on dataset: EnergyEfficiency
2026-11-06 13:04:03 - INFO - 



####################################################################################################
2026-11-06 13:04:03 - INFO - Running experiment on dataset: EnergyEfficiency with seed: 985772
2026-11-06 13:04:03 - INFO - Training xgboost baseline model
2026-11-06 13:04:06 - INFO - Saved baseline model
2026-11-06 13:04:06 - INFO - Done training baseline model
2026-11-06 13:04:06 - INFO - Done calculating residuals

2026-11-06 13:04:06 - INFO - Filtering for features to perturb
2026-11-06 13:04:06 - INFO - Creating causal graph for EnergyEfficiency
2026-11-06 13:04:07 - INFO - Causal graph image saved to ../demo/EnergyEfficiency\xgboost_20261106-130403\causal_graphs
2026-11-06 13:04:07 - INFO - Features that are not connected to Z (conditional independence): ['F8', 'F2', 'F0', 'F7', 'F4', 'F3', 'T', 'F6', 'F1', 'F5']
2026-11-06 13:04:08 - INFO - Correlation matrix saved to ../demo/EnergyEfficiency\xgboost_20261106-130403\correlation_matrices
2026-11-06 13:04:08 - INFO - [Z vs F0]  r: -0.0271, p: 0.4527
2026-11-06 13:04:08 - INFO - [Z vs F1]  r: 0.0245, p: 0.4982
2026-11-06 13:04:08 - INFO - [Z vs F2]  r: -0.0160, p: 0.6578
2026-11-06 13:04:08 - INFO - [Z vs F3]  r: 0.0316, p: 0.3818
2026-11-06 13:04:08 - INFO - [Z vs F4]  r: -0.0221, p: 0.5409
2026-11-06 13:04:08 - INFO - [Z vs F5]  r: 0.0365, p: 0.3129
2026-11-06 13:04:08 - INFO - [Z vs F6]  r: -0.0376, p: 0.2986
2026-11-06 13:04:08 - INFO - [Z vs F7]  r: -0.0534, p: 0.1394
2026-11-06 13:04:08 - INFO - [Z vs F8]  r: -0.0626, p: 0.0828
2026-11-06 13:04:08 - INFO - Candidates (uncorrelated + not connected to Z): ['F8', 'F2', 'F0', 'F7', 'F4', 'F3', 'F6', 'F1', 'F5']
2026-11-06 13:04:08 - INFO - Ranked candidate features:
  feature     score  r_with_T  r_with_Z
0      F8  0.913236  0.975862 -0.062626
4      F4  0.873688  0.895785 -0.022097
5      F3  0.830944 -0.862547  0.031603
7      F1  0.648520 -0.672999  0.024479
2      F0  0.607206  0.634339 -0.027133
1      F2  0.411106  0.427117 -0.016011
6      F6  0.169946  0.207505 -0.037559
3      F7 -0.002860  0.050525 -0.053385
8      F5 -0.022175  0.014290  0.036464
2026-11-06 13:04:08 - INFO - Done filtering.

2026-11-06 13:04:08 - INFO - Best augmentation parameters:
{'max_n_features_to_perturb': 5, 'aug_data_size_factor': 1.0, 'aug_data_weight': 1.0, 'min_perturb_percent': -0.9, 'max_perturb_percent': 0.9}

2026-11-06 13:04:08 - INFO - Selected features to perturb: ['F8', 'F4', 'F3', 'F1', 'F0']

2026-11-06 13:04:08 - INFO - Intervening on features to create augmented feature set
2026-11-06 13:04:08 - INFO - Generating counterfactuals for augmented target set
2026-11-06 13:04:08 - INFO - Original X train shape: (614, 9)
2026-11-06 13:04:08 - INFO - Augmented X train shape: (614, 9)
2026-11-06 13:04:08 - INFO - Combined X train shape: (1228, 9)
2026-11-06 13:04:44 - INFO - Done cross-validation evaluation
2026-11-06 13:04:44 - INFO - The p-value from the Wilcoxon signed-rank test is: 0.0322265625

2026-11-06 13:04:45 - INFO - Evaluation metrics for the experiment:
2026-11-06 13:04:45 - INFO - Original MSE: 0.001265737172655872, Augmented MSE: 0.0009523574719362728


2026-11-06 13:04:45 - INFO - Best augmentation parameters and model parameters saved to ../demo/EnergyEfficiency\xgboost_20261106-130403\params\EnergyEfficiency_params_seed_985772.json
2026-11-06 13:04:45 - INFO - ####################################################################################################
2026-11-06 13:04:45 - INFO - Interim results for seeds saved to ../demo/EnergyEfficiency\xgboost_20261106-130403\interim_results\EnergyEfficiency_interim_results.csv. Aggregating results for EnergyEfficiency...
C:\Users\<samim>\CRDA\.venv\Lib\site-packages\numpy\lib\_nanfunctions_impl.py:2019: RuntimeWarning: Degrees of freedom <= 0 for slice.
  var = nanvar(a, axis=axis, dtype=dtype, out=out, ddof=ddof,
C:\Users\<samim>\CRDA\.venv\Lib\site-packages\numpy\_core\fromnumeric.py:4268: RuntimeWarning: Degrees of freedom <= 0 for slice
  return _methods._var(a, axis=axis, dtype=dtype, out=out, ddof=ddof,
C:\Users\<samim>\CRDA\.venv\Lib\site-packages\numpy\_core\_methods.py:215: RuntimeWarning: invalid value encountered in scalar divide
  ret = ret.dtype.type(ret / rcount)
2026-11-06 13:04:45 - INFO - ****************************************************************************************************
2026-11-06 13:04:45 - INFO - Total time taken: 41.29 seconds
2026-11-06 13:04:45 - INFO - All results saved to ../demo/EnergyEfficiency\xgboost_20261106-130403\results.csv
2026-11-06 13:04:46 - INFO - Results plot saved to ../demo/EnergyEfficiency\xgboost_20261106-130403\results_mse_percent_delta.png

===== SUMMARY (compare with the notebook's recorded text) =====
mlp      MSE 0.00132 -> 0.00064 | change -51.7% | Wilcoxon p = 0.00098 | gate passed: True
xgboost  MSE 0.00127 -> 0.00095 | change -24.8% | Wilcoxon p = 0.03223 | gate passed: True
Authors' recorded demo: mlp 0.00132 -> 0.00064 (-51.7%, p=0.00098) | xgboost 0.00130 -> 0.00093 (-28.6%, p=0.042)
```

## 13. Reproducing from scratch

```bash
cd ~
git -c core.longpaths=true clone --depth 1 https://github.com/mhmohebbi/CRDA.git
cd CRDA
uv venv --python 3.11 .venv
uv pip install --python .venv/Scripts/python.exe -r requirements.txt
# add demo/run_demo.py exactly as in the brief, then:
cd demo
PATH="$HOME/tools/gv/Graphviz-12.2.1-win64/bin:$PATH" ../.venv/Scripts/python.exe run_demo.py
```

## 14. Caveats

1. **One dataset, one seed.** Energy Efficiency only, and that seed is fixed at 985772 by the code. Nothing here speaks to the paper's Table 1 averages (-22.9 % MLP, -6.4 % XGBoost).
2. **Determinism caps the diagnostic value.** A repeat proves the environment is stable; it cannot estimate variance.
3. **The XGBoost gap to the authors is unexplained.** Same seed, different value; most likely their xgboost build. Not investigated here.
4. **Two tools were installed outside the repo:** `uv` via `pip install --user` (0.13.7) and portable Graphviz 12.2.1 in `~/tools/gv/`. Graphviz is required, not optional — `src/filter.py:54` calls `graphviz.Digraph.render`.
5. **One install attempt failed** on a DNS error fetching `catboost==1.2.8`; the identical command succeeded on retry. Network fault, not environment fault.
6. The authors' repo was not modified except by adding `demo/run_demo.py` and the demo's own output files. No commits, no pushes.
