# Results: our runs of the paper's Table 1 settings

Each folder is one machine. Files are copied unedited from the authors' code (`results.csv`, `interim_results/`, `params/`, `config.json`) plus the run logs.

## alvi-windows-ryzen7 / EnergyEfficiency_n765_15seeds

- **Run:** 13 Nov 2026, 10:57–11:25, Alvi's laptop (Windows 11, AMD Ryzen 7 5800H), CPU only.
- **Code:** https://github.com/mhmohebbi/CRDA at `811e82ef29f34488384bffaa2fccf7775810345e`, unmodified. Added only `scripts/run_table1.py` (here).
- **Environment:** Python 3.11.15, torch 2.7.0+cpu, scikit-learn 1.7.0rc1, xgboost 3.0.1, numpy 2.2.6.
- **Settings** (copied from the authors' saved `experiments/EnergyEfficiency/*/config.json`): 15 seeds, `sample_sizes=[765]` (the paper's largest subset), `hyperparam_tune=True`, `ignore_filter=True`, `random_seed=0`. Because `hyperparam_tune=True`, the code also tunes the CRDA settings for every seed (Optuna, up to 30 trials): 1–5 features perturbed, augmentation size 0.5–1.5, augmented-data weight 0.25–1.0, perturbation range from ±10 % to ±100 %. The chosen values are saved in each run's `params/` folder, so the config defaults (5 features, ±10 %, weight 0.9) are **not** what was used. *(Corrected 27 Nov 2026.)*
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

## The “10 models” test (three runs)

- **Question:** in the authors' code the plain score is the test error of **one** model, but the CRDA score is the test error of the **average of 10** cross-validation models. How much of CRDA's gain is just averaging?
- **Test:** for the same seeds, splits and tuned settings as each laptop's Table 1 run, also train the 10 cross-validation models on the *original* data (no CRDA) and score their average on the same test data (`results/scripts/run_plain_ensemble.py`). The CRDA numbers come from that laptop's finished run.
- **Check:** in all three runs the re-computed single plain error equals the one in the Table 1 run on all 15 seeds, for both models.
- **Runs (16 Nov 2026):** `alvi-windows-ryzen7/EnergyEfficiency_n765_plain_10model/` (Windows, Energy Efficiency), `anik-mac-m2/EnergyEfficiency_n765_plain_10model/` (Mac, Energy Efficiency, the repeat), `samim-windows-i7-13620h/ConcreteCompressiveStrength_n1005_plain_10model/` (Windows, Concrete Strength).

Mean over 15 seeds of the per-seed % change in test error. “On top” = CRDA vs the plain 10-model average (like for like).

| Run | Model | Plain 10-model average vs one plain model | CRDA vs one plain model (the paper's way) | CRDA on top of averaging | Seeds where CRDA beats the average | Paired Wilcoxon p, CRDA vs average |
|---|---|---|---|---|---|---|
| Alvi, Energy Efficiency | MLP | +0.1 % | −28.7 % | −28.2 % | 14 of 15 | 0.00012 |
| Alvi, Energy Efficiency | XGBoost | −15.3 % | −21.7 % | −7.9 % | 12 of 15 | 0.0067 |
| Anik (Mac), Energy Efficiency | MLP | +0.1 % | −32.2 % | −29.7 % | 14 of 15 | 0.0001 |
| Anik (Mac), Energy Efficiency | XGBoost | −12.9 % | −18.2 % | −6.1 % | 10 of 15 | 0.064 |
| Samim, Concrete Strength | MLP | −16.7 % | −24.2 % | −8.7 % | 14 of 15 | 0.0015 |
| Samim, Concrete Strength | XGBoost | −14.4 % | −14.6 % | 0.0 % | 8 of 15 | 0.93 |

Reading: much of CRDA's reported gain is averaging. For XGBoost it is most of the gain on Energy Efficiency (about 70 %) and all of it on Concrete Strength. For the neural network it is none on Energy Efficiency and about two thirds on Concrete Strength. CRDA's extra gain on top of averaging is clear for the neural network on both datasets, borderline for XGBoost on Energy Efficiency (clear on Alvi's laptop, not on the Mac), and absent for XGBoost on Concrete Strength.
