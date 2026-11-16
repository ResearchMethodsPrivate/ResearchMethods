# Anik: plain model scored as a 10-model average (Energy Efficiency, 765 rows, 15 seeds)

Runs `results/scripts/run_plain_ensemble.py`: for the same seeds, splits and tuned settings as my earlier Table 1 run (`../EnergyEfficiency_n765_15seeds/`), the plain model is also scored as the average of 10 cross-validation models, the way CRDA is scored. The CRDA numbers are read from that earlier run; only the plain model is re-computed.

- **Name:** Anik
- **Laptop:** Mac with Apple M2 (8 cores), 8 GB RAM, macOS 14.6.1 (arm64), CPU only
- **Date:** 16 Nov 2026 (runs at 17:32–17:35 GMT, including the failed first attempt)
- **Environment:** Python 3.11.5, torch 2.7.0, scikit-learn 1.7.0rc1, xgboost 3.0.1
- **Authors' code (`~/CRDA`):** commit `811e82ef29f34488384bffaa2fccf7775810345e`, unmodified; only `demo/run_plain_ensemble.py` was added (copied from `results/scripts/`)
- **Run time (wall clock, from `plain_10model_timing.txt`):** MLP 67 s, XGBoost 29 s

## Commands (from `~/CRDA/demo`)

```
MREF=$(ls ~/Downloads/ResearchMethods/results/anik-mac-m2/EnergyEfficiency_n765_15seeds/mlp_*/interim_results/*.csv)
DYLD_FALLBACK_LIBRARY_PATH=~/CRDA/.venv/lib/python3.11/site-packages/sklearn/.dylibs ../.venv/bin/python run_plain_ensemble.py mlp EnergyEfficiency 765 "$MREF" ../ours/plain_10model/mlp.csv 2>&1 | tee ../ours/plain_10model_mlp.log

XREF=$(ls ~/Downloads/ResearchMethods/results/anik-mac-m2/EnergyEfficiency_n765_15seeds/xgboost_*/interim_results/*.csv)
DYLD_FALLBACK_LIBRARY_PATH=~/CRDA/.venv/lib/python3.11/site-packages/sklearn/.dylibs ../.venv/bin/python run_plain_ensemble.py xgboost EnergyEfficiency 765 "$XREF" ../ours/plain_10model/xgboost.csv 2>&1 | tee ../ours/plain_10model_xgboost.log
```

(The group repo is at `~/Downloads/ResearchMethods` on this Mac, not `~/ResearchMethods`.)

## What went wrong, and the workaround

The first MLP attempt failed after 1 second (`plain_10model_mlp_attempt1_libomp_error.log`):

> `xgboost.core.XGBoostError: XGBoost Library (libxgboost.dylib) could not be loaded. ... Library not loaded: @rpath/libomp.dylib`

`libxgboost.dylib` looks for `libomp.dylib` in `/opt/homebrew/opt/libomp/lib`, and that folder no longer exists on this Mac. The XGBoost Table 1 run of 13 Nov worked, so it was there then; I do not know what removed it. Workaround: for these two runs only, `DYLD_FALLBACK_LIBRARY_PATH` pointed at the `libomp.dylib` that scikit-learn bundles in the same environment (compatibility version 5.0.0, the same as xgboost expects). No file in `~/CRDA` or the environment was changed, and nothing was installed. The check below shows the single plain error still matches the earlier run on every seed.

## Check: single plain error reproduced (step 5)

```
mlp 15 seeds; single plain error reproduced on 15
xgboost 15 seeds; single plain error reproduced on 15
```

## Summary (step 6)

```
mlp | 10 plain models averaged vs one plain model: mean +0.1% | CRDA vs one plain model: mean -32.2% | CRDA vs the 10-model plain average: mean -29.7% | CRDA beats the 10-model average on 14 of 15 seeds
xgboost | 10 plain models averaged vs one plain model: mean -12.9% | CRDA vs one plain model: mean -18.2% | CRDA vs the 10-model plain average: mean -6.1% | CRDA beats the 10-model average on 10 of 15 seeds
```

## Files

- `mlp.csv`, `xgboost.csv`: one row per seed (`plain_single_mse`, `plain_single_mse_in_run`, `plain_10model_mse`, `crda_10model_mse`, and the three percentage columns)
- `plain_10model_mlp.log`, `plain_10model_xgboost.log`: logs of the successful runs
- `plain_10model_mlp_attempt1_libomp_error.log`: the failed first attempt
- `plain_10model_timing.txt`: start, end, exit code and seconds for each attempt
