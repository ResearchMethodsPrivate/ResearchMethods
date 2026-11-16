# Comparison table: our runs vs the paper's Table 1

Largest training subset per dataset (the Table 1 setting), 15 seeds, `ignore_filter: true`.

| Dataset (rows) | Model | Source | Plain MSE | CRDA MSE | Change | Wilcoxon p (mean) | Seeds improved | Gate passed |
|---|---|---|---|---|---|---|---|---|
| Energy Efficiency (765) | MLP | Paper (Table 1) | 0.000527 | 0.000348 | −28.3 % | 0.0130 | 13 of 15 | 12 of 15 |
| Energy Efficiency (765) | MLP | Alvi (Windows) | 0.000527 | 0.000335 | −28.7 % | 0.0160 | 13 of 15 | 12 of 15 |
| Energy Efficiency (765) | MLP | Anik (Mac M2) | 0.000527 | 0.000321 | −32.2 % | 0.0049 | 14 of 15 | 13 of 15 |
| Energy Efficiency (765) | XGBoost | Paper (Table 1) | 0.000968 | 0.000761 | −21.0 % | 0.0420 | 13 of 15 | 11 of 15 |
| Energy Efficiency (765) | XGBoost | Alvi (Windows) | 0.001003 | 0.000783 | −21.7 % | 0.0410 | 13 of 15 | 11 of 15 |
| Energy Efficiency (765) | XGBoost | Anik (Mac M2) | 0.000968 | 0.000779 | −18.2 % | 0.0245 | 12 of 15 | 12 of 15 |
| Concrete Strength (1005) | MLP | Paper (Table 1) | 0.004224 | 0.003064 | −26.9 % | 0.0010 | 15 of 15 | 15 of 15 |
| Concrete Strength (1005) | MLP | Samim (Windows i7) | 0.004224 | 0.003180 | −24.2 % | 0.0018 | 15 of 15 | 15 of 15 |
| Concrete Strength (1005) | XGBoost | Paper (Table 1) | 0.002898 | 0.002559 | −12.2 % | 0.0100 | 15 of 15 | 14 of 15 |
| Concrete Strength (1005) | XGBoost | Samim (Windows i7) | 0.002958 | 0.002533 | −14.6 % | 0.0085 | 15 of 15 | 14 of 15 |

Plain models reproduce: plain MLP matches the paper on every machine and both datasets, and plain XGBoost matches it exactly on Anik's Mac (0.000968), but not on either Windows laptop, on both datasets (Energy Efficiency +3.6 %, Concrete Strength +2.1 %). CRDA lowers the error on every machine and both datasets, but the size of the gain differs from the paper's by under 1 point on Alvi's laptop and by about 2–4 points on Anik's and Samim's, in both directions. The paper's Table 1 runs use `ignore_filter: true`, so its averages include seeds the safety filter would reject: with the filter on, the code drops 2 of 15 MLP seeds and 4 of 15 XGBoost seeds on Energy Efficiency (table below).

## Filter on vs off (Energy Efficiency, 765 rows)

The code-question test: the same runs with the safety filter left on (`--no-ignore-filter`).

| Model | Run | Seeds kept | Plain MSE | CRDA MSE | Change (mean of kept seeds) | Seeds improved |
|---|---|---|---|---|---|---|
| MLP | Samim, filter ON | 13 of 15 | 0.000536 | 0.000331 | −31.6 % | 11 of 13 |
| XGBoost | Samim, filter ON | 11 of 15 | 0.001005 | 0.000801 | −19.8 % | 9 of 11 |
| MLP | Alvi, filter OFF | 15 of 15 | 0.000527 | 0.000335 | −28.7 % | 13 of 15 |
| XGBoost | Alvi, filter OFF | 15 of 15 | 0.001003 | 0.000783 | −21.7 % | 13 of 15 |

With the filter on, the code drops 2 MLP seeds (117952, 359783) and 4 XGBoost seeds (117952, 963395, 359783, 735831) and still exits normally, so the filter-on means are over the surviving seeds only and are not comparable like-for-like with the 15-seed rows. The plain MLP error differs (0.000536 vs 0.000527) only because of that: on the 13 seeds both runs share, Samim's plain MLP error is identical to Alvi's on every seed.

## How to read the columns

- **Change** is the `delta_mse` mean: the average of the per-seed % changes. It is not the change between the two mean MSEs in the same row (for Alvi's MLP that would be −36.4 %).
- **Wilcoxon p (mean)** is the `p_wilcoxon` mean over seeds. Each seed's p compares its 10 cross-validation folds. The paired test across seeds is in [stats_check.md](stats_check.md).
- **Seeds improved** counts seeds with `delta_mse` < 0; **Gate passed** counts seeds with `should_proceed = True`. Both are counted from `interim_results/*.csv`, for the paper rows too.
- The `std` columns in the `results.csv` files are not comparable between our runs and the authors' saved files, so compare means only.

## Sources

- **Paper:** the authors' saved files in https://github.com/mhmohebbi/CRDA at `811e82ef29f34488384bffaa2fccf7775810345e`: `experiments/EnergyEfficiency/{mlp_20250520-084830,xgboost_20250520-143858}/` and `experiments/ConcreteCompressiveStrength/{mlp_20250520-054246,xgboost_20250520-125754}/`, rows `_sample_765` and `_sample_1005`.
- **Alvi:** `results/alvi-windows-ryzen7/EnergyEfficiency_n765_15seeds/{mlp_20261113-105745,xgboost_20261113-111427}/`.
- **Anik:** `results/anik-mac-m2/EnergyEfficiency_n765_15seeds/{mlp_20261113-115338,xgboost_20261113-120037}/`.
- **Samim:** `results/samim-windows-i7-13620h/ConcreteCompressiveStrength_n1005_15seeds/{mlp_20261116-150718,xgboost_20261116-152955}/` and `EnergyEfficiency_n765_15seeds_with_filter/{mlp_20261116-154300,xgboost_20261116-155905}/`; dropped seeds from the `ERROR - No results were possible ...` lines in `table1-ee-filter-*.log`.
- Every value above was recomputed from the `results.csv` and `interim_results/*.csv` files on 16 Nov 2026.
