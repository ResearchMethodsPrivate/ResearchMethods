# CRDA demo results — Anik's laptop

**Verdict: PASS.** The authors' environment installed, the Energy Efficiency demo ran fully (exit code 0, `SUMMARY` lines printed), and the numbers match or are very close to the authors' recorded demo.

Run on 2026-10-22, 10:26:22–10:27:03 BST. Wall-clock time: **41 s** (MLP 11.69 s, XGBoost 8.77 s, plus imports and plotting).

## Results

One seed, Energy Efficiency dataset, with vs. without CRDA on the same split.

| Model | MSE without CRDA | MSE with CRDA | Change | Wilcoxon p | Gate passed |
|---|---|---|---|---|---|
| MLP | 0.00132 | 0.00064 | −51.7 % | 0.00098 | True |
| XGBoost | 0.00130 | 0.00093 | −28.5 % | 0.04199 | True |

Unrounded values from `results.csv`:

| Model | mse | aug_mse | delta_mse (%) | p_wilcoxon |
|---|---|---|---|---|
| MLP | 0.0013208531242431083 | 0.0006385091123391668 | −51.659340420226265 | 0.0009765625 |
| XGBoost | 0.001300772579836663 | 0.0009294087500910523 | −28.549481708189344 | 0.0419921875 |

## Comparison with the authors' recorded demo and with Alvi's run

| Model | Authors' recorded demo | Alvi (Windows 11, Py 3.11) | Anik (macOS 14.6.1, Py 3.11.5) |
|---|---|---|---|
| MLP | 0.00132 → 0.00064 (−51.7 %, p = 0.00098) | identical | **identical** (0.00132 → 0.00064, −51.7 %, p = 0.00098) |
| XGBoost | 0.00130 → 0.00093 (−28.6 %, p = 0.042) | 0.00127 → 0.00095 (−24.8 %, p = 0.032) | **close** (0.00130 → 0.00093, −28.5 %, p = 0.042) |

- **MLP:** identical to the authors' numbers at the precision they recorded.
- **XGBoost:** MSEs and p-value match at the recorded precision. The change prints as −28.5 % here against −28.6 % recorded, a 0.1 percentage-point gap that is consistent with rounding of the recorded MSEs. This run is closer to the authors' numbers than Alvi's.

## Environment

| Item | Value |
|---|---|
| OS | macOS 14.6.1 (build 23G93), arm64 |
| CPU / RAM / GPU | Apple M2 (8 logical cores) / 8.0 GB / integrated Apple M2 (demo is CPU-only) |
| Python | 3.11.5 (python.org build, `~/CRDA/.venv`) |
| torch | 2.7.0 |
| scikit-learn | 1.7.0rc1 |
| xgboost | 3.0.1 |
| Graphviz | `dot` 14.1.2 (conda-forge, via micromamba in `~/CRDA/.tools/gv`) |
| uv | 0.13.5 (installed with `pip` into `~/CRDA/.tools`) |
| Default `python` | not on PATH; `python3` was 3.13.2 before the test and now resolves to Homebrew 3.15.0 (neither used) |

## Checks

- `src/experiment.py` present after clone: yes.
- Install: worked, 11 s; versions exactly as the requirements pin.
- Demo exit code: 0. No traceback, no Graphviz error in the log.
- Both causal-graph PNGs (`causal_graphs/EnergyEfficiency_causal_graph.png`) and both `results.csv` files were created.
- Harmless noise only: NumPy `Degrees of freedom <= 0` warnings (single seed) and Matplotlib's one-time font-cache message.

## Anything odd / workarounds

- **Homebrew does not work for this setup.** macOS 14 is a Homebrew Tier 3 (unsupported) configuration, so `brew install graphviz uv` compiled dependencies from source and would have needed `llvm` and `rust` (hours). It was stopped after about 20 minutes; neither Graphviz nor `uv` came from Homebrew.
- **Side effect of that stopped run:** about 50 dependency formulae were left installed (e.g. `python@3.15`, `glib`, `cairo`), and `/opt/homebrew/bin/python3` now points to 3.15.0 instead of 3.13.2. Nothing was removed. It does not affect the test.
- **Python 3.11** came from the python.org install already on the machine (`/Library/Frameworks/Python.framework/Versions/3.11`), not from a `uv` download.
- **Graphviz** came from conda-forge via micromamba 2.9.0 (osx-arm64, 6.6 MB, from micro.mamba.pm), downloaded with Anik's approval. `PATH` was prefixed with `~/CRDA/.tools/gv/bin` for the demo run only; no shell profile or global setting was changed.
- Only `demo/run_demo.py` (exact content from the instructions) was added to the authors' repo. The demo's own output went to `demo/EnergyEfficiency/` and `demo/demo-run.log`; `demo/run-timing.txt` was also added to record timing. Nothing was committed or pushed.

## What this does and does not show

- **Shows:** the authors' pinned environment installs on this machine and their demo runs end to end, and how close the numbers come to the ones the authors recorded.
- **Does not show:** that the paper's headline results (Table 1: −22.9 % MSE for MLPs, −6.4 % for XGBoost) reproduce. The demo is one seed on one dataset; that is Week 6–8 work.

## Files

- Log: `~/CRDA/demo/demo-run.log`
- Per-run outputs: `~/CRDA/demo/EnergyEfficiency/mlp_20261022-102642/` and `~/CRDA/demo/EnergyEfficiency/xgboost_20261022-102654/`
- Template-format report to send to Alvi: `~/CRDA_demo_report.md`
