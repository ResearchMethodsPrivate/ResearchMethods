# samim-windows-i7-13620h / ConcreteCompressiveStrength_n1005_plain_10model

The 10-model test: the plain model scored as the average of 10 cross-validation models, on the same seeds and splits, compared with the CRDA numbers from the finished run in `../ConcreteCompressiveStrength_n1005_15seeds/`. Only the plain model was re-computed.

- **Who:** Samim
- **Laptop:** Windows 11 Home build 26300, 13th Gen Intel Core i7-13620H (10 cores / 16 threads), 15.6 GB RAM
- **Date:** 16 Nov 2026, 17:40–17:50 UTC
- **Python and libraries:** Python 3.11.18, torch 2.7.0+cpu, scikit-learn 1.7.0rc1, xgboost 3.0.1
- **Authors' code:** https://github.com/mhmohebbi/CRDA at `811e82ef29f34488384bffaa2fccf7775810345e`, unmodified. Added only `demo/run_plain_ensemble.py`, copied from `results/scripts/run_plain_ensemble.py`.
- **Settings:** `ConcreteCompressiveStrength`, 1005 rows, the seeds and splits read from the finished run's `interim_results` csv, 10-fold cross-validation on the original training data.

## Commands run

The reference csv paths in the group repo are 300 and 304 characters, over the Windows 260-character limit, so CPython raised `FileNotFoundError` on them in place. They were copied byte-for-byte to short paths under `~/CRDA/ours/ref/`, and those copies were passed to the script; it reads only `seed`, `mse` and `aug_mse` from them.

```
../.venv/Scripts/python.exe run_plain_ensemble.py mlp ConcreteCompressiveStrength 1005 "C:/Users/isami/CRDA/ours/ref/mlp_interim.csv" ../ours/plain_10model/mlp.csv
../.venv/Scripts/python.exe run_plain_ensemble.py xgboost ConcreteCompressiveStrength 1005 "C:/Users/isami/CRDA/ours/ref/xgb_interim.csv" ../ours/plain_10model/xgboost.csv
```

**Run time:** MLP 90 s, XGBoost 300 s (elapsed printed on the last seed line of each log).

## Setup check

```
mlp 15 seeds; single plain error reproduced on 15
xgboost 15 seeds; single plain error reproduced on 15
```

## Summary

```
mlp | 10 plain models averaged vs one plain model: mean -16.7% | CRDA vs one plain model: mean -24.2% | CRDA vs the 10-model plain average: mean -8.7% | CRDA beats the 10-model average on 14 of 15 seeds
xgboost | 10 plain models averaged vs one plain model: mean -14.4% | CRDA vs one plain model: mean -14.6% | CRDA vs the 10-model plain average: mean +0.0% | CRDA beats the 10-model average on 8 of 15 seeds
```

`mlp.csv`, `xgboost.csv` and the two run logs are copied unedited from the run.
