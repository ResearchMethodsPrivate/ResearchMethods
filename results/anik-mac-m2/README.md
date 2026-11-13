# anik-mac-m2 / EnergyEfficiency_n765_15seeds

Anik's independent repeat of Alvi's Energy Efficiency runs at the paper's Table 1 settings. Files are copied unedited from the authors' code (`mlp_*/`, `xgboost_*/`) plus the run logs and a timing file.

- **Run:** 13 Nov 2026, 11:53–12:06 GMT, CPU only.
- **Machine:** Mac with Apple M2 (8 cores), 8 GB RAM, macOS 14.6.1 (arm64).
- **Code:** https://github.com/mhmohebbi/CRDA at `811e82ef29f34488384bffaa2fccf7775810345e`, unmodified. Added only `demo/run_table1.py`, copied from `results/scripts/run_table1.py`.
- **Environment:** Python 3.11.5 (python.org build), torch 2.7.0, scikit-learn 1.7.0rc1, xgboost 3.0.1, numpy 2.2.6, Graphviz `dot` 14.1.2.
- **Settings:** same as Alvi's (15 seeds, `sample_sizes=[765]`, `hyperparam_tune=True`, `ignore_filter=True`, ±10 %, weight 0.9, `random_seed=0`).
- **Commands** (from `demo/`): `python run_table1.py mlp 15 EnergyEfficiency 765` and `python run_table1.py xgboost 15 EnergyEfficiency 765`.
- **Run time:** MLP 403.86 s, XGBoost 364.89 s (`Total time taken` in the logs).

## Results

Means over 15 seeds; "paper" is the authors' saved `experiments/EnergyEfficiency/*/` results for 765 rows.

| Model | Run | Plain MSE | Augmented MSE | Change (mean of seeds) | Change (median) | Seeds improved | Gate passed | Paired Wilcoxon p (mse vs aug_mse) |
|---|---|---|---|---|---|---|---|---|
| MLP | Anik (Mac M2) | 0.000527375 | 0.000321129 | −32.2 % | −34.3 % | 14 of 15 | 13 of 15 | 0.00012 |
| MLP | Alvi (Windows) | 0.000527375 | 0.000335347 | −28.7 % | −36.1 % | 13 of 15 | 12 of 15 | 0.00085 |
| MLP | Paper | 0.000527375 | 0.000347968 | −28.3 % | −32.5 % | 13 of 15 | 12 of 15 | 0.00043 |
| XGBoost | Anik (Mac M2) | 0.000967501 | 0.000778616 | −18.2 % | −18.5 % | 12 of 15 | 12 of 15 | 0.00262 |
| XGBoost | Alvi (Windows) | 0.001002546 | 0.000782705 | −21.7 % | −23.3 % | 13 of 15 | 11 of 15 | 0.00061 |
| XGBoost | Paper | 0.000967501 | 0.000761286 | −21.0 % | −21.6 % | 13 of 15 | 11 of 15 | 0.00061 |

Numbers come from `results.csv` (means) and `interim_results/*_765_*.csv` (per-seed values; improved / gate / median / paired Wilcoxon computed from those).

## Reading

- **Plain MSE:** MLP is identical to Alvi's and the paper's. XGBoost matches the **paper** exactly (0.000967501) and not Alvi's Windows value (0.001003), as the instructions anticipated for a Mac.
- **Change with CRDA:** same direction as Alvi and the paper for both models, but not identical. MLP −32.2 % (Alvi −28.7 %, paper −28.3 %); XGBoost −18.2 % (Alvi −21.7 %, paper −21.0 %).
- **Spread:** per-seed changes vary a lot (standard error of the mean change: 4.6 points for MLP, 4.7 for XGBoost here), so differences of about 3–4 points between machines are within roughly one standard error. Cause of the differences not investigated.
- **Verdict:** close, not identical. Plain-model errors reproduce; the augmented-model errors differ by 3–4 percentage points of change from both Alvi and the paper, in opposite directions for the two models.
- The `std` columns in `results.csv` are standard errors over seeds (see `results/README.md`); compare means.
