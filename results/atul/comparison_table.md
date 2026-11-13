# Comparison table: our runs vs the paper's Table 1

Largest training subset per dataset (the Table 1 setting), 15 seeds, `ignore_filter: true`.

| Dataset (rows) | Model | Source | Plain MSE | CRDA MSE | Change | Wilcoxon p (mean) | Seeds improved | Gate passed |
|---|---|---|---|---|---|---|---|---|
| Energy Efficiency (765) | MLP | Paper (Table 1) | 0.000527 | 0.000348 | −28.3 % | 0.0130 | 13 of 15 | 12 of 15 |
| Energy Efficiency (765) | MLP | Alvi (Windows) | 0.000527 | 0.000335 | −28.7 % | 0.0160 | 13 of 15 | 12 of 15 |
| Energy Efficiency (765) | MLP | Anik (Mac) | pending | | | | | |
| Energy Efficiency (765) | XGBoost | Paper (Table 1) | 0.000968 | 0.000761 | −21.0 % | 0.0420 | 13 of 15 | 11 of 15 |
| Energy Efficiency (765) | XGBoost | Alvi (Windows) | 0.001003 | 0.000783 | −21.7 % | 0.0410 | 13 of 15 | 11 of 15 |
| Energy Efficiency (765) | XGBoost | Anik (Mac) | pending | | | | | |
| Concrete Strength (1005) | MLP | Paper (Table 1) | 0.004224 | 0.003064 | −26.9 % | 0.0010 | 15 of 15 | 15 of 15 |
| Concrete Strength (1005) | XGBoost | Paper (Table 1) | 0.002898 | 0.002559 | −12.2 % | 0.0100 | 15 of 15 | 14 of 15 |
| Concrete Strength (1005) | both | Samim | pending | | | | | |

On Energy Efficiency, Alvi's run agrees closely with the paper: the plain MLP error is identical on all 15 seeds, CRDA lowers error by −28.7 % (MLP) and −21.7 % (XGBoost) against the paper's −28.3 % and −21.0 %, and the same number of seeds improve (13 of 15) and pass the gate (12 and 11 of 15). The one difference is the plain XGBoost error, 3.6 % higher than the paper's (0.001003 vs 0.000968), the same Windows-only XGBoost gap we saw in the demo; CRDA's improvement on top of it is still within one point of the paper's. The `std` columns in the two `results.csv` files are not comparable (ours is a standard error over seeds, the authors' saved values are larger), so compare means only.

## How to read the columns

- **Change** is the `delta_mse` mean: the average of the 15 per-seed % changes. It is not the change between the two mean MSEs in the same row (for Alvi's MLP that would be −36.4 %).
- **Wilcoxon p (mean)** is the `p_wilcoxon` mean over seeds. Each seed's p compares its 10 cross-validation folds.
- **Seeds improved** counts seeds with `delta_mse` < 0; **Gate passed** counts seeds with `should_proceed = True`. Both are counted from `interim_results/*.csv`, for the paper rows too.

## Sources

- **Paper:** the authors' saved files in https://github.com/mhmohebbi/CRDA at `811e82ef29f34488384bffaa2fccf7775810345e`: `experiments/EnergyEfficiency/{mlp_20250520-084830,xgboost_20250520-143858}/` and `experiments/ConcreteCompressiveStrength/{mlp_20250520-054246,xgboost_20250520-125754}/`, rows `_sample_765` and `_sample_1005`.
- **Alvi:** `results/alvi-windows-ryzen7/EnergyEfficiency_n765_15seeds/{mlp_20261113-105745,xgboost_20261113-111427}/`.
- **Anik and Samim:** no `results-anik` or `results-samim` branch on GitHub yet (checked 13 Nov 2026).
- One machine and one dataset so far: the Energy Efficiency result is not an independent check until Anik repeats it, and Concrete Strength has no runs of ours yet.
