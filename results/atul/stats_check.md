# Check of Samim's statistics

For each of Samim's four runs I re-ran the paired Wilcoxon signed-rank test on `mse` vs `aug_mse`, one pair per seed, from `interim_results/*.csv`, and compared it with `results/samim-windows-i7-13620h/stats.txt`.

**Method:** `scipy.stats.wilcoxon(mse, aug_mse)` with the defaults (two-sided, exact p-value: no ties or zero differences), scipy 1.16.0, Python 3.11. I also recounted the median change, seeds improved and gate passed from the same files.

| Run | Seeds | Median change (mine / Samim) | Improved (mine / Samim) | Gate passed (mine / Samim) | Paired Wilcoxon p (mine / Samim) | Match |
|---|---|---|---|---|---|---|
| Concrete Strength, MLP | 15 | −21.9 % / −21.9 % | 15 / 15 | 15 / 15 | 0.0000610 / 0.0000610 | Yes |
| Concrete Strength, XGBoost | 15 | −14.5 % / −14.5 % | 15 / 15 | 14 / 14 | 0.0000610 / 0.0000610 | Yes |
| Energy Efficiency, filter on, MLP | 13 | −36.1 % / −36.1 % | 11 / 11 | 13 / 13 | 0.00122 / 0.00122 | Yes |
| Energy Efficiency, filter on, XGBoost | 11 | −22.1 % / −22.1 % | 9 / 9 | 11 / 11 | 0.00977 / 0.00977 | Yes |

All four match Samim's `stats.txt` to the digits it prints (6.10352e-05, 6.10352e-05, 0.0012207, 0.00976562), and Alvi's recomputed values (0.000061, 0.000061, 0.00122, 0.00977).

## Notes

- **The two Concrete p-values are the smallest possible.** With 15 seeds that all improve, the exact two-sided p is 2 / 2¹⁵ = 0.000061, so the test cannot say more than "every seed improved".
- **Filter-on p-values use fewer seeds** (13 and 11), because the code dropped the seeds the filter rejected. They answer "did CRDA help on the seeds that survived?", not the 15-seed Table 1 question.
- **One claim in Samim's README needs correcting:** it says the filter "changes the plain-model baselines". On the 13 seeds the MLP filter-on run shares with Alvi's filter-off run, the plain MLP error is identical on every seed. The mean differs (0.000536 vs 0.000527) only because 2 seeds were dropped.
- This paired test across seeds is different from the `p_wilcoxon` column in `results.csv`, which tests the 10 cross-validation folds within each seed.

## Files

- `results/samim-windows-i7-13620h/ConcreteCompressiveStrength_n1005_15seeds/{mlp_20261116-150718,xgboost_20261116-152955}/interim_results/ConcreteCompressiveStrength_sample_1005_interim_results.csv`
- `results/samim-windows-i7-13620h/EnergyEfficiency_n765_15seeds_with_filter/{mlp_20261116-154300,xgboost_20261116-155905}/interim_results/EnergyEfficiency_sample_765_interim_results.csv`
- `results/samim-windows-i7-13620h/stats.txt`
