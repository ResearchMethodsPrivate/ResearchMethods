# samim-windows-i7-13620h

Samim's Week 9 runs: Concrete Strength at the paper's Table 1 settings, then the filter test on Energy Efficiency with the safety filter left **on**. Files are copied unedited from the authors' code (`mlp_*/`, `xgboost_*/`, `results.csv`, `interim_results/`, `params/`, `config.json`) plus the run logs, `stats.txt` and `run_all_samim.summary`.

- **Run:** 16 Nov 2026, 15:06–16:09 UTC, CPU only.
- **Machine:** Windows 11 Home (build 26300), Intel Core i7-13620H, 16 GB RAM, Intel UHD graphics (not used).
- **Code:** https://github.com/mhmohebbi/CRDA at `811e82ef29f34488384bffaa2fccf7775810345e`, unmodified. Added only `demo/run_table1.py`, copied from `results/scripts/run_table1.py`.
- **Environment:** Python 3.11.18 (uv), torch 2.7.0+cpu, scikit-learn 1.7.0rc1, xgboost 3.0.1, numpy 2.2.6, Graphviz `dot` 12.2.1.
- **Settings:** 15 seeds, `sample_sizes=[1005]` (Concrete) and `[765]` (Energy Efficiency, the paper's largest subset), `hyperparam_tune=True`, `random_seed=0`. The code tunes the CRDA settings (features, augmentation size, weight, perturbation range) for every seed; see [`../README.md`](../README.md) and `params/` *(corrected 27 Nov 2026)*. The first two runs use the Table 1 setting `ignore_filter=True`; the last two add `--no-ignore-filter`, leaving the filter **on**.
- **Commands** (from `demo/`):
  - `python run_table1.py mlp 15 ConcreteCompressiveStrength 1005`
  - `python run_table1.py xgboost 15 ConcreteCompressiveStrength 1005`
  - `python run_table1.py mlp 15 EnergyEfficiency 765 --no-ignore-filter`
  - `python run_table1.py xgboost 15 EnergyEfficiency 765 --no-ignore-filter`
- **Run time** (`Total time taken`): Concrete MLP 1347.36 s, Concrete XGBoost 771.70 s, EE-with-filter MLP 955.43 s, EE-with-filter XGBoost 604.89 s.

## Results — Concrete Strength, 1005 rows (paper's largest subset)

Means over 15 seeds; per-seed values from `interim_results/*_1005_*.csv`.

| Model | Run | Plain MSE | Augmented MSE | Change (mean of seeds) | Change (median) | Seeds improved | Gate passed | Paired Wilcoxon p (mse vs aug_mse) |
|---|---|---|---|---|---|---|---|---|
| MLP | Samim (Windows i7) | 0.004223894 | 0.003179708 | −24.2 % | −21.9 % | 15 of 15 | 15 of 15 | 0.000061 |
| XGBoost | Samim (Windows i7) | 0.002958475 | 0.002532706 | −14.6 % | −14.5 % | 15 of 15 | 14 of 15 | 0.000061 |
| MLP | Paper | — | — | −26.9 % | — | — | — | — |
| XGBoost | Paper | — | — | −12.2 % | — | — | — | — |

## Results — Energy Efficiency, 765 rows, filter ON (the code-question test)

**These are not 15-seed means.** With the filter on, the authors' code discards a seed when the filter or the safety gate rejects it (`continue` in `src/experiment.py`), and `results.csv` aggregates only the survivors: 13 seeds for MLP, 11 for XGBoost. The pipeline reported exit 0 in both cases; the discards are visible only as `ERROR - No results were possible ...` lines in the logs.

| Model | Run | Seeds kept | Plain MSE | Augmented MSE | Change (mean of kept seeds) | Change (median) | Seeds improved | Gate passed | Paired Wilcoxon p |
|---|---|---|---|---|---|---|---|---|---|
| MLP | Samim, filter ON | 13 of 15 | 0.000536363 | 0.000331461 | −31.6 % | −36.1 % | 11 of 13 | 13 of 13 | 0.00122 |
| XGBoost | Samim, filter ON | 11 of 15 | 0.001005485 | 0.000800703 | −19.8 % | −22.1 % | 9 of 11 | 11 of 11 | 0.00977 |
| MLP | Alvi, filter OFF (`ignore_filter=True`) | 15 of 15 | 0.000527375 | 0.000335347 | −28.7 % | −36.1 % | 13 of 15 | 12 of 15 | 0.00085 |
| XGBoost | Alvi, filter OFF (`ignore_filter=True`) | 15 of 15 | 0.001002546 | 0.000782705 | −21.7 % | −23.3 % | 13 of 15 | 11 of 15 | 0.00061 |
| MLP | Paper | 15 | 0.000527375 | 0.000347968 | −28.3 % | −32.5 % | 13 of 15 | 12 of 15 | 0.00043 |
| XGBoost | Paper | 15 | 0.000967501 | 0.000761286 | −21.0 % | −21.6 % | 13 of 15 | 11 of 15 | 0.00061 |

Alvi's and the paper's rows are repeated from `results/alvi-windows-ryzen7/README.md` for comparison; they were not re-run here.

## Seeds the code discarded

Both filter-on runs started 15 seeds and logged `ERROR - No results were possible for EnergyEfficiency_sample_765 on seed <n>`; the run then continued to the next seed and still finished with `All results saved to ...`.

- **MLP, 2 seeds discarded (117952, 359783):** the filter found nothing to perturb — `WARNING - No features are uncorrelated with Z.` then `WARNING - No candidate features found for EnergyEfficiency_sample_765.`
- **XGBoost, 4 seeds discarded (117952, 963395, 359783, 735831):** the safety gate refused the augmentation — `WARNING - No significant improvement in MSE after augmentation for EnergyEfficiency_sample_765.`

## Reading

- **Concrete Strength:** both models improve and all 15 seeds improve, in the same direction as the paper. The size differs by about 2–3 points: MLP −24.2 % vs −26.9 % paper, XGBoost −14.6 % vs −12.2 % paper (ours *larger* for XGBoost, *smaller* for MLP).
- **Filter on vs off:** the filter is not a no-op. It changes the plain-model baselines and the surviving seed set, and it cost 2 MLP seeds and 4 XGBoost seeds entirely — 13 % and 27 % of the intended trials. Any "15 seeds" claim for a filter-on run is false; the means are over survivors.
- **Windows XGBoost:** the plain EE error is 0.001005 vs the paper's 0.000968 (+3.8 %), the same direction and rough size as the demo discrepancy on both Windows laptops. The plain MLP baseline here is 0.000536 rather than 0.000527, but it is computed over 13 surviving seeds, not the same 15.
- **Per-seed spread is wide:** medians sit well below means for MLP (−36.1 % median vs −31.6 % mean), so a handful of weak seeds pull the mean up. Differences of a few points between machines are within about one standard error (5.8 points for MLP here, 6.0 for XGBoost).
- **Verdict:** Concrete — same direction, close, not identical. Filter test — the filter blocks a substantial fraction of seeds and shifts the estimates; it is a real part of the method, not a formality.
- The `std` column in `results.csv` is a standard error over seeds (see `results/README.md`); compare means.
