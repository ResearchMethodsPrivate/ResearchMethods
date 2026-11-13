# Results: our runs of the paper's Table 1 settings

Each folder is one machine. Files are copied unedited from the authors' code (`results.csv`, `interim_results/`, `params/`, `config.json`) plus the run logs.

## alvi-windows-ryzen7 / EnergyEfficiency_n765_15seeds

- **Run:** 13 Nov 2026, 10:57–11:25, Alvi's laptop (Windows 11, AMD Ryzen 7 5800H), CPU only.
- **Code:** https://github.com/mhmohebbi/CRDA at `811e82ef29f34488384bffaa2fccf7775810345e`, unmodified. Added only `scripts/run_table1.py` (here).
- **Environment:** Python 3.11.15, torch 2.7.0+cpu, scikit-learn 1.7.0rc1, xgboost 3.0.1, numpy 2.2.6.
- **Settings** (copied from the authors' saved `experiments/EnergyEfficiency/*/config.json`): 15 seeds, `sample_sizes=[765]` (the paper's largest subset), `hyperparam_tune=True`, `ignore_filter=True`, up to 5 features perturbed, ±10%, augmented-data weight 0.9, `random_seed=0`.
- **Command:** from `demo/`: `python run_table1.py <mlp|xgboost> 15 EnergyEfficiency 765`
- **Run time:** MLP 984 s, XGBoost 646 s.

| Model | Plain MSE (ours) | Plain MSE (paper) | Change with CRDA (ours) | Change (paper) | Wilcoxon p, mean (ours / paper) | Seeds improved | Seeds where the safety gate passed |
|---|---|---|---|---|---|---|---|
| MLP | 0.000527375 | 0.000527375 | −28.7 % | −28.3 % | 0.0160 / 0.0130 | 13 of 15 | 12 of 15 |
| XGBoost | 0.001003 | 0.000968 | −21.7 % | −21.0 % | 0.0410 / 0.0420 | 13 of 15 | 11 of 15 |

Paper numbers: authors' saved `results.csv` for Energy Efficiency, 765 rows (the Table 1 setting). Caveats:

- The plain MLP error is identical to the paper's; the plain XGBoost error is 3.6 % higher. That matches the Windows XGBoost difference we already saw in the demo on both Windows laptops.
- The `std` columns are not comparable: our code's `std` is a standard error over seeds, and the authors' saved values are larger. Compare the means.
- This is one machine and one dataset subset. It is not an independent check until Anik repeats it.
- `ours/_timing_1seed` runs (1 seed, used only to time the script) are not included.
